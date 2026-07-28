// Fonction serverless Vercel — génère le PDF du diagnostic patrimonial.
// Le front envoie { answers, diagnostic } (déjà calculé côté client) ; on renvoie
// le PDF en téléchargement direct. Aucune donnée n'est stockée : le rapport est
// remis au visiteur lui-même, rien n'est envoyé à un tiers.

import { buildDiagnosticPdf } from './_lib/diagnostic-pdf.js';

const clip = (s, n) => String(s ?? '').slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const diagnostic = body.diagnostic;
  if (!diagnostic || typeof diagnostic !== 'object' || typeof diagnostic.score !== 'number') {
    return res.status(400).json({ ok: false, error: 'diagnostic_invalide' });
  }

  // On ne garde que le strict nécessaire à la mise en page (pas de PII superflue).
  const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
  const safe = {
    prenom: clip(answers.prenom, 60),
    nom: clip(answers.nom, 60),
  };

  try {
    const pdf = await buildDiagnosticPdf({ answers: safe, diagnostic });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="diagnostic-patrimonial-le-chene.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(pdf);
  } catch (err) {
    console.error('PDF diagnostic failed', err);
    return res.status(500).json({ ok: false, error: 'pdf' });
  }
}
