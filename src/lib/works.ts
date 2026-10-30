import type { ImageMetadata } from 'astro';
import data from '../data/works.json';
import { series as seriesMeta } from '../data/content';
import type { Lang } from '../i18n/ui';

export type Category = 'peinture' | 'papier' | 'sculpture' | 'land-art' | 'photographie';
export type Availability = 'for-sale' | 'on-request' | 'sold';

export type WorkImage = {
  file: string;
  width: number;
  height: number;
  aspect: number;
  /** True when the photograph frames the work itself rather than the work in
   *  its surroundings — i.e. when it can honestly be shown at true size. */
  matchesDimensions: boolean;
};

export type Work = {
  id: string;
  slug: string;
  title: { fr: string; en: string };
  titled: boolean;
  year: string | null;
  category: Category;
  medium: { fr: string; en: string };
  dimensions: { h: number; w: number; hIn: number; wIn: number } | null;
  price: number | null;
  availability: Availability;
  series: string[];
  image: WorkImage;
  images: WorkImage[];
  source: string | null;
  featured?: boolean;
};

export const works = data.works as Work[];
export const stats = data.stats;

/* ----------------------------------------------------------------- images */

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/works/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  { eager: true }
);

/** The optimisable ImageMetadata for a work, or null if the file is missing. */
export function imageOf(work: Work): ImageMetadata | null {
  const entry = files[`/src/assets/${work.image.file}`];
  return entry ? entry.default : null;
}

/** Every view of a work, main photograph first. One entry for most works today. */
export function imagesOf(work: Work): ImageMetadata[] {
  return (work.images ?? [work.image])
    .map((v) => files[`/src/assets/${v.file}`]?.default)
    .filter((m): m is ImageMetadata => Boolean(m));
}

/* ------------------------------------------------------------------ lookup */

export const byId = new Map(works.map((w) => [w.id, w]));
export const bySlug = new Map(works.map((w) => [w.slug, w]));

export const featured = (data.featured as string[])
  .map((id) => byId.get(id))
  .filter((w): w is Work => Boolean(w));

export const forSale = works.filter((w) => w.availability === 'for-sale');

export const inSeries = (slug: string) => works.filter((w) => w.series.includes(slug));

export const seriesWithWorks = seriesMeta
  .map((s) => ({ ...s, works: inSeries(s.slug) }))
  .filter((s) => s.works.length > 0);

export const categories: Category[] = ['peinture', 'sculpture', 'papier', 'land-art'];

export const inCategory = (c: Category) => works.filter((w) => w.category === c);

/* --------------------------------------------------------------- formatting */

export const title = (w: Work, lang: Lang) => w.title[lang];

export function formatPrice(price: number, lang: Lang) {
  return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

/** "100 × 70 cm · 39,4 × 27,6 in" */
export function formatDimensions(w: Work, lang: Lang) {
  if (!w.dimensions) return null;
  const { h, w: width, hIn, wIn } = w.dimensions;
  const sep = lang === 'fr' ? ',' : '.';
  const inch = (n: number) => String(n).replace('.', sep);
  return `${h} × ${width} cm · ${inch(hIn)} × ${inch(wIn)} in`;
}

export function sizeBand(w: Work): 'small' | 'medium' | 'large' | 'xl' | null {
  if (!w.dimensions) return null;
  const long = Math.max(w.dimensions.h, w.dimensions.w);
  if (long <= 50) return 'small';
  if (long <= 100) return 'medium';
  if (long <= 140) return 'large';
  return 'xl';
}

export function priceBand(w: Work): 'under500' | '500to1500' | '1500to3000' | 'over3000' | null {
  if (!w.price) return null;
  if (w.price < 500) return 'under500';
  if (w.price < 1500) return '500to1500';
  if (w.price < 3000) return '1500to3000';
  return 'over3000';
}

/** Alt text built from what we actually know about the work. */
export function altText(w: Work, lang: Lang) {
  const kind =
    lang === 'fr'
      ? { peinture: 'Peinture', papier: 'Œuvre sur papier', sculpture: 'Sculpture', 'land-art': 'Installation de land art', photographie: 'Photographie' }
      : { peinture: 'Painting', papier: 'Work on paper', sculpture: 'Sculpture', 'land-art': 'Land art installation', photographie: 'Photograph' };
  const by = lang === 'fr' ? 'de Catherine Monmarson' : 'by Catherine Monmarson';
  const bits = [`${kind[w.category]} « ${w.title[lang]} »`, by, w.medium[lang].toLowerCase()];
  if (w.dimensions) bits.push(`${w.dimensions.h} × ${w.dimensions.w} cm`);
  if (w.year) bits.push(w.year);
  return bits.join(', ');
}

/** Works to show beneath an artwork: same series first, then same category. */
export function relatedTo(w: Work, n = 3): Work[] {
  const pool = new Map<string, Work>();
  for (const s of w.series) for (const o of inSeries(s)) if (o.id !== w.id) pool.set(o.id, o);
  if (pool.size < n) {
    for (const o of inCategory(w.category)) if (o.id !== w.id) pool.set(o.id, o);
  }
  const ranked = [...pool.values()].sort((a, b) => {
    const av = (x: Work) => (x.availability === 'for-sale' ? 0 : x.availability === 'on-request' ? 1 : 2);
    return av(a) - av(b) || Number(b.id) - Number(a.id);
  });
  return ranked.slice(0, n);
}

/** The work before and after this one in catalogue order, for arrow-key paging. */
export function neighbours(work: Work): { prev: Work | null; next: Work | null } {
  const i = works.findIndex((w) => w.id === work.id);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? works[i - 1] : null,
    next: i < works.length - 1 ? works[i + 1] : null,
  };
}

/** Sculpture is the one category where a second view genuinely exists today. */
export const isThreeDimensional = (w: Work) => w.category === 'sculpture' || w.category === 'land-art';
