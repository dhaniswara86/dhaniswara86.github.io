(() => {
  "use strict";

  const links = Array.from(document.querySelectorAll(".apple-localnav-links a[href^='#']"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const updateActive = () => {
    const y = window.scrollY + 110;
    let active = sections[0]?.id || "";

    sections.forEach((section) => {
      if (section.offsetTop <= y) active = section.id;
    });

    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${active}`);
    });
  };

  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();
})();
