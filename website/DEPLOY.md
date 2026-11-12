# Sweet Snow website publishing

Canonical URL: https://www.sweetsnow.org/

Vercel project: `sweet-snow`, team: `sweet-snow`, root directory: `website`.
GitHub `main` publishes automatically. The site is static HTML/CSS/JavaScript with serverless endpoints in `api/`.

## Source baseline

On November 12, 2026, this repository was synchronized with the complete November 10 production release after a documentation-only GitHub push had redeployed an older October website snapshot. Every restored file was checked against that deployment's source hash. The restored release includes the approved croffle and cup-bingsu homepage sections and the intervening menu, logo, image and sizing updates.

## Pages and behavior

- `/`: Shine Muscat campaign, croffle and cup campaigns, and bingsu introduction.
- `/menu`: menu and toppings, rendered with `menu-2026-august.js` and the scripts in `designs/`.
- `/visit`: location, hours and directions.
- `/privacy` and `/thanks`: supporting pages.
- `api/inventory.js`: Square availability.
- `api/form.js`: existing form integration.

Preserve Vercel environment variables, Search Console verification, analytics, ordering links, and existing menu data when making unrelated edits. Never commit credentials or operational records.

Before publishing, compare the repository with the current production deployment, scope the changes, preview affected pages on desktop and mobile, and check links and images. After deployment, verify the production alias and the actual content at https://www.sweetsnow.org/. Follow `../docs/WORKFLOW.md`.
