---
layout: artikel-editorial

title: "Daftar Kode CTAS Layanan Administrasi Perpajakan"
hero_title: "Daftar SOP."
hero_accent: "Layanan Coretax."

excerpt: "Cari kode CTAS, nama layanan administrasi perpajakan, jangka waktu penyelesaian, dan dasar hukumnya dalam satu tabel."
description: "Daftar kode CTAS, nama layanan administrasi perpajakan, jangka waktu penyelesaian, dan dasar hukum berdasarkan Lampiran II Daftar Layanan Administrasi."

category: "Administrasi Pajak"

tags:
  - Coretax
  - CTAS
  - Layanan Administrasi
  - Jangka Waktu Penyelesaian
  - Dasar Hukum
  - SOP Layanan

author: "Angga Sukma Dhaniswara"
date_modified: 2026-08-06
reading_time: "8 menit baca"

# URL uji. Jangan permanenkan sebelum tampilan tabel dan filter dipastikan benar.
permalink: /sop-layanan.html

summary_label: "Ringkasan cepat"
summary: "Tabel ini memuat empat informasi utama: Kode Layanan, Nama Layanan, Jangka Waktu Penyelesaian, dan Dasar Hukum. Gunakan pencarian dan filter agar daftar yang panjang lebih mudah ditelusuri."

hero_links:
  - label: "Mulai membaca"
    href: "#cara-menggunakan"
  - label: "Buka tabel layanan"
    href: "#daftar-layanan"

hero_stats:
  - value: "76"
    label: "Baris layanan dalam sumber"
  - value: "24"
    label: "Kelompok awalan kode CTAS"
  - value: "54"
    label: "Layanan dengan jangka waktu tercantum"
  - value: "8"
    label: "Halaman Lampiran II yang ditelusuri"

sidebar_note: "Artikel disusun berdasarkan Lampiran II Daftar Layanan Administrasi. Nomor dan tanggal Nota Dinas pada file sumber masih berupa placeholder."

custom_css:
  - /assets/css/layanan-administrasi-ctas.css?v=20260809-1

custom_js:
  - /assets/js/layanan-administrasi-ctas.js?v=20260809-1
---

<div class="ctas-article">
<section id="cara-menggunakan">
<h2>Cara Menggunakan Daftar Ini</h2>
<div class="ctas-steps">
<article class="ctas-step">
<strong>Cari kata kunci</strong>
<p>
                    Ketik kode CTAS, nama layanan, jenis pajak, atau
                    nomor peraturan.
                  </p>
</article>
<article class="ctas-step">
<strong>Batasi kelompok kode</strong>
<p>
                    Pilih awalan seperti AS.19, AS.34, atau AS.37 untuk
                    mempersempit hasil.
                  </p>
</article>
<article class="ctas-step">
<strong>Periksa sumber asli</strong>
<p>
                    Gunakan tabel sebagai alat bantu, lalu cocokkan lagi
                    dengan regulasi dan dokumen layanan yang berlaku.
                  </p>
</article>
</div>
</section>
<section class="ctas-table-section" id="daftar-layanan">
<div class="ctas-table-heading">
<span class="ctas-section-label">Daftar layanan</span>
<h2>Kode Layanan dan Jangka Waktu Penyelesaian</h2>
<p>
                  Gunakan keyword atau filter untuk memudahkan pencarian.
                </p>
</div>
<div class="ctas-filter-panel" role="search">
<div class="ctas-field">
<label for="serviceSearch">Cari layanan</label>
<input autocomplete="off" id="serviceSearch" placeholder="Contoh: AS.19-01, SKB PPh, PMK-28/2026" type="search"/>
</div>
<div class="ctas-field">
<label for="prefixFilter">Kelompok CTAS</label>
<select id="prefixFilter">
<option value="">Semua kelompok</option>
<option value="AS.01">AS.01</option>
<option value="AS.03">AS.03</option>
<option value="AS.06">AS.06</option>
<option value="AS.07">AS.07</option>
<option value="AS.09">AS.09</option>
<option value="AS.10">AS.10</option>
<option value="AS.11">AS.11</option>
<option value="AS.12">AS.12</option>
<option value="AS.13">AS.13</option>
<option value="AS.14">AS.14</option>
<option value="AS.15">AS.15</option>
<option value="AS.16">AS.16</option>
<option value="AS.18">AS.18</option>
<option value="AS.19">AS.19</option>
<option value="AS.21">AS.21</option>
<option value="AS.23">AS.23</option>
<option value="AS.24">AS.24</option>
<option value="AS.31">AS.31</option>
<option value="AS.32">AS.32</option>
<option value="AS.33">AS.33</option>
<option value="AS.34">AS.34</option>
<option value="AS.35">AS.35</option>
<option value="AS.37">AS.37</option>
<option value="AS.38">AS.38</option>
</select>
</div>
<div class="ctas-field">
<label for="timelineFilter">Jangka waktu</label>
<select id="timelineFilter">
<option value="">Semua</option>
<option value="defined">Tercantum</option>
<option value="none">Tidak dicantumkan (-)</option>
</select>
</div>
<button class="ctas-reset-button" id="resetFilters" type="button">
                  Atur ulang
                </button>
</div>
<div aria-live="polite" class="ctas-result-line">
<span>
                  Menampilkan
                  <strong id="visibleCount">76</strong>
                  dari 76 baris layanan
                </span>
