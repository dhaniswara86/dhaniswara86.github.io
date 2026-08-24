let studentProfile = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    studentProfile = await window.KabayanAuth.requireRole("student");
    document.getElementById("profileName").textContent = studentProfile.full_name || "Peserta";
    await loadMyClasses();
  } catch (err) {
    console.error(err);
  }
});

async function loadMyClasses() {
  const host = document.getElementById("classList");
  host.innerHTML = `<div class="empty">Memuat kelas...</div>`;

  const { data, error } = await window.kabayanSupabase
    .from("classes")
    .select("id, name, description, status, start_date, end_date")
    .order("created_at", { ascending: false });

  if (error) {
    host.innerHTML = `<div class="empty error-text">${escapeHtml(error.message)}</div>`;
    return;
  }

  if (!data.length) {
    host.innerHTML = `
      <div class="empty">
        <strong>Belum ada kelas.</strong>
        <span>Hubungi pengajar untuk menambahkan akun Anda ke kelas.</span>
      </div>`;
    return;
  }

  host.innerHTML = data.map(c => `
    <article class="class-card">
      <div>
        <div class="eyebrow">${c.status === "active" ? "Kelas Aktif" : "Kelas"}</div>
        <h3>${escapeHtml(c.name)}</h3>
        <p>${escapeHtml(c.description || "")}</p>
      </div>
      <div class="card-actions">
        <a class="btn" href="kelas-belajar.html?id=${encodeURIComponent(c.id)}">Buka kelas</a>
      </div>
    </article>
  `).join("");
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[s]);
}
