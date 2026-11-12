/* ============================================================
   SWEET SNOW — MENU · 2026 AUGUST (shared)
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT.

   Both the website (sweetsnow.org) and the TV menu boards read
   this one file, so changing a price here updates all of them.

   The older five-flavor cup list is archived in
   cup-bingsu-saved.js. Live cups live in cupBingsu below.

   After editing, to make fresh TV images:
     cd ~/sweet-snow/menus/tv-2026 && ./export.sh

   Rules:
     - Keep the quote marks "" around every piece of text.
     - Keep the commas at the end of each line.
     - To remove an item, delete its whole { ... } block.
     - Anything after //  is a private note; it never shows.
   ============================================================ */

window.MENU = {

  // Sweetness is a taste rating, not a sugar-content measurement.
  // Add each menu name and its confirmed rating here (for example: Mango: 2).
  // Missing ratings display as "Not rated yet"; never assume a rating.
  sweetness: {
    levels: [1, 2, 3],
    ratings: {
      "Mango": 3,
      "Strawberry": 2,
      "Cookies and Cream": 3,
      "Cereal Killer": 3,
      "Matcha Banana Cream": 3,
      "Matcha Strawberry": 3,
      "Dubai Chocolate": 3,
      "Melon": 2,
      "Lychee Heaven": 2,
      "Watermelon": 2,
      "Blueberry Yogurt Cheesecake": 2,
      "Açaí": 2,
      "Strawnana Pie": 2,
      "Injeolmi": 1,
      "Black Sesame": 1
    }
  },

  brand: {
    name: "Sweet Snow",
    tagline: "Korean Shaved Ice",
    blurb: "Real milk shaved into soft snow — creamy, never watery.",
    venue: "Inside QT Golden Market Place",
    street: "9772 Garden Grove Blvd",
    city: "Garden Grove, CA 92844",
    instagram: "sweetsnow_oc",
    url: "sweetsnow.org"
  },

  /* ---- SHAVED MILK + SHAVED ICE --------------------------- */
  bingsu: {
    title: "Bingsu",
    blurb: "Real milk shaved into soft snow — creamy, never watery.",
    price: "14.99",
    priceNote: "serves 2–3 people",
    qualityNote: "Made with quality ingredients.",
    mixNote: "",
    mixSeasonNote: "",
    cupSoon: "",
    marketNote: "Prices can change at any time based on market prices. Thank you.",
    specialNote: "We try to use healthier, organic ingredients. Special menus may be gone anytime without notice.",

    /* Milk-snow base: $14.99, with syrup, condensed milk and main topping.
       Specials add toppings and a cream OR ice cream finish, priced $16.99–$18.99.
       Never combine cream and an ice cream scoop on the same recipe.
       Classic Pat Bingsu uses shaved ice and has its own $13.99 price. */
    classicOrder: ["Milk & Honeycomb","Mango","Strawberry","Mango & Strawberry","Injeolmi","Black Sesame","Watermelon","Matcha Red Beans","Cookies and Cream","Blueberry Yogurt Cheesecake"],
    specialOrder: ["Mango Special","Strawberry Special","Matcha Strawberry","Cereal Killer","Strawnana Pie","Hojicha Tiramisu","Matcha Banana Cream","Lychee Heaven","Açaí"],
    flavors: [
      {
        "name": "Milk & Honeycomb",
        "badge": "CLASSIC",
        "ing": "condensed milk · 100% organic raw honeycomb",
        "price": "14.99"
      },
      {
  "name": "Matcha Red Beans",
        "inventoryName": "Matcha",
  "badge": "CLASSIC",
  "ing": "matcha syrup · matcha powder · red beans · mochi",
  "price": "14.99"
},
      {
        "name": "Mango",
        "badge": "CLASSIC",
        "ing": "mango · house-made syrup · mochi",
        "price": "14.99",
        "red": false,
        "staffPicks": [
          "Cheesecake bites",
          "Strawberry popping boba",
          "Mango popping boba",
          "Yogurt ice cream"
        ]
      },
      {
        "name": "Mango Special",
        "badge": "SPECIAL",
        "specialOf": "Mango",
        "price": "18.99",
        "ing": "Mango bingsu + toasted coconut flakes · mango popping boba · coconut jelly · yogurt vanilla ice cream",
        "specialNote": "Loaded with toppings of our choice for a discounted price."
      },
      {
        "name": "Strawberry",
        "inventoryName": "Strawberry Cheesecake",
        "artName": "Strawberry",
        "badge": "CLASSIC",
        "ing": "strawberry · house-made syrup · mochi",
        "price": "14.99",
        "staffPicks": [
          "Cheesecake bites",
          "Strawberry popping boba",
          "Mango popping boba",
          "Yogurt ice cream"
        ]
      },
      {
        "name": "Strawberry Special",
        "badge": "SPECIAL",
        "specialOf": "Strawberry",
        "price": "18.99",
        "ing": "Strawberry bingsu + cheesecake bites · Biscoff crumbs · vanilla ice cream",
        "specialNote": "Loaded with toppings of our choice for a discounted price."
      },
      {
        "name": "Mango & Strawberry",
        "subtitle": "Half-and-half",
        "artName": "Mango & Strawberry",
        "badge": "CLASSIC",
        "price": "15.99",
        "ing": "mango · strawberry · house-made syrup · mochi"
      },
      {
        "name": "Watermelon",
        "badge": "SEASONAL",
        "ing": "fresh watermelon balls · homemade syrup · condensed milk · mochi",
        "price": "14.99"
      },
      {
        "name": "Injeolmi",
        "badge": "CLASSIC",
        "ing": "roasted soybean powder · red bean · crushed almonds · mochi",
        "price": "14.99",
        "staffPicks": [
          "watermelon",
          "Corn flakes",
          "Honey"
        ]
      },
      {
        "name": "Black Sesame",
        "badge": "CLASSIC",
        "ing": "black sesame · red bean · crushed almonds · mochi",
        "price": "14.99",
        "staffPicks": [
          "Vanilla ice cream",
          "Honey"
        ]
      },
      {
        "name": "Melon",
        "badge": "SEASONAL",
        "hidden": true,
        "ing": "fresh melon balls · house-made syrup · mochi",
        "price": "14.99",
        "staffPicks": [
          "Yogurt ice cream",
          "Cheesecake bites"
        ]
      },
      {
        "name": "Strawnana Pie",
        "recipeNote": "Syrup contains condensed milk.",
        "inventoryName": "Strawnana",
        "badge": "SPECIAL",
        "ing": "strawberry · banana · cookie crumbs · house-made syrup · house-made banana cream · whipped cream",
        "price": "18.99"
      },
      {
        "name": "Blueberry Yogurt Cheesecake",
        "inventoryName": "Blueberry Yogurt",
        "badge": "CLASSIC",
        "ing": "blueberry · house-made yogurt syrup · cheesecake bites · yogurt ice cream",
        "price": "17.99"
      },
      {
        "name": "Cookies and Cream",
        "brandLabel": "Oreo™",
        "inventoryName": "Oreo Tiramisu",
        "artName": "Oreo Tiramisu",
        "badge": "CLASSIC",
        "ing": "Oreo™ crumbs · house-made cream · premium cacao powder · mochi on the side",
        "price": "16.99"
      },
      {
        "name": "Cereal Killer",
        "badge": "SPECIAL",
        "ing": "three cereals of our choice · organic freeze-dried strawberry · mochi · honey drizzle over Honeycomb cereal",
        "price": "16.99"
      },
      {
        "name": "Hojicha Tiramisu",
        "mochiPlacement": "side",
        "recipeNote": "Syrup contains condensed milk.",
        "badge": "SPECIAL",
        "ing": "house-made Japanese hojicha syrup · ladyfinger bites · house-made cream · organic hojicha powder · mochi",
        "price": "16.99"
      },
      {
        "name": "Matcha Strawberry",
        "badge": "SPECIAL",
        "ing": "strawberry · organic matcha syrup · Biscoff crumbs · mochi · premium green tea ice cream",
        "price": "16.99",
        "brandLabel": "Biscoff™"
      },
      {
        "name": "Matcha Banana Cream",
        "mochiPlacement": "side",
        "recipeNote": "Syrup contains condensed milk.",
        "badge": "SPECIAL",
        "brandLabel": "Biscoff™",
        "ing": "house-made Japanese matcha syrup · banana · house-made banana cream · Biscoff crumbs · organic matcha powder",
        "price": "16.99"
      },
      {
        "name": "Lychee Heaven",
        "badge": "SPECIAL",
        "ing": "lychee · lychee popping boba · toasted coconut flakes · coconut jelly · mochi · yogurt ice cream · yogurt lychee syrup on top",
        "price": "18.99"
      },
      {
        "name": "Açaí",
        "inventoryName": "Acai",
        "badge": "SPECIAL",
        "ing": "açaí · banana · strawberry · blueberry · granola · honey · toasted coconut flakes",
        "price": "18.99"
      },
      {
        "name": "Classic Pat Bingsu",
        "badge": "COMING SOON",
        "hidden": true,
        "base": "shaved ice",
        "price": "13.99",
        "ing": "ice base · fruit cocktail · red beans · mochi · corn flakes"
      },
      {
        "name": "Dubai Chocolate",
        "badge": "COMING SOON",
        "hidden": true,
        "ing": "real pistachio paste · roasted kataifi · chocolate shell · crushed pistachios · chocolate drizzle · premium cacao powder · pistachio ice cream",
        "price": "18.99"
      },
      {
        "name": "Vietnamese Coffee",
        "badge": "COMING SOON",
        "hidden": true,
        "price": null,
        "ing": "house-made coffee syrup · Biscoff crumbs"
      },
      {
        "name": "S'mores",
        "badge": "COMING SOON",
        "hidden": true,
        "price": null,
        "ing": "graham cracker crumbs · chocolate drizzle · torched marshmallows · graham crackers · dehydrated marshmallows · cacao powder · vanilla ice cream"
      },
      {
        "name": "Green Grape Aloe",
        "badge": "COMING SOON",
        "hidden": true,
        "price": null,
        "ing": "Fruity Pebbles · house-made syrup · halved green grape · aloe vera · yogurt ice cream · lime zest"
      },
      {
        "name": "Cookie Monster",
        "badge": "COMING SOON",
        "hidden": true,
        "price": null,
        "ing": "Golden Oreo cookie crumbs · chocolate drizzle · cream puffs · butter waffles · cookie dough bits · chocolate chips · cacao powder"
      },
      {
        "name": "Banana Split",
        "badge": "COMING SOON",
        "price": null,
        "ing": "two long banana halves along the rim · caramel drizzle · walnuts and almonds in the middle · vanilla ice cream with crushed pineapple and syrup · chocolate ice cream with chocolate sauce and extra nuts · cherry · sprinkles"
      },
      {
        "name": "Neapolitan",
        "badge": "COMING SOON",
        "price": null,
        "ing": "butter waffles in the middle · strawberry, chocolate and vanilla ice cream · strawberries beside the strawberry scoop · brownies and chocolate sauce beside and over the chocolate scoop · almonds on the vanilla scoop"
      }
    ],
    comingSoon: { title: "Coming Soon" },

    // Classic Pat Bingsu is listed with the Coming Soon bowls above.
    iceTitle: "Shaved Ice",
    iceBlurb: "Traditional Korean shaved ice.",
    ice: []
  },

  /* Hot & Fresh stays numbered 9–12 even though the milk list grew.
     The two TVs each start their own count. Cups number 1–3 in
     their own section. */
  hotStart: 9,

  /* ---- CUP BINGSU -----------------------------------------
     Single serve milk bingsu with syrup layers through the middle. */
  cupBingsu: {
  "enabled": true,
  "soon": false,
  "title": "Cup Bingsu",
  "blurb": "Serves 1 person · Made with our premium milk base.",
  "price": null,
  "priceNote": "single cup",
  "addon": "",
  "flavors": [
    {
      "name": "Mango Jelly Cup",
      "soon": false,
      "price": "8.99",
      "ing": "Milk snow · mango syrup · coconut jelly in the middle · mango · mango popping boba · mango star jelly · condensed milk · sprinkles",
      "image": "/assets/cups-ready/mango-jelly-20261024.png",
      "imageLayout": {
        "width": 100,
        "height": 100,
        "left": 0,
        "top": 0
      }
    },
    {
      "name": "Cookies and Cream Cup",
      "soon": false,
      "price": "8.99",
      "ing": "Milk snow · cookie crumbs in the middle · cookie crumbs · house-made cream · cacao powder · Oreos",
      "image": "/assets/cup-cookies-top-final.png",
      "imageLayout": {
        "width": 100,
        "height": 100,
        "left": 0,
        "top": 0
      }
    },
    {
      "name": "Injeolmi Jollypong Cup",
      "soon": false,
      "price": "8.99",
      "ing": "Milk snow · injeolmi powder · corn flakes in the middle · almonds · condensed milk · red beans · mochi · Jollypong",
      "image": "/assets/cups-ready/injeolmi-jollypong-v2.png",
      "imageLayout": {
        "width": 100,
        "height": 100,
        "left": 0,
        "top": 0
      }
    },
    {
      "name": "Popping Strawberry Mango Cup",
      "soon": false,
      "price": "9.99",
      "ing": "Milk snow · strawberries and strawberry syrup in the middle · strawberry popping boba in the middle · mango and mango syrup on top · mango popping boba",
      "image": "/assets/cups-ready/popping-strawberry-boba-middle-no-condensed-20261025.png",
      "imageLayout": {
        "width": 100,
        "height": 100,
        "left": 0,
        "top": 0
      }
    }
  ]
},
  yogurtLine: {
  "title": "Yogurt",
  "soon": true,
  "base": "yogurt",
  "existingItems": [
    "Blueberry Yogurt Cheesecake",
    "Lychee Heaven"
  ],
  "flavors": [
    {
      "name": "Plain Honeycomb Yogurt",
      "soon": true,
      "price": "12.99",
      "ing": "plain yogurt base · honeycomb"
    },
    {
      "name": "Korean Yogurt Bingsu",
      "placeholder": true,
      "soon": true,
      "price": null,
      "ing": "yogurt base"
    },
    {
      "name": "Strawberry Yogurt",
      "placeholder": true,
      "soon": true,
      "price": null,
      "ing": "strawberry · yogurt base · granola · honey"
    },
    {
      "name": "Melon Yogurt",
      "placeholder": true,
      "soon": true,
      "price": null,
      "ing": "melon · yogurt base"
    },
    {
      "name": "Passion Fruit, Grapefruit & Guava Yogurt",
      "placeholder": true,
      "soon": true,
      "price": null,
      "ing": "passion fruit · grapefruit · guava · yogurt base"
    }
  ]
},
  nonDairyLine: {
  "title": "Non-dairy",
  "soon": true,
  "flavors": [
    {
      "name": "Tomato Ice Bingsu",
      "soon": true,
      "price": null,
      "ing": "ice base · tomatoes"
    },
    {
      "name": "Classic Pat Bingsu",
      "soon": true,
      "price": "13.99",
      "ing": "ice base · fruit cocktail · red beans · mochi · corn flakes"
    },
    {
      "name": "?",
      "placeholder": true,
      "soon": true,
      "price": null,
      "ing": ""
    }
  ]
},

  /* ---- TOPPINGS -------------------------------------------
     Add an item to whichever tier it costs.
     `opts` is the flavor list under an item — write it as a list
     in [ ] and each choice gets its own red line.
     `note` is a quieter line under that (coming-soon, etc.).     */
  toppings: {
    "note": "Add to any size · stack as many as you want",
    "freeNote": "Sprinkles are free.",
    "servingNote": "All toppings served on the side, except sprinkles and honey drizzle.",
    "tiers": [
      {
        "price": "1",
        "items": [
          {
            "en": "Popping Boba",
            "opts": [
              "Strawberry",
              "Mango",
              "Lychee"
            ]
          },
          {
            "en": "Cereal",
            "opts": [
              "Fruity Pebbles",
              "Fruit Loops",
              "Corn Flakes",
              "Cinnamon Toast Crunch"
            ]
          },
          {
            "en": "Condensed Milk"
          },
          {
            "en": "Honey Drizzle"
          },
          {
            "en": "Crushed Almonds"
          },
          {
            "en": "Granola"
          },
          {
            "en": "Oreo Crumbs"
          },
          {
            "en": "Toasted Coconut Flakes"
          },
          {
            "en": "Coconut Flakes"
          },
          {
            "en": "Coconut Jelly"
          },
          {
            "en": "Tajín"
          }
        ]
      },
      {
        "price": "1.50",
        "items": [
          {
            "en": "Premium Ice Cream Scoop",
            "opts": [
              "Vanilla",
              "Yogurt"
            ]
          },
          {
            "en": "Injeolmi Powder"
          },
          {
            "en": "Mochi"
          },
          {
            "en": "Red Beans"
          },
          {
            "en": "Biscoff Crumbs"
          }
        ]
      },
      {
        "price": "2",
        "items": [
          {
            "en": "Cheesecake Bites"
          },
          {
            "en": "Brownie Bites"
          },
          {
            "en": "Crushed Pistachios"
          },
          {
            "en": "Cookie Dough Bites"
          },
          {
            "en": "Organic Cacao Nibs"
          },
          {
            "en": "Organic Freeze-Dried Strawberry"
          }
        ]
      }
    ]
  },

  creamTop: { title: "Add house-made cream top", price: "2" },

  /* Extra fruit sits under the bowls (website + left TV),
     not with the topping boxes. */
  extraFruit: {
    "title": "Extra fruit",
    "note": "Goes in the middle layer",
    "items": [
      {
        "en": "Strawberry",
        "price": "3"
      },
      {
        "en": "Banana",
        "price": null
      },
      {
        "en": "Mango",
        "price": "3"
      }
    ]
  },

  /* ---- HOT & FRESH SIDES ---------------------------------- */
  taiyaki: {
    available: false,
    title: "Taiyaki",
    price: "5.99",
    fillings: "Red Bean · Custard · Sweet Potato & Cheese · Cheese",
    note: "",
    deals: [
      { qty: "2 pieces", price: "5.99" },
      { qty: "5 pieces", price: "12.99" }
    ],
    dealNote: "mix any fillings"
  },

  taiyakiIce: {
    enabled: false,
    title: "Taiyaki Ice Cream",
    price: "5.99",
    note: "flavor of your choice · 1 taiyaki + 1 ice cream scoop · sprinkles · corn flakes"
  },

  dubaiTaiyaki: {
    available: false,
    title: "Dubai Taiyaki",
    price: "5.99",
    note: "Dubai chocolate filling"
  },

  /* ---- MINI TAIYAKI --------------------------------------
     Each order is exactly five mini taiyaki of one filling. */
  miniTaiyaki: {
    enabled: true,
    showPrices: false,
    sectionTitle: "Food",
    title: "Mini Taiyaki",
    blurb: "Five mini taiyaki in every order. One flavor per box. No mix-and-match.",
    orderNote: "5 pieces · one flavor only",
    flavors: [
      { name: "Red Beans", filling: "Red bean filling", price: "6.99", image: "/assets/mini-taiyaki-bags-20261108/red-beans.webp" },
      { name: "Custard", filling: "Custard filling", price: "6.99", image: "/assets/mini-taiyaki-bags-20261108/custard.webp" },
      { name: "Cheese", filling: "Cheese filling", price: "6.99", image: "/assets/mini-taiyaki-bags-20261108/cheese.webp" },
      { name: "Sweet Potato", filling: "Sweet potato filling", price: "6.99", image: "/assets/mini-taiyaki/sweet-potato.png" },
      { name: "Nutella", filling: "Nutella filling", price: "6.99", image: "/assets/mini-taiyaki-bags-20261108/nutella.webp" },
      { name: "Dubai Chocolate", filling: "Dubai chocolate filling", price: "8.99", image: "/assets/mini-taiyaki-bags-20261108/dubai-chocolate.webp" }
    ]
  },

  cookie: {
    hidden: true,
    title: "Dubai Chewy Cookie",
    price: "8.99",
    sub: "real pistachios · kataifi · marshmallows · premium cacao · white chocolate",
    warn: "Contains nuts. Not for nut allergies."
  },

  drinks: {
    title: "Drinks",
    items: [
  {
    "name": "Strawberry Yogurt Cream Latte",
    "price": "6.99",
    "ing": "house-made strawberry puree · whole milk · fresh strawberry bits · yogurt cream top",
    "image": "/assets/drinks/strawberry-yogurt-cream-latte-20261021.png"
  },
  {
    "name": "House Cold Brew (Iced)",
    "price": "4.99",
    "image": "/assets/drinks/iced-cold-brew-20261021.png",
    "ing": "black cold brew · ice"
  },
  {
    "name": "Iced Bacchius Cider",
    "price": "5.99",
    "ing": "premium Korean energy drink · Sprite · ice · contains 30 mg caffeine",
    "image": "/assets/drinks/iced-bacchus-cider-20261021.png"
  },
  {
    "name": "Green Grape Aloe Ade",
    "price": "5.99",
    "image": "/assets/drinks/green-grape-aloe-ade-20261021.png",
    "ing": "green grape puree · Perrier sparkling water · aloe vera"
  },
  {
    "name": "Japanese Melon Float",
    "price": "6.99",
    "ing": "premium melon syrup · Perrier · premium vanilla ice cream",
    "image": "/assets/drinks/melon-float-20261021.png"
  }
]
  },

  /* ---- THE VOTE (website only) ----------------------------
     The coming-soon ballot is built from flavors with the
     COMING SOON badge. No separate list to keep in step.       */

  /* ---- HOURS -----------------------------------------------
     `hours` is what people read. `schedule` is the same thing in
     24-hour time so the site can say whether we're open right
     now — keep the two in step.                                */
  hours: [
    { days: "Mon – Thu", time: "5:00 – 10:00" },
    { days: "Fri – Sun", time: "1:00 – 10:00" }
  ],

  /* 0 = Sunday … 6 = Saturday · null = closed all day */
  schedule: {
    0: { open: "13:00", close: "22:00" },
    1: { open: "17:00", close: "22:00" },
    2: { open: "17:00", close: "22:00" },
    3: { open: "17:00", close: "22:00" },
    4: { open: "17:00", close: "22:00" },
    5: { open: "13:00", close: "22:00" },
    6: { open: "13:00", close: "22:00" }
  },

  footer: {
    left: "Real fruit · Cut fresh daily · Made to order",
    disclaimer: "Menu and prices may change at any time — thank you for understanding!",
    right: "sweetsnow.org"
  }
};

