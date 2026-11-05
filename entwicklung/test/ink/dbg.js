/* Einzelfall ansehen: node test/ink/dbg.js "<Zeile>" [seed] [--model=…] [--shapes=bank|font] → Baum + Text */
const lib = require('./lib.js'), syn = require('./synth.js'), fs = require('fs');
const arg = k => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : null; };
const pos = process.argv.slice(2).filter(a => !a.startsWith('--'));
const E = lib.load({model:arg('model') || 'oracle'});
const bank = arg('shapes') === 'bank' ? JSON.parse(fs.readFileSync('/home/claude/ink/testdata/strokes_test.json', 'utf8')) : null;
const line = pos[0], seed = +(pos[1] || 1);
const r = syn.synthLine(E.parseLine(line, {}), seed, {bank});
const rc = E.inkContext(null); if ((arg('model') || 'oracle') === 'oracle') rc.oracle = syn.oracle;
const res = E.recognizeInk(r.strokes, rc);
const f = v => v === undefined || v === null ? '-' : v.toFixed ? v.toFixed(0) : v;
const show = (nodes, d) => nodes.forEach(n => { const it = n.it; console.log(' '.repeat(d * 2) + it.k + ' ' + (n.alts ? n.alts.slice(0, 2).map(a => a[0] + ':' + a[1].toFixed(2)).join(' ') : '') + ' rel=' + it.rel + ' b=' + f(it.b) + ' e=' + f(it.e) + ' box=' + [it.x0, it.y0, it.x1, it.y1].map(f).join(',') + ' st=' + it.st.map(s => s.i).join(',') + (it.hat ? ' HAT' : '')); for (const k of ['sub', 'sup', 'lo', 'hi']) if (n[k]){ console.log(' '.repeat(d * 2 + 1) + k + ':'); show(n[k], d + 1); } if (it.k === 'frac'){ console.log(' '.repeat(d * 2 + 1) + 'num:'); show(it.num, d + 1); console.log(' '.repeat(d * 2 + 1) + 'den:'); show(it.den, d + 1); } if (it.k === 'sqrt') show(it.inner, d + 1); if (it.k === 'mat') it.cells.forEach((row, ri) => row.forEach((c, ci) => { console.log(' '.repeat(d * 2 + 1) + 'cell ' + ri + ',' + ci); show(c, d + 1); })); });
console.log('H', f(res._d.R.H), 'E', f(res._d.R.E), 'em', f(r.style.em));
if (process.argv.includes('--strokes')) r.strokes.forEach((s, i) => { const b = s.reduce((o, p) => ({x0:Math.min(o.x0, p.x), x1:Math.max(o.x1, p.x), y0:Math.min(o.y0, p.y), y1:Math.max(o.y1, p.y)}), {x0:1e9, x1:-1e9, y0:1e9, y1:-1e9}); console.log(i, s._lab, s._g, [b.x0, b.y0, b.x1, b.y1].map(f).join(',')); });
show(res._d.nodes, 0);
console.log(JSON.stringify(res.text), res.ok, res.alts.slice(0, 3));
