const params =
  new URLSearchParams(location.search);

const verificationCode =
  params.get("code");

let certificateData = null;


document.addEventListener(
  "DOMContentLoaded",
  async () => {

    if (!verificationCode) {
      showError(
        "Kode sertifikat tidak ditemukan."
      );
      return;
    }


    try {

      await loadCertificate();


      document
        .getElementById("printBtn")
        ?.addEventListener(
          "click",
          () => window.print()
        );


      document
        .getElementById("downloadPdfBtn")
        ?.addEventListener(
          "click",
          downloadPdf
        );


    } catch (error) {

      console.error(error);

      showError(
        error.message ||
        "Sertifikat tidak dapat dimuat."
      );
    }
  }
);


async function loadCertificate() {

  const { data, error } =
    await window.kabayanSupabase.rpc(
      "verify_certificate",
      {
        p_verification_code:
          verificationCode
      }
    );


  if (error) throw error;


  if (!data?.valid) {

    if (data?.status === "revoked") {
      throw new Error(
        "Sertifikat ini sudah tidak berlaku."
      );
    }


    throw new Error(
      "Sertifikat tidak ditemukan atau kode verifikasi tidak valid."
    );
  }


  certificateData = data;


  document
    .getElementById("certificateNumber")
    .textContent =
      data.certificate_number || "—";


  document
    .getElementById("participantName")
    .textContent =
      data.participant_name || "Peserta";


  document
    .getElementById("className")
    .textContent =
      data.class_name ||
      "Kelas PPh Pasal 21";


  document
    .getElementById("finalScore")
    .textContent =
      data.final_score ?? "—";


  document
    .getElementById("issuedDate")
    .textContent =
      formatDate(data.issued_at);


  document
    .getElementById("verificationCode")
    .textContent =
      data.verification_code ||
      verificationCode;


  document.title =
    `Sertifikat ${data.participant_name || ""} — Kabayan Learning`;


  renderQr(
    data.verification_code ||
    verificationCode
  );
}


function renderQr(code) {

  const host =
    document.getElementById("certificateQr");


  host.innerHTML = "";


  const verificationUrl =
    buildVerificationUrl(code);


  new QRCode(
    host,
    {
      text: verificationUrl,
      width: 118,
      height: 118,
      correctLevel:
        QRCode.CorrectLevel.M
    }
  );
}


function buildVerificationUrl(code) {

  return (
    `${location.origin}/verifikasi-sertifikat.html?code=` +
    encodeURIComponent(code)
  );
}


/* ============================================================
   PDF VECTOR EXPORT

   Tidak menggunakan html2canvas.
   Seluruh teks digambar langsung oleh jsPDF menggunakan
   font standar PDF (Helvetica + Times).
   Ini menghindari bug Safari/html2canvas yang membuat huruf
   bertumpuk atau kehilangan spasi.
   ============================================================ */

async function downloadPdf() {

  if (!certificateData) return;


  const button =
    document.getElementById(
      "downloadPdfBtn"
    );


  const originalText =
    button.textContent;


  button.disabled = true;
  button.textContent =
    "Membuat PDF…";


  try {

    const { jsPDF } =
      window.jspdf;


    const pdf =
      new jsPDF(
        {
          orientation: "landscape",
          unit: "mm",
          format: "a4",
          compress: true,
          putOnlyUsedFonts: true
        }
      );


    drawCertificatePdf(
      pdf,
      certificateData
    );


    const safeName =
      sanitizeFilename(
        certificateData.participant_name ||
        "peserta"
      );


    pdf.save(
      `sertifikat-${safeName || "kabayan"}.pdf`
    );


  } catch (error) {

    console.error(error);

    alert(
      "PDF belum dapat dibuat. Gunakan tombol Cetak lalu pilih Save as PDF sebagai alternatif."
    );


  } finally {

    button.disabled = false;
    button.textContent =
      originalText;
  }
}


