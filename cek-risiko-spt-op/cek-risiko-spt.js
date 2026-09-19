(() => {
  "use strict";

  const common = {
    category: "PEMERIKSAAN SPT",
    help: "Tidak perlu memasukkan nominal. Pilih kondisi yang paling sesuai.",
  };

  const questionIcons = {
    profile_source: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5h8v2M3 12h18M10 12v2h4v-2"/></svg>',
    profile_family: '<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M13 16c.9-1 2.1-1.5 3.8-1.5 2.8 0 4.3 1.8 4.7 5.5"/></svg>',
    income_complete: '<svg viewBox="0 0 24 24"><path d="M4 7h15a2 2 0 0 1 2 2v9H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13"/><path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z"/></svg>',
    withholding: '<svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 15l2 2 5-5"/></svg>',
    classification: '<svg viewBox="0 0 24 24"><path d="m3 12 9-9h7l2 2v7l-9 9Z"/><circle cx="16.5" cy="7.5" r="1"/><path d="m7 14 3 3"/></svg>',
    bank_flow: '<svg viewBox="0 0 24 24"><path d="m3 9 9-5 9 5M5 10v7m4-7v7m6-7v7m4-7v7M3 20h18"/><path d="m8 13-2 2 2 2m8-4 2 2-2 2"/></svg>',
    assets_growth: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9H7v-9M16 4h4v4"/><path d="M10 15h4m-2-2v4"/></svg>',
    economic_capacity: '<svg viewBox="0 0 24 24"><path d="M12 3v18M5 7h14M4 7l-3 6h6L4 7Zm16 0-3 6h6l-3-6ZM8 21h8"/></svg>',
    debt: '<svg viewBox="0 0 24 24"><path d="M4 4h11l4 4v5M15 4v4h4M7 10h5M7 14h4"/><path d="M14 18h7m-3-3 3 3-3 3M4 4v16h8"/></svg>',
    asset_continuity: '<svg viewBox="0 0 24 24"><path d="m4 11 8-7 8 7v9H7v-9"/><path d="M3 5v5h5M21 19v-5h-5M4 10a9 9 0 0 1 15-4m1 8a9 9 0 0 1-15 4"/></svg>',
    foreign_assets: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z"/><path d="M17 17h5m-2-2 2 2-2 2"/></svg>',
    tax_credit: '<svg viewBox="0 0 24 24"><path d="M5 3h14v18l-3-2-4 2-4-2-3 2Z"/><path d="M8 8h7M8 12h4m2 3 2 2 4-5"/></svg>',
    multi_employer: '<svg viewBox="0 0 24 24"><path d="M3 21V7h8v14M13 21V3h8v18M6 10h2m-2 4h2m-2 4h2m10-11h-2m2 4h-2m2 4h-2M2 21h20"/></svg>',
    side_income: '<svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/><path d="M18 4v6m-3-3h6"/></svg>',
    business_receipts: '<svg viewBox="0 0 24 24"><path d="M4 10v11h16V10M3 4h18l-1 6a3 3 0 0 1-4 1 3 3 0 0 1-4 0 3 3 0 0 1-4 0 3 3 0 0 1-4-1L3 4Z"/><path d="M8 21v-6h8v6"/></svg>',
    family_unit: '<svg viewBox="0 0 24 24"><path d="M12 3c2 1.5 4.5 2.3 7 2.8v5.3c0 4.7-2.6 7.6-7 9.4-4.4-1.8-7-4.7-7-9.4V5.8C7.5 5.3 10 4.5 12 3Z"/><circle cx="12" cy="10" r="2"/><path d="M8.8 16c.4-2.1 1.4-3.2 3.2-3.2s2.8 1.1 3.2 3.2"/></svg>',
  };

  const questions = {
    profile_source: {
      category: "PROFIL PESERTA",
      text: "Dalam tahun pajak ini, kondisi mana yang paling sesuai dengan Anda?",
      help: "Jawaban menentukan pertanyaan lanjutan yang akan ditampilkan.",
      profile: true,
      answers: [
        { label: "Hanya bekerja pada satu pemberi kerja", value: "single_employer" },
        { label: "Bekerja pada lebih dari satu pemberi kerja", value: "multiple_employers" },
        { label: "Pegawai dan memiliki penghasilan lain", value: "employee_other" },
        { label: "Menjalankan usaha atau pekerjaan bebas", value: "business" },
        { label: "Belum yakin", value: "unknown", uncertain: true },
      ],
    },
    profile_family: {
      category: "PROFIL PESERTA",
      text: "Bagaimana status pelaporan pajak keluarga Anda?",
      help: "Pilih berdasarkan kondisi pada tahun pajak yang sedang dilaporkan.",
      profile: true,
      answers: [
        { label: "Belum menikah", value: "single" },
        { label: "Menikah dan kewajiban pajak digabung", value: "married_joined" },
        { label: "Menikah dengan kewajiban pajak terpisah", value: "married_separate" },
        { label: "Pasangan memiliki NPWP sendiri, tetapi statusnya belum saya pahami", value: "married_unknown", uncertain: true },
        { label: "Belum yakin", value: "unknown", uncertain: true },
      ],
    },
    income_complete: {
      ...common,
      domain: "Kelengkapan penghasilan",
      text: "Apakah seluruh penghasilan yang Anda terima sudah diperhitungkan dalam SPT?",
      answers: [
        { label: "Ya, seluruhnya sudah diperiksa", score: 0 },
        { label: "Sepertinya sudah, tetapi belum direkonsiliasi", score: 1, uncertain: true },
        { label: "Ada penghasilan yang belum diketahui perlakuan pajaknya", score: 2 },
        { label: "Ada penghasilan yang belum dimasukkan", score: 3, critical: true },
      ],
      mitigation: "Petakan seluruh sumber penghasilan dan pastikan semuanya telah masuk ke bagian SPT yang tepat.",
    },
    withholding: {
      ...common,
      domain: "Bukti potong",
      text: "Apakah seluruh bukti potong sudah dicocokkan dan dimasukkan dalam SPT?",
      answers: [
        { label: "Ya, seluruhnya sudah sesuai", score: 0 },
        { label: "Belum selesai dicocokkan", score: 1, uncertain: true },
        { label: "Ada perbedaan yang masih ditelusuri", score: 2 },
        { label: "Ada bukti potong yang belum dimasukkan", score: 3, critical: true },
      ],
      mitigation: "Kumpulkan dan cocokkan seluruh bukti potong dengan penghasilan serta kredit pajak dalam SPT.",
    },
    classification: {
      ...common,
      domain: "Klasifikasi penghasilan",
      text: "Apakah penghasilan biasa, final, dan bukan objek pajak telah dikategorikan dengan benar?",
      answers: [
        { label: "Ya, sudah diperiksa", score: 0 },
        { label: "Belum yakin", score: 1, uncertain: true },
        { label: "Ada yang masih perlu dikoreksi", score: 2 },
        { label: "Ada penghasilan biasa yang dilaporkan sebagai final atau bukan objek", score: 3 },
      ],
      mitigation: "Periksa kembali dasar pengenaan pajak setiap penghasilan sebelum menentukan kategori final atau bukan objek.",
    },
    bank_flow: {
      ...common,
      domain: "Arus dana rekening",
      text: "Bagaimana penerimaan dalam rekening dibandingkan penghasilan atau omzet yang dilaporkan?",
      answers: [
        { label: "Sejalan dan dapat dijelaskan", score: 0 },
        { label: "Lebih besar, tetapi selisihnya dapat dijelaskan", score: 1 },
        { label: "Belum pernah dibandingkan", score: 1, uncertain: true },
        { label: "Jauh lebih besar dan belum dapat dijelaskan", score: 3, critical: true },
      ],
      mitigation: "Rekonsiliasi mutasi rekening dan pisahkan penerimaan yang merupakan penghasilan dari dana nonpenghasilan.",
    },
    assets_growth: {
      ...common,
      domain: "Pertambahan harta",
      text: "Apakah pembelian atau pertambahan harta didukung sumber dana yang jelas?",
      answers: [
        { label: "Ya, seluruhnya dapat dijelaskan", score: 0 },
        { label: "Sebagian berasal dari tabungan lama dan ada buktinya", score: 1 },
        { label: "Belum dilakukan rekonsiliasi", score: 1, uncertain: true },
        { label: "Ada pertambahan harta yang sumber dananya belum jelas", score: 3, critical: true },
      ],
      mitigation: "Buat rekonsiliasi penghasilan, biaya hidup, utang, dan sumber dana untuk setiap pertambahan harta.",
    },
    economic_capacity: {
      ...common,
      domain: "Kemampuan ekonomi",
      text: "Apakah penghasilan yang dilaporkan sejalan dengan biaya hidup dan aset yang dimiliki?",
      answers: [
        { label: "Ya, sejalan", score: 0 },
        { label: "Ada selisih kecil yang dapat dijelaskan", score: 1 },
        { label: "Belum pernah diperiksa", score: 1, uncertain: true },
        { label: "Tidak sejalan dan belum ada penjelasan", score: 3, critical: true },
      ],
      mitigation: "Susun analisis sederhana antara penghasilan, biaya hidup, cicilan, dan pertambahan aset.",
    },
    debt: {
      ...common,
      domain: "Utang dan sumber dana",
      text: "Jika terdapat utang, apakah tersedia perjanjian dan bukti arus dananya?",
      answers: [
        { label: "Saya tidak memiliki utang", score: 0 },
        { label: "Ya, dokumennya lengkap", score: 0 },
        { label: "Dokumennya hanya tersedia sebagian", score: 2 },
        { label: "Tidak ada perjanjian atau bukti arus dana", score: 3, critical: true },
      ],
      mitigation: "Lengkapi perjanjian, identitas pihak terkait, jadwal pembayaran, dan bukti arus dana utang.",
    },
    asset_continuity: {
      ...common,
      domain: "Konsistensi daftar harta",
      text: "Apakah daftar harta konsisten dengan SPT tahun sebelumnya?",
      answers: [
        { label: "Ya, konsisten", score: 0 },
        { label: "Ada perubahan dengan dokumen pendukung", score: 0 },
        { label: "Belum dibandingkan", score: 1, uncertain: true },
        { label: "Ada harta berubah atau hilang tanpa penjelasan", score: 2 },
      ],
      mitigation: "Bandingkan daftar harta antartahun dan dokumentasikan penjualan, hibah, pengalihan, atau koreksi data.",
    },
    foreign_assets: {
      ...common,
      domain: "Aset atau penghasilan luar negeri",
      text: "Apakah Anda memiliki rekening, investasi, atau penghasilan dari luar negeri?",
      answers: [
        { label: "Tidak", score: 0 },
        { label: "Ya, dan seluruhnya sudah dilaporkan", score: 0 },
        { label: "Ya, tetapi belum yakin cara melaporkannya", score: 2, uncertain: true },
        { label: "Ya, dan belum dilaporkan", score: 3, critical: true },
      ],
      mitigation: "Inventarisasi rekening, investasi, dan penghasilan luar negeri serta periksa pelaporannya dalam SPT.",
    },
    tax_credit: {
      ...common,
      domain: "Kredit pajak",
      text: "Apakah kredit pajak dalam SPT sama dengan bukti potong yang Anda miliki?",
      answers: [
        { label: "Ya, seluruhnya sama", score: 0 },
        { label: "Belum selesai dicocokkan", score: 1, uncertain: true },
        { label: "Ada perbedaan yang sedang diperbaiki", score: 2 },
        { label: "Ada kredit pajak tanpa bukti yang sesuai", score: 3 },
      ],
      mitigation: "Cocokkan setiap kredit pajak dengan bukti potong yang sah dan data yang tersedia pada sistem.",
    },
    multi_employer: {
      ...common,
      category: "PERTANYAAN LANJUTAN · PEGAWAI",
      domain: "Lebih dari satu pemberi kerja",
      text: "Apakah seluruh bukti potong dari setiap pemberi kerja sudah digabungkan?",
      answers: [
        { label: "Ya, sudah digabungkan", score: 0 },
        { label: "Belum dihitung ulang", score: 1, uncertain: true },
        { label: "Hanya satu bukti potong yang dimasukkan", score: 3, critical: true },
        { label: "Saya belum memiliki seluruh bukti potong", score: 2 },
      ],
      mitigation: "Gabungkan seluruh bukti potong dan hitung kembali penghasilan serta PPh terutang selama satu tahun.",
    },
    side_income: {
      ...common,
      category: "PERTANYAAN LANJUTAN · PENGHASILAN LAIN",
      domain: "Penghasilan selain gaji",
      text: "Apakah penghasilan selain gaji sudah dipetakan menurut perlakuan pajaknya?",
      answers: [
        { label: "Ya, seluruhnya sudah dipetakan", score: 0 },
        { label: "Sebagian masih belum yakin", score: 1, uncertain: true },
        { label: "Ada yang belum dimasukkan", score: 3, critical: true },
        { label: "Belum pernah diperiksa", score: 2, uncertain: true },
      ],
      mitigation: "Pisahkan penghasilan biasa, final, dan bukan objek serta siapkan dokumen pendukung masing-masing.",
    },
    business_receipts: {
      ...common,
      category: "PERTANYAAN LANJUTAN · USAHA",
      domain: "Omzet usaha",
      text: "Bagaimana penerimaan rekening atau marketplace dibandingkan omzet yang dilaporkan?",
      answers: [
        { label: "Sesuai", score: 0 },
        { label: "Berbeda karena ada dana non-omzet dan tersedia buktinya", score: 1 },
        { label: "Belum direkonsiliasi", score: 2, uncertain: true },
        { label: "Penerimaan lebih besar dan belum dapat dijelaskan", score: 3, critical: true },
      ],
      mitigation: "Rekonsiliasi penjualan, marketplace, kas, dan rekening bank untuk memastikan omzet dilaporkan secara utuh.",
    },
    family_unit: {
      ...common,
      category: "PERTANYAAN LANJUTAN · KELUARGA",
      domain: "Unit pajak keluarga",
      text: "Apakah penghasilan dan harta pasangan telah diperlakukan sesuai status perpajakan keluarga?",
      answers: [
        { label: "Ya, sudah sesuai", score: 0 },
        { label: "Belum yakin", score: 1, uncertain: true },
        { label: "Ada data yang belum digabungkan", score: 2 },
        { label: "Penghasilan atau harta pasangan belum dilaporkan", score: 3 },
      ],
      mitigation: "Pastikan status kewajiban pajak suami-istri, PTKP, penghasilan, dan harta keluarga diterapkan secara konsisten.",
    },
  };

  const baseIds = [
    "profile_source", "profile_family", "income_complete", "withholding", "classification",
    "bank_flow", "assets_growth", "economic_capacity", "debt", "asset_continuity",
    "foreign_assets", "tax_credit",
  ];

  const state = { index: 0, answers: {} };
  const $ = (selector) => document.querySelector(selector);
  const screens = { start: $("#start-screen"), question: $("#question-screen"), result: $("#result-screen") };

  function sequence() {
    const ids = [...baseIds];
    const source = state.answers.profile_source?.value;
    const family = state.answers.profile_family?.value;
    const branches = [];
    if (source === "multiple_employers") branches.push("multi_employer");
    if (source === "employee_other") branches.push("side_income");
    if (source === "business") branches.push("business_receipts");
    if (["married_joined", "married_separate", "married_unknown"].includes(family)) branches.push("family_unit");
    return [...ids, ...branches.slice(0, 3)];
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    const ids = sequence();
    if (state.index >= ids.length) return showResult();
    const id = ids[state.index];
    const q = questions[id];
    const saved = state.answers[id];
    const current = state.index + 1;
    const percent = Math.round((current / ids.length) * 100);

    $("#question-category").textContent = q.category;
    $("#question-icon").innerHTML = questionIcons[id] || questionIcons.income_complete;
    $("#question-text").textContent = q.text;
    $("#question-help").textContent = q.help;
    $("#question-counter").textContent = `Pertanyaan ${current} dari ${ids.length}`;
    $("#progress-bar").style.width = `${percent}%`;
    $(".progress-track").setAttribute("aria-valuenow", String(current));
    $("#back-button").disabled = state.index === 0;
    $("#back-button").style.opacity = state.index === 0 ? ".35" : "1";

    const list = $("#answer-list");
    list.innerHTML = "";
    q.answers.forEach((answer, answerIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `answer-option${saved?.answerIndex === answerIndex ? " selected" : ""}`;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", saved?.answerIndex === answerIndex ? "true" : "false");
      button.innerHTML = `<span class="radio-dot" aria-hidden="true"></span><span>${answer.label}</span>`;
      button.addEventListener("click", () => chooseAnswer(id, answer, answerIndex));
      list.appendChild(button);
    });
  }

  function chooseAnswer(id, answer, answerIndex) {
    state.answers[id] = { ...answer, answerIndex };
    document.querySelectorAll(".answer-option").forEach((item, index) => {
      item.classList.toggle("selected", index === answerIndex);
      item.setAttribute("aria-checked", index === answerIndex ? "true" : "false");
    });
    window.setTimeout(() => { state.index += 1; renderQuestion(); }, 190);
  }

  function calculateResult() {
    const scored = Object.entries(state.answers)
      .filter(([id, answer]) => !questions[id].profile && Number.isFinite(answer.score))
      .map(([id, answer]) => ({ id, answer, question: questions[id] }));
    const score = scored.reduce((sum, item) => sum + item.answer.score, 0);
    const critical = scored.some((item) => item.answer.critical);
    let level = "low";
    if (critical || score >= 15) level = "veryHigh";
    else if (score >= 9) level = "high";
    else if (score >= 4) level = "medium";

    const ranked = scored.filter((item) => item.answer.score > 0).sort((a, b) => b.answer.score - a.answer.score);
    return { level, score, ranked };
  }

  const levelInfo = {
    low: {
      title: "Rendah", color: "#157463", tint: "#eaf6f2", icon: "assets/img/risiko-rendah.webp",
      summary: "Jawaban Anda menunjukkan data relatif konsisten. Tetap lakukan pemeriksaan akhir sebelum menyampaikan SPT.",
    },
    medium: {
      title: "Menengah", color: "#a46c0b", tint: "#fff6dc", icon: "assets/img/risiko-menengah.webp",
      summary: "Terdapat beberapa bagian administratif yang perlu dicocokkan atau dilengkapi sebelum SPT disampaikan.",
    },
    high: {
      title: "Tinggi", color: "#cf530c", tint: "#fff0e7", icon: "assets/img/risiko-tinggi.webp",
      summary: "Terdapat ketidaksesuaian yang dapat memengaruhi penghitungan atau kelengkapan pelaporan SPT.",
    },
    veryHigh: {
      title: "Sangat Tinggi", color: "#ad1028", tint: "#fdecef", icon: "assets/img/risiko-sangat-tinggi.webp",
      summary: "Terdapat red flag material yang perlu segera direkonsiliasi dan didukung dokumen yang memadai.",
    },
  };

  function showResult() {
    const result = calculateResult();
    const info = levelInfo[result.level];
    const hero = $("#result-hero");
    hero.style.setProperty("--result-color", info.color);
    hero.style.setProperty("--result-tint", info.tint);
    document.documentElement.style.setProperty("--result-color", info.color);
    $("#result-level").textContent = info.title;
    $("#result-summary").textContent = info.summary;
    $("#result-icon").src = info.icon;
    $("#result-icon").alt = `Ikon risiko ${info.title.toLowerCase()}`;

    const triggers = result.ranked.slice(0, 3);
    const triggerTexts = triggers.length
      ? triggers.map((item) => `${item.question.domain}: ${item.answer.label}.`)
      : ["Tidak ditemukan ketidaksesuaian material berdasarkan jawaban yang diberikan.", "Tetap cocokkan SPT dengan dokumen sumber sebelum dilaporkan."];
    $("#trigger-list").innerHTML = triggerTexts.map((text) => `<li>${text}</li>`).join("");

    const actions = [...new Set(triggers.map((item) => item.question.mitigation).filter(Boolean))];
    if (result.ranked.some((item) => item.answer.uncertain)) {
      actions.unshift("Periksa dokumen atas jawaban yang masih belum yakin agar potensi risiko dapat dikonfirmasi.");
    }
    if (!actions.length) actions.push(
      "Lakukan pemeriksaan akhir atas bukti potong dan penghasilan.",
      "Bandingkan daftar harta dengan SPT tahun sebelumnya.",
      "Simpan dokumen pendukung secara teratur."
    );
    $("#action-list").innerHTML = actions.slice(0, 4).map((text) => `<li>${text}</li>`).join("");
    showScreen("result");
  }

  $("#start-button").addEventListener("click", () => { showScreen("question"); renderQuestion(); });
  $("#nav-start-button").addEventListener("click", () => { state.index = 0; state.answers = {}; showScreen("question"); renderQuestion(); });
  $("#mobile-start-button").addEventListener("click", () => {
    $("#mobileNavToggle").checked = false;
    state.index = 0;
    state.answers = {};
    showScreen("question");
    renderQuestion();
  });
  $("#back-button").addEventListener("click", () => { if (state.index > 0) { state.index -= 1; renderQuestion(); } });
  $("#print-button").addEventListener("click", () => window.print());
  $("#restart-button").addEventListener("click", () => {
    state.index = 0;
    state.answers = {};
    showScreen("start");
  });

  $("#currentYear").textContent = new Date().getFullYear();
  const nav = $(".site-nav");
  const pageProgress = $(".page-progress span");
  const updateChrome = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    pageProgress.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
  };
  window.addEventListener("scroll", updateChrome, { passive: true });
  updateChrome();
})();
