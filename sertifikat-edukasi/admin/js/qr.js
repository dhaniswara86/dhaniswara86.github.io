/* QR terintegrasi: memakai client, sesi dan profil Admin Kabayan. */
window.KabayanQR = (() => {
  let available = [], generation = null;
  const el = id => document.getElementById(id);
  const say = text => { el('qrStatus').textContent = text; };
  function link(event, phase) {
    const url = new URL(phase + '.html', location.href);
    url.searchParams.set('id', event.id);
    // Formulir existing masih membaca kode; UUID disertakan untuk kompatibilitas berikutnya.
    url.searchParams.set('kode', event.code);
    return url.href;
  }
  async function reloadEvents() {
    let query = sb.from('external_events').select('id,code,title,event_date,work_unit_id');
    if (currentProfile.role !== 'admin') {
      if (!currentProfile.work_unit_id) throw new Error('Satuan kerja akun tidak tersedia.');
      query = query.eq('work_unit_id', currentProfile.work_unit_id);
    }
    const {data,error} = await query;
    if(error) throw error;
    available = data || [];
    available.sort((a,b)=>String(b.event_date||'').localeCompare(String(a.event_date||'')));
    const previous = el('qrEvent').value;
    el('qrEvent').replaceChildren(new Option('Pilih kegiatan', ''));
    available.forEach(e=>el('qrEvent').add(new Option(`${e.code} — ${e.title}`,e.id)));
    if (available.some(e=>e.id===previous)) el('qrEvent').value=previous;
  }
  async function canvasFor(url) {
    const host = document.createElement('div');
    new QRCode(host,{text:url,width:768,height:768,correctLevel:QRCode.CorrectLevel.H});
    const source=host.querySelector('canvas');
    if(!source) throw new Error('Pustaka QR tidak menghasilkan canvas.');
    const canvas=document.createElement('canvas');canvas.width=canvas.height=896;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,896,896);ctx.drawImage(source,64,64);
    const logo=new Image();logo.src='assets/logo-djp.png';await logo.decode();
    const scale=Math.min(108/logo.naturalWidth,108/logo.naturalHeight);
    const w=logo.naturalWidth*scale,h=logo.naturalHeight*scale;
    ctx.fillRect((896-w)/2-8,(896-h)/2-8,w+16,h+16);ctx.drawImage(logo,(896-w)/2,(896-h)/2,w,h);
    return canvas;
  }
  async function generate() {
    el('qrGenerate').disabled=true;generation=null;el('qrOutput').replaceChildren();
    try {
      const event=available.find(e=>e.id===currentEvent?.id);
      if(!event || el('qrEvent').value!==event.id) throw new Error('Muat ulang kegiatan sebelum membuat QR.');
      if(!event) throw new Error('Pilih kegiatan terlebih dahulu.');
      const results=[];
      for(const [phase,type] of [['awal','Daftar Hadir + Pretest'],['akhir','Posttest + Evaluasi']]) {
        const url=link(event,phase),canvas=await canvasFor(url);
        const card=document.createElement('article');card.className='qr-card';
        const heading=document.createElement('h3');heading.textContent=type;
        const title=document.createElement('p');title.textContent=`${event.code} — ${event.title}`;
        const input=document.createElement('input');input.readOnly=true;input.value=url;input.setAttribute('aria-label',`Link ${type}`);
        const copy=document.createElement('button');copy.className='btn btn-outline';copy.textContent='Salin Link';copy.onclick=()=>copyText(url);
        const download=document.createElement('button');download.className='btn btn-yellow';download.textContent='Unduh PNG';
        download.onclick=()=>{const a=document.createElement('a');a.download=`QR_${String(event.code).replace(/[^a-z0-9_-]/gi,'_')}_${phase}.png`;a.href=canvas.toDataURL('image/png');a.click();};
        card.append(heading,title,canvas,input,copy,download);results.push({card,type});
      }
      el('qrOutput').append(...results.map(r=>r.card));generation=event;
      const {data:{session},error:authError}=await sb.auth.getSession();if(authError)throw authError;
      const rows=results.map(r=>({event_id:event.id,event_code:event.code,qr_type:r.type,generated_by:session?.user.id}));
      const {error}=await sb.from('edu_qr_logs').insert(rows);
      if(error)throw new Error('QR berhasil dibuat, tetapi histori gagal disimpan: '+error.message);
      say('Dua QR berhasil dibuat dan histori tersimpan.');await history();
    } catch(error) {say(error.message);} finally {el('qrGenerate').disabled=false;}
  }
  async function history() {
    const body=el('qrHistoryRows');body.replaceChildren();el('qrHistoryStatus').textContent='Memuat histori…';
    try {
      let query=sb.from('edu_qr_logs').select('*');
      if(currentProfile.role!=='admin') {
        if(!available.length){el('qrHistoryStatus').textContent='Belum ada kegiatan untuk satuan kerja ini.';return;}
        query=query.in('event_id',available.map(e=>e.id));
      }
      let result=await query.order('generated_at',{ascending:false}).limit(200);
      if(result.error && /generated_at/.test(result.error.message) && ['42703','PGRST204'].includes(result.error.code)) {
        query=sb.from('edu_qr_logs').select('*');
        if(currentProfile.role!=='admin')query=query.in('event_id',available.map(e=>e.id));
        result=await query.order('created_at',{ascending:false}).limit(200);
      }
      if(result.error)throw result.error;
      for(const row of result.data||[]) {
        const tr=document.createElement('tr'),event=available.find(e=>e.id===row.event_id);
        const raw=row.generated_at||row.created_at;const date=raw?new Date(raw):null;
        const values=[date&&!isNaN(date)?date.toLocaleString('id-ID'):'—',event?`${event.code} — ${event.title}`:row.event_code||'—',row.qr_type||'—',row.generated_by||'—'];
        values.forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td);});
        body.append(tr);
      }
      el('qrHistoryStatus').textContent=result.data?.length?'Menampilkan hingga 200 histori terbaru.':'Belum ada histori QR.';
    } catch(error) {el('qrHistoryStatus').textContent='Histori gagal dimuat: '+error.message;}
  }
  async function init() {try {await reloadEvents();el('qrEvent').value=currentEvent?.id||'';el('qrOutput').replaceChildren();say('');await history();} catch(error){say(error.message);}}
  el('qrGenerate').onclick=generate;
  el('qrRefresh').onclick=init;
  el('qrHistoryRefresh').onclick=history;
  return {init};
})();
// Tunggu seluruh panel selesai dipasang sebelum memulihkan sesi dan tujuan modul.
document.addEventListener('DOMContentLoaded',()=>{guard().catch(error=>msg('loginErr',error.message));},{once:true});
