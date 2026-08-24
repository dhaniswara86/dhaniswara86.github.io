const params =
  new URLSearchParams(
    location.search
  );

const classId =
  params.get("id");

let reportData = null;
let visibleStudents = [];
let selectedStudent = null;


document.addEventListener(
  "DOMContentLoaded",
  async () => {

    try {

      await window.KabayanAuth.requireRole(
        "teacher"
      );


      if (!classId) {

        location.replace(
          "pengajar-dashboard.html"
        );

        return;
      }


      document
        .getElementById("backToGrades")
        .href =
          `nilai-kelas.html?id=${encodeURIComponent(classId)}`;


      bindControls();

      await loadReport();


    } catch (error) {

      console.error(error);

      renderPageError(
        error.message
      );
    }
  }
);


function bindControls() {

  document
    .getElementById("reportSearch")
    ?.addEventListener(
      "input",
      applyFilters
    );


  document
    .getElementById("reportStatusFilter")
    ?.addEventListener(
      "change",
      applyFilters
    );


  document
    .getElementById("exportExcelBtn")
    ?.addEventListener(
      "click",
      exportExcel
    );


  document
    .getElementById("exportCsvBtn")
    ?.addEventListener(
      "click",
      exportCsv
    );


  document
    .getElementById("exportPdfBtn")
    ?.addEventListener(
      "click",
      exportClassPdf
    );


  document
    .getElementById("closeParticipantReport")
    ?.addEventListener(
      "click",
      () =>
        document
          .getElementById("participantReportModal")
          .close()
    );


  document
    .getElementById("participantPdfBtn")
    ?.addEventListener(
      "click",
      () => {

        if (
          selectedStudent
        ) {
          exportParticipantPdf(
            selectedStudent
          );
        }
      }
    );
}


async function loadReport() {

  const { data, error } =
    await window.kabayanSupabase.rpc(
      "get_class_grade_dashboard",
      {
        p_class_id: classId
      }
    );


  if (error) throw error;


  reportData =
    data || {
      class: {},
      modules: [],
      final_evaluation: {},
      summary: {},
      students: []
    };


  renderHeader();
  renderSummary();
  applyFilters();
}


function renderHeader() {

  const classData =
    reportData?.class || {};


  document
    .getElementById("reportClassName")
    .textContent =
      classData.name ||
      "Laporan Belajar";


  document
    .getElementById("reportClassDescription")
    .textContent =
      classData.description ||
      "Rekap progres, nilai, kelulusan, dan sertifikat peserta.";
}


function renderSummary() {

  const summary =
    reportData?.summary || {};


  const certificateCount =
    (reportData.students || [])
      .filter(
        student =>
          student.certificate?.exists &&
          student.certificate?.status === "active"
      )
      .length;


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
    .getElementById("summaryCertificates")
    .textContent =
      certificateCount;


  document
    .getElementById("heroParticipantCount")
    .textContent =
      summary.active_count ?? 0;
}


function applyFilters() {

  if (!reportData) return;


  const query =
    document
      .getElementById("reportSearch")
      .value
      .trim()
      .toLowerCase();


  const status =
    document
      .getElementById("reportStatusFilter")
      .value;


  visibleStudents =
    (reportData.students || [])
      .filter(student => {

        const haystack =
          `${student.full_name || ""} ${student.email || ""}`
            .toLowerCase();


        const searchMatch =
          !query ||
          haystack.includes(query);


        let statusMatch = true;


        if (
          status === "graduated"
        ) {
          statusMatch =
            student.graduated === true;
        }


        if (
          status === "not_graduated"
        ) {
          statusMatch =
            student.graduated !== true;
        }


        if (
          status === "certificate"
        ) {
          statusMatch =
            student.certificate?.exists === true &&
            student.certificate?.status === "active";
        }


        return (
          searchMatch &&
          statusMatch
        );
      });


  renderDesktopTable();
  renderMobileCards();


  document
    .getElementById("reportVisibleCount")
    .textContent =
      `${visibleStudents.length} peserta`;
}


