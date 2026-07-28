// Moteur du Diagnostic Patrimonial — Le Chêne Patrimonial.
// Fonctions pures : à partir des réponses, produit un indice /100, une analyse
// (forces, faiblesses, opportunités, risques, priorités), un plan sur 12 mois,
// la répartition du patrimoine et une estimation d'économie fiscale.
//
// Périmètre : le cabinet intervient au titre du courtage assurance (COA) et de
// l'immobilier (Carte T). Les recommandations restent sur l'assurance-vie, le
// PER assurantiel, l'immobilier, les SCPI et la transmission. Aucun conseil sur
// les instruments financiers en direct (PEA, compte-titres) : ils ne sont pris
// en compte que pour la photographie du patrimoine.

import type {
  Answers,
  Diagnostic,
  Insight,
  Niveau,
  PillarScore,
  Repartition,
  ActionTrimestre,
  Objectif,
} from './types';

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const n = (v: number | undefined) => (Number.isFinite(v as number) && (v as number) > 0 ? (v as number) : 0);
const round = (v: number) => Math.round(v);

// Interpolation linéaire d'un score : renvoie 0 sous `bad`, 100 au-dessus de `good`.
function scale(value: number, bad: number, good: number): number {
  if (good === bad) return value >= good ? 100 : 0;
  const t = (value - bad) / (good - bad);
  return clamp(t * 100);
}

const PLAFOND_PER = 35194; // plafond indicatif de déduction PER (PASS 2025, ordre de grandeur)

// Statuts sans couverture sociale d'employeur (le filet dépend d'eux-mêmes).
const isIndependant = (s?: string) =>
  s === 'micro_entrepreneur' ||
  s === 'independant_tns' ||
  s === 'profession_liberale' ||
  s === 'gerant_sarl';

export interface Derived {
  patrimoineBrut: number;
  patrimoineNet: number;
  immoTotal: number;
  financierTotal: number; // hors immobilier
  enveloppesRetraite: number; // AV + PER + autres supports assurantiels
  moisPrecaution: number;
  tauxEndettement: number;
  tauxEpargne: number;
  poidsImmo: number;
}

export function derive(a: Answers): Derived {
  const rp = n(a.valeurRP);
  const locatif = n(a.immoLocatif);
  const immoTotal = rp + locatif;
  const dispo = n(a.epargneDispo);
  const av = n(a.assuranceVie);
  const per = n(a.per);
  const autres = n(a.autresPlacements);
  const bourse = n(a.bourse);
  const financierTotal = dispo + av + per + autres + bourse;

  const patrimoineBrut = immoTotal + financierTotal;
  const patrimoineNet = Math.max(0, patrimoineBrut - n(a.creditCRD));

  const revenu = n(a.revenuMensuel);
  const charges = n(a.chargesMensuelles);
  const besoinMensuel = charges > 0 ? charges : revenu * 0.7;
  const moisPrecaution = besoinMensuel > 0 ? dispo / besoinMensuel : 0;

  const tauxEndettement = revenu > 0 ? (n(a.creditMensualite) / revenu) * 100 : 0;
  const tauxEpargne = revenu > 0 ? (n(a.epargneMensuelle) / revenu) * 100 : 0;
  const poidsImmo = patrimoineBrut > 0 ? (immoTotal / patrimoineBrut) * 100 : 0;

  return {
    patrimoineBrut,
    patrimoineNet,
    immoTotal,
    financierTotal,
    enveloppesRetraite: av + per + autres,
    moisPrecaution,
    tauxEndettement,
    tauxEpargne,
    poidsImmo,
  };
}

