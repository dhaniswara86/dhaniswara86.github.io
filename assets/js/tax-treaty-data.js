window.KABAYAN_TREATY_DATA = {
  version: "pilot-v16-netherlands-audit-2026-08-17",
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
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "capital", holdingRule: "pmk365", holdingText: "PMK 112/2025 Pasal 20: kepemilikan untuk tarif dividen yang lebih rendah dipenuhi paling singkat 365 hari kalender termasuk hari pembayaran dividen."},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 8, knowhow: 8},
      branchProfit: {rate: 10, label: "Branch Profit Tax treaty"},
      capitalGain: {
        immovable: "indonesiaMayTax", peAsset: "indonesiaMayTax", shipsAircraft: "residenceOnly", ordinaryOther: "residenceOnly",
        shares: {ordinary: "residenceOnly", listedIndonesia: "indonesiaMayTax", propertyRichRule: "singapore50x50"},
        note: "Article 13: real property dan aset business property PE dapat dipajaki di negara tempat aset/PE berada; ships/aircraft international traffic hanya di negara residence. Untuk saham non-bursa, Indonesia dapat memajaki property-rich shares jika >50% nilainya berasal dari immovable property Indonesia dan alienator memiliki sekurang-kurangnya 50% total issued shares, dengan pengecualian tertentu. Dalam penerapan Indonesia, PMK 112/2025 Pasal 21 menguji threshold harta tidak bergerak kapan pun dalam 365 hari sebelum pengalihan. Saham perusahaan Indonesia yang diperdagangkan di BEI dapat dipajaki Indonesia."
      },
      projectRule: {
        threshold: "lebih dari 183 hari",
        appliesTo: ["construction","installation","assembly","supervision"],
        wording: "building site atau construction, installation, atau assembly project yang berlangsung lebih dari 183 hari",
        activityOverrides: {
          supervision: {threshold: "lebih dari 6 bulan", wording: "supervisory activities di Indonesia yang berhubungan dengan construction, installation, atau assembly project dan berlangsung lebih dari 6 bulan"}
        },
        specialRole: {types:["installation","assembly"], role:"other-than-main", threshold:"lebih dari 3 bulan", wording:"assembly atau installation project oleh pihak selain main contractor menggunakan batas lebih dari 3 bulan"},
        mliAggregation: false,
        note: "Article 5(2)(h) menetapkan project PE >183 hari dan batas 3 bulan untuk assembly/installation oleh pihak selain main contractor. Article 5(4) secara terpisah menetapkan supervisory activities terkait construction/installation/assembly project >6 bulan."
      },
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "days", threshold: 90, wording: "lebih dari 90 hari dalam periode 12 bulan", appliesTo: ["general","consultancy","technical"]},
        agentRule: "authority-stock-delivery",
        agentPrincipalRole: false,
        agentStockDelivery: true,
        insurancePE: true,
        independentAgentAlmostWholly: true,
        note: "Article 5 mencakup fixed place PE; furnishing of services termasuk consultancy >90 hari dalam periode 12 bulan; supervisory activities terkait proyek >6 bulan; dependent agent melalui contract authority atau habitual stock delivery; serta insurance PE tertentu (selain reinsurance)."
      },
      personal: {
        independent: {article: "Article 14", presenceRule: "90 hari atau lebih dalam periode yang dimulai atau berakhir pada fiscal year terkait", triggerText: "Apakah masa berada di Indonesia mencapai atau melebihi 90 hari sesuai periode treaty?"},
        employment: {article: "Article 15", dayRule: "tidak melebihi 183 hari dalam setiap periode 12 bulan", dayQuestion: "Apakah keberadaan di Indonesia tidak melebihi 183 hari dalam setiap periode 12 bulan?", residenceTaxRequired: false},
        directors: {article: "Article 16", standalone: true, scope: "board of directors, management board, supervisory board, atau similar body"},
        entertainer: {article: "Article 17", sourceTax: true, exception: "publicFunds", exceptionText: "Kunjungan wholly atau mainly supported oleh public funds salah satu/kedua negara atau subdivisi/otoritas/statutory body; jika terpenuhi, hanya negara residence yang memajaki."},
        pension: {article: "Article 18", pensionRule: "sourceMayTax", socialSecurityRule: "sourceOnly", annuityRule: "review", maxRate: null, note: "Pension dan similar remuneration yang arising di Indonesia dan dibayar kepada resident Singapura dapat dipajaki Indonesia; pembayaran social security system hanya dipajaki negara sumber. Annuity tidak disebut eksplisit dalam Article 18."},
        government: {article: "Article 19", salaryRule: "sourceOnlyWithResidenceException", pensionRule: "sourceOnlyWithNationalResidenceException", businessFallback: true},
        teacher: {article: "Article 21", standalone: true, maxYears: 2, requiresFirstVisit: true, requiresGovernmentInvitation: true, requiresResidenceTax: true, privateBenefitException: true, institutionText: "institution", note: "Exemption berlaku untuk first visit, tidak melebihi dua tahun, atas undangan Government, solely untuk teaching/research, dan remuneration subject to tax di negara residence; research untuk private benefit tidak termasuk."}
      },
      audit: {
        status: "reviewed",
        label: "Audit rule Singapura selesai",
        reviewedAt: "17 Agustus 2026",
        basis: "P3B Indonesia–Singapura 2020 (efektif 1 Januari 2022) + PMK 112/2025",
        modeled: ["Article 5 PE", "Article 7 Business Profits", "Article 10 Dividends/BPT", "Article 11 Interest", "Article 12 Royalties", "Article 13 Capital Gains", "Article 14–19 dan 21 personal income"],
        gaps: ["Article 8 Shipping & Air Transport belum menjadi modul transaksi tersendiri", "Article 20 Students belum dimodelkan", "Article 22 Other Income belum menjadi modul tersendiri"]
      },
      notes: {
        dividend: "Tarif treaty 10% untuk beneficial owner berbentuk perusahaan yang memiliki langsung sekurang-kurangnya 25% modal perusahaan pembayar; selain itu 15%. Untuk penerapan di Indonesia, PMK 112/2025 Pasal 20 juga menguji periode kepemilikan paling singkat 365 hari kalender termasuk hari pembayaran dividen.",
        interest: "Tarif umum 10%. Terdapat pembebasan tertentu untuk pemerintah dan entitas pemerintah yang memenuhi definisi treaty.",
        royalty: "10% untuk hak cipta/paten/merek/desain/model/rencana/formula/proses; 8% untuk penggunaan equipment atau informasi/know-how industrial, commercial, atau scientific.",
        service: "Article 7 pada prinsipnya memberi hak pemajakan atas business profits hanya kepada negara domisili kecuali enterprise menjalankan usaha di Indonesia melalui permanent establishment."
      }
    },
    Japan: {
      label: "Jepang",
      source: {label: "DJP — P3B Indonesia–Jepang (Modified by MLI)", url: "https://www.pajak.go.id/id/p3b/mli-Jepang"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5", capitalGain: "Article 13", independentPersonal: "Article 14", employment: "Article 15", directorsFee: "Article 16"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "voting shares", holdingRule: "japan12m-pmk365"},
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
        agentRule: "mli-principal-role-stock-insurance",
        agentPrincipalRole: true,
        agentStockDelivery: true,
        insurancePE: true,
        independentAgentAlmostWholly: true,
        antiFragmentation: true,
        governmentCooperationException: true,
        note: "Article 5 mencakup fixed place PE, project PE >6 bulan, consultancy/supervisory service PE >6 bulan dalam taxable year, dependent-agent PE yang diperluas MLI (concludes contracts/principal role), habitual stock delivery, serta insurance PE tertentu. MLI juga menerapkan anti-fragmentation pada specific activity exemptions. Furnishing of services berdasarkan agreement antar-Pemerintah mengenai economic/technical cooperation dikecualikan dari PE berdasarkan Article 5(5)."
      },
      personal: {
        independent: {article: "Article 14", presenceRule: "lebih dari 183 hari dalam calendar year terkait", triggerText: "Apakah masa berada di Indonesia melebihi 183 hari dalam tahun kalender yang bersangkutan?"},
        employment: {article: "Article 15", dayRule: "tidak melebihi 183 hari dalam calendar year terkait", dayQuestion: "Apakah keberadaan di Indonesia tidak melebihi 183 hari dalam tahun kalender yang bersangkutan?", residenceTaxRequired: false},
        directors: {article: "Article 16", standalone: true, scope: "member of the board of directors; untuk perusahaan Indonesia mencakup pengurus dan komisaris sesuai Protocol"},
        entertainer: {article: "Article 17", sourceTax: true, exception: "culturalProgramme", exceptionText: "Income dapat exempt di negara kegiatan bila aktivitas dilakukan berdasarkan special programme for cultural exchange yang disepakati Pemerintah kedua negara dan syarat treaty terpenuhi."},
        pension: {article: "Article 18", pensionRule: "residenceOnly", socialSecurityRule: "review", annuityRule: "review", maxRate: 0, note: "Private pensions dan similar remuneration atas past employment taxable only di negara residence, subject to government pension rule Article 19."},
        government: {article: "Article 19", salaryRule: "sourceOnlyWithResidenceException", pensionRule: "sourceOnlyWithNationalResidenceException", businessFallback: true},
        teacher: {article: "Article 20", standalone: true, maxYears: 2, requiresFirstVisit: false, requiresGovernmentInvitation: false, requiresResidenceTax: false, privateBenefitException: false, institutionText: "university, college, school, atau accredited educational institution", note: "Professor/teacher yang temporary visit tidak melebihi dua tahun untuk teaching/research dan immediately before visit resident negara lain taxable only di negara residence atas remuneration teaching/research."}
      },
      audit: {
        status: "reviewed",
        label: "Audit rule Jepang selesai",
        reviewedAt: "17 Agustus 2026",
        basis: "P3B Indonesia–Jepang 1982 sebagaimana dimodifikasi MLI + Protocol + PMK 112/2025",
        modeled: ["Article 4 dual-resident entity guard", "Article 5 PE + MLI anti-fragmentation/agent", "Article 7 Business Profits", "Article 10 Dividends + PMK 365 hari", "Article 11 Interest", "Article 12 Royalties", "Article 13 Capital Gains + MLI 365 hari", "Article 14–20 personal income", "Protocol Branch Profit Tax 10%"],
        gaps: ["Article 8 Shipping & Air Transport belum menjadi modul transaksi tersendiri", "Article 21 Students/trainees belum dimodelkan", "Article 22 Other Income belum menjadi modul tersendiri", "Comparable interests selain saham pada Article 13 MLI belum memiliki input khusus"]
      },
      notes: {
        dividend: "Tarif 10% memerlukan beneficial owner berbentuk perusahaan dengan kepemilikan sekurang-kurangnya 25% voting shares selama 12 bulan segera sebelum akhir periode akuntansi yang labanya dibagikan. Untuk penerapan tarif lebih rendah di Indonesia, PMK 112/2025 Pasal 20 juga menguji kepemilikan minimum selama sekurang-kurangnya 365 hari kalender termasuk hari pembayaran dividen; jika salah satu syarat tidak terpenuhi, tarif treaty 15% digunakan sepanjang syarat treaty lainnya terpenuhi.",
        interest: "Tarif umum 10%. Pengecualian tersedia untuk pemerintah, bank sentral, dan institusi tertentu yang memenuhi definisi treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 12.",
        service: "Article 7 membatasi pemajakan business profits di Indonesia pada laba yang dapat diatribusikan kepada permanent establishment di Indonesia."
      }
    },
    "United States": {
      label: "Amerika Serikat",
      source: {label: "DJP — P3B Indonesia–Amerika Serikat (As Amended by 1996 Protocol)", url: "https://www.pajak.go.id/id/p3b/mli-amerikaserikat"},
      articles: {dividend: "Article 11", interest: "Article 12", royalty: "Article 13", service: "Article 8", pe: "Article 5", capitalGain: "Article 14", independentPersonal: "Article 15", employment: "Article 16", directorsFee: null},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "voting stock", holdingRule: "pmk365", holdingText: "PMK 112/2025 Pasal 20: untuk tarif dividen treaty yang lebih rendah, kepemilikan minimum harus dipenuhi paling singkat 365 hari kalender termasuk hari pembayaran dividen."},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      branchProfit: {rate: 10, label: "Branch Profit Tax treaty", pscException: true},
      businessProfits: {forceAttraction: true, headOfficeExpenseRule: true},
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
        agentRule: "authority-stock-delivery-insurance",
        agentPrincipalRole: false,
        agentStockDelivery: true,
        stockDeliveryRequiresSalesContribution: true,
        insurancePE: true,
        fixedPlaceExceptionText: "Apakah fixed place hanya digunakan untuk aktivitas yang dikecualikan Article 5(3)?",
        fixedPlaceExceptionHelp: "Termasuk storage/display; stock untuk storage/display atau processing by another person; purchasing/collecting information; atau advertising, supply of information, scientific research, dan similar activities yang preparatory/auxiliary. Protocol juga menegaskan occasional delivery tertentu tidak menimbulkan PE.",
        note: "Article 5 mencakup project PE >120 hari; furnishing of services >120 hari dalam consecutive 12 months dengan proviso 30 hari taxable year; dependent agent melalui contract authority atau stock-and-delivery dengan additional sales contribution; serta insurance PE tertentu (selain reinsurance)."
      },
      personal: {
        independent: {article: "Article 15", presenceRule: "120 hari atau lebih dalam setiap consecutive 12-month period", triggerText: "Apakah masa tinggal di Indonesia mencapai atau melebihi 120 hari dalam setiap periode 12 bulan berturut-turut?"},
        employment: {article: "Article 16", dayRule: "kurang dari 120 hari dalam setiap consecutive 12-month period", dayQuestion: "Apakah keberadaan di Indonesia kurang dari 120 hari dalam setiap periode 12 bulan berturut-turut?", residenceTaxRequired: false},
        directors: {article: null, standalone: false, scope: "P3B Indonesia–AS tidak memuat standalone Directors’ Fees Article; Article 16 secara eksplisit mencakup services performed by an officer of a corporation/company sebagai employment."},
        entertainer: {article: "Article 17", sourceTax: true, thresholdRule: "usd2000", exception: "sponsoredCertified", exceptionText: "Article tidak berlaku bila visit substantially supported/sponsored oleh negara lain dan certified oleh competent authority sending State."},
        pension: {article: "Article 21", pensionRule: "sourceMayTaxCapped", annuityRule: "residenceOnly", socialSecurityRule: "review", maxRate: 15, note: "Private pensions dari sumber Indonesia dapat dipajaki kedua negara, tetapi tax negara sumber maksimum 15% gross; annuities taxable only di negara residence. Government pension diatur Article 18."},
        government: {article: "Article 18", salaryRule: "sourceOnlyWithResidenceException", pensionRule: "sourceOnly", businessFallback: true},
        teacher: {article: "Article 20", standalone: true, maxYears: 2, requiresFirstVisit: false, requiresGovernmentInvitation: false, requiresResidenceTax: false, privateBenefitException: true, institutionText: "university, college, school, atau similar educational institution", note: "Exemption atas remuneration teaching/research selama periode tidak melebihi dua tahun; research primarily for private benefit tidak memperoleh exemption."}
      },
      audit: {
        status: "reviewed",
        label: "Audit rule Amerika Serikat selesai",
        reviewedAt: "17 Agustus 2026",
        basis: "P3B Indonesia–Amerika Serikat sebagaimana diubah Protocol 1996 + PMK 112/2025",
        modeled: ["Article 4 dual-resident company incorporation rule", "Article 5 project/service/agent/insurance PE", "Article 8 force of attraction dan head-office expense limitations", "Article 11 dividend/BPT + PMK 365 hari", "Article 12 Interest", "Article 13 Royalties", "Article 14 Capital Gains", "Article 15–22 personal income", "Article 28 Limitation on Benefits"],
        gaps: ["Article 9 Shipping & Air Transport belum menjadi modul transaksi tersendiri", "Article 19 Students & Trainees belum menjadi modul input", "Article 22 Social Security belum memiliki kalkulasi tersendiri", "Article 28 saving clause belum dimodelkan untuk menghitung pajak AS karena kalkulator fokus pada pajak Indonesia", "Tarif tambahan dalam PSC/Contract of Work Article 11(5) tidak dihitung otomatis"]
      },
      notes: {
        dividend: "Tarif 10% jika beneficial owner adalah perusahaan yang memiliki langsung sekurang-kurangnya 25% voting stock; selain itu 15%. Untuk penerapan tarif lebih rendah di Indonesia, PMK 112/2025 Pasal 20 juga mensyaratkan periode kepemilikan paling singkat 365 hari kalender termasuk hari pembayaran dividen.",
        interest: "Tarif umum 10%. Terdapat pengecualian untuk pemerintah, bank sentral, dan financial institution milik/dikendalikan pemerintah sesuai treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 13.",
        service: "Article 8 menyatakan business profits resident salah satu negara bebas dari pajak negara lain kecuali kegiatan dilakukan melalui permanent establishment di negara lain tersebut."
      }
    },
    Netherlands: {
      label: "Belanda",
      source: {label: "DJP — P3B Indonesia–Belanda (Protocol & MLI)", url: "https://www.pajak.go.id/id/p3b/mli-belanda"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5", capitalGain: "Article 14", independentPersonal: "Article 15", employment: "Article 16", directorsFee: "Article 17"},
      dividend: {general: 15, direct: 5, pensionFund: 10, minOwnership: 25, ownershipType: "capital", holdingRule: "nl365"},
      interest: {general: 10, longTerm: 5, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      businessProfits: {
        forceAttraction: true,
        forceAttractionText: "Article 7(1) mencakup laba yang dapat diatribusikan kepada PE serta laba sumber Indonesia dari sales of goods/merchandise of the same kind atau other business transactions of the same kind. Protocol membatasi atribusi pada remuneration yang terkait actual activity PE dan bagian kontrak yang benar-benar dilaksanakan PE.",
        headOfficeChargeRestriction: true,
        headOfficeExpenseText: "Article 7(3) membolehkan executive/general administrative expenses yang incurred untuk PE. Protocol melarang deduction atas intra-office royalties, fees/commissions untuk specific services atau management, dan interest (kecuali banking enterprise), selain reimbursement atas expenses yang benar-benar incurred."
      },
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
        antiFragmentation: true,
        serviceRule: {kind: "months", threshold: 3, wording: "lebih dari 3 bulan dalam periode 12 bulan untuk proyek yang sama atau terhubung", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentStockDelivery: true,
        insurancePE: true,
        independentAgentAlmostWholly: true,
        agentPrincipalRole: false,
        note: "Article 5(3)(b) mencakup furnishing of services termasuk consultancy services >3 bulan dalam 12 bulan untuk proyek yang sama/terhubung. MLI Option A dan anti-fragmentation berlaku pada specific activity exemptions; Article 5 juga memuat stock-and-delivery agent, insurance PE, serta independent-agent limitation ketika aktivitas wholly/almost wholly untuk enterprise terkait."
      },
      personal: {
        independent: {article: "Article 15", presenceRule: "lebih dari 91 hari dalam setiap periode 12 bulan", triggerText: "Apakah masa berada di Indonesia melebihi 91 hari dalam setiap periode 12 bulan?"},
        employment: {article: "Article 16", dayRule: "tidak melebihi 183 hari dalam setiap periode 12 bulan yang dimulai atau berakhir pada fiscal year terkait", dayQuestion: "Apakah keberadaan di Indonesia tidak melebihi 183 hari dalam periode 12 bulan yang dimulai atau berakhir pada fiscal year terkait?", residenceTaxRequired: false},
        directors: {article: "Article 17", standalone: true, scope: "pengurus atau komisaris perusahaan yang resident Indonesia"},
        entertainer: {article: "Article 18", sourceTax: true, exception: null, exceptionText: "Tidak ada cultural/public-fund exception yang dimodelkan pada Article 18 pilot Belanda."},
        pension: {article: "Article 19", pensionRule: "sourceMayTax", annuityRule: "sourceMayTax", socialSecurityRule: "sourceMayTax", maxRate: null, note: "Pensions, similar remuneration, annuities, lump sums in lieu of annuity, dan social security payments yang arising di Indonesia dapat dipajaki Indonesia."},
        government: {article: "Article 20", salaryRule: "sourceMayTaxWithNationalResidenceException", pensionRule: "sourceMayTaxWithNationalResidenceException", businessFallback: true},
        teacher: {article: "Article 21", standalone: true, maxYears: 2, requiresFirstVisit: false, requiresGovernmentInvitation: false, requiresResidenceTax: false, privateBenefitException: false, institutionText: "university, college, school, other educational institution, atau non-commercial/non-industrial research institute", note: "Individual yang sojourn tidak melebihi dua tahun untuk teaching pada institution atau research institute yang memenuhi treaty tidak dikenai pajak negara kunjungan atas pembayaran kegiatan tersebut."}
      },
      audit: {
        status: "reviewed",
        label: "Audit rule Belanda selesai",
        reviewedAt: "17 Agustus 2026",
        basis: "P3B Indonesia–Belanda 2002 + Protocol 2015 sebagaimana dimodifikasi MLI + PMK 112/2025",
        modeled: ["Article 4 dual-resident entity MAP", "Article 5 service/project/agent/insurance PE + MLI anti-fragmentation & splitting-up", "Article 7 limited force of attraction + Protocol attribution/expense rules", "Article 10 Dividends & BPT", "Article 11 Interest", "Article 12 Royalties", "Article 14 Capital Gains", "Article 15–21 personal income", "MLI Principal Purposes Test"],
        gaps: ["Article 8 Shipping & Aircraft belum menjadi modul transaksi tersendiri", "Article 13 limitation untuk international organisations/diplomatic or consular missions negara ketiga belum menjadi input khusus", "Article 22 Students belum dimodelkan", "Article 23 Other Income belum menjadi modul tersendiri", "Article 25 Offshore Activities (30-day special regime) belum dihitung otomatis"]
      },
      notes: {
        dividend: "Protocol 2015 memberi 5% untuk beneficial owner berbentuk company (selain partnership) yang memiliki langsung sekurang-kurangnya 25% capital dan memenuhi MLI 365-day holding period; 10% untuk qualifying pension fund; 15% untuk kasus lainnya.",
        interest: "Tarif umum 10%; 5% untuk pinjaman lebih dari 2 tahun atau penjualan kredit equipment industrial/commercial/scientific; pembebasan tertentu berlaku bagi pemerintah/otoritas yang memenuhi treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 12. Article 12(3) mengecualikan furnishing of technical services dari definisi royalti; klasifikasi kontrak teknis/konsultasi tetap harus dibaca bersama Protocol dan fakta transaksi.",
        service: "Article 7 memberikan hak pemajakan kepada negara domisili kecuali enterprise memiliki PE di Indonesia. Bila PE ada, Article 7 juga memuat limited force of attraction untuk sales/transaksi bisnis sejenis, sedangkan Protocol membatasi atribusi pada actual activity PE dan bagian kontrak yang benar-benar dilaksanakan PE."
      }
    },
    Australia: {
      label: "Australia",
      source: {label: "DJP — P3B Indonesia–Australia (Modified by MLI)", url: "https://www.pajak.go.id/id/p3b/mli-australia"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5", capitalGain: "Article 13", independentPersonal: "Article 14", employment: "Article 15", directorsFee: "Article 16"},
      dividend: {general: 15, direct: null, minOwnership: null, holdingRule: null},
      interest: {general: 10, governmentExemption: true, governmentScope: "officialReserve"},
      royalty: {ip: 15, media: 15, equipment: 10, knowhow: 10},
      branchProfit: {rate: 15, label: "Branch Profit Tax treaty", pscException: true, pscArticle: "Article 10(7)", pscRateParagraph: "Article 10(6)", pscText: "Batas additional tax 15% dalam Article 10(6) tidak memengaruhi rate additional tax yang payable berdasarkan production sharing contracts, contracts of work, atau kontrak sejenis terkait oil, gas, atau mineral products sebagaimana Article 10(7)."},
      businessProfits: {
        forceAttraction: true,
        forceAttractionText: "Article 7(1) mencakup laba yang dapat diatribusikan kepada PE, sales di Indonesia atas goods/merchandise of the same or similar kind, serta other business activities of the same or similar kind seperti yang dijalankan melalui PE.",
        headOfficeChargeRestriction: true,
        headOfficeExpenseText: "Article 7(3) membolehkan executive/general administrative expenses yang incurred untuk PE, tetapi tidak mengakui intra-office royalties, fees/commissions untuk specific services atau management, dan interest selain banking enterprise, kecuali reimbursement actual expenses.",
        insuranceDomesticLawRule: true
      },
      capitalGain: {
        immovable: "indonesiaMayTax", peAsset: "indonesiaMayTax", shipsAircraft: "residenceOnly", ordinaryOther: "domesticLawMayTax",
        shares: {ordinary: "domesticLawMayTax", listedIndonesia: "domesticLawMayTax", propertyRichRule: "australia-principal-365"},
        note: "Article 13: real property dan business property PE dapat dipajaki negara tempat aset/PE berada. Property-rich shares/comparable interests dapat dipajaki Indonesia, dengan MLI menerapkan pengujian nilai pada suatu waktu dalam 365 hari sebelum pengalihan dan memperluas cakupan ke comparable interests seperti partnership/trust interests. Paragraph 5 mempertahankan penerapan hukum domestik untuk harta lain yang tidak tercakup paragraf sebelumnya."
      },
      projectRule: {
        threshold: "lebih dari 120 hari",
        appliesTo: ["construction","installation","assembly","supervision","naturalResource"],
        wording: "building site, construction/installation/assembly project atau supervisory activities terkait proyek yang berlangsung lebih dari 120 hari; installation/drilling rig/ship untuk natural resources juga menggunakan batas >120 hari",
        mliAggregation: true,
        aggregationAppliesTo: ["construction","installation","assembly","supervision"],
        aggregationBase: "aktivitas enterprise sendiri pada site/proyek berlangsung agregat >30 hari tetapi belum melewati 120 hari",
        aggregationRelated: "connected activities pada site/proyek yang sama oleh closely related enterprise, masing-masing >30 hari, ditambahkan untuk menguji batas 120 hari",
        note: "Article 5(2)(h) dan (i) menetapkan >120 hari untuk natural-resource installation/rig/ship dan project/supervisory PE. MLI Article 14 menerapkan splitting-up of contracts untuk building site/project dan supervisory activities terkait."
      },
      pe: {
        fixedPlace: true,
        antiFragmentation: true,
        serviceRule: {kind: "days", threshold: 120, wording: "lebih dari 120 hari dalam periode 12 bulan untuk proyek yang sama atau terhubung", appliesTo: ["general","consultancy","technical"]},
        agentRule: "manufacture-authority-stock-delivery",
        agentManufactureProcessing: true,
        agentStockDelivery: true,
        independentAgentAlmostWholly: true,
        agentPrincipalRole: false,
        note: "Article 5 mencakup natural-resource installation/rig/ship >120 hari; project/supervisory PE >120 hari; furnishing of services termasuk consultancy untuk same/connected project >120 hari dalam 12 bulan; dependent agent melalui manufacture/processing, contract authority, atau habitual stock-and-delivery. MLI Option A dan anti-fragmentation berlaku pada specific activity exemptions."
      },
      personal: {
        independent: {article: "Article 14", presenceRule: "lebih dari 120 hari dalam setiap periode 12 bulan", triggerText: "Apakah masa berada di Indonesia melebihi 120 hari dalam setiap periode 12 bulan?"},
        employment: {article: "Article 15", dayRule: "tidak melebihi 120 hari dalam setiap periode 12 bulan", dayQuestion: "Apakah keberadaan di Indonesia tidak melebihi 120 hari dalam setiap periode 12 bulan?", residenceTaxRequired: true},
        directors: {article: "Article 16", standalone: true, scope: "member of the board of directors atau similar organ perusahaan resident Indonesia"},
        entertainer: {article: "Article 17", sourceTax: true, exception: "culturalFunds", exceptionText: "Income exempt di negara kegiatan bila aktivitas dilakukan under cultural agreement/arrangement dan visit wholly atau substantially supported oleh funds negara lain/local authority/public institution."},
        pension: {article: "Article 18", pensionRule: "sourceMayTaxCapped", annuityRule: "sourceMayTaxCapped", socialSecurityRule: "review", maxRate: 15, note: "Pensions (termasuk government pensions) dan annuities dari sumber Indonesia dapat dipajaki Indonesia, maksimum 15% gross, walaupun juga taxable di negara residence."},
        government: {article: "Article 19", salaryRule: "sourceOnlyWithResidenceException", pensionRule: "pensionArticle18", businessFallback: true},
        teacher: {article: "Article 20", standalone: true, maxYears: 2, requiresFirstVisit: false, requiresGovernmentInvitation: false, requiresResidenceTax: true, privateBenefitException: true, institutionText: "university, college, school, atau other educational institution", residenceQuestion: "Apakah penerima merupakan resident Australia ketika melakukan kunjungan sementara ke Indonesia untuk tujuan teaching, advanced study, atau research?", note: "Article 20 memberi exemption di negara kunjungan untuk professor/teacher yang resident negara partner dan berkunjung tidak melebihi dua tahun untuk teaching/advanced study/research pada educational institution, sepanjang remuneration subject to tax di negara residence. Research primarily for private benefit tidak memperoleh exemption."}
      },
      audit: {
        status: "reviewed",
        label: "Audit rule Australia selesai",
        reviewedAt: "17 Agustus 2026",
        basis: "P3B Indonesia–Australia sebagaimana dimodifikasi MLI + PMK 112/2025",
        modeled: ["Article 4 dual-resident entity MLI/MAP", "Article 5 fixed place, service/project PE, MLI splitting-up, anti-fragmentation, manufacture/processing agent, authority agent, stock-delivery agent", "Article 7 force of attraction dan head-office charge limitations", "Article 10 dividend dan BPT/PSC exception", "Article 11 Interest", "Article 12 Royalties", "Article 13 Capital Gains + MLI 365-day property-rich rule", "Articles 14–20 personal income termasuk Professors and Teachers", "MLI Principal Purposes Test melalui treaty-purpose eligibility"],
        gaps: ["Article 7(7) special domestic-law rule untuk insurance premiums belum menjadi modul tersendiri", "Article 8 Ships and Aircraft belum menjadi modul income tersendiri", "Article 21 Students belum menjadi modul tersendiri", "Article 22 Income Not Expressly Mentioned belum menjadi modul tersendiri", "Article 28 historical Zone of Cooperation clause tidak dimodelkan sebagai transaction module"]
      },
      notes: {
        dividend: "Tarif maksimum 15% atas jumlah bruto dividen; Article 10 tidak memberikan direct-participation rate yang lebih rendah. Article 10(6) membatasi additional tax atas profits PE menjadi 15%, subject to Article 10(7) untuk PSC/Contract of Work tertentu.",
        interest: "Tarif umum 10%. Pengecualian berlaku untuk interest dari investasi official foreign exchange reserve assets oleh pemerintah/monetary institutions/bank yang menjalankan fungsi central banking.",
        royalty: "10% untuk penggunaan equipment dan supply of scientific/technical/industrial/commercial knowledge atau information (serta bantuan tertentu yang ancillary); 15% untuk kategori royalti lainnya.",
        service: "Article 7 mengalokasikan business profits ke negara domisili kecuali enterprise menjalankan usaha melalui permanent establishment di Indonesia. Bila PE ada, Indonesia dapat memajaki laba yang attributable kepada PE dan limited force-of-attraction items yang disebut Article 7(1)."
      }
    }
  }
};
