import type { APIRoute } from 'astro';

// Generated at build time so the Sitemap URL tracks `site` in astro.config.mjs.
export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap-index.xml', site).href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