// ---------------------------------------------------------------------------
// Piliers de l'indice de santé patrimoniale (somme des poids = 100)
// ---------------------------------------------------------------------------
function computePillars(a: Answers, d: Derived): PillarScore[] {
  const revenuAnnuel = n(a.revenuMensuel) * 12;
  const age = n(a.age) || 40;

  // 1. Épargne de précaution : cible 3 à 6 mois de charges.
  const precaution = scale(d.moisPrecaution, 0.5, 4.5);

  // 2. Endettement : sain en dessous de 33 %, tendu au-delà.
  const endettement = n(a.creditMensualite) === 0 ? 100 : clamp(100 - scale(d.tauxEndettement, 15, 45));

  // 3. Effort d'épargne : part du revenu réellement mise de côté.
  const effort = scale(d.tauxEpargne, 2, 18);

  // 4. Diversification : pénalise la surconcentration (tout immobilier ou tout cash).
  let diversification = 50;
  if (d.patrimoineBrut > 0) {
    const parts = [
      d.immoTotal,
      n(a.epargneDispo),
      n(a.assuranceVie) + n(a.per),
      n(a.autresPlacements) + n(a.bourse),
    ].map((x) => x / d.patrimoineBrut);
    // Indice de diversité (1 - Herfindahl), 0 = tout dans une poche, ~0.75 = bien réparti.
    const herf = parts.reduce((s, p) => s + p * p, 0);
    diversification = scale(1 - herf, 0.1, 0.68);
    // Un patrimoine 100 % immobilier reste fragile même s'il est "gros".
    if (d.poidsImmo > 85) diversification = Math.min(diversification, 45);
    // Tout en liquidités qui dorment : capital non investi.
    if (d.financierTotal > 0 && n(a.epargneDispo) / d.financierTotal > 0.85 && d.financierTotal > 20000) {
      diversification = Math.min(diversification, 55);
    }
  } else {
    diversification = 30;
  }

  // 5. Préparation retraite : encours dédiés rapportés à une cible qui monte avec l'âge.
  //    Cible indicative : ~ (âge - 25)/10 années de revenu placées à horizon retraite.
  const cibleRetraite = Math.max(0.5, (age - 25) / 10) * revenuAnnuel;
  let retraite = cibleRetraite > 0 ? scale(d.enveloppesRetraite, 0, cibleRetraite) : 40;
  if (n(a.per) > 0) retraite = Math.min(100, retraite + 8); // dispositif dédié déjà en place
  if (age >= 55 && d.enveloppesRetraite < revenuAnnuel) retraite = Math.min(retraite, 45);

  // 6. Protection de la famille : prévoyance + protection du conjoint / des enfants.
  let protection = 55;
  if (a.prevoyance === 'oui') protection = 90;
  else if (a.prevoyance === 'partiel') protection = 65;
  else if (a.prevoyance === 'non') protection = 30;
  else protection = 45; // ne sait pas
  const aCharge = n(a.enfants) > 0 || a.situation === 'couple' || a.situation === 'marie_pacse';
  if (aCharge && (a.prevoyance === 'non' || a.prevoyance === 'ne_sais_pas')) {
    protection = Math.min(protection, 28); // enjeu réel si des proches dépendent des revenus
  }
  if (n(a.assuranceVie) > 0) protection = Math.min(100, protection + 6); // outil de transmission
  // Indépendants et assimilés : pas de filet employeur, la prévoyance individuelle
  // devient la première ligne de défense. Le sportif pro cumule revenus concentrés
  // et carrière courte : l'exposition est maximale.
  if (isIndependant(a.statut) && a.prevoyance !== 'oui') protection = Math.min(protection, 40);
  if (a.statut === 'sportif_pro' && a.prevoyance !== 'oui') protection = Math.min(protection, 32);

  // 7. Optimisation fiscale : pertinence d'agir croît avec la TMI.
  const tmi = a.tmi ?? 30;
  let fiscalite: number;
  if (tmi <= 11) {
    fiscalite = 80; // peu d'enjeu de défiscalisation, la priorité est ailleurs
  } else {
    // Fort levier PER non utilisé => score bas (donc grosse opportunité).
    const perRatio = revenuAnnuel > 0 ? n(a.per) / (revenuAnnuel * 0.1) : 0;
    fiscalite = clamp(30 + Math.min(perRatio, 1) * 55);
    if (n(a.immoLocatif) > 0) fiscalite = Math.min(100, fiscalite + 8);
    if (tmi >= 41 && n(a.per) === 0) fiscalite = Math.min(fiscalite, 30);
  }

  return [
    { key: 'precaution', label: 'Épargne de précaution', score: round(precaution), weight: 15, note: noteFor('precaution', precaution, d) },
    { key: 'endettement', label: 'Maîtrise de l’endettement', score: round(endettement), weight: 15, note: noteFor('endettement', endettement, d) },
    { key: 'effort_epargne', label: 'Effort d’épargne', score: round(effort), weight: 15, note: noteFor('effort_epargne', effort, d) },
    { key: 'diversification', label: 'Diversification', score: round(diversification), weight: 15, note: noteFor('diversification', diversification, d) },
    { key: 'retraite', label: 'Préparation de la retraite', score: round(retraite), weight: 15, note: noteFor('retraite', retraite, d) },
    { key: 'protection', label: 'Protection de la famille', score: round(protection), weight: 10, note: noteFor('protection', protection, d) },
    { key: 'fiscalite', label: 'Optimisation fiscale', score: round(fiscalite), weight: 15, note: noteFor('fiscalite', fiscalite, d) },
  ];
}