function renderDesktopTable() {

  const host =
    document.getElementById(
      "reportTableHost"
    );


  if (!visibleStudents.length) {

    host.innerHTML = `
      <div class="report-empty">
        Tidak ada peserta yang sesuai dengan filter.
      </div>
    `;

    return;
  }


  const modules =
    reportData.modules || [];


  host.innerHTML = `
    <div class="report-table-wrap">

      <table class="report-table">

        <thead>

          <tr>

            <th class="report-participant-col">
              Peserta
            </th>

            <th>
              Materi
            </th>

            ${modules.map(module => `
              <th
                title="${escapeHtml(module.title)}">
                M${module.position}
              </th>
            `).join("")}

            <th>
              Final
            </th>

            <th>
              Status
            </th>

            <th>
              Sertifikat
            </th>

            <th></th>

          </tr>

        </thead>


        <tbody>

          ${visibleStudents.map(student => `
            <tr>

              <td class="report-participant-cell">

                <strong>
                  ${escapeHtml(student.full_name || "Peserta")}
                </strong>

                <span>
                  ${escapeHtml(student.email || "")}
                </span>

              </td>


              <td>
                <div class="report-progress-cell">
                  <strong>
                    ${student.lessons_completed}/${student.lessons_total}
                  </strong>

                  <small>
                    ${student.progress_percent || 0}%
                  </small>
                </div>
              </td>


              ${(student.module_results || []).map(result => `
                <td>
                  ${renderScoreCell(result)}
                </td>
              `).join("")}


              <td>
                ${renderFinalCell(student)}
              </td>


              <td>
                ${renderGraduationStatus(student)}
              </td>


              <td>
                ${renderCertificateStatus(student)}
              </td>


              <td>
                <button
                  type="button"
                  class="report-detail-button"
                  data-user-id="${student.user_id}">
                  Laporan
                </button>
              </td>

            </tr>
          `).join("")}

        </tbody>

      </table>

    </div>
  `;


  bindReportDetailButtons();
}


function renderMobileCards() {

  const host =
    document.getElementById(
      "reportMobileHost"
    );


  if (!visibleStudents.length) {
    host.innerHTML = "";
    return;
  }


  host.innerHTML =
    visibleStudents
      .map(student => {

        const modules =
          student.module_results || [];


        return `
          <article class="report-mobile-card">

            <div class="report-mobile-head">

              <div>
                <strong>
                  ${escapeHtml(student.full_name || "Peserta")}
                </strong>

                <span>
                  ${escapeHtml(student.email || "")}
                </span>
              </div>

              ${renderGraduationStatus(student)}

            </div>


            <div class="report-mobile-progress">

              <div>
                <span>Materi</span>
                <strong>
                  ${student.lessons_completed}/${student.lessons_total}
                </strong>
              </div>

              <div class="report-mobile-track">
                <span
                  style="width:${clampPercent(student.progress_percent)}%">
                </span>
              </div>

            </div>


            <div class="report-mobile-scores">

              ${modules.map(result => `
                <div class="${result.passed ? "passed" : ""}">
                  <span>M${result.position}</span>
                  <strong>
                    ${result.best_score ?? "—"}
                  </strong>
                </div>
              `).join("")}

              <div class="final ${student.final_passed ? "passed" : ""}">
                <span>Final</span>
                <strong>
                  ${student.final_best_score ?? "—"}
                </strong>
              </div>

            </div>


            <div class="report-mobile-bottom">

              ${renderCertificateStatus(student)}

              <button
                type="button"
                class="report-detail-button"
                data-user-id="${student.user_id}">
                Lihat laporan
              </button>

            </div>

          </article>
        `;

      })
      .join("");


  bindReportDetailButtons();
}


