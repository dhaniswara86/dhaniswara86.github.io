const params = new URLSearchParams(location.search);
const classId = params.get("id");

let dashboardData = null;
let visibleStudents = [];
let pendingCertificateRevocation = null;


document.addEventListener("DOMContentLoaded", async () => {
  try {
    await window.KabayanAuth.requireRole("teacher");

    if (!classId) {
      location.replace("pengajar-dashboard.html");
      return;
    }

    document.getElementById("backToClass").href =
      `kelola-kelas.html?id=${encodeURIComponent(classId)}`;

    bindControls();
    await loadDashboard();

  } catch (error) {
    console.error(error);
    showPageError(error.message);
  }
});


function bindControls() {

  document
    .getElementById("refreshBtn")
    ?.addEventListener(
      "click",
      loadDashboard
    );


  document
    .getElementById("exportBtn")
    ?.addEventListener(
      "click",
      exportCsv
    );


  document
    .getElementById("searchInput")
    ?.addEventListener(
      "input",
      applyFilters
    );


  document
    .getElementById("statusFilter")
    ?.addEventListener(
      "change",
      applyFilters
    );


  document
    .getElementById("closeDetailBtn")
    ?.addEventListener(
      "click",
      () =>
        document
          .getElementById("studentDetailModal")
          .close()
    );


  document
    .getElementById("cancelRevokeCertificate")
    ?.addEventListener(
      "click",
      closeRevokeCertificateModal
    );


  document
    .getElementById("revokeCertificateForm")
    ?.addEventListener(
      "submit",
      submitCertificateRevocation
    );
}


async function loadDashboard() {

  setRefreshState(true);

  try {

    const { data, error } =
      await window.kabayanSupabase.rpc(
        "get_class_grade_dashboard",
        {
          p_class_id: classId
        }
      );


    if (error) throw error;


    dashboardData = data || {
      class: null,
      modules: [],
      final_evaluation: null,
      summary: {},
      students: []
    };


    renderHeader();
    renderSummary();
    applyFilters();


  } catch (error) {

    console.error(error);
    showPageError(error.message);

  } finally {

    setRefreshState(false);
  }
}


function renderHeader() {

  const cls =
    dashboardData?.class || {};


  document
    .getElementById("className")
    .textContent =
      cls.name || "Dashboard Nilai";


  document
    .getElementById("classDescription")
    .textContent =
      cls.description ||
      "Ringkasan progres dan hasil evaluasi peserta.";
}


function renderSummary() {

  const summary =
    dashboardData?.summary || {};


  document
    .getElementById("summaryParticipants")
    .textContent =
      summary.active_count ?? 0;


  document
    .getElementById("summaryGraduated")
    .textContent =
      summary.graduated_count ?? 0;


  document
    .getElementById("summaryProgress")
    .textContent =
      `${summary.average_progress ?? 0}%`;


  document
    .getElementById("summaryFinal")
    .textContent =
      summary.average_final_score == null
        ? "—"
        : summary.average_final_score;
}


function applyFilters() {

  if (!dashboardData) return;


  const query =
    document
      .getElementById("searchInput")
      .value
      .trim()
      .toLowerCase();


  const status =
    document
      .getElementById("statusFilter")
      .value;


  visibleStudents =
    (dashboardData.students || [])
      .filter(student => {

        const haystack =
          `${student.full_name || ""} ${student.email || ""}`
            .toLowerCase();


        const searchMatch =
          !query ||
          haystack.includes(query);


        const statusMatch =
          status === "all" ||
          getStudentStage(student) === status;


        return searchMatch && statusMatch;
      });


  renderTable();
  renderMobileCards();


  document
    .getElementById("visibleCount")
    .textContent =
      `${visibleStudents.length} peserta`;
}


