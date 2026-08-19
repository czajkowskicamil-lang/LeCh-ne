// Fonction serverless Vercel — suivi d'ouverture maison, hébergé sur le domaine du cabinet.
// Remplace le pixel de Brevo : aucun tiers, aucun impact sur SPF/DKIM, aucune donnée revendue.
//
// Principe : les mails envoyés depuis la boîte IONOS embarquent une image 1x1 pointant ici.
// Quand le destinataire ouvre le message, son client charge l'image, on répond le GIF
// transparent et on prévient Camil par mail.
//
// Le jeton est signé (HMAC) : sans la clé, personne ne peut fabriquer une URL et déclencher
// une fausse alerte. Les requêtes non signées reçoivent le GIF sans notification.
import crypto from 'node:crypto';

const DEST = 'camil.cz@lechenepatrimonial.com';
const SENDER = { name: 'Suivi Le Chêne', email: 'etudes@lechenepatrimonial.com' };

// GIF transparent 1x1, 43 octets.
const PIXEL = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

// Anti-doublon : une même ouverture ne doit pas générer dix mails. Mémoire de l'instance
// serverless uniquement — volontairement simple, les proxys d'images mettent en cache et
// ne rechargent quasiment jamais. Au pire une alerte de plus, jamais une de moins.
const FENETRE_MS = 6 * 60 * 60 * 1000;
const vus = new Map();

const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const b64urlDecode = (s) => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');

function verifierJeton(jeton, secret) {
  const i = String(jeton).lastIndexOf('.');
  if (i < 1) return null;
  const corps = jeton.slice(0, i);
  const signature = jeton.slice(i + 1);
  const attendue = crypto.createHmac('sha256', secret).update(corps).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(attendue);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(b64urlDecode(corps));
  } catch {
    return null;
  }
}

function repondrePixel(res) {
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Content-Length', String(PIXEL.length));
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  return res.status(200).send(PIXEL);
}

export default async function handler(req, res) {
  // Le pixel part toujours, quoi qu'il arrive : jamais d'image cassée dans le mail du client.
  if (req.method !== 'GET' && req.method !== 'HEAD') return repondrePixel(res);

  const secret = process.env.TRACK_SECRET;
  const apiKey = process.env.BREVO_API_KEY;
  const jeton = (req.query && (req.query.t || req.query.T)) || '';

  if (!secret || !apiKey || !jeton) return repondrePixel(res);

  const data = verifierJeton(jeton, secret);
  if (!data) return repondrePixel(res); // signature invalide : on sert l'image, on ne prévient pas.

  const cle = String(jeton);
  const maintenant = Date.now();
  const precedent = vus.get(cle);
  if (precedent && maintenant - precedent < FENETRE_MS) return repondrePixel(res);
  vus.set(cle, maintenant);
  if (vus.size > 500) for (const [k, v] of vus) if (maintenant - v > FENETRE_MS) vus.delete(k);

  const destinataire = String(data.r || 'destinataire inconnu').slice(0, 120);
  const objet = String(data.s || '').slice(0, 160);
  const envoyeLe = String(data.d || '').slice(0, 40);
  const relance = precedent ? 'Nouvelle ouverture' : 'Première ouverture';

  const ua = String(req.headers['user-agent'] || '').slice(0, 200);
  const viaProxy = /GoogleImageProxy|YahooMailProxy|Outlook/i.test(ua);

  const quand = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Paris',
  }).format(new Date(maintenant));

  const htmlContent = `
    <div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;color:#0A1F4F;font-size:15px;line-height:1.6">
      <p style="font-size:20px;margin:0 0 4px"><strong>${escapeHtml(destinataire)}</strong> vient d'ouvrir votre mail.</p>
      <p style="margin:0 0 18px;color:#7A7566">${escapeHtml(relance)} &middot; ${escapeHtml(quand)}</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #EDE6D3">
        <tr><td style="padding:8px 0;color:#7A7566">Objet</td><td style="padding:8px 0;text-align:right"><strong>${escapeHtml(objet)}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#7A7566;border-top:1px solid #EDE6D3">Envoyé le</td><td style="padding:8px 0;text-align:right;border-top:1px solid #EDE6D3">${escapeHtml(envoyeLe)}</td></tr>
        <tr><td style="padding:8px 0;color:#7A7566;border-top:1px solid #EDE6D3">Chargement</td><td style="padding:8px 0;text-align:right;border-top:1px solid #EDE6D3">${viaProxy ? 'via le proxy d\'images de sa messagerie' : 'client de messagerie direct'}</td></tr>
      </table>
      <p style="margin:22px 0 0;font-size:15px">C'est le bon moment pour l'appeler.</p>
      <p style="font-size:12px;color:#9a9484;border-top:1px solid #EDE6D3;padding-top:14px;margin-top:22px">
        Suivi d'ouverture hébergé sur lechenepatrimonial.com. Une ouverture n'est détectée que si le destinataire
        affiche les images. L'absence d'alerte ne prouve pas qu'il n'a pas lu.
      </p>
    </div>`;

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST, name: 'Camil Czajkowski' }],
        subject: `Ouverture · ${destinataire}`,
        htmlContent,
        tags: ['suivi-ouverture'],
      }),
    });
  } catch (err) {
    console.error('Notification ouverture échouée', err);
  }

  return repondrePixel(res);
}