function renderScoreCell(
  result
) {

  if (
    result.best_score == null
  ) {

    return `
      <div class="report-score empty">
        <strong>—</strong>
        <small>
          ${result.attempts_used || 0}/${result.max_attempts ?? "∞"}
        </small>
      </div>
    `;
  }


  return `
    <div class="report-score ${result.passed ? "passed" : "failed"}">

      <strong>
        ${result.best_score}
      </strong>

      <small>
        ${result.attempts_used || 0}/${result.max_attempts ?? "∞"}
      </small>

    </div>
  `;
}


function renderFinalCell(
  student
) {

  return `
    <div class="report-score final ${student.final_passed ? "passed" : ""}">

      <strong>
        ${student.final_best_score ?? "—"}
      </strong>

      <small>
        ${student.final_attempts || 0}/${student.final_result?.max_attempts ?? "∞"}
      </small>

    </div>
  `;
}


function renderGraduationStatus(
  student
) {

  return `
    <span class="report-status ${student.graduated ? "graduated" : "pending"}">
      ${student.graduated ? "Lulus" : "Belum lulus"}
    </span>
  `;
}


function renderCertificateStatus(
  student
) {

  const certificate =
    student.certificate || {
      exists: false
    };


  if (
    certificate.exists &&
    certificate.status === "active"
  ) {

    return `
      <span class="report-certificate-status active">
        Aktif
      </span>
    `;
  }


  if (
    certificate.exists &&
    certificate.status === "revoked"
  ) {

    return `
      <span class="report-certificate-status revoked">
        Dicabut
      </span>
    `;
  }


  return `
    <span class="report-certificate-status none">
      Belum terbit
    </span>
  `;
}


function bindReportDetailButtons() {

  document
    .querySelectorAll(
      ".report-detail-button[data-user-id]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const student =
            (reportData.students || [])
              .find(
                item =>
                  item.user_id ===
                  button.dataset.userId
              );


          if (
            student
          ) {
            openParticipantReport(
              student
            );
          }
        }
      );
    });
}


function openParticipantReport(
  student
) {

  selectedStudent =
    student;


  document
    .getElementById("participantReportName")
    .textContent =
      student.full_name ||
      "Peserta";


  document
    .getElementById("participantReportEmail")
    .textContent =
      student.email || "";


  document
    .getElementById("participantReportSummary")
    .innerHTML = `
      <div>
        <span>Checkpoint</span>
        <strong>
          ${student.lessons_completed}/${student.lessons_total}
        </strong>
      </div>

      <div>
        <span>Progres</span>
        <strong>
          ${student.progress_percent || 0}%
        </strong>
      </div>

      <div>
        <span>Kuis Lulus</span>
        <strong>
          ${student.module_quizzes_passed}/${student.module_quizzes_total}
        </strong>
      </div>

      <div>
        <span>Status</span>
        <strong class="${student.graduated ? "text-success" : ""}">
          ${student.graduated ? "Lulus" : "Belum lulus"}
        </strong>
      </div>
    `;


  document
    .getElementById("participantModuleReport")
    .innerHTML =
      (student.module_results || [])
        .map(result => {

          const materialPercent =
            result.lessons_total > 0
              ? Math.round(
                  (
                    result.lessons_completed /
                    result.lessons_total
                  ) * 100
                )
              : 0;


          return `
            <article class="participant-module-row">

              <div class="participant-module-title">

                <span>
                  Modul ${result.position}
                </span>

                <strong>
                  ${escapeHtml(result.title)}
                </strong>

              </div>


              <div>
                <span>Materi</span>
                <strong>
                  ${result.lessons_completed}/${result.lessons_total}
                </strong>
                <small>
                  ${materialPercent}%
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
                  ${result.attempts_used || 0}
                </strong>
                <small>
                  dari ${result.max_attempts ?? "∞"}
                </small>
              </div>


              <span class="participant-module-state ${result.passed ? "passed" : ""}">
                ${result.passed ? "Lulus" : "Belum lulus"}
              </span>

            </article>
          `;

        })
        .join("");


  const certificate =
    student.certificate || {
      exists: false
    };


  document
    .getElementById("participantFinalReport")
    .innerHTML = `
      <div>

        <div class="report-kicker">
          Evaluasi Akhir
        </div>

        <h3>
          ${escapeHtml(reportData.class?.name || "Kelas")}
        </h3>

        <p>
          Nilai minimum ${reportData.final_evaluation?.pass_score ?? 70}.
        </p>

      </div>


      <div class="participant-final-score">

        <span>
          Nilai terbaik
        </span>

        <strong>
          ${student.final_best_score ?? "—"}
        </strong>

        <small>
          ${student.final_attempts || 0}/${student.final_result?.max_attempts ?? "∞"}
          percobaan
        </small>

      </div>


      <div class="participant-final-certificate">

        <span class="${student.graduated ? "passed" : ""}">
          ${student.graduated ? "Lulus" : "Belum lulus"}
        </span>

        ${
          certificate.exists
            ? `
              <small>
                ${escapeHtml(certificate.certificate_number || "")}
              </small>
            `
            : `
              <small>
                Sertifikat belum diterbitkan
              </small>
            `
        }

      </div>
    `;


  document
    .getElementById("participantReportModal")
    .showModal();
}


