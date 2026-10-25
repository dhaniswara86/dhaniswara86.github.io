/**
 * Extension: Program Pengurangan atau Penghapusan Sanksi Administrasi (PSA) 2026.
 * Designed for Kabayan's existing buku.html and buku-detail.html without replacing
 * the original assets/js/buku.js or assets/js/buku-detail.js.
 */
(function () {
  "use strict";

  const BOOK = Object.freeze({
    id: "psa-2026",
    title: "Panduan Program Pengurangan atau Penghapusan Sanksi Administrasi (PSA)",
    cover: "images/mockup-psa-2026.webp",
    detailUrl: "buku-detail.html?id=psa-2026",
    downloadUrl: "https://s.id/psa2026",
    authors: "Dian Anggraeni dan Angga Sukma Dhaniswara",
    description: "Panduan program pengurangan atau penghapusan sanksi administrasi berdasarkan PMK 71 Tahun 2026 dan KEP-239/PJ/2026, mencakup persyaratan, jenis sanksi, dan alur permohonan.",
    keywords: "psa 2026 pengurangan penghapusan sanksi administrasi pmk 71 2026 kep-239 pj 2026 kup pph ppn permohonan perpajakan dian anggraeni angga sukma dhaniswara"
  });

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;",
      '"': "&quot;", "'": "&#39;"
    })[c]);

  function createCard() {
    const card = document.createElement("article");
    card.className = "book-card is-visible";
    card.dataset.psaBook = "true";
    card.dataset.category = "sanksi";
    card.dataset.title = BOOK.title;
    card.innerHTML = `
      <div class="book-visual">
        <span class="new-badge">Baru · 2026</span>
        <a href="${BOOK.detailUrl}" aria-label="Lihat detail buku PSA 2026">
          <img src="${BOOK.cover}" alt="Mockup Buku Panduan Program Pengurangan atau Penghapusan Sanksi Administrasi PSA 2026" width="447" height="558" loading="lazy" decoding="async">
        </a>
      </div>
      <div class="book-content">
        <div class="tags">
          <span class="tag">Sanksi Administrasi</span>
          <span class="tag">PMK 71/2026</span>
          <span class="tag">KEP-239/PJ/2026</span>
        </div>
        <h3>${escapeHtml(BOOK.title)}</h3>
        <p class="book-description">${escapeHtml(BOOK.description)}</p>
        <div class="book-meta">
          <span>2026</span>
          <span>${escapeHtml(BOOK.authors)}</span>
        </div>
        <div class="book-actions">
          <a class="text-link" href="${BOOK.detailUrl}">Lihat detail</a>
          <a class="download-button" href="${BOOK.downloadUrl}" target="_blank" rel="noopener noreferrer">Unduh PDF</a>
        </div>
      </div>`;
    return card;
  }

  function setupCatalog() {
    const grid = document.getElementById("bookGrid");
    if (!grid) return;

    const searchInput = document.getElementById("bookSearch");
    const filterButtons = [...document.querySelectorAll(".filter-button")];
    const count = document.getElementById("resultCount");
    const noResults = document.getElementById("noResults");
    const searchable = (BOOK.title + " " + BOOK.description + " " + BOOK.keywords).toLocaleLowerCase("id-ID");
    let animationFrame = 0;

    function getSelectedFilter() {
      return document.querySelector(".filter-button.active")?.dataset.filter || "all";
    }

    function ensureCard() {
      let card = grid.querySelector('[data-psa-book="true"]');
      if (!card) {
        card = createCard();
        grid.prepend(card);
      } else if (grid.firstElementChild !== card) {
        // Keep new publications first, even when buku.js redraws the grid.
        grid.prepend(card);
      }
      return card;
    }

    function sync() {
      const card = ensureCard();
      const active = getSelectedFilter();
      const query = (searchInput?.value || "").trim().toLocaleLowerCase("id-ID");
      const categoryMatches = ["all", "sanksi", "pph", "ppn"].includes(active);
      card.hidden = !(categoryMatches && searchable.includes(query));
      document.body.classList.toggle("psa-filter-active", active === "sanksi");

      const visible = [...grid.querySelectorAll(".book-card")].filter((node) => (
        !node.hidden && window.getComputedStyle(node).display !== "none"
      ));
      if (count) count.textContent = `${visible.length} buku ditemukan`;
      if (noResults) noResults.style.display = visible.length ? "none" : "block";
    }

    function scheduleSync() {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0;
        sync();
      });
    }

    // Re-add the card when the original catalog renders or replaces its grid.
    const observer = new MutationObserver(() => scheduleSync());
    observer.observe(grid, { childList: true });
    if (searchInput) searchInput.addEventListener("input", scheduleSync);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Ensure the new category works even if buku.js has a fixed set of filters.
        if (button.dataset.filter === "sanksi") {
          filterButtons.forEach((item) =>
            item.classList.toggle("active", item === button)
          );
        }
        scheduleSync();
      });
    });

    // The original JS may finish rendering later in the same turn.
    scheduleSync();
    window.addEventListener("load", scheduleSync, { once: true });
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setupDetail() {
    if (new URLSearchParams(window.location.search).get("id") !== BOOK.id) return;
    if (!document.getElementById("detailCover")) return;

    document.title = "Buku Panduan PSA 2026 | Kabayan";
    setText("detailBreadcrumb", "Panduan PSA 2026");
    setText("detailEyebrow", "Buku panduan digital · 2026");
    setText("detailHeadlineMain", "Buku Panduan Program");
    setText("detailHeadlineAccent", "PSA 2026");
    setText("detailDescription", BOOK.description);

    const cover = document.getElementById("detailCover");
    cover.src = BOOK.cover;
    cover.alt = "Mockup Buku Panduan Program Pengurangan atau Penghapusan Sanksi Administrasi PSA 2026";
    cover.width = 447;
    cover.height = 558;
    const webp = document.getElementById("detailCoverWebp");
    if (webp) webp.srcset = BOOK.cover;

    const tags = document.getElementById("detailTags");
    if (tags) tags.innerHTML = [
      "Sanksi Administrasi", "PMK 71 Tahun 2026", "KEP-239/PJ/2026", "PSA"
    ].map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    const info = document.getElementById("detailInfo");
    if (info) info.innerHTML = [
      ["Penulis", BOOK.authors],
      ["Tahun", "2026"],
      ["Format", "Buku digital"],
      ["Dasar regulasi", "PMK 71 Tahun 2026 dan KEP-239/PJ/2026"]
    ].map(([label, value]) =>
      `<div class="info-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`
    ).join("");

    for (const id of ["detailHeroDownload", "detailCtaDownload"]) {
      const link = document.getElementById(id);
      if (link) {
        link.href = BOOK.downloadUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }

    setText("detailMaterialKicker", "Sekilas isi panduan");
    setText("detailMaterialTitle", "Apa yang dibahas dalam buku?");
    const materials = document.getElementById("detailMaterials");
    if (materials) materials.innerHTML = [
      "Gambaran umum program PSA",
      "Ruang lingkup dan jenis sanksi administrasi",
      "Persyaratan dan dokumen permohonan",
      "Alur pengajuan serta ketentuan terkait"
    ].map((item, i) => `
      <article class="material-card">
        <span class="material-number">${String(i + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(item)}</h3>
      </article>
    `).join("");

    setText("detailCtaTitle", "Pelajari panduan PSA 2026.");
    setText("detailCtaText", "Unduh buku sebagai referensi pembelajaran dan periksa kembali ketentuan resmi yang berlaku sebelum mengajukan permohonan.");
    setText("detailDisclaimer", "Buku ini disediakan untuk tujuan edukasi perpajakan. Untuk penerapan pada kasus tertentu, gunakan ketentuan resmi dan penjelasan otoritas yang berlaku.");

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = BOOK.description;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setupCatalog();
      setupDetail();
    }, { once: true });
  } else {
    setupCatalog();
    setupDetail();
  }
})();
