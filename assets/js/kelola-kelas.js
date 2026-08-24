const params = new URLSearchParams(location.search);
const classId = params.get("id");
let currentClass = null;
let moduleCache = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.KabayanAuth.requireRole("teacher");

    if (!classId) {
      location.replace("pengajar-dashboard.html");
      return;
    }

    bindEditorControls();

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
    ({ draft: "Draft", active: "Aktif", closed: "Ditutup" })[data.status] || data.status;
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
    .select("id, title, description, position, is_published, lessons(id,title,content,position,is_published,estimated_minutes)")
    .eq("class_id", classId)
    .order("position", { ascending: true });

  if (error) {
    host.innerHTML = `<div class="empty error-text">${escapeHtml(error.message)}</div>`;
    return;
  }

  moduleCache = data || [];

  if (!data.length) {
    host.innerHTML = `<div class="empty">Belum ada modul.</div>`;
    return;
  }

  host.innerHTML = data.map(module => {
    const lessons = (module.lessons || []).sort((a, b) => a.position - b.position);

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
            <div class="lesson-admin-row">
              <div class="lesson-admin-info">
                <strong>${lesson.position}. ${escapeHtml(lesson.title)}</strong>
                <span>
                  ${lesson.content?.trim() ? "Materi sudah diisi" : "Isi materi masih kosong"}
                  ${lesson.estimated_minutes ? ` · ${lesson.estimated_minutes} menit` : ""}
                </span>
              </div>

              <div class="lesson-admin-actions">
                <span class="pill ${lesson.is_published ? "success-pill" : ""}">
                  ${lesson.is_published ? "Terbit" : "Draft"}
                </span>
                <button
                  class="btn ghost small editLessonBtn"
                  type="button"
                  data-lesson-id="${lesson.id}">
                  Edit materi
                </button>
              </div>
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

  document.querySelectorAll(".editLessonBtn").forEach(btn => {
    btn.addEventListener("click", () => openLessonEditor(btn.dataset.lessonId));
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

  const { data, error } = await window.kabayanSupabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      title: form.title.value.trim(),
      position: Number(form.position.value),
      is_published: form.is_published.checked,
      content: ""
    })
    .select("id")
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  await loadModules();

  if (data?.id) {
    openLessonEditor(data.id);
  }
}

function findLesson(lessonId) {
  for (const module of moduleCache) {
    const lesson = (module.lessons || []).find(item => item.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

function openLessonEditor(lessonId) {
  const lesson = findLesson(lessonId);
  if (!lesson) return;

  const form = document.getElementById("lessonEditorForm");
  form.lesson_id.value = lesson.id;
  form.title.value = lesson.title || "";
  form.position.value = lesson.position || 1;
  form.estimated_minutes.value = lesson.estimated_minutes || "";
  form.is_published.checked = !!lesson.is_published;
  form.content.value = lesson.content || "";

  document.getElementById("editorHeading").textContent = lesson.title || "Edit checkpoint";
  document.getElementById("lessonEditorStatus").textContent = "";
  document.getElementById("lessonEditorStatus").className = "form-status";

  document.getElementById("lessonEditorModal").showModal();
  setTimeout(() => form.title.focus(), 80);
}

function bindEditorControls() {
  const modal = document.getElementById("lessonEditorModal");
  const form = document.getElementById("lessonEditorForm");
  const textarea = document.getElementById("lessonContentInput");

  document.getElementById("closeEditorBtn")?.addEventListener("click", () => modal.close());
  document.getElementById("cancelEditorBtn")?.addEventListener("click", () => modal.close());

  document.querySelectorAll(".editor-toolbar button").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.wrap) {
        wrapSelection(textarea, btn.dataset.wrap);
      } else if (btn.dataset.insert) {
        insertAtCursor(textarea, btn.dataset.insert + "\n");
      } else if (btn.dataset.template === "table") {
        insertAtCursor(
          textarea,
          "\n| Keterangan | Nilai |\n|---|---:|\n| Contoh | Rp10.000.000 |\n"
        );
      } else if (btn.dataset.template === "example") {
        insertAtCursor(
          textarea,
          "\n## Contoh Perhitungan\n\n**Kasus:** Tuliskan kondisi kasus di sini.\n\n**Perhitungan:**\n\n1. Langkah pertama\n2. Langkah kedua\n3. Hasil perhitungan\n"
        );
      }
    });
  });

  form?.addEventListener("submit", saveLesson);
}

async function saveLesson(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const status = document.getElementById("lessonEditorStatus");
  const lessonId = form.lesson_id.value;

  status.textContent = "Menyimpan materi...";
  status.className = "form-status";

  const estimated = form.estimated_minutes.value.trim();

  const { error } = await window.kabayanSupabase
    .from("lessons")
    .update({
      title: form.title.value.trim(),
      position: Number(form.position.value),
      estimated_minutes: estimated ? Number(estimated) : null,
      is_published: form.is_published.checked,
      content: form.content.value
    })
    .eq("id", lessonId);

  if (error) {
    status.textContent = error.message;
    status.className = "form-status error";
    return;
  }

  status.textContent = "Materi berhasil disimpan.";
  status.className = "form-status success";

  await loadModules();

  setTimeout(() => {
    document.getElementById("lessonEditorModal").close();
  }, 500);
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);

  textarea.value = before + text + after;
  const cursor = start + text.length;
  textarea.setSelectionRange(cursor, cursor);
  textarea.focus();
}

function wrapSelection(textarea, wrapper) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || "teks";

  textarea.value =
    textarea.value.slice(0, start) +
    wrapper +
    selected +
    wrapper +
    textarea.value.slice(end);

  textarea.setSelectionRange(
    start + wrapper.length,
    start + wrapper.length + selected.length
  );
  textarea.focus();
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[s]);
}
