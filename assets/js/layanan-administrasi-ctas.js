(() => {
  "use strict";

  function initCtasArticle() {
    /* =====================================================
       TOC KHUSUS ARTIKEL
       ===================================================== */
    const toc = document.getElementById("articleToc");

    if (toc) {
      const items = [
        ["#cara-menggunakan", "Cara menggunakan"],
        ["#daftar-layanan", "Tabel layanan"],
        ["#catatan-sumber", "Catatan sumber"]
      ];

      toc.innerHTML = items
        .map(([href, label]) => `<a href="${href}">${label}</a>`)
        .join("");

      const links = Array.from(toc.querySelectorAll("a"));
      const sections = links
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

      const updateActive = () => {
        const marker = window.scrollY + 145;
        let activeId = sections[0]?.id || "";

        sections.forEach((section) => {
          if (section.offsetTop <= marker) {
            activeId = section.id;
          }
        });

        links.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + activeId
          );
        });
      };

      window.addEventListener("scroll", updateActive, { passive: true });
      updateActive();
    }

    /* =====================================================
       FILTER 76 LAYANAN
       ===================================================== */
    const searchInput = document.getElementById("serviceSearch");
    const prefixFilter = document.getElementById("prefixFilter");
    const timelineFilter = document.getElementById("timelineFilter");
    const resetFilters = document.getElementById("resetFilters");
    const visibleCount = document.getElementById("visibleCount");
    const emptyState = document.getElementById("emptyState");
    const tableWrapper = document.getElementById("tableWrapper");
    const rows = Array.from(
      document.querySelectorAll("#serviceTableBody tr")
    );

    if (
      !searchInput ||
      !prefixFilter ||
      !timelineFilter ||
      !resetFilters ||
      !visibleCount ||
      !emptyState ||
      !tableWrapper ||
      !rows.length
    ) {
      return;
    }

    const normalize = (value) =>
      String(value || "")
        .toLocaleLowerCase("id-ID")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const setRowVisible = (row, isVisible) => {
      /*
       * CSS tabel memakai display:table-row !important pada desktop
       * dan display:block !important pada mobile.
       * Karena itu baris tersembunyi dipaksa display:none!important.
       */
      if (isVisible) {
        row.hidden = false;
        row.style.removeProperty("display");
        row.classList.remove("ctas-filter-hidden");
        row.setAttribute("aria-hidden", "false");
      } else {
        row.hidden = true;
        row.style.setProperty("display", "none", "important");
        row.classList.add("ctas-filter-hidden");
        row.setAttribute("aria-hidden", "true");
      }
    };

    const setElementVisible = (element, isVisible) => {
      if (isVisible) {
        element.hidden = false;
        element.style.removeProperty("display");
      } else {
        element.hidden = true;
        element.style.setProperty("display", "none", "important");
      }
    };

    const applyFilters = () => {
      const query = normalize(searchInput.value);
      const prefix = prefixFilter.value;
      const timeline = timelineFilter.value;
      let shown = 0;

      rows.forEach((row) => {
        const searchableText = normalize(
          row.dataset.search || row.textContent
        );

        const matchesQuery =
          query === "" || searchableText.includes(query);

        const matchesPrefix =
          prefix === "" || row.dataset.prefix === prefix;

        const matchesTimeline =
          timeline === "" || row.dataset.timeline === timeline;

        const isVisible =
          matchesQuery && matchesPrefix && matchesTimeline;

        setRowVisible(row, isVisible);

        if (isVisible) {
          shown += 1;
        }
      });

      visibleCount.textContent = String(shown);

      setElementVisible(tableWrapper, shown > 0);

      if (shown === 0) {
        emptyState.classList.add("visible");
        emptyState.hidden = false;
        emptyState.style.removeProperty("display");
      } else {
        emptyState.classList.remove("visible");
        emptyState.hidden = true;
        emptyState.style.setProperty("display", "none", "important");
      }
    };

    searchInput.addEventListener("input", applyFilters);
    searchInput.addEventListener("search", applyFilters);
    prefixFilter.addEventListener("change", applyFilters);
    timelineFilter.addEventListener("change", applyFilters);

    resetFilters.addEventListener("click", () => {
      searchInput.value = "";
      prefixFilter.value = "";
      timelineFilter.value = "";
      applyFilters();
      searchInput.focus();
    });

    applyFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initCtasArticle,
      { once: true }
    );
  } else {
    initCtasArticle();
  }
})();
