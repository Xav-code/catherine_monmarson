/**
 * Editorial content — biography, statement, CV, series.
 *
 * Sources: Catherine Monmarson's own ArtMajeur profile and statement, her
 * FirstContemporary page, and the Provence-Alpes-Côte d'Azur tourism listing.
 * Everything here is hers; nothing is invented. Items marked TO CONFIRM need a
 * pass from Cathy before launch (see ROADMAP §6).
 */

import toConfirm from '../../data/to-confirm.json';

/* Values Catherine still has to supply live in data/to-confirm.json, so there
   is one place to fill in and `npm run prelaunch` can tell you what is left.
   Empty means unknown: the site omits the detail rather than inventing it. */
const tc = toConfirm as {
  contact: { email: string; phone: string; addressPublic: string };
  social: { instagram: string; newsletter: string };
  legal: {
    siret: string;
    status: string;
    vatNumber: string;
    mediator: { name: string; url: string };
  };
  shipping: {
    france: { upTo100cm: number | null; over100cm: number | null };
    eu: { upTo100cm: number | null; over100cm: number | null };
    carrier: string;
  };
  terms: { buyNowBelow: number; instalmentsAbove: number; returnDays: number };
  forms: {
    provider: 'php' | 'netlify' | 'formspree' | 'none';
    endpoint: string;
    mailFrom: string;
  };
};

export const confirmed = tc;

export const artist = {
  name: 'Catherine Monmarson',
  born: 1947,
  bornPlace: { fr: 'Orléans, France', en: 'Orléans, France' },
  city: 'Biot',
  region: { fr: 'Alpes-Maritimes, Côte d’Azur', en: 'Alpes-Maritimes, French Riviera' },
  address: tc.contact.addressPublic,
  country: 'FR',
  email: tc.contact.email,
  phone: tc.contact.phone,
  artmajeur: 'https://www.artmajeur.com/catherine-monmarson-9851162',
  instagram: tc.social.instagram,
  newsletter: tc.social.newsletter,
};

/** Her own words. Kept verbatim — these are the spine of the studio page. */
export const quotes = [
  {
    fr: 'C’est en dessinant, en sculptant, en peignant que je prends conscience du monde qui m’entoure. C’est le plus sûr moyen, pour moi, de rester en éveil.',
    en: 'It is by drawing, by sculpting, by painting that I become aware of the world around me. It is the surest way, for me, to stay awake.',
  },
  {
    fr: 'L’œil du peintre est celui qui s’étonne, qui s’émerveille, qui s’interroge.',
    en: 'The painter’s eye is the one that is startled, that marvels, that asks.',
  },
  {
    fr: 'Le geste du peintre est le conducteur d’une musique subtile.',
    en: 'The painter’s gesture conducts a subtle music.',
  },
  {
    fr: 'La mémoire du corps est le reflet de la mémoire de l’esprit.',
    en: 'The memory of the body is the reflection of the memory of the mind.',
  },
];

export const statement = {
  fr: [
    'Catherine Monmarson déploie une pratique artistique où la peinture et la sculpture dialoguent autour d’une quête d’intériorité. Formée aux Beaux-Arts de Paris, elle explore depuis plusieurs décennies la figure humaine, non comme une forme anatomique figée, mais comme le réceptacle d’émotions et de sensations.',
    'Son travail, installé dans le sud de la France, oscille entre une figuration suggestive et une abstraction habitée par l’énergie vitale. Elle se détache de la forme extérieure du modèle pour s’attacher à ce qu’il renvoie, cherchant à capter le souffle et le mouvement profond des êtres.',
    'L’artiste utilise une grande diversité de matières — pigments, huiles, acryliques ou terre enfumée par la technique du raku — pour traduire le lien entre l’individu et l’immensité du cosmos. Ses compositions deviennent ainsi des espaces de rencontre où l’énergie universelle s’offre au regardeur, l’invitant à une expérience sensible partagée.',
  ],
  en: [
    'Catherine Monmarson’s practice sets painting and sculpture in conversation around a search for inwardness. Trained at the Beaux-Arts de Paris, she has spent decades on the human figure — not as fixed anatomy, but as a vessel for emotion and sensation.',
    'Her work, made in the south of France, moves between suggestive figuration and an abstraction inhabited by vital energy. She lets go of the model’s outward form to hold on to what it gives back, trying to catch the breath and the deep movement of a living being.',
    'She works with a wide range of materials — pigment, oil, acrylic, or clay smoked by the raku technique — to translate the link between an individual and the immensity of the cosmos. Her compositions become meeting places where universal energy is offered to the viewer, an invitation to a shared sensory experience.',
  ],
};