<span>Urutan mengikuti nomor pada sumber.</span>
</div>
<div class="ctas-table-wrapper" id="tableWrapper">
<table class="ctas-service-table">
<thead>
<tr>
<th>Kode</th>
<th>Nama Layanan</th>
<th>Jangka Waktu Penyelesaian</th>
<th>Dasar Hukum</th>
</tr>
</thead>
<tbody id="serviceTableBody">
<tr data-prefix="AS.01" data-search="as.01-03a surat keterangan penelitian formal bukti pemenuhan kewajiban penyetoran pph atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan dan perjanjian pengikatan jual beli atas tanah dan/atau bangunan (validasi ssp pph atas phtb) - pembayaran dengan cara lain penerbitan surat keterangan penelitian formal atau surat pemberitahuan permohonan penelitian formal tidak lengkap/tidak sesuai paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap. pmk-81/2024; per-8/pj/2025: se 28/pj/2020 se 28/pj/2020 (berlaku sepanjang tidak bertentangan dengan pmk-81/2024 dan per- 8/2025) s-48/pj.03/2018 1" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.01-03A</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB) - Pembayaran dengan cara lain
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            Penerbitan Surat Keterangan Penelitian Formal atau Surat Pemberitahuan Permohonan Penelitian Formal Tidak Lengkap/Tidak Sesuai <b>paling lama 3 (tiga) hari kerja </b> setelah tanggal permohonan penelitian diterima lengkap.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024;</li><li>PER-8/PJ/2025:</li><li>SE 28/PJ/2020 SE 28/PJ/2020 (berlaku sepanjang tidak bertentangan dengan PMK-81/2024 dan PER- 8/2025)</li><li>S-48/PJ.03/2018</li></ul></td>
</tr>
<tr data-prefix="AS.01" data-search="as.01-06 pembatalan secara jabatan surat keterangan penelitian formal bukti pemenuhan kewajiban penyetoran pph atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan dan perjanjian pengikatan jual beli atas tanah dan/atau bangunan (validasi ssp pph atas phtb) - pmk-81/2024; per-8/pj/2025: se 28/pj/2020 (berlaku sepanjang tidak bertentangan dengan pmk-81/2024 dan per- 8/2025) 2" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.01-06</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan Secara Jabatan Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB)
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024;</li><li>PER-8/PJ/2025:</li><li>SE 28/PJ/2020 (berlaku sepanjang tidak bertentangan dengan PMK-81/2024 dan PER- 8/2025)</li></ul></td>
</tr>
<tr data-prefix="AS.01" data-search="as.01-06a pembatalan secara jabatan surat keterangan penelitian formal bukti pemenuhan kewajiban penyetoran pph atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan dan perjanjian pengikatan jual beli atas tanah dan/atau bangunan (validasi ssp pph atas phtb) - oleh notaris/ppat - pmk-81/2024; per-8/pj/2025: se 28/pj/2020 (berlaku sepanjang tidak bertentangan dengan pmk-81/2024 dan per- 8/2025) 3" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.01-06A</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan Secara Jabatan Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB) - oleh Notaris/PPAT
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024;</li><li>PER-8/PJ/2025:</li><li>SE 28/PJ/2020 (berlaku sepanjang tidak bertentangan dengan PMK-81/2024 dan PER- 8/2025)</li></ul></td>
</tr>
<tr data-prefix="AS.01" data-search="as.01-07 pembatalan surat keterangan penelitian formal bukti pemenuhan kewajiban penyetoran pph atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan dan perjanjian pengikatan jual beli atas tanah dan/atau bangunan (validasi ssp pph atas phtb) paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap pmk-81/2024; per-8/pj/2025: se 28/pj/2020 (berlaku sepanjang tidak bertentangan dengan pmk-81/2024 dan per- 8/2025) 4" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.01-07</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB)
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>Paling lama 3 (tiga) hari kerja </b>setelah tanggal permohonan penelitian diterima lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024;</li><li>PER-8/PJ/2025:</li><li>SE 28/PJ/2020 (berlaku sepanjang tidak bertentangan dengan PMK-81/2024 dan PER- 8/2025)</li></ul></td>
</tr>
<tr data-prefix="AS.01" data-search="as.01-07a pembatalan (surat keterangan penelitian formal bukti pemenuhan kewajiban penyetoran pph atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan dan perjanjian pengikatan jual beli atas tanah dan/atau bangunan (validasi ssp pph atas phtb) - oleh notaris/ppat) permohonan disampaikan oleh wajib pajak paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap pmk-81/2024; per-8/pj/2025: se 28/pj/2020 5" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.01-07A</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan (Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB) - oleh Notaris/PPAT) Permohonan disampaikan oleh Wajib Pajak
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>Paling lama 3 (tiga) hari kerja </b>setelah tanggal permohonan penelitian diterima lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024;</li><li>PER-8/PJ/2025:</li><li>SE 28/PJ/2020</li></ul></td>
</tr>
<tr data-prefix="AS.01" data-search="as.01-08 penggantian surat keterangan penelitian formal bukti pemenuhan kewajiban penyetoran pph atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan dan perjanjian pengikatan jual beli atas tanah dan/atau bangunan (validasi ssp pph atas phtb) paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap pmk-81/2024; per-8/pj/2025: se 28/pj/2020 6" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.01-08</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas PHTB)
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>Paling lama 3 (tiga) hari kerja </b>setelah tanggal permohonan penelitian diterima lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024;</li><li>PER-8/PJ/2025:</li><li>SE 28/PJ/2020</li></ul></td>
</tr>
<tr data-prefix="AS.01" data-search="as.01-08a penggantian surat keterangan penelitian formal bukti pemenuhan kewajiban penyetoran pph atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan dan perjanjian pengikatan jual beli atas tanah dan/atau bangunan (validasi ssp pph atas phtb) - oleh notaris/ppat paling lama 3 (tiga) hari kerja setelah tanggal permohonan penelitian diterima lengkap pmk-81/2024; per-8/pj/2025: se 28/pj/2020 7" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.01-08A</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Penelitian Formal Bukti Pemenuhan Kewajiban Penyetoran PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan dan Perjanjian Pengikatan Jual Beli atas Tanah dan/atau Bangunan (Validasi SSP PPh atas
            PHTB) - oleh Notaris/PPAT
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>Paling lama 3 (tiga) hari kerja </b>setelah tanggal permohonan penelitian diterima lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024;</li><li>PER-8/PJ/2025:</li><li>SE 28/PJ/2020</li></ul></td>
</tr>
<tr data-prefix="AS.03" data-search="as.03-02 permohonan pengesahan formulir khusus 10 (sepuluh) hari kalender sejak permohonan pengesahan formulir khusus diterima dengan lengkap. pmk-112/2025 per-28/pj/2018 se-31/pj/2019 8" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.03-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permohonan Pengesahan Formulir Khusus
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 10 (sepuluh) hari kalender </strong>sejak permohonan pengesahan Formulir Khusus diterima dengan lengkap.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-112/2025</li><li>PER-28/PJ/2018</li><li>SE-31/PJ/2019</li></ul></td>
</tr>
<tr data-prefix="AS.06" data-search="as.06-03 pembatalan surat keterangan memenuhi kriteria sebagai wajib pajak berdasarkan pp 55 tahun 2022 - secara jabatan - pp 55 tahun 2022 s.t.d.d. pp 20 tahun 2025; pmk 164 tahun 2023; se-47/pj/2020 (se ini masih mengacu ke pp 23/2018); per-09/pj/2019. 9" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.06-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan Surat Keterangan Memenuhi Kriteria Sebagai Wajib Pajak Berdasarkan PP 55 Tahun 2022 - Secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PP 55 Tahun 2022 s.t.d.d. PP 20 Tahun 2025;</li><li>PMK 164 Tahun 2023;</li><li>SE-47/PJ/2020 (SE ini masih mengacu ke PP 23/2018);</li><li>PER-09/PJ/2019.</li></ul></td>
</tr>
<tr data-prefix="AS.06" data-search="as.06-04 pencabutan surat keterangan memenuhi kriteria sebagai wajib pajak berdasarkan pp 55 tahun 2022 - secara jabatan - pp 55 tahun 2022 s.t.d.d. pp 20 tahun 2025; pmk 164 tahun 2023; se-47/pj/2020 (se ini masih mengacu ke pp 23/2018); per-09/pj/2019. 10" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.06-04</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Surat Keterangan Memenuhi Kriteria Sebagai Wajib Pajak Berdasarkan PP 55 Tahun 2022 - Secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PP 55 Tahun 2022 s.t.d.d. PP 20 Tahun 2025;</li><li>PMK 164 Tahun 2023;</li><li>SE-47/PJ/2020 (SE ini masih mengacu ke PP 23/2018);</li><li>PER-09/PJ/2019.</li></ul></td>
</tr>
<tr data-prefix="AS.07" data-search="as.07-02 surat keterangan pembatalan skjln - pmk-178/pmk.04/2017 s.t.d.d. pmk- 106/pmk.04/2019; per-8/pj/2025; se-34/pj/2019 (se ini masih mengacu ke per- 12/pj/2019) 11" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.07-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Pembatalan SKJLN
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-178/PMK.04/2017 s.t.d.d. PMK-</li><li>106/PMK.04/2019;</li><li>PER-8/PJ/2025;</li><li>SE-34/PJ/2019 (SE ini masih mengacu ke PER- 12/PJ/2019)</li></ul></td>
</tr>
<tr data-prefix="AS.09" data-search="as.09-01 penetapan wajib pajak dengan kriteria tertentu 30 hari kerja sejak permohonan diterima secara lengkap pmk-28/2026 se-10/pj/2018 12" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.09-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penetapan Wajib Pajak Dengan Kriteria Tertentu
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 30 hari kerja </strong>sejak permohonan diterima secara lengkap </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-28/2026</li><li>SE-10/PJ/2018</li></ul></td>
</tr>
<tr data-prefix="AS.09" data-search="as.09-02 penetapan pengusaha kena pajak berisiko rendah 15 hari kerja sejak permohonan diterima secara lengkap pmk-28/2026 se-10/pj/2018 13" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.09-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penetapan Pengusaha Kena Pajak Berisiko Rendah
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 15 hari kerja </strong>sejak permohonan diterima secara lengkap </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-28/2026</li><li>SE-10/PJ/2018</li></ul></td>
</tr>
<tr data-prefix="AS.09" data-search="as.09-03 pencabutan penetapan wajib pajak dengan kriteria tertentu secara jabatan - pmk-28/2026 se-10/pj/2018 14" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.09-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Penetapan Wajib Pajak Dengan Kriteria Tertentu secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-28/2026</li><li>SE-10/PJ/2018</li></ul></td>
</tr>
<tr data-prefix="AS.09" data-search="as.09-04 pencabutan penetapan pengusaha kena pajak berisiko rendah secara jabatan - pmk-28/2026 se-10/pj/2018 15" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.09-04</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Penetapan Pengusaha Kena Pajak Berisiko Rendah secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-28/2026</li><li>SE-10/PJ/2018</li></ul></td>
</tr>
<tr data-prefix="AS.10" data-search="as.10-01 penilaian kembali aktiva tetap perusahaan untuk tujuan perpajakan 30 (tiga puluh) hari setelah bukti penerimaan elektronik diterbitkan pmk 79/pmk.03/2008 tentang penilaian kembali aktiva tetap perusahaan untuk tujuan perpajakan per-08/pj/2025 tentang ketentuan pemberian layanan administrasi perpajakan tertentu dalam rangka pelaksanaan sistem inti administrasi perpajakan note : se - 56/pj/2009 terkait per-12/pj/2009 pada per-08/2025 pasal 147 angka 1 dicabut dan dinyatakan tidak berlaku. 16" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.10-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penilaian Kembali Aktiva Tetap Perusahaan Untuk Tujuan Perpajakan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 30 (tiga puluh) hari </strong>setelah bukti penerimaan elektronik diterbitkan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 79/PMK.03/2008</li>
<li>PER-08/PJ/2025</li>
<li>Note : SE - 56/PJ/2009 terkait PER-12/PJ/2009 pada</li><li>PER-08/2025 Pasal 147 angka 1 dicabut dan dinyatakan tidak berlaku.</li></ul></td>
</tr>
<tr data-prefix="AS.10" data-search="as.10-02 angsuran atas selisih lebih penilaian kembali aktiva tetap perusahaan untuk tujuan perpajakan 30 (tiga puluh) hari setelah bukti penerimaan elektronik diterbitkan pmk 79/pmk.03/2008 tentang penilaian kembali aktiva tetap perusahaan untuk tujuan perpajakan per-08/pj/2025 tentang ketentuan pemberian layanan administrasi perpajakan tertentu dalam rangka pelaksanaan sistem inti administrasi perpajakan note : se - 56/pj/2009 terkait per-12/pj/2009 pada per-08/2025 pasal 147 angka 1 dicabut dan dinyatakan tidak berlaku. 17" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.10-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Angsuran atas Selisih Lebih Penilaian Kembali Aktiva Tetap Perusahaan untuk Tujuan Perpajakan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 30 (tiga puluh) hari </strong>setelah bukti penerimaan elektronik diterbitkan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 79/PMK.03/2008</li><li>PER-08/PJ/2025</li><li>Note : SE - 56/PJ/2009 terkait PER-12/PJ/2009 pada</li><li>PER-08/2025 Pasal 147 angka 1 dicabut dan dinyatakan tidak berlaku.</li></ul></td>
</tr>
<tr data-prefix="AS.11" data-search="as.11-01 penetapan kelompok harta berwujud bukan bangunan untuk keperluan penyusutan paling lama 10 (sepuluh) hari kerja terhitung sejak permohonan diterima secara lengkap pmk-72 tahun 2023 tentang penyusutan harta berwujud dan/atau amortisasi harta tak berwujud 18" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.11-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penetapan Kelompok Harta Berwujud Bukan Bangunan untuk Keperluan Penyusutan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lama 10 (sepuluh) hari kerja</strong> terhitung sejak permohonan diterima secara lengkap </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-72 Tahun 2023</td>
</tr>
<tr data-prefix="AS.11" data-search="as.11-02 penetapan masa manfaat yang sesungguhnya atas harta berwujud yang dimiliki dan digunakan dalam bidang usaha tertentu paling lama 10 (sepuluh) hari kerja terhitung sejak permohonan diterima secara lengkap pmk-72 tahun 2023 tentang penyusutan harta berwujud dan/atau amortisasi harta tak berwujud 19" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.11-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penetapan Masa Manfaat yang Sesungguhnya Atas Harta Berwujud yang Dimiliki dan Digunakan Dalam Bidang Usaha Tertentu
			</td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lama 10 (sepuluh) hari kerja</strong> terhitung sejak permohonan diterima secara lengkap </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-72 Tahun 2023</td>
