---
layout: artikel-guide

title: "Kode Otorisasi DJP: Cara Permintaan dan Pengecekan Status"
excerpt: "Panduan praktis memahami Kode Otorisasi DJP, Sertifikat Elektronik dan passphrase, menyiapkan data, melakukan permintaan KODJP, serta memastikan statusnya Valid."
description: "Panduan modern Kode Otorisasi DJP di Coretax: pengertian, persiapan, cara permintaan, cara pengecekan status, passphrase, dan penggunaan untuk Wajib Pajak Badan."

category: "Coretax · Panduan Praktis"

tags:
  - Coretax
  - Sertifikat Elektronik
  - Kode Otorisasi DJP
  - Passphrase
  - Tanda Tangan Elektronik
  - PSrE

author: "Angga Sukma Dhaniswara"
date_modified: 2026-08-18
reading_time: "9 menit baca"
legal_basis: "PMK 81/2024 s.t.d.d. PMK 1/2026 dan PER-7/PJ/2025"

permalink: /sertifikat-elektronik-coretax.html

summary_label: "Ringkasan"
summary: "Kode Otorisasi DJP merupakan tanda tangan elektronik tidak tersertifikasi yang diterbitkan oleh Direktorat Jenderal Pajak untuk penandatanganan dokumen perpajakan di Coretax. Jika tidak menggunakan Sertifikat Elektronik dari PSrE, pengguna dapat meminta KODJP melalui akun Coretax dan kemudian memastikan statusnya sudah Valid."

guide_links:
  - label: "Memahami KODJP, Sertel, & Passphrase"
    href: "#memahami"
  - label: "Hal yang harus disiapkan"
    href: "#persiapan"
  - label: "Cara permintaan KODJP"
    href: "#permintaan"
  - label: "Cara pengecekan status"
    href: "#pengecekan"
  - label: "Untuk WP Badan"
    href: "#badan"

custom_css:
  - /assets/css/sertifikat-elektronik-guide.css?v=20260818-1

custom_js:
  - /assets/js/sertifikat-elektronik-guide.js?v=20260818-1
---

<section id="memahami">
<header>
<span class="guide-section-label">01 · Memahami</span>
<h2>Memahami KODJP, Sertifikat Elektronik, & Passphrase</h2>
</header>

<p>
Untuk penerbitan bukti potong, faktur pajak, pelaporan SPT, dan permohonan layanan administrasi di Coretax dibutuhkan tanda tangan elektronik. Berdasarkan ketentuan yang menjadi dasar artikel ini, tanda tangan elektronik yang digunakan di Coretax dapat berupa <strong>Sertifikat Elektronik</strong> atau <strong>Kode Otorisasi DJP</strong>.
</p>

<div class="kodjp-facts">
<span><strong>Gratis</strong> dari DJP</span>
<span><strong>Berlaku 2 tahun</strong></span>
<span>Digunakan untuk <strong>tanda tangan elektronik</strong></span>
</div>

<div class="definition-grid">
<article class="definition-block">
<span class="definition-kicker">Tersertifikasi</span>
<h3>Sertifikat Elektronik</h3>
<p>
Sertifikat elektronik merupakan tanda tangan elektronik yang diterbitkan oleh Penyelenggara Sertifikasi Elektronik (PSrE) yang ditetapkan oleh Kementerian Komunikasi dan Digital. Sertifikat ini memuat identitas dan tanda tangan elektronik yang dapat digunakan untuk proses autentikasi dan penandatanganan dokumen elektronik.
</p>
<div class="definition-meta">
Contoh PSrE yang disebut dalam materi artikel: Ezsign, Privy ID, Vida, Vinotex, dan Xignature.
</div>
</article>

