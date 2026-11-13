/* Page templates. Everything here is plain HTML built from the menu file,
   the settings file and the existing story/explainer copy. */
import { slug } from './data.mjs';

export const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SITE = 'https://www.sweetsnow.org';
const money = value => (value === null || value === undefined ? '' : '$' + (Number.isInteger(value) ? value : value.toFixed(2)));

/* ---------- shared pieces ---------- */

const ICON = {
  arrow: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  out: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  pin: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.2s4.4-4 4.4-7.4A4.4 4.4 0 0 0 3.6 6.8c0 3.4 4.4 7.4 4.4 7.4Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="8" cy="6.7" r="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  cash: '<img class="pay cash" src="/assets/cash-app-logo.svg" width="22" height="22" alt="">',
  dash: '<img class="pay dash" src="/assets/doordash-logo.svg" width="26" height="15" alt="">'
};

function header(ctx, page) {
  const { t, ta, logo, site } = ctx;
  const L = site.SETTINGS.links;
  const nav = [['Home', '/', 'home'], ['Menu', '/menu', 'menu'], ['Our story', '/#brand-story', 'story'], ['Find us', '/visit', 'visit']];
  if (site.catering?.announce) nav.splice(2, 0, ['Catering', '/catering', 'catering']);
  const links = nav.map(([label, href, key]) => `<a href="${href}"${key === page ? ' aria-current="page"' : ''}>${t(label)}</a>`).join('');
  return `<a class="skip" href="#main">${t('Skip to content')}</a>
<header class="site-header" data-header>
  <div class="topbar wrap"><a class="topbar-addr" href="/visit">${ICON.pin}<span>${e(site.brand.street)} · Garden Grove</span></a><span class="status" data-status aria-live="polite"></span></div>
  <div class="bar wrap">
    <a class="brand" href="/" aria-label="${ta('Sweet Snow home')}">${logo('logo-blue', 'Sweet Snow', 'brand-logo', '(max-width: 720px) 112px, 136px')}</a>
    <nav class="nav" aria-label="${ta('Main navigation')}">${links}</nav>
    <div class="bar-actions">
      <span class="status status-compact" data-status-compact aria-hidden="true"></span>
      <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="ko" aria-pressed="false" lang="ko">한국어</button></div>
      <a class="btn btn-primary btn-order" href="${e(L.order)}" target="_blank" rel="noopener noreferrer" data-track="order">${ICON.cash}<span>${t('Order online')}</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="drawer" aria-label="${ta('Open navigation')}"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" hidden>
  <nav class="drawer-nav" aria-label="${ta('Main navigation')}">${links}</nav>
  <div class="drawer-foot">
    <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="ko" aria-pressed="false" lang="ko">한국어</button></div>
    <p class="drawer-addr"><a href="${e(L.maps)}" target="_blank" rel="noopener">${e(site.brand.venue)}<br>${e(site.brand.street)}, ${e(site.brand.city)}</a></p>
    <p class="status" data-status></p>
  </div>
</div>`;
}

function hoursRows(ctx) {
  const { t } = ctx;
  return `<dl class="hours" data-hours>
      <div data-days="1,2,3,4"><dt>${t('Monday–Thursday')}</dt><dd>${t('5 pm – 10 pm')}</dd></div>
      <div data-days="5,6,0"><dt>${t('Friday–Sunday')}</dt><dd>${t('1 pm – 10 pm')}</dd></div>
    </dl>`;
}

function footer(ctx) {
  const { t, ta, logo, site } = ctx;
  const L = site.SETTINGS.links;
  const handle = L.instagram.replace(/\/$/, '').split('/').pop();
  return `<footer class="site-footer" id="visit">
  <div class="wrap footer-grid">
    <div class="footer-brand">${logo('arch-blue', 'Sweet Snow. ' + site.SETTINGS.tagline, 'footer-logo', '200px', true)}</div>
    <section aria-labelledby="f-visit"><h2 id="f-visit">${t('Visit us')}</h2><address>${t(site.brand.venue)}<br>${e(site.brand.street)}<br>${e(site.brand.city)}</address><a class="link" href="${e(L.maps)}" target="_blank" rel="noopener">${t('Get directions')}${ICON.out}</a></section>
    <section aria-labelledby="f-hours"><h2 id="f-hours">${t('Hours')}</h2>${hoursRows(ctx)}<p class="status" data-status></p></section>
    <section aria-labelledby="f-follow"><h2 id="f-follow">${t('Follow along')}</h2><a class="link" href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON.out}</a></section>
  </div>
  <nav class="wrap footer-links" aria-label="${ta('Footer navigation')}">
    <a href="${e(L.order)}" target="_blank" rel="noopener noreferrer" data-track="order">${ICON.cash}${t('Order online')}</a>
    <a href="${e(L.delivery)}" target="_blank" rel="noopener" data-track="delivery">${ICON.dash}${t('Delivery with DoorDash')}</a>
    ${site.catering?.announce ? `<a href="/catering">${t('Catering')}</a>\n    ` : ''}<a href="/privacy">${t('Privacy')}</a>
  </nav>
</footer>
<div class="orderbar" data-orderbar>
  <a class="orderbar-main" href="${e(L.order)}" target="_blank" rel="noopener noreferrer" data-track="order">${ICON.cash}<span>${t('Order online')}</span></a>
  <a class="orderbar-side" href="${e(L.delivery)}" target="_blank" rel="noopener" data-track="delivery">${ICON.dash}<span>${t('Delivery')}</span></a>
</div>`;
}