// Website exclusions per owner (2026-10-21 and 2026-10-22). Keep recipes above for reference.
const unavailableBingsu = new Set(['Watermelon', 'Cereal Killer', 'Açaí', 'Mango Special', 'Strawberry Special']);
window.MENU.bingsu.flavors = window.MENU.bingsu.flavors.filter(f => !unavailableBingsu.has(f.name));
window.MENU.bingsu.classicOrder = window.MENU.bingsu.classicOrder.filter(name => !unavailableBingsu.has(name));
window.MENU.bingsu.specialOrder = window.MENU.bingsu.specialOrder.filter(name => !unavailableBingsu.has(name));
window.MENU.cupBingsu.flavors = window.MENU.cupBingsu.flavors.filter(f => !/watermelon/i.test(f.name));

// Website menu displays products without prices per owner, 2026-10-21.
window.MENU.miniTaiyaki.showPrices = false;

// Current online lineup verified from Square. Keep original recipes/assets above for returns.
// Refresh this snapshot from Square before each website menu update; it is not an automatic sync.
window.MENU.squareMenu = {"checkedAt": "2026-10-26T23:18:30.008Z", "source": "https://cash.app/$sweetsnowus", "bowls": [{"ordinal": 1, "name": "Black Sesame", "description": "Black Sesame, Crushed Almonds, Red Bean, Condensed Milk, Mochi", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 1499, "currency_code": "USD"}, "token": "CALI_CAESGElaUUdNVDQ2SllHV0pGWEtUWU5TT1hSMxgB"}, {"ordinal": 2, "name": "Injeolmi", "description": "Roasted Soybean Powder, Crushed Almonds, Red Bean, Condensed Milk, Mochi", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 1499, "currency_code": "USD"}, "token": "CALI_CAESGFlXQUxFSElYRVRERUQ3V1ZBVVJUTUIyNRgB"}, {"ordinal": 3, "name": "Mango", "description": "Fresh Mango, Homemade Syrup, Condensed Milk, Mochi", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 1499, "currency_code": "USD"}, "token": "CALI_CAESGEtLSVpPSzdRTVg2Q0NST0NFNkVIS1dMVRgB"}, {"ordinal": 4, "name": "Mango & Strawberry", "description": "Half & Half\nFresh Mango, Fresh Strawberry, Homemade Syrup, Condensed Milk, Mochi", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 1599, "currency_code": "USD"}, "token": "CALI_CAESGDQyQVRaVEVIUTVRTFVSNVdWTTZIWDJFRxgB"}, {"ordinal": 5, "name": "Strawberry", "description": "Fresh Strawberry, Homemade Syrup, Condensed Milk, Mochi", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 1499, "currency_code": "USD"}, "token": "CALI_CAESGFdDUkZFR0ZRSFhaVkkyMzZRTUM3SjZHWhgB"}, {"ordinal": 6, "name": "Matcha Strawberry", "description": "Strawberry, Homemade Japanese Matcha Syrup, Biscoff Crumbs, Condensed Milk, Mochi, Premium Green Tea Ice Cream", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 1799, "currency_code": "USD"}, "token": "CALI_CAESGFlKM0pINVo2MlJVVTQ3MkdSSUtYVFVNVhgB"}, {"ordinal": 7, "name": "Lychee Heaven", "description": "Lychee, Lychee Syrup, Lychee Popping Boba, Toasted Coconut Flakes, Coconut Jelly, Mochi, Yogurt Ice Cream", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 1899, "currency_code": "USD"}, "token": "CALI_CAESGDVEUUFGQ09EWllXSFk1UkdYWE9HREVZWRgB"}, {"ordinal": 8, "name": "Hojicha Tiramisu", "description": "Homemade Japanese Hojicha Syrup, Ladyfinger Bites, Homemade Cream, Organic Hojicha Powder, Mochi on the side", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 1699, "currency_code": "USD"}, "token": "CALI_CAESGDQ1WUJKR0dUTkI3R1dGWVVDRUk1UjdSTxgB"}, {"ordinal": 9, "name": "Matcha Banana Cream", "description": "Homemade Japanese Matcha Syrup, Banana, Homemade Banana Cream, Biscoff Crumbs, Organic Matcha Powder, mochi on the side", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 1699, "currency_code": "USD"}, "token": "CALI_CAESGEVVUVlFSzNYVzRQV1NVU1c3Q0lOUkdMNBgB"}, {"ordinal": 10, "name": "Cookies and Cream", "description": "Oreo Crumbs, Homemade Cream, Premium Cacao Powder, Brownie Bites, Mochi on the Side", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 1599, "currency_code": "USD"}, "token": "CALI_CAESGENONEFFM0xQQk1USE1CSVBBRUNLQldQShgB"}, {"ordinal": 11, "name": "Strawnana Pie", "description": "Strawberry, Banana, Cookie Crumbs, Homemade Syrup, Homemade Banana Cream, Whipped Cream", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 1799, "currency_code": "USD"}, "token": "CALI_CAESGEY2VUZJSlNLWVpEV1VDUjNUVVhRNUVVMxgB"}], "cups": [{"ordinal": 13, "name": "Popping Strawberry Mango Cup", "description": "Milk Snow, Mango, Strawberry, Mango & Strawberry Syrup Layers, Mango & Strawberry Popping Boba", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 999, "currency_code": "USD"}, "token": "CALI_CAESGDZGWFJPUkhLUVdGWTJNNUhFTVhDUjdFQRgB"}, {"ordinal": 14, "name": "Mango Jelly Cup", "description": "Milk Snow, Mangoes, Thin Clear Coconut Jelly, Mango Star Jelly, Mango Popping Boba", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 899, "currency_code": "USD"}, "token": "CALI_CAESGExSUVRXUTZZSlAyQlJHNDdFRjNITTRJVRgB"}, {"ordinal": 15, "name": "Injeolmi Jollypong Cup", "description": "Milk Snow, Injeolmi Powder, Jollypong On Top", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 899, "currency_code": "USD"}, "token": "CALI_CAESGDJPRkRCSFVZUElITVZLUEtWWlZKM1BQWhgB"}, {"ordinal": 16, "name": "Cookies & Cream Cup", "description": "Milk Snow, Oreo Crumbs, Cacao Powder, Cream Top, Broken Oreo On Top", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 899, "currency_code": "USD"}, "token": "CALI_CAESGExBQ1RLR0dISlZCNU9JQkJJWjRTSktaUxgB"}], "taiyaki": [{"ordinal": 25, "name": "Dubai Chocolate Mini Taiyaki Box - 7 Pieces", "description": "Freshly Baked Mini Taiyaki, 7 Pieces, Dubai Chocolate Filling. Sold only as a 7-piece box. Baked to order, so please allow a little extra wait time.", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 1399, "currency_code": "USD"}, "token": "CALI_CAESGEZaWUlGT0k1NVRMM0xSNEVYVUVaQkhWThgB"}, {"ordinal": 26, "name": "Red Bean Mini Taiyaki Box - 7 Pieces", "description": "Freshly Baked Mini Taiyaki, 7 Pieces, Red Bean Filling. Sold only as a 7-piece box. Baked to order, so please allow a little extra wait time.", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 899, "currency_code": "USD"}, "token": "CALI_CAESGEQ0WE5aT0szVlBXR1gzQk80REVWN1JRQxgB"}, {"ordinal": 27, "name": "Custard Mini Taiyaki Box - 7 Pieces", "description": "Freshly Baked Mini Taiyaki, 7 Pieces, Custard Filling. Sold only as a 7-piece box. Baked to order, so please allow a little extra wait time.", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 899, "currency_code": "USD"}, "token": "CALI_CAESGEVPQk5KTk9XSU5GRERHR0FJRFJJNjRMNxgB"}, {"ordinal": 28, "name": "Nutella Mini Taiyaki Box - 7 Pieces", "description": "Freshly Baked Mini Taiyaki, 7 Pieces, Nutella Filling. Sold only as a 7-piece box. Baked to order, so please allow a little extra wait time.", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 899, "currency_code": "USD"}, "token": "CALI_CAESGFpKQUdHMkpXUk5LUFZHTUREVUFWVUlLTRgB"}, {"ordinal": 29, "name": "Cheese Mini Taiyaki Box - 7 Pieces", "description": "Freshly Baked Mini Taiyaki, 7 Pieces, Cheese Filling. Sold only as a 7-piece box. Baked to order, so please allow a little extra wait time.", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 899, "currency_code": "USD"}, "token": "CALI_CAESGEFPNldNTUFYTzRCMkNRSURSMkVZV1MySBgB"}], "croffles": [{"ordinal": 18, "name": "Injeolmi Croffle", "description": "Injeolmi Powder, Crushed Almonds, Mochi, condensed milk, Honey Drizzle", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 699, "currency_code": "USD"}, "token": "CALI_CAESGEgzWjRQT1RDRlRLSUw3UVRPTVZFV0NENBgB"}, {"ordinal": 19, "name": "Biscoff Caramel Croffle", "description": "Whole Lotus Biscoff Cookie, Biscoff Crumbs, House-Made Cream, Caramel Drizzle", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 799, "currency_code": "USD"}, "token": "CALI_CAESGFBGUko2Q0pHV1YyUFJWQk9YSUVBRFBERhgB"}, {"ordinal": 20, "name": "Cookies and Cream Croffle", "description": "Oreo Halves, Oreo Crumbs, Nutella Spread, House-Made Cream, Premium Cacao Powder", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 799, "currency_code": "USD"}, "token": "CALI_CAESGEZXN0NQQVJEVU1DSUw2VERDM0QySFpMWBgB"}, {"ordinal": 23, "name": "Dubai Strawberry Croffle", "description": "Nutella Spread, Dubai Chocolate Kataifi Filling, Fresh Strawberry, Vanilla Ice cream, Chocolate Sauce, Crushed Pistachios", "availability": "LOCAL_CATALOG_AVAILABILITY_SOLD_OUT", "price": {"amount": 1199, "currency_code": "USD"}, "token": "CALI_CAESGFdCSUhRTUlGRVhaMldMVFZaV1NQUEJDSRgB"}]};
(() => {
 const M=window.MENU, S=M.squareMenu;
 const norm=s=>s.toLowerCase().replace(/\band\b/g,'&').replace(/\bbingsu\b/g,'').replace(/\s+/g,' ').trim();
 const apply=(f,item)=>({...f,ing:item.description.replace(/\n+/g,' · ').replace(/,\s*/g,' · '),price:item.price.amount/100,squareName:item.name,inventoryName:item.name,soldOut:item.availability==='LOCAL_CATALOG_AVAILABILITY_SOLD_OUT'});
 const originals=M.bingsu.flavors;
 M.bingsu.flavors=S.bowls.map(item=>{const f=originals.find(f=>norm(f.name)===norm(item.name));return f?apply(f,item):null;}).filter(Boolean);
 // Owner recipe update; retain the original Square inventory name and price.
 const injeolmi=M.bingsu.flavors.find(f=>f.name==='Injeolmi');
 if(injeolmi){injeolmi.name='Injeolmi Jollypong';injeolmi.ing+=' · Jollypong';injeolmi.imagePreview=true;}
 // Owner confirmed available now on 2026-10-28; Square catalog is managed separately.
 M.bingsu.upcoming=[{name:"Milk & Honeycomb",ing:"Granola · Raw honeycomb · Honeycomb cereal",imagePreview:true,price:16.99,menuType:"special",comingSoon:true}];
 M.bingsu.flavors.push(...[{"name": "Shine Muscat Aloe Bingsu", "price": 18.99, "ing": "Korean Shine Muscats \u00b7 Green grape yogurt syrup \u00b7 Aloe vera \u00b7 Yogurt ice cream", "menuType": "special", "imagePreview": true, "comingSoon": false, "soldOut": false}, {"name": "Lychee & Shine Muscat", "price": 19.99, "ing": "Lychee \u00b7 Korean Shine Muscats \u00b7 Green grape yogurt syrup \u00b7 Aloe vera \u00b7 Yogurt ice cream", "menuType": null, "imagePreview": true, "comingSoon": false, "soldOut": false, "subtitle": "Half-and-half"}, {"name": "Lychee & Strawberry", "price": 18.99, "ing": "Lychee \u00b7 Fresh strawberries \u00b7 Fruit syrups \u00b7 Strawberry popping boba on the strawberry side \u00b7 Yogurt ice cream", "menuType": null, "imagePreview": true, "comingSoon": false, "soldOut": false, "subtitle": "Half-and-half"}, {"name": "Mango & Lychee", "price": 18.99, "ing": "Fresh mango \u00b7 Lychee \u00b7 Fruit syrups \u00b7 Yogurt ice cream", "menuType": null, "imagePreview": true, "comingSoon": false, "soldOut": false, "subtitle": "Half-and-half"}, {"name": "Strawberry & Shine Muscat", "price": 18.99, "ing": "Fresh strawberries \u00b7 Korean Shine Muscats \u00b7 Green grape yogurt syrup \u00b7 Aloe vera \u00b7 Strawberry popping boba on the strawberry side \u00b7 Yogurt ice cream", "menuType": null, "imagePreview": true, "comingSoon": false, "soldOut": false, "subtitle": "Half-and-half"}],...M.bingsu.upcoming);
 M.bingsu.halfAndHalfOrder=["Mango & Strawberry", "Lychee & Shine Muscat", "Lychee & Strawberry", "Mango & Lychee", "Strawberry & Shine Muscat"];
 M.bingsu.flavors=M.bingsu.flavors.filter(f=>f.name!=="Lychee & Strawberry");
 M.bingsu.halfAndHalfOrder=M.bingsu.halfAndHalfOrder.filter(n=>n!=="Lychee & Strawberry");
 M.bingsu.rotationOrder=M.bingsu.flavors.map(f=>f.name);
 // Owner defines permanence; never infer Regular/Special from flavor, price or stock.
 M.bingsu.menuTypes={"Mango": "classic", "Strawberry": "classic", "Injeolmi Jollypong": "classic", "Black Sesame": "classic", "Cookies and Cream": "classic", "Matcha Strawberry": "special", "Matcha Banana Cream": "special", "Hojicha Tiramisu": "special", "Lychee Heaven": "special", "Strawnana Pie": "special"};
 M.bingsu.flavors=M.bingsu.flavors.map(f=>({...f,menuType:M.bingsu.menuTypes[f.name]||f.menuType||null}));
 M.bingsu.classicOrder=[];M.bingsu.specialOrder=[];M.bingsu.title='Premium Fruit Bingsu';
 const oldCups=M.cupBingsu.flavors;
 M.cupBingsu.flavors=S.cups.map(item=>{const f=oldCups.find(f=>norm(f.name)===norm(item.name));return f?apply(f,item):null;}).filter(Boolean);
 M.cupBingsu.soon=false;
 const oldTaiyaki=M.miniTaiyaki.flavors;
 M.miniTaiyaki.flavors=S.taiyaki.map(item=>{const name=item.name.replace(' Mini Taiyaki Box - 7 Pieces','');const f=oldTaiyaki.find(f=>f.name.replace('Red Beans','Red Bean')===name);return f?{...apply(f,item),name}:null;}).filter(Boolean);
 M.miniTaiyaki.title='Mini Taiyaki';M.miniTaiyaki.blurb='Seven mini taiyaki, one filling, served in a small kraft paper bag. Baked to order.';M.miniTaiyaki.orderNote='7 pieces · one filling · baked to order';
 M.drinks.items=[];
})();

