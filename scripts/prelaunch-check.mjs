/**
 * Tells you what the site still needs before it can be public, and refuses to
 * pass while a launch blocker is outstanding.
 *
 * Run: npm run prelaunch
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const read = async (p) => JSON.parse(await readFile(path.join(ROOT, p), 'utf8'));

const tc = await read('data/to-confirm.json');
const { works } = await read('src/data/works.json');

const blockers = [];
const warnings = [];
const done = [];

const check = (ok, label, detail, blocking = true) => {
  if (ok) done.push(label);
  else (blocking ? blockers : warnings).push({ label, detail });
};

/* --- the things that would embarrass her if published as they stand ------ */

check(
  /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(tc.contact.email || ''),
  'Contact email',
  'data/to-confirm.json → contact.email. Until set, the legal and press pages simply omit it and point people at the contact form.'
);

check(
  /^\d{14}$/.test((tc.legal.siret || '').replace(/\s/g, '')),
  'SIRET',
  'data/to-confirm.json → legal.siret. Required on a French site that sells.'
);

check(
  Boolean(tc.legal.status),
  'Artist-author status',
  'data/to-confirm.json → legal.status, e.g. "Artiste-auteur, Maison des Artistes".'
);

check(
  Boolean(tc.shipping.france.upTo100cm && tc.shipping.eu.upTo100cm),
  'Shipping rates',
  'data/to-confirm.json → shipping. Until set, the page says shipping is costed per work rather than quoting a figure.'
);

check(
  tc.prices.confirmed === true,
  'Prices reviewed',
  `data/to-confirm.json → prices.confirmed. ${works.filter((w) => w.price).length} prices came from ArtMajeur and may be stale.`
);

check(
  tc.forms.provider === 'netlify' ||
    (tc.forms.provider === 'formspree' && /^https:\/\/formspree\.io\/f\//.test(tc.forms.endpoint)),
  'Enquiry form',
  "data/to-confirm.json → forms. With provider 'none' the contact page shows her email instead of a form — honest, but a form converts better. On Cloudflare, set provider to 'formspree' and paste a free form endpoint."
);

check(
  Boolean(tc.legal.mediator.name),
  'Consumer mediator',
  'data/to-confirm.json → legal.mediator. Mandatory for French distance selling once anything can be bought online.'
);

/* --- quality, not legality: worth fixing but will not stop a launch ------ */

const untitled = works.filter((w) => !w.titled);
check(
  untitled.length === 0,
  'Every work titled',
  `${untitled.length} works still read "Sans titre". Run: npm run worksheet`,
  false
);

const noDims = works.filter((w) => !w.dimensions);
check(
  noDims.length === 0,
  'Every work dimensioned',
  `${noDims.length} works have no dimensions, so they get no room preview.`,
  false
);

const noYear = works.filter((w) => !w.year);
check(noYear.length === 0, 'Every work dated', `${noYear.length} works have no year.`, false);

const multiView = works.filter((w) => (w.images?.length ?? 1) > 1);
check(
  multiView.length > 0,
  'Second views',
  'No work has a second photograph yet, so the angle strip never appears. Sculpture needs it most.',
  false
);

check(Boolean(tc.social.instagram), 'Instagram', 'Link hidden until set.', false);
check(Boolean(tc.social.newsletter), 'Newsletter list', 'Signup hidden until set.', false);

/* ------------------------------------------------------------------ report */

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.log();
console.log(bold('  Pre-launch check'));
console.log();

if (done.length) {
  console.log(green(`  ✓ ${done.length} ready`) + dim(`  — ${done.join(', ')}`));
  console.log();
}

for (const w of warnings) {
  console.log(yellow(`  ! ${w.label}`));
  console.log(dim(`    ${w.detail}`));
}
if (warnings.length) console.log();

for (const b of blockers) {
  console.log(red(`  ✗ ${b.label}`));
  console.log(dim(`    ${b.detail}`));
}

console.log();
if (blockers.length === 0) {
  console.log(green(bold('  Ready to publish.')));
  console.log();
  process.exit(0);
}
console.log(
  red(bold(`  ${blockers.length} launch blocker${blockers.length === 1 ? '' : 's'}.`)) +
    dim('  Deploying is fine — sending people the link is not, yet.')
);
console.log();
process.exit(1);
