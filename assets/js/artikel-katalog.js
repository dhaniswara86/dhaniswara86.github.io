(() => {
  "use strict";

  const input = document.getElementById("articleSearchInput");
  const clear = document.getElementById("articleClearSearch");
  const cards = [...document.querySelectorAll("[data-article-item]")];
  const filters = [...document.querySelectorAll("[data-category]")];
  const count = document.getElementById("articleResultCount");
  const empty = document.getElementById("articleEmpty");
  const featured = document.getElementById("articleFeaturedSection");

  if (!input) return;

  let activeCategory = "all";

  const normalize = value =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const render = () => {
    const query = normalize(input.value);
    let visible = 0;

    cards.forEach(card => {
      const haystack = normalize(card.dataset.search);
      const category = normalize(card.dataset.category);
      const matchesQuery = !query || haystack.includes(query);
      const matchesCategory =
        activeCategory === "all" ||
        category === normalize(activeCategory);

      const show = matchesQuery && matchesCategory;
      card.hidden = !show;
      if (show) visible++;
    });

    if (count) {
      count.textContent =
        visible + (visible === 1 ? " artikel" : " artikel");
    }

    if (empty) {
      empty.classList.toggle("visible", visible === 0);
    }

    clear?.classList.toggle("visible", Boolean(query));

    /* Sesuai pola pencarian Kabayan: ketika mengetik, tampilkan hasil saja. */
    if (featured) {
      featured.classList.toggle("is-hidden", Boolean(query) || activeCategory !== "all");
    }
  };

  input.addEventListener("input", render);

  clear?.addEventListener("click", () => {
    input.value = "";
    input.focus();
    render();
  });

  filters.forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category || "all";
      filters.forEach(item => item.classList.toggle("active", item === button));
      render();
    });
  });

  render();
})();
