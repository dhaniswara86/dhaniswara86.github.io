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
    bindModuleEditorControls();

    await Promise.all([
      loadClass(),
      loadMembers(),
      loadModules()
    ]);
  } catch (err) {
    console.error(err);
    alert(err.message);
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
  host.innerHTML = `<div class="empty small">Memuat peserta...</div>`;

  const { data, error } = await window.kabayanSupabase
    .from("class_members")
    .select("id, user_id, is_active, joined_at, profiles!class_members_user_id_fkey(full_name,email)")
    .eq("class_id", classId)
    .order("joined_at", { ascending: true });

  if (error) {
    host.innerHTML = `<div class="empty error-text">${escapeHtml(error.message)}</div>`;
    return;
  }

  const total = data.length;
  document.getElementById("memberCount").textContent = total;
  const countInline = document.getElementById("memberCountInline");
  if (countInline) countInline.textContent = total;

  if (!data.length) {
    host.innerHTML = `<div class="empty small">Belum ada peserta di kelas ini.</div>`;
    return;
  }

  host.innerHTML = data.map(row => `
    <div class="list-row member-row">
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
  host.innerHTML = `<div class="empty">Memuat modul...</div>`;

  const { data, error } = await window.kabayanSupabase
    .from("modules")
    .select("id, title, description, position, is_published, lessons(id,title,content,position,is_published,estimated_minutes)")
    .eq("class_id", classId)
    .order("position", { ascending: true });

  if (error) {
    host.innerHTML = `<div class="empty error-text">${escapeHtml(error.message)}</div>`;
    return;
  }

  moduleCache = (data || []).map(module => ({
    ...module,
    lessons: (module.lessons || []).sort((a, b) => a.position - b.position)
  }));

  if (!moduleCache.length) {
    host.innerHTML = `<div class="empty">Belum ada modul. Tambahkan modul pertama dari panel kanan.</div>`;
    return;
  }

  host.innerHTML = moduleCache.map(module => {
    const lessons = module.lessons || [];
    const filledLessons = lessons.filter(lesson => lesson.content?.trim()).length;
    const publishedLessons = lessons.filter(lesson => lesson.is_published).length;

    return `
      <article class="module-card redesign-module-card" id="module-${module.id}">
        <div class="module-topline">
          <div class="eyebrow">Modul ${module.position}</div>
          <span class="pill ${module.is_published ? "success-pill" : ""}">
            ${module.is_published ? "Modul Terbit" : "Modul Draft"}
          </span>
        </div>

        <div class="module-title-block">
          <h3>${escapeHtml(module.title)}</h3>
          <p>${escapeHtml(module.description || "Belum ada deskripsi modul.")}</p>
        </div>

        <div class="module-stats">
          <span>${filledLessons}/${lessons.length} materi terisi</span>
          <span>${publishedLessons}/${lessons.length} materi terbit</span>
        </div>

        <div class="module-toolbar">
          <button
            class="btn ghost small editModuleBtn"
            type="button"
            data-module-id="${module.id}">
            Edit modul
          </button>

          <button
            class="btn ${module.is_published ? "ghost" : "secondary"} small toggleModulePublishBtn"
            type="button"
            data-module-id="${module.id}">
            ${module.is_published ? "Jadikan Draft" : "Terbitkan modul"}
          </button>

          <button
            class="btn ghost small toggleModuleContentBtn"
            type="button"
            data-module-id="${module.id}"
            aria-expanded="true">
            Sembunyikan materi
          </button>

          <a
            class="btn ghost small"
            href="kelola-kuis.html?module_id=${encodeURIComponent(module.id)}">
            Kelola kuis
          </a>
        </div>

        <div class="module-manage-body" id="module-body-${module.id}">
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

          <form class="inline-form addLessonForm redesign-add-lesson-form" data-module-id="${module.id}">
            <input name="title" required placeholder="Judul materi / checkpoint">
            <input name="position" required type="number" min="1" value="${lessons.length + 1}" aria-label="Urutan">
            <label class="checkline">
              <input type="checkbox" name="is_published">
              Terbitkan
            </label>
            <button class="btn secondary" type="submit">Tambah materi</button>
          </form>
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".addLessonForm").forEach(form => {
    form.addEventListener("submit", addLesson);
  });

  document.querySelectorAll(".editLessonBtn").forEach(btn => {
    btn.addEventListener("click", () => openLessonEditor(btn.dataset.lessonId));
  });

  document.querySelectorAll(".editModuleBtn").forEach(btn => {
    btn.addEventListener("click", () => openModuleEditor(btn.dataset.moduleId));
  });

  document.querySelectorAll(".toggleModulePublishBtn").forEach(btn => {
    btn.addEventListener("click", () => toggleModulePublish(btn.dataset.moduleId));
  });

  document.querySelectorAll(".toggleModuleContentBtn").forEach(btn => {
    btn.addEventListener("click", () => toggleModuleContent(btn));
  });
}

