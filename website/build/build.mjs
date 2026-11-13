#!/usr/bin/env node
/* SWEET SNOW — builds the website pages.

   Reads   menu-2026-august.js   (menu names, recipes, prices)
           site-settings.js      (hero item, look, quick edits, photos)
           menu-art.js           (the bowl drawings)
           designs/language.js, designs/brand-story.js (Korean words, family letter)
           catering/catering-settings.js (the catering landing page: design, tiers, appointments)
   Writes  index.html, menu.html, visit.html, catering/*.html and assets/site/*

   Run:    node build/build.mjs
   Vercel runs this by itself on every change (see vercel.json). */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadSite } from './lib/data.mjs';
import { loadKorean, loadStory } from './lib/ko.mjs';
import * as pages from './lib/pages.mjs';
import * as catering from './lib/catering.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const hash = text => crypto.createHash('sha1').update(text).digest('hex').slice(0, 8);
const HERO_SIZES = '(max-width: 859px) 88vw, 600px';
const LOOKS = { 'milk-snow': '#F7FBFE', 'snow-day': '#70ADD9', 'moonlit-snow': '#061626' };

// The first big photo is requested early. Browsers that cannot read AVIF skip this hint and use the WebP file.
function preloadImage(entry, sizes) {
  const list = entry.avif || entry.variants;
  return `<link rel="preload" as="image"${entry.avif ? ' type="image/avif"' : ''} href="${list[Math.min(1, list.length - 1)].url}" imagesrcset="${list.map(v => `${v.url} ${v.w}w`).join(', ')}" imagesizes="${sizes}" fetchpriority="high">`;
}

function minifyCss(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
}
function minifyJs(js) {
  // Light touch only: drop full-line comments and indentation. Behaviour stays identical.
  return js.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//')).join('\n');
}