<article class="definition-block primary">
<span class="definition-kicker">Tidak tersertifikasi</span>
<h3>Kode Otorisasi DJP</h3>
<p>
Kode Otorisasi DJP merupakan tanda tangan elektronik tidak tersertifikasi yang diterbitkan oleh Direktorat Jenderal Pajak untuk keperluan penandatanganan dokumen perpajakan. KODJP dapat diminta melalui akun Coretax tanpa biaya.
</p>
<div class="definition-meta">
Jika belum menggunakan Sertifikat Elektronik dari PSrE, KODJP dapat digunakan sebagai alternatif untuk penandatanganan dokumen perpajakan di Coretax.
</div>
</article>
</div>

<h3>Password dan passphrase bukan hal yang sama</h3>

<p>
Passphrase bukan kata sandi untuk masuk ke akun Coretax. Passphrase digunakan ketika pengguna melakukan tindakan yang membutuhkan tanda tangan elektronik.
</p>

<div class="credential-line">
<article class="credential-box">
<span class="credential-label">LOGIN</span>
<h3>Password</h3>
<p>Digunakan untuk masuk atau login ke akun Coretax.</p>
</article>

<div class="credential-separator" aria-hidden="true">≠</div>

<article class="credential-box passphrase">
<span class="credential-label">SIGN</span>
<h3>Passphrase</h3>
<p>Digunakan sebagai bagian dari otorisasi ketika melakukan tanda tangan elektronik.</p>
</article>
</div>

<p>
Passphrase harus terdiri sekurang-kurangnya delapan karakter yang terdiri dari kombinasi huruf besar, huruf kecil, angka, dan karakter khusus. Notifikasi “format pola tidak valid” menunjukkan bahwa terdapat karakter yang tidak diterima oleh sistem. Gunakan karakter khusus yang dapat diterima sistem, seperti <strong>@, #, !</strong>.
</p>

<div class="guide-callout security">
<strong>Rahasiakan passphrase</strong>
<p>Jangan menyimpan passphrase di dokumen bersama, mengirimkannya melalui grup percakapan, atau menyerahkannya kepada pihak lain.</p>
</div>
</section>

<section id="persiapan">
<header>
<span class="guide-section-label">02 · Persiapan</span>
<h2>Hal yang Harus Disiapkan</h2>
</header>

<p>
Sebelum memulai permintaan KODJP, pastikan data dasar pada akun Coretax sudah benar dan akses pemulihan masih dapat digunakan.
</p>

<div class="readiness-list">
<label class="readiness-item">
<input type="checkbox" data-readiness="account">
<span class="readiness-check">✓</span>
<span class="readiness-copy"><strong>Akun Coretax</strong><small>Akun dapat digunakan untuk login.</small></span>
</label>

<label class="readiness-item">
<input type="checkbox" data-readiness="identity">
<span class="readiness-check">✓</span>
<span class="readiness-copy"><strong>NIK atau NPWP</strong><small>Identitas yang tampil pada profil sudah benar.</small></span>
</label>

<label class="readiness-item">
<input type="checkbox" data-readiness="name">
<span class="readiness-check">✓</span>
<span class="readiness-copy"><strong>Nama Wajib Pajak</strong><small>Sesuai dengan data administrasi.</small></span>
</label>

<label class="readiness-item">
<input type="checkbox" data-readiness="email">
<span class="readiness-check">✓</span>
<span class="readiness-copy"><strong>Email aktif</strong><small>Alamat email masih dapat diakses.</small></span>
</label>

<label class="readiness-item">
<input type="checkbox" data-readiness="phone">
<span class="readiness-check">✓</span>
<span class="readiness-copy"><strong>Nomor seluler</strong><small>Nomor telepon sudah sesuai.</small></span>
</label>

<label class="readiness-item">
<input type="checkbox" data-readiness="passphrase">
<span class="readiness-check">✓</span>
<span class="readiness-copy"><strong>Passphrase</strong><small>Siapkan passphrase yang hanya diketahui sendiri.</small></span>
</label>
</div>

<div class="readiness-progress">
<div class="readiness-progress-bar"><span id="readinessBar"></span></div>
<strong id="readinessText">0/6</strong>
</div>

