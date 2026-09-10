#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bezpecny (idempotentny) zapis kapitoly/piesne do datovych suborov.

PRECO: ak sa praca preusi uprostred (napr. dojde limit konverzacie) a skript
sa spusti znova, naivne "vloz na koniec" vytvori DUPLICITNY blok. V JS sa
duplicita len prepise a navonok sa nic nestane - chyba prejde nepovsimnuta.
Tento modul preto najprv ZISTI, ci blok uz existuje:
  - existuje  -> NAHRADI ho (upsert), nezdvoji
  - neexistuje -> vlozi na koniec
Opakovane spustenie ma teda vzdy rovnaky vysledok.

Pouzitie v build skripte:
    from upsert import upsert_chapter, upsert_song
    upsert_chapter('js/data.js', '25', entry_text)

Overenie: `node scripts/verify.js` kontroluje, ze pocet blokov == pocet kapitol.
"""
import io, re, sys


def _find_blocks(src, key, indent='    '):
    """Vrati zoznam (start, end) vsetkych blokov s danym klucom."""
    pat = re.compile(r'^%s"%s"\s*:\s*\{' % (re.escape(indent), re.escape(key)), re.M)
    out = []
    for m in pat.finditer(src):
        end = src.find('\n%s}' % indent, m.start())
        if end < 0:
            raise ValueError('nenasiel som koniec bloku "%s"' % key)
        out.append((m.start(), end + len('\n%s}' % indent)))
    return out


def upsert_block(path, key, entry, anchor_tail='        isStarter: false\n    }\n};'):
    """Vlozi alebo nahradi blok. Vracia 'inserted' / 'replaced'."""
    src = io.open(path, encoding='utf-8').read()
    blocks = _find_blocks(src, key)

    if len(blocks) > 1:
        # uprac duplicity vzniknute skorsim prerusenim
        for st, en in reversed(blocks[1:]):
            before = src.rfind('},\n', 0, st)
            src = src[:before + 1] + src[en:]
        blocks = _find_blocks(src, key)
        sys.stderr.write('  ! najdene duplicitne bloky "%s" - odstranene\n' % key)

    if blocks:
        st, en = blocks[0]
        src = src[:st] + entry + src[en:]
        io.open(path, 'w', encoding='utf-8').write(src)
        return 'replaced'

    if src.count(anchor_tail) != 1:
        raise ValueError('kotva na vlozenie sa nenasla presne raz')
    src = src.replace(anchor_tail,
                      anchor_tail.split('\n    }\n};')[0] + '\n    },\n' + entry + '\n};', 1)
    io.open(path, 'w', encoding='utf-8').write(src)
    return 'inserted'


def upsert_chapter(path, cislo, entry):
    return upsert_block(path, str(cislo), entry)


if __name__ == '__main__':
    # rychla kontrola duplicit: python3 scripts/upsert.py js/data.js
    p = sys.argv[1] if len(sys.argv) > 1 else 'js/data.js'
    src = io.open(p, encoding='utf-8').read()
    nums = re.findall(r'^    "(\d+)"\s*:\s*\{', src, re.M)
    dup = sorted({n for n in nums if nums.count(n) > 1}, key=int)
    print('blokov: %d | unikatnych: %d' % (len(nums), len(set(nums))))
    print('DUPLICITY: %s' % (', '.join(dup) if dup else 'ziadne'))
    sys.exit(1 if dup else 0)
