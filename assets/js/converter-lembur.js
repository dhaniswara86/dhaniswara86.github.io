(() => {
  'use strict';

  const TEMPLATE_URL = 'assets/templates/nominatif-lembur-template.xlsx';
  const PTKP_MAP = new Map([
    ['1000','TK/0'], ['1001','TK/1'], ['1002','TK/2'], ['1003','TK/3'],
    ['1100','K/0'],  ['1101','K/1'],  ['1102','K/2'],  ['1103','K/3']
  ]);

  const REQUIRED_HEADERS = [
    'no','nama','nip','no spm','nik','golongan','status kawin','nama rekening','norek','nama bank','nilai kotor','pajak'
  ];

  const els = {
    dropZone: document.getElementById('dropZone'), fileInput: document.getElementById('fileInput'),
    chooseBtn: document.getElementById('chooseBtn'), resultPanel: document.getElementById('resultPanel'),
    fileName: document.getElementById('fileName'), rowCount: document.getElementById('rowCount'),
    mappedCount: document.getElementById('mappedCount'), grossTotal: document.getElementById('grossTotal'),
    taxTotal: document.getElementById('taxTotal'), previewBody: document.getElementById('previewBody'),
    warningBox: document.getElementById('warningBox'), convertBtn: document.getElementById('convertBtn'),
    resetBtn: document.getElementById('resetBtn')
  };

  let sourceFile = null;
  let parsed = null;

  const normalize = v => String(v ?? '').trim().toLowerCase().replace(/\s+/g,' ');
  const asText = v => v == null ? '' : String(v).replace(/\.0$/,'');
  const asNumber = v => {
    if (typeof v === 'number') return v;
    const n = Number(String(v ?? '').replace(/[^0-9.-]/g,''));
    return Number.isFinite(n) ? n : 0;
  };
  const rupiah = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n || 0);

  function clone(obj){ return obj ? JSON.parse(JSON.stringify(obj)) : obj; }

  async function parseSource(file){
    if (!window.ExcelJS) throw new Error('Pustaka Excel belum termuat. Periksa koneksi internet lalu muat ulang halaman.');
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(await file.arrayBuffer());
    const ws = wb.worksheets[0];
    if (!ws) throw new Error('Sheet Excel tidak ditemukan.');

    let headerRowNo = -1, headerMap = {};
    ws.eachRow((row,rowNo) => {
      if (headerRowNo !== -1) return;
      const current = {};
      row.eachCell({includeEmpty:true},(cell,colNo) => { current[normalize(cell.value)] = colNo; });
      const hits = REQUIRED_HEADERS.filter(h => current[h]).length;
      if (hits >= 10 && current['status kawin']) { headerRowNo = rowNo; headerMap = current; }
    });
    if (headerRowNo === -1) throw new Error('Header Excel 1 tidak dikenali. Pastikan terdapat kolom seperti Nama, NIP, status kawin, Nilai Kotor, dan Pajak.');

    const missing = REQUIRED_HEADERS.filter(h => !headerMap[h]);
    if (missing.length) throw new Error('Kolom wajib belum lengkap: ' + missing.join(', '));

    const data = [];
    for (let r = headerRowNo + 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const nama = row.getCell(headerMap['nama']).value;
      const no = row.getCell(headerMap['no']).value;
      if (normalize(nama) === 'total') break;
      if ((nama == null || nama === '') && (no == null || no === '')) continue;

      const statusRaw = asText(row.getCell(headerMap['status kawin']).value).trim();
      data.push({
        no: row.getCell(headerMap['no']).value,
        nama: asText(nama),
        nip: asText(row.getCell(headerMap['nip']).value),
        noSpm: asText(row.getCell(headerMap['no spm']).value),
        nik: asText(row.getCell(headerMap['nik']).value),
        golongan: asText(row.getCell(headerMap['golongan']).value),
        status: statusRaw,
        ptkp: PTKP_MAP.get(statusRaw) || '',
        namaRekening: asText(row.getCell(headerMap['nama rekening']).value),
        norek: asText(row.getCell(headerMap['norek']).value),
        namaBank: asText(row.getCell(headerMap['nama bank']).value),
        nilaiKotor: asNumber(row.getCell(headerMap['nilai kotor']).value),
        pajak: asNumber(row.getCell(headerMap['pajak']).value)
      });
    }
    if (!data.length) throw new Error('Tidak ada baris data yang dapat dikonversi.');
    return {data, headerRowNo};
  }

  function renderPreview(file, info){
    sourceFile = file; parsed = info;
    els.fileName.textContent = file.name;
    els.rowCount.textContent = info.data.length;
    const mapped = info.data.filter(x => x.ptkp).length;
    els.mappedCount.textContent = mapped;
    els.grossTotal.textContent = rupiah(info.data.reduce((a,b)=>a+b.nilaiKotor,0));
    els.taxTotal.textContent = rupiah(info.data.reduce((a,b)=>a+b.pajak,0));

    const unknown = [...new Set(info.data.filter(x=>!x.ptkp).map(x=>x.status || '(kosong)'))];
    if (unknown.length) {
      els.warningBox.textContent = 'Kode status yang belum dikenali: ' + unknown.join(', ') + '. Perbaiki kode sebelum konversi.';
      els.warningBox.classList.remove('hidden');
      els.convertBtn.disabled = true;
    } else {
      els.warningBox.classList.add('hidden');
      els.convertBtn.disabled = false;
    }

    els.previewBody.innerHTML = info.data.slice(0,8).map(x => `
      <tr><td>${escapeHtml(x.no)}</td><td>${escapeHtml(x.nama)}</td><td>${escapeHtml(x.nip)}</td>
      <td>${escapeHtml(x.status)}</td><td><strong>${escapeHtml(x.ptkp)}</strong></td>
      <td>${rupiah(x.nilaiKotor)}</td><td>${rupiah(x.pajak)}</td></tr>`).join('');
    els.dropZone.classList.add('hidden');
    els.resultPanel.classList.remove('hidden');
  }

  function escapeHtml(v){ return String(v ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  async function buildOutput(){
    if (!sourceFile || !parsed) return;
    els.convertBtn.disabled = true;
    const oldText = els.convertBtn.textContent;
    els.convertBtn.textContent = 'Membuat Excel 2…';
    try {
      const res = await fetch(TEMPLATE_URL);
      if (!res.ok) throw new Error('Template Excel 2 tidak ditemukan. Pastikan folder assets/templates ikut diunggah ke GitHub.');
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(await res.arrayBuffer());
      const ws = wb.worksheets[0];

      let headerRow = 0, totalRow = 0;
      ws.eachRow((row,rowNo) => {
        if (!headerRow && normalize(row.getCell(1).value) === 'no' && normalize(row.getCell(2).value) === 'nama') headerRow = rowNo;
        if (normalize(row.getCell(2).value) === 'total') totalRow = rowNo;
      });
      if (!headerRow || !totalRow) throw new Error('Struktur template Excel 2 tidak dikenali.');

      const firstDataRow = headerRow + 1;
      const templateDataCount = totalRow - firstDataRow;
      const needed = parsed.data.length;

      // Simpan style satu baris contoh sebelum mengubah jumlah baris.
      const sampleRow = ws.getRow(firstDataRow);
      const rowHeight = sampleRow.height;
      const sampleStyles = [];
      for (let c=1;c<=14;c++) sampleStyles[c] = clone(sampleRow.getCell(c).style);

      if (needed > templateDataCount) {
        ws.spliceRows(totalRow, 0, ...Array.from({length: needed-templateDataCount},()=>[]));
      } else if (needed < templateDataCount) {
        ws.spliceRows(firstDataRow + needed, templateDataCount-needed);
      }
      totalRow = firstDataRow + needed;

      parsed.data.forEach((x,i) => {
        const r = firstDataRow + i;
        const row = ws.getRow(r);
        if (rowHeight) row.height = rowHeight;
        for (let c=1;c<=14;c++) row.getCell(c).style = clone(sampleStyles[c]);

        const values = [x.no,x.nama,x.nip,x.noSpm,x.nik,x.golongan,x.status,x.ptkp,x.namaRekening,x.norek,x.namaBank,x.nilaiKotor,x.pajak];
        values.forEach((v,idx) => row.getCell(idx+1).value = v);
        // Identitas panjang wajib teks.
        [3,4,5,10].forEach(c => { row.getCell(c).value = asText(row.getCell(c).value); row.getCell(c).numFmt = '@'; });
        row.getCell(14).value = {formula:`L${r}-M${r}`};
      });

      const total = ws.getRow(totalRow);
      total.getCell(1).value = null; total.getCell(2).value = 'Total';
      for (let c=3;c<=11;c++) total.getCell(c).value = null;
      total.getCell(12).value = {formula:`SUM(L${firstDataRow}:L${totalRow-1})`};
      total.getCell(13).value = {formula:`SUM(M${firstDataRow}:M${totalRow-1})`};
      total.getCell(14).value = {formula:`SUM(N${firstDataRow}:N${totalRow-1})`};

      const buf = await wb.xlsx.writeBuffer();
      const blob = new Blob([buf], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const base = sourceFile.name.replace(/\.xlsx$/i,'');
      a.href = url; a.download = `${base} - Excel 2.xlsx`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
    } catch(err) {
      els.warningBox.textContent = err.message || 'Konversi gagal.';
      els.warningBox.classList.remove('hidden');
    } finally {
      els.convertBtn.disabled = false; els.convertBtn.textContent = oldText;
    }
  }

  async function handleFile(file){
    if (!file) return;
    if (!/\.xlsx$/i.test(file.name)) { alert('Gunakan file Excel .xlsx.'); return; }
    try { renderPreview(file, await parseSource(file)); }
    catch(err){ alert(err.message || 'File tidak dapat dibaca.'); }
  }

  function reset(){
    sourceFile = null; parsed = null; els.fileInput.value = '';
    els.resultPanel.classList.add('hidden'); els.dropZone.classList.remove('hidden'); els.dropZone.focus();
  }

  els.chooseBtn.addEventListener('click', e => { e.stopPropagation(); els.fileInput.click(); });
  els.dropZone.addEventListener('click', () => els.fileInput.click());
  els.dropZone.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); els.fileInput.click(); }});
  els.fileInput.addEventListener('change', e => handleFile(e.target.files[0]));
  ['dragenter','dragover'].forEach(evt => els.dropZone.addEventListener(evt,e=>{e.preventDefault();els.dropZone.classList.add('dragover');}));
  ['dragleave','drop'].forEach(evt => els.dropZone.addEventListener(evt,e=>{e.preventDefault();els.dropZone.classList.remove('dragover');}));
  els.dropZone.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));
  els.resetBtn.addEventListener('click', reset);
  els.convertBtn.addEventListener('click', buildOutput);
})();
