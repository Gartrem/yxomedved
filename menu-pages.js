const q=document.getElementById('q');
const items=[...document.querySelectorAll('.item')];
const cats=[...document.querySelectorAll('.cat')];
const count=document.getElementById('count');
const empty=document.getElementById('empty');
const isBar=document.title.toLowerCase().includes('барная');
document.body.classList.add(isBar?'bar-catalog':'food-catalog');

items.forEach((item,i)=>{
  let media=item.querySelector('.item-media');
  if(!media){
    media=document.createElement('figure');
    media.className='item-media';
    const img=document.createElement('img');
    img.className='item-photo';
    img.alt=item.querySelector('h3')?.textContent?.trim()||'';
    const prefix=isBar?'bar':'food';
    img.src=`assets/${isBar?'bar':'menu'}/items/${prefix}-${String(i+1).padStart(3,'0')}.jpg?v=20260921-catalog-v4`;
    img.decoding='async';
    media.appendChild(img);
    item.prepend(media);
  }
  const img=media.querySelector('img');
  if(img){
    img.decoding='async';
    img.loading=i<6?'eager':'lazy';
    if(i<3) img.fetchPriority='high';
    img.addEventListener('error',()=>{media.hidden=true},{once:true});
  }
});

function run(){
  const s=(q?.value||'').trim().toLowerCase();
  let n=0;
  items.forEach(x=>{
    const ok=!s||(x.dataset.s||'').includes(s);
    x.hidden=!ok;
    if(ok)n++;
  });
  cats.forEach(c=>c.hidden=!c.querySelector('.item:not([hidden])'));
  if(count) count.textContent=n+' позиций';
  if(empty) empty.hidden=n!==0;
}
q?.addEventListener('input',run);
run();

const chips=[...document.querySelectorAll('.chips a[href^="#"]')];
const chipById=new Map(chips.map(a=>[a.getAttribute('href').slice(1),a]));
function activateChip(id){
  chips.forEach(a=>a.classList.toggle('is-active',a===chipById.get(id)));
  const active=chipById.get(id);
  if(active) active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}
if('IntersectionObserver' in window && chips.length){
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible?.target?.id) activateChip(visible.target.id);
  },{rootMargin:'-22% 0px -68% 0px',threshold:[0,.15,.35]});
  cats.forEach(c=>observer.observe(c));
}
chips.forEach(a=>a.addEventListener('click',()=>activateChip(a.getAttribute('href').slice(1))));