// Owner-approved Coming Soon cup additions, 2026-10-29.
window.MENU.cupBingsu.flavors.push(...[{"name": "Biscoff Viet Coffee", "price": "11.99", "ing": "Coffee jelly \u00b7 Biscoff crumbs \u00b7 Viet coffee syrup \u00b7 vanilla ice cream", "comingSoon": true, "previewOnly": true}, {"name": "Matcha Red Bean Crunch", "price": "11.99", "ing": "Matcha syrup \u00b7 corn flakes \u00b7 red beans \u00b7 mochi \u00b7 matcha powder \u00b7 green tea ice cream", "comingSoon": true, "previewOnly": true}, {"name": "Strawberry Cream Puff", "price": "12.99", "ing": "Strawberry syrup \u00b7 strawberries \u00b7 house-made creamtop \u00b7 mini Belgian cream puffs", "comingSoon": true, "previewOnly": true}]);

// Owner-approved Runway cup refresh and launch, 2026-10-29.
(function(){const cups={"Mango Jelly": "mango-jelly", "Cookies and Cream": "cookies-cream", "Injeolmi Jollypong": "injeolmi-jollypong", "Popping Strawberry Mango": "popping-strawberry-mango", "Biscoff Viet Coffee": "biscoff-viet-coffee", "Matcha Red Bean Crunch": "matcha-red-bean-crunch", "Strawberry Cream Puff": "strawberry-cream-puff"};window.MENU.cupBingsu.flavors.forEach(f=>{if(cups[f.name.replace(/ Cup$/,"")]){f.image="assets/cups-cutout-20261029/"+cups[f.name.replace(/ Cup$/,"")]+".png";f.imageLayout={width:100,height:100,left:0,top:0};f.previewOnly=false;f.comingSoon=false;}});})();

