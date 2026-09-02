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
function warn(msg) { console.log('  \u26a0 ' + msg + '  (upozornenie, deploy pokračuje)'); }

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

// ---------- 2b) Kľúčové bloky v player.js (contract) ----------
// POZOR: tieto riadky sú výsledkom ladenia, ktoré stálo veľa času.
// Podrobné vysvetlenie prečo: docs/AUDIO-PREHRAVAC.md — PREČÍTAJ pred zmenou player.js.
console.log('\n[2b] Kľúčové bloky v js/player.js');
const player = read('js/player.js');
const playerMarkers = {
  'priming pri prvom spustení (hasPrimed)': 'hasPrimed',
  'čaká na dostatočný buffer (readyState >= 4)': 'readyState >= 4',
  'čaká na canplaythrough (nie canplay)': "addEventListener('canplaythrough'",
  'poistný timeout aby prehrávanie nevisело': 'setTimeout(go,',
};
Object.entries(playerMarkers).forEach(([name, needle]) => must(player.includes(needle), name));
// 'canplay' (bez 'through') fired priskoro → pauza po prvom slove (30.8.2026).
// Seek na 0 na prvom spustení zahadzoval preload buffer → výpadok ~1 s (31.8.2026).
must(!/addEventListener\('canplay'[^t]/.test(player),
     "NEpoužíva 'canplay' na štart (má byť 'canplaythrough')");
must(!/hasPrimed = true;[\s\S]{0,120}currentTime = 0/.test(player),
     "priming NErobí seek currentTime=0 (zahadzoval preload buffer)");

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

// ---------- 4d) SEO súbory a značky ----------
console.log('\n[4d] SEO');
let _ch = null;
function chAvailIds() {
  if (!_ch) { const t = {}; new Function('e', read('js/data.js') + ';e.c=chapterData')(t);
    _ch = Object.entries(t.c).filter(([, c]) => c.available).map(([i]) => i); }
  return _ch;
}
must(fs.existsSync(P('robots.txt')), 'robots.txt existuje');
must(fs.existsSync(P('sitemap.xml')), 'sitemap.xml existuje');
must(fs.existsSync(P('assets/og-image.png')), 'og-image.png existuje (PNG, nie SVG)');
const robotsTxt = read('robots.txt');
const sitemapXml = read('sitemap.xml');
must(robotsTxt.includes('Sitemap:'), 'robots.txt odkazuje na sitemap');
must(robotsTxt.includes('Disallow: /pocuvaj.html'), 'robots.txt vylučuje duplicitnú pocuvaj.html');
must(!sitemapXml.includes('pocuvaj.html'), 'sitemap neobsahuje neindexovanú pocuvaj.html');
must(!sitemapXml.includes('den-zachrany.sk'), 'sitemap neodkazuje na neexistujúcu doménu den-zachrany.sk');
// každá stránka má buď canonical, alebo noindex — a nikde neexistujúca doména
['index.html', 'kapitoly.html', 'piesne.html', 'podpora.html', 'kapitola-1.html', 'piesen-1.html'].forEach(f => {
  const h = read(f);
  must(h.includes('rel="canonical"'), `${f} má kanonickú adresu`);
  must(!h.includes('den-zachrany.sk'), `${f} neodkazuje na neexistujúcu doménu`);
  must(!/og:image" content="[^"]*\.svg"/.test(h), `${f} používa PNG obrázok pre zdieľanie`);
});
must(read('pocuvaj.html').includes('name="robots" content="noindex'), 'pocuvaj.html je neindexovaná');
must(fs.existsSync(P('scripts/build-seo.py')), 'build-seo.py existuje (adresa webu na jednom mieste)');
must(read('index.html').includes('name="google-site-verification"'),
  'index.html má overovaciu značku pre Google Search Console');
must(fs.existsSync(P('google27ea05d4c9159c44.html')),
  'overovací súbor pre Google Search Console existuje');
// štruktúrované údaje musia byť platný JSON
['index.html', 'kapitoly.html', 'piesne.html', 'kapitola-1.html', 'piesen-1.html'].forEach(f => {
  const m = read(f).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  let platny = false;
  try { platny = !!(m && JSON.parse(m[1])['@type']); } catch (e) { platny = false; }
  must(platny, `${f} má platné štruktúrované údaje`);
});

// samostatné stránky pre kapitoly a piesne (inak Google vidí duplicitný obsah)
const kapSub = chAvailIds().filter(i => fs.existsSync(P(`kapitola-${i}.html`)));
must(kapSub.length === chAvailIds().length, `každá kapitola má samostatnú stránku (${kapSub.length}/${chAvailIds().length})`);
// titulky musia byť rôzne
const tituly = kapSub.map(i => (read(`kapitola-${i}.html`).match(/<title>(.*?)<\/title>/s) || [,''])[1]);
must(new Set(tituly).size === tituly.length, 'každá kapitola má vlastný titulok (žiadne duplicity)');
// obsah musí byť rôzny
const nadpisy = kapSub.map(i => (read(`kapitola-${i}.html`).match(/class="chapter-heading">(.*?)</s) || [,''])[1]);
must(new Set(nadpisy).size === nadpisy.length, 'každá kapitola má vlastný nadpis v HTML');
must(read('kapitola.html').includes('name="robots" content="noindex'), 'kapitola.html je noindex (duplicita)');
must(read('piesen.html').includes('name="robots" content="noindex'), 'piesen.html je noindex (duplicita)');
must(sitemapXml.includes('kapitola-1.html') && !sitemapXml.includes('kapitola.html?id='),
  'sitemap odkazuje na samostatné stránky, nie na ?id=');
// odkazy v HTML nesmú viesť na neindexované ?id= adresy
['index.html', 'kapitoly.html', 'piesne.html'].forEach(f => {
  const h = read(f);
  must(!/href="(kapitola|piesen)\.html\?id=/.test(h),
    `${f} neodkazuje na neindexované adresy ?id=`);
});


// obsah musí byť predgenerovaný v HTML — inak ho roboty a AI nevidia
const kapHtml = read('kapitoly.html'), pieHtml = read('piesne.html');
must(!kapHtml.includes('Načítavajú sa kapitoly'), 'kapitoly.html nemá zástupný text (obsah je predgenerovaný)');
must(!pieHtml.includes('Načítavajú sa piesne'), 'piesne.html nemá zástupný text (obsah je predgenerovaný)');
const kapKarty = (kapHtml.match(/class="chapter-item"/g) || []).length;
const pieKarty = (pieHtml.match(/class="chapter-item"/g) || []).length;
must(kapKarty >= 10, `kapitoly.html má predgenerované karty (${kapKarty})`);
must(pieKarty >= 10, `piesne.html má predgenerované karty (${pieKarty})`);
must(!read('kapitola.html').includes('<h1 class="chapter-heading">Načítava sa'),
  'kapitola.html má predgenerovanú ukážku');
must(!read('piesen.html').includes('<h1 class="song-heading">Načítava sa'),
  'piesen.html má predgenerovanú ukážku');

// ---------- 5) Integrita dát KAPITOL ----------
console.log('\n[5] Integrita dát — kapitoly');
const s1 = {};
new Function('e', read('js/data.js') + ';e.chapterData = chapterData;')(s1);
const chapterData = s1.chapterData;
must(chapterData && Object.keys(chapterData).length > 0, 'chapterData nie je prázdne');
// duplicitný blok kapitoly by sa v JS len prepísal a nikto by si to nevšimol
const surove = read('js/data.js');
const cisla = (surove.match(/^    "\d+": \{/gm) || []).map(x => x.match(/\d+/)[0]);
const dupl = cisla.filter((c, i) => cisla.indexOf(c) !== i);
must(dupl.length === 0, `žiadna kapitola nie je v data.js dvakrát${dupl.length ? ' (duplicitné: ' + [...new Set(dupl)].join(', ') + ')' : ''}`);
must(cisla.length === Object.keys(chapterData).length,
  `počet blokov v súbore sedí s počtom kapitol (${cisla.length} vs ${Object.keys(chapterData).length})`);
// popis domovskej musí uvádzať aktuálny počet kapitol
const pocetKap = Object.values(chapterData).filter(c => c.available).length;
must(read('index.html').includes(`${pocetKap} kapitol`),
  `popis domovskej uvádza aktuálny počet kapitol (${pocetKap})`);
must(read('README.md').includes(`**${pocetKap} kapitol**`),
  `README uvádza aktuálny počet kapitol (${pocetKap})`);
// sitemap musí obsahovať každú dostupnú kapitolu a každú pieseň
const chAvail = Object.entries(chapterData).filter(([, c]) => c.available).map(([i]) => i);
const chybaKap = chAvail.filter(i => !sitemapXml.includes(`kapitola-${i}.html<`));
must(chybaKap.length === 0, `sitemap obsahuje všetky kapitoly${chybaKap.length ? ' (chýbajú: ' + chybaKap.join(', ') + ')' : ''}`);
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

// ---------- 8) Audio piesní: tichý nábeh na začiatku ----------
// Piesne 18 a 19 pôvodne začínali hudbou už po ~0,12 s. Prehliadač si na štarte
// krátko dobuferuje a pri takom súbore to preruší hudbu (počuť "prvý tón, pauza,
// pokračovanie"). Všetkých 17 starších piesní má nábeh ~1,0–1,5 s a problém nemá.
// TÝKA SA IBA PIESNÍ. Modlitby a úvodné slovo majú nábeh 0,03-0,11 s a je to
// správne — sú 192 kbps mono, buferujú sa rýchlo. Ticho im NEPRIDÁVAŤ.
// Podrobne: docs/AUDIO-PREHRAVAC.md
console.log('\n[8] Audio — tiché intro (piesne + modlitby + úvod)');
try {
  execSync('ffprobe -version', { stdio: 'pipe' });
  // prvých 0,6 s musí byť ticho (< -30 dB) — inak prehrávač ukusuje začiatok
  const leadOk = (full, label) => {
    const out = execSync(
      `ffmpeg -hide_banner -t 0.6 -i "${full}" -af volumedetect -f null - 2>&1 || true`,
      { encoding: 'utf8', shell: '/bin/bash' }
    );
    const m = out.match(/max_volume:\s*(-?[0-9.]+) dB/);
    if (!m) { ok(`${label} — nábeh sa nedal zmerať (preskočené)`); return; }
    const maxDb = parseFloat(m[1]);
    must(maxDb < -30, `${label} — prvých 0,6 s tiché (max ${maxDb.toFixed(1)} dB, limit -30)`);
  };
  const songsDir = P('assets/audio/songs');
  if (fs.existsSync(songsDir))
    fs.readdirSync(songsDir).filter(f => f.endsWith('.mp3')).sort()
      .forEach(f => leadOk(songsDir + '/' + f, f));
  // modlitby + aktívny úvod (uvod-v3) — od 31.8.2026 majú mať tiež ~1 s intro
  for (let i = 1; i <= 22; i++) {
    const f = P(`assets/audio/modlitba-${i}.mp3`);
    if (fs.existsSync(f)) leadOk(f, `modlitba-${i}.mp3`);
  }
  const uvod = P('assets/audio/uvod-v3.mp3');
  if (fs.existsSync(uvod)) leadOk(uvod, 'uvod-v3.mp3');
} catch (e) {
  ok('ffprobe/ffmpeg nedostupné — kontrola nábehu preskočená');
}

// ---------- 9) Zvukový profil modlitieb (voliteľné: VERIFY_AUDIO=1) ----------
// Porovná každú modlitbu s cieľovým profilom 6/7/8/9 a UPOZORNÍ (nezastaví deploy)
// na pásmo mimo tolerancie — hlavne bzučanie v 5–8 kHz. Pomalé (ffmpeg na každý
// súbor), preto default vypnuté. Cieľové hodnoty: docs/AUDIO-PREHRAVAC.md bod 9.
console.log('\n[9] Zvukový profil modlitieb');
if (process.env.VERIFY_AUDIO) {
  try {
    execSync('ffprobe -version', { stdio: 'pipe' });
    const out = execSync('python3 scripts/audio-profil.py --check', { encoding: 'utf8' });
    out.trimEnd().split('\n').forEach(line => {
      const t = line.trim();
      if (t.startsWith('!')) warn(t.replace(/^!\s*/, ''));
      else if (t) ok(t.replace(/^OK\s*/, '').replace(/^->\s*/, ''));
    });
  } catch (e) { ok('ffprobe/python nedostupné — kontrola preskočená'); }
} else {
  ok('preskočené (spusti s VERIFY_AUDIO=1 pre kontrolu profilu)');
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
