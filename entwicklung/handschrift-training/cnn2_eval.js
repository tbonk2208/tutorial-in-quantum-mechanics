#!/usr/bin/env node
/* Referenzauswertung für sym-qm.json (arch 'cnn2'), ohne Abhängigkeiten.
   node cnn2_eval.js [modell.json] [eval_check.json] [raster_check.json]
   1) lädt das Modell (int8 * scale, Speicherreihenfolge wie cnnEval der Mathe-App, Kanal zuletzt)
   2) rechnet die Eingaben aus eval_check.json und vergleicht mit den Python-Wahrscheinlichkeiten (Soll: < 1e-3)
   3) rastert die Striche aus raster_check.json nach DESIGN.md (+ Gleichstandsregel) und vergleicht (Soll: < 1e-4)
   node cnn2_eval.js --strokes [strokes_test.json] [modell.json]: Striche rastern + klassifizieren, Genauigkeit je Klasse */
'use strict';
const fs = require('fs');
const path = require('path');
const here = __dirname;
const MODEL = process.argv[2] || '/home/claude/qm/src/ui/model/sym-qm.json';
const EVAL = process.argv[3] || path.join(here, 'eval_check.json');
const RCHK = process.argv[4] || path.join(here, 'raster_check.json');

function loadModel(file){
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (d.arch !== 'cnn2') throw new Error('arch ' + d.arch);
  const layers = d.layers.map(l => {
    const bin = Buffer.from(l.w, 'base64'), n = bin.length, W = new Float32Array(n);
    for (let i = 0; i < n; i++){ let c = bin[i]; if (c > 127) c -= 256; W[i] = c * l.scale; }
    if (n !== l.shape[0] * l.shape[1]) throw new Error('Form passt nicht');
    return {W, b:Float32Array.from(l.b), nin:l.shape[0], nout:l.shape[1]};
  });
  return {classes:d.classes, layers};
}

/* 28×28 → conv3×3 C1 → max2 → conv3×3 C2 → max2 (11→5) → fc F (Merkmale) → fc N → softmax */
function cnn2Eval(M, x){
  const [L1, L2, L3, L4] = M.layers;
  const C1 = L1.nout, C2 = L2.nout, F = L3.nout, N = L4.nout;
  const c1 = new Float32Array(26 * 26 * C1);
  for (let i = 0; i < 26; i++) for (let j = 0; j < 26; j++){
    const o = (i * 26 + j) * C1; for (let k = 0; k < C1; k++) c1[o + k] = L1.b[k];
    for (let di = 0; di < 3; di++) for (let dj = 0; dj < 3; dj++){ const v = x[(i + di) * 28 + j + dj]; if (!v) continue; const w = (di * 3 + dj) * C1; for (let k = 0; k < C1; k++) c1[o + k] += v * L1.W[w + k]; }
    for (let k = 0; k < C1; k++) if (c1[o + k] < 0) c1[o + k] = 0;
  }
  const p1 = new Float32Array(13 * 13 * C1);
  for (let i = 0; i < 13; i++) for (let j = 0; j < 13; j++) for (let k = 0; k < C1; k++){
    const a = c1[((2 * i) * 26 + 2 * j) * C1 + k], b = c1[((2 * i) * 26 + 2 * j + 1) * C1 + k], c = c1[((2 * i + 1) * 26 + 2 * j) * C1 + k], d = c1[((2 * i + 1) * 26 + 2 * j + 1) * C1 + k];
    p1[(i * 13 + j) * C1 + k] = Math.max(a, b, c, d);
  }
  const c2 = new Float32Array(11 * 11 * C2);
  for (let i = 0; i < 11; i++) for (let j = 0; j < 11; j++){
    const o = (i * 11 + j) * C2; for (let k = 0; k < C2; k++) c2[o + k] = L2.b[k];
    for (let di = 0; di < 3; di++) for (let dj = 0; dj < 3; dj++){ const base = ((i + di) * 13 + j + dj) * C1, wb = (di * 3 + dj) * C1;
      for (let ch = 0; ch < C1; ch++){ const v = p1[base + ch]; if (!v) continue; const w = (wb + ch) * C2; for (let k = 0; k < C2; k++) c2[o + k] += v * L2.W[w + k]; } }
    for (let k = 0; k < C2; k++) if (c2[o + k] < 0) c2[o + k] = 0;
  }
  const f = new Float32Array(25 * C2);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) for (let k = 0; k < C2; k++){
    const a = c2[((2 * i) * 11 + 2 * j) * C2 + k], b = c2[((2 * i) * 11 + 2 * j + 1) * C2 + k], c = c2[((2 * i + 1) * 11 + 2 * j) * C2 + k], d = c2[((2 * i + 1) * 11 + 2 * j + 1) * C2 + k];
    f[(i * 5 + j) * C2 + k] = Math.max(a, b, c, d);
  }
  const h = Float32Array.from(L3.b);
  for (let i = 0; i < 25 * C2; i++){ const v = f[i]; if (!v) continue; const off = i * F; for (let j = 0; j < F; j++) h[j] += v * L3.W[off + j]; }
  let n = 0; for (let j = 0; j < F; j++){ if (h[j] < 0) h[j] = 0; n += h[j] * h[j]; } n = Math.sqrt(n) || 1;
  const e = Float32Array.from(h, v => v / n);
  const o = Float32Array.from(L4.b);
  for (let i = 0; i < F; i++){ const v = h[i]; if (!v) continue; const off = i * N; for (let j = 0; j < N; j++) o[j] += v * L4.W[off + j]; }
  let m = -Infinity; for (const v of o) if (v > m) m = v;
  const ex = Array.from(o, v => Math.exp(v - m)), s = ex.reduce((a, b) => a + b, 0);
  return {p:ex.map(v => v / s), e};
}

