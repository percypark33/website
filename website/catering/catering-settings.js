/* ============================================================
   SWEET SNOW CATERING — SETTINGS  (the easy file)
   ------------------------------------------------------------
   Change something here, save, and the catering landing page
   rebuilds itself:  sweetsnow.org/catering

   What catering is: bingsu made the way we make it at the shop,
   for your event. Guests book an appointment first.

   Rules (same as website/site-settings.js):
     - Keep the quote marks "" around every piece of text.
     - Keep the commas at the end of each line.
     - Anything after //  is a private note; it never shows.
     - Bingsu names must match the menu exactly, for example
       "Mango" or "Matcha Strawberry".
   ============================================================ */

window.CATERING_SETTINGS = {

  /* ---- THE DESIGNS -----------------------------------------------
     There are three, and all three are always live at their own
     address, so different ads can land on different designs:

       sweetsnow.org/catering/bunny   Snow Bunny: the website's look,
                                      with the bunny and doodles
       sweetsnow.org/catering/cloud   Cotton Cloud: pastel sky, clouds,
                                      soft and round
       sweetsnow.org/catering/diary   Sticker Diary: scrapbook with
                                      polaroids, tape and stickers

     `design` is the one that sweetsnow.org/catering itself shows.
     See all three side by side at sweetsnow.org/catering/designs.
     Every booking email says which design the guest was on.         */
  design: "bunny",

  /* ---- IS CATERING A PAGE OF THE WEBSITE? ---------------------
     true  = "Catering" is in the menu and footer of sweetsnow.org.
             sweetsnow.org/catering has the website's menu at the
             top, like Menu and Our story, and Google may list it.
     false = the page works for anyone who has the link, but it
             is not in the website's menu and Google is asked to
             skip it.                                              */
  announce: true,

  /* ---- THE "COMING SOON" TAG ----------------------------------
     The small tag shown with catering: on the home page and at
     the top of every catering page. When catering opens, make it
     ""  and the tag goes away everywhere.                         */
  tag: "Coming soon",

  /* ---- ON THE HOME PAGE OF SWEETSNOW.ORG ------------------------
     A catering section on the home page, after the cup bingsu.
     It shows the three bowls and the three tiers from this file.

     show    true  = the section is on the home page
             false = it is not
     title   the big words
     text    the line under them
     link    true  = "Explore catering" opens the catering page
             false = no link                                        */
  homePage: {
    show: true,
    title: "Sweet Snow Catering",
    text: "Fresh bingsu, made at your event. We bring the milk snow and make every bowl the way we do at our shop.",
    link: true
  },

  /* ---- TOP OF THE PAGE ---------------------------------------- */
  title: "Sweet Snow Catering",
  headline: "Fresh bingsu, made at your event.",
  text: "We bring the milk snow and make every bowl the way we do at our shop. Book an appointment and we will plan it with you.",
  heroItems: ["Strawberry", "Mango", "Matcha Strawberry"],      // the three bowls shown at the top
  facts: [                                                       // from the catering team plan. Change or remove any line.
    "For 50 to 200+ guests",
    "Same milk base and Korean snow machine as our shop"
  ],

  /* ---- THE THREE TIERS -------------------------------------------
     name     what the tier is called
     text     one short line about it
     picks    what goes on the event menu: one word per bingsu,
              "Classic" or "Special"
     addOn    an optional extra, for example the taiyaki add-on.
              Leave "" for none.
     price    for example "$12 per guest". Leave "" to show
              "Ask for a quote".
     guests   for example "50 to 100 guests". Leave "" to hide.      */
  tiers: [
    { name: "Basic",   text: "Two classic bingsu on your event menu.",              picks: ["Classic", "Classic"],            addOn: "", price: "", guests: "" },
    { name: "Premium", text: "Two classic bingsu and one special bingsu.",          picks: ["Classic", "Classic", "Special"], addOn: "", price: "", guests: "" },
    { name: "Special", text: "Three bingsu of your choice: one classic, two special.", picks: ["Classic", "Special", "Special"], addOn: "", price: "", guests: "" }   // to bring the taiyaki add-on back:  addOn: "Mini taiyaki add-on available"  (and show: true under taiyaki below)
  ],

  /* ---- THE EVENT MENU ---------------------------------------------
     The Classic and Special bingsu guests can choose from. They come
     from the menu by themselves (coming-soon items are left out).
     To leave one off the event menu, write its name in `leaveOut`.   */
  leaveOut: [],

  /* ---- ON THE SIDE -------------------------------------------------
     Catering is bingsu only for now, so the taiyaki add-on is off.
     To bring it back: `show: true` here, and put the add-on line
     back on the Special tier above.                                   */
  taiyaki: {
    show: false,
    title: "Mini taiyaki add-on",
    text: "Small filled, fish-shaped pastries. Add them with the Special tier."
  },
  preMade: {
    show: true,
    title: "Pre-made cups",
    text: "Bingsu in a sealed paper cup, labeled by flavor. Ask about it at your appointment."
  },

  /* ---- WHO IT IS FOR (from the catering team plan) ----------------- */
  events: [
    "Wedding or engagement",
    "First birthday (돌잔치)",
    "Corporate or office event",
    "School or church event",
    "Birthday or private party",
    "Festival or night market",
    "Korean community event"
  ],

  /* ---- APPOINTMENTS -----------------------------------------------
     Guests book with the chat helper or the form. Each request is
     emailed to you (see README.md in this folder for the one-time
     email setup).

     times        the parts of the day a guest can ask for
     leadTime     for example "Please book at least 7 days ahead."
     serviceArea  for example "Serving Orange County."
     Leave either as "" to hide it.                                   */
  appointments: {
    title: "Book your appointment",
    text: "Chat with Snow, our catering helper. It takes about a minute, and your request goes straight to our inbox.",
    times: ["Morning", "Afternoon", "Evening"],
    leadTime: "",
    serviceArea: ""
  },

  /* ---- WHAT THE CHAT HELPER SAYS -------------------------------------
     Short answers to the quick questions. The tier answer is written
     from the tiers above by itself.                                    */
  answers: {
    how: "Tell me about your event and pick a day for your appointment. We confirm by email or text, plan your menu together, and send you a quote.",
    price: "The price depends on your guest count and tier. We send a quote after your appointment.",
    taiyaki: "Catering is bingsu only for now. You can find mini taiyaki at our shop.",   // with the add-on back: "Mini taiyaki can be added with the Special tier." 
    preMade: "We also make pre-made bingsu in sealed paper cups, labeled by flavor. Ask about it at your appointment.",
    guests: "We cater events of 50 to 200+ guests."
  }
};
