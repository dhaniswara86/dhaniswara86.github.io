# Kabayan Sertifikat Kegiatan v1

Aplikasi ini **terpisah** dari `/sertifikat/` (Sertifikat Internal).

## URL yang disarankan
`https://dhaniswara86.id/sertifikat-kegiatan/`

## Flow peserta
Daftar Hadir → Pretest → Posttest → Sertifikat otomatis.

## Soal dinamis per kegiatan
Admin dapat:
1. Input soal manual.
2. Salin Pretest/Posttest dari kegiatan lain.
3. Import soal dari Excel.

Soal disimpan di tabel `external_questions` dengan `event_id`, sehingga setiap kegiatan dapat mempunyai soal berbeda tanpa mengubah HTML.

## File utama
- `admin.html` — admin membuat kegiatan, soal, publish, dan monitor peserta.
- `kegiatan.html?kode=KODE` — halaman publik peserta.
- `verifikasi.html?id=UUID` — verifikasi sertifikat eksternal.
- `supabase-config.js` — koneksi ke **project Supabase eksternal**.
- `sql/setup.sql` — schema, RLS, dan RPC publik.
- `contoh-import-soal.xlsx` — format import Pretest/Posttest.

## Setup
1. Buat project Supabase baru khusus Sertifikat Kegiatan.
2. Jalankan `sql/setup.sql`.
3. Buat minimal satu user admin di Authentication → Users.
4. Isi Project URL + Publishable Key pada `supabase-config.js`.
5. Upload seluruh folder ke `/sertifikat-kegiatan/`.
6. Login melalui `admin.html`, buat kegiatan, isi soal, lalu Publish.
7. Bagikan link peserta yang dihasilkan admin.

## Rule sertifikat v1
Sertifikat terbit ketika:
- daftar hadir selesai,
- pretest selesai (jika diwajibkan),
- posttest selesai (jika diwajibkan).

Nilai tidak menjadi syarat kelulusan pada versi awal. Sistem hanya mensyaratkan penyelesaian.

## Nomor sertifikat
Token format:
- `{SEQ}` → nomor berurutan 3 digit
- `{YEAR}` → tahun kegiatan
- `{EVENT}` → kode kegiatan

Contoh:
`SERT-{SEQ}/KP.0907/{YEAR}`

## Keamanan
Peserta publik tidak diberi akses langsung ke tabel. Flow publik menggunakan `SECURITY DEFINER RPC` yang hanya mengembalikan data yang diperlukan. Jawaban benar tidak dikirim pada RPC soal.
