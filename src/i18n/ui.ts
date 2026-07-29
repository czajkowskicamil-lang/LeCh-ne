export const languages = {
  fr: 'Français',
  en: 'English',
} as const;

export const defaultLang = 'fr';
export type Lang = keyof typeof languages;

/**
 * Chemins FR (canoniques, sans préfixe) qui ont déjà une version anglaise `/en/…`.
 * On y ajoute chaque page au fur et à mesure de la traduction.
 * Sert au bouton FR/EN : il ne propose l'anglais que sur les pages traduites,
 * pour ne jamais renvoyer vers une page inexistante (404) pendant le rollout.
 */
export const translatedRoutes = new Set<string>([
  '/',
  '/contact',
  '/manifeste',
  '/parcours',
  '/avis',
  '/newsletter',
  '/newsletter-confirmee',
  '/questions-frequentes',
  '/suisse-france',
  '/observatoire',
  '/confidentialite',
  '/mentions-legales',
  '/conseiller-gestion-patrimoine-montpellier',
  '/calculatrice-rentabilite-credit',
  '/expertise',
  '/expertise/plan-epargne-retraite',
  '/expertise/assurance-vie',
  '/expertise/scpi',
  '/expertise/defiscalisation',
  '/expertise/transmission',
  '/expertise/immobilier-lmnp-demembrement',
  '/expertise/pea-bourse',
  '/expertise/epargne-salariale-dirigeant',
  '/expertise/private-equity-non-cote',
  '/expertise/credit-strategie-patrimoniale',
  '/expertise/lmnp-sportif-haut-niveau',
  '/expertise/placement-sportif-haut-niveau',
  '/outils',
  '/outils/diagnostic-patrimonial',
  '/outils/etude-patrimoniale',
  '/outils/etude-patrimoniale/merci',
  '/outils/apres-carriere',
  '/outils/liberte-financiere',
  '/outils/simulateur-ptz',
  '/outils/capacite-emprunt',
  '/outils/droits-succession',
  '/outils/plus-value-immobiliere',
  '/outils/economie-impot-per',
  '/outils/frais-de-notaire',
  '/outils/interets-composes',
  '/outils/lmnp',
  '/outils/louer-ou-acheter',
  // '/outils/diagnostic-patrimonial' : coquille traduite mais moteur (lib/diagnostic) encore FR — à finaliser
]);

export function isTranslated(basePath: string): boolean {
  // Astro peut fournir le chemin avec un slash final en build (/parcours/).
  // On normalise pour matcher le registre (qui n'a pas de slash final).
  const normalized = basePath !== '/' && basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return translatedRoutes.has(normalized);
}

/**
 * Dictionnaire de traduction de l'interface.
 * FR = référence (source de vérité), EN = traduction validée par Camil.
 * Repli automatique sur FR si une clé manque en EN (voir useTranslations).
 *
 * Le nom de marque « Le Chêne Patrimonial » et les mentions réglementaires
 * (ORIAS, RCS…) ne se traduisent jamais.
 */
