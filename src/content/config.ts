import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    author: z.string().default('Camil Czajkowski'),
    category: z.enum([
      'Fiscalité',
      'Placements',
      'Immobilier',
      'Retraite',
      'Transmission',
      'Méthode',
    ]),
    readingTime: z.number().default(6),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

const cas = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    profil: z.string(),
    problematique: z.string(),
    publishedAt: z.date(),
    featured: z.boolean().default(false),
  }),
});

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.date(),
    category: z
      .enum(['Cabinet', 'Réglementation', 'Marché', 'Partenariat'])
      .default('Cabinet'),
    // Lien externe optionnel (article de presse, communiqué...). Si présent,
    // la carte renvoie vers ce lien plutôt que vers une page détail.
    external: z.string().url().optional(),
    pinned: z.boolean().default(false),
  }),
});

const opportunites = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.date(),
    type: z
      .enum([
        'Immobilier neuf',
        'Immobilier ancien',
        'LMNP',
        'Nue-propriété',
        'SCPI',
        'Private Equity',
        'Autre',
      ])
      .default('Autre'),
    // Disponibilité de l'opportunité (badge affiché sur la carte).
    status: z
      .enum(['Disponible', 'Dernières opportunités', 'Bientôt', 'Clôturée'])
      .default('Disponible'),
    location: z.string().optional(), // ex : "Bordeaux (33)"
    ticket: z.string().optional(), // ex : "à partir de 150 000 €"
    // Atout clé mis en avant, formulé sobrement (ex : "Zone tendue, forte demande locative").
    // Éviter les rendements bruts en clair : communication publique encadrée.
    highlight: z.string().optional(),
    // Lien externe optionnel (plaquette partenaire, PDF...). Si présent,
    // la carte renvoie vers ce lien plutôt que vers une page détail.
    external: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { articles, cas, news, opportunites };
