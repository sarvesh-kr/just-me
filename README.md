# Sarvesh — Personal portfolio

Live: https://sarvesh.si/

A static, responsive portfolio with a layered portrait, light and dark themes, a workflow demo, an accessible skills explorer, and reduced-motion support. GitHub Pages builds the URL templates automatically. The browser has no runtime library dependencies.

## Edit and deploy

Edit `index.html`, `style.css`, or `app.js`. The SEO title and description have one source in `_config.yml`. After editing `app.js`, `style.css`, `embed.css`, or `404.css`, run `python3 scripts/refresh-integrity.py` to refresh script integrity, the CSP hash, and content-based asset URL versions. This prevents returning visitors from using cached files from an older deployment. GitHub Pages publishes `main` from `/ (root)` with HTTPS enforced, using its built-in Jekyll build. Keep `_config.yml` and `_includes/site-url.html`; do not add `.nojekyll`, which would disable URL generation.

Canonical URLs, share-image URLs, structured profile data, sitemap, robots directive, and the 404 return link resolve from GitHub Pages’ domain metadata at build time. Setting or removing a custom domain through **Settings → Pages** (with its `CNAME` file) updates them on the next build. A repository rename is picked up on its next Pages build. Assets and the embed card’s portfolio navigation use relative paths.

When updating the page content, update `last_modified_at` in `_config.yml`. Structured data and the sitemap share this timestamp, so a deployment retry does not incorrectly mark the content as newly modified.

For another hosting provider, set the full public URL including any subdirectory once in `_config.yml` under `site_url`, and deploy the Jekyll output. Leave `site_url` empty on GitHub Pages so its domain metadata remains authoritative. DNS setup, domain verification and TLS issuance are handled separately by the hosting provider.

Contact: **pingme@sarvesh.si**. The phone number, original résumé, and deployment credentials are excluded.

## Custom domain

`CNAME` sets the public domain to `sarvesh.si`. Keep `site_url` empty so GitHub Pages remains the source for generated URLs. At the DNS provider, point the apex (`@`) to all four GitHub Pages IPv4 addresses: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. To support `www`, add a CNAME from `www` to `sarvesh-kr.github.io` (without a repository path). Preserve unrelated email and verification records. Once DNS resolves and GitHub provisions its certificate, enable **Settings → Pages → Enforce HTTPS**. See [GitHub’s custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Security and privacy

The pages use restrictive Content Security Policy and referrer policy metadata. Scripts, styles, fonts, and images are served locally; the main page authorizes only the integrity-checked application script. JSON-LD is a non-executable data block generated during the build, so changing the domain does not weaken the script policy. The policy blocks external connections, embedded child frames, plugin objects, base-URL changes, and form submissions. No inline event handlers, eval, trackers, API calls, forms, cookies, or visitor information are collected. Browser storage contains only theme and motion preferences. New-tab links use `noopener noreferrer`.

GitHub Pages does not support arbitrary response-header configuration. Meta CSP cannot enforce `frame-ancestors`; HSTS, `X-Content-Type-Options`, Permissions Policy, and other HTTP headers are controlled by the host. No `_headers` file is claimed to configure GitHub Pages. This public portfolio is deliberately embeddable. Rehosting behind a configurable proxy would allow additional response policies.

## Search and sharing

The page includes a canonical URL, descriptive metadata, ProfilePage/Person/WebSite JSON-LD, a 1200 × 630 Open Graph and Twitter share image, and `sitemap.xml`. The active share-image path is set once in `_config.yml` under `social_image`; its public URL follows the current hosting domain. Content and navigation remain available with JavaScript disabled or the application script blocked; interactive controls appear after initialization. The embed card and 404 page use `noindex`.

WhatsApp and X link previews read the main page's metadata; they do not render `embed.html` or use its CSS. Share the complete HTTPS portfolio URL. The page requests a large-image card, but each app controls the final size, crop, cache lifetime and whether previews are enabled. No site-side change can force a particular WhatsApp Status layout.

If an old preview remains, paste the URL into a new draft and allow time for the preview to load. A fresh query parameter can help test a new request, but does not guarantee that an app will bypass its canonical-URL cache. On WhatsApp, check **Settings → Privacy → Advanced → Disable link previews**; previews require this setting to be off. See [WhatsApp's instructions](https://faq.whatsapp.com/445453537819972/?cms_platform=iphone). Meta's [Sharing Debugger](https://developers.facebook.com/tools/debug/) can inspect and refresh Meta's scrape of the page; it does not guarantee an immediate change in every app.

Printing reveals every expertise panel and all sections, including content not yet scrolled into view. The favicon has SVG and PNG versions for browser compatibility.

Submit https://sarvesh.si/sitemap.xml in Google Search Console for the verified property. Search engine verification requires the account owner; indexing, ranking, and social-preview refresh timing cannot be guaranteed. Google’s Rich Results Test may not offer a rich result for every valid schema type.

The custom domain serves `robots.txt` at `https://sarvesh.si/robots.txt`, the host-root location crawlers use. Its sitemap URL follows the configured domain automatically. The HTML robots directives also apply to this portfolio.

## Embed the profile card

Replace the example iframe address with your public site address when embedding elsewhere. Existing snippets on third-party websites cannot be rewritten automatically by this repository; a domain change should keep redirects if old embeds need to continue working. The card’s own portfolio link automatically follows its hosting location.

The script-free card works without tracking, clipboard permissions, or parent-window messaging. Its portfolio link opens a new tab.

```html
<iframe
  src="https://sarvesh.si/embed.html"
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

Fonts are self-hosted variable Latin subsets of DM Sans and Manrope; their SIL Open Font Licenses are in `assets/fonts/`. `assets/sarvesh-portrait.webp` preserves portrait transparency and is encoded for quick delivery. `assets/social-preview-v3.jpg` is the current rendered share card. Keep `assets/social-preview.png` and `assets/social-preview-v2.png`: both serve the current artwork at earlier image URLs so cached link metadata does not lead to missing images. Keep fonts’ license files when redistributing them.
