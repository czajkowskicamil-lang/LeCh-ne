// Diagnostic Patrimonial Intelligent — Le Chêne Patrimonial
// Types partagés entre le questionnaire, le moteur de scoring et la restitution.
// Aucune dépendance : ce module est importable côté client (script Astro) comme
// côté serveur (fonction Vercel pour le PDF / le lead).

export type SituationFamiliale = 'celibataire' | 'couple' | 'marie_pacse' | 'divorce' | 'veuf';

export type StatutPro =
  | 'salarie'
  | 'cadre'
  | 'micro_entrepreneur'
  | 'independant_tns'
  | 'profession_liberale'
  | 'gerant_sarl'
  | 'president_sas'
  | 'dirigeant'
  | 'sportif_pro'
  | 'fonctionnaire'
  | 'retraite'
  | 'sans_activite';

// Ancienneté d'activité : sert notamment à situer la CFE (exonérée l'année de
// création, due à partir de l'année suivante) et la montée en charge des cotisations.
export type Anciennete = 'moins_1an' | '1_a_2ans' | 'plus_2ans';

export type Logement = 'locataire' | 'proprietaire_credit' | 'proprietaire' | 'heberge';

export type Tmi = 0 | 11 | 30 | 41 | 45;

export type Prevoyance = 'oui' | 'partiel' | 'non' | 'ne_sais_pas';

export type Horizon = 'court' | 'moyen' | 'long' | 'tres_long';

export type Risque = 'securite' | 'prudent' | 'equilibre' | 'dynamique';

export type Objectif =
  | 'retraite'
  | 'reduire_impots'
  | 'investir_immobilier'
  | 'faire_fructifier'
  | 'proteger_famille'
  | 'transmettre'
  | 'residence_principale'
  | 'constituer_epargne'
  | 'revenus_complementaires';

// Réponses collectées au fil du parcours. Tout est optionnel pendant la saisie ;
// le moteur applique des valeurs neutres pour les champs laissés vides.
export interface Answers {
  age?: number;
  situation?: SituationFamiliale;
  enfants?: number;
  statut?: StatutPro;
  anciennete?: Anciennete; // pour les statuts indépendants (CFE, cotisations, prévoyance)
  revenuMensuel?: number; // net du foyer, par mois
  chargesMensuelles?: number; // charges courantes hors crédits, par mois
  epargneMensuelle?: number; // capacité d'épargne réellement mise de côté, par mois
  logement?: Logement;
  valeurRP?: number; // valeur estimée de la résidence principale
  immoLocatif?: number; // valeur du patrimoine immobilier locatif
  epargneDispo?: number; // livrets, comptes, épargne de précaution disponible
  assuranceVie?: number; // encours assurance-vie
  per?: number; // encours PER / épargne retraite
  autresPlacements?: number; // SCPI, private equity, autres supports assurantiels/immobiliers
  bourse?: number; // PEA, compte-titres, actions, crypto (hors périmètre conseil, pris en compte pour la photo)
  creditCRD?: number; // capital restant dû, tous crédits confondus
  creditMensualite?: number; // total des mensualités de crédit, par mois
  tmi?: Tmi; // tranche marginale d'imposition
  prevoyance?: Prevoyance;
  objectifs?: Objectif[];
  horizon?: Horizon;
  risque?: Risque;
}

export type Niveau = 'fragile' | 'a_consolider' | 'solide' | 'remarquable';

export interface PillarScore {
  key: PillarKey;
  label: string;
  score: number; // 0..100 propre au pilier
  weight: number; // poids dans l'indice global
  note: string; // phrase de lecture du pilier
}

export type PillarKey =
  | 'precaution'
  | 'endettement'
  | 'effort_epargne'
  | 'diversification'
  | 'retraite'
  | 'protection'
  | 'fiscalite';

export interface Insight {
  titre: string;
  detail: string;
}

export interface ActionTrimestre {
  periode: string; // ex. "Mois 1 à 3"
  titre: string;
  detail: string;
}

export interface Repartition {
  label: string;
  montant: number;
  part: number; // 0..100
  color: string;
}

export interface Diagnostic {
  score: number; // indice global /100
  niveau: Niveau;
  niveauLabel: string;
  resume: string; // explication du score en une phrase
  statutNote?: string; // lecture liée au statut professionnel
  piliers: PillarScore[];
  forces: Insight[];
  faiblesses: Insight[];
  opportunites: Insight[];
  risques: Insight[];
  priorites: Insight[];
  plan: ActionTrimestre[];
  repartition: Repartition[];
  // Chiffres clés dérivés (affichés + transmis à Camil).
  patrimoineBrut: number;
  patrimoineNet: number;
  moisPrecaution: number;
  tauxEndettement: number; // %
  tauxEpargne: number; // %
  poidsImmo: number; // %
  economieFiscaleEstimee: number; // € / an, piste PER
  perVersementSuggere: number; // € / an
}
