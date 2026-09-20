(() => {
  "use strict";

  const DATA_URL = "data/buku.json";
  const DETAIL_PAGE = "buku-detail.html";

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const main = document.getElementById("mainContent");
  const footer = document.querySelector("footer");
  const featuredStack = document.getElementById("featuredStack");
  const searchInput = document.getElementById("bookSearch");
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const resultCount = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");
  const bookGrid = document.getElementById("bookGrid");

  let books = [];
  let activeFilter = "all";
  let menuCloseTimer = 0;

  function setupMobileMenu() {
    if (!menuToggle || !mobileMenu) return;

    const setMenuOpen = (open, restoreFocus = false) => {
      window.clearTimeout(menuCloseTimer);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      document.body.classList.toggle("nav-open", open);
      if (main) main.inert = open;
      if (footer) footer.inert = open;

      if (open) {
        mobileMenu.hidden = false;
        window.requestAnimationFrame(() => {
          mobileMenu.classList.add("is-open");
          mobileMenu.querySelector("a")?.focus({ preventScroll: true });
        });
      } else {
        mobileMenu.classList.remove("is-open");
        menuCloseTimer = window.setTimeout(() => {
          if (menuToggle.getAttribute("aria-expanded") === "false") mobileMenu.hidden = true;
        }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 280);
        if (restoreFocus) menuToggle.focus({ preventScroll: true });
      }
    };

    menuToggle.addEventListener("click", () => {
      setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenuOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false, true);
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", closeOnDesktop);
    else desktopQuery.addListener?.(closeOnDesktop);
    window.addEventListener("pageshow", () => setMenuOpen(false));
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function normalizedFilterTags(book) {
    const tags = new Set((book.filterTags || []).map(normalizeText));
    if ([...tags].some((tag) => tag === "pph" || tag.startsWith("pph-"))) tags.add("pph");
    if ([...tags].some((tag) => tag === "ppn" || tag.startsWith("ppn-"))) tags.add("ppn");
    return [...tags];
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
    ].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    article.dataset.tags = normalizedFilterTags(book).join(" ");

    const bookDetailUrl = detailUrl(book);

    const visual = document.createElement("div");
    visual.className = "book-visual";

    if (book.badge) {
      const badge = document.createElement("span");
      badge.className = "new-badge";
      badge.textContent = book.badge;
      visual.appendChild(badge);
    }

    const visualLink = document.createElement("a");
    visualLink.className = "book-cover-link";
    visualLink.href = bookDetailUrl;
    visualLink.setAttribute("aria-label", `Lihat detail ${book.title}`);

    const image = document.createElement("img");
    image.src = book.cover;
    image.alt = book.coverAlt || book.title;
    image.loading = "lazy";
    image.decoding = "async";
    visualLink.appendChild(image);
    visual.appendChild(visualLink);

    const content = document.createElement("div");
    content.className = "book-content";

    const tags = document.createElement("div");
    tags.className = "tags";
    (book.tags || []).forEach((tagText) => tags.appendChild(createTag(tagText)));

    const heading = document.createElement("h3");
    const headingLink = document.createElement("a");
    headingLink.className = "book-title-link";
    headingLink.href = bookDetailUrl;
    headingLink.textContent = book.title;
    heading.appendChild(headingLink);

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
    detail.href = bookDetailUrl;
    detail.textContent = "Lihat detail";
    detail.setAttribute("aria-label", `Lihat detail ${book.title}`);

    const download = document.createElement("a");
    download.className = "download-button";
    download.href = book.downloadUrl;
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    download.textContent = "Unduh PDF";
    download.setAttribute("aria-label", `Unduh PDF ${book.title}`);

    actions.append(detail, download);
    content.append(tags, heading, description, meta, actions);
    article.append(visual, content);

    return article;
  }

  function renderFeaturedBooks() {
    if (!featuredStack) return;
    const positions = ["left", "center", "right"];
    const featuredBooks = books
      .filter((book) => book.featured)
      .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99))
      .slice(0, 3);

    const links = featuredBooks.map((book, index) => {
      const link = document.createElement("a");
      link.className = `featured-book-link ${positions[index]}`;
      link.href = detailUrl(book);
      link.setAttribute("aria-label", book.title);

      const image = document.createElement("img");
      image.src = book.cover;
      image.alt = book.coverAlt || book.title;
      image.width = 1122;
      image.height = 1402;
      image.loading = "lazy";
      image.decoding = "async";
      link.appendChild(image);
      return link;
    });

    if (links.length === 3) featuredStack.replaceChildren(...links);
    else featuredStack.textContent = "Buku pilihan belum tersedia.";
  }

  function renderBooks() {
    bookGrid.replaceChildren(...books.map(createBookCard));
    renderFeaturedBooks();
    applyFilters();
  }

  function applyFilters() {
    const query = normalizeText((searchInput?.value || "").trim());
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
      const response = await fetch(DATA_URL, { cache: "default" });

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
      if (featuredStack) featuredStack.textContent = "Buku pilihan gagal dimuat.";
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
        item.setAttribute("aria-pressed", String(item === button));
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
