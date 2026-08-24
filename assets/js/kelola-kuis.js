const params = new URLSearchParams(location.search);
const moduleId = params.get("module_id");

let currentModule = null;
let currentQuiz = null;
let questionCache = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.KabayanAuth.requireRole("teacher");

    if (!moduleId) {
      location.replace("pengajar-dashboard.html");
      return;
    }

    bindQuestionModal();
    await loadModule();
    await loadQuiz();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

async function loadModule() {
  const { data, error } = await window.kabayanSupabase
    .from("modules")
    .select("id,class_id,title,description,position,classes(id,name)")
    .eq("id", moduleId)
    .single();

  if (error) throw error;

  currentModule = data;

  document.getElementById("moduleEyebrow").textContent = `Kuis Modul ${data.position}`;
  document.getElementById("moduleTitle").textContent = data.title;
  document.getElementById("moduleDescription").textContent =
    data.description || "Kelola evaluasi untuk modul ini.";

  document.getElementById("backToClass").href =
    `kelola-kelas.html?id=${encodeURIComponent(data.class_id)}`;
}

async function loadQuiz() {
  let { data, error } = await window.kabayanSupabase
    .from("quizzes")
    .select("id,module_id,title,description,pass_score,max_attempts,is_published")
    .eq("module_id", moduleId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const { data: created, error: createError } = await window.kabayanSupabase
      .from("quizzes")
      .insert({
        module_id: moduleId,
        title: `Kuis Modul ${currentModule.position} — ${currentModule.title}`,
        description: "Uji pemahaman setelah menyelesaikan seluruh checkpoint pada modul ini.",
        pass_score: 70,
        max_attempts: 3,
        is_published: false
      })
      .select("id,module_id,title,description,pass_score,max_attempts,is_published")
      .single();

    if (createError) throw createError;
    data = created;
  }

  currentQuiz = data;

  const form = document.getElementById("quizSettingsForm");
  form.title.value = data.title || "";
  form.description.value = data.description || "";
  form.pass_score.value = data.pass_score ?? 70;
  form.max_attempts.value = data.max_attempts ?? "";
  form.is_published.checked = !!data.is_published;

  await loadQuestions();
}

document.getElementById("quizSettingsForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.getElementById("quizSettingsStatus");

  status.textContent = "Menyimpan pengaturan...";
  status.className = "form-status";

  const maxAttempts = form.max_attempts.value.trim();

  const { error } = await window.kabayanSupabase
    .from("quizzes")
    .update({
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      pass_score: Number(form.pass_score.value),
      max_attempts: maxAttempts ? Number(maxAttempts) : null,
      is_published: form.is_published.checked
    })
    .eq("id", currentQuiz.id);

  if (error) {
    status.textContent = error.message;
    status.className = "form-status error";
    return;
  }

  status.textContent = "Pengaturan kuis berhasil disimpan.";
  status.className = "form-status success";

  await loadQuiz();
});

