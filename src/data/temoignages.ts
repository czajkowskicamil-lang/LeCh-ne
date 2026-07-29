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
  {
    quote:
      "Excellent travail de Camil, après explication de ma situation il en déduit mon besoin, la stratégie à adopter et le produit sur lequel investir. Il a été impliqué tout au long du processus et continue de m'accompagner. Un gestionnaire de patrimoine qui s'adapte à votre situation et qui n'est pas seulement là pour vous vendre quelque chose.",
    author: 'Hugo Lagrange',
    role: 'Cadre',
  },
  {
    quote:
      "Étant client du Chêne Patrimonial depuis peu, je dois dire que leur accompagnement me rend bien plus serein à propos du développement de mon patrimoine. Limpide et disponible, je note que la plateforme se développe de semaine en semaine et propose maintenant des outils d'estimation ludiques et clairs. Je remercie sincèrement son fondateur. Je recommande à quiconque.",
    author: 'Kévin Monier',
  },
  {
    quote:
      "Je recommande vivement Camil. Il m'accompagne avec beaucoup de professionnalisme et de bienveillance dans mon projet. Toujours disponible, à l'écoute et de bon conseil, il prend le temps de répondre à toutes mes questions et me guide à chaque étape. Son expertise et son soutien me permettent d'avancer en toute confiance. Un grand merci à Camil pour cet accompagnement de qualité !",
    author: 'Temenuzhka Nikolova',
  },
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
