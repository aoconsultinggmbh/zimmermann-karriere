#!/usr/bin/env python3
"""Baut aus einem Projektordner eine einzelne, komplett eigenständige HTML-Vorschau
(Bilder, Schriften, Skripte und Stile eingebettet), die sich per Klick in Chrome öffnet."""
import base64, pathlib, re, sys, json, mimetypes
root = pathlib.Path(sys.argv[1]); out = pathlib.Path(sys.argv[2])
html = (root / 'index.html').read_text(encoding='utf-8')

def data_uri(p):
    p = root / p
    mt = mimetypes.guess_type(str(p))[0] or 'application/octet-stream'
    if p.suffix == '.woff2': mt = 'font/woff2'
    if p.suffix == '.webp': mt = 'image/webp'
    if p.suffix == '.svg': mt = 'image/svg+xml'
    return 'data:' + mt + ';base64,' + base64.b64encode(p.read_bytes()).decode()

# Stylesheets und Skripte einbetten
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: '<style>' + (root / m.group(1)).read_text(encoding='utf-8') + '</style>', html)
def skript(m):
    code = (root / m.group(1)).read_text(encoding='utf-8').replace('</script>', '<\\/script>')
    if m.group(2): code = "document.addEventListener('DOMContentLoaded',function(){\n" + code + "\n});"
    return '<script>' + code + '</script>'
html = re.sub(r'<script src="([^"]+)"( defer)?></script>', skript, html)
# Preloads raus (unter file:// und inline ohnehin unnötig)
html = re.sub(r'<link rel="preload"[^>]*>\n?', '', html)
# Schriften
html = re.sub(r'url\((fonts/[^)]+)\)', lambda m: 'url(' + data_uri(m.group(1)) + ')', html)
# Favicons
html = re.sub(r'href="(img/(?:favicon[^"]*|apple-touch-icon\.png))"', lambda m: 'href="' + data_uri(m.group(1)) + '"', html)
# Bildkarte für alle img/*.webp und *.png (JPG-Rückfall entfällt, Chrome kann WebP)
bilder = {}
for p in sorted((root / 'img').iterdir()):
    if p.suffix in ('.webp', '.png', '.svg'):
        bilder['img/' + p.name] = data_uri('img/' + p.name)
# Statische <picture>: source entfernen, img auf webp zeigen lassen
html = re.sub(r'<source srcset="(img/[^"]+\.webp)" type="image/webp">\s*<img src="img/[^"]+\.jpg"', lambda m: '<img src="' + m.group(1) + '"', html)
# alle statischen img/ Verweise ersetzen
html = re.sub(r'(src|href)="(img/[^"]+)"', lambda m: m.group(1) + '="' + bilder.get(m.group(2), m.group(2)) + '"', html)
# dynamisch erzeugte Bilder (Galerie, Stellen) über eine Karte nachziehen
js = '''<script>
(function(){var K=%s;function fix(root){(root.querySelectorAll?root:document).querySelectorAll('img[src^="img/"],source[srcset^="img/"],a[href^="img/"]').forEach(function(e){var a=e.tagName==='SOURCE'?'srcset':(e.tagName==='A'?'href':'src');var v=e.getAttribute(a).replace(/\\.jpg$/,'.webp');if(K[v])e.setAttribute(a,K[v]);});}
fix(document);new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)fix(n);});});}).observe(document.documentElement,{childList:true,subtree:true});})();
</script>''' % json.dumps(bilder)
html = html.replace('</head>', js + '\n</head>')
out.write_text(html, encoding='utf-8')
print(out, round(out.stat().st_size / 1e6, 1), 'MB')
