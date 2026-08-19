// Génère « Avant de signer » : la grille de contrôle à sortir en rendez-vous.
// Objet de travail, pas document de lecture : des questions, des cases, des
// signaux d'alerte. Recto = valable pour tout. Verso = par type de produit.
// Rendu : node scripts/build-avant-de-signer.mjs
// Sortie : public/telechargements/avant-de-signer-le-chene.pdf

import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'telechargements', 'avant-de-signer-le-chene.pdf');

const NAVY = '#03102E';
const GOLD = '#D4A82D';
const GOLD_LIGHT = '#E6C259';
const GOLD_DARK = '#A7801F';
const CREAM_DEEP = '#EDE6D3';
const STONE = '#7A7566';
const MIST = '#9FB0C8';
const INK = '#03102E';
const BODY = '#40454F';
const ALERTE = '#B4472E';

const W = 595.28;
const H = 841.89;
const M = 46;
const CW = W - M * 2;

const SITE = 'lechenepatrimonial.com';

const doc = new PDFDocument({
  size: 'A4',
  margin: 0,
  bufferPages: true,
  info: {
    Title: 'Avant de signer - la grille de controle - Le Chene Patrimonial',
    Author: 'Camil Czajkowski, Le Chene Patrimonial',
    Subject: 'Les questions a poser avant de signer un placement, un bien ou un credit',
  },
});
doc.pipe(fs.createWriteStream(OUT));

/* ---------------------------------------------------------------- primitives */

function header(titre, sousTitre, page) {
  doc.rect(0, 0, W, 96).fill(NAVY);
  doc.moveTo(M, 26).lineTo(M + 26, 26).lineWidth(1.6).stroke(GOLD);
  doc.fillColor(GOLD_LIGHT).font('Helvetica-Bold').fontSize(7.4)
    .text('LE CHÊNE PATRIMONIAL', M + 36, 22.5, { characterSpacing: 2.2 });
  doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(25).text(titre, M, 42);
  doc.fillColor(MIST).font('Helvetica').fontSize(9).text(sousTitre, M, 74, { width: CW - 60 });
  doc.fillColor(MIST).font('Helvetica').fontSize(8).text(page, M, 24, { width: CW, align: 'right' });
  return 96 + 26;
}

function footer(txt) {
  const y = H - 40;
  doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(0.5).stroke(CREAM_DEEP);
  doc.fillColor(STONE).font('Helvetica').fontSize(7.2).text(txt, M, y + 11, { width: CW * 0.7 });
  doc.fillColor(GOLD_DARK).font('Helvetica').fontSize(7.2).text(SITE, M, y + 11, { width: CW, align: 'right' });
}

// Case à cocher : l'objet se remplit au stylo pendant le rendez-vous.
function checkbox(x, y) {
  doc.roundedRect(x, y, 11, 11, 2).lineWidth(1).stroke(GOLD_DARK);
}

/* ------------------------------------------------------- page 1 · questions */

let y = header('Avant de signer', "Les questions à poser à celui qui vous propose un placement, un bien ou un crédit.", 'RECTO');

doc.fillColor(BODY).font('Helvetica').fontSize(9.6)
  .text("Imprimez cette page et ouvrez-la pendant le rendez-vous. Une réponse gênée, vague ou agacée est une réponse. Vous n'avez rien à justifier : c'est votre argent, et poser ces questions est normal.", M, y, { width: CW, lineGap: 3 });
y += 34;

