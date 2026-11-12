/* Reads the menu file and the settings file, and works out the lineup
   the website shows. The rules mirror the previous site (designs/production.js)
   so the same items appear in the same order. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

function runBrowserFile(file, globals = {}) {
  const source = fs.readFileSync(file, 'utf8');
  const window = { ...globals };
  window.window = window;
  const context = vm.createContext({ window, console, ...globals });
  try {
    vm.runInContext(source, context, { filename: path.basename(file) });
  } catch (error) {
    const where = /:(\d+)/.exec(String(error.stack || '').split('\n').find(l => l.includes(path.basename(file))) || '');
    throw new Error(`${path.basename(file)} has a typo${where ? ' near line ' + where[1] : ''}: ${error.message}`);
  }
  return window;
}

export const slug = text => String(text).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* For a misspelled item name, the closest real name (so the note can say "Did you mean …?"). */
function nearest(name, names) {
  const plain = text => text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const distance = (a, b) => {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let previous = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const keep = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = keep;
      }
    }
    return row[b.length];
  };
  let best = null, bestScore = Infinity;
  for (const candidate of names) {
    const score = distance(plain(name), plain(candidate));
    if (score < bestScore) { best = candidate; bestScore = score; }
  }
  return bestScore <= Math.max(2, Math.floor(plain(name).length / 4)) ? best : null;
}

const TOPPING_GROUPS = {
  finish: new Set(['condensed-milk', 'honey-drizzle', 'tajin', 'injeolmi-powder']),
  sweet: new Set(['coconut-jelly', 'mochi', 'red-beans', 'ice-cream-vanilla', 'ice-cream-yogurt', 'cheesecake-bites', 'brownie-bites', 'cookie-dough-bites', 'sprinkles'])
};

