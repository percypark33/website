(() => {
  'use strict';

  const start = () => {
    if (document.body.classList.contains('chapter-experience')) return;
    const main = document.querySelector('main');
    const header = document.querySelector('.site-header');
    const nav = header?.querySelector('.main-nav');
    const hero = main?.querySelector('.lychee-campaign');
    const menu = main?.querySelector('#menu');
    const toppings = main?.querySelector('#toppings');
    const story = main?.querySelector('#brand-story');
    const findUs = main?.querySelector('#find-us');
    const footer = document.querySelector('.site-footer#visit');
    if (!main || !header || !nav || !hero || !menu || !toppings || !story || !findUs || !footer) return;

    document.body.classList.add('chapter-experience');
    const home = document.createElement('div');
    home.id = 'discover';
    home.className = 'home-chapter';
    hero.before(home);
    home.append(hero);
    hero.id = 'lychee-campaign';
    // Keep toppings inside the menu, with the existing gallery and controls.
    toppings.classList.add('menu-group');
    menu.querySelector('.menu-groups').append(toppings);
    const panels = new Map([
      ['discovery', home], ['menu', menu], ['story', story], ['visit', findUs]
    ]);
    panels.forEach((panel, name) => {
      panel.classList.add('chapter-panel');
      panel.dataset.chapter = name;
      panel.tabIndex = -1;
    });

    const pickup = document.querySelector('.square-pickup');
    const order = document.createElement('a');
    order.className = 'chapter-order';
    order.href = pickup?.href || 'https://cash.app/$sweetsnowus';
    order.target = '_blank';
    order.rel = 'noopener noreferrer';
    order.setAttribute('aria-label', 'Order online');
    order.innerHTML = '<img class="cash-app-logo" src="/assets/cash-app-logo.svg" width="22" height="22" alt="" aria-hidden="true"><span class="pickup-label">Order online ↗</span>';
    header.append(order);

    nav.replaceChildren();
    [
      ['Home', '/'], ['Menu', '/menu'],
      ['Our story', '/#brand-story'], ['Find us', '/visit']
    ].forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      nav.append(link);
    });
    const brand = header.querySelector('.brand');
    if (brand) brand.href = '/';

    const utility = document.createElement('div');
    utility.className = 'chapter-utility';
    const footerLinks = footer.querySelector('.footer-links');
    if (footerLinks) utility.append(footerLinks.cloneNode(true));
    // A stored Korean preference may have translated the source links already.
    // Reset clone text so language.js can retain a stable English source record.
    utility.querySelectorAll('.footer-links a').forEach(link => {
      const icon = link.querySelector('img');
      link.replaceChildren();
      if (icon) link.append(icon);
      link.append(link.classList.contains('square-pickup') ? 'Order online ↗' : link.href.includes('doordash.com') ? 'Delivery with DoorDash ↗' : 'Privacy');
    });
    main.after(utility);

    const heroMenuLink = hero.querySelector('.campaign-menu-link');
    if (heroMenuLink) heroMenuLink.textContent = 'Explore the menu →';

    const addNext = (panel, href, label) => {
      const link = document.createElement('a');
      link.className = 'chapter-next';
      link.href = href;
      link.textContent = label;
      panel.append(link);
    };
    addNext(menu, '#brand-story', 'Meet Sweet Snow →');
    addNext(story, '#find-us', 'Come find us →');

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const groups = [...menu.querySelectorAll('.menu-groups > .menu-group')];
    const categoryNames = { 'menu-classic': 'Classic', 'menu-special': 'Special', 'menu-half-half': 'Fruit Half & Half', 'single-cups': 'Cups', 'food': 'Food', 'croffles': 'Croffles', 'drinks': 'Drinks', 'coming-soon': 'Coming soon', 'toppings': 'Toppings' };
    const catalogNav = document.createElement('nav');
    catalogNav.className = 'catalog-nav';
    catalogNav.style.overflowX = 'auto';
    catalogNav.setAttribute('aria-label', 'Menu categories');
    const cardById = new Map();
    const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    groups.forEach((group, index) => {
      group.hidden = false;
      const heading = group.querySelector('.menu-category-title');
      if (heading) heading.dataset.number = String(index + 1).padStart(2, '0');
      const link = document.createElement('a');
      link.href = `#${group.id}`;
      link.textContent = categoryNames[group.id];
      catalogNav.append(link);
      const grid = group.querySelector('.product-grid, .cup-bingsu-grid, .mini-taiyaki-grid');
      grid?.classList.add('catalog-grid');
      [...(grid?.children || [])].forEach(card => {
        card.classList.add('flavor-item');
        card.id = `menu-item-${card.dataset.kind === 'cup' ? 'cup-' : card.dataset.kind === 'hot' ? 'mini-' : ''}${slug(card.dataset.name)}`;
        cardById.set(card.id, card);
      });
    });
    menu.querySelector('.menu-groups')?.before(catalogNav);
    const menuHeading = menu.querySelector('.section-heading');
    menuHeading.querySelector('h2').textContent = 'Our menu';
    const menuHint = document.createElement('p');
    menuHint.className = 'catalog-hint';
    menuHint.innerHTML = '<span class="flavor-hint-pointer">Hover a photo to explore its layers</span><span class="flavor-hint-touch">Tap a photo for ingredients</span>';
    menuHeading.append(menuHint);

    const cloneProduct = source => {
      const card = source.cloneNode(true);
      card.removeAttribute('id');
      card.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      card.querySelector('.ingredient-annotations')?.remove();
      card.classList.remove('ingredients-open');
      const trigger = card.querySelector('.ingredient-trigger');
      trigger?.setAttribute('aria-expanded', 'false');
      trigger?.removeAttribute('aria-controls');
      // Restore English sources before the language observer handles the clone.
      const name = card.dataset.name;
      const title = card.querySelector('.product-heading h4, :scope > h3');
      if (title) title.textContent = name;
      const description = card.querySelector('.menu-ingredient-description');
      if (description) description.textContent = card.dataset.ingredients;
      trigger?.setAttribute('aria-label', `Show ingredients for ${name}`);
      const img = trigger?.querySelector('img');
      if (img) img.alt = name;
      card.querySelectorAll('.product-meta .brand-tag').forEach(node => node.remove());
      card.querySelectorAll('.tape.soldout, .tape.few').forEach(node => {
        node.textContent = node.classList.contains('soldout') ? 'SOLD OUT' : 'FEW LEFT';
      });
      return card;
    };

    const flyers = document.createElement('section');
    flyers.className = 'home-flyers';
    flyers.setAttribute('aria-label', 'Croffles and cup bingsu');
    flyers.innerHTML = `
      <section class="home-feature home-feature-croffles" aria-labelledby="home-croffles-title">
        <div class="home-feature-inner">
          <div class="home-feature-copy">
            <p class="campaign-new">A little golden crunch</p>
            <h2 id="home-croffles-title">Premium<br><em>Croffles.</em></h2>
            <p>Croissant dough pressed in a waffle iron. Golden, flaky layers with your favorite toppings.</p>
            <a class="home-feature-link" href="#croffles">Explore croffles <span aria-hidden="true">→</span></a>
          </div>
          <div class="home-feature-food croffle-feature-food">
            <figure><img src="/assets/seo-optimized-20261031/croffles/biscoff-960.webp" width="960" height="640" loading="lazy" alt="Biscoff Caramel croffle with cream, cookie crumbs and caramel drizzle"><figcaption>Biscoff Caramel</figcaption></figure>
            <figure><img src="/assets/seo-optimized-20261031/croffles/dubai-strawberry-icecream-20261023-960.webp" width="960" height="640" loading="lazy" alt="Dubai Strawberry croffle with strawberry, pistachio and chocolate toppings"><figcaption>Dubai Strawberry</figcaption></figure>
          </div>
        </div>
      </section>
      <section class="home-feature home-feature-cups" aria-labelledby="home-cups-title">
        <div class="home-feature-inner">
          <div class="home-feature-copy">
            <p class="campaign-new">Your own little snow day</p>
            <h2 id="home-cups-title">Cup<br><em>Bingsu.</em></h2>
            <p>Our premium milk snow, layered with fruit, syrups and toppings. All the joy of bingsu, in a cup.</p>
            <a class="home-feature-link" href="#single-cups">Explore cup bingsu <span aria-hidden="true">→</span></a>
          </div>
          <div class="home-feature-food cup-feature-food">
            <figure><img src="/assets/seo-optimized-20261031/cups-cutout-20261029/mango-jelly-640.webp" width="640" height="640" loading="lazy" alt="Mango Jelly cup bingsu"><figcaption>Mango Jelly</figcaption></figure>
            <figure><img src="/assets/strawberry-mango-poprocks-20261106.png" width="640" height="640" loading="lazy" alt="Strawberry Mango Popping Candy cup bingsu"><figcaption>Strawberry Mango Popping Candy</figcaption></figure>
            <figure><img src="/assets/seo-optimized-20261031/cups-cutout-20261029/cookies-cream-640.webp" width="640" height="640" loading="lazy" alt="Cookies and Cream cup bingsu"><figcaption>Cookies and Cream</figcaption></figure>
          </div>
        </div>
      </section>`;
    home.append(flyers);

    // A full-size ingredient view keeps the compact phone catalog legible.
    const detailDialog = document.createElement('dialog');
    detailDialog.className = 'catalog-detail-dialog';
    detailDialog.innerHTML = '<button class="catalog-detail-close" type="button" aria-label="Close ingredients">×</button><div class="catalog-detail-content"></div>';
    document.body.append(detailDialog);
    const closeDetail = () => detailDialog.close();
    detailDialog.querySelector('.catalog-detail-close').addEventListener('click', closeDetail);
    detailDialog.addEventListener('click', event => {
      if (event.target !== detailDialog) return;
      const r = detailDialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDetail();
    });
    detailDialog.addEventListener('close', () => {
      document.body.classList.remove('catalog-detail-open');
      detailDialog.querySelector('.catalog-detail-content').replaceChildren();
    });
    menu.addEventListener('click', async event => {
      const trigger = event.target.closest('.ingredient-trigger');
      if (!trigger || !matchMedia('(max-width:760px)').matches) return;
      event.preventDefault(); event.stopImmediatePropagation();
      const card = cloneProduct(trigger.closest('.product-card'));
      card.classList.add('catalog-detail-card');
      const title = card.querySelector('.product-heading h4, :scope > h3');
      if (title) { title.id = 'catalog-detail-title'; detailDialog.setAttribute('aria-labelledby', title.id); }
      detailDialog.querySelector('.catalog-detail-content').replaceChildren(card);
      detailDialog.showModal();
      document.body.classList.add('catalog-detail-open');
      await window.SweetSnowIngredients?.enhance(card);
      if (detailDialog.open) {
        card.classList.add('ingredients-open');
        card.querySelector('.ingredient-trigger')?.setAttribute('aria-expanded', 'true');
      }
    }, true);

    let activeChapter = '';
    let animation;
    const closeMobileNav = () => {
      nav.classList.remove('is-open');
      const toggle = header.querySelector('.mobile-nav-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
      }
    };
    const showChapter = (name, explicit) => {
      if (detailDialog.open) detailDialog.close();
      const next = panels.get(name) || panels.get('discovery');
      const changed = activeChapter !== name;
      animation?.cancel();
      panels.forEach((panel, key) => { panel.hidden = key !== name; });
      hero.hidden = name !== 'discovery';
      footer.hidden = name !== 'visit';
      utility.hidden = name === 'visit';
      nav.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === ({discovery:'/',menu:'/menu',story:'/#brand-story',visit:'/visit'}[name])) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      activeChapter = name;
      closeMobileNav();
      if (changed && !reducedMotion.matches && next.animate) {
        animation = next.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 380, easing: 'ease-out' });
      }
      if (explicit) {
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
        next.focus({ preventScroll: true });
      }
    };
    const route = (explicit = true) => {
      const defaultHash = window.location.pathname.replace(/\/$/, '') === '/menu' ? '#menu' : window.location.pathname.replace(/\/$/, '') === '/visit' ? '#find-us' : '#discover';
      const hash = window.location.hash || defaultHash;
      const routes = {
        '#discover': ['discovery'], '#menu': ['menu'], '#menu-premium': ['menu', 'menu-classic'], '#menu-half-half': ['menu', 'menu-half-half'], '#menu-classic': ['menu', 'menu-classic'],
        '#menu-special': ['menu', 'menu-special'], '#single-cups': ['menu', 'single-cups'], '#food': ['menu', 'food'], '#mini-taiyaki': ['menu', 'food'], '#coming-soon': ['menu', 'coming-soon'],
        '#toppings': ['menu', 'toppings'], '#croffles': ['menu', 'croffles'], '#drinks': ['menu', 'drinks'], '#brand-story': ['story'], '#find-us': ['visit'], '#visit': ['visit']
      };
      const target = routes[hash] || (cardById.has(hash.slice(1)) ? ['menu', hash.slice(1)] : null);
      if (!target) return;
      showChapter(target[0], explicit && !target[1]);
      if (target[1]) requestAnimationFrame(() => {
        const destination = document.getElementById(target[1]);
        if (!destination) return;
        const offset = header.getBoundingClientRect().height + catalogNav.getBoundingClientRect().height + 20;
        window.scrollTo({ top: destination.getBoundingClientRect().top + window.scrollY - offset, behavior: explicit && !reducedMotion.matches ? 'smooth' : 'instant' });
        if (explicit && cardById.has(destination.id)) destination.querySelector('.ingredient-trigger')?.focus({ preventScroll: true });
      });
    };
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      const known = ['#discover', '#menu', '#menu-premium', '#menu-half-half', '#menu-classic', '#menu-special', '#single-cups', '#food', '#mini-taiyaki', '#croffles', '#drinks', '#coming-soon', '#toppings', '#brand-story', '#find-us', '#visit'];
      if (!known.includes(hash) && !cardById.has(hash.slice(1))) return;
      event.preventDefault();
      if (window.location.hash === hash) route(true);
      else window.location.hash = hash;
    });
    window.addEventListener('hashchange', () => route(true));
    // Establish a safe default before resolving a deep or unknown initial hash.
    showChapter(location.pathname === '/menu' ? 'menu' : location.pathname === '/visit' ? 'visit' : 'discovery', false);
    route(false);
    window.SweetSnowLanguage?.refresh?.();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
