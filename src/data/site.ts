export const site = {
  name: 'Le Chêne Patrimonial',
  owner: 'Camil Czajkowski',
  tagline: 'Conseil en gestion de patrimoine indépendant',
  baseline: "Faire fructifier ce qui compte, avec méthode, clarté et engagement.",
  calendly:
    import.meta.env.PUBLIC_CALENDLY_URL ??
    'https://calendly.com/camil-cz-lechenepatrimonial/30min',
  email: 'camil.cz@lechenepatrimonial.com',
  phone: { display: '06 12 82 91 90', tel: '+33612829190' },
  linkedin: 'https://www.linkedin.com/in/camil-czajkowski/',
  instagram: 'https://www.instagram.com/le.chene.patrimonial/',
  googleReview: 'https://g.page/r/CT0apkPyT4_CEBM/review',
  // Siège social réel, tel qu'immatriculé au RCS de Montpellier. Obligatoire
  // dans les mentions légales (LCEN art. 6-III) et déjà public au BODACC.
  address: 'Bâtiment E, 50 rue Dora Maar, 34070 Montpellier',
  city: 'Montpellier',
  coverage: 'France entière · en présentiel ou à distance',
};

// Menu principal — resserré à 7 entrées qui suivent le parcours du visiteur :
// qui je suis, ce que je fais, mes preuves, mon expertise data, mes contenus, agir.
export const nav = [
  { key: 'nav.parcours', label: 'Parcours', href: '/parcours' },
  { key: 'nav.expertise', label: 'Expertise', href: '/expertise' },
  { key: 'nav.opportunites', label: 'Opportunités', href: '/opportunites' },
  { key: 'nav.observatoire', label: 'Observatoire', href: '/observatoire' },
  { key: 'nav.outils', label: 'Outils', href: '/outils' },
  { key: 'nav.avis', label: 'Avis clients', href: '/avis' },
  { key: 'nav.contact', label: 'Contact', href: '/contact' },
];

// Liens secondaires — retirés du menu principal pour l'alléger, mais gardés
// accessibles dans le footer pour que personne ne soit perdu.
export const navSecondary = [
  { key: 'nav.magazine', label: 'Magazine', href: '/magazine' },
  { key: 'nav.cas', label: 'Cas pratiques', href: '/cas-pratiques' },
  { key: 'nav.manifeste', label: 'Manifeste', href: '/manifeste' },
  { key: 'nav.lettre', label: 'La Lettre du Chêne', href: '/newsletter' },
];

export const expertises = [
  {
    slug: 'plan-epargne-retraite',
    title: 'Plan Épargne Retraite',
    short: 'PER',
    tagline: 'Préparer sa retraite en réduisant son impôt',
    summary:
      "Le PER est l'outil fiscal le plus puissant dès la TMI 30% : réduction d'impôt immédiate, capitalisation long terme et sortie en capital libre.",
  },
  {
    slug: 'assurance-vie',
    title: 'Assurance-vie',
    short: 'AV',
    tagline: 'Le couteau suisse du patrimoine français',
    summary:
      "Capitalisation, transmission hors succession, fiscalité dégressive : l'assurance-vie reste l'enveloppe reine, à condition de choisir le bon contrat.",
  },
  {
    slug: 'scpi',
    title: 'SCPI',
    short: 'SCPI',
    tagline: 'La pierre-papier, diversifiée et mutualisée',
    summary:
      "Investir dans l'immobilier tertiaire sans gestion locative, avec un ticket accessible. Différences entre SCPI européennes, thématiques et de rendement.",
  },
  {
    slug: 'defiscalisation',
    title: 'Défiscalisation',
    short: 'Fiscalité',
    tagline: 'Réduire son impôt, intelligemment',
    summary:
      "Défiscaliser ne prime jamais sur la pertinence économique. Les dispositifs réellement efficaces : PER, Girardin, FCPI/FIP, Malraux, déficit foncier.",
  },
  {
    slug: 'transmission',
    title: 'Transmission',
    short: 'Succession',
    tagline: 'Anticiper pour protéger',
    summary:
      "Démembrement, donation, pacte Dutreil, assurance-vie : bien organisée, la transmission fait économiser 30 à 60% de droits à vos héritiers.",
  },
  {
    slug: 'immobilier-lmnp-demembrement',
    title: 'Immobilier patrimonial',
    short: 'Immobilier',
    tagline: 'LMNP, nue-propriété, démembrement',
    summary:
      "Au-delà de la résidence principale, l'immobilier structuré génère des revenus peu fiscalisés en LMNP ou prépare l'avenir en nue-propriété temporaire.",
  },
  {
    slug: 'pea-bourse',
    title: 'PEA & investissement boursier',
    short: 'PEA',
    tagline: 'Actions européennes, fiscalité allégée',
    summary:
      "Le PEA reste l'enveloppe la plus efficace pour bâtir un patrimoine actions sur le long terme. ETF, gestion pilotée, arbitrages : le mode d'emploi.",
  },
  {
    slug: 'epargne-salariale-dirigeant',
    title: 'Épargne salariale & retraite du dirigeant',
    short: 'TNS / Dirigeant',
    tagline: 'PEE, PERCO, Madelin, art. 83',
    summary:
      "Dirigeants et TNS disposent d'outils sous-exploités qui cumulent déductibilité, abondement et exonérations pour bâtir une retraite robuste.",
  },
  {
    slug: 'private-equity-non-cote',
    title: 'Private Equity',
    short: 'Non coté',
    tagline: 'Accéder au non coté intelligemment',
    summary:
      "FCPR, FPCI, FCPI, FIP : le non coté offre des rendements décorrélés et une fiscalité souvent favorable. Mais tous les véhicules ne se valent pas.",
  },
  {
    slug: 'credit-strategie-patrimoniale',
    title: 'Crédit & effet de levier',
    short: 'Levier',
    tagline: 'Financer son patrimoine sans grignoter son épargne',
    summary:
      "Un bon crédit est un actif. Levier immobilier, crédit lombard, prêt in fine : avec méthode, le crédit démultiplie la construction patrimoniale.",
  },
];
