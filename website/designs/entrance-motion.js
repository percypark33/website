(() => {
  'use strict';
  if (!Element.prototype.animate || !('IntersectionObserver' in window)) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const seen = new WeakSet();
  let observer;
  let logoMotion;
  const ease = 'cubic-bezier(.22,1,.36,1)';
  function play(element, frames, options) {
    if (!element || preference.matches) return;
    const animation = element.animate(frames, { fill: 'backwards', ...options });
    running.add(animation);
    const done = () => running.delete(animation);
    animation.addEventListener('finish', done, { once: true });
    animation.addEventListener('cancel', done, { once: true });
    return animation;
  }
  const logo = document.querySelector('.site-header .brand .logo');
  function greet() {
    if (preference.matches || document.hidden) return;
    logoMotion?.cancel();
    logoMotion = play(logo, [
      { transform: 'translateY(0) rotate(0deg)', offset: 0 },
      { transform: 'translateY(-3px) rotate(-3deg)', offset: .27 },
      { transform: 'translateY(0) rotate(1.8deg)', offset: .52 },
      { transform: 'translateY(-1px) rotate(-.8deg)', offset: .73 },
      { transform: 'translateY(0) rotate(0deg)', offset: 1 }
    ], { duration: 1800, easing: 'ease-in-out' });
  }
  logo?.closest('a')?.addEventListener('pointerenter', greet, { passive: true });
  logo?.closest('a')?.addEventListener('focus', greet);
  function enter() {
    if (preference.matches) return;
    greet();
    const parts = document.querySelectorAll('.lychee-campaign-copy > .campaign-new, .lychee-campaign-copy > .campaign-intro, .lychee-campaign-copy > h1, .lychee-campaign-copy > .lychee-campaign-description, .lychee-campaign-copy > .hero-actions');
    parts.forEach((part, i) => play(part, [
      { opacity: 0, transform: 'translateY(14px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 700, delay: i * 80, easing: ease }));
    const scene = document.querySelector('.campaign-scene');
    // Decode first so slow image loading cannot consume the entrance animation.
    scene?.decode().catch(() => {}).then(() => {
      const bounds = scene.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < innerHeight && !document.hidden) {
        play(scene, [{ opacity: .3 }, { opacity: 1 }], { duration: 1200, easing: ease });
      }
    });
    observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (seen.has(target) || preference.matches || target.contains(document.activeElement)) return;
        seen.add(target);
        play(target, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, easing: ease });
      });
    }, { threshold: .08 });
    document.querySelectorAll('.menu-category-title, .product-card, .customize-heading, .featured-addons, #brand-story, .catering-card').forEach(node => {
      // Avoid moving the destination when a visitor follows a section link.
      if (location.hash && document.getElementById(location.hash.slice(1))?.contains(node)) { seen.add(node); return; }
      observer.observe(node);
    });
  }
  function stop() { running.forEach(animation => animation.cancel()); observer?.disconnect(); }
  preference.addEventListener('change', event => { if (event.matches) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) running.forEach(animation => animation.cancel()); });
  window.addEventListener('pagehide', stop);
  enter();
})();
