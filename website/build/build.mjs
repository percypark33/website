#!/usr/bin/env node
/* SWEET SNOW — builds the website pages.

   Reads   menu-2026-august.js   (menu names, recipes, prices)
           site-settings.js      (hero item, look, quick edits, photos)
           menu-art.js           (the bowl drawings)
           designs/language.js, designs/brand-story.js (Korean words, family letter)
   Writes  index.html, menu.html, visit.html and assets/site/*

   Run:    node build/build.mjs
   Vercel runs this by itself on every change (see vercel.json). */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadSite } from './lib/data.mjs';
import { loadKorean, loadStory } from './lib/ko.mjs';
import * as pages from './lib/pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = new Set(process.argv.slice(2));
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const hash = text => crypto.createHash('sha1').update(text).digest('hex').slice(0, 8);
const LOOKS = { 'milk-snow': '#F7FBFE', 'snow-day': '#70ADD9', 'moonlit-snow': '#061626' };

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
      site, ko, blocks: {}, story: loadStory(ROOT), themeColor: LOOKS[look],
      t: text => pages.e(note(String(text))),
      ta: text => pages.e(note(String(text))),
      img(src, role, { alt = '', sizes = '100vw', eager = false, cls = '' } = {}) {
        if (!src) return '';
        usedImages.set(src + '|' + role, { src, role });
        const entry = manifest.images[src + '|' + role];
        const loading = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
        const klass = cls ? ` class="${cls}"` : '';
        if (!entry) return `<img${klass} src="${pages.e(src)}" alt="${alt}" ${loading}>`;
        const largest = entry.variants[entry.variants.length - 1];
        const fallback = entry.variants[Math.min(1, entry.variants.length - 1)];
        return `<img${klass} src="${fallback.url}" srcset="${entry.variants.map(v => `${v.url} ${v.w}w`).join(', ')}" sizes="${sizes}" width="${largest.w}" height="${Math.round(entry.h * largest.w / entry.w)}" alt="${alt}" ${loading}>`;
      },
      logo(name, alt, cls, sizes) {
        const entry = manifest.logos[name];
        if (!entry) return `<img class="${cls}" src="/assets/sweet-snow-horizontal-right-blue-20261104.svg" alt="${pages.e(alt)}" width="1881" height="837">`;
        const v = entry.variants;
        return `<img class="${cls}" src="${v[0].url}" srcset="${v.map(x => `${x.url} ${x.w}w`).join(', ')}" sizes="${sizes}" width="${v[0].w}" height="${Math.round(entry.h * v[0].w / entry.w)}" alt="${pages.e(alt)}">`;
      }
    };
    return ctx;
  };

  /* --- render --- */
  const css = minifyCss(read('build/src/styles.css') + '\n' + read(`build/src/look-${look}.css`));
  const js = minifyJs(read('build/src/app.js'));
  const out = path.join(ROOT, 'assets/site');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'app.js'), js);

  const allKo = {};
  const allBlocks = {};
  const rendered = {};
  for (const key of Object.keys(pages.PAGES)) {
    const ctx = makeContext();
    rendered[key] = { ctx, body: pages[key](ctx) };
    Object.assign(allKo, ctx.ko);
    Object.assign(allBlocks, ctx.blocks);
  }
  if (args.has('--list-images')) {
    process.stdout.write(JSON.stringify([...usedImages.values()], null, 1));
    return;
  }

  // Words the page script puts together itself (open-now status, stock badges, the item sheet).
  for (const phrase of ['Open now · until ', 'Open now', 'Closed now', 'Next open ', 'today', 'tomorrow', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'SOLD OUT', 'FEW LEFT', 'Open navigation', 'Close navigation', 'Show ingredients for ', 'Milk base']) {
    const k = translate(phrase); if (k !== phrase) allKo[phrase] = k;
  }
  const koJson = JSON.stringify({ text: allKo, blocks: allBlocks });
  fs.writeFileSync(path.join(out, 'ko.json'), koJson);

  const preview = process.env.VERCEL_ENV === 'preview' || args.has('--preview');
  const warningBar = preview && site.warnings.length
    ? `<div class="build-warning" role="alert"><strong>Settings to check (only shown on previews):</strong><ul>${site.warnings.map(w => `<li>${pages.e(w)}</li>`).join('')}</ul></div>` : '';
  const config = { schedule: site.schedule, ko: `/assets/site/ko.json?v=${hash(koJson)}`, video: fs.existsSync(path.join(out, 'video/hero-loop.mp4')) ? '/assets/site/video/hero-loop.mp4' : null };
  // Old links such as /#croffles or /#visit keep working: they go to the page that now holds that section.
  const legacy = `(function(){var h=location.hash,p=location.pathname.replace(/\\/$/,'')||'/';if(p!=='/'||!h)return;var m=['#menu','#menu-premium','#menu-classic','#menu-special','#menu-half-half','#single-cups','#food','#mini-taiyaki','#mini-sides','#croffles','#toppings','#drinks','#coming-soon'];if(m.indexOf(h)>-1||h.indexOf('#menu-item-')===0)location.replace('/menu'+(h==='#menu'||h==='#drinks'||h==='#coming-soon'?'':h==='#menu-premium'?'#menu-classic':h));else if(h==='#visit'||h==='#find-us')location.replace('/visit');})();`;
  const scripts = `<script>document.documentElement.classList.add('js');window.SWEET_SNOW=${JSON.stringify(config)};__LEGACY__</script>
<script defer src="/assets/site/app.js?v=${hash(js)}"></script>
<script defer src="/analytics-config.js?v=google-tags-sept24"></script>
<script defer src="/analytics.js?v=seo-20261031"></script>`;

  for (const [key, { ctx, body }] of Object.entries(rendered)) {
    const page = pages.PAGES[key];
    const preload = ['<link rel="preload" as="font" type="font/woff2" href="/assets/site/fonts/hahmlet-latin.woff2" crossorigin>'];
    if (key === 'home') {
      const entry = manifest.images[site.hero.item.photo + '|hero'];
      if (entry) preload.push(`<link rel="preload" as="image" href="${entry.variants[Math.min(1, entry.variants.length - 1)].url}" imagesrcset="${entry.variants.map(v => `${v.url} ${v.w}w`).join(', ')}" imagesizes="(max-width: 720px) 96vw, 560px" fetchpriority="high">`);
    }
    const html = `<!DOCTYPE html>
<html lang="en" class="look-${look}">
<head>
${pages.head(ctx, key, { css, preload, scripts: scripts.replace('__LEGACY__', key === 'home' ? legacy : '') })}
</head>
<body class="${page.bodyClass}">
${warningBar}${body}
</body>
</html>
`;
    fs.writeFileSync(path.join(ROOT, page.file), html);
  }

  const counts = `${site.groups.classic.length + site.groups.special.length + site.groups['half-half'].length} bowls, ${site.cups.length} cups, ${site.taiyaki.length} mini taiyaki, ${site.croffles.length} croffles, ${site.toppings.length} toppings`;
  console.log(`Built index.html, menu.html, visit.html — ${counts}. Look: ${look}. Prices ${site.showPrices ? 'shown' : 'hidden'}.`);
  if (site.warnings.length) console.log('\nThings to check:\n' + site.warnings.map(w => '  • ' + w).join('\n'));
}

main();
