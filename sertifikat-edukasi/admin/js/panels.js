/* Satu shell, satu sesi, navigasi hash tanpa memuat ulang dokumen. */
(() => {
  'use strict';
  const app=$('appView');
  const icon=(path)=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const icons={dashboard:icon('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),events:icon('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>'),test:icon('<path d="M8 3h8l4 4v14H4V3h4zm7 0v5h5M8 12h8m-8 4h5"/>'),qr:icon('<path d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm12 0h2v2h4v4h-6z"/>'),people:icon('<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0112 0v3m1-16a3 3 0 010 6m2 3a5 5 0 013 4v3"/>'),check:icon('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 12 3 3 5-6"/>'),cert:icon('<circle cx="12" cy="9" r="6"/><path d="m8 14-1 8 5-3 5 3-1-8"/>'),chart:icon('<path d="M4 3v18h17M9 17v-6m5 6V6m5 11V9"/>'),history:icon('<path d="M3 11a9 9 0 119 10M3 4v7h7m2-5v6l4 2"/>'),settings:icon('<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor"/><circle cx="15" cy="17" r="3" fill="currentColor"/>')};
  const definitions=[
    ['dashboard','Ringkasan','dashboard',false],['eventsPage','Kegiatan','events',false],
    ['reportsPage','Laporan','chart',false],['activityPage','Riwayat aktivitas','history',false],
    ['userManagementPanel','Akun & Satker','settings',false],
    ['checklistPanel','Kesiapan kegiatan','check',true],['settingsPanel','Identitas kegiatan','events',false],
    ['questionPanel','Pretest & Posttest','test',true],['evaluationPanel','Format evaluasi','check',true],
    ['accessPage','Bagikan akses peserta','qr',true],['monitorPanel','Pantau peserta','people',true],
    ['testResultsPanel','Hasil tes','chart',true],['evaluationResultsPanel','Hasil evaluasi','check',true],
    ['certificatePanel','Sertifikat','cert',true],['reportPanel','Ekspor kegiatan','chart',true]
  ];
  const stages=[
    {name:'Persiapan',copy:'Lengkapi kegiatan dan periksa kesiapan',routes:['checklistPanel','settingsPanel','questionPanel','evaluationPanel']},
    {name:'Pelaksanaan',copy:'Bagikan akses dan pantau peserta',routes:['accessPage','monitorPanel']},
    {name:'Hasil',copy:'Tinjau hasil dan sertifikat',routes:['testResultsPanel','evaluationResultsPanel','certificatePanel','reportPanel']}
  ];
  const aliases={phasePanel:'accessPage',qrPanel:'accessPage',qrHistoryPanel:'accessPage',eventManagementPanel:'eventsPage'};
  const canonical=id=>aliases[id]||id;
  const inEvent=id=>stages.some(stage=>stage.routes.includes(id));
  const panels=new Map();
  for(const id of ['settingsPanel','questionPanel','phasePanel','qrPanel','qrHistoryPanel','monitorPanel','evaluationPanel','certificatePanel','reportPanel','eventManagementPanel','userManagementPanel'])panels.set(id,$(id));
  const directory=document.querySelector('.sidebar-layout > aside');directory.id='eventsPage';directory.className='card event-directory';panels.set('eventsPage',directory);
  const shell=document.createElement('div');shell.className='application-shell';
  shell.innerHTML=`<button type="button" class="menu-backdrop" id="closeMenu" hidden aria-label="Tutup menu"></button><aside class="app-sidebar" id="mainSidebar"><a class="app-brand" href="#dashboard"><span><img src="assets/logo-kabayan.svg" alt=""></span><div>Kabayan<small>SERTIFIKAT EDUKASI</small></div></a><p class="nav-caption">RUANG KERJA</p><nav class="app-nav" id="mainNav" aria-label="Menu utama"></nav><div class="sidebar-bottom"><div class="sidebar-avatar" id="sidebarAvatar">K</div><div><b id="sidebarName">Akun Kabayan</b><small id="sidebarRole">Memeriksa akun</small></div></div></aside><div class="app-main"><header class="app-header"><div class="header-start"><button type="button" class="btn btn-outline mobile-menu" id="openMenu" aria-label="Buka menu" aria-expanded="false" aria-controls="mainSidebar">☰</button><span class="breadcrumb" id="breadcrumb">Ruang kerja / Ringkasan</span></div><div class="header-tools"><span id="scopeBadge" class="scope-badge"></span><div id="profileMenu" class="profile-menu"><button type="button" class="btn btn-outline" id="profileToggle" aria-expanded="false" aria-controls="accountTools">Profil ▾</button><div id="accountTools" hidden></div></div></div></header><main class="workspace" id="workspace"><div class="page-heading"><div><span class="overline" id="pageEyebrow">RUANG KERJA</span><h1 id="pageTitle">Ringkasan kegiatan</h1><p id="pageDescription">Seluruh aktivitas edukasi dalam satu tempat.</p></div><button type="button" id="createEvent" class="btn btn-yellow">+ Buat kegiatan</button></div><div id="workspaceNotice" class="workspace-notice" role="status" hidden></div><section class="event-context" id="eventContext" hidden><div><label for="contextEvent">Kegiatan yang dikelola</label><span id="contextCaption">Pilih kegiatan untuk membuka modul ini.</span></div><select id="contextEvent"><option value="">Pilih kegiatan…</option></select></section><section class="empty-module card" id="chooseEvent" hidden><span class="empty-icon">${icons.events}</span><h2>Pilih kegiatan terlebih dahulu</h2><p id="chooseEventText">Gunakan pilihan kegiatan di atas untuk melanjutkan.</p><button class="btn btn-outline" type="button" id="goEvents">Lihat daftar kegiatan</button></section><div id="moduleHost"></div></main><footer class="app-footer"><span>Kabayan · Sertifikat Edukasi</span><span id="footerScope"></span></footer></div>`;
  const host=shell.querySelector('#moduleHost');panels.forEach(panel=>{panel.hidden=true;host.append(panel);});
  const dashboard=document.createElement('section');dashboard.id='dashboard';dashboard.hidden=true;panels.set('dashboard',dashboard);host.prepend(dashboard);
  dashboard.innerHTML=`<div class="overview-top"><section class="welcome-panel"><div><span class="overline">WILUJENG SUMPING</span><h2 id="welcomeName">Selamat datang kembali.</h2><p id="welcomeCopy">Pantau kegiatan dan lanjutkan pekerjaan Anda hari ini.</p><a href="#eventsPage" class="text-link">Lihat kegiatan ${icons.events}</a></div><img src="assets/kabayan-admin.webp" width="160" height="160" alt="Karakter Kabayan"></section><section class="summary-note"><span class="overline">AKSES ANDA</span><h3 id="accessTitle">Ruang kerja edukasi</h3><p id="accessCopy">Data ditampilkan sesuai akses akun.</p></section></div><div class="dashboard-message" id="dashboardStatus" role="status"></div><div class="dashboard-stats"><article><span class="metric-label">Kegiatan aktif ${icons.events}</span><strong id="eventCount">—</strong><small>Dipublikasikan dan belum ditutup</small></article><article><span class="metric-label">Peserta terdaftar ${icons.people}</span><strong id="participantCount">—</strong><small>Seluruh kegiatan yang dapat diakses</small></article><article><span class="metric-label">Sertifikat valid ${icons.cert}</span><strong id="certificateCount">—</strong><small>Tidak termasuk yang dicabut</small></article><article><span class="metric-label">Evaluasi selesai ${icons.check}</span><strong id="evaluationCount">—</strong><small>Peserta yang telah mengisi evaluasi</small></article></div><div class="dashboard-charts"><section class="card"><div class="chart-title"><h2>Aktivitas kegiatan</h2><span>6 bulan terakhir</span></div><p class="muted">Jumlah kegiatan berdasarkan tanggal dibuat.</p><div id="activityChart"></div></section><section class="card"><div class="chart-title"><h2>Partisipasi peserta</h2><span>Kegiatan terbaru</span></div><p class="muted">Jumlah pendaftaran pada lima kegiatan terbaru.</p><div id="participantChart"></div></section></div><section class="card recent-card"><div class="section-title"><div><h2>Kegiatan terbaru</h2><p>Lanjutkan pengelolaan kegiatan Anda.</p></div><button type="button" class="btn btn-outline" id="refreshDashboard">Perbarui data</button></div><div id="recentEvents"></div></section><p class="dashboard-updated" id="dashboardUpdated"></p>`;
  // Move existing controls, then discard the old two-level navigation and hero.
  const logout=$('logoutBtn');logout.style.display='inline-flex';shell.querySelector('#accountTools').append(logout);
  const hiddenContext=document.createElement('div');hiddenContext.hidden=true;hiddenContext.append($('accountContext'));shell.append(hiddenContext);
  app.replaceChildren(shell);document.querySelector('.topbar')?.remove();
  const search=document.createElement('div');search.className='event-search';search.innerHTML='<label for="eventSearch">Cari kegiatan</label><input id="eventSearch" type="search" placeholder="Cari nama kegiatan atau kode…">';directory.querySelector('#eventList').before(search);
  function page(id,html){const section=document.createElement('section');section.id=id;section.hidden=true;section.innerHTML=html;panels.set(id,section);host.append(section);return section;}
  const access=page('accessPage','');access.append($('phasePanel'),$('qrPanel'));
  const qrDetails=document.createElement('details');qrDetails.id='qrHistoryDetails';qrDetails.className='card history-details';qrDetails.innerHTML='<summary>Histori QR kegiatan ini</summary>';qrDetails.append($('qrHistoryPanel'));access.append(qrDetails);
  $('qrPanel').querySelector('h2').textContent='QR akses peserta';$('qrGenerate').textContent='Buat QR';
  $('qrHistoryPanel').querySelector('h2').textContent='Histori QR kegiatan';
  $('phasePanel').querySelector('h2').textContent='Buka fase & bagikan tautan';
  $('evaluationPanel').querySelector('h2').textContent='Format evaluasi peserta';
  $('evaluationPanel').querySelector('.section-title p').textContent='Format standar yang akan diisi peserta pada fase akhir. Hasil jawaban tersedia pada tahap Hasil.';
  page('checklistPanel','<section class="card readiness"><div class="section-title"><div><h2>Siap untuk dipublikasikan?</h2><p>Kelengkapan persiapan diperiksa terpisah dari status kegiatan.</p></div><button class="btn btn-outline" type="button" id="refreshReadiness">Periksa ulang</button></div><p id="readinessStatus" role="status"></p><div id="readinessList"></div><div class="readiness-action"><p id="readinessNext"></p><button type="button" class="btn btn-yellow" id="readinessAction" disabled>Lanjutkan persiapan</button></div><p class="muted">Pemeriksaan memakai data yang sudah disimpan. Simpan perubahan formulir atau soal sebelum memeriksa ulang.</p></section>');
  const testResults=page('testResultsPanel','<section class="card"><h2>Hasil pretest & posttest</h2><p class="muted">Unduh nilai dan jawaban peserta dari kegiatan ini.</p><div class="report-grid" id="testReportCards"></div><button class="btn btn-outline" type="button" id="viewResultParticipants">Lihat detail peserta</button></section>');
  $('testReportCards').append($('printPretest').closest('.report-card'),$('printPosttest').closest('.report-card'));
  const evalResults=page('evaluationResultsPanel','<section class="card"><h2>Hasil evaluasi peserta</h2><p class="muted">Cetak atau unduh jawaban evaluasi kegiatan. Format pertanyaan tersedia pada tahap Persiapan.</p><div id="evaluationReportCard"></div></section>');
  $('evaluationReportCard').append($('printEvaluation').closest('.report-card'));
  $('reportPanel').querySelector('.section-title p').textContent='Ekspor seluruh data kegiatan atau unduh daftar hadir. Hasil tes dan evaluasi tersedia pada tab masing-masing.';
  // Feedback from the existing export handlers stays visible whichever results tab is active.
  const reportMessages=document.createElement('div');reportMessages.id='sharedReportMessages';reportMessages.append($('reportOk'),$('reportErr'));host.append(reportMessages);
  const activity=page('activityPage','<section class="card"><div class="section-title"><div><h2>Riwayat aktivitas</h2><p>Perubahan penting yang dilakukan pada kegiatan.</p></div><div id="activityRefreshSlot"></div></div><div id="activityListSlot"></div><p id="activityStatus" role="status"></p></section>');
  $('activityRefreshSlot').append($('refreshActivityBtn'));$('activityListSlot').append($('activityRows'));
  $('eventManagementPanel').querySelectorAll('.section-title').forEach(section=>{if(section.querySelector('h2')?.textContent==='Riwayat Aktivitas')section.remove();});
  // Preserve legacy archive/delete RPC controls inside the directory, with the history shown separately.
  const advanced=document.createElement('details');advanced.className='management-details';advanced.innerHTML='<summary>Pengelolaan arsip & data yang dihapus</summary>';advanced.append($('eventManagementPanel'));directory.append(advanced);
  const filter=document.createElement('div');filter.className='directory-tabs';filter.innerHTML='<button type="button" data-directory="active" aria-pressed="true">Aktif</button><button type="button" data-directory="completed" aria-pressed="false">Selesai</button><button type="button" data-directory="archived" aria-pressed="false">Arsip</button>';directory.querySelector('#eventList').before(filter);
  page('reportsPage','<section class="card"><div class="section-title"><div><h2 id="aggregateTitle">Ringkasan lintas kegiatan</h2><p>Total peserta, evaluasi, dan sertifikat sesuai akses akun.</p></div><div class="actions"><button type="button" class="btn btn-outline" id="refreshAggregate">Perbarui</button><button type="button" class="btn btn-yellow" id="exportAggregate" disabled>Unduh CSV</button></div></div><p id="aggregateStatus" role="status"></p><div class="tablewrap"><table class="table"><thead><tr><th>Kegiatan</th><th>Satuan Kerja</th><th>Peserta</th><th>Evaluasi selesai</th><th>Sertifikat valid</th><th>Detail</th></tr></thead><tbody id="aggregateRows"></tbody></table></div></section>');
  const journeyBar=document.createElement('section');journeyBar.id='eventJourney';journeyBar.hidden=true;
  journeyBar.innerHTML='<div class="journey-identity"><div><a href="#eventsPage" class="text-link">← Daftar kegiatan</a><h2 id="journeyTitle"></h2><p id="journeyMeta"></p></div><span id="journeyStatus" class="status"></span></div><nav class="stage-nav" id="stageNav" aria-label="Tahap kegiatan"></nav><nav class="stage-tabs" id="stageTabs" aria-label="Bagian kegiatan"></nav>';
  $('eventContext').after(journeyBar);
  stages.forEach((stage,i)=>{const button=document.createElement('button');button.type='button';button.dataset.stage=i;button.innerHTML=`<span class="stage-number">${i+1}</span><span><b>${stage.name}</b><small>${stage.copy}</small></span>`;$('stageNav').append(button);});
  const focus=document.createElement('section');focus.className='dashboard-focus';focus.innerHTML='<section class="card continue-card"><span class="overline">LANJUTKAN PEKERJAAN</span><h2 id="continueTitle">Pilih kegiatan untuk memulai</h2><p id="continueCopy">Kegiatan terakhir yang Anda buka akan tersedia di sini.</p><button class="btn btn-yellow" type="button" id="continueEvent">Lihat kegiatan</button></section><section class="card attention-card"><div class="section-title"><div><h2>Perlu ditindaklanjuti</h2><p id="attentionScope">Pekerjaan berikutnya dari kegiatan Anda.</p></div></div><div id="attentionList"></div></section>';
  dashboard.querySelector('.overview-top').after(focus);
  const nav=$('mainNav');

  definitions.slice(0,5).forEach(([id,label,glyph])=>{const a=document.createElement('a');a.href='#'+id;a.dataset.route=id;a.innerHTML=icons[glyph]+`<span>${label}</span>`;if(id==='userManagementPanel')a.className='admin-only';nav.append(a);});
  $('qrEvent').disabled=true;
  const phaseActions=document.createElement('div');phaseActions.className='actions';phaseActions.append($('publishEventBtn'),$('closeEventBtn'));$('phasePanel').append(phaseActions);
  const saveNext=document.createElement('button');saveNext.type='button';saveNext.className='btn btn-outline';saveNext.textContent='Simpan & susun tes →';saveNext.onclick=async()=>{saveNext.disabled=true;try{if(await $('saveEventBtn').onclick())navigate('questionPanel');}finally{saveNext.disabled=false;}};$('saveEventBtn').after(saveNext);
  let active='dashboard',routeVersion=0,selectionBusy=false,ready=false;
  const legacy=['settingsPanel','questionPanel','phasePanel','monitorPanel','reportPanel','eventManagementPanel','userManagementPanel'];
  function notice(text){$('workspaceNotice').textContent=text;$('workspaceNotice').hidden=!text;}
  function closeMenu(){$('accountTools').hidden=true;$('profileToggle').setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');$('closeMenu').hidden=true;$('openMenu').setAttribute('aria-expanded','false');}
  $('openMenu').onclick=()=>{document.body.classList.add('menu-open');$('closeMenu').hidden=false;$('openMenu').setAttribute('aria-expanded','true');};$('closeMenu').onclick=closeMenu;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  function sync(){
    directory.querySelectorAll('[data-directory]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.directory===(window.KabayanDirectoryFilter||'active'))));
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
    document.querySelector('[data-route="reportsPage"] span').textContent=admin?'Laporan lintas Satker':'Laporan Satker';
    $('attentionScope').textContent=admin?'Kegiatan lintas Satker yang perlu ditinjau.':'Pekerjaan berikutnya dari kegiatan Satuan Kerja Anda.';
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
  function journey(id){
    const isEvent=inEvent(id);$('eventJourney').hidden=!isEvent;
    if(!isEvent)return;
    $('journeyTitle').textContent=currentEvent?.title||'Kegiatan baru';
    $('journeyMeta').textContent=currentEvent?[currentEvent.code,currentEvent.event_date||'Tanggal belum diisi',currentEvent.work_units?.name||currentProfile.work_unit_name].filter(Boolean).join(' · '):'Lengkapi identitas dan simpan kegiatan untuk memulai.';
    $('journeyStatus').textContent=currentEvent?({draft:'Draf',published:'Dipublikasikan',closed:'Selesai'})[currentEvent.status]||currentEvent.status:'Belum disimpan';
    if(currentEvent?.lifecycle_status==='archived')$('journeyStatus').textContent+=' · Arsip';
    $('journeyStatus').className='status '+(currentEvent?.status||'draft');
    const stageIndex=stages.findIndex(stage=>stage.routes.includes(id));
    $('stageNav').querySelectorAll('button').forEach((button,i)=>{if(i===stageIndex)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
    $('stageTabs').replaceChildren();
    stages[stageIndex].routes.forEach(route=>{const button=document.createElement('button');button.type='button';button.dataset.section=route;button.textContent=definitions.find(d=>d[0]===route)[1];if(route===id)button.setAttribute('aria-current','page');$('stageTabs').append(button);});
  }
  async function display(requested){
    if(!ready)return;
    let id=canonical(requested);if(!panels.has(id))id='dashboard';
    if(id==='userManagementPanel'&&currentProfile?.role!=='admin'){notice('Menu pengelolaan akun hanya tersedia untuk Administrator.');id='dashboard';updateURL(id,true);}
    active=id;const version=++routeVersion;closeMenu();sync();journey(id);
    const def=definitions.find(d=>d[0]===id),needsEvent=def?.[3]||false,label=def?.[1]||'Ringkasan';
    $('pageTitle').textContent=inEvent(id)?'Ruang kegiatan':id==='dashboard'?'Ringkasan kegiatan':id==='eventsPage'?(currentProfile.role==='admin'?'Seluruh kegiatan':'Kegiatan saya'):label;
    $('breadcrumb').textContent=inEvent(id)?'Kegiatan / '+stages.find(stage=>stage.routes.includes(id)).name:'Ruang kerja / '+label;
    $('pageEyebrow').textContent=currentProfile.role==='admin'?'ADMINISTRATOR':'SATUAN KERJA';
    $('pageDescription').textContent=inEvent(id)?'Satu kegiatan, dari persiapan sampai hasil.':id==='dashboard'?'Lanjutkan pekerjaan dan lihat hal yang perlu ditindaklanjuti.':id==='eventsPage'?'Pilih kegiatan untuk mengelola seluruh proses di dalamnya.':id==='reportsPage'?'Bandingkan hasil kegiatan sesuai cakupan akses Anda.':'Kelola ruang kerja sesuai akses akun Anda.';
    $('createEvent').hidden=!['dashboard','eventsPage'].includes(id);
    const waiting=needsEvent&&!currentEvent;
    $('eventContext').hidden=!waiting;$('chooseEvent').hidden=!waiting;
    $('chooseEventText').textContent=events.length?'Buka kegiatan dari daftar atau pilih kegiatan di atas.':'Belum ada kegiatan. Buat kegiatan terlebih dahulu.';
    const visible=new Set([id]);
    if(id==='accessPage'){visible.add('phasePanel');visible.add('qrPanel');visible.add('qrHistoryPanel');}
    if(id==='eventsPage')visible.add('eventManagementPanel');
    panels.forEach((panel,key)=>{panel.hidden=!visible.has(key)||waiting;if(visible.has(key)&&!waiting)panel.style.display='block';});
    $('sharedReportMessages').hidden=!['testResultsPanel','evaluationResultsPanel','reportPanel'].includes(id);
    nav.querySelectorAll('a').forEach(a=>{const selected=a.dataset.route===id||(inEvent(id)&&a.dataset.route==='eventsPage');if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(id==='dashboard')window.KabayanDashboard?.start();else window.KabayanDashboard?.stop();
    if(inEvent(id)&&currentEvent)window.KabayanProcess?.remember(currentEvent.id,id);
    if(waiting)return;
    try{
      if(id==='accessPage'){await window.KabayanQR.init();if(requested==='qrHistoryPanel')$('qrHistoryDetails').open=true;}
      if(id==='evaluationPanel')window.KabayanEvaluationDesigner?.open();
      if(id==='checklistPanel')await window.KabayanProcess?.readiness();
      if(id==='reportsPage')await window.KabayanProcess?.aggregate();
      if(id==='activityPage')await loadActivityLogs();
      if(id==='userManagementPanel')await loadUserManagement();
    }catch(e){if(version===routeVersion)notice('Bagian ini belum dapat dimuat: '+e.message);}
  }
  function navigate(id,replace=false){notice('');updateURL(canonical(id),replace);return display(id);}
  $('stageNav').onclick=e=>{const button=e.target.closest('[data-stage]');if(button)navigate(stages[Number(button.dataset.stage)].routes[0]);};
  $('stageTabs').onclick=e=>{const button=e.target.closest('[data-section]');if(button)navigate(button.dataset.section);};
  $('viewResultParticipants').onclick=()=>navigate('monitorPanel');
  $('profileToggle').onclick=()=>{const open=$('accountTools').hidden;$('accountTools').hidden=!open;$('profileToggle').setAttribute('aria-expanded',String(open));};
  document.addEventListener('click',e=>{if(!e.target.closest('#profileMenu')){$('accountTools').hidden=true;$('profileToggle').setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('accountTools').hidden=true;$('profileToggle').setAttribute('aria-expanded','false');}});
  directory.querySelectorAll('[data-directory]').forEach(button=>button.onclick=()=>{window.KabayanDirectoryFilter=button.dataset.directory;directory.querySelectorAll('[data-directory]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderEvents();});
  advanced.addEventListener('toggle',()=>{if(advanced.open)loadEventManagement().catch(e=>notice(e.message));});
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
    if(!ready)return;notice('');
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
    reset(){ready=false;active='dashboard';routeVersion++;notice('');window.KabayanProcess?.reset();},
    show:index=>navigate(legacy[index]||'dashboard'),
    selected(scroll){sync();if(!ready)return;if(scroll&&['eventsPage','dashboard','reportsPage'].includes(active))navigate('checklistPanel');else display(active);updateURL(active,true);},
    async ready(){ready=true;defaults();sync();await display(location.hash.slice(1)||'dashboard');},
    async openEvent(id,panel='checklistPanel'){if(!events.some(e=>e.id===id))await loadEvents();if(!events.some(e=>e.id===id))throw new Error('Kegiatan tidak tersedia untuk akun ini.');await selectEvent(id,false);await navigate(panel);}
  };
})();
