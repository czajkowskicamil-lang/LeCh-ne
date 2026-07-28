// Fonction serverless Vercel — capture d'un lead "Compte à rebours de l'après-carrière".
// Le sportif termine le simulateur, laisse ses coordonnées, puis :
//   1. valide + filtre le spam (honeypot),
//   2. crée / met à jour le contact dans Brevo (opt-in marketing explicite et facultatif),
//   3. envoie à Camil un récapitulatif du profil,
//   4. envoie au sportif son rapport PDF par email (document transactionnel demandé).
// RGPD : consentement obligatoire, opt-in marketing séparé et facultatif.

import { buildApresCarrierePdf } from './_lib/apres-carriere-pdf.js';

const DEST = 'camil.cz@lechenepatrimonial.com';
const SENDER = { name: 'Site Le Chêne', email: 'etudes@lechenepatrimonial.com' };

const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');
const eur = (n) => (Number.isFinite(+n) ? Math.round(+n).toLocaleString('fr-FR') + ' €' : '—');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  if (body.website) return res.status(200).json({ ok: true }); // honeypot

  const prenom = clean(body.prenom).slice(0, 60);
  const nom = clean(body.nom).slice(0, 60);
  const email = clean(body.email).slice(0, 120);
  const telephone = clean(body.telephone).slice(0, 30);
  const optin = !!body.optin;

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!prenom || !nom || !emailOk) return res.status(400).json({ ok: false, error: 'champs_invalides' });
  if (!telephone) return res.status(400).json({ ok: false, error: 'telephone_requis' });
  if (!body.consent) return res.status(400).json({ ok: false, error: 'consentement_requis' });

  const d = body.data || {};
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) { console.error('BREVO_API_KEY manquante'); return res.status(500).json({ ok: false, error: 'config' }); }

  // 1) Contact Brevo.
  const listId = process.env.BREVO_LIST_APRESCARRIERE
    ? Number(process.env.BREVO_LIST_APRESCARRIERE)
    : process.env.BREVO_LIST_DIAGNOSTIC
    ? Number(process.env.BREVO_LIST_DIAGNOSTIC)
    : null;
  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: prenom,
          LASTNAME: nom,
          ...(telephone ? { TELEPHONE: telephone } : {}),
          CATEGORIE: 'Après-carrière sportif',
          OPT_IN: optin,
        },
        ...(listId ? { listIds: [listId] } : {}),
        updateEnabled: true,
      }),
    });
  } catch (err) { console.error('Brevo contact failed', err); }

  // 2) Récap à Camil.
  const ligne = (k, v) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#7A7566;font-size:13px">${escapeHtml(k)}</td>` +
    `<td style="padding:6px 0;color:#03102E;font-weight:600;font-size:14px;text-align:right">${escapeHtml(v)}</td></tr>`;

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E">
      <p style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#A7801F;margin:0 0 4px">Nouveau lead &middot; compte à rebours après-carrière</p>
      <h2 style="margin:0 0 6px;font-size:20px">${escapeHtml(prenom)} ${escapeHtml(nom)}</h2>
      <div style="display:inline-block;background:#03102E;color:#E6C259;font-family:Georgia,serif;font-size:20px;font-weight:700;padding:8px 18px;border-radius:10px;margin:0 0 10px">Nombre de la liberté : ${escapeHtml(eur(d.nombreLiberte))}</div>
      <p style="margin:0 0 2px;font-size:14px"><a href="mailto:${escapeHtml(email)}" style="color:#0A1F4F">${escapeHtml(email)}</a>${telephone ? ` &middot; ${escapeHtml(telephone)}` : ''}</p>
      <p style="margin:0 0 16px;font-size:12px;color:#7A7566">Opt-in newsletter/marketing : <strong>${optin ? 'OUI' : 'non'}</strong> &middot; Consentement traitement : OUI</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #EDE6D3;border-bottom:1px solid #EDE6D3;margin:0 0 16px">
        ${ligne('Discipline', d.sportLabel || '—')}
        ${ligne('Âge', d.age != null ? d.age + ' ans' : '—')}
        ${ligne('Fin de carrière estimée', d.fin != null ? d.fin + ' ans' : '—')}
        ${ligne('Revenu net annuel', eur(d.revenu))}
        ${ligne('Train de vie annuel', eur(d.depenses))}
        ${ligne('Épargne déjà constituée', eur(d.epargne))}
        ${ligne('Revenu net après carrière', eur(d.apres))}
        ${ligne('Chute de revenu', d.chute != null ? d.chute + ' %' : '—')}
        ${ligne('Date de liberté estimée', d.dateLiberte || '—')}
        ${ligne('À capitaliser / mois', d.versementNecessaire != null ? eur(d.versementNecessaire) : '—')}
        ${ligne("Capacité d'épargne actuelle", d.capaciteMensuelle != null ? eur(d.capaciteMensuelle) : '—')}
      </table>
      <p style="font-size:13px;color:#7A7566;line-height:1.5">Chiffres estimatifs saisis par le visiteur. Prochaine étape : le recontacter pour bâtir son plan d'après-carrière.</p>
    </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST, name: 'Camil Czajkowski' }],
        replyTo: { email, name: `${prenom} ${nom}` },
        subject: `Après-carrière · ${prenom} ${nom}${d.nombreLiberte != null ? ` (${eur(d.nombreLiberte)})` : ''}`,
        htmlContent,
      }),
    });
    if (!r.ok) { console.error('Brevo email error', r.status, await r.text()); return res.status(502).json({ ok: false, error: 'envoi' }); }
  } catch (err) { console.error('Fetch Brevo failed', err); return res.status(502).json({ ok: false, error: 'envoi' }); }

  // 3) PDF au sportif.
  if (typeof d.nombreLiberte === 'number') {
    try {
      const pdf = await buildApresCarrierePdf({ prenom, nom, data: d });
      const visitorHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E;line-height:1.55">
          <p style="font-size:15px">Bonjour ${escapeHtml(prenom)},</p>
          <p style="font-size:15px">Merci d'avoir utilisé le compte à rebours de l'après-carrière. Vous trouverez <strong>votre rapport en pièce jointe</strong> (PDF), avec votre nombre de la liberté de <strong>${escapeHtml(eur(d.nombreLiberte))}</strong> et vos leviers d'action.</p>
          <p style="font-size:15px">La carrière est courte, l'après se prépare pendant. Camil Czajkowski vous recontacte prochainement. Vous pouvez aussi réserver directement un créneau&nbsp;:</p>
          <p style="margin:22px 0"><a href="https://calendly.com/camil-cz-lechenepatrimonial/30min" style="background:#0A1F4F;color:#E6C259;text-decoration:none;padding:12px 26px;border-radius:100px;font-weight:bold;font-size:14px">Prendre rendez-vous (30 min)</a></p>
          <p style="font-size:15px">À très bientôt,<br>Camil Czajkowski<br><span style="color:#7A7566">Le Chêne Patrimonial</span></p>
          <p style="font-size:11px;color:#9a9484;border-top:1px solid #EDE6D3;padding-top:14px;margin-top:22px">Vous recevez cet email car vous avez utilisé notre simulateur sur lechenepatrimonial.com. Vos données ne sont pas revendues. Pour exercer vos droits d'accès, de rectification ou de suppression : camil.cz@lechenepatrimonial.com.</p>
        </div>`;
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: SENDER,
          to: [{ email, name: `${prenom} ${nom}` }],
          subject: "Votre compte à rebours de l'après-carrière · Le Chêne Patrimonial",
          htmlContent: visitorHtml,
          attachment: [{ name: 'apres-carriere-le-chene.pdf', content: pdf.toString('base64') }],
        }),
      });
    } catch (err) { console.error('Envoi PDF visiteur échoué', err); }
  }

  return res.status(200).json({ ok: true });
}