</tr>
<tr data-prefix="AS.11" data-search="as.11-03 penetapan kembali kelompok harta berwujud bukan bangunan untuk keperluan penyusutan secara jabatan - pmk-72 tahun 2023 tentang penyusutan harta berwujud dan/atau amortisasi harta tak berwujud 20" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.11-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penetapan Kembali Kelompok Harta Berwujud Bukan Bangunan untuk Keperluan Penyusutan secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-72 Tahun 2023</td>
</tr>
<tr data-prefix="AS.12" data-search="as.12-01 penetapan atas saat mulainya penyusutan harta berwujud yang dapat dilakukan pada bulan digunakan atau bulan mulai menghasilkan paling lama 10 (sepuluh) hari kerja terhitung sejak permohonan diterima secara lengkap pmk-72 tahun 2023 tentang penyusutan harta berwujud dan/atau amortisasi harta tak berwujud 21" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.12-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penetapan Atas Saat Mulainya Penyusutan Harta Berwujud yang Dapat Dilakukan Pada Bulan Digunakan atau Bulan Mulai Menghasilkan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lama 10 (sepuluh) hari kerja </strong>terhitung sejak permohonan diterima secara lengkap </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-72 Tahun 2023</td>
</tr>
<tr data-prefix="AS.12" data-search="as.12-02 penetapan atas saat mulainya penyusutan harta berwujud yang dapat dilakukan pada bulan digunakan atau bulan mulai menghasilkan 5 (five) working days after case created pmk-72 tahun 2023 tentang penyusutan harta berwujud dan/atau amortisasi harta tak berwujud 22" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.12-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penetapan Atas Saat Mulainya Penyusutan Harta Berwujud yang Dapat Dilakukan Pada Bulan Digunakan atau Bulan Mulai Menghasilkan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 5 (lima) hari kerja</strong> setelah kasus terbentuk </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-72 Tahun 2023</td>
</tr>
<tr data-prefix="AS.13" data-search="as.13-01 penggunaan nilai buku atas pengalihan dan perolehan harta dalam rangka penggabungan, peleburan, pemekaran, atau pengambilalihan usaha 1 (satu) bulan terhitung sejak permohonan diterima lengkap pmk-81 tahun 2024 tentang ketentuan perpajakan dalamrangka pelaksanaan sistem inti administrasi perpajakan per-08/pj/2025 tentang ketentuan pemberian layanan administrasi perpajakan tertentu dalam rangka pelaksanaan sistem inti administrasi perpajakan 23" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.13-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggunaan Nilai Buku atas Pengalihan dan Perolehan Harta Dalam Rangka Penggabungan, Peleburan, Pemekaran, atau Pengambilalihan Usaha
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 1 (satu) bulan</strong> terhitung sejak permohonan diterima lengkap </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81 Tahun 2024 </li><li>PER-08/PJ/2025 </li></ul></td>
</tr>
<tr data-prefix="AS.13" data-search="as.13-02 permohonan perpanjangan jangka waktu memperoleh pernyataan efektif atas pendaftaran dalam rangka penawaran umum perdana (initial public offering) 1 (satu) bulan terhitung sejak permohonan diterima lengkap pmk-81 tahun 2024 tentang ketentuan perpajakan dalamrangka pelaksanaan sistem inti administrasi perpajakan per-08/pj/2025 tentang ketentuan pemberian layanan administrasi perpajakan tertentu dalam rangka pelaksanaan sistem inti administrasi perpajakan 24" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.13-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permohonan Perpanjangan Jangka Waktu Memperoleh Pernyataan Efektif Atas Pendaftaran Dalam Rangka Penawaran Umum Perdana (Initial Public Offering)
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 1 (satu) bulan terhitung sejak </strong>permohonan diterima lengkap</td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81 Tahun 2024 </li><li>PER-08/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.13" data-search="as.13-03 permohonan perpanjangan jangka waktu untuk membubarkan kegiatan usaha 1 (satu) bulan terhitung sejak tanggal diterimanya permohonan secara lengkap. pmk-81 tahun 2024 tentang ketentuan perpajakan dalamrangka pelaksanaan sistem inti administrasi perpajakan per-08/pj/2025 tentang ketentuan pemberian layanan administrasi perpajakan tertentu dalam rangka pelaksanaan sistem inti administrasi perpajakan 25" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.13-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permohonan Perpanjangan Jangka Waktu Untuk Membubarkan Kegiatan Usaha
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 1 (satu) bulan terhitung sejak</strong> tanggal diterimanya permohonan secara lengkap. </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81 Tahun 2024 </li><li>PER-08/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.13" data-search="as.13-04 permohonan pemindahtanganan harta untuk tujuan peningkatan efisiensi perusahaan 1 (satu) bulan terhitung sejak tanggal diterimanya permohonan secara lengkap. pmk-81 tahun 2024 tentang ketentuan perpajakan dalamrangka pelaksanaan sistem inti administrasi perpajakanper-08/pj/2025 tentang ketentuan pemberian layanan administrasi perpajakan tertentu dalam rangka pelaksanaan sistem inti administrasi perpajakan 26" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.13-04</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permohonan Pemindahtanganan Harta untuk Tujuan Peningkatan Efisiensi Perusahaan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 1 (satu) bulan terhitung sejak </strong>tanggal diterimanya permohonan secara
            lengkap. </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-81 Tahun 2024</td>
