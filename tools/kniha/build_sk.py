#!/usr/bin/env python3
"""Deň Záchrany — slovenská kniha (A5), skladaná automaticky z dát webu.
usage: build_sk.py [pergamen|tlac]
Texty kapitol, úvodu a Modlitby záchrany sa berú priamo z webu (js/data.js, index.html) bez zmeny obsahu."""
import datetime, html, json, re, sys
from pathlib import Path
from pypdf import PdfReader
from weasyprint import HTML

HERE = Path(__file__).parent
REPO = HERE.parents[1]
OUTD = HERE / "out"
GFX = OUTD / "gfx"
FONTS = OUTD / "fonts" / "ttf"
MODE = sys.argv[1] if len(sys.argv) > 1 else "pergamen"
OUT = OUTD / ("Den-Zachrany-kniha.pdf" if MODE == "pergamen" else "Den-Zachrany-kniha-tlac.pdf")
WEB = "https://den-zachrany.vercel.app"

CH = json.loads((OUTD / "chapters.json").read_text(encoding="utf-8"))
CH = {k: v for k, v in CH.items() if v.get("available", True) is not False}
SONGS = {str(s["id"]): s for s in json.loads((OUTD / "songs.json").read_text(encoding="utf-8"))}
ICON_FOR = {k: v for k, v in json.loads((HERE / "ikony.json").read_text(encoding="utf-8")).items() if not k.startswith("_")}
TODAY = datetime.date.today()

# ---- texty na schválenie (návrhy) -------------------------------------------------
TITLE = "Deň Záchrany"
SUBTITLE = "Slová nádeje a modlitby pre ťažké chvíle"
AUTHOR = "Tím Dňa Záchrany"
TAGLINE = "Dnes je deň spasenia."
CARD_INTRO = ("Boh ťa miluje. Ježiš Kristus zomrel za tvoje hriechy, bol pochovaný a na tretí deň vstal z mŕtvych. "
              "Ak tomu uveríš vo svojom srdci, pomodli sa:")
CARD_VERSE = ("Každý človek totiž, ktorý by vzýval meno Pánovo, bude spasený.", "Rimanom 10, 13")
CARD_FOOT = "Túto kartičku môžeš voľne kopírovať a rozdávať."
CARD_COUNT_PAGES = 3
CLOSING_VERSE = ("Boh nádeje nech vás naplní všetkou radosťou a pokojom vo viere, aby ste sa mocou Ducha Svätého rozhojňovali v nádeji.", "Rimanom 15, 13")

SALVATION_SONGS = ["6", "9"]   # piesne pri Modlitbe záchrany


# ---- úvod a Modlitba záchrany: čítajú sa z index.html ------------------------------
def _txt(fragment):
    t = re.sub(r"<(?!/?a\b)[^>]+>", "", fragment)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()

def _block(src, cls):
    m = re.search(r'<(div|blockquote|ul)[^>]*class="[^"]*\b' + cls + r'\b[^"]*"[^>]*>(.*?)</\1>', src, re.S)
    if not m: raise SystemExit(f"index.html: nenašiel sa blok {cls}")
    return m.group(2)

def _paras(fragment, tag="p"):
    return [_txt(x) for x in re.findall(r"<" + tag + r"\b[^>]*>(.*?)</" + tag + ">", fragment, re.S)]

def _booklinks(t):
    """Web links -> links inside the book ('kapitolu X' -> '1. kapitolu X'; homepage anchor -> salvation page)."""
    t = re.sub(r'(kapitol[ua])\s*<a href="kapitola-(\d+)\.html">([^<]+)</a>', r'<a href="#ch\2">\2. \1 \3</a>', t)
    t = t.replace('href="#modlitba-zachrany"', 'href="#zachrana"').replace("ktorú nájdeš nižšie", "ktorú nájdeš na nasledujúcej strane")
    return t

IDX = (REPO / "index.html").read_text(encoding="utf-8")
_hero = _block(IDX, "hero-verse")
HERO_VERSE = (_txt(re.search(r'class="verse-text">(.*?)</p>', _hero, re.S).group(1)).strip('„“"'),
              _txt(re.search(r'class="verse-ref">(.*?)</footer>', _hero, re.S).group(1)).lstrip("— ").strip())
SLOGAN = _paras(_block(IDX, "intro-quote"))[0].strip('„“"')
_intro = _paras(_block(IDX, "intro-body"))
INTRO, INTRO_LINK = _intro[:-1], _booklinks(_intro[-1])
WARNING = _paras(_block(IDX, "warning-text"))[0].strip('„“"')
_sal = _paras(_block(IDX, "salvation-intro"))
SAL_MEANING, SAL_LEAD = _sal[:-1], _sal[-1]
SAL_PRAYER = [p for p in _paras(_block(IDX, "salvation-prayer")) if p != "Amen."]
_next = _block(IDX, "salvation-next")
SAL_NEXT_LEAD = _paras(_next)[0]
SAL_NEXT = [_booklinks(x) for x in _paras(_block(_next, "salvation-steps"), "li")]