export const ui = {
  fr: {
    // Navigation
    'nav.parcours': 'Parcours',
    'nav.expertise': 'Expertise',
    'nav.opportunites': 'Opportunités',
    'nav.cas': 'Cas pratiques',
    'nav.observatoire': 'Observatoire',
    'nav.magazine': 'Magazine',
    'nav.outils': 'Outils',
    'nav.avis': 'Avis clients',
    'nav.contact': 'Contact',
    'nav.manifeste': 'Manifeste',
    'nav.lettre': 'La Lettre du Chêne',
    'nav.avisShort': 'Avis',
    'nav.rdv': 'Prendre rendez-vous',
    'nav.menu': 'Menu',
    'nav.fermer': 'Fermer',
    'nav.toolBadge': 'Outil',
    'nav.ariaMenu': 'Ouvrir le menu',
    'nav.ariaAvis': 'Avis clients',

    // Hero
    'hero.eyebrow': 'Conseil en gestion de patrimoine · Indépendant',
    'hero.title1': 'Faire fructifier',
    'hero.title2': 'ce qui compte.',
    'hero.subLead': "J'accompagne",
    'hero.subBold': 'dirigeants, professions libérales, cadres et sportifs',
    'hero.subTail': "dans les décisions qui engagent leur patrimoine, avec pour seul horizon le temps long.",
    'hero.cta1': 'Faire mon diagnostic gratuit',
    'hero.cta2': 'Planifier un rendez-vous découverte',
    'hero.trust.cabinetLabel': 'Cabinet',
    'hero.trust.cabinetValue': 'Indépendant',
    'hero.trust.registrationLabel': 'Immatriculation',
    'hero.trust.presenceLabel': 'Présence',
    'hero.scroll': 'Découvrir',

    // Footer
    'footer.eyebrow': 'Cabinet privé indépendant',
    'footer.title1': 'Faire fructifier',
    'footer.title2': 'ce qui compte.',
    'footer.cta': 'Échanger 30 minutes',
    'footer.nl.eyebrow': 'La Lettre du Chêne',
    'footer.nl.pitch1': 'Une édition par mois.',
    'footer.nl.pitch2': 'Un cas, un chiffre, une actualité.',
    'footer.nl.label': 'Recevoir La Lettre',
    'footer.nl.placeholder': 'votre@email.fr',
    'footer.nl.submit': "M'inscrire",
    'footer.nl.legal': 'Gratuit, sans engagement.',
    'footer.nl.learnMore': 'En savoir plus',
    'footer.nl.sending': 'Envoi…',
    'footer.nl.needEmail': 'Merci de saisir votre email.',
    'footer.nl.success': 'Presque ! Cliquez sur le lien de confirmation qu\'on vient de vous envoyer par email.',
    'footer.nl.errInvalid': 'Cet email ne semble pas valide.',
    'footer.nl.errGeneric': 'Une erreur est survenue. Réessayez ou écrivez à camil.cz@lechenepatrimonial.com.',
    'footer.nl.errNetwork': 'Connexion impossible. Réessayez dans un instant.',
    'footer.tagline': 'Conseil en gestion de patrimoine indépendant.',
    'footer.col.navigate': 'Naviguer',
    'footer.col.resources': 'Ressources',
    'footer.col.specialities': 'Spécialités',
    'footer.col.contact': 'Contact',
    'footer.spec.lmnp': 'LMNP pour sportif',
    'footer.spec.placement': 'Placement du sportif',
    'footer.spec.montpellier': 'CGP à Montpellier',
    'footer.legal.mentions': 'Mentions légales',
    'footer.legal.privacy': 'Confidentialité',

    // Accueil — bandeau partenaires
    'partners.eyebrow': 'Ils nous accompagnent au quotidien',

    // Accueil — ticker éditorial
    'ticker.1': 'Indépendance',
    'ticker.2': 'Méthode',
    'ticker.3': 'Patience',
    'ticker.4': 'Clarté',
    'ticker.5': 'Engagement',

    // Accueil — StoryTeaser
    'story.eyebrow': 'Un parcours atypique',
    'story.title1': "L'athlète devenu",
    'story.title2': 'conseiller.',
    'story.p1a': "Avant le conseil en gestion de patrimoine, j'ai été sportif de compétition. J'y ai appris qu'on ne construit rien de solide dans l'improvisation, et que ",
    'story.p1strong': "tout ce qui dure se prépare longtemps à l'avance.",
    'story.p2': 'Cette exigence, je la garde pour chaque dossier : du travail, des chiffres, et des décisions qui tiennent la route dans le temps.',
    'story.link': 'Lire mon histoire en détail →',
    'story.imgAlt': 'Camil Czajkowski, fondateur du Chêne Patrimonial, en course sous la pluie',
    'story.quoteSmall': '« Le chêne ne plie pas. »',
    'story.quoteBig': 'Il pousse lentement, tient longtemps, et traverse les saisons.',

    // Accueil — DiagnosticTeaser
    'diag.eyebrow': 'Nouveau · Gratuit · 3 minutes',
    'diag.title1': 'Où en est vraiment',
    'diag.title2': 'votre patrimoine ?',
    'diag.body': "Quelques questions suffisent pour obtenir votre Indice de Santé Patrimoniale sur 100 : vos forces, vos angles morts, et un plan d'action sur 12 mois, calibré selon votre statut. C'est confidentiel et sans engagement.",
    'diag.step1': 'Votre score sur 100',
    'diag.step2': 'Analyse personnalisée',
    'diag.step3': 'Rapport PDF offert',
    'diag.cta': 'Faire mon diagnostic gratuit',
    'diag.previewLabel': 'Aperçu · Exemple',
    'diag.solidIndex': 'Indice solide',
    'diag.pillar1': 'Épargne de précaution',
    'diag.pillar2': 'Diversification',
    'diag.pillar3': 'Préparation retraite',

    // Accueil — MethodStrip
    'method.label': 'Notre méthode',
    'method.title1': 'Une méthode claire,',
    'method.title2': 'en quatre temps.',
    'method.intro': "Vous savez à chaque étape où vous en êtes, et ce qui vient ensuite.",
    'method.step1.t': 'Échange',
    'method.step1.d': 'Un premier rendez-vous de 30 minutes, offert et sans engagement, pour cerner votre situation et vos objectifs.',
    'method.step2.t': 'Diagnostic',
    'method.step2.d': 'Une lecture claire et chiffrée de votre patrimoine, de votre fiscalité et de vos angles morts.',
    'method.step3.t': 'Stratégie',
    'method.step3.d': 'Une feuille de route sur-mesure et indépendante, hiérarchisée et réellement actionnable.',
    'method.step4.t': 'Accompagnement',
    'method.step4.d': 'Un suivi dans la durée, ajusté au fil de votre vie et des évolutions réglementaires.',
    'method.cta': 'Réserver mon premier échange',

    // Accueil — CheneEnChiffres
    'figures.eyebrow': 'Le Chêne en chiffres',
    'figures.title': 'Quatre repères qui parlent.',
    'figures.d1': 'Rendez-vous avant tout engagement. Cadrage de la situation, puis restitution de la stratégie.',
    'figures.d2': 'Indépendance. Aucun réseau bancaire derrière les recommandations.',
    'figures.d3': 'Premier échange offert, en visio ou au cabinet, sans engagement.',
    'figures.d4': 'Commission cachée. Honoraires de conseil ou rétrocession partenaire, vous savez avant chaque opération qui me rémunère, comment et combien.',
    'figures.legal': 'Cabinet immatriculé ORIAS n° 25 00 00 16, RCS Montpellier 929 887 594. Présent à Montpellier, accompagnement partout en France.',

    // Accueil — ProfilEntries
    'profils.label': 'Pour qui',
    'profils.title1': 'Quatre profils,',
    'profils.title2': 'une même exigence.',
    'profils.intro': 'Le cabinet accompagne quatre trajectoires patrimoniales. Chacune appelle ses propres leviers, jamais les mêmes priorités.',
    'profils.leviers': 'Leviers',
    'profils.rowCta': 'Premier échange offert',
    'profils.bottomCta': "Voir les dix domaines d'expertise",
    'profils.1.title': 'Sportifs professionnels',
    'profils.1.desc': "Huit à quinze ans pour bâtir un patrimoine qui devra tenir soixante. Carrière dense, fiscalité parfois internationale, fin de carrière qui arrive tôt. La méthode se construit pendant, pas après. Je l'ai vécu, je la pilote pour vous.",
    'profils.2.title': 'Dirigeants & cadres',
    'profils.2.desc': "Revenus solides, enveloppes accumulées sans cohérence d'ensemble. Plusieurs contrats, plusieurs logiques, qui ne se parlent pas. Ce qui n'est pas mis en cohérence vous coûte chaque année, en fiscalité comme en performance.",
    'profils.3.title': 'Entrepreneurs',
    'profils.3.desc': "Votre entreprise est votre actif principal, et c'est précisément là le risque. Cession, holding, Pacte Dutreil : ces leviers se préparent deux ans en amont, pas deux mois. Modélisation avant signature, jamais l'inverse.",
    'profils.4.title': 'Particuliers',
    'profils.4.desc': "Vous gagnez, vous épargnez, vous payez vos impôts. Personne ne vous a appris à articuler les trois. Bâtir un patrimoine cohérent ne demande pas d'être déjà fortuné, mais une méthode. Et la méthode commence par savoir précisément où vous en êtes.",
    'exp.assurance-vie': 'Assurance-vie',
    'exp.immobilier': 'Immobilier patrimonial',
    'exp.per': 'Plan Épargne Retraite',
    'exp.transmission-anticipee': 'Transmission anticipée',
    'exp.transmission': 'Transmission',
    'exp.epargne-salariale': 'Épargne salariale & retraite dirigeant',
    'exp.credit': 'Crédit & effet de levier',
    'exp.private-equity': 'Private Equity',
    'exp.scpi': 'SCPI',

    // Accueil — NewsletterTeaser
    'nlt.eyebrow': 'La Lettre du Chêne',
    'nlt.title1': 'Une newsletter',
    'nlt.title2': 'mensuelle.',
    'nlt.body': 'Une publication sobre et chiffrée. Cas concrets, opportunités, études et actualités fiscales décryptées. Pour décider en connaissance de cause, chaque mois dans votre boîte mail.',
    'nlt.menuLabel': 'Au menu des prochaines éditions',
    'nlt.menuBody': 'Stratégies patrimoniales, lecture des marchés, patrimoine du sportif professionnel.',
    'nlt.cta': "Découvrir et m'inscrire",

    // Accueil — OakBand
    'oak.eyebrow': 'La philosophie du Chêne',
    'oak.quote': 'Des racines profondes, une croissance qui traverse',
    'oak.quoteItalic': ' les générations.',
    'oak.body': "C'est ainsi que se construit un patrimoine : lentement, solidement, pensé pour ceux qui viennent après vous.",

    // ExpertiseGrid
    'egrid.intro': 'Chaque thématique est traitée avec la même rigueur : comprendre votre situation, modéliser les scénarios, choisir les enveloppes, piloter dans le temps. Cliquez sur un pilier pour en explorer la logique.',
    'egrid.explore': 'Explorer',

    // Expertise — page détail [slug]
    'exd.breadcrumbHome': 'Accueil',
    'exd.breadcrumbExpertise': 'Expertise',
    'exd.pillar': 'Pilier',
    'exd.pourQui': 'Pour qui ?',
    'exd.sommaire': 'Sommaire',
    'exd.piegesNav': 'Pièges classiques',
    'exd.faqNav': 'Questions fréquentes',
    'exd.piegesEyebrow': 'Pièges classiques à éviter',
    'exd.piegesTitle': 'Ce que je vois, et qui coûte cher.',
    'exd.faqEyebrow': 'Questions fréquentes',
    'exd.faqTitle': 'Ce qu\'on me demande le plus.',
    'exd.prev': '← Pilier précédent',
    'exd.next': 'Pilier suivant →',
    'exd.ctaTitlePre': 'Une question concrète sur',
    'exd.ctaBody': 'Parlons-en directement. Premier échange offert, sans engagement.',

    // CTA (bloc réutilisé sur plusieurs pages)
    'cta.eyebrow': 'Commencer ensemble',
    'cta.title': 'Un patrimoine se construit dans la durée.',
    'cta.body': "Planifions un premier échange de 30 minutes. Sans engagement : une conversation claire sur votre situation, et les priorités qui en découlent.",
    'cta.rdv': 'Prendre rendez-vous',
    'cta.write': 'Écrire un message',
    'cta.orReceivePre': 'Ou recevoir',
    'cta.orReceivePost': 'chaque mois.',

    // Divers
    'common.coverage': 'France entière · en présentiel ou à distance',
    'lang.switchTo': 'English',
    'lang.ariaSwitch': 'Switch to English',
  },

  en: {
    // Navigation
    'nav.parcours': 'About',
    'nav.expertise': 'Expertise',
    'nav.opportunites': 'Opportunities',
    'nav.cas': 'Case studies',
    'nav.observatoire': 'Observatory',
    'nav.magazine': 'Magazine',
    'nav.outils': 'Tools',
    'nav.avis': 'Client reviews',
    'nav.contact': 'Contact',
    'nav.manifeste': 'Manifesto',
    'nav.lettre': 'The Oak Letter',
    'nav.avisShort': 'Reviews',
    'nav.rdv': 'Book a meeting',
    'nav.menu': 'Menu',
    'nav.fermer': 'Close',
    'nav.toolBadge': 'Tool',
    'nav.ariaMenu': 'Open menu',
    'nav.ariaAvis': 'Client reviews',

    // Hero
    'hero.eyebrow': 'Wealth Management Advice · Independent',
    'hero.title1': 'Growing',
    'hero.title2': 'what truly matters.',
    'hero.subLead': 'I guide',
    'hero.subBold': 'company directors, professionals, executives and athletes',
    'hero.subTail': 'through the decisions that shape their wealth, with one sole horizon: the long term.',
    'hero.cta1': 'Take my free assessment',
    'hero.cta2': 'Book an introductory call',
    'hero.trust.cabinetLabel': 'Firm',
    'hero.trust.cabinetValue': 'Independent',
    'hero.trust.registrationLabel': 'Registration',
    'hero.trust.presenceLabel': 'Presence',
    'hero.scroll': 'Discover',

    // Footer
    'footer.eyebrow': 'Independent private firm',
    'footer.title1': 'Growing',
    'footer.title2': 'what truly matters.',
    'footer.cta': 'A 30-minute conversation',
    'footer.nl.eyebrow': 'The Oak Letter',
    'footer.nl.pitch1': 'One edition a month.',
    'footer.nl.pitch2': 'One case, one figure, one insight.',
    'footer.nl.label': 'Receive the Letter',
    'footer.nl.placeholder': 'your@email.com',
    'footer.nl.submit': 'Subscribe',
    'footer.nl.legal': 'Free, no commitment.',
    'footer.nl.learnMore': 'Learn more',
    'footer.nl.sending': 'Sending…',
    'footer.nl.needEmail': 'Please enter your email.',
    'footer.nl.success': "Almost there! Click the confirmation link we've just sent to your inbox.",
    'footer.nl.errInvalid': "This email doesn't look valid.",
    'footer.nl.errGeneric': 'Something went wrong. Please try again or write to camil.cz@lechenepatrimonial.com.',
    'footer.nl.errNetwork': 'Connection failed. Please try again in a moment.',
    'footer.tagline': 'Independent wealth management advice.',
    'footer.col.navigate': 'Navigate',
    'footer.col.resources': 'Resources',
    'footer.col.specialities': 'Specialities',
    'footer.col.contact': 'Contact',
    'footer.spec.lmnp': 'LMNP for athletes',
    'footer.spec.placement': 'Investing for athletes',
    'footer.spec.montpellier': 'Wealth advisor in Montpellier',
    'footer.legal.mentions': 'Legal notice',
    'footer.legal.privacy': 'Privacy',

    // Accueil — bandeau partenaires
    'partners.eyebrow': 'The partners we work with every day',

    // Accueil — ticker éditorial
    'ticker.1': 'Independence',
    'ticker.2': 'Method',
    'ticker.3': 'Patience',
    'ticker.4': 'Clarity',
    'ticker.5': 'Commitment',

    // Accueil — StoryTeaser
    'story.eyebrow': 'An unconventional path',
    'story.title1': 'From athlete',
    'story.title2': 'to advisor.',
    'story.p1a': 'Before wealth management, I was a competitive athlete. I learned there that nothing solid is built on improvisation, and that ',
    'story.p1strong': 'everything that lasts is prepared long in advance.',
    'story.p2': 'I bring that same standard to every case: real work, hard figures, and decisions that hold up over time.',
    'story.link': 'Read my full story →',
    'story.imgAlt': 'Camil Czajkowski, founder of Le Chêne Patrimonial, running in the rain',
    'story.quoteSmall': '"The oak does not bend."',
    'story.quoteBig': 'It grows slowly, stands long, and weathers every season.',

    // Accueil — DiagnosticTeaser
    'diag.eyebrow': 'New · Free · 3 minutes',
    'diag.title1': 'Where does your wealth',
    'diag.title2': 'really stand?',
    'diag.body': 'A few questions are enough to get your Wealth Health Score out of 100: your strengths, your blind spots, and a 12-month action plan tailored to your situation. Confidential, with no commitment.',
    'diag.step1': 'Your score out of 100',
    'diag.step2': 'Personalised analysis',
    'diag.step3': 'Free PDF report',
    'diag.cta': 'Take my free assessment',
    'diag.previewLabel': 'Preview · Example',
    'diag.solidIndex': 'Solid score',
    'diag.pillar1': 'Emergency savings',
    'diag.pillar2': 'Diversification',
    'diag.pillar3': 'Retirement readiness',

    // Accueil — MethodStrip
    'method.label': 'Our method',
    'method.title1': 'A clear method,',
    'method.title2': 'in four steps.',
    'method.intro': 'At every step you know where you stand, and what comes next.',
    'method.step1.t': 'Introduction',
    'method.step1.d': 'A first 30-minute meeting, free and with no commitment, to understand your situation and your goals.',
    'method.step2.t': 'Assessment',
    'method.step2.d': 'A clear, quantified reading of your wealth, your tax position and your blind spots.',
    'method.step3.t': 'Strategy',
    'method.step3.d': 'A bespoke, independent roadmap, prioritised and genuinely actionable.',
    'method.step4.t': 'Ongoing support',
    'method.step4.d': 'Long-term follow-up, adjusted as your life and the regulations evolve.',
    'method.cta': 'Book my first conversation',

    // Accueil — CheneEnChiffres
    'figures.eyebrow': 'Le Chêne in figures',
    'figures.title': 'Four figures that speak for themselves.',
    'figures.d1': 'Meetings before any commitment. First to frame your situation, then to present the strategy.',
    'figures.d2': 'Independence. No banking network behind the recommendations.',
    'figures.d3': 'First conversation offered, by video or at the office, with no commitment.',
    'figures.d4': 'Hidden fees. Advisory fee or partner commission, before every transaction you know who pays me, how and how much.',
    'figures.legal': 'Firm registered with ORIAS no. 25 00 00 16, RCS Montpellier 929 887 594. Based in Montpellier, advising clients throughout France.',

    // Accueil — ProfilEntries
    'profils.label': 'Who for',
    'profils.title1': 'Four profiles,',
    'profils.title2': 'one same standard.',
    'profils.intro': 'The firm advises four wealth trajectories. Each calls for its own levers, never the same priorities.',
    'profils.leviers': 'Levers',
    'profils.rowCta': 'First conversation offered',
    'profils.bottomCta': 'See the ten areas of expertise',
    'profils.1.title': 'Professional athletes',
    'profils.1.desc': "Eight to fifteen years to build wealth that must last sixty. An intense career, sometimes international taxation, an early end to competition. The method is built during, not after. I've lived it; I run it for you.",
    'profils.2.title': 'Directors & executives',
    'profils.2.desc': "Solid income, envelopes accumulated without an overall logic. Several contracts, several rationales, none talking to each other. What isn't brought into coherence costs you every year, in tax as in performance.",
    'profils.3.title': 'Entrepreneurs',
    'profils.3.desc': 'Your company is your main asset, and that is precisely the risk. Sale, holding, Dutreil pact: these levers are prepared two years ahead, not two months. Modelling before signing, never the reverse.',
    'profils.4.title': 'Private individuals',
    'profils.4.desc': 'You earn, you save, you pay your taxes. No one taught you to connect the three. Building coherent wealth doesn\'t require being wealthy already, but a method. And method begins with knowing exactly where you stand.',
    'exp.assurance-vie': 'Life insurance (assurance-vie)',
    'exp.immobilier': 'Wealth real estate',
    'exp.per': 'Retirement savings plan (PER)',
    'exp.transmission-anticipee': 'Early estate transfer',
    'exp.transmission': 'Estate transfer',
    'exp.epargne-salariale': 'Employee savings & director retirement',
    'exp.credit': 'Credit & leverage',
    'exp.private-equity': 'Private equity',
    'exp.scpi': 'SCPI (property funds)',

    // Accueil — NewsletterTeaser
    'nlt.eyebrow': 'The Oak Letter',
    'nlt.title1': 'A monthly',
    'nlt.title2': 'newsletter.',
    'nlt.body': 'A sober, data-driven publication. Real cases, opportunities, studies and tax news decoded. To decide with clarity, every month in your inbox.',
    'nlt.menuLabel': 'Coming in the next editions',
    'nlt.menuBody': "Wealth strategies, market reading, the professional athlete's wealth.",
    'nlt.cta': 'Discover and subscribe',

    // Accueil — OakBand
    'oak.eyebrow': 'The Oak philosophy',
    'oak.quote': 'Deep roots, growth that spans',
    'oak.quoteItalic': ' generations.',
    'oak.body': 'This is how wealth is built: slowly, solidly, designed for those who come after you.',

    // ExpertiseGrid
    'egrid.intro': 'Every topic is handled with the same rigour: understand your situation, model the scenarios, choose the right wrappers, steer over time. Click a pillar to explore its logic.',
    'egrid.explore': 'Explore',

    // Expertise — page détail [slug]
    'exd.breadcrumbHome': 'Home',
    'exd.breadcrumbExpertise': 'Expertise',
    'exd.pillar': 'Pillar',
    'exd.pourQui': 'Who is it for?',
    'exd.sommaire': 'Contents',
    'exd.piegesNav': 'Common pitfalls',
    'exd.faqNav': 'Frequently asked questions',
    'exd.piegesEyebrow': 'Common pitfalls to avoid',
    'exd.piegesTitle': 'What I see, and what it costs.',
    'exd.faqEyebrow': 'Frequently asked questions',
    'exd.faqTitle': 'What I get asked most.',
    'exd.prev': '← Previous pillar',
    'exd.next': 'Next pillar →',
    'exd.ctaTitlePre': 'A concrete question about',
    'exd.ctaBody': "Let's talk it through directly. First conversation offered, with no commitment.",

    // CTA (bloc réutilisé sur plusieurs pages)
    'cta.eyebrow': 'Start together',
    'cta.title': 'Wealth is built over time.',
    'cta.body': "Let's plan a first 30-minute conversation. No commitment: a clear discussion of your situation, and the priorities that follow from it.",
    'cta.rdv': 'Book a meeting',
    'cta.write': 'Send a message',
    'cta.orReceivePre': 'Or receive',
    'cta.orReceivePost': 'every month.',

    // Divers
    'common.coverage': 'Throughout France · in person or remotely',
    'lang.switchTo': 'Français',
    'lang.ariaSwitch': 'Passer en français',
  },
} as const;
