/* SWEET SNOW CATERING — the catering page, its thank-you page and the
   frozen shaped milk flyer. Everything they show comes from
   catering/catering-settings.js and the menu, so a menu change (name,
   photo, hidden item) carries over by itself. */
import fs from 'node:fs';
import path from 'node:path';
import { runBrowserFile, nearest, slug } from './data.mjs';
import { e, ICON, header, footer } from './pages.mjs';

export const SETTINGS_FILE = 'catering/catering-settings.js';
export const FLYER_FILE = 'catering/frozen-milk-flyer.html';
export const FLYER_STAMP = 'catering/frozen-milk-flyer.json';   // which flyer page the saved picture and PDF were made from
const FLYER_PATH = '/catering/frozen-milk-flyer';
const FLYER_IMAGE = '/catering/frozen-milk-flyer.png';

/* ---------- settings ---------- */

export function loadCatering(root, site) {
  const file = path.join(root, SETTINGS_FILE);
  if (!fs.existsSync(file)) return null;                     // no catering folder, no catering pages
  const S = runBrowserFile(file).CATERING_SETTINGS;
  if (!S) throw new Error('catering-settings.js did not define window.CATERING_SETTINGS');
  const warn = text => site.warnings.push('catering-settings.js → ' + text);
  const text = value => String(value ?? '').trim();

  // Mini taiyaki are named by their filling on the menu ("Red Bean"); here they carry the full name.
  const full = item => (item.kind === 'hot' ? item.name + ' Mini Taiyaki' : item.name);
  const short = item => item.name.replace(/ (Croffle|Cup)$/, '');
  const menu = [...site.groups.classic, ...site.groups.special, ...site.groups['half-half'], ...site.cups, ...site.taiyaki, ...site.croffles];
  const find = (name, where) => {
    const item = menu.find(i => full(i) === name) || menu.find(i => i.name === name);
    if (item) return { ...item, full: full(item), short: short(item) };
    const close = nearest(name, menu.map(full));
    warn(`${where}: no menu item is called "${name}".${close ? ` Did you mean "${close}"?` : ''}`);
    return null;
  };
  const pick = (names, where) => (Array.isArray(names) ? names : []).map(name => find(text(name), where)).filter(Boolean);

  const ids = new Set();
  const tiers = (Array.isArray(S.tiers) ? S.tiers : []).map((tier, index) => {
    const name = text(tier.name) || `Tier ${index + 1}`;
    let id = 'tier-' + (slug(name) || index + 1);
    while (ids.has(id)) id += '-' + (index + 1);
    ids.add(id);
    return {
      id, name, text: text(tier.text), price: text(tier.price), guests: text(tier.guests),
      items: pick(tier.items, `tiers → "${name}"`), extras: (Array.isArray(tier.extras) ? tier.extras : []).map(text).filter(Boolean)
    };
  });
  if (!tiers.length) warn('tiers: there are no tiers yet, so the page shows only the appointment form.');

  const F = S.frozenMilk || {};
  const shapes = (Array.isArray(F.shapes) ? F.shapes : []).map(entry => {
    const key = text(entry.shape).toLowerCase() || 'round';
    const photo = text(entry.photo);
    if (photo && !fs.existsSync(path.join(root, photo))) warn(`frozenMilk: the photo "${photo}" was not found. Upload it, or remove the photo line to use the drawing.`);
    if (!photo && !SHAPES[key]) warn(`frozenMilk: there is no drawing called "${entry.shape}". Showing "round". Drawings: ${Object.keys(SHAPES).join(', ')}.`);
    return { name: text(entry.name), shape: SHAPES[key] ? key : 'round', photo: photo && (photo.startsWith('/') ? photo : '/' + photo) };
  });

  const A = S.appointments || {};
  const link = text(A.bookingLink);
  const linkOk = /^https:\/\//.test(link);
  if (link && !linkOk) warn(`appointments → bookingLink: "${link}" should start with https://. The "Pick a time" button is hidden until it does.`);
  return {
    announce: S.announce === true,
    title: text(S.title) || 'Sweet Snow Catering', label: text(S.label), text: text(S.text),
    heroItems: pick(S.heroItems, 'heroItems').slice(0, 3),
    buildUp: S.buildUp !== false, tiers,
    appointments: {
      title: text(A.title) || 'Book an appointment', text: text(A.text),
      bookingLink: linkOk ? link : '', form: A.form === true, leadTime: text(A.leadTime), serviceArea: text(A.serviceArea)
    },
    frozenMilk: { show: F.show !== false && shapes.length > 0, title: text(F.title) || 'Frozen Shaped Milk Collection', text: text(F.text), note: text(F.note), shapes },
    website: text(S.website) || 'sweetsnow.org', flyerLine: text(S.flyerLine)
  };
}

