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
- Každú novú kapitolu rob v samostatnej úlohe. Dlhé vlákna narážajú na limity a zápis by sa mohol prerušiť.
- Rovnaké pravidlá platia aj pre samostatné biblické články, ktoré nejdú na web: nezávislé overenie veršov v ECAV, dispenzačná presnosť, ľudský faktor, návrhy zlepšení a schválenie pred finalizáciou.
- Heslá za Admina nikdy nezadávaj, prihlasuje sa sám. Nasadenia na Verceli maže Admin sám.
- Dostupnosť z prostredia (overené 24. 9. 2026): api.github.com, raw.githubusercontent.com, npm a pip fungujú. huggingface.co je blokovaný (žiadny Whisper ani Demucs). uploads.github.com (GitHub Releases) odpovedá, ale či prejde skutočný upload, je neoverené.

---

## 2. Repozitár a nasadenie

- Repo `mino-matislav/den-zachrany`, vetva **`main`**. Push na main = automatický deploy na Vercel (Hobby, zadarmo).
- Stack: vanilla JS/HTML/CSS, **žiadny build krok**.
- Git identita commitov: `mino-matislav` / `mino.matislav@gmail.com`. Autora nemeň, ani na žiadosť automatických hookov.
- **Push ide z úlohy v claude.ai/code s vybraným repozitárom, bez tokenu** (Claude GitHub App má prístup len k tomuto repozitáru). V bežných chatoch na claude.ai push nefunguje (git proxy od ~21. 9. 2026).
- **Pushuj priamo do `main`.** Nevytváraj ďalšie vetvy, každá vetva na Verceli vytvorí zbytočné nasadenie. Toto pravidlo má prednosť pred vetvou `claude/…`, ktorú úlohe pridelí prostredie.
- Každý push do `main` spustí nové nasadenie, aj keď sa zmení len CLAUDE.md (`.vercelignore` iba zabráni, aby sa súbor dostal na web). Úpravy CLAUDE.md preto posielaj spolu s najbližšou dávkou, nie samostatne.
- Tokeny nikdy neukladaj do súborov ani do pamäte.

### Vercel
- Limit Hobby: 10 GB deployment storage, 100 GB prenos mesačne. Jedno nasadenie má ~200 MB, takmer celé je audio.
- Retencia nasadení je nastavená na 1 deň. **Zmeny dávkuj, nepushuj po každej drobnosti.**
- `vercel.json`: audio má `Cache-Control: public, max-age=31536000, immutable`, obrázky 7 dní.
- **Z toho vyplýva:** audio sa pod rovnakým názvom NIKDY nevymieňa bez zvýšenia `?v=N` v audioUrl, inak ľuďom rok hrá stará verzia.
- jsDelivr ani Vercel Blob na audio nepoužívať (limity a podmienky). Dary na stránke Podpora nie sú podľa Vercelu komerčné použitie.

---

## 3. Nasadzovací checklist (v tomto poradí)

1. **ffmpeg:** ak v kontajneri chýba (`which ffmpeg`), najprv ho doinštaluj (`apt-get install -y ffmpeg`). Bez neho verify.js preskočí audio kontroly a hlási menej kontrol, hoci skončí exit 0. **Ak inštalácia zlyhá, zastav a povedz to Adminovi. Bez audio kontrol nepokračuj.** Pri štarte úlohy ffmpeg inštaluje automaticky `.claude/hooks/session-start.sh`. Ak pri štarte vypíše „UPOZORNENIE", platí to isté.
2. Pred zápisom obsahu skontroluj, či tam už nie je: `python3 scripts/upsert.py js/data.js`. Kapitoly zapisuj **vždy cez `scripts/upsert.py`** (idempotentne).
3. Pri výmene existujúceho audia zvýš `?v=N` pri audioUrl.
4. Zvýš verziu service workera v `sw.js` (`den-zachrany-vNNN`).
5. `python3 scripts/build-seo.py` vygeneruje kapitola-N.html a piesen-N.html, sitemap, karty v kapitoly.html a piesne.html a README.
6. `node scripts/verify.js` **musí skončiť exit 0.** Výstup si naozaj prečítaj, pri chybe NEPOKRAČUJ. Počet kontrol musí po pridaní obsahu narásť.
   - Kontroly [2b] (prehrávač) a [8] (tiché intro piesní, modlitieb a úvodu) nikdy neobchádzaj.
   - Kontrola [9] (zvukový profil modlitieb) je predvolene preskočená. Pri novom alebo upravenom audiu modlitby spusti `VERIFY_AUDIO=1 node scripts/verify.js`.
   - verify.js aj audio-profil.py zisťujú počet modlitieb dynamicky zo súborov.