function noteFor(key: string, score: number, d: Derived): string {
  const good = score >= 66;
  const mid = score >= 40 && score < 66;
  switch (key) {
    case 'precaution':
      return good
        ? `Un matelas confortable (${d.moisPrecaution.toFixed(1)} mois de charges).`
        : mid
        ? `Une réserve à renforcer (${d.moisPrecaution.toFixed(1)} mois de charges).`
        : `Réserve de sécurité insuffisante (${d.moisPrecaution.toFixed(1)} mois).`;
    case 'endettement':
      return good
        ? `Endettement bien maîtrisé (${d.tauxEndettement.toFixed(0)} %).`
        : `Endettement à surveiller (${d.tauxEndettement.toFixed(0)} % des revenus).`;
    case 'effort_epargne':
      return good
        ? `Belle capacité d’épargne (${d.tauxEpargne.toFixed(0)} % des revenus).`
        : mid
        ? `Effort d’épargne correct (${d.tauxEpargne.toFixed(0)} %), à intensifier.`
        : `Peu d’épargne dégagée (${d.tauxEpargne.toFixed(0)} % des revenus).`;
    case 'diversification':
      return good
        ? 'Patrimoine bien réparti entre les classes d’actifs.'
        : `Patrimoine concentré (immobilier : ${d.poidsImmo.toFixed(0)} %).`;
    case 'retraite':
      return good
        ? 'Retraite anticipée avec des encours dédiés solides.'
        : mid
        ? 'Préparation retraite engagée mais encore légère.'
        : 'Retraite peu préparée à ce stade.';
    case 'protection':
      return good ? 'Vos proches sont correctement protégés.' : 'Protection des proches à consolider.';
    case 'fiscalite':
      return good ? 'Fiscalité globalement optimisée.' : 'Leviers de défiscalisation encore inexploités.';
    default:
      return '';
  }
}

function niveauFor(score: number): { niveau: Niveau; label: string } {
  if (score >= 80) return { niveau: 'remarquable', label: 'Remarquable' };
  if (score >= 62) return { niveau: 'solide', label: 'Solide' };
  if (score >= 42) return { niveau: 'a_consolider', label: 'À consolider' };
  return { niveau: 'fragile', label: 'À structurer' };
}

// ---------------------------------------------------------------------------
// Répartition du patrimoine (pour le donut)
// ---------------------------------------------------------------------------
function computeRepartition(a: Answers, d: Derived): Repartition[] {
  const buckets = [
    { label: 'Résidence principale', montant: n(a.valeurRP), color: '#0A1F4F' },
    { label: 'Immobilier locatif', montant: n(a.immoLocatif), color: '#2D4A33' },
    { label: 'Épargne disponible', montant: n(a.epargneDispo), color: '#A8A395' },
    { label: 'Assurance-vie & PER', montant: n(a.assuranceVie) + n(a.per), color: '#D4A82D' },
    { label: 'Autres placements', montant: n(a.autresPlacements) + n(a.bourse), color: '#3E6247' },
  ].filter((b) => b.montant > 0);
  const total = buckets.reduce((s, b) => s + b.montant, 0) || 1;
  return buckets
    .map((b) => ({ ...b, part: (b.montant / total) * 100 }))
    .sort((x, y) => y.montant - x.montant);
}