/* ---------- frozen shaped milk: the drawings ----------
   Each shape is drawn on a 200 × 200 board. `body` is the milk; `detail`
   is pressed into it (eyes, a nose). The frosty light and shade come from
   one shared filter, so every shape looks moulded from the same milk. */

const ring = (count, radius, cx, cy, make, turn = -Math.PI / 2) => Array.from({ length: count }, (_, k) => {
  const a = turn + k * 2 * Math.PI / count;
  return make(cx + radius * Math.cos(a), cy + radius * Math.sin(a), a);
}).join('');
const n = value => Number(value.toFixed(1));
const starPath = 'M' + Array.from({ length: 10 }, (_, k) => {
  const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 38 : 80;
  return `${n(100 + r * Math.cos(a))} ${n(106 + r * Math.sin(a))}`;
}).join('L') + 'Z';
const flakeArms = ring(6, 74, 100, 100, (x, y, a) => {
  const bx = 100 + 46 * Math.cos(a), by = 100 + 46 * Math.sin(a);
  const twig = turn => `<path d="M${n(bx)} ${n(by)}L${n(bx + 25 * Math.cos(a + turn))} ${n(by + 25 * Math.sin(a + turn))}" stroke-width="14"/>`;
  return `<path d="M100 100L${n(x)} ${n(y)}" stroke-width="19"/>${twig(0.95)}${twig(-0.95)}`;
});

const SHAPES = {
  bunny: {
    body: '<ellipse cx="74" cy="58" rx="19" ry="47" transform="rotate(-9 74 58)"/><ellipse cx="126" cy="58" rx="19" ry="47" transform="rotate(9 126 58)"/><ellipse cx="100" cy="130" rx="61" ry="52"/>',
    detail: '<circle cx="79" cy="124" r="5.5"/><circle cx="121" cy="124" r="5.5"/><ellipse cx="100" cy="140" rx="6.5" ry="4.5"/>'
  },
  bear: {
    body: '<circle cx="50" cy="60" r="27"/><circle cx="150" cy="60" r="27"/><circle cx="100" cy="112" r="66"/>',
    detail: '<circle cx="77" cy="100" r="5.5"/><circle cx="123" cy="100" r="5.5"/><ellipse cx="100" cy="122" rx="8.5" ry="6"/><path d="M100 128v9m-11 4q11 9 22 0" fill="none" stroke="#9DBEDB" stroke-width="3.6" stroke-linecap="round"/>'
  },
  heart: { body: '<path d="M100 176C42 134 20 100 20 70c0-26 20-44 43-44 16 0 29 8 37 22 8-14 21-22 37-22 23 0 43 18 43 44 0 30-22 64-80 106Z"/>' },
  star: { body: `<path d="${starPath}" stroke="url(#ice-fill)" stroke-width="18" stroke-linejoin="round"/>` },
  snowflake: { body: `<g fill="none" stroke="url(#ice-fill)" stroke-linecap="round">${flakeArms}</g><circle cx="100" cy="100" r="23"/>` },
  fish: {
    body: '<path d="M138 100 181 62Q170 100 181 138Z" stroke="url(#ice-fill)" stroke-width="14" stroke-linejoin="round"/><path d="M66 64Q94 30 120 62Z" stroke="url(#ice-fill)" stroke-width="10" stroke-linejoin="round"/><ellipse cx="88" cy="102" rx="66" ry="45"/>',
    detail: '<circle cx="50" cy="92" r="5.5"/><path d="M72 76q13 26 0 52M98 84q9 10 0 20m20-16q8 8 0 16m-20 6q9 10 0 20" fill="none" stroke="#9DBEDB" stroke-width="3.6" stroke-linecap="round"/>'
  },
  flower: {
    body: ring(5, 44, 100, 102, (x, y) => `<circle cx="${n(x)}" cy="${n(y)}" r="33"/>`) + '<circle cx="100" cy="102" r="34"/>',
    detail: '<circle cx="100" cy="102" r="15"/>'
  },
  cloud: { body: '<circle cx="64" cy="112" r="36"/><circle cx="104" cy="88" r="44"/><circle cx="142" cy="116" r="32"/><rect x="34" y="106" width="136" height="48" rx="24"/>' },
  round: { body: '<circle cx="100" cy="100" r="74"/>' }
};

