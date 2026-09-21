const input=document.getElementById('menuSearch');
const items=[...document.querySelectorAll('.menu-item')];
const cats=[...document.querySelectorAll('.menu-category')];
const count=document.getElementById('menuVisibleCount');
const empty=document.getElementById('menuEmpty');

function update(){
  const q=(input?.value||'').trim().toLowerCase();
  let visible=0;
  items.forEach(item=>{
    const ok=!q || (item.dataset.search||'').includes(q);
    item.hidden=!ok;
    if(ok) visible++;
  });
  cats.forEach(cat=>{
    cat.hidden=!cat.querySelector('.menu-item:not([hidden])');
  });
  if(count) count.textContent=String(visible);
  if(empty) empty.hidden=visible!==0;
}
input?.addEventListener('input',update);
update();

document.querySelectorAll('.menu-chips a').forEach(a=>{
  a.addEventListener('click',()=>{ if(input) input.value=''; update(); });
});
