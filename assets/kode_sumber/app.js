(()=>{'use strict';
const E=window.PSAEngine, $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=new Date().toISOString().slice(0,10);
// Tanggal pengajuan mengikuti tanggal lokal pengguna, bukan tanggal UTC.
const localToday=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
const futureSubmitted=()=>s.applicationStatus==='submitted' && Boolean(s.applicationDate) && s.applicationDate>localToday();
const applicationDateErrorMessage=()=>`Anda memilih “Sudah disampaikan”, tetapi tanggal ${formatDateID(s.applicationDate)} masih akan datang. Masukkan tanggal sesuai bukti penerimaan atau ubah status menjadi “Belum, akan mengajukan permohonan”.`;
const formatDateID=value=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return value||'';const [y,m,d]=value.split('-');return `${Number(d)} ${['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][Number(m)-1]||m} ${y}`;};
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
const documents={late:['STP','NOT_ISSUED'],amend:['STP','NOT_ISSUED'],pay:['STP','NOT_ISSUED'],newreg:['STP','NOT_ISSUED'],stp143:['STP'],stp144:['STP'],audit:['SKPKB','SKPKBT','SKP_PBB','STP'],old:['STP','SKPKB','SKPKBT','SKP_PBB','STP_PBB'],newstp:['STP','STP_PBB'],pps:['SKPKB_PPS','SKPKBT_PPS']};
const articles={late:['7'],amend:['8'],pay:['9'],stp143:['14_3'],stp144:['14_4'],audit:['13_2','13_3','15_2','17c','17d','pbb10_3','pbb10_4','7','8','9','14_4'],old:['7','8','9','14_4','13_2','13_3','15_2','17c','17d','pbb10_3','pbb10_4','19_1','19_2','19_3','pbb11_3'],newstp:['19_1','19_2','19_3','pbb11_3','7','8','9','14_3','14_4'],pps:['13_2','15_2'],newreg:['7','9']};
for(const id of Object.keys(articles))articles[id].push('other');articles.old.push('25_9','27_5d','27_5f');articles.newstp.push('25_9','27_5d','27_5f');
const docNames={STP:'Surat Tagihan Pajak (STP)',NOT_ISSUED:'STP belum diterbitkan',SKPKB:'SKP Kurang Bayar (SKPKB)',SKPKBT:'SKP Kurang Bayar Tambahan (SKPKBT)',SKP_PBB:'Surat Ketetapan Pajak PBB (SKP PBB)',STP_PBB:'Surat Tagihan Pajak PBB (STP PBB)',SKPKB_PPS:'SKPKB pemeriksaan PPS',SKPKBT_PPS:'SKPKBT pemeriksaan PPS'};
const emptyCase=()=>({entry:'',routeDoc:'',routeArticle:'',routeIssueDate:'',routeOrigin:'',routeSptEvent:'',routeGovernment:'',category:'',sanctionPrior:'0',sanctionProgram:'0',sanctionTotal:'',sptType:'',article:'',document:'',issueDate:'',sptStatus:'',actionDate:'',principalDate:'',partialDate:'',applicationDate:'',applicationStatus:'',docReady:'',principalConfirmed:''});
let step=0,s=emptyCase();
let last=null;
let plannedSpecialPaymentDate=''; // UI-only: never counted as a paid sanction or used by the legal engine

function field(k,label,type='text',note='',opts=[]){const val=s[k]??'';let control='';if(type==='select'){control=`<select data-field="${k}" id="f_${k}"><option value="">— Pilih sesuai dokumen —</option>${opts.map(([v,n])=>`<option value="${esc(v)}" ${v===val?'selected':''}>${esc(n)}</option>`).join('')}</select>`;}else if(type==='currency'){control=`<input id="f_${k}" data-field="${k}" type="number" min="0" step="1" inputmode="numeric" value="${esc(val)}" placeholder="Nominal dalam rupiah">`;}else{const dateBounds=type==='date'?`min="1900-01-01" max="${k==='applicationDate'&&s.applicationStatus==='submitted'?localToday():'2035-12-31'}"`:'';control=`<input id="f_${k}" data-field="${k}" type="${type}" ${dateBounds} value="${esc(val)}" ${type==='number'?'min="1" max="2025"':''} ${k==='applicationDate'?'aria-describedby="applicationDateHelp applicationDateError"':''}>`;}const appDate=k==='applicationDate'?`<small id="applicationDateError" class="application-date-error" role="alert" hidden></small>`:'';return `<div class="field"><label for="f_${k}">${esc(label)}</label>${control}${note?`<small ${k==='applicationDate'?'id="applicationDateHelp"':''}>${esc(note)}</small>`:''}${appDate}</div>`;}
const select=(key,label,options,note='')=>field(key,label,'select',note,options);
const date=(key,label,note='')=>field(key,label,'date',note);
const money=(key,label,note='')=>field(key,label,'currency',note);

// UI adapter for Masa Pajak. The engine continues to receive `s.sptPeriod` in YYYY-MM format.
function monthYearPicker(){
 const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
 const current=/^\d{4}-(0[1-9]|1[0-2])$/.test(s.sptPeriod||'')?s.sptPeriod:'';
 const yearSelected=s.sptPeriodYear||(current?current.slice(0,4):'');
 const monthSelected=s.sptPeriodMonth||(current?current.slice(5,7):'');
 const monthOptions=months.map((name,i)=>{const v=String(i+1).padStart(2,'0');return `<option value="${v}" ${monthSelected===v?'selected':''}>${name}</option>`;}).join('');
 // Include every positive year up to 2035 so the picker does not exclude earlier periods allowed by the unchanged decision engine.
 const years=[];
 for(let yr=2035;yr>=1;yr--)years.push(String(yr).padStart(4,'0'));
 if(yearSelected&&!years.includes(yearSelected))years.push(yearSelected);
 years.sort((a,b)=>Number(b)-Number(a));
 const yearOptions=years.map(v=>`<option value="${esc(v)}" ${yearSelected===v?'selected':''}>${esc(v)}</option>`).join('');
 return `<div class="field full month-year-field">
   <span class="month-year-label" id="labelMasaPajak">Masa Pajak</span>
   <div class="month-year-grid">
     <div class="month-year-item"><label for="f_sptPeriodMonth">Bulan Pajak</label>
       <select id="f_sptPeriodMonth" data-field="sptPeriodMonth" aria-describedby="masaPajakNote"><option value="">— Pilih bulan —</option>${monthOptions}</select>
     </div>
     <div class="month-year-item"><label for="f_sptPeriodYear">Tahun Pajak</label>
       <select id="f_sptPeriodYear" data-field="sptPeriodYear" aria-describedby="masaPajakNote"><option value="">— Pilih tahun —</option>${yearOptions}</select>
     </div>
   </div>
   <small id="masaPajakNote">Pilih bulan dan tahun yang tercantum pada SPT. Untuk skema ini, cakupan sampai Masa Pajak September 2026.</small>
   </div>`;
}

// Rupiah-friendly inputs are presentation only. The decision engine still receives integer strings.
const numericOnly=v=>String(v??'').replace(/\D/g,'').replace(/^0+(?=\d)/,'');
const formatInteger=v=>{const n=numericOnly(v);return n?new Intl.NumberFormat('id-ID').format(Number(n)):'';};
function moneySimple(key,label,note=''){
 return `<div class="field"><label for="f_${key}">${esc(label)}</label><div class="rupiah-control"><span aria-hidden="true">Rp</span><input id="f_${key}" data-field="${key}" data-rupiah="1" type="text" inputmode="numeric" autocomplete="off" value="${esc(formatInteger(s[key]))}" placeholder="0" aria-label="${esc(label)}"></div>${note?`<small>${esc(note)}</small>`:''}</div>`;
}
function choiceRadio(key,title,opts,note=''){
 return `<fieldset class="field full payment-radio-group"><legend>${esc(title)}</legend><div class="payment-choice-grid">${opts.map(([value,label,sub])=>`<label class="payment-choice ${s[key]===value?'is-active':''}"><input type="radio" name="${key}" data-field="${key}" value="${value}" ${s[key]===value?'checked':''}><span class="payment-choice-copy"><b>${esc(label)}</b><small>${esc(sub)}</small></span></label>`).join('')}</div>${note?`<small class="payment-field-help">${esc(note)}</small>`:''}</fieldset>`;
}
function balancePreview(){
 const total=Number(numericOnly(s.sanctionTotal));const prior=Number(numericOnly(s.sanctionPrior));
 if(!numericOnly(s.sanctionTotal))return {text:'—',error:'Masukkan jumlah sanksi dari SKP/STP terlebih dahulu.'};
 if(!Number.isSafeInteger(total)||!Number.isSafeInteger(prior))return {text:'—',error:'Nominal terlalu besar untuk dihitung secara aman.'};
 if(total<=0)return {text:'—',error:'Jumlah sanksi harus lebih besar dari nol.'};
 if(prior>total)return {text:'—',error:'Pembayaran sebelumnya melebihi jumlah seluruh sanksi.'};
 const remaining=total-prior;
 return {text:'Rp'+remaining.toLocaleString('id-ID'),error:remaining<=0?'Tidak ada sanksi yang tersisa. Periksa status pelunasan.':''};
}
function balanceHTML(){const x=balancePreview();const special=Number(s.sanctionProgram||0);
 const hasSpecial=hasPartialPath()&&s.paymentPath==='yes'&&special>0&&!x.error&&Number(s.sanctionTotal)-Number(s.sanctionPrior)>=special;
 const after=hasSpecial?'Rp'+(Number(s.sanctionTotal)-Number(s.sanctionPrior)-special).toLocaleString('id-ID'):'—';
 return `<div class="field full"><div class="payment-balance" id="payment-balance" role="status" aria-live="polite"><div><span class="payment-balance-label">Sisa sanksi sebelum pembayaran program</span><strong id="payment-balance-number">${esc(x.text)}</strong></div><small>Otomatis: total sanksi − pembayaran sebelumnya. Perhitungan masih harus dicocokkan dengan alokasi pembayaran ke pokok pajak.</small><div class="balance-after-special" id="balance-after-special" ${hasSpecial?'':'hidden'}><span>Sisa setelah pembayaran khusus, sebelum fasilitas</span><strong id="balance-after-special-value">${esc(after)}</strong></div>${x.error?`<p class="payment-balance-error" id="payment-balance-error">${esc(x.error)}</p>`:`<p class="payment-balance-error" id="payment-balance-error" hidden></p>`}</div></div>`;}

function refreshBalance(){const root=$('payment-balance');if(!root)return;const v=balancePreview();const n=$('payment-balance-number');if(n)n.textContent=v.text;
 const after=$('balance-after-special'),av=$('balance-after-special-value');
 if(after){const amount=Number(s.sanctionProgram||0),total=Number(s.sanctionTotal||0),prior=Number(s.sanctionPrior||0);
 const valid=hasPartialPath()&&s.paymentPath==='yes'&&amount>0&&!v.error&&total-prior>=amount;
 after.hidden=!valid;if(valid&&av)av.textContent='Rp'+(total-prior-amount).toLocaleString('id-ID');}
 const warning=$('payment-balance-error');if(warning){warning.hidden=!v.error;warning.textContent=v.error;}}


// A planning aid, not an eligibility decision. Queries the UNMODIFIED legal engine's
// candidate matching against 10% and 25% separately, for the exact scenario/date.
// The temporary probes never overwrite actual form facts or represent paid amounts.
function possiblePartialOptions(targetDate){
 if(!hasPartialPath()||!targetDate||!E.validDate(targetDate))return [];
 const validBase=balancePreview();if(validBase.error)return [];
 const sum=Number(s.sanctionTotal||0)-Number(s.sanctionPrior||0);
 if(!Number.isSafeInteger(sum)||sum<=0)return [];
 const variants=[{paidPct:10,reliefPct:90},{paidPct:25,reliefPct:75}];
 const list=[];
 for(const v of variants){
  const trial={...s,sanctionState:'partial',sanctionTotal:'100000000',sanctionPrior:'0',sanctionProgram:String(v.paidPct*1000000),partialDate:targetDate};
  const candidate=E.match(trial).filter(x=>x.rate===v.reliefPct);
  if(candidate.length){
    // Avoid rounding payment requirements upward/downward without any explicit rule.
    // If no exact whole-rupiah amount exists, only show the formula.
    const exact=sum*v.paidPct/100;
    list.push({pct:v.paidPct,relief:v.reliefPct,amount:Number.isSafeInteger(exact)?exact:null,
        formula:`${v.paidPct}% × Rp${sum.toLocaleString('id-ID')}`,
        sources:[...new Set(candidate.map(x=>x.cite).filter(Boolean))]});
  }
 }
 return list;
}
function paymentGuidanceHTML(){
 if(!hasPartialPath())return '';
 const chosenDate=(s.paymentPath==='yes'?s.partialDate:plannedSpecialPaymentDate);
 const amount=balancePreview();
 if(amount.error)return '<p class="guidance-neutral">Isi jumlah sanksi dan pembayaran sebelumnya terlebih dahulu agar pembayaran yang dipersyaratkan dapat dihitung.</p>';
 if(s.sanctionState==='partial'&&s.allocationConfirmed!=='yes')return '<p class="guidance-neutral">Pastikan dahulu jumlah yang benar-benar sudah dialokasikan sebagai pembayaran sanksi. Tanpa itu, jumlah pembayaran yang dipersyaratkan belum aman dihitung.</p>';
 if(!['yes','no_base'].includes(s.principalConfirmed))return '<p class="guidance-neutral">Status pelunasan pokok pajak belum memenuhi syarat untuk membuat simulasi pembayaran sebagian.</p>';
 if(!chosenDate)return '<p class="guidance-neutral">Pilih tanggal pembayaran terlebih dahulu. Persentase dan tenggat tiap jalur berbeda.</p>';
 if(!E.validDate(chosenDate))return '<p class="guidance-neutral">Tanggal pembayaran belum valid.</p>';
 if(s.paymentPath==='yes'){const curr=new Date(),todayLocal=[curr.getFullYear(),String(curr.getMonth()+1).padStart(2,'0'),String(curr.getDate()).padStart(2,'0')].join('-');if(chosenDate>todayLocal)return '<p class="guidance-neutral">Tanggal pembayaran berada di masa depan, sehingga belum dapat disebut sudah dibayar. Jika masih rencana, pilih Belum dibayar.</p>';}
 const possibilities=possiblePartialOptions(chosenDate);
 if(!possibilities.length)return '<p class="guidance-neutral">Tidak ditemukan pola pembayaran 10%/25% yang secara tegas cocok dengan jalur dan tanggal ini. Sistem tidak memperkirakan persentase; periksa tanggal dan dasar hukumnya.</p>';
 const list=possibilities.map(p=>`<div class="guided-option"><div><b>Pembayaran ${p.pct}%</b><small>Skema pengurangan ${p.relief}% jika seluruh syarat dipenuhi</small></div><strong>${p.amount===null?esc(p.formula):'Rp'+p.amount.toLocaleString('id-ID')}</strong><small class="guide-legal">Didasarkan pada pola dalam ${esc(p.sources.join('; ')||'lampiran KEP-239/PJ/2026')}.</small></div>`).join('');
 return `<div class="guided-options">${possibilities.length>1?'<p class="guidance-neutral">Ada lebih dari satu pola yang tampak relevan. Kabayan tidak memilih yang paling menguntungkan; jumlah sebenarnya bergantung pada pembayaran dan bukti yang digunakan.</p>':''}${list}</div><small class="guidance-caveat">Simulasi bersyarat, bukan nominal yang wajib dibayar menurut ketetapan atau persetujuan fasilitas. Bukan bukti bahwa pembayaran telah dilakukan maupun persyaratan program sudah terpenuhi.</small>`;
}
function specialPaymentGuide(){
 if(!hasPartialPath())return '';
 const actual=s.paymentPath==='yes';
 const dateId=actual?'f_partialDate':'planned-special-payment-date';
 const dateField=actual?'':`<div class="field full"><label for="planned-special-payment-date">Kapan Anda berencana melakukan pembayaran?</label><input type="date" id="planned-special-payment-date" data-ui-plan-date="1" min="2026-10-08" max="2027-06-30" value="${esc(plannedSpecialPaymentDate)}"><small>Untuk simulasi waktu saja; tidak dicatat sebagai pembayaran yang telah dilakukan.</small></div>`;
 return `<section class="field full guided-special" aria-label="Panduan pembayaran khusus"><h4>Periksa jumlah pembayaran yang mungkin dipersyaratkan</h4><p>Besarnya ditentukan dari jenis sanksi, tanggal surat, dan waktu pembayaran menurut KEP-239. Anda tidak perlu memilih persentasenya sendiri.</p>${dateField}<div id="special-payment-guidance" aria-live="polite">${paymentGuidanceHTML()}</div></section>`;
}
function refreshSpecialGuidance(){const box=$('special-payment-guidance');if(box)box.innerHTML=paymentGuidanceHTML();}

const docApplicationOptions=[['yes','Ya, telah dibuat dan ditandatangani sesuai ketentuan'],['no','Belum memenuhi ketentuan'],['unknown','Belum diperiksa / belum dapat dipastikan']];
const docStatementOptions=[['yes','Ya, telah dibuat, ditandatangani, dan dibubuhi meterai sesuai ketentuan'],['no','Belum memenuhi ketentuan'],['unknown','Belum diperiksa / belum dapat dipastikan']];
const docWithdrawalOptions=[['yes','Ya, tersedia sesuai dokumen pendukung'],['no','Belum tersedia / belum memenuhi ketentuan'],['unknown','Belum diperiksa / belum dapat dipastikan']];
const asOptions=(l,map)=>l.map(id=>[id,map[id]||id]);
const catChosen=()=>s.category&&E.CATS[s.category];
const cardText=()=>s.category?(E.CATS[s.category]||'—'):routeLabel();
const entryOptions=[
 ['spt','note','Saya terlambat melaporkan atau membetulkan SPT','Termasuk keterlambatan pembayaran pajak'],
 ['stp','document','Saya menerima Surat Tagihan Pajak (STP)','Denda, bunga, faktur pajak, atau penagihan'],
 ['skp','search','Saya menerima Surat Ketetapan Pajak (SKP)','Ketetapan hasil pemeriksaan atau terkait PPS'],
 ['newreg','sprout','Saya baru mendaftar NPWP atau dikukuhkan PKP','Periksa fasilitas khusus pendaftaran/pengukuhan'],
 ['pbb','home','Saya menerima surat terkait PBB','Khusus SKP/STP PBB yang menjadi kewenangan DJP']
];
const entryIcons={
 note:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.75h5.6L18 9.15V19a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 6 19V6.5A1.75 1.75 0 0 1 7.75 4.75Z"/><path d="M13.5 4.75V9.5H18"/><path d="M9 13.25h6"/><path d="M9 16.25h4.5"/></svg>`,
 document:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.75h5.6L18 9.15V19a1.75 1.75 0 0 1-1.75 1.75h-8.5A1.75 1.75 0 0 1 6 19V6.5A1.75 1.75 0 0 1 7.75 4.75Z"/><path d="M13.5 4.75V9.5H18"/><path d="M9 13h6"/><path d="M9 16h6"/></svg>`,
 search:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="4.75"/><path d="M13.9 13.9 18.25 18.25"/><path d="M15.2 5.75H18"/><path d="M15.2 8.75H18"/></svg>`,
 sprout:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19.5v-6.25"/><path d="M12 13.5c0-3.5 2.35-6 5.85-6 .1 3.9-2.25 6.35-5.85 6Z"/><path d="M12 14c0-2.95-1.95-5-4.85-5C7.05 12.3 9 14.35 12 14Z"/><path d="M9 19.5h6"/></svg>`,
 home:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.75 10.75 12 5l7.25 5.75"/><path d="M6.75 9.95V19a1.25 1.25 0 0 0 1.25 1.25h8A1.25 1.25 0 0 0 17.25 19V9.95"/><path d="M10 20.25v-4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4.5"/></svg>`
};
const routeDocs={
 spt:['STP','NOT_ISSUED'],stp:['STP'],skp:['SKPKB','SKPKBT'],newreg:['STP','NOT_ISSUED'],pbb:['SKP_PBB','STP_PBB']
};
const stpArticles=['7','8','9','14_3','14_4','19_1','19_2','19_3','25_9','27_5d','27_5f'];
const skpArticles=['13_2','13_3','15_2','17c','17d'];
const pbbArticles={SKP_PBB:['pbb10_3','pbb10_4'],STP_PBB:['pbb11_3']};
const normalOrigin=[['normal','Bukan terkait pemeriksaan (pelaporan, faktur pajak, atau tagihan biasa)'],['audit','Terkait hasil pemeriksaan pajak'],['unknown','Belum diketahui']];
const routeLabel=()=>entryOptions.find(x=>x[0]===s.entry)?.[2]||'—';
function step0(){
 const card=([id,ico,title,sub])=>`<button type="button" class="choice ${s.entry===id?'selected':''}" data-entry="${id}" aria-pressed="${s.entry===id?'true':'false'}"><span class="emoji" aria-hidden="true">${entryIcons[ico]||''}</span><span><strong>${esc(title)}</strong><small>${esc(sub)}</small></span><span class="choice-check" aria-hidden="true">✓</span></button>`;
 return `<div class="question-intro"><span class="question-index">01 · KONDISI ANDA</span><h3>Apa kondisi perpajakan Anda?</h3><p class="help">Tidak perlu menentukan kategori pengawasan atau penagihan. Pilih keadaan yang paling sesuai, lalu Kabayan akan menanyakan informasi untuk menentukan jalur hukum.</p></div><div class="cards entry-cards">${entryOptions.map(card).join('')}</div><div class="inline-note">Memiliki beberapa surat? Periksa satu surat per analisis. Pilihan di sini hanya menentukan pertanyaan, bukan kelayakan fasilitas.</div>`;
}
function resetForRoute(){
 const keep={entry:s.entry,routeDoc:s.routeDoc||'',routeArticle:s.routeArticle||'',routeIssueDate:s.routeIssueDate||'',routeOrigin:s.routeOrigin||'',routeSptEvent:s.routeSptEvent||'',routeGovernment:s.routeGovernment||''};
 s={...keep,category:'',document:'',article:'',issueDate:'',sanctionPrior:'0',sanctionProgram:'0',sanctionTotal:'',applicationDate:'',applicationStatus:'',sptType:'',sptStatus:'',sanctionState:'',principalConfirmed:'',docReady:''};
}
function resolveRoute(){
 const e=s.entry,d=s.routeDoc,a=s.routeArticle,dt=s.routeIssueDate,origin=s.routeOrigin,ev=s.routeSptEvent;
 const wait=reason=>({ok:false,reason});
 if(!e)return wait('Pilih kondisi perpajakan terlebih dahulu.');
 if(e==='pbb' && s.routeGovernment!=='djp')return wait(s.routeGovernment==='pemda'?'PBB-P2 yang dikelola pemerintah daerah berada di luar cakupan navigator KEP-239/PJ/2026 ini. Hal ini tidak menyimpulkan tidak adanya fasilitas berdasarkan ketentuan daerah.':'Pastikan surat PBB diterbitkan dalam kewenangan DJP sebelum jalur ditentukan.');
 if(!d)return wait('Jenis surat belum dipilih.');
 if(d!=='NOT_ISSUED' && (!E.validDate(dt)))return wait('Tanggal penerbitan surat belum lengkap atau tidak sah.');
 if((e==='stp'||e==='skp'||e==='newreg'||e==='pbb') && !a)return wait('Jenis atau pasal sanksi belum dipilih.');
 if(a==='other')return wait('Pasal yang tersedia dalam dokumen tidak terpetakan dalam daftar aturan. Perlu verifikasi dokumen; jangan mengasumsikan pasal lain.');
 if(e==='spt'&&!ev)return wait('Pilih apakah Anda terlambat melapor, membetulkan, atau terlambat menyetor.');
 let cat='',article=a||'',document=d;
 if(e==='spt'){
  article={late:'7',amend:'8',pay:'9'}[ev]||'';
  if(!article)return wait('Jenis kejadian SPT tidak dikenali.');
  if(d==='NOT_ISSUED')cat=ev;
  else if(dt<E.START)cat='old';
  else if(dt<=E.END){
   if(!origin||origin==='unknown')return wait('Perlu dipastikan apakah STP berkaitan dengan pemeriksaan atau pelaporan/pembetulan biasa.');
   cat=origin==='audit'?'audit':ev;
  }else return wait('Tanggal STP di luar rentang jalur yang dipetakan; perlu pemeriksaan peraturan sebelum menentukan persentase.');
 }else if(e==='stp'){
  if(dt<E.START){cat='old';}
  else if(dt>E.END)return wait('STP diterbitkan di luar periode program yang dipetakan. Tidak dapat disimpulkan fasilitas berdasarkan program ini tanpa pemeriksaan lebih lanjut.');
  else if(a==='14_3')cat='stp143';
  else if(['19_1','19_2','19_3','25_9','27_5d','27_5f'].includes(a))cat='newstp';
  else if(a==='14_4'||['7','8','9'].includes(a)){
   if(!origin||origin==='unknown')return wait('Asal sanksi STP harus dipastikan terlebih dahulu untuk membedakan skema pengawasan dan pemeriksaan.');
   cat=origin==='audit'?'audit':(a==='14_4'?'stp144':({'7':'late','8':'amend','9':'pay'}[a]));
  } else return wait('Belum ada jalur terpetakan untuk pasal STP yang dimasukkan.');
 }else if(e==='skp'){
  if(!origin||origin==='unknown')return wait('Konfirmasi apakah SKP merupakan hasil pemeriksaan biasa atau pemeriksaan terkait PPS.');
  if(origin==='pps'){
   // SKPKBT PPS may be identified, but the engine will always require legal review.
   // No percentages are inferred from the SKPKB illustrations.
   if(!['13_2','15_2'].includes(a))return wait('Pasal pada SKP tidak terpetakan sebagai SKP pemeriksaan PPS dalam mesin saat ini.');
   if(dt<E.START||dt>'2027-12-31')return wait('Tanggal SKP terkait PPS di luar cakupan penerbitan yang dipetakan.');
   cat='pps';document=d==='SKPKBT'?'SKPKBT_PPS':'SKPKB_PPS';
  }else if(dt<E.START)cat='old';
  else if(dt<=E.END)cat='audit';
  else return wait('SKP hasil pemeriksaan biasa di luar periode penerbitan yang dipetakan; perlu verifikasi.');
 }else if(e==='newreg'){
  if(d==='STP'&&(dt<E.START||dt>E.END))return wait('Tanggal STP pada kasus NPWP/PKP baru belum sesuai rentang penerbitan yang dipetakan; perlu verifikasi.');
  cat='newreg';
 }else if(e==='pbb'){
  if(dt<E.START)cat='old';
  else if(dt<=E.END)cat=d==='SKP_PBB'?'audit':'newstp';
  else return wait('Tanggal surat PBB di luar periode yang dipetakan; perlu verifikasi.');
 }
 if(!cat || !E.PAIRS[cat] || !(E.PAIRS[cat][document]||[]).includes(article))
  return wait('Pasangan jenis surat, pasal, dan asal sanksi belum cocok dengan jalur hukum terverifikasi. Sistem tidak mengganti jalur secara otomatis.');
 return {ok:true,category:cat,document,article,issueDate:d==='NOT_ISSUED'?'':dt};
}
function applyRoute(){
 const r=resolveRoute();
 if(!r.ok){s.category='';s.document='';s.article='';s.issueDate='';return r;}
 // route is authoritative. Only recopy fields whose legal source changed.
 if([s.category,s.document,s.article,s.issueDate].join('|')!==[r.category,r.document,r.article,r.issueDate].join('|')){
  const entry=s.entry,docs={routeDoc:s.routeDoc,routeArticle:s.routeArticle,routeIssueDate:s.routeIssueDate,routeOrigin:s.routeOrigin,routeSptEvent:s.routeSptEvent,routeGovernment:s.routeGovernment};
  resetCase(r.category);
  s.entry=entry;Object.assign(s,docs);
 }
 s.category=r.category;s.document=r.document;s.article=r.article;s.issueDate=r.issueDate;
 return r;
}
function stepRoute(){
 let html=`<div class="question-intro"><span class="question-index">02 · IDENTIFIKASI JALUR</span><h3>Kenali surat dan asal sanksi</h3><p class="help">Jawab sesuai surat yang diterima. Kabayan baru akan menampilkan pertanyaan mengenai pelunasan, pembayaran sebagian, dan prosedur setelah jalurnya dapat ditentukan.</p></div><div class="field-grid">`;
 if(s.entry==='spt')html+=select('routeSptEvent','Apa yang terjadi?', [['late','Terlambat/belum melaporkan SPT'],['amend','Membetulkan sendiri SPT'],['pay','Terlambat membayar/menyetor pajak']]);
 if(s.entry==='pbb')html+=select('routeGovernment','Kewenangan penerbit surat PBB',[['djp','PBB dalam kewenangan DJP (misalnya PBB sektor perkebunan/pertambangan/perhutanan)'],['pemda','PBB-P2 yang dikelola Pemerintah Daerah'],['unknown','Belum diketahui']]);
 const options=routeDocs[s.entry]||[];
 if(options.length===1){s.routeDoc=options[0];html+=`<div class="field"><div class="fact-chip">Jenis dokumen: ${esc(docNames[s.routeDoc])}</div></div>`;}
 else html+=select('routeDoc','Apa dokumen sanksinya?',asOptions(options,docNames));
 if(s.routeDoc){
  let aa=[];
  if(s.entry==='stp')aa=stpArticles;
  else if(s.entry==='skp')aa=skpArticles;
  else if(s.entry==='newreg')aa=['7','9'];
  else if(s.entry==='pbb')aa=pbbArticles[s.routeDoc]||[];
  if(aa.length>0){
    if(aa.length===1){s.routeArticle=aa[0];html+=`<div class="field"><div class="fact-chip">Sanksi: ${esc(E.ARTICLE_LABEL[s.routeArticle])}</div></div>`;}
    else html+=select('routeArticle','Pasal sanksi pada surat',[...asOptions(aa,E.ARTICLE_LABEL),['other','Pasal tidak tercantum / belum diketahui']],'Jangan memilih pasal yang mirip; gunakan pilihan terakhir jika pasal tidak tertera.');
  }
  if(s.routeDoc!=='NOT_ISSUED')html+=date('routeIssueDate','Tanggal penerbitan surat');
  const activeNew=s.routeIssueDate&&s.routeIssueDate>=E.START&&s.routeIssueDate<=E.END;
  const asksSource=(s.entry==='spt' && s.routeDoc==='STP')||(s.entry==='stp'&&['7','8','9','14_4'].includes(s.routeArticle));
  if(asksSource)html+=select('routeOrigin','Apakah STP berkaitan dengan pemeriksaan?',normalOrigin);
  if(s.entry==='skp')html+=select('routeOrigin','Dasar penerbitan SKP',[['normal','Hasil pemeriksaan pajak biasa'],['pps','Hasil pemeriksaan harta Program Pengungkapan Sukarela (PPS)'],['unknown','Belum diketahui']]);
 }
 html+='</div>';
 const r=resolveRoute();
 if(s.routeDoc && ((!r.ok&&r.reason)))html+=`<div class="inline-note routing-note"><b>${s.routeDoc==='NOT_ISSUED'?'Dokumen belum terbit':'Pemeriksaan jalur'}:</b> ${esc(r.reason)}</div>`;
 else if(r.ok)html+=`<div class="inline-note route-ok"><b>Jalur teridentifikasi:</b> ${esc(E.CATS[r.category])}. Persentase belum dihitung; persyaratan berikutnya tetap harus diperiksa.</div>`;
 return html;
}
const hasSPT=()=>['late','amend','pay','newreg'].includes(s.category);
const reqPrincipal=()=>!['7','14_4'].includes(s.article)||s.principalConfirmed!=='no_base';
const needsPrincipalDate=()=>s.principalConfirmed==='yes'&&reqPrincipal() && !(
 s.category==='stp144'||(s.category==='audit'&&s.document==='STP'&&['7','14_4'].includes(s.article)));
// UI routing is conservative and follows ONLY explicit 90%/75% rule families in PSAEngine.match.
// Does not decide a percentage or expand the scope of the KEP.
function specialPaymentContext(){
 const a=s.article,d=s.document,c=s.category,issued=s.issueDate,paid=s.principalDate;
 const duringProgram=issued&&E.validDate(issued)&&issued>=E.START&&issued<=E.END;
 if(c==='stp144'&&d==='STP'&&a==='14_4'&&duringProgram)
   return {yes:true,note:'STP sanksi faktur pajak dapat menggunakan skema pembayaran sebagian sesuai tanggal STP dan bukti bayar.'};
 if(c==='audit'&&d==='STP'&&['7','8','9','14_4'].includes(a)&&duringProgram)
   return {yes:true,note:'STP terkait pemeriksaan mempunyai skema pembayaran sebagian tersendiri.'};
 if(['late','amend','pay'].includes(c)&&d==='STP'&&duringProgram&&
    ['7','8','9'].includes(a)&&s.actionDate&&E.validDate(s.actionDate)&&s.actionDate<E.START)
   return {yes:true,note:'SPT telah dilaporkan/dibetulkan sebelum 8 Oktober 2026 dan STP terbit saat periode program.'};
 if(c==='old'&&issued&&E.validDate(issued)&&issued<E.START){
   if(d==='STP'&&['7','8','9','14_4'].includes(a))
      return {yes:true,note:'STP lama dengan pasal yang termasuk skema pembayaran sebagian.'};
   const olderPrincipal=s.principalConfirmed==='yes'&&paid&&E.validDate(paid)&&paid<E.START;
   if(olderPrincipal&&((['SKPKB','SKPKBT'].includes(d)&&['13_2','13_3','15_2','17c','17d'].includes(a))||
        (d==='SKP_PBB'&&['pbb10_3','pbb10_4'].includes(a))||
        (d==='STP'&&['19_1','19_2','19_3'].includes(a))||
        (d==='STP_PBB'&&a==='pbb11_3')))
     return {yes:true,note:'Pokok telah lunas sebelum program, sehingga mungkin ada skema pembayaran sebagian atas sanksi.'};
 }
 if(c==='newstp'&&duringProgram&&s.principalConfirmed==='yes'&&paid&&E.validDate(paid)&&paid<E.START&&
    ((d==='STP'&&['19_1','19_2','19_3'].includes(a))||(d==='STP_PBB'&&a==='pbb11_3')))
   return {yes:true,note:'STP terbit dalam program, tetapi pokok telah dilunasi sebelum 8 Oktober 2026.'};
 return {yes:false,note:''};
}
const hasPartialPath=()=>specialPaymentContext().yes;
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
 if(s.sanctionState==='partial'){
   if(!hasPartialPath()){s.paymentPath='';s.partialDate='';s.sanctionProgram='0';}
   else if(s.paymentPath!=='yes'){s.partialDate='';s.sanctionProgram='0';}
 }
 if(s.sanctionState==='unpaid'&&s.estimateChoice!=='yes')s.sanctionTotal='';
 if(s.sanctionState!=='partial'&&s.sanctionState!=='unpaid')s.sanctionTotal='';
 if(s.submissionCount!=='2'){s.previousDecision='';s.previousCase='';}
}
function stepDetails(){
 syncDerived();
 let html=`<div class="question-intro"><span class="question-index">02 · DATA KASUS</span><h3>Isi fakta yang berkaitan dengan kasus Anda</h3><p class="help">Pertanyaan berikut berubah otomatis sesuai jawaban. Kolom yang tidak relevan tidak ditampilkan dan tidak digunakan dalam perhitungan.</p></div><div class="field-grid">`;
 html+=`<div class="field full"><div class="fact-chip route-summary"><b>${esc(E.CATS[s.category]||'—')}</b><small>${esc(docNames[s.document]||s.document)} · ${esc(E.ARTICLE_LABEL[s.article]||'—')} ${s.issueDate?'· Terbit '+esc(s.issueDate):''}</small><span>Ingin mengubah identifikasi surat? Pilih Kembali ke langkah 2.</span></div></div>`;
 if(hasSPT()||(s.category==='old'&&s.document==='STP'&&['7','8','9'].includes(s.article))){
  if(s.category==='old')html+='<div class="field full inline-note"><b>Periksa juga tanggal SPT</b><br>Untuk STP lama, tanggal lapor atau pembetulan SPT dapat membuka jalur Lampiran A. Isi fakta SPT sesuai bukti agar dua jalur dapat diteliti.</div>';
   html+=select('sptType','SPT yang terkait',[['annual','SPT Tahunan PPh'],['monthly','SPT Masa']]);
   if(s.sptType==='annual')html+=field('sptYear','Tahun Pajak','number','Dibatasi Tahun Pajak 2025 dan sebelumnya.');
   if(s.sptType==='monthly')html+=monthYearPicker();
   if(s.sptType){
    html+=select('sptStatus','Status SPT',[['kb','Kurang Bayar'],['other','Nihil / Lebih Bayar / status lain'],['unknown','Belum tahu']]);
    html+=date('actionDate',s.category==='amend'?'Tanggal pembetulan SPT':'Tanggal SPT disampaikan');
   }
   if(s.category==='newreg'){
    html+=select('registerType','Jenis pendaftaran',[['NPWP','Pendaftaran NPWP'],['PKP','Pengukuhan PKP']]);
    if(s.registerType)html+=date('registrationDate','Tanggal terdaftar atau dikukuhkan');
   }
 }

 const noBaseEligible=['7','14_4'].includes(s.article);
 html+=select('principalConfirmed','Apakah pajak pokoknya (di luar sanksi) sudah lunas?',[
  ['yes','Ya, sudah lunas'],['no','Belum lunas'],
  ...(noBaseEligible?[['no_base','Tidak ada pokok pajak terkait sanksi ini']]:[]),
  ['unknown','Belum dapat dipastikan']
 ],'Pembayaran atas SKP/STP diperhitungkan terlebih dahulu ke pokok pajak (Pasal 23).');
 if(needsPrincipalDate())html+=date('principalDate','Kapan pajak pokoknya dilunasi seluruhnya?');
 if(s.category==='newstp'&&s.article==='19_3')html+=select('taxKind','Jenis pajak pada pokok terutang',[['pph','Pajak Penghasilan'],['other','Selain PPh'],['unknown','Belum tahu']]);
 if(s.document!=='NOT_ISSUED'){
  html+=select('sanctionState','Apakah sanksi dalam surat ini sudah dibayar?',[['unpaid','Belum dibayar sama sekali'],['partial','Sebagian sudah dibayar'],['fully','Sudah dibayar seluruhnya'],['unknown','Belum tahu']]);
  if(s.sanctionState==='partial'){
    html+='</div><div class="payment-section-head"><div><h4 class="sublabel">Berapa sanksi yang belum dibayar?</h4><p class="help">Cukup masukkan jumlah dalam STP/SKP dan bagian sanksi yang sudah dibayar. Kabayan menghitung sisanya secara otomatis; periksa pembayaran pokok terlebih dahulu.</p></div><button type="button" class="payment-demo" id="loadPaymentDemo">Coba contoh angka</button></div><div class="field-grid">';
    html+=moneySimple('sanctionTotal','Berapa jumlah sanksi dalam surat (Rp)?');
    html+=moneySimple('sanctionPrior','Berapa sanksi yang sudah dibayar sebelumnya (Rp)?','Isi 0 jika belum ada pembayaran sanksi sebelum pembayaran khusus. Jangan masukkan pajak pokok atau pembayaran khusus dua kali.');
    html+=balanceHTML();
    if(s.paymentExampleLoaded)html+='<div class="field full payment-demo-note" id="demoNotice">Ini angka contoh, bukan data Anda. Ganti dengan nilai pada surat dan bukti pembayaran sebelum memakai hasil.</div>';
    // Confirm allocation before computing any provisional amount under KEP-239.
    html+=choiceRadio('allocationConfirmed','Apakah uang yang sudah dibayar benar-benar dihitung sebagai pembayaran sanksi, bukan pajak pokok?',[
      ['yes','Ya, sudah saya pastikan','Saya telah memeriksa rincian pembayaran dan pelunasan pajak pokok.'],
      ['no','Belum, pembayaran masih untuk pajak pokok','Jumlah pembayaran sanksi di atas perlu diperiksa kembali.'],
      ['unknown','Belum tahu / perlu saya cek','Persentase tidak ditentukan sampai pembayaran ini dipastikan.']
    ],'Aturannya: uang yang dibayar dipakai melunasi pajak pokok lebih dahulu; sisanya baru dianggap membayar sanksi (Pasal 23 ayat (6)–(7)).');
    if(hasPartialPath()){
      html+=`<div class="field full special-branch-label"><b>Apakah diperlukan pembayaran sebagian untuk memperoleh pengurangan?</b><small>${esc(specialPaymentContext().note)} Besarnya dapat berbeda menurut tanggal. Pemeriksaan persyaratan tetap diperlukan.</small></div>`;
      html+=choiceRadio('paymentPath','Apakah Anda sudah melakukan pembayaran tambahan sesuai skema pengurangan sanksi?',[
        ['yes','Sudah dibayar','Saya memiliki bukti pembayaran.'],
        ['no','Belum dibayar','Saya ingin melihat kemungkinan jumlah dan batas waktunya.'],
        ['unknown','Belum yakin','Saya perlu memeriksa bukti pembayaran dahulu.']
      ],'Pembayaran yang baru direncanakan bukan bukti pemenuhan syarat.');
      if(s.paymentPath==='yes'){
       html+=date('partialDate','Tanggal pembayaran tambahan yang sudah dilakukan');
       html+=specialPaymentGuide();
       html+=moneySimple('sanctionProgram','Jumlah yang benar-benar sudah dibayar tambahan (Rp)','Gunakan bukti pembayaran, bukan angka saran. Jangan masukkan lagi di pembayaran sebelumnya.');
      }else if(s.paymentPath==='no'){
       html+=specialPaymentGuide();
      }else if(s.paymentPath==='unknown'){
       html+='<div class="field full payment-neutral-note">Periksa dahulu bukti pembayaran Anda. Kabayan belum menghitung pembayaran tambahan sebagai syarat yang terpenuhi.</div>';
      }
    }

  }
  if(s.sanctionState==='unpaid'){
    html+=select('estimateChoice','Ingin melihat perkiraan pengurangan dalam rupiah?',[['no','Tidak, cukup persentasenya'],['yes','Ya, hitung juga rupiahnya']]);
    if(s.estimateChoice==='yes'){
       html+=moneySimple('sanctionTotal','Jumlah sanksi yang belum dibayar (Rp)');
       if(hasPartialPath()){
         html+='<div class="field full special-branch-label"><b>Simulasi pembayaran sebagian (belum dilakukan)</b><small>Kabayan memeriksa kemungkinan skema 10%/25% berdasarkan jalur dan tanggal. Ini belum memenuhi syarat pengurangan.</small></div>';
         html+=specialPaymentGuide();
       }
    }
  }
 }
 html+='</div><div class="inline-note"><b>Ketentuan:</b> jawaban yang belum dapat dipastikan tidak akan diubah menjadi asumsi. Simulasi potensi dipisahkan dari kesiapan permohonan. Jawaban yang belum pasti tetap ditandai untuk diperiksa.</div>';
 return html;
}
function stepRequirements(){
 syncDerived();
 let html=`<div class="question-intro"><span class="question-index">03 · SYARAT PERMOHONAN</span><h3>Periksa persyaratan yang masih relevan</h3><p class="help">Jawab sesuai fakta atau dokumen. Formulir tambahan baru muncul apabila diperlukan oleh jawaban Anda.</p></div><div class="field-grid">`;
 if(['STP','STP_PBB'].includes(s.document)){
   html+=select('stpLinked','Apakah STP ini terkait SKP atau SPPT yang diajukan keberatan?',[[ 'no','Tidak, STP berdiri sendiri/tidak terkait' ],['yes','Ya, STP terkait SKP/SPPT'],['unknown','Belum dapat dipastikan']]);
 }
 if(['SKPKB','SKPKBT','SKP_PBB','SKPKB_PPS','SKPKBT_PPS'].includes(s.document)||s.stpLinked==='yes'){
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
 html+='</div><h4 class="sublabel">Pengajuan pengurangan atau penghapusan sanksi</h4><div class="field-grid">';
 html+=select('applicationStatus','Apakah permohonan pengurangan atau penghapusan sanksi sudah disampaikan kepada DJP?',[
  ['submitted','Sudah disampaikan'],['planned','Belum, akan mengajukan permohonan']]);
 if(s.applicationStatus==='submitted'){
  html+=date('applicationDate','Tanggal penyampaian permohonan','Isi berdasarkan tanggal pada bukti penerimaan permohonan. Batas pengajuan program 1 Oktober 2028.');
 }else if(s.applicationStatus==='planned'){
  html+=date('applicationDate','Rencana tanggal pengajuan permohonan','Tanggal ini hanya untuk menguji batas waktu. Belum menjadi bukti bahwa permohonan sudah disampaikan kepada DJP.');
 }
 html+=select('submissionCount','Permohonan untuk surat yang sama',[['1','Permohonan pertama'],['2','Permohonan kedua'],['3','Ketiga atau lebih']]);
 if(s.submissionCount==='2'){
  html+=date('previousDecision','Tanggal keputusan atas permohonan pertama dikirim');
  html+=select('previousCase','Apakah objek surat sama dengan pengajuan pertama?',[['yes','Ya'],['no','Tidak'],['unknown','Belum pasti']]);
 }
 html+=select('docReady','Apakah seluruh dokumen persyaratan permohonan sudah lengkap?',[
  ['yes','Sudah lengkap'],['no','Belum lengkap'],['unknown','Belum diperiksa']]);
 if(s.docReady==='yes'){
  html+=select('docApplication','Apakah surat permohonan berbahasa Indonesia, dibuat untuk satu surat, dan ditandatangani?',docApplicationOptions);
  html+=select('docAffidavit','Apakah surat pernyataan kekhilafan atau bukan karena kesalahan sudah tersedia?',docStatementOptions);
  if(s.lawsuit==='none')html+=select('docLegalStatement','Apakah surat pernyataan tidak mengajukan gugatan dan upaya hukum lainnya sudah tersedia?',docStatementOptions);
  else if(s.lawsuit==='withdrawn')html+=select('docLegalStatement','Apakah bukti pengajuan pencabutan gugatan atau upaya hukum lain tersedia?',docWithdrawalOptions);
  else s.docLegalStatement='unknown';
 }
 html+='</div><div class="inline-note">Jawab sesuai keadaan sebenarnya. Aplikasi tidak mengakses bukti penerimaan DJP, tidak memeriksa isi dokumen, dan tidak menerbitkan keputusan fasilitas.</div>';
 return html;
}
function rupiah(n){return 'Rp'+Math.round(n).toLocaleString('id-ID');}
function resultHTML(){const routing=resolveRoute();const assessment=routing.ok&&s.document!=='NOT_ISSUED'?E.assess(s):null;let r=!routing.ok?{status:'review',rate:null,matches:[],missing:[],issues:[],flags:[routing.reason],reason:'Jalur hukum belum dapat ditentukan dari dokumen dan fakta yang tersedia.',citations:[E.REF.K,E.REF.P]}:(s.category!==routing.category||s.document!==routing.document||s.article!==routing.article||s.issueDate!==routing.issueDate)?{status:'review',rate:null,matches:[],missing:[],issues:[],flags:['Identifikasi kasus berubah atau tidak konsisten. Ulangi pemetaan jalur sebelum menghitung.'],reason:'Validasi konsistensi jalur hukum gagal.',citations:[E.REF.K,E.REF.P]}:s.document==='NOT_ISSUED'?{status:'review',rate:null,matches:[],missing:[],issues:[],flags:['STP belum diterbitkan. Permohonan pengurangan sanksi menurut Pasal 23 memerlukan identitas SKP/STP terkait; sistem belum dapat memberi persentase.'],reason:'Dokumen penetapan/tagihan yang akan menjadi objek permohonan belum tersedia.',citations:[E.REF.P,E.REF.K]} :assessment.potential;
 // A stale special-payment input from another path cannot create an entitlement.
 if(s.sanctionState==='partial' && !hasPartialPath() && (s.paymentPath==='yes'||Number(s.sanctionProgram||0)>0||s.partialDate)){
   r={...r,status:'review',rate:null,calculation:null,flags:[...(r.flags||[]),'Rincian pembayaran khusus tidak cocok dengan skema yang teridentifikasi. Periksa kembali jalur dan jumlah pembayaran.'],reason:'Pembayaran khusus tidak dapat dipakai tanpa skema yang relevan.'};
 }
 // UX-only conservative hold: a nonpayment is not a missing date to be supplied.
 // In this particular STP 14(4) route the rate depends on an actual partial payment.
 if(s.category==='stp144' && s.sanctionState==='partial' && ['no','unknown'].includes(s.paymentPath)
    && r.status==='missing' && (r.missing||[]).length>0
    && r.missing.every(x=>x==='Tanggal pembayaran sebagian sanksi')){
   const note=s.paymentPath==='no'
     ?'Pembayaran khusus program belum dilakukan. Untuk skema yang mensyaratkan pembayaran 10%/25%, aplikasi tidak menganggap rencana pembayaran sebagai pemenuhan syarat.'
     :'Jenis pembayaran sebagian belum dapat dipastikan sebagai pembayaran khusus program 10%/25%.';
   r={...r,status:'review',missing:[],flags:[...(r.flags||[]),note,
      ...(s.allocationConfirmed!=='yes'?['Alokasi pembayaran ke pokok pajak juga belum dapat dipastikan.']:[])],
      reason:'Belum terdapat pembayaran khusus yang terverifikasi untuk menentukan persentase pengurangan.'};
 }
 // A planned filing is a SIMULATION, not a failure of the legal rule.
 // Do not turn an otherwise mapped rate into 'review' solely because an application is planned.
 // Keep all legal-rule validations and guards returned by PSAEngine unchanged.
 if(s.applicationStatus==='planned'){
   // A generic future-date notice is shown in the dedicated simulation information card,
   // not repeated as a legal warning. Other real legal flags remain untouched.
   if(r.status==='mapped') r={...r,flags:(r.flags||[]).filter(x=>x!=='Terdapat tanggal rencana di masa depan; hasil hanya simulasi kondisi yang direncanakan.')};
 }else if(s.applicationStatus==='submitted'){
   if(futureSubmitted()){ 
     r={...r,status:'review',rate:null,calculation:null,missing:[],issues:[],flags:[applicationDateErrorMessage()],reason:'Tanggal penyampaian permohonan belum valid dan harus diperbaiki.',matches:[]};
   }
 }else{
   r={...r,status:'missing',rate:null,calculation:null,missing:[...(r.missing||[]),'Status permohonan: sudah disampaikan atau baru direncanakan'],reason:'Status pengajuan belum dipilih.'};
 }
 last=r;
 const readiness=assessment?.readiness||'perlu_verifikasi';
 const readinessLabel={belum_diajukan:'Belum diajukan — simulasi rencana',berkas_belum_lengkap:'Dokumen belum lengkap',berkas_belum_diperiksa:'Dokumen belum diperiksa',berkas_perlu_diperiksa:'Dokumen perlu dilengkapi/diperiksa',terindikasi_lengkap:'Data menyatakan persyaratan telah dipenuhi (belum diverifikasi DJP)',ada_hambatan:'Ada hambatan administrasi yang harus diperiksa',perlu_verifikasi:'Perlu verifikasi administratif'}[readiness]||'Perlu verifikasi';
 last={...r,readiness};
 const status={mapped:['Potensi fasilitas terpetakan','mapped','Persentase hanya perkiraan bersyarat, bukan persetujuan DJP'],missing:['Informasi belum lengkap','review','Lengkapi seluruh data wajib sebelum sistem menentukan skema'],review:['Perlu verifikasi hukum','review','Tidak ada persentase yang diputuskan secara otomatis'],blocked:['Persyaratan tidak terpenuhi','blocked','Periksa hambatan yang disebutkan di bawah'],unmapped:['Tidak dapat ditentukan','review','Belum ditemukan aturan spesifik yang cocok']};
 let [ttl,css,sub]=status[r.status];
 const isSimulation=s.applicationStatus==='planned';
 if(r.status==='mapped'&&isSimulation) ttl='Simulasi Potensi Fasilitas';
 const simulationInfo=isSimulation?`<div class="simulation-explainer" role="note"><div class="simulation-explainer-title">◷ Simulasi berdasarkan rencana Anda</div><p>Permohonan belum disampaikan kepada DJP. ${r.status==='mapped'?'Persentase dan nominal yang ditampilkan adalah estimasi bersyarat.':'Hasil saat ini belum dapat memastikan besaran fasilitas.'} <b>Rencana tindakan harus benar-benar dilaksanakan sesuai tenggat dan seluruh syarat perlu dipenuhi.</b> Simulasi bukan keputusan DJP atau bukti pengajuan.</p></div>`:'';
 const based=(r.matches||[]).map(x=>`<div class="legalitem"><strong>${esc(x.id)}</strong> · ${esc(x.cite)}<div>${esc(x.why)}. ${esc(x.pages)}</div></div>`).join('');
 let nam=cardText();
 const msgs=[...(r.missing||[]).map(x=>({c:'review',m:'Belum diisi: '+x})),...(r.issues||[]).map(x=>({c:'blocked',m:x})),...(r.flags||[]).map(x=>({c:'review',m:x}))];
 // UI-only summary. Never used to decide entitlement, readiness, or percent.
 // Always show the core checklist; add special items only when facts trigger them.
 const checklistItems=[
   'Pokok pajak yang menjadi dasar sanksi telah lunas sesuai Pasal 23',
   'Periksa status keberatan, pembatalan dan gugatan/upaya hukum lain',
   'Surat permohonan dalam bahasa Indonesia, satu permohonan per SKP/STP atau surat PBB',
   'Surat pernyataan kekhilafan/bukan karena kesalahan ditandatangani di atas meterai',
   s.lawsuit==='withdrawn'?'Bukti pengajuan pencabutan gugatan atau upaya hukum lain disiapkan sesuai kasus':'Surat pernyataan tidak menggugat bermeterai atau bukti pencabutan sesuai kasus',
   s.sanctionState==='partial'?'Sanksi yang dimohonkan belum seluruhnya dibayar; jumlah dan pembayaran sebagian direkonsiliasi':'Sanksi yang dimohonkan masih belum dibayar sesuai syarat fasilitas',
   'Batas tindakan khusus dan batas pengajuan 1 Oktober 2028 dipenuhi'
 ];
 if(s.submissionCount==='2')checklistItems.push('Permohonan kedua dan batas 3 bulan sejak keputusan pertama telah diperiksa');
 else if(s.submissionCount==='3')checklistItems.push('Permohonan ketiga atau lebih: periksa pembatasan jumlah pengajuan menurut ketentuan');
 if(s.auctionCondition!=='no')checklistItems.push('Pengajuan dilakukan sebelum permohonan lelang/pemindahbukuan barang sitaan sesuai ketentuan');

 return `<div class="result-zone"><div class="res-head ${css}"><strong>${css==='mapped'?'✓':css==='blocked'?'✕':'!'} ${esc(ttl)}</strong>${r.status==='mapped'?`<div class="rate">${r.rate}% <small>${isSimulation?'estimasi pengurangan/penghapusan':'potensi pengurangan/penghapusan'}</small></div>`:`<h2>${esc(ttl)}</h2>`}<p>${esc(sub)}. ${esc(r.reason)}</p></div>
 ${simulationInfo}
 <p class="psa-result-disclaimer">Hasil adalah simulasi berdasarkan data yang Anda masukkan, bukan keputusan DJP. Pemberian fasilitas tetap mengikuti persyaratan PMK 118/2024 sebagaimana diubah PMK 71/2026 serta KEP-239/PJ/2026.</p>
 <div class="sectionbox v18-readiness"><h4>Kesiapan permohonan (terpisah dari simulasi tarif)</h4><div class="inline-note"><strong>${esc(readinessLabel)}</strong><br>Hasil tarif potensial tidak membuktikan dokumen lengkap, pelunasan sudah dilakukan, atau permohonan disetujui DJP. Status berkas saat ini: ${esc(s.docReady==='yes'?'dinyatakan lengkap oleh pengisi (belum diverifikasi DJP)':s.docReady==='no'?'belum lengkap':'belum diperiksa')}.</div></div>
 <div class="factcols"><div class="tile"><small>Kategori peristiwa</small><strong>${esc(nam)}</strong></div><div class="tile"><small>Pasal sanksi</small><strong>${esc(E.ARTICLE_LABEL[s.article]||'—')}</strong></div><div class="tile"><small>Dokumen</small><strong>${esc(docNames[s.document]||s.document||'—')}</strong></div><div class="tile"><small>Batas permohonan program</small><strong>1 Oktober 2028</strong></div><div class="tile"><small>Status permohonan</small><strong>${s.applicationStatus==='submitted'?'Sudah disampaikan kepada DJP':s.applicationStatus==='planned'?'Belum disampaikan (masih rencana)':'Belum diketahui'}</strong></div><div class="tile"><small>${s.applicationStatus==='submitted'?'Tanggal penyampaian':'Rencana tanggal pengajuan'}</small><strong>${esc(s.applicationDate||'—')}</strong></div></div>
 ${r.calculation?`<div class="sectionbox"><h4>Estimasi Sanksi yang Berpotensi Dikurangi atau Dihapuskan</h4><div class="factcols"><div class="tile"><small>Dasar sanksi yang belum dibayar</small><strong>${rupiah(r.calculation.base)}</strong></div><div class="tile"><small>Potensi nominal pengurangan/penghapusan</small><strong>${rupiah(r.calculation.relief)}</strong></div></div><p class="smalltxt">${esc(r.calculation.note)}</p></div>`:''}
 ${msgs.length?`<div class="sectionbox"><h4>Alasan, data yang kurang, atau persyaratan yang perlu diperiksa</h4>${msgs.map(x=>`<div class="message ${x.c}">${esc(x.m)}</div>`).join('')}</div>`:''}
 <div class="sectionbox"><h4>Dasar keputusan mesin aturan</h4>${based||'<div class="inline-note">Tidak ada rule dengan seluruh persyaratan yang dapat dicocokkan secara pasti untuk skenario ini.</div>'}
 <details class="legal-detail"><summary>Tampilkan dasar hukum umum</summary>${r.citations.map(x=>`<div class="legalitem">${esc(x)}</div>`).join('')}</details></div>
 <section class="sectionbox psa-next-steps" aria-labelledby="psa-next-steps-title">
   <div class="psa-next-steps-intro">
     <span class="psa-next-steps-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="13" height="17" rx="2"/><path d="M9 4.5V3.5h6v1M9 10l1.2 1.2L12.4 9M14 10h2M9 15l1.2 1.2 2.2-2.2M14 15h2"/></svg></span>
     <div><h4 id="psa-next-steps-title">Apa yang perlu Anda lakukan selanjutnya?</h4>
     <p>Hasil pemeriksaan awal sudah dapat dibaca tanpa membuka checklist. Gunakan panduan ini untuk menyiapkan permohonan sebelum disampaikan kepada DJP.</p></div>
   </div>
   <div class="psa-checklist-action">
     <div><strong>Checklist dokumen dan persyaratan</strong><p>${checklistItems.length} poin panduan sesuai jawaban Anda. Tidak wajib dibuka untuk melihat simulasi.</p></div>
     <button id="togglePsaChecklist" type="button" class="psa-checklist-button" aria-expanded="false" aria-controls="psaChecklistPanel"><span class="psa-checklist-button-text">Lihat checklist</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 14 0m-6-6 6 6-6 6"/></svg></button>
   </div>
   <div id="psaChecklistPanel" class="psa-checklist-panel" hidden>
     <p class="psa-checklist-helper">Centang untuk catatan pribadi setelah Anda memeriksa setiap poin. Centang ini tidak mengubah hasil perhitungan atau berarti dokumen telah diverifikasi DJP. Pemeriksaan persyaratan tetap mengikuti ketentuan yang berlaku.</p>
     <div class="checklist-items">${checklistItems.map(item=>`<label class="message"><input type="checkbox" class="psa-personal-check" style="margin-top:4px;accent-color:#0071e3" aria-label="Tandai telah diperiksa"> <span>${esc(item)}</span></label>`).join('')}</div>
   </div>
 </section>
 </div></div>`;
}
function render(){
 if(step>=2 && s.category)syncDerived();
 const labels=['Kondisi','Identifikasi surat','Fakta kasus','Persyaratan','Hasil'];
 $('step-label').textContent=`LANGKAH ${step+1} DARI 5 · ${labels[step]}`;
 $('step-text').textContent=step===0?'Pilih kondisi yang Anda alami':step===1?'Kenali surat dan asal sanksi':step===4?'Hasil berdasarkan data dan jalur yang terverifikasi':cardText();
 $('wizard-panel').dataset.step=String(step);$('stepper').setAttribute('aria-valuenow',String(step+1));$('stepper').setAttribute('aria-valuemax','5');
 $('stepper').innerHTML=labels.map((x,i)=>`<span class="${i<=step?'done':''}" title="${esc(x)}"></span>`).join('');
 $('body').innerHTML=[step0,stepRoute,stepDetails,stepRequirements,resultHTML][step]();
 $('back').style.visibility=step===0?'hidden':'visible';
  $('resetCase').hidden=step===0||step===4;
 $('next').textContent=['Identifikasi surat →','Lanjut ke fakta kasus →','Periksa persyaratan →','Lihat hasil saya →','Periksa kasus baru ↻'][step];
 $('next').disabled=step===0&&!s.entry;
 $('print').hidden=step!==4;$('copy').hidden=step!==4;
 $('footer-message').textContent=step===4?'Hasil wajib diuji kembali dengan dokumen sumber':'Informasi diolah lokal; tidak dikirim ke server oleh halaman ini';
}
function restartCase(){s=emptyCase();plannedSpecialPaymentDate='';step=0;last=null;render();$('cek').scrollIntoView({behavior:'smooth',block:'start'});const first=$('body').querySelector('[data-entry]');if(first)first.focus({preventScroll:true});}
function resetCase(id){s={category:id,document:(documents[id]||[]).length===1?documents[id][0]:'',article:['late','amend','pay','stp143','stp144'].includes(id)?articles[id][0]:'',sanctionPrior:'0',sanctionProgram:'0',sanctionTotal:'',applicationDate:'',applicationStatus:'',sptType:'',sptStatus:'',sanctionState:'',principalConfirmed:'',docReady:''};}
function validateApplicationDateInline({focus=false}={}){
 const input=$('f_applicationDate');
 const error=$('applicationDateError');
 const bad=futureSubmitted();
 if(input){input.setAttribute('aria-invalid',String(bad));input.classList.toggle('is-invalid',bad);}
 if(error){error.hidden=!bad;error.textContent=bad?applicationDateErrorMessage():'';}
 if(bad && focus && input){input.focus({preventScroll:false});input.scrollIntoView({behavior:'smooth',block:'center'});}
 return !bad;
}
function advance(){
 if(step===0){if(!s.entry)return;step=1;}
 else if(step===1){
  const needed=[...document.querySelectorAll('#body [data-field]')];
  const blank=needed.filter(x=>!String(x.value).trim());
  if(blank.length){showMissing(blank);return;}
  const r=applyRoute();
  if(!r.ok){step=4;}else if(s.document==='NOT_ISSUED'){step=4;}else step=2;
 }
 else if(step===2||step===3){
  // UX guard: never advance a purportedly completed filing dated after today.
  if(step===3&&!validateApplicationDateInline({focus:true}))return;
  const optional=['estimateChoice','sanctionTotal','paymentPath'];
  const required=[...document.querySelectorAll('#body [data-field]')].filter(x=>!optional.includes(x.dataset.field));
  const blank=required.filter(x=>!String(x.value).trim());
  if(blank.length){showMissing(blank);return;}
  if(step===2&&s.sanctionState==='partial'){
    const v=balancePreview();
    if(v.error){showPaymentError(v.error);return;}
    if(s.sanctionPrior==='' || (Number(s.sanctionPrior)<=0 && s.paymentPath!=='yes')){
      showPaymentError('Anda memilih sebagian sanksi sudah dibayar, tetapi tidak ada nilai pembayaran tercatat. Periksa jumlah yang sudah dibayar.');return;
    }
    if(hasPartialPath()&&!['yes','no','unknown'].includes(s.paymentPath)){
      showPaymentError('Tentukan apakah pembayaran khusus program sudah dilakukan, belum, atau belum dapat dipastikan.');return;
    }
    if(!['yes','no','unknown'].includes(s.allocationConfirmed)){
      showPaymentError('Periksa apakah pembayaran masuk ke sanksi atau pajak pokok. Jika belum yakin, pilih Belum tahu.');return;
    }
    if(hasPartialPath()&&s.paymentPath==='yes'){
      const amt=Number(s.sanctionProgram);
      if(!(amt>0)||!s.partialDate){showPaymentError('Lengkapi jumlah dan tanggal pembayaran khusus yang benar-benar sudah dilakukan.');return;} const curr=new Date(),todayLocal=[curr.getFullYear(),String(curr.getMonth()+1).padStart(2,'0'),String(curr.getDate()).padStart(2,'0')].join('-');if(s.partialDate>todayLocal){showPaymentError('Tanggal pembayaran yang dinyatakan sudah dilakukan berada di masa depan. Jika masih rencana, pilih Belum dibayar.');return;}
      if(Number(s.sanctionPrior)+amt>=Number(s.sanctionTotal)){
        showPaymentError('Jumlah pembayaran sebelumnya dan pembayaran program harus lebih kecil daripada total sanksi yang dimohonkan.');return;
      }
    }
  }
  step=step===2?3:4;
 }
 else if(step===4){restartCase();return;}
 render();$('cek').scrollIntoView({behavior:'smooth',block:'start'});
}
function showPaymentError(message){let old=$('step-errors');if(old)old.remove();const note=document.createElement('div');note.className='message review';note.id='step-errors';note.setAttribute('role','alert');note.textContent=message;$('body').prepend(note);note.scrollIntoView({behavior:'smooth',block:'nearest'});}
function showMissing(blank){let old=document.getElementById('step-errors');if(old)old.remove();
 const note=document.createElement('div');note.id='step-errors';note.className='message review';
 note.textContent='Lengkapi '+blank.length+' informasi yang masih kosong. Gunakan opsi “Belum diketahui” bila tersedia; sistem tidak akan menebak.';
 document.getElementById('body').prepend(note);blank[0].focus();}
function backup(){if(step>0){step=(step===4&&!s.category)?1:(step===4&&s.document==='NOT_ISSUED')?1:step-1;render();$('cek').scrollIntoView({behavior:'smooth',block:'start'});}}
function copyText(){if(!last)return;let report=`KABAYAN | CEK FASILITAS PENGURANGAN DAN PENGHAPUSAN SANKSI ADMINISTRASI\nStatus: ${last.status}\nStatus permohonan: ${s.applicationStatus==='submitted'?'Sudah disampaikan':s.applicationStatus==='planned'?'Masih direncanakan':'Belum diisi'}\nTanggal: ${s.applicationDate||'-'}\nKesiapan permohonan: ${last.readiness||'perlu_verifikasi'}
Jenis hasil: ${s.applicationStatus==='planned'?'SIMULASI BERSYARAT - belum diajukan/disetujui DJP':'Pemeriksaan awal data aktual'}\nKategori: ${cardText()}\nPasal: ${E.ARTICLE_LABEL[s.article]||'-'}\nPersentase simulasi: ${last.rate===null?'TIDAK DITENTUKAN':last.rate+'%'}\nAlasan: ${last.reason}\nAturan: ${(last.matches||[]).map(x=>x.cite).join('; ')}\nCatatan: ${[...(last.flags||[]),...(last.issues||[])].join('; ')}\nBatas permohonan: 1 Oktober 2028.\nPanduan edukasi, bukan keputusan DJP.`;if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(report).then(()=>toast('Ringkasan disalin.')).catch(()=>fallbackCopy(report));}else fallbackCopy(report);}
function fallbackCopy(v){let a=window.prompt('Salin ringkasan:',v);if(a!==null)toast('Ringkasan siap disalin.');}
function toast(v){$('footer-message').textContent=v;}
document.addEventListener('click',ev=>{
 const toggle=ev.target.closest('#togglePsaChecklist');
 if(toggle){
  const panel=document.getElementById('psaChecklistPanel');
  if(!panel)return;
  const willOpen=panel.hidden;
  panel.hidden=!willOpen;
  toggle.setAttribute('aria-expanded',String(willOpen));
  const caption=toggle.querySelector('.psa-checklist-button-text');
  if(caption)caption.textContent=willOpen?'Tutup checklist':'Lihat checklist';
  return;
 }
 const demo=ev.target.closest('#loadPaymentDemo');
 if(demo){
   s.sanctionState='partial';s.sanctionTotal='100000000';s.sanctionPrior='10000000';s.paymentPath='no';
   s.sanctionProgram='0';s.partialDate='';s.allocationConfirmed='unknown';s.paymentExampleLoaded=true;
   render();
   return;
 }
 const b=ev.target.closest('[data-entry]');
 if(b){plannedSpecialPaymentDate='';s={entry:b.dataset.entry,category:'',sanctionPrior:'0',sanctionProgram:'0',sanctionTotal:'',applicationDate:'',applicationStatus:'',sptType:'',sptStatus:'',sanctionState:'',principalConfirmed:'',docReady:''};render();}
});
document.addEventListener('change',ev=>{const c=ev.target;if(c.dataset.uiPlanDate==='1'){plannedSpecialPaymentDate=c.value;refreshSpecialGuidance();return;}if(c.dataset.field){s[c.dataset.field]=c.dataset.rupiah==='1'?numericOnly(c.value):c.value;if(['sptPeriodMonth','sptPeriodYear'].includes(c.dataset.field)){s.sptPeriod=s.sptPeriodMonth&&s.sptPeriodYear?`${s.sptPeriodYear}-${s.sptPeriodMonth}`:'';}if(['routeDoc','routeArticle','routeIssueDate','routeOrigin','routeSptEvent','routeGovernment'].includes(c.dataset.field)) {
 if(c.dataset.field==='routeDoc'){plannedSpecialPaymentDate='';s.routeArticle='';s.routeIssueDate='';s.routeOrigin='';}
 if(c.dataset.field==='routeIssueDate')s.routeOrigin='';
 if(c.dataset.field==='routeArticle')s.routeOrigin='';
 render();return;
} if(['document','article','sptType','sptStatus','registerType','principalConfirmed','principalDate','actionDate','sanctionState','estimateChoice','paymentPath','stpLinked','objection','auctionCondition','submissionCount','docReady','lawsuit','applicationStatus'].includes(c.dataset.field)){
 if(c.dataset.field==='document'){s.article='';s.principalConfirmed='';s.issueDate='';s.principalDate='';s.sanctionState='';s.stpLinked='';s.objection='';}
 if(c.dataset.field==='article'){s.principalConfirmed='';s.principalDate='';s.sanctionState='';s.partialDate='';s.sanctionTotal='';}
 if(c.dataset.field==='sptType'){s.sptYear='';s.sptPeriod='';s.sptPeriodMonth='';s.sptPeriodYear='';s.sptStatus='';s.actionDate='';}
 if(c.dataset.field==='sanctionState'){plannedSpecialPaymentDate='';s.sanctionTotal='';s.sanctionPrior='0';s.sanctionProgram='0';s.partialDate='';s.estimateChoice='';s.paymentPath='';s.paymentExampleLoaded=false;}
 if(c.dataset.field==='paymentPath'){plannedSpecialPaymentDate='';s.sanctionProgram=c.value==='yes'?'':'0';s.partialDate='';}
 if(c.dataset.field==='principalConfirmed')s.principalDate='';
 if(c.dataset.field==='stpLinked')s.objection='';
 if(c.dataset.field==='auctionCondition')s.auction='';
 if(c.dataset.field==='lawsuit')s.docLegalStatement='';
 if(c.dataset.field==='docReady'){s.docApplication='';s.docAffidavit='';s.docLegalStatement='';}
 if(c.dataset.field==='applicationStatus')s.applicationDate='';
 render();
 }}});
