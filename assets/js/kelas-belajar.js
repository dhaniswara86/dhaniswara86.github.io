const params = new URLSearchParams(location.search);
const classId = params.get("id");
let studentProfile = null;
let lessonCache = new Map();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    studentProfile = await window.KabayanAuth.requireRole("student");
    if (!classId) {
      location.replace("peserta-dashboard.html");
      return;
    }
    await loadClassLearning();
  } catch (err) {
    console.error(err);
  }
});

async function loadClassLearning() {
  const { data: cls, error: classError } = await window.kabayanSupabase
    .from("classes")
    .select("id, name, description, status")
    .eq("id", classId)
    .single();

  if (classError) throw classError;

  document.getElementById("className").textContent = cls.name;
  document.getElementById("classDescription").textContent = cls.description || "";

  const { data: modules, error } = await window.kabayanSupabase
    .from("modules")
    .select("id, title, description, position, lessons(id,title,content,position,estimated_minutes,is_published)")
    .eq("class_id", classId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) throw error;

  const publishedModules = (modules || []).map(module => ({
    ...module,
    lessons: (module.lessons || [])
      .filter(lesson => lesson.is_published)
      .sort((a, b) => a.position - b.position)
  }));

  lessonCache = new Map();
  publishedModules.forEach(module => {
    module.lessons.forEach(lesson => lessonCache.set(lesson.id, lesson));
  });

  const lessonIds = [...lessonCache.keys()];
  let progress = [];

  if (lessonIds.length) {
    const { data: rows, error: progressError } = await window.kabayanSupabase
      .from("lesson_progress")
      .select("lesson_id,status,completed_at")
      .in("lesson_id", lessonIds);

    if (progressError) throw progressError;
    progress = rows || [];
  }

  const { data: quizStatuses, error: quizStatusError } =
    await window.kabayanSupabase.rpc("get_class_quiz_statuses", {
      p_class_id: classId
    });

  if (quizStatusError) throw quizStatusError;

  const quizStatusMap = new Map(
    (quizStatuses || []).map(status => [status.module_id, status])
  );

  const progressMap = new Map(progress.map(p => [p.lesson_id, p]));
  const allLessons = [...lessonCache.values()];
  const completed = allLessons.filter(l => progressMap.get(l.id)?.status === "completed").length;
  const percent = allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0;

  document.getElementById("progressText").textContent =
    `${completed} dari ${allLessons.length} checkpoint selesai`;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;

  const host = document.getElementById("moduleList");

  if (!publishedModules.length) {
    host.innerHTML = `<div class="empty">Materi belum diterbitkan oleh pengajar.</div>`;
    return;
  }

  host.innerHTML = publishedModules.map(module => {
    const quiz = quizStatusMap.get(module.id);

    let quizCard = "";

    if (quiz) {
      let state = "locked";
      let eyebrow = "Kuis Modul";
      let title = quiz.quiz_title;
      let detail = `${quiz.question_count} soal · Nilai minimum ${quiz.pass_score}`;
      let action = "";

      if (quiz.passed) {
        state = "passed";
        eyebrow = "Kuis Selesai";
        detail = `Nilai terbaik ${quiz.best_score ?? 0} · Lulus`;
        action = `<span class="quiz-module-badge">✓ Lulus</span>`;
      } else if (!quiz.prerequisites_complete) {
        detail = `Selesaikan semua checkpoint terlebih dahulu · ${quiz.question_count} soal`;
        action = `<span class="quiz-module-badge locked">Terkunci</span>`;
      } else if (!quiz.can_start) {
        detail = quiz.max_attempts
          ? `Percobaan ${quiz.attempts_used}/${quiz.max_attempts} telah digunakan`
          : "Kuis belum dapat dimulai";
        action = `<span class="quiz-module-badge locked">Tidak tersedia</span>`;
      } else {
        state = "ready";
        eyebrow = quiz.attempts_used > 0 ? "Coba Lagi" : "Siap Dikerjakan";
        detail = `${quiz.question_count} soal · Nilai minimum ${quiz.pass_score}`;
        action = `
          <a
            class="btn small"
            href="kuis-modul.html?id=${encodeURIComponent(quiz.quiz_id)}&class_id=${encodeURIComponent(classId)}">
            ${quiz.attempts_used > 0 ? "Coba lagi" : "Mulai kuis"}
          </a>`;
      }

      quizCard = `
        <div class="quiz-module-card ${state}">
          <div>
            <div class="eyebrow">${eyebrow}</div>
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(detail)}</span>
          </div>
          ${action}
        </div>`;
    }

    return `
      <article class="learning-module">
        <div class="eyebrow">Modul ${module.position}</div>
        <h2>${escapeHtml(module.title)}</h2>
        <p>${escapeHtml(module.description || "")}</p>

        <div class="checkpoint-list">
          ${module.lessons.length ? module.lessons.map(lesson => {
            const done = progressMap.get(lesson.id)?.status === "completed";
            return `
              <button class="checkpoint ${done ? "done" : ""}" data-lesson-id="${lesson.id}">
                <span class="checkpoint-index">${done ? "✓" : lesson.position}</span>
                <span>
                  <strong>${escapeHtml(lesson.title)}</strong>
                  <small>
                    ${done ? "Selesai" : "Belum selesai"}
                    ${lesson.estimated_minutes ? ` · ${lesson.estimated_minutes} menit` : ""}
                  </small>
                </span>
              </button>
            `;
          }).join("") : `<div class="empty small">Belum ada checkpoint yang diterbitkan.</div>`}
        </div>

        ${quizCard}
      </article>
    `;
  }).join("");

  document.querySelectorAll(".checkpoint").forEach(btn => {
    btn.addEventListener("click", () => openLesson(btn.dataset.lessonId));
  });
}

function openLesson(lessonId) {
  const lesson = lessonCache.get(lessonId);
  if (!lesson) return;

  document.getElementById("lessonTitle").textContent = lesson.title;
  document.getElementById("lessonMeta").textContent =
    lesson.estimated_minutes
      ? `Estimasi belajar ${lesson.estimated_minutes} menit`
      : "";

  const rawContent = lesson.content?.trim()
    ? lesson.content
    : "Materi belum diisi oleh pengajar.";

  let rendered = "";

  try {
    rendered = window.marked
      ? window.marked.parse(rawContent)
      : `<p>${escapeHtml(rawContent)}</p>`;

    if (window.DOMPurify) {
      rendered = window.DOMPurify.sanitize(rendered);
    }
  } catch (error) {
    rendered = `<p>${escapeHtml(rawContent)}</p>`;
  }

  document.getElementById("lessonContent").innerHTML = rendered;
  document.getElementById("completeLessonBtn").dataset.lessonId = lessonId;
  document.getElementById("lessonModal").showModal();
}

document.getElementById("completeLessonBtn")?.addEventListener("click", async (e) => {
  const lessonId = e.currentTarget.dataset.lessonId;
  if (!lessonId) return;

  const now = new Date().toISOString();

  const { error } = await window.kabayanSupabase
    .from("lesson_progress")
    .upsert({
      user_id: studentProfile.id,
      lesson_id: lessonId,
      status: "completed",
      started_at: now,
      completed_at: now
    }, {
      onConflict: "user_id,lesson_id"
    });

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("lessonModal").close();
  await loadClassLearning();
});

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[s]);
}
