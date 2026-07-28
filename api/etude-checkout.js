// Fonction serverless Vercel — crée une session Stripe Checkout pour l'étude
// patrimoniale (10 €). Si Stripe n'est pas encore configuré (clé absente),
// renvoie { error: 'stripe_absent' } : le front bascule alors sur la simple
// transmission de la demande à Camil, sans casser le parcours.
import Stripe from 'stripe';

const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  if (body.website) return res.status(200).json({ ok: false, error: 'spam' });

  const prenom = clean(body.prenom).slice(0, 60);
  const nom = clean(body.nom).slice(0, 60);
  const email = clean(body.email).slice(0, 120);
  const telephone = clean(body.telephone).slice(0, 30);
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!prenom || !nom || !emailOk) return res.status(400).json({ ok: false, error: 'champs_invalides' });
  if (!body.consent) return res.status(400).json({ ok: false, error: 'consentement_requis' });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    // Stripe pas encore branché : le front prend le relais (transmission à Camil).
    return res.status(200).json({ ok: false, error: 'stripe_absent' });
  }

  const site = process.env.PUBLIC_SITE_URL || 'https://www.lechenepatrimonial.com';
  const d = body.diagnostic || {};
  const metadata = {
    prenom, nom, email,
    telephone: telephone || '',
    tmi: d.tmi != null ? String(d.tmi) : '',
    impot: d.impot != null ? String(d.impot) : '',
    interet: (d.interet || '').toString().slice(0, 400),
    optin: body.optin ? 'oui' : 'non',
  };

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      locale: 'fr',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'eur',
          unit_amount: 1000, // 10,00 €
          product_data: {
            name: 'Étude patrimoniale personnalisée',
            description: 'Votre bilan patrimonial complet en PDF, établi à votre nom.',
          },
        },
      }],
      metadata,
      success_url: `${site}/outils/etude-patrimoniale/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/outils/etude-patrimoniale?paiement=annule`,
    });
    return res.status(200).json({ ok: true, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err && err.message);
    return res.status(502).json({ ok: false, error: 'stripe_erreur' });
  }
}
