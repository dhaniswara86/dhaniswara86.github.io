---
layout: artikel-editorial

title: "Matriks PTKP Suami-Istri: KK dan PH/MT"
hero_title: "Matriks PTKP"
hero_accent: "Suami-Istri."

excerpt: "Panduan membaca matriks Penghasilan Tidak Kena Pajak (PTKP) bagi suami-istri berdasarkan kondisi penghasilan dan pemenuhan hak serta kewajiban Pajak Penghasilan."
description: "Matriks PTKP suami-istri untuk kondisi Kepala Keluarga (KK) maupun masing-masing suami-istri (PH/MT), disusun kembali dari Lampiran Nota Dinas Direktur Peraturan Perpajakan I Nomor ND-383/PJ.02/2026."

category: "PPh Orang Pribadi"

tags:
  - PTKP
  - PPh Orang Pribadi
  - Suami Istri
  - KK
  - PH
  - MT
  - SPT Tahunan

author: "Angga Sukma Dhaniswara"
date: 2026-08-11
legal_basis: "ND-383/PJ.02/2026"
reading_time: "Panduan praktis"

permalink: /artikel/matriks-ptkp-suami-istri/

summary_label: "Ringkasan cepat"
summary: "Matriks ini menyajikan penggunaan PTKP berdasarkan kombinasi kondisi penghasilan suami dan istri, baik ketika pemenuhan hak dan kewajiban Pajak Penghasilan dilakukan oleh Kepala Keluarga (KK) maupun dilakukan oleh masing-masing suami-istri (PH/MT)."

hero_links:
  - label: "Lihat matriks PTKP"
    href: "#matriks-ptkp"

hero_stats:
  - value: "3"
    label: "Kelompok kondisi penghasilan suami"
  - value: "4"
    label: "Kondisi penghasilan istri"
  - value: "12"
    label: "Kombinasi dalam matriks"
  - value: "KK / PH / MT"
    label: "Kondisi yang dicakup"

sidebar_note: "Mulai dengan memilih kondisi penghasilan suami, lalu cocokkan dengan kondisi penghasilan istri. Isi matriks mengikuti dokumen sumber."

custom_css:
  - /assets/css/matriks-ptkp-suami-istri.css

custom_js:
  - /assets/js/matriks-ptkp-suami-istri.js?v=20260811-2
---

<div class="ptkp-article">

<p class="lead">
  Lampiran Nota Dinas Direktur Peraturan Perpajakan I
  <strong>Nomor ND-383/PJ.02/2026 tanggal 6 April 2026</strong>
  memuat matriks Penghasilan Tidak Kena Pajak (PTKP) bagi suami-istri,
  baik ketika pemenuhan hak dan kewajiban Pajak Penghasilan dilakukan
  oleh Kepala Keluarga (KK) maupun dilakukan oleh masing-masing
  suami-istri (PH/MT).
</p>

<section id="pengantar">
<h2>Bagaimana menggunakan matriks ini?</h2>

<p>
  Matriks disusun berdasarkan dua kondisi utama. Pertama, tentukan
  kondisi penghasilan <strong>suami</strong>. Kedua, cocokkan dengan
  kondisi penghasilan <strong>istri</strong>. Setelah itu, lihat PTKP
  yang tercantum pada kolom PTKP-KK, PTKP Suami, PTKP Istri, dan
  PTKP Gabungan.
</p>

<div class="callout callout-blue">
<strong>Cara cepat membaca tabel</strong>
<p>
  Gunakan filter kondisi suami dan istri di bawah. Jika ingin melihat
  matriks lengkap seperti pada dokumen sumber, biarkan kedua pilihan
  pada posisi <b>Semua kondisi</b>.
</p>
</div>
</section>


<section id="matriks-ptkp">
<h2>Matriks PTKP Suami-Istri</h2>

<p>
  Tabel berikut merupakan penataan ulang matriks pada dokumen sumber
  agar lebih mudah dibaca pada website. Urutan kondisi dan isi setiap
  kolom dipertahankan sesuai matriks sumber.
</p>

<div class="ptkp-filter-panel" aria-label="Filter matriks PTKP">
  <div class="ptkp-filter-field">
    <label for="ptkpFilterSuami">Kondisi Suami</label>
    <select id="ptkpFilterSuami">
      <option value="">Semua kondisi</option>
      <option value="tidak-berpenghasilan">Tidak berpenghasilan</option>
      <option value="pph-tidak-final">Penghasilan dikenai PPh tidak final</option>
      <option value="usaha-pph-final">Penghasilan dari usaha yang dikenai PPh final</option>
    </select>
  </div>

  <div class="ptkp-filter-field">
    <label for="ptkpFilterIstri">Kondisi Istri</label>
    <select id="ptkpFilterIstri">
      <option value="">Semua kondisi</option>
      <option value="satu-pemberi">Penghasilan dari satu pemberi kerja</option>
      <option value="lebih-satu-pemberi">Penghasilan dari &gt; 1 pemberi kerja</option>
      <option value="usaha-tidak-final">Usaha dikenai PPh tidak final / pekerjaan bebas</option>
      <option value="usaha-final-tidak-berpenghasilan">Usaha dikenai PPh final / tidak berpenghasilan</option>
    </select>
  </div>

  <button class="ptkp-reset-button" id="ptkpResetFilter" type="button">
    Reset filter
  </button>
