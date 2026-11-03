/**
 * Deletes build assets nothing references.
 *
 * Astro copies one untouched original per image into dist/_astro alongside the
 * optimised variants. Nothing links to them — 162 files, 35 MB — and on a host
 * uploaded by hand that is a third of the transfer for no benefit.
 *
 * Runs as part of `npm run build`, after astro.
 */
import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ASSETS = path.join(DIST, '_astro');

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const referenced = new Set();
for await (const f of walk(DIST)) {
  if (!/\.(html|css|xml|webmanifest|js)$/i.test(f)) continue;
  const text = await readFile(f, 'utf8');
  for (const m of text.matchAll(/\/_astro\/([^"')\s>]+)/g)) referenced.add(m[1]);
}

let freed = 0;
let removed = 0;
for (const name of await readdir(ASSETS)) {
  if (referenced.has(name)) continue;
  freed += (await stat(path.join(ASSETS, name))).size;
  await unlink(path.join(ASSETS, name));
  removed++;
}

console.log(
  removed
    ? `prune: removed ${removed} unreferenced asset(s), ${(freed / 1048576).toFixed(0)} MB`
    : 'prune: nothing unreferenced'
);