# ---- Podpora projektu (texty zo stránky Podpora; bez IBAN, len odkaz) -------------
SUPPORT = {
    "lead": ["Deň Záchrany vznikol preto, aby mal človek v ťažkej chvíli kam siahnuť. Všetko na webe je voľne dostupné a tak to aj zostane.",
             "Ak ti niečo z toho pomohlo, najcennejšia podpora nestojí nič."],
    "pray": "Modli sa, aby Deň Záchrany oslovil ľudí hľadajúcich nádej a cestu k Bohu, a aby každý návštevník našiel povzbudenie, pravdu a Ježiša Krista.",
    "pray_verse": ("Nakoniec, bratia, modlite sa za nás, aby sa Pánovo slovo rýchlo šírilo a oslávilo tak ako aj u vás,", "2. Tesalonickým 3, 1"),
    "share": "Ak poznáš niekoho, kto práve prechádza ťažkým obdobím, pošli mu konkrétnu kapitolu, ktorá sa jeho situácie týka. Niekedy je to viac než akékoľvek slová.",
    "money": "Nič sa neočakáva a nič sa nemeria. Ak by si chcel podporiť projekt aj finančne, všetky údaje nájdeš na stránke Podpora:",
}

# kódy kníh pre Evanjelický preklad na biblia.sk (overené 25. 10. 2026; pozor: Galatským = "ga")
_BC = """1. Mojžišova=gn|2. Mojžišova=ex|3. Mojžišova=lv|4. Mojžišova=nm|5. Mojžišova=dt|Józua=joz|Sudcov=sdc|Sudcovia=sdc|Rút=rut|
1. Samuelova=1sam|2. Samuelova=2sam|1. Kráľov=1krl|2. Kráľov=2krl|1. Kroník=1krn|2. Kroník=2krn|1. Kronická=1krn|2. Kronická=2krn|
Ezdráš=ezd|Nehemiáš=neh|Ester=est|Jób=job|Žalm=z|Žalmy=z|Príslovia=pris|Kazateľ=koh|Veľpieseň=vlp|Izaiáš=iz|Jeremiáš=jer|
Žalospevy=nar|Náreky=nar|Ezechiel=ez|Daniel=dan|Ozeáš=oz|Joel=joel|Ámos=am|Amos=am|Abdiáš=abd|Jonáš=jon|Micheáš=mich|Nahum=nah|
Habakuk=hab|Abakuk=hab|Sofoniáš=sof|Aggeus=ag|Zachariáš=zach|Malachiáš=mal|Matúš=mt|Marek=mk|Lukáš=lk|Ján=jn|Skutky=sk|
Skutky apoštolov=sk|Rimanom=rim|1. Korintským=1kor|2. Korintským=2kor|Galatským=ga|Efezským=ef|Filipským=flp|Kolosenským=kol|
1. Tesalonickým=1tes|2. Tesalonickým=2tes|1. Timoteovi=1tim|2. Timoteovi=2tim|1. Timotejovi=1tim|2. Timotejovi=2tim|Títovi=tit|
Filemonovi=flm|Židom=heb|Jakub=jk|Jakubov=jk|1. Petra=1pt|2. Petra=2pt|1. Jánov=1jn|2. Jánov=2jn|3. Jánov=3jn|Júda=jud|Júdov=jud|
Zjavenie=zj|Zjavenie Jána=zj"""
BOOK_CODE = dict(x.split("=") for x in _BC.replace("\n", "").split("|"))
WARN = set()

def ref_url(ref):
    m = re.match(r"(.+?)\s+(\d+),\s*(\d+)", ref or "")
    if not m or m.group(1) not in BOOK_CODE:
        WARN.add(ref); return None
    return f"https://biblia.sk/citanie/sep/{BOOK_CODE[m.group(1)]}/{m.group(2)}/{m.group(3)}"

def cite(ref):
    if not ref: return ""
    u = ref_url(ref)
    return f'<a class="cite" href="{u}">{esc(ref)}</a>' if u else f'<span class="cite">{esc(ref)}</span>'

def esc(s): return html.escape(s, quote=False)
def img(name, cls, folder=GFX): return f'<img class="{cls}" src="file://{folder / name}">'

def ornament(w=120):
    return f'''<svg class="orn" width="{w}" height="14" viewBox="0 0 120 14"><g fill="none" stroke="var(--gold)" stroke-width="0.9">
<path d="M2 7 H48"/><path d="M72 7 H118"/><path d="M52 7 l8 -5 l8 5 l-8 5 z"/></g><circle cx="60" cy="7" r="1.6" fill="var(--gold)"/></svg>'''

def norm(t): return re.sub(r"\s+", " ", t.replace("„", '"').replace("“", '"')).strip(' ."…,;')

PUSH = set()          # block ids that should start on the next page (aesthetic layout)
VIGN = {}             # chapter id -> top margin (px) of the closing ornament filling an empty page end

def render_text(full, verses, cid="x"):
    paras = [p.strip() for p in full.split("\n\n") if p.strip()]
    out, first, used = [], True, set()
    def tag(html_, i):
        bid = f"b{cid}_{i}"
        extra = ' style="break-before: page"' if bid in PUSH else ""
        return html_.replace(">", f' id="{bid}"{extra}>', 1)
    for i, p in enumerate(paras):
        if i == 0 and p.endswith(","):
            out.append(tag(f'<p class="salute">{esc(p)}</p>', i)); continue
        if p.startswith('"') and p.endswith('"'):
            core = norm(p.strip('"').strip("."))
            ref = next((v["ref"] for v in verses if core.strip(".") in norm(v["text"]) or norm(v["text"]) in core), None)
            if ref: used.add(ref)
            out.append(tag(f'<blockquote><p>„{esc(p.strip(chr(34)))}“</p>{cite(ref)}</blockquote>', i)); continue
        cls = ' class="lead"' if p.endswith(":") else ""
        if first and p[0].isupper():
            first = False; t = esc(p)
            out.append(tag(f'<p class="first"><span class="drop">{t[0]}</span>{t[1:]}</p>', i))
        else:
            first = False if not p.startswith("„") else first
            out.append(tag(f"<p{cls}>{esc(p)}</p>", i))
    return "\n".join(out), used

