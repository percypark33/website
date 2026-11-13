# Sweet Snow website publishing

Canonical URL: https://www.sweetsnow.org/

Vercel project: `sweet-snow`, team: `sweet-snow`, root directory: `website`.
GitHub `main` publishes automatically. Every other branch and every pull request gets its own preview link.

Day-to-day edits (price, menu item, hero item, publish): see [`../docs/HOW-TO-UPDATE.md`](../docs/HOW-TO-UPDATE.md).

## How the pages are made

The home, menu, visit, privacy, thanks and not-found pages are written by a small build script. Vercel runs it on every change (`buildCommand` in `vercel.json`); it needs only Node, no packages.

```bash
node build/build.mjs
```

| File | What it holds |
|---|---|
| `menu-2026-august.js` | Menu names, recipes, prices, hours. Still shared with the TV menus. New owner changes are added as dated lines at the end. |
| `site-settings.js` | The easy file: hero item, look, prices on/off, quick menu edits, links, photos. |
| `menu-art.js` | The bowl drawings (restored from history; used by the scroll animation). |
| `designs/language.js` | The owner's Korean dictionary. `build/ko-extra.mjs` adds words for new sections. |
| `designs/brand-story.js` | The family letter and photo captions, English and Korean. |
| `topping-image-manifest.json` | Topping names, Korean names and pictures. |
| `catering/catering-settings.js` | The catering landing page: which of three designs, headline, tiers, appointments, the chat helper's answers, and whether catering is announced. See [`catering/README.md`](catering/README.md). |
| `build/` | The machinery: `build.mjs`, page templates in `lib/`, styles and script in `src/`. |
| `assets/site/` | Built files: small WebP photos, fonts, `app.js`, `ko.json`. |
| `index.html`, `menu.html`, `visit.html`, `privacy.html`, `thanks.html`, `404.html`, `catering/index.html`, `catering/thanks.html` | Built output. Do not edit by hand; they are rewritten on every build. |

If `site-settings.js` or the menu file has a typo, the build stops, the deployment fails, and the live site keeps the last good version. A wrong item name does not stop the build; it is listed in the build log and shown in a yellow bar on preview links only.

### Photos and fonts (only when they change)

```bash
node build/build.mjs --list-images > build/.images.json
python3 build/images.py        # needs Pillow and numpy
python3 build/fonts.py         # needs fonttools and brotli
node build/build.mjs
```

A photo without a small copy still works; the site uses the original file.

The picture shown when the site is shared (link preview) is `assets/share-sweet-snow-20261112.jpg`, 1200×630. Its layout is `build/src/share-picture.html`: open it in a browser at 1200×630, take a screenshot, save it under a new file name and update the name in `build/lib/pages.mjs` (`const og`).

## Pages and behavior

- `/`: hero item, the bowl that builds itself, croffle and cup features, our story (`/#brand-story`), find us, questions.
- `/menu`: Classic `#menu-classic`, Special `#menu-special`, Fruit Half & Half `#menu-half-half`, Cups `#single-cups`, Food `#food` (and `#mini-sides`), Croffles `#croffles`, Toppings `#toppings`. Each item keeps its `#menu-item-…` address.
- `/visit`: location guide `#find-us`, hours, directions.
- `/privacy` and `/thanks`: supporting pages.
- `/catering`: the catering landing page, where Instagram ads land. The main site's look plus one of three cute designs (`build/src/catering.css` and `catering-<design>.css`). How to book `#how`, tiers `#tiers`, the event menu `#menu`, booking `#book` (Snow the chat helper and a form). `/catering/thanks` is where the form lands without the page script; `/catering/designs` compares the three designs while `showSamples` is on. Not in the menu or the sitemap until `announce: true`.
- Old links such as `/#croffles` or `/#visit` are sent to the page that now holds that section.
- `api/inventory.js`: Square availability (SOLD OUT / FEW LEFT badges).
- `api/form.js`: emails each catering appointment request and question to the owner. Needs `RESEND_API_KEY` (recipients come from `FORM_TO_EMAIL` or `CONTACT_EMAIL`) or `FORM_WEBHOOK_URL`; without one, guests are told their request was not sent.
- `tv/`: TV menu boards. Not touched by the build.

The older page scripts and styles in `designs/` are no longer loaded by the pages. They are kept for the TV sources and for reference.

Preserve Vercel environment variables, Search Console verification, analytics, ordering links, and existing menu data when making unrelated edits. Never commit credentials or operational records.

Before publishing, compare the repository with the current production deployment, scope the changes, preview affected pages on desktop and mobile, and check links and images. After deployment, verify the production alias and the actual content at https://www.sweetsnow.org/. Follow `../docs/WORKFLOW.md`.
