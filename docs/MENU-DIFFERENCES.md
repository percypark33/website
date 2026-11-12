# Menu differences and decisions

Updated November 12, 2026. I compared four things:

- the live site (www.sweetsnow.org),
- `website/menu-2026-august.js` and the files around it,
- the live Square catalog (read only, November 12),
- what the redesign now shows.

File and line for every item and price: see [MENU-SOURCES.md](MENU-SOURCES.md).

## Decided by you on November 12

| What | Your decision | What I did |
|---|---|---|
| Look | Design 1, Milk Snow | Already built in that look. |
| Cookies and Cream | $15.99 | Already the price in use. Square agrees. |
| Matcha Strawberry | $17.99 | Already the price in use. Square agrees. |
| Strawnana Pie | $17.99 | Already the price in use. Square agrees. |
| Strawberry Mango Popping Candy Cup | $11.99 | Already the price in use. Square agrees. |
| Other prices | Check Square | Done. Seven prices had changed in Square; see the next table. |
| Mini taiyaki | 7 pieces, Sweet Potato is back | Sweet Potato added as the sixth filling (menu file line 804), $9.99 from Square. |
| Cream top | $2 | Menu file line 562 changed from $3 to $2. Still not shown on the website, same as the live site. |
| Mango drawing | No coconut flakes | The coconut flakes are left out of the scroll animation (`buildBowlLeaveOut` in `site-settings.js`). Your drawing file `menu-art.js` is not changed. |

## Square price check, November 12

Every item on the site was compared with the live Square catalog. All bowls matched. These seven had a newer price in Square, and I set them to the Square price (menu file lines 795–800):

| Item | Was (older Square list) | Now (Square today) |
|---|---|---|
| Mango Jelly Cup | $8.99 | $10.99 |
| Injeolmi Jollypong Cup | $8.99 | $10.99 |
| Cookies and Cream Cup | $8.99 | $10.99 |
| Cheese mini taiyaki | $8.99 | $9.99 |
| Injeolmi Croffle | $6.99 | $7.99 |
| Biscoff Caramel Croffle | $7.99 | $8.99 |
| Cookies and Cream Croffle | $7.99 | $8.99 |

The website still shows no prices, so customers see no change. Tell me if any of these should not follow Square.

## Decided by you on November 12, second round

| What | Your decision | What I did |
|---|---|---|
| Sweet Potato photo | Create a new one | New bag photo made from your custard bag photo. Only the filling was changed, to match your own sweet potato photo. File: `assets/mini-taiyaki-bags-20261108/sweet-potato-20261112.webp`. Swap it for a real photo any time. |
| Strawberry Cheesecake Cup | It is $12.99 | The site already shows it at $12.99 (menu file line 783). It is still missing in Square; see "Still open". |
| Injeolmi Croffle recipe | The one with the cream | Now "House-Made Cream, Injeolmi Powder, Crushed Almonds", the same words as Square (menu file line 811). |
| Plain Croffle | Add it | Added as the fifth croffle: "Golden croffle dusted with powdered sugar", $4.99, both from Square (menu file line 812). Photo: `assets/croffles/plain-powdered-sugar-20261025.png`. |
| Prices | Hide | Prices stay hidden (`showPrices: false` in `site-settings.js`). |
| Link preview picture | Make one | New 1200×630 picture with your logo, the tagline and the Shine Muscat bowl photo: `assets/share-sweet-snow-20261112.jpg`. The `og:image` and `twitter:image` tags now point to it. |

## Still open

