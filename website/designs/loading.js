(() => {
  'use strict';

  const loader = document.getElementById('brand-loader');
  if (!loader) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let finishTimer;
  let hideTimer;

  const reset = () => {
    clearTimeout(finishTimer);
    clearTimeout(hideTimer);
    loader.classList.remove('is-finished');
    loader.hidden = true;
    if (loader.parentElement !== document.body) document.body.append(loader);
  };

  const isInternalNavigation = link => {
    if (link.hasAttribute('download') || link.target && link.target !== '_self') return false;
    const href = link.getAttribute('href');
    if (!href || href === '#' || /^javascript:/i.test(href)) return false;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return false;
    return destination.pathname !== window.location.pathname || destination.search !== window.location.search || destination.hash !== window.location.hash;
  };

  const show = () => {
    clearTimeout(finishTimer);
    clearTimeout(hideTimer);
    loader.classList.remove('is-finished');
    loader.hidden = false;
    loader.setAttribute('aria-label', 'Loading Sweet Snow');
    // Feedback is intentionally brief; navigation still proceeds immediately.
    finishTimer = setTimeout(() => {
      loader.classList.add('is-finished');
      hideTimer = setTimeout(reset, 180);
    }, 650);
  };

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest('a');
    if (!link || link.closest('.ingredient-trigger, .ingredient-explorer, .language-control, .mobile-nav-toggle') || !isInternalNavigation(link)) return;
    show();
  }, { capture: true, passive: true });

  window.addEventListener('pagehide', reset);
  window.addEventListener('pageshow', reset);
})();