function renderTable() {

  const host =
    document.getElementById("gradeTableHost");


  const modules =
    dashboardData.modules || [];


  if (!visibleStudents.length) {

    host.innerHTML = `
      <div class="grade-empty">
        Tidak ada peserta yang sesuai dengan filter.
      </div>
    `;

    return;
  }


  host.innerHTML = `
    <div class="grade-table-wrap">
      <table class="grade-table">

        <thead>
          <tr>

            <th class="participant-column">
              Peserta
            </th>

            <th class="progress-column">
              Progres
            </th>

            ${modules.map(module => `
              <th
                class="quiz-column"
                title="${escapeHtml(module.title)}">
                M${module.position}
              </th>
            `).join("")}

            <th class="final-column">
              Final
            </th>

            <th class="status-column">
              Status
            </th>

            <th class="detail-column">
            </th>

          </tr>
        </thead>


        <tbody>

          ${visibleStudents.map(student => `
            <tr>

              <td class="participant-cell">
                <div class="participant-name">
                  ${escapeHtml(student.full_name || "Peserta")}
                </div>

                <div class="participant-email">
                  ${escapeHtml(student.email || "")}
                </div>
              </td>


              <td>
                ${renderProgressCompact(student)}
              </td>


              ${(student.module_results || []).map(result =>
                renderQuizCell(result)
              ).join("")}


              <td>
                ${renderFinalCell(student)}
              </td>


              <td>
                ${renderStatusBadge(student)}
              </td>


              <td>
                <button
                  type="button"
                  class="detail-button"
                  data-student-id="${student.user_id}">
                  Detail
                </button>
              </td>

            </tr>
          `).join("")}

        </tbody>

      </table>
    </div>
  `;


  bindDetailButtons();
}


function renderMobileCards() {

  const host =
    document.getElementById("gradeMobileHost");


  if (!visibleStudents.length) {
    host.innerHTML = "";
    return;
  }


  host.innerHTML =
    visibleStudents
      .map(student => {

        const scores =
          (student.module_results || [])
            .map(result => `
              <span class="mobile-score ${result.passed ? "passed" : ""}">
                M${result.position}
                <strong>
                  ${result.best_score ?? "—"}
                </strong>
              </span>
            `)
            .join("");


        return `
          <article class="mobile-student-card">

            <div class="mobile-student-top">

              <div>
                <strong>
                  ${escapeHtml(student.full_name || "Peserta")}
                </strong>

                <span>
                  ${escapeHtml(student.email || "")}
                </span>
              </div>

              ${renderStatusBadge(student)}

            </div>


            <div class="mobile-progress">
              ${renderProgressCompact(student)}
            </div>


            <div class="mobile-score-grid">
              ${scores}

              <span class="mobile-score final ${student.final_passed ? "passed" : ""}">
                Final
                <strong>
                  ${student.final_best_score ?? "—"}
                </strong>
              </span>
            </div>


            <button
              type="button"
              class="detail-button mobile-detail"
              data-student-id="${student.user_id}">
              Lihat detail
            </button>

          </article>
        `;

      })
      .join("");


  bindDetailButtons();
}


function renderProgressCompact(student) {

  const percent =
    Number(student.progress_percent || 0);


  return `
    <div class="progress-compact">

      <div>
        <strong>${percent}%</strong>
        <span>
          ${student.lessons_completed}/${student.lessons_total}
        </span>
      </div>

      <div class="progress-mini-track">
        <span style="width:${Math.min(100, Math.max(0, percent))}%"></span>
      </div>

    </div>
  `;
}


function renderQuizCell(result) {

  if (!result.quiz_id) {
    return `
      <td>
        <span class="score-empty">
          —
        </span>
      </td>
    `;
  }


  if (result.best_score == null) {
    return `
      <td>
        <div class="score-cell">
          <strong>—</strong>
          <small>
            0/${result.max_attempts ?? "∞"}
          </small>
        </div>
      </td>
    `;
  }


  return `
    <td>
      <div class="score-cell ${result.passed ? "passed" : "failed"}">
        <strong>
          ${result.best_score}
        </strong>

        <small>
          ${result.attempts_used}/${result.max_attempts ?? "∞"}
        </small>
      </div>
    </td>
  `;
}


