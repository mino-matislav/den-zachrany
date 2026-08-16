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
# overenie vlastníctva pre Google Search Console (meta značka namiesto DNS záznamu)
GOOGLE_VERIFY = "3N05ANbUrWnYXB3a4BwzYJgYbqMNdWKyaaT7xJJVpEw"
YOUTUBE = "https://www.youtube.com/@OdtemnotykuSvetlu"
TODAY = date.today().isoformat()

# stránky: súbor -> (priorita, frekvencia, indexovať?)
PAGES = {
    "index.html":    ("1.0", "weekly",  True),
    "kapitoly.html": ("0.9", "weekly",  True),
    "piesne.html":   ("0.9", "weekly",  True),
    "podpora.html":  ("0.5", "monthly", True),
    "kapitola.html": (None,  None,      False),
    "piesen.html":   (None,  None,      False),
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
          .map(([i,c])=>({id:i, title:c.title, subtitle:c.subtitle||'',
              desc:c.shortDescription||c.subtitle||'', tags:c.tags||[],
              fullText:c.fullText||'', prayer:c.prayer||''}));
      const piesne=b.l.map(x=>{const sg=b.s[String(x.id)]||{};
          return {id:String(x.id), title:sg.title||'', desc:sg.subtitle||'',
              lyrics:(sg.lyrics||[]).map(sec=>sec.lines||[])};});
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
        url(f'{BASE_URL}/kapitola-{k["id"]}.html', '0.8', 'monthly')
    for s in data['piesne']:
        url(f'{BASE_URL}/piesen-{s["id"]}.html', '0.7', 'monthly')

    riadky.append('</urlset>')
    with open(P('sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(riadky) + '\n')
    return f"sitemap.xml ({len(data['kapitoly'])} kapitol + {len(data['piesne'])} piesní)"


# ------------------------------------------------------------
#  SEO značky v <head>
# ------------------------------------------------------------
ZNACKY = ('<link rel="canonical"', '<meta property="og:', '<meta name="twitter:',
          '<meta name="robots"', '<meta name="google-site-verification"')


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

    bloky = [f'    <meta name="google-site-verification" content="{GOOGLE_VERIFY}">']
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


# ------------------------------------------------------------
#  Predgenerovanie obsahu do HTML
#  Roboty a AI nespúšťajú skripty — bez tohto vidia len
#  "Načítavajú sa kapitoly...". Skripty ten istý obsah pri
#  načítaní prepíšu, používateľ zmenu nezbadá.
# ------------------------------------------------------------
def esc(t):
    return (str(t).replace('&', '&amp;').replace('<', '&lt;')
            .replace('>', '&gt;').replace('"', '&quot;'))


def nahrad_blok(html, zaciatok_znacky, novy_obsah):
    """Nahradí vnútro prvého elementu, ktorý začína danou značkou."""
    i = html.find(zaciatok_znacky)
    if i == -1:
        return html, False
    otvor = html.index('>', i) + 1
    # nájdeme zodpovedajúci uzatvárací tag
    tag = zaciatok_znacky[1:zaciatok_znacky.index(' ')] if ' ' in zaciatok_znacky else zaciatok_znacky[1:]
    hlbka, j = 1, otvor
    while j < len(html) and hlbka > 0:
        n_otv = html.find('<' + tag, j)
        n_zat = html.find('</' + tag + '>', j)
        if n_zat == -1:
            return html, False
        if n_otv != -1 and n_otv < n_zat:
            hlbka += 1; j = n_otv + 1
        else:
            hlbka -= 1
            if hlbka == 0:
                return html[:otvor] + novy_obsah + html[n_zat:], True
            j = n_zat + 1
    return html, False


def odseky(text):
    """Text s prázdnymi riadkami -> odseky; riadky v úvodzovkách -> verš."""
    out = []
    for o in [x.strip() for x in text.split('\n\n') if x.strip()]:
        if o.startswith('"') and o.endswith('"'):
            out.append('<blockquote class="chapter-verse">' + esc(o.strip('"')) + '</blockquote>')
        else:
            out.append('<p>' + esc(o) + '</p>')
    return '\n                    '.join(out)


def predgeneruj(data):
    sprava = []

    # --- zoznam kapitol ---
    html = open(P('kapitoly.html'), encoding='utf-8').read()
    polozky = []
    for k in data['kapitoly']:
        polozky.append(
            '<article class="chapter-item" data-id="%s" role="listitem">'
            '<div class="chapter-number">%s. Kapitola</div>'
            '<h3 class="chapter-title"><a href="kapitola.html?id=%s" class="card-link">%s</a></h3>'
            '<p class="chapter-desc">%s</p></article>'
            % (k['id'], k['id'], k['id'], esc(k['title']), esc(k['desc'])))
    html, ok = nahrad_blok(html, '<div class="chapters-list"', '\n                    ' +
                           '\n                    '.join(polozky) + '\n                ')
    if ok:
        open(P('kapitoly.html'), 'w', encoding='utf-8').write(html)
        sprava.append('kapitoly.html   — predgenerovaných %d kapitol' % len(polozky))

    # --- zoznam piesní ---
    html = open(P('piesne.html'), encoding='utf-8').read()
    polozky = []
    for s in data['piesne']:
        polozky.append(
            '<article class="chapter-item" data-id="%s" role="listitem">'
            '<div class="chapter-number">%s</div>'
            '<h3 class="chapter-title"><a href="piesen.html?id=%s" class="card-link">%s</a></h3>'
            '<p class="chapter-desc">%s</p></article>'
            % (s['id'], s['id'], s['id'], esc(s['title']), esc(s['desc'])))
    html, ok = nahrad_blok(html, '<div class="songs-list chapters-list"', '\n                    ' +
                           '\n                    '.join(polozky) + '\n                ')
    if ok:
        open(P('piesne.html'), 'w', encoding='utf-8').write(html)
        sprava.append('piesne.html     — predgenerovaných %d piesní' % len(polozky))

    # --- ukážka prvej kapitoly ---
    k = data['kapitoly'][0]
    html = open(P('kapitola.html'), encoding='utf-8').read()
    html = html.replace('<h1 class="chapter-heading">Načítava sa...</h1>',
                        '<h1 class="chapter-heading">%s</h1>' % esc(k['title']))
    html = html.replace('<p class="chapter-subheading"></p>',
                        '<p class="chapter-subheading">%s</p>' % esc(k['subtitle']))
    html = html.replace('<div class="chapter-number-label"></div>',
                        '<div class="chapter-number-label">%s. Kapitola</div>' % k['id'])
    html, _ = nahrad_blok(html, '<div class="chapter-text"',
                          '\n                    ' + odseky(k['fullText']) + '\n                ')
    html, _ = nahrad_blok(html, '<div class="chapter-prayer-text"',
                          '\n                        ' + odseky(k['prayer']) + '\n                    ')
    open(P('kapitola.html'), 'w', encoding='utf-8').write(html)
    sprava.append('kapitola.html   — ukážka 1. kapitoly (text + modlitba)')

    # --- ukážka prvej piesne ---
    s0 = data['piesne'][0]
    html = open(P('piesen.html'), encoding='utf-8').read()
    html = html.replace('<h1 class="song-heading">Načítava sa...</h1>',
                        '<h1 class="song-heading">%s. %s</h1>' % (s0['id'], esc(s0['title'])))
    html = html.replace('<p class="song-subheading"></p>',
                        '<p class="song-subheading">%s</p>' % esc(s0['desc']))
    riadky = []
    for sekcia in s0['lyrics']:
        riadky.append('<div class="lyric-section"><p class="lyric-lines">' +
                      ''.join('<span class="lyric-line">%s</span>' % esc(r)
                              for r in sekcia if r) + '</p></div>')
    html, _ = nahrad_blok(html, '<div class="song-lyrics"',
                          '\n                    ' + '\n                    '.join(riadky) + '\n                ')
    open(P('piesen.html'), 'w', encoding='utf-8').write(html)
    sprava.append('piesen.html     — ukážka 1. piesne (text)')

    return sprava


# ------------------------------------------------------------
#  Samostatné stránky pre každú kapitolu a pieseň
#  Bez nich Google vidí 32 adries s rovnakým obsahom
#  (kapitola.html?id=1 aj ?id=12 servírujú to isté)
#  a považuje ich za duplicitné.
# ------------------------------------------------------------
def json_ld(html, data_dict):
    """Vloží štruktúrované údaje pred </head>. Staré najprv odstráni."""
    html = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', '', html, flags=re.S)
    blok = ('    <script type="application/ld+json">\n    '
            + json.dumps(data_dict, ensure_ascii=False, indent=2).replace('\n', '\n    ')
            + '\n    </script>\n')
    return html.replace('</head>', blok + '</head>', 1)


def suvisiace(k, vsetky, kolko=3):
    """Vyberie príbuzné kapitoly podľa počtu spoločných tém."""
    moje = set(k.get('tags') or [])
    skore = []
    for iny in vsetky:
        if iny['id'] == k['id']:
            continue
        spolocne = len(moje & set(iny.get('tags') or []))
        if spolocne:
            skore.append((spolocne, int(iny['id']), iny))
    skore.sort(key=lambda x: (-x[0], x[1]))
    return [x[2] for x in skore[:kolko]]


def statické_stránky(data):
    sprava = []

    def uprav_hlavicku(html, title, desc, loc, telo_atr):
        html = vycisti_hlavicku(html)
        html = re.sub(r'<title>.*?</title>', '<title>' + esc(title) + '</title>', html, count=1, flags=re.S)
        html = re.sub(r'<meta name="description" content=".*?"',
                      '<meta name="description" content="' + esc(desc) + '"', html, count=1, flags=re.S)
        bloky = [
            f'    <meta name="google-site-verification" content="{GOOGLE_VERIFY}">',
            f'    <link rel="canonical" href="{loc}">',
            f'    <meta property="og:type" content="article">',
            f'    <meta property="og:site_name" content="Deň Záchrany">',
            f'    <meta property="og:locale" content="sk_SK">',
            f'    <meta property="og:url" content="{loc}">',
            f'    <meta property="og:title" content="{esc(title)}">',
            f'    <meta property="og:description" content="{esc(desc)}">',
            f'    <meta property="og:image" content="{BASE_URL}/{OG_IMAGE}">',
            f'    <meta property="og:image:width" content="1200">',
            f'    <meta property="og:image:height" content="630">',
            f'    <meta name="twitter:card" content="summary_large_image">',
            f'    <meta name="twitter:title" content="{esc(title)}">',
            f'    <meta name="twitter:description" content="{esc(desc)}">',
            f'    <meta name="twitter:image" content="{BASE_URL}/{OG_IMAGE}">',
        ]
        html = re.sub(r'(</title>)', r'\1\n' + '\n'.join(bloky), html, count=1)
        html = re.sub(r'<body[^>]*>', '<body ' + telo_atr + '>', html, count=1)
        return re.sub(r'\n{3,}', '\n\n', html)

    # --- kapitoly ---
    sablona = open(P('kapitola.html'), encoding='utf-8').read()
    for k in data['kapitoly']:
        h = sablona
        h, _ = nahrad_blok(h, '<h1 class="chapter-heading"', esc(k['title']))
        h, _ = nahrad_blok(h, '<p class="chapter-subheading"', esc(k['subtitle']))
        h, _ = nahrad_blok(h, '<div class="chapter-number-label"', '%s. Kapitola' % k['id'])
        h, _ = nahrad_blok(h, '<div class="chapter-text"',
                           '\n                    ' + odseky(k['fullText']) + '\n                ')
        h, _ = nahrad_blok(h, '<div class="chapter-prayer-text"',
                           '\n                        ' + odseky(k['prayer']) + '\n                    ')
        h = uprav_hlavicku(h, '%s — Deň Záchrany' % k['title'], k['desc'],
                           '%s/kapitola-%s.html' % (BASE_URL, k['id']),
                           'data-chapter-id="%s"' % k['id'])
        # príbuzné kapitoly — pomáha čitateľovi aj prepojeniu stránok pre Google
        prib = suvisiace(k, data['kapitoly'])
        if prib:
            blok = ('\n                <nav class="related" aria-label="Súvisiace kapitoly">'
                    '\n                    <h2 class="related-title">Mohlo by ti pomôcť aj</h2>'
                    '\n                    <ul class="related-list">')
            for r in prib:
                blok += ('\n                        <li><a href="kapitola-%s.html">%s</a>'
                         '<span class="related-desc">%s</span></li>'
                         % (r['id'], esc(r['title']), esc(r['desc'])))
            blok += '\n                    </ul>\n                </nav>\n\n                '
            h = h.replace('                <!-- Navigácia späť -->', blok + '<!-- Navigácia späť -->', 1)
        h = json_ld(h, {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": k['title'],
            "description": k['desc'],
            "inLanguage": "sk",
            "url": '%s/kapitola-%s.html' % (BASE_URL, k['id']),
            "image": '%s/%s' % (BASE_URL, OG_IMAGE),
            "author":    {"@type": "Organization", "name": "Deň Záchrany"},
            "publisher": {"@type": "Organization", "name": "Deň Záchrany",
                          "logo": {"@type": "ImageObject", "url": '%s/assets/icon-512.png' % BASE_URL}},
            "isPartOf":  {"@type": "WebSite", "name": "Deň Záchrany", "url": BASE_URL + '/'},
            "isAccessibleForFree": True,
        })
        open(P('kapitola-%s.html' % k['id']), 'w', encoding='utf-8').write(h)
    sprava.append('kapitola-1..%s.html — %d samostatných stránok' % (data['kapitoly'][-1]['id'], len(data['kapitoly'])))

    # --- piesne ---
    sablona = open(P('piesen.html'), encoding='utf-8').read()
    for sg in data['piesne']:
        h = sablona
        h, _ = nahrad_blok(h, '<h1 class="song-heading"', '%s. %s' % (sg['id'], esc(sg['title'])))
        h, _ = nahrad_blok(h, '<p class="song-subheading"', esc(sg['desc']))
        riadky = []
        for sekcia in sg['lyrics']:
            riadky.append('<div class="lyric-section"><p class="lyric-lines">' +
                          ''.join('<span class="lyric-line">%s</span>' % esc(r) for r in sekcia if r) +
                          '</p></div>')
        h, _ = nahrad_blok(h, '<div class="song-lyrics"',
                           '\n                    ' + '\n                    '.join(riadky) + '\n                ')
        h = uprav_hlavicku(h, '%s — pieseň — Deň Záchrany' % sg['title'], sg['desc'],
                           '%s/piesen-%s.html' % (BASE_URL, sg['id']),
                           'data-song-id="%s"' % sg['id'])
        h = json_ld(h, {
            "@context": "https://schema.org",
            "@type": "MusicRecording",
            "name": sg['title'],
            "description": sg['desc'],
            "inLanguage": "sk",
            "url": '%s/piesen-%s.html' % (BASE_URL, sg['id']),
            "image": '%s/%s' % (BASE_URL, OG_IMAGE),
            "byArtist":  {"@type": "MusicGroup", "name": "Deň Záchrany"},
            "inAlbum":   {"@type": "MusicAlbum", "name": "Deň Záchrany"},
            "isAccessibleForFree": True,
        })
        open(P('piesen-%s.html' % sg['id']), 'w', encoding='utf-8').write(h)
    sprava.append('piesen-1..%s.html   — %d samostatných stránok' % (data['piesne'][-1]['id'], len(data['piesne'])))

    # pôvodné spoločné stránky ostávajú funkčné, ale neindexujeme ich
    for f in ('kapitola.html', 'piesen.html'):
        h = open(P(f), encoding='utf-8').read()
        h = vycisti_hlavicku(h)
        h = re.sub(r'(</title>)', r'\1\n    <meta name="robots" content="noindex, follow">', h, count=1)
        open(P(f), 'w', encoding='utf-8').write(re.sub(r'\n{3,}', '\n\n', h))
    sprava.append('kapitola.html a piesen.html — ponechané funkčné, označené noindex')
    return sprava


def main():
    data = nacitaj_data()
    print("  ✓ " + robots())
    print("  ✓ " + sitemap(data))
    for subor in PAGES:
        stav = "noindex" if not PAGES[subor][2] else "canonical + og"
        print(f"  ✓ {doplň(subor, data):16} ({stav})")

    # štruktúrované údaje pre hlavné stránky
    web = {"@type": "WebSite", "name": "Deň Záchrany", "url": BASE_URL + "/",
           "inLanguage": "sk",
           "description": "Biblická pomoc pre ťažké chvíle — kapitoly, modlitby a piesne.",
           "publisher": {"@type": "Organization", "name": "Deň Záchrany",
                         "url": BASE_URL + "/",
                         "sameAs": [YOUTUBE],
                         "logo": {"@type": "ImageObject", "url": BASE_URL + "/assets/icon-512.png"}}}
    h = open(P("index.html"), encoding="utf-8").read()
    h = json_ld(h, {"@context": "https://schema.org", **web})
    open(P("index.html"), "w", encoding="utf-8").write(h)

    for subor, typ, popis in [
        ("kapitoly.html", "CollectionPage", "Zoznam kapitol — biblická pomoc pre konkrétne životné situácie."),
        ("piesne.html",   "CollectionPage", "Zoznam piesní projektu Deň Záchrany."),
    ]:
        h = open(P(subor), encoding="utf-8").read()
        h = json_ld(h, {"@context": "https://schema.org", "@type": typ,
                        "name": subor.replace(".html", "").capitalize(),
                        "description": popis, "inLanguage": "sk",
                        "url": f"{BASE_URL}/{subor}",
                        "isPartOf": {"@type": "WebSite", "name": "Deň Záchrany", "url": BASE_URL + "/"}})
        open(P(subor), "w", encoding="utf-8").write(h)
    print("  ✓ štruktúrované údaje  (index, kapitoly, piesne)")
    print()
    for s in predgeneruj(data):
        print("  ✓ " + s)
    print()
    for s in statické_stránky(data):
        print("  ✓ " + s)
    print("\nHotovo. Pri zmene domény uprav BASE_URL a spusti znova.")


if __name__ == '__main__':
    main()
