import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { expertises } from '../data/site';
import { translatedRoutes } from '../i18n/ui';

const SITE = 'https://www.lechenepatrimonial.com';

const staticPages = [
  { path: '/',                 priority: 1.0, changefreq: 'weekly' },
  { path: '/parcours',         priority: 0.9, changefreq: 'monthly' },
  { path: '/expertise',        priority: 0.9, changefreq: 'monthly' },
  { path: '/expertise/lmnp-sportif-haut-niveau', priority: 0.8, changefreq: 'monthly' },
  { path: '/expertise/placement-sportif-haut-niveau', priority: 0.8, changefreq: 'monthly' },
  { path: '/conseiller-gestion-patrimoine-montpellier', priority: 0.8, changefreq: 'monthly' },
  { path: '/calculatrice-rentabilite-credit', priority: 0.8, changefreq: 'monthly' },
  // Outils & simulateurs (hub + outils signature + calculateurs)
  { path: '/outils',                          priority: 0.9, changefreq: 'weekly' },
  { path: '/outils/diagnostic-patrimonial',   priority: 0.9, changefreq: 'monthly' },
  { path: '/outils/apres-carriere',           priority: 0.9, changefreq: 'monthly' },
  { path: '/outils/liberte-financiere',       priority: 0.9, changefreq: 'monthly' },
  { path: '/outils/frais-de-notaire',         priority: 0.7, changefreq: 'monthly' },
  { path: '/outils/capacite-emprunt',         priority: 0.7, changefreq: 'monthly' },
  { path: '/outils/simulateur-ptz',           priority: 0.7, changefreq: 'monthly' },
  { path: '/outils/droits-succession',        priority: 0.7, changefreq: 'monthly' },
  { path: '/outils/plus-value-immobiliere',   priority: 0.7, changefreq: 'monthly' },
  { path: '/outils/lmnp',                     priority: 0.7, changefreq: 'monthly' },
  { path: '/outils/economie-impot-per',       priority: 0.7, changefreq: 'monthly' },
  { path: '/outils/louer-ou-acheter',         priority: 0.7, changefreq: 'monthly' },
  { path: '/outils/interets-composes',        priority: 0.7, changefreq: 'monthly' },
  { path: '/observatoire',     priority: 0.8, changefreq: 'monthly' },
  { path: '/questions-frequentes', priority: 0.7, changefreq: 'monthly' },
  { path: '/avis',             priority: 0.6, changefreq: 'weekly' },
  { path: '/manifeste',        priority: 0.6, changefreq: 'yearly' },
  { path: '/newsletter',       priority: 0.5, changefreq: 'monthly' },
  { path: '/magazine',         priority: 0.9, changefreq: 'weekly' },
  { path: '/actualites',       priority: 0.7, changefreq: 'weekly' },
  { path: '/opportunites',     priority: 0.8, changefreq: 'weekly' },
  { path: '/cas-pratiques',    priority: 0.8, changefreq: 'monthly' },
  { path: '/suisse-france',    priority: 0.8, changefreq: 'monthly' },
  { path: '/contact',          priority: 0.8, changefreq: 'yearly' },
  { path: '/mentions-legales', priority: 0.3, changefreq: 'yearly' },
  { path: '/confidentialite',  priority: 0.3, changefreq: 'yearly' },
];

// Chemin FR canonique -> chemin EN équivalent (/en/…), '/' devenant '/en/'.
const enPath = (path: string) => (path === '/' ? '/en/' : `/en${path}`);

type Entry = {
  path: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  hasEn: boolean;
};

// Construit un ou deux blocs <url> : la version FR (avec alternates hreflang si
// une version EN existe) et, le cas échéant, la version EN.
function renderEntry(e: Entry): string {
  const meta = `    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>`;

  if (!e.hasEn) {
    return `  <url>
    <loc>${SITE}${e.path}</loc>
${meta}
  </url>`;
  }

  const alt = `    <xhtml:link rel="alternate" hreflang="fr" href="${SITE}${e.path}" />
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${enPath(e.path)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${e.path}" />`;

  return `  <url>
    <loc>${SITE}${e.path}</loc>
${alt}
${meta}
  </url>
  <url>
    <loc>${SITE}${enPath(e.path)}</loc>
${alt}
${meta}
  </url>`;
}

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const cas = await getCollection('cas');
  const news = await getCollection('news');
  const opportunites = await getCollection('opportunites');
  const articlesEn = await getCollection('articlesEn');
  const casEn = await getCollection('casEn');
  const today = new Date().toISOString().split('T')[0];

  // Slugs disposant d'une version anglaise (contenu dynamique).
  const articlesEnSlugs = new Set(articlesEn.map((a) => a.slug));
  const casEnSlugs = new Set(casEn.map((c) => c.slug));

  const entries: Entry[] = [
    ...staticPages.map((p) => ({
      path: p.path,
      lastmod: today,
      changefreq: p.changefreq,
      priority: p.priority,
      hasEn: translatedRoutes.has(p.path),
    })),
    ...expertises.map((x) => ({
      path: `/expertise/${x.slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8,
      hasEn: translatedRoutes.has(`/expertise/${x.slug}`),
    })),
    ...articles.map((a) => ({
      path: `/magazine/${a.slug}`,
      lastmod: (a.data.updatedAt ?? a.data.publishedAt).toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.7,
      hasEn: articlesEnSlugs.has(a.slug),
    })),
    ...cas.map((c) => ({
      path: `/cas-pratiques/${c.slug}`,
      lastmod: c.data.publishedAt.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.7,
      hasEn: casEnSlugs.has(c.slug),
    })),
    ...news
      .filter((n) => !n.data.external)
      .map((n) => ({
        path: `/actualites/${n.slug}`,
        lastmod: n.data.publishedAt.toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.6,
        hasEn: false,
      })),
    ...opportunites
      .filter((o) => !o.data.external)
      .map((o) => ({
        path: `/opportunites/${o.slug}`,
        lastmod: o.data.publishedAt.toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.7,
        hasEn: false,
      })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(renderEntry).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
