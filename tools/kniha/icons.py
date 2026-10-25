#!/usr/bin/env python3
"""Embossed gold line icons: biblical, non-figurative motifs (no depictions of God, people, angels, crosses)."""
import math, sys
import numpy as np
from PIL import Image, ImageDraw
import gfx
from gfx import poly, bez, save_icon

S = 2400
W = int(S * 0.034)

def canvas():
    im = Image.new("L", (S, S), 0); return im, ImageDraw.Draw(im)

def B(*p, n=300): return [tuple(q) for q in bez(*[np.array(x, float) for x in p], n=n)]
def P(x, y): return (x * S, y * S)
def circle(d, cx, cy, r, w=W):
    pts = [(cx + r * math.cos(t), cy + r * math.sin(t)) for t in np.linspace(0, 2 * math.pi, 400)]
    poly(d, pts, w)
def arc(d, cx, cy, r, a0, a1, w=W):
    pts = [(cx + r * math.cos(math.radians(t)), cy + r * math.sin(math.radians(t))) for t in np.linspace(a0, a1, 300)]
    poly(d, pts, w)
def done(im):
    box = im.getbbox(); m = int(S * 0.02)
    return im.crop((box[0] - m, box[1] - m, box[2] + m, box[3] + m)).resize(
        (int((box[2] - box[0] + 2 * m) / 4), int((box[3] - box[1] + 2 * m) / 4)), Image.LANCZOS)

def anchor():
    im, d = canvas()
    circle(d, S*.5, S*.18, S*.06)
    poly(d, [P(.5, .24), P(.5, .84)], W)
    poly(d, [P(.36, .34), P(.64, .34)], W)
    arc(d, S*.5, S*.56, S*.28, 20, 160)
    for sx in (-1, 1):
        x = S*.5 + sx * S*.28*math.cos(math.radians(20)); y = S*.56 + S*.28*math.sin(math.radians(20))
        poly(d, [(x, y), (x + sx * S*.035, y - S*.07)], W); poly(d, [(x, y), (x - sx * S*.06, y - S*.025)], W)
    return done(im)

def lamp():  # oil lamp (Ps 119:105) with flame
    im, d = canvas()
    body = B((S*.18, S*.62), (S*.25, S*.80), (S*.70, S*.80), (S*.80, S*.60))
    top = B((S*.18, S*.62), (S*.35, S*.52), (S*.62, S*.52), (S*.80, S*.60))
    poly(d, body, W); poly(d, top, W)
    poly(d, B((S*.80, S*.60), (S*.88, S*.55), (S*.90, S*.52), (S*.86, S*.50)), W)
    arc(d, S*.17, S*.66, S*.07, 90, 270)
    poly(d, [P(.43, .79), P(.40, .88), P(.62, .88), P(.59, .79)], W)
    fl = B((S*.86, S*.47), (S*.80, S*.38), (S*.86, S*.30), (S*.88, S*.22)) + B((S*.88, S*.22), (S*.94, S*.32), (S*.95, S*.40), (S*.86, S*.47))
    poly(d, fl, int(W*.8))
    return done(im)

def path():  # road leading to the horizon with the rising sun
    im, d = canvas()
    poly(d, [P(.08, .42), P(.92, .42)], int(W*.8))
    arc(d, S*.5, S*.42, S*.13, 180, 360, int(W*.8))
    poly(d, [P(.47, .44), P(.16, .88)], W); poly(d, [P(.53, .44), P(.84, .88)], W)
    for y0, y1 in ((.50, .55), (.62, .69), (.77, .86)):
        poly(d, [P(.5, y0), P(.5, y1)], int(W*.7))
    return done(im)

def mountain():  # rock / mountain (Ps 18:3; Ps 121)
    im, d = canvas()
    poly(d, [P(.06, .82), P(.36, .34), P(.50, .52), P(.62, .28), P(.94, .82), P(.06, .82)], W)
    poly(d, [P(.31, .42), P(.36, .48), P(.41, .42)], int(W*.7))
    poly(d, [P(.56, .38), P(.62, .45), P(.68, .38)], int(W*.7))
    return done(im)