function drawCertificatePdf(
  pdf,
  data
) {

  const pageW = 297;
  const pageH = 210;

  const blue =
    [18, 103, 232];

  const navy =
    [13, 28, 49];

  const text =
    [35, 50, 73];

  const muted =
    [119, 132, 150];

  const line =
    [202, 213, 227];

  const paleBlue =
    [232, 241, 255];

  const paleGray =
    [241, 244, 248];


  /* ----------------------------------------------------------
     BACKGROUND
     ---------------------------------------------------------- */

  pdf.setFillColor(
    255,
    255,
    255
  );

  pdf.rect(
    0,
    0,
    pageW,
    pageH,
    "F"
  );


  // subtle top-right highlight
  pdf.setFillColor(
    247,
    250,
    255
  );

  pdf.circle(
    257,
    30,
    38,
    "F"
  );


  // decorative top-left rings
  pdf.setDrawColor(
    224,
    235,
    252
  );

  pdf.setLineWidth(
    8
  );

  pdf.circle(
    7,
    6,
    23,
    "S"
  );


  // decorative bottom-right rings
  pdf.setDrawColor(
    231,
    235,
    240
  );

  pdf.setLineWidth(
    10
  );

  pdf.circle(
    292,
    207,
    28,
    "S"
  );


  // formal double border
  pdf.setDrawColor(
    line[0],
    line[1],
    line[2]
  );

  pdf.setLineWidth(
    .35
  );

  pdf.rect(
    8,
    8,
    281,
    194
  );


  pdf.setDrawColor(
    232,
    238,
    247
  );

  pdf.setLineWidth(
    .25
  );

  pdf.rect(
    10.5,
    10.5,
    276,
    189
  );


  /* ----------------------------------------------------------
     HEADER
     ---------------------------------------------------------- */

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    13
  );

  pdf.setTextColor(
    navy[0],
    navy[1],
    navy[2]
  );

  pdf.text(
    "Kabayan",
    19,
    26
  );


  const kabayanWidth =
    pdf.getTextWidth(
      "Kabayan"
    );


  pdf.setTextColor(
    blue[0],
    blue[1],
    blue[2]
  );

  pdf.text(
    "Learning",
    19 + kabayanWidth + 1,
    26
  );


  // certificate number
  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    6.5
  );

  pdf.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  pdf.text(
    "NOMOR SERTIFIKAT",
    278,
    21.8,
    {
      align: "right"
    }
  );


  pdf.setFontSize(
    8.2
  );

  pdf.setTextColor(
    text[0],
    text[1],
    text[2]
  );

  pdf.text(
    String(
      data.certificate_number ||
      "—"
    ),
    278,
    27.2,
    {
      align: "right"
    }
  );


  /* ----------------------------------------------------------
     MAIN TITLE
     ---------------------------------------------------------- */

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    8
  );

  pdf.setTextColor(
    blue[0],
    blue[1],
    blue[2]
  );

  pdf.text(
    "CERTIFICATE OF COMPLETION",
    pageW / 2,
    44,
    {
      align: "center"
    }
  );


  pdf.setFont(
    "times",
    "bold"
  );

  pdf.setFontSize(
    35
  );

  pdf.setTextColor(
    navy[0],
    navy[1],
    navy[2]
  );

  pdf.text(
    "Sertifikat Kelulusan",
    pageW / 2,
    64.5,
    {
      align: "center"
    }
  );


  // blue divider
  pdf.setDrawColor(
    blue[0],
    blue[1],
    blue[2]
  );

  pdf.setLineWidth(
    1
  );

  pdf.line(
    138.5,
    70.5,
    158.5,
    70.5
  );


  /* ----------------------------------------------------------
     RECIPIENT
     ---------------------------------------------------------- */

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    9
  );

  pdf.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  pdf.text(
    "Dengan ini diberikan kepada",
    pageW / 2,
    80,
    {
      align: "center"
    }
  );


  const recipientName =
    String(
      data.participant_name ||
      "Peserta"
    );


  let nameSize = 31;

  if (
    recipientName.length > 30
  ) {
    nameSize = 25;
  }

  if (
    recipientName.length > 45
  ) {
    nameSize = 20;
  }


  pdf.setFont(
    "times",
    "bold"
  );

  pdf.setFontSize(
    nameSize
  );

  pdf.setTextColor(
    blue[0],
    blue[1],
    blue[2]
  );

  pdf.text(
    recipientName,
    pageW / 2,
    96.5,
    {
      align: "center",
      maxWidth: 220
    }
  );


  pdf.setDrawColor(
    194,
    211,
    237
  );

  pdf.setLineWidth(
    .25
  );

  pdf.line(
    105,
    101,
    192,
    101
  );


  /* ----------------------------------------------------------
     DESCRIPTION
     ---------------------------------------------------------- */

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    8.5
  );

  pdf.setTextColor(
    93,
    107,
    125
  );


  const description =
    "atas keberhasilannya menyelesaikan seluruh rangkaian pembelajaran, " +
    "kuis modul, dan Evaluasi Akhir pada program";


  const descLines =
    pdf.splitTextToSize(
      description,
      165
    );


  pdf.text(
    descLines,
    pageW / 2,
    111.5,
    {
      align: "center",
      lineHeightFactor: 1.35
    }
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    15.5
  );

  pdf.setTextColor(
    navy[0],
    navy[1],
    navy[2]
  );

  pdf.text(
    String(
      data.class_name ||
      "Kelas PPh Pasal 21"
    ),
    pageW / 2,
    128.5,
    {
      align: "center",
      maxWidth: 190
    }
  );


  /* ----------------------------------------------------------
     FACTS
     ---------------------------------------------------------- */

  drawFactBox(
    pdf,
    110,
    136,
    36,
    18,
    "Nilai Evaluasi Akhir",
    String(
      data.final_score ?? "—"
    ),
    paleGray,
    text,
    muted
  );


  drawFactBox(
    pdf,
    151,
    136,
    47,
    18,
    "Tanggal Terbit",
    formatDate(
      data.issued_at
    ),
    paleGray,
    text,
    muted
  );


  /* ----------------------------------------------------------
     FOOTER — ISSUER
     ---------------------------------------------------------- */

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    6.7
  );

  pdf.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  pdf.text(
    "Diterbitkan oleh",
    20,
    166
  );


  pdf.setFont(
    "times",
    "italic"
  );

  pdf.setFontSize(
    16
  );

  pdf.setTextColor(
    blue[0],
    blue[1],
    blue[2]
  );

  pdf.text(
    "KL",
    20,
    175
  );


  pdf.setDrawColor(
    150,
    163,
    181
  );

  pdf.setLineWidth(
    .3
  );

  pdf.line(
    20,
    179,
    66,
    179
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    8
  );

  pdf.setTextColor(
    text[0],
    text[1],
    text[2]
  );

  pdf.text(
    "Kabayan Learning",
    20,
    184.5
  );


  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    6.3
  );

  pdf.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  pdf.text(
    "Learning Tax with Kabayan",
    20,
    189.5
  );


  /* ----------------------------------------------------------
     FOOTER — SEAL
     ---------------------------------------------------------- */

  pdf.setDrawColor(
    190,
    211,
    242
  );

  pdf.setLineWidth(
    .6
  );

  pdf.circle(
    pageW / 2,
    178,
    12.5
  );


  pdf.setDrawColor(
    230,
    237,
    247
  );

  pdf.setLineWidth(
    2.5
  );

  pdf.circle(
    pageW / 2,
    178,
    9.5
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    6.2
  );

  pdf.setTextColor(
    blue[0],
    blue[1],
    blue[2]
  );

  pdf.text(
    "KABAYAN",
    pageW / 2,
    176.8,
    {
      align: "center"
    }
  );


  pdf.setFontSize(
    4.7
  );

  pdf.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  pdf.text(
    "LEARNING",
    pageW / 2,
    180.8,
    {
      align: "center"
    }
  );


  /* ----------------------------------------------------------
     FOOTER — QR
     ---------------------------------------------------------- */

  const qrDataUrl =
    getQrDataUrl();


  if (qrDataUrl) {

    pdf.setDrawColor(
      219,
      227,
      237
    );

    pdf.setLineWidth(
      .25
    );

    pdf.rect(
      220,
      158,
      27,
      27
    );


    pdf.addImage(
      qrDataUrl,
      "PNG",
      221,
      159,
      25,
      25
    );
  }


  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    6.2
  );

  pdf.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );

  pdf.text(
    "Verifikasi Sertifikat",
    251.5,
    164
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    7.2
  );

  pdf.setTextColor(
    text[0],
    text[1],
    text[2]
  );

  pdf.text(
    String(
      data.verification_code ||
      verificationCode ||
      "—"
    ),
    251.5,
    169.2
  );


  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    5.4
  );

  pdf.setTextColor(
    muted[0],
    muted[1],
    muted[2]
  );


  const qrNote =
    pdf.splitTextToSize(
      "Pindai QR untuk memeriksa keaslian sertifikat secara online.",
      33
    );


  pdf.text(
    qrNote,
    251.5,
    175,
    {
      lineHeightFactor: 1.3
    }
  );
}