export const process = {
  fr: {
    title: 'Deux temps',
    body: [
      'Le travail se fait en deux temps. Le premier, un geste spontané qui prend possession de l’espace. Puis un effort plus lent, qui équilibre, construit et donne corps à cette énergie.',
      'Les outils sont volontairement pauvres : roseaux, branches, éponges. Les matières, elles, sont riches — pigments broyés, cire, œuf, parfois des noyaux de pêche réduits en poudre. Sur toile, sur papier, sur carton.',
      'Pour la terre, c’est le raku : la pièce est sortie du four portée au rouge, puis enfumée. Le choc thermique craquelle l’émail, la fumée s’infiltre dans les fissures et laisse des noirs profonds que l’on ne décide pas entièrement. Chaque cuisson est un pari.',
    ],
  },
  en: {
    title: 'Two movements',
    body: [
      'The work happens in two movements. First, a spontaneous gesture taking possession of the space. Then a slower effort, which balances, builds and gives body to that energy.',
      'The tools are deliberately poor: reeds, branches, sponges. The materials are rich — ground pigment, wax, egg, sometimes peach stones milled to powder. On canvas, on paper, on cardboard.',
      'For clay, it is raku: the piece comes out of the kiln red-hot and is then smoked. Thermal shock crazes the glaze, smoke works into the cracks and leaves deep blacks that are never entirely decided by the maker. Every firing is a wager.',
    ],
  },
};

export const biography = {
  fr: [
    'Née en 1947 à Orléans. Formation aux Beaux-Arts de Paris.',
    'Installée dans le sud de la France depuis 1974 — d’abord à Châteauneuf-de-Grasse, puis à Biot depuis 2012, où elle travaille et anime des ateliers d’arts plastiques.',
    'Elle expose principalement en France et en Belgique depuis le début des années 1990.',
  ],
  en: [
    'Born 1947 in Orléans. Trained at the Beaux-Arts de Paris.',
    'Based in the south of France since 1974 — first in Châteauneuf-de-Grasse, then in Biot since 2012, where she works and leads visual arts workshops.',
    'She has exhibited mainly in France and Belgium since the early 1990s.',
  ],
};

export type CvEntry = { year: string; fr: string; en: string };

export const soloShows: CvEntry[] = [
  { year: '2015', fr: 'Galerie Mediart, Paris', en: 'Galerie Mediart, Paris' },
  { year: '2014', fr: 'Galerie Les Robinsonnes, Antibes', en: 'Galerie Les Robinsonnes, Antibes' },
  { year: '2013', fr: 'Galerie Le Hangart, Draguignan', en: 'Galerie Le Hangart, Draguignan' },
  { year: '2013', fr: 'Galerie ABC, Bruxelles', en: 'Galerie ABC, Brussels' },
  { year: '2012', fr: 'La Galerie sans nom, Bruxelles', en: 'La Galerie sans nom, Brussels' },
  { year: '2012', fr: 'Jas de la Rimade, Var', en: 'Jas de la Rimade, Var' },
  {
    year: '2011',
    fr: 'Terrasse des Arts, Châteauneuf-de-Grasse — rétrospective de vingt ans',
    en: 'Terrasse des Arts, Châteauneuf-de-Grasse — twenty-year retrospective',
  },
  { year: '2011', fr: 'Galerie Artfusion, Troyes', en: 'Galerie Artfusion, Troyes' },
  { year: '2011', fr: 'Galerie Les Robinsonnes, Antibes', en: 'Galerie Les Robinsonnes, Antibes' },
  { year: '2008', fr: 'Galerie Artgument', en: 'Galerie Artgument' },
  { year: '2007', fr: 'Galerie Mediart, Paris', en: 'Galerie Mediart, Paris' },
  { year: '2005', fr: 'Chapelle Saint-Esprit, Valbonne', en: 'Chapelle Saint-Esprit, Valbonne' },
  { year: '2004', fr: 'Galerie Mediart, Paris', en: 'Galerie Mediart, Paris' },
  { year: '2003', fr: 'Galerie Mediart, Paris', en: 'Galerie Mediart, Paris' },
  { year: '2001', fr: 'Musée de la Vallée, Barcelonnette', en: 'Musée de la Vallée, Barcelonnette' },
  { year: '2000', fr: 'Galerie Mediart, Paris', en: 'Galerie Mediart, Paris' },
];