function faq(ctx) {
  const { t, site } = ctx;
  const L = site.SETTINGS.links;
  const items = [
    ['What is bingsu?', 'Bingsu, also spelled bingsoo, is a Korean shaved ice dessert. At Sweet Snow, our milk base is shaved into soft snow and layered with fruit, syrups and toppings.'],
    ['Where is Sweet Snow?', 'Find us inside the QT Golden Market Place food court at 9772 Garden Grove Blvd, Garden Grove, CA 92844. Look for the blue Sweet Snow sign.'],
    ['Can I order pickup or delivery?', 'Use Order online to see today’s pickup menu and availability. Delivery is available through our DoorDash link.'],
    ['What are croffles and mini taiyaki?', 'A croffle is croissant dough cooked in a waffle maker. Our mini taiyaki are small filled, fish-shaped pastries, baked to order and served as seven pieces in a small kraft paper bag.']
  ];
  return `<section class="faq wrap" aria-labelledby="faq-title">
  <h2 id="faq-title">${t('A little more about Sweet Snow')}</h2>
  <div class="faq-list">${items.map(([q, a]) => `<details><summary>${t(q)}</summary><p>${t(a)}</p></details>`).join('')}</div>
  <p class="faq-links"><a class="link" href="/visit">${t('Hours & directions')}${ICON.arrow}</a><a class="link" href="${e(L.order)}" target="_blank" rel="noopener noreferrer" data-track="order">${t('Order online')}${ICON.out}</a></p>
</section>`;
}

/* ---------- menu cards ---------- */

function tags(ctx, item) {
  const { t, site } = ctx;
  const L = site.SETTINGS.links;
  const out = [];
  if (item.type) out.push(`<span class="tag">${t(item.type)}</span>`);
  if (item.isNew) out.push(`<span class="tag tag-new">${t('New')}</span>`);
  if (item.tag) out.push(`<span class="tag tag-soft">${t(item.tag)}</span>`);
  if (item.comingSoon) out.push(`<span class="tag tag-soon">${t('Coming soon')}</span>`);
  else if (item.checkAvailability) out.push(`<a class="avail" href="${e(L.order)}" target="_blank" rel="noopener noreferrer" data-track="order">${t('Check availability')}</a>`);
  return out.join('');
}

export const CARD_SIZES = '(max-width: 599px) 39vw, (max-width: 859px) 27vw, 240px';

function card(ctx, item, eager = false) {
  const role = 'card';
  const { t, ta, img, site } = ctx;
  const parts = item.ing.split(item.kind === 'croffle' ? /,\s*/ : /\s*·\s*/).filter(Boolean);
  const alt = item.kind === 'cup' ? item.name + ' bingsu' : item.kind === 'hot' ? item.name + ' mini taiyaki' : item.preview ? item.name + ' — serving preview' : item.name;
  const sizes = CARD_SIZES;
  return `<article class="card card-${item.kind}${item.comingSoon ? ' is-soon' : ''}" id="${item.id}" data-name="${e(item.name)}" data-inventory-name="${e(item.inventoryName)}" data-kind="${item.kind}" data-ing="${e(parts.join('|'))}"${item.note ? ` data-note="${e(item.note)}"` : ''}${site.showPrices && item.price !== null ? ` data-price="${e(money(item.price))}"` : ''}>
  <button class="card-hit" type="button" aria-haspopup="dialog" aria-label="${ta('Show ingredients for ' + item.name)}">
    <span class="card-photo">${img(item.photo, role, { alt: ta(alt), sizes, eager })}</span>
  </button>
  <div class="card-body">
    <h3 class="card-name">${t(item.name)}</h3>${site.showPrices && item.price !== null ? `<p class="card-price">${e(money(item.price))}</p>` : ''}
    <p class="card-ing">${t(item.ing)}</p>${item.note ? `<p class="card-note">${t(item.note)}</p>` : ''}
    <p class="card-meta">${tags(ctx, item)}</p>
  </div>
</article>`;
}

/* ---------- the drawing that builds itself ---------- */

/* Splits the top-level children of an element's inner markup. The drawing is
   used exactly as menu-art.js produces it; this only groups its existing parts
   so they can be animated one after another. */
function children(markup) {
  const out = [];
  const tag = /<(\/?)([a-zA-Z][\w:-]*)([^<>]*?)(\/?)>/g;
  let depth = 0, start = -1, match;
  while ((match = tag.exec(markup))) {
    const [, closing, , , selfClosing] = match;
    if (!closing) {
      if (depth === 0) start = match.index;
      if (!selfClosing) depth++;
      else if (depth === 0) out.push(markup.slice(start, tag.lastIndex));
    } else {
      depth--;
      if (depth === 0) out.push(markup.slice(start, tag.lastIndex));
    }
  }
  return out;
}

/* Parts that can be left out of a drawing (site-settings.js → buildBowlLeaveOut), so it matches
   today's recipe. Each is recognised by the exact shape menu-art.js draws for it. Nothing is
   redrawn and menu-art.js is not changed; the piece is simply not placed on the page. */
const LEAVE_OUT = {
  'coconut flakes': piece => /^<g transform="[^"]*">\s*<ellipse cx="0" cy="0" rx="6\.5" ry="2\.4"[^>]*\/>\s*<\/g>$/.test(piece)
};