function drawFactBox(
  pdf,
  x,
  y,
  w,
  h,
  label,
  value,
  fillColor,
  textColor,
  mutedColor
) {

  pdf.setFillColor(
    fillColor[0],
    fillColor[1],
    fillColor[2]
  );

  pdf.roundedRect(
    x,
    y,
    w,
    h,
    2.4,
    2.4,
    "F"
  );


  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setFontSize(
    5.8
  );

  pdf.setTextColor(
    mutedColor[0],
    mutedColor[1],
    mutedColor[2]
  );

  pdf.text(
    label,
    x + w / 2,
    y + 6.2,
    {
      align: "center"
    }
  );


  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(
    8.5
  );

  pdf.setTextColor(
    textColor[0],
    textColor[1],
    textColor[2]
  );

  pdf.text(
    value,
    x + w / 2,
    y + 12.4,
    {
      align: "center",
      maxWidth: w - 4
    }
  );
}


function getQrDataUrl() {

  const host =
    document.getElementById(
      "certificateQr"
    );


  if (!host) return null;


  const canvas =
    host.querySelector(
      "canvas"
    );


  if (canvas) {

    try {
      return canvas.toDataURL(
        "image/png"
      );
    } catch (error) {
      console.warn(
        "QR canvas tidak dapat diekspor.",
        error
      );
    }
  }


  const image =
    host.querySelector(
      "img"
    );


  if (
    image &&
    image.src
  ) {
    return image.src;
  }


  return null;
}


function sanitizeFilename(value) {

  return String(value)
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


function formatDate(value) {

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


function showError(message) {

  document
    .getElementById("certificateCanvas")
    ?.classList.add("hidden");


  const host =
    document.getElementById(
      "certificateError"
    );


  host.classList.remove("hidden");


  host.innerHTML = `
    <strong>
      Sertifikat tidak dapat ditampilkan.
    </strong>

    <span>
      ${escapeHtml(message)}
    </span>
  `;
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
