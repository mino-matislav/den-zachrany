# Remaster piesne cez rozdelenie na stopy

Tento postup sa overil na piesni 17 „Synovia svetla" 26. 9. 2026. Finálnu verziu Admin schválil posluchom.

## Kedy ho použiť

Pieseň znie husto alebo prevalene, spev je zakrytý, basa nie je počuť, prípadne vo výškach rušia ostré zvuky. Samotný EQ na hotový mix tieto problémy nevyrieši. Pieseň treba rozdeliť na stopy a každú upraviť zvlášť.

## Zvukové preferencie Admina

- Basová linka má byť počuť. Spev má byť zreteľný a nesmie byť prevalený.
- Pomer basy a bicích má byť ako v piesni 21. Bicie nesmú byť hlasnejšie než basa a nemajú mať „údernejší" kompresor.
- Gitara, aj tá skreslená, má byť počuť.
- Úvod piesne nesmie byť výrazne tichší než zvyšok.
- Pracuj takto: najprv krátke ukážky (asi 40 s, druhý refrén) v 2 až 3 smeroch. Admin vyberie alebo skombinuje. Potom sprav celú pieseň a dolaďuj podľa jeho slov.

## Nástroje (CPU, cloudové prostredie)

- `pip install --break-system-packages "audio-separator[cpu]"`. Modely sa sťahujú z GitHub releases a funguje to.
- Nefunguje: huggingface.co a dl.fbaipublicfiles.com sú blokované, takže Demucs nejde.
- BS-Roformer funguje, ale je veľmi pomalý (asi 20 min na 44 s), preto sa nepoužil.

Postup rozdelenia:

1. Spev: `UVR-MDX-NET-Inst_HQ_3.onnx`. Na jednu pieseň to trvá asi 3 minúty.
2. Z inštrumentálu basa: `kuielab_a_bass.onnx`.
3. Zo zvyšku bicie: `kuielab_a_drums.onnx`.
4. Zvyšok podkladu vypočítaj ako **mix − spev − basa − bicie** v numpy. Súčet stôp tak presne sedí s originálom.

## Nastavenia piesne 17 (finálna verzia „K")

**Spev**

- highpass 90 Hz
- 900 Hz −2,5 dB (q 1,2), proti nosovosti
- 3 kHz −1,5 dB (q 1,5)
- `deesser=i=0.4:m=0.5:f=0.5`
- highshelf 9 kHz +1,5 dB

**Basa**

- highpass 40 Hz, lowpass 1200 Hz
- 800 Hz +2 dB. Je to „hrana" basy, aby bola počuť aj na mobile.
- Bez kompresora.

**Bicie**

- highpass 35 Hz
- lowshelf 60 Hz −3 dB
- 8 kHz −2 dB (q 1,5)
- Bez kompresora.

**Podklad**

- 400 Hz −3 dB (q 0,8), proti „blatu"
- 7,5 kHz −2,5 dB (q 1,5), proti rušivým výškam
- highshelf 10 kHz −1 dB
- Pásmo 2,5 kHz **nerež**, sedí v ňom gitara.

**Boky podkladu (M/S, len side)**

- 1,5 kHz +2,5 dB (q 0,8), 3 kHz +2 dB, celkovo +1 dB
- Gitary sú rozložené do strán, spev je v strede. Takto sa zvýrazní gitara a spevu to neprekáža.

**Pomer stôp (relatívne k spevu)**

- basa −0,3 dB, bicie −3,45 dB, podklad −5,19 dB
- Pomer nastav meraním špičiek voči mixu (95. percentil 10 ms blokov) a porovnaj s referenčnou piesňou (21).

**Dynamika**

- Slohy a bridge −1 dB, refrény 0 dB.
- V 2. a 3. refréne ešte podklad −1 dB, inak sa prevaľuje.

**Úvod**

- Hlasitosť úvodu vždy porovnaj s verziou na webe.
- Pri piesni 17 mal WAV úvod o 7,5 dB tichší, preto dostal +6,5 dB s plynulým prechodom do 0:12,8.

## Master

1. Tiché intro: `adelay=960|960`.
2. Zosilnenie a `alimiter=limit=0.77:level=false:attack=5:release=60`.
3. Opakuj, kým výsledok nie je −13,3 LUFS.
4. **Nepoužívaj `loudnorm` s linear=true**, ak mix nemá rezervu. Loudnorm potom potichu prepne na dynamický režim a pieseň sploští (LRA kleslo 4,2 → 2,4).

Výsledok piesne 17: −13,3 LUFS, −1,9 dBTP, LRA 3,9, MP3 320 kbps, 44,1 kHz, Xing.

## Oprava chyby v speve

Chyba: v 2:34 („proti… proti duchom zla") bolo uprostred slabiky 0,2 s ticha. Bolo aj v origináli, ale odkryl ho až tichší podklad.

Oprava:

1. Na stope spevu nájdi rovnaký riadok v inom refréne krížovou koreláciou.
2. Vlož 0,32 s z 2. refrénu.
3. Vyrovnaj hlasitosť podľa okolia.
4. Prelínaj 25 ms na oboch stranách.

Admin potvrdil, že opravu nepočuť.

## Poučenia

- Vnímaná hlasitosť ≠ LUFS. Jasnejší zvuk (1–4 kHz) znie hlasnejšie, hoci LUFS je rovnaké.
- Pri výmene piesne pod rovnakým názvom vždy zvýš `?v=N` (immutable keš na 1 rok).
