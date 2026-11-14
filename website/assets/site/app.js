/* SWEET SNOW — page behaviour: open-now status, snow, the bowl that builds
itself, menu sheet, topping filter, Korean, live stock. No libraries. */
(() => {
'use strict';
const doc = document;
const root = doc.documentElement;
const CONFIG = window.SWEET_SNOW || {};
const $ = (selector, scope = doc) => scope.querySelector(selector);
const $$ = (selector, scope = doc) => [...scope.querySelectorAll(selector)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
/* ---------- Korean ---------- */
const LANG_KEY = 'sweet-snow-language';
let lang = 'en';
let KO = null;
const tr = text => (lang === 'ko' && KO && KO.text[text]) || text;
const originals = new WeakMap();
const attrOriginals = new WeakMap();
const blockOriginals = new WeakMap();
const ATTRS = ['alt', 'aria-label', 'title'];
function translateTree(scope) {
const walker = doc.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
const nodes = [];
while (walker.nextNode()) nodes.push(walker.currentNode);
for (const node of nodes) {
const parent = node.parentElement;
if (!parent || parent.closest('script,style,.lang,[data-i18n-block],[data-words]')) continue;
if (!originals.has(node)) originals.set(node, node.nodeValue);
const source = originals.get(node);
const core = source.trim();
if (!core) continue;
const next = lang === 'ko' && KO.text[core] ? source.replace(core, KO.text[core]) : source;
if (node.nodeValue !== next) node.nodeValue = next;
}
for (const el of [scope, ...$$('[alt],[aria-label],[title]', scope)]) {
if (!el.getAttribute || el.closest('.lang')) continue;
const saved = attrOriginals.get(el) || {};
for (const attr of ATTRS) {
if (!el.hasAttribute(attr)) continue;
if (!(attr in saved)) saved[attr] = el.getAttribute(attr);
const next = lang === 'ko' && KO.text[saved[attr]] ? KO.text[saved[attr]] : saved[attr];
if (el.getAttribute(attr) !== next) el.setAttribute(attr, next);
}
attrOriginals.set(el, saved);
}
}
function applyLanguage() {
root.lang = lang;
$$('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
if (!KO) return;
$$('[data-i18n-block]').forEach(block => {
if (!blockOriginals.has(block)) blockOriginals.set(block, block.innerHTML);
const html = lang === 'ko' ? KO.blocks[block.dataset.i18nBlock] : blockOriginals.get(block);
if (html && block.dataset.shown !== lang) { block.innerHTML = html; block.dataset.shown = lang; }
});
translateTree(doc.body);
$$('[data-words]').forEach(title => {
const phrase = (lang === 'ko' && KO.text[title.dataset.words]) || title.dataset.words;
if (title.dataset.shownWords === phrase) return;
title.replaceChildren(...phrase.split(' ').flatMap((word, i) => { const span = doc.createElement('span'); span.textContent = word; return i ? [' ', span] : [span]; }));
title.dataset.shownWords = phrase;
});
renderStatus();
}
async function setLanguage(next) {
lang = next === 'ko' ? 'ko' : 'en';
try { localStorage.setItem(LANG_KEY, lang); } catch (_) { /* private mode */ }
if (lang === 'ko' && !KO) {
try {
KO = await (await fetch(CONFIG.ko)).json();
const fonts = doc.createElement('link');
fonts.rel = 'stylesheet';
fonts.href = 'https://fonts.googleapis.com/css2?family=Hahmlet:wght@300;400&family=IBM+Plex+Sans+KR:wght@400;500;600&family=Gaegu:wght@700&display=swap';
doc.head.append(fonts);
} catch (_) { lang = 'en'; }
}
applyLanguage();
}
doc.addEventListener('click', event => {
const button = event.target.closest('[data-lang]');
if (button) setLanguage(button.dataset.lang);
});
/* ---------- open now ---------- */
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toMin = hhmm => { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + (m || 0); };
const fmt12 = hhmm => { const [h, m] = String(hhmm).split(':').map(Number); return (h % 12 === 0 ? 12 : h % 12) + (m ? ':' + String(m).padStart(2, '0') : '') + (h >= 12 ? 'pm' : 'am'); };
function shopClock() {
try {
const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
const get = type => (parts.find(p => p.type === type) || {}).value;
return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), min: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
} catch (_) { const d = new Date(); return { day: d.getDay(), min: d.getHours() * 60 + d.getMinutes() }; }
}
function renderStatus() {
const S = CONFIG.schedule;
if (!S) return;
const now = shopClock();
const today = S[now.day];
const open = !!(today && now.min >= toMin(today.open) && now.min < toMin(today.close));
let next = '', nextShort = '';
for (let i = 0; i <= 7; i++) {
const day = (now.day + i) % 7, hours = S[day];
if (!hours || (i === 0 && now.min >= toMin(hours.open))) continue;
const when = tr(i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAY[day]);
next = tr('Next open ') + when + ' ' + fmt12(hours.open) + '–' + fmt12(hours.close);
nextShort = tr('Next open ') + when + ' ' + fmt12(hours.open);
break;
}
const full = open ? tr('Open now · until ') + fmt12(today.close) : tr('Closed now') + (next ? ' · ' + next : '');
const compact = open ? full : nextShort || tr('Closed now');
$$('[data-status]').forEach(el => { el.textContent = full; el.classList.toggle('is-open', open); });
$$('[data-status-compact]').forEach(el => { el.textContent = compact; el.classList.toggle('is-open', open); });
$$('[data-hours] [data-days]').forEach(row => row.classList.toggle('is-today', row.dataset.days.split(',').includes(String(now.day))));
}
renderStatus();
setInterval(renderStatus, 60000);
/* ---------- header + drawer ---------- */
const header = $('[data-header]');
const toggle = $('.menu-toggle');
const drawer = $('#drawer');
const orderbar = $('[data-orderbar]');
let ticking = false;
/* The home page opens with a sky-blue hero and a see-through header on top of it.
After a little scrolling the header becomes a solid bar. The colour around the
browser's address bar follows along on phones. */
const sky = doc.body.classList.contains('page-home');
const themeMeta = $('meta[name="theme-color"]');
const themeBase = themeMeta ? themeMeta.content : '';
const themeSky = getComputedStyle(root).getPropertyValue('--sky-top').trim() || '#84B8DB';
const paintHeader = () => {
if (!header) return;
const stuck = window.scrollY > (sky ? 24 : 8);
header.classList.toggle('is-stuck', stuck);
if (sky && themeMeta) themeMeta.content = stuck || root.classList.contains('drawer-open') ? themeBase : themeSky;
};
const onScroll = () => {
if (ticking) return;
ticking = true;
requestAnimationFrame(() => {
ticking = false;
paintHeader();
parallax();
});
};
addEventListener('scroll', onScroll, { passive: true });
addEventListener('pageshow', paintHeader);
paintHeader();
function setDrawer(open) {
drawer.hidden = !open;
toggle.setAttribute('aria-expanded', String(open));
toggle.setAttribute('aria-label', tr(open ? 'Close navigation' : 'Open navigation'));
root.classList.toggle('drawer-open', open);
paintHeader();
doc.body.style.overflow = open ? 'hidden' : '';
if (orderbar) orderbar.classList.toggle('is-hidden', open);
}
if (toggle) {
toggle.addEventListener('click', () => setDrawer(drawer.hidden));
drawer.addEventListener('click', event => { if (event.target.closest('a')) setDrawer(false); });
doc.addEventListener('keydown', event => { if (event.key === 'Escape' && !drawer.hidden) { setDrawer(false); toggle.focus(); } });
}
/* ---------- snow ---------- */
const stage = $('[data-hero-stage]');
function parallax() {
if (!stage || reduced.matches) return;
const y = Math.min(window.scrollY, 900);
stage.style.transform = 'translate3d(0,' + (y * 0.1).toFixed(1) + 'px,0)';
}
function snow(canvas) {
const ctx = canvas.getContext('2d');
const style = getComputedStyle(canvas);    // the section can set its own snow colours
const far = style.getPropertyValue('--snow-far').trim() || '#A9CBE6';
const near = style.getPropertyValue('--snow-near').trim() || '#FFFFFF';
let width = 0, height = 0, flakes = [], running = false, last = 0, visible = true;
const make = initial => {
const depth = Math.random();              // 0 far … 1 near
return {
x: Math.random() * width, y: initial ? Math.random() * height : -12,
r: 0.8 + depth * depth * 2.9, speed: 12 + depth * 30, sway: 6 + Math.random() * 16,
phase: Math.random() * 6.283, near: depth > 0.62, alpha: 0.5 + depth * 0.5
};
};
const resize = () => {
const ratio = Math.min(window.devicePixelRatio || 1, 2);
width = canvas.clientWidth; height = canvas.clientHeight;
canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
const count = Math.round(Math.min(90, Math.max(34, width * height / 9000)));
flakes = Array.from({ length: count }, () => make(true));
draw(0);
};
const draw = dt => {
ctx.clearRect(0, 0, width, height);
for (const f of flakes) {
f.y += f.speed * dt; f.phase += dt * 0.7;
if (f.y > height + 12) Object.assign(f, make(false));
const x = f.x + Math.sin(f.phase) * f.sway;
ctx.globalAlpha = f.alpha;
ctx.fillStyle = f.near ? near : far;
if (f.near) { ctx.shadowColor = far; ctx.shadowBlur = f.r * 2.2; } else ctx.shadowBlur = 0;
ctx.beginPath(); ctx.arc(x, f.y, f.r, 0, 6.283); ctx.fill();
}
ctx.globalAlpha = 1; ctx.shadowBlur = 0;
};
const frame = time => {
if (!running) return;
const dt = Math.min(0.05, (time - last) / 1000 || 0);
last = time; draw(dt);
requestAnimationFrame(frame);
};
const update = () => {
const should = visible && !doc.hidden && !reduced.matches;
if (should && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
else if (!should) running = false;
};
resize();
addEventListener('resize', resize);
new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }).observe(canvas);
doc.addEventListener('visibilitychange', update);
reduced.addEventListener('change', update);
update();
}
const canvas = $('[data-snow]');
if (canvas) snow(canvas);
/* The hand-written font is only used far down the page, so it is fetched when the story gets close. */
const storySection = $('.story');
if (storySection && 'FontFace' in window && 'IntersectionObserver' in window) {
const near = new IntersectionObserver(entries => {
if (!entries[0].isIntersecting) return;
near.disconnect();
new FontFace('Gaegu', 'url(/assets/site/fonts/gaegu-700.woff2) format("woff2")', { weight: '700' }).load().then(face => doc.fonts.add(face)).catch(() => {});
}, { rootMargin: '900px 0px' });
near.observe(storySection);
}
/* ---------- the bowl that builds itself ---------- */
const buildStage = $('[data-build-stage]');
if (buildStage) {
const steps = $$('[data-build-step]');
const setStep = n => {
for (let i = 1; i <= steps.length; i++) buildStage.classList.toggle('s' + i, i <= n);
steps.forEach((step, i) => step.classList.toggle('is-active', i + 1 === n));
buildStage.dataset.step = n;
};
if (!('IntersectionObserver' in window) || reduced.matches) setStep(steps.length);
else {
const measure = () => {
const line = innerHeight * (innerWidth < 860 ? 0.72 : 0.56);
let current = 0;
steps.forEach((step, i) => { const box = step.getBoundingClientRect(); if (box.top + Math.min(box.height * 0.35, 120) < line) current = i + 1; });
if (String(current) !== buildStage.dataset.step) setStep(current);
};
let queued = false;
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; measure(); }); } };
new IntersectionObserver(entries => {
if (entries[0].isIntersecting) { addEventListener('scroll', queue, { passive: true }); measure(); }
else removeEventListener('scroll', queue);
}, { rootMargin: '200px 0px' }).observe($('[data-build]'));
}
}
/* ---------- menu: category chips ---------- */
const cats = $('[data-cats]');
if (cats && 'IntersectionObserver' in window) {
const links = $$('a', cats);
const byId = new Map(links.map(link => [link.getAttribute('href').slice(1), link]));
const mark = id => links.forEach(link => {
const on = link === byId.get(id);
if (on && !link.hasAttribute('aria-current')) { link.setAttribute('aria-current', 'true'); link.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced.matches ? 'auto' : 'smooth' }); }
else if (!on) link.removeAttribute('aria-current');
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) mark(entry.target.id); }), { rootMargin: '-30% 0px -60% 0px' });
byId.forEach((_, id) => { const section = doc.getElementById(id); if (section) observer.observe(section); });
}
/* ---------- menu: item sheet ---------- */
const sheet = $('#item-sheet');
if (sheet && typeof sheet.showModal === 'function') {   // very old phones simply keep the card as it is
let opener = null;
const closeSheet = () => {
if (!sheet.open) return;
if (reduced.matches) return sheet.close();
sheet.classList.add('is-closing');
sheet.addEventListener('animationend', () => { sheet.classList.remove('is-closing'); sheet.close(); }, { once: true });
};
const openSheet = cardEl => {
opener = $('.card-hit', cardEl);
const holder = $('[data-sheet-photo]', sheet);
holder.replaceChildren(($('.card-photo picture', cardEl) || $('.card-photo img', cardEl)).cloneNode(true));
$$('source,img', holder).forEach(node => { node.sizes = '(max-width: 600px) 90vw, 480px'; node.removeAttribute('loading'); });
$('[data-sheet-title]', sheet).textContent = $('.card-name', cardEl).textContent;
const tags = $('[data-sheet-tags]', sheet);
tags.replaceChildren(...$$('.card-meta > *', cardEl).map(node => node.cloneNode(true)));
const price = $('[data-sheet-price]', sheet);
price.hidden = !cardEl.dataset.price; price.textContent = cardEl.dataset.price || '';
const list = $('[data-sheet-ing]', sheet);
list.replaceChildren(...cardEl.dataset.ing.split('|').map((part, i) => { const li = doc.createElement('li'); li.textContent = tr(part); li.style.setProperty('--i', i); return li; }));
const note = $('[data-sheet-note]', sheet);
note.hidden = !cardEl.dataset.note; note.textContent = cardEl.dataset.note ? tr(cardEl.dataset.note) : '';
sheet.showModal();
sheet.scrollTop = 0;
if (orderbar) orderbar.classList.add('is-hidden');
};
doc.addEventListener('click', event => {
const cardEl = event.target.closest('.card');
if (!cardEl || event.target.closest('a')) return;
cardEl.classList.add('is-lifted');           // the card lifts, then its sheet rises
setTimeout(() => { openSheet(cardEl); setTimeout(() => cardEl.classList.remove('is-lifted'), 300); }, reduced.matches ? 0 : 150);
});
$('[data-sheet-close]', sheet).addEventListener('click', closeSheet);
sheet.addEventListener('click', event => { if (event.target === sheet) closeSheet(); });
sheet.addEventListener('cancel', event => { event.preventDefault(); closeSheet(); });
sheet.addEventListener('close', () => { if (orderbar) orderbar.classList.remove('is-hidden'); if (opener) opener.focus({ preventScroll: true }); });
const target = location.hash.startsWith('#menu-item-') && doc.getElementById(location.hash.slice(1));
if (target) { target.classList.add('is-lifted'); setTimeout(() => target.classList.remove('is-lifted'), 1600); }
}
/* ---------- menu: toppings bounce in when filtered ---------- */
const panel = $('[data-topping-panel]');
if (panel) {
const tabs = $$('[data-tab]');
const items = $$('.topping', panel);
const fruitNote = $('.fruit-note', panel);
const servingNote = $('[data-serving-note]', panel);
const select = (group, focus) => {
tabs.forEach(tab => { const on = tab.dataset.tab === group; tab.setAttribute('aria-selected', String(on)); tab.tabIndex = on ? 0 : -1; if (on && focus) tab.focus(); });
panel.setAttribute('aria-labelledby', 'tab-' + group);
let index = 0;
items.forEach(item => {
const on = item.dataset.group === group;
item.hidden = !on;
item.classList.remove('pop');
if (on) { item.style.setProperty('--i', index++); void item.offsetWidth; item.classList.add('pop'); }
});
fruitNote.hidden = group !== 'fruit';
servingNote.hidden = group === 'fruit';
};
tabs.forEach(tab => tab.addEventListener('click', () => select(tab.dataset.tab)));
$('.tabs').addEventListener('keydown', event => {
const order = tabs.map(tab => tab.dataset.tab);
let i = order.indexOf($('[data-tab][aria-selected="true"]').dataset.tab);
if (event.key === 'ArrowRight') i = (i + 1) % order.length;
else if (event.key === 'ArrowLeft') i = (i + order.length - 1) % order.length;
else if (event.key === 'Home') i = 0;
else if (event.key === 'End') i = order.length - 1;
else return;
event.preventDefault(); select(order[i], true);
});
items.forEach(item => { item.hidden = item.dataset.group !== 'crunch'; });
if ('IntersectionObserver' in window) {
const once = new IntersectionObserver(entries => { if (entries[0].isIntersecting) { once.disconnect(); select('crunch'); } }, { threshold: 0.2 });
once.observe(panel);
}
}
/* ---------- live stock from Square (SOLD OUT / FEW LEFT) ---------- */
const norm = text => String(text || '').toLowerCase().replace(/bingsu|bingsoo|premium|shaved ice|snow/g, ' ').replace(/[^a-z0-9가-힣]+/g, ' ').trim();
const score = (menuName, kind, square) => {
const a = norm(menuName), b = norm(square.name).replace(/\bcup\b/g, ' ').replace(/\s+/g, ' ').trim();
if (!a || !b) return 0;
let s = a === b ? 90 : (b.includes(a) || a.includes(b)) ? 70 : 0;
if (!s) return 0;
if (square.kind === kind) s += 20; else if (square.kind && square.kind !== kind) s -= 25;
return s;
};
async function applyInventory() {
const cards = $$('.card[data-name]');
if (!cards.length) return;
try {
const response = await fetch('/api/inventory', { headers: { Accept: 'application/json' } });
if (!response.ok) return;
const stock = (await response.json()).items || [];
for (const cardEl of cards) {
if (cardEl.classList.contains('is-soon')) continue;
let best = null, bestScore = 50;
for (const square of stock) {
const n = Math.max(score(cardEl.dataset.name, cardEl.dataset.kind, square), score(cardEl.dataset.inventoryName, cardEl.dataset.kind, square));
if (n > bestScore) { bestScore = n; best = square; }
}
if (!best || (best.status !== 'soldout' && best.status !== 'low')) continue;
const meta = $('.card-meta', cardEl);
const badge = doc.createElement('span');
badge.className = 'tag ' + (best.status === 'soldout' ? 'tag-out' : 'tag-few');
badge.textContent = tr(best.status === 'soldout' ? 'SOLD OUT' : 'FEW LEFT');
meta.append(badge);
cardEl.classList.toggle('is-soldout', best.status === 'soldout');
}
} catch (_) { /* a Square outage or a local preview keeps the menu as it is */ }
}
if ('requestIdleCallback' in window) requestIdleCallback(applyInventory, { timeout: 3000 }); else setTimeout(applyInventory, 1200);
/* ---------- start ---------- */
let saved = 'en';
try { saved = localStorage.getItem(LANG_KEY) === 'ko' ? 'ko' : 'en'; } catch (_) { /* private mode */ }
if (saved === 'ko') setLanguage('ko');
})();