def render_prayer(pr):
    paras = [p.strip() for p in pr.split("\n\n") if p.strip()]
    out = [f'<p class="address">{esc(paras[0])}</p>']
    for p in paras[1:]:
        out.append(f'<p class="amen">{esc(p)} {img("fish-end.png", "afish")}</p>' if p == "Amen." else f"<p>{esc(p)}</p>")
    return "\n".join(out)

LONG = set()
MIN_PT = 11.4

def vignette(cid):
    if cid not in VIGN: return ""
    return (f'<div class="vign" style="margin-top:{VIGN[cid]:.0f}px">{ornament(70)}'
            f'{img(f"icon-{ICON_FOR.get(cid, "book")}.png", "vicon")}{ornament(70)}</div>')

def build(prayer_pt):
    toc = ['<li><a href="#uvod"><span class="tn">·</span>Úvodné slovo</a></li>',
           '<li><a href="#zachrana"><span class="tn">·</span>Modlitba záchrany</a></li>']
    chapters, problems = [], []
    for cid, c in CH.items():
        toc.append(f'<li><a href="#ch{cid}"><span class="tn">{cid}</span>{esc(c["title"])}</a></li>')
        body, used = render_text(c["fullText"], c["verses"], cid)
        extra = "".join(f'<blockquote><p>„{esc(v["text"])}“</p>{cite(v["ref"])}</blockquote>'
                        for v in c["verses"] if v["ref"] not in used)
        label = f'<div class="starter">{esc(c["starterLabel"])}</div>' if c.get("isStarter") and c.get("starterLabel") else ""
        ppt = prayer_pt.get(cid, BODY_PT)
        chapters.append(f'''
<section class="chapter" id="ch{cid}">
  <h2 class="runner">{esc(c["title"])}</h2>
  <header class="chead">{img(f"icon-{ICON_FOR.get(cid, 'book')}.png", "chicon")}
    <div class="chnum">Kapitola {cid}</div>{label}
    <h1 class="chtitle">{esc(c["title"])}</h1>
    <p class="chsub">{esc(c["subtitle"])}</p>{ornament(110)}
  </header>
  <div class="body">{body}{extra}<div id="tend{cid}" class="tend"></div>{vignette(cid)}</div>
  <div class="prayer{' long' if cid in LONG else ''}" id="prayer{cid}" style="font-size:{ppt}pt"><div class="pframe">
    {img("corner-tl.png","c tl")}{img("corner-tr.png","c tr")}{img("corner-bl.png","c bl")}{img("corner-br.png","c br")}
    <h3 class="sect">Modlitba</h3><p class="listen"><a href="{WEB}/kapitola-{cid}.html">Vypočuj si túto modlitbu</a></p>{render_prayer(c["prayer"])}
    <a id="prayerend{cid}"></a>
  </div></div>
</section>''')

    toc += ['<li><a href="#piesne"><span class="tn">·</span>Piesne Dňa Záchrany</a></li>',
            '<li><a href="#podpora"><span class="tn">·</span>Podpora projektu</a></li>',
            '<li><a href="#zaver"><span class="tn">·</span>Na záver</a></li>',
            '<li><a href="#karticky"><span class="tn">·</span>Kartičky s Modlitbou záchrany na vystrihnutie</a></li>']

    songs_list = "".join(f'<li><a href="{WEB}/piesen-{s["id"]}.html"><span class="tn">{s["number"]}</span>{esc(s["title"])}</a></li>'
                         for s in SONGS.values())
    card = f'''<td class="card"><div class="cardin">
  {img("fish-end.png", "cfish")}<div class="ctitle">Modlitba záchrany</div>
  <p class="cintro">{esc(CARD_INTRO)}</p>
  {"".join(f"<p>{esc(p)}</p>" for p in SAL_PRAYER)}<p class="camen">Amen.</p>
  <p class="cverse">„{esc(CARD_VERSE[0])}“ <span>{esc(CARD_VERSE[1])}</span></p>
  <p class="cfoot">{esc(CARD_FOOT)}</p></div></td>'''
    card_pages = "".join(f'''<section class="cards"{' id="karticky"' if i == 0 else ''}>
  <div class="cuthint">{img("scissors.png", "sc")} Vystrihni po prerušovanej čiare</div>
  <table class="cardgrid"><tr>{card}{card}</tr><tr>{card}{card}</tr></table></section>''' for i in range(CARD_COUNT_PAGES))

    return f"""<!doctype html><html lang="sk"><head><meta charset="utf-8"><title>{TITLE}</title>
<meta name="author" content="{AUTHOR}"><meta name="description" content="{SUBTITLE}"><style>{css()}</style></head><body>
<section class="cover"><div class="frame"></div><div class="frame2"></div>
  <h1>{TITLE}</h1><p class="sub">{SUBTITLE}</p><div class="verse">{TAGLINE}</div></section>
<section class="titlepage">{img("fish-end.png","tfish")}<h1>{TITLE}</h1>{ornament()}<p class="sub">{SUBTITLE}</p>
  <div class="author">{AUTHOR}</div>
  <div class="imprint">{ornament(80)}
    <p>© 2026 {AUTHOR}<br>Všetky práva vyhradené.</p>
    <p>Biblické citáty sú z Evanjelického prekladu<br><span class="nw">© Evanjelická cirkev a. v. na Slovensku,</span><br><span class="nw">vydavateľstvo Tranoscius.</span></p>
    <p>Každý odkaz na verš v tejto knihe<br>otvorí text na biblia.sk.</p>
    <p>Ryba na obálke je starokresťanský symbol.<br>Grécke písmená <span class="gr">ΙΧΘΥΣ</span> znamenajú<br><span class="nw">„Ježiš Kristus, Boží Syn, Spasiteľ“.</span></p>
    <p>Modlitby si môžeš vypočuť a piesne pustiť<br>na webe Deň Záchrany:<br><a class="ul web" href="{WEB}">{WEB.replace('https://','')}</a></p>
    <p>Stav k {TODAY.day}. {TODAY.month}. {TODAY.year}</p>
  </div></section>
<section class="toc"><h2>Obsah</h2>{ornament()}<ol>{''.join(toc)}</ol></section>
<section class="intro" id="uvod"><h2 class="runner">Úvodné slovo</h2>
  <h1 class="ptitle">Úvodné slovo</h1>{ornament(110)}
  <p class="listen"><a href="{WEB}/#audio-heading">Vypočuj si úvodné slovo</a></p>
  <blockquote class="hero"><p>„{esc(HERO_VERSE[0])}“</p>{cite(HERO_VERSE[1])}</blockquote>
  <p class="slogan">„{esc(SLOGAN)}“</p>
  <div class="body">{''.join(f'<p>{esc(p)}</p>' for p in INTRO)}<p class="hl">{INTRO_LINK}</p></div>
  <div class="warnpage">{img("fish-end.png", "cfish2")}<div class="warn"><div class="wt">Dôležité upozornenie</div><p>„{esc(WARNING)}“</p></div>{ornament(110)}</div>
</section>
<section class="salvation" id="zachrana"><h2 class="runner">Modlitba záchrany</h2>
  <h1 class="ptitle">Modlitba záchrany</h1>{ornament(110)}
  <h3 class="sub3">Čo znamená táto modlitba?</h3>
  <div class="body">{''.join(f'<p>{esc(p)}</p>' for p in SAL_MEANING)}<p class="lead"><em>{esc(SAL_LEAD)}</em></p></div>
  <div class="pframe sal">{img("corner-tl.png","c tl")}{img("corner-tr.png","c tr")}{img("corner-bl.png","c bl")}{img("corner-br.png","c br")}
    <p class="listen"><a href="{WEB}/#modlitba-zachrany">Vypočuj si Modlitbu záchrany</a></p>{''.join(f'<p>{esc(p)}</p>' for p in SAL_PRAYER)}<p class="amen">Amen.</p></div>
  <h3 class="sub3">Čo teraz?</h3>
  <div class="body"><p>{esc(SAL_NEXT_LEAD)}</p><ul class="steps">{''.join(f'<li>{s}</li>' for s in SAL_NEXT)}</ul>
    <p class="weblead">Ďalšie kapitoly, modlitby a piesne nájdeš na webe:<br><a class="ul web" href="{WEB}">{WEB.replace('https://','')}</a></p></div>
  <p class="saltext">K tejto téme sa hodia aj piesne {" a ".join(f'<a href="{WEB}/piesen-{x}.html">{esc(SONGS[x]['title'])}</a>' for x in SALVATION_SONGS)}.</p>
</section>
{''.join(chapters)}
<section class="songs" id="piesne"><h2 class="runner">Piesne Dňa Záchrany</h2>
  {img("icon-note.png", "chicon")}<h1 class="ptitle">Piesne Dňa Záchrany</h1>{ornament(110)}
  <p class="center">Všetky piesne si môžeš zadarmo vypočuť na webe Deň Záchrany. Stačí kliknúť na názov piesne.<br><a class="ul web" href="{WEB}/piesne.html">{WEB.replace('https://','')}/piesne.html</a></p>
  <ol class="slist">{songs_list}</ol>
</section>
<section class="support" id="podpora"><h2 class="runner">Podpora projektu</h2>
  {img("icon-heart.png", "chicon")}<h1 class="ptitle">Podpora projektu</h1>{ornament(110)}
  <div class="body">{''.join(f'<p>{esc(p)}</p>' for p in SUPPORT["lead"])}</div>
  <h3 class="sub3">Môžeš sa modliť</h3>
  <div class="body"><p>{esc(SUPPORT["pray"])}</p></div>
  <blockquote><p>„{esc(SUPPORT["pray_verse"][0])}“</p>{cite(SUPPORT["pray_verse"][1])}</blockquote>
  <h3 class="sub3">Môžeš to poslať ďalej</h3>
  <div class="body"><p>{esc(SUPPORT["share"])}</p></div>
  <h3 class="sub3">Finančná podpora</h3>
  <p class="weblead">{esc(SUPPORT["money"])}<br><a class="ul web" href="{WEB}/podpora.html">{WEB.replace('https://','')}/podpora.html</a></p>
</section>
<section class="closing" id="zaver"><h2 class="runner">Na záver</h2>
  {img("fish-end.png", "cfish2")}{ornament(110)}
  <blockquote class="hero"><p>„{esc(CLOSING_VERSE[0])}“</p>{cite(CLOSING_VERSE[1])}</blockquote>
  <p class="weblead">Nové kapitoly, modlitby a piesne<br>postupne pribúdajú na webe Deň Záchrany:<br><a class="ul web" href="{WEB}">{WEB.replace('https://','')}</a></p>
  {ornament(110)}
</section>
{card_pages}
</body></html>"""

