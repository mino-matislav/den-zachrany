#!/usr/bin/env python3
"""Raster graphics for the e-book: parchment pages, cover, embossed gold icons."""
import math
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from fontTools.ttLib import TTFont

HERE = Path(__file__).parent
G = HERE / "out" / "gfx"; G.mkdir(parents=True, exist_ok=True)
FONTS = HERE / "out" / "fonts"
rng = np.random.default_rng(11)

def greek_font(size):
    ttf = FONTS / "ttf" / "eb-garamond-greek-600-normal.ttf"
    if not ttf.exists():
        src = next(p for p in FONTS.glob("fontsource-eb-garamond-*") if p.is_dir()) / "files" / "eb-garamond-greek-600-normal.woff"
        t = TTFont(src); t.flavor = None; t.save(ttf)
    return ImageFont.truetype(str(ttf), size)

def smooth_noise(h, w, scale, octaves=4):
    acc = np.zeros((h, w), np.float32); amp = 1.0; tot = 0
    for o in range(octaves):
        s = max(2, int(scale / (2 ** o)))
        small = rng.random((h // s + 2, w // s + 2)).astype(np.float32)
        im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        acc += np.asarray(im, np.float32) / 255 * amp; tot += amp; amp *= 0.5
    return acc / tot

def fibers(h, w, n=900):
    im = Image.new("L", (w, h), 0); d = ImageDraw.Draw(im)
    for _ in range(n):
        x, y = rng.random() * w, rng.random() * h
        L = rng.uniform(20, 120); a = rng.uniform(0, math.pi)
        d.line([(x, y), (x + L * math.cos(a), y + L * math.sin(a))], fill=int(rng.uniform(40, 120)), width=1)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(0.8)), np.float32) / 255

