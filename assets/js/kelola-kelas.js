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

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});


/* ============================================================
   CLASS
   ============================================================ */

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
    ({
      draft: "Draft",
      active: "Aktif",
      closed: "Ditutup"
    })[data.status] || data.status;
}


/* ============================================================
   MEMBERS
   ============================================================ */

async function loadMembers() {
  const host = document.getElementById("memberList");

  host.innerHTML = `
    <div class="kc-empty-small">
      Memuat peserta…
    </div>
  `;

  const { data, error } = await window.kabayanSupabase
    .from("class_members")
    .select(
      "id, user_id, is_active, joined_at, profiles!class_members_user_id_fkey(full_name,email)"
    )
    .eq("class_id", classId)
    .order("joined_at", { ascending: true });

  if (error) {
    host.innerHTML = `
      <div class="kc-empty-small kc-error">
        ${escapeHtml(error.message)}
      </div>
    `;
    return;
  }

  const total = data.length;

  document.getElementById("memberCount").textContent = total;
  document.getElementById("memberCountInline").textContent = total;

  if (!total) {
    host.innerHTML = `
      <div class="kc-empty-small">
        Belum ada peserta.
      </div>
    `;
    return;
  }

  host.innerHTML = data.map(row => `
    <div class="kc-member-row">
      <div class="kc-member-avatar">
        ${escapeHtml(getInitial(row.profiles?.full_name || row.profiles?.email || "P"))}
      </div>

      <div class="kc-member-info">
        <strong>${escapeHtml(row.profiles?.full_name || "Peserta")}</strong>
        <span>${escapeHtml(row.profiles?.email || "")}</span>
      </div>

      <span class="kc-member-status ${row.is_active ? "active" : ""}">
        ${row.is_active ? "Aktif" : "Nonaktif"}
      </span>
    </div>
  `).join("");
}


