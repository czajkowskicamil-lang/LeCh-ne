// Wealth Diagnostic engine — Le Chêne Patrimonial.
// Pure functions: from the answers, produce a /100 index, an analysis
// (strengths, weaknesses, opportunities, risks, priorities), a 12-month plan,
// the breakdown of assets and an estimated tax saving.
//
// Scope: the firm operates under an insurance-brokerage licence (COA) and a
// real-estate licence (Carte T). Recommendations stay within life insurance, the
// insurance-based PER (Plan d'Épargne Retraite, France's personal retirement
// savings plan), real estate, SCPI (Société Civile de Placement Immobilier,
// French real-estate investment trusts) and estate transmission. No advice is
// given on direct financial instruments (PEA, France's equity savings plan, or
// standard brokerage accounts): they are only factored into the overall
// picture of assets.

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

// Linear interpolation of a score: returns 0 below `bad`, 100 above `good`.
function scale(value: number, bad: number, good: number): number {
  if (good === bad) return value >= good ? 100 : 0;
  const t = (value - bad) / (good - bad);
  return clamp(t * 100);
}

const PLAFOND_PER = 35194; // indicative PER deduction cap (PASS, France's annual social security cap, 2025, order of magnitude)

// Statuses without employer-provided social cover (the safety net depends on them alone).
const isIndependant = (s?: string) =>
  s === 'micro_entrepreneur' ||
  s === 'independant_tns' ||
  s === 'profession_liberale' ||
  s === 'gerant_sarl';

