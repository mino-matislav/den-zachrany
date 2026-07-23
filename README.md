# Deň Záchrany

**Dnes je deň spasenia.**

Biblická webová aplikácia pre ľudí v kríze, úzkosti a duchovnej núdzi. Ponúka evanjelium spásy, pastoračné kapitoly, modlitby a piesne.

## Štruktúra projektu

```
den-zachrany/
├── index.html          # Landing page
├── kapitoly.html       # Zoznam všetkých kapitol
├── kapitola.html       # Šablóna kapitoly (načíta dáta z JS)
├── piesne.html         # Sekcia piesní (pripravuje sa)
├── css/
│   └── style.css       # Kompletný styleguide
├── js/
│   ├── app.js          # Hlavná logika, navigácia, localStorage
│   ├── player.js       # Audio prehrávač
│   └── data.js         # JSON dáta kapitol
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline)
└── assets/             # Audio, obrázky, ikony
```

## Technológie

- **Čistý HTML/CSS/JS** — žiadny framework, žiadny backend
- **PWA** — offline dostupnosť, pridatie na plochu
- **Responzívny dizajn** — mobile-first, breakpointy 320/768/1024/1440px
- **Prístupnosť** — WCAG 2.1 AA, ARIA label, kontrast AAA
- **i18n ready** — štruktúra pre viacjazyčnosť

## Farby

| Farba | Hex | Použitie |
|-------|-----|----------|
| Zlatá svetelná | `#D4AF37` | Tlačidlá, akcenty, orámovanie |
| Krémová pergamenová | `#FFF9E8` | Hlavné pozadie |
| Svetlá zlatobiela | `#FFFDF7` | Hero prechody |
| Svetlá modro-sivá | `#E8EEF5` | Akcenty vody |
| Tmavá grafitová | `#2E2E2E` | Text |

## Typografia

- **Nadpisy**: Playfair Display (serif)
- **Verše**: Merriweather Italic (serif)
- **Telo textu**: Inter (sans-serif)

## Kapitoly

| # | Názov | Stav |
|---|-------|------|
| 1 | Strach zo smrti a večného zatratenia | ✅ Hotovo |
| 2 | Sužujúce myšlienky, úzkosť a vnútorný chaos | ✅ Hotovo |
| 3 | Hriech a odpustenie | 📝 Placeholder |
| 4 | Samota a opustenosť | 📝 Placeholder |
| 5 | Nemoc a utrpenie | 📝 Placeholder |

## Ako používať

1. Otvor `index.html` v prehliadači
2. Alebo nasaď na Vercel/GitHub Pages
3. Pridaj vlastné MP3 do `assets/audio/`
4. Uprav dáta v `js/data.js`

## Autor

Administrátor projektu — ty. Ja som len kód.
