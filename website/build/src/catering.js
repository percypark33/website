/* SWEET SNOW CATERING — the appointment form on /catering.
   Without this script the form still works: the browser sends it and lands on /catering/thanks. */
(() => {
  'use strict';
  const doc = document;
  const form = doc.querySelector('[data-catering-form]');
  if (!form) return;
  const panel = form.parentElement;
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

  /* On phones the floating button steps aside while the form itself is on screen. */
  const bar = doc.querySelector('[data-catering-bar]');
  if (bar && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => bar.classList.toggle('is-hidden', entries[0].isIntersecting), { rootMargin: '0px 0px -25% 0px' }).observe(panel);
  }
})();
