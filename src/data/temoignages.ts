// Avis clients affichés sur /avis
//
// Chaque entrée validée par Camil est ajoutée ici. Pour publier un avis reçu
// par email : ajouter un objet { quote, author, role } ci-dessous, puis pousser.
// role est optionnel (ex : "Dirigeant · Paris", "Athlète en reconversion").

export interface Temoignage {
  quote: string;
  author: string;
  role?: string;
}

export const temoignages: Temoignage[] = [
  // En attente de confirmation "vrais clients" avant réactivation :
  // {
  //   quote: "Camil a ce truc rare : il parle chiffres, mais il écoute d'abord. En 3 mois, il a restructuré ma fiscalité de dirigeant et clarifié dix ans d'épargne désorganisée.",
  //   author: 'Thomas R.',
  //   role: 'Dirigeant SaaS · Paris',
  // },
  // {
  //   quote: "Ancien sportif moi-même, je cherchais quelqu'un qui comprenne la gestion d'une carrière courte et intense. Il a tout de suite saisi les enjeux, carrière, reconversion, fiscalité.",
  //   author: 'Léa M.',
  //   role: 'Athlète en reconversion',
  // },
  // {
  //   quote: "Honnêteté désarmante : il m'a conseillé de ne PAS souscrire à un produit que j'avais déjà demandé ailleurs. La confiance s'est construite là.",
  //   author: 'Alexandre D.',
  //   role: 'Particulier dirigeant · Industrie',
  // },
];
