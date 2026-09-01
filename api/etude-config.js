// Fonction serverless Vercel — expose au front l'état de l'offre « Étude
// patrimoniale » : est-elle payante et active, et à quel prix.
//
// Raison d'être : le prix et l'activation ne doivent jamais être figés dans le
// HTML. Tant que STRIPE_SECRET_KEY est absente, la page ne doit afficher aucun
// tarif et se contenter de transmettre la demande à Camil. Dès que la clé est
// posée, le tarif apparaît sans toucher au code ni redéployer.
//
// Variables d'environnement :
//   STRIPE_SECRET_KEY   — présence = offre payante active
//   ETUDE_PRICE_CENTS   — prix en centimes (défaut : 14900, soit 149 €)

export const ETUDE_PRICE_DEFAUT = 14900;

export function prixCentimes() {
  const brut = parseInt(process.env.ETUDE_PRICE_CENTS || '', 10);
  if (!Number.isFinite(brut) || brut < 100 || brut > 500000) return ETUDE_PRICE_DEFAUT;
  return brut;
}

export function prixLabel(cents) {
  const euros = cents / 100;
  const entier = Number.isInteger(euros);
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: entier ? 0 : 2,
    maximumFractionDigits: entier ? 0 : 2,
  }).format(euros);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const actif = Boolean(process.env.STRIPE_SECRET_KEY);
  const cents = prixCentimes();

  // Cache court : le front interroge à chaque visite, inutile de réveiller la
  // fonction à chaque fois, mais un changement de tarif doit se voir vite.
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  return res.status(200).json({
    ok: true,
    actif,
    prixCents: actif ? cents : null,
    prixLabel: actif ? prixLabel(cents) : null,
    prixLabelEn: actif
      ? new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: Number.isInteger(cents / 100) ? 0 : 2,
          maximumFractionDigits: Number.isInteger(cents / 100) ? 0 : 2,
        }).format(cents / 100)
      : null,
  });
}
