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
  {
    quote:
      "Camil a vraiment pris le temps de répondre à toutes mes interrogations. Il a été très à l'écoute, disponible et a consacré le temps nécessaire pour expliquer les choses avec clarté. Merci Camil, pour ton accompagnement de qualité !! Je reprendrai contact avec toi, c'est certain !",
    author: 'Lucia M',
    role: 'Lyon',
  },
  {
    quote:
      "Je recommande Camil pour son excellent suivi. Il est très disponible et prend le temps d'expliquer les mécanismes financiers de manière claire et accessible. Ses conseils sont pertinents, pragmatiques et permettent de prendre des décisions en toute confiance. Un grand merci pour ce professionnalisme.",
    author: 'Véronique P.',
    role: 'Baden-Baden',
  },
  {
    quote:
      "Un grand merci à Camil pour son accompagnement, ses conseils et son professionnalisme dans mes investissements, notamment sur les produits obligataires et l'assurance-vie. Il a su prendre le temps de m'expliquer les différentes possibilités et de me proposer des solutions adaptées à mes objectifs. Je regrette simplement de ne pas avoir connu Camil plus tôt, notamment pendant ma carrière d'athlète professionnel : j'aurais certainement pu mieux faire fructifier mon épargne ! Je recommande vivement Camil et Le Chêne Patrimonial pour la qualité de l'accompagnement et la confiance qu'ils inspirent.",
    author: 'Slobodan Ocokoljic',
    role: 'Athlète professionnel',
  },
  {
    quote:
      "I highly recommend Camil for anyone looking for clear, reliable advice on choosing the right tax regime and legal structure for their business. From our first consultation, he was efficient, precise and genuinely helpful. What I particularly appreciated was his ability to take complex tax and business matters and explain them in clear, everyday language that anyone can understand. He clearly has an impressive command of tax matters and knows the subject inside out. His advice helped me make informed decisions with confidence, rather than feeling overwhelmed by complicated rules and options. Professional, knowledgeable, responsive, and, above all, someone who knows how to turn complex information into practical advice.",
    author: 'Aleksandra Ocokoljic',
    role: 'Entrepreneure',
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
