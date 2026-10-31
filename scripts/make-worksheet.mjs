/**
 * Builds the sheets Catherine fills in:
 *
 *   data/worksheet-titles.csv   one row per work needing a title, year or size
 *   data/worksheet.html         the same list with the photographs, to look at
 *
 * She fills the CSV (or tells you, and you fill it). Then:
 *   npm run catalogue   — reads data/titles.json back into the site
 *
 * Run: npm run worksheet
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const { works } = JSON.parse(await readFile(path.join(ROOT, 'src/data/works.json'), 'utf8'));

const needs = works.filter((w) => !w.titled || !w.year || !w.dimensions);

/* ------------------------------------------------------------------- CSV */

const esc = (v) => {
  const s = String(v ?? '');
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const header = [
  'id',
  'titre_actuel',
  'TITRE',
  'ANNEE',
  'HAUTEUR_cm',
  'LARGEUR_cm',
  'PROFONDEUR_cm',
  'technique_actuelle',
  'prix_actuel_EUR',
  'disponible',
  'NOTES',
];

const rows = needs.map((w) =>
  [
    w.id,
    w.title.fr,
    w.titled ? w.title.fr : '',
    w.year ?? '',
    w.dimensions?.h ?? '',
    w.dimensions?.w ?? '',
    '',
    w.medium.fr,
    w.price ?? '',
    { 'for-sale': 'oui', 'on-request': 'sur demande', sold: 'vendue' }[w.availability],
    '',
  ].map(esc)
);

/* Semicolons and a BOM: French Excel opens this correctly on a double-click. */
const csv = '﻿' + [header.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n') + '\r\n';
await writeFile(path.join(ROOT, 'data/worksheet-titles.csv'), csv, 'utf8');

/* ------------------------------------------------------------------ HTML */

const missing = (w) => {
  const m = [];
  if (!w.titled) m.push('titre');
  if (!w.year) m.push('année');
  if (!w.dimensions) m.push('dimensions');
  return m;
};

const cards = needs
  .map((w) => {
    const src = `../media/originals/${path.basename(w.image.file)}`;
    const facts = [
      w.medium.fr,
      w.dimensions ? `${w.dimensions.h} × ${w.dimensions.w} cm` : null,
      w.year,
      w.price ? `${w.price} €` : null,
    ]
      .filter(Boolean)
      .join(' · ');
    return `<figure>
  <img src="${src}" alt="" loading="lazy">
  <figcaption>
    <b>CM-${w.id}</b>
    <span class="cur">${w.titled ? w.title.fr : '<i>sans titre</i>'}</span>
    <span class="facts">${facts}</span>
    <span class="need">manque : ${missing(w).join(', ')}</span>
    <span class="write">Titre ............................................<br>Année ........ &nbsp; H ...... × L ...... × P ...... cm</span>
  </figcaption>
</figure>`;
  })
  .join('\n');

const html = `<!doctype html>
<html lang="fr">
<meta charset="utf-8">
<title>Catherine Monmarson — œuvres à renseigner</title>
<style>
  :root { --ink:#1a1a1a; --muted:#6b6560; --rule:#e4e0da; --paper:#faf9f7; }
  body { margin:0; background:var(--paper); color:var(--ink);
         font:15px/1.6 -apple-system,'Segoe UI',Roboto,sans-serif; }
  header { padding:2.5rem clamp(1rem,4vw,3rem) 1.5rem; border-bottom:1px solid var(--rule); }
  h1 { font:400 1.75rem/1.2 Georgia,serif; margin:0 0 .75rem; }
  p { margin:0; max-width:40rem; color:var(--muted); }
  .grid { display:grid; gap:2.5rem 1.5rem; padding:2rem clamp(1rem,4vw,3rem) 4rem;
          grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); }
  figure { margin:0; display:grid; gap:.6rem; break-inside:avoid; }
  img { width:100%; height:230px; object-fit:contain; object-position:bottom;
        background:#fff; border:1px solid var(--rule); }
  figcaption { display:grid; gap:.25rem; font-size:.8125rem; }
  b { font-family:ui-monospace,monospace; font-weight:500; font-size:.75rem; color:var(--muted); }
  .cur { font:400 1rem/1.3 Georgia,serif; }
  .facts { color:var(--muted); text-wrap:balance; }
  .need { color:#8a6a2f; font-size:.75rem; text-transform:uppercase; letter-spacing:.06em; }
  .write { margin-top:.4rem; color:#b9bdb4; font-size:.75rem; line-height:2; }
  @media print {
    body { background:#fff; }
    .grid { grid-template-columns:repeat(3,1fr); gap:1.25rem; }
    img { height:170px; }
    header { padding:1rem 0; }
  }
</style>
<header>
  <h1>Œuvres à renseigner — ${needs.length} sur ${works.length}</h1>
  <p>Pour chaque œuvre : son titre, son année, et ses dimensions en centimètres
     (hauteur × largeur, et la profondeur pour les sculptures). Le numéro CM- permet
     de la retrouver sans ambiguïté. À imprimer ou à remplir à l’écran.</p>
</header>
<div class="grid">
${cards}
</div>
</html>
`;
await writeFile(path.join(ROOT, 'data/worksheet.html'), html, 'utf8');

/* ---------------------------------------------------------------- report */

const titles = needs.filter((w) => !w.titled).length;
const years = needs.filter((w) => !w.year).length;
const dims = needs.filter((w) => !w.dimensions).length;

console.log();
console.log(`  data/worksheet-titles.csv   ${needs.length} rows`);
console.log(`  data/worksheet.html         the same list, with the photographs`);
console.log();
console.log(`  missing titles ${titles} · years ${years} · dimensions ${dims}`);
if (!existsSync(path.join(ROOT, 'data/titles.json'))) {
  console.log();
  console.log('  When she has filled it in, put the answers in data/titles.json');
  console.log('  as { "<id>": { "fr": "…", "en": "…", "year": "2004",');
  console.log('                 "h": 90, "w": 30, "d": 30 } } and run npm run catalogue.');
}
console.log();
