(() => {
'use strict';
function start(){
 const home=document.getElementById('discover'),menu=document.querySelector('.campaign-menu'),visit=document.getElementById('find-us');
 if(!home||!menu||!visit)return;
 const explanation=document.createElement("div");explanation.innerHTML="<section id=\"what-is-bingsu\" class=\"bingsu-explainer shell\" aria-labelledby=\"bingsu-explainer-title\"><p class=\"eyebrow\">Quality ingredients. Bringing new flavors.</p><h2 id=\"bingsu-explainer-title\">What Is Bingsu?</h2><p class=\"bingsu-explainer-intro\">A Korean shaved ice dessert, made at Sweet Snow with soft, fluffy milk snow.</p><h3>Fresh ingredients. Thoughtfully made.</h3><p>We care about fresh, quality ingredients in every single bowl. Building on traditional Korean bingsu, we experiment with seasonal fruits, house-made syrups and thoughtfully chosen toppings to bring you something familiar\u2014and something new.</p><p><a href=\"/menu\">Explore our bingsu menu \u2192</a></p></section>";home.append(explanation.firstElementChild);
 const faq=document.createElement('div');faq.innerHTML="<section class=\"search-faq shell\" aria-labelledby=\"search-faq-title\"><h2 id=\"search-faq-title\">A little more about Sweet Snow</h2><details><summary>What is bingsu?</summary><p>Bingsu, also spelled bingsoo, is a Korean shaved ice dessert. At Sweet Snow, our milk base is shaved into soft snow and layered with fruit, syrups and toppings.</p></details><details><summary>Where is Sweet Snow?</summary><p>Find us inside the QT Golden Market Place food court at 9772 Garden Grove Blvd, Garden Grove, CA 92844. Look for the blue Sweet Snow sign.</p></details><details><summary>Can I order pickup or delivery?</summary><p>Use Order online to see today’s pickup menu and availability. Delivery is available through our DoorDash link.</p></details><details><summary>What are croffles and mini taiyaki?</summary><p>A croffle is croissant dough cooked in a waffle maker. Our mini taiyaki are small filled, fish-shaped pastries, baked to order and served as seven pieces in a small kraft paper bag.</p></details><p><a href=\"/visit\">Hours &amp; directions</a> · <a href=\"https://cash.app/$sweetsnowus\" target=\"_blank\" rel=\"noopener noreferrer\">Order online</a></p></section>";menu.append(faq.firstElementChild);
 const intro=menu.querySelector('.menu-availability-note');if(intro)intro.remove();
 menu.querySelector('.catalog-hint')?.remove();
 const path=location.pathname.replace(/\/$/,'');
 function heading(old,text){if(!old)return;const h=document.createElement('h1');for(const a of old.attributes)h.setAttribute(a.name,a.value);h.classList.add('search-page-title');h.textContent=text;old.replaceWith(h);}
 if(path==='/menu')heading(menu.querySelector('.section-heading h2'),'MENU');
 if(path==='/visit')heading(visit.querySelector('h2'),'Visit Sweet Snow in Garden Grove');
 if(path==='/menu'||path==='/visit'){const hero=document.querySelector('.lychee-campaign h1');if(hero){const h=document.createElement('h2');h.id=hero.id;h.innerHTML=hero.innerHTML;hero.replaceWith(h);}}
 const menuHashes=['#menu','#menu-premium','#menu-classic','#menu-special','#menu-half-half','#single-cups','#food','#mini-taiyaki','#croffles','#toppings','#drinks','#coming-soon'];
 document.querySelectorAll('a[href^="#"]').forEach(a=>{if(a.classList.contains('skip-link')){a.href=path==='/menu'?'#menu':path==='/visit'?'#find-us':'#discover';a.textContent='Skip to content';return;}const hash=a.getAttribute('href');if(menuHashes.includes(hash)||hash.startsWith('#menu-item-'))a.href='/menu'+(hash==='#menu'?'':hash);else if(hash==='#discover'||hash==='#')a.href='/';else if(hash==='#visit'||hash==='#find-us')a.href='/visit';else if(hash==='#brand-story')a.href='/#brand-story';});
 window.SweetSnowLanguage?.refresh?.();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
