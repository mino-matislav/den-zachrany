#!/usr/bin/env node
// Mechanická kontrola textov kapitol pred predložením Adminovi (docs/KONTROLA-TEXTOV.md).
// Len upozorňuje, nič nemení a vždy končí exit 0. Piesne sa nekontrolujú.
//
//   node scripts/kontrola-textu.js 28          jedna kapitola (alebo viac: 9 10 12)
//   node scripts/kontrola-textu.js --all       všetky kapitoly
//   node scripts/kontrola-textu.js --text f    koncept v textovom súbore (bez kontroly veršov)

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const e = {};
new Function('e', fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8') + ';e.c=chapterData')(e);
const kapitoly = Object.values(e.c).filter(c => c && c.id);

// fráza → dôvod; p = len v modlitbe, k1 = neplatí pre kapitolu 1 (modlitba pre neveriaceho)
const FRAZY = [
  [/odpusť mi/i, 'veriaci je už odpustený: vyznanie a vďaka (1Jn 1, 9)', { k1: 1 }],
  [/očisti ma|očisť ma/i, 'veriaci je už očistený (Žid 10, 14)', { k1: 1 }],
  [/(daj|zošli|vylej) mi (svojho |Tvojho )?(Svätého )?Duch|naplň ma (svojím |Tvojím )?Duch/i, 'Duch prebýva vo veriacom (Ef 1, 13–14)', { k1: 1 }],
  [/daj mi (svoj |Tvoj )?pokoj/i, 'neprosí sa o to, čo veriaci už má'],
  [/prikazujem/i, 'Pavol neučí prikazovať duchom, telu ani okolnostiam (Ef 6, 10–18)'],
  [/uvoľňuj/i, '„uvoľňujem moc/pokoj" nie je Pavlov jazyk (Fil 2, 13)'],
  [/som uzdraven/i, 'prísľub telesného uzdravenia (2Kor 12, 9; 2Tim 4, 20)'],
  [/prestaň prosiť|nemusíš prosiť/i, 'Pavol učí prosiť s vďakou (Fil 4, 6)'],
  [/hojnos/i, 'pozor na prosperitu (Fil 4, 11–12)'],
  [/Pane Ježiši\b/, 'vokatív je „Pane Ježišu"'],
  [/\bvo tvojom|\bvo Tvojom/, '„v tvojom", nie „vo tvojom"'],
  [/prehlasuj/i, '„vyhlasujem", nie „prehlasujem"'],
  [/\bočisť\b/i, 'rozkazovací spôsob je „očisti"'],
];
const STARY_ZAKON = /^(\d\. )?(Mojžišova|Józua|Sudcov|Rút|Samuelova|Kráľov|Kroník|Ezdráš|Nehemiáš|Ester|Jób|Žalm|Príslovia|Kazateľ|Pieseň|Izaiáš|Jeremiáš|Plač|Ezechiel|Daniel|Ozeáš|Joel|Ámos|Abdiáš|Jonáš|Micheáš|Náhum|Habakuk|Sofoniáš|Aggeus|Zachariáš|Malachiáš)/;
const EVANJELIA = /^(Matúš|Marek|Lukáš|Ján) \d/;
const BEZNE = new Set('ktorý ktorá ktoré ktorí ktorým ktorú ktorej ktorého ktorých ktorom pretože naozaj všetko všetky všetci každý každú každého Krista Kristovi Kristus Ježiša Ježiš Ježišu Tvoje Tvoja Tvojho Tvojom Tvojej Tvojou Tvoju Tvojím Tvojich Tvoj Svätý Svätého Duchom Ducha Božie Božia Božieho Božiu Slovo Slova Slovu Slove Tebou Tebe Teba aby'.split(' '));

const normRef = r => (r || '').replace(/\s*—.*$/, '').replace(/Rímskym/g, 'Rimanom').replace(/Efezanom/g, 'Efezským').replace(/[–-]/g, '-').replace(/\s+/g, ' ').trim();
const vety = t => t.replace(/\s+/g, ' ').split(/(?<=[.!?…])\s+(?=[„"A-ZÁÄČĎÉÍĽĹŇÓÔŔŠŤÚÝŽ])/).filter(v => v.trim());
const slova = v => v.match(/[A-Za-zÁÄČĎÉÍĽĹŇÓÔŔŠŤÚÝŽáäčďéíľĺňóôŕšťúýž]+/g) || [];
const skrat = v => { const s = v.trim(); return s.length > 90 ? s.slice(0, 87) + '…' : s; };

function kontrolaTextu(nazov, text, jeModlitba, idKap) {
  const out = [];
  for (const [re, preco, o = {}] of FRAZY) {
    if (o.k1 && String(idKap) === "1") continue;
    const m = text.match(re);
    if (m) out.push(`fráza „${m[0]}": ${preco}`);
  }
  // citáty (verše, priama reč) do dĺžky viet ani opakovaní nerátame
  const vv = vety(text.replace(/"[^"]*"/g, '"…"').replace(/„[^“"]*[“"]/g, '„…“'));
  const dlhe = vv.filter(v => slova(v).length > 15);
  if (dlhe.length) out.push(`${dlhe.length} z ${vv.length} viet má viac ako 15 slov, napr.: ${dlhe.slice(0, 3).map(v => '„' + skrat(v) + '"').join(' | ')}`);
  vv.forEach(v => {
    const c = {};
    slova(v).filter(s => s.length >= 5 && !BEZNE.has(s)).forEach(s => { const k = s.toLowerCase(); c[k] = (c[k] || 0) + 1; });
    const opak = Object.keys(c).filter(k => c[k] > 1);
    if (opak.length) out.push(`opakované slovo v jednej vete (${opak.join(', ')}): „${skrat(v)}"`);
  });
  if (!jeModlitba && idKap) {
    const n = slova(text).length;
    if (n < 450 || n > 650) out.push(`dĺžka príhovoru ${n} slov (cieľ 450–650)`);
  }
  if (out.length) { console.log(`  ${nazov}:`); out.forEach(o => console.log('    - ' + o)); }
  return out.length;
}

function kontrolaKapitoly(c) {
  console.log(`Kapitola ${c.id}: ${c.title}`);
  let n = kontrolaTextu('modlitba', c.prayer || '', true, c.id);
  n += kontrolaTextu('príhovor', c.fullText || '', false, c.id);
  const refs = (c.verses || []).map(v => normRef(v.ref));
  const ine = {};
  kapitoly.filter(k => String(k.id) !== String(c.id)).forEach(k => (k.verses || []).forEach(v => { ine[normRef(v.ref)] = k.id; }));
  refs.forEach(r => {
    if (ine[r]) { console.log(`  - verš ${r} je už v kapitole ${ine[r]}`); n++; }
    if (EVANJELIA.test(r)) { console.log(`  - ${r}: evanjelium pred krížom, zarámcuj (kto hovorí, komu)`); n++; }
    else if (STARY_ZAKON.test(r)) { console.log(`  - ${r}: Starý zákon, zarámcuj (typ a tieň, komu bol daný)`); n++; }
  });
  if (!n) console.log('  bez nálezov');
  return n;
}

const args = process.argv.slice(2);
if (!args.length) { console.log('Použitie: node scripts/kontrola-textu.js <číslo kapitoly…> | --all | --text <súbor>'); process.exit(0); }
if (args[0] === '--text') {
  const t = fs.readFileSync(args[1], 'utf8');
  console.log(`Koncept ${args[1]}`);
  if (!kontrolaTextu('text', t, true, null)) console.log('  bez nálezov');
} else {
  const ids = args[0] === '--all' ? kapitoly.map(k => k.id) : args;
  let spolu = 0;
  ids.forEach(id => {
    const c = kapitoly.find(k => String(k.id) === String(id));
    if (!c) console.log(`Kapitola ${id} v js/data.js nie je.`);
    else spolu += kontrolaKapitoly(c);
  });
  console.log(`\nNálezov: ${spolu}. Sú to upozornenia, každé posúď podľa docs/KONTROLA-TEXTOV.md.`);
}
