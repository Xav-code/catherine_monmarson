# Catherine Monmarson — Roadmap for the artist's website

**Objective:** an elegant, quiet, commerce-capable website that raises Cathy's visibility and
converts attention into sales — paintings, works on paper, and raku sculpture.

**Reference grammar** (the agreed direction):

- **Artsy** → restraint: one large image per screen, generous white space, minimal type, neutral ground.
- **Singulart** → the artist's story: voice, studio, process, materials, the *why*.
- **Saatchi Art** → sculpture handling: multiple viewing angles, scale cues, room previews.

---

## 0. What we already have (done)

Catalogue harvested from ArtMajeur into `data/artmajeur-catalogue.json`:

| | |
|---|---|
| Works catalogued | **163** |
| Sculptures / ceramics | **23** (with height × width; depth still missing) |
| HD images downloaded | **162** (`media/originals/`, 36 MB) |
| Series identified | Sculptures raku · Céramiques raku · Terres patinées & enfumées · Land Art · Paravents · Grands formats · Petits formats · Peintures acryliques |
| Price range present | €209 → €4,799 |
| CV | b. 1947 Orléans · Beaux-Arts de Paris · Châteauneuf-de-Grasse 1974 → Biot 2012 · ~25 solo & group shows 1993–2015 |

Known gaps to fill with Cathy (see §6): many legacy works carry camera filenames instead of
titles (`P1015294.JPG`), ~40% have no year, the sculptures have height and width but no depth,
and there is a single photograph per work — no second angle, no surface detail, no scale shot.

---

## 1. Positioning & information architecture

One site, two languages (**FR default, EN second**), five destinations:

```
/                     Hero: one full-bleed work. Three doors: Peintures · Sculptures · L'atelier
/oeuvres              The catalogue. Filter by medium · series · size · price · availability
/oeuvres/[slug]       THE SALES PAGE. Large image, zoom, angles, room preview, price, Acquire
/series/[slug]        Curated narrative groupings (Raku, Land Art, Grands formats, Paravents…)
/atelier              Biography, statement, process, materials, studio photographs, CV
/contact              Enquiry form, studio visits by appointment in Biot, workshops
/expedition           Packing, delivery times, rates, returns, collection from the studio
/presse               Press facts, biographical note, six usable images, credit line
```

Deliberate omissions: no sidebar, no homepage carousel, no social-proof badges, no "trending"
rails. Restraint *is* the brand.

---

## 2. Design system

| Token | Decision |
|---|---|
| Ground | `#FAF9F7` warm paper white — never pure `#fff` behind pigment |
| Ink | `#1A1A1A`, muted `#6B6560` |
| Accent | none. The paintings are the colour. One hairline rule `#E4E0DA` |
| Display type | Serif with real voice (Cormorant Garamond) for titles and numbers |
| Text type | Neutral grotesque (Inter) at 15–17px, 1.7 line-height |
| Grid | 12-col, max 1440px, gutters ≥ 40px desktop / 20px mobile |
| Rhythm | One work per viewport in editorial sections; 2-up / 3-up only in the index grid |
| Motion | Opacity-only fade-in on scroll, 400ms. No parallax, no zoom-on-hover |
| Dark mode | Yes, token-swapped — but artwork always sits on a near-paper plate, never inverted |

Accessibility: AA contrast, visible focus rings, full keyboard path through lightbox and filters,
real `alt` text per work derived from medium + subject.

---

## 3. The artwork page — where sales actually happen

1. **Image stage** — full-height, click/scroll zoom to HD, keyboard arrows between works.
2. **Angles strip** — for sculpture: front / three-quarter / profile / detail, as thumbnails under the stage.
3. **Room preview** — the work composited into a neutral interior at true scale, with a 175 cm
   human silhouette toggle. The single biggest conversion lever for sculpture and large canvas.
4. **Facts block** — title, year, medium verbatim ("Pigments sur toile", "Terre enfumée, raku"),
   H × W (× D) in cm *and* inches, unique/edition, signed & dated, certificate of authenticity.
5. **Price & action** —
   - works ≤ €800 → **Acheter** (Stripe Checkout, instant)
   - works > €800 → **Acquérir / Se renseigner** (form, reply within 48h), optional 3-instalment note
   - sold → "Vendu — demander une œuvre proche de cette série"
6. **Reassurance** — ships from Biot, France; rolled or stretched; crating for sculpture;
   14-day return; insured transit; VAT note.
7. **Context** — three further works from the same series. Nothing else.

---

## 4. Commerce — recommendation

**Phase 1 (launch): Stripe Checkout, no shop platform.** Every work is unique, quantity 1. Stripe
Checkout gives card + Apple/Google Pay and French VAT handling with no monthly fee (≈1.5% + €0.25
on EU cards). Enquiry form for everything above €800 — at €1,500–4,800 fine art genuinely sells by
conversation, and an "Acquérir" button that opens a dialogue converts better than a cart.

