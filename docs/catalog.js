const BAR_GROUPS=[
  {id:'all',label:'Все',cats:[]},
  {id:'cocktails',label:'Коктейли',cats:['cocktails','infusions']},
  {id:'wine',label:'Вино',cats:['glass','champagne','sparkling','wine-color','white-wine','red-wine']},
  {id:'strong',label:'Крепкий алкоголь',cats:['aperitif','liqueurs','rum','cognac','tequila','gin','vodka','single-malt','scotch','bourbon','irish']},
  {id:'beer',label:'Пиво',cats:['beer']},
  {id:'soft',label:'Безалкогольное',cats:['soft','coffee-tea']}
];
const state={tab:new URLSearchParams(location.search).get('tab')==='bar'?'bar':'food',group:'all',query:''};
const mainSwitch=[...document.querySelectorAll('.main-switch button')];
const catalog=document.getElementById('catalog');
const groupNav=document.getElementById('groupNav');
const categoryNav=document.getElementById('categoryNav');
const search=document.getElementById('search');
const resultCount=document.getElementById('resultCount');
const sections=[...catalog.querySelectorAll('.catalog-section')];

function sectionAllowed(sec){
  if(sec.dataset.tab!==state.tab)return false;
  if(state.tab==='bar'&&state.group!=='all'){
    const g=BAR_GROUPS.find(x=>x.id===state.group);
    if(!g?.cats.includes(sec.dataset.cat))return false;
  }
  return true;
}
function renderGroups(){
  groupNav.innerHTML='';
  groupNav.hidden=state.tab!=='bar';
  if(groupNav.hidden)return;
  BAR_GROUPS.forEach(g=>{
    const b=document.createElement('button');
    b.type='button';b.textContent=g.label;b.className=g.id===state.group?'active':'';
    b.addEventListener('click',()=>{state.group=g.id;applyFilters(true)});
    groupNav.appendChild(b);
  });
}
function renderCategories(){
  categoryNav.innerHTML='';
  sections.filter(sectionAllowed).forEach(sec=>{
    const a=document.createElement('a');
    a.href='#'+sec.id;
    a.textContent=sec.dataset.title;
    a.addEventListener('click',e=>{
      e.preventDefault();
      const header=document.querySelector('.catalog-header')?.offsetHeight||0;
      const tools=document.querySelector('.catalog-tools')?.offsetHeight||0;
      const top=window.scrollY+sec.getBoundingClientRect().top-header-tools-18;
      window.scrollTo({top,behavior:'smooth'});
      categoryNav.querySelectorAll('a').forEach(x=>x.classList.toggle('active',x===a));
    });
    categoryNav.appendChild(a);
  });
}
function applyFilters(userAction=false){
  const q=state.query.toLowerCase();
  let total=0;
  sections.forEach(sec=>{
    if(!sectionAllowed(sec)){sec.hidden=true;return}
    let visible=0;
    sec.querySelectorAll('.menu-item').forEach(item=>{
      const ok=!q||(item.dataset.search||'').includes(q);
      item.hidden=!ok;if(ok){visible++;total++}
    });
    sec.hidden=visible===0;
  });
  resultCount.textContent=total+' позиций';
  renderGroups();renderCategories();setFeatured();
  if(userAction){
    const heroBottom=document.querySelector('.catalog-tools')?.getBoundingClientRect().bottom||0;
    if(window.scrollY>heroBottom+120) window.scrollTo({top:Math.max(0,window.scrollY),behavior:'auto'});
  }
}
function setFeatured(){
  const food=state.tab==='food';
  document.getElementById('featureMain').src=food?'assets/menu/items/food-025.jpg':'assets/bar/items/bar-079.jpg';
  document.getElementById('featureSide').src=food?'assets/menu/items/food-031.jpg':'assets/bar/items/bar-066.jpg';
  document.getElementById('featureMainEyebrow').textContent=food?'ГОРЯЧЕЕ':'COCKTAILS';
  document.getElementById('featureMainTitle').textContent=food?'Выбор кухни':'Авторский ритм';
  document.getElementById('featureSideEyebrow').textContent=food?'РОЛЛЫ':'WINE';
  document.getElementById('featureSideTitle').textContent=food?'Для компании':'Вино';
}
function setTab(tab){
  state.tab=tab;state.group='all';
  mainSwitch.forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  history.replaceState(null,'',location.pathname+'?tab='+tab);
  applyFilters(false);
}
mainSwitch.forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
search.addEventListener('input',()=>{state.query=search.value.trim();applyFilters(false)});
setTab(state.tab);