export const groupShows: CvEntry[] = [
  { year: '2022', fr: 'Festival d’Art de Seillans', en: 'Seillans Art Festival' },
  { year: '2014', fr: 'Galerie Munken, Løkken, Danemark', en: 'Galerie Munken, Løkken, Denmark' },
  {
    year: '2006',
    fr: 'Land art, sentier de la Brague, Valbonne',
    en: 'Land art, sentier de la Brague, Valbonne',
  },
  {
    year: '2006',
    fr: 'UPAC Grasse, salon d’art contemporain',
    en: 'UPAC Grasse, contemporary art fair',
  },
  { year: '2006', fr: 'Galerie Vision Future, Nice', en: 'Galerie Vision Future, Nice' },
  { year: '2005', fr: 'Vœux d’Artistes, Lyon et Toulouse', en: 'Vœux d’Artistes, Lyon and Toulouse' },
  { year: '2002', fr: 'La Fenice et des Artistes, Venise', en: 'La Fenice et des Artistes, Venice' },
  {
    year: '2001',
    fr: 'Festival d’Art Contemporain, Paris et Marseille',
    en: 'Festival d’Art Contemporain, Paris and Marseille',
  },
  { year: '1993', fr: 'Salon des Réalités Nouvelles, Paris', en: 'Salon des Réalités Nouvelles, Paris' },
];

export const collections = [
  { fr: 'Artothèque Lartisse, Valbonne', en: 'Artothèque Lartisse, Valbonne' },
  { fr: 'Galerie Les Robinsonnes, Antibes', en: 'Galerie Les Robinsonnes, Antibes' },
  { fr: 'Blue Dog Litho Gallery, Bargemon', en: 'Blue Dog Litho Gallery, Bargemon' },
  { fr: 'Collections privées — France, Belgique, Danemark', en: 'Private collections — France, Belgium, Denmark' },
];

export const press = [
  {
    year: '2003',
    source: 'Nice-Matin',
    fr: '« Le résultat est magnifique… travaillant autour du corps humain comme image spirituelle. »',
    en: '“The result is magnificent… working around the human body as a spiritual image.”',
  },
];

/** Series, in the order they should be presented. Slugs match works.json. */
export const series = [
  {
    slug: 'raku',
    fr: { name: 'Raku', note: 'Terres cuites au raku : réceptacles, têtes, plaques murales. Le four ouvert à chaud, la fumée dans les craquelures.' },
    en: { name: 'Raku', note: 'Raku-fired clay: vessels, heads, wall plaques. The kiln opened hot, smoke driven into the crazing.' },
  },
  {
    slug: 'terres',
    fr: { name: 'Terres patinées & enfumées', note: 'Avant l’émail, la peau de la terre. Patines et enfumages, surfaces sourdes et minérales.' },
    en: { name: 'Patinated & smoked clay', note: 'Before glaze, the skin of the clay. Patinas and smoke, muted mineral surfaces.' },
  },
  {
    slug: 'grands-formats',
    fr: { name: 'Grands formats', note: 'Toiles de 130 à 165 cm. La figure prise à l’échelle du corps du regardeur.' },
    en: { name: 'Large formats', note: 'Canvases from 130 to 165 cm. The figure taken at the scale of the viewer’s own body.' },
  },
  {
    slug: 'peintures',
    fr: { name: 'Peintures acryliques', note: 'Acrylique sur toile, le cœur du travail de peinture.' },
    en: { name: 'Acrylic paintings', note: 'Acrylic on canvas — the core of the painting practice.' },
  },
  {
    slug: 'petits-formats',
    fr: { name: 'Petits formats', note: 'Vingt, trente centimètres. Des notes rapides, un premier geste gardé intact.' },
    en: { name: 'Small formats', note: 'Twenty, thirty centimetres. Quick notes, a first gesture kept intact.' },
  },
  {
    slug: 'land-art',
    fr: { name: 'Land art', note: 'Interventions in situ — sentier de la Brague, Valbonne. L’œuvre rendue au paysage.' },
    en: { name: 'Land art', note: 'In-situ interventions — sentier de la Brague, Valbonne. The work given back to the landscape.' },
  },
  {
    slug: 'paravents',
    fr: { name: 'Paravents', note: 'La peinture qui se plie, se déplace, partage la pièce.' },
    en: { name: 'Folding screens', note: 'Painting that folds, moves, and divides a room.' },
  },
];

/** Sale terms, shown on every artwork page. Edit data/to-confirm.json. */
export const terms = {
  instalmentsAbove: tc.terms.instalmentsAbove,
  buyNowBelow: tc.terms.buyNowBelow,
  returnDays: tc.terms.returnDays,
};