**Phase 2 (only if volume justifies it): Shopify Basic (~€29/mo) behind the same custom
front-end** via the Storefront API — real inventory, shipping zones, tax engine, abandoned-cart email.

Why not a Squarespace/Shopify theme outright: a template gets 80% of this look in a weekend, but
the one-work-per-screen stage, the room preview and the sculpture angle strip all fight the
template. A custom static site costs the same to host (€0) and is strictly faster.

**Shipping policy to settle with Cathy:** France / EU / worldwide tiers; rolled-in-tube option for
unstretched canvas; crated freight quote for sculpture and canvases over 130 cm.

---

## 5. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5**, static output | Zero JS by default, content collections, perfect Lighthouse |
| Styling | Hand-written CSS with custom properties | No utility-class noise in a design this spare |
| Images | Astro `<Image>` → AVIF/WebP, responsive srcset | 36 MB of originals must not become a 36 MB payload |
| Content | JSON + Markdown in the repo, generated from the catalogue | Cathy edits one file; no CMS to maintain |
| CMS (phase 2) | Sveltia CMS, git-backed, free | Lets Cathy add a work from her phone |
| Payments | Stripe Checkout | See §4 |
| Forms | Netlify Forms (or Formspree) → email to Cathy | No server to run |
| Hosting | Netlify or Cloudflare Pages, free tier | Push-to-deploy, instant rollback |
| Domain | `catherinemonmarson.com` + `.fr` redirect | Buy both |
| Analytics | Plausible | GDPR-clean, no cookie banner |
| i18n | Astro routing: `/` (FR) + `/en/` | FR is her market, EN is her reach |

---

## 6. Content production — what is needed from Cathy

This blocks the final 20% of quality. Priority order:

1. **Titles and years** for the 55 works currently named `P10154xx.JPG`. One pass down a list.
2. **Depth for the sculptures** — height and width came through from ArtMajeur, depth did not; plus a weight bracket for crating.
3. **A second photograph of each sculpture** (three-quarter view) plus one detail shot of the surface.
4. **Studio photographs** — 6–8 frames: hands in clay, a raku firing, the reed and branch tools,
   pigment jars, a wall of works in progress. This is the entire Singulart layer.
5. **A 400-word statement in her own voice**, in French, first person. The ArtMajeur third-person
   text is a base; it needs to become *hers*.
6. **A 60–90 second video of a raku firing.** Nothing sells ceramic like opening a kiln.
7. **Confirmed price list** — current €, and which works are genuinely still available.
8. **Legal** — SIRET / artist status, mentions légales, CGV, GDPR text.

---

## 7. Phasing

| Phase | Scope | Status |
|---|---|---|
| **0** Research & catalogue | ArtMajeur scrape: 163 works, 162 HD images, CV, series | ✅ done |
| **1** Skeleton & design system | Astro scaffold, tokens, type, layout, nav, FR/EN routing | ✅ done |
| **2** Catalogue & artwork page | Index with filters, detail page, lightbox zoom, series pages | ✅ done |
| **3** Story | `/atelier` — bio, statement, process, CV (studio imagery pending §6.4) | ✅ done |
| **4** Sculpture treatment | Angle strip, room preview with scale silhouette | ✅ done |
| **5** Commerce | Enquiry flow, shipping & returns page, Stripe Payment Link slots | ✅ built — needs the links themselves (§6.7) |
| **6** Polish & launch | `VisualArtwork` + `Offer` + breadcrumb schema, per-work social cards, sitemap, icons, manifest, 404, perf, a11y audit | ✅ done |
| **7** Growth | Press page built, newsletter signup wired (hidden until the list exists); Instagram discipline and Google Arts profile remain | ◑ partly done |

---

## 8. Visibility beyond the site

The site is the asset; these are the pumps that fill it.

- **SEO** — per-work `VisualArtwork` JSON-LD, FR long-tail ("sculpture raku Côte d'Azur",
  "peintre figure humaine Biot"), Google Business Profile for the Biot studio.
- **Instagram** — one work per post, caption FR+EN, link to that work's own URL. Reels of firings.
- **Newsletter** — monthly, one work and one paragraph. Buttondown, free under 100 subscribers.
- **Local** — Biot/Valbonne/Antibes tourism listings, the Côte d'Azur gallery circuit, open-studio
  weekends, plus the Lions Club and Festival d'Art Seillans contacts she already has.
- **Press kit** — one PDF: portrait, six works, statement, CV, contact. Send to regional press
  (Nice-Matin already covered her in 2003).
- **Marketplaces stay** — ArtMajeur / Singulart / Saatchi as discovery funnels pointing home.

---

## 9. Success measures, six months after launch

- 1,000 sessions/month, median >60 s on artwork pages
- 15 qualified enquiries/month
- 2–4 sales/month across price bands
- 300 newsletter subscribers
- Page 1 in FR for her name and for "sculpture raku Biot"
