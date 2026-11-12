(() => {
  'use strict';
  function cleanName(name) { return (name || '').replace(/\s+/g, ' ').trim(); }
  function setOpen(card, open) {
    card.classList.toggle('ingredients-open', open);
    const trigger = card.querySelector('.ingredient-trigger');
    const hint = card.querySelector('.touch-ingredient-hint');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} ingredients for ${card.dataset.name}`);
    if (hint) hint.textContent = open ? 'Hide ingredients' : 'Tap photo for ingredients';
  }
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const labelsFrom = description => description.split(/\s*·\s*/).map(s => s.trim()).filter(Boolean);
  function mapFor(map, name) {
    return map[cleanName(name)] || map[cleanName(name).replace(/\s+Specialty$/i, ' Special').replace(/\s+Special$/i, ' Specialty')] || [];
  }
  function layoutFor(points) {
    // Keep every box in a separate row, in two readable columns.
    const ordered=points.map((point,index)=>({point,index})).sort((a,b)=>a.point.y-b.point.y);
    const sides={left:[],right:[]}, result=[];
    ordered.forEach(entry=>{
      let side=entry.point.x<50?'left':'right';
      if(sides[side].length>=Math.ceil(points.length/2))side=side==='left'?'right':'left';
      sides[side].push(entry);
    });
    Object.entries(sides).forEach(([side,entries])=>entries.forEach((entry,row)=>{
      result[entry.index]={side,x:side==='left'?2:54,y:8+row*(76/Math.max(entries.length,1))};
    }));
    return result;
  }
  function makeAnnotations(card, labels, points, cardId) {
    const trigger = card.querySelector('.ingredient-trigger');
    if (!trigger || !labels.length) return;
    trigger.querySelector('.ingredient-annotations')?.remove();
    const layer = document.createElement('span'); layer.className = 'ingredient-annotations'; layer.setAttribute('aria-hidden', 'true');
    const anchors = labels.map((label, index) => points.find(p=>p.label.toLowerCase()===label.toLowerCase().replace(/ on the side$/,'')) || { x: index%2 ? 36 : 64, y: 24+index*6, label });
    layoutFor(anchors).forEach((position, index) => {
      const ingredient = anchors[index], markerId = `ingredient-arrow-${cardId}-${index}`;
      const item = document.createElement('span'); item.className = 'ingredient-annotation';
      item.classList.add(`ingredient-annotation--${position.side}`);
      item.style.setProperty('--reveal-delay', `${index*28}ms`);
      item.style.setProperty('--label-x', `${position.x}%`); item.style.setProperty('--label-y', `${position.y}%`);
      item.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><defs><marker id="${markerId}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8"/></marker></defs><line/></svg><b></b>`;
      const line = item.querySelector('line');
      line.setAttribute('x1', position.side === 'left' ? 43 : 55); line.setAttribute('y1', position.y+5);
      line.setAttribute('x2', ingredient.x); line.setAttribute('y2', ingredient.y);
      line.setAttribute('marker-end', `url(#${markerId})`);
      item.querySelector('b').textContent = labels[index]; layer.append(item);
    });
    trigger.append(layer);
  }
  async function getMap() {
    try { const response = await fetch('/designs/ingredient-map.json', { cache: 'no-cache' }); return response.ok ? response.json() : {}; }
    catch (_) { return {}; }
  }

  const ingredientMap = getMap();
  const cupIngredientPoints = {
  "Mango Jelly Cup": {
    "Milk snow": [
      50,
      83
    ],
    "mango syrup": [
      55,
      63
    ],
    "coconut jelly in the middle": [
      40,
      66
    ],
    "mango": [
      63,
      31
    ],
    "mango popping boba": [
      70,
      24
    ],
    "mango star jelly": [
      43,
      24
    ],
    "condensed milk": [
      50,
      34
    ],
    "sprinkles": [
      50,
      16
    ]
  },
  "Cookies and Cream Cup": {
    "Milk snow": [
      50,
      80
    ],
    "cookie crumbs in the middle": [
      40,
      60
    ],
    "cookie crumbs": [
      36,
      29
    ],
    "house-made cream": [
      50,
      25
    ],
    "cacao powder": [
      65,
      24
    ],
    "Oreos": [
      50,
      12
    ]
  },
  "Injeolmi Jollypong Cup": {
    "Milk snow": [
      50,
      80
    ],
    "injeolmi powder": [
      43,
      56
    ],
    "corn flakes in the middle": [
      40,
      62
    ],
    "almonds": [
      61,
      57
    ],
    "condensed milk": [
      50,
      43
    ],
    "red beans": [
      65,
      32
    ],
    "mochi": [
      67,
      20
    ],
    "Jollypong": [
      34,
      23
    ]
  },
  "Strawberry Mango Popping Candy Cup": {
  "Milk snow": [
    50,
    83
  ],
  "strawberries and strawberry syrup in the middle": [
    45,
    64
  ],
  "strawberry popping boba in the middle": [
    65,
    65
  ],
  "mango and mango syrup on top": [
    50,
    30
  ],
  "mango popping boba": [
    35,
    23
  ],
  "strawberry-flavored Pop Rocks over the mango": [50, 20]
}

};
  const enhancedCards = new WeakSet();
  let nextCardId = 0;

  function cardsWithin(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return [];
    const cards = root.matches?.('.product-card') ? [root] : [];
    return cards.concat([...root.querySelectorAll('.product-card')]);
  }

  async function enhance(root = document) {
    const map = await ingredientMap;
    cardsWithin(root).forEach(card => {
      if (enhancedCards.has(card)) return;
      const trigger = card.querySelector('.ingredient-trigger'), description = card.querySelector('.menu-ingredient-description');
      if (!trigger || !description) return;
      enhancedCards.add(card);
      const cardId = nextCardId++;
      description.id = `menu-ingredients-${cardId}`; trigger.setAttribute('aria-controls', description.id);
      const rebuild = () => {
        const labels = labelsFrom(card.dataset.ingredients || description.textContent);
        const cupPoints = cupIngredientPoints[card.dataset.name] || {};
        const points = card.dataset.kind === 'cup' ? labels.map((label,i)=>{const point=cupPoints[label];return {label,x:point?.[0] ?? (i%2?62:38),y:point?.[1] ?? (/milk snow/i.test(label)?75:/syrup|layer/i.test(label)?60:18+i*3)};}) : [...mapFor(map, card.dataset.name)];
        if (card.dataset.kind === 'bingsu' && !points.some(point => point.label === 'Milk base')) points.unshift({ label: 'Milk base', x: 50, y: 76 });
        makeAnnotations(card, labels, points, cardId);
      };
      rebuild();
      trigger.addEventListener('click', () => setOpen(card, !card.classList.contains('ingredients-open')));
      card.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') setOpen(card, true); });
      card.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse' && !card.contains(document.activeElement)) setOpen(card, false); });
      trigger.addEventListener('focus', () => { if(matchMedia('(hover:hover)').matches)setOpen(card,true); });
      trigger.addEventListener('keydown', event => { if (event.key === 'Escape') { setOpen(card, false); trigger.focus(); } });
      card.addEventListener('focusout', event => { if (!card.contains(event.relatedTarget)) setOpen(card, false); });
    });
    window.SweetSnowLanguage?.refresh?.();
  }

  window.SweetSnowIngredients = window.SweetSnowIngredients || {};
  window.SweetSnowIngredients.enhance = enhance;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { enhance(); }, { once: true }); else enhance();
})();
