
let sb=null,events=[],currentEvent=null,currentTest='pretest',editingQuestion=null,editingEval=null,participantSelection=new Set(),currentProfile=null,workUnits=[],allAuthUsers=[],unitFilterValue='',eventManagementFilter='active';
const $=id=>document.getElementById(id);
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function msg(id,text,ok=false){const el=$(id);el.textContent=text;el.className='msg show '+(ok?'ok':'err');setTimeout(()=>el.classList.remove('show'),4500)}
function initialUrl(e){return new URL('awal.html?kode='+encodeURIComponent(e.code),location.href).href}
function finalUrl(e){return new URL('akhir.html?kode='+encodeURIComponent(e.code),location.href).href}
async function copyText(text){try{await navigator.clipboard.writeText(text);return true}catch{prompt('Salin link berikut:',text);return false}}

async function loadMyProfile(){
  const {data,error}=await sb.rpc('get_my_edu_profile');
  if(error)throw error;
  currentProfile=data?.[0]||null;
  return currentProfile;
}

function applyRoleUI(){
  document.body.classList.remove('role-admin','role-satker');

  if(!currentProfile)return;

  document.body.classList.add(currentProfile.role==='admin'?'role-admin':'role-satker');

  const context=$('accountContext');
  context.className='account-context show '+(currentProfile.role==='satker'?'satker':'');
  $('accountContextText').innerHTML=currentProfile.role==='admin'
    ? `<b>Administrator</b> • Semua Satuan Kerja`
    : `<b>${esc(currentProfile.work_unit_name||'Satuan Kerja')}</b> • Akun Satker`;

  if(currentProfile.role==='satker'){
    $('eventListHelp').textContent='Hanya kegiatan milik Satuan Kerja Anda yang ditampilkan.';
    $('satkerContext').style.display='block';
    $('satkerContext').innerHTML='<b>Satuan Kerja Anda</b><br>'+esc(currentProfile.work_unit_name||'-')+
      (currentProfile.work_unit_code?' • '+esc(currentProfile.work_unit_code):'');
    $('eventWorkUnitReadonly').value=[currentProfile.work_unit_code,currentProfile.work_unit_name].filter(Boolean).join(' — ');
  }else{
    $('eventListHelp').textContent='Administrator dapat melihat dan mengelola seluruh Satuan Kerja.';
    $('satkerContext').style.display='none';
  }
}

function authView(view,message=''){
  document.body.classList.toggle('auth-pending',view==='loading'||view==='error');
  document.body.classList.toggle('login-mode',view==='login');
  $('authStatus').hidden=!['loading','error'].includes(view);
  $('authTitle').textContent=view==='error'?'Ruang kerja belum dapat dibuka':'Menyiapkan ruang kerja…';
  $('authMessage').textContent=message||'Memeriksa sesi masuk Anda.';
  $('authActions').hidden=view!=='error';
  $('loginView').hidden=view!=='login';
  $('loginView').style.display=view==='login'?'grid':'none';
  $('profileGate').classList.toggle('show',view==='profile');
  $('appView').classList.toggle('show',view==='app');
  $('appView').hidden=view!=='app';
  if(view!=='app')window.KabayanDashboard?.stop();
}
let entering=false,authEpoch=0;
async function enterApp(){
  if(entering)return false;
  entering=true;const epoch=authEpoch;authView('loading');
  try{
    const auth=await sb.auth.getSession();
    if(auth.error)throw auth.error;
    window.KabayanAccountId=auth.data.session?.user?.id||null;
    const profile=await loadMyProfile();
    if(epoch!==authEpoch)return false;
    if(!profile){authView('profile');return false;}
    if(!['admin','satker'].includes(profile.role))throw new Error('Peran akun belum memiliki akses. Hubungi administrator.');
    if(profile.role==='satker'&&!profile.work_unit_id)throw new Error('Satuan Kerja akun belum ditetapkan. Hubungi administrator.');
    currentEvent=null;events=[];workUnits=[];allAuthUsers=[];participantSelection.clear();
    ['participantRows','certificateRows','questionRows','eventManagementRows','activityRows','userProfileRows','workUnitRows','qrHistoryRows','qrOutput'].forEach(id=>$(id)?.replaceChildren());
    $('eventSearch').value='';window.KabayanDirectoryFilter='active';unitFilterValue='';
    $('newEventBtn').onclick();
    applyRoleUI();
    await loadWorkUnits();
    await loadEvents();
    const requestedEvent=new URLSearchParams(location.search).get('event');
    if(requestedEvent){
      if(events.some(e=>e.id===requestedEvent))await selectEvent(requestedEvent,false);
      else window.KabayanWorkflow?.notice('Kegiatan pada tautan tidak tersedia untuk akun ini. Silakan pilih kegiatan lain.');
    }
    if(epoch!==authEpoch)return false;
    // Sesi tetap dipakai di semua modul; tidak ada perpindahan ke halaman login.
    authView('app');
    await window.KabayanWorkflow.ready();
    return true;
  }catch(e){if(epoch===authEpoch)authView('error',e.message);return false;}
  finally{entering=false;}
}
let authSubscription=null;
async function guard(){
  authView('loading');
  try{
    if(!window.KabayanKegiatanSupabase?.isConfigured())throw new Error('Konfigurasi layanan belum tersedia. Hubungi administrator.');
    sb=window.KabayanKegiatanSupabase.getClient();
    if(!authSubscription){
      authSubscription=sb.auth.onAuthStateChange((event,session)=>{
        if(event==='SIGNED_OUT'){
          authEpoch++;document.querySelectorAll('dialog[open]').forEach(d=>d.close());
          window.KabayanAccountId=null;window.KabayanWorkflow?.reset();
          currentProfile=null;currentEvent=null;events=[];
          document.body.classList.remove('role-admin','role-satker');
          window.KabayanDashboard?.stop();authView('login');
        }
      });
    }
    const {data,error}=await sb.auth.getSession();if(error)throw error;
    if(data.session)return await enterApp();
    authView('login');return false;
  }catch(e){authView('error',e.message);return false;}
}
$('loginForm').onsubmit=async event=>{
  event.preventDefault();$('loginBtn').disabled=true;$('loginErr').classList.remove('show');
  try{
    sb=window.KabayanKegiatanSupabase.getClient();
    const {error}=await sb.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value});
    if(error)throw error;
    $('loginPassword').value='';
    await enterApp();
  }catch(e){authView('login');msg('loginErr',e.message);}
  finally{$('loginBtn').disabled=false;}
};
$('retrySession').onclick=guard;
async function leaveApp(){
  try{
    if(sb){const {error}=await sb.auth.signOut({scope:'local'});if(error)throw error;}
    authEpoch++;currentProfile=null;currentEvent=null;events=[];
    window.KabayanAccountId=null;window.KabayanWorkflow?.reset();
    document.body.classList.remove('role-admin','role-satker');
    window.KabayanDashboard?.stop();
    history.replaceState(null,'',location.pathname+'#dashboard');
    authView('login');
  }catch(error){window.KabayanWorkflow?.notice('Keluar belum berhasil: '+error.message);if(!$('authStatus').hidden)$('authMessage').textContent=error.message;}
}
$('authLogout').onclick=leaveApp;

$('bootstrapAdminBtn').onclick=async()=>{
  try{
    const fullName=$('bootstrapAdminName').value.trim();
    if(!fullName)throw new Error('Nama Admin wajib diisi.');

    const {error}=await sb.rpc('bootstrap_first_edu_admin',{p_full_name:fullName});
    if(error)throw error;

    $('profileGate').classList.remove('show');
    await enterApp();
  }catch(e){
    msg('profileGateErr',e.message);
  }
};

$('profileGateLogoutBtn').onclick=leaveApp;
$('logoutBtn').onclick=leaveApp;

async function loadWorkUnits(){
  const {data,error}=await sb.from('work_units')
    .select('*')
    .eq('active',true)
    .order('name');

  if(error)throw error;

  workUnits=data||[];

  const opts='<option value="">Pilih Satuan Kerja...</option>'+
    workUnits.map(u=>`<option value="${u.id}">${esc(u.code)} — ${esc(u.name)}</option>`).join('');

  $('eventWorkUnit').innerHTML=opts;
  $('unitFilter').innerHTML='<option value="">Semua Satuan Kerja</option>'+
    workUnits.map(u=>`<option value="${u.id}">${esc(u.code)} — ${esc(u.name)}</option>`).join('');
}

