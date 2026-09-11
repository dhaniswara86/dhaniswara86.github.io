const KABAYAN_EVALUATION_STANDARD=window.KabayanEvaluationSchema;
/* Format per kegiatan, disimpan melalui izin Supabase existing. */
window.KabayanEvaluationDesigner=(()=>{
  let model=null,openKey=null,loaded=false;const panel=$('evaluationPanel');
  panel.innerHTML='<div class="section-title"><div><span class="pill">EVALUASI KEGIATAN</span><h2>Format evaluasi</h2><p>Tinjau seluruh pertanyaan, atur bagian yang ditampilkan, dan sunting teks pertanyaan.</p></div></div><div class="evaluation-boundary"><b>Format untuk peserta</b><p>Simpan untuk menerapkan format pada kegiatan ini. Setelah jawaban evaluasi pertama masuk, format dikunci agar hasil tetap konsisten.</p></div><div class="evaluation-tools"><div class="field"><label for="evaluationMode">Pola tampilan</label><select id="evaluationMode"><option value="standard">Standar — bagian Coretax jika nomor 13 = Ya</option><option value="all">Tampilkan semua bagian tanpa percabangan</option><option value="selected">Pilih bagian yang ditampilkan</option></select></div><div class="actions"><button type="button" class="btn btn-outline" id="evaluationReset">Kembali ke standar</button><button type="button" class="btn btn-yellow" id="evaluationSave">Terapkan ke peserta</button><button type="button" class="btn btn-outline" id="evaluationExport">Unduh format JSON</button></div></div><p id="evaluationDraftStatus" role="status"></p><div class="evaluation-columns"><section><h3>Susunan pertanyaan</h3><p class="muted">Buka setiap bagian untuk melihat atau menyunting seluruh isinya.</p><div id="evaluationFields"></div></section><section class="evaluation-preview"><div class="section-title"><div><h3>Pratinjau rancangan</h3><p>Simulasi saja; tidak mengirim jawaban.</p></div></div><label id="evaluationBranchLabel"><input type="checkbox" id="evaluationBranch"> Simulasikan jawaban nomor 13 = Ya</label><div id="evaluationPreview"></div></section></div>';
  const clone=x=>JSON.parse(JSON.stringify(x));
  function standard(){return {mode:'standard',fields:clone(KABAYAN_EVALUATION_STANDARD).map(f=>({...f,enabled:true}))};}
  function key(){return 'kabayan:eval-draft:'+(window.KabayanAccountId||'unknown')+':'+currentEvent?.id;}
  function preview(){
    const root=$('evaluationPreview');root.replaceChildren();$('evaluationBranchLabel').hidden=model.mode!=='standard';
    const fields=model.fields.filter((f,i)=>f.enabled&&(model.mode!=='standard'||i<3||$('evaluationBranch').checked));
    if(!fields.length){root.textContent='Tidak ada bagian dipilih. Pilih minimal satu bagian pada rancangan.';return;}
    fields.forEach(f=>{const section=document.createElement('article');section.className='evaluation-preview-section';const h=document.createElement('h4');h.textContent=f.id.slice(1)+'. '+f.title;section.append(h);
      if(f.type==='matrix'){const note=document.createElement('p');note.className='muted';note.textContent='Skala 1–5: Tidak Setuju hingga Sangat Setuju';section.append(note);f.rows.forEach((row,i)=>{const line=document.createElement('div');line.className='preview-matrix-row';const text=document.createElement('span');text.textContent=(i+1)+'. '+row;const scales=document.createElement('span');scales.className='preview-scale';scales.textContent='1   2   3   4   5';line.append(text,scales);section.append(line);});}
      else{const sample=document.createElement('div');sample.className='preview-answer';sample.textContent=f.type==='text'?'Kolom jawaban uraian':'○ Ya     ○ Tidak';section.append(sample);}root.append(section);
    });
  }
  function render(){
    $('evaluationMode').value=model.mode;const root=$('evaluationFields');root.replaceChildren();
    model.fields.forEach((f,i)=>{
      const details=document.createElement('details');details.className='evaluation-field';details.open=i===0;
      const summary=document.createElement('summary');summary.textContent=f.id.slice(1)+'. '+f.title;details.append(summary);
      const body=document.createElement('div');body.className='evaluation-field-body';
      const toggleLabel=document.createElement('label');toggleLabel.className='evaluation-toggle';const toggle=document.createElement('input');toggle.type='checkbox';toggle.checked=f.enabled;toggle.disabled=model.mode!=='selected';toggle.setAttribute('aria-label','Tampilkan bagian '+f.id.slice(1));toggle.onchange=()=>{f.enabled=toggle.checked;changed();};toggleLabel.append(toggle,document.createTextNode('Tampilkan bagian ini'));body.append(toggleLabel);
      const label=document.createElement('label');label.textContent='Teks pertanyaan / judul';label.htmlFor='eval-title-'+f.id;const title=document.createElement('textarea');title.id=label.htmlFor;title.value=f.title;title.rows=3;title.maxLength=2000;title.oninput=()=>{f.title=title.value;summary.textContent=f.id.slice(1)+'. '+f.title;changed();};body.append(label,title);
      if(f.rows){const rowsLabel=document.createElement('label');rowsLabel.textContent='Pernyataan matriks — sunting teks, pertahankan jumlah baris';rowsLabel.htmlFor='eval-rows-'+f.id;const input=document.createElement('textarea');input.id=rowsLabel.htmlFor;input.rows=10;input.value=f.rows.join('\n');input.oninput=()=>{f.rows=input.value.split('\n').map(x=>x.trim()).filter(Boolean);changed();};body.append(rowsLabel,input);}
      const type=document.createElement('small');type.textContent=({matrix:'Jawaban: skala 1–5',text:'Jawaban: uraian',yesno:'Jawaban: Ya / Tidak'})[f.type];body.append(type);details.append(body);root.append(details);
    });preview();
  }
  function changed(){$('evaluationDraftStatus').textContent='Perubahan belum diterapkan. Tekan Terapkan ke peserta untuk menyimpan.';preview();}
  async function open(){
    if(!currentEvent)return;const next=key(),eventId=currentEvent.id;
    if(openKey===next&&loaded)return;
    openKey=next;loaded=false;model=standard();render();
    $('evaluationSave').disabled=true;$('evaluationDraftStatus').textContent='Memuat format tersimpan…';
    try{
      const {data,error}=await sb.from('external_events').select('evaluation_config').eq('id',eventId).single();
      if(error)throw error;if(openKey!==next)return;
      model=data.evaluation_config||standard();loaded=true;render();
      $('evaluationDraftStatus').textContent=data.evaluation_config?'Format tersimpan dimuat. Perubahan berlaku setelah diterapkan.':'Kegiatan memakai format standar. Pilih pola atau sunting pertanyaan di bawah.';
      $('evaluationSave').disabled=false;
    }catch(e){if(openKey!==next)return;$('evaluationDraftStatus').textContent='Format belum dapat dimuat. Pastikan pembaruan evaluasi v8 sudah dipasang pada Supabase, lalu buka kembali bagian ini. '+e.message;}
  }
  $('evaluationMode').onchange=()=>{model.mode=$('evaluationMode').value;if(model.mode!=='selected')model.fields.forEach(f=>f.enabled=true);render();changed();};
  $('evaluationBranch').onchange=preview;
  $('evaluationReset').onclick=()=>{if(!confirm('Ganti rancangan saat ini dengan format standar? Rancangan tersimpan belum berubah sampai Anda menekan Simpan.'))return;model=standard();render();changed();};
  function valid(){return model.fields.some(f=>f.enabled)&&model.fields.filter(f=>f.enabled).every(f=>f.title.trim()&&(f.type!=='matrix'||f.rows.length>0));}
  $('evaluationSave').onclick=async()=>{
    if(!loaded||!valid()){$('evaluationDraftStatus').textContent='Pilih minimal satu bagian dan lengkapi teksnya.';return;}
    if(model.fields.some(f=>f.type==='matrix'&&f.rows.length!==(f.id==='q11'?7:10))){$('evaluationDraftStatus').textContent='Pertahankan 7 baris pada nomor 11 dan 10 baris pada nomor 14 agar struktur laporan tetap konsisten. Teks setiap baris dapat disunting.';return;}
    if(!confirm('Terapkan format ini ke peserta pada kegiatan '+currentEvent.title+'?'))return;
    const eventId=currentEvent.id,next=key(),config=clone(model);$('evaluationSave').disabled=true;
    try{
      const {data,error}=await sb.from('external_events').update({evaluation_config:config}).eq('id',eventId).select('id,evaluation_config');
      if(error)throw error;if(!data?.length)throw new Error('Tidak ada kegiatan yang diperbarui. Periksa akses akun.');
      if(openKey!==next)return;currentEvent.evaluation_config=config;
      $('evaluationDraftStatus').textContent='Berhasil. Format sudah diterapkan ke peserta pada kegiatan ini.';
      localStorage.removeItem(next);
    }catch(e){if(openKey===next)$('evaluationDraftStatus').textContent='Format belum diterapkan: '+e.message;}
    finally{if(openKey===next)$('evaluationSave').disabled=false;}
  };
  $('evaluationExport').onclick=()=>{if(!valid()){$('evaluationDraftStatus').textContent='Lengkapi rancangan sebelum mengunduh.';return;}const url=URL.createObjectURL(new Blob([JSON.stringify({event_id:currentEvent.id,status:'editor_export',...model},null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='rancangan-evaluasi-'+currentEvent.code.replace(/[^a-z0-9_-]/gi,'_')+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  return {open};
})();
