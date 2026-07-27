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
        credit: "Text © Deň Záchrany",
        // Poradie v piesni: Sloha 1 · Sloha 2 · Refrén · Sloha 1 · Refrén · Sloha 1
        order: "Sloha 1 · Sloha 2 · Refrén · Sloha 1 · Refrén · Sloha 1",
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
            }
        ],
        verse: {
            text: "Hospodin je mojím svetlom a spásou, koho sa mám báť? Hospodin mi je pevnosťou žitia, koho sa mám ľakať?",
            ref: "Žalm 27, 1 — ECAV"
        }
    }
};

const songList = [
    {
        id: 1,
        number: 1,
        title: "Záchrana v temnote",
        subtitle: "Pieseň dôvery inšpirovaná Žalmom 27"
    }
];
