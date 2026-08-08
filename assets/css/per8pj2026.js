/* Artikel PER-8/PJ/2026 — khusus halaman ini */

.per8-article .lead{
  margin:0 0 34px;color:#333336;font-size:21px;line-height:1.58;
}

.per8-article .regulation-card{
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:12px;margin:30px 0 9px;
}
.per8-article .regulation-card div{
  padding:20px;border:1px solid rgba(0,0,0,.09);
  border-radius:19px;background:var(--off-white);
}
.per8-article .regulation-card small{
  display:block;margin-bottom:7px;color:var(--medium-gray);
  font-size:10px;font-weight:750;letter-spacing:.05em;text-transform:uppercase;
}
.per8-article .regulation-card strong{
  display:block;color:var(--near-black);font-size:16px;line-height:1.35;
}

.per8-article .callout{
  margin:29px 0;padding:23px 24px;border:1px solid rgba(0,113,227,.13);
  border-left:4px solid var(--blue);border-radius:0 18px 18px 0;background:#f6f9fd;
}
.per8-article .callout p{margin:0}

/* Tabel perbandingan dibuat lebih lebar daripada kolom artikel */
.per8-article .comparison-zone{
  position:relative;left:50%;
  width:min(1380px,calc(100vw - 24px));
  margin:68px 0 0;padding:68px 0 85px;
  border-top:1px solid rgba(0,0,0,.09);
  transform:translateX(-50%);
}
.per8-article .comparison-heading{max-width:850px;margin-bottom:28px}
.per8-article .comparison-heading>p{
  margin:0 0 7px;color:var(--medium-gray);font-size:17px;font-weight:650;
}
.per8-article .comparison-heading h2{
  margin:0;font-size:clamp(37px,4.6vw,58px);
  font-weight:720;letter-spacing:-.055em;line-height:1.02;
}
.per8-article .comparison-copy{
  max-width:790px;margin-top:17px;color:#515154;font-size:17px;
}
.per8-article .comparison-zone .section{
  overflow:hidden;margin-top:18px;border:1px solid rgba(0,0,0,.09);
  border-radius:34px;background:#fff;
  box-shadow:0 2px 8px rgba(0,0,0,.035),0 22px 58px rgba(0,0,0,.065);
}
.per8-article .section-head{
  display:flex;align-items:center;justify-content:space-between;gap:20px;
  padding:25px 28px;border-bottom:1px solid var(--soft-gray);
  background:linear-gradient(180deg,#fff,#fbfcfe);
}
.per8-article .section-title{
  color:var(--near-black);font-size:26px;font-weight:680;letter-spacing:-.038em;line-height:1.2;
}
.per8-article .badge{
  max-width:44%;flex-shrink:0;padding:7px 11px;border-radius:999px;
  background:#eaf4ff;color:var(--blue);font-size:11px;font-weight:700;text-align:center;
}
.per8-article .table-scroll{width:100%;overflow:visible}
.per8-article .comparison-zone table{
  width:100%;min-width:0;border-collapse:separate;border-spacing:0;
  table-layout:fixed;font-size:14px;
}
.per8-article .comparison-zone th,
.per8-article .comparison-zone td{
  padding:clamp(10px,1vw,15px);border-right:1px solid #e1e1e6;
  border-bottom:1px solid #e1e1e6;overflow-wrap:anywhere;text-align:left;vertical-align:top;
}
.per8-article .comparison-zone th:last-child,
.per8-article .comparison-zone td:last-child{border-right:0}
.per8-article .comparison-zone thead th{
  background:#f5f5f7;color:#424245;font-size:11px;font-weight:780;
  letter-spacing:.045em;text-transform:uppercase;
}
.per8-article .comparison-zone tbody tr:first-child td{background:#fbfdff}
.per8-article .comparison-zone tbody tr:last-child td{border-bottom:0}
.per8-article .comparison-zone tbody tr:hover td{background:#f8fbff}
.per8-article .comparison-zone td{color:#3a3a3c;line-height:1.54}
.per8-article .comparison-zone td:first-child{
  color:#6e6e73;font-weight:800;text-align:center;
}
.per8-article .comparison-zone table ul,
.per8-article .comparison-zone table ol{
  margin:0;padding-left:17px;color:#3a3a3c;font-size:inherit;
}
.per8-article .comparison-zone table li{margin:4px 0}
.per8-article .note{
  padding:17px 22px;border-top:1px solid var(--soft-gray);
  background:#fbfcff;color:#6e6e73;font-size:13px;
}

/* Lebar kolom tabel 1 */
.per8-article .comparison-zone .section:nth-of-type(1) th:nth-child(1),
.per8-article .comparison-zone .section:nth-of-type(1) td:nth-child(1){width:5%}
.per8-article .comparison-zone .section:nth-of-type(1) th:nth-child(2),
.per8-article .comparison-zone .section:nth-of-type(1) td:nth-child(2){width:23%}
.per8-article .comparison-zone .section:nth-of-type(1) th:nth-child(3),
.per8-article .comparison-zone .section:nth-of-type(1) td:nth-child(3){width:34%}
.per8-article .comparison-zone .section:nth-of-type(1) th:nth-child(4),
.per8-article .comparison-zone .section:nth-of-type(1) td:nth-child(4){width:38%}

/* Lebar kolom tabel 2 */
.per8-article .comparison-zone .section:nth-of-type(2) th:nth-child(1),
.per8-article .comparison-zone .section:nth-of-type(2) td:nth-child(1){width:5%}
.per8-article .comparison-zone .section:nth-of-type(2) th:nth-child(2),
.per8-article .comparison-zone .section:nth-of-type(2) td:nth-child(2){width:47%}
.per8-article .comparison-zone .section:nth-of-type(2) th:nth-child(3),
.per8-article .comparison-zone .section:nth-of-type(2) td:nth-child(3){width:32%}
.per8-article .comparison-zone .section:nth-of-type(2) th:nth-child(4),
.per8-article .comparison-zone .section:nth-of-type(2) td:nth-child(4){width:16%}

/* Promo pencarian KAP/KJS */
.per8-article .promo-section{
  position:relative;left:50%;
  width:min(1180px,calc(100vw - 32px));
  margin:0 0 92px;transform:translateX(-50%);
}
.per8-article .promo-card{
  position:relative;display:grid;
  grid-template-columns:minmax(0,1.02fr) minmax(380px,.98fr);
  align-items:center;gap:52px;overflow:hidden;padding:54px;border-radius:36px;
  background:radial-gradient(circle at 85% 15%,rgba(80,199,226,.28),transparent 25%),
             linear-gradient(135deg,#061d42,#084f9e 57%,#058bc1);
  box-shadow:0 30px 70px rgba(0,62,133,.22);color:#fff;
}
.per8-article .promo-card::before{
  position:absolute;right:-130px;bottom:-190px;width:520px;height:520px;
  border:1px solid rgba(255,255,255,.13);border-radius:50%;content:"";
}
.per8-article .promo-copy,.per8-article .promo-visual{position:relative;z-index:1}
.per8-article .promo-eyebrow{
  display:inline-flex;align-items:center;gap:8px;margin:0 0 17px;
  color:#cfeaff;font-size:12px;font-weight:750;letter-spacing:.05em;text-transform:uppercase;
}
.per8-article .promo-eyebrow::before{
  width:8px;height:8px;border-radius:50%;background:#ffce2f;content:"";
}
.per8-article .promo-copy h2{
  max-width:630px;margin:0;color:#fff;font-size:clamp(37px,5vw,61px);
  font-weight:720;letter-spacing:-.055em;line-height:1;
}
.per8-article .promo-copy>p{
  max-width:620px;margin:21px 0 0;color:rgba(255,255,255,.78);font-size:17px;
}
.per8-article .promo-benefits{
  display:flex;flex-wrap:wrap;gap:8px;margin-top:24px;
}
.per8-article .promo-benefits span{
  padding:7px 10px;border:1px solid rgba(255,255,255,.15);border-radius:999px;
  background:rgba(255,255,255,.09);color:#eaf6ff;font-size:11px;font-weight:650;
}
.per8-article .promo-actions{
  display:flex;flex-wrap:wrap;align-items:center;gap:13px;margin-top:29px;
}
.per8-article .promo-button{
  min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:9px;
  padding:11px 20px;border-radius:999px;background:#fff;color:#084a9c;
  font-size:14px;font-weight:750;text-decoration:none;
  box-shadow:0 12px 28px rgba(0,0,0,.18);
}
.per8-article .promo-url{
  color:rgba(255,255,255,.72);font-size:12px;overflow-wrap:anywhere;
}
.per8-article .promo-visual{min-height:330px;display:grid;place-items:center}
.per8-article .browser-mockup{
  position:relative;width:min(500px,100%);overflow:hidden;
  border:7px solid rgba(255,255,255,.92);border-radius:23px;background:#fff;
  box-shadow:0 27px 50px rgba(0,0,0,.28);color:var(--near-black);
  transform:perspective(1000px) rotateY(-6deg) rotateX(2deg);
}
.per8-article .browser-bar{
  height:34px;display:flex;align-items:center;gap:6px;padding:0 13px;background:#eef0f4;
}
.per8-article .browser-bar span{
  width:8px;height:8px;border-radius:50%;background:#c2c4c9;
}
.per8-article .browser-content{
  padding:22px;background:linear-gradient(180deg,#f8fbff,#fff);
}
.per8-article .browser-brand{
  display:flex;align-items:center;gap:7px;color:#084a9c;font-size:11px;font-weight:800;
}
.per8-article .browser-brand::before{
  width:22px;height:22px;display:grid;place-items:center;border-radius:7px;
  background:var(--near-black);color:#fff;content:"ASD";font-size:7px;
}
.per8-article .browser-content h3{
  margin:23px 0 7px;font-size:24px;letter-spacing:-.04em;line-height:1.06;
}
.per8-article .browser-content p{margin:0;color:#6e6e73;font-size:11px}
.per8-article .mock-search{
  display:grid;grid-template-columns:1fr 42px;gap:8px;margin-top:18px;
}
.per8-article .mock-search div{
  height:39px;border:1px solid #d8dce2;border-radius:11px;background:#fff;
}
.per8-article .mock-search span{
  display:grid;place-items:center;border-radius:11px;background:var(--blue);color:#fff;font-size:17px;
}
.per8-article .mock-table{
  display:grid;grid-template-columns:.7fr .7fr 1.6fr;gap:1px;overflow:hidden;
  margin-top:15px;border:1px solid #dfe3e8;border-radius:10px;background:#dfe3e8;
}
.per8-article .mock-table span{height:29px;background:#fff}
.per8-article .mock-table span:nth-child(-n+3){height:26px;background:#0c5ab2}
.per8-article .phone-mockup{
  position:absolute;right:-10px;bottom:-28px;width:130px;overflow:hidden;
  border:5px solid #18191c;border-radius:26px;background:#fff;
  box-shadow:0 20px 35px rgba(0,0,0,.28);transform:rotate(3deg);
}
.per8-article .phone-top{height:27px;background:#0c5ab2}
.per8-article .phone-content{padding:12px 9px 15px}
.per8-article .phone-content strong{
  display:block;color:var(--near-black);font-size:11px;
}
.per8-article .phone-content span{
  display:block;height:25px;margin-top:10px;border-radius:7px;background:#eef1f5;
}

@media(max-width:900px){
  .per8-article .promo-card{grid-template-columns:1fr}
  .per8-article .promo-copy{text-align:center}
  .per8-article .promo-copy>p{margin-right:auto;margin-left:auto}
  .per8-article .promo-benefits,.per8-article .promo-actions{justify-content:center}
}

@media(max-width:760px){
  .per8-article .lead{font-size:19px}
  .per8-article .regulation-card{grid-template-columns:1fr}
  .per8-article .comparison-zone{width:calc(100vw - 20px);padding-top:55px}
  .per8-article .comparison-heading h2{font-size:38px}
  .per8-article .section-head{align-items:flex-start;flex-direction:column;padding:21px}
  .per8-article .badge{max-width:100%;text-align:left}
  .per8-article .comparison-zone table{table-layout:auto}
  .per8-article .comparison-zone thead{display:none}
  .per8-article .comparison-zone tbody{
    display:grid;gap:12px;padding:12px;background:var(--off-white);
  }
  .per8-article .comparison-zone tr{
    display:block;overflow:hidden;border:1px solid rgba(0,0,0,.09);
    border-radius:17px;background:#fff;box-shadow:0 7px 22px rgba(0,0,0,.035);
  }
  .per8-article .comparison-zone td{
    width:100%!important;display:grid;grid-template-columns:112px minmax(0,1fr);
    gap:12px;padding:13px 14px;border-right:0;border-bottom:1px solid var(--soft-gray);
    background:#fff!important;
  }
  .per8-article .comparison-zone td::before{
    color:var(--medium-gray);content:attr(data-label);font-size:10px;font-weight:760;
    letter-spacing:.045em;text-transform:uppercase;
  }
  .per8-article .comparison-zone td:first-child{
    display:flex;align-items:center;justify-content:flex-start;
    background:#eaf4ff!important;color:var(--blue);font-size:12px;text-align:left;
  }
  .per8-article .promo-section{width:calc(100vw - 20px);margin-bottom:69px}
  .per8-article .promo-card{gap:30px;padding:31px 21px 38px;border-radius:27px}
  .per8-article .promo-copy h2{font-size:40px}
  .per8-article .promo-actions{align-items:stretch;flex-direction:column}
  .per8-article .promo-button{width:100%}
  .per8-article .browser-mockup{transform:none}
  .per8-article .phone-mockup{right:-2px;width:112px}
}

@media(max-width:480px){
  .per8-article .comparison-zone td{display:block}
  .per8-article .comparison-zone td::before{display:block;margin-bottom:5px}
  .per8-article .comparison-zone td:first-child{display:flex}
  .per8-article .promo-benefits{align-items:center;flex-direction:column}
  .per8-article .promo-benefits span{width:100%}
  .per8-article .phone-mockup{display:none}
}

@media print{
  .per8-article .comparison-zone{
    position:static;width:100%;margin:0;padding-bottom:0;transform:none;
  }
  .per8-article .promo-section{display:none!important}
}