// Owner availability corrections, 2026-10-31. Preserve original recipes above.
window.MENU.squareMenu.croffles=window.MENU.squareMenu.croffles.filter(f=>!['Strawnana Croffle','Chocolate Banana Fudge Croffle'].includes(f.name));
window.MENU.cupBingsu.flavors.forEach(f=>{if(f.name==='Strawberry Cream Puff'){f.comingSoon=true;f.previewOnly=true;}});

// Owner launch, 2026-11-01. Original recipes retained above.
window.MENU.cupBingsu.flavors=window.MENU.cupBingsu.flavors.filter(f=>f.name!=="Strawberry Cream Puff");
window.MENU.cupBingsu.flavors.push({"name": "Biscoff Caramel", "price": "12.99", "ing": "Biscoff crumb and caramel layers \u00b7 vanilla ice cream \u00b7 caramel drizzle \u00b7 one broken Biscoff cookie", "image": "assets/cups-biscoff-caramel-20261101.png", "imageLayout": {"width": 100, "height": 100, "left": 0, "top": 0}, "comingSoon": false, "previewOnly": false});

// Owner recipe replacement, 2026-11-01. Original recipe retained above.
Object.assign(window.MENU.cupBingsu.flavors.find(f=>f.name==="Biscoff Viet Coffee"),{"name": "Viet Coffee", "price": "11.99", "ing": "Viet coffee syrup \u00b7 coffee jelly in the middle \u00b7 house-made cream top \u00b7 Heath toffee", "image": "assets/cups-viet-coffee-20261101.png", "comingSoon": false, "previewOnly": false});

