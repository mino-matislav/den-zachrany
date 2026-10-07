# Kontrola textov pred predložením Adminovi

Platí pre príhovor, modlitbu, shortDescription a samostatné biblické články. CLAUDE.md prikazuje prečítať tento súbor pred písaním alebo úpravou akéhokoľvek textu.

**Piesne** sú umelecké vyjadrenie a dispenzačne sa nekontrolujú (rozhodnutie Admina 28. 9. 2026). Verše v „Inšpirácia z Biblie" však musia byť presné znenie ECAV a text piesne nesmie ísť proti evanjeliu (napríklad naznačovať, že veriaci môže stratiť spásu).

## Postup (šetrí tokeny)

1. `node scripts/kontrola-textu.js <číslo kapitoly>`, pri koncepte `--text <súbor>`. Skript mechanicky nájde zakázané frázy, dlhé vety, opakované slová, dĺžku príhovoru, opakované verše a verše, ktoré treba zarámcovať. Je to len pomocník: upozorňuje, nezastavuje nasadenie a hranica 15 slov na vetu je orientačná. Každé upozornenie posúď.
2. Päť prechodov nižšie, každý s jedinou úlohou. Rob ich v hlave, text počas nich znova nevypisuj.
3. Adminovi ukáž najprv jeden riadok za prechod (čo si našiel a opravil), potom text.
4. Verše, ktoré sú už v `docs/BIBLICKE-VERSE-ECAV.md`, znova neoveruj. Nové over a do zoznamu doplň.

## Prechod 1: dispenzačný (meradlom sú Pavlove listy)

Zásada schválená Adminom 28. 9. 2026:
- Učenie pre Cirkev v dobe milosti berieme z Pavlových listov (Rimanom až Filemonovi). Celé Písmo je pre nás, ale nie všetko je adresované nám (2Tim 2, 15; 1Kor 10, 11; Rim 15, 4).
- Princípy Andrewa Wommacka používame tam, kde ich Pavol potvrdzuje: milosť namiesto zákona, Boh sa na veriaceho nehnevá (Rim 5, 1), nový duch a obnova mysle Slovom (2Kor 5, 17; Rim 12, 2; 1Tes 5, 23), veriaci už má všetko v Kristovi a o to neprosí (Ef 1, 3; Kol 2, 10), odpor diablovi vo výzbroji (Ef 6, 10–18).
- Kde princíp stojí len na evanjeliách pred krížom alebo na Starom zákone, text zarámcuj (kto hovorí, komu, čo z toho spoznávame o Bohu), alebo ho vynechaj. Vzorom sú kapitoly 18, 19, 20 a 27.

V nových textoch nepoužívaj:
- prikazovanie duchom, telu, emóciám ani okolnostiam („prikazujem", „odíď", hovorenie k vrchu podľa Marka 11, 23),
- „uvoľňujem Tvoju moc / Tvoj pokoj" (u Pavla koná Boh v nás, Fil 2, 13),
- „prestaň prosiť". Pavol prosí sám (Ef 1, 16–19; Kol 1, 9) a učí prosiť s vďakou (Fil 4, 6),
- sľub uzdravenia vždy a hneď alebo sľub hojnosti (pozri stanovisko nižšie),
- Kázeň na vrchu, Marka 11 či Lukáša 10 ako pravidlo „doby milosti",
- Matúša 24 ako nádej Cirkvi. Tou je vytrhnutie (1Tes 4, 16–17; Tít 2, 13),
- Boží hlas mimo Písma. Dnes Boh hovorí cez dokončené Písmo (Žid 1, 1–2; 2Tim 3, 16–17).

