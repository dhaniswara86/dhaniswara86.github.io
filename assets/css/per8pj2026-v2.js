/* =========================================================
   PER-8/PJ/2026 — perbaikan untuk Artikel V2
   Fokus:
   1) font mengikuti Artikel V2;
   2) tabel tidak bentrok dengan CSS tabel global;
   3) tabel desktop rapi dan bisa digeser bila ruang sempit;
   4) tabel mobile berubah menjadi kartu.
   ========================================================= */

.per8-article,
.per8-article * {
  font-family: inherit;
}

/* Teks artikel dibuat konsisten dengan karakter Artikel V2. */
.per8-article > p,
.per8-article > section:not(.comparison-zone):not(.promo-section) p,
.per8-article > section:not(.comparison-zone):not(.promo-section) li {
  font-size: 17px;
  line-height: 1.7;
}

.per8-article .lead {
  margin: 0 0 36px;
  color: #333336;
  font-size: 19px;
  line-height: 1.62;
  letter-spacing: -0.02em;
}

/* Pada layar besar beri sedikit ruang lebih untuk artikel ini saja. */
@media (min-width: 1320px) {
  body:has(.per8-article) .article-layout {
    width: min(1260px, 100%);
    grid-template-columns: minmax(0, 950px) 240px;
    gap: 48px;
  }
}

/* Kartu informasi regulasi */
.per8-article .regulation-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 30px 0 10px;
}

.per8-article .regulation-card > div {
  min-width: 0;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 19px;
  background: #f5f5f7;
}

.per8-article .regulation-card small {
  display: block;
  margin-bottom: 7px;
  color: #86868b;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.per8-article .regulation-card strong {
  display: block;
  color: #1d1d1f;
  font-size: 16px;
  line-height: 1.35;
}

/* Callout */
.per8-article .callout {
  margin: 30px 0;
  padding: 22px 24px;
  border: 1px solid #d5e7f8;
  border-radius: 20px;
  background: #eef6ff;
}

.per8-article .callout p {
  margin: 0;
  color: #31536f;
  font-size: 16px !important;
  line-height: 1.6 !important;
}

/* =========================================================
   TABEL PERBANDINGAN
   Tidak lagi dibuat full-bleed. Ini sengaja agar tidak bertabrakan
   dengan sidebar Artikel V2.
   ========================================================= */
.per8-article .comparison-zone {
  width: 100%;
  margin: 68px 0 74px;
  padding-top: 58px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.per8-article .comparison-heading {
  max-width: 780px;
  margin-bottom: 26px;
}

.per8-article .comparison-heading > p {
  margin: 0 0 7px;
  color: #86868b;
  font-size: 14px !important;
  font-weight: 650;
}

.per8-article .comparison-heading h2 {
  margin: 0;
  color: #1d1d1f;
  font-size: clamp(32px, 4.2vw, 45px);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.08;
}

.per8-article .comparison-copy {
  max-width: 760px;
  margin-top: 15px;
  color: #515154;
  font-size: 16px;
  line-height: 1.6;
}

.per8-article .comparison-zone .section {
  overflow: hidden;
  margin: 24px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px 42px rgba(20, 43, 76, 0.07);
}

.per8-article .section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 21px 22px;
  border-bottom: 1px solid #e8e8ed;
  background: #f8f8fa;
}

.per8-article .section-title {
  margin: 0;
  color: #1d1d1f;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.per8-article .badge {
  max-width: 46%;
  flex: 0 0 auto;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eaf4ff;
  color: #0071e3;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
}

/* Reset benturan dari tabel global artikel-editorial.css */
.per8-article .comparison-zone .table-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.per8-article .comparison-zone table {
  width: 100%;
  min-width: 900px;
  margin: 0;
  border: 0;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  background: #ffffff;
  color: #3a3a3c;
  font-size: 14px;
  line-height: 1.5;
}

.per8-article .comparison-zone thead {
  display: table-header-group;
}

.per8-article .comparison-zone tbody {
  display: table-row-group;
  padding: 0;
  background: transparent;
}

