(() => {
  "use strict";

  const input = document.getElementById("articleSearchInput");
  const clearButton = document.getElementById("articleClearSearch");
  const cards = Array.from(
    document.querySelectorAll("#articleGrid [data-article-item]")
  );
  const filterButtons = Array.from(
    document.querySelectorAll(
      "#articleFilterRow .article-filter-button[data-category]"
    )
  );
  const resultCount = document.getElementById("articleResultCount");
  const emptyState = document.getElementById("articleEmpty");
  const featuredSection = document.getElementById("articleFeaturedSection");

  if (!input) return;

  let activeCategory = "all";

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const getSearchText = (card) => {
    /*
     * data-search berisi metadata hasil Jekyll.
     * textContent dipakai sebagai fallback tambahan.
     */
    return normalize(
      `${card.dataset.search || ""} ${card.textContent || ""}`
    );
  };

  const render = () => {
    const query = normalize(input.value);
    const normalizedCategory = normalize(activeCategory);
    let visibleCount = 0;

    cards.forEach((card) => {
      const searchableText = getSearchText(card);
      const cardCategory = normalize(card.dataset.category);

      const matchesQuery =
        query === "" || searchableText.includes(query);

      const matchesCategory =
        normalizedCategory === "all" ||
        cardCategory === normalizedCategory;

      const shouldShow = matchesQuery && matchesCategory;

      /*
       * Pakai class + hidden sekaligus.
       * Class dengan display:none!important mencegah CSS card
       * mengalahkan atribut hidden pada browser tertentu.
       */
      card.classList.toggle("is-search-hidden", !shouldShow);
      card.hidden = !shouldShow;
      card.setAttribute(
        "aria-hidden",
        shouldShow ? "false" : "true"
      );

      if (shouldShow) visibleCount += 1;
    });

    if (resultCount) {
      resultCount.textContent = `${visibleCount} artikel`;
    }

    if (emptyState) {
      emptyState.classList.toggle(
        "visible",
        visibleCount === 0
      );
    }

    if (clearButton) {
      clearButton.classList.toggle(
        "visible",
        query !== ""
      );
    }

    /*
     * Saat pengguna mencari atau memilih kategori,
     * tampilkan hanya hasil katalog, tanpa artikel unggulan.
     */
    if (featuredSection) {
      featuredSection.classList.toggle(
        "is-hidden",
        query !== "" || normalizedCategory !== "all"
      );
    }
  };

  input.addEventListener("input", render);
  input.addEventListener("search", render);
  input.addEventListener("keyup", render);

  clearButton?.addEventListener("click", () => {
    input.value = "";
    input.focus();
    render();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory =
        button.dataset.category || "all";

      filterButtons.forEach((item) => {
        item.classList.toggle(
          "active",
          item === button
        );
      });

      render();
    });
  });

  render();
})();
