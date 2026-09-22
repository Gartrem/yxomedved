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

const menuBook=document.getElementById('menuBook');
const mainSwitch=[...document.querySelectorAll('.main-switch button')];
const catalog=document.getElementById('catalog');
const controls=document.querySelector('.catalog-controls');
const groupNav=document.getElementById('groupNav');
const categoryNav=document.getElementById('categoryNav');
const search=document.getElementById('search');
const resultCount=document.getElementById('resultCount');
const sections=catalog?[...catalog.querySelectorAll('.catalog-section')]:[];

function sectionAllowed(section){
  if(section.dataset.tab!==state.tab)return false;
  if(state.tab==='bar'&&state.group!=='all'){
    const group=BAR_GROUPS.find(item=>item.id===state.group);
    return Boolean(group?.cats.includes(section.dataset.cat));
  }
  return true;
}

function renderGroups(){
  if(!groupNav)return;
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
    });
    groupNav.appendChild(button);
  });
}

function renderCategories(){
  if(!categoryNav)return;
  categoryNav.innerHTML='';
  if(state.tab!=='bar'){
    categoryNav.hidden=true;
    return;
  }
  categoryNav.hidden=false;
  sections.filter(sectionAllowed).forEach(section=>{
    const link=document.createElement('a');
    link.href='#'+section.id;
    link.textContent=section.dataset.title;
    link.addEventListener('click',event=>{
      event.preventDefault();
      const header=document.querySelector('.catalog-header')?.offsetHeight||0;
      const controlsHeight=controls?.offsetHeight||0;
      const top=window.scrollY+section.getBoundingClientRect().top-header-controlsHeight-18;
      window.scrollTo({top,behavior:'smooth'});
      categoryNav.querySelectorAll('a').forEach(item=>item.classList.toggle('active',item===link));
    });
    categoryNav.appendChild(link);
  });
}

function applyFilters(){
  if(menuBook)menuBook.hidden=state.tab!=='food';
  if(controls)controls.hidden=state.tab!=='bar';
  if(catalog)catalog.hidden=state.tab!=='bar';

  if(state.tab==='food'){
    sections.forEach(section=>section.hidden=true);
    if(resultCount)resultCount.textContent='';
    renderGroups();
    renderCategories();
    return;
  }

  const query=(state.query||'').toLowerCase();
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
  if(resultCount)resultCount.textContent=total+' позиций';
  renderGroups();
  renderCategories();
}

function setTab(tab){
  state.tab=tab==='bar'?'bar':'food';
  document.body.dataset.catalogTab=state.tab;
  state.group='all';

  mainSwitch.forEach(button=>{
    const active=button.dataset.tab===state.tab;
    button.classList.toggle('active',active);
    button.setAttribute('aria-selected',String(active));
  });

  const tabUrl=new URL(location.href);
  tabUrl.searchParams.set('tab',state.tab);
  history.replaceState(null,'',tabUrl.pathname+'?'+tabUrl.searchParams.toString()+tabUrl.hash);

  applyFilters();
}

mainSwitch.forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));
if(search){
  search.addEventListener('input',()=>{
    state.query=search.value.trim();
    applyFilters();
  });
}

setTab(state.tab);
