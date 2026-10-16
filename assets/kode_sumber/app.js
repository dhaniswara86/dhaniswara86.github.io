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
function step1(){let html=`<div class="question-intro"><span class="question-index">02 · RINCIAN KASUS</span><h3>Isi detail dokumen dan pembayaran</h3><p class="help">Salin tanggal dan pasal sesuai dokumen Anda. Hanya informasi yang benar-benar relevan yang perlu diisi.</p></div><div class="field-grid">`;
 html+=select('document','Dokumen yang terkait',asOptions(documents[s.category],docNames));
 html+=select('article','Dasar pengenaan sanksi',asOptions(articles[s.category],{...E.ARTICLE_LABEL,other:'Jenis sanksi lain / tidak diketahui'}));
 if(['late','amend','pay','newreg'].includes(s.category)){
  html+=select('sptType','Jenis SPT',[['annual','SPT Tahunan PPh'],['monthly','SPT Masa']]);
  html+=select('sptStatus','Status SPT',[['kb','Kurang Bayar'],['other','Nihil / Lebih Bayar / bukan KB'],['unknown','Belum tahu']]);
  if(s.sptType==='annual')html+=field('sptYear','Tahun Pajak SPT Tahunan','number','Cakupan KEP: Tahun Pajak 2025 dan sebelumnya.');
  if(s.sptType==='monthly')html+=field('sptPeriod','Masa Pajak SPT Masa (YYYY-MM)','month','Cakupan KEP: September 2026 dan sebelumnya.');
  html+=date('actionDate',s.category==='amend'?'Tanggal pembetulan SPT':'Tanggal pelaporan SPT','Gunakan tanggal aktual; jika tanggal mendatang, hasil adalah simulasi.');
  if(s.category==='newreg'){
   html+=select('registerType','Peristiwa pendaftaran baru',[['NPWP','NPWP baru'],['PKP','Pengukuhan PKP baru']]);
   html+=date('registrationDate','Tanggal terdaftar/dikukuhkan','Persentase skema khusus Lampiran D mengikuti tanggal registrasi/pengukuhan.');
  }
 }
 if(s.document!=='NOT_ISSUED')html+=date('issueDate','Tanggal terbit SKP / STP','Isi sesuai tanggal yang tercetak pada surat.');
 if((s.category!=='audit'||s.document!=='STP')&&!(s.principalConfirmed==='no_base'&&['7','14_4'].includes(s.article)))html+=date('principalDate','Tanggal pelunasan pokok/utang pajak','Isi tanggal ketika pokok yang menjadi dasar sanksi telah dilunasi sepenuhnya.');
 if(s.category==='newstp' && s.article==='19_3')html+=select('taxKind','Jenis pajak atas pokok',[['pph','Pajak Penghasilan (PPh)'],['other','Bukan PPh'],['unknown','Belum pasti']]);
 if(['old','newstp','stp144','audit','late','amend','pay'].includes(s.category)){
  html+='</div><h4 class="sublabel">Bagian sanksi (jika sudah dibayar sebagian)</h4><div class="field-grid">';
  html+=money('sanctionTotal','Total nilai sanksi dalam surat (Rp)','Diperlukan untuk memvalidasi persis 10% atau 25%.');
  html+=money('sanctionPrior','Sanksi dibayar sebelum tindakan yang diuji (Rp)','Masukkan 0 bila belum pernah dibayar.');
  html+=money('sanctionProgram','Pembayaran sebagian sanksi pada tindakan yang diuji (Rp)','Diisi untuk skema khusus 90% atau 75%.');
  html+=date('partialDate','Tanggal pembayaran sebagian sanksi','Diisi bila ada pembayaran untuk skema 90% / 75%.');
 }
 html+='</div><div class="inline-note"><b>Catatan hukum:</b> Persentase yang tercantum dalam tabel berlaku dengan syarat khusus masing-masing. Pada sanksi yang sudah dibayar sebagian, pengurangan hanya mengenai sanksi yang masih belum dibayar (Diktum Keempat huruf d).</div>';
 return html;
}
function step2(){return `<div class="question-intro"><span class="question-index">03 · VERIFIKASI PERSYARATAN</span><h3>Periksa syarat permohonan</h3><p class="help">Jawab berdasarkan status yang benar. Pilih “Belum tahu” apabila suatu informasi belum dapat dipastikan.</p></div>
  <h4 class="sublabel">Persyaratan materiil & status sengketa</h4><div class="field-grid">
  ${select('principalConfirmed','Pokok yang menjadi dasar sanksi telah lunas?',[[...yesNoUnk[0]],['no_base','Tidak ada pokok yang menjadi dasar sanksi'],...yesNoUnk.slice(1)],'Pasal 23 ayat (5) huruf a. Pilihan tanpa pokok dibatasi kasus dengan sanksi independen dari jumlah pokok yang belum dibayar.')}
  ${select('sanctionState','Status pembayaran seluruh sanksi',[['unpaid','Belum dibayar sama sekali'],['partial','Baru dibayar sebagian'],['fully','Sudah lunas seluruhnya'],['unknown','Tidak tahu']])}
  ${s.sanctionState==='partial'?select('allocationConfirmed','Pembayaran telah dialokasikan lebih dahulu ke pokok dan sisa yang disebut benar-benar pembayaran sanksi?',yesNoUnk,'Pasal 23 ayat (6)–(7): pembayaran atas SKP/STP diperhitungkan ke pokok terlebih dahulu.'):''}
  ${select('lawsuit','Gugatan / upaya hukum lainnya',[['none','Tidak pernah diajukan'],['withdrawn','Pernah diajukan, sudah dicabut'],['active','Sedang diajukan / masih berlangsung'],['unknown','Tidak diketahui']])}
  ${select('objection','Keberatan atas SKP / SPPT yang terkait',[['none','Tidak pernah diajukan'],['approved_withdrawal','Pencabutan telah disetujui DJP'],['not_considered','Keberatan tidak dipertimbangkan'],['active','Sedang dalam proses keberatan'],['unknown','Belum tahu / ada kondisi lainnya']])}
  ${select('otherRemedy','Permohonan pembatalan/pengurangan lain',[['none','Tidak ada permohonan lain'],['closed','Pernah ada, telah dicabut/selesai'],['active','Masih diproses'],['unknown','Belum dapat dipastikan']])}
  ${select('auction','Penagihan terkait barang sitaan',[['not_started','Belum ada permohonan lelang/pemindahbukuan'],['started','Tahap permohonan lelang/pemindahbukuan telah terjadi'],['unknown','Belum tahu']])}
  </div><h4 class="sublabel">Pengajuan & kelengkapan</h4><div class="field-grid">
  ${date('applicationDate','Tanggal rencana/aktual permohonan','Batas program menurut KEP: 1 Oktober 2028.')}
  ${select('submissionCount','Permohonan atas surat ini yang ke-', [['1','Pertama'],['2','Kedua'],['3','Ketiga atau lebih']])}
  ${s.submissionCount==='2'?date('previousDecision','Tanggal keputusan permohonan pertama dikirim','Batas permohonan kedua: 3 bulan dari keputusan pertama, kecuali keadaan di luar kekuasaan WP.')+select('previousCase','Apakah terhadap surat yang sama?', [['yes','Ya, identitas surat sama'],['no','Tidak, surat berbeda'],['unknown','Belum diverifikasi']]):''}
  ${select('docApplication','Surat permohonan Bahasa Indonesia, satu per surat, telah ditandatangani?',yesNoUnk)}
  ${select('docAffidavit','Surat pernyataan kekhilafan/bukan kesalahan bermeterai telah disiapkan?',yesNoUnk)}
  ${select('docLegalStatement','Pernyataan tidak menggugat bermeterai / dokumen pencabutan sesuai kondisi tersedia?',yesNoUnk)}
  ${select('docReady','Kelengkapan berkas permohonan',[['yes','Sudah disiapkan dan diperiksa satu per satu'],['no','Belum lengkap'],['unknown','Belum diperiksa']],'Termasuk surat permohonan berbahasa Indonesia, satu surat per permohonan, pernyataan bermeterai, dan persyaratan gugatan sesuai kondisi.')}
  </div><div class="callout"><b>Tidak sama dengan persetujuan DJP.</b> Sistem hanya memeriksa konsistensi data yang Anda nyatakan. Kebenaran dokumen dan kondisi hukum tetap harus diverifikasi dalam administrasi perpajakan.</div>`;}