/* Rasterung nach DESIGN.md (Striche [{x,y}], y nach unten) → Float32Array(784) */
function rasterize(strokes){
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const st of strokes) for (const p of st){ if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y; }
  const a = new Float32Array(784);
  if (!(x1 >= x0)) return a;
  const lw = 10, s = (80 - lw) / Math.max(x1 - x0, y1 - y0, 1), ox = 56 - (x0 + x1) / 2 * s, oy = 56 - (y0 + y1) / 2 * s, r = lw / 2 + 0.5;
  const segs = [];
  for (const st of strokes){
    if (!st.length) continue;
    const P = st.map(p => [p.x * s + ox, p.y * s + oy]);
    if (P.length === 1) segs.push([P[0][0], P[0][1], P[0][0], P[0][1]]);
    else for (let i = 1; i < P.length; i++) segs.push([P[i - 1][0], P[i - 1][1], P[i][0], P[i][1]]);
  }
  const g = new Float64Array(112 * 112);
  for (const [ax, ay, bx, by] of segs){
    const vx = bx - ax, vy = by - ay, L = vx * vx + vy * vy;
    const i0 = Math.max(0, Math.floor(Math.min(ax, bx) - r)), i1 = Math.min(111, Math.ceil(Math.max(ax, bx) + r));
    const j0 = Math.max(0, Math.floor(Math.min(ay, by) - r)), j1 = Math.min(111, Math.ceil(Math.max(ay, by) + r));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++){
      const wx = i + 0.5 - ax, wy = j + 0.5 - ay;
      let t = L > 0 ? (wx * vx + wy * vy) / L : 0; if (t < 0) t = 0; else if (t > 1) t = 1;
      const ex = wx - t * vx, ey = wy - t * vy, c = Math.min(1, Math.max(0, r - Math.sqrt(ex * ex + ey * ey)));
      if (c > g[j * 112 + i]) g[j * 112 + i] = c;
    }
  }
  let sx = 0, sy = 0, sm = 0;
  for (let y = 0; y < 28; y++) for (let x = 0; x < 28; x++){
    let t = 0; for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) t += g[(4 * y + dy) * 112 + 4 * x + dx];
    const v = t / 16; a[y * 28 + x] = v; sm += v; sx += v * x; sy += v * y;
  }
  if (!sm) return a;
  const dx = Math.round(14 - sx / sm + 1e-3), dy = Math.round(14 - sy / sm + 1e-3), b = new Float32Array(784);
  for (let y = 0; y < 28; y++) for (let x = 0; x < 28; x++){ const xs = x - dx, ys = y - dy; if (xs >= 0 && xs < 28 && ys >= 0 && ys < 28) b[y * 28 + x] = a[ys * 28 + xs]; }
  return b;
}

