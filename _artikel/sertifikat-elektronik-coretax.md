---
layout: artikel-apple-minimal

title: "Kode Otorisasi DJP"
excerpt: "Cara permintaan, pengecekan status, dan hal penting yang perlu dipahami sebelum menggunakan tanda tangan elektronik di Coretax."
description: "Panduan minimalis Kode Otorisasi DJP di Coretax: memahami KODJP, Sertifikat Elektronik, passphrase, persiapan, cara permintaan, pengecekan status, dan penggunaannya untuk Wajib Pajak Badan."

category: "Coretax"
local_nav_title: "Kode Otorisasi DJP"

author: "Angga Sukma Dhaniswara"
date_modified: 2026-08-18
reading_time: "9 menit baca"

permalink: /sertifikat-elektronik-coretax.html

summary_label: "Ringkasan"
summary: "Kode Otorisasi DJP merupakan tanda tangan elektronik tidak tersertifikasi yang diterbitkan oleh Direktorat Jenderal Pajak untuk penandatanganan dokumen perpajakan di Coretax. Jika tidak menggunakan Sertifikat Elektronik dari PSrE, pengguna dapat meminta KODJP melalui akun Coretax dan kemudian memastikan statusnya sudah Valid."

local_nav:
  - label: "Memahami"
    href: "#memahami"
  - label: "Persiapan"
    href: "#persiapan"
  - label: "Permintaan"
    href: "#permintaan"
  - label: "Status"
    href: "#status"
  - label: "WP Badan"
    href: "#badan"

tags:
  - Coretax
  - Kode Otorisasi DJP
  - Sertifikat Elektronik
  - Passphrase
  - PSrE

custom_css:
  - /assets/css/sertifikat-elektronik-apple.css?v=20260818-1

custom_js:
  - /assets/js/sertifikat-elektronik-apple.js?v=20260818-1
---

<section id="memahami">
<div class="apple-section-head">
<span class="apple-section-label">01 · Memahami</span>
<h2>Kenali dulu tanda tangan elektronik di Coretax.</h2>
</div>

<p>
Untuk penerbitan bukti potong, faktur pajak, pelaporan SPT, dan permohonan layanan administrasi di Coretax dibutuhkan tanda tangan elektronik. Dalam konteks panduan ini, pengguna dapat menggunakan <strong>Sertifikat Elektronik</strong> atau <strong>Kode Otorisasi DJP</strong>.
</p>

<div class="kodjp-facts">
<span><strong>Gratis</strong> dari DJP</span>
<span><strong>Berlaku 2 tahun</strong></span>
<span>Digunakan untuk <strong>tanda tangan elektronik</strong></span>
</div>

<div class="apple-split">
<article class="apple-panel">
<span class="apple-panel-kicker">Tersertifikasi</span>
<h3>Sertifikat Elektronik</h3>
<p>
Sertifikat elektronik merupakan tanda tangan elektronik yang diterbitkan oleh Penyelenggara Sertifikasi Elektronik (PSrE) yang ditetapkan oleh Kementerian Komunikasi dan Digital. Sertifikat ini memuat identitas dan tanda tangan elektronik yang dapat digunakan untuk proses autentikasi dan penandatanganan dokumen elektronik.
</p>
<div class="apple-panel-meta">Contoh PSrE yang disebut dalam materi artikel: Ezsign, Privy ID, Vida, Vinotex, dan Xignature.</div>
</article>

<article class="apple-panel primary">
<span class="apple-panel-kicker">Tidak tersertifikasi</span>
<h3>Kode Otorisasi DJP</h3>
<p>
Kode Otorisasi DJP merupakan tanda tangan elektronik tidak tersertifikasi yang diterbitkan oleh Direktorat Jenderal Pajak untuk keperluan penandatanganan dokumen perpajakan. KODJP dapat diminta melalui akun Coretax tanpa biaya.
</p>
<div class="apple-panel-meta">Jika belum menggunakan Sertifikat Elektronik dari PSrE, KODJP dapat digunakan untuk penandatanganan dokumen perpajakan di Coretax.</div>
</article>
</div>