// ---------------------------------------------------------------------------
// Estimation de l'économie fiscale via un versement PER (prudente, indicative)
// ---------------------------------------------------------------------------
function estimatePER(a: Answers, d: Derived): { versement: number; economie: number } {
  const tmi = a.tmi ?? 0;
  if (tmi < 30) return { versement: 0, economie: 0 };
  const revenuAnnuel = n(a.revenuMensuel) * 12;
  const plafond = Math.min(PLAFOND_PER, Math.max(4637, revenuAnnuel * 0.1));
  // On reste réaliste : au plus la capacité d'épargne annuelle, plafonnée.
  const capaciteAnnuelle = n(a.epargneMensuelle) * 12;
  const versement = Math.max(0, Math.min(plafond, capaciteAnnuelle > 0 ? capaciteAnnuelle * 0.6 : plafond * 0.3));
  const economie = versement * (tmi / 100);
  return { versement: round(versement / 100) * 100, economie: round(economie / 10) * 10 };
}

// ---------------------------------------------------------------------------
// Génération de l'analyse qualitative
// ---------------------------------------------------------------------------
function buildAnalysis(a: Answers, d: Derived, piliers: PillarScore[], per: { versement: number; economie: number }) {
  const forces: Insight[] = [];
  const faiblesses: Insight[] = [];
  const opportunites: Insight[] = [];
  const risques: Insight[] = [];
  const objectifs = a.objectifs ?? [];
  const has = (o: Objectif) => objectifs.includes(o);
  const by = (k: string) => piliers.find((p) => p.key === k)!;

  // Forces (piliers >= 68)
  piliers.filter((p) => p.score >= 68).forEach((p) => {
    forces.push({ titre: p.label, detail: p.note });
  });
  if (d.patrimoineNet > 250000 && !forces.length) {
    forces.push({ titre: 'Un socle patrimonial constitué', detail: 'Vous avez déjà bâti une base sur laquelle structurer la suite.' });
  }
  if (!forces.length) {
    forces.push({ titre: 'Une démarche enclenchée', detail: 'Faire ce diagnostic, c’est déjà prendre les commandes de votre patrimoine.' });
  }

  // Faiblesses (piliers < 45)
  piliers.filter((p) => p.score < 45).forEach((p) => {
    faiblesses.push({ titre: p.label, detail: p.note });
  });

  // Opportunités
  if ((a.tmi ?? 0) >= 30 && per.economie > 0 && n(a.per) < 10000) {
    opportunites.push({
      titre: 'Réduire votre impôt via un PER',
      detail: `Avec votre tranche à ${a.tmi} %, un versement d’environ ${fmt(per.versement)} pourrait générer près de ${fmt(per.economie)} d’économie d’impôt, tout en préparant votre retraite.`,
    });
  }
  if (by('precaution').score < 55) {
    opportunites.push({
      titre: 'Sécuriser une épargne de précaution',
      detail: 'Constituer 3 à 6 mois de charges sur des supports liquides avant d’investir le reste apporte une vraie sérénité.',
    });
  }
  if (by('diversification').score < 55 && d.poidsImmo > 70) {
    opportunites.push({
      titre: 'Diversifier au-delà de l’immobilier',
      detail: 'L’assurance-vie et les SCPI permettent d’équilibrer un patrimoine aujourd’hui très immobilier, sans en changer la nature.',
    });
  }
  if (n(a.epargneDispo) > 30000 && n(a.assuranceVie) === 0) {
    opportunites.push({
      titre: 'Faire travailler vos liquidités',
      detail: `Une part de vos ${fmt(n(a.epargneDispo))} d’épargne disponible pourrait rejoindre une assurance-vie, plus efficace sur la durée.`,
    });
  }
  if (has('transmettre') && n(a.assuranceVie) === 0) {
    opportunites.push({
      titre: 'Préparer la transmission',
      detail: 'L’assurance-vie reste l’outil de référence pour transmettre dans un cadre fiscal privilégié.',
    });
  }
  if (has('investir_immobilier') || has('revenus_complementaires')) {
    opportunites.push({
      titre: 'Générer des revenus immobiliers',
      detail: 'Selon votre fiscalité, l’immobilier locatif (en direct ou via SCPI) peut créer des revenus complémentaires structurés.',
    });
  }

  // Risques
  if (d.tauxEndettement > 38) {
    risques.push({
      titre: 'Taux d’endettement élevé',
      detail: `À ${d.tauxEndettement.toFixed(0)} %, votre budget offre peu de marge en cas d’imprévu ou de hausse des charges.`,
    });
  }
  if (by('protection').score < 45) {
    risques.push({
      titre: 'Protection des proches insuffisante',
      detail: n(a.enfants) > 0
        ? 'En cas de coup dur, les revenus qui font vivre votre foyer ne sont pas suffisamment couverts.'
        : 'Une prévoyance adaptée protégerait vos revenus en cas d’aléa de la vie.',
    });
  }
  if (d.moisPrecaution < 1.5 && d.patrimoineBrut > 0) {
    risques.push({
      titre: 'Trop peu de liquidités mobilisables',
      detail: 'Un imprévu pourrait vous contraindre à désinvestir ou à emprunter dans de mauvaises conditions.',
    });
  }
  if (d.poidsImmo > 88 && d.patrimoineBrut > 150000) {
    risques.push({
      titre: 'Patrimoine très concentré',
      detail: 'Presque tout votre patrimoine repose sur l’immobilier : liquidité réduite et exposition à un seul marché.',
    });
  }
  if ((a.tmi ?? 0) >= 41 && n(a.per) === 0 && n(a.immoLocatif) === 0) {
    risques.push({
      titre: 'Fiscalité non optimisée',
      detail: 'À votre niveau d’imposition, l’absence de dispositif dédié laisse filer une part évitable d’impôt chaque année.',
    });
  }

  return { forces, faiblesses, opportunites, risques };
}

