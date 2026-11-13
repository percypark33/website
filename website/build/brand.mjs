/* Makes the logo, bunny and tab-icon pictures from the owner's logo file
   (assets/brand/sweet-snow-logo-20261112.pdf). The artwork is used exactly
   as drawn; this only changes colours, crops and sizes.

   Run it only when the logo changes:   node build/brand.mjs
   It needs two tools that are not on Vercel: pdftocairo (poppler) and Playwright's Chromium.
   Afterwards run:  python3 build/images.py --logos-only  &&  node build/build.mjs          */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PDF = path.join(ROOT, 'assets/brand/sweet-snow-logo-20261112.pdf');
const STAMP = '20261113';               // goes into the icon file names, so browsers pick up the new ones
const BLUE = '#73AEDC';                 // the logo's own blue, as written inside the PDF
const ICON_BLUE = '#4287B6';            // the deeper blue the tab icon already used; the white bunny stands out on it

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'brand-'));
execFileSync('pdftocairo', ['-svg', PDF, path.join(tmp, 'logo.svg')]);
const svg = fs.readFileSync(path.join(tmp, 'logo.svg'), 'utf8');
const size = /viewBox="0 0 (\d+) (\d+)"/.exec(svg).slice(1).map(Number);
const paths = [...svg.matchAll(/<path[^>]*>/g)].map(m => ({ d: / d="([^"]*)"/.exec(m[0])[1], transform: (/ transform="([^"]*)"/.exec(m[0]) || [])[1] || '' }));
if (paths.length !== 5) throw new Error(`Expected 5 shapes in the logo file, found ${paths.length}. The file changed; check the order below.`);
// Order inside the file: words, snowflake, snowboard outline, bunny body (covers the board behind it), bunny lines.
const [words, flake, board, body, lines] = paths;

const boardPath = (fill, stroke) => `<path d="${board.d}" transform="${board.transform}" fill="${fill}" stroke="${stroke}" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>`;
const bunny = (ink, inside, boardFill) => `${boardPath(boardFill, ink)}<path d="${body.d}" fill="${inside}"/><path d="${lines.d}" fill="${ink}"/>`;
const BOX = { x: 3711, y: 422, w: 2538, h: 2412 };   // the bunny and board, with a little room

const doc = (viewBox, inner, w, h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}" style="display:block">${inner}</svg>`;
const LOGO_W = 2400, LOGO_H = Math.round(2400 * size[1] / size[0]);
const pictures = {
  // The whole logo, white on blue, as in the file.
  logo: doc(`0 0 ${size[0]} ${size[1]}`, `<rect width="${size[0]}" height="${size[1]}" fill="${BLUE}"/><path fill-rule="evenodd" d="${words.d}" fill="#fff"/><path fill-rule="evenodd" d="${flake.d}" fill="#fff"/>${bunny('#fff', BLUE, 'none')}`, LOGO_W, LOGO_H),
  // The whole logo in blue on a clear background, cropped to the artwork (for the share picture and anywhere else it is handy).
  // The body hides the part of the board behind it, as in the file.
  logoBlue: doc('486 414 5752 2409', `<defs><mask id="behind" maskUnits="userSpaceOnUse" x="0" y="0" width="${size[0]}" height="${size[1]}"><rect width="${size[0]}" height="${size[1]}" fill="#fff"/><path d="${body.d}" fill="#000"/></mask></defs><path fill-rule="evenodd" d="${words.d}" fill="${BLUE}"/><path fill-rule="evenodd" d="${flake.d}" fill="${BLUE}"/><g mask="url(#behind)">${boardPath('none', BLUE)}</g><path d="${lines.d}" fill="${BLUE}"/>`, 1600, Math.round(1600 * 2409 / 5752)),
  // The bunny alone for light pages: blue lines, white inside, clear background.
  bunny: doc(`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`, bunny(BLUE, '#fff', '#fff'), 1200, Math.round(1200 * BOX.h / BOX.w))
};

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const shoot = async (markup, w, h, file, clear = true, behind = 'transparent') => {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<body style="margin:0;background:${behind}">${markup}</body>`);
  await page.screenshot({ path: path.join(ROOT, file), omitBackground: clear, clip: { x: 0, y: 0, width: w, height: h } });
  console.log('wrote', file);
};
await shoot(pictures.logo, LOGO_W, LOGO_H, 'assets/brand/sweet-snow-logo-20261112.png', false, BLUE);
await shoot(pictures.logoBlue, 1600, Math.round(1600 * 2409 / 5752), 'assets/brand/sweet-snow-logo-blue-20261112.png');
await shoot(pictures.bunny, 1200, Math.round(1200 * BOX.h / BOX.w), 'assets/brand/sweet-snow-bunny-20261112.png');

// The smallest circle that holds the whole bunny, so it sits centred in the round icon.
await page.setViewportSize({ width: 600, height: 600 });
await page.setContent(`<body style="margin:0">${doc(`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`, bunny('#000', '#000', '#000'), 500, Math.round(500 * BOX.h / BOX.w))}</body>`);
const circle = await page.evaluate(async () => {
  const el = document.querySelector('svg'); const w = el.width.baseVal.value, h = el.height.baseVal.value;
  const image = new Image(); image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(el)); await image.decode();
  const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h }); const c = canvas.getContext('2d'); c.drawImage(image, 0, 0, w, h);
  const data = c.getImageData(0, 0, w, h).data; const edge = [];
  for (let y = 0; y < h; y++) { let first = -1, last = -1; for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 40) { if (first < 0) first = x; last = x; } if (first >= 0) edge.push([first, y], [last, y]); }
  let best = null;
  for (let cy = h * 0.3; cy < h * 0.7; cy += 1) for (let cx = w * 0.3; cx < w * 0.7; cx += 1) { let r = 0; for (const [x, y] of edge) { const d = (x - cx) ** 2 + (y - cy) ** 2; if (d > r) r = d; } if (!best || r < best.r) best = { cx, cy, r }; }
  return { cx: best.cx / w, cy: best.cy / h, r: Math.sqrt(best.r) / w };
});
const centre = { x: BOX.x + circle.cx * BOX.w, y: BOX.y + circle.cy * BOX.h, r: circle.r * BOX.w };
const icon = (round, fillShare) => {
  const scale = 50 * fillShare / centre.r;
  const shape = round ? `<circle cx="50" cy="50" r="50" fill="${ICON_BLUE}"/>` : `<rect width="100" height="100" fill="${ICON_BLUE}"/>`;
  return (w) => doc('0 0 100 100', `${shape}<g transform="translate(50 50) scale(${scale}) translate(${-centre.x} ${-centre.y})">${bunny(ICON_BLUE, '#fff', '#fff')}</g>`, w, w);   // a solid white bunny, as on the round logo, so it still reads at tab size
};
for (const w of [32, 96, 192, 512]) await shoot(icon(true, 0.92)(w), w, w, `assets/favicon-sweetsnow-${STAMP}-${w}.png`);
// iPhone home screen: the phone rounds the corners itself, so this one stays a full square.
await shoot(icon(false, 0.84)(180), 180, 180, `assets/apple-touch-sweetsnow-${STAMP}.png`, false, ICON_BLUE);
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