</div>

<div class="ptkp-filter-status">
  <span id="ptkpResultCount">Menampilkan 12 kombinasi</span>
  <span class="ptkp-source-short">Sumber: ND-383/PJ.02/2026</span>
</div>

<div class="ptkp-matrix-wrap" tabindex="0" aria-label="Tabel matriks PTKP, dapat digeser secara horizontal">
<table class="ptkp-matrix-table">
<thead>
<tr>
  <th rowspan="2" scope="col">Suami</th>
  <th rowspan="2" scope="col">Istri</th>
  <th rowspan="2" scope="col">PTKP - KK</th>
  <th colspan="3" scope="colgroup">
    PTKP (untuk penghitungan angsuran PPh Ps. 25 dan lampiran PH/MT)
  </th>
</tr>
<tr>
  <th scope="col">PTKP Suami</th>
  <th scope="col">PTKP Istri</th>
  <th scope="col">PTKP Gabungan</th>
</tr>
</thead>

<tbody id="ptkpMatrixBody">

<tr class="ptkp-group-start" data-suami="tidak-berpenghasilan" data-istri="satu-pemberi">
  <td data-label="Suami" class="ptkp-suami">Tidak berpenghasilan</td>
  <td data-label="Istri">Penghasilan dari satu pemberi kerja</td>
  <td data-label="PTKP - KK" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Suami" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Istri" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">K/Tanggungan</td>
</tr>

<tr data-suami="tidak-berpenghasilan" data-istri="lebih-satu-pemberi">
  <td data-label="Suami" class="ptkp-suami">Tidak berpenghasilan</td>
  <td data-label="Istri">Penghasilan dari &gt; 1 pemberi kerja</td>
  <td data-label="PTKP - KK" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Suami" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Istri" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">K/Tanggungan</td>
</tr>

<tr data-suami="tidak-berpenghasilan" data-istri="usaha-tidak-final">
  <td data-label="Suami" class="ptkp-suami">Tidak berpenghasilan</td>
  <td data-label="Istri">Penghasilan dari usaha yang dikenai PPh tidak final atau pekerjaan bebas</td>
  <td data-label="PTKP - KK" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Suami" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Istri" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">K/Tanggungan</td>
</tr>

<tr data-suami="tidak-berpenghasilan" data-istri="usaha-final-tidak-berpenghasilan">
  <td data-label="Suami" class="ptkp-suami">Tidak berpenghasilan</td>
  <td data-label="Istri">Penghasilan dari usaha yang dikenai PPh final/tidak berpenghasilan</td>
  <td data-label="PTKP - KK" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Suami" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Istri" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Gabungan" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
</tr>


<tr class="ptkp-group-start" data-suami="pph-tidak-final" data-istri="satu-pemberi">
  <td data-label="Suami" class="ptkp-suami">Penghasilan dikenai PPh tidak final</td>
  <td data-label="Istri">Penghasilan dari satu pemberi kerja</td>
  <td data-label="PTKP - KK" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Suami" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Istri" class="ptkp-code">TK/0</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">K/I/Tanggungan</td>
</tr>

<tr data-suami="pph-tidak-final" data-istri="lebih-satu-pemberi">
  <td data-label="Suami" class="ptkp-suami">Penghasilan dikenai PPh tidak final</td>
  <td data-label="Istri">Penghasilan dari &gt; 1 pemberi kerja</td>
  <td data-label="PTKP - KK" class="ptkp-code">K/I/Tanggungan</td>
  <td data-label="PTKP Suami" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Istri" class="ptkp-code">TK/0</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">K/I/Tanggungan</td>
</tr>

<tr data-suami="pph-tidak-final" data-istri="usaha-tidak-final">
  <td data-label="Suami" class="ptkp-suami">Penghasilan dikenai PPh tidak final</td>
  <td data-label="Istri">Penghasilan dari usaha yang dikenai PPh tidak final atau pekerjaan bebas</td>
  <td data-label="PTKP - KK" class="ptkp-code">K/I/Tanggungan</td>
  <td data-label="PTKP Suami" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Istri" class="ptkp-code">TK/0</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">K/I/Tanggungan</td>
</tr>

<tr data-suami="pph-tidak-final" data-istri="usaha-final-tidak-berpenghasilan">
  <td data-label="Suami" class="ptkp-suami">Penghasilan dikenai PPh tidak final</td>
  <td data-label="Istri">Penghasilan dari usaha yang dikenai PPh final/tidak berpenghasilan</td>
  <td data-label="PTKP - KK" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Suami" class="ptkp-code">K/Tanggungan</td>
  <td data-label="PTKP Istri" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">K/Tanggungan</td>