// Analyse propre au statut professionnel : couverture sociale, retraite,
// cotisations (URSSAF, CFE) et cas du sportif. Reste dans le périmètre du cabinet
// (prévoyance, retraite, patrimoine) : les points CFE/URSSAF sont des repères de
// vigilance, pas du conseil comptable.
function statutInsights(a: Answers): { note?: string; opportunites: Insight[]; risques: Insight[] } {
  const opportunites: Insight[] = [];
  const risques: Insight[] = [];
  const jeune = a.anciennete === 'moins_1an';
  let note: string | undefined;

  switch (a.statut) {
    case 'micro_entrepreneur':
      note = 'Micro-entreprise : cotisations URSSAF prélevées sur le chiffre d’affaires, protection sociale minimale et retraite qui se constitue lentement.';
      risques.push({
        titre: jeune ? 'CFE à anticiper dès l’an prochain' : 'Charges à ne pas oublier (CFE, URSSAF)',
        detail: jeune
          ? 'Exonéré de CFE la première année, vous y serez soumis dès l’année suivante : mieux vaut la provisionner dès maintenant.'
          : 'CFE annuelle et cotisations URSSAF pèsent sur votre trésorerie : les provisionner évite les mauvaises surprises.',
      });
      opportunites.push({
        titre: 'Compenser une couverture sociale légère',
        detail: 'Sans employeur, une prévoyance individuelle et un PER (déductible) reconstituent le filet retraite et prévoyance qui vous manque.',
      });
      break;
    case 'independant_tns':
    case 'gerant_sarl':
      note = 'Statut TNS : régime des indépendants, avec une retraite obligatoire souvent plus faible qu’un salarié à revenu équivalent.';
      opportunites.push({
        titre: 'Doper votre retraite de TNS',
        detail: 'Un PER individuel (ancien Madelin) capitalise pour la retraite tout en réduisant votre revenu imposable.',
      });
      if (a.prevoyance !== 'oui') {
        risques.push({
          titre: 'Prévoyance de dirigeant à sécuriser',
          detail: 'En cas d’arrêt, vos indemnités de TNS sont limitées : une prévoyance dédiée protège vos revenus et votre entreprise.',
        });
      }
      break;
    case 'president_sas':
      note = 'Président de SAS : assimilé salarié, donc bien couvert socialement, mais sans assurance chômage et avec un arbitrage rémunération / dividendes à piloter.';
      opportunites.push({
        titre: 'Arbitrer rémunération et dividendes',
        detail: 'Le PER et l’assurance-vie permettent de transformer une partie de vos revenus en épargne long terme, dans un cadre fiscal maîtrisé.',
      });
      break;
    case 'profession_liberale':
      note = 'Profession libérale : caisse de retraite dédiée, souvent moins généreuse que le régime général, et revenus variables.';
      opportunites.push({
        titre: 'Lisser des revenus variables',
        detail: 'Épargner davantage les bonnes années sur un PER et une assurance-vie compense les creux et prépare la retraite.',
      });
      break;
    case 'sportif_pro':
      note = 'Sportif professionnel : revenus élevés mais concentrés sur une carrière courte. Chaque année compte double.';
      opportunites.push({
        titre: 'Capitaliser pendant les années de pic',
        detail: 'Transformer une partie des revenus de carrière en patrimoine (assurance-vie, immobilier) sécurise l’après-carrière.',
      });
      risques.push({
        titre: 'Préparer la reconversion',
        detail: 'Blessure ou fin de carrière peuvent arriver tôt : prévoyance renforcée et épargne de précaution solide sont prioritaires.',
      });
      break;
    case 'salarie':
    case 'cadre':
      opportunites.push({
        titre: 'Activer votre épargne salariale',
        detail: 'PEE, PERCO et abondement de l’employeur se combinent à un PER individuel pour préparer la retraite efficacement.',
      });
      break;
    case 'fonctionnaire':
      opportunites.push({
        titre: 'Compléter votre retraite',
        detail: 'La pension du public se calcule hors primes : un PER individuel comble une part de l’écart avec vos revenus d’activité.',
      });
      break;
    default:
      break;
  }
  return { note, opportunites, risques };
}

