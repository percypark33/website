# How to update the website

You only edit one small file: **`website/site-settings.js`**.
You can do it in a browser, on your phone or laptop. No software to install.

## Open the file

1. Go to https://github.com/percypark33/website
2. Tap `website`, then `site-settings.js`.
3. Tap the pencil (Edit).

Rules while editing: keep the quote marks `" "`, keep the comma at the end of each line, and spell item names exactly as on the menu.

## Change a price

Find `menuEdits` and add one line:

```js
menuEdits: {
  "Mango": { price: 15.99 },
},
```

Prices only show on the site when `showPrices` is `true` (it is `false` today). TV menus and Square keep their own prices.

## Change a menu item

Same place, one line per change:

```js
menuEdits: {
  "Mango": { ing: "Fresh Mango · Homemade Syrup · Mochi" },   // change the recipe words
  "Honeycomb x2": { comingSoon: false },                      // it is here now
  "Hojicha Tiramisu": { hidden: true },                       // take it off the website
  "Strawnana Pie": { name: "Strawnana Pie Bingsu" },          // change the name
},
```

To add a brand-new item, add it to `menu-2026-august.js` the way items were added before, then add its picture under `photos` in `site-settings.js`. Ask Claude to do this one; it takes a minute.

## Change the big item at the top of the home page

Find `hero` and change `item` to the menu name you want. Change the words next to it if you like:

```js
hero: {
  item: "Lychee Heaven",
  label: "Back this week",
  title: "Lychee Heaven",
  text: "Juicy lychee, coconut jelly and soft milk snow."
},
```

Leave `title` or `text` as `""` to use the menu name and recipe.

## Change the catering site

Catering has its own easy file: **`website/catering/catering-settings.js`**. The headline, flavors and label colors, tiers, prices and the booking calendar link are all there. The steps are in [`website/catering/README.md`](../website/catering/README.md).

## Publish

1. Tap **Commit changes**.
2. Choose **Create a new branch and start a pull request**, then **Propose changes**, then **Create pull request**.
3. Wait about one minute. Vercel adds a **Preview** link to the pull request. Open it on your phone and check.
4. Happy? Tap **Merge pull request**. The live site updates in about one minute.
5. Not happy? Tap **Close pull request**. Nothing changes on the live site.

If you made a typo, the preview fails with a red ✗ and the live site stays as it was. Open the pencil again and fix the line.

## Good to know

- New photo: upload it to `website/assets/`, then put its path under `photos`. It works right away. For the fastest loading, ask Claude to "run the image optimizer".
- Korean words: your dictionary is `website/designs/language.js`. Words for the new sections are in `website/build/ko-extra.mjs`.
- The family letter and photo captions: `website/designs/brand-story.js` (same as before).
- The look, the bowl drawing used in the scroll animation, the links and the home page features are also in `site-settings.js`, each with a short note.
- The machinery lives in `website/build/`. You do not need to open it.
