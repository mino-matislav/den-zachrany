#!/usr/bin/env python3
"""Obálka slovenskej knihy (A5) v rovnakom dizajne ako anglická: nočná modrá -> zlaté svitanie,
hore verš, v strede zlatá ryba ΙΧΘΥΣ v jemnej žiare (presne vycentrovaná podľa zlatého tela, rovnaké
medzery nad aj pod ňou), názov, podnadpis a autor. Výstup: out/gfx/cover-sk.jpg (300 dpi)."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.merge import Merger
import sys
import gfx

HERE = Path(__file__).parent
FONTS = HERE / "out" / "fonts" / "ttf"
OUT = HERE / "out" / "gfx" / "cover-sk.jpg"
OUT_TLAC = HERE / "out" / "gfx" / "cover-sk-tlac.jpg"     # svetlá čiernobiela verzia na tlač
MERGED = HERE / "out" / "fonts" / "merged"

VERSE = "„Ajhľa, teraz je deň spasenia!“"          # 2. Korintským 6, 2 (Evanjelický preklad)
REF = "2. KORINTSKÝM 6, 2"
TITLE = "Deň Záchrany"
SUB = ["Slová nádeje a modlitby", "pre ťažké chvíle"]
AUTHOR = "TÍM DŇA ZÁCHRANY"

W, H = round(148 / 25.4 * 300), round(210 / 25.4 * 300)      # 1748 x 2480
S = H / 2700                                                    # mierka voči anglickej obálke (9 palcov = 2700 px)
GOLD, LIGHT, CREAM, NAVY = (222, 190, 110), (236, 212, 150), (250, 243, 224), (20, 28, 44)


def font(style, size):
    """Cormorant Garamond latin + latin-ext zlúčené do jedného písma (slovenská diakritika)."""
    MERGED.mkdir(parents=True, exist_ok=True)
    out = MERGED / f"cg-{style}.ttf"
    if not out.exists():
        Merger().merge([str(FONTS / f"cormorant-garamond-latin-{style}.ttf"),
                        str(FONTS / f"cormorant-garamond-latin-ext-{style}.ttf")]).save(str(out))
    return ImageFont.truetype(str(out), round(size * S))


def main(print_mode=False):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    t = (y / H)[..., None]
    top, mid, bot = np.array([20, 28, 44]), np.array([42, 56, 82]), np.array([216, 162, 98])
    img = np.where(t < .55, top + (mid - top) * (t / .55), mid + (bot - mid) * np.clip((t - .55) / .45, 0, 1) ** 1.6)

    def gauss(cx, cy, sig, sx=1.6):
        return np.exp(-(((x - cx) / sx) ** 2 + (y - cy) ** 2) / (2 * sig ** 2))[..., None]

    g = gauss(W / 2, H * 1.02, 520 * S); img = img * (1 - .6 * g) + np.array([255, 226, 160]) * (.6 * g)
    if print_mode: img = np.full((H, W, 3), 255.0)

    D = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    vf, rf, tf = font("600-italic", 84), font("600-normal", 46), font("600-normal", 250)
    sf, af = font("500-italic", 94), font("700-normal", 68)
    VY, RY, TY = round(190 * S), round(300 * S), round(1318 * S)
    sp_ref, sp_aut = 8 * S, 12 * S

    # ryba: viditeľné zlaté telo o 16 % širšie ako verš
    vw = D.textlength(VERSE, font=vf); w = 1000
    for _ in range(6):
        fc = gfx.emboss(gfx.pad_mask(gfx.fish_mask(w, letters=True, stroke=6.4), 40), depth=7, shadow=.65)
        a = np.array(fc).astype(int)
        gm = (a[..., 3] > 200) & (a[..., 0] > 150) & (a[..., 1] > 110) & (a[..., 0] > a[..., 2] + 40)
        ys, xs = np.nonzero(gm); w = int(w * (vw * 1.16) / (xs.max() - xs.min() + 1))
    gx0, gx1, gy0, gy1 = xs.min(), xs.max(), ys.min(), ys.max()
    ref_bottom = max(D.textbbox((0, RY), c, font=rf)[3] for c in REF if c != " ")
    title_top = D.textbbox((0, TY), "D", font=tf)[1]
    gap = (title_top - ref_bottom - (gy1 - gy0 + 1)) / 2
    fy = int(round(ref_bottom + gap - gy0)); fx = int(round(W / 2 - (gx0 + gx1 + 1) / 2))
    for sig, k, col in (() if print_mode else ((230 * 1.1 * S, .50, [243, 223, 168]), (470 * 1.1 * S, .18, [217, 181, 106]))):
        g = gauss(W / 2, fy + (gy0 + gy1) / 2, sig, 1.35); img = img * (1 - k * g) + np.array(col) * (k * g)
    if not print_mode: img += np.random.default_rng(3).normal(0, 2.5, (H, W, 1))
    c = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")
    c.alpha_composite(fc, (fx, fy)); d = ImageDraw.Draw(c)

    def ct(yy, txt, f, fill, sp=0, shadow=None):
        w_ = (sum(d.textlength(ch, font=f) for ch in txt) + sp * (len(txt) - 1)) if sp else d.textlength(txt, font=f)
        xx = W / 2 - w_ / 2
        if sp:
            for ch in txt: d.text((xx, yy), ch, font=f, fill=fill); xx += d.textlength(ch, font=f) + sp
        else:
            if shadow: d.text((xx + 3 * S, yy + 4 * S), txt, font=f, fill=shadow)
            d.text((xx, yy), txt, font=f, fill=fill)

    gold, light, cream, navy = ((60, 52, 40), (90, 82, 70), (60, 52, 40), (31, 27, 22)) if print_mode else (GOLD, LIGHT, CREAM, NAVY)
    ct(VY, VERSE, vf, light); ct(RY, REF, rf, light, sp=sp_ref)
    ct(TY, TITLE, tf, gold, shadow=None if print_mode else (10, 14, 24))
    ry = TY + 250 * 1.38 * S; cx = W / 2
    d.line([(cx - 350 * S, ry), (cx - 40 * S, ry)], fill=gold, width=4); d.line([(cx + 40 * S, ry), (cx + 350 * S, ry)], fill=gold, width=4)
    q = 16 * S; d.polygon([(cx, ry - q), (cx + q, ry), (cx, ry + q), (cx - q, ry)], outline=gold, width=4)
    ct(ry + 80 * S, SUB[0], sf, cream); ct(ry + 192 * S, SUB[1], sf, cream)
    ct(round(2420 * S), AUTHOR, af, navy, sp=sp_aut)
    (c.convert("L") if print_mode else c.convert("RGB")).save(OUT_TLAC if print_mode else OUT, quality=93, dpi=(300, 300))
    print(f"{(OUT_TLAC if print_mode else OUT).name}: {W}x{H}; ryba zľava/sprava {fx + gx0}/{W - (fx + gx1 + 1)} px; "
          f"medzera nad/pod rybou {fy + gy0 - ref_bottom}/{title_top - (fy + gy1 + 1)} px")


if __name__ == "__main__":
    main()
    main(print_mode=True)
