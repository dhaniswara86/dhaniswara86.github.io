(() => {
  "use strict";

  const STORAGE_KEY = "kabayan-skb-hibah-checklist-v1";

  function safeParse(value) {
    try {
      return JSON.parse(value);
    } catch (_) {
      return {};
    }
  }

  function initChecklist(root) {
    const items = Array.from(root.querySelectorAll(".kb-check-item"));
    const countEl = root.querySelector("[data-check-count]");
    const statusEl = root.querySelector("[data-check-status]");
    const progressEl = root.querySelector("[data-check-progress]");
    const messageEl = root.querySelector("[data-check-message]");
    const resetBtn = root.querySelector("[data-check-reset]");

    if (!items.length || !countEl || !statusEl || !progressEl) return;

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
      } catch (_) {
        // Checklist tetap berjalan apabila penyimpanan browser dibatasi.
      }
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
        `${complete} dari ${applicable} persyaratan terpenuhi`;

      progressEl.style.width = `${percent}%`;

      const ready = applicable > 0 && complete === applicable;

      statusEl.textContent = ready ? "Siap diajukan" : "Belum lengkap";
      statusEl.classList.toggle("is-ready", ready);
      statusEl.classList.toggle("is-pending", !ready);

      if (messageEl) {
        const remaining = applicable - complete;

        if (ready) {
          messageEl.textContent =
            "Seluruh persyaratan yang relevan sudah Anda konfirmasi. Lakukan pemeriksaan akhir sebelum mengirim permohonan.";
        } else if (remaining === 1) {
          messageEl.textContent =
            "Masih ada 1 persyaratan yang belum Anda konfirmasi.";
        } else {
          messageEl.textContent =
            `Masih ada ${remaining} persyaratan yang belum Anda konfirmasi.`;
        }
      }

      saveState();
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        const confirmed = window.confirm(
          "Kosongkan seluruh checklist kesiapan permohonan?"
        );

        if (!confirmed) return;

        items.forEach((item) => {
          const check = item.querySelector(".kb-check-input");
          const na = item.querySelector(".kb-na-input");

          if (check) {
            check.checked = false;
            check.disabled = false;
          }

          if (na) na.checked = false;
        });

        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) {}

        update();
      });
    }

    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-kb-checklist]").forEach(initChecklist);
  });
})();
