/* Gruppierung an echten CROHME-Ausdrücken (Testschreiber): Anteil richtig zusammengefasster Zeichen.
   node test/ink/t_group_crohme.js [--model=…] [--n=200] [--wcls=0.7]  (Daten: /home/claude/ink/r-work/crohme_expr.json) */
const fs = require('fs'), lib = require('./lib.js');
const arg = k => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const E = lib.load({model:arg('model') || undefined, content:false});
const F = arg('data') || '/home/claude/ink/r-work/crohme_expr.json';
if (!fs.existsSync(F)){ console.log('crohme_expr.json fehlt – übersprungen'); process.exit(0); }
const D = JSON.parse(fs.readFileSync(F, 'utf8'))[arg('split') || 'test'].slice(0, +(arg('n') || 300));
const I = E.INKR._int;
let tot = 0, ok = 0, exOk = 0, ms = 0;
const per = {};
for (const ex of D){
  const strokes = [], lab = [];
  ex.syms.forEach((s, k) => s.strokes.forEach(st => { if (st.length){ strokes.push(st.map(([x, y]) => ({x, y}))); lab.push(k); } }));
  const t0 = Date.now();
  const r = E.recognizeInk(strokes, E.inkContext(null), {wCls:arg('wcls') !== null ? +arg('wcls') : undefined, wGeo:arg('wgeo') !== null ? +arg('wgeo') : undefined, groupsOnly:true});
  ms += Date.now() - t0;
  const G = r.groups.map(g => g.slice().sort((a, b) => a - b).join(','));
  const set = new Set(G);
  let allOk = true;
  ex.syms.forEach((s, k) => { const ids = lab.map((l, i) => l === k ? i : -1).filter(i => i >= 0).join(','); const good = set.has(ids); tot++; if (good) ok++; else allOk = false; const p = per[s.lab] || (per[s.lab] = [0, 0]); p[0]++; if (good) p[1]++; });
  if (allOk) exOk++;
}
console.log('CROHME-Testausdrücke:', D.length, '| Zeichen richtig gruppiert:', (100 * ok / tot).toFixed(1) + ' %', '| Ausdrücke ganz richtig:', (100 * exOk / D.length).toFixed(1) + ' %', '| Zeit/Ausdruck', (ms / D.length).toFixed(0), 'ms');
if (process.argv.includes('--per')) console.log(Object.entries(per).sort((a, b) => b[1][0] - a[1][0]).slice(0, 40).map(([c, p]) => c + ' ' + p[0] + ' ' + (100 * p[1] / p[0]).toFixed(0) + '%').join('  '));
