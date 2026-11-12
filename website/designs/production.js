(() => {
'use strict';
const M=window.MENU, theme=document.body.dataset.theme || 'showcase';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Responsive derivatives preserve approved artwork; browsers choose the suitable width.
const imageAttributes=(src,sizes='(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 400px',preferred=640)=>{
 const variants=window.SWEET_SNOW_IMAGE_VARIANTS?.[src];
 if(!variants?.length)return `src="${e(src)}"`;
 const fallback=variants.find(v=>v.width>=preferred)||variants[variants.length-1];
 return `src="${e(fallback.url)}" srcset="${variants.map(v=>e(v.url)+' '+v.width+'w').join(', ')}" sizes="${e(sizes)}"`;
};
const photoMap={'Shine Muscat Aloe Bingsu':'shine-muscat','Lychee & Shine Muscat':'shine-lychee','Lychee & Strawberry':'lychee-strawberry','Mango & Lychee':'mango-lychee','Strawberry & Shine Muscat':'strawberry-shine','Honeycomb x2':'milk-honeycomb','Matcha Red Beans':'matcha-regular','Mango':'mango','Strawberry':'strawberry-realphoto','Mango & Strawberry':'half-half','Injeolmi Jollypong':'injeolmi-jollypong','Black Sesame':'black-sesame','Matcha Strawberry':'matcha-strawberry','Cookies and Cream':'cookies-cream','Blueberry Yogurt Cheesecake':'blueberry','Mango Special':'mango-special','Strawberry Special':'strawberry-special','Cereal Killer':'cereal-killer','Strawnana Pie':'strawnana','Hojicha Tiramisu':'hojicha-syrup','Matcha Banana Cream':'matcha-banana','Lychee Heaven':'lychee-realphoto','Açaí':'acai'};
const choices={showcase:{num:'01',label:'The Photo Studio',eyebrow:'Korean shaved ice · Garden Grove',headline:'Better quality bingsu.<br><em>Exclusive flavors.</em>',description:'Come try our new Lychee Heaven bingsu, only at Sweet Snow.',hero:'lychee',caption:'Lychee Heaven',price:'18.99'},editorial:{num:'02',label:'The Snow Journal',eyebrow:'Sweet Snow · Korean bingsu',headline:'Something<br><em>sweet</em><br>to share.',description:'A bowl of soft milk snow, layered with flavor and finished with the things you love. Made to order in Garden Grove.',hero:'half-half',caption:'Mango & Strawberry',price:'15.99'},catalog:{num:'03',label:'The Everyday Menu',eyebrow:'Made to order · Garden Grove, CA',headline:'Find your<br>favorite snow.',description:'From fruit classics to loaded specials. Explore the menu, pick your bowl, and visit us in store.',hero:'strawberry-special',caption:'Strawberry Special',price:'18.99'}};
const c=choices[theme];
const naturalPhotos={"lychee-strawberry":"/assets/bowl-lychee-strawberry-20261028.png","mango-lychee":"/assets/bowl-mango-lychee-20261028.png","strawberry-shine":"/assets/bowl-strawberry-shine-20261028.png","injeolmi-jollypong":"/assets/bowl-injeolmi-jollypong-preview-20261026.png","shine-muscat":"/assets/bowl-shine-muscat-preview-20261026.png","shine-lychee":"/assets/bowl-shine-lychee-preview-20261026.png","milk-honeycomb":"/assets/bowl-honeycomb-x2-20261101.png","mango": "/assets/bowl-mango-natural.png", "strawberry-realphoto": "/assets/bowl-strawberry-realphoto-natural.png", "half-half": "/assets/bowl-half-half-natural.png", "injeolmi": "/assets/bowl-injeolmi-natural.png", "black-sesame": "/assets/bowl-black-sesame-natural.png", "mango-special": "/assets/bowl-mango-special-soft-20261020.png", "strawnana": "/assets/bowl-strawnana-natural.png", "cereal-killer": "/assets/bowl-cereal-killer-natural.png", "matcha-strawberry": "/assets/bowl-matcha-strawberry-natural.png", "matcha-banana": "/assets/bowl-matcha-banana-natural.png", "strawberry-special": "/assets/bowl-strawberry-special-natural.png", "hojicha-syrup": "/assets/bowl-hojicha-syrup-natural.png", "cookies-cream": "/assets/bowl-cookies-cream-natural.png", "lychee-realphoto": "/assets/bowl-lychee-realphoto-natural.png", "matcha-regular": "/assets/bowl-matcha-red-beans.png"};
const img=(key,alt,hero=false)=>naturalPhotos[key]?`<img ${imageAttributes(naturalPhotos[key])} alt="${e(alt)}" width="640" height="640" loading="lazy" decoding="async">`:key==='matcha-regular'?`<img src="/assets/matcha-regular.png" alt="${e(alt)}" width="1280" height="1280" loading="lazy" decoding="async">`:`<img src="/designs/real-textures/${key}-${hero?1200:640}.webp" srcset="/designs/real-textures/${key}-640.webp 640w, /designs/real-textures/${key}-1200.webp 1200w" sizes="${hero?'(max-width: 700px) 100vw, 50vw':'(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 400px'}" width="1200" height="1200" alt="${e(alt)}" ${hero?'fetchpriority="high"':'loading="lazy"'} decoding="async">`;
photoMap.Watermelon='watermelon';
naturalPhotos.watermelon='/assets/bowl-watermelon-natural.png';
photoMap["Sweet Potato Cream Bingsu"]="sweet-potato-cream";
naturalPhotos["sweet-potato-cream"]="/assets/bowl-sweet-potato-cream-20261109.webp";
const all=[];
for(const name of M.bingsu.rotationOrder){const f=M.bingsu.flavors.find(x=>x.name===name);if(f)all.push({...f,category:M.bingsu.halfAndHalfOrder.includes(name)?'half-half':f.menuType==='classic'?'classic':'special',photo:photoMap[name]});}
const groupNames={classic:'Classic',special:'Special','half-half':'Fruit Half & Half'};
const menuTypeBadge=f=>f.menuType==='classic'?'<span class="menu-type classic">Classic</span>':f.menuType==='special'?'<span class="menu-type special">Special</span>':'';
// Cached catalog stock is not a live availability signal. The existing inventory reader may still apply fresh status.
const stockBadge=f=>f.comingSoon?'<span class="tape upcoming">Coming soon</span>':f.soldOut?'<a class="availability-link" href="https://cash.app/$sweetsnowus" target="_blank" rel="noopener noreferrer">Check availability</a>':'';
const ingredientDescription=f=>{if(f.name==='Honeycomb x2')return f.ing;let list=f.ing;if(f.specialOf){const base=M.bingsu.flavors.find(item=>item.name===f.specialOf);list=(base?base.ing+' · ':'')+list.replace(/^.*?bingsu\s*\+\s*/i,'');}return (f.category==='hot'?'':'Milk base · ')+list;};
const card=(f)=>`<article class="product-card" data-name="${e(f.name)}" data-inventory-name="${e(f.inventoryName||f.name)}" data-ingredients="${e(ingredientDescription(f))}" data-kind="${f.category==='hot'?'hot':'bingsu'}" data-coming-soon="${Boolean(f.comingSoon)}" data-category="${f.category}" data-search="${e((f.name+' '+f.ing).toLowerCase())}"><button class="product-photo ingredient-trigger" type="button" data-ingredient="${e(f.name)}" aria-expanded="false" aria-label="Show ingredients for ${e(f.name)}">${img(f.photo,f.imagePreview?f.name+' — serving preview':f.name)}<span class="touch-ingredient-hint" aria-hidden="true">Tap for ingredients +</span></button><div class="product-info"><div class="product-heading"><h4>${e(f.name)}</h4></div><p class="menu-ingredient-description">${e(ingredientDescription(f))}</p><div class="product-meta">${menuTypeBadge(f)}${f.isNew?'<span class="tape">New</span>':''}${stockBadge(f)}${f.brandLabel?`<span class="brand-tag">${e(f.brandLabel)}</span>`:f.subtitle?`<span class="brand-tag">${e(f.subtitle)}</span>`:f.category==='hot'&&f.detail?`<span class="brand-tag">2 or 5 pieces</span>`:''}</div></div></article>`;
const cupMenuSection=`<section class="cup-bingsu-section menu-group" id="single-cups" aria-labelledby="cup-bingsu-title"><div class="shell"><div class="preview-heading"><h3 id="cup-bingsu-title" class="menu-category-title">${e(M.cupBingsu.title)}</h3>${M.cupBingsu.soon?'<span class="preview-status">Coming soon</span>':''}</div><p class="cup-bingsu-intro">${e(M.cupBingsu.blurb)}</p>${M.cupBingsu.addon?`<p class="cup-bingsu-addon">${e(M.cupBingsu.addon)}</p>`:''}<div class="cup-bingsu-grid">${M.cupBingsu.flavors.map((f,i)=>f.previewOnly?`<article class="cup-bingsu-card cup-preview product-card" data-name="${e(f.name)}" data-kind="cup" data-coming-soon="true"><span class="preview-status">Coming soon</span><h3>${e(f.name)}</h3><p class="cup-preview-description">${e(f.ing)}</p></article>`:`<article class="cup-bingsu-card product-card" data-name="${e(f.name)}" data-ingredients="${e(f.ing)}" data-kind="cup"><button type="button" class="ingredient-trigger cup-bingsu-photo${f.image?' cup-bingsu-photo-single':''}" aria-expanded="false" aria-label="Show ingredients for ${e(f.name)}" style="--cup-art-width:${f.imageLayout.width}%;--cup-art-height:${f.imageLayout.height}%;--cup-art-left:${f.imageLayout.left}%;--cup-art-top:${f.imageLayout.top}%"><img ${imageAttributes(f.image||'/assets/cup-fruit-natural.png')} alt="${e(f.name)} bingsu" width="${f.image?1024:1536}" height="1024" loading="lazy" decoding="async"><span class="touch-ingredient-hint" aria-hidden="true">Tap for ingredients +</span></button><h3>${e(f.name)}</h3><p class="menu-ingredient-description">${e(f.ing)}</p><div class="product-meta">${stockBadge(f)}</div></article>`).join('')}</div></div></section>`;
const miniTaiyakiSection=M.miniTaiyaki?.enabled?`<section class="mini-taiyaki-section menu-group" id="food" aria-labelledby="food-title"><div class="shell"><div class="preview-heading"><h3 id="food-title" class="menu-category-title">${e(M.miniTaiyaki.sectionTitle||'Food')}</h3></div><h4 class="mini-taiyaki-title">${e(M.miniTaiyaki.title)}</h4><p class="mini-taiyaki-intro">${e(M.miniTaiyaki.blurb)}</p><div class="mini-taiyaki-grid">${M.miniTaiyaki.flavors.map(f=>`<article class="mini-taiyaki-card" data-name="${e(f.name)}" data-kind="hot"><img ${imageAttributes(f.image)} alt="${e(f.name)} mini taiyaki" width="1254" height="1254" loading="lazy" decoding="async"><div><h3>${e(f.name)}</h3><p class="mini-taiyaki-filling">${e(f.filling)}</p><p class="mini-taiyaki-order">${e(M.miniTaiyaki.orderNote)}</p><div class="product-meta">${stockBadge(f)}</div>${M.miniTaiyaki.showPrices?`<p class="mini-taiyaki-price">$${e(f.price)}</p>`:''}</div></article>`).join('')}</div></div></section>`:'';
const croffleArtwork=[{"name": "Plain Croffle", "price": 4.99, "description": "Dusted with powdered sugar", "image": "plain-powdered-sugar-20261025"},{"name": "Injeolmi Croffle", "price": 6.99, "description": "Injeolmi powder, condensed milk, crushed almonds, mochi & honey drizzle", "image": "injeolmi"}, {"name": "Biscoff Caramel Croffle", "price": 7.99, "description": "House-made cream, Biscoff crumbs, caramel drizzle & a whole Lotus Biscoff cookie", "image": "biscoff"}, {"name": "Cookies and Cream Croffle", "price": 7.99, "description": "House-made cream, Oreo crumbs, premium cacao powder & Oreo halves", "image": "oreo-tiramisu"}, {"name": "Dubai Strawberry Croffle", "price": 11.99, "description": "Nutella spread, Dubai chocolate filling & strawberries, with a vanilla ice cream scoop in the middle topped with chocolate sauce & crushed pistachios", "image": "dubai-strawberry-icecream-20261023"}];
const croffles=M.squareMenu.croffles.map(item=>{const f=croffleArtwork.find(f=>f.name===item.name);return f?{...f,description:item.description,price:item.price.amount/100,soldOut:item.availability==='LOCAL_CATALOG_AVAILABILITY_SOLD_OUT'}:null;}).filter(Boolean);
const croffleCard=f=>`<article class="croffle-menu-item product-card" data-name="${e(f.name)}" data-kind="croffle"><img class="croffle-product-image" ${imageAttributes(`/assets/croffles/${f.image}.png`)} alt="${e(f.name)}" loading="lazy"><div class="croffle-name-price"><h4>${e(f.name)}</h4></div><p>${e(f.description)}</p><div class="product-meta">${stockBadge(f)}</div></article>`;
const croffleSection=`<section class="croffle-section menu-group" id="croffles" aria-labelledby="croffles-title"><div class="shell"><div class="preview-heading"><h3 id="croffles-title" class="menu-category-title">Premium Croffles</h3></div><p class="croffle-intro">Croissant meets waffle.</p><div class="croffle-menu-grid">${croffles.map(croffleCard).join('')}</div></div></section>`;
const drinksMenuSection=M.drinks?.items?.length?`<section class="drinks-section menu-group" id="drinks" aria-labelledby="drinks-title"><style>#drinks .drink-product-image{display:block;width:100%;height:260px;object-fit:contain;margin-bottom:1rem}#drinks .drinks-menu-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}#drinks .drinks-menu-item{padding:1.25rem;border:1px solid rgba(43,56,58,.18);border-radius:1rem;background:#fff}#drinks .drinks-name-price{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}#drinks .drinks-name-price h4{margin:0}#drinks .drinks-price{font-weight:700;white-space:nowrap}#drinks .drinks-menu-item p{margin:.6rem 0 0;color:#526268}@media(max-width:900px){#drinks .drinks-menu-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){#drinks .drinks-menu-grid{grid-template-columns:1fr}}</style><div class="shell"><div class="preview-heading"><h3 id="drinks-title" class="menu-category-title">${e(M.drinks.title)}</h3></div><div class="drinks-menu-grid">${M.drinks.items.map(f=>`<article class="drinks-menu-item" data-name="${e(f.name)}" data-kind="drink">${f.image?`<img class="drink-product-image" ${imageAttributes(f.image)} alt="${e(f.name)}" loading="lazy" width="1024" height="1536">`:``}<div class="drinks-name-price"><h4>${e(f.name)}</h4></div>${f.ing?`<p>${e(f.ing)}</p>`:''}</article>`).join('')}</div></div></section>`:'';
const comingSoonSection='';
const toppingItems=M.toppings.tiers.flatMap(t=>t.items);
const toppingsSection=`<section class="customize-section shell" id="toppings" aria-labelledby="toppings-title"><div class="customize-heading"><p class="eyebrow">Make it your own</p><h2 id="toppings-title">20+ toppings to choose from.</h2><p class="customize-intro">Highly customizable. Mix and match your favorites to make your perfect bingsu.</p></div><div class="featured-addons"><aside class="fruit-addon-feature" aria-labelledby="fruit-addon-title"><p class="eyebrow">A little extra fruit</p><h3 id="fruit-addon-title">Add fruit.</h3><p>${M.extraFruit.items.map(t=>e(t.en)).join(' · ')}</p><p class="fruit-addon-note">${e(M.extraFruit.note)}</p></aside></div><h3 class="toppings-list-title">Choose your toppings</h3><ul class="customize-toppings">${toppingItems.map(t=>`<li><span>${e(t.en)}</span>${t.opts?.length?`<small>${t.opts.map(e).join(' · ')}</small>`:''}</li>`).join('')}<li><span>Sprinkles</span></li></ul><p class="topping-serving-note">${e(M.toppings.servingNote)}</p></section>`;
const layerArt=`<svg class="layer-drawing" viewBox="0 0 560 560" role="img" aria-labelledby="layer-title layer-desc"><title id="layer-title">A little look inside a mango bingsu</title><desc id="layer-desc">An illustrative cross-section of a bowl with milk snow, syrup layers, mango and mochi on top. Each flavor has its own toppings.</desc><defs><clipPath id="bowl-clip"><path d="M126 269 Q137 450 213 471 Q282 496 350 471 Q425 450 437 269Z"/></clipPath><pattern id="snow-dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="5" cy="6" r="1.5" fill="#c2dce4"/><circle cx="13" cy="14" r="1" fill="#dcebf0"/></pattern></defs><ellipse cx="282" cy="494" rx="150" ry="10" fill="#e1e7e8"/><g stroke="#2b383a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M126 269 Q157 156 279 151 Q392 157 437 269" fill="#fbfdfd"/><path d="M126 269 Q137 450 213 471 Q282 496 350 471 Q425 450 437 269Z" fill="#f7fbfc"/><g clip-path="url(#bowl-clip)" stroke="none"><rect x="120" y="270" width="322" height="213" fill="url(#snow-dots)"/><path d="M124 321 Q180 309 248 331 T440 320 L439 344 Q369 364 282 350 T125 344Z" fill="#f8c856"/><path d="M142 412 Q211 400 280 418 T422 414 L417 434 Q350 453 280 438 T147 433Z" fill="#f8c856"/></g><path d="M126 269 Q137 450 213 471 Q282 496 350 471 Q425 450 437 269Z" fill="none"/><path d="M119 268 Q281 287 444 268" fill="none"/><path d="M124 277 Q281 298 441 277" fill="none"/><g fill="#ffc643" stroke="#c58d25" stroke-width="2.5"><rect x="180" y="205" width="42" height="36" rx="9" transform="rotate(-13 200 220)"/><rect x="249" y="169" width="43" height="37" rx="8" transform="rotate(9 270 188)"/><rect x="312" y="202" width="42" height="37" rx="8" transform="rotate(15 330 218)"/><rect x="240" y="230" width="38" height="32" rx="8"/><rect x="367" y="240" width="34" height="30" rx="8"/><rect x="158" y="245" width="31" height="26" rx="7"/></g><g fill="#fffaf0" stroke="#b6aca0" stroke-width="2"><rect x="220" y="190" width="23" height="22" rx="7" transform="rotate(-12 230 200)"/><rect x="301" y="244" width="24" height="22" rx="7"/><rect x="308" y="153" width="23" height="22" rx="7" transform="rotate(15 319 164)"/></g><g fill="none" stroke="#eab73f" stroke-width="8"><path d="M193 192 Q235 219 279 213 T365 242"/><path d="M207 232 Q240 221 293 247"/></g><path d="M153 302 Q160 365 172 388" fill="none" stroke="#fff" stroke-width="7"/></g><g fill="#43545a" font-family="Arial, Helvetica, sans-serif" font-size="15"><text x="28" y="101">Fruit &amp; toppings</text><text x="348" y="110">House-made syrup</text><text x="17" y="372">Milk snow</text><text x="360" y="391">Flavor in layers</text></g><g fill="none" stroke="#7c9097" stroke-width="1.3"><path d="M117 110 L183 179"/><path d="M411 120 L336 231"/><path d="M77 380 L169 369"/><path d="M423 399 L372 425"/></g><text x="280" y="537" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" fill="#6f7d81">A little look inside. Each flavor has its own finish.</text></svg>`;
const mapLink='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('Sweet Snow '+M.brand.street+' '+M.brand.city);
document.getElementById('app').innerHTML=`<a class="skip-link" href="#menu">Skip to menu</a><div class="location-bar shell"><a href="#visit">${e(M.brand.street)} · Garden Grove</a><span id="status" aria-live="polite"></span></div><header class="site-header shell"><a class="brand" href="#" aria-label="Sweet Snow home"><img class="logo" src="/assets/sweet-snow-horizontal-right-blue-20261104.svg" alt="Sweet Snow" width="1881" height="837"><span class="brand-word" aria-hidden="true">Sweet Snow</span></a><nav class="main-nav" aria-label="Main navigation"><a href="#menu">Menu</a><a href="#croffles">Croffles</a><a href="#visit">Visit us ↗</a></nav></header><main><section class="lychee-campaign" ${/^\/(menu|visit)(?:\.html)?$/.test(location.pathname)?'hidden':''} aria-labelledby="lychee-campaign-title"><img class="campaign-scene" ${imageAttributes('/assets/shine-muscat-campaign-20261028.png','100vw',1280)} width="2560" height="1440" alt="Shine Muscat Aloe bingsu with Korean green grapes, aloe vera and yogurt ice cream, framed by grapevines and aloe plants" ${/^\/(menu|visit)(?:\.html)?$/.test(location.pathname)?'loading="lazy" fetchpriority="low"':'fetchpriority="high"'} decoding="async"><div class="lychee-campaign-inner shell"><div class="lychee-campaign-copy"><p class="campaign-new">New at Sweet Snow</p><p class="campaign-intro">Meet</p><h1 id="lychee-campaign-title">Shine Muscat<br><em>Aloe.</em></h1><p class="lychee-campaign-description">Juicy Korean Shine Muscats, aloe vera, and green grape yogurt syrup over our premium milk snow. Finished with yogurt ice cream.</p>${stockBadge(M.bingsu.flavors.find(f=>f.name==='Shine Muscat Aloe Bingsu')||{})}<div class="hero-actions"><a class="button campaign-order square-pickup" href="https://cash.app/$sweetsnowus" target="_blank" rel="noopener noreferrer"><img class="cash-app-logo" src="/assets/cash-app-logo.svg" width="22" height="22" alt="" aria-hidden="true"><span>Order online ↗</span></a><a class="text-link campaign-delivery" href="https://www.doordash.com/store/sweet-snow-garden-grove-52186263/122031760/" target="_blank" rel="noopener noreferrer"><img class="doordash-logo" src="/assets/doordash-logo.svg" width="32" height="18" alt="" aria-hidden="true"><span>Delivery with DoorDash ↗</span></a><a class="text-link campaign-menu-link" href="#menu">Explore the menu ↓</a></div></div></div></section><section class="menu-section campaign-menu" id="menu"><div class="section-heading"><h2 style="font-weight:900">Menu</h2><p class="menu-availability-note">Explore our classics, discover something new, or enjoy two fruit flavors in one bowl.</p></div><div class="menu-groups">${Object.entries(groupNames).map(([key,name])=>`<section class="menu-group menu-color-${key}" id="menu-${key}" aria-label="${name}"><div class="shell"><h3 class="menu-category-title">${name}</h3><div class="product-grid">${all.filter(f=>f.category===key).map(card).join('')}</div></div></section>`).join('')}${cupMenuSection}${miniTaiyakiSection}${croffleSection}${drinksMenuSection}${comingSoonSection}</div></section>${toppingsSection}</main><footer class="site-footer contact-footer shell" id="visit"><div class="footer-info"><section aria-labelledby="footer-location"><h2 id="footer-location">Visit us</h2><address>${e(M.brand.venue)}<br>${e(M.brand.street)}<br>${e(M.brand.city)}</address><a class="footer-directions" href="${mapLink}" target="_blank" rel="noopener">Get directions ↗</a></section><section aria-labelledby="footer-hours"><h2 id="footer-hours">Hours</h2><dl class="footer-hours"><div><dt>Monday–Thursday</dt><dd>5 pm – 10 pm</dd></div><div><dt>Friday–Sunday</dt><dd>1 pm – 10 pm</dd></div></dl></section><section aria-labelledby="footer-connect"><h2 id="footer-connect">Follow along</h2><a class="footer-instagram" href="https://www.instagram.com/${e(M.brand.instagram)}/" target="_blank" rel="noopener">@${e(M.brand.instagram)} ↗</a></section></div><nav class="footer-links" aria-label="Footer navigation"><a class="square-pickup" href="https://cash.app/$sweetsnowus" target="_blank" rel="noopener noreferrer"><img class="cash-app-logo" src="/assets/cash-app-logo.svg" width="22" height="22" alt="" aria-hidden="true">Order online ↗</a><a href="https://www.doordash.com/store/sweet-snow-garden-grove-52186263/122031760/" target="_blank" rel="noopener"><img class="doordash-logo" src="/assets/doordash-logo.svg" width="32" height="18" alt="" aria-hidden="true">Delivery with DoorDash ↗</a><a href="/privacy">Privacy</a></nav></footer><dialog class="product-dialog" aria-labelledby="dialog-title"><button class="close-dialog" aria-label="Close ingredients">×</button><div class="dialog-content"></div></dialog>`;
const dialog=document.querySelector('dialog');let previousFocus;
const close=()=>dialog.close();dialog.querySelector('.close-dialog').addEventListener('click',close);dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)close()}});dialog.addEventListener('close',()=>{document.body.classList.remove('body-modal-open');previousFocus?.focus()});
document.querySelectorAll('[data-item]').forEach(b=>b.addEventListener('click',()=>{const f=all.find(i=>i.name===b.dataset.item);previousFocus=b;dialog.querySelector('.dialog-content').innerHTML=`${img(f.photo,f.name,true)}<div class="dialog-copy">${f.brandLabel?`<p class="eyebrow">${e(f.brandLabel)}</p>`:''}<h2 id="dialog-title">${e(f.name)}</h2><p>${e(f.ing)}</p>${f.specialNote?`<p>${e(f.specialNote)}</p>`:''}<small>${f.category==='hot'?e(f.detail||''):e((M.bingsu.priceNote||'').replace(/\s*[·•]?\s*serves\s*2[–~—-]3\s*people\.?/gi,''))}${f.recipeNote?'<br>'+e(f.recipeNote):''}</small><a class="button dialog-visit" href="#visit">Visit Sweet Snow ↗</a></div>`;dialog.querySelector('.dialog-visit').addEventListener('click',close);dialog.showModal();document.body.classList.add('body-modal-open')}));

