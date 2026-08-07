#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build-seo.py — generuje robots.txt, sitemap.xml a dopĺňa SEO značky do HTML.

ADRESA WEBU JE NA JEDNOM MIESTE (BASE_URL nižšie).
Pri prechode na vlastnú doménu stačí zmeniť jeden riadok a skript spustiť znova:
    python3 scripts/build-seo.py

Skript je opakovane spustiteľný — existujúce značky prepíše, nezdvojuje ich.
Do HTML NEZASAHUJE inak než do hlavičky <head>; obsah stránok ani skripty nemení.
"""

import os
import re
import json
import subprocess
from datetime import date

# ============================================================
#  JEDINÉ MIESTO S ADRESOU WEBU
# ============================================================
BASE_URL = "https://den-zachrany.vercel.app"
# ============================================================

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)

OG_IMAGE = "assets/og-image.png"
TODAY = date.today().isoformat()

# stránky: súbor -> (priorita, frekvencia, indexovať?)
PAGES = {
    "index.html":    ("1.0", "weekly",  True),
    "kapitoly.html": ("0.9", "weekly",  True),
    "piesne.html":   ("0.9", "weekly",  True),
    "podpora.html":  ("0.5", "monthly", True),
    "kapitola.html": ("0.8", "monthly", True),
    "piesen.html":   ("0.7", "monthly", True),
    # pocuvaj.html zámerne neindexujeme — duplikuje texty z piesen.html
    "pocuvaj.html":  (None,  None,      False),
}


def nacitaj_data():
    """Vytiahne zoznam dostupných kapitol a piesní priamo z dátových súborov."""
    js = """
      const fs=require('fs');
      const a={},b={};
      new Function('e', fs.readFileSync(%s,'utf8')+';e.c=chapterData')(a);
      new Function('e', fs.readFileSync(%s,'utf8')+';e.s=songData;e.l=songList')(b);
      const kapitoly=Object.entries(a.c).filter(([i,c])=>c.available)
          .map(([i,c])=>({id:i, title:c.title, desc:c.shortDescription||c.subtitle||''}));
      const piesne=b.l.map(x=>({id:String(x.id), title:(b.s[String(x.id)]||{}).title||'',
          desc:(b.s[String(x.id)]||{}).subtitle||''}));
      console.log(JSON.stringify({kapitoly, piesne}));
    """ % (json.dumps(P('js/data.js')), json.dumps(P('js/data-songs.js')))
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


# ------------------------------------------------------------
#  robots.txt
# ------------------------------------------------------------
def robots():
    obsah = (
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        "# Duplicitný obsah — texty piesní sú aj na piesen.html\n"
        "Disallow: /pocuvaj.html\n"
        "\n"
        f"Sitemap: {BASE_URL}/sitemap.xml\n"
    )
    with open(P('robots.txt'), 'w', encoding='utf-8') as f:
        f.write(obsah)
    return "robots.txt"


# ------------------------------------------------------------
#  sitemap.xml
# ------------------------------------------------------------
def sitemap(data):
    riadky = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    def url(loc, prio, freq):
        riadky.extend([
            '  <url>',
            f'    <loc>{loc}</loc>',
            f'    <lastmod>{TODAY}</lastmod>',
            f'    <changefreq>{freq}</changefreq>',
            f'    <priority>{prio}</priority>',
            '  </url>',
        ])

    url(BASE_URL + '/', '1.0', 'weekly')
    for f in ('kapitoly.html', 'piesne.html', 'podpora.html'):
        prio, freq, idx = PAGES[f]
        url(f'{BASE_URL}/{f}', prio, freq)
    for k in data['kapitoly']:
        url(f'{BASE_URL}/kapitola.html?id={k["id"]}', '0.8', 'monthly')
    for s in data['piesne']:
        url(f'{BASE_URL}/piesen.html?id={s["id"]}', '0.7', 'monthly')

    riadky.append('</urlset>')
    with open(P('sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(riadky) + '\n')
    return f"sitemap.xml ({len(data['kapitoly'])} kapitol + {len(data['piesne'])} piesní)"


# ------------------------------------------------------------
#  SEO značky v <head>
# ------------------------------------------------------------
ZNACKY = ('<link rel="canonical"', '<meta property="og:', '<meta name="twitter:',
          '<meta name="robots"')


def vycisti_hlavicku(html):
    """Odstráni značky, ktoré skript spravuje, aby sa pri opakovaní nezdvojovali."""
    riadky = html.split('\n')
    return '\n'.join(r for r in riadky if not any(z in r for z in ZNACKY))


def doplň(subor, data):
    cesta = P(subor)
    html = open(cesta, encoding='utf-8').read()
    povodne = html
    html = vycisti_hlavicku(html)

    prio, freq, indexovat = PAGES[subor]
    loc = BASE_URL + ('/' if subor == 'index.html' else '/' + subor)

    # titulok a popis preberáme z toho, čo na stránke už je
    m = re.search(r'<title>(.*?)</title>', html, re.S)
    title = m.group(1).strip() if m else 'Deň Záchrany'
    m = re.search(r'<meta name="description" content="(.*?)"', html, re.S)
    desc = m.group(1).strip() if m else 'Biblická pomoc pre ťažké chvíle.'

    bloky = []
    if indexovat:
        bloky.append(f'    <link rel="canonical" href="{loc}">')
    else:
        bloky.append('    <meta name="robots" content="noindex, follow">')

    bloky += [
        f'    <meta property="og:type" content="website">',
        f'    <meta property="og:site_name" content="Deň Záchrany">',
        f'    <meta property="og:locale" content="sk_SK">',
        f'    <meta property="og:url" content="{loc}">',
        f'    <meta property="og:title" content="{title}">',
        f'    <meta property="og:description" content="{desc}">',
        f'    <meta property="og:image" content="{BASE_URL}/{OG_IMAGE}">',
        f'    <meta property="og:image:width" content="1200">',
        f'    <meta property="og:image:height" content="630">',
        f'    <meta name="twitter:card" content="summary_large_image">',
        f'    <meta name="twitter:title" content="{title}">',
        f'    <meta name="twitter:description" content="{desc}">',
        f'    <meta name="twitter:image" content="{BASE_URL}/{OG_IMAGE}">',
    ]

    # vložíme hneď za <title>
    html = re.sub(r'(</title>)', r'\1\n' + '\n'.join(bloky), html, count=1)
    # upraceme prípadné prázdne riadky po čistení
    html = re.sub(r'\n{3,}', '\n\n', html)

    if html != povodne:
        with open(cesta, 'w', encoding='utf-8') as f:
            f.write(html)
    return subor


def main():
    print(f"BASE_URL = {BASE_URL}\n")
    data = nacitaj_data()
    print("  ✓ " + robots())
    print("  ✓ " + sitemap(data))
    for subor in PAGES:
        stav = "noindex" if not PAGES[subor][2] else "canonical + og"
        print(f"  ✓ {doplň(subor, data):16} ({stav})")
    print("\nHotovo. Pri zmene domény uprav BASE_URL a spusti znova.")


if __name__ == '__main__':
    main()
