(function () {
  "use strict";

  const filterSuami =
    document.getElementById("ptkpFilterSuami");

  const filterIstri =
    document.getElementById("ptkpFilterIstri");

  const resetButton =
    document.getElementById("ptkpResetFilter");

  const resultCount =
    document.getElementById("ptkpResultCount");

  const emptyState =
    document.getElementById("ptkpEmptyState");

  const rows =
    document.querySelectorAll(
      "#ptkpMatrixBody tr[data-suami][data-istri]"
    );

  if (
    !filterSuami ||
    !filterIstri ||
    !resetButton ||
    !resultCount ||
    !emptyState ||
    !rows.length
  ) {
    console.error(
      "PTKP Filter: elemen yang diperlukan tidak ditemukan."
    );
    return;
  }

  function applyFilter() {
    const selectedSuami = filterSuami.value;
    const selectedIstri = filterIstri.value;

    let visibleCount = 0;

    rows.forEach(function (row) {
      const rowSuami =
        row.getAttribute("data-suami");

      const rowIstri =
        row.getAttribute("data-istri");

      const matchSuami =
        selectedSuami === "" ||
        selectedSuami === rowSuami;

      const matchIstri =
        selectedIstri === "" ||
        selectedIstri === rowIstri;

      const visible =
        matchSuami && matchIstri;

      if (visible) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    resultCount.textContent =
      "Menampilkan " +
      visibleCount +
      " kombinasi";

    if (visibleCount === 0) {
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
    }
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
    function () {
      filterSuami.value = "";
      filterIstri.value = "";
      applyFilter();
    }
  );

  applyFilter();

  console.log(
    "PTKP Filter aktif:",
    rows.length,
    "baris ditemukan."
  );
})();
