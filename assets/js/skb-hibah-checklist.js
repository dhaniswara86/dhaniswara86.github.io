(() => {
  "use strict";

  const STORAGE_KEY = "kabayan-skb-hibah-checklist-v12";

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch (_) {
      return {};
    }
  }

  function initChecklist(root) {
    const items = Array.from(root.querySelectorAll(".kb-ref-item"));
    const countEl = root.querySelector("[data-check-count]");
    const progressEl = root.querySelector("[data-check-progress]");
    const resetBtn = root.querySelector("[data-check-reset]");
    const printBtn = root.querySelector("[data-check-print]");

    if (!items.length || !countEl || !progressEl) return;

    const stored = safeParse(localStorage.getItem(STORAGE_KEY) || "{}");

    items.forEach((item) => {
      const id = item.dataset.checkId;
      const check = item.querySelector(".kb-check-input");
      const na = item.querySelector(".kb-na-input");

      if (!id || !check) return;

      const saved = stored[id] || {};
      check.checked = Boolean(saved.checked);

      if (na) {
        na.checked = Boolean(saved.na);

        if (na.checked) {
          check.checked = false;
          check.disabled = true;
        }
      }

      check.addEventListener("change", () => {
        if (check.checked && na) {
          na.checked = false;
          check.disabled = false;
        }
        update();
      });

      if (na) {
        na.addEventListener("change", () => {
          if (na.checked) {
            check.checked = false;
            check.disabled = true;
          } else {
            check.disabled = false;
          }
          update();
        });
      }
    });

    function saveState() {
      const state = {};

      items.forEach((item) => {
        const id = item.dataset.checkId;
        const check = item.querySelector(".kb-check-input");
        const na = item.querySelector(".kb-na-input");

        if (!id || !check) return;

        state[id] = {
          checked: check.checked,
          na: na ? na.checked : false
        };
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (_) {}
    }

    function update() {
      let applicable = 0;
      let complete = 0;

      items.forEach((item) => {
        const check = item.querySelector(".kb-check-input");
        const na = item.querySelector(".kb-na-input");

        const isNa = Boolean(na && na.checked);
        const isChecked = Boolean(check && check.checked);

        item.classList.toggle("is-na", isNa);
        item.classList.toggle("is-checked", !isNa && isChecked);

        if (!isNa) {
          applicable += 1;
          if (isChecked) complete += 1;
        }
      });

      const percent = applicable === 0
        ? 100
        : Math.round((complete / applicable) * 100);

      countEl.textContent =
        `${complete} dari ${applicable} butir selesai (${percent}%)`;

      progressEl.style.width = `${percent}%`;

      saveState();
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const confirmed = window.confirm("Reset seluruh checklist?");
        if (!confirmed) return;

        items.forEach((item) => {
          const check = item.querySelector(".kb-check-input");
          const na = item.querySelector(".kb-na-input");

          if (check) {
            check.checked = false;
            check.disabled = false;
          }

          if (na) {
            na.checked = false;
          }
        });

        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) {}

        update();
      });
    }

    if (printBtn) {
      printBtn.addEventListener("click", () => {
        document.body.classList.add("kb-print-checklist");
        window.print();
      });

      window.addEventListener("afterprint", () => {
        document.body.classList.remove("kb-print-checklist");
      });
    }

    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-kb-checklist]").forEach(initChecklist);
  });
})();
