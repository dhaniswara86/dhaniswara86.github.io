/* Panel lipat tanpa mengubah ID, formulir, sesi, atau aturan akses existing. */
(() => {
  const panels = new Map();
  document.querySelectorAll('.sidebar-layout > section.grid > [id]').forEach(panel => {
    const title = panel.querySelector('h2');
    if (!title) return;
    const content = document.createElement('div');
    content.id = panel.id + 'Content';
    content.className = 'fold-content';
    while (panel.firstChild) content.append(panel.firstChild);
    const heading = document.createElement('h2');
    heading.className = 'fold-heading';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'fold-toggle';
    button.setAttribute('aria-controls', content.id);
    const label = document.createElement('span');
    const arrow = document.createElement('span');
    arrow.className = 'fold-arrow';arrow.textContent = '⌄';arrow.setAttribute('aria-hidden','true');
    const syncTitle = () => { label.textContent = title.textContent; };
    syncTitle();new MutationObserver(syncTitle).observe(title,{childList:true,characterData:true,subtree:true});
    title.classList.add('fold-original-title');
    button.append(label,arrow);heading.append(button);panel.append(heading,content);
    panel.classList.add('fold-panel');
    function setOpen(open) { content.hidden = !open;button.setAttribute('aria-expanded',String(open)); }
    setOpen(false);
    button.addEventListener('click',()=>setOpen(content.hidden));
    panels.set(panel.id,{panel,setOpen});
  });
  function open(id,scroll=false) {
    const entry = panels.get(id);
    if(!entry) return;
    entry.setOpen(true);
    // Pertahankan visibilitas panel sesuai peran dan kegiatan.
    if(scroll && entry.panel.getClientRects().length) entry.panel.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function openHash(){open(location.hash.slice(1));}
  document.querySelectorAll('.admin-quick-nav a[href^="#"]').forEach(a=>a.addEventListener('click',()=>open(a.hash.slice(1))));
  window.addEventListener('hashchange',openHash);openHash();
  document.getElementById('newEventBtn').addEventListener('click',()=>open('settingsPanel',true));
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-event-edit], [data-manage-edit], [data-event-detail]') ||
      (event.target.closest('.event-item') && !event.target.closest('.event-actions'))) open('settingsPanel');
  },true);
})();
