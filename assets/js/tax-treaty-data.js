window.KABAYAN_TREATY_DATA = {
  version: "pilot-v3-2026-08-17",
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
    {label: "DJP — Penerapan P3B", url: "https://pajak.go.id/id/penerapan-persetujuan-penghindaran-pajak-berganda-p3b"}
  ],
  treaties: {
    Singapore: {
      label: "Singapura",
      source: {label: "DJP — P3B Indonesia–Singapura", url: "https://www.pajak.go.id/id/p3b/mli-singapura"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "capital", holdingRule: null},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 8, knowhow: 8},
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "days", threshold: 90, wording: "lebih dari 90 hari dalam periode 12 bulan", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentPrincipalRole: false,
        note: "Article 5 mencakup fixed place PE dan furnishing of services, termasuk consultancy, jika kegiatan di suatu negara berlangsung secara agregat lebih dari 90 hari dalam periode 12 bulan."
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
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "voting shares", holdingRule: "japan12m"},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "months", threshold: 6, wording: "lebih dari 6 bulan dalam suatu taxable year untuk proyek yang sama atau proyek-proyek yang terhubung", appliesTo: ["consultancy","supervision"]},
        agentRule: "mli-principal-role",
        agentPrincipalRole: true,
        note: "Article 5(5) secara khusus mencakup consultancy services atau supervisory services terkait building/construction/installation project yang berlangsung lebih dari enam bulan dalam taxable year. Jasa umum lain tidak otomatis masuk duration test ini; fixed place dan agent PE tetap perlu diuji."
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
      articles: {dividend: "Article 11", interest: "Article 12", royalty: "Article 13", service: "Article 8", pe: "Article 5"},
      dividend: {general: 15, direct: 10, minOwnership: 25, ownershipType: "voting stock", holdingRule: null},
      interest: {general: 10, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "days-us", threshold: 120, wording: "lebih dari 120 hari dalam suatu periode 12 bulan berturut-turut; dengan proviso khusus taxable year 30 hari", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentPrincipalRole: false,
        note: "Article 5(2)(j) mencakup furnishing of services bila kegiatan untuk proyek yang sama atau terhubung berlanjut lebih dari 120 hari dalam periode 12 bulan berturut-turut, dengan proviso bahwa PE tidak ada pada taxable year ketika jasa di negara tersebut kurang dari 30 hari pada taxable year itu."
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
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5"},
      dividend: {general: 15, direct: 5, minOwnership: 25, ownershipType: "capital", holdingRule: "nl365"},
      interest: {general: 10, longTerm: 5, governmentExemption: true},
      royalty: {ip: 10, media: 10, equipment: 10, knowhow: 10},
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "months", threshold: 3, wording: "lebih dari 3 bulan dalam periode 12 bulan untuk proyek yang sama atau terhubung", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentPrincipalRole: false,
        note: "Article 5(3)(b) mencakup furnishing of services, termasuk consultancy services, jika kegiatan untuk proyek yang sama atau terhubung berlangsung secara agregat lebih dari tiga bulan dalam periode 12 bulan."
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
      source: {label: "DJP — P3B Indonesia–Australia (Modified by MLI)", url: "https://pajak.go.id/sites/default/files/2025-05/Tax%20Treaty%20Australia%20%28Modified%20by%20MLI%29%20-%20EN.pdf"},
      articles: {dividend: "Article 10", interest: "Article 11", royalty: "Article 12", service: "Article 7", pe: "Article 5"},
      dividend: {general: 15, direct: null, minOwnership: null, holdingRule: null},
      interest: {general: 10, governmentExemption: true, governmentScope: "officialReserve"},
      royalty: {ip: 15, media: 15, equipment: 10, knowhow: 10},
      pe: {
        fixedPlace: true,
        serviceRule: {kind: "days", threshold: 120, wording: "lebih dari 120 hari dalam periode 12 bulan untuk proyek yang sama atau terhubung", appliesTo: ["general","consultancy","technical","supervision"]},
        agentRule: "authority",
        agentPrincipalRole: false,
        note: "Article 5(2)(j) mencakup furnishing of services, termasuk consultancy, bila jasa untuk proyek yang sama atau terhubung dilakukan di suatu negara lebih dari 120 hari dalam periode 12 bulan."
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
