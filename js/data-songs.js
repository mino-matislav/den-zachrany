// ============================================
// DÁTA PIESNÍ — Deň Záchrany
// Pridanie ďalšej piesne = doplniť záznam do songData a songList.
// ============================================

const songData = {
    "1": {
        id: 1,
        number: 1,
        title: "Záchrana v temnote",
        subtitle: "Pieseň dôvery inšpirovaná Žalmom 27",
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
        subtitle: "Pieseň inšpirovaná knihou Kazateľ",
        audioUrl: "assets/audio/songs/02-nic-noveho-pod-slnkom.mp3",
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
    }
};

const songList = [
    {
        id: 1,
        number: 1,
        title: "Záchrana v temnote",
        subtitle: "Pieseň dôvery inšpirovaná Žalmom 27"
    },
    {
        id: 2,
        number: 2,
        title: "Nič nového pod slnkom",
        subtitle: "Pieseň inšpirovaná knihou Kazateľ"
    }
];