async function loadEvents(){
  const result=[];
  for(let offset=0;;offset+=500){
    let query=sb.from('external_events').select('*,work_units(id,code,name)').order('created_at',{ascending:false}).order('id').range(offset,offset+499);
    if(currentProfile?.role==='satker'){
      if(!currentProfile.work_unit_id)throw new Error('Satuan Kerja belum ditetapkan.');
      query=query.eq('work_unit_id',currentProfile.work_unit_id);
    }
    const {data,error}=await query;if(error)throw error;
    result.push(...(data||[]));if(!data||data.length<500)break;
  }
  events=result;renderEvents();renderCopySources();
  if(currentEvent){
    const found=events.find(x=>x.id===currentEvent.id);
    if(found){currentEvent=found;renderPhases();}else currentEvent=null;
  }
  window.KabayanWorkflow?.sync();
  // Optional management RPCs are loaded only when their module is opened.
  if(window.KabayanWorkflow?.active()==='eventManagementPanel')await loadEventManagement();
}

function filteredEvents(){
  const filter=window.KabayanDirectoryFilter||'active';
  let rows=events.filter(e=>filter==='archived'?e.lifecycle_status==='archived':(e.lifecycle_status||'active')==='active'&&(filter==='completed'?e.status==='closed':e.status!=='closed'));
  if(currentProfile?.role==='admin'&&unitFilterValue)rows=rows.filter(e=>e.work_unit_id===unitFilterValue);
  const term=$('eventSearch')?.value.trim().toLocaleLowerCase('id-ID');
  if(term)rows=rows.filter(e=>[e.title,e.code,e.work_units?.name].join(' ').toLocaleLowerCase('id-ID').includes(term));
  return rows;
}
function eventStateBadge(e){const s=e.lifecycle_status||'active';return `<span class="status ${s==='active'?'event-state-active':s==='archived'?'event-state-archived':'event-state-deleted'}">${s==='active'?'AKTIF':s==='archived'?'ARSIP':'DIHAPUS'}</span>`}
function renderEvents(){
  const rows=filteredEvents();
  $('eventList').innerHTML=rows.length?rows.map(e=>`<div class="event-item ${currentEvent?.id===e.id?'active':''}" data-id="${e.id}">
    <div class="event-actions"><button class="event-menu-btn" data-event-menu-btn="${e.id}">⋯</button><div class="event-menu" id="event-menu-${e.id}">
      <button data-event-edit="${e.id}">✏️ Edit Kegiatan</button><button data-event-detail="${e.id}">👁 Lihat Detail</button>${e.lifecycle_status==='archived'?`<button data-event-restore="${e.id}">Aktifkan kembali</button>`:`<button class="archive" data-event-archive="${e.id}">Arsipkan</button>`}<button class="danger" data-event-delete="${e.id}">🗑 Hapus Permanen</button>
    </div></div>
    <b style="padding-right:42px">${esc(e.title)}</b><small>${esc(e.code)} • ${esc(e.event_date||'-')}</small><small style="color:#416a96">${esc(e.work_units?.name||'Belum ditetapkan')}</small><div class="event-chip-row"><span class="status ${e.status}">${e.status}</span>${eventStateBadge(e)}</div></div>`).join(''):'<div class="muted" style="font-size:11px">Tidak ada kegiatan pada filter ini.</div>';
  document.querySelectorAll('.event-item').forEach(x=>x.onclick=ev=>{if(ev.target.closest('.event-actions'))return;selectEvent(x.dataset.id)});
  document.querySelectorAll('[data-event-menu-btn]').forEach(b=>b.onclick=e=>{e.stopPropagation();const id=b.dataset.eventMenuBtn;document.querySelectorAll('.event-menu').forEach(m=>m.classList.toggle('show',m.id==='event-menu-'+id&&!m.classList.contains('show')))});
  document.querySelectorAll('[data-event-edit]').forEach(b=>b.onclick=e=>{e.stopPropagation();closeEventMenus();editEventFromMenu(b.dataset.eventEdit)});
  document.querySelectorAll('[data-event-detail]').forEach(b=>b.onclick=e=>{e.stopPropagation();closeEventMenus();selectEvent(b.dataset.eventDetail)});
  document.querySelectorAll('[data-event-restore]').forEach(b=>b.onclick=e=>{e.stopPropagation();restoreArchivedEvent(b.dataset.eventRestore)});
  document.querySelectorAll('[data-event-archive]').forEach(b=>b.onclick=e=>{e.stopPropagation();closeEventMenus();archiveEvent(b.dataset.eventArchive)});
  document.querySelectorAll('[data-event-delete]').forEach(b=>b.onclick=e=>{e.stopPropagation();closeEventMenus();deleteEventPermanent(b.dataset.eventDelete)});
}
function closeEventMenus(){document.querySelectorAll('.event-menu').forEach(m=>m.classList.remove('show'))}
document.addEventListener('click',e=>{if(!e.target.closest('.event-actions'))closeEventMenus()});
function editEventFromMenu(id){window.KabayanWorkflow?.show(0);selectEvent(id,false);$('settingsPanel').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>$('eventTitle').focus(),300)}

function renderCopySources(){
  $('copySource').innerHTML='<option value="">Salin dari kegiatan...</option>'+
    events.filter(e=>e.id!==currentEvent?.id).map(e=>`<option value="${e.id}">${esc(e.title)}</option>`).join('');
}

$('unitFilter').onchange=e=>{
  unitFilterValue=e.target.value;
  renderEvents();
};

$('newEventBtn').onclick=()=>{currentEvent=null;editingQuestion=null;editingEval=null;['eventTitle','eventCode','eventDate','eventIssuer','eventSignerName','eventSignerTitle'].forEach(id=>$(id).value='');$('eventPattern').value='SERT-{SEQ}/{YEAR}';$('eventSeq').value=1;$('eventMinPosttest').value=70;$('eventWorkUnit').value=currentProfile?.role==='satker'?(currentProfile.work_unit_id||''):'';$('editorTitle').textContent='Buat Kegiatan';$('eventStatus').className='status draft';$('eventStatus').textContent='DRAFT';$('publishEventBtn').disabled=true;$('closeEventBtn').disabled=true;['phasePanel','questionPanel','evaluationPanel','monitorPanel','certificatePanel','reportPanel'].forEach(id=>$(id).style.display='none');renderEvents();renderCopySources()};

async function selectEvent(id,scroll=true){
  currentEvent=events.find(e=>e.id===id);if(!currentEvent)return;
  $('eventTitle').value=currentEvent.title||'';$('eventCode').value=currentEvent.code||'';$('eventDate').value=currentEvent.event_date||'';$('eventIssuer').value=currentEvent.issuer||'';$('eventWorkUnit').value=currentEvent.work_unit_id||'';$('eventWorkUnitReadonly').value=currentEvent.work_units?[currentEvent.work_units.code,currentEvent.work_units.name].filter(Boolean).join(' — '):[currentProfile?.work_unit_code,currentProfile?.work_unit_name].filter(Boolean).join(' — ');$('eventSignerName').value=currentEvent.signer_name||'';$('eventSignerTitle').value=currentEvent.signer_title||'';$('eventPattern').value=currentEvent.number_pattern||'SERT-{SEQ}/{YEAR}';$('eventSeq').value=currentEvent.next_sequence||1;$('eventMinPosttest').value=currentEvent.minimum_posttest_score??70;
  $('editorTitle').textContent='Pengaturan Kegiatan';$('eventStatus').className='status '+currentEvent.status;$('eventStatus').textContent=currentEvent.status.toUpperCase();
  $('publishEventBtn').disabled=currentEvent.status==='published';$('closeEventBtn').disabled=currentEvent.status==='closed';
  ['phasePanel','questionPanel','evaluationPanel','monitorPanel','certificatePanel','reportPanel'].forEach(id=>$(id).style.display='block');
  window.KabayanWorkflow?.selected(scroll);
  renderPhases();renderEvents();renderCopySources();await loadQuestions();await loadParticipants();await loadCertificates();if(scroll)window.scrollTo({top:0,behavior:'smooth'})
}
function renderPhases(){
  if(!currentEvent)return;
  $('initialLink').innerHTML=`<a target="_blank" href="${initialUrl(currentEvent)}">${initialUrl(currentEvent)}</a>`;
  $('finalLink').innerHTML=`<a target="_blank" href="${finalUrl(currentEvent)}">${finalUrl(currentEvent)}</a>`;
  $('initialBadge').textContent=currentEvent.initial_phase_open?'DIBUKA':'DITUTUP';$('initialBadge').className='status '+(currentEvent.initial_phase_open?'phase-open':'phase-closed');
  $('finalBadge').textContent=currentEvent.final_phase_open?'DIBUKA':'BELUM DIBUKA';$('finalBadge').className='status '+(currentEvent.final_phase_open?'phase-open':'phase-closed');
  $('openInitialBtn').disabled=!!currentEvent.initial_phase_open;$('closeInitialBtn').disabled=!currentEvent.initial_phase_open;
  $('openFinalBtn').disabled=!!currentEvent.final_phase_open;$('closeFinalBtn').disabled=!currentEvent.final_phase_open
}
async function updatePhase(field,value){if(!currentEvent)return;const {error}=await sb.from('external_events').update({[field]:value,updated_at:new Date().toISOString()}).eq('id',currentEvent.id);if(error)return msg('eventErr',error.message);await loadEvents()}
$('copyInitialBtn').onclick=()=>currentEvent&&copyText(initialUrl(currentEvent));
$('copyFinalBtn').onclick=()=>currentEvent&&copyText(finalUrl(currentEvent));
$('openInitialBtn').onclick=()=>updatePhase('initial_phase_open',true);$('closeInitialBtn').onclick=()=>updatePhase('initial_phase_open',false);
$('openFinalBtn').onclick=()=>updatePhase('final_phase_open',true);$('closeFinalBtn').onclick=()=>updatePhase('final_phase_open',false);

