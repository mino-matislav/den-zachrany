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
        audioUrl: "assets/audio/songs/01-zachrana-v-temnote.mp3",
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
        audioUrl: "assets/audio/songs/02-nic-noveho-pod-slnkom.mp3?v=hq",
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
        audioUrl: "assets/audio/songs/03-nemam-strach.mp3?v=hq",
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
        audioUrl: "assets/audio/songs/05-nahle-a-necakane.mp3",
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
    }
];
