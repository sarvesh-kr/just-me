#!/usr/bin/env python3
"""Refresh the application script CSP hash and integrity after JavaScript edits."""
from pathlib import Path
import base64
import hashlib
import re
root = Path(__file__).resolve().parents[1]
page = root / 'index.html'
html = page.read_text(encoding='utf-8')
def digest(content):
    return 'sha256-' + base64.b64encode(hashlib.sha256(content).digest()).decode('ascii')
app_hash = digest((root / 'app.js').read_bytes())
directive = "script-src '" + app_hash + "';"
html, count = re.subn(r"script-src\s[^;]+;", lambda _: directive, html, count=1)
if count != 1:
    raise SystemExit('Expected one script-src directive.')
html, count = re.subn(r'<script src="app\.js"[^>]*></script>', '<script src="app.js" integrity="' + app_hash + '" defer></script>', html, count=1)
if count != 1:
    raise SystemExit('Expected one app.js reference.')
page.write_text(html, encoding='utf-8')
print('Updated script integrity and CSP hashes.')