BODY_PT = 12.6
INK, SOFT, GOLD, NAVY = ("#24170b", "#4a3520", "#6a4810", "#2e2416") if MODE == "pergamen" else ("#1f1b16", "#4d4438", "#86611f", "#2b2c33")
PAGE_BG = f"url('file://{GFX / 'parchment-dark.jpg'}') no-repeat" if MODE == "pergamen" else "#ffffff"

def ff(fam, file, w=400, st="normal"):
    return f"@font-face {{ font-family: {fam}; src: url('file://{FONTS / file}'); font-weight: {w}; font-style: {st}; }}"

def css():
    fonts = "\n".join([
        ff("EB", "eb-garamond-latin-400-normal.ttf"), ff("EB", "eb-garamond-latin-400-italic.ttf", 400, "italic"),
        ff("EB", "eb-garamond-latin-500-normal.ttf", 500), ff("EB", "eb-garamond-latin-600-normal.ttf", 600),
        ff("EBX", "eb-garamond-latin-ext-400-normal.ttf"), ff("EBX", "eb-garamond-latin-ext-400-italic.ttf", 400, "italic"),
        ff("EBX", "eb-garamond-latin-ext-600-normal.ttf", 600),
        ff("CG", "cormorant-garamond-latin-500-normal.ttf", 500), ff("CG", "cormorant-garamond-latin-600-normal.ttf", 600),
        ff("CG", "cormorant-garamond-latin-400-italic.ttf", 400, "italic"), ff("CG", "cormorant-garamond-latin-600-italic.ttf", 600, "italic"),
        ff("CGX", "cormorant-garamond-latin-ext-500-normal.ttf", 500), ff("CGX", "cormorant-garamond-latin-ext-600-normal.ttf", 600),
        ff("CGX", "cormorant-garamond-latin-ext-400-italic.ttf", 400, "italic"), ff("CGX", "cormorant-garamond-latin-ext-600-italic.ttf", 600, "italic"),
        ff("EBG", "eb-garamond-greek-600-normal.ttf", 400)])
    bgpos = "background-size: 148mm 210mm; background-position: -12.5mm -12.5mm;" if MODE == "pergamen" else ""
    return fonts + f"""
:root {{ --ink:{INK}; --soft:{SOFT}; --gold:{GOLD}; --navy:{NAVY}; }}
@page {{ size: A5; margin: 12.5mm 12.5mm 12.5mm 12.5mm; background: {PAGE_BG}; {bgpos}
  @bottom-center {{ content: counter(page); font-family: CG, CGX; font-weight: 600; font-size: 8.5pt; color: var(--gold); padding-top: 3mm; }}
  @top-center {{ content: string(runner); font-family: CG, CGX; font-style: italic; font-size: 8pt; color: var(--soft); padding-bottom: 2.5mm; }} }}
@page cover {{ margin: 0; background: #1d2431; @bottom-center {{ content: none; }} @top-center {{ content: none; }} }}
@page plain {{ @bottom-center {{ content: none; }} @top-center {{ content: none; }} }}
@page chapterstart {{ @top-center {{ content: none; }} }}
@page cardpage {{ margin: 9mm 9mm 9mm 9mm; background-position: -9mm -9mm; @top-center {{ content: none; }} @bottom-center {{ content: none; }} }}
html {{ font-family: EB, EBX; color: var(--ink); font-size: {BODY_PT}pt; line-height: 1.5; hyphens: auto; hyphenate-character: "-"; font-variant-numeric: lining-nums; }}
body {{ margin: 0; }} a {{ color: inherit; text-decoration: none; }} .orn {{ display: block; margin: 0 auto; }}
.gr {{ font-family: EBG; }}
.chtitle, .chsub, .ptitle, .slogan, .listen, .hero, .warn, .toc, .sect, .sub3, .center, .saltext, .weblead,
.cardin, .cuthint, .titlepage, .cover, .starter, .slist {{ hyphens: manual; }}
.weblead {{ text-align: center !important; margin-top: 4mm; }}
.closing {{ break-before: page; page: chapterstart; text-align: center; padding-top: 30mm; }}
.cfish2 {{ width: 30mm; display: block; margin: 0 auto 6mm; }}
.closing .weblead {{ font-size: 1.05em; margin: 8mm 4mm 8mm; }}
.closing .hero p {{ font-size: 13pt; line-height: 1.5; }}

.cover {{ page: cover; height: 210mm; width: 148mm; position: relative; text-align: center; color: #f6efe0;
  background: url('file://{GFX / "cover.jpg"}') no-repeat center; background-size: cover; }}
.cover .frame {{ position: absolute; top: 8mm; left: 8mm; right: 8mm; bottom: 8mm; border: 1.2pt solid #d9b56a; }}
.cover .frame2 {{ position: absolute; top: 10mm; left: 10mm; right: 10mm; bottom: 10mm; border: .4pt solid rgba(217,181,106,.7); }}
.cover h1 {{ margin: 0; padding-top: 100mm; font-family: CG, CGX; font-weight: 500; font-size: 42pt; letter-spacing: .05em; color: #f8edd2; }}
.cover .sub {{ font-family: CG, CGX; font-style: italic; font-size: 15pt; margin: 3mm 14mm 0; color: #e9dcc0; }}
.cover .verse {{ position: absolute; bottom: 21mm; left: 0; right: 0; font-family: CG, CGX; font-style: italic; font-size: 14pt; color: #e6d2a4; }}

.titlepage {{ page: plain; break-before: page; text-align: center; padding-top: 4mm; }}
.titlepage .tfish {{ width: 30mm; }}
.titlepage h1 {{ font-family: CG, CGX; font-weight: 600; font-size: 30pt; letter-spacing: .05em; margin: 3mm 0 2mm; color: var(--navy); }}
.titlepage .sub {{ font-family: CG, CGX; font-style: italic; font-size: 14pt; color: var(--soft); margin-top: 3mm; }}
.titlepage .author {{ margin-top: 6mm; font-family: CG, CGX; font-weight: 600; letter-spacing: .28em; text-transform: uppercase; font-size: 10.5pt; color: var(--gold); }}
.titlepage .imprint {{ margin: 7mm 0 0; font-size: 10.4pt; line-height: 1.42; color: var(--soft); text-align: center; hyphens: manual; }}
.titlepage .imprint .orn {{ margin-bottom: 4mm; }}
.titlepage .imprint p {{ margin: 0 0 .6em; }}
.nw {{ white-space: nowrap; }}

.toc {{ page: plain; break-before: page; }}
.toc h2 {{ font-family: CG, CGX; font-weight: 600; font-size: 22pt; text-align: center; color: var(--navy); margin: 0 0 1.5mm; letter-spacing: .05em; }}
.toc ol {{ list-style: none; padding: 0; margin: 4mm 0 0; font-size: 13.4pt; line-height: 1.28; }}
.toc li {{ margin: 0 0 2.4mm; break-inside: avoid; }}
.toc li a {{ display: block; padding-right: 10mm; padding-left: 9mm; text-indent: -9mm; position: relative; }}
.toc .tn {{ font-family: CG, CGX; font-weight: 600; color: var(--gold); font-size: 13.5pt; display: inline-block; width: 9mm; text-indent: 0; }}
.toc li a::after {{ content: target-counter(attr(href url), page); font-family: CG, CGX; font-weight: 600; color: var(--soft); position: absolute; right: 0; }}

.intro, .songs, .support {{ break-before: page; page: chapterstart; }}
.support .weblead {{ text-align: left !important; }}
.salvation {{ break-before: page; page: chapterstart; }}
.warnpage {{ break-before: page; padding-top: 38mm; text-align: center; }}
.warnpage .warn {{ text-align: left; font-size: 12.6pt; padding: 5mm 6mm; margin: 0 0 6mm; }}
.warnpage .wt {{ font-size: 15pt; }}
.ptitle {{ font-family: CG, CGX; font-weight: 600; font-size: 22pt; text-align: center; color: var(--navy); margin: 1mm 0 1.5mm; }}
.hero {{ border: none; text-align: center; margin: 3mm 4mm 2mm; padding: 0; }}
.hero p {{ font-size: 11.4pt; }}
.hero p {{ text-align: center !important; }}
.hero .cite {{ text-align: center; }}
.slogan {{ font-family: CG, CGX; font-style: italic; font-weight: 600; font-size: 14pt; text-align: center; color: var(--gold); margin: 2.5mm 3mm 3.5mm; }}
.hl a, .steps a {{ border-bottom: .8pt solid var(--gold); }}
.warn {{ border: .8pt solid rgba(124,90,30,.6); background: rgba(255,250,236,.4); padding: 3mm 4mm; margin-top: 3mm; break-inside: avoid; font-size: 11.6pt; }}
.warn .wt {{ font-family: CG, CGX; font-weight: 600; font-size: 13pt; color: var(--navy); text-align: center; margin-bottom: 1.5mm; }}
.warn p {{ font-style: italic; margin: 0; }}
.sub3 {{ font-family: CG, CGX; font-weight: 600; font-size: 14pt; color: var(--navy); margin: 4mm 0 2mm; }}
.steps {{ margin: 0; padding-left: 5mm; }} .steps li {{ margin-bottom: 1.5mm; }}
.pframe.sal {{ margin: 3mm 0; break-inside: avoid; }}
.center {{ text-align: center; }}

.chapter {{ break-before: page; page: chapterstart; }}
.runner {{ string-set: runner content(); height: 0; margin: 0; font-size: 0; visibility: hidden; }}
.chead {{ text-align: center; margin: 0 0 4mm; }}
.chicon {{ width: 17mm; display: block; margin: 0 auto 2mm; }}
.chnum {{ font-family: CG, CGX; font-weight: 600; font-size: 9.5pt; letter-spacing: .34em; text-transform: uppercase; color: var(--gold); }}
.starter {{ font-family: CG, CGX; font-style: italic; font-weight: 600; font-size: 12pt; color: var(--gold); margin-top: 1mm; }}
.chtitle {{ font-family: CG, CGX; font-weight: 600; font-size: 21pt; line-height: 1.12; color: var(--navy); margin: 1.5mm 2mm 1.2mm; }}
.chsub {{ font-family: CG, CGX; font-style: italic; font-size: 13pt; line-height: 1.3; color: var(--soft); margin: 0 5mm 2.5mm; }}
.body p {{ margin: 0 0 .55em; text-align: justify; orphans: 3; widows: 3; }}
.vign {{ text-align: center; break-inside: avoid; }} .vicon {{ width: 20mm; display: block; margin: 3mm auto; opacity: .9; }}
.tend {{ height: 0; }}
.body p.salute {{ font-style: italic; color: var(--navy); text-align: left; margin-bottom: .7em; }}
.body p.lead {{ break-after: avoid; }}
.drop {{ font-family: CG, CGX; font-weight: 600; float: left; font-size: 3.5em; line-height: .78; padding: .07em .08em 0 0; color: var(--gold); }}
blockquote {{ margin: .8em 1mm .9em 1mm; padding: .03em 0 .03em 4.5mm; border-left: 1.6pt solid var(--gold); break-inside: avoid; }}
blockquote p {{ hyphens: manual; font-style: italic; color: var(--navy); text-align: left !important; margin: 0 0 .2em !important; line-height: 1.45; }}
.cite {{ display: block; font-family: CG, CGX; font-weight: 600; font-size: 10.5pt; letter-spacing: .06em; color: var(--gold); text-align: right; }}

.prayer {{ break-inside: avoid; margin-top: 6mm; }}
.prayer.long {{ break-inside: auto; break-before: page; margin-top: 0; }}
.pframe {{ position: relative; border: .9pt solid rgba(124,90,30,.7); padding: 4mm 5.5mm 2.5mm; background: rgba(255,250,236,.35); }}
.pframe .c {{ position: absolute; width: 15mm; }}
.pframe .tl {{ top: -1.8mm; left: -1.8mm; }} .pframe .tr {{ top: -1.8mm; right: -1.8mm; }}
.pframe .bl {{ bottom: -1.8mm; left: -1.8mm; }} .pframe .br {{ bottom: -1.8mm; right: -1.8mm; }}
.sect {{ font-family: CG, CGX; font-weight: 600; font-size: 1.25em; text-align: center; color: var(--navy); letter-spacing: .08em; margin: 0 0 1mm; }}
.pframe p {{ margin: 0 0 .32em; line-height: 1.37; }}
.afish {{ height: .8em; vertical-align: -.05em; margin-left: 1.5mm; }}
.pframe p.address {{ font-family: CG, CGX; font-weight: 600; font-size: 1.12em; color: var(--navy); margin: 1.5mm 0 .4em; }}
.pframe p.amen {{ font-family: CG, CGX; font-weight: 600; font-size: 1.05em; color: var(--gold); text-align: center; margin: .3em 0 0; letter-spacing: .1em; }}
.endmark {{ text-align: center; margin: .5mm 0; }} .fishend {{ width: 12mm; }}

table.media {{ margin: 2.5mm auto 0; border-collapse: collapse; break-inside: avoid; font-family: CG, CGX; font-weight: 600; font-size: 10.5pt; color: var(--navy); }}
table.media td {{ vertical-align: middle; padding: 0 1.5mm; }}
table.media .ml {{ padding-right: 6mm; max-width: 40mm; line-height: 1.2; }}
table.media a {{ border-bottom: .7pt solid var(--gold); }}
.slist {{ list-style: none; padding: 0; columns: 2; column-gap: 6mm; font-size: 11pt; margin-top: 4mm; }}
.slist li {{ margin-bottom: 1.4mm; break-inside: avoid; }}
.slist a {{ border-bottom: .6pt solid rgba(124,90,30,.55); }}
a.ul, .saltext a {{ border-bottom: .8pt solid var(--gold); }}
a.web {{ display: inline-block; margin-top: 1.5mm; font-family: CG, CGX; font-weight: 600; font-size: 1.08em; color: var(--gold); letter-spacing: .02em; }}
.saltext {{ text-align: center; font-style: italic; margin-top: 4mm; }}
.listen {{ text-align: center !important; font-family: CG, CGX; font-style: italic; font-weight: 600; font-size: .92em; margin: 0 0 1.5mm !important; }}
.listen a {{ color: var(--gold); border-bottom: .7pt solid var(--gold); }}
.slist .tn {{ font-family: CG, CGX; font-weight: 600; color: var(--gold); display: inline-block; width: 6.5mm; }}

.cards {{ page: cardpage; break-before: page; }}
.cuthint {{ font-family: CG, CGX; font-style: italic; font-size: 9pt; color: var(--soft); text-align: center; margin-bottom: 1.5mm; }}
.sc {{ width: 6mm; vertical-align: middle; }}
table.cardgrid {{ width: 100%; border-collapse: collapse; table-layout: fixed; }}
td.card {{ border: 1pt dashed #8a7a60; width: 50%; height: 92mm; vertical-align: top; padding: 0; }}
.cardin {{ padding: 3mm 3.5mm 2mm; text-align: center; font-size: 7.9pt; line-height: 1.32; }}
.cfish {{ width: 9mm; }}
.ctitle {{ font-family: CG, CGX; font-weight: 600; font-size: 11.5pt; color: var(--navy); margin: .5mm 0 1.2mm; }}
.cardin p {{ margin: 0 0 1.2mm; text-align: left; hyphens: auto; }}
.cardin .cintro {{ font-style: italic; }}
.cardin .camen {{ text-align: center; font-family: CG, CGX; font-weight: 600; color: var(--gold); font-size: 9pt; }}
.cardin .cverse {{ text-align: center; font-style: italic; color: var(--navy); }}
.cardin .cverse span {{ display: block; font-style: normal; font-family: CG, CGX; font-weight: 600; color: var(--gold); font-size: 8pt; }}
.cardin .cfoot {{ text-align: center; font-size: 6.6pt; color: var(--soft); margin-top: 1.5mm; }}
"""

