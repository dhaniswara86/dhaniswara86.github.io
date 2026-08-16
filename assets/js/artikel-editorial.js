(() => {
  "use strict";

  const progressBar = document.getElementById("readingProgress");

  const updateReadingProgress = () => {
    if (!progressBar) return;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + "%";
  };

  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  updateReadingProgress();

  const article = document.querySelector(".article-body");
  const toc = document.getElementById("articleToc");

  if (article && toc) {
    const headings = [...article.querySelectorAll("h2, h3")]
      .filter(heading => !heading.closest(".closing-box"));

    const usedIds = new Set();

    const slugify = text =>
      text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    headings.forEach((heading, index) => {
      if (!heading.id) {
        let id = slugify(heading.textContent) || ("bagian-" + (index + 1));
        let candidate = id;
        let counter = 2;
        while (usedIds.has(candidate) || document.getElementById(candidate)) {
          candidate = id + "-" + counter++;
        }
        heading.id = candidate;
      }

      usedIds.add(heading.id);

      const link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent.trim();

      if (heading.tagName === "H3") {
        link.style.paddingLeft = "18px";
        link.style.fontSize = "11px";
      }

      toc.appendChild(link);
    });

    const tocLinks = [...toc.querySelectorAll("a")];

    const setActiveToc = () => {
      let active = null;
      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= 145) active = index;
      });

      tocLinks.forEach((link, index) => {
        link.classList.toggle("active", index === active);
      });
    };

    window.addEventListener("scroll", setActiveToc, { passive: true });
    setActiveToc();
  }

  const copyButton = document.getElementById("copyLinkButton");
  copyButton?.addEventListener("click", async () => {
    const original = copyButton.textContent;
    try {
      await navigator.clipboard.writeText(window.location.href);
      copyButton.textContent = "Tautan tersalin";
    } catch {
      window.prompt("Salin tautan berikut:", window.location.href);
    }
    setTimeout(() => copyButton.textContent = original, 1800);
  });

  /* Checklist bersifat opsional. Aktif hanya jika artikel memakainya. */
  const checkboxes = [...document.querySelectorAll("[data-check]")];
  const checklistBar = document.getElementById("progressBar");
  const checklistText = document.getElementById("progressText");
  const checklistReset = document.getElementById("resetChecklist");

  if (checkboxes.length && checklistBar && checklistText) {
    const key =
      "kabayan-checklist:" +
      (document.body.dataset.articleKey || location.pathname);

    const readState = () => {
      try { return JSON.parse(localStorage.getItem(key) || "[]"); }
      catch { return []; }
    };

    const saveState = () => {
      localStorage.setItem(key, JSON.stringify(checkboxes.map(box => box.checked)));
    };

    const render = () => {
      const done = checkboxes.filter(box => box.checked).length;
      const total = checkboxes.length;
      const percent = total ? Math.round((done / total) * 100) : 0;
      checklistBar.style.width = percent + "%";
      checklistText.textContent = `${done} dari ${total} butir selesai (${percent}%)`;
    };

    const state = readState();
    checkboxes.forEach((box, index) => {
      box.checked = Boolean(state[index]);
      box.addEventListener("change", () => {
        saveState();
        render();
      });
    });

    checklistReset?.addEventListener("click", () => {
      checkboxes.forEach(box => box.checked = false);
      localStorage.removeItem(key);
      render();
    });

    render();
  }
})();
