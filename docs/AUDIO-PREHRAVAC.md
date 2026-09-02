# Audio a prehrávač — čo NEMENIŤ a prečo

Tento dokument existuje preto, aby sa už raz vyriešené problémy neopakovali.
Každý bod nižšie stál hodiny ladenia. **Prečítaj pred akoukoľvek zmenou
`js/player.js` alebo pred nasadením nového audia.**

`scripts/verify.js` väčšinu týchto pravidiel kontroluje automaticky
(sekcie `[2b]` a `[8]`) a pri porušení zastaví deploy.

---

## 1. `js/player.js` — spustenie prvého prehrávania (buffer!)

V `AudioPlayer.prototype.play` sa pri prvom stlačení play (`hasPrimed`) čaká,
kým je stiahnutých **dosť dát na plynulé dohratie**, a až potom sa spustí zvuk:

```js
if (this.audio.readyState >= 4) {          // HAVE_ENOUGH_DATA
    startPlayback();
} else {
    this.audio.addEventListener('canplaythrough', go);  // NIE 'canplay'!
    setTimeout(go, 3000);                   // poistka, nech to nikdy nevisí
}
```

### Prečo takto (história — každý bod stál veľa ladenia)

- **NEROBIŤ seek `currentTime = 0` na prvom spustení.** Pozícia je aj tak 0,
  takže seek nič neposunie, ale na mobiloch **zahodí prednačítaný buffer**
  (`preload="auto"`) a vynúti nové sťahovanie od začiatku. Dôsledok: zvuk hral
  ~1 s a potom nastal **výpadok ~1 s** (buffer underrun), kým sa dosťahovalo.
  Najviac to bolo počuť na modlitbách a úvodnom slove, ktoré nemajú tiché intro
  ako piesne (31.8.2026). Predtým tam seek + pevný `setTimeout` boli — to bola
  chyba, ktorá ten výpadok spôsobovala.

- **Musí to byť `canplaythrough`, NIE `canplay`.** `canplay` znamená iba
  „dá sa začať", `canplaythrough` znamená „dá sa dohrať bez zadrhnutia".
  30.8.2026 bola skúšaná verzia s `canplay` → v úvodnom slove bolo počuť
  „nemôžeš" → pauza → zvyšok (revert commit b80f800). `canplaythrough` čaká na
  VIAC buffera, takže tento problém nerobí.

- **Poistný `setTimeout(go, 3000)`** spustí prehrávanie aj vtedy, keby
  `canplaythrough` neprišlo (niektoré mobilné prehliadače ho pošlú neskoro alebo
  vôbec). Radšej malé riziko zadrhnutia než aby play nikdy nezačal.

Tento prehrávač obsluhuje úvodné slovo, 22 modlitieb aj 20 piesní — každá zmena
sa dotkne všetkého naraz. **Nikdy nenasadzuj zmenu player.js bez reálneho
vypočutia v prehliadači** (ideálne aj na mobile a na pomalšom pripojení).
`verify.js [2b]` stráži kľúčové značky tohto riešenia.

## 2. Piesne musia mať tichý nábeh ~1,1 s (modlitby NIE)

Všetky piesne majú na začiatku **1,0–1,5 s ticha**. Nová pieseň musí mať tiež.

**Aktualizované 31.8.2026 — tiché intro majú mať AJ modlitby a úvodné slovo (~1 s).**
Pôvodne mali modlitby a úvod nábeh len 0,03–0,11 s (bez ticha), lebo na webe to
riešil priming blok v player.js. Lenže pri **stiahnutých** súboroch v cudzom
prehrávači (overené na Android) sa začiatok ukusoval, keďže reč začína hneď.
Preto teraz **každá modlitba aj úvodné slovo dostáva ~1 s tiché intro**
(`adelay=1000`), rovnako ako piesne. Robí to `scripts/fixprayer.py` automaticky.
`verify.js [8]` kontroluje tiché intro piesní, modlitieb aj úvodu (prvých 0,6 s
pod −30 dB) a pri chýbajúcom introle zastaví deploy.

### Prečo

Piesne 18 a 19 pôvodne začínali hudbou už po 0,12 s. Prehliadač si na štarte
krátko dobuferuje — pri tichom nábehu to nie je počuť, pri okamžitom nástupe
hudby to znie ako **„prvý tón → pauza → pieseň pokračuje"**. Presne to používateľ
nahlásil pri oboch piesňach.

### Ako to spraviť

```bash
# zisti súčasný nábeh (prvý zvuk nad -40 dBFS)
ffmpeg -t 4 -i vstup.mp3 -af silencedetect=noise=-40dB:d=0.1 -f null -

# doplň ticho tak, aby hudba začínala na ~1,10 s
ffmpeg -i vstup.mp3 -af "adelay=960|960" -c:a libmp3lame -b:a 320k -write_xing 1 vystup.mp3
```

`verify.js [8]` kontroluje, že prvých 0,6 s každej piesne je pod −30 dB.
Číta iba `assets/audio/songs/`, takže modlitieb sa kontrola zámerne netýka.

---

## 3. Audio štandard

| | Piesne | Modlitby / úvodné slovo |
|---|---|---|
| Formát | MP3 320 kbps **stereo** | MP3 192 kbps **mono** |
| Vzorkovacia frekvencia | natívna zo zdroja | 44,1 kHz |
| Loudness | ~**−13,4 LUFS** | ~**−16 LUFS** |
| True peak | −1,0 až −1,4 dBTP | −1,7 až −1,9 dBTP |
| Hlavička | Xing/Info | Xing/Info |
| Umiestnenie | `assets/audio/songs/` | `assets/audio/` |

