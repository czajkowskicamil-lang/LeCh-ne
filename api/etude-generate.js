// Fonction serverless Vercel — après paiement Stripe, produit et délivre le PDF.
// Sécurité : vérifie que la session Checkout est bien PAYÉE avant de générer.
// Envoie le PDF au client (copie cachée à Camil) et le renvoie pour téléchargement.
import Stripe from 'stripe';
import { buildEtudePdf } from './_lib/pdf.js';

const CAMIL = 'camil.cz@lechenepatrimonial.com';
const SENDER = { name: 'Le Chêne Patrimonial', email: 'etudes@lechenepatrimonial.com' };

// Lien de réservation de la restitution comprise dans l'étude. Surchageable par
// PUBLIC_CALENDLY_URL, comme partout ailleurs sur le site (voir src/data/site.ts).
const RESTITUTION_URL =
  process.env.PUBLIC_CALENDLY_URL || 'https://calendly.com/camil-cz-lechenepatrimonial/30min';

const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');
const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const sessionId = clean(body.session_id).slice(0, 200);
  if (!sessionId) return res.status(400).json({ ok: false, error: 'session_absente' });

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return res.status(500).json({ ok: false, error: 'config' });

  // 1) Vérifier le paiement
  let session;
  try {
    const stripe = new Stripe(secret);
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error('Stripe retrieve error', err && err.message);
    return res.status(400).json({ ok: false, error: 'session_invalide' });
  }
  if (!session || session.payment_status !== 'paid') {
    return res.status(402).json({ ok: false, error: 'non_paye' });
  }

  // 2) Construire le PDF
  const analysis = body.analysis || {};
  const meta = session.metadata || {};
  const prenom = clean(analysis.prenom || meta.prenom || '').slice(0, 60);
  const nom = clean(analysis.nom || meta.nom || '').slice(0, 60);
  const email = clean(session.customer_details?.email || session.customer_email || analysis.email || meta.email || '').slice(0, 120);

  let pdfBuffer;
  try {
    pdfBuffer = await buildEtudePdf({
      prenom, nom,
      diag: analysis.diag || {},
      lecture: Array.isArray(analysis.lecture) ? analysis.lecture.slice(0, 20) : [],
      optim: Array.isArray(analysis.optim) ? analysis.optim.slice(0, 20) : [],
    });
  } catch (err) {
    console.error('PDF build error', err && err.message);
    return res.status(500).json({ ok: false, error: 'pdf' });
  }
  const pdfBase64 = pdfBuffer.toString('base64');
  const filename = `Etude-patrimoniale-${(nom || 'LeChene').replace(/[^A-Za-z0-9]/g, '')}.pdf`;

  // 3) Envoyer par email (client + copie Camil). Best effort : n'échoue pas le
  //    téléchargement si l'email ne part pas.
  const apiKey = process.env.BREVO_API_KEY;
  if (apiKey && email) {
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#03102E">
        <p style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#A7801F;margin:0 0 4px">Le Chêne Patrimonial</p>
        <h2 style="margin:0 0 16px;font-size:20px">Votre étude patrimoniale, ${escapeHtml(prenom)}</h2>
        <p style="font-size:15px;line-height:1.6;color:#0A1F4F">Merci de votre confiance. Vous trouverez en pièce jointe votre étude patrimoniale personnalisée : diagnostic fiscal, lecture de votre patrimoine et pistes d'optimisation.</p>
        <p style="font-size:15px;line-height:1.6;color:#0A1F4F">Il reste une étape, comprise dans votre étude : votre restitution en visio avec moi. Nous passons en revue vos priorités, et je réponds à vos questions. Choisissez le créneau qui vous arrange.</p>
        <p style="margin:22px 0"><a href="${RESTITUTION_URL}" style="background:#D4A82D;color:#0c1f3c;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:10px;display:inline-block">Réserver ma restitution</a></p>
        <hr style="border:none;border-top:1px solid #EDE6D3;margin:20px 0">
        <p style="font-size:12px;color:#7A7566;line-height:1.5">Camil Czajkowski, Le Chêne Patrimonial<br>Estimation indicative, ne constitue pas un conseil personnalisé au sens réglementaire.</p>
      </div>`;
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: SENDER,
          to: [{ email, name: `${prenom} ${nom}`.trim() }],
          bcc: [{ email: CAMIL, name: 'Camil Czajkowski' }],
          subject: `Votre étude patrimoniale : ${prenom} ${nom}`.trim(),
          htmlContent: html,
          attachment: [{ name: filename, content: pdfBase64 }],
        }),
      });
    } catch (err) {
      console.error('Brevo send (generate) failed', err && err.message);
    }
  }

  return res.status(200).json({ ok: true, pdf: pdfBase64, filename });
}
