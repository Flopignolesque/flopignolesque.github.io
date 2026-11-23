// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { markdownSite } from './src/lib/markdown-site.mjs';

export default defineConfig({
  site: 'https://flopignolesque.github.io',
  output: 'static',
  trailingSlash: 'always',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US' },
      },
      // La page racine "/" ne fait que rediriger vers /fr/
      filter: (page) => page !== 'https://flopignolesque.github.io/',
    }),
  ],

  markdown: {
    // Liens externes sécurisés + [TODO] visibles (voir src/lib/markdown-site.mjs)
    processor: satteri({ hastPlugins: [markdownSite] }),
  },

  build: {
    // Aucune feuille de style inline : la CSP n'autorise que 'self'
    inlineStylesheets: 'never',
    format: 'directory',
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Aucun script inline : tout passe par des fichiers .js (CSP script-src 'self')
      assetsInlineLimit: 0,
    },
  },
});
