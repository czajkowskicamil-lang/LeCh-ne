// Générateur du PDF "Étude patrimoniale" — Le Chêne Patrimonial.
// Utilisé par la fonction de fulfillment après paiement Stripe.
// pdfkit (CommonJS) importé en ESM ; renvoie un Buffer.
import PDFDocument from 'pdfkit';

// Couleurs de marque
const NAVY = '#03102E';
const NAVY_SOFT = '#0A1F4F';
const GOLD = '#D4A82D';
const GOLD_LIGHT = '#E6C259';
const GOLD_DARK = '#A7801F';
const GREEN = '#2D4A33';
const STONE = '#7A7566';
const CREAM = '#F5F1E8';
const INK = '#03102E';

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 54; // marge de contenu
const CW = PAGE_W - M * 2; // largeur de contenu

const stripHtml = (s = '') =>
  String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

// Espace insécable fine (U+202F) et insécable (U+00A0) ne sont pas encodables
// par les polices standard de pdfkit : on les remplace par une espace normale.
const frNum = (n) => Math.round(+n).toLocaleString('fr-FR').replace(/[\u202F\u00A0\u2009]/g, ' ');
const eur = (n) => (Number.isFinite(+n) ? frNum(n) + ' €' : '—');

export function buildEtudePdf(data = {}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const diag = data.diag || {};
      const prenom = (data.prenom || '').toString().slice(0, 60);
      const nom = (data.nom || '').toString().slice(0, 60);
      const nomComplet = `${prenom} ${nom}`.trim() || 'Client';
      const dateStr = data.date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

      let y = 0;

      // ---------------- Bandeau d'en-tête ----------------
      doc.rect(0, 0, PAGE_W, 132).fill(NAVY);
      doc.fillColor(GOLD_LIGHT).font('Helvetica-Bold').fontSize(9)
        .text('LE CHÊNE PATRIMONIAL', M, 34, { characterSpacing: 2 });
      doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(24)
        .text('Étude patrimoniale', M, 52);
      doc.fillColor(CREAM).font('Times-Roman').fontSize(15)
        .text('personnalisée', M, 82);
      doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9)
        .text(dateStr, M, 44, { width: CW, align: 'right' });
      doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9)
        .text('Document personnel et confidentiel', M, 58, { width: CW, align: 'right' });

      y = 158;

      // ---------------- Destinataire ----------------
      doc.fillColor(STONE).font('Helvetica').fontSize(9)
        .text('ÉTABLIE POUR', M, y, { characterSpacing: 1.5 });
      y += 14;
      doc.fillColor(INK).font('Times-Bold').fontSize(19).text(nomComplet, M, y);
      y += 30;
      doc.moveTo(M, y).lineTo(PAGE_W - M, y).lineWidth(1).stroke('#EDE6D3');
      y += 22;

      // ---------------- Helpers ----------------
      function ensure(h) {
        if (y + h > PAGE_H - 70) {
          doc.addPage();
          y = 58;
        }
      }
      function sectionTitle(txt) {
        ensure(46);
        doc.fillColor(GOLD_DARK).font('Helvetica-Bold').fontSize(10)
          .text(txt.toUpperCase(), M, y, { characterSpacing: 1.5 });
        y += 16;
        doc.moveTo(M, y).lineTo(M + 34, y).lineWidth(2).stroke(GOLD);
        y += 16;
      }
      function kvRow(label, value, opts = {}) {
        ensure(24);
        doc.fillColor(STONE).font('Helvetica').fontSize(10).text(label, M, y, { width: CW * 0.62 });
        doc.fillColor(opts.color || INK).font('Helvetica-Bold').fontSize(11)
          .text(value, M + CW * 0.62, y - 1, { width: CW * 0.38, align: 'right' });
        y += 22;
      }
      function heroBox(label, value, sub) {
        ensure(78);
        doc.roundedRect(M, y, CW, 66, 10).fill(NAVY);
        doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9)
          .text(label.toUpperCase(), M + 20, y + 14, { characterSpacing: 1 });
        doc.fillColor(GOLD_LIGHT).font('Times-Bold').fontSize(26)
          .text(value, M + 20, y + 26);
        if (sub) {
          doc.fillColor('#9fb0c8').font('Helvetica').fontSize(9)
            .text(sub, M + 20, y + 26, { width: CW - 40, align: 'right' });
        }
        y += 82;
      }
      function paragraphList(items, bullet = true) {
        items.forEach((raw) => {
          const txt = stripHtml(raw);
          if (!txt) return;
          const opts = { width: CW - (bullet ? 16 : 0), align: 'left', lineGap: 2 };
          const h = doc.font('Helvetica').fontSize(10.5).heightOfString(txt, opts);
          ensure(h + 10);
          if (bullet) {
            doc.save();
            doc.translate(M + 3, y + 5).rotate(45).rect(0, 0, 4, 4).fill(GREEN);
            doc.restore();
            doc.fillColor('#3d3a30').font('Helvetica').fontSize(10.5).text(txt, M + 16, y, opts);
          } else {
            doc.fillColor('#3d3a30').font('Helvetica').fontSize(10.5).text(txt, M, y, opts);
          }
          y += h + 10;
        });
      }
      function optimList(items) {
        items.forEach((o) => {
          const title = stripHtml(o.t || '');
          const body = stripHtml(o.h || '');
          if (!title && !body) return;
          const bodyOpts = { width: CW - 20, lineGap: 2 };
          const bh = doc.font('Helvetica').fontSize(10).heightOfString(body, bodyOpts);
          ensure(bh + 34);
          // filet vertical or
          doc.rect(M, y + 2, 3, bh + 20).fill(GOLD);
          doc.fillColor(NAVY).font('Times-Bold').fontSize(12.5).text(title, M + 16, y);
          y += 18;
          doc.fillColor('#3d3a30').font('Helvetica').fontSize(10).text(body, M + 16, y, bodyOpts);
          y += bh + 14;
        });
      }

      // ---------------- 1. Situation fiscale ----------------
      sectionTitle('Votre situation fiscale');
      if (diag.impot != null) {
        heroBox('Impôt sur le revenu estimé', eur(diag.impot),
          diag.tauxMoyen != null ? 'soit ' + String(diag.tauxMoyen).replace('.', ',') + ' % de vos revenus' : '');
      }
      if (diag.tmi != null) kvRow('Tranche marginale d\'imposition (TMI)', diag.tmi + ' %');
      if (diag.tauxMoyen != null) kvRow('Taux moyen d\'imposition', String(diag.tauxMoyen).replace('.', ',') + ' %');
      if (diag.revenuImposable != null) kvRow('Revenu net imposable', eur(diag.revenuImposable));
      if (diag.foncierNet != null && diag.foncierNet !== 0) kvRow('Revenus fonciers (net)', eur(diag.foncierNet));
      if (diag.parts != null) kvRow('Nombre de parts fiscales', String(diag.parts).replace('.', ','));
      y += 8;

      // ---------------- 2. Patrimoine ----------------
      sectionTitle('Lecture de votre patrimoine');
      if (diag.patrimoineNet != null) kvRow('Patrimoine net estimé', eur(diag.patrimoineNet));
      if (diag.epargneFinanciere != null) kvRow('Épargne financière', eur(diag.epargneFinanciere));
      if (diag.poidsImmo != null) kvRow('Poids de l\'immobilier', diag.poidsImmo + ' %');
      if (diag.baseIFI != null && diag.baseIFI > 0) kvRow('Base taxable IFI (estimée)', eur(diag.baseIFI), { color: diag.baseIFI > 1300000 ? GOLD_DARK : INK });
      if (diag.creditCRD != null && diag.creditCRD > 0) kvRow('Crédits en cours (capital restant dû)', eur(diag.creditCRD));
      if (diag.tauxEndettement != null && diag.tauxEndettement > 0) kvRow('Taux d\'endettement', String(diag.tauxEndettement).replace('.', ',') + ' %');
      if (diag.capaciteEpargneMois != null && diag.capaciteEpargneMois > 0) kvRow('Capacité d\'épargne mensuelle', eur(diag.capaciteEpargneMois));
      y += 8;

      // ---------------- 3. Profil ----------------
      sectionTitle('Votre profil');
      if (diag.situation) kvRow('Situation familiale', diag.situation);
      if (diag.statut) kvRow('Statut professionnel', diag.statut);
      if (diag.regime && diag.regime !== '—') kvRow('Régime matrimonial', diag.regime);
      if (diag.profil) kvRow('Profil d\'investisseur', diag.profil);
      if (diag.prevoyance) kvRow('Prévoyance', diag.prevoyance);
      if (diag.objectifs) kvRow('Objectifs prioritaires', diag.objectifs);
      if (diag.projets) kvRow('Projets à financer', diag.projets);
      y += 10;

      // ---------------- 4. Lecture ----------------
      if (Array.isArray(data.lecture) && data.lecture.length) {
        sectionTitle('Lecture de votre situation');
        paragraphList(data.lecture, true);
        y += 8;
      }

      // ---------------- 5. Axes d'optimisation ----------------
      if (Array.isArray(data.optim) && data.optim.length) {
        sectionTitle('Vos axes d\'optimisation prioritaires');
        optimList(data.optim);
        y += 8;
      }

      // ---------------- Avertissement ----------------
      const dis = "Avis important. Ce document constitue une estimation indicative et automatisee, a but pedagogique. Il ne constitue ni un avis d'imposition officiel, ni un conseil personnalise en investissement, en fiscalite ou en gestion de patrimoine au sens reglementaire. Les calculs reposent sur le bareme de l'impot sur les revenus 2025 et n'integrent pas l'ensemble des dispositifs (decote, reductions et credits d'impot, situations particulieres). Seule une etude personnalisee, realisee avec votre conseiller, tient compte de votre situation complete. Le Chene Patrimonial intervient dans le cadre de ses habilitations (courtage en assurance et intermediation immobiliere) et ne delivre pas de conseil sur les instruments financiers.";
      const disOpts = { width: CW - 36, lineGap: 1.5 };
      const disH = doc.font('Helvetica').fontSize(8).heightOfString(dis, disOpts);
      ensure(disH + 40);
      doc.roundedRect(M, y, CW, disH + 28, 8).fill(CREAM);
      doc.fillColor('#6b6656').font('Helvetica').fontSize(8).text(dis, M + 18, y + 14, disOpts);
      y += disH + 40;

      // ---------------- Pieds de page (toutes les pages) ----------------
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
