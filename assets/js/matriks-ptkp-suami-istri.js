(() => {
  "use strict";

  const filterSuami = document.getElementById("ptkpFilterSuami");
  const filterIstri = document.getElementById("ptkpFilterIstri");
  const resetButton = document.getElementById("ptkpResetFilter");
  const resultCount = document.getElementById("ptkpResultCount");
  const emptyState = document.getElementById("ptkpEmptyState");

  const rows = Array.from(
    document.querySelectorAll(
      "#ptkpMatrixBody tr[data-suami][data-istri]"
    )
  );

  if (
    !filterSuami ||
    !filterIstri ||
    !resetButton ||
    !resultCount ||
    !emptyState ||
    rows.length === 0
  ) {
    return;
  }

  function applyFilter() {
    const suami = filterSuami.value;
    const istri = filterIstri.value;

    let visibleCount = 0;

    rows.forEach((row) => {
      const suamiMatch =
        !suami || row.dataset.suami === suami;

      const istriMatch =
        !istri || row.dataset.istri === istri;

      const isVisible =
        suamiMatch && istriMatch;

      row.classList.toggle(
        "ptkp-hidden",
        !isVisible
      );

      if (isVisible) {
        visibleCount += 1;
      }
    });

    resultCount.textContent =
      `Menampilkan ${visibleCount} kombinasi`;

    emptyState.hidden =
      visibleCount !== 0;
  }

  function resetFilter() {
    filterSuami.value = "";
    filterIstri.value = "";

    applyFilter();
  }

  filterSuami.addEventListener(
    "change",
    applyFilter
  );

  filterIstri.addEventListener(
    "change",
    applyFilter
  );

  resetButton.addEventListener(
    "click",
    resetFilter
  );

  applyFilter();
})();