const questions = [
  {
    q: 'Comment êtes-vous rémunéré sur ce que vous me proposez, et par qui ?',
    ok: 'Un montant ou un pourcentage, et le nom de celui qui le verse.',
    ko: '« Ça ne vous coûte rien. » Tout le monde est payé par quelqu\'un.',
  },
  {
    q: 'Sous quel statut exercez-vous, et quel est votre numéro d\'immatriculation ?',
    ok: 'Un numéro ORIAS ou une carte T que vous pouvez vérifier vous-même sur orias.fr.',
    ko: 'Une réponse floue, ou « je travaille avec un grand cabinet ».',
  },
  {
    q: 'Êtes-vous indépendant, ou lié à un groupe, une banque, un promoteur ?',
    ok: 'Le lien est annoncé spontanément, avant que vous ne posiez la question.',
    ko: 'Un seul produit proposé, toujours le même, quelle que soit la situation.',
  },
  {
    q: 'Quels sont TOUS les frais, en euros, sur le montant dont je parle ?',
    ok: 'Entrée, gestion annuelle, arbitrage, sortie. Chiffrés, en euros, pas en pourcentage.',
    ko: 'Des pourcentages seuls, ou un seul chiffre qui « couvre tout ».',
  },
  {
    q: "Si j'ai besoin de récupérer cet argent dans deux ans, que se passe-t-il ?",
    ok: 'Un délai, un coût de sortie et une fiscalité annoncés clairement.',
    ko: '« Vous n\'y toucherez pas de toute façon. »',
  },
  {
    q: "Qu'est-ce qui est garanti, et qu'est-ce qui ne l'est pas ?",
    ok: 'La part garantie et la part à risque sont séparées, sans détour.',
    ko: 'Une performance passée présentée comme un rendement à venir.',
  },
  {
    q: 'Quel est le pire scénario réaliste, et combien je perds dedans ?',
    ok: 'Un chiffre, même désagréable à entendre.',
    ko: "L'absence de pire scénario. Tout placement en a un.",
  },
  {
    q: 'Pouvez-vous me remettre par écrit ce que vous venez de me dire ?',
    ok: 'Oui, sans hésiter, avant la signature.',
    ko: "Un refus, un report, ou « c'est dans les conditions générales ».",
  },
];

questions.forEach((it, i) => {
  const bh = 60;
  checkbox(M, y + 1);
  doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(8).text(String(i + 1).padStart(2, '0'), M + 18, y + 2);
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(10.2).text(it.q, M + 38, y, { width: CW - 38 });

  const qy = y + doc.heightOfString(it.q, { width: CW - 38 }) + 5;
  doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(7.4).text('BONNE RÉPONSE', M + 38, qy, { characterSpacing: 1 });
  doc.fillColor(BODY).font('Helvetica').fontSize(8.6).text(it.ok, M + 118, qy - 1, { width: CW - 118 });
  const ay = qy + Math.max(11, doc.heightOfString(it.ok, { width: CW - 118 })) + 3;
  doc.fillColor(ALERTE).font('Helvetica-Bold').fontSize(7.4).text('ALERTE', M + 38, ay, { characterSpacing: 1 });
  doc.fillColor(BODY).font('Helvetica').fontSize(8.6).text(it.ko, M + 118, ay - 1, { width: CW - 118 });

  y += bh;
  if (i < questions.length - 1) {
    doc.moveTo(M, y - 9).lineTo(M + CW, y - 9).lineWidth(0.5).stroke(CREAM_DEEP);
  }
});

// La règle qui protège de tout le reste.
y += 2;
doc.roundedRect(M, y, CW, 52, 6).fill(NAVY);
doc.rect(M, y, 3, 52).fill(GOLD);
doc.fillColor(GOLD_LIGHT).font('Helvetica-Bold').fontSize(7.6).text('LA RÈGLE QUI VOUS PROTÈGE DE TOUT LE RESTE', M + 20, y + 13, { characterSpacing: 1.4 });
doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(13)
  .text("Ne signez jamais le jour même. Aucune bonne opération ne disparaît en 48 heures.", M + 20, y + 27, { width: CW - 40 });

footer("Grille de contrôle · Le Chêne Patrimonial · à imprimer et à emporter en rendez-vous");

/* --------------------------------------------------- page 2 · par produit */

doc.addPage();
y = header('Selon ce qu\'on vous vend', 'Les points à vérifier en plus, par famille de produit.', 'VERSO');

