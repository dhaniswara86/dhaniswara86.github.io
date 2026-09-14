(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    mobileMenu.hidden = !open;
    body.classList.toggle("menu-open", open);
    if (open) mobileMenu.querySelector("a")?.focus();
  }

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      closeNewsPopup();
    }
  });

  const revealNodes = [...document.querySelectorAll("[data-reveal]")];
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });
    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  const hero = document.querySelector(".hero");
  const floatCards = [...document.querySelectorAll("[data-float-card]")];
  if (hero && floatCards.length && !reduceMotion && window.matchMedia("(min-width: 821px)").matches) {
    let frame = 0;
    hero.addEventListener("pointermove", (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 10;
        const y = (event.clientY / window.innerHeight - 0.5) * 8;
        floatCards.forEach((card, index) => {
          const direction = index % 2 ? -1 : 1;
          card.style.translate = `${x * direction}px ${y * direction}px`;
        });
      });
    });
    hero.addEventListener("pointerleave", () => floatCards.forEach((card) => { card.style.translate = "0 0"; }));
  }

  const counter = document.querySelector("[data-counter]");
  if (counter && !reduceMotion && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      counterObserver.disconnect();
      const duration = 1050;
      const start = performance.now();
      const target = 12000000;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `Rp ${Math.round(target * eased).toLocaleString("id-ID")}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.65 });
    counterObserver.observe(counter);
  }

  function cleanText(value) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    return text.includes("{{") || text.includes("}}") ? "" : text;
  }

  function usableHref(value, fallback) {
    const href = String(value || "").trim();
    if (!href || href.includes("{{") || href.startsWith("#")) return fallback;
    try {
      return new URL(href, window.location.href).href;
    } catch {
      return fallback;
    }
  }

  async function fetchDocument(path) {
    const response = await fetch(path, { credentials: "same-origin" });
    if (!response.ok) throw new Error(`Tidak dapat memuat ${path}`);
    return new DOMParser().parseFromString(await response.text(), "text/html");
  }

  async function loadLatestArticle() {
    const titleNode = document.querySelector("[data-latest-article-title]");
    const linkNode = document.querySelector("[data-latest-article-link]");
    if (!titleNode || !linkNode) return;
    try {
      const doc = await fetchDocument("artikel.html");
      const link = doc.querySelector(".featured-card h3 a, .featured-card a.featured-link, .article-card h3 a");
      const title = cleanText(link?.textContent || doc.querySelector(".featured-card h3, .article-card h3")?.textContent);
      if (!title) return;
      titleNode.textContent = title;
      linkNode.href = usableHref(link?.getAttribute("href"), "artikel.html");
      linkNode.setAttribute("aria-label", `Baca artikel: ${title}`);
    } catch {
      // Konten fallback di HTML tetap ditampilkan ketika arsip belum dapat dibaca.
    }
  }

  const latestNews = {
    title: "Yang perlu diketahui. Sekarang.",
    summary: "Informasi singkat mengenai regulasi, layanan, Coretax, dan isu perpajakan penting.",
    date: "Pembaruan perpajakan",
    href: "hotnews.html"
  };

  async function loadLatestNews() {
    try {
      const doc = await fetchDocument("hotnews.html");
      const article = doc.querySelector("[data-featured-item], .featured-card, [data-hotnews-item], .article-card");
      const link = article?.querySelector("h3 a, a.featured-link, a.article-card-link") || doc.querySelector(".featured-card h3 a, .featured-link, .article-card h3 a");
      const title = cleanText(article?.querySelector("h3")?.textContent || link?.textContent);
      const summary = cleanText(article?.querySelector("p")?.textContent);
      const time = article?.querySelector("time");
      if (title) latestNews.title = title;
      if (summary) latestNews.summary = summary;
      latestNews.date = cleanText(time?.textContent) || latestNews.date;
      latestNews.href = usableHref(link?.getAttribute("href"), "hotnews.html");
    } catch {
      // Konten fallback di HTML tetap ditampilkan ketika arsip belum dapat dibaca.
    }

    document.querySelectorAll("[data-latest-news-title]").forEach((node) => { node.textContent = latestNews.title; });
    document.querySelectorAll("[data-latest-news-summary]").forEach((node) => { node.textContent = latestNews.summary; });
    document.querySelectorAll("[data-latest-news-date]").forEach((node) => { node.textContent = latestNews.date; });
    document.querySelectorAll("[data-latest-news-link]").forEach((node) => { node.href = latestNews.href; });
    document.querySelectorAll("[data-popup-title]").forEach((node) => { node.textContent = latestNews.title; });
    document.querySelectorAll("[data-popup-summary]").forEach((node) => { node.textContent = latestNews.summary; });
    document.querySelectorAll("[data-popup-link]").forEach((node) => { node.href = latestNews.href; });
    scheduleNewsPopup();
  }

  const popup = document.querySelector("[data-news-popup]");
  let lastFocusedElement = null;

  function popupStorageKey() {
    return `kabayan-news-seen:${latestNews.title.toLowerCase().replace(/\W+/g, "-").slice(0, 72)}`;
  }

  function openNewsPopup() {
    if (!popup || !popup.hidden) return;
    lastFocusedElement = document.activeElement;
    popup.hidden = false;
    body.classList.add("popup-open");
    popup.querySelector("[data-news-close]")?.focus();
  }

  function closeNewsPopup() {
    if (!popup || popup.hidden) return;
    popup.hidden = true;
    body.classList.remove("popup-open");
    try { window.localStorage.setItem(popupStorageKey(), "1"); } catch {}
    lastFocusedElement?.focus?.();
  }

  function scheduleNewsPopup() {
    if (!popup || reduceMotion || window.innerWidth < 480) return;
    let seen = false;
    try { seen = window.localStorage.getItem(popupStorageKey()) === "1"; } catch {}
    if (!seen) window.setTimeout(openNewsPopup, 1800);
  }

  popup?.querySelectorAll("[data-news-close]").forEach((button) => button.addEventListener("click", closeNewsPopup));
  popup?.querySelector("[data-popup-link]")?.addEventListener("click", () => {
    try { window.localStorage.setItem(popupStorageKey(), "1"); } catch {}
  });

  loadLatestArticle();
  loadLatestNews();
})();