$('saveEventBtn').onclick=async()=>{
  try{
    const workUnitId=currentProfile?.role==='admin'
      ? $('eventWorkUnit').value
      : currentProfile?.work_unit_id;

    if(!workUnitId)throw new Error('Satuan Kerja pemilik kegiatan wajib dipilih.');

    const row={
      title:$('eventTitle').value.trim(),
      code:$('eventCode').value.trim(),
      event_date:$('eventDate').value||null,
      issuer:$('eventIssuer').value.trim()||null,
      work_unit_id:workUnitId,
      signer_name:$('eventSignerName').value.trim()||null,
      signer_title:$('eventSignerTitle').value.trim()||null,
      number_pattern:$('eventPattern').value.trim()||`CERT-{SEQ}/${workUnits.find(u=>u.id===workUnitId)?.code||currentProfile?.work_unit_code||''}/{YEAR}`,
      next_sequence:Number($('eventSeq').value)||1,
      minimum_posttest_score:Math.max(0,Math.min(100,Number($('eventMinPosttest').value)||70)),
      updated_at:new Date().toISOString()
    };

    if(!row.number_pattern || row.number_pattern.includes('//'))throw new Error('Kode satker untuk format nomor belum tersedia. Pilih satker atau isi format nomor.');
    if(!row.title||!row.code)throw new Error('Nama kegiatan dan kode link wajib diisi.');

    let res;

    if(currentEvent){
      res=await sb.from('external_events')
        .update(row)
        .eq('id',currentEvent.id)
        .select('*,work_units(id,code,name)')
        .single();
    }else{
      const {data:{user}}=await sb.auth.getUser();
      res=await sb.from('external_events')
        .insert({...row,created_by:user.id})
        .select('*,work_units(id,code,name)')
        .single();
    }

    if(res.error)throw res.error;

    currentEvent=res.data;
    msg('eventOk','Kegiatan tersimpan.',true);
    await loadEvents();
    await selectEvent(currentEvent.id,false);
    return true;
  }catch(e){
    msg('eventErr',e.message);
    return false;
  }
};

$('publishEventBtn').onclick=async()=>{if(!currentEvent)return;const {error}=await sb.from('external_events').update({status:'published',initial_phase_open:true,final_phase_open:false,updated_at:new Date().toISOString()}).eq('id',currentEvent.id);if(error)return msg('eventErr',error.message);msg('eventOk','Kegiatan dipublish. Fase Awal dibuka; Fase Akhir tetap ditutup.',true);await loadEvents()};
$('closeEventBtn').onclick=async()=>{if(!currentEvent||!confirm('Tutup seluruh kegiatan? Kedua fase akan ditutup.'))return;const {error}=await sb.from('external_events').update({status:'closed',initial_phase_open:false,final_phase_open:false,updated_at:new Date().toISOString()}).eq('id',currentEvent.id);if(error)return msg('eventErr',error.message);await loadEvents()};

document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{
  currentTest=b.dataset.test;
  document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));
  $('copyPretestBtn').style.display=currentTest==='posttest'?'inline-flex':'none';
  editingQuestion=null;
  clearQuestion();
  loadQuestions();
});
function clearQuestion(){['qText','qA','qB','qC','qD','qCategory'].forEach(id=>$(id).value='');$('qCorrect').value='A';$('qWeight').value=1;$('qOrder').value=1;editingQuestion=null;$('saveQuestionBtn').textContent='Simpan Soal'}
$('clearQuestionBtn').onclick=clearQuestion;
async function loadQuestions(){if(!currentEvent)return;const {data,error}=await sb.from('external_questions').select('*').eq('event_id',currentEvent.id).eq('test_type',currentTest).order('sort_order');if(error)return msg('questionErr',error.message);$('questionRows').innerHTML=(data||[]).map((q,i)=>`<tr><td>${i+1}</td><td><b>${esc(q.question_text)}</b><div class="muted" style="margin-top:5px">${esc(q.option_a)} / ${esc(q.option_b)} / ${esc(q.option_c)} / ${esc(q.option_d)}</div></td><td>${q.correct_answer}</td><td>${q.weight}</td><td><div class="actions"><button class="btn btn-outline" data-edit="${q.id}">Edit</button><button class="btn btn-red" data-del="${q.id}">Hapus</button></div></td></tr>`).join('')||'<tr><td colspan="5" class="muted">Belum ada soal.</td></tr>';document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editQuestion(b.dataset.edit,data));document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>deleteQuestion(b.dataset.del))}
function editQuestion(id,data){const q=data.find(x=>x.id===id);if(!q)return;editingQuestion=q;$('qText').value=q.question_text;$('qA').value=q.option_a;$('qB').value=q.option_b;$('qC').value=q.option_c;$('qD').value=q.option_d;$('qCorrect').value=q.correct_answer;$('qWeight').value=q.weight;$('qCategory').value=q.category||'';$('qOrder').value=q.sort_order;$('saveQuestionBtn').textContent='Update Soal'}
$('saveQuestionBtn').onclick=async()=>{try{if(!currentEvent)throw new Error('Pilih kegiatan.');const row={event_id:currentEvent.id,test_type:currentTest,question_text:$('qText').value.trim(),option_a:$('qA').value.trim(),option_b:$('qB').value.trim(),option_c:$('qC').value.trim(),option_d:$('qD').value.trim(),correct_answer:$('qCorrect').value,weight:Number($('qWeight').value)||1,category:$('qCategory').value.trim()||null,sort_order:Number($('qOrder').value)||1};if(!row.question_text||!row.option_a||!row.option_b||!row.option_c||!row.option_d)throw new Error('Pertanyaan dan semua pilihan wajib diisi.');const res=editingQuestion?await sb.from('external_questions').update(row).eq('id',editingQuestion.id):await sb.from('external_questions').insert(row);if(res.error)throw res.error;clearQuestion();msg('questionOk','Soal tersimpan.',true);loadQuestions()}catch(e){msg('questionErr',e.message)}};
async function deleteQuestion(id){if(!confirm('Hapus soal ini?'))return;const {error}=await sb.from('external_questions').delete().eq('id',id);if(error)return msg('questionErr',error.message);loadQuestions()}
$('questionImport').onchange=async e=>{try{if(!currentEvent)throw new Error('Pilih kegiatan dahulu.');const file=e.target.files[0];if(!file)return;const buf=await file.arrayBuffer();const wb=XLSX.read(buf,{type:'array'});const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:''});const inserts=rows.filter(r=>['pretest','posttest'].includes(String(r.tipe||'').toLowerCase())).map((r,i)=>({event_id:currentEvent.id,test_type:String(r.tipe).toLowerCase(),category:String(r.kategori||'').trim()||null,question_text:String(r.pertanyaan||'').trim(),option_a:String(r.opsi_a||'').trim(),option_b:String(r.opsi_b||'').trim(),option_c:String(r.opsi_c||'').trim(),option_d:String(r.opsi_d||'').trim(),correct_answer:String(r.jawaban_benar||'').trim().toUpperCase(),weight:Number(r.bobot)||1,sort_order:Number(r.urutan)||i+1})).filter(r=>r.question_text&&['A','B','C','D'].includes(r.correct_answer));if(!inserts.length)throw new Error('Tidak ada baris soal valid.');const {error}=await sb.from('external_questions').insert(inserts);if(error)throw error;msg('questionOk',`${inserts.length} soal berhasil diimport.`,true);loadQuestions()}catch(err){msg('questionErr',err.message)}finally{e.target.value=''}};

