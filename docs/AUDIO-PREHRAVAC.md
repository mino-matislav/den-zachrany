# Audio a prehrávač — čo NEMENIŤ a prečo

Tento dokument existuje preto, aby sa už raz vyriešené problémy neopakovali.
Každý bod nižšie stál hodiny ladenia. **Prečítaj pred akoukoľvek zmenou
`js/player.js` alebo pred nasadením nového audia.**

`scripts/verify.js` väčšinu týchto pravidiel kontroluje automaticky
(sekcie `[2b]` a `[8]`) a pri porušení zastaví deploy.

---

## 1. `js/player.js` — priming blok pri prvom spustení

V `AudioPlayer.prototype.play` je pri prvom stlačení play toto:

```js
this.hasPrimed = true;
this.audio.currentTime = 0;      // NEODSTRAŇOVAŤ
setTimeout(function () {          // NEODSTRAŇOVAŤ
    self.audio.play()...
}, 250);
```

**Prečo 250 ms a nie 100 ms (31.8.2026):** seek na 0 je asynchrónny. Keď
nestihol dobehnúť do 100 ms, prehrávanie sa spustilo uprostred neho a orezalo
začiatok skladby. Prejavovalo sa to nestále — raz to bolo počuť, raz nie, a to
aj pri starých piesňach. Predĺženie čakania dá seeku čas dobehnúť. Logika
zostala nezmenená, upravilo sa iba číslo. Cena: zvuk sa ozve o 0,15 s neskôr
po stlačení play, čo je nepostrehnuteľné.

**Vyzerá to ako zbytočná barlička, nie je.** Seek na 0 spolu s krátkym čakaním
prinúti prehliadač naplniť buffer skôr, než sa spustí zvuk.

### Čo sa stalo, keď sa to odstránilo (30.8.2026)

Priming blok bol nahradený čakaním na udalosť `canplay`. Výsledok: v úvodnom
slove bolo počuť **„nemôžeš" → pauza → zvyšok textu**. To isté hrozilo vo
všetkých modlitbách aj piesňach. Príčina: `canplay` znamená iba „dá sa začať
prehrávať", nie „je načítané dosť dát" — prehrávanie začalo a hneď muselo
dobuferovať. Zmena bola revertovaná (commit `b80f800`).

**Pravidlo:** `player.js` používa **jeden** prehrávač pre úvodné slovo,
22 modlitieb aj 19 piesní. Akákoľvek zmena sa dotkne všetkého naraz.
Nikdy ju nenasadzuj bez toho, aby ju niekto reálne vypočul v prehliadači.

### Známy vedľajší efekt (vedome tolerovaný)

Seek na 0 v MP3 skáče na najbližší rámec (~26 ms), takže sa občas oreže
pár milisekúnd zo začiatku. Preto majú piesne tichý nábeh (bod 2) — orezanie
padne do ticha a nie je ho počuť. Toto je **prijateľná cena** za spoľahlivý
štart. Neriešiť zásahom do `player.js`.

---

## 2. Piesne musia mať tichý nábeh ~1,1 s (modlitby NIE)

Všetky piesne majú na začiatku **1,0–1,5 s ticha**. Nová pieseň musí mať tiež.

**Pozor — netýka sa modlitieb ani úvodného slova.** Tie majú nábeh iba
0,03–0,11 s (úvodné slovo 0,025–0,05 s, 22 modlitieb priemer 0,056 s) a je to
tak správne. **Ticho im nepridávať.**

Prečo je v tom rozdiel: modlitby sú 192 kbps mono, piesne 320 kbps stereo —
teda zhruba dvojnásobok dát, ktoré prehliadač na štarte musí načítať. Pri
hovorenom slove buferovanie zvládne priming blok (bod 1), pri piesňach už nie.

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
