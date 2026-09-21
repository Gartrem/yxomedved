const BAR_GROUPS=[
  {id:'all',label:'Все',cats:[]},
  {id:'cocktails',label:'Коктейли',cats:['cocktails','infusions']},
  {id:'wine',label:'Вино',cats:['glass','champagne','sparkling','wine-color','white-wine','red-wine']},
  {id:'strong',label:'Крепкий алкоголь',cats:['aperitif','liqueurs','rum','cognac','tequila','gin','vodka','single-malt','scotch','bourbon','irish']},
  {id:'beer',label:'Пиво',cats:['beer']},
  {id:'soft',label:'Безалкогольное',cats:['soft','coffee-tea']}
];
const params=new URLSearchParams(location.search);
const state={tab:params.get('tab')==='bar'?'bar':'food',group:'all',query:''};
const mainSwitch=[...document.querySelectorAll('.main-switch button')];
const catalog=document.getElementById('catalog');
const groupNav=document.getElementById('groupNav');
const categoryNav=document.getElementById('categoryNav');
const search=document.getElementById('search');
const resultCount=document.getElementById('resultCount');
const sections=[...catalog.querySelectorAll('.catalog-section')];

function sectionAllowed(section){
  if(section.dataset.tab!==state.tab)return false;
  if(state.tab==='bar'&&state.group!=='all'){
    const group=BAR_GROUPS.find(item=>item.id===state.group);
    return Boolean(group?.cats.includes(section.dataset.cat));
  }
  return true;
}

function renderGroups(){
  groupNav.innerHTML='';
  groupNav.hidden=state.tab!=='bar';
  if(groupNav.hidden)return;
  BAR_GROUPS.forEach(group=>{
    const button=document.createElement('button');
    button.type='button';
    button.textContent=group.label;
    button.className=group.id===state.group?'active':'';
    button.addEventListener('click',()=>{
      state.group=group.id;
      applyFilters();
      document.querySelector('.category-nav')?.scrollIntoView({behavior:'smooth',block:'start'});
    });
    groupNav.appendChild(button);
  });
}

function renderCategories(){
  categoryNav.innerHTML='';
  sections.filter(sectionAllowed).forEach(section=>{
    const link=document.createElement('a');
    link.href='#'+section.id;
    link.textContent=section.dataset.title;
    link.addEventListener('click',event=>{
      event.preventDefault();
      const header=document.querySelector('.catalog-header')?.offsetHeight||0;
      const controls=document.querySelector('.catalog-controls')?.offsetHeight||0;
      const top=window.scrollY+section.getBoundingClientRect().top-header-controls-18;
      window.scrollTo({top,behavior:'smooth'});
      categoryNav.querySelectorAll('a').forEach(item=>item.classList.toggle('active',item===link));
    });
    categoryNav.appendChild(link);
  });
}

function setFeatured(){
  const food=state.tab==='food';
  document.getElementById('featureMain').src=food?'assets/menu/items/food-025.jpg':'assets/cocktail-960.webp';
  document.getElementById('featureSide').src=food?'assets/menu/items/food-031.jpg':'assets/cocktail-520.webp';
  document.getElementById('featureMainEyebrow').textContent=food?'КУХНЯ':'BAR';
  document.getElementById('featureMainTitle').textContent=food?'Выбор кухни':'Коктейльный ритм';
  document.getElementById('featureSideEyebrow').textContent=food?'РОЛЛЫ':'NIGHT';
  document.getElementById('featureSideTitle').textContent=food?'Для компании':'Бар';
}

function applyFilters(){
  const query=state.query.toLowerCase();
  let total=0;
  sections.forEach(section=>{
    if(!sectionAllowed(section)){section.hidden=true;return}
    let visible=0;
    section.querySelectorAll('.menu-item').forEach(item=>{
      const ok=!query||(item.dataset.search||'').includes(query);
      item.hidden=!ok;
      if(ok){visible++;total++}
    });
    section.hidden=visible===0;
  });
  resultCount.textContent=total+' позиций';
  renderGroups();
  renderCategories();
  setFeatured();
}

function setTab(tab){
  state.tab=tab;
  state.group='all';
  mainSwitch.forEach(button=>{
    const active=button.dataset.tab===tab;
    button.classList.toggle('active',active);
    button.setAttribute('aria-selected',String(active));
  });
  history.replaceState(null,'',location.pathname+'?tab='+tab);
  applyFilters();
}

mainSwitch.forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));
search.addEventListener('input',()=>{state.query=search.value.trim();applyFilters()});
setTab(state.tab);
