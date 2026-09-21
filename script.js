const toggle=document.querySelector('.menu-toggle');
const drawer=document.querySelector('.drawer');
const close=document.querySelector('.drawer-close');
let returnFocus=null;
function openMenu(){returnFocus=document.activeElement;drawer.hidden=false;toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';close.focus()}
function closeMenu(){drawer.hidden=true;toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';returnFocus?.focus()}
toggle.addEventListener('click',openMenu);
close.addEventListener('click',closeMenu);
drawer.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
drawer.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();return}if(event.key!=='Tab')return;const focusable=[...drawer.querySelectorAll('a,button')];const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
