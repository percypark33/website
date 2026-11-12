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
     false = the website shows no prices (how it is today).
     true  = show the price next to each item.                   */
  showPrices: false,

  /* ---- QUICK MENU EDITS (website only) ------------------------
     One line per change. Remove the // at the start to switch a
     line on. TV menus and Square keep their own prices.

     Change a price:        "Mango": { price: 15.99 },
     Change the recipe:     "Mango": { ing: "Fresh Mango · Mochi" },
     Change the name:       "Mango": { name: "Mango Bingsu" },
     Mark coming soon:      "Mango": { comingSoon: true },
     Hide from the website: "Mango": { hidden: true },           */
  menuEdits: {
    // "Mango": { price: 15.99 },
  },

  /* ---- THE BOWL THAT BUILDS ITSELF AS YOU SCROLL --------------
     Uses your drawing from menu-art.js. Any flavor drawn there
     works: "Mango", "Strawberry", "Mango & Strawberry",
     "Matcha Strawberry", "Injeolmi", "Black Sesame" ...         */
  buildBowl: "Mango",

  /* ---- TAGLINE AND LINKS -------------------------------------- */
  tagline: "Authentic Korean Bingsu",
  links: {
    order: "https://cash.app/$sweetsnowus",
    delivery: "https://www.doordash.com/store/sweet-snow-garden-grove-52186263/122031760/",
    maps: "https://www.google.com/maps/search/?api=1&query=Sweet%20Snow%209772%20Garden%20Grove%20Blvd%20Garden%20Grove%2C%20CA%2092844",
    instagram: "https://www.instagram.com/sweetsnow_oc/"
  },

  /* ---- HOME PAGE FEATURES -------------------------------------
     The croffles and cups shown on the home page.               */
  homeCroffles: ["Biscoff Caramel Croffle", "Dubai Strawberry Croffle"],
  homeCups: ["Mango Jelly Cup", "Strawberry Mango Popping Candy Cup", "Cookies and Cream Cup"],

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

  /* ---- PHOTOS -------------------------------------------------
     Which picture goes with which item. Cups and mini taiyaki
     already name their picture in menu-2026-august.js.
     For a new bowl or croffle, add a line here.                 */
  photos: {
    // Classic
    "Black Sesame": "/assets/bowl-black-sesame-natural.png",
    "Injeolmi Jollypong": "/assets/bowl-injeolmi-jollypong-preview-20261026.png",
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
    "Dubai Strawberry Croffle": "/assets/croffles/dubai-strawberry-icecream-20261023.png"
  }
};
