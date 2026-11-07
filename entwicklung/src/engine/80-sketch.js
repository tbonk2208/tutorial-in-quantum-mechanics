/* ===== Skizzenaufgaben (Kern): Abtastung von Handstrichen, Merkmale, Musterkurve, künstliche Handstriche =====
   Rein rechnerisch (kein DOM), läuft in Node (per new Function mit den übrigen Engine-Dateien) und im Browser.
   Verbindliche Festlegung: didaktik/SKIZZE.md, Abschnitte 1–3; endgültige Schwellen und Grenzfälle: Abschnitt 6.
   Striche = Liste von Strichen in Zeichenreihenfolge, je Strich eine Punktliste [[x, y], …] in Weltkoordinaten. */
const SKETCH = (function(){
'use strict';

/* ---------- Schwellen (Stand: SKIZZE.md Abschnitt 6) ---------- */
const T = {
  N:241,              // Abtaststellen über plot.x
  strokeMinX:0.03,    // Striche mit kleinerer x-Ausdehnung (Anteil von plot.x) zählen nicht zur Kurve
  gapBridge:0.06,     // Lücken bis zu diesem Anteil von plot.x werden linear überbrückt
  backtrack:0.008,    // Rückwärtsschritte eines Strichs in x unter diesem Anteil von plot.x gelten als Zittern
  cover:0.85,         // Mindestanteil gezeichneter Abtaststellen in dom
  flat:0.04,          // A unter diesem Anteil der Rahmenhöhe: Kurve gilt als flach
  eps:0.10,           // Hysterese für Vorzeichenwechsel (× A bzw. × A im Bereich)
  epsFloor:0.05,      // Untergrenze der lokalen Hysterese (× A)
  lobe:1.5,           // ein Bogen zählt erst ab Spitze ≥ lobe·eps (unterdrückt Zitterbögen an Wänden)
  dip:0.12, dipRel:0.3, part:0.15,   // abs2-Knoten: Einbruch unter dip·A oder unter dipRel·(kleinere Nachbarspitze) zwischen Teilen über part·A
  zero:0.15, zeroTol:0.02,
  parity:0.40,
  decayRatio:0.30, decayRebound:0.15, decayNear:0.08,
  nooscProm:0.10,
  extProm:0.15,
  cmpF:1.25,
  nonneg:0.08, sign:0.10,
  posTol:0.05,        // Vorgabe für maxat/center: Anteil von plot.x
  centerFloor:0.05,   // Schwerpunkt: |y| unter 0,05·A zählt nicht (Achsenzittern)
  fwhmTol:0.30, areaTol:0.20,
  smooth:0.8, smoothWin:0.07, jumpSearch:0.01,   // Knicksprung |J|·Δ/A; Fenster je Seite (Anteil von plot.x); Lagesuche ±
  kink:0.3, kinkWin:0.04, kinkJump:0.8,
  cont:0.25, contRatio:3, contExcess:0.3,
  arrowMin:0.08, head:0.3, dirTol:12, lenTol:0.15, arrowPos:0.05
};

const TYPES = ['nodes','zero','parity','decay','noosc','osc','wavelength','amp','nonneg','sign','extrema','maxat','center','fwhm','smooth','kink','cont','level','area'];
const LABEL = {nodes:'Knotenzahl', zero:'Null an den markierten Stellen', parity:'Symmetrie', decay:'Abklingen', noosc:'keine Schwingung', osc:'Schwingung',
  wavelength:'Wellenlänge', amp:'Amplitude', nonneg:'nicht negativ', sign:'Vorzeichen', extrema:'Anzahl der Extrema', maxat:'Lage des Maximums',
  center:'Lage (Schwerpunkt)', fwhm:'Breite', smooth:'glatter Übergang', kink:'Knick', cont:'stetig', level:'Höhe', area:'Fläche', arrow:'Pfeil'};
const FIELDS = {nodes:['n'], zero:['at','tol'], parity:['p','about'], decay:['toward','ratio'], noosc:[], osc:['min'],
  wavelength:['a','b','cmp','f'], amp:['a','b','cmp','f'], nonneg:[], sign:['s'], extrema:['n','kind'], maxat:['x','tol','of'],
  center:['x','tol'], fwhm:['v','tol'], smooth:['at','win'], kink:['at','win','minJump'], cont:[], level:['v','tol'], area:['v','tol']};
const COMMON = ['id','type','msg','range','w','name'];
const TOP_CURVE = ['id','title','text','kind','draw','plot','f','checks','reveal','hints','wrong','points'];
const TOP_ARROWS = ['id','title','text','kind','plot','given','want','extra','reveal','hints','wrong','points'];
const PLOT_KEYS = ['x','y','abs','dom','xlab','ylab','ticks','yticks','walls','V','Vr','E','regions','unit','grid','iso'];
const WANT_KEYS = ['from','to','lab','id','msg','msgDir','msgLen','msgPos','dirTol','lenTol','posTol','axis','len','w','name'];

/* ---------- kleine Hilfen ---------- */
const fin = v => typeof v === 'number' && isFinite(v);
const isRange = r => Array.isArray(r) && r.length === 2 && fin(r[0]) && fin(r[1]) && r[0] < r[1];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
function prng(seed){ let a = (seed >>> 0) || 1; return function(){ a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function hstr(s){ let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function gauss(R){ let u = 0, v = 0; while (u === 0) u = R(); v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const median = a => { const b = a.filter(fin).sort((p, q) => p - q); if (!b.length) return NaN; const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
/* Zahl als Text (deutsches Komma) bzw. für KaTeX */
function num(v, d){ if (!fin(v)) return '–'; d = d === undefined ? 2 : d; let s = String(Math.round(v * Math.pow(10, d)) / Math.pow(10, d)); if (s === '-0') s = '0'; return s.replace('-', '−').replace('.', ','); }
function numTex(v){ return num(v).replace('−', '-').replace(',', '{,}'); }

/* ---------- Spezifikation normieren ---------- */
/* Vorgabe für plot.y: abs2 mit etwas Platz unter null (Achse y = 0 über dem unteren Rand), damit eine falsche Skizze
   mit negativen Werten (ψ statt |ψ|²) überhaupt zeichenbar ist und `nonneg` greift; sonst symmetrisch */
const YDEF = {abs2:[-0.25, 1], other:[-1, 1]};
const yDef = (kind, draw) => (draw === 'abs2' && kind !== 'arrows' ? YDEF.abs2 : YDEF.other).slice();
const REG = new WeakMap();   // plot-Objekt → {kind, draw}: damit map(spec.plot, …) die Vorgaben kennt
function reg(spec){ if (spec && spec.plot && typeof spec.plot === 'object') REG.set(spec.plot, {kind:spec.kind || 'curve', draw:spec.draw}); }
function plotOf(spec){
  reg(spec);
  const p = (spec && spec.plot) || {};
  const kind = spec.kind || 'curve', draw = spec.draw || 'f';
  const x = isRange(p.x) ? p.x : [0, 1];
  const y = isRange(p.y) ? p.y : yDef(kind, draw);
  const dom = isRange(p.dom) ? p.dom : x;
  return {x, y, dom, abs:!!p.abs, kind, draw, W:x[1] - x[0], H:y[1] - y[0], raw:p};
}
function dom(spec){ const P = plotOf(spec); return [P.dom[0], P.dom[1]]; }

/* ---------- Abbildung Welt ↔ Bildschirm ---------- */
function map(p, W, H){
  let plot = p || {}, kind, draw;
  if (plot.plot && typeof plot.plot === 'object'){ kind = plot.kind || 'curve'; draw = plot.draw; reg(plot); plot = plot.plot; }
  else if (REG.has(plot)) ({kind, draw} = REG.get(plot));
  const x = isRange(plot.x) ? plot.x : [0, 1];
  const y = isRange(plot.y) ? plot.y : yDef(kind, draw);
  let l = 46, t = 14, w = Math.max(1, W - 60), h = Math.max(1, H - 48);
  const iso = plot.iso === true || (plot.iso !== false && (kind === 'arrows' || (kind === undefined && (plot.unit === true || plot.grid !== undefined))));
  if (iso){
    const s = Math.min(w / (x[1] - x[0]), h / (y[1] - y[0]));
    const w2 = s * (x[1] - x[0]), h2 = s * (y[1] - y[0]);
    l += (w - w2) / 2; t += (h - h2) / 2; w = w2; h = h2;
  }
  const px = (xv, yv) => [l + (xv - x[0]) / (x[1] - x[0]) * w, t + (y[1] - yv) / (y[1] - y[0]) * h];
  const world = (X, Y) => [x[0] + (X - l) / w * (x[1] - x[0]), y[1] - (Y - t) / h * (y[1] - y[0])];
  return {inner:{l, t, w, h}, px, world, x:[x[0], x[1]], y:[y[0], y[1]], iso};
}

/* Striche säubern: akzeptiert [[x,y],…], [{x,y},…] oder {pts:[…]} */
function clean(strokes){
  const out = [];
  for (const s of Array.isArray(strokes) ? strokes : []){
    const arr = Array.isArray(s) ? s : (s && (s.pts || s.points)) || [];
    const pts = [];
    for (const q of arr){ const x = Array.isArray(q) ? q[0] : q && q.x, y = Array.isArray(q) ? q[1] : q && q.y; if (fin(x) && fin(y)) pts.push([x, y]); }
    out.push(pts);
  }
  return out;
}

/* ---------- Abtastung ---------- */
function sample(spec, strokes){
  const P = plotOf(spec), N = T.N, x0 = P.x[0], h = P.W / (N - 1);
  const xs = new Array(N), ys = new Array(N).fill(NaN), src = new Array(N).fill(-1);
  for (let i = 0; i < N; i++) xs[i] = x0 + i * h;
  const S = clean(strokes);
  let used = 0, given = 0;
  S.forEach((pts0, k) => {
    let pts = pts0;
    if (pts.length) given++;
    if (pts.length < 2) return;
    let lo = Infinity, hi = -Infinity; for (const q of pts){ if (q[0] < lo) lo = q[0]; if (q[0] > hi) hi = q[0]; }
    if (hi - lo < T.strokeMinX * P.W) return;
    used++;
    pts = monotone(soften(pts), T.backtrack * P.W);
    const tmp = new Array(N).fill(NaN);
    for (let j = 0; j + 1 < pts.length; j++){
      const [ax, ay] = pts[j], [bx, by] = pts[j + 1];
      const a = Math.min(ax, bx), b = Math.max(ax, bx);
      const i0 = Math.max(0, Math.ceil((a - x0) / h - 1e-9)), i1 = Math.min(N - 1, Math.floor((b - x0) / h + 1e-9));
      for (let i = i0; i <= i1; i++){ const xv = xs[i]; tmp[i] = bx === ax ? by : ay + (by - ay) * (xv - ax) / (bx - ax); }   // späteres Segment gewinnt
    }
    for (let i = 0; i < N; i++) if (fin(tmp[i])){ ys[i] = tmp[i]; src[i] = k; }   // späterer Strich gewinnt
  });
  // kleine Lücken überbrücken
  const gaps = [], br = new Array(N).fill(false);
  let last = -1;
  for (let i = 0; i < N; i++){
    if (!fin(ys[i])) continue;
    if (last >= 0 && i - last > 1){
      const g = xs[i] - xs[last];
      if (g <= T.gapBridge * P.W + 1e-12){ for (let j = last + 1; j < i; j++){ ys[j] = ys[last] + (ys[i] - ys[last]) * (j - last) / (i - last); br[j] = true; } gaps.push({i:last, j:i, bridged:true}); }
      else gaps.push({i:last, j:i, bridged:false});
    }
    last = i;
  }
  // Überdeckung und Skala über dom
  const dI = domIdx(P, xs);
  let nd = 0; for (const i of dI) if (fin(ys[i])) nd++;
  const cover = dI.length ? nd / dI.length : 0;
  let A = 0;
  for (const i of dI){ const v = med3abs(ys, i); if (fin(v) && v > A) A = v; }
  return {xs, ys, cover, A, h, gaps, br, src, used, given, empty:used === 0, P};
}
/* x-Werte entlang der Punktfolge leicht glätten (2 × Binomialfilter 1-2-1, Endpunkte fest): nimmt das seitliche Zittern
   der Eingabe heraus, ohne y (Sprünge, Spitzen) zu verschmieren */
function soften(pts){
  if (pts.length < 5) return pts;
  let a = pts;
  for (let pass = 0; pass < 2; pass++){ const b = [a[0]]; for (let j = 1; j + 1 < a.length; j++) b.push([(a[j - 1][0] + 2 * a[j][0] + a[j + 1][0]) / 4, a[j][1]]); b.push(a[a.length - 1]); a = b; }
  return a;
}
/* kleine Rückwärtsschritte in x (Zittern, Haken beim Abheben) entfernen; echte Umkehr (> tol) bleibt */
function monotone(pts, tol){
  const dir = pts[pts.length - 1][0] >= pts[0][0] ? 1 : -1, out = [pts[0]];
  let ext = pts[0][0];
  for (let j = 1; j < pts.length; j++){
    const x = pts[j][0];
    if (dir * (x - ext) >= 0){ out.push(pts[j]); ext = x; }
    else if (dir * (ext - x) > tol){ out.push(pts[j]); ext = x; }
  }
  return out.length >= 2 ? out : pts;
}
function domIdx(P, xs){ const out = []; const tol = 1e-9 * P.W; for (let i = 0; i < xs.length; i++) if (xs[i] >= P.dom[0] - tol && xs[i] <= P.dom[1] + tol) out.push(i); return out; }
function med3abs(ys, i){ const a = [ys[i - 1], ys[i], ys[i + 1]].filter(fin).map(Math.abs); if (!a.length) return NaN; if (a.length < 3) return Math.min(...a); return a.sort((p, q) => p - q)[1]; }
function idxIn(S, r){ const out = []; const tol = 1e-6 * S.h; for (let i = 0; i < S.xs.length; i++) if (S.xs[i] >= r[0] - tol && S.xs[i] <= r[1] + tol) out.push(i); return out; }
/* y an beliebiger Stelle (linear zwischen Abtastwerten) */
function yAt(S, x){
  const u = (x - S.xs[0]) / S.h, i = Math.floor(u), t = u - i;
  if (i < 0 || i >= S.xs.length) return NaN;
  const a = S.ys[i], b = S.ys[i + 1];
  if (i + 1 >= S.xs.length || t < 1e-9) return a;
  if (fin(a) && fin(b)) return a + (b - a) * t;
  return t < 0.5 ? a : b;
}
/* gleitender Mittelwert (Radius r), NaN bleibt NaN */
function smoothArr(Y, r){ const n = Y.length, out = new Array(n); for (let i = 0; i < n; i++){ if (!fin(Y[i])){ out[i] = NaN; continue; } let s = 0, c = 0; for (let j = Math.max(0, i - r); j <= Math.min(n - 1, i + r); j++) if (fin(Y[j])){ s += Y[j]; c++; } out[i] = s / c; } return out; }

/* ---------- Bausteine der Merkmale ---------- */
/* Bögen gleichen Vorzeichens mit Hysterese eps; Bögen mit Spitze < lobeMin werden verworfen und Nachbarn verschmolzen.
   Liefert Anzahl der Vorzeichenwechsel und die Lage der Nulldurchgänge. */
function lobes(X, Y, eps, lobeMin){
  const L = []; let cur = null;
  for (let k = 0; k < Y.length; k++){
    const v = Y[k]; if (!fin(v) || Math.abs(v) <= eps) continue;
    const s = v > 0 ? 1 : -1;
    if (cur && cur.s === s){ if (Math.abs(v) > cur.peak) cur.peak = Math.abs(v); cur.k1 = k; }
    else { cur = {s, peak:Math.abs(v), k0:k, k1:k}; L.push(cur); }
  }
  const M = [];
  for (const l of L){ if (l.peak < lobeMin) continue; const q = M[M.length - 1]; if (q && q.s === l.s){ q.k1 = l.k1; q.peak = Math.max(q.peak, l.peak); } else M.push(Object.assign({}, l)); }
  const cross = [];
  for (let j = 0; j + 1 < M.length; j++){
    const a = M[j].k1, b = M[j + 1].k0, zs = [];
    for (let k = a; k < b; k++){ const p = Y[k], q = Y[k + 1]; if (fin(p) && fin(q) && (p > 0) !== (q > 0)) zs.push(X[k] + (X[k + 1] - X[k]) * (p / (p - q))); }
    cross.push(zs.length ? (zs[0] + zs[zs.length - 1]) / 2 : (X[a] + X[b]) / 2);
  }
  return {count:Math.max(0, M.length - 1), cross, lobes:M};
}
/* Einbrüche bei |ψ|²: zwischen zwei Teilen über part ein Minimum unter dip oder unter rel·(kleinere Nachbarspitze) */
function dips(X, Y, dip, part, rel){
  rel = rel === undefined ? T.dipRel : rel;
  const parts = []; let cur = null, kmin = -1;
  for (let k = 0; k < Y.length; k++){
    const v = Y[k]; if (!fin(v)) continue;
    if (v >= part){ if (!cur){ cur = {peak:v, kmin}; parts.push(cur); kmin = -1; } else if (v > cur.peak) cur.peak = v; }
    else { cur = null; if (parts.length && (kmin < 0 || v < Y[kmin])) kmin = k; }
  }
  let count = 0; const at = [];
  for (let j = 1; j < parts.length; j++){ const k = parts[j].kmin; if (k < 0) continue; if (Y[k] <= Math.max(dip, rel * Math.min(parts[j - 1].peak, parts[j].peak))){ count++; at.push(X[k]); } }
  return {count, at};
}
/* Zickzack-Extrema: Umkehrpunkte mit Ausschlag ≥ delta auf beiden Seiten (Rand zählt nicht als Extremum) */
function zigzag(X, Y, delta){
  const piv = []; let k0 = -1;
  for (let k = 0; k < Y.length; k++) if (fin(Y[k])){ k0 = k; break; }
  if (k0 < 0) return piv;
  let dir = 0, cand = k0;
  for (let k = k0 + 1; k < Y.length; k++){
    const v = Y[k]; if (!fin(v)) continue;
    if (dir === 0){ if (v - Y[k0] >= delta){ dir = 1; cand = k; } else if (Y[k0] - v >= delta){ dir = -1; cand = k; } }
    else if (dir === 1){ if (v > Y[cand]) cand = k; else if (Y[cand] - v >= delta){ piv.push({k:cand, x:X[cand], v:Y[cand], type:'max'}); dir = -1; cand = k; } }
    else { if (v < Y[cand]) cand = k; else if (v - Y[cand] >= delta){ piv.push({k:cand, x:X[cand], v:Y[cand], type:'min'}); dir = 1; cand = k; } }
  }
  return piv;
}
/* Ausgleichspolynom (Grad 1 oder 2) um x0; liefert Steigung bei x0 */
function fitSlope(S, lo, hi, x0, deg){
  const xs = [], ys = [];
  for (let i = 0; i < S.xs.length; i++){ const x = S.xs[i]; if (x >= lo - 1e-9 && x <= hi + 1e-9 && fin(S.ys[i])){ xs.push(x - x0); ys.push(S.ys[i]); } }
  const n = xs.length; if (n < deg + 2) return NaN;
  if (deg === 1){ let mx = 0, my = 0; for (let i = 0; i < n; i++){ mx += xs[i]; my += ys[i]; } mx /= n; my /= n; let sxy = 0, sxx = 0; for (let i = 0; i < n; i++){ sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); } return sxx > 0 ? sxy / sxx : NaN; }
  // Grad 2: Normalgleichungen
  const s = [0, 0, 0, 0, 0], t = [0, 0, 0];
  for (let i = 0; i < n; i++){ let p = 1; for (let e = 0; e <= 4; e++){ s[e] += p; if (e <= 2) t[e] += p * ys[i]; p *= xs[i]; } }
  const M = [[s[0], s[1], s[2], t[0]], [s[1], s[2], s[3], t[1]], [s[2], s[3], s[4], t[2]]];
  for (let c = 0; c < 3; c++){ let piv = c; for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r; [M[c], M[piv]] = [M[piv], M[c]]; if (Math.abs(M[c][c]) < 1e-300) return NaN; for (let r = 0; r < 3; r++) if (r !== c){ const f = M[r][c] / M[c][c]; for (let q = c; q < 4; q++) M[r][q] -= f * M[c][q]; } }
  return M[1][3] / M[1][1];
}

/* gewichtete kleinste Quadrate (Normalgleichungen) */
function lsq(rows, ys, ws){
  const m = rows[0].length, M = []; for (let r = 0; r < m; r++) M.push(new Array(m + 1).fill(0));
  for (let i = 0; i < rows.length; i++){ const w = ws ? ws[i] : 1; if (!w) continue; const q = rows[i]; for (let r = 0; r < m; r++){ for (let c = 0; c < m; c++) M[r][c] += w * q[r] * q[c]; M[r][m] += w * q[r] * ys[i]; } }
  for (let c = 0; c < m; c++){ let piv = c; for (let r = c + 1; r < m; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r; [M[c], M[piv]] = [M[piv], M[c]]; if (Math.abs(M[c][c]) < 1e-14) return null; for (let r = 0; r < m; r++) if (r !== c){ const f = M[r][c] / M[c][c]; for (let q = c; q <= m; q++) M[r][q] -= f * M[c][q]; } }
  return M.map((row, i) => row[m] / row[i]);
}
/* Steigungssprung J bei x0: kubisches Polynom über [x0 − w, x0 + w] plus Sprung in Wert, Steigung und Krümmung
   (Krümmungssprung ist an endlichen Stufen physikalisch richtig und darf keinen Knick vortäuschen).
   Tukey-Gewichte gegen Haken an Strichenden; überbrückte Abtaststellen zählen nicht. Liefert {J, sL, sR}. */
function jumpFit(S, x0, w){
  const rows = [], ys = [];
  for (let i = 0; i < S.xs.length; i++){ const t = (S.xs[i] - x0) / w; if (Math.abs(t) > 1 + 1e-9 || !fin(S.ys[i]) || S.br[i]) continue; const p = t > 0 ? 1 : 0; rows.push([1, t, t * t, t * t * t, p * t, p, p * t * t]); ys.push(S.ys[i]); }
  let nl = 0, nr = 0; for (const q of rows) if (q[5]) nr++; else nl++;
  if (nl < 6 || nr < 6) return null;
  let c = lsq(rows, ys); if (!c) return null;
  for (let it = 0; it < 3; it++){
    const res = rows.map((q, i) => ys[i] - q.reduce((s, v, j) => s + v * c[j], 0));
    const mad = median(res.map(Math.abs)) * 1.4826 + 1e-12;
    const ws = res.map(r => { const u = r / (4.685 * mad); return Math.abs(u) < 1 ? (1 - u * u) ** 2 : 0; });
    const c2 = lsq(rows, ys, ws); if (!c2) break; c = c2;
  }
  return {J:c[4] / w, sL:c[1] / w, sR:(c[1] + c[4]) / w};
}
/* größter normierter Sprung |J|·Δ/A in der Nähe von x0 (Lagesuche ±jumpSearch·plot.x) */
function jumpNear(S, x0, w){
  const P = S.P, D = (P.dom[1] - P.dom[0]) / 8, m = Math.round(T.jumpSearch * P.W / S.h);
  let best = null;
  for (let j = -m; j <= m; j++){ const r = jumpFit(S, x0 + j * S.h, w); if (!r) continue; const d = Math.abs(r.J) * D / S.A; if (!best || d > best.d) best = {d, J:r.J, sL:r.sL, sR:r.sR, x:x0 + j * S.h}; }
  return best;
}

/* Nullstelle am Rand der Zeichnung (Wand): beginnt bzw. endet die Zeichnung innerhalb tol neben x0 und ist auf der anderen
   Seite im Fenster nichts gezeichnet, gilt die Ausgleichsgerade durch die ersten bzw. letzten 2–4 gezeichneten Abtastwerte,
   verlängert bis x0. Erfüllt, wenn ihr Wert bei x0 höchstens lim ist oder sie zwischen x0 und dem Strichanfang die Achse kreuzt.
   (Ein steiler Anstieg, bei dem der Stift kurz neben der Wand ansetzt, besteht so; ein deutlicher Randwert bleibt ein Randwert.) */
function edgeZero(S, x0, tol, lim){
  const N = S.xs.length, drawn = i => i >= 0 && i < N && fin(S.ys[i]) && !S.br[i];
  for (const dir of [1, -1]){
    let other = false;
    for (let i = 0; i < N; i++){ const d = (S.xs[i] - x0) * dir; if (d < -1e-9 && d >= -tol - 1e-9 && fin(S.ys[i])){ other = true; break; } }
    if (other) continue;
    let kf = -1;
    if (dir > 0){ for (let i = 0; i < N; i++) if (S.xs[i] >= x0 - 1e-9 && fin(S.ys[i])){ kf = i; break; } }
    else { for (let i = N - 1; i >= 0; i--) if (S.xs[i] <= x0 + 1e-9 && fin(S.ys[i])){ kf = i; break; } }
    if (kf < 0 || Math.abs(S.xs[kf] - x0) > tol + 1e-9) continue;
    const ks = []; for (let k = kf, t = 0; t < 6 && ks.length < 4; t++, k += dir) if (drawn(k)) ks.push(k);
    if (ks.length < 2) continue;
    let mx = 0, my = 0; for (const k of ks){ mx += S.xs[k]; my += S.ys[k]; } mx /= ks.length; my /= ks.length;
    let sxy = 0, sxx = 0; for (const k of ks){ sxy += (S.xs[k] - mx) * (S.ys[k] - my); sxx += (S.xs[k] - mx) ** 2; }
    const ye = my + (sxx > 0 ? sxy / sxx : 0) * (x0 - mx), yf = S.ys[ks[0]];
    if (Math.abs(ye) <= lim || ye * yf < 0) return true;
  }
  return false;
}

/* ---------- Rahmen- und Textbausteine ---------- */
function xLab(P, x){
  const ticks = Array.isArray(P.raw.ticks) ? P.raw.ticks : [];
  const t = ticks.find(q => q && fin(q.x) && Math.abs(q.x - x) <= 1e-6 * P.W && q.lab !== undefined);
  const v = t ? String(t.lab) : numTex(x);
  const xl = P.raw.xlab;
  return (typeof xl === 'string' && xl.length && xl.length <= 12 && !/[\s(),=]/.test(xl)) ? xl + ' = ' + v : v;
}
/* Stelle als KaTeX mit Tick-Beschriftung, z. B. „$x = L$“ */
function posText(P, x){ return '$' + xLab(P, x) + '$'; }
function fill(msg, got, want){ return String(msg || '').replace(/\{got\}/g, got === undefined ? '–' : String(got)).replace(/\{want\}/g, want === undefined ? '–' : String(want)); }
const MSG = {
  empty:(P) => 'Noch ist keine Kurve zu sehen. Zeichne den Graphen von $' + xLab(P, P.dom[0]) + '$ bis $' + xLab(P, P.dom[1]) + '$ als Linie von links nach rechts.',
  ignored:(P) => 'Senkrechte und sehr kurze Striche zählen nicht zur Kurve. Zeichne den Graphen von $' + xLab(P, P.dom[0]) + '$ bis $' + xLab(P, P.dom[1]) + '$ als Linie von links nach rechts.',
  cover:(P, cover, where) => 'Zeichne über den ganzen Bereich von $' + xLab(P, P.dom[0]) + '$ bis $' + xLab(P, P.dom[1]) + '$. Bisher ist erst etwa ' + Math.round(cover * 100) + ' % davon gezeichnet' + (where ? ', es fehlt vor allem ' + where : '') + '.',
  flat:() => 'Deine Kurve ist fast flach. Zeichne die Form deutlich größer, damit man Buckel, Nullstellen und Abklingen erkennt.',
  aEmpty:() => 'Noch ist kein Pfeil zu sehen. Zeichne jeden Pfeil als einen Strich vom Anfangspunkt zur Spitze.',
  aShort:() => 'Deine Striche sind zu kurz für Pfeile. Zeichne jeden Pfeil als einen Strich vom Anfangspunkt zur Spitze.',
  reversed:() => 'Hast du diesen Pfeil von der Spitze zum Anfang gezeichnet? Die App nimmt den ersten Punkt eines Strichs als Anfang. Zeichne jeden Pfeil in einem Zug vom Anfangspunkt zur Spitze.',
  extra:() => 'Es sind mehr Pfeile gezeichnet als gefragt. Radiere die überzähligen.'
};
function missingWhere(S){
  const dI = domIdx(S.P, S.xs); let best = null, run = null;
  for (const i of dI){ if (!fin(S.ys[i])){ if (!run) run = {a:i, b:i}; else run.b = i; } else if (run){ if (!best || run.b - run.a > best.b - best.a) best = run; run = null; } }
  if (run && (!best || run.b - run.a > best.b - best.a)) best = run;
  if (!best) return '';
  if (best.a === dI[0]) return 'der linke Teil';
  if (best.b === dI[dI.length - 1]) return 'der rechte Teil';
  return 'ein Stück in der Mitte';
}

/* ---------- Ausrichtung bei psi (Gesamtvorzeichen frei) ---------- */
const FCACHE = new WeakMap();
function fOn(spec, xs){
  if (typeof spec.f !== 'function') return null;
  let c = FCACHE.get(spec); if (c && c.xs === xs.length && c.x0 === xs[0] && c.f === spec.f) return c.v;
  const v = xs.map(x => { try { const y = spec.f(x); return fin(y) ? y : NaN; } catch(e){ return NaN; } });
  FCACHE.set(spec, {xs:xs.length, x0:xs[0], f:spec.f, v}); return v;
}
function orient(spec, S){
  if ((spec.draw || 'f') !== 'psi') return 1;
  const fv = fOn(spec, S.xs);
  let s = 0;
  if (fv){ for (const i of domIdx(S.P, S.xs)) if (fin(S.ys[i]) && fin(fv[i])) s += S.ys[i] * fv[i]; }
  else { let m = 0; for (const i of domIdx(S.P, S.xs)) if (fin(S.ys[i]) && Math.abs(S.ys[i]) > m){ m = Math.abs(S.ys[i]); s = S.ys[i]; } }
  return s < 0 ? -1 : 1;
}

/* ---------- einzelne Merkmale ---------- */
function rangeOf(c, P){ return isRange(c.range) ? c.range : P.dom; }
function sub(S, r){ const I = idxIn(S, r); return {I, X:I.map(i => S.xs[i]), Y:I.map(i => S.ys[i])}; }
function nodesIn(S, r, draw){
  const {X, Y} = sub(S, r);
  if (draw === 'abs2') return dips(X, Y, T.dip * S.A, T.part * S.A).count;
  return lobesLocal(S, X, Y).count;
}
function lobesLocal(S, X, Y){
  let Al = 0; for (const v of Y) if (fin(v) && Math.abs(v) > Al) Al = Math.abs(v);
  const eps = Math.max(T.eps * Al, T.epsFloor * S.A);
  return lobes(X, Y, eps, T.lobe * eps);
}
/* halbe Wellenlänge im Bereich: Abstand der Nulldurchgänge, sonst der Extrema */
function halfWave(S, r, draw){
  const {X, Y} = sub(S, r);
  let pts = [];
  if (draw !== 'abs2') pts = lobesLocal(S, X, Y).cross;
  if (pts.length < 2){
    let Al = 0; for (const v of Y) if (fin(v) && Math.abs(v) > Al) Al = Math.abs(v);
    pts = zigzag(X, smoothArr(Y, 1), Math.max(T.extProm * Al, T.epsFloor * S.A)).map(p => p.x);
  }
  if (pts.length < 2) return {v:NaN, n:pts.length};
  return {v:(pts[pts.length - 1] - pts[0]) / (pts.length - 1), n:pts.length};
}
function cmpOk(q, cmp, f){
  if (!fin(q)) return false;
  if (cmp === '<') return q * f <= 1;
  if (cmp === '>') return q >= f;
  return q >= 1 / f && q <= f;
}

function runCheck(spec, S, c, sigma){
  const P = S.P, A = S.A, draw = spec.draw || 'f', r = rangeOf(c, P);
  const res = {id:c.id, type:c.type, ok:false, w:fin(c.w) ? c.w : 1, label:c.name || LABEL[c.type] || c.type};
  const done = (ok, got, want) => { res.ok = !!ok; if (got !== undefined) res.got = got; if (want !== undefined) res.want = want; return res; };
  const {X, Y} = sub(S, r);
  const absY = Y.map(v => fin(v) ? Math.abs(v) : NaN);
  switch (c.type){
    case 'nodes': { const n = nodesIn(S, r, draw); return done(n === c.n, n, c.n); }
    case 'zero': {
      const tol = fin(c.tol) ? c.tol : T.zeroTol * P.W;
      const at = Array.isArray(c.at) ? c.at : [c.at];
      for (const x0 of at){
        let m = Infinity;
        for (const wf of [1, 2]){ for (let i = 0; i < S.xs.length; i++) if (Math.abs(S.xs[i] - x0) <= wf * tol + 1e-9 && fin(S.ys[i])) m = Math.min(m, Math.abs(S.ys[i])); if (m < Infinity) break; }
        if (m <= T.zero * A || edgeZero(S, x0, tol, T.zero * A)) continue;
        return done(false, posText(P, x0), at.map(v => posText(P, v)).join(', '));
      }
      return done(true);
    }
    case 'parity': {
      const cx = c.about, s = c.p === 'odd' ? -1 : 1;
      const rel = sg => { let n2 = 0, a2 = 0, b2 = 0, cnt = 0;
        for (let i = 0; i < S.xs.length; i++){ const x = S.xs[i]; if (x <= cx + 1e-9 || x > r[1] + 1e-9) continue; const xm = 2 * cx - x; if (xm < r[0] - 1e-9) continue; const a = S.ys[i], b = yAt(S, xm); if (!fin(a) || !fin(b)) continue; n2 += (a - sg * b) ** 2; a2 += a * a; b2 += b * b; cnt++; }
        const den = Math.sqrt(a2) + Math.sqrt(b2); return cnt >= 6 && den > 0 ? Math.sqrt(n2) / den : NaN; };
      const re = rel(1), ro = rel(-1), q = s === 1 ? re : ro;
      const got = re <= T.parity && !(ro < re) ? 'symmetrisch' : ro <= T.parity ? 'antisymmetrisch' : 'weder symmetrisch noch antisymmetrisch';
      return done(fin(q) && q <= T.parity, got, s === 1 ? 'symmetrisch' : 'antisymmetrisch');
    }
    case 'decay': {
      let Z = smoothArr(absY, 1); if (c.toward === 'left') Z = Z.slice().reverse();
      const fz = Z.filter(fin); if (fz.length < 4) return done(false, '–');
      const m = Math.max(2, Math.round(0.05 * fz.length));
      const near = median(fz.slice(0, m)), far = median(fz.slice(-m));
      const ratio = fin(c.ratio) ? c.ratio : T.decayRatio;
      const sc = lobes(X, Y, T.eps * A, T.lobe * T.eps * A).count;
      let lo = Infinity, reb = 0; for (const v of fz){ if (v < lo) lo = v; if (v - lo > reb) reb = v - lo; }
      const ok = sc === 0 && near >= T.decayNear * A && far <= ratio * near && reb <= T.decayRebound * A;
      return done(ok, near > 0 ? Math.round(100 * far / near) + ' %' : '–', Math.round(100 * ratio) + ' %');
    }
    case 'noosc': {
      const sc = lobes(X, Y, T.eps * A, T.lobe * T.eps * A).count;
      const ex = zigzag(X, smoothArr(Y, 1), T.nooscProm * A).length;
      return done(sc === 0 && ex <= 1, sc ? sc + ' Nulldurchgänge' : ex + ' Extrema');
    }
    case 'osc': { const n = lobesLocal(S, X, Y).count; return done(n >= c.min, n, c.min); }
    case 'wavelength': {
      const a = halfWave(S, c.a, draw), b = halfWave(S, c.b, draw), q = a.v / b.v;
      return done(cmpOk(q, c.cmp, fin(c.f) ? c.f : T.cmpF), num(q), c.cmp);
    }
    case 'amp': {
      const mx = rr => { let m = 0; const I = idxIn(S, rr); for (const i of I){ const v = med3abs(S.ys, i); if (fin(v) && v > m) m = v; } return m; };
      const q = mx(c.a) / mx(c.b);
      return done(cmpOk(q, c.cmp, fin(c.f) ? c.f : T.cmpF), num(q), c.cmp);
    }
    case 'nonneg': {
      let m = Infinity;   // Minimum nach Median-3-Filter (einzelne Ausreißer zählen nicht)
      for (let k = 0; k < Y.length; k++){ if (!fin(Y[k])) continue; const a = [Y[k - 1], Y[k], Y[k + 1]].filter(fin).sort((p, q) => p - q); const v = a.length === 3 ? a[1] : a.length === 2 ? Math.max(a[0], a[1]) : a[0]; if (v < m) m = v; }
      return done(m >= -T.nonneg * A, Math.round(100 * m / A) + ' %', '≥ 0');
    }
    case 'sign': {
      let s = c.s;
      if (!fin(s)){ const fv = fOn(spec, S.xs); let t = 0; if (fv) for (const i of idxIn(S, r)) if (fin(fv[i])) t += fv[i]; s = t < 0 ? -1 : 1; }
      const Ys = Y.map(v => sigma * v);
      const L = lobes(X, Ys, T.sign * A, T.sign * A);
      const bad = L.lobes.filter(l => l.s !== s && l.k1 > l.k0);
      return done(bad.length === 0, bad.length ? 'beide' : (s > 0 ? '+' : '−'), s > 0 ? '+' : '−');
    }
    case 'extrema': {
      const Ys = smoothArr(Y.map(v => sigma * v), 1);
      const piv = zigzag(X, Ys, T.extProm * A).filter(p => !c.kind || c.kind === 'any' || p.type === c.kind);
      return done(piv.length === c.n, piv.length, c.n);
    }
    case 'maxat': {
      const of = c.of || (draw === 'psi' ? 'abs' : 'y');
      const Z = smoothArr(of === 'abs' ? absY : Y.map(v => sigma * v), 1);
      let im = -1; for (let k = 0; k < Z.length; k++) if (fin(Z[k]) && (im < 0 || Z[k] > Z[im])) im = k;
      const tol = fin(c.tol) ? c.tol : T.posTol * P.W;
      return done(im >= 0 && Math.abs(X[im] - c.x) <= tol, im >= 0 ? posText(P, X[im]) : '–', posText(P, c.x));
    }
    case 'center': {
      let sw = 0, sx = 0; for (let k = 0; k < X.length; k++){ const v = absY[k]; if (!fin(v)) continue; const w = Math.max(0, v - T.centerFloor * A); sw += w; sx += w * X[k]; }
      const cxv = sw > 0 ? sx / sw : NaN, tol = fin(c.tol) ? c.tol : T.posTol * P.W;
      return done(fin(cxv) && Math.abs(cxv - c.x) <= tol, fin(cxv) ? posText(P, cxv) : '–', posText(P, c.x));
    }
    case 'fwhm': {
      const Z = smoothArr(draw === 'psi' ? absY : Y, 1);
      let im = -1; for (let k = 0; k < Z.length; k++) if (fin(Z[k]) && (im < 0 || Z[k] > Z[im])) im = k;
      if (im < 0) return done(false, '–', num(c.v));
      const half = Z[im] / 2;
      let xl = NaN, xr = NaN;
      for (let k = im; k > 0; k--){ if (!fin(Z[k - 1])) break; if (Z[k - 1] < half){ xl = X[k - 1] + (X[k] - X[k - 1]) * (half - Z[k - 1]) / (Z[k] - Z[k - 1]); break; } }
      for (let k = im; k + 1 < Z.length; k++){ if (!fin(Z[k + 1])) break; if (Z[k + 1] < half){ xr = X[k] + (X[k + 1] - X[k]) * (Z[k] - half) / (Z[k] - Z[k + 1]); break; } }
      const wd = xr - xl, tol = fin(c.tol) ? c.tol : T.fwhmTol;
      return done(fin(wd) && Math.abs(wd / c.v - 1) <= tol, num(wd), num(c.v));
    }
    case 'smooth': {
      const win = fin(c.win) ? c.win : T.smoothWin * P.W;
      for (const x0 of (Array.isArray(c.at) ? c.at : [c.at])){
        const r = jumpNear(S, x0, win);
        if (!r || !(r.d <= T.smooth)) return done(false, posText(P, x0), posText(P, x0));
      }
      return done(true);
    }
    case 'kink': {
      const win = fin(c.win) ? c.win : T.kinkWin * P.W, D = (P.dom[1] - P.dom[0]) / 8, need = T.kink * A / D;
      for (const x0 of (Array.isArray(c.at) ? c.at : [c.at])){
        const r = jumpNear(S, x0, Math.max(win, T.smoothWin * P.W));
        let ok = !!r && r.d >= (fin(c.minJump) ? c.minJump : T.kinkJump);
        // Spitze: einseitige Steigungen mit entgegengesetztem Vorzeichen und Mindestbetrag; Geraden an der Sollstelle,
        // Geraden an der gefundenen Stelle oder das kubische Modell (jeder Schätzer hat eigene Schwächen bei Rundung und Lücken)
        if (ok && !fin(c.minJump)){
          const peak = (sL, sR) => sL * sR < 0 && Math.abs(sL) >= need && Math.abs(sR) >= need;
          ok = [x0, r.x].some(x1 => peak(fitSlope(S, x1 - win, x1, x1, 1), fitSlope(S, x1, x1 + win, x1, 1))) || peak(r.sL, r.sR);
        }
        if (!ok) return done(false, posText(P, x0), posText(P, x0));
      }
      return done(true);
    }
    case 'cont': {
      const I = idxIn(S, r), at = k => posText(P, S.xs[k]);
      for (const g of S.gaps){
        if (S.xs[g.j] < r[0] || S.xs[g.i] > r[1]) continue;
        if (!g.bridged) return done(false, posText(P, (S.xs[g.i] + S.xs[g.j]) / 2));
        // Steigung beidseits der Lücke (ohne die Randstelle selbst) gemittelt
        const sl = fitSlope(S, S.xs[g.i] - 5 * S.h, S.xs[g.i] - S.h, S.xs[g.i], 1), sr = fitSlope(S, S.xs[g.j] + S.h, S.xs[g.j] + 5 * S.h, S.xs[g.j], 1);
        const sv = [sl, sr].filter(fin), sm = sv.length ? sv.reduce((p, q) => p + q, 0) / sv.length : 0;
        // Werte zwei Stellen außerhalb der Lücke (ein Sprung kann teils vor der Lücke beginnen)
        const oi = [g.i - 2, g.i - 1, g.i].find(k => k >= 0 && fin(S.ys[k]) && !S.br[k]), oj = [g.j + 2, g.j + 1, g.j].find(k => k < S.xs.length && fin(S.ys[k]) && !S.br[k]);
        const dy = S.ys[oj] - S.ys[oi], pred = sm * (S.xs[oj] - S.xs[oi]);
        if (Math.abs(dy) > T.cont * A && Math.abs(dy - pred) > T.cont * A) return done(false, posText(P, (S.xs[g.i] + S.xs[g.j]) / 2));
      }
      // Sprung oder steile Rampe über 1–4 Abtaststellen, deutlich steiler als die Umgebung
      const d1 = k => (k >= 0 && k + 1 < S.xs.length && !S.br[k + 1] && !S.br[k]) ? Math.abs(S.ys[k + 1] - S.ys[k]) : NaN;
      for (let a = 0; a < I.length; a++){
        const i = I[a];
        for (let m = 1; m <= 4 && a + m < I.length; m++){
          if (S.br[i + m] || S.br[i]) break;   // überbrückte Lücken prüft die Lückenregel oben
          const D2 = Math.abs(S.ys[i + m] - S.ys[i]);
          if (!fin(D2) || D2 <= T.cont * A) continue;
          // Nachbarschritte: je Seite die nächsten zwei gültigen Schritte nach außen (überbrückte Stellen übersprungen)
          const side = (k0, dir) => { const v = []; for (let k = k0, t = 0; t < 6 && v.length < 2; t++, k += dir){ const e = d1(k); if (fin(e)) v.push(e); } return v.length ? v.reduce((p, q) => p + q, 0) / v.length : NaN; };
          const sv = [side(i - 1, -1), side(i + m, 1)].filter(fin);
          if (!sv.length) continue;
          const nb = Math.max(...sv);
          if (!(D2 <= T.contRatio * m * nb) || D2 - m * nb > T.contExcess * A) return done(false, at(i));
        }
      }
      return done(true);
    }
    case 'level': {
      const v = Y.filter(fin); const m = v.length ? v.reduce((p, q) => p + q, 0) / v.length : NaN;
      return done(fin(m) && Math.abs(m - c.v) <= c.tol, num(m), num(c.v));
    }
    case 'area': {
      let a = 0; for (let k = 0; k + 1 < X.length; k++){ const p = fin(Y[k]) ? Y[k] : 0, q = fin(Y[k + 1]) ? Y[k + 1] : 0; a += (p + q) / 2 * (X[k + 1] - X[k]); }
      const tol = fin(c.tol) ? c.tol : T.areaTol;
      return done(Math.abs(a / c.v - 1) <= tol, num(a), num(c.v));
    }
  }
  return done(false, '–');
}

/* ---------- Auswertung ---------- */
function evaluate(spec, strokes){
  if ((spec.kind || 'curve') === 'arrows') return evalArrows(spec, strokes);
  const S = sample(spec, strokes), P = S.P, checks = Array.isArray(spec.checks) ? spec.checks : [];
  const skipped = checks.map(c => ({id:c.id, type:c.type, ok:false, skipped:true, w:fin(c.w) ? c.w : 1, label:c.name || LABEL[c.type] || c.type, msg:fill(c.msg)}));
  const gate = (id, msg, extra) => Object.assign({empty:false, cover:S.cover, ok:false, score:0, results:skipped, first:[{id, type:'cover', ok:false, msg}], info:{A:S.A, strokes:S.used}}, extra || {});
  if (S.empty) return gate('_empty', S.given ? MSG.ignored(P) : MSG.empty(P), {empty:true, cover:0});
  if (S.cover < T.cover) return gate('_cover', MSG.cover(P, S.cover, missingWhere(S)));
  if (S.A < T.flat * Math.max(Math.abs(P.y[0]), Math.abs(P.y[1]), P.H / 2)) return gate('_flat', MSG.flat());
  const sigma = orient(spec, S);
  const results = checks.map(c => {
    let r; try { r = runCheck(spec, S, c, sigma); } catch(e){ r = {id:c.id, type:c.type, ok:false, w:1, got:'Fehler: ' + e.message}; }
    if (!r.ok) r.msg = fill(c.msg, r.got, r.want);
    return r;
  });
  const wsum = results.reduce((s, r) => s + r.w, 0), wok = results.reduce((s, r) => s + (r.ok ? r.w : 0), 0);
  return {empty:false, cover:S.cover, ok:results.every(r => r.ok), score:wsum > 0 ? wok / wsum : 1, results, first:results.filter(r => !r.ok).slice(0, 2),
    info:{A:S.A, sigma, strokes:S.used, nodes:nodesIn(S, P.dom, spec.draw || 'f')}};
}

/* ---------- Pfeile ---------- */
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function arrows(spec, strokes){
  const P = plotOf(spec), diag = Math.hypot(P.W, P.H);
  const C = [];
  clean(strokes).forEach((pts, k) => {
    if (pts.length < 2) return;
    const p0 = pts[0]; let L = 0, far = p0;
    for (const q of pts){ const d = dist(p0, q); if (d > L){ L = d; far = q; } }
    if (L > T.arrowMin * diag) C.push({from:[p0[0], p0[1]], to:[far[0], far[1]], len:L, k, pts});
  });
  // Pfeilspitzen: kurze Striche (< 30 % eines Pfeils) ganz in der Nähe seines Endes, hinter der Spitze
  const isHead = c => C.some(o => {
    if (o === c || c.len >= T.head * o.len) return false;
    const u = [(o.to[0] - o.from[0]) / o.len, (o.to[1] - o.from[1]) / o.len];
    const near = (end, sgn) => c.pts.every(q => dist(q, end) <= 0.35 * o.len) && c.pts.filter(q => sgn * ((q[0] - end[0]) * u[0] + (q[1] - end[1]) * u[1]) <= 0.1 * o.len).length >= 0.8 * c.pts.length;
    return near(o.to, 1) || near(o.from, -1);
  });
  return C.filter(c => !isHead(c)).map(c => ({from:c.from, to:c.to, len:c.len, k:c.k}));
}
const angDeg = (u, v) => { const a = Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]); return Math.abs(a) * 180 / Math.PI; };
function evalArrows(spec, strokes){
  const P = plotOf(spec), want = Array.isArray(spec.want) ? spec.want : [];
  const AR = arrows(spec, strokes);
  const base = want.map((w, i) => ({id:w.id || String(i), type:'arrow', i, ok:false, w:fin(w.w) ? w.w : 1, label:w.name || (w.lab ? '$' + w.lab + '$' : LABEL.arrow)}));
  if (!AR.length){
    const any = clean(strokes).some(p => p.length >= 1);
    return {empty:true, cover:0, ok:false, score:0, results:base.map(r => Object.assign(r, {skipped:true, msg:fill(want[r.i].msg)})), first:[{id:'_empty', type:'cover', ok:false, msg:any ? MSG.aShort() : MSG.aEmpty()}], arrows:[], match:want.map(() => -1), info:{n:0}};
  }
  const posDef = T.arrowPos * P.W;
  // gierige Zuordnung nach kleinstem Abstand der Endpunkte
  const pairs = [];
  want.forEach((w, i) => {
    const L = dist(w.from, w.to);
    AR.forEach((a, j) => {
      const tips = [w.to]; if (w.axis) tips.push([2 * w.from[0] - w.to[0], 2 * w.from[1] - w.to[1]]);
      const head = w.len === false ? [a.from[0] + (a.to[0] - a.from[0]) / a.len * L, a.from[1] + (a.to[1] - a.from[1]) / a.len * L] : a.to;
      const tail2 = w.len === false ? [a.to[0] + (a.from[0] - a.to[0]) / a.len * L, a.to[1] + (a.from[1] - a.to[1]) / a.len * L] : a.from;
      let d = Infinity;
      for (const tp of tips){ d = Math.min(d, dist(head, tp) + dist(a.from, w.from), dist(tail2, tp) + dist(a.to, w.from)); }
      pairs.push({i, j, d});
    });
  });
  pairs.sort((p, q) => p.d - q.d);
  const match = want.map(() => -1), usedA = new Set();
  for (const p of pairs){ if (match[p.i] >= 0 || usedA.has(p.j)) continue; match[p.i] = p.j; usedA.add(p.j); }
  const results = base.map(r => {
    const w = want[r.i], j = match[r.i];
    if (j < 0){ r.msg = fill(w.msg, 'kein Pfeil'); r.got = 'kein Pfeil'; return r; }
    const a = AR[j], vw = [w.to[0] - w.from[0], w.to[1] - w.from[1]], vd = [a.to[0] - a.from[0], a.to[1] - a.from[1]];
    const dirTol = fin(w.dirTol) ? w.dirTol : T.dirTol, lenTol = fin(w.lenTol) ? w.lenTol : T.lenTol, posTol = fin(w.posTol) ? w.posTol : posDef;
    let ang = angDeg(vd, vw); if (w.axis) ang = Math.min(ang, 180 - ang);
    const lq = Math.hypot(vd[0], vd[1]) / Math.hypot(vw[0], vw[1]);
    const dirOk = ang <= dirTol, lenOk = w.len === false || Math.abs(lq - 1) <= lenTol, pos = dist(a.from, w.from), posOk = pos <= posTol;
    r.ok = dirOk && lenOk && posOk;
    r.got = {dir:Math.round(ang * 10) / 10, len:Math.round(lq * 100) / 100, pos:Math.round(pos * 1000) / 1000};
    if (!r.ok){
      let rang = angDeg([-vd[0], -vd[1]], vw); if (w.axis) rang = Math.min(rang, 180 - rang);
      const reversed = rang <= dirTol && dist(a.to, w.from) <= posTol && (w.len === false || Math.abs(lq - 1) <= lenTol) && !posOk;
      if (reversed){ r.reversed = true; r.msg = MSG.reversed(); }
      else r.msg = fill(!dirOk ? (w.msgDir || w.msg) : !lenOk ? (w.msgLen || w.msg) : (w.msgPos || w.msg), num(ang, 0) + '°');
    }
    return r;
  });
  const extraN = AR.length - usedA.size;
  const wsum = results.reduce((s, r) => s + r.w, 0), wok = results.reduce((s, r) => s + (r.ok ? r.w : 0), 0);
  return {empty:false, cover:1, ok:results.every(r => r.ok), score:wsum > 0 ? wok / wsum : 1, results, first:results.filter(r => !r.ok).slice(0, 2),
    arrows:AR.map(a => ({from:a.from, to:a.to})), match, extra:extraN > 0 ? (spec.extra || MSG.extra()) : null, info:{n:AR.length, extra:extraN}};
}

/* ---------- Musterkurve ---------- */
function model(spec, strokes, n){
  const P = plotOf(spec);
  if (P.kind === 'arrows') return modelArrows(spec, strokes);
  n = n || 300;
  if (typeof spec.f !== 'function') return [];
  const out = [];
  for (let i = 0; i < n; i++){ const x = P.dom[0] + (P.dom[1] - P.dom[0]) * i / (n - 1); let y; try { y = spec.f(x); } catch(e){ y = NaN; } if (fin(y)) out.push([x, y]); }
  if (P.abs || !out.length) return out;
  let mf = 0; for (const p of out) mf = Math.max(mf, Math.abs(p[1]));
  if (!(mf > 0)) return out;
  let scale = 0.8 * Math.max(Math.abs(P.y[0]), Math.abs(P.y[1])) / mf;
  if (strokes){
    const S = sample(spec, strokes);
    if (!S.empty && S.A >= T.flat * Math.max(Math.abs(P.y[0]), Math.abs(P.y[1]), P.H / 2)){ scale = S.A / mf; if (P.draw === 'psi') scale *= orient(spec, S); }
  }
  return out.map(p => [p[0], p[1] * scale]);
}
/* Musterpfeile = want. Bei axis:true (Richtung nur bis aufs Vorzeichen) zeigt der Musterpfeil in die Orientierung des
   zugeordneten Nutzerpfeils, wie bei psi das Vorzeichen der Musterkurve: Der Gegenpfeil ist ebenso richtig.
   Richtung des Nutzerpfeils: vom Ende nahe w.from zum anderen Ende (ein rückwärts gezeichneter Pfeil zählt nach seiner Lage). */
function modelArrows(spec, strokes){
  const want = Array.isArray(spec.want) ? spec.want : [];
  const out = want.map(w => ({from:w.from.slice(), to:w.to.slice(), lab:w.lab}));
  if (!strokes || !want.some(w => w.axis)) return out;
  let ev; try { ev = evalArrows(spec, strokes); } catch(e){ return out; }
  if (!ev || !Array.isArray(ev.arrows) || !ev.arrows.length) return out;
  want.forEach((w, i) => {
    const j = ev.match[i]; if (!w.axis || !(j >= 0)) return;
    const a = ev.arrows[j], near = dist(a.to, w.from) < dist(a.from, w.from);
    const d = near ? [a.from[0] - a.to[0], a.from[1] - a.to[1]] : [a.to[0] - a.from[0], a.to[1] - a.from[1]];
    if (d[0] * (w.to[0] - w.from[0]) + d[1] * (w.to[1] - w.from[1]) < 0){ out[i].to = [2 * w.from[0] - w.to[0], 2 * w.from[1] - w.to[1]]; out[i].flip = true; }
  });
  return out;
}

/* ---------- künstliche Handstriche ---------- */
/* langsame Zufallsfunktion auf t ∈ [0,1], |g| ≤ 1; vanish: g(0) = g(1) = 0 */
function slowFn(R, kmax, vanish){
  const a = [], ph = [];
  for (let k = 1; k <= kmax; k++){ a.push((2 * R() - 1) / k); ph.push(vanish ? 0 : 2 * Math.PI * R()); }
  const g = t => { let s = 0; for (let k = 0; k < a.length; k++) s += a[k] * Math.sin((k + 1) * Math.PI * t + ph[k]); return s; };
  let m = 1e-9, md = 1e-9; for (let i = 0; i <= 200; i++){ const t = i / 200; m = Math.max(m, Math.abs(g(t))); if (i) md = Math.max(md, Math.abs(g(t) - g(t - 1 / 200)) * 200); }
  const f = t => g(t) / m; f.dmax = md / m; return f;
}
function synth(spec, src, o){
  o = o || {};
  const R = prng(o.seed === undefined ? 1 : o.seed), noise = fin(o.noise) ? o.noise : 0.05;
  const P = plotOf(spec);
  if (P.kind === 'arrows') return synthArrows(P, src || spec.want || [], R, noise);
  const f = typeof src === 'function' ? src : spec.f;
  const nStr = clamp(Math.round(fin(o.strokes) ? o.strokes : 1 + Math.floor(R() * 3)), 1, 6);
  const d0 = P.dom[0], d1 = P.dom[1], Wd = d1 - d0, M = 800;
  const us = [], fu = [];
  for (let i = 0; i < M; i++){ const u = d0 + Wd * i / (M - 1); us.push(u); let y; try { y = f(u); } catch(e){ y = NaN; } fu.push(fin(y) ? y : NaN); }
  let mf = 0; for (const v of fu) if (fin(v)) mf = Math.max(mf, Math.abs(v));
  if (!(mf > 0)) mf = 1;
  let scale = 1;
  if (!P.abs){ const frame = Math.max(Math.abs(P.y[0]), Math.abs(P.y[1])); scale = frame * (0.55 + 0.4 * R()) / mf; if (P.draw === 'psi' && R() < 0.5) scale = -scale; }
  const Aabs = Math.abs(scale) * mf;
  // Rundung von Spitzen: Glättung mit Gaußkern (Breite wächst mit noise)
  const sig = Wd * (0.002 + 0.05 * noise), du = Wd / (M - 1), kr = Math.ceil(3 * sig / du);
  // Sprungstellen der Vorlage nicht verrunden (eine Hand zeichnet einen Sprung als senkrechten Strich)
  const dd = []; for (let i = 0; i + 1 < M; i++) dd.push(fin(fu[i]) && fin(fu[i + 1]) ? Math.abs(fu[i + 1] - fu[i]) : 0);
  const dmed = median(dd.filter(v => v > 0)) || 0;
  const cut = dd.map(v => v > 0.05 * mf && v > 20 * dmed);
  const g = new Array(M);
  for (let i = 0; i < M; i++){
    if (!fin(fu[i])){ g[i] = NaN; continue; }
    let lo = i, hi = i; while (lo > 0 && i - lo < kr && !cut[lo - 1]) lo--; while (hi < M - 1 && hi - i < kr && !cut[hi]) hi++;
    const kk = Math.min(kr, i - lo, hi - i), sg = Math.max(1e-12, Math.min(sig, kk * du / 3));   // am Rand und an Sprüngen schmaler: Randwert bleibt erhalten
    let s = 0, w = 0; for (let j = i - kk; j <= i + kk; j++){ if (!fin(fu[j])) continue; const e = Math.exp(-0.5 * ((j - i) * du / sg) ** 2); s += e * fu[j]; w += e; }
    g[i] = scale * s / w;
  }
  // langsame Fehler: Amplitude, Lage (Höhe), x-Verzerrung (mit begrenzter Steigung)
  const am = slowFn(R, 3, false), off = slowFn(R, 3, false);
  // x-Verzerrung: an sichtbaren Marken (Ticks, Wände, Bereichsgrenzen, Stufen von V) richtet sich die Hand aus (Fehler ±0,4 %),
  // dazwischen langsame Verschiebung bis 0,5·noise·Abschnittslänge, lokale Streckung höchstens 1,5·noise
  const anc = [d0, d1], hard = [];   // hard: Wände, Bereichsgrenzen, Stufen von V (für early)
  for (const t of (P.raw.ticks || [])) if (t && fin(t.x)) anc.push(t.x);
  for (const w of (P.raw.walls || [])) if (fin(w)){ anc.push(w); hard.push(w); }
  for (const rg of (P.raw.regions || [])) if (rg && isRange(rg.x)){ anc.push(rg.x[0], rg.x[1]); hard.push(rg.x[0], rg.x[1]); }
  if (typeof P.raw.V === 'function'){ const vr = isRange(P.raw.Vr) ? P.raw.Vr[1] - P.raw.Vr[0] : 1; let pv = NaN; for (let i = 0; i <= 2000; i++){ const u = d0 + Wd * i / 2000; let v; try { v = P.raw.V(u); } catch(e){ v = NaN; } if (fin(v) && fin(pv) && Math.abs(v - pv) > 0.05 * vr){ anc.push(u); hard.push(u); } pv = v; } }
  const A2 = anc.filter(v => v >= d0 && v <= d1).sort((p, q) => p - q).filter((v, i, a) => i === 0 || v - a[i - 1] > 0.04 * Wd);
  if (A2[A2.length - 1] < d1) A2[A2.length - 1] = d1;
  /* Handfehler „Extremum zu früh“ (Option early = s, 0 < s ≤ 0,6; Vorgabe 0 = aus, selfTest benutzt ihn nicht):
     Steigt die Kurve vom Anfang von dom aus der Nähe von null (≤ 0,2·max) steil zum ersten Extremum an (Lage im ersten
     Viertel, Höhe ≥ 0,3·max), setzt die Hand das Extremum um den Anteil s der Anstiegsstrecke zu früh. Die Flanke wird
     gestaucht, hinter dem Extremum gleicht sich der Fehler über dieselbe Strecke wieder aus. Nicht über sichtbare Grenzen
     hinweg (Wand, Bereichsgrenze, Stufe von V im Inneren der Strecke): Dort richtet sich die Hand aus. Kein Zufall:
     die Strichfolge bleibt sonst gleich. */
  let early = u => u;
  const es = fin(o.early) ? clamp(o.early, 0, 0.6) : 0;
  if (es > 0){
    const pv = zigzag(us, fu.map(v => fin(v) ? Math.abs(v) : NaN), 0.15 * mf).find(p => p.type === 'max');
    const k0 = fu.findIndex(fin), f0 = k0 >= 0 ? Math.abs(fu[k0]) : Infinity;
    if (pv && pv.v >= 0.3 * mf && f0 <= 0.2 * mf && pv.x - d0 <= 0.25 * Wd && pv.x > d0){
      const xe = pv.x, D = xe - d0, xe2 = d0 + (1 - es) * D;
      if (!hard.some(v => v > d0 + 0.01 * Wd && v < xe + D)){
        early = u => u <= d0 ? u : u <= xe ? d0 + (u - d0) * (1 - es) : u <= xe + D ? xe2 + (u - xe) * (xe + D - xe2) / D : u;
        early.at = xe; early.to = xe2;
      }
    }
  }
  const aErr = A2.map((v, i) => (2 * R() - 1) * Math.min(0.004, 0.1 * noise) * Wd);
  const segW = [];
  for (let j = 0; j + 1 < A2.length; j++){ const L = A2[j + 1] - A2[j], fn = slowFn(R, 4, true); let amp = 0.5 * noise * L; if (amp * fn.dmax / L > 1.5 * noise) amp = 1.5 * noise * L / fn.dmax; segW.push({a:A2[j], L, fn, amp}); }
  const warpU = u => { let j = 0; while (j + 1 < segW.length && u > segW[j].a + segW[j].L) j++; const sw = segW[j]; if (!sw) return 0; const tau = clamp((u - sw.a) / sw.L, 0, 1); return sw.amp * sw.fn(tau) + aErr[j] + (aErr[j + 1] - aErr[j]) * tau; };
  const warp = t => warpU(d0 + t * Wd);
  const loc = v => 0.3 + 0.7 * Math.min(1, Math.abs(v) / Aabs);
  // Strichgrenzen: bevorzugt an Stellen, an denen Merkmale geprüft werden (Hand setzt dort oft ab)
  const cand = [];
  for (const c of spec.checks || []){ for (const v of [].concat(c.at === undefined ? [] : c.at, c.about === undefined ? [] : [c.about], isRange(c.range) ? c.range : [], isRange(c.a) ? c.a : [], isRange(c.b) ? c.b : [])) if (fin(v)) cand.push(v); }
  for (const rg of (P.raw.regions || [])) if (rg && isRange(rg.x)) cand.push(rg.x[0], rg.x[1]);
  const inner = cand.filter(v => v > d0 + 0.12 * Wd && v < d1 - 0.12 * Wd);
  const brk = [];
  for (let t = 0; t < 30 && brk.length < nStr - 1; t++){
    const b = inner.length && R() < 0.5 ? inner[Math.floor(R() * inner.length)] + (2 * R() - 1) * 0.01 * Wd : d0 + Wd * (0.15 + 0.7 * R());
    if (brk.every(q => Math.abs(q - b) > 0.12 * Wd)) brk.push(b);
  }
  brk.sort((p, q) => p - q);
  // Stift setzt an den Enden oft knapp innerhalb an bzw. ab (je 50 %, bis 1 % der Breite); eigener Zufallsstrom
  const RE = prng(((o.seed === undefined ? 1 : o.seed) ^ 0x5BD1E995) >>> 0);
  const in0 = RE() < 0.5 ? RE() * 0.01 * Wd : 0, in1 = RE() < 0.5 ? RE() * 0.01 * Wd : 0;
  const segs = []; let st = d0 + in0;
  for (let k = 0; k <= brk.length; k++){
    const end = k < brk.length ? brk[k] : d1 - in1;
    if (k < brk.length && R() < 0.6){ const ov1 = Wd * (0.002 + 0.015 * R()), ov2 = Wd * (0.002 + 0.015 * R()); segs.push([st, end + ov1]); st = end - ov2; }
    else if (k < brk.length){ segs.push([st, end]); st = end + Wd * (0.002 + 0.010 * R()); }   // minimal lückig: 0,2–1,2 %
    else segs.push([st, end]);
  }
  const gAt = u => { const p = (u - d0) / du, i = clamp(Math.floor(p), 0, M - 2), t = p - i; const a = g[i], b = g[i + 1]; return fin(a) && fin(b) ? a + (b - a) * t : (t < 0.5 ? a : b); };
  const out = [];
  for (const [ua, ub] of segs){
    const sOff = 0.5 * noise * Aabs * (2 * R() - 1);
    // dichte Bahn
    const nn = 400, path = [];
    let e = 0;
    for (let i = 0; i < nn; i++){
      const u = clamp(ua + (ub - ua) * i / (nn - 1), d0, d1), t = (u - d0) / Wd, base = gAt(u);
      if (!fin(base)){ path.push(null); continue; }
      e = 0.85 * e + Math.sqrt(1 - 0.85 * 0.85) * gauss(R);
      // Amplitudenfehler ±1,3·noise, Höhenfehler ±noise·A (achsennah kleiner), Strichversatz, Zittern σ = 0,125·noise·A
      const y = base * (1 + 1.3 * noise * am(t)) + (noise * off(t) + sOff / Aabs) * Aabs * loc(base) + 0.125 * noise * Aabs * e;
      path.push([early(u) + warp(t), y]);
    }
    // Stiftpunkte in unregelmäßigen Abständen (Bildschirmmaß), mit kleiner x-Unruhe; NaN-Stellen trennen Striche
    let cur = [], acc = 0, step = 0.004 + 0.008 * R();
    const flush = () => { if (cur.length >= 2) out.push(cur); cur = []; };
    for (let i = 0; i < path.length; i++){
      const p = path[i]; if (!p){ flush(); continue; }
      if (!cur.length){ cur.push(p.slice()); acc = 0; continue; }
      const q = path[i - 1] || p, seg = Math.hypot((p[0] - q[0]) / P.W, (p[1] - q[1]) / P.H);
      // lange Bahnstücke (z. B. senkrechter Sprung) liefern beim echten Stift viele Punkte
      let pos = 0;
      while (acc + (seg - pos) >= step){ pos += step - acc; const t = pos / seg; const jx = (2 * R() - 1) * 0.3 * step * P.W; cur.push([q[0] + (p[0] - q[0]) * t + jx, q[1] + (p[1] - q[1]) * t]); acc = 0; step = 0.004 + 0.008 * R(); }
      acc += seg - pos;
      if (i === path.length - 1) cur.push([p[0], p[1]]);
    }
    // kleiner Haken am Strichende (Stift abheben)
    if (cur.length > 3 && R() < 0.3){ const L = cur[cur.length - 1]; const dx = -(0.002 + 0.004 * R()) * P.W, dy = (2 * R() - 1) * 0.015 * P.H; cur.push([L[0] + dx / 2, L[1] + dy / 2], [L[0] + dx, L[1] + dy]); }
    flush();
  }
  return out;
}
function synthArrows(P, list, R, noise){
  const Sz = Math.min(P.W, P.H), out = [];
  for (const a of list){
    const v = [a.to[0] - a.from[0], a.to[1] - a.from[1]], L = Math.hypot(v[0], v[1]); if (!(L > 0)) continue;
    const ang = Math.atan2(v[1], v[0]) + (2 * R() - 1) * noise * 70 * Math.PI / 180;
    const Ld = L * (1 + (2 * R() - 1) * 1.3 * noise);
    const r0 = noise * 0.35 * Sz * Math.sqrt(R()), th = 2 * Math.PI * R();
    const t0 = [a.from[0] + r0 * Math.cos(th), a.from[1] + r0 * Math.sin(th)];
    const u = [Math.cos(ang), Math.sin(ang)], nrm = [-u[1], u[0]];
    const bow = (2 * R() - 1) * noise * 0.25 * Ld;
    const n = 20 + Math.floor(30 * R()), shaft = [];
    for (let i = 0; i < n; i++){ const s = i / (n - 1), tt = s + (i && i < n - 1 ? (2 * R() - 1) * 0.3 / n : 0); const lat = bow * Math.sin(Math.PI * tt) + (2 * R() - 1) * 0.004 * Sz; shaft.push([t0[0] + u[0] * Ld * tt + nrm[0] * lat, t0[1] + u[1] * Ld * tt + nrm[1] * lat]); }
    const tip = shaft[shaft.length - 1], hb = (0.12 + 0.08 * R()) * Ld, ha = (25 + 10 * R()) * Math.PI / 180;
    const barb = s => [tip[0] - hb * (u[0] * Math.cos(ha) - s * nrm[0] * Math.sin(ha)), tip[1] - hb * (u[1] * Math.cos(ha) - s * nrm[1] * Math.sin(ha))];
    const style = Math.floor(R() * 4);
    if (style === 0){ out.push(shaft); out.push([barb(1), tip.slice(), barb(-1)]); }
    else if (style === 1){ out.push(shaft); out.push([tip.slice(), barb(1)]); out.push([tip.slice(), barb(-1)]); }
    else if (style === 2){ out.push(shaft.concat([barb(1), tip.slice(), barb(-1)])); }
    else out.push(shaft);
  }
  return out;
}

/* ---------- Schema-Prüfung ---------- */
function validate(spec){
  const E = [], id = spec && spec.id ? String(spec.id) : '?';
  const e = m => E.push(id + ': ' + m);
  if (!spec || typeof spec !== 'object') return ['Skizze: keine Spezifikation'];
  if (typeof spec.id !== 'string' || !spec.id) e('id fehlt');
  if (typeof spec.title !== 'string' || !spec.title) e('title fehlt');
  if (typeof spec.text !== 'string' || !spec.text) e('text fehlt');
  const kind = spec.kind || 'curve';
  if (!['curve', 'arrows'].includes(kind)) { e('kind unbekannt: ' + spec.kind); return E; }
  for (const k of Object.keys(spec)) if (!(kind === 'curve' ? TOP_CURVE : TOP_ARROWS).includes(k)) e('unbekanntes Feld ' + k);
  if (typeof spec.reveal !== 'string' || !spec.reveal) e('reveal fehlt');
  if (spec.hints !== undefined && !(Array.isArray(spec.hints) && spec.hints.length >= 1 && spec.hints.length <= 3 && spec.hints.every(h => typeof h === 'string' && h))) e('hints: 1–3 Texte');
  if (spec.points !== undefined && !(fin(spec.points) && spec.points > 0)) e('points muss positiv sein');
  const p = spec.plot;
  if (!p || typeof p !== 'object'){ e('plot fehlt'); return E; }
  for (const k of Object.keys(p)) if (!PLOT_KEYS.includes(k)) e('plot: unbekanntes Feld ' + k);
  if (!isRange(p.x)) e('plot.x muss [a, b] mit a < b sein');
  if (p.y !== undefined && !isRange(p.y)) e('plot.y muss [a, b] mit a < b sein');
  const P = plotOf(spec), inX = v => fin(v) && v >= P.x[0] - 1e-9 && v <= P.x[1] + 1e-9, inR = r => isRange(r) && inX(r[0]) && inX(r[1]);
  if (p.dom !== undefined && !inR(p.dom)) e('plot.dom muss in plot.x liegen');
  for (const k of ['xlab', 'ylab']) if (p[k] !== undefined && typeof p[k] !== 'string') e('plot.' + k + ' muss Text sein');
  if (p.ticks !== undefined && !(Array.isArray(p.ticks) && p.ticks.every(t => t && fin(t.x) && typeof t.lab === 'string'))) e('plot.ticks: [{x, lab}]');
  if (p.yticks !== undefined && !(Array.isArray(p.yticks) && p.yticks.every(t => t && fin(t.y) && typeof t.lab === 'string'))) e('plot.yticks: [{y, lab}]');
  if (p.walls !== undefined && !(Array.isArray(p.walls) && p.walls.every(fin))) e('plot.walls: Zahlen');
  if (p.V !== undefined && typeof p.V !== 'function') e('plot.V muss eine Funktion sein');
  if (p.Vr !== undefined && !isRange(p.Vr)) e('plot.Vr muss [a, b] sein');
  if (p.E !== undefined && !fin(p.E)) e('plot.E muss eine Zahl sein');
  if (p.regions !== undefined && !(Array.isArray(p.regions) && p.regions.every(r => r && isRange(r.x)))) e('plot.regions: [{x:[a, b], lab}]');
  if (kind === 'arrows'){
    if (!isRange(p.y)) e('arrows: plot.y muss angegeben sein');
    const diag = Math.hypot(P.W, P.H), vec = v => Array.isArray(v) && v.length === 2 && fin(v[0]) && fin(v[1]);
    for (const [k, arr] of [['given', spec.given], ['want', spec.want]]){
      if (arr === undefined && k === 'given') continue;
      if (!Array.isArray(arr) || (k === 'want' && !arr.length)){ e(k + ' muss eine Liste sein' + (k === 'want' ? ' (mindestens ein Pfeil)' : '')); continue; }
      arr.forEach((w, i) => {
        if (!w || !vec(w.from) || !vec(w.to)){ e(k + '[' + i + ']: from und to als [x, y]'); return; }
        if (k === 'given') return;
        for (const q of Object.keys(w)) if (!WANT_KEYS.includes(q)) e('want[' + i + ']: unbekanntes Feld ' + q);
        if (typeof w.msg !== 'string' || !w.msg) e('want[' + i + ']: msg fehlt');
        const L = dist(w.from, w.to);
        if (L < 0.12 * diag) e('want[' + i + ']: Pfeil zu kurz (' + num(L) + ' < 12 % der Rahmendiagonale ' + num(0.12 * diag) + '), er würde nicht sicher als Pfeil erkannt');
        for (const q of ['dirTol', 'lenTol', 'posTol']) if (w[q] !== undefined && !(fin(w[q]) && w[q] > 0)) e('want[' + i + '].' + q + ' muss positiv sein');
        if (w.len !== undefined && w.len !== false) e('want[' + i + '].len: nur false (Länge beliebig)');
        if (w.axis !== undefined && typeof w.axis !== 'boolean') e('want[' + i + '].axis: true/false');
      });
    }
    const wids = (spec.want || []).map((w, i) => w && w.id || String(i)); if (new Set(wids).size !== wids.length) e('want-ids doppelt');
    if (spec.extra !== undefined && typeof spec.extra !== 'string') e('extra muss Text sein');
    for (const [i, w] of (spec.wrong || []).entries()){
      if (!w || !Array.isArray(w.arrows) || !w.arrows.every(a => a && vec(a.from) && vec(a.to))) e('wrong[' + i + ']: arrows:[{from, to}] fehlt');
      if (!w || !Array.isArray(w.fails) || !w.fails.length || !w.fails.every(q => Number.isInteger(q) && q >= 0 && q < (spec.want || []).length)) e('wrong[' + i + ']: fails muss Indizes in want enthalten');
      if (!w || typeof w.why !== 'string' || !w.why) e('wrong[' + i + ']: why fehlt');
    }
    if (spec.wrong !== undefined && !Array.isArray(spec.wrong)) e('wrong muss eine Liste sein');
    return E;
  }
  // curve
  if (!['psi', 'abs2', 'f'].includes(spec.draw)) e("draw muss 'psi', 'abs2' oder 'f' sein");
  if (typeof spec.f !== 'function') e('f (Musterlösung) muss eine Funktion sein');
  else { let bad = 0, nz = 0; for (let i = 0; i <= 200; i++){ const x = P.dom[0] + (P.dom[1] - P.dom[0]) * i / 200; let y; try { y = spec.f(x); } catch(err){ y = NaN; } if (!fin(y)) bad++; else if (y !== 0) nz++; } if (bad) e('f liefert in dom ' + bad + '× keinen endlichen Wert'); if (!nz) e('f ist in dom überall 0'); }
  if (!Array.isArray(spec.checks) || !spec.checks.length){ e('checks fehlt'); return E; }
  const ids = new Set();
  spec.checks.forEach((c, i) => {
    const w = 'Merkmal ' + (c && c.id ? "'" + c.id + "'" : '#' + i);
    if (!c || typeof c !== 'object'){ e(w + ': kein Objekt'); return; }
    if (typeof c.id !== 'string' || !c.id) e(w + ': id fehlt'); else if (ids.has(c.id)) e(w + ': id doppelt'); else ids.add(c.id);
    if (!TYPES.includes(c.type)){ e(w + ': type unbekannt: ' + c.type); return; }
    for (const k of Object.keys(c)) if (!COMMON.includes(k) && !FIELDS[c.type].includes(k)) e(w + ': unbekanntes Feld ' + k);
    if (typeof c.msg !== 'string' || !c.msg) e(w + ': msg fehlt');
    if (c.range !== undefined && !inR(c.range)) e(w + ': range muss [a, b] in plot.x sein');
    if (c.w !== undefined && !(fin(c.w) && c.w > 0)) e(w + ': w muss positiv sein');
    const int0 = v => Number.isInteger(v) && v >= 0, pos = v => fin(v) && v > 0, arrX = v => (Array.isArray(v) ? v.length && v.every(inX) : inX(v));
    switch (c.type){
      case 'nodes': if (!int0(c.n)) e(w + ': n ganzzahlig ≥ 0'); break;
      case 'zero': if (!arrX(c.at)) e(w + ': at (Liste von x in plot.x)'); if (c.tol !== undefined && !pos(c.tol)) e(w + ': tol > 0'); break;
      case 'parity': if (!['even', 'odd'].includes(c.p)) e(w + ": p 'even' oder 'odd'"); if (!inX(c.about)) e(w + ': about in plot.x'); else { const r = rangeOf(c, P); if (c.about <= r[0] || c.about >= r[1]) e(w + ': about muss im Inneren von range liegen'); } break;
      case 'decay': if (!['left', 'right'].includes(c.toward)) e(w + ": toward 'left' oder 'right'"); if (c.ratio !== undefined && !(pos(c.ratio) && c.ratio < 1)) e(w + ': ratio in (0, 1)'); break;
      case 'osc': if (!(Number.isInteger(c.min) && c.min >= 1)) e(w + ': min ganzzahlig ≥ 1'); break;
      case 'wavelength': case 'amp': if (!inR(c.a) || !inR(c.b)) e(w + ': a und b als Bereiche in plot.x'); if (!['<', '>', '='].includes(c.cmp)) e(w + ": cmp '<', '>' oder '='"); if (c.f !== undefined && !(fin(c.f) && c.f > 1)) e(w + ': f > 1'); break;
      case 'sign': if (c.s !== undefined ? ![1, -1].includes(c.s) : spec.draw !== 'psi') e(w + ': s muss 1 oder -1 sein'); break;
      case 'extrema': if (!int0(c.n)) e(w + ': n ganzzahlig ≥ 0'); if (c.kind !== undefined && !['max', 'min', 'any'].includes(c.kind)) e(w + ": kind 'max', 'min' oder 'any'"); break;
      case 'maxat': if (!inX(c.x)) e(w + ': x in plot.x'); if (c.tol !== undefined && !pos(c.tol)) e(w + ': tol > 0'); if (c.of !== undefined && !['y', 'abs'].includes(c.of)) e(w + ": of 'y' oder 'abs'"); break;
      case 'center': if (!inX(c.x)) e(w + ': x in plot.x'); if (c.tol !== undefined && !pos(c.tol)) e(w + ': tol > 0'); break;
      case 'fwhm': if (!pos(c.v)) e(w + ': v > 0'); if (c.tol !== undefined && !(pos(c.tol) && c.tol < 1)) e(w + ': tol in (0, 1)'); break;
      case 'smooth': case 'kink': if (!arrX(c.at)) e(w + ': at (x oder Liste) in plot.x'); if (c.win !== undefined && !pos(c.win)) e(w + ': win > 0'); if (c.minJump !== undefined && !pos(c.minJump)) e(w + ': minJump > 0'); break;
      case 'level': case 'area':
        if (!P.abs) e(w + ': nur mit plot.abs:true');
        if (!fin(c.v) || (c.type === 'area' && c.v === 0)) e(w + ': v fehlt');
        if (c.type === 'level' ? !pos(c.tol) : (c.tol !== undefined && !(pos(c.tol) && c.tol < 1))) e(w + (c.type === 'level' ? ': tol (absolut) > 0 nötig' : ': tol in (0, 1)'));
        break;
    }
  });
  if (spec.wrong !== undefined){
    if (!Array.isArray(spec.wrong)) e('wrong muss eine Liste sein');
    else spec.wrong.forEach((w, i) => {
      if (!w || typeof w.f !== 'function') e('wrong[' + i + ']: f fehlt');
      if (!w || !Array.isArray(w.fails) || !w.fails.length) e('wrong[' + i + ']: fails fehlt');
      else for (const q of w.fails) if (!ids.has(q) && q !== '_cover') e('wrong[' + i + ']: fails nennt unbekanntes Merkmal ' + q);
      if (!w || typeof w.why !== 'string' || !w.why) e('wrong[' + i + ']: why fehlt');
    });
  }
  return E;
}

/* ---------- Selbsttest: Muster mit Handzittern besteht, Fehlskizzen fallen durch ---------- */
function selfTest(spec, opt){
  opt = opt || {};
  const problems = [];
  const errs = validate(spec);
  if (errs.length) return {ok:false, problems:errs.map(x => 'Schema: ' + x)};
  const kind = spec.kind || 'curve', H = hstr(spec.id);
  const seeds = opt.seeds || [1, 2, 3], strokesL = opt.strokes || [1, 2, 3], noises = opt.noise || [0.03, 0.06];
  const src = kind === 'arrows' ? spec.want : spec.f;
  const desc = r => r.first.length && r.first[0].type === 'cover' ? r.first[0].msg : r.results.filter(x => !x.ok).map(x => x.id + (x.got !== undefined ? ' (' + (typeof x.got === 'object' ? JSON.stringify(x.got) : x.got) + (x.want !== undefined && typeof x.want !== 'object' ? ' statt ' + x.want : '') + ')' : '')).join(', ');
  // Muster ohne Zittern
  if (kind === 'curve'){
    const P = plotOf(spec), pts = [];
    const frame = Math.max(Math.abs(P.y[0]), Math.abs(P.y[1]));
    let mf = 0; for (let i = 0; i <= 400; i++){ const x = P.dom[0] + (P.dom[1] - P.dom[0]) * i / 400; const y = spec.f(x); if (fin(y)) mf = Math.max(mf, Math.abs(y)); }
    const sc = P.abs ? 1 : 0.8 * frame / mf;
    for (let i = 0; i <= 400; i++){ const x = P.dom[0] + (P.dom[1] - P.dom[0]) * i / 400; const y = spec.f(x); if (fin(y)) pts.push([x, sc * y]); }
    const r = evaluate(spec, [pts]);
    if (!r.ok) problems.push('Muster ohne Zittern verfehlt: ' + desc(r));
  }
  for (const noise of noises) for (const s of seeds) for (const k of strokesL){
    const st = synth(spec, src, {seed:(H ^ Math.imul(s, 0x9E3779B1) ^ Math.imul(k, 0x85EBCA6B)) >>> 0, noise, strokes:k});
    const r = evaluate(spec, st);
    if (!r.ok) problems.push('Muster (noise ' + num(noise) + ', Start ' + s + ', ' + k + ' Strich' + (k > 1 ? 'e' : '') + ') verfehlt: ' + desc(r));
  }
  (spec.wrong || []).forEach((w, wi) => {
    for (const s of seeds) for (const k of strokesL){
      const st = synth(spec, kind === 'arrows' ? w.arrows : w.f, {seed:(H ^ Math.imul(s + 101 * (wi + 1), 0x9E3779B1) ^ Math.imul(k, 0x85EBCA6B)) >>> 0, noise:opt.wrongNoise || 0.03, strokes:k});
      const r = evaluate(spec, st);
      const gated = r.first.length && r.first[0].type === 'cover';
      for (const q of w.fails){
        if (q === '_cover'){ if (!gated) problems.push('Fehlskizze ' + wi + ' („' + w.why + '“): wird nicht an der Überdeckung abgewiesen'); continue; }
        const res = kind === 'arrows' ? r.results[q] : r.results.find(x => x.id === q);
        if (gated && !w.fails.includes('_cover')){ problems.push('Fehlskizze ' + wi + ' („' + w.why + '“) scheitert schon an der Überdeckung und prüft kein Merkmal'); break; }
        if (res && res.ok) problems.push('Fehlskizze ' + wi + ' („' + w.why + '“, Start ' + s + ', ' + k + ' Strich' + (k > 1 ? 'e' : '') + ') erfüllt ' + (kind === 'arrows' ? 'Pfeil ' + q : "'" + q + "'") + ', sollte es verfehlen');
      }
    }
  });
  const uniq = [...new Set(problems)];
  return {ok:uniq.length === 0, problems:uniq};
}

/* ---------- statischer Graph (didaktik/UMBAU2.md, Abschnitt 2: reps-Zeile k:'graph', Schritt-Feld plot) ----------
   g = {plot:{x, y?, dom?, xlab, ylab, ticks, …}, f:x => …, f2?:x => …, lab?, lab2?, cap?}. Zeichnet nichts:
   Rückgabe {plot (vollständig; y aus den Kurven, wenn nicht angegeben: [min, max] mit 0, Rand 10 %),
             curves:[{key:'f'|'f2', lab, pts:[[x, y], …]}] (nicht endliche Werte als NaN, d. h. Lücke), problems:[…]}.
   Werte werden nicht umskaliert (anders als model bei Skizzen ohne abs). */
function graph(g, n){
  const problems = [];
  if (!g || typeof g !== 'object') return {plot:{x:[0, 1], y:[-1, 1]}, curves:[], problems:['kein Graph (Objekt erwartet)']};
  /* auch flach erlaubt: {x, xlab, …, f} (Plot-Schlüssel auf derselben Ebene wie f) */
  const nested = !!(g.plot && typeof g.plot === 'object');
  const src = nested ? g.plot : Object.fromEntries(Object.entries(g).filter(([k]) => PLOT_KEYS.includes(k)));
  const p = Object.assign({}, src);
  if (nested) for (const k of Object.keys(src)) if (!PLOT_KEYS.includes(k)) problems.push('plot.' + k + ' unbekannt');
  if (!isRange(p.x)){ problems.push(p.x === undefined ? 'plot.x fehlt' : 'plot.x ungültig'); p.x = [0, 1]; }
  if (p.dom !== undefined && !isRange(p.dom)){ problems.push('plot.dom ungültig'); delete p.dom; }
  const D = isRange(p.dom) ? p.dom : p.x;
  n = n || 400;
  if (typeof g.f !== 'function') problems.push('f fehlt (JS-Funktion x => …)');
  if (g.f2 !== undefined && typeof g.f2 !== 'function') problems.push('f2 ist keine Funktion');
  const curves = [];
  for (const [key, f, lab] of [['f', g.f, g.lab], ['f2', g.f2, g.lab2]]){
    if (typeof f !== 'function') continue;
    const pts = []; let ok = 0;
    for (let i = 0; i < n; i++){ const x = D[0] + (D[1] - D[0]) * i / (n - 1); let y; try { y = +f(x); } catch(e){ y = NaN; } if (fin(y)) ok++; pts.push([x, fin(y) ? y : NaN]); }
    if (!ok) problems.push(key + ' liefert keine endlichen Werte auf ' + (p.dom ? 'plot.dom' : 'plot.x'));
    curves.push({key, lab:lab || '', pts});
  }
  if (!isRange(p.y)){
    if (p.y !== undefined) problems.push('plot.y ungültig');
    let a = Infinity, b = -Infinity;
    for (const c of curves) for (const q of c.pts) if (fin(q[1])){ if (q[1] < a) a = q[1]; if (q[1] > b) b = q[1]; }
    if (!fin(a)){ a = -1; b = 1; }
    a = Math.min(a, 0); b = Math.max(b, 0);
    if (b - a < 1e-12) b = a + 1;
    const m = 0.1 * (b - a);
    p.y = [a - m, b + m];
  }
  return {plot:p, curves, problems};
}

return {map, dom, sample, evaluate, model, arrows, synth, validate, selfTest, graph, T, plotOf, LABEL, YDEF, version:1,
  _:{jumpNear, jumpFit, fitSlope, lobes, zigzag, dips}};   // interne Bausteine nur für Tests
})();
