/* SWEET SNOW CATERING — the catering site: one page and its thank-you page.

   Catering has its own design, separate from the main website: its own
   header and footer, typefaces (Lilita One, Outfit), colours and motion.
   What it sells is pre-made bingsu from the menu in a sealable paper cup
   with a label for each flavor, so the cup and its label carry the design.

   Everything shown comes from catering/catering-settings.js and the menu:
   a menu change (name, photo, hidden item) carries over by itself. */
import fs from 'node:fs';
import path from 'node:path';
import { runBrowserFile, nearest, slug } from './data.mjs';
import { e } from './pages.mjs';

export const SETTINGS_FILE = 'catering/catering-settings.js';
export const THEME_COLOR = '#17223F';
export const FONT_PRELOADS = ['lilita.woff2', 'outfit.woff2'].map(file => `<link rel="preload" as="font" type="font/woff2" href="/assets/site/fonts/${file}" crossorigin>`);

/* ---------- colours ---------- */

const NAVY = '#17223F';
const SPARE_LABELS = ['#5AA9E6', '#B58CF0', '#3CC5A8', '#FFB81C', '#FF5A6E', '#7DB548'];   // for a flavor with no colour in the settings
const luminance = colour => {
  const [r, g, b] = [1, 3, 5].map(at => parseInt(colour.slice(at, at + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
/* The words on a label are navy or white, whichever reads better on that label. */
const inkOn = colour => (contrast(colour, NAVY) >= contrast(colour, '#FFFFFF') ? NAVY : '#FFFFFF');

/* ---------- settings ---------- */

export function loadCatering(root, site) {
  const file = path.join(root, SETTINGS_FILE);
  if (!fs.existsSync(file)) return null;                     // no catering folder, no catering pages
  const S = runBrowserFile(file).CATERING_SETTINGS;
  if (!S) throw new Error('catering-settings.js did not define window.CATERING_SETTINGS');
  const warn = text => site.warnings.push('catering-settings.js → ' + text);
  const text = value => String(value ?? '').trim();
  const list = value => (Array.isArray(value) ? value : []);

  const menu = [...site.cups, ...site.groups.classic, ...site.groups.special, ...site.groups['half-half'], ...site.taiyaki, ...site.croffles];
  const full = item => (item.kind === 'hot' ? item.name + ' Mini Taiyaki' : item.name);
  const labels = S.labels && typeof S.labels === 'object' ? S.labels : {};
  for (const name of Object.keys(labels)) {
    if (!menu.some(item => full(item) === name)) { const close = nearest(name, menu.map(full)); warn(`labels: no menu item is called "${name}".${close ? ` Did you mean "${close}"?` : ''}`); }
  }
  const flavors = [];                                        // every flavor on the site, once, in tier order
  const find = (name, where) => {
    const known = flavors.find(flavor => flavor.full === name);
    if (known) return known;
    const item = menu.find(i => full(i) === name) || menu.find(i => i.name === name);
    if (!item) {
      const close = nearest(name, menu.map(full));
      warn(`${where}: no menu item is called "${name}".${close ? ` Did you mean "${close}"?` : ''}`);
      return null;
    }
    let colour = text(labels[full(item)]);
    if (colour && !/^#[0-9a-f]{6}$/i.test(colour)) { warn(`labels: "${colour}" for "${full(item)}" is not a colour like "#FFB81C". Using a spare colour.`); colour = ''; }
    colour = (colour || SPARE_LABELS[flavors.length % SPARE_LABELS.length]).toUpperCase();
    const flavor = {
      ...item, full: full(item), short: item.name.replace(/ (Croffle|Cup)$/, ''), key: slug(full(item)),
      colour, ink: inkOn(colour), parts: item.ing.split(item.kind === 'croffle' ? /,\s*/ : /\s*·\s*/).map(part => part.trim()).filter(Boolean)
    };
    flavors.push(flavor);
    return flavor;
  };

  const ids = new Set();
  let running = 0;
  const buildUp = S.buildUp !== false;
  const tiers = list(S.tiers).map((tier, index) => {
    const name = text(tier.name) || `Tier ${index + 1}`;
    let id = 'tier-' + (slug(name) || index + 1);
    while (ids.has(id)) id += '-' + (index + 1);
    ids.add(id);
    const items = [...new Set(list(tier.items).map(item => find(text(item), `tiers → "${name}"`)).filter(Boolean))];
    running = buildUp ? running + items.length : items.length;
    return { id, name, text: text(tier.text), price: text(tier.price), guests: text(tier.guests), items, count: running };
  });
  if (!tiers.length) warn('tiers: there are no tiers yet, so the site has no flavors to show.');

  const A = S.appointments || {};
  const link = text(A.bookingLink);
  const linkOk = /^https:\/\//.test(link);
  if (link && !linkOk) warn(`appointments → bookingLink: "${link}" should start with https://. The "Pick a time" button is hidden until it does.`);
  return {
    announce: S.announce === true,
    title: text(S.title) || 'Sweet Snow Catering', headline: text(S.headline) || text(S.title) || 'Sweet Snow Catering', text: text(S.text), sticker: text(S.sticker),
    points: list(S.points).map(point => list(point).map(text)).filter(point => point[0]),
    facts: list(S.facts).map(text).filter(Boolean),
    flavors, buildUp, tiers,
    events: list(S.events).map(text).filter(Boolean),
    appointments: {
      title: text(A.title) || 'Book an appointment', text: text(A.text),
      bookingLink: linkOk ? link : '', form: A.form === true, leadTime: text(A.leadTime), serviceArea: text(A.serviceArea)
    }
  };
}

/* ---------- the cup ----------
   One drawing, used at every size: a squat paper ice cream cup, a lid that seals, a seal tab,
   and a label band in the flavor's colour. The words on the label are real
   text laid over the band, so they wrap, translate and stay readable. */

const CUP_ART = `<svg class="c-cup-art" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><path class="c-cup-body" d="M22 60H178L160 178Q159 188 148 188H52Q41 188 40 178Z"/><path class="c-cup-shade" d="M148 60H178L160 178Q159 188 148 188H130Z"/><path class="c-cup-band" d="M26.6 90H173.4L162.7 160H37.3Z"/><g class="c-cup-lid"><rect x="12" y="30" width="176" height="32" rx="9"/><path d="M24 49H176"/></g><rect class="c-cup-seal" x="146" y="40" width="18" height="40" rx="5"/></svg>`;

const cupStyle = (flavor, index) => `--label:${flavor.colour};--label-ink:${flavor.ink};--i:${index}`;
const labelClass = flavor => 'c-cup-label' + (flavor.short.length > 18 ? ' is-long' : '');     // long names are set a little smaller
/* `quiet` is for a cup whose name is also written beside it: screen readers then hear the name once. */
const cup = (flavor, words, index = 0, quiet = false) => `<span class="c-cup" style="${cupStyle(flavor, index)}">${CUP_ART}<span class="${labelClass(flavor)}"${quiet ? ' aria-hidden="true"' : ''}>${words}</span></span>`;

const ICON_OUT = '<svg class="c-ico" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const bookWords = C => (C.appointments.form ? 'Request an appointment' : 'Book an appointment');

/* ---------- header and footer ---------- */

function header(ctx) {
  const { t, ta, logo, site } = ctx;
  const C = site.catering;
  return `<a class="c-skip" href="#main">${t('Skip to content')}</a>
<header class="c-header" data-header>
  <div class="c-wrap c-header-row">
    <a class="c-brand" href="/catering" aria-label="${ta(C.title)}">${logo('logo-white', '', 'c-brand-logo', '112px')}<span class="c-brand-word">${t('Catering')}</span></a>
    <nav class="c-nav" aria-label="${ta('Catering')}"><a href="/catering#flavors">${t('Flavors')}</a><a href="/catering#tiers">${t('Tiers')}</a><a href="/catering#how">${t('How it works')}</a><a href="/">${t('Visit the shop')}</a></nav>
    <div class="c-header-actions">
      <div class="lang c-lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="true">EN</button><button type="button" data-lang="ko" aria-pressed="false" lang="ko">한국어</button></div>
      <a class="c-btn c-btn-sun c-btn-small c-header-book" href="/catering#book">${t(bookWords(C))}</a>
    </div>
  </div>
</header>`;
}

function footer(ctx) {
  const { t, logo, site } = ctx;
  const C = site.catering;
  const L = site.SETTINGS.links;
  const handle = L.instagram.replace(/\/$/, '').split('/').pop();
  return `<footer class="c-footer">
  <div class="c-wrap c-footer-grid">
    <div class="c-footer-brand">${logo('arch-white', 'Sweet Snow. ' + site.SETTINGS.tagline, 'c-footer-logo', '180px', true)}<p>${t(C.title)}</p></div>
    <div><h2>${t('Book')}</h2><p><a href="/catering#book">${t(bookWords(C))}</a></p><p><a href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON_OUT}</a></p></div>
    <div><h2>${t('The shop')}</h2><address>${t(site.brand.venue)}<br>${e(site.brand.street)}<br>${e(site.brand.city)}</address><p><a href="/">sweetsnow.org</a></p></div>
    <div><h2>${t('More')}</h2><p><a href="/menu">${t('Our menu')}</a></p><p><a href="/privacy">${t('Privacy')}</a></p></div>
  </div>
</footer>`;
}

/* ---------- the page ---------- */

function hero(ctx) {
  const { t, site } = ctx;
  const C = site.catering;
  const middle = (C.flavors.length - 1) / 2;
  // The cups arrive from the middle outwards, then each lid drops on and seals.
  const lineup = C.flavors.map((flavor, k) => cup(flavor, t(flavor.short), Math.round(Math.abs(k - middle)))).join('');
  return `<section class="c-hero" aria-labelledby="c-title">
  <div class="c-wrap c-hero-copy">
    <h1 id="c-title"><span class="c-hero-brand">${t(C.title)}</span> <span class="c-hero-line">${t(C.headline)}</span></h1>
    ${C.text ? `<p class="c-hero-lead">${t(C.text)}</p>` : ''}
    <p class="c-hero-actions"><a class="c-btn c-btn-sun" href="#book">${t(bookWords(C))}</a>${C.flavors.length ? `<a class="c-link" href="#flavors">${t('See the flavors')}</a>` : ''}</p>
    ${C.facts.length ? `<ul class="c-hero-facts">${C.facts.map(fact => `<li>${t(fact)}</li>`).join('')}</ul>` : ''}
  </div>
  ${C.flavors.length ? `<div class="c-lineup" aria-hidden="true">${lineup}${C.sticker ? `<span class="c-sticker"><span>${t(C.sticker)}</span></span>` : ''}</div>` : ''}
</section>`;
}

function points(ctx) {
  const { t, ta, site } = ctx;
  const C = site.catering;
  if (!C.points.length) return '';
  return `<section class="c-points" aria-label="${ta('What you get')}">
  <ul class="c-wrap c-points-list">${C.points.map(([word, line]) => `<li><h2>${t(word)}</h2>${line ? `<p>${t(line)}</p>` : ''}</li>`).join('')}</ul>
</section>`;
}

function flavors(ctx) {
  const { t, ta, img, site } = ctx;
  const C = site.catering;
  if (!C.flavors.length) return '';
  const first = C.flavors[0];
  const tab = (flavor, k) => `<button class="c-tab" type="button" role="tab" id="ft-${flavor.key}" aria-controls="fp-${flavor.key}" aria-selected="${k === 0}" tabindex="${k === 0 ? 0 : -1}" data-flavor="${flavor.key}" data-label="${flavor.colour}" data-ink="${flavor.ink}" style="${cupStyle(flavor, k)}"><span class="c-tab-dot" aria-hidden="true"></span><span>${t(flavor.short)}</span></button>`;
  const panel = (flavor, k) => `<div class="c-inside${k === 0 ? ' is-on' : ''}" role="tabpanel" id="fp-${flavor.key}" aria-labelledby="ft-${flavor.key}" tabindex="0" style="${cupStyle(flavor, k)}">
        <div class="c-inside-photo">${img(flavor.photo, 'card', { alt: ta(flavor.full), sizes: '(max-width: 859px) 46vw, 260px' })}</div>
        <div class="c-inside-copy">
          <h3>${t(flavor.short)}</h3>
          <p class="c-inside-note">${t('What is inside')}</p>
          <ul class="c-chips">${flavor.parts.map((part, i) => `<li style="--i:${i}">${t(part)}</li>`).join('')}</ul>
        </div>
      </div>`;
  return `<section class="c-flavors" id="flavors" aria-labelledby="flavors-title" data-flavors>
  <div class="c-wrap">
    <div class="c-head">
      <h2 id="flavors-title">${t('A label for every flavor')}</h2>
      <p class="c-lead">${t('Pick a flavor to see its label and what is inside the cup.')}</p>
    </div>
    <div class="c-flavor-grid">
      <div class="c-tabs" role="tablist" aria-label="${ta('Flavors')}">${C.flavors.map(tab).join('')}</div>
      <div class="c-stage" aria-hidden="true">
        <span class="c-cup c-cup-big" data-stage-cup style="${cupStyle(first, 0)}">${CUP_ART}${C.flavors.map((flavor, k) => `<span class="${labelClass(flavor)}" data-stage-label="${flavor.key}"${k === 0 ? '' : ' hidden'}>${t(flavor.short)}</span>`).join('')}</span>
      </div>
      <div class="c-panels">
      ${C.flavors.map(panel).join('\n      ')}
      </div>
    </div>
  </div>
</section>`;
}

/* Tier cards take turns through the brand colours, like price tags. */
const TONES = [['#FFFFFF', NAVY], ['#FFC83D', NAVY], ['#2457F5', '#FFFFFF']];

function tiers(ctx) {
  const { t, site } = ctx;
  const C = site.catering;
  if (!C.tiers.length) return '';
  let nth = 0;
  const shelf = (tier, index) => {
    const [tone, ink] = TONES[index % TONES.length];
    return `<li class="c-shelf${ink === NAVY ? '' : ' is-deep'}" id="${tier.id}" style="--tone:${tone};--tone-ink:${ink}">
      <div class="c-tag">
        <p class="c-tag-step">${t('Tier ' + (index + 1))}</p>
        <h3>${t(tier.name)}</h3>
        ${tier.text ? `<p class="c-tag-text">${t(tier.text)}</p>` : ''}
        <p class="c-tag-facts"><span><b>${tier.count}</b> ${t(tier.count === 1 ? 'flavor' : 'flavors')}</span><span>${t(tier.price || 'Ask for a quote')}</span>${tier.guests ? `<span>${t(tier.guests)}</span>` : ''}</p>
        <a class="c-btn c-btn-navy c-btn-small" href="#book" data-tier="${e(tier.name)}">${t(C.appointments.form ? 'Request this tier' : 'Book this tier')}</a>
      </div>
      <div class="c-shelf-side">
        ${C.buildUp && index > 0 ? `<p class="c-shelf-plus">${t('Every flavor above, plus')}</p>` : ''}
        <ul class="c-shelf-cups">${tier.items.map(flavor => `<li><a href="#flavors" data-show-flavor="${flavor.key}">${cup(flavor, t(flavor.short), nth++, true)}<span class="c-shelf-name">${t(flavor.short)}</span></a></li>`).join('')}</ul>
      </div>
    </li>`;
  };
  return `<section class="c-tiers" id="tiers" aria-labelledby="tiers-title">
  <div class="c-wrap">
    <div class="c-head">
      <h2 id="tiers-title">${t('Tiers built from our menu')}</h2>
      <p class="c-lead">${t('Each tier opens up more flavors to choose from. Tell us your guest count and we will put a quote together.')}</p>
    </div>
    <ol class="c-shelves" data-seal>
    ${C.tiers.map(shelf).join('\n    ')}
    </ol>
  </div>
</section>`;
}

function events(ctx) {
  const { t, site } = ctx;
  const C = site.catering;
  if (!C.events.length) return '';
  return `<section class="c-events" id="events" aria-labelledby="events-title">
  <div class="c-wrap">
    <h2 id="events-title">${t('Made for')}</h2>
    <ul class="c-events-list">${C.events.map(event => `<li>${t(event)}</li>`).join('')}</ul>
  </div>
</section>`;
}

function how(ctx) {
  const { t, site } = ctx;
  const A = site.catering.appointments;
  const first = A.form ? ['Send your request', 'Your event date, guest count and the tier you like.']
    : A.bookingLink ? ['Pick a time', 'Choose an open time on our booking calendar.']
    : ['Message us', 'Send us a message on Instagram to set up your appointment.'];
  const steps = [first,
    ['Choose a tier and flavors', 'Tell us your guest count and the flavors you like. We send you a quote.'],
    ['We make, seal and label', 'Your cups are made at Sweet Snow, sealed, and labeled by flavor for your event.']];
  return `<section class="c-how" id="how" aria-labelledby="how-title">
  <div class="c-wrap">
    <h2 id="how-title">${t('How it works')}</h2>
    <ol class="c-steps">${steps.map(([title, text], i) => `<li><span class="c-step-num" aria-hidden="true">${i + 1}</span><h3>${t(title)}</h3><p>${t(text)}</p></li>`).join('')}</ol>
  </div>
</section>`;
}

function book(ctx) {
  const { t, site } = ctx;
  const C = site.catering;
  const A = C.appointments;
  const L = site.SETTINGS.links;
  const handle = L.instagram.replace(/\/$/, '').split('/').pop();
  const notes = [A.leadTime, A.serviceArea].filter(Boolean);
  // Three ways to book, chosen in catering-settings.js: a booking calendar, a request form, or (until the calendar link is in) a message.
  const ticket = A.bookingLink
    ? `<div class="c-ticket-body">
        <h3>${t('Pick a time for your appointment')}</h3>
        <p>${t('Our booking calendar shows the open times. Choose one, and add your event date, guest count and the tier you like.')}</p>
        <p class="c-ticket-actions"><a class="c-btn c-btn-navy" href="${e(A.bookingLink)}" target="_blank" rel="noopener noreferrer">${t('Pick a time')}${ICON_OUT}</a></p>
      </div>`
    : `<div class="c-ticket-body">
        <h3>${t('Message us to book')}</h3>
        <p>${t('Send us a message on Instagram with your event date, guest count and the tier you like. We will set up your appointment there.')}</p>
        <p class="c-ticket-actions"><a class="c-btn c-btn-navy" href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON_OUT}</a></p>
      </div>`;
  const form = `<form class="c-form" id="cateringForm" method="post" action="/api/form" data-catering-form>
        <input type="hidden" name="form-name" value="catering-appointment">
        <p hidden><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
        <div class="c-field"><label for="cf-name">${t('Your name')}</label><input id="cf-name" name="name" type="text" autocomplete="name" maxlength="120" required></div>
        <div class="c-row">
          <div class="c-field"><label for="cf-phone">${t('Phone')}</label><input id="cf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="40" aria-describedby="cf-contact-hint"></div>
          <div class="c-field"><label for="cf-email">${t('Email')}</label><input id="cf-email" name="email" type="email" autocomplete="email" maxlength="160" aria-describedby="cf-contact-hint"></div>
        </div>
        <p class="c-hint" id="cf-contact-hint">${t('Phone or email. One is enough.')}</p>
        <p class="c-error" data-error="contact" hidden>${t('Add a phone number or an email so we can reach you.')}</p>
        <div class="c-row">
          <div class="c-field"><label for="cf-date">${t('Event date')}</label><input id="cf-date" name="date" type="date" required></div>
          <div class="c-field"><label for="cf-guests">${t('Number of guests')}</label><input id="cf-guests" name="guests" type="number" inputmode="numeric" min="1" max="5000" required></div>
        </div>
        <div class="c-row">
          <div class="c-field"><label for="cf-tier">${t('Tier')}</label><select id="cf-tier" name="tier"><option value="Not sure yet">${t('Not sure yet')}</option>${C.tiers.map(tier => `<option value="${e(tier.name)}">${t(tier.name)}</option>`).join('')}</select></div>
          <div class="c-field"><label for="cf-location">${t('City or venue')}</label><input id="cf-location" name="location" type="text" autocomplete="off" maxlength="160"></div>
        </div>
        <div class="c-field"><label for="cf-notes">${t('Anything else we should know?')}</label><textarea id="cf-notes" name="notes" rows="4" maxlength="1500"></textarea></div>
        <button class="c-btn c-btn-navy" type="submit" data-send><span data-send-idle>${t('Send request')}</span><span data-send-busy hidden>${t('Sending')}</span></button>
        <p class="c-privacy">${t('We use these details only to reply about your event.')} <a href="/privacy">${t('Privacy')}</a></p>
      </form>
      <div class="c-ticket-body" data-form-sent tabindex="-1" hidden>
        <h3>${t('Request sent')}</h3>
        <p>${t('We have your details and will reach out to set up your appointment.')}</p>
      </div>
      <div class="c-ticket-body" data-form-failed tabindex="-1" hidden>
        <h3>${t('Your request was not sent')}</h3>
        <p>${t('The form could not reach us. Copy your request and message it to us on Instagram, and we will set up your appointment there.')}</p>
        <p class="c-ticket-actions"><button class="c-btn c-btn-navy" type="button" data-copy><span data-copy-idle>${t('Copy my request')}</span><span data-copy-done hidden>${t('Copied')}</span></button><a class="c-btn c-btn-plain" href="${e(L.instagram)}" target="_blank" rel="noopener">@${e(handle)}${ICON_OUT}</a></p>
        <p><button class="c-retry" type="button" data-retry>${t('Back to the form')}</button></p>
      </div>`;
  return `<section class="c-book" id="book" aria-labelledby="book-title">
  <div class="c-wrap c-book-grid">
    <div class="c-book-copy">
      <h2 id="book-title">${t(A.title)}</h2>
      ${A.text ? `<p class="c-lead">${t(A.text)}</p>` : ''}
      ${notes.length ? `<ul class="c-book-notes">${notes.map(note => `<li>${t(note)}</li>`).join('')}</ul>` : ''}
      ${A.form && A.bookingLink ? `<p><a class="c-btn c-btn-sun" href="${e(A.bookingLink)}" target="_blank" rel="noopener noreferrer">${t('Pick a time')}${ICON_OUT}</a></p>` : ''}
    </div>
    <div class="c-ticket" data-appt-panel>
      ${A.form ? form : ticket}
    </div>
  </div>
</section>`;
}

export function catering(ctx) {
  const { t, site } = ctx;
  const html = `${header(ctx)}
<main id="main">
${hero(ctx)}
${points(ctx)}
${flavors(ctx)}
${tiers(ctx)}
${events(ctx)}
${how(ctx)}
${book(ctx)}
</main>
${footer(ctx)}
<div class="c-bar" data-catering-bar><a class="c-btn c-btn-sun" href="#book">${t(bookWords(site.catering))}</a></div>`;
  // Korean: a label's short name ("Mango Jelly") borrows the owner's wording for the full menu name
  // ("Mango Jelly Cup") when no other flavor on the page shares that short name.
  const all = site.catering.flavors;
  for (const flavor of all) {
    const alone = all.every(other => other.short !== flavor.short || other === flavor);
    if (alone && ctx.ko[flavor.full] && !ctx.ko[flavor.short]) ctx.ko[flavor.short] = ctx.ko[flavor.full];
  }
  return html;
}

/* Where the request form lands when the browser sends it without the page script. */
export function cateringThanks(ctx) {
  const { t } = ctx;
  return `${header(ctx)}
<main id="main" class="c-plain">
  <div class="c-wrap">
    <h1>${t('Request sent')}</h1>
    <p class="c-lead">${t('We have your details and will reach out to set up your appointment.')}</p>
    <p><a class="c-btn c-btn-sun" href="/catering">${t('Back to catering')}</a></p>
  </div>
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
      title: 'Sweet Snow Catering | Pre-Made Bingsu Cups for Events',
      ogTitle: 'Sweet Snow Catering | Pre-Made Bingsu Cups for Events',
      description: 'Pre-made Korean bingsu from the Sweet Snow menu, sealed in paper cups and labeled by flavor for your event. See the flavors and tiers, and book an appointment.'
    },
    cateringThanks: { file: 'catering/thanks.html', path: '/catering/thanks', bodyClass: 'page-catering page-catering-plain', simple: true, own: true, title: 'Request sent — Sweet Snow Catering', robots: 'noindex' }
  };
}
