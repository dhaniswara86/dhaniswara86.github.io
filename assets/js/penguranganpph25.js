(() => {
  "use strict";

  const CHECKLIST_KEY = "kabayan-p25-checklist-v1";
  const FORM_KEY = "kabayan-p25-form-v1";

  const q = (selector, scope = document) => scope.querySelector(selector);
  const qa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const digits = (value) => String(value ?? "").replace(/[^\d]/g, "");

  const toNumber = (value) => {
    const n = Number(digits(value));
    return Number.isFinite(n) ? n : 0;
  };

  const rupiah = (value) => {
    const n = Number(value || 0);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(n);
  };

  const plainNumber = (value) => {
    const n = Number(value || 0);
    return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 2
    }).format(n);
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

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

  // ---------------- Form helpers ----------------
  const moneyInputs = qa("[data-p25-money]");

  moneyInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const n = digits(input.value);
      input.value = n ? new Intl.NumberFormat("id-ID").format(Number(n)) : "";
      saveForm();
    });
  });

  const formIds = [
    "p25WpName",
    "p25Npwp",
    "p25TaxYear",
    "p25Kpp",
    "p25MonthsElapsed",
    "p25MonthsRemaining",
    "p25BasisTax",
    "p25ProjectedTax",
    "p25CurrentInstallment",
    "p25ProposedInstallment",
    "p25RevenueActual",
    "p25RevenueProjected",
    "p25PaidInstallment",
    "p25OtherCredits",
    "p25Reason"
  ];

  const getEl = (id) => document.getElementById(id);

  function saveForm() {
    const payload = {};
    formIds.forEach((id) => {
      const el = getEl(id);
      if (el) payload[id] = el.value;
    });

    try {
      localStorage.setItem(FORM_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  function restoreForm() {
    let payload = {};
    try {
      payload = JSON.parse(localStorage.getItem(FORM_KEY) || "{}");
    } catch (_) {}

    formIds.forEach((id) => {
      const el = getEl(id);
      if (el && Object.prototype.hasOwnProperty.call(payload, id)) {
        el.value = payload[id];
      }
    });
  }

  formIds.forEach((id) => {
    const el = getEl(id);
    el?.addEventListener("input", saveForm);
    el?.addEventListener("change", saveForm);
  });

  restoreForm();

  // NPWP digits only
  const npwp = getEl("p25Npwp");
  npwp?.addEventListener("input", () => {
    npwp.value = digits(npwp.value).slice(0, 16);
    saveForm();
  });

  // ---------------- 75% test ----------------
  const thresholdValue = getEl("p25ThresholdValue");
  const projectedRatio = getEl("p25ProjectedRatio");
  const eligibilityState = getEl("p25EligibilityState");

  function evaluateEligibility() {
    const basis = toNumber(getEl("p25BasisTax")?.value);
    const projected = toNumber(getEl("p25ProjectedTax")?.value);
    const monthsElapsed = Number(getEl("p25MonthsElapsed")?.value || 0);

    if (!basis) {
      if (thresholdValue) thresholdValue.textContent = "—";
      if (projectedRatio) projectedRatio.textContent = "—";
      if (eligibilityState) {
        eligibilityState.textContent =
          "Isi PPh terutang yang menjadi dasar penghitungan angsuran.";
        eligibilityState.classList.remove("is-eligible", "is-not-eligible");
      }
      return { basis, projected, monthsElapsed, eligible75: false };
    }

    const threshold = basis * 0.75;
    const ratio = (projected / basis) * 100;
    const eligible75 = projected < threshold;

    if (thresholdValue) thresholdValue.textContent = rupiah(threshold);
    if (projectedRatio) projectedRatio.textContent = `${plainNumber(ratio)}%`;

    if (eligibilityState) {
      eligibilityState.classList.remove("is-eligible", "is-not-eligible");

      if (eligible75 && monthsElapsed >= 3) {
        eligibilityState.textContent =
          "Indikasi memenuhi syarat waktu dan uji <75%. Periksa syarat lain sebelum mengajukan.";
        eligibilityState.classList.add("is-eligible");
      } else if (eligible75 && monthsElapsed < 3) {
        eligibilityState.textContent =
          "Uji <75% terpenuhi, tetapi Tahun Pajak belum berjalan 3 bulan.";
        eligibilityState.classList.add("is-not-eligible");
      } else {
        eligibilityState.textContent =
          "Proyeksi belum berada di bawah 75% dari dasar PPh terutang.";
        eligibilityState.classList.add("is-not-eligible");
      }
    }

    return { basis, projected, monthsElapsed, threshold, ratio, eligible75 };
  }

  getEl("p25Calculate")?.addEventListener("click", evaluateEligibility);

  // ---------------- Summary ----------------
  const summaryOutput = getEl("p25SummaryOutput");
  const summaryContent = getEl("p25SummaryContent");

  const valueOf = (id, fallback = "—") => {
    const value = getEl(id)?.value?.trim();
    return value || fallback;
  };

  const moneyOf = (id) => {
    const raw = getEl(id)?.value;
    return raw ? rupiah(toNumber(raw)) : "—";
  };

  function buildSummary() {
    const test = evaluateEligibility();

    const status =
      test.basis > 0
        ? test.eligible75
          ? test.monthsElapsed >= 3
            ? "Indikasi memenuhi uji <75% dan syarat waktu ≥3 bulan"
            : "Uji <75% terpenuhi, tetapi syarat waktu ≥3 bulan belum terpenuhi"
          : "Belum memenuhi uji <75%"
        : "Belum diuji";

    const ratio =
      test.basis > 0 ? `${plainNumber((test.projected / test.basis) * 100)}%` : "—";

    const rows = [
      ["Nama Wajib Pajak", valueOf("p25WpName")],
      ["NPWP", valueOf("p25Npwp")],
      ["Tahun Pajak", valueOf("p25TaxYear")],
      ["KPP terdaftar", valueOf("p25Kpp")],
      ["Bulan telah berjalan", valueOf("p25MonthsElapsed")],
      ["Bulan tersisa", valueOf("p25MonthsRemaining")],
      ["Dasar PPh terutang untuk angsuran", moneyOf("p25BasisTax")],
      ["Ambang 75%", test.basis ? rupiah(test.basis * 0.75) : "—"],
      ["Proyeksi PPh terutang", moneyOf("p25ProjectedTax")],
      ["Rasio proyeksi", ratio],
      ["Status uji", status],
      ["Angsuran saat ini per bulan", moneyOf("p25CurrentInstallment")],
      ["Usulan angsuran per bulan", moneyOf("p25ProposedInstallment")],
      ["Realisasi omzet", moneyOf("p25RevenueActual")],
      ["Proyeksi omzet setahun", moneyOf("p25RevenueProjected")],
      ["PPh Pasal 25 telah dibayar", moneyOf("p25PaidInstallment")],
      ["Estimasi kredit pajak lain", moneyOf("p25OtherCredits")]
    ];

    const tableRows = rows
      .map(
        ([label, value]) =>
          `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
      )
      .join("");

    const reason = valueOf(
      "p25Reason",
      "Belum diisi. Jelaskan perubahan keadaan usaha/kegiatan dan kaitannya dengan proyeksi PPh terutang."
    );

    if (summaryContent) {
      summaryContent.innerHTML = `
        <table class="p25-summary-table">
          <tbody>${tableRows}</tbody>
        </table>
        <div class="p25-summary-reason">
          <span>Alasan perubahan keadaan usaha/kegiatan</span>
          <p>${escapeHtml(reason)}</p>
        </div>
      `;
    }

    if (summaryOutput) {
      summaryOutput.hidden = false;
      summaryOutput.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  getEl("p25GenerateSummary")?.addEventListener("click", buildSummary);

  getEl("p25PrintSummary")?.addEventListener("click", () => {
    if (summaryOutput?.hidden) buildSummary();
    window.print();
  });

  getEl("p25ResetForm")?.addEventListener("click", () => {
    formIds.forEach((id) => {
      const el = getEl(id);
      if (!el) return;

      if (id === "p25TaxYear") el.value = "2026";
      else if (id === "p25MonthsElapsed") el.value = "3";
      else if (id === "p25MonthsRemaining") el.value = "9";
      else el.value = "";
    });

    if (summaryOutput) summaryOutput.hidden = true;
    if (summaryContent) summaryContent.innerHTML = "";
    if (thresholdValue) thresholdValue.textContent = "—";
    if (projectedRatio) projectedRatio.textContent = "—";
    if (eligibilityState) {
      eligibilityState.textContent = "Masukkan nilai untuk melakukan pengujian.";
      eligibilityState.classList.remove("is-eligible", "is-not-eligible");
    }

    try {
      localStorage.removeItem(FORM_KEY);
    } catch (_) {}
  });
})();
