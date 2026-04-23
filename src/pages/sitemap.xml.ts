import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { expertises } from '../data/site';

const SITE = 'https://www.lechenepatrimonial.com';

const staticPages = [
  { path: '/',                 priority: 1.0, changefreq: 'weekly' },
  { path: '/parcours',         priority: 0.9, changefreq: 'monthly' },
  { path: '/expertise',        priority: 0.9, changefreq: 'monthly' },
  { path: '/magazine',         priority: 0.9, changefreq: 'weekly' },
  { path: '/cas-pratiques',    priority: 0.8, changefreq: 'monthly' },
  { path: '/contact',          priority: 0.8, changefreq: 'yearly' },
  { path: '/mentions-legales', priority: 0.3, changefreq: 'yearly' },
  { path: '/confidentialite',  priority: 0.3, changefreq: 'yearly' },
];

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const cas = await getCollection('cas');
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    ...staticPages.map((p) => ({
      loc: `${SITE}${p.path}`,
      lastmod: today,
      changefreq: p.changefreq,
      priority: p.priority,
    })),
    ...expertises.map((e) => ({
      loc: `${SITE}/expertise/${e.slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      loc: `${SITE}/magazine/${a.slug}`,
      lastmod: (a.data.updatedAt ?? a.data.publishedAt).toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.7,
    })),
    ...cas.map((c) => ({
      loc: `${SITE}/cas-pratiques/${c.slug}`,
      lastmod: c.data.publishedAt.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.7,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
