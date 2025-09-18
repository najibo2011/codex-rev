import type { BlogSummary, BundleSummary, ProductDetail, ProductSummary } from './types';

export const categories = ['Santé', 'Autonomie', 'Mémoire', 'Loisirs'] as const;

type Category = (typeof categories)[number];

const baseCover = (slug: string) => `/images/covers/${slug}.svg`;
const basePdf = (slug: string) => `ebooks/${slug}.pdf`;

export const products: ProductDetail[] = [
  {
    id: 'ebook-bien-dormir',
    slug: 'bien-dormir-apres-60-ans',
    title: 'Bien dormir après 60 ans',
    description: 'Rituels simples pour retrouver un sommeil réparateur et des nuits sereines.',
    price: 1900,
    category: 'Santé',
    coverUrl: baseCover('bien-dormir-apres-60-ans'),
    pdfKey: basePdf('bien-dormir-apres-60-ans'),
    bullets: [
      'Comprendre les cycles du sommeil',
      'Plantes et tisanes apaisantes',
      'Agenda du sommeil imprimable',
    ],
    rating: 4.7,
    tableOfContents: [
      'Identifier les causes du sommeil léger',
      'Créer une routine apaisante',
      'Adapter sa chambre',
      'Nutrition et micronutrition',
      'Relaxations guidées',
    ],
    images: ['/images/covers/bien-dormir-apres-60-ans.svg'],
    reviews: [
      {
        id: 'rev-1',
        author: 'Françoise',
        rating: 5,
        comment: 'Depuis que j’applique les conseils, je me réveille reposée !',
      },
    ],
    isNew: true,
  },
  {
    id: 'ebook-coeur',
    slug: 'prendre-soin-de-son-coeur',
    title: 'Prendre soin de son cœur',
    description: 'Prévenir les risques cardiovasculaires avec une hygiène de vie adaptée.',
    price: 2100,
    category: 'Santé',
    coverUrl: baseCover('prendre-soin-de-son-coeur'),
    pdfKey: basePdf('prendre-soin-de-son-coeur'),
    bullets: ['Comprendre ses examens', 'Menus protecteurs', 'Programme de marche active'],
    rating: 4.8,
    tableOfContents: [
      'Le cœur après 60 ans',
      'Adapter son alimentation',
      'Bouger sans se blesser',
      'Suivi médical',
      'Témoignages inspirants',
    ],
    images: ['/images/covers/prendre-soin-de-son-coeur.svg'],
    reviews: [
      { id: 'rev-2', author: 'Jean-Paul', rating: 5, comment: 'Clair, rassurant et motivant.' },
    ],
  },
  {
    id: 'ebook-immunite',
    slug: 'immunite-vitaminee',
    title: 'Immunité vitaminée',
    description: 'Boostez vos défenses naturelles grâce à une alimentation colorée.',
    price: 1800,
    category: 'Santé',
    coverUrl: baseCover('immunite-vitaminee'),
    pdfKey: basePdf('immunite-vitaminee'),
    bullets: ['Panier de saison', 'Recettes rapides', 'Focus compléments'],
    rating: 4.6,
    tableOfContents: [
      'Comprendre l’immunité',
      'Vitamines et minéraux clés',
      'Menus anti-fatigue',
      'Gestion du stress',
      'Checklist hiver',
    ],
    images: ['/images/covers/immunite-vitaminee.svg'],
    reviews: [],
  },
  {
    id: 'ebook-equilibre',
    slug: 'equilibre-et-prevention-des-chutes',
    title: 'Équilibre et prévention des chutes',
    description: 'Des exercices illustrés pour renforcer son équilibre au quotidien.',
    price: 1600,
    category: 'Autonomie',
    coverUrl: baseCover('equilibre-et-prevention-des-chutes'),
    pdfKey: basePdf('equilibre-et-prevention-des-chutes'),
    bullets: ['Programme progressif', 'Mobilité douce', 'Sécuriser son logement'],
    rating: 4.9,
    tableOfContents: [
      'Évaluer son équilibre',
      'Exercices debout et assis',
      'Aménagements à la maison',
      'Sécurité à l’extérieur',
      'Plan de progression',
    ],
    images: ['/images/covers/equilibre-et-prevention-des-chutes.svg'],
    reviews: [
      { id: 'rev-3', author: 'Lucienne', rating: 5, comment: 'Les schémas sont très clairs et rassurants.' },
    ],
  },
  {
    id: 'ebook-memoire',
    slug: 'entretenir-sa-memoire',
    title: 'Entretenir sa mémoire',
    description: 'Jeux, défis et méthodes douces pour muscler ses neurones.',
    price: 1700,
    category: 'Mémoire',
    coverUrl: baseCover('entretenir-sa-memoire'),
    pdfKey: basePdf('entretenir-sa-memoire'),
    bullets: ['Programme sur 6 semaines', 'Techniques de mémorisation', 'Suivi imprimable'],
    rating: 4.5,
    tableOfContents: [
      'Comprendre la mémoire',
      'Hygiène de vie',
      'Jeux cérébraux',
      'Techniques mnémotechniques',
      'Stimuler chaque jour',
    ],
    images: ['/images/covers/entretenir-sa-memoire.svg'],
    reviews: [],
  },
  {
    id: 'ebook-organisation',
    slug: 'maison-bien-organisee',
    title: 'Maison bien organisée',
    description: 'Méthodes pour simplifier son quotidien et gagner en autonomie.',
    price: 1500,
    category: 'Autonomie',
    coverUrl: baseCover('maison-bien-organisee'),
    pdfKey: basePdf('maison-bien-organisee'),
    bullets: ['Check-lists ménage', 'Gestion administrative', 'Astuces rangement'],
    rating: 4.4,
    tableOfContents: [
      'Alléger son intérieur',
      'Routine hebdomadaire',
      'Organisation des papiers',
      'Numérique facile',
      'Plan d’action 30 jours',
    ],
    images: ['/images/covers/maison-bien-organisee.svg'],
    reviews: [],
  },
  {
    id: 'ebook-yoga',
    slug: 'yoga-doux-senior',
    title: 'Yoga doux au quotidien',
    description: 'Séances guidées pas à pas pour gagner en souplesse et sérénité.',
    price: 2200,
    category: 'Loisirs',
    coverUrl: baseCover('yoga-doux-senior'),
    pdfKey: basePdf('yoga-doux-senior'),
    bullets: ['12 séances filmées', 'Respirations calmantes', 'Postures sécurisées'],
    rating: 4.9,
    tableOfContents: [
      'Installer son espace',
      'Échauffements doux',
      'Séances thématiques',
      'Relaxation finale',
      'Suivi des progrès',
    ],
    images: ['/images/covers/yoga-doux-senior.svg'],
    reviews: [
      { id: 'rev-4', author: 'Patrick', rating: 5, comment: 'Je pratique chaque matin avec plaisir.' },
    ],
  },
  {
    id: 'ebook-atelier-artistique',
    slug: 'atelier-aquarelle-apaisante',
    title: 'Atelier aquarelle apaisante',
    description: 'Pas-à-pas illustrés pour découvrir la peinture à l’eau en douceur.',
    price: 1400,
    category: 'Loisirs',
    coverUrl: baseCover('atelier-aquarelle-apaisante'),
    pdfKey: basePdf('atelier-aquarelle-apaisante'),
    bullets: ['Matériel minimal', '15 modèles guidés', 'Techniques relaxantes'],
    rating: 4.3,
    tableOfContents: [
      'Choisir son matériel',
      'Techniques de base',
      'Peindre des fleurs',
      'Paysages faciles',
      'Créer son carnet',
    ],
    images: ['/images/covers/atelier-aquarelle-apaisante.svg'],
    reviews: [],
  },
  {
    id: 'ebook-numerique',
    slug: 'numerique-sans-stress',
    title: 'Numérique sans stress',
    description: 'Bien utiliser tablette, smartphone et services en ligne en toute sécurité.',
    price: 2000,
    category: 'Autonomie',
    coverUrl: baseCover('numerique-sans-stress'),
    pdfKey: basePdf('numerique-sans-stress'),
    bullets: ['Pas-à-pas illustrés', 'Sécurité sur internet', 'Appels vidéos faciles'],
    rating: 4.8,
    tableOfContents: [
      'Configurer ses appareils',
      'Communiquer avec ses proches',
      'Gérer ses démarches',
      'Se protéger en ligne',
      'Aller plus loin',
    ],
    images: ['/images/covers/numerique-sans-stress.svg'],
    reviews: [],
  },
  {
    id: 'ebook-cuisine',
    slug: 'cuisine-legere-et-gourmande',
    title: 'Cuisine légère et gourmande',
    description: '50 recettes équilibrées et savoureuses pensées pour les seniors.',
    price: 1900,
    category: 'Santé',
    coverUrl: baseCover('cuisine-legere-et-gourmande'),
    pdfKey: basePdf('cuisine-legere-et-gourmande'),
    bullets: ['Recettes prêtes en 20 min', 'Astuces anti-gaspillage', 'Menus hebdos'],
    rating: 4.6,
    tableOfContents: [
      'Bien choisir ses ingrédients',
      'Petits-déjeuners énergisants',
      'Plats mijotés légers',
      'Desserts raisonnables',
      'Menus types',
    ],
    images: ['/images/covers/cuisine-legere-et-gourmande.svg'],
    reviews: [],
  },
  {
    id: 'ebook-memoire-photo',
    slug: 'atelier-photo-memoire',
    title: 'Atelier photo mémoire',
    description: 'Créer un album numérique vivant pour transmettre vos souvenirs.',
    price: 1500,
    category: 'Mémoire',
    coverUrl: baseCover('atelier-photo-memoire'),
    pdfKey: basePdf('atelier-photo-memoire'),
    bullets: ['Scanner ses archives', 'Structurer son récit', 'Partager facilement'],
    rating: 4.2,
    tableOfContents: [
      'Collecter ses photos',
      'Numériser simplement',
      'Raconter son histoire',
      'Mise en page inspirée',
      'Partager avec la famille',
    ],
    images: ['/images/covers/atelier-photo-memoire.svg'],
    reviews: [],
  },
  {
    id: 'ebook-jardin',
    slug: 'jardin-zen-sur-balcon',
    title: 'Jardin zen sur balcon',
    description: 'Aménager un coin de verdure relaxant même sans jardin.',
    price: 1300,
    category: 'Loisirs',
    coverUrl: baseCover('jardin-zen-sur-balcon'),
    pdfKey: basePdf('jardin-zen-sur-balcon'),
    bullets: ['Plantes faciles', 'Idées d’agencements', 'Entretien minimal'],
    rating: 4.1,
    tableOfContents: [
      'Choisir ses contenants',
      'Palette végétale relaxante',
      'Ambiance lumineuse',
      'Entretien saisonnier',
      'Inviter la biodiversité',
    ],
    images: ['/images/covers/jardin-zen-sur-balcon.svg'],
    reviews: [],
  },
  {
    id: 'ebook-cerveau',
    slug: 'cerveau-en-forme',
    title: 'Cerveau en forme',
    description: 'Nutrition, exercices et routines pour prendre soin de son cerveau.',
    price: 2000,
    category: 'Mémoire',
    coverUrl: baseCover('cerveau-en-forme'),
    pdfKey: basePdf('cerveau-en-forme'),
    bullets: ['Nutrition neuroprotectrice', 'Exercices cognitifs', 'Suivi mensuel'],
    rating: 4.7,
    tableOfContents: [
      'Comprendre le vieillissement cérébral',
      'Alimentation protectrice',
      'Méditation et respiration',
      'Carnet de suivi',
      'Ressources complémentaires',
    ],
    images: ['/images/covers/cerveau-en-forme.svg'],
    reviews: [],
  },
];

