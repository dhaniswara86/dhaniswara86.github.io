/* Dashboard memakai klien dan profil Supabase existing. Tidak membuat klien kedua. */
(() => {
  'use strict';
  const el=id=>document.getElementById(id), format=n=>new Intl.NumberFormat('id-ID').format(n);
  let client, profile, busy=false, timer, pendingModule=null;
  const eventModules=new Set(['qrPanel','qrHistoryPanel','monitorPanel','evaluationPanel','certificatePanel','reportPanel']);
  function status(text,error=false){el('status').textContent=text;el('status').classList.toggle('error',error);}
  function login(){location.replace('admin.html');}
  function moduleURL(panel,id){const url=new URL('admin.html',location.href);if(id)url.searchParams.set('event',id);url.hash=panel;return url.href;}
  async function rows(table,columns,scope){
    const result=[];
    for(let offset=0;;offset+=500){
      let q=client.from(table).select(columns).order('id').range(offset,offset+499);
      if(scope)q=scope(q);
      const {data,error}=await q;if(error)throw error;
      result.push(...(data||[]));if(!data||data.length<500)return result;
    }
  }
  async function children(table,columns,ids){
    const result=[];
    for(let i=0;i<ids.length;i+=100)result.push(...await rows(table,columns,q=>q.in('event_id',ids.slice(i,i+100))));
    return result;
  }
  function bars(id,items){
    const root=el(id);root.replaceChildren();
    if(!items.length){root.textContent='Belum ada data kegiatan.';return;}
    const max=Math.max(1,...items.map(x=>x.value));
    for(const item of items){
      const row=document.createElement('div');row.className='bar-row';
      const label=document.createElement('span');label.className='bar-label';label.textContent=item.label;
      const track=document.createElement('div');track.className='track';track.setAttribute('aria-hidden','true');
      const fill=document.createElement('div');fill.className='fill';fill.style.width=(item.value/max*100)+'%';track.append(fill);
      const value=document.createElement('span');value.className='bar-value';value.textContent=format(item.value);row.append(label,track,value);root.append(row);
    }
  }
  function render(events,participants,certificates){
    events.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))||String(a.id).localeCompare(String(b.id)));
    const active=events.filter(e=>(e.lifecycle_status||'active')==='active');
    el('eventCount').textContent=format(active.filter(e=>e.status==='published').length);
    el('participantCount').textContent=format(participants.length);
    el('certificateCount').textContent=format(certificates.filter(c=>c.status==='valid').length);
    el('evaluationCount').textContent=format(participants.filter(p=>p.evaluation_completed).length);
    const selected=el('eventPicker').value;el('eventPicker').replaceChildren(new Option('Pilih kegiatan…',''));
    events.forEach(e=>el('eventPicker').add(new Option((e.code||'')+' · '+e.title,e.id)));
    if(events.some(e=>e.id===selected))el('eventPicker').value=selected;
    const now=new Date(),months=[];
    for(let i=5;i>=0;i--){const date=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({label:date.toLocaleDateString('id-ID',{month:'short',year:'2-digit'}),value:events.filter(e=>{const d=new Date(e.created_at);return d.getFullYear()===date.getFullYear()&&d.getMonth()===date.getMonth();}).length});}
    bars('activityChart',months);
    const counts=new Map();participants.forEach(p=>counts.set(p.event_id,(counts.get(p.event_id)||0)+1));
    bars('participantChart',events.slice(0,5).map(e=>({label:e.title,value:counts.get(e.id)||0})));
    el('recentEvents').replaceChildren();
    events.slice(0,8).forEach(e=>{
      const row=document.createElement('div');row.className='event-row';const info=document.createElement('div');
      const a=document.createElement('a');a.href=moduleURL('settingsPanel',e.id);a.textContent=e.title;
      const detail=document.createElement('p');const labels={published:'Dipublikasikan',draft:'Draf',closed:'Ditutup'};
      detail.textContent=[e.code,e.event_date||'Tanggal belum diatur',labels[e.status]||e.status].filter(Boolean).join(' · ');
      info.append(a,detail);row.append(info);el('recentEvents').append(row);
    });
    if(!events.length)el('recentEvents').textContent='Belum ada kegiatan. Mulai dengan membuat kegiatan baru.';
    el('updated').textContent='Diperbarui '+new Date().toLocaleString('id-ID')+' · Pembaruan otomatis setiap 60 detik saat halaman aktif.';
  }
  async function refresh(){
    if(busy)return;busy=true;el('refresh').disabled=true;
    try{
      status('Memperbarui data…');
      const {data:sessionData,error:sessionError}=await client.auth.getSession();if(sessionError)throw sessionError;if(!sessionData.session){login();return;}
      const {data,error}=await client.rpc('get_my_edu_profile');if(error)throw error;profile=data?.[0];
      if(!profile){login();return;}
      if(!['admin','satker'].includes(profile.role))throw new Error('Akun belum memiliki akses dashboard.');
      if(profile.role==='satker'&&!profile.work_unit_id)throw new Error('Satuan Kerja akun belum ditetapkan. Hubungi admin.');
      el('identity').textContent=profile.role==='admin'?'Administrator · Semua Satuan Kerja':(profile.work_unit_name||'Satuan Kerja')+' · Akun Satker';
      el('welcome').textContent='Selamat datang'+(profile.full_name?', '+profile.full_name:'')+'.';
      el('accountLink').hidden=profile.role!=='admin';
      const events=await rows('external_events','id,code,title,status,lifecycle_status,event_date,created_at,work_unit_id',q=>profile.role==='satker'?q.eq('work_unit_id',profile.work_unit_id):q);
      const ids=events.map(e=>e.id);
      const [participants,certificates]=await Promise.all([
        children('external_participants','id,event_id,evaluation_completed',ids),
        children('external_certificates','id,event_id,status',ids)
      ]);
      render(events,participants,certificates);el('workspace').hidden=false;status('Data sesuai akses akun Anda.');
    }catch(error){
      // Jangan mempertahankan data akun lama ketika sesi/profil atau pemuatan gagal.
      el('workspace').hidden=true;el('accountLink').hidden=true;
      status('Data belum dapat dimuat: '+error.message+'. Muat ulang halaman untuk mencoba kembali.',true);
    }finally{busy=false;el('refresh').disabled=false;}
  }
  document.querySelectorAll('[data-module]').forEach(a=>a.addEventListener('click',event=>{
    const panel=a.dataset.module;if(!eventModules.has(panel))return;
    event.preventDefault();if(el('eventPicker').value){location.href=moduleURL(panel,el('eventPicker').value);return;}
    pendingModule=panel;el('pickerDialog').showModal();
  }));
  el('closePicker').onclick=()=>{el('pickerDialog').close();el('eventPicker').focus();};
  el('eventPicker').onchange=()=>{if(pendingModule&&el('eventPicker').value){location.href=moduleURL(pendingModule,el('eventPicker').value);pendingModule=null;}};
  el('refresh').onclick=refresh;
  el('logout').onclick=async()=>{el('logout').disabled=true;try{const {error}=await client.auth.signOut();if(error)throw error;login();}catch(error){status('Keluar belum berhasil: '+error.message,true);el('logout').disabled=false;}};
  async function start(){
    try{
      client=window.KabayanKegiatanSupabase.getClient();el('logout').disabled=false;
      client.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){el('workspace').hidden=true;login();}});
      await refresh();timer=setInterval(()=>{if(!document.hidden)refresh();},60000);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
      window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
    }catch(error){status('Dashboard belum dapat dibuka: '+error.message,true);}
  }
  start();
})();
