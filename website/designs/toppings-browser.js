(() => {
 'use strict';
 const setup = () => {
  const section=document.querySelector('#toppings'),list=section?.querySelector('.customize-toppings');
  if(!list||section.querySelector('.topping-browser-tabs'))return;
  const ready=()=>{
   const cells=[...list.querySelectorAll('.topping-gallery-cell')];
   if(!cells.length)return false;
   const groups=[['crunch','Crunch'],['sweet','Soft & sweet'],['finish','Sauces & dustings'],['fruit','Extra Fruit']];
   const sweet=new Set(['coconut-jelly','mochi','red-beans','ice-cream-vanilla','ice-cream-yogurt','cheesecake-bites','brownie-bites','cookie-dough-bites','sprinkles']);
   const finish=new Set(['condensed-milk','honey-drizzle','tajin','injeolmi-powder']);
   cells.forEach(cell=>{const k=cell.dataset.key;cell.dataset.toppingGroup=finish.has(k)?'finish':(sweet.has(k)||k.startsWith('popping-boba-'))?'sweet':'crunch'});
   const nav=document.createElement('div');nav.className='topping-browser-tabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Topping categories');
   list.id='toppings-selection';list.setAttribute('role','tabpanel');
   const addons=section.querySelector('.featured-addons');addons.id='fruit-cream-selection';addons.setAttribute('role','tabpanel');
   nav.innerHTML=groups.map(([id,label])=>`<button class="topping-browser-tab" id="topping-tab-${id}" role="tab" type="button" aria-controls="${id==='fruit'?'fruit-cream-selection':'toppings-selection'}" aria-selected="false" tabindex="-1" data-group="${id}">${label}</button>`).join('');
   section.querySelector('.customize-heading').after(nav);
   section.querySelector('.toppings-list-title').hidden=true;
   const buttons=[...nav.children];let selected='crunch';
   function select(group,focus=false){
    selected=group;buttons.forEach(b=>{const active=b.dataset.group===group;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;if(active&&focus)b.focus()});
    list.hidden=group==='fruit';addons.hidden=group!=='fruit';
    list.setAttribute('aria-labelledby','topping-tab-'+group);addons.setAttribute('aria-labelledby','topping-tab-fruit');
    cells.forEach(c=>c.hidden=c.dataset.toppingGroup!==group);
    const note=section.querySelector('.topping-serving-note');if(note)note.hidden=group==='fruit';
    const panel=group==='fruit'?addons:list;
    panel.getAnimations().forEach(a=>a.cancel());
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)panel.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});
   }
   nav.addEventListener('click',e=>{const b=e.target.closest('button');if(b)select(b.dataset.group)});
   nav.addEventListener('keydown',e=>{let i=groups.findIndex(g=>g[0]===selected);if(e.key==='ArrowRight')i=(i+1)%groups.length;else if(e.key==='ArrowLeft')i=(i+groups.length-1)%groups.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=groups.length-1;else return;e.preventDefault();select(groups[i][0],true)});
   select('crunch');window.SweetSnowLanguage?.refresh();return true;
  };
  if(!ready()){const observer=new MutationObserver(()=>{if(ready())observer.disconnect()});observer.observe(list,{childList:true})}
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
