(() => {
  'use strict';

  const start = () => {
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('#discover');
    if (!header || !hero) return;

    // Let the sky show through all blue artwork while preserving the original PNG.
    // White rabbit and lettering remain visible; the original returns on white.
    const logo = header.querySelector('.brand .logo');
    if (logo && !logo.parentElement.classList.contains('scroll-logo')) {
      const wrap = document.createElement('span');
      wrap.className = 'scroll-logo';
      logo.before(wrap);
      wrap.append(logo);
      const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      overlay.setAttribute('viewBox', '0 0 1881 837');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('focusable', 'false');
      overlay.classList.add('mountain-sky');
      overlay.innerHTML = `<defs>
        <filter id="ss-logo-sky" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/>
          <feComposite in2="SourceGraphic" operator="in"/>
        </filter>
      </defs><image href="${logo.getAttribute('src')}" width="1881" height="837" filter="url(#ss-logo-sky)"/>`;
      wrap.append(overlay);
    }

    let scheduled = false;
    const update = () => {
      scheduled = false;
      const discovery = !hero.hidden;
      document.body.classList.toggle('hero-header-connected', discovery);
      header.classList.toggle('over-hero', discovery && window.scrollY < 32);
    };
    const schedule = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    };
    const measure = () => {
      document.body.style.setProperty('--hero-header-height', `${header.getBoundingClientRect().height}px`);
    };
    new ResizeObserver(measure).observe(header);
    new MutationObserver(update).observe(hero, { attributes: true, attributeFilter: ['hidden'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('pageshow', update);
    measure();
    update();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
