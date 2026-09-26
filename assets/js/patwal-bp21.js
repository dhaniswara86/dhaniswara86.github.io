(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const state = { rows: [], fileName: '' };
  const ptkpMap = {
    '1000':'TK/0','1001':'TK/1','1002':'TK/2','1003':'TK/3',
    '1100':'K/0','1101':'K/1','1102':'K/2','1103':'K/3'
  };

  const taxByGrade = grade => {
    const s = String(grade ?? '').trim().toUpperCase().replace(/\s+/g,'');
    const m = s.match(/^(?:GOL(?:ONGAN)?\.?|GOL\.?\s*)?([1-4IV]+)(?:[A-Z]|\/.*)?$/i);
    let level = null;
    if (m) {
      const x = m[1].toUpperCase();
      level = ({I:1,II:2,III:3,IV:4,'1':1,'2':2,'3':3,'4':4})[x] ?? null;
    } else {
      const first = s.match(/[1-4]/)?.[0];
      if (first) level = Number(first);
    }
    if (level === 1 || level === 2) return {code:'21-402-04', rate:0, label:'Gol. I–II'};
    if (level === 3) return {code:'21-402-02', rate:5, label:'Gol. III'};
    if (level === 4) return {code:'21-402-03', rate:15, label:'Gol. IV'};
    return {code:'', rate:null, label:'Tidak dikenali'};
  };

  const money = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:2}).format(Number(n||0));
  const num = v => {
    if (typeof v === 'number') return v;
    const s = String(v ?? '').trim().replace(/[^0-9,.-]/g,'').replace(/\.(?=\d{3}(?:\D|$))/g,'').replace(',','.');
    const n = Number(s); return Number.isFinite(n) ? n : 0;
  };
  const txt = v => String(v ?? '').trim();
  const digits = v => txt(v).replace(/\D/g,'');
  const xmlEscape = s => txt(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
  const iso = v => txt(v);

  function normalizeHeader(v){ return txt(v).toLowerCase().replace(/[^a-z0-9]/g,''); }
  function findHeaderRow(data){
    const wanted = ['nama','nik','golongan'];
    for(let r=0;r<Math.min(data.length,25);r++){
      const hs=data[r].map(normalizeHeader);
      if(wanted.every(x=>hs.includes(x)) && hs.some(x=>['nilaikotor','penghasilan','bruto'].includes(x))) return r;
    }
    return -1;
  }
  function colMap(headers){
    const m={}; headers.forEach((h,i)=>m[normalizeHeader(h)]=i);
    const pick=(...names)=>{for(const n of names){if(m[n]!==undefined)return m[n];}return -1;};
    return {
      no:pick('no','nomor'), name:pick('nama','namapegawai'), nip:pick('nip'), nik:pick('nik','npwp'),
      grade:pick('golongan','gol'), marital:pick('statuskawin','statusperkawinan','statusptkp'),
      gross:pick('nilaikotor','penghasilan','bruto','penghasilanbruto'), tax:pick('pajak','pph','pph21','pphterutang')
    };
  }

  function parseWorkbook(arrayBuffer){
    if(typeof XLSX==='undefined') throw new Error('Library Excel belum termuat. Pastikan perangkat terhubung internet saat membuka halaman ini.');
    const wb=XLSX.read(arrayBuffer,{type:'array',raw:false});
    const ws=wb.Sheets[wb.SheetNames[0]];
    const data=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false});
    const hr=findHeaderRow(data); if(hr<0) throw new Error('Header nominatif tidak dikenali. Pastikan ada kolom Nama, NIK, Golongan, Nilai Kotor/Penghasilan, dan Pajak.');
    const cm=colMap(data[hr]);
    const required=['name','nik','grade','gross','tax'];
    const miss=required.filter(k=>cm[k]<0); if(miss.length) throw new Error('Kolom wajib belum ditemukan: '+miss.join(', '));
    const out=[];
    for(let r=hr+1;r<data.length;r++){
      const row=data[r];
      const name=txt(row[cm.name]); const nik=digits(row[cm.nik]);
      if(!name && !nik) continue;
      if(name.toLowerCase()==='total') continue;
      const grade=txt(row[cm.grade]); const statusRaw=cm.marital>=0?txt(row[cm.marital]):'';
      const ptkp=ptkpMap[statusRaw] || (['TK/0','TK/1','TK/2','TK/3','K/0','K/1','K/2','K/3'].includes(statusRaw.toUpperCase())?statusRaw.toUpperCase():'');
      const rule=taxByGrade(grade); const gross=num(row[cm.gross]); const nomTax=num(row[cm.tax]);
      const deemed=100; const calcTax=rule.rate===null?0:gross*deemed/100*rule.rate/100; const diff=nomTax-calcTax;
      const errors=[]; if(nik.length!==16) errors.push('NIK harus 16 digit'); if(!ptkp) errors.push('Status PTKP tidak dikenali'); if(rule.rate===null) errors.push('Golongan tidak dikenali'); if(!(gross>0)) errors.push('Bruto harus > 0');
      out.push({sourceRow:r+1,no:cm.no>=0?txt(row[cm.no]):String(out.length+1),name,nip:cm.nip>=0?txt(row[cm.nip]):'',nik,grade,statusRaw,ptkp,gross,nomTax,deemed,code:rule.code,rate:rule.rate,calcTax,diff,recipientTku:nik.length===16?nik+'000000':'',errors});
    }
    if(!out.length) throw new Error('Tidak ada baris data yang dapat diproses.');
    return out;
  }

  function validateConfig(){
    const errors=[];
    const tin=digits($('tin').value), tku=digits($('withholderTku').value);
    if(!/^\d{15,16}$/.test(tin)) errors.push('NPWP Pemotong harus 15–16 digit.');
    if(!/^\d{22}$/.test(tku)) errors.push('ID TKU Pemotong harus 22 digit.');
    if(!$('documentNumber').value.trim()) errors.push('Nomor Dokumen Referensi wajib diisi.');
    if(!$('documentDate').value) errors.push('Tanggal Dokumen wajib diisi.');
    if(!$('withholdingDate').value) errors.push('Tanggal Pemotongan wajib diisi.');
    return errors;
  }

  function render(){
    $('summaryCard').classList.remove('hidden'); const body=$('resultBody'); body.innerHTML='';
    let totalNom=0,totalCalc=0,totalDiff=0, structural=0, mismatch=0;
    state.rows.forEach((r,i)=>{
      totalNom+=r.nomTax; totalCalc+=r.calcTax; totalDiff+=r.diff; structural+=r.errors.length?1:0; if(Math.abs(r.diff)>0.009)mismatch++;
      const status=r.errors.length?'<span class="badge err">Error</span>':Math.abs(r.diff)<=0.009?'<span class="badge ok">Sesuai</span>':'<span class="badge warn">Selisih</span>';
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${xmlEscape(r.no||i+1)}</td><td>${xmlEscape(r.name)}</td><td>${xmlEscape(r.nik)}</td><td>${xmlEscape(r.grade)}</td><td>${xmlEscape(r.ptkp||'-')}</td><td>${xmlEscape(r.code||'-')}</td><td class="num">${money(r.gross)}</td><td class="num">${r.rate===null?'-':r.rate+'%'}</td><td class="num">${money(r.nomTax)}</td><td class="num">${money(r.calcTax)}</td><td class="num">${money(r.diff)}</td><td>${status}${r.errors.length?'<br><small>'+xmlEscape(r.errors.join('; '))+'</small>':''}</td><td><input class="inline" data-i="${i}" value="${xmlEscape(r.recipientTku)}" maxlength="22" /></td>`;
      body.appendChild(tr);
    });
    body.querySelectorAll('input[data-i]').forEach(inp=>inp.addEventListener('input',e=>{ state.rows[+e.target.dataset.i].recipientTku=digits(e.target.value); updateValidation(); }));
    $('kpiRows').textContent=state.rows.length; $('kpiNom').textContent=money(totalNom); $('kpiCalc').textContent=money(totalCalc); $('kpiDiff').textContent=money(totalDiff);
    updateValidation(mismatch,structural);
  }

  function updateValidation(){
    const configErrors=validateConfig();
    const rowErrors=[];
    state.rows.forEach((r,i)=>{
      if(r.errors.length) rowErrors.push(`Baris ${r.sourceRow}: ${r.errors.join(', ')}`);
      if(!/^\d{22}$/.test(r.recipientTku)) rowErrors.push(`Baris ${r.sourceRow}: ID TKU penerima harus 22 digit`);
    });
    const mismatches=state.rows.filter(r=>Math.abs(r.diff)>0.009).length;
    const all=[...configErrors,...rowErrors]; const box=$('validationBox');
    if(all.length){ box.className='validation error'; box.innerHTML=`<b>Belum dapat generate XML.</b><br>${all.slice(0,8).map(xmlEscape).join('<br>')}${all.length>8?`<br>… dan ${all.length-8} error lain.`:''}`; }
    else if(mismatches){ box.className='validation'; box.innerHTML=`<b>Struktur valid, tetapi ada ${mismatches} baris dengan selisih PPh.</b> XML tetap dapat dibuat karena BP21 membawa bruto, deemed, dan tarif; telaah selisih sebelum diunggah.`; }
    else { box.className='validation success'; box.innerHTML='<b>Validasi selesai.</b> Semua baris siap dibuat menjadi XML BP21.'; }
    $('downloadXml').disabled=all.length>0; $('downloadReconciliation').disabled=state.rows.length===0;
  }

  function config(){ return {tin:digits($('tin').value),withholderTku:digits($('withholderTku').value),month:+$('month').value,year:+$('year').value,facility:$('facility').value,document:$('documentType').value,documentNumber:$('documentNumber').value.trim(),documentDate:iso($('documentDate').value),withholdingDate:iso($('withholdingDate').value)}; }
  function buildXml(){
    const c=config();
    const items=state.rows.map(r=>`    <Bp21>\n      <TaxPeriodMonth>${c.month}</TaxPeriodMonth>\n      <TaxPeriodYear>${c.year}</TaxPeriodYear>\n      <CounterpartTin>${xmlEscape(r.nik)}</CounterpartTin>\n      <IDPlaceOfBusinessActivityOfIncomeRecipient>${xmlEscape(r.recipientTku)}</IDPlaceOfBusinessActivityOfIncomeRecipient>\n      <StatusTaxExemption>${xmlEscape(r.ptkp)}</StatusTaxExemption>\n      <TaxCertificate>${xmlEscape(c.facility)}</TaxCertificate>\n      <TaxObjectCode>${xmlEscape(r.code)}</TaxObjectCode>\n      <Gross>${r.gross}</Gross>\n      <Deemed>${r.deemed}</Deemed>\n      <Rate>${r.rate}</Rate>\n      <Document>${xmlEscape(c.document)}</Document>\n      <DocumentNumber>${xmlEscape(c.documentNumber)}</DocumentNumber>\n      <DocumentDate>${c.documentDate}</DocumentDate>\n      <IDPlaceOfBusinessActivity>${xmlEscape(c.withholderTku)}</IDPlaceOfBusinessActivity>\n      <WithholdingDate>${c.withholdingDate}</WithholdingDate>\n    </Bp21>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<Bp21Bulk>\n  <TIN>${xmlEscape(c.tin)}</TIN>\n  <ListOfBp21>\n${items}\n  </ListOfBp21>\n</Bp21Bulk>\n`;
  }
  function download(name,content,type){ const blob=new Blob([content],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},0); }
  function csvCell(v){ const s=String(v??''); return /[",\n;]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s; }
  function downloadCsv(){
    const hdr=['No','Nama','NIK','Golongan','Status PTKP','Kode BP21','Bruto','Deemed','Tarif','PPh Nominatif','PPh BP21','Selisih','Status','ID TKU Penerima'];
    const rows=state.rows.map(r=>[r.no,r.name,r.nik,r.grade,r.ptkp,r.code,r.gross,r.deemed,r.rate,r.nomTax,r.calcTax,r.diff,r.errors.length?'ERROR':Math.abs(r.diff)<=0.009?'SESUAI':'SELISIH',r.recipientTku]);
    const csv='\uFEFF'+[hdr,...rows].map(x=>x.map(csvCell).join(';')).join('\r\n'); download('Rekonsiliasi_Patwal_BP21.csv',csv,'text/csv;charset=utf-8');
  }

  async function loadFile(file){
    try{ state.fileName=file.name; $('fileInfo').textContent=`Membaca ${file.name}…`; $('fileInfo').classList.remove('hidden'); state.rows=parseWorkbook(await file.arrayBuffer()); $('fileInfo').textContent=`${file.name} • ${state.rows.length} baris data ditemukan`; render(); }
    catch(e){ state.rows=[]; $('summaryCard').classList.add('hidden'); $('fileInfo').textContent='Gagal: '+e.message; $('fileInfo').classList.remove('hidden'); }
  }

  for(let i=1;i<=12;i++) $('month').insertAdjacentHTML('beforeend',`<option value="${i}">${i}</option>`);
  const now=new Date(); $('month').value=now.getMonth()+1; $('year').value=now.getFullYear(); const local=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10); $('documentDate').value=local; $('withholdingDate').value=local;
  $('fileInput').addEventListener('change',e=>e.target.files[0]&&loadFile(e.target.files[0]));
  const dz=$('dropZone'); ['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('drag')})); ['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag')})); dz.addEventListener('drop',e=>e.dataTransfer.files[0]&&loadFile(e.dataTransfer.files[0]));
  ['tin','withholderTku','month','year','facility','documentType','documentNumber','documentDate','withholdingDate'].forEach(id=>$(id).addEventListener('input',updateValidation));
  $('downloadXml').addEventListener('click',()=>{ updateValidation(); if($('downloadXml').disabled)return; const c=config(); download(`BP21_Patwal_${c.year}_${String(c.month).padStart(2,'0')}.xml`,buildXml(),'application/xml;charset=utf-8'); });
  $('downloadReconciliation').addEventListener('click',downloadCsv);
  $('resetBtn').addEventListener('click',()=>{state.rows=[];state.fileName='';$('fileInput').value='';$('fileInfo').classList.add('hidden');$('summaryCard').classList.add('hidden');});
})();
