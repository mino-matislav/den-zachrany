#!/usr/bin/env python3
"""Záverečná strana slovenskej knihy (A5, 300 dpi) — slovenské znenie zadnej obálky EN knihy.
Dve podoby:
  out/gfx/back-sk.jpg       farebná (nočná modrá -> zlaté svitanie, ako predná obálka)
  out/gfx/back-sk-tlac.jpg  čiernobiela na tlač (svetlá strana, ryba v odtieňoch sivej)
Riadky odsekov sa lámu vyvážene (bez osamelého slova na konci) a jednopísmenové
predložky a spojky sa nikdy neocitnú na konci riadka."""
import re
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.merge import Merger
import gfx

HERE = Path(__file__).parent
FONTS = HERE / "out" / "fonts" / "ttf"
MERGED = HERE / "out" / "fonts" / "merged"
GFX = HERE / "out" / "gfx"

W, H = round(148 / 25.4 * 300), round(210 / 25.4 * 300)      # 1748 x 2480
S = H / 2700

HEAD = ["Keď sa ti život rozpadá,", "kam sa obrátiš?"]
P1 = ("Sú noci, keď strach nepustí. Sú dni, keď ťa smútok ťaží viac, než dokážeš uniesť. "
      "Deň Záchrany je miestom, kde nájdeš útechu a nádej v Bohu.")
P2 = ("Každá zo 40 kapitol hovorí do jednej skutočnej situácie: úzkosť a prebdené noci, smrť blízkeho "
      "človeka, starosti o peniaze či o deti, vina, osamelosť, choroba a ďalšie. Každá kapitola prináša "
      "slovo povzbudenia z Písma a modlitbu, ktorá vyjadrí to, čo nosíš v srdci.")
BUL_ALL = ["V časti „Kde začať“ nájdi svoju situáciu a choď rovno na svoju kapitolu",
           "Biblické verše z Evanjelického prekladu",
           "Celá modlitba na konci každej kapitoly",
           "Miesto na vlastné poznámky za každou kapitolou",
           "Krízové linky na Slovensku"]
VERSE = "„Blízky je Hospodin tým, čo sú skrúšeného srdca, a pomáha tým, čo sú ubitého ducha.“"
REF = "ŽALM 34, 19"
WEB = "den-zachrany.vercel.app"


def font(fam, style, size):
    """latin + latin-ext zlúčené do jedného písma (slovenská diakritika)."""
    MERGED.mkdir(parents=True, exist_ok=True)
    out = MERGED / f"{fam}-{style}.ttf"
    if not out.exists():
        Merger().merge([str(FONTS / f"{fam}-latin-{style}.ttf"),
                        str(FONTS / f"{fam}-latin-ext-{style}.ttf")]).save(str(out))
    return ImageFont.truetype(str(out), round(size * S))


NB = "\u00a0"
ONE = re.compile(r"(?<![\wÀ-ɏ])([AaIiKkOoSsUuVvZz]) ")


def words(txt):
    """Slová na lámanie; jednopísmenové predložky/spojky sa prilepia k nasledujúcemu slovu."""
    return ONE.sub(lambda m: m.group(1) + NB, txt).split(" ")


def wrap(d, txt, f, mw):
    def greedy(w):
        out, cur = [], ""
        for x in words(txt):
            t = (cur + " " + x).strip()
            if d.textlength(t.replace(NB, " "), font=f) <= w: cur = t
            else: out.append(cur); cur = x
        return out + [cur]
    n = len(greedy(mw)); lo, hi = 300, mw          # vyvážené riadky: najmenšia šírka s rovnakým počtom riadkov
    while hi - lo > 2:
        m = (lo + hi) / 2
        if len(greedy(m)) <= n: hi = m
        else: lo = m
    return [l.replace(NB, " ") for l in greedy(hi)]


