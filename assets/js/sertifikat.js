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
      data.verification_code || verificationCode;


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
    `${location.origin}/verifikasi-sertifikat.html?code=${encodeURIComponent(code)}`;


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


async function downloadPdf() {

  if (!certificateData) return;


  const button =
    document.getElementById("downloadPdfBtn");


  const originalText =
    button.textContent;


  button.disabled = true;
  button.textContent =
    "Membuat PDF…";


  try {

    const certificate =
      document.getElementById(
        "certificateCanvas"
      );


    const canvas =
      await html2canvas(
        certificate,
        {
          scale: 3,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false
        }
      );


    const image =
      canvas.toDataURL(
        "image/jpeg",
        .98
      );


    const { jsPDF } =
      window.jspdf;


    const pdf =
      new jsPDF(
        {
          orientation: "landscape",
          unit: "mm",
          format: "a4",
          compress: true
        }
      );


    pdf.addImage(
      image,
      "JPEG",
      0,
      0,
      297,
      210,
      undefined,
      "FAST"
    );


    const safeName =
      String(
        certificateData.participant_name ||
        "peserta"
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


    pdf.save(
      `sertifikat-${safeName || "kabayan"}.pdf`
    );


  } catch (error) {

    console.error(error);

    alert(
      "PDF belum dapat dibuat. Anda masih dapat menggunakan tombol Cetak dan memilih Save as PDF."
    );


  } finally {

    button.disabled = false;
    button.textContent =
      originalText;
  }
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
