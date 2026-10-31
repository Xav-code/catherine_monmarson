/**
 * Turns the raw ArtMajeur harvest (data/artmajeur-catalogue.json) into the site's
 * content file (src/data/works.json) and copies the images Astro will optimise.
 *
 * Run: npm run catalogue
 */
import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_IMAGES = path.join(ROOT, 'media', 'originals');
const OUT_IMAGES = path.join(ROOT, 'src', 'assets', 'works');
const OUT_DATA = path.join(ROOT, 'src', 'data');

/* ---------------------------------------------------------------- helpers */

const FILENAME_TITLE =
  /^(p\d|dsc\d|snc\d|hpim\d|img[-_ ]?\d|\d+x\d+|copie|telephone)/i;

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

/** ArtMajeur titles carry typing shortcuts and missing accents. These are
 *  corrections to her own titles, not new names. Anything not listed keeps the
 *  source title with gentle capitalisation. TO CONFIRM with Cathy. */
const TITLE_FIX = {
  'non finito': { fr: 'Non finito', en: 'Non finito' },
  'en fete': { fr: 'En fête', en: 'En fête' },
  metamorphose: { fr: 'Métamorphose', en: 'Metamorphosis' },
  intimite: { fr: 'Intimité', en: 'Intimacy' },
  indigne: { fr: 'Indigné', en: 'Indignant' },
  tete2: { fr: 'Tête II', en: 'Head II' },
  'receptacle raku': { fr: 'Réceptacle, raku', en: 'Vessel, raku' },
  'en attente2024': { fr: 'En attente, 2024', en: 'Waiting, 2024' },
  'en attente 1': { fr: 'En attente I', en: 'Waiting I' },
  'en attente rose': { fr: 'En attente, rose', en: 'Waiting, pink' },
  'en attente o': { fr: 'En attente, O', en: 'Waiting, O' },
  'en attente cosmos 2': { fr: 'En attente — Cosmos II', en: 'Waiting — Cosmos II' },
  'cosmos 1': { fr: 'Cosmos I', en: 'Cosmos I' },
  'en bleu': { fr: 'En bleu', en: 'In blue' },
  pf1: { fr: 'Petit format I', en: 'Small format I' },
  litho2: { fr: 'Lithographie II', en: 'Lithograph II' },
  'nu nb3': { fr: 'Nu, noir et blanc III', en: 'Nude, black and white III' },
  'nu nb2': { fr: 'Nu, noir et blanc II', en: 'Nude, black and white II' },
  'nu nb': { fr: 'Nu, noir et blanc', en: 'Nude, black and white' },
  'nu j': { fr: 'Nu J', en: 'Nude J' },
  nb: { fr: 'Noir et blanc', en: 'Black and white' },
  'dessin nb': { fr: 'Dessin, noir et blanc', en: 'Drawing, black and white' },
  'dessin sur papier': { fr: 'Dessin sur papier', en: 'Drawing on paper' },
  'dessin sur papier nb3': {
    fr: 'Dessin sur papier, noir et blanc III',
    en: 'Drawing on paper, black and white III',
  },
  dessin: { fr: 'Dessin', en: 'Drawing' },
  noir2: { fr: 'Noir II', en: 'Black II' },
  'bleu 2': { fr: 'Bleu II', en: 'Blue II' },
  'vert lumiere': { fr: 'Vert lumière', en: 'Light green' },
  vigilence: { fr: 'Vigilance', en: 'Vigilance' },
  vigilance: { fr: 'Vigilance', en: 'Vigilance' },
  'de dos': { fr: 'De dos', en: 'From behind' },
  'dos 2': { fr: 'Dos II', en: 'Back II' },
  '5 couleurs': { fr: 'Cinq couleurs', en: 'Five colours' },
  'invite bleu': { fr: 'Invité bleu', en: 'Blue guest' },
  'invité bleu': { fr: 'Invité bleu', en: 'Blue guest' },
  'pieds sur terre': { fr: 'Pieds sur terre', en: 'Feet on the ground' },
  "chercher du pied nu l'empreinte sur le sable": {
    fr: 'Chercher du pied nu l’empreinte sur le sable',
    en: 'Barefoot, searching the sand for the print',
  },
  'hors champ': { fr: 'Hors champ', en: 'Out of frame' },
  tendresses: { fr: 'Tendresses', en: 'Tendernesses' },
  'cartons compresses': { fr: 'Cartons compressés', en: 'Compressed cardboard' },
  'la joue': { fr: 'La joue', en: 'The cheek' },
  foule: { fr: 'Foule', en: 'Crowd' },
  adieux: { fr: 'Adieux', en: 'Farewells' },
  rouge: { fr: 'Rouge', en: 'Red' },
  bleu: { fr: 'Bleu', en: 'Blue' },
  souffle: { fr: 'Souffle', en: 'Breath' },
  predelle: { fr: 'Predelle', en: 'Predella' },
  venise: { fr: 'Venise', en: 'Venice' },
  conciliabule: { fr: 'Conciliabule', en: 'Conclave' },
  miroir: { fr: 'Miroir', en: 'Mirror' },
  portrait: { fr: 'Portrait', en: 'Portrait' },
  chakras: { fr: 'Chakras', en: 'Chakras' },
  'entre trouble et attachement': {
    fr: 'Entre trouble et attachement',
    en: 'Between unease and attachment',
  },
  desequilibre: { fr: 'Déséquilibre', en: 'Off balance' },
  'déséquilibre': { fr: 'Déséquilibre', en: 'Off balance' },
  'petits formats 2': { fr: 'Petit format II', en: 'Small format II' },
  'grand receptacle ncm4': { fr: 'Grand réceptacle', en: 'Large vessel' },
  'petits receptacles': { fr: 'Petits réceptacles', en: 'Small vessels' },
  receptacle: { fr: 'Réceptacle', en: 'Vessel' },
  'plaque murale': { fr: 'Plaque murale', en: 'Wall plaque' },
  'terre patinee': { fr: 'Terre patinée', en: 'Patinated clay' },
  '3 sculptures': { fr: 'Trois sculptures', en: 'Three sculptures' },
  'passage ;;; sentier de la brague': {
    fr: 'Passage — sentier de la Brague',
    en: 'Passage — sentier de la Brague',
  },
  'detail grand receptacle': { fr: 'Grand réceptacle, détail', en: 'Large vessel, detail' },
  'ci mediart': { fr: 'CI Mediart', en: 'CI Mediart' },
  'dr pascal': { fr: 'Dr Pascal', en: 'Dr Pascal' },
  pita: { fr: 'Pita', en: 'Pita' },
  stand: { fr: 'Stand', en: 'Stand' },
};

