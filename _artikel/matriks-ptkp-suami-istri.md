(function () {
  "use strict";

  function initPtkpFilter() {
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

    const rows = Array.from(
      document.querySelectorAll(
        "#ptkpMatrixBody tr[data-suami][data-istri]"
      )
    );

    /*
     * Jika elemen artikel PTKP tidak ada,
     * script tidak perlu dijalankan.
     */
    if (
      !filterSuami ||
      !filterIstri ||
      !resetButton ||
      !resultCount ||
      !emptyState ||
      rows.length === 0
    ) {
      console.warn(
        "Kabayan PTKP: elemen filter tidak ditemukan."
      );

      return;
    }

    function applyFilter() {
      const selectedSuami =
        filterSuami.value;

      const selectedIstri =
        filterIstri.value;

      let visibleCount = 0;

      rows.forEach(function (row) {
        const rowSuami =
          row.getAttribute("data-suami");

        const rowIstri =
          row.getAttribute("data-istri");

        const matchSuami =
          selectedSuami === "" ||
          rowSuami === selectedSuami;

        const matchIstri =
          selectedIstri === "" ||
          rowIstri === selectedIstri;

        const shouldShow =
          matchSuami && matchIstri;

        row.classList.toggle(
          "ptkp-hidden",
          !shouldShow
        );

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      resultCount.textContent =
        "Menampilkan " +
        visibleCount +
        " kombinasi";

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

    /*
     * Jalankan kondisi awal.
     */
    applyFilter();
  }

  /*
   * PENTING:
   * Jangan menjalankan filter sebelum
   * seluruh HTML artikel selesai dimuat.
   */
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initPtkpFilter
    );
  } else {
    initPtkpFilter();
  }
})();