</tr>
<tr data-prefix="AS.13" data-search="as.13-05 pencabutan penggunaan nilai buku atas pengalihan dan perolehan harta dalam rangka penggabungan, peleburan, pemekaran, atau pengambilalihan usaha (secara jabatan) - per-08/pj/2025 tentang ketentuan pemberian layanan administrasi perpajakan tertentu dalam rangka pelaksanaan sistem inti administrasi perpajakan 27" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.13-05</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Penggunaan Nilai Buku atas Pengalihan dan Perolehan Harta Dalam Rangka Penggabungan, Peleburan, Pemekaran, atau Pengambilalihan Usaha<br/>(secara Jabatan)
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PER-08/PJ/2025</td>
</tr>
<tr data-prefix="AS.14" data-search="as.14-03 izin menyelenggarakan pembukuan dalam bahasa indonesia dan mata uang rupiah untuk selain pma dan but izin menyelenggarakan pembukuan dalam bahasa inggris dan mata uang dollar untuk selain pma dan but 1. paling lama 1 (satu) bulan setelah bukti penerimaan diterbitkan. 2. dalam hal jangka waktu sebagaimana pada angka 1 terlampaui dan belum diterbitkan keputusan, permohonan dianggap diterima dan kepala kantor wilayah menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu terlampaui. pmk-196/pmk.03/2007 stdtd pmk- 123/pmk.03/2019; pmk-81 tahun 2024 tentang ketentuan perpajakan dalamrangka pelaksanaan sistem inti administrasi perpajakan per-08/pj/2025 28" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.14-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
          Izin Menyelenggarakan Pembukuan dalam Bahasa Inggris dan Mata Uang Dollar untuk selain PMA dan BUT
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            1. Paling lama 1 (satu) bulan setelah bukti penerimaan diterbitkan.<br/>2. Dalam hal jangka waktu sebagaimana pada angka 1 terlampaui dan belum diterbitkan keputusan, permohonan dianggap diterima dan Kepala Kantor Wilayah menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu terlampaui.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-196/PMK.03/2007 stdtd PMK-123/PMK.03/2019;</li><li>PMK-81 Tahun 2024</li><li>PER-08/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.14" data-search="as.14-05 izin menyelenggarakan pembukuan dalam bahasa indonesia dan mata uang rupiah paling lambat 1 (satu) bulan setelah permohonan dari wajib pajak diterima lengkap pmk-196/pmk.03/2007 stdtd pmk- 123/pmk.03/2019; pmk-81 tahun 2024 tentang ketentuan perpajakan dalamrangka pelaksanaan sistem inti administrasi perpajakan per-08/pj/2025 29" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.14-05</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Izin Menyelenggarakan Pembukuan dalam Bahasa Indonesia dan Mata Uang Rupiah
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> Paling lambat 1 (satu) bulan setelah</strong> permohonan dari Wajib Pajak diterima lengkap </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-196/PMK.03/2007 stdtd PMK-123/PMK.03/2019;</li><li>PMK-81 Tahun 2024</li><li>PER-08/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.14" data-search="as.14-06 penerbitan kembali izin menyelenggarakan pembukuan dengan menggunakan bahasa inggris dan satuan mata uang dollar amerika serikat paling lambat 1 (satu) bulan sejak permohonan diterima secara elektronik melalui portal wajib pajak pmk-196/pmk.03/2007 stdtd pmk- 123/pmk.03/2019; pmk-81 tahun 2024 tentang ketentuan perpajakan dalamrangka pelaksanaan sistem inti administrasi perpajakan per-08/pj/2025 30" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.14-06</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penerbitan Kembali Izin Menyelenggarakan Pembukuan dengan Menggunakan Bahasa Inggris dan Satuan Mata Uang Dollar Amerika Serikat
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> Paling lambat 1 (satu) bulan sejak</strong> permohonan diterima secara elektronik melalui Portal Wajib Pajak </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-196/PMK.03/2007 stdtd PMK-123/PMK.03/2019;</li><li>PMK-81 Tahun 2024</li><li>PER-08/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.14" data-search="as.14-07 pencabutan izin menyelenggarakan pembukuan dengan menggunakan bahasa inggris dan satuan mata uang dollar amerika serikat secara jabatan - pmk-196/pmk.03/2007 stdtd pmk- 123/pmk.03/2019; pmk-81 tahun 2024 tentang ketentuan perpajakan dalamrangka pelaksanaan sistem inti administrasi perpajakan per-08/pj/2025 31" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.14-07</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Izin Menyelenggarakan Pembukuan dengan Menggunakan Bahasa Inggris dan Satuan Mata Uang Dollar Amerika Serikat secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-196/PMK.03/2007 stdtd PMK-123/PMK.03/2019;</li><li>PMK-81 Tahun 2024</li><li>PER-08/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.15" data-search="as.15-03 permintaan perubahan metode pembukuan yang kedua dan selanjutnya paling lama 15 (lima belas) hari kerja setelah bukti penerimaan elektronik diterbitkan. (pasal 11 per 8/2025) apabila dalam jangka waktu sebagaimana dimaksud pada ayat (2) direktur jenderal pajak belum menerbitkan keputusan, permohonan wajib pajak dianggap disetujui. (4) terhadap permohonan yang dianggap disetujui sebagaimana dimaksud pada ayat (3), direktur jenderal pajak menerbitkan keputusan persetujuan permohonan atas perubahan metode pembukuan dan/atau tahun buku dalam jangka waktu paling lama 5 (lima) hari kerja sejak jangka waktu sebagaimana dimaksud pada ayat (2) terlampaui. 'pmk 196/pmk.03/2007sttd 123/pmk.03/2019 pmk-81 tahun 2024 per-8/pj/2025 32" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.15-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permintaan Perubahan Metode Pembukuan Yang Kedua dan Selanjutnya
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            Paling lama 15 (lima belas) hari kerja setelah bukti penerimaan elektronik diterbitkan. (Pasal 11 PER 8/2025)<br/>Apabila dalam jangka waktu sebagaimana dimaksud pada ayat (2) Direktur Jenderal Pajak belum menerbitkan keputusan, permohonan Wajib Pajak dianggap disetujui.<br/>(4) Terhadap permohonan yang dianggap disetujui sebagaimana dimaksud pada ayat (3), Direktur Jenderal Pajak menerbitkan keputusan persetujuan permohonan atas perubahan metode Pembukuan dan/atau tahun buku dalam jangka waktu paling lama 5 (lima) hari kerja sejak jangka waktu sebagaimana dimaksud pada ayat (2) terlampaui.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 196/PMK.03/2007 sttd 123/PMK.03/2019</li>
<li>PMK-81 Tahun 2024</li><li>PER-8/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.15" data-search="as.15-04 permintaan perubahan tahun buku yang kedua dan selanjutnya paling lama 15 (lima belas) hari kerja setelah bukti penerimaan elektronik diterbitkan. (pasal 11 per 8/2025) apabila dalam jangka waktu sebagaimana dimaksud pada ayat (2) direktur jenderal pajak belum menerbitkan keputusan, permohonan wajib pajak dianggap disetujui. (4) terhadap permohonan yang dianggap disetujui sebagaimana dimaksud pada ayat (3), direktur jenderal pajak menerbitkan keputusan persetujuan permohonan atas perubahan metode pembukuan dan/atau tahun buku dalam jangka waktu paling … [kelanjutan kalimat terpotong pada sumber pdf.] 'pmk 196/pmk.03/2007sttd 123/pmk.03/2019 pmk-81 tahun 2024 per-8/pj/2025 33" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.15-04</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permintaan Perubahan Tahun Buku Yang Kedua dan Selanjutnya
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> Paling lama 15 (lima belas) hari kerja</strong> setelah bukti penerimaan elektronik diterbitkan. </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 196/PMK.03/2007 sttd 123/PMK.03/2019</li>
<li>PMK-81 Tahun 2024</li><li>PER-8/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-01 izin pembuatan meterai teraan paling lama 5 (lima) hari kerja terhitung sejak tanggal bukti penerimaan. pmk nomor 78 tahun 2024 34" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Izin Pembuatan Meterai Teraan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            Paling lama 5 (lima) hari kerja terhitung sejak tanggal Bukti Penerimaan.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-02 pembetulan izin pembuatan meterai teraan berdasarkan permohonan wajib pajak 10 (ten) working days after receipt letter (bpe/bps) generated* pmk nomor 78 tahun 2024 35" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembetulan Izin Pembuatan Meterai Teraan Berdasarkan Permohonan Wajib Pajak
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 10 (sepuluh) hari setelah</strong> Bukti Penerimaan diterbitkan (BPE/BPS) </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-03 pencabutan izin pembuatan meterai teraan berdasarkan permohonan wajib pajak paling lama 5 (lima) hari kerja terhitung sejak tanggal bukti penerimaan pmk nomor 78 tahun 2024 36" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Izin Pembuatan Meterai Teraan Berdasarkan Permohonan Wajib Pajak
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lama 5 (lima) hari kerja</strong> terhitung sejak tanggal Bukti Penerimaan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-04 pencabutan izin pembuatan meterai teraan secara jabatan - pmk nomor 78 tahun 2024 37" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-04</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Izin Pembuatan Meterai Teraan Secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-05 izin pembuatan meterai komputerisasi paling lama 5 (lima) hari kerja terhitung sejak tanggal bukti penerimaan pmk nomor 78 tahun 2024 38" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-05</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Izin Pembuatan Meterai Komputerisasi
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lama 5 (lima) hari kerja</strong> terhitung sejak tanggal Bukti Penerimaan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-07 laporan pembuatan meterai komputerisasi paling lambat tanggal 10 (sepuluh) bulan berikutnya pmk nomor 78 tahun 2024 39" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-07</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Laporan Pembuatan Meterai Komputerisasi
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lambat tanggal 10 (sepuluh) bulan berikutnya </strong></td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-07 pencabutan izin pembuatan meterai komputerisasi secara jabatan - pmk nomor 78 tahun 2024 40" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-07</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Izin Pembuatan Meterai Komputerisasi Secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-08 izin pembuatan meterai percetakan paling lama 5 (lima) hari kerja terhitung sejak tanggal bukti penerimaan pmk nomor 78 tahun 2024 41" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-08</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Izin Pembuatan Meterai Percetakan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lama 5 (lima) hari kerja</strong> terhitung sejak 
            tanggal Bukti Penerimaan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-10 pencabutan izin pembuatan meterai percetakan secara jabatan - pmk nomor 78 tahun 2024 42" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-10</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Izin Pembuatan Meterai Percetakan secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-11 unlock mesin teraan meterai digital paling lama 1 (satu) bulan terhitung sejak bukti penerimaan pmk nomor 78 tahun 2024 43" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-11</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Unlock Mesin Teraan Meterai Digital
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lama 1 (satu) bulan terhitung sejak</strong> Bukti Penerimaan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.16" data-search="as.16-12 pencabutan izin pembuatan meterai komputerisasi berdasarkan permohonan wajib pajak - pmk nomor 78 tahun 2024 44" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.16-12</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan Izin Pembuatan Meterai Komputerisasi berdasarkan Permohonan Wajib Pajak
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 78 Tahun 2024</td>
</tr>
<tr data-prefix="AS.18" data-search="as.18-01 pengurangan angsuran pph pasal 25 30 (tiga puluh) hari setelah bukti penerimaan diterbitkan per-11/pj/2025 45" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.18-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pengurangan Angsuran PPh Pasal 25
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 30 (tiga puluh) hari setelah</strong> bukti penerimaan diterbitkan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PER-11/PJ/2025</td>
</tr>
<tr data-prefix="AS.19" data-search="as.19-01 skb pph pasal 21/pasal 22 selain impor, pasal 22 impor/pph pasal 23 paling lama 5 (lima) hari kerja setelah bukti penerimaan diterbitkan per-8/pj/2025 46" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.19-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            SKB PPh Pasal 21/Pasal 22 selain impor, Pasal 22 impor/PPh Pasal 23
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> paling lama 5 (lima) hari kerja setelah</strong> bukti<br/>
            penerimaan diterbitkan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PER-8/PJ/2025</td>