// Pastikan tanggal yang disampaikan benar-benar sudah terjadi, termasuk input lewat keyboard.
document.addEventListener('change',ev=>{
 if(ev.target.dataset?.field==='applicationDate')validateApplicationDateInline();
});
document.addEventListener('input',ev=>{
 const c=ev.target;if(!c.dataset.field)return;
 if(c.dataset.rupiah==='1'){
   const n=numericOnly(c.value);s[c.dataset.field]=n;
   c.value=formatInteger(n);refreshBalance();refreshSpecialGuidance();
   if(['sanctionTotal','sanctionPrior','sanctionProgram'].includes(c.dataset.field)&&s.paymentExampleLoaded){s.paymentExampleLoaded=false;const note=$('demoNotice');if(note)note.hidden=true;}
 }else {s[c.dataset.field]=c.value;if(c.dataset.field==='partialDate')refreshSpecialGuidance();if(c.dataset.field==='applicationDate')validateApplicationDateInline();}
});
$('resetCase').addEventListener('click',()=>{const dlg=$('resetDialog');if(typeof dlg.showModal==='function'){dlg.showModal();$('cancelReset').focus();}else if(window.confirm('Mulai ulang? Semua isian dan hasil pemeriksaan saat ini akan dihapus.'))restartCase();});
$('cancelReset').addEventListener('click',()=>{$('resetDialog').close();$('resetCase').focus();});
$('confirmReset').addEventListener('click',()=>{$('resetDialog').close();restartCase();});
$('resetDialog').addEventListener('click',e=>{if(e.target===$('resetDialog'))$('resetDialog').close();});
$('next').addEventListener('click',advance);$('back').addEventListener('click',backup);$('print').addEventListener('click',()=>window.print());$('copy').addEventListener('click',copyText);
render();})();
