// Fonction serverless Vercel — capture d'un lead "Étude patrimoniale".
// Le visiteur remplit le diagnostic sur /outils/etude-patrimoniale, puis
// demande son étude complète. Cette fonction :
//   1. valide + filtre le spam (honeypot),
//   2. crée / met à jour le contact dans Brevo (avec opt-in explicite),
//   3. envoie à Camil un récapitulatif du diagnostic par email.
// RGPD : consentement obligatoire, opt-in marketing séparé et facultatif.
// Rien n'est envoyé au client automatiquement : Camil reprend la main.

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
  const optin = !!body.optin; // opt-in marketing facultatif

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!prenom || !nom || !emailOk) {
    return res.status(400).json({ ok: false, error: 'champs_invalides' });
  }
  if (!body.consent) {
    return res.status(400).json({ ok: false, error: 'consentement_requis' });
  }

  // Diagnostic transmis par le front (déjà calculé côté client).
  const d = body.diagnostic || {};
  const ligne = (k, v) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#7A7566;font-size:13px">${escapeHtml(k)}</td>` +
    `<td style="padding:6px 0;color:#03102E;font-weight:600;font-size:14px;text-align:right">${escapeHtml(v)}</td></tr>`;

  // Pièce jointe facultative (avis d'impôt) : validée, jamais stockée.
  let attachment = null;
  const att = body.attachment;
  if (att && typeof att.content === 'string' && att.content.length > 0) {
    const name = clean(att.name).slice(0, 120) || 'document';
    const extOk = /\.(pdf|jpe?g|png)$/i.test(name);
    // base64 : ~4/3 de la taille du fichier. Plafond ~5 Mo de fichier.
    const tooBig = att.content.length > 7 * 1024 * 1024;
    if (extOk && !tooBig) {
      attachment = [{ name, content: att.content }];
    }
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY manquante');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  // 1) Contact Brevo (création / mise à jour). Liste optionnelle via env.
  const LETTRE_LIST_ID = 3; // « La Lettre du Chêne - Abonnés » : liste marketing, opt-in obligatoire.
  const listId = process.env.BREVO_LIST_ETUDES ? Number(process.env.BREVO_LIST_ETUDES) : null;
  // Liste de suivi de l'outil + la Lettre UNIQUEMENT si opt-in explicite (aucune fuite, RGPD propre).
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
          PRENOM: prenom,
          NOM: nom,
          ...(telephone ? { SMS: telephone } : {}),
          SOURCE: 'Etude patrimoniale',
          OPTIN_MARKETING: optin ? 'oui' : 'non',
        },
        ...(listIds.length ? { listIds } : {}),
        updateEnabled: true,
      }),
    });
  } catch (err) {
    // On n'échoue pas la requête pour ça : le lead part quand même à Camil par email.
    console.error('Brevo contact failed', err);
  }

  // 2) Email récapitulatif à Camil.
  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E">
      <p style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#A7801F;margin:0 0 4px">Nouvelle demande d'étude patrimoniale</p>
      <h2 style="margin:0 0 4px;font-size:20px">${escapeHtml(prenom)} ${escapeHtml(nom)}</h2>
      ${d.interet ? `<p style="margin:0 0 8px;display:inline-block;background:#2D4A33;color:#F5F1E8;font-size:12px;font-weight:700;padding:4px 10px;border-radius:6px">${escapeHtml(d.interet)}</p>` : ''}
      <p style="margin:0 0 2px;font-size:14px"><a href="mailto:${escapeHtml(email)}" style="color:#0A1F4F">${escapeHtml(email)}</a>${telephone ? ` &middot; ${escapeHtml(telephone)}` : ''}</p>
      <p style="margin:0 0 16px;font-size:12px;color:#7A7566">Opt-in newsletter/marketing : <strong>${optin ? 'OUI' : 'non'}</strong> &middot; Consentement traitement : OUI &middot; Avis d'impôt joint : <strong>${attachment ? 'OUI (voir pièce jointe)' : 'non'}</strong></p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #EDE6D3;border-bottom:1px solid #EDE6D3;margin:0 0 16px">
        ${ligne('Situation familiale', d.situation || '—')}
        ${ligne('Statut professionnel', d.statut || '—')}
        ${ligne('Âge', d.age != null ? d.age + ' ans' : '—')}
        ${ligne('Régime matrimonial', d.regime || '—')}
        ${ligne('Nombre de parts', d.parts || '—')}
        ${ligne('Revenu net imposable', eur(d.revenuImposable))}
        ${ligne('Revenus fonciers (net)', eur(d.foncierNet))}
        ${ligne('Impôt sur le revenu estimé', eur(d.impot))}
        ${ligne('Tranche marginale (TMI)', d.tmi != null ? d.tmi + ' %' : '—')}
        ${ligne('Taux moyen', d.tauxMoyen != null ? d.tauxMoyen + ' %' : '—')}
        ${ligne('Patrimoine net estimé', eur(d.patrimoineNet))}
        ${ligne('Épargne financière', eur(d.epargneFinanciere))}
        ${ligne("Poids de l'immobilier", d.poidsImmo != null ? d.poidsImmo + ' %' : '—')}
        ${ligne('Base taxable IFI (est.)', eur(d.baseIFI))}
        ${ligne('Crédits en cours (CRD)', eur(d.creditCRD))}
        ${ligne("Taux d'endettement", d.tauxEndettement != null ? d.tauxEndettement + ' %' : '—')}
        ${ligne("Capacité d'épargne / mois", eur(d.capaciteEpargneMois))}
        ${ligne("Profil d'investisseur", d.profil || '—')}
        ${ligne('Prévoyance', d.prevoyance || '—')}
        ${ligne('Objectifs prioritaires', d.objectifs || '—')}
        ${ligne('Projets à financer', d.projets || '—')}
        ${ligne('Piste PER (versement suggéré)', eur(d.perVersement))}
        ${ligne('Économie PER estimée', eur(d.perEconomie))}
      </table>
      <p style="font-size:13px;color:#7A7566;line-height:1.5">Chiffres estimatifs saisis par le visiteur, à re-vérifier. Prochaine étape : produire l'étude PDF et/ou proposer un rendez-vous.</p>
    </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST, name: 'Camil Czajkowski' }],
        replyTo: { email, name: `${prenom} ${nom}` },
        subject: `Étude patrimoniale — ${prenom} ${nom}`,
        htmlContent,
        ...(attachment ? { attachment } : {}),
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
