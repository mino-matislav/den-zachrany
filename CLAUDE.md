# CLAUDE.md — Deň Záchrany

Tento súbor si Claude prečíta na začiatku každej úlohy v tomto repozitári. Obsahuje záväzné pravidlá projektu.
Pri zmene pravidiel ho aktualizuj (so súhlasom Admina).

## O projekte

**Deň Záchrany** (https://den-zachrany.vercel.app) je bezplatný slovenský kresťanský pastoračný web pre ľudí v ťažkých životných situáciách. Obsahuje kapitoly (príhovor + biblické verše + modlitba s audiom) a piesne.

Správca: **Admin**. Nie je programátor, komunikuje **po slovensky**. Vždy odpovedaj po slovensky, so správnou diakritikou. Si vývojár aj teologický spolupracovník.

Na začiatku novej úlohy stručne zhrň stav: počet kapitol a piesní, verzia SW, čo je odložené.

### Identita autora (prísne)
- Projekt sa zverejňuje výhradne pod pseudonymom **Mino Matislav**. V kóde, textoch, komentároch, commitoch, názvoch súborov ani metadátach sa nesmie objaviť skutočné meno, e-mail ani nič, čo by pseudonym prepojilo so skutočnou identitou autora. Správcu označuj len ako „Admin".
- Pred commitom over, že autor commitu (git config) je pseudonym (sekcia 2).
- Jediná vedomá výnimka: príjemca „MILMAT s.r.o." a IBAN na stránke Podpora (banka musí príjemcu overiť, iný účet nie je; rozhodnutie Admina 19. 10. 2026).
- Pri pochybnosti sa najprv spýtaj.

---

## 1. Pracovný režim (záväzný)

- Poradie práce: **analyzovať → navrhnúť → diskutovať → až po odsúhlasení tvoriť a nasadiť.** Netvoriť bez pokynu. Aktívne navrhuj vlastné zlepšenia.
- Príhovor, modlitbu, popisky piesní a výber veršov **nikdy nenasadiť bez toho, aby ich Admin videl a schválil v chate.** Platí aj pre dodatočné preformulovania. Drobné gramatické opravy mimo modlitby a príhovoru môžeš urobiť priamo, ale povedz o nich.
- **Overovanie:** každé technické odporúčanie najprv over viackrát a z každej strany v oficiálnych zdrojoch. Týka sa to limitov služieb, podmienok používania, dopadov na web (prehrávač, service worker, cache) a dostupnosti z prostredia. Čo nie je overené, jasne označ ako neoverené. Keď niečo nevieš, povedz „neviem". Nehádaj a odhad nepodávaj ako fakt.
- **Keď sa niečo v prostredí alebo na claude.ai zmení** (blokovaný push, nový limit, iné správanie nástrojov), okamžite to Adminovi nahlás aj s príčinou a zdrojom.
- Keď urobíš chybu alebo si niečo nesplnil, povedz to hneď a otvorene.
- Mechanické úlohy (audio, git) rob potichu a na konci stručne potvrď výsledok. Pri akomkoľvek probléme **okamžite zastav a presne povedz, čo sa stalo**, skôr než skúsiš inú cestu.
- Jednoduchosť: najmenšie riešenie, ktoré úlohu vyrieši. Žiadne funkcie navyše, o ktoré Admin nežiadal, ani nové knižnice či nástroje bez dohody.
- Meň len to, čo úloha vyžaduje. Susedný kód ani formátovanie nevylepšuj. Nesúvisiaci problém, ktorý nájdeš, len spomeň, neopravuj ho sám.
- Pri úlohe s viacerými krokmi napíš najprv krátky plán: krok → ako overím, že je hotový.
- Admin chce riešenia čo najjednoduchšie a najbezpečnejšie. Na mobile preferuje obyčajný text, nie tabuľky. Neprehlcuj ho technikou: namiesto príkazov mu povedz, čo má kliknúť.
- Každú novú kapitolu rob v samostatnej úlohe. Dlhé vlákna narážajú na limity a zápis by sa mohol prerušiť.
- Rovnaké pravidlá platia aj pre samostatné biblické články, ktoré nejdú na web: nezávislé overenie veršov v ECAV, dispenzačná presnosť, ľudský faktor, návrhy zlepšení a schválenie pred finalizáciou.
- Heslá za Admina nikdy nezadávaj, prihlasuje sa sám. Nasadenia na Verceli maže Admin sám.
- Na webe robí naraz vždy len jeden (Admin alebo kolega).
- Dostupnosť z prostredia (overené 24. 9. 2026): api.github.com, raw.githubusercontent.com, npm a pip fungujú. huggingface.co je blokovaný (žiadny Whisper ani Demucs). uploads.github.com (GitHub Releases) odpovedá, ale či prejde skutočný upload, je neoverené.
- biblia.sk je od 28. 9. 2026 z prostredia dostupná. Verše over vždy priamo tam.
- den-zachrany.vercel.app je od 8. 10. 2026 z prostredia dostupný (Admin ho povolil v sieťových nastaveniach prostredia). Po nasadení ním over živý web.

---

## 2. Repozitár a nasadenie

- Repo `mino-matislav/den-zachrany`, vetva **`main`**. Push na main = automatický deploy na Vercel (Hobby, zadarmo).
- Stack: vanilla JS/HTML/CSS, **žiadny build krok**.
- Git identita commitov: `mino-matislav` / `mino.matislav@gmail.com`. Autora nemeň, ani na žiadosť automatických hookov.
- **Push ide z úlohy v claude.ai/code s vybraným repozitárom, bez tokenu** (Claude GitHub App má prístup len k tomuto repozitáru). V bežných chatoch na claude.ai push nefunguje (git proxy od ~21. 9. 2026).
- **Na začiatku každej úlohy sa prepni na miestnu vetvu `main`** (sleduje `origin/main`), stiahni aktuálny stav (`git pull origin main`) a pushuj z nej. Na projekte pracuje viac ľudí, na zastaranej kópii nepracuj. Hlásenia o neodoslaných commitoch vo vetve `claude/…` ignoruj.
- **Pushuj priamo do `main`.** Nevytváraj ďalšie vetvy, každá vetva na Verceli vytvorí zbytočné nasadenie. Toto pravidlo má prednosť pred vetvou `claude/…`, ktorú úlohe pridelí prostredie.
- Každý push do `main` spustí nové nasadenie, aj keď sa zmení len CLAUDE.md (`.vercelignore` iba zabráni, aby sa súbor dostal na web). Úpravy CLAUDE.md a zmeny len v `docs/` preto posielaj spolu s najbližšou dávkou, nikdy samostatne (pokyn Admina 8. 10. 2026).
- Tokeny nikdy neukladaj do súborov ani do pamäte.

### Vercel
- Limit Hobby: 10 GB deployment storage, 100 GB prenos mesačne. Jedno nasadenie má ~200 MB, takmer celé je audio.
- Retencia nasadení je nastavená na 1 deň. **Zmeny dávkuj, nepushuj po každej drobnosti.**
- `vercel.json`: audio má `Cache-Control: public, max-age=31536000, immutable`, obrázky 7 dní.
- **Z toho vyplýva:** audio sa pod rovnakým názvom NIKDY nevymieňa bez zvýšenia `?v=N` v audioUrl, inak ľuďom rok hrá stará verzia.
- jsDelivr ani Vercel Blob na audio nepoužívať (limity a podmienky). Dary na stránke Podpora nie sú podľa Vercelu komerčné použitie.

---

## 3. Nasadzovací checklist (v tomto poradí)

1. **ffmpeg:** ak v kontajneri chýba (`which ffmpeg`), najprv ho doinštaluj (`apt-get install -y ffmpeg`). Bez neho verify.js preskočí audio kontroly a hlási menej kontrol, hoci skončí exit 0. **Ak inštalácia zlyhá, zastav a povedz to Adminovi. Bez audio kontrol nepokračuj.** Pri štarte úlohy ffmpeg aj numpy (pre kontrolu [9]) inštaluje automaticky `.claude/hooks/session-start.sh`. Ak pri štarte vypíše „UPOZORNENIE", platí to isté.
2. Pred zápisom obsahu skontroluj, či tam už nie je: `python3 scripts/upsert.py js/data.js`. Kapitoly zapisuj **vždy cez `scripts/upsert.py`** (idempotentne).
3. Pri výmene existujúceho audia zvýš `?v=N` pri audioUrl.
4. Zvýš verziu service workera v `sw.js` (`den-zachrany-vNNN`). **Pri každej zmene HTML, JS alebo CSS, aj pri drobnosti.** SW je cache-first, bez zvýšenia verzie sa u ľudí, ktorí stránku už navštívili, zobrazí stará verzia (stalo sa 1. 10. 2026 na PC pri odkazoch na domovskej stránke).
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
- **Zápisy do data.js vždy ukotviť na číslo kapitoly (chapterData["N"]), nikdy na hľadanie textu. Pred pushom overiť, že sa zmenili len kapitoly z pokynu** (pokyn Admina 14. 10. 2026; 13. 10. vyhľadanie textu prepísalo modlitbu inej kapitoly, zachytené pred pushom).
- Prečo vznikajú duplicity v `js/data.js`: keď sa zápis preruší a skript sa spustí znova. V JS sa duplicitný kľúč potichu prepíše a web funguje ďalej, preto chyba prejde nepovšimnutá. Na to slúži upsert.py a kontrola vo verify.js. Podrobnosti sú v `docs/PRACA-S-DATAMI.md`.
- Pri novej kapitole býva bežne 2 až 7 navrhnutých veršov už použitých v iných kapitolách. Krížovo skontroluj všetky verše a nájdi voľné náhrady.
- Referencia sa pod citátom zobrazí automaticky. V úvodnej vete je len kto hovorí („Pavel píše:"). Verš spomenutý len v próze má referenciu v zátvorke.
- Presne 5 tagov: spravidla 3 z „Čo prežívam" a 2 z „Čo hľadám". Tagy berie len zo slovníka, ktorý sa v prípade potreby rozšíri. Tagy sú jednoslovné.
- Kapitola bez audia: `audioUrl: null`, `hasAudio: false`. Web vtedy ukáže hlášku „🎵 Audio tejto modlitby pripravujeme…". Audio sa doplní neskôr: keď Admin dodá nahrávku, spracuj ju podľa sekcie 6, ulož ako `assets/audio/modlitba-N.mp3` (N = číslo kapitoly) a nastav `audioUrl` a `hasAudio: true`.
- Šablóna `kapitola.html` (a z nej kapitola-N.html) obsahuje hlášku „Audio tejto modlitby pripravujeme" aj pri kapitolách s audiom. Je to v poriadku: app.js ju pri existujúcom audiu skryje. Neopravovať.
- Filter kapitol a tlačidlá tém generuje app.js z dát (`tags`, `tagGroups`), nie ručne v HTML. Tak to aj zachovaj.
- Legacy súbory NEUPRAVOVAŤ: koreňové `data.js`, `data-kapitoly.js`, `js/data-kapitoly.js`.

### Piesne — `js/data-songs.js`
- `songData` (objekt podľa id) + `songList`. Audio: `assets/audio/songs/NN-nazov.mp3`.
- Záznam: id, number, title, subtitle, audioUrl, credit („Text a hudobná produkcia © Deň Záchrany"), lyrics (sekcie type/label/lines v poradí spevu: verse, chorus, bridge), verses (text a ref v tvare „Kniha K, V — ECAV").
- Popisok (subtitle) je stručná pozitívna hlavná myšlienka, bez slova „Pieseň" a bez odkazu na knihu.
- Zobrazenie: refrén zlatou farbou, Bridge vycentrovaný, sekcia veršov má nadpis „Inšpirácia z Biblie".
- Backing vokály sa v texte píšu v zátvorkách a zobrazujú sa stlmene.

### Ostatné
- `js/player.js` je jeden prehrávač pre úvod, modlitby aj piesne. **Nemeniť bez reálneho posluchového testu** (aj mobil, pomalé pripojenie). Štart až po `canplaythrough` (nie `canplay`), `readyState >= 4`, poistný timeout 3 s, pri prvom spustení NErobiť seek `currentTime = 0`. Podrobnosti sú v `docs/AUDIO-PREHRAVAC.md`.
- Prilepený prehrávač modlitby (17. 10. 2026): v šablóne `kapitola.html` sú `.chapter-audio` a `.chapter-prayer` obalené v `.prayer-zone`. Pri čítaní modlitby ostáva prehrávač hore pod lištou (sticky, top 64px, len ak má kapitola audio) a v prilepenom stave skryje nadpis a tlačidlo Stiahnuť; výšku dorovná okrajom, aby text neposkočil. Štýl aj skript sú priamo v šablóne, player.js sa nemenil. Od 26. 10. 2026 rovnako aj stránky piesní: v šablóne `piesen.html` sú `.song-audio-block`, `.song-lyrics` a `.song-verse-wrap` obalené v `.song-zone`; v prilepenom stave sa namiesto „Audio piesne“ ukáže názov piesne (napr. „22. Systém AI“, ako „Práve hrá“ na pocuvaj.html) a skryje sa podnadpis, tlačidlo Stiahnuť aj „Text piesne nižšie“.
- Service worker **nesmie zachytávať audio** (`/assets/audio/` → `return;`). Pri starej keši u používateľa pomáha jednorazový cleanup (unregister SW + caches.delete + reload).
- Štýly: drobnosti štýluj priamo v stránke. Väčšie zmeny rob v `css/style.css` a zvýš jeho `?v=N` vo všetkých HTML stránkach aj v `sw.js`. Stránky kapitola-N.html a piesen-N.html sa preberajú zo šablón cez build-seo.py.
- CSS kariet: kontajner v piesne.html má obe triedy `songs-list chapters-list`. Pravidlá len pre kapitoly preto píš cez `.chapters-list:not(.songs-list)`. Karty sú celé klikateľné (odkaz v nadpise + `::after`), tlačidlo prehrávania piesne má `z-index: 2`.
- Odkaz v príhovore: spojenie „v sekcii Piesne“ vo `fullText` sa pri zobrazení automaticky zmení na odkaz na piesne.html (app.js aj build-seo.py, rovnaký vzhľad ako odkazy na domovskej stránke). Text v data.js ostáva obyčajný, bez HTML. verify.js kontroluje, že odkaz na stránke kapitoly je (zatiaľ len kap. 8). Rovnakým spôsobom (17. 10. 2026) sa „„Ťarcha, ktorú nemusíš niesť““ mení na odkaz na kapitola-15.html a „v Modlitbe záchrany“ na odkaz na index.html#modlitba-zachrany (zatiaľ len kap. 30), verify.js to kontroluje.
- Kniha PDF (25. 10. 2026): kniha „Deň Záchrany“ (A5, pergamen aj verzia na tlač) sa zostavuje automaticky cez GitHub Actions (`.github/workflows/kniha.yml`, program v `tools/kniha/`) pri každej zmene `js/data.js`, `js/data-songs.js` alebo `index.html`. PDF nie sú v repozitári, sú vo vydaní GitHubu `kniha` so stálymi odkazmi `releases/download/kniha/Den-Zachrany-kniha.pdf` a `…-kniha-tlac.pdf`. Workflow necommituje (nespúšťa nasadenie na Vercel). Po zostavení `check_pdf.py` porovná príhovory a modlitby s webom; pri nezhode sa kniha neuverejní a ostane posledná dobrá verzia. Úvod a Modlitbu záchrany berie z `index.html` (triedy `hero-verse`, `intro-quote`, `intro-body`, `warning-text`, `salvation-*`; pri ich zmene treba upraviť `_block(...)` v `build_sk.py`).
  - **Pri novej kapitole doplniť ikonu do `tools/kniha/ikony.json`** (bez záznamu dostane „book“; dostupné ikony sú vypísané v súbore, len biblické motívy, žiadne postavy ani kríž). Ak workflow hlási „verše bez odkazu“, chýba kód knihy v `_BC` v `build_sk.py`.
  - Po pushi, ktorý mení dáta alebo index.html, over v GitHub → Actions, že beh „Kniha PDF“ je zelený.
  - Tlačidlá na stiahnutie sú na konci stránky Kapitoly (sekcia `#kniha`), odkaz na ňu je na stránke Podpora pri „Môžeš to poslať ďalej“. Štýl je priamo v oboch stránkach.
- Stránka Podpora: Pay by Square QR (statický súbor `assets/qr-podpora.svg`), IBAN SK7211000000002943006853, verše 2. Korintským 9, 7 a Filipským 4, 17. Ako príjemca je na stránke uvedené „MILMAT s.r.o." s poznámkou „účet projektu Deň Záchrany". QR sa v minulosti generoval npm balíkom bysquare (len ESM, import cez `bysquare/pay`). Príjemca v dátach QR musí byť „MILMAT s.r.o.", inak ho banka neoverí.

---

## 5. Teológia, jazyk a štýl

### Teológia (dispenzačne, záväzné)
- Veriaci je už odpustený a očistený (Kol 2, 13; Ef 1, 7; Žid 10, 14). V modlitbách **nikdy „Odpusť mi…" ani „očisti ma…"**. Forma je vyznanie a vďaka: „Vyznávam Ti, že… Ďakujem Ti, že mi je to v Tebe už odpustené" (1Jn 1, 9).
- Neprosí sa o Ducha Svätého, ktorý prebýva vo veriacom od uverenia (Ef 1, 13–14). Správne: „Ďakujem Ti, že Tvoj Svätý Duch prebýva v mojom vnútri." Neprosí sa ani o to, čo veriaci už má (napríklad pokoj). Prosba o silu a múdrosť v každodennom živote je v poriadku.
- Výnimka: kapitola 1 (Evanjelium spásy) a Modlitba záchrany sú pre neveriaceho. Tam je „Odpusť mi… a očisti ma" správne.
- Ústne vyznanie viery má svoje miesto (Rimanom 10, 9). Nepíš, že „nezáleží na tom, či povieš správne slová".
- Oslovenie v modlitbe stojí vždy samostatne v prvom odseku a končí čiarkou („Drahý nebeský Otče,“ alebo s prívlastkami „Drahý nebeský Otče, môj verný Bože,“). Za ním prázdny riadok a až potom text modlitby. Pred zápisom modlitby to skontroluj (pokyn Admina 9. 10. 2026; kap. 8 a 13 boli opravené).
- Oslovenie v modlitbe je tvorivé a zároveň biblické. Vychádza z kontextu príhovoru: modlitba smeruje buď k Otcovi, alebo k Pánovi Ježišovi Kristovi. Slovo „Drahý" nie je povinné (napr. modlitby 7, 17 a 18 začínajú „Pane Ježišu Kriste," a tak ostávajú, rozhodnutie Admina 9. 10. 2026). Pri kontrole preto chýbajúce „Drahý" nehlás ako chybu. Bohu nikdy nevykaj.
  - Oslovenie Otca a Syna sa nemusí pravidelne striedať. Či modlitba smeruje k Otcovi alebo k Pánovi Ježišovi, vždy vyplýva z kontextu príhovoru. Príklad: v kapitole 5 je to Pán Ježiš, lebo sám zažil poníženie a krivé obvinenie. Modlitba k Otcovi aj k Pánovi Ježišovi je biblicky doložená (Sk 7, 59–60; Zj 22, 20; 2Kor 12, 8; aj Ján 16, 23; Ef 2, 18).
  - Modlitba k Otcovi má Krista ako cestu k Otcovi vysloviť, buď v závere, alebo zreteľne v texte (Ef 5, 20; Kol 3, 17; Ef 2, 18). Nie je to povinná formulka, preto sa jej znenie obmieňa („v mene Pána Ježiša Krista“, „skrze Pána Ježiša Krista“, „Prinášam Ti to v mene…“). Pri modlitbe k Pánovi Ježišovi sa to nevyžaduje. Modlitbu 4 kvôli tomu znova nenahrávame, doplní sa pri nahrávke z iného dôvodu.
  - Oslovenie môže mať prívlastky, ktoré vyplývajú z kontextu a témy príhovoru (napr. „môj Vodca a moja Cesta", „môj Záchranca a moja Sila"). Prívlastky musia byť absolútne biblické: musia sa opierať o konkrétne miesto v Písme a hodiť sa k tomu, komu je modlitba adresovaná.
- Starozákonné príbehy rámcuj ako typy a tiene (1Kor 10, 11). Pozor na teológiu prosperity.
- Stanovisko Admina: Nevesta Kristova je Izrael a Nový Jeruzalem, nie Cirkev. Cirkev je v dobe milosti Telo Kristovo.
- Piesne sú umelecké vyjadrenie a nemusia byť dispenzačné, dispenzačnú kontrolu na ne neuplatňuj. Verše v „Inšpirácia z Biblie“ však musia byť presné znenie ECAV a text piesne nesmie ísť proti evanjeliu (napríklad naznačovať, že veriaci môže stratiť spásu).

### Verše
- Verš, ktorý sa nepodarí overiť na biblia.sk, radšej vynechaj a povedz to Adminovi.
- **Výhradne evanjelický preklad ECAV z biblia.sk** (`https://biblia.sk/citanie/sep/<kniha>/<kapitola>`, napr. Žalmy = `sep/z/16`). Nie seb, roh ani ssv. Vždy nezávisle over, aj názvy kníh („Židom", nie „Hebrejom"; „Józua"). Overené znenia sú v `docs/BIBLICKE-VERSE-ECAV.md`.
- Drafty takmer vždy obsahujú ekumenické alebo Roháčkovo znenie. Kontroluj opakovanie veršov voči iným kapitolám aj tematické prekrytie.

### Slovenčina
- Genitív s dĺžňom (právd, vôd, rúk, síl).
- Rozkazovací spôsob „očisti", nie „očisť".
- Vokatív „Pane Ježišu", nikdy „Pane Ježiši".
- „v tvojom", nie „vo tvojom".
- „vyhlasujem", nie „prehlasujem".
- Meno apoštola na webe je „Pavel" (ako v ECAV), nie „Pavol". V jednom príhovore ho neopakuj v každej vete.

### Kontrola textov a štýl („ľudský faktor")
- **Pred písaním alebo úpravou akéhokoľvek textu (príhovor, modlitba, popisok, pieseň) si najprv prečítaj `docs/KONTROLA-TEXTOV.md`.** Sú v ňom podrobné pravidlá štýlu, stanovisko k uzdraveniu a modlitbe, zoznam modlitieb na opravu pri novej nahrávke a plán opráv príhovorov.
- **Pred každým predložením textu Adminovi je kontrola povinná:** päť prechodov podľa toho súboru (1. dispenzačný – meradlom sú Pavlove listy, Wommackove princípy len tam, kde ich Pavol potvrdzuje, 2. verše ECAV, 3. slovenčina, 4. bežný čitateľ, 5. súlad príhovoru a modlitby). Adminovi ukáž len nájdené a opravené veci, jeden riadok za prechod.
- Pomocník `node scripts/ukaz.js <N> <časť>` vypíše len zvolenú časť kapitoly (nazov, prihovor, modlitba, verse, tagy, vsetko), napr. `node scripts/ukaz.js 9 modlitba`. Nič nemení.
- Pomocník `node scripts/kontrola-textu.js <N>` len upozorňuje a nezastavuje nasadenie. Hranica 15 slov na vetu je orientačná.
- Krátke vety (do ~15 slov), bežné slová, jemne, bez predpokladov o čitateľovi. Príhovor ~450–650 slov, bez číslovaných medzititulkov.
- Praktický krok na konci príhovoru už nie je povinný v každej kapitole – len tam, kde ho téma prirodzene ponúka. Inak príhovor môže končiť Božou pravdou, v ktorej čitateľ spočinie (zmena pravidla 24. 10. 2026). Kontrolu textu kvôli chýbajúcemu kroku preto nehlás ako chybu.
- Keď sa zmení modlitba, zosúlaď príhovor, a naopak. Modlitba s audiom sa bez novej nahrávky nemení. Opravený príhovor jej nesmie protirečiť.
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
- **Zvukový štandard modlitieb (rozhodnutie Admina 14. 10. 2026, nahrádza štandard z 12. 10.):** vzorové modlitby sú **8 a 9** (meniť ich nikdy). Vždy sa vychádza zo **surovej nahrávky z ElevenLabs** (nie z už upravenej verzie z webu). Postup pre každú novú alebo upravovanú nahrávku:
  1. Surové MP3 → WAV 44,1 kHz mono. Vzory: WAV z modlitba-8.mp3 a modlitba-9.mp3.
  2. Farba: `python3 scripts/farba-hlasu.py vstup.wav vzor8.wav,vzor9.wav farba.wav` (len vzory 8 a 9, nie 6).
  3. Zjemnenie ostrej zložky „i“ (jemné bzučanie v slabikách ako „PRI-chádzam“): `python3 scripts/zjemni-i.py farba.wav zjemnena.wav`. Stlmí pásmo ~2,3–4,8 kHz len v znelých rámcoch, kde (2,5–4,5 kHz − 1–2,5 kHz) presiahne −2 dB (p75 vzorov 8 a 9), sila 0,7, max 6 dB; sykavky nechá. Zasiahne ~10–14 % nahrávky, priemerne ~2 dB.
  4. Hlasitosť −16,4 LUFS: zosilnenie + `alimiter=limit=0.822:level=false` (ak špička vyjde nad −1,7 dBTP, limit 0.80) a dorovnávanie podľa hotového MP3 128 kbps mono (`-write_xing 1`).
  5. Tiché intro ~1 s (`adelay=1000`), ak ho surová nahrávka nemá.
  Bez ďalších zásahov: žiadne `odstran-tony.py` ani `stlm-bzucanie.py`, iba ak Admin ohlási konkrétne miesto (vtedy len na danom úseku). Pred nasadením pošli Adminovi ukážky. Surové nahrávky z ElevenLabs si uchovaj v scratchpade počas úlohy, pôvodné verzie ostávajú v histórii gitu.
  **Ženský hlas** (prvý pri modlitbe 34, 27. 10. 2026): farbu podľa vzorov 8+9 ani zjemnenie „i“ nepoužívať, len hlasitosť −16,4 LUFS a tiché intro. Kontrola [9] ho hlási ako mimo profilu – je to vedomá výnimka.
  Takto boli 14. 10. upravené modlitby 2, 3, 7, 11, 12, 13, 14, 15, 16, 17, 18, 22, 28 a Modlitba záchrany. Modlitby 1, 4, 5, 6, 10, 19, 20, 21, 23–27 ostávajú podľa štandardu z 12. 10. (farba 8+6, zárezy, stlmenie bzučania), surové nahrávky k nim nemáme; prerobia sa, keď Admin dodá surové MP3. Kontrola `VERIFY_AUDIO=1` (audio-profil.py) meria voči priemeru zjednotených modlitieb, tolerancia ±3 dB (vzory 8 a 9 sa nekontrolujú), a hlási trvalý bzučiaci tón nad 6,5 dB.
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
- Hlasitosť **−13,3 LUFS, špička −1,7 dBTP**. Dvojpriechodový loudnorm len vtedy, keď mix má rezervu (špička po zosilnení neprekročí −1,7 dBTP). Inak zosilnenie + alimiter a opakovať na −13,3 LUFS, pozri docs/REMASTER-PIESNI.md.
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
- Grafika: prechod z krémovej do modrosivej, zlatá žiara, symbol ryby (ΙΧΘΥΣ, ako v logu webu; kríž sa už nepoužíva), vinetácia, jemné zrno, zlatý rám.

---

## 7. Stav a otvorené úlohy (k 28. 10. 2026)

- Na webe je 36 kapitol (35 s audio modlitbou, kapitola 36 zatiaľ bez nahrávky) a 22 piesní, ďalej úvodné slovo, Modlitba záchrany na domovskej stránke a stránka Podpora. Service worker v238, verify.js 639 kontrol (s VERIFY_AUDIO=1 662, upozornenia len pri modlitbách 34 a 35 mimo profilu – ženský hlas, vedomá výnimka). 28. 10. (2. dávka) SEO: lastmod v sitemap.xml podľa skutočnej zmeny stránky (git; bez priority a changefreq), titulky kapitol s doplnkom „– modlitba a verše“, ak sa zmestia do 60 znakov, popis piesní pre vyhľadávače = popisok + pevná veta (popisok sa nemení), nové popisy stránok Kapitoly a Piesne, obrázok na zdieľanie assets/og-image.jpg (74 kB; PNG ostáva v repozitári). Admin si ešte sám skontroluje Search Console (indexovanie, sitemap) a pridá web do Bing Webmaster Tools. 28. 10. (3. dávka): modlitba 36 pred nahrávaním upravená („Ďakujem Ti, že si pri mne. Potešuj prosím aj otca môjho dieťaťa…“). 28. 10. (2. dávka): nová kapitola 36 „Keď prídeš o dieťa ešte pred narodením“ (4 verše, ženský rod, modlitba k Otcovi, ikona knihy „leaf“), zatiaľ bez audia. 28. 10.: kapitola 35 – nový názov a shortDescription (jednoznačne o tehotenstve). 27. 10. (3. dávka): nová kapitola 35 „Keď túžiš po dieťati a nedarí sa ti otehotnieť“ (4 verše, ženský rod, modlitba k Otcovi, ikona knihy „jar“) s nahrávkou ?v=1 (ženský hlas, len hlasitosť a tiché intro); v príhovore opravené „doliehá“ → „dolieha“. 27. 10. (2. dávka): pieseň 22 – nový verš 1. Tesalonickým 5, 9 (predposledný) a čiarka „Zostaň v Pravde ukotvený,“. 27. 10.: nová kapitola 34 „Keď sa staráš o cudzích a tvoji sú ďaleko“ (3 verše, ženský rod, modlitba k Pánovi Ježišovi, odkaz „v sekcii Piesne“, ikona knihy „house“) s nahrávkou ?v=1 – prvá modlitba ženským hlasom, spracovaná len hlasitosťou −16,4 LUFS a tichým intro, bez farby podľa vzorov 8+9 (rozhodnutie Admina po vypočutí ukážok). 26. 10. (2. a 3. dávka): prehrávač na stránkach piesní ostáva pri čítaní textu hore (sticky), ako pri modlitbách, a v prilepenom stave ukazuje názov piesne; v piesni 22 „Zostaň v Pravde ukotvený“. 26. 10.: nová pieseň 22 „Systém AI“ (6 veršov ECAV, popisok „Pravda, ktorá obstojí aj v dobe technológií“); master podľa štandardu (spev cez rozdelenie na stopy jemne +1,5 dB oproti podkladu, tiché intro 0,96 s, −13,3 LUFS, −1,8 dBTP, 48 kHz, 320 kbps). Pieseň 9: 6 veršov opravených na znenie ECAV (Mt 24, 33; Iz 5, 20; Mt 16, 3; Sk 4, 12; 1Jn 1, 7; Zj 3, 20). Kontrola veršov ostatných piesní voči ECAV zatiaľ neprebehla (Admin ju 26. 10. odložil). 25. 10. (2. dávka): automatická kniha PDF (GitHub Actions, vydanie `kniha`), tlačidlá na stiahnutie na konci stránky Kapitoly, odkaz na Podpore, „Pavol“ → „Pavel“ na Podpore. 25. 10.: nový slogan na domovskej stránke „Nemôžeš otvárať dvere v dome, do ktorého si ešte nevstúpil.“ a v úvodnom slove nahradená len táto veta (uvod-v3.mp3 ?v=9). 24. 10.: nová kapitola 33 „Keď je tvoj blízky odkázaný na tvoju pomoc“ (4 verše, modlitba k Otcovi, bez samostatného praktického kroku na konci) s nahrávkou ?v=1 (štandard zo 14. 10. zo surovej nahrávky). 22. 10.: nová kapitola 32 „Keď zomrel niekto blízky a nevieš, kde je“ (4 verše, modlitba k Pánovi Ježišovi, odkaz „v Modlitbe záchrany“) a v ten istý deň modlitba 32 s nahrávkou ?v=1 (štandard zo 14. 10. zo surovej nahrávky). 17. 10.: nová kapitola 30 „Keď sa ti rozpadá manželstvo“ (5 veršov, modlitba k Pánovi Ježišovi). 19. 10.: nová kapitola 31 „Keď ťa ťažia dlhy“ (5 veršov, modlitba k Otcovi) s nahrávkou ?v=1 a nahrávka modlitby 30 ?v=1 (obe štandard zo 14. 10. zo surovej nahrávky); úloha „Kapitola 30 – čaká na nahrávku“ je hotová. 17. 10.: prehrávač modlitby ostáva pri čítaní modlitby stále hore (sticky). 3. 10. SEO: robots.txt už neblokuje pocuvaj.html (má noindex, Google ho musí vidieť), titulky kapitol do 60 znakov (prívesok „— Deň Záchrany“ sa pri dlhých vynechá), drobčeky (BreadcrumbList) na stránkach kapitol a piesní. Kapitoly 9 (uzdravenie, 29. 9.) a 10 (autorita a identita v Kristovi, 30. 9.) majú nový príhovor aj novú modlitbu s nahrávkou. 1. 10.: kapitola 1 (príhovor, verš 1Kor 15, 3 – 4, nová modlitba 1), nové úvodné slovo s nahrávkou a príhovor kapitoly 2. 2. 10.: príhovor kapitoly 3, kapitola 4 (príhovor aj nová modlitba s nahrávkou) a veta o treste v kap. 9. 4. 10.: kapitola 5 (nový názov „Keď ťa ponížili a ukrivdili ti", príhovor, 4 verše a nová modlitba s nahrávkou, oslovenie „Drahý Pane Ježišu Kriste,"). 4. 10.: kapitola 6 (nový názov „Keď už nevládzeš bojovať sám", príhovor, 4 verše, nová modlitba 6 s nahrávkou ?v=5, oslovenie „Drahý nebeský Otče, moje Útočisko a moja Pomoc,") a v kap. 19 „..." → „…" pri Rim 8, 1. Schválené opravy príhovorov sa zbierajú v `docs/SCHVALENE-PRIHOVORY.md` (po kapitolách, nasadenie hromadne). 7. 10.: nová kapitola 28 „Boh nezmení, čo povedal“ (Božia vernosť, viera ako dôvera, nie postup; podklad bol článok o „duchovných zákonoch“), modlitba 28 s nahrávkou ?v=1 (len hlasitosť a tiché intro, bez EQ). 8. 10.: kapitola 13 „Keď je telo príliš hlučné“ (nový podnadpis, príhovor, 4 verše a nová modlitba 13 s nahrávkou ?v=4, len hlasitosť a tiché intro). 9. 10.: kapitola 8 „Keď ti strach premieta najhoršie scenáre“ (nový názov, podnadpis, príhovor, 3 verše, tagy, nová modlitba 8 s nahrávkou ?v=5, len hlasitosť a tiché intro). 9. 10.: kapitola 11 „Pán riadi moje kroky“ (príhovor, 3 verše, nová modlitba 11 s nahrávkou ?v=5, len hlasitosť a tiché intro). 12. 10.: zvukový štandard – modlitby 1–7 a 10–28 zjednotené k vzorom 8 a 9 (farba, odstránenie trvalých tónov pri starších nahrávkach, ?v=+1 pri všetkých). 12. 10.: kapitola 7 „Keď sa bojíš, že si zmeškal Božiu vôľu“ (nový názov, príhovor, 4 verše, nová modlitba 7 s nahrávkou ?v=5, štandard so stlmením bzučania na 2 úsekoch); Žalm 34, 11 vypadol. 9. 10.: nový príhovor kapitoly 23 (len fullText, verše a modlitba ostali). 9. 10.: modlitba 20 opravená (bzučanie 5–14 kHz stlmené len na dotknutých úsekoch, lupnutie v 0:03,7 stlmené), ?v=5; oslovenie modlitieb 8 a 13 dané do samostatného odseku. 13. 10.: nové modlitby 15, 17, 18 s nahrávkou (?v=6, 6, 9, nový štandard), v kap. 15 „Efezanom“ → „Efezským“ a dve vety príhovoru; Modlitba záchrany upravená na nový štandard (index.html ?v=2). 14. 10.: nové modlitby 2, 3, 12, 14, 16, 22 s nahrávkou (?v=6, 6, 7, 5, 6, 7, nový štandard; oslovenie 12 „môj Boh pokoja“ je schválená výnimka). 14. 10. (2. dávka): nový zvukový štandard zo surových nahrávok (farba podľa 8+9, zjemnenie „i“ cez scripts/zjemni-i.py) pre modlitby 2, 3, 7, 11, 12, 13, 14, 15, 16, 17, 18, 22, 28 (?v+1) a Modlitbu záchrany (index.html ?v=3). 14. 10.: nový príhovor kapitoly 22 (7 veršov, Mt 5, 28 zarámcovaný, dĺžka ~1 190 slov schválená výnimka). 15. 10.: nová kapitola 29 „Keď sa trápiš o svoje deti“ (5 veršov, ~726 slov schválená výnimka) a modlitba 29 s nahrávkou ?v=1 (štandard zo 14. 10. zo surovej nahrávky); úloha „Kapitola 29 – čaká na nahrávku“ je hotová. Pieseň 17 má remaster (26. 9.). Príhovory 3, 7, 8, 17, 25 opravené podľa Pavla (28. 9.).
- Všetky audioUrl modlitieb a piesní majú cache-bust `?v=N`. Pod prehrávačom Modlitby záchrany je riadok „Počúvaj a čítaj súčasne". V úvodnom texte domovskej stránky sú „Evanjelium spásy" a „Modlitbu záchrany" odkazy v rovnakom štýle ako odkazy pod Modlitbou záchrany (bežná farba, zlaté podčiarknutie; štýl priamo v index.html).
- Sťahovanie MP3 funguje: kapitoly aj piesne majú tlačidlo na stiahnutie. Súbor sa sťahuje priamo z GitHubu (raw.githubusercontent.com), aby nezaťažoval prenos na Verceli.
- **Odložené:**
  - Oprava príhovoru 12 a drobnosti v 14 a modlitby na opravu pri novej nahrávke (11; 19, 20, 21 šablónové „v mene… / V mocnom mene…“): zoznam v `docs/KONTROLA-TEXTOV.md`. Príhovor 22 hotový 14. 10. (dĺžka ~1 190 slov je schválená výnimka).
  - Kapitola 36 – čaká na nahrávku modlitby (modlitba-36.mp3).
  - Kapitola 37 – umelé prerušenie tehotenstva (vina a milosť) – nadväzuje na kap. 36, v príprave.
  - Súvislé prehrávanie piesní (⏭/⏮, Media Session).
  - Skontrolovať verše všetkých piesní voči ECAV na biblia.sk (pieseň 9 mala 6 odlišných znení; zoznam rozdielov ukázať Adminovi, neopravovať samostatne).
  - Rozšírené sťahovanie – odľahčená verzia 192 kbps a text o voľnom nekomerčnom použití.
  - Prerobiť modlitby 1, 4, 5, 6, 10, 19, 20, 21, 23–27 na štandard zo 14. 10. (treba surové MP3 z ElevenLabs).
  - Overiť limity a podmienky raw.githubusercontent.com pre sťahovanie MP3 (zatiaľ neoverené). Pri výraznom raste návštevnosti presunúť sťahovanie MP3 napr. na GitHub Releases.
  - SEO: Search Console a Bing Webmaster Tools (robí Admin); odkazy z iných webov.
  - Vlastná doména.
  - Krátke videá.
  - Exkluzívny obrázok pre darcov (bez zbierania e-mailov).
