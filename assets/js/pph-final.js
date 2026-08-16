(() => {
  "use strict";

  const root = document.querySelector(".pf-article-v2");
  if (!root) return;

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  /* -------------------------------------------------------
     Peta objek: filter + pencarian
     ------------------------------------------------------- */
  const rateGrid = root.querySelector("#pfRateGrid");
  const rateCards = Array.from(root.querySelectorAll(".pf-rate-card"));
  const searchInput = root.querySelector("#pfRateSearch");
  const filterButtons = Array.from(root.querySelectorAll(".pf-filter-button[data-filter]"));
  const visibleCount = root.querySelector("#pfVisibleCount");
  let activeFilter = "all";

  const emptyState = document.createElement("div");
  emptyState.className = "pf-map-empty";
  emptyState.hidden = true;
  emptyState.innerHTML = "<strong>Objek tidak ditemukan.</strong><span>Coba gunakan istilah lain atau pilih kategori Semua.</span>";
  if (rateGrid) rateGrid.insertAdjacentElement("afterend", emptyState);

  const applyFilter = () => {
    const term = normalize(searchInput?.value);
    let count = 0;

    rateCards.forEach((card) => {
      const categoryMatch = activeFilter === "all" || card.dataset.category === activeFilter;
      const haystack = normalize(`${card.dataset.search || ""} ${card.textContent || ""}`);
      const searchMatch = !term || haystack.includes(term);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) count += 1;
    });

    if (visibleCount) visibleCount.textContent = String(count);
    emptyState.hidden = count !== 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      applyFilter();
    });
  });

  searchInput?.addEventListener("input", applyFilter);
  applyFilter();

  /* -------------------------------------------------------
     Kartu tarif -> buka detail yang sesuai
     ------------------------------------------------------- */
  const openTopicFromHash = (hash, smooth = false) => {
    if (!hash || hash === "#") return;
    const target = root.querySelector(hash);
    if (!(target instanceof HTMLDetailsElement) || !target.classList.contains("pf-topic")) return;

    target.open = true;

    // Beri waktu browser menghitung tinggi detail setelah dibuka.
    window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto",
        block: "start"
      });
    });
  };

  rateCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const href = card.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      event.preventDefault();
      if (history.pushState) history.pushState(null, "", href);
      else location.hash = href;
      openTopicFromHash(href, true);
    });
  });

  window.addEventListener("hashchange", () => openTopicFromHash(location.hash, false));
  if (location.hash) openTopicFromHash(location.hash, false);

  /* -------------------------------------------------------
     Detail objek: di HP cukup satu objek terbuka per kelompok
     ------------------------------------------------------- */
  const topics = Array.from(root.querySelectorAll("details.pf-topic"));
  topics.forEach((topic) => {
    topic.addEventListener("toggle", () => {
      if (!topic.open || window.innerWidth > 720) return;
      const group = topic.closest(".pf-topic-group");
      if (!group) return;
      group.querySelectorAll("details.pf-topic[open]").forEach((other) => {
        if (other !== topic) other.open = false;
      });
    });
  });

  /* -------------------------------------------------------
     FAQ: satu jawaban terbuka pada layar kecil
     ------------------------------------------------------- */
  const faqItems = Array.from(root.querySelectorAll(".pf-faq-list details"));
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open || window.innerWidth > 720) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
