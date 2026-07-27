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
  city: 'Paris · Montpellier · Marseille',
  coverage: 'France entière · en présentiel ou à distance',
};

export const nav = [
  { label: 'Parcours', href: '/parcours' },
  { label: 'Expertise', href: '/expertise' },
  { label: 'Manifeste', href: '/manifeste' },
  { label: 'Magazine', href: '/magazine' },
  { label: 'Observatoire', href: '/observatoire' },
  { label: 'La Lettre', href: '/newsletter' },
  { label: 'Cas pratiques', href: '/cas-pratiques' },
  { label: 'Suisse & France', href: '/suisse-france' },
  { label: 'Contact', href: '/contact' },
];

export const expertises = [
  {
    slug: 'plan-epargne-retraite',
    title: 'Plan Épargne Retraite',
    short: 'PER',
    tagline: 'Préparer sa retraite en réduisant son impôt',
    summary:
      "Le PER est l'outil fiscal le plus puissant pour les contribuables imposés à partir de la TMI 30%. Bien construit, il combine réduction d'impôt immédiate, capitalisation long terme et sortie flexible.",
  },
  {
    slug: 'assurance-vie',
    title: 'Assurance-vie',
    short: 'AV',
    tagline: 'Le couteau suisse du patrimoine français',
    summary:
      "Capitalisation, transmission hors succession, fiscalité dégressive : l'assurance-vie reste l'enveloppe reine. Encore faut-il choisir le bon contrat et la bonne architecture d'UC.",
  },
  {
    slug: 'scpi',
    title: 'SCPI',
    short: 'SCPI',
    tagline: 'La pierre-papier, diversifiée et mutualisée',
    summary:
      "Investir dans l'immobilier tertiaire sans gestion locative, avec un ticket d'entrée accessible et une mutualisation forte. Différences fondamentales entre SCPI européennes, thématiques et de rendement.",
  },
  {
    slug: 'defiscalisation',
    title: 'Défiscalisation',
    short: 'Fiscalité',
    tagline: 'Réduire son impôt, intelligemment',
    summary:
      "Défiscaliser ne doit jamais primer sur la pertinence économique. Panorama clair des dispositifs réellement efficaces : PER, Girardin, FCPI/FIP, Malraux, déficit foncier.",
  },
  {
    slug: 'transmission',
    title: 'Transmission',
    short: 'Succession',
    tagline: 'Anticiper pour protéger',
    summary:
      "Démembrement, donation, pacte Dutreil, assurance-vie : organiser la transmission permet de faire économiser 30 à 60% de droits à ses héritiers. Un sujet trop souvent repoussé.",
  },
  {
    slug: 'immobilier-lmnp-demembrement',
    title: 'Immobilier patrimonial',
    short: 'Immobilier',
    tagline: 'LMNP, nue-propriété, démembrement',
    summary:
      "Au-delà de la résidence principale, l'immobilier structuré permet de générer des revenus peu fiscalisés (LMNP) ou de préparer l'avenir à coût réduit (nue-propriété temporaire).",
  },
  {
    slug: 'pea-bourse',
    title: 'PEA & investissement boursier',
    short: 'PEA',
    tagline: 'Actions européennes, fiscalité allégée',
    summary:
      "Le PEA reste l'enveloppe la plus efficace pour construire un patrimoine actions sur le long terme. ETF, gestion pilotée, arbitrages : comment en faire un véritable moteur de performance.",
  },
  {
    slug: 'epargne-salariale-dirigeant',
    title: 'Épargne salariale & retraite du dirigeant',
    short: 'TNS / Dirigeant',
    tagline: 'PEE, PERCO, Madelin, art. 83',
    summary:
      "Les dirigeants et TNS disposent d'outils spécifiques sous-exploités. Bien pilotés, ils cumulent déductibilité, abondement et exonérations pour construire une retraite robuste.",
  },
  {
    slug: 'private-equity-non-cote',
    title: 'Private Equity',
    short: 'Non coté',
    tagline: 'Accéder au non coté intelligemment',
    summary:
      "FCPR, FPCI, FCPI, FIP : le non coté offre des rendements décorrélés et souvent une fiscalité favorable. Mais la sélection est cruciale, tous les véhicules ne se valent pas.",
  },
  {
    slug: 'credit-strategie-patrimoniale',
    title: 'Crédit & effet de levier',
    short: 'Levier',
    tagline: 'Financer son patrimoine sans grignoter son épargne',
    summary:
      "Un bon crédit est un actif. Effet de levier immobilier, crédit lombard, in fine : utilisé avec méthode, le crédit démultiplie la construction patrimoniale sans friction fiscale.",
  },
];
