(() => {
  "use strict";

  /* =========================================================
     TOC KHUSUS JASA KONSTRUKSI
     ========================================================= */
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
        if (section.offsetTop <= marker) {
          activeId = section.id;
        }
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

  /* =========================================================
     KALKULATOR PPh FINAL JASA KONSTRUKSI
     ========================================================= */
  const tariffSelector =
    document.getElementById("tariffSelector");

  const paymentValue =
    document.getElementById("paymentValue");

  const resultRate =
    document.getElementById("resultRate");

  const resultBase =
    document.getElementById("resultBase");

  const resultTax =
    document.getElementById("resultTax");

  if (
    tariffSelector &&
    paymentValue &&
    resultRate &&
    resultBase &&
    resultTax
  ) {
    const rupiahFormatter =
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      });

    const numberFormatter =
      new Intl.NumberFormat("id-ID");

    const percentFormatter =
      new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });

    const parsePaymentValue = (value) => {
      return Number(
        String(value || "").replace(/[^\d]/g, "")
      ) || 0;
    };

    const updateCalculator = () => {
      const rate =
        Number(tariffSelector.value) || 0;

      const payment =
        parsePaymentValue(paymentValue.value);

      const tax =
        payment * rate / 100;

      resultRate.textContent =
        percentFormatter.format(rate) + "%";

      resultBase.textContent =
        rupiahFormatter.format(payment);

      resultTax.textContent =
        rupiahFormatter.format(tax);
    };

    paymentValue.addEventListener("input", () => {
      const numericValue =
        parsePaymentValue(paymentValue.value);

      paymentValue.value =
        numericValue === 0
          ? ""
          : numberFormatter.format(numericValue);

      updateCalculator();
    });

    tariffSelector.addEventListener(
      "change",
      updateCalculator
    );

    /* Format nilai awal 500000000 menjadi 500.000.000 */
    const initialValue =
      parsePaymentValue(paymentValue.value);

    if (initialValue > 0) {
      paymentValue.value =
        numberFormatter.format(initialValue);
    }

    updateCalculator();
  }
})();
