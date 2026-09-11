/* Ringkasan di dalam aplikasi utama. Memakai sb dan profil yang sudah diverifikasi. */
window.KabayanDashboard=(()=>{
  'use strict';
  let timer=null,generation=0,running=null;
  const number=n=>new Intl.NumberFormat('id-ID').format(n);
  const metrics=['eventCount','participantCount','certificateCount','evaluationCount'];
  async function rows(table,columns,scope){
    const all=[];
    for(let offset=0;;offset+=500){
      let query=sb.from(table).select(columns).order('id').range(offset,offset+499);if(scope)query=scope(query);
      const {data,error}=await query;if(error)throw error;
      all.push(...(data||[]));if(!data||data.length<500)return all;
    }
  }
  async function children(table,columns,ids){
    const all=[];for(let i=0;i<ids.length;i+=100)all.push(...await rows(table,columns,q=>q.in('event_id',ids.slice(i,i+100))));return all;
  }
  function bars(id,items){
    const root=$(id);root.replaceChildren();
    if(!items.length){const p=document.createElement('p');p.className='chart-empty';p.textContent='Belum ada data kegiatan.';root.append(p);return;}
    const max=Math.max(1,...items.map(x=>x.value));
    for(const item of items){
      const row=document.createElement('div');row.className='bar-row';
      const label=document.createElement('span');label.className='bar-label';label.textContent=item.label;label.title=item.label;
      const track=document.createElement('div');track.className='bar-track';track.setAttribute('aria-hidden','true');
      const fill=document.createElement('div');fill.className='bar-fill';fill.style.width=item.value/max*100+'%';track.append(fill);
      const value=document.createElement('strong');value.textContent=number(item.value);row.append(label,track,value);root.append(row);
    }
  }
  function clear(){metrics.forEach(id=>$(id).textContent='—');$('recentEvents').replaceChildren();$('activityChart').replaceChildren();$('participantChart').replaceChildren();$('dashboardUpdated').textContent='';}
  function render(items,participants,certificates){
    items.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))||String(a.id).localeCompare(String(b.id)));
    const values=[items.filter(e=>e.status==='published'&&(e.lifecycle_status||'active')==='active').length,participants.length,certificates.filter(c=>c.status==='valid').length,participants.filter(p=>p.evaluation_completed).length];
    metrics.forEach((id,i)=>$(id).textContent=number(values[i]));
    const now=new Date(),months=[];
    for(let i=5;i>=0;i--){const date=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({label:date.toLocaleDateString('id-ID',{month:'short',year:'2-digit'}),value:items.filter(e=>{const d=new Date(e.created_at);return d.getMonth()===date.getMonth()&&d.getFullYear()===date.getFullYear();}).length});}
    bars('activityChart',months);const count=new Map();participants.forEach(p=>count.set(p.event_id,(count.get(p.event_id)||0)+1));bars('participantChart',items.slice(0,5).map(e=>({label:e.title,value:count.get(e.id)||0})));
    const recent=$('recentEvents');recent.replaceChildren();
    if(!items.length){const empty=document.createElement('p');empty.className='chart-empty';empty.textContent='Belum ada kegiatan. Pilih “Buat kegiatan” untuk memulai.';recent.append(empty);}
    for(const event of items.slice(0,6)){
      const row=document.createElement('div');row.className='recent-event';
      const date=document.createElement('div');date.className='event-date';date.textContent=event.event_date?event.event_date.slice(8,10):'—';
      const title=document.createElement('div');title.className='recent-title';const name=document.createElement('b');name.textContent=event.title;
      const detail=document.createElement('small');detail.textContent=[event.code,event.event_date||'Tanggal belum ditetapkan'].join(' · ');title.append(name,detail);
      const badge=document.createElement('span');badge.className='status '+(event.status==='published'?'published':event.status==='closed'?'closed':'draft');badge.textContent=({published:'Dipublikasikan',closed:'Ditutup',draft:'Draf'})[event.status]||'Kegiatan';
      const button=document.createElement('button');button.type='button';button.className='btn btn-outline';button.textContent='Kelola →';button.setAttribute('aria-label','Kelola '+event.title);
      button.onclick=async()=>{button.disabled=true;try{if(!events.some(e=>e.id===event.id))await loadEvents();await window.KabayanWorkflow.openEvent(event.id);}catch(e){window.KabayanWorkflow.notice(e.message);}finally{button.disabled=false;}};
      row.append(date,title,badge,button);recent.append(row);
    }
    $('dashboardUpdated').textContent='Terakhir diperbarui '+new Date().toLocaleString('id-ID')+' · Pembaruan otomatis setiap 60 detik.';
  }
  async function refresh(){
    if(!currentProfile||!sb||document.hidden||running===generation)return;
    const token=generation;running=token;$('refreshDashboard').disabled=true;$('dashboardStatus').textContent='Memperbarui ringkasan…';$('dashboardStatus').classList.remove('error');
    const profile=currentProfile;
    try{
      const items=await rows('external_events','id,title,code,event_date,status,lifecycle_status,created_at,work_unit_id',q=>profile.role==='satker'?q.eq('work_unit_id',profile.work_unit_id):q);
      const ids=items.map(e=>e.id);
      const [participants,certificates]=await Promise.all([children('external_participants','id,event_id,evaluation_completed',ids),children('external_certificates','id,event_id,status',ids)]);
      if(token!==generation)return;render(items,participants,certificates);$('dashboardStatus').textContent='';
    }catch(e){if(token!==generation)return;clear();$('dashboardStatus').textContent='Ringkasan belum dapat dimuat: '+e.message+'. Gunakan Perbarui data untuk mencoba lagi. Modul lain tetap dapat dibuka.';$('dashboardStatus').classList.add('error');}
    finally{if(token===generation){running=null;$('refreshDashboard').disabled=false;}}
  }
  function start(){if(timer)return;clear();refresh();timer=setInterval(refresh,60000);}
  function stop(){clearInterval(timer);timer=null;generation++;running=null;$('refreshDashboard').disabled=false;}
  $('refreshDashboard').onclick=refresh;
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&timer)refresh();});
  window.addEventListener('pagehide',stop);
  return {start,stop,refresh};
})();