function renderFinalCell(student) {

  const final =
    student.final_result || {};


  if (student.final_best_score == null) {

    return `
      <div class="score-cell final">
        <strong>—</strong>
        <small>
          0/${final.max_attempts ?? "∞"}
        </small>
      </div>
    `;
  }


  return `
    <div class="score-cell final ${student.final_passed ? "passed" : "failed"}">
      <strong>
        ${student.final_best_score}
      </strong>

      <small>
        ${student.final_attempts}/${final.max_attempts ?? "∞"}
      </small>
    </div>
  `;
}


function renderStatusBadge(student) {

  const stage =
    getStudentStage(student);


  if (stage === "graduated") {

    return `
      <span class="status-badge graduated">
        Lulus
      </span>
    `;
  }


  if (stage === "final") {

    return `
      <span class="status-badge final">
        Evaluasi Akhir
      </span>
    `;
  }


  return `
    <span class="status-badge learning">
      Belum selesai
    </span>
  `;
}


function getStudentStage(student) {

  if (student.graduated) {
    return "graduated";
  }


  if (
    student.module_quizzes_total > 0 &&
    student.module_quizzes_passed >=
      student.module_quizzes_total &&
    Number(student.progress_percent || 0) >= 100
  ) {
    return "final";
  }


  return "learning";
}


function bindDetailButtons() {

  document
    .querySelectorAll(".detail-button[data-student-id]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          openStudentDetail(
            button.dataset.studentId
          )
      );
    });
}


