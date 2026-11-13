# Sweet Snow Catering

The catering landing page: **`sweetsnow.org/catering`**. Instagram ads and your bio link can point here.

What it shows, in order: our bingsu and a **Book an appointment** button, how to book, the three tiers, the event menu, the extras on the side (taiyaki add-on, pre-made cups), and booking with Snow the chat helper or a form.

## The three designs

There are three designs, all based on the main website's look with a cuter concept. Each is a complete landing page with its own address, so different ads can land on different designs:

| Address | Name | What it is |
|---|---|---|
| `sweetsnow.org/catering/bunny` | Snow Bunny | Closest to the website: milk-blue and airy, with the bunny, falling snow and doodles |
| `sweetsnow.org/catering/cloud` | Cotton Cloud | A pastel sky: bowls on a cloud, soft pink and butter yellow, everything round |
| `sweetsnow.org/catering/diary` | Sticker Diary | A scrapbook: polaroids with tape, stickers, dotted paper, handwritten titles |

`sweetsnow.org/catering` itself shows the one written next to `design` in the settings file. See all three side by side at **`sweetsnow.org/catering/designs`**.

Every booking email says which design the guest was on ("Page design"), and which ad brought them if the ad's link has `utm_` tags, for example `sweetsnow.org/catering/cloud?utm_source=instagram&utm_campaign=spring`. That is how to tell which design brings more bookings.

## The catering section on the home page

The home page of `sweetsnow.org` has a catering section after the cup bingsu, tagged **Coming soon**. It shows the three bowls from `heroItems` and the three tiers. It has no link to the catering page yet, so home page visitors cannot start a booking while it says coming soon.

It is the `homePage` part of the settings file:

| To do this | Change |
|---|---|
| Take the section off the home page | `show: false` |
| Change or remove the tag | `label: "Now booking"`, or `label: ""` for no tag |
| Change the words | `title`, `text` |
| Add an "Explore catering" link to the catering page | `link: true` |

When catering opens: set `label: ""` (or new words) and `link: true`.

## You only edit one file

**`catering-settings.js`**. Open it on GitHub, tap the pencil, change the words, and publish the same way as the rest of the site ([how to publish](../../docs/HOW-TO-UPDATE.md#publish)). Each part of the file has a short note above it.

| To change | Edit |
|---|---|
| Which design `sweetsnow.org/catering` shows | `design` |
| The big headline and the words under it | `headline`, `text` |
| The three bowls at the top | `heroItems` |
| The small facts under the buttons | `facts` |
| A tier's name, words, price or guest count | `tiers` |
| How many bingsu a tier has | `picks` in that tier: one `"Classic"` or `"Special"` per bingsu |
| The taiyaki add-on line on a tier | `addOn` in that tier |
| Leave a bingsu off the event menu | `leaveOut` |
| The taiyaki and pre-made cup cards | `taiyaki`, `preMade` |
| The event types guests can pick | `events` |
| The times of day guests can ask for | `appointments` → `times` |
| What Snow answers to quick questions | `answers` |
| The catering section on the home page | `homePage` |
| Put "Catering" in the main website's menu | `announce: true` |

The event menu lists every Classic and Special bingsu on the main menu by itself (coming-soon items are left out), with its photo. If an item is renamed or hidden on the menu, the preview link shows a yellow bar that names the line to fix.

### Tier prices

`price: ""` shows "Ask for a quote". Write `price: "$12 per guest"` (any wording) to show a price. `guests: "50 to 100 guests"` adds a second line.

## Booking: Snow and the form

Guests book in the chat with **Snow**, a simple helper that follows a script (it is not an AI). Snow asks for the event, the event date, the guest count, the tier (and the taiyaki add-on for a tier that has one), a day and time of day for the appointment, a name, and a phone or email. Snow also answers the quick questions in `answers` and can take a free question. "Use the form instead" opens a plain form with the same fields; without JavaScript the form is what shows.

Every request and question is sent to `/api/form`, which **emails it to you**. The email has all the details, replying to it writes straight back to the guest, and it ends with a link that adds the appointment to your Google Calendar in one tap.

### One-time email setup

The email goes out through [Resend](https://resend.com) (free plan). It needs one key in Vercel:

1. Make a Resend account with the email address the requests should arrive at.
2. In Resend, create an API key.
3. In Vercel → Project `sweet-snow` → Settings → Environment Variables, add `RESEND_API_KEY` with that key, for Production and Preview. Redeploy.

Requests go to `CONTACT_EMAIL`, which is already set in Vercel (or to `FORM_TO_EMAIL` if you add one). Until the key is in, Snow and the form tell the guest the request was **not** sent and offer to copy it into an Instagram message, so no one thinks they booked when they did not.

`FORM_WEBHOOK_URL` is another way: each request is posted to that address (Zapier, Make, a Google Sheet script). It can be used with or without the email.

## Before pointing ads at it

- [ ] `design` is the one you want at `sweetsnow.org/catering`
- [ ] The tiers and prices are right (or "Ask for a quote" is what you want)
- [ ] The facts taken from the team plan are right: "For 50 to 200+ guests", "Same milk base and Korean snow machine as our shop"
- [ ] `RESEND_API_KEY` is in Vercel and a test booking reached your inbox

While `announce` is `false`, the page works for anyone who has the link (ads included), is not in the main website's menu, and asks search engines to skip it.

## For Claude

- Templates and drawings: `build/lib/catering.mjs`. Styles: `build/src/catering.css` (shared) plus `build/src/catering-<design>.css`, layered on the main site's `styles.css` and look file. Script (Snow, the form): `build/src/catering.js`. The pages also load the shared `assets/site/app.js` for the language switch, the header and the falling snow.
- Snow's lines are plain text in a hidden block of the page (`[data-chat-lines]`), so they translate like any other text. Korean wording: the `// catering` lines in `build/ko-extra.mjs`. Bingsu names follow the owner's dictionary in `designs/language.js`.
- `node build/build.mjs` writes `catering/index.html`, `catering/thanks.html`, `catering/bunny.html`, `catering/cloud.html`, `catering/diary.html`, `catering/designs.html`, `assets/site/catering.js` and `assets/site/ko-catering.json`. Do not edit those by hand. The three design pages are marked noindex and name `/catering` as their canonical address. `catering/samples/*.jpg` are the phone screenshots shown on the designs page; retake them after a design changes.
- `api/form.js`: forms `catering-appointment` and `catering-question`.
- The home page section is `homeSection` in `build/lib/catering.mjs`, with styles in `build/src/home-catering.css`. Only `index.html` loads those styles. It sits at `/#catering`. With `homePage.show: false` the home page builds without it, byte for byte.
- With `announce: false` the other pages build byte for byte as before. With `announce: true` every main-site page gains the menu link (`build/src/nav-catering.css` keeps five links on one line) and `sitemap.xml` gains `/catering`.
- Sources: the "Sweet Snow Catering — Team Plan" deck (who books, guest range, same milk base and machine) and the owner's brief of Nov 13 (bingsu made the normal way; tiers Basic, Premium, Special; taiyaki add-on; pre-made cups on the side; landing page for Instagram ads).