export function loadSite(root) {
  const warnings = [];
  const MENU = runBrowserFile(path.join(root, 'menu-2026-august.js')).MENU;
  const SETTINGS = runBrowserFile(path.join(root, 'site-settings.js')).SITE_SETTINGS;
  if (!MENU) throw new Error('menu-2026-august.js did not define window.MENU');
  if (!SETTINGS) throw new Error('site-settings.js did not define window.SITE_SETTINGS');
  const ART = runBrowserFile(path.join(root, 'menu-art.js')).MENU_ART;
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'topping-image-manifest.json'), 'utf8'));
  const photos = SETTINGS.photos || {};
  const price = value => (value === null || value === undefined || value === '' ? null : Number(value));
  const abs = p => (p ? (p.startsWith('/') ? p : '/' + p) : null);

  /* ---- bowls ---- */
  const B = MENU.bingsu;
  const halfNames = B.halfAndHalfOrder || [];
  const bowls = (B.rotationOrder || []).map(name => {
    const f = B.flavors.find(x => x.name === name);
    if (!f) return null;
    const category = halfNames.includes(name) ? 'half-half' : f.menuType === 'classic' ? 'classic' : 'special';
    // The previous site showed "Milk base" first, except on Honeycomb x2.
    const ing = name === 'Honeycomb x2' ? f.ing : 'Milk base · ' + f.ing;
    return {
      kind: 'bingsu', id: 'menu-item-' + slug(name), name, ing, price: price(f.price), category,
      type: f.menuType === 'classic' ? 'Classic' : f.menuType === 'special' ? 'Special' : '',
      tag: f.brandLabel || f.subtitle || '', comingSoon: !!f.comingSoon, checkAvailability: !!f.soldOut,
      isNew: !!f.isNew, preview: !!f.imagePreview, inventoryName: f.inventoryName || name, photo: abs(photos[name])
    };
  }).filter(Boolean);

  /* ---- cups ---- */
  const cups = (MENU.cupBingsu?.flavors || []).map(f => ({
    kind: 'cup', id: 'menu-item-cup-' + slug(f.name), name: f.name, ing: f.ing, price: price(f.price), category: 'cups',
    type: '', tag: '', comingSoon: !!(f.comingSoon || f.previewOnly), checkAvailability: !!f.soldOut,
    inventoryName: f.inventoryName || f.name, photo: abs(photos[f.name] || f.image)
  }));

  /* ---- mini taiyaki ---- */
  const T = MENU.miniTaiyaki || {};
  const taiyaki = T.enabled ? (T.flavors || []).map(f => ({
    kind: 'hot', id: 'menu-item-mini-' + slug(f.name), name: f.name, ing: f.filling, note: T.orderNote, price: price(f.price),
    category: 'food', type: '', tag: '', comingSoon: false, checkAvailability: !!f.soldOut,
    inventoryName: f.inventoryName || f.name, photo: abs(photos[f.name + ' Mini Taiyaki'] || f.image)
  })) : [];

  /* ---- croffles (names, recipes and prices come from the Square list in the menu file) ---- */
  const croffles = (MENU.squareMenu?.croffles || []).map(c => ({
    kind: 'croffle', id: 'menu-item-' + slug(c.name), name: c.name, ing: c.description, price: price(c.price?.amount / 100),
    category: 'croffles', type: '', tag: '', comingSoon: false,
    checkAvailability: c.availability === 'LOCAL_CATALOG_AVAILABILITY_SOLD_OUT', inventoryName: c.name, photo: abs(photos[c.name])
  }));

  /* ---- quick edits from site-settings.js ---- */
  const all = [...bowls, ...cups, ...taiyaki, ...croffles];
  for (const [name, change] of Object.entries(SETTINGS.menuEdits || {})) {
    const item = all.find(i => i.name === name);
    if (!item) {
      const close = nearest(name, all.map(i => i.name));
      warnings.push(`site-settings.js → menuEdits: no menu item is called "${name}".${close ? ` Did you mean "${close}"?` : ''}`);
      continue;
    }
    if ('price' in change) item.price = price(change.price);
    if ('ing' in change) item.ing = String(change.ing);
    if ('comingSoon' in change) item.comingSoon = !!change.comingSoon;
    if ('hidden' in change) item.hidden = !!change.hidden;
    if ('name' in change) item.name = String(change.name);
    if ('photo' in change) item.photo = abs(change.photo);
  }
  const visible = list => list.filter(i => !i.hidden);
  for (const item of visible(all)) if (!item.photo) warnings.push(`No photo is set for "${item.name}". Add it under photos in site-settings.js.`);

  /* ---- toppings (same list and groups as the previous site) ---- */
  const tierPrice = {};
  for (const tier of MENU.toppings?.tiers || []) for (const item of tier.items || []) {
    if (item.opts?.length) for (const opt of item.opts) tierPrice[(opt + ' ' + item.en).toLowerCase()] = tierPrice[opt.toLowerCase()] = price(tier.price);
    tierPrice[item.en.toLowerCase()] = price(tier.price);
  }
  const toppingPrice = en => tierPrice[en.toLowerCase()] ?? tierPrice[en.toLowerCase().replace(/ ice cream$/, '')] ?? (en === 'Sprinkles' ? 0 : null);
  const toppings = manifest.filter(t => t.category !== 'cream-top' && t.category !== 'extra-fruit').map(t => ({
    key: t.key, en: t.en, ko: t.ko, photo: `/designs/toppings/${t.key}.webp`, price: toppingPrice(t.en),
    group: TOPPING_GROUPS.finish.has(t.key) ? 'finish' : (TOPPING_GROUPS.sweet.has(t.key) || t.key.startsWith('popping-boba-')) ? 'sweet' : 'crunch'
  }));
  const fruitPrice = Object.fromEntries((MENU.extraFruit?.items || []).map(i => [i.en.toLowerCase(), price(i.price)]));
  const extraFruit = manifest.filter(t => t.category === 'extra-fruit').map(t => ({
    key: t.key, en: t.en, ko: t.ko, photo: `/designs/toppings/${t.key}.webp`, group: 'fruit',
    price: fruitPrice[t.en.replace(/^Extra /, '').toLowerCase()] ?? null
  }));

  /* ---- hero ---- */
  const heroItem = visible(all).find(i => i.name === SETTINGS.hero?.item) || visible(bowls)[0];
  if (SETTINGS.hero?.item && heroItem.name !== SETTINGS.hero.item) warnings.push(`site-settings.js → hero: no menu item is called "${SETTINGS.hero.item}". Showing "${heroItem.name}" instead.`);

  const byName = name => visible(all).find(i => i.name === name);
  const pick = (names, label) => (names || []).map(n => byName(n) || (warnings.push(`site-settings.js → ${label}: no menu item is called "${n}".`), null)).filter(Boolean);

  return {
    MENU, SETTINGS, ART, warnings,
    groups: {
      classic: visible(bowls).filter(i => i.category === 'classic'),
      special: visible(bowls).filter(i => i.category === 'special'),
      'half-half': visible(bowls).filter(i => i.category === 'half-half')
    },
    cups: visible(cups), taiyaki: visible(taiyaki), croffles: visible(croffles), toppings, extraFruit,
    cupMeta: { title: MENU.cupBingsu?.title || 'Cup Bingsu', blurb: MENU.cupBingsu?.blurb || '' },
    taiyakiMeta: { section: T.sectionTitle || 'Food', title: T.title || 'Mini Taiyaki', blurb: T.blurb || '', note: T.orderNote || '' },
    toppingsMeta: { servingNote: MENU.toppings?.servingNote || '', fruitNote: MENU.extraFruit?.note || '' },
    hero: {
      item: heroItem, label: SETTINGS.hero?.label || '', title: SETTINGS.hero?.title || heroItem.name,
      text: SETTINGS.hero?.text || heroItem.ing
    },
    homeCroffles: pick(SETTINGS.homeCroffles, 'homeCroffles'), homeCups: pick(SETTINGS.homeCups, 'homeCups'),
    brand: MENU.brand, schedule: MENU.schedule, showPrices: !!SETTINGS.showPrices
  };
}
