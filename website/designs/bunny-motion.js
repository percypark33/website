(() => {
  'use strict';

  window.__sweetSnowBunnyMotionCleanup?.();

  const logo = document.querySelector('.site-header .brand .logo');
  const brand = logo?.closest('a');
  if (!logo || !brand || !Element.prototype.animate) return;

  // Two clipped copies preserve the original art: fixed lettering, moving bunny.
  const points = [[378,226],[373,171],[395,136],[493,141],[580,126],[644,125],[669,143],[670,199],[675,222],[673,265],[657,304],[635,326],[606,324],[554,291],[551,339],[558,371],[582,391],[601,424],[604,453],[586,487],[559,498],[530,490],[458,445],[410,410],[375,394],[325,395],[273,387],[241,363],[220,331],[215,291],[228,259],[256,238],[287,233],[283,211],[303,196],[336,195],[360,212]];
  const d = 'M' + points.map(p => `${(p[0] / 905).toFixed(5)},${(p[1] / 564).toFixed(5)}`).join('L') + 'Z';
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `<defs><clipPath id="ss-bunny-part" clipPathUnits="objectBoundingBox"><path d="${d}"/></clipPath><clipPath id="ss-bunny-lettering" clipPathUnits="objectBoundingBox"><path clip-rule="evenodd" d="M0,0H1V1H0Z ${d}"/></clipPath></defs>`;

  const wrap = document.createElement('span');
  wrap.className = 'bunny-mark';
  logo.before(wrap);
  wrap.append(svg, logo);

  const layer = document.createElement('span');
  layer.className = 'bunny-motion-layer';
  layer.setAttribute('aria-hidden', 'true');
  const bunny = logo.cloneNode();
  bunny.removeAttribute('class');
  bunny.alt = '';
  layer.append(bunny);
  wrap.append(layer);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let timerId = null;
  let timerEndsAt = 0;
  let pausedDelay = 0;
  let tiltAnimation = null;
  let destroyed = false;

  const randomPause = () => 4000 + Math.round(Math.random() * 2000);
  const clearTimer = () => {
    if (timerId !== null) clearTimeout(timerId);
    timerId = null;
    timerEndsAt = 0;
  };
  const canMove = () => !destroyed && !reduce.matches && !document.hidden;

  function scheduleTilt(delay = randomPause()) {
    clearTimer();
    if (!canMove()) {
      pausedDelay = delay;
      return;
    }
    timerEndsAt = performance.now() + delay;
    timerId = setTimeout(() => {
      timerId = null;
      timerEndsAt = 0;
      playTilt();
    }, delay);
  }

  function playTilt() {
    if (!canMove()) return;
    clearTimer();
    tiltAnimation?.cancel();
    const angle = (Math.random() < .5 ? -1 : 1) * (2 + Math.random());
    const animation = layer.animate([
      { transform: 'rotate(0deg)' },
      { transform: `rotate(${angle.toFixed(2)}deg)`, offset: .45 },
      { transform: `rotate(${(angle * .38).toFixed(2)}deg)`, offset: .72 },
      { transform: 'rotate(0deg)' }
    ], { duration: 1500, easing: 'ease-in-out' });
    tiltAnimation = animation;
    animation.finished.then(() => {
      if (!destroyed && tiltAnimation === animation) {
        tiltAnimation = null;
        scheduleTilt();
      }
    }).catch(() => {});
  }

  function handleVisibility() {
    if (document.hidden) {
      pausedDelay = timerId === null ? randomPause() : Math.max(0, timerEndsAt - performance.now());
      clearTimer();
      tiltAnimation?.cancel();
      tiltAnimation = null;
    } else if (!reduce.matches) {
      scheduleTilt(pausedDelay || randomPause());
      pausedDelay = 0;
    }
  }

  function handleReducedMotion() {
    if (reduce.matches) {
      clearTimer();
      pausedDelay = 0;
      tiltAnimation?.cancel();
      tiltAnimation = null;
    } else if (!document.hidden) {
      scheduleTilt(randomPause());
    }
  }

  function handlePageHide(event) {
    if (!event.persisted) cleanup();
  }

  function cleanup() {
    if (destroyed) return;
    destroyed = true;
    clearTimer();
    tiltAnimation?.cancel();
    brand.removeEventListener('pointerenter', playTilt);
    brand.removeEventListener('focus', playTilt);
    reduce.removeEventListener('change', handleReducedMotion);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('pagehide', handlePageHide);
    if (wrap.isConnected) {
      wrap.before(logo);
      wrap.remove();
    }
    if (window.__sweetSnowBunnyMotionCleanup === cleanup) delete window.__sweetSnowBunnyMotionCleanup;
  }

  brand.addEventListener('pointerenter', playTilt, { passive: true });
  brand.addEventListener('focus', playTilt);
  reduce.addEventListener('change', handleReducedMotion);
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('pagehide', handlePageHide);
  window.__sweetSnowBunnyMotionCleanup = cleanup;
  scheduleTilt(2600 + Math.round(Math.random() * 1200));
})();
