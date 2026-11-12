(() => {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const imagePath = key => `/designs/toppings/${encodeURIComponent(key)}.webp`;
  let manifest = [];

  const language = () => window.SweetSnowLanguage?.get?.() === 'ko' ? 'ko' : 'en';
  const label = item => language() === 'ko' ? item.ko : item.en;
  const cell = item => `<li class="topping-gallery-cell" data-key="${esc(item.key)}"><img src="${imagePath(item.key)}" alt="" width="120" height="120" loading="lazy" decoding="async"><span data-en="${esc(item.en)}" data-ko="${esc(item.ko)}">${esc(label(item))}</span></li>`;
  const addon = item => `<figure class="topping-addon-item" data-key="${esc(item.key)}"><img src="${imagePath(item.key)}" alt="" width="120" height="120" loading="lazy" decoding="async"><figcaption data-en="${esc(item.en)}" data-ko="${esc(item.ko)}">${esc(label(item))}</figcaption></figure>`;

  function render() {
    const list = document.querySelector('.customize-toppings');
    if (list) list.innerHTML = manifest.filter(item => item.category !== 'cream-top' && item.category !== 'extra-fruit').map(cell).join('');
    const cream = manifest.find(item => item.category === 'cream-top');
    const creamFeature = document.querySelector('.featured-addons .cream-top-feature');
    if (cream && creamFeature && !creamFeature.querySelector('.topping-addon-gallery')) creamFeature.insertAdjacentHTML('beforeend', `<div class="topping-addon-gallery">${addon(cream)}</div>`);
    const fruit = manifest.filter(item => item.category === 'extra-fruit');
    const fruitFeature = document.querySelector('.featured-addons .fruit-addon-feature');
    if (fruitFeature && fruit.length && !fruitFeature.querySelector('.topping-addon-gallery')) {
      const copy = fruitFeature.querySelector('.fruit-addon-note');
      const listCopy = [...fruitFeature.children].find(node => node.tagName === 'P' && node !== copy && !node.classList.contains('eyebrow'));
      if (listCopy) listCopy.hidden = true;
      fruitFeature.insertAdjacentHTML('beforeend', `<div class="topping-addon-gallery topping-fruit-gallery">${fruit.map(addon).join('')}</div>`);
    }
  }
  function translate() {
    document.querySelectorAll('[data-en][data-ko]').forEach(node => { node.textContent = language() === 'ko' ? node.dataset.ko : node.dataset.en; });
  }
  fetch('/topping-image-manifest.json').then(response => response.ok ? response.json() : []).then(items => { manifest = items; render(); translate(); });
  document.addEventListener('sweetsnowlanguagechange', translate);
})();
