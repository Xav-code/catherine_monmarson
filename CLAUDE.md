# CLAUDE.md

Project context for resuming work. Written to be read first, in one pass.
Named `CLAUDE.md` because Claude Code loads it automatically each session — it
serves equally as a human handover note.

See also: `README.md` (how to run it), `ROADMAP.md` (the plan and its reasoning),
`python scripts/make-report.py` (status report as .docx for Xavier).

---

## What this is

A bilingual website for **Catherine Monmarson** — painter and raku sculptor,
b. 1947 Orléans, Beaux-Arts de Paris, working in Biot on the Côte d'Azur. Built
for Xavier Faguer, a friend of hers, to raise her visibility and sell work.

Static Astro site, French at the root and English under `/en/`, 358 pages,
162 catalogued works. Hand-written CSS, no framework, no JS on most pages.

The design brief was deliberate and should be preserved: **Artsy's restraint**
(one large image per screen, neutral ground, no accent colour), **Singulart's
artist story**, **Saatchi's sculpture handling** (angles, scale, room previews).
If a change makes the page busier, it is probably wrong.

---

## Where things stand

| | |
|---|---|
| Repo | `github.com/Xav-code/catherine_monmarson`, branch `main`, clean |
| Live at | `catherinemonmarson.seailles.com` — DreamHost, uploaded by hand |
| Target | `catherinemonmarson.com` once Catherine wants her own name |
| Contact form | **Off.** Page shows her email instead — see *Turning the form on* |
| Blockers | SIRET, artist status, shipping rates, price review, mediator, form |

Run `npm run prelaunch` for the live list. It exits non-zero while a blocker
stands.

### Deployment history, so you don't repeat it

Netlify was the first choice and **its account was suspended twice** by
automated anti-abuse — a new account pushing 2,000 files via CLI. An appeal
restored it briefly, then it was suspended again. Do not retry Netlify unless
Xavier says the account is confirmed good. `netlify.toml` is kept so the option
stays open.

That is why the build is host-neutral: it runs unchanged on Netlify, Cloudflare
Pages, or Apache. Only the form differs between them.

---

## Commands

```bash
npm run dev         # localhost:4321, live reload
npm run build       # → dist/  (runs the form-handler generator first)
npm run catalogue   # regenerate src/data/works.json from the harvest
npm run prelaunch   # what is still outstanding before promoting the site
npm run worksheet   # sheets for Catherine to fill in
python scripts/make-report.py   # status .docx
```

`npm run build` is self-sufficient. `npm run catalogue` is only needed after
touching `data/artmajeur-catalogue.json`, `data/titles.json`, or the images.

---

## Map

```
data/
  to-confirm.json          ← EVERY unconfirmed value. One place to edit.
  artmajeur-catalogue.json   raw harvest, 163 records, source of truth
  titles.json                Catherine's answers; overrides the harvest (not yet created)
media/originals/           162 HD photographs, named <id>.jpg (<id>-2.jpg = second view)
scripts/
  build-catalogue.mjs      harvest → src/data/works.json
  build-form-handler.mjs   generates public/contact.php, .htaccess, robots.txt
  prelaunch-check.mjs      the blocker list
  make-worksheet.mjs       worksheet.html + CSV for Catherine
  make-report.py           the .docx status report
src/
  data/works.json          generated — never hand-edit
  data/content.ts          bio, statement, CV, series; reads to-confirm.json
  i18n/ui.ts               every string, both languages, plus the route table
  lib/works.ts             typed access, filtering, formatting, alt text
  lib/seo.ts               per-work meta + VisualArtwork/Offer JSON-LD
  components/views/        one view per page, shared across both languages
  pages/                   thin route files: FR at root, EN under /en/
  styles/global.css        the entire design system
```

`src/assets/works/` and `dist/` are **generated and gitignored**. `npm run
catalogue` recreates the first from `media/originals/`.

---

## Decisions worth not undoing

**No accent colour.** The paintings are the colour. One hairline rule, warm
paper ground. Resist adding brand colour.

**Prices and availability drive the buy route.** ≤ €800 with a Stripe link →
direct Buy; otherwise → enquiry form. At €1,500–4,800 fine art sells by
conversation, not by cart. `terms.buyNowBelow` in `to-confirm.json`.

**Empty means omit, never invent.** Every unconfirmed value degrades into honest
copy: no email → the legal page points at the contact form; no shipping rates →
"costed per work"; no mediator → "reply within fifteen days". Never fill these
with plausible placeholders — they are legal and commercial facts.

