const params = new URLSearchParams(location.search);
const quizId = params.get("id");
const classId = params.get("class_id");

let quizData = null;
let currentIndex = 0;
let saving = false;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.KabayanAuth.requireRole("student");

    if (!quizId) {
      throw new Error("ID kuis tidak ditemukan.");
    }

    document.getElementById("backToClassBtn").href =
      classId
        ? `kelas-belajar.html?id=${encodeURIComponent(classId)}`
        : "peserta-dashboard.html";

    await startQuiz();
  } catch (error) {
    showError(error.message);
  }
});

async function startQuiz() {
  const { data, error } = await window.kabayanSupabase.rpc("start_quiz_attempt", {
    p_quiz_id: quizId
  });

  if (error) throw error;

  quizData = data;

  if (!quizData?.questions?.length) {
    throw new Error("Kuis belum memiliki soal.");
  }

  document.getElementById("quizLoading").classList.add("hidden");
  document.getElementById("quizWorkspace").classList.remove("hidden");

  document.getElementById("quizTitle").textContent = quizData.title;
  document.getElementById("quizDescription").textContent = quizData.description || "";
  document.getElementById("quizPassScore").textContent = quizData.pass_score;
  document.getElementById("quizAttemptLabel").textContent =
    `Percobaan ${quizData.attempt_no}${quizData.max_attempts ? ` dari ${quizData.max_attempts}` : ""}`;

  const firstUnanswered = quizData.questions.findIndex(
    question => !question.selected_option_id
  );

  currentIndex = firstUnanswered >= 0 ? firstUnanswered : 0;

  renderQuestionNavigator();
  renderQuestion();
}

function renderQuestion() {
  const question = quizData.questions[currentIndex];
  const total = quizData.questions.length;
  const answered = quizData.questions.filter(item => item.selected_option_id).length;

  document.getElementById("questionNumber").textContent =
    `Soal ${currentIndex + 1} dari ${total}`;

  document.getElementById("questionText").textContent = question.text;

  document.getElementById("quizProgressMini").textContent =
    `${answered}/${total} dijawab`;

  document.getElementById("quizProgressBar").style.width =
    `${Math.round(((currentIndex + 1) / total) * 100)}%`;

  document.getElementById("saveStatus").textContent =
    question.selected_option_id ? "Jawaban tersimpan" : "Belum dijawab";

  const optionsHost = document.getElementById("optionList");

  optionsHost.innerHTML = question.options.map((option, optionIndex) => `
    <label class="quiz-option ${question.selected_option_id === option.id ? "selected" : ""}">
      <input
        type="radio"
        name="quiz_option"
        value="${option.id}"
        ${question.selected_option_id === option.id ? "checked" : ""}>
      <span class="quiz-option-letter">${String.fromCharCode(65 + optionIndex)}</span>
      <span>${escapeHtml(option.text)}</span>
    </label>
  `).join("");

  optionsHost.querySelectorAll('input[name="quiz_option"]').forEach(input => {
    input.addEventListener("change", () => selectOption(input.value));
  });

  document.getElementById("prevQuestionBtn").disabled = currentIndex === 0;

  const isLast = currentIndex === total - 1;

  document.getElementById("nextQuestionBtn").classList.toggle("hidden", isLast);
  document.getElementById("submitQuizBtn").classList.toggle("hidden", !isLast);

  document.getElementById("submitQuizBtn").disabled =
    answered < total;

  renderQuestionNavigator();
}

async function selectOption(optionId) {
  if (saving) return;

  const question = quizData.questions[currentIndex];

  saving = true;
  document.getElementById("saveStatus").textContent = "Menyimpan...";

  const { error } = await window.kabayanSupabase.rpc("save_quiz_answer", {
    p_attempt_id: quizData.attempt_id,
    p_question_id: question.id,
    p_option_id: optionId
  });

  saving = false;

  if (error) {
    document.getElementById("saveStatus").textContent = "Gagal menyimpan";
    alert(error.message);
    return;
  }

  question.selected_option_id = optionId;

  document.getElementById("saveStatus").textContent = "Jawaban tersimpan";

  renderQuestion();
}

document.getElementById("prevQuestionBtn")?.addEventListener("click", () => {
  if (currentIndex <= 0) return;
  currentIndex -= 1;
  renderQuestion();
});

document.getElementById("nextQuestionBtn")?.addEventListener("click", () => {
  if (currentIndex >= quizData.questions.length - 1) return;
  currentIndex += 1;
  renderQuestion();
});

