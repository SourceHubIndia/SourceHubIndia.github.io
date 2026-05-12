// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Single source of truth for the deployed origin. Used by Astro.site, the
  // sitemap integration, and our own SEO/schema code.
  site: 'https://sourcehubindia.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