function openStudentDetail(studentId) {

  const student =
    (dashboardData.students || [])
      .find(
        item =>
          item.user_id === studentId
      );


  if (!student) return;


  document
    .getElementById("detailName")
    .textContent =
      student.full_name || "Peserta";


  document
    .getElementById("detailEmail")
    .textContent =
      student.email || "";


  document
    .getElementById("detailSummary")
    .innerHTML = `
      <div>
        <span>Checkpoint</span>
        <strong>
          ${student.lessons_completed}/${student.lessons_total}
        </strong>
      </div>

      <div>
        <span>Kuis lulus</span>
        <strong>
          ${student.module_quizzes_passed}/${student.module_quizzes_total}
        </strong>
      </div>

      <div>
        <span>Evaluasi Akhir</span>
        <strong>
          ${student.final_best_score ?? "—"}
        </strong>
      </div>

      <div>
        <span>Status</span>
        <strong>
          ${student.graduated ? "Lulus" : "Belum lulus"}
        </strong>
      </div>
    `;


  document
    .getElementById("detailModules")
    .innerHTML =
      (student.module_results || [])
        .map(result => {

          const lessonPercent =
            result.lessons_total > 0
              ? Math.round(
                  (
                    result.lessons_completed /
                    result.lessons_total
                  ) * 100
                )
              : 0;


          return `
            <article class="detail-module-card">

              <div class="detail-module-title">
                <span>
                  Modul ${result.position}
                </span>

                <strong>
                  ${escapeHtml(result.title)}
                </strong>
              </div>


              <div class="detail-module-values">

                <div>
                  <span>Materi</span>
                  <strong>
                    ${result.lessons_completed}/${result.lessons_total}
                  </strong>
                  <small>
                    ${lessonPercent}%
                  </small>
                </div>

                <div>
                  <span>Nilai terbaik</span>
                  <strong>
                    ${result.best_score ?? "—"}
                  </strong>
                  <small>
                    minimum ${result.pass_score ?? "—"}
                  </small>
                </div>

                <div>
                  <span>Percobaan</span>
                  <strong>
                    ${result.attempts_used}
                  </strong>
                  <small>
                    dari ${result.max_attempts ?? "∞"}
                  </small>
                </div>

              </div>


              <span class="detail-result ${result.passed ? "passed" : ""}">
                ${result.passed ? "Lulus" : "Belum lulus"}
              </span>

            </article>
          `;

        })
        .join("");


  const final =
    student.final_result || {};


  const certificate =
    student.certificate || {
      exists: false
    };


  let certificateAction = "";


  if (student.graduated) {

    if (
      certificate.exists &&
      certificate.status === "active"
    ) {

      certificateAction = `
        <div class="certificate-admin-actions">

          <a
            class="certificate-detail-button view"
            href="sertifikat.html?code=${encodeURIComponent(certificate.verification_code)}"
            target="_blank"
            rel="noopener">
            Lihat Sertifikat
          </a>

          <button
            type="button"
            class="certificate-detail-button revoke"
            id="revokeCertificateBtn">
            Cabut
          </button>

        </div>
      `;

    } else {

      const isReissue =
        certificate.exists &&
        certificate.status === "revoked";

      certificateAction = `
        <button
          type="button"
          class="certificate-detail-button issue"
          id="issueCertificateBtn"
          data-student-id="${student.user_id}">
          ${isReissue ? "Terbitkan Ulang" : "Terbitkan Sertifikat"}
        </button>
      `;
    }
  }


  document
    .getElementById("detailFinal")
    .innerHTML = `
      <div class="detail-final-copy">

        <div class="grade-kicker">
          Evaluasi Akhir
        </div>

        <h3>
          PPh Pasal 21
        </h3>

        <p>
          Nilai minimum ${final.pass_score ?? 70}.
        </p>

      </div>


      <div class="detail-final-score">

        <span>
          Nilai terbaik
        </span>

        <strong>
          ${student.final_best_score ?? "—"}
        </strong>

        <small>
          ${student.final_attempts || 0}/${final.max_attempts ?? "∞"} percobaan
        </small>

      </div>


      <div class="detail-final-actions">

        <span class="detail-final-state ${student.final_passed ? "passed" : ""}">
          ${student.final_passed ? "Lulus" : "Belum lulus"}
        </span>

        ${certificateAction}

      </div>

      <div class="certificate-admin-summary">
        ${
          certificate.exists
            ? `
              <div>
                <span>Sertifikat terakhir</span>
                <strong>${escapeHtml(certificate.certificate_number || "—")}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong class="${certificate.status === "active" ? "certificate-status-active" : "certificate-status-revoked"}">
                  ${certificate.status === "active" ? "Aktif" : "Dicabut"}
                </strong>
              </div>

              <div>
                <span>Tanggal terbit</span>
                <strong>${formatDateTime(certificate.issued_at)}</strong>
              </div>
            `
            : `
              <div>
                <span>Sertifikat</span>
                <strong>Belum diterbitkan</strong>
              </div>
            `
        }
      </div>

      <div
        class="certificate-history-host"
        id="certificateHistoryHost">
        <span>Memuat riwayat sertifikat…</span>
      </div>
    `;


  document
    .getElementById("studentDetailModal")
    .showModal();


  document
    .getElementById("issueCertificateBtn")
    ?.addEventListener(
      "click",
      () => issueCertificate(student)
    );


  document
    .getElementById("revokeCertificateBtn")
    ?.addEventListener(
      "click",
      () => openRevokeCertificateModal(
        student,
        certificate
      )
    );


  loadCertificateHistory(student);
}