function main() {
  let site;
  try {
    site = loadSite(ROOT);
    site.catering = catering.loadCatering(ROOT, site);
  } catch (error) {
    console.error('\nThe website was NOT rebuilt.\n' + error.message + '\nFix the file and save again. The live website keeps the last good version.\n');
    process.exit(1);
  }
  const look = LOOKS[site.SETTINGS.look] ? site.SETTINGS.look : 'milk-snow';
  if (site.SETTINGS.look !== look) site.warnings.push(`site-settings.js → look: "${site.SETTINGS.look}" is not one of ${Object.keys(LOOKS).join(', ')}. Using "milk-snow".`);

  const manifestFile = path.join(ROOT, 'build/image-manifest.json');
  const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : { images: {}, logos: {} };
  const translate = loadKorean(ROOT);
  const usedImages = new Map();

  const makeContext = () => {
    const ko = {};
    const note = text => { const k = translate(text); if (k !== text) ko[text] = k; return text; };
    const ctx = {
      site, ko, blocks: {}, story: loadStory(ROOT), themeColor: LOOKS[look], sign: read('build/src/sign.svg').trim(), heroSizes: HERO_SIZES,
      t: text => pages.e(note(String(text))),
      ta: text => pages.e(note(String(text))),
      img(src, role, { alt = '', sizes = '100vw', eager = false, cls = '' } = {}) {
        if (!src) return '';
        usedImages.set(src + '|' + role, { src, role });
        const entry = manifest.images[src + '|' + role];
        const loading = eager ? (role === 'hero' ? 'fetchpriority="high" decoding="async"' : 'decoding="async"') : 'loading="lazy" decoding="async"';
        const klass = cls ? ` class="${cls}"` : '';
        if (!entry) return `<img${klass} src="${pages.e(src)}" alt="${alt}" ${loading}>`;
        const largest = entry.variants[entry.variants.length - 1];
        const fallback = entry.variants[Math.min(1, entry.variants.length - 1)];
        const image = `<img${klass} src="${fallback.url}" srcset="${entry.variants.map(v => `${v.url} ${v.w}w`).join(', ')}" sizes="${sizes}" width="${largest.w}" height="${Math.round(entry.h * largest.w / entry.w)}" alt="${alt}" ${loading}>`;
        if (!entry.avif) return image;
        return `<picture><source type="image/avif" srcset="${entry.avif.map(v => `${v.url} ${v.w}w`).join(', ')}" sizes="${sizes}">${image}</picture>`;
      },
      logo(name, alt, cls, sizes, lazy = false) {
        const entry = manifest.logos[name];
        if (!entry) return `<img class="${cls}" src="/assets/sweet-snow-horizontal-right-blue-20261104.svg" alt="${pages.e(alt)}" width="1881" height="837">`;
        const v = entry.variants;
        return `<img class="${cls}" src="${v[0].url}" srcset="${v.map(x => `${x.url} ${x.w}w`).join(', ')}" sizes="${sizes}" width="${v[0].w}" height="${Math.round(entry.h * v[0].w / entry.w)}" alt="${pages.e(alt)}"${lazy ? ' loading="lazy" decoding="async"' : ''}>`;
      }
    };
    return ctx;
  };

  /* --- render --- */
  // While catering is announced, the menu has a fifth link and needs a little more room.
  const baseCss = read('build/src/styles.css') + '\n' + read(`build/src/look-${look}.css`) + (site.catering?.announce ? '\n' + read('build/src/nav-catering.css') : '');
  const css = minifyCss(baseCss);
  const js = minifyJs(read('build/src/app.js'));
  const out = path.join(ROOT, 'assets/site');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'app.js'), js);

  // The catering pages come from the catering folder. Without that folder the site builds as before.
  const pageSet = { ...pages.PAGES, ...(site.catering ? catering.pageSet(site) : {}) };
  const templates = { ...pages, ...catering.templates };
  const allKo = {};
  const allBlocks = {};
  const cateringKo = {};
  const rendered = {};
  for (const key of Object.keys(pageSet)) {
    const ctx = makeContext();
    rendered[key] = { ctx, body: templates[key](ctx) };
    // Catering keeps its Korean words in its own file, so a catering edit never re-publishes the other pages.
    if (pageSet[key].own) { Object.assign(cateringKo, ctx.ko); continue; }
    Object.assign(allKo, ctx.ko);
    Object.assign(allBlocks, ctx.blocks);
  }
  if (args.has('--list-images')) {
    process.stdout.write(JSON.stringify([...usedImages.values()], null, 1));
    return;
  }

  // Words the page script puts together itself (open-now status, stock badges, the item sheet).
  for (const phrase of ['Open now · until ', 'Open now', 'Closed now', 'Next open ', 'today', 'tomorrow', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'SOLD OUT', 'FEW LEFT', 'Open navigation', 'Close navigation', 'Show ingredients for ', 'Milk base']) {
    const k = translate(phrase); if (k !== phrase) { allKo[phrase] = k; cateringKo[phrase] = k; }
  }
  const koJson = JSON.stringify({ text: allKo, blocks: allBlocks });
  fs.writeFileSync(path.join(out, 'ko.json'), koJson);

  const preview = process.env.VERCEL_ENV === 'preview' || args.has('--preview');
  const warningBar = preview && site.warnings.length
    ? `<div class="build-warning" role="alert"><strong>Settings to check (only shown on previews):</strong><ul>${site.warnings.map(w => `<li>${pages.e(w)}</li>`).join('')}</ul></div>` : '';
  const config = { schedule: site.schedule, ko: `/assets/site/ko.json?v=${hash(koJson)}` };
  // Old links such as /#croffles or /#visit keep working: they go to the page that now holds that section.
  const legacy = `(function(){function go(){var h=location.hash,p=location.pathname.replace(/\\/$/,'')||'/';if(p!=='/'||!h)return;var m=['#menu','#menu-premium','#menu-classic','#menu-special','#menu-half-half','#single-cups','#food','#mini-taiyaki','#mini-sides','#croffles','#toppings','#drinks','#coming-soon'];if(m.indexOf(h)>-1||h.indexOf('#menu-item-')===0)location.replace('/menu'+(h==='#menu'||h==='#drinks'||h==='#coming-soon'?'':h==='#menu-premium'?'#menu-classic':h));else if(h==='#visit'||h==='#find-us')location.replace('/visit');}go();addEventListener('hashchange',go);})();`;
  const scriptsFor = (settings, extra = '') => `<script>document.documentElement.classList.add('js');window.SWEET_SNOW=${JSON.stringify(settings)};__LEGACY__</script>
<script defer src="/assets/site/app.js?v=${hash(js)}"></script>${extra}
<script defer src="/analytics-config.js?v=google-tags-sept24"></script>
<script defer src="/analytics.js?v=seo-20261031"></script>`;
  const scripts = scriptsFor(config);

  /* --- catering: the landing page. The main site's styles, plus its own and one of three cute designs, loaded only by the catering pages --- */
  const cateringStyles = {};
  const cateringCss = design => (cateringStyles[design || ''] ||= minifyCss(baseCss + '\n' + read('build/src/catering.css') + (design ? '\n' + read(`build/src/catering-${design}.css`) : '')));
  let cateringScripts = () => scripts;
  if (site.catering) {
    // The design samples exist only while the owner is choosing.
    if (!site.catering.showSamples) for (const file of ['designs.html', ...Object.keys(catering.DESIGNS).map(key => `design-${key}.html`)]) fs.rmSync(path.join(ROOT, 'catering', file), { force: true });
    const cateringJs = minifyJs(read('build/src/catering.js'));
    const cateringKoJson = JSON.stringify({ text: cateringKo, blocks: {} });
    fs.writeFileSync(path.join(out, 'catering.js'), cateringJs);
    fs.writeFileSync(path.join(out, 'ko-catering.json'), cateringKoJson);
    const settings = { schedule: site.schedule, ko: `/assets/site/ko-catering.json?v=${hash(cateringKoJson)}` };
    cateringScripts = withForm => scriptsFor(settings, withForm ? `\n<script defer src="/assets/site/catering.js?v=${hash(cateringJs)}"></script>` : '');
    // "Catering" is listed for search engines only once it is announced.
    const sitemapFile = path.join(ROOT, 'sitemap.xml');
    if (fs.existsSync(sitemapFile)) {
      const line = '  <url><loc>https://www.sweetsnow.org/catering</loc></url>\n';
      const now = fs.readFileSync(sitemapFile, 'utf8');
      const next = site.catering.announce ? now.replace(line, '').replace('</urlset>', line + '</urlset>') : now.replace(line, '');
      if (next !== now) fs.writeFileSync(sitemapFile, next);
    }
  }

  for (const [key, { ctx, body }] of Object.entries(rendered)) {
    const page = pageSet[key];
    const preload = ['<link rel="preload" as="font" type="font/woff2" href="/assets/site/fonts/hahmlet.woff2" crossorigin>'];
    if (page.design === 'diary') preload.push('<link rel="preload" as="font" type="font/woff2" href="/assets/site/fonts/gaegu-700.woff2" crossorigin>');
    if (key === 'menu' && site.groups.classic[0]) {
      const entry = manifest.images[site.groups.classic[0].photo + '|card'];
      if (entry) preload.push(preloadImage(entry, pages.CARD_SIZES));
    }
    if (key === 'home') {
      const entry = manifest.images[site.hero.item.photo + '|hero'];
      if (entry) preload.push(preloadImage(entry, HERO_SIZES));
    }
    const html = `<!DOCTYPE html>
<html lang="en" class="look-${look}">
<head>
${pages.head(ctx, key, { page, css: page.own ? cateringCss(page.design) : css, preload, scripts: (page.own ? cateringScripts(!page.simple) : scripts).replace('__LEGACY__', key === 'home' ? legacy : '') })}
</head>
<body class="${page.bodyClass}">
${warningBar}${body}
</body>
</html>
`;
    fs.mkdirSync(path.dirname(path.join(ROOT, page.file)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, page.file), html);
  }

  const counts = `${site.groups.classic.length + site.groups.special.length + site.groups['half-half'].length} bowls, ${site.cups.length} cups, ${site.taiyaki.length} mini taiyaki, ${site.croffles.length} croffles, ${site.toppings.length} toppings`;
  console.log(`Built ${Object.values(pageSet).map(p => p.file).join(', ')} — ${counts}. Look: ${look}. Prices ${site.showPrices ? 'shown' : 'hidden'}.`);
  if (site.catering) console.log(`Catering: "${catering.DESIGNS[site.catering.design].name}" design, ${site.catering.tiers.length} tiers, ${site.catering.menu.classic.length} classic and ${site.catering.menu.special.length} special bingsu on the event menu${site.catering.showSamples ? ', plus the three design samples at catering/designs.html' : ''}. ${site.catering.announce ? 'Announced: in the menu and the sitemap.' : 'Not announced yet: reachable by link only.'}`);
  if (site.warnings.length) console.log('\nThings to check:\n' + site.warnings.map(w => '  • ' + w).join('\n'));
}

main();
