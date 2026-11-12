# Menu differences for you to decide

Checked on November 12, 2026. I compared three things:

- the live site (www.sweetsnow.org),
- `website/menu-2026-august.js` and the files around it,
- what the redesign now shows.

**Short version: the redesign shows the same items, names and recipes as the live site. Nothing was added, renamed, repriced or removed.** Where the files disagree with the live site or with themselves, I followed the live site and listed the question here.

File and line for every item and price: see [MENU-SOURCES.md](MENU-SOURCES.md).

## Please decide

| # | What I found | What the redesign does now | Your call |
|---|---|---|---|
| 1 | The live site shows no prices (note on line 714 of the menu file). | Prices stay hidden. | Keep hidden, or show them? One switch: `showPrices` in `site-settings.js`. |
| 2 | Three bowls have two prices in the file. Cookies and Cream: $16.99 (line 203) vs $15.99 (Square list, line 719). Matcha Strawberry: $16.99 (line 223) vs $17.99 (line 719). Strawnana Pie: $18.99 (line 187) vs $17.99 (line 719). | Uses the Square list price, which is what the current code ends up with. Not visible while prices are hidden. | Which price is right for each? |
| 3 | Strawberry Mango Popping Candy Cup: $9.99 in the Square list (line 719), $11.99 in the newer line 777. | Uses $11.99 (the newer line wins). | Confirm $11.99. |
| 4 | The Square list on line 719 is from October 26. It also decides which items say "Check availability" (Mango, Mango & Strawberry, Lychee Heaven, Hojicha Tiramisu, Mango Jelly Cup and all four croffles). | Same links as the live site. Live "SOLD OUT / FEW LEFT" badges still come straight from Square. | Keep these links, or refresh the list first? |
| 5 | Mini taiyaki: the older lines (613–629) say 5 pieces, six flavors with Sweet Potato, $6.99 / $8.99. The live site says 7 pieces, five flavors, no Sweet Potato ($8.99, Dubai $13.99 from Square). | Follows the live site: 7 pieces, five flavors. | Confirm. Should Sweet Potato come back? |
| 6 | Cream top: the file says "Add house-made cream top $3" (line 562). An October 12 change lowered it to $2, but today's file says $3 again. The live site does not show it. | Not shown. | Is it $2 or $3, and should it show? |
| 7 | Extra Banana has no price in the file (line 576). Strawberry and Mango are $3. | No price (prices are hidden anyway). | What is the banana price? |
| 8 | Tagline: the file says "Korean Shaved Ice" (line 50), the logo says "Korean Dessert Cafe", you asked for "Authentic Korean Bingsu". | Shows "Authentic Korean Bingsu" next to the logo. Line 50 is not used on the site. | Confirm. |
| 9 | `menu-art.js` was not in the repo. It was deleted on October 7. | I restored the October 6 copy from the repo history, unchanged, and use it for the bowl that builds itself as you scroll. | OK to bring it back? |
| 10 | Your Mango drawing shows coconut flakes. Today's Mango recipe has none. | The drawing is used as it is, only for the "how a bingsu is built" story. | Keep Mango, or pick another drawing (`buildBowl` in `site-settings.js`)? |
| 11 | The hidden search-engine menu list on the live home page is out of date: it is missing Strawberry Cheesecake Cup, which the visible menu shows. | The redesign writes this list from the menu file, so it always matches. Coming-soon items (Honeycomb x2, Sweet Potato Cream Bingsu) are left out, as before. | Nothing to do. |
| 12 | The link-preview picture (`og:image`) is a 1.8 MB SVG. Most apps (iMessage, Instagram, Facebook) cannot show SVG previews. A ready 1200×630 PNG exists: `assets/share-bunny-blue.png`. | Tag kept exactly as it was, as you asked. | I recommend switching to the PNG. Say yes and I change one line. |

## In the files but not on the live site (kept hidden)

These stay hidden, the same as the live site. Tell me if any should come back.

- Bowls removed on line 708: Watermelon, Cereal Killer, Açaí, Mango Special, Strawberry Special.
- Bowls not in the Square list, so the code drops them: Blueberry Yogurt Cheesecake, Matcha Red Beans, Milk & Honeycomb (replaced by Honeycomb x2).
- Lychee & Strawberry half-and-half (added on line 731, removed on lines 733–734).
- Coming-soon bowls marked hidden: Melon, Classic Pat Bingsu, Dubai Chocolate, Vietnamese Coffee, S'mores, Green Grape Aloe, Cookie Monster. Also Banana Split and Neapolitan (not hidden in the file, but the live site does not show them).
- Cups: the older "Strawberry Cream Puff" (removed on line 760).
- Croffles: Plain Croffle ($4.99, old `designs/production.js` line 31), Strawnana Croffle and Chocolate Banana Fudge Croffle (removed on line 756).
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
- I did not translate item names. These names have no Korean in your dictionary yet, so they stay in English in Korean mode: Honeycomb x2, Sweet Potato Cream Bingsu, Biscoff Caramel Cup, Strawberry Cheesecake Cup, Matcha Mochi Ice Cream, and the four croffles.
- The small vertical sign in the hero says 정통 눈꽃빙수. That wording is mine. Tell me if you want different words, or none.