/* One per page, placed once before the first shape. */
export const ICE_DEFS = `<svg class="ice-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
<linearGradient id="ice-fill" gradientUnits="userSpaceOnUse" x1="0" y1="14" x2="0" y2="190"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F7FBFE"/><stop offset="1" stop-color="#DFEBF5"/></linearGradient>
<filter id="ice-puff" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
<feComponentTransfer in="SourceAlpha" result="outside"><feFuncA type="table" tableValues="1 0"/></feComponentTransfer>
<feGaussianBlur in="outside" stdDeviation="7" result="soft"/>
<feOffset in="soft" dx="-5" dy="-9" result="low"/>
<feFlood flood-color="#6C9CC6" flood-opacity=".5"/><feComposite in2="low" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="shade"/>
<feOffset in="soft" dx="5" dy="7" result="high"/>
<feFlood flood-color="#FFFFFF" flood-opacity=".95"/><feComposite in2="high" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="light"/>
<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="shade"/><feMergeNode in="light"/></feMerge>
</filter></defs></svg>`;

function shapeArt(entry, cls = 'ice') {
  // The name is printed right under each shape, so the picture itself stays silent for screen readers.
  if (entry.photo) return `<img class="${cls} ${cls}-photo" src="${e(entry.photo)}" alt="" decoding="async">`;
  const art = SHAPES[entry.shape];
  return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><g fill="url(#ice-fill)" filter="url(#ice-puff)">${art.body}</g>${art.detail ? `<g fill="#9DBEDB">${art.detail}</g>` : ''}</svg>`;
}

/* ---------- the tier list ---------- */

/* Label colours deepen tier by tier: pale snow, the logo's blue, then the deep button blue.
   Every pairing keeps the text readable (4.5:1 or better). */
function tone(index, count) {
  if (count > 1 && index === count - 1) return { bg: '#245F92', ink: '#FFFFFF' };
  const k = count <= 2 ? 0 : index / (count - 2);
  const mix = (a, b) => '#' + [1, 3, 5].map(o => Math.round(parseInt(a.slice(o, o + 2), 16) * (1 - k) + parseInt(b.slice(o, o + 2), 16) * k).toString(16).padStart(2, '0')).join('');
  return { bg: mix('#E3EEF7', '#70ADD9'), ink: '#16324A' };
}

const KINDS = [['cup', 'Cup Bingsu'], ['hot', 'Mini Taiyaki'], ['croffle', 'Premium Croffles'], ['bingsu', 'Bingsu']];

function tierList(ctx) {
  const { t, ta, img, site } = ctx;
  const C = site.catering;
  if (!C.tiers.length) return '';
  const row = (tier, index) => {
    const { bg, ink } = tone(index, C.tiers.length);
    const groups = KINDS.map(([kind, label]) => [label, tier.items.filter(item => item.kind === kind)]).filter(([, list]) => list.length);
    return `<li class="tier" id="${tier.id}" style="--tier-bg:${bg};--tier-ink:${ink}">
      <div class="tier-label">
        <p class="tier-step">${t('Tier ' + (index + 1))}</p>
        <h3 class="tier-name">${t(tier.name)}</h3>
        ${tier.text ? `<p class="tier-text">${t(tier.text)}</p>` : ''}
        <p class="tier-facts"><span>${t(tier.price || 'Ask for a quote')}</span>${tier.guests ? `<span>${t(tier.guests)}</span>` : ''}</p>
        <a class="tier-pick" href="#appointment" data-tier="${e(tier.name)}">${t(C.appointments.form ? 'Request this tier' : 'Book this tier')}${ICON.arrow}</a>
      </div>
      <div class="tier-body">
        ${C.buildUp && index > 0 ? `<p class="tier-plus">${t('Everything in the tier above, plus')}</p>` : ''}
        ${groups.map(([label, list]) => `<div class="tier-group"><h4>${t(label)}</h4><ul class="tier-items${label === 'Premium Croffles' ? ' tier-items-wide' : ''}">${list.map(item => `<li>${img(item.photo, 'card', { alt: ta(item.full), sizes: '96px' })}<span>${t(item.short)}</span></li>`).join('')}</ul></div>`).join('\n        ')}
        ${tier.extras.length ? `<ul class="tier-extras">${tier.extras.map(extra => `<li>${t(extra)}</li>`).join('')}</ul>` : ''}
      </div>
    </li>`;
  };
  const rows = C.tiers.map(row).join('\n    ');
  // Korean: a short name ("Mango Jelly") borrows the owner's wording for the full menu name
  // ("Mango Jelly Cup") when no other item on this page shares that short name.
  const items = C.tiers.flatMap(tier => tier.items);
  for (const item of items) {
    const alone = items.every(other => other.short !== item.short || other.full === item.full);
    if (alone && ctx.ko[item.full] && !ctx.ko[item.short]) ctx.ko[item.short] = ctx.ko[item.full];
  }
  return `<section class="tiers" id="tiers" aria-labelledby="tiers-title">
  <div class="wrap">
    <div class="tiers-head">
      <h2 id="tiers-title">${t('Catering tiers')}</h2>
      <p class="lead">${t('Every tier is built from our menu. Pick the one that fits your event, and we will shape the details together.')}</p>
    </div>
    <ol class="tier-list">
    ${rows}
    </ol>
  </div>
</section>`;
}

/* ---------- the page ---------- */

function hero(ctx) {
  const { t, ta, img, site } = ctx;
  const C = site.catering;
  return `<section class="cat-hero" aria-labelledby="cat-title">
  <div class="wrap cat-hero-inner">
    <div class="cat-hero-copy">
      ${C.label ? `<p class="kicker">${t(C.label)}</p>` : ''}
      <h1 id="cat-title">${t(C.title)}</h1>
      ${C.text ? `<p class="lead">${t(C.text)}</p>` : ''}
      <p class="cat-hero-actions"><a class="btn btn-primary" href="#appointment">${t(C.appointments.form ? 'Request an appointment' : 'Book an appointment')}</a>${C.tiers.length ? `<a class="link" href="#tiers">${t('See the tiers')}${ICON.arrow}</a>` : ''}</p>
    </div>
    ${C.heroItems.length ? `<div class="cat-hero-stage">
      <div class="cat-halo" aria-hidden="true"></div>
      ${C.heroItems.map((item, i) => img(item.photo, 'card', { alt: ta(item.full), sizes: '(max-width: 859px) 30vw, 220px', eager: true, cls: 'cat-hero-photo cat-hero-photo-' + (i + 1) })).join('\n      ')}
    </div>` : ''}
  </div>
</section>`;
}

function frozenMilk(ctx) {
  const { t, site } = ctx;
  const F = site.catering.frozenMilk;
  if (!F.show) return '';
  return `<section class="frozen" id="frozen-milk" aria-labelledby="frozen-title">
  <div class="wrap">
    <div class="frozen-head">
      <h2 id="frozen-title">${t(F.title)}</h2>
      ${F.text ? `<p class="lead">${t(F.text)}</p>` : ''}
    </div>
    ${ICE_DEFS}
    <ul class="frozen-shapes">${F.shapes.map(entry => `<li>${shapeArt(entry)}<span>${t(entry.name)}</span></li>`).join('')}</ul>
    ${F.note ? `<p class="frozen-note">${t(F.note)}</p>` : ''}
    <p class="frozen-links"><a class="btn btn-quiet" href="${FLYER_PATH}">${t('Open the flyer')}</a><a class="link" href="${FLYER_IMAGE}" download="sweet-snow-frozen-shaped-milk.png">${t('Download the flyer')}</a></p>
  </div>
</section>`;
}

function appointment(ctx) {
  const { t, site } = ctx;
  const C = site.catering;
  const A = C.appointments;
  const L = site.SETTINGS.links;
  const handle = L.instagram.replace(/\/$/, '').split('/').pop();
  // Three ways to book, chosen in catering-settings.js: a request form, a booking calendar, or (until the calendar link is in) a message.
  const tell = ['Tell us about your event', 'Your event date, guest count and the tier you like.'];
  const plan = ['We plan it together', 'Flavors, timing and your quote.'];
  const steps = A.form ? [['Send your request', tell[1]], ['We reach out', 'We contact you to set up your appointment.'], plan]
    : A.bookingLink ? [['Pick a time', 'Choose an open time on our booking calendar.'], tell, plan]
    : [['Message us', 'Send us a message on Instagram.'], tell, plan];
  const notes = [A.leadTime, A.serviceArea].filter(Boolean);
  const book = A.bookingLink
    ? `<div class="appt-done">
        <h3>${t('Pick a time for your appointment')}</h3>
        <p>${t('Our booking calendar shows the open times. Choose one, and add your event date, guest count and the tier you like.')}</p>
        <p class="appt-done-actions"><a class="btn btn-primary" href="${e(A.bookingLink)}" target="_blank" rel="noopener noreferrer">${t('Pick a time')}${ICON.out}</a></p>
      </div>`
    : `<div class="appt-done">
        <h3>${t('Message us to book')}</h3>
        <p>${t('Send us a message on Instagram with your event date, guest count and the tier you like. We will set up your appointment there.')}</p>
        <p class="appt-done-actions"><a class="btn btn-primary" href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON.out}</a></p>
      </div>`;
  return `<section class="appt" id="appointment" aria-labelledby="appt-title">
  <div class="wrap appt-inner">
    <div class="appt-copy">
      <h2 id="appt-title">${t(A.title)}</h2>
      ${A.text ? `<p class="lead">${t(A.text)}</p>` : ''}
      <ol class="appt-steps">${steps.map(([title, text], i) => `<li><span class="appt-num" aria-hidden="true">${i + 1}</span><div><h3>${t(title)}</h3><p>${t(text)}</p></div></li>`).join('')}</ol>
      ${notes.length ? `<ul class="appt-notes">${notes.map(note => `<li>${t(note)}</li>`).join('')}</ul>` : ''}
      ${A.form && A.bookingLink ? `<p><a class="btn btn-quiet" href="${e(A.bookingLink)}" target="_blank" rel="noopener noreferrer">${t('Pick a time')}${ICON.out}</a></p>` : ''}
    </div>
    <div class="appt-panel" data-appt-panel>
      ${!A.form ? book : `<form class="appt-form" id="cateringForm" method="post" action="/api/form" data-catering-form>
        <input type="hidden" name="form-name" value="catering-appointment">
        <p hidden><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="field"><label for="cf-name">${t('Your name')}</label><input id="cf-name" name="name" type="text" autocomplete="name" maxlength="120" required></div>
        <div class="appt-row">
          <div class="field"><label for="cf-phone">${t('Phone')}</label><input id="cf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="40" aria-describedby="cf-contact-hint"></div>
          <div class="field"><label for="cf-email">${t('Email')}</label><input id="cf-email" name="email" type="email" autocomplete="email" maxlength="160" aria-describedby="cf-contact-hint"></div>
        </div>
        <p class="appt-hint" id="cf-contact-hint">${t('Phone or email. One is enough.')}</p>
        <p class="appt-error" data-error="contact" hidden>${t('Add a phone number or an email so we can reach you.')}</p>
        <div class="appt-row">
          <div class="field"><label for="cf-date">${t('Event date')}</label><input id="cf-date" name="date" type="date" required></div>
          <div class="field"><label for="cf-guests">${t('Number of guests')}</label><input id="cf-guests" name="guests" type="number" inputmode="numeric" min="1" max="5000" required></div>
        </div>
        <div class="appt-row">
          <div class="field"><label for="cf-tier">${t('Tier')}</label><select id="cf-tier" name="tier"><option value="Not sure yet">${t('Not sure yet')}</option>${C.tiers.map(tier => `<option value="${e(tier.name)}">${t(tier.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="cf-location">${t('City or venue')}</label><input id="cf-location" name="location" type="text" autocomplete="off" maxlength="160"></div>
        </div>
        <div class="field"><label for="cf-notes">${t('Anything else we should know?')}</label><textarea id="cf-notes" name="notes" rows="4" maxlength="1500"></textarea></div>
        <button class="btn btn-primary" type="submit" data-send><span data-send-idle>${t('Send request')}</span><span data-send-busy hidden>${t('Sending')}</span></button>
        <p class="appt-privacy">${t('We use these details only to reply about your event.')} <a href="/privacy">${t('Privacy')}</a></p>
      </form>
      <div class="appt-done" data-form-sent tabindex="-1" hidden>
        <h3>${t('Request sent')}</h3>
        <p>${t('We have your details and will reach out to set up your appointment.')}</p>
        <p><a class="link" href="/menu">${t('Explore the menu')}${ICON.arrow}</a></p>
      </div>
      <div class="appt-done" data-form-failed tabindex="-1" hidden>
        <h3>${t('Your request was not sent')}</h3>
        <p>${t('The form could not reach us. Copy your request and message it to us on Instagram, and we will set up your appointment there.')}</p>
        <p class="appt-done-actions"><button class="btn btn-primary" type="button" data-copy><span data-copy-idle>${t('Copy my request')}</span><span data-copy-done hidden>${t('Copied')}</span></button><a class="btn btn-quiet" href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON.out}</a></p>
        <p><button class="appt-retry" type="button" data-retry>${t('Back to the form')}</button></p>
      </div>`}
    </div>
  </div>
</section>`;
}

export function catering(ctx) {
  const { t } = ctx;
  // The floating bar on phones leads to the form here, not to ordering.
  const bar = `<div class="orderbar" data-orderbar data-catering-bar>
  <a class="orderbar-main" href="#appointment"><span>${t(ctx.site.catering.appointments.form ? 'Request an appointment' : 'Book an appointment')}</span></a>
  ${ctx.site.catering.tiers.length ? `<a class="orderbar-side" href="#tiers"><span>${t('Tiers')}</span></a>` : ''}
</div>`;
  return `${header(ctx, 'catering')}
<main id="main" class="catering-page">
${hero(ctx)}
${tierList(ctx)}
${frozenMilk(ctx)}
${appointment(ctx)}
</main>
${footer(ctx, bar)}`;
}

/* Where the form lands when the browser sends it without the page script. */
export function cateringThanks(ctx) {
  const { t } = ctx;
  return `${header(ctx, 'catering')}
<main id="main" class="text-page wrap">
  <p class="kicker">${t(ctx.site.catering.title)}</p>
  <h1>${t('Request sent')}</h1>
  <p>${t('We have your details and will reach out to set up your appointment.')}</p>
  <p class="text-page-back"><a class="btn btn-primary" href="/catering">${t('Back to catering')}</a></p>
</main>
${footer(ctx)}`;
}

export const templates = { catering, cateringThanks };

export function pageSet(site) {
  const C = site.catering;
  return {
    catering: {
      file: 'catering/index.html', path: '/catering', bodyClass: 'page-catering', crumb: 'Catering', own: true, noMenuSchema: true,
      robots: C.announce ? '' : 'noindex',
      title: 'Sweet Snow Catering | Korean Bingsu for Your Event',
      ogTitle: 'Sweet Snow Catering | Korean Bingsu for Your Event',
      description: 'Korean bingsu catering from Sweet Snow in Garden Grove. See the catering tiers built from our menu and request an appointment for your event.'
    },
    cateringThanks: { file: 'catering/thanks.html', path: '/catering/thanks', bodyClass: 'page-text', simple: true, own: true, title: 'Request sent — Sweet Snow Catering', robots: 'noindex' }
  };
}

/* ---------- the flyer ---------- */

/* A little still snow, the same idea as the share picture. Seeded, so every build draws the same flakes. */
function stillSnow() {
  let seed = 11;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 64 }, () => {
    const far = random() < 0.5;
    const size = far ? 5 + random() * 6 : 7 + random() * 11;
    const left = random() * 100, top = random() * 100;
    // none over the title, the shape names or the address card
    if (top > 79 || (top > 13 && top < 37 && left > 12 && left < 88) || (top > 53 && top < 58) || (top > 74 && top < 79)) return '';
    return `<i${far ? ' class="far"' : ''} style="left:${n(left)}%;top:${n(top)}%;--s:${n(size)}"></i>`;
  }).join('');
}

