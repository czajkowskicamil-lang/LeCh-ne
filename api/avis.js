// Fonction serverless Vercel — réception d'un avis client.
// Le visiteur remplit le formulaire sur /avis ; cette fonction valide,
// filtre le spam, puis envoie l'avis par email à Camil via Brevo.
// Rien n'est publié : Camil valide manuellement avant mise en ligne.

const DEST = 'camil.cz@lechenepatrimonial.com';
const SENDER = { name: 'Site Le Chêne', email: 'avis@lechenepatrimonial.com' };

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

  // Anti-spam : champ piège (honeypot). Un bot le remplit, un humain non.
  if (body.website) {
    return res.status(200).json({ ok: true }); // on fait comme si, sans rien envoyer
  }

  const prenom = clean(body.prenom).slice(0, 60);
  const nom = clean(body.nom).slice(0, 60);
  const role = clean(body.role).slice(0, 80);
  const email = clean(body.email).slice(0, 120);
  const avis = String(body.avis || '').trim().slice(0, 1500);

  if (!prenom || !nom || avis.length < 20) {
    return res.status(400).json({ ok: false, error: 'champs_invalides' });
  }
  if (!body.consent) {
    return res.status(400).json({ ok: false, error: 'consentement_requis' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY manquante');
    return res.status(500).json({ ok: false, error: 'config' });
  }

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#03102E">
      <p style="font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:#A7801F;margin:0 0 4px">Nouvel avis à valider</p>
      <h2 style="margin:0 0 16px;font-size:20px">${escapeHtml(prenom)} ${escapeHtml(nom)}</h2>
      ${role ? `<p style="margin:0 0 4px"><strong>Profil :</strong> ${escapeHtml(role)}</p>` : ''}
      ${email ? `<p style="margin:0 0 16px"><strong>Email :</strong> ${escapeHtml(email)}</p>` : ''}
      <blockquote style="border-left:3px solid #D4A82D;margin:16px 0;padding:8px 0 8px 16px;font-size:16px;line-height:1.5;color:#0A1F4F">
        ${escapeHtml(avis).replace(/\n/g, '<br>')}
      </blockquote>
      <hr style="border:none;border-top:1px solid #EDE6D3;margin:20px 0">
      <p style="font-size:13px;color:#7A7566">Pour publier cet avis : dis à Claude « publie l'avis de ${escapeHtml(prenom)} ${escapeHtml(nom)} ».<br>Le visiteur a coché la case de consentement à la publication.</p>
    </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST, name: 'Camil Czajkowski' }],
        ...(email ? { replyTo: { email, name: `${prenom} ${nom}` } } : {}),
        subject: `Nouvel avis à valider — ${prenom} ${nom}`,
        htmlContent,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Brevo error', r.status, detail);
      return res.status(502).json({ ok: false, error: 'envoi' });
    }
  } catch (err) {
    console.error('Fetch Brevo failed', err);
    return res.status(502).json({ ok: false, error: 'envoi' });
  }

  return res.status(200).json({ ok: true });
}
