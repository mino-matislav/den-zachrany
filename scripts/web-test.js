// Prehliadačový test živého webu Deň Záchrany (len čítanie, headless).
// Spúšťa sa PO nasadení: node scripts/web-test.js [základná URL]
// Kontroluje všetky stránky zo sitemapy (počítač aj mobil), odkazy, MP3,
// prehrávanie, počty kapitol/piesní, filter tém a mobilné menu.
// Dopĺňa verify.js (ten kontroluje zdrojové súbory pred nasadením).
// Výsledky a snímky ukladá MIMO projekt (dočasný priečinok), nikdy do repozitára.
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = (process.argv[2] || 'https://den-zachrany.vercel.app').replace(/\/$/, '');
const OUT = process.env.WEB_TEST_OUT || path.join(require('os').tmpdir(), 'den-zachrany-web-test');
fs.mkdirSync(OUT, { recursive: true });

const chyby = [];
const upozornenia = [];
let ok = 0;
const pass = (m) => { ok++; };
const fail = (m) => chyby.push(m);

// Zaznamenáva každé prehrávanie (aj new Audio() mimo DOM)
const INIT = `
  window.__media = [];
  const _play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (!window.__media.includes(this)) window.__media.push(this);
    return _play.apply(this, arguments);
  };`;

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });

  // 1) Zoznam stránok zo sitemapy
  const req = await (await browser.newContext()).request;
  const sm = await (await req.get(BASE + '/sitemap.xml')).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/^https?:\/\/[^/]+/, BASE));
  const odkazy = new Set();
  const audio = new Set();
  const stiahnut = new Set();

  // 2) Každá stránka: počítač aj mobil
  const profily = [
    { meno: 'počítač', opts: { viewport: { width: 1366, height: 900 } } },
    { meno: 'mobil', opts: { ...devices['Pixel 7'] } },
  ];
  for (const prof of profily) {
    const ctx = await browser.newContext(prof.opts);
    await ctx.addInitScript(INIT);
    for (const url of urls) {
      const kratka = url.replace(BASE, '') || '/';
      process.stdout.write('.');
      // Pri sieťovom výpadku (prerušené spojenie, vypršaný čas) sa stránka raz zopakuje
      // v novej karte; chyba sa hlási, až keď zlyhá aj druhý pokus.
      let p, konzola, zlyhane, resp, chybaNacitania = null;
      for (let pokus = 1; pokus <= 2; pokus++) {
        p = await ctx.newPage();
        konzola = [];
        zlyhane = [];
        p.on('console', m => { if (m.type() === 'error') konzola.push(m.text()); });
        p.on('pageerror', e => konzola.push('JS chyba: ' + e.message));
        p.on('response', r => {
          const u = r.url();
          if (u.startsWith(BASE) && r.status() >= 400) zlyhane.push(r.status() + ' ' + u.replace(BASE, ''));
        });
        try { resp = await p.goto(url, { waitUntil: 'load', timeout: 45000 }); await p.waitForTimeout(1200); chybaNacitania = null; break; }
        catch (e) {
          chybaNacitania = e.message.split('\n')[0];
          const sietova = /ERR_CONNECTION|ERR_NETWORK|ERR_TIMED_OUT|ERR_EMPTY_RESPONSE|Timeout .*exceeded/i.test(chybaNacitania);
          if (!sietova || pokus === 2) break;
          await p.close();
        }
      }
      if (chybaNacitania) { fail(`[${prof.meno}] ${kratka}: nenačítala sa (${chybaNacitania})`); await p.close(); continue; }
      if (!resp || resp.status() !== 200) fail(`[${prof.meno}] ${kratka}: stav ${resp && resp.status()}`); else pass();

      const info = await p.evaluate(() => ({
        h1: (document.querySelector('h1') || {}).textContent || '',
        title: document.title,
        sirka: document.documentElement.scrollWidth,
        okno: window.innerWidth,
        odkazy: [...document.querySelectorAll('a[href]')].map(a => a.href),
        audio: [...document.querySelectorAll('audio[src], source[src], [data-src]')].map(e => e.src || e.dataset.src),
        stiahnut: [...document.querySelectorAll('a.download-btn')].map(a => a.href).filter(h => h.startsWith('https://raw.githubusercontent.com/')),
      }));
      if (!info.h1.trim()) fail(`[${prof.meno}] ${kratka}: chýba nadpis H1`); else pass();
      if (!info.title.trim()) fail(`[${prof.meno}] ${kratka}: chýba titulok stránky`); else pass();
      if (info.sirka > info.okno + 2) fail(`[${prof.meno}] ${kratka}: obsah je širší ako obrazovka (${info.sirka}px > ${info.okno}px) – vodorovné posúvanie`); else pass();
      if (konzola.length) fail(`[${prof.meno}] ${kratka}: chyby v konzole: ${[...new Set(konzola)].slice(0, 3).join(' | ')}`); else pass();
      if (zlyhane.length) fail(`[${prof.meno}] ${kratka}: nenačítané súbory: ${[...new Set(zlyhane)].slice(0, 5).join(', ')}`); else pass();
      info.odkazy.forEach(h => { if (h.startsWith(BASE)) odkazy.add(h.split('#')[0]); });
      info.audio.forEach(a => a && audio.add(a));
      info.stiahnut.forEach(a => stiahnut.add(a));
      await p.close();
    }
    await ctx.close();
  }

  // 3) Odkazy a MP3 z dát (data.js, data-songs.js)
  for (const js of ['/js/data.js', '/js/data-songs.js']) {
    const t = await (await req.get(BASE + js)).text();
    [...t.matchAll(/["'`]([^"'`]+\.mp3[^"'`]*)["'`]/g)].forEach(m => audio.add(new URL(m[1], BASE + '/').href));
  }
  for (const u of odkazy) {
    const r = await req.get(u, { maxRedirects: 5 });
    if (r.status() >= 400) fail(`Nefunkčný odkaz: ${u.replace(BASE, '')} (${r.status()})`); else pass();
  }
  for (const u of audio) {
    const r = await req.get(u, { headers: { Range: 'bytes=0-1023' } });
    const typ = r.headers()['content-type'] || '';
    if (r.status() >= 400) fail(`Chýba MP3: ${u.replace(BASE, '')} (${r.status()})`);
    else if (!/audio|octet/.test(typ)) fail(`MP3 má zlý typ: ${u.replace(BASE, '')} (${typ})`);
    else pass();
  }
  for (const u of stiahnut) {
    const r = await req.get(u, { headers: { Range: 'bytes=0-1023' } });
    const typ = r.headers()['content-type'] || '';
    if (r.status() >= 400) fail(`Nefunkčné stiahnutie: ${u} (${r.status()})`);
    else if (!/audio|octet/.test(typ)) fail(`Stiahnutie má zlý typ: ${u} (${typ})`);
    else pass();
  }

  // 4) Funkčné testy
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await ctx.addInitScript(INIT);
  const hraje = async (p, popis, selektor) => {
    try {
      if (selektor) {
        const btn = p.locator(selektor).first();
        await btn.scrollIntoViewIfNeeded();
        await btn.click({ timeout: 10000 });
      }
      await p.waitForTimeout(5000);
      const st = await p.evaluate(() => (window.__media || []).map(m => ({ t: m.currentTime, paused: m.paused, err: m.error && m.error.code })));
      if (st.some(s => s.t > 0.5)) pass();
      else fail(`Prehrávanie – ${popis}: zvuk sa nespustil (${JSON.stringify(st)})`);
    } catch (e) { fail(`Prehrávanie – ${popis}: ${e.message.split('\n')[0]}`); }
  };
  let p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'load' });
  await hraje(p, 'Úvodné slovo (domov)', '.player-play:visible');
  await p.screenshot({ path: path.join(OUT, 'domov.png') });
  await p.close();

  p = await ctx.newPage();
  await p.goto(BASE + '/kapitola-1.html', { waitUntil: 'load' });
  await hraje(p, 'modlitba kapitoly 1', '.player-play:visible');
  await p.close();

  p = await ctx.newPage();
  await p.goto(BASE + '/piesen-1.html', { waitUntil: 'load' });
  await hraje(p, 'pieseň 1', '.player-play:visible');
  await p.close();

  p = await ctx.newPage();
  await p.goto(BASE + '/pocuvaj.html', { waitUntil: 'load' });
  // pocuvaj.html sa po načítaní spustí sama (prehliadač v teste dovolí zvuk bez kliknutia),
  // vtedy je tlačidlo Prehrať skryté. Klikne sa naň, len ak sa prehrávanie nespustilo samo.
  const samo = await p.locator('.player-pause').waitFor({ state: 'visible', timeout: 10000 }).then(() => true, () => false);
  await hraje(p, samo ? 'Počúvaj a čítaj (spustené samo)' : 'Počúvaj a čítaj', samo ? null : '.player-play:visible');
  await p.screenshot({ path: path.join(OUT, 'pocuvaj.png') });
  await p.close();

  // Počty a filter kapitol
  p = await ctx.newPage();
  await p.goto(BASE + '/kapitoly.html', { waitUntil: 'load' });
  const pocet = () => p.evaluate(() => [...document.querySelectorAll('.chapter-item')].filter(e => e.offsetParent !== null).length);
  const vsetky = await pocet();
  const vSitemape = urls.filter(u => /kapitola-\d+\.html/.test(u)).length;
  if (vsetky !== vSitemape) fail(`Kapitoly: zoznam ukazuje ${vsetky}, v sitemape je ${vSitemape}`); else pass();
  try {
    if (await p.locator('.filter-toggle').isVisible()) await p.click('.filter-toggle');
    const btn = p.locator('.filter-btn:not([data-tag="all"])').first();
    const tema = await btn.textContent();
    await btn.click();
    await p.waitForTimeout(500);
    const po = await pocet();
    if (po > 0 && po < vsetky) pass(); else fail(`Filter tém „${tema.trim()}“: ukazuje ${po} z ${vsetky}`);
  } catch (e) { fail('Filter tém: ' + e.message.split('\n')[0]); }
  await p.close();

  p = await ctx.newPage();
  await p.goto(BASE + '/piesne.html', { waitUntil: 'load' });
  const piesne = await p.locator('.chapter-item').count();
  const pVSitemape = urls.filter(u => /piesen-\d+\.html/.test(u)).length;
  if (piesne !== pVSitemape) fail(`Piesne: zoznam ukazuje ${piesne}, v sitemape je ${pVSitemape}`); else pass();
  await p.close();

  // Mobilné menu
  const m = await browser.newContext({ ...devices['Pixel 7'] });
  p = await m.newPage();
  await p.goto(BASE + '/', { waitUntil: 'load' });
  try {
    await p.click('.nav-toggle');
    await p.waitForTimeout(500);
    if (await p.locator('#nav-menu a[href="kapitoly.html"]').isVisible()) pass();
    else fail('Mobilné menu: po kliknutí sa neotvorilo');
  } catch (e) { fail('Mobilné menu: ' + e.message.split('\n')[0]); }
  await p.screenshot({ path: path.join(OUT, 'mobil-menu.png') });
  await browser.close();

  const sprava = [
    `Web: ${BASE}`,
    `Stránok: ${urls.length} (počítač aj mobil), odkazov: ${odkazy.size}, MP3: ${audio.size}, na stiahnutie: ${stiahnut.size}`,
    `Úspešných kontrol: ${ok}, chýb: ${chyby.length}, upozornení: ${upozornenia.length}`,
    '', ...chyby.map(c => 'CHYBA: ' + c), ...upozornenia.map(c => 'POZOR: ' + c),
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'sprava.txt'), sprava);
  console.log(sprava);
  process.exit(chyby.length ? 1 : 0);
})();
