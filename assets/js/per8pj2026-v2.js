(() => {
  "use strict";

  const toc = document.getElementById("articleToc");
  if (!toc) return;

  const items = [
    ["#latar-belakang", "Latar belakang perubahan"],
    ["#kode-billing", "Kode billing 14 hari"],
    ["#pemindahbukuan", "Pemindahbukuan"],
    ["#ssp", "Petunjuk SSP"],
    ["#kap-kjs", "KAP dan KJS"],
    ["#imbalan-bunga", "Imbalan bunga"],
    ["#tabel-perbandingan", "Tabel perbandingan"],
    ["#pencarian-cepat-kap-kjs", "Pencarian KAP/KJS"],
    ["#penutup", "Penutup"]
  ];

  toc.innerHTML = items
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join("");

  const links = Array.from(toc.querySelectorAll("a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const updateActive = () => {
    const marker = window.scrollY + 145;
    let activeId = sections[0]?.id || "";

    sections.forEach((section) => {
      if (section.offsetTop <= marker) activeId = section.id;
    });

    links.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + activeId
      );
    });
  };

  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
})();