export function buildArt(ctx) {
  const flavor = ctx.site.SETTINGS.buildBowl || 'Mango';
  const leaveOut = (ctx.site.SETTINGS.buildBowlLeaveOut || []).map(name => LEAVE_OUT[String(name).toLowerCase()]).filter(Boolean);
  const skip = piece => leaveOut.some(test => test(piece.trim()));
  const svg = ctx.site.ART.bowl(flavor).replace(/\s*\n\s*/g, ' ');
  const open = /^<svg[^>]*>/.exec(svg)[0];
  const inner = svg.slice(open.length, svg.lastIndexOf('</svg>'));
  const top = children(inner);
  const layer = (step, markup, extra = '') => `<g class="bl bl-${step}"${extra}>${markup}</g>`;
  const drop = (step, list) => list.map((m, i) => `<g class="bl bl-${step} bl-drop" style="--i:${i}">${m}</g>`).join('');
  const out = [];
  let seenBowl = false;
  top.forEach((node, index) => {
    if (skip(node)) return;
    if (node.startsWith('<defs')) return out.push(node);
    const isClip = node.startsWith('<g clip-path');
    const isMoundFill = index === 1;
    if (isMoundFill) return out.push(layer('snow', node));
    if (isClip && !seenBowl) {
      // coat + syrup streaks + fruit, all clipped to the snow mound
      const openTag = /^<g[^>]*>/.exec(node)[0];
      const parts = children(node.slice(openTag.length, node.lastIndexOf('</g>')));
      const syrup = parts.filter(p => /^<path[^>]*fill="none"/.test(p) || /^<path d="M13 69/.test(p) || /^<rect x="0" y="0"/.test(p));
      const fruit = parts.filter(p => !syrup.includes(p) && !skip(p));
      return out.push(`${openTag}${layer('syrup', syrup.join(''))}${drop('fruit', fruit)}</g>`);
    }
    if (node.startsWith('<path') && !seenBowl && /fill="none"/.test(node)) return out.push(layer('snow', node));
    if (node.startsWith('<path') && !seenBowl) { seenBowl = true; return out.push(layer('bowl', node)); }
    if (isClip && seenBowl && /stroke="#FFFFFF"|opacity="0\.6"/.test(node) && !/<circle/.test(node)) return out.push(layer('bowl', node));
    if (node.startsWith('<path') && seenBowl) return out.push(layer('snow', node)); // the snow spilling over the rim
    if (isClip && seenBowl) return out.push(layer('syrup', node)); // syrup running down inside the bowl
    if (/data-layer="(top|side)-mochi"/.test(node)) {
      const openTag = /^<g[^>]*>/.exec(node)[0];
      const parts = children(node.slice(openTag.length, node.lastIndexOf('</g>')));
      return out.push(parts.length ? `${openTag}${drop('finish', parts)}</g>` : node);
    }
    out.push(`<g class="bl bl-finish bl-drop" style="--i:${index % 5}">${node}</g>`); // the crown
  });
  return open.replace('class="art-svg"', 'class="art-svg build-svg"') + out.join('') + '</svg>';
}

/* ---------- HOME ---------- */

function hero(ctx) {
  const { t, ta, img, site } = ctx;
  const L = site.SETTINGS.links;
  const h = site.hero;
  const words = h.title.split(' ');
  return `<section class="hero" id="discover" aria-labelledby="hero-title">
  <div class="hero-inner wrap">
    <div class="hero-copy">
      <p class="hero-tagline">${t(site.SETTINGS.tagline)}</p>
      <h1 id="hero-title" class="hero-title" aria-label="${ta(h.title)}" data-words="${e(h.title)}">${words.map(w => `<span>${e(w)}</span>`).join(' ')}</h1>
      ${h.label ? `<p class="chip">${t(h.label)}</p>` : ''}
    </div>
    <div class="hero-stage" data-hero-stage>
      <div class="hero-halo" aria-hidden="true"></div>
      ${img(h.item.photo, 'hero', { alt: ta(h.item.name), sizes: ctx.heroSizes, eager: true, cls: 'hero-photo' })}
    </div>
    <div class="hero-foot">
      <p class="hero-text">${t(h.text)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${e(L.order)}" target="_blank" rel="noopener noreferrer" data-track="order">${ICON.cash}<span>${t('Order online')}</span></a>
        <a class="btn btn-quiet" href="${e(L.delivery)}" target="_blank" rel="noopener" data-track="delivery">${ICON.dash}<span>${t('Delivery with DoorDash')}</span></a>
        <a class="link hero-menu-link" href="/menu">${t('Explore the menu')}${ICON.arrow}</a>
      </div>
    </div>
    <p class="hero-sign" aria-hidden="true">${ctx.sign}</p>
  </div>
  <canvas class="snow" data-snow aria-hidden="true"></canvas>
</section>`;
}

function build(ctx) {
  const { t, site } = ctx;
  const steps = [
    ['Milk snow', site.brand.blurb],
    ['House-made syrup', 'Flavor in layers.'],
    ['Fruit & toppings', site.MENU.footer?.left || ''],
    ['The finish', 'Each flavor has its own finish.']
  ];
  return `<section class="build" id="what-is-bingsu" aria-labelledby="build-title" data-build>
  <div class="wrap build-head">
    <p class="kicker">${t('Quality ingredients. Bringing new flavors.')}</p>
    <h2 id="build-title">${t('What Is Bingsu?')}</h2>
    <p class="lead">${t('A Korean shaved ice dessert, made at Sweet Snow with soft, fluffy milk snow.')}</p>
  </div>
  <div class="wrap build-body">
    <div class="build-stage" data-build-stage data-step="0" role="img" aria-label="${e('A little look inside a ' + (site.SETTINGS.buildBowl || 'Mango').toLowerCase() + ' bingsu')}">${buildArt(ctx)}</div>
    <ol class="build-steps">${steps.map(([title, text], i) => `<li class="build-step" data-build-step="${i + 1}"><span class="build-num" aria-hidden="true">${i + 1}</span><h3>${t(title)}</h3><p>${t(text)}</p></li>`).join('')}</ol>
  </div>
  <div class="wrap build-foot">
    <h3>${t('Fresh ingredients. Thoughtfully made.')}</h3>
    <p>${t('We care about fresh, quality ingredients in every single bowl. Building on traditional Korean bingsu, we experiment with seasonal fruits, house-made syrups and thoughtfully chosen toppings to bring you something familiar—and something new.')}</p>
    <a class="link" href="/menu">${t('Explore our bingsu menu')}${ICON.arrow}</a>
    <details class="more">
      <summary>${t('What Is Snowflake Bingsu?')}</summary>
      <p class="lead">${t('Korean shaved milk ice, soft as freshly fallen snow.')}</p>
      <h4>${t('Light, Fluffy, Melt-In-Your-Mouth')}</h4>
      <p>${t('Bingsu is a Korean shaved ice dessert, also spelled bingsoo. Snowflake bingsu takes its name from the delicate flakes that resemble snow. Made with a milk base, this modern style has a soft, creamy texture that melts on your tongue.')}</p>
      <p>${t('At Sweet Snow, we use only milk for our snow, shaved on an authentic snowflake machine from Korea. Each flavor brings its own combination of fruit, house-made syrups and toppings. Our full-size bowls are made to share between two or three people.')}</p>
      <h4>${t('From Ice To Milk Snow')}</h4>
      <p>${t('Korea has a long tradition of chilled ice desserts. Early ice-and-fruit preparations were different from the bingsu bowls we know today. Over time, shaved ice topped with sweet red bean became a familiar favorite known as patbingsu.')}</p>
      <p>${t('The milk-snow style is a more recent chapter. Snowflake-style bingsu gained popularity during the 2000s, and shaved-milk versions became mainstream in Korea in the early-to-mid 2010s as dessert cafés expanded. Today, bowls range from red bean and roasted soybean powder to fresh fruit and tea flavors.')}</p>
      <p class="sources">${t('Read more:')} <a href="https://www.korea.net/NewsFocus/Culture/view?articleId=189405" target="_blank" rel="noopener noreferrer">Korea.net’s bingsu history</a>, <a href="https://www.koreana.or.kr/koreana/na/ntt/selectNttInfo.do?bbsId=1114&amp;nttSn=111593" target="_blank" rel="noopener noreferrer">Koreana’s dessert history</a>.</p>
    </details>
  </div>
</section>`;
}

function features(ctx) {
  const { t, ta, img, site } = ctx;
  const short = name => name.replace(/ (Croffle|Cup)$/, '');
  const figure = (item, sizes) => `<figure><a href="/menu#${item.id}">${img(item.photo, 'feature', { alt: ta(item.kind === 'cup' ? short(item.name) + ' cup bingsu' : short(item.name) + ' croffle'), sizes })}</a><figcaption>${t(short(item.name))}</figcaption></figure>`;
  return `<section class="feature feature-croffles" aria-labelledby="home-croffles-title">
  <div class="wrap feature-inner">
    <div class="feature-copy">
      <p class="kicker">${t('A little golden crunch')}</p>
      <h2 id="home-croffles-title">${t('Premium Croffles')}</h2>
      <p>${t('Croissant dough pressed in a waffle iron. Golden, flaky layers with your favorite toppings.')}</p>
      <a class="link" href="/menu#croffles">${t('Explore croffles')}${ICON.arrow}</a>
    </div>
    <div class="feature-food feature-food-2">${site.homeCroffles.map(i => figure(i, '(max-width: 859px) 44vw, 330px')).join('')}</div>
  </div>
</section>
<section class="feature feature-cups" aria-labelledby="home-cups-title">
  <div class="wrap feature-inner">
    <div class="feature-copy">
      <p class="kicker">${t('Your own little snow day')}</p>
      <h2 id="home-cups-title">${t('Cup Bingsu')}</h2>
      <p>${t('Our premium milk snow, layered with fruit, syrups and toppings. All the joy of bingsu, in a cup.')}</p>
      <a class="link" href="/menu#single-cups">${t('Explore cup bingsu')}${ICON.arrow}</a>
    </div>
    <div class="feature-food feature-food-3">${site.homeCups.map(i => figure(i, '(max-width: 859px) 29vw, 220px')).join('')}</div>
  </div>
</section>`;
}

function story(ctx) {
  const { img, story: S } = ctx;
  const polaroid = p => `<figure class="polaroid" style="--tilt:${Number(p.tilt) || 0}deg">${img('/assets/story/' + p.file, 'photo', { alt: e(p.alt), sizes: '(max-width: 720px) 62vw, 260px' })}<figcaption><span class="pol-caption">${e(p.caption)}</span>${p.note ? `<span class="pol-note">${e(p.note)}</span>` : ''}<span class="pol-date">${e(p.date)}</span></figcaption></figure>`;
  const block = lang => {
    const P = S.photos[lang];
    const letter = S.letter[lang].replace(/<img class="sl-logo"[^>]*>/, '').trim();
    return `<div class="story-photos" data-reel>${[...P.left, ...P.right, ...P.row].map(polaroid).join('')}</div><article class="letter" lang="${lang}">${letter}</article>`;
  };
  ctx.blocks.story = block('ko');
  return `<section class="story" id="brand-story" aria-label="Our story"><div class="wrap story-inner" data-i18n-block="story">${block('en')}</div><p class="wrap story-next"><a class="link" href="/visit">${ctx.t('Come find us')}${ICON.arrow}</a></p></section>`;
}

function findTeaser(ctx) {
  const { t, site } = ctx;
  const L = site.SETTINGS.links;
  return `<section class="find-teaser" aria-labelledby="find-teaser-title">
  <div class="wrap find-teaser-inner">
    <div>
      <p class="kicker">${t('Come find us')}</p>
      <h2 id="find-teaser-title">${t('Inside QT Golden Market Place.')}</h2>
      <p>${t('Enter the food court and walk straight in. You’ll find Sweet Snow inside.')}</p>
      <p class="find-teaser-links"><a class="btn btn-primary" href="${e(L.maps)}" target="_blank" rel="noopener" data-track="directions">${ICON.pin}<span>${t('Get directions')}</span></a><a class="link" href="/visit">${t('Hours & directions')}${ICON.arrow}</a></p>
    </div>
    <div class="find-teaser-hours"><h3>${t('Hours')}</h3>${hoursRows(ctx)}<p class="status" data-status></p></div>
  </div>
</section>`;
}

export function home(ctx) {
  return `${header(ctx, 'home')}
<main id="main">
${hero(ctx)}
${build(ctx)}
${features(ctx)}${ctx.cateringHome ? ctx.cateringHome() : ''}
${story(ctx)}
${findTeaser(ctx)}
${faq(ctx)}
</main>
${footer(ctx)}`;
}

/* ---------- MENU ---------- */

function sheet(ctx) {
  const { t, ta, site } = ctx;
  const L = site.SETTINGS.links;
  return `<dialog class="sheet" id="item-sheet" aria-labelledby="sheet-title">
  <button class="sheet-close" type="button" aria-label="${ta('Close ingredients')}" data-sheet-close>${ICON.close}</button>
  <div class="sheet-photo" data-sheet-photo></div>
  <div class="sheet-body">
    <p class="sheet-tags" data-sheet-tags></p>
    <h2 id="sheet-title" data-sheet-title></h2>
    <p class="sheet-price" data-sheet-price hidden></p>
    <ul class="sheet-ing" data-sheet-ing></ul>
    <p class="sheet-note" data-sheet-note hidden></p>
    <div class="sheet-actions">
      <a class="btn btn-primary" href="${e(L.order)}" target="_blank" rel="noopener noreferrer" data-track="order">${ICON.cash}<span>${t('Order online')}</span></a>
      <a class="btn btn-quiet" href="${e(L.delivery)}" target="_blank" rel="noopener" data-track="delivery">${ICON.dash}<span>${t('Delivery')}</span></a>
    </div>
  </div>
</dialog>`;
}

export function menu(ctx) {
  const { t, ta, img, site } = ctx;
  const M = site.SETTINGS.mochiIceCream || {};
  const groups = [['menu-classic', 'Classic', site.groups.classic], ['menu-special', 'Special', site.groups.special], ['menu-half-half', 'Fruit Half & Half', site.groups['half-half']]];
  const cats = [...groups.map(([id, label]) => [id, label]), ['single-cups', 'Cups'], ['food', 'Food'], ['croffles', 'Croffles'], ['toppings', 'Toppings']];
  const tabs = [['crunch', 'Crunch'], ['sweet', 'Soft & sweet'], ['finish', 'Sauces & dustings'], ['fruit', 'Extra Fruit']];
  const topping = item => `<li class="topping" data-group="${item.group}">${img(item.photo, 'icon', { alt: '', sizes: '84px' })}<span>${t(item.en)}</span>${site.showPrices && item.price ? `<small>+${e(money(item.price))}</small>` : ''}</li>`;
  ctx.ko[' '] = ' ';
  for (const item of [...site.toppings, ...site.extraFruit]) ctx.ko[item.en] = item.ko; // the owner's own Korean topping names
  return `${header(ctx, 'menu')}
<main id="main" class="menu-page">
  <header class="page-head wrap" id="menu">
    <h1>${t('Our menu')}</h1>
    <p class="lead">${t('Korean bingsu, cup bingsu, croffles and mini taiyaki in Garden Grove. Explore the flavors below, then check today’s availability when you order online.')}</p>
  </header>
  <nav class="cats" aria-label="${ta('Menu categories')}" data-cats><div class="cats-track wrap">${cats.map(([id, label]) => `<a href="#${id}">${t(label)}</a>`).join('')}</div></nav>
  ${groups.map(([id, label, items]) => `<section class="group wrap" id="${id}" aria-labelledby="h-${id}">
    <h2 id="h-${id}">${t(label)}</h2>
    <div class="grid">${items.map((i, n) => card(ctx, i, id === 'menu-classic' && n < 2)).join('')}</div>
  </section>`).join('\n  ')}
  <section class="group wrap" id="single-cups" aria-labelledby="h-cups">
    <h2 id="h-cups">${t(site.cupMeta.title)}</h2>
    <p class="group-lead">${t(site.cupMeta.blurb)}</p>
    <div class="grid">${site.cups.map(i => card(ctx, i)).join('')}</div>
  </section>
  <section class="group wrap" id="food" aria-labelledby="h-food">
    <h2 id="h-food">${t(site.taiyakiMeta.section)}</h2>
    <h3 class="group-sub" id="mini-taiyaki">${t(site.taiyakiMeta.title)}</h3>
    <p class="group-lead">${t(site.taiyakiMeta.blurb)}</p>
    <div class="grid">${site.taiyaki.map(i => card(ctx, i)).join('')}</div>
    ${M.show ? `<div class="soon-card" id="mini-sides">
      <div><span class="tag tag-soon">${t(M.badge)}</span><h3>${t(M.name)}</h3><p>${t(M.text)}</p><p class="soon-options">${t(M.options)}</p></div>
      ${img(M.photo, 'feature', { alt: ta(M.alt), sizes: '(max-width: 720px) 60vw, 300px' })}
    </div>` : ''}
  </section>
  <section class="group wrap" id="croffles" aria-labelledby="h-croffles">
    <h2 id="h-croffles">${t('Premium Croffles')}</h2>
    <p class="group-lead">${t('Croissant meets waffle.')}</p>
    <div class="grid grid-wide grid-count-${site.croffles.length}">${site.croffles.map(i => card(ctx, i)).join('')}</div>
  </section>
  <section class="group toppings wrap" id="toppings" aria-labelledby="h-toppings">
    <p class="kicker">${t('Make it your own')}</p>
    <h2 id="h-toppings">${t('20+ toppings to choose from.')}</h2>
    <p class="group-lead">${t('Highly customizable. Mix and match your favorites to make your perfect bingsu.')}</p>
    <div class="tabs" role="tablist" aria-label="${ta('Topping categories')}">${tabs.map(([id, label], i) => `<button class="tab" role="tab" type="button" id="tab-${id}" aria-controls="topping-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${id}">${t(label)}</button>`).join('')}</div>
    <div id="topping-panel" role="tabpanel" aria-labelledby="tab-crunch" data-topping-panel>
      <div class="fruit-note" data-group="fruit" hidden><p class="kicker">${t('A little extra fruit')}</p><h3>${t('Add fruit.')}</h3><p>${t(site.toppingsMeta.fruitNote)}</p></div>
      <ul class="topping-grid">${site.toppings.map(topping).join('')}${site.extraFruit.map(topping).join('')}</ul>
      <p class="topping-note" data-serving-note>${t(site.toppingsMeta.servingNote)}</p>
    </div>
  </section>
  <p class="wrap next"><a class="link" href="/#brand-story">${t('Meet Sweet Snow')}${ICON.arrow}</a></p>
  ${faq(ctx)}
</main>
${sheet(ctx)}
${footer(ctx)}`;
}

/* ---------- VISIT ---------- */

export function visit(ctx) {
  const { t, ta, img, site } = ctx;
  const L = site.SETTINGS.links;
  return `${header(ctx, 'visit')}
<main id="main" class="visit-page">
  <section class="find wrap" id="find-us" aria-labelledby="find-title">
    <div class="find-head">
      <p class="kicker">${t('Come find us')}</p>
      <h1 id="find-title">${t('Visit Sweet Snow in Garden Grove')}</h1>
      <p class="lead">${t('Enter the food court and walk straight in. You’ll find Sweet Snow inside.')}</p>
      <p class="find-actions"><a class="btn btn-primary" href="${e(L.maps)}" target="_blank" rel="noopener" data-track="directions">${ICON.pin}<span>${t('Get directions')}</span></a><span class="status" data-status></span></p>
    </div>
    <ol class="find-steps">
      <li><figure>${img('/assets/qt-golden-market-original.webp', 'place', { alt: ta('QT Golden Market Place exterior and food court entrance'), sizes: '(max-width: 720px) 78vw, 440px' })}<figcaption><span class="find-num" aria-hidden="true">1</span><div><h2>${t('Enter here')}</h2><p>${t('QT Golden Market Place food court')}</p></div></figcaption></figure></li>
      <li><figure>${img('/assets/sweet-snow-storefront-straight.webp', 'place', { alt: ta('Sweet Snow counter inside the food court, with its blue Sweet Snow sign'), sizes: '(max-width: 720px) 78vw, 440px' })}<figcaption><span class="find-num" aria-hidden="true">2</span><div><h2>${t('Walk straight in')}</h2><p>${t('Look for our blue Sweet Snow sign.')}</p></div></figcaption></figure></li>
    </ol>
  </section>
  <section class="visit-info wrap" aria-label="${ta('Visit us')}">
    <div><h2>${t('Visit us')}</h2><address>${t(site.brand.venue)}<br>${e(site.brand.street)}<br>${e(site.brand.city)}</address><a class="link" href="${e(L.maps)}" target="_blank" rel="noopener" data-track="directions">${t('Get directions')}${ICON.out}</a></div>
    <div><h2>${t('Hours')}</h2>${hoursRows(ctx)}</div>
    <div><h2>${t('Order online')}</h2><p class="visit-order"><a class="btn btn-primary" href="${e(L.order)}" target="_blank" rel="noopener noreferrer" data-track="order">${ICON.cash}<span>${t('Order online')}</span></a><a class="btn btn-quiet" href="${e(L.delivery)}" target="_blank" rel="noopener" data-track="delivery">${ICON.dash}<span>${t('Delivery with DoorDash')}</span></a></p></div>
  </section>
  <p class="wrap next"><a class="link" href="/menu">${t('Explore the menu')}${ICON.arrow}</a></p>
</main>
${footer(ctx)}`;
}

/* ---------- small text pages (privacy, thanks, not found) ---------- */

const TEXT_PAGES = {
  privacy: {
    kicker: 'Sweet Snow', title: 'Website privacy', updated: 'Updated September 24, 2026',
    body: [
      'Sweet Snow uses Google Analytics and the Google Ads tag to understand website visits, menu engagement, and advertising performance. These services may use cookies and online identifiers and receive technical information about your browser and device.',
      'Our website tracking records page visits, viewed menu sections, navigation, Instagram link clicks, and form submission attempts. An attempt does not confirm that a message was received. Our tracking code does not send the text you enter in forms or count in-store and kiosk purchases as website sales.',
      'Google signals and advertising personalization are disabled in our website tag configuration. The tags do not load when your browser sends Global Privacy Control or Do Not Track. You can also control cookies in your browser or use <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">Google’s Analytics opt-out browser add-on</a>.',
      'Learn <a href="https://policies.google.com/technologies/partner-sites" rel="noopener">how Google uses information from sites that use its services</a>. Links to external sites, including Instagram, are subject to those sites’ privacy practices.',
      'For questions, contact Sweet Snow in-store or through <a href="https://www.instagram.com/sweetsnow_oc/" rel="noopener">our Instagram account</a>.'
    ]
  },
  thanks: {
    kicker: 'Thank you', title: 'We got it.',
    body: ['Thanks for writing. We read every idea — and if you left an email, we’ll write back.', 'Until then, come say hi at QT Golden Market Place.']
  },
  notfound: {
    kicker: '404 · Page not found', title: 'That one melted away.',
    body: ['We couldn’t find the page you were looking for. The menu, though, is right where you left it.']
  }
};

export function textPage(ctx, key) {
  const page = TEXT_PAGES[key];
  return `${header(ctx, key)}
<main id="main" class="text-page wrap">
  <p class="kicker">${e(page.kicker)}</p>
  <h1>${e(page.title)}</h1>
  ${page.updated ? `<p class="updated">${e(page.updated)}</p>` : ''}
  ${page.body.map(p => `<p>${p}</p>`).join('\n  ')}
  <p class="text-page-back"><a class="btn btn-primary" href="/menu">${ctx.t('Explore the menu')}</a></p>
</main>
${footer(ctx)}`;
}
export const privacy = ctx => textPage(ctx, 'privacy');
export const thanks = ctx => textPage(ctx, 'thanks');
export const notfound = ctx => textPage(ctx, 'notfound');

/* ---------- <head> ---------- */

export function business(site) {
  const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const byHours = new Map();
  for (const [index, hours] of Object.entries(site.schedule || {})) {
    if (!hours) continue;
    const key = hours.open + '|' + hours.close;
    byHours.set(key, [...(byHours.get(key) || []), Number(index)]);
  }
  const order = d => (d + 6) % 7; // Monday first, as before
  const spec = [...byHours.entries()].map(([key, days]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: days.sort((a, b) => order(a) - order(b)).map(d => day[d]), opens: key.split('|')[0], closes: key.split('|')[1] }))
    .sort((a, b) => day.indexOf(a.dayOfWeek[0]) === 0 ? 1 : order(day.indexOf(a.dayOfWeek[0])) - order(day.indexOf(b.dayOfWeek[0])));
  return {
    '@context': 'https://schema.org', '@type': 'IceCreamShop', '@id': SITE + '/#business', name: 'Sweet Snow', url: SITE,
    image: SITE + '/assets/sweet-snow-horizontal-right-blue-20261104.svg', logo: SITE + '/assets/sweet-snow-horizontal-right-blue-20261104.svg',
    description: 'Korean bingsu, mini taiyaki, and customizable toppings inside QT Golden Market Place, Garden Grove, CA.',
    servesCuisine: ['Korean', 'Dessert'], priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: '9772 Garden Grove Blvd', addressLocality: 'Garden Grove', addressRegion: 'CA', postalCode: '92844', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 33.7729, longitude: -117.9619 },
    openingHoursSpecification: spec,
    sameAs: ['https://www.instagram.com/sweetsnow_oc/', 'https://www.yelp.com/biz/sweet-snow-garden-grove'],
    hasMenu: SITE + '/menu', hasMap: 'https://www.google.com/maps/search/?api=1&query=Sweet%20Snow%209772%20Garden%20Grove%20Blvd%20Garden%20Grove%20CA',
    areaServed: ['Garden Grove', 'Orange County'], keywords: 'Korean bingsu, Korean shaved ice, bingsu Garden Grove, bingsu Orange County, mini taiyaki, croffles'
  };
}