const $=id=>document.getElementById(id), esc=e;
const BING=M.bingsu||{}, FLAV=all.filter(f=>!f.hidden&&!f.comingSoon), ICE=BING.ice||[];
  const DAY_IX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  const toMin = (hhmm) => {
    const [h, m] = String(hhmm).split(":").map(Number);
    return h * 60 + (m || 0);
  };

  // "21:30" -> "9:30pm" · "12:00" -> "12pm"
  function fmt12(hhmm) {
    const [h, m] = String(hhmm).split(":").map(Number);
    const suffix = h >= 12 ? "pm" : "am";
    const hr = h % 12 === 0 ? 12 : h % 12;
    return hr + (m ? ":" + String(m).padStart(2, "0") : "") + suffix;
  }
  const fmtShort = (hhmm) => {
    const [h, m] = String(hhmm).split(":").map(Number);
    const hr = h % 12 === 0 ? 12 : h % 12;
    return hr + ":" + String(m || 0).padStart(2, "0");
  };

  // Read the clock in the shop's timezone, not the visitor's, so the
  // status is right for someone checking from out of state.
  function shopClock() {
    try {
      const p = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).formatToParts(new Date());
      const get = (t) => (p.find((x) => x.type === t) || {}).value;
      const day = DAY_IX[get("weekday")];
      const hour = parseInt(get("hour"), 10) % 24;
      return { day: day, min: hour * 60 + parseInt(get("minute"), 10) };
    } catch (e) {
      const d = new Date();
      return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function statusText() {
    const S = M.schedule;
    if (!S) return null;
    const now = shopClock();
    const today = S[now.day];
    const open = !!(today && now.min >= toMin(today.open) && now.min < toMin(today.close));
    let next = '';
    for (let i = 0; i <= 7; i++) {
      const day = (now.day + i) % 7;
      const hours = S[day];
      if (!hours || (i === 0 && now.min >= toMin(hours.open))) continue;
      const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAY_NAME[day];
      next = 'Next open ' + when + ' ' + fmt12(hours.open) + '–' + fmt12(hours.close);
      break;
    }
    return { open, text: (open ? 'Open now · until ' + fmt12(today.close) : 'Closed now') + (next ? ' · ' + next : '') };
  }

  function renderHours() {
    const list = $("hours");
    const rows = M.hours || [];
    const now = shopClock();

    if (list) {
      list.innerHTML = rows
        .map((h) => {
          // Match today to a display row: no hours today means the
          // "closed" line, otherwise the row quoting today's close.
          const day = now.day;
          const isToday = (day >= 1 && day <= 4 && /mon/i.test(h.days) && /thu/i.test(h.days))
            || ((day === 0 || day === 5 || day === 6) && /fri/i.test(h.days) && /sun/i.test(h.days));
          return `<li${isToday ? ' class="is-today"' : ""}>
            <span class="h-day">${esc(h.days)}</span>
            ${h.time ? '<span class="h-dots" aria-hidden="true"></span>' : ""}
            ${h.time ? `<span class="h-time">${esc(h.time)}</span>` : ""}
          </li>`;
        })
        .join("");
    }

    const st = statusText();
    [$("status"), $("status2")].forEach((el) => {
      if (!el || !st) return;
      el.innerHTML = '<span class="status-dot" aria-hidden="true"></span><span>' + esc(st.text) + '</span>';
      el.classList.remove("is-open", "is-closed");
      el.classList.add(st.open ? "is-open" : "is-closed");
    });
  }


  function normName(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/bingsu|bingsoo|premium|shaved ice|snow/g, " ")
      .replace(/[^a-z0-9가-힣]+/g, " ")
      .trim();
  }

  function stockScore(menuName, menuKind, sq) {
    const a = normName(menuName);
    const b = normName(sq.name).replace(/\bcup\b/g, " ").replace(/\s+/g, " ").trim();
    if (!a || !b) return 0;
    let s = 0;
    if (a === b) s = 90;
    else if (b.indexOf(a) !== -1 || a.indexOf(b) !== -1) s = 70;
    else return 0;
    if (sq.kind === menuKind) s += 20;
    else if (sq.kind && sq.kind !== menuKind) s -= 25;
    return s;
  }

  function markStock(el, status) {
    if (el.classList.contains("is-soon")) return;
    el.classList.remove("is-soldout", "is-low");
    el.querySelectorAll(".tape.soldout, .tape.few").forEach((n) => n.remove());
    const body = el.querySelector(".product-meta");
    if (!body) return;
    if (status === "soldout") {
      el.classList.add("is-soldout");
      body.insertAdjacentHTML("beforeend", '<span class="tape soldout">SOLD OUT</span>');
    } else if (status === "low") {
      el.classList.add("is-low");
      body.insertAdjacentHTML("beforeend", '<span class="tape few">FEW LEFT</span>');
    }
  }

  async function applyInventory() {
    try {
      const res = await fetch("/api/inventory", { headers: { Accept: "application/json" } });
      if (!res.ok) return;
      const data = await res.json();
      const stock = data.items || [];
      if (!stock.length) return;
      document.querySelectorAll(".product-card[data-name]").forEach((el) => {
        const name = el.getAttribute("data-name") || "";
        const inventoryName = el.getAttribute("data-inventory-name") || name;
        const kind = el.getAttribute("data-kind") || "bingsu";
        let best = null;
        let bestScore = 50;
        stock.forEach((sq) => {
          const n = Math.max(stockScore(name, kind, sq), stockScore(inventoryName, kind, sq));
          if (n > bestScore) {
            bestScore = n;
            best = sq;
          }
        });
        if (best) markStock(el, best.status);
      });
    } catch (e) {
      /* Local preview and Square outages keep the menu as-is. */
    }
  }


  function injectMenuSchema() {
    if (document.getElementById("menu-schema") || location.pathname.replace(/\/$/, "") === "/visit") return;
    const base = BING.price;
    const section = (name, items) => ({
      "@type": "MenuSection",
      name: name,
      hasMenuItem: items
    });
    const item = (n, desc, price, soon = false) => ({
      "@type": "MenuItem",
      name: n,
      description: desc || undefined,
      offers: undefined
    });

    const sections = [
      section("Croffles", croffles.map(f => item(f.name, f.description, f.price))),
      section(
        BING.title || "Shaved Milk",
        FLAV.filter(f=>!f.soon&&f.badge!=='COMING SOON').map(f => item(/bingsu$/i.test(f.name) ? f.name : f.name + " Bingsu", f.ing, f.price || base, f.soon || f.badge === "COMING SOON"))
      ),
      ...(ICE.filter((f) => !f.hint).length
        ? [section(
            BING.iceTitle || "Shaved Ice",
            ICE.filter((f) => !f.hint).map((f) => item(f.name, f.ing, f.price || base))
          )]
        : []),
      ...(M.cupBingsu?.enabled === false ? [] : [section(
        (M.cupBingsu || {}).title || "Cup Bingsu",
        ((M.cupBingsu || {}).flavors || []).filter(f=>!f.comingSoon&&!f.previewOnly&&!(M.cupBingsu || {}).soon).map((f) =>
          item(/cup$/i.test(f.name) ? f.name : f.name + " Cup", f.ing, f.price || (M.cupBingsu || {}).price, (M.cupBingsu || {}).soon)
        )
      )]),
      ...(M.miniTaiyaki?.enabled ? [section(
        M.miniTaiyaki.title,
        M.miniTaiyaki.flavors.map(f => item(f.name, `${f.filling} · ${M.miniTaiyaki.orderNote}`, M.miniTaiyaki.showPrices ? f.price : null))
      )] : []),
      ...(M.drinks?.items?.length ? [section(
        M.drinks.title || "Drinks",
        M.drinks.items.map(f => item(f.name, f.ing, f.price))
      )] : []),

    ];

    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Menu",
      "@id": "https://www.sweetsnow.org/menu#menu",
      url: "https://www.sweetsnow.org/menu",
      name: "Sweet Snow Menu",
      inLanguage: "en",
      hasMenuSection: sections
    });
    document.head.appendChild(tag);
  }


renderHours();setInterval(renderHours, 60000);applyInventory();injectMenuSchema();
})();
