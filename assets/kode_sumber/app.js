(()=>{'use strict';
const E=window.PSAEngine, $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=new Date().toISOString().slice(0,10);
const scenarios=[
 ['late','📝','Terlambat lapor SPT','Denda Pasal 7 ayat (1)'],
 ['amend','✏️','Pembetulan SPT sendiri','Bunga Pasal 8 ayat (2)/(2a)'],
 ['pay','💳','Terlambat setor pajak','Bunga Pasal 9 ayat (2a)/(2b)'],
 ['stp143','📄','STP Pasal 14 ayat (3)','Pelunasan pokok berdasar tanggal STP'],
 ['stp144','🧾','Sanksi faktur pajak','STP Pasal 14 ayat (4)'],
 ['audit','🔎','Hasil pemeriksaan','SKPKB, SKPKBT atau SKP PBB'],
 ['old','🗂️','Surat terbit sebelum 8 Okt 2026','SKP, STP, serta dokumen PBB'],
 ['newstp','📬','STP terbit sejak 8 Okt 2026','Penagihan/utang pajak dan PBB'],
 ['pps','🔐','Pemeriksaan terkait PPS','Harta yang belum/kurang diungkap'],
 ['newreg','🌱','NPWP/PKP baru','Skema khusus basis data perpajakan']
];
const documents={late:['STP','NOT_ISSUED'],amend:['STP','NOT_ISSUED'],pay:['STP','NOT_ISSUED'],newreg:['STP','NOT_ISSUED'],stp143:['STP'],stp144:['STP'],audit:['SKPKB','SKPKBT','SKP_PBB','STP'],old:['STP','SKPKB','SKPKBT','SKP_PBB','STP_PBB'],newstp:['STP','STP_PBB'],pps:['SKPKB_PPS']};
const articles={late:['7'],amend:['8'],pay:['9'],stp143:['14_3'],stp144:['14_4'],audit:['13_2','13_3','15_2','17c','17d','pbb10_3','pbb10_4','7','8','9','14_4'],old:['7','8','9','14_4','13_2','13_3','15_2','17c','17d','pbb10_3','pbb10_4','19_1','19_2','19_3','pbb11_3'],newstp:['19_1','19_2','19_3','pbb11_3','7','8','9','14_3','14_4'],pps:['13_2','15_2'],newreg:['7','9']};
for(const id of Object.keys(articles))articles[id].push('other');articles.old.push('25_9','27_5d','27_5f');articles.newstp.push('25_9','27_5d','27_5f');
const docNames={STP:'Surat Tagihan Pajak (STP)',NOT_ISSUED:'STP belum diterbitkan',SKPKB:'SKP Kurang Bayar (SKPKB)',SKPKBT:'SKP Kurang Bayar Tambahan (SKPKBT)',SKP_PBB:'Surat Ketetapan Pajak PBB (SKP PBB)',STP_PBB:'Surat Tagihan Pajak PBB (STP PBB)',SKPKB_PPS:'SKPKB / SKPKBT pemeriksaan PPS'};
let step=0,s={category:'',sanctionPrior:'0',sanctionProgram:'0',sanctionTotal:'',sptType:'',article:'',document:'',issueDate:'',sptStatus:'',actionDate:'',principalDate:'',partialDate:'',applicationDate:'',docReady:'',principalConfirmed:''};
let last=null;
function field(k,label,type='text',note='',opts=[]){const val=s[k]??'';let control='';if(type==='select'){control=`<select data-field="${k}" id="f_${k}"><option value="">— Pilih sesuai dokumen —</option>${opts.map(([v,n])=>`<option value="${esc(v)}" ${v===val?'selected':''}>${esc(n)}</option>`).join('')}</select>`;}else if(type==='currency'){control=`<input id="f_${k}" data-field="${k}" type="number" min="0" step="1" inputmode="numeric" value="${esc(val)}" placeholder="Nominal dalam rupiah">`;}else{control=`<input id="f_${k}" data-field="${k}" type="${type}" ${type==='date'?'min="1900-01-01" max="2035-12-31"':''} value="${esc(val)}" ${type==='number'?'min="1" max="2025"':''}>`;}return `<div class="field"><label for="f_${k}">${esc(label)}</label>${control}${note?`<small>${esc(note)}</small>`:''}</div>`;}
const select=(key,label,options,note='')=>field(key,label,'select',note,options);
const date=(key,label,note='')=>field(key,label,'date',note);
const money=(key,label,note='')=>field(key,label,'currency',note);
const yesNoUnk=[['yes','Ya, telah dikonfirmasi'],['no','Tidak'],['unknown','Belum tahu / belum dapat dipastikan']];
const asOptions=(l,map)=>l.map(id=>[id,map[id]||id]);
const catChosen=()=>s.category&&E.CATS[s.category];
const cardText=()=>scenarios.find(x=>x[0]===s.category)?.[2]||'—';
function step0(){
 const first=['late','amend','pay','audit','old'], main=scenarios.filter(x=>first.includes(x[0])), more=scenarios.filter(x=>!first.includes(x[0]));
 const c=([id,ico,title,sub])=>`<button type="button" class="choice ${s.category===id?'selected':''}" data-scenario="${id}" aria-pressed="${s.category===id?'true':'false'}"><span class="emoji" aria-hidden="true">${ico}</span><span><strong>${esc(title)}</strong><small>${esc(sub)}</small></span><span class="choice-check" aria-hidden="true">✓</span></button>`;
 return `<div class="question-intro"><span class="question-index">01 · PILIH KASUS</span><h3>Masalah pajak apa yang Anda alami?</h3><p class="help">Pilih kondisi yang paling mendekati situasi Anda. Rincian pasal dan surat akan diperiksa pada langkah berikutnya.</p></div><div class="cards">${main.map(c).join('')}</div><details class="more-cases" ${more.some(x=>x[0]===s.category)?'open':''}><summary>Kasus lainnya <span>STP khusus, PPS, PBB, atau NPWP/PKP baru</span></summary><div class="cards">${more.map(c).join('')}</div></details><div class="inline-note">Punya beberapa SKP/STP? Periksa satu surat setiap kali, sesuai ketentuan satu permohonan untuk satu surat.</div>`;
}
const hasSPT=()=>['late','amend','pay','newreg'].includes(s.category);
const reqPrincipal=()=>!['7','14_4'].includes(s.article)||s.principalConfirmed!=='no_base';
const needsPrincipalDate=()=>s.principalConfirmed==='yes'&&reqPrincipal() && !(
 s.category==='stp144'||(s.category==='audit'&&s.document==='STP'&&['7','14_4'].includes(s.article)));
const hasPartialPath=()=> s.category==='stp144'||
 (s.category==='audit'&&s.document==='STP')||
 (s.category==='old' ||s.category==='newstp')||
 (['late','amend','pay'].includes(s.category)&&s.document==='STP');
const conditionalFieldNames=['registrationDate','registerType','sptYear','sptPeriod','actionDate','sptType','sptStatus','issueDate','principalDate','taxKind','partialDate','sanctionTotal','sanctionPrior','sanctionProgram','allocationConfirmed','objection','stpLinked','previousDecision','previousCase','docApplication','docAffidavit','docLegalStatement','auction','auctionCondition','estimateChoice'];
function syncDerived(){
 if(!s.category)return;
 const docs=documents[s.category]||[];
 if(docs.length===1)s.document=docs[0];
 if(s.document && !docs.includes(s.document))s.document='';
 const pairs=E.PAIRS?.[s.category]?.[s.document]||[];const allowed=(articles[s.category]||[]).filter(a=>(pairs.includes(a)||(a==='other'&&pairs.length>1)));
 if(allowed.length===1)s.article=allowed[0];
 else if(s.article && !allowed.includes(s.article))s.article='';
 if(s.document==='NOT_ISSUED'){s.issueDate='';s.sanctionState='unknown';s.stpLinked='unknown';s.objection='unknown';s.otherRemedy='unknown';}
 if(s.stpLinked==='no'){s.objection='none';}else if(s.stpLinked==='unknown'){s.objection='unknown';}
 if(s.auctionCondition==='no')s.auction='not_started';
 else if(s.auctionCondition==='unknown')s.auction='unknown';
 if(s.docReady==='no'||s.docReady==='unknown'){s.docApplication='unknown';s.docAffidavit='unknown';s.docLegalStatement='unknown';}
 if(s.principalConfirmed!=='yes')s.principalDate='';
 if(s.sanctionState==='fully'||s.sanctionState==='unpaid'||s.sanctionState==='unknown'){
    s.sanctionPrior='0';s.sanctionProgram='0';s.partialDate='';s.allocationConfirmed='';s.paymentPath='';
 }
 if(s.sanctionState==='partial'&&(!hasPartialPath()||s.paymentPath!=='yes')){s.partialDate='';s.sanctionProgram='0';}
 if(s.sanctionState==='unpaid'&&s.estimateChoice!=='yes')s.sanctionTotal='';
 if(s.sanctionState!=='partial'&&s.sanctionState!=='unpaid')s.sanctionTotal='';
 if(s.submissionCount!=='2'){s.previousDecision='';s.previousCase='';}
}
function step1(){
 syncDerived();
 let html=`<div class="question-intro"><span class="question-index">02 · DATA KASUS</span><h3>Isi fakta yang berkaitan dengan kasus Anda</h3><p class="help">Pertanyaan berikut berubah otomatis sesuai jawaban. Kolom yang tidak relevan tidak ditampilkan dan tidak digunakan dalam perhitungan.</p></div><div class="field-grid">`;
 const docs=documents[s.category]||[];
 if(docs.length>1)html+=select('document','Dokumen sanksi yang Anda miliki',asOptions(docs,docNames));
 else html+=`<div class="field"><div class="fact-chip">Dokumen: ${esc(docNames[s.document]||'—')}</div></div>`;
 if(!s.document){html+='</div><div class="inline-note">Pilih jenis dokumen terlebih dahulu untuk menampilkan pertanyaan berikutnya.</div>';return html;}
 const valid=(E.PAIRS?.[s.category]?.[s.document]||[]);
 const opts=(articles[s.category]||[]).filter(a=>valid.includes(a)||(a==='other'&&valid.length>1));
 if(opts.length>1)html+=select('article','Pasal atau jenis sanksi',asOptions(opts,{...E.ARTICLE_LABEL,other:'Tidak tercantum / belum dapat dikenali'}),'Gunakan pasal yang tertera pada surat.');
 else if(opts.length===1)html+=`<div class="field"><div class="fact-chip">Sanksi: ${esc(E.ARTICLE_LABEL[s.article]||'—')}</div></div>`;
 if(!s.article){html+='</div><div class="inline-note">Pilih dasar pengenaan sanksi untuk melanjutkan pertanyaan khusus kasus ini.</div>';return html;}
 if(hasSPT()){
   html+=select('sptType','SPT yang terkait',[['annual','SPT Tahunan PPh'],['monthly','SPT Masa']]);
   if(s.sptType==='annual')html+=field('sptYear','Tahun Pajak','number','Dibatasi Tahun Pajak 2025 dan sebelumnya.');
   if(s.sptType==='monthly')html+=field('sptPeriod','Masa Pajak','month','Dibatasi sampai Masa Pajak September 2026.');
   if(s.sptType){
    html+=select('sptStatus','Status SPT',[['kb','Kurang Bayar'],['other','Nihil / Lebih Bayar / status lain'],['unknown','Belum tahu']]);
    html+=date('actionDate',s.category==='amend'?'Tanggal pembetulan SPT':'Tanggal SPT disampaikan');
   }
   if(s.category==='newreg'){
    html+=select('registerType','Jenis pendaftaran',[['NPWP','Pendaftaran NPWP'],['PKP','Pengukuhan PKP']]);
    if(s.registerType)html+=date('registrationDate','Tanggal terdaftar atau dikukuhkan');
   }
 }
 if(s.document!=='NOT_ISSUED')html+=date('issueDate','Tanggal surat diterbitkan');
 const noBaseEligible=['7','14_4'].includes(s.article);
 html+=select('principalConfirmed','Apakah pokok pajak yang menjadi dasar sanksi sudah lunas?',[
  ['yes','Ya, sudah lunas'],['no','Belum lunas'],
  ...(noBaseEligible?[['no_base','Tidak ada pokok pajak terkait sanksi ini']]:[]),
  ['unknown','Belum dapat dipastikan']
 ],'Pembayaran atas SKP/STP diperhitungkan terlebih dahulu ke pokok pajak (Pasal 23).');
 if(needsPrincipalDate())html+=date('principalDate','Tanggal pokok/utang pajak dilunasi seluruhnya');
 if(s.category==='newstp'&&s.article==='19_3')html+=select('taxKind','Jenis pajak pada pokok terutang',[['pph','Pajak Penghasilan'],['other','Selain PPh'],['unknown','Belum tahu']]);
 if(s.document!=='NOT_ISSUED'){
  html+=select('sanctionState','Status pembayaran sanksi yang dimohonkan',[['unpaid','Sanksi belum dibayar'],['partial','Sanksi sudah dibayar sebagian'],['fully','Sanksi sudah dibayar seluruhnya'],['unknown','Belum tahu']]);
  if(s.sanctionState==='partial'){
    html+='</div><h4 class="sublabel">Rincian sanksi yang sudah dibayar</h4><div class="field-grid">';
    html+=money('sanctionTotal','Jumlah seluruh sanksi (Rp)');
    html+=money('sanctionPrior','Pembayaran sanksi sebelum tindakan yang diuji (Rp)','Masukkan 0 bila belum ada pembayaran lebih awal.');
    if(hasPartialPath()){
      html+=select('paymentPath','Apakah ada pembayaran khusus 10% atau 25% untuk mengikuti program?', [['yes','Ya, sudah/akan dibayar untuk program'],['no','Tidak, hanya pembayaran sanksi sebelumnya'],['unknown','Belum tahu']]);
      if(s.paymentPath==='yes'){
      html+=money('sanctionProgram','Jumlah pembayaran sanksi dalam skema program (Rp)','Digunakan untuk menguji persyaratan 10% atau 25% apabila relevan.');
      html+=date('partialDate','Tanggal pembayaran sebagian sanksi');
      }
    }
    html+=select('allocationConfirmed','Apakah jumlah pembayaran sanksi telah dipastikan setelah alokasi ke pokok?',yesNoUnk);
  }
  if(s.sanctionState==='unpaid'){
    html+=select('estimateChoice','Apakah ingin menghitung perkiraan nominal?',[['no','Tidak, tampilkan persentase saja'],['yes','Ya, tampilkan nilai rupiahnya']]);
    if(s.estimateChoice==='yes')html+=money('sanctionTotal','Nilai sanksi yang belum dibayar (Rp)');
  }
 }
 html+='</div><div class="inline-note"><b>Ketentuan:</b> jawaban yang belum dapat dipastikan tidak akan diubah menjadi asumsi. Hasil persentase hanya muncul bila cocok dengan aturan dan persyaratan yang telah diverifikasi.</div>';
 return html;
}
function step2(){
 syncDerived();
 let html=`<div class="question-intro"><span class="question-index">03 · SYARAT PERMOHONAN</span><h3>Periksa persyaratan yang masih relevan</h3><p class="help">Jawab sesuai fakta atau dokumen. Formulir tambahan baru muncul apabila diperlukan oleh jawaban Anda.</p></div><div class="field-grid">`;
 if(['STP','STP_PBB'].includes(s.document)){
   html+=select('stpLinked','Apakah STP ini terkait SKP atau SPPT yang diajukan keberatan?',[[ 'no','Tidak, STP berdiri sendiri/tidak terkait' ],['yes','Ya, STP terkait SKP/SPPT'],['unknown','Belum dapat dipastikan']]);
 }
 if(['SKPKB','SKPKBT','SKP_PBB','SKPKB_PPS'].includes(s.document)||s.stpLinked==='yes'){
  html+=select('objection','Status keberatan atas SKP/SPPT terkait',[
  ['none','Tidak pernah mengajukan keberatan'],['approved_withdrawal','Pencabutan telah disetujui DJP'],
  ['not_considered','Keberatan tidak dipertimbangkan'],['decided','Keberatan sudah diputus'],
  ['active','Sedang berlangsung'],['unknown','Tidak diketahui']]);
 }
 html+=select('otherRemedy','Apakah ada permohonan pengurangan/pembatalan lain atas surat terkait?',[
  ['none','Tidak ada'],['closed','Pernah ada, sudah selesai/dicabut'],['active','Masih diajukan'],['unknown','Belum tahu']]);
 html+=select('lawsuit','Status gugatan atau upaya hukum lainnya',[
  ['none','Tidak mengajukan'],['withdrawn','Pernah diajukan dan dicabut'],['active','Masih berlangsung'],['unknown','Belum tahu']]);
 html+=select('auctionCondition','Apakah perkara sudah masuk tindakan penagihan atas barang sitaan?',[
  ['no','Tidak'],['yes','Ya'],['unknown','Belum tahu']]);
 if(s.auctionCondition==='yes')html+=select('auction','Tahap yang sudah dilakukan',[
  ['not_started','Belum ada permohonan lelang/pemindahbukuan'],['started','Sudah diajukan permohonan lelang/pemindahbukuan'],['unknown','Belum tahu']]);
 html+='</div><h4 class="sublabel">Waktu dan berkas permohonan</h4><div class="field-grid">';
 html+=date('applicationDate','Tanggal permohonan diajukan/direncanakan','Batas KEP-239 adalah 1 Oktober 2028, bukan batas pembayaran pokok.');
 html+=select('submissionCount','Permohonan untuk surat yang sama',[['1','Permohonan pertama'],['2','Permohonan kedua'],['3','Ketiga atau lebih']]);
 if(s.submissionCount==='2'){
  html+=date('previousDecision','Tanggal keputusan atas permohonan pertama dikirim');
  html+=select('previousCase','Apakah objek surat sama dengan pengajuan pertama?',[['yes','Ya'],['no','Tidak'],['unknown','Belum pasti']]);
 }
 html+=select('docReady','Apakah kelengkapan permohonan sudah disiapkan?',[
  ['yes','Ya, saya akan memeriksa dokumennya'],['no','Belum lengkap'],['unknown','Belum diperiksa']]);
 if(s.docReady==='yes'){
  html+=select('docApplication','Surat permohonan berbahasa Indonesia, per satu surat, dan ditandatangani?',yesNoUnk);
  html+=select('docAffidavit','Surat pernyataan kekhilafan/bukan kesalahan bermeterai?',yesNoUnk);
  if(s.lawsuit==='none')html+=select('docLegalStatement','Surat pernyataan tidak menggugat bermeterai tersedia?',yesNoUnk);
  else if(s.lawsuit==='withdrawn')html+=select('docLegalStatement','Dokumen permohonan pencabutan gugatan/upaya hukum lainnya tersedia?',yesNoUnk);
  else s.docLegalStatement='unknown';
 }
 html+='</div><div class="inline-note">Alat bantu ini tidak memverifikasi berkas atau status sengketa langsung ke DJP dan tidak menerbitkan keputusan fasilitas.</div>';
 return html;
}
function rupiah(n){return 'Rp'+Math.round(n).toLocaleString('id-ID');}
function resultHTML(){let r=s.document==='NOT_ISSUED'?{status:'review',rate:null,matches:[],missing:[],issues:[],flags:['STP belum diterbitkan. Permohonan pengurangan sanksi menurut Pasal 23 memerlukan identitas SKP/STP terkait; sistem belum dapat memberi persentase.'],reason:'Dokumen penetapan/tagihan yang akan menjadi objek permohonan belum tersedia.',citations:[E.REF.P,E.REF.K]}:E.evaluate(s);last=r;
 const status={mapped:['Kondisi sesuai skema tertulis','mapped','Hasil simulasi berdasarkan jawaban Anda'],missing:['Informasi belum lengkap','review','Lengkapi seluruh data wajib sebelum sistem menentukan skema'],review:['Perlu verifikasi hukum','review','Tidak ada persentase yang diputuskan secara otomatis'],blocked:['Persyaratan tidak terpenuhi','blocked','Periksa hambatan yang disebutkan di bawah'],unmapped:['Tidak dapat ditentukan','review','Belum ditemukan aturan spesifik yang cocok']};
 let [ttl,css,sub]=status[r.status]; const based=(r.matches||[]).map(x=>`<div class="legalitem"><strong>${esc(x.id)}</strong> · ${esc(x.cite)}<div>${esc(x.why)}. ${esc(x.pages)}</div></div>`).join('');
 let nam=cardText();
 const msgs=[...(r.missing||[]).map(x=>({c:'review',m:'Belum diisi: '+x})),...(r.issues||[]).map(x=>({c:'blocked',m:x})),...(r.flags||[]).map(x=>({c:'review',m:x}))];
 return `<div class="result-zone"><div class="res-head ${css}"><strong>${css==='mapped'?'✓':css==='blocked'?'✕':'!'} ${esc(ttl)}</strong>${r.status==='mapped'?`<div class="rate">${r.rate}% <small>potensi pengurangan</small></div>`:`<h2>${esc(ttl)}</h2>`}<p>${esc(sub)}. ${esc(r.reason)}</p></div>
 <div class="factcols"><div class="tile"><small>Kategori peristiwa</small><strong>${esc(nam)}</strong></div><div class="tile"><small>Pasal sanksi</small><strong>${esc(E.ARTICLE_LABEL[s.article]||'—')}</strong></div><div class="tile"><small>Dokumen</small><strong>${esc(docNames[s.document]||s.document||'—')}</strong></div><div class="tile"><small>Batas permohonan program</small><strong>1 Oktober 2028</strong></div></div>
 ${r.calculation?`<div class="sectionbox"><h4>Simulasi nominal berdasarkan data yang diinput</h4><div class="factcols"><div class="tile"><small>Dasar sanksi yang belum dibayar</small><strong>${rupiah(r.calculation.base)}</strong></div><div class="tile"><small>Perkiraan pengurangan</small><strong>${rupiah(r.calculation.relief)}</strong></div></div><p class="smalltxt">${esc(r.calculation.note)}</p></div>`:''}
 ${msgs.length?`<div class="sectionbox"><h4>Alasan, data yang kurang, atau persyaratan yang perlu diperiksa</h4>${msgs.map(x=>`<div class="message ${x.c}">${esc(x.m)}</div>`).join('')}</div>`:''}
 <div class="sectionbox"><h4>Dasar keputusan mesin aturan</h4>${based||'<div class="inline-note">Tidak ada rule dengan seluruh persyaratan yang dapat dicocokkan secara pasti untuk skenario ini.</div>'}
 <details class="legal-detail"><summary>Tampilkan dasar hukum umum</summary>${r.citations.map(x=>`<div class="legalitem">${esc(x)}</div>`).join('')}</details></div>
 <details class="sectionbox checklist-details"><summary>Checklist dokumen dan persyaratan akhir <span>9 hal untuk diperiksa</span></summary><div class="checklist-items">${['Pokok pajak yang menjadi dasar sanksi telah lunas sesuai Pasal 23','Periksa status keberatan, pembatalan dan gugatan/upaya hukum lain','Surat permohonan dalam bahasa Indonesia, satu permohonan per SKP/STP atau surat PBB','Surat pernyataan kekhilafan/bukan karena kesalahan ditandatangani di atas meterai','Surat pernyataan tidak menggugat bermeterai atau bukti pencabutan sesuai kasus','Sanksi yang dimohonkan masih belum dibayar; jumlah dan pembayaran sebagian direkonsiliasi','Permohonan pertama/kedua dan batas 3 bulan telah diperiksa','Pengajuan sebelum permohonan lelang/pemindahbukuan barang sitaan','Batas tindakan khusus dan batas pengajuan 1 Oktober 2028 dipenuhi'].map(item=>`<label class="message"><input type="checkbox" style="margin-top:4px;accent-color:#0071e3" aria-label="Periksa kelengkapan"> <span>${esc(item)}</span></label>`).join('')}</div></details>
 <div class="callout"><b>Penggunaan terbatas:</b> hasil adalah alat bantu edukasi berdasarkan kondisi yang diinput sendiri. Tidak memverifikasi data DJP, bukan surat keputusan pengurangan/penghapusan dan tidak menggantikan pemeriksaan Pasal 23–24. </div></div>`;
}
function render(){syncDerived();const labels=['Pilih kondisi','Detail dokumen','Syarat & prosedur','Hasil analisis'];$('step-label').textContent=`LANGKAH ${step+1} DARI 4 · ${labels[step]}`;$('step-text').textContent=step===0?'Pilih kondisi yang Anda alami':step===3?'Hasil pemetaan berdasarkan jawaban Anda':cardText();$('wizard-panel').dataset.step=String(step);$('stepper').setAttribute('aria-valuenow',String(step+1));$('stepper').innerHTML=labels.map((x,i)=>`<span class="${i<=step?'done':''}" title="${esc(x)}"></span>`).join('');$('body').innerHTML=[step0,step1,step2,resultHTML][step]();$('back').style.visibility=step===0?'hidden':'visible';$('next').textContent=step===0?'Lanjutkan →':step===1?'Periksa persyaratan →':step===2?'Lihat hasil saya →':'Periksa kasus baru ↻';$('next').disabled=step===0&&!catChosen();$('print').hidden=step!==3;$('copy').hidden=step!==3;$('footer-message').textContent=step===3?'Setiap hasil tetap memerlukan verifikasi dokumen di DJP':'Tidak ada data yang dikirim ke server dari halaman ini';}
function resetCase(id){s={category:id,document:(documents[id]||[]).length===1?documents[id][0]:'',article:['late','amend','pay','stp143','stp144'].includes(id)?articles[id][0]:'',sanctionPrior:'0',sanctionProgram:'0',sanctionTotal:'',applicationDate:'',sptType:'',sptStatus:'',sanctionState:'',principalConfirmed:'',docReady:''};}
function advance(){if(step===0&&!catChosen())return;
 if(step===1||step===2){
  const optional=['estimateChoice','sanctionTotal','paymentPath'];
  const required=[...document.querySelectorAll('#body [data-field]')].filter(x=>!optional.includes(x.dataset.field));
  const blank=required.filter(x=>!String(x.value).trim());
  if(blank.length){let old=document.getElementById('step-errors');if(old)old.remove();
    const note=document.createElement('div');note.id='step-errors';note.className='message review';
    note.textContent='Lengkapi '+blank.length+' informasi yang masih kosong. Pilih “Belum tahu” apabila faktanya belum dapat dipastikan.';
    document.getElementById('body').prepend(note);blank[0].focus();return;
  }
 }
 if(step===3){step=0;resetCase('');}else if(step===1&&s.document==='NOT_ISSUED'){step=3;}else step++;render();$('cek').scrollIntoView({behavior:'smooth',block:'start'});}
function backup(){if(step>0){step--;render();$('cek').scrollIntoView({behavior:'smooth',block:'start'});}}
function copyText(){if(!last)return;let report=`KABAYAN | CEK KERINGANAN SANKSI PAJAK\nStatus: ${last.status}\nKategori: ${cardText()}\nPasal: ${E.ARTICLE_LABEL[s.article]||'-'}\nPersentase simulasi: ${last.rate===null?'TIDAK DITENTUKAN':last.rate+'%'}\nAlasan: ${last.reason}\nAturan: ${(last.matches||[]).map(x=>x.cite).join('; ')}\nCatatan: ${[...(last.flags||[]),...(last.issues||[])].join('; ')}\nBatas permohonan: 1 Oktober 2028.\nPanduan edukasi, bukan keputusan DJP.`;if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(report).then(()=>toast('Ringkasan disalin.')).catch(()=>fallbackCopy(report));}else fallbackCopy(report);}
function fallbackCopy(v){let a=window.prompt('Salin ringkasan:',v);if(a!==null)toast('Ringkasan siap disalin.');}
function toast(v){$('footer-message').textContent=v;}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-scenario]');if(b){resetCase(b.dataset.scenario);render();}});
document.addEventListener('change',ev=>{const c=ev.target;if(c.dataset.field){s[c.dataset.field]=c.value;if(['document','article','sptType','sptStatus','registerType','principalConfirmed','sanctionState','estimateChoice','paymentPath','stpLinked','objection','auctionCondition','submissionCount','docReady','lawsuit'].includes(c.dataset.field)){
 if(c.dataset.field==='document'){s.article='';s.principalConfirmed='';s.issueDate='';s.principalDate='';s.sanctionState='';s.stpLinked='';s.objection='';}
 if(c.dataset.field==='article'){s.principalConfirmed='';s.principalDate='';s.sanctionState='';s.partialDate='';s.sanctionTotal='';}
 if(c.dataset.field==='sptType'){s.sptYear='';s.sptPeriod='';s.sptStatus='';s.actionDate='';}
 if(c.dataset.field==='sanctionState'){s.sanctionTotal='';s.sanctionPrior='0';s.sanctionProgram='0';s.partialDate='';s.estimateChoice='';s.paymentPath='';}
 if(c.dataset.field==='paymentPath'){s.sanctionProgram='0';s.partialDate='';}
 if(c.dataset.field==='principalConfirmed')s.principalDate='';
 if(c.dataset.field==='stpLinked')s.objection='';
 if(c.dataset.field==='auctionCondition')s.auction='';
 if(c.dataset.field==='lawsuit')s.docLegalStatement='';
 if(c.dataset.field==='docReady'){s.docApplication='';s.docAffidavit='';s.docLegalStatement='';}
 render();
 }}});
document.addEventListener('input',ev=>{const c=ev.target;if(c.dataset.field)s[c.dataset.field]=c.value;});
$('next').addEventListener('click',advance);$('back').addEventListener('click',backup);$('print').addEventListener('click',()=>window.print());$('copy').addEventListener('click',copyText);
render();})();