$('copyPretestBtn').onclick=async()=>{
  try{
    if(!currentEvent)throw new Error('Pilih kegiatan dahulu.');
    if(currentTest!=='posttest')throw new Error('Buka tab Posttest terlebih dahulu.');

    const {data:pre,error:preErr}=await sb
      .from('external_questions')
      .select('*')
      .eq('event_id',currentEvent.id)
      .eq('test_type','pretest')
      .eq('active',true)
      .order('sort_order');

    if(preErr)throw preErr;
    if(!pre?.length)throw new Error('Pretest kegiatan ini belum memiliki soal.');

    const {count:postCount,error:postErr}=await sb
      .from('external_questions')
      .select('id',{count:'exact',head:true})
      .eq('event_id',currentEvent.id)
      .eq('test_type','posttest')
      .eq('active',true);

    if(postErr)throw postErr;

    if((postCount||0)>0){
      const ok=confirm(
        'Posttest sudah memiliki '+postCount+' soal.\n\n'+
        'Salinan dari Pretest akan DITAMBAHKAN, bukan mengganti soal yang sudah ada.\n\nLanjutkan?'
      );
      if(!ok)return;
    }

    const rows=pre.map(q=>({
      event_id:currentEvent.id,
      test_type:'posttest',
      category:q.category,
      question_text:q.question_text,
      option_a:q.option_a,
      option_b:q.option_b,
      option_c:q.option_c,
      option_d:q.option_d,
      correct_answer:q.correct_answer,
      weight:q.weight,
      sort_order:q.sort_order,
      active:true
    }));

    const {error}=await sb.from('external_questions').insert(rows);
    if(error)throw error;

    msg('questionOk',rows.length+' soal Pretest berhasil disalin ke Posttest.',true);
    await loadQuestions();
  }catch(e){
    msg('questionErr',e.message);
  }
};

$('copyBtn').onclick=async()=>{try{if(!currentEvent)throw new Error('Pilih kegiatan tujuan.');const source=$('copySource').value;if(!source)throw new Error('Pilih kegiatan sumber.');const {data,error}=await sb.from('external_questions').select('*').eq('event_id',source).eq('test_type',currentTest).eq('active',true).order('sort_order');if(error)throw error;if(!data?.length)throw new Error('Kegiatan sumber belum memiliki soal.');const rows=data.map(q=>({event_id:currentEvent.id,test_type:currentTest,category:q.category,question_text:q.question_text,option_a:q.option_a,option_b:q.option_b,option_c:q.option_c,option_d:q.option_d,correct_answer:q.correct_answer,weight:q.weight,sort_order:q.sort_order,active:true}));const res=await sb.from('external_questions').insert(rows);if(res.error)throw res.error;msg('questionOk',`${rows.length} soal disalin.`,true);loadQuestions()}catch(e){msg('questionErr',e.message)}};

function syncParticipantSelectionUI(){
  const boxes=[...document.querySelectorAll('.participant-check')];
  const checked=boxes.filter(b=>b.checked);

  participantSelection=new Set(checked.map(b=>b.value));

  $('selectedParticipantCount').textContent=participantSelection.size+' dipilih';
  $('deleteSelectedParticipants').disabled=participantSelection.size===0;

  const all=$('participantSelectAll');
  if(all){
    all.checked=boxes.length>0 && checked.length===boxes.length;
    all.indeterminate=checked.length>0 && checked.length<boxes.length;
  }
}

function wireParticipantSelection(){
  const all=$('participantSelectAll');
  const boxes=[...document.querySelectorAll('.participant-check')];

  if(all){
    all.onchange=()=>{
      boxes.forEach(box=>box.checked=all.checked);
      syncParticipantSelectionUI();
    };
  }

  boxes.forEach(box=>{
    box.onchange=syncParticipantSelectionUI;
  });

  document.querySelectorAll('[data-delete-participant]').forEach(btn=>{
    btn.onclick=()=>deleteParticipants([btn.dataset.deleteParticipant],1);
  });

  syncParticipantSelectionUI();
}

async function loadParticipants(){
  if(!currentEvent)return;

  participantSelection.clear();

  const [{data:rows,error},{data:certs,error:certError}]=await Promise.all([
    sb.from('external_participants')
      .select('*')
      .eq('event_id',currentEvent.id)
      .order('created_at',{ascending:false}),
    sb.from('external_certificates')
      .select('participant_id,status,certificate_number')
      .eq('event_id',currentEvent.id)
  ]);

  if(error)return msg('participantErr',error.message);
  if(certError)return msg('participantErr',certError.message);

  const participants=rows||[];
  const certMap=new Map((certs||[]).map(c=>[c.participant_id,c]));

  $('mHadir').textContent=participants.filter(x=>x.attendance_completed).length;
  $('mPre').textContent=participants.filter(x=>x.pretest_completed).length;
  $('mPost').textContent=participants.filter(x=>x.posttest_completed).length;
  $('mEval').textContent=participants.filter(x=>x.evaluation_completed).length;
  $('mCert').textContent=(certs||[]).filter(c=>c.status==='valid').length;

  $('participantRows').innerHTML=participants.map(p=>{
    const cert=certMap.get(p.id);
    let certLabel='—';

    if(cert?.status==='valid'){
      certLabel='<span class="status published">VALID</span>';
    }else if(cert?.status==='revoked'){
      certLabel='<span class="status closed">DICABUT</span>';
    }else if(p.certificate_admin_state==='deleted'){
      certLabel='<span class="status closed">DIHAPUS</span>';
    }else if(p.evaluation_completed && Number(p.posttest_score||0)<Number(currentEvent.minimum_posttest_score??70)){
      certLabel='Tidak Lulus';
    }

    return `<tr>
      <td><input class="participant-check" type="checkbox" value="${p.id}" aria-label="Pilih ${esc(p.name)}"></td>
      <td>${esc(p.name)}</td>
      <td>${esc(p.email)}</td>
      <td>${p.attendance_completed?'✓':'—'}</td>
      <td>${p.pretest_completed?'✓ '+(p.pretest_score??''):'—'}</td>
      <td>${p.posttest_completed?'✓ '+(p.posttest_score??''):'—'}</td>
      <td>${p.evaluation_completed?'✓':'—'}</td>
      <td>${certLabel}</td>
      <td><button class="btn btn-red" data-delete-participant="${p.id}">Hapus</button></td>
    </tr>`;
  }).join('')||'<tr><td colspan="9" class="muted">Belum ada peserta.</td></tr>';

  wireParticipantSelection();
}

async function deleteParticipants(ids,knownCount=null){
  const clean=[...new Set((ids||[]).filter(Boolean))];
  if(!clean.length)return;

  const count=knownCount??clean.length;
  const wording=count===1?'peserta ini':count+' peserta yang dipilih';

  const ok=confirm(
    'Hapus permanen '+wording+'?\n\n'+
    'Data kehadiran, Pretest, Posttest, Evaluasi, dan Sertifikat yang terkait juga akan dihapus.\n\n'+
    'Tindakan ini tidak dapat dibatalkan.'
  );
  if(!ok)return;

  const typed=prompt('Untuk memastikan, ketik HAPUS lalu tekan OK.');
  if(typed!=='HAPUS'){
    return msg('participantErr','Penghapusan dibatalkan karena konfirmasi tidak sesuai.');
  }

  const {data,error}=await sb.rpc('admin_delete_external_participants',{
    p_participant_ids:clean
  });

  if(error)return msg('participantErr',error.message);

  const deleted=Number(data??count);
  participantSelection.clear();

  msg('participantOk',deleted+' peserta berhasil dihapus permanen.',true);

  await loadParticipants();
  await loadCertificates();
}

$('deleteSelectedParticipants').onclick=()=>{
  deleteParticipants([...participantSelection]);
};

$('refreshParticipants').onclick=async()=>{
  await loadParticipants();
  await loadCertificates();
};

function certificateStatusBadge(status){
  if(status==='valid') return '<span class="status published">VALID</span>';
  if(status==='revoked') return '<span class="status closed">DICABUT</span>';
  return `<span class="status draft">${esc(status||'-')}</span>`;
}

function formatAdminDate(value){
  if(!value)return '—';
  try{
    return new Intl.DateTimeFormat('id-ID',{
      day:'2-digit',month:'short',year:'numeric',
      hour:'2-digit',minute:'2-digit'
    }).format(new Date(value));
  }catch{
    return value;
  }
}

