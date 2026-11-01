import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import toConfirm from './data/to-confirm.json' with { type: 'json' };

/* The public address lives in data/to-confirm.json so the canonical links,
   hreflang tags, sitemap, social cards and robots.txt cannot drift apart. */
export default defineConfig({
  site: toConfirm.site.url,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      /* French sits at the root with no prefix, which the integration's i18n
         option cannot express; the per-page <link rel="alternate" hreflang>
         tags in Base.astro carry that signal instead. */
      filter: (page) => !/\/(404|merci|thank-you)\/?$/.test(new URL(page).pathname),
    }),
  ],
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
});
