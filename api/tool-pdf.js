// Fonction serverless Vercel — génère le PDF d'un résultat d'outil et le renvoie
// en téléchargement direct. Générique : chaque calculatrice poste son titre + ses lignes.
import { buildToolPdf } from './_lib/tool-pdf.js';

const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const tool = clean(body.tool).slice(0, 80);
  const titre = clean(body.titre).slice(0, 120) || tool || 'Votre simulation';
  const sousTitre = clean(body.sousTitre).slice(0, 120);
  const prenom = clean(body.prenom).slice(0, 60);
  const nom = clean(body.nom).slice(0, 60);
  const rows = Array.isArray(body.rows) ? body.rows.slice(0, 40) : [];

  try {
    const pdf = await buildToolPdf({ tool, titre, sousTitre, prenom, nom, rows, intro: body.intro, note: body.note });
    const slug = (tool || 'resultat')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${slug || 'resultat'}-le-chene.pdf"`);
    return res.status(200).send(pdf);
  } catch (err) {
    console.error('tool-pdf failed', err);
    return res.status(500).json({ ok: false, error: 'pdf' });
  }
}