export const bundles: BundleSummary[] = [
  {
    id: 'bundle-bien-etre',
    slug: 'rituels-bien-etre',
    title: 'Rituels bien-être',
    description: 'Sommeil, cœur et yoga : le trio zen pour prendre soin de soi.',
    price: 4900,
    compareAtPrice: 6200,
    items: [
      'Bien dormir après 60 ans',
      'Prendre soin de son cœur',
      'Yoga doux au quotidien',
    ],
  },
  {
    id: 'bundle-memoire',
    slug: 'memoire-vivante',
    title: 'Mémoire vivante',
    description: 'Stimulez votre mémoire et transmettez vos souvenirs.',
    price: 4200,
    compareAtPrice: 5100,
    items: [
      'Entretenir sa mémoire',
      'Atelier photo mémoire',
      'Cerveau en forme',
    ],
  },
];

export const clubSubscription = {
  id: 'sub-club-senior-zen',
  title: 'Club Senior Zen',
  description:
    'Accès illimité aux nouveautés, masterclass mensuelle et remise de 30% sur tous les ebooks.',
  price: 900,
  currency: 'eur',
  benefits: [
    'Un nouvel ebook exclusif chaque mois',
    'Masterclass vidéo en direct avec nos experts',
    'Réduction automatique de 30% sur le catalogue',
    'Accès aux replays et guides pratiques',
  ],
};

