window.KABAYAN_TREATY_DATA = {
  version: "pilot-v11-2026-08-17",
  reviewedAt: "17 Agustus 2026",
  domestic: {
    rate: 20,
    label: "PPh Pasal 26 — tarif domestik umum",
    corporateRate: 22,
    branchProfitRate: 20,
    source: {
      label: "DJP — PPh Pasal 26",
      url: "https://www.pajak.go.id/id/pph-pasal-2126"
    },
    residencySource: {
      label: "PER-23/PJ/2025 — Penentuan SPDN dan SPLN",
      url: "https://www.pajak.go.id/en/node/118835"
    },
    corporateSource: {
      label: "UU 7 Tahun 2021 (HPP) — tarif PPh badan/BUT 22%",
      url: "https://jdih.kemenkeu.go.id/dok/uu-7-tahun-2021"
    },
    branchProfitSource: {
      label: "UU PPh Pasal 26 ayat (4) — BPT domestik 20%",
      url: "https://jdih.kemenkeu.go.id/dok/uu-36-tahun-2008"
    },
    reinvestmentSource: {
      label: "PMK 14/PMK.03/2011 — pengecualian BPT atas reinvestasi",
      url: "https://jdih.kemenkeu.go.id/api/download/fulltext/2011/14~pmk.03~2011per.htm"
    },
    butIncomeSource: {
      label: "UU PPh — objek dan penghitungan PKP Bentuk Usaha Tetap",
      url: "https://www.pajak.go.id/id/undang-undang-nomor-36-tahun-2008"
    },
    butExpenseSource: {
      label: "UU PPh Pasal 6 dan Pasal 9 — biaya pengurang dan biaya yang tidak dapat dikurangkan",
      url: "https://www.pajak.go.id/id/undang-undang-nomor-36-tahun-2008"
    },
    creditSource: {
      label: "UU PPh Pasal 28, Pasal 28A, Pasal 29, dan Pasal 26 ayat (5) — kredit pajak dan posisi akhir tahun",
      url: "https://www.pajak.go.id/id/undang-undang-nomor-36-tahun-2008"
    },
    capitalGain: {
      unlistedShareRate: 5,
      listedShareRate: 0.1,
      shareSource: {label: "DJP — PPh Pasal 26 atas penjualan saham oleh WPLN", url: "https://www.pajak.go.id/id/pemotongan-pajak-penghasilan-pasal-26"},
      listedShareSource: {label: "DJP — PPh Final transaksi penjualan saham di bursa", url: "https://www.pajak.go.id/id/pemotongan-pajak-penghasilan-pasal-4-ayat-2-1"},
      consolidationSource: {label: "PMK 81 Tahun 2024 — konsolidasi ketentuan pemotongan/pemungutan", url: "https://jdih.kemenkeu.go.id/dok/pmk-81-tahun-2024"}
    }
  },
  commonSources: [
    {label: "PMK 112 Tahun 2025 — Tata Cara Penerapan P3B", url: "https://jdih.kemenkeu.go.id/dok/pmk-112-tahun-2025"},
    {label: "DJP — Penerapan P3B", url: "https://pajak.go.id/id/penerapan-persetujuan-penghindaran-pajak-berganda-p3b"}
  ],
  treaties: {
    Singapore: {
      label: "Singapura",
      source: {label: "DJP — P3B Indonesia–Singapura", url: "https://www.pajak.go.id/id/p3b/mli-singapura"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5", capitalGain: "Article 13", independentPersonal: "Article 14", employment: "Article 15", directorsFee: "Article 16"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "capital", holdingRule: null},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 8, knowhow: 8},
      branchProfit: {rate: 10, label: "Branch Profit Tax treaty"},
      capitalGain: {
        immovable: "indonesiaMayTax", peAsset: "indonesiaMayTax", shipsAircraft: "residenceOnly", ordinaryOther: "residenceOnly",
        shares: {ordinary: "residenceOnly", listedIndonesia: "indonesiaMayTax", propertyRichRule: "singapore50x50"},
        note: "Article 13: real property dan aset business property PE dapat dipajaki di negara tempat aset/PE berada; ships/aircraft international traffic hanya di negara residence. Untuk saham non-bursa, Indonesia dapat memajaki property-rich shares jika >50% nilainya berasal dari immovable property Indonesia dan alienator memiliki sekurang-kurangnya 50% total issued shares, dengan pengecualian tertentu. Saham perusahaan Indonesia yang diperdagangkan di BEI dapat dipajaki Indonesia."
      },
      projectRule: {
        threshold: "lebih dari 183 hari",
        appliesTo: ["construction","installation","assembly"],
        wording: "building site atau construction, installation, atau assembly project yang berlangsung lebih dari 183 hari",
        specialRole: {types:["installation","assembly"], role:"other-than-main", threshold:"lebih dari 3 bulan", wording:"assembly atau installation project oleh pihak selain main contractor menggunakan batas lebih dari 3 bulan"},
        mliAggregation: false,
        note: "Article 5(2)(h) menetapkan project PE >183 hari. Untuk assembly/installation yang dilakukan pihak selain main contractor, treaty menyebut batas 3 bulan."
      },
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "days", threshold: 90, wording: "lebih dari 90 hari dalam periode 12 bulan", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentPrincipalRole: false,
        note: "Article 5 mencakup fixed place PE dan furnishing of services, termasuk consultancy, jika kegiatan di suatu negara berlangsung secara agregat lebih dari 90 hari dalam periode 12 bulan."
      },
      personal: {
        independent: {article: "Article 14", presenceRule: "90 hari atau lebih dalam periode yang dimulai atau berakhir pada fiscal year terkait", triggerText: "Apakah masa berada di Indonesia mencapai atau melebihi 90 hari sesuai periode treaty?"},
        employment: {article: "Article 15", dayRule: "tidak melebihi 183 hari dalam setiap periode 12 bulan", dayQuestion: "Apakah keberadaan di Indonesia tidak melebihi 183 hari dalam setiap periode 12 bulan?", residenceTaxRequired: false},
        directors: {article: "Article 16", standalone: true, scope: "board of directors, management board, supervisory board, atau similar body"}
      },
      notes: {
        dividend: "Tarif 10% untuk beneficial owner berbentuk perusahaan yang memiliki langsung sekurang-kurangnya 25% modal perusahaan pembayar; selain itu 15%.",
        interest: "Tarif umum 10%. Terdapat pembebasan tertentu untuk pemerintah dan entitas pemerintah yang memenuhi definisi treaty.",
        royalty: "10% untuk hak cipta/paten/merek/desain/model/rencana/formula/proses; 8% untuk penggunaan equipment atau informasi/know-how industrial, commercial, atau scientific.",
        service: "Article 7 pada prinsipnya memberi hak pemajakan atas business profits hanya kepada negara domisili kecuali enterprise menjalankan usaha di Indonesia melalui permanent establishment."
      }
    },
    Japan: {
      label: "Jepang",
      source: {label: "DJP — P3B Indonesia–Jepang (Modified by MLI)", url: "https://www.pajak.go.id/id/p3b/mli-Jepang"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5", capitalGain: "Article 13", independentPersonal: "Article 14", employment: "Article 15", directorsFee: "Article 16"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "voting shares", holdingRule: "japan12m"},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      branchProfit: {rate: 10, label: "Branch Profit Tax treaty"},
      capitalGain: {
        immovable: "indonesiaMayTax", peAsset: "indonesiaMayTax", shipsAircraft: "residenceOnly", ordinaryOther: "residenceOnly",
        shares: {ordinary: "residenceOnly", listedIndonesia: "residenceOnly", propertyRichRule: "mli50-365"},
        note: "Article 13 sebagaimana dimodifikasi MLI: Indonesia dapat memajaki gains dari shares/comparable interests yang pada suatu waktu dalam 365 hari sebelum pengalihan memperoleh lebih dari 50% nilainya secara langsung atau tidak langsung dari immovable property Indonesia. Harta lain pada prinsipnya hanya di negara residence, kecuali real property atau business property PE."
      },
      projectRule: {
        threshold: "lebih dari 6 bulan",
        appliesTo: ["construction","installation"],
        wording: "building site atau construction atau installation project yang berlangsung lebih dari 6 bulan",
        mliAggregation: false,
        note: "Article 5(3) menetapkan construction/installation project PE hanya bila berlangsung lebih dari enam bulan. Supervisory services terkait proyek diuji terpisah melalui Article 5(5)."
      },
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "months", threshold: 6, wording: "lebih dari 6 bulan dalam suatu taxable year untuk proyek yang sama atau proyek-proyek yang terhubung", appliesTo: ["consultancy","supervision"]},
        agentRule: "mli-principal-role",
        agentPrincipalRole: true,
        note: "Article 5(5) secara khusus mencakup consultancy services atau supervisory services terkait building/construction/installation project yang berlangsung lebih dari enam bulan dalam taxable year. Jasa umum lain tidak otomatis masuk duration test ini; fixed place dan agent PE tetap perlu diuji."
      },
      personal: {
        independent: {article: "Article 14", presenceRule: "lebih dari 183 hari dalam calendar year terkait", triggerText: "Apakah masa berada di Indonesia melebihi 183 hari dalam tahun kalender yang bersangkutan?"},
        employment: {article: "Article 15", dayRule: "tidak melebihi 183 hari dalam calendar year terkait", dayQuestion: "Apakah keberadaan di Indonesia tidak melebihi 183 hari dalam tahun kalender yang bersangkutan?", residenceTaxRequired: false},
        directors: {article: "Article 16", standalone: true, scope: "member of the board of directors; untuk perusahaan Indonesia mencakup pengurus dan komisaris sesuai Protocol"}
      },
      notes: {
        dividend: "Tarif 10% jika beneficial owner adalah perusahaan yang memiliki sekurang-kurangnya 25% voting shares selama 12 bulan segera sebelum akhir periode akuntansi yang labanya dibagikan; selain itu 15%.",
        interest: "Tarif umum 10%. Pengecualian tersedia untuk pemerintah, bank sentral, dan institusi tertentu yang memenuhi definisi treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 12.",
        service: "Article 7 membatasi pemajakan business profits di Indonesia pada laba yang dapat diatribusikan kepada permanent establishment di Indonesia."
      }
    },
    "United States": {
      label: "Amerika Serikat",
      source: {label: "DJP — P3B Indonesia–Amerika Serikat (Modified by MLI)", url: "https://www.pajak.go.id/sites/default/files/2025-06/Tax%20Treaty%20US%20%28Modified%20by%20MLI%29%20-%20EN.pdf"},
      articles: {dividend: "Article 11", interest: "Article 12", royalty: "Article 13", service: "Article 8", pe: "Article 5", capitalGain: "Article 14", independentPersonal: "Article 15", employment: "Article 16", directorsFee: null},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "voting stock", holdingRule: null},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      branchProfit: {rate: 10, label: "Branch Profit Tax treaty"},
      capitalGain: {
        immovable: "indonesiaMayTax", peAsset: "indonesiaMayTax", shipsAircraft: "residenceOnly", ordinaryOther: "residenceOnly",
        shares: {ordinary: "residenceOnly", listedIndonesia: "residenceOnly", propertyRichRule: null},
        note: "Article 14: gains dari real property Indonesia dapat dipajaki Indonesia. Untuk resident berbentuk badan, capital assets lain pada prinsipnya exempt dari pajak Indonesia kecuali property tersebut effectively connected dengan PE/fixed base. Ships/aircraft international traffic mengikuti Article 9 dan hanya dipajaki negara residence."
      },
      projectRule: {
        threshold: "lebih dari 120 hari",
        appliesTo: ["construction","installation","assembly","supervision","naturalResource"],
        wording: "building site, construction/assembly/installation project, supervisory activities terkait proyek, atau installation/drilling rig/ship untuk eksplorasi/eksploitasi sumber daya yang berlangsung lebih dari 120 hari",
        mliAggregation: false,
        note: "Article 5(2)(i) menggunakan batas lebih dari 120 hari untuk project PE dan kegiatan eksplorasi/eksploitasi sumber daya yang disebutkan."
      },
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "days-us", threshold: 120, wording: "lebih dari 120 hari dalam suatu periode 12 bulan berturut-turut; dengan proviso khusus taxable year 30 hari", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentPrincipalRole: false,
        note: "Article 5(2)(j) mencakup furnishing of services bila kegiatan untuk proyek yang sama atau terhubung berlanjut lebih dari 120 hari dalam periode 12 bulan berturut-turut, dengan proviso bahwa PE tidak ada pada taxable year ketika jasa di negara tersebut kurang dari 30 hari pada taxable year itu."
      },
      personal: {
        independent: {article: "Article 15", presenceRule: "120 hari atau lebih dalam setiap consecutive 12-month period", triggerText: "Apakah masa tinggal di Indonesia mencapai atau melebihi 120 hari dalam setiap periode 12 bulan berturut-turut?"},
        employment: {article: "Article 16", dayRule: "kurang dari 120 hari dalam setiap consecutive 12-month period", dayQuestion: "Apakah keberadaan di Indonesia kurang dari 120 hari dalam setiap periode 12 bulan berturut-turut?", residenceTaxRequired: false},
        directors: {article: null, standalone: false, scope: "P3B Indonesia–AS tidak memuat standalone Directors’ Fees Article; Article 16 secara eksplisit mencakup services performed by an officer of a corporation/company sebagai employment."}
      },
      notes: {
        dividend: "Tarif 10% jika beneficial owner adalah perusahaan yang memiliki langsung sekurang-kurangnya 25% voting stock; selain itu 15%.",
        interest: "Tarif umum 10%. Terdapat pengecualian untuk pemerintah, bank sentral, dan financial institution milik/dikendalikan pemerintah sesuai treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 13.",
        service: "Article 8 menyatakan business profits resident salah satu negara bebas dari pajak negara lain kecuali kegiatan dilakukan melalui permanent establishment di negara lain tersebut."
      }
    },
    Netherlands: {
      label: "Belanda",
      source: {label: "DJP — P3B Indonesia–Belanda (Protocol & MLI)", url: "https://www.pajak.go.id/id/p3b/mli-belanda"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5", capitalGain: "Article 14", independentPersonal: "Article 15", employment: "Article 16", directorsFee: "Article 17"},
      dividend: {general: 15, direct: 5, minOwnership: 25, ownershipType: "capital", holdingRule: "nl365"},
      interest: {general: 10, longTerm: 5, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      branchProfit: {rate: 10, label: "Branch Profit Tax treaty"},
      capitalGain: {
        immovable: "indonesiaMayTax", peAsset: "indonesiaMayTax", shipsAircraft: "residenceOnly", ordinaryOther: "residenceOnly",
        shares: {ordinary: "residenceOnly", listedIndonesia: "residenceOnly", propertyRichRule: null},
        note: "Article 14: real property dan movable property business asset PE dapat dipajaki negara tempat aset/PE berada; ships/aircraft international traffic hanya di negara residence; harta lain pada prinsipnya hanya di negara residence. Paragraph 5 memiliki rule khusus untuk individual tertentu, sehingga tidak diterapkan pada pilot badan/non-individual."
      },
      projectRule: {
        threshold: "lebih dari 6 bulan",
        appliesTo: ["construction","installation","assembly","supervision"],
        wording: "building site, construction/assembly/installation project, atau supervisory activities terkait proyek yang berlangsung lebih dari 6 bulan",
        mliAggregation: true,
        aggregationAppliesTo: ["construction","supervision"],
        aggregationBase: "aktivitas enterprise sendiri secara agregat >30 hari tetapi belum melewati batas 6 bulan",
        aggregationRelated: "connected activities pada site/proyek yang sama oleh closely related enterprise, masing-masing >30 hari, ditambahkan untuk menguji batas 6 bulan",
        note: "Article 5(3)(a) menetapkan batas >6 bulan. MLI Article 14 menerapkan aggregation/splitting-up untuk building site/construction project dan supervisory activities terkaitnya."
      },
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "months", threshold: 3, wording: "lebih dari 3 bulan dalam periode 12 bulan untuk proyek yang sama atau terhubung", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentPrincipalRole: false,
        note: "Article 5(3)(b) mencakup furnishing of services, termasuk consultancy services, jika kegiatan untuk proyek yang sama atau terhubung berlangsung secara agregat lebih dari tiga bulan dalam periode 12 bulan."
      },
      personal: {
        independent: {article: "Article 15", presenceRule: "lebih dari 91 hari dalam setiap periode 12 bulan", triggerText: "Apakah masa berada di Indonesia melebihi 91 hari dalam setiap periode 12 bulan?"},
        employment: {article: "Article 16", dayRule: "tidak melebihi 183 hari dalam setiap periode 12 bulan yang dimulai atau berakhir pada fiscal year terkait", dayQuestion: "Apakah keberadaan di Indonesia tidak melebihi 183 hari dalam periode 12 bulan yang dimulai atau berakhir pada fiscal year terkait?", residenceTaxRequired: false},
        directors: {article: "Article 17", standalone: true, scope: "pengurus atau komisaris perusahaan yang resident Indonesia"}
      },
      notes: {
        dividend: "Protocol memberi 5% untuk perusahaan (selain partnership) dengan kepemilikan langsung sekurang-kurangnya 25%; MLI mensyaratkan kondisi kepemilikan dipenuhi sepanjang periode 365 hari yang mencakup hari pembayaran. Tarif lain termasuk 15% untuk kasus umum.",
        interest: "Tarif umum 10%; 5% untuk pinjaman lebih dari 2 tahun atau penjualan kredit equipment industrial/commercial/scientific; pembebasan tertentu berlaku bagi pemerintah/otoritas yang memenuhi treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 12.",
        service: "Article 7 memberikan hak pemajakan kepada negara domisili kecuali enterprise memiliki permanent establishment di Indonesia; bila PE ada, Indonesia dapat memajaki laba yang tercakup sesuai Article 7."
      }
    },
    Australia: {
      label: "Australia",
      source: {label: "DJP — P3B Indonesia–Australia (Modified by MLI)", url: "https://pajak.go.id/id/p3b/mli-australia"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5", capitalGain: "Article 13", independentPersonal: "Article 14", employment: "Article 15", directorsFee: "Article 16"},
      dividend: {general: 15, direct: null, minOwnership: null, holdingRule: null},
      interest: {general: 10, governmentExemption: true, governmentScope: "officialReserve"},
      royalty: {ip: 15, media: 15, equipment: 10, knowhow: 10},
      branchProfit: {rate: 15, label: "Branch Profit Tax treaty"},
      capitalGain: {
        immovable: "indonesiaMayTax", peAsset: "indonesiaMayTax", shipsAircraft: "residenceOnly", ordinaryOther: "domesticLawMayTax",
        shares: {ordinary: "domesticLawMayTax", listedIndonesia: "domesticLawMayTax", propertyRichRule: "australia-principal-365"},
        note: "Article 13: real property dan business property PE dapat dipajaki negara tempat aset/PE berada. Property-rich shares/comparable interests dapat dipajaki Indonesia, dengan MLI menerapkan pengujian nilai pada suatu waktu dalam 365 hari sebelum pengalihan. Paragraph 5 mempertahankan penerapan hukum domestik untuk harta lain yang tidak tercakup paragraf sebelumnya."
      },
      projectRule: {
        threshold: "lebih dari 120 hari",
        appliesTo: ["construction","installation","assembly","supervision","naturalResource"],
        wording: "building site, construction/installation/assembly project atau supervisory activities terkait proyek yang berlangsung lebih dari 120 hari; installation/drilling rig/ship untuk natural resources juga menggunakan batas >120 hari",
        mliAggregation: true,
        aggregationAppliesTo: ["construction","installation","assembly","supervision"],
        aggregationBase: "aktivitas enterprise sendiri pada site/proyek berlangsung agregat >30 hari tetapi belum melewati 120 hari",
        aggregationRelated: "connected activities pada site/proyek yang sama oleh closely related enterprise, masing-masing >30 hari, ditambahkan untuk menguji batas 120 hari",
        note: "Article 5(2)(i) menetapkan >120 hari. MLI Article 14 menerapkan splitting-up of contracts untuk project/site dan supervisory activities yang terkait."
      },
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "days", threshold: 120, wording: "lebih dari 120 hari dalam periode 12 bulan untuk proyek yang sama atau terhubung", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentPrincipalRole: false,
        note: "Article 5(2)(j) mencakup furnishing of services, termasuk consultancy, bila jasa untuk proyek yang sama atau terhubung dilakukan di suatu negara lebih dari 120 hari dalam periode 12 bulan."
      },
      personal: {
        independent: {article: "Article 14", presenceRule: "lebih dari 120 hari dalam setiap periode 12 bulan", triggerText: "Apakah masa berada di Indonesia melebihi 120 hari dalam setiap periode 12 bulan?"},
        employment: {article: "Article 15", dayRule: "tidak melebihi 120 hari dalam setiap periode 12 bulan", dayQuestion: "Apakah keberadaan di Indonesia tidak melebihi 120 hari dalam setiap periode 12 bulan?", residenceTaxRequired: true},
        directors: {article: "Article 16", standalone: true, scope: "member of the board of directors atau similar organ perusahaan resident Indonesia"}
      },
      notes: {
        dividend: "Tarif maksimum 15% atas jumlah bruto dividen; treaty tidak memberikan tarif direct participation yang lebih rendah pada Article 10.",
        interest: "Tarif umum 10%. Pengecualian berlaku untuk interest dari investasi official foreign exchange reserve assets oleh pemerintah/monetary institutions/bank yang menjalankan fungsi central banking.",
        royalty: "10% untuk penggunaan equipment dan supply of scientific/technical/industrial/commercial knowledge atau information (serta bantuan tertentu yang ancillary); 15% untuk kategori royalti lainnya.",
        service: "Article 7 mengalokasikan business profits ke negara domisili kecuali enterprise menjalankan usaha melalui permanent establishment di Indonesia. Bila PE ada, Indonesia dapat memajaki laba yang diatribusikan atau dicakup oleh Article 7."
      }
    }
  }
};