document
  .getElementById("addStudentForm")
  ?.addEventListener("submit", async (event) => {

    event.preventDefault();

    const form = event.currentTarget;
    const status = document.getElementById("addStudentStatus");

    status.className = "form-status";
    status.textContent = "Menambahkan peserta...";

    const { error } = await window.kabayanSupabase.rpc(
      "add_student_to_class",
      {
        p_class_id: classId,
        p_email: form.email.value.trim()
      }
    );

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


/* ============================================================
   MODULES
   ============================================================ */

async function loadModules() {
  const host = document.getElementById("moduleList");

  host.innerHTML = `
    <div class="kc-empty">
      Memuat modul…
    </div>
  `;

  const { data, error } = await window.kabayanSupabase
    .from("modules")
    .select(
      "id, title, description, position, module_type, is_published, lessons(id,title,content,video_url,video_duration,position,is_published,estimated_minutes)"
    )
    .eq("class_id", classId)
    .order("position", { ascending: true });

  if (error) {
    host.innerHTML = `
      <div class="kc-empty kc-error">
        ${escapeHtml(error.message)}
      </div>
    `;
    return;
  }

  moduleCache = (data || []).map(module => ({
    ...module,
    module_type: module.module_type || "learning",
    lessons: (module.lessons || []).sort(
      (a, b) => a.position - b.position
    )
  }));

  const learningModules =
    moduleCache.filter(
      module => module.module_type !== "final_exam"
    );

  const finalModule =
    moduleCache.find(
      module => module.module_type === "final_exam"
    ) || null;

  renderFinalEvaluationAdmin(finalModule);

  if (!learningModules.length) {
    host.innerHTML = `
      <div class="kc-empty">
        Belum ada modul.
      </div>
    `;
    return;
  }

  host.innerHTML = learningModules
    .map(renderModuleCard)
    .join("");

  bindModuleCardEvents();
}


function renderModuleCard(module) {
  const lessons = module.lessons || [];

  const filledLessons =
    lessons.filter(lesson => lesson.content?.trim()).length;

  const publishedLessons =
    lessons.filter(lesson => lesson.is_published).length;

  return `
    <article class="kc-module-card" id="module-${module.id}">

      <div class="kc-module-head">
        <div class="kc-module-title">
          <div class="kc-module-label">
            Modul ${module.position}
          </div>

          <h3>${escapeHtml(module.title)}</h3>

          <p>
            ${escapeHtml(module.description || "Belum ada deskripsi modul.")}
          </p>
        </div>

        <span class="kc-module-state ${module.is_published ? "published" : "draft"}">
          ${module.is_published ? "Terbit" : "Draft"}
        </span>
      </div>


      <div class="kc-module-meta">
        <span>
          <strong>${filledLessons}/${lessons.length}</strong>
          materi terisi
        </span>

        <span>
          <strong>${publishedLessons}/${lessons.length}</strong>
          materi terbit
        </span>
      </div>


      <div class="kc-module-actions">

        <button
          class="kc-action kc-action-blue editModuleBtn"
          type="button"
          data-module-id="${module.id}">
          Edit modul
        </button>

        <button
          class="kc-action ${
            module.is_published
              ? "kc-action-orange"
              : "kc-action-green"
          } toggleModulePublishBtn"
          type="button"
          data-module-id="${module.id}">
          ${
            module.is_published
              ? "Jadikan Draft"
              : "Terbitkan modul"
          }
        </button>

        <button
          class="kc-action kc-action-gray toggleModuleContentBtn"
          type="button"
          data-module-id="${module.id}"
          aria-expanded="false">
          Kelola materi
        </button>

        <a
          class="kc-action kc-action-purple"
          href="kelola-kuis.html?module_id=${encodeURIComponent(module.id)}">
          Kelola kuis
        </a>

      </div>


      <div
        class="kc-module-body collapsed"
        id="module-body-${module.id}">

        <div class="kc-lessons">

          ${
            lessons.length
              ? lessons.map(renderLessonRow).join("")
              : `
                <div class="kc-empty-small">
                  Belum ada materi dalam modul ini.
                </div>
              `
          }

        </div>


        <form
          class="kc-add-lesson addLessonForm"
          data-module-id="${module.id}">

          <div class="kc-add-lesson-title">
            <strong>Tambah checkpoint</strong>
            <span>Tambahkan materi baru ke modul ini.</span>
          </div>

          <div class="kc-add-lesson-grid">

            <input
              name="title"
              required
              placeholder="Judul materi / checkpoint">

            <input
              name="position"
              required
              type="number"
              min="1"
              value="${lessons.length + 1}"
              aria-label="Urutan">

            <label class="kc-add-check">
              <input type="checkbox" name="is_published">
              Terbit
            </label>

            <button
              class="kc-action kc-action-blue"
              type="submit">
              Tambah materi
            </button>

          </div>
        </form>

      </div>

    </article>
  `;
}


function renderLessonRow(lesson) {
  return `
    <div class="kc-lesson-row">

      <div class="kc-lesson-index">
        ${lesson.position}
      </div>

      <div class="kc-lesson-copy">
        <strong>${escapeHtml(lesson.title)}</strong>
        <span>
          ${lesson.video_url?.trim() ? "Video tersedia" : "Tanpa video"}
          · ${lesson.content?.trim() ? "Resume tersedia" : "Resume belum diisi"}
          ${lesson.video_duration ? ` · Video ${lesson.video_duration} menit` : ""}
          ${lesson.estimated_minutes ? ` · Belajar ${lesson.estimated_minutes} menit` : ""}
        </span>
      </div>

      <span class="kc-lesson-state ${lesson.is_published ? "published" : "draft"}">
        ${lesson.is_published ? "Terbit" : "Draft"}
      </span>

      <button
        class="kc-action kc-action-teal editLessonBtn"
        type="button"
        data-lesson-id="${lesson.id}">
        Edit materi
      </button>

    </div>
  `;
}


function bindModuleCardEvents() {
  document.querySelectorAll(".addLessonForm")
    .forEach(form => {
      form.addEventListener("submit", addLesson);
    });

  document.querySelectorAll(".editLessonBtn")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => openLessonEditor(button.dataset.lessonId)
      );
    });

  document.querySelectorAll(".editModuleBtn")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => openModuleEditor(button.dataset.moduleId)
      );
    });

  document.querySelectorAll(".toggleModulePublishBtn")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => toggleModulePublish(button.dataset.moduleId)
      );
    });

  document.querySelectorAll(".toggleModuleContentBtn")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => toggleModuleContent(button)
      );
    });
}