async function loadQuestions() {
  const host = document.getElementById("questionList");
  host.innerHTML = `<div class="empty">Memuat bank soal...</div>`;

  const { data, error } = await window.kabayanSupabase
    .from("quiz_questions")
    .select(`
      id,
      quiz_id,
      question_text,
      explanation,
      position,
      is_active,
      quiz_options(id,option_text,position,is_correct)
    `)
    .eq("quiz_id", currentQuiz.id)
    .order("position", { ascending: true });

  if (error) {
    host.innerHTML = `<div class="empty error-text">${escapeHtml(error.message)}</div>`;
    return;
  }

  questionCache = (data || []).map(question => ({
    ...question,
    quiz_options: (question.quiz_options || []).sort((a, b) => a.position - b.position)
  }));

  const activeCount = questionCache.filter(q => q.is_active).length;
  document.getElementById("questionCount").textContent = activeCount;

  if (!questionCache.length) {
    host.innerHTML = `
      <div class="empty">
        <strong>Belum ada soal.</strong>
        <span>Tambahkan soal pertama untuk kuis modul ini.</span>
      </div>`;
    return;
  }

  host.innerHTML = questionCache.map(question => {
    const correct = question.quiz_options.find(option => option.is_correct);

    return `
      <article class="quiz-admin-question">
        <div class="quiz-admin-question-number">${question.position}</div>
        <div class="quiz-admin-question-main">
          <div class="quiz-admin-question-top">
            <strong>${escapeHtml(question.question_text)}</strong>
            <span class="pill ${question.is_active ? "success-pill" : ""}">
              ${question.is_active ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <div class="quiz-admin-answer">
            Jawaban benar:
            <strong>${correct ? escapeHtml(correct.option_text) : "Belum ditentukan"}</strong>
          </div>
          ${question.explanation ? `
            <p>${escapeHtml(question.explanation)}</p>
          ` : ""}
        </div>
        <button
          class="btn ghost small editQuestionBtn"
          type="button"
          data-question-id="${question.id}">
          Edit
        </button>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".editQuestionBtn").forEach(button => {
    button.addEventListener("click", () => openQuestionModal(button.dataset.questionId));
  });
}

document.getElementById("addQuestionBtn")?.addEventListener("click", () => {
  openQuestionModal();
});

function bindQuestionModal() {
  const modal = document.getElementById("questionModal");

  document.getElementById("closeQuestionBtn")?.addEventListener("click", () => modal.close());
  document.getElementById("cancelQuestionBtn")?.addEventListener("click", () => modal.close());

  document.getElementById("questionForm")?.addEventListener("submit", saveQuestion);
}

function openQuestionModal(questionId = null) {
  const modal = document.getElementById("questionModal");
  const form = document.getElementById("questionForm");
  const status = document.getElementById("questionStatus");

  form.reset();
  form.question_id.value = "";
  form.position.value = questionCache.length + 1;
  form.is_active.checked = true;
  status.textContent = "";
  status.className = "form-status";

  if (!questionId) {
    document.getElementById("questionModalTitle").textContent = "Tambah soal";
    modal.showModal();
    return;
  }

  const question = questionCache.find(item => item.id === questionId);
  if (!question) return;

  document.getElementById("questionModalTitle").textContent = "Edit soal";

  form.question_id.value = question.id;
  form.question_text.value = question.question_text || "";
  form.explanation.value = question.explanation || "";
  form.position.value = question.position || 1;
  form.is_active.checked = !!question.is_active;

  for (let position = 1; position <= 4; position++) {
    const option = question.quiz_options.find(item => item.position === position);
    form[`option_${position}`].value = option?.option_text || "";

    if (option?.is_correct) {
      form.correct_option.value = String(position);
    }
  }

  modal.showModal();
}

async function saveQuestion(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.getElementById("questionStatus");
  const questionId = form.question_id.value || null;
  const correctPosition = Number(form.correct_option.value);

  status.textContent = "Menyimpan soal...";
  status.className = "form-status";

  try {
    let savedQuestionId = questionId;

    if (!savedQuestionId) {
      const { data, error } = await window.kabayanSupabase
        .from("quiz_questions")
        .insert({
          quiz_id: currentQuiz.id,
          question_text: form.question_text.value.trim(),
          explanation: form.explanation.value.trim(),
          position: Number(form.position.value),
          is_active: form.is_active.checked
        })
        .select("id")
        .single();

      if (error) throw error;
      savedQuestionId = data.id;

      const optionRows = [1, 2, 3, 4].map(position => ({
        question_id: savedQuestionId,
        option_text: form[`option_${position}`].value.trim(),
        position,
        is_correct: position === correctPosition
      }));

      const { error: optionError } = await window.kabayanSupabase
        .from("quiz_options")
        .insert(optionRows);

      if (optionError) throw optionError;
    } else {
      const existing = questionCache.find(item => item.id === savedQuestionId);

      const { error } = await window.kabayanSupabase
        .from("quiz_questions")
        .update({
          question_text: form.question_text.value.trim(),
          explanation: form.explanation.value.trim(),
          position: Number(form.position.value),
          is_active: form.is_active.checked
        })
        .eq("id", savedQuestionId);

      if (error) throw error;

      // Turn off current correct flag first to satisfy one-correct-answer index.
      const { error: resetError } = await window.kabayanSupabase
        .from("quiz_options")
        .update({ is_correct: false })
        .eq("question_id", savedQuestionId);

      if (resetError) throw resetError;

      for (let position = 1; position <= 4; position++) {
        const option = existing?.quiz_options.find(item => item.position === position);
        const optionText = form[`option_${position}`].value.trim();

        if (option) {
          const { error: optionUpdateError } = await window.kabayanSupabase
            .from("quiz_options")
            .update({
              option_text: optionText,
              is_correct: position === correctPosition
            })
            .eq("id", option.id);

          if (optionUpdateError) throw optionUpdateError;
        } else {
          const { error: optionInsertError } = await window.kabayanSupabase
            .from("quiz_options")
            .insert({
              question_id: savedQuestionId,
              option_text: optionText,
              position,
              is_correct: position === correctPosition
            });

          if (optionInsertError) throw optionInsertError;
        }
      }
    }

    status.textContent = "Soal berhasil disimpan.";
    status.className = "form-status success";

    await loadQuestions();

    setTimeout(() => {
      document.getElementById("questionModal").close();
    }, 450);
  } catch (error) {
    status.textContent = error.message;
    status.className = "form-status error";
  }
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}
