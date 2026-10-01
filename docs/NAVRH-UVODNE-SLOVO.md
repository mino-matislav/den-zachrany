# Úvodné slovo – SCHVÁLENÝ text (Admin, 1. 10. 2026)

Stav (1. 10. 2026): text schválený, Admin nahrávku dodal (80 s, mono 44,1 kHz, −15,1 LUFS, bez tichého intra; spracovať: −16,2 LUFS, špička pod −1,7 dBTP, intro 1 s, 48 kHz stereo 160 kbps). Ak sa úloha stratí, treba ju poslať znova. Nasadí sa spolu s kapitolou 1 a novou modlitbou 1 (rozhodnutie Admina). Pôvodne: Admin pripravuje novú nahrávku (uvod-v3.mp3 nahradí nová, obsahuje úvodný text aj Dôležité upozornenie).
Pri nasadení: text v index.html (sekcie „Úvodný text" a „Dôležité upozornenie") nahradiť presne týmto znením, nahrávku spracovať podľa CLAUDE.md (úvodné slovo: 48 kHz stereo, 160 kbps), zvýšiť ?v= pri uvod-*.mp3, SW +1.
Verš 2. Korintským 6, 2 nad prehrávačom sa nemení.

## Úvodný text

„Nemôžeš odomknúť dvere domu, do ktorého si ešte nevstúpil."

Hľadáš uzdravenie, pokoj, vyslobodenie zo strachu či obnovu rodiny? Boh vidí tvoju bolesť a záleží Mu na tebe.

Možno si myslíš, že každý človek je Božím dieťaťom. Boh síce stvoril každého, ale Jeho dieťaťom sa stávaš, až keď uveríš v Ježiša Krista. Vtedy ťa Boh prijme takého, aký si, a dá ti nový život. Budeš mať pokoj s Ním a istotu, že patríš Jemu.

Bez viery sa človek nemôže páčiť Bohu. Ako Jeho dieťa však môžeš k Nemu pristupovať s dôverou. On počúva modlitby svojich detí. Môžeš Mu povedať všetko, čo ťa trápi, a prosiť Ho o pomoc.

Ako sa staneš Jeho dieťaťom? Prečítaj si kapitolu Evanjelium spásy, alebo sa hneď teraz pomodli Modlitbu záchrany, ktorú nájdeš nižšie.

## Dôležité upozornenie

„Písmo učí, že Božie zasľúbenia nie sú ľudskou psychológiou ani čarovnou formulkou. Sú to živé pravdy pre tých, v ktorých prebýva Duch Svätý. Ak chceš, aby modlitby v nasledujúcich kapitolách boli skutočným rozhovorom s tvojím nebeským Otcom, začni vierou v Ježiša Krista. Bez Krista niet víťazstva."

## Otvorené (nie je súčasťou nahrávky)
- Tlačidlo „Modlitba záchrany ↓" netreba (Admin, 1. 10. 2026).
- Namiesto neho zmenšiť medzeru medzi Dôležitým upozornením a Modlitbou záchrany: v index.html na `<section class="warning-section"` pridať `style="padding-bottom: var(--space-6)"` (80 px → 24 px; pôvodný dôvod „priestor pred pätičkou" už neplatí, pod upozornením je Modlitba záchrany). Overené v náhľade (mobil 390 px aj PC): po dočítaní upozornenia je vidno začiatok karty Modlitby záchrany. Nasadiť spolu s úvodným slovom.
