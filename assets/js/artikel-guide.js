(() => {
  "use strict";

  const progress = document.getElementById("guideReadingProgress");
  const content = document.getElementById("guideContent");
  const toc = document.getElementById("guideToc");
  const copyButton = document.getElementById("guideCopyLink");

  const updateProgress = () => {
    if (!progress || !content) return;
    const rect = content.getBoundingClientRect();
    const start = window.scrollY + rect.top - window.innerHeight * 0.25;
    const end = start + content.offsetHeight - window.innerHeight * 0.45;
    const value = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
    progress.style.width = `${value * 100}%`;
  };

  const sections = Array.from(content?.querySelectorAll("section[id]") || [])
    .filter((section) => section.querySelector(":scope > header h2"));

  const tocLinks = new Map();

  if (toc && sections.length) {
    sections.forEach((section) => {
      const heading = section.querySelector(":scope > header h2");
      const link = document.createElement("a");
      link.href = `#${section.id}`;
      link.textContent = heading.textContent.trim();
      toc.appendChild(link);
      tocLinks.set(section.id, link);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visible.length) return;
        const activeId = visible[0].target.id;

        tocLinks.forEach((link, id) => {
          link.classList.toggle("is-active", id === activeId);
        });
      },
      { rootMargin: "-18% 0px -65% 0px", threshold: [0, 0.1, 0.4] }
    );

    sections.forEach((section) => observer.observe(section));
  }

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const old = copyButton.textContent;
      copyButton.textContent = "Tersalin";
      setTimeout(() => { copyButton.textContent = old; }, 1400);
    } catch (_) {}
  });

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();
