# Le Chêne Patrimonial — site vitrine

Site du cabinet **Le Chêne Patrimonial** (Camil Czajkowski, CGP indépendant).
Stack : **Astro 4** + **Tailwind CSS** + contenu en **MDX**, déployé sur **Vercel**.

## Architecture

```
src/
├─ components/         # Composants réutilisables (Hero, CTA, Nav, Footer, etc.)
├─ content/
│  ├─ articles/        # Articles du magazine (MDX)
│  ├─ cas/             # Cas pratiques (MDX)
│  └─ config.ts        # Schémas Zod des collections
├─ data/
│  ├─ site.ts          # Navigation, nom, contact, liste des 10 expertises
│  └─ expertise-content.ts  # Contenu détaillé de chaque page expertise
├─ layouts/
│  └─ Base.astro       # Layout principal (SEO, OG, Nav, Footer)
├─ pages/              # Routage (file-based)
│  ├─ index.astro                 # Homepage
│  ├─ parcours.astro              # Storytelling sportif → CGP
│  ├─ expertise/                  # 1 index + 10 pages générées dynamiquement
│  ├─ magazine/                   # Blog (index + articles MDX)
│  ├─ cas-pratiques/              # Cas pratiques (index + pages MDX)
│  ├─ contact.astro               # Formulaire + Calendly embed
│  ├─ mentions-legales.astro
│  ├─ confidentialite.astro
│  └─ 404.astro
└─ styles/global.css   # Design system (couleurs, typographie, composants CSS)
```

## Design tokens

- **Typographies** : Fraunces (serif, titres) + Inter (sans, corps) — via `@fontsource-variable` (embedded, pas de Google Fonts en prod = meilleure perf & RGPD).
- **Palette** :
  - `ink` `#0F1B14` — texte et surfaces sombres
  - `cream` `#F5F1E8` — fond principal
  - `chene` `#2D4A33` — vert forêt, accent principal
  - `or` `#B89968` — or brossé, accent doré
  - `stone` — neutres chauds

## Démarrer en local

Prérequis : **Node 18+**.

```bash
# 1. Installer Node (si pas déjà fait)
# Recommandé : https://nodejs.org → version LTS
# Ou via nvm : https://github.com/nvm-sh/nvm

# 2. Installer les dépendances
cd ~/lechene-patrimonial
npm install

# 3. Lancer le serveur de dev
npm run dev
# → ouvre http://localhost:4321

# 4. Build de production (généralement pas besoin — Vercel le fait)
npm run build
npm run preview
```

## Ajouter un article de magazine

1. Créer un fichier `src/content/articles/mon-article.mdx` :

```mdx
---
title: "Titre de l'article"
description: "Description courte pour le SEO et les previews."
publishedAt: 2026-04-25
category: "Fiscalité"  # ou Placements, Immobilier, Retraite, Transmission, Méthode
readingTime: 7
featured: false
tags: ["PER", "Fiscalité"]
---

Contenu en Markdown. On peut faire des **gras**, *italiques*, listes, tableaux, citations…

## Sous-titre

Paragraphes…
```

2. Commit + push. Vercel déploie automatiquement.

## Ajouter un cas pratique

Même principe dans `src/content/cas/`.

## Ajouter / modifier une expertise

Les 10 piliers sont listés dans `src/data/site.ts` (métadonnées) et détaillés dans `src/data/expertise-content.ts` (corps complet). Les pages `/expertise/[slug]` sont générées automatiquement.

## Déploiement — Vercel + domaine IONOS

### Étape 1 : pousser le code sur GitHub

```bash
cd ~/lechene-patrimonial
git init
git add .
git commit -m "Initial commit — Le Chêne Patrimonial"
git branch -M main
# Créer un repo sur github.com, puis :
git remote add origin git@github.com:TON-USERNAME/lechene-patrimonial.git
git push -u origin main
```

### Étape 2 : connecter Vercel