const normaliseKey = (s) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/** ArtMajeur records size as two numbers without a reliable order. We settle
 *  the order from the photograph's own aspect ratio. */
function orientDimensions(sizeText, imgW, imgH) {
  const m = /(\d+)\s*x\s*(\d+)/.exec(sizeText || '');
  if (!m) return null;
  let a = Number(m[1]);
  let b = Number(m[2]);
  // 100x703 and similar are obvious data-entry slips: a trailing digit.
  if (b > 400 && String(b).length === 3) b = Number(String(b).slice(0, 2));
  if (a > 400 && String(a).length === 3) a = Number(String(a).slice(0, 2));
  if (a < 2 || b < 2) return null;
  const long = Math.max(a, b);
  const short = Math.min(a, b);
  const portrait = imgH >= imgW;
  return portrait ? { h: long, w: short } : { h: short, w: long };
}

const CM_PER_IN = 2.54;
const toInches = (cm) => Math.round((cm / CM_PER_IN) * 10) / 10;

/** Normalised medium strings, in French, from ArtMajeur's mixed FR/EN values. */
const MEDIUM_FR = {
  'Acrylic on Canvas': 'Acrylique sur toile',
  'Acrylic on Paper': 'Acrylique sur papier',
  'Acrylic on Cardboard': 'Acrylique sur carton',
  'Acrylique sur Carton': 'Acrylique sur carton',
  'Oil on Canvas': 'Huile sur toile',
  'Huile sur Papier': 'Huile sur papier',
  Oil: 'Huile',
  'Pigments on Canvas': 'Pigments sur toile',
  'Lithography on Paper': 'Lithographie sur papier',
  'Mixed Media': 'Technique mixte',
  'Sculpture - Clay': 'Terre, raku',
  Sculpture: 'Terre, raku',
  Painting: 'Technique mixte',
  Peinture: 'Technique mixte',
  Installation: 'Land art, in situ',
  Photography: 'Photographie',
};
const MEDIUM_EN = {
  'Acrylique sur toile': 'Acrylic on canvas',
  'Acrylique sur papier': 'Acrylic on paper',
  'Acrylique sur carton': 'Acrylic on cardboard',
  'Huile sur toile': 'Oil on canvas',
  'Huile sur papier': 'Oil on paper',
  Huile: 'Oil',
  'Pigments sur toile': 'Pigments on canvas',
  'Lithographie sur papier': 'Lithograph on paper',
  'Technique mixte': 'Mixed media',
  'Terre, raku': 'Raku-fired clay',
  'Land art, in situ': 'Land art, in situ',
  Photographie: 'Photograph',
};

