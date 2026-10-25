// Exports chapter and song data from the website (js/data.js, js/data-songs.js) to JSON for the book build.
const fs = require('fs'), path = require('path'), vm = require('vm');
const repo = path.resolve(__dirname, '..', '..');
const out = path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
const ctx = { window: {}, console };
vm.createContext(ctx);
for (const f of ['js/data.js', 'js/data-songs.js']) {
  const src = fs.readFileSync(path.join(repo, f), 'utf8').replace(/\bconst\b|\blet\b/g, 'var');
  vm.runInContext(src, ctx, { filename: f });
}
if (!ctx.chapterData || !ctx.songList) { console.error('chapterData alebo songList sa nenašli'); process.exit(1); }
fs.writeFileSync(path.join(out, 'chapters.json'), JSON.stringify(ctx.chapterData, null, 1));
fs.writeFileSync(path.join(out, 'songs.json'), JSON.stringify(ctx.songList, null, 1));
console.log('data ok:', Object.keys(ctx.chapterData).length, 'kapitol,', ctx.songList.length, 'piesní');