Výsledok vždy porovnaj s existujúcimi súbormi, než ho nasadíš.

---

## 4. `alimiter` má auto-level ZAPNUTÝ

Filter `alimiter` má parameter `level` **defaultne `true`** — po limitovaní
zosilní signál späť na maximum, takže limiter je fakticky neúčinný.

**Vždy `level=false`:**

```
alimiter=limit=0.822:level=false     # 0.822 ≈ -1,7 dBTP
```

Prejaví sa to najmä pri hlasnejších zdrojoch. Modlitba 22 mala zdroj −11,9 LUFS
(bežne ~−16) a jednopriechodový `loudnorm` dal +1,3 dBTP so sample peakom na
0 dBFS, teda klipovanie.

**Správny postup je dvojpriechodový** cez medzisúbor:

1. `loudnorm=...:print_format=json` → odčítaj `measured_I`, `measured_TP`,
   `measured_LRA`, `measured_thresh`, `offset`
2. `loudnorm=...:linear=true` s nameranými hodnotami
3. na záver `alimiter=limit=0.822:level=false`

---

## 5. Service worker NESMIE zachytávať audio

V `sw.js` musí zostať:

```js
if (url.indexOf('/assets/audio/') !== -1) {
    return;   // Range requesty, buffering a streamovanie rieši prehliadač
}
```

Ak by SW audio kešoval, rozbije Range requesty a prehrávanie. `verify.js [4]`
to kontroluje.

---

## 6. Pri výmene audia vždy cache-busting

Ak sa mení súbor s **rovnakým názvom**, prehliadače by ostali na starej verzii.
Preto sa v `js/data.js` / `js/data-songs.js` pridáva k `audioUrl` `?v=N`
a zvyšuje sa verzia service workera (`den-zachrany-vN` v `sw.js`).

---

## 7. Strihy v piesni — najprv zmeraj rytmus

Pri odstraňovaní artefaktu zisti, kde sú údery, a strih umiestni **do pasáže
bez úderov**. Vtedy nie je potrebné naťahovať ani kopírovať materiál a strih
nie je počuť.

Príklad (pieseň 19, sloha 2): medzi 27,7 s a 30,49 s neboli žiadne údery, takže
vystrihnutie 180 ms tesne pred nástupom rytmu bolo nepočuteľné. Skôr skúšané
riešenie — skopírovať ženský nábeh — spôsobilo, že slovo zaznelo dvakrát.

---

## 8. Checklist pred nasadením audia

1. `node scripts/verify.js` → musí skončiť s kódom 0
2. parametre a loudness porovnané s existujúcimi súbormi (bod 3)
3. tichý nábeh ~1,1 s (piesne)
4. cache-busting `?v=N` + zvýšená verzia SW
5. po nasadení reálne vypočuť v prehliadači

---

## 9. Zvukový štandard modlitieb (profil 6/7/8/9)

Modlitby 6, 7, 8 a 9 znejú referenčne dobre — teplo, jasne, mäkko. Ich priemer
je **záväzný cieľový profil pre všetky modlitby** (aj budúce). Modlitba, ktorá
sedí na tento profil, znie ako rodina; odchýlka v 5–8 kHz nad cieľ = „bzučanie".

### Cieľový spektrálny profil

Hodnoty sú v dB **relatívne k telu hlasu** (pásmo 200–500 Hz = 0 dB), merané
ako energia pásma na celej stope:

| pásmo | cieľ (dB k telu) | čo to je |
|---|---|---|
| 80–150 Hz | +0,5 | spodok hlasu |
| 150–300 Hz | −0,1 | telo/plnosť |
| 300–500 Hz | −2,1 | (referenčné telo) |
| 500–1 kHz | −4,7 | nižšie stredy |
| 1–2 kHz | −6,4 | **teplo, plnosť** |
| 2–3,5 kHz | −8,3 | **clarity / zrozumiteľnosť** |
| 3,5–5 kHz | −13,2 | prítomnosť |
| 5–8 kHz | −18,4 | **mäkkosť (nad cieľ = bzučanie!)** |
| 8–12 kHz | −15,1 | vzduch |

Dynamika: **crest ~14,9 dB, LRA ~3–4 LU** (reč nesmie byť zlisovaná).
Loudness: **−16,4 LUFS, −1,7 dBTP**, 192 kbps mono.

### Ako naň dostať novú/odchýlenú modlitbu

1. Zmerať profil a rozdiel voči cieľu (skript nižšie / `VERIFY_AUDIO=1`).
2. Korekčný EQ na najväčšie odchýlky. Najčastejšie: **cut 5–8 kHz** (bzučanie),
   pridať teplo 1–2 kHz. Cut buzzu rob **úzkym bellom ~6,3 kHz** (široký cut
   zasiahne aj 3,5–5 kHz a 8–12 kHz — potom treba obnoviť vzduch ~10,5 kHz).
3. Re-normalizovať viacstupňovo (viď bod 4): EQ → dvojpriechodový loudnorm
   (`linear=true`) → **samostatný** `alimiter=limit=0.822:level=false` →
   deterministické dorovnanie loudness na −16,4 LUFS (zmerať a dotrimovať
   `volume`, lebo loudnorm systematicky podstreľuje o ~0,5–1 dB).
4. Overiť výsledný profil voči cieľu (odchýlky ideálne do ~1,5 dB) a vypočuť.

### Kontrola

`node scripts/verify.js` s premennou **`VERIFY_AUDIO=1`** porovná profil každej
modlitby s cieľom a upozorní (nezastaví deploy) na pásmo mimo tolerancie —
hlavne na bzučanie v 5–8 kHz. Bez tej premennej sa kontrola preskočí (je pomalá).
