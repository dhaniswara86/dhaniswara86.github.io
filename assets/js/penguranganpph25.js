(() => {
  "use strict";

  const CHECKLIST_KEY = "kabayan-p25-checklist-v1";
  const q = (selector, scope = document) => scope.querySelector(selector);
  const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // ---------------- Checklist ----------------
  const checkboxes = qa("[data-p25-check]");
  const progressText = q("#p25ProgressText");
  const progressBar = q("#p25ProgressBar");
  const resetChecklist = q("#p25ResetChecklist");

  const updateChecklist = () => {
    if (!checkboxes.length) return;

    const completed = checkboxes.filter((box) => box.checked).length;
    const total = checkboxes.length;
    const pct = total ? (completed / total) * 100 : 0;

    if (progressText) {
      progressText.textContent = `${completed} dari ${total} butir selesai`;
    }

    if (progressBar) {
      progressBar.style.width = `${pct}%`;
    }

    try {
      localStorage.setItem(
        CHECKLIST_KEY,
        JSON.stringify(checkboxes.map((box) => box.checked))
      );
    } catch (_) {}
  };

  if (checkboxes.length) {
    try {
      const saved = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "[]");
      checkboxes.forEach((box, index) => {
        box.checked = Boolean(saved[index]);
      });
    } catch (_) {}

    checkboxes.forEach((box) => box.addEventListener("change", updateChecklist));
    updateChecklist();
  }

  resetChecklist?.addEventListener("click", () => {
    checkboxes.forEach((box) => {
      box.checked = false;
    });
    updateChecklist();
  });

  // ---------------- Embedded interactive form ----------------
  const formFrame = q("#p25InteractiveForm");

  if (formFrame) {
    const resizeFrame = () => {
      try {
        const doc = formFrame.contentDocument || formFrame.contentWindow?.document;
        if (!doc) return;

        const bodyHeight = doc.body?.scrollHeight || 0;
        const htmlHeight = doc.documentElement?.scrollHeight || 0;
        const height = Math.max(bodyHeight, htmlHeight);

        if (height > 500) {
          formFrame.style.height = `${height + 24}px`;
        }
      } catch (_) {
        // Jika iframe tidak dapat dibaca, tinggi CSS default tetap digunakan.
      }
    };

    formFrame.addEventListener("load", () => {
      resizeFrame();
      window.setTimeout(resizeFrame, 500);
      window.setTimeout(resizeFrame, 1500);

      try {
        const doc = formFrame.contentDocument || formFrame.contentWindow?.document;
        const target = doc?.documentElement;
        if (target && "ResizeObserver" in window) {
          const observer = new ResizeObserver(resizeFrame);
          observer.observe(target);
        }
      } catch (_) {}
    });
  }
})();
