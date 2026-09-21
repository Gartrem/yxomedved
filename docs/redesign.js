const header=document.querySelector('.site-header');
const burger=document.querySelector('.burger');
const drawer=document.querySelector('.menu-drawer');
const closeButton=document.querySelector('.drawer-close');

function setDrawer(open){
  if(!drawer||!burger)return;
  drawer.classList.toggle('open',open);
  drawer.setAttribute('aria-hidden',String(!open));
  burger.setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('lock',open);
  if(open) drawer.querySelector('a')?.focus();
}

burger?.addEventListener('click',()=>setDrawer(true));
closeButton?.addEventListener('click',()=>setDrawer(false));
drawer?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setDrawer(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape')setDrawer(false)});

function syncHeader(){header?.classList.toggle('scrolled',window.scrollY>24)}
window.addEventListener('scroll',syncHeader,{passive:true});
syncHeader();