// Priorités : les piliers les plus faibles pondérés par leur poids, croisés aux objectifs.
function buildPriorities(a: Answers, piliers: PillarScore[]): Insight[] {
  const ranked = [...piliers]
    .map((p) => ({ p, gap: (100 - p.score) * (p.weight / 100) }))
    .sort((x, y) => y.gap - x.gap)
    .slice(0, 3);

  const map: Record<string, Insight> = {
    precaution: { titre: 'Bâtir votre coussin de sécurité', detail: 'Objectif : 3 à 6 mois de charges disponibles avant tout investissement.' },
    endettement: { titre: 'Alléger votre endettement', detail: 'Étudier un rachat ou une renégociation pour retrouver de la marge de manœuvre.' },
    effort_epargne: { titre: 'Automatiser votre épargne', detail: 'Mettre en place un versement programmé, même modeste, pour créer l’habitude.' },
    diversification: { titre: 'Diversifier vos actifs', detail: 'Équilibrer entre immobilier, fonds euros et unités de compte selon votre profil.' },
    retraite: { titre: 'Structurer votre retraite', detail: 'Ouvrir ou alimenter une enveloppe dédiée pour capitaliser dans la durée.' },
    protection: { titre: 'Protéger vos proches', detail: 'Mettre en place une prévoyance et vérifier vos clauses bénéficiaires.' },
    fiscalite: { titre: 'Réduire votre fiscalité', detail: 'Activer les leviers adaptés à votre tranche (PER, immobilier, enveloppes).' },
  };

  return ranked.map((r) => map[r.p.key]).filter(Boolean);
}

