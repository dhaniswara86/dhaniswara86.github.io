# Saung Kabayan — prototipe desain

Prototipe statis ruang internal Kabayan untuk pencarian proses Penyelesaian Administrasi Perpajakan (PAP).

## Halaman

- `index.html`: login.
- `daftar.html`: pengajuan akses.
- `saung.html`: pencarian 76 layanan CTAS.
- `detail.html`: kerangka rincian proses bisnis.
- `admin.html`: simulasi persetujuan admin.

## Meninjau desain

Buka `index.html` melalui server lokal, lalu gunakan tombol **Sebagai anggota** atau **Sebagai admin**. Interaksi prototipe memakai `localStorage` dan tidak boleh dianggap sebagai autentikasi produksi.

## Integrasi produksi

Kode akses saat ini hanya simulasi antarmuka. Sebelum dipublikasikan, hubungkan alur login, permohonan, persetujuan, aktivasi password, pemeriksaan role, dan penyimpanan dokumen privat ke backend autentikasi. Fondasi Supabase yang sudah ada pada situs Kabayan dapat dikembangkan untuk kebutuhan tersebut.

Data katalog dihasilkan dari `layanan-administrasi-ctas.md` menggunakan `node build-data.mjs`.