<div class="guide-callout warning">
<strong>Jangan gunakan passphrase bersama</strong>
<p>Kode Otorisasi melekat pada identitas pengguna. Pada Wajib Pajak Badan, pihak yang bertindak tetap menggunakan identitas dan tanda tangan elektronik pribadinya.</p>
</div>
</section>

<section id="permintaan">
<header>
<span class="guide-section-label">03 · Permintaan</span>
<h2>Cara Permintaan KODJP</h2>
</header>

<p>
Bagian ini menggunakan <strong>slide 1–9</strong> dari panduan visual. Setiap tahap dapat dipilih dari panel di sebelah kiri pada desktop atau dari baris tahap di bagian atas pada HP.
</p>

<div class="slide-guide" id="kodjpRequestViewer" tabindex="0">
<div class="slide-guide-head">
<div class="slide-guide-title">
<span>Panduan visual</span>
<strong>Permintaan Kode Otorisasi DJP</strong>
</div>
<div class="slide-guide-counter" data-slide-counter>1 / 9</div>
</div>

<div class="slide-progress"><span data-slide-progress></span></div>

<div class="slide-guide-body">
<div class="slide-phase-list" data-phase-list></div>

<div class="slide-stage">
<div class="slide-image-wrap">
<button class="slide-nav" type="button" data-slide-prev aria-label="Slide sebelumnya">‹</button>
<figure>
<img data-slide-image src="/assets/sertifikat-elektronik/Sertel-01.webp" alt="Sampul Tata Cara Pengajuan dan Pengecekan KO DJP Coretax">
<figcaption data-slide-caption>Sampul: Tata Cara Pengajuan dan Pengecekan KO DJP Coretax</figcaption>
</figure>
<button class="slide-nav" type="button" data-slide-next aria-label="Slide berikutnya">›</button>
</div>

<div class="slide-toolbar">
<button type="button" data-slide-fullscreen>Layar penuh</button>
<a href="/Tata-Cara-Pengajuan-Sertifikat-Elektronik.pdf" target="_blank" rel="noopener noreferrer">Buka PDF</a>
<a href="/Tata-Cara-Pengajuan-Sertifikat-Elektronik.pdf" download>Unduh PDF</a>
</div>
</div>
</div>
</div>
</section>

<section id="pengecekan">
<header>
<span class="guide-section-label">04 · Pengecekan</span>
<h2>Cara Pengecekan Status KODJP</h2>
</header>

<p>
Permintaan belum cukup hanya sampai notifikasi berhasil dibuat. Setelah itu, periksa kembali Sertifikat Digital dan pastikan Status Kepemilikan sudah berubah menjadi <strong>Valid</strong>.
</p>

<div class="slide-guide" id="kodjpStatusViewer" tabindex="0">
<div class="slide-guide-head">
<div class="slide-guide-title">
<span>Panduan visual</span>
<strong>Pengecekan Status KODJP</strong>
</div>
<div class="slide-guide-counter" data-slide-counter>1 / 6</div>
</div>

<div class="slide-progress"><span data-slide-progress></span></div>

<div class="slide-guide-body">
<div class="slide-phase-list" data-phase-list></div>

<div class="slide-stage">
<div class="slide-image-wrap">
<button class="slide-nav" type="button" data-slide-prev aria-label="Slide sebelumnya">‹</button>
<figure>
<img data-slide-image src="/assets/sertifikat-elektronik/Sertel-10.webp" alt="Memastikan status KODJP">
<figcaption data-slide-caption>Langkah berikutnya: memastikan status valid dan masih berlaku</figcaption>
</figure>
<button class="slide-nav" type="button" data-slide-next aria-label="Slide berikutnya">›</button>
</div>

<div class="slide-toolbar">
<button type="button" data-slide-fullscreen>Layar penuh</button>
<a href="/Tata-Cara-Pengajuan-Sertifikat-Elektronik.pdf" target="_blank" rel="noopener noreferrer">Buka PDF</a>
</div>
</div>
</div>
</div>

