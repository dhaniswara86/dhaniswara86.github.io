(()=>{
'use strict';
const $=id=>document.getElementById(id);
const state={rows:[],fileName:'',db:Array.isArray(window.SISEHAT_EMPLOYEE_DB)?window.SISEHAT_EMPLOYEE_DB.slice():[],dbName:'_filexport_coretax.xlsx'};
const CODEMAP=window.SISEHAT_PTKP_CODE_MAP||{"1000":"TK/0","1001":"TK/1","1002":"TK/2","1003":"TK/3","1100":"K/0","1101":"K/1","1102":"K/2","1103":"K/3"};
const TER={"A":[[5400000,0],[5650000,.25],[5950000,.5],[6300000,.75],[6750000,1],[7500000,1.25],[8550000,1.5],[9650000,1.75],[10050000,2],[10350000,2.25],[10700000,2.5],[11050000,3],[11600000,3.5],[12500000,4],[13750000,5],[15100000,6],[16950000,7],[19750000,8],[24150000,9],[26450000,10],[28000000,11],[30050000,12],[32400000,13],[35400000,14],[39100000,15],[43850000,16],[47800000,17],[51400000,18],[56300000,19],[62200000,20],[68600000,21],[77500000,22],[89000000,23],[103000000,24],[125000000,25],[157000000,26],[206000000,27],[337000000,28],[454000000,29],[550000000,30],[695000000,31],[910000000,32],[1400000000,33]],
"B":[[6200000,0],[6500000,.25],[6850000,.5],[7300000,.75],[9200000,1],[10750000,1.5],[11250000,2],[11600000,2.5],[12600000,3],[13600000,4],[14950000,5],[16400000,6],[18450000,7],[21850000,8],[26000000,9],[27700000,10],[29350000,11],[31450000,12],[33950000,13],[37100000,14],[41100000,15],[45800000,16],[49500000,17],[53800000,18],[58500000,19],[64000000,20],[71000000,21],[80000000,22],[93000000,23],[109000000,24],[129000000,25],[163000000,26],[211000000,27],[374000000,28],[459000000,29],[555000000,30],[704000000,31],[957000000,32],[1405000000,33]],
"C":[[6600000,0],[6950000,.25],[7350000,.5],[7800000,.75],[8850000,1],[9800000,1.25],[10950000,1.5],[11200000,1.75],[12050000,2],[12950000,3],[14150000,4],[15550000,5],[17050000,6],[19500000,7],[22700000,8],[26600000,9],[28100000,10],[30100000,11],[32600000,12],[35400000,13],[38900000,14],[43000000,15],[47400000,16],[51200000,17],[55800000,18],[60400000,19],[66700000,20],[74500000,21],[83200000,22],[95600000,23],[110000000,24],[134000000,25],[169000000,26],[221000000,27],[390000000,28],[463000000,29],[561000000,30],[709000000,31],[965000000,32],[1419000000,33]]};
const PTKP=['','TK/0','TK/1','TK/2','TK/3','K/0','K/1','K/2','K/3','HB/0','HB/1','HB/2','HB/3'];
const txt=v=>v==null?'':String(v).trim();
const digits=v=>txt(v).replace(/\D/g,'');
const nrm=v=>txt(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim();
const simpleName=v=>nrm(v).replace(/\([^)]*\)/g,' ').replace(/\b(AKP|AIPDA|BRIPKA|BRIGADIR|BRIPDA|BRIGPOL|BRIPTU|KOMPOL|DR|DRG|PROF|S E|M A|PH D|SKM|MKM|M SI|S SOS|S KOM|S TR KES|A MD|SH|LLM|MH)\b\.?/g,' ').replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const xe=s=>txt(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const money=v=>'Rp'+Math.round(+v||0).toLocaleString('id-ID');
function num(v){if(typeof v==='number')return Number.isFinite(v)?v:0;let s=txt(v);if(!s||s==='-')return 0;s=s.replace(/\s/g,'').replace(/Rp/ig,'');if(/^[-+]?\d{1,3}([.,]\d{3})+$/.test(s))s=s.replace(/[.,]/g,'');else if(s.includes(',')&&!s.includes('.'))s=s.replace(',','.');else if(s.includes(',')&&s.includes('.'))s=s.replace(/\./g,'').replace(',','.');let n=Number(s);return Number.isFinite(n)?n:0}
function ptkp(v){let s=nrm(v).replace(/\s/g,'');if(CODEMAP[s])return CODEMAP[s];return /^(TK|K|HB)\/[0-3]$/.test(s)?s:''}
function cat(p){p=ptkp(p);if(['TK/0','TK/1','K/0','HB/0','HB/1'].includes(p))return'A';if(['TK/2','TK/3','K/1','K/2','HB/2','HB/3'].includes(p))return'B';if(p==='K/3')return'C';return''}
function ter(p,g){let c=cat(p);if(!c)return{cat:'',rate:null};for(const [u,r] of TER[c])if(g<=u)return{cat:c,rate:r};return{cat:c,rate:34}}
const tax=(g,r)=>Math.round((+g||0)*(+r||0)/100);
function nearestRate(g,target){g=+g||0;target=Math.round(+target||0);if(g<=0)return{rate:0,tax:0,residual:target};let exact=target/g*100,b=Math.floor(exact*100),best=null;for(let k=-4;k<=4;k++){let rate=Math.max(0,b+k)/100,t=tax(g,rate),res=target-t,score=Math.abs(res);if(!best||score<best.score){best={rate,tax:t,residual:res,score,exact}}}return best}
function lookup(r){
  const nip=digits(r.nip), name=simpleName(r.name);
  let cand=[];
  if(nip) cand=state.db.filter(x=>digits(x.nip)===nip);
  if(!cand.length&&name){
    cand=state.db.filter(x=>simpleName(x.name)===name);
    if(!cand.length) cand=state.db.filter(x=>{let z=simpleName(x.name);return z&&name&&(z.includes(name)||name.includes(z))});
  }
  if(!cand.length)return null;
  const rank=s=>s==='mei.'?5:s==='apr.impor'?4:s==='mar.impor'?3:s==='mar.impor2'?2:s==='feb.impor'?1:0;
  cand.sort((a,b)=>rank(b.sheet)-rank(a.sheet));
  let out={nik:'',ptkp:'',position:'',nikSource:'',ptkpSource:'',positionSource:''};
  for(const x of cand){
    if(!out.nik&&/^\d{16}$/.test(digits(x.nik))){out.nik=digits(x.nik);out.nikSource='DB: '+x.sheet}
    if(!out.ptkp&&ptkp(x.ptkp)){out.ptkp=ptkp(x.ptkp);out.ptkpSource='DB: '+x.sheet}
    if(!out.position&&txt(x.position)){out.position=txt(x.position);out.positionSource='DB: '+x.sheet}
  }
  return out;
}
function recalc(r){let t=ter(r.ptkp,r.gross);r.terCat=t.cat;r.terRate=t.rate;r.terTax=t.rate==null?null:tax(r.gross,t.rate);r.diff=r.terTax==null?null:Math.round(r.sourceTax-r.terTax);r.mismatch=r.diff!=null&&r.diff!==0;r.facility=r.terTax==null?'':(r.mismatch?'ETC':'N/A');if(r.terTax==null){r.xmlRate=null;r.xmlTax=null;r.xmlResidual=null;return}if(r.mismatch){let q=nearestRate(r.gross,r.sourceTax);r.xmlRate=q.rate;r.xmlTax=q.tax;r.xmlResidual=q.residual}else{r.xmlRate=Math.round(r.terRate*100)/100;r.xmlTax=tax(r.gross,r.xmlRate);r.xmlResidual=Math.round(r.sourceTax-r.xmlTax)}}
function fillMissing(r){
  let l=lookup(r);
  if(!/^\d{16}$/.test(r.nik||'')&&l&&l.nik){r.nik=l.nik;r.nikSource=l.nikSource}
  if(!ptkp(r.ptkp)&&l&&l.ptkp){r.ptkp=l.ptkp;r.ptkpSource=l.ptkpSource}
  if(!r.position&&l&&l.position){r.position=l.position;r.positionSource=l.positionSource}
  recalc(r);
}
function findHeader(data){
  for(let i=0;i<Math.min(20,data.length);i++){
    let h=(data[i]||[]).map(nrm);
    if(h.includes('NMPPNPN')&&h.includes('PENGHASILAN')&&h.includes('PPH'))return{i,type:'wamen'};
    if(h.some(x=>x==='NAMA'||x.includes('NAMA PEGAWAI'))&&h.some(x=>x==='PPH'||x.includes('PAJAK'))&&h.some(x=>x.includes('BRUTO')||x.includes('KOTOR')))return{i,type:'table'};
  } return null;
}
function fc(h,tests){for(const t of tests){let i=h.findIndex(t);if(i>=0)return i}return-1}
function parseWorkbook(ab){
  if(typeof XLSX==='undefined')throw Error('Library Excel belum termuat.');
  const wb=XLSX.read(ab,{type:'array'});let chosen=null;
  for(const sn of wb.SheetNames){let d=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,defval:'',raw:true});let f=findHeader(d);if(f){chosen={d,...f,sn};break}}
  if(!chosen)throw Error('Format Excel belum dikenali.');
  const d=chosen.d, hr=chosen.i, h=d[hr].map(nrm), out=[];
  if(chosen.type==='wamen'){
    const ix=n=>h.indexOf(n), c={name:ix('NMPPNPN'),nik:ix('NIKPPNPN'),ptkp:ix('STSPAJAK'),gross:ix('PENGHASILAN'),tax:ix('PPH'),pos:ix('NMANAK'),nip:ix('NIP')};
    for(let i=hr+1;i<d.length;i++){let a=d[i],name=txt(a[c.name]);if(!name)continue;let gross=num(a[c.gross]),sourceTax=num(a[c.tax]);if(!gross&&!sourceTax)continue;let directNik=digits(a[c.nik]);let directPtkp=ptkp(a[c.ptkp]);let r={no:out.length+1,name,nip:c.nip>=0?digits(a[c.nip]):'',position:c.pos>=0?txt(a[c.pos]):'',nik:/^\d{16}$/.test(directNik)?directNik:'',ptkp:directPtkp,gross,sourceTax,nikSource:/^\d{16}$/.test(directNik)?'Excel':'',ptkpSource:directPtkp?'Excel':'',positionSource:c.pos>=0&&txt(a[c.pos])?'Excel':'',format:'WAMEN'};fillMissing(r);out.push(r)}
  }else{
    const c={
      no:fc(h,[x=>x==='NO'||x==='NOMOR']),name:fc(h,[x=>x==='NAMA',x=>x.includes('NAMA PEGAWAI')]),nip:fc(h,[x=>x==='NIP']),
      position:fc(h,[x=>x==='JABATAN'||x==='POSISI']),nik:fc(h,[x=>x==='NIK'||x==='NIKPPNPN']),ptkp:fc(h,[x=>x.includes('PTKP'),x=>x.includes('STATUS KAWIN'),x=>x==='STSPAJAK']),
      gross:fc(h,[x=>x.includes('JUMLAH TUKIN BRUTO'),x=>x.includes('TUKIN BRUTO'),x=>x==='BRUTO',x=>x.includes('PENGHASILAN BRUTO')]),
      tax:fc(h,[x=>x==='PPH',x=>x.includes('POTONGAN PPH'),x=>x==='PAJAK'])
    };
    if(c.name<0||c.gross<0||c.tax<0)throw Error('Kolom Nama, Bruto, atau PPh tidak ditemukan.');
    for(let i=hr+1;i<d.length;i++){let a=d[i],name=txt(a[c.name]);if(!name||nrm(name)==='TOTAL')continue;let gross=num(a[c.gross]),sourceTax=num(a[c.tax]),nip=c.nip>=0?digits(a[c.nip]):'';if(!gross&&!sourceTax&&!nip)continue;let directNik=c.nik>=0?digits(a[c.nik]):'',directPtkp=c.ptkp>=0?ptkp(a[c.ptkp]):'';let r={no:c.no>=0?txt(a[c.no])||out.length+1:out.length+1,name,nip,position:c.position>=0?txt(a[c.position]):'',nik:/^\d{16}$/.test(directNik)?directNik:'',ptkp:directPtkp,gross,sourceTax,nikSource:/^\d{16}$/.test(directNik)?'Excel':'',ptkpSource:directPtkp?'Excel':'',positionSource:c.position>=0&&txt(a[c.position])?'Excel':'',format:'TABEL'};fillMissing(r);out.push(r)}
  }
  if(!out.length)throw Error('Tidak ada baris pembayaran yang dapat diproses.');
  return{rows:out,format:chosen.type,sheet:chosen.sn};
}
function ptkpOptions(s){return PTKP.map(x=>`<option value="${x}" ${x===s?'selected':''}>${x||'Pilih'}</option>`).join('')}
function rowErrors(r){let e=[];if(!/^\d{16}$/.test(r.nik))e.push('NIK belum valid');if(!cat(r.ptkp))e.push('PTKP belum tersedia');if(!(r.gross>0))e.push('Bruto harus > 0');if(r.sourceTax<0)e.push('PPh negatif');if(!r.position)e.push('Jabatan kosong');return e}
function cfgErrors(){let e=[],tin=digits($('tin').value),tku=digits($('withholderTku').value);if(!/^\d{15,16}$/.test(tin))e.push('NPWP Pemotong harus 15–16 digit');if(!/^\d{22}$/.test(tku))e.push('ID TKU Pemotong harus 22 digit');if(!$('withholdingDate').value)e.push('Tanggal Pemotongan wajib diisi');return e}
function render(){
  $('configCard').classList.remove('hidden');$('resultCard').classList.remove('hidden');
  const b=$('resultBody');b.innerHTML='';
  state.rows.forEach((r,i)=>{recalc(r);let errs=rowErrors(r),status=errs.length?'<span class="badge err">Belum lengkap</span>':r.mismatch?'<span class="badge warn">Selisih → ETC</span>':'<span class="badge ok">Sesuai</span>';let tr=document.createElement('tr');tr.innerHTML=`
<td>${xe(r.no||i+1)}</td><td class="name">${xe(r.name)}</td><td>${xe(r.nip)}</td><td class="position"><input class="inline pos" data-i="${i}" value="${xe(r.position)}"><span class="src">${xe(r.positionSource||'-')}</span></td>
<td><input class="inline nik" data-i="${i}" maxlength="16" inputmode="numeric" value="${xe(r.nik)}"><span class="src">${xe(r.nikSource||'Belum ditemukan')}</span></td>
<td><select class="inline ptkp" data-i="${i}">${ptkpOptions(r.ptkp)}</select><span class="src">${xe(r.ptkpSource||'Belum ditemukan')}</span></td>
<td class="num"><input class="inline money gross" data-i="${i}" value="${Math.round(r.gross)}"></td><td class="num"><input class="inline money tax" data-i="${i}" value="${Math.round(r.sourceTax)}"></td>
<td>${r.terCat?'TER '+r.terCat:'-'}</td><td class="num">${r.terRate==null?'-':r.terRate.toFixed(2)+'%'}</td><td class="num">${r.terTax==null?'-':money(r.terTax)}</td><td class="num">${r.diff==null?'-':money(r.diff)}</td>
<td>${r.facility?'<span class="badge '+(r.facility==='N/A'?'ok':'warn')+'">'+r.facility+'</span>':'-'}</td><td class="num">${r.xmlRate==null?'-':r.xmlRate.toFixed(2)+'%'}</td><td class="num">${r.xmlTax==null?'-':money(r.xmlTax)}</td><td>${status}${r.xmlResidual?'<br><span class="src">Deviasi XML '+money(Math.abs(r.xmlResidual))+'</span>':''}${errs.length?'<br><span class="src">'+xe(errs.join('; '))+'</span>':''}</td>`;
b.appendChild(tr)});
  b.querySelectorAll('.nik').forEach(x=>x.oninput=e=>{let r=state.rows[+e.target.dataset.i];r.nik=digits(e.target.value).slice(0,16);r.nikSource='Manual';e.target.value=r.nik;update()});
  b.querySelectorAll('.ptkp').forEach(x=>x.onchange=e=>{let r=state.rows[+e.target.dataset.i];r.ptkp=e.target.value;r.ptkpSource='Manual';render()});
  b.querySelectorAll('.pos').forEach(x=>x.oninput=e=>{let r=state.rows[+e.target.dataset.i];r.position=e.target.value;r.positionSource='Manual';update()});
  b.querySelectorAll('.gross').forEach(x=>x.onchange=e=>{let r=state.rows[+e.target.dataset.i];r.gross=num(e.target.value);render()});
  b.querySelectorAll('.tax').forEach(x=>x.onchange=e=>{let r=state.rows[+e.target.dataset.i];r.sourceTax=num(e.target.value);render()});
  update();
}
function update(){
  let gross=0,src=0,terv=0,diff=0,matched=0,errs=cfgErrors(),etc=0;
  state.rows.forEach((r,i)=>{recalc(r);gross+=r.gross;src+=r.sourceTax;if(r.terTax!=null){terv+=r.terTax;diff+=r.diff||0}if(r.nik&&r.ptkp)matched++;if(r.facility==='ETC')etc++;rowErrors(r).forEach(x=>errs.push(`Baris ${i+1} ${r.name}: ${x}`))});
  $('kpiRows').textContent=state.rows.length;$('kpiGross').textContent=money(gross);$('kpiSource').textContent=money(src);$('kpiTer').textContent=money(terv);$('kpiDiff').textContent=money(diff);$('matchBadge').textContent=`${matched}/${state.rows.length} NIK+PTKP lengkap`;
  let box=$('validationBox');if(errs.length){box.className='validation error';box.innerHTML='<b>Belum dapat membuat XML.</b><br>'+errs.slice(0,12).map(xe).join('<br>')+(errs.length>12?`<br>… dan ${errs.length-12} masalah lain.`:'')}else if(etc){box.className='validation';box.innerHTML=`<b>Data lengkap.</b> ${etc} baris menggunakan fasilitas <b>ETC</b> karena PPh sumber berbeda dari PPh TER. Tarif XML dibatasi 2 desimal dan dipilih yang paling mendekati PPh sumber.`}else{box.className='validation success';box.innerHTML='<b>Data lengkap.</b> Seluruh PPh sumber sesuai perhitungan TER.'}
  $('downloadXml').disabled=errs.length>0;$('downloadCsv').disabled=!state.rows.length;
}
function conf(){return{tin:digits($('tin').value),tku:digits($('withholderTku').value),month:+$('month').value,year:+$('year').value,date:txt($('withholdingDate').value).slice(0,10)}}
function xml(){
  let c=conf(),items=state.rows.map(r=>{recalc(r);return`    <MmPayroll>
      <TaxPeriodMonth>${c.month}</TaxPeriodMonth>
      <TaxPeriodYear>${c.year}</TaxPeriodYear>
      <CounterpartOpt>Resident</CounterpartOpt>
      <CounterpartPassport></CounterpartPassport>
      <CounterpartTin>${xe(r.nik)}</CounterpartTin>
      <StatusTaxExemption>${xe(r.ptkp)}</StatusTaxExemption>
      <Position>${xe(r.position||'-')}</Position>
      <TaxCertificate>${xe(r.facility)}</TaxCertificate>
      <TaxObjectCode>21-100-01</TaxObjectCode>
      <Gross>${Math.round(r.gross)}</Gross>
      <Rate>${Number(r.xmlRate).toFixed(2)}</Rate>
      <IDPlaceOfBusinessActivity>${xe(c.tku)}</IDPlaceOfBusinessActivity>
      <WithholdingDate>${c.date}</WithholdingDate>
    </MmPayroll>`}).join('\n');
  return`<?xml version="1.0" encoding="UTF-8"?>
<MmPayrollBulk>
  <TIN>${xe(c.tin)}</TIN>
  <ListOfMmPayroll>
${items}
  </ListOfMmPayroll>
</MmPayrollBulk>
`}
function dl(name,content,type){let b=new Blob([content],{type}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},0)}
function csv(){let h=['No','Nama','NIP','Jabatan','NIK','Sumber NIK','PTKP','Sumber PTKP','Bruto','PPh Sumber','Kategori TER','Tarif TER','PPh TER','Selisih','Fasilitas','Tarif XML','PPh XML','Deviasi XML'];let esc=v=>{let s=String(v??'');return/[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};let rows=state.rows.map(r=>{recalc(r);return[r.no,r.name,r.nip,r.position,r.nik,r.nikSource,r.ptkp,r.ptkpSource,r.gross,r.sourceTax,r.terCat,r.terRate,r.terTax,r.diff,r.facility,r.xmlRate,r.xmlTax,r.xmlResidual]});dl('Rekonsiliasi_BPMP.csv','\uFEFF'+[h,...rows].map(r=>r.map(esc).join(';')).join('\r\n'),'text/csv;charset=utf-8')}
async function loadSource(file){try{$('fileInfo').classList.remove('hidden');$('fileInfo').textContent='Membaca '+file.name+'…';let p=parseWorkbook(await file.arrayBuffer());state.rows=p.rows;state.fileName=file.name;$('fileInfo').textContent=`${file.name} • ${p.rows.length} baris • format ${p.format==='wamen'?'WAMEN':'Tukin tabel'} • sheet ${p.sheet}`;render()}catch(e){state.rows=[];$('configCard').classList.add('hidden');$('resultCard').classList.add('hidden');$('fileInfo').classList.remove('hidden');$('fileInfo').textContent='Gagal: '+e.message}}
function parseDbWorkbook(ab){
  const wb=XLSX.read(ab,{type:'array'}), recs=[];
  for(const sn of wb.SheetNames){if(nrm(sn)==='PTKP')continue;let d=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,defval:'',raw:true}),hi=-1,h=[];for(let i=0;i<Math.min(8,d.length);i++){let q=(d[i]||[]).map(nrm);if(q.includes('NAMA')&&q.includes('NIK')){hi=i;h=q;break}}if(hi<0)continue;let idx=x=>h.indexOf(x), nip=idx('NIP'),name=idx('NAMA'),pos=idx('JABATAN'),nik=idx('NIK'),pk=h.findIndex(x=>x==='STATUS KAWIN'||x==='STATUS PAJAK'||x==='STSPAJAK');for(let i=hi+1;i<d.length;i++){let a=d[i],nm=txt(a[name]);if(!nm)continue;recs.push({sheet:sn,nip:nip>=0?digits(a[nip]):'',name:nm,position:pos>=0?txt(a[pos]):'',nik:nik>=0&&/^\d{16}$/.test(digits(a[nik]))?digits(a[nik]):'',ptkp:pk>=0?ptkp(a[pk]):''})}}
  return recs;
}
async function loadDb(file){try{let r=parseDbWorkbook(await file.arrayBuffer());if(!r.length)throw Error('Tidak ada data pegawai yang dikenali.');state.db=r;state.dbName=file.name;$('dbInfo').textContent=`${file.name} • ${r.length} record referensi`;if(state.rows.length){state.rows.forEach(r=>fillMissing(r));render()}}catch(e){$('dbInfo').textContent='Database gagal dibaca: '+e.message}}
for(let i=1;i<=12;i++)$('month').insertAdjacentHTML('beforeend',`<option value="${i}">${i}</option>`);let now=new Date();$('month').value=now.getMonth()+1;$('year').value=now.getFullYear();$('withholdingDate').value=new Date(now-now.getTimezoneOffset()*60000).toISOString().slice(0,10);$('dbInfo').textContent=`_filexport_coretax.xlsx • ${state.db.length} record referensi tertanam`;
$('fileInput').onchange=e=>e.target.files[0]&&loadSource(e.target.files[0]);$('dbFileInput').onchange=e=>e.target.files[0]&&loadDb(e.target.files[0]);
let dz=$('dropZone');['dragenter','dragover'].forEach(v=>dz.addEventListener(v,e=>{e.preventDefault();dz.classList.add('drag')}));['dragleave','drop'].forEach(v=>dz.addEventListener(v,e=>{e.preventDefault();dz.classList.remove('drag')}));dz.addEventListener('drop',e=>e.dataTransfer.files[0]&&loadSource(e.dataTransfer.files[0]));
['tin','withholderTku','month','year','withholdingDate'].forEach(id=>$(id).addEventListener('input',update));
$('downloadXml').onclick=()=>{update();if(!$('downloadXml').disabled){let c=conf();dl(`BPMP_${c.year}_${String(c.month).padStart(2,'0')}.xml`,xml(),'application/xml;charset=utf-8')}};
$('downloadCsv').onclick=csv;$('resetBtn').onclick=()=>{state.rows=[];$('fileInput').value='';$('fileInfo').classList.add('hidden');$('configCard').classList.add('hidden');$('resultCard').classList.add('hidden')};
})();