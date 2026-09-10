#!/bin/bash
# STAV PROJEKTU — spusti VZDY na zaciatku prace a PRED vlozenim noveho obsahu.
# Chrani pred duplicitnym vlozenim kapitoly/piesne, ked sa praca preusila
# (napr. po vycerpani limitu konverzacie) a nie je jasne, co uz je hotove.
cd "$(dirname "$0")/.." || exit 1
echo "=== STAV PROJEKTU ==="
node -e "
const fs=require('fs');
let c=fs.readFileSync('js/data.js','utf8'); c+=';globalThis.__a={chapterData};'; eval(c);
let s=fs.readFileSync('js/data-songs.js','utf8'); s+=';globalThis.__b={songData};'; eval(s);
const cd=globalThis.__a.chapterData, sd=globalThis.__b.songData;
const ids=Object.keys(cd).map(Number).sort((a,b)=>a-b);
console.log('kapitol: '+ids.length+'  (posledna: '+ids[ids.length-1]+' — '+cd[String(ids[ids.length-1])].title+')');
const bezAudia=ids.filter(i=>!cd[String(i)].hasAudio);
console.log('bez audia: '+(bezAudia.length?bezAudia.join(', '):'ziadna'));
const sids=Object.keys(sd).map(Number).sort((a,b)=>a-b);
console.log('piesni:  '+sids.length+'  (posledna: '+sids[sids.length-1]+' — '+sd[String(sids[sids.length-1])].title+')');
"
echo "--- duplicitne bloky v data.js (musi byt prazdne) ---"
dup=$(grep '^    "[0-9]*": {' js/data.js | awk -F'"' '{print $2}' | sort -n | uniq -d)
[ -z "$dup" ] && echo "  ziadne" || echo "  !!! DUPLICITA: $dup"
echo "--- service worker ---"
grep -o "den-zachrany-v[0-9]*" sw.js
echo "--- git ---"
echo "  posledny commit: $(git log -1 --format='%h %s' | cut -c1-70)"
echo "  necommitnute:    $(git status --short | wc -l) suborov"