function renderFinalEvaluationAdmin(module) {
  const host = document.getElementById("finalEvaluationAdmin");
  const text = document.getElementById("finalEvaluationAdminText");

  if (!host || !text) return;

  if (!module) {
    text.textContent =
      "Evaluasi Akhir belum dibuat. Jalankan SQL Tahap 3 terlebih dahulu.";

    host.innerHTML = `
      <span class="kc-final-admin-state">
        Belum tersedia
      </span>
    `;

    return;
  }

  text.textContent =
    "30 soal lintas Modul 1–6. Peserta baru dapat mengerjakan setelah seluruh kuis modul lulus.";

  host.innerHTML = `
    <div class="kc-final-admin-actions">

      <a
        class="kc-final-admin-button"
        href="kelola-kuis.html?module_id=${encodeURIComponent(module.id)}">
        Kelola Evaluasi Akhir
      </a>

      <a
        class="kc-grade-admin-button"
        href="nilai-kelas.html?id=${encodeURIComponent(classId)}">
        Dashboard Nilai Peserta
      </a>

    </div>
  `;
}


/* ============================================================
   ADD MODULE
   ============================================================ */

document
  .getElementById("addModuleForm")
  ?.addEventListener("submit", async event => {

    event.preventDefault();

    const form = event.currentTarget;
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


/* ============================================================
   ADD LESSON
   ============================================================ */

async function addLesson(event) {
  event.preventDefault();

  const form = event.currentTarget;
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


/* ============================================================
   MODULE BODY
   ============================================================ */

function toggleModuleContent(button) {
  const moduleId = button.dataset.moduleId;
  const body = document.getElementById(`module-body-${moduleId}`);

  if (!body) return;

  const isCollapsed =
    body.classList.toggle("collapsed");

  button.setAttribute(
    "aria-expanded",
    String(!isCollapsed)
  );

  button.textContent =
    isCollapsed
      ? "Kelola materi"
      : "Tutup materi";
}


/* ============================================================
   PUBLISH MODULE
   ============================================================ */

async function toggleModulePublish(moduleId) {
  const module = findModule(moduleId);

  if (!module) return;


  if (module.is_published) {

    const confirmed = confirm(
      `Jadikan "${module.title}" sebagai Draft?\n\n` +
      `Peserta tidak akan melihat modul ini. Isi materi tetap tersimpan.`
    );

    if (!confirmed) return;

    const { error } = await window.kabayanSupabase
      .from("modules")
      .update({
        is_published: false
      })
      .eq("id", moduleId);

    if (error) {
      alert(error.message);
      return;
    }

    await loadModules();
    return;
  }


  const filledLessons =
    (module.lessons || [])
      .filter(lesson => lesson.content?.trim());


  if (!filledLessons.length) {
    alert(
      "Modul belum mempunyai materi yang sudah diisi. " +
      "Isi minimal satu materi sebelum menerbitkan modul."
    );
    return;
  }


  const unpublishedFilled =
    filledLessons.filter(
      lesson => !lesson.is_published
    );


  const confirmed = confirm(
    `Terbitkan "${module.title}"?\n\n` +
    `${filledLessons.length} materi sudah diisi.` +
    (
      unpublishedFilled.length
        ? `\n${unpublishedFilled.length} materi yang sudah diisi tetapi masih Draft juga akan diterbitkan.`
        : ""
    ) +
    `\n\nMateri kosong akan tetap Draft.`
  );

  if (!confirmed) return;


  if (unpublishedFilled.length) {

    const lessonIds =
      unpublishedFilled.map(
        lesson => lesson.id
      );

    const { error: lessonError } =
      await window.kabayanSupabase
        .from("lessons")
        .update({
          is_published: true
        })
        .in("id", lessonIds);

    if (lessonError) {
      alert(lessonError.message);
      return;
    }
  }


  const { error: moduleError } =
    await window.kabayanSupabase
      .from("modules")
      .update({
        is_published: true
      })
      .eq("id", moduleId);

  if (moduleError) {
    alert(moduleError.message);
    return;
  }

  await loadModules();
}


/* ============================================================
   MODULE EDITOR
   ============================================================ */

function bindModuleEditorControls() {
  const modal =
    document.getElementById("moduleEditorModal");

  const form =
    document.getElementById("moduleEditorForm");

  document
    .getElementById("closeModuleEditorBtn")
    ?.addEventListener(
      "click",
      () => modal.close()
    );

  document
    .getElementById("cancelModuleEditorBtn")
    ?.addEventListener(
      "click",
      () => modal.close()
    );

  form?.addEventListener(
    "submit",
    saveModule
  );
}


function openModuleEditor(moduleId) {
  const module = findModule(moduleId);

  if (!module) return;

  const form =
    document.getElementById("moduleEditorForm");

  form.module_id.value = module.id;
  form.title.value = module.title || "";
  form.description.value =
    module.description || "";

  document
    .getElementById("moduleEditorHeading")
    .textContent =
      module.title || "Edit modul";

  document
    .getElementById("modulePositionLabel")
    .textContent =
      `Modul ${module.position}`;

  const status =
    document.getElementById("moduleEditorStatus");

  status.textContent = "";
  status.className = "form-status";

  document
    .getElementById("moduleEditorModal")
    .showModal();

  setTimeout(
    () => form.title.focus(),
    80
  );
}


async function saveModule(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const status =
    document.getElementById("moduleEditorStatus");

  const moduleId =
    form.module_id.value;

  status.textContent =
    "Menyimpan modul...";

  status.className =
    "form-status";

  const { error } =
    await window.kabayanSupabase
      .from("modules")
      .update({
        title:
          form.title.value.trim(),
        description:
          form.description.value.trim()
      })
      .eq("id", moduleId);

  if (error) {
    status.textContent =
      error.message;

    status.className =
      "form-status error";

    return;
  }

  status.textContent =
    "Perubahan modul berhasil disimpan.";

  status.className =
    "form-status success";

  await loadModules();

  setTimeout(() => {
    document
      .getElementById("moduleEditorModal")
      .close();
  }, 450);
}


/* ============================================================
   LESSON EDITOR
   ============================================================ */

function bindEditorControls() {
  const modal =
    document.getElementById("lessonEditorModal");

  const form =
    document.getElementById("lessonEditorForm");

  const textarea =
    document.getElementById("lessonContentInput");


  document
    .getElementById("closeEditorBtn")
    ?.addEventListener(
      "click",
      () => modal.close()
    );

  document
    .getElementById("cancelEditorBtn")
    ?.addEventListener(
      "click",
      () => modal.close()
    );


  document
    .querySelectorAll(".editor-toolbar button")
    .forEach(button => {

      button.addEventListener("click", () => {

        if (button.dataset.wrap) {
          wrapSelection(
            textarea,
            button.dataset.wrap
          );

        } else if (button.dataset.insert) {
          insertAtCursor(
            textarea,
            button.dataset.insert + "\n"
          );

        } else if (
          button.dataset.template === "table"
        ) {

          insertAtCursor(
            textarea,
            "\n| Keterangan | Nilai |\n|---|---:|\n| Contoh | Rp10.000.000 |\n"
          );

        } else if (
          button.dataset.template === "example"
        ) {

          insertAtCursor(
            textarea,
            "\n## Contoh Perhitungan\n\n**Kasus:** Tuliskan kondisi kasus di sini.\n\n**Perhitungan:**\n\n1. Langkah pertama\n2. Langkah kedua\n3. Hasil perhitungan\n"
          );
        }
      });
    });


  form?.addEventListener(
    "submit",
    saveLesson
  );
}


function openLessonEditor(lessonId) {
  const lesson =
    findLesson(lessonId);

  if (!lesson) return;

  const form =
    document.getElementById("lessonEditorForm");

  form.lesson_id.value =
    lesson.id;

  form.title.value =
    lesson.title || "";

  form.position.value =
    lesson.position || 1;

  form.estimated_minutes.value =
    lesson.estimated_minutes || "";

  form.video_url.value =
    lesson.video_url || "";

  form.video_duration.value =
    lesson.video_duration || "";

  form.is_published.checked =
    !!lesson.is_published;

  form.content.value =
    lesson.content || "";

  document
    .getElementById("editorHeading")
    .textContent =
      lesson.title || "Edit checkpoint";

  const status =
    document.getElementById("lessonEditorStatus");

  status.textContent = "";
  status.className = "form-status";

  document
    .getElementById("lessonEditorModal")
    .showModal();

  setTimeout(
    () => form.title.focus(),
    80
  );
}


async function saveLesson(event) {
  event.preventDefault();

  const form =
    event.currentTarget;

  const status =
    document.getElementById("lessonEditorStatus");

  const lessonId =
    form.lesson_id.value;

  status.textContent =
    "Menyimpan materi...";

  status.className =
    "form-status";


  const estimated =
    form.estimated_minutes.value.trim();

  const videoDuration =
    form.video_duration.value.trim();

  const videoUrl =
    form.video_url.value.trim();

  if (videoUrl && !isSupportedVideoUrl(videoUrl)) {
    status.textContent =
      "URL video tidak valid. Gunakan URL YouTube, Vimeo, atau tautan video http/https.";

    status.className =
      "form-status error";

    return;
  }


  const { error } =
    await window.kabayanSupabase
      .from("lessons")
      .update({
        title:
          form.title.value.trim(),

        position:
          Number(form.position.value),

        estimated_minutes:
          estimated
            ? Number(estimated)
            : null,

        video_url:
          videoUrl || null,

        video_duration:
          videoDuration
            ? Number(videoDuration)
            : null,

        is_published:
          form.is_published.checked,

        content:
          form.content.value
      })
      .eq("id", lessonId);


  if (error) {
    status.textContent =
      error.message;

    status.className =
      "form-status error";

    return;
  }


  status.textContent =
    "Materi berhasil disimpan.";

  status.className =
    "form-status success";


  await loadModules();


  setTimeout(() => {
    document
      .getElementById("lessonEditorModal")
      .close();
  }, 500);
}


/* ============================================================
   HELPERS
   ============================================================ */

function findModule(moduleId) {
  return (
    moduleCache.find(
      module => module.id === moduleId
    ) || null
  );
}


function findLesson(lessonId) {
  for (const module of moduleCache) {
    const lesson =
      (module.lessons || [])
        .find(
          item => item.id === lessonId
        );

    if (lesson) return lesson;
  }

  return null;
}


function insertAtCursor(
  textarea,
  text
) {
  const start =
    textarea.selectionStart;

  const end =
    textarea.selectionEnd;

  const before =
    textarea.value.slice(0, start);

  const after =
    textarea.value.slice(end);

  textarea.value =
    before + text + after;

  const cursor =
    start + text.length;

  textarea.setSelectionRange(
    cursor,
    cursor
  );

  textarea.focus();
}


function wrapSelection(
  textarea,
  wrapper
) {
  const start =
    textarea.selectionStart;

  const end =
    textarea.selectionEnd;

  const selected =
    textarea.value.slice(
      start,
      end
    ) || "teks";


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


function getInitial(value = "") {
  return (
    String(value)
      .trim()
      .charAt(0)
      .toUpperCase() || "P"
  );
}


function isSupportedVideoUrl(value = "") {
  try {
    const url = new URL(value);

    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}


function escapeHtml(value = "") {
  return String(value)
    .replace(
      /[&<>"']/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[char]
    );
}