async function loadCertificates(){
  if(!currentEvent)return;

  const {data,error}=await sb.from('external_certificates')
    .select('*')
    .eq('event_id',currentEvent.id)
    .order('issued_at',{ascending:false});

  if(error){
    return msg('certificateErr',error.message);
  }

  const rows=data||[];
  $('mCert').textContent=rows.filter(c=>c.status==='valid').length;

  $('certificateRows').innerHTML=rows.map(c=>`
    <tr>
      <td><b>${esc(c.certificate_number)}</b><div class="muted" style="margin-top:4px;font-size:9px">${esc(c.verification_code)}</div></td>
      <td>${esc(c.recipient_name)}</td>
      <td>${certificateStatusBadge(c.status)}</td>
      <td>${formatAdminDate(c.issued_at)}</td>
      <td>
        <div class="actions">
          ${c.status==='valid'
            ? `<button class="btn btn-outline" data-revoke-cert="${c.id}">Cabut</button>`
            : `<button class="btn btn-green" data-restore-cert="${c.id}">Aktifkan Kembali</button>`}
          <button class="btn btn-red" data-delete-cert="${c.id}" data-cert-number="${esc(c.certificate_number)}">Hapus Permanen</button>
        </div>
      </td>
    </tr>
  `).join('')||'<tr><td colspan="5" class="muted">Belum ada sertifikat pada kegiatan ini.</td></tr>';

  document.querySelectorAll('[data-revoke-cert]').forEach(btn=>{
    btn.onclick=()=>revokeCertificate(btn.dataset.revokeCert);
  });

  document.querySelectorAll('[data-restore-cert]').forEach(btn=>{
    btn.onclick=()=>restoreCertificate(btn.dataset.restoreCert);
  });

  document.querySelectorAll('[data-delete-cert]').forEach(btn=>{
    btn.onclick=()=>deleteCertificate(btn.dataset.deleteCert,btn.dataset.certNumber);
  });
}

async function revokeCertificate(id){
  if(!confirm(
    'Cabut sertifikat ini?\n\n'+
    'Sertifikat tetap tersimpan, tetapi status verifikasi akan menjadi DICABUT dan peserta tidak dapat mengunduh sertifikat valid.'
  ))return;

  const {error}=await sb.rpc('admin_revoke_external_certificate',{
    p_certificate_id:id
  });

  if(error)return msg('certificateErr',error.message);

  msg('certificateOk','Sertifikat berhasil dicabut.',true);
  await loadCertificates();
  await loadParticipants();
}

async function restoreCertificate(id){
  if(!confirm('Aktifkan kembali sertifikat yang dicabut ini?'))return;

  const {error}=await sb.rpc('admin_restore_external_certificate',{
    p_certificate_id:id
  });

  if(error)return msg('certificateErr',error.message);

  msg('certificateOk','Sertifikat berhasil diaktifkan kembali.',true);
  await loadCertificates();
  await loadParticipants();
}

async function deleteCertificate(id,number){
  const ok=confirm(
    'HAPUS PERMANEN sertifikat '+number+'?\n\n'+
    'Tindakan ini menghapus record sertifikat dari database. Nomor sertifikat tidak akan digunakan kembali.'
  );
  if(!ok)return;

  const typed=prompt(
    'Untuk memastikan, ketik HAPUS lalu tekan OK.'
  );

  if(typed!=='HAPUS'){
    return msg('certificateErr','Penghapusan dibatalkan karena konfirmasi tidak sesuai.');
  }

  const {error}=await sb.rpc('admin_delete_external_certificate',{
    p_certificate_id:id
  });

  if(error)return msg('certificateErr',error.message);

  msg('certificateOk','Sertifikat berhasil dihapus permanen.',true);
  await loadCertificates();
  await loadParticipants();
}

$('refreshCertificates').onclick=async()=>{
  await loadCertificates();
  await loadParticipants();
};

// ============================================================
// LAPORAN & EXPORT
// ============================================================

const REPORT_Q11 = [
  'Materi penyuluhan yang disampaikan sesuai dengan kebutuhan',
  'Materi penyuluhan yang disampaikan mudah dipahami',
  'Penyuluh mampu berkomunikasi dengan baik dan menjelaskan materi dengan jelas dan efektif',
  'Penyuluh mampu menjawab pertanyaan yang ada dengan baik',
  'Penyuluh memiliki sikap dan etika yang profesional',
  'Kegiatan penyuluhan dilakukan dengan lancar dan efektif',
  'Kegiatan penyuluhan membantu saya memahami perpajakan dengan lebih baik'
];

const REPORT_Q14 = [
  'Saya pikir bahwa saya akan lebih sering menggunakan Coretax DJP',
  'Saya menemukan bahwa Coretax DJP tidak harus dibuat serumit ini',
  'Saya merasa penggunaan Coretax DJP mudah',
  'Saya membutuhkan bantuan dari orang yang memiliki kemampuan teknis untuk dapat menggunakan Coretax DJP',
  'Saya merasa fitur-fitur dalam Coretax DJP terintegrasi dengan baik',
  'Saya merasa ada banyak hal yang belum konsisten pada Coretax DJP',
  'Saya merasa mayoritas pengguna akan dapat mempelajari Coretax DJP dengan cepat',
  'Saya merasa Coretax DJP membingungkan untuk digunakan',
  'Saya merasa percaya diri mampu menggunakan Coretax DJP',
  'Saya perlu mempelajari banyak hal terlebih dahulu sebelum dapat menggunakan Coretax DJP'
];

const LIKERT_LABELS={
  5:'Sangat Setuju',
  4:'Setuju',
  3:'Cukup Setuju',
  2:'Kurang Setuju',
  1:'Tidak Setuju'
};

function safeFileName(value){
  return String(value||'laporan')
    .replace(/[^a-z0-9_-]+/gi,'-')
    .replace(/^-+|-+$/g,'')
    .toLowerCase();
}

function reportEventName(){
  return currentEvent?.title||'Kegiatan';
}

function reportFileBase(){
  return safeFileName(currentEvent?.code||currentEvent?.title||'kegiatan');
}

function formatReportDate(value){
  if(!value)return '—';
  try{
    return new Intl.DateTimeFormat('id-ID',{
      day:'2-digit',month:'long',year:'numeric'
    }).format(new Date(value));
  }catch{
    return value;
  }
}

function formatReportDateTime(value){
  if(!value)return '—';
  try{
    return new Intl.DateTimeFormat('id-ID',{
      day:'2-digit',month:'2-digit',year:'numeric',
      hour:'2-digit',minute:'2-digit'
    }).format(new Date(value));
  }catch{
    return value;
  }
}

function optionText(q,letter){
  if(!q||!letter)return '';
  const key='option_'+String(letter).toLowerCase();
  const text=q[key]||'';
  return text ? `${letter}. ${text}` : letter;
}

function printHeader(title){
  const eventDate=formatReportDate(currentEvent?.event_date);
  return `
    <div class="report-head">
      <div class="brand">Kabayan / Sertifikat Edukasi</div>
      <h1>${esc(title)}</h1>
      <h2>${esc(reportEventName())}</h2>
      <div class="meta">${esc(eventDate)}${currentEvent?.issuer?' • '+esc(currentEvent.issuer):''}</div>
    </div>
  `;
}

function openPrintWindow(title,bodyHtml,orientation='landscape',existingWindow=null){
  const w=existingWindow||window.open('','_blank');
  if(!w){
    msg('reportErr','Popup cetak diblokir browser. Izinkan pop-up untuk situs ini.');
    return null;
  }

  w.document.write(`<!doctype html>
  <html lang="id">
  <head>
    <meta charset="utf-8">
    <title>${esc(title)}</title>
    <style>
      @page{size:A4 ${orientation};margin:12mm}
      *{box-sizing:border-box}
      body{font-family:Arial,sans-serif;color:#111;margin:0;font-size:10pt}
      .report-head{border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:14px}
      .report-head .brand{font-size:9pt;font-weight:700;color:#18457a}
      .report-head h1{font-size:18pt;margin:7px 0 2px}
      .report-head h2{font-size:12pt;margin:0 0 4px}
      .meta{font-size:9pt;color:#555}
      table{border-collapse:collapse;width:100%;margin:8px 0 18px}
      th,td{border:1px solid #bbb;padding:5px 6px;vertical-align:top}
      th{background:#f2f4f7;font-weight:700}
      .participant{page-break-inside:avoid;margin:0 0 18px}
      .participant + .participant{page-break-before:auto}
      .identity{display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;margin:8px 0}
      .identity div{padding:2px 0}
      .score{font-size:12pt;font-weight:700;margin:8px 0}
      .status-pass{font-weight:700;color:#067647}
      .status-fail{font-weight:700;color:#b42318}
      .small{font-size:8.5pt;color:#555}
      @media print{
        button{display:none!important}
        a{text-decoration:none;color:inherit}
      }
    </style>
  </head>
  <body>${bodyHtml}</body>
  </html>`);
  w.document.close();
  w.focus();
  setTimeout(()=>w.print(),250);
  return w;
}

async function getReportParticipants(){
  if(!currentEvent)throw new Error('Pilih kegiatan terlebih dahulu.');
  const {data,error}=await sb.from('external_participants')
    .select('*')
    .eq('event_id',currentEvent.id)
    .order('created_at',{ascending:true});
  if(error)throw error;
  return data||[];
}