def layout(doc_html):
    """Render once and return (document, {element id: (first page, top px, last page, bottom px)})."""
    d = HTML(string=doc_html, base_url=str(HERE)).render()
    pos = {}
    for pi, page in enumerate(d.pages):
        for b in page._page_box.descendants():
            el = getattr(b, "element", None)
            i = el.get("id") if el is not None else None
            if not i: continue
            top, bot = b.position_y, b.position_y + b.margin_height()
            if i not in pos: pos[i] = [pi, top, pi, bot]
            else:
                if pi > pos[i][2] or (pi == pos[i][2] and bot > pos[i][3]): pos[i][2], pos[i][3] = pi, bot
    return d, pos

PAGE_LIMIT = (210 - 12.5) / 25.4 * 96          # bottom of the text area (px)
PAGE_TOP = 12.5 / 25.4 * 96

def aesthetics(pt):
    """Move a lonely paragraph from the bottom of a page to the half-empty last page of the talk,
    then fill large empty page ends (before a prayer that starts on a new page) with a quiet ornament."""
    done_ch = set()
    for it in range(4):
        d, pos = layout(build(pt))
        changed = False
        for cid, c in CH.items():
            if cid in done_ch: continue
            if f"tend{cid}" not in pos or f"prayer{cid}" not in pos: continue
            pe, pp = pos[f"tend{cid}"][0], pos[f"prayer{cid}"][0]
            if pp == pe: continue
            blocks = sorted(((k, v) for k, v in pos.items() if k.startswith(f"b{cid}_")), key=lambda kv: int(kv[0].split("_")[1]))
            last_end = max((v[3] for k, v in blocks if v[2] == pe), default=PAGE_TOP)
            free = PAGE_LIMIT - last_end
            prev = [(k, v) for k, v in blocks if v[2] == pe - 1 and v[0] == pe - 1]
            split = [(k, v) for k, v in blocks if v[0] == pe - 1 and v[2] == pe]
            cand = None
            if split:
                k, v = split[0]
                if v[1] > 0.78 * PAGE_LIMIT and free > (PAGE_LIMIT - v[1]) + 12: cand = [k]
            elif prev:
                k, v = prev[-1]; h = v[3] - v[1]
                if v[1] > 0.72 * PAGE_LIMIT and free >= h + 14 and k not in PUSH:
                    cand = [k]
            if cand and not any(x in PUSH for x in cand):
                PUSH.update(cand); changed = True; done_ch.add(cid)
        if not changed: break
    # ornament in big gaps
    d, pos = layout(build(pt))
    VIGN.clear()
    for cid in CH:
        if f"tend{cid}" not in pos or f"prayer{cid}" not in pos: continue
        pe, pp = pos[f"tend{cid}"][0], pos[f"prayer{cid}"][0]
        if pp == pe: continue
        free = PAGE_LIMIT - pos[f"tend{cid}"][3]
        if free > 150: VIGN[cid] = max(10, (free - 120) / 2)
    d, pos = layout(build(pt))
    return d

