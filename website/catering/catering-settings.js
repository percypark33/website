/* ============================================================
   SWEET SNOW CATERING — SETTINGS  (the easy file)
   ------------------------------------------------------------
   Change something here, save, and these rebuild themselves:

     sweetsnow.org/catering                    the catering page
     sweetsnow.org/catering/frozen-milk-flyer  the flyer

   Rules (same as website/site-settings.js):
     - Keep the quote marks "" around every piece of text.
     - Keep the commas at the end of each line.
     - Anything after //  is a private note; it never shows.
     - Menu item names must match the menu exactly, for example
       "Mango Jelly Cup" or "Biscoff Caramel Croffle".
       Mini taiyaki are written with their filling first:
       "Red Bean Mini Taiyaki".
   ============================================================ */

window.CATERING_SETTINGS = {

  /* ---- IS CATERING ANNOUNCED YET? ----------------------------
     false = the page works for anyone who has the link, but it is
             not in the website menu and Google is asked to skip it.
     true  = "Catering" is added to the menu and footer of every
             page, and the page is listed for Google.              */
  announce: false,

  /* ---- TOP OF THE PAGE ---------------------------------------- */
  title: "Sweet Snow Catering",
  label: "By appointment",
  text: "Korean bingsu for your event. Choose a tier, request an appointment, and we will plan the rest with you.",
  heroItems: ["Mango Jelly Cup", "Matcha Red Bean Cup", "Strawberry Cheesecake Cup"],   // the three photos at the top

  /* ---- THE TIERS ------------------------------------------------
     One block per tier, smallest first. Add or remove blocks freely.

     name     what the tier is called
     text     one short line about it
     price    for example "$9 per guest". Leave "" to show "Ask for a quote".
     guests   for example "20 to 40 guests". Leave "" to hide.
     items    menu items in this tier, spelled exactly as on the menu.
              Photos and names come from the menu by themselves.
     extras   anything that is not a menu item, for example "Spoons and napkins".

     buildUp: true means each tier includes everything in the tier
     before it, so a tier only lists what it adds.                  */
  buildUp: true,
  tiers: [
    {
      name: "First Snow",
      text: "Cup bingsu for every guest, in three classic flavors.",
      price: "",
      guests: "",
      items: ["Mango Jelly Cup", "Injeolmi Jollypong Cup", "Cookies and Cream Cup"],
      extras: []
    },
    {
      name: "Snow Day",
      text: "Every cup flavor on our menu, plus mini taiyaki.",
      price: "",
      guests: "",
      items: [
        "Strawberry Mango Popping Candy Cup", "Viet Coffee Cup", "Matcha Red Bean Cup",
        "Biscoff Caramel Cup", "Strawberry Cheesecake Cup",
        "Red Bean Mini Taiyaki", "Custard Mini Taiyaki", "Nutella Mini Taiyaki"
      ],
      extras: []
    },
    {
      name: "Snowed In",
      text: "The whole dessert table: cups, mini taiyaki, croffles and our frozen shaped milk.",
      price: "",
      guests: "",
      items: [
        "Cheese Mini Taiyaki", "Sweet Potato Mini Taiyaki", "Dubai Chocolate Mini Taiyaki",
        "Plain Croffle", "Injeolmi Croffle", "Biscoff Caramel Croffle",
        "Cookies and Cream Croffle", "Dubai Strawberry Croffle"
      ],
      extras: ["Frozen Shaped Milk Collection"]
    }
  ],

  /* ---- APPOINTMENTS -------------------------------------------
     bookingLink  The link to your booking calendar (a Google Calendar
                  booking page, for example). Paste it between the
                  quotes and the page shows a "Pick a time" button.
                  While it is "", the page asks guests to message
                  you on Instagram to book.
     form         true = also show a request form on the page. It
                  needs email delivery set up first (see README.md
                  in this folder). false = no form.
     leadTime     for example "Please book at least 7 days ahead."
     serviceArea  for example "Serving Orange County."
     Leave either as "" to hide it.                                */
  appointments: {
    title: "Book an appointment",
    text: "Every catering order starts with an appointment, so we can plan it around your event.",
    bookingLink: "",
    form: false,
    leadTime: "",
    serviceArea: ""
  },

  /* ---- FROZEN SHAPED MILK COLLECTION (page section + flyer) -----
     One line per shape.
       name    the words under the shape
       shape   which drawing to use: "bunny", "bear", "heart", "star",
               "snowflake", "fish", "flower", "cloud" or "round"
       photo   optional. A real photo instead of the drawing, for
               example "/catering/photos/bunny.png" (a cut-out PNG
               with a clear background looks best).
     note      a small line under the shapes (sizes, how many in a
               pack). Leave "" to hide.                             */
  frozenMilk: {
    show: true,
    title: "Frozen Shaped Milk Collection",
    text: "Pre-made and frozen, ready for your event.",
    note: "",
    shapes: [
      { name: "Bunny", shape: "bunny" },
      { name: "Bear", shape: "bear" },
      { name: "Heart", shape: "heart" },
      { name: "Star", shape: "star" },
      { name: "Snowflake", shape: "snowflake" },
      { name: "Fish", shape: "fish" }
    ]
  },

  /* ---- THE WEBSITE ADDRESS PRINTED ON THE FLYER ---------------- */
  website: "sweetsnow.org",
  flyerLine: "Catering by appointment"
};
