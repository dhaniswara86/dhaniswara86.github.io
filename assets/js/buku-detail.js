(() => {
  "use strict";

  const DATA_URL = "data/buku.json";
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("id");

  function byId(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const el = byId(id);
    if (el) el.textContent = value || "";
  }

  function setMeta(selector, value) {
    const el = document.querySelector(selector);
    if (el && value) el.setAttribute("content", value);
  }

  function renderTags(tags) {
    const container = byId("detailTags");
    if (!container) return;

    container.replaceChildren(
      ...(tags || []).map((value) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = value;
        return span;
      })
    );
  }

  function renderInfo(rows) {
    const container = byId("detailInfo");
    if (!container) return;

    container.replaceChildren(
      ...(rows || []).map((row) => {
        const wrapper = document.createElement("div");
        wrapper.className = "info-row";

        const dt = document.createElement("dt");
        dt.textContent = row.label || "";

        const dd = document.createElement("dd");
        dd.textContent = row.value || "";

        wrapper.append(dt, dd);
        return wrapper;
      })
    );
  }

  function renderMaterials(items) {
    const container = byId("detailMaterials");
    if (!container) return;

    container.replaceChildren(
      ...(items || []).map((item, index) => {
        const article = document.createElement("article");
        article.className = "material-card";

        const number = document.createElement("span");
        number.className = "material-number";
        number.textContent =
          item.number || String(index + 1).padStart(2, "0");

        const title = document.createElement("h3");
        title.textContent = item.title || "";

        article.append(number, title);
        return article;
      })
    );
  }

  function updateSeo(book, detail) {
    document.title = detail.pageTitle || book.title || "Buku Digital | Kabayan";

    setMeta('meta[name="description"]', detail.metaDescription || book.description);
    setMeta('meta[property="og:title"]', detail.ogTitle || book.title);
    setMeta(
      'meta[property="og:description"]',
      detail.ogDescription || book.description
    );

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const url = new URL(window.location.href);
      url.search = "";
      url.searchParams.set("id", book.slug);
      url.hash = "";
      canonical.href = url.href;
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.content = canonical ? canonical.href : window.location.href;
    }
  }

  function renderBook(book) {
    const detail = book.detail;

    if (!detail) {
      showError(
        "Detail buku ini belum dimigrasikan ke JSON.",
        book.legacyDetailUrl
      );
      return;
    }

    updateSeo(book, detail);

    setText("detailBreadcrumb", book.title);
    setText("detailEyebrow", detail.eyebrow);
    setText("detailHeadlineMain", detail.headlineMain);
    setText("detailHeadlineAccent", detail.headlineAccent);
    setText("detailDescription", detail.description);
    setText("detailMaterialKicker", detail.materialKicker);
    setText("detailMaterialTitle", detail.materialTitle);
    setText("detailCtaTitle", detail.ctaTitle);
    setText("detailCtaText", detail.ctaText);
    setText("detailDisclaimer", detail.disclaimer);

    const cover = byId("detailCover");
    if (cover) {
      cover.src = detail.cover || book.cover;
      cover.alt = detail.coverAlt || book.coverAlt || book.title;
    }

    const webp = byId("detailCoverWebp");
    if (webp) {
      webp.srcset = detail.coverWebp || book.cover;
    }

    const heroDownload = byId("detailHeroDownload");
    if (heroDownload) {
      heroDownload.href = detail.heroDownloadUrl || book.downloadUrl;
    }

    const ctaDownload = byId("detailCtaDownload");
    if (ctaDownload) {
      ctaDownload.href =
        detail.ctaDownloadUrl ||
        detail.heroDownloadUrl ||
        book.downloadUrl;
    }

    renderTags(detail.tags);
    renderInfo(detail.info);
    renderMaterials(detail.materials);

    document.documentElement.classList.add("detail-ready");
  }

  function showError(message, legacyUrl = "") {
    const main = document.querySelector("main");
    if (!main) return;

    const section = document.createElement("section");
    section.className = "information-section";

    const card = document.createElement("div");
    card.className = "information-card";

    const title = document.createElement("h2");
    title.textContent = "Buku tidak dapat ditampilkan.";

    const text = document.createElement("p");
    text.textContent = message;

    const actions = document.createElement("div");
    actions.className = "actions";

    if (legacyUrl) {
      const legacy = document.createElement("a");
      legacy.className = "button button-primary";
      legacy.href = legacyUrl;
      legacy.textContent = "Buka halaman lama";
      actions.appendChild(legacy);
    }

    const back = document.createElement("a");
    back.className = legacyUrl
      ? "button button-outline"
      : "button button-primary";
    back.href = "buku.html";
    back.textContent = "Kembali ke koleksi";
    actions.appendChild(back);

    card.append(title, text, actions);
    section.appendChild(card);
    main.replaceChildren(section);
    document.title = "Buku tidak ditemukan | Kabayan";
  }

  async function loadDetail() {
    if (!slug) {
      showError("Parameter buku tidak ditemukan pada URL.");
      return;
    }

    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const books = Array.isArray(payload) ? payload : payload.books;

      if (!Array.isArray(books)) {
        throw new Error("Format data/buku.json tidak valid.");
      }

      const book = books.find((item) => item.slug === slug);

      if (!book) {
        showError(`Buku dengan id "${slug}" tidak ditemukan.`);
        return;
      }

      renderBook(book);
    } catch (error) {
      console.error("Gagal memuat detail buku:", error);
      showError(
        "Data buku gagal dimuat. Pastikan data/buku.json sudah diunggah dan halaman dibuka melalui web server."
      );
    }
  }

  loadDetail();
})();