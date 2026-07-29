// Fonction serverless Vercel — capture d'un lead "Diagnostic patrimonial".
// Le visiteur termine le diagnostic gratuit sur /outils/diagnostic-patrimonial,
// puis demande à être recontacté. Cette fonction :
//   1. valide + filtre le spam (honeypot),
//   2. crée / met à jour le contact dans Brevo (opt-in marketing explicite et facultatif),
//   3. envoie à Camil un récapitulatif du diagnostic par email.
//   4. envoie au visiteur son rapport PDF par email (document transactionnel qu'il a demandé).
// RGPD : consentement obligatoire, opt-in marketing séparé et facultatif.

import { buildDiagnosticPdf } from './_lib/diagnostic-pdf.js';

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

  // Téléchargement direct du PDF (sans capture) : action explicite, court-circuit.
  if (body.action === 'pdf') {
    try {
      const ans = body.answers && typeof body.answers === 'object' ? body.answers : {};
      const pdf = await buildDiagnosticPdf({
        answers: { prenom: clean(ans.prenom).slice(0, 60), nom: clean(ans.nom).slice(0, 60) },
        diagnostic: body.diagnostic,
      });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="diagnostic-patrimonial-le-chene.pdf"');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(pdf);
    } catch (err) {
      console.error('PDF diagnostic failed', err);
      return res.status(500).json({ ok: false, error: 'pdf' });
    }
  }

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
  if (!telephone) {
    return res.status(400).json({ ok: false, error: 'telephone_requis' });
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
  const LETTRE_LIST_ID = 3; // « La Lettre du Chêne - Abonnés » : liste marketing, opt-in obligatoire.
  const listId = process.env.BREVO_LIST_DIAGNOSTIC
    ? Number(process.env.BREVO_LIST_DIAGNOSTIC)
    : process.env.BREVO_LIST_ETUDES
    ? Number(process.env.BREVO_LIST_ETUDES)
    : null;
  // Listes : la liste de suivi de l'outil (trace du lead) + la Lettre UNIQUEMENT si opt-in explicite.
  // -> aucune fuite : un opt-in reçoit bien la Lettre ; sans opt-in, jamais de marketing.
  const listIds = [];
  if (listId) listIds.push(listId);
  if (optin) listIds.push(LETTRE_LIST_ID);
  // Téléphone stocké en texte (l'attribut TELEPHONE ne valide pas le format,
  // contrairement à SMS/LANDLINE_NUMBER qui exigent un format international strict
  // et feraient échouer toute la création du contact).
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
          CATEGORIE: 'Diagnostic patrimonial',
          ...(d.score != null ? { SCORE_DIAG: Number(d.score) } : {}),
          OPT_IN: !!optin,
        },
        ...(listIds.length ? { listIds } : {}),
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
      <p style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#A7801F;margin:0 0 4px">Nouveau lead &middot; rapport PDF téléchargé</p>
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
        subject: `Diagnostic patrimonial · ${prenom} ${nom}${d.score != null ? ` (${d.score}/100)` : ''}`,
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

  // 3) Envoi du rapport PDF directement au visiteur (email transactionnel : document demandé).
  //    Un échec ici ne bloque pas la réponse : Camil a déjà été notifié.
  const full = body.diagnosticFull;
  if (full && typeof full === 'object' && typeof full.score === 'number') {
    try {
      const pdf = await buildDiagnosticPdf({ answers: { prenom, nom }, diagnostic: full });
      const pdfBase64 = pdf.toString('base64');
      const visitorHtml = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E;line-height:1.55">
          <p style="font-size:15px">Bonjour ${escapeHtml(prenom)},</p>
          <p style="font-size:15px">Merci d'avoir réalisé votre diagnostic patrimonial avec Le Chêne Patrimonial. Vous trouverez <strong>votre rapport complet en pièce jointe</strong> (PDF)${d.score != null ? `, avec votre indice de santé patrimoniale de <strong>${escapeHtml(String(d.score))}/100</strong>` : ''}.</p>
          <p style="font-size:15px">Ce diagnostic pose une première photographie. Pour la transformer en stratégie concrète et chiffrée, Camil Czajkowski vous recontacte prochainement. Vous pouvez aussi réserver directement un créneau :</p>
          <p style="margin:22px 0"><a href="https://calendly.com/camil-cz-lechenepatrimonial/30min" style="background:#0A1F4F;color:#E6C259;text-decoration:none;padding:12px 26px;border-radius:100px;font-weight:bold;font-size:14px">Prendre rendez-vous (30 min)</a></p>
          <p style="font-size:15px">À très bientôt,<br>Camil Czajkowski<br><span style="color:#7A7566">Le Chêne Patrimonial</span></p>
          <p style="font-size:11px;color:#9a9484;border-top:1px solid #EDE6D3;padding-top:14px;margin-top:22px">Vous recevez cet email car vous avez demandé votre diagnostic sur lechenepatrimonial.com. Vos données ne sont pas revendues. Pour exercer vos droits d'accès, de rectification ou de suppression : camil.cz@lechenepatrimonial.com.</p>
        </div>`;
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: SENDER,
          to: [{ email, name: `${prenom} ${nom}` }],
          subject: 'Votre diagnostic patrimonial · Le Chêne Patrimonial',
          htmlContent: visitorHtml,
          attachment: [{ name: 'diagnostic-patrimonial-le-chene.pdf', content: pdfBase64 }],
        }),
      });
    } catch (err) {
      console.error('Envoi PDF visiteur échoué', err);
    }
  }

  return res.status(200).json({ ok: true });
}
