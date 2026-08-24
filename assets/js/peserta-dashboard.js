let studentProfile = null;
let dashboardData = null;

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    try {
      studentProfile = await window.KabayanAuth.requireRole("student");
      const displayName = studentProfile.full_name || "Peserta";
      document.getElementById("profileName").textContent = displayName;
      document.getElementById("heroName").textContent = firstName(displayName);
      bindStaticEvents();
      await loadDashboard();
    } catch (error) {
      console.error(error);
    }
  }
);

function bindStaticEvents() {
  document.getElementById("closeScoreModal")?.addEventListener(
    "click",
    () => document.getElementById("scoreModal").close()
  );
}

async function loadDashboard() {
  const { data, error } = await window.kabayanSupabase.rpc("get_my_learning_dashboard");
  if (error) {
    renderPageError(error.message);
    return;
  }
  dashboardData = data || { summary: {}, classes: [] };
  renderSummary();
  renderLearningJourney();
  renderCertificates();
  renderClasses();
}

function renderSummary() {
  const summary = dashboardData?.summary || {};
  document.getElementById("summaryClasses").textContent = summary.active_class_count ?? 0;
  document.getElementById("summaryProgress").textContent = `${summary.average_progress ?? 0}%`;
  document.getElementById("summaryCompleted").textContent = summary.completed_class_count ?? 0;
  document.getElementById("summaryCertificates").textContent = summary.certificate_count ?? 0;
  const heroProgress = document.getElementById("heroProgress");
  const heroCertificate = document.getElementById("heroCertificate");
  if (heroProgress) heroProgress.textContent = `${summary.average_progress ?? 0}%`;
  if (heroCertificate) heroCertificate.textContent = summary.certificate_count ?? 0;
}

function renderLearningJourney() {
  const host = document.getElementById("learningJourneyList");
  const classes = dashboardData?.classes || [];
  if (!classes.length) {
    host.innerHTML = `<div class="participant-empty">Belum ada kelas yang dapat ditampilkan.</div>`;
    return;
  }
  host.innerHTML = classes.map(renderJourneyCard).join("");
}