if __name__ == "__main__":
    pt = {}
    for it in range(10):
        doc = build(pt)
        HTML(string=doc, base_url=str(HERE)).write_pdf(OUT)
        r = PdfReader(OUT); nd = r.named_destinations
        pg = lambda k: r.get_destination_page_number(nd[k]) if k in nd else None
        bad = [c for c in CH if pg(f"prayer{c}") is not None and pg(f"prayer{c}") != pg(f"prayerend{c}")]
        if not bad: break
        for c in bad:
            if pt.get(c, BODY_PT) <= MIN_PT: LONG.add(c)
            else: pt[c] = max(MIN_PT, round(pt.get(c, BODY_PT) - 0.3, 2))
        bad = [c for c in bad if c not in LONG]
        if not bad and it > 0 and LONG: break
    d = aesthetics(pt)
    d.write_pdf(OUT)
    r = PdfReader(OUT)
    print(f"{OUT.name}: {len(r.pages)} strán; zmenšené modlitby: {pt or 'žiadne'}; dlhé: {sorted(LONG, key=int)}; "
          f"presunuté odseky: {len(PUSH)}; ozdoby v medzerách: {len(VIGN)}")
    if WARN: print("UPOZORNENIE – verše bez odkazu (neznámy názov knihy):", sorted(WARN))
