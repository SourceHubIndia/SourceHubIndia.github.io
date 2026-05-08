// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sourcehubindia.com',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
