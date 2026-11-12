/* Korean wording. The owner's own dictionary in designs/language.js stays the
   source of truth; build/ko-extra.mjs only adds words for new parts of the site.

   A phrase is translated only when the dictionary knows it (whole, or part by
   part for "a · b · c" lists). Anything unknown stays in English, so a name is
   never left half-translated. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { EXTRA } from '../ko-extra.mjs';

export function loadKorean(root) {
  const source = fs.readFileSync(path.join(root, 'designs/language.js'), 'utf8')
    .replace('const attrNames =', 'window.__ko = ko; const attrNames =');
  const window = {};
  const document = { readyState: 'loading', addEventListener() {}, documentElement: {}, body: null, querySelector: () => null };
  vm.runInContext(source, vm.createContext({ window, document, console, localStorage: { getItem: () => 'ko', setItem() {} } }), { filename: 'language.js' });
  const dictionary = { ...(window.__ko || {}), ...EXTRA };
  const lower = new Map(Object.entries(dictionary).map(([k, v]) => [k.toLowerCase(), v]));
  const exact = key => (Object.prototype.hasOwnProperty.call(dictionary, key) ? dictionary[key] : lower.get(key.toLowerCase()));
  const list = (text, separator) => {
    const parts = text.split(separator);
    if (parts.length < 2) return null;
    const done = parts.map(part => exact(part.trim()) ?? part);
    return done.some((part, index) => part !== parts[index]) ? done.join(separator) : null;
  };
  return text => {
    const key = String(text);
    return exact(key) ?? list(key, ' · ') ?? list(key, ', ') ?? key;
  };
}

/* The family letter and photo captions live in designs/brand-story.js. */
export function loadStory(root) {
  const source = fs.readFileSync(path.join(root, 'designs/brand-story.js'), 'utf8');
  const literal = name => {
    const match = new RegExp('const ' + name + ' = `([\\s\\S]*?)`;').exec(source);
    if (!match) throw new Error(`designs/brand-story.js: could not find ${name}`);
    return match[1];
  };
  const object = name => {
    const start = source.indexOf('const ' + name + ' = {');
    if (start < 0) throw new Error(`designs/brand-story.js: could not find ${name}`);
    const end = source.indexOf('\n  };', start);
    return vm.runInNewContext('(' + source.slice(source.indexOf('{', start), end + 4) + ')');
  };
  return { letter: { en: literal('LETTER_EN'), ko: literal('LETTER_KO') }, photos: { en: object('PHOTOS_EN'), ko: object('PHOTOS_KO') } };
}
