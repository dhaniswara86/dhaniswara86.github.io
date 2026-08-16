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
    rows.length === 0
  ) {
    console.error(
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


      const visible =
        matchSuami && matchIstri;


      if (visible) {

        row.style.setProperty(
          "display",
          "table-row",
          "important"
        );

        visibleCount++;

      } else {

        row.style.setProperty(
          "display",
          "none",
          "important"
        );

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


  applyFilter();

})();
