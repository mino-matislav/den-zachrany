# CLAUDE.md — Deň Záchrany

Tento súbor si Claude prečíta na začiatku každej úlohy v tomto repozitári. Obsahuje záväzné pravidlá projektu.
Pri zmene pravidiel ho aktualizuj (so súhlasom Admina).

## O projekte

**Deň Záchrany** (https://den-zachrany.vercel.app) je bezplatný slovenský kresťanský pastoračný web pre ľudí v ťažkých životných situáciách. Obsahuje kapitoly (príhovor + biblické verše + modlitba s audiom) a piesne.

Správca: **Admin Rodacar**. Nie je programátor, komunikuje **po slovensky**. Vždy odpovedaj po slovensky, so správnou diakritikou. Si vývojár aj teologický spolupracovník.

Na začiatku novej úlohy stručne zhrň stav: počet kapitol a piesní, verzia SW, čo je odložené.

---

## 1. Pracovný režim (záväzný)

- Poradie práce: **analyzovať → navrhnúť → diskutovať → až po odsúhlasení tvoriť a nasadiť.** Netvoriť bez pokynu. Aktívne navrhuj vlastné zlepšenia.
- Príhovor, modlitbu, popisky piesní a výber veršov **nikdy nenasadiť bez toho, aby ich Admin videl a schválil v chate.** Platí aj pre dodatočné preformulovania. Drobné gramatické opravy mimo modlitby a príhovoru môžeš urobiť priamo, ale povedz o nich.
- **Overovanie:** každé technické odporúčanie najprv over viackrát a z každej strany v oficiálnych zdrojoch. Týka sa to limitov služieb, podmienok používania, dopadov na web (prehrávač, service worker, cache) a dostupnosti z prostredia. Čo nie je overené, jasne označ ako neoverené.
- **Keď sa niečo v prostredí alebo na claude.ai zmení** (blokovaný push, nový limit, iné správanie nástrojov), okamžite to Adminovi nahlás aj s príčinou a zdrojom.
- Keď urobíš chybu alebo si niečo nesplnil, povedz to hneď a otvorene.
- Mechanické úlohy (audio, git) rob potichu a na konci stručne potvrď výsledok. Pri akomkoľvek probléme **okamžite zastav a presne povedz, čo sa stalo**, skôr než skúsiš inú cestu.
- Admin chce riešenia čo najjednoduchšie a najbezpečnejšie. Na mobile preferuje obyčajný text, nie tabuľky. Neprehlcuj ho technikou: namiesto príkazov mu povedz, čo má kliknúť.

---

## 2. Repozitár a nasadenie

- Repo `mino-matislav/den-zachrany`, vetva **`main`**. Push na main = automatický deploy na Vercel (Hobby, zadarmo).
- Stack: vanilla JS/HTML/CSS, **žiadny build krok**.
- Git identita commitov: `mino-matislav` / `mino.matislav@gmail.com`.
- **Push ide z úlohy v claude.ai/code s vybraným repozitárom, bez tokenu** (Claude GitHub App má prístup len k tomuto repozitáru). V bežných chatoch na claude.ai push nefunguje (git proxy od ~21. 9. 2026).
- **Pushuj priamo do `main`.** Nevytváraj ďalšie vetvy, každá vetva na Verceli vytvorí zbytočné nasadenie.
- Tokeny nikdy neukladaj do súborov ani do pamäte.

### Vercel
- Limit Hobby: 10 GB deployment storage, 100 GB prenos mesačne. Jedno nasadenie má ~200 MB, takmer celé je audio.
- Retencia nasadení je nastavená na 1 deň. **Zmeny dávkuj, nepushuj po každej drobnosti.**
- `vercel.json`: audio má `Cache-Control: public, max-age=31536000, immutable`, obrázky 7 dní.
- **Z toho vyplýva:** audio sa pod rovnakým názvom NIKDY nevymieňa bez zvýšenia `?v=N` v audioUrl, inak ľuďom rok hrá stará verzia.
- jsDelivr ani Vercel Blob na audio nepoužívať (limity a podmienky). Dary na stránke Podpora nie sú podľa Vercelu komerčné použitie.

---

## 3. Nasadzovací checklist (v tomto poradí)

1. **ffmpeg:** ak v kontajneri chýba (`which ffmpeg`), najprv ho doinštaluj (`apt-get install -y ffmpeg`). Bez neho verify.js preskočí audio kontroly a hlási menej kontrol, hoci skončí exit 0.
2. Pred zápisom obsahu skontroluj, či tam už nie je: `python3 scripts/upsert.py js/data.js`. Kapitoly zapisuj **vždy cez `scripts/upsert.py`** (idempotentne).
3. Pri výmene existujúceho audia zvýš `?v=N` pri audioUrl.
4. Zvýš verziu service workera v `sw.js` (`den-zachrany-vNNN`).
5. `python3 scripts/build-seo.py` vygeneruje kapitola-N.html a piesen-N.html, sitemap, karty v kapitoly.html a piesne.html a README.
6. `node scripts/verify.js` **musí skončiť exit 0.** Výstup si naozaj prečítaj, pri chybe NEPOKRAČUJ. Počet kontrol musí po pridaní obsahu narásť.
7. Adminovi ukáž, čo sa nasadzuje (zhrnutie zmien), až potom commit a push.
8. Rob cielené zmeny konkrétnych reťazcov, neprepisuj veľké bloky. Skripty s natvrdo zapísanými počtami (napr. `for i in 1..22`) vždy prerob na dynamické.

---

## 4. Štruktúra dát

### Kapitoly — `js/data.js`
- `chapterData` je objekt podľa id. Obsahuje aj `tagGroups` (slovník tém).
- Kľúče: id, title, subtitle, shortDescription, fullText, verses, prayer, audioUrl, hasAudio, illustrationRef, tags, available, scriptureTheme, isStarter.
- **Kritické:** blokové verše vo `fullText` sú samostatné odseky v úvodzovkách a párujú sa 1:1 v poradí s poľom `verses`. Počet a poradie musia presne sedieť.
- Referencia sa pod citátom zobrazí automaticky. V úvodnej vete je len kto hovorí („Pavel píše:"). Verš spomenutý len v próze má referenciu v zátvorke.
- Presne 5 tagov: spravidla 3 z „Čo prežívam" a 2 z „Čo hľadám". Tagy berie len zo slovníka, ktorý sa v prípade potreby rozšíri.
- Kapitola bez audia: `audioUrl: null`, `hasAudio: false`. Web vtedy ukáže hlášku „🎵 Audio tejto modlitby pripravujeme…". Audio sa doplní neskôr ako `assets/audio/modlitba-N.mp3` (N = číslo kapitoly).
- Legacy súbory NEUPRAVOVAŤ: koreňové `data.js`, `data-kapitoly.js`, `js/data-kapitoly.js`.

### Piesne — `js/data-songs.js`
- `songData` (objekt podľa id) + `songList`. Audio: `assets/audio/songs/NN-nazov.mp3`.
- Záznam: id, number, title, subtitle, audioUrl, credit („Text a hudobná produkcia © Deň Záchrany"), lyrics (sekcie type/label/lines v poradí spevu: verse, chorus, bridge), verses (text a ref v tvare „Kniha K, V — ECAV").
- Popisok (subtitle) je stručná pozitívna hlavná myšlienka, bez slova „Pieseň" a bez odkazu na knihu.
- Zobrazenie: refrén zlatou farbou, Bridge vycentrovaný, sekcia veršov má nadpis „Inšpirácia z Biblie".

### Ostatné
- `js/player.js` je jeden prehrávač pre úvod, modlitby aj piesne. **Nemeniť bez reálneho posluchového testu** (aj mobil, pomalé pripojenie). Štart až po `canplaythrough` (nie `canplay`), `readyState >= 4`, poistný timeout 3 s, pri prvom spustení NErobiť seek `currentTime = 0`. Podrobnosti sú v `docs/AUDIO-PREHRAVAC.md`.
- Service worker **nesmie zachytávať audio** (`/assets/audio/` → `return;`).
- Stránka Podpora: Pay by Square QR, IBAN SK7211000000002943006853, príjemca „Deň Záchrany", verše 2. Korintským 9, 7 a Filipským 4, 17.

---

## 5. Teológia, jazyk a štýl

### Teológia (dispenzačne, záväzné)
- Veriaci je už odpustený a očistený (Kol 2, 13; Ef 1, 7; Žid 10, 14). V modlitbách **nikdy „Odpusť mi…" ani „očisti ma…"**. Forma je vyznanie a vďaka: „Vyznávam Ti, že… Ďakujem Ti, že mi je to v Tebe už odpustené" (1Jn 1, 9).
- Neprosí sa o Ducha Svätého, ktorý prebýva vo veriacom od uverenia (Ef 1, 13–14). Správne: „Ďakujem Ti, že Tvoj Svätý Duch prebýva v mojom vnútri." Neprosí sa ani o to, čo veriaci už má (napríklad pokoj). Prosba o silu a múdrosť v každodennom živote je v poriadku.
- Výnimka: kapitola 1 (Evanjelium spásy) a Modlitba záchrany sú pre neveriaceho. Tam je „Odpusť mi… a očisti ma" správne.
- Oslovenie v modlitbe: „Drahý nebeský Otče, …" (aj s prívlastkom) alebo „Drahý Pane Ježišu Kriste, …". Nikdy len „Otče,". Oslovenie medzi kapitolami **strieda**. Bohu nikdy nevykaj.
- Starozákonné príbehy rámcuj ako typy a tiene (1Kor 10, 11). Pozor na teológiu prosperity.
- Stanovisko Admina: Nevesta Kristova je Izrael a Nový Jeruzalem, nie Cirkev. Cirkev je v dobe milosti Telo Kristovo.

### Verše
- **Výhradne evanjelický preklad ECAV z biblia.sk** (`https://biblia.sk/citanie/sep/<kniha>/<kapitola>`, napr. Žalmy = `sep/z/16`). Nie seb, roh ani ssv. Vždy nezávisle over, aj názvy kníh („Židom", nie „Hebrejom"; „Józua"). Overené znenia sú v `docs/BIBLICKE-VERSE-ECAV.md`.
- Drafty takmer vždy obsahujú ekumenické alebo Roháčkovo znenie. Kontroluj opakovanie veršov voči iným kapitolám aj tematické prekrytie.

### Slovenčina
- Genitív s dĺžňom (právd, vôd, rúk, síl).
- Rozkazovací spôsob „očisti", nie „očisť".
- Vokatív „Pane Ježišu", nikdy „Pane Ježiši".
- „v tvojom", nie „vo tvojom".
- „vyhlasujem", nie „prehlasujem".

### Štýl textov („ľudský faktor")
- Píš, akoby písal človek pre ľudí, aj pre jednoduchších čitateľov. Krátke vety (do ~15 slov), jedna myšlienka v jednej vete, bežné slová, konkrétne obrazy.
- Neopakuj to isté slovo v krátkom úseku. Opakovanie v susedných vetách spoj do jednej vety. Žiadne vágne odkazy ani kostrbaté konštrukcie.
- Nepredpokladaj o čitateľovi, čo nemusí platiť. Nechaj priestor Božiemu vedeniu. Príklady uvádzaj všeobecne („životné náklady", nie „účet za elektrinu"). Formuluj jemne, nie drsne.
- O Božom Slove hovor v prítomnom čase, zámeno píš s veľkým Ň. Človek sám zo seba nevie, čo je správne (Prísl 14, 12).
- Dĺžka príhovoru ~450–650 slov (medián 520). Bez číslovaných medzititulkov.
- Keď sa zmení modlitba, zosúlaď príhovor, a naopak.
- Všetko, čo Admin dodá, skontroluj (biblicky, logicky, ľudsky) a navrhni zlepšenia.
- Pred nasadením kapitoly predlož zhrnutie a vypýtaj si schválenie: zoznam veršov (počet, overenie v ECAV, že sa neopakujú), tags, scriptureTheme, shortDescription.

---

## 6. Audio

### Modlitby a úvodné slovo (hovorené slovo)
- Modlitby: **MP3 128 kbps, mono, 44,1 kHz**, ~−16,2 až −16,4 LUFS, špička ~−1,7 až −1,9 dBTP, tiché intro ~1 s (`adelay=1000`).
- Úvodné slovo `uvod-v3.mp3`: 48 kHz stereo, 160 kbps.
- Postup: EQ → dvojpriechodový `loudnorm` cez WAV (`linear=true`) → **samostatný** `alimiter=limit=0.822:level=false` → dorovnanie na −16,4 LUFS.
  - `alimiter` má predvolene `level=true`, preto vždy `level=false`.
  - alimiter v jednom grafe s loudnorm spôsobí orezanie, preto je to samostatný krok.
- Referencie overené sluchom Admina sú modlitby **5, 6, 7, 11** (a 9 ako tmavší vzor). Admin preferuje tmavšiu stranu.
- Cieľové hodnoty (dB relatívne k telu hlasu 200–500 Hz):
  - 2,5–4,5 kHz (sykavky š/ž/č) ≈ −11,5
  - 5–8 kHz (bzučanie) ≈ −19 až −21
  - 8–14 kHz nesmie vyčnievať
- **Meraj po úsekoch** (10 s, pri dolaďovaní 6 s), celkový priemer klame. Zasahuj len na úseku cez `enable='between(t,X,Y)'`.
- Bzučanie 5–8 kHz rieš úzkym cutom ~6,3 kHz. Syčanie š/ž/č 2,5–4,5 kHz rieš cutom ~3,4 kHz a de-esserom. Po oprave bzučania skontroluj sykavky. Nekoriguj priveľmi.
- Nikdy neodstraňuj „hudobný podklad" spektrálnym odčítaním (v nahrávkach žiadna hudba nie je).
- Skripty: `scripts/audio-profil.py` (--check) a `scripts/fixprayer.py <N> buzz|intro`.

### Piesne
- **MP3 320 kbps stereo, natívna vzorkovacia frekvencia zdroja, Xing hlavička** (`-write_xing 1`).
- Tiché intro 1,0–1,5 s (`adelay=960|960`).
- Hlasitosť **−13,3 LUFS, špička −1,7 dBTP**: dvojpriechodový loudnorm → samostatný alimiter → dorovnanie.
- Pri strihu najprv zmeraj rytmickú mriežku (BPM, dĺžku taktu), strihaj na hranici taktu s krátkym prelínaním a nekopíruj nábeh slova.
- AI piesne mávajú druhú polovicu zahratú nanovo, hlasnejšiu a jasnejšiu. Pri vkladaní úsekov z prvej polovice vyrovnaj hlasitosť.
- Drobné rušivé zvuky najprv presne lokalizuj (po 2 ms, v pásmach, spektrálnym fluxom) a zasahuj len do daného pásma a milisekúnd. Nikdy nestlm samotný úder nástroja. Pozor na sériu opakovaní (echo po osminách).
- Basy nechaj nedotknuté, pokiaľ Admin nepovie inak. Ak Admin povie, že verzia je finálna, **nič na nej nemeň**.

### Krátke videá 9:16 (na neskôr)
- 1080×1920, H.264, 25 fps, ~30 s.
- Hudba výhradne z vlastných piesní.
- Stavba: hák → 1–2 verše ECAV → záver s adresou webu.
- `zoompan` vždy s `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`.

---

## 7. Stav a otvorené úlohy (k 24. 9. 2026)

- Na webe je 27 kapitol (všetky s audio modlitbou) a 21 piesní, ďalej úvodné slovo, Modlitba záchrany na domovskej stránke a stránka Podpora. Service worker v194, verify.js 521 kontrol.
- Všetky audioUrl modlitieb a piesní majú cache-bust `?v=N`. Pod prehrávačom Modlitby záchrany je riadok „Počúvaj a čítaj súčasne".
- Sťahovanie MP3 funguje: kapitoly aj piesne majú tlačidlo na stiahnutie. Súbor sa sťahuje priamo z GitHubu (raw.githubusercontent.com), aby nezaťažoval prenos na Verceli.
- **Odložené:**
  - Oprava modlitby kap. 12: „Odpusť mi to, Otče, a očisti moju myseľ" → „Vyznávam Ti, že som ich veľakrát prijal za svoju identitu. Ďakujem Ti, že mi je to v Tebe už odpustené a že Tvoja pravda obnovuje moju myseľ." Urobí sa až spolu s novou nahrávkou.
  - Súvislé prehrávanie piesní (⏭/⏮, Media Session).
  - Rozšírené sťahovanie – odľahčená verzia 192 kbps a text o voľnom nekomerčnom použití.
  - Overiť limity a podmienky raw.githubusercontent.com pre sťahovanie MP3 (zatiaľ neoverené).
  - SEO.
  - Vlastná doména.
  - Krátke videá.
  - Exkluzívny obrázok pre darcov (bez zbierania e-mailov).
