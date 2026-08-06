#!/usr/bin/env node
/* ============================================================
   DEŇ ZÁCHRANY — kontrola pred nasadením (verify.js)
   Spustenie:  node scripts/verify.js
   Ak čokoľvek zlyhá, skončí s kódom 1 => deploy sa nesmie spustiť.
   Účel: aby to, čo raz funguje (kapitoly, piesne, filter), nikdy
   ticho nevypadlo pri budúcej úprave.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const P = (...a) => path.join(ROOT, ...a);
const read = f => fs.readFileSync(P(f), 'utf8');

let fails = [];
let checks = 0;
function ok(msg) { checks++; console.log('  \u2713 ' + msg); }
function bad(msg) { checks++; fails.push(msg); console.log('  \u2717 ' + msg); }
function must(cond, msg) { cond ? ok(msg) : bad(msg); }

// ---------- 1) Syntax všetkých JS ----------
console.log('\n[1] Syntax JS súborov');
['js/data.js', 'js/data-songs.js', 'js/app.js', 'js/player.js', 'sw.js'].forEach(f => {
  try { execSync(`node --check ${P(f)}`, { stdio: 'pipe' }); ok(f); }
  catch (e) { bad(f + ' — SYNTAKTICKÁ CHYBA: ' + String(e.stderr || e).split('\n')[0]); }
});

// ---------- 2) Kľúčové bloky v app.js (contract) ----------
console.log('\n[2] Kľúčové bloky v js/app.js');
const app = read('js/app.js');
const markers = {
  'render detailu KAPITOLY (.chapter-page)': "document.querySelector('.chapter-page')",
  'render detailu PIESNE (.song-page)': "document.querySelector('.song-page')",
  'spoločné vykreslenie piesne (renderSongContent)': 'function renderSongContent',
  'FILTER kapitol': 'FILTER KAPITOL',
  'dynamický zoznam kapitol': "document.querySelector('.chapters-list')",
};
Object.entries(markers).forEach(([name, needle]) => must(app.includes(needle), name));

// ---------- 3) Napojenie skriptov v HTML ----------
console.log('\n[3] Napojenie skriptov v HTML');
const wiring = {
  'kapitola.html': ['js/data.js', 'js/app.js'],
  'kapitoly.html': ['js/data.js', 'js/app.js'],
  'piesen.html': ['js/data-songs.js', 'js/app.js'],
  'piesne.html': ['js/data-songs.js', 'js/app.js'],
  'pocuvaj.html': ['js/data-songs.js', 'js/app.js'],
};
Object.entries(wiring).forEach(([file, needs]) => {
  const html = read(file);
  needs.forEach(n => must(html.includes(n), `${file} načítava ${n}`));
});

// ---------- 4) Service worker ----------
console.log('\n[4] Service worker (sw.js)');
const sw = read('sw.js');
must(/den-zachrany-v\d+/.test(sw), 'má verziu keše den-zachrany-vN');
must(sw.includes("'/js/app.js'"), 'kešuje /js/app.js');
must(sw.includes('/assets/audio/'), 'obchádza /assets/audio/ (neláme Range/streamovanie)');

// ---------- 4b) Filter musí vedieť karty naozaj skryť ----------
console.log('\n[4b] Skrývanie odfiltrovaných kariet');
const css = read('css/style.css');
must(/\.chapter-item\.hidden[^{]*\{[^}]*display:\s*none\s*!important/.test(css),
  'pravidlo .chapter-item.hidden má display:none !important (inak ho prebijú pravidlá rozloženia)');
must(app.includes("classList.toggle('hidden'"), 'app.js označuje nezhodné karty triedou hidden');

// ---------- 4c) Stránka Podpora ----------
console.log('\n[4c] Stránka Podpora');
const podpora = read('podpora.html');
must(podpora.includes('SK72 1100 0000 0029 4300 6853'), 'podpora.html obsahuje IBAN');
must(podpora.includes('assets/qr-podpora.svg'), 'podpora.html odkazuje na QR kód');
must(fs.existsSync(P('assets/qr-podpora.svg')), 'súbor QR kódu existuje');
must(podpora.includes('2. Korintským 9, 7'), 'podpora.html obsahuje verš 2. Korintským 9, 7');
must(app.includes("querySelectorAll('.share-btn')"), 'app.js obsluhuje zdieľanie');
must(app.includes('navigator.share'), 'zdieľanie používa natívne rozhranie systému');
must(!podpora.includes('facebook.com') && !podpora.includes('twitter.com') && !podpora.includes('platform.x.com'),
  'podpora.html neobsahuje sledovacie skripty sociálnych sietí');
['index.html', 'kapitoly.html', 'piesne.html', 'kapitola.html', 'piesen.html'].forEach(f =>
  must(read(f).includes('podpora.html'), `${f} má odkaz na Podporu`));
must(sw.includes("'/podpora.html'"), 'service worker kešuje podpora.html');
// tlačidlo na stránke Podpora musí zdieľať DOMOVSKÚ stránku, nie samo seba
const shareUrlMatch = podpora.match(/data-share-url="([^"]*)"/);
must(shareUrlMatch && shareUrlMatch[1] === '/',
  `tlačidlo zdieľania na Podpore vedie na domovskú stránku (nájdené: "${shareUrlMatch ? shareUrlMatch[1] : 'chýba'}")`);
must(app.includes('new URL(raw, window.location.href)'), 'app.js prekladá relatívnu cestu na plnú adresu');

// ---------- 5) Integrita dát KAPITOL ----------
console.log('\n[5] Integrita dát — kapitoly');
const s1 = {};
new Function('e', read('js/data.js') + ';e.chapterData = chapterData;')(s1);
const chapterData = s1.chapterData;
must(chapterData && Object.keys(chapterData).length > 0, 'chapterData nie je prázdne');
Object.entries(chapterData).forEach(([id, ch]) => {
  if (!ch.available) { ok(`kapitola ${id} — Pripravujeme (preskočená)`); return; }
  const need = ['title', 'subtitle', 'fullText', 'prayer'];
  need.forEach(k => must(ch[k] && String(ch[k]).trim().length > 0, `kapitola ${id}: má ${k}`));
  must(Array.isArray(ch.verses), `kapitola ${id}: verses je pole`);
  // počet veršových odsekov v texte musí sedieť s poľom verses (na tomto stojí render)
  const quoteParas = ch.fullText.split('\n\n').map(p => p.trim())
    .filter(p => p.startsWith('"')).length;
  must(quoteParas === (ch.verses ? ch.verses.length : -1),
    `kapitola ${id}: počet veršov v texte (${quoteParas}) sedí s poľom verses (${ch.verses ? ch.verses.length : 'n/a'})`);
  (ch.verses || []).forEach((v, i) =>
    must(v.text && v.ref, `kapitola ${id}: verš ${i + 1} má text aj ref`));
});

// ---------- 5b) Slovník tém (aby sa tagy znova nerozsypali) ----------
console.log('\n[5b] Slovník tém');
const sv = {};
new Function('e', read('js/data.js') + ';e.tagGroups = (typeof tagGroups!=="undefined")?tagGroups:null;')(sv);
const groups = sv.tagGroups;
must(Array.isArray(groups) && groups.length > 0, 'tagGroups je definované');
if (Array.isArray(groups)) {
  const slovnik = new Set(groups.flatMap(g => g.tags));
  const pouzite = new Set();
  Object.values(chapterData).forEach(ch => (ch.tags || []).forEach(t => pouzite.add(t)));
  const mimo = [...pouzite].filter(t => !slovnik.has(t));
  must(mimo.length === 0, `všetky témy kapitol sú v slovníku${mimo.length ? ' (chýbajú: ' + mimo.join(', ') + ')' : ''}`);
  const nepouzite = [...slovnik].filter(t => !pouzite.has(t));
  must(nepouzite.length === 0, `slovník neobsahuje mŕtve témy${nepouzite.length ? ' (nepoužité: ' + nepouzite.join(', ') + ')' : ''}`);
  Object.entries(chapterData).forEach(([id, ch]) => {
    if (!ch.available) return;
    must(Array.isArray(ch.tags) && ch.tags.length >= 2, `kapitola ${id}: má aspoň 2 témy`);
  });
}

// ---------- 6) Integrita dát PIESNÍ ----------
console.log('\n[6] Integrita dát — piesne');
const s2 = {};
new Function('e', read('js/data-songs.js') + ';e.songData = songData; e.songList = songList;')(s2);
const { songData, songList } = s2;
must(songData && Object.keys(songData).length > 0, 'songData nie je prázdne');
must(Array.isArray(songList) && songList.length > 0, 'songList je neprázdne pole');
Object.entries(songData).forEach(([id, sng]) => {
  must(sng.title && String(sng.title).trim(), `pieseň ${id}: má title`);
  must(Array.isArray(sng.lyrics) && sng.lyrics.length > 0, `pieseň ${id}: má lyrics`);
});
songList.forEach(item => {
  const sid = item.id != null ? String(item.id) : '';
  must(sid && songData[sid], `songList → songData existuje pre id ${sid || '(chýba)'}`);
});

// ---------- 7) Render smoke test (kapitola 1 sa naozaj naplní) ----------
console.log('\n[7] Render smoke test');
try {
  const start = app.indexOf("const chapterPage = document.querySelector('.chapter-page')");
  const after = app.indexOf('SPOLOČNÉ VYKRESLENIE OBSAHU PIESNE', start);
  if (start === -1 || after === -1) throw new Error('chapter render blok sa nenašiel');
  // odrež po zatváraciu zátvorku bloku (posledné '    }' pred sekciou piesne)
  let blockSrc = app.slice(start, after);
  blockSrc = blockSrc.slice(0, blockSrc.lastIndexOf('\n    }') + '\n    }'.length);

  const firstAvail = Object.keys(chapterData).find(id => chapterData[id].available);
  const el = () => ({ textContent: '', innerHTML: '', querySelector: () => ({ src: '' }), load() {}, parentNode: { insertBefore() {} }, nextSibling: null });
  const els = {}; ['.chapter-heading', '.chapter-subheading', '.chapter-number-label',
    '.chapter-text', '.chapter-prayer-text', '.chapter-audio-title', '.chapter-page',
    '.chapter-audio audio'].forEach(k => els[k] = el());
  const doc = { querySelector: k => els[k] || null, title: '', createElement: function(tag) { return el(); } };
  const win = { location: { search: '?id=' + firstAvail, set href(v) { els.__r = v; } } };
  const Storage = { setLastRead() {} };
  new Function('chapterData', 'Storage', 'document', 'window', 'URLSearchParams', blockSrc)
    (chapterData, Storage, doc, win, URLSearchParams);

  must(els['.chapter-heading'].textContent.length > 0, `kapitola ${firstAvail}: nadpis sa naplnil`);
  const vc = (els['.chapter-text'].innerHTML.match(/class="chapter-verse"/g) || []).length;
  must(vc === chapterData[firstAvail].verses.length,
    `kapitola ${firstAvail}: vykreslených ${vc} veršov (očak. ${chapterData[firstAvail].verses.length})`);
  must(els['.chapter-prayer-text'].innerHTML.includes('<p>'), `kapitola ${firstAvail}: modlitba sa naplnila`);
} catch (e) {
  bad('render smoke test zlyhal: ' + e.message);
}

// ---------- Výsledok ----------
console.log('\n' + '='.repeat(52));
if (fails.length === 0) {
  console.log(`VŠETKO OK — ${checks} kontrol prešlo. Deploy je bezpečný.`);
  process.exit(0);
} else {
  console.log(`ZLYHALO ${fails.length} z ${checks} kontrol — DEPLOY ZASTAVENÝ:`);
  fails.forEach(f => console.log('   - ' + f));
  process.exit(1);
}
