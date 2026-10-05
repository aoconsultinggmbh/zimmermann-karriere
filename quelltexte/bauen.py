#!/usr/bin/env python3
"""Baut index.html aus src/: Stil, Skript und Datenschutztext werden inline eingesetzt."""
import pathlib, re
S = pathlib.Path(__file__).parent
R = S.parent / 'website'   # Projektaufbau: quelltexte/ neben website/
html = (S / 'seite.html').read_text(encoding='utf-8')
html = html.replace('/*__STIL__*/', (S / 'stil.css').read_text(encoding='utf-8'))
html = html.replace('/*__SKRIPT__*/', (S / 'skript.js').read_text(encoding='utf-8'))
html = html.replace('<!--__DATENSCHUTZ__-->', (S / 'datenschutz.html').read_text(encoding='utf-8'))
(R / 'index.html').write_text(html, encoding='utf-8')

# Favicon: Zahn-Umriss in der CI-Farbe
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#EAE6DF"/><path d="M22 10c-6 0-10 5-10 12 0 9 5 12 6 24 .4 5 3 8 5 8s3-4 4-10c1-6 3-8 5-8s4 2 5 8c1 6 2 10 4 10s4.6-3 5-8c1-12 6-15 6-24 0-7-4-12-10-12-4 0-6 2-10 2s-6-2-10-2z" fill="none" stroke="#2A333F" stroke-width="3.2" stroke-linejoin="round"/></svg>'''
(R / 'img' / 'favicon.svg').write_text(svg, encoding='utf-8')

# Sitemap und robots
sitemap = '''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://karriere.zahnaerzte-edenkoben.de/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://karriere.zahnaerzte-edenkoben.de/#/stellen</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://karriere.zahnaerzte-edenkoben.de/#/impressum</loc><changefreq>yearly</changefreq><priority>0.2</priority></url>
  <url><loc>https://karriere.zahnaerzte-edenkoben.de/#/datenschutz</loc><changefreq>yearly</changefreq><priority>0.2</priority></url>
  <url><loc>https://karriere.zahnaerzte-edenkoben.de/#/gleichstellung</loc><changefreq>yearly</changefreq><priority>0.2</priority></url>
</urlset>
'''
(R / 'sitemap.xml').write_text(sitemap, encoding='utf-8')
(R / 'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: https://karriere.zahnaerzte-edenkoben.de/sitemap.xml\n', encoding='utf-8')
print('index.html', len(html), 'Zeichen')
