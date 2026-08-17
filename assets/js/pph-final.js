(() => {
  "use strict";

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const cards = Array.from(document.querySelectorAll(".pf-type-card[data-topic-target]"));
  const panels = Array.from(document.querySelectorAll("[data-topic-panel]"));
  const filters = Array.from(document.querySelectorAll(".pf-filter-button[data-filter]"));
  const search = document.getElementById("pfTypeSearch");
  const count = document.getElementById("pfVisibleCount");
  const empty = document.getElementById("pfTopicEmpty");
  const stage = document.getElementById("pfTopicStage");
  const grid = document.getElementById("pfTypeGrid");

  let activeFilter = "all";
  let selectedTopic = null;

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cardFor = (topic) =>
    cards.find((card) => card.dataset.topicTarget === topic) || null;

  const panelFor = (topic) =>
    panels.find((panel) => panel.dataset.topicPanel === topic) || null;

  const closeTopic = (updateHash = true) => {
    selectedTopic = null;

    cards.forEach((card) => {
      card.classList.remove("is-selected");
      card.setAttribute("aria-pressed", "false");
    });

    panels.forEach((panel) => {
      panel.hidden = true;
    });

    if (empty) empty.hidden = false;

    if (updateHash && location.hash.startsWith("#jenis-")) {
      history.replaceState(null, "", `${location.pathname}${location.search}#jenis-pph-final`);
    }
  };

  const selectTopic = (topic, options = {}) => {
    const { scroll = true, updateHash = true } = options;
    const card = cardFor(topic);
    const panel = panelFor(topic);
    if (!card || !panel || card.hidden) return;

    selectedTopic = topic;

    cards.forEach((item) => {
      const active = item === card;
      item.classList.toggle("is-selected", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });

    panels.forEach((item) => {
      item.hidden = item !== panel;
    });

    if (empty) empty.hidden = true;

    if (updateHash) {
      history.replaceState(null, "", `${location.pathname}${location.search}#jenis-${topic}`);
    }

    if (scroll) {
      requestAnimationFrame(() => {
        panel.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start"
        });
      });
    }
  };

  const applyFilter = () => {
    const term = normalize(search?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      const category = normalize(card.dataset.category);
      const haystack = normalize(`${card.dataset.search || ""} ${card.textContent || ""}`);
      const categoryMatch = activeFilter === "all" || category === activeFilter;
      const termMatch = !term || haystack.includes(term);
      const show = categoryMatch && termMatch;

      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = String(visible);
    if (grid) grid.classList.toggle("is-empty", visible === 0);

    if (selectedTopic) {
      const selectedCard = cardFor(selectedTopic);
      if (!selectedCard || selectedCard.hidden) closeTopic(false);
    }
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const topic = card.dataset.topicTarget;
      if (!topic) return;

      if (selectedTopic === topic) {
        // Keep it open; a second click simply refocuses the detail.
        const panel = panelFor(topic);
        if (panel) {
          panel.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start"
          });
        }
        return;
      }

      selectTopic(topic);
    });
  });

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filters.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });

      applyFilter();
    });
  });

  if (search) search.addEventListener("input", applyFilter);

  document.querySelectorAll("[data-close-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      closeTopic();
      document.getElementById("jenis-pph-final")?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  // FAQ stays compact on small screens: only one item open at a time.
  const faqItems = Array.from(document.querySelectorAll(".pf-faq-list details"));
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open || window.innerWidth > 720) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  // Support direct links such as #jenis-sewa and old links such as #sewa.
  const openFromHash = () => {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ""));
    if (!raw) return;

    const topic = raw.startsWith("jenis-") ? raw.slice(6) : raw;
    if (cardFor(topic)) {
      selectTopic(topic, { scroll: false, updateHash: false });
      requestAnimationFrame(() => {
        panelFor(topic)?.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
  };

  applyFilter();
  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();
