# Peta Penghasilan SPT OP · Kabayan

Paket statis minimalis yang siap diunggah ke GitHub Pages.

## Cara mengunggah

1. Ekstrak ZIP.
2. Unggah seluruh isi folder `peta-penghasilan-spt-op` ke repository GitHub.
3. Pertahankan posisi `index.html`, folder `assets`, dan folder `data` pada tingkat yang sama.
4. Aktifkan GitHub Pages untuk branch dan folder yang digunakan.

Tidak memerlukan proses build, database, login, atau penyimpanan profil.

Versi ini mencakup pemetaan 62 jenis penghasilan untuk Tahun Pajak 2025. Penentu posisi ditempatkan pada awal halaman dan menampilkan pertanyaan secara bertahap. Status KK/HB/PH/MT disimpulkan dari fakta hukum yang dipilih pengguna, lalu diperiksa konsistensinya dengan NIK/NPWP dan DUK. Kondisi penghasilan istri dari satu pemberi kerja baru diperlakukan final setelah tiga syarat kumulatif dikonfirmasi. Semua pilihan hanya berlaku selama halaman dibuka dan tidak disimpan.

## File yang diunggah

- `index.html`
- `assets/peta.css`
- `assets/app.js`
- `data/incomes-2025.js`

Paket ini sengaja tidak memuat CSS lama yang tidak digunakan maupun metadata macOS.
