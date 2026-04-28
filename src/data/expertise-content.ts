// Detailed content for each expertise page.
// Kept in TypeScript (not MDX) so it stays tightly typed and easy to edit.

export type ExpertiseContent = {
  slug: string;
  heroIntro: string;
  pourQui: string[];
  sections: { title: string; body: string; list?: string[] }[];
  chiffresCles: { label: string; value: string }[];
  piegesClassiques: string[];
  faq: { q: string; a: string }[];
};

export const expertiseContent: ExpertiseContent[] = [
  {
    slug: 'plan-epargne-retraite',
    heroIntro:
      "Le Plan Épargne Retraite (PER) est né de la loi PACTE (2019) pour simplifier un millefeuille devenu illisible (Madelin, PERP, art.83, PERCO…). Pour un contribuable imposé à partir de la TMI 30%, c'est aujourd'hui l'outil de défiscalisation le plus puissant, à condition d'en comprendre la mécanique.",
    pourQui: [
      'Contribuables imposés à partir de la TMI 30%',
      'Dirigeants et TNS avec des revenus élevés et variables',
      'Sportifs en fin de carrière à très hauts revenus',
      "Préparation d'un achat de résidence principale (sortie anticipée possible)",
    ],
    sections: [
      {
        title: 'Le principe : du revenu imposé vers du revenu reporté',
        body: "Les versements sur un PER sont déductibles du revenu imposable dans la limite d'un plafond annuel (10% des revenus professionnels, dans une fourchette). La fiscalité n'est pas effacée : elle est reportée à la sortie, quand vous êtes (souvent) à une TMI plus basse. L'écart de TMI entre vos années actives et votre retraite = le gain net.",
      },
      {
        title: 'Le calcul qu\'il faut savoir faire',
        body: "Versement × TMI d'aujourd'hui = économie d'impôt immédiate. À la sortie, le capital est taxé à votre TMI du moment. Gain net réel = (TMI actuelle − TMI future) × versement, augmenté du rendement capitalisé.",
        list: [
          "Exemple : 10 000 € versés à TMI 41% = 4 100 € d'économie d'impôt",
          "Sortie à TMI 30% 20 ans plus tard = 3 000 € d'impôt (hors capitalisation)",
          "Gain fiscal net = 1 100 €, auquel s'ajoute la capitalisation du capital investi",
        ],
      },
      {
        title: 'Sortie en capital ou en rente : le bon arbitrage',
        body: "Depuis PACTE, la sortie en capital est libre (ce qui n'était pas le cas du PERP/Madelin). Le choix entre capital, rente, ou mix dépend de votre fiscalité de sortie, de votre espérance de vie, et de votre besoin de liquidité. La rente est fiscalement pénalisante dans la plupart des cas pour des montants modérés.",
      },
      {
        title: 'Sortie anticipée pour l\'achat de la résidence principale',
        body: "Le PER autorise une sortie anticipée pour acheter sa résidence principale. C'est un levier sous-exploité : verser, déduire, capitaliser, puis sortir pour l'apport, tout en ayant réduit son impôt pendant la phase d'accumulation.",
      },
      {
        title: 'PER individuel vs PER d\'entreprise',
        body: "Le PERin (individuel) est piloté par le souscripteur. Le PERCOL/PERO (entreprise) bénéficie souvent d'un abondement employeur qui multiplie l'effort d'épargne. Pour un dirigeant, la combinaison des deux permet d'empiler les plafonds.",
      },
    ],
    chiffresCles: [
      { label: 'Plafond de versement', value: '10% des revenus pro' },
      { label: 'TMI rentable dès', value: '30%' },
      { label: 'Sortie capital', value: 'Libre depuis 2019' },
      { label: 'Exception retrait anticipé', value: 'Résidence principale' },
    ],
    piegesClassiques: [
      "Souscrire un PER à TMI 11%, la déduction ne rapporte quasi rien",
      "Laisser un PER en gestion pilotée horizon défensif dès 45 ans, perte de performance",
      "Ignorer les frais d'entrée (certains contrats ponctionnent 2 à 5%)",
      "Oublier la fiscalité de sortie en cas de décès avant la liquidation",
    ],
    faq: [
      {
        q: 'Puis-je ouvrir un PER même si je suis salarié ?',
        a: "Oui. Le PER individuel est accessible à tous, indépendamment du statut. Si votre entreprise propose un PER d'entreprise, vous pouvez cumuler les deux.",
      },
      {
        q: 'Combien verser par an pour que ce soit rentable ?',
        a: "Il n'y a pas de minimum technique. Économiquement, la rentabilité apparaît à partir d'une TMI 30% et d'un horizon de 10 ans et plus. En dessous, d'autres enveloppes sont plus pertinentes.",
      },
      {
        q: 'Que devient mon PER en cas de décès ?',
        a: "Fiscalité avantageuse avant 70 ans (abattement 152 500 € par bénéficiaire, taxation 20-31,25%). Après 70 ans, régime moins favorable. À anticiper dans la stratégie successorale.",
      },
    ],
  },
  {
    slug: 'assurance-vie',
    heroIntro:
      "L'assurance-vie reste, après 40 ans, l'enveloppe fiscale de référence en France. Capitalisation à fiscalité différée, abattements annuels après 8 ans, transmission hors succession : la richesse de ses usages en fait le socle de toute stratégie patrimoniale.",
    pourQui: [
      'Toute personne souhaitant capitaliser à moyen/long terme',
      'Profils cherchant à optimiser la transmission',
      'Investisseurs recherchant flexibilité et diversification',
      'Épargnants refusant le blocage du PER',
    ],
    sections: [
      {
        title: 'La triple force de l\'assurance-vie',
        body: "Une enveloppe multi-supports (fonds euro + unités de compte), une fiscalité dégressive avec un pivot à 8 ans, et une transmission hors masse successorale dans les limites légales. Aucun autre produit ne cumule ces trois atouts.",
      },
      {
        title: 'La règle des 8 ans',
        body: "Après 8 ans, les rachats bénéficient d'un abattement annuel (4 600 € pour une personne seule, 9 200 € pour un couple). Au-delà, un PFL de 7,5% s'applique (dans la limite de 150 000 € de versements nets de rachats). C'est le seuil qui transforme une AV en véritable machine à revenus défiscalisés.",
        list: [
          "0 à 8 ans : fiscalité standard (PFU 30% ou barème)",
          "Après 8 ans : abattement annuel + PFL 7,5% sous 150 000 € versés",
          "Prélèvements sociaux (17,2%) dus dans tous les cas",
        ],
      },
      {
        title: 'Architecture : fonds euros + UC',
        body: "Le fonds en euros garantit le capital mais son rendement décroît. Les unités de compte (UC) apportent le moteur de performance mais exposent au risque de marché. L'arbitrage entre les deux doit être piloté selon l'horizon, la fiscalité et le profil de risque, pas laissé à la gestion par défaut du contrat.",
      },
      {
        title: 'Transmission : le levier le plus sous-exploité',
        body: "Versements effectués avant 70 ans : abattement de 152 500 € par bénéficiaire + taxation 20% (31,25% au-delà de 852 500 €). Après 70 ans : abattement global de 30 500 €, mais les plus-values sont exonérées. Bien structurée, l'AV permet de transmettre 500k€ à 1M€ sans droits.",
      },
      {
        title: 'Choisir le bon contrat',
        body: "Tous les contrats ne se valent pas. Les écarts sur les frais d'entrée (0 à 5%), les frais de gestion UC (0,5% à 1,2%), la qualité du fonds euros et l'univers d'investissement peuvent représenter plusieurs points de rendement sur 20 ans.",
      },
    ],
    chiffresCles: [
      { label: 'Pivot fiscal', value: '8 ans' },
      { label: 'Abattement annuel', value: '4 600 / 9 200 €' },
      { label: 'Abattement transmission', value: '152 500 € / bénéf.' },
      { label: 'PS', value: '17,2%' },
    ],
    piegesClassiques: [
      "Rester sur un contrat bancaire grand public aux frais élevés",
      "Laisser 100% en fonds euros 'par défaut' pendant 15 ans",
      "Désigner 'mes héritiers' au lieu de nommer les bénéficiaires précisément",
      "Verser après 70 ans sans vérifier la logique transmission/rendement",
    ],
    faq: [
      {
        q: 'Combien de contrats faut-il ouvrir ?',
        a: "Un contrat principal suffit à la plupart des profils. Plusieurs contrats peuvent se justifier pour séparer des objectifs (épargne / transmission) ou diversifier les assureurs au-delà de 200k€.",
      },
      {
        q: 'Faut-il souscrire avant 70 ans à tout prix ?',
        a: "Oui pour maximiser la transmission, mais pas au point de verser dans un mauvais contrat. La qualité du véhicule prime toujours sur le calendrier.",
      },
    ],
  },
  {
    slug: 'scpi',
    heroIntro:
      "Les SCPI (Sociétés Civiles de Placement Immobilier) permettent d'investir dans un parc immobilier professionnel sans en supporter la gestion. Mutualisation, accessibilité (ticket dès quelques milliers d'euros), rendement historique autour de 4 à 6% : une brique patrimoniale robuste, à condition de choisir avec méthode.",
    pourQui: [
      "Épargnants cherchant des revenus réguliers",
      "Investisseurs voulant diversifier hors résidentiel classique",
      'Profils refusant la contrainte de la gestion locative',
      'Stratégies de nue-propriété ou achat à crédit',
    ],
    sections: [
      {
        title: 'Les trois grandes familles de SCPI',
        body: "SCPI de rendement (bureaux, commerces, santé, logistique) : priorité au revenu. SCPI fiscales (Malraux, déficit foncier, Pinel) : priorité à la réduction d'impôt. SCPI de plus-value : patience et capitalisation. La méthode commence par savoir ce qu'on cherche avant d'acheter.",
      },
      {
        title: 'SCPI européennes : la révolution fiscale discrète',
        body: "Les SCPI investies hors de France (Allemagne, Pays-Bas, Espagne…) bénéficient d'un traitement fiscal souvent plus favorable : pas de prélèvements sociaux sur la quote-part étrangère, et crédit d'impôt ou exonération selon les conventions. Pour un résident français à TMI élevée, c'est un gain net de 17,2% sur les revenus concernés.",
      },
      {
        title: 'Acheter en direct, en démembrement, ou à crédit',
        body: "Trois logiques différentes : en direct pour des revenus immédiats ; en nue-propriété temporaire (-30 à -40% sur le prix) pour préparer un complément de retraite sans fiscalité pendant la durée du démembrement ; à crédit pour activer l'effet de levier et déduire les intérêts.",
      },
      {
        title: 'Les frais : le point de vigilance absolu',
        body: "Les frais de souscription (8 à 12%) ne se récupèrent qu'après plusieurs années de distribution. Une SCPI détenue moins de 8 à 10 ans est très rarement rentable. La liquidité est également imparfaite : prévoir un horizon long.",
      },
      {
        title: 'Intégration dans une assurance-vie',
        body: "Certaines SCPI sont accessibles via des contrats d'AV : la fiscalité devient celle de l'AV (bien meilleure à terme), mais on abandonne souvent une partie du rendement et la souplesse d'achat à crédit. Un arbitrage à faire au cas par cas.",
      },
    ],
    chiffresCles: [
      { label: 'Rendement moyen', value: '~4 à 6%' },
      { label: 'Ticket d\'entrée', value: '~1 000 €' },
      { label: 'Frais d\'entrée', value: '8 à 12%' },
      { label: 'Horizon minimum', value: '8 à 10 ans' },
    ],
    piegesClassiques: [
      "Acheter sur la seule base du rendement brut affiché",
      "Ignorer la collecte récente (trop de liquidités = dilution)",
      "Sous-estimer les frais de souscription sur un horizon court",
      "Concentrer sur une seule SCPI ou un seul secteur",
    ],
    faq: [
      {
        q: 'Quelle est la fiscalité des revenus SCPI ?',
        a: "Les revenus sont imposés comme des revenus fonciers : TMI + 17,2% de prélèvements sociaux. C'est ce qui rend les SCPI européennes et les stratégies de démembrement particulièrement pertinentes.",
      },
      {
        q: 'Peut-on acheter des SCPI à crédit ?',
        a: "Oui, et c'est souvent pertinent : les intérêts d'emprunt sont déductibles des revenus fonciers, ce qui réduit la fiscalité. L'effet de levier peut transformer le rendement net.",
      },
    ],
  },
  {
    slug: 'defiscalisation',
    heroIntro:
      "Défiscaliser n'est jamais une fin en soi. Le bon réflexe : chercher d'abord un investissement économiquement cohérent, puis identifier le dispositif fiscal qui le rend plus efficace. L'inverse conduit à acheter des produits mauvais économiquement pour quelques milliers d'euros d'économie d'impôt.",
    pourQui: [
      'Contribuables à TMI 30% et plus',
      'Résidents fiscaux français hors régimes spéciaux',
      'Profils avec un horizon d\'investissement clair',
    ],
    sections: [
      {
        title: 'La règle d\'or : économie d\'impôt ≠ rentabilité',
        body: "Une réduction d'impôt de 18% sur un investissement qui rend -25% n'est pas un bon investissement. La question à se poser n'est jamais 'combien vais-je économiser ?', mais 'l'actif sous-jacent tient-il la route sans l'avantage fiscal ?'.",
      },
      {
        title: 'Les dispositifs qui fonctionnent réellement',
        body: "Par ordre de robustesse pour la plupart des profils à TMI élevée :",
        list: [
          "PER, outil de déduction universel, flexible, sortie libre depuis 2019",
          "Déficit foncier, très puissant pour les détenteurs d'immobilier ancien à rénover",
          "Girardin industriel, réduction d'impôt one-shot, à manier avec une contrepartie solide",
          "FCPI/FIP, 18 à 25% de réduction, mais performance historique décevante en moyenne",
          "Malraux / Monuments Historiques, pour patrimoines importants, sur des biens d'exception",
        ],
      },
      {
        title: 'Le plafond global des niches fiscales',
        body: "10 000 € par an pour la plupart des dispositifs (18 000 € avec Girardin / Sofica / investissement outre-mer). Ce plafond se sature vite pour les foyers actifs, la priorisation devient stratégique.",
      },
      {
        title: 'Dispositifs hors plafond : les bons à connaître',
        body: "PER, Loi Malraux, déficit foncier, Monuments Historiques : ces leviers ne comptent pas dans le plafond global des 10 000 €. Pour un foyer déjà saturé, ce sont les vrais leviers restants.",
      },
    ],
    chiffresCles: [
      { label: 'Plafond global', value: '10 000 €/an' },
      { label: 'Plafond DOM', value: '18 000 €/an' },
      { label: 'Hors plafond', value: 'PER, Malraux, DF' },
      { label: 'TMI rentable dès', value: '30%' },
    ],
    piegesClassiques: [
      "Investir en Pinel à la hâte en décembre pour réduire son impôt",
      "Acheter des FCPI sans vérifier la qualité du gérant et les frais",
      "Souscrire du Girardin sans analyser la solvabilité du monteur",
      "Cumuler sans stratégie et saturer ses plafonds sur des produits médiocres",
    ],
    faq: [
      {
        q: 'Quel est le dispositif le plus rentable ?',
        a: "Il n'y en a pas un seul, ça dépend de votre TMI, votre horizon, votre patrimoine existant, votre tolérance au risque. Le PER est le plus universellement pertinent au-dessus de 30% de TMI.",
      },
      {
        q: 'Faut-il défiscaliser chaque année ?',
        a: "Non. Certaines années, rien ne vaut le coup. Forcer une défiscalisation médiocre pour 'faire quelque chose' est souvent la pire décision.",
      },
    ],
  },
  {
    slug: 'transmission',
    heroIntro:
      "Organiser la transmission, ce n'est pas parier sur sa mort, c'est protéger sa famille du chaos administratif et fiscal qui suit le décès. Bien anticipée, elle permet de diviser par 2 à 4 les droits qui seront dus par vos proches.",
    pourQui: [
      'Parents et grands-parents souhaitant aider leurs descendants',
      'Couples voulant protéger le survivant',
      'Chefs d\'entreprise préparant la transmission de leur société',
      'Profils avec patrimoine > 500k€',
    ],
    sections: [
      {
        title: 'Les abattements : le premier levier gratuit',
        body: "Tous les 15 ans, chaque parent peut donner à chaque enfant 100 000 € en franchise de droits. Pour un couple avec deux enfants, cela représente 400 000 € transmissibles sans impôt, renouvelables. Le 'compteur' démarre à la première donation, d'où l'intérêt de ne pas attendre.",
        list: [
          "Parent → enfant : 100 000 €",
          "Grand-parent → petit-enfant : 31 865 €",
          "Entre époux : 80 724 €",
          "Don familial de somme d'argent (moins de 80 ans) : 31 865 € supplémentaires",
        ],
      },
      {
        title: 'Le démembrement : offrir la nue-propriété',
        body: "Donner la nue-propriété en gardant l'usufruit = transmettre un actif à valeur décotée selon l'âge, tout en conservant les revenus et la jouissance. Au décès, l'usufruit rejoint la nue-propriété sans droits supplémentaires. Particulièrement puissant sur l'immobilier et les titres de société.",
      },
      {
        title: 'L\'assurance-vie : le contre-pouvoir successoral',
        body: "L'assurance-vie sort de la succession. Avec 152 500 € d'abattement par bénéficiaire pour les versements avant 70 ans, c'est l'outil le plus souple pour gratifier des personnes 'hors cadre' (enfant d'un premier lit, compagne non mariée, filleul) ou équilibrer une transmission.",
      },
      {
        title: 'Le pacte Dutreil : l\'outil des chefs d\'entreprise',
        body: "Pour une transmission d'entreprise, le pacte Dutreil offre une exonération de 75% sur la valeur transmise. Combiné à une donation en nue-propriété, il permet de transmettre une société valorisée 2M€ en ne payant des droits que sur 500k€ environ (valeurs indicatives, à modéliser précisément).",
      },
      {
        title: 'La donation-partage : sécuriser l\'équité',
        body: "Elle fige la valeur des biens au jour de la donation, ce qui évite que l'héritier ayant reçu un bien qui prend de la valeur soit 'déséquilibré' au moment du décès par rapport à ses frères et sœurs. Un outil d'équité familiale majeur.",
      },
    ],
    chiffresCles: [
      { label: 'Abattement parent→enfant', value: '100 000 € / 15 ans' },
      { label: 'Abattement AV', value: '152 500 € / bénéf.' },
      { label: 'Exonération Dutreil', value: '75%' },
      { label: 'Décote nue-propriété 60 ans', value: '-50%' },
    ],
    piegesClassiques: [
      "Attendre 'plus tard' pour faire la première donation, horizon 15 ans perdu",
      "Oublier de mettre à jour ses clauses bénéficiaires après un changement de vie",
      "Confondre donation et prêt familial (requalification fiscale)",
      "Transmettre sans préparer les héritiers à la gestion du patrimoine reçu",
    ],
    faq: [
      {
        q: 'À partir de quel âge faut-il commencer à transmettre ?',
        a: "Dès que votre patrimoine est constitué et que votre propre sécurité est assurée. L'abattement se renouvelle tous les 15 ans : commencer à 55 ans permet deux cycles. À 70 ans, on en perd un.",
      },
      {
        q: 'Peut-on garder le contrôle après une donation ?',
        a: "Oui, via le démembrement (conservation de l'usufruit) ou la clause de droit de retour. On transmet la propriété juridique sans perdre l'usage ni les revenus.",
      },
    ],
  },
  {
    slug: 'immobilier-lmnp-demembrement',
    heroIntro:
      "Au-delà de la résidence principale, l'immobilier peut jouer plusieurs rôles très différents dans un patrimoine : revenus locatifs, levier de crédit, transmission, défiscalisation. Trois structurations méritent une attention particulière : le LMNP, la nue-propriété temporaire et le démembrement de SCPI.",
    pourQui: [
      'Investisseurs recherchant des revenus peu fiscalisés',
      'Profils à TMI élevée refusant le régime foncier classique',
      'Stratégies de préparation de retraite sur 10-15 ans',
      'Optimisation d\'un patrimoine existant',
    ],
    sections: [
      {
        title: 'LMNP : la quasi-défiscalisation des loyers',
        body: "Le statut Loueur Meublé Non Professionnel permet, en régime réel, d'amortir le bien et le mobilier. En pratique, les amortissements effacent le résultat imposable pendant 15 à 25 ans : les loyers tombent quasiment nets d'impôt. Un des rares dispositifs où l'avantage fiscal s'applique sans plafond de niches.",
      },
      {
        title: 'La nue-propriété temporaire',
        body: "Acheter la nue-propriété d'un bien pour 15 à 20 ans = payer 55 à 65% du prix. Pendant la durée, l'usufruitier (souvent un bailleur institutionnel) perçoit les loyers et assume l'entretien. Vous ne percevez rien, ne déclarez rien, ne payez pas d'IFI sur cette fraction. À terme, vous récupérez la pleine propriété sans fiscalité.",
        list: [
          "Prix d'acquisition décoté (~65% de la pleine propriété)",
          "Aucun revenu imposable pendant la durée",
          "Pas d'IFI sur la fraction démembrée",
          "Reconstitution pleine propriété en franchise d'impôt",
        ],
      },
      {
        title: 'Démembrement de SCPI',
        body: "Même logique appliquée aux SCPI : acheter la nue-propriété de parts sur 5 à 10 ans pour 60 à 80% de leur valeur. Idéal pour préparer un complément de revenus qui démarrera pile à la retraite, sans fiscalité pendant la phase de démembrement.",
      },
      {
        title: 'Immobilier locatif nu : le choix classique à connaître',
        body: "En régime réel, les travaux génèrent du déficit foncier imputable sur le revenu global (dans la limite de 10 700 €/an), outil puissant pour un investisseur à TMI élevée qui rénove. Mais la location nue au régime micro-foncier reste fiscalement lourde et sans levier particulier.",
      },
    ],
    chiffresCles: [
      { label: 'LMNP : fiscalité pendant 15-25 ans', value: '~0%' },
      { label: 'Nue-propriété : décote', value: '30 à 45%' },
      { label: 'Déficit foncier : plafond global', value: '10 700 €/an' },
      { label: 'IFI sur nue-propriété', value: '0' },
    ],
    piegesClassiques: [
      "Confondre LMNP classique et LMNP résidence services (contraintes très différentes)",
      "Acheter une nue-propriété sans analyser la qualité du bailleur usufruitier",
      "Espérer des loyers garantis qui deviennent illusoires en période de vacance",
      "Sous-estimer les frais de gestion sur les résidences meublées",
    ],
    faq: [
      {
        q: 'LMNP ou SCPI européennes, que choisir ?',
        a: "Les deux sont complémentaires. LMNP = maîtrise locale, fiscalité ultra-faible, mais concentration. SCPI européennes = diversification et zéro gestion, mais moindre contrôle. L'arbitrage dépend de votre appétence à gérer.",
      },
    ],
  },
  {
    slug: 'pea-bourse',
    heroIntro:
      "Le PEA reste, pour l'investissement en actions à long terme, l'enveloppe la plus efficace du droit fiscal français. Plafond de 150 000 €, exonération des plus-values après 5 ans (hors prélèvements sociaux), univers européen profond : un outil que tout profil dynamique devrait maîtriser.",
    pourQui: [
      'Investisseurs avec un horizon de 5 ans et plus',
      'Profils acceptant la volatilité en échange de performance',
      'Épargnants déjà équipés en AV et cherchant un relais actions',
      'Couples : PEA + PEA du conjoint = 300 000 € de plafond',
    ],
    sections: [
      {
        title: 'La règle simple : patience contre fiscalité',
        body: "Avant 5 ans, tout retrait clôture le plan et déclenche le PFU (30%). Après 5 ans, les gains sont exonérés d'impôt sur le revenu, seuls les 17,2% de prélèvements sociaux restent dus. Le plan devient alors un instrument de retrait souple à fiscalité dégressive réelle.",
      },
      {
        title: 'PEA classique + PEA-PME : le cumul gagnant',
        body: "Plafonds cumulables : 150 000 € sur le PEA et 225 000 € sur le PEA-PME (dans la limite globale de 225 000 €). Le PEA-PME est un excellent complément pour s'exposer aux petites et moyennes capitalisations européennes, avec la même fiscalité avantageuse.",
      },
      {
        title: 'ETF : le véhicule préféré pour le long terme',
        body: "Les ETF éligibles PEA (via la technique de réplication synthétique) permettent de s'exposer à des indices mondiaux tout en restant dans l'enveloppe française. MSCI World, S&P 500, Nasdaq : on peut construire un portefeuille diversifié à frais ultra-réduits (0,20 à 0,35% par an).",
      },
      {
        title: 'Gestion active ou passive : le vrai débat',
        body: "Sur 10 ans, moins de 20% des fonds actifs battent leur indice de référence après frais. Pour la majorité des profils patrimoniaux, une allocation cœur en ETF indiciels, éventuellement complétée de poches actives spécifiques, est le meilleur compromis.",
      },
      {
        title: 'Arbitrages et dividendes',
        body: "Les arbitrages internes au PEA ne sont jamais imposables, c'est un avantage massif pour piloter l'allocation dans le temps. Les dividendes encaissés à l'intérieur du plan ne sont pas taxés tant qu'ils ne sortent pas.",
      },
    ],
    chiffresCles: [
      { label: 'Plafond PEA', value: '150 000 €' },
      { label: 'Plafond PEA-PME', value: '225 000 €' },
      { label: 'Pivot fiscal', value: '5 ans' },
      { label: 'Après 5 ans', value: '17,2% PS seuls' },
    ],
    piegesClassiques: [
      "Clôturer avant 5 ans sur coup de tête et perdre tout l'avantage",
      "Laisser le PEA en cash pendant des années 'en attendant le bon moment'",
      "Payer des frais de courtage élevés chez sa banque de détail",
      "Concentrer sur 3-4 titres français au lieu de diversifier",
    ],
    faq: [
      {
        q: 'PEA ou assurance-vie pour investir en actions ?',
        a: "Les deux ont leur place. PEA = fiscalité imbattable après 5 ans, univers limité à l'Europe (sauf ETF synthétiques). AV = flexibilité, transmission, univers mondial direct. L'idéal est de les combiner.",
      },
    ],
  },
  {
    slug: 'epargne-salariale-dirigeant',
    heroIntro:
      "Les dirigeants et TNS disposent d'outils d'épargne retraite et salariale puissants, souvent mal utilisés. Bien structurés, ils permettent de se verser une rémunération différée, défiscalisée, avec abondement entreprise, le tout de manière totalement légale.",
    pourQui: [
      'Dirigeants assimilés salariés (président SAS, gérant minoritaire SARL)',
      'TNS (gérant majoritaire, EI, profession libérale)',
      'Particuliers salariés ou dirigeants en entreprise',
      'Salariés avec abondement employeur',
    ],
    sections: [
      {
        title: 'PEE, PER-COL : la puissance de l\'abondement',
        body: "Quand l'entreprise abonde un PEE, chaque euro versé par le salarié/dirigeant peut être triplé (plafond 300% du versement, dans la limite de 8% du PASS). Cet abondement échappe à l'impôt sur le revenu et aux cotisations sociales patronales classiques, c'est l'un des outils à ROI fiscal le plus élevé.",
      },
      {
        title: 'Intéressement & participation',
        body: "Formules obligatoires (participation) ou facultatives (intéressement) qui transforment du résultat entreprise en rémunération différée pour les salariés, avec une fiscalité de faveur si placée sur PEE/PERCOL. Pour un dirigeant-actionnaire, cadrer intelligemment ces formules permet de doubler l'effet patrimoine.",
      },
      {
        title: 'Loi Madelin (encore pertinente)',
        body: "Bien que le PER ait absorbé une partie du Madelin, les anciens contrats existants restent pertinents. Pour un TNS, la déductibilité des cotisations Madelin santé/prévoyance/retraite reste un levier concret de rémunération défiscalisée.",
      },
      {
        title: 'Article 83 / PER Obligatoire : la retraite à frais partagés',
        body: "Contrat à adhésion obligatoire pour une catégorie de salariés. Les cotisations entreprise sont déductibles, non imposables pour le salarié, et non chargées socialement dans certaines limites. Pour un dirigeant bien conseillé, c'est un vrai multiplicateur sur la durée.",
      },
      {
        title: 'Combiner sans doublon',
        body: "PER individuel + PERCOL + PER Obligatoire peuvent coexister, chacun avec son plafond. Une stratégie bien pensée peut ainsi cumuler 30 à 50k€/an de versements déductibles ou non imposables.",
      },
    ],
    chiffresCles: [
      { label: 'Abondement PEE max', value: '300% du versement' },
      { label: 'Plafond abondement', value: '8% du PASS' },
      { label: 'PASS 2025', value: '47 100 €' },
      { label: 'Déductibilité Madelin', value: 'Jusqu\'à ~76k€' },
    ],
    piegesClassiques: [
      "Ne pas mettre en place un PEE dans une TPE parce que 'ce serait compliqué' (c'est simple)",
      "Abonder insuffisamment et laisser du ROI fiscal sur la table",
      "Oublier de rattacher le conjoint collaborateur au dispositif",
      "Mélanger épargne court terme et retraite dans une seule enveloppe",
    ],
    faq: [
      {
        q: 'Un dirigeant sans salariés peut-il avoir un PEE ?',
        a: "Oui, à condition d'avoir au moins un salarié (même à temps partiel). Le dirigeant assimilé salarié ou TNS peut en bénéficier au même titre.",
      },
    ],
  },
  {
    slug: 'private-equity-non-cote',
    heroIntro:
      "Le non coté offre des rendements historiquement supérieurs aux marchés cotés, avec une corrélation plus faible. Mais la dispersion de performance y est immense : les meilleurs fonds font x2 à x3, les pires détruisent du capital. Sélection et diversification sont tout.",
    pourQui: [
      'Patrimoines > 300k€ pouvant bloquer une poche 8-10 ans',
      'Profils recherchant décorrélation et performance',
      'Contribuables à TMI élevée cherchant des véhicules fiscaux (FCPI/FIP/FCPR)',
      'Investisseurs acceptant une liquidité très limitée',
    ],
    sections: [
      {
        title: 'Les familles de véhicules',
        body: "FCPR et FPCI (capital-investissement classique, professionnels éligibles), FCPI/FIP (fiscaux avec 18-25% de réduction d'impôt), fonds Evergreen (plus liquides), clubs deal direct. Chaque structure répond à un objectif différent, fiscal, rendement, ou accès.",
      },
      {
        title: 'La dispersion : le risque principal',
        body: "Sur 20 ans, l'écart entre quartile supérieur et quartile inférieur du PE dépasse 15 points de TRI annuel. Mettre un ticket sur 'un' fonds non coté est spéculatif. La vraie méthode consiste à construire un programme sur plusieurs millésimes et plusieurs stratégies.",
      },
      {
        title: 'FCPI/FIP : la réduction d\'impôt à relativiser',
        body: "18% de réduction immédiate, séduisant sur le papier. Mais la performance moyenne nette des FCPI est historiquement décevante, la réduction d'impôt compense souvent juste la sous-performance. À réserver à des gérants sélectionnés, pas acheter en catalogue bancaire.",
      },
      {
        title: 'FCPR et FPCI fiscalement transparents',
        body: "Après 5 ans, les plus-values de certains FCPR/FPCI bénéficient d'une exonération d'IR (hors prélèvements sociaux), équivalente à la fiscalité PEA. Pour un investisseur patrimonial qui vise vraiment la performance, c'est souvent bien plus efficace qu'un FCPI.",
      },
      {
        title: 'Accéder au non coté via son AV ou son PER',
        body: "Depuis la loi industrie verte (2023), l'accès au non coté via les contrats d'AV et PER est facilité. C'est une voie à étudier : on combine l'enveloppe fiscale et la classe d'actifs, avec une liquidité intermédiée.",
      },
    ],
    chiffresCles: [
      { label: 'Réduction FCPI/FIP', value: '18% (25% LDF)' },
      { label: 'Horizon minimum', value: '8 à 10 ans' },
      { label: 'TRI historique PE top quartile', value: '~12 à 18%' },
      { label: 'Part du portefeuille recommandée', value: '5 à 15%' },
    ],
    piegesClassiques: [
      "Concentrer sur un seul fonds, un seul millésime, un seul segment",
      "Sous-estimer la J-curve et paniquer sur les premières années de valorisation négative",
      "Prendre la fiscalité comme argument principal sans regarder la qualité du gérant",
      "Négliger les frais (les frais du PE peuvent atteindre 3 à 5% par an tout compris)",
    ],
    faq: [
      {
        q: 'Quelle part du patrimoine peut aller en non coté ?',
        a: "Pour un patrimoine liquide constitué, une fourchette de 5 à 15% est raisonnable. En-dessous de 300-500k€ de patrimoine financier, il est souvent prématuré de s'y exposer.",
      },
    ],
  },
  {
    slug: 'credit-strategie-patrimoniale',
    heroIntro:
      "Un crédit bien structuré n'est pas une charge, c'est un actif. Effet de levier immobilier, crédit lombard, prêt in fine : utilisé avec méthode, le crédit permet de construire un patrimoine bien supérieur à ce que l'épargne seule permettrait.",
    pourQui: [
      'Investisseurs immobiliers recherchant l\'effet de levier',
      'Dirigeants avec une forte capacité d\'emprunt',
      'Patrimoines financiers > 300k€ (accès au lombard)',
      'Profils voulant optimiser la fiscalité foncière',
    ],
    sections: [
      {
        title: 'L\'effet de levier immobilier',
        body: "Acheter 100 à 110% d'un bien avec 10-30% d'apport, c'est démultiplier le patrimoine terminal. Sur 20 ans, un immobilier acheté avec 20% d'apport et autofinancé par les loyers peut se traduire par un patrimoine libre d'hypothèque 4 à 5 fois supérieur à l'apport initial, en valeur nominale, avant fiscalité.",
      },
      {
        title: 'Le crédit lombard : puissant et souvent mal compris',
        body: "Un crédit adossé à un portefeuille financier (AV, compte-titres, contrat Luxembourg). Vous empruntez 50 à 70% de la valeur du portefeuille sans le liquider. Idéal pour saisir une opportunité sans déclencher de fiscalité, ou pour investir en immobilier sans mobiliser son épargne. Attention : le portefeuille doit absorber sans drame un appel de marge.",
      },
      {
        title: 'Prêt in fine : le bon choix pour l\'immobilier locatif à fort levier',
        body: "On ne rembourse que les intérêts pendant la durée, le capital étant remboursé à l'échéance (souvent via une assurance-vie adossée). Intérêts plus élevés qu'en amortissable, mais déductibles des revenus fonciers, le produit net peut être très favorable à TMI élevée.",
      },
      {
        title: 'Taux fixe, variable, mixte : lire au-delà du TAEG',
        body: "Le TAEG seul ne suffit pas. Les vraies questions : durée, modularité, flexibilité de remboursement anticipé (IRA plafonnées ?), portabilité, assurance emprunteur. Sur 20 ans, une bonne négociation globale vaut souvent 30 à 60k€.",
      },
      {
        title: 'Endettement et capacité : aller au-delà du 35%',
        body: "La règle HCSF des 35% est un plafond théorique. Les profils patrimoniaux peuvent obtenir au-delà via la dérogation 20% accordée aux banques, ou via des structures dédiées (banque privée, crédit lombard, montages patrimoniaux). Un conseil averti fait parfois gagner 200 à 500k€ de capacité.",
      },
    ],
    chiffresCles: [
      { label: 'Taux max endettement', value: '35% (+dérogation 20%)' },
      { label: 'Lombard : quotité usuelle', value: '50 à 70%' },
      { label: 'In fine : intérêts déductibles', value: '100%' },
      { label: 'Coût d\'assurance emprunteur', value: '0,10 à 0,50%/an' },
    ],
    piegesClassiques: [
      "S'endetter au maximum sans coussin de sécurité en cas d'aléa",
      "Prendre l'assurance emprunteur de la banque sans comparer (différence 5 à 15k€)",
      "Choisir un in fine sans stratégie claire de constitution du capital de remboursement",
      "Sous-estimer les appels de marge sur un crédit lombard en cas de correction",
    ],
    faq: [
      {
        q: 'Faut-il rembourser par anticipation si on a de la trésorerie ?',
        a: "Pas toujours. Tant que le taux du crédit est inférieur au rendement net attendu de l'investissement, conserver le crédit et investir la trésorerie est plus rentable. Le calcul doit intégrer la fiscalité de chaque côté.",
      },
    ],
  },
];
