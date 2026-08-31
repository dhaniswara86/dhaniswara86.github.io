(() => {
  "use strict";

  const DATA_URL = "data/buku.json";
  const DETAIL_PAGE = "buku-detail.html";

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const searchInput = document.getElementById("bookSearch");
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const resultCount = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");
  const bookGrid = document.getElementById("bookGrid");

  let books = [];
  let activeFilter = "all";

  function setupMobileMenu() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener("click", () => {
      const isActive = mobileMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open", isActive);
      menuToggle.setAttribute("aria-expanded", String(isActive));
      menuToggle.textContent = isActive ? "×" : "☰";
    });

    document.querySelectorAll(".mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  function detailUrl(book) {
    if (book.detailReady) {
      return `${DETAIL_PAGE}?id=${encodeURIComponent(book.slug)}`;
    }

    return book.legacyDetailUrl || "#";
  }

  function createTag(text) {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = text;
    return tag;
  }

  function createBookCard(book) {
    const article = document.createElement("article");
    article.className = "book-card";
    article.dataset.search = [
      book.title,
      book.description,
      ...(book.tags || []),
      ...(book.filterTags || [])
    ].join(" ").toLowerCase();
    article.dataset.tags = (book.filterTags || []).join(" ").toLowerCase();

    const visual = document.createElement("div");
    visual.className = "book-visual";

    if (book.badge) {
      const badge = document.createElement("span");
      badge.className = "new-badge";
      badge.textContent = book.badge;
      visual.appendChild(badge);
    }

    const image = document.createElement("img");
    image.src = book.cover;
    image.alt = book.coverAlt || book.title;
    image.loading = "lazy";
    visual.appendChild(image);

    const content = document.createElement("div");
    content.className = "book-content";

    const tags = document.createElement("div");
    tags.className = "tags";
    (book.tags || []).forEach((tagText) => tags.appendChild(createTag(tagText)));

    const heading = document.createElement("h3");
    heading.textContent = book.title;

    const description = document.createElement("p");
    description.className = "book-description";
    description.textContent = book.description;

    const meta = document.createElement("div");
    meta.className = "book-meta";
    [
      book.version ? `Versi ${book.version}` : "",
      book.format || "",
      book.date || ""
    ].filter(Boolean).forEach((value) => {
      const span = document.createElement("span");
      span.textContent = value;
      meta.appendChild(span);
    });

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const detail = document.createElement("a");
    detail.className = "text-link";
    detail.href = detailUrl(book);
    detail.append(document.createTextNode("Lihat detail "));
    const chevron = document.createElement("span");
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = "›";
    detail.appendChild(chevron);

    const download = document.createElement("a");
    download.className = "download-button";
    download.href = book.downloadUrl;
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    download.textContent = "Unduh PDF";

    actions.append(detail, download);
    content.append(tags, heading, description, meta, actions);
    article.append(visual, content);

    return article;
  }

  function renderBooks() {
    bookGrid.replaceChildren(...books.map(createBookCard));
    applyFilters();
  }

  function applyFilters() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const cards = Array.from(bookGrid.querySelectorAll(".book-card"));
    let visibleCount = 0;

    cards.forEach((card) => {
      const searchText = card.dataset.search || "";
      const tagText = card.dataset.tags || "";
      const matchesSearch = !query || searchText.includes(query);
      const matchesFilter =
        activeFilter === "all" || tagText.split(/\s+/).includes(activeFilter);

      const shouldShow = matchesSearch && matchesFilter;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    resultCount.textContent =
      visibleCount === books.length
        ? `${visibleCount} buku tersedia`
        : `${visibleCount} buku ditemukan`;

    noResults.style.display = visibleCount === 0 ? "block" : "none";
  }

  async function loadBooks() {
    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      books = Array.isArray(payload) ? payload : payload.books;

      if (!Array.isArray(books)) {
        throw new Error("Format data/buku.json tidak valid.");
      }

      renderBooks();
    } catch (error) {
      console.error("Gagal memuat katalog buku:", error);
      resultCount.textContent = "Katalog gagal dimuat";
      noResults.textContent =
        "Data buku tidak dapat dimuat. Pastikan data/buku.json sudah diunggah dan situs dibuka melalui web server.";
      noResults.style.display = "block";
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);

  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  setupMobileMenu();
  loadBooks();
})();