async function getReportQuestions(type){
  const {data,error}=await sb.from('external_questions')
    .select('*')
    .eq('event_id',currentEvent.id)
    .eq('test_type',type)
    .order('sort_order',{ascending:true});
  if(error)throw error;
  return data||[];
}

async function getReportAnswers(participantIds,type){
  if(!participantIds.length)return [];
  const results=[];
  const chunkSize=100;

  for(let i=0;i<participantIds.length;i+=chunkSize){
    const ids=participantIds.slice(i,i+chunkSize);
    const {data,error}=await sb.from('external_answers')
      .select('*')
      .in('participant_id',ids)
      .eq('test_type',type);
    if(error)throw error;
    results.push(...(data||[]));
  }
  return results;
}

async function getStructuredEvaluations(){
  const {data,error}=await sb.from('external_structured_evaluations')
    .select('*')
    .eq('event_id',currentEvent.id)
    .order('created_at',{ascending:true});
  if(error)throw error;
  return data||[];
}

function autoWidthSheet(ws,rows,max=42){
  const widths=[];
  rows.forEach(row=>{
    row.forEach((value,i)=>{
      const len=Math.min(max,Math.max(8,String(value??'').length+2));
      widths[i]=Math.max(widths[i]||8,len);
    });
  });
  ws['!cols']=widths.map(w=>({wch:w}));
  if(rows.length)ws['!autofilter']={ref:XLSX.utils.encode_range({r:0,c:0},{r:Math.max(0,rows.length-1),c:Math.max(0,rows[0].length-1)})};
}

function makeSheet(rows){
  const ws=XLSX.utils.aoa_to_sheet(rows);
  autoWidthSheet(ws,rows);
  return ws;
}

function saveSingleSheetExcel(sheetName,rows,fileName){
  if(!window.XLSX)throw new Error('Library Excel belum termuat.');
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,makeSheet(rows),sheetName.substring(0,31));
  XLSX.writeFile(wb,fileName);
}

function attendanceRows(participants){
  return [
    ['No','Nama Peserta / Penerima Sertifikat','Nama Wajib Pajak','Nomor Handphone','Email','Usia','Jenis Kelamin','Waktu Daftar'],
    ...participants.filter(p=>p.attendance_completed).map((p,i)=>[
      i+1,
      p.name||'',
      p.taxpayer_name||p.institution||'',
      p.phone||'',
      p.email||'',
      p.age_range||'',
      p.gender||'',
      formatReportDateTime(p.created_at)
    ])
  ];
}

async function buildTestReport(type){
  const allParticipants=await getReportParticipants();
  const participants=allParticipants.filter(p=>type==='pretest'?p.pretest_completed:p.posttest_completed);
  const questions=await getReportQuestions(type);
  const answers=await getReportAnswers(participants.map(p=>p.id),type);

  const answerMap=new Map();
  answers.forEach(a=>answerMap.set(`${a.participant_id}:${a.question_id}`,a));

  return {participants,questions,answerMap};
}

function testExcelRows(type,data){
  const {participants,questions,answerMap}=data;
  const scoreKey=type==='pretest'?'pretest_score':'posttest_score';
  const minScore=Number(currentEvent?.minimum_posttest_score??70);

  const headers=[
    'No','Nama Peserta','Nama Wajib Pajak','Email',
    type==='pretest'?'Nilai Pretest':'Nilai Posttest'
  ];

  if(type==='posttest')headers.push('Status Kelulusan');

  questions.forEach((q,i)=>headers.push(`Q${i+1}: ${q.question_text}`));

  const rows=[headers];

  participants.forEach((p,i)=>{
    const row=[
      i+1,
      p.name||'',
      p.taxpayer_name||p.institution||'',
      p.email||'',
      p[scoreKey]??''
    ];

    if(type==='posttest'){
      row.push(Number(p.posttest_score||0)>=minScore?'Lulus':'Belum Lulus');
    }

    questions.forEach(q=>{
      const a=answerMap.get(`${p.id}:${q.id}`);
      if(!a){
        row.push('');
      }else{
        row.push(`${optionText(q,a.answer)} | ${a.is_correct?'Benar':'Salah'}`);
      }
    });

    rows.push(row);
  });

  return rows;
}

function testPrintHtml(type,data){
  const {participants,questions,answerMap}=data;
  const scoreKey=type==='pretest'?'pretest_score':'posttest_score';
  const title=type==='pretest'?'Hasil Pretest':'Hasil Posttest';
  const minScore=Number(currentEvent?.minimum_posttest_score??70);

  let body=printHeader(title);

  if(!participants.length){
    return body+'<p>Belum ada peserta yang menyelesaikan '+title+'.</p>';
  }

  body+=participants.map((p,idx)=>{
    let status='';
    if(type==='posttest'){
      const passed=Number(p.posttest_score||0)>=minScore;
      status=`<div class="${passed?'status-pass':'status-fail'}">${passed?'LULUS':'BELUM LULUS'} • Batas minimum ${minScore}</div>`;
    }

    const answerRows=questions.map((q,i)=>{
      const a=answerMap.get(`${p.id}:${q.id}`);
      return `<tr>
        <td>${i+1}</td>
        <td>${esc(q.question_text)}</td>
        <td>${esc(a?optionText(q,a.answer):'—')}</td>
        <td>${a?(a.is_correct?'Benar':'Salah'):'—'}</td>
      </tr>`;
    }).join('');

    return `<section class="participant">
      <h3>${idx+1}. ${esc(p.name||'')}</h3>
      <div class="identity">
        <div><b>Nama Wajib Pajak:</b> ${esc(p.taxpayer_name||p.institution||'—')}</div>
        <div><b>Email:</b> ${esc(p.email||'—')}</div>
      </div>
      <div class="score">Nilai: ${esc(p[scoreKey]??'—')}</div>
      ${status}
      <table>
        <thead><tr><th style="width:34px">No</th><th>Pertanyaan</th><th>Jawaban Peserta</th><th style="width:70px">Hasil</th></tr></thead>
        <tbody>${answerRows}</tbody>
      </table>
    </section>`;
  }).join('');

  return body;
}

function evaluationExcelRows(participants,evaluations){
  const participantMap=new Map(participants.map(p=>[p.id,p]));

  const headers=[
    'No','Nama Peserta','Nama Wajib Pajak','Email',
    ...REPORT_Q11.map((q,i)=>`11.${i+1} ${q}`),
    '12. Saran dan Masukan',
    '13. Pernah menggunakan Coretax DJP?',
    ...REPORT_Q14.map((q,i)=>`14.${i+1} ${q}`),
    '15. Usulan Penyempurnaan Coretax DJP',
    '16. Pernah melaporkan SPT Tahunan PPh melalui Coretax DJP?',
    '17. Dibimbing/diasistensi langsung oleh petugas pajak?'
  ];

  const rows=[headers];

  evaluations.forEach((ev,i)=>{
    const p=participantMap.get(ev.participant_id)||{};
    const a=ev.answers||{};
    const row=[
      i+1,
      p.name||'',
      p.taxpayer_name||p.institution||'',
      p.email||''
    ];

    for(let n=1;n<=REPORT_Q11.length;n++)row.push(a.q11?.[`q11_${n}`]??'');
    row.push(a.q12??'');
    row.push(a.q13??'');

    for(let n=1;n<=REPORT_Q14.length;n++)row.push(a.q14?.[`q14_${n}`]??'');
    row.push(a.q15??'');
    row.push(a.q16??'');
    row.push(a.q17??'');

    rows.push(row);
  });

  return rows;
}

