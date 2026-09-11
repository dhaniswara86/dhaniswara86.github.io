/* Umpan balik jelas dan penghapusan soal terikat pada kegiatan + jenis tes. */
(() => {
  const dialog=document.createElement('dialog');dialog.id='actionDialog';dialog.className='action-dialog';
  dialog.innerHTML='<span id="actionIcon" class="action-icon" aria-hidden="true"></span><h2 id="actionTitle"></h2><p id="actionMessage" aria-live="polite"></p><div class="actions"><button type="button" class="btn btn-outline" id="actionCancel">Batal</button><button type="button" class="btn btn-yellow" id="actionConfirm">Tutup</button></div>';
  document.body.append(dialog);let busy=false,resolver=null,notified=false;
  function show(kind,title,message){
    $('actionTitle').textContent=title;$('actionMessage').textContent=message;dialog.dataset.kind=kind;
    $('actionIcon').textContent=({success:'✓',error:'!',loading:'…',confirm:'?'})[kind];
    $('actionCancel').hidden=kind!=='confirm';$('actionConfirm').hidden=kind==='loading';
    $('actionConfirm').textContent=kind==='confirm'?'Ya, hapus':'Tutup';if(!dialog.open)dialog.showModal();
  }
  function close(answer=false){if(busy)return;dialog.close();if(resolver){const resolve=resolver;resolver=null;resolve(answer);}}
  $('actionCancel').onclick=()=>close(false);$('actionConfirm').onclick=()=>close(true);
  dialog.addEventListener('cancel',e=>{e.preventDefault();close(false);});
  function confirmDelete(message){show('confirm','Konfirmasi penghapusan',message);return new Promise(resolve=>resolver=resolve);}
  const originalMsg=msg;
  msg=function(id,text,ok=false){originalMsg(id,text,ok);if(['questionOk','questionErr'].includes(id)){notified=true;show(ok?'success':'error',ok?'Berhasil':'Proses belum berhasil',text);}};
  async function reload(id,type){if(currentEvent?.id===id&&currentTest===type){editingQuestion=null;await loadQuestions();}}
  async function remove(ids,id,type){
    let removed=0;
    for(let i=0;i<ids.length;i+=100){const {data,error}=await sb.from('external_questions').delete().eq('event_id',id).eq('test_type',type).in('id',ids.slice(i,i+100)).select('id');
      if(error)throw new Error(`${removed} soal sudah dihapus. Penghapusan berikutnya gagal: ${error.message}`);removed+=(data||[]).length;}
    return removed;
  }
  deleteQuestion=async function(questionId){
    if(busy||!currentEvent)return;const id=currentEvent.id,type=currentTest,label=type==='pretest'?'Pretest':'Posttest';
    if(!await confirmDelete(`Hapus satu soal ${label} pada kegiatan “${currentEvent.title}”? Penghapusan tidak dapat dibatalkan. Soal pada tes lainnya tidak dihapus.`))return;
    busy=true;show('loading','Menghapus soal…','Mohon tunggu hingga hasil penghapusan diterima.');
    try{const count=await remove([questionId],id,type);await reload(id,type);show('success','Penghapusan selesai',`${count} soal ${label} berhasil dihapus.`);}
    catch(e){await reload(id,type).catch(()=>{});show('error','Penghapusan belum selesai',e.message);}
    finally{busy=false;}
  };
  const toolbar=document.createElement('div');toolbar.className='question-toolbar';toolbar.innerHTML='<div><b id="questionListTitle">Daftar soal</b><p>Hapus satu soal melalui tombol di barisnya, atau hapus semua soal pada tab ini.</p></div><button type="button" class="btn btn-red" id="deleteAllQuestions">Hapus semua soal</button>';
  $('questionRows').closest('.tablewrap').before(toolbar);
  function label(){const name=currentTest==='pretest'?'Pretest':'Posttest';$('questionListTitle').textContent='Daftar soal '+name;$('deleteAllQuestions').textContent='Hapus semua '+name;}
  new MutationObserver(label).observe($('questionRows'),{childList:true});label();
  $('deleteAllQuestions').onclick=async()=>{
    if(busy||!currentEvent)return;const id=currentEvent.id,type=currentTest,name=type==='pretest'?'Pretest':'Posttest',title=currentEvent.title;
    busy=true;show('loading','Memeriksa daftar soal…','Menghitung soal pada tab yang dipilih.');
    let ids=[];
    try{for(let offset=0;;offset+=500){const {data,error}=await sb.from('external_questions').select('id').eq('event_id',id).eq('test_type',type).order('id').range(offset,offset+499);if(error)throw error;ids.push(...(data||[]).map(q=>q.id));if(!data||data.length<500)break;}}
    catch(e){busy=false;show('error','Soal belum dapat diperiksa',e.message);return;}
    busy=false;
    if(!ids.length){show('success','Tidak ada soal',`Tab ${name} sudah kosong.`);return;}
    if(!await confirmDelete(`Hapus seluruh ${ids.length} soal ${name} pada kegiatan “${title}”? Penghapusan permanen. Soal ${type==='pretest'?'Posttest':'Pretest'} tetap dipertahankan.`))return;
    busy=true;show('loading','Menghapus soal…',`Memproses ${ids.length} soal ${name}.`);
    try{const count=await remove(ids,id,type);await reload(id,type);show('success','Penghapusan selesai',`${count} dari ${ids.length} soal ${name} berhasil dihapus.`);}
    catch(e){await reload(id,type).catch(()=>{});show('error','Penghapusan belum selesai',e.message);}
    finally{busy=false;}
  };
  for(const id of ['copyPretestBtn','copyBtn']){
    const button=$(id),original=button.onclick;
    button.onclick=async()=>{if(busy)return;busy=true;notified=false;button.disabled=true;show('loading','Menyalin soal…','Tunggu hingga muncul konfirmasi berhasil atau pesan kesalahan.');
      try{await original();if(!notified)dialog.close();}
      catch(e){show('error','Penyalinan belum berhasil',e.message);}
      finally{busy=false;button.disabled=false;}
    };
  }
})();
