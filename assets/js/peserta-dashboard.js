let studentProfile = null;


document.addEventListener(
  "DOMContentLoaded",
  async () => {

    try {

      studentProfile =
        await window.KabayanAuth.requireRole(
          "student"
        );


      const displayName =
        studentProfile.full_name ||
        "Peserta";


      document
        .getElementById("profileName")
        .textContent =
          displayName;


      document
        .getElementById("heroName")
        .textContent =
          firstName(displayName);


      await Promise.all([
        loadMyCertificates(),
        loadMyClasses()
      ]);


    } catch (error) {

      console.error(error);
    }
  }
);


/* ============================================================
   SERTIFIKAT SAYA
   ============================================================ */

async function loadMyCertificates() {

  const host =
    document.getElementById(
      "certificateList"
    );


  host.innerHTML = `
    <div class="participant-empty">
      Memuat sertifikat…
    </div>
  `;


  const { data, error } =
    await window.kabayanSupabase.rpc(
      "get_my_certificates"
    );


  if (error) {

    host.innerHTML = `
      <div class="participant-empty error">
        ${escapeHtml(error.message)}
      </div>
    `;

    return;
  }


  const certificates =
    Array.isArray(data)
      ? data
      : [];


  document
    .getElementById("certificateCount")
    .textContent =
      certificates.length;


  if (!certificates.length) {

    host.innerHTML = `
      <div class="certificate-empty-state">

        <div class="certificate-empty-icon">
          ✓
        </div>

        <div>
          <strong>
            Belum ada sertifikat.
          </strong>

          <p>
            Sertifikat akan tersedia di sini setelah seluruh
            syarat kelulusan terpenuhi dan pengajar menerbitkannya.
          </p>
        </div>

      </div>
    `;

    return;
  }


  host.innerHTML =
    certificates
      .map(renderCertificateCard)
      .join("");
}


function renderCertificateCard(certificate) {

  const active =
    certificate.status === "active";


  return `
    <article class="participant-certificate-card ${active ? "active" : "revoked"}">

      <div class="certificate-card-mark">
        <span>KL</span>
      </div>


      <div class="certificate-card-copy">

        <div class="certificate-card-topline">

          <span class="certificate-card-label">
            Sertifikat Kelulusan
          </span>

          <span class="certificate-card-status ${active ? "active" : "revoked"}">
            ${active ? "Aktif" : "Tidak berlaku"}
          </span>

        </div>


        <h3>
          ${escapeHtml(certificate.class_name || "Kelas")}
        </h3>


        <div class="certificate-card-meta">

          <span>
            ${escapeHtml(certificate.certificate_number || "—")}
          </span>

          <span>
            Nilai akhir ${certificate.final_score ?? "—"}
          </span>

          <span>
            ${formatDate(certificate.issued_at)}
          </span>

        </div>

      </div>


      <div class="certificate-card-actions">

        ${
          active
            ? `
              <a
                class="participant-button certificate-open"
                href="sertifikat.html?code=${encodeURIComponent(certificate.verification_code)}">
                Lihat & Unduh
              </a>

              <a
                class="participant-button certificate-verify"
                href="verifikasi-sertifikat.html?code=${encodeURIComponent(certificate.verification_code)}"
                target="_blank"
                rel="noopener">
                Verifikasi
              </a>
            `
            : `
              <span class="certificate-revoked-note">
                Sertifikat telah dicabut.
              </span>
            `
        }

      </div>

    </article>
  `;
}


/* ============================================================
   KELAS SAYA
   ============================================================ */

async function loadMyClasses() {

  const host =
    document.getElementById(
      "classList"
    );


  host.innerHTML = `
    <div class="participant-empty">
      Memuat kelas…
    </div>
  `;


  const { data, error } =
    await window.kabayanSupabase
      .from("classes")
      .select(
        "id, name, description, status, start_date, end_date"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    host.innerHTML = `
      <div class="participant-empty error">
        ${escapeHtml(error.message)}
      </div>
    `;

    return;
  }


  const classes =
    data || [];


  document
    .getElementById("classCount")
    .textContent =
      classes.length;


  if (!classes.length) {

    host.innerHTML = `
      <div class="participant-empty">
        <strong>
          Belum ada kelas.
        </strong>

        <span>
          Hubungi pengajar untuk menambahkan akun Anda ke kelas.
        </span>
      </div>
    `;

    return;
  }


  host.innerHTML =
    classes
      .map(renderClassCard)
      .join("");
}


function renderClassCard(classData) {

  const active =
    classData.status === "active";


  return `
    <article class="participant-class-card">

      <div class="participant-class-number">
        ${active ? "Aktif" : "Kelas"}
      </div>


      <div class="participant-class-copy">

        <h3>
          ${escapeHtml(classData.name)}
        </h3>

        <p>
          ${escapeHtml(classData.description || "")}
        </p>

      </div>


      <div class="participant-class-action">

        <a
          class="participant-button class-open"
          href="kelas-belajar.html?id=${encodeURIComponent(classData.id)}">
          Buka kelas
        </a>

      </div>

    </article>
  `;
}


/* ============================================================
   HELPERS
   ============================================================ */

function firstName(value = "") {

  const clean =
    String(value).trim();


  if (!clean) return "Peserta";


  return clean.split(/\s+/)[0];
}


function formatDate(value) {

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
