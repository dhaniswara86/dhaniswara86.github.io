const incomeData = {
  usaha: {
    label: "Usaha",
    items: [
      {
        id: "usaha-umkm",
        label: "Berjualan atau menjalankan usaha kecil",
        title: "Usaha dengan peredaran bruto tertentu",
        status: "conditional",
        badge: "PERLU CEK KONDISI",
        summary: "Tarif PPh Final 0,5% dapat digunakan jika seluruh kriteria terpenuhi. Bagi orang pribadi, bagian peredaran bruto usaha sampai Rp500 juta dalam satu Tahun Pajak tidak dikenai PPh Final.",
        rate: "0,5% atas bagian omzet yang dikenai pajak",
        payment: "Disetor sendiri atau dipotong/dipungut pihak lain sesuai transaksi",
        spt: "Laporkan omzet dan PPh Final pada bagian penghasilan final",
        check: "Jenis kegiatan, jumlah omzet setahun, penggabungan omzet, pilihan tarif umum, dan apakah kegiatan termasuk pekerjaan bebas.",
        documents: ["Rekap omzet bulanan", "Bukti setor", "Bukti potong/pungut", "Surat keterangan bila diperlukan"],
        legal: "Rujukan: PP 55 Tahun 2022 sebagaimana diubah dengan PP 20 Tahun 2026."
      },
      {
        id: "usaha-bebas",
        label: "Praktik profesi atau pekerjaan bebas",
        title: "Penghasilan dari pekerjaan bebas",
        status: "regular",
        badge: "PPh TIDAK FINAL",
        summary: "Penghasilan dokter, konsultan, akuntan, notaris, pengacara, arsitek, pekerja seni, pemberi jasa perantara, dan pekerjaan bebas lainnya tidak otomatis dapat memakai PPh Final UMKM.",
        rate: "Tarif umum atas penghasilan kena pajak",
        payment: "Pemotongan dapat menjadi kredit pajak; kekurangan dibayar melalui SPT",
        spt: "Gabungkan dengan penghasilan tidak final lainnya",
        check: "Klasifikasi pekerjaan bebas, penggunaan pembukuan atau NPPN, biaya yang dapat dikurangkan, dan bukti potong yang diterima.",
        documents: ["Bukti potong", "Pencatatan penerimaan", "Daftar biaya", "Pemberitahuan NPPN bila digunakan"],
        legal: "Rujukan: UU PPh dan PP 20 Tahun 2026."
      },
      {
        id: "usaha-konstruksi",
        label: "Mengerjakan jasa konstruksi",
        title: "Penghasilan dari usaha jasa konstruksi",
        status: "final",
        badge: "PPh FINAL",
        summary: "Usaha jasa konstruksi mempunyai rezim PPh Final tersendiri. Tarifnya ditentukan oleh jenis jasa dan kepemilikan sertifikat badan usaha atau sertifikat kompetensi kerja.",
        rate: "1,75% sampai 6% sesuai jenis jasa dan sertifikasi",
        payment: "Dipotong pengguna jasa tertentu atau disetor sendiri",
        spt: "Laporkan penghasilan dan pajaknya sebagai penghasilan final",
        check: "Apakah termasuk pekerjaan, pekerjaan terintegrasi, atau konsultansi konstruksi serta validitas sertifikat penyedia jasa.",
        documents: ["Kontrak", "Sertifikat kompetensi/usaha", "Berita acara", "Bukti potong/setor"],
        legal: "Rujukan: PP 51 Tahun 2008 sebagaimana terakhir diubah dengan PP 9 Tahun 2022."
      }
    ]
  },
  properti: {
    label: "Properti",
    items: [
      {
        id: "properti-jual",
        label: "Menjual tanah atau bangunan",
        title: "Pengalihan hak atas tanah dan/atau bangunan",
        status: "final",
        badge: "PPh FINAL",
        summary: "Penghasilan dari penjualan atau pengalihan hak atas tanah dan/atau bangunan pada umumnya dikenai PPh Final.",
        rate: "Umumnya 2,5% dari nilai bruto pengalihan",
        payment: "Pada umumnya disetor sendiri sebelum dokumen pengalihan ditandatangani",
        spt: "Laporkan nilai pengalihan dan PPh Finalnya",
        check: "Jenis pengalihan, nilai yang menjadi dasar pajak, tarif rumah sederhana, dan kemungkinan pengecualian atau tarif 0%.",
        documents: ["Akta/perjanjian", "Bukti setor", "Dokumen kepemilikan", "Dokumen pengecualian bila ada"],
        legal: "Rujukan: PP 34 Tahun 2016."
      },
      {
        id: "properti-sewa",
        label: "Menyewakan rumah, ruko, apartemen, atau tanah",
        title: "Persewaan tanah dan/atau bangunan",
        status: "final",
        badge: "PPh FINAL",
        summary: "Penghasilan dari persewaan tanah dan/atau bangunan dikenai PPh Final dari jumlah bruto nilai persewaan, termasuk pembayaran terkait fasilitas tertentu.",
        rate: "10% dari jumlah bruto nilai sewa",
        payment: "Dipotong penyewa yang merupakan pemotong; selain itu disetor sendiri pemilik",
        spt: "Laporkan penghasilan sewa dan PPh Finalnya",
        check: "Apakah objek benar-benar tanah/bangunan, unsur biaya tambahan dalam sewa, serta status penyewa sebagai pemotong pajak.",
        documents: ["Perjanjian sewa", "Bukti pembayaran", "Bukti potong/setor", "Rincian biaya terkait sewa"],
        legal: "Rujukan: PP 34 Tahun 2017."
      },
      {
        id: "properti-kos",
        label: "Menjalankan rumah kos",
        title: "Penghasilan dari rumah kos",
        status: "conditional",
        badge: "PERLU CEK KONDISI",
        summary: "Usaha rumah kos tidak boleh langsung disamakan dengan persewaan tanah dan bangunan. Bentuk kegiatan, layanan, dan skema usahanya perlu diperiksa.",
        rate: "Bergantung pada karakter kegiatan dan skema pajak yang memenuhi syarat",
        payment: "Dapat disetor sendiri sesuai rezim pajak yang berlaku",
        spt: "Laporkan sesuai klasifikasi penghasilannya",
        check: "Jumlah kamar, layanan yang diberikan, bentuk pengusahaan, omzet setahun, dan kelayakan menggunakan PPh Final usaha.",
        documents: ["Rekap penerimaan", "Daftar layanan", "Perjanjian penghuni", "Bukti setor/potong"],
        legal: "Rujukan: UU PPh dan ketentuan PPh atas wajib pajak dengan peredaran bruto tertentu."
      },
      {
        id: "properti-aset-lain",
        label: "Menyewakan kendaraan atau peralatan",
        title: "Persewaan harta selain tanah dan bangunan",
        status: "regular",
        badge: "TIDAK OTOMATIS FINAL",
        summary: "Sewa kendaraan, mesin, dan peralatan bukan objek PPh Final persewaan tanah dan bangunan. Pemotongannya dapat menjadi pajak tidak final.",
        rate: "Mengikuti ketentuan umum sesuai jenis transaksi dan pihak penerima",
        payment: "Dapat dipotong pihak penyewa atau diperhitungkan sendiri",
        spt: "Gabungkan sebagai penghasilan tidak final",
        check: "Jenis harta, pihak penyewa, adanya hubungan usaha, serta pasal dan kode objek pada bukti potong.",
        documents: ["Perjanjian sewa", "Bukti potong", "Daftar penerimaan", "Dokumen kepemilikan aset"],
        legal: "Rujukan: UU PPh dan ketentuan pemotongan PPh yang relevan."
      }
    ]
  },
  investasi: {
    label: "Tabungan & investasi",
    items: [
      {
        id: "investasi-deposito",
        label: "Menerima bunga deposito atau tabungan",
        title: "Bunga deposito dan tabungan",
        status: "final",
        badge: "PPh FINAL",
        summary: "Bunga deposito dan tabungan pada umumnya telah dipotong PPh Final oleh bank sebelum hasilnya diterima nasabah.",
        rate: "Umumnya 20% dari jumlah bruto bunga",
        payment: "Dipotong oleh bank atau pihak pembayar",
        spt: "Laporkan bunga bruto dan PPh Finalnya",
        check: "Jumlah pokok simpanan, jenis produk, dan apakah memenuhi salah satu pengecualian.",
        documents: ["Rekening koran", "Bukti potong", "Laporan bunga tahunan"],
        legal: "Rujukan: ketentuan PPh Final atas bunga deposito, tabungan, dan diskonto SBI."
      },
      {
        id: "investasi-obligasi",
        label: "Menerima bunga atau diskonto obligasi",
        title: "Bunga dan diskonto obligasi",
        status: "final",
        badge: "PPh FINAL",
        summary: "Bunga atau diskonto obligasi yang diterima wajib pajak dalam negeri pada umumnya dikenai PPh Final.",
        rate: "Umumnya 10% dari dasar pengenaan yang relevan",
        payment: "Dipotong oleh penerbit, kustodian, atau pihak yang ditunjuk",
        spt: "Laporkan sebagai penghasilan final",
        check: "Apakah penghasilan berupa kupon, diskonto obligasi berkupon, atau diskonto obligasi tanpa bunga.",
        documents: ["Laporan kustodian", "Bukti potong", "Konfirmasi transaksi"],
        legal: "Rujukan: PP 91 Tahun 2021."
      },
      {
        id: "investasi-saham",
        label: "Menjual saham melalui bursa",
        title: "Penjualan saham di bursa efek",
        status: "final",
        badge: "PPh FINAL",
        summary: "PPh Final dihitung dari nilai bruto penjualan saham, bukan dari laba atau keuntungan bersih investor.",
        rate: "0,1% dari jumlah bruto nilai transaksi penjualan",
        payment: "Dipungut melalui penyelenggara bursa/perantara transaksi",
        spt: "Laporkan nilai bruto penjualan dan PPh Final",
        check: "Apakah transaksi benar-benar melalui bursa dan apakah saham termasuk saham pendiri.",
        documents: ["Trade confirmation", "Laporan broker", "Rekap penjualan", "Bukti pungut"],
        legal: "Rujukan: PP 41 Tahun 1994 sebagaimana diubah dengan PP 14 Tahun 1997."
      },
      {
        id: "investasi-dividen",
        label: "Menerima dividen dari perusahaan Indonesia",
        title: "Dividen dalam negeri bagi orang pribadi",
        status: "conditional",
        badge: "PERLU CEK INVESTASI",
        summary: "Dividen dapat dikecualikan dari objek pajak apabila diinvestasikan di Indonesia serta memenuhi syarat waktu, bentuk investasi, dan pelaporan. Bagian yang tidak memenuhi syarat dapat terutang PPh Final.",
        rate: "10% atas dividen yang tidak memenuhi pengecualian",
        payment: "Disetor sendiri oleh penerima untuk bagian yang terutang",
        spt: "Laporkan sebagai bukan objek atau penghasilan final sesuai hasil pengujian",
        check: "Jumlah yang diinvestasikan, bentuk investasi, batas waktu, masa penahanan, dan laporan realisasi investasi.",
        documents: ["Bukti penerimaan dividen", "Bukti investasi", "Laporan realisasi investasi", "Bukti setor bila terutang"],
        legal: "Rujukan: UU PPh dan PMK 18/PMK.03/2021."
      }
    ]
  },
  hadiah: {
    label: "Hadiah & pemberian",
    items: [
      {
        id: "hadiah-undian",
        label: "Memenangkan hadiah undian",
        title: "Hadiah undian",
        status: "final",
        badge: "PPh FINAL",
        summary: "Hadiah yang diperoleh melalui undian dikenai PPh Final, baik diberikan dalam bentuk uang maupun barang.",
        rate: "25% dari jumlah bruto nilai hadiah",
        payment: "Dipotong atau dipungut oleh penyelenggara undian",
        spt: "Laporkan nilai hadiah dan PPh Finalnya",
        check: "Pastikan mekanisme pemberian benar-benar undian dan nilai hadiah barang telah ditentukan dengan tepat.",
        documents: ["Surat pemenang", "Bukti potong", "Dokumen nilai hadiah", "Berita acara penyerahan"],
        legal: "Rujukan: PP 132 Tahun 2000."
      },
      {
        id: "hadiah-lomba",
        label: "Menerima hadiah perlombaan atau penghargaan",
        title: "Hadiah perlombaan dan penghargaan",
        status: "regular",
        badge: "BUKAN PPh FINAL UNDIAN",
        summary: "Hadiah perlombaan atau penghargaan tidak otomatis diperlakukan sebagai hadiah undian. Pajaknya mengikuti jenis penerima dan hubungan hadiah dengan kegiatan.",
        rate: "Mengikuti ketentuan umum yang relevan",
        payment: "Dapat dipotong oleh pemberi hadiah sebagai pajak tidak final",
        spt: "Gabungkan dengan penghasilan tidak final lainnya",
        check: "Mekanisme memperoleh hadiah, status penerima, dan apakah hadiah berkaitan dengan pekerjaan, kegiatan, atau usaha.",
        documents: ["Bukti potong", "Pengumuman lomba", "Bukti penerimaan", "Dokumen penilaian hadiah"],
        legal: "Rujukan: UU PPh dan ketentuan pemotongan atas hadiah/penghargaan."
      },
      {
        id: "hadiah-hibah",
        label: "Menerima hibah atau bantuan",
        title: "Hibah, bantuan, atau sumbangan",
        status: "exempt",
        badge: "DAPAT BUKAN OBJEK",
        summary: "Hibah, bantuan, atau sumbangan dapat dikecualikan dari objek pajak apabila memenuhi hubungan para pihak dan persyaratan yang ditentukan.",
        rate: "Tidak dikenai PPh jika seluruh syarat pengecualian terpenuhi",
        payment: "Tidak ada PPh apabila benar-benar memenuhi pengecualian",
        spt: "Laporkan pada bagian penghasilan bukan objek pajak",
        check: "Hubungan pemberi dan penerima, adanya hubungan usaha/pekerjaan/kepemilikan/penguasaan, serta kesesuaian dokumen.",
        documents: ["Akta atau surat hibah", "Bukti hubungan", "Dokumen pengalihan", "Bukti nilai harta"],
        legal: "Rujukan: UU PPh dan ketentuan pelaksanaan mengenai bantuan, sumbangan, dan hibah."
      }
    ]
  },
  pekerjaan: {
    label: "Pekerjaan",
    items: [
      {
        id: "pekerjaan-gaji",
        label: "Menerima gaji dan tunjangan",
        title: "Gaji dan tunjangan pegawai",
        status: "regular",
        badge: "PPh TIDAK FINAL",
        summary: "PPh Pasal 21 yang dipotong atas gaji pegawai pada umumnya bukan pajak final. Penghasilan dan pemotongannya dihitung kembali dalam SPT Tahunan.",
        rate: "Tarif PPh Pasal 21 sesuai ketentuan yang berlaku",
        payment: "Dipotong pemberi kerja dan menjadi kredit pajak",
        spt: "Gabungkan dengan penghasilan tidak final; masukkan bukti potong",
        check: "Kesesuaian bukti potong, masa kerja, status PTKP, penghasilan dari pemberi kerja lain, dan penghasilan tambahan.",
        documents: ["Bukti potong tahunan", "Slip gaji", "Daftar tanggungan", "Bukti potong lain"],
        legal: "Rujukan: UU PPh dan ketentuan pemotongan PPh Pasal 21."
      },
      {
        id: "pekerjaan-pesangon",
        label: "Menerima pesangon sekaligus",
        title: "Uang pesangon yang dibayarkan sekaligus",
        status: "final",
        badge: "PPh FINAL",
        summary: "Pesangon yang memenuhi pengertian dibayarkan sekaligus dikenai PPh Pasal 21 bersifat final dengan tarif bertingkat.",
        rate: "0%, 5%, 15%, dan 25% sesuai lapisan bruto",
        payment: "Dipotong oleh pihak yang membayar pesangon",
        spt: "Laporkan sebagai penghasilan yang dikenai PPh Final",
        check: "Jumlah bruto kumulatif, cara pembayaran, dan apakah cicilan masih dalam jangka waktu yang diperlakukan final.",
        documents: ["Perjanjian PHK", "Rincian pesangon", "Bukti potong", "Bukti pembayaran"],
        legal: "Rujukan: PP 68 Tahun 2009."
      },
      {
        id: "pekerjaan-pensiun",
        label: "Menerima manfaat pensiun, THT, atau JHT sekaligus",
        title: "Manfaat pensiun, THT, atau JHT sekaligus",
        status: "final",
        badge: "PPh FINAL",
        summary: "Pembayaran sekaligus atas uang manfaat pensiun, THT, atau JHT dikenai PPh Pasal 21 final dengan lapisan tarif khusus.",
        rate: "0% sampai Rp50 juta; 5% atas bagian di atas Rp50 juta",
        payment: "Dipotong oleh dana pensiun atau penyelenggara pembayaran",
        spt: "Laporkan sebagai penghasilan yang dikenai PPh Final",
        check: "Jenis manfaat, jumlah bruto kumulatif, cara pembayaran, dan jangka waktu cicilan bila tidak dibayar satu kali.",
        documents: ["Surat pembayaran manfaat", "Bukti potong", "Rincian pembayaran", "Dokumen kepesertaan"],
        legal: "Rujukan: PP 68 Tahun 2009."
      }
    ]
  },
  digital: {
    label: "Aset digital",
    items: [
      {
        id: "digital-kripto-domestik",
        label: "Menjual kripto melalui pedagang resmi dalam negeri",
        title: "Penjualan aset kripto melalui pedagang aset keuangan digital",
        status: "final",
        badge: "PPh FINAL",
        summary: "Penghasilan penjual dari transaksi aset kripto melalui pedagang aset keuangan digital dikenai PPh Pasal 22 bersifat final dari nilai transaksi.",
        rate: "0,21% dari nilai transaksi",
        payment: "Dipungut, disetor, dan dilaporkan oleh pedagang aset keuangan digital",
        spt: "Laporkan nilai transaksi dan PPh Final berdasarkan laporan platform",
        check: "Status penyelenggara, nilai transaksi, serta kelengkapan bukti pungut atau laporan transaksi.",
        documents: ["Laporan transaksi", "Bukti pungut", "Riwayat wallet", "Rekap nilai transaksi"],
        legal: "Rujukan: PMK 50 Tahun 2025, berlaku sejak 1 Agustus 2025."
      },
      {
        id: "digital-kripto-luar",
        label: "Menjual kripto melalui sarana luar negeri atau yang belum ditunjuk",
        title: "Penjualan kripto melalui sarana lainnya",
        status: "conditional",
        badge: "WAJIB CEK PEMUNGUT",
        summary: "Transaksi melalui penyelenggara luar negeri yang ditunjuk atau sarana yang belum ditunjuk dapat dikenai PPh Final 1% dan mungkin menimbulkan kewajiban setor sendiri.",
        rate: "1% dari nilai transaksi dalam kondisi yang ditentukan",
        payment: "Dipungut penyelenggara yang ditunjuk atau disetor sendiri penjual",
        spt: "Laporkan transaksi dan PPh Final; periksa kewajiban SPT Masa",
        check: "Apakah penyelenggara telah ditunjuk sebagai pemungut dan apakah pajak benar-benar telah dipungut.",
        documents: ["Laporan platform", "Riwayat wallet", "Bukti pungut/setor", "Konversi nilai rupiah"],
        legal: "Rujukan: PMK 50 Tahun 2025."
      },
      {
        id: "digital-mining",
        label: "Menerima penghasilan dari mining",
        title: "Penghasilan penambang aset kripto",
        status: "regular",
        badge: "TARIF UMUM MULAI 2026",
        summary: "Penghasilan penambang berupa imbalan jasa, block reward, transaction fee, atau penghasilan lain dari sistem kripto dikenai PPh berdasarkan tarif umum mulai Tahun Pajak 2026.",
        rate: "Tarif umum sesuai UU PPh",
        payment: "Dihitung dalam kewajiban pajak orang pribadi",
        spt: "Gabungkan sebagai penghasilan tidak final",
        check: "Jenis imbalan, nilai rupiah ketika diterima, biaya terkait kegiatan, dan transaksi penjualan kripto setelah mining.",
        documents: ["Riwayat wallet", "Catatan reward", "Nilai konversi rupiah", "Daftar biaya kegiatan"],
        legal: "Rujukan: Pasal 25 dan Pasal 27 PMK 50 Tahun 2025."
      }
    ]
  }
};