export function flyer(ctx, css) {
  const { site } = ctx;
  const C = site.catering;
  const F = C.frozenMilk;
  const handle = site.SETTINGS.links.instagram.replace(/\/$/, '').split('/').pop();
  const address = C.website + '/catering';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(F.title)} — Sweet Snow Catering</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#F7FBFE">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-sweetsnow-20261110.png">
<style>${css}</style>
</head>
<body>
<main class="sheet" data-sheet>
  <div class="f-snow" aria-hidden="true">${stillSnow()}</div>
  <img class="f-logo" src="/catering/flyer-logo.webp" width="771" height="319" alt="Sweet Snow">
  <h1 class="f-title">${e(F.title)}</h1>
  ${F.text ? `<p class="f-sub">${e(F.text)}</p>` : ''}
  ${ICE_DEFS}
  <ul class="f-shapes f-count-${F.shapes.length}">${F.shapes.map(entry => `<li>${shapeArt(entry, 'f-ice')}<span>${e(entry.name)}</span></li>`).join('')}</ul>
  ${F.note ? `<p class="f-note">${e(F.note)}</p>` : ''}
  <footer class="f-foot">
    <div>
      ${C.flyerLine ? `<p class="f-line">${e(C.flyerLine)}</p>` : ''}
      <p class="f-url">${e(address)}</p>
      <p class="f-where">${e(site.brand.venue)}, ${e(site.brand.city.replace(/,.*$/, ''))}<br>Instagram @${e(handle)}</p>
    </div>
    <img class="f-qr" src="/catering/qr-catering.svg" width="200" height="200" alt="QR code for ${e(address)}">
  </footer>
</main>
<nav class="f-tools" aria-label="Flyer">
  <button type="button" onclick="print()">Print</button>
  <a href="${FLYER_IMAGE}" download="sweet-snow-frozen-shaped-milk.png">Download image</a>
  <a href="/catering">Back to catering</a>
</nav>
</body>
</html>
`;
}