export interface Derived {
  patrimoineBrut: number;
  patrimoineNet: number;
  immoTotal: number;
  financierTotal: number; // excluding real estate
  enveloppesRetraite: number; // life insurance + PER + other insurance-based vehicles
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
// Pillars of the wealth health index (weights sum to 100)
// ---------------------------------------------------------------------------
function computePillars(a: Answers, d: Derived): PillarScore[] {
  const revenuAnnuel = n(a.revenuMensuel) * 12;
  const age = n(a.age) || 40;

  // 1. Emergency savings: target of 3 to 6 months of expenses.
  const precaution = scale(d.moisPrecaution, 0.5, 4.5);

  // 2. Debt: healthy under 33%, strained beyond that.
  const endettement = n(a.creditMensualite) === 0 ? 100 : clamp(100 - scale(d.tauxEndettement, 15, 45));

  // 3. Savings effort: share of income actually set aside.
  const effort = scale(d.tauxEpargne, 2, 18);

  // 4. Diversification: penalises over-concentration (all real estate or all cash).
  let diversification = 50;
  if (d.patrimoineBrut > 0) {
    const parts = [
      d.immoTotal,
      n(a.epargneDispo),
      n(a.assuranceVie) + n(a.per),
      n(a.autresPlacements) + n(a.bourse),
    ].map((x) => x / d.patrimoineBrut);
    // Diversity index (1 - Herfindahl): 0 means everything in one bucket, ~0.75 means well spread.
    const herf = parts.reduce((s, p) => s + p * p, 0);
    diversification = scale(1 - herf, 0.1, 0.68);
    // An all-real-estate portfolio stays fragile even when it is "large".
    if (d.poidsImmo > 85) diversification = Math.min(diversification, 45);
    // All in cash sitting idle: capital that isn't invested.
    if (d.financierTotal > 0 && n(a.epargneDispo) / d.financierTotal > 0.85 && d.financierTotal > 20000) {
      diversification = Math.min(diversification, 55);
    }
  } else {
    diversification = 30;
  }

  // 5. Retirement preparation: dedicated savings measured against a target that rises with age.
  //    Indicative target: roughly (age - 25)/10 years of income invested by the retirement horizon.
  const cibleRetraite = Math.max(0.5, (age - 25) / 10) * revenuAnnuel;
  let retraite = cibleRetraite > 0 ? scale(d.enveloppesRetraite, 0, cibleRetraite) : 40;
  if (n(a.per) > 0) retraite = Math.min(100, retraite + 8); // a dedicated vehicle is already in place
  if (age >= 55 && d.enveloppesRetraite < revenuAnnuel) retraite = Math.min(retraite, 45);

  // 6. Family protection: death/disability cover plus protection of spouse / children.
  let protection = 55;
  if (a.prevoyance === 'oui') protection = 90;
  else if (a.prevoyance === 'partiel') protection = 65;
  else if (a.prevoyance === 'non') protection = 30;
  else protection = 45; // doesn't know
  const aCharge = n(a.enfants) > 0 || a.situation === 'couple' || a.situation === 'marie_pacse';
  if (aCharge && (a.prevoyance === 'non' || a.prevoyance === 'ne_sais_pas')) {
    protection = Math.min(protection, 28); // real stake when loved ones depend on this income
  }
  if (n(a.assuranceVie) > 0) protection = Math.min(100, protection + 6); // an estate-transmission tool
  // The self-employed and similar statuses have no employer safety net, so individual
  // protection insurance becomes the first line of defence. A professional athlete
  // combines concentrated income with a short career: the exposure is at its highest.
  if (isIndependant(a.statut) && a.prevoyance !== 'oui') protection = Math.min(protection, 40);
  if (a.statut === 'sportif_pro' && a.prevoyance !== 'oui') protection = Math.min(protection, 32);

  // 7. Tax optimisation: the relevance of acting rises with the marginal tax bracket.
  const tmi = a.tmi ?? 30;
  let fiscalite: number;
  if (tmi <= 11) {
    fiscalite = 80; // little tax-optimisation stake, the priority lies elsewhere
  } else {
    // Strong, unused PER leverage => low score (i.e. a big opportunity).
    const perRatio = revenuAnnuel > 0 ? n(a.per) / (revenuAnnuel * 0.1) : 0;
    fiscalite = clamp(30 + Math.min(perRatio, 1) * 55);
    if (n(a.immoLocatif) > 0) fiscalite = Math.min(100, fiscalite + 8);
    if (tmi >= 41 && n(a.per) === 0) fiscalite = Math.min(fiscalite, 30);
  }

  return [
    { key: 'precaution', label: 'Emergency savings', score: round(precaution), weight: 15, note: noteFor('precaution', precaution, d) },
    { key: 'endettement', label: 'Debt management', score: round(endettement), weight: 15, note: noteFor('endettement', endettement, d) },
    { key: 'effort_epargne', label: 'Savings effort', score: round(effort), weight: 15, note: noteFor('effort_epargne', effort, d) },
    { key: 'diversification', label: 'Diversification', score: round(diversification), weight: 15, note: noteFor('diversification', diversification, d) },
    { key: 'retraite', label: 'Retirement preparation', score: round(retraite), weight: 15, note: noteFor('retraite', retraite, d) },
    { key: 'protection', label: 'Family protection', score: round(protection), weight: 10, note: noteFor('protection', protection, d) },
    { key: 'fiscalite', label: 'Tax optimisation', score: round(fiscalite), weight: 15, note: noteFor('fiscalite', fiscalite, d) },
  ];
}

function noteFor(key: string, score: number, d: Derived): string {
  const good = score >= 66;
  const mid = score >= 40 && score < 66;
  switch (key) {
    case 'precaution':
      return good
        ? `A comfortable cushion (${d.moisPrecaution.toFixed(1)} months of expenses).`
        : mid
        ? `A reserve worth strengthening (${d.moisPrecaution.toFixed(1)} months of expenses).`
        : `An insufficient safety reserve (${d.moisPrecaution.toFixed(1)} months).`;
    case 'endettement':
      return good
        ? `Debt well under control (${d.tauxEndettement.toFixed(0)}%).`
        : `Debt level to keep an eye on (${d.tauxEndettement.toFixed(0)}% of income).`;
    case 'effort_epargne':
      return good
        ? `Strong savings capacity (${d.tauxEpargne.toFixed(0)}% of income).`
        : mid
        ? `A decent savings effort (${d.tauxEpargne.toFixed(0)}%), worth stepping up.`
        : `Little savings freed up (${d.tauxEpargne.toFixed(0)}% of income).`;
    case 'diversification':
      return good
        ? 'Assets well spread across asset classes.'
        : `A concentrated portfolio (real estate: ${d.poidsImmo.toFixed(0)}%).`;
    case 'retraite':
      return good
        ? 'Retirement planned well ahead, with solid dedicated savings.'
        : mid
        ? 'Retirement planning under way but still light.'
        : 'Retirement preparation still limited at this stage.';
    case 'protection':
      return good ? 'Your loved ones are properly protected.' : 'Protection for your loved ones needs strengthening.';
    case 'fiscalite':
      return good ? 'Overall tax position well optimised.' : 'Tax-optimisation levers still untapped.';
    default:
      return '';
  }
}

function niveauFor(score: number): { niveau: Niveau; label: string } {
  if (score >= 80) return { niveau: 'remarquable', label: 'Outstanding' };
  if (score >= 62) return { niveau: 'solide', label: 'Solid' };
  if (score >= 42) return { niveau: 'a_consolider', label: 'Needs consolidation' };
  return { niveau: 'fragile', label: 'Needs structuring' };
}

// ---------------------------------------------------------------------------
// Breakdown of assets (for the donut chart)
// ---------------------------------------------------------------------------
function computeRepartition(a: Answers, d: Derived): Repartition[] {
  const buckets = [
    { label: 'Main residence', montant: n(a.valeurRP), color: '#0A1F4F' },
    { label: 'Rental property', montant: n(a.immoLocatif), color: '#2D4A33' },
    { label: 'Available savings', montant: n(a.epargneDispo), color: '#A8A395' },
    { label: 'Life insurance & PER', montant: n(a.assuranceVie) + n(a.per), color: '#D4A82D' },
    { label: 'Other investments', montant: n(a.autresPlacements) + n(a.bourse), color: '#3E6247' },
  ].filter((b) => b.montant > 0);
  const total = buckets.reduce((s, b) => s + b.montant, 0) || 1;
  return buckets
    .map((b) => ({ ...b, part: (b.montant / total) * 100 }))
    .sort((x, y) => y.montant - x.montant);
}

// ---------------------------------------------------------------------------
// Estimated tax saving from a PER contribution (conservative, indicative)
// ---------------------------------------------------------------------------
function estimatePER(a: Answers, d: Derived): { versement: number; economie: number } {
  const tmi = a.tmi ?? 0;
  if (tmi < 30) return { versement: 0, economie: 0 };
  const revenuAnnuel = n(a.revenuMensuel) * 12;
  const plafond = Math.min(PLAFOND_PER, Math.max(4637, revenuAnnuel * 0.1));
  // We stay realistic: at most the annual savings capacity, capped.
  const capaciteAnnuelle = n(a.epargneMensuelle) * 12;
  const versement = Math.max(0, Math.min(plafond, capaciteAnnuelle > 0 ? capaciteAnnuelle * 0.6 : plafond * 0.3));
  const economie = versement * (tmi / 100);
  return { versement: round(versement / 100) * 100, economie: round(economie / 10) * 10 };
}

// ---------------------------------------------------------------------------
// Qualitative analysis generation
// ---------------------------------------------------------------------------
function buildAnalysis(a: Answers, d: Derived, piliers: PillarScore[], per: { versement: number; economie: number }) {
  const forces: Insight[] = [];
  const faiblesses: Insight[] = [];
  const opportunites: Insight[] = [];
  const risques: Insight[] = [];
  const objectifs = a.objectifs ?? [];
  const has = (o: Objectif) => objectifs.includes(o);
  const by = (k: string) => piliers.find((p) => p.key === k)!;

  // Strengths (pillars >= 68)
  piliers.filter((p) => p.score >= 68).forEach((p) => {
    forces.push({ titre: p.label, detail: p.note });
  });
  if (d.patrimoineNet > 250000 && !forces.length) {
    forces.push({ titre: 'A solid asset base already in place', detail: 'You have already built a foundation to structure what comes next.' });
  }
  if (!forces.length) {
    forces.push({ titre: 'A process now under way', detail: 'Taking this diagnostic already means taking charge of your wealth.' });
  }

  // Weaknesses (pillars < 45)
  piliers.filter((p) => p.score < 45).forEach((p) => {
    faiblesses.push({ titre: p.label, detail: p.note });
  });

  // Opportunities
  if ((a.tmi ?? 0) >= 30 && per.economie > 0 && n(a.per) < 10000) {
    opportunites.push({
      titre: 'Reduce your tax bill with a PER',
      detail: `With your tax bracket at ${a.tmi}%, a contribution of around ${fmt(per.versement)} could generate close to ${fmt(per.economie)} in tax savings, while preparing for your retirement.`,
    });
  }
  if (by('precaution').score < 55) {
    opportunites.push({
      titre: 'Build up an emergency fund',
      detail: 'Setting aside 3 to 6 months of expenses in liquid vehicles before investing the rest brings real peace of mind.',
    });
  }
  if (by('diversification').score < 55 && d.poidsImmo > 70) {
    opportunites.push({
      titre: 'Diversify beyond real estate',
      detail: 'Life insurance and SCPI can help balance a portfolio that is currently very real-estate heavy, without changing its nature.',
    });
  }
  if (n(a.epargneDispo) > 30000 && n(a.assuranceVie) === 0) {
    opportunites.push({
      titre: 'Put your cash to work',
      detail: `A portion of your ${fmt(n(a.epargneDispo))} in available savings could move into a life-insurance policy, more efficient over the long run.`,
    });
  }
  if (has('transmettre') && n(a.assuranceVie) === 0) {
    opportunites.push({
      titre: 'Prepare your estate transmission',
      detail: 'Life insurance remains the benchmark tool for passing on wealth within a favourable tax framework.',
    });
  }
  if (has('investir_immobilier') || has('revenus_complementaires')) {
    opportunites.push({
      titre: 'Generate rental income',
      detail: 'Depending on your tax situation, rental property (held directly or via SCPI) can create structured additional income.',
    });
  }

  // Risks
  if (d.tauxEndettement > 38) {
    risques.push({
      titre: 'High debt ratio',
      detail: `At ${d.tauxEndettement.toFixed(0)}%, your budget leaves little room for the unexpected or a rise in expenses.`,
    });
  }
  if (by('protection').score < 45) {
    risques.push({
      titre: 'Insufficient protection for loved ones',
      detail: n(a.enfants) > 0
        ? 'In the event of a hard blow, the income that supports your household is not sufficiently covered.'
        : 'Suitable protection insurance would safeguard your income against life’s unexpected events.',
    });
  }
  if (d.moisPrecaution < 1.5 && d.patrimoineBrut > 0) {
    risques.push({
      titre: 'Too little cash on hand',
      detail: 'An unexpected event could force you to sell off investments or borrow on unfavourable terms.',
    });
  }
  if (d.poidsImmo > 88 && d.patrimoineBrut > 150000) {
    risques.push({
      titre: 'Highly concentrated portfolio',
      detail: 'Almost all of your wealth rests on real estate: reduced liquidity and exposure to a single market.',
    });
  }
  if ((a.tmi ?? 0) >= 41 && n(a.per) === 0 && n(a.immoLocatif) === 0) {
    risques.push({
      titre: 'Tax position not optimised',
      detail: 'At your tax bracket, the absence of a dedicated vehicle lets an avoidable share of tax slip away every year.',
    });
  }

  return { forces, faiblesses, opportunites, risques };
}

// Analysis specific to professional status: social cover, retirement, contributions
// (URSSAF, CFE) and the case of the professional athlete. Stays within the firm's
// scope (protection insurance, retirement, wealth): the CFE/URSSAF points are
// points of awareness, not accounting advice.
function statutInsights(a: Answers): { note?: string; opportunites: Insight[]; risques: Insight[] } {
  const opportunites: Insight[] = [];
  const risques: Insight[] = [];
  const jeune = a.anciennete === 'moins_1an';
  let note: string | undefined;

  switch (a.statut) {
    case 'micro_entrepreneur':
      note = 'Micro-entreprise (a simplified French self-employed status): URSSAF (France’s social security contributions body) dues are withheld from turnover, social cover is minimal and retirement benefits build up slowly.';
      risques.push({
        titre: jeune ? 'CFE to plan for from next year' : 'Charges not to forget (CFE, URSSAF)',
        detail: jeune
          ? 'Exempt from CFE (Cotisation Foncière des Entreprises, a French local business tax) in your first year, you will become liable for it the following year: better to set money aside for it now.'
          : 'Annual CFE (Cotisation Foncière des Entreprises, a French local business tax) and URSSAF contributions weigh on your cash flow: provisioning for them avoids unpleasant surprises.',
      });
      opportunites.push({
        titre: 'Offset a light social safety net',
        detail: 'Without an employer, individual protection insurance and a deductible PER rebuild the retirement and protection safety net you are missing.',
      });
      break;
    case 'independant_tns':
    case 'gerant_sarl':
      note = 'TNS status (Travailleur Non Salarié, a self-employed/non-salaried worker regime): mandatory retirement benefits are often lower than a salaried employee’s on an equivalent income.';
      opportunites.push({
        titre: 'Boost your TNS retirement',
        detail: 'An individual PER (the former Madelin scheme) builds up retirement savings while reducing your taxable income.',
      });
      if (a.prevoyance !== 'oui') {
        risques.push({
          titre: 'Executive protection insurance to secure',
          detail: 'If you are unable to work, TNS benefits are limited: dedicated protection insurance safeguards your income and your business.',
        });
      }
      break;
    case 'president_sas':
      note = 'SAS chairman: treated as an employee for social-security purposes, so well covered socially, but without unemployment insurance and with a compensation-versus-dividends balance to manage.';
      opportunites.push({
        titre: 'Balance compensation and dividends',
        detail: 'A PER and life insurance can turn part of your income into long-term savings, within a controlled tax framework.',
      });
      break;
    case 'profession_liberale':
      note = 'Liberal profession: a dedicated pension fund, often less generous than the general regime, and variable income.';
      opportunites.push({
        titre: 'Smooth out variable income',
        detail: 'Saving more in the good years through a PER and life insurance offsets the lean years and prepares for retirement.',
      });
      break;
    case 'sportif_pro':
      note = 'Professional athlete: high income but concentrated over a short career. Every year counts double.';
      opportunites.push({
        titre: 'Capitalise during your peak-earning years',
        detail: 'Turning part of your career income into wealth (life insurance, real estate) secures your life after competition.',
      });
      risques.push({
        titre: 'Prepare for the transition ahead',
        detail: 'Injury or the end of a career can come early: stronger protection insurance and a solid emergency fund are priorities.',
      });
      break;
    case 'salarie':
    case 'cadre':
      opportunites.push({
        titre: 'Activate your employee savings plans',
        detail: 'PEE (Plan d’Épargne Entreprise, an employer savings plan) and PERCO, together with employer matching, combine with an individual PER to prepare for retirement effectively.',
      });
      break;
    case 'fonctionnaire':
      opportunites.push({
        titre: 'Top up your pension',
        detail: 'Public-sector pensions are calculated excluding bonuses: an individual PER helps close part of the gap with your working income.',
      });
      break;
    default:
      break;
  }
  return { note, opportunites, risques };
}

// Priorities: the weakest pillars, weighted by their importance, cross-referenced with objectives.
function buildPriorities(a: Answers, piliers: PillarScore[]): Insight[] {
  const ranked = [...piliers]
    .map((p) => ({ p, gap: (100 - p.score) * (p.weight / 100) }))
    .sort((x, y) => y.gap - x.gap)
    .slice(0, 3);

  const map: Record<string, Insight> = {
    precaution: { titre: 'Build your safety cushion', detail: 'Goal: 3 to 6 months of available expenses before any investment.' },
    endettement: { titre: 'Ease your debt load', detail: 'Look into a buyout or renegotiation to regain some room to manoeuvre.' },
    effort_epargne: { titre: 'Automate your savings', detail: 'Set up a standing order, even a modest one, to build the habit.' },
    diversification: { titre: 'Diversify your assets', detail: 'Balance real estate, guaranteed funds and unit-linked funds according to your profile.' },
    retraite: { titre: 'Structure your retirement', detail: 'Open or fund a dedicated vehicle to build capital over the long term.' },
    protection: { titre: 'Protect your loved ones', detail: 'Set up protection insurance and check your beneficiary clauses.' },
    fiscalite: { titre: 'Reduce your tax bill', detail: 'Activate the levers suited to your tax bracket (PER, real estate, dedicated vehicles).' },
  };

  return ranked.map((r) => map[r.p.key]).filter(Boolean);
}

// 12-month action plan, derived from the priorities.
function buildPlan(priorites: Insight[]): ActionTrimestre[] {
  const periods = ['Months 1 to 3', 'Months 4 to 6', 'Months 7 to 9', 'Months 10 to 12'];
  const base: ActionTrimestre[] = [
    { periode: periods[0], titre: 'Take stock with an advisor', detail: 'Confirm the figures from this diagnostic and set the course with Le Chêne Patrimonial.' },
  ];
  priorites.slice(0, 3).forEach((pr, i) => {
    base.push({ periode: periods[i + 1] ?? periods[3], titre: pr.titre, detail: pr.detail });
  });
  while (base.length < 4) {
    base.push({
      periode: periods[base.length],
      titre: 'Track and adjust',
      detail: 'Measure the first results and fine-tune the strategy as you go.',
    });
  }
  return base.slice(0, 4);
}

function fmt(v: number): string {
  return Math.round(v).toLocaleString('fr-FR').replace(/[   ]/g, ' ') + ' €';
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------
export function analyse(a: Answers): Diagnostic {
  const d = derive(a);
  const piliers = computePillars(a, d);
  const score = round(piliers.reduce((s, p) => s + (p.score * p.weight) / 100, 0));
  const { niveau, label } = niveauFor(score);
  const per = estimatePER(a, d);
  const base = buildAnalysis(a, d, piliers, per);
  const statut = statutInsights(a);

  // We merge the status-related insights first (they are very telling),
  // then deduplicate by title and cap the list so the reading isn't overwhelmed.
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
    remarquable: 'Your wealth is managed with rigour.',
    solide: 'You have laid solid foundations.',
    a_consolider: 'Your situation is promising but deserves to be structured.',
    fragile: 'Your wealth would benefit from being put in order, step by step.',
  };
  return `${intro[niveau]} Your strongest point: ${fort.label.toLowerCase()}. The main lever for improvement: ${faible.label.toLowerCase()}.`;
}