| # | What I found | What the site does now | Your call |
|---|---|---|---|
| 1 | **Strawberry Cheesecake Cup is not in Square.** Adding it changes your register, so I need your yes on the exact item first. | Shown on the site at $12.99. No live "SOLD OUT / FEW LEFT" badge until Square has it. | Say yes to the draft I sent and I create it. |
| 2 | The "Check availability" links (Mango, Mango & Strawberry, Lychee Heaven, Hojicha Tiramisu, Mango Jelly Cup and four croffles) come from the October 26 Square list. | Same links as before. Live "SOLD OUT / FEW LEFT" badges still come straight from Square. | Keep these links, or drop them? |
| 3 | Extra Banana has no price in the file (line 576). Strawberry and Mango are $3. | No price (prices are hidden anyway). | What is the banana price? |
| 4 | Tagline: the file says "Korean Shaved Ice" (line 50), the logo says "Korean Dessert Cafe", you asked for "Authentic Korean Bingsu". | Shows "Authentic Korean Bingsu" next to the logo. Line 50 is not used on the site. | Nothing to do unless you want it changed. |
| 5 | The mini taiyaki photos show five pieces in the bag; the menu says seven. | Photos used as they are. | Fine to leave. A real photo with seven would be more exact. |

Smaller wording differences between Square and the site (the site wording is kept):

- Square says "Aloe Jelly"; the site says "Aloe vera" (Shine Muscat bowls).
- Square lists each side of the half-and-half bowls in more detail; the site uses the shorter lists.
- Square says "Strawberry Popping Candy on top of the mango"; the site says "strawberry-flavored Pop Rocks over the mango".
- Square calls one bowl "Shine Muscat & Lychee Bingsu"; the site calls it "Lychee & Shine Muscat".

## Fixed along the way

- The hidden search-engine menu list on the live home page was out of date (it was missing Strawberry Cheesecake Cup). The redesign writes this list from the menu file, so it always matches. Coming-soon items are left out, as before.
- `menu-art.js` was not in the repo (deleted on October 7). I restored the October 6 copy from the repo history, unchanged.

## In the files but not on the live site (kept hidden)

These stay hidden, the same as the live site. Tell me if any should come back.

- Bowls removed on line 708: Watermelon, Cereal Killer, Açaí, Mango Special, Strawberry Special. (Mango Special and Strawberry Special are archived in Square too.)
- Bowls not in the Square list, so the code drops them: Blueberry Yogurt Cheesecake, Matcha Red Beans, Milk & Honeycomb (replaced by Honeycomb x2).
- Lychee & Strawberry half-and-half (added on line 731, removed on lines 733–734).
- Coming-soon bowls marked hidden: Melon, Classic Pat Bingsu, Dubai Chocolate, Vietnamese Coffee, S'mores, Green Grape Aloe, Cookie Monster. Also Banana Split and Neapolitan (not hidden in the file, but the live site does not show them).
- Cups: the older "Strawberry Cream Puff" (removed on line 760).
- Croffles: Strawnana Croffle and Chocolate Banana Fudge Croffle (removed on line 756; archived in Square).
- Drinks: all five (cleared on line 746).
- Yogurt line, non-dairy line, large taiyaki, taiyaki ice cream, Dubai taiyaki, Dubai Chewy Cookie.

## Small wording changes in the redesign

- Hero: the word "Meet" above the title is gone. The hero now reads "Authentic Korean Bingsu", "Shine Muscat Aloe", "New at Sweet Snow", then the same description.
- Buttons: "Order online ↗" is now "Order online" with the Cash App mark. The sticky bar on phones says "Delivery" for DoorDash.
- Menu page title: "Our menu", with the short description that was already in the page source.
- The longer "What Is Snowflake Bingsu?" text was only in the page source before. It now opens under the bingsu section.
- Hours are written "5 pm – 10 pm" as on the live site (the file's lines 685–686 say "5:00 – 10:00").

## Korean

- Korean words come from your own dictionary (`designs/language.js`) first.
- New sections had no Korean. I wrote it in `website/build/ko-extra.mjs`. **Please read it and fix anything you would say differently.**
- I did not translate item names. These names have no Korean in your dictionary yet, so they stay in English in Korean mode: Honeycomb x2, Sweet Potato Cream Bingsu, Biscoff Caramel Cup, Strawberry Cheesecake Cup, Matcha Mochi Ice Cream, and the five croffles.
- The small vertical sign in the hero says 정통 눈꽃빙수. That wording is mine. Tell me if you want different words, or none.
