/* Panduan proses memakai data tersimpan; izin akses tetap diperiksa oleh Supabase. */
window.KabayanProcess=(()=>{
  'use strict';
  let generation=0,lastCheck=null,aggregateData=[],aggregateBusy=false;
  const number=n=>new Intl.NumberFormat('id-ID').format(n);
  function scopeKey(){return window.KabayanAccountId?'kabayan:last-event:'+window.KabayanAccountId:null;}
  function remember(id,route){try{const key=scopeKey();if(key)localStorage.setItem(key,JSON.stringify({id,route}));}catch{}}
  async function rows(table,columns,scope){
    const result=[];
    for(let offset=0;;offset+=500){let query=sb.from(table).select(columns).order('id').range(offset,offset+499);if(scope)query=scope(query);const {data,error}=await query;if(error)throw error;result.push(...(data||[]));if(!data||data.length<500)return result;}
  }
  async function children(table,columns,ids){const result=[];for(let i=0;i<ids.length;i+=100)result.push(...await rows(table,columns,q=>q.in('event_id',ids.slice(i,i+100))));return result;}
  function eventScope(q){if(currentProfile?.role==='satker'){if(!currentProfile.work_unit_id)throw new Error('Satuan Kerja belum ditetapkan.');return q.eq('work_unit_id',currentProfile.work_unit_id);}if(currentProfile?.role!=='admin')throw new Error('Sesi akun tidak tersedia.');return q;}
  function focus(items){
    const available=items.filter(e=>e.lifecycle_status!=='deleted');let previous=null;
    try{const raw=scopeKey()&&localStorage.getItem(scopeKey());previous=raw?JSON.parse(raw):null;}catch{}
    const remembered=available.find(e=>e.id===previous?.id),event=remembered||available.find(e=>(e.lifecycle_status||'active')==='active')||available[0];
    $('continueTitle').textContent=event?.title||'Mulai kegiatan pertama Anda';
    $('continueCopy').textContent=event?(remembered?'Terakhir dibuka di perangkat ini.':'Kegiatan terbaru yang dapat Anda kelola.'):'Buat kegiatan, lengkapi persiapan, lalu bagikan akses peserta.';
    $('continueEvent').textContent=event?'Lanjutkan kegiatan →':'+ Buat kegiatan';
    $('continueEvent').onclick=async()=>{if(!event){$('newEventBtn').click();return;}$('continueEvent').disabled=true;try{if(!events.some(e=>e.id===event.id))await loadEvents();await window.KabayanWorkflow.openEvent(event.id,remembered?previous.route:'checklistPanel');}catch(e){window.KabayanWorkflow.notice(e.message);}finally{$('continueEvent').disabled=false;}};
    const attention=$('attentionList');attention.replaceChildren();
    const tasks=available.filter(e=>(e.lifecycle_status||'active')==='active').flatMap(e=>{
      if(e.status==='draft')return [{event:e,label:'Persiapan belum dipublikasikan',button:'Periksa persiapan',route:'checklistPanel'}];
      if(e.status==='published'&&!e.final_phase_open&&e.event_date&&e.event_date<=new Date().toLocaleDateString('en-CA'))return [{event:e,label:'Fase akhir belum dibuka',button:'Tinjau fase',route:'accessPage'}];
      return [];
    }).slice(0,4);
    if(!tasks.length){const text=document.createElement('p');text.className='muted';text.textContent='Tidak ada tindak lanjut pada pemeriksaan status saat ini.';attention.append(text);}
    for(const task of tasks){const row=document.createElement('div');row.className='attention-item';const info=document.createElement('div');const title=document.createElement('b');title.textContent=task.label;const detail=document.createElement('span');detail.textContent=task.event.title;info.append(title,detail);const button=document.createElement('button');button.type='button';button.className='btn btn-outline';button.textContent=task.button;button.onclick=async()=>{button.disabled=true;try{if(!events.some(e=>e.id===task.event.id))await loadEvents();await window.KabayanWorkflow.openEvent(task.event.id,task.route);}catch(e){window.KabayanWorkflow.notice(e.message);}finally{button.disabled=false;}};row.append(info,button);attention.append(row);}
  }
  const filled=value=>String(value??'').trim().length>0;
  function checks(event,questions){
    function test(type){const qs=questions.filter(q=>q.test_type===type&&q.active!==false);return qs.length>0&&qs.every(q=>filled(q.question_text)&&['option_a','option_b','option_c','option_d'].every(k=>filled(q[k]))&&['A','B','C','D'].includes(q.correct_answer)&&Number(q.weight)>0);}
    return [
      {label:'Identitas kegiatan lengkap',ok:['title','code','event_date','issuer','work_unit_id'].every(k=>filled(event[k])),route:'settingsPanel',action:'Lengkapi identitas'},
      {label:'Penandatangan sertifikat tersedia',ok:filled(event.signer_name)&&filled(event.signer_title),route:'settingsPanel',action:'Isi penandatangan'},
      {label:'Format nomor sertifikat tersedia',ok:filled(event.number_pattern)&&!event.number_pattern.includes('//')&&Number(event.next_sequence)>0,route:'settingsPanel',action:'Periksa nomor sertifikat'},
      {label:'Pretest dan kunci jawaban lengkap',ok:test('pretest'),route:'questionPanel',test:'pretest',action:'Lengkapi pretest'},
      {label:'Posttest dan kunci jawaban lengkap',ok:test('posttest'),route:'questionPanel',test:'posttest',action:'Lengkapi posttest'}
    ];
  }
  async function inspect(id){
    const data=await rows('external_events','*,work_units(id,code,name)',q=>eventScope(q).eq('id',id));
    const event=data[0];if(!event)throw new Error('Kegiatan tidak tersedia untuk akun ini.');
    const questions=await rows('external_questions','id,event_id,test_type,active,question_text,option_a,option_b,option_c,option_d,correct_answer,weight',q=>q.eq('event_id',id));
    return {event,checks:checks(event,questions)};
  }
  async function act(check){if(check.test)currentTest=check.test;await window.KabayanWorkflow.navigate(check.route);if(check.test){document.querySelectorAll('[data-test]').forEach(b=>b.classList.toggle('active',b.dataset.test===check.test));await loadQuestions();}}
  function renderReadiness(result){
    lastCheck=result;const list=$('readinessList');list.replaceChildren();
    for(const check of result.checks){const row=document.createElement('div');row.className='readiness-row';const mark=document.createElement('span');mark.className='readiness-mark '+(check.ok?'done':'todo');mark.textContent=check.ok?'✓':'○';mark.setAttribute('aria-label',check.ok?'Lengkap':'Belum lengkap');const label=document.createElement('span');label.textContent=check.label;const button=document.createElement('button');button.type='button';button.className='btn btn-outline';button.textContent=check.ok?'Tinjau':check.action;button.onclick=()=>act(check).catch(e=>window.KabayanWorkflow.notice(e.message));row.append(mark,label,button);list.append(row);}
    const first=result.checks.find(c=>!c.ok),done=result.checks.filter(c=>c.ok).length;
    $('readinessStatus').textContent=`${done} dari ${result.checks.length} pemeriksaan lengkap. Format evaluasi standar tetap tersedia pada tab Format evaluasi.`;
    $('readinessAction').disabled=false;
    if(result.event.status!=='draft'){
      $('readinessNext').textContent=first?'Ada kelengkapan yang perlu ditinjau. Pemeriksaan tidak mengubah status kegiatan.':'Persiapan lengkap. Anda dapat melanjutkan pengelolaan kegiatan.';
      $('readinessAction').textContent=first?first.action:'Lanjut ke pelaksanaan →';
      $('readinessAction').onclick=()=>first?act(first):window.KabayanWorkflow.navigate('accessPage');
    }else{
      $('readinessNext').textContent=first?'Langkah berikutnya: '+first.action+'.':'Persiapan lengkap. Publikasi akan membuka fase awal untuk peserta.';
      $('readinessAction').textContent=first?first.action:'Publikasikan & buka fase awal';
      $('readinessAction').onclick=()=>first?act(first):$('publishEventBtn').onclick();
    }
  }
  async function readiness(){
    const id=currentEvent?.id;if(!id)return;const token=generation;
    $('refreshReadiness').disabled=true;$('readinessAction').disabled=true;$('readinessStatus').textContent='Memeriksa data kegiatan yang sudah disimpan…';$('readinessList').replaceChildren();$('readinessNext').textContent='';
    try{const result=await inspect(id);if(token!==generation||currentEvent?.id!==id)return;renderReadiness(result);}
    catch(e){if(token===generation){$('readinessStatus').textContent='Pemeriksaan belum berhasil: '+e.message;$('readinessAction').disabled=true;}}
    finally{if(token===generation)$('refreshReadiness').disabled=false;}
  }
  async function aggregate(){
    if(aggregateBusy)return;const token=generation;aggregateBusy=true;$('refreshAggregate').disabled=true;$('exportAggregate').disabled=true;$('aggregateStatus').textContent='Memuat ringkasan kegiatan…';$('aggregateRows').replaceChildren();aggregateData=[];
    try{
      const items=await rows('external_events','id,title,code,work_unit_id,work_units(name)',eventScope),ids=items.map(e=>e.id);
      const [participants,certificates]=await Promise.all([children('external_participants','id,event_id,evaluation_completed',ids),children('external_certificates','id,event_id,status',ids)]);
      if(token!==generation)return;
      const counts=new Map(items.map(e=>[e.id,{participants:0,evaluations:0,certificates:0}]));
      participants.forEach(p=>{const count=counts.get(p.event_id);if(count){count.participants++;if(p.evaluation_completed)count.evaluations++;}});certificates.forEach(c=>{if(c.status==='valid'&&counts.has(c.event_id))counts.get(c.event_id).certificates++;});
      aggregateData=items.map(e=>({...e,...counts.get(e.id)}));
      for(const event of aggregateData){const tr=document.createElement('tr');for(const value of [event.title,event.work_units?.name||currentProfile.work_unit_name||'—',number(event.participants),number(event.evaluations),number(event.certificates)]){const td=document.createElement('td');td.textContent=value;tr.append(td);}const td=document.createElement('td');const button=document.createElement('button');button.type='button';button.className='btn btn-outline';button.textContent='Buka hasil';button.onclick=()=>window.KabayanWorkflow.openEvent(event.id,'reportPanel').catch(e=>window.KabayanWorkflow.notice(e.message));td.append(button);tr.append(td);$('aggregateRows').append(tr);}
      $('aggregateStatus').textContent=items.length?`${number(items.length)} kegiatan sesuai akses akun. Jumlah peserta dihitung per pendaftaran kegiatan.`:'Belum ada kegiatan untuk dilaporkan.';$('exportAggregate').disabled=!items.length;
      $('aggregateTitle').textContent=currentProfile.role==='admin'?'Laporan lintas Satker':'Laporan Satuan Kerja';
    }catch(e){if(token===generation)$('aggregateStatus').textContent='Laporan belum dapat dimuat: '+e.message;}
    finally{if(token===generation){aggregateBusy=false;$('refreshAggregate').disabled=false;}}
  }
  function exportCSV(){
    // Neutralize spreadsheet formulas in names from database content.
    const cell=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"';
    const rows=[['Kode','Kegiatan','Satuan Kerja','Peserta','Evaluasi selesai','Sertifikat valid'],...aggregateData.map(e=>[e.code,e.title,e.work_units?.name||currentProfile.work_unit_name||'',e.participants,e.evaluations,e.certificates])];
    const url=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ringkasan-kegiatan-kabayan.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const publish=$('publishEventBtn').onclick;let publishing=false;
  $('publishEventBtn').onclick=async()=>{
    if(publishing||!currentEvent)return;publishing=true;const id=currentEvent.id,token=generation;
    $('publishEventBtn').disabled=true;
    try{
      const result=await inspect(id);if(token!==generation||currentEvent?.id!==id)return false;
      if(result.event.lifecycle_status&&result.event.lifecycle_status!=='active')throw new Error('Aktifkan kegiatan dari arsip sebelum memublikasikannya.');
      if(result.checks.some(c=>!c.ok)){await window.KabayanWorkflow.navigate('checklistPanel');window.KabayanWorkflow.notice('Lengkapi persiapan yang belum selesai sebelum publikasi.');return false;}
      await publish();
      if(token!==generation||currentEvent?.id!==id)return false;
      if(currentEvent?.status==='published'){renderPhases();await window.KabayanWorkflow.navigate('accessPage');window.KabayanWorkflow.notice('Kegiatan dipublikasikan. Fase awal sudah dibuka; bagikan tautan atau QR kepada peserta.');return true;}
      window.KabayanWorkflow.notice('Publikasi belum berhasil. '+($('eventErr').textContent||'Coba lagi.'));return false;
    }catch(e){window.KabayanWorkflow.notice('Publikasi belum dapat dilakukan: '+e.message);return false;}
    finally{publishing=false;$('publishEventBtn').disabled=!currentEvent||currentEvent.status==='published';}
  };
  $('refreshReadiness').onclick=readiness;$('refreshAggregate').onclick=aggregate;$('exportAggregate').onclick=exportCSV;
  function reset(){generation++;lastCheck=null;aggregateData=[];aggregateBusy=false;publishing=false;$('aggregateRows').replaceChildren();$('readinessList').replaceChildren();$('exportAggregate').disabled=true;}
  return {focus,remember,readiness,aggregate,reset};
})();
