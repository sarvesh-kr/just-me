# Sarvesh — Personal portfolio

Live: https://sarvesh-kr.github.io/just-me/

A static, responsive portfolio with a layered portrait, light and dark themes, a workflow demo, an accessible skills explorer, and reduced-motion support. No build step or runtime dependencies are required.

## Edit and deploy

Edit `index.html`, `style.css`, or `app.js`. After editing `app.js` or the inline JSON-LD block, run `python3 scripts/refresh-integrity.py` before publishing to refresh the Content Security Policy hashes and script integrity. GitHub Pages publishes `main` from `/ (root)` with HTTPS enforced. Keep `.nojekyll`. Update canonical URLs, structured data, Open Graph metadata, embed links, and the sitemap together if the public domain changes.

Contact: **sarvesh.official@icloud.com**. The phone number, original résumé, and deployment credentials are excluded.

## Security and privacy

The pages use restrictive Content Security Policy and referrer policy metadata. Scripts, styles, fonts, and images are served locally; the main page permits only the integrity-checked application script and the exact hashed structured-data block. The policy blocks external connections, embedded child frames, plugin objects, base-URL changes, and form submissions. No inline event handlers, eval, trackers, API calls, forms, cookies, or visitor information are collected. Browser storage contains only theme and motion preferences. New-tab links use `noopener noreferrer`.

GitHub Pages does not support arbitrary response-header configuration. Meta CSP cannot enforce `frame-ancestors`; HSTS, `X-Content-Type-Options`, Permissions Policy, and other HTTP headers are controlled by the host. No `_headers` file is claimed to configure GitHub Pages. This public portfolio is deliberately embeddable. Rehosting behind a configurable proxy would allow additional response policies.

## Search and sharing

The page includes a canonical URL, descriptive metadata, ProfilePage/Person/WebSite JSON-LD, a 1200 × 630 Open Graph and Twitter share image, and `sitemap.xml`. It remains readable without JavaScript. The embed card and 404 page use `noindex`.

Submit https://sarvesh-kr.github.io/just-me/sitemap.xml in Google Search Console for the verified property. Search engine verification requires the account owner; indexing, ranking, and social-preview refresh timing cannot be guaranteed. Google’s Rich Results Test may not offer a rich result for every valid schema type.

A portable `robots.txt` is included. Crawlers normally read robots.txt at the host root (`https://sarvesh-kr.github.io/robots.txt`), so the file under `/just-me/` is not a host-wide crawler policy. The HTML robots directives apply to this portfolio.

## Embed the profile card

The script-free card works without tracking, clipboard permissions, or parent-window messaging. Its portfolio link opens a new tab.

```html
<iframe
  src="https://sarvesh-kr.github.io/just-me/embed.html"
  title="Sarvesh — Software, Automation & AI"
  width="100%"
  height="480"
  loading="lazy"
  referrerpolicy="no-referrer"
  sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
  style="max-width:800px;border:0;display:block;"
></iframe>
```

For the complete scrolling portfolio, use the main site URL with a descriptive title and a taller iframe. If a sandbox is used, the interactive full site needs `allow-scripts`; the profile card above does not. Only embed URLs you trust. Framing can be limited by the parent website’s own CSP or embedding platform.

## Assets and licenses

Fonts are self-hosted variable Latin subsets of DM Sans and Manrope; their SIL Open Font Licenses are in `assets/fonts/`. `assets/sarvesh-portrait.webp` preserves portrait transparency and is encoded for quick delivery. `assets/social-preview-v2.png` is a rendered share card. Keep fonts’ license files when redistributing them.
