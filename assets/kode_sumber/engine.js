/* Kabayan PSA decision engine v2 — strictly derived from KEP-239/PJ/2026 and PMK-118/2024 s.t.d.d. PMK-71/2026.
 * Does not issue any tax determination. Returns a candidate only if mandatory explicit conditions are satisfied.
 * Public rules are paired with precise citation pointers. Use rule catalog and verification before publishing updates.
 */
(function(root, factory) {const api=factory(); if(typeof module==='object'&&module.exports)module.exports=api;root.PSAEngine=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const START='2026-10-08', END='2027-06-30', YEAR_END='2026-12-31', Q1_END='2027-03-31', PPS_END='2027-12-31', APPLY_END='2028-10-01';
const REF={
 'A':'KEP-239/PJ/2026, Lampiran A, hlm. 6–10 (pengawasan)',
 'B':'KEP-239/PJ/2026, Lampiran B, hlm. 11–12 (pemeriksaan)',
 'C':'KEP-239/PJ/2026, Lampiran C, hlm. 13–21 (penagihan)',
 'D':'KEP-239/PJ/2026, Lampiran D, hlm. 22–24 (basis data/PPS)',
 'K':'KEP-239/PJ/2026, Diktum Ketiga–Keempat, hlm. 4',
 'P':'PMK 118/2024 s.t.d.d. PMK 71/2026, Pasal 23 dan Pasal 24; petikan pada Lampiran H KEP-239/PJ/2026, hlm. 48–53',
 '21A':'PMK 71/2026, Pasal I angka 3 (Pasal 21A) dan angka 4 (Pasal 23)'
};
const ARTICLE_LABEL={
 '7':'Pasal 7 ayat (1) UU KUP','8':'Pasal 8 ayat (2)/(2a) UU KUP','9':'Pasal 9 ayat (2a)/(2b) UU KUP',
 '14_3':'Pasal 14 ayat (3) UU KUP','14_4':'Pasal 14 ayat (4) UU KUP',
 '13_2':'Pasal 13 ayat (2) UU KUP','13_3':'Pasal 13 ayat (3) UU KUP',
 '15_2':'Pasal 15 ayat (2) UU KUP','17c':'Pasal 17C ayat (5) UU KUP','17d':'Pasal 17D ayat (5) UU KUP',
 '19_1':'Pasal 19 ayat (1) UU KUP','19_2':'Pasal 19 ayat (2) UU KUP','19_3':'Pasal 19 ayat (3) UU KUP',
 'pbb10_3':'Pasal 10 ayat (3) UU PBB','pbb10_4':'Pasal 10 ayat (4) UU PBB','pbb11_3':'Pasal 11 ayat (3) UU PBB',
 '25_9':'Pasal 25 ayat (9) UU KUP','27_5d':'Pasal 27 ayat (5d) UU KUP','27_5f':'Pasal 27 ayat (5f) UU KUP'
};
const CATS={
 late:'Terlambat menyampaikan SPT',amend:'Pembetulan SPT dengan kemauan sendiri',pay:'Terlambat menyetor pajak terkait SPT',
 stp143:'STP Pasal 14 ayat (3)',stp144:'STP Pasal 14 ayat (4)',audit:'SKP hasil pemeriksaan',
 old:'SKP/STP terbit sebelum 8 Oktober 2026',newstp:'STP terbit mulai 8 Oktober 2026',
 pps:'SKP pemeriksaan terkait PPS',newreg:'WP atau PKP baru'
};
const WITHIN=(d,start,end)=>!!d&&d>=start&&d<=end;
const validDate=(v)=>{if(!/^\d{4}-\d\d-\d\d$/.test(v||''))return false;let dt=new Date(v+'T12:00:00Z');return !Number.isNaN(+dt)&&dt.toISOString().slice(0,10)===v;};
const fmt=(d)=>validDate(d)?new Date(d+'T12:00:00Z').toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}):'—';
// If a legal deadline falls on e.g. day 31 of a month with fewer days, stop rather than inventing a rollover convention.
const addMonths=(date,n)=>{if(!validDate(date))return null;let [y,m,d]=date.split('-').map(Number);let absolute=(y*12+(m-1))+n, ny=Math.floor(absolute/12), nm=absolute%12+1;let last=new Date(Date.UTC(ny,nm,0)).getUTCDate();return d>last?null:`${ny}-${String(nm).padStart(2,'0')}-${String(d).padStart(2,'0')}`;};
const quarter=(d,end=END)=>WITHIN(d,START,YEAR_END)?100:WITHIN(d,'2027-01-01',Q1_END)?50:WITHIN(d,'2027-04-01',end)?25:null;
const art=(a,allowed)=>allowed.includes(a);
const doc=(s,vals)=>vals.includes(s.document);
const dateStr=(s,field)=>validDate(s[field])?s[field]:null;
const mainDate=(s)=>s.actionDate;
const rule=(id,rate,src,why,pages,extra={})=>({id,rate,src,cite:REF[src],why,pages,...extra});
function match(s){
 const results=[]; const put=(...args)=>results.push(rule(...args));
 const a=s.article, d=s.document, letter=s.issueDate, p=s.principalDate, t=s.actionDate, part=s.partialDate;
 const sptOK=s.sptStatus==='kb' && (s.sptType==='annual'&&Number.isInteger(+s.sptYear)&&+s.sptYear<=2025&&+s.sptYear>=1 || s.sptType==='monthly'&&s.sptPeriod&&s.sptPeriod<='2026-09');
 const fileDateOK=WITHIN(t,START,END);
 const q=quarter(t);
 if(['late','amend','pay'].includes(s.category)){
   if(sptOK && q!==null && ((s.category==='late'&&a==='7'&&dateStr(s,'actionDate')) || (s.category==='amend'&&a==='8'&&WITHIN(p,START,END)) || (s.category==='pay'&&a==='9'&&WITHIN(p,START,END)))) {
      const prefix={late:'A-a',amend:'A-b',pay:'A-c'}[s.category];
      put(prefix,q,'A',{late:'SPT berstatus kurang bayar dilaporkan pada periode tarif',amend:'Pembetulan dengan kemauan sendiri berstatus kurang bayar dan pajak terkait dibayar dalam periode program',pay:'SPT dilaporkan dan pajak terutang dibayar/disetor pada periode program'}[s.category],'Lampiran A hlm. 6–8');
   }
   // Alternative for an SPT originally reported/amended before 8 Oct, STP issued during program.
   if(sptOK && WITHIN(t,'1900-01-01','2026-10-07') && doc(s,['STP']) && WITHIN(letter,START,END) && ['7','8','9'].includes(a)) {
     let r=partialRule(s,letter,'A-f-SPT','A', 'Sebelum 8 Oktober 2026 SPT telah dilaporkan/dibetulkan, lalu sebagian sanksi STP dibayar sesuai persentase khusus','Lampiran A hlm. 9–10'); if(r)results.push(r);
   }
 }
 if(s.category==='newreg' && sptOK && ['7','9'].includes(a) && ['NPWP','PKP'].includes(s.registerType) && WITHIN(s.registrationDate,START,END) && fileDateOK && (a==='7'||(WITHIN(p,START,END)))) {
   const rate=quarter(s.registrationDate);
   if(rate!==null)put('D-new',rate,'D','Tarif kategori WP/PKP baru ditentukan dari tanggal registrasi/pengukuhan; SPT periode yang dipersyaratkan telah disampaikan','Lampiran D hlm. 22–23');
   // A also potentially applies based on SPT filing date. If results differ, do not resolve legal overlap automatically.
   if(q!==null && q!==rate)put('A-parallel',q,'A','Tarif berdasarkan tanggal pelaporan yang mungkin bersinggungan dengan skema WP/PKP baru; memerlukan klarifikasi penerapan','Lampiran A hlm. 6–8');
 }
 if(s.category==='stp143' && a==='14_3' && d==='STP' && WITHIN(letter,START,END) && WITHIN(p,START,END) && p>=letter){
    const m1=addMonths(letter,1),m2=addMonths(letter,2);
    if(m1&&m2)put('A-f-143',p<=m1?100:p<=m2?50:25,'A','Pelunasan pokok dibandingkan 1/2 bulan sejak STP diterbitkan; paling lambat 30 Juni 2027','Lampiran A hlm. 8 / Contoh E hlm. 27–28');
 }
 if(s.category==='stp144' && a==='14_4' && d==='STP' && WITHIN(letter,START,END)){
   let r=partialRule(s,letter,'A-f-144','A','STP Pasal 14 ayat (4): pembayaran bagian sanksi 10% atau 25% sesuai tenggat','Lampiran A hlm. 8–9');if(r)results.push(r);
 }
 if(s.category==='audit' && doc(s,['SKPKB','SKPKBT','SKP_PBB']) && WITHIN(letter,START,END) && WITHIN(p,START,END) && p>=letter){
   const allowed = d==='SKP_PBB'?['pbb10_3','pbb10_4']:['13_2','13_3','15_2','17c','17d'];
   if(art(a,allowed)){
    const m1=addMonths(letter,1),m2=addMonths(letter,2);
    if(m1&&m2){const value=(WITHIN(letter,START,YEAR_END) && p<=YEAR_END)||p<=m1?100:p<=m2?50:25;
     put('B-d-SKP',value,'B','Pokok SKP hasil pemeriksaan dilunasi; 100% dapat mengikuti periode akhir 2026 atau satu bulan, selain itu 50%/25%','Lampiran B hlm. 11');}
   }
 }
 if(s.category==='audit' && d==='STP' && ['7','8','9','14_4'].includes(a) && WITHIN(letter,START,END)){
   let r=partialRule(s,letter,'B-d-STP','B','STP terkait hasil pemeriksaan, pembayaran sebagian sanksi berdasarkan tanggal terbit STP','Lampiran B hlm. 11–12');if(r)results.push(r);
 }
 if(s.category==='old' && letter && letter<START){
   if(d==='STP' && ['7','8','9','14_4'].includes(a) && (a!=='14_4'||s.objection==='none')){
      const r=oldPartial(s,'C-e-oldSTP','STP lama untuk Pasal 7/8/9 atau Pasal 14 ayat (4)',false);if(r)results.push(r);
   }
   if(['SKPKB','SKPKBT','SKP_PBB'].includes(d) && (d==='SKP_PBB'?['pbb10_3','pbb10_4'].includes(a):['13_2','13_3','15_2','17c','17d'].includes(a)) && s.objection==='none'){
      const v=quarter(p);if(v!==null)put('C-e-oldSKP',v,'C','SKP lama tanpa keberatan, pokok pajak dilunasi dalam periode skema','Lampiran C hlm. 14');
      const r=oldPartial(s,'C-e-oldSKPpartial','SKP lama pokok telah lunas sebelum 8 Oktober 2026');if(r&&p<START)results.push(r);
   }
   if(['STP','STP_PBB'].includes(d) && ['19_1','19_2','19_3','pbb11_3'].includes(a)){
      if(a==='pbb11_3' && d!=='STP_PBB'){}else if(a!=='pbb11_3' && d!=='STP'){}else if(s.objection==='none' || (s.objection==='approved_withdrawal'||s.objection==='not_considered')){
         const v=quarter(p);if(v!==null && ((s.objection==='none'&&['19_1','pbb11_3'].includes(a))||(s.objection!=='none'&&['19_1','19_2','19_3'].includes(a))))put('C-e-oldArrears',v,'C','STP lama, pelunasan pokok (tanpa keberatan) atau utang (dengan keberatan, memerlukan verifikasi tambahan status hukum)','Lampiran C hlm. 15–17');
         const r=oldPartial(s,'C-e-oldArrearsPartial','STP lama, pokok atau utang telah lunas sebelum program');if(r&&p<START)results.push(r);
      }
   }
 }
 if(s.category==='newstp' && d==='STP' && ['19_2','19_3'].includes(a) && WITHIN(letter,START,END) && WITHIN(p,START,YEAR_END) && s.taxKind==='pph')put('A-f-19',100,'A','Pokok PPh terutang dilunasi 8 Oktober sampai 31 Desember 2026 dan STP terbit pada periode program','Lampiran A hlm. 10');
 if(s.category==='newstp' && ['STP','STP_PBB'].includes(d) && WITHIN(letter,START,END)){
  const isArrears=['19_1','19_2','pbb11_3'].includes(a);
  if(isArrears && (a==='pbb11_3'?d==='STP_PBB':d==='STP')){
   const v=quarter(p);if(v!==null)put('C-f-newArrears',v,'C','STP baru; pokok/utang dilunasi dalam periode yang ditentukan (sesuai status keberatan)','Lampiran C hlm. 18–19');
  }
  if(['19_1','19_2','19_3','pbb11_3'].includes(a) && (a.startsWith('pbb')?d==='STP_PBB':d==='STP') && p<START){
    const r=partialRule(s,letter,'C-f-newArrearsPartial','C','Pokok/utang telah lunas sebelum 8 Oktober 2026 dan sebagian sanksi STP baru dibayar sesuai tenggat','Lampiran C hlm. 20–21');if(r)results.push(r);
  }
 }
 if(s.category==='pps' && d==='SKPKB_PPS' && ['13_2','15_2'].includes(a) && WITHIN(letter,START,PPS_END) && WITHIN(p,START,PPS_END) && p>=letter){
     const m1=addMonths(letter,1),m2=addMonths(letter,2);
     if(m1&&m2)put('D-g-PPS',p<=m1?100:p<=m2?50:25,'D','Pelunasan pokok SKP terkait PPS maksimal 31 Desember 2027, berdasarkan 1 atau 2 bulan sejak tanggal terbit','Lampiran D hlm. 23–24');
 }
 if(s.category==='newstp' && d==='STP' && ['14_3','14_4','7','8','9','19_2','19_3'].includes(a)){
   // Explicit category-specific routes are handled by separate scenario cards to prevent source conflict.
 }
 return results;
}
function oldPartial(s,id,why,requireOldPrincipal=true){
 if(requireOldPrincipal && !(s.principalDate && s.principalDate<START))return null;
 if(!WITHIN(s.partialDate,START,END))return null;
 const rate=WITHIN(s.partialDate,START,YEAR_END)?90:WITHIN(s.partialDate,'2027-01-01',END)?75:null;
 if(rate===null)return null;
 if(!partialAmountMatches(s,rate))return null;
 return rule(id,rate,'C',why+'; sebagian sanksi lama dibayar dalam periode tepat','Lampiran C hlm. 13–18');
}
function partialRule(s,issue,id,src,why,pages){
 if(!validDate(issue)||!WITHIN(s.partialDate,START,END)||!s.partialDate||s.partialDate<issue)return null;
 const m1=addMonths(issue,1);
 if(!m1)return null;
 // 90%: payment 8 Oct–31 Dec 2026, or by one month from letter issue, at latest 30 Jun 2027.
 const r90=partialAmountMatches(s,90) && (WITHIN(s.partialDate,START,YEAR_END)||s.partialDate<=m1);
 // 75%: after one month from issue until 30 June 2027.
 const r75=partialAmountMatches(s,75) && s.partialDate>m1;
 if(r90)return rule(id+'-90',90,src,why,pages);
 if(r75)return rule(id+'-75',75,src,why,pages);
 return null;
}
function partialAmountMatches(s,rate){
 const base=Number(s.sanctionTotal)-Number(s.sanctionPrior);
 const amount=Number(s.sanctionProgram);
 return Number.isFinite(base)&&Number.isFinite(amount)&&base>0&&Number(s.sanctionPrior)>=0&&amount>0 && amount<base && Math.abs(amount/base-(100-rate)/100)<1e-9;
}
function checkRequired(s){const missing=[];const req=(key,label)=>{if(s[key]===undefined||s[key]===null||s[key]==='')missing.push(label);};
 req('category','Jenis masalah');req('article','Pasal sanksi');req('document','Jenis surat/dokumen');
 if(!s.document)return missing;
 if(['late','amend','pay','newreg'].includes(s.category)){
   req('sptType','Jenis SPT');req('sptStatus','Status SPT kurang bayar');if(s.sptType==='annual')req('sptYear','Tahun pajak');if(s.sptType==='monthly')req('sptPeriod','Masa pajak');req('actionDate','Tanggal pelaporan/pembetulan');
   if(!(s.principalConfirmed==='no_base'&&['7','14_4'].includes(s.article)))req('principalDate','Tanggal pelunasan/pembayaran pokok');if(s.document==='STP')req('issueDate','Tanggal STP');
   if(s.category==='newreg'){req('registrationDate','Tanggal NPWP/PKP baru');req('registerType','NPWP atau PKP baru');}
   
 }
 if(['stp143','stp144','audit','old','newstp','pps'].includes(s.category))req('issueDate','Tanggal terbit SKP/STP');
 if(['stp143','audit','old','newstp','pps'].includes(s.category) && !(s.category==='audit'&&s.document==='STP'&&['7','14_4'].includes(s.article)) && !(s.principalConfirmed==='no_base'&&['7','14_4'].includes(s.article)))req('principalDate','Tanggal pelunasan pokok/utang pajak');
 if(['stp144'].includes(s.category)||['old','newstp','audit'].includes(s.category) && ['14_4','7','8','9'].includes(s.article) && s.document==='STP' || s.category==='newstp'&&s.principalDate&&s.principalDate<START) {
  // Only required if the case depends on partial sanction; otherwise leave out and return pending if no candidate.
  if(s.category==='stp144'){req('partialDate','Tanggal pembayaran sebagian sanksi');req('sanctionTotal','Jumlah sanksi');req('sanctionPrior','Sanksi telah dibayar sebelumnya (isi 0 jika belum)');req('sanctionProgram','Pembayaran sanksi tahap program');}
 }
 req('lawsuit','Status gugatan/upaya hukum');req('objection','Status keberatan atas SKP/SPPT terkait');req('otherRemedy','Status pengajuan pengurangan/pembatalan lain');req('auction','Status proses lelang/pemindahbukuan barang sitaan');req('principalConfirmed','Konfirmasi pokok pajak lunas');req('submissionCount','Pengajuan ke berapa');req('applicationDate','Tanggal pengajuan permohonan');
 if(s.submissionCount==='2')req('previousDecision','Tanggal surat keputusan permohonan pertama dikirim');
 if(s.submissionCount==='2')req('previousCase','Apakah objek surat sama dengan permohonan pertama');
 if(s.category==='newstp' && s.article==='19_3')req('taxKind','Jenis pajak atas pokok PPh');
 if(s.sanctionState==='partial')req('allocationConfirmed','Verifikasi alokasi pembayaran ke pokok lebih dahulu');
 req('docReady','Kelengkapan dokumen/persyaratan formal');req('docApplication','Surat permohonan satu surat');req('docAffidavit','Surat pernyataan kekhilafan bermeterai');req('docLegalStatement','Surat pernyataan non litigasi / pencabutan');req('sanctionState','Status sanksi sudah dibayar');
 return missing;
}
function evaluate(s){
 const all=checkRequired(s), issues=[], flags=[], citations=new Set([REF.K,REF.P]);
 const fail=(message,ref)=>{issues.push(message);if(ref)citations.add(ref);};
 const flag=(message,ref)=>{flags.push(message);if(ref)citations.add(ref);};
 Object.keys(s).forEach(k=>{if(k.toLowerCase().includes('date')||['previousDecision','registrationDate'].includes(k)){if(s[k] && !validDate(s[k]))fail('Format tanggal tidak sah pada '+k+'.');}});
 if(all.length)return {status:'missing',rate:null,matches:[],missing:all,issues,flags,reason:'Data wajib belum lengkap. Sistem belum melakukan pemilihan fasilitas.',citations:[...citations]};
 // Direct clear stop conditions, before searching a percentage.
 if(s.document==='SPPT_P2'||s.article==='pbb2')fail('PBB-P2 daerah bukan dokumen yang tercakup sebagai SKP/STP PBB dalam aturan ini.',REF['21A']);
 if(['25_9','27_5d','27_5f'].includes(s.article))flag('Pengecualian untuk sanksi terkait Pasal 25 ayat (9) / Pasal 27 ayat (5d)/(5f) memerlukan pemeriksaan objek dan ketentuan peralihan; aplikasi tidak mengeluarkan persentase.',REF['21A']);
 if(s.sptType==='annual' && +s.sptYear>2025 || s.sptType==='monthly' && s.sptPeriod>'2026-09')fail('Masa/tahun pajak melampaui cakupan SPT yang ditetapkan dalam Diktum Kesatu huruf a–c.',REF.A);
 if(s.applicationDate>APPLY_END)fail('Permohonan melewati 1 Oktober 2028.',REF.K);
 if(s.applicationDate<START)fail('Permohonan program dipilih sebelum KEP-239/PJ/2026 berlaku.',REF.K);
 if(s.submissionCount==='3')fail('Jumlah permohonan melebihi batas Pasal 24 PMK 118/2024.',REF.P);
 if(s.document==='SKP_PBB'||s.document==='STP_PBB'){
   if(s.submissionCount==='2')fail('Permohonan pengurangan denda administratif PBB hanya satu kali menurut Pasal 24 ayat (2).',REF.P);
 }
 if(s.submissionCount==='2'){
  if(s.previousCase==='no')fail('Permohonan kedua diajukan terhadap surat berbeda dari permohonan pertama.',REF.P);
  if(s.previousCase!=='yes')flag('Kesesuaian identitas surat dengan permohonan pertama belum dikonfirmasi.',REF.P);
  const x=addMonths(s.previousDecision,3);
  if(x===null)flag('Batas 3 bulan dari keputusan pertama memiliki tanggal akhir yang perlu dihitung sesuai kaidah penanggalan; tidak diasumsikan otomatis.',REF.P);
  else if(s.applicationDate>x)flag('Permohonan kedua lewat tiga bulan dari keputusan pertama; pengecualian keadaan di luar kekuasaan WP memerlukan pembuktian.',REF.P);
 }
 if(s.lawsuit==='active')fail('Gugatan/upaya hukum masih berlangsung dan tidak memenuhi syarat khusus KEP-239 saat ini.',REF.K);
 if(s.lawsuit==='unknown')flag('Status gugatan atau upaya hukum belum dipastikan.',REF.K);
 if(s.lawsuit==='withdrawn')flag('Bukti permohonan pencabutan gugatan/upaya hukum harus diverifikasi.',REF.K);
 if(s.objection==='active')flag('Keberatan aktif: ada pengaturan pada Lampiran C, tetapi Pasal 23 membatasi kondisi keberatan. Kesesuaian harus diteliti secara hukum.',REF.P);
 if(s.objection==='unknown')flag('Status keberatan/permohonan dan persetujuan pencabutan belum dapat diverifikasi.',REF.P);
 if(s.objection==='approved_withdrawal'||s.objection==='not_considered')flag('Bukti pencabutan yang disetujui atau keputusan tidak dipertimbangkan perlu diperiksa terhadap objek surat.',REF.P);
 if(s.otherRemedy==='active')flag('Terdapat permohonan pengurangan/pembatalan lain yang belum selesai; Pasal 23 wajib diteliti.',REF.P);
 if(s.otherRemedy==='unknown')flag('Belum diketahui apakah terdapat permohonan pengurangan/pembatalan lain.',REF.P);
 if(s.otherRemedy==='closed')flag('Dokumen penutupan/pencabutan permohonan lain dan ketentuan khusus Pasal 23 perlu diperiksa.',REF.P);
 if(s.auction==='started')fail('Permohonan diajukan setelah permohonan lelang/pemindahbukuan barang sitaan pada penagihan terkait, bertentangan dengan Pasal 23 ayat (5) huruf d.',REF.P);
 if(s.auction==='unknown')flag('Status permohonan lelang/pemindahbukuan barang sitaan belum pasti.',REF.P);
 if(s.principalConfirmed==='no_base' && !['7','14_4'].includes(s.article))flag('Keterangan tidak ada pokok yang menjadi dasar sanksi memerlukan pemeriksaan khusus untuk pasal ini.',REF.P);
 if(s.principalConfirmed==='no')fail('Pokok pajak yang menjadi dasar sanksi belum lunas; Pasal 23 ayat (5) huruf a mensyaratkan pelunasan.',REF.P);
 if(s.principalConfirmed==='unknown')flag('Pelunasan pokok yang menjadi dasar sanksi belum dapat dipastikan.',REF.P);
 if(['no','unknown'].includes(s.docApplication))flag('Surat permohonan tertulis bahasa Indonesia, satu surat per permohonan, tanda tangan dan alasan belum diverifikasi.',REF.P);
 if(['no','unknown'].includes(s.docAffidavit))flag('Pernyataan bahwa sanksi karena kekhilafan/bukan kesalahan yang ditandatangani di atas meterai belum terverifikasi.',REF.K);
 if(['no','unknown'].includes(s.docLegalStatement))flag('Pernyataan tidak menggugat bermeterai / bukti pencabutan sesuai kondisi belum terverifikasi.',REF.K);
 if(s.docReady==='no')fail('Berkas formal belum lengkap; permohonan belum dapat dinyatakan siap menurut Pasal 23 dan Diktum Keempat.',REF.P);
 if(s.docReady==='unknown')flag('Kelengkapan surat permohonan, pernyataan meterai, dan dokumen pendukung belum diverifikasi.',REF.K);
 if(s.sanctionState==='fully')fail('Sanksi sudah dibayar seluruhnya, sehingga tidak ada sanksi belum dibayar untuk diberi pengurangan.',REF.K);
 if(s.sanctionState==='unknown')flag('Status pembayaran sanksi belum dipastikan.',REF.K);
 if(s.sanctionState==='partial' && s.allocationConfirmed!=='yes')flag('Perhitungan sebagian sanksi belum diverifikasi setelah pembayaran diperhitungkan terlebih dahulu ke pokok sesuai Pasal 23 ayat (6)–(7).',REF.P);
 if(s.sanctionState==='partial' && !(Number(s.sanctionTotal)>0))flag('Pembayaran sebagian sanksi wajib diikuti rincian sanksi dan jumlah yang sudah dibayar agar sisa objek permohonan terukur.',REF.K);
 if(s.sanctionState==='partial' && Number(s.sanctionPrior||0)===0 && Number(s.sanctionProgram||0)===0)flag('Status sebagian sanksi telah dibayar tidak cocok dengan jumlah pembayaran 0 rupiah.',REF.K);
 if(s.sanctionState==='unpaid' && (Number(s.sanctionPrior||0)>0 || Number(s.sanctionProgram||0)>0))flag('Status belum membayar sanksi bertentangan dengan isian pembayaran sebagian sanksi.',REF.K);
 if(s.issueDate && s.applicationDate && s.issueDate>s.applicationDate)flag('Tanggal SKP/STP lebih lambat daripada tanggal permohonan; permohonan belum dapat diverifikasi atas surat tersebut.',REF.P);
 if(s.sanctionTotal!=='' && s.sanctionTotal!==undefined){
  const total=Number(s.sanctionTotal), prior=Number(s.sanctionPrior||0), payment=Number(s.sanctionProgram||0);
  if(!Number.isFinite(total)||total<=0||prior<0||payment<0||prior+payment>total)fail('Nominal sanksi dan pembayaran tidak konsisten.');
  if(total>0&&prior+payment>=total)fail('Seluruh sanksi sudah dilunasi; fasilitas hanya atas sanksi yang belum dibayar.',REF.K);
 }
 if(['old','newstp','stp143','audit','pps'].includes(s.category) && s.principalDate && s.principalDate>s.applicationDate)flag('Tanggal pelunasan pokok lebih lambat daripada permohonan. Pasal 23 mensyaratkan pokok sudah lunas saat permohonan.',REF.P);
 if(['late','amend','pay','newreg'].includes(s.category) && s.document!=='STP')flag('Permohonan atas sanksi biasanya memerlukan STP yang menjadi objek. Identitas STP belum terkonfirmasi.',REF.P);
 if(s.category==='old' && !(s.issueDate<START))fail('Pilihan SKP/STP lama mensyaratkan tanggal terbit sebelum 8 Oktober 2026.',REF.C);
 if(s.category==='newstp' && !(WITHIN(s.issueDate,START,END)))fail('STP baru di luar rentang penerbitan 8 Oktober 2026 sampai 30 Juni 2027.',REF.C);
 if(['audit','pps','stp143','stp144'].includes(s.category) && !validDate(s.issueDate))flag('Tanggal surat diperlukan untuk menghitung rentang satu atau dua bulan.',REF[s.category==='pps'?'D':s.category==='audit'?'B':'A']);
 if(s.category==='newreg'&&s.registrationDate>s.actionDate)flag('Tanggal pendaftaran/pengukuhan lebih lambat daripada tanggal SPT; urutan perlu diperiksa.',REF.D);
 if(s.issueDate && s.principalDate && ['audit','pps','stp143'].includes(s.category) && addMonths(s.issueDate,1)===null)flag('Tanggal jatuh tempo satu/dua bulan melibatkan akhir bulan yang tidak mempunyai tanggal sama; aplikasi tidak menentukan batas dengan asumsi sendiri.',REF[s.category==='pps'?'D':s.category==='audit'?'B':'A']);
 let matches=match(s);for(const x of matches)citations.add(x.cite);
 if(matches.length>1&&new Set(matches.map(x=>x.rate)).size>1)flag('Lebih dari satu skema berpotensi berlaku dan menghasilkan persentase berbeda. Aplikasi tidak memilih otomatis.',REF.D);
 let rate=matches.length===1?matches[0].rate:(matches.length>1&&new Set(matches.map(x=>x.rate)).size===1?matches[0].rate:null);
 // Reconcile potentially missing important facts and scenario mismatch.
 if(s.category==='audit'&&s.document==='STP'&&matches.length===0)flag('Untuk STP pemeriksaan, skema 90%/75% memerlukan bukti pembayaran sebagian sanksi sesuai Lampiran B.',REF.B);
 if(['old','newstp'].includes(s.category)&&['14_4','14_3','7','8','9','19_3'].includes(s.article)&&!matches.length)flag('Tidak ada rule otomatis yang tepat untuk kombinasi kategori, pasal, dan tanggal ini. Periksa jalur Lampiran A/B/C yang sesuai.',REF.C);
 if(['old','newstp','stp144','audit'].includes(s.category)&&!matches.length && (s.partialDate||Number(s.sanctionProgram)>0))flag('Jumlah atau tenggat pembayaran sebagian sanksi tidak cocok dengan satu aturan yang tersedia, atau data pendukung belum lengkap.',REF.C);
 if(s.principalConfirmed==='yes' && s.principalDate && validDate(s.principalDate) && s.principalDate>s.applicationDate)flag('Bukti tanggal pelunasan pokok harus lebih awal atau sama dengan permohonan.',REF.P);
 if(s.actionDate&&s.applicationDate&&s.actionDate>s.applicationDate)flag('Tanggal pelaporan/pembetulan lebih lambat daripada permohonan yang dimasukkan.',REF.P);
 if(issues.length)return {status:'blocked',rate:null,matches,missing:[],issues,flags,reason:'Ada ketentuan wajib yang tidak terpenuhi atau data yang secara langsung bertentangan.',citations:[...citations]};
 if(flags.length)return {status:'review',rate:null,matches,missing:[],issues,flags,reason:matches.length?'Pola tarif ditemukan, tetapi syarat hukum belum cukup pasti untuk menyimpulkan persentase.':'Belum ada rule terverifikasi yang memenuhi seluruh kondisi.',citations:[...citations]};
 if(!matches.length)return {status:'unmapped',rate:null,matches,missing:[],issues,flags:['Tidak ditemukan pasangan aturan yang secara tepat mencakup seluruh data yang dipilih. Tidak dapat disimpulkan WP tidak berhak menggunakan ketentuan perpajakan lain.'],reason:'Tidak ada dasar cukup untuk menetapkan persentase pada kondisi ini.',citations:[...citations]};
 if(rate===null)return {status:'review',rate:null,matches,missing:[],issues,flags:['Hasil dua aturan bertentangan atau tidak dapat digabungkan.'],reason:'Perlu konfirmasi dasar hukum sebelum menentukan tarif.',citations:[...citations]};
 const now=new Date().toISOString().slice(0,10);
 const future=[s.actionDate,s.principalDate,s.partialDate,s.applicationDate].some(v=>v&&validDate(v)&&v>now);
 return {status:'mapped',rate,matches,missing:[],issues,flags:future?['Terdapat tanggal rencana di masa depan; hasil hanya simulasi kondisi yang direncanakan.']:[],reason:'Kombinasi yang diisi cocok dengan aturan tertulis; bukan keputusan pemberian fasilitas oleh DJP.',citations:[...citations],calculation:calculate(s,rate)};
}
function calculate(s,rate){const t=Number(s.sanctionTotal),p=Number(s.sanctionPrior||0),prog=Number(s.sanctionProgram||0);if(!Number.isFinite(t)||t<=0||p<0||prog<0||p+prog>=t)return null;const base=t-p;const eligible=base-prog;if([90,75].includes(rate)){
 if(!partialAmountMatches(s,rate))return null;
 return {base,payment:prog,relief:eligible,remaining:0,note:'Nilai pengurangan dihitung atas bagian sanksi yang belum dibayar sebelum pembayaran program; bukan pengembalian sanksi yang sudah dibayar.'};
}
 return {base,payment:prog,relief:Math.min(eligible,base*rate/100),remaining:eligible-Math.min(eligible,base*rate/100),note:'Simulasi matematis atas sanksi yang belum dibayar. Nilai definitif mengikuti keputusan administrasi perpajakan.'};
}
return {START,END,YEAR_END,PPS_END,APPLY_END,REF,ARTICLE_LABEL,CATS,evaluate,match,addMonths,fmt,validDate,quarter};
});
