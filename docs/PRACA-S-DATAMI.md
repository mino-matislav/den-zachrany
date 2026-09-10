# Práca s dátovými súbormi — ako nevytvoriť duplicitu

## Problém

Pridávanie kapitoly alebo piesne je viackrokový zápis do `js/data.js`
(resp. `js/data-songs.js`). Ak sa práca **preruší uprostred** — typicky keď
dôjde limit konverzácie — a skript sa pri obnovení spustí znova, naivné
„vlož na koniec" vytvorí **druhý blok s tým istým číslom**.

Prečo je to zákerné: v JavaScripte sa duplicitný kľúč v objekte len prepíše.
Web funguje ďalej, nič sa navonok nerozbije a chyba **prejde nepovšimnutá**.
Reálne sa to už stalo viackrát (naposledy kapitola 25, commit `2bb2f0d`).

## Riešenie: zápis musí byť idempotentný

Používaj **`scripts/upsert.py`**. Namiesto slepého pridania najprv zistí,
či blok už existuje:

- **existuje** → nahradí ho (upsert)
- **neexistuje** → vloží na koniec
- **našiel viac blokov** → duplicity odstráni a upozorní

Opakované spustenie tak vždy vedie k rovnakému výsledku.

```python
import sys; sys.path.insert(0, 'scripts')
from upsert import upsert_chapter

upsert_chapter('js/data.js', '25', entry_text)   # inserted / replaced
```

## Rýchla kontrola duplicít

```bash
python3 scripts/upsert.py js/data.js        # kapitoly
node scripts/verify.js                       # kontroluje kapitoly aj piesne
```

`verify.js` porovnáva **počet blokov v súbore s počtom kľúčov v objekte**.
Ak sedí 26 blokov na 25 kapitol, je tam duplicita a deploy sa zastaví.

## Postup pri pridávaní obsahu

1. **Najprv zisti, či tam obsah už nie je** — či sa práca predtým neprerušila:
   ```bash
   grep -c '"25":' js/data.js
   ```
2. Zapíš cez `upsert.py` (nie ručným pripájaním na koniec).
3. `node scripts/verify.js` → musí skončiť s kódom **0**.
4. **Skutočne si prečítaj jeho výstup.** Ak hlási chybu, neposúvaj sa ďalej
   a neriskuj push — presne pred týmto verify chráni.
5. Skontroluj, či počet kontrol narástol (nový obsah je pod kontrolou).
6. Až potom commit a push.