if (process.argv[2] === '--strokes'){
  const S = JSON.parse(fs.readFileSync(process.argv[3] || '/home/claude/ink/testdata/strokes_test.json', 'utf8'));
  const Mx = loadModel(process.argv[4] || '/home/claude/qm/src/ui/model/sym-qm.json');
  let n = 0, hit = 0; const bad = [];
  for (const [cls, samples] of Object.entries(S)){
    let h = 0;
    for (const st of samples){
      const p = cnn2Eval(Mx, rasterize(st)).p; let am = 0; for (let k = 1; k < p.length; k++) if (p[k] > p[am]) am = k;
      if (Mx.classes[am] === cls) h++;
    }
    n += samples.length; hit += h; if (samples.length) bad.push([cls, h / samples.length, samples.length]);
  }
  bad.sort((a, b) => a[1] - b[1]);
  console.log(`strokes_test: ${n} Beispiele, Top-1 ${(100 * hit / n).toFixed(1)} %`);
  console.log('schwächste Klassen:', bad.slice(0, 15).map(([c, a, k]) => `${c} ${(100 * a).toFixed(0)}% (${k})`).join(', '));
  process.exit(0);
}
let ok = true;
const M = loadModel(MODEL);
console.log('Modell', path.basename(MODEL), 'Klassen', M.classes.length, 'Formen', M.layers.map(l => '[' + l.nin + ',' + l.nout + ']').join(' '));
if (fs.existsSync(EVAL)){
  const E = JSON.parse(fs.readFileSync(EVAL, 'utf8'));
  let worst = 0, agree = 0;
  for (const c of E.cases){
    const r = cnn2Eval(M, Float32Array.from(c.x));
    let d = 0; for (let k = 0; k < r.p.length; k++) d = Math.max(d, Math.abs(r.p[k] - c.p[k]));
    let am = 0; for (let k = 1; k < r.p.length; k++) if (r.p[k] > r.p[am]) am = k;
    if (M.classes[am] === c.pred) agree++;
    worst = Math.max(worst, d);
  }
  console.log(`Modell-Abgleich: ${E.cases.length} Bilder, größte Abweichung der Wahrscheinlichkeiten ${worst.toExponential(2)}, gleiche Top-1 ${agree}/${E.cases.length}`);
  if (!(worst < 1e-3)) ok = false;
}
if (fs.existsSync(RCHK)){
  const R = JSON.parse(fs.readFileSync(RCHK, 'utf8'));
  let worst = 0;
  for (const c of R.cases){
    const a = rasterize(c.strokes); let d = 0;
    for (let i = 0; i < 784; i++) d = Math.max(d, Math.abs(a[i] - c.expected[i]));
    if (d >= 1e-4) console.log('  Abweichung', c.name, d);
    worst = Math.max(worst, d);
  }
  console.log(`Raster-Abgleich: ${R.cases.length} Fälle, größte Abweichung ${worst.toExponential(2)}`);
  if (!(worst < 1e-4)) ok = false;
}
console.log(ok ? 'OK' : 'FEHLER');
process.exit(ok ? 0 : 1);
