/* SWEET SNOW CATERING — the catering landing page (where Instagram ads land),
   its thank-you page, and the three design samples.

   The page keeps the main website's look (same colours, typefaces, buttons)
   and adds a cuter concept on top. There are three, each a complete page:
     bunny   Snow Bunny      the bunny and doodles          /catering/bunny
     cloud   Cotton Cloud    pastel sky and clouds          /catering/cloud
     diary   Sticker Diary   scrapbook, polaroids, tape     /catering/diary
   All three are always built, so different ads can land on different
   designs. catering-settings.js picks the one shown at /catering itself
   with `design`. Every booking says which design it came from.

   Everything shown comes from catering/catering-settings.js and the menu:
   a menu change (name, photo, hidden item) carries over by itself. */
import fs from 'node:fs';
import path from 'node:path';
import { runBrowserFile, nearest, slug } from './data.mjs';
import { e, header as siteHeader, footer as siteFooter } from './pages.mjs';

export const SETTINGS_FILE = 'catering/catering-settings.js';
export const DESIGNS = {
  bunny: { name: 'Snow Bunny', note: 'Closest to the website today: milk-blue and airy, with the bunny, falling snow and little doodles.' },
  cloud: { name: 'Cotton Cloud', note: 'A pastel sky: bowls floating on a cloud, soft pink and butter yellow next to the blue, everything round.' },
  diary: { name: 'Sticker Diary', note: 'A scrapbook: polaroids with tape, stickers, dotted paper and handwritten titles.' }
};

/* ---------- settings ---------- */

export function loadCatering(root, site) {
  const file = path.join(root, SETTINGS_FILE);
  if (!fs.existsSync(file)) return null;                     // no catering folder, no catering pages
  const S = runBrowserFile(file).CATERING_SETTINGS;
  if (!S) throw new Error('catering-settings.js did not define window.CATERING_SETTINGS');
  const warn = text => site.warnings.push('catering-settings.js → ' + text);
  const text = value => String(value ?? '').trim();
  const list = value => (Array.isArray(value) ? value : []);

  let design = text(S.design).toLowerCase() || 'bunny';
  if (!DESIGNS[design]) { warn(`design: "${S.design}" is not one of ${Object.keys(DESIGNS).join(', ')}. Using "bunny".`); design = 'bunny'; }

  const bowls = [...site.groups.classic, ...site.groups.special, ...site.groups['half-half']];
  const named = (name, where) => {
    const item = bowls.find(bowl => bowl.name === name);
    if (item) return item;
    const close = nearest(name, bowls.map(bowl => bowl.name));
    warn(`${where}: no bingsu is called "${name}".${close ? ` Did you mean "${close}"?` : ''}`);
    return null;
  };
  const leaveOut = list(S.leaveOut).map(text).filter(name => named(name, 'leaveOut'));
  const onMenu = group => site.groups[group].filter(bowl => !bowl.comingSoon && !leaveOut.includes(bowl.name));
  const menu = { classic: onMenu('classic'), special: onMenu('special') };

  const ids = new Set();
  const tiers = list(S.tiers).map((tier, index) => {
    const name = text(tier.name) || `Tier ${index + 1}`;
    let id = 'tier-' + (slug(name) || index + 1);
    while (ids.has(id)) id += '-' + (index + 1);
    ids.add(id);
    const picks = list(tier.picks).map(pick => text(pick).toLowerCase()).filter(pick => {
      if (pick === 'classic' || pick === 'special') return true;
      warn(`tiers → "${name}" → picks: "${pick}" should be "Classic" or "Special".`);
      return false;
    });
    return { id, name, text: text(tier.text), picks, addOn: text(tier.addOn), price: text(tier.price), guests: text(tier.guests) };
  });
  if (!tiers.length) warn('tiers: there are no tiers yet.');

  const A = S.appointments || {};
  const side = (block, title) => ({ show: !!block && block.show !== false, title: text(block?.title) || title, text: text(block?.text) });
  const H = S.homePage || {};
  const home = { show: H.show === true, title: text(H.title) || text(S.title) || 'Sweet Snow Catering', text: text(H.text), link: H.link === true };
  const answers = Object.fromEntries(Object.entries(S.answers || {}).map(([key, value]) => [key, text(value)]).filter(([, value]) => value));
  return {
    design, announce: S.announce === true, tag: text(S.tag), home,
    title: text(S.title) || 'Sweet Snow Catering', headline: text(S.headline) || 'Sweet Snow Catering', text: text(S.text),
    heroItems: list(S.heroItems).map(name => named(text(name), 'heroItems')).filter(Boolean).slice(0, 3),
    facts: list(S.facts).map(text).filter(Boolean),
    tiers, menu,
    taiyaki: { ...side(S.taiyaki, 'Mini taiyaki add-on'), items: site.taiyaki.slice(0, 3) },
    preMade: side(S.preMade, 'Pre-made cups, on the side'),
    events: list(S.events).map(text).filter(Boolean),
    appointments: {
      title: text(A.title) || 'Book your appointment', text: text(A.text),
      times: list(A.times).map(text).filter(Boolean), leadTime: text(A.leadTime), serviceArea: text(A.serviceArea)
    },
    answers
  };
}