### Stanovisko k uzdraveniu a modlitbe (Admin, 28. 9. 2026)
- Boh uzdravuje a môžeme Ho o to prosiť. Nesľubujeme však uzdravenie vždy a hneď. Chorý nesmie dostať pocit, že je chorý pre malú vieru. Pavol nechal Trofima chorého (2Tim 4, 20), Epafroditus bol na smrť chorý (Fil 2, 27) a Pavlovi Pán povedal „Dosť máš na mojej milosti" (2Kor 12, 9). Vykúpenie tela príde pri vytrhnutí Cirkvi, keď Pán zostúpi z neba (Rim 8, 23; 1Kor 15, 51–53; 1Tes 4, 16–17; Fil 3, 20–21). Dovtedy aj veriaci vzdychá v smrteľnom tele (2Kor 5, 4).
- Prosba s vďakou je správna (Fil 4, 6). Diablovi veriaci odporuje (Ef 6, 10–18; Jak 4, 7), Bohu neprikazujeme. Neprosíme o to, čo už máme v Kristovi.
- Kapitolu 7 o Božej zvrchovanosti netreba meniť, Pavol ju potvrdzuje (Ef 1, 11; Rim 8, 28).

### Wommack a uzdravenie: čo Pavol potvrdzuje a kde nie (analýza kap. 9, 29. 9. 2026)
Pri téme choroby tieto body vždy zapracuj. Nestačí napísať len „choroba nie je trest".