7. Adminovi ukáž, čo sa nasadzuje (zhrnutie zmien), až potom commit a push.
8. Rob cielené zmeny konkrétnych reťazcov, neprepisuj veľké bloky. Skripty s natvrdo zapísanými počtami (napr. `for i in 1..22`) vždy prerob na dynamické.

---

## 4. Štruktúra dát

### Kapitoly — `js/data.js`
- `chapterData` je objekt podľa id. Obsahuje aj `tagGroups` (slovník tém).
- Kľúče: id, title, subtitle, shortDescription, fullText, verses, prayer, audioUrl, hasAudio, illustrationRef, tags, available, scriptureTheme, isStarter.
- **Kritické:** blokové verše vo `fullText` sú samostatné odseky v úvodzovkách a párujú sa 1:1 v poradí s poľom `verses`. Počet a poradie musia presne sedieť.
- Znenie verša musí byť vo `fullText` aj vo `verses` identické. Web (app.js) zobrazí text z poľa `verses`, statická stránka kapitola-N.html (build-seo.py) text z `fullText`.
- Prečo vznikajú duplicity v `js/data.js`: keď sa zápis preruší a skript sa spustí znova. V JS sa duplicitný kľúč potichu prepíše a web funguje ďalej, preto chyba prejde nepovšimnutá. Na to slúži upsert.py a kontrola vo verify.js. Podrobnosti sú v `docs/PRACA-S-DATAMI.md`.
- Pri novej kapitole býva bežne 2 až 7 navrhnutých veršov už použitých v iných kapitolách. Krížovo skontroluj všetky verše a nájdi voľné náhrady.
- Referencia sa pod citátom zobrazí automaticky. V úvodnej vete je len kto hovorí („Pavel píše:"). Verš spomenutý len v próze má referenciu v zátvorke.
- Presne 5 tagov: spravidla 3 z „Čo prežívam" a 2 z „Čo hľadám". Tagy berie len zo slovníka, ktorý sa v prípade potreby rozšíri. Tagy sú jednoslovné.
- Kapitola bez audia: `audioUrl: null`, `hasAudio: false`. Web vtedy ukáže hlášku „🎵 Audio tejto modlitby pripravujeme…". Audio sa doplní neskôr: keď Admin dodá nahrávku, spracuj ju podľa sekcie 6, ulož ako `assets/audio/modlitba-N.mp3` (N = číslo kapitoly) a nastav `audioUrl` a `hasAudio: true`.
- Šablóna `kapitola.html` (a z nej kapitola-N.html) obsahuje hlášku „Audio tejto modlitby pripravujeme" aj pri kapitolách s audiom. Je to v poriadku: app.js ju pri existujúcom audiu skryje. Neopravovať.
- Legacy súbory NEUPRAVOVAŤ: koreňové `data.js`, `data-kapitoly.js`, `js/data-kapitoly.js`.

### Piesne — `js/data-songs.js`
- `songData` (objekt podľa id) + `songList`. Audio: `assets/audio/songs/NN-nazov.mp3`.
- Záznam: id, number, title, subtitle, audioUrl, credit („Text a hudobná produkcia © Deň Záchrany"), lyrics (sekcie type/label/lines v poradí spevu: verse, chorus, bridge), verses (text a ref v tvare „Kniha K, V — ECAV").
- Popisok (subtitle) je stručná pozitívna hlavná myšlienka, bez slova „Pieseň" a bez odkazu na knihu.
- Zobrazenie: refrén zlatou farbou, Bridge vycentrovaný, sekcia veršov má nadpis „Inšpirácia z Biblie".
- Backing vokály sa v texte píšu v zátvorkách a zobrazujú sa stlmene.

### Ostatné
- `js/player.js` je jeden prehrávač pre úvod, modlitby aj piesne. **Nemeniť bez reálneho posluchového testu** (aj mobil, pomalé pripojenie). Štart až po `canplaythrough` (nie `canplay`), `readyState >= 4`, poistný timeout 3 s, pri prvom spustení NErobiť seek `currentTime = 0`. Podrobnosti sú v `docs/AUDIO-PREHRAVAC.md`.
- Service worker **nesmie zachytávať audio** (`/assets/audio/` → `return;`). Pri starej keši u používateľa pomáha jednorazový cleanup (unregister SW + caches.delete + reload).
- Štýly: drobnosti štýluj priamo v stránke. Väčšie zmeny rob v `css/style.css` a zvýš jeho `?v=N` vo všetkých HTML stránkach aj v `sw.js`. Stránky kapitola-N.html a piesen-N.html sa preberajú zo šablón cez build-seo.py.
- CSS kariet: kontajner v piesne.html má obe triedy `songs-list chapters-list`. Pravidlá len pre kapitoly preto píš cez `.chapters-list:not(.songs-list)`. Karty sú celé klikateľné (odkaz v nadpise + `::after`), tlačidlo prehrávania piesne má `z-index: 2`.
- Stránka Podpora: Pay by Square QR (statický súbor `assets/qr-podpora.svg`), IBAN SK7211000000002943006853, verše 2. Korintským 9, 7 a Filipským 4, 17. Ako príjemca je na stránke uvedené „MILMAT s.r.o." s poznámkou „účet projektu Deň Záchrany". QR sa v minulosti generoval npm balíkom bysquare (len ESM, import cez `bysquare/pay`). Príjemca v dátach QR musí byť „MILMAT s.r.o.", inak ho banka neoverí.

---

## 5. Teológia, jazyk a štýl

### Teológia (dispenzačne, záväzné)
- Veriaci je už odpustený a očistený (Kol 2, 13; Ef 1, 7; Žid 10, 14). V modlitbách **nikdy „Odpusť mi…" ani „očisti ma…"**. Forma je vyznanie a vďaka: „Vyznávam Ti, že… Ďakujem Ti, že mi je to v Tebe už odpustené" (1Jn 1, 9).
- Neprosí sa o Ducha Svätého, ktorý prebýva vo veriacom od uverenia (Ef 1, 13–14). Správne: „Ďakujem Ti, že Tvoj Svätý Duch prebýva v mojom vnútri." Neprosí sa ani o to, čo veriaci už má (napríklad pokoj). Prosba o silu a múdrosť v každodennom živote je v poriadku.
- Výnimka: kapitola 1 (Evanjelium spásy) a Modlitba záchrany sú pre neveriaceho. Tam je „Odpusť mi… a očisti ma" správne.
- Ústne vyznanie viery má svoje miesto (Rimanom 10, 9). Nepíš, že „nezáleží na tom, či povieš správne slová".
- Oslovenie v modlitbe: „Drahý nebeský Otče, …" (aj s prívlastkom) alebo „Drahý Pane Ježišu Kriste, …". Nikdy len „Otče,". Oslovenie medzi kapitolami **strieda**. Bohu nikdy nevykaj.
  - Príklady prívlastkov: „Drahý nebeský Otče, Všemohúci Bože," / „môj Vodca a moja Cesta" / „môj Záchranca a moja Sila".
  - Striedanie Otec a Pán Ježiš je biblicky doložené (Sk 7, 59–60; Zj 22, 20; 2Kor 12, 8; aj Ján 16, 23; Ef 2, 18).
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
- Texty nesmú viesť k rozhodovaniu podľa vlastného úsudku, ale podľa Božieho Slova.
- Boh môže mať s človekom iný zámer, ktorý dopredu vidí. Môže ho viesť inam alebo ho chrániť pred niečím horším. Nepodsúvaj jediný výklad situácie.
- Vec pomenuj presne: „nová pracovná zmluva", nie len „nová zmluva".
- Príklady chýb, ktorým sa treba vyhnúť:
  - 2× „nemusíš" v jednej vete alebo 3× „situácia" v jednej modlitbe
  - vágny odkaz bez predmetu: „ako sa to vyrieši"
  - kostrbatá konštrukcia: „Daj mi silu urobiť krok, keď ho uvidím"
  - príliš tvrdé znenie, aj keď je pravdivé: „Otec neušetril Teba, svojho Syna, ale vydal Ťa za mňa"
  - predpoklad o čitateľovi: „svoju hodnotu som spájal s tým, čo zarábam" (nie každý to tak má)
- Príklad spojenia viet:
  - NIE: „Ty vieš, na čo čakám. Vieš aj to, že som už unavený z čakania."
  - ÁNO: „Ty vieš, na čo čakám a aj to, že som už z toho unavený."
- Pri každej vete skontroluj štyri veci: spisovnú slovenčinu s prirodzeným slovosledom, logickú súdržnosť, ľudský faktor a biblickú presnosť.
- O Božom Slove hovor v prítomnom čase, zámeno píš s veľkým Ň. Človek sám zo seba nevie, čo je správne (Prísl 14, 12).
- Dĺžka príhovoru ~450–650 slov (medián 520). Bez číslovaných medzititulkov.
- Keď sa zmení modlitba, zosúlaď príhovor, a naopak.
- Všetko, čo Admin dodá, skontroluj (biblicky, logicky, ľudsky) a navrhni zlepšenia.
- Pred nasadením kapitoly predlož zhrnutie a vypýtaj si schválenie: zoznam veršov (počet, overenie v ECAV, že sa neopakujú), tags, scriptureTheme, shortDescription.

---

## 6. Audio

### Modlitby a úvodné slovo (hovorené slovo)
- Hlasy modlitieb sú z ElevenLabs, nie je to hlas Admina.
- Modlitby: **MP3 128 kbps, mono, 44,1 kHz**, ~−16,2 až −16,4 LUFS, špička ~−1,7 až −1,9 dBTP, tiché intro ~1 s (`adelay=1000`).
- Úvodné slovo `uvod-v3.mp3`: 48 kHz stereo, 160 kbps.
- Postup: EQ → dvojpriechodový `loudnorm` cez WAV (`linear=true`) → **samostatný** `alimiter=limit=0.822:level=false` → dorovnanie na −16,4 LUFS.
  - `alimiter` má predvolene `level=true`, preto vždy `level=false`.
  - alimiter v jednom grafe s loudnorm spôsobí orezanie, preto je to samostatný krok.
- Východiskový EQ reťazec pre novú nahrávku modlitby: `highpass=f=70`, equalizer 400 Hz −5 dB (Q 1,2), 250 Hz −2 dB, 900 Hz −2 dB, `afftdn=nr=10:nf=-32`, +3 dB pri 2,5 kHz (w 0,9), +2 dB pri 4,5 kHz (w 1,1), treble +2 dB pri 8 kHz (w 0,7), `deesser=i=0.35`, acompressor threshold=−20dB ratio=2.5 attack=8 release=180 makeup=2. Potom loudnorm → alimiter → dorovnanie (vyššie). Výsledok vždy porovnaj s referenciami.
- Referencie overené sluchom Admina sú modlitby **5, 6, 7, 11** (a 9 ako tmavší vzor). Admin preferuje tmavšiu stranu. Modlitby 9 a 11 sú prirodzene tmavšie, neupravovať ich.
- Cieľový profil modlitieb (FFT, dB relatívne k telu hlasu 200–500 Hz, priemer modlitieb 6–9): 1–2 kHz −6,4; 2–3,5 kHz −8,3; 3,5–5 kHz −13,2; 5–8 kHz −18,4; 8–12 kHz −15,1; crest ~14,9; LRA ~3–4.
- Cieľové hodnoty (dB relatívne k telu hlasu 200–500 Hz):
  - 2,5–4,5 kHz (sykavky š/ž/č) ≈ −11,5
  - 5–8 kHz (bzučanie) ≈ −19 až −21
  - 8–14 kHz nesmie vyčnievať
- **Meraj po úsekoch** (10 s, pri dolaďovaní 6 s), celkový priemer klame. Zasahuj len na úseku cez `enable='between(t,X,Y)'`.
- Bzučanie 5–8 kHz rieš úzkym cutom ~6,3 kHz. Syčanie š/ž/č 2,5–4,5 kHz rieš cutom ~3,4 kHz a de-esserom (`deesser=i=0.42:m=0.55:f=0.35`). Po oprave bzučania skontroluj sykavky. Nekoriguj priveľmi.
- De-esser aj cuty používaj LEN na dotknutom úseku, nie globálne. Globálny zásah pokazí časti, ktoré boli v poriadku (stalo sa pri kap. 26).
- Zrnité syčanie 8–14 kHz („zarušovanie v slovách") rieš cutom ~8,5 kHz a ~11 kHz, len na úseku.
- Ak treba pridať zrozumiteľnosť bez syčania, nezdvíhaj pásmo 2,6–4 kHz (zvyšuje sykavky). Choď nižšie (1,8–2,2 kHz) alebo pridaj teplo (1,3–1,4 kHz).
- Rozptyl 10–14 dB medzi úsekmi je pri reči normálny (pauzy), majú ho aj referencie. Sám osebe nie je chybou.
- Keď Admin povie presný čas problému („od 00:54"), ber ho vážne a meraj práve tam.
- Cieľom korekcie je vyrovnanosť so zvyškom nahrávky, nie maximálne potlačenie. Záver kap. 26 bol raz stiahnutý o 2 dB pod zvyšok, čo je tiež chyba.
- Hranice slov hľadaj podľa obálky reči v pásme 300–3400 Hz, nie podľa priemernej rýchlosti reči.
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
- Remaster piesne cez rozdelenie na stopy: postup, nastavenia a moje zvukové preferencie sú v docs/REMASTER-PIESNI.md.

### Krátke videá 9:16 (na neskôr)
- 1080×1920, H.264, 25 fps, ~30 s.
- Hudba výhradne z vlastných piesní.
- Stavba: hák → 1–2 verše ECAV → záver s adresou webu.
- `zoompan` vždy s `x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`.
- Nástroje: PIL + ffmpeg (zoompan, xfade, fade).
- Grafika: prechod z krémovej do modrosivej, zlatá žiara, kríž, vinetácia, jemné zrno, zlatý rám.

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