<div class="status-complete">
<span class="status-icon" aria-hidden="true">✓</span>
<div>
<h3>KO DJP siap digunakan</h3>
<div class="status-valid-row"><span>Status Kepemilikan</span><strong>VALID</strong></div>
<p>Jangan berhenti setelah menekan Simpan. Pastikan Status Kepemilikan pada bagian Digital Certificate sudah berubah menjadi Valid.</p>
</div>
</div>
</section>

<section id="badan">
<header>
<span class="guide-section-label">05 · Wajib Pajak Badan</span>
<h2>Untuk Wajib Pajak Badan, Tanda Tangan Tetap Melekat pada Orang</h2>
</header>

<p>
Berbeda dengan rezim DJP Online, Wajib Pajak Badan tidak memiliki sertifikat elektronik yang berdiri sendiri atas nama badan. Kepemilikan tanda tangan elektronik melekat pada Pengurus, PIC, pegawai, atau pihak lain yang diberikan kewenangan.
</p>

<div class="authority-flow">
<div class="authority-root">
<strong>Wajib Pajak Badan</strong>
<small>Memberikan hubungan dan kewenangan</small>
</div>

<div class="authority-arrow">↓</div>

<div class="authority-people">
<span>PIC</span>
<span>Pengurus</span>
<span>Pegawai</span>
</div>

<div class="authority-arrow">↓</div>

<div class="authority-personal">
<strong>KO DJP / Sertifikat Elektronik</strong>
<small>Melekat pada identitas pribadi pihak yang bertindak</small>
</div>
</div>

<div class="guide-callout info">
<strong>KO DJP ≠ Role Akses</strong>
<p>Memiliki Kode Otorisasi belum otomatis membuat seseorang boleh menandatangani seluruh dokumen perusahaan. Pengguna juga harus mempunyai hubungan dan role akses yang sesuai pada Wajib Pajak Badan.</p>
</div>
</section>

<section id="kesalahan">
<header>
<span class="guide-section-label">Troubleshooting</span>
<h2>Kesalahan yang Sering Terjadi</h2>
</header>

<div class="guide-accordion">
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
<header>
<span class="guide-section-label">Referensi</span>
<h2>Dasar Hukum dan Referensi</h2>
</header>

<details class="reference-box">
<summary><strong>Lihat 7 sumber yang digunakan</strong><span>Buka ↓</span></summary>
<ol>
<li>Peraturan Menteri Keuangan Nomor 81 Tahun 2024 tentang Ketentuan Perpajakan dalam Rangka Pelaksanaan Sistem Inti Administrasi Perpajakan sebagaimana telah beberapa kali diubah terakhir dengan Peraturan Menteri Keuangan Nomor 1 Tahun 2026.</li>
<li>Peraturan Direktur Jenderal Pajak Nomor PER-7/PJ/2025 tentang petunjuk pelaksanaan administrasi NPWP, PKP, objek PBB, serta perincian jenis, dokumen, dan saluran pelaksanaan hak dan pemenuhan kewajiban perpajakan.</li>
<li>Coretaxpedia Direktorat Jenderal Pajak, “Bagaimana mendapat kode otorisasi”.</li>
<li>Coretaxpedia Direktorat Jenderal Pajak, “Bagaimana mengetahui status kode otorisasi”.</li>
<li>Buku Manual Coretax Administration System — Permohonan Kode Otorisasi DJP/Sertifikat Digital.</li>
<li>Pengumuman Direktorat Jenderal Pajak mengenai daftar Penyelenggara Sertifikasi Elektronik noninstansi yang telah ditunjuk Menteri Keuangan.</li>
<li>Panduan DJP tahun 2026 mengenai Aktivasi Akun Coretax dan Permintaan Sertifikat Elektronik melalui M-Pajak.</li>
</ol>
</details>
</section>