function evaluationPrintHtml(participants,evaluations){
  const participantMap=new Map(participants.map(p=>[p.id,p]));
  let body=printHeader('Hasil Evaluasi Kegiatan');

  if(!evaluations.length)return body+'<p>Belum ada peserta yang menyelesaikan evaluasi.</p>';

  body+=evaluations.map((ev,idx)=>{
    const p=participantMap.get(ev.participant_id)||{};
    const a=ev.answers||{};

    const q11=REPORT_Q11.map((q,i)=>{
      const val=a.q11?.[`q11_${i+1}`];
      return `<tr><td>${i+1}</td><td>${esc(q)}</td><td>${esc(val?`${val} - ${LIKERT_LABELS[val]||''}`:'—')}</td></tr>`;
    }).join('');

    let conditional='';
    if(a.q13==='Ya'){
      const q14=REPORT_Q14.map((q,i)=>{
        const val=a.q14?.[`q14_${i+1}`];
        return `<tr><td>${i+1}</td><td>${esc(q)}</td><td>${esc(val?`${val} - ${LIKERT_LABELS[val]||''}`:'—')}</td></tr>`;
      }).join('');

      conditional=`
        <h4>14. Pernyataan Penggunaan Coretax DJP</h4>
        <table><thead><tr><th>No</th><th>Pernyataan</th><th>Jawaban</th></tr></thead><tbody>${q14}</tbody></table>
        <p><b>15. Usulan Penyempurnaan Coretax:</b><br>${esc(a.q15||'—')}</p>
        <p><b>16. Pernah melaporkan SPT Tahunan PPh melalui Coretax DJP?</b> ${esc(a.q16||'—')}</p>
        <p><b>17. Dibimbing/diasistensi langsung oleh petugas pajak?</b> ${esc(a.q17||'—')}</p>
      `;
    }

    return `<section class="participant">
      <h3>${idx+1}. ${esc(p.name||'')}</h3>
      <div class="identity">
        <div><b>Nama Wajib Pajak:</b> ${esc(p.taxpayer_name||p.institution||'—')}</div>
        <div><b>Email:</b> ${esc(p.email||'—')}</div>
      </div>

      <h4>11. Pernyataan Terkait Kegiatan Penyuluhan</h4>
      <table><thead><tr><th>No</th><th>Pernyataan</th><th>Jawaban</th></tr></thead><tbody>${q11}</tbody></table>

      <p><b>12. Saran dan Masukan:</b><br>${esc(a.q12||'—')}</p>
      <p><b>13. Pernah menggunakan Coretax DJP?</b> ${esc(a.q13||'—')}</p>

      ${conditional}
    </section>`;
  }).join('');

  return body;
}

async function printAttendanceReport(){
  try{
    const w=window.open('','_blank');
    if(!w)return msg('reportErr','Popup cetak diblokir browser.');
    const participants=await getReportParticipants();
    const rows=attendanceRows(participants);

    const body=printHeader('Daftar Hadir')+
      `<table>
        <thead><tr>${rows[0].map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows.slice(1).map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>`;

    openPrintWindow('Daftar Hadir - '+reportEventName(),body,'landscape',w);
  }catch(e){
    msg('reportErr',e.message);
  }
}

async function exportAttendanceExcel(){
  try{
    const participants=await getReportParticipants();
    saveSingleSheetExcel(
      'Daftar Hadir',
      attendanceRows(participants),
      `daftar-hadir-${reportFileBase()}.xlsx`
    );
    msg('reportOk','Daftar hadir berhasil diekspor ke Excel.',true);
  }catch(e){msg('reportErr',e.message)}
}

async function printTestReport(type){
  let holder=null;
  try{
    holder=window.open('','_blank');
    if(!holder)return msg('reportErr','Popup cetak diblokir browser.');
    const data=await buildTestReport(type);
    const title=type==='pretest'?'Hasil Pretest':'Hasil Posttest';
    const body=testPrintHtml(type,data);
    openPrintWindow(title+' - '+reportEventName(),body,'portrait',holder);
  }catch(e){
    if(holder&&!holder.closed)holder.close();
    msg('reportErr',e.message);
  }
}

async function exportTestExcel(type){
  try{
    const data=await buildTestReport(type);
    const title=type==='pretest'?'Hasil Pretest':'Hasil Posttest';
    saveSingleSheetExcel(
      title,
      testExcelRows(type,data),
      `${type}-${reportFileBase()}.xlsx`
    );
    msg('reportOk',title+' berhasil diekspor ke Excel.',true);
  }catch(e){msg('reportErr',e.message)}
}

async function printEvaluationReport(){
  let holder=null;
  try{
    holder=window.open('','_blank');
    if(!holder)return msg('reportErr','Popup cetak diblokir browser.');
    const [participants,evaluations]=await Promise.all([
      getReportParticipants(),
      getStructuredEvaluations()
    ]);
    const body=evaluationPrintHtml(participants,evaluations);
    openPrintWindow('Hasil Evaluasi - '+reportEventName(),body,'portrait',holder);
  }catch(e){
    if(holder&&!holder.closed)holder.close();
    msg('reportErr',e.message);
  }
}

async function exportEvaluationExcel(){
  try{
    const [participants,evaluations]=await Promise.all([
      getReportParticipants(),
      getStructuredEvaluations()
    ]);
    saveSingleSheetExcel(
      'Hasil Evaluasi',
      evaluationExcelRows(participants,evaluations),
      `evaluasi-${reportFileBase()}.xlsx`
    );
    msg('reportOk','Hasil evaluasi berhasil diekspor ke Excel.',true);
  }catch(e){msg('reportErr',e.message)}
}

async function exportAllReports(){
  try{
    if(!window.XLSX)throw new Error('Library Excel belum termuat.');

    const participants=await getReportParticipants();
    const preData=await buildTestReport('pretest');
    const postData=await buildTestReport('posttest');
    const evaluations=await getStructuredEvaluations();

    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,makeSheet(attendanceRows(participants)),'Daftar Hadir');
    XLSX.utils.book_append_sheet(wb,makeSheet(testExcelRows('pretest',preData)),'Pretest');
    XLSX.utils.book_append_sheet(wb,makeSheet(testExcelRows('posttest',postData)),'Posttest');
    XLSX.utils.book_append_sheet(wb,makeSheet(evaluationExcelRows(participants,evaluations)),'Evaluasi');

    XLSX.writeFile(wb,`laporan-lengkap-${reportFileBase()}.xlsx`);
    msg('reportOk','Laporan lengkap berhasil diekspor ke Excel dalam 4 sheet.',true);
  }catch(e){msg('reportErr',e.message)}
}

$('printAttendance').onclick=printAttendanceReport;
$('excelAttendance').onclick=exportAttendanceExcel;
$('printPretest').onclick=()=>printTestReport('pretest');
$('excelPretest').onclick=()=>exportTestExcel('pretest');
$('printPosttest').onclick=()=>printTestReport('posttest');
$('excelPosttest').onclick=()=>exportTestExcel('posttest');
$('printEvaluation').onclick=printEvaluationReport;
$('excelEvaluation').onclick=exportEvaluationExcel;
$('exportAllReports').onclick=exportAllReports;




async function loadEventManagement(){
  if(!currentProfile)return;
  const {data,error}=await sb.rpc('list_edu_event_management',{p_filter:eventManagementFilter});if(error)return msg('eventManageErr',error.message);
  const {data:summary}=await sb.rpc('get_edu_event_summary');if(summary?.length){const s=summary[0];$('mEventActive').textContent=s.active_count||0;$('mEventArchived').textContent=s.archived_count||0;$('mEventDeleted').textContent=s.deleted_count||0;$('mEventTotal').textContent=s.total_count||0}
  $('eventManagementRows').innerHTML=(data||[]).length?(data||[]).map(e=>`<tr><td><b>${esc(e.title)}</b><div class="muted" style="font-size:9px">${esc(e.code||'')}</div></td><td>${esc(e.event_date||'—')}</td><td>${esc(e.work_unit_name||'—')}</td><td>${e.participant_count||0}</td><td>${e.certificate_count||0}</td><td>${eventManagementStatus(e.lifecycle_status)}</td><td><div class="actions">${e.lifecycle_status!=='deleted'?`<button class="btn btn-outline" data-manage-edit="${e.event_id}">Edit</button>`:''}${e.lifecycle_status==='active'?`<button class="btn btn-outline" data-manage-archive="${e.event_id}">Arsipkan</button>`:''}${e.lifecycle_status==='archived'?`<button class="btn btn-green" data-manage-restore="${e.event_id}">Aktifkan</button>`:''}${e.lifecycle_status!=='deleted'?`<button class="btn btn-red" data-manage-delete="${e.event_id}" data-pcount="${e.participant_count||0}" data-ccount="${e.certificate_count||0}">Hapus</button>`:''}</div></td></tr>`).join(''):'<tr><td colspan="7" class="muted">Tidak ada kegiatan.</td></tr>';
  document.querySelectorAll('[data-manage-edit]').forEach(b=>b.onclick=()=>editEventFromMenu(b.dataset.manageEdit));
  document.querySelectorAll('[data-manage-archive]').forEach(b=>b.onclick=()=>archiveEvent(b.dataset.manageArchive));
  document.querySelectorAll('[data-manage-restore]').forEach(b=>b.onclick=()=>restoreArchivedEvent(b.dataset.manageRestore));
  document.querySelectorAll('[data-manage-delete]').forEach(b=>b.onclick=()=>deleteEventPermanent(b.dataset.manageDelete,Number(b.dataset.pcount),Number(b.dataset.ccount)));
}
function eventManagementStatus(s){return `<span class="status ${s==='active'?'event-state-active':s==='archived'?'event-state-archived':'event-state-deleted'}">${s==='active'?'AKTIF':s==='archived'?'ARSIP':'DIHAPUS'}</span>`}
async function archiveEvent(id){if(!confirm('Arsipkan kegiatan ini? Data peserta dan sertifikat tetap tersimpan.'))return;const {error}=await sb.rpc('archive_edu_event',{p_event_id:id});if(error)return msg('eventManageErr',error.message);if(currentEvent?.id===id)currentEvent=null;msg('eventManageOk','Kegiatan berhasil diarsipkan.',true);await loadEvents();await loadActivityLogs()}
async function restoreArchivedEvent(id){if(!confirm('Aktifkan kembali kegiatan ini?'))return;const {error}=await sb.rpc('restore_edu_event',{p_event_id:id});if(error)return msg('eventManageErr',error.message);msg('eventManageOk','Kegiatan kembali aktif.',true);await loadEvents();await loadActivityLogs()}
async function deleteEventPermanent(id,pcount=null,ccount=null){try{if(pcount===null||ccount===null){const {data,error}=await sb.rpc('get_edu_event_delete_impact',{p_event_id:id});if(error)throw error;const x=data?.[0]||{};pcount=Number(x.participant_count||0);ccount=Number(x.certificate_count||0)}if(!confirm(`HAPUS PERMANEN kegiatan ini?\n\nPeserta: ${pcount}\nSertifikat: ${ccount}\n\nSemua data terkait akan dihapus. Arsip lebih disarankan.`))return;const t=prompt('Ketik HAPUS KEGIATAN');if(t!=='HAPUS KEGIATAN')return;const {error}=await sb.rpc('delete_edu_event_permanently',{p_event_id:id});if(error)throw error;if(currentEvent?.id===id)currentEvent=null;msg('eventManageOk','Kegiatan berhasil dihapus permanen.',true);await loadEvents();await loadActivityLogs()}catch(e){msg('eventManageErr',e.message)}}
async function loadActivityLogs(){$('activityStatus').textContent='Memuat riwayat…';const {data,error}=await sb.rpc('list_edu_activity_logs',{p_limit:60});if(error){$('activityStatus').textContent='Riwayat belum dapat dimuat: '+error.message;return;}$('activityStatus').textContent='Menampilkan hingga 60 aktivitas terbaru sesuai akses akun.';$('activityRows').innerHTML=(data||[]).map(a=>`<div class="activity-item"><b>${esc(a.action_label||a.action)}</b><span>${esc(a.event_title||'—')} • ${esc(a.work_unit_name||'—')}</span><span>${esc(a.actor_email||a.actor_name||'Sistem')} • ${formatAdminDate(a.created_at)}</span>${a.description?`<span>${esc(a.description)}</span>`:''}</div>`).join('')||'<div class="muted">Belum ada riwayat aktivitas.</div>'}
$('showActiveEvents').onclick=async()=>{eventManagementFilter='active';await loadEventManagement()};
$('showArchivedEvents').onclick=async()=>{eventManagementFilter='archived';await loadEventManagement()};
$('showDeletedEvents').onclick=async()=>{eventManagementFilter='deleted';await loadEventManagement()};
$('refreshActivityBtn').onclick=loadActivityLogs;