1. Créer un compte sur [vercel.com](https://vercel.com) (gratuit avec GitHub).
2. « Add New Project » → importer le repo `lechene-patrimonial`.
3. Vercel détecte Astro automatiquement. Cliquer « Deploy ».
4. **Premier déploiement prêt en ~2 minutes** à une URL `xxx.vercel.app`.

### Étape 3 : ajouter le domaine IONOS

Sur Vercel :
1. Projet → **Settings → Domains** → ajouter `lechenepatrimonial.com` **et** `www.lechenepatrimonial.com`.
2. Vercel affiche les enregistrements DNS à configurer.

Sur IONOS :
1. Aller dans **Domaines & SSL → lechenepatrimonial.com → Paramètres DNS**.
2. Supprimer les enregistrements A, AAAA et CNAME existants qui pointent vers Squarespace.
3. Créer les enregistrements suivants :

| Type | Nom | Valeur |
|------|-----|--------|
| A    | @   | `76.76.21.21` (IP Vercel) |
| CNAME | www | `cname.vercel-dns.com` |

4. Attendre la propagation DNS (5 min à 4 h max).

Vercel émet automatiquement un **certificat SSL Let's Encrypt** une fois que les DNS pointent correctement. Plus rien à faire.

### Étape 4 : variables d'environnement

Dans **Vercel → Settings → Environment Variables**, ajouter :

```
PUBLIC_CALENDLY_URL=https://calendly.com/ton-lien-calendly
PUBLIC_SITE_URL=https://www.lechenepatrimonial.com
```

## Intégrations à finaliser

- **Calendly** : créer un compte, un événement « Rendez-vous découverte 30 min », copier l'URL dans `.env` ou dans le code (`src/data/site.ts`).
- **Formulaire contact** : ouvrir un compte [Formspree](https://formspree.io) (gratuit jusqu'à 50 soumissions/mois) et remplacer `REPLACE_ME` dans `src/pages/contact.astro` par l'endpoint. Alternative : [Web3Forms](https://web3forms.com), [Getform.io](https://getform.io).
- **Mentions légales** : compléter les numéros ORIAS, RCP, etc. dans `src/pages/mentions-legales.astro`.
- **OG image** : générer une image `og-default.jpg` 1200×630 et la placer dans `public/`.
- **Avis clients** : intégrer les vrais avis dans `src/components/Testimonials.astro` (placeholder actuel) — idéalement connecter Google Business Profile ou Trustpilot via un widget.

## Checklist pré-mise en production

- [ ] Compléter les mentions légales (ORIAS, RCP, adresse)
- [ ] Brancher Calendly réel
- [ ] Brancher Formspree/formulaire réel
- [ ] Relire tous les textes
- [ ] Ajouter l'OG image
- [ ] Vérifier le SEO de chaque page (title, description)
- [ ] Tester le site sur mobile, tablette, desktop
- [ ] Tester la prise de rendez-vous de bout en bout
- [ ] Configurer Google Search Console
- [ ] Soumettre le sitemap : `https://www.lechenepatrimonial.com/sitemap-index.xml`

## Performance & SEO

Le site est conçu pour des scores Lighthouse élevés :
- **HTML statique** (pas de JS bloquant côté serveur)
- **Fonts auto-hébergées** (pas d'appels Google Fonts)
- **Images SVG inline** pour les logos/icônes
- **Sitemap généré automatiquement** par `@astrojs/sitemap`
- **Données structurées** JSON-LD (type `FinancialService`) dans `Base.astro`
- **Meta OG & Twitter** sur chaque page

## Maintenance & coûts

- **Hébergement Vercel** : gratuit (plan Hobby, largement suffisant pour un site vitrine).
- **Domaine IONOS** : ~15€/an (déjà payé).
- **Calendly** : gratuit ou ~10€/mois selon les besoins.
- **Formspree** : gratuit jusqu'à 50 soumissions/mois.

**Total récurrent : 0 à 15€/mois** vs ~20-40€/mois Squarespace.
