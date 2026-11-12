(() => {
  'use strict';
  function addLocationGuide() {
    const main = document.querySelector('main');
    if (!main || document.getElementById('find-us')) return;
    const section = document.createElement('section');
    section.id = 'find-us';
    section.className = 'find-us shell';
    section.setAttribute('aria-labelledby', 'find-us-title');
    section.innerHTML = `
      <div class="find-us-heading">
        <p class="find-us-eyebrow">Come find us</p>
        <h2 id="find-us-title">Inside QT Golden Market Place.</h2>
        <p class="find-us-intro">Enter the food court and walk straight in. You’ll find Sweet Snow inside.</p>
      </div>
      <p class="find-us-swipe">Swipe to see where to go →</p>
      <div class="find-us-steps">
        <figure>
          <img src="/assets/qt-golden-market-original.webp" width="750" height="1000" loading="lazy" decoding="async" alt="QT Golden Market Place exterior and food court entrance">
          <figcaption><span class="find-us-step" aria-hidden="true">01</span><div><h3>Enter here</h3><p>QT Golden Market Place food court</p></div></figcaption>
        </figure>
        <figure>
          <img src="/assets/sweet-snow-storefront-straight.webp" width="1086" height="1448" loading="lazy" decoding="async" alt="Sweet Snow counter inside the food court, with its blue Sweet Snow sign">
          <figcaption><span class="find-us-step" aria-hidden="true">02</span><div><h3>Walk straight in</h3><p>Look for our blue Sweet Snow sign.</p></div></figcaption>
        </figure>
      </div>`;
    const directions = document.querySelector('.footer-directions');
    if (directions) {
      const link = directions.cloneNode(true);
      link.className = 'find-us-directions';
      section.querySelector('.find-us-heading').append(link);
    }
    main.append(section);
    document.querySelectorAll('.site-header a[href="#visit"], .location-bar a[href="#visit"]').forEach(link => {
      link.setAttribute('href', '#find-us');
    });
    window.SweetSnowLanguage?.refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addLocationGuide, { once: true });
  else addLocationGuide();
})();
