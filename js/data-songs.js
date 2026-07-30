// ============================================
// DÁTA PIESNÍ — Deň Záchrany
// Pridanie ďalšej piesne = doplniť záznam do songData a songList.
// ============================================

const songData = {
    "1": {
        id: 1,
        number: 1,
        title: "Záchrana v temnote",
        subtitle: "Svetlo a bezpečie uprostred strachu",
        audioUrl: "assets/audio/songs/01-zachrana-v-temnote.mp3?v=2",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "On je mojím svetlom,",
                    "koho sa mám báť?",
                    "On je útočiskom,",
                    "pred kým sa mám triasť?",
                    "Keď sa ku mne priblížia",
                    "utláčatelia.",
                    "Pri útoku potknú sa",
                    "nepriatelia."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Keď vietor zúri nad ránom",
                    "a svet sa trasie v temne.",
                    "On je mojou záchranou,",
                    "len s Ním kráčam pevne.",
                    "Keď sa zdvihne proti mne,",
                    "celé vojsko v zbroji.",
                    "Srdce sa mi nezľakne,",
                    "Jeho blízkosť ma drží."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "V deň pohromy schová ma,",
                    "v skrýši svojho stanu.",
                    "Z prachu zeme dvíha ma,",
                    "postaví na Skalu.",
                    "Viem, že len s Ním zvládnem,",
                    "každý ťažký deň.",
                    "Keď tápam vo vzduchoprázdne,",
                    "a prekrýva ma tieň."
                ]
            },
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "On je mojím svetlom,",
                    "koho sa mám báť?",
                    "On je útočiskom,",
                    "pred kým sa mám triasť?",
                    "Keď sa ku mne priblížia",
                    "utláčatelia.",
                    "Pri útoku potknú sa",
                    "nepriatelia."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "V deň pohromy schová ma,",
                    "v skrýši svojho stanu.",
                    "Z prachu zeme dvíha ma,",
                    "postaví na Skalu.",
                    "Viem, že len s Ním zvládnem,",
                    "každý ťažký deň.",
                    "Keď tápam vo vzduchoprázdne,",
                    "a prekrýva ma tieň."
                ]
            },
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "On je mojím svetlom,",
                    "koho sa mám báť?",
                    "On je útočiskom,",
                    "pred kým sa mám triasť?",
                    "Keď sa ku mne priblížia",
                    "utláčatelia.",
                    "Pri útoku potknú sa",
                    "nepriatelia."
                ]
            }
        ],
        verse: {
            text: "Hospodin je mojím svetlom a spásou, koho sa mám báť? Hospodin mi je pevnosťou žitia, koho sa mám ľakať? Keď sa zlostníci približujú ku mne, aby mi zožierali telo, utláčatelia a nepriatelia moji potknú sa a padnú. Keby sa rozložil proti mne tábor, moje srdce sa nebojí; a keby sa aj vojna strhla proti mne, aj vtedy dúfam. Jedno som prosil od Hospodina, to žiadať budem: môcť bývať v dome Hospodinovom po všetky dni svojho života, vidieť láskavosť Hospodinovu a kochať sa v Jeho chráme. Lebo ma skryje vo svojom stane v deň pohromy, schová ma v skrýši svojho stánku, vyvýši ma na skalu.",
            ref: "Žalm 27, 1–5 — ECAV"
        }
    },
    "2": {
        id: 2,
        number: 2,
        title: "Nič nového pod slnkom",
        subtitle: "Pokoj v Božom poriadku sveta",
        audioUrl: "assets/audio/songs/02-nic-noveho-pod-slnkom.mp3?v=hq2",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Pokolenie odchádza,",
                    "ďalšie znovu prichádza.",
                    "Zem však stále trvá,",
                    "nevychýli sa.",
                    "Slnko ráno vychádza,",
                    "večer zase zapadá.",
                    "Náhli sa na svoje miesto,",
                    "tam kde vyjde zas."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Nič nového pod slnkom,",
                    "čo bolo zas bude.",
                    "Čo sa stalo pred časom,",
                    "to sa opäť stane."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Vietor veje z juhu,",
                    "na sever sa obracia.",
                    "Krúži v kolobehu,",
                    "a naspäť sa navracia.",
                    "Rieky tečú do mora,",
                    "to nenaplnia nikdy.",
                    "Vracajú sa tam znova,",
                    "k miestu odkiaľ vyšli."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Nič nového pod slnkom,",
                    "čo bolo zas bude.",
                    "Čo sa stalo pred časom,",
                    "to sa opäť stane."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Všetky veci sú únavné,",
                    "keď ich človek nechápe.",
                    "Nedokáže ich vystihnúť",
                    "ani slovom vysvetliť."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Nič nového pod slnkom,",
                    "čo bolo zas bude.",
                    "Čo sa stalo pred časom,",
                    "to sa opäť stane."
                ]
            }
        ],
        verse: {
            text: "Pokolenie odchádza a druhé prichádza, ale zem stojí naveky. Slnko vychodí, slnko zapadá, náhli sa na svoje miesto, kde znova vychádza. Vietor duje k juhu a obracia sa na sever, stále krúžiac veje a vo svojom kolobehu sa vracia. Všetky potoky tečú do mora, ale more sa nenaplní; potoky sa vracajú na miesto, kam tečú. Všetko je plné trudu, nikto to nemôže vysloviť; oko sa nikdy do sýtosti nenadíva, ucho sa nikdy dosť nenapočúva. Čo bolo, bude zase, a čo sa dialo, bude sa opäť diať. Nič nového nieto pod slnkom.",
            ref: "Kazateľ 1, 4–9 — ECAV"
        }
    },
    "3": {
        id: 3,
        number: 3,
        title: "Nemám strach",
        subtitle: "Sila, hodnota a sloboda od strachu",
        audioUrl: "assets/audio/songs/03-nemam-strach.mp3?v=hq2",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Len Ty poznáš každú moju tvár.",
                    "Si Majster, čo novou ma stvoril.",
                    "V mojom srdci je Tvoj vzácny dar.",
                    "Strach, bolesť, smútok si zboril."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Nedal si mi ducha úzkosti.",
                    "No odvahu, čo v žilách mi bije.",
                    "Kráčam isto v tvojej milosti,",
                    "moja duša len pre teba žije."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Sila a česť sú môj nový šat.",
                    "S nádejou hľadím v ústrety dňom.",
                    "Pred búrkou viac nemusím sa báť.",
                    "Ty si môj prístav,",
                    "Ty si môj dom."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Povolal si ma mojím menom.",
                    "Nie som len tieň, čo v dave sa stráca.",
                    "Stojím tu pevne pod tvojím nebom.",
                    "S Tebou žiť viem, uzdravená kráčam."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Sila a česť sú môj nový šat.",
                    "S nádejou hľadím v ústrety dňom.",
                    "Pred búrkou viac nemusím sa báť.",
                    "Ty si môj prístav,",
                    "Ty si môj dom."
                ]
            }
        ],
        verses: [
            {
                text: "Sila a dôstojnosť sú jej odevom a s úsmevom sa díva na budúci deň.",
                ref: "Príslovia 31, 25 — ECAV"
            },
            {
                text: "Ďakujem Ti, že si ma predivne utvoril; divné sú Tvoje skutky. A moja duša to dobre vie.",
                ref: "Žalm 139, 14 — ECAV"
            },
            {
                text: "Boh nám zaiste nedal ducha bojazlivosti, ale ducha moci, lásky a sebaovládania.",
                ref: "2. Timoteovi 1, 7 — ECAV"
            },
            {
                text: "Neboj sa, lebo som ťa vykúpil, povolal som ťa tvojím menom; môj si ty!",
                ref: "Izaiáš 43, 1 — ECAV"
            }
        ]
    },
    "4": {
        id: 4,
        number: 4,
        title: "Mám v sebe tiché miesto",
        subtitle: "Vnútorný pokoj a nová cesta",
        audioUrl: "assets/audio/songs/04-mam-v-sebe-tiche-miesto.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Bosý kráčam po tejto zemi.",
                    "Kamene sú ostré a chladné.",
                    "Nepozerám sa už na hodiny.",
                    "Myseľ ľahká, ale nohy sú ťažké."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Ako letná búrka vzduch chutí.",
                    "Hmla dvíha sa nad obzorom.",
                    "Nezachvejú sa mi už ruky.",
                    "V diaľke sa stráca, to čo bolo."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Mám v sebe tiché miesto.",
                    "(Pokoj je v Ňom)",
                    "Spoznávam nový priestor.",
                    "(Z temnoty von)",
                    "",
                    "Mám v sebe čistý prameň.",
                    "(V tepnách mi život prúdi)",
                    "Odvalil z duše kameň.",
                    "(Po cestách nezablúdim)"
                ]
            },
            {
                type: "verse",
                label: "Sloha 3",
                lines: [
                    "Tento smer som si nevybral sám.",
                    "On zavolal, a vybral si mňa.",
                    "Vedie ma kompas čo v srdci už mám.",
                    "Staré jazvy sa v tichu hoja."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Mám v sebe tiché miesto.",
                    "(Pokoj je v Ňom)",
                    "Spoznávam nový priestor.",
                    "(Z temnoty von)",
                    "",
                    "Mám v sebe čistý prameň.",
                    "(V tepnách mi život prúdi)",
                    "Odvalil z duše kameň.",
                    "(Po cestách nezablúdim)"
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Nová cesta sa otvára predo mnou.",
                    "Už nie som stratený.",
                    "(Už nie som sám)",
                    "(Už nie som sám)"
                ]
            }
        ],
        verses: [
            {
                text: "Pokoj vám zanechávam, svoj pokoj vám dávam; ja vám dávam, nie ako svet dáva. Nech sa vám srdce nestrachuje ani nech sa nelaká.",
                ref: "Ján 14, 27 — ECAV"
            },
            {
                text: "Kto sa však napije z vody, ktorú mu ja dám, nebude žízniť naveky; ale voda, ktorú mu dám, stane sa v ňom prameňom vody prúdiacej do večného života.",
                ref: "Ján 4, 14 — ECAV"
            },
            {
                text: "On nás vytrhol z moci tmy a preniesol do kráľovstva svojho milovaného Syna.",
                ref: "Kolosenským 1, 13 — ECAV"
            },
            {
                text: "Nie vy ste si mňa vyvolili, ale ja som si vás vyvolil a ustanovil som vás, aby ste šli a prinášali ovocie…",
                ref: "Ján 15, 16 — ECAV"
            },
            {
                text: "Ak je teda niekto v Kristovi, je nové stvorenie; staré sa pominulo, hľa, nastalo nové.",
                ref: "2. Korintským 5, 17 — ECAV"
            }
        ]
    },
    "5": {
        id: 5,
        number: 5,
        title: "Náhle a nečakane",
        subtitle: "Krátkosť života a nádej v Bohu",
        audioUrl: "assets/audio/songs/05-nahle-a-necakane.mp3?v=2",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Keď odídeš v plnej sile,",
                    "náhle všetko sa končí.",
                    "Neúprosne, nečakane,",
                    "kam tvoj život preskočí.",
                    "Včera si bol a dnes ťa niet,",
                    "osud kľúčom otočí.",
                    "Preberieš sa v realite,",
                    "v akej asi čo myslíš."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Lepšie je byť pripravený,",
                    "na určený čas.",
                    "Ako ostať prekvapený,",
                    "keď povolá ťa hlas,",
                    "Jeho hlas – do srdca ti hovorí."
                ]
            },
            {
                type: "chorus",
                label: "Refrén (2×)",
                lines: [
                    "Si ako tráva,",
                    "ktorá časom uschne.",
                    "Aj tvoja krása,",
                    "ako kvet zvädne.",
                    "Si ako para,",
                    "na chvíľku sa ukáže.",
                    "Závanom vetra",
                    "a potom zmizne."
                ]
            },
            {
                type: "verse",
                label: "Sloha",
                lines: [
                    "Včera si bol a dnes ťa niet,",
                    "osud kľúčom otočí.",
                    "Preberieš sa v realite,",
                    "v akej asi čo myslíš."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Lepšie je byť pripravený,",
                    "na určený čas.",
                    "Ako ostať prekvapený,",
                    "keď povolá ťa hlas,",
                    "Jeho hlas do srdca ti hovorí."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Si ako tráva,",
                    "ktorá časom uschne.",
                    "A tvoja krása,",
                    "ako kvet spadne.",
                    "Si ako para,",
                    "na chvíľku sa ukáže.",
                    "Závanom vetra",
                    "a potom zmizne."
                ]
            }
        ],
        verses: [
            {
                text: "Každé telo je tráva a všetka jeho krása ako poľný kvet. Tráva usychá, kvet vädne, keď naň zavanie Hospodinov dych… Tráva usychá, kvet vädne, ale slovo nášho Boha zostáva naveky.",
                ref: "Izaiáš 40, 6–8 — ECAV"
            },
            {
                text: "Dni človeka sú ako tráva, kvitne ako poľný kvet; len čo sa cez neho preženie vietor, niet ho, ani miesto, kde bol, ho viac nepozná.",
                ref: "Žalm 103, 15–16 — ECAV"
            },
            {
                text: "Veď neviete, čo bude zajtra s vaším životom. Ste para, ktorá sa na krátko ukáže a potom zmizne.",
                ref: "Jakub 4, 14 — ECAV"
            },
            {
                text: "Veď človek nepozná svoj čas. Ako ryby, ktoré sa chytajú do zhubnej siete, a ako vtáci, čo sa lapajú do osídla, tak sa chytajú aj ľudia v čase nešťastia, keď náhle doľahne na nich.",
                ref: "Kazateľ 9, 12 — ECAV"
            },
            {
                text: "Preto aj vy buďte pripravení, lebo Syn človeka príde v hodinu, keď sa nenazdáte.",
                ref: "Matúš 24, 44 — ECAV"
            }
        ]
    },
    "6": {
        id: 6,
        number: 6,
        title: "On je Svetlo",
        subtitle: "Ježiš — Svetlo sveta a cesta k Otcovi",
        audioUrl: "assets/audio/songs/06-on-je-svetlo.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha",
                lines: [
                    "On je Cesta, Pravda, Život,",
                    "tak choď za Ním,",
                    "choď za Ním.",
                    "On je Svetlo, Pokoj, Radosť,",
                    "tak zmier sa s Ním,",
                    "zmier sa s Ním."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Svojho syna za nás dal,",
                    "za nás dal.",
                    "Prijmi milosť kým je čas,",
                    "neváhaj, tak neváhaj."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Pravé Svetlo v Jeho Slove,",
                    "tma pohltiť nevie.",
                    "Každú dušu osvecuje,",
                    "čo prichádza na svet.",
                    "A to Slovo telom sa stalo,",
                    "medzi nami prebývalo."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Svojho syna za nás dal,",
                    "za nás dal.",
                    "Prijmi milosť kým je čas,",
                    "neváhaj, tak neváhaj."
                ]
            }
        ],
        verses: [
            {
                text: "Ja som cesta, pravda a život. Nik neprichádza k Otcovi, ak len nie skrze mňa.",
                ref: "Ján 14, 6 — ECAV"
            },
            {
                text: "Ja som svetlo sveta; kto mňa nasleduje, nebude chodiť v tme, ale bude mať svetlo života.",
                ref: "Ján 8, 12 — ECAV"
            },
            {
                text: "Lebo tak Boh miloval svet, že svojho jednorodeného Syna dal, aby nezahynul nikto, kto verí v Neho, ale mal večný život.",
                ref: "Ján 3, 16 — ECAV"
            },
            {
                text: "V mene Kristovom prosíme: Zmierte sa s Bohom!",
                ref: "2. Korintským 5, 20 — ECAV"
            },
            {
                text: "A svetlo svieti v tme a tma Ho nepohltila.",
                ref: "Ján 1, 5 — ECAV"
            },
            {
                text: "Ajhľa, teraz je čas veľmi príhodný; ajhľa, teraz je deň spasenia!",
                ref: "2. Korintským 6, 2 — ECAV"
            }
        ]
    },
    "7": {
        id: 7,
        number: 7,
        title: "Jediný pevný bod",
        subtitle: "Pevná Skala, keď sa všetko chveje",
        audioUrl: "assets/audio/songs/07-jediny-pevny-bod.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Beháš z miesta na miesto,",
                    "potkýnaš sa, aj padáš.",
                    "Hľadáš zmysel, svoj priestor,",
                    "pravdu stále prehliadaš."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Svet ti núka tisíc ciest,",
                    "no každá vedie do tmy.",
                    "Vyjsť zo slepých uličiek,",
                    "túžiš sa ukotviť."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Keď sa všetko chveje pod tebou,",
                    "keď sa rúca každý plán.",
                    "On je Skalou nepohnuteľnou,",
                    "jediný pevný bod – Pánov Pán."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Len Jeho Slovo pravdou je,",
                    "ako oheň blčí.",
                    "V súžení ťa bude viesť,",
                    "keď duša blúdi, mlčí.",
                    "On chráni všetkých pokorných,",
                    "čo v Neho dúfajú.",
                    "Nasadí ti svoj štít ochranný,",
                    "proti tým, čo rúcajú."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Keď sa všetko chveje pod tebou,",
                    "keď sa rúca každý plán.",
                    "On je Skalou nepohnuteľnou,",
                    "jediný pevný bod – Pánov Pán."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Len Jeho Slovo pravdou je,",
                    "ako oheň blčí.",
                    "V súžení ťa bude viesť,",
                    "keď duša blúdi, mlčí.",
                    "On chráni všetkých pokorných,",
                    "čo v Neho dúfajú.",
                    "Nasadí ti svoj štít ochranný,",
                    "proti tým, čo rúcajú."
                ]
            }
        ],
        verses: [
            {
                text: "Neraz sa človeku zdá cesta správna, ale napokon vedie k smrti.",
                ref: "Príslovia 14, 12 — ECAV"
            },
            {
                text: "Hospodin je moja skala, moja pevnosť a môj vysloboditeľ.",
                ref: "Žalm 18, 3 — ECAV"
            },
            {
                text: "A tou skalou bol Kristus.",
                ref: "1. Korintským 10, 4 — ECAV"
            },
            {
                text: "Posväť ich v pravde; Tvoje slovo je pravda.",
                ref: "Ján 17, 17 — ECAV"
            },
            {
                text: "Či nie je moje slovo ako oheň — znie výrok Hospodinov — a ako kladivo, ktoré rozráža skalu?",
                ref: "Jeremiáš 23, 29 — ECAV"
            },
            {
                text: "Predovšetkým vezmite štít viery, ktorým budete môcť uhasiť všetky ohnivé šípy toho Zlého.",
                ref: "Efezským 6, 16 — ECAV"
            }
        ]
    },
    "8": {
        id: 8,
        number: 8,
        title: "Priestor Duchu",
        subtitle: "Život v Duchu a záchrana z milosti",
        audioUrl: "assets/audio/songs/08-priestor-duchu.mp3?v=2",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Utlmujem telo, dušu,",
                    "dávam priestor Jeho Duchu.",
                    "Iba v Ňom mám dokonalosť,",
                    "daroval mi spravodlivosť."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Moju myseľ podriaďujem,",
                    "emócie podmaňujem.",
                    "Jeho vôľa ako v nebi,",
                    "nech nastane aj na zemi."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Vytrhni nás z tohto zlého veku.",
                    "Milosťou sme zachránení.",
                    "V tvojich sľuboch mám útechu.",
                    "Skrze vieru spasení."
                ]
            },
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Utlmujem telo, dušu,",
                    "dávam priestor Jeho Duchu.",
                    "Iba v Ňom mám dokonalosť,",
                    "daroval mi spravodlivosť."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Vytrhni nás z tohto zlého veku.",
                    "Milosťou sme zachránení.",
                    "V tvojich sľuboch mám útechu.",
                    "Skrze vieru spasení."
                ]
            }
        ],
        verses: [
            {
                text: "Lebo ak podľa tela žijete, zomriete; ale ak Duchom umŕtvujete skutky tela, budete žiť.",
                ref: "Rimanom 8, 13 — ECAV"
            },
            {
                text: "Toho, ktorý nepoznal hriech, urobil za nás hriechom, aby sme my v Ňom boli spravodlivosťou pred Bohom.",
                ref: "2. Korintským 5, 21 — ECAV"
            },
            {
                text: "A nepripodobňujte sa tomuto svetu, ale premeňte sa obnovením zmýšľania, aby ste vedeli rozoznať, čo je vôľa Božia, totiž čo je dobré, milé a dokonalé.",
                ref: "Rimanom 12, 2 — ECAV"
            },
            {
                text: "Príď kráľovstvo Tvoje; buď vôľa Tvoja ako v nebi tak i na zemi.",
                ref: "Matúš 6, 10 — ECAV"
            },
            {
                text: "Kristus seba samého vydal za naše hriechy, aby nás vytrhol z terajšieho zlého veku podľa vôle Boha a nášho Otca.",
                ref: "Galaťanom 1, 4 — ECAV"
            },
            {
                text: "Lebo milosťou ste spasení skrze vieru. A to nie sami zo seba; je to dar Boží; nie zo skutkov, aby sa nikto nechválil.",
                ref: "Efezským 2, 8–9 — ECAV"
            }
        ]
    },
    "9": {
        id: 9,
        number: 9,
        title: "Prichádza zmena",
        subtitle: "Pozvanie otvoriť srdce Kristovi",
        audioUrl: "assets/audio/songs/09-prichadza-zmena.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Zmena už sa blíži,",
                    "niečo veľké prichádza.",
                    "Tento svet sa mýli,",
                    "čiernym biele nahrádza."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Strach ti kradne spánok,",
                    "partnerom je nočný tieň.",
                    "Možno ďalšie ráno,",
                    "už neprinesie nový deň."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Aj slepý vníma znamenia,",
                    "prečo ich ty nevidíš.",
                    "Iba v Ňom je záchrana,",
                    "Jeho krv ťa očistí.",
                    "",
                    "V tichu počuť Jeho hlas,",
                    "snáď mu srdcom uveríš.",
                    "Neodmietaj kým je čas,",
                    "On ti pravdu odhalí."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Stvoriteľ ti život dal,",
                    "čaká, volá, neváhaj.",
                    "Stojí pri tvojich dverách,",
                    "otvoriť mu musíš sám."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Aj slepý vníma znamenia,",
                    "prečo ich ty nevidíš.",
                    "Iba v Ňom je záchrana,",
                    "Jeho krv ťa očistí.",
                    "",
                    "V tichu počuť Jeho hlas,",
                    "snáď mu srdcom uveríš.",
                    "Neodmietaj kým je čas,",
                    "On ti pravdu odhalí."
                ]
            }
        ],
        verses: [
            {
                text: "Tak aj vy, keď toto všetko uvidíte, vedzte, že je blízko, predo dvermi.",
                ref: "Matúš 24, 33 — ECAV"
            },
            {
                text: "Beda tým, ktorí zlé nazývajú dobrým a dobré zlým, ktorí robia z tmy svetlo a zo svetla tmu.",
                ref: "Izaiáš 5, 20 — ECAV"
            },
            {
                text: "Vzhľad oblohy viete posúdiť, ale znamenia časov neviete?",
                ref: "Matúš 16, 3 — ECAV"
            },
            {
                text: "A nieto v nikom inom spasenia, lebo ani niet pod nebom iného mena daného ľuďom, v ktorom by sme mali byť spasení.",
                ref: "Skutky 4, 12 — ECAV"
            },
            {
                text: "Krv Jeho Syna Ježiša očisťuje nás od každého hriechu.",
                ref: "1. Jánov 1, 7 — ECAV"
            },
            {
                text: "Ajhľa, stojím pri dverách a klopem. Ak niekto počuje môj hlas a otvorí dvere, vojdem k nemu a budem večerať s ním a on so mnou.",
                ref: "Zjavenie 3, 20 — ECAV"
            },
            {
                text: "Ajhľa, teraz je čas veľmi príhodný; ajhľa, teraz je deň spasenia!",
                ref: "2. Korintským 6, 2 — ECAV"
            }
        ]
    },
    "10": {
        id: 10,
        number: 10,
        title: "Okamih, ktorý máš",
        subtitle: "Prítomná chvíľa a dar života v Kristovi",
        audioUrl: "assets/audio/songs/10-okamih-ktory-mas.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Jediný okamih, ktorý máš,",
                    "je teraz.",
                    "Zajtrajšok neistý, prečo naň,",
                    "kladieš dôraz.",
                    "Lebo nevieš, čo deň prinesie,",
                    "v tvojich rukách nič nemáš.",
                    "Čo keď príde nešťastie,",
                    "svoj čas totiž nepoznáš."
                ]
            },
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "V tvojom srdci mnoho plánov,",
                    "krátky život nestačí.",
                    "Neovplyvníš zámer Pánov,",
                    "to čo chce uskutoční."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Človek nevie, čo sa stane,",
                    "kto oznámi mu, ako bude.",
                    "Cesta nie je v jeho moci,",
                    "neriadi si svoje kroky."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Jediný okamih, ktorý máš,",
                    "je teraz.",
                    "Zajtrajšok neistý, prečo naň,",
                    "kladieš dôraz.",
                    "Lebo nevieš, čo deň prinesie,",
                    "v tvojich rukách nič nemáš.",
                    "Čo keď príde nešťastie,",
                    "svoj čas totiž nepoznáš."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Tak prijmi Svetlo do srdca,",
                    "ten dar čo sa ti ponúka.",
                    "On odhalí ti tajomstvá,",
                    "zmysel tvojho života."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Jediný okamih, ktorý máš,",
                    "je teraz.",
                    "Zajtrajšok neistý, prečo naň,",
                    "kladieš dôraz.",
                    "Lebo nevieš, čo deň prinesie,",
                    "v tvojich rukách nič nemáš.",
                    "Čo keď príde nešťastie,",
                    "svoj čas totiž nepoznáš."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Tak prijmi Svetlo do srdca,",
                    "ten dar čo sa ti ponúka.",
                    "On odhalí ti tajomstvá,",
                    "zmysel tvojho života."
                ]
            }
        ],
        verses: [
            {
                text: "Mnoho plánov je v srdci človeka, ale zámer Hospodinov obstojí.",
                ref: "Príslovia 19, 21 — ECAV"
            },
            {
                text: "Viem, Hospodine, že človek nemá vo svojej moci svoju cestu; nie je v moci človeka, ktorý chodí, riadiť svoje kroky.",
                ref: "Jeremiáš 10, 23 — ECAV"
            },
            {
                text: "Nechváľ sa zajtrajším dňom, lebo nevieš, čo deň prinesie.",
                ref: "Príslovia 27, 1 — ECAV"
            },
            {
                text: "Dnes, keď počujete Jeho hlas, nezatvrdzujte si srdcia.",
                ref: "Židom 3, 15 — ECAV"
            },
            {
                text: "Ja som svetlo sveta; kto mňa nasleduje, nebude chodiť v tme, ale bude mať svetlo života.",
                ref: "Ján 8, 12 — ECAV"
            },
            {
                text: "Darom Božím z milosti je večný život v Kristovi Ježišovi, našom Pánovi.",
                ref: "Rimanom 6, 23 — ECAV"
            },
            {
                text: "Tajomstvo Boha, totiž Krista, v ktorom sú skryté všetky poklady múdrosti a poznania.",
                ref: "Kolosenským 2, 2–3 — ECAV"
            }
        ]
    },
    "11": {
        id: 11,
        number: 11,
        title: "Temný pohľad",
        subtitle: "Božie volanie k obráteniu, kým je čas",
        audioUrl: "assets/audio/songs/11-temny-pohlad.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Tisíce stratených tiel,",
                    "uväznených v sebe.",
                    "Podľa svojich pravidiel,",
                    "chcú byť prví všade."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Ako zástup šakalov,",
                    "myslia len na svoje bruchá.",
                    "Plnia obsah kanálov,",
                    "prázdne schránky bez Ducha."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Jedzme, pime, milujme,",
                    "užime si každú chvíľu.",
                    "Veď zajtra tu možno nebudeme,",
                    "zatlačíme na pílu."
                ]
            },
            {
                type: "verse",
                label: "Sloha 3",
                lines: [
                    "Nikto z nich už neplače,",
                    "rvú sa iba o kus žvanca.",
                    "Z odpadu si pečú koláče,",
                    "hrdo nosia titul štvanca."
                ]
            },
            {
                type: "verse",
                label: "Sloha 4",
                lines: [
                    "Temné chute svojho ega,",
                    "vynášajú na povrch.",
                    "Ich prítomnosť je čiernobiela,",
                    "tolerujú každý podvrh."
                ]
            },
            {
                type: "chorus",
                label: "Refrén (2×)",
                lines: [
                    "Jedzme, pime, milujme,",
                    "užime si každú chvíľu.",
                    "Veď zajtra tu možno nebudeme,",
                    "zatlačíme na pílu."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Stvoriteľ sa nato zhora pozerá,",
                    "bolesť v srdci cíti.",
                    "Ľudská zloba na zemi je veliká,",
                    "Jeho hnev sa blíži.",
                    "Hej ty človek spamätaj sa,",
                    "k Slovu kríža obráť sa.",
                    "Dnes je ten deň, zachráň sa,",
                    "kým je čas, kým je čas."
                ]
            }
        ],
        verses: [
            {
                text: "Ich bohom je brucho a slávou ich hanebnosť; zmýšľajú totiž len o pozemských veciach.",
                ref: "Filipským 3, 19 — ECAV"
            },
            {
                text: "To sú tí, ktorí spôsobujú roztržky, telesní ľudia, ktorí nemajú Ducha.",
                ref: "Júda 19 — ECAV"
            },
            {
                text: "Jedzme a pime, veď zajtra zomrieme.",
                ref: "Izaiáš 22, 13 — ECAV"
            },
            {
                text: "Hoci poznajú Božie nariadenie, že tí, ktorí také veci robia, zasluhujú smrť, nielenže ich sami robia, ale aj schvaľujú tých, ktorí ich páchajú.",
                ref: "Rimanom 1, 32 — ECAV"
            },
            {
                text: "Ľutoval Hospodin, že učinil človeka na zemi, a zabolelo Ho v srdci.",
                ref: "1. Mojžišova 6, 6 — ECAV"
            },
            {
                text: "Boh však prehliadol časy nevedomosti a teraz zvestuje ľuďom, aby všetci všade robili pokánie.",
                ref: "Skutky 17, 30 — ECAV"
            },
            {
                text: "Lebo slovo o kríži je bláznovstvom tým, ktorí hynú, ale nám, ktorí dosahujeme spasenie, je mocou Božou.",
                ref: "1. Korintským 1, 18 — ECAV"
            }
        ]
    },
    "12": {
        id: 12,
        number: 12,
        title: "Konečná destinácia",
        subtitle: "Otázka večnosti a záchrana v Kristovi",
        audioUrl: "assets/audio/songs/12-konecna-destinacia.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Túžiš mať a tak hľadáš,",
                    "veci, pokoj, prostredie.",
                    "Dušu svoju vypredáš,",
                    "za pocit zmyslov, poznanie."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Kam až zájdeš, kam až zájdeš,",
                    "v naháňačke za vetrom.",
                    "Kde sa nájdeš, kde sa nájdeš,",
                    "keď vyhasneš pod vekom."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "V mŕtvom tele, iba červy nehynú,",
                    "už tam nie si, už tam nie si.",
                    "V prachu zeme, tam máš skrýšu nehybnú,",
                    "duša kde si, duša moja tak kde si?"
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Už mi je to jasné, pomôž mi,",
                    "nehasne tu oheň pálivý.",
                    "Nehasne tu oheň v podsvetí,",
                    "už mi je to jasné naveky.",
                    "",
                    "Na kolenách prosím, zachráň ma,",
                    "daj mi ešte jednu – šancu poslednú.",
                    "Tento hrozný plameň, ničí ma,",
                    "vytrhni ma hore – cez bránu pekelnú.",
                    "",
                    "Už mi je to jasné, pomôž mi,",
                    "nehasne tu oheň pálivý.",
                    "Nehasne tu oheň v podsvetí,",
                    "už mi je to jasné – naveky."
                ]
            }
        ],
        verses: [
            {
                text: "Lebo čo osoží človeku, keby aj celý svet získal, ale svojej duši by uškodil? Alebo čo dá človek ako výmenu za svoju dušu?",
                ref: "Matúš 16, 26 — ECAV"
            },
            {
                text: "Videl som všetky skutky, ktoré sa dejú pod slnkom, a hľa, všetko je márnosť a honba za vetrom.",
                ref: "Kazateľ 1, 14 — ECAV"
            },
            {
                text: "A ako je ľuďom uložené raz zomrieť, a potom bude súd.",
                ref: "Židom 9, 27 — ECAV"
            },
            {
                text: "A prach sa navráti do zeme, ako bol, a duch sa navráti k Bohu, ktorý ho dal.",
                ref: "Kazateľ 12, 7 — ECAV"
            },
            {
                text: "Do pekla, do neuhasiteľného ohňa, kde ich červ neumiera a oheň nehasne.",
                ref: "Marek 9, 47–48 — ECAV"
            },
            {
                text: "Lebo každý, kto by vzýval meno Pánovo, bude spasený.",
                ref: "Rimanom 10, 13 — ECAV"
            },
            {
                text: "Veru, veru vám hovorím: Kto počúva moje slovo a verí Tomu, ktorý ma poslal, má večný život a nejde na súd, ale prešiel zo smrti do života.",
                ref: "Ján 5, 24 — ECAV"
            }
        ]
    },
    "13": {
        id: 13,
        number: 13,
        title: "Drž ma pevne",
        subtitle: "Modlitba dôvery v Božej ruke",
        audioUrl: "assets/audio/songs/13-drz-ma-pevne.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "K Tebe volám Pane.",
                    "Moju dušu uchovaj,",
                    "navždy uchovaj.",
                    "V Tvojej ruke drž ma pevne.",
                    "V priazni svojej zachovaj,",
                    "áno zachovaj."
                ]
            },
            {
                type: "chorus",
                label: "Refrén 1",
                lines: [
                    "Čo tým získaš ak ma zdrtíš",
                    "a zostúpim do jamy.",
                    "Aký osoh z mojej krvi,",
                    "prosím zastav tsunami."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "K Tebe volám Pane.",
                    "Môjmu duchu život daj,",
                    "večný život daj.",
                    "V Tvojej ruke drž ma pevne.",
                    "V priazni svojej zachovaj,",
                    "áno zachovaj."
                ]
            },
            {
                type: "chorus",
                label: "Refrén 2 (2×)",
                lines: [
                    "Obnov ducha v mojom vnútri",
                    "a povoláš ma k slobode.",
                    "Z Jeho Pravdy neodlúči,",
                    "nič vytrhnúť ma nemôže."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Večný život v Tebe mám.",
                    "V pravde navždy ostávam.",
                    "V pravde navždy ostávam."
                ]
            }
        ],
        verses: [
            {
                text: "Ochraňuj moju dušu, lebo som zbožný; zachráň svojho služobníka, ktorý dúfa v Teba, Ty si môj Boh.",
                ref: "Žalm 86, 2 — ECAV"
            },
            {
                text: "Ja im dávam večný život, nezahynú naveky a nikto mi ich nevytrhne z ruky.",
                ref: "Ján 10, 28 — ECAV"
            },
            {
                text: "Aký osoh bude z mojej krvi, keď zostúpim do jamy? Či Ťa bude prach oslavovať? Či bude zvestovať Tvoju pravdu?",
                ref: "Žalm 30, 10 — ECAV"
            },
            {
                text: "Stvor mi čisté srdce, ó Bože, a obnov vo mne pevného ducha.",
                ref: "Žalm 51, 12 — ECAV"
            },
            {
                text: "Kristus nás oslobodil k slobode. Stojte teda a nedajte sa znova zapriahnuť do jarma otroctva.",
                ref: "Galaťanom 5, 1 — ECAV"
            },
            {
                text: "Som presvedčený, že ani smrť ani život, ani anjeli ani kniežatstvá, ani prítomnosť ani budúcnosť, ani mocnosti, ani výška ani hĺbka, ani nijaké iné stvorenie nebude nás môcť odlúčiť od lásky Božej, ktorá je v Kristovi Ježišovi, našom Pánovi.",
                ref: "Rimanom 8, 38–39 — ECAV"
            },
            {
                text: "A toto je svedectvo: Boh nám dal večný život, a tento život je v Jeho Synovi. Kto má Syna, má život; kto nemá Syna Božieho, nemá život.",
                ref: "1. Jánov 5, 11–12 — ECAV"
            }
        ]
    },
    "14": {
        id: 14,
        number: 14,
        title: "Svet sa zmení",
        subtitle: "Nádej Kristovho príchodu a záchrana z milosti",
        audioUrl: "assets/audio/songs/14-svet-sa-zmeni.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "Veľmi skoro svet sa zmení,",
                    "zaznie povel, archanjelov hlas.",
                    "Zvuk poľnice a Pán zostúpi,",
                    "vstanú prví, tí čo sú len prach."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Kráľ prichádza do oblakov,",
                    "vezme k Sebe mŕtvych – živých.",
                    "Očistených Jeho krvou,",
                    "do príbytkov pripravených."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Nesmieme už strácať čas,",
                    "kto sme Duchom vedení.",
                    "On oživil a volá nás,",
                    "modliť sa za stratených.",
                    "Ak počúvaš, tento raz,",
                    "tak neváhaj byť chránený.",
                    "Zomrel za nás, prijmi dar,",
                    "a milosťou buď spasený."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Ako ovce blúdili sme všetci,",
                    "každý išiel svojou necestou.",
                    "Trpel za nás, muž bolesti,",
                    "prebodnutý ľudskou neverou.",
                    "Zdrvený za naše neprávosti,",
                    "na drevo kríža sám ich vyniesol.",
                    "Uzdravil nás krvou, jeho ranami,",
                    "On znášal trest, nám pokoj priniesol."
                ]
            },
            {
                type: "verse",
                label: "Sloha 3",
                lines: [
                    "Veľmi skoro svet sa zmení,",
                    "Boží hnev už pôsobí.",
                    "Ak nebudeš vychvátený,",
                    "zanechá ťa v súžení."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "Nesmieme už strácať čas,",
                    "kto sme Duchom vedení.",
                    "On oživil a volá nás,",
                    "modliť sa za stratených.",
                    "Ak počúvaš, tento raz,",
                    "tak neváhaj byť chránený.",
                    "Zomrel za nás, prijmi dar,",
                    "a milosťou buď spasený."
                ]
            }
        ],
        verses: [
            {
                text: "Nie všetci zosnieme, ale všetci budeme premenení, naraz, v okamihu, pri poslednej trúbe; a mŕtvi budú vzkriesení neporušiteľní a my budeme premenení.",
                ref: "1. Korintským 15, 51–52 — ECAV"
            },
            {
                text: "Sám Pán zostúpi z neba na povel, na hlas archanjela a na zvuk Božej trúby; a mŕtvi v Kristovi vstanú najprv. Potom my živí budeme spolu s nimi uchvátení v oblakoch v ústrety Pánovi; a tak budeme vždy s Pánom.",
                ref: "1. Tesalonickým 4, 16–17 — ECAV"
            },
            {
                text: "V dome môjho Otca je mnoho príbytkov; idem vám pripraviť miesto. A zasa prídem a poberiem si vás k sebe, aby ste aj vy boli tam, kde som ja.",
                ref: "Ján 14, 2–3 — ECAV"
            },
            {
                text: "Lebo všetci, ktorých Duch Boží vedie, sú synovia Boží.",
                ref: "Rimanom 8, 14 — ECAV"
            },
            {
                text: "Žiadam, aby sa konali prosby a modlitby za všetkých ľudí; lebo Boh chce, aby všetci ľudia boli spasení a prišli k poznaniu pravdy.",
                ref: "1. Timotejovi 2, 1–4 — ECAV"
            },
            {
                text: "On však bol prebodnutý pre naše priestupky, zdrvený pre naše neprávosti; trest za náš pokoj spočinul na Ňom a Jeho ranami sa nám dostalo uzdravenia.",
                ref: "Izaiáš 53, 5 — ECAV"
            },
            {
                text: "On sám vyniesol naše hriechy vo svojom tele na drevo, aby sme odumreli hriechom a žili spravodlivosti.",
                ref: "1. Petra 2, 24 — ECAV"
            },
            {
                text: "Zachovám ťa pred hodinou skúšky, ktorá príde na celý svet skúšať obyvateľov zeme.",
                ref: "Zjavenie 3, 10 — ECAV"
            }
        ]
    },
    "15": {
        id: 15,
        number: 15,
        title: "Svetlo v tme",
        subtitle: "Svetlo, pokoj a radosť v Kristovi",
        audioUrl: "assets/audio/songs/15-svetlo-v-tme.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "On je Cesta čo nás vedie hore.",
                    "Pravda, ktorú nájdeme v pokore.",
                    "Život, ktorý dýchaš v každom dni.",
                    "Nájdi tú cestu a choď za Ním."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "On je to Svetlo čo tmu rozjasní.",
                    "Slnečné ráno, pokoj hrejivý.",
                    "Radosť v srdci, ktorá nehasne.",
                    "Tak zmier sa s Ním a máš lásku nezvratne."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Hľadáš smer a v búrkach blúdiš sám.",
                    "Svet ti vraví: všetko čo chceš dám.",
                    "No len On je mocný Zdroj a živý.",
                    "Choď k Nemu a tvoj život sa zmení."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "On je to Svetlo čo tmu rozjasní.",
                    "Slnečné ráno, pokoj hrejivý.",
                    "Radosť v srdci, ktorá nehasne.",
                    "Tak zmier sa s Ním a máš lásku nezvratne."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Cesty sa rozvetvujú na tisíce.",
                    "Ktorú vybrať ako rozhodnúť kam ísť.",
                    "Je to On, tá Pravda bez pochýb.",
                    "Tak kráčaj k Nemu, už nikdy neodíď."
                ]
            },
            {
                type: "chorus",
                label: "Refrén",
                lines: [
                    "On je to Svetlo čo tmu rozjasní.",
                    "Slnečné ráno, pokoj hrejivý.",
                    "Radosť v srdci, ktorá nehasne.",
                    "Tak zmier sa s Ním a máš lásku nezvratne."
                ]
            }
        ],
        verses: [
            {
                text: "Ja som cesta, pravda a život. Nik neprichádza k Otcovi, ak len nie skrze mňa.",
                ref: "Ján 14, 6 — ECAV"
            },
            {
                text: "Ja som prišiel, aby mali život a aby ho mali v hojnosti.",
                ref: "Ján 10, 10 — ECAV"
            },
            {
                text: "Ja som svetlo sveta; kto mňa nasleduje, nebude chodiť v tme, ale bude mať svetlo života.",
                ref: "Ján 8, 12 — ECAV"
            },
            {
                text: "Pokoj vám zanechávam, svoj pokoj vám dávam; nie ako svet dáva, ja vám dávam.",
                ref: "Ján 14, 27 — ECAV"
            },
            {
                text: "To som vám povedal, aby moja radosť bola vo vás a aby vaša radosť bola úplná.",
                ref: "Ján 15, 11 — ECAV"
            },
            {
                text: "Kto verí vo mňa, ako hovorí Písmo, rieky živej vody potečú z jeho vnútra.",
                ref: "Ján 7, 38 — ECAV"
            },
            {
                text: "Takto vraví Hospodin: Zastavte sa na cestách a pozerajte, pýtajte sa na dávne chodníky, kde je dobrá cesta, choďte po nej a nájdete odpočinok pre svoje duše.",
                ref: "Jeremiáš 6, 16 — ECAV"
            },
            {
                text: "Pane, ku komu pôjdeme? Ty máš slová večného života.",
                ref: "Ján 6, 68 — ECAV"
            }
        ]
    },
    "16": {
        id: 16,
        number: 16,
        title: "Na rozhraní tmy",
        subtitle: "Svetlo, ktoré prenikne aj do najhlbšej tmy",
        audioUrl: "assets/audio/songs/16-na-rozhrani-tmy.mp3",
        credit: "Text a hudobná produkcia © Deň Záchrany",
        lyrics: [
            {
                type: "verse",
                label: "Sloha 1",
                lines: [
                    "V pokročilej nočnej dobe,",
                    "na rozhraní tmy.",
                    "Padáš v mraku zabudnutia,",
                    "do vypnutej hry."
                ]
            },
            {
                type: "verse",
                label: "Sloha 2",
                lines: [
                    "Ponáraš sa do temnoty,",
                    "skrýše spánku tela.",
                    "Tam sa schováš do prázdnoty,",
                    "duša osamelá."
                ]
            },
            {
                type: "bridge",
                label: "Bridge",
                lines: [
                    "Z bonbonieri svetských darov",
                    "ponúkli ti prospech.",
                    "U Kráľovien, poklad kráľov,",
                    "slávu, moc a úspech.",
                    "Neprímaj nič, sú to iba smeti,",
                    "neber hadiu nákazu.",
                    "Nebuď ako, nerozumné deti,",
                    "zastav, nechoď na skazu."
                ]
            },
            {
                type: "verse",
                label: "Sloha 3",
                lines: [
                    "Ochutnal si sladkosť medu,",
                    "očí, tela extázu.",
                    "Naplnil si túžby z jedu,",
                    "naletel na návnadu."
                ]
            },
            {
                type: "verse",
                label: "Sloha 4",
                lines: [
                    "Pád je tvrdý z výšky dolu,",
                    "tvoj život je rozbitý.",
                    "Hľadáš liek na nočnú moru,",
                    "záblesk na kríž pribitý."
                ]
            },
            {
                type: "chorus",
                label: "Refrén (2×)",
                lines: [
                    "Do sna Svetlo preniká,",
                    "v ňom je On a On je v Ňom.",
                    "Nádej, lásku ponúka,",
                    "nahraď strach pokojom.",
                    "Iba On je záchrana,",
                    "srdce plní útechou.",
                    "Vieru v dobro navracia,",
                    "prijmi ten dar – dnes,",
                    "už neváhaj."
                ]
            }
        ],
        verses: [
            {
                text: "Viete, aký je čas, že už je hodina zobudiť sa zo spánku. Noc pokročila a deň sa priblížil. Odložme teda skutky tmy a oblečme sa do výzbroje svetla.",
                ref: "Rimanom 13, 11–12 — ECAV"
            },
            {
                text: "Nemilujte svet ani to, čo je vo svete. Lebo všetko, čo je vo svete, žiadosť tela, žiadosť očí a pýcha života, nie je z Otca, ale zo sveta.",
                ref: "1. Jánov 2, 15–16 — ECAV"
            },
            {
                text: "Všetko pokladám za stratu a za smeti, aby som Krista získal.",
                ref: "Filipským 3, 8 — ECAV"
            },
            {
                text: "Každého pokúša vlastná žiadosť, ktorá ho zvádza a láka. Potom žiadosť počne a porodí hriech.",
                ref: "Jakub 1, 14–15 — ECAV"
            },
            {
                text: "A svetlo svieti v tme a tma Ho nepohltila.",
                ref: "Ján 1, 5 — ECAV"
            },
            {
                text: "Boh, ktorý povedal: Z tmy nech zažiari svetlo, zažiaril v našich srdciach, aby zasvietilo poznanie slávy Božej v tvári Kristovej.",
                ref: "2. Korintským 4, 6 — ECAV"
            },
            {
                text: "Uzdrav ma, Hospodine, a budem uzdravený; zachráň ma a budem zachránený, lebo Ty si moja chvála.",
                ref: "Jeremiáš 17, 14 — ECAV"
            },
            {
                text: "A nieto v nikom inom spasenia, lebo ani niet pod nebom iného mena daného ľuďom, v ktorom by sme mali byť spasení.",
                ref: "Skutky 4, 12 — ECAV"
            }
        ]
    }
};

