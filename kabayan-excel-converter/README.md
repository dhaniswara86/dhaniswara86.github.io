# Kabayan Excel Converter — Nominatif Lembur

Modul GitHub Pages untuk mengubah **Excel 1** menjadi **Excel 2** secara otomatis di browser.

## File utama
- `converter-lembur.html`
- `assets/css/converter-lembur.css`
- `assets/js/converter-lembur.js`
- `assets/templates/nominatif-lembur-template.xlsx`

## Cara pasang di repository Kabayan
1. Salin seluruh file/folder dengan struktur yang sama ke root repository.
2. Commit dan push ke GitHub.
3. Buka `https://DOMAIN-ANDA/converter-lembur.html`.
4. Tambahkan tautan menu dari halaman utama Kabayan bila diperlukan.

Contoh:
```html
<a href="converter-lembur.html">Excel Converter Nominatif Lembur</a>
```

## Alur
1. Pengguna memilih Excel 1 (`.xlsx`).
2. Browser mencari header berdasarkan nama kolom, tidak hanya posisi kolom.
3. Status kawin dikonversi:
   - 1000 → TK/0
   - 1001 → TK/1
   - 1002 → TK/2
   - 1003 → TK/3
   - 1100 → K/0
   - 1101 → K/1
   - 1102 → K/2
   - 1103 → K/3
4. Data diisikan ke template Excel 2.
5. NIP, No SPM, NIK, dan nomor rekening dipaksa menjadi teks agar digit tidak berubah.
6. Formula Nominal Lembur dan baris Total dibuat ulang otomatis.
7. File hasil diunduh dari browser.

## Privasi
Isi Excel diproses di browser pengguna dan tidak dikirim ke server aplikasi. Library ExcelJS dimuat dari jsDelivr CDN.

## Catatan
Template keluaran berada di `assets/templates/nominatif-lembur-template.xlsx`. Jika format Excel 2 berubah di masa depan, ganti file template tersebut dengan versi baru dan pertahankan header utama.
