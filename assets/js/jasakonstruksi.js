(() => {
  "use strict";

  function initJasaKonstruksi() {
    /* TOC */
    const toc = document.getElementById("articleToc");

    if (toc) {
      const items = [
        ["#pengantar", "Pengantar"],
        ["#pengertian", "Pengertian"],
        ["#kelompok-jasa", "Kelompok jasa"],
        ["#tarif", "Tabel tarif"],
        ["#sertifikasi", "SBU dan sertifikat"],
        ["#simulasi", "Simulasi cepat"],
        ["#penghitungan", "Penghitungan"],
        ["#pemotongan", "Pemotongan pajak"],
        ["#material", "Nilai material"],
        ["#renovasi", "Jasa renovasi"],
        ["#umkm", "Tarif UMKM"],
        ["#jatuh-tempo", "Jatuh tempo"],
        ["#kesalahan", "Kesalahan umum"],
        ["#dokumen", "Dokumen"],
        ["#cara-cepat", "Cara cepat"],
        ["#kesimpulan", "Kesimpulan"],
        ["#dasar-hukum", "Dasar hukum"]
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
    }

    /* KALKULATOR */
    const tariffSelector = document.getElementById("tariffSelector");
    const paymentValue = document.getElementById("paymentValue");
    const resultRate = document.getElementById("resultRate");
    const resultBase = document.getElementById("resultBase");
    const resultTax = document.getElementById("resultTax");

    if (!tariffSelector || !paymentValue || !resultRate || !resultBase || !resultTax) {
      return;
    }

    const parseMoney = (value) => {
      const digits = String(value || "").replace(/\D/g, "");
      return digits ? Number(digits) : 0;
    };

    const numberFormat = new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0
    });

    const percentFormat = new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    const rupiah = (value) => "Rp" + numberFormat.format(Math.round(value || 0));

    const calculate = () => {
      const rate = Number(tariffSelector.value) || 0;
      const base = parseMoney(paymentValue.value);
      const tax = base * rate / 100;

      resultRate.textContent = percentFormat.format(rate) + "%";
      resultBase.textContent = rupiah(base);
      resultTax.textContent = rupiah(tax);
    };

    const formatInput = () => {
      const base = parseMoney(paymentValue.value);
      paymentValue.value = base ? numberFormat.format(base) : "";
      calculate();
    };

    tariffSelector.addEventListener("change", calculate);
    tariffSelector.addEventListener("input", calculate);
    paymentValue.addEventListener("input", formatInput);
    paymentValue.addEventListener("blur", formatInput);

    formatInput();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initJasaKonstruksi, { once: true });
  } else {
    initJasaKonstruksi();
  }
})();
