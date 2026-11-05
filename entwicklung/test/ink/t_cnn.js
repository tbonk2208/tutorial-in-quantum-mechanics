/* Netzauswertung gegen die Prüfwerte von Agent T (/home/claude/ink/train/eval_check.json): gleiche Eingabe → gleiche Wahrscheinlichkeiten */
const fs = require('fs'), lib = require('./lib.js');
const F = '/home/claude/ink/train/eval_check.json';
if (!fs.existsSync(F) || !fs.existsSync(lib.QM_MODEL)){ console.log('eval_check.json oder sym-qm.json fehlt – übersprungen'); process.exit(0); }
const E = lib.load({model:'qm', content:false});
const d = JSON.parse(fs.readFileSync(F, 'utf8'));
let worst = 0, same = 0;
const t0 = Date.now();
for (const c of d.cases){
  const r = E.INKR.cnnEval(Float32Array.from(c.x));
  let m = 0, bi = 0; for (let k = 0; k < r.p.length; k++){ m = Math.max(m, Math.abs(r.p[k] - c.p[k])); if (r.p[k] > r.p[bi]) bi = k; }
  worst = Math.max(worst, m); if (E.SYMQ_CLASSES[bi] === c.pred) same++;
}
const ms = (Date.now() - t0) / d.cases.length;
console.log('Netz:', d.cases.length, 'Fälle, größte Abweichung der Wahrscheinlichkeiten', worst.toExponential(2), '| gleiche Top-1:', same, '| ' + ms.toFixed(2) + ' ms je Auswertung');
process.exit(worst < 1e-4 && same === d.cases.length ? 0 : 1);
