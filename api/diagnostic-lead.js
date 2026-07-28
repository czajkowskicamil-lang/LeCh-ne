// Fonction serverless Vercel — capture d'un lead "Diagnostic patrimonial".
// Le visiteur termine le diagnostic gratuit sur /outils/diagnostic-patrimonial,
// puis demande à être recontacté. Cette fonction :
//   1. valide + filtre le spam (honeypot),
//   2. crée / met à jour le contact dans Brevo (opt-in marketing explicite et facultatif),
//   3. envoie à Camil un récapitulatif du diagnostic par email.
// RGPD : consentement obligatoire, opt-in marketing séparé et facultatif.
// Aucun email n'est envoyé automatiquement au visiteur : Camil reprend la main.

const DEST = 'camil.cz@lechenepatrimonial.com';
const SENDER = { name: 'Site Le Chêne', email: 'etudes@lechenepatrimonial.com' };

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');
const eur = (n) => (Number.isFinite(+n) ? Math.round(+n).toLocaleString('fr-FR') + ' €' : '—');

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

  // Anti-spam : champ piège (honeypot).
  if (body.website) return res.status(200).json({ ok: true });

  const prenom = clean(body.prenom).slice(0, 60);
  const nom = clean(body.nom).slice(0, 60);
  const email = clean(body.email).slice(0, 120);
  const telephone = clean(body.telephone).slice(0, 30);
  const optin = !!body.optin;

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!prenom || !nom || !emailOk) {
    return res.status(400).json({ ok: false, error: 'champs_invalides' });
  }
  if (!body.consent) {
    return res.status(400).json({ ok: false, error: 'consentement_requis' });
  }

  const d = body.diagnostic || {};
  const ligne = (k, v) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#7A7566;font-size:13px">${escapeHtml(k)}</td>` +
    `<td style="padding:6px 0;color:#03102E;font-weight:600;font-size:14px;text-align:right">${escapeHtml(v)}</td></tr>`;

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY manquante');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  // 1) Contact Brevo (création / mise à jour).
  const listId = process.env.BREVO_LIST_DIAGNOSTIC
    ? Number(process.env.BREVO_LIST_DIAGNOSTIC)
    : process.env.BREVO_LIST_ETUDES
    ? Number(process.env.BREVO_LIST_ETUDES)
    : null;
  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        email,
        attributes: {
          PRENOM: prenom,
          NOM: nom,
          ...(telephone ? { SMS: telephone } : {}),
          SOURCE: 'Diagnostic patrimonial',
          SCORE_DIAG: d.score != null ? String(d.score) : '',
          OPTIN_MARKETING: optin ? 'oui' : 'non',
        },
        ...(listId ? { listIds: [listId] } : {}),
        updateEnabled: true,
      }),
    });
  } catch (err) {
    console.error('Brevo contact failed', err);
  }

  // 2) Email récapitulatif à Camil.
  const scoreBadge = d.score != null
    ? `<div style="display:inline-block;background:#03102E;color:#E6C259;font-family:Georgia,serif;font-size:22px;font-weight:700;padding:8px 18px;border-radius:10px;margin:0 0 10px">${escapeHtml(String(d.score))}<span style="font-size:13px;color:#9fb0c8">/100</span> &middot; ${escapeHtml(d.niveau || '')}</div>`
    : '';

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E">
      <p style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#A7801F;margin:0 0 4px">Nouveau diagnostic patrimonial</p>
      <h2 style="margin:0 0 6px;font-size:20px">${escapeHtml(prenom)} ${escapeHtml(nom)}</h2>
      ${scoreBadge}
      <p style="margin:0 0 2px;font-size:14px"><a href="mailto:${escapeHtml(email)}" style="color:#0A1F4F">${escapeHtml(email)}</a>${telephone ? ` &middot; ${escapeHtml(telephone)}` : ''}</p>
      <p style="margin:0 0 16px;font-size:12px;color:#7A7566">Opt-in newsletter/marketing : <strong>${optin ? 'OUI' : 'non'}</strong> &middot; Consentement traitement : OUI</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #EDE6D3;border-bottom:1px solid #EDE6D3;margin:0 0 16px">
        ${ligne('Âge', d.age != null ? d.age + ' ans' : '—')}
        ${ligne('Situation familiale', d.situation || '—')}
        ${ligne('Personnes à charge', d.enfants != null ? String(d.enfants) : '—')}
        ${ligne('Statut professionnel', d.statut || '—')}
        ${ligne('Revenu net du foyer / mois', eur(d.revenuMensuel))}
        ${ligne('Tranche marginale (TMI)', d.tmi != null ? d.tmi + ' %' : '—')}
        ${ligne('Patrimoine net estimé', eur(d.patrimoineNet))}
        ${ligne('Patrimoine brut estimé', eur(d.patrimoineBrut))}
        ${ligne('Épargne de précaution', d.moisPrecaution != null ? d.moisPrecaution + ' mois' : '—')}
        ${ligne("Taux d'endettement", d.tauxEndettement != null ? d.tauxEndettement + ' %' : '—')}
        ${ligne("Taux d'épargne", d.tauxEpargne != null ? d.tauxEpargne + ' %' : '—')}
        ${ligne("Poids de l'immobilier", d.poidsImmo != null ? d.poidsImmo + ' %' : '—')}
        ${ligne('Piste PER (versement)', eur(d.perVersement))}
        ${ligne('Économie fiscale estimée', eur(d.perEconomie))}
        ${ligne('Prévoyance', d.prevoyance || '—')}
        ${ligne('Horizon', d.horizon || '—')}
        ${ligne('Tolérance au risque', d.risque || '—')}
        ${ligne('Objectifs prioritaires', d.objectifs || '—')}
        ${ligne('Priorités identifiées', d.priorites || '—')}
      </table>
      <p style="font-size:13px;color:#7A7566;line-height:1.5">Chiffres estimatifs saisis par le visiteur, à re-vérifier. Prochaine étape : le recontacter pour proposer une étude patrimoniale complète et/ou un rendez-vous.</p>
    </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST, name: 'Camil Czajkowski' }],
        replyTo: { email, name: `${prenom} ${nom}` },
        subject: `Diagnostic patrimonial — ${prenom} ${nom}${d.score != null ? ` (${d.score}/100)` : ''}`,
        htmlContent,
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('Brevo email error', r.status, detail);
      return res.status(502).json({ ok: false, error: 'envoi' });
    }
  } catch (err) {
    console.error('Fetch Brevo failed', err);
    return res.status(502).json({ ok: false, error: 'envoi' });
  }

  return res.status(200).json({ ok: true });
}
