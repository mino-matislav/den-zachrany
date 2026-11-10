#!/usr/bin/env python3
"""Deň Záchrany — e-kniha EPUB 3 (čítačky Kindle cez Send to Kindle, Kobo, PocketBook, Apple Books, mobil).
Skladá sa z tých istých dát a textov ako PDF kniha (build_sk.py). usage: build_epub.py"""
import sys, uuid, zipfile, datetime, re
from html import escape

sys.argv = [sys.argv[0], "epub"]           # build_sk čítame len kvôli dátam a textom
import build_sk as B

OUT = B.OUTD / "Den-Zachrany-kniha.epub"
LANG = "sk"
UID = "urn:uuid:" + str(uuid.uuid5(uuid.NAMESPACE_URL, B.WEB + "/kniha"))
NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def esc(s): return escape(s, quote=False)


FILES = []            # (id, filename, title)
ANCHOR_FILE = {}      # anchor id -> filename


def page(fid, fname, title, body, anchors=()):
    FILES.append((fid, fname, title, body))
    for a in anchors: ANCHOR_FILE[a] = fname


def fix_links(html_):
    """#kotva -> subor.xhtml#kotva (odkazy medzi časťami knihy)."""
    return re.sub(r'href="#([\w-]+)"', lambda m: f'href="{ANCHOR_FILE.get(m.group(1), "")}#{m.group(1)}"', html_)


def cite(ref):
    if not ref: return ""
    u = B.ref_url(ref)
    return f'<p class="cite"><a href="{u}">{esc(ref)}</a></p>' if u else f'<p class="cite">{esc(ref)}</p>'


def quote(text, ref):
    return f'<blockquote><p>„{esc(text)}“</p>{cite(ref)}</blockquote>'


def text_html(full, verses):
    out, used = [], set()
    for i, p in enumerate([p.strip() for p in full.split("\n\n") if p.strip()]):
        if i == 0 and p.endswith(","):
            out.append(f'<p class="salute">{esc(p)}</p>'); continue
        if p.startswith('"') and p.endswith('"'):
            core = B.norm(p.strip('"').strip("."))
            ref = next((v["ref"] for v in verses if core.strip(".") in B.norm(v["text"]) or B.norm(v["text"]) in core), None)
            if ref: used.add(ref)
            out.append(quote(p.strip('"'), ref)); continue
        out.append(f"<p>{esc(p)}</p>")
    out += [quote(v["text"], v["ref"]) for v in verses if v["ref"] not in used]
    return "\n".join(out)


def prayer_html(pr):
    ps = [p.strip() for p in pr.split("\n\n") if p.strip()]
    rest = "".join(f'<p class="amen">{esc(p)}</p>' if p == "Amen." else f"<p>{esc(p)}</p>" for p in ps[1:])
    return f'<div class="prayer"><h3>Modlitba</h3><p class="address">{esc(ps[0])}</p>{rest}</div>'


# ---- obsah --------------------------------------------------------------------------
page("titul", "titul.xhtml", B.TITLE, f"""<section class="titlepage" epub:type="titlepage">
<h1>{esc(B.TITLE)}</h1><p class="sub">{esc(B.SUBTITLE)}</p><p class="author">{esc(B.AUTHOR)}</p>
<div class="imprint"><p>© 2026 {esc(B.AUTHOR)}. Všetky práva vyhradené.</p>
<p>Biblické citáty sú z Evanjelického prekladu © Evanjelická cirkev a. v. na Slovensku, vydavateľstvo Tranoscius.</p>
<p>Každý odkaz na verš otvorí text na biblia.sk.</p>
<p>Ryba na obálke je starokresťanský symbol. Grécke písmená ΙΧΘΥΣ znamenajú „Ježiš Kristus, Boží Syn, Spasiteľ“.</p>
<p>Modlitby si môžeš vypočuť a piesne pustiť na webe Deň Záchrany: <a href="{B.WEB}">{B.WEB.replace('https://', '')}</a></p>
<p>Stav k {B.TODAY.day}. {B.TODAY.month}. {B.TODAY.year}</p></div></section>""")

page("ako", "ako.xhtml", B.HOWTO_TITLE, f"""<section id="ako"><h1>{B.HOWTO_TITLE}</h1>
{''.join(f'<p>{esc(p)}</p>' for p in B.HOWTO)}<p class="seeker">{B.HOWTO_SEEKER}</p></section>""", ["ako"])