/* ============================================================
   EXCEL
   ============================================================ */

function exportExcel() {

  if (
    !visibleStudents.length
  ) {

    alert(
      "Tidak ada data untuk diekspor."
    );

    return;
  }


  const summaryRows =
    visibleStudents.map(
      buildSummaryExportRow
    );


  const detailRows = [];


  visibleStudents.forEach(
    student => {

      (student.module_results || [])
        .forEach(result => {

          detailRows.push({
            "Nama Peserta":
              student.full_name || "",
            "Email":
              student.email || "",
            "Modul":
              `Modul ${result.position}`,
            "Judul Modul":
              result.title || "",
            "Materi Selesai":
              result.lessons_completed || 0,
            "Total Materi":
              result.lessons_total || 0,
            "Nilai Terbaik":
              result.best_score ?? "",
            "Nilai Minimum":
              result.pass_score ?? "",
            "Percobaan":
              result.attempts_used || 0,
            "Maksimum Percobaan":
              result.max_attempts ?? "",
            "Status":
              result.passed
                ? "Lulus"
                : "Belum Lulus"
          });
        });
    }
  );


  const workbook =
    XLSX.utils.book_new();


  const summarySheet =
    XLSX.utils.json_to_sheet(
      summaryRows
    );


  const detailSheet =
    XLSX.utils.json_to_sheet(
      detailRows
    );


  summarySheet["!cols"] = [
    { wch: 24 },
    { wch: 30 },
    { wch: 14 },
    { wch: 14 },
    ...Array.from(
      {
        length:
          (reportData.modules || []).length
      },
      () => ({
        wch: 11
      })
    ),
    { wch: 12 },
    { wch: 14 },
    { wch: 24 }
  ];


  detailSheet["!cols"] = [
    { wch: 24 },
    { wch: 30 },
    { wch: 12 },
    { wch: 28 },
    { wch: 14 },
    { wch: 12 },
    { wch: 14 },
    { wch: 14 },
    { wch: 12 },
    { wch: 18 },
    { wch: 14 }
  ];


  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Rekap Peserta"
  );


  XLSX.utils.book_append_sheet(
    workbook,
    detailSheet,
    "Detail Modul"
  );


  XLSX.writeFile(
    workbook,
    `laporan-belajar-${safeClassName()}.xlsx`
  );
}


/* ============================================================
   CSV
   ============================================================ */