// Owner cup names, 2026-11-01.
window.MENU.cupBingsu.flavors.forEach(f=>{f.name=f.name.replace(/ Cup$/, "");f.name=(f.name==="Matcha Red Bean Crunch"?"Matcha Red Bean":f.name)+" Cup";});

// Owner Coming Soon replacement, 2026-11-01.
window.MENU.bingsu.upcoming=window.MENU.bingsu.upcoming.map(f=>f.name==="Milk & Honeycomb"?{...f,name:"Honeycomb x2",price:18.99,ing:"100% organic raw honeycomb · Honeycomb cereal · two graham bear crackers",comingSoon:true}:f);

window.MENU.bingsu.flavors=window.MENU.bingsu.flavors.map(f=>f.name==="Milk & Honeycomb"?{...window.MENU.bingsu.upcoming.find(x=>x.name==="Honeycomb x2")}:f);
window.MENU.bingsu.rotationOrder=window.MENU.bingsu.rotationOrder.map(n=>n==="Milk & Honeycomb"?"Honeycomb x2":n);

// Owner update: same cup build, strawberry-flavored Pop Rocks over the mango.
{ const cup = window.MENU.cupBingsu.flavors.find(f => f.name === "Popping Strawberry Mango Cup");
  if (cup) { cup.name = "Strawberry Mango Popping Candy Cup"; cup.price = 11.99; cup.ing += " · strawberry-flavored Pop Rocks over the mango"; }
}

