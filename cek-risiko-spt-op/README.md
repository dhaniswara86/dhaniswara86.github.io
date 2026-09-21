# Cek Risiko Pelaporan SPT OP — Kabayan

Microsite asesmen mandiri berdurasi sekitar empat menit. Seluruh jawaban dan perhitungan dijalankan di perangkat pengguna dan tidak dikirim ke server. Hasil terdiri atas tiga kategori: Low Risk, Medium Risk, dan High Risk.

Sistem menggunakan bank pertanyaan adaptif. Setiap peserta hanya melihat pertanyaan yang relevan dengan profilnya, dengan batas maksimal 15 pertanyaan termasuk validasi akhir.

Tampilan menggunakan sistem visual yang diselaraskan dengan halaman `formulir.html` Kabayan: navigasi transparan, tipografi editorial, aksen gradien biru, tombol pil, kartu minimalis, menu mobile, dan footer informasi.

Setiap pertanyaan memiliki ikon garis kecil yang relevan dengan topiknya. Ikon ditanam langsung dalam JavaScript sehingga tidak memerlukan dependensi atau berkas gambar tambahan.

Logo pada header menggunakan aset Kabayan yang sama dengan halaman utama melalui referensi `../images/LogoASD.svg`.

Ilustrasi utama menggunakan karakter `assets/img/kabayan-cek-risiko.webp` yang sedang memeriksa indikator risiko pada formulir SPT.

## Cara mengunggah

1. Ekstrak folder `cek-risiko-spt-op`.
2. Unggah seluruh folder beserta struktur di dalamnya ke repositori website Kabayan.
3. Buka `https://domain-anda/cek-risiko-spt-op/`.

## Berkas utama

- `index.html` — halaman utama.
- `cek-risiko-spt.css` — seluruh tampilan responsif.
- `cek-risiko-spt.js` — bank pertanyaan, percabangan adaptif, klasifikasi temuan, dan hasil.
- `assets/img/` — ikon tingkat risiko.

## Catatan integrasi

Tautan logo pada header saat ini mengarah ke `../`. Ubah jika lokasi halaman utama Kabayan menggunakan struktur lain. Halaman tidak memerlukan database atau library JavaScript tambahan.

## Penyesuaian tampilan

Halaman awal menampilkan Kabayan tanpa lingkaran orbit dan kartu melayang Penghasilan, Harta, atau Bukti potong. Tombol “Mulai pemeriksaan” berwarna kuning Kabayan.