finder = "".join(f'<h2 class="fg">{esc(g)}</h2><ul class="finder">'
                 + "".join(f'<li><a href="#ch{n}">{n}. {esc(B.CH[str(n)]["title"])}</a></li>' for n in nums if str(n) in B.CH)
                 + "</ul>" for g, nums in B.FINDER)
page("kde", "kde.xhtml", B.FINDER_TITLE, f"""<section id="kde"><h1>{B.FINDER_TITLE}</h1><p class="lead">{B.FINDER_LEAD}</p>
{finder}<p class="help">{B.FINDER_HELP}</p></section>""", ["kde"])

lines = "".join(f'<li><strong>{esc(a)}: {esc(b)}</strong>' + (f' <em>({esc(c)})</em>' if c else "") + "</li>" for a, b, c in B.CRISIS_LINES)
end39 = (f'Tvoj život má pre Boha cenu, aj keď to teraz necítiš. <a href="#ch39">Kapitola 39, {esc(B.CH["39"]["title"])}</a>, je napísaná pre teba.'
         if "39" in B.CH else "Tvoj život má pre Boha cenu, aj keď to teraz necítiš.")
page("pomoc", "pomoc.xhtml", B.CRISIS_TITLE, f"""<section id="pomoc"><h1>{B.CRISIS_TITLE}</h1><p>{esc(B.CRISIS_LEAD)}</p>
<ul class="lines">{lines}</ul><p><strong>{esc(B.CRISIS_EMERG)}</strong></p>{quote(*B.CRISIS_VERSE)}
<p class="center">{end39}</p><p class="small">{esc(B.CRISIS_CHECKED)}</p></section>""", ["pomoc"])

page("uvod", "uvod.xhtml", "Úvodné slovo", f"""<section id="uvod"><h1>Úvodné slovo</h1>
<p class="listen"><a href="{B.WEB}/#audio-heading">Vypočuj si úvodné slovo</a></p>
{quote(*B.HERO_VERSE)}<p class="slogan">„{esc(B.SLOGAN)}“</p>
{''.join(f'<p>{esc(p)}</p>' for p in B.INTRO)}<p>{B.INTRO_LINK.replace("na nasledujúcej strane", "v ďalšej časti")}</p>
<div class="warn"><h3>Dôležité upozornenie</h3><p>„{esc(B.WARNING)}“</p></div></section>""", ["uvod"])

page("zachrana", "zachrana.xhtml", "Modlitba záchrany", f"""<section id="zachrana"><h1>Modlitba záchrany</h1>
<h2>Čo znamená táto modlitba?</h2>{''.join(f'<p>{esc(p)}</p>' for p in B.SAL_MEANING)}<p><em>{esc(B.SAL_LEAD)}</em></p>
<div class="prayer"><p class="listen"><a href="{B.WEB}/#modlitba-zachrany">Vypočuj si Modlitbu záchrany</a></p>
{''.join(f'<p>{esc(p)}</p>' for p in B.SAL_PRAYER)}<p class="amen">Amen.</p></div>
<h2>Čo teraz?</h2><p>{esc(B.SAL_NEXT_LEAD)}</p><ul>{''.join(f'<li>{s}</li>' for s in B.SAL_NEXT)}</ul>
<p class="center">Ďalšie kapitoly, modlitby a piesne nájdeš na webe: <a href="{B.WEB}">{B.WEB.replace('https://', '')}</a></p></section>""", ["zachrana"])

for cid, c in B.CH.items():
    label = f'<p class="starter">{esc(c["starterLabel"])}</p>' if c.get("isStarter") and c.get("starterLabel") else ""
    page(f"ch{cid}", f"kapitola-{int(cid):02d}.xhtml", f'{cid}. {c["title"]}', f"""<section id="ch{cid}" epub:type="chapter">
<p class="chnum">Kapitola {cid}</p>{label}<h1>{esc(c["title"])}</h1><p class="chsub">{esc(c["subtitle"])}</p>
{text_html(c["fullText"], c["verses"])}
<p class="listen"><a href="{B.WEB}/kapitola-{cid}.html">Vypočuj si túto modlitbu</a></p>
{prayer_html(c["prayer"])}</section>""", [f"ch{cid}"])

