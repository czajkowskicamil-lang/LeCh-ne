// Fonction serverless Vercel — génère le PDF "À quel âge serez-vous libre ?".
// Le front envoie { prenom, nom, data } ; on renvoie le PDF en téléchargement direct.

import { buildLiberteFinancierePdf } from './_lib/liberte-financiere-pdf.js';

const clip = (s, n) => String(s ?? '').slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const data = body.data && typeof body.data === 'object' ? body.data : null;
  if (!data || typeof data.capitalLiberte !== 'number') {
    return res.status(400).json({ ok: false, error: 'data_invalide' });
  }

  try {
    const pdf = await buildLiberteFinancierePdf({
      prenom: clip(body.prenom, 60), nom: clip(body.nom, 60), data,
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="liberte-financiere-le-chene.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(pdf);
  } catch (err) {
    console.error('PDF liberté financière failed', err);
    return res.status(500).json({ ok: false, error: 'pdf' });
  }
}