/** Series the works belong to. ArtMajeur collection names, cleaned up. */
const SERIES = {
  'Sculptures raku': 'raku',
  'Céramiques raku': 'raku',
  'Terres patinées & enfumées': 'terres',
  'Land Art': 'land-art',
  Paravents: 'paravents',
  'Grands formats': 'grands-formats',
  'Petits formats': 'petits-formats',
  'Peintures acryliques': 'peintures',
};

function categoryOf(raw, medium) {
  const k = (raw.kind || '').toLowerCase();
  if (k.startsWith('sculpt')) return 'sculpture';
  if (k === 'installation') return 'land-art';
  if (k === 'photography') return 'photographie';
  if (/papier|paper|carton|cardboard|lithograph/i.test(medium)) return 'papier';
  return 'peinture';
}

/* ------------------------------------------------------------------- main */

const raw = JSON.parse(await readFile(path.join(ROOT, 'data', 'artmajeur-catalogue.json'), 'utf8'));

/* Catherine's own answers, keyed by work id, overriding anything harvested.
   See scripts/make-worksheet.mjs for how the questions are generated. */
let answers = {};
if (existsSync(path.join(ROOT, 'data', 'titles.json'))) {
  answers = JSON.parse(await readFile(path.join(ROOT, 'data', 'titles.json'), 'utf8'));
  delete answers._readme;
}

await mkdir(OUT_IMAGES, { recursive: true });
await mkdir(OUT_DATA, { recursive: true });

const existing = new Set(await readdir(SRC_IMAGES));

/* Additional views live beside the main photograph as <id>-2.jpg, <id>-3.jpg …
   in the order they should appear in the angle strip. Nothing has them yet
   (ROADMAP §6.3); the moment Cathy sends a three-quarter view, dropping the
   file in is the whole job. */
const extraViews = new Map();
for (const name of existing) {
  const m = /^(\d+)-(\d+)\.(jpe?g|png)$/i.exec(name);
  if (!m) continue;
  const list = extraViews.get(m[1]) || [];
  list.push({ order: Number(m[2]), name });
  extraViews.set(m[1], list);
}
for (const list of extraViews.values()) list.sort((a, b) => a.order - b.order);

async function describe(name) {
  const meta = await sharp(path.join(SRC_IMAGES, name)).metadata();
  if (!meta.width || meta.width < 300) return null;
  return {
    file: `works/${name}`,
    width: meta.width,
    height: meta.height,
    aspect: Math.round((meta.width / meta.height) * 1000) / 1000,
    // Extra views are angles and details; only the main photograph is ever
    // treated as a straight-on record of the work.
    matchesDimensions: false,
  };
}
const untitledCount = {};
const works = [];

