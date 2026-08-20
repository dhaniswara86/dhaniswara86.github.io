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


  function initEligibilityChecker() {
    const root = document.getElementById("nppnEligibilityChecker");
    const questionEl = document.getElementById("nppnEligibilityQuestion");
    const actionsEl = document.getElementById("nppnEligibilityActions");
    const resultEl = document.getElementById("nppnEligibilityResult");
    const progressText = document.getElementById("nppnEligibilityProgressText");
    const progressCount = document.getElementById("nppnEligibilityCount");
    const progressBar = document.getElementById("nppnEligibilityProgressBar");
    const backButton = document.getElementById("nppnEligibilityBack");

    if (
      !root ||
      !questionEl ||
      !actionsEl ||
      !resultEl ||
      !progressText ||
      !progressCount ||
      !progressBar ||
      !backButton
    ) {
      return;
    }

    const QUESTIONS = [
      {
        title: "Apakah Anda Wajib Pajak Orang Pribadi?",
        help: "Pilihan menggunakan NPPN ditujukan kepada Wajib Pajak Orang Pribadi yang memenuhi persyaratan.",
        pass: true,
        failTitle: "Tidak memenuhi syarat NPPN",
        failReason:
          "NPPN sebagai pilihan metode penghitungan penghasilan neto tidak ditujukan kepada Wajib Pajak Badan."
      },
      {
        title: "Apakah Anda menjalankan usaha dan/atau pekerjaan bebas?",
        help: "Contohnya usaha dagang, jasa, dokter, konsultan, pengacara, notaris, content creator, agen, atau pekerjaan bebas lainnya.",
        pass: true,
        failTitle: "Tidak memenuhi syarat NPPN",
        failReason:
          "NPPN digunakan dalam konteks penghasilan dari kegiatan usaha dan/atau pekerjaan bebas. Jika penghasilan Anda bukan dari kegiatan tersebut, metode ini tidak digunakan."
      },
      {
        title: "Apakah total peredaran bruto Anda kurang dari Rp4,8 miliar?",
        help: "Perhatikan keseluruhan peredaran bruto dari jenis/tempat usaha dan pekerjaan bebas sesuai ketentuan, bukan hanya satu kegiatan.",
        pass: true,
        failTitle: "Tidak memenuhi syarat NPPN",
        failReason:
          "Jika peredaran bruto telah mencapai Rp4,8 miliar atau lebih, batas peredaran bruto untuk memilih NPPN tidak terpenuhi."
      },
      {
        title: "Apakah Anda pernah menyelenggarakan pembukuan pada suatu Tahun Pajak sejak Tahun Pajak 2022?",
        help: "Pertanyaan ini penting karena pembukuan yang telah digunakan sejak Tahun Pajak 2022 dapat menutup pilihan untuk kembali menggunakan NPPN pada Tahun Pajak berikutnya.",
        pass: false,
        failTitle: "Tidak dapat kembali menggunakan NPPN",
        failReason:
          "Berdasarkan jawaban Anda, Anda pernah menyelenggarakan pembukuan sejak Tahun Pajak 2022. Perhatikan Pasal 463 PMK 81 Tahun 2024: dalam kondisi tersebut, NPPN tidak dapat digunakan kembali pada Tahun Pajak berikutnya."
      },
      {
        title: "Apakah pemberitahuan penggunaan NPPN disampaikan atau akan disampaikan tepat waktu?",
        help: "Secara umum, pemberitahuan disampaikan dalam 3 bulan pertama Tahun Pajak. Untuk WP yang baru terdaftar pada tahun berjalan berlaku batas waktu khusus.",
        pass: true,
        failTitle: "Tidak memenuhi syarat untuk Tahun Pajak ini",
        failReason:
          "Jika pemberitahuan NPPN tidak disampaikan dalam jangka waktu yang ditentukan, Wajib Pajak dianggap memilih menyelenggarakan pembukuan."
      }
    ];

    let currentIndex = 0;
    let answers = [];

    const labelForAnswer = (value) => (value ? "Ya" : "Tidak");

    const renderQuestion = () => {
      const item = QUESTIONS[currentIndex];
      const step = currentIndex + 1;
      const total = QUESTIONS.length;

      resultEl.hidden = true;
      questionEl.hidden = false;
      actionsEl.hidden = false;

      progressText.textContent = `Pertanyaan ${step} dari ${total}`;
      progressCount.textContent = `${step}/${total}`;
      progressBar.style.width = `${(step / total) * 100}%`;

      questionEl.innerHTML = `
        <span class="nppn-checker-number">${step}</span>
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.help)}</p>
        </div>
      `;

      backButton.hidden = currentIndex === 0;

      const firstAnswer = actionsEl.querySelector("[data-nppn-answer='yes']");
      requestAnimationFrame(() => firstAnswer?.focus({ preventScroll: true }));
    };

    const renderResult = (isEligible, failItem = null) => {
      questionEl.hidden = true;
      actionsEl.hidden = true;
      backButton.hidden = true;
      resultEl.hidden = false;

      progressText.textContent = "Pemeriksaan selesai";
      progressCount.textContent = "✓";
      progressBar.style.width = "100%";

      const answerSummary = answers
        .map((value, index) => `
          <li>
            <span>${index + 1}</span>
            <div>
              <small>${escapeHtml(QUESTIONS[index].title)}</small>
              <strong>${escapeHtml(labelForAnswer(value))}</strong>
            </div>
          </li>
        `)
        .join("");

      if (isEligible) {
        resultEl.className = "nppn-checker-result is-eligible";
        resultEl.innerHTML = `
          <div class="nppn-result-icon" aria-hidden="true">✓</div>
          <span class="nppn-result-kicker">Hasil pemeriksaan</span>
          <h3>Secara umum memenuhi syarat NPPN</h3>
          <p>
            Berdasarkan jawaban Anda, persyaratan dasar untuk menggunakan NPPN terpenuhi.
            Pastikan pemberitahuan telah disampaikan tepat waktu, gunakan persentase norma
            yang sesuai KLU dan wilayah, serta tetap lakukan pencatatan.
          </p>
          <ul class="nppn-answer-summary">${answerSummary}</ul>
          <div class="nppn-result-actions">
            <a class="nppn-result-primary" href="#cari-nppn">Cari persentase NPPN</a>
            <button type="button" class="nppn-result-reset" data-nppn-reset>Cek ulang</button>
          </div>
        `;
      } else {
        resultEl.className = "nppn-checker-result is-not-eligible";
        resultEl.innerHTML = `
          <div class="nppn-result-icon" aria-hidden="true">!</div>
          <span class="nppn-result-kicker">Hasil pemeriksaan</span>
          <h3>${escapeHtml(failItem?.failTitle || "Tidak memenuhi syarat NPPN")}</h3>
          <p>${escapeHtml(failItem?.failReason || "")}</p>
          <ul class="nppn-answer-summary">${answerSummary}</ul>
          <div class="nppn-result-actions">
            <button type="button" class="nppn-result-reset" data-nppn-reset>Cek ulang dari awal</button>
          </div>
        `;
      }

      resultEl.querySelector("[data-nppn-reset]")?.focus({ preventScroll: true });
    };

    const answer = (value) => {
      const item = QUESTIONS[currentIndex];
      answers[currentIndex] = value;

      if (value !== item.pass) {
        answers = answers.slice(0, currentIndex + 1);
        renderResult(false, item);
        return;
      }

      if (currentIndex === QUESTIONS.length - 1) {
        renderResult(true);
        return;
      }

      currentIndex += 1;
      answers = answers.slice(0, currentIndex);
      renderQuestion();
    };

    actionsEl.addEventListener("click", (event) => {
      const button = event.target.closest("[data-nppn-answer]");
      if (!button) return;
      answer(button.getAttribute("data-nppn-answer") === "yes");
    });

    backButton.addEventListener("click", () => {
      if (currentIndex <= 0) return;
      currentIndex -= 1;
      answers = answers.slice(0, currentIndex);
      renderQuestion();
    });

    resultEl.addEventListener("click", (event) => {
      const reset = event.target.closest("[data-nppn-reset]");
      if (!reset) return;

      currentIndex = 0;
      answers = [];
      resultEl.className = "nppn-checker-result";
      renderQuestion();
    });

    renderQuestion();
  }


  function initVisualGuide() {
    const root = document.getElementById("nppnVisualGuide");
    const image = document.getElementById("nppnVisualGuideImage");
    const title = document.getElementById("nppnVisualGuideTitle");
    const caption = document.getElementById("nppnVisualGuideCaption");
    const current = document.getElementById("nppnVisualGuideCurrent");
    const progress = document.getElementById("nppnVisualGuideProgress");
    const prev = document.getElementById("nppnSlidePrev");
    const next = document.getElementById("nppnSlideNext");

    if (!root || !image || !title || !caption || !current || !progress || !prev || !next) {
      return;
    }

    const base = root.getAttribute("data-slide-base") || "/assets/images/nppn/panduan/";

    const slides = [
      ["Tata Cara Pengajuan NPPN", "Slide pembuka panduan penyampaian pemberitahuan NPPN melalui Coretax DJP."],
      ["Buka Coretax DJP", "Buka coretaxdjp.pajak.go.id, kemudian tekan Lanjutkan ke Login."],
      ["Masuk ke akun Coretax", "Isi NIK/NPWP, password Coretax, lakukan verifikasi, lalu tekan Masuk."],
      ["Buka Layanan Wajib Pajak", "Pilih Layanan WP, kemudian Buat Permohonan Layanan Administrasi."],
      ["Pilih layanan NPPN", "Pilih AS.04 dan sublayanan AS.04-01 Pemberitahuan Penggunaan Norma Penghitungan Penghasilan Neto."],
      ["Lanjutkan layanan", "Pastikan layanan AS.04-01 sudah benar, lalu tekan tombol Lanjut."],
      ["Masuk ke Alur Kasus", "Pilih Alur Kasus, tunggu formulir tampil, kemudian geser ke bagian formulir pemberitahuan."],
      ["Isi data pemberitahuan", "Isi Tahun Pajak, Peredaran Bruto, serta Kota/Kabupaten tempat pemberitahuan dibuat."],
      ["Centang pernyataan", "Baca dan centang pernyataan Wajib Pajak, kemudian lanjutkan ke bagian bawah formulir."],
      ["Simpan dan refresh", "Tekan Simpan, kemudian Refresh Kewajiban Perpajakan."],
      ["Buat dokumen PDF", "Pada bagian Dokumen Keluar, tekan Create PDF."],
      ["Pilih klasifikasi surat", "Pilih sifat surat pada bagian Klasifikasi, misalnya Biasa."],
      ["Simpan formulir dokumen", "Setelah data dokumen lengkap, tekan Simpan."],
      ["Tandatangani dokumen", "Tekan Sign untuk memulai proses penandatanganan elektronik."],
      ["Masukkan passphrase", "Isi passphrase pada kolom Signer Password, kemudian tekan Simpan."],
      ["Kirim pemberitahuan", "Setelah dokumen berhasil ditandatangani, tekan Kirim."],
      ["Tunggu proses otomatis", "Kasus akan dilanjutkan otomatis. Tunggu hingga alur kasus berpindah ke proses berikutnya."],
      ["Pastikan kasus selesai", "Proses pengajuan selesai apabila terdapat keterangan Kasus Ditutup dan Skrip Berhasil Dieksekusi."],
      ["Lakukan pengecekan fasilitas", "Setelah pengajuan selesai, lanjutkan dengan pengecekan fasilitas untuk memastikan NPPN dapat digunakan."],
      ["Buka Profil Saya", "Pilih Portal Saya, kemudian Profil Saya."],
      ["Periksa Fasilitas Aktif", "Pilih Ikhtisar Profil Wajib Pajak lalu Fasilitas Aktif. Pastikan kode layanan AS.04 telah muncul."],
      ["Proses selesai", "Jika fasilitas AS.04 telah aktif, proses penyampaian dan pengecekan NPPN selesai."]
    ];

    let index = 0;
    let touchStartX = null;
    let touchStartY = null;

    const slideUrl = (i) =>
      `${base}nppn-slide-${String(i + 1).padStart(2, "0")}.webp`;

    const preload = (i) => {
      if (i < 0 || i >= slides.length) return;
      const img = new Image();
      img.src = slideUrl(i);
    };

    const render = () => {
      const [slideTitle, slideCaption] = slides[index];

      image.src = slideUrl(index);
      image.alt = `Slide ${index + 1} dari ${slides.length}: ${slideTitle}`;
      title.textContent = slideTitle;
      caption.textContent = slideCaption;
      current.textContent = String(index + 1);
      progress.style.width = `${((index + 1) / slides.length) * 100}%`;

      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;

      preload(index - 1);
      preload(index + 1);
    };

    const go = (direction) => {
      const nextIndex = Math.max(0, Math.min(slides.length - 1, index + direction));
      if (nextIndex === index) return;
      index = nextIndex;
      render();
    };

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));

    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "Home") {
        event.preventDefault();
        index = 0;
        render();
      } else if (event.key === "End") {
        event.preventDefault();
        index = slides.length - 1;
        render();
      }
    });

    const frame = root.querySelector(".nppn-visual-guide-frame");
    frame?.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches?.[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    frame?.addEventListener("touchend", (event) => {
      const touch = event.changedTouches?.[0];
      if (!touch || touchStartX == null || touchStartY == null) return;

      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      touchStartX = null;
      touchStartY = null;

      if (Math.abs(dx) < 42 || Math.abs(dx) <= Math.abs(dy)) return;
      go(dx < 0 ? 1 : -1);
    }, { passive: true });

    render();
  }

  function init() {
    initToc();
    initVisualGuide();
    initEligibilityChecker();
    const calculator = initCalculator();
    initDirectory((item) => calculator.selectItem(item, true));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
