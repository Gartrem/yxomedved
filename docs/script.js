const header=document.querySelector('.site-header');
const menuBtn=document.querySelector('.menu-btn');
const drawer=document.querySelector('.menu-drawer');
const closeBtn=drawer?.querySelector('button');

const setHeader=()=>header?.classList.toggle('scrolled',window.scrollY>18);
setHeader();
window.addEventListener('scroll',setHeader,{passive:true});

function openMenu(){
  if(!drawer)return;
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  menuBtn?.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
function closeMenu(){
  if(!drawer)return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  menuBtn?.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}
menuBtn?.addEventListener('click',openMenu);
closeBtn?.addEventListener('click',closeMenu);
drawer?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
window.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

if(window.matchMedia('(min-width: 981px) and (prefers-reduced-motion: no-preference)').matches){
  const hero=document.querySelector('.hero-bg');
  if(hero){
    window.addEventListener('scroll',()=>{
      const y=Math.min(window.scrollY*.035,24);
      hero.style.transform='scale(1.02) translate3d(0,'+y+'px,0)';
    },{passive:true});
  }
}