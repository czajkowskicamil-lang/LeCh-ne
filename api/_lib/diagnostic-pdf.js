// Générateur du PDF "Diagnostic patrimonial" — Le Chêne Patrimonial.
// Rapport gratuit, téléchargé directement par le visiteur depuis la page de résultats.
// pdfkit (CommonJS) importé en ESM ; renvoie un Buffer. Polices standard uniquement.

import PDFDocument from 'pdfkit';

const NAVY = '#03102E';
const NAVY_SOFT = '#0A1F4F';
const GOLD = '#D4A82D';
const GOLD_LIGHT = '#E6C259';
const GOLD_DARK = '#A7801F';
const GREEN = '#2D4A33';
const RED = '#B4472E';
const STONE = '#7A7566';
const CREAM = '#F5F1E8';
const CREAM_DEEP = '#EDE6D3';
const INK = '#03102E';

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 54;
const CW = PAGE_W - M * 2;

const frNum = (n) => Math.round(+n || 0).toLocaleString('fr-FR').replace(/[   ]/g, ' ');
const eur = (n) => (Number.isFinite(+n) ? frNum(n) + ' €' : '—');
const barColor = (s) => (s >= 66 ? GREEN : s >= 40 ? GOLD_DARK : RED);

export function buildDiagnosticPdf(data = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const a = data.answers || {};
      const d = data.diagnostic || {};
      const prenom = String(a.prenom || data.prenom || '').slice(0, 60);
      const nom = String(a.nom || data.nom || '').slice(0, 60);
      const nomComplet = `${prenom} ${nom}`.trim();
      const dateStr = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

      let y = 0;

      // ---------------- En-tête ----------------
      doc.rect(0, 0, PAGE_W, 128).fill(NAVY);
      doc.fillColor(GOLD_LIGHT).font('Helvetica-Bold').fontSize(9)
        .text('LE CHENE PATRIMONIAL', M, 32, { characterSpacing: 2 });
      doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(24)
        .text('Diagnostic patrimonial', M, 50);
      doc.fillColor(CREAM).font('Times-Roman').fontSize(14)
        .text('Votre indice de sante patrimoniale', M, 82);
      doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9)
        .text(dateStr, M, 40, { width: CW, align: 'right' });
      if (nomComplet) {
        doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9)
          .text(nomComplet, M, 54, { width: CW, align: 'right' });
      }

      y = 152;

      // ---------------- Bloc score ----------------
      const boxH = 96;
      doc.roundedRect(M, y, CW, boxH, 12).fill(CREAM);
      // Anneau simplifié : disque or dont l'angle traduit le score.
      const cx = M + 58, cy = y + boxH / 2, r = 34;
      doc.save();
      doc.circle(cx, cy, r).lineWidth(7).stroke(CREAM_DEEP);
      const frac = Math.max(0, Math.min(1, (d.score || 0) / 100));
      // arc de score
      doc.lineWidth(7).strokeColor(GOLD);
      doc.path(describeArc(cx, cy, r, -90, -90 + frac * 360)).stroke();
      doc.restore();
      doc.fillColor(INK).font('Times-Bold').fontSize(22)
        .text(String(d.score ?? '—'), cx - r, cy - 12, { width: r * 2, align: 'center' });
      doc.fillColor(STONE).font('Helvetica').fontSize(8)
        .text('/100', cx - r, cy + 10, { width: r * 2, align: 'center' });

      const tx = M + 116;
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10)
        .text((d.niveauLabel || '').toUpperCase(), tx, y + 20, { characterSpacing: 1 });
      doc.fillColor(INK).font('Helvetica').fontSize(10)
        .text(stripHtml(d.resume || ''), tx, y + 36, { width: CW - 130, lineGap: 2 });
      y += boxH + 22;

      if (d.statutNote) {
        doc.fillColor(STONE).font('Helvetica-Oblique').fontSize(9)
          .text(stripHtml(d.statutNote), M, y, { width: CW, lineGap: 2 });
        y += doc.heightOfString(stripHtml(d.statutNote), { width: CW }) + 16;
      }

      // ---------------- Helpers de flux ----------------
      function ensure(h) {
        if (y + h > PAGE_H - 64) { doc.addPage(); y = 54; }
      }
      function sectionTitle(txt) {
        ensure(42);
        doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10)
          .text(txt.toUpperCase(), M, y, { characterSpacing: 1.5 });
        y += 15;
        doc.moveTo(M, y).lineTo(M + 32, y).lineWidth(2).stroke(GOLD);
        y += 15;
      }

      // ---------------- Chiffres clés ----------------
      sectionTitle('Vos chiffres cles');
      const kpis = [
        ['Patrimoine net estime', eur(d.patrimoineNet)],
        ['Epargne de precaution', (d.moisPrecaution ?? 0) + ' mois'],
        ["Taux d'endettement", (d.tauxEndettement ?? 0) + ' %'],
        ["Poids de l'immobilier", (d.poidsImmo ?? 0) + ' %'],
      ];
      const kw = (CW - 12) / 4;
      kpis.forEach((k, i) => {
        const kx = M + i * (kw + 4);
        doc.roundedRect(kx, y, kw, 52, 8).fill('#FAF7EF');
        doc.fillColor(INK).font('Times-Bold').fontSize(13).text(k[1], kx + 8, y + 12, { width: kw - 16, align: 'center' });
        doc.fillColor(STONE).font('Helvetica').fontSize(7.5).text(k[0], kx + 6, y + 33, { width: kw - 12, align: 'center' });
      });
      y += 52 + 22;

      // ---------------- Piliers ----------------
      sectionTitle('Le detail, pilier par pilier');
      (d.piliers || []).forEach((p) => {
        ensure(30);
        doc.fillColor(INK).font('Helvetica').fontSize(9.5).text(p.label, M, y);
        doc.fillColor(STONE).font('Helvetica-Bold').fontSize(9.5)
          .text(p.score + '/100', M, y, { width: CW, align: 'right' });
        y += 15;
        doc.roundedRect(M, y, CW, 5, 2.5).fill(CREAM_DEEP);
        const w = Math.max(4, (Math.max(0, Math.min(100, p.score)) / 100) * CW);
        doc.roundedRect(M, y, w, 5, 2.5).fill(barColor(p.score));
        y += 16;
      });
      y += 8;

      // ---------------- Répartition ----------------
      if ((d.repartition || []).length) {
        sectionTitle('Repartition de votre patrimoine');
        d.repartition.forEach((rr) => {
          ensure(18);
          doc.rect(M, y + 1, 9, 9).fill(rr.color || STONE);
          doc.fillColor(INK).font('Helvetica').fontSize(9.5).text(rr.label, M + 16, y);
          doc.fillColor(STONE).font('Helvetica-Bold').fontSize(9.5)
            .text(Math.round(rr.part) + ' %  (' + eur(rr.montant) + ')', M, y, { width: CW, align: 'right' });
          y += 17;
        });
        y += 10;
      }

      // ---------------- Économie fiscale ----------------
      if (d.economieFiscaleEstimee > 0) {
        ensure(70);
        doc.roundedRect(M, y, CW, 58, 10).fill(NAVY);
        doc.fillColor('#9fb0c8').font('Helvetica').fontSize(8)
          .text("PISTE D'OPTIMISATION FISCALE", M + 18, y + 12, { characterSpacing: 1 });
        doc.fillColor(GOLD_LIGHT).font('Times-Bold').fontSize(20)
          .text(eur(d.economieFiscaleEstimee) + ' / an', M + 18, y + 24);
        doc.fillColor('#c9d3e0').font('Helvetica').fontSize(8.5)
          .text('via un versement PER d’environ ' + eur(d.perVersementSuggere) + ' (a confirmer).', M + 18, y + 46, { width: CW - 36 });
        y += 58 + 20;
      }

      // ---------------- Listes d'analyse ----------------
      const insightBlock = (title, items, color) => {
        if (!items || !items.length) return;
        sectionTitle(title);
        items.forEach((it) => {
          const t = stripHtml(it.titre);
          const dt = stripHtml(it.detail);
          const th = doc.font('Helvetica-Bold').fontSize(10).heightOfString(t, { width: CW - 16 });
          const dh = doc.font('Helvetica').fontSize(9.5).heightOfString(dt, { width: CW - 16, lineGap: 1.5 });
          ensure(th + dh + 14);
          doc.circle(M + 3, y + 5, 2.4).fill(color);
          doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(t, M + 16, y, { width: CW - 16 });
          y += th + 2;
          doc.fillColor('#4a4a52').font('Helvetica').fontSize(9.5).text(dt, M + 16, y, { width: CW - 16, lineGap: 1.5 });
          y += dh + 10;
        });
        y += 6;
      };

      insightBlock('Vos points forts', d.forces, GREEN);
      insightBlock('Points de vigilance', d.faiblesses, GOLD_DARK);
      insightBlock('Vos opportunites', d.opportunites, NAVY_SOFT);
      insightBlock('Risques a couvrir', d.risques, RED);

      // ---------------- Priorités ----------------
      if ((d.priorites || []).length) {
        insightBlock('Vos priorites', d.priorites, GOLD);
      }

      // ---------------- Plan 12 mois ----------------
      if ((d.plan || []).length) {
        sectionTitle("Votre plan d'action sur 12 mois");
        d.plan.forEach((p) => {
          const t = stripHtml(p.titre);
          const dt = stripHtml(p.detail);
          const dh = doc.font('Helvetica').fontSize(9.5).heightOfString(dt, { width: CW - 100, lineGap: 1.5 });
          ensure(dh + 22);
          doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(8.5).text((p.periode || '').toUpperCase(), M, y + 1, { width: 88 });
          doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(t, M + 96, y, { width: CW - 96 });
          y += 14;
          doc.fillColor('#4a4a52').font('Helvetica').fontSize(9.5).text(dt, M + 96, y, { width: CW - 96, lineGap: 1.5 });
          y += dh + 12;
        });
      }

      // ---------------- Pied de page / CTA ----------------
      ensure(96);
      y = Math.max(y + 6, PAGE_H - 150);
      doc.roundedRect(M, y, CW, 80, 10).fill(CREAM);
      doc.fillColor(INK).font('Times-Bold').fontSize(13)
        .text('Transformons ce diagnostic en strategie.', M + 18, y + 16, { width: CW - 36 });
      doc.fillColor(STONE).font('Helvetica').fontSize(9.5)
        .text('Prenez rendez-vous avec Le Chene Patrimonial pour une etude patrimoniale complete.', M + 18, y + 38, { width: CW - 36 });
      doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(9.5)
        .text('lechenepatrimonial.com  ·  camil.cz@lechenepatrimonial.com  ·  06 12 82 91 90', M + 18, y + 58, { width: CW - 36 });

      // Mention légale en bas de la dernière page.
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i);
        doc.fillColor(STONE).font('Helvetica').fontSize(6.8)
          .text(
            'Estimation indicative et automatisee, a but pedagogique, sans valeur de conseil personnalise. Le Chene Patrimonial intervient au titre du courtage en assurance et de l\'intermediation immobiliere.',
            M, PAGE_H - 34, { width: CW, align: 'center' }
          );
        doc.fillColor('#b8b3a6').fontSize(6.8).text(`${i + 1} / ${range.count}`, M, PAGE_H - 22, { width: CW, align: 'center' });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// Trace un arc SVG-like pour l'anneau de score.
function polarToCartesian(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

const stripHtml = (s = '') =>
  String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