export function menuSchema(site) {
  const offer = item => (site.showPrices && item.price !== null ? { offers: { '@type': 'Offer', price: item.price.toFixed(2), priceCurrency: 'USD' } } : {});
  const live = list => list.filter(i => !i.comingSoon);
  const bowl = i => ({ '@type': 'MenuItem', name: /bingsu$/i.test(i.name) ? i.name : i.name + ' Bingsu', description: i.ing.replace(/^Milk base · /, ''), ...offer(i) });
  const plain = i => ({ '@type': 'MenuItem', name: i.name, description: i.ing, ...offer(i) });
  const section = (name, items) => ({ '@type': 'MenuSection', name, hasMenuItem: items });
  return {
    '@context': 'https://schema.org', '@type': 'Menu', '@id': SITE + '/menu#menu', url: SITE + '/menu', name: 'Sweet Snow Menu', inLanguage: 'en',
    hasMenuSection: [
      section('Classic Bingsu', live(site.groups.classic).map(bowl)), section('Special Bingsu', live(site.groups.special).map(bowl)),
      section('Fruit Half & Half', live(site.groups['half-half']).map(bowl)), section('Cup Bingsu', live(site.cups).map(plain)),
      section('Croffles', live(site.croffles).map(plain)),
      section('Mini Taiyaki — 7 pieces', live(site.taiyaki).map(i => ({ '@type': 'MenuItem', name: i.name + ' Mini Taiyaki', description: `${i.ing} · ${i.note}`, ...offer(i) })))
    ]
  };
}

