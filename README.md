# Sarvesh — Personal portfolio

Live: https://sarvesh-kr.github.io/just-me/

A static, responsive portfolio with a layered portrait, light and dark themes, a workflow demo, an accessible skills explorer, and reduced-motion support. GitHub Pages builds the URL templates automatically. The browser has no runtime library dependencies.

## Edit and deploy

Edit `index.html`, `style.css`, or `app.js`. After editing `app.js`, run `python3 scripts/refresh-integrity.py` to refresh the application CSP hash and integrity. GitHub Pages publishes `main` from `/ (root)` with HTTPS enforced, using its built-in Jekyll build. Keep `_config.yml` and `_includes/site-url.html`; do not add `.nojekyll`, which would disable URL generation.

Canonical URLs, share-image URLs, structured profile data, sitemap, robots directive, and the 404 return link resolve from GitHub Pages’ domain metadata at build time. Setting or removing a custom domain through **Settings → Pages** (with its `CNAME` file) updates them on the next build. A repository rename is picked up on its next Pages build. Assets and the embed card’s portfolio navigation use relative paths.

For another hosting provider, set the full public URL including any subdirectory once in `_config.yml` under `site_url`, and deploy the Jekyll output. Leave `site_url` empty on GitHub Pages so its domain metadata remains authoritative. DNS setup, domain verification and TLS issuance are handled separately by the hosting provider.

Contact: **sarvesh.official@icloud.com**. The phone number, original résumé, and deployment credentials are excluded.

## Security and privacy

The pages use restrictive Content Security Policy and referrer policy metadata. Scripts, styles, fonts, and images are served locally; the main page authorizes only the integrity-checked application script. JSON-LD is a non-executable data block generated during the build, so changing the domain does not weaken the script policy. The policy blocks external connections, embedded child frames, plugin objects, base-URL changes, and form submissions. No inline event handlers, eval, trackers, API calls, forms, cookies, or visitor information are collected. Browser storage contains only theme and motion preferences. New-tab links use `noopener noreferrer`.

GitHub Pages does not support arbitrary response-header configuration. Meta CSP cannot enforce `frame-ancestors`; HSTS, `X-Content-Type-Options`, Permissions Policy, and other HTTP headers are controlled by the host. No `_headers` file is claimed to configure GitHub Pages. This public portfolio is deliberately embeddable. Rehosting behind a configurable proxy would allow additional response policies.

## Search and sharing

The page includes a canonical URL, descriptive metadata, ProfilePage/Person/WebSite JSON-LD, a 1200 × 630 Open Graph and Twitter share image, and `sitemap.xml`. It remains readable without JavaScript. The embed card and 404 page use `noindex`.

Submit https://sarvesh-kr.github.io/just-me/sitemap.xml in Google Search Console for the verified property. Search engine verification requires the account owner; indexing, ranking, and social-preview refresh timing cannot be guaranteed. Google’s Rich Results Test may not offer a rich result for every valid schema type.

A portable `robots.txt` is included. Crawlers normally read robots.txt at the host root (`https://sarvesh-kr.github.io/robots.txt`), so the file under `/just-me/` is not a host-wide crawler policy. The HTML robots directives apply to this portfolio.

## Embed the profile card

Replace the example iframe address with your public site address when embedding elsewhere. Existing snippets on third-party websites cannot be rewritten automatically by this repository; a domain change should keep redirects if old embeds need to continue working. The card’s own portfolio link automatically follows its hosting location.

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