def olive():  # olive branch with clear leaves
    im, d = canvas()
    stem = B((S*.14, S*.86), (S*.36, S*.62), (S*.56, S*.42), (S*.86, S*.16))
    poly(d, stem, W)
    def leaf_at(x, y, ang, L):
        ex, ey = x + L*math.cos(ang), y + L*math.sin(ang)
        mx, my = (x+ex)/2, (y+ey)/2; nx, ny = -(ey-y)*.32, (ex-x)*.32
        poly(d, B((x, y), (mx+nx, my+ny), (ex-(ex-x)*.15+nx*.3, ey-(ey-y)*.15+ny*.3), (ex, ey)) +
                B((ex, ey), (ex-(ex-x)*.15-nx*.3, ey-(ey-y)*.15-ny*.3), (mx-nx, my-ny), (x, y)), int(W*.7))
    base = math.atan2(-(.86-.16), (.86-.14))
    for i, t in enumerate(np.linspace(.10, .85, 6)):
        x, y = stem[int(t*299)]
        side = 1 if i % 2 else -1
        leaf_at(x, y, base + side*0.85, S*.17)
    leaf_at(*stem[-1], base, S*.12)
    return done(im)

def wheat():
    im, d = canvas()
    for dx, tilt in ((-.13, -.12), (0, 0), (.13, .12)):
        x0 = .5 + dx; stem = [P(x0 - tilt*.2, .9), P(x0 + tilt*.6, .35)]
        poly(d, stem, int(W*.8))
        for k in range(5):
            y = .55 - k * .07; cx = x0 + tilt * (.9 - y) * 1.1
            for s in (-1, 1):
                poly(d, B((S*cx, S*y), (S*(cx + s*.05), S*(y - .02)), (S*(cx + s*.06), S*(y - .06)), (S*(cx + s*.02), S*(y - .09))) +
                        B((S*(cx + s*.02), S*(y - .09)), (S*(cx + s*.005), S*(y - .05)), (S*cx, S*(y - .03)), (S*cx, S*y)), int(W*.55))
    return done(im)

def heart():
    im, d = canvas()
    poly(d, B((S*.5, S*.85), (S*.10, S*.58), (S*.12, S*.20), (S*.5, S*.34)) + B((S*.5, S*.34), (S*.88, S*.20), (S*.90, S*.58), (S*.5, S*.85)), W)
    return done(im)

def house():
    im, d = canvas()
    poly(d, [P(.14, .48), P(.5, .16), P(.86, .48)], W)
    poly(d, [P(.24, .40), P(.24, .84), P(.76, .84), P(.76, .40)], W)
    poly(d, [P(.42, .84), P(.42, .62), P(.58, .62), P(.58, .84)], int(W*.8))
    poly(d, [P(.29, .52), P(.37, .52), P(.37, .60), P(.29, .60), P(.29, .52)], int(W*.6))
    poly(d, [P(.63, .52), P(.71, .52), P(.71, .60), P(.63, .60), P(.63, .52)], int(W*.6))
    return done(im)

def chain():  # broken chain (Gal 5:1 freedom)
    im, d = canvas()
    def link(cx, cy, ang, w=W):
        a, b = S*.11, S*.06; ca, sa = math.cos(ang), math.sin(ang)
        pts = [(cx + a*math.cos(t)*ca - b*math.sin(t)*sa, cy + a*math.cos(t)*sa + b*math.sin(t)*ca) for t in np.linspace(0, 2*math.pi, 300)]
        poly(d, pts, w)
    link(S*.22, S*.66, -.6); link(S*.36, S*.56, -.6)
    link(S*.64, S*.44, -.6); link(S*.78, S*.34, -.6)
    for x, y, s in ((.47, .50, 1), (.53, .50, -1)):
        poly(d, [P(x, y - .06), P(x - s*.02, y - .11)], int(W*.6)); poly(d, [P(x, y + .06), P(x + s*.02, y + .11)], int(W*.6))
    return done(im)

def jar():  # clay jar (2 Cor 4:7)
    im, d = canvas()
    poly(d, [P(.40, .18), P(.60, .18)], W)
    poly(d, B((S*.42, S*.18), (S*.42, S*.28), (S*.24, S*.34), (S*.24, S*.56)) + B((S*.24, S*.56), (S*.24, S*.80), (S*.40, S*.86), (S*.5, S*.86)), W)
    poly(d, B((S*.58, S*.18), (S*.58, S*.28), (S*.76, S*.34), (S*.76, S*.56)) + B((S*.76, S*.56), (S*.76, S*.80), (S*.60, S*.86), (S*.5, S*.86)), W)
    poly(d, [P(.30, .44), P(.70, .44)], int(W*.55)); poly(d, [P(.28, .66), P(.72, .66)], int(W*.55))
    return done(im)

def rings():
    im, d = canvas()
    circle(d, S*.40, S*.55, S*.20); circle(d, S*.60, S*.55, S*.20)
    return done(im)