const songList = [
    {
        id: 1,
        number: 1,
        title: "Záchrana v temnote",
        subtitle: "Svetlo a bezpečie uprostred strachu"
    },
    {
        id: 2,
        number: 2,
        title: "Nič nového pod slnkom",
        subtitle: "Pokoj v Božom poriadku sveta"
    },
    {
        id: 3,
        number: 3,
        title: "Nemám strach",
        subtitle: "Sila, hodnota a sloboda od strachu"
    },
    {
        id: 4,
        number: 4,
        title: "Mám v sebe tiché miesto",
        subtitle: "Vnútorný pokoj a nová cesta"
    },
    {
        id: 5,
        number: 5,
        title: "Náhle a nečakane",
        subtitle: "Krátkosť života a nádej v Bohu"
    },
    {
        id: 6,
        number: 6,
        title: "On je Svetlo",
        subtitle: "Ježiš — Svetlo sveta a cesta k Otcovi"
    },
    {
        id: 7,
        number: 7,
        title: "Jediný pevný bod",
        subtitle: "Pevná Skala, keď sa všetko chveje"
    },
    {
        id: 8,
        number: 8,
        title: "Priestor Duchu",
        subtitle: "Život v Duchu a záchrana z milosti"
    },
    {
        id: 9,
        number: 9,
        title: "Prichádza zmena",
        subtitle: "Pozvanie otvoriť srdce Kristovi"
    },
    {
        id: 10,
        number: 10,
        title: "Okamih, ktorý máš",
        subtitle: "Prítomná chvíľa a dar života v Kristovi"
    },
    {
        id: 11,
        number: 11,
        title: "Temný pohľad",
        subtitle: "Božie volanie k obráteniu, kým je čas"
    },
    {
        id: 12,
        number: 12,
        title: "Konečná destinácia",
        subtitle: "Otázka večnosti a záchrana v Kristovi"
    },
    {
        id: 13,
        number: 13,
        title: "Drž ma pevne",
        subtitle: "Modlitba dôvery v Božej ruke"
    },
    {
        id: 14,
        number: 14,
        title: "Svet sa zmení",
        subtitle: "Nádej Kristovho príchodu a záchrana z milosti"
    },
    {
        id: 15,
        number: 15,
        title: "Svetlo v tme",
        subtitle: "Svetlo, pokoj a radosť v Kristovi"
    },
    {
        id: 16,
        number: 16,
        title: "Na rozhraní tmy",
        subtitle: "Svetlo, ktoré prenikne aj do najhlbšej tmy"
    }
];
