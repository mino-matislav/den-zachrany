# Deň Záchrany

**Dnes je deň spasenia.**

Biblická webová stránka pre ľudí v ťažkých chvíľach. Ponúka evanjelium spásy, pastoračné kapitoly s modlitbami a piesne. Všetko voľne dostupné, bez reklám a bez registrácie.

Web: [den-zachrany.vercel.app](https://den-zachrany.vercel.app)

<!-- OBSAH:ZACIATOK -->
## Obsah

- **22 kapitol** — všetky dostupné, každá s audio modlitbou
- **18 piesní** — s textami a biblickou inšpiráciou
- **Úvodné slovo** na domovskej stránke

*Zdrojom pravdy pre obsah sú `js/data.js` (kapitoly) a `js/data-songs.js` (piesne).
Tento prehľad automaticky generuje `scripts/build-seo.py` — neupravuj ho ručne.*
<!-- OBSAH:KONIEC -->

## Štruktúra projektu

```
den-zachrany/
├── index.html              # Domovská stránka
├── kapitoly.html           # Zoznam kapitol (predgenerovaný + filter tém)
├── kapitola-1..N.html      # Samostatná stránka každej kapitoly (SEO)
├── kapitola.html           # Šablóna, funkčná cez ?id=, noindex
├── piesne.html             # Zoznam piesní
├── piesen-1..N.html        # Samostatná stránka každej piesne (SEO)
├── piesen.html             # Šablóna, funkčná cez ?id=, noindex
├── pocuvaj.html            # Súvislé prehrávanie piesní, noindex
├── podpora.html            # Podpora projektu (QR + IBAN)
├── robots.txt              # Generované
├── sitemap.xml             # Generované
├── css/style.css
├── js/
│   ├── app.js              # Navigácia, filter, zdieľanie, sťahovanie
│   ├── player.js           # Audio prehrávač
│   ├── data.js             # Kapitoly + slovník tém (tagGroups)
│   └── data-songs.js       # Piesne
├── scripts/
│   ├── build-seo.py        # SEO, samostatné stránky, sitemap, README
│   └── verify.js           # Kontrola pred nasadením
├── manifest.json
├── sw.js                   # Service worker
└── assets/                 # Audio, ikony, QR kód
```

## Technológie

- **Čistý HTML/CSS/JS** — žiadny framework, žiadny backend
- **PWA** — inštalovateľná, texty dostupné offline
- **Responzívny dizajn** — mobile-first
- **Prístupnosť** — ARIA popisy, dostatočný kontrast
- Nasadenie: GitHub → Vercel (automaticky z vetvy `main`)

## Farby a typografia

| Farba | Hex | Použitie |
|-------|-----|----------|
| Zlatá | `#D4AF37` | Tlačidlá, akcenty, symbol ryby |
| Krémová | `#FFF9E8` | Hlavné pozadie |
| Zlatobiela | `#FFFDF7` | Horné prechody |
| Modro-sivá | `#E8EEF5` | Spodné prechody |
| Grafitová | `#2E2E2E` | Text |

Nadpisy **Playfair Display**, verše **Merriweather Italic**, telo textu **Inter**.

## Postup pri zmenách

Poradie krokov je záväzné — `verify.js` je posledná poistka pred nasadením:

```bash
# 1. úprava obsahu v js/data.js alebo js/data-songs.js
# 2. prepočet SEO a samostatných stránok
python3 scripts/build-seo.py
# 3. kontrola (musí skončiť s kódom 0)
node scripts/verify.js
# 4. zvýšenie verzie v sw.js a push
```

### Pri pridaní kapitoly alebo piesne

Stačí doplniť záznam do `js/data.js` (resp. `js/data-songs.js`) a spustiť `build-seo.py`. Samostatná stránka, sitemap, prepojenie príbuzných kapitol aj prehľad obsahu v tomto súbore sa vytvoria automaticky.

Témy (`tags`) musia existovať v slovníku `tagGroups` v `js/data.js` — inak `verify.js` nasadenie zastaví.

### Pri zmene domény

Uprav jediný riadok `BASE_URL` v `scripts/build-seo.py` a skript spusti znova.

## Obsahové pravidlá

- Biblické citácie **výhradne v evanjelickom preklade (ECAV)**, overené na [biblia.sk](https://biblia.sk) — bez výnimky
- Dôraz na dispenzačnú presnosť: veriaci je už odpustený a Duch Svätý v ňom prebýva, preto modlitby **vyznávajú a ďakujú**, nežiadajú o to, čo už bolo dané
- Starozmluvné zasľúbenia sa uvádzajú ako obraz Božieho charakteru, nie ako priame zasľúbenie cirkvi
- Texty musia byť **súčasne jednoduché a biblicky presné**

## Licencia obsahu

Audio nahrávky sú voľne dostupné na osobné a nekomerčné použitie.