const familles = [
  {
    t: 'Un bien immobilier locatif',
    pts: [
      "Le rendement annoncé est-il brut ou net ? Redemandez-le après taxe foncière, charges non récupérables, gestion, vacance et travaux.",
      "Le prix au mètre carré du bien, comparé aux ventes réelles du quartier. Les données sont publiques et gratuites sur data.gouv.fr (base DVF).",
      "Qui a fixé le loyer annoncé, et tiendra-t-il à la relocation ou seulement la première année ?",
      "Quelle part du prix correspond à la commission de commercialisation, et est-elle incluse dans le prix affiché ?",
      "Si c'est une résidence gérée : qui est l'exploitant, depuis quand, et que devient le loyer au renouvellement du bail commercial ?",
    ],
  },
  {
    t: 'Un contrat d\'épargne ou d\'assurance-vie',
    pts: [
      "Frais sur versement : ils se négocient, presque toujours. Demandez le chiffre après négociation, par écrit.",
      "Frais de gestion annuels : ceux du contrat ET ceux des supports à l'intérieur. Les deux se cumulent, ils sont rarement présentés ensemble.",
      "Sur les supports en unités de compte, le capital n'est pas garanti. Cette phrase doit être dite à voix haute, pas seulement écrite en page 12.",
      "Disponibilité réelle : sous quel délai l'argent revient sur votre compte, et avec quelle fiscalité selon l'ancienneté du contrat.",
    ],
  },
  {
    t: 'Un crédit et son assurance',
    pts: [
      "Comparez les TAEG, jamais les taux nominaux. Le TAEG inclut les frais, le taux nominal ne veut rien dire seul.",
      "Coût total de l'assurance sur toute la durée, en euros. Vous n'êtes pas obligé de prendre celle de la banque : la délégation est un droit.",
      "Sportif : faites lister par écrit les exclusions liées à votre pratique. C'est le point le plus souvent passé sous silence, et le plus coûteux le jour où il sert.",
      "Indemnités de remboursement anticipé : combien si vous revendez ou soldez dans trois ans.",
    ],
  },
];

familles.forEach((f) => {
  doc.moveTo(M, y + 1).lineTo(M + 20, y + 1).lineWidth(1.6).stroke(GOLD);
  doc.fillColor(INK).font('Times-Bold').fontSize(15).text(f.t, M + 30, y - 5);
  y += 22;
  f.pts.forEach((p) => {
    checkbox(M + 2, y);
    doc.fillColor(BODY).font('Helvetica').fontSize(9.2).text(p, M + 22, y - 1, { width: CW - 22, lineGap: 2.4 });
    y += doc.heightOfString(p, { width: CW - 22, lineGap: 2.4 }) + 9;
  });
  y += 10;
});

// L'auteur se soumet à sa propre grille : c'est ce qui rend le document crédible.
doc.roundedRect(M, y, CW, 118, 6).fill('#FAF7F0');
doc.rect(M, y, 3, 118).fill(GOLD);
doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(7.6)
  .text('APPLIQUEZ-LA MOI AUSSI', M + 20, y + 15, { characterSpacing: 1.4 });
doc.fillColor(BODY).font('Helvetica').fontSize(9.2)
  .text("Ce document ne vaut rien si je m'en exclus. Mes réponses aux questions du recto :", M + 20, y + 30, { width: CW - 40 });

const mes = [
  ['Statut', "Courtier en assurance et intermédiaire immobilier. ORIAS n° 25 00 00 16, vérifiable sur orias.fr. Carte T n° CPI 3402 2024 000 000 049."],
  ['Rémunération', "Par commission du partenaire chez qui le contrat ou l'opération est souscrit. Je vous donne le montant avant que vous ne signiez, pas après."],
  ['Indépendance', "Cabinet indépendant, sans actionnaire assureur, banque ou promoteur."],
];
let my = y + 48;
mes.forEach((r) => {
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(8.4).text(r[0], M + 20, my, { width: 78 });
  doc.fillColor(BODY).font('Helvetica').fontSize(8.4).text(r[1], M + 102, my, { width: CW - 122, lineGap: 2 });
  my += doc.heightOfString(r[1], { width: CW - 122, lineGap: 2 }) + 6;
});
y += 118 + 16;

doc.fillColor(BODY).font('Helvetica').fontSize(9.2)
  .text("Une question sur un document qu'on vous a remis ? Envoyez-le moi, je vous dis ce que j'y vois : ", M, y, { width: CW, continued: true })
  .fillColor(GOLD_DARK).font('Helvetica-Bold').text('camil.cz@lechenepatrimonial.com');
doc.link(M, y, CW, 12, 'mailto:camil.cz@lechenepatrimonial.com');

doc.fillColor(STONE).font('Helvetica').fontSize(6.8)
  .text("Support pédagogique de portée générale. Il ne constitue ni un conseil personnalisé, ni une recommandation portant sur des instruments financiers. Le Chêne Patrimonial, Camil Czajkowski, intervient au titre du courtage en assurance (ORIAS n° 25 00 00 16) et de l'intermédiation immobilière (CPI 3402 2024 000 000 049).", M, H - 74, { width: CW, lineGap: 2 });

footer("Grille de contrôle · Le Chêne Patrimonial");

doc.end();
console.log('PDF écrit : ' + OUT);
