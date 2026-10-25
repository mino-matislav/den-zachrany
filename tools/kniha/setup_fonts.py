#!/usr/bin/env python3
"""Download the open-source fonts (SIL Open Font License) from npm and convert them to TTF.
Fonts are not stored in the repository; they are fetched at build time into out/fonts/."""
import glob, os, shutil, subprocess, tarfile
from pathlib import Path
from fontTools.ttLib import TTFont

HERE = Path(__file__).parent
F = HERE / "out" / "fonts"; T = F / "ttf"
T.mkdir(parents=True, exist_ok=True)
PACKAGES = ["@fontsource/eb-garamond@5", "@fontsource/cormorant-garamond@5"]

for pkg in PACKAGES:
    name = pkg.split("/")[1].split("@")[0]
    dst = F / f"fontsource-{name}"
    if dst.exists():
        continue
    tgz = subprocess.run(["npm", "pack", pkg, "--silent"], cwd=F, check=True, capture_output=True, text=True).stdout.strip().splitlines()[-1]
    with tarfile.open(F / tgz) as tf:
        tf.extractall(F, filter="data")
    shutil.move(str(F / "package"), str(dst)); os.remove(F / tgz)

n = 0
for woff in glob.glob(str(F / "fontsource-*" / "files" / "*-latin-*.woff")) + glob.glob(str(F / "fontsource-*" / "files" / "*-greek-*.woff")):
    out = T / (Path(woff).stem + ".ttf")
    if not out.exists():
        f = TTFont(woff); f.flavor = None; f.save(out)
    n += 1
print("fonts ok:", n)
