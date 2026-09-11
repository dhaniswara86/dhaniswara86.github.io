/* Alur enam langkah. Semua panel dan kontrol existing tetap dipakai. */
(() => {
  const groups = [
    ['Buat Kegiatan',['settingsPanel']],
    ['Pretest & Posttest',['questionPanel','evaluationPanel']],
    ['Link & QR Code',['phasePanel','qrPanel','qrHistoryPanel']],
    ['Monitoring Peserta',['monitorPanel']],
    ['Laporan & Ekspor Data',['reportPanel']],
    ['Arsip, Riwayat & Sertifikat',['eventManagementPanel','certificatePanel']]
  ];
  const container=document.querySelector('.sidebar-layout > section.grid');
  const nav=document.querySelector('.admin-quick-nav');nav.replaceChildren();nav.classList.add('step-nav');
  const pages=[];const buttons=[];let active=0;
  const intro=document.createElement('div');intro.className='workflow-intro';
  const title=document.createElement('h2');const context=document.createElement('p');
  context.id='workflowContext';intro.append(title,context);container.prepend(intro);
  const note=document.createElement('p');note.id='workflowNote';note.setAttribute('role','status');intro.append(note);
  groups.forEach(([label,ids],index)=>{
    const page=document.createElement('section');page.className='step-page';page.id='workflowStep'+(index+1);
    page.setAttribute('aria-label',`Langkah ${index+1}: ${label}`);
    ids.forEach(id=>page.append(document.getElementById(id)));
    container.append(page);pages.push(page);
    const button=document.createElement('button');button.type='button';button.className='step-button';
    const number=document.createElement('span');number.className='step-number';number.textContent=index+1;
    const text=document.createElement('span');text.textContent=label;button.append(number,text);
    button.setAttribute('aria-controls',page.id);button.onclick=()=>show(index);nav.append(button);buttons.push(button);
  });
  const accounts=document.getElementById('userManagementPanel');
  const accountButton=document.createElement('button');accountButton.type='button';accountButton.className='step-button admin-only';accountButton.textContent='Akun & Satuan Kerja';
  accountButton.onclick=()=>show(6);nav.append(accountButton);buttons.push(accountButton);container.append(accounts);pages.push(accounts);
  const footer=document.createElement('div');footer.className='workflow-footer';
  const back=document.createElement('button');back.type='button';back.className='btn btn-outline';back.textContent='← Sebelumnya';back.onclick=()=>show(active-1);
  const next=document.createElement('button');next.type='button';next.className='btn btn-yellow';
  next.onclick=async()=>{
    if(active===0){next.disabled=true;try{const saved=await document.getElementById('saveEventBtn').onclick();if(saved)show(1);}finally{next.disabled=false;}}
    else show(active+1);
  };
  footer.append(back,next);container.append(footer);
  // Publikasi dan penutupan ditempatkan bersama pengaturan fase dan link.
  const phaseActions=document.createElement('div');phaseActions.className='actions';
  phaseActions.append(document.getElementById('publishEventBtn'),document.getElementById('closeEventBtn'));
  document.getElementById('phasePanel').append(phaseActions);
  document.querySelector('#settingsPanel .section-title p').textContent='Isi identitas kegiatan, lalu simpan untuk melanjutkan ke penyusunan tes.';
  const qrSelect=document.getElementById('qrEvent');qrSelect.disabled=true;
  const qrLabel=document.querySelector('label[for="qrEvent"]');qrLabel.textContent='Kegiatan yang sedang dikelola';
  function show(index){
    if(index<0||index>6)return;
    if(index===6 && currentProfile?.role!=='admin')return;
    if(index>0&&index<5&&!currentEvent){note.textContent='Simpan kegiatan pada langkah 1 atau pilih kegiatan dari daftar terlebih dahulu.';return;}
    active=index;note.textContent='';
    pages.forEach((page,i)=>page.hidden=i!==index);
    buttons.forEach((button,i)=>{button.classList.toggle('selected',i===index);if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
    title.textContent=index===6?'Akun & Satuan Kerja':`Langkah ${index+1} — ${groups[index][0]}`;
    context.textContent=currentEvent?`${currentEvent.code} • ${currentEvent.title}`:'Kegiatan baru';
    back.hidden=index===0||index===6;next.hidden=index>=5;
    next.textContent=index===0?'Simpan & Lanjut ke Langkah 2':'Lanjut ke Langkah '+(index+2)+' →';
    if(index===2)window.KabayanQR.init();
  }
  function defaults(){
    if(currentEvent||!currentProfile)return;
    const unit=workUnits.find(u=>u.id===currentProfile.work_unit_id);
    document.getElementById('eventIssuer').value=currentProfile.work_unit_name||unit?.name||'';
    document.getElementById('eventWorkUnit').value=currentProfile.work_unit_id||'';
    document.getElementById('eventWorkUnitReadonly').value=[currentProfile.work_unit_code||unit?.code,currentProfile.work_unit_name||unit?.name].filter(Boolean).join(' — ');
  }
  document.getElementById('newEventBtn').addEventListener('click',()=>{defaults();show(0);});
  document.getElementById('eventWorkUnit').addEventListener('change',()=>{
    if(!currentEvent)document.getElementById('eventIssuer').value=workUnits.find(u=>u.id===document.getElementById('eventWorkUnit').value)?.name||'';
  });
  function hash(){const id=location.hash.slice(1);const i=groups.findIndex(g=>g[1].includes(id));if(i>=0)show(i);else if(id==='userManagementPanel')show(6);}
  window.addEventListener('hashchange',hash);
  window.KabayanWorkflow={defaults,show,selected(scroll){show(scroll?0:active);},ready(){defaults();show(0);hash();}};
  show(0);
})();
