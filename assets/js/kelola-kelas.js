const params = new URLSearchParams(location.search);
const classId = params.get("id");
let currentClass = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.KabayanAuth.requireRole("teacher");

    if (!classId) {
      location.replace("pengajar-dashboard.html");
      return;
    }

    await Promise.all([
      loadClass(),
      loadMembers(),
      loadModules()
    ]);
  } catch (err) {
    console.error(err);
  }
});

async function loadClass() {
  const { data, error } = await window.kabayanSupabase
    .from("classes")
    .select("id, name, description, status, start_date, end_date")
    .eq("id", classId)
    .single();

  if (error) throw error;
  currentClass = data;

  document.getElementById("className").textContent = data.name;
  document.getElementById("classDescription").textContent =
    data.description || "Belum ada deskripsi.";
  document.getElementById("classStatus").textContent =
    ({draft:"Draft", active:"Aktif", closed:"Ditutup"})[data.status] || data.status;
}

async function loadMembers() {
  const host = document.getElementById("memberList");
  host.innerHTML = `<div class="empty">Memuat peserta...</div>`;

  const { data, error } = await window.kabayanSupabase
    .from("class_members")
    .select("id, user_id, is_active, joined_at, profiles!class_members_user_id_fkey(full_name,email)")
    .eq("class_id", classId)
    .order("joined_at", { ascending: true });

  if (error) {
    host.innerHTML = `<div class="empty error-text">${escapeHtml(error.message)}</div>`;
    return;
  }

  document.getElementById("memberCount").textContent = data.length;

  if (!data.length) {
    host.innerHTML = `<div class="empty">Belum ada peserta di kelas ini.</div>`;
    return;
  }

  host.innerHTML = data.map(row => `
    <div class="list-row">
      <div>
        <strong>${escapeHtml(row.profiles?.full_name || "Peserta")}</strong>
        <span>${escapeHtml(row.profiles?.email || "")}</span>
      </div>
      <span class="pill ${row.is_active ? "success-pill" : ""}">
        ${row.is_active ? "Aktif" : "Nonaktif"}
      </span>
    </div>
  `).join("");
}

document.getElementById("addStudentForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const status = document.getElementById("addStudentStatus");
  status.className = "form-status";
  status.textContent = "Menambahkan peserta...";

  const { error } = await window.kabayanSupabase.rpc("add_student_to_class", {
    p_class_id: classId,
    p_email: form.email.value.trim()
  });

  if (error) {
    status.textContent = error.message;
    status.className = "form-status error";
    return;
  }

  form.reset();
  status.textContent = "Peserta berhasil ditambahkan.";
  status.className = "form-status success";
  await loadMembers();
});

async function loadModules() {
  const host = document.getElementById("moduleList");
  host.innerHTML = `<div class="empty">Memuat materi...</div>`;

  const { data, error } = await window.kabayanSupabase
    .from("modules")
    .select("id, title, description, position, is_published, lessons(id,title,position,is_published)")
    .eq("class_id", classId)
    .order("position", { ascending: true });

  if (error) {
    host.innerHTML = `<div class="empty error-text">${escapeHtml(error.message)}</div>`;
    return;
  }

  if (!data.length) {
    host.innerHTML = `<div class="empty">Belum ada modul.</div>`;
    return;
  }

  host.innerHTML = data.map(module => {
    const lessons = (module.lessons || []).sort((a,b) => a.position - b.position);
    return `
      <article class="module-card">
        <div class="module-head">
          <div>
            <div class="eyebrow">Modul ${module.position}</div>
            <h3>${escapeHtml(module.title)}</h3>
            <p>${escapeHtml(module.description || "")}</p>
          </div>
          <span class="pill ${module.is_published ? "success-pill" : ""}">
            ${module.is_published ? "Terbit" : "Draft"}
          </span>
        </div>

        <div class="lesson-list">
          ${lessons.length ? lessons.map(lesson => `
            <div class="list-row compact">
              <div>
                <strong>${lesson.position}. ${escapeHtml(lesson.title)}</strong>
              </div>
              <span class="pill ${lesson.is_published ? "success-pill" : ""}">
                ${lesson.is_published ? "Terbit" : "Draft"}
              </span>
            </div>
          `).join("") : `<div class="empty small">Belum ada materi dalam modul ini.</div>`}
        </div>

        <form class="inline-form addLessonForm" data-module-id="${module.id}">
          <input name="title" required placeholder="Judul materi/checkpoint">
          <input name="position" required type="number" min="1" value="${lessons.length + 1}" aria-label="Urutan">
          <label class="checkline">
            <input type="checkbox" name="is_published">
            Terbitkan
          </label>
          <button class="btn secondary" type="submit">Tambah materi</button>
        </form>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".addLessonForm").forEach(form => {
    form.addEventListener("submit", addLesson);
  });
}

document.getElementById("addModuleForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const status = document.getElementById("addModuleStatus");
  status.textContent = "Menambah modul...";

  const { error } = await window.kabayanSupabase
    .from("modules")
    .insert({
      class_id: classId,
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      position: Number(form.position.value),
      is_published: form.is_published.checked
    });

  if (error) {
    status.textContent = error.message;
    status.className = "form-status error";
    return;
  }

  form.reset();
  form.position.value = 1;
  status.textContent = "Modul berhasil ditambahkan.";
  status.className = "form-status success";
  await loadModules();
});

async function addLesson(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const moduleId = form.dataset.moduleId;

  const { error } = await window.kabayanSupabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      title: form.title.value.trim(),
      position: Number(form.position.value),
      is_published: form.is_published.checked,
      content: ""
    });

  if (error) {
    alert(error.message);
    return;
  }

  await loadModules();
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[s]);
}