def tree():  # young tree with shoots (Ps 128:3)
    im, d = canvas()
    poly(d, [P(.5, .88), P(.5, .50)], int(W*1.1))
    poly(d, [P(.5, .64), P(.38, .54)], int(W*.8)); poly(d, [P(.5, .58), P(.63, .48)], int(W*.8))
    cx, cy, R = S*.5, S*.32, S*.22
    pts = []
    for t in np.linspace(0, 2*math.pi, 600):
        r = R*(1 + .09*math.cos(7*t))
        pts.append((cx + r*math.cos(t), cy + r*.82*math.sin(t)))
    poly(d, pts, W)
    poly(d, [P(.30, .88), P(.70, .88)], int(W*.8))
    for x, s2 in ((.38, -1), (.62, 1)):
        poly(d, B((S*x, S*.88), (S*x, S*.82), (S*(x+s2*.03), S*.79), (S*(x+s2*.05), S*.78)), int(W*.6))
    return done(im)

def scales():  # balance (God judges justly, Rom 12:19)
    im, d = canvas()
    poly(d, [P(.5, .16), P(.5, .84)], W); poly(d, [P(.34, .84), P(.66, .84)], W)
    poly(d, [P(.16, .28), P(.84, .28)], W); circle(d, S*.5, S*.16, S*.025, int(W*.7))
    for x in (.22, .78):
        poly(d, [P(x, .28), P(x - .10, .58)], int(W*.55)); poly(d, [P(x, .28), P(x + .10, .58)], int(W*.55))
        arc(d, S*x, S*.58, S*.11, 0, 180, int(W*.8))
    return done(im)

def leaf():  # leaf (Rev 22:2 healing)
    im, d = canvas()
    poly(d, B((S*.2, S*.8), (S*.15, S*.40), (S*.45, S*.18), (S*.82, S*.16)) + B((S*.82, S*.16), (S*.80, S*.50), (S*.58, S*.80), (S*.2, S*.8)), W)
    mid = B((S*.2, S*.8), (S*.40, S*.58), (S*.60, S*.38), (S*.78, S*.20)); poly(d, mid, int(W*.7))
    for t in (.25, .45, .65):
        x, y = mid[int(t*299)]
        poly(d, [(x, y), (x + S*.10, y + S*.02)], int(W*.5)); poly(d, [(x, y), (x - S*.02, y - S*.10)], int(W*.5))
    poly(d, [P(.2, .8), P(.12, .9)], int(W*.8))
    return done(im)

def water():  # spring / streams (Ps 42:2)
    im, d = canvas()
    poly(d, B((S*.5, S*.12), (S*.36, S*.34), (S*.30, S*.46), (S*.30, S*.54)) + B((S*.30, S*.54), (S*.30, S*.68), (S*.40, S*.74), (S*.5, S*.74)) +
         B((S*.5, S*.74), (S*.60, S*.74), (S*.70, S*.68), (S*.70, S*.54)) + B((S*.70, S*.54), (S*.70, S*.46), (S*.64, S*.34), (S*.5, S*.12)), W)
    for y in (.84, .92):
        poly(d, [(S*(.14 + i*.012), S*(y + .02*math.sin(i*.55))) for i in range(60)], int(W*.7))
    return done(im)

def sunrise(): return gfx.icon_sunrise()
def shield(): return gfx.icon_shield()
def book(): return gfx.icon_book()

ICONS = dict(anchor=anchor, lamp=lamp, path=path, mountain=mountain, olive=olive, wheat=wheat, heart=heart, house=house,
             chain=chain, jar=jar, rings=rings, tree=tree, scales=scales, leaf=leaf, water=water, sunrise=sunrise, shield=shield, book=book)

def note():  # music note for song links (small)
    im, d = canvas()
    poly(d, [P(.62, .18), P(.62, .70)], W); poly(d, B((S*.62, S*.18), (S*.75, S*.24), (S*.82, S*.32), (S*.78, S*.44)), W)
    pts = [(S*.50 + S*.12*math.cos(t)*math.cos(-.4) - S*.08*math.sin(t)*math.sin(-.4), S*.72 + S*.12*math.cos(t)*math.sin(-.4) + S*.08*math.sin(t)*math.cos(-.4)) for t in np.linspace(0, 2*math.pi, 200)]
    d.polygon(pts, fill=255)
    return done(im)

def scissors():
    im, d = canvas()
    circle(d, S*.22, S*.36, S*.09); circle(d, S*.22, S*.64, S*.09)
    poly(d, [P(.29, .41), P(.86, .58)], W); poly(d, [P(.29, .59), P(.86, .42)], W)
    return done(im)

if __name__ == "__main__":
    for k, f in ICONS.items():
        if k in ("sunrise", "shield", "book"):
            continue
        save_icon(f(), f"icon-{k}.png")
    save_icon(note(), "icon-note.png")
    m = scissors(); c = Image.new("RGBA", m.size, (110, 90, 60, 255)); c.putalpha(m); c.save(gfx.G / "scissors.png")
    print("icons ok")
