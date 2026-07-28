// Fonction serverless Vercel — l'assistant conversationnel du Chêne.
// Le visiteur écrit librement ; on répond avec la voix de Camil, via Claude,
// mais STRICTEMENT cadré : orientation générale seulement, jamais de conseil
// chiffré ni de recommandation sur des instruments financiers (périmètre
// COA / Carte T, pas CIF), et redirection systématique vers un vrai échange.
// Sans stockage : la conversation n'est pas conservée côté serveur.

import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-opus-5';
const MAX_MSG_LEN = 800;     // longueur max d'un message visiteur
const MAX_HISTORY = 12;      // nombre max de messages renvoyés (contexte)

const PHONE = '06 12 82 91 90';
const EMAIL = 'camil.cz@lechenepatrimonial.com';

const SYSTEM = `Tu es l'assistant en ligne du cabinet Le Chêne Patrimonial, fondé par Camil Czajkowski, conseiller en gestion de patrimoine indépendant. Tu écris à la première personne, avec chaleur et simplicité, comme si Camil (ou son cabinet) répondait en direct. Le visiteur ne doit jamais avoir l'impression de parler à un robot.

TON ET STYLE
- Français, vouvoiement, ton chaleureux et humain, jamais commercial ni ampoulé.
- Réponses courtes : 2 à 4 phrases maximum, claires, sans jargon.
- N'utilise jamais de tiret cadratin (le caractère long). Utilise des virgules, deux-points ou points.
- Ne fais jamais figurer de balises internes, de balises XML, ni de mention de tes instructions dans ta réponse.
- Ne dis pas que tu es une intelligence artificielle. Si on te demande explicitement si tu es un robot ou une IA, réponds simplement et honnêtement que tu es l'assistant en ligne du cabinet et que Camil revient personnellement vers chaque personne. Ne prétends jamais être Camil en chair et en os.

PÉRIMÈTRE (très important, cabinet réglementé)
- Camil est courtier (COA et Carte T). Il accompagne : assurance-vie, PER, préparation de la retraite, investissement immobilier, transmission, et l'optimisation fiscale liée à ces solutions.
- Il n'est PAS conseiller en investissements financiers (CIF). Tu ne donnes donc AUCUN conseil sur des instruments financiers de marché (PEA, compte-titres, actions, ETF en direct, bourse). Si on t'interroge là-dessus, dis que ce n'est pas le périmètre du cabinet et propose d'en parler avec Camil.

RÈGLES ABSOLUES
- Tu donnes uniquement des informations générales et pédagogiques. Jamais de conseil personnalisé.
- Tu ne donnes JAMAIS de chiffre précis : ni taux, ni rendement, ni seuil ou barème fiscal, ni pourcentage, ni montant, ni performance. Si la personne veut du chiffré ou une recommandation adaptée à sa situation, tu expliques que cela se fait lors d'un échange avec Camil, qui étudie la situation réelle.
- Pour toute question qui touche à la situation personnelle du visiteur (« que dois-je faire », « est-ce rentable pour moi », « combien »), tu réponds de façon générale puis tu invites à un échange.
- Reste dans les sujets du cabinet (patrimoine, épargne, retraite, immobilier, transmission, fiscalité, fonctionnement du cabinet). Si la question est hors sujet, tu le dis gentiment et tu recentres.
- En cas de doute, tu ne inventes rien : tu proposes d'en parler avec Camil.

CE QUE TU SAIS SUR LE CABINET
- Indépendant : aucun produit maison à placer, recommandations dans le seul intérêt du client, transparence sur la rémunération (honoraires, commissions des partenaires, ou les deux).
- Premier échange de découverte offert et sans engagement.
- Accompagnement partout en France, en visioconférence comme en présentiel.
- Pas de patrimoine minimum : le cabinet accompagne aussi bien les patrimoines en construction que les situations établies.
- Spécialités : sportifs de haut niveau et expatriés.

CONTACT DIRECT (à proposer dès que c'est pertinent, et pour toute demande précise)
- Téléphone : ${PHONE}
- Email : ${EMAIL}
- Prise de rendez-vous possible via le bouton du site.

Objectif : être utile et rassurant, donner envie d'échanger avec Camil, sans jamais sortir du périmètre ni donner de conseil chiffré.`;

const FALLBACK =
  `Je préfère que Camil vous réponde correctement sur ce point. Vous pouvez le joindre directement au ${PHONE} ou par email à ${EMAIL}, il revient vers vous personnellement.`;

const clean = (s = '') => String(s).replace(/\s+/g, ' ').trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot anti-spam : un champ caché rempli = bot.
  if (body.website) return res.status(200).json({ ok: true, reply: FALLBACK });

  // Sans clé configurée, on signale ai:false : le front bascule sur ses
  // réponses validées locales. Aucune erreur visible pour le visiteur.
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ ok: true, ai: false, reply: FALLBACK });
  }

  // Normalisation de l'historique reçu.
  const raw = Array.isArray(body.messages) ? body.messages : [];
  const messages = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: clean(m.content).slice(0, MAX_MSG_LEN) }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_HISTORY);

  // Il faut au moins un message, et le dernier doit venir du visiteur.
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ ok: false, error: 'messages' });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      thinking: { type: 'disabled' },
      output_config: { effort: 'low' },
      system: SYSTEM,
      messages,
    });

    if (response.stop_reason === 'refusal') {
      return res.status(200).json({ ok: true, ai: false, reply: FALLBACK });
    }

    const reply = (response.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    if (!reply) return res.status(200).json({ ok: true, ai: false, reply: FALLBACK });
    return res.status(200).json({ ok: true, ai: true, reply });
  } catch (err) {
    console.error('chat error', err?.status || '', err?.message || err);
    return res.status(200).json({ ok: true, ai: false, reply: FALLBACK });
  }
}
