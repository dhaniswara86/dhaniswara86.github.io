(() => {
  "use strict";

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const active = mobileMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open", active);
      menuToggle.setAttribute("aria-expanded", String(active));
      menuToggle.textContent = active ? "×" : "☰";
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  const collectionMenu = document.getElementById("collectionMegaMenu");
  const collectionBackdrop = document.getElementById("megaMenuBackdrop");
  const collectionTrigger = document.getElementById("collectionSearchTrigger");
  const collectionClose = document.getElementById("megaMenuClose");

  function closeCollection(returnFocus = false) {
    if (!collectionMenu || !collectionBackdrop || !collectionTrigger) return;
    collectionMenu.classList.remove("active");
    collectionBackdrop.classList.remove("active");
    document.body.classList.remove("mega-menu-open");
    collectionMenu.setAttribute("aria-hidden", "true");
    collectionBackdrop.setAttribute("aria-hidden", "true");
    collectionTrigger.setAttribute("aria-expanded", "false");
    if (returnFocus) collectionTrigger.focus();
  }

  function openCollection() {
    if (!collectionMenu || !collectionBackdrop || !collectionTrigger) return;
    collectionMenu.classList.add("active");
    collectionBackdrop.classList.add("active");
    document.body.classList.add("mega-menu-open");
    collectionMenu.setAttribute("aria-hidden", "false");
    collectionBackdrop.setAttribute("aria-hidden", "false");
    collectionTrigger.setAttribute("aria-expanded", "true");
  }

  if (collectionTrigger) {
    collectionTrigger.addEventListener("click", () => {
      collectionMenu?.classList.contains("active") ? closeCollection() : openCollection();
    });
  }
  collectionBackdrop?.addEventListener("click", () => closeCollection(true));
  collectionClose?.addEventListener("click", () => closeCollection(true));
  collectionMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeCollection()));

  const navLinks = [...document.querySelectorAll(".nav-menu-link[data-nav-menu]")];
  const navMenu = document.getElementById("navMegaMenu");
  const navBackdrop = document.getElementById("navMegaBackdrop");
  const navPanels = [...document.querySelectorAll(".nav-mega-panel[data-nav-panel]")];
  const desktopQuery = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");
  let closeTimer;

  function closeNavMega() {
    clearTimeout(closeTimer);
    navMenu?.classList.remove("active");
    navBackdrop?.classList.remove("active");
    navMenu?.setAttribute("aria-hidden", "true");
    navBackdrop?.setAttribute("aria-hidden", "true");
    navLinks.forEach(link => link.classList.remove("mega-active"));
  }

  function openNavMega(name) {
    if (!desktopQuery.matches || !navMenu || !navBackdrop) return;
    closeCollection();
    clearTimeout(closeTimer);
    navPanels.forEach(panel => panel.classList.toggle("active", panel.dataset.navPanel === name));
    navLinks.forEach(link => link.classList.toggle("mega-active", link.dataset.navMenu === name));
    navMenu.classList.add("active");
    navBackdrop.classList.add("active");
    navMenu.setAttribute("aria-hidden", "false");
    navBackdrop.setAttribute("aria-hidden", "false");
  }

  function scheduleClose(delay = 220) {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(closeNavMega, delay);
  }

  navLinks.forEach(link => {
    link.addEventListener("mouseenter", () => openNavMega(link.dataset.navMenu));
    link.addEventListener("mouseleave", () => scheduleClose());
    link.addEventListener("focus", () => openNavMega(link.dataset.navMenu));
    link.addEventListener("blur", () => scheduleClose(150));
  });

  navMenu?.addEventListener("mouseenter", () => clearTimeout(closeTimer));
  navMenu?.addEventListener("mouseleave", () => scheduleClose(180));
  if (navBackdrop) navBackdrop.style.pointerEvents = "none";
  navMenu?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNavMega));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeNavMega();
      closeCollection();
      if (mobileMenu?.classList.contains("active")) {
        mobileMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
        if (menuToggle) {
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.textContent = "☰";
        }
      }
    }
  });

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", () => {
      if (!desktopQuery.matches) closeNavMega();
    });
  }

  document.getElementById("currentYear")?.replaceChildren(document.createTextNode(String(new Date().getFullYear())));
})();