<h3>Password dan passphrase bukan hal yang sama.</h3>

<p>
Passphrase bukan kata sandi untuk masuk ke akun Coretax. Passphrase digunakan ketika pengguna melakukan tindakan yang membutuhkan tanda tangan elektronik.
</p>

<div class="apple-compare">
<article class="apple-compare-card">
<span>LOGIN</span>
<h3>Password</h3>
<p>Digunakan untuk masuk atau login ke akun Coretax.</p>
</article>

<div class="apple-compare-symbol" aria-hidden="true">≠</div>

<article class="apple-compare-card passphrase">
<span>SIGN</span>
<h3>Passphrase</h3>
<p>Digunakan sebagai bagian dari otorisasi ketika melakukan tanda tangan elektronik.</p>
</article>
</div>

<p>
Passphrase sekurang-kurangnya terdiri dari delapan karakter dengan kombinasi huruf besar, huruf kecil, angka, dan karakter khusus. Jika muncul notifikasi “format pola tidak valid”, periksa kembali karakter khusus yang digunakan.
</p>

<div class="apple-callout security">
<strong>Rahasiakan passphrase</strong>
<p>Jangan menyimpan passphrase di dokumen bersama, mengirimkannya melalui grup percakapan, atau menyerahkannya kepada pihak lain.</p>
</div>
</section>

<section id="persiapan">
<div class="apple-section-head">
<span class="apple-section-label">02 · Persiapan</span>
<h2>Pastikan semuanya siap sebelum memulai.</h2>
</div>

<p>
Sebelum melakukan permintaan KODJP, periksa kembali data dasar pada akun Coretax dan siapkan passphrase yang hanya diketahui oleh pengguna.
</p>

<div class="apple-checklist">
<label class="apple-check-item">
<input type="checkbox" data-check-key="account">
<span class="apple-checkmark">✓</span>
<span class="apple-check-copy"><strong>Akun Coretax</strong><small>Akun dapat digunakan untuk login.</small></span>
</label>

<label class="apple-check-item">
<input type="checkbox" data-check-key="identity">
<span class="apple-checkmark">✓</span>
<span class="apple-check-copy"><strong>NIK atau NPWP</strong><small>Identitas yang tampil pada profil sudah benar.</small></span>
</label>

<label class="apple-check-item">
<input type="checkbox" data-check-key="name">
<span class="apple-checkmark">✓</span>
<span class="apple-check-copy"><strong>Nama Wajib Pajak</strong><small>Sesuai dengan data administrasi.</small></span>
</label>

<label class="apple-check-item">
<input type="checkbox" data-check-key="email">
<span class="apple-checkmark">✓</span>
<span class="apple-check-copy"><strong>Email aktif</strong><small>Alamat email masih dapat diakses.</small></span>
</label>

<label class="apple-check-item">
<input type="checkbox" data-check-key="phone">
<span class="apple-checkmark">✓</span>
<span class="apple-check-copy"><strong>Nomor seluler</strong><small>Nomor telepon sudah sesuai.</small></span>
</label>

<label class="apple-check-item">
<input type="checkbox" data-check-key="passphrase">
<span class="apple-checkmark">✓</span>
<span class="apple-check-copy"><strong>Passphrase</strong><small>Siapkan passphrase yang hanya diketahui sendiri.</small></span>
</label>
</div>

<div class="apple-check-progress">
<div class="apple-check-track"><span id="appleChecklistBar"></span></div>
<strong id="appleChecklistText">0/6</strong>
</div>

<div class="apple-callout warning">
<strong>Jangan gunakan passphrase bersama.</strong>
<p>Kode Otorisasi melekat pada identitas pengguna. Pada Wajib Pajak Badan, pihak yang bertindak tetap menggunakan identitas dan tanda tangan elektronik pribadinya.</p>
</div>
</section>

