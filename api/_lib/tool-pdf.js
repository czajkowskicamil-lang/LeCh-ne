// Générateur de PDF générique pour les outils / calculatrices — Le Chêne Patrimonial.
// Prend un titre, un destinataire et une liste de lignes {label, value} et rend un
// document A4 de marque (Buffer). Utilisé par api/tool-lead.js (capture + action=pdf).
import PDFDocument from 'pdfkit';

const NAVY = '#03102E';
const GOLD = '#D4A82D';
const GOLD_LIGHT = '#E6C259';
const GOLD_DARK = '#A7801F';
const GREEN = '#2D4A33';
const STONE = '#7A7566';
const CREAM = '#F5F1E8';
const INK = '#03102E';

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 54;
const CW = PAGE_W - M * 2;

const stripHtml = (s = '') =>
  String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/[\u00a0\u202f\u2009]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// data : { tool, titre, sousTitre, prenom, nom, date, intro, rows:[{label,value,strong}], note }
export function buildToolPdf(data = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const titre = stripHtml(data.titre || data.tool || 'Votre simulation');
      const sousTitre = stripHtml(data.sousTitre || '');
      const prenom = (data.prenom || '').toString().slice(0, 60);
      const nom = (data.nom || '').toString().slice(0, 60);
      const nomComplet = `${prenom} ${nom}`.trim();
      const dateStr =
        data.date ||
        new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
      const rows = Array.isArray(data.rows) ? data.rows.filter((r) => r && r.label != null) : [];

      let y = 0;

      // ---------- En-tête ----------
      doc.rect(0, 0, PAGE_W, 132).fill(NAVY);
      doc.fillColor(GOLD_LIGHT).font('Helvetica-Bold').fontSize(9)
        .text('LE CHÊNE PATRIMONIAL', M, 34, { characterSpacing: 2 });
      doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(23).text(titre, M, 52, { width: CW * 0.7 });
      if (sousTitre) doc.fillColor(CREAM).font('Times-Roman').fontSize(14).text(sousTitre, M, 84, { width: CW * 0.7 });
      doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9)
        .text(dateStr, M, 44, { width: CW, align: 'right' });
      doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9)
        .text('Estimation indicative', M, 58, { width: CW, align: 'right' });

      y = 158;

      // ---------- Destinataire ----------
      if (nomComplet) {
        doc.fillColor(STONE).font('Helvetica').fontSize(9).text('ÉTABLIE POUR', M, y, { characterSpacing: 1.5 });
        y += 14;
        doc.fillColor(INK).font('Times-Bold').fontSize(19).text(nomComplet, M, y);
        y += 30;
        doc.moveTo(M, y).lineTo(PAGE_W - M, y).lineWidth(1).stroke('#EDE6D3');
        y += 22;
      }

      function ensure(h) {
        if (y + h > PAGE_H - 70) { doc.addPage(); y = 58; }
      }

      // ---------- Intro ----------
      if (data.intro) {
        const introTxt = stripHtml(data.intro);
        const opts = { width: CW, lineGap: 2 };
        const h = doc.font('Helvetica').fontSize(11).heightOfString(introTxt, opts);
        ensure(h + 12);
        doc.fillColor('#3d3a30').font('Helvetica').fontSize(11).text(introTxt, M, y, opts);
        y += h + 18;
      }

      // ---------- Titre de section ----------
      ensure(46);
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10).text('VOTRE RÉSULTAT', M, y, { characterSpacing: 1.5 });
      y += 16;
      doc.moveTo(M, y).lineTo(M + 34, y).lineWidth(2).stroke(GOLD);
      y += 18;

      // ---------- Lignes résultat ----------
      rows.forEach((r) => {
        const label = stripHtml(r.label);
        const value = stripHtml(r.value == null ? '' : String(r.value));
        if (r.strong) {
          ensure(40);
          doc.roundedRect(M, y, CW, 34, 8).fill(NAVY);
          doc.fillColor('#9fb0c8').font('Helvetica').fontSize(10).text(label.toUpperCase(), M + 16, y + 11, { characterSpacing: 0.5 });
          doc.fillColor(GOLD_LIGHT).font('Times-Bold').fontSize(15).text(value, M + 16, y + 8, { width: CW - 32, align: 'right' });
          y += 44;
        } else {
          ensure(24);
          doc.fillColor(STONE).font('Helvetica').fontSize(10.5).text(label, M, y, { width: CW * 0.62 });
          doc.fillColor(INK).font('Helvetica-Bold').fontSize(11).text(value, M + CW * 0.62, y - 1, { width: CW * 0.38, align: 'right' });
          y += 22;
          doc.moveTo(M, y - 6).lineTo(PAGE_W - M, y - 6).lineWidth(0.5).stroke('#EDE6D3');
        }
      });
      y += 10;

      // ---------- Note ----------
      if (data.note) {
        const noteTxt = stripHtml(data.note);
        const opts = { width: CW, lineGap: 2 };
        const h = doc.font('Helvetica-Oblique').fontSize(9.5).heightOfString(noteTxt, opts);
        ensure(h + 12);
        doc.fillColor('#6b6656').font('Helvetica-Oblique').fontSize(9.5).text(noteTxt, M, y, opts);
        y += h + 16;
      }

      // ---------- Encart rendez-vous ----------
      ensure(70);
      doc.roundedRect(M, y, CW, 58, 10).fill(CREAM);
      doc.fillColor(NAVY).font('Times-Bold').fontSize(13).text('Envie d’aller plus loin ?', M + 18, y + 12);
      doc.fillColor('#3d3a30').font('Helvetica').fontSize(10)
        .text('Ce résultat est une estimation. Pour l’adapter à votre situation, échangeons 30 minutes : www.lechenepatrimonial.com/contact', M + 18, y + 32, { width: CW - 36 });
      y += 74;

      // ---------- Avertissement ----------
      const dis =
        "Avis important. Ce document est une estimation indicative et automatisee, a but pedagogique. Il ne constitue pas un conseil personnalise en investissement, en fiscalite ou en gestion de patrimoine au sens reglementaire. Seule une etude personnalisee, realisee avec votre conseiller, tient compte de votre situation complete. Le Chene Patrimonial intervient dans le cadre de ses habilitations (courtage en assurance et intermediation immobiliere) et ne delivre pas de conseil sur les instruments financiers.";
      const disOpts = { width: CW - 36, lineGap: 1.5 };
      const disH = doc.font('Helvetica').fontSize(8).heightOfString(dis, disOpts);
      ensure(disH + 36);
      doc.roundedRect(M, y, CW, disH + 28, 8).fill('#FBF9F3');
      doc.fillColor('#6b6656').font('Helvetica').fontSize(8).text(dis, M + 18, y + 14, disOpts);
      y += disH + 40;

      // ---------- Pied de page ----------
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fillColor('#c9c2ad').font('Helvetica').fontSize(7.5)
          .text('Le Chêne Patrimonial · Estimation indicative, ne constitue pas un conseil personnalisé · www.lechenepatrimonial.com',
            M, PAGE_H - 42, { width: CW, align: 'center' });
        doc.fillColor('#c9c2ad').font('Helvetica').fontSize(7.5)
          .text(`${i - range.start + 1} / ${range.count}`, M, PAGE_H - 42, { width: CW, align: 'right' });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
