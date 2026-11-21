// @ts-check
import { defineConfig } from 'astro/config';

// The site lives on Cloudflare Pages at the root: base is always '/'
// and the site URL is the pages.dev URL. No env vars — when the custom
// domain nadeemdevapps.com is attached, change `site` to it.
// No sitemap integration: the hand-built src/pages/sitemap.xml.ts is
// the only sitemap (see its header comment).
export default defineConfig({
  site: 'https://nadeem-dev-apps.pages.dev/',
  base: '/',
});
