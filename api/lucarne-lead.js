// Fonction serverless Vercel — capture d'une recherche déposée sur Lucarne.
//
// Le visiteur répond à un questionnaire (projet, critères, situation), puis
// laisse ses coordonnées. Ici :
//   1. validation + filtre anti-spam (honeypot),
//   2. contact Brevo créé/mis à jour dans la liste Lucarne,
//   3. email récapitulatif à Camil avec toutes les réponses.
//
// Volontairement AUCUN email automatique au visiteur : la reprise de contact
// reste humaine et décidée par Camil. RGPD : consentement obligatoire, opt-in
// newsletter séparé et facultatif.

const DEST = 'camil.cz@lechenepatrimonial.com';
const SENDER = { name: 'Lucarne', email: 'etudes@lechenepatrimonial.com' };
const LETTRE_LIST_ID = 3; // « La Lettre du Chêne - Abonnés » : opt-in obligatoire.
const LUCARNE_LIST_ID = 15; // « Lucarne - Leads portail », aucune automation branchée.

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  if (body.website) return res.status(200).json({ ok: true }); // honeypot

  const prenom = clean(body.prenom).slice(0, 60);
  const nom = clean(body.nom).slice(0, 60);
  const email = clean(body.email).slice(0, 120);
  const telephone = clean(body.telephone).slice(0, 30);
  const optin = !!body.optin;
  const projet = clean(body.projet).slice(0, 80) || 'Non précisé';

  // [{ label, value }] : les réponses du questionnaire, dans l'ordre.
  const reponses = Array.isArray(body.reponses) ? body.reponses.slice(0, 30) : [];

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!prenom || !emailOk) return res.status(400).json({ ok: false, error: 'champs_invalides' });
  if (!body.consent) return res.status(400).json({ ok: false, error: 'consentement_requis' });

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY manquante');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  // Résumé compact des réponses, pour l'attribut Brevo et le CRM.
  const resume = reponses
    .map((r) => `${clean(r.label)} : ${clean(String(r.value ?? ''))}`)
    .join(' · ')
    .slice(0, 250);

  // 1) Contact Brevo.
  const listIds = [LUCARNE_LIST_ID];
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
          CATEGORIE: 'Lead Lucarne',
          OPT_IN: optin,
          LUCARNE_BIEN: projet,
          LUCARNE_MESSAGE: resume,
        },
        listIds,
        updateEnabled: true,
      }),
    });
  } catch (err) {
    console.error('Brevo contact failed', err);
  }

  // 2) Email récapitulatif à Camil.
  const ligne = (k, v) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#7A7566;font-size:13px;vertical-align:top">${escapeHtml(k)}</td>` +
    `<td style="padding:6px 0;color:#03102E;font-weight:600;font-size:14px;text-align:right">${escapeHtml(v)}</td></tr>`;

  const rowsHtml = reponses
    .map((r) => ligne(clean(r.label), clean(String(r.value ?? ''))))
    .join('');

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E">
      <p style="font-size:13px;color:#4C5526;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Nouvelle recherche &middot; Lucarne</p>
      <p style="margin:0 0 2px;font-size:17px;font-weight:700">${escapeHtml(prenom)} ${escapeHtml(nom)}</p>
      <p style="margin:0 0 2px;font-size:14px"><a href="mailto:${escapeHtml(email)}" style="color:#0A1F4F">${escapeHtml(email)}</a>${telephone ? ` &middot; <a href="tel:${escapeHtml(telephone)}" style="color:#0A1F4F">${escapeHtml(telephone)}</a>` : ''}</p>
      <p style="margin:0 0 18px;font-size:12px;color:#7A7566">Projet : <strong>${escapeHtml(projet)}</strong> &middot; Opt-in newsletter : <strong>${optin ? 'OUI' : 'non'}</strong> &middot; Consentement : OUI</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #EDE6D3">${rowsHtml}</table>
      <p style="font-size:13px;color:#7A7566;line-height:1.5;margin-top:16px">Recherche déposée sur Lucarne. Aucun email automatique n'a été envoyé au visiteur : la reprise de contact est à faire à la main.</p>
    </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST, name: 'Camil Czajkowski' }],
        replyTo: { email, name: `${prenom} ${nom}`.trim() },
        subject: `Lucarne · ${projet} · ${prenom} ${nom}`.trim(),
        htmlContent,
      }),
    });
    if (!r.ok) {
      console.error('Brevo email error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'envoi' });
    }
  } catch (err) {
    console.error('Fetch Brevo failed', err);
    return res.status(502).json({ ok: false, error: 'envoi' });
  }

  return res.status(200).json({ ok: true });
}