.per8-article .comparison-zone tr,
.per8-article .comparison-zone tbody tr,
.per8-article .comparison-zone tbody tr:nth-child(even),
.per8-article .comparison-zone tbody tr:hover {
  display: table-row;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.per8-article .comparison-zone th,
.per8-article .comparison-zone td {
  display: table-cell;
  width: auto;
  min-width: 0;
  padding: 14px 15px;
  border-right: 1px solid #e8e8ed;
  border-bottom: 1px solid #e8e8ed;
  background: #ffffff;
  color: #3a3a3c;
  font-family: inherit;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  text-transform: none;
  vertical-align: top;
  overflow-wrap: anywhere;
}

.per8-article .comparison-zone th:last-child,
.per8-article .comparison-zone td:last-child {
  border-right: 0;
}

.per8-article .comparison-zone thead th {
  background: #f1f3f6;
  color: #424245;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.035em;
  text-transform: uppercase;
}

.per8-article .comparison-zone tbody tr:nth-child(even) td {
  background: #fbfbfd;
}

.per8-article .comparison-zone tbody tr:hover td {
  background: #f5f9ff;
}

.per8-article .comparison-zone tbody tr:last-child td {
  border-bottom: 0;
}

.per8-article .comparison-zone td:first-child {
  color: #6e6e73;
  font-weight: 700;
  text-align: center;
}

.per8-article .comparison-zone td strong {
  color: #1d1d1f;
  font-weight: 700;
}

.per8-article .comparison-zone table ul,
.per8-article .comparison-zone table ol {
  margin: 0;
  padding-left: 18px;
  color: inherit;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
}

.per8-article .comparison-zone table li {
  margin: 4px 0;
  font-size: 14px !important;
  line-height: 1.5 !important;
}

.per8-article .comparison-zone td::before {
  content: none;
}

/* Tabel 1 */
.per8-article .comparison-zone .section:nth-of-type(1) th:nth-child(1),
.per8-article .comparison-zone .section:nth-of-type(1) td:nth-child(1) { width: 6%; }
.per8-article .comparison-zone .section:nth-of-type(1) th:nth-child(2),
.per8-article .comparison-zone .section:nth-of-type(1) td:nth-child(2) { width: 25%; }
.per8-article .comparison-zone .section:nth-of-type(1) th:nth-child(3),
.per8-article .comparison-zone .section:nth-of-type(1) td:nth-child(3) { width: 33%; }
.per8-article .comparison-zone .section:nth-of-type(1) th:nth-child(4),
.per8-article .comparison-zone .section:nth-of-type(1) td:nth-child(4) { width: 36%; }

/* Tabel 2 */
.per8-article .comparison-zone .section:nth-of-type(2) th:nth-child(1),
.per8-article .comparison-zone .section:nth-of-type(2) td:nth-child(1) { width: 6%; }
.per8-article .comparison-zone .section:nth-of-type(2) th:nth-child(2),
.per8-article .comparison-zone .section:nth-of-type(2) td:nth-child(2) { width: 46%; }
.per8-article .comparison-zone .section:nth-of-type(2) th:nth-child(3),
.per8-article .comparison-zone .section:nth-of-type(2) td:nth-child(3) { width: 31%; }
.per8-article .comparison-zone .section:nth-of-type(2) th:nth-child(4),
.per8-article .comparison-zone .section:nth-of-type(2) td:nth-child(4) { width: 17%; }

.per8-article .note {
  padding: 16px 20px;
  border-top: 1px solid #e8e8ed;
  background: #fbfcff;
  color: #6e6e73;
  font-size: 13px;
  line-height: 1.55;
}

/* =========================================================
   PROMO KAP/KJS
   ========================================================= */
.per8-article .promo-section {
  width: 100%;
  margin: 0 0 70px;
  scroll-margin-top: 84px;
}

.per8-article .promo-card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(300px, .95fr);
  align-items: center;
  gap: 34px;
  overflow: hidden;
  padding: 38px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 85% 15%, rgba(80,199,226,.25), transparent 25%),
    linear-gradient(135deg,#061d42,#084f9e 57%,#058bc1);
  box-shadow: 0 22px 55px rgba(0,62,133,.18);
  color: #ffffff;
}

