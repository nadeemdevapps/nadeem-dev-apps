// Build-time sitemap endpoint: /sitemap.xml
//
// The hand-built plain sitemap crawlers and tools expect at the
// conventional URL, generated at build time from the actual page files
// in src/pages, so it can never go stale: add or remove a page and the
// next build picks it up automatically. This is the only sitemap the
// site emits — the @astrojs/sitemap integration was removed, so no
// sitemap-index.xml / sitemap-0.xml is generated. This plain sitemap
// additionally lists the merged Tsumly/Kaizenly product pages and the
// merged concept site roots below.
//
// The product pages cannot be globbed here: the Tsumly/Kaizenly sites
// are independent Astro projects merged into dist/ AFTER this build
// (scripts/merge-tsumly.mjs, scripts/merge-kaizenly.mjs), so their
// pages are not in src/pages yet when this endpoint runs. They are
// listed statically instead — the same 7 pages per product that the
// merge scripts verify after the copy. If a product site gains a page,
// add it here and to the merge script's page list.
import type { APIRoute } from 'astro';
import fs from 'node:fs';

// Lazy glob: we only need the file paths (the keys), never the modules.
const pageFiles = import.meta.glob('./**/*.astro');

// Merged product pages (see the header comment): one entry per page the
// product sites ship, as a route relative to the site base.
const productRoutes = [
  'products/tsumly',
  'products/tsumly/about',
  'products/tsumly/download',
  'products/tsumly/features',
  'products/tsumly/gallery',
  'products/tsumly/privacy',
  'products/tsumly/terms',
  'products/kaizenly',
  'products/kaizenly/about',
  'products/kaizenly/download',
  'products/kaizenly/features',
  'products/kaizenly/gallery',
  'products/kaizenly/privacy',
  'products/kaizenly/terms',
];

// Merged concept sites (see scripts/merge-concepts.mjs): one entry per
// concept root — the concepts are SPAs, so only their roots are listed;
// their sub-routes are client-side and must not appear in the sitemap.
const conceptRoutes = [
  'concepts/tally-bar',
  'concepts/look-out-below',
  'concepts/stitch-and-tan',
  'concepts/product-site',
  'concepts/portfolio-concept',
];

function fileToRoute(file: string): string | null {
  // file looks like './about.astro' or './products/tsumly.astro'
  let route = file.replace(/^\.\//, '').replace(/\.astro$/, '');
  if (route === '404') return null; // error page: never in a sitemap
  if (route === 'index') return ''; // home page: '' (not 'index')
  if (route.endsWith('/index')) route = route.slice(0, -'/index'.length);
  return route; // '' for the home page, otherwise e.g. 'about', 'products/tsumly'
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Modification time of a source file in the repo, as an ISO date
// (YYYY-MM-DD). Falls back to the build date when the file cannot be
// read. `path` is relative to this file, or null when a route has no
// single source file.
function fileLastmod(path: string | null): string {
  if (!path) return isoDate(new Date());
  try {
    return isoDate(fs.statSync(new URL(path, import.meta.url)).mtime);
  } catch {
    return isoDate(new Date());
  }
}

// Source .astro file of a merged product page, relative to this file:
// 'products/tsumly' -> tsumly/src/pages/index.astro,
// 'products/kaizenly/about' -> kaizenly/src/pages/about.astro.
function productSourceFile(route: string): string | null {
  const match = /^products\/(tsumly|kaizenly)(?:\/(.+))?$/.exec(route);
  if (!match) return null;
  return `../../${match[1]}/src/pages/${match[2] ?? 'index'}.astro`;
}

// Source entry file of a merged concept site, relative to this file:
// 'concepts/tally-bar' -> concepts-src/tally-bar/index.html.
function conceptSourceFile(route: string): string | null {
  const match = /^concepts\/(.+)$/.exec(route);
  if (!match) return null;
  return `../../concepts-src/${match[1]}/index.html`;
}

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, ''); // '' — the site lives at the root, so BASE_URL is '/'
  const entries = Object.keys(pageFiles)
    .map((file) => ({ route: fileToRoute(file), lastmod: fileLastmod(file) }))
    .filter(
      (entry): entry is { route: string; lastmod: string } => entry.route !== null,
    )
    .concat(
      productRoutes.map((route) => ({
        route,
        lastmod: fileLastmod(productSourceFile(route)),
      })),
    )
    .concat(
      conceptRoutes.map((route) => ({
        route,
        lastmod: fileLastmod(conceptSourceFile(route)),
      })),
    )
    .sort((a, b) => (a.route < b.route ? -1 : a.route > b.route ? 1 : 0));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(({ route, lastmod }) => {
      // Trailing-slash form, matching what @astrojs/sitemap emitted.
      const path = route ? `${base}/${route}/` : `${base}/`;
      const url = new URL(path, site).toString();
      return `  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>`;
    })
    .join('\n')}\n</urlset>\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
