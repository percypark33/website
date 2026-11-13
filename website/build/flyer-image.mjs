#!/usr/bin/env node
/* SWEET SNOW CATERING — saves the frozen shaped milk flyer as a picture and a PDF.

   Run after the flyer changed (shapes, names, words):
     node build/build.mjs
     node build/flyer-image.mjs        # needs Playwright (npm install -g playwright)

   Writes  catering/frozen-milk-flyer.png   2160 × 2700, for Instagram and for printing 8 × 10 in
           catering/frozen-milk-flyer.pdf   8 × 10 in, for a print shop
           catering/frozen-milk-flyer.json  a note of which flyer page they were made from

   The website build does not need this. The flyer page itself is always current;
   only these two downloadable files wait for this script. */
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = 'catering/frozen-milk-flyer.html';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };

if (!fs.existsSync(path.join(ROOT, PAGE))) {
  console.error(`\n${PAGE} is not there yet. Run "node build/build.mjs" first.\n`);
  process.exit(1);
}
let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.error('\nThis script needs Playwright. Install it once with:  npm install -g playwright\n');
  process.exit(1);
}

// The flyer asks for its fonts and pictures by site address (/assets/…), so the folder is served for a moment.
const server = http.createServer((request, response) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.statusCode = 404; return response.end(); }
  response.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const address = `http://127.0.0.1:${server.address().port}/${PAGE}`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  const missing = [];
  page.on('response', response => { if (response.status() >= 400) missing.push(new URL(response.url()).pathname); });
  await page.goto(address, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (missing.length) throw new Error('The flyer could not load: ' + missing.join(', '));
  await page.locator('[data-sheet]').screenshot({ path: path.join(ROOT, 'catering/frozen-milk-flyer.png') });
  await page.pdf({ path: path.join(ROOT, 'catering/frozen-milk-flyer.pdf'), preferCSSPageSize: true, printBackground: true });
  // The build compares this note with the flyer page and warns when the saved files fall behind.
  const madeFrom = crypto.createHash('sha1').update(fs.readFileSync(path.join(ROOT, PAGE), 'utf8')).digest('hex').slice(0, 8);
  fs.writeFileSync(path.join(ROOT, 'catering/frozen-milk-flyer.json'), JSON.stringify({ madeFrom }) + '\n');
  console.log('Saved catering/frozen-milk-flyer.png and catering/frozen-milk-flyer.pdf');
} catch (error) {
  console.error('\nThe flyer files were NOT saved.\n' + error.message + '\n');
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
