(() => {
  const TEMPLATE_URL = 'assets/templates/Nominatif Lembur Patwal (v).xlsx';
  const MAP_PTKP = new Map([
    ['1000','TK/0'],['1001','TK/1'],['1002','TK/2'],['1003','TK/3'],
    ['1100','K/0'],['1101','K/1'],['1102','K/2'],['1103','K/3']
  ]);

  const sourceFile = document.getElementById('sourceFile');
  const processBtn = document.getElementById('processBtn');
  const resetBtn = document.getElementById('resetBtn');
  const fileName = document.getElementById('fileName');
  const statusBox = document.getElementById('statusBox');

  function showStatus(message, type='') {
    statusBox.className = `status ${type}`.trim();
    statusBox.innerHTML = message;
  }
  function clearStatus(){ statusBox.className='status hidden'; statusBox.textContent=''; }
  function normalize(v){ return String(v ?? '').trim().toLowerCase().replace(/\s+/g,' '); }
  function cellText(cell){
    const v = cell.value;
    if (v && typeof v === 'object' && 'text' in v) return String(v.text ?? '');
    if (v && typeof v === 'object' && 'result' in v) return String(v.result ?? '');
    return String(v ?? '');
  }
  function rawCellValue(cell){
    const v = cell.value;
    if (v && typeof v === 'object' && 'result' in v) return v.result;
    if (v && typeof v === 'object' && 'text' in v) return v.text;
    return v;
  }
  function cloneStyle(style){ return JSON.parse(JSON.stringify(style || {})); }
  function downloadBlob(buffer, name){
    const blob = new Blob([buffer], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1500);
  }

  function findHeaderRow(ws){
    for(let r=1;r<=Math.min(ws.rowCount,30);r++){
      const values=[];
      for(let c=1;c<=Math.min(ws.columnCount,30);c++) values.push(normalize(cellText(ws.getCell(r,c))));
      if(values.includes('nama') && values.includes('status kawin') && (values.includes('no') || values.includes('nip'))) return r;
    }
    throw new Error('Header Excel 1 tidak ditemukan. Pastikan file menggunakan struktur nominatif yang sesuai.');
  }
  function headerMap(ws,row){
    const out={};
    for(let c=1;c<=ws.columnCount;c++){
      const h=normalize(cellText(ws.getCell(row,c)));
      if(h) out[h]=c;
    }
    return out;
  }
  function col(h, ...names){
    for(const n of names){ if(h[normalize(n)]) return h[normalize(n)]; }
    return null;
  }

  async function convert(file){
    if(typeof ExcelJS === 'undefined') throw new Error('Library Excel belum termuat. Pastikan perangkat terhubung ke internet saat membuka halaman ini.');

    const srcWb = new ExcelJS.Workbook();
    await srcWb.xlsx.load(await file.arrayBuffer());
    const srcWs = srcWb.worksheets[0];
    if(!srcWs) throw new Error('Excel 1 tidak memiliki worksheet.');

    const hr = findHeaderRow(srcWs);
    const hm = headerMap(srcWs, hr);
    const required = {
      no: col(hm,'No'), nama: col(hm,'Nama'), nip: col(hm,'NIP'), spm: col(hm,'no spm'), nik: col(hm,'nik'),
      gol: col(hm,'golongan'), status: col(hm,'status kawin'), rekening: col(hm,'Nama Rekening'), norek: col(hm,'Norek'),
      bank: col(hm,'Nama Bank'), bruto: col(hm,'Nilai Kotor'), pajak: col(hm,'Pajak'), nominal: col(hm,'Nominal Lembur')
    };
    const missing = Object.entries(required).filter(([,v])=>!v).map(([k])=>k);
    if(missing.length) throw new Error(`Kolom Excel 1 belum lengkap: ${missing.join(', ')}.`);

    const rows=[]; const unknown=[];
    for(let r=hr+1;r<=srcWs.rowCount;r++){
      const nama = cellText(srcWs.getCell(r, required.nama)).trim();
      const no = rawCellValue(srcWs.getCell(r, required.no));
      if(normalize(nama)==='total') break;
      if((no===null || no==='') && !nama) continue;
      const statusRaw = cellText(srcWs.getCell(r, required.status)).trim();
      const ptkp = MAP_PTKP.get(statusRaw);
      if(!ptkp) unknown.push(`${nama || `baris ${r}`} (${statusRaw || 'kosong'})`);
      const bruto = Number(rawCellValue(srcWs.getCell(r, required.bruto)) || 0);
      const pajak = Number(rawCellValue(srcWs.getCell(r, required.pajak)) || 0);
      rows.push([
        no,
        rawCellValue(srcWs.getCell(r, required.nama)),
        cellText(srcWs.getCell(r, required.nip)),
        cellText(srcWs.getCell(r, required.spm)),
        cellText(srcWs.getCell(r, required.nik)),
        cellText(srcWs.getCell(r, required.gol)),
        statusRaw,
        ptkp || '',
        rawCellValue(srcWs.getCell(r, required.rekening)),
        cellText(srcWs.getCell(r, required.norek)),
        rawCellValue(srcWs.getCell(r, required.bank)),
        bruto,
        pajak,
        bruto - pajak
      ]);
    }
    if(!rows.length) throw new Error('Tidak ada baris data yang dapat diproses.');
    if(unknown.length) throw new Error(`Ada kode status kawin yang belum dikenali: ${unknown.join('; ')}. File belum dibuat agar output Coretax tidak salah.`);

    const templateResp = await fetch(TEMPLATE_URL, {cache:'no-store'});
    if(!templateResp.ok) throw new Error('Template Excel 2 tidak dapat dimuat. Pastikan file template berada pada folder assets/templates.');
    const outWb = new ExcelJS.Workbook();
    await outWb.xlsx.load(await templateResp.arrayBuffer());
    const outWs = outWb.worksheets[0];
    if(!outWs) throw new Error('Template Excel 2 tidak memiliki worksheet.');

    const templateHeaderRow = 4;
    const firstDataRow = templateHeaderRow + 1;
    let totalRow = 0;
    for(let r=firstDataRow;r<=outWs.rowCount;r++){
      if(normalize(cellText(outWs.getCell(r,2)))==='total'){ totalRow=r; break; }
    }
    if(!totalRow) totalRow = Math.max(firstDataRow+1, outWs.rowCount);

    const dataTemplateStyle = [];
    for(let c=1;c<=14;c++) dataTemplateStyle[c] = cloneStyle(outWs.getCell(firstDataRow,c).style);
    const totalTemplateStyle = [];
    for(let c=1;c<=14;c++) totalTemplateStyle[c] = cloneStyle(outWs.getCell(totalRow,c).style);
    const dataHeight = outWs.getRow(firstDataRow).height;
    const totalHeight = outWs.getRow(totalRow).height;

    // Hapus seluruh area data lama + total, lalu bangun kembali dengan jumlah baris sesuai Excel 1.
    const removeCount = Math.max(1, outWs.rowCount - firstDataRow + 1);
    outWs.spliceRows(firstDataRow, removeCount);

    rows.forEach((vals, i) => {
      const rowNo = firstDataRow + i;
      const row = outWs.getRow(rowNo);
      vals.forEach((v, idx) => {
        const cell = row.getCell(idx+1);
        cell.value = v;
        cell.style = cloneStyle(dataTemplateStyle[idx+1]);
      });
      if(dataHeight) row.height = dataHeight;
      // Kolom yang harus aman sebagai teks panjang.
      row.getCell(3).numFmt='@'; row.getCell(4).numFmt='@'; row.getCell(5).numFmt='@'; row.getCell(10).numFmt='@';
      row.commit();
    });

    const newTotalRowNo = firstDataRow + rows.length;
    const total = outWs.getRow(newTotalRowNo);
    for(let c=1;c<=14;c++) total.getCell(c).style = cloneStyle(totalTemplateStyle[c]);
    total.getCell(2).value='Total';
    total.getCell(12).value=rows.reduce((s,r)=>s+Number(r[11]||0),0);
    total.getCell(13).value=rows.reduce((s,r)=>s+Number(r[12]||0),0);
    total.getCell(14).value=rows.reduce((s,r)=>s+Number(r[13]||0),0);
    if(totalHeight) total.height=totalHeight;
    total.commit();

    // Jangan mengubah header/urutan kolom template Excel 2.
    const buffer = await outWb.xlsx.writeBuffer();
    const base = file.name.replace(/\.xlsx$/i,'');
    downloadBlob(buffer, `${base} - Coretax.xlsx`);
    return {count:rows.length, bruto:rows.reduce((s,r)=>s+r[11],0), pajak:rows.reduce((s,r)=>s+r[12],0)};
  }

  sourceFile.addEventListener('change', () => {
    clearStatus();
    const f=sourceFile.files?.[0];
    fileName.textContent=f ? f.name : 'Belum ada file dipilih';
    processBtn.disabled=!f;
  });

  resetBtn.addEventListener('click', () => {
    sourceFile.value=''; fileName.textContent='Belum ada file dipilih'; processBtn.disabled=true; clearStatus();
  });

  processBtn.addEventListener('click', async () => {
    const f=sourceFile.files?.[0]; if(!f) return;
    processBtn.disabled=true;
    showStatus('Memproses Excel 1 dan membentuk Excel 2 Coretax…');
    try{
      const result=await convert(f);
      showStatus(`<b>Berhasil.</b> ${result.count} baris dipindahkan ke template Excel 2. Total nilai kotor Rp${result.bruto.toLocaleString('id-ID')} dan pajak Rp${result.pajak.toLocaleString('id-ID')}. File Coretax sudah diunduh.`, 'success');
    }catch(err){
      console.error(err); showStatus(`<b>Konversi dihentikan.</b> ${err.message}`, 'error');
    }finally{ processBtn.disabled=false; }
  });
})();
