(function () {
  "use strict";

  const listElement = document.getElementById("hotnewsList");
  const countElement = document.getElementById("hotnewsCount");

  /*
   * Hentikan proses apabila:
   * 1. tempat daftar berita tidak ditemukan; atau
   * 2. data Hot News belum tersedia.
   */
  if (
    !listElement ||
    !Array.isArray(window.KABAYAN_HOTNEWS)
  ) {
    console.error(
      "Data Hot News atau elemen #hotnewsList tidak ditemukan."
    );

    return;
  }

  /*
   * Salin dan urutkan berita berdasarkan tanggal terbaru.
   */
  const hotNews = [...window.KABAYAN_HOTNEWS].sort(
    function (a, b) {
      return new Date(b.dateISO) - new Date(a.dateISO);
    }
  );

  /*
   * Tampilkan jumlah berita.
   */
  if (countElement) {
    countElement.textContent =
      hotNews.length + " berita";
  }

  /*
   * Tampilkan pesan jika belum ada berita.
   */
  if (hotNews.length === 0) {
    listElement.innerHTML = `
      <div class="hotnews-empty">
        Belum ada Hot News yang tersedia.
      </div>
    `;

    return;
  }

  /*
   * Buat kartu untuk setiap berita.
   */
  listElement.innerHTML = hotNews
    .map(function (item) {
      const detailUrl =
        "hotnews-detail.html?id=" +
        encodeURIComponent(item.id);

      return `
        <article class="hotnews-card">

          <div class="hotnews-card-meta">
            <span class="hotnews-category">
              ${escapeHTML(item.category)}
            </span>

            <time datetime="${escapeHTML(item.dateISO)}">
              ${escapeHTML(item.date)}
            </time>
          </div>

          <h2 class="hotnews-card-title">
            <a href="${detailUrl}">
              ${escapeHTML(item.title)}
            </a>
          </h2>

          <p class="hotnews-card-excerpt">
            ${escapeHTML(item.excerpt)}
          </p>

          <a
            class="hotnews-read-more"
            href="${detailUrl}"
          >
            Baca selengkapnya
            <span aria-hidden="true">→</span>
          </a>

        </article>
      `;
    })
    .join("");

  /*
   * Mencegah teks data dianggap sebagai kode HTML.
   */
  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
