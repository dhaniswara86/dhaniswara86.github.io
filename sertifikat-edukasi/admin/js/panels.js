/* Satu shell, satu sesi, navigasi hash tanpa memuat ulang dokumen. */
(() => {
  'use strict';
  const app=$('appView');
  const icon=(path)=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const icons={dashboard:icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),events:icon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>'),test:icon('<path d="M8 3h8l4 4v14H4V3h4zm7 0v5h5M8 12h8m-8 4h5"/>'),qr:icon('<path d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm12 0h2v2h4v4h-6z"/>'),people:icon('<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0112 0v3m1-16a3 3 0 010 6m2 3a5 5 0 013 4v3"/>'),check:icon('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 12 3 3 5-6"/>'),cert:icon('<circle cx="12" cy="9" r="6"/><path d="m8 14-1 8 5-3 5 3-1-8"/>'),chart:icon('<path d="M4 3v18h17M9 17v-6m5 6V6m5 11V9"/>'),history:icon('<path d="M3 11a9 9 0 119 10M3 4v7h7m2-5v6l4 2"/>'),settings:icon('<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="15" cy="17" r="3" fill="currentColor"/>')};
  const definitions=[
    ['dashboard','Ringkasan','dashboard',false],['eventsPage','Kegiatan','events',false],
    ['questionPanel','Pretest & Posttest','test',true],['phasePanel','Fase & Link','events',true],
    ['qrPanel','QR Generator','qr',true],['qrHistoryPanel','Histori QR','history',false],
    ['monitorPanel','Peserta','people',true],['evaluationPanel','Evaluasi','check',true],
    ['certificatePanel','Sertifikat','cert',true],['reportPanel','Laporan','chart',true],
    ['eventManagementPanel','Arsip & Riwayat','history',false],['userManagementPanel','Akun & Satker','settings',false]
  ];
  const panels=new Map();
  for(const id of ['settingsPanel','questionPanel','phasePanel','qrPanel','qrHistoryPanel','monitorPanel','evaluationPanel','certificatePanel','reportPanel','eventManagementPanel','userManagementPanel'])panels.set(id,$(id));
  const directory=document.querySelector('.sidebar-layout > aside');directory.id='eventsPage';directory.className='card event-directory';panels.set('eventsPage',directory);
  const shell=document.createElement('div');shell.className='application-shell';
  shell.innerHTML=`<button type="button" class="menu-backdrop" id="closeMenu" hidden aria-label="Tutup menu"></button><aside class="app-sidebar" id="mainSidebar"><a class="app-brand" href="#dashboard"><span><img src="assets/logo-kabayan.svg" alt=""></span><div>Kabayan<small>SERTIFIKAT EDUKASI</small></div></a><p class="nav-caption">RUANG KERJA</p><nav class="app-nav" id="mainNav" aria-label="Menu utama"></nav><div class="sidebar-bottom"><div class="sidebar-avatar" id="sidebarAvatar">K</div><div><b id="sidebarName">Akun Kabayan</b><small id="sidebarRole">Memeriksa akun</small></div></div></aside><div class="app-main"><header class="app-header"><div class="header-start"><button type="button" class="btn btn-outline mobile-menu" id="openMenu" aria-label="Buka menu" aria-expanded="false" aria-controls="mainSidebar">☰</button><span class="breadcrumb" id="breadcrumb">Ruang kerja / Ringkasan</span></div><div class="header-tools"><span id="scopeBadge" class="scope-badge"></span><div id="accountTools"></div></div></header><main class="workspace" id="workspace"><div class="page-heading"><div><span class="overline" id="pageEyebrow">RUANG KERJA</span><h1 id="pageTitle">Ringkasan kegiatan</h1><p id="pageDescription">Seluruh aktivitas edukasi dalam satu tempat.</p></div><button type="button" id="createEvent" class="btn btn-yellow">+ Buat kegiatan</button></div><div id="workspaceNotice" class="workspace-notice" role="status" hidden></div><section class="event-context" id="eventContext" hidden><div><label for="contextEvent">Kegiatan yang dikelola</label><span id="contextCaption">Pilih kegiatan untuk membuka modul ini.</span></div><select id="contextEvent"><option value="">Pilih kegiatan…</option></select></section><section class="empty-module card" id="chooseEvent" hidden><span class="empty-icon">${icons.events}</span><h2>Pilih kegiatan terlebih dahulu</h2><p id="chooseEventText">Gunakan pilihan kegiatan di atas untuk melanjutkan.</p><button class="btn btn-outline" type="button" id="goEvents">Lihat daftar kegiatan</button></section><div id="moduleHost"></div></main><footer class="app-footer"><span>Kabayan · Sertifikat Edukasi</span><span id="footerScope"></span></footer></div>`;
  const host=shell.querySelector('#moduleHost');panels.forEach(panel=>{panel.hidden=true;host.append(panel);});
  const dashboard=document.createElement('section');dashboard.id='dashboard';dashboard.hidden=true;panels.set('dashboard',dashboard);host.prepend(dashboard);
  dashboard.innerHTML=`<div class="overview-top"><section class="welcome-panel"><div><span class="overline">WILUJENG SUMPING</span><h2 id="welcomeName">Selamat datang kembali.</h2><p id="welcomeCopy">Pantau kegiatan dan lanjutkan pekerjaan Anda hari ini.</p><a href="#eventsPage" class="text-link">Lihat kegiatan ${icons.events}</a></div><img src="assets/kabayan-admin.webp" width="160" height="160" alt="Karakter Kabayan"></section><section class="summary-note"><span class="overline">AKSES ANDA</span><h3 id="accessTitle">Ruang kerja edukasi</h3><p id="accessCopy">Data ditampilkan sesuai akses akun.</p></section></div><div class="dashboard-message" id="dashboardStatus" role="status"></div><div class="dashboard-stats"><article><span class="metric-label">Kegiatan aktif ${icons.events}</span><strong id="eventCount">—</strong><small>Dipublikasikan dan belum ditutup</small></article><article><span class="metric-label">Peserta terdaftar ${icons.people}</span><strong id="participantCount">—</strong><small>Seluruh kegiatan yang dapat diakses</small></article><article><span class="metric-label">Sertifikat valid ${icons.cert}</span><strong id="certificateCount">—</strong><small>Tidak termasuk yang dicabut</small></article><article><span class="metric-label">Evaluasi selesai ${icons.check}</span><strong id="evaluationCount">—</strong><small>Peserta yang telah mengisi evaluasi</small></article></div><div class="dashboard-charts"><section class="card"><div class="chart-title"><h2>Aktivitas kegiatan</h2><span>6 bulan terakhir</span></div><p class="muted">Jumlah kegiatan berdasarkan tanggal dibuat.</p><div id="activityChart"></div></section><section class="card"><div class="chart-title"><h2>Partisipasi peserta</h2><span>Kegiatan terbaru</span></div><p class="muted">Jumlah pendaftaran pada lima kegiatan terbaru.</p><div id="participantChart"></div></section></div><section class="card recent-card"><div class="section-title"><div><h2>Kegiatan terbaru</h2><p>Lanjutkan pengelolaan kegiatan Anda.</p></div><button type="button" class="btn btn-outline" id="refreshDashboard">Perbarui data</button></div><div id="recentEvents"></div></section><p class="dashboard-updated" id="dashboardUpdated"></p>`;
  // Move existing controls, then discard the old two-level navigation and hero.
  const logout=$('logoutBtn');logout.style.display='inline-flex';shell.querySelector('#accountTools').append(logout);
  const hiddenContext=document.createElement('div');hiddenContext.hidden=true;hiddenContext.append($('accountContext'));shell.append(hiddenContext);
  app.replaceChildren(shell);document.querySelector('.topbar')?.remove();
  const search=document.createElement('div');search.className='event-search';search.innerHTML='<label for="eventSearch">Cari kegiatan</label><input id="eventSearch" type="search" placeholder="Cari nama kegiatan atau kode…">';directory.querySelector('#eventList').before(search);
  const nav=$('mainNav');
  definitions.forEach(([id,label,glyph])=>{const a=document.createElement('a');a.href='#'+id;a.dataset.route=id;a.innerHTML=icons[glyph]+`<span>${label}</span>`;if(id==='userManagementPanel')a.className='admin-only';nav.append(a);});
  $('qrEvent').disabled=true;
  const phaseActions=document.createElement('div');phaseActions.className='actions';phaseActions.append($('publishEventBtn'),$('closeEventBtn'));$('phasePanel').append(phaseActions);
  const saveNext=document.createElement('button');saveNext.type='button';saveNext.className='btn btn-outline';saveNext.textContent='Simpan & susun tes →';saveNext.onclick=async()=>{saveNext.disabled=true;try{if(await $('saveEventBtn').onclick())navigate('questionPanel');}finally{saveNext.disabled=false;}};$('saveEventBtn').after(saveNext);
  let active='dashboard',routeVersion=0,selectionBusy=false,ready=false;
  const legacy=['settingsPanel','questionPanel','phasePanel','monitorPanel','reportPanel','eventManagementPanel','userManagementPanel'];
  function notice(text){$('workspaceNotice').textContent=text;$('workspaceNotice').hidden=!text;}
  function closeMenu(){document.body.classList.remove('menu-open');$('closeMenu').hidden=true;$('openMenu').setAttribute('aria-expanded','false');}
  $('openMenu').onclick=()=>{document.body.classList.add('menu-open');$('closeMenu').hidden=false;$('openMenu').setAttribute('aria-expanded','true');};$('closeMenu').onclick=closeMenu;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  function sync(){
    const previous=currentEvent?.id||'';const picker=$('contextEvent');picker.replaceChildren(new Option('Pilih kegiatan…',''));
    events.filter(e=>e.lifecycle_status!=='deleted').forEach(e=>picker.add(new Option(`${e.code} · ${e.title}`,e.id)));picker.value=previous;
    $('contextCaption').textContent=currentEvent?`${currentEvent.code} · ${currentEvent.event_date||'Tanggal belum diatur'}`:'Pilih kegiatan untuk membuka modul ini.';
    if(!currentProfile)return;
    const admin=currentProfile.role==='admin',name=currentProfile.full_name||'Pengguna Kabayan';
    $('sidebarName').textContent=name;$('sidebarAvatar').textContent=name.charAt(0).toUpperCase();$('sidebarRole').textContent=admin?'Administrator':(currentProfile.work_unit_code||'Akun Satker');
    $('scopeBadge').textContent=admin?'Administrator':(currentProfile.work_unit_name||'Satuan Kerja');
    $('footerScope').textContent=admin?'Seluruh Satuan Kerja':(currentProfile.work_unit_name||'Satuan Kerja Anda');
    document.querySelector('[data-route="userManagementPanel"]').hidden=!admin;
    document.querySelector('[data-route="eventsPage"] span').textContent=admin?'Seluruh kegiatan':'Kegiatan saya';
    $('welcomeName').textContent='Halo, '+name+'.';
    $('welcomeCopy').textContent=admin?'Pantau edukasi seluruh Satuan Kerja dan kelola akses tim Anda.':'Siapkan kegiatan, pantau peserta, dan selesaikan penerbitan sertifikat Anda.';
    $('accessTitle').textContent=admin?'Seluruh Satuan Kerja':(currentProfile.work_unit_name||'Satuan Kerja Anda');
    $('accessCopy').textContent=admin?'Anda dapat mengelola kegiatan, akun, dan Satuan Kerja.':'Kegiatan dan laporan di ruang ini mengikuti akses Satuan Kerja Anda.';
  }
  function defaults(){
    if(currentEvent||!currentProfile)return;
    const unit=workUnits.find(u=>u.id===currentProfile.work_unit_id);
    $('eventIssuer').value=currentProfile.work_unit_name||unit?.name||'';
    const code=currentProfile.work_unit_code||unit?.code;
    $('eventPattern').value=code?`CERT-{SEQ}/${code}/{YEAR}`:'';
    $('eventWorkUnit').value=currentProfile.work_unit_id||'';
    $('eventWorkUnitReadonly').value=[code,currentProfile.work_unit_name||unit?.name].filter(Boolean).join(' — ');
  }
  function updateURL(id,replace=false){
    const url=new URL(location.href);url.hash=id;
    if(currentEvent)url.searchParams.set('event',currentEvent.id);else url.searchParams.delete('event');
    history[replace?'replaceState':'pushState'](null,'',url);
  }
  async function display(id){
    if(!ready)return;
    if(!panels.has(id))id='dashboard';
    if(id==='userManagementPanel'&&currentProfile?.role!=='admin'){notice('Menu pengelolaan akun hanya tersedia untuk Administrator.');id='dashboard';updateURL(id,true);}
    active=id;const version=++routeVersion;closeMenu();sync();
    const def=definitions.find(d=>d[0]===id),needsEvent=def?.[3]||false;
    const label=id==='settingsPanel'?(currentEvent?'Pengaturan kegiatan':'Buat kegiatan'):def?.[1]||'Ringkasan';
    $('pageTitle').textContent=id==='dashboard'?'Ringkasan kegiatan':id==='eventsPage'?(currentProfile.role==='admin'?'Seluruh kegiatan':'Kegiatan saya'):label;
    $('breadcrumb').textContent='Ruang kerja / '+label;
    $('pageEyebrow').textContent=currentProfile.role==='admin'?'ADMINISTRATOR':'SATUAN KERJA';
    $('pageDescription').textContent=id==='dashboard'?'Pantau perkembangan edukasi dan lanjutkan pekerjaan Anda.':id==='eventsPage'?'Pilih kegiatan untuk mengelola persiapan, peserta, dan sertifikat.':needsEvent?'Kelola '+label.toLowerCase()+' untuk kegiatan yang dipilih.':id==='settingsPanel'?'Lengkapi identitas kegiatan dan simpan sebelum melanjutkan.':id==='userManagementPanel'?'Atur akses akun dan identitas Satuan Kerja.':'Telusuri data dan riwayat dalam ruang kerja Anda.';
    $('createEvent').hidden=id==='settingsPanel';
    $('eventContext').hidden=!(needsEvent||id==='settingsPanel');
    const waiting=needsEvent&&!currentEvent;$('chooseEvent').hidden=!waiting;
    $('chooseEventText').textContent=events.length?'Pilih kegiatan pada kolom di atas untuk membuka '+label.toLowerCase()+'.':'Belum ada kegiatan. Buat kegiatan terlebih dahulu untuk memulai.';
    panels.forEach((panel,key)=>{panel.hidden=key!==id||waiting;if(key===id&&!waiting)panel.style.display='block';});
    nav.querySelectorAll('a').forEach(a=>{const selected=a.dataset.route===id||(id==='settingsPanel'&&a.dataset.route==='eventsPage');if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(id==='dashboard')window.KabayanDashboard?.start();else window.KabayanDashboard?.stop();
    if(waiting)return;
    try{
      if(id==='qrPanel'||id==='qrHistoryPanel'||id==='phasePanel')await window.KabayanQR.init();
      if(id==='userManagementPanel')await loadUserManagement();
      if(id==='eventManagementPanel')await Promise.all([loadEventManagement(),loadActivityLogs()]);
    }catch(e){if(version===routeVersion)notice('Modul belum dapat dimuat: '+e.message);}
  }
  function navigate(id,replace=false){updateURL(id,replace);return display(id);}
  nav.addEventListener('click',e=>{const a=e.target.closest('a[data-route]');if(!a)return;e.preventDefault();navigate(a.dataset.route);});
  document.addEventListener('click',e=>{const a=e.target.closest('a[href="#dashboard"],a[href="#eventsPage"]');if(!a||a.dataset.route)return;e.preventDefault();navigate(a.hash.slice(1));});
  $('newEventBtn').addEventListener('click',()=>{defaults();sync();navigate('settingsPanel');});
  $('createEvent').onclick=()=>$('newEventBtn').click();$('goEvents').onclick=()=>navigate('eventsPage');
  $('eventSearch').oninput=renderEvents;
  $('contextEvent').onchange=async()=>{
    if(selectionBusy)return;
    selectionBusy=true;$('contextEvent').disabled=true;const id=$('contextEvent').value;
    try{if(id)await selectEvent(id,false);else{currentEvent=null;if(active==='settingsPanel'){$('newEventBtn').onclick();defaults();}}updateURL(active,true);await display(active);}
    catch(e){notice('Kegiatan belum dapat dibuka: '+e.message);}finally{selectionBusy=false;$('contextEvent').disabled=false;}
  };
  $('eventWorkUnit').addEventListener('change',()=>{if(!currentEvent){const unit=workUnits.find(u=>u.id===$('eventWorkUnit').value);$('eventIssuer').value=unit?.name||'';$('eventPattern').value=unit?.code?`CERT-{SEQ}/${unit.code}/{YEAR}`:'';}});
  async function fromURL(){
    if(!ready)return;
    const target=location.hash.slice(1)||'dashboard';
    const id=new URLSearchParams(location.search).get('event');
    if(id&&id!==currentEvent?.id){if(events.some(e=>e.id===id))await selectEvent(id,false);else currentEvent=null;}
    else if(!id){currentEvent=null;if(target==='settingsPanel'){$('newEventBtn').onclick();defaults();}}
    updateURL(target,true);await display(target);
  }
  window.addEventListener('popstate',()=>fromURL().catch(e=>notice(e.message)));
  window.addEventListener('hashchange',()=>fromURL().catch(e=>notice(e.message)));
  window.KabayanWorkflow={
    sync,defaults,notice,navigate,active:()=>active,
    reset(){ready=false;active='dashboard';routeVersion++;notice('');},
    show:index=>navigate(legacy[index]||'dashboard'),
    selected(scroll){sync();if(!ready)return;if(scroll&&['eventsPage','dashboard','eventManagementPanel'].includes(active))navigate('settingsPanel');else display(active);updateURL(active,true);},
    async ready(){ready=true;defaults();sync();await display(location.hash.slice(1)||'dashboard');},
    async openEvent(id,panel='settingsPanel'){await selectEvent(id,false);await navigate(panel);}
  };
})();
