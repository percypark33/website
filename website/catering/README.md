# Sweet Snow Catering

Everything for catering lives in this folder.

| Address | What it is |
|---|---|
| `sweetsnow.org/catering` | The catering page: tiers, the frozen shaped milk collection, booking an appointment |
| `sweetsnow.org/catering/frozen-milk-flyer` | The flyer, with Print and Download buttons |
| `sweetsnow.org/catering/frozen-milk-flyer.png` | The flyer as a picture (Instagram, 8 × 10 in print) |
| `sweetsnow.org/catering/frozen-milk-flyer.pdf` | The flyer as a PDF for a print shop |

## You only edit one file

**`catering-settings.js`**. Open it on GitHub, tap the pencil, change the words, and publish the same way as the rest of the site ([how to publish](../../docs/HOW-TO-UPDATE.md#publish)). Each part of the file has a short note above it.

| To change | Edit |
|---|---|
| A tier's name, words, price or guest count | `tiers` |
| What is in a tier | `items` inside that tier. Spell names exactly as on the menu |
| Add or remove a tier | Add or remove a `{ ... }` block in `tiers` |
| The shapes in the frozen milk collection | `frozenMilk` → `shapes` |
| The booking calendar link, lead time, service area | `appointments` |
| Put "Catering" in the website menu | `announce: true` |

Photos and menu names come from the menu by themselves. If an item is renamed or hidden on the menu, the preview link shows a yellow bar that names the line to fix.

### Tier prices

`price: ""` shows "Ask for a quote". Write `price: "$9 per guest"` (any wording) to show a price. `guests: "20 to 40 guests"` adds a second label.

### Frozen milk shapes

Drawings that exist: `bunny`, `bear`, `heart`, `star`, `snowflake`, `fish`, `flower`, `cloud`, `round`. For a shape that is not on the list, ask Claude to draw it.

To use a real photo, upload a cut-out PNG to `catering/photos/` and write:

```js
{ name: "Bunny", photo: "/catering/photos/bunny.png" },
```

After changing shapes or flyer words, the flyer page updates by itself. The downloadable picture and PDF do not, so ask Claude to "refresh the flyer files". Until then the preview link shows a reminder.

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

- [ ] Tier names, contents and prices are right
- [ ] The frozen milk shapes match the real collection
- [ ] The booking calendar link is in, and **Pick a time** opens your calendar
- [ ] Then set `announce: true`

While `announce` is `false`, the page works for anyone who has the link, is not in the website menu, and asks search engines to skip it.

## For Claude

- Templates and drawings: `build/lib/catering.mjs`. Styles: `build/src/catering.css`, `build/src/flyer.css`. Form script: `build/src/catering.js`.
- `node build/build.mjs` writes `catering/index.html`, `catering/thanks.html`, `catering/frozen-milk-flyer.html`, `assets/site/catering.js` and `assets/site/ko-catering.json`. Do not edit those by hand.
- `node build/flyer-image.mjs` (needs Playwright) writes the flyer PNG, PDF and `frozen-milk-flyer.json`.
- `qr-catering.svg` points to `https://www.sweetsnow.org/catering`. `flyer-logo.webp` is the blue logo at flyer size.
- Korean wording for this page: the `// catering page` lines in `build/ko-extra.mjs`.
- With `announce: false` the other pages build byte for byte as before. With `announce: true` every page gains the menu link (`build/src/nav-catering.css` keeps five links on one line) and `sitemap.xml` gains `/catering`.
