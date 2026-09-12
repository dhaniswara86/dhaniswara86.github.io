(() => {
  "use strict";

  /* =========================================================
     PTKP CHECKER
     ========================================================= */
  const checker = document.getElementById("ptkpChecker");

  if (checker) {
    const state = {
      married: null,
      dependents: null,
      combined: null
    };

    const questions = Array.from(
      checker.querySelectorAll(".ptkp-question")
    );

    const progressBar = document.getElementById("ptkpProgressBar");
    const result = document.getElementById("ptkpResult");
    const statusResult = document.getElementById("ptkpStatusResult");
    const amountResult = document.getElementById("ptkpAmountResult");
    const breakdown = document.getElementById("ptkpBreakdown");
    const terResult = document.getElementById("ptkpTerResult");
    const reset = document.getElementById("ptkpReset");

    const BASE = 54000000;
    const MARRIED = 4500000;
    const DEPENDENT = 4500000;
    const SPOUSE_COMBINED = 54000000;

    const rupiah = (value) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
      }).format(value);

    const setStep = (step) => {
      questions.forEach((question) => {
        question.hidden =
          Number(question.dataset.step) !== Number(step);
      });

      if (result) {
        result.hidden = true;
      }

      if (progressBar) {
        const married = state.married === "yes";
        const maxStep = married ? 3 : 2;
        const percentage = Math.min(
          100,
          Math.max(0, ((step - 1) / maxStep) * 100)
        );
        progressBar.style.width = percentage + "%";
      }
    };

    const getTerCategory = (status) => {
      const categoryA = ["TK/0", "TK/1", "K/0"];
      const categoryB = ["TK/2", "TK/3", "K/1", "K/2"];
      const categoryC = ["K/3"];

      if (categoryA.includes(status)) return "A";
      if (categoryB.includes(status)) return "B";
      if (categoryC.includes(status)) return "C";
      return null;
    };

    const clearSelected = () => {
      checker
        .querySelectorAll(".is-selected")
        .forEach((element) =>
          element.classList.remove("is-selected")
        );
    };

    const buildResult = () => {
      const dependents = Math.min(
        3,
        Math.max(0, Number(state.dependents || 0))
      );

      const married = state.married === "yes";
      const combined = married && state.combined === "yes";

      let status = married ? "K" : "TK";
      if (combined) status = "K/I";
      status += "/" + dependents;

      let amount = BASE;
      const rows = [
        ["PTKP untuk diri Wajib Pajak", BASE]
      ];

      if (married) {
        amount += MARRIED;
        rows.push(["Tambahan karena kawin", MARRIED]);
      }

      if (combined) {
        amount += SPOUSE_COMBINED;
        rows.push([
          "Tambahan seorang istri yang penghasilannya digabung",
          SPOUSE_COMBINED
        ]);
      }

      if (dependents > 0) {
        const dependentAmount = dependents * DEPENDENT;
        amount += dependentAmount;
        rows.push([
          `${dependents} tanggungan × Rp4.500.000`,
          dependentAmount
        ]);
      }

      if (statusResult) statusResult.textContent = status;
      if (amountResult) amountResult.textContent = rupiah(amount);

      if (breakdown) {
        breakdown.innerHTML = rows
          .map(
            ([label, value]) =>
              `<div class="ptkp-breakdown-row">
                <span>${label}</span>
                <strong>${rupiah(value)}</strong>
              </div>`
          )
          .join("");
      }

      const ter = getTerCategory(status);

      if (terResult) {
        if (ter) {
          terResult.innerHTML =
            `Untuk pemotongan PPh Pasal 21 dengan TER bulanan, ` +
            `status <strong>${status}</strong> masuk Kategori ` +
            `<strong>TER ${ter}</strong>.`;
        } else {
          terResult.innerHTML =
            `Status <strong>${status}</strong> adalah status PTKP ` +
            `tahunan suami-istri dengan penghasilan digabung. ` +
            `Kategori TER A/B/C dalam PP 58/2023 tidak memetakan ` +
            `status K/I secara langsung.`;
        }
      }

      questions.forEach((question) => {
        question.hidden = true;
      });

      if (result) result.hidden = false;
      if (progressBar) progressBar.style.width = "100%";
    };

    checker.addEventListener("click", (event) => {
      const button = event.target.closest(
        "[data-field][data-value]"
      );

      if (!button || !checker.contains(button)) return;

      const field = button.dataset.field;
      const value = button.dataset.value;

      state[field] = value;

      checker
        .querySelectorAll(`[data-field="${field}"]`)
        .forEach((item) =>
          item.classList.toggle("is-selected", item === button)
        );

      if (field === "married") {
        state.dependents = null;
        state.combined = null;

        checker
          .querySelectorAll(
            '[data-field="dependents"], [data-field="combined"]'
          )
          .forEach((item) =>
            item.classList.remove("is-selected")
          );

        setStep(2);
        return;
      }

      if (field === "dependents") {
        if (state.married === "yes") {
          setStep(3);
        } else {
          state.combined = "no";
          buildResult();
        }
        return;
      }

      if (field === "combined") {
        buildResult();
      }
    });

    reset?.addEventListener("click", () => {
      state.married = null;
      state.dependents = null;
      state.combined = null;
      clearSelected();
      setStep(1);
    });

    setStep(1);
  }

  /* =========================================================
     CASE EXAMPLES
     ========================================================= */
  const caseTabs = document.getElementById("ptkpCaseTabs");

  if (caseTabs) {
    const cases = {
      andi: {
        initial: "A",
        name: "Andi",
        profile: "Belum menikah · tanpa tanggungan",
        status: "TK/0",
        amount: "Rp54.000.000",
        ter: "A",
        explanation:
          "Andi belum menikah dan tidak memiliki tanggungan yang diperhitungkan. Karena itu status PTKP-nya TK/0."
      },
      budi: {
        initial: "B",
        name: "Budi",
        profile: "Menikah · tanpa tanggungan",
        status: "K/0",
        amount: "Rp58.500.000",
        ter: "A",
        explanation:
          "Budi telah menikah dan belum memiliki tanggungan yang diperhitungkan. PTKP-nya terdiri dari Rp54 juta untuk diri sendiri dan tambahan kawin Rp4,5 juta."
      },
      citra: {
        initial: "C",
        name: "Citra",
        profile: "Status keluarga dengan 2 tanggungan",
        status: "K/2",
        amount: "Rp67.500.000",
        ter: "B",
        explanation:
          "Pada status K/2, PTKP terdiri dari Rp54 juta untuk diri Wajib Pajak, tambahan kawin Rp4,5 juta, dan dua tanggungan sebesar Rp9 juta."
      },
      dedi: {
        initial: "D",
        name: "Dedi",
        profile: "Menikah · 3 tanggungan",
        status: "K/3",
        amount: "Rp72.000.000",
        ter: "C",
        explanation:
          "Dedi berstatus kawin dengan tiga tanggungan yang memenuhi ketentuan. Ini merupakan jumlah tanggungan maksimal yang menambah PTKP."
      }
    };

    const initial = document.getElementById("ptkpCaseInitial");
    const name = document.getElementById("ptkpCaseName");
    const profile = document.getElementById("ptkpCaseProfile");
    const status = document.getElementById("ptkpCaseStatus");
    const amount = document.getElementById("ptkpCaseAmount");
    const ter = document.getElementById("ptkpCaseTer");
    const explanation = document.getElementById(
      "ptkpCaseExplanation"
    );

    const showCase = (key) => {
      const data = cases[key];
      if (!data) return;

      if (initial) initial.textContent = data.initial;
      if (name) name.textContent = data.name;
      if (profile) profile.textContent = data.profile;
      if (status) status.textContent = data.status;
      if (amount) amount.textContent = data.amount;
      if (ter) ter.textContent = data.ter;
      if (explanation) explanation.textContent = data.explanation;

      caseTabs
        .querySelectorAll("[data-case]")
        .forEach((button) => {
          const active = button.dataset.case === key;
          button.classList.toggle("active", active);

          if (active) {
            button.setAttribute("aria-current", "true");
          } else {
            button.removeAttribute("aria-current");
          }
        });
    };

    caseTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-case]");
      if (!button) return;
      showCase(button.dataset.case);
    });

    showCase("andi");
  }
})();
