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
- Boh uzdravuje a môžeme Ho o to prosiť. Nesľubujeme však uzdravenie vždy a hneď. Chorý nesmie dostať pocit, že je chorý pre malú vieru. Pavol nechal Trofima chorého (2Tim 4, 20), Epafroditus bol na smrť chorý (Fil 2, 27) a Pavlovi Boh povedal „stačí ti moja milosť" (2Kor 12, 9). Vykúpenie tela príde pri vytrhnutí Cirkvi, keď Pán zostúpi z neba (Rim 8, 23; 1Kor 15, 51–53; 1Tes 4, 16–17; Fil 3, 20–21). Dovtedy aj veriaci vzdychá v smrteľnom tele (2Kor 5, 4).
- Prosba s vďakou je správna (Fil 4, 6). Diablovi veriaci odporuje (Ef 6, 10–18; Jak 4, 7), Bohu neprikazujeme. Neprosíme o to, čo už máme v Kristovi.
- Kapitolu 7 o Božej zvrchovanosti netreba meniť, Pavol ju potvrdzuje (Ef 1, 11; Rim 8, 28).

„Vyhlasujem" je v poriadku, keď vyznáva pravdu z Pavlových listov („vyhlasujem, že v Kristovi nie som odsúdený").
Záväzné pravidlá o odpustení, Duchu Svätom, oslovení a Neveste sú v CLAUDE.md, sekcia 5.

## Prechod 2: verše (ECAV)

Pravidlá sú v CLAUDE.md (sekcia 5, Verše). Každý nový verš porovnaj znak po znaku s biblia.sk (preklad sep), skontroluj názov knihy, opakovanie v iných kapitolách a zhodu `fullText` a `verses`.

## Prechod 3: slovenčina

Zoznam je v CLAUDE.md (sekcia 5, Slovenčina). Navyše prirodzený slovosled a Ň veľkým pri zámene pre Božie Slovo.

## Prechod 4: bežný čitateľ („ľudský faktor")

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
- O Božom Slove hovor v prítomnom čase. Človek sám zo seba nevie, čo je správne (Prísl 14, 12).
- Dĺžka príhovoru ~450–650 slov (medián 520). Bez číslovaných medzititulkov.

## Prechod 5: súlad príhovoru a modlitby

Príhovor a modlitba musia hovoriť to isté: rovnaká hlavná myšlienka, žiadne protirečenie, modlitba nesmie prosiť o to, čo príhovor označil za už dané. Platí aj pri oprave jedného z nich.

## Modlitby s audiom

Text modlitby na webe sa musí zhodovať s nahrávkou. Bez novej nahrávky z ElevenLabs sa preto nemení.
Opravený príhovor nesmie protirečiť modlitbe, ktorá ostáva. Pavlov pohľad a rámec doplň, posolstvo neobracaj.

### Modlitby na opravu pri najbližšej nahrávke (analýza 28. 9. 2026)
- **10:** celá modlitba („žobrať", „prikazujem svojim emóciám a telu", „vyhlasujem, že som uzdravený", „učíš ma vládnuť").
- **9:** uzdravenie „do krvi, orgánov, kostí" podľa 1Pt 2, 24; Jeremiáš 30, 17 ako osobné zasľúbenie.
- **12:** text na webe už má opravu („Priznávam… Ďakujem Ti, že mi je to v Tebe už odpustené"). Neoverené je, či to platí aj pre audio. Ak nahrávka hrá staré „Odpusť mi to, Otče", text a zvuk sa nezhodujú.
- **6, 11, 13:** prikazovanie duchom a mysli.
- **4, 13, 15, 17:** „uvoľňujem".
- **7:** „vyhlasujem, že nebudem mať nedostatku" (Ž 34, 11); „uč ma hľadať najprv Tvoje kráľovstvo".
- **8:** „podľa knihy Józuovej 1, 8"; „vyhlasujem, že viera vo mne je…".
- **1** (Modlitba spásy): „prikazujem každému duchu"; „moc, ktorá uzdravuje moju dušu i telo". Nižšia priorita.

### Plán opráv príhovorov (schválené 28. 9. 2026, každý návrh najprv Adminovi)
- Spolu v jednej úlohe: 3, 7, 25 (Mt 6, 33 a 6, 26 nie sú „kráľovstvo v čase milosti"), 8 (Józua 1, 8 ako príkaz čitateľovi, „Uvidíš, keď uveríš"), 17 (Lukáš 10, 5).
- Každá zvlášť: 9 (doplniť Pavlove príklady a 2Kor 12, 9), 10 (doplniť Fil 4, 6 a rámec Marka 11, 23), 12 (ťažisko na Písme, nie na vnútornom hlase).
