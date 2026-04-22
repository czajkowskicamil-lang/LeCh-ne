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

export const collections = { articles, cas };
