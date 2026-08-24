const params =
  new URLSearchParams(location.search);

const code =
  params.get("code");


document.addEventListener(
  "DOMContentLoaded",
  verifyCertificate
);


async function verifyCertificate() {

  if (!code) {

    renderInvalid(
      "Kode verifikasi tidak ditemukan."
    );

    return;
  }


  document
    .getElementById("verifyCode")
    .textContent =
      code.toUpperCase();


  document
    .getElementById("verifyCodeBox")
    .classList.remove("hidden");


  try {

    const { data, error } =
      await window.kabayanSupabase.rpc(
        "verify_certificate",
        {
          p_verification_code: code
        }
      );


    if (error) throw error;


    if (!data?.valid) {

      if (data?.status === "revoked") {

        renderRevoked(data);

      } else {

        renderInvalid(
          "Kode tersebut tidak tercatat sebagai sertifikat yang valid."
        );
      }

      return;
    }


    renderValid(data);


  } catch (error) {

    console.error(error);

    renderInvalid(
      "Verifikasi belum dapat dilakukan. Silakan coba kembali."
    );
  }
}


function renderValid(data) {

  const icon =
    document.getElementById("verifyIcon");


  icon.textContent = "✓";

  icon.className =
    "verify-icon valid";


  document
    .getElementById("verifyTitle")
    .textContent =
      "Sertifikat valid";


  document
    .getElementById("verifyDescription")
    .textContent =
      "Sertifikat ini tercatat sebagai sertifikat aktif Kabayan Learning.";


  const details =
    document.getElementById(
      "verifyDetails"
    );


  details.classList.remove("hidden");


  details.innerHTML = `
    <div>
      <span>Nama peserta</span>
      <strong>
        ${escapeHtml(data.participant_name || "—")}
      </strong>
    </div>

    <div>
      <span>Program</span>
      <strong>
        ${escapeHtml(data.class_name || "—")}
      </strong>
    </div>

    <div>
      <span>Nomor sertifikat</span>
      <strong>
        ${escapeHtml(data.certificate_number || "—")}
      </strong>
    </div>

    <div>
      <span>Tanggal terbit</span>
      <strong>
        ${formatDate(data.issued_at)}
      </strong>
    </div>
  `;
}


function renderInvalid(message) {

  const icon =
    document.getElementById("verifyIcon");


  icon.textContent = "×";

  icon.className =
    "verify-icon invalid";


  document
    .getElementById("verifyTitle")
    .textContent =
      "Sertifikat tidak ditemukan";


  document
    .getElementById("verifyDescription")
    .textContent =
      message;


  document
    .getElementById("verifyDetails")
    .classList.add("hidden");
}


function renderRevoked(data) {

  const icon =
    document.getElementById("verifyIcon");


  icon.textContent = "!";

  icon.className =
    "verify-icon revoked";


  document
    .getElementById("verifyTitle")
    .textContent =
      "Sertifikat tidak berlaku";


  document
    .getElementById("verifyDescription")
    .textContent =
      "Sertifikat pernah diterbitkan tetapi statusnya telah dicabut.";


  const details =
    document.getElementById(
      "verifyDetails"
    );


  details.classList.remove("hidden");


  details.innerHTML = `
    <div>
      <span>Nama peserta</span>
      <strong>
        ${escapeHtml(data.participant_name || "—")}
      </strong>
    </div>

    <div>
      <span>Program</span>
      <strong>
        ${escapeHtml(data.class_name || "—")}
      </strong>
    </div>

    <div>
      <span>Nomor sertifikat</span>
      <strong>
        ${escapeHtml(data.certificate_number || "—")}
      </strong>
    </div>

    <div>
      <span>Status</span>
      <strong>
        Dicabut
      </strong>
    </div>
  `;
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
