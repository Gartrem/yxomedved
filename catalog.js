
const MENU_PAGES=[
  'Обложка','Салаты','Салат с ростбифом','Фирменные плато','Фирменные плато',
  'Холодные закуски','Супы','Горячие блюда','Горячие блюда','Горячие блюда',
  'Паста и пельмени','Дракон','Роллы','Горячие закуски','Горячие закуски',
  'Десерты','Десерты','Контакты'
];
let menuPageIndex=0;
const menuBook=document.getElementById('menuBook');
const menuArt=document.getElementById('menuArt');
const menuPage=document.getElementById('menuPage');
const menuPrev=document.getElementById('menuPrev');
const menuNext=document.getElementById('menuNext');
const menuThumbs=document.getElementById('menuThumbs');
const menuPageCurrent=document.getElementById('menuPageCurrent');
const menuPageTotal=document.getElementById('menuPageTotal');
const menuPageTitle=document.getElementById('menuPageTitle');
const menuLightbox=document.getElementById('menuLightbox');
const menuLightboxArt=document.getElementById('menuLightboxArt');
const menuLightboxTitle=document.getElementById('menuLightboxTitle');
const menuLightboxCount=document.getElementById('menuLightboxCount');

function menuSpritePosition(index){
  const col=index%6,row=Math.floor(index/6);
  return (col*20)+'% '+(row*50)+'%';
}
function applyMenuSprite(el,index){if(el)el.style.backgroundPosition=menuSpritePosition(index)}
function renderMenuThumbs(){
  if(!menuThumbs)return;
  menuThumbs.innerHTML='';
  MENU_PAGES.forEach((title,index)=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='menu-book-thumb'+(index===menuPageIndex?' active':'');
    b.setAttribute('aria-label','Страница '+(index+1)+': '+title);
    const art=document.createElement('span');
    art.className='menu-book-art';
    applyMenuSprite(art,index);
    const n=document.createElement('small');
    n.textContent=String(index+1).padStart(2,'0');
    b.append(art,n);
    b.addEventListener('click',()=>setMenuPage(index,true));
    menuThumbs.appendChild(b);
  });
}
function setMenuPage(index,scrollThumb=false){
  menuPageIndex=(index+MENU_PAGES.length)%MENU_PAGES.length;
  applyMenuSprite(menuArt,menuPageIndex);
  applyMenuSprite(menuLightboxArt,menuPageIndex);
  if(menuPageCurrent)menuPageCurrent.textContent=String(menuPageIndex+1).padStart(2,'0');
  if(menuPageTotal)menuPageTotal.textContent=String(MENU_PAGES.length).padStart(2,'0');
  if(menuPageTitle)menuPageTitle.textContent=MENU_PAGES[menuPageIndex];
  if(menuLightboxTitle)menuLightboxTitle.textContent=MENU_PAGES[menuPageIndex];
  if(menuLightboxCount)menuLightboxCount.textContent=String(menuPageIndex+1).padStart(2,'0')+' / '+MENU_PAGES.length;
  const thumbs=[...document.querySelectorAll('.menu-book-thumb')];
  thumbs.forEach((thumb,i)=>thumb.classList.toggle('active',i===menuPageIndex));
  if(scrollThumb)thumbs[menuPageIndex]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
  if(state.tab==='food'){
    const u=new URL(location.href);
    u.searchParams.set('tab','food');
    u.searchParams.set('page',String(menuPageIndex+1));
    history.replaceState(null,'',u.pathname+'?'+u.searchParams.toString());
  }
}
function menuStep(delta){setMenuPage(menuPageIndex+delta,true)}
menuPrev?.addEventListener('click',()=>menuStep(-1));
menuNext?.addEventListener('click',()=>menuStep(1));
document.getElementById('menuLightboxPrev')?.addEventListener('click',()=>menuStep(-1));
document.getElementById('menuLightboxNext')?.addEventListener('click',()=>menuStep(1));
menuPage?.addEventListener('click',()=>{
  if(typeof menuLightbox?.showModal==='function'){
    menuLightbox.showModal();document.body.classList.add('menu-lightbox-open');
  }
});
document.getElementById('menuLightboxClose')?.addEventListener('click',()=>{
  menuLightbox?.close();document.body.classList.remove('menu-lightbox-open');
});
menuLightbox?.addEventListener('click',e=>{
  if(e.target===menuLightbox){menuLightbox.close();document.body.classList.remove('menu-lightbox-open')}
});
menuLightbox?.addEventListener('close',()=>document.body.classList.remove('menu-lightbox-open'));
document.addEventListener('keydown',e=>{
  if(state.tab!=='food')return;
  if(e.key==='ArrowLeft')menuStep(-1);
  if(e.key==='ArrowRight')menuStep(1);
});
let menuSwipeX=null;
function swipeStart(e){menuSwipeX=(e.touches?.[0]?.clientX??e.clientX)}
function swipeEnd(e){
  if(menuSwipeX===null)return;
  const x=(e.changedTouches?.[0]?.clientX??e.clientX);
  const d=x-menuSwipeX;menuSwipeX=null;
  if(Math.abs(d)>48)menuStep(d<0?1:-1);
}
menuPage?.addEventListener('touchstart',swipeStart,{passive:true});
menuPage?.addEventListener('touchend',swipeEnd,{passive:true});
menuLightbox?.addEventListener('touchstart',swipeStart,{passive:true});
menuLightbox?.addEventListener('touchend',swipeEnd,{passive:true});
renderMenuThumbs();
setMenuPage(menuPageIndex);


const BAR_GROUPS=[
  {id:'all',label:'Все',cats:[]},
  {id:'cocktails',label:'Коктейли',cats:['cocktails','infusions']},
  {id:'wine',label:'Вино',cats:['glass','champagne','sparkling','wine-color','white-wine','red-wine']},
  {id:'strong',label:'Крепкий алкоголь',cats:['aperitif','liqueurs','rum','cognac','tequila','gin','vodka','single-malt','scotch','bourbon','irish']},
  {id:'beer',label:'Пиво',cats:['beer']},
  {id:'soft',label:'Безалкогольное',cats:['soft','coffee-tea']}
];
const params=new URLSearchParams(location.search);
menuPageIndex=Math.min(Math.max((Number(params.get('page'))||1)-1,0),MENU_PAGES.length-1);
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
  document.body.dataset.catalogTab=tab;
  state.group='all';
  mainSwitch.forEach(button=>{
    const active=button.dataset.tab===tab;
    button.classList.toggle('active',active);
    button.setAttribute('aria-selected',String(active));
  });
  const tabUrl=new URL(location.href);tabUrl.searchParams.set('tab',tab);if(tab==='food')tabUrl.searchParams.set('page',String(menuPageIndex+1));else tabUrl.searchParams.delete('page');history.replaceState(null,'',tabUrl.pathname+'?'+tabUrl.searchParams.toString());
  applyFilters();
}

mainSwitch.forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));
search.addEventListener('input',()=>{state.query=search.value.trim();applyFilters()});
setTab(state.tab);


// Initialize menu book after catalog state exists.
if(document.getElementById('menuBook')){renderMenuThumbs();setMenuPage(menuPageIndex);}
