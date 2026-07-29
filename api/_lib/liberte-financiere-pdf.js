// Générateur du PDF "À quel âge serez-vous libre ?" — Le Chêne Patrimonial.
// pdfkit (CommonJS) importé en ESM ; renvoie un Buffer. Polices standard uniquement.

import PDFDocument from 'pdfkit';

const NAVY = '#03102E';
const GOLD = '#D4A82D';
const GOLD_LIGHT = '#E6C259';
const GOLD_DARK = '#A7801F';
const STONE = '#7A7566';
const CREAM = '#F5F1E8';
const CREAM_DEEP = '#EDE6D3';
const INK = '#03102E';

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 54;
const CW = PAGE_W - M * 2;

// Séparateur de milliers en espace ASCII simple (les espaces insécables de
// toLocaleString sont mal rendus par les polices PDF standard).
const frNum = (n) => String(Math.round(+n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const eur = (n) => (Number.isFinite(+n) ? frNum(n) + ' €' : '—');
const stripHtml = (s = '') => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

export function buildLiberteFinancierePdf(data = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const d = data.data || {};
      const prenom = String(data.prenom || '').slice(0, 60);
      const nom = String(data.nom || '').slice(0, 60);
      const nomComplet = `${prenom} ${nom}`.trim();
      const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

      let y = 0;

      // -------- En-tête --------
      doc.rect(0, 0, PAGE_W, 128).fill(NAVY);
      doc.fillColor(GOLD_LIGHT).font('Helvetica-Bold').fontSize(9)
        .text('LE CHÊNE PATRIMONIAL', M, 32, { characterSpacing: 2 });
      doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(22)
        .text('À quel âge serez-vous libre ?', M, 48, { width: CW - 150 });
      doc.fillColor(GOLD_LIGHT).font('Times-Italic').fontSize(12)
        .text('Votre indépendance financière', M, 82);
      doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9).text(dateStr, M, 40, { width: CW, align: 'right' });
      if (nomComplet) doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9).text(nomComplet, M, 54, { width: CW, align: 'right' });

      y = 152;

      // -------- Capital liberté --------
      doc.roundedRect(M, y, CW, 84, 12).fill(CREAM);
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10)
        .text('VOTRE CAPITAL LIBERTÉ', M + 20, y + 16, { characterSpacing: 1.5 });
      doc.fillColor(INK).font('Times-Bold').fontSize(33).text(eur(d.capitalLiberte), M + 20, y + 31);
      doc.fillColor(STONE).font('Helvetica').fontSize(9)
        .text('la somme qui, bien placée, vous fait vivre sans dépendre d’un salaire.', M + 20, y + 68, { width: CW - 40 });
      y += 84 + 16;

      // -------- Libre à X ans --------
      doc.roundedRect(M, y, CW, 54, 10).fillAndStroke('#061a44', GOLD);
      doc.fillColor('#cbd5e6').font('Helvetica').fontSize(10).text('Au rythme actuel, vous êtes libre à', M + 18, y + 13);
      doc.fillColor(GOLD_LIGHT).font('Times-Bold').fontSize(22)
        .text(d.ageLiberte || '—', M + 18, y + 25, { width: CW - 36, align: 'right' });
      y += 54 + 20;

      // -------- Chiffres clés --------
      const rows = [
        ['Ce qu’il vous faut pour vivre', d.depensesAnnuel != null ? eur(d.depensesAnnuel) + ' / an' : '—'],
        ['Ce que vous mettez de côté / mois', d.capaciteMensuelle != null ? eur(d.capaciteMensuelle) + ' / mois' : '—'],
        ['Années avant votre liberté', d.anneesRestantes != null ? d.anneesRestantes + ' ans' : '—'],
        ['Déjà en route vers votre liberté', d.progression != null ? d.progression + ' %' : '—'],
      ];
      rows.forEach((r) => {
        doc.fillColor(STONE).font('Helvetica').fontSize(10).text(r[0], M, y, { width: CW * 0.66 });
        doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(r[1], M, y, { width: CW, align: 'right' });
        y += 14;
        doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(0.5).stroke(CREAM_DEEP);
        y += 7;
      });
      y += 8;

      // -------- Lecture / verdict --------
      if (d.verdict) {
        doc.roundedRect(M, y, CW, 4, 2).fill(GOLD);
        y += 14;
        doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10).text('CE QUE CELA VEUT DIRE', M, y, { characterSpacing: 1.2 });
        y += 16;
        const vt = stripHtml(d.verdict);
        doc.fillColor('#4a4a52').font('Helvetica').fontSize(10).text(vt, M, y, { width: CW, lineGap: 2 });
        y += doc.heightOfString(vt, { width: CW, lineGap: 2 }) + 15;
      }

      // -------- Plan --------
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10).text('LES 3 LEVIERS DE VOTRE LIBERTÉ', M, y, { characterSpacing: 1.2 });
      y += 15;
      const plan = [
        ['Maîtriser vos dépenses', 'Chaque euro de train de vie en moins abaisse le capital à atteindre. Le premier levier, le plus rapide.'],
        ['Augmenter votre effort d’épargne', 'L’écart entre revenus et dépenses, investi tôt et régulièrement, avance la date de votre liberté.'],
        ['Bien placer votre capital', 'Assurance-vie, PER, immobilier : l’allocation détermine le rendement et la fiscalité, donc la vitesse.'],
      ];
      plan.forEach((p, i) => {
        doc.circle(M + 4, y + 5, 8).fill(NAVY);
        doc.fillColor(GOLD_LIGHT).font('Times-Bold').fontSize(9).text(String(i + 1), M, y + 1, { width: 8, align: 'center' });
        doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(p[0], M + 20, y, { width: CW - 20 });
        y += 13;
        doc.fillColor('#4a4a52').font('Helvetica').fontSize(9).text(p[1], M + 20, y, { width: CW - 20, lineGap: 1.5 });
        y += doc.heightOfString(p[1], { width: CW - 20, lineGap: 1.5 }) + 9;
      });

      // -------- Pied CTA --------
      const CTA_H = 72;
      y = Math.min(Math.max(y + 8, PAGE_H - 150), PAGE_H - 40 - CTA_H);
      doc.roundedRect(M, y, CW, CTA_H, 10).fill(CREAM);
      doc.fillColor(INK).font('Times-Bold').fontSize(13).text('Transformons ce cap en stratégie.', M + 18, y + 14, { width: CW - 36 });
      doc.fillColor(STONE).font('Helvetica').fontSize(9.5)
        .text('Un premier échange de 30 minutes, sans engagement, pour bâtir votre plan de liberté financière.', M + 18, y + 34, { width: CW - 36 });
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(9.5)
        .text('lechenepatrimonial.com  ·  camil.cz@lechenepatrimonial.com  ·  06 12 82 91 90', M + 18, y + 53, { width: CW - 36 });

      // -------- Mention légale --------
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);
        doc.fillColor(STONE).font('Helvetica').fontSize(6.6)
          .text(
            'Estimation indicative et automatisée, à but pédagogique, sans valeur de conseil personnalisé ni recommandation sur des instruments financiers. Capital liberté calculé sur un taux de retrait prudent de 3,5 %. Le Chêne Patrimonial intervient au titre du courtage en assurance et de l’intermédiation immobilière.',
            M, PAGE_H - 26, { width: CW, align: 'center' }
          );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