function renderJourneyCard(classData) {
  const materialDone = classData.lessons_total > 0 && classData.lessons_completed >= classData.lessons_total;
  const quizzesDone = classData.quizzes_total > 0 && classData.quizzes_passed >= classData.quizzes_total;
  const finalDone = classData.final_passed === true;
  const certificate = classData.certificate || { exists: false };
  const certificateDone = certificate.exists === true && certificate.status === "active";
  const steps = [
    { label: "Materi", value: `${classData.lessons_completed}/${classData.lessons_total}`, done: materialDone, active: !materialDone },
    { label: "Kuis Modul", value: `${classData.quizzes_passed}/${classData.quizzes_total}`, done: quizzesDone, active: materialDone && !quizzesDone },
    { label: "Evaluasi", value: classData.final_best_score == null ? "—" : String(classData.final_best_score), done: finalDone, active: materialDone && quizzesDone && !finalDone },
    { label: "Sertifikat", value: certificateDone ? "Terbit" : "—", done: certificateDone, active: finalDone && !certificateDone }
  ];

  return `
    <article class="learning-journey-card">
      <div class="learning-journey-top">
        <div>
          <div class="learning-journey-label">${classData.is_active ? "Kelas Aktif" : "Kelas"}</div>
          <h3>${escapeHtml(classData.name)}</h3>
        </div>
        <div class="learning-journey-progress">
          <strong>${classData.progress_percent || 0}%</strong>
          <span>progres materi</span>
        </div>
      </div>
      <div class="journey-progress-track"><span style="width:${clampPercent(classData.progress_percent)}%"></span></div>
      <div class="journey-steps">
        ${steps.map((step, index) => `
          <div class="journey-step ${step.done ? "done" : ""} ${step.active ? "active" : ""}">
            <div class="journey-step-node">${step.done ? "✓" : index + 1}</div>
            <div>
              <strong>${escapeHtml(step.label)}</strong>
              <span>${escapeHtml(step.value)}</span>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="journey-actions">
        <a class="participant-button class-primary" href="kelas-belajar.html?id=${encodeURIComponent(classData.id)}">
          ${certificateDone ? "Lihat kelas" : getContinueLabel(materialDone, quizzesDone, finalDone)}
        </a>
        <button type="button" class="participant-button score-history-button" data-class-id="${classData.id}">Riwayat Nilai</button>
      </div>
    </article>
  `;
}

function renderCertificates() {
  const host = document.getElementById("certificateList");
  const certificates = (dashboardData?.classes || [])
    .map(classData => ({ ...classData.certificate, class_id: classData.id, class_name: classData.name }))
    .filter(certificate => certificate.exists);
  document.getElementById("certificateCount").textContent = certificates.length;
  if (!certificates.length) {
    host.innerHTML = `
      <div class="certificate-empty-state">
        <div class="certificate-empty-icon">✓</div>
        <div>
          <strong>Belum ada sertifikat.</strong>
          <p>Sertifikat akan tersedia setelah seluruh syarat kelulusan terpenuhi dan pengajar menerbitkannya.</p>
        </div>
      </div>
    `;
    return;
  }
  host.innerHTML = certificates.map(renderCertificateCard).join("");
}

function renderCertificateCard(certificate) {
  const active = certificate.status === "active";
  return `
    <article class="participant-certificate-card ${active ? "active" : "revoked"}">
      <div class="certificate-card-mark"><span>KL</span></div>
      <div class="certificate-card-copy">
        <div class="certificate-card-topline">
          <span class="certificate-card-label">Sertifikat Kelulusan</span>
          <span class="certificate-card-status ${active ? "active" : "revoked"}">${active ? "Aktif" : "Tidak berlaku"}</span>
        </div>
        <h3>${escapeHtml(certificate.class_name || "Kelas")}</h3>
        <div class="certificate-card-meta">
          <span>${escapeHtml(certificate.certificate_number || "—")}</span>
          <span>Nilai akhir ${certificate.final_score ?? "—"}</span>
          <span>${formatDate(certificate.issued_at)}</span>
        </div>
      </div>
      <div class="certificate-card-actions">
        ${active ? `
          <a class="participant-button certificate-open" href="sertifikat.html?code=${encodeURIComponent(certificate.verification_code)}">Lihat & Unduh</a>
          <a class="participant-button certificate-verify" href="verifikasi-sertifikat.html?code=${encodeURIComponent(certificate.verification_code)}" target="_blank" rel="noopener">Verifikasi</a>
        ` : `<span class="certificate-revoked-note">Sertifikat telah dicabut.</span>`}
      </div>
    </article>
  `;
}

function renderClasses() {
  const host = document.getElementById("classList");
  const classes = dashboardData?.classes || [];
  document.getElementById("classCount").textContent = classes.length;
  if (!classes.length) {
    host.innerHTML = `
      <div class="participant-empty">
        <strong>Belum ada kelas.</strong>
        <span>Hubungi pengajar untuk menambahkan akun Anda ke kelas.</span>
      </div>
    `;
    return;
  }
  host.innerHTML = classes.map(renderClassCard).join("");
  bindScoreHistoryButtons();
}

function renderClassCard(classData) {
  const moduleResults = classData.module_results || [];
  return `
    <article class="participant-class-card extended">
      <div class="participant-class-main">
        <div class="participant-class-number">${classData.is_active ? "Aktif" : "Kelas"}</div>
        <div class="participant-class-copy">
          <h3>${escapeHtml(classData.name)}</h3>
          <p>${escapeHtml(classData.description || "")}</p>
          <div class="participant-class-progress">
            <div class="class-progress-track"><span style="width:${clampPercent(classData.progress_percent)}%"></span></div>
            <small>${classData.lessons_completed}/${classData.lessons_total} checkpoint · ${classData.progress_percent || 0}%</small>
          </div>
        </div>
        <div class="participant-class-action">
          <a class="participant-button class-open" href="kelas-belajar.html?id=${encodeURIComponent(classData.id)}">Buka kelas</a>
        </div>
      </div>
      <div class="class-score-preview">
        ${moduleResults.map(result => `
          <div class="class-score-chip ${result.passed ? "passed" : ""}">
            <span>M${result.position}</span>
            <strong>${result.best_score ?? "—"}</strong>
          </div>
        `).join("")}
        <div class="class-score-chip final ${classData.final_passed ? "passed" : ""}">
          <span>Final</span>
          <strong>${classData.final_best_score ?? "—"}</strong>
        </div>
        <button type="button" class="score-preview-detail score-history-button" data-class-id="${classData.id}">Lihat riwayat</button>
      </div>
    </article>
  `;
}

function bindScoreHistoryButtons() {
  document.querySelectorAll('.score-history-button[data-class-id]').forEach(button => {
    button.addEventListener('click', () => openScoreHistory(button.dataset.classId));
  });
}

function openScoreHistory(classId) {
  const classData = (dashboardData?.classes || []).find(item => item.id === classId);
  if (!classData) return;
  document.getElementById("scoreClassName").textContent = classData.name;
  const moduleResults = classData.module_results || [];
  document.getElementById("scoreModuleList").innerHTML = moduleResults.map(result => {
    const lessonPercent = result.lessons_total > 0 ? Math.round((result.lessons_completed / result.lessons_total) * 100) : 0;
    return `
      <article class="score-module-card">
        <div class="score-module-title">
          <span>Modul ${result.position}</span>
          <strong>${escapeHtml(result.title)}</strong>
        </div>
        <div class="score-module-data">
          <div><span>Materi</span><strong>${result.lessons_completed}/${result.lessons_total}</strong><small>${lessonPercent}%</small></div>
          <div><span>Nilai terbaik</span><strong>${result.best_score ?? "—"}</strong><small>minimum ${result.pass_score ?? "—"}</small></div>
          <div><span>Percobaan</span><strong>${result.attempts_used || 0}</strong><small>dari ${result.max_attempts ?? "∞"}</small></div>
        </div>
        <span class="score-module-state ${result.passed ? "passed" : ""}">${result.passed ? "Lulus" : "Belum lulus"}</span>
      </article>
    `;
  }).join("");

  const certificate = classData.certificate || { exists: false };
  document.getElementById("scoreFinalCard").innerHTML = `
    <div>
      <div class="participant-section-kicker">Evaluasi Akhir</div>
      <h3>${escapeHtml(classData.name)}</h3>
      <p>Nilai minimum ${classData.final_pass_score ?? 70}.</p>
    </div>
    <div class="score-final-number">
      <span>Nilai terbaik</span>
      <strong>${classData.final_best_score ?? "—"}</strong>
      <small>${classData.final_attempts || 0}/${classData.final_max_attempts ?? "∞"} percobaan</small>
    </div>
    <div class="score-final-status">
      <span class="${classData.final_passed ? "passed" : ""}">${classData.final_passed ? "Lulus" : "Belum lulus"}</span>
      ${certificate.exists && certificate.status === "active" ? `<a href="sertifikat.html?code=${encodeURIComponent(certificate.verification_code)}">Lihat sertifikat</a>` : ""}
    </div>
  `;
  document.getElementById("scoreModal").showModal();
}

function getContinueLabel(materialDone, quizzesDone, finalDone) {
  if (!materialDone) return "Lanjutkan materi";
  if (!quizzesDone) return "Lanjutkan kuis";
  if (!finalDone) return "Kerjakan Evaluasi";
  return "Lihat kelas";
}

function firstName(value = "") {
  const clean = String(value).trim();
  if (!clean) return "Peserta";
  return clean.split(/\s+/)[0];
}

function clampPercent(value) {
  const number = Number(value || 0);
  return Math.min(100, Math.max(0, number));
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta"
  }).format(new Date(value));
}

function renderPageError(message) {
  const html = `<div class="participant-empty error">${escapeHtml(message || "Dashboard belum dapat dimuat.")}</div>`;
  document.getElementById("learningJourneyList").innerHTML = html;
  document.getElementById("certificateList").innerHTML = html;
  document.getElementById("classList").innerHTML = html;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
}
