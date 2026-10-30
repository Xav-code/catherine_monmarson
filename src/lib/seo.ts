import { getImage } from 'astro:assets';
import { href, routes, type Lang } from '../i18n/ui';
import { artist } from '../data/content';
import { imageOf, formatDimensions, type Work } from './works';

/** Title, description, canonical URL and social image for one artwork. */
export async function workMeta(work: Work, lang: Lang, site: URL | undefined) {
  const dims = formatDimensions(work, lang);
  const title =
    lang === 'fr'
      ? `${work.title.fr} — ${work.medium.fr}${work.year ? `, ${work.year}` : ''}`
      : `${work.title.en} — ${work.medium.en}${work.year ? `, ${work.year}` : ''}`;

  const availability =
    work.availability === 'sold'
      ? lang === 'fr'
        ? 'Vendue.'
        : 'Sold.'
      : work.price
        ? lang === 'fr'
          ? `${work.price} €.`
          : `€${work.price}.`
        : lang === 'fr'
          ? 'Prix sur demande.'
          : 'Price on request.';

  const description =
    lang === 'fr'
      ? `${work.title.fr}, ${work.medium.fr.toLowerCase()}${dims ? `, ${dims.split(' · ')[0]}` : ''}, par Catherine Monmarson. Œuvre originale unique, signée, expédiée depuis Biot. ${availability}`
      : `${work.title.en}, ${work.medium.en.toLowerCase()}${dims ? `, ${dims.split(' · ')[0]}` : ''}, by Catherine Monmarson. Unique original work, signed, shipped from Biot, France. ${availability}`;

  const path = `${routes[lang].works}/${work.slug}`;
  const url = new URL(href(lang, path), site ?? 'https://catherinemonmarson.com').toString();

  let image: string | undefined;
  const source = imageOf(work);
  if (source) {
    const card = await getImage({ src: source, width: 1200, format: 'jpeg', quality: 82 });
    image = card.src;
  }

  return { title, description, url, image };
}

/** schema.org VisualArtwork + Offer, so search engines can show the price. */
export function workSchema(work: Work, lang: Lang, url: string, image?: string) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: work.title[lang],
    url,
    image,
    artform: work.category === 'sculpture' ? 'Sculpture' : 'Painting',
    artMedium: work.medium[lang],
    artworkSurface: work.medium[lang],
    creator: {
      '@type': 'Person',
      name: artist.name,
      birthDate: String(artist.born),
      nationality: 'FR',
      sameAs: [artist.artmajeur].filter(Boolean),
    },
    inLanguage: lang,
  };

  if (work.year) schema.dateCreated = work.year;

  if (work.dimensions) {
    schema.height = { '@type': 'Distance', name: `${work.dimensions.h} cm` };
    schema.width = { '@type': 'Distance', name: `${work.dimensions.w} cm` };
  }

  if (work.availability !== 'sold' && work.price) {
    schema.offers = {
      '@type': 'Offer',
      price: work.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url,
      seller: { '@type': 'Person', name: artist.name },
      eligibleQuantity: { '@type': 'QuantitativeValue', value: 1 },
    };
  } else if (work.availability === 'sold') {
    schema.offers = {
      '@type': 'Offer',
      availability: 'https://schema.org/SoldOut',
      priceCurrency: 'EUR',
      url,
    };
  }

  return schema;
}
