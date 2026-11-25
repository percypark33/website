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
    label: "Shine Muscat Aloe Bingsu",
    title: "Korean Bingsu in Garden Grove",
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
  homeWaffles: ["House Cream Waffle", "Strawberry Cheesecake Waffle", "Shine Muscat Yogurt Mochi Waffle"],

  /* ---- COMING SOON, NOT IN THE MENU FILE YET -------------------- */
  mochiIceCream: {
    show: true,
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
    title: "Waffles",
    blurb: "A full-size waffle, freshly baked, folded and stuffed with cream.",
    items: [
      { name: "House Cream Waffle", text: "Freshly baked crispy waffle · house-made mascarpone cream",
        photo: "/assets/waffles/house-cream-20261124.png", alt: "Folded waffle opened to show mascarpone cream" },
      { name: "Apple Cinnamon Waffle", text: "House-made mascarpone cream · apple jam · cinnamon powder",
        photo: "/assets/waffles/apple-cinnamon-20261124.png", alt: "Folded waffle opened to show mascarpone cream, apple jam and cinnamon" },
      { name: "Cookies & Cream Waffle", text: "House-made mascarpone cream · Oreo crumbs · Nutella spread",
        photo: "/assets/waffles/cookies-cream-20261124.png", alt: "Folded waffle opened to show mascarpone cream, Oreo crumbs and Nutella" },
      { name: "Chocolate Banana Fudge Waffle", text: "Nutella spread · bananas · cream · brownie bites · premium cacao powder",
        photo: "/assets/waffles/chocolate-banana-fudge-20261124.png", alt: "Folded waffle opened to show Nutella, bananas, cream, brownie bites and cacao powder" },
      { name: "Strawberry Cheesecake Waffle", text: "Strawberries · cream · cheesecake bites",
        photo: "/assets/waffles/strawberry-cheesecake-20261124.png", alt: "Folded waffle opened to show strawberries, cream and cheesecake bites" },
      { name: "Yogurt Fruit Mochi Waffle", text: "House-made yogurt cream · mochi sheet · strawberries · mangoes · green grapes",
        photo: "/assets/waffles/yogurt-fruit-mochi-20261124.png", alt: "Folded waffle opened to show yogurt cream, a mochi sheet, strawberries, mango and green grapes" },
      { name: "Shine Muscat Yogurt Mochi Waffle", text: "House-made yogurt cream · mochi sheet · shine muscats",
        photo: "/assets/waffles/shine-muscat-yogurt-mochi-20261124.png", alt: "Folded waffle opened to show yogurt cream, a mochi sheet and shine muscat grapes" }
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
    // Classic
    "Black Sesame": "/assets/bowl-black-sesame-natural.png",
    "Injeolmi": "/assets/bowl-injeolmi-natural.png",
    "Mango": "/assets/bowl-mango-natural.png",
    "Strawberry": "/assets/bowl-strawberry-realphoto-natural.png",
    "Cookies and Cream": "/assets/bowl-cookies-cream-natural.png",
    // Special
    "Matcha Strawberry": "/assets/bowl-matcha-strawberry-natural.png",
    "Lychee Heaven": "/assets/bowl-lychee-realphoto-natural.png",
    "Hojicha Tiramisu": "/assets/bowl-hojicha-syrup-natural.png",
    "Matcha Banana Cream": "/assets/bowl-matcha-banana-natural.png",
    "Strawnana Pie": "/assets/bowl-strawnana-natural.png",
    "Shine Muscat Aloe Bingsu": "/assets/bowl-shine-muscat-preview-20261026.png",
    "Honeycomb x2": "/assets/bowl-honeycomb-x2-20261101.png",
    "Sweet Potato Cream Bingsu": "/assets/bowl-sweet-potato-cream-20261109.webp",
    // Fruit Half & Half
    "Mango & Strawberry": "/assets/bowl-half-half-natural.png",
    "Lychee & Shine Muscat": "/assets/bowl-shine-lychee-preview-20261026.png",
    "Mango & Lychee": "/assets/bowl-mango-lychee-20261028.png",
    "Strawberry & Shine Muscat": "/assets/bowl-strawberry-shine-20261028.png",
    // Croffles
    "Injeolmi Croffle": "/assets/croffles/injeolmi.png",
    "Biscoff Caramel Croffle": "/assets/croffles/biscoff.png",
    "Cookies and Cream Croffle": "/assets/croffles/oreo-tiramisu.png",
    "Dubai Strawberry Croffle": "/assets/croffles/dubai-strawberry-icecream-20261023.png",
    "Plain Croffle": "/assets/croffles/plain-powdered-sugar-20261025.png"
  }
};
