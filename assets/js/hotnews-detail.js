document.addEventListener("DOMContentLoaded", function () {
  const articleContainer =
    document.getElementById("hotnews-article");

  if (!articleContainer) {
    console.error("Elemen #hotnews-article tidak ditemukan.");
    return;
  }

  const urlParams = new URLSearchParams(
    window.location.search
  );

  const slug = urlParams.get("slug");

  if (!slug) {
    tampilkanArtikelTidakDitemukan(
      articleContainer,
      "Alamat artikel tidak lengkap."
    );

    return;
  }

  if (!Array.isArray(window.hotNewsData)) {
    tampilkanArtikelTidakDitemukan(
      articleContainer,
      "Data artikel tidak dapat dimuat."
    );

    return;
  }

  const article = window.hotNewsData.find(function (item) {
    return item.slug === slug;
  });

  if (!article) {
    tampilkanArtikelTidakDitemukan(
      articleContainer,
      "Artikel yang Anda cari tidak ditemukan."
    );

    return;
  }

  document.title = article.title + " | Kabayan Hot News";

  const descriptionMeta = document.querySelector(
    'meta[name="description"]'
  );

  if (descriptionMeta) {
    descriptionMeta.setAttribute(
      "content",
      article.excerpt
    );
  }

  articleContainer.innerHTML = `
    <nav class="hotnews-breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Beranda</a>

      <span aria-hidden="true">/</span>

      <a href="hotnews.html">Hot News</a>

      <span aria-hidden="true">/</span>

      <span>Artikel</span>
    </nav>

    <header class="hotnews-article-header">
      <span class="hotnews-article-category">
        ${article.category}
      </span>

      <h1>${article.title}</h1>

      <p class="hotnews-article-excerpt">
        ${article.excerpt}
      </p>

      <div class="hotnews-article-meta">
        <span>${article.dateLabel}</span>
        <span aria-hidden="true">•</span>
        <span>${article.readingTime}</span>
      </div>
    </header>

    <div class="hotnews-article-body">
      ${article.content}
    </div>

    <footer class="hotnews-article-footer">
      <a
        class="hotnews-back-link"
        href="hotnews.html"
      >
        <span aria-hidden="true">←</span>
        Kembali ke Hot News
      </a>
    </footer>
  `;
});

function tampilkanArtikelTidakDitemukan(
  container,
  message
) {
  document.title = "Artikel Tidak Ditemukan | Kabayan";

  container.innerHTML = `
    <div class="hotnews-not-found">
      <span class="hotnews-not-found-code">404</span>

      <h1>Artikel Tidak Ditemukan</h1>

      <p>${message}</p>

      <a href="hotnews.html">
        Kembali ke Hot News
      </a>
    </div>
  `;
}
