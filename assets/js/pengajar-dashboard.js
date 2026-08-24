let teacherProfile = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    teacherProfile = await window.KabayanAuth.requireRole("teacher");
    document.getElementById("profileName").textContent = teacherProfile.full_name || "Pengajar";
    await loadClasses();
  } catch (err) {
    console.error(err);
  }
});

async function loadClasses() {
  const list = document.getElementById("classList");
  list.innerHTML = `<div class="empty">Memuat kelas...</div>`;

  const { data, error } = await window.kabayanSupabase
    .from("classes")
    .select("id, name, description, status, start_date, end_date, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    list.innerHTML = `<div class="empty error-text">${escapeHtml(error.message)}</div>`;
    return;
  }

  document.getElementById("classCount").textContent = data.length;

  if (!data.length) {
    list.innerHTML = `
      <div class="empty">
        <strong>Belum ada kelas.</strong>
        <span>Buat kelas PPh Pasal 21 pertama Anda.</span>
      </div>`;
    return;
  }

  list.innerHTML = data.map(item => `
    <article class="class-card">
      <div>
        <div class="eyebrow">${labelStatus(item.status)}</div>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.description || "Belum ada deskripsi.")}</p>
      </div>
      <div class="card-actions">
        <a class="btn secondary" href="kelola-kelas.html?id=${encodeURIComponent(item.id)}">Kelola kelas</a>
      </div>
    </article>
  `).join("");
}

document.getElementById("createClassForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const status = document.getElementById("createStatus");
  status.textContent = "Membuat kelas...";

  const payload = {
    teacher_id: teacherProfile.id,
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    status: form.status.value
  };

  const { error } = await window.kabayanSupabase
    .from("classes")
    .insert(payload);

  if (error) {
    status.textContent = error.message;
    status.className = "form-status error";
    return;
  }

  form.reset();
  status.textContent = "Kelas berhasil dibuat.";
  status.className = "form-status success";
  await loadClasses();
});

function labelStatus(status) {
  return ({
    draft: "Draft",
    active: "Aktif",
    closed: "Ditutup"
  })[status] || status;
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[s]);
}
