// Générateur du PDF "Compte à rebours de l'après-carrière" — Le Chêne Patrimonial.
// pdfkit (CommonJS) importé en ESM ; renvoie un Buffer. Polices standard uniquement.

import PDFDocument from 'pdfkit';

const NAVY = '#03102E';
const NAVY_SOFT = '#0A1F4F';
const GOLD = '#D4A82D';
const GOLD_LIGHT = '#E6C259';
const GOLD_DARK = '#A7801F';
const BLUE = '#3a5f86';
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

export function buildApresCarrierePdf(data = {}) {
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
      doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(23)
        .text("Le compte à rebours de l'après-carrière", M, 50, { width: CW - 120 });
      doc.fillColor(CREAM).font('Times-Roman').fontSize(13)
        .text(d.sportLabel ? 'Discipline : ' + d.sportLabel : 'Sportif de haut niveau', M, 92);
      doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9).text(dateStr, M, 40, { width: CW, align: 'right' });
      if (nomComplet) doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9).text(nomComplet, M, 54, { width: CW, align: 'right' });

      y = 152;

      // -------- Nombre de la liberté --------
      doc.roundedRect(M, y, CW, 92, 12).fill(CREAM);
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10)
        .text('VOTRE NOMBRE DE LA LIBERTÉ', M + 20, y + 18, { characterSpacing: 1.5 });
      doc.fillColor(INK).font('Times-Bold').fontSize(34).text(eur(d.nombreLiberte), M + 20, y + 34);
      doc.fillColor(STONE).font('Helvetica').fontSize(9)
        .text('le capital qui rend votre train de vie autonome, une fois la carrière terminée.', M + 20, y + 74, { width: CW - 40 });
      y += 92 + 22;

      // -------- La falaise --------
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10).text('LA FALAISE DE REVENUS', M, y, { characterSpacing: 1.5 });
      y += 16;
      doc.moveTo(M, y).lineTo(M + 32, y).lineWidth(2).stroke(GOLD);
      y += 16;
      const baseY = y + 90, colW = 150;
      const rev = +d.revenu || 0, apres = +d.apres || 0;
      const hAv = 84, hAp = rev > 0 ? Math.max(8, (apres / rev) * 84) : 8;
      doc.roundedRect(M + 10, baseY - hAv, colW, hAv, 4).fill(GOLD);
      doc.fillColor(INK).font('Times-Bold').fontSize(12).text(eur(rev) + ' / an', M + 10, baseY - hAv - 16, { width: colW, align: 'center' });
      doc.fillColor(STONE).font('Helvetica').fontSize(8.5).text('Pendant la carrière', M + 10, baseY + 8, { width: colW, align: 'center' });
      const x2 = M + 10 + colW + 90;
      doc.roundedRect(x2, baseY - hAp, colW, hAp, 4).fill(BLUE);
      doc.fillColor(INK).font('Times-Bold').fontSize(12).text(eur(apres) + ' / an', x2, baseY - hAp - 16, { width: colW, align: 'center' });
      doc.fillColor(STONE).font('Helvetica').fontSize(8.5).text('Après la carrière', x2, baseY + 8, { width: colW, align: 'center' });
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(15)
        .text('-' + (d.chute != null ? d.chute : 0) + '%', M + 10 + colW, baseY - 44, { width: 90, align: 'center' });
      y = baseY + 34;

      // -------- Chiffres clés --------
      const rows = [
        ['Votre date de liberté estimée', d.dateLiberte || '—'],
        ["À capitaliser / mois jusqu'à la fin de carrière", d.versementNecessaire != null ? eur(d.versementNecessaire) + ' / mois' : '—'],
        ["Votre capacité d'épargne actuelle", d.capaciteMensuelle != null ? eur(d.capaciteMensuelle) + ' / mois' : '—'],
        ['Fin de carrière estimée', (d.fin != null ? d.fin + ' ans' : '—') + (d.age != null ? '  (dans ' + Math.max(0, d.fin - d.age) + ' ans)' : '')],
      ];
      rows.forEach((r) => {
        doc.fillColor(STONE).font('Helvetica').fontSize(10).text(r[0], M, y, { width: CW * 0.62 });
        doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(r[1], M, y, { width: CW, align: 'right' });
        y += 15;
        doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(0.5).stroke(CREAM_DEEP);
        y += 9;
      });
      y += 10;

      // -------- Lecture / verdict --------
      if (d.verdict) {
        doc.roundedRect(M, y, CW, 4, 2).fill(GOLD);
        y += 14;
        doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10).text('CE QUE CELA VEUT DIRE', M, y, { characterSpacing: 1.2 });
        y += 16;
        const vt = stripHtml(d.verdict);
        doc.fillColor('#4a4a52').font('Helvetica').fontSize(10).text(vt, M, y, { width: CW, lineGap: 2 });
        y += doc.heightOfString(vt, { width: CW, lineGap: 2 }) + 18;
      }

      // -------- Plan --------
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10).text("LES 3 LEVIERS DE VOTRE APRÈS-CARRIÈRE", M, y, { characterSpacing: 1.2 });
      y += 18;
      const plan = [
        ['Capitaliser tôt et régulièrement', "Chaque année de carrière compte double : c'est maintenant que l'épargne a le temps de fructifier."],
        ['Placer dans les bonnes enveloppes', "Assurance-vie, PER, immobilier : l'allocation détermine le rendement et la fiscalité de votre capital."],
        ['Protéger et anticiper la reconversion', "Prévoyance adaptée et transition préparée : sécuriser l'après autant que le construire."],
      ];
      plan.forEach((p, i) => {
        doc.circle(M + 4, y + 5, 8).fill(NAVY);
        doc.fillColor(GOLD_LIGHT).font('Times-Bold').fontSize(9).text(String(i + 1), M, y + 1, { width: 8, align: 'center' });
        doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(p[0], M + 20, y, { width: CW - 20 });
        y += 14;
        doc.fillColor('#4a4a52').font('Helvetica').fontSize(9.5).text(p[1], M + 20, y, { width: CW - 20, lineGap: 1.5 });
        y += doc.heightOfString(p[1], { width: CW - 20, lineGap: 1.5 }) + 12;
      });

      // -------- Pied CTA --------
      y = Math.max(y + 6, PAGE_H - 150);
      doc.roundedRect(M, y, CW, 80, 10).fill(CREAM);
      doc.fillColor(INK).font('Times-Bold').fontSize(13).text('Transformons ce compte à rebours en stratégie.', M + 18, y + 16, { width: CW - 36 });
      doc.fillColor(STONE).font('Helvetica').fontSize(9.5)
        .text("Un premier échange de 30 minutes, sans engagement, pour bâtir votre plan d'après-carrière.", M + 18, y + 38, { width: CW - 36 });
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(9.5)
        .text('lechenepatrimonial.com  ·  camil.cz@lechenepatrimonial.com  ·  06 12 82 91 90', M + 18, y + 58, { width: CW - 36 });

      // -------- Mention légale --------
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);
        doc.fillColor(STONE).font('Helvetica').fontSize(6.8)
          .text(
            "Estimation indicative et automatisée, à but pédagogique, sans valeur de conseil personnalisé ni recommandation sur des instruments financiers. Rente calculée sur un taux de retrait prudent de 3,5 %. Le Chêne Patrimonial intervient au titre du courtage en assurance et de l'intermédiation immobilière.",
            M, PAGE_H - 34, { width: CW, align: 'center' }
          );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