function exportCsv() {

  if (
    !visibleStudents.length
  ) {

    alert(
      "Tidak ada data untuk diekspor."
    );

    return;
  }


  const rows =
    visibleStudents.map(
      buildSummaryExportRow
    );


  const headers =
    Object.keys(
      rows[0]
    );


  const lines = [
    headers,
    ...rows.map(
      row =>
        headers.map(
          header =>
            row[header]
        )
    )
  ];


  const csv =
    lines
      .map(
        row =>
          row
            .map(csvEscape)
            .join(",")
      )
      .join("\r\n");


  downloadBlob(
    "\uFEFF" + csv,
    "text/csv;charset=utf-8",
    `laporan-belajar-${safeClassName()}.csv`
  );
}


/* ============================================================
   CLASS PDF
   ============================================================ */

function exportClassPdf() {

  if (
    !visibleStudents.length
  ) {

    alert(
      "Tidak ada data untuk diekspor."
    );

    return;
  }


  const { jsPDF } =
    window.jspdf;


  const pdf =
    new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      compress: true
    });


  drawPdfHeader(
    pdf,
    "Laporan Belajar Kelas",
    reportData.class?.name || "Kelas"
  );


  const summary =
    reportData.summary || {};


  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    8
  );

  pdf.setTextColor(
    95,
    108,
    126
  );


  pdf.text(
    `Peserta aktif: ${summary.active_count ?? 0}   |   Lulus: ${summary.graduated_count ?? 0}   |   Rata-rata progres: ${summary.average_progress ?? 0}%   |   Rata-rata Evaluasi Akhir: ${summary.average_final_score ?? "—"}`,
    14,
    34
  );


  const head = [[
    "Peserta",
    "Progres",
    ...(reportData.modules || [])
      .map(
        module =>
          `M${module.position}`
      ),
    "Final",
    "Status",
    "Sertifikat"
  ]];


  const body =
    visibleStudents.map(
      student => [
        `${student.full_name || "Peserta"}\n${student.email || ""}`,
        `${student.lessons_completed}/${student.lessons_total}\n${student.progress_percent || 0}%`,
        ...(student.module_results || [])
          .map(
            result =>
              result.best_score == null
                ? "—"
                : `${result.best_score}\n${result.attempts_used || 0}/${result.max_attempts ?? "∞"}`
          ),
        student.final_best_score == null
          ? "—"
          : `${student.final_best_score}\n${student.final_attempts || 0}/${student.final_result?.max_attempts ?? "∞"}`,
        student.graduated
          ? "Lulus"
          : "Belum",
        student.certificate?.status === "active"
          ? student.certificate?.certificate_number || "Aktif"
          : (
              student.certificate?.status === "revoked"
                ? "Dicabut"
                : "Belum terbit"
            )
      ]
    );


  pdf.autoTable({
    startY: 40,
    head,
    body,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 6.4,
      cellPadding: 2.2,
      valign: "middle",
      textColor: [45, 57, 75],
      lineColor: [221, 227, 235],
      lineWidth: .15
    },
    headStyles: {
      fillColor: [20, 65, 120],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: {
        cellWidth: 45
      },
      1: {
        cellWidth: 18
      }
    },
    margin: {
      left: 14,
      right: 14
    }
  });


  drawPdfFooter(
    pdf
  );


  pdf.save(
    `laporan-belajar-${safeClassName()}.pdf`
  );
}


/* ============================================================
   PARTICIPANT PDF
   ============================================================ */