// Plan d'action réparti sur 12 mois, dérivé des priorités.
function buildPlan(priorites: Insight[]): ActionTrimestre[] {
  const periods = ['Mois 1 à 3', 'Mois 4 à 6', 'Mois 7 à 9', 'Mois 10 à 12'];
  const base: ActionTrimestre[] = [
    { periode: periods[0], titre: 'Faire le point avec un conseiller', detail: 'Valider les chiffres de ce diagnostic et fixer le cap avec Le Chêne Patrimonial.' },
  ];
  priorites.slice(0, 3).forEach((pr, i) => {
    base.push({ periode: periods[i + 1] ?? periods[3], titre: pr.titre, detail: pr.detail });
  });
  while (base.length < 4) {
    base.push({
      periode: periods[base.length],
      titre: 'Suivre et ajuster',
      detail: 'Mesurer les premiers résultats et affiner la stratégie au fil de l’eau.',
    });
  }
  return base.slice(0, 4);
}

function fmt(v: number): string {
  return Math.round(v).toLocaleString('fr-FR').replace(/[\u202f\u00a0\u2009]/g, ' ') + ' €';
}

// ---------------------------------------------------------------------------
// Entrée principale
// ---------------------------------------------------------------------------
export function analyse(a: Answers): Diagnostic {
  const d = derive(a);
  const piliers = computePillars(a, d);
  const score = round(piliers.reduce((s, p) => s + (p.score * p.weight) / 100, 0));
  const { niveau, label } = niveauFor(score);
  const per = estimatePER(a, d);
  const base = buildAnalysis(a, d, piliers, per);
  const statut = statutInsights(a);

  // On fusionne les insights liés au statut, en tête (ils sont très parlants),
  // puis on déduplique par titre et on plafonne pour ne pas noyer la lecture.
  const dedupe = (arr: Insight[]) => {
    const seen = new Set<string>();
    return arr.filter((i) => (seen.has(i.titre) ? false : (seen.add(i.titre), true)));
  };
  const opportunites = dedupe([...statut.opportunites, ...base.opportunites]).slice(0, 5);
  const risques = dedupe([...statut.risques, ...base.risques]).slice(0, 5);
  const forces = base.forces.slice(0, 4);
  const faiblesses = base.faiblesses.slice(0, 4);

  const priorites = buildPriorities(a, piliers);
  const plan = buildPlan(priorites);
  const repartition = computeRepartition(a, d);

  const resume = buildResume(score, niveau, d, piliers);

  return {
    score,
    niveau,
    niveauLabel: label,
    resume,
    statutNote: statut.note,
    piliers,
    forces,
    faiblesses,
    opportunites,
    risques,
    priorites,
    plan,
    repartition,
    patrimoineBrut: round(d.patrimoineBrut),
    patrimoineNet: round(d.patrimoineNet),
    moisPrecaution: Math.round(d.moisPrecaution * 10) / 10,
    tauxEndettement: round(d.tauxEndettement),
    tauxEpargne: round(d.tauxEpargne),
    poidsImmo: round(d.poidsImmo),
    economieFiscaleEstimee: per.economie,
    perVersementSuggere: per.versement,
  };
}

function buildResume(score: number, niveau: Niveau, d: Derived, piliers: PillarScore[]): string {
  const faible = [...piliers].sort((a, b) => a.score - b.score)[0];
  const fort = [...piliers].sort((a, b) => b.score - a.score)[0];
  const intro: Record<Niveau, string> = {
    remarquable: 'Votre patrimoine est piloté avec rigueur.',
    solide: 'Vous avez posé des bases saines.',
    a_consolider: 'Votre situation est prometteuse mais mérite d’être structurée.',
    fragile: 'Votre patrimoine gagnerait à être mis en ordre, étape par étape.',
  };
  return `${intro[niveau]} Votre point fort : ${fort.label.toLowerCase()}. Le principal levier d’amélioration : ${faible.label.toLowerCase()}.`;
}