songs = "".join(f'<li><a href="{B.WEB}/piesen-{s["id"]}.html">{s["number"]}. {esc(s["title"])}</a></li>' for s in B.SONGS.values())
page("piesne", "piesne.xhtml", "Piesne Dňa Záchrany", f"""<section id="piesne"><h1>Piesne Dňa Záchrany</h1>
<p>Všetky piesne si môžeš zadarmo vypočuť na webe Deň Záchrany. Stačí kliknúť na názov piesne.</p><ul>{songs}</ul></section>""", ["piesne"])

S = B.SUPPORT
page("podpora", "podpora.xhtml", "Podpora projektu", f"""<section id="podpora"><h1>Podpora projektu</h1>
{''.join(f'<p>{esc(p)}</p>' for p in S["lead"])}<h2>Môžeš sa modliť</h2><p>{esc(S["pray"])}</p>{quote(*S["pray_verse"])}
<p>{esc(S["pray_us"])}</p>
<h2>Môžeš to poslať ďalej</h2><p>{esc(S["share"])}</p>
<h2>Finančná podpora</h2>{quote(*S["give_verse"])}<p>{esc(S["providence"])}</p><p>{esc(S["money"])}</p>
<p><strong>IBAN:</strong> {S["iban"]}<br/><strong>Príjemca:</strong> {esc(S["recipient"])}<br/><strong>Poznámka:</strong> {esc(S["note"])}</p>
<p>QR kód na platbu nájdeš na stránke <a href="{B.WEB}/podpora.html">{B.WEB.replace('https://', '')}/podpora.html</a></p></section>""", ["podpora"])

page("zaver", "zaver.xhtml", "Na záver", f"""<section id="zaver"><h1>Na záver</h1>{quote(*B.CLOSING_VERSE)}
<p class="center">Nové kapitoly, modlitby a piesne postupne pribúdajú na webe Deň Záchrany: <a href="{B.WEB}">{B.WEB.replace('https://', '')}</a></p></section>""", ["zaver"])

CSS = """body { font-family: serif; line-height: 1.5; margin: 0 4%; }
h1 { text-align: center; font-size: 1.5em; line-height: 1.2; margin: 1.2em 0 .3em; color: #2e2416; }
h2 { font-size: 1.15em; margin: 1.2em 0 .3em; color: #2e2416; }
h2.fg { font-size: 1.05em; margin: 1em 0 .2em; }
h3 { text-align: center; font-size: 1.1em; margin: .3em 0; }
p { margin: 0 0 .6em; text-align: justify; -webkit-hyphens: auto; hyphens: auto; }
a { color: #86611f; }
.center, .listen, .lead, .help, .small, .titlepage, .chnum, .chsub, .starter, .slogan { text-align: center; }
.chnum { text-transform: uppercase; letter-spacing: .25em; font-size: .8em; color: #86611f; margin-top: 2em; }
.chsub, .lead, .slogan, .seeker, .listen { font-style: italic; }
.chsub { color: #4d4438; }
.salute { font-style: italic; text-align: left; }
.small { font-size: .8em; color: #4d4438; }
blockquote { margin: 1em 0 1em .5em; padding-left: .8em; border-left: 2px solid #86611f; }
blockquote p { font-style: italic; text-align: left; margin-bottom: .2em; }
p.cite { text-align: right; font-size: .85em; font-style: normal; }
.prayer { border: 1px solid #b8ad9c; padding: .6em .9em; margin: 1em 0; }
.prayer h3 { margin-top: 0; }
.address { font-weight: bold; }
.amen { text-align: center; font-weight: bold; color: #86611f; letter-spacing: .1em; }
.warn { border: 1px solid #b8ad9c; padding: .5em .8em; margin: 1em 0; }
.warn p { font-style: italic; }
ul.finder, ul.lines { list-style: none; padding-left: 0; }
ul.finder li, ul.lines li { margin-bottom: .35em; }
.titlepage h1 { margin-top: 3em; font-size: 2em; }
.titlepage .sub { font-style: italic; text-align: center; }
.titlepage .author { text-transform: uppercase; letter-spacing: .25em; font-size: .85em; text-align: center; margin-bottom: 2em; }
.imprint p { text-align: center; font-size: .85em; }
"""


def xhtml(title, body):
    return f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="{LANG}" xml:lang="{LANG}">