{ const cup=window.MENU.cupBingsu.flavors.find(f=>f.name==="Strawberry Mango Popping Candy Cup"); if(cup) cup.image="/assets/strawberry-mango-poprocks-20261106.png"; }

// Owner-approved available-now cup, 2026-11-09.
window.MENU.cupBingsu.flavors.push({"name": "Strawberry Cheesecake Cup", "price": "12.99", "ing": "Milk snow \u00b7 graham crumbs and strawberries in the middle \u00b7 strawberry-glazed strawberries, cheesecake bites and vanilla ice cream on top", "image": "/assets/cups-strawberry-cheesecake-glaze-20261109.webp", "imageLayout": {"width": 100, "height": 100, "left": 0, "top": 0}, "comingSoon": false, "soon": false, "previewOnly": false});

// Owner-approved limited-time special, 2026-11-09.
window.MENU.bingsu.flavors.push({"name": "Sweet Potato Cream Bingsu", "price": 16.99, "ing": "Almonds and condensed milk in the middle \u00b7 house-made sweet potato cream, almond bits and mochi on top", "menuType": "special", "comingSoon": false, "soldOut": false, "isNew": true, "subtitle": "Limited Time"});
window.MENU.bingsu.rotationOrder.push("Sweet Potato Cream Bingsu");

