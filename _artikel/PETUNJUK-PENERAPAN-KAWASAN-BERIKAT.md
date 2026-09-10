# Petunjuk Penerapan Artikel Kawasan Berikat

Paket ini dibuat untuk struktur Jekyll yang menggunakan layout `artikel-editorial`.

## 1. Pertahankan file yang sudah ada

Tempatkan file yang sudah Anda miliki sebagai berikut:

| File | Lokasi di repository |
|---|---|
| `artikel-editorial(1).html` | `_layouts/artikel-editorial.html` |
| `artikel-editorial.css` | `assets/css/artikel-editorial.css` |
| `artikel-katalog.css` | `assets/css/artikel-katalog.css` |
| `artikel-katalog(1).js` | `assets/js/artikel-katalog.js` |

File `artikel-editorial(1).js` tidak perlu dipanggil pada artikel ini. Layout `artikel-editorial(1).html` sudah memiliki skrip bawaan untuk progress membaca, daftar isi, tombol salin tautan, menu mobile, dan checklist. Memuat keduanya sekaligus berpotensi menjalankan fitur yang sama dua kali.

## 2. Tambahkan tiga file artikel

Tempatkan hasil baru berikut:

| File | Lokasi di repository |
|---|---|
| `pajak-kawasan-berikat.md` | root repository atau folder artikel yang dibaca Jekyll |
| `pajak-kawasan-berikat.css` | `assets/css/pajak-kawasan-berikat.css` |
| `pajak-kawasan-berikat.js` | `assets/js/pajak-kawasan-berikat.js` |

File Markdown telah mempunyai front matter yang memanggil layout, CSS, dan JavaScript tersebut. Jangan menghapus bagian yang diapit tanda `---` di awal file.

## 3. Pastikan aset layout tersedia

Layout menggunakan aset berikut:

- `assets/img/LogoASD.svg`
- `assets/img/mega-mendung-cirebon.webp`
- `assets/img/kabayan-membaca.webp`
- `assets/img/kabayan-pengetahuan.webp`

Jika aset tersebut telah dipakai artikel lain, tidak perlu menyalinnya kembali.

## 4. Alamat halaman

Front matter artikel menetapkan:

```yaml
permalink: /pajak-kawasan-berikat.html
```

Setelah GitHub Pages selesai membangun situs, artikel dapat dibuka melalui:

```text
https://domain-anda/pajak-kawasan-berikat.html
```

## 5. Katalog artikel

CSS dan JavaScript katalog hanya mengatur tampilan, pencarian, dan penyaringan. Keduanya tidak menambahkan artikel secara otomatis.

- Jika `artikel.html` membuat kartu melalui loop Jekyll atas `site.pages` atau `site.posts`, metadata pada front matter dapat dipakai untuk menampilkan artikel.
- Jika daftar kartu ditulis manual, tambahkan kartu yang menuju `/pajak-kawasan-berikat.html` di dalam elemen `#articleGrid`.

Untuk menyesuaikan katalog secara tepat, diperlukan file `artikel.html` yang berisi elemen `#articleGrid`.

## 6. Pemeriksaan setelah unggah

Periksa hal berikut setelah situs selesai dibangun:

1. halaman tidak menampilkan kode Liquid seperti `{{ page.title }}`;
2. daftar isi di sisi kanan terisi otomatis;
3. tabel dapat digeser pada layar kecil;
4. enam contoh kasus dapat dibuka dan ditutup;
5. tautan “Kapan PPN terutang?” dan “Kapan PPh terutang?” menuju bagian yang tepat; dan
6. tidak ada kesalahan 404 pada ketiga file CSS/JavaScript serta empat aset gambar.
