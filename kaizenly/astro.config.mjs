// @ts-check
import { defineConfig } from 'astro/config';

// Kaizenly's independent site. It builds on its own; the root build merges
// its dist into the main site's dist under /products/kaizenly/ via
// scripts/merge-kaizenly.mjs (see README.md). The site is served at the
// root of nadeem-dev-apps.pages.dev, so the base is the product subpath
// under '/'. If this folder is ever extracted to its own repo, change
// `site` to the new domain and remove `base`.
// No sitemap integration: the hand-built src/pages/sitemap.xml.ts is
// the only sitemap (see its header comment).
export default defineConfig({
  site: 'https://nadeem-dev-apps.pages.dev/',
  base: '/products/kaizenly',
});