def render(print_mode):
    bul = [b for b in BUL_ALL if print_mode or "poznámky" not in b]
    if print_mode:
        img = np.full((H, W, 3), 255.0)
        TXT, HEADC, ACC, SOFT = (31, 27, 22), (60, 52, 40), (110, 96, 72), (90, 82, 70)
    else:
        y, x = np.mgrid[0:H, 0:W].astype(np.float32)
        t = (y / H)[..., None]
        top, mid, bot = np.array([20, 28, 44]), np.array([42, 56, 82]), np.array([216, 162, 98])
        img = np.where(t < .55, top + (mid - top) * (t / .55), mid + (bot - mid) * np.clip((t - .55) / .45, 0, 1) ** 1.6)
        g = np.exp(-(((x - W / 2) / 1.6) ** 2 + (y - H * 1.02) ** 2) / (2 * (520 * S) ** 2))[..., None]
        img = img * (1 - .6 * g) + np.array([255, 226, 160]) * (.6 * g)
        img += np.random.default_rng(5).normal(0, 2.5, (H, W, 1))
        TXT, HEADC, ACC, SOFT = (250, 243, 224), (222, 190, 110), (236, 212, 150), (20, 28, 44)
    c = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")
    d = ImageDraw.Draw(c)

    H1, B = font("cormorant-garamond", "600-normal", 104), font("eb-garamond", "400-normal", 48)
    V, PR, WF = font("cormorant-garamond", "600-italic", 60), font("cormorant-garamond", "700-normal", 42), font("cormorant-garamond", "600-normal", 46)
    LH, MW = round(70 * S), round(1480 * S)

    def ct(yy, txt, f, fill, sp=0):
        w_ = (sum(d.textlength(ch, font=f) for ch in txt) + sp * (len(txt) - 1)) if sp else d.textlength(txt, font=f)
        xx = W / 2 - w_ / 2
        if sp:
            for ch in txt: d.text((xx, yy), ch, font=f, fill=fill); xx += d.textlength(ch, font=f) + sp
        else: d.text((xx, yy), txt, font=f, fill=fill)

    # malá ryba hore
    fm = gfx.emboss(gfx.pad_mask(gfx.fish_mask(round(300 * S), letters=True, stroke=6.4), 20), depth=5, shadow=.5)
    fy = round(150 * S); c.alpha_composite(fm, (round(W / 2 - fm.width / 2), fy)); d = ImageDraw.Draw(c)

    yy = fy + fm.height + round(40 * S)
    for i, l in enumerate(HEAD): ct(yy + i * round(122 * S), l, H1, HEADC)
    yy += round(300 * S); cx = W / 2
    d.line([(cx - 280 * S, yy), (cx - 36 * S, yy)], fill=HEADC, width=3); d.line([(cx + 36 * S, yy), (cx + 280 * S, yy)], fill=HEADC, width=3)
    q = 13 * S; d.polygon([(cx, yy - q), (cx + q, yy), (cx, yy + q), (cx - q, yy)], outline=HEADC, width=3)
    yy += round(60 * S)
    for p in (P1, P2):
        for l in wrap(d, p, B, MW): ct(yy, l, B, TXT); yy += LH
        yy += round(34 * S)
    yy += round(10 * S)
    blines = [wrap(d, b, B, round(1180 * S)) for b in bul]
    bw = max(d.textlength(l, font=B) for b in blines for l in b); lx = W / 2 - (bw + 40 * S) / 2 + 40 * S
    for b in blines:
        q = 10 * S; cy = yy + 31 * S
        d.polygon([(lx - 26 * S - q, cy), (lx - 26 * S, cy - q), (lx - 26 * S + q, cy), (lx - 26 * S, cy + q)], fill=HEADC)
        for l in b: d.text((lx, yy), l, font=B, fill=TXT); yy += LH
        yy += round(10 * S)
    bullets_end = yy

    vlines = wrap(d, VERSE, V, round(1300 * S)); vh = len(vlines) * round(74 * S) + round(90 * S)
    web_y = round(2470 * S)
    vy = bullets_end + (web_y - bullets_end - vh) / 2
    for i, l in enumerate(vlines): ct(vy + i * round(74 * S), l, V, ACC)
    ct(vy + len(vlines) * round(74 * S) + round(14 * S), REF, PR, ACC, sp=8 * S)
    ct(web_y, WEB, WF, SOFT, sp=4 * S)

    out = GFX / ("back-sk-tlac.jpg" if print_mode else "back-sk.jpg")
    im = c.convert("L") if print_mode else c.convert("RGB")
    im.save(out, quality=93, dpi=(300, 300))
    print(f"{out.name}: odrážky končia {bullets_end}, verš {round(vy)}–{round(vy + vh)}, web {web_y}")


if __name__ == "__main__":
    for pm in ((True,) if "tlac" in sys.argv else (False,) if "farba" in sys.argv else (False, True)):
        render(pm)