// ============================================================
// ADMIN: SATUAN KERJA & USER PROFILE
// ============================================================

async function loadUserManagement(){
  if(currentProfile?.role!=='admin')return;

  await loadWorkUnits();

  const unitResult=await sb.from('work_units').select('*').order('name');
  if(unitResult.error)return msg('userErr',unitResult.error.message);
  window.kabayanManagedUnits=unitResult.data||[];
  $('workUnitRows').innerHTML=window.kabayanManagedUnits.length
    ? window.kabayanManagedUnits.map(u=>`<tr>
        <td><b>${esc(u.code)}</b></td>
        <td>${esc(u.name)}</td>
        <td><span class="status ${u.active?'published':'closed'}">${u.active?'AKTIF':'NONAKTIF'}</span></td><td><div class="actions"><button class="btn btn-outline" data-edit-unit="${u.id}">Edit / Status</button><button class="btn btn-red" data-delete-unit="${u.id}">Hapus</button></div></td>
      </tr>`).join('')
    : '<tr><td colspan="4" class="muted">Belum ada Satuan Kerja.</td></tr>';

  const {data,error}=await sb.rpc('admin_list_edu_users');
  if(error)return msg('userErr',error.message);

  allAuthUsers=data||[];
  renderUserProfiles();
}

function renderUserProfiles(){
  const unitOptionsFor=user=>workUnits.map(w=>`<option value="${w.id}" ${w.id===user.work_unit_id?'selected':''}>${esc(w.code)} — ${esc(w.name)}</option>`).join('');

  $('userProfileRows').innerHTML=allAuthUsers.length
    ? allAuthUsers.map(u=>`
      <tr>
        <td><b>${esc(u.email||'')}</b><div class="muted" style="font-size:9px;margin-top:4px">${esc(u.user_id)}</div></td>
        <td><input id="user-name-${u.user_id}" value="${esc(u.full_name||'')}" style="min-width:170px"></td>
        <td>
          <select id="user-role-${u.user_id}" data-user-role="${u.user_id}">
            <option value="">Belum diberi akses</option>
            <option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>
            <option value="satker" ${u.role==='satker'?'selected':''}>Satuan Kerja</option>
          </select>
        </td>
        <td>
          <select id="user-unit-${u.user_id}" ${u.role==='admin'?'disabled':''}>
            <option value="">Pilih Satuan Kerja...</option>
            ${unitOptionsFor(u)}
          </select>
        </td>
        <td>
          <div class="actions">
            <button class="btn btn-yellow" data-save-user="${u.user_id}">Simpan</button>
            ${u.role==='satker'?`<button class="btn btn-outline" data-reset-user="${u.user_id}">Reset Password</button>`:''}
            ${u.role?`<button class="btn btn-red" data-remove-user="${u.user_id}">Cabut Akses</button>`:''}
          </div>
        </td>
      </tr>
    `).join('')
    : '<tr><td colspan="5" class="muted">Belum ada akun Auth.</td></tr>';

  document.querySelectorAll('[data-user-role]').forEach(sel=>{
    sel.onchange=()=>{
      const id=sel.dataset.userRole;
      const unit=$('user-unit-'+id);
      unit.disabled=sel.value==='admin'||!sel.value;
      if(sel.value==='admin')unit.value='';
    };
  });

  document.querySelectorAll('[data-save-user]').forEach(btn=>{
    btn.onclick=()=>saveUserProfile(btn.dataset.saveUser);
  });

  document.querySelectorAll('[data-remove-user]').forEach(btn=>{
    btn.onclick=()=>removeUserProfile(btn.dataset.removeUser);
  });
}

async function saveUserProfile(userId){
  try{
    const role=$('user-role-'+userId).value;
    const fullName=$('user-name-'+userId).value.trim();
    const workUnitId=$('user-unit-'+userId).value||null;

    if(!role)throw new Error('Pilih role pengguna.');
    if(role==='satker'&&!workUnitId)throw new Error('Akun Satuan Kerja wajib memiliki Satuan Kerja.');

    const {error}=await sb.rpc('admin_upsert_edu_user_profile',{
      p_user_id:userId,
      p_full_name:fullName||null,
      p_role:role,
      p_work_unit_id:workUnitId
    });

    if(error)throw error;

    msg('userOk','Profil akses pengguna berhasil disimpan.',true);
    await loadUserManagement();
  }catch(e){
    msg('userErr',e.message);
  }
}

async function removeUserProfile(userId){
  if(!confirm('Cabut akses aplikasi untuk akun ini? Akun Auth tetap ada, tetapi tidak dapat membuka dashboard.'))return;

  const {error}=await sb.rpc('admin_remove_edu_user_profile',{p_user_id:userId});
  if(error)return msg('userErr',error.message);

  msg('userOk','Akses pengguna berhasil dicabut.',true);
  await loadUserManagement();
}

$('saveUnitBtn').onclick=async()=>{
  try{
    const code=$('newUnitCode').value.trim();
    const name=$('newUnitName').value.trim();

    if(!code||!name)throw new Error('Kode dan nama Satuan Kerja wajib diisi.');

    const {error}=await sb.from('work_units').insert({code,name});
    if(error)throw error;

    $('newUnitCode').value='';
    $('newUnitName').value='';
    msg('userOk','Satuan Kerja berhasil ditambahkan.',true);

    await loadUserManagement();
    await loadEvents();
  }catch(e){
    msg('userErr',e.message);
  }
};

$('refreshUsersBtn').onclick=loadUserManagement;

const toggleLoginPassword=$('toggleLoginPassword');
if(toggleLoginPassword){
  toggleLoginPassword.onclick=()=>{
    const input=$('loginPassword');
    const show=input.type==='password';
    input.type=show?'text':'password';
    toggleLoginPassword.textContent=show?'Tutup':'Lihat';
    toggleLoginPassword.setAttribute('aria-label',show?'Sembunyikan password':'Tampilkan password');
  };
}


