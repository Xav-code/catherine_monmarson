export const LANGS = ['fr', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'fr';

/** `/` for French, `/en/` for English. */
export const base = (lang: Lang) => (lang === DEFAULT_LANG ? '' : `/${lang}`);

/** Build an in-site href for a language. `path` always starts with `/`. */
export const href = (lang: Lang, path = '/') => {
  const p = path === '/' ? '' : path.replace(/\/$/, '');
  return `${base(lang)}${p}` || '/';
};

export const ui = {
  fr: {
    'site.name': 'Catherine Monmarson',
    'site.role': 'Peintre & sculptrice',
    'site.tagline': 'Peinture et sculpture — Biot, Côte d’Azur',
    'site.description':
      'Peintures et sculptures raku de Catherine Monmarson, artiste formée aux Beaux-Arts de Paris, installée à Biot. Œuvres originales à acquérir directement à l’atelier.',

    'nav.works': 'Œuvres',
    'nav.series': 'Séries',
    'nav.studio': 'L’atelier',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Fermer',
    'nav.skip': 'Aller au contenu',

    'home.intro':
      'Depuis cinquante ans, la figure humaine — non comme forme arrêtée, mais comme réceptacle d’émotions. Pigments, cire, œuf, acrylique sur toile ; terre enfumée au raku.',
    'home.door.paintings': 'Peintures',
    'home.door.paintings.note':
      'Acrylique, huile et pigments sur toile et sur papier. Du petit format au grand format.',
    'home.door.sculpture': 'Sculptures',
    'home.door.sculpture.note':
      'Terres patinées, enfumées, cuites au raku. Réceptacles, têtes, plaques murales.',
    'home.door.studio': 'L’atelier',
    'home.door.studio.note':
      'Le parcours, la matière, le geste. Visites sur rendez-vous à Biot.',
    'home.enter': 'Entrer',
    'home.selected': 'Œuvres choisies',
    'home.selected.note': 'Une sélection parmi {n} œuvres au catalogue.',
    'home.allWorks': 'Voir tout le catalogue',
    'home.series': 'Séries',
    'home.studioTitle': 'Rester en éveil',

    'works.title': 'Œuvres',
    'works.intro':
      '{n} œuvres, de 1991 à aujourd’hui. Chaque pièce est unique, signée, accompagnée d’un certificat d’authenticité.',
    'works.filter.medium': 'Médium',
    'works.filter.series': 'Série',
    'works.filter.size': 'Format',
    'works.filter.price': 'Prix',
    'works.filter.availability': 'Disponibilité',
    'works.filter.all': 'Tout',
    'works.count': '{n} œuvres',
    'works.countOne': '1 œuvre',
    'works.none': 'Aucune œuvre ne correspond à ces critères.',
    'works.reset': 'Réinitialiser',
    'works.sort': 'Trier',

    'cat.peinture': 'Peintures',
    'cat.papier': 'Œuvres sur papier',
    'cat.sculpture': 'Sculptures',
    'cat.land-art': 'Land art',
    'cat.photographie': 'Photographies',

    'size.small': 'Petit (≤ 50 cm)',
    'size.medium': 'Moyen (50–100 cm)',
    'size.large': 'Grand (100–140 cm)',
    'size.xl': 'Très grand (> 140 cm)',

    'price.under500': 'Moins de 500 €',
    'price.500to1500': '500 – 1 500 €',
    'price.1500to3000': '1 500 – 3 000 €',
    'price.over3000': 'Plus de 3 000 €',

    'avail.for-sale': 'Disponible',
    'avail.on-request': 'Prix sur demande',
    'avail.sold': 'Vendue',

    'work.untitled': 'Sans titre',
    'work.year': 'Année',
    'work.medium': 'Médium',
    'work.dimensions': 'Dimensions',
    'work.unique': 'Pièce unique',
    'work.uniqueNote': 'Œuvre originale, signée',
    'work.certificate': 'Certificat d’authenticité fourni',
    'work.reference': 'Référence',
    'work.buy': 'Acheter',
    'work.enquire': 'Acquérir cette œuvre',
    'work.enquireSold': 'Demander une œuvre proche',
    'work.askPrice': 'Demander le prix',
    'work.priceOnRequest': 'Prix sur demande',
    'work.soldNote':
      'Cette œuvre a trouvé son acquéreur. D’autres pièces de la même série sont disponibles.',
    'work.zoom': 'Agrandir',
    'work.zoomHint': 'Cliquer sur l’image pour l’agrandir',
    'work.angles': 'Autres vues',
    'work.room': 'À l’échelle',
    'work.roomNote': 'Mur de 3,20 m — silhouette de 1,75 m',
    'work.roomFootprint': 'Encombrement réel',
    'work.roomToggle': 'Silhouette',
    'work.related': 'De la même série',
    'work.alsoSee': 'À voir également',
    'work.back': 'Retour aux œuvres',
    'work.shipping': 'Expédition depuis Biot, France — assurée, emballage sur mesure.',
    'work.returns': 'Retour accepté sous 14 jours.',
    'work.payment': 'Paiement sécurisé. Paiement en trois fois possible au-delà de 1 500 €.',
    'work.visit': 'L’œuvre peut être vue à l’atelier, sur rendez-vous.',
    'work.dimsUnavailable': 'Dimensions sur demande',
    'work.prevView': 'Précédente',
    'work.nextView': 'Suivante',
    'work.prevWork': 'Œuvre précédente',
    'work.nextWork': 'Œuvre suivante',
    'work.shippingLink': 'Expédition et retours',

    'series.title': 'Séries',
    'series.intro':
      'Le travail se regroupe par matière et par geste plutôt que par chronologie. Voici les ensembles.',
    'series.works': '{n} œuvres',
    'series.see': 'Voir la série',

    'studio.title': 'L’atelier',
    'studio.cv': 'Parcours',
    'studio.solo': 'Expositions personnelles',
    'studio.group': 'Expositions collectives',
    'studio.collections': 'Collections',
    'studio.press': 'Presse',

    'contact.title': 'Contact',
    'contact.intro':
      'Pour acquérir une œuvre, organiser une visite d’atelier à Biot, ou pour toute question — écrivez-moi. Réponse sous 48 heures.',
    'contact.name': 'Nom',
    'contact.email': 'Courriel',
    'contact.subject': 'Objet',
    'contact.message': 'Message',
    'contact.about': 'Au sujet de',
    'contact.send': 'Envoyer',
    'contact.required': 'Champs obligatoires',
    'contact.studio': 'Atelier',
    'contact.studioNote': 'Visites sur rendez-vous',
    'contact.workshops': 'Ateliers d’arts plastiques',
    'contact.workshopsNote':
      'Catherine Monmarson anime des ateliers d’arts plastiques à Biot. Renseignements sur demande.',
    'contact.subject.acquire': 'Acquérir une œuvre',
    'contact.subject.visit': 'Visiter l’atelier',
    'contact.subject.commission': 'Commande',
    'contact.subject.workshop': 'Ateliers',
    'contact.subject.press': 'Presse',
    'contact.subject.other': 'Autre',

    'ship.title': 'Expédition & retours',
    'ship.intro':
      'Chaque œuvre part de l’atelier de Biot, emballée sur mesure et assurée pendant le transport. Voici comment cela se passe, précisément.',
    'ship.packing': 'Emballage',
    'ship.delays': 'Délais',
    'ship.rates': 'Tarifs',
    'ship.returns': 'Retours',
    'ship.pickup': 'Retrait à l’atelier',
    'ship.questions': 'Une question sur une œuvre en particulier ?',

    'press.title': 'Presse',
    'press.intro':
      'Éléments à disposition de la presse et des galeries. Pour un visuel en haute définition ou un entretien, écrivez-moi.',
    'press.facts': 'En bref',
    'press.bio': 'Notice biographique',
    'press.images': 'Visuels',
    'press.imagesNote':
      'Les visuels de cette page peuvent être reproduits dans un cadre rédactionnel, avec la mention « © Catherine Monmarson ». Pour les fichiers en haute définition, demandez-les par courriel.',
    'press.contact': 'Contact presse',

    'news.title': 'Lettre d’atelier',
    'news.note': 'Une fois par mois : une œuvre, un paragraphe. Rien d’autre.',
    'news.email': 'Votre courriel',
    'news.submit': 'S’inscrire',

    'thanks.title': 'Message envoyé',
    'thanks.note':
      'Merci. Votre message est arrivé — je vous réponds sous 48 heures, souvent plus vite.',
    'thanks.cta': 'Continuer à regarder',

    'foot.explore': 'Explorer',
    'foot.studio': 'Atelier',
    'foot.elsewhere': 'Ailleurs',
    'foot.legal': 'Mentions légales',
    'foot.rights': '© {y} Catherine Monmarson. Tous droits réservés.',
    'foot.credit': 'Images © Catherine Monmarson',

    'notfound.title': 'Page introuvable',
    'notfound.note': 'Cette page n’existe pas ou plus.',
    'notfound.cta': 'Voir les œuvres',

    'lang.fr': 'Français',
    'lang.en': 'English',
  },

  en: {
    'site.name': 'Catherine Monmarson',
    'site.role': 'Painter & sculptor',
    'site.tagline': 'Painting and sculpture — Biot, French Riviera',
    'site.description':
      'Paintings and raku sculpture by Catherine Monmarson, trained at the Beaux-Arts de Paris and based in Biot. Original works available directly from the studio.',

    'nav.works': 'Works',
    'nav.series': 'Series',
    'nav.studio': 'Studio',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Close',
    'nav.skip': 'Skip to content',

    'home.intro':
      'For fifty years, the human figure — not as fixed form but as a vessel for emotion. Pigment, wax, egg and acrylic on canvas; smoke-fired raku clay.',
    'home.door.paintings': 'Paintings',
    'home.door.paintings.note':
      'Acrylic, oil and raw pigment on canvas and paper. From the smallest format to the largest.',
    'home.door.sculpture': 'Sculpture',
    'home.door.sculpture.note':
      'Patinated and smoke-fired clay, raku. Vessels, heads, wall plaques.',
    'home.door.studio': 'The studio',
    'home.door.studio.note': 'The path, the material, the gesture. Visits by appointment in Biot.',
    'home.enter': 'Enter',
    'home.selected': 'Selected works',
    'home.selected.note': 'A selection from {n} catalogued works.',
    'home.allWorks': 'See the full catalogue',
    'home.series': 'Series',
    'home.studioTitle': 'Staying awake to the world',

    'works.title': 'Works',
    'works.intro':
      '{n} works, from 1991 to today. Every piece is unique, signed, and comes with a certificate of authenticity.',
    'works.filter.medium': 'Medium',
    'works.filter.series': 'Series',
    'works.filter.size': 'Size',
    'works.filter.price': 'Price',
    'works.filter.availability': 'Availability',
    'works.filter.all': 'All',
    'works.count': '{n} works',
    'works.countOne': '1 work',
    'works.none': 'No works match these filters.',
    'works.reset': 'Reset',
    'works.sort': 'Sort',

    'cat.peinture': 'Paintings',
    'cat.papier': 'Works on paper',
    'cat.sculpture': 'Sculpture',
    'cat.land-art': 'Land art',
    'cat.photographie': 'Photographs',

    'size.small': 'Small (≤ 50 cm)',
    'size.medium': 'Medium (50–100 cm)',
    'size.large': 'Large (100–140 cm)',
    'size.xl': 'Very large (over 140 cm)',

    'price.under500': 'Under €500',
    'price.500to1500': '€500 – 1,500',
    'price.1500to3000': '€1,500 – 3,000',
    'price.over3000': 'Over €3,000',

    'avail.for-sale': 'Available',
    'avail.on-request': 'Price on request',
    'avail.sold': 'Sold',

    'work.untitled': 'Untitled',
    'work.year': 'Year',
    'work.medium': 'Medium',
    'work.dimensions': 'Dimensions',
    'work.unique': 'Unique piece',
    'work.uniqueNote': 'Original work, signed',
    'work.certificate': 'Certificate of authenticity included',
    'work.reference': 'Reference',
    'work.buy': 'Buy now',
    'work.enquire': 'Acquire this work',
    'work.enquireSold': 'Ask about a similar work',
    'work.askPrice': 'Request the price',
    'work.priceOnRequest': 'Price on request',
    'work.soldNote':
      'This work has found its owner. Other pieces from the same series are available.',
    'work.zoom': 'Enlarge',
    'work.zoomHint': 'Click the image to enlarge',
    'work.angles': 'Other views',
    'work.room': 'To scale',
    'work.roomNote': '3.20 m wall — 1.75 m figure',
    'work.roomFootprint': 'Actual footprint',
    'work.roomToggle': 'Figure',
    'work.related': 'From the same series',
    'work.alsoSee': 'Also worth seeing',
    'work.back': 'Back to works',
    'work.shipping': 'Ships from Biot, France — insured, bespoke packing.',
    'work.returns': 'Returns accepted within 14 days.',
    'work.payment': 'Secure payment. Three instalments available above €1,500.',
    'work.visit': 'The work can be seen at the studio, by appointment.',
    'work.dimsUnavailable': 'Dimensions on request',
    'work.prevView': 'Previous',
    'work.nextView': 'Next',
    'work.prevWork': 'Previous work',
    'work.nextWork': 'Next work',
    'work.shippingLink': 'Shipping and returns',

    'series.title': 'Series',
    'series.intro':
      'The work groups itself by material and gesture rather than by date. These are the bodies of work.',
    'series.works': '{n} works',
    'series.see': 'See the series',

    'studio.title': 'The studio',
    'studio.cv': 'Path',
    'studio.solo': 'Solo exhibitions',
    'studio.group': 'Group exhibitions',
    'studio.collections': 'Collections',
    'studio.press': 'Press',

    'contact.title': 'Contact',
    'contact.intro':
      'To acquire a work, arrange a studio visit in Biot, or ask anything at all — write to me. I reply within 48 hours.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.about': 'Regarding',
    'contact.send': 'Send',
    'contact.required': 'Required fields',
    'contact.studio': 'Studio',
    'contact.studioNote': 'Visits by appointment',
    'contact.workshops': 'Visual arts workshops',
    'contact.workshopsNote':
      'Catherine Monmarson leads visual arts workshops in Biot. Details on request.',
    'contact.subject.acquire': 'Acquiring a work',
    'contact.subject.visit': 'Studio visit',
    'contact.subject.commission': 'Commission',
    'contact.subject.workshop': 'Workshops',
    'contact.subject.press': 'Press',
    'contact.subject.other': 'Other',

    'ship.title': 'Shipping & returns',
    'ship.intro':
      'Every work leaves the studio in Biot, packed to measure and insured in transit. Here is exactly how that works.',
    'ship.packing': 'Packing',
    'ship.delays': 'Delivery times',
    'ship.rates': 'Rates',
    'ship.returns': 'Returns',
    'ship.pickup': 'Collection from the studio',
    'ship.questions': 'A question about a particular work?',

    'press.title': 'Press',
    'press.intro':
      'Material for press and galleries. For a high-resolution image or an interview, write to me.',
    'press.facts': 'In brief',
    'press.bio': 'Biographical note',
    'press.images': 'Images',
    'press.imagesNote':
      'The images on this page may be reproduced editorially with the credit “© Catherine Monmarson”. For high-resolution files, ask by email.',
    'press.contact': 'Press contact',

    'news.title': 'Studio letter',
    'news.note': 'Once a month: one work, one paragraph. Nothing else.',
    'news.email': 'Your email',
    'news.submit': 'Subscribe',

    'thanks.title': 'Message sent',
    'thanks.note':
      'Thank you. Your message has arrived — I reply within 48 hours, usually sooner.',
    'thanks.cta': 'Keep looking',

    'foot.explore': 'Explore',
    'foot.studio': 'Studio',
    'foot.elsewhere': 'Elsewhere',
    'foot.legal': 'Legal',
    'foot.rights': '© {y} Catherine Monmarson. All rights reserved.',
    'foot.credit': 'Images © Catherine Monmarson',

    'notfound.title': 'Page not found',
    'notfound.note': 'This page does not exist, or no longer does.',
    'notfound.cta': 'See the works',

    'lang.fr': 'Français',
    'lang.en': 'English',
  },
} as const;

type Keys = keyof (typeof ui)['fr'];

export function useT(lang: Lang) {
  const dict = ui[lang] as Record<string, string>;
  return (key: Keys, vars?: Record<string, string | number>) => {
    let s = dict[key] ?? (ui.fr as Record<string, string>)[key] ?? String(key);
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** Routes, per language, so the nav and the language switch agree. */
export const routes = {
  fr: {
    works: '/oeuvres',
    series: '/series',
    studio: '/atelier',
    contact: '/contact',
    shipping: '/expedition',
    press: '/presse',
    thanks: '/merci',
    legal: '/mentions-legales',
  },
  en: {
    works: '/works',
    series: '/series',
    studio: '/studio',
    contact: '/contact',
    shipping: '/shipping',
    press: '/press',
    thanks: '/thank-you',
    legal: '/legal',
  },
} as const;

export const route = (lang: Lang, key: keyof (typeof routes)['fr']) =>
  href(lang, routes[lang][key]);