**`site.url` is the single source of truth** for canonical links, hreflang, the
sitemap, social cards, `robots.txt` and the generated PHP. Moving domains is a
one-line change. Keep it that way.

---

## Traps that have already bitten

**`img { height: auto }` in `global.css` must stay.** Astro writes real
`width`/`height` attributes, which act as CSS presentational hints and make the
height definite. Without the reset, `max-height` and `max-width` clamp each axis
independently and artwork is stretched — it was up to 50% before this was found.
Measure rendered vs natural aspect in the browser after any image CSS change.

**The room preview must not use `object-fit: fill`.** It was stretching
photographs into the work's true footprint — wrong by 55% for a raku vessel
photographed in grass. The builder records `image.matchesDimensions` (photo
aspect vs stated dimensions, within 8%); 62 works show the photo on the wall,
52 show a labelled footprint outline instead.

**ArtMajeur's dimension order is already height × width.** Verified across all
114 works with dimensions — the builder never reorders. Do not "fix" this.

**`dist/` is not in the repo.** A GitHub "Download ZIP" gives the ~240 source
files, not the website. The site is the ~2,008 files in `dist/`.

**Never zip `dist/` with PowerShell `Compress-Archive`** — it writes backslash
paths that Linux unzip flattens. Use Python's `zipfile`, which writes POSIX
paths.

**Inline scripts that query the page must wait for `DOMContentLoaded`.** The
catalogue filters run before the grid exists otherwise, and silently match zero
cards.

**Windows Python resolves `/tmp` to `C:\tmp`, not Git Bash's temp dir.** Use
relative paths inside `cd`-ed heredocs.

---

## Turning the contact form on

The only host-specific part. `to-confirm.json` → `forms.provider`:

- `"php"` — posts to `/contact.php`, generated at build time. For DreamHost.
- `"netlify"` / `"formspree"` / `"none"` — the other hosts, or no form at all.

Currently `"none"` because `forms.mailFrom` is empty. To enable:

1. Create an address **on the hosting domain** (DreamHost → Mail → Manage Email),
   e.g. `catherine@seailles.com`. It cannot be her Wanadoo address — shared hosts
   refuse mail claiming to come from a domain they do not host.
2. Set `forms.mailFrom` to it and `forms.provider` to `"php"`.
3. `npm run build`, re-upload.

`From:` the on-domain address, `To:` her Wanadoo inbox, `Reply-To:` the enquirer.
The handler validates, honeypots, caps length and strips CR/LF from anything
reaching a header — tested against a live PHP server, including a forged `Bcc`.

---

## Deploying

```bash
npm run build
rsync -az --delete dist/ USER@SERVER:~/catherinemonmarson.seailles.com/
```

Or zip `dist/` (Python `zipfile`) and extract in the subdomain folder, contents
at top level. Check `.htaccess` survived — file managers hide dotfiles.

Uploading by hand is the one manual step left. Cloudflare Pages would build on
push for free and has no account history to overcome; worth revisiting once the
content settles.

---

## What only Catherine can supply

Priority order. `npm run worksheet` generates the sheets for 1–4.

1. **Titles** — 55 works read *Sans titre*
2. **Years** — 88 missing
3. **Dimensions** — 48 missing; sculpture has H×W but no depth
4. **Second photographs** — none exist, so the angle strip never appears
5. **Studio photographs** — 6–8 frames; the whole Singulart layer is text-only
6. **A raku firing video** — the most persuasive asset for ceramics
7. **Confirmed prices** — the 45 came from ArtMajeur and may be stale
8. **Legal** — SIRET, artist-author status, mediator, shipping rates

Her answers go in `data/titles.json` keyed by work id:

```json
{ "260883": { "fr": "Grand réceptacle", "en": "Large vessel",
              "year": "2005", "h": 90, "w": 30, "d": 30 } }
```

---

## Facts

b. 1947 Orléans · Beaux-Arts de Paris · Châteauneuf-de-Grasse 1974 → Biot 2012 ·
3393 route de Valbonne, 06410 Biot · `cathy.monmarson@wanadoo.fr` ·
[instagram](https://www.instagram.com/catherinemonmarson) ·
[ArtMajeur](https://www.artmajeur.com/catherine-monmarson-9851162)

162 works: 121 paintings, 23 sculptures, 9 land art, 8 on paper, 1 photograph.
45 for sale, €209–€4,799. 69 sold. 8 series. 25 exhibitions 1993–2022.
