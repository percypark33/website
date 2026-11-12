(() => {
  'use strict';

  const start = () => {
    const hero = document.querySelector('#lychee-campaign');
    const scene = hero?.querySelector('.campaign-scene');
    const home = document.querySelector('#discover');
    if (!hero || !scene || !home || hero.querySelector('.lychee-syrup')) return;

    // Coordinates follow the syrup tips in the original 1659 × 948 photograph.
    // A separate decorative layer keeps the food photo and menu assets intact.
    const overlay = document.createElement('div');
    overlay.className = 'lychee-syrup';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `<svg viewBox="0 0 1659 948" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id="lychee-syrup-glass" x1="0" y1="0" x2="1" y2=".6">
          <stop offset="0" stop-color="#fffdf0" stop-opacity=".9"/>
          <stop offset=".4" stop-color="#f4ce86" stop-opacity=".35"/>
          <stop offset=".75" stop-color="#fff8db" stop-opacity=".78"/>
          <stop offset="1" stop-color="#bd924b" stop-opacity=".6"/>
        </linearGradient>
      </defs>
      ${[
        { x: 1140, y: 206, fall: 60, delay: '.1s' },
        { x: 1223, y: 316, fall: 47, delay: '1.35s' },
        { x: 1110, y: 395, fall: 40, delay: '2.7s' }
      ].map(({ x, y, fall, delay }) => `<g transform="translate(${x} ${y})">
        <g class="syrup-drop" style="--drip-fall:${fall}px;animation-delay:${delay}">
          <path d="M0 -12 C-1 -7 -6 -2 -6 3 C-6 11 6 11 6 3 C6 -2 1 -7 0 -12Z" fill="url(#lychee-syrup-glass)" stroke="#b48f5666" stroke-width=".8"/>
          <path d="M-2.5 -2 C-4 1 -4 4 -2.5 5.5" fill="none" stroke="#fffef5" stroke-opacity=".9" stroke-width="1.5" stroke-linecap="round"/>
        </g>
      </g>`).join('')}
    </svg>`;
    hero.append(overlay);

    // Keep touch feedback visible briefly after a tap, including fast navigation.
    let pressed = null;
    let pressTimer = 0;
    const clearPress = () => {
      clearTimeout(pressTimer);
      pressed?.classList.remove('is-pressed');
      pressed = null;
    };
    document.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse') return;
      const control = event.target.closest('.main-nav a, .language-toggle, .chapter-order, .catalog-nav a');
      clearPress();
      if (control) {
        pressed = control;
        pressed.classList.add('is-pressed');
      }
    }, { passive: true });
    document.addEventListener('pointerup', () => { pressTimer = setTimeout(clearPress, 240); }, { passive: true });
    document.addEventListener('pointercancel', clearPress, { passive: true });
    window.addEventListener('blur', clearPress);

    const svg = overlay.querySelector('svg');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const updateMotion = () => {
      overlay.classList.toggle('is-flowing', inView && !home.hidden && !document.hidden && !reduced.matches && scene.complete && scene.naturalWidth > 0);
    };
    const align = () => {
      if (home.hidden) return;
      // Match the photo's actual box, including the mobile image below the copy.
      const photo = scene.getBoundingClientRect();
      const section = hero.getBoundingClientRect();
      Object.assign(overlay.style, {
        left: `${photo.left - section.left}px`, top: `${photo.top - section.top}px`,
        width: `${photo.width}px`, height: `${photo.height}px`
      });
      svg.setAttribute('preserveAspectRatio', matchMedia('(max-width: 760px)').matches ? 'xMaxYMax slice' : 'xMidYMax slice');
      updateMotion();
    };
    const resize = new ResizeObserver(align);
    resize.observe(scene);
    resize.observe(hero);
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      updateMotion();
    }, { threshold: 0 }).observe(scene);
    new MutationObserver(() => { align(); updateMotion(); }).observe(home, { attributes: true, attributeFilter: ['hidden'] });
    scene.addEventListener('load', align);
    document.addEventListener('visibilitychange', updateMotion);
    reduced.addEventListener('change', updateMotion);
    window.addEventListener('pageshow', align);
    align();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