document.getElementById("addModuleForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const status = document.getElementById("addModuleStatus");
  status.textContent = "Menambah modul...";
  status.className = "form-status";

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

function findModule(moduleId) {
  return moduleCache.find(module => module.id === moduleId) || null;
}

function findLesson(lessonId) {
  for (const module of moduleCache) {
    const lesson = (module.lessons || []).find(item => item.id === lessonId);
    if (lesson) return lesson;
  }
  return null;
}

function toggleModuleContent(button) {
  const moduleId = button.dataset.moduleId;
  const body = document.getElementById(`module-body-${moduleId}`);
  if (!body) return;

  const isHidden = body.classList.toggle("collapsed");
  button.setAttribute("aria-expanded", String(!isHidden));
  button.textContent = isHidden ? "Kelola materi" : "Sembunyikan materi";
}

async function toggleModulePublish(moduleId) {
  const module = findModule(moduleId);
  if (!module) return;

  if (module.is_published) {
    const confirmed = confirm(
      `Jadikan "${module.title}" sebagai Draft?\n\n` +
      `Peserta tidak akan melihat modul ini. Isi materi dan status terbit masing-masing checkpoint tetap tersimpan.`
    );

    if (!confirmed) return;

    const { error } = await window.kabayanSupabase
      .from("modules")
      .update({ is_published: false })
      .eq("id", moduleId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadModules();
    return;
  }

  const filledLessons = (module.lessons || []).filter(lesson => lesson.content?.trim());

  if (!filledLessons.length) {
    alert("Modul belum mempunyai materi yang sudah diisi. Isi minimal satu materi sebelum menerbitkan modul.");
    return;
  }

  const unpublishedFilled = filledLessons.filter(lesson => !lesson.is_published);

  const confirmed = confirm(
    `Terbitkan "${module.title}"?\n\n` +
    `${filledLessons.length} materi sudah diisi.` +
    (unpublishedFilled.length
      ? `\n${unpublishedFilled.length} materi yang sudah diisi tetapi masih Draft juga akan diterbitkan.`
      : "") +
    `\n\nMateri yang isinya masih kosong akan tetap Draft.`
  );

  if (!confirmed) return;

  if (unpublishedFilled.length) {
    const lessonIds = unpublishedFilled.map(lesson => lesson.id);

    const { error: lessonError } = await window.kabayanSupabase
      .from("lessons")
      .update({ is_published: true })
      .in("id", lessonIds);

    if (lessonError) {
      alert(lessonError.message);
      return;
    }
  }

  const { error: moduleError } = await window.kabayanSupabase
    .from("modules")
    .update({ is_published: true })
    .eq("id", moduleId);

  if (moduleError) {
    alert(moduleError.message);
    return;
  }

  await loadModules();
}

function bindModuleEditorControls() {
  const modal = document.getElementById("moduleEditorModal");
  const form = document.getElementById("moduleEditorForm");

  document.getElementById("closeModuleEditorBtn")?.addEventListener("click", () => modal.close());
  document.getElementById("cancelModuleEditorBtn")?.addEventListener("click", () => modal.close());

  form?.addEventListener("submit", saveModule);
}

function openModuleEditor(moduleId) {
  const module = findModule(moduleId);
  if (!module) return;

  const form = document.getElementById("moduleEditorForm");
  form.module_id.value = module.id;
  form.title.value = module.title || "";
  form.description.value = module.description || "";

  document.getElementById("moduleEditorHeading").textContent = module.title || "Edit modul";
  document.getElementById("modulePositionLabel").textContent = `Modul ${module.position}`;

  const status = document.getElementById("moduleEditorStatus");
  status.textContent = "";
  status.className = "form-status";

  document.getElementById("moduleEditorModal").showModal();
  setTimeout(() => form.title.focus(), 80);
}

async function saveModule(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status = document.getElementById("moduleEditorStatus");
  const moduleId = form.module_id.value;

  status.textContent = "Menyimpan modul...";
  status.className = "form-status";

  const { error } = await window.kabayanSupabase
    .from("modules")
    .update({
      title: form.title.value.trim(),
      description: form.description.value.trim()
    })
    .eq("id", moduleId);

  if (error) {
    status.textContent = error.message;
    status.className = "form-status error";
    return;
  }

  status.textContent = "Perubahan modul berhasil disimpan.";
  status.className = "form-status success";

  await loadModules();

  setTimeout(() => {
    document.getElementById("moduleEditorModal").close();
  }, 450);
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