</tr>


<tr class="ptkp-group-start" data-suami="usaha-pph-final" data-istri="satu-pemberi">
  <td data-label="Suami" class="ptkp-suami">Penghasilan dari usaha yang dikenai PPh final</td>
  <td data-label="Istri">Penghasilan dari satu pemberi kerja</td>
  <td data-label="PTKP - KK" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Suami" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Istri" class="ptkp-code">TK/0</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">TK/0</td>
</tr>

<tr data-suami="usaha-pph-final" data-istri="lebih-satu-pemberi">
  <td data-label="Suami" class="ptkp-suami">Penghasilan dari usaha yang dikenai PPh final</td>
  <td data-label="Istri">Penghasilan dari &gt; 1 pemberi kerja</td>
  <td data-label="PTKP - KK" class="ptkp-code">TK/0</td>
  <td data-label="PTKP Suami" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Istri" class="ptkp-code">TK/0</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">TK/0</td>
</tr>

<tr data-suami="usaha-pph-final" data-istri="usaha-tidak-final">
  <td data-label="Suami" class="ptkp-suami">Penghasilan dari usaha yang dikenai PPh final</td>
  <td data-label="Istri">Penghasilan dari usaha yang dikenai PPh tidak final atau pekerjaan bebas</td>
  <td data-label="PTKP - KK" class="ptkp-code">TK/0</td>
  <td data-label="PTKP Suami" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Istri" class="ptkp-code">TK/0</td>
  <td data-label="PTKP Gabungan" class="ptkp-code">TK/0</td>
</tr>

<tr data-suami="usaha-pph-final" data-istri="usaha-final-tidak-berpenghasilan">
  <td data-label="Suami" class="ptkp-suami">Penghasilan dari usaha yang dikenai PPh final</td>
  <td data-label="Istri">Penghasilan dari usaha yang dikenai PPh final/tidak berpenghasilan</td>
  <td data-label="PTKP - KK" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Suami" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Istri" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
  <td data-label="PTKP Gabungan" class="ptkp-none">Tidak diberikan PTKP (-/-)</td>
</tr>

</tbody>
</table>
</div>

<div class="ptkp-mobile-hint">
  <span aria-hidden="true">←</span>
  Geser tabel ke kiri atau kanan untuk melihat seluruh kolom
  <span aria-hidden="true">→</span>
</div>

<div class="ptkp-empty-state" id="ptkpEmptyState" hidden>
  Tidak ada kombinasi yang sesuai dengan filter.
</div>
</section>


<section id="cara-membaca">
<h2>Cara membaca hasil PTKP</h2>

<p>
  Setelah menemukan baris yang sesuai, baca kolom dari kiri ke kanan.
  Kolom <strong>PTKP - KK</strong> menunjukkan isi matriks untuk kondisi
  KK. Tiga kolom berikutnya berada di bawah kelompok
  <strong>PTKP untuk penghitungan angsuran PPh Pasal 25 dan lampiran PH/MT</strong>,
  yaitu PTKP Suami, PTKP Istri, dan PTKP Gabungan.
</p>

<div class="ptkp-code-guide">
  <div>
    <strong>K/Tanggungan</strong>
    <span>Ditampilkan sebagaimana tercantum pada dokumen sumber.</span>
  </div>
  <div>
    <strong>K/I/Tanggungan</strong>
    <span>Ditampilkan sebagaimana tercantum pada dokumen sumber.</span>
  </div>
  <div>
    <strong>TK/0</strong>
    <span>Ditampilkan sebagaimana tercantum pada dokumen sumber.</span>
  </div>
  <div>
    <strong>Tidak diberikan PTKP (-/-)</strong>
    <span>Menunjukkan kolom yang pada matriks sumber dinyatakan tidak diberikan PTKP.</span>
  </div>
</div>
</section>


<section id="sumber">
<h2>Sumber Dokumen</h2>

<div class="ptkp-source-box">
  <span class="ptkp-source-kicker">Lampiran</span>
  <strong>Nota Dinas Direktur Peraturan Perpajakan I</strong>
  <dl>
    <div>
      <dt>Nomor</dt>
      <dd>ND-383/PJ.02/2026</dd>
    </div>
    <div>
      <dt>Tanggal</dt>
      <dd>6 April 2026</dd>
    </div>
  </dl>
  <p>
    <b>Judul lampiran:</b> Matriks Penghasilan Tidak Kena Pajak (PTKP)
    Bagi Suami-Istri baik yang Pemenuhan Hak dan Kewajiban Pajak
    Penghasilan dilakukan oleh Kepala Keluarga (KK) maupun dilakukan
    oleh Masing-Masing Suami-Istri (PH/MT).
  </p>
</div>

<div class="callout callout-orange">
<strong>Catatan penyajian</strong>
<p>
  Artikel ini menata ulang tabel pada dokumen sumber untuk kebutuhan
  tampilan website. Materi pada halaman ini tidak menggantikan dokumen
  sumber.
</p>
</div>
</section>

</div>
