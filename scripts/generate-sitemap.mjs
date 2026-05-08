#!/usr/bin/env node
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://usaeo.org';

const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.9', changefreq: 'monthly' },
  { path: '/competitions', priority: '0.9', changefreq: 'monthly' },
  { path: '/competitions/quiz-bowl', priority: '0.9', changefreq: 'monthly' },
  { path: '/competitions/essay', priority: '0.9', changefreq: 'monthly' },
  { path: '/competitions/qualifiers', priority: '0.9', changefreq: 'monthly' },
  { path: '/competitions/finals', priority: '0.9', changefreq: 'monthly' },
  { path: '/competitions/partner-competitions', priority: '0.7', changefreq: 'monthly' },
  { path: '/partner-programs', priority: '0.7', changefreq: 'monthly' },
  { path: '/news', priority: '0.8', changefreq: 'weekly' },
  { path: '/workshops', priority: '0.8', changefreq: 'monthly' },
  { path: '/curriculum', priority: '0.9', changefreq: 'monthly' },
  { path: '/research', priority: '0.7', changefreq: 'monthly' },
  { path: '/chapters', priority: '0.8', changefreq: 'monthly' },
  { path: '/team', priority: '0.6', changefreq: 'monthly' },
  { path: '/partners', priority: '0.7', changefreq: 'monthly' },
  { path: '/careers/apply', priority: '0.6', changefreq: 'monthly' },
  { path: '/legal', priority: '0.3', changefreq: 'yearly' },
  { path: '/register/quiz-bowl', priority: '0.8', changefreq: 'monthly' },
  { path: '/register/essay', priority: '0.8', changefreq: 'monthly' },
  { path: '/register/chapter', priority: '0.7', changefreq: 'monthly' },
];

const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${ROUTES.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-us" href="${SITE_URL}${r.path}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${r.path}"/>
  </url>`).join('\n')}
</urlset>
`;

const out = resolve(__dirname, '..', 'public', 'sitemap.xml');
if (!existsSync(dirname(out))) mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, xml, 'utf8');
console.log(`sitemap.xml written: ${ROUTES.length} routes -> ${out}`);
