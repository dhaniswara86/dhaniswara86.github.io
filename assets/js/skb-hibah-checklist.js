(() => {
  "use strict";

  const STORAGE_KEY = "kabayan-skb-hibah-checklist-final";

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (_) {
      return {};
    }
  }

  function init(root) {
    const rows = Array.from(root.querySelectorAll(".kb-checklist-row[data-check-id]"));
    const count = root.querySelector("[data-check-count]");
    const progress = root.querySelector("[data-check-progress]");
    const reset = root.querySelector("[data-check-reset]");
    const print = root.querySelector("[data-check-print]");

    if (!rows.length || !count || !progress) return;

    const saved = readState();

    rows.forEach((row) => {
      const input = row.querySelector(".kb-check-input");
      if (!input) return;
      input.checked = Boolean(saved[row.dataset.checkId]);
      input.addEventListener("change", update);
    });

    function save() {
      const state = {};
      rows.forEach((row) => {
        state[row.dataset.checkId] =
          Boolean(row.querySelector(".kb-check-input")?.checked);
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (_) {}
    }

    function update() {
      const total = rows.length;
      const done = rows.reduce((sum, row) => {
        const checked = Boolean(row.querySelector(".kb-check-input")?.checked);
        return sum + (checked ? 1 : 0);
      }, 0);

      const percent = total ? Math.round((done / total) * 100) : 0;
      count.textContent = `${done} dari ${total} butir selesai (${percent}%)`;
      progress.style.width = `${percent}%`;
      save();
    }

    if (reset) {
      reset.addEventListener("click", () => {
        if (!window.confirm("Reset seluruh checklist?")) return;
        rows.forEach((row) => {
          const input = row.querySelector(".kb-check-input");
          if (input) input.checked = false;
        });
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) {}
        update();
      });
    }

    if (print) {
      print.addEventListener("click", () => {
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
    document.querySelectorAll("[data-kb-checklist]").forEach(init);
  });
})();