.per8-article .promo-card::before {
  position: absolute;
  right: -120px;
  bottom: -190px;
  width: 470px;
  height: 470px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 50%;
  content: "";
}

.per8-article .promo-copy,
.per8-article .promo-visual {
  position: relative;
  z-index: 1;
}

.per8-article .promo-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: #cfeaff;
  font-size: 11px !important;
  font-weight: 750;
  letter-spacing: .05em;
  text-transform: uppercase;
}

.per8-article .promo-copy h2 {
  margin: 0;
  color: #ffffff;
  font-size: clamp(34px, 4vw, 48px);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 1.04;
}

.per8-article .promo-copy > p {
  margin: 18px 0 0;
  color: rgba(255,255,255,.78);
  font-size: 15px !important;
  line-height: 1.6 !important;
}

.per8-article .promo-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 20px;
}

.per8-article .promo-benefits span {
  padding: 6px 9px;
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 999px;
  background: rgba(255,255,255,.09);
  color: #eaf6ff;
  font-size: 10px;
  font-weight: 650;
}

.per8-article .promo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 23px;
}

.per8-article .promo-button {
  min-height: 43px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 17px;
  border-radius: 999px;
  background: #ffffff;
  color: #084a9c;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.per8-article .promo-url {
  color: rgba(255,255,255,.7);
  font-size: 11px;
  overflow-wrap: anywhere;
}

.per8-article .promo-visual {
  min-height: 265px;
  display: grid;
  place-items: center;
}

.per8-article .browser-mockup {
  position: relative;
  width: min(390px, 100%);
  overflow: hidden;
  border: 6px solid rgba(255,255,255,.92);
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 23px 45px rgba(0,0,0,.26);
  color: #1d1d1f;
  transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
}

.per8-article .browser-bar {
  height: 30px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  background: #eef0f4;
}

.per8-article .browser-bar span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c2c4c9;
}