export const PAGES = {
  home: {
    file: 'index.html', path: '/', bodyClass: 'page-home',
    title: 'Sweet Snow | Korean Bingsu in Garden Grove, Orange County',
    ogTitle: 'Sweet Snow | Korean Bingsu in Garden Grove',
    description: 'Korean bingsu, croffles and mini taiyaki inside QT Golden Market Place in Garden Grove. Explore the menu, order online, and find hours and directions.'
  },
  menu: {
    file: 'menu.html', path: '/menu', bodyClass: 'page-menu', crumb: 'Menu',
    title: 'Sweet Snow Menu | Bingsu & Desserts in Garden Grove',
    ogTitle: 'Sweet Snow Menu | Bingsu & Desserts in Garden Grove',
    description: 'Browse Sweet Snow’s bingsu, cup bingsu, croffles and mini taiyaki menu in Garden Grove. Check today’s availability and order online for pickup.'
  },
  visit: {
    file: 'visit.html', path: '/visit', bodyClass: 'page-visit', crumb: 'Visit',
    title: 'Visit Sweet Snow | Garden Grove Hours & Directions',
    ogTitle: 'Visit Sweet Snow | Garden Grove Hours & Directions',
    description: 'Find Sweet Snow inside QT Golden Market Place at 9772 Garden Grove Blvd, Garden Grove. View our hours, entrance guide, pickup link and directions.'
  },
  // Small pages keep the short <head> they had before.
  privacy: { file: 'privacy.html', path: '/privacy', bodyClass: 'page-text', simple: true, title: 'Website privacy — Sweet Snow', description: 'How the Sweet Snow website uses Google Analytics and the Google Ads tag, and how to opt out.', canonical: true },
  thanks: { file: 'thanks.html', path: '/thanks', bodyClass: 'page-text', simple: true, title: 'Got it — Sweet Snow', robots: 'noindex' },
  notfound: { file: '404.html', path: '/404', bodyClass: 'page-text', simple: true, title: 'Page not found — Sweet Snow', robots: 'noindex' }
};