/* ---------- little drawings ---------- */

const DOODLE = {
  sparkle: '<svg class="k-doodle k-sparkle" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5c.9 5.6 2.9 7.6 8.5 8.5-5.6.9-7.6 2.9-8.5 8.5-.9-5.6-2.9-7.6-8.5-8.5 5.6-.9 7.6-2.9 8.5-8.5Z"/></svg>',
  heart: '<svg class="k-doodle k-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5C5.6 15.9 3 12.6 3 9.2 3 6.5 5.1 4.5 7.6 4.5c1.7 0 3.3.9 4.4 2.5 1.1-1.6 2.7-2.5 4.4-2.5 2.5 0 4.6 2 4.6 4.7 0 3.4-2.6 6.7-9 11.3Z"/></svg>',
  star: '<svg class="k-doodle k-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6 14.7 9l6.8.5-5.2 4.4 1.7 6.7L12 17l-6 3.6 1.7-6.7L2.5 9.5 9.3 9Z" stroke-linejoin="round"/></svg>',
  flake: '<svg class="k-doodle k-flake" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M12 6l-2.2-2.2M12 6l2.2-2.2M12 18l-2.2 2.2M12 18l2.2 2.2" fill="none" stroke-linecap="round"/></svg>',
  arrow: '<svg class="k-doodle k-arrow" viewBox="0 0 60 40" aria-hidden="true"><path d="M4 8c16-6 36 0 44 22M48 30l-9-3M48 30l2-10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
/* Snow, the bunny who helps with booking. */
const BUNNY = '<svg class="k-bunny" viewBox="0 0 120 130" aria-hidden="true"><g class="k-bunny-line"><ellipse cx="42" cy="36" rx="13" ry="33" transform="rotate(-9 42 36)"/><ellipse cx="78" cy="36" rx="13" ry="33" transform="rotate(9 78 36)"/><ellipse cx="60" cy="88" rx="45" ry="37"/></g><g class="k-bunny-pink"><ellipse cx="42" cy="38" rx="5.5" ry="20" transform="rotate(-9 42 38)"/><ellipse cx="78" cy="38" rx="5.5" ry="20" transform="rotate(9 78 38)"/><ellipse cx="34" cy="97" rx="8" ry="5.5"/><ellipse cx="86" cy="97" rx="8" ry="5.5"/></g><g class="k-bunny-ink"><circle cx="45" cy="84" r="4.2"/><circle cx="75" cy="84" r="4.2"/><ellipse cx="60" cy="93" rx="3.6" ry="2.6"/></g><path class="k-bunny-smile" d="M60 96v4m-7 2q7 6 14 0" fill="none" stroke-linecap="round"/></svg>';
const CLOUD = '<svg class="k-cloud" viewBox="0 0 640 230" preserveAspectRatio="none" aria-hidden="true"><path d="M86 226a72 72 0 0 1 4-144 96 96 0 0 1 176-34 118 118 0 0 1 208 22 84 84 0 0 1 96 156Z"/></svg>';
const BOWL = '<svg class="k-mini-bowl" viewBox="0 0 28 24" aria-hidden="true"><path class="k-mini-snow" d="M5 12c0-5 4-9 9-9s9 4 9 9Z"/><path class="k-mini-dish" d="M2.5 12h23l-3.4 8.2a3 3 0 0 1-2.8 1.8H8.7a3 3 0 0 1-2.8-1.8Z"/></svg>';
const CUP = '<svg class="k-cup" viewBox="0 0 200 200" aria-hidden="true"><path class="k-cup-body" d="M22 60H178L160 178Q159 188 148 188H52Q41 188 40 178Z"/><path class="k-cup-band" d="M26.6 90H173.4L162.7 160H37.3Z"/><rect class="k-cup-lid" x="12" y="30" width="176" height="32" rx="9"/><rect class="k-cup-seal" x="146" y="40" width="18" height="40" rx="5"/></svg>';
const ICON_OUT = '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_ARROW = '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* ---------- the catering section on the main home page ---------- */

/* A card after the cup bingsu, in the main site's own look. It carries a
   "Coming soon" tag while catering-settings.js → tag says so.
   Styles: build/src/home-catering.css, loaded by the home page only. */
export function homeSection(ctx) {
  const { t, ta, img, site } = ctx;
  const C = site.catering;
  const H = C.home;
  // The middle bowl is the big one.
  const bowls = C.heroItems.map((item, n) => `<span class="hc-bowl hc-bowl-${n + 1}">${img(item.photo, 'card', { alt: ta(item.name + ' bingsu'), sizes: n === 1 ? '(max-width: 859px) 38vw, 230px' : '(max-width: 859px) 30vw, 180px' })}</span>`).join('');
  const tier = item => `<li class="hc-tier"><h3>${t(item.name)}</h3>${item.picks.length ? `<ul class="hc-picks">${item.picks.map(kind => `<li class="hc-pick hc-pick-${kind}">${t(kind === 'classic' ? 'Classic' : 'Special')}</li>`).join('')}</ul>` : ''}${item.addOn ? `<p class="hc-addon">${t(item.addOn)}</p>` : ''}</li>`;
  return `
<section class="home-catering" id="catering" aria-labelledby="home-catering-title">
  <div class="wrap hc-wrap">
    <div class="hc-peek" aria-hidden="true">${BUNNY}</div>
    <div class="hc-panel">
      <div class="hc-copy">
        ${C.tag ? `<p class="hc-flag"><span class="tag tag-soon">${t(C.tag)}</span></p>` : ''}
        <h2 id="home-catering-title">${t(H.title)}</h2>
        ${H.text ? `<p>${t(H.text)}</p>` : ''}
        ${H.link ? `<a class="link" href="/catering">${t('Explore catering')}${ICON_ARROW}</a>` : ''}
      </div>
      ${bowls ? `<div class="hc-bowls">${bowls}</div>` : ''}
      ${C.tiers.length ? `<div class="hc-tiers">
        <p class="hc-tiers-lead"><strong>${t('Three tiers')}</strong><span>${t('Each tier sets how many bingsu go on your event menu. You choose the flavors.')}</span></p>
        <ol class="hc-tier-list">${C.tiers.map(tier).join('')}</ol>
      </div>` : ''}
    </div>
  </div>
</section>`;
}

/* ---------- header and footer (a landing page keeps them short) ---------- */

function header(ctx, here = false) {
  const { t, ta, logo } = ctx;
  return `<a class="skip" href="#main">${t('Skip to content')}</a>
<header class="k-header" data-header>
  <div class="wrap k-header-row">
    <a class="k-brand" href="/" aria-label="${ta('Sweet Snow home')}">${logo('logo-blue', 'Sweet Snow', 'k-brand-logo', '112px')}</a>
    <div class="k-header-actions">
      <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="ko" aria-pressed="false" lang="ko">한국어</button></div>
      <a class="btn btn-primary k-header-book" href="${here ? '' : '/catering'}#book">${t('Book')}</a>
    </div>
  </div>
</header>`;
}

function footer(ctx) {
  const { t, logo, site } = ctx;
  const L = site.SETTINGS.links;
  const handle = L.instagram.replace(/\/$/, '').split('/').pop();
  return `<footer class="k-footer">
  <div class="wrap k-footer-row">
    ${logo('arch-blue', 'Sweet Snow. ' + site.SETTINGS.tagline, 'k-footer-logo', '150px', true)}
    <address>${t(site.brand.venue)}<br>${e(site.brand.street)}, ${e(site.brand.city)}</address>
    <p class="k-footer-links"><a class="link" href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON_OUT}</a><a class="link" href="/">sweetsnow.org</a><a class="link" href="/menu">${t('Our menu')}</a><a class="link" href="/privacy">${t('Privacy')}</a></p>
  </div>
</footer>`;
}

/* ---------- the top of the page: one per design ---------- */

function heroArt(ctx, design) {
  const { t, ta, img, site } = ctx;
  const items = site.catering.heroItems;
  if (!items.length) return '';
  const photo = (item, n, sizes) => img(item.photo, 'card', { alt: ta(item.name + ' bingsu'), sizes, eager: true, cls: 'k-hero-bowl k-hero-bowl-' + n });
  if (design === 'cloud') return `<div class="k-hero-art">
      ${DOODLE.star}${DOODLE.sparkle}${DOODLE.star}
      ${CLOUD}
      <div class="k-hero-bowls">${items.map((item, n) => photo(item, n + 1, '(max-width: 859px) 34vw, 240px')).join('')}</div>
    </div>`;
  if (design === 'diary') return `<div class="k-hero-art">
      ${items.map((item, n) => `<figure class="k-polaroid k-polaroid-${n + 1}">${photo(item, n + 1, '(max-width: 859px) 40vw, 220px')}<figcaption>${t(item.name)}</figcaption></figure>`).join('')}
      ${DOODLE.heart}${DOODLE.star}${DOODLE.sparkle}
      <p class="k-stamp" aria-hidden="true">${t('made fresh!')}</p>
    </div>`;
  return `<div class="k-hero-art">
      <div class="hero-halo k-halo" aria-hidden="true"></div>
      ${DOODLE.sparkle}${DOODLE.heart}${DOODLE.flake}
      ${photo(items[0], 1, '(max-width: 859px) 80vw, 520px')}
      <div class="k-peek" aria-hidden="true">${BUNNY}<p class="k-bubble">${t("Let's plan your party!")}</p></div>
      <p class="k-note" aria-hidden="true">${t('made fresh at your event')}${DOODLE.arrow}</p>
    </div>`;
}

function hero(ctx, design) {
  const { t, site } = ctx;
  const C = site.catering;
  return `<section class="k-hero" aria-labelledby="k-title">
  <div class="wrap k-hero-in">
    <div class="k-hero-copy">
      <p class="kicker">${t(C.title)}${C.tag ? `<span class="tag tag-soon k-soon">${t(C.tag)}</span>` : ''}</p>
      <h1 id="k-title">${t(C.headline)}</h1>
      ${C.text ? `<p class="lead">${t(C.text)}</p>` : ''}
      <p class="k-hero-actions"><a class="btn btn-primary" href="#book">${t('Book an appointment')}</a><a class="link" href="#tiers">${t('See the tiers')}${ICON_ARROW}</a></p>
      ${C.facts.length ? `<ul class="k-facts">${C.facts.map(fact => `<li>${t(fact)}</li>`).join('')}</ul>` : ''}
    </div>
    ${heroArt(ctx, design)}
  </div>
  ${design === 'bunny' ? '<svg class="k-hill" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90V54C190 10 410 4 640 34s410 28 560-8v64Z"/></svg><canvas class="snow" data-snow aria-hidden="true"></canvas>' : ''}
</section>`;
}

/* ---------- how to book, the tiers, the event menu ---------- */

function steps(ctx) {
  const { t } = ctx;
  const list = [
    ['Tell us about your event', 'Chat with Snow or fill in the form. It takes about a minute.'],
    ['We confirm your appointment', 'You hear back from us by email or text.'],
    ['We plan your menu', 'Pick your bingsu together and get your quote.']
  ];
  return `<section class="k-steps" id="how" aria-labelledby="how-title">
  <div class="wrap">
    <h2 id="how-title">${t('How to book')}</h2>
    <ol class="k-step-list">${list.map(([title, text], i) => `<li><span class="k-step-num" aria-hidden="true">${i + 1}</span><h3>${t(title)}</h3><p>${t(text)}</p></li>`).join('')}</ol>
    <p class="k-steps-cta"><a class="btn btn-primary" href="#book">${t('Book an appointment')}</a></p>
  </div>
</section>`;
}

function tiers(ctx) {
  const { t, site } = ctx;
  const C = site.catering;
  if (!C.tiers.length) return '';
  const pick = kind => `<li class="k-pick k-pick-${kind}">${BOWL}<span>${t(kind === 'classic' ? 'Classic' : 'Special')}</span></li>`;
  const card = (tier, index) => `<li class="k-tier k-tier-${index + 1}" id="${tier.id}">
      <p class="k-tier-step">${t('Tier ' + (index + 1))}</p>
      <h3>${t(tier.name)}</h3>
      ${tier.text ? `<p class="k-tier-text">${t(tier.text)}</p>` : ''}
      ${tier.picks.length ? `<ul class="k-picks" aria-label="${t(tier.name)}">${tier.picks.map(pick).join('')}</ul>` : ''}
      ${tier.addOn ? `<p class="k-addon">${t(tier.addOn)}</p>` : ''}
      <p class="k-tier-facts"><span>${t(tier.price || 'Ask for a quote')}</span>${tier.guests ? `<span>${t(tier.guests)}</span>` : ''}</p>
      <a class="btn btn-quiet k-tier-book" href="#book" data-tier="${e(tier.name)}">${t('Book this tier')}</a>
    </li>`;
  return `<section class="k-tiers" id="tiers" aria-labelledby="tiers-title">
  <div class="wrap">
    <div class="k-head">
      <h2 id="tiers-title">${t('Pick your tier')}</h2>
      <p class="lead">${t('Each tier sets how many bingsu go on your event menu. You choose the flavors.')}</p>
    </div>
    <ol class="k-tier-list">
    ${C.tiers.map(card).join('\n    ')}
    </ol>
  </div>
</section>`;
}

function eventMenu(ctx) {
  const { t, ta, img, site } = ctx;
  const C = site.catering;
  const group = (kind, label, lead, items) => (items.length ? `<div class="k-group k-group-${kind}">
      <h3>${BOWL}${t(label)}</h3>
      <p class="k-group-lead">${t(lead)}</p>
      <ul class="k-bowls">${items.map(item => `<li><span class="k-bowl-photo">${img(item.photo, 'card', { alt: ta(item.name + ' bingsu'), sizes: '(max-width: 859px) 40vw, 200px' })}</span><span class="k-bowl-name">${t(item.name)}</span></li>`).join('')}</ul>
    </div>` : '');
  if (!C.menu.classic.length && !C.menu.special.length) return '';
  return `<section class="k-menu" id="menu" aria-labelledby="menu-title">
  <div class="wrap">
    <div class="k-head">
      <h2 id="menu-title">${t('The event menu')}</h2>
      <p class="lead">${t('Made the way we make it at our shop: real milk shaved into soft snow, then fruit, syrups and toppings.')}</p>
    </div>
    ${group('classic', 'Classic', 'The flavors everyone knows.', C.menu.classic)}
    ${group('special', 'Special', 'Our layered, loaded bowls.', C.menu.special)}
  </div>
</section>`;
}

function extras(ctx) {
  const { t, img, site } = ctx;
  const C = site.catering;
  if (!C.taiyaki.show && !C.preMade.show) return '';
  return `<section class="k-extras" aria-labelledby="extras-title">
  <div class="wrap">
    <h2 id="extras-title">${t('On the side')}</h2>
    <ul class="k-extra-list">
      ${C.taiyaki.show ? `<li class="k-extra"><div class="k-extra-art k-extra-taiyaki">${C.taiyaki.items.map(item => img(item.photo, 'card', { alt: '', sizes: '110px' })).join('')}</div><div><h3>${t(C.taiyaki.title)}</h3><p>${t(C.taiyaki.text)}</p></div></li>` : ''}
      ${C.preMade.show ? `<li class="k-extra"><div class="k-extra-art k-extra-cups">${CUP}${CUP}${CUP}</div><div><h3>${t(C.preMade.title)}</h3><p>${t(C.preMade.text)}</p></div></li>` : ''}
    </ul>
  </div>
</section>`;
}

/* ---------- booking: the chat helper and the form ---------- */

function chatLines(ctx) {
  const { t, site } = ctx;
  const C = site.catering;
  const line = (key, text) => (text ? `<p data-k="${key}">${t(text)}</p>` : '');
  const quick = (name, options) => `<ul data-quick="${name}">${options.map(([label, value, go]) => `<li${value ? ` data-value="${e(value)}"` : ''}${go ? ` data-go="${go}"` : ''}>${t(label)}</li>`).join('')}</ul>`;
  const addOnTiers = C.tiers.filter(tier => tier.addOn).map(tier => tier.name);
  const topics = [['Book an appointment', '', 'book'], ['The tiers', '', 'tiers'], ['How it works', '', 'how'], ['Prices', '', 'price'],
    ...(C.taiyaki.show ? [['Taiyaki add-on', '', 'taiyaki']] : []), ...(C.preMade.show ? [['Pre-made cups', '', 'preMade']] : []), ['Ask a question', '', 'question']];
  return `<div hidden data-chat-lines data-addon-tiers="${e(addOnTiers.join('|'))}">
      ${line('greet', 'Hi, I am Snow, the Sweet Snow catering helper.')}
      ${line('offer', 'I can book your appointment or answer a quick question. What would you like?')}
      ${line('more', 'Anything else?')}
      ${line('fallback', 'I am a simple helper, so I did not catch that. Pick one of these and I will help.')}
      ${Object.entries(C.answers).map(([key, text]) => line('a-' + key, text)).join('')}
      ${C.tiers.map((tier, i) => `<p data-k="a-tiers-${i}"><b>${t(tier.name)}</b> ${t(tier.text)}${tier.addOn ? ' ' + t(tier.addOn) + '.' : ''}</p>`).join('')}
      ${line('askEvent', 'Lovely. What are we celebrating?')}
      ${line('askDate', 'When is your event?')}
      ${line('askGuests', 'About how many guests?')}
      ${line('askTier', 'Which tier are you thinking of?')}
      ${line('askAddon', 'Would you like to add mini taiyaki?')}
      ${line('askApptDate', 'Which day works for your appointment?')}
      ${line('askApptTime', 'What time of day is best?')}
      ${line('askName', 'What is your name?')}
      ${line('askContact', 'What is the best phone number or email to reach you?')}
      ${line('askQuestion', 'Sure. What would you like to ask?')}
      ${line('badDate', 'That date has already passed. Could you pick another?')}
      ${line('badGuests', 'A number works best here, like 80.')}
      ${line('badContact', 'That does not look like a phone number or an email. Could you try again?')}
      ${line('badChoice', 'Pick one of the buttons below.')}
      ${line('confirm', 'Here is your request. Shall I send it?')}
      ${line('sending', 'Sending')}
      ${line('sent', 'Sent! We will confirm your appointment by email or text.')}
      ${line('questionSent', 'Got it. We will reply by email or text.')}
      ${line('failed', 'I could not send that. Copy your request and message it to us on Instagram, and we will set up your appointment there.')}
      ${line('copied', 'Copied. Paste it in a message to us on Instagram.')}
      ${[['Event', 'event'], ['Event date', 'date'], ['Guests', 'guests'], ['Tier', 'tier'], ['Taiyaki add-on', 'addon'], ['Appointment', 'appt'], ['Name', 'name'], ['Contact', 'contact'], ['Question', 'question']].map(([label, key]) => line('l-' + key, label)).join('')}
      ${quick('topics', topics)}
      ${quick('events', [...C.events.map(event => [event, event]), ['Something else', 'Other']])}
      ${quick('guests', ['50', '100', '150', '200+'].map(n => [n, n]))}
      ${quick('tiers', [...C.tiers.map(tier => [tier.name, tier.name]), ['Not sure yet', 'Not sure yet']])}
      ${quick('yesno', [['Yes please', 'Yes'], ['No thanks', 'No']])}
      ${quick('times', [...C.appointments.times.map(time => [time, time]), ['Any time', 'Any time']])}
      ${quick('confirm', [['Send it', '', 'send'], ['Start over', '', 'restart']])}
      ${quick('failed', [['Copy my request', '', 'copy'], ['Try again', '', 'send']])}
    </div>`;
}

function book(ctx, design) {
  const { t, ta, site } = ctx;
  const C = site.catering;
  const A = C.appointments;
  const L = site.SETTINGS.links;
  const handle = L.instagram.replace(/\/$/, '').split('/').pop();
  const notes = [A.leadTime, A.serviceArea].filter(Boolean);
  const option = (label, value = label) => `<option value="${e(value)}">${t(label)}</option>`;
  return `<section class="k-book" id="book" aria-labelledby="book-title">
  <div class="wrap k-book-in">
    <div class="k-book-copy">
      <h2 id="book-title">${t(A.title)}</h2>
      ${A.text ? `<p class="lead">${t(A.text)}</p>` : ''}
      ${notes.length ? `<ul class="k-book-notes">${notes.map(note => `<li>${t(note)}</li>`).join('')}</ul>` : ''}
      <p class="k-book-insta">${t('Rather message us?')} <a class="link" href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON_OUT}</a></p>
    </div>
    <div class="k-book-panel" data-appt-panel data-design="${design}">
      <div class="k-chat" data-chat hidden>
        <div class="k-chat-head">${BUNNY}<p><b>Snow</b><span>${t('Catering helper')}</span></p></div>
        <ol class="k-chat-log" role="log" aria-live="polite" aria-label="${ta('Chat with Snow')}" data-chat-log></ol>
        <div class="k-chat-quick" data-chat-quick></div>
        <form class="k-chat-form" data-chat-form autocomplete="off" novalidate>
          <label class="k-sr" for="chat-input">${t('Your message')}</label>
          <input id="chat-input" type="text" maxlength="300" data-chat-input>
          <button class="btn btn-primary" type="submit">${t('Send')}</button>
        </form>
        <p class="k-switch"><button type="button" data-use-form>${t('Use the form instead')}</button></p>
      </div>
      <form class="k-form" id="cateringForm" method="post" action="/api/form" data-catering-form>
        <input type="hidden" name="form-name" value="catering-appointment">
        <input type="hidden" name="source" value="form">
        <input type="hidden" name="design" value="${e(DESIGNS[design].name)}">
        <input type="hidden" name="ad" value="">
        <p hidden><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="k-field"><label for="cf-name">${t('Your name')}</label><input id="cf-name" name="name" type="text" autocomplete="name" maxlength="120" required></div>
        <div class="k-row">
          <div class="k-field"><label for="cf-phone">${t('Phone')}</label><input id="cf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="40" aria-describedby="cf-contact-hint"></div>
          <div class="k-field"><label for="cf-email">${t('Email')}</label><input id="cf-email" name="email" type="email" autocomplete="email" maxlength="160" aria-describedby="cf-contact-hint"></div>
        </div>
        <p class="k-hint" id="cf-contact-hint">${t('Phone or email. One is enough.')}</p>
        <p class="k-error" data-error="contact" hidden>${t('Add a phone number or an email so we can reach you.')}</p>
        <div class="k-row">
          <div class="k-field"><label for="cf-event">${t('Event')}</label><select id="cf-event" name="event">${option('Not sure yet')}${C.events.map(event => option(event)).join('')}${option('Something else', 'Other')}</select></div>
          <div class="k-field"><label for="cf-tier">${t('Tier')}</label><select id="cf-tier" name="tier">${option('Not sure yet')}${C.tiers.map(tier => option(tier.name)).join('')}</select></div>
        </div>
        <div class="k-row">
          <div class="k-field"><label for="cf-date">${t('Event date')}</label><input id="cf-date" name="date" type="date" required></div>
          <div class="k-field"><label for="cf-guests">${t('Number of guests')}</label><input id="cf-guests" name="guests" type="number" inputmode="numeric" min="1" max="5000" required></div>
        </div>
        <div class="k-row">
          <div class="k-field"><label for="cf-appt-date">${t('Appointment day')}</label><input id="cf-appt-date" name="appointment_day" type="date"></div>
          <div class="k-field"><label for="cf-appt-time">${t('Time of day')}</label><select id="cf-appt-time" name="appointment_time">${option('Any time')}${A.times.map(time => option(time)).join('')}</select></div>
        </div>
        ${C.taiyaki.show ? `<label class="k-check"><input type="checkbox" name="taiyaki" value="Yes"><span>${t('Add mini taiyaki (Special tier)')}</span></label>` : ''}
        <div class="k-field"><label for="cf-notes">${t('Anything else we should know?')}</label><textarea id="cf-notes" name="notes" rows="3" maxlength="1500"></textarea></div>
        <button class="btn btn-primary" type="submit" data-send><span data-send-idle>${t('Send request')}</span><span data-send-busy hidden>${t('Sending')}</span></button>
        <p class="k-privacy">${t('We use these details only to reply about your event.')} <a href="/privacy">${t('Privacy')}</a></p>
        <p class="k-switch" data-chat-only hidden><button type="button" data-use-chat>${t('Back to the chat')}</button></p>
      </form>
      <div class="k-done" data-form-sent tabindex="-1" hidden>
        <h3>${t('Request sent')}</h3>
        <p>${t('We will confirm your appointment by email or text.')}</p>
      </div>
      <div class="k-done" data-form-failed tabindex="-1" hidden>
        <h3>${t('Your request was not sent')}</h3>
        <p>${t('The form could not reach us. Copy your request and message it to us on Instagram, and we will set up your appointment there.')}</p>
        <p class="k-done-actions"><button class="btn btn-primary" type="button" data-copy><span data-copy-idle>${t('Copy my request')}</span><span data-copy-done hidden>${t('Copied')}</span></button><a class="btn btn-quiet" href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON_OUT}</a></p>
        <p><button class="k-retry" type="button" data-retry>${t('Back to the form')}</button></p>
      </div>
    </div>
    ${chatLines(ctx)}
  </div>
</section>`;
}

/* ---------- pages ---------- */

/* `sitePage`: the page at /catering once catering is announced. It is a page of the
   website like Menu or Our story, so it carries the website's own menu and footer.
   The design pages (/catering/bunny …) stay landing pages for ads, with the short header. */
function landing(ctx, design, sitePage = false) {
  const { t } = ctx;
  return `${sitePage ? siteHeader(ctx, 'catering') : header(ctx, true)}
<main id="main" class="k-page">
${hero(ctx, design)}
${steps(ctx)}
${tiers(ctx)}
${eventMenu(ctx)}
${extras(ctx)}
${book(ctx, design)}
</main>
${sitePage ? siteFooter(ctx, { orderbar: false }) : footer(ctx)}
<div class="k-bar" data-catering-bar><a class="btn btn-primary" href="#book">${t('Book an appointment')}</a></div>`;
}

export const catering = ctx => landing(ctx, ctx.site.catering.design, ctx.site.catering.announce);

/* Where the form lands when the browser sends it without the page script. */
export function cateringThanks(ctx) {
  const { t } = ctx;
  return `${header(ctx)}
<main id="main" class="text-page wrap">
  <p class="kicker">${t(ctx.site.catering.title)}</p>
  <h1>${t('Request sent')}</h1>
  <p>${t('We will confirm your appointment by email or text.')}</p>
  <p class="text-page-back"><a class="btn btn-primary" href="/catering">${t('Back to catering')}</a></p>
</main>
${footer(ctx)}`;
}

/* For the owner: the three designs side by side, each with the address an ad can point to. */
function designChooser(ctx) {
  const chosen = ctx.site.catering.design;
  return `${header(ctx)}
<main id="main" class="text-page wrap k-chooser">
  <p class="kicker">Sweet Snow Catering</p>
  <h1>Three designs, three addresses</h1>
  <p>Each design is a complete landing page with its own address, so different ads can land on different designs. Every booking email says which design it came from.</p>
  <ul class="k-chooser-list">${Object.entries(DESIGNS).map(([key, design], i) => `<li><a class="k-chooser-card" href="/catering/${key}"><img src="/catering/samples/${key}.jpg" width="390" height="844" alt="" loading="lazy"><b>${i + 1}. ${e(design.name)}</b><span>${e(design.note)}</span><code>sweetsnow.org/catering/${key}</code>${key === chosen ? '<em>Also what sweetsnow.org/catering shows</em>' : ''}</a></li>`).join('')}</ul>
</main>
${footer(ctx)}`;
}

const designTemplates = Object.fromEntries(Object.keys(DESIGNS).map(key => ['cateringDesign_' + key, ctx => landing(ctx, key)]));
export const templates = { catering, cateringThanks, cateringDesigns: designChooser, ...designTemplates };

export function pageSet(site) {
  const C = site.catering;
  const meta = {
    title: 'Sweet Snow Catering | Fresh Korean Bingsu for Your Event',
    ogTitle: 'Sweet Snow Catering | Fresh Korean Bingsu for Your Event',
    description: 'Korean bingsu made fresh at your event, the way Sweet Snow makes it in Garden Grove. See the tiers and the event menu, and book an appointment in a minute.'
  };
  const pages = {
    catering: { file: 'catering/index.html', path: '/catering', bodyClass: `page-catering d-${C.design}`, design: C.design, crumb: 'Catering', own: true, noMenuSchema: true, robots: C.announce ? '' : 'noindex', ...meta },
    cateringThanks: { file: 'catering/thanks.html', path: '/catering/thanks', bodyClass: 'page-text page-catering', simple: true, own: true, plain: true, title: 'Request sent — Sweet Snow Catering', robots: 'noindex' }
  };
  // Each design at its own address. They are the same page in different clothes, so search engines are
  // pointed at /catering alone (`path` is what the page names as its canonical address).
  for (const key of Object.keys(DESIGNS)) pages['cateringDesign_' + key] = { file: `catering/${key}.html`, path: '/catering', bodyClass: `page-catering d-${key}`, design: key, own: true, noMenuSchema: true, robots: 'noindex', ...meta };
  pages.cateringDesigns = { file: 'catering/designs.html', path: '/catering/designs', bodyClass: 'page-text page-catering', simple: true, own: true, plain: true, title: 'Three designs — Sweet Snow Catering', robots: 'noindex' };
  return pages;
}