for (const r of raw) {
  if (!r.file) continue;
  const base = path.basename(r.file);
  if (!existing.has(base)) continue;

  const file = path.join(SRC_IMAGES, base);
  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch {
    continue;
  }
  if (!meta.width || meta.width < 300) continue;

  const mediumFr = MEDIUM_FR[r.medium] || MEDIUM_FR[r.kind] || 'Technique mixte';
  const mediumEn = MEDIUM_EN[mediumFr] || 'Mixed media';
  const category = categoryOf(r, mediumFr);

  const answer = answers[r.id] || {};
  const named =
    Boolean(answer.fr) ||
    (r.title && !FILENAME_TITLE.test(r.title) && !/\.(jpg|jpeg|png)$/i.test(r.title));
  let titleFr;
  let titleEn;
  if (answer.fr) {
    titleFr = answer.fr;
    titleEn = answer.en || answer.fr;
  } else if (named) {
    const fix = TITLE_FIX[normaliseKey(r.title)];
    if (fix) {
      titleFr = fix.fr;
      titleEn = fix.en;
    } else {
      // ArtMajeur titles are shouted or lowercased inconsistently; normalise gently.
      const base =
        r.title.length > 3 && r.title === r.title.toUpperCase()
          ? r.title.charAt(0) + r.title.slice(1).toLowerCase()
          : r.title;
      titleFr = base.charAt(0).toUpperCase() + base.slice(1);
      titleEn = titleFr;
    }
  } else {
    untitledCount[category] = (untitledCount[category] || 0) + 1;
    titleFr = `Sans titre ${untitledCount[category]}`;
    titleEn = `Untitled ${untitledCount[category]}`;
  }

  const dims =
    answer.h && answer.w
      ? { h: Number(answer.h), w: Number(answer.w) }
      : orientDimensions(r.size, meta.width, meta.height);
  const price = r.price_eur ? Number(r.price_eur.replace(/[^\d]/g, '')) : null;
  const series = (r.collections || [])
    .map((c) => SERIES[c])
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);

  const availability = r.sold ? 'sold' : price ? 'for-sale' : 'on-request';

  /* Does the photograph frame the work itself, or the work in its
     surroundings? For a canvas shot square-on the two aspects agree; for a
     raku vessel standing in grass they do not, and the room preview must not
     pretend otherwise by stretching the photo into the work's footprint. */
  const photoAspect = meta.width / meta.height;
  const matchesDimensions = dims
    ? Math.abs(Math.log(photoAspect / (dims.w / dims.h))) < 0.08
    : false;

  const primary = {
    file: `works/${base}`,
    width: meta.width,
    height: meta.height,
    aspect: Math.round(photoAspect * 1000) / 1000,
    matchesDimensions,
  };
  const views = [primary];
  for (const v of extraViews.get(r.id) || []) {
    const d = await describe(v.name);
    if (d) views.push(d);
  }

  works.push({
    id: r.id,
    slug: `${slugify(titleFr)}-${r.id}`,
    title: { fr: titleFr, en: titleEn },
    titled: named,
    year: answer.year || r.year || null,
    category,
    medium: { fr: mediumFr, en: mediumEn },
    dimensions: dims
      ? {
          h: dims.h,
          w: dims.w,
          hIn: toInches(dims.h),
          wIn: toInches(dims.w),
          ...(answer.d ? { d: Number(answer.d), dIn: toInches(Number(answer.d)) } : {}),
        }
      : null,
    price,
    availability,
    series,
    image: primary,
    images: views,
    source: r.url || null,
  });

  for (const name of [base, ...(extraViews.get(r.id) || []).map((v) => v.name)]) {
    const dest = path.join(OUT_IMAGES, name);
    if (!existsSync(dest)) await copyFile(path.join(SRC_IMAGES, name), dest);
  }
}

/* Order: available & titled & recent first — the catalogue should open strong. */
const score = (w) => {
  let s = 0;
  if (w.availability === 'for-sale') s += 40;
  if (w.availability === 'on-request') s += 10;
  if (w.titled) s += 20;
  if (w.dimensions) s += 10;
  if (w.year) s += Math.min(12, Math.max(0, (Number(w.year) - 1990) / 3));
  if (w.image.width > 1200) s += 8;
  if (w.price) s += Math.min(10, w.price / 500);
  return s;
};
works.sort((a, b) => score(b) - score(a));

/* A small hand-curated spine for the homepage: the strongest named works
   across media, in a deliberate order. */
const FEATURED_IDS = [
  '14109713', // Non finito — pigments, 162x114
  '17136439', // Predelle
  '16920097', // Pita
  '14109776', // Venise
  '16752730', // Souffle
  '16057213', // Entre trouble et attachement
  '14109809', // Conciliabule
  '16057258', // Vigilance
];
const byId = new Map(works.map((w) => [w.id, w]));
const featured = FEATURED_IDS.map((id) => byId.get(id)).filter(Boolean);
for (const w of featured) w.featured = true;

const stats = {
  total: works.length,
  byCategory: works.reduce((a, w) => ((a[w.category] = (a[w.category] || 0) + 1), a), {}),
  forSale: works.filter((w) => w.availability === 'for-sale').length,
  priceMin: Math.min(...works.filter((w) => w.price).map((w) => w.price)),
  priceMax: Math.max(...works.filter((w) => w.price).map((w) => w.price)),
};

await writeFile(
  path.join(OUT_DATA, 'works.json'),
  JSON.stringify({ stats, featured: FEATURED_IDS, works }, null, 1),
  'utf8'
);

console.log(`works.json — ${works.length} works`);
console.table(stats.byCategory);
console.log(`for sale: ${stats.forSale}   €${stats.priceMin}–€${stats.priceMax}`);
console.log(`featured: ${featured.length}/${FEATURED_IDS.length}`);
const answered = Object.keys(answers).length;
if (answered) console.log(`answers applied from data/titles.json: ${answered}`);
