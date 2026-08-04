(function () {
  "use strict";

  const articleElement =
    document.getElementById("hotnewsArticle");

  if (
    !articleElement ||
    !Array.isArray(window.KABAYAN_HOTNEWS)
  ) {
    console.error(
      "Data Hot News atau elemen #hotnewsArticle tidak ditemukan."
    );

    return;
  }

  const params = new URLSearchParams(
    window.location.search
  );

  const articleId = params.get("id");

  if (!articleId) {
    showNotFound(
      "Alamat artikel tidak memiliki ID."
    );

    return;
  }

  const article = window.KABAYAN_HOTNEWS.find(
    function (item) {
      return String(item.id) === String(articleId);
    }
  );

  if (!article) {
    showNotFound(
      "Artikel yang Anda cari tidak ditemukan."
    );

    return;
  }

  document.title =
    article.title + " | Kabayan Hot News";

  const metaDescription = document.querySelector(
    'meta[name="description"]'
  );

  if (metaDescription && article.excerpt) {
    metaDescription.setAttribute(
      "content",
      article.excerpt
    );
  }

  articleElement.innerHTML = `
    <nav
      class="hotnews-breadcrumb"
      aria-label="Breadcrumb"
    >
      <a href="index.html">
        Beranda
      </a>

      <span aria-hidden="true">/</span>

      <a href="hotnews.html">
        Hot News
      </a>

      <span aria-hidden="true">/</span>

      <span>
        Artikel
      </span>
    </nav>

    <header class="hotnews-article-header">
      <span class="hotnews-article-category">
        ${escapeHTML(article.category || "Hot News")}
      </span>

      <h1>
        ${escapeHTML(article.title)}
      </h1>

      <p class="hotnews-article-excerpt">
        ${escapeHTML(article.excerpt)}
      </p>

      <div class="hotnews-article-meta">
        <time datetime="${escapeHTML(article.dateISO)}">
          ${escapeHTML(article.date)}
        </time>

        ${
          article.readingTime
            ? `
              <span aria-hidden="true">•</span>
              <span>
                ${escapeHTML(article.readingTime)}
              </span>
            `
            : ""
        }
      </div>
    </header>

    <div class="hotnews-article-body">
      ${article.content || ""}
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

  function showNotFound(message) {
    document.title =
      "Artikel Tidak Ditemukan | Kabayan";

    articleElement.innerHTML = `
      <div class="hotnews-not-found">
        <span class="hotnews-not-found-code">
          404
        </span>

        <h1>
          Artikel Tidak Ditemukan
        </h1>

        <p>
          ${escapeHTML(message)}
        </p>

        <a
          class="hotnews-back-link"
          href="hotnews.html"
        >
          Kembali ke Hot News
        </a>
      </div>
    `;
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
