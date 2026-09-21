/**
 * Communes de la métropole de Montpellier et du littoral proche couvertes par
 * le cabinet. Chaque entrée porte un contenu propre : angle patrimonial réel,
 * situations qui reviennent sur place, outils pertinents.
 *
 * Règle d'écriture : aucun chiffre de marché, aucun prix au mètre carré, aucune
 * promesse de rendement. On décrit des mécanismes et des situations, jamais un
 * support ni un produit (statut COA + carte T, pas CIF).
 */

export type Enjeu = { t: string; d: string };

export type Commune = {
  slug: string;
  nom: string;
  /** Préposition correcte devant le nom : "à Lattes", "au Crès". */
  prep: string;
  /** Résumé affiché en chapô et sur le hub Montpellier. */
  accroche: string;
  /** Meta description, rédigée à la main. Viser 120 à 158 caractères. */
  meta: string;
  /** Situation de la commune, factuel et qualitatif. */
  contexte: string[];
  /** Ce qui revient le plus souvent en rendez-vous sur ce territoire. */
  enjeux: Enjeu[];
  /** Outils du site cohérents avec l'angle de la commune. */
  outils: { label: string; href: string }[];
  /** Slugs des communes mises en avant en maillage interne. */
  voisines: string[];
};

export const communes: Commune[] = [
  {
    slug: 'castelnau-le-lez',
    nom: 'Castelnau-le-Lez',
    prep: 'à',
    accroche:
      "Une commune résidentielle en croissance continue, où la question patrimoniale porte souvent sur l'arbitrage entre résidence principale et premier investissement locatif.",
    meta:
      "Conseiller en gestion de patrimoine indépendant à Castelnau-le-Lez : résidence principale, premier investissement locatif, meublé et transmission.",
    contexte: [
      "Castelnau-le-Lez est devenue, au fil des extensions du tramway, le prolongement naturel de Montpellier vers le nord-est. La ligne 2 met le centre de la métropole à quelques minutes, ce qui a profondément changé le profil des acquéreurs : on y trouve autant de familles installées de longue date que de cadres arrivés récemment pour un cadre plus calme sans quitter l'agglomération.",
      "Cette double population produit deux conversations patrimoniales très différentes. D'un côté des propriétaires de longue date, dont le patrimoine s'est valorisé sans qu'ils l'aient piloté, et qui découvrent tardivement une question de transmission. De l'autre des ménages en phase d'acquisition, avec un crédit récent, une capacité d'épargne réelle et aucune structure autour.",
      "Le quartier Eurêka et les programmes neufs de la commune attirent par ailleurs des investisseurs, souvent avec une idée de location meublée. C'est un sujet à traiter avec précision : le régime fiscal choisi au départ engage pour des années, et la réforme de 2025 sur la réintégration des amortissements à la revente a modifié l'équation.",
    ],
    enjeux: [
      {
        t: 'Résidence principale ou premier locatif',
        d: "L'arbitrage se tranche rarement sur le rendement affiché. Il se tranche sur la capacité d'emprunt restante, l'horizon de revente et la fiscalité de chacun. On pose les deux scénarios côte à côte avant de décider.",
      },
      {
        t: 'Un patrimoine immobilier qui a pris de la valeur seul',
        d: "Beaucoup de propriétaires castelnauviens détiennent un bien dont la valeur a doublé sans arbitrage. La question devient celle de la plus-value en cas de revente et de la transmission aux enfants.",
      },
      {
        t: 'Meublé : le régime choisi au départ',
        d: "Le meublé se décide à l'achat, pas à la déclaration. On regarde ce que l'amortissement change réellement, et ce qu'il coûte au moment de revendre depuis la réforme.",
      },
    ],
    outils: [
      { label: "Simuler votre capacité d'emprunt", href: '/outils/capacite-emprunt' },
      { label: 'Louer ou acheter, le match chiffré', href: '/outils/louer-ou-acheter' },
      { label: 'Plus-value LMNP après la réforme 2025', href: '/outils/plus-value-lmnp' },
    ],
    voisines: ['montferrier-sur-lez', 'lattes', 'juvignac'],
  },

  {
    slug: 'lattes',
    nom: 'Lattes',
    prep: 'à',
    accroche:
      "Entre Montpellier et la mer, une commune où se croisent résidence principale familiale, locatif et projets de résidence secondaire.",
    meta:
      "Conseiller en gestion de patrimoine indépendant à Lattes : épargne qui dort, préparation de la retraite, investissement locatif. Premier échange offert.",
    contexte: [
      "Lattes occupe une position rare : à portée immédiate de Montpellier, à quelques kilomètres du littoral, avec un tissu qui va du pavillonnaire familial aux programmes récents de Port Ariane. Cette variété se retrouve dans les patrimoines que l'on y rencontre.",
      "Le profil dominant en rendez-vous est celui du couple actif installé, propriétaire de sa résidence principale, avec une épargne qui s'est accumulée sans destination précise. La question posée est presque toujours la même : cet argent dort, qu'est-ce qu'on en fait. La réponse dépend moins du support que de l'horizon et de la fiscalité du foyer.",
      "S'ajoute une spécificité locale : la proximité de l'étang et du littoral rend la commune attractive pour des acquéreurs extérieurs à la région, parfois en vue d'une future retraite. Un achat fait quinze ans avant le départ à la retraite ne se structure pas comme un achat de jouissance immédiate.",
    ],
    enjeux: [
      {
        t: 'Une épargne qui stagne sur des comptes courants',
        d: "Le premier travail consiste à distinguer l'épargne de précaution, celle qui doit rester disponible, et le reste, qui peut viser un horizon long. Deux poches, deux logiques.",
      },
      {
        t: 'Préparer la retraite quand on est encore en pleine activité',
        d: "Le plan épargne retraite produit un effet fiscal immédiat qui dépend entièrement de votre tranche marginale. Sur certaines situations l'effet est significatif, sur d'autres il est faible. On le calcule avant d'en parler.",
      },
      {
        t: 'Un achat en vue de la retraite',
        d: "Acheter tôt un bien que l'on occupera plus tard suppose d'arbitrer la période intermédiaire : location nue, meublée, ou vacance. Chaque option a un coût fiscal et un effet sur le financement.",
      },
    ],
    outils: [
      { label: "Ce qu'un versement PER change sur votre impôt", href: '/outils/economie-impot-per' },
      { label: 'Ce que votre épargne peut devenir', href: '/outils/interets-composes' },
      { label: 'Rentabilité locative réelle, mois par mois', href: '/calculatrice-rentabilite-credit' },
    ],
    voisines: ['perols', 'palavas-les-flots', 'saint-jean-de-vedas'],
  },

  {
    slug: 'saint-jean-de-vedas',
    nom: 'Saint-Jean-de-Védas',
    prep: 'à',
    accroche:
      "Une commune d'entrée ouest de la métropole, où la clientèle est jeune, primo-accédante, et où tout se joue sur le financement.",
    meta:
      "Conseiller en gestion de patrimoine à Saint-Jean-de-Védas : capacité d'emprunt, coût réel du crédit, prêt à taux zéro et assurance emprunteur.",
    contexte: [
      "Saint-Jean-de-Védas s'est développée autour de son accessibilité : tramway, contournement, proximité immédiate de Montpellier. Le résultat est une population nettement plus jeune que la moyenne de la métropole, avec une forte proportion de primo-accédants.",
      "La conséquence patrimoniale est directe. Ici, la question n'est presque jamais celle de la transmission ou de l'optimisation d'un capital constitué. Elle est celle de l'accès : combien puis-je emprunter, à quelles conditions, et que me reste-t-il pour vivre une fois la mensualité payée.",
      "C'est aussi le terrain du prêt à taux zéro et des dispositifs d'accession, dont les conditions dépendent de la zone, de la composition du foyer et des revenus. Ces paramètres bougent régulièrement, et une simulation faite il y a deux ans ne vaut plus grand-chose aujourd'hui.",
    ],
    enjeux: [
      {
        t: 'Savoir ce que vous pouvez réellement emprunter',
        d: "Le montant affiché par une banque et le montant tenable dans votre budget ne coïncident pas toujours. On regarde le taux d'endettement, mais surtout le reste à vivre.",
      },
      {
        t: 'Le coût total du crédit, pas seulement la mensualité',
        d: "Deux crédits à mensualité identique peuvent différer de plusieurs dizaines de milliers d'euros sur la durée. L'assurance emprunteur pèse souvent plus qu'on ne le croit.",
      },
      {
        t: "L'assurance de prêt, le levier le plus souvent oublié",
        d: "Changer d'assurance emprunteur est possible à tout moment depuis la loi Lemoine. Sur un prêt récent, l'économie se chiffre fréquemment en milliers d'euros, à garanties équivalentes.",
      },
    ],
    outils: [
      { label: "Votre capacité d'emprunt", href: '/outils/capacite-emprunt' },
      { label: 'Mensualité et coût total du crédit', href: '/outils/simulateur-pret' },
      { label: 'Votre prêt à taux zéro', href: '/outils/simulateur-ptz' },
    ],
    voisines: ['juvignac', 'lattes', 'castelnau-le-lez'],
  },

  {
    slug: 'juvignac',
    nom: 'Juvignac',
    prep: 'à',
    accroche:
      "À l'ouest de Montpellier, une commune résidentielle familiale où les sujets dominants sont la protection du conjoint et la transmission.",
    meta:
      "Conseiller en gestion de patrimoine indépendant à Juvignac : protection du conjoint, droits de succession et patrimoine concentré sur la maison.",
    contexte: [
      "Juvignac s'est construite comme une commune résidentielle, avec une population familiale installée et un parc majoritairement en propriété. Le patrimoine y est souvent concentré sur un actif : la maison.",
      "Cette concentration crée une fragilité que peu de foyers mesurent. Un patrimoine composé à quatre-vingts pour cent d'un bien immobilier occupé par la famille est difficile à partager, difficile à mobiliser en cas de coup dur, et lourd à transmettre. La question n'est pas de vendre, elle est d'équilibrer.",
      "Le second sujet récurrent est la protection du conjoint. Beaucoup de couples pensent que le régime matrimonial et la simple présence d'un contrat suffisent. Selon la composition de la famille, notamment en présence d'enfants d'une première union, le conjoint survivant peut se retrouver dans une position bien moins confortable qu'anticipé.",
    ],
    enjeux: [
      {
        t: 'Un patrimoine concentré sur la résidence principale',
        d: "Il ne s'agit pas de vendre la maison. Il s'agit de construire à côté une poche liquide, qui donne des options le jour où il en faut.",
      },
      {
        t: 'Protéger le conjoint, réellement',
        d: "Régime matrimonial, clause bénéficiaire, donation entre époux : trois leviers distincts, qui ne produisent pas les mêmes effets. On regarde ce que donnerait votre situation actuelle si elle survenait demain.",
      },
      {
        t: 'Anticiper les droits de succession',
        d: "Les abattements se reconstituent tous les quinze ans. Anticiper de dix ans ne coûte rien et change souvent radicalement la facture pour les enfants.",
      },
    ],
    outils: [
      { label: 'Ce que vos héritiers paieraient', href: '/outils/droits-succession' },
      { label: 'Votre diagnostic patrimonial complet', href: '/outils/diagnostic-patrimonial' },
      { label: 'Ce que votre épargne peut devenir', href: '/outils/interets-composes' },
    ],
    voisines: ['saint-jean-de-vedas', 'montferrier-sur-lez', 'castelnau-le-lez'],
  },

  {
    slug: 'montferrier-sur-lez',
    nom: 'Montferrier-sur-Lez',
    prep: 'à',
    accroche:
      "Une commune de patrimoines constitués, où les sujets sont la transmission, la structuration et la fiscalité du capital.",
    meta:
      "Conseiller en gestion de patrimoine à Montferrier-sur-Lez : structuration, clause bénéficiaire, société civile et transmission anticipée.",
    contexte: [
      "Montferrier-sur-Lez fait partie de ces communes du nord de la métropole où les patrimoines sont, en moyenne, déjà constitués. Les personnes que l'on y rencontre ne cherchent pas à se construire un capital : elles cherchent à le tenir, à le structurer et à le transmettre.",
      "Les situations sont plus complexes qu'ailleurs. Il n'est pas rare de trouver plusieurs biens immobiliers, parfois détenus en société civile, une assurance-vie ouverte il y a vingt ans dont personne n'a relu la clause bénéficiaire, des parts de société professionnelle, et des enfants majeurs qui commencent eux-mêmes à acheter.",
      "Le travail utile consiste d'abord à faire l'inventaire. Dans une majorité de cas, l'anomalie ne vient pas d'un manque de moyens, mais d'une accumulation de décisions prises isolément sur trente ans, qui n'ont jamais été regardées ensemble.",
    ],
    enjeux: [
      {
        t: 'Des clauses bénéficiaires jamais relues',
        d: "Une clause rédigée avant un divorce, une naissance ou un remariage peut produire exactement l'inverse de ce que vous souhaitez aujourd'hui. C'est la correction la plus rapide et la moins coûteuse qui existe.",
      },
      {
        t: 'Transmettre sans se dépouiller',
        d: "Donation en nue-propriété, démembrement, pacte de famille : plusieurs mécanismes permettent d'anticiper tout en conservant l'usage ou les revenus. Chacun a ses conditions et ses limites.",
      },
      {
        t: 'Un patrimoine détenu en société civile',
        d: "La société civile est un outil puissant et souvent mal entretenu. Statuts obsolètes, assemblées non tenues, comptes courants non documentés : autant de points qui se paient au moment où il faut s'en servir.",
      },
    ],
    outils: [
      { label: 'Simuler les droits de succession', href: '/outils/droits-succession' },
      { label: 'Diagnostic patrimonial', href: '/outils/diagnostic-patrimonial' },
      { label: "L'étude patrimoniale approfondie", href: '/outils/etude-patrimoniale' },
    ],
    voisines: ['castelnau-le-lez', 'juvignac', 'lattes'],
  },

  {
    slug: 'perols',
    nom: 'Pérols',
    prep: 'à',
    accroche:
      "Entre l'étang et la mer, un territoire où la résidence secondaire et la location saisonnière posent des questions fiscales précises.",
    meta:
      "Conseiller en gestion de patrimoine à Pérols : fiscalité de la location saisonnière, résidence secondaire et plus-value à la revente.",
    contexte: [
      "Pérols bénéficie d'une situation charnière entre la métropole et le littoral. La commune attire des résidents permanents, mais aussi des propriétaires de biens à usage mixte, occupés une partie de l'année et loués le reste du temps.",
      "Cette configuration est celle qui génère le plus d'erreurs fiscales dans la région. La location saisonnière relève d'un régime propre, avec des seuils, des obligations déclaratives et des conséquences en matière de cotisations sociales qui surprennent souvent les propriétaires de bonne foi.",
      "Le second point d'attention concerne la revente. Un bien qui n'est pas la résidence principale ne bénéficie pas de l'exonération de plus-value. L'abattement pour durée de détention existe, mais il s'étale sur plus de vingt ans, et il ne joue pas au même rythme pour l'impôt et pour les prélèvements sociaux.",
    ],
    enjeux: [
      {
        t: 'Location saisonnière : le régime réel importe',
        d: "Micro-BIC ou réel, classé ou non classé, seuils de recettes : le choix n'est pas neutre et il se fait en amont, pas au moment de la déclaration.",
      },
      {
        t: 'La plus-value à la revente',
        d: "Sur une résidence secondaire, la fiscalité de la revente doit être calculée avant l'achat, pas découverte chez le notaire. L'abattement pour durée ne suit pas le même calendrier selon l'impôt concerné.",
      },
      {
        t: 'Un bien à usage mixte',
        d: "Occuper une partie de l'année et louer le reste est possible, mais impose une rigueur documentaire. Sans elle, l'administration retient l'hypothèse la moins favorable.",
      },
    ],
    outils: [
      { label: 'Plus-value immobilière à la revente', href: '/outils/plus-value-immobiliere' },
      { label: 'Revenu locatif net en meublé', href: '/outils/lmnp' },
      { label: 'Rentabilité locative réelle', href: '/calculatrice-rentabilite-credit' },
    ],
    voisines: ['palavas-les-flots', 'mauguio', 'lattes'],
  },

  {
    slug: 'palavas-les-flots',
    nom: 'Palavas-les-Flots',
    prep: 'à',
    accroche:
      "Une commune littorale où la majorité des sujets tournent autour de la résidence secondaire, de sa fiscalité et de sa transmission.",
    meta:
      "Conseiller en gestion de patrimoine à Palavas-les-Flots : indivision, résidence secondaire détenue de longue date et transmission familiale.",
    contexte: [
      "Palavas-les-Flots est un marché de résidence secondaire avant d'être un marché de résidence principale. Une part importante des biens appartient à des propriétaires qui n'y vivent pas à l'année, parfois depuis deux ou trois générations.",
      "Cette ancienneté crée une situation particulière : des biens détenus depuis très longtemps, souvent en indivision après une succession, dont la valeur a fortement progressé et que personne n'a envie de vendre, mais que personne n'arrive non plus à gérer sereinement à plusieurs.",
      "L'indivision est le point de friction numéro un sur ce territoire. Elle fonctionne tant que tout le monde s'entend, et devient bloquante dès que l'un des indivisaires veut sortir, vendre, ou simplement financer autre chose. Il existe des sorties organisées, mais elles se préparent.",
    ],
    enjeux: [
      {
        t: 'Sortir ou organiser une indivision',
        d: "Vente, rachat de parts, apport en société civile : plusieurs voies existent. Le coût et le délai diffèrent énormément selon celle que l'on retient, et selon le moment où l'on s'y prend.",
      },
      {
        t: 'Une résidence secondaire détenue depuis longtemps',
        d: "Forte plus-value latente, taxe d'habitation maintenue, fiscalité de revente spécifique : le bien coûte souvent plus qu'il n'y paraît. On chiffre l'ensemble avant d'arbitrer.",
      },
      {
        t: 'Transmettre un bien que la famille veut garder',
        d: "Garder le bien dans la famille et éviter le blocage à la génération suivante sont deux objectifs qui demandent une structure, pas seulement une bonne intention.",
      },
    ],
    outils: [
      { label: 'Plus-value immobilière', href: '/outils/plus-value-immobiliere' },
      { label: 'Droits de succession', href: '/outils/droits-succession' },
      { label: 'Diagnostic patrimonial', href: '/outils/diagnostic-patrimonial' },
    ],
    voisines: ['perols', 'mauguio', 'lattes'],
  },

  {
    slug: 'mauguio',
    nom: 'Mauguio',
    prep: 'à',
    accroche:
      "Mauguio et Carnon, un territoire double où cohabitent patrimoine familial de longue date et investissement littoral.",
    meta:
      "Conseiller en gestion de patrimoine à Mauguio et Carnon : patrimoine familial, foncier non bâti, locatif littoral et droits de succession.",
    contexte: [
      "Mauguio présente la particularité d'associer un bourg de l'arrière-pays, au tissu familial ancien, et la station de Carnon sur le littoral. Deux réalités patrimoniales sur une seule commune.",
      "Côté Mauguio, on rencontre fréquemment des patrimoines familiaux transmis sur plusieurs générations, incluant parfois du foncier agricole ou des parcelles non bâties. Ces actifs ont leurs règles propres en matière d'évaluation et de transmission, et sont régulièrement laissés de côté dans les bilans parce qu'ils ne produisent rien.",
      "Côté Carnon, la logique est celle de l'investissement et de la résidence secondaire, avec les mêmes questions de fiscalité locative et de plus-value que sur le reste du littoral. Un même foyer détient parfois les deux, sans que les deux aient jamais été regardés ensemble.",
    ],
    enjeux: [
      {
        t: 'Du foncier qui ne produit rien',
        d: "Une parcelle non bâtie transmise depuis trois générations reste un actif, avec une valeur et un traitement successoral. L'ignorer ne la fait pas disparaître du calcul des droits.",
      },
      {
        t: 'Un patrimoine familial jamais inventorié',
        d: "Le premier livrable utile est souvent une simple cartographie : ce que vous détenez, sous quelle forme, avec quelle fiscalité à la sortie. Beaucoup de décisions s'éclairent à ce stade.",
      },
      {
        t: 'Le locatif littoral',
        d: "Meublé, saisonnier ou nu : le régime retenu à Carnon détermine l'imposition des loyers et la note à la revente. Il se choisit au départ.",
      },
    ],
    outils: [
      { label: 'Droits de succession', href: '/outils/droits-succession' },
      { label: 'Revenu locatif net en meublé', href: '/outils/lmnp' },
      { label: "L'étude patrimoniale approfondie", href: '/outils/etude-patrimoniale' },
    ],
    voisines: ['perols', 'palavas-les-flots', 'castelnau-le-lez'],
  },
];

export const communeBySlug = (slug: string) => communes.find((c) => c.slug === slug);

/** Chemin canonique d'une page commune. */
export const communePath = (slug: string) => `/conseiller-gestion-patrimoine-${slug}`;
