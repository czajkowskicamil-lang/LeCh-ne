// Fonction serverless Vercel — inscription à « La Lettre du Chêne » en double opt-in.
// Flux RGPD conforme, en deux temps :
//   1. POST {email, prenom?} depuis un formulaire du site → envoi d'un email de
//      confirmation contenant un lien signé. AUCUN contact n'est encore ajouté à Brevo.
//   2. GET ?c=<token signé> (clic sur le lien reçu) → vérification de la signature →
//      ajout du contact à la liste « Lettre du Chêne - Abonnés » (opt-in confirmé) →
//      redirection vers la page de remerciement.
// Le secret de signature réutilise BREVO_API_KEY (déjà présent dans l'environnement) :
// aucune nouvelle variable à configurer. L'email de confirmation est transactionnel
// (déclenché par l'action du visiteur lui-même), pas un envoi marketing.

import crypto from 'node:crypto';

const SENDER = { name: 'La Lettre du Chêne', email: 'camil.cz@lechenepatrimonial.com' };
const SITE = 'https://www.lechenepatrimonial.com';
const LIST_ID = 3; // Lettre du Chêne - Abonnés

const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');
const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlDecode = (s) =>
  Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');

const sign = (payloadB64, secret) =>
  crypto.createHmac('sha256', secret).update(payloadB64).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function makeToken(data, secret) {
  const payload = b64url(JSON.stringify(data));
  return `${payload}.${sign(payload, secret)}`;
}

function verifyToken(token, secret) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expected = sign(payload, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try { return JSON.parse(b64urlDecode(payload)); } catch { return null; }
}

export default async function handler(req, res) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY manquante');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  // ---- Étape 2 : confirmation via le lien reçu par email (GET ?c=token) ----
  if (req.method === 'GET') {
    const token = (req.query && req.query.c) || '';
    const data = verifyToken(token, apiKey);
    if (!data || !data.e) {
      res.writeHead(302, { Location: `${SITE}/newsletter?erreur=lien` });
      return res.end();
    }
    const email = clean(data.e).slice(0, 120);
    const prenom = clean(data.p || '').slice(0, 60);
    try {
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          email,
          attributes: {
            ...(prenom ? { FIRSTNAME: prenom } : {}),
            OPT_IN: true,
            CATEGORIE: 'Newsletter',
          },
          listIds: [LIST_ID],
          updateEnabled: true,
        }),
      });
    } catch (err) {
      console.error('Brevo confirm contact failed', err);
    }
    res.writeHead(302, { Location: `${SITE}/newsletter-confirmee` });
    return res.end();
  }

  // ---- Étape 1 : demande d'inscription (POST) → email de confirmation ----
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Anti-spam : champ piège (honeypot). On répond OK sans rien faire.
  if (body.website) return res.status(200).json({ ok: true, pending: true });

  const email = clean(body.email).slice(0, 120).toLowerCase();
  const prenom = clean(body.prenom).slice(0, 60);
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!emailOk) return res.status(400).json({ ok: false, error: 'email_invalide' });

  const token = makeToken({ e: email, ...(prenom ? { p: prenom } : {}) }, apiKey);
  const confirmUrl = `${SITE}/api/newsletter?c=${token}`;
  const bonjour = prenom ? `Bonjour ${escapeHtml(prenom)},` : 'Bonjour,';

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#03102E;line-height:1.55">
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#A7801F;margin:0 0 6px">La Lettre du Chêne</p>
      <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 18px;color:#03102E">Confirmez votre inscription</h1>
      <p style="font-size:15px;margin:0 0 14px">${bonjour}</p>
      <p style="font-size:15px;margin:0 0 14px">Vous venez de demander à recevoir <strong>La Lettre du Chêne</strong>, la publication mensuelle du cabinet. Une dernière étape pour valider votre inscription&nbsp;:</p>
      <p style="margin:26px 0">
        <a href="${confirmUrl}" style="background:#0A1F4F;color:#E6C259;text-decoration:none;padding:13px 28px;border-radius:100px;font-weight:bold;font-size:14px;display:inline-block">Confirmer mon inscription</a>
      </p>
      <p style="font-size:13px;color:#7A7566;margin:0 0 6px">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur&nbsp;:</p>
      <p style="font-size:12px;color:#0A1F4F;word-break:break-all;margin:0 0 20px">${confirmUrl}</p>
      <p style="font-size:11px;color:#9a9484;border-top:1px solid #EDE6D3;padding-top:14px;margin-top:8px">
        Vous recevez cet email car cette adresse a été saisie sur lechenepatrimonial.com pour s'inscrire à La Lettre du Chêne. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message : sans confirmation, aucune inscription n'est enregistrée. Vos données ne sont jamais revendues. Droits d'accès, de rectification et de suppression : camil.cz@lechenepatrimonial.com.
      </p>
    </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email, ...(prenom ? { name: prenom } : {}) }],
        subject: 'Confirmez votre inscription à La Lettre du Chêne',
        htmlContent: html,
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('Brevo confirm email error', r.status, detail);
      return res.status(502).json({ ok: false, error: 'envoi' });
    }
  } catch (err) {
    console.error('Fetch Brevo failed', err);
    return res.status(502).json({ ok: false, error: 'envoi' });
  }

  return res.status(200).json({ ok: true, pending: true });
}