<section id="permintaan">
<div class="apple-section-head">
<span class="apple-section-label">03 · Permintaan</span>
<h2>Cara permintaan KODJP.</h2>
</div>

<p>
Slide 1–9 menjelaskan proses permintaan KODJP dari login sampai muncul notifikasi bahwa sertifikat digital berhasil dibuat.
</p>

<div class="apple-slide-viewer" id="appleRequestViewer" tabindex="0">
<div class="apple-slide-topbar">
<strong>Permintaan KODJP</strong>
<span class="apple-slide-counter" data-counter>1 dari 9</span>
</div>

<div class="apple-slide-steps" data-steps></div>
<div class="apple-slide-progress"><span data-progress></span></div>

<div class="apple-slide-stage">
<button class="apple-slide-nav" type="button" data-prev aria-label="Slide sebelumnya">‹</button>
<figure>
<img data-image src="/assets/sertifikat-elektronik/Sertel-01.webp" alt="Panduan permintaan KODJP">
<figcaption data-caption>Sampul: Tata Cara Pengajuan dan Pengecekan KO DJP Coretax</figcaption>
</figure>
<button class="apple-slide-nav" type="button" data-next aria-label="Slide berikutnya">›</button>
</div>

<div class="apple-slide-actions">
<button type="button" data-fullscreen>Layar penuh</button>
<a href="/Tata-Cara-Pengajuan-Sertifikat-Elektronik.pdf" target="_blank" rel="noopener noreferrer">Buka PDF</a>
<a href="/Tata-Cara-Pengajuan-Sertifikat-Elektronik.pdf" download>Unduh PDF</a>
</div>
</div>
</section>

<section id="status">
<div class="apple-section-head">
<span class="apple-section-label">04 · Status</span>
<h2>Pastikan status KODJP sudah Valid.</h2>
</div>

<p>
Permintaan belum selesai hanya karena notifikasi berhasil dibuat. Setelah itu, periksa kembali Sertifikat Digital dan pastikan Status Kepemilikan sudah berubah menjadi <strong>Valid</strong>.
</p>

<div class="apple-slide-viewer" id="appleStatusViewer" tabindex="0">
<div class="apple-slide-topbar">
<strong>Pengecekan status</strong>
<span class="apple-slide-counter" data-counter>1 dari 6</span>
</div>

<div class="apple-slide-steps" data-steps></div>
<div class="apple-slide-progress"><span data-progress></span></div>

<div class="apple-slide-stage">
<button class="apple-slide-nav" type="button" data-prev aria-label="Slide sebelumnya">‹</button>
<figure>
<img data-image src="/assets/sertifikat-elektronik/Sertel-10.webp" alt="Panduan pengecekan status KODJP">
<figcaption data-caption>Langkah berikutnya: memastikan status valid dan masih berlaku</figcaption>
</figure>
<button class="apple-slide-nav" type="button" data-next aria-label="Slide berikutnya">›</button>
</div>

<div class="apple-slide-actions">
<button type="button" data-fullscreen>Layar penuh</button>
<a href="/Tata-Cara-Pengajuan-Sertifikat-Elektronik.pdf" target="_blank" rel="noopener noreferrer">Buka PDF</a>
</div>
</div>

<div class="apple-success">
<div class="apple-success-icon">✓</div>
<h3>KO DJP siap digunakan.</h3>
<div class="apple-success-status"><span>Status Kepemilikan</span><strong>VALID</strong></div>
<p>Jangan berhenti setelah menekan Simpan. Pastikan Status Kepemilikan pada bagian Digital Certificate sudah berubah menjadi Valid.</p>
</div>
</section>

<section id="badan">
<div class="apple-section-head">
<span class="apple-section-label">05 · WP Badan</span>
<h2>Perusahaan memberi kewenangan. Tanda tangan tetap melekat pada orang.</h2>
</div>

