(() => {
  "use strict";

  const MAX_QUESTIONS = 15;
  const MAX_BEFORE_VALIDATION = MAX_QUESTIONS - 1;

  const common = {
    category: "PEMERIKSAAN INTI",
    help: "Tidak perlu memasukkan nominal. Pilih kondisi yang paling sesuai.",
  };

  const a = (label, flag, extra = {}) => ({ label, flag, ...extra });

  const questions = {
    profile_source: {
      category: "PROFIL PENGHASILAN",
      text: "Sumber penghasilan apa yang Anda miliki selama tahun pajak ini?",
      help: "Pilih semua yang sesuai, lalu tekan Lanjutkan.",
      type: "multi",
      profile: true,
      answers: [
        a("Gaji dari satu pemberi kerja", null, { value: "single_employer" }),
        a("Gaji dari beberapa pemberi kerja", null, { value: "multiple_employers" }),
        a("Usaha", null, { value: "business" }),
        a("Pekerjaan bebas atau profesi", null, { value: "professional" }),
        a("Sewa atau penggunaan harta", null, { value: "property_income" }),
        a("Investasi atau aset digital", null, { value: "investment" }),
        a("Penjualan atau pengalihan harta", null, { value: "asset_disposal" }),
        a("Penghasilan dari luar negeri", null, { value: "foreign" }),
        a("Penghasilan lainnya", null, { value: "other" }),
        a("Belum yakin", "U", { value: "unknown", essentialUnknown: true }),
      ],
    },
    profile_family: {
      category: "PROFIL KELUARGA",
      text: "Bagaimana kondisi perkawinan Anda pada tahun pajak ini?",
      help: "Pilih kondisi pada akhir tahun pajak atau kondisi yang paling relevan selama tahun berjalan.",
      profile: true,
      answers: [
        a("Belum menikah", null, { value: "single" }),
        a("Menikah dan hidup bersama", null, { value: "married_together" }),
        a("Hidup berpisah berdasarkan putusan hakim", null, { value: "court_separated" }),
        a("Cerai atau pasangan meninggal dalam tahun pajak", "A", { value: "changed_during_year" }),
        a("Belum yakin", "U", { value: "unknown", essentialUnknown: true }),
      ],
      mitigation: "Pastikan kondisi perkawinan dan status kewajiban pajak keluarga sesuai dengan data administrasi perpajakan.",
    },
    family_obligation: {
      category: "PROFIL KELUARGA",
      text: "Bagaimana kewajiban perpajakan suami-istri dijalankan?",
      help: "Jawaban digunakan untuk memetakan indikasi KK, PH, atau MT.",
      profile: true,
      answers: [
        a("Digabung sebagai satu kesatuan", null, { value: "joined" }),
        a("Terpisah karena perjanjian pemisahan harta dan penghasilan", null, { value: "separate_agreement" }),
        a("Istri memilih menjalankan kewajiban pajak sendiri", null, { value: "separate_elected" }),
        a("Belum memahami status kewajiban pajak keluarga", "U", { value: "unknown", essentialUnknown: true }),
      ],
      mitigation: "Konfirmasi apakah status keluarga termasuk KK, PH, MT, atau HB sebelum menyusun SPT.",
    },
    family_unit_admin: {
      category: "PROFIL KELUARGA",
      text: "Apakah data pasangan sudah tercantum dengan benar dalam Unit Keluarga di Coretax?",
      help: "Pertanyaan ini ditampilkan karena kewajiban pajak dipilih untuk digabung.",
      profile: true,
      answers: [
        a("Sudah tercantum dan datanya sesuai", "V", { value: "complete" }),
        a("Sudah tercantum, tetapi terdapat data yang perlu diperbaiki", "A", { value: "needs_fix" }),
        a("Belum tercantum", "R", { value: "missing" }),
        a("Belum pernah diperiksa", "U", { value: "unchecked" }),
      ],
      mitigation: "Periksa dan perbarui data Unit Keluarga sebelum menyampaikan SPT.",
    },
    filing_status: {
      category: "PROFIL PELAPORAN",
      text: "Apa kondisi SPT yang sedang Anda periksa?",
      help: "Pilih kondisi yang paling sesuai untuk tahun pajak ini.",
      profile: true,
      answers: [
        a("SPT normal untuk pertama kali", "V", { value: "normal" }),
        a("SPT pembetulan", "A", { value: "amendment" }),
        a("SPT tahun sebelumnya belum disampaikan", "R", { value: "prior_unfiled" }),
        a("Belum mengetahui status SPT", "U", { value: "unknown", essentialUnknown: true }),
      ],
      mitigation: "Periksa riwayat pelaporan dan pastikan jenis SPT yang akan disampaikan sudah tepat.",
    },

    income_complete: {
      ...common,
      domain: "Kelengkapan penghasilan",
      text: "Apakah seluruh penghasilan yang Anda terima selama tahun pajak sudah dimasukkan dalam SPT?",
      answers: [
        a("Sudah diperiksa dan seluruhnya telah dilaporkan", "V"),
        a("Sepertinya sudah, tetapi belum direkonsiliasi", "U"),
        a("Ada penghasilan yang belum diketahui perlakuan pajaknya", "A"),
        a("Ada penghasilan yang diketahui belum dimasukkan", "M"),
      ],
      mitigation: "Petakan seluruh sumber penghasilan dan masukkan ke bagian SPT yang tepat.",
    },
    data_match: {
      ...common,
      domain: "Kesesuaian data",
      text: "Apakah penghasilan dalam SPT sudah dicocokkan dengan bukti potong dan data yang tersedia di Coretax?",
      answers: [
        a("Sudah dicocokkan dan sesuai", "V"),
        a("Ada perbedaan, tetapi sudah dapat dijelaskan dan didukung dokumen", "V"),
        a("Belum selesai dicocokkan", "U"),
        a("Ada perbedaan yang belum dapat dijelaskan", "R"),
      ],
      mitigation: "Cocokkan penghasilan dalam SPT dengan seluruh bukti potong dan data yang tersedia di Coretax.",
    },
    classification: {
      ...common,
      domain: "Klasifikasi penghasilan",
      text: "Apakah setiap penghasilan sudah ditempatkan sebagai penghasilan biasa, final, atau bukan objek pajak secara tepat?",
      answers: [
        a("Sudah diperiksa dan diklasifikasikan dengan benar", "V"),
        a("Ada bagian yang belum saya pahami", "U"),
        a("Ada bagian yang masih perlu diperbaiki", "A"),
        a("Diketahui terdapat penghasilan yang salah diklasifikasikan", "M"),
      ],
      mitigation: "Periksa dasar perlakuan setiap penghasilan sebelum menentukan kategori pajaknya.",
    },
    tax_credit: {
      ...common,
      domain: "Kredit pajak",
      text: "Apakah seluruh kredit pajak yang diklaim dalam SPT memiliki bukti potong atau bukti pembayaran yang sesuai?",
      answers: [
        a("Seluruhnya sesuai", "V"),
        a("Ada bukti potong yang belum diklaim", "A"),
        a("Belum selesai dicocokkan", "U"),
        a("Ada kredit pajak yang diklaim tanpa bukti yang sesuai", "M"),
      ],
      mitigation: "Cocokkan setiap kredit pajak dengan bukti potong atau bukti pembayaran yang sah.",
    },
    asset_changes: {
      ...common,
      domain: "Perubahan harta",
      text: "Apakah penambahan, penjualan, atau pengurangan harta dapat dijelaskan dan didukung dokumen?",
      answers: [
        a("Seluruh perubahan dapat dijelaskan", "V"),
        a("Sumber dananya jelas, tetapi dokumennya belum lengkap", "A"),
        a("Belum dibandingkan dengan SPT tahun sebelumnya", "U"),
        a("Ada perubahan harta yang belum dapat dijelaskan", "M"),
      ],
      mitigation: "Rekonsiliasi perubahan harta dengan sumber dana dan dokumen pengalihan yang relevan.",
    },
    debt: {
      ...common,
      domain: "Utang dan sumber dana",
      text: "Apakah saldo utang serta dana yang berasal dari utang dapat dibuktikan?",
      answers: [
        a("Tidak memiliki utang", "V"),
        a("Memiliki utang dan bukti pendukungnya lengkap", "V"),
        a("Bukti utang atau arus dananya hanya tersedia sebagian", "A"),
        a("Saldo atau sumber dana utang belum dapat dijelaskan", "R"),
      ],
      mitigation: "Lengkapi bukti saldo utang, identitas pihak terkait, dan arus dana penerimaan utang.",
    },
    economic_capacity: {
      ...common,
      domain: "Kemampuan ekonomi",
      text: "Apakah penghasilan, biaya hidup, cicilan, dan perubahan harta sudah direkonsiliasi?",
      answers: [
        a("Sudah dan hasilnya konsisten", "V"),
        a("Ada selisih yang dapat dijelaskan dan didukung dokumen", "V"),
        a("Belum pernah direkonsiliasi", "U"),
        a("Terdapat selisih material yang belum dapat dijelaskan", "M"),
      ],
      mitigation: "Susun rekonsiliasi penghasilan, biaya hidup, cicilan, dan perubahan kekayaan.",
    },

    employee_multi: {
      category: "LANJUTAN · PEGAWAI",
      domain: "Beberapa pemberi kerja",
      text: "Apakah seluruh bukti potong dari setiap pemberi kerja sudah digabungkan dalam SPT?",
      help: "Gabungkan seluruh bukti potong untuk melihat penghitungan pajak selama satu tahun.",
      answers: [
        a("Seluruhnya sudah digabungkan", "V"),
        a("Sudah digabungkan, tetapi belum dihitung ulang", "U"),
        a("Belum memperoleh seluruh bukti potong", "A"),
        a("Hanya sebagian bukti potong yang dimasukkan", "M"),
      ],
      mitigation: "Kumpulkan seluruh bukti potong dari setiap pemberi kerja dan hitung kembali penghasilan setahun.",
    },
    employee_move: {
      category: "LANJUTAN · PEGAWAI",
      domain: "Perpindahan kerja",
      text: "Apakah Anda berpindah pemberi kerja selama tahun pajak?",
      help: "Pilih kondisi bukti potong dari seluruh pemberi kerja.",
      answers: [
        a("Tidak", "V"),
        a("Ya, dan seluruh bukti potong sudah diperhitungkan", "V"),
        a("Ya, tetapi belum selesai mencocokkan seluruh bukti potong", "U"),
        a("Ya, dan terdapat bukti potong yang belum dimasukkan", "M"),
      ],
      mitigation: "Pastikan bukti potong sebelum dan sesudah perpindahan kerja telah diperhitungkan.",
    },
    employee_other: {
      category: "LANJUTAN · PEGAWAI",
      domain: "Penghasilan pegawai lainnya",
      text: "Selain gaji rutin, apakah bonus, honorarium, tunjangan, atau penghasilan lain dari pekerjaan sudah diperiksa?",
      help: "Periksa penghasilan yang tidak selalu muncul dalam gaji rutin.",
      answers: [
        a("Tidak menerima penghasilan lainnya", "V"),
        a("Menerima dan seluruhnya sudah diperiksa", "V"),
        a("Menerima, tetapi belum yakin perlakuan pajaknya", "U"),
        a("Menerima dan terdapat penghasilan yang belum dimasukkan", "M"),
      ],
      mitigation: "Inventarisasi bonus, honorarium, tunjangan, dan penghasilan pekerjaan lainnya.",
    },

    business_turnover: {
      category: "LANJUTAN · USAHA",
      domain: "Rekonsiliasi omzet",
      text: "Apakah omzet usaha sudah dicocokkan dengan penerimaan kas, rekening, QRIS, dan marketplace?",
      help: "Pisahkan penerimaan usaha dari transfer atau dana lain yang bukan omzet.",
      answers: [
        a("Sudah direkonsiliasi dan sesuai", "V"),
        a("Ada selisih non-omzet yang dapat dibuktikan", "V"),
        a("Belum selesai direkonsiliasi", "U"),
        a("Ada penerimaan usaha yang belum dicatat sebagai omzet", "M"),
      ],
      mitigation: "Rekonsiliasi penjualan, kas, rekening, QRIS, dan marketplace untuk memastikan omzet lengkap.",
    },
    business_method: {
      category: "LANJUTAN · USAHA",
      domain: "Metode penghitungan",
      text: "Apakah Anda sudah mengetahui metode penghitungan pajak yang digunakan untuk penghasilan usaha?",
      help: "Contohnya pembukuan, pencatatan, PPh Final, atau tarif umum.",
      answers: [
        a("Sudah dan telah diperiksa kesesuaiannya", "V"),
        a("Menggunakan PPh Final dan sudah memeriksa persyaratannya", "V"),
        a("Belum yakin apakah menggunakan PPh Final atau tarif umum", "U"),
        a("Menggunakan metode yang diketahui tidak sesuai", "M"),
      ],
      mitigation: "Pastikan metode penghitungan penghasilan usaha sesuai dengan kondisi dan ketentuan yang berlaku.",
    },
    business_cost: {
      category: "LANJUTAN · USAHA",
      domain: "Biaya usaha",
      text: "Apakah biaya yang dikurangkan berhubungan dengan usaha dan memiliki bukti pendukung?",
      help: "Biaya pribadi perlu dipisahkan dari biaya kegiatan usaha.",
      answers: [
        a("Seluruh biaya sudah diperiksa", "V"),
        a("Ada biaya yang buktinya belum lengkap", "A"),
        a("Belum memisahkan biaya usaha dan biaya pribadi", "R"),
        a("Diketahui terdapat biaya pribadi yang dibebankan sebagai biaya usaha", "M"),
      ],
      mitigation: "Pisahkan biaya pribadi dan lengkapi bukti biaya yang berkaitan dengan kegiatan usaha.",
    },
    business_balance: {
      category: "LANJUTAN · USAHA",
      domain: "Data usaha akhir tahun",
      text: "Apakah persediaan, piutang, utang, dan aset usaha sudah dicatat secara konsisten pada akhir tahun?",
      help: "Pemeriksaan ini membantu menemukan perbedaan antartahun.",
      answers: [
        a("Sudah diperiksa dan konsisten", "V"),
        a("Ada perbedaan kecil yang dapat dijelaskan", "A"),
        a("Belum dilakukan pemeriksaan", "U"),
        a("Terdapat perbedaan material yang belum dapat dijelaskan", "R"),
      ],
      mitigation: "Cocokkan persediaan, piutang, utang, dan aset usaha dengan catatan akhir tahun.",
    },

    professional_receipts: {
      category: "LANJUTAN · PEKERJAAN BEBAS",
      domain: "Penerimaan profesi",
      text: "Apakah seluruh penerimaan dari pekerjaan bebas sudah direkonsiliasi dengan rekening dan bukti potong?",
      help: "Termasuk penerimaan yang tidak disertai bukti potong.",
      answers: [
        a("Sudah dan seluruhnya sesuai", "V"),
        a("Ada selisih yang dapat dijelaskan", "V"),
        a("Belum selesai direkonsiliasi", "U"),
        a("Ada penerimaan yang belum dimasukkan", "M"),
      ],
      mitigation: "Rekonsiliasi seluruh penerimaan profesi dengan rekening dan bukti potong.",
    },
    professional_method: {
      category: "LANJUTAN · PEKERJAAN BEBAS",
      domain: "Pembukuan atau NPPN",
      text: "Metode apa yang Anda gunakan untuk menghitung penghasilan neto pekerjaan bebas?",
      help: "Pilih metode yang benar-benar digunakan selama tahun pajak.",
      answers: [
        a("Pembukuan yang diselenggarakan secara konsisten", "V"),
        a("Norma Penghitungan Penghasilan Neto atau NPPN", "V", { value: "nppn" }),
        a("Belum yakin metode yang digunakan", "U"),
        a("Tidak menggunakan pembukuan maupun metode yang jelas", "R"),
      ],
      mitigation: "Pastikan metode penghitungan penghasilan neto dan kewajiban administrasinya sudah tepat.",
    },
    professional_nppn: {
      category: "LANJUTAN · PEKERJAAN BEBAS",
      domain: "Pemberitahuan NPPN",
      text: "Jika menggunakan NPPN, apakah pemberitahuannya telah disampaikan sesuai ketentuan?",
      help: "Tampilkan bukti penyampaian ketika melakukan pemeriksaan dokumen.",
      answers: [
        a("Sudah disampaikan", "V"),
        a("Sedang memastikan bukti penyampaiannya", "U"),
        a("Belum disampaikan", "R"),
        a("Tidak mengetahui adanya pemberitahuan NPPN", "U"),
      ],
      mitigation: "Periksa kewajiban dan bukti pemberitahuan penggunaan NPPN.",
    },
    professional_cost: {
      category: "LANJUTAN · PEKERJAAN BEBAS",
      domain: "Biaya pekerjaan bebas",
      text: "Apakah biaya yang dikurangkan berhubungan dengan pekerjaan bebas dan didukung bukti?",
      help: "Biaya pribadi perlu dipisahkan dari biaya pekerjaan bebas.",
      answers: [
        a("Seluruhnya sudah diperiksa", "V"),
        a("Ada biaya dengan bukti belum lengkap", "A"),
        a("Belum memisahkan biaya pekerjaan dan pribadi", "R"),
        a("Terdapat biaya pribadi yang dimasukkan sebagai pengurang", "M"),
      ],
      mitigation: "Pisahkan biaya pribadi dan lengkapi bukti biaya pekerjaan bebas.",
    },

    investment_income: {
      category: "LANJUTAN · INVESTASI",
      domain: "Penghasilan investasi",
      text: "Apakah dividen, bunga, saham, obligasi, reksa dana, atau aset digital sudah diperiksa perlakuan pajaknya?",
      help: "Perlakuannya dapat berbeda menurut jenis penghasilan dan transaksinya.",
      answers: [
        a("Tidak memiliki penghasilan tersebut", "V"),
        a("Memiliki dan seluruhnya sudah diperiksa", "V"),
        a("Memiliki, tetapi belum memahami seluruh perlakuannya", "U"),
        a("Memiliki penghasilan yang belum dilaporkan", "M"),
      ],
      mitigation: "Petakan setiap jenis investasi atau aset digital dan periksa perlakuan pajaknya.",
    },
    property_transfer: {
      category: "LANJUTAN · HARTA",
      domain: "Sewa dan pengalihan harta",
      text: "Apakah penghasilan dari sewa atau penjualan harta sudah diperiksa dan dilaporkan?",
      help: "Termasuk tanah, bangunan, kendaraan, atau harta lainnya.",
      answers: [
        a("Tidak memiliki transaksi tersebut", "V"),
        a("Memiliki dan seluruhnya sudah diperiksa", "V"),
        a("Memiliki, tetapi belum yakin perlakuan pajaknya", "U"),
        a("Memiliki transaksi yang belum dimasukkan", "M"),
      ],
      mitigation: "Periksa penghasilan dan dokumen atas sewa atau pengalihan setiap harta.",
    },
    gift_inheritance: {
      category: "LANJUTAN · HARTA",
      domain: "Hibah dan warisan",
      text: "Apakah Anda menerima hibah, warisan, bantuan, atau pemberian lainnya selama tahun pajak?",
      help: "Dokumen dan hubungan para pihak dapat memengaruhi perlakuannya.",
      answers: [
        a("Tidak", "V"),
        a("Ya, dan perlakuan serta dokumennya sudah diperiksa", "V"),
        a("Ya, tetapi belum memahami perlakuannya", "U"),
        a("Ya, dan belum dicantumkan atau belum tersedia dokumennya", "R"),
      ],
      mitigation: "Periksa dasar penerimaan serta siapkan dokumen hibah, warisan, bantuan, atau pemberian.",
    },
    disposed_assets: {
      category: "LANJUTAN · HARTA",
      domain: "Harta yang dialihkan",
      text: "Apakah harta yang telah dijual, dihibahkan, atau dialihkan sudah disesuaikan dalam daftar harta?",
      help: "Bandingkan daftar harta dengan SPT tahun sebelumnya.",
      answers: [
        a("Tidak terdapat pengalihan harta", "V"),
        a("Sudah disesuaikan dan dokumennya tersedia", "V"),
        a("Sudah disesuaikan, tetapi dokumennya belum lengkap", "A"),
        a("Harta yang dialihkan masih tercantum tanpa penjelasan", "R"),
      ],
      mitigation: "Sesuaikan daftar harta dan simpan dokumen penjualan, hibah, atau pengalihan.",
    },

    foreign_assets: {
      category: "LANJUTAN · LUAR NEGERI",
      domain: "Aset luar negeri",
      text: "Apakah Anda memiliki rekening, investasi, atau aset lain di luar negeri?",
      help: "Kepemilikan aset dipisahkan dari penerimaan penghasilan luar negeri.",
      answers: [
        a("Tidak", "V"),
        a("Ya, dan seluruhnya sudah dicantumkan", "V"),
        a("Ya, tetapi belum yakin cara mencantumkannya", "U"),
        a("Ya, dan belum dicantumkan", "R"),
      ],
      mitigation: "Inventarisasi rekening, investasi, dan aset luar negeri serta periksa pelaporannya.",
    },
    foreign_income: {
      category: "LANJUTAN · LUAR NEGERI",
      domain: "Penghasilan luar negeri",
      text: "Apakah Anda menerima penghasilan dari luar negeri selama tahun pajak?",
      help: "Termasuk penghasilan yang diterima atau disimpan di luar Indonesia.",
      answers: [
        a("Tidak", "V"),
        a("Ya, dan seluruhnya sudah dilaporkan", "V"),
        a("Ya, tetapi belum yakin perlakuan pajaknya", "U"),
        a("Ya, dan terdapat penghasilan yang belum dilaporkan", "M"),
      ],
      mitigation: "Petakan dan periksa seluruh penghasilan yang berasal dari luar negeri.",
    },
    foreign_tax: {
      category: "LANJUTAN · LUAR NEGERI",
      domain: "Pajak luar negeri",
      text: "Jika terdapat pajak yang dibayar atau dipotong di luar negeri, apakah kredit pajaknya sudah dihitung dan didukung bukti?",
      help: "Pilih jawaban pertama jika tidak terdapat pajak luar negeri.",
      answers: [
        a("Tidak terdapat pajak luar negeri", "V"),
        a("Ada dan seluruh penghitungannya sudah diperiksa", "V"),
        a("Ada, tetapi belum selesai dihitung", "U"),
        a("Kredit pajak diklaim tanpa bukti yang memadai", "M"),
      ],
      mitigation: "Periksa penghitungan kredit pajak luar negeri dan lengkapi bukti pembayarannya.",
    },
    foreign_documents: {
      category: "LANJUTAN · LUAR NEGERI",
      domain: "Dokumen luar negeri",
      text: "Apakah dokumen penghasilan dan pajak luar negeri telah tersedia dan nilainya dikonversi secara konsisten?",
      help: "Gunakan dokumen yang dapat ditelusuri kembali.",
      answers: [
        a("Dokumen lengkap dan nilai sudah diperiksa", "V"),
        a("Dokumen tersedia sebagian", "A"),
        a("Belum dilakukan pemeriksaan", "U"),
        a("Tidak tersedia dokumen pendukung", "R"),
      ],
      mitigation: "Lengkapi dokumen luar negeri dan periksa dasar konversi nilainya.",
    },

    family_income: {
      category: "LANJUTAN · KELUARGA",
      domain: "Penghasilan pasangan",
      text: "Apakah penghasilan pasangan sudah diperlakukan sesuai status kewajiban pajak keluarga?",
      help: "Periksa berdasarkan kondisi dan status kewajiban pajak suami-istri.",
      answers: [
        a("Pasangan tidak memiliki penghasilan", "V"),
        a("Sudah diperiksa dan dilaporkan sesuai status keluarga", "V"),
        a("Belum yakin perlakuannya", "U"),
        a("Ada penghasilan pasangan yang belum diperhitungkan", "M"),
      ],
      mitigation: "Periksa penghasilan pasangan berdasarkan status kewajiban pajak keluarga.",
    },
    family_data: {
      category: "LANJUTAN · KELUARGA",
      domain: "Data pasangan",
      text: "Apakah harta, utang, serta bukti potong pasangan sudah dicantumkan pada SPT atau akun yang tepat?",
      help: "Periksa pula kesesuaian data pasangan di Coretax.",
      answers: [
        a("Sudah diperiksa dan sesuai", "V"),
        a("Ada data yang perlu diperbaiki", "A"),
        a("Belum pernah diperiksa", "U"),
        a("Diketahui terdapat data pasangan yang belum dilaporkan", "R"),
      ],
      mitigation: "Cocokkan harta, utang, dan bukti potong pasangan dengan SPT serta akun yang tepat.",
    },

    final_coverage: {
      category: "VALIDASI AKHIR",
      domain: "Kelengkapan asesmen",
      text: "Apakah masih ada penghasilan, aset, utang, atau transaksi yang belum tercakup dalam pertanyaan sebelumnya?",
      help: "Jawaban jujur membantu mencegah hasil yang terlalu optimistis.",
      validation: true,
      answers: [
        a("Tidak, seluruh kondisi utama sudah tercakup", "V", { value: "complete" }),
        a("Ada kondisi lain dan saya memahami perlakuannya", "A", { value: "other_understood" }),
        a("Ada kondisi yang belum saya pahami", "U", { value: "other_unclear", coverageUnknown: true }),
        a("Saya tidak yakin informasi yang diberikan sudah lengkap", "U", { value: "incomplete", coverageUnknown: true }),
      ],
      mitigation: "Lakukan pemeriksaan lanjutan atas kondisi yang belum tercakup atau belum dipahami.",
    },
  };

  const icons = {
    profile_source: "briefcase", profile_family: "family", family_obligation: "family",
    family_unit_admin: "family", filing_status: "document", income_complete: "wallet",
    data_match: "document", classification: "tag", tax_credit: "document",
    asset_changes: "home", debt: "document", economic_capacity: "scale",
    employee_multi: "building", employee_move: "building", employee_other: "wallet",
    business_turnover: "store", business_method: "store", business_cost: "store", business_balance: "store",
    professional_receipts: "briefcase", professional_method: "briefcase", professional_nppn: "document", professional_cost: "briefcase",
    investment_income: "wallet", property_transfer: "home", gift_inheritance: "home", disposed_assets: "home",
    foreign_assets: "globe", foreign_income: "globe", foreign_tax: "globe", foreign_documents: "globe",
    family_income: "family", family_data: "family", final_coverage: "check",
  };

  const svg = {
    briefcase: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5h8v2M3 12h18M10 12v2h4v-2"/></svg>',
    family: '<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M13 16c.9-1 2.1-1.5 3.8-1.5 2.8 0 4.3 1.8 4.7 5.5"/></svg>',
    document: '<svg viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 15l2 2 5-5"/></svg>',
    wallet: '<svg viewBox="0 0 24 24"><path d="M4 7h15a2 2 0 0 1 2 2v9H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13"/><path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z"/></svg>',
    tag: '<svg viewBox="0 0 24 24"><path d="m3 12 9-9h7l2 2v7l-9 9Z"/><circle cx="16.5" cy="7.5" r="1"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v9H7v-9M16 4h4v4"/><path d="M10 15h4m-2-2v4"/></svg>',
    scale: '<svg viewBox="0 0 24 24"><path d="M12 3v18M5 7h14M4 7l-3 6h6L4 7Zm16 0-3 6h6l-3-6ZM8 21h8"/></svg>',
    building: '<svg viewBox="0 0 24 24"><path d="M3 21V7h8v14M13 21V3h8v18M6 10h2m-2 4h2m-2 4h2m10-11h-2m2 4h-2m2 4h-2M2 21h20"/></svg>',
    store: '<svg viewBox="0 0 24 24"><path d="M4 10v11h16V10M3 4h18l-1 6a3 3 0 0 1-4 1 3 3 0 0 1-4 0 3 3 0 0 1-4 0 3 3 0 0 1-4-1L3 4Z"/><path d="M8 21v-6h8v6"/></svg>',
    globe: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m4 12 5 5L20 6"/><circle cx="12" cy="12" r="10"/></svg>',
  };

  const coreIds = [
    "income_complete", "data_match", "classification", "tax_credit",
    "asset_changes", "debt", "economic_capacity",
  ];

  const branchCatalog = {
    employee: ["employee_other", "employee_move"],
    employeeMulti: ["employee_multi", "employee_move", "employee_other"],
    business: ["business_turnover", "business_method", "business_cost", "business_balance"],
    professional: ["professional_receipts", "professional_method", "professional_cost", "professional_nppn"],
    investment: ["investment_income", "property_transfer", "gift_inheritance", "disposed_assets"],
    foreign: ["foreign_assets", "foreign_income", "foreign_tax", "foreign_documents"],
    family: ["family_income", "family_data"],
  };

  function answerValues(answers, id) {
    const value = answers[id];
    if (!value) return [];
    return Array.isArray(value.values) ? value.values : value.value ? [value.value] : [];
  }

  function profileIds(answers) {
    const ids = ["profile_source", "profile_family"];
    if (answers.profile_family?.value === "married_together") {
      ids.push("family_obligation");
      if (answers.family_obligation?.value === "joined") ids.push("family_unit_admin");
    }
    ids.push("filing_status");
    return ids;
  }

  function relevantBranchGroups(answers) {
    const sources = answerValues(answers, "profile_source");
    const groups = [];
    if (sources.includes("multiple_employers")) groups.push(branchCatalog.employeeMulti);
    else if (sources.includes("single_employer")) groups.push(branchCatalog.employee);
    if (sources.includes("business")) groups.push(branchCatalog.business);
    if (sources.includes("professional")) {
      const professionalGroup = ["professional_receipts", "professional_method"];
      if (answers.professional_method?.value === "nppn") professionalGroup.push("professional_nppn");
      professionalGroup.push("professional_cost");
      groups.push(professionalGroup);
    }
    if (["property_income", "investment", "asset_disposal", "other"].some((item) => sources.includes(item))) groups.push(branchCatalog.investment);
    if (sources.includes("foreign")) groups.push(branchCatalog.foreign);
    if (["married_together", "court_separated", "changed_during_year"].includes(answers.profile_family?.value)) groups.push(branchCatalog.family);
    return groups;
  }

  function selectRoundRobin(groups, limit) {
    const picked = [];
    for (let round = 0; picked.length < limit; round += 1) {
      let added = false;
      groups.forEach((group) => {
        if (picked.length >= limit || !group[round]) return;
        if (!picked.includes(group[round])) picked.push(group[round]);
        added = true;
      });
      if (!added) break;
    }
    return picked;
  }

  function buildSequence(answers) {
    const profiles = profileIds(answers);
    const base = [...profiles, ...coreIds];
    const branchLimit = Math.max(0, MAX_BEFORE_VALIDATION - base.length);
    const groups = relevantBranchGroups(answers);
    const branches = selectRoundRobin(groups, branchLimit);
    return [...base, ...branches, "final_coverage"];
  }

  function coverageLimited(answers) {
    const profiles = profileIds(answers);
    const branchLimit = Math.max(0, MAX_BEFORE_VALIDATION - profiles.length - coreIds.length);
    const groups = relevantBranchGroups(answers);
    return groups.length > branchLimit;
  }

  const severity = { V: 0, A: 1, U: 2, R: 3, M: 4 };

  function scoredItems(answers, activeIds = buildSequence(answers)) {
    return activeIds
      .filter((id) => answers[id] && questions[id])
      .map((id) => ({ id, question: questions[id], answer: answers[id] }))
      .filter((item) => item.answer.flag && severity[item.answer.flag] !== undefined);
  }

  function evaluateAnswers(answers) {
    const activeIds = buildSequence(answers);
    const items = scoredItems(answers, activeIds);
    const counts = items.reduce((acc, item) => {
      acc[item.answer.flag] += 1;
      return acc;
    }, { V: 0, A: 0, U: 0, R: 0, M: 0 });
    const essentialUnknown = activeIds.some((id) => answers[id]?.essentialUnknown);
    const userCoverageUnknown = Boolean(answers.final_coverage?.coverageUnknown);
    const limited = coverageLimited(answers);
    const incomplete = activeIds.some((id) => !answers[id]);

    let level = "low";
    if (counts.M >= 2 || (counts.M >= 1 && counts.R >= 1)) level = "veryHigh";
    else if (counts.M >= 1 || counts.R >= 2) level = "high";
    else if (counts.R >= 1 || counts.A >= 2 || counts.U >= 2) level = "medium";

    const strongFinding = counts.M > 0 || counts.R > 0;
    if ((essentialUnknown || userCoverageUnknown || limited || incomplete) && !strongFinding) level = "unknown";

    const ranked = items
      .filter((item) => severity[item.answer.flag] > 0)
      .sort((x, y) => severity[y.answer.flag] - severity[x.answer.flag]);

    return { level, counts, ranked, activeIds, limited, essentialUnknown, userCoverageUnknown, incomplete };
  }

  const engine = { questions, buildSequence, evaluateAnswers, coverageLimited, MAX_QUESTIONS };
  if (typeof module !== "undefined" && module.exports) module.exports = engine;
  if (typeof document === "undefined") return;

  const $ = (selector) => document.querySelector(selector);
  const state = { index: 0, answers: {}, transitionTimer: null, locked: false };
  const screens = { start: $("#start-screen"), question: $("#question-screen"), result: $("#result-screen") };
  const continueButton = $("#continue-button");
  const footnote = $(".question-footnote");

  const levelInfo = {
    unknown: {
      title: "Belum Dapat Dinilai", color: "#59657b", tint: "#eef2f7", icon: "assets/img/risiko-belum-dinilai.webp",
      summary: "Informasi yang tersedia belum cukup untuk menghasilkan tingkat risiko yang dapat diandalkan.",
    },
    low: {
      title: "Rendah", color: "#157463", tint: "#eaf6f2", icon: "assets/img/risiko-rendah.webp",
      summary: "Jawaban menunjukkan kondisi relatif konsisten. Tetap lakukan pemeriksaan akhir terhadap dokumen sumber.",
    },
    medium: {
      title: "Menengah", color: "#a46c0b", tint: "#fff6dc", icon: "assets/img/risiko-menengah.webp",
      summary: "Terdapat bagian yang belum diperiksa atau masih memerlukan perbaikan dan dokumen pendukung.",
    },
    high: {
      title: "Tinggi", color: "#cf530c", tint: "#fff0e7", icon: "assets/img/risiko-tinggi.webp",
      summary: "Ditemukan ketidaksesuaian yang dapat memengaruhi kelengkapan atau ketepatan pelaporan SPT.",
    },
    veryHigh: {
      title: "Sangat Tinggi", color: "#ad1028", tint: "#fdecef", icon: "assets/img/risiko-sangat-tinggi.webp",
      summary: "Ditemukan beberapa ketidaksesuaian material yang perlu segera direkonsiliasi dan didukung dokumen.",
    },
  };

  function showScreen(name) {
    Object.entries(screens).forEach(([key, element]) => { element.hidden = key !== name; });
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      if (name === "question") $("#question-text")?.focus({ preventScroll: true });
      if (name === "result") $("#result-level")?.focus({ preventScroll: true });
    }, 60);
  }

  function clearTransition() {
    if (state.transitionTimer) window.clearTimeout(state.transitionTimer);
    state.transitionTimer = null;
    state.locked = false;
  }

  function pruneInactiveAnswers() {
    const active = new Set(buildSequence(state.answers));
    Object.keys(state.answers).forEach((id) => {
      if (!active.has(id)) delete state.answers[id];
    });
  }

  function goNext() {
    clearTransition();
    state.index += 1;
    pruneInactiveAnswers();
    renderQuestion();
  }

  function scheduleNext() {
    if (state.locked) return;
    state.locked = true;
    document.querySelectorAll(".answer-option").forEach((button) => { button.disabled = true; });
    state.transitionTimer = window.setTimeout(goNext, 180);
  }

  function renderQuestion() {
    clearTransition();
    const ids = buildSequence(state.answers);
    if (state.index >= ids.length) return showResult();

    const id = ids[state.index];
    const question = questions[id];
    const saved = state.answers[id];
    const current = state.index + 1;
    const total = ids.length;
    const percent = Math.round((current / total) * 100);

    $("#question-category").textContent = question.category;
    $("#question-icon").innerHTML = svg[icons[id]] || svg.document;
    $("#question-text").textContent = question.text;
    $("#question-help").textContent = question.help || common.help;
    $("#question-counter").textContent = `Pertanyaan ${current} dari ${total}`;
    $(".progress-label span:last-child").textContent = `Maksimal ${MAX_QUESTIONS}`;
    $("#progress-bar").style.width = `${percent}%`;
    $(".progress-track").setAttribute("aria-valuenow", String(current));
    $(".progress-track").setAttribute("aria-valuemax", String(total));
    $("#back-button").disabled = state.index === 0;
    $("#back-button").style.opacity = state.index === 0 ? ".35" : "1";

    const list = $("#answer-list");
    list.innerHTML = "";
    list.onkeydown = null;
    list.setAttribute("role", question.type === "multi" ? "group" : "radiogroup");
    if (question.type === "multi") list.setAttribute("aria-multiselectable", "true");
    else list.removeAttribute("aria-multiselectable");
    footnote.textContent = question.type === "multi"
      ? "Pilih semua yang sesuai, kemudian tekan Lanjutkan."
      : "Pilih jawaban yang paling menggambarkan kondisi Anda saat ini.";
    continueButton.hidden = question.type !== "multi";

    question.answers.forEach((answer, answerIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-option";
      const selected = question.type === "multi"
        ? Boolean(saved?.values?.includes(answer.value))
        : saved?.answerIndex === answerIndex;
      button.classList.toggle("selected", selected);
      button.innerHTML = `<span class="radio-dot" aria-hidden="true"></span><span>${answer.label}</span>`;

      if (question.type === "multi") {
        button.setAttribute("aria-pressed", selected ? "true" : "false");
        button.addEventListener("click", () => toggleMultiAnswer(id, answer, button));
      } else {
        button.setAttribute("role", "radio");
        button.setAttribute("aria-checked", selected ? "true" : "false");
        button.tabIndex = selected || (!saved && answerIndex === 0) ? 0 : -1;
        button.addEventListener("click", () => chooseAnswer(id, answer, answerIndex));
      }
      list.appendChild(button);
    });

    if (question.type === "multi") {
      continueButton.disabled = !saved?.values?.length;
    } else {
      list.onkeydown = (event) => {
        if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
        event.preventDefault();
        const buttons = [...list.querySelectorAll('.answer-option')];
        const currentIndex = Math.max(0, buttons.indexOf(document.activeElement));
        const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
        const nextIndex = (currentIndex + direction + buttons.length) % buttons.length;
        buttons.forEach((item, index) => { item.tabIndex = index === nextIndex ? 0 : -1; });
        buttons[nextIndex].focus();
      };
    }

    window.setTimeout(() => $("#question-text")?.focus({ preventScroll: true }), 30);
  }

  function toggleMultiAnswer(id, answer, button) {
    const current = state.answers[id] || { values: [], selections: [] };
    const isUnknown = answer.value === "unknown";
    let selections = [...current.selections];

    if (isUnknown) {
      selections = current.values.includes("unknown") ? [] : [answer];
    } else {
      selections = selections.filter((item) => item.value !== "unknown");
      if (answer.value === "single_employer") selections = selections.filter((item) => item.value !== "multiple_employers");
      if (answer.value === "multiple_employers") selections = selections.filter((item) => item.value !== "single_employer");
      const exists = selections.some((item) => item.value === answer.value);
      selections = exists
        ? selections.filter((item) => item.value !== answer.value)
        : [...selections, answer];
    }

    if (selections.length) {
      state.answers[id] = {
        values: selections.map((item) => item.value),
        selections,
        flag: selections.some((item) => item.flag === "U") ? "U" : null,
        essentialUnknown: selections.some((item) => item.essentialUnknown),
      };
    } else {
      delete state.answers[id];
    }

    pruneInactiveAnswers();
    document.querySelectorAll(".answer-option").forEach((item, index) => {
      const selected = Boolean(state.answers[id]?.values?.includes(questions[id].answers[index].value));
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    continueButton.disabled = !state.answers[id]?.values?.length;
    button.focus();
  }

  function chooseAnswer(id, answer, answerIndex) {
    if (state.locked) return;
    state.answers[id] = { ...answer, answerIndex };
    pruneInactiveAnswers();
    document.querySelectorAll(".answer-option").forEach((item, index) => {
      item.classList.toggle("selected", index === answerIndex);
      item.setAttribute("aria-checked", index === answerIndex ? "true" : "false");
    });
    scheduleNext();
  }

  function showResult() {
    clearTransition();
    pruneInactiveAnswers();
    const result = evaluateAnswers(state.answers);
    const info = levelInfo[result.level];
    const hero = $("#result-hero");
    hero.style.setProperty("--result-color", info.color);
    hero.style.setProperty("--result-tint", info.tint);
    document.documentElement.style.setProperty("--result-color", info.color);
    $("#result-level").textContent = info.title;
    $("#result-summary").textContent = info.summary;
    $("#result-icon").src = info.icon;
    $("#result-icon").alt = `Ikon hasil ${info.title.toLowerCase()}`;

    const triggers = result.ranked.slice(0, 4);
    let triggerTexts = triggers.map((item) => `${item.question.domain || item.question.category}: ${item.answer.label}.`);
    if (result.limited) triggerTexts.unshift("Profil memiliki lebih banyak cabang daripada yang dapat diperiksa dalam asesmen singkat ini.");
    if (!triggerTexts.length) triggerTexts = [
      "Tidak ditemukan ketidaksesuaian material berdasarkan jawaban yang diberikan.",
      "Tetap cocokkan SPT dengan dokumen sumber sebelum dilaporkan.",
    ];
    $("#trigger-list").innerHTML = triggerTexts.slice(0, 4).map((text) => `<li>${text}</li>`).join("");

    const actions = [...new Set(triggers.map((item) => item.question.mitigation).filter(Boolean))];
    if (result.essentialUnknown || result.userCoverageUnknown || result.limited) {
      actions.unshift("Lengkapi profil dan periksa kondisi yang belum tercakup sebelum mengandalkan hasil asesmen.");
    } else if (result.counts.U > 0) {
      actions.unshift("Periksa dokumen atas jawaban yang belum pasti agar hasil dapat dikonfirmasi.");
    }
    if (!actions.length) actions.push(
      "Lakukan pemeriksaan akhir atas bukti potong dan seluruh penghasilan.",
      "Bandingkan daftar harta dan utang dengan SPT tahun sebelumnya.",
      "Simpan dokumen pendukung secara teratur."
    );
    $("#action-list").innerHTML = actions.slice(0, 4).map((text) => `<li>${text}</li>`).join("");
    showScreen("result");
  }

  function resetAssessment(target = "start") {
    clearTransition();
    state.index = 0;
    state.answers = {};
    showScreen(target);
    if (target === "question") renderQuestion();
  }

  $("#start-button").addEventListener("click", () => resetAssessment("question"));
  $("#nav-start-button").addEventListener("click", () => resetAssessment("question"));
  $("#mobile-start-button").addEventListener("click", () => {
    $("#mobileNavToggle").checked = false;
    resetAssessment("question");
  });
  $("#back-button").addEventListener("click", () => {
    clearTransition();
    if (state.index > 0) {
      state.index -= 1;
      renderQuestion();
    }
  });
  continueButton.addEventListener("click", () => {
    const id = buildSequence(state.answers)[state.index];
    if (questions[id]?.type === "multi" && state.answers[id]?.values?.length) goNext();
  });
  $("#print-button").addEventListener("click", () => window.print());
  $("#restart-button").addEventListener("click", () => resetAssessment("start"));
  $("#currentYear").textContent = new Date().getFullYear();
})();
