(() => {
  "use strict";

  const article = document.querySelector(".jk-article");
  if (!article) return;

  const progress = document.getElementById("pmkReadingProgress");
  const roleTabs = Array.from(article.querySelectorAll("[data-pmk-role]"));
  const rolePanels = Array.from(article.querySelectorAll(".pmk-role-panel"));
  const rolePrompt = document.getElementById("pmkRolePrompt");

  const updateProgress = () => {
    if (!progress) return;

    const articleStart = article.getBoundingClientRect().top + window.scrollY;
    const articleEnd = articleStart + article.offsetHeight - window.innerHeight;
    const distance = articleEnd - articleStart;
    const value = distance > 0
      ? Math.max(0, Math.min(100, ((window.scrollY - articleStart) / distance) * 100))
      : 0;

    progress.style.width = `${value}%`;
  };

  const selectRole = (selectedTab, options = {}) => {
    const { moveFocus = false } = options;
    const selectedRole = selectedTab.dataset.pmkRole;

    roleTabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    rolePanels.forEach((panel) => {
      panel.hidden = panel.id !== `pmkPanel${selectedRole.charAt(0).toUpperCase()}${selectedRole.slice(1)}`;
    });

    if (rolePrompt) rolePrompt.hidden = true;
    if (moveFocus) selectedTab.focus();
  };

  roleTabs.forEach((tab, index) => {
    tab.tabIndex = index === 0 ? 0 : -1;

    tab.addEventListener("click", () => selectRole(tab));

    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % roleTabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + roleTabs.length) % roleTabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = roleTabs.length - 1;

      selectRole(roleTabs[nextIndex], { moveFocus: true });
    });
  });

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
})();
