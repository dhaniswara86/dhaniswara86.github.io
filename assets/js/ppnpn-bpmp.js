(() => {
  'use strict';

  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const $ = (id) => document.getElementById(id);
  const PTKP_MAP = {'1000':'TK/0','1001':'TK/1','1002':'TK/2','1003':'TK/3','1100':'K/0','1101':'K/1','1102':'K/2','1103':'K/3'};
  const PTKP_VALUES = ['TK/0','TK/1','TK/2','TK/3','K/0','K/1','K/2','K/3','HB/0','HB/1','HB/2','HB/3'];
  const TER_A = new Set(['TK/0','TK/1','K/0','HB/0','HB/1']);
  const TER_B = new Set(['TK/2','TK/3','K/1','K/2','HB/2','HB/3']);
  const TER_C = new Set(['K/3']);

  const TABLE_A = [[5400000,0],[5650000,.25],[5950000,.5],[6300000,.75],[6750000,1],[7500000,1.25],[8550000,1.5],[9650000,1.75],[10050000,2],[10350000,2.25],[10700000,2.5],[11050000,3],[11600000,3.5],[12500000,4],[13750000,5],[15100000,6],[16950000,7],[19750000,8],[24150000,9],[26450000,10],[28000000,11],[30050000,12],[32400000,13],[35400000,14],[39100000,15],[43850000,16],[47800000,17],[51400000,18],[56300000,19],[62200000,20],[68600000,21],[77500000,22],[89000000,23],[103000000,24],[125000000,25],[157000000,26],[206000000,27],[337000000,28],[454000000,29],[550000000,30],[695000000,31],[910000000,32],[1400000000,33],[Infinity,34]];
  const TABLE_B = [[6200000,0],[6500000,.25],[6850000,.5],[7300000,.75],[9200000,1],[10750000,1.5],[11250000,2],[11600000,2.5],[12600000,3],[13600000,4],[14950000,5],[16400000,6],[18450000,7],[21850000,8],[26000000,9],[27700000,10],[29350000,11],[31450000,12],[33950000,13],[37100000,14],[41100000,15],[45800000,16],[49500000,17],[53800000,18],[58500000,19],[64000000,20],[71000000,21],[80000000,22],[93000000,23],[109000000,24],[129000000,25],[163000000,26],[211000000,27],[374000000,28],[459000000,29],[555000000,30],[704000000,31],[957000000,32],[1405000000,33],[Infinity,34]];
  const TABLE_C = [[6600000,0],[6950000,.25],[7350000,.5],[7800000,.75],[8850000,1],[9800000,1.25],[10950000,1.5],[11200000,1.75],[12050000,2],[12950000,3],[14150000,4],[15550000,5],[17050000,6],[19500000,7],[22700000,8],[26600000,9],[28100000,10],[30100000,11],[32600000,12],[35400000,13],[38900000,14],[43000000,15],[47400000,16],[51200000,17],[55800000,18],[60400000,19],[66700000,20],[74500000,21],[83200000,22],[95600000,23],[110000000,24],[134000000,25],[169000000,26],[221000000,27],[390000000,28],[463000000,29],[561000000,30],[709000000,31],[965000000,32],[1419000000,33],[Infinity,34]];

  let rows = [];
  let pdfMeta = {};

  function rupiah(n){ return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(n)||0); }
  function esc(s){ return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[m])); }
  function digits(s){ return String(s??'').replace(/\D/g,''); }
  function parseMoney(s){
    if (typeof s === 'number') return s;
    let t=String(s??'').trim(); if(!t) return 0;
    t=t.replace(/Rp\s*/gi,'').replace(/\s+/g,'');
    if(/^\d{1,3}(\.\d{3})+$/.test(t)) return Number(t.replace(/\./g,''));
    if(/^\d{1,3}(,\d{3})+$/.test(t)) return Number(t.replace(/,/g,''));
    t=t.replace(/[^0-9,.-]/g,'');
    if(t.includes(',')&&!t.includes('.')) t=t.replace(',','.');
    else if(t.includes(',')&&t.includes('.')) t=t.replace(/\./g,'').replace(',','.');
    const n=Number(t); return Number.isFinite(n)?n:0;
  }
  function monthNum(name){ const m={JANUARI:1,FEBRUARI:2,MARET:3,APRIL:4,MEI:5,JUNI:6,JULI:7,AGUSTUS:8,SEPTEMBER:9,OKTOBER:10,NOVEMBER:11,DESEMBER:12}; return m[String(name).toUpperCase()]||null; }
  function category(ptkp){ if(TER_A.has(ptkp)) return 'A'; if(TER_B.has(ptkp)) return 'B'; if(TER_C.has(ptkp)) return 'C'; return ''; }
  function terRate(gross,ptkp){ const c=category(ptkp); const table=c==='A'?TABLE_A:c==='B'?TABLE_B:c==='C'?TABLE_C:null; if(!table)return 0; for(const [max,rate] of table){ if(gross<=max)return rate; } return 34; }
  function taxByRate(gross,rate){ return Math.round((gross*rate)/100); }
  function bestRate2(gross,target){
    if(gross<=0) return {rate:0,tax:0,diff:Math.abs(target)};
    const exact=target/gross*100;
    const center=Math.round(exact*100)/100;
    const candidates=[];
    for(let i=-5;i<=5;i++){ const r=Math.max(0, Math.round((center+i/100)*100)/100); candidates.push(r); }
    let best=null;
    for(const rate of [...new Set(candidates)]){
      const tax=taxByRate(gross,rate); const diff=Math.abs(tax-target);
      if(!best || diff<best.diff || (diff===best.diff && Math.abs(rate-exact)<Math.abs(best.rate-exact))) best={rate,tax,diff};
    }
    return best;
  }

  function fillMonths(){ $('month').innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join(''); const d=new Date(); $('month').value=d.getMonth()+1; $('year').value=d.getFullYear(); $('withholdingDate').value=d.toISOString().slice(0,10); }

  async function extractPdf(file){
    const buf=await file.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise;
    const lines=[];
    for(let p=1;p<=pdf.numPages;p++){
      const page=await pdf.getPage(p); const content=await page.getTextContent();
      const items=content.items.map(x=>({str:x.str.trim(),x:x.transform[4],y:x.transform[5]})).filter(x=>x.str);
      const groups=[];
      items.sort((a,b)=>b.y-a.y || a.x-b.x);
      for(const item of items){ let g=groups.find(gr=>Math.abs(gr.y-item.y)<2.5); if(!g){g={y:item.y,items:[]};groups.push(g);} g.items.push(item); }
      groups.sort((a,b)=>b.y-a.y).forEach(g=>{ g.items.sort((a,b)=>a.x-b.x); lines.push(g.items.map(i=>i.str).join(' ').replace(/\s+/g,' ').trim()); });
    }
    return lines;
  }

  function parseMeta(lines){
    const text=lines.join('\n');
    const sat=(text.match(/SATUAN\s+KERJA\s*:\s*([^\n]+)/i)||[])[1]?.trim()||'';
    const anak=(text.match(/ANAK\s+SATKER\s*:\s*([^\n]+)/i)||[])[1]?.trim()||'';
    const dpp=(text.match(/No\.?\s*DPP\s*:\s*([A-Za-z0-9\-/]+)/i)||[])[1]||'';
    const period=text.match(/BULAN\s*:\s*([A-Z]+)\s+(20\d{2})/i);
    return {satker:sat,anakSatker:anak,dpp,month:period?monthNum(period[1]):null,year:period?Number(period[2]):null};
  }

  function parseRows(lines, meta){
    const out=[];

    // Pola utama DPP PPNPN: baris penerima diawali nomor urut, nama,
    // kode status 1000–1003/1100–1103, lalu nilai rupiah; NIK biasanya
    // tercetak pada baris berikutnya karena satu sel PDF terdiri dari beberapa baris.
    for(let li=0; li<lines.length; li++){
      const line=lines[li].replace(/\s+/g,' ').trim();
      const statusMatch=line.match(/\b(100[0-3]|110[0-3])\b/);
      if(!/^\d+\s+/.test(line) || !statusMatch) continue;

      const firstAmount=line.match(/\b\d{1,3}(?:\.\d{3}){1,}\b/);
      if(!firstAmount) continue;

      const status=statusMatch[1];
      const prefix=line.slice(0,statusMatch.index).replace(/^\d+\s+/,'').trim();
      const name=prefix || `Penerima ${out.length+1}`;
      const moneyPart=line.slice(firstAmount.index);
      const amountTokens=(moneyPart.match(/\b(?:\d{1,3}(?:\.\d{3})+|0)\b/g)||[]).map(parseMoney);
      const gross=amountTokens[0]||0;
      const pph=amountTokens.length>=3 ? (amountTokens[2]||0) : 0;

      // Cari NIK pada baris saat ini atau beberapa baris setelahnya.
      let nik=(line.match(/\b\d{16}\b/)||[])[0]||'';
      if(!nik){
        for(let j=li+1; j<Math.min(lines.length,li+4); j++){
          const m=lines[j].match(/\b\d{16}\b/);
          if(m){ nik=m[0]; break; }
        }
      }

      if(gross>0){
        out.push({name,nik,ptkp:PTKP_MAP[status]||'',statusCode:status,position:$('defaultPosition').value||'PPNPN',gross,sourceTax:pph});
      }
    }

    // Fallback berbasis keseluruhan teks untuk PDF satu baris/susunan teks tidak standar.
    if(!out.length){
      const text=lines.join(' ');
      const nik=(text.match(/\b(\d{16})\b/)||[])[1]||'';
      const status=(text.match(/\b(100[0-3]|110[0-3])\b/)||[])[1]||'';
      const rowMatch=text.match(/\b\d+\s+([A-Z][A-Z\s]{4,80}?)\s+(100[0-3]|110[0-3])\b/i);
      const name=rowMatch?rowMatch[1].trim():'Penerima PPNPN';
      const amountStrings=text.match(/\b\d{1,3}(?:\.\d{3})+\b/g)||[];
      const money=amountStrings.map(parseMoney);
      const gross=money.find(n=>n>1000000)||0;
      let pph=0;
      if(gross){
        const gi=money.indexOf(gross);
        // Pada format DPP: gross, tunjangan PPh, potongan PPh.
        if(gi>=0 && money[gi+2]!==undefined) pph=money[gi+2];
      }
      if(nik&&status&&gross) out.push({name,nik,ptkp:PTKP_MAP[status]||'',statusCode:status,position:$('defaultPosition').value||'PPNPN',gross,sourceTax:pph});
    }
    return out;
  }

  function enrich(r){
    const rate=terRate(r.gross,r.ptkp); const terTax=taxByRate(r.gross,rate); const diff=(r.sourceTax||0)-terTax;
    let facility='N/A', xmlRate=rate, xmlTax=terTax, xmlDiff=0;
    if(diff!==0){ facility='ECT'; const b=bestRate2(r.gross,r.sourceTax||0); xmlRate=b.rate; xmlTax=b.tax; xmlDiff=xmlTax-(r.sourceTax||0); }
    const errors=[];
    if(!/^\d{16}$/.test(r.nik||'')) errors.push('NIK harus 16 digit');
    if(!PTKP_VALUES.includes(r.ptkp)) errors.push('PTKP tidak valid');
    if(!(r.gross>0)) errors.push('Bruto harus > 0');
    if(!r.position?.trim()) errors.push('Posisi wajib diisi');
    return {...r,category:category(r.ptkp),terRate:rate,terTax,diff,facility,xmlRate,xmlTax,xmlDiff,errors};
  }

  function render(){
    rows=rows.map(enrich);
    const body=$('resultBody');
    body.innerHTML=rows.map((r,i)=>{
      const ptkpOpts=PTKP_VALUES.map(v=>`<option ${v===r.ptkp?'selected':''}>${v}</option>`).join('');
      const status=r.errors.length?`<span class="pill bad">Error</span>`:r.diff===0?`<span class="pill ok">Sesuai</span>`:`<span class="pill warn">ECT</span>`;
      return `<tr data-i="${i}">
        <td>${i+1}</td>
        <td><input class="cell-input name" data-f="name" value="${esc(r.name)}"></td>
        <td><input class="cell-input" data-f="nik" inputmode="numeric" maxlength="16" value="${esc(r.nik)}"></td>
        <td><select class="cell-select" data-f="ptkp">${ptkpOpts}</select></td>
        <td><input class="cell-input position" data-f="position" value="${esc(r.position)}"></td>
        <td class="num"><input class="cell-input num-edit" data-f="gross" inputmode="numeric" value="${r.gross}"></td>
        <td>${r.category?`TER ${r.category}`:'—'}</td><td class="num">${r.terRate.toFixed(2)}%</td>
        <td class="num"><input class="cell-input num-edit" data-f="sourceTax" inputmode="numeric" value="${r.sourceTax}"></td>
        <td class="num">${rupiah(r.terTax)}</td><td class="num">${rupiah(r.diff)}</td>
        <td>${r.facility}</td><td class="num">${r.xmlRate.toFixed(2)}%</td><td class="num">${rupiah(r.xmlTax)}</td><td class="num">${rupiah(r.xmlDiff)}</td>
        <td>${status}${r.errors.length?`<div style="margin-top:5px;color:#bd2727;font-size:11px">${esc(r.errors.join('; '))}</div>`:''}</td>
      </tr>`;
    }).join('');

    body.querySelectorAll('input,select').forEach(el=>el.addEventListener('change',()=>{
      const tr=el.closest('tr'), i=Number(tr.dataset.i), f=el.dataset.f;
      rows[i][f]=(f==='gross'||f==='sourceTax')?parseMoney(el.value):el.value.trim(); render();
    }));

    const totalGross=rows.reduce((s,r)=>s+(r.gross||0),0), totalSrc=rows.reduce((s,r)=>s+(r.sourceTax||0),0), totalTer=rows.reduce((s,r)=>s+r.terTax,0);
    $('kpiRows').textContent=rows.length; $('kpiGross').textContent=rupiah(totalGross); $('kpiSourceTax').textContent=rupiah(totalSrc); $('kpiTerTax').textContent=rupiah(totalTer); $('kpiDiff').textContent=rupiah(totalSrc-totalTer);
    const globalErrors=validateConfig(); const rowErrors=rows.flatMap((r,i)=>r.errors.map(e=>`Baris ${i+1}: ${e}`)); const all=[...globalErrors,...rowErrors];
    const box=$('validationBox'); box.className='validation'+(all.length?' bad':''); box.textContent=all.length?all.join(' • '):'Validasi selesai. Data siap dibuat menjadi XML BPMP.';
    $('downloadXml').disabled=!!all.length || !rows.length; $('downloadCsv').disabled=!rows.length;
  }

  function validateConfig(){
    const e=[]; const tin=digits($('tin').value), tku=digits($('withholderTku').value);
    if(!/^\d{15,16}$/.test(tin)) e.push('NPWP Pemotong harus 15–16 digit');
    if(!/^\d{22}$/.test(tku)) e.push('ID TKU Pemotong harus 22 digit');
    if(!$('month').value||!$('year').value) e.push('Masa dan tahun pajak wajib diisi');
    if(!$('withholdingDate').value) e.push('Tanggal pemotongan wajib diisi');
    return e;
  }

  function xml(){
    const tin=digits($('tin').value), tku=digits($('withholderTku').value), month=Number($('month').value), year=Number($('year').value), wd=$('withholdingDate').value;
    const nodes=rows.map(r=>`    <MmPayroll>\n      <TaxPeriodMonth>${month}</TaxPeriodMonth>\n      <TaxPeriodYear>${year}</TaxPeriodYear>\n      <CounterpartOpt>Resident</CounterpartOpt>\n      <CounterpartPassport/>\n      <CounterpartTin>${esc(r.nik)}</CounterpartTin>\n      <StatusTaxExemption>${esc(r.ptkp)}</StatusTaxExemption>\n      <Position>${esc(r.position)}</Position>\n      <TaxCertificate>${r.facility}</TaxCertificate>\n      <TaxObjectCode>21-100-01</TaxObjectCode>\n      <Gross>${Math.round(r.gross)}</Gross>\n      <Rate>${r.xmlRate.toFixed(2)}</Rate>\n      <IDPlaceOfBusinessActivity>${tku}</IDPlaceOfBusinessActivity>\n      <WithholdingDate>${wd}</WithholdingDate>\n    </MmPayroll>`).join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<MmPayrollBulk>\n  <TIN>${tin}</TIN>\n  <ListOfMmPayroll>\n${nodes}\n  </ListOfMmPayroll>\n</MmPayrollBulk>\n`;
  }
  function download(name,content,type){ const b=new Blob([content],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500); }
  function csv(){ const h=['Nama','NIK','PTKP','Posisi','Bruto','Kategori TER','Tarif TER','PPh DPP','PPh TER','Selisih','Fasilitas XML','Tarif XML','PPh XML','Deviasi XML']; const q=v=>`"${String(v??'').replace(/"/g,'""')}"`; return [h,...rows.map(r=>[r.name,r.nik,r.ptkp,r.position,r.gross,`TER ${r.category}`,r.terRate,r.sourceTax,r.terTax,r.diff,r.facility,r.xmlRate,r.xmlTax,r.xmlDiff])].map(x=>x.map(q).join(';')).join('\n'); }

  async function handleFile(file){
    if(!file||file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf')) return alert('Pilih file PDF.');
    $('fileInfo').classList.remove('hidden'); $('fileInfo').textContent=`Membaca ${file.name}…`;
    try{
      const lines=await extractPdf(file); pdfMeta=parseMeta(lines); rows=parseRows(lines,pdfMeta);
      if(pdfMeta.month) $('month').value=pdfMeta.month; if(pdfMeta.year) $('year').value=pdfMeta.year;
      $('metaSatker').textContent=pdfMeta.satker||'Tidak terdeteksi'; $('metaAnak').textContent=pdfMeta.anakSatker||'Tidak terdeteksi'; $('metaDpp').textContent=pdfMeta.dpp||'Tidak terdeteksi'; $('metaPeriod').textContent=(pdfMeta.month&&pdfMeta.year)?`${pdfMeta.month}/${pdfMeta.year}`:'Tidak terdeteksi';
      $('metaCard').classList.remove('hidden'); $('resultCard').classList.remove('hidden');
      $('fileInfo').textContent=`${file.name} • ${rows.length} baris penerima terdeteksi. Periksa tabel rekonsiliasi.`;
      render();
    }catch(err){ console.error(err); $('fileInfo').textContent='Gagal membaca PDF.'; alert('PDF tidak dapat diproses. Coba pastikan file bukan hasil scan gambar murni.'); }
  }

  fillMonths();
  const fi=$('fileInput'), dz=$('dropZone');
  fi.addEventListener('change',e=>handleFile(e.target.files[0]));
  ['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.add('drag')}));
  ['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault();dz.classList.remove('drag')}));
  dz.addEventListener('drop',e=>handleFile(e.dataTransfer.files[0]));
  ['tin','withholderTku','month','year','withholdingDate'].forEach(id=>$(id).addEventListener('change',()=>rows.length&&render()));
  $('downloadXml').addEventListener('click',()=>download(`BPMP_PPNPN_${$('year').value}_${String($('month').value).padStart(2,'0')}.xml`,xml(),'application/xml;charset=utf-8'));
  $('downloadCsv').addEventListener('click',()=>download(`Rekonsiliasi_PPNPN_${$('year').value}_${String($('month').value).padStart(2,'0')}.csv`,`\ufeff${csv()}`,'text/csv;charset=utf-8'));
  $('resetBtn').addEventListener('click',()=>location.reload());
})();
