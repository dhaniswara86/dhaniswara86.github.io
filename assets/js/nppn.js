(() => {
  "use strict";

  const DATA = Array.isArray(window.KABAYAN_NPPN_DATA)
    ? window.KABAYAN_NPPN_DATA
    : [];

  const REGION_LABELS = {
    r10: "10 ibu kota provinsi",
    rprov: "ibu kota provinsi lainnya",
    rlain: "daerah lainnya"
  };

  const numberFormat = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0
  });

  const percentFormat = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  const rupiah = (value) => {
    const numeric = Number(value) || 0;
    return "Rp" + numberFormat.format(Math.round(Math.abs(numeric)));
  };

  const signedRupiah = (value) => {
    const numeric = Number(value) || 0;
    return (numeric < 0 ? "-" : "") + rupiah(numeric);
  };

  const formatRate = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "—";
    }
    return percentFormat.format(Number(value)) + "%";
  };

  const parseMoney = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  };

  const formatMoneyInput = (input) => {
    if (!input) return 0;
    const value = parseMoney(input.value);
    input.value = value ? numberFormat.format(value) : "";
    return value;
  };

  const normalizeText = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const searchableData = DATA.map((item) => ({
    ...item,
    _search: normalizeText(item.klu + " " + item.uraian)
  }));

  function initToc() {
    const toc = document.getElementById("articleToc");
    if (!toc) return;

    const items = [
      ["#pengertian", "Apa itu NPPN"],
      ["#siapa-boleh", "Siapa yang dapat menggunakan"],
      ["#batas-omzet", "Batas Rp4,8 miliar"],
      ["#siapa-tidak", "Siapa yang tidak menggunakan"],
      ["#kapan", "Batas waktu"],
      ["#cara-pemberitahuan", "Pemberitahuan Coretax"],
      ["#konsekuensi", "Konsekuensi"],
      ["#persentase", "Persentase NPPN"],
      ["#cari-nppn", "Cari KLU dan norma"],
      ["#cara-hitung", "Cara menghitung"],
      ["#kalkulator", "Kalkulator NPPN"],
      ["#lebih-satu-usaha", "Lebih dari satu usaha"],
      ["#pencatatan", "Pencatatan"],
      ["#nppn-vs-final", "NPPN vs PPh Final"],
      ["#kesalahan", "Kesalahan umum"],
      ["#cek-cepat", "Cek cepat"],
      ["#kesimpulan", "Intinya"],
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

  function initDirectory(onUseItem) {
    const input = document.getElementById("nppnDirectorySearch");
    const clear = document.getElementById("nppnDirectoryClear");
    const body = document.getElementById("nppnDirectoryBody");
    const count = document.getElementById("nppnDirectoryCount");
    const more = document.getElementById("nppnDirectoryMore");

    if (!input || !body || !count || !more) return;

    // Lebih sedikit hasil awal membuat direktori tetap ringan tanpa
    // membutuhkan scroll internal. Pengguna bisa menambah hasil bila perlu.
    let limit = 15;
    let currentResults = searchableData;

    const rateBlock = (value, label, key) => `
      <div class="nppn-directory-rate nppn-directory-rate-${key}" role="cell">
        <span class="nppn-directory-rate-label">${escapeHtml(label)}</span>
        <span class="nppn-rate-pill${value == null ? " is-empty" : ""}">
          ${escapeHtml(formatRate(value))}
        </span>
      </div>`;

    const render = () => {
      const query = normalizeText(input.value);
      const tokens = query ? query.split(/\s+/).filter(Boolean) : [];

      currentResults = tokens.length
        ? searchableData.filter((item) =>
            tokens.every((token) => item._search.includes(token))
          )
        : searchableData;

      const shown = currentResults.slice(0, limit);

      if (!shown.length) {
        body.innerHTML = `
          <div class="nppn-directory-empty" role="row">
            KLU tidak ditemukan. Coba gunakan kata yang lebih umum atau masukkan kode KLU.
          </div>`;
      } else {
        body.innerHTML = shown
          .map(
            (item) => `
            <article class="nppn-directory-row" role="row">
              <div class="nppn-directory-klu" role="cell">${escapeHtml(item.klu)}</div>

              <div class="nppn-directory-activity" role="cell">
                <span>${escapeHtml(item.uraian)}</span>
                <button type="button"
                        class="nppn-use-button"
                        data-nppn-no="${item.no}"
                        aria-label="Gunakan KLU ${escapeHtml(item.klu)} di kalkulator">
                  Gunakan
                </button>
              </div>

              ${rateBlock(item.r10, "10 ibu kota", "r10")}
              ${rateBlock(item.rprov, "Ibu kota lain", "rprov")}
              ${rateBlock(item.rlain, "Daerah lain", "rlain")}
            </article>`
          )
          .join("");
      }

      count.textContent = query
        ? `${numberFormat.format(currentResults.length)} KLU ditemukan`
        : `${numberFormat.format(DATA.length)} KLU tersedia — menampilkan ${numberFormat.format(Math.min(limit, currentResults.length))}`;

      more.hidden = currentResults.length <= limit;
    };

    input.addEventListener("input", () => {
      limit = 15;
      render();
    });

    clear?.addEventListener("click", () => {
      input.value = "";
      limit = 15;
      input.focus();
      render();
    });

    more.addEventListener("click", () => {
      limit += 30;
      render();
    });

    body.addEventListener("click", (event) => {
      const button = event.target.closest("[data-nppn-no]");
      if (!button) return;

      const no = Number(button.getAttribute("data-nppn-no"));
      const item = DATA.find((row) => row.no === no);

      if (item) onUseItem?.(item);
    });

    if (!DATA.length) {
      count.textContent = "Data NPPN tidak berhasil dimuat.";
      body.innerHTML = `
        <div class="nppn-directory-empty" role="row">
          File nppn-data.js belum termuat. Periksa urutan custom_js pada front matter.
        </div>`;
      more.hidden = true;
      return;
    }

    render();
  }

  function progressiveTax(pkp) {
    let remaining = Math.max(0, Number(pkp) || 0);
    let tax = 0;

    const brackets = [
      { width: 60000000, rate: 0.05 },
      { width: 190000000, rate: 0.15 },
      { width: 250000000, rate: 0.25 },
      { width: 4500000000, rate: 0.30 }
    ];

    for (const bracket of brackets) {
      if (remaining <= 0) break;
      const portion = Math.min(remaining, bracket.width);
      tax += portion * bracket.rate;
      remaining -= portion;
    }

    if (remaining > 0) {
      tax += remaining * 0.35;
    }

    return tax;
  }

  function initCalculator() {
    const kluSearch = document.getElementById("nppnCalcKluSearch");
    const kluHidden = document.getElementById("nppnCalcKlu");
    const selectedText = document.getElementById("nppnSelectedKlu");
    const suggestions = document.getElementById("nppnSuggestions");
    const region = document.getElementById("nppnRegion");
    const gross = document.getElementById("nppnGross");
    const ptkp = document.getElementById("nppnPtkp");
    const otherNet = document.getElementById("nppnOtherNet");
    const credits = document.getElementById("nppnCredits");

    const rateBanner = document.getElementById("nppnRateBanner");
    const rateOutput = document.getElementById("nppnRate");
    const rateContext = document.getElementById("nppnRateContext");

    const netOutput = document.getElementById("nppnNet");
    const totalNetOutput = document.getElementById("nppnTotalNet");
    const taxableOutput = document.getElementById("nppnTaxable");
    const taxOutput = document.getElementById("nppnTax");
    const creditOutput = document.getElementById("nppnCreditResult");
    const balanceCard = document.getElementById("nppnBalanceCard");
    const balanceLabel = document.getElementById("nppnBalanceLabel");
    const balanceOutput = document.getElementById("nppnBalance");

    if (
      !kluSearch ||
      !kluHidden ||
      !suggestions ||
      !region ||
      !gross ||
      !ptkp ||
      !otherNet ||
      !credits
    ) {
      return { selectItem: () => {} };
    }

    let selectedItem = null;
    let suggestionItems = [];
    let activeSuggestion = -1;

    const selectedRate = () => {
      if (!selectedItem) return null;
      const value = selectedItem[region.value];
      return value == null ? null : Number(value);
    };

    const updateRateBanner = () => {
      const rate = selectedRate();

      if (!selectedItem) {
        rateOutput.textContent = "—";
        rateContext.textContent = "Pilih KLU untuk melihat persentase.";
        rateBanner?.classList.remove("is-warning");
        return;
      }

      if (rate == null) {
        rateOutput.textContent = "—";
        rateContext.textContent =
          `KLU ${selectedItem.klu} tidak memiliki persentase NPPN pada ${REGION_LABELS[region.value]}.`;
        rateBanner?.classList.add("is-warning");
        return;
      }

      rateOutput.textContent = formatRate(rate);
      rateContext.textContent =
        `KLU ${selectedItem.klu} • ${selectedItem.uraian} • ${REGION_LABELS[region.value]}`;
      rateBanner?.classList.remove("is-warning");
    };

    const calculate = () => {
      updateRateBanner();

      const rate = selectedRate();
      const grossValue = parseMoney(gross.value);
      const otherNetValue = parseMoney(otherNet.value);
      const creditValue = parseMoney(credits.value);
      const ptkpValue = Number(ptkp.value) || 0;

      if (!selectedItem || rate == null) {
        netOutput.textContent = "Rp0";
        totalNetOutput.textContent = "Rp0";
        taxableOutput.textContent = "Rp0";
        taxOutput.textContent = "Rp0";
        creditOutput.textContent = rupiah(creditValue);
        balanceLabel.textContent = "Perkiraan kurang bayar";
        balanceOutput.textContent = "Rp0";
        balanceCard?.classList.remove("is-refund");
        return;
      }

      const net = grossValue * rate / 100;
      const totalNet = net + otherNetValue;
      const taxableBeforeRounding = Math.max(0, totalNet - ptkpValue);
      const taxable = Math.floor(taxableBeforeRounding / 1000) * 1000;
      const tax = progressiveTax(taxable);
      const balance = tax - creditValue;

      netOutput.textContent = rupiah(net);
      totalNetOutput.textContent = rupiah(totalNet);
      taxableOutput.textContent = rupiah(taxable);
      taxOutput.textContent = rupiah(tax);
      creditOutput.textContent = rupiah(creditValue);

      if (balance < 0) {
        balanceLabel.textContent = "Perkiraan lebih bayar";
        balanceOutput.textContent = rupiah(balance);
        balanceCard?.classList.add("is-refund");
      } else {
        balanceLabel.textContent = "Perkiraan kurang bayar";
        balanceOutput.textContent = signedRupiah(balance);
        balanceCard?.classList.remove("is-refund");
      }
    };

    const closeSuggestions = () => {
      suggestions.hidden = true;
      suggestions.innerHTML = "";
      suggestionItems = [];
      activeSuggestion = -1;
    };

    const renderSuggestions = () => {
      const query = normalizeText(kluSearch.value);

      if (query.length < 2 || !DATA.length) {
        closeSuggestions();
        return;
      }

      const tokens = query.split(/\s+/).filter(Boolean);
      suggestionItems = searchableData
        .filter((item) => tokens.every((token) => item._search.includes(token)))
        .slice(0, 12);

      if (!suggestionItems.length) {
        suggestions.innerHTML = `
          <div class="nppn-suggestion">
            <span class="nppn-suggestion-code">—</span>
            <span class="nppn-suggestion-name">Tidak ada KLU yang cocok.</span>
          </div>`;
        suggestions.hidden = false;
        activeSuggestion = -1;
        return;
      }

      suggestions.innerHTML = suggestionItems
        .map(
          (item, index) => `
          <button type="button" class="nppn-suggestion" data-suggestion-index="${index}">
            <span class="nppn-suggestion-code">${escapeHtml(item.klu)}</span>
            <span class="nppn-suggestion-name">${escapeHtml(item.uraian)}</span>
          </button>`
        )
        .join("");

      suggestions.hidden = false;
      activeSuggestion = -1;
    };

    const setActiveSuggestion = (index) => {
      const buttons = Array.from(suggestions.querySelectorAll("[data-suggestion-index]"));
      if (!buttons.length) return;

      activeSuggestion = Math.max(0, Math.min(index, buttons.length - 1));
      buttons.forEach((button, i) =>
        button.classList.toggle("is-active", i === activeSuggestion)
      );
      buttons[activeSuggestion]?.scrollIntoView({ block: "nearest" });
    };

    const selectItem = (item, shouldScroll = false) => {
      if (!item) return;
      selectedItem = item;
      kluHidden.value = item.klu;
      kluSearch.value = `${item.klu} — ${item.uraian}`;
      selectedText.textContent = `Dipilih: ${item.klu} — ${item.uraian}`;
      closeSuggestions();
      calculate();

      if (shouldScroll) {
        document.getElementById("kalkulator")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        window.setTimeout(() => gross.focus(), 450);
      }
    };

    kluSearch.addEventListener("input", () => {
      selectedItem = null;
      kluHidden.value = "";
      selectedText.textContent = "Belum ada KLU yang dipilih.";
      renderSuggestions();
      calculate();
    });

    kluSearch.addEventListener("keydown", (event) => {
      if (suggestions.hidden) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveSuggestion(activeSuggestion + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveSuggestion(activeSuggestion <= 0 ? suggestionItems.length - 1 : activeSuggestion - 1);
      } else if (event.key === "Enter" && activeSuggestion >= 0) {
        event.preventDefault();
        selectItem(suggestionItems[activeSuggestion]);
      } else if (event.key === "Escape") {
        closeSuggestions();
      }
    });

    suggestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-suggestion-index]");
      if (!button) return;
      const index = Number(button.getAttribute("data-suggestion-index"));
      selectItem(suggestionItems[index]);
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nppn-autocomplete")) {
        closeSuggestions();
      }
    });

    region.addEventListener("change", calculate);
    ptkp.addEventListener("change", calculate);

    [gross, otherNet, credits].forEach((input) => {
      input.addEventListener("input", () => {
        const caretAtEnd = input.selectionStart === input.value.length;
        formatMoneyInput(input);
        if (caretAtEnd) {
          const len = input.value.length;
          try {
            input.setSelectionRange(len, len);
          } catch (_) {}
        }
        calculate();
      });

      input.addEventListener("blur", () => {
        formatMoneyInput(input);
        calculate();
      });
    });

    updateRateBanner();
    calculate();

    return { selectItem };
  }

  function init() {
    initToc();
    const calculator = initCalculator();
    initDirectory((item) => calculator.selectItem(item, true));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
