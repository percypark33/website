/* SWEET SNOW CATERING — booking on the landing page: Snow the chat helper and
the form. Both send the same request to /api/form, which emails it to the shop.
Without this script the form still works by itself and lands on /catering/thanks.
Language switching and the header come from the site's shared script. */
(() => {
'use strict';
const doc = document;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const panel = doc.querySelector('[data-appt-panel]');
if (!panel) return;
const form = panel.querySelector('[data-catering-form]');
const chat = panel.querySelector('[data-chat]');
const pad = value => String(value).padStart(2, '0');
const now = new Date();
const today = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
const isEmail = text => /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(text);
/* Which design the guest is on, and which ad brought them (the utm_ tags on the link), go along with every request. */
const design = form.elements.design.value;
const tags = new URLSearchParams(location.search);
const ad = ['utm_source', 'utm_campaign', 'utm_content'].map(key => tags.get(key)).filter(Boolean).join(' / ').slice(0, 160);
form.elements.ad.value = ad;
const isPhone = text => text.replace(/\D/g, '').length >= 7;
const post = fields => fetch('/api/form', {
method: 'POST',
headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
body: new URLSearchParams(fields)
}).then(async response => response.ok && (await response.json()).ok === true).catch(() => false);
const copyText = async text => {
try { await navigator.clipboard.writeText(text); }
catch (_) {
const area = doc.createElement('textarea');
area.value = text; area.setAttribute('readonly', ''); area.style.cssText = 'position:fixed;opacity:0';
doc.body.append(area); area.select();
try { doc.execCommand('copy'); } catch (__) { /* the guest can still retype it */ }
area.remove();
}
};
/* ---------- on phones the floating button steps aside while the same button, or the booking panel, is on screen ---------- */
const bar = doc.querySelector('[data-catering-bar]');
if (bar && 'IntersectionObserver' in window) {
const seen = new Map();
const watch = new IntersectionObserver(entries => {
for (const entry of entries) seen.set(entry.target, entry.isIntersecting);
bar.classList.toggle('is-hidden', [...seen.values()].some(Boolean));
});
for (const target of [panel, doc.querySelector('.k-hero-actions')]) if (target) watch.observe(target);
}
/* ---------- Snow, the chat helper ---------- */
let startBooking = null;
if (chat) {
const store = doc.querySelector('[data-chat-lines]');
const log = chat.querySelector('[data-chat-log]');
const quick = chat.querySelector('[data-chat-quick]');
const composer = chat.querySelector('[data-chat-form]');
const input = chat.querySelector('[data-chat-input]');
const node = key => store.querySelector('[data-k="' + key + '"]');
const line = key => (node(key) ? node(key).textContent : '');
const options = name => [...store.querySelectorAll('[data-quick="' + name + '"] li')].map(li => ({ label: li.textContent, value: li.dataset.value || li.textContent, go: li.dataset.go || '' }));
const addOnTiers = (store.dataset.addonTiers || '').split('|').filter(Boolean);
const wait = ms => new Promise(resolve => setTimeout(resolve, reduced.matches ? 0 : ms));
let data = {}, step = null, mode = 'menu', touched = false, busy = Promise.resolve();
const bubble = (who, fill) => {
const li = doc.createElement('li');
li.className = 'k-msg k-msg-' + who;
fill(li);
log.append(li);
log.scrollTop = log.scrollHeight;
return li;
};
const me = text => bubble('me', li => { li.textContent = text; });
/* Snow "types" for a moment, then the words arrive. Lines queue up so they never overlap. */
const say = (...keys) => {
busy = busy.then(async () => {
for (const key of keys) {
const li = bubble('bot', el => { el.innerHTML = '<span class="k-typing"><i></i><i></i><i></i></span>'; });
await wait(420);
const source = node(key);
if (source) li.replaceChildren(...[...source.childNodes].map(child => child.cloneNode(true))); else li.textContent = key;
log.scrollTop = log.scrollHeight;
}
});
return busy;
};
const offer = (name, onPick) => {
quick.replaceChildren(...options(name).map(option => {
const button = doc.createElement('button');
button.type = 'button';
button.textContent = option.label;
button.addEventListener('click', () => { touched = true; me(option.label); quick.replaceChildren(); onPick(option); });
return button;
}));
};
const setInput = (type, attrs = {}) => {
input.type = type || 'text';
input.value = '';
for (const name of ['min', 'inputmode', 'autocomplete']) if (attrs[name]) input.setAttribute(name, attrs[name]); else input.removeAttribute(name);
if (touched && type !== null) input.focus({ preventScroll: true });
};
const steps = [
{ field: 'event', ask: 'askEvent', quick: 'events', type: 'text' },
{ field: 'date', ask: 'askDate', type: 'date', attrs: { min: today } },
{ field: 'guests', ask: 'askGuests', quick: 'guests', type: 'text', attrs: { inputmode: 'numeric' } },
{ field: 'tier', ask: 'askTier', quick: 'tiers', type: null },
{ field: 'addon', ask: 'askAddon', quick: 'yesno', type: null, when: () => addOnTiers.includes(data.tier) },
{ field: 'appt_date', ask: 'askApptDate', type: 'date', attrs: { min: today } },
{ field: 'appt_time', ask: 'askApptTime', quick: 'times', type: null },
{ field: 'name', ask: 'askName', type: 'text', attrs: { autocomplete: 'name' } },
{ field: 'contact', ask: 'askContact', type: 'text' }
];
const check = (field, value) => {
if ((field === 'date' || field === 'appt_date') && !(/^\d{4}-\d{2}-\d{2}$/.test(value) && value >= today)) return 'badDate';
if (field === 'guests' && !/\d/.test(value)) return 'badGuests';
if (field === 'contact' && !isEmail(value) && !isPhone(value)) return 'badContact';
return '';
};
const ask = async index => {
while (index < steps.length && ((steps[index].when && !steps[index].when()) || data[steps[index].field])) index++;
if (index >= steps.length) return mode === 'question' ? sendQuestion() : confirm();
step = index;
await say(steps[index].ask);
if (steps[index].quick) offer(steps[index].quick, option => take(option.value)); else quick.replaceChildren();
setInput(steps[index].type, steps[index].attrs);
};
const take = value => {
const current = steps[step];
const problem = check(current.field, value);
if (problem) { say(problem).then(() => { if (current.quick) offer(current.quick, option => take(option.value)); }); return; }
data[current.field] = value;
ask(step + 1);
};
const fields = () => ({
'form-name': 'catering-appointment', source: 'chat', design, ad, 'bot-field': '',
name: data.name || '', phone: isEmail(data.contact || '') ? '' : data.contact || '', email: isEmail(data.contact || '') ? data.contact : '',
event: data.event || '', date: data.date || '', guests: data.guests || '', tier: data.tier || '', taiyaki: data.addon || '',
appointment_day: data.appt_date || '', appointment_time: data.appt_time || ''
});
const summary = () => [['l-event', data.event], ['l-date', data.date], ['l-guests', data.guests], ['l-tier', data.tier], ['l-addon', data.addon],
['l-appt', [data.appt_date, data.appt_time].filter(Boolean).join(', ')], ['l-name', data.name], ['l-contact', data.contact], ['l-question', data.question]]
.filter(([, value]) => value).map(([key, value]) => line(key) + ': ' + value).join('\n');
const confirm = async () => {
step = null; mode = 'confirm';
await say('confirm');
bubble('bot', li => { li.textContent = summary(); });
offer('confirm', option => (option.go === 'send' ? send() : restart()));
setInput(null);
};
/* If it cannot be sent, the guest can copy the same details and message them, or try again. */
const offerFailed = again => offer('failed', async option => {
if (option.go === 'copy') { await copyText(summary()); await say('copied'); offerFailed(again); } else again();
});
const failed = again => say('failed').then(() => offerFailed(again));
const send = async () => {
await say('sending');
if (await post(fields())) { mode = 'menu'; data = {}; await say('sent', 'more'); offer('topics', topic); } else failed(send);
};
const sendQuestion = async () => {
step = null;
await say('sending');
const sent = await post({ 'form-name': 'catering-question', source: 'chat', design, ad, 'bot-field': '', question: data.question, phone: isEmail(data.contact) ? '' : data.contact, email: isEmail(data.contact) ? data.contact : '' });
if (sent) { mode = 'menu'; data = {}; await say('questionSent', 'more'); offer('topics', topic); } else failed(sendQuestion);
};
const restart = () => { data = {}; mode = 'booking'; ask(0); };
const answer = async key => {
const keys = key === 'tiers' ? [...store.querySelectorAll('[data-k^="a-tiers-"]')].map(el => el.dataset.k) : node('a-' + key) ? ['a-' + key] : ['fallback'];
await say(...keys, 'more');
offer('topics', topic);
};
const topic = option => {
if (option.go === 'book') { mode = 'booking'; ask(0); }
else if (option.go === 'question') { mode = 'question'; step = null; data = {}; say('askQuestion').then(() => setInput('text')); }
else answer(option.go);
};
/* Typed words: an answer to the current question, or a few keywords Snow understands. */
const ROUTES = [['book', /book|appoint|reserv|schedul|예약/i], ['tiers', /tier|package|basic|premium|special|패키지/i], ['price', /price|cost|much|quote|rate|가격|견적|얼마/i],
['taiyaki', /taiyaki|붕어빵/i], ['preMade', /cup|pre-?made|컵/i], ['guests', /guest|people|many|size|인원/i], ['how', /how|work|방법/i]];
composer.addEventListener('submit', event => {
event.preventDefault();
const value = input.value.trim();
if (!value) return;
touched = true;
me(value);
input.value = '';
if (mode === 'question' && step === null && !data.question) { data.question = value; quick.replaceChildren(); ask(steps.length - 1); return; }
if (step !== null) {
const current = steps[step];
if (current.type === null || current.quick) {
const match = options(current.quick).find(option => option.label.toLowerCase() === value.toLowerCase() || option.value.toLowerCase() === value.toLowerCase());
if (match) { quick.replaceChildren(); take(match.value); return; }
if (current.type === null) { say('badChoice'); return; }
}
quick.replaceChildren();
take(value);
return;
}
const route = ROUTES.find(([, pattern]) => pattern.test(value));
if (!route) { say('fallback').then(() => offer('topics', topic)); return; }
quick.replaceChildren();
topic({ go: route[0] });
});
startBooking = tier => {
if (chat.hidden || mode !== 'menu') return;
touched = true;
data = tier ? { tier } : {};
mode = 'booking';
quick.replaceChildren();
ask(0);
};
/* The chat is the way in; the form stays one tap away. */
const useChat = on => {
chat.hidden = !on;
form.hidden = on;
for (const el of form.querySelectorAll('[data-chat-only]')) el.hidden = false;
};
chat.querySelector('[data-use-form]').addEventListener('click', () => { useChat(false); form.elements.name.focus(); });
form.querySelector('[data-use-chat]').addEventListener('click', () => { useChat(true); input.focus(); });
useChat(true);
/* A guest who reads the site in Korean is greeted in Korean: wait a moment for the Korean words to load. */
const wordsReady = new Promise(resolve => {
let saved = 'en';
try { saved = localStorage.getItem('sweet-snow-language'); } catch (_) { /* private mode */ }
if (saved !== 'ko') return resolve();
const english = line('greet'), started = Date.now();
const look = () => (line('greet') !== english || Date.now() - started > 2500 ? resolve() : setTimeout(look, 80));
look();
});
wordsReady.then(() => say('greet', 'offer')).then(() => offer('topics', topic));
}
/* "Book this tier" starts the chat with that tier, or fills it in on the form. */
doc.addEventListener('click', event => {
const link = event.target.closest('[data-tier]');
if (!link) return;
const select = form.elements.tier;
for (const option of select.options) if (option.value === link.dataset.tier) select.value = option.value;
if (startBooking) startBooking(link.dataset.tier);
});
/* ---------- the form ---------- */
const sent = panel.querySelector('[data-form-sent]');
const failedBox = panel.querySelector('[data-form-failed]');
const button = form.querySelector('[data-send]');
const f = form.elements;
f.date.min = today;
f.appointment_day.min = today;
const contactError = form.querySelector('[data-error="contact"]');
const hasContact = () => Boolean(f.phone.value.trim() || f.email.value.trim());
const showContactError = show => {
contactError.hidden = !show;
for (const field of [f.phone, f.email]) { if (show) field.setAttribute('aria-invalid', 'true'); else field.removeAttribute('aria-invalid'); }
};
for (const field of [f.phone, f.email]) field.addEventListener('input', () => { if (hasContact()) showContactError(false); });
const show = block => {
form.hidden = block !== form;
sent.hidden = block !== sent;
failedBox.hidden = block !== failedBox;
if (block !== form) block.focus({ preventScroll: true });
block.scrollIntoView({ block: 'nearest' });
};
form.addEventListener('submit', async event => {
event.preventDefault();
if (!hasContact()) { showContactError(true); f.phone.focus(); return; }
button.disabled = true;
button.querySelector('[data-send-idle]').hidden = true;
button.querySelector('[data-send-busy]').hidden = false;
const ok = await post(new FormData(form));
button.disabled = false;
button.querySelector('[data-send-idle]').hidden = false;
button.querySelector('[data-send-busy]').hidden = true;
show(ok ? sent : failedBox);
});
const formSummary = () => [
'Catering appointment request', 'Name: ' + f.name.value.trim(), 'Phone: ' + f.phone.value.trim(), 'Email: ' + f.email.value.trim(),
'Event: ' + f.event.value, 'Event date: ' + f.date.value, 'Guests: ' + f.guests.value, 'Tier: ' + f.tier.value,
'Taiyaki add-on: ' + (f.taiyaki && f.taiyaki.checked ? 'Yes' : ''), 'Appointment: ' + [f.appointment_day.value, f.appointment_time.value].filter(Boolean).join(', '),
'Notes: ' + f.notes.value.trim()
].filter(text => !/: $/.test(text)).join('\n');
const copy = failedBox.querySelector('[data-copy]');
copy.addEventListener('click', async () => {
await copyText(formSummary());
copy.querySelector('[data-copy-idle]').hidden = true;
copy.querySelector('[data-copy-done]').hidden = false;
setTimeout(() => { copy.querySelector('[data-copy-idle]').hidden = false; copy.querySelector('[data-copy-done]').hidden = true; }, 2400);
});
failedBox.querySelector('[data-retry]').addEventListener('click', () => { show(form); f.name.focus(); });
})();