export function head(ctx, key, { css, preload = [], scripts = '', page = PAGES[key] }) {
  const url = SITE + page.path;
  if (page.simple) return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(page.title)}</title>
${page.description ? `<meta name="description" content="${e(page.description)}">\n` : ''}${page.robots ? `<meta name="robots" content="${page.robots}">\n` : ''}<meta name="theme-color" content="${ctx.themeColor}">
${page.canonical ? `<link rel="canonical" href="${url}">\n` : ''}<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-sweetsnow-20261110.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-sweetsnow-20261110.png">
${preload.join('\n')}
<style>${css}</style>
${scripts}`;
  // The picture shown when the site is shared in a message or on social apps (1200×630). Template: build/src/share-picture.html
  const og = SITE + '/assets/share-sweet-snow-20261112.jpg';
  const ogAlt = 'Sweet Snow. Authentic Korean Bingsu in Garden Grove, California.';
  const json = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  const crumb = page.crumb ? json({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Sweet Snow', item: SITE + '/' }, { '@type': 'ListItem', position: 2, name: page.crumb, item: url }] }) : '';
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${e(page.title)}</title>
<meta name="description" content="${e(page.description)}">
<meta name="author" content="Sweet Snow">
<meta name="robots" content="${page.robots || 'index, follow'}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Sweet Snow">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${e(page.ogTitle)}">
<meta property="og:description" content="${e(page.description)}">
<meta property="og:image" content="${og}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${ogAlt}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(page.ogTitle)}">
<meta name="twitter:description" content="${e(page.description)}">
<meta name="twitter:image" content="${og}">
<meta name="twitter:image:alt" content="${ogAlt}">
<meta name="theme-color" content="${ctx.themeColor}">
<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="Garden Grove">
<meta name="geo.position" content="33.7729;-117.9619">
${key === 'home' ? '<meta name="google-site-verification" content="2lnQl08cF9lgbSSqGyEk-Xq40hLfFrQtXf04Fs4-niM">\n' : ''}<link rel="manifest" href="/site.webmanifest?v=20261022">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-sweetsnow-20261110.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-sweetsnow-20261110.png">
${preload.join('\n')}
<style>${css}</style>
${json(business(ctx.site))}
${key === 'visit' || page.noMenuSchema ? '' : json(menuSchema(ctx.site))}
${crumb}
${scripts}`;
}

export { slug };
