# Cek Risiko Pelaporan SPT OP — Kabayan

Microsite asesmen mandiri berdurasi sekitar empat menit. Seluruh jawaban dan perhitungan dijalankan di perangkat pengguna dan tidak dikirim ke server. Hasil selalu ditempatkan pada salah satu dari empat tingkat potensi risiko: rendah, menengah, tinggi, atau sangat tinggi.

Tampilan menggunakan sistem visual yang diselaraskan dengan halaman `formulir.html` Kabayan: navigasi transparan, tipografi editorial, aksen gradien biru, tombol pil, kartu minimalis, menu mobile, dan footer informasi.

## Cara mengunggah

1. Ekstrak folder `cek-risiko-spt-op`.
2. Unggah seluruh folder beserta struktur di dalamnya ke repositori website Kabayan.
3. Buka `https://domain-anda/cek-risiko-spt-op/`.

## Berkas utama

- `index.html` — struktur halaman.
- `cek-risiko-spt.css` — seluruh tampilan responsif.
- `cek-risiko-spt.js` — pertanyaan, percabangan, skor, critical override, dan hasil.
- `assets/img/` — ikon tingkat risiko.

## Catatan integrasi

Tautan logo pada header saat ini mengarah ke `../`. Ubah jika lokasi halaman utama Kabayan menggunakan struktur lain. Halaman tidak memerlukan database atau library JavaScript tambahan.
