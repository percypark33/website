# Sweet Snow Catering

The catering site: **`sweetsnow.org/catering`**.

What it offers: pre-made bingsu from our menu, in a sealable paper cup, with a label for each flavor. Guests book an appointment; there is no online ordering.

It has its own design, separate from the main website: navy, bright blue and yellow (the colors of the catering team plan), the chunky lettering of our printed flyers, and a paper cup whose label changes with the flavor.

## You only edit one file

**`catering-settings.js`**. Open it on GitHub, tap the pencil, change the words, and publish the same way as the rest of the site ([how to publish](../../docs/HOW-TO-UPDATE.md#publish)). Each part of the file has a short note above it.

| To change | Edit |
|---|---|
| The big headline and the words under it | `headline`, `text` |
| The three words in the yellow band | `points` |
| The small facts under the buttons | `facts` |
| A flavor's label color | `labels` |
| A tier's name, words, price or guest count | `tiers` |
| Which flavors are in a tier | `items` inside that tier. Spell names exactly as on the menu |
| Add or remove a tier | Add or remove a `{ ... }` block in `tiers` |
| Who it is for | `events` |
| The booking calendar link, lead time, service area | `appointments` |
| Put "Catering" in the main website's menu | `announce: true` |

Flavor names, photos and what is inside each cup come from the menu by themselves. If an item is renamed or hidden on the menu, the preview link shows a yellow bar that names the line to fix.

### Label colors

Each flavor's label on the cup drawings takes its color from `labels`:

```js
"Mango Jelly Cup": "#FFB81C",
```

Put the colors of your real labels here. The words on a label turn navy or white by themselves, whichever reads better on that color. A flavor with no line gets a spare color.

### Tier prices

`price: ""` shows "Ask for a quote". Write `price: "$9 per cup"` (any wording) to show a price. `guests: "50 to 100 guests"` adds a second label.

With `buildUp: true`, each tier includes every flavor in the tiers before it, so a tier lists only the flavors it adds. The flavor count on each tier is added up for you.

## Appointments

Guests book on your calendar. Paste the calendar's link into `appointments` → `bookingLink` and the page shows a **Pick a time** button:

```js
bookingLink: "https://calendar.app.google/your-link",
```

To make the calendar in Google Calendar: [create an appointment schedule](https://support.google.com/calendar/answer/10729749), then [copy its booking page link](https://support.google.com/calendar/answer/10733297). Asking for the event date, guest count and tier on the booking form saves a round of messages.

While `bookingLink` is `""`, the page asks guests to message @sweetsnow_oc on Instagram to book.

### The request form (optional, off)

`form: true` adds a request form to the page. It sends each request to `/api/form`, the function the website already had, and **needs one delivery setting in Vercel first**. Without it, a guest who sends the form is told it was not sent and is shown how to message the same details on Instagram.

Pick one, in Vercel → Project `sweet-snow` → Settings → Environment Variables:

| Setting | What happens |
|---|---|
| `RESEND_API_KEY` | Each request is emailed to you with [Resend](https://resend.com) (free plan). It goes to `FORM_TO_EMAIL`, or to `CONTACT_EMAIL` (already set) if that is empty. Replying to the email writes straight back to the guest |
| `FORM_WEBHOOK_URL` | Each request is posted to that address (Zapier, Make, a Google Sheet script) |

## Before announcing

- [ ] The flavors and tiers are right, and prices are in (or "Ask for a quote" is what you want)
- [ ] The label colors match your real labels
- [ ] The facts taken from the team plan still hold for pre-made cups: "For 50 to 200+ guests", "Same milk base and Korean snow machine as our shop"
- [ ] The booking calendar link is in, and **Pick a time** opens your calendar
- [ ] Then set `announce: true`

While `announce` is `false`, the site works for anyone who has the link, is not in the main website's menu, and asks search engines to skip it.

## For Claude

- Templates and the cup drawing: `build/lib/catering.mjs`. Styles: `build/src/catering.css` (standalone: the catering pages do not load the main site's styles). Script: `build/src/catering.js`. The pages also load the shared `assets/site/app.js` for the language switch and the header.
- Typefaces: Lilita One (titles) and Outfit (text), both SIL Open Font License. `python3 build/fonts.py catering` makes `assets/site/fonts/lilita.woff2` and `outfit.woff2`. Korean titles load Jua from Google Fonts only when Korean is chosen.
- `node build/build.mjs` writes `catering/index.html`, `catering/thanks.html`, `assets/site/catering.js` and `assets/site/ko-catering.json`. Do not edit those by hand.
- Korean wording: the `// catering site` lines in `build/ko-extra.mjs`. Flavor names follow the owner's dictionary in `designs/language.js`.
- With `announce: false` the other pages build byte for byte as before. With `announce: true` every main-site page gains the menu link (`build/src/nav-catering.css` keeps five links on one line) and `sitemap.xml` gains `/catering`.
- Sources for the design: the "Sweet Snow Catering — Team Plan" deck (colors, who books, guest range, "Same snow. New places."), and the page structure common to dessert catering sites (offer, what is in the cup, tiers, who it is for, how it works, booking).
