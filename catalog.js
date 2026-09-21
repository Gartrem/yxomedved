const BAR_GROUPS=[
  {id:'all',label:'Все',cats:[]},
  {id:'cocktails',label:'Коктейли',cats:['cocktails','infusions']},
  {id:'wine',label:'Вино',cats:['glass','champagne','sparkling','wine-color','white-wine','red-wine']},
  {id:'strong',label:'Крепкий алкоголь',cats:['aperitif','liqueurs','rum','cognac','tequila','gin','vodka','single-malt','scotch','bourbon','irish']},
  {id:'beer',label:'Пиво',cats:['beer']},
  {id:'soft',label:'Безалкогольное',cats:['soft','coffee-tea']}
];
const state={tab:new URLSearchParams(location.search).get('tab')==='bar'?'bar':'food',group:'all',query:''};

function wrapLines(ctx,text,maxWidth,maxLines=3){
  const words=(text||'').split(/\s+/).filter(Boolean),lines=[];let line='';
  for(const word of words){
    const test=line?line+' '+word:word;
    if(ctx.measureText(test).width>maxWidth&&line){
      lines.push(line);line=word;
      if(lines.length===maxLines-1)break;
    }else line=test;
  }
  if(line&&lines.length<maxLines)lines.push(line);
  return lines;
}
function hashColor(s){
  let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;
  return {a:10+(h%26),b:32+((h>>5)%40),c:44+((h>>11)%55)};
}
function kindFor(catId,title){
  const id=(catId||'').toLowerCase(),t=(title||'').toLowerCase();
  if(id.includes('cocktail'))return'cocktail';
  if(id.includes('beer'))return'beer';
  if(id.includes('coffee'))return'coffee';
  if(id.includes('soft'))return'soft';
  if(id.includes('champagne')||id.includes('sparkling'))return'sparkling';
  if(id.includes('glass')||id.includes('wine'))return'wine';
  if(id.includes('vodka'))return'vodka';
  if(id.includes('gin'))return'gin';
  if(id.includes('rum'))return'rum';
  if(id.includes('tequila'))return'tequila';
  if(id.includes('cognac'))return'cognac';
  if(id.includes('whisky')||id.includes('whiskey')||id.includes('bourbon')||id.includes('irish')||id.includes('scotch')||id.includes('single-malt'))return'whisky';
  if(id.includes('liqueur')||id.includes('infusion')||id.includes('aperitif'))return'liqueur';
  if(/чай|кофе|латте|капуч/.test(t))return'coffee';
  return'bottle';
}
function studioVisual(title,catId){
  const W=420,H=280,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d'),hc=hashColor(title),kind=kindFor(catId,title);
  const bg=x.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,`rgb(${hc.a},5,9)`);bg.addColorStop(.55,`rgb(18,${Math.floor(hc.b/4)},12)`);bg.addColorStop(1,'rgb(3,2,3)');
  x.fillStyle=bg;x.fillRect(0,0,W,H);
  const spot=x.createRadialGradient(W*.64,H*.2,5,W*.64,H*.2,180);
  spot.addColorStop(0,'rgba(232,174,112,.22)');spot.addColorStop(1,'rgba(232,174,112,0)');
  x.fillStyle=spot;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(255,255,255,.035)';x.fillRect(0,H*.79,W,H*.21);
  x.save();x.translate(W*.69,H*.49);
  x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=24;x.shadowOffsetY=12;
  if(kind==='cocktail'){
    const hue=(hc.b*3)%360,liquid=x.createLinearGradient(0,-50,0,75);
    liquid.addColorStop(0,`hsla(${hue},82%,65%,.94)`);liquid.addColorStop(1,`hsla(${(hue+20)%360},80%,38%,.96)`);
    x.strokeStyle='rgba(255,255,255,.65)';x.lineWidth=4;x.beginPath();x.moveTo(-55,-70);x.lineTo(-32,40);x.quadraticCurveTo(0,62,32,40);x.lineTo(55,-70);x.stroke();
    x.beginPath();x.moveTo(0,58);x.lineTo(0,105);x.moveTo(-35,108);x.lineTo(35,108);x.stroke();
    x.save();x.beginPath();x.moveTo(-47,-48);x.lineTo(-29,34);x.quadraticCurveTo(0,50,29,34);x.lineTo(47,-48);x.closePath();x.clip();x.fillStyle=liquid;x.fillRect(-55,-50,110,105);x.restore();
    x.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<5;i++){x.beginPath();x.arc(-24+i*12,-10+(i%2)*12,5,0,Math.PI*2);x.fill()}
  }else if(kind==='coffee'){
    x.fillStyle='#ece0d6';x.beginPath();x.roundRect(-60,-34,105,78,18);x.fill();
    x.strokeStyle='#ece0d6';x.lineWidth=12;x.beginPath();x.arc(51,2,28,-Math.PI/2,Math.PI/2);x.stroke();
    x.fillStyle='#44261e';x.beginPath();x.ellipse(-8,-30,47,12,0,0,Math.PI*2);x.fill();
  }else if(kind==='soft'){
    x.fillStyle='rgba(255,255,255,.18)';x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=3;x.beginPath();x.roundRect(-48,-75,96,155,22);x.fill();x.stroke();
    const liq=x.createLinearGradient(0,-55,0,70);liq.addColorStop(0,'rgba(225,105,62,.82)');liq.addColorStop(1,'rgba(120,18,30,.92)');
    x.fillStyle=liq;x.fillRect(-42,-30,84,102);x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=5;x.beginPath();x.moveTo(8,-100);x.lineTo(-5,45);x.stroke();
  }else{
    const wine=kind==='wine'||kind==='sparkling',bottleW=wine?60:82,bodyH=wine?150:135,neckH=wine?70:48;
    const glass=x.createLinearGradient(-bottleW/2,-100,bottleW/2,100);
    const colors={beer:['#633516','#1a0e07'],wine:['#25120d','#090405'],sparkling:['#35522a','#0d160b'],vodka:['#b5d4df','#1d3340'],gin:['#6f9d85','#102920'],rum:['#9a551e','#241006'],tequila:['#e5b64f','#5a2c09'],cognac:['#a84919','#2c0d04'],whisky:['#b9631d','#2a1004'],liqueur:['#7b2e50','#1d0710'],bottle:['#555','#111']};
    const cc=colors[kind]||colors.bottle;glass.addColorStop(0,cc[0]);glass.addColorStop(.55,cc[1]);glass.addColorStop(1,'#030203');
    x.fillStyle=glass;x.beginPath();x.moveTo(-bottleW*.27,-bodyH*.5-neckH);x.lineTo(bottleW*.27,-bodyH*.5-neckH);x.lineTo(bottleW*.3,-bodyH*.5-10);x.quadraticCurveTo(bottleW*.52,-bodyH*.42,bottleW*.52,-bodyH*.24);x.lineTo(bottleW*.52,bodyH*.5);x.quadraticCurveTo(bottleW*.52+2,bodyH*.58,bottleW*.43+4,bodyH*.6);x.lineTo(-bottleW*.43-4,bodyH*.6);x.quadraticCurveTo(-bottleW*.52-2,bodyH*.58,-bottleW*.52,bodyH*.5);x.lineTo(-bottleW*.52,-bodyH*.24);x.quadraticCurveTo(-bottleW*.52,-bodyH*.42,-bottleW*.3,-bodyH*.5-10);x.closePath();x.fill();
    x.fillStyle='rgba(255,255,255,.2)';x.fillRect(-bottleW*.34,-bodyH*.35,7,bodyH*.72);
    x.fillStyle=wine?'#eee2cf':'#e7d5bd';x.beginPath();x.roundRect(-bottleW*.38,-18,bottleW*.76,62,8);x.fill();
    x.fillStyle='#351018';x.textAlign='center';x.font='700 12px Manrope,Arial';x.fillText((title||'').slice(0,16).toUpperCase(),0,6);
    x.font='500 9px Manrope,Arial';x.fillStyle='#7e6656';x.fillText((kind==='wine'?'WINE':kind.toUpperCase()).slice(0,16),0,24);
    if(kind==='beer'){x.fillStyle='#c99645';x.fillRect(-bottleW*.26,-bodyH*.5-neckH-8,bottleW*.52,10)}
  }
  x.restore();
  x.fillStyle='#e6b77e';x.font='700 10px Manrope,Arial';x.fillText((catId||'BAR').replace(/-/g,' ').toUpperCase().slice(0,22),22,33);
  x.fillStyle='#fff7ef';x.font='600 24px Cormorant Garamond,Georgia';wrapLines(x,title,185,3).forEach((line,i)=>x.fillText(line,22,75+i*30));
  x.fillStyle='rgba(255,255,255,.35)';x.font='500 9px Manrope,Arial';x.fillText('УХО & МЕДВЕДЬ · BAR',22,H-24);
  return c.toDataURL('image/webp',.82);
}
let spritesStarted=false;
function restoreBarSprites(){
  if(spritesStarted)return;spritesStarted=true;
  const cards=[...document.querySelectorAll('.menu-item.bar')];
  let index=0;
  const work=deadline=>{
    let done=0;
    while(index<cards.length&&done<10&&(deadline?.timeRemaining?.()>3||!deadline)){
      const card=cards[index++],img=card.querySelector('.item-media img'),title=card.querySelector('h3')?.textContent?.trim()||'',cat=card.closest('.catalog-section')?.dataset.cat||'bar';
      if(img){
        img.dataset.photoSrc=img.getAttribute('src')||'';
        img.src=studioVisual(title,cat);
        img.loading='eager';
        card.querySelector('.item-media')?.classList.add('sprite-media');
      }
      done++;
    }
    if(index<cards.length)(window.requestIdleCallback||((fn)=>setTimeout(()=>fn(null),16)))(work);
  };
  (window.requestIdleCallback||((fn)=>setTimeout(()=>fn(null),16)))(work);
}

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
  if(tab==='bar')restoreBarSprites();
  mainSwitch.forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  history.replaceState(null,'',location.pathname+'?tab='+tab);
  applyFilters(false);
}
mainSwitch.forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
search.addEventListener('input',()=>{state.query=search.value.trim();applyFilters(false)});
setTab(state.tab);
