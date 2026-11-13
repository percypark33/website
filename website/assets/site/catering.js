/* SWEET SNOW CATERING — what moves on /catering: the flavor labels, the lids
that seal as the tiers scroll in, the booking panel and the request form.
Language switching and the header come from the site's shared script. */
(() => {
'use strict';
const doc = document;
const root = doc.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
/* ---------- a label for every flavor ---------- */
const flavors = doc.querySelector('[data-flavors]');
if (flavors) {
const tabs = [...flavors.querySelectorAll('[role="tab"]')];
const panels = [...flavors.querySelectorAll('[role="tabpanel"]')];
const stage = flavors.querySelector('.c-stage');
const stageCup = flavors.querySelector('[data-stage-cup]');
const stageLabels = [...flavors.querySelectorAll('[data-stage-label]')];
const select = (tab, focus) => {
const key = tab.dataset.flavor;
for (const other of tabs) {
const on = other === tab;
other.setAttribute('aria-selected', String(on));
other.tabIndex = on ? 0 : -1;
}
for (const panel of panels) panel.classList.toggle('is-on', panel.id === 'fp-' + key);
stageCup.style.setProperty('--label', tab.dataset.label);
stageCup.style.setProperty('--label-ink', tab.dataset.ink);
for (const label of stageLabels) label.hidden = label.dataset.stageLabel !== key;
stage.classList.remove('is-swapping');
void stage.offsetWidth;
stage.classList.add('is-swapping');
if (focus) tab.focus();
tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced.matches ? 'auto' : 'smooth' });
};
for (const tab of tabs) tab.addEventListener('click', () => select(tab));
flavors.querySelector('[role="tablist"]').addEventListener('keydown', event => {
let i = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
if (event.key === 'ArrowRight' || event.key === 'ArrowDown') i = (i + 1) % tabs.length;
else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') i = (i + tabs.length - 1) % tabs.length;
else if (event.key === 'Home') i = 0;
else if (event.key === 'End') i = tabs.length - 1;
else return;
event.preventDefault();
select(tabs[i], true);
});
doc.addEventListener('click', event => {
const link = event.target.closest('[data-show-flavor]');
const tab = link && tabs.find(candidate => candidate.dataset.flavor === link.dataset.showFlavor);
if (tab) select(tab);
});
}
/* ---------- tiers: the lids seal when the shelves scroll into view ---------- */
const shelves = doc.querySelector('[data-seal]');
if (shelves) {
if (!('IntersectionObserver' in window) || reduced.matches) shelves.classList.add('is-sealed');
else {
const once = new IntersectionObserver(entries => {
if (!entries[0].isIntersecting) return;
once.disconnect();
shelves.classList.add('is-sealed');
}, { rootMargin: '0px 0px -18% 0px' });
once.observe(shelves);
}
}
/* ---------- Korean titles get a face as round as the English one ---------- */
const loadKoreanTitles = () => {
if (root.lang !== 'ko' || doc.querySelector('link[data-catering-ko]')) return;
const link = doc.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Jua&display=swap';
link.dataset.cateringKo = '';
doc.head.append(link);
};
new MutationObserver(loadKoreanTitles).observe(root, { attributes: true, attributeFilter: ['lang'] });
loadKoreanTitles();
/* ---------- on phones the floating button steps aside while the same button, or the booking panel, is on screen ---------- */
const panel = doc.querySelector('[data-appt-panel]');
const bar = doc.querySelector('[data-catering-bar]');
if (panel && bar && 'IntersectionObserver' in window) {
const seen = new Map();
const watch = new IntersectionObserver(entries => {
for (const entry of entries) seen.set(entry.target, entry.isIntersecting);
bar.classList.toggle('is-hidden', [...seen.values()].some(Boolean));
});
for (const target of [panel, doc.querySelector('.c-hero-actions')]) if (target) watch.observe(target);
}
/* ---------- the request form, when catering-settings.js switches it on ---------- */
const form = doc.querySelector('[data-catering-form]');
if (!form) return;
const sent = panel.querySelector('[data-form-sent]');
const failed = panel.querySelector('[data-form-failed]');
const button = form.querySelector('[data-send]');
const fields = form.elements;
/* "Request this tier" fills in the tier on the form. */
doc.addEventListener('click', event => {
const link = event.target.closest('[data-tier]');
if (!link) return;
for (const option of fields.tier.options) if (option.value === link.dataset.tier) fields.tier.value = option.value;
});
/* The event cannot be in the past. */
const pad = value => String(value).padStart(2, '0');
const today = new Date();
fields.date.min = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());
/* One way to reach the guest is enough: phone or email. */
const contactError = form.querySelector('[data-error="contact"]');
const hasContact = () => Boolean(fields.phone.value.trim() || fields.email.value.trim());
const showContactError = show => {
contactError.hidden = !show;
for (const input of [fields.phone, fields.email]) {
if (show) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
}
};
for (const input of [fields.phone, fields.email]) input.addEventListener('input', () => { if (hasContact()) showContactError(false); });
const busy = on => {
button.disabled = on;
button.querySelector('[data-send-idle]').hidden = on;
button.querySelector('[data-send-busy]').hidden = !on;
};
const show = block => {
form.hidden = block !== form;
sent.hidden = block !== sent;
failed.hidden = block !== failed;
if (block !== form) block.focus({ preventScroll: true });
block.scrollIntoView({ block: 'nearest' });
};
form.addEventListener('submit', async event => {
event.preventDefault();
if (!hasContact()) { showContactError(true); fields.phone.focus(); return; }
busy(true);
let ok = false;
try {
const response = await fetch(form.action, {
method: 'POST',
headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
body: new URLSearchParams(new FormData(form))
});
ok = response.ok && (await response.json()).ok === true;
} catch (_) { ok = false; }
busy(false);
show(ok ? sent : failed);
});
/* If the form cannot reach us, the guest can still send the same details by message. */
const summary = () => [
'Catering appointment request',
'Name: ' + fields.name.value.trim(),
'Phone: ' + fields.phone.value.trim(),
'Email: ' + fields.email.value.trim(),
'Event date: ' + fields.date.value,
'Guests: ' + fields.guests.value,
'Tier: ' + fields.tier.value,
'City or venue: ' + fields.location.value.trim(),
'Notes: ' + fields.notes.value.trim()
].filter(line => !/: $/.test(line)).join('\n');
const copy = failed.querySelector('[data-copy]');
copy.addEventListener('click', async () => {
const text = summary();
try { await navigator.clipboard.writeText(text); }
catch (_) {
const area = doc.createElement('textarea');
area.value = text; area.setAttribute('readonly', ''); area.style.cssText = 'position:fixed;opacity:0';
doc.body.append(area); area.select();
try { doc.execCommand('copy'); } catch (__) { /* the guest can still retype it */ }
area.remove();
}
copy.querySelector('[data-copy-idle]').hidden = true;
copy.querySelector('[data-copy-done]').hidden = false;
setTimeout(() => { copy.querySelector('[data-copy-idle]').hidden = false; copy.querySelector('[data-copy-done]').hidden = true; }, 2400);
});
failed.querySelector('[data-retry]').addEventListener('click', () => { show(form); fields.name.focus(); });
})();