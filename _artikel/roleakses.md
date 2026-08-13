---
layout: artikel-editorial

title: "Memahami Role Akses Coretax: Siapa Boleh Melakukan Apa?"
hero_title: "Memahami Role Akses Coretax."
hero_accent: "Siapa boleh melakukan apa?"

excerpt: "Memahami fungsi role akses Coretax, hubungan dengan impersonate dan PIC, perbedaan drafter dan signer, direktori role, serta berbagai permasalahan akses yang sering terjadi."
description: "Panduan konseptual untuk memahami role akses, impersonate, PIC, drafter, signer, pembagian kewenangan, direktori role, dan permasalahan akses di Coretax."

category: "Coretax"

tags:
  - Coretax
  - Role Akses
  - Impersonate
  - PIC
  - Drafter
  - Signer
  - eBupot
  - eFaktur
  - SPT Masa

author: "Angga Sukma Dhaniswara"
reading_time: "14 menit baca"

# URL uji. Setelah versi V2 dipastikan baik, ganti dengan URL lama.
permalink: /roleakses.html

summary_label: "Ringkasan cepat"
summary: "Role akses bukan sekadar menu teknis. Fitur ini membagi kewenangan berdasarkan pengguna, jenis dokumen, tahapan pekerjaan, dan dalam kondisi tertentu lokasi atau tempat kegiatan usaha."

hero_links:
  - label: "Mulai membaca"
    href: "#pengantar"
  - label: "Daftar role"
    href: "#daftar-role-akses"
  - label: "Panduan visual"
    href: "#presentasi-role-akses"

hero_stats:
  - value: "35"
    label: "Role dalam direktori artikel"
  - value: "Drafter"
    label: "Menyiapkan konsep dokumen"
  - value: "Signer"
    label: "Memberikan tindakan final"
  - value: "PIC"
    label: "Pengelolaan akses badan"

sidebar_note: "Artikel ini berfokus pada pemahaman fungsi dan permasalahan role akses. Tampilan dan alur Coretax dapat mengalami perubahan."

custom_css:
  - /assets/css/roleakses-v2.css?v=20260814-2

custom_js:
  - /assets/js/roleakses-v3.js?v=20260814-1
---

<div class="role-article">
<style>
.role-inline-figure {
  margin: 24px 0 30px;
}

.role-inline-figure img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 18px;
}

.role-inline-figure figcaption {
  margin-top: 10px;
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.78;
}

.role-table-wrapper {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.role-access-table {
  width: 100%;
  table-layout: fixed;
}

.role-access-table th,
.role-access-table td {
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-break: normal;
  vertical-align: top;
}

.role-access-table th:nth-child(1),
.role-access-table td:nth-child(1) {
  width: 8%;
  text-align: center;
}

.role-access-table th:nth-child(2),
.role-access-table td:nth-child(2) {
  width: 37%;
}

.role-access-table th:nth-child(3),
.role-access-table td:nth-child(3) {
  width: 55%;
}

@media (max-width: 760px) {
  .role-access-controls {
    grid-template-columns: 1fr !important;
  }

  .role-access-table {
    min-width: 680px;
  }
}
</style>

<section id="pengantar">

<p>
                Implementasi Coretax membawa perubahan besar dalam
                cara perusahaan mengelola kewajiban perpajakannya.
                Salah satu perubahan yang paling penting adalah
                hadirnya mekanisme role akses, yaitu pembagian
                kewenangan kepada setiap pengguna yang menjalankan
                administrasi perpajakan atas nama Wajib Pajak Badan
                atau Instansi Pemerintah.
              </p>
<p>
                Melalui mekanisme ini, staf pajak, staf keuangan,
                bagian penggajian, konsultan, hingga pengurus
                perusahaan tidak harus menggunakan satu akun dan
                kata sandi secara bersama-sama. Setiap orang masuk
                menggunakan akun Coretax pribadinya, kemudian
                menjalankan kewenangan sesuai peran yang telah
                diberikan.
              </p>
<p>
                Konsep tersebut terlihat sederhana. Namun, dalam
                praktiknya, role akses menjadi salah satu sumber
                kebingungan yang cukup sering dialami pengguna
                Coretax. Ada pegawai yang dapat masuk ke akun
                perusahaan, tetapi tidak menemukan menu yang
                dibutuhkan. Ada pula pengguna yang berhasil membuat
                konsep dokumen, tetapi tidak dapat menandatangani
                atau menyampaikannya.
              </p>
<p>
                Untuk memahami permasalahan tersebut, kita perlu
                mengenal terlebih dahulu cara kerja role akses di
                Coretax.
              </p>
</section>
<section id="pengertian">
<h2>Apa yang Dimaksud dengan Role Akses?</h2>
<p>
                Role akses merupakan kewenangan yang diberikan kepada
                seseorang untuk melakukan aktivitas perpajakan
                tertentu atas nama Wajib Pajak.
              </p>
<p>
                Kewenangan tersebut tidak selalu berlaku untuk seluruh
                layanan Coretax. Seseorang dapat diberikan akses untuk
                membuat faktur pajak, tetapi belum tentu dapat membuat
                bukti potong PPh Pasal 21. Begitu pula seseorang yang
                dapat menyusun SPT Masa PPN belum tentu mempunyai
                kewenangan untuk menandatangani dan menyampaikannya.
              </p>
<p>
                Dengan kata lain, role akses menjawab dua pertanyaan
                penting:
              </p>
<div class="question-grid">
<div class="question-card">
<span class="question-number">1</span>
<p>
                    Dokumen apa yang boleh dikerjakan oleh pengguna?
                  </p>
</div>
<div class="question-card">
<span class="question-number">2</span>
<p>
                    Sampai sejauh mana pengguna boleh memproses
                    dokumen tersebut?
                  </p>
</div>
</div>
<p>
                Pembatasan ini diperlukan karena setiap pengguna dapat
                memiliki tanggung jawab yang berbeda di dalam
                perusahaan.
              </p>
</section>
<section id="kebutuhan">
<h2>Mengapa Role Akses Dibutuhkan?</h2>
<p>
                Sebelum penggunaan akses berbasis peran, praktik
                berbagi akun sering dianggap sebagai cara yang paling
                mudah. Satu akun perusahaan digunakan oleh beberapa
                pegawai untuk membuat faktur, bukti potong, dan
                laporan pajak.
              </p>
<p>
                Namun, praktik tersebut menimbulkan sejumlah risiko.
                Perusahaan menjadi sulit mengetahui siapa yang
                sebenarnya membuat, mengubah, atau menyampaikan suatu
                dokumen. Kata sandi perusahaan juga dapat diketahui
                oleh terlalu banyak orang. Selain itu, pegawai yang
                sudah berpindah tugas atau keluar dari perusahaan
                berpotensi masih mempunyai akses terhadap data
                perpajakan.
              </p>
<p>
                Role akses membuat kewenangan pengguna menjadi lebih
                terstruktur. Perusahaan dapat menentukan siapa yang
                hanya bertugas menyiapkan dokumen dan siapa yang
                berwenang memberikan persetujuan akhir.
              </p>
<div class="callout callout-blue">
<strong>Intinya</strong>
<p>
                  Role akses bukan sekadar fitur teknis, tetapi juga
                  bagian dari sistem pengendalian internal perusahaan.
                </p>
</div>
</section>
<section id="impersonate">
<h2>Hubungan Role Akses dengan Impersonate</h2>
<p>
                Dalam Coretax, pengguna menjalankan kewajiban
                perpajakan badan melalui mekanisme yang dikenal
                sebagai impersonate.
              </p>
<p>
                Impersonate bukan berarti menggunakan identitas orang
                lain secara tidak sah. Dalam konteks Coretax,
                impersonate berarti pengguna masuk menggunakan akun
                pribadinya, kemudian beralih untuk bertindak mewakili
                Wajib Pajak Badan yang telah memberikan kewenangan
                kepadanya.
              </p>
<p>
                Sebagai contoh, seorang staf pajak masuk menggunakan
                NIK atau NPWP pribadinya. Setelah login, ia memilih
                perusahaan yang diwakilinya. Menu dan fungsi yang
                tersedia kemudian mengikuti role yang telah diberikan
                oleh perusahaan tersebut.
              </p>
<p>
                Apabila role yang diterima hanya terbatas pada
                pembuatan konsep faktur pajak, pengguna hanya dapat
                mengerjakan fungsi tersebut. Ia tidak otomatis
                memperoleh akses penuh terhadap seluruh administrasi
                perpajakan perusahaan.
              </p>
</section>
<section id="pic">
<h2>Mengenal PIC atau Penanggung Jawab</h2>
<p>
                Dalam pengelolaan akses Coretax, terdapat pihak yang
                memiliki posisi penting, yaitu PIC atau Penanggung
                Jawab.
              </p>
<p>
                PIC pada umumnya mempunyai kewenangan yang lebih luas
                dalam akun Wajib Pajak Badan. PIC dapat bertindak
                mewakili badan serta mengelola pihak-pihak yang diberi
                akses terhadap administrasi perpajakan perusahaan.
              </p>
<p>
                Karena kewenangannya luas, penetapan PIC perlu
                diperhatikan dengan serius. Perusahaan harus
                memastikan bahwa pihak yang tercatat sebagai PIC
                memang masih aktif, mempunyai hubungan yang sah
                dengan badan, dan memahami tanggung jawabnya.
              </p>
<p>
                Berikut adalah langkah untuk mengetahui orang yang
                bertindak sebagai PIC.
              </p>
<figure class="role-inline-figure">
<img alt="Langkah melihat pihak yang bertindak sebagai PIC pada menu Pihak Terkait di Coretax" loading="lazy" src="/assets/img/LetakPIC.webp"/>
<figcaption>
                  Letak informasi pihak yang bertindak sebagai PIC atau
                  Penanggung Jawab dapat diperiksa melalui
                  <strong>Portal Saya → Profil Saya → Pihak Terkait</strong>.
                </figcaption>
</figure>
<div class="callout callout-orange">
<strong>Perhatikan data PIC</strong>
<p>
                  Apabila pengurus yang seharusnya menjadi PIC tidak
                  dapat mengakses akun badan, proses pemberian
                  kewenangan kepada pegawai lain juga dapat terhambat.
                </p>
</div>
</section>
<section id="drafter-signer">
<h2>Perbedaan Drafter dan Signer</h2>
<p>
                Secara umum, pembagian kewenangan dalam Coretax dapat
                dipahami melalui dua fungsi utama, yaitu drafter dan
                signer.
              </p>
<div class="role-comparison">
<article class="role-card drafter">
<div class="role-icon">D</div>
<h3>Drafter</h3>
<p>
                    Pengguna yang diberi kewenangan untuk menyiapkan
                    atau membuat konsep dokumen perpajakan.
                  </p>
<ul>
<li>Mengisi data transaksi.</li>
<li>Membuat konsep faktur pajak.</li>
<li>Membuat konsep bukti potong.</li>
<li>Mengimpor data melalui file XML.</li>
<li>
                      Menyusun dan melengkapi konsep sebelum
                      disampaikan.
                    </li>
</ul>
</article>
<article class="role-card signer">
<div class="role-icon">S</div>
<h3>Signer</h3>
<p>
                    Pengguna yang diberi kewenangan untuk memberikan
                    persetujuan akhir atas dokumen perpajakan.
                  </p>
<ul>
<li>Menandatangani dokumen.</li>
<li>Menerbitkan atau mengunggah dokumen.</li>
<li>Menyampaikan laporan perpajakan.</li>
<li>Memastikan konsep telah diperiksa.</li>
<li>
                      Memikul tanggung jawab pada tahap akhir proses.
                    </li>
</ul>
</article>
</div>
<p>
                Drafter pada dasarnya tidak selalu mempunyai
                kewenangan untuk memberikan persetujuan akhir. Inilah
                sebabnya seorang pegawai dapat berhasil membuat
                dokumen, tetapi tidak menemukan tombol atau fungsi
                untuk menandatangani dan menyampaikannya.
              </p>
<p>
                Signer bertugas memastikan bahwa dokumen yang telah
                disusun sudah benar dan layak untuk diproses lebih
                lanjut. Dalam praktik pengendalian internal, fungsi
                signer idealnya diberikan kepada pihak yang mempunyai
                kewenangan dan tanggung jawab lebih tinggi, misalnya
                supervisor pajak, manajer keuangan, pengurus, atau
                pihak lain yang ditunjuk perusahaan.
              </p>
<div class="callout callout-green">
<strong>Pemeriksaan berlapis</strong>
<p>
                  Pemisahan drafter dan signer membuat dokumen tidak
                  langsung disampaikan hanya karena telah selesai
                  dibuat. Dokumen terlebih dahulu diperiksa oleh pihak
                  yang berbeda.
                </p>
</div>
</section>
<section id="cakupan">
<h2>Satu Role Tidak Berlaku untuk Semua Layanan</h2>
<p>
                Salah satu kekeliruan yang sering terjadi adalah
                menganggap bahwa satu role dapat digunakan untuk
                seluruh jenis kewajiban perpajakan.
              </p>
<p>
                Padahal, role Coretax dapat dibedakan berdasarkan
                jenis dokumen atau modul. Misalnya, role untuk membuat
                faktur pajak berbeda dengan role untuk menyusun SPT
                Masa PPN. Role untuk e-Bupot PPh Pasal 21 juga dapat
                berbeda dengan role untuk e-Bupot Unifikasi.
              </p>
<p>Seorang staf dapat saja mempunyai akses untuk membuat:</p>
<div class="service-chips">
<span class="service-chip">Faktur pajak keluaran</span>
<span class="service-chip">Konsep SPT Masa PPN</span>
<span class="service-chip">
                  Bukti potong PPh Pasal 21
                </span>
<span class="service-chip">
                  Bukti potong PPh Unifikasi
                </span>
</div>
<p>
                Namun, setiap kewenangan tersebut perlu dipahami
                sebagai akses yang berdiri sendiri. Karena itu,
                keberhasilan pengguna membuka satu layanan tidak
                berarti seluruh layanan perpajakan perusahaan
                otomatis dapat diakses.
              </p>
</section>
<section aria-labelledby="judul-daftar-role" class="role-access-section" id="daftar-role-akses">
<div class="role-access-heading">
<span class="role-access-label">Direktori Role</span>
<h2 id="judul-daftar-role">Daftar Role Akses Coretax</h2>
<p>
      Setiap role memberikan kewenangan yang berbeda kepada pengguna
      ketika bertindak mewakili Wajib Pajak melalui Coretax.
    </p>
</div>
<!-- Pencarian dan filter -->
<div class="role-access-controls">
<div class="role-search-wrapper">
<label for="roleSearch">Cari role akses</label>
<input autocomplete="off" id="roleSearch" placeholder="Cari: PPh 21/26, eFaktur, Unifikasi..." type="search"/>
</div>
<div class="role-filter-wrapper">
<label for="roleCategory">Jenis role akses</label>
<select id="roleCategory">
<option value="semua">Semua jenis role</option>
<option value="drafter">Drafter</option>
<option value="penandatangan">Penandatangan</option>
<option value="kuasa">Kuasa</option>
<option value="administrasi">Administrasi &amp; Status</option>
<option value="pembayaran">Pembayaran &amp; Pengembalian</option>
<option value="khusus">Layanan Khusus</option>
</select>
</div>
</div>
<div aria-live="polite" class="role-result-info">
    Menampilkan <strong id="roleVisibleCount">35</strong> role akses
  </div>
<!-- Tabel -->
<div class="role-table-wrapper">
<table class="role-access-table">
<thead>
<tr>
<th class="role-number" scope="col">No.</th>
<th scope="col">Role Akses</th>
<th scope="col">Fungsi Ringkas</th>
</tr>
</thead>
<tbody id="roleTableBody">
<!-- ROLE AKSES: DRAFTER / PENANDATANGAN -->
<tr data-category="drafter">
<td class="role-number">1</td>
<td><strong>Drafter SPT Tahunan</strong></td>
<td>
            Menyiapkan konsep SPT Tahunan beserta induk, lampiran,
            dan data pendukungnya.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">2</td>
<td><strong>Penandatangan SPT Tahunan</strong></td>
<td>
            Melakukan penandatanganan dan tindakan final atas SPT Tahunan
            yang telah disiapkan.
          </td>
</tr>
<tr data-category="drafter">
<td class="role-number">3</td>
<td><strong>Drafter SPT Masa PPh Pasal 21/26</strong></td>
<td>
            Menyiapkan konsep pelaporan SPT Masa PPh Pasal 21/26 untuk
            suatu masa pajak.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">4</td>
<td><strong>Penandatangan SPT Masa PPh Pasal 21/26</strong></td>
<td>
            Menandatangani dan menyampaikan SPT Masa PPh Pasal 21/26.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">5</td>
<td>
<strong>Penandatangan SPT Masa PPh Pasal 21/26 (Hanya Induk)</strong>
</td>
<td>
            Menandatangani dan menyampaikan SPT Masa PPh Pasal 21/26
            pada Wajib Pajak induk.
          </td>
</tr>
<tr data-category="drafter">
<td class="role-number">6</td>
<td><strong>Drafter eBupot PPh Masa Pasal 21/26</strong></td>
<td>
            Membuat dan mengisi konsep bukti pemotongan PPh Pasal 21/26.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">7</td>
<td>
<strong>Penandatangan eBupot PPh Masa Pasal 21/26</strong>
</td>
<td>
            Menandatangani atau menerbitkan bukti pemotongan PPh
            Pasal 21/26.
          </td>
</tr>
<tr data-category="drafter">
<td class="role-number">8</td>
<td><strong>Drafter eBupot Unifikasi</strong></td>
<td>
            Menyiapkan konsep bukti pemotongan atau pemungutan PPh
            dalam modul eBupot Unifikasi.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">9</td>
<td><strong>Penandatangan eBupot Unifikasi</strong></td>
<td>
            Menandatangani atau menerbitkan bukti pemotongan dan
            pemungutan PPh Unifikasi.
          </td>
</tr>
<tr data-category="drafter">
<td class="role-number">10</td>
<td>
<strong>
              Drafter SPT Masa selain SPT Masa PPh Pasal 21/26
            </strong>
</td>
<td>
            Menyiapkan konsep SPT Masa selain SPT Masa PPh
            Pasal 21/26 sesuai modul yang tersedia.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">11</td>
<td>
<strong>
              Penandatangan SPT Masa selain SPT Masa PPh Pasal 21/26
            </strong>
</td>
<td>
            Menandatangani dan menyampaikan SPT Masa selain SPT Masa
            PPh Pasal 21/26.
          </td>
</tr>
<tr data-category="drafter">
<td class="role-number">12</td>
<td><strong>Drafter SPT Masa Bea Meterai</strong></td>
<td>
            Menyiapkan konsep SPT Masa Bea Meterai bagi pemungut
            Bea Meterai.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">13</td>
<td><strong>Penandatangan SPT Masa Bea Meterai</strong></td>
<td>
            Menandatangani dan menyampaikan SPT Masa Bea Meterai.
          </td>
</tr>
<tr data-category="drafter">
<td class="role-number">14</td>
<td><strong>Drafter eFaktur Pajak</strong></td>
<td>
            Membuat konsep faktur pajak, mengisi data transaksi,
            dan menyiapkan faktur untuk diproses.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">15</td>
<td><strong>Penandatangan eFaktur Pajak</strong></td>
<td>
            Menandatangani, mengunggah, atau menerbitkan faktur pajak
            sesuai kewenangannya.
          </td>
</tr>
<tr data-category="drafter">
<td class="role-number">16</td>
<td><strong>Drafter SPT Masa PPh Unifikasi</strong></td>
<td>
            Menyiapkan konsep SPT Masa PPh Unifikasi berdasarkan
            bukti potong, pembayaran, dan data terkait.
          </td>
</tr>
<tr data-category="penandatangan">
<td class="role-number">17</td>
<td><strong>Penandatangan SPT Masa PPh Unifikasi</strong></td>
<td>
            Menandatangani dan menyampaikan SPT Masa PPh Unifikasi.
          </td>
</tr>
<tr data-category="drafter">
<td class="role-number">18</td>
<td><strong>Drafter SPT Masa PPN/PPN DM/PPN PUT</strong></td>
<td>
            Menyiapkan konsep SPT Masa PPN sesuai jenis dan kategori
            pelaporan yang tersedia dalam Coretax.
          </td>
</tr>
<!-- ROLE AKSES: LAYANAN KHUSUS -->
<tr data-category="khusus">
<td class="role-number">19</td>
<td>
<strong>
              PPh DPT atas Penghasilan dari Penghapusan Secara Mutlak
              Piutang Negara Nonpokok
            </strong>
</td>
<td>
            Mengakses proses atau layanan khusus terkait PPh atas
            penghasilan dari penghapusan secara mutlak piutang negara
            nonpokok.
          </td>
</tr>
<tr data-category="khusus">
<td class="role-number">20</td>
<td><strong>Imbalan Bunga</strong></td>
<td>
            Mengakses layanan yang berkaitan dengan permohonan atau
            administrasi imbalan bunga.
          </td>
</tr>
<!-- ROLE AKSES: KUASA / PEMBAYARAN / PENGEMBALIAN -->
<tr data-category="kuasa">
<td class="role-number">21</td>
<td><strong>Kuasa untuk Modul Pembayaran</strong></td>
<td>
            Menjalankan fungsi pembayaran pajak atas nama Wajib Pajak
            sesuai kewenangan yang diberikan.
          </td>
</tr>
<tr data-category="pembayaran">
<td class="role-number">22</td>
<td><strong>Pemindahbukuan</strong></td>
<td>
            Mengajukan atau mengelola permohonan pemindahbukuan
            pembayaran pajak.
          </td>
</tr>
<tr data-category="pembayaran">
<td class="role-number">23</td>
<td><strong>Pengembalian</strong></td>
<td>
            Mengakses layanan terkait permohonan pengembalian pembayaran
            atau kelebihan pembayaran pajak.
          </td>
</tr>
<!-- ROLE AKSES: ADMINISTRASI & STATUS -->
<tr data-category="administrasi">
<td class="role-number">24</td>
<td><strong>Perubahan Profil Saya</strong></td>
<td>
            Mengakses dan memperbarui informasi tertentu pada profil
            Wajib Pajak.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">25</td>
<td><strong>Perubahan Data</strong></td>
<td>
            Mengajukan atau mengelola perubahan data administrasi
            dan identitas Wajib Pajak.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">26</td>
<td><strong>Penghapusan NPWP atau Pencabutan PKP</strong></td>
<td>
            Mengakses permohonan penghapusan NPWP atau pencabutan
            pengukuhan Pengusaha Kena Pajak.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">27</td>
<td><strong>Status Pemungut PMSE</strong></td>
<td>
            Mengakses layanan yang berkaitan dengan status pemungut
            PPN Perdagangan Melalui Sistem Elektronik.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">28</td>
<td><strong>Perubahan Status: Nonaktif atau Reaktivasi</strong></td>
<td>
            Mengajukan perubahan status menjadi nonaktif atau
            pengaktifan kembali Wajib Pajak.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">29</td>
<td>
<strong>Status Pemotong atau Pemungut PPh atau PPN</strong>
</td>
<td>
            Mengakses proses penetapan atau perubahan status sebagai
            pemotong atau pemungut PPh maupun PPN.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">30</td>
<td><strong>Pendaftaran Objek Pajak PBB P5L</strong></td>
<td>
            Mendaftarkan objek Pajak Bumi dan Bangunan sektor P5L
            beserta data pendukungnya.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">31</td>
<td>
<strong>
              Status Lembaga Keuangan Pelapor atau Nonpelapor
            </strong>
</td>
<td>
            Mengakses layanan penetapan atau perubahan status lembaga
            keuangan pelapor maupun nonpelapor.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">32</td>
<td><strong>Status Pemungut Bea Meterai</strong></td>
<td>
            Mengakses layanan yang berkaitan dengan status sebagai
            pemungut Bea Meterai.
          </td>
</tr>
<tr data-category="administrasi">
<td class="role-number">33</td>
<td><strong>Pengukuhan PKP</strong></td>
<td>
            Mengakses dan mengajukan permohonan pengukuhan sebagai
            Pengusaha Kena Pajak.
          </td>
</tr>
<!-- ROLE AKSES: KUASA -->
<tr data-category="kuasa">
<td class="role-number">34</td>
<td><strong>Kuasa untuk Modul Layanan Wajib Pajak</strong></td>
<td>
            Mengakses dan menjalankan fungsi tertentu dalam modul layanan
            Wajib Pajak.
          </td>
</tr>
<tr data-category="kuasa">
<td class="role-number">35</td>
<td>
<strong>
              Kuasa untuk Permohonan Layanan Administrasi dan Edukasi
              Perpajakan
            </strong>
</td>
<td>
            Mengajukan serta memantau permohonan layanan administrasi
            dan edukasi perpajakan.
          </td>
</tr>
</tbody>
</table>
</div>
<div class="role-empty-state" hidden="" id="roleEmptyState">
<strong>Role tidak ditemukan.</strong>
<p>Coba gunakan kata kunci atau kategori yang berbeda.</p>
</div>
<div class="role-access-note">
<strong>Catatan:</strong>
    fungsi dalam tabel merupakan gambaran ringkas berdasarkan nama role.
    Menu dan tindakan yang tersedia tetap mengikuti konfigurasi serta
    kewenangan dalam sistem Coretax.
  </div>
</section>
<section id="permasalahan">
<h2>Permasalahan Role Akses yang Sering Terjadi</h2>
<p>
                Gejala yang terlihat sama belum tentu mempunyai
                penyebab yang sama. Gunakan bagian berikut untuk
                membedakan masalah hubungan pengguna, cakupan role,
                tahapan pekerjaan, dan sesi sistem.
              </p>
<div class="problem-list">
<article class="problem-item open">
<button aria-expanded="true" class="problem-button" type="button">
<span class="problem-index">1</span>
<span class="problem-title">
                      Nama perusahaan tidak muncul saat akan
                      impersonate
                    </span>
<span class="problem-symbol">+</span>
</button>
<div class="problem-content">
<p>
                      Permasalahan ini biasanya menunjukkan bahwa
                      hubungan antara pengguna dan perusahaan belum
                      terbaca dengan benar oleh sistem. Penyebabnya
                      dapat berasal dari data pihak terkait, masa
                      berlaku hubungan, akun pengguna, atau
                      ketidaksesuaian data identitas.
                    </p>
<p>
                      Apabila perusahaan sama sekali tidak muncul,
                      kendalanya kemungkinan berada pada hubungan atau
                      keterkaitan pengguna dengan badan, bukan pada
                      kewenangan terhadap dokumen tertentu.
                    </p>
</div>
</article>
<article class="problem-item">
<button aria-expanded="false" class="problem-button" type="button">
<span class="problem-index">2</span>
<span class="problem-title">
                      Dapat masuk ke akun badan, tetapi menu tidak
                      lengkap
                    </span>
<span class="problem-symbol">+</span>
</button>
<div class="problem-content">
<p>
                      Jika pengguna sudah dapat impersonate tetapi
                      hanya melihat sebagian menu, kemungkinan role
                      yang diberikan masih terbatas.
                    </p>
<p>
                      Pengguna mungkin sudah tercatat sebagai pihak
                      terkait, tetapi belum memperoleh role untuk
                      layanan yang hendak digunakan. Role juga dapat
                      dibatasi pada jenis pajak, dokumen, atau tempat
                      kegiatan usaha tertentu.
                    </p>
</div>
</article>
<article class="problem-item">
<button aria-expanded="false" class="problem-button" type="button">
<span class="problem-index">3</span>
<span class="problem-title">
                      Dapat membuat konsep, tetapi tidak dapat
                      menandatangani
                    </span>
<span class="problem-symbol">+</span>
</button>
<div class="problem-content">
<p>
                      Kondisi ini umumnya terjadi ketika pengguna hanya
                      mempunyai role sebagai drafter.
                    </p>
<p>
                      Pegawai dapat mengisi dan menyelesaikan konsep,
                      tetapi proses akhir harus dilakukan oleh
                      pengguna yang memiliki role signer. Kondisi ini
                      tidak selalu merupakan gangguan sistem.
                    </p>
</div>
</article>
<article class="problem-item">
<button aria-expanded="false" class="problem-button" type="button">
<span class="problem-index">4</span>
<span class="problem-title">
                      Dapat membuat faktur, tetapi tidak dapat
                      menyampaikan SPT PPN
                    </span>
<span class="problem-symbol">+</span>
</button>
<div class="problem-content">
<p>
                      Membuat faktur pajak dan menyampaikan SPT Masa
                      PPN merupakan dua aktivitas yang berbeda. Role
                      faktur belum tentu memberikan akses terhadap
                      SPT Masa PPN.
                    </p>
<p>
                      Hal yang sama berlaku pada layanan PPh Pasal 21
                      dan PPh Unifikasi. Pastikan role sesuai dengan
                      dokumen yang menjadi tanggung jawab pengguna.
                    </p>
</div>
</article>
<article class="problem-item">
<button aria-expanded="false" class="problem-button" type="button">
<span class="problem-index">5</span>
<span class="problem-title">
                      Role sudah diberikan, tetapi belum muncul
                    </span>
<span class="problem-symbol">+</span>
</button>
<div class="problem-content">
<p>
                      Dalam beberapa keadaan, perubahan role tidak
                      langsung terlihat pada sesi pengguna yang sedang
                      aktif.
                    </p>
<p>
                      Perlu dipastikan bahwa role telah berlaku,
                      tersimpan, dan diberikan untuk badan maupun
                      tempat kegiatan usaha yang tepat sebelum
                      disimpulkan sebagai gangguan aplikasi.
                    </p>
</div>
</article>
<article class="problem-item">
<button aria-expanded="false" class="problem-button" type="button">
<span class="problem-index">6</span>
<span class="problem-title">
                      Akses hanya berlaku pada tempat kegiatan usaha
                      tertentu
                    </span>
<span class="problem-symbol">+</span>
</button>
<div class="problem-content">
<p>
                      Perusahaan yang mempunyai cabang atau Tempat
                      Kegiatan Usaha dapat memberikan kewenangan secara
                      lebih terbatas.
                    </p>
<p>
                      Seorang pegawai mungkin hanya memperoleh akses
                      pada NITKU atau lokasi kegiatan usaha tertentu.
                      Akibatnya, ia dapat mengerjakan transaksi salah
                      satu cabang, tetapi tidak dapat memproses data
                      cabang lainnya.
                    </p>
</div>
</article>
<article class="problem-item">
<button aria-expanded="false" class="problem-button" type="button">
<span class="problem-index">7</span>
<span class="problem-title">
                      Pegawai lama masih mempunyai akses
                    </span>
<span class="problem-symbol">+</span>
</button>
<div class="problem-content">
<p>
                      Risiko muncul ketika pegawai pindah unit,
                      berubah tanggung jawab, atau sudah tidak bekerja
                      di perusahaan, tetapi aksesnya belum dicabut.
                    </p>
<p>
                      Penggantian kata sandi perusahaan tidak
                      menyelesaikan masalah dalam sistem berbasis akun
                      pribadi. Perusahaan perlu meninjau hubungan
                      pengguna, masa berlaku akses, dan role yang
                      pernah diberikan.
                    </p>
</div>
</article>
</div>
</section>
<section id="pengendalian">
<h2>Role Akses sebagai Pengendalian Internal</h2>
<p>
                Role akses sebaiknya tidak dipandang hanya sebagai
                urusan administrator Coretax. Pembagian kewenangan
                berkaitan langsung dengan tata kelola dan
                pengendalian internal perusahaan.
              </p>
<div class="control-flow">
<div class="control-step">
<strong>Staf pajak</strong>
<span>Menyiapkan konsep sebagai drafter.</span>
</div>
<div class="control-step">
<strong>Supervisor</strong>
<span>Memeriksa data dan kelengkapan.</span>
</div>
<div class="control-step">
<strong>Signer</strong>
<span>Memberikan persetujuan akhir.</span>
</div>
<div class="control-step">
<strong>PIC</strong>
<span>Mengawasi pengelolaan akses.</span>
</div>
</div>
<p>
                Pemisahan tugas tersebut dapat mengurangi risiko salah
                input, penerbitan dokumen tanpa pemeriksaan,
                penyalahgunaan akses, maupun pelaporan yang tidak
                sesuai dengan kebijakan perusahaan.
              </p>
<p>
                Perusahaan juga sebaiknya tidak memberikan role signer
                kepada terlalu banyak pengguna. Semakin luas
                kewenangan penandatanganan diberikan, semakin besar
                pula risiko dokumen diterbitkan tanpa proses
                verifikasi yang memadai.
              </p>
</section>
<section id="minimum-access">
<h2>Prinsip Minimum Access</h2>
<p>
                Prinsip yang baik dalam mengelola role adalah minimum
                access atau pemberian akses minimum sesuai kebutuhan
                pekerjaan.
              </p>
<p>
                Artinya, seseorang hanya diberikan kewenangan yang
                benar-benar diperlukan untuk menjalankan tugasnya.
                Staf penggajian, misalnya, tidak selalu membutuhkan
                akses ke faktur pajak. Staf yang menangani PPN belum
                tentu membutuhkan akses terhadap bukti potong PPh
                Pasal 21. Demikian pula drafter tidak selalu harus
                diberikan kewenangan sebagai signer.
              </p>
<div class="callout callout-blue">
<strong>Prinsip sederhana</strong>
<p>
                  Berikan akses secukupnya untuk menjalankan pekerjaan,
                  bukan akses seluas-luasnya agar pekerjaan terasa
                  lebih mudah.
                </p>
</div>
<p>
                Prinsip ini membantu menjaga kerahasiaan data
                sekaligus memperkecil risiko kesalahan dan
                penyalahgunaan akses.
              </p>
</section>
<section id="evaluasi">
<h2>Pentingnya Evaluasi Berkala</h2>
<p>
                Role akses bukan sesuatu yang cukup ditetapkan sekali,
                kemudian dibiarkan selamanya. Perusahaan perlu
                melakukan evaluasi berkala, khususnya ketika terjadi:
              </p>
<ul class="check-list">
<li>Pergantian direktur atau pengurus.</li>
<li>Mutasi pegawai.</li>
<li>Perubahan pembagian tugas.</li>
<li>Pergantian konsultan pajak.</li>
<li>Pembukaan atau penutupan cabang.</li>
<li>Berakhirnya masa kuasa.</li>
<li>Pegawai mengundurkan diri.</li>
<li>Perubahan proses bisnis perusahaan.</li>
</ul>
<p>
                Evaluasi tersebut diperlukan untuk memastikan bahwa
                hanya pihak yang masih berwenang yang dapat mengakses
                data dan dokumen perpajakan perusahaan.
              </p>
</section>
<section id="bukan-teknis">
<h2>Bukan Sekadar Masalah Teknis</h2>
<p>
                Banyak pengguna menganggap masalah role akses hanya
                sebagai kendala teknis Coretax. Padahal, sebagian
                permasalahan dapat berkaitan dengan struktur
                kewenangan di dalam perusahaan.
              </p>
<p>
                Ketika pengguna tidak dapat menyampaikan dokumen,
                pertanyaannya bukan hanya “mengapa tombolnya tidak
                muncul?”, tetapi juga:
              </p>
<ul>
<li>
                  Apakah pengguna memang berwenang menandatangani
                  dokumen tersebut?
                </li>
<li>
                  Apakah kewenangannya hanya sebagai drafter?
                </li>
<li>
                  Apakah aksesnya berlaku untuk jenis pajak yang
                  sesuai?
                </li>
<li>
                  Apakah akses dibatasi pada cabang tertentu?
                </li>
<li>
                  Apakah hubungan pengguna dengan badan masih aktif?
                </li>
</ul>
<p>
                Dengan memahami pertanyaan-pertanyaan tersebut,
                perusahaan dapat membedakan antara gangguan aplikasi
                dan pembatasan akses yang memang dirancang oleh
                sistem.
              </p>
</section>
<section aria-labelledby="judul-presentasi-role" class="presentation-section" id="presentasi-role-akses">
<div class="presentation-heading">
<span class="presentation-label">
                  Panduan Visual
                </span>
<h2 id="judul-presentasi-role">
                  Tata Cara Pemberian Role Akses bagi Pegawai
                </h2>
<p>
                  Presentasi berikut melengkapi penjelasan dalam artikel.
                  Gunakan tombol navigasi, thumbnail, tombol panah keyboard,
                  atau geser layar untuk berpindah halaman.
                </p>
</div>
<div class="presentation-viewer" id="presentationViewer" tabindex="0">
<div class="presentation-toolbar">
<div aria-live="polite" class="presentation-page-info">
                    Halaman
                    <strong id="presentationCurrentPage">1</strong>
                    dari
                    <strong>15</strong>
</div>
<div class="presentation-toolbar-actions">
<button class="presentation-tool-button" id="presentationFullscreen" type="button">
                      Layar penuh
                    </button>
<a class="presentation-tool-button" href="/Tata_Cara_Pemberian_Role_Akses_Pegawai.pdf" rel="noopener noreferrer" target="_blank">
                      Buka PDF
                    </a>
</div>
</div>
<div class="presentation-stage">
<button aria-label="Halaman sebelumnya" class="presentation-nav presentation-nav-prev" id="presentationPrevious" type="button">
                    ‹
                  </button>
<figure class="presentation-slide">
<img alt="Sampul: Tata Cara Pemberian Role Akses bagi Pegawai" id="presentationMainImage" src="/assets/roleakses/slide-01.webp"/>
<figcaption id="presentationCaption">
                      Sampul: Tata Cara Pemberian Role Akses bagi Pegawai
                    </figcaption>
</figure>
<button aria-label="Halaman berikutnya" class="presentation-nav presentation-nav-next" id="presentationNext" type="button">
                    ›
                  </button>
</div>
<div aria-label="Pilih halaman presentasi" class="presentation-thumbnails" id="presentationThumbnails">
<button aria-current="true" aria-label="Tampilkan halaman 1: Sampul: Tata Cara Pemberian Role Akses bagi Pegawai" class="presentation-thumb active" data-slide-index="0" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-01.webp"/>
<span>1</span>
</button>
<button aria-label="Tampilkan halaman 2: Membuka laman Coretax dan melanjutkan ke halaman login" class="presentation-thumb" data-slide-index="1" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-02.webp"/>
<span>2</span>
</button>
<button aria-label="Tampilkan halaman 3: Mengisi NIK atau NPWP PIC, kata sandi, dan verifikasi" class="presentation-thumb" data-slide-index="2" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-03.webp"/>
<span>3</span>
</button>
<button aria-label="Tampilkan halaman 4: Memilih akun perusahaan atau Wajib Pajak yang diwakili" class="presentation-thumb" data-slide-index="3" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-04.webp"/>
<span>4</span>
</button>
<button aria-label="Tampilkan halaman 5: Membuka Portal Saya dan Profil Saya" class="presentation-thumb" data-slide-index="4" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-05.webp"/>
<span>5</span>
</button>
<button aria-label="Tampilkan halaman 6: Membuka Informasi Umum dan menekan tombol Edit" class="presentation-thumb" data-slide-index="5" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-06.webp"/>
<span>6</span>
</button>
<button aria-label="Tampilkan halaman 7: Memilih bagian Informasi Umum dalam pembaruan data" class="presentation-thumb" data-slide-index="6" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-07.webp"/>
<span>7</span>
</button>
<button aria-label="Tampilkan halaman 8: Mengambil data terbaru dari Ditjen AHU" class="presentation-thumb" data-slide-index="7" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-08.webp"/>
<span>8</span>
</button>
<button aria-label="Tampilkan halaman 9: Menambahkan pegawai pada bagian Pihak Terkait" class="presentation-thumb" data-slide-index="8" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-09.webp"/>
<span>9</span>
</button>
<button aria-label="Tampilkan halaman 10: Memilih jenis pihak terkait Related Person" class="presentation-thumb" data-slide-index="9" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-10.webp"/>
<span>10</span>
</button>
<button aria-label="Tampilkan halaman 11: Mengisi data pegawai dan menyimpan data" class="presentation-thumb" data-slide-index="10" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-11.webp"/>
<span>11</span>
</button>
<button aria-label="Tampilkan halaman 12: Mencentang pernyataan dan menyimpan perubahan" class="presentation-thumb" data-slide-index="11" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-12.webp"/>
<span>12</span>
</button>
<button aria-label="Tampilkan halaman 13: Membuka Wakil atau Kuasa dan memilih Assign Roles" class="presentation-thumb" data-slide-index="12" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-13.webp"/>
<span>13</span>
</button>
<button aria-label="Tampilkan halaman 14: Memilih role akses yang akan diberikan" class="presentation-thumb" data-slide-index="13" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-14.webp"/>
<span>14</span>
</button>
<button aria-label="Tampilkan halaman 15: Proses selesai dan pegawai dapat melakukan impersonate" class="presentation-thumb" data-slide-index="14" type="button">
<img alt="" loading="lazy" src="/assets/roleakses/slide-15.webp"/>
<span>15</span>
</button>
</div>
<div class="presentation-error" hidden="" id="presentationError">
                  Gambar slide belum ditemukan. Pastikan folder
                  <code>assets/roleakses</code> berisi
                  <code>slide-01.webp</code> sampai
                  <code>slide-15.webp</code>.
                </div>
</div>
<div class="presentation-actions">
<a class="button button-primary" href="/Tata_Cara_Pemberian_Role_Akses_Pegawai.pdf" rel="noopener noreferrer" target="_blank">
                  Buka presentasi lengkap
                </a>
<a class="button" download="" href="/Tata_Cara_Pemberian_Role_Akses_Pegawai.pdf">
                  Unduh PDF
                </a>
</div>
<div class="presentation-note">
<strong>Catatan:</strong>
                pemberian hak akses dilakukan melalui akun PIC atau
                Penanggung Jawab. Tampilan menu Coretax dapat berubah
                mengikuti pembaruan sistem.
              </div>
<noscript>
<p class="presentation-noscript">
                  JavaScript diperlukan untuk menjalankan slider.
                  <a href="/Tata_Cara_Pemberian_Role_Akses_Pegawai.pdf">Buka PDF presentasi</a>.
                </p>
</noscript>
</section>
<section class="closing-box" id="penutup">
<h2>Penutup</h2>
<p>
                Role akses merupakan fondasi penting dalam pengelolaan
                administrasi perpajakan melalui Coretax. Fitur ini
                memastikan bahwa setiap orang bekerja menggunakan
                identitasnya sendiri, memiliki kewenangan sesuai
                tugasnya, dan dapat dimintai pertanggungjawaban atas
                aktivitas yang dilakukan.
              </p>
<p>
                Pemahaman mengenai PIC, pihak terkait, impersonate,
                drafter, signer, dan pembagian role per jenis dokumen
                sangat diperlukan agar proses administrasi pajak
                perusahaan tidak terganggu.
              </p>
<p>
                Lebih dari itu, role akses memberikan kesempatan bagi
                perusahaan untuk membangun tata kelola perpajakan yang
                lebih aman dan terstruktur. Ketika diterapkan dengan
                baik, fitur ini bukan hanya mempermudah penggunaan
                Coretax, tetapi juga memperkuat pengendalian internal
                serta mengurangi risiko kesalahan dalam pemenuhan
                kewajiban perpajakan.
              </p>
<p>
                Artikel ini dapat dijadikan pengantar sebelum pembaca
                mempelajari panduan teknis pengaturan role akses
                Coretax secara lebih terperinci.
              </p>
</section>
</div>
