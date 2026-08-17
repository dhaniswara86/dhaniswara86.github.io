window.KABAYAN_TREATY_DATA = {
  version: "pilot-2026-08-17",
  reviewedAt: "17 Agustus 2026",
  domestic: {
    rate: 20,
    label: "PPh Pasal 26 — tarif domestik umum",
    source: {
      label: "DJP — PPh Pasal 26",
      url: "https://www.pajak.go.id/id/kredit-pajak"
    }
  },
  commonSources: [
    {label: "PMK 112 Tahun 2025 — Tata Cara Penerapan P3B", url: "https://jdih.kemenkeu.go.id/dok/pmk-112-tahun-2025"},
    {label: "Form DGT — PMK 112 Tahun 2025", url: "https://www.pajak.go.id/sites/default/files/2026-01/Form%20DGT%20-%20PMK%20112%20Tahun%202025_0.pdf"}
  ],
  treaties: {
    Singapore: {
      label: "Singapura",
      source: {label: "DJP — P3B Indonesia–Singapura", url: "https://www.pajak.go.id/id/p3b/mli-singapura"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "capital", holdingRule: null},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 8, knowhow: 8},
      notes: {
        dividend: "Tarif 10% untuk beneficial owner berbentuk perusahaan yang memiliki langsung sekurang-kurangnya 25% modal perusahaan pembayar; selain itu 15%.",
        interest: "Tarif umum 10%. Terdapat pembebasan tertentu untuk pemerintah dan entitas pemerintah yang memenuhi definisi treaty.",
        royalty: "10% untuk hak cipta/paten/merek/desain/model/rencana/formula/proses; 8% untuk penggunaan equipment atau informasi/know-how industrial, commercial, atau scientific."
      }
    },
    Japan: {
      label: "Jepang",
      source: {label: "DJP — P3B Indonesia–Jepang (Modified by MLI)", url: "https://www.pajak.go.id/id/p3b/mli-Jepang"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "voting shares", holdingRule: "japan12m"},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      notes: {
        dividend: "Tarif 10% jika beneficial owner adalah perusahaan yang memiliki sekurang-kurangnya 25% voting shares selama 12 bulan segera sebelum akhir periode akuntansi yang labanya dibagikan; selain itu 15%.",
        interest: "Tarif umum 10%. Pengecualian tersedia untuk pemerintah, bank sentral, dan institusi tertentu yang memenuhi definisi treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 12."
      }
    },
    "United States": {
      label: "Amerika Serikat",
      source: {label: "DJP — P3B Indonesia–Amerika Serikat", url: "https://www.pajak.go.id/id/p3b/mli-amerikaserikat"},
      articles: {dividend: "Article 11", interest: "Article 12", royalty: "Article 13"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "voting stock", holdingRule: null},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      notes: {
        dividend: "Tarif 10% jika beneficial owner adalah perusahaan yang memiliki langsung sekurang-kurangnya 25% voting stock; selain itu 15%.",
        interest: "Tarif umum 10%. Terdapat pengecualian untuk pemerintah, bank sentral, dan financial institution milik/dikendalikan pemerintah sesuai treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 13."
      }
    },
    Netherlands: {
      label: "Belanda",
      source: {label: "DJP — P3B Indonesia–Belanda (Protocol & MLI)", url: "https://www.pajak.go.id/id/p3b/mli-belanda"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12"},
      dividend: {general: 15, direct: 5, minOwnership: 25, ownershipType: "capital", holdingRule: "nl365"},
      interest: {general: 10, longTerm: 5, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      notes: {
        dividend: "Protocol memberi 5% untuk perusahaan (selain partnership) dengan kepemilikan langsung sekurang-kurangnya 25%; MLI mensyaratkan kondisi kepemilikan dipenuhi sepanjang periode 365 hari yang mencakup hari pembayaran. Tarif lain termasuk 15% untuk kasus umum.",
        interest: "Tarif umum 10%; 5% untuk pinjaman lebih dari 2 tahun atau penjualan kredit equipment industrial/commercial/scientific; pembebasan tertentu berlaku bagi pemerintah/otoritas yang memenuhi treaty.",
        royalty: "Tarif maksimum 10% atas jumlah bruto royalti yang memenuhi definisi Article 12."
      }
    },
    Australia: {
      label: "Australia",
      source: {label: "DJP — P3B Indonesia–Australia (Modified by MLI)", url: "https://pajak.go.id/id/p3b/mli-australia"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12"},
      dividend: {general: 15, direct: null, minOwnership: null, holdingRule: null},
      interest: {general: 10, governmentExemption: true, governmentScope: "officialReserve"},
      royalty: {ip: 15, media: 15, equipment: 10, knowhow: 10},
      notes: {
        dividend: "Tarif maksimum 15% atas jumlah bruto dividen; treaty tidak memberikan tarif direct participation yang lebih rendah pada Article 10.",
        interest: "Tarif umum 10%. Pengecualian berlaku untuk interest dari investasi official foreign exchange reserve assets oleh pemerintah/monetary institutions/bank yang menjalankan fungsi central banking.",
        royalty: "10% untuk penggunaan equipment dan supply of scientific/technical/industrial/commercial knowledge atau information (serta bantuan tertentu yang ancillary); 15% untuk kategori royalti lainnya."
      }
    }
  }
};
