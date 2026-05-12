// Builds one OG PNG per page into public/images/og/.
// Run manually with `node scripts/build-og-image.mjs`, or automatically via the
// `prebuild` npm hook before `astro build`.
import { mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Embed Inter so the rendered text matches the live site (sharp/resvg has no
// access to system fonts and would otherwise fall back to a generic sans).
const interFont = readFileSync(join(root, 'public/fonts/inter.woff2'));
const interB64 = interFont.toString('base64');

const NAVY = '#1B3A5C';
const ORANGE = '#D4552A';
const MUTED = '#6B7280';
const FAINT = '#9CA3AF';

// Per-page headlines. `slug` becomes the filename; `default` is the fallback
// used by any page that doesn't pass an explicit ogImage prop.
const PAGES = [
  { slug: 'default',    primary: 'One click convenience to outsourcing' },
  { slug: 'about',      primary: '20+ years. 600+ specialists. Three offices.' },
  { slug: 'services',   primary: 'Legal coding, document review, litigation support' },
  { slug: 'industries', primary: 'Six verticals. Domain experts in each.' },
  { slug: 'leadership', primary: 'Meet the team behind Source Hub' },
  { slug: 'contact',    primary: "Let's talk about your document workflow" },
];

const SECONDARY = 'Trusted Legal Document Partner for Fortune 500 Companies';

function renderSvg({ primary }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        src: url(data:font/woff2;base64,${interB64}) format('woff2');
      }
      .wordmark { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 112px; letter-spacing: 2px; }
      .tagline-primary { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 34px; fill: ${NAVY}; letter-spacing: 0.2px; }
      .tagline-secondary { font-family: 'Inter', sans-serif; font-weight: 400; font-size: 24px; fill: ${MUTED}; letter-spacing: 0.2px; }
      .certs { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 18px; fill: ${FAINT}; letter-spacing: 2.4px; }
      .url { font-family: 'Inter', sans-serif; font-weight: 500; font-size: 20px; fill: ${MUTED}; letter-spacing: 0.4px; }
    </style>
  </defs>

  <rect width="1200" height="630" fill="#FFFFFF"/>
  <rect x="0" y="0" width="1200" height="6" fill="${ORANGE}"/>

  <g transform="translate(110, 220)">
    <path d="M30 0 Q-6 56, 30 112 Q66 168, 30 224"
          stroke="${ORANGE}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <text x="78" y="160" class="wordmark">
      <tspan fill="${NAVY}">SOURCE</tspan><tspan fill="${ORANGE}">HUB</tspan>
    </text>
  </g>

  <text x="188" y="430" class="tagline-primary">${escapeXml(primary)}</text>
  <text x="188" y="476" class="tagline-secondary">${escapeXml(SECONDARY)}</text>
  <text x="188" y="538" class="certs">ISO 27001 · HIPAA · SOC 2 · PCI-DSS · ISAE 3402</text>
  <text x="188" y="592" class="url">sourcehubindia.com</text>
</svg>`;
}

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

const outDir = join(root, 'public/images/og');
mkdirSync(outDir, { recursive: true });

await Promise.all(
  PAGES.map(async (page) => {
    const svg = renderSvg(page);
    const outPath = join(outDir, `${page.slug}.png`);
    await sharp(Buffer.from(svg)).resize(1200, 630).png().toFile(outPath);
    console.log(`Wrote ${outPath}`);
  }),
);

// Keep the legacy /images/og-image.png path working as a copy of the default,
// so any external links (LinkedIn cache, etc.) still resolve.
await sharp(Buffer.from(renderSvg(PAGES[0])))
  .resize(1200, 630)
  .png()
  .toFile(join(root, 'public/images/og-image.png'));
console.log('Wrote public/images/og-image.png (legacy alias)');
