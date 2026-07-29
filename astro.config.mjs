import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://www.lechenepatrimonial.com',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false, // FR à la racine (/), EN sous /en/
    },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
