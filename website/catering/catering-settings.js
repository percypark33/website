/* ============================================================
   SWEET SNOW CATERING — SETTINGS  (the easy file)
   ------------------------------------------------------------
   Change something here, save, and the catering site rebuilds
   itself:  sweetsnow.org/catering

   What catering is: pre-made bingsu from our menu, in a sealable
   paper cup, with a label for each flavor.

   Rules (same as website/site-settings.js):
     - Keep the quote marks "" around every piece of text.
     - Keep the commas at the end of each line.
     - Anything after //  is a private note; it never shows.
     - Flavor names must match the menu exactly, for example
       "Mango Jelly Cup".
   ============================================================ */

window.CATERING_SETTINGS = {

  /* ---- IS CATERING ANNOUNCED YET? ----------------------------
     false = the site works for anyone who has the link, but it is
             not in the main website's menu and Google is asked to
             skip it.
     true  = "Catering" is added to the menu and footer of
             sweetsnow.org, and the site is listed for Google.     */
  announce: false,

  /* ---- TOP OF THE PAGE ---------------------------------------- */
  title: "Sweet Snow Catering",
  headline: "Same snow. New places.",
  text: "Pre-made bingsu from our menu, sealed in a paper cup and labeled by flavor. Ready for your event.",
  sticker: "By appointment",          // the round yellow sticker. Leave "" to hide.

  /* ---- THE THREE THINGS TO KNOW (the yellow band) --------------
     A short word and one line each.                               */
  points: [
    ["Pre-made", "Bingsu from our menu, made ahead at Sweet Snow in Garden Grove."],
    ["Sealed", "A paper ice cream cup with a lid that seals."],
    ["Labeled", "Every cup wears its flavor, so guests can pick their own."]
  ],

  /* ---- SMALL FACTS UNDER THE BUTTONS ---------------------------
     From the catering team plan. Change or remove any line.       */
  facts: [
    "For 50 to 200+ guests",
    "Same milk base and Korean snow machine as our shop"
  ],

  /* ---- LABEL COLORS ---------------------------------------------
     The color of each flavor's label on the cup drawings. Use the
     colors of your real labels here. A flavor without a line gets
     a color by itself.                                             */
  labels: {
    "Mango Jelly Cup": "#FFB81C",
    "Injeolmi Jollypong Cup": "#D9A066",
    "Cookies and Cream Cup": "#2E2A3B",
    "Strawberry Mango Popping Candy Cup": "#FF5A6E",
    "Viet Coffee Cup": "#8A5A3C",
    "Matcha Red Bean Cup": "#7DB548",
    "Biscoff Caramel Cup": "#E08A3C",
    "Strawberry Cheesecake Cup": "#FF9FB8"
  },

  /* ---- THE TIERS ------------------------------------------------
     One block per tier, smallest first. Add or remove blocks freely.

     name     what the tier is called
     text     one short line about it
     price    for example "$9 per cup". Leave "" to show "Ask for a quote".
     guests   for example "50 to 100 guests". Leave "" to hide.
     items    the cup flavors in this tier, spelled exactly as on the
              menu. Names, photos and what is inside come from the menu.

     buildUp: true means each tier includes every flavor in the tiers
     before it, so a tier only lists the flavors it adds.            */
  buildUp: true,
  tiers: [
    {
      name: "First Snow",
      text: "Three classic flavors.",
      price: "",
      guests: "",
      items: ["Mango Jelly Cup", "Injeolmi Jollypong Cup", "Cookies and Cream Cup"]
    },
    {
      name: "Snow Day",
      text: "Adds three more flavors.",
      price: "",
      guests: "",
      items: ["Strawberry Mango Popping Candy Cup", "Viet Coffee Cup", "Matcha Red Bean Cup"]
    },
    {
      name: "Snowed In",
      text: "Every cup flavor on our menu.",
      price: "",
      guests: "",
      items: ["Biscoff Caramel Cup", "Strawberry Cheesecake Cup"]
    }
  ],

  /* ---- WHO IT IS FOR (from the catering team plan) --------------- */
  events: [
    "Weddings and engagements",
    "First birthdays (돌잔치)",
    "Corporate and office events",
    "Schools and churches",
    "Birthdays and private parties",
    "Festivals and night markets",
    "Korean community events"
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
  }
};