function exportParticipantPdf(
  student
) {

  const { jsPDF } =
    window.jspdf;


  const pdf =
    new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });


  drawPdfHeader(
    pdf,
    "Laporan Belajar Peserta",
    reportData.class?.name || "Kelas"
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    15
  );

  pdf.setTextColor(
    26,
    39,
    58
  );

  pdf.text(
    student.full_name ||
    "Peserta",
    14,
    39
  );


  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    8
  );

  pdf.setTextColor(
    105,
    118,
    137
  );

  pdf.text(
    student.email || "",
    14,
    44
  );


  const certificate =
    student.certificate || {
      exists: false
    };


  const summaryData = [
    [
      "Checkpoint",
      `${student.lessons_completed}/${student.lessons_total}`
    ],
    [
      "Progres",
      `${student.progress_percent || 0}%`
    ],
    [
      "Kuis Modul Lulus",
      `${student.module_quizzes_passed}/${student.module_quizzes_total}`
    ],
    [
      "Evaluasi Akhir",
      student.final_best_score ?? "—"
    ],
    [
      "Status Kelulusan",
      student.graduated
        ? "Lulus"
        : "Belum Lulus"
    ],
    [
      "Nomor Sertifikat",
      certificate.exists
        ? certificate.certificate_number || "—"
        : "Belum diterbitkan"
    ]
  ];


  pdf.autoTable({
    startY: 50,
    body: summaryData,
    theme: "plain",
    styles: {
      fontSize: 8,
      cellPadding: 2.4,
      textColor: [45, 57, 75]
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 48
      }
    },
    margin: {
      left: 14,
      right: 14
    }
  });


  const moduleHead = [[
    "Modul",
    "Materi",
    "Nilai",
    "Minimum",
    "Percobaan",
    "Status"
  ]];


  const moduleBody =
    (student.module_results || [])
      .map(
        result => [
          `M${result.position} — ${result.title}`,
          `${result.lessons_completed}/${result.lessons_total}`,
          result.best_score ?? "—",
          result.pass_score ?? "—",
          `${result.attempts_used || 0}/${result.max_attempts ?? "∞"}`,
          result.passed
            ? "Lulus"
            : "Belum Lulus"
        ]
      );


  pdf.autoTable({
    startY:
      pdf.lastAutoTable.finalY + 7,
    head: moduleHead,
    body: moduleBody,
    theme: "grid",
    styles: {
      fontSize: 7.2,
      cellPadding: 2.3,
      valign: "middle",
      textColor: [45, 57, 75],
      lineColor: [221, 227, 235],
      lineWidth: .15
    },
    headStyles: {
      fillColor: [20, 65, 120],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    columnStyles: {
      0: {
        cellWidth: 62
      }
    },
    margin: {
      left: 14,
      right: 14
    }
  });


  const finalStart =
    pdf.lastAutoTable.finalY + 10;


  pdf.setFillColor(
    18,
    49,
    91
  );

  pdf.roundedRect(
    14,
    finalStart,
    182,
    30,
    3,
    3,
    "F"
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    7
  );

  pdf.setTextColor(
    130,
    181,
    255
  );

  pdf.text(
    "EVALUASI AKHIR",
    20,
    finalStart + 8
  );


  pdf.setFontSize(
    13
  );

  pdf.setTextColor(
    255,
    255,
    255
  );

  pdf.text(
    reportData.class?.name ||
    "Kelas",
    20,
    finalStart + 16
  );


  pdf.setFontSize(
    8
  );

  pdf.text(
    `Nilai terbaik: ${student.final_best_score ?? "—"}   |   Percobaan: ${student.final_attempts || 0}/${student.final_result?.max_attempts ?? "∞"}   |   Status: ${student.final_passed ? "Lulus" : "Belum Lulus"}`,
    20,
    finalStart + 24
  );


  drawPdfFooter(
    pdf
  );


  pdf.save(
    `laporan-${safeFilename(student.full_name || student.email || "peserta")}.pdf`
  );
}


/* ============================================================
   EXPORT ROW
   ============================================================ */

function buildSummaryExportRow(
  student
) {

  const row = {
    "Nama Peserta":
      student.full_name || "",
    "Email":
      student.email || "",
    "Checkpoint Selesai":
      student.lessons_completed || 0,
    "Total Checkpoint":
      student.lessons_total || 0,
    "Progress":
      `${student.progress_percent || 0}%`
  };


  (reportData.modules || [])
    .forEach(module => {

      const result =
        (student.module_results || [])
          .find(
            item =>
              item.module_id ===
              module.module_id
          ) || {};


      row[
        `M${module.position} Nilai`
      ] =
        result.best_score ?? "";


      row[
        `M${module.position} Percobaan`
      ] =
        `${result.attempts_used || 0}/${result.max_attempts ?? ""}`;
    });


  row["Evaluasi Akhir"] =
    student.final_best_score ?? "";


  row["Percobaan Final"] =
    `${student.final_attempts || 0}/${student.final_result?.max_attempts ?? ""}`;


  row["Status Kelulusan"] =
    student.graduated
      ? "Lulus"
      : "Belum Lulus";


  row["Nomor Sertifikat"] =
    student.certificate?.status === "active"
      ? student.certificate?.certificate_number || ""
      : "";


  return row;
}