async function issueCertificate(student) {

  const button =
    document.getElementById(
      "issueCertificateBtn"
    );


  if (!button) return;


  const currentCertificate =
    student.certificate || {
      exists: false
    };


  const reissue =
    currentCertificate.exists &&
    currentCertificate.status === "revoked";


  const confirmed =
    confirm(
      `${reissue ? "Terbitkan ulang" : "Terbitkan"} sertifikat untuk ${student.full_name || student.email || "peserta"}?\n\n` +
      `${reissue ? "Nomor dan QR baru akan dibuat. Sertifikat lama tetap tersimpan sebagai riwayat." : "Sertifikat akan mempunyai nomor unik dan QR verifikasi online."}`
    );


  if (!confirmed) return;


  const originalText =
    button.textContent;


  button.disabled = true;
  button.textContent =
    "Menerbitkan…";


  try {

    const { data, error } =
      await window.kabayanSupabase.rpc(
        "issue_certificate",
        {
          p_class_id: classId,
          p_user_id: student.user_id
        }
      );


    if (error) throw error;


    const code =
      data?.verification_code;


    if (!code) {
      throw new Error(
        "Kode verifikasi sertifikat tidak diterima."
      );
    }


    await loadDashboard();


    document
      .getElementById("studentDetailModal")
      .close();


    window.open(
      `sertifikat.html?code=${encodeURIComponent(code)}`,
      "_blank",
      "noopener"
    );


  } catch (error) {

    console.error(error);

    alert(
      error.message ||
      "Sertifikat belum dapat diterbitkan."
    );


    button.disabled = false;
    button.textContent =
      originalText;
  }
}



async function loadCertificateHistory(student) {

  const host =
    document.getElementById(
      "certificateHistoryHost"
    );


  if (!host) return;


  const { data, error } =
    await window.kabayanSupabase.rpc(
      "get_certificate_history",
      {
        p_class_id: classId,
        p_user_id: student.user_id
      }
    );


  if (error) {

    host.innerHTML = `
      <span>
        Riwayat sertifikat belum dapat dimuat.
      </span>
    `;

    return;
  }


  const rows =
    Array.isArray(data)
      ? data
      : [];


  if (!rows.length) {

    host.innerHTML = `
      <span>
        Belum ada riwayat penerbitan sertifikat.
      </span>
    `;

    return;
  }


  host.innerHTML = `
    <div class="certificate-history-head">
      <strong>Riwayat Sertifikat</strong>
      <span>${rows.length} penerbitan</span>
    </div>

    <div class="certificate-history-list">

      ${rows.map((row, index) => `
        <article class="certificate-history-item">

          <div class="certificate-history-index">
            ${rows.length - index}
          </div>

          <div class="certificate-history-copy">
            <strong>
              ${escapeHtml(row.certificate_number || "—")}
            </strong>

            <span>
              Diterbitkan ${formatDateTime(row.issued_at)}
            </span>

            ${
              row.status === "revoked"
                ? `
                  <small>
                    Dicabut ${formatDateTime(row.revoked_at)}
                    ${row.revocation_reason ? ` · ${escapeHtml(row.revocation_reason)}` : ""}
                  </small>
                `
                : `
                  <small>
                    Sertifikat aktif
                  </small>
                `
            }
          </div>

          <div class="certificate-history-actions">

            <span class="certificate-history-status ${row.status}">
              ${row.status === "active" ? "Aktif" : "Dicabut"}
            </span>

            <a
              href="verifikasi-sertifikat.html?code=${encodeURIComponent(row.verification_code)}"
              target="_blank"
              rel="noopener">
              Verifikasi
            </a>

          </div>

        </article>
      `).join("")}

    </div>
  `;
}


function openRevokeCertificateModal(
  student,
  certificate
) {

  if (
    !certificate?.id ||
    certificate.status !== "active"
  ) {
    return;
  }


  pendingCertificateRevocation = {
    studentId: student.user_id,
    studentName:
      student.full_name ||
      student.email ||
      "peserta",
    certificateId:
      certificate.id,
    certificateNumber:
      certificate.certificate_number
  };


  document
    .getElementById("studentDetailModal")
    .close();


  document
    .getElementById("revokeCertificateReason")
    .value = "";


  document
    .getElementById("revokeCertificateModal")
    .showModal();


  setTimeout(
    () =>
      document
        .getElementById("revokeCertificateReason")
        ?.focus(),
    50
  );
}


function closeRevokeCertificateModal() {

  pendingCertificateRevocation = null;


  document
    .getElementById("revokeCertificateModal")
    ?.close();
}


