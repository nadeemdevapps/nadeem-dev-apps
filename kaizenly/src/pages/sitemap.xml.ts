// Build-time sitemap endpoint: /sitemap.xml
//
// The hand-built plain sitemap crawlers and tools expect at the
// conventional URL, generated at build time from the actual page files
// in src/pages, so it can never go stale: add or remove a page and the
// next build picks it up automatically. This is the only sitemap the
// site emits — the @astrojs/sitemap integration was removed, so no
// sitemap-index.xml / sitemap-0.xml is generated.
import type { APIRoute } from 'astro';
import fs from 'node:fs';

// Lazy glob: we only need the file paths (the keys), never the modules.
const pageFiles = import.meta.glob('./**/*.astro');

function fileToRoute(file: string): string | null {
  // file looks like './index.astro' or './privacy.astro'
  let route = file.replace(/^\.\//, '').replace(/\.astro$/, '');
  if (route === '404') return null; // error page: never in a sitemap
  if (route === 'index') route = ''; // home page: the bare folder URL
  if (route.endsWith('/index')) route = route.slice(0, -'/index'.length);
  return route; // '' for the home page, otherwise e.g. 'privacy'
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Modification time of a source file in the repo, as an ISO date
// (YYYY-MM-DD). Falls back to the build date when the file cannot be
// read.
function fileLastmod(file: string): string {
  try {
    return isoDate(fs.statSync(new URL(file, import.meta.url)).mtime);
  } catch {
    return isoDate(new Date());
  }
}

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // '/nadeem-dev-apps/products/kaizenly'
  const entries = Object.keys(pageFiles)
    .map((file) => ({ route: fileToRoute(file), lastmod: fileLastmod(file) }))
    .filter(
      (entry): entry is { route: string; lastmod: string } => entry.route !== null,
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
