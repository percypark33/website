/* ============================================================
   SWEET SNOW — WEBSITE SETTINGS  (the easy file)
   ------------------------------------------------------------
   Change something here, save, and the website rebuilds itself.

   Menu names, recipes and prices still live in
   menu-2026-august.js. This file sits on top of it:
   the website reads the menu first, then applies what is here.

   Rules:
     - Keep the quote marks "" around every piece of text.
     - Keep the commas at the end of each line.
     - Anything after //  is a private note; it never shows.
     - Item names must match the menu exactly, for example
       "Mango" or "Mango Jelly Cup".
   ============================================================ */

window.SITE_SETTINGS = {

  /* ---- THE LOOK --------------------------------------------
     "milk-snow"  (light and airy)                              */
  look: "milk-snow",

  /* ---- THE BIG ITEM AT THE TOP OF THE HOME PAGE -------------
     To feature a different item, change `item` to its menu name.
     `label`, `title` and `text` are the words next to the photo.
     Leave `title` or `text` as "" to use the menu name and
     ingredients instead.                                        */
  hero: {
    item: "Shine Muscat Aloe Bingsu",
    label: "New at Sweet Snow",
    title: "Shine Muscat Aloe",
    text: "Juicy Korean Shine Muscats, aloe vera, and green grape yogurt syrup over our premium milk snow. Finished with yogurt ice cream."
  },

  /* ---- PRICES ------------------------------------------------
     false = the website shows no prices.
     true  = show the price next to each item.                   */
  showPrices: true,

  /* ---- QUICK MENU EDITS (website only) ------------------------
     One line per change. Remove the // at the start to switch a
     line on. TV menus and Square keep their own prices.

     Change a price:        "Mango": { price: 15.99 },
     Change the recipe:     "Mango": { ing: "Fresh Mango · Mochi" },
     Change the name:       "Mango": { name: "Mango Bingsu" },
     Mark coming soon:      "Mango": { comingSoon: true },
     Hide from the website: "Mango": { hidden: true },           */
  menuEdits: {
    "Injeolmi Croffle": { price: 6.99 },
    "Biscoff Caramel Croffle": { price: 7.99 },
    "Cookies and Cream Croffle": { hidden: true },
    "Dubai Strawberry Croffle": { hidden: true },
    "Matcha Strawberry": { price: 16.99 },
    "Lychee Heaven": { price: 17.99 },
    "Shine Muscat Aloe Bingsu": { price: 17.99 },
    "Sweet Potato Cream Bingsu": { price: 15.99 },
    "Lychee & Shine Muscat": { price: 18.99 },
    "Mango & Lychee": { price: 17.99 },
    "Strawberry & Shine Muscat": { price: 17.99 },
    // Off the menu for now (owner, 2026-11-22). Delete these lines to bring them back.
    "Strawnana Pie": { hidden: true },
    "Matcha Banana Cream": { hidden: true },
    "Hojicha Tiramisu": { hidden: true },
    // Mini taiyaki off the website (2026-11-24). Delete these lines to bring them back.
    "Red Bean": { hidden: true },
    "Custard": { hidden: true },
    "Cheese": { hidden: true },
    "Sweet Potato": { hidden: true },
    "Nutella": { hidden: true },
    "Dubai Chocolate": { hidden: true },
  },

  /* ---- THE BOWL THAT BUILDS ITSELF AS YOU SCROLL --------------
     Uses your drawing from menu-art.js. Any flavor drawn there
     works: "Mango", "Strawberry", "Mango & Strawberry",
     "Matcha Strawberry", "Injeolmi", "Black Sesame" ...
     `buildBowlLeaveOut` hides parts of the drawing that are not
     in today's recipe. The drawing file itself is not changed.
     To show them again, make it:  buildBowlLeaveOut: [],        */
  buildBowl: "Mango",
  buildBowlLeaveOut: ["coconut flakes"],
  /* WHICH VERSION SHOWS. One word switches it:
       "drawing"  your mango drawing, layers drop in (what shows now)
       "photo"    the real photo named in buildBowlPhoto, uncovered bottom to top
       "stages"   the Lychee Heaven pictures and clips in buildBowlStages      */
  buildBowlMode: "drawing",
  /* For "photo": a menu item's name. Its photo is uncovered as you scroll. */
  buildBowlPhoto: "Lychee Heaven",
  /* Or build the bowl in stages, one picture per step. While this list has
     pictures, it is what the home page shows. `title` and `text` are the words
     next to each step. To switch it off, make it:  buildBowlStages: [],
     The pictures were made with Runway from the real Lychee Heaven photo.
     A step can also have `clip`: a short silent video that plays once when
     the step is reached (the jelly and syrup going in, the scoop, the
     drizzle). Take `clip: "…"` out of a line to switch that video off.     */
  buildBowlStagesName: "Lychee Heaven",
  buildBowlStages: [
    { title: "Milk snow", text: "Real milk shaved into soft snow — creamy, never watery.", photo: "/assets/build-lychee-heaven/1-milk-snow-half.webp" },
    { title: "Coconut jelly", text: "In the middle, with the syrup.", photo: "/assets/build-lychee-heaven/2-jelly-syrup-middle.webp", clip: "/assets/build-lychee-heaven/2-jelly-syrup-added.mp4" },
    { title: "More milk snow", text: "Piled high on top.", photo: "/assets/build-lychee-heaven/3-milk-snow-full.webp" },
    { title: "Fruit & toppings", text: "Real fruit · Cut fresh daily · Made to order", photo: "/assets/build-lychee-heaven/4-lychee-boba.webp" },
    { title: "Ice cream", text: "A scoop on top.", photo: "/assets/build-lychee-heaven/5-yogurt-ice-cream.webp", clip: "/assets/build-lychee-heaven/5-ice-cream-scoop.mp4" },
    { title: "House-made syrup", text: "Flavor in layers.", photo: "/assets/build-lychee-heaven/6-lychee-yogurt-syrup.webp", clip: "/assets/build-lychee-heaven/6-syrup-drizzle.mp4" },
    { title: "The finish", text: "Each flavor has its own finish.", photo: "/assets/build-lychee-heaven/7-coconut-flakes-mochi.webp" }
  ],

  /* ---- TAGLINE AND LINKS -------------------------------------- */
  tagline: "Authentic Korean Bingsu",
  links: {
    order: "https://cash.app/$sweetsnowus",
    delivery: "https://www.doordash.com/store/sweet-snow-garden-grove-52186263/122031760/",
    maps: "https://www.google.com/maps/search/?api=1&query=Sweet%20Snow%209772%20Garden%20Grove%20Blvd%20Garden%20Grove%2C%20CA%2092844",
    instagram: "https://www.instagram.com/sweetsnowusa/"
  },

  /* ---- HOME PAGE FEATURES -------------------------------------
     The croffles and cups shown on the home page.               */
  homeCroffles: ["Plain Croffle", "Biscoff Caramel Croffle"],
  homeCups: ["Mango Jelly Cup", "Strawberry Mango Popping Candy Cup", "Cookies and Cream Cup"],
  /* Three waffles shown on the home page, by their names in wafflesSoon below.
     To take the waffles off the home page, make it:  homeWaffles: [],          */
  homeWaffles: ["House Cream", "Nutella Strawberry", "Shine Muscat Yogurt Cream Mochi"],

  /* ---- COMING SOON, NOT IN THE MENU FILE YET -------------------- */
  mochiIceCream: {
    show: false,
    badge: "Coming Soon",
    name: "Matcha Mochi Ice Cream",
    text: "Served with fresh strawberries.",
    options: "One or two scoops",
    photo: "/assets/mochi-20261108/white-bowl-v3.webp",
    alt: "Matcha mochi ice cream in a white bowl with glazed fresh strawberries"
  },

  /* ---- STUFFED WAFFLES ------------------------------------
     Shown on the menu page under "Waffles". One full-size waffle,
     folded in half around the filling. Change a name or the words
     here. To hide the whole section, make it:  show: false       */
  wafflesSoon: {
    show: true,
    badge: "Coming Soon",
    title: "Full Size Belgian Waffles",
    blurb: "A full-size waffle, freshly baked, folded and stuffed with cream.",
    items: [
      {"group": "Classic", "name": "House Cream", "price": "From $8.99", "text": "Mascarpone cream", "photo": "/assets/waffles/house-cream-flat.webp", "alt": "House Cream served on an open Belgian waffle"},
      {"group": "Classic", "name": "Apple Cinnamon", "price": "$9.99", "text": "Smooth apple jam · house-made cream · cinnamon powder", "photo": "/assets/waffles/apple-jam-cream-cinnamon-flat.webp", "alt": "Apple Cinnamon served on an open Belgian waffle"},
      {"group": "Classic", "name": "Nutella Cookies & Cream", "price": "$9.99", "text": "Nutella · fine Oreo crumbs · cream", "photo": "/assets/waffles/cookies-fine-crumb-flat.webp", "alt": "Nutella Cookies & Cream served on an open Belgian waffle"},
      {"group": "Classic", "name": "Nutella Strawberry", "price": "$10.99", "text": "Nutella spread · house cream · fresh strawberries · powdered sugar", "photo": "/assets/waffles/nutella-strawberry-flat.webp", "alt": "Nutella Strawberry served on an open Belgian waffle"},
      {"group": "Classic", "name": "Nutella Banana", "price": "$10.99", "text": "Nutella spread · house cream · fresh banana · powdered sugar", "photo": "/assets/waffles/nutella-banana-flat.webp", "alt": "Nutella Banana served on an open Belgian waffle"},
      {"group": "Special", "name": "Mango Yogurt Cream Mochi", "price": "$12.99", "text": "Yogurt cream · powdered mochi sheet triangles · mango", "photo": "/assets/waffles/mango-yogurt-cream-mochi-flat.webp", "alt": "Mango Yogurt Cream Mochi served on an open Belgian waffle"},
      {"group": "Special", "name": "Shine Muscat Yogurt Cream Mochi", "price": "$13.99", "text": "Yogurt cream · powdered mochi sheet triangles · Shine Muscat grapes", "photo": "/assets/waffles/shine-muscat-yogurt-mochi-triangles-flat.webp", "alt": "Shine Muscat Yogurt Cream Mochi served on an open Belgian waffle"},
      {"group": "Special", "name": "Nutella Chocolate Banana Fudge", "price": "$13.99", "text": "Nutella spread · house cream · bananas · brownie bites · Heath toffee · chocolate drizzle", "photo": "/assets/waffles/banana-fudge-heath-flat.webp", "alt": "Nutella Chocolate Banana Fudge served on an open Belgian waffle"},
      {"group": "Special", "name": "Dubai Chocolate Strawberry", "price": "$14.99", "text": "Nutella spread · pistachio kataifi spread · strawberries · vanilla ice cream · chocolate drizzle · crushed pistachios", "photo": "/assets/waffles/dubai-chocolate-strawberry-flat.webp", "alt": "Dubai Chocolate Strawberry served on an open Belgian waffle"}
    ]
  },

  /* ---- DRINKS, COMING SOON -------------------------------------
     Shown on the menu page under "Drinks". No prices yet.
     Change a name or the words here. To hide the whole section,
     make it:  show: false                                        */
  drinksSoon: {
    show: true,
    badge: "Coming Soon",
    title: "Drinks",
    blurb: "Pink coconut water topped with our house-made fruit cream.",
    items: [
      {
        name: "Strawberry Coconut Cloud",
        text: "Pink coconut water · house-made strawberry cream",
        photo: "/assets/drinks/strawberry-coconut-cloud-20261123.png",
        alt: "Pink coconut water with a pink strawberry cream top in a clear cup"
      },
      {
        name: "Mango Coconut Cloud",
        text: "Pink coconut water · house-made mango cream",
        photo: "/assets/drinks/mango-coconut-cloud-20261123.png",
        alt: "Pink coconut water with a pale mango cream top in a clear cup"
      }
    ]
  },

  /* ---- PHOTOS -------------------------------------------------
     Which picture goes with which item. Cups and mini taiyaki
     already name their picture in menu-2026-august.js.
     For a new bowl or croffle, add a line here.                 */
  photos: {
    "Cookies and Cream Cup": "/assets/bingsu-tv/cookies-cream.webp",
    "Mango Jelly Cup": "/assets/bingsu-tv/mango-jelly.webp",
    "Matcha Red Bean Cup": "/assets/bingsu-tv/matcha-red-bean-crunch.webp",
    "Injeolmi Jollypong Cup": "/assets/bingsu-tv/injeolmi-jollypong.webp",
    "Viet Coffee Cup": "/assets/bingsu-tv/cups-viet-coffee-20261101.webp",
    "Biscoff Caramel Cup": "/assets/bingsu-tv/cups-biscoff-caramel-20261101.webp",
    // Classic
    "Black Sesame": "/assets/bingsu-tv/b-black-sesame.webp",
    "Injeolmi": "/assets/bingsu-tv/b-injeolmi-classic.webp",
    "Mango": "/assets/bingsu-tv/b-mango.webp",
    "Strawberry": "/assets/bingsu-tv/b-strawberry.webp",
    "Cookies and Cream": "/assets/bingsu-tv/b-cookies-cream-crumb-layer.webp",
    // Special
    "Matcha Strawberry": "/assets/bingsu-tv/b-matcha-strawberry.webp",
    "Lychee Heaven": "/assets/bingsu-tv/b-lychee.webp",
    "Hojicha Tiramisu": "/assets/bowl-hojicha-syrup-natural.png",
    "Matcha Banana Cream": "/assets/bowl-matcha-banana-natural.png",
    "Strawnana Pie": "/assets/bowl-strawnana-natural.png",
    "Shine Muscat Aloe Bingsu": "/assets/bingsu-tv/b-shine-muscat.webp",
    "Honeycomb x2": "/assets/bingsu-tv/b-honeycomb-x2.webp",
    "Sweet Potato Cream Bingsu": "/assets/bowl-sweet-potato-cream-20261109.webp",
    // Fruit Half & Half
    "Mango & Strawberry": "/assets/bingsu-tv/b-half-half.webp",
    "Lychee & Shine Muscat": "/assets/bingsu-tv/b-shine-lychee.webp",
    "Mango & Lychee": "/assets/bingsu-tv/b-mango-lychee.webp",
    "Strawberry & Shine Muscat": "/assets/bingsu-tv/b-strawberry-shine.webp",
    // Croffles
    "Injeolmi Croffle": "/assets/croffles/injeolmi.png",
    "Biscoff Caramel Croffle": "/assets/croffles/biscoff.png",
    "Cookies and Cream Croffle": "/assets/croffles/oreo-tiramisu.png",
    "Dubai Strawberry Croffle": "/assets/croffles/dubai-strawberry-icecream-20261023.png",
    "Plain Croffle": "/assets/croffles/plain-powdered-sugar-20261025.png"
  }
};