function rupiah(n){return 'Rp'+Math.round(n).toLocaleString('id-ID');}
function resultHTML(){let r=E.evaluate(s);last=r;
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
function render(){const labels=['Pilih kondisi','Detail dokumen','Syarat & prosedur','Hasil analisis'];$('step-label').textContent=`LANGKAH ${step+1} DARI 4 · ${labels[step]}`;$('step-text').textContent=step===0?'Pilih kondisi yang Anda alami':step===3?'Hasil pemetaan berdasarkan jawaban Anda':cardText();$('wizard-panel').dataset.step=String(step);$('stepper').setAttribute('aria-valuenow',String(step+1));$('stepper').innerHTML=labels.map((x,i)=>`<span class="${i<=step?'done':''}" title="${esc(x)}"></span>`).join('');$('body').innerHTML=[step0,step1,step2,resultHTML][step]();$('back').style.visibility=step===0?'hidden':'visible';$('next').textContent=step===0?'Lanjutkan →':step===1?'Periksa persyaratan →':step===2?'Lihat hasil saya →':'Periksa kasus baru ↻';$('next').disabled=step===0&&!catChosen();$('print').hidden=step!==3;$('copy').hidden=step!==3;$('footer-message').textContent=step===3?'Setiap hasil tetap memerlukan verifikasi dokumen di DJP':'Tidak ada data yang dikirim ke server dari halaman ini';}
function resetCase(id){s={category:id,document:(documents[id]||[]).length===1?documents[id][0]:'',article:['late','amend','pay','stp143','stp144'].includes(id)?articles[id][0]:'',sanctionPrior:'0',sanctionProgram:'0',sanctionTotal:'',applicationDate:'',sptType:'',sptStatus:'',sanctionState:'',principalConfirmed:'',docReady:''};}
function advance(){if(step===0&&!catChosen())return; if(step===3){step=0;resetCase('');}else step++;render();$('cek').scrollIntoView({behavior:'smooth',block:'start'});}
function backup(){if(step>0){step--;render();$('cek').scrollIntoView({behavior:'smooth',block:'start'});}}
function copyText(){if(!last)return;let report=`KABAYAN | CEK KERINGANAN SANKSI PAJAK\nStatus: ${last.status}\nKategori: ${cardText()}\nPasal: ${E.ARTICLE_LABEL[s.article]||'-'}\nPersentase simulasi: ${last.rate===null?'TIDAK DITENTUKAN':last.rate+'%'}\nAlasan: ${last.reason}\nAturan: ${(last.matches||[]).map(x=>x.cite).join('; ')}\nCatatan: ${[...(last.flags||[]),...(last.issues||[])].join('; ')}\nBatas permohonan: 1 Oktober 2028.\nPanduan edukasi, bukan keputusan DJP.`;if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(report).then(()=>toast('Ringkasan disalin.')).catch(()=>fallbackCopy(report));}else fallbackCopy(report);}
function fallbackCopy(v){let a=window.prompt('Salin ringkasan:',v);if(a!==null)toast('Ringkasan siap disalin.');}
function toast(v){$('footer-message').textContent=v;}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-scenario]');if(b){resetCase(b.dataset.scenario);render();}});
document.addEventListener('change',ev=>{const c=ev.target;if(c.dataset.field){s[c.dataset.field]=c.value;if(['document','sptType','submissionCount','article','sanctionState'].includes(c.dataset.field))render();}});
document.addEventListener('input',ev=>{const c=ev.target;if(c.dataset.field)s[c.dataset.field]=c.value;});
$('next').addEventListener('click',advance);$('back').addEventListener('click',backup);$('print').addEventListener('click',()=>window.print());$('copy').addEventListener('click',copyText);
render();})();
