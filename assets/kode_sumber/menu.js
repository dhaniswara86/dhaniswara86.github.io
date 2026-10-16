
(()=>{const btn=document.getElementById('menuToggle');const menu=document.getElementById('mobileMenu');
if(!btn||!menu)return;
const close=()=>{menu.hidden=true;document.body.classList.remove('menu-open');btn.setAttribute('aria-expanded','false');btn.textContent='☰';btn.setAttribute('aria-label','Buka menu')};
btn.addEventListener('click',()=>{const isOpen=menu.hidden;menu.hidden=!isOpen;document.body.classList.toggle('menu-open',isOpen);btn.setAttribute('aria-expanded',String(isOpen));btn.setAttribute('aria-label',isOpen?'Tutup menu':'Buka menu');btn.textContent=isOpen?'×':'☰'});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)close()});
window.matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)close()});
})();