// Owner correction: Coming Soon.
Object.assign(window.MENU.bingsu.flavors.find(f=>f.name==="Sweet Potato Cream Bingsu"),{comingSoon:true,isNew:false});

// Owner request, 2026-11-12: prices checked against Square (catalog as of 2026-11-12). Older prices stay above for reference.
(function(){
  const M = window.MENU;
  const cups = {"Mango Jelly Cup": 10.99, "Injeolmi Jollypong Cup": 10.99, "Cookies and Cream Cup": 10.99};
  M.cupBingsu.flavors.forEach(f => { if (cups[f.name]) f.price = cups[f.name]; });
  const croffles = {"Injeolmi Croffle": 799, "Biscoff Caramel Croffle": 899, "Cookies and Cream Croffle": 899};
  M.squareMenu.croffles.forEach(c => { if (croffles[c.name]) c.price.amount = croffles[c.name]; });
  const cheese = M.miniTaiyaki.flavors.find(f => f.name === "Cheese");
  if (cheese) cheese.price = 9.99;
})();

// Owner, 2026-11-12: Sweet Potato mini taiyaki is back. 7 pieces like the others. Price from Square.
window.MENU.miniTaiyaki.flavors.push({name: "Sweet Potato", filling: "Sweet potato filling", price: 9.99, image: "/assets/mini-taiyaki-bags-20261108/sweet-potato-20261112.webp", squareName: "Sweet Potato Mini Taiyaki - 7 Pieces", inventoryName: "Sweet Potato Mini Taiyaki - 7 Pieces", soldOut: false});

// Owner, 2026-11-12: Injeolmi Croffle is the recipe with house-made cream (same words as Square).
// Owner, 2026-11-12: Plain Croffle added. Name, recipe and price from Square.
(function(){
  const croffles = window.MENU.squareMenu.croffles;
  const injeolmi = croffles.find(c => c.name === "Injeolmi Croffle");
  if (injeolmi) injeolmi.description = "House-Made Cream, Injeolmi Powder, Crushed Almonds";
  if (!croffles.some(c => c.name === "Plain Croffle")) croffles.push({"ordinal": 24, "name": "Plain Croffle", "description": "Golden croffle dusted with powdered sugar", "availability": "LOCAL_CATALOG_AVAILABILITY_NORMAL", "price": {"amount": 499, "currency_code": "USD"}});
})();
