# Lumière landing page

The brand site for the Lumière iPhone app: highlights, every feature, plans, an app guide with screenshots, a section for readers, and an FAQ — in English and Burmese.

A standalone React 18 + Vite app. Plain CSS, no UI library, no backend; `npm run build` gives static files for any host (Vercel, Netlify, Cloudflare Pages).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

## Where things live

| What | File |
|---|---|
| App Store link, support email, privacy/terms links | `src/content/site.js` (`site`) |
| Prices and credit numbers (one place only) | `src/content/site.js` (`pricing`) |
| English copy | `src/content/en.js` |
| Burmese copy (standard Unicode, not Zawgyi) | `src/content/my.js` |
| Brand colours and fonts | `src/styles/tokens.css` |
| Sections | `src/components/` |

Both copy files have the same shape: add a feature or guide step to both. Until `site.appStoreUrl` is set, the buttons say “Coming soon”.

## Live demos

- **Ask the cards** (`src/components/Tarot.jsx`): the app's yes-or-no tarot. `public/tarot/deck.json` is the app's 78-card deck (`ios/Lumiere/Services/SampleTarot.swift`: name, verdict, keywords, Burmese answer), and `public/tarot/*.webp` is its public-domain Rider–Waite–Smith art at 280px. The deck loads when the section scrolls near; a card's art only when it is hovered or chosen. Nothing is sent anywhere.
- **What were you born under?** (`src/components/SignFinder.jsx`): birthday → sign (the app's seeded ranges) and Mahabote birth day with animal, direction, friend and enemy day (the app's `MahaboteMatch` table). Computed in the browser.

Both are code-split and mount only near the viewport (`LazySection`), so they cost nothing for people who don't scroll to them.

## Speed

Built for slow connections: an inline night-sky splash paints before the script; Figtree loads with `display=swap` and the Myanmar font only when Burmese is chosen; screenshots are WebP at 360 and 720px picked by `srcset`; the starfield caps pixel ratio, draws at ~30fps and stops off screen; motion stops for `prefers-reduced-motion`. On emulated slow 3G with a 4× slower CPU, a phone paints in ~2s and loads ~230KB up front.

## Search and sharing

`npm run build` prerenders the page into real HTML (`scripts/prerender.mjs`): English at `/`, Burmese at `/my/`, so search engines and link previews (Facebook, Viber, Telegram) see the content without running JavaScript. Each page gets its own title, description, canonical link, `hreflang` alternates (`en`, `my-MM`, `x-default`), share image (`public/og/share-{en,my}.jpg`, 1200×630) and structured data (organization, website, webpage, iOS app, FAQ). `robots.txt`, `sitemap.xml` and `llms.txt` are written alongside.

All absolute URLs come from `siteUrl` in `src/content/site.js` (`https://lumiere.onezcodes.com`). Change it there and rebuild if the domain moves. The language toggle is a real link to `/` or `/my/` (so crawlers can follow it) and still switches in place; someone who chose Burmese before is moved to `/my/`.

Components render in Node at build time, so read `window`, `document` or `localStorage` only inside effects, and start with what the prerendered HTML shows (see `useNarrow` in `AppGuide.jsx` and `hydrated` in `theme.jsx`).

## Light and dark

Like the app's Appearance setting, the site follows the device until someone chooses: the ☀/☾ button in the header switches and remembers it, and the footer's Light / Dark / Auto goes back to the device (`src/theme.jsx`). An inline script in `index.html` applies the theme before first paint, so there is no white flash. Light sections use theme tokens (`--bg`, `--text`, `--muted`, `--card`, `--line`… in `src/styles/tokens.css`) with the app's own dark colours; the night sections are dark in both.

## Screenshots

Real screens from the iOS app, in `public/screens/<name>-360.webp` and `-720.webp`, inside a CSS iPhone frame (a branded placeholder shows if one is missing).

Capture with the app on its **sample data**: build without `ios/Config/Lumiere.local.xcconfig` (empty `API_BASE_URL`), so no real account or server is involved.

1. Run the Lumiere scheme on an iPhone simulator (light appearance).
2. Open a screen, then `npm run screen -- <name>`: clean 9:41 status bar, saved to `screens-raw/<name>.png` (git-ignored).
3. `npm run screens` turns everything in `screens-raw/` into the two WebP sizes (needs `cwebp`: `brew install webp`).
4. Dark mode: set the simulator to dark (`xcrun simctl ui booted appearance dark`), capture the same screens into `screens-raw/dark/`, run `npm run screens`, and list them in `src/data/screens.js`. A screen without a dark capture falls back to its light one.

| Name | Screen |
|---|---|
| `onboarding` | Register: birthday step |
| `confirm-sign` | This is your sign |
| `welcome-plus` | 7 days of Plus, free |
| `home` | Home |
| `my-reading` | Today's Lumiere post for a sign (Libra) |
| `lumiere-element` | Today's Lumiere post for an element (Fire), behind `my-reading` in Highlights |
| `tarot` | A reader's pick-a-card spread on Home |
| `birth-chart` | You › Your birth chart |
| `timing` | You › Birth chart › Timing › Today (behind `birth-chart` in Highlights) |
| `matrix` | Birth chart › Matrix |
| `match` | Home › Check your match: the overview |
| `match-mahabote` | The same match › မဟာဘုတ် tab |
| `match-matrix` | The same match › Matrix tab (behind `match` in Highlights) |
| `games` | Home › Play: a Who am I? table |
| `readers` | Search › readers |
| `reader-profile` | A reader's profile |
| `personal-reading` | Confirm a personal reading |
| `booking` | Reader › See times |
| `messages` | A message thread |
| `credits` | You › Credits |
