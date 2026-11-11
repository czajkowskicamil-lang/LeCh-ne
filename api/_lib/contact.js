// Formulaire « Écrivez-moi » de la page contact. Appelé par api/tool-lead.js
// (action: 'contact') : le plan Vercel Hobby plafonne à 12 fonctions serveur,
// le dossier _lib n'en compte pas.
// Remplace l'ancien envoi Formspree jamais configuré (REPLACE_ME), qui perdait
// tous les messages. Le message part par email transactionnel Brevo vers Camil,
// avec le visiteur en reply-to : un clic sur « Répondre » suffit.
// RGPD : aucune inscription à une liste marketing, aucune donnée conservée ici.

const DEST = 'camil.cz@lechenepatrimonial.com';
const SENDER = { name: 'Site Le Chêne', email: 'etudes@lechenepatrimonial.com' };

const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const clean = (s = '') => String(s).trim().replace(/\s+/g, ' ');

export async function handleContact(body, res) {

  if (body.website) return res.status(200).json({ ok: true }); // honeypot anti-robot

  const name = clean(body.name).slice(0, 100);
  const email = clean(body.email).slice(0, 120);
  const telephone = clean(body.telephone).slice(0, 30);
  const profile = clean(body.profile).slice(0, 60);
  const page = clean(body.page).slice(0, 120);
  const message = String(body.message || '').trim().slice(0, 4000);

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!name || !emailOk || message.length < 2) {
    return res.status(400).json({ ok: false, error: 'champs_invalides' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) { console.error('BREVO_API_KEY manquante'); return res.status(500).json({ ok: false, error: 'config' }); }

  const htmlContent = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#03102E">
      <p style="font-size:13px;color:#A7801F;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">Nouveau message du site${profile ? ` · ${escapeHtml(profile)}` : ''}</p>
      <p style="margin:0 0 2px;font-size:17px;font-weight:700">${escapeHtml(name)}</p>
      <p style="margin:0 0 16px;font-size:14px"><a href="mailto:${escapeHtml(email)}" style="color:#0A1F4F">${escapeHtml(email)}</a>${telephone ? ` &middot; ${escapeHtml(telephone)}` : ''}</p>
      <div style="font-size:15px;line-height:1.55;white-space:pre-wrap;border-top:1px solid #EDE6D3;padding-top:14px">${escapeHtml(message)}</div>
      <p style="font-size:12px;color:#7A7566;margin-top:18px">Envoyé depuis ${escapeHtml(page || '/contact')}. Répondre à ce mail répond directement au visiteur.</p>
    </div>`;

  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email: DEST, name: 'Camil Czajkowski' }],
        replyTo: { email, name },
        subject: `Message du site · ${name}${profile ? ` · ${profile}` : ''}`,
        htmlContent,
      }),
    });
    if (!r.ok) { console.error('Brevo email error', r.status, await r.text()); return res.status(502).json({ ok: false, error: 'envoi' }); }
  } catch (err) {
    console.error('Fetch Brevo failed', err);
    return res.status(502).json({ ok: false, error: 'envoi' });
  }

  return res.status(200).json({ ok: true });
}
