/* Presentation only; counts and permissions come from the existing dashboard. */
(() => {
  'use strict';
  const dashboard=document.getElementById('dashboard');
  if(!dashboard)return;
  const top=dashboard.querySelector('.overview-top');
  const access=top.querySelector('.summary-note');
  const ring=document.createElement('section');
  ring.className='completion-card';
  ring.setAttribute('aria-labelledby','completionTitle');
  ring.innerHTML='<div class="completion-heading"><span class="overline">PARTISIPASI</span><span class="completion-spark" aria-hidden="true">↗</span></div><h2 id="completionTitle">Evaluasi peserta</h2><div class="completion-dial"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="dial-track" cx="100" cy="100" r="82"/><circle class="dial-value" cx="100" cy="100" r="82" pathLength="100"/></svg><div class="dial-label"><strong id="completionPercent">—</strong><span>sudah mengisi</span></div></div><p id="completionDetail" role="status">Menunggu ringkasan kegiatan.</p>';
  top.append(ring);
  const stats=dashboard.querySelector('.dashboard-stats');
  const focus=dashboard.querySelector('.dashboard-focus');
  stats.after(focus);
  dashboard.querySelector('.recent-card').after(access);
  function number(id){const raw=document.getElementById(id)?.textContent.trim();return raw&&/^[\d.]+$/.test(raw)?Number(raw.replaceAll('.','')):null;}
  function update(){
    const total=number('participantCount'),completed=number('evaluationCount');
    const valid=total!==null&&completed!==null&&completed<=total;
    const percent=valid&&total>0?Math.round(completed/total*100):null;
    ring.style.setProperty('--completion',percent??0);
    document.getElementById('completionPercent').textContent=percent===null?'—':percent+'%';
    document.getElementById('completionDetail').textContent=!valid?'Ringkasan belum tersedia.':total===0?'Persentase tampil setelah ada peserta.':new Intl.NumberFormat('id-ID').format(completed)+' dari '+new Intl.NumberFormat('id-ID').format(total)+' peserta terdaftar.';
  }
  for(const id of ['participantCount','evaluationCount'])new MutationObserver(update).observe(document.getElementById(id),{childList:true,characterData:true,subtree:true});
  update();
})();