/* ============================================================
   PDF HELPERS
   ============================================================ */

function drawPdfHeader(
  pdf,
  title,
  subtitle
) {

  pdf.setFillColor(
    18,
    49,
    91
  );

  pdf.rect(
    0,
    0,
    pdf.internal.pageSize.getWidth(),
    24,
    "F"
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    13
  );

  pdf.setTextColor(
    255,
    255,
    255
  );

  pdf.text(
    "Kabayan Learning",
    14,
    10
  );


  pdf.setFontSize(
    7
  );

  pdf.setTextColor(
    159,
    198,
    255
  );

  pdf.text(
    "LAPORAN PEMBELAJARAN",
    14,
    16
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    15
  );

  pdf.setTextColor(
    28,
    41,
    60
  );

  pdf.text(
    title,
    14,
    30
  );


  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    8
  );

  pdf.setTextColor(
    105,
    118,
    137
  );

  pdf.text(
    subtitle,
    pdf.internal.pageSize.getWidth() - 14,
    30,
    {
      align: "right"
    }
  );
}


function drawPdfFooter(
  pdf
) {

  const totalPages =
    pdf.internal.getNumberOfPages();


  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {

    pdf.setPage(
      page
    );


    const width =
      pdf.internal.pageSize.getWidth();


    const height =
      pdf.internal.pageSize.getHeight();


    pdf.setDrawColor(
      223,
      229,
      237
    );

    pdf.line(
      14,
      height - 12,
      width - 14,
      height - 12
    );


    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(
      6.5
    );

    pdf.setTextColor(
      130,
      142,
      158
    );


    pdf.text(
      `Kabayan Learning · ${formatDate(new Date())}`,
      14,
      height - 7
    );


    pdf.text(
      `Halaman ${page} dari ${totalPages}`,
      width - 14,
      height - 7,
      {
        align: "right"
      }
    );
  }
}


/* ============================================================
   HELPERS
   ============================================================ */

function safeClassName() {

  return safeFilename(
    reportData.class?.name ||
    "kelas"
  );
}


function safeFilename(
  value
) {

  return String(
    value || "file"
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/gi,
      "-"
    )
    .replace(
      /^-|-$/g,
      ""
    );
}


function csvEscape(
  value
) {

  const text =
    String(
      value ?? ""
    );


  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {

    return `"${text.replace(/"/g, '""')}"`;
  }


  return text;
}


function downloadBlob(
  content,
  type,
  filename
) {

  const blob =
    new Blob(
      [content],
      {
        type
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const anchor =
    document.createElement(
      "a"
    );


  anchor.href =
    url;


  anchor.download =
    filename;


  document.body.appendChild(
    anchor
  );


  anchor.click();
  anchor.remove();


  URL.revokeObjectURL(
    url
  );
}


function formatDate(
  value
) {

  if (!value) return "—";


  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta"
    }
  ).format(
    new Date(value)
  );
}


function clampPercent(
  value
) {

  return Math.min(
    100,
    Math.max(
      0,
      Number(value || 0)
    )
  );
}


function renderPageError(
  message
) {

  document
    .getElementById("reportTableHost")
    .innerHTML = `
      <div class="report-error">
        <strong>
          Laporan belum dapat dimuat.
        </strong>

        <span>
          ${escapeHtml(message || "Terjadi kesalahan.")}
        </span>
      </div>
    `;
}


function escapeHtml(
  value = ""
) {

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