document.getElementById("submitQuizBtn")?.addEventListener("click", async () => {
  const unanswered = quizData.questions.filter(question => !question.selected_option_id);

  if (unanswered.length) {
    alert(`Masih ada ${unanswered.length} soal yang belum dijawab.`);
    currentIndex = quizData.questions.findIndex(question => !question.selected_option_id);
    renderQuestion();
    return;
  }

  if (!confirm("Kirim seluruh jawaban dan lihat hasil kuis?")) {
    return;
  }

  const button = document.getElementById("submitQuizBtn");
  button.disabled = true;
  button.textContent = "Menilai...";

  const { data, error } = await window.kabayanSupabase.rpc("submit_quiz_attempt", {
    p_attempt_id: quizData.attempt_id
  });

  if (error) {
    button.disabled = false;
    button.textContent = "Kirim jawaban";
    alert(error.message);
    return;
  }

  renderResult(data);
});

function renderQuestionNavigator() {
  const host = document.getElementById("questionNavigator");

  host.innerHTML = quizData.questions.map((question, index) => `
    <button
      type="button"
      class="quiz-nav-dot
        ${index === currentIndex ? "active" : ""}
        ${question.selected_option_id ? "answered" : ""}"
      data-index="${index}">
      ${index + 1}
    </button>
  `).join("");

  host.querySelectorAll(".quiz-nav-dot").forEach(button => {
    button.addEventListener("click", () => {
      currentIndex = Number(button.dataset.index);
      renderQuestion();
    });
  });
}

function renderResult(result) {
  document.getElementById("quizWorkspace").classList.add("hidden");

  const resultHost = document.getElementById("quizResult");
  resultHost.classList.remove("hidden");

  const review = result.review || [];
  const reviewAvailable = result.review_available !== false;
  const isFinal = params.get("final") === "1";

  const resultTitle = isFinal
    ? (result.passed
        ? "Evaluasi Akhir selesai."
        : "Nilai belum mencapai batas kelulusan.")
    : (result.passed
        ? "Kuis modul selesai."
        : "Pelajari kembali modul ini.");

  const actionLabel = result.passed
    ? "Lanjut ke kelas"
    : (isFinal ? "Kembali ke kelas" : "Kembali ke materi");

  const reviewSection = reviewAvailable
    ? `
      <section class="quiz-review">
        <div class="section-head">
          <div>
            <h2>Pembahasan</h2>
            <p>Gunakan pembahasan ini untuk memahami alasan setiap jawaban.</p>
          </div>
        </div>

        ${review.map((item, index) => `
          <article class="surface quiz-review-item ${item.is_correct ? "correct" : "wrong"}">
            <div class="quiz-review-head">
              <span>Soal ${index + 1}</span>
              <strong>${item.is_correct ? "Benar" : "Belum tepat"}</strong>
            </div>

            <h3>${escapeHtml(item.question)}</h3>

            <div class="quiz-review-grid">
              <div>
                <span>Jawaban Anda</span>
                <strong>${escapeHtml(item.selected_answer || "-")}</strong>
              </div>

              <div>
                <span>Jawaban benar</span>
                <strong>${escapeHtml(item.correct_answer || "-")}</strong>
              </div>
            </div>

            ${item.explanation ? `
              <p>${escapeHtml(item.explanation)}</p>
            ` : ""}
          </article>
        `).join("")}
      </section>
    `
    : `
      <section class="surface quiz-review-locked">
        <div class="eyebrow">Evaluasi Akhir</div>
        <h2>Pembahasan belum dibuka.</h2>
        <p>
          Anda masih mempunyai satu kesempatan berikutnya.
          Kunci jawaban disembunyikan agar percobaan selanjutnya tetap objektif.
        </p>
      </section>
    `;

  resultHost.innerHTML = `
    <section class="surface quiz-result-hero ${result.passed ? "passed" : "failed"}">
      <div class="eyebrow">${result.passed ? "Lulus" : "Belum Lulus"}</div>
      <div class="quiz-result-score">${result.score}</div>
      <h1>${resultTitle}</h1>
      <p>
        ${result.correct} dari ${result.total} jawaban benar.
        Nilai minimum kelulusan ${result.pass_score}.
      </p>

      <div class="quiz-result-actions">
        <a
          class="btn"
          href="${classId ? `kelas-belajar.html?id=${encodeURIComponent(classId)}` : "peserta-dashboard.html"}">
          ${actionLabel}
        </a>
      </div>
    </section>

    ${reviewSection}
  `;
}

function showError(message) {
  document.getElementById("quizLoading")?.classList.add("hidden");
  document.getElementById("quizWorkspace")?.classList.add("hidden");
  document.getElementById("quizResult")?.classList.add("hidden");

  const errorSection = document.getElementById("quizError");
  errorSection.classList.remove("hidden");
  document.getElementById("quizErrorMessage").textContent = message || "Terjadi kesalahan.";
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