</tr>
<tr data-prefix="AS.19" data-search="as.19-05 surat keterangan bebas pph atas penghasilan dari pengalihan hak atas tanah dan/atau bangunan 1. 3 (tiga) hari kerja setelah tanggal permohonan surat keterangan bebas diterima secara lengkap; atau 2. 10 (sepuluh) hari kerja setelah tanggal permohonan surat keterangan bebas diterima secara lengkap untuk skb atas pembayaran. pp 34 tahun 2016 pmk-81/2024 (administrasi) per 8/pj/2025 se-20/pj/2015 (waris) se 30/pj/2013 (real estate) 47" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.19-05</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Bebas PPh atas Penghasilan dari Pengalihan Hak atas Tanah dan/atau Bangunan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            1. 3 (tiga) hari kerja setelah tanggal permohonan surat keterangan bebas diterima secara lengkap; atau<br/>2. 10 (sepuluh) hari kerja setelah tanggal permohonan surat keterangan bebas diterima secara lengkap untuk SKB atas pembayaran.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PP 34 Tahun 2016</li><li>PMK-81/2024 (administrasi)</li><li>PER 8/PJ/2025</li><li>SE-20/PJ/2015 (waris)</li><li>SE 30/PJ/2013 (real estate)</li></ul></td>
</tr>
<tr data-prefix="AS.19" data-search="as.19-06 pencabutan skb pph - pmk-81/2024 per 8/pj/2025 48" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.19-06</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pencabutan SKB PPh
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024</li><li>PER 8/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.19" data-search="as.19-06a pembatalan surat keterangan bebas pajak penghasilan - pmk-81/2024 per 8/pj/2025 49" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.19-06A</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan Surat Keterangan bebas Pajak penghasilan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-81/2024</li><li>PER 8/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.21" data-search="as.21-01 permohonan pengangsuran pembayaran pph pasal 29 3 hari kerja sejak bukti penerimaan surat (bps) diterbitkan 18/pmk.03/2021 pmk nomor 81 tahun 2024 50" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.21-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permohonan Pengangsuran Pembayaran PPh Pasal 29
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 3 (tiga) hari kerja sejak</strong> Bukti Penerimaan Surat (BPS) diterbitkan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>18/PMK.03/2021</li><li>PMK Nomor 81 Tahun 2024</li></ul></td>
</tr>
<tr data-prefix="AS.21" data-search="as.21-02 permohonan penundaan pembayaran pph pasal 29 3 hari kerja sejak bukti penerimaan surat (bps) diterbitkan pmk 18/pmk.03/2021 pmk nomor 81 tahun 2024 51" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.21-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permohonan Penundaan Pembayaran PPh Pasal 29
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 3 (tiga) hari kerja sejak </strong>Bukti Penerimaan Surat (BPS) diterbitkan </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 18/PMK.03/2021</li><li>PMK Nomor 81 Tahun 2024</li></ul></td>
</tr>
<tr data-prefix="AS.23" data-search="as.23-01 penetapan daerah tertentu 1. surat permintaan kelengkapan dokumen dapat disampaikan paling lama 15 hari kerja sejak diterimanya permohonan (dalam hal permohonan dinyatakan belum lengkap berdasarkan penelitian); 2. wajib pajak melengkapi dokumen dalam surat permintaan paling lama 10 hari kerja sejak surat permintaan kelengkapan dokumen diterima; 3. keputusan persetujuan/penolakan diterbitkan paling lama 4 bulan setelah permohonan telah lengkap berdasarkan penelitian; 4. apabila jangka waktu sebagaimana dimaksud angka 3 terlampaui dan kepala kantor wilayah djp tidak memberikan keputusan, maka permohonan wajib pajak dianggap disetujui terhitung sejak masa pajak jangka waktu sebagaimana dimaksud angka 3 berakhir, dan kepala kantor wilayah djp menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu sebagaimana dimaksud angka 3 berakhir. pp-55 tahun 2022; pmk-66 tahun 2023 52" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.23-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penetapan Daerah Tertentu
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            1. Surat Permintaan Kelengkapan Dokumen dapat disampaikan paling lama 15 hari kerja sejak diterimanya permohonan (dalam hal permohonan dinyatakan belum lengkap berdasarkan penelitian);<br/>2. Wajib Pajak melengkapi dokumen dalam surat permintaan paling lama 10 hari kerja sejak Surat Permintaan Kelengkapan Dokumen diterima;<br/>3. Keputusan Persetujuan/Penolakan diterbitkan paling lama 4 bulan setelah permohonan telah lengkap berdasarkan penelitian;<br/>4. Apabila jangka waktu sebagaimana dimaksud angka 3 terlampaui dan Kepala Kantor Wilayah DJP tidak memberikan keputusan, maka permohonan Wajib Pajak dianggap disetujui terhitung sejak Masa Pajak jangka waktu sebagaimana dimaksud angka 3 berakhir, dan Kepala Kantor Wilayah DJP menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu sebagaimana dimaksud angka 3 berakhir.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PP-55 Tahun 2022;</li><li>PMK-66 Tahun 2023</li></ul></td>
</tr>
<tr data-prefix="AS.23" data-search="as.23-02 perpanjangan penetapan daerah tertentu a. bagi pemberi kerja selain pemegang izin pertambangan tertentu: 1. surat permintaan kelengkapan dokumen dapat disampaikan paling lama 15 hari kerja sejak diterimanya permohonan (dalam hal permohonan dinyatakan belum lengkap berdasarkan penelitian); 2. wajib pajak melengkapi dokumen dalam surat permintaan paling lama 10 hari kerja sejak surat permintaan kelengkapan dokumen diterima; 3. keputusan persetujuan/penolakan diterbitkan paling lama 4 bulan setelah permohonan telah lengkap berdasarkan penelitian; 4. apabila jangka waktu sebagaimana dimaksud angka 3 terlampaui dan kepala kantor wilayah djp tidak memberikan keputusan, maka permohonan wajib pajak dianggap disetujui terhitung sejak masa pajak jangka waktu sebagaimana dimaksud angka 3 berakhir, dan kepala kantor wilayah djp menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu sebagaimana dimaksud angka 3 berakhir. b. bagi pemberi kerja pemegang izin pertambangan tertentu: 1. keputusan persetujuan atau pemberitahuan penghentian perpanjangan (secara jabatan) diterbitkan paling lambat pada tanggal berakhirnya jangka waktu pada keputusan persetujuan penetapan sebelumnya. 2. apabila jangka waktu sebagaimana dimaksud angka 1 terlampaui dan kepala kantor wilayah djp … [kelanjutan kalimat terpotong/bertumpuk pada sumber pdf.] pp-55 tahun 2022; pmk-66 tahun 2023 53" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.23-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Perpanjangan Penetapan Daerah Tertentu
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            A. Bagi pemberi kerja selain pemegang izin pertambangan tertentu:<br/>1. Surat Permintaan Kelengkapan Dokumen dapat disampaikan paling lama 15 hari kerja sejak diterimanya permohonan (dalam hal permohonan dinyatakan belum lengkap berdasarkan penelitian);<br/>2. Wajib Pajak melengkapi dokumen dalam surat permintaan paling lama 10 hari kerja sejak Surat Permintaan Kelengkapan Dokumen diterima;<br/>3. Keputusan Persetujuan/Penolakan diterbitkan paling lama 4 bulan setelah permohonan telah lengkap berdasarkan penelitian;<br/>4. Apabila jangka waktu sebagaimana dimaksud angka 3 terlampaui dan Kepala Kantor Wilayah DJP tidak memberikan keputusan, maka permohonan Wajib Pajak dianggap disetujui terhitung sejak Masa Pajak jangka waktu sebagaimana dimaksud angka 3 berakhir, dan Kepala Kantor Wilayah DJP menerbitkan keputusan persetujuan paling lama 5 hari kerja setelah jangka waktu sebagaimana dimaksud angka 3 berakhir.<br/><br/>B. Bagi pemberi kerja pemegang izin pertambangan tertentu:<br/>1. Keputusan persetujuan atau pemberitahuan penghentian perpanjangan (secara jabatan) diterbitkan paling lambat pada tanggal berakhirnya jangka waktu pada keputusan persetujuan penetapan sebelumnya.<br/>2. Apabila jangka waktu sebagaimana dimaksud angka 1 terlampaui dan Kepala Kantor Wilayah DJP …<br/>[Kelanjutan kalimat terpotong/bertumpuk pada sumber PDF.]
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PP-55 Tahun 2022;</li><li>PMK-66 Tahun 2023</li></ul></td>
</tr>
<tr data-prefix="AS.24" data-search="as.24-01 permohonan penilaian harta untuk tujuan penyampaian spt masa pph final pengungkapan harta bersih 1 bulan sejak berkas diterima. uu no.11 tahun 2016 tentang pengampunan pajak pmk no.165/pmk.03/2017 tentang perubahan kedua atas peraturan menteri keuangan nomor 118/pmk.03/2016 tentang pelaksanaan uu no.11 tahun 2016 tentang pengampunan pajak per-23/pj/2017 tentang tata cara penyampaian surat pemberitahuan masa pajak penghasilan final pengungkapan harta bersih 54" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.24-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Permohonan Penilaian Harta untuk Tujuan Penyampaian SPT Masa PPh Final Pengungkapan Harta Bersih
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<strong> 1 (satu) bulan </strong>sejak berkas diterima. </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>UU No.11 Tahun 2016</li><li>PMK No.165/PMK.03/2017 </li><li>PER-23/PJ/2017</li></ul></td>
</tr>
<tr data-prefix="AS.31" data-search="as.31-01 surat keterangan fasilitas perpajakan untuk kegiatan hulu minyak dan gas bumi-eksplorasi 7 (tujuh) hari kerja setelah permohonan diterima secara lengkap. pmk 122/pmk.03/2019 55" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.31-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Fasilitas Perpajakan untuk kegiatan hulu minyak dan gas bumi-Eksplorasi
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>7 (tujuh) hari kerja </b><strong>setelah </strong>permohonan diterima secara lengkap.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 122/PMK.03/2019</li></ul></td>
</tr>
<tr data-prefix="AS.31" data-search="as.31-02 surat keterangan fasilitas perpajakan untuk kegiatan hulu minyak dan gas bumi-eksploitasi 7 (tujuh) hari kerja setelah permohonan diterima secara lengkap. pmk 122/pmk.03/2019 56" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.31-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Fasilitas Perpajakan untuk kegiatan hulu minyak dan gas bumi-Eksploitasi
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>7 (tujuh) hari kerja </b> <strong> setelah</strong> permohonan diterima secara lengkap. </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 122/PMK.03/2019</li></ul></td>
</tr>
<tr data-prefix="AS.31" data-search="as.31-03 surat keterangan fasilitas perpajakan untuk kegiatan hulu minyak dan gas bumi-gross split 7 (tujuh) hari kerja setelah permohonan diterima secara lengkap. pmk nomor 67/pmk.03/2020 pemberian fasilitas pajak pertambahan nilai atau pajak pertambahan nilai dan pajak penjualan atas barang mewah, serta pajak bumi dan bangunan pada kegiatan usaha hulu minyak dan gas bumi dengan kontrak bagi hasil gross split 57" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.31-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Fasilitas Perpajakan untuk kegiatan hulu minyak dan gas bumi-Gross Split
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>7 (tujuh) hari kerja </b><strong>setelah </strong>permohonan diterima secara lengkap.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK nomor 67/PMK.03/2020</td>
</tr>
<tr data-prefix="AS.31" data-search="as.31-04 penggantian surat keterangan fasilitas perpajakan untuk kegiatan hulu minyak dan gas bumi-gross split 7 (tujuh) hari kerja setelah permohonan diterima secara lengkap. pmk nomor 67/pmk.03/2020 pemberian fasilitas pajak pertambahan nilai atau pajak pertambahan nilai dan pajak penjualan atas barang mewah, serta pajak bumi dan bangunan pada kegiatan usaha hulu minyak dan gas bumi dengan kontrak bagi hasil gross split 58" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.31-04</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Fasilitas Perpajakan untuk kegiatan hulu minyak dan gas bumi-Gross Split
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>7 (tujuh) hari kerja </b> <strong> setelah </strong>permohonan diterima secara lengkap. </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK nomor 67/PMK.03/2020 </td>
</tr>
<tr data-prefix="AS.31" data-search="as.31-05 pemberitahuan surat keterangan fasiltias perpajakan tidak berlaku (ex officio-core only) - pmk 122/pmk.03/2019, pmk 67/pmk.03/2020 59" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.31-05</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pemberitahuan Surat Keterangan Fasiltias Perpajakan tidak berlaku (Ex Officio-Core Only)
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 122/PMK.03/2019</li><li> PMK 67/PMK.03/2020</li></ul></td>
</tr>
<tr data-prefix="AS.32" data-search="as.32-01 penundaan pembebanan kerugian atas pengalihan atau penarikan harta yang mendapatkan penggantian asuransi untuk dibukukan sebagai beban masa kemudian 10 hari kerja terhitung sejak permohonan diterima secara lengkap pmk no 72 tahun 2023 tentang penyusutan harta berwujud dan/atau amortisasi harta tak berwujud 60" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.32-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penundaan Pembebanan Kerugian atas Pengalihan atau Penarikan Harta yang Mendapatkan Penggantian Asuransi untuk Dibukukan Sebagai Beban Masa Kemudian
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>10 (sepuluh) Hari Kerja terhitung sejak</b> permohonan diterima secara lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK No 72 Tahun 2023</td>
</tr>
<tr data-prefix="AS.33" data-search="as.33-02 pembatalan endorsement secara jabatan - pmk-173/pmk.03/2021 se-23/pj/2022 61" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.33-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan Endorsement Secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK-173/PMK.03/2021</li><li>SE-23/PJ/2022</li></ul></td>
</tr>
<tr data-prefix="AS.34" data-search="as.34-01 surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu dan/atau penyerahan jasa kena pajak tertentu untuk setiap impor atau penyerahan 5 (lima) hari kerja pmk 157/pmk.03/2023 s.t.d.d. pmk 45 tahun 2025 per-7/pj/2025 62" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.34-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu dan/atau Penyerahan Jasa Kena Pajak Tertentu Untuk Setiap Impor atau Penyerahan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja</b>
</td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 157/PMK.03/2023 s.t.d.d. PMK 45 TAHUN 2025</li><li>PER-7/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.34" data-search="as.34-02 penggantian surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu dan/atau penyerahan jasa kena pajak tertentu 5 (lima) hari kerja setelah permohonan surat keterangan bebas pengganti diterima lengkap. pmk 157/pmk.03/2023 s.t.d.d. pmk 45 tahun 2025 per-7/pj/2025 63" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.34-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu dan/atau Penyerahan Jasa Kena Pajak Tertentu
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b> setelah permohonan Surat<br/>Keterangan Bebas pengganti diterima lengkap.
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 157/PMK.03/2023 s.t.d.d. PMK 45 TAHUN 2025</li><li>PER-7/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.34" data-search="as.34-03 penggantian surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu dan/atau penyerahan jasa kena pajak tertentu secara jabatan - pmk 157/pmk.03/2023 s.t.d.d. pmk 45 tahun 2025 per-7/pj/2025 64" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.34-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu dan/atau Penyerahan Jasa Kena Pajak Tertentu secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 157/PMK.03/2023 s.t.d.d. PMK 45 TAHUN 2025</li><li>PER-7/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.34" data-search="as.34-07 pembatalan surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu dan/atau penyerahan jasa kena pajak tertentu - pmk 157/pmk.03/2023 s.t.d.d. pmk 45 tahun 2025 per-7/pj/2025 65" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.34-07</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu dan/atau Penyerahan Jasa Kena Pajak Tertentu
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 157/PMK.03/2023 s.t.d.d. PMK 45 TAHUN 2025</li><li>PER-7/PJ/2025</li></ul></td>
</tr>
<tr data-prefix="AS.35" data-search="as.35-01b surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu yang bersifat strategis tipe a (masterlist bea masuk) - pengajuan oleh epc 5 (lima) hari kerja setelah permohonan skb ppn disampaikan secara lengkap peraturan menteri keuangan nomor 115/pmk.03/2021; se-58/pj/2021 66" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.35-01b</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis Tipe A (Masterlist Bea Masuk) - Pengajuan oleh EPC
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b>setelah permohonan SKB PPN disampaikan secara lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 115/PMK.03/2021</li><li>SE-58/PJ/2021</li></ul></td>
</tr>
<tr data-prefix="AS.35" data-search="as.35-02 surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu yang bersifat strategis tipe b (non-masterlist bea masuk dengan/tanpa epc) 5 (lima) hari kerja setelah permohonan skb ppn disampaikan secara lengkap peraturan menteri keuangan nomor 115/pmk.03/2021; se-58/pj/2021 67" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.35-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis Tipe B (Non-Masterlist Bea Masuk dengan/tanpa EPC)
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b> setelah permohonan SKB PPN disampaikan secara lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK 115/PMK.03/2021</li><li>SE-58/PJ/2021</li></ul></td>
</tr>
<tr data-prefix="AS.35" data-search="as.35-04 penggantian surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu yang bersifat strategis 5 (lima) hari kerja setelah permohonan diterima lengkap pmk-115/pmk.03/2021 68" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.35-04</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b>setelah permohonan<br/>diterima lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-115/PMK.03/2021</td>
</tr>
<tr data-prefix="AS.35" data-search="as.35-05 penggantian surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu yang bersifat strategis secara jabatan - pmk-115/pmk.03/2021 69" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.35-05</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-115/PMK.03/2021</td>
</tr>
<tr data-prefix="AS.35" data-search="as.35-06 pembatalan/pencabutan surat keterangan bebas ppn atas impor dan/atau penyerahan barang kena pajak tertentu yang bersifat strategis secara jabatan - pmk-115/pmk.03/2021 70" data-timeline="none">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.35-06</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Pembatalan/Pencabutan Surat Keterangan Bebas PPN atas Impor dan/atau Penyerahan Barang Kena Pajak Tertentu yang Bersifat Strategis secara Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
            -
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-115/PMK.03/2021</td>
</tr>
<tr data-prefix="AS.37" data-search="as.37-01 skb pajak pertambahan nilai atau pajak pertambahan nilai dan pajak penjualan atas barang mewah kepada perwakilan negara asing dan badan internasional serta pejabatnya 5 hari kerja (elektronik), 1 bulan (langsung/pos/kurir/jasa ekpedisi) peraturan menteri keuangan nomor 59 tahun 2024 tentang tata cara pemberian pembebasan pajak pertambahan nilai atau pajak pertambahan nilai dan pajak penjualan atas barang mewah kepada perwakilan negara asing dan badan internasional serta pejabatnya 71" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.37-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            SKB Pajak Pertambahan Nilai atau Pajak<br/>Pertambahan Nilai dan Pajak Penjualan Atas Barang Mewah Kepada Perwakilan Negara Asing dan Badan Internasional Serta Pejabatnya
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja (elektronik), 1 bulan (langsung/pos/kurir/jasa ekpedisi)</b>
</td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK Nomor 59 Tahun 2024</td>
</tr>
<tr data-prefix="AS.37" data-search="as.37-01 surat keterangan bebas ppnbm atas impor atau penyerahan kendaraan bermotor 5 hari kerja setelah permohonan skb ppnbm diterima lengkap pmk no. 42/pmk.010/2022 tentang perubahan atas peraturan menteri keuangan nomor 141/pmk.010/2021 tentang penetapan jenis kendaraan bermotor yang dikenai pajak penjualan atas barang mewah dan tata cara pengenaan, pemberian dan penatausahaan pembebasan, dan pengembalian pajak penjualan atas barang mewah 72" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.37-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Surat Keterangan Bebas PPnBM atas Impor atau Penyerahan Kendaraan Bermotor
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b>setelah permohonan SKB PPnBM diterima lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-141/PMK.010/2021 s.t.d.t.d PMK-42/PMK.010/2022</td>
</tr>
<tr data-prefix="AS.37" data-search="as.37-02 penggantian surat keterangan bebas ppnbm atas impor atau penyerahan kendaraan bermotor 5 hari kerja setelah surat permohonan diterima lengkap pmk no. 42/pmk.010/2022 tentang perubahan atas peraturan menteri keuangan nomor 141/pmk.010/2021 tentang penetapan jenis kendaraan bermotor yang dikenai pajak penjualan atas barang mewah dan tata cara pengenaan, pemberian dan penatausahaan pembebasan, dan pengembalian pajak penjualan atas barang mewah 73" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.37-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Bebas PPnBM atas Impor atau Penyerahan Kendaraan Bermotor
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b>setelah surat permohonan diterima lengkap
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-141/PMK.010/2021 s.t.d.t.d PMK-42/PMK.010/2022</td>
</tr>
<tr data-prefix="AS.37" data-search="as.37-03 penggantian surat keterangan bebas ppnbm atas impor atau penyerahan kendaraan bermotor - jabatan 5 (five) working days after case created pmk-141/pmk.010/2021 s.t.d.t.d pmk- 42/pmk.010/2022 74" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.37-03</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian Surat Keterangan Bebas PPnBM atas Impor atau Penyerahan Kendaraan Bermotor - Jabatan
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b> setelah kasus terbentuk
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK-141/PMK.010/2021 s.t.d.t.d PMK-42/PMK.010/2022</td>
</tr>
<tr data-prefix="AS.38" data-search="as.38-01 skb ppnbm atas bkp selain kendaraan bermotor 5 hari kerja setelah bukti penerimaan diterbitkan pmk- 96/pmk.03/2021 s.t.d.t.d. pmk- 15/pmk.03/2023 per 07/2025 76" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.38-01</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            SKB PPnBM atas BKP Selain Kendaraan Bermotor
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b>setelah bukti penerimaan diterbitkan
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum"><ul class="ctas-legal-list"><li>PMK- 96/PMK.03/2021 s.t.d.t.d. PMK-</li><li>15/PMK.03/2023</li><li>PER 07/2025</li></ul></td>
</tr>
<tr data-prefix="AS.38" data-search="as.38-02 penggantian skb ppnbm atas bkp selain kendaraan bermotor 5 hari kerja setelah bukti penerimaan diterbitkan pmk- 96/pmk.03/2021 s.t.d.t.d. pmk- 15/pmk.03/2023 77" data-timeline="defined">
<td data-label="Kode CTAS">
<span class="ctas-code">AS.38-02</span>
</td>
<td class="ctas-service-name" data-label="Nama layanan">
            Penggantian SKB PPnBM atas BKP Selain Kendaraan Bermotor
          </td>
