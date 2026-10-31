# catherinemonmarson.com

The website of **Catherine Monmarson** — painter and sculptor, Biot, Côte d'Azur.
Static, bilingual (FR default, EN at `/en/`), built with Astro.

See [ROADMAP.md](./ROADMAP.md) for the plan, the design decisions and what still
needs to come from Cathy.

## Open it

Double-click **`open-site.cmd`**. It installs and builds on first run, then opens
http://localhost:4321 in your browser and keeps serving until you close the window.

There is deliberately no `index.html` to open directly: every link and asset path
starts from the site root, which a `file://` page cannot resolve, so it would load
unstyled with dead links. The site needs a server, however small.

For development:

```bash
npm install
npm run catalogue   # rebuild src/data/works.json from the harvested catalogue
npm run dev         # http://localhost:4321, hot-reloading
npm run build       # → dist/
npm run preview     # serve the built dist/
```

`npm run catalogue` is only needed after editing `data/artmajeur-catalogue.json`
or adding images; the generated `src/data/works.json` is committed.

## How the content works

```
data/artmajeur-catalogue.json   raw harvest — 163 records, the source of truth for works
media/originals/                162 HD photographs, one per work, named by id
scripts/build-catalogue.mjs     normalises the raw harvest → src/data/works.json
                                (titles, media in FR/EN, dimensions, price, series, availability)
src/data/works.json             what the site reads. Generated — don't hand-edit
src/data/content.ts             biography, statement, process, CV, series, sale terms
src/data/payment-links.json     work id → Stripe Payment Link, see "Selling" below
src/i18n/ui.ts                  every string, in both languages
```

### Adding a work

1. Drop the photograph in `media/originals/<id>.jpg`.
2. Add a record to `data/artmajeur-catalogue.json` with that `id`, a `title`,
   `kind` (`Painting` / `Sculpture` / `Installation`), `medium`, `size`
   (`"100x70 cm"`), `price_eur`, `year`, and any `collections`.
3. `npm run catalogue && npm run build`.

Dimension order is settled automatically from the photograph's aspect ratio, so
`100x70` becomes 100 high × 70 wide on a portrait image and the reverse on a
landscape one.

### Adding a second view of a work

Name it `media/originals/<id>-2.jpg`, then `-3`, `-4` in the order the angle strip
should show them, and run `npm run catalogue`. The strip, its thumbnails and the
lightbox's arrow-key paging appear on their own; with a single photograph the strip
is simply not rendered. Sculpture is where this matters most (ROADMAP §6.3).

### Fixing a title

`scripts/build-catalogue.mjs` holds `TITLE_FIX`, a map from the raw ArtMajeur
title to the corrected French and English titles. 55 works still have no title
at all and show as *Sans titre / Untitled* — that list is the first thing to
walk through with Cathy (ROADMAP §6.1).

## Before it goes public

Everything Catherine still has to supply lives in one file, `data/to-confirm.json`.
Fill a value in, save, and run:

```bash
npm run prelaunch
```

It lists what is ready, what is cosmetic, and what is a launch blocker, and exits
non-zero while a blocker remains. Nothing in that file is invented: an empty value
means the site omits the detail rather than guessing. With no email set the legal
and press pages point at the contact form; with no shipping rates the page says
shipping is costed per work.

To collect the missing titles, years and dimensions:

```bash
npm run worksheet
```

That writes `data/worksheet.html` — every unfinished work with its photograph,
its CM- reference and ruled lines, to print or fill on screen — and
`data/worksheet-titles.csv`, which opens straight into French Excel.

Put her answers in `data/titles.json`:

```json
{
  "260883": { "fr": "Grand réceptacle", "en": "Large vessel",
              "year": "2005", "h": 90, "w": 30, "d": 30 }
}
```

then `npm run catalogue`. Those values override anything harvested from ArtMajeur.

## Selling

Prices and availability come from the catalogue. The artwork page decides:

| Work | Button |
|---|---|
| ≤ €800 **and** has a Stripe Payment Link | **Acheter** (direct), plus an enquiry link |
| For sale, no link | **Acquérir cette œuvre** → enquiry form, pre-filled |
| Price on request | **Demander le prix** |
| Sold | **Demander une œuvre proche** |

To enable direct purchase for a work: create a Payment Link in the Stripe
dashboard (one-off, quantity 1, collect shipping address), then add
`"<work id>": "https://buy.stripe.com/..."` to `src/data/payment-links.json` and
rebuild. No keys or server are involved; nothing secret lives in this repo.

The threshold lives in `terms.buyNowBelow` in `src/data/content.ts`.

## The enquiry form

`POST`s to Netlify Forms (`name="enquiry"`), with a honeypot field. On another
host, point the form at Formspree or any form endpoint instead. Arriving from an
artwork's "Acquérir" button pre-fills which work the enquiry is about.

## Pages

| French | English | |
|---|---|---|
| `/` | `/en/` | Hero work, three doors, selected works, series |
| `/oeuvres` | `/en/works` | All 162, filterable, deep-linkable |
| `/oeuvres/[slug]` | `/en/works/[slug]` | The sales page |
| `/series`, `/series/[slug]` | same | Series index and detail |
| `/atelier` | `/en/studio` | Statement, process, full CV, press |
| `/expedition` | `/en/shipping` | Packing, times, rates, returns, collection |
| `/presse` | `/en/press` | Press facts, bio, six credited images |
| `/contact` | `/en/contact` | Enquiry form, redirecting to `/merci` or `/en/thank-you` |
| `/mentions-legales` | `/en/legal` | Legal notice, terms of sale, privacy |

Confirmation and 404 pages carry `noindex` and stay out of the sitemap.

## Deploy

Netlify (or Cloudflare Pages) with the settings already in `netlify.toml`:

- build: `npm run catalogue && npm run build`
- publish: `dist`

Then: point `catherinemonmarson.com` at it, redirect the `.fr`, and enable form
notifications to Cathy's address. `public/_headers` carries the security and
cache headers.

Before going public, fill in the placeholders marked **TO CONFIRM** in
`src/data/content.ts` (email address, Instagram) and in the legal pages (SIRET,
mediator).

## Structure

```
src/
  pages/              FR at the root, EN under /en/ — thin route files
  components/views/   one view per page, shared between the two languages
  components/         Masthead, Footer, WorkCard, Filters, RoomPreview,
                      WorkStage, Lightbox, WorkDetail
  layouts/Base.astro  head, hreflang, Person JSON-LD, chrome
  lib/works.ts        typed access, filtering, formatting, alt text
  lib/seo.ts          per-work meta and VisualArtwork + Offer JSON-LD
  styles/global.css   the whole design system, ~900 lines, no framework
```

Images are optimised at build time to AVIF/WebP with responsive `srcset`; the
36 MB of originals never reach a browser.