<p>
Berbeda dengan rezim DJP Online, Wajib Pajak Badan tidak memiliki sertifikat elektronik yang berdiri sendiri atas nama badan. Kepemilikan tanda tangan elektronik melekat pada Pengurus, PIC, pegawai, atau pihak lain yang diberikan kewenangan.
</p>

<div class="apple-authority">
<div class="apple-authority-root">
<strong>Wajib Pajak Badan</strong>
<small>Memberikan hubungan dan kewenangan</small>
</div>

<div class="apple-authority-line"></div>

<div class="apple-authority-people">
<span>PIC</span>
<span>Pengurus</span>
<span>Pegawai</span>
</div>

<div class="apple-authority-line"></div>

<div class="apple-authority-signature">
<strong>KO DJP / Sertifikat Elektronik</strong>
<small>Melekat pada identitas pribadi pihak yang bertindak</small>
</div>
</div>

<div class="apple-callout info">
<strong>KO DJP ≠ Role Akses</strong>
<p>Memiliki Kode Otorisasi belum otomatis membuat seseorang boleh menandatangani seluruh dokumen perusahaan. Pengguna juga harus mempunyai hubungan dan role akses yang sesuai.</p>
</div>
</section>

<section id="kesalahan">
<div class="apple-section-head">
<span class="apple-section-label">Troubleshooting</span>
<h2>Kesalahan yang sering terjadi.</h2>
</div>

<div class="apple-accordion">
<details>
<summary><span>01</span><strong>Menganggap password sama dengan passphrase</strong><i>+</i></summary>
<p>Password digunakan untuk login, sedangkan passphrase digunakan pada proses tanda tangan elektronik.</p>
</details>

<details>
<summary><span>02</span><strong>Menganggap semua pengguna harus mempunyai sertifikat PSrE</strong><i>+</i></summary>
<p>Pengguna yang tidak mempunyai sertifikat PSrE dapat menggunakan Kode Otorisasi DJP.</p>
</details>

<details>
<summary><span>03</span><strong>Tidak memastikan status validitas KODJP</strong><i>+</i></summary>
<p>Status Kode Otorisasi DJP tetap perlu dipastikan sampai berstatus Valid.</p>
</details>

<details>
<summary><span>04</span><strong>Membagikan passphrase kepada pegawai lain</strong><i>+</i></summary>
<p>Passphrase merupakan bagian dari otorisasi pengguna dan harus dijaga kerahasiaannya.</p>
</details>
</div>
</section>

<section id="referensi">
<div class="apple-section-head">
<span class="apple-section-label">Referensi</span>
<h2>Dasar hukum dan sumber.</h2>
</div>

<details class="apple-references">
<summary><strong>Lihat 7 sumber yang digunakan</strong><span>Buka</span></summary>
<ol>
<li>Peraturan Menteri Keuangan Nomor 81 Tahun 2024 tentang Ketentuan Perpajakan dalam Rangka Pelaksanaan Sistem Inti Administrasi Perpajakan sebagaimana telah beberapa kali diubah terakhir dengan Peraturan Menteri Keuangan Nomor 1 Tahun 2026.</li>
<li>Peraturan Direktur Jenderal Pajak Nomor PER-7/PJ/2025.</li>
<li>Coretaxpedia Direktorat Jenderal Pajak, “Bagaimana mendapat kode otorisasi”.</li>
<li>Coretaxpedia Direktorat Jenderal Pajak, “Bagaimana mengetahui status kode otorisasi”.</li>
<li>Buku Manual Coretax Administration System — Permohonan Kode Otorisasi DJP/Sertifikat Digital.</li>
<li>Pengumuman Direktorat Jenderal Pajak mengenai daftar Penyelenggara Sertifikasi Elektronik noninstansi.</li>
<li>Panduan DJP tahun 2026 mengenai Aktivasi Akun Coretax dan Permintaan Sertifikat Elektronik melalui M-Pajak.</li>
</ol>
</details>
</section>
