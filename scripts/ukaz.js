#!/usr/bin/env node
// Vypíše len zvolenú časť kapitoly z js/data.js. Nič nemení.
//
//   node scripts/ukaz.js 9 modlitba
//   node scripts/ukaz.js 9 prihovor
//
// Časti: nazov, prihovor, modlitba, verse, tagy, vsetko (predvolené).

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const CASTI = ['nazov', 'prihovor', 'modlitba', 'verse', 'tagy', 'vsetko'];
const [id, cast = 'vsetko'] = process.argv.slice(2);

if (!id || !CASTI.includes(cast)) {
  console.log('Použitie: node scripts/ukaz.js <číslo kapitoly> [' + CASTI.join('|') + ']');
  process.exit(1);
}

const e = {};
new Function('e', fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8') + ';e.c=chapterData')(e);
const k = e.c[id];
if (!k || !k.id) {
  console.log('Kapitola ' + id + ' v js/data.js neexistuje.');
  process.exit(1);
}

const vypis = {
  nazov: () => [
    'Kapitola ' + k.id + ': ' + k.title,
    'Podnadpis: ' + k.subtitle,
    'Krátky popis: ' + k.shortDescription,
    'Téma Písma: ' + k.scriptureTheme,
    'Audio: ' + (k.hasAudio ? k.audioUrl : 'nie je'),
  ].join('\n'),
  prihovor: () => k.fullText,
  modlitba: () => k.prayer,
  verse: () => (k.verses || []).map((v, i) => (i + 1) + '. ' + v.ref + '\n   „' + v.text + '“').join('\n'),
  tagy: () => (k.tags || []).join(', '),
};

const nadpis = { nazov: 'NÁZOV', prihovor: 'PRÍHOVOR', modlitba: 'MODLITBA', verse: 'VERŠE', tagy: 'TAGY' };

if (cast === 'vsetko') {
  console.log(Object.keys(vypis).map(c => '=== ' + nadpis[c] + ' ===\n' + vypis[c]()).join('\n\n'));
} else {
  console.log(vypis[cast]());
}
