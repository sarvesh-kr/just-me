#!/usr/bin/env python3
"""Refresh script integrity and content-based asset URLs before publishing."""

import base64
import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE_ASSETS = {
    "index.html": ("app.js", "style.css"),
    "embed.html": ("embed.css",),
    "404.html": ("style.css", "404.css"),
}
pages = {name: (ROOT / name).read_text(encoding="utf-8") for name in PAGE_ASSETS}
digests = {
    name: hashlib.sha256((ROOT / name).read_bytes())
    for assets in PAGE_ASSETS.values()
    for name in assets
}
app_hash = "sha256-" + base64.b64encode(digests["app.js"].digest()).decode("ascii")


def replace_once(pattern, replacement, html, label):
    updated, count = re.subn(pattern, replacement, html)
    if count != 1:
        raise SystemExit(f"Expected one {label}; found {count}.")
    return updated


def update_script(match):
    tag = match.group(0)
    return replace_once(
        r'\bintegrity="[^"]*"',
        lambda _: f'integrity="{app_hash}"',
        tag,
        "application integrity attribute",
    )


pages["index.html"] = replace_once(
    r"script-src\s[^;]+;",
    lambda _: f"script-src '{app_hash}';",
    pages["index.html"],
    "script-src directive",
)
pages["index.html"] = replace_once(
    r'<script\s+[^>]*\bsrc="app\.js(?:\?v=[a-f0-9]+)?"[^>]*></script>',
    update_script,
    pages["index.html"],
    "application script reference",
)

for page, assets in PAGE_ASSETS.items():
    for asset in assets:
        version = digests[asset].hexdigest()[:12]
        pages[page] = replace_once(
            r"(?<![\w/-])" + re.escape(asset) + r"(?:\?v=[a-f0-9]+)?(?=[\"'])",
            lambda _, asset=asset, version=version: f"{asset}?v={version}",
            pages[page],
            f"{asset} reference in {page}",
        )

# Validate every replacement before writing any page.
for page, html in pages.items():
    (ROOT / page).write_text(html, encoding="utf-8")

print("Updated script integrity, CSP, and versioned asset URLs.")