def parchment(w=1800, h=2700, dark=True, name="parchment.jpg"):
    """Light cream paper with a rough, slightly raised grain (like handmade paper / fine wood grain)."""
    base = np.array([232, 216, 184] if dark else [246, 239, 224], np.float32)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    # height map: coarse fibres + directional grain + fine tooth
    grain_src = rng.random((h // 3 + 2, w // 60 + 2)).astype(np.float32)
    grain = np.asarray(Image.fromarray((grain_src * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
    warp = smooth_noise(h, w, 700, 3)
    grain = np.sin((y / h * 140 + warp * 14 + grain * 2.2) * math.pi) * 0.5 + 0.5
    tooth = smooth_noise(h, w, 6, 2)
    fib = fibers(h, w, 2600)
    height = 0.45 * grain + 0.35 * tooth + 0.6 * fib + 0.4 * smooth_noise(h, w, 120, 3)
    hm = Image.fromarray((np.clip(height / height.max(), 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    hmap = np.asarray(hm, np.float32) / 255
    gy, gx = np.gradient(hmap)
    shade = np.clip(-(gx * -0.7 + gy * -0.7) * 9, -1, 1)          # light from top-left
    tone = smooth_noise(h, w, 900, 3)
    img = base[None, None, :] * (0.95 + 0.06 * tone[..., None]) * (1 + 0.075 * shade[..., None])
    img -= 10 * fib[..., None] * np.array([0.5, 0.7, 1.0])
    d = np.sqrt(((x - w / 2) / (w * 0.58)) ** 2 + ((y - h / 2) / (h * 0.58)) ** 2)
    vig = np.clip((d - 0.7) / 0.5, 0, 1) ** 1.8
    img = img * (1 - 0.22 * vig[..., None]) + np.array([150, 112, 64]) * (0.22 * vig[..., None])
    img += rng.normal(0, 1.6, (h, w, 1))
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(G / name, quality=88)

def emboss(mask, gold=True, light=(-1, -1), depth=6.0, shadow=0.55, color=None):
    """mask: L image (255 = shape). Returns RGBA embossed metallic shape with soft shadow."""
    m = np.asarray(mask, np.float32) / 255
    h, w = m.shape
    bump = np.asarray(mask.filter(ImageFilter.GaussianBlur(max(2, w / 260))), np.float32) / 255
    gy, gx = np.gradient(bump)
    lx, ly = light; ln = math.hypot(lx, ly); lx, ly = lx / ln, ly / ln
    shade = np.clip(-(gx * lx + gy * ly) * depth * 40, -1, 1)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    t = np.clip((x / w * 0.6 + y / h * 0.4), 0, 1)
    if color is None:
        c0, c1, c2 = np.array([250, 230, 172]), np.array([205, 158, 78]), np.array([138, 98, 40])
    else:
        c0, c1, c2 = color
    metal = np.where(t[..., None] < 0.5, c0 + (c1 - c0) * (t[..., None] / 0.5), c1 + (c2 - c1) * ((t[..., None] - 0.5) / 0.5))
    band = 0.5 + 0.5 * np.sin((x * 0.6 + y) / max(w, h) * 9)
    metal = metal * (0.88 + 0.16 * band[..., None])
    rgb = metal * (1 + 0.55 * shade[..., None])
    rgb = np.clip(rgb, 0, 255)
    alpha = m
    # soft drop shadow + raised paper halo
    off = int(max(2, w / 220))
    sh = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(off * 1.8))
    sh = np.roll(np.roll(np.asarray(sh, np.float32) / 255, off, 0), off, 1)
    out = np.zeros((h, w, 4), np.float32)
    sa = sh * shadow * (1 - alpha)
    out[..., :3] = rgb * alpha[..., None] + np.array([45, 28, 10]) * sa[..., None] / np.maximum(alpha + sa, 1e-6)[..., None] * (1 - alpha[..., None])
    out[..., 3] = np.clip(alpha + sa, 0, 1) * 255
    out[..., :3] = np.where(alpha[..., None] > 0, rgb, np.array([45, 28, 10]))
    return Image.fromarray(out.astype(np.uint8), "RGBA")

def poly(d, pts, w, fill=255):
    """Stroke a polyline by stamping discs densely -> smooth, round, notch-free lines."""
    pts = [tuple(map(float, q)) for q in pts]
    r = w / 2.0
    for (x0, y0), (x1, y1) in zip(pts[:-1], pts[1:]):
        L = math.hypot(x1 - x0, y1 - y0); n = max(1, int(L / max(1.0, r / 3)))
        for i in range(n + 1):
            x = x0 + (x1 - x0) * i / n; y = y0 + (y1 - y0) * i / n
            d.ellipse([x - r, y - r, x + r, y + r], fill=fill)

def bez(p0, p1, p2, p3, n=200):
    t = np.linspace(0, 1, n)[:, None]
    return ((1 - t) ** 3) * p0 + 3 * ((1 - t) ** 2) * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3

def fish_mask(W, letters=False, stroke=7.0):
    """Web logo geometry (viewBox 120x56), rendered at width W."""
    s = W / 120.0; H = int(56 * s) + int(stroke * s) * 2; pad = stroke * s
    big = 4
    im = Image.new("L", (W * big, H * big), 0); d = ImageDraw.Draw(im)
    def P(pts): return [((x * s + 0) * big, (y * s + pad) * big) for x, y in pts]
    up = bez(np.array([6, 28.]), np.array([26, 4.]), np.array([62, 4.]), np.array([84, 28.]))
    lo = bez(np.array([6, 28.]), np.array([26, 52.]), np.array([62, 52.]), np.array([84, 28.]))
    sw = int(stroke * s * big)
    for seg in (up, lo, np.array([[84, 28], [111, 10]]), np.array([[84, 28], [111, 46]])):
        pts = P(seg); poly(d, pts, sw)
    if letters:
        f = greek_font(int(13.5 * s * big))
        txt = "ΙΧΘΥΣ"
        bb = d.textbbox((0, 0), txt, font=f)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        cx, cy = 44 * s * big, (28 * s + pad) * big
        d.text((cx - tw / 2 - bb[0], cy - th / 2 - bb[1]), txt, font=f, fill=255)
    return im.resize((W, H), Image.LANCZOS)

def pad_mask(m, p):
    w, h = m.size; im = Image.new("L", (w + 2 * p, h + 2 * p), 0); im.paste(m, (p, p)); return im

def save_icon(mask, name, **kw):
    emboss(pad_mask(mask, int(mask.size[0] * 0.06) + 6), **kw).save(G / name)

def icon_canvas(S=600):
    im = Image.new("L", (S * 4, S * 4), 0); return im, ImageDraw.Draw(im), S * 4

def icon_sunrise():
    im, d, S = icon_canvas(); w = int(S * 0.035)
    cx, cy, r = S / 2, S * 0.62, S * 0.22
    d.arc([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=255, width=w)
    poly(d, [(S * 0.12, cy), (S * 0.88, cy)], w)
    for a in range(200, 341, 20):
        ra = math.radians(a)
        d.line([(cx + (r + S * 0.06) * math.cos(ra), cy + (r + S * 0.06) * math.sin(ra)),
                (cx + (r + S * 0.15) * math.cos(ra), cy + (r + S * 0.15) * math.sin(ra))], fill=255, width=w)
    poly(d, [(S * 0.3, cy + S * 0.09), (S * 0.7, cy + S * 0.09)], w)
    return im.resize((600, 600), Image.LANCZOS).crop((40, 120, 560, 470))

def icon_shield():
    im, d, S = icon_canvas(); w = int(S * 0.035)
    top, bot = S * 0.14, S * 0.88
    pts = bez(np.array([S * .5, bot]), np.array([S * .18, S * .72]), np.array([S * .2, S * .4]), np.array([S * .2, top + S * .06]))
    pts2 = bez(np.array([S * .5, bot]), np.array([S * .82, S * .72]), np.array([S * .8, S * .4]), np.array([S * .8, top + S * .06]))
    poly(d, [tuple(p) for p in pts], w)
    poly(d, [tuple(p) for p in pts2], w)
    poly(d, [(S * .2, top + S * .06), (S * .5, top), (S * .8, top + S * .06)], w)
    k = 0.84
    inner = lambda P: [(S * .5 + (x - S * .5) * k, S * .5 + (y - S * .5) * k) for x, y in P]
    poly(d, inner([tuple(p) for p in pts]), int(w * .55)); poly(d, inner([tuple(p) for p in pts2]), int(w * .55))
    poly(d, inner([(S * .2, top + S * .06), (S * .5, top), (S * .8, top + S * .06)]), int(w * .55))
    return im.resize((600, 600), Image.LANCZOS).crop((90, 60, 510, 560))

def icon_book():
    im, d, S = icon_canvas(); w = int(S * 0.04)
    for side in (-1, 1):
        p = bez(np.array([S * .5, S * .32]), np.array([S * (.5 + side * .12), S * .24]), np.array([S * (.5 + side * .3), S * .24]), np.array([S * (.5 + side * .4), S * .3]))
        q = bez(np.array([S * .5, S * .78]), np.array([S * (.5 + side * .12), S * .7]), np.array([S * (.5 + side * .3), S * .7]), np.array([S * (.5 + side * .4), S * .76]))
        poly(d, [tuple(x) for x in p], w)
        poly(d, [tuple(x) for x in q], w)
        poly(d, [tuple(p[-1]), tuple(q[-1])], w)
    poly(d, [(S * .5, S * .32), (S * .5, S * .78)], w)
    return im.resize((600, 600), Image.LANCZOS).crop((40, 110, 560, 500))

def corner():
    im, d, S = icon_canvas(); w = int(S * 0.03)
    poly(d, [(S * .08, S * .92), (S * .08, S * .08), (S * .92, S * .08)], w)
    d.arc([S * .08, S * .08, S * .62, S * .62], 180, 270, fill=255, width=int(w * .8))
    d.ellipse([S * .2, S * .2, S * .3, S * .3], fill=255)
    for k in (.45, .7):
        poly(d, [(S * .08, S * k), (S * .16, S * k)], int(w * .7))
        poly(d, [(S * k, S * .08), (S * k, S * .16)], int(w * .7))
    return im.resize((300, 300), Image.LANCZOS)

def cover(W=1800, H=2700):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    cx, cy = W / 2, H * 0.40
    d = np.clip(np.sqrt(((x - cx) / (W * .75)) ** 2 + ((y - cy) / (H * .62)) ** 2), 0, 1)
    c0, c1, c2 = np.array([104, 120, 142]), np.array([60, 74, 96]), np.array([28, 35, 48])
    t = d[..., None]
    img = np.where(t < .5, c0 + (c1 - c0) * (t / .5), c1 + (c2 - c1) * ((t - .5) / .5))
    gx, gy = W / 2, H * 0.235
    for sig, k, col in ((260, .55, [243, 223, 168]), (520, .20, [217, 181, 106])):
        g = np.exp(-(((x - gx) / 1.35) ** 2 + (y - gy) ** 2) / (2 * sig ** 2))
        img = img * (1 - k * g[..., None]) + np.array(col) * (k * g[..., None])
    img += rng.normal(0, 3, (H, W, 1))
    vg = np.clip(np.sqrt(((x - W / 2) / (W * .62)) ** 2 + ((y - H / 2) / (H * .62)) ** 2) - .55, 0, 1) / .45
    img *= (1 - .35 * vg[..., None])
    bg = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")
    fm = fish_mask(1040, letters=True, stroke=6.2)
    fish = emboss(pad_mask(fm, 40), depth=7, shadow=.65)
    bg.alpha_composite(fish, (int(W / 2 - fish.size[0] / 2 + 0.03 * fish.size[0]), int(gy - fish.size[1] / 2)))
    bg.convert("RGB").save(G / "cover.jpg", quality=92)

if __name__ == "__main__":
    parchment(dark=True, name="parchment-dark.jpg")
    parchment(dark=False, name="parchment-light.jpg")
    cover()
    save_icon(fish_mask(700, stroke=8), "fish-end.png")
    save_icon(icon_sunrise(), "icon-sunrise.png")
    save_icon(icon_shield(), "icon-shield.png")
    save_icon(icon_book(), "icon-book.png")
    m = corner()
    for name, t in (("tl", None), ("tr", Image.FLIP_LEFT_RIGHT), ("bl", Image.FLIP_TOP_BOTTOM), ("br", Image.ROTATE_180)):
        save_icon(m if t is None else m.transpose(t), f"corner-{name}.png")
    print("gfx ok")