export const faqs = [
  {
    question: 'Comment accéder à mes ebooks après l’achat ?',
    answer:
      'Vous recevez un email avec le lien vers votre bibliothèque sécurisée. Vous pouvez y télécharger vos ebooks autant de fois que nécessaire dans la limite de 5 téléchargements par achat.',
  },
  {
    question: 'Quels moyens de paiement acceptez-vous ?',
    answer: 'Les paiements sont gérés par Stripe : carte bancaire, Apple Pay et Google Pay.',
  },
  {
    question: 'Puis-je offrir un ebook ?',
    answer:
      'Oui ! Indiquez l’email du bénéficiaire lors du paiement et il recevra directement son accès.',
  },
  {
    question: 'Le Club Senior Zen est-il sans engagement ?',
    answer: 'Oui, l’abonnement est résiliable en un clic via votre espace compte.',
  },
];

export const blogPosts: BlogSummary[] = [
  {
    id: 'post-bien-dormir',
    slug: 'rituels-de-sommeil-apres-60-ans',
    title: '5 rituels de sommeil après 60 ans',
    excerpt: 'Retrouvez des nuits sereines grâce à ces gestes simples et validés par nos experts.',
    publishedAt: '2024-02-12',
  },
  {
    id: 'post-memoire',
    slug: 'stimuler-sa-memoire-chaque-jour',
    title: 'Stimuler sa mémoire chaque jour',
    excerpt: 'Des défis faciles pour entraîner votre mémoire sans vous mettre la pression.',
    publishedAt: '2024-01-28',
  },
  {
    id: 'post-numerique',
    slug: 'les-bons-reflexes-numeriques',
    title: 'Les bons réflexes numériques',
    excerpt: 'Sécurisez vos appareils et naviguez l’esprit léger avec nos conseils.',
    publishedAt: '2023-12-18',
  },
];

export const coupons = [
  {
    code: 'ZENLANCEMENT',
    percentOff: 20,
    validFrom: '2024-01-01',
    validTo: '2024-04-30',
    maxRedemptions: 500,
  },
];

export function findProductBySlug(slug: string): ProductDetail | undefined {
  return products.find((product) => product.slug === slug);
}

export function listProductsByCategory(category?: Category): ProductSummary[] {
  if (!category) return products;
  return products.filter((product) => product.category === category);
}

export function getBundleBySlug(slug: string) {
  return bundles.find((bundle) => bundle.slug === slug);
}
