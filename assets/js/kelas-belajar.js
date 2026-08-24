const params = new URLSearchParams(location.search);
const classId = params.get("id");
let studentProfile = null;

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
    .select("id, title, description, position, lessons(id,title,content,position,estimated_minutes)")
    .eq("class_id", classId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (error) throw error;

  const lessonIds = modules.flatMap(m => (m.lessons || []).map(l => l.id));
  let progress = [];

  if (lessonIds.length) {
    const { data: rows, error: progressError } = await window.kabayanSupabase
      .from("lesson_progress")
      .select("lesson_id,status,completed_at")
      .in("lesson_id", lessonIds);

    if (progressError) throw progressError;
    progress = rows || [];
  }

  const progressMap = new Map(progress.map(p => [p.lesson_id, p]));
  const allLessons = modules.flatMap(m => m.lessons || []);
  const completed = allLessons.filter(l => progressMap.get(l.id)?.status === "completed").length;
  const percent = allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0;

  document.getElementById("progressText").textContent =
    `${completed} dari ${allLessons.length} checkpoint selesai`;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressBar").style.width = `${percent}%`;

  const host = document.getElementById("moduleList");

  if (!modules.length) {
    host.innerHTML = `<div class="empty">Materi belum diterbitkan oleh pengajar.</div>`;
    return;
  }

  host.innerHTML = modules.map(module => {
    const lessons = (module.lessons || []).sort((a,b) => a.position - b.position);
    return `
      <article class="learning-module">
        <div class="eyebrow">Modul ${module.position}</div>
        <h2>${escapeHtml(module.title)}</h2>
        <p>${escapeHtml(module.description || "")}</p>

        <div class="checkpoint-list">
          ${lessons.map(lesson => {
            const done = progressMap.get(lesson.id)?.status === "completed";
            return `
              <button class="checkpoint ${done ? "done" : ""}"
                      data-lesson-id="${lesson.id}"
                      data-title="${escapeAttr(lesson.title)}"
                      data-content="${escapeAttr(lesson.content || "")}">
                <span class="checkpoint-index">${done ? "✓" : lesson.position}</span>
                <span>
                  <strong>${escapeHtml(lesson.title)}</strong>
                  <small>${done ? "Selesai" : "Belum selesai"}</small>
                </span>
              </button>
            `;
          }).join("")}
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".checkpoint").forEach(btn => {
    btn.addEventListener("click", () => openLesson(btn.dataset));
  });
}

function openLesson(data) {
  document.getElementById("lessonTitle").textContent = data.title;
  document.getElementById("lessonContent").textContent =
    data.content || "Materi belum diisi. Pada tahap berikutnya editor materi akan ditambahkan.";
  document.getElementById("completeLessonBtn").dataset.lessonId = data.lessonId;
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
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[s]);
}

function escapeAttr(str = "") {
  return escapeHtml(str).replace(/\n/g, "&#10;");
}