Pavol potvrdzuje, preto to do textu patrí:
- Boh sa na veriaceho nehnevá a choroba nie je trest (Rim 5, 1; Rim 8, 1).
- Človek je duch, duša a telo (1Tes 5, 23). Duch je v Kristovi nový a má všetko (2Kor 5, 17; Kol 2, 10). Myseľ sa obnovuje Slovom (Rim 12, 2). Telo čaká na vykúpenie (Rim 8, 23).
- Strachu a lžiam („je koniec", „Boh zabudol") veriaci odporuje. Sú to ohnivé šípy, proti ktorým stojí štít viery a meč Ducha, teda Slovo (Ef 6, 16 – 17). Lekárska správa hovorí o tele, posledné slovo má Boh. Lekára pritom nezľahčujeme (Kol 4, 14, „milovaný lekár").
- Milosť namiesto zákona: uzdravenie si nikto nezaslúži výkonom ani „dostatočnou vierou".
- Duch veriaceho je v Kristovi dokonalý (Kol 2, 10 v ECAV: „prišli ste k dokonalosti v Ňom"; Žid 10, 14; Žid 12, 23; 1Kor 6, 17; Ef 4, 24). Vždy hovor o duchu, nie o celom človeku. Pavol o svojom živote píše „Niežeby som… bol už dokonalý" (Fil 3, 12). Myseľ sa obnovuje, telo čaká.
- Pri nádeji vykúpenia tela nezabudni na toho, kto zomrie skôr: najprv vstanú tí, čo umreli v Kristovi (1Tes 4, 13 – 16). Kto zomrie, prebýva s Pánom (2Kor 5, 8; Fil 1, 23). Pre ťažko chorého čitateľa to povedz jemne („ak by som k Tebe odišiel skôr").

Pavol nepotvrdzuje, preto to do textu nedávaj:
- „Boh chce uzdraviť vždy a hneď." Proti tomu stoja Trofim (2Tim 4, 20), Epafroditus (Fil 2, 27), Timotej s častými chorobami, ktorému Pavol poradil praktický prostriedok (1Tim 5, 23), a odpoveď Pavlovi (2Kor 12, 9). Nikomu z nich Pavol nevyčítal malú vieru.
- „Uzdravenie tela je už hotové, stačí ho prijať" (1Pt 2, 24; Iz 53). Ef 1, 3 hovorí o duchovných požehnaniach. O uzdravenie tela preto prosíme s vďakou (Fil 4, 6). Nie je to žobranie, prosíme ako prijaté deti. Neprosíme len o to, čo už máme (odpustenie, Duch, pokoj s Bohom, prijatie).
- Prikazovanie chorobe alebo telu (Mk 11, 23). Pavol svoj osteň nazýva „anjel-satan", a predsa ho neprikazoval, ale trikrát prosil Pána (2Kor 12, 7 – 8).
- „Choroba je vždy od diabla." Pavol to niekedy tak pomenuje (2Kor 12, 7), väčšinou však hovorí o smrteľnom tele a stvorenstve, ktoré vzdychá (Rim 8, 22; 2Kor 4, 16).

Pasce vo veršoch k uzdraveniu:
- Jeremiáš 30, 17 pokračuje „…to je Sion". Je to zasľúbenie Izraelu, nie osobné zasľúbenie Cirkvi.
- 1Pt 2, 24 hovorí v kontexte o hriechu („aby sme odumreli hriechom… boli ste ako blúdiace ovce"). Nepoužívaj ho ako dôkaz, že telo je už uzdravené.
- Skutky 10, 38 majú v ECAV „diablom posadnutých", nie „sužovaných diablom".
- 2Kor 12, 9 v ECAV: „Dosť máš na mojej milosti", nie „stačí ti moja milosť".
- 2Kor 4, 13 („aj my veríme, a preto aj hovoríme") hovorí o zvestovaní evanjelia v utrpení. Nepoužívaj ho ako základ „pozitívneho vyznania" nad vlastnými myšlienkami či telom.
- Autoritu veriaceho formuluj skromne podľa Pavla: Kristus je nad kniežatstvami a my sme posadení s Ním (Ef 1, 20 – 21; 2, 6). Nie „ty stojíš nad diablom".

### Wommackov princíp v Pavlovom jazyku (záväzné, 7. 10. 2026)
Princíp „už to máš, uplatňuj to" je Pavlov a nesmie z textov vypadnúť.
- Už máš: Ef 1, 3 („…požehnal v Kristovi Ježišovi všetkým duchovným požehnaním"); Kol 2, 10.
- Uplatňuj, Pavlovými slovesami: poznávať, čo mám (Flm 6; Ef 1, 18 – 19); súdiť, teda počítať s tým (Rim 6, 11 v ECAV: „Tak súďte aj vy, že ste mŕtvi hriechu a živí ste Bohu v Kristovi Ježišovi."); kraľovať v živote (Rim 5, 17); konať, čo Boh pôsobí (Fil 2, 12 – 13); obliecť si nového človeka a výzbroj (Ef 4, 24; 6, 11); obnovovať myseľ (Rim 12, 2); podrobovať myšlienky Kristovi (2Kor 10, 5); odolať a obstáť (Ef 6, 13).
- Za Pavla nejde: „všetko" ako zdravie tela a peniaze hneď (Ef 1, 3 hovorí o duchovných požehnaniach; Rim 8, 23; Fil 4, 12); prikazovať telu, chorobe, okolnostiam či mysli; „neprosiť"; zaručený výsledok. Prikazovanie duchom: Pavel raz v Sk 16, 18 (čas znamení), v listoch cirkvám to veriacich neučí. V textoch preto: stáť, odporovať, výzbroj.
- Náhrady v modlitbách:
  - „Uvoľňujem Tvoj pokoj" → „Ďakujem, že Tvoj pokoj je vo mne. Prijímam ho a nechávam ho rozhodovať v mojom srdci."
  - „Prikazujem svojej mysli" → „Podrobujem svoje myšlienky Kristovi a obnovujem myseľ Tvojím Slovom."
  - „Zmĺkni a odíď" → „Odmietam strach. Obliekam si celú výzbroj Božiu a stojím v pravde."
  - Nové: „Prijímam vierou, čo mi v Kristovi už patrí." „Počítam s tým, že som mŕtvy hriechu a živý Bohu."
- Každá nová a prepisovaná modlitba má časť, kde čitateľ aktívne uplatňuje, čo už v Kristovi má.
- Hotové nové modlitby (1, 4, 5, 6, 9, 10, 28) a úvodné slovo sa nemenia.

„Vyhlasujem" je v poriadku, keď vyznáva pravdu z Pavlových listov („vyhlasujem, že v Kristovi nie som odsúdený").
Záväzné pravidlá o odpustení, Duchu Svätom, oslovení a Neveste sú v CLAUDE.md, sekcia 5.

## Prechod 1b: celok webu (bez opakovania)
Web má pokryť rôzne ľudské bolesti jednotným, citlivým štýlom. Pred predložením textu porovnaj s ostatnými kapitolami:
- nielen blokové verše, ale aj verše v zátvorkách, citáty v próze a vety v modlitbe (napr. „nič ma nemôže odlúčiť od Tvojej lásky" už končí modlitbu 9),
- tému a uhol pohľadu: kapitola má mať vlastné ťažisko (napr. 23 = duch, duša, telo; 9 = choroba; 10 = autorita a identita v Kristovi),
- najmä kapitoly napísané v posledných dňoch.
Opakovanie len vtedy, keď je nutné, a potom inými slovami.

### Vzory z kapitoly 5 (4. 10. 2026)
- **Opakovanie medzi modlitbami:** pred predložením novú modlitbu strojovo porovnaj so všetkými modlitbami na webe. Zhoda štyroch a viac slov za sebou je opakovanie. Úvod „Drahý nebeský Otče, prichádzam…" už má 15 modlitieb, preto voľ iné oslovenie, ak sa hodí k téme (napr. Pána Ježiša, ktorý sám zažil poníženie). Oslovenie však vždy v tvare z CLAUDE.md („Drahý Pane Ježišu Kriste, …").
- **Dokonalosť:** hovoriť ju o duchu („V duchu som v Tebe nový a celý"), dušu opísať ako tú, ktorá sa obnovuje Slovom (Rim 12, 2). Nepísať „moje uzdravenie je už dokonané".
- **Krivda:** pomstu nechať Bohu (Rim 12, 19), no zároveň sa smieme brániť pravdou a zákonnou cestou (Sk 25, 10 – 11). Starozákonné príbehy (Jozef) zarámcovať: „nie je to sľub, že…".
- **Kontext verša:** overiť, komu je verš adresovaný (1Kor 4, 5 „nič nesúďte" hovorí tým, čo súdia, preto sa ako blokový verš použili verše 3 – 4).

### Vzory z kapitoly 4 (2. 10. 2026)
- **Trest, výchova, následky.** Trest a odsúdenie za hriech veriaci nenesie, niesol ho Kristus (Rim 8, 1; Gal 3, 13; Rim 5, 9; 1Tes 5, 9). Výchova existuje a je to láska otca (1Kor 11, 32). Následky existujú (Gal 6, 7), ale nikdy ich nečítať spätne z tragédie. Nepísať „Boh ťa netrestá", ale „Trest za tvoje hriechy už niesol Kristus. Preto ťa Boh neodsudzuje."
- **Jób.** Bol bezúhonný. Pri ranách nezhrešil (1, 22; 2, 10), nepísať „nikdy". Nešťastie spôsobil satan a Boh mu určil hranicu (1, 12; 2, 6). Strach z Jób 3, 25 nezdôrazňovať a výklad „strach otvoril dvere" nepoužívať (2, 3 „bez príčiny"). Dvojnásobné navrátenie nepoužívať ako sľub.
- **Texty pre smútiacich.** Písať jednoducho. Hovoriť o smútku, bolesti a prázdnote, nie o hneve. Rešpektovať, keď chce človek byť sám. Každý odsek má priniesť pravdu, ktorú môže prijať hneď.
- **Neprosiť o to, čo už máme.** Písať „Ďakujem, že si pri mne", nie „Buď pri mne".
- **Autorita v Kristovi** znamená odmietnuť lži, nie prikazovať okolnostiam.
- **Úvodzovky.** V úvodzovkách je iba doslovné znenie ECAV. Ak treba iný slovosled, napísať to bez úvodzoviek ako bežnú vetu s odkazom v zátvorke.

### Vzory z kapitoly 3 (2. 10. 2026)
- Príhovor má dať čitateľovi aj jeden jednoduchý praktický krok, nielen vysvetlenie (napr. „povedz obavy Bohu jednu po druhej a pri každej poďakuj").
- Príklady majú platiť pre akúkoľvek chvíľu, nie len pre jednu situáciu („keď na teba doľahnú obavy", nie „večer").

### Vzory z kapitoly 2 (1. 10. 2026)
- Pred predložením prejdi aj tieto vzory (z kapitoly 1 a 2). Pri kapitole 2 som za veršom zopakoval jeho obsah, hoci som to pravidlo sám zapísal.
- Výklad nepodávaj ako tvrdenie Písma (napr. „diabol formuluje myšlienky v prvej osobe"). Radšej opatrne: „jeho klamstvá často znejú ako tvoje vlastné myšlienky".
- Nie každá ťaživá myšlienka je od diabla, niektoré prináša únava, choroba alebo bolesť.
- Nepíš nič, čo by človeka v úzkosti odradilo od odbornej pomoci (napr. výpady proti „svetskej psychológii").
- Pozor na dvojice podobne znejúcich slov tesne za sebou („vzoprieť sa… oprieť sa").
- Podnadpis a krátky popis zosúlaď s opraveným príhovorom (nesmú stavať na tom, čo z príhovoru vypadlo).
- Názvy kníh jednotne podľa veršov: „1. Jánov", nie „1. Ján".

### Vzory z kapitoly 1 (30. 9. 2026)
- Boh vedie aj neveriaceho („dobrota Božia ťa vedie k pokániu", Rim 2, 4). Nepísať, že človek nezakúsi Božie vedenie, kým neuverí. Vedenie Duchom je znak Božích detí (Rim 8, 14).
- Krok človeka je viera (Rim 10, 9; Ef 2, 8). Zmierenie získal Kristus na kríži (Rim 5, 10; Ef 2, 16), človek ho vierou prijíma (Rim 5, 11). Obnova Duchom a nové stvorenie sú Božie dielo (Tít 3, 5; 2Kor 5, 17), nie krok človeka.
- Za blokovým veršom neopakovať jeho obsah vlastnými slovami. Pridať len to, čo verš nehovorí, alebo výzvu.

## Prechod 2: verše (ECAV)

Pravidlá sú v CLAUDE.md (sekcia 5, Verše). Každý nový verš porovnaj znak po znaku s biblia.sk (preklad sep), skontroluj názov knihy, opakovanie v iných kapitolách a zhodu `fullText` a `verses`.

## Prechod 3: slovenčina

Zoznam je v CLAUDE.md (sekcia 5, Slovenčina). Navyše prirodzený slovosled a Ň veľkým pri zámene pre Božie Slovo.

## Prechod 4: bežný čitateľ („ľudský faktor")

- Píš, akoby písal človek pre ľudí, aj pre jednoduchších čitateľov. Krátke vety (do ~15 slov), jedna myšlienka v jednej vete, bežné slová, konkrétne obrazy.
- Keď vetu vyškrtneš alebo skrátiš, skontroluj zámená a podmet v nasledujúcich vetách („Jeho spolupracovník" potom odkazoval na Boha namiesto Pavla, kap. 9).
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
- O Božom Slove hovor v prítomnom čase. Človek sám zo seba nevie, čo je správne (Prísl 14, 12).
- Dĺžka príhovoru ~450–650 slov (medián 520). Bez číslovaných medzititulkov.

## Prechod 5: súlad príhovoru a modlitby

Príhovor a modlitba musia hovoriť to isté: rovnaká hlavná myšlienka, žiadne protirečenie, modlitba nesmie prosiť o to, čo príhovor označil za už dané. Platí aj pri oprave jedného z nich.

## Modlitby s audiom

Text modlitby na webe sa musí zhodovať s nahrávkou. Bez novej nahrávky z ElevenLabs sa preto nemení.
Opravený príhovor nesmie protirečiť modlitbe, ktorá ostáva. Pavlov pohľad a rámec doplň, posolstvo neobracaj.

### Modlitby na opravu pri najbližšej nahrávke (analýza 28. 9. 2026)
- **12:** text na webe už má opravu („Priznávam… Ďakujem Ti, že mi je to v Tebe už odpustené"). Neoverené je, či to platí aj pre audio. Ak nahrávka hrá staré „Odpusť mi to, Otče", text a zvuk sa nezhodujú.
- **3** (nepovinné, pri ďalšej nahrávke): „Ukončujem túto modlitbu" → „Končím túto modlitbu". Ďalej modlitba pripisuje Fil 4, 19 Pánovi Ježišovi („verím Tvojmu svedectvu z listu Filipským") a parafrázuje „naplní" namiesto ECAV „uspokojí".
- **2:** pri ďalšej nahrávke „Prehlasujem" → „Vyhlasujem" a „obetu" → „obeť".
- **8, 11, 13:** prikazovanie duchom a mysli (8: „hovorím k tomuto strachu… Umĺknite").
- **5:** HOTOVÉ, nová modlitba s nahrávkou nasadená 4. 10. 2026.
- **6:** HOTOVÉ, nová modlitba s nahrávkou nasadená 4. 10. 2026.
- ~~**4**~~ Hotové 2. 10. 2026: nová modlitba 4 s nahrávkou.
- **13, 15, 17, 18:** „uvoľňujem".
- **7:** „vyhlasujem, že nebudem mať nedostatku" (Ž 34, 11); „uč ma hľadať najprv Tvoje kráľovstvo".
- **8:** „podľa knihy Józuovej 1, 8"; „vyhlasujem, že viera vo mne je…".
- ~~**1** (Modlitba spásy)~~ Hotové 1. 10. 2026: nová modlitba 1 s nahrávkou. Rim 10, 13 v ECAV: „Každý človek totiž, ktorý by vzýval meno Pánovo, bude spasený." (iné znenie necitovať).
- ~~**Úvodné slovo**~~ Hotové 1. 10. 2026: nový text aj nahrávka (vrátane Dôležitého upozornenia). Citát „Nemôžeš odomknúť dvere domu…" je zámerný.

### Plán opráv príhovorov (schválené 28. 9. 2026, každý návrh najprv Adminovi)
- ~~Spolu v jednej úlohe: 3, 7, 25, 8, 17~~ Hotové 28. 9. 2026 (kap. 7: Mt 6, 33 nahradený Kol 3, 1–2; kap. 17: doplnený Rim 12, 18).
- Kap. 7: zarámcovať Žalm 34, 11 („nemajú nedostatku"), aby nevyznel ako sľub hmotného dostatku.
- ~~9~~ Hotové 29. 9. 2026 (nový príhovor aj nová modlitba s nahrávkou).
- Každá zvlášť: 12 (ťažisko na Písme, nie na vnútornom hlase).
- Nové nálezy (prehľad príhovorov 30. 9. 2026, podľa pravidiel o uzdravení a Wommackovi):
  - ~~10~~ Hotové 30. 9. 2026 (nový príhovor aj modlitba s nahrávkou, ťažisko autorita a identita v Kristovi).
  - ~~4~~ Hotové 2. 10. 2026.
  - 23 (zvlášť): „nespočíva v tom, aby si niečo vyprosil…, ale… uvoľnil" proti Fil 4, 6; Ef 1, 16.
  - Drobnosti: ~~1, 2, 3~~ vyriešené novými príhovormi (1. – 2. 10. 2026). Ostáva: ~~6~~ (hotové 4. 10. 2026), 14 (Mt 11, 28 bez rámca), 22 (Mt 5, 27 – 28, doplniť Pavla, Kol 3, 5).