<head><meta charset="utf-8"/><title>{esc(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body>{B.nbsp(fix_links(body))}</body></html>"""


def build():
    cover_img = B.GFX / "cover.jpg"
    pdf = B.OUTD / "Den-Zachrany-kniha.pdf"            # obálka = prvá strana farebného PDF (s názvom knihy)
    if pdf.exists():
        import subprocess
        tmp = B.OUTD / "epub-cover"
        if subprocess.run(["pdftoppm", "-jpeg", "-jpegopt", "quality=90", "-r", "220", "-f", "1", "-l", "1", "-singlefile", str(pdf), str(tmp)]).returncode == 0:
            cover_img = B.OUTD / "epub-cover.jpg"
    nav_items = "".join(f'<li><a href="{f}">{esc(t)}</a></li>' for i, f, t, _ in FILES if i != "titul")
    nav = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="{LANG}" xml:lang="{LANG}">
<head><meta charset="utf-8"/><title>Obsah</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body><nav epub:type="toc" id="toc"><h1>Obsah</h1><ol>{nav_items}</ol></nav>
<nav epub:type="landmarks" hidden=""><ol><li><a epub:type="cover" href="obalka.xhtml">Obálka</a></li>
<li><a epub:type="toc" href="nav.xhtml">Obsah</a></li><li><a epub:type="bodymatter" href="kapitola-01.xhtml">Kapitola 1</a></li></ol></nav></body></html>"""
    ncx_points = "".join(f'<navPoint id="np{n}" playOrder="{n}"><navLabel><text>{esc(t)}</text></navLabel><content src="{f}"/></navPoint>'
                         for n, (i, f, t, _) in enumerate([x for x in FILES if x[0] != "titul"], 1))
    ncx = f"""<?xml version="1.0" encoding="utf-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="{UID}"/></head>
<docTitle><text>{esc(B.TITLE)}</text></docTitle><navMap>{ncx_points}</navMap></ncx>"""
    cover = f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="{LANG}" xml:lang="{LANG}">
<head><meta charset="utf-8"/><title>{esc(B.TITLE)}</title><style>body{{margin:0;text-align:center}} img{{max-width:100%;max-height:100%}}</style></head>
<body epub:type="cover"><img src="cover.jpg" alt="{esc(B.TITLE)}"/></body></html>"""
    manifest = ['<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
                '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
                '<item id="css" href="style.css" media-type="text/css"/>',
                '<item id="coverimg" href="cover.jpg" media-type="image/jpeg" properties="cover-image"/>',
                '<item id="obalka" href="obalka.xhtml" media-type="application/xhtml+xml"/>']
    manifest += [f'<item id="{i}" href="{f}" media-type="application/xhtml+xml"/>' for i, f, _, _ in FILES]
    spine = ['<itemref idref="obalka" linear="yes"/>', '<itemref idref="titul"/>', '<itemref idref="nav"/>']
    spine += [f'<itemref idref="{i}"/>' for i, _, _, _ in FILES if i != "titul"]
    opf = f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="{LANG}">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">{UID}</dc:identifier><dc:title>{esc(B.TITLE)}</dc:title><dc:language>{LANG}</dc:language>
<dc:creator>{esc(B.AUTHOR)}</dc:creator><dc:description>{esc(B.SUBTITLE)}</dc:description>
<meta property="dcterms:modified">{NOW}</meta><meta name="cover" content="coverimg"/></metadata>
<manifest>{''.join(manifest)}</manifest><spine toc="ncx">{''.join(spine)}</spine></package>"""
    container = """<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>"""
    with zipfile.ZipFile(OUT, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", container, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/content.opf", opf, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/nav.xhtml", nav, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/toc.ncx", ncx, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/style.css", CSS, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/obalka.xhtml", cover, compress_type=zipfile.ZIP_DEFLATED)
        z.write(cover_img, "OEBPS/cover.jpg", compress_type=zipfile.ZIP_DEFLATED)
        for i, f, t, body in FILES:
            z.writestr(f"OEBPS/{f}", xhtml(t, body), compress_type=zipfile.ZIP_DEFLATED)
    print(f"{OUT.name}: {len(FILES)} častí, {len(B.CH)} kapitol, {OUT.stat().st_size // 1024} kB")
    if B.WARN: print("UPOZORNENIE – verše bez odkazu (neznámy názov knihy):", sorted(B.WARN))


if __name__ == "__main__":
    build()
