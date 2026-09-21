const q=document.getElementById('q');
const items=[...document.querySelectorAll('.item')];
const cats=[...document.querySelectorAll('.cat')];
const count=document.getElementById('count');
const empty=document.getElementById('empty');
const isBar=document.title.toLowerCase().includes('барная');
document.body.classList.add(isBar?'bar-catalog':'food-catalog');

items.forEach((item,i)=>{
  if(item.querySelector('.item-media')) return;
  const media=document.createElement('div'); media.className='item-media';
  const img=document.createElement('img'); img.className='item-photo';
  img.alt=item.querySelector('h3')?.textContent?.trim()||'';
  img.decoding='async'; img.loading=i<8?'eager':'lazy';
  const prefix=isBar?'bar':'food';
  img.src=`assets/${isBar?'bar':'menu'}/items/${prefix}-${String(i+1).padStart(3,'0')}.jpg?v=20260921-all-item-images-v2`;
  media.appendChild(img); item.prepend(media);
});

function run(){
  const s=(q?.value||'').trim().toLowerCase();let n=0;
  items.forEach(x=>{const ok=!s||(x.dataset.s||'').includes(s);x.hidden=!ok;if(ok)n++});
  cats.forEach(c=>c.hidden=!c.querySelector('.item:not([hidden])'));
  if(count)count.textContent=n+' позиций'; if(empty)empty.hidden=n!==0;
}
q?.addEventListener('input',run);run();