/* Laufzeit: typische Zeilen (15–25 Zeichen) in Node erkennen, Ziel < 300 ms je Zeile (kalter Zwischenspeicher).
   node test/ink/t_speed.js [--model=qm|mathe|<pfad>] [--n=40] */
const fs = require('fs'), lib = require('./lib.js'), syn = require('./synth.js');
const arg = k => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const E = lib.load({model:arg('model') || undefined});
if (!E.inkModelReady()){ console.log('kein Modell – übersprungen'); process.exit(0); }
const BANKF = '/home/claude/ink/testdata/strokes_test.json';
const bank = fs.existsSync(BANKF) ? JSON.parse(fs.readFileSync(BANKF, 'utf8')) : null;
if (bank){ const MF = BANKF.replace('.json', '_meta.json'); if (fs.existsSync(MF)) Object.defineProperty(bank, '__meta', {value:JSON.parse(fs.readFileSync(MF, 'utf8')).samples}); }
const N = +(arg('n') || 40);
const lines = [];
for (const t of E.TOPICS) for (const task of t.practice) for (const g of task.goals) for (const m of g.model || []){ const l = typeof m === 'string' ? m : m.l; try { const ast = E.parseLine(l, {}); lines.push({l, ast, ctx:task.ctx}); } catch(e){} }
/* Aufwärmen (JIT) mit einer anderen Zeile */
{ const s = syn.synthLine(lines[0].ast, 1, {bank}); E.recognizeInk(s.strokes, E.inkContext(null)); }
const ms = [], ev = [];
let k = 0;
for (const x of lines){
  const sl = syn.synthLine(x.ast, 500 + k++, {bank});
  if (sl.missing.length || sl.glyphs.length < 15 || sl.glyphs.length > 25) continue;
  const rc = E.inkContext(E.makeCtx(x.ctx));
  const e0 = E.INKR.STAT.evals, t0 = process.hrtime.bigint();
  E.recognizeInk(sl.strokes, rc);
  ms.push(Number(process.hrtime.bigint() - t0) / 1e6); ev.push(E.INKR.STAT.evals - e0);
  if (ms.length >= N) break;
}
ms.sort((a, b) => a - b);
const q = f => ms[Math.min(ms.length - 1, Math.floor(f * ms.length))].toFixed(0);
console.log('Modell:', E.modelName, '| Zeilen mit 15–25 Zeichen:', ms.length, '| ms Median', q(0.5), '| 90 %', q(0.9), '| max', ms[ms.length - 1].toFixed(0), '| Netzauswertungen je Zeile Ø', (ev.reduce((a, b) => a + b, 0) / ev.length).toFixed(0));
const bad = ms.filter(v => v > 300).length;
console.log(bad ? 'ZU LANGSAM: ' + bad + ' Zeilen über 300 ms' : 'ok: alle unter 300 ms');
process.exit(bad > ms.length * 0.1 ? 1 : 0);