.per8-article .browser-content {
  padding: 18px;
  background: linear-gradient(180deg,#f8fbff,#ffffff);
}

.per8-article .browser-brand {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #084a9c;
  font-size: 10px;
  font-weight: 800;
}

.per8-article .browser-brand::before {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: #1d1d1f;
  color: #ffffff;
  content: "ASD";
  font-size: 6px;
}

.per8-article .browser-content h3 {
  margin: 18px 0 6px;
  color: #1d1d1f;
  font-size: 20px;
  letter-spacing: -0.035em;
  line-height: 1.08;
}

.per8-article .browser-content p {
  margin: 0;
  color: #6e6e73;
  font-size: 10px !important;
}

.per8-article .mock-search {
  display: grid;
  grid-template-columns: 1fr 38px;
  gap: 7px;
  margin-top: 15px;
}

.per8-article .mock-search div {
  height: 35px;
  border: 1px solid #d8dce2;
  border-radius: 10px;
  background: #ffffff;
}

.per8-article .mock-search span {
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #0071e3;
  color: #ffffff;
  font-size: 16px;
}

.per8-article .mock-table {
  display: grid;
  grid-template-columns: .7fr .7fr 1.6fr;
  gap: 1px;
  overflow: hidden;
  margin-top: 13px;
  border: 1px solid #dfe3e8;
  border-radius: 9px;
  background: #dfe3e8;
}

.per8-article .mock-table span {
  height: 25px;
  background: #ffffff;
}

.per8-article .mock-table span:nth-child(-n + 3) {
  height: 23px;
  background: #0c5ab2;
}

.per8-article .phone-mockup {
  position: absolute;
  right: -4px;
  bottom: -20px;
  width: 102px;
  overflow: hidden;
  border: 4px solid #18191c;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 18px 30px rgba(0,0,0,.25);
  transform: rotate(3deg);
}

.per8-article .phone-top {
  height: 23px;
  background: #0c5ab2;
}

.per8-article .phone-content {
  padding: 10px 8px 13px;
}

.per8-article .phone-content strong {
  display: block;
  color: #1d1d1f;
  font-size: 9px;
}

.per8-article .phone-content span {
  display: block;
  height: 21px;
  margin-top: 8px;
  border-radius: 6px;
  background: #eef1f5;
}

/* =========================================================
   MOBILE
   ========================================================= */
@media (max-width: 760px) {
  .per8-article > p,
  .per8-article > section:not(.comparison-zone):not(.promo-section) p,
  .per8-article > section:not(.comparison-zone):not(.promo-section) li {
    font-size: 16px;
  }

  .per8-article .lead {
    font-size: 18px;
  }

  .per8-article .regulation-card {
    grid-template-columns: 1fr;
  }

  .per8-article .comparison-zone {
    margin-top: 54px;
    padding-top: 48px;
  }

  .per8-article .comparison-heading h2 {
    font-size: 34px;
  }

  .per8-article .comparison-zone .section {
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }

  .per8-article .section-head {
    align-items: flex-start;
    flex-direction: column;
    padding: 18px;
    border: 1px solid #e8e8ed;
    border-radius: 20px 20px 0 0;
    background: #f8f8fa;
  }

  .per8-article .badge {
    max-width: 100%;
    text-align: left;
  }

  .per8-article .comparison-zone .table-scroll {
    overflow: visible;
  }

  .per8-article .comparison-zone table,
  .per8-article .comparison-zone tbody,
  .per8-article .comparison-zone tr,
  .per8-article .comparison-zone td {
    display: block;
    width: 100%;
  }

  .per8-article .comparison-zone table {
    min-width: 0;
    table-layout: auto;
    background: transparent;
  }

  .per8-article .comparison-zone thead {
    display: none;
  }

  .per8-article .comparison-zone tbody {
    display: grid;
    gap: 12px;
    padding: 12px 0 0;
    background: transparent;
  }

  .per8-article .comparison-zone tr,
  .per8-article .comparison-zone tbody tr,
  .per8-article .comparison-zone tbody tr:nth-child(even),
  .per8-article .comparison-zone tbody tr:hover {
    display: block;
    overflow: hidden;
    border: 1px solid #e8e8ed;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 9px 26px rgba(0,0,0,.045);
  }

  .per8-article .comparison-zone td,
  .per8-article .comparison-zone tbody tr:nth-child(even) td,
  .per8-article .comparison-zone tbody tr:hover td {
    display: block;
    width: 100% !important;
    padding: 13px 15px;
    border-right: 0;
    border-bottom: 1px solid #e8e8ed;
    background: #ffffff !important;
    color: #3a3a3c;
    font-size: 14px;
    line-height: 1.5;
    text-align: left;
  }

  .per8-article .comparison-zone td:last-child {
    border-bottom: 0;
  }

  .per8-article .comparison-zone td::before {
    display: block;
    margin-bottom: 5px;
    color: #86868b;
    content: attr(data-label) !important;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .per8-article .comparison-zone td:first-child {
    padding: 10px 15px;
    background: #eef6ff !important;
    color: #0071e3;
    font-weight: 700;
  }

  .per8-article .comparison-zone table ul,
  .per8-article .comparison-zone table ol,
  .per8-article .comparison-zone table li {
    font-size: 14px !important;
  }

  .per8-article .note {
    margin-top: 12px;
    border: 1px solid #e8e8ed;
    border-radius: 16px;
  }

  .per8-article .promo-card {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 30px 22px 34px;
    border-radius: 25px;
  }

  .per8-article .promo-copy {
    text-align: center;
  }

  .per8-article .promo-benefits,
  .per8-article .promo-actions {
    justify-content: center;
  }

  .per8-article .promo-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .per8-article .promo-button {
    width: 100%;
  }

  .per8-article .browser-mockup {
    transform: none;
  }
}

@media (max-width: 480px) {
  .per8-article .promo-benefits {
    align-items: stretch;
    flex-direction: column;
  }

  .per8-article .promo-benefits span {
    width: 100%;
    text-align: center;
  }

  .per8-article .phone-mockup {
    display: none;
  }
}

@media print {
  .per8-article .comparison-zone table {
    min-width: 0;
    font-size: 9px;
  }

  .per8-article .promo-section {
    display: none !important;
  }
}
