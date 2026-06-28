# Heat Map — Where Europe is dying right now 🔥

A satirical, gamified heatwave dashboard, built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**. No external image/font fetches — everything renders offline with system fonts, CSS gradients, and inline icons (lucide-react).

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Weather data — Open-Meteo (no API key needed)

All weather data comes from **[Open-Meteo](https://open-meteo.com/)**, a free and open-source weather API that requires **no API key** for non-commercial use.

**"Most Cooked Cities" leaderboard** (`lib/cityWeather.ts` + `app/api/cities-weather/route.ts`):
- A single multi-location request fetches current temperatures for all ~47 European capitals in one call via comma-separated coordinates.
- The response is cached server-side for 30 minutes (`revalidate: 1800`) so that all visitors share the same outbound call regardless of traffic.
- Results are sorted hottest → coldest with relative percent scoring and status labels (Insane / Inferno / Hot AF / Hot / Mild / Basically winter).

**"Your Heat" local temperature** (`app/api/weather/route.ts`):
- When a visitor grants geolocation (or falls back to IP), their coordinates are sent to Open-Meteo's forecast endpoint for the current temperature.
- Open-Meteo's free [Geocoding API](https://open-meteo.com/en/docs/geocoding-api) provides a reverse-geocoded city name from the coordinates.
- This route makes one call per visitor and is not cached — Open-Meteo's free tier (10,000 calls/day, 5,000/hour, 600/minute) easily handles per-visitor usage at this app's scale.

No environment variables or configuration needed for weather features.

## Project structure

```
app/
  layout.tsx       Root layout, metadata
  page.tsx          Assembles the dashboard
  globals.css       Design tokens (colors, fonts) + keyframe animations + marker styles
components/
  Sidebar.tsx       Desktop nav rail, server temp stat, share, heat tip card
  MobileNav.tsx     Hamburger + slide-out nav drawer for small screens
  TopBar.tsx        "Europe Cooked Index" stat, live trend chart, profile, icons
  Sparkline.tsx     Animated SVG trend line (no charting lib dependency)
  IceCreamButton.tsx  The "Buy me an Ice Creem" cool-down CTA
  MapPanel.tsx      View toggle, wrapper — dynamically loads the Leaflet map
  MapView.tsx       react-leaflet MapContainer, tile layers, heat overlay, zoom controls
  MapMarker.tsx     City marker rendered as L.divIcon (preserves the original pin design)
  CityPin.tsx       Legacy marker component (no longer imported; kept for reference)
  GhostPinLayer.tsx  Ambient ghost pins rendered as animated circle markers on the Leaflet map
  RightRail.tsx     "Most Cooked Cities" leaderboard, Drop Your Suffering CTA, Sweat Dance card
  LiveFeed.tsx      Horizontally scrolling live suffering feed
  Footer.tsx        Status strip
lib/
  data.ts                   All city / leaderboard / feed content in one place — edit here
  useLiveHeat.ts            Client hook that simulates live fluctuations (swap for WebSocket/API later)
  useAmbientActivity.ts     Simulated activity engine — cooked index, ambient suffering count, leaderboard drift, synthetic feed, ghost pins
  AmbientActivityContext.tsx Context provider for the simulated activity state
```

## Interactive map

The fake CSS heat-grid has been replaced with a real interactive Leaflet map:

- **Heat View** — [CARTO dark_all](https://carto.com/basemaps) base tiles + a true heat overlay via `leaflet.heat`, weighted by each city's `percent` value.
- **Satellite View** — [Esri World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9) tiles (free, no key required). To upgrade to higher-quality Mapbox satellite tiles, set `NEXT_PUBLIC_MAPBOX_TOKEN` in a `.env.local` file — the app falls back to Esri when the token is absent.
- City markers use `L.divIcon` and preserve the original visual design (avatar initial, pulse ring, crown for #1, score/status label).
- The zoom buttons and "people suffering" counter are positioned over the map and wired to the Leaflet API.

## Live data simulation

`lib/useLiveHeat.ts` runs a `setInterval` on the client that randomly jitters city scores/percentages, the global suffering count, and the sparkline every 4 seconds. The hook returns the same shape a real backend would, so switching to a WebSocket or polling endpoint requires changing only the `useEffect` inside the hook — search for the `🔁 REAL-TIME SWAP POINT` comment.

## Ambient / simulated activity

When real traffic is low, the app keeps feeling alive with simulated activity driven by `lib/useAmbientActivity.ts`. This is a separate hook from the real data layer — all simulated numbers stay in their own context (`AmbientActivityContext`) so they never pollute real user submissions.

### What it simulates

- **Cooked Index %** — drifts gently upward (70% of ticks) with small ±0.1–0.4 changes every 6–10 s, clamped 60–96.
- **"People suffering" counter** — ticks up by 1–9 every 4–8 s, with occasional small decrements (-1 to -3, ~1 in 8 ticks).
- **Leaderboard percentages** — each city gets independent ±0.1–0.3 drift every 15–30 s, displayed on top of the base percent from real submissions.
- **Live feed entries** — a new synthetic post is prepended every 20–45 s from a pool of ~30 believable name/city/message combinations. Entries age naturally ("Just now" → "30s ago" etc.). Capped at 20 visible entries.
- **Ghost map pins** — small glowing dots pulse near real city positions every 5–12 s, fading out after 8–20 s. Max 8 concurrent pins to avoid clutter.

### Configuration

All timing knobs live in a single exported config at the top of `lib/useAmbientActivity.ts`:

```ts
export const AMBIENT_CONFIG = {
  enabled: true,
  cookedIndexDriftMs: [6000, 10000],
  sufferingTickMs: [4000, 8000],
  leaderboardDriftMs: [15000, 30000],
  feedIntervalMs: [20000, 45000],
  ghostPinIntervalMs: [5000, 12000],
  ghostPinLifespanMs: [8000, 20000],
  maxGhostPins: 8,
  maxFeedEntries: 20,
};
```

Set `enabled: false` to turn off all simulated activity once real traffic doesn't need a floor anymore. Each value is `[min, max]` milliseconds between ticks — the actual interval randomizes uniformly within that range every tick for organic timing.

### `prefers-reduced-motion`

Ghost pin fade-in animations and the leaderboard percent drift snap instantly (no animation) when the user's OS accessibility setting `prefers-reduced-motion: reduce` is active, consistent with the other animations in `app/globals.css`.

## Customizing

- **Cities, scores, leaderboard, feed copy** → edit `lib/data.ts`.
- **Colors** → edit the CSS variables at the top of `app/globals.css` (`--ember`, `--crimson`, `--frost`, `--gold`, etc.) — every component reads from these tokens.
- **"Buy me an Ice Creem" button** → `components/IceCreamButton.tsx`. It currently just shows a thank-you state on click; wire it up to Stripe/Ko-fi/Buy Me a Coffee by replacing the `onClick` handler with a link or checkout call.
- **Nav items** → `NAV_ITEMS` exported from `components/Sidebar.tsx` (shared with the mobile drawer).
- **Sweat Dance TikTok URL** → defined as `SWEAT_DANCE_TIKTOK_URL` at the top of `components/Sidebar.tsx`. Update it to point to the official hashtag/page when confirmed.

## Notes

- Avatars are generated initials (no external image hosting), so the app has zero mandatory third-party runtime dependencies (Leaflet tiles load from CDN at runtime).
- The map uses Leaflet + react-leaflet, dynamically imported to avoid SSR issues (`ssr: false`). A spinning skeleton is shown while the map loads.
- Built and lint-checked with `npm run build` / `npx eslint .` — both pass clean.

## SEO Strategy & Marketing Infrastructure

An expert-level, comprehensive SEO setup is implemented to drive both viral slang traffic (teens/social media) and high-intent informational weather traffic (adults).

### 1. New SEO Routes
- **`app/quiz/page.tsx` (`/quiz`)** — Satirical "Am I Cooked?" interactive multiple-choice quiz. Calculates a personalized cooked score.
- **`app/quiz/result/[score]/page.tsx` (`/quiz/result/[score]`)** — Shareable, indexable result routes with server-side metadata and dynamically generated OG images.
- **`app/cities/[slug]/page.tsx` (`/cities/[slug]`)** — Real-time weather, heat advisory ratings, and safety resources for European capitals.
- **`app/heat-index/page.tsx` (`/heat-index`)** — Educational cluster guide explaining feels-like temperature vs air temperature.
- **`app/heatwave-safety/page.tsx` (`/heatwave-safety`)** — Public-health aligned extreme heat guidance with medical disclaimers.
- **`app/glossary/page.tsx` (`/glossary`)** — Satirical glossary explaining terms like "cooked", "sweat dance", and "heat check" to capture slang search terms.

### 2. Metadata & Structured Data
- **Organization Schema** — Rendered in the root layout to define "Am I Cooked" organization branding.
- **BreadcrumbList Schema** — Rendered on `/quiz`, `/quiz/result/[score]`, `/cities/[slug]`, `/heat-index`, `/heatwave-safety`, and `/glossary` to improve search snippet formatting.
- **FAQPage Schema** — Structured Q&A questions on the Heat Index and Heatwave Safety pages to capture rich search features (FAQs).
- **Dynamic Open Graph Images** — Created dynamic image generators using `next/og` for `/quiz/result/[score]` and `/cities/[slug]` so link previews show customized result cards.

### 3. Action Items for Deployments
- **Social Media Placeholders** — In `app/layout.tsx`, update the `sameAs` array placeholders inside the `orgSchema` object with the official URLs for:
  - TikTok: `https://www.tiktok.com/@amicooked`
  - Twitter/X: `https://twitter.com/amicooked`
  - Instagram: `https://www.instagram.com/amicooked`
- **Sitemap submission** — Once deployed, resubmit the dynamic sitemap located at `[your-domain]/sitemap.xml` to Google Search Console to register the new guides and all 40+ city routes instantly.

