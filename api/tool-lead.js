// Fonction serverless Vercel — capture générique d'un lead depuis une calculatrice.
// Le visiteur termine un outil, demande son résultat en PDF, puis :
//   1. validation + filtre anti-spam (honeypot),
//   2. contact Brevo créé/mis à jour (liste Outils + Lettre du Chêne UNIQUEMENT si opt-in),
//   3. email récapitulatif à Camil,
//   4. email au visiteur avec son résultat en PDF (document transactionnel demandé).
// RGPD : consentement obligatoire ; opt-in newsletter séparé et facultatif ; aucune fuite.
import { buildToolPdf } from './_lib/tool-pdf.js';

const DEST = 'camil.cz@lechenepatrimonial.com';
const SENDER = { name: 'Site Le Chêne', email: 'etudes@lechenepatrimonial.com' };
const LETTRE_LIST_ID = 3; // « La Lettre du Chêne - Abonnés » : marketing, opt-in obligatoire.

const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  if (body.website) return res.status(200).json({ ok: true }); // honeypot

  const tool = clean(body.tool).slice(0, 80) || 'Outil';
  const titre = clean(body.titre).slice(0, 120) || tool;
  const sousTitre = clean(body.sousTitre).slice(0, 120);
  const prenom = clean(body.prenom).slice(0, 60);
  const nom = clean(body.nom).slice(0, 60);
  const email = clean(body.email).slice(0, 120);
  const telephone = clean(body.telephone).slice(0, 30);
  const optin = !!body.optin;
  const rows = Array.isArray(body.rows) ? body.rows.slice(0, 40) : [];

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!prenom || !emailOk) return res.status(400).json({ ok: false, error: 'champs_invalides' });
  if (!body.consent) return res.status(400).json({ ok: false, error: 'consentement_requis' });

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) { console.error('BREVO_API_KEY manquante'); return res.status(500).json({ ok: false, error: 'config' }); }

  // 1) Contact Brevo : liste Outils (suivi) + Lettre UNIQUEMENT si opt-in explicite.
  const listId = process.env.BREVO_LIST_OUTILS
    ? Number(process.env.BREVO_LIST_OUTILS)
    : process.env.BREVO_LIST_DIAGNOSTIC
    ? Number(process.env.BREVO_LIST_DIAGNOSTIC)
    : null;
  const listIds = [];
  if (listId) listIds.push(listId);
  if (optin) listIds.push(LETTRE_LIST_ID);
  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: prenom,
          ...(nom ? { LASTNAME: nom } : {}),
          ...(telephone ? { TELEPHONE: telephone } : {}),
          CATEGORIE: tool,
          OPT_IN: optin,
        },
        ...(listIds.length ? { listIds } : {}),
        updateEnabled: true,
      }),
    });
  } catch (err) { console.error('Brevo contact failed', err); }

  // 2) Email récapitulatif à Camil.
  const ligne = (k, v) =>
    `<tr><td style="padding:5px 14px 5px 0;color:#7A7566;font-size:13px">${escapeHtml(k)}</td>` +
    `<td style="padding:5px 0;color:#03102E;font-weight:600;font-size:14px;text-align:right">${escapeHtml(v)}</td></tr>`;
  const rowsHtml = rows.map((r) => ligne(clean(r.label), clean(String(r.value == null ? '' : r.value)))).join('');
  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E">
      <p style="font-size:13px;color:#A7801F;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Nouveau lead outil · ${escapeHtml(tool)}</p>
      <p style="margin:0 0 2px;font-size:17px;font-weight:700">${escapeHtml(prenom)} ${escapeHtml(nom)}</p>
      <p style="margin:0 0 2px;font-size:14px"><a href="mailto:${escapeHtml(email)}" style="color:#0A1F4F">${escapeHtml(email)}</a>${telephone ? ` &middot; ${escapeHtml(telephone)}` : ''}</p>
      <p style="margin:0 0 16px;font-size:12px;color:#7A7566">Opt-in newsletter : <strong>${optin ? 'OUI' : 'non'}</strong> &middot; Consentement traitement : OUI</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #EDE6D3">${rowsHtml}</table>
      <p style="font-size:13px;color:#7A7566;line-height:1.5;margin-top:14px">Résultat estimé saisi par le visiteur sur ${escapeHtml(tool)}. Prochaine étape : le recontacter.</p>
    </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST, name: 'Camil Czajkowski' }],
        replyTo: { email, name: `${prenom} ${nom}`.trim() },
        subject: `Lead outil · ${tool} · ${prenom} ${nom}`.trim(),
        htmlContent,
      }),
    });
    if (!r.ok) { console.error('Brevo email error', r.status, await r.text()); return res.status(502).json({ ok: false, error: 'envoi' }); }
  } catch (err) { console.error('Fetch Brevo failed', err); return res.status(502).json({ ok: false, error: 'envoi' }); }

  // 3) PDF au visiteur.
  try {
    const pdf = await buildToolPdf({ tool, titre, sousTitre, prenom, nom, rows, intro: body.intro, note: body.note });
    const visitorHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E;line-height:1.55">
        <p style="font-size:15px">Bonjour ${escapeHtml(prenom)},</p>
        <p style="font-size:15px">Merci d'avoir utilisé notre simulateur <strong>${escapeHtml(titre)}</strong>. Vous trouverez <strong>votre résultat détaillé en pièce jointe</strong> (PDF).</p>
        <p style="font-size:15px">Ce chiffre est une estimation. Pour l'adapter à votre situation réelle, échangeons 30 minutes&nbsp;:</p>
        <p style="margin:22px 0"><a href="https://calendly.com/camil-cz-lechenepatrimonial/30min" style="background:#0A1F4F;color:#E6C259;text-decoration:none;padding:12px 26px;border-radius:100px;font-weight:bold;font-size:14px">Prendre rendez-vous (30 min)</a></p>
        <p style="font-size:15px">À très bientôt,<br>Camil Czajkowski<br><span style="color:#7A7566">Le Chêne Patrimonial</span></p>
        <p style="font-size:11px;color:#9a9484;border-top:1px solid #EDE6D3;padding-top:14px;margin-top:22px">Vous recevez cet email car vous avez utilisé un simulateur sur lechenepatrimonial.com. Vos données ne sont pas revendues. Pour exercer vos droits d'accès, de rectification ou de suppression : camil.cz@lechenepatrimonial.com.</p>
      </div>`;
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email, name: `${prenom} ${nom}`.trim() }],
        subject: `Votre résultat · ${titre} · Le Chêne Patrimonial`,
        htmlContent: visitorHtml,
        attachment: [{ name: 'resultat-le-chene.pdf', content: pdf.toString('base64') }],
      }),
    });
  } catch (err) { console.error('Envoi PDF visiteur échoué', err); }

  return res.status(200).json({ ok: true });
}
