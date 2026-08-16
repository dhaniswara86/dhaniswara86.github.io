(() => {
  "use strict";

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  /* =======================================================
     Matrix filter + search
     ======================================================= */
  const table = document.getElementById("pfMatrixTable");
  const searchInput = document.getElementById("pfMatrixSearch");
  const filterButtons = Array.from(
    document.querySelectorAll(".pf-filter-button[data-filter]")
  );
  const visibleCount = document.getElementById("pfVisibleCount");

  if (table && searchInput && filterButtons.length) {
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    let activeFilter = "all";

    const applyMatrixFilter = () => {
      const term = normalize(searchInput.value);
      let count = 0;

      rows.forEach((row) => {
        const categories = normalize(row.dataset.category)
          .split(/\s+/)
          .filter(Boolean);

        const haystack = normalize(
          `${row.dataset.search || ""} ${row.textContent || ""}`
        );

        const categoryMatches =
          activeFilter === "all" || categories.includes(activeFilter);
        const searchMatches = !term || haystack.includes(term);
        const show = categoryMatches && searchMatches;

        row.hidden = !show;
        if (show) count += 1;
      });

      if (visibleCount) visibleCount.textContent = String(count);
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";

        filterButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });

        applyMatrixFilter();
      });
    });

    searchInput.addEventListener("input", applyMatrixFilter);

    filterButtons.forEach((button, index) => {
      button.setAttribute(
        "aria-pressed",
        index === 0 ? "true" : "false"
      );
    });

    applyMatrixFilter();
  }

  /* =======================================================
     Educational calculator
     ======================================================= */
  const objectSelect = document.getElementById("pfCalculatorObject");
  const baseInput = document.getElementById("pfCalculatorBase");
  const rateOutput = document.getElementById("pfCalculatorRate");
  const baseOutput = document.getElementById("pfCalculatorBaseResult");
  const taxOutput = document.getElementById("pfCalculatorTax");
  const noteOutput = document.getElementById("pfCalculatorNote");

  if (
    objectSelect &&
    baseInput &&
    rateOutput &&
    baseOutput &&
    taxOutput
  ) {
    const numberFormatter = new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0
    });

    const rupiahFormatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    });

    const percentFormatter = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    const parseRupiah = (value) => {
      const cleaned = String(value || "").replace(/[^\d]/g, "");
      return cleaned ? Number(cleaned) : 0;
    };

    const updateCalculator = () => {
      const rate = Number(objectSelect.value || 0);
      const base = parseRupiah(baseInput.value);
      const tax = base * rate / 100;
      const selected = objectSelect.options[objectSelect.selectedIndex];

      rateOutput.textContent = `${percentFormatter.format(rate)}%`;
      baseOutput.textContent = rupiahFormatter.format(base);
      taxOutput.textContent = rupiahFormatter.format(tax);

      if (noteOutput) {
        noteOutput.textContent = selected?.dataset.note || "";
      }
    };

    baseInput.addEventListener("input", () => {
      const value = parseRupiah(baseInput.value);
      baseInput.value = value ? numberFormatter.format(value) : "";
      updateCalculator();
    });

    objectSelect.addEventListener("change", updateCalculator);
    updateCalculator();
  }

  /* =======================================================
     FAQ: close siblings on small screens for cleaner UX
     ======================================================= */
  const faqItems = Array.from(document.querySelectorAll(".pf-faq-list details"));

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open || window.innerWidth > 720) return;

      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