async function submitCertificateRevocation(event) {

  event.preventDefault();


  if (!pendingCertificateRevocation) {
    return;
  }


  const reason =
    document
      .getElementById("revokeCertificateReason")
      .value
      .trim();


  if (reason.length < 5) {

    alert(
      "Tuliskan alasan pencabutan minimal 5 karakter."
    );

    return;
  }


  const confirmButton =
    event.currentTarget
      .querySelector(
        ".certificate-revoke-confirm"
      );


  const originalText =
    confirmButton.textContent;


  confirmButton.disabled = true;
  confirmButton.textContent =
    "Mencabut…";


  const studentId =
    pendingCertificateRevocation.studentId;


  try {

    const { error } =
      await window.kabayanSupabase.rpc(
        "revoke_certificate",
        {
          p_certificate_id:
            pendingCertificateRevocation.certificateId,
          p_reason:
            reason
        }
      );


    if (error) throw error;


    closeRevokeCertificateModal();

    await loadDashboard();


    openStudentDetail(
      studentId
    );


  } catch (error) {

    console.error(error);

    alert(
      error.message ||
      "Sertifikat belum dapat dicabut."
    );


  } finally {

    confirmButton.disabled = false;
    confirmButton.textContent =
      originalText;
  }
}


function formatDateTime(value) {

  if (!value) return "—";


  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta"
    }
  ).format(
    new Date(value)
  );
}

function exportCsv() {

  if (!dashboardData || !visibleStudents.length) {
    alert("Tidak ada data untuk diunduh.");
    return;
  }


  const modules =
    dashboardData.modules || [];


  const header = [
    "Nama",
    "Email",
    "Checkpoint Selesai",
    "Total Checkpoint",
    "Progress",
    ...modules.flatMap(module => [
      `Modul ${module.position} Nilai`,
      `Modul ${module.position} Percobaan`,
      `Modul ${module.position} Lulus`
    ]),
    "Evaluasi Akhir",
    "Percobaan Final",
    "Final Lulus",
    "Status Kelulusan",
    "Nomor Sertifikat"
  ];


  const rows =
    visibleStudents.map(student => {

      const moduleValues =
        modules.flatMap(module => {

          const result =
            (student.module_results || [])
              .find(
                item =>
                  item.module_id ===
                  module.module_id
              ) || {};


          return [
            result.best_score ?? "",
            result.attempts_used ?? 0,
            result.passed ? "Ya" : "Tidak"
          ];
        });


      return [
        student.full_name || "",
        student.email || "",
        student.lessons_completed || 0,
        student.lessons_total || 0,
        `${student.progress_percent || 0}%`,
        ...moduleValues,
        student.final_best_score ?? "",
        student.final_attempts || 0,
        student.final_passed ? "Ya" : "Tidak",
        student.graduated ? "Lulus" : "Belum Lulus",
        student.certificate?.certificate_number ?? ""
      ];
    });


  const csv =
    [header, ...rows]
      .map(row =>
        row.map(csvEscape).join(",")
      )
      .join("\r\n");


  const blob =
    new Blob(
      ["\uFEFF" + csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const anchor =
    document.createElement("a");


  const className =
    (dashboardData.class?.name || "kelas")
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "");


  anchor.href = url;
  anchor.download =
    `nilai-${className || "kelas"}.csv`;


  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();


  URL.revokeObjectURL(url);
}


function csvEscape(value) {

  const text =
    String(value ?? "");


  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {

    return `"${text.replace(/"/g, '""')}"`;
  }


  return text;
}


function setRefreshState(isLoading) {

  const button =
    document.getElementById("refreshBtn");


  if (!button) return;


  button.disabled = isLoading;
  button.textContent =
    isLoading
      ? "Memuat…"
      : "Muat ulang";
}


function showPageError(message) {

  document
    .getElementById("gradeTableHost")
    .innerHTML = `
      <div class="grade-error">
        <strong>Dashboard nilai belum dapat dimuat.</strong>
        <span>${escapeHtml(message || "Terjadi kesalahan.")}</span>
      </div>
    `;


  document
    .getElementById("gradeMobileHost")
    .innerHTML = "";
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