<td class="ctas-timeline-cell" data-label="Jangka waktu penyelesaian">
<b>5 (lima) hari kerja </b>setelah bukti penerimaan diterbitkan
          </td>
<td class="ctas-legal-cell" data-label="Dasar hukum">PMK- 96/PMK.03/2021 s.t.d.t.d. PMK-15/PMK.03/2023</td>
</tr>
</tbody>
</table>
</div>
<div class="ctas-empty-state" id="emptyState">
                Tidak ada layanan yang sesuai dengan pencarian atau
                filter yang dipilih.
              </div>
<noscript>
<div class="ctas-callout ctas-callout-orange">
<strong>JavaScript tidak aktif</strong>
<p>
                    Seluruh tabel tetap dapat dibaca, tetapi pencarian
                    dan filter tidak tersedia.
                  </p>
</div>
</noscript>
</section>
<section id="catatan-sumber">
<div class="ctas-callout ctas-callout-orange">
<strong>Catatan Kabayan</strong>
<p>
                  Jangka waktu dalam tabel mengikuti redaksi dokumen
                  sumber. Untuk penggunaan resmi, periksa kembali
                  regulasi, saluran penyampaian, kelengkapan permohonan,
                  dan ketentuan yang berlaku pada saat layanan diajukan.
                </p>
</div>
</section>
</div>
