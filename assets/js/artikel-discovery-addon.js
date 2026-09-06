(() => {
  "use strict";

  const searchInput = document.getElementById("articleSearchInput");
  const clearButton = document.getElementById("articleClearSearch");
  const resetButton = document.getElementById("articleDiscoveryReset");
  const categoryButtons = Array.from(
    document.querySelectorAll("#articleFilterRow [data-category]")
  );
  const intentButtons = Array.from(
    document.querySelectorAll("[data-kabayan-intent]")
  );
  const popularButtons = Array.from(
    document.querySelectorAll("[data-kabayan-search]")
  );
  const articleCards = Array.from(
    document.querySelectorAll("[data-article-item]")
  );

  if (!searchInput || articleCards.length === 0) {
    return;
  }

  const INTENT_RULES = [
    {
      phrase: "melapor spt",
      terms: [
        "spt", "pelaporan", "lapor", "tahunan", "masa pajak",
        "pembetulan", "bukti potong"
      ]
    },
    {
      phrase: "menghitung pajak",
      terms: [
        "tarif", "penghitungan", "hitung", "dpp", "pph", "ppn",
        "pajak masukan", "kredit pajak", "ter", "nppn"
      ]
    },
    {
      phrase: "mengajukan permohonan",
      terms: [
        "permohonan", "skb", "restitusi", "pengembalian",
        "lebih bayar", "pendaftaran", "pengukuhan",
        "pencabutan", "perubahan data", "surat keterangan"
      ]
    },
    {
      phrase: "memahami surat djp",
      terms: [
        "sp2dk", "stp", "skp", "surat teguran", "klarifikasi",
        "pemeriksaan", "pengawasan", "surat djp"
      ]
    },
    {
      phrase: "mengatasi coretax",
      terms: [
        "coretax", "role", "password", "akun", "faktur",
        "bukti potong", "xml", "sertifikat elektronik",
        "kode otorisasi"
      ]
    },
    {
      phrase: "mencari dasar hukum",
      terms: [
        "pmk", "per-", "peraturan", "undang-undang",
        " uu ", " pp ", "pasal", "dasar hukum", "ketentuan"
      ]
    }
  ];

  const SYNONYMS = [
    ["demurrage", "keterlambatan kapal biaya kapal"],
    ["lebih bayar", "restitusi pengembalian pendahuluan"],
    ["warisan", "waris ahli waris"],
    ["pph 21", "pegawai karyawan pemotongan"],
    ["faktur pajak", "invoice ppn"],
    ["coretax", "sistem administrasi perpajakan"]
  ];

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  // Enrich existing data-search without changing Jekyll/front matter.
  articleCards.forEach(card => {
    const original = normalize(card.dataset.search || card.textContent);
    const additions = [];

    INTENT_RULES.forEach(rule => {
      if (rule.terms.some(term => original.includes(normalize(term)))) {
        additions.push(rule.phrase);
      }
    });

    SYNONYMS.forEach(([source, expansion]) => {
      if (original.includes(source)) additions.push(expansion);
    });

    if (additions.length) {
      card.dataset.search = [
        card.dataset.search || "",
        ...additions
      ].join(" ").trim();
    }
  });

  function dispatchSearch() {
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    searchInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setSearch(query, scroll = true) {
    searchInput.value = query;
    dispatchSearch();
    updateActiveStates();

    if (scroll) {
      document.querySelector(".article-catalog-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function updateActiveStates() {
    const current = normalize(searchInput.value);

    intentButtons.forEach(button => {
      button.classList.toggle(
        "is-active",
        current === normalize(button.dataset.kabayanIntent)
      );
    });

    popularButtons.forEach(button => {
      button.classList.toggle(
        "is-active",
        current === normalize(button.dataset.kabayanSearch)
      );
    });
  }

  intentButtons.forEach(button => {
    button.addEventListener("click", () => {
      const query = button.dataset.kabayanIntent || "";
      const same = normalize(searchInput.value) === normalize(query);
      setSearch(same ? "" : query);
    });
  });

  popularButtons.forEach(button => {
    button.addEventListener("click", () => {
      setSearch(button.dataset.kabayanSearch || "");
      searchInput.focus();
    });
  });

  searchInput.addEventListener("input", updateActiveStates);

  clearButton?.addEventListener("click", () => {
    window.requestAnimationFrame(updateActiveStates);
  });

  resetButton?.addEventListener("click", () => {
    searchInput.value = "";

    const allButton = categoryButtons.find(
      button => (button.dataset.category || "") === "all"
    );

    if (allButton) {
      allButton.click();
    }

    dispatchSearch();
    updateActiveStates();
    searchInput.focus();
  });

  // Optional URL query support: artikel.html?q=Coretax
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q");

  if (initialQuery && !searchInput.value) {
    searchInput.value = initialQuery;
    dispatchSearch();
  }

  updateActiveStates();
})();
