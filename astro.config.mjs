import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://catherinemonmarson.com',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      /* French sits at the root with no prefix, which the integration's i18n
         option cannot express; the per-page <link rel="alternate" hreflang>
         tags in Base.astro carry that signal instead. */
      filter: (page) =>
        !/\/(404|merci|thank-you)\/?$/.test(new URL(page).pathname),
    }),
  ],
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
});