const categoryButtons = [...document.querySelectorAll(".category-button")];
const transactionStep = document.getElementById("transactionStep");
const transactionOptions = document.getElementById("transactionOptions");
const finderEmpty = document.getElementById("finderEmpty");
const resultSection = document.getElementById("hasil");

function selectCategory(categoryKey) {
  const category = incomeData[categoryKey];
  if (!category) return;

  categoryButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.category === categoryKey));
  });

  transactionOptions.replaceChildren();
  category.items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "transaction-button";
    button.textContent = item.label;
    button.dataset.item = item.id;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => selectIncome(categoryKey, item.id, button));
    transactionOptions.append(button);
  });

  transactionStep.hidden = false;
  finderEmpty.hidden = true;
  resultSection.hidden = true;
  transactionOptions.querySelector("button")?.focus();
}

function selectIncome(categoryKey, itemId, selectedButton) {
  const category = incomeData[categoryKey];
  const item = category?.items.find((entry) => entry.id === itemId);
  if (!item) return;

  [...transactionOptions.children].forEach((button) => {
    button.setAttribute("aria-pressed", String(button === selectedButton));
  });

  document.getElementById("resultContext").textContent = category.label;
  document.getElementById("resultHeading").textContent = item.title;
  document.getElementById("resultSummary").textContent = item.summary;
  document.getElementById("resultRate").textContent = item.rate;
  document.getElementById("resultPayment").textContent = item.payment;
  document.getElementById("resultSpt").textContent = item.spt;
  document.getElementById("resultCheck").textContent = item.check;
  document.getElementById("resultLegal").textContent = item.legal;

  const badge = document.getElementById("statusBadge");
  badge.className = `status-badge ${item.status}`;
  badge.textContent = item.badge;

  const documentList = document.getElementById("resultDocuments");
  documentList.replaceChildren(...item.documents.map((documentName) => {
    const listItem = document.createElement("li");
    listItem.textContent = documentName;
    return listItem;
  }));

  resultSection.hidden = false;
  requestAnimationFrame(() => {
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => selectCategory(button.dataset.category));
});

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const siteHeader = document.getElementById("siteHeader");

function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka menu");
  menuToggle.textContent = "☰";
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Tutup menu" : "Buka menu");
  menuToggle.textContent = willOpen ? "×" : "☰";
  mobileMenu.hidden = !willOpen;
  document.body.classList.toggle("menu-open", willOpen);
});

mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMobileMenu();
});

window.addEventListener("scroll", () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
}, { passive: true });
