#!/usr/bin/env python3
"""Kontrola po zostavení: každý odsek príhovorov a modlitieb z webu musí byť v PDF nezmenený,
každá kapitola musí mať cieľ v obsahu a modlitby (okrem príliš dlhých) musia byť na jednej strane.
Pri chybe skončí s kódom 1 (workflow neuverejní pokazenú knihu)."""
import json, re, subprocess, sys
from pathlib import Path
from pypdf import PdfReader

OUT = Path(__file__).parent / "out"
ch = json.loads((OUT / "chapters.json").read_text(encoding="utf-8"))
ch = {k: v for k, v in ch.items() if v.get("available", True) is not False}
N = lambda s: re.sub(r'[„“"”…\.\-­\s\d]', "", s)
ok = True
for name in ("Den-Zachrany-kniha.pdf", "Den-Zachrany-kniha-tlac.pdf"):
    pdf = OUT / name
    txt = subprocess.run(["python", "-c", f"import pypdf;print('\\n'.join(p.extract_text() or '' for p in pypdf.PdfReader('{pdf}').pages))"],
                         capture_output=True, text=True).stdout
    T = N(re.sub(r"-\n", "", txt))
    miss = [(k, p[:50]) for k, c in ch.items() for part in ("fullText", "prayer")
            for p in c[part].split("\n\n") if p.strip() and N(p) not in T]
    r = PdfReader(pdf); nd = r.named_destinations
    no_anchor = [k for k in ch if f"ch{k}" not in nd]
    pg = lambda k: r.get_destination_page_number(nd[k]) if k in nd else None
    split = [k for k in ch if pg(f"prayer{k}") is not None and pg(f"prayer{k}") != pg(f"prayerend{k}")]
    print(f"{name}: {len(r.pages)} strán, nezhody textu: {len(miss)}, kapitoly bez cieľa: {no_anchor}, modlitby na 2 stranách: {split}")
    if miss:
        print("  prvé nezhody:", miss[:5]); ok = False
    if no_anchor:
        ok = False
    if len(split) > 3:   # niekoľko veľmi dlhých modlitieb je prípustných
        ok = False
sys.exit(0 if ok else 1)
