/* Merkmale für „gehören zwei aufeinanderfolgende Striche zu einem Zeichen?“ aus echten CROHME-Ausdrücken.
   Eingabe: crohme_expr.json (aus T's crohme.pkl exportiert, siehe /home/claude/ink/r-work/export_expr.py)
   node test/ink/fit_group.js <crohme_expr.json> <split> <out.csv>
   Danach: python3 -I test/ink/fit_group.py <train.csv> → Gewichte (in 16-ink-recog.js als GROUPW eingetragen). */
const fs = require('fs');
const lib = require('./lib.js');
const E = lib.load({model:'oracle', content:false});
const I = E.INKR._int;
const [inF, split, outF] = process.argv.slice(2);
const D = JSON.parse(fs.readFileSync(inF, 'utf8'))[split];
const rows = [];
for (const ex of D){
  const strokes = [], lab = [];
  ex.syms.forEach((s, k) => s.strokes.forEach(st => { if (st.length){ strokes.push(st.map(([x, y]) => ({x, y}))); lab.push(k); } }));
  if (strokes.length < 2) continue;
  /* Geviert wie im Erkenner: aus Buchstaben/Ziffern nach Klasse */
  const es = [];
  ex.syms.forEach(s => { if (/^[0-9a-zA-Z]$/.test(s.lab)){ const pts = [].concat(...s.strokes); const ys = pts.map(p => p[1]); const h = Math.max(...ys) - Math.min(...ys); const v = E.INKR.VT[E.INKR.VTYPE[s.lab] || 'a']; es.push(h / (v[1] - v[0])); } });
  if (!es.length) continue;
  es.sort((a, b) => a - b);
  const Em = Math.min(es[Math.min(es.length - 1, Math.floor(0.8 * es.length))], 1.3 * es[Math.floor(es.length / 2)]);
  const H = 0.75 * Em;
  const S = strokes.map((p, i) => I.sInfo(p, i, 0));
  for (let k = 1; k < S.length; k++){
    const f = I.pairFeat(S[k - 1], S[k], H);
    rows.push(f.concat([lab[k - 1] === lab[k] ? 1 : 0]).map(v => +v.toFixed ? +v.toFixed(4) : v).join(','));
  }
}
fs.writeFileSync(outF, rows.join('\n') + '\n');
console.log(split, 'Paare', rows.length);
