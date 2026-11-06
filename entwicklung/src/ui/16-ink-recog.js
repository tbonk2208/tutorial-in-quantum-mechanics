/* ===== Handschrift lesen (Agent R): Zeichen erkennen, Zeile aufbauen, in die Eingabesprache übersetzen =====
   Schnittstelle (siehe /home/claude/ink/DESIGN.md):
     inkContext(taskCtx[, extraText])  → rctx (Zusammenhang der Aufgabe: Buchstaben, Funktionen, pctx)
     recognizeInk(strokes, rctx)       → {text, alts:[{text, score}], items, conf, ok, ms}
     inkItemChoices(result, k)         → [{c, p, text, ok}] Alternativen für das k-te Zeichen
     HANDQ.add(strokes, cls) / HANDQ.clear() / HANDQ.count(cls)   eigene Handschrift (localStorage 'qm-hand-1')
     SYMQ_CLASSES                      Klassenliste des geladenen Modells
     inkApplyChoice(result, k, cls)    → neues Ergebnis, Zeichen k als cls gelesen
     inkClassifySymbol(strokes[, rctx]) → [[klasse, p], …] (alle Striche = ein Zeichen; Anlernen)
     inkModelReady()                   → true, wenn ein Modell geladen ist
     inkLoadModel(json)                Modell laden (Node; im Browser automatisch aus <script id="sym-data">)
   Läuft ohne DOM (Node): Modell mit inkLoadModel(Dateiinhalt) laden. */
var INKR = (function(){
'use strict';
const GL = typeof globalThis !== 'undefined' ? globalThis : {};

/* ---------------- Modell ---------------- */
let MODEL = null, TRIED = false;
const CLASSES = [];
let CIDX = {};
const b64 = s => { if (typeof atob === 'function') return atob(s); return Buffer.from(s, 'base64').toString('binary'); };
const b64e = s => { if (typeof btoa === 'function') return btoa(s); return Buffer.from(s, 'binary').toString('base64'); };
function loadModel(src){
  const d = typeof src === 'string' ? JSON.parse(src) : src;
  if (!d || !Array.isArray(d.classes) || !Array.isArray(d.layers) || d.layers.length !== 4) throw new Error('Modell unklar');
  const layers = d.layers.map(l => {
    const bin = b64(l.w), n = bin.length, W = new Float32Array(n);
    for (let i = 0; i < n; i++){ let c = bin.charCodeAt(i); if (c > 127) c -= 256; W[i] = c * l.scale; }
    return {W, b:Float32Array.from(l.b), nin:l.shape[0], nout:l.shape[1]};
  });
  const [L1, L2, L3, L4] = layers;
  const C1 = L1.nout, C2 = L2.nout, F = L3.nout, N = L4.nout;
  if (L1.nin !== 9 || L2.nin !== 9 * C1 || L3.nin !== 25 * C2 || L4.nin !== F || N !== d.classes.length) throw new Error('Modell: Schichtformen passen nicht');
  MODEL = {arch:d.arch || 'cnn1', layers, C1, C2, F, N, sig:(d.arch || 'cnn1') + ':' + d.classes.join('') + ':' + F};
  CLASSES.length = 0; d.classes.forEach(c => CLASSES.push(c));
  CIDX = {}; CLASSES.forEach((c, i) => { CIDX[c] = i; });
  CACHE.clear(); TRIED = true;
  HANDQ._load();
  return {classes:CLASSES.slice(), arch:MODEL.arch};
}
function model(){
  if (MODEL || TRIED) return MODEL;
  TRIED = true;
  try { if (typeof document !== 'undefined'){ const el = document.getElementById('sym-data'); if (el && el.textContent.trim()) loadModel(el.textContent); } } catch(e){ MODEL = null; }
  return MODEL;
}

/* ---------------- Rasterung (verbindlich, DESIGN.md) ----------------
   Begrenzungsrechteck → Skalierung (80 − 10)/max(B, H, 1), Mitte auf (56, 56) eines 112er-Rasters;
   Deckung clamp(5.5 − Abstand zum Strich, 0, 1); 4×4-Mittel → 28×28; Schwerpunkt ganzzahlig auf (14, 14),
   gerundet mit Math.round(14 − s̄ + 0.001) (Gleichstandsregel, identisch mit raster.py). */
function rasterize(strokes){
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const st of strokes) for (const p of st){ if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y; }
  const out = new Float32Array(784);
  if (!(x1 >= x0)) return out;
  const lw = 10, R = lw / 2 + 0.5, s = (80 - lw) / Math.max(x1 - x0, y1 - y0, 1);
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const cov = new Float64Array(112 * 112);
  const seg = (ax, ay, bx, by) => {
    const i0 = Math.max(0, Math.floor(Math.min(ax, bx) - R - 1)), i1 = Math.min(111, Math.ceil(Math.max(ax, bx) + R));
    const j0 = Math.max(0, Math.floor(Math.min(ay, by) - R - 1)), j1 = Math.min(111, Math.ceil(Math.max(ay, by) + R));
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    for (let j = j0; j <= j1; j++){
      const py = j + 0.5;
      for (let i = i0; i <= i1; i++){
        const px = i + 0.5;
        let t = L2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const ex = px - ax - t * dx, ey = py - ay - t * dy;
        const c = R - Math.sqrt(ex * ex + ey * ey);
        if (c > 0){ const v = c > 1 ? 1 : c, k = j * 112 + i; if (v > cov[k]) cov[k] = v; }
      }
    }
  };
  for (const st of strokes){
    const n = st.length; if (!n) continue;
    const X = new Float64Array(n), Y = new Float64Array(n);
    for (let k = 0; k < n; k++){ X[k] = (st[k].x - mx) * s + 56; Y[k] = (st[k].y - my) * s + 56; }
    if (n === 1) seg(X[0], Y[0], X[0], Y[0]);
    else for (let k = 1; k < n; k++) seg(X[k - 1], Y[k - 1], X[k], Y[k]);
  }
  const a = new Float64Array(784);
  let sm = 0, sx = 0, sy = 0;
  for (let r = 0; r < 28; r++) for (let c = 0; c < 28; c++){
    let t = 0;
    for (let u = 0; u < 4; u++){ const o = (4 * r + u) * 112 + 4 * c; t += cov[o] + cov[o + 1] + cov[o + 2] + cov[o + 3]; }
    const v = t / 16; a[r * 28 + c] = v; sm += v; sx += v * c; sy += v * r;
  }
  if (!sm){ return out; }
  /* Gleichstandsregel (wie raster.py von Agent T): symmetrische Zeichen liegen genau auf x.5 */
  const dx = Math.round(14 - sx / sm + 1e-3), dy = Math.round(14 - sy / sm + 1e-3);
  for (let y = 0; y < 28; y++) for (let x = 0; x < 28; x++){ const xs = x - dx, ys = y - dy; if (xs >= 0 && xs < 28 && ys >= 0 && ys < 28) out[y * 28 + x] = a[ys * 28 + xs]; }
  return out;
}

/* ---------------- Faltungsnetz 'cnn1'/'cnn2' (Formen aus dem JSON) ---------------- */
/* Hintergrund (keine Tinte im Fenster) liefert in beiden Faltungen eine konstante Antwort: einmal je Modell rechnen,
   dann nur Fenster mit Tinte auswerten (exakt gleiches Ergebnis, etwa doppelt so schnell). */
function cnnBg(){
  const M = MODEL; if (M.bg) return M.bg;
  const [L1, L2] = M.layers, C1 = M.C1, C2 = M.C2;
  const bg1 = new Float32Array(C1); for (let k = 0; k < C1; k++) bg1[k] = Math.max(0, L1.b[k]);
  const bg2 = new Float32Array(C2);
  for (let k = 0; k < C2; k++){ let t = L2.b[k]; for (let d = 0; d < 9; d++) for (let ch = 0; ch < C1; ch++) t += bg1[ch] * L2.W[(d * C1 + ch) * C2 + k]; bg2[k] = Math.max(0, t); }
  return (M.bg = {bg1, bg2});
}
function cnnEval(x){
  const M = MODEL, [L1, L2, L3, L4] = M.layers, C1 = M.C1, C2 = M.C2, F = M.F, N = M.N;
  const {bg1, bg2} = cnnBg();
  /* Tinte je 28er-Pixel → welche 26er-Fenster leer sind */
  const ink1 = new Uint8Array(26 * 26);
  for (let i = 0; i < 26; i++) for (let j = 0; j < 26; j++){
    let any = 0; for (let di = 0; di < 3 && !any; di++) for (let dj = 0; dj < 3; dj++) if (x[(i + di) * 28 + j + dj]){ any = 1; break; }
    ink1[i * 26 + j] = any;
  }
  const c1 = new Float32Array(26 * 26 * C1), W1 = L1.W, B1 = L1.b;
  for (let i = 0; i < 26; i++) for (let j = 0; j < 26; j++){
    const o = (i * 26 + j) * C1;
    if (!ink1[i * 26 + j]){ for (let k = 0; k < C1; k++) c1[o + k] = bg1[k]; continue; }
    for (let k = 0; k < C1; k++) c1[o + k] = B1[k];
    for (let di = 0; di < 3; di++) for (let dj = 0; dj < 3; dj++){
      const v = x[(i + di) * 28 + j + dj]; if (!v) continue;
      const w = (di * 3 + dj) * C1;
      for (let k = 0; k < C1; k++) c1[o + k] += v * W1[w + k];
    }
    for (let k = 0; k < C1; k++) if (c1[o + k] < 0) c1[o + k] = 0;
  }
  const p1 = new Float32Array(13 * 13 * C1), ink2 = new Uint8Array(13 * 13);
  for (let i = 0; i < 13; i++) for (let j = 0; j < 13; j++){
    const q = (2 * i) * 26 + 2 * j;
    ink2[i * 13 + j] = ink1[q] | ink1[q + 1] | ink1[q + 26] | ink1[q + 27];
    const a = q * C1, b = a + C1, c = a + 26 * C1, d = c + C1, o = (i * 13 + j) * C1;
    for (let k = 0; k < C1; k++){ let m = c1[a + k]; if (c1[b + k] > m) m = c1[b + k]; if (c1[c + k] > m) m = c1[c + k]; if (c1[d + k] > m) m = c1[d + k]; p1[o + k] = m; }
  }
  const c2 = new Float32Array(11 * 11 * C2), W2 = L2.W, B2 = L2.b;
  for (let i = 0; i < 11; i++) for (let j = 0; j < 11; j++){
    const o = (i * 11 + j) * C2;
    let any = 0; for (let di = 0; di < 3 && !any; di++) for (let dj = 0; dj < 3; dj++) if (ink2[(i + di) * 13 + j + dj]){ any = 1; break; }
    if (!any){ for (let k = 0; k < C2; k++) c2[o + k] = bg2[k]; continue; }
    for (let k = 0; k < C2; k++) c2[o + k] = B2[k];
    for (let di = 0; di < 3; di++) for (let dj = 0; dj < 3; dj++){
      const base = ((i + di) * 13 + j + dj) * C1, wb = (di * 3 + dj) * C1;
      for (let ch = 0; ch < C1; ch++){
        const v = p1[base + ch]; if (!v) continue;
        const w = (wb + ch) * C2;
        for (let k = 0; k < C2; k++) c2[o + k] += v * W2[w + k];
      }
    }
    for (let k = 0; k < C2; k++) if (c2[o + k] < 0) c2[o + k] = 0;
  }
  const f = new Float32Array(25 * C2);
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++){
    const a = ((2 * i) * 11 + 2 * j) * C2, b = a + C2, c = a + 11 * C2, d = c + C2, o = (i * 5 + j) * C2;
    for (let k = 0; k < C2; k++){ let m = c2[a + k]; if (c2[b + k] > m) m = c2[b + k]; if (c2[c + k] > m) m = c2[c + k]; if (c2[d + k] > m) m = c2[d + k]; f[o + k] = m; }
  }
  const h = Float32Array.from(L3.b), W3 = L3.W;
  for (let i = 0; i < 25 * C2; i++){ const v = f[i]; if (!v) continue; const off = i * F; for (let j = 0; j < F; j++) h[j] += v * W3[off + j]; }
  let n2 = 0; for (let j = 0; j < F; j++){ if (h[j] < 0) h[j] = 0; n2 += h[j] * h[j]; }
  const nn = Math.sqrt(n2) || 1, e = new Float32Array(F); for (let j = 0; j < F; j++) e[j] = h[j] / nn;
  const o = Float32Array.from(L4.b), W4 = L4.W;
  for (let i = 0; i < F; i++){ const v = h[i]; if (!v) continue; const off = i * N; for (let j = 0; j < N; j++) o[j] += v * W4[off + j]; }
  let m = -Infinity; for (let j = 0; j < N; j++) if (o[j] > m) m = o[j];
  const p = new Float64Array(N); let s = 0;
  for (let j = 0; j < N; j++){ p[j] = Math.exp(o[j] - m); s += p[j]; }
  for (let j = 0; j < N; j++) p[j] /= s;
  return {p, e};
}
/* Zwischenspeicher je Strichmenge */
const CACHE = new Map(); const SID = new WeakMap(); let SIDN = 0;
const sid = st => { let k = SID.get(st); if (!k){ k = ++SIDN; SID.set(st, k); } return k; };
function evalStrokes(strokes){
  const key = strokes.map(sid).sort((a, b) => a - b).join(',');
  let r = CACHE.get(key);
  if (!r){ r = cnnEval(rasterize(strokes)); CACHE.set(key, r); if (CACHE.size > 3000) CACHE.delete(CACHE.keys().next().value); STAT.evals++; }
  return r;
}
const STAT = {evals:0};

/* ---------------- eigene Handschrift ----------------
   p'_c = p_c + L·exp((s_c − 1)/T), s_c = größte Kosinus-Ähnlichkeit zu eigenen Beispielen von c (wie handBoost der Mathe-App). */
const MEM = {};
const LS = {
  get(k){ try { if (GL.localStorage) return GL.localStorage.getItem(k); } catch(e){} return Object.prototype.hasOwnProperty.call(MEM, k) ? MEM[k] : null; },
  set(k, v){ try { if (GL.localStorage){ GL.localStorage.setItem(k, v); return; } } catch(e){} MEM[k] = v; }
};
const SHOW_TO_CLS = {'√':'sqrt', '±':'pm', '·':'.', '<':'⟨', '>':'⟩', 'o':'0', '−':'-'};
const HANDQ = {
  key:'qm-hand-1', T:0.1, L:4, list:[], subs:[], MAX:8,
  _enc(e){ let m = 0; for (const v of e) m = Math.max(m, v); m = m || 1; let s = ''; for (const v of e) s += String.fromCharCode(Math.round(v / m * 255)); return b64e(s); },
  _dec(b){ try { const s = b64(b), e = new Float32Array(s.length); let n = 0; for (let i = 0; i < s.length; i++){ e[i] = s.charCodeAt(i); n += e[i] * e[i]; } n = Math.sqrt(n) || 1; for (let i = 0; i < e.length; i++) e[i] /= n; return e; } catch(_){ return null; } },
  _load(){
    this.list = [];
    try {
      const d = JSON.parse(LS.get(this.key) || 'null');
      if (d && d.v === 1 && Array.isArray(d.list) && MODEL && d.m === MODEL.sig) this.list = d.list.map(x => ({c:x.c, s:x.s, e:this._dec(x.e)})).filter(x => x.e && x.e.length === MODEL.F && x.c in CIDX);
      this._other = d && MODEL && d.m !== MODEL.sig ? d : null;
    } catch(e){ this.list = []; }
  },
  _save(){
    if (!MODEL) return;
    LS.set(this.key, JSON.stringify({v:1, m:MODEL.sig, list:this.list.map(x => ({c:x.c, s:x.s, e:this._enc(x.e)}))}));
    this.subs.forEach(f => { try { f(); } catch(e){} });
  },
  /* strokes: Striche eines Zeichens (Punktlisten), cls: Klassenname oder Anzeigezeichen; src: 'cal' (Anlernen) oder 'fix' (Korrektur) */
  add(strokes, cls, src){
    if (!model() || !strokes || !strokes.length) return 0;
    const c = SHOW_TO_CLS[cls] || cls;
    if (!(c in CIDX)) return 0;
    const pts = strokes.map(s => Array.isArray(s) ? s : (s && s.pts) || []).filter(s => s.length);
    if (!pts.length) return 0;
    this.list.push({c, s:src || 'cal', e:evalStrokes(pts).e});
    const same = this.list.filter(x => x.c === c);
    if (same.length > this.MAX){ const v = same.find(x => x.s !== 'cal') || same[0]; this.list.splice(this.list.indexOf(v), 1); }
    this._save(); return 1;
  },
  clear(){ this.list = []; this._save(); },
  count(cls){ if (cls === undefined) return this.list.length; const c = SHOW_TO_CLS[cls] || cls; return this.list.filter(x => x.c === c).length; },
  boost(p, e){
    if (!this.list.length || !e) return p;
    const best = new Float64Array(p.length).fill(-1);
    for (const x of this.list){ const k = CIDX[x.c], v = x.e; let s = 0; for (let i = 0; i < v.length; i++) s += e[i] * v[i]; if (s > best[k]) best[k] = s; }
    const out = Float64Array.from(p); let tot = 0;
    for (let k = 0; k < out.length; k++){ if (best[k] > -1) out[k] += this.L * Math.exp((best[k] - 1) / this.T); tot += out[k]; }
    for (let k = 0; k < out.length; k++) out[k] /= tot;
    return out;
  },
  onChange(f){ this.subs.push(f); }
};

/* ---------------- Zeichenklassen: Lage auf der Zeile ----------------
   [oben, unten] in Geviert (em) relativ zur Grundlinie, y nach unten */
const VT = {x:[-0.5, 0], i:[-0.68, 0], j:[-0.68, 0.25], a:[-0.75, 0], d:[-0.5, 0.25], ad:[-0.75, 0.25], op:[-0.58, -0.04], eq:[-0.45, -0.17], big:[-1.05, 0.35], sum:[-0.85, 0.12], hi:[-0.8, -0.45]};
const VTYPE = {};
for (const c of 'acemnrsuvwxzακεινπστωo∞') VTYPE[c] = 'x';
VTYPE.i = 'i'; VTYPE['ι'] = 'x';
for (const c of 'bdhklt0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZδθλħ∂ΔΦΨΩΘΓΛΞΠ!∇↑↓†?') VTYPE[c] = 'a';
for (const c of 'gpqyγημρχ') VTYPE[c] = 'd';
for (const c of 'fβζξφψ()[]{}|⟨⟩/') VTYPE[c] = 'ad';
VTYPE.j = 'j';
for (const c of '+⊗*') VTYPE[c] = 'op';
VTYPE.pm = 'op'; VTYPE['='] = 'eq'; VTYPE['∫'] = 'big'; VTYPE['Σ'] = 'sum'; VTYPE.sqrt = 'a'; VTYPE["'"] = 'hi';
const vtype = c => VTYPE[c] || 'a';
const isDigit = c => /^[0-9]$/.test(c);
const isLetterC = c => /^[A-Za-zα-ωΑ-Ωħ]$/.test(c) && c !== 'Σ';
const OPEN = new Set(['(', '[', '{', '⟨']), CLOSE = new Set([')', ']', '}', '⟩']);
const FUNCWORDS = ['arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh', 'coth', 'sin', 'cos', 'tan', 'cot', 'exp', 'ln', 'log', 'det', 'tr', 'Tr', 'Re', 'Im', 'erf', 'sgn'];
const WORDCH = {'0':'o', 'S':'s', 'C':'c'};

/* ---------------- Zusammenhang der Aufgabe ---------------- */
const BASE_PRIOR = {x:.8, i:.8, e:.8, d:.7, t:.5, n:.55, k:.55, m:.55, a:.5, r:.45, s:.3, c:.45, q:.25, b:.25, f:.35, g:.25, h:.12, j:.2, l:.25, p:.3, u:.25, v:.2, w:.1, y:.3, z:.2,
  A:.45, B:.35, C:.35, D:.1, E:.45, F:.1, H:.35, L:.35, M:.12, N:.3, P:.3, R:.25, S:.3, T:.25, V:.35,
  'ψ':.6, 'φ':.4, 'π':.6, 'ħ':.85, 'ω':.35, 'θ':.35, 'λ':.35, 'σ':.35, 'κ':.25, 'α':.25, 'β':.2, 'γ':.12, 'δ':.2, 'ε':.15, 'μ':.12, 'ν':.1, 'ξ':.12, 'ρ':.12, 'τ':.2, 'χ':.25, 'Δ':.35, 'Φ':.12, 'Ψ':.35, 'Ω':.05};
const SYM_PRIOR = {'⊗':.25, '∇':.25, '↑':.2, '↓':.2, '!':.3, '{':.25, '}':.25, '/':.5, '†':.5, pm:.35, '*':.5, "'":.8, '∫':1, 'Σ':.7, '∂':.8, '∞':.9, '.':.5, ',':.7, '[':.6, ']':.6, sqrt:.9};
const GREEK_PAIRS = [['ω', 'w'], ['ν', 'v'], ['κ', 'k'], ['ρ', 'p'], ['ε', 'e']];
function lettersOf(src, set){
  if (src == null) return;
  if (typeof src !== 'string'){ if (typeof src === 'object' && src.t){ walkAst(src, set); } return; }
  try { for (const t of lex(src)) if (t.k === 'id' && !t.fn){ set.add(t.v); if (t.autoSub) for (const ch of t.autoSub) set.add(ch); } } catch(e){ for (const ch of src) if (isLetterC(ch)) set.add(ch); }
}
function walkAst(n, set){
  if (!n || typeof n !== 'object') return;
  if (Array.isArray(n)){ n.forEach(x => walkAst(x, set)); return; }
  if (n.t === 'sym' && typeof n.name === 'string') for (const ch of n.name) if (isLetterC(ch)) set.add(ch);
  for (const k of Object.keys(n)) if (k !== 't' && n[k] && typeof n[k] === 'object') walkAst(n[k], set);
}
/* Texte der Aufgabe zu einem Kontext (gleiches spec-Objekt in TOPICS): Titel, Aufgabentext, Aufforderungen der Ziele – keine Musterlösungen */
let SPEC_TEXT = null;
function specTexts(spec){
  if (!spec || typeof TOPICS === 'undefined' || !Array.isArray(TOPICS)) return [];
  if (!SPEC_TEXT){
    SPEC_TEXT = new Map();
    const add = (sp, txt) => { if (!sp || typeof sp !== 'object') return; const a = SPEC_TEXT.get(sp) || []; txt.forEach(t => { if (t) a.push(String(t)); }); SPEC_TEXT.set(sp, a); };
    const task = t => { if (!t || !t.ctx) return; add(t.ctx, [t.title, t.text].concat((t.goals || []).map(g => g.prompt))); };
    try {
      for (const T of TOPICS){
        (T.practice || []).forEach(task); (T.final || []).forEach(f => f && f.task && task(f.task));
        if (T.example){ add(T.example.ctx, [T.example.title, T.example.text]); if (T.example.faded) task(T.example.faded); }
        if (T.compare) add(T.compare.ctx, [T.compare.text]);
        (T.errors || []).forEach(e => add(e.ctx, [e.text, e.fix && e.fix.prompt]));
      }
    } catch(e){}
  }
  return SPEC_TEXT.get(spec) || [];
}
function inkContext(tc, extra){
  const L = new Set(), funcs = new Set(typeof DEFAULT_FUNCS !== 'undefined' ? DEFAULT_FUNCS : []), coords = new Set();
  let pctx = {}, dag = false, spin = false;
  if (tc){
    pctx = tc.pctx || {};
    const sp = tc.spec || {};
    (tc.coords || sp.coords || ['x']).forEach(c => { coords.add(c); L.add(c); });
    for (const k of Object.keys(tc.params || sp.params || {})) lettersOf(k, L);
    for (const [k, v] of Object.entries(sp.defs || {})){ lettersOf(k.replace(/\(.*\)$/, ''), L); lettersOf(typeof v === 'string' ? v : '', L); }
    for (const [k, v] of Object.entries(sp.unknowns || {})){ lettersOf(k, L); (Array.isArray(v.ref) ? v.ref : [v.ref]).concat(v.alt || []).forEach(x => lettersOf(typeof x === 'string' ? x : '', L)); }
    for (const [k, v] of Object.entries(sp.states || {})){ lettersOf(k, L); lettersOf(v, L); }
    for (const [k, v] of Object.entries(sp.ops || {})){ lettersOf(k, L); lettersOf(v, L); dag = true; }
    for (const k of Object.keys(sp.abstract || {})){ lettersOf(k, L); funcs.add(k); }
    if (sp.state) lettersOf(sp.state, L);
    if (pctx.funcs) for (const f of pctx.funcs) if (!/_/.test(f)) funcs.add(f);
    if (sp.domain) for (const v of Object.values(sp.domain)) (v || []).forEach(s => lettersOf(s, L));
    const mp = sp.mat && sp.mat.preset;
    if (sp.rep === 'mat'){
      if (mp === 'osc'){ dag = true; ['a', 'n', 'm', 'x', 'p', 'ω', 'H', 'N'].forEach(c => L.add(c)); }
      else if (mp === 'jm'){ dag = true; ['l', 'm', 'L', 'J', 'j', 'z'].forEach(c => L.add(c)); }
      else { spin = true; ['σ', 'S', 'χ', 'z', 'y', 'x', 'I'].forEach(c => L.add(c)); }
      for (const [k, v] of Object.entries((sp.mat && sp.mat.mats) || {})){ lettersOf(k, L); lettersOf(v, L); }
    }
  }
  if (tc && tc.spec) specTexts(tc.spec).forEach(t => (String(t).match(/\$[^$]+\$/g) || []).forEach(m => lettersOf(m.slice(1, -1), L)));
  if (extra) (Array.isArray(extra) ? extra : [extra]).forEach(s => lettersOf(String(s || '').replace(/\$/g, ' '), L));
  return {pctx, letters:L, funcs, coords, dag, spin, has:tc ? true : false, _W:null, _Wsig:null};
}
/* Buchstaben, die in der Eingabesprache immer vorkommen, und Buchstaben der Funktionswörter */
const COMMON_LET = {i:1, e:0.9, d:0.8, 'π':0.9, 'ħ':0.9};
const FN_LET = new Set('sincoxpltaghrdRIm'.split(''));
function classWeights(rctx){
  const sig = (MODEL ? MODEL.sig : 'oracle') + ':' + (rctx.wOther || '') + ':' + (rctx.wFn || '');
  if (rctx._W && rctx._Wsig === sig) return rctx._W;
  const wOther = rctx.wOther !== undefined ? rctx.wOther : 0.04, wFn = rctx.wFn !== undefined ? rctx.wFn : 0.15;
  const W = {}, L = rctx.letters;
  const cls = MODEL ? CLASSES : Object.keys(BASE_PRIOR).concat('0123456789'.split(''), Object.keys(SYM_PRIOR), ['(', ')', '+', '-', '=', '|', '⟨', '⟩']);
  for (const c of cls){
    if (isDigit(c)) W[c] = 1;
    /* Buchstaben der Aufgabe (und Zeilen darüber) voll, übliche Buchstaben fast voll, Funktionswort-Buchstaben mäßig, andere stark abgewertet
       (nicht verboten: neue Abkürzung am Zeilenanfang bekommt in der Suche einen Ausgleich) */
    else if (isLetterC(c)) W[c] = L.has(c) ? 1 : COMMON_LET[c] !== undefined ? COMMON_LET[c] : FN_LET.has(c) ? wFn : wOther;
    else W[c] = SYM_PRIOR[c] !== undefined ? SYM_PRIOR[c] : 1;
  }
  for (const [g, l] of GREEK_PAIRS){
    const hg = L.has(g), hl = L.has(l) || (l === 'e');
    if (hg && !L.has(l)){ W[g] = 1; W[l] = Math.min(W[l] || 1, l === 'e' ? 0.35 : 0.08); }
    else if (!hg) W[g] = Math.min(W[g] || 1, wOther);
    else if (hl) W[g] = Math.min(W[g] || 1, 0.5);
  }
  if (rctx.dag) W['†'] = 1;
  if (rctx.spin){ W['↑'] = 0.8; W['↓'] = 0.8; }
  if (L.has('h') === false) W.h = Math.min(W.h || 1, wFn * 0.5);
  rctx._W = W; rctx._Wsig = sig;
  return W;
}

/* ---------------- Geometrie ---------------- */
/* Schräglage: x' = x − k·y (k = mittleres dx/dy fast senkrechter Abschnitte); nur für Lage und Rechtecke */
function slantOf(strokes){
  const v = [];
  for (const st of strokes) for (let k = 1; k < st.length; k++){ const dx = st[k].x - st[k - 1].x, dy = st[k].y - st[k - 1].y; if (Math.abs(dy) > 2.2 * Math.abs(dx) && Math.abs(dy) > 0.3){ const L = Math.abs(dy); v.push([dx / dy, L]); } }
  if (v.length < 6) return 0;
  v.sort((a, b) => a[0] - b[0]);
  const tot = v.reduce((s, x) => s + x[1], 0); let acc = 0;
  for (const [r, L] of v){ acc += L; if (acc >= tot / 2) return Math.max(-0.35, Math.min(0.35, r)); }
  return 0;
}
function sInfo(pts, i, k){
  k = k || 0;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, len = 0;
  for (let q = 0; q < pts.length; q++){ const p = pts[q], X = p.x - k * p.y; if (X < x0) x0 = X; if (X > x1) x1 = X; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y; if (q) len += Math.hypot(p.x - pts[q - 1].x, p.y - pts[q - 1].y); }
  const a = pts[0], b = pts[pts.length - 1];
  /* pd: aufrecht gerechnete Punkte für Formprüfungen; pts bleibt für das Netz */
  const pd = k ? pts.map(p => ({x:p.x - k * p.y, y:p.y})) : pts;
  return {pts, pd, i, x0, y0, x1, y1, w:x1 - x0, h:y1 - y0, cx:(x0 + x1) / 2, cy:(y0 + y1) / 2, len, chord:Math.hypot(b.x - a.x, b.y - a.y)};
}
const median = a => { if (!a.length) return NaN; const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const pct = (a, q) => { if (!a.length) return NaN; const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
function box(list){ const b = {x0:Infinity, y0:Infinity, x1:-Infinity, y1:-Infinity}; for (const o of list){ if (o.x0 < b.x0) b.x0 = o.x0; if (o.y0 < b.y0) b.y0 = o.y0; if (o.x1 > b.x1) b.x1 = o.x1; if (o.y1 > b.y1) b.y1 = o.y1; } b.w = b.x1 - b.x0; b.h = b.y1 - b.y0; b.cx = (b.x0 + b.x1) / 2; b.cy = (b.y0 + b.y1) / 2; return b; }
function segDist(p, a, b){ const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy; const t = L ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / L)) : 0; return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy); }
function polyDist(P, Q){
  let d = Infinity;
  const step = Math.max(1, Math.floor(P.length / 24));
  for (let k = 0; k < P.length; k += step){ const p = P[k]; if (Q.length === 1) d = Math.min(d, Math.hypot(p.x - Q[0].x, p.y - Q[0].y)); for (let i = 1; i < Q.length; i++) d = Math.min(d, segDist(p, Q[i - 1], Q[i])); }
  return d;
}
const strokeDist = (a, b) => Math.min(polyDist(a.pd || a.pts, b.pd || b.pts), polyDist(b.pd || b.pts, a.pd || a.pts));
const isFlat = (s, H) => s.h < 0.28 * Math.max(s.w, 1) && s.h < 0.35 * H;
const isTiny = (s, H) => Math.max(s.w, s.h) < 0.16 * H;
/* kurzer, sehr flacher, gerader Strich */
const isMinusShape = (s, H) => s.h < 0.16 * s.w + 0.03 * H && s.w > 0.2 * H && s.w < 2.5 * H && s.len < 1.25 * Math.max(s.chord, 1);
/* Klammerform eines hohen Strichs: Bauch links „(“, rechts „)“, gerade „|“ (wie brKind der Mathe-App) */
function brKind(s){
  const pts = s.pd || s.pts, cyM = (s.y0 + s.y1) / 2;
  let mid = pts[0]; for (const p of pts) if (Math.abs(p.y - cyM) < Math.abs(mid.y - cyM)) mid = p;
  const a = pts[0], b = pts[pts.length - 1], d = mid.x - (a.x + b.x) / 2;
  return d < -0.06 * s.h ? '(' : d > 0.06 * s.h ? ')' : '|';
}
/* Wurzelzeichen: Haken links unten, Überstrich nach rechts oben (ein Strich) */
function isRadicalShape(r, H){
  const pts = r.pd || r.pts, last = pts[pts.length - 1];
  let lo = pts[0]; for (const p of pts) if (p.y > lo.y) lo = p;
  return r.w > 0.8 * H && r.h > 0.5 * H && last.y < r.y0 + 0.25 * r.h && last.x > r.x1 - 0.15 * r.w && lo.x < r.x0 + 0.5 * r.w && r.len / Math.max(r.chord, 1) > 1.2 && overbarLen(r) > 0.3 * r.w;
}
function overbarLen(r){ const pts = r.pd || r.pts; let k = pts.length - 1; const yTop = r.y0 + 0.2 * r.h; while (k > 0 && pts[k - 1].y <= yTop) k--; return pts[pts.length - 1].x - pts[k].x; }
/* Haken √ ohne Überstrich (Überstrich als eigener Strich) */
function isCheckShape(r, H){
  const pts = r.pd || r.pts, last = pts[pts.length - 1], first = pts[0];
  let lo = pts[0]; for (const p of pts) if (p.y > lo.y) lo = p;
  return r.h > 0.5 * H && r.w > 0.25 * H && last.y < r.y0 + 0.2 * r.h && last.x > r.x1 - 0.15 * r.w && lo.x < r.x0 + 0.55 * r.w && lo.y > r.y1 - 0.15 * r.h && first.x < lo.x && first.y < lo.y;
}
/* Dach ^ über einem Buchstaben: kleiner Winkel mit Spitze oben */
function isHatShape(s, H){
  const P = s.pd || s.pts;
  if (P.length < 3 || s.w > 0.9 * H || s.w < 0.12 * H || s.h > 0.5 * H || s.h < 0.08 * H) return false;
  let top = P[0], ti = 0; P.forEach((p, i) => { if (p.y < top.y){ top = p; ti = i; } });
  const a = P[0], b = P[P.length - 1];
  return ti > 0 && ti < P.length - 1 && top.x > s.x0 + 0.2 * s.w && top.x < s.x1 - 0.2 * s.w && a.y > top.y + 0.5 * s.h && b.y > top.y + 0.5 * s.h && Math.abs(a.x - b.x) > 0.6 * s.w;
}

/* ---------------- Klassifikation einer Strichgruppe ---------------- */
function classify(sts, R){
  const pts = sts.map(s => s.pts);
  let alts;
  if (R.rctx.oracle){ alts = R.rctx.oracle(pts) || [['?', 0.01]]; }
  else {
    const r = evalStrokes(pts), p = HANDQ.boost(r.p, r.e), W = R.W;
    const sc = []; let tot = 0;
    for (let k = 0; k < p.length; k++){ const c = CLASSES[k], v = p[k] * (W[c] !== undefined ? W[c] : 1); sc.push([c, v]); tot += v; }
    tot = tot || 1;
    alts = sc.map(([c, v]) => [c, v / tot]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    alts.raw = r.p;
  }
  return alts;
}

/* ---------------- Strukturen finden ---------------- */
function estimateH(S){
  const hs = S.filter(s => !(s.h < 0.28 * Math.max(s.w, 1))).map(s => Math.max(s.h, 0.5 * s.w));
  if (!hs.length) return Math.max(14, median(S.map(s => s.w)) || 14);
  const md = median(hs);
  const ok = hs.filter(h => h < 2.2 * md && h > 0.25 * md);
  return Math.max(10, pct(ok.length ? ok : hs, 0.8));
}
/* Bruchstrich: flach, oder lang, gerade und höchstens leicht schräg (echte Striche steigen oft an) */
const isBarShape = (s, H) => isFlat(s, H) || (s.w > 1.0 * H && s.h < 0.25 * s.w && s.len < 1.15 * Math.max(s.chord, 1));
/* Höhe des (ggf. schrägen) Bruchstrichs an der Stelle x */
function barLine(bar){
  const P = bar.pd || bar.pts;
  let a = P[0], b = P[0]; for (const p of P){ if (p.x < a.x) a = p; if (p.x > b.x) b = p; }
  const k = b.x > a.x ? (b.y - a.y) / (b.x - a.x) : 0;
  return x => a.y + k * (x - a.x);
}
/* Bruchstriche: darüber und darunter Zeichen; Abstände an CROHME-Trainingsausdrücken geprüft
   (Nenner/Zähler bis 1,25 Zeichenhöhen vom Strich, Nenner oft breiter als der Strich, Strich oft schräg) */
function fracParts(bar, pool, H, tight){
  const ext = 0.06 * bar.w + 0.08 * H, by = barLine(bar);
  /* kleine Striche (Hochzahl, Punkt) des Zeichens davor/danach nicht mitnehmen */
  const inX = o => Math.max(o.w, o.h) < 0.5 * H ? o.cx >= bar.x0 + 0.02 * bar.w && o.cx <= bar.x1 - 0.02 * bar.w
    : o.cx >= bar.x0 - ext && o.cx <= bar.x1 + ext && o.x0 >= bar.x0 - 0.4 * H - 0.2 * bar.w && o.x1 <= bar.x1 + 0.4 * H + 0.2 * bar.w;
  const dUp = o => by(o.cx) - o.y1, dDn = o => o.y0 - by(o.cx);
  let above = pool.filter(o => o !== bar && !o.bigop && inX(o) && o.cy < by(o.cx) && dUp(o) >= -0.25 * H && by(o.cx) - o.cy < 2.6 * H);
  let below = pool.filter(o => o !== bar && !o.bigop && inX(o) && o.cy > by(o.cx) && dDn(o) >= -0.25 * H && o.cy - by(o.cx) < 2.6 * H);
  /* zusammenhängend vom Strich aus: nächste zuerst */
  const first = tight ? 0.7 : 1.25;
  const chain = (arr, up) => {
    const dist = up ? dUp : dDn, far = o => up ? by(o.cx) - o.y0 : o.y1 - by(o.cx);
    const srt = arr.slice().sort((a, b) => dist(a) - dist(b));
    const out = []; let edge = 0;
    for (const o of srt){ const gap = dist(o) - edge; if (gap > (out.length ? (tight ? 0.3 : 0.6) : first) * H) break; out.push(o); edge = Math.max(edge, far(o)); }
    return out;
  };
  /* Bruch als Grenze rechts an ∫/Σ: nicht über die Mitte des Operators hinaus (dort steht die andere Grenze) */
  const op = pool.find(o => o.bigop && o.x1 > bar.x0 - 0.8 * H && o.x1 < bar.x0 + 0.4 * H && bar.cy > o.y0 - 0.5 * H && bar.cy < o.y1 + 0.5 * H && (bar.cy < o.y0 + 0.3 * o.h || bar.cy > o.y1 - 0.3 * o.h));
  if (op){ if (bar.cy < op.cy) below = below.filter(o => o.y1 < op.cy + 0.1 * H); else above = above.filter(o => o.y0 > op.cy - 0.1 * H); }
  above = chain(above, true); below = chain(below, false);
  /* Zähler/Nenner seitlich fortsetzen: nächster Strich neben dem Block, ganz auf derselben Seite, kleine Lücke;
     nicht, wenn dazwischen oder darunter/darüber ein Zeichen auf Höhe des Strichs steht (Hochzahl/Index/i-Punkt eines Zeichens außerhalb) */
  const extend = (arr, up) => {
    if (tight || !arr.length) return arr;
    for (let guard = 0; guard < 12; guard++){
      const b = box(arr); let add = null;
      for (const dir of [1, -1]){
        let best = null, bd = Infinity;
        for (const o of pool){
          if (o === bar || o.bigop || arr.includes(o) || above.includes(o) || below.includes(o)) continue;
          if (!(o.cy > b.y0 - 0.5 * H && o.cy < b.y1 + 0.5 * H)) continue;     /* auch Hoch-/Tiefgestelltes am Blockende */
          const gap = dir > 0 ? o.x0 - b.x1 : b.x0 - o.x1;
          if ((gap > -0.25 * H || (o.cx > b.x0 && o.cx < b.x1)) && gap < bd){ bd = gap; best = o; }     /* auch Striche im schon erweiterten Block (Querstrich des A) */
        }
        if (!best || bd > 0.6 * H) continue;
        if (!(up ? best.y1 < by(best.cx) - 0.08 * H : best.y0 > by(best.cx) + 0.08 * H)) continue;
        /* Grenzen eines ∫/Σ links davon gehören nicht zum Bruch */
        if (pool.some(q => q.bigop && best.x0 > q.x0 - 0.2 * H && best.x0 < q.x1 + 1.5 * H && (best.y0 > q.y1 - 0.35 * q.h || best.y1 < q.y0 + 0.35 * q.h))) continue;
        const lo = dir > 0 ? b.x1 - 0.1 * H : best.x0 - 0.2 * H, hi = dir > 0 ? best.x1 + 0.2 * H : b.x0 + 0.1 * H;
        const foreign = pool.some(q => q !== bar && q !== best && !arr.includes(q) && !above.includes(q) && !below.includes(q) && q.x1 > lo && q.x0 < hi && (up ? q.y1 > by(q.cx) - 0.05 * H : q.y0 < by(q.cx) + 0.05 * H) && Math.abs(q.cy - by(q.cx)) < 1.3 * H);
        if (foreign) continue;
        add = best; break;
      }
      if (!add) break;
      arr.push(add);
    }
    return arr;
  };
  above = extend(above, true); below = extend(below, false);
  /* ein Bruchstrich berührt Zähler und Nenner nicht (Querstrich von σ, Σ, π, ±, 4, τ …) */
  /* gilt, wenn ein Strich den Strich kreuzt oder an einem Ende ansetzt; Zähler/Nenner dürfen in der Mitte nahe kommen */
  const touch = o => {
    if (!(o.y1 > by(o.cx) - 0.4 * H && o.y0 < by(o.cx) + 0.4 * H)) return false;
    const P = o.pd || o.pts, Q = bar.pd || bar.pts;
    let up = false, dn = false;
    for (const p of P) if (p.x > bar.x0 && p.x < bar.x1){ if (p.y < by(p.x) - 0.08 * H) up = true; if (p.y > by(p.x) + 0.08 * H) dn = true; }
    if (up && dn) return true;
    const ends = [Q[0], Q[Q.length - 1]].sort((a, b) => a.x - b.x), m = 0.15 * bar.w;
    for (const p of P) if (Math.hypot(p.x - ends[0].x, p.y - ends[0].y) < 0.07 * H + 0.05 * m || Math.hypot(p.x - ends[1].x, p.y - ends[1].y) < 0.07 * H + 0.05 * m) return true;
    return false;
  };
  if (above.some(touch) || below.some(touch)) return null;
  const real = arr => arr.some(o => !isFlat(o, H) && !isTiny(o, H));
  if (!above.length || !below.length || !real(above) || !real(below)) return null;
  const ba = box(above), bb = box(below);
  if (bar.w < 0.62 * Math.max(ba.w, bb.w)) return null;
  if (Math.min(...above.map(dUp)) > first * H || Math.min(...below.map(dDn)) > first * H) return null;
  return {above, below};
}
/* Inhalt in Zeilen teilen (Matrizen/Spaltenvektoren); Brüche bleiben eine Einheit */
function matrixRows(C, H){
  const units = [];
  const used = new Set();
  C.filter(s => isFlat(s, H) && s.w > 0.45 * H).sort((a, b) => b.w - a.w).forEach(bar => {
    if (used.has(bar)) return;
    const fp = fracParts(bar, C.filter(o => !used.has(o)), H, true);
    if (!fp) return;
    const m = [bar, ...fp.above, ...fp.below]; m.forEach(o => used.add(o));
    units.push(Object.assign(box(m), {st:m}));
  });
  C.forEach(s => { if (!used.has(s)) units.push(Object.assign(box([s]), {st:[s]})); });
  const us = units.slice().sort((a, b) => a.y0 - b.y0), tol = 0.12 * H;
  const rows = [];
  for (const u of us){
    const r = rows[rows.length - 1];
    /* kleine Striche (Punkte, Hochzahlen) gehören zur Zeile, in der sie liegen */
    if (r && (u.y0 <= r.y1 - tol || (u.cy <= r.y1 + tol && u.h < 0.5 * H))){ r.u.push(u); r.y1 = Math.max(r.y1, u.y1); }
    else rows.push({y0:u.y0, y1:u.y1, u:[u]});
  }
  /* Zeile nur aus kleinen Strichen (Dach, Punkt) über der nächsten: dazu nehmen */
  for (let k = rows.length - 2; k >= 0; k--){
    if (!rows[k].u.some(u => u.h > 0.35 * H) && rows[k + 1].y0 - rows[k].y1 < 0.45 * H){ rows[k + 1].u.push(...rows[k].u); rows[k + 1].y0 = rows[k].y0; rows.splice(k, 1); }
  }
  return rows;
}
function matrixCols(rows, H){
  /* Spalten: senkrechte Lücken, die in allen Zeilen frei sind */
  const iv = [];
  rows.forEach(r => r.u.forEach(u => iv.push([u.x0, u.x1])));
  iv.sort((a, b) => a[0] - b[0]);
  const gaps = []; let end = iv[0][1];
  for (let k = 1; k < iv.length; k++){ if (iv[k][0] > end) gaps.push({x0:end, x1:iv[k][0], w:iv[k][0] - end}); end = Math.max(end, iv[k][1]); }
  /* Lücke innerhalb einer Zeile zwischen Zeichen eines Eintrags ist klein; Spaltenlücke groß */
  const inRow = [];
  rows.forEach(r => { const xs = r.u.slice().sort((a, b) => a.x0 - b.x0); let e = xs[0].x1; for (let k = 1; k < xs.length; k++){ if (xs[k].x0 > e) inRow.push(xs[k].x0 - e); e = Math.max(e, xs[k].x1); } });
  /* Lücken innerhalb eines Eintrags (auch um Rechenzeichen) sind klein; Spaltenlücken deutlich größer */
  const thr = Math.max(0.5 * H, 1.5 * (median(inRow.filter(g => g < 0.45 * H)) || 0));
  let cut = gaps.filter(g => g.w >= thr).map(g => (g.x0 + g.x1) / 2);
  const cells = () => rows.map(r => { const c = cut.map(() => []).concat([[]]); r.u.forEach(u => { let k = 0; while (k < cut.length && u.cx > cut[k]) k++; c[k].push(...u.st); }); return c; });
  let M = cells();
  while (cut.length && M.some(r => r.some(c => !c.length))){
    /* schmalste Lücke streichen, bis jede Zelle besetzt ist */
    const ws = cut.map(x => (gaps.find(g => (g.x0 + g.x1) / 2 === x) || {w:0}).w);
    cut.splice(ws.indexOf(Math.min(...ws)), 1); M = cells();
  }
  return M;
}

/* Strichzahl je Klasse (P(n | Klasse), n = 1, 2, 3, ≥4) aus CROHME-Trainingsausdrücken (test/ink/build_nstrokes.js) */
const NSTROKES = {"0":[0.98,0.016,0.001,0.003],"1":[0.954,0.042,0.003,0],"2":[0.983,0.016,0,0],"3":[0.993,0.004,0.001,0.002],"4":[0.348,0.637,0.008,0.008],"5":[0.254,0.732,0.013,0.001],"6":[0.992,0.005,0.002,0.002],"7":[0.147,0.846,0.002,0.005],"8":[0.958,0.038,0.002,0.002],"9":[0.951,0.046,0.002,0.002],"p":[0.661,0.315,0.017,0.007],"c":[0.951,0.043,0.004,0.001],"=":[0.004,0.97,0.013,0.012],"a":[0.887,0.102,0.006,0.005],"+":[0.007,0.969,0.014,0.01],"b":[0.906,0.08,0.008,0.006],"-":[0.985,0.014,0.001,0],"C":[0.9,0.087,0.007,0.007],"\\cos":[0.074,0.103,0.773,0.05],"d":[0.896,0.093,0.009,0.001],"n":[0.923,0.073,0.003,0.001],"!":[0.014,0.903,0.069,0.014],"o":[0.963,0.012,0.012,0.012],"θ":[0.342,0.626,0.011,0.021],"\\leq":[0.007,0.908,0.077,0.007],"(":[0.992,0.007,0,0],")":[0.993,0.007,0,0],"∫":[0.993,0.002,0.002,0.002],"∞":[0.95,0.035,0.012,0.004],"f":[0.396,0.561,0.041,0.002],"x":[0.098,0.893,0.008,0.001],"\\lim":[0.005,0.163,0.121,0.711],"\\rightarrow":[0.047,0.943,0.005,0.005],"A":[0.039,0.534,0.365,0.062],"sqrt":[0.86,0.13,0.009,0.001],"u":[0.947,0.043,0.005,0.005],",":[0.992,0.003,0.003,0.003],"\\times":[0.007,0.985,0.007,0.002],"\\div":[0.094,0.094,0.698,0.115],"\\geq":[0.029,0.913,0.048,0.01],"e":[0.991,0.003,0.003,0.003],"r":[0.896,0.097,0.003,0.003],"z":[0.524,0.473,0.001,0.001],"β":[0.675,0.297,0.014,0.014],"M":[0.643,0.329,0.014,0.014],"F":[0.008,0.093,0.839,0.059],"y":[0.796,0.201,0.003,0.001],"G":[0.486,0.431,0.069,0.014],"H":[0.056,0.13,0.796,0.019],"R":[0.408,0.485,0.023,0.085],"g":[0.909,0.073,0.004,0.013],"\\log":[0.062,0.211,0.707,0.021],"m":[0.918,0.046,0.027,0.009],"X":[0.023,0.967,0.005,0.005],"q":[0.605,0.341,0.032,0.023],"π":[0.014,0.059,0.918,0.008],"\\sin":[0.002,0.028,0.113,0.857],"Σ":[0.471,0.485,0.037,0.007],"i":[0.021,0.941,0.033,0.005],"v":[0.973,0.016,0.005,0.005],"k":[0.515,0.324,0.148,0.013],"L":[0.969,0.01,0.01,0.01],"w":[0.944,0.011,0.011,0.033],"P":[0.345,0.536,0.083,0.036],"/":[0.96,0.024,0.008,0.008],"\\neq":[0.012,0.012,0.915,0.061],"t":[0.088,0.9,0.01,0.002],"φ":[0.021,0.854,0.104,0.021],"γ":[0.893,0.083,0.012,0.012],".":[0.956,0.04,0.002,0.002],"\\tan":[0.015,0.044,0.221,0.721],"α":[0.966,0.026,0.004,0.004],"⟨":[0.869,0.107,0.012,0.012],"V":[0.94,0.036,0.012,0.012],"E":[0.01,0.125,0.471,0.394],"[":[0.549,0.424,0.021,0.007],"]":[0.938,0.049,0.007,0.007],"h":[0.923,0.066,0.005,0.005],"j":[0.05,0.877,0.041,0.032],"\\ldots":[0.011,0.011,0.883,0.096],"Y":[0.108,0.814,0.069,0.01],"|":[0.963,0.03,0.003,0.003],"'":[0.926,0.044,0.015,0.015],"l":[0.929,0.043,0.014,0.014],"s":[0.951,0.035,0.007,0.007],"pm":[0.01,0.01,0.93,0.05],"S":[0.893,0.083,0.012,0.012],"B":[0.316,0.603,0.04,0.04],"N":[0.67,0.284,0.034,0.011],"T":[0.044,0.926,0.015,0.015],"σ":[0.94,0.02,0.02,0.02],"⟩":[0.942,0.019,0.019,0.019],"I":[0.145,0.113,0.694,0.048],"{":[0.935,0.022,0.022,0.022],"}":[0.935,0.022,0.022,0.022]};
function nStrokePen(c, n){ const t = NSTROKES[c]; if (!t) return 0; const p = t[Math.min(4, n) - 1], m = Math.max(...t); return Math.max(-4, Math.log(p / m)); }
/* ---------------- Strichgruppen → Zeichen ---------------- */
function near(a, b, H){
  const gx = Math.max(a.x0, b.x0) - Math.min(a.x1, b.x1), gy = Math.max(a.y0, b.y0) - Math.min(a.y1, b.y1);
  /* Punkt (i, j) darf durch Schräglage seitlich versetzt sein */
  if (isTiny(a, H) || isTiny(b, H)){
    const d = isTiny(a, H) ? a : b, o = d === a ? b : a;
    /* i-/j-Punkt hoch über dem Strich */
    if (d.y1 <= o.y0 + 0.1 * H && gx < 0.3 * H && gy < 0.75 * H && o.h > 0.3 * H) return true;
    return gx < 0.28 * H && gy < 0.45 * H;
  }
  return gx < 0.14 * H && gy < 0.42 * H && !(gx > 0 && gy > 0.15 * H);
}
function xOverlapRatio(a, b, H){ const ov = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0); return ov / Math.max(0.15 * H, Math.min(a.w, b.w)); }
/* Zusammengehörigkeit zweier aufeinanderfolgender Striche: kleines Netz 16 → 10 → 1, gelernt an 3000 CROHME-Trainingsausdrücken
   (Testschreiber: 95 % richtig); Erzeugung: test/ink/fit_group.js + fit_group.py */
const GROUPW = {"mu":[-0.82849,0.41533,-0.13421,0.66726,0.49183,0.01742,0.82734,0.79056,0.03984,0.04176,0.23692,0.23987,-0.71117,-0.78053,0.16999,-0.0362],"sd":[1.41494,0.90326,0.54336,0.82181,1.13255,0.59358,0.66098,0.61253,0.19558,0.20004,0.42519,0.42701,1.32723,1.32689,0.37562,0.9447],"W1":[[-0.5403,1.6452,1.5154,-0.6309,0.6427,1.5539,-0.906,0.0586,0.7309,-0.4693,-0.0226,0.2535,-0.2331,0.0695,0.2709,0.5139],[-0.0353,-0.6286,0.5182,-0.2769,-0.0702,1.1436,0.0671,-0.9527,-0.2104,0.6434,0.9526,-0.7959,-0.8305,0.3308,-0.6745,0.5415],[0.0284,-0.7739,-0.7115,1.6777,-0.1223,0.9307,-0.6019,0.2742,-0.2078,0.0418,1.1174,0.6183,0.3268,0.4207,-0.2069,-0.5367],[0.1947,0.8434,0.2253,1.4223,1.6381,0.9549,0.0602,0.2696,-0.0782,0.1986,-0.0456,0.0075,-0.0377,-0.2771,-2.2201,0.5225],[-0.2383,-0.8777,-0.5067,0.2477,-1.773,0.0534,-1.0508,-0.8894,0.145,-0.1899,0.0465,0.1985,0.1756,0.2255,0.42,-0.3844],[-0.1226,-0.244,-0.6775,-0.5022,1.4621,-0.1318,0.3849,-0.6914,0.8835,-0.7346,0.3588,1.1564,-0.3744,0.0684,-0.524,0.3206],[-0.2658,1.1173,0.0234,-0.5841,0.174,0.2316,0.0019,1.0083,0.0182,0.4956,-0.0983,0.3511,1.1108,2.0456,-0.0696,0.213],[-0.7749,0.561,-0.2779,1.0944,-0.7501,-2.6069,-0.0661,0.2538,-0.1181,-0.8003,0.5414,-0.6085,0.0451,0.1226,-0.2922,0.7232],[-0.2051,0.2287,-0.3197,-0.055,0.2826,0.3683,0.9241,-0.4735,0.3208,-0.7052,0.1046,0.038,-1.097,0.0303,0.4598,-0.4982],[0.0393,-1.427,0.7195,1.9472,0.3094,-0.8488,0.1691,0.3566,0.2816,0.0039,-0.6456,0.7169,-0.182,0.706,-1.9406,-0.4718]],"b1":[-0.1519,0.0405,0.4324,0.7533,-2.036,-0.4659,-2.0275,-0.5997,0.4776,0.6013],"W2":[-1.6682,2.0108,-2.0182,-1.4474,2.54,1.9586,2.5741,-1.8876,-1.3125,-2.2586],"b2":1.261};
function pairSame(a, b, H){
  const x = pairFeat(a, b, H), G = GROUPW;
  let z = G.b2;
  for (let j = 0; j < G.b1.length; j++){ let t = G.b1[j]; const w = G.W1[j]; for (let i = 0; i < x.length; i++) t += w[i] * (x[i] - G.mu[i]) / G.sd[i]; z += G.W2[j] * Math.tanh(t); }
  const p = 1 / (1 + Math.exp(-z));
  return Math.min(0.995, Math.max(0.005, p));
}
/* Merkmale eines Strichpaars (a vor b) für die Zusammengehörigkeit; Gewichte GROUPW an echten CROHME-Ausdrücken gelernt (test/ink/fit_group.*) */
const clip = (v, a, b) => v < a ? a : v > b ? b : v;
function pairFeat(a, b, H){
  const ov = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), ovy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
  const d = strokeDist(a, b) / H;
  return [clip(ov / Math.max(0.15 * H, Math.min(a.w, b.w)), -3, 1), clip(-ov / H, -2, 3), clip(-ovy / H, -2, 3), clip(d, 0, 3),
    clip((b.cx - a.cx) / H, -3, 3), clip((b.cy - a.cy) / H, -3, 3), clip(Math.max(a.w, a.h) / H, 0, 4), clip(Math.max(b.w, b.h) / H, 0, 4),
    isTiny(a, H) ? 1 : 0, isTiny(b, H) ? 1 : 0, isFlat(a, H) ? 1 : 0, isFlat(b, H) ? 1 : 0,
    clip(ov / Math.max(0.05 * H, b.w), -3, 1), clip(ov / Math.max(0.05 * H, a.w), -3, 1), d < 0.04 ? 1 : 0, clip(Math.log((Math.max(b.w, b.h) + 0.02 * H) / (Math.max(a.w, a.h) + 0.02 * H)), -3, 3)];
}
/* „=“ aus zwei flachen Strichen ähnlicher Länge übereinander (auch mit großem Abstand oder versetzt) */
const flatBarS = (s, H) => s.w > 0.2 * H && s.w < 2.5 * H && s.h < 0.3 * s.w + 0.05 * H && s.len < 1.3 * Math.max(s.chord, 1);
function stackedBars(a, b, H){
  if (!flatBarS(a, H) || !flatBarS(b, H)) return false;
  const ov = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), dy = Math.abs(a.cy - b.cy), wr = a.w / b.w;
  return ov > 0.5 * Math.min(a.w, b.w) && dy > 0.08 * H && dy < 0.7 * H && wr > 0.45 && wr < 2.2;
}
function groupStrokes(S, R){
  const H = R.H;
  if (!S.length) return [];
  /* Schreibreihenfolge; nachgetragene kleine Striche (i-Punkt, t-Querstrich) hinter ihren Wirt setzen */
  const ord = S.slice().sort((a, b) => a.i - b.i);
  for (let k = 1; k < ord.length; k++){
    const s = ord[k];
    if (near(ord[k - 1], s, H) && xOverlapRatio(ord[k - 1], s, H) > -0.2) continue;
    if (!(Math.max(s.w, s.h) < 0.7 * H || isFlat(s, H))) continue;
    if (ord[k + 1] && near(ord[k + 1], s, H) && !isTiny(s, H)) continue;     /* gehört zum nächsten Zeichen */
    for (let j = k - 2; j >= Math.max(0, k - 10); j--){
      const p = ord[j];
      if (near(p, s, H) && xOverlapRatio(p, s, H) > 0.3){ ord.splice(k, 1); ord.splice(j + 1, 0, s); break; }
    }
  }
  const n = ord.length, best = new Array(n + 1).fill(-Infinity), back = new Array(n + 1).fill(0), cls = new Array(n + 1);
  best[0] = 0;
  /* Bewertung: Netz-Wahrscheinlichkeit der Gruppe (gewichtet) + Zusammengehörigkeit der Nachbarstriche (pairSame)
     innerhalb der Gruppe bzw. Trennung an der Grenze zur vorigen Gruppe */
  const WC = R.wCls !== undefined ? R.wCls : 2.5, WG = R.wGeo !== undefined ? R.wGeo : 1, FLOOR = 0.02;
  const PS = new Array(n).fill(0.5);
  for (let q = 1; q < n; q++) PS[q] = pairSame(ord[q - 1], ord[q], H);
  /* zwei übereinanderliegende kurze flache Striche ähnlicher Länge sind ein „=“, auch weit auseinander oder versetzt */
  for (let q = 1; q < n; q++) if (stackedBars(ord[q - 1], ord[q], H)) PS[q] = Math.max(PS[q], 0.9);
  /* Punkt (i, j), der schon zum Strich davor gehört: der nächste Strich wird gegen diesen Strich bewertet */
  const dotty = s => Math.max(s.w, s.h) < 0.3 * H && s.len < 0.45 * H;
  for (let q = 2; q < n; q++) if (dotty(ord[q - 1]) && PS[q - 1] > 0.5 && !dotty(ord[q - 2]) && ord[q - 1].cy < ord[q - 2].y0 + 0.3 * ord[q - 2].h) PS[q] = Math.min(PS[q], pairSame(ord[q - 2], ord[q], H));
  const unk = alts => alts[0][0] === '?' ? -5 : 0;
  const WN = R.wN !== undefined ? R.wN : 1.2;
  const clsScore = (alts, n) => WC * Math.log(Math.max(alts[0][1], FLOOR)) + unk(alts) + (n ? WN * nStrokePen(alts[0][0], n) : 0);
  for (let i = 1; i <= n; i++){
    for (let k = 1; k <= Math.min(8, i); k++){
      if (best[i - k] === -Infinity) continue;
      const j0 = i - k, g = ord.slice(j0, i);
      if (k > 4){ const bx = box(g); if (bx.w > 1.3 * H || bx.h > 1.6 * H) continue; }
      let geo = j0 > 0 ? Math.log(1 - PS[j0]) : 0, ok = true;
      for (let q = j0 + 1; q < i; q++){ if (PS[q] < 0.002) { ok = false; break; } geo += Math.log(PS[q]); }
      if (!ok) continue;
      geo *= WG;
      if (k > 1){
        /* zusammenhängend als Graph (H: zwei Senkrechte erst über den Querstrich verbunden) */
        const seen = [0], rest = g.slice(1).map((x, q) => q + 1); let grow = true;
        while (grow && rest.length){ grow = false; for (let q = rest.length - 1; q >= 0; q--){ if (seen.some(a => near(g[a], g[rest[q]], H) || (k === 2 && stackedBars(g[a], g[rest[q]], H)))){ seen.push(rest[q]); rest.splice(q, 1); grow = true; } } }
        if (rest.length) continue;
      }
      let alts;
      if (k === 1 && isTiny(g[0], H)) alts = [['.', 0.9]];
      else if (k === 1 && isMinusShape(g[0], H) && PS[j0] < 0.5 && (j0 + 1 >= n || PS[j0 + 1] < 0.5)){
        /* Minus über die Form entscheiden (das Netz streckt einen kurzen flachen Strich auf volle Größe) */
        const net = R.rctx.oracle ? [] : classify(g, R).filter(a => a[0] !== '-').map(a => [a[0], a[1] * 0.1]);
        alts = R.rctx.oracle ? classify(g, R) : [['-', 0.9]].concat(net);
      }
      else alts = classify(g, R);
      const sc = geo + clsScore(alts, k);
      if (best[j0] + sc > best[i]){ best[i] = best[j0] + sc; back[i] = k; cls[i] = alts; }
    }
    if (best[i] === -Infinity){ const g = [ord[i - 1]]; const alts = classify(g, R); best[i] = best[i - 1] + clsScore(alts, 1); back[i] = 1; cls[i] = alts; }
  }
  const G = [];
  for (let i = n; i > 0; i -= back[i]){ const st = ord.slice(i - back[i], i); G.push(Object.assign(box(st), {st, alts:cls[i], tiny:back[i] === 1 && isTiny(st[0], H)})); }
  return G.reverse();
}

/* ---------------- Region erkennen (rekursiv) ---------------- */
function mkSym(g){ return {k:'sym', x0:g.x0, y0:g.y0, x1:g.x1, y1:g.y1, w:g.w, h:g.h, cx:g.cx, cy:g.cy, st:g.st, alts:g.alts.slice(), tiny:!!g.tiny}; }
function recogRegion(S, R, depth){
  const H = R.H, items = [], used = new Set();
  if (!S.length) return [];
  if (depth > 6){ groupStrokes(S, R).forEach(g => items.push(mkSym(g))); return layout(items, R); }
  const avail = () => S.filter(s => !used.has(s));
  /* Dächer über Buchstaben (zuerst, damit sie keine Matrixzeile oder Hochzahl bilden) */
  const hats = [];
  S.forEach(s => {
    if (!isHatShape(s, H)) return;
    const under = S.filter(o => o !== s && !isTiny(o, H) && o.x1 > s.x0 + 0.1 * s.w && o.x0 < s.x1 - 0.1 * s.w && o.y0 > s.cy - 0.05 * H && o.y0 - s.y1 < 0.6 * H && o.y0 > s.y1 - 0.3 * H && (o.h > 0.25 * H || o.w > 0.3 * H));
    /* darunter (oder knapp daneben) steht ein Buchstabe, nicht nur ein flacher Strich: gewölbter oberer Strich eines „=“ ist kein Dach */
    if (!S.some(o => o !== s && !isTiny(o, H) && !isFlat(o, H) && o.x1 > s.x0 - 0.3 * H && o.x0 < s.x1 + 0.3 * H && o.y0 > s.cy - 0.05 * H && o.y0 - s.y1 < 0.6 * H)) return;
    if (under.length && !(R.rctx.oracle && (R.rctx.oracle([s.pts]) || [['?']])[0][0] !== '^')) hats.push(s);
  });
  /* ∫ und Σ (hohe Einzelstriche) gehören nie in Zähler oder Nenner */
  S.forEach(s => { if (s.h > 1.15 * H && s.bigop === undefined){ const a = R.rctx.oracle ? R.rctx.oracle([s.pts]) : classify([s], R); s.bigop = !!(a && (a[0][0] === '∫' || a[0][0] === 'Σ') && a[0][1] > 0.4); } });
  /* Kandidaten großer Strukturen, äußere (breite) zuerst */
  const cands = [];
  /* a) große Klammern → Matrix/Spaltenvektor */
  const bigBr = S.filter(s => s.h >= 1.75 * H && s.w <= 0.5 * s.h && s.h > 0);
  bigBr.forEach(b => { b.bk = brKind(b); });
  const brs = bigBr.slice().sort((a, b) => a.x0 - b.x0), stack = [];
  for (const b of brs){
    if (b.bk === '|') continue;
    if (R.rctx.oracle){ const a = R.rctx.oracle([b.pts]); if (a && !/^[()\[\]]$/.test(a[0][0])) continue; }
    if (b.bk === '(') stack.push(b);
    else if (stack.length){ const L = stack.pop(); const ov = Math.min(L.y1, b.y1) - Math.max(L.y0, b.y0); if (ov > 0.5 * Math.min(L.h, b.h)) cands.push({k:'mat', L, R:b, w:b.x1 - L.x0}); }
  }
  /* b) Bruchstriche */
  S.filter(s => isBarShape(s, H) && s.w > 0.3 * H).forEach(bar => cands.push({k:'frac', bar, w:bar.w}));
  /* c) Wurzeln */
  S.filter(s => s.w > 0.6 * H && s.h > 0.5 * H && !isFlat(s, H)).forEach(r => {
    let isR = isRadicalShape(r, H), bar = null;
    if (!isR && isCheckShape(r, H)){
      const P = r.pd || r.pts, last = P[P.length - 1];
      bar = S.find(b => b !== r && isFlat(b, H) && b.w > 0.5 * H && Math.abs(b.x0 - last.x) < 0.35 * H && Math.abs(b.cy - last.y) < 0.3 * H);
      if (bar) isR = true;
    }
    if (!isR && MODEL && !R.rctx.oracle && CIDX.sqrt !== undefined){ const a = classify([r], R); if (a[0][0] === 'sqrt' && a[0][1] > 0.4) isR = true; }
    if (!isR && R.rctx.oracle){ const a = R.rctx.oracle([r.pts]); if (a && a[0][0] === 'sqrt') isR = true; }
    if (isR) cands.push({k:'sqrt', r, bar, w:(bar ? bar.x1 : r.x1) - r.x0});
  });
  /* einzelner Haken + Überstrich auch für das Orakel */
  S.filter(s => R.rctx.oracle && !isFlat(s, H)).forEach(r => {
    if (cands.some(c => c.k === 'sqrt' && c.r === r)) return;
    const a = R.rctx.oracle([r.pts]);
    if (a && a[0][0] === 'sqrt'){
      const P = r.pd || r.pts, last = P[P.length - 1];
      const bar = S.find(b => b !== r && isFlat(b, H) && Math.abs(b.x0 - last.x) < 0.35 * H && Math.abs(b.cy - last.y) < 0.35 * H);
      cands.push({k:'sqrt', r, bar, w:(bar ? bar.x1 : r.x1) - r.x0});
    }
  });
  /* Bruchstrich über oder unter einer Wurzel (Wurzel im Nenner/Zähler): Bruch zuerst, auch wenn die Wurzel breiter ist */
  cands.forEach(c => {
    if (c.k !== 'frac') return;
    const bar = c.bar;
    for (const q of cands){
      if (q.k !== 'sqrt' || q.bar === bar) continue;
      const r = q.r, x1 = q.bar ? Math.max(r.x1, q.bar.x1) : r.x1, ov = Math.min(bar.x1, x1) - Math.max(bar.x0, r.x0);
      const y0 = q.bar ? Math.min(r.y0, q.bar.y0) : r.y0;
      if (ov > 0.6 * Math.min(bar.w, x1 - r.x0) && (y0 > bar.cy - 0.05 * H || r.y1 < bar.cy + 0.05 * H)) c.w = Math.max(c.w, q.w + 1e-3);
    }
  });
  cands.sort((a, b) => b.w - a.w);
  for (const c of cands){
    if (c.k === 'mat'){
      if (used.has(c.L) || used.has(c.R)) continue;
      const L = c.L, Rb = c.R, top = Math.min(L.y0, Rb.y0) - 0.15 * H, bot = Math.max(L.y1, Rb.y1) + 0.15 * H;
      const C = avail().filter(o => o !== L && o !== Rb && o.cx > L.cx && o.cx < Rb.cx && o.cy > top && o.cy < bot);
      if (!C.length || C.some(o => o.bigop)) continue;
      const rows = matrixRows(C, H);
      /* jede Zeile braucht ein normal großes Zeichen (Hochzahlen und † sind kleiner) und überlappt waagerecht mit den Nachbarzeilen */
      if (rows.length < 2 || rows.some(r => !r.u.some(u => u.h > 0.5 * H && !(u.st.length === 1 && isHatShape(u.st[0], H))))) continue;
      { let bad = false; for (let q = 1; q < rows.length; q++){ const a = box(rows[q - 1].u), b = box(rows[q].u), ov = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0); if (ov < -0.1 * H) bad = true; } if (bad) continue; }
      const cells = matrixCols(rows, H);
      /* Spaltenvektor: Einträge stehen untereinander (eine Hochzahl rechts oben ist keine Zeile) */
      if (cells[0].length === 1){ const cb = box(C), ok = rows.every(r => { const b = box(r.u); return Math.abs(b.cx - cb.cx) < 0.22 * cb.w + 0.25 * H; }); if (!ok) continue; }
      [L, Rb, ...C].forEach(o => used.add(o));
      const it = {k:'mat', x0:L.x0, x1:Rb.x1, y0:Math.min(L.y0, Rb.y0), y1:Math.max(L.y1, Rb.y1), st:[L, Rb], cells:cells.map(r => r.map(cs => recogRegion(cs, R, depth + 1)))};
      Object.assign(it, {w:it.x1 - it.x0, h:it.y1 - it.y0, cx:(it.x0 + it.x1) / 2, cy:(it.y0 + it.y1) / 2});
      items.push(it);
    } else if (c.k === 'frac'){
      if (used.has(c.bar)) continue;
      const fp = fracParts(c.bar, avail(), H);
      if (!fp) continue;
      [c.bar, ...fp.above, ...fp.below].forEach(o => used.add(o));
      const all = box([c.bar, ...fp.above, ...fp.below]);
      items.push(Object.assign(all, {k:'frac', bar:c.bar, st:[c.bar], num:recogRegion(fp.above, R, depth + 1), den:recogRegion(fp.below, R, depth + 1)}));
    } else if (c.k === 'sqrt'){
      const r = c.r;
      if (used.has(r) || (c.bar && used.has(c.bar))) continue;
      let hx = r.x0 + 0.25 * r.w;
      for (const q of (r.pd || r.pts)) if (q.y <= r.y0 + 0.25 * r.h && q.x > r.x0 + 0.04 * r.w){ hx = Math.min(hx, q.x); break; }
      /* schräger Überstrich: Radikand beginnt dort, wo der Haken nach dem tiefsten Punkt oben ankommt */
      { const P = r.pd || r.pts; let kLo = 0; for (let k = 0; k < Math.ceil(0.7 * P.length); k++) if (P[k].y > P[kLo].y) kLo = k;
        for (let k = kLo; k < P.length; k++) if (P[k].y <= r.y0 + 0.4 * r.h){ hx = Math.min(hx, Math.max(P[kLo].x, P[k].x)); break; } }
      if (c.bar) hx = Math.min(hx, c.bar.x0);
      const xr = (c.bar ? c.bar.x1 : r.x1) + 0.1 * H, ytop = Math.min(r.y0, c.bar ? c.bar.y0 : r.y0);
      const rad = avail().filter(o => o !== r && o !== c.bar && o.cx > hx && o.cx < xr && o.y0 >= ytop - 0.15 * H && o.cy <= r.y1 + 0.15 * H);
      if (!rad.length) continue;
      [r, ...(c.bar ? [c.bar] : []), ...rad].forEach(o => used.add(o));
      const all = box([r, ...(c.bar ? [c.bar] : []), ...rad]);
      items.push(Object.assign(all, {k:'sqrt', st:[r].concat(c.bar ? [c.bar] : []), inner:recogRegion(rad, R, depth + 1)}));
    }
  }
  const hatsHere = hats.filter(s => !used.has(s));
  hatsHere.forEach(s => used.add(s));
  const groups = groupStrokes(avail(), R);
  groups.forEach(g => items.push(mkSym(g)));
  hatsHere.forEach(s => {
    let best = null, bd = Infinity;
    items.forEach(it => { if (it.k !== 'sym' || it.tiny) return; const d = Math.abs(it.cx - s.cx) + Math.max(0, it.y0 - s.y1); if (s.cx > it.x0 - 0.2 * H && s.cx < it.x1 + 0.2 * H && it.y0 > s.cy - 0.1 * H && d < bd){ bd = d; best = it; } });
    if (best){ best.hat = true; best.hatSt = s; } else { const g = {st:[s], alts:[['^', 0.5]]}; Object.assign(g, box([s])); items.push(mkSym(g)); }
  });
  return layout(items, R);
}

/* ---------------- Lage: Grundlinie, Hoch/Tief, Grenzen ---------------- */
function caseFix(it, E){
  const PAIRS = {c:'C', p:'P', s:'S', v:'V', 'ψ':'Ψ', 'φ':'Φ', x:'X', o:'0'};
  const a = it.alts; if (!a || !a.length) return;
  const rel = it.h / E;
  for (let k = 0; k < a.length; k++){
    const c = a[k][0], up = PAIRS[c], low = Object.keys(PAIRS).find(l => PAIRS[l] === c);
    if (!up && !low) continue;
    const lower = up ? c : low, upper = up || c;
    if ('cvsx'.includes(lower)){
      /* x-Höhe gegen Großbuchstabe */
      const lw = rel < 0.6 ? 1 : rel > 0.72 ? 0.25 : 0.6, uw = rel > 0.66 ? 1 : rel < 0.55 ? 0.2 : 0.6;
      a[k][1] *= c === lower ? lw : uw;
    }
  }
  a.sort((x, y) => y[1] - x[1]);
}
function metrics(it, E){
  it.rel = 'ok';
  if (it.k === 'frac'){
    /* Größe aus Zähler und Nenner (kleiner Bruch in einer Hochzahl) */
    const es = [];
    const col = list => list.forEach(n => { if (n.it.k === 'sym' && (n.it.rel === 'ok' || n.it.rel === 'weak') && n.it.e) es.push(n.it.e); else if (n.it.k !== 'sym' && n.it.e) es.push(n.it.e); });
    col(it.num); col(it.den);
    const e = es.length ? Math.min(E * 1.1, Math.max(0.45 * E, median(es))) : E;
    it.b = it.bar.cy + 0.28 * e; it.e = e; it.rel = 'frac'; return;
  }
  if (it.k === 'mat'){ it.b = it.cy + 0.28 * E; it.e = E; it.rel = 'big'; return; }
  if (it.k === 'sqrt'){ const ins = (it.inner || []).filter(n => n.it && n.it.rel === 'ok'); it.b = ins.length ? median(ins.map(n => n.it.b)) : it.y1 - 0.05 * E; it.e = ins.length ? median(ins.map(n => n.it.e)) : E; it.rel = 'sqrt'; return; }
  const c = it.alts[0][0];
  if (it.tiny || c === '.'){ it.rel = 'tiny'; it.b = it.cy; it.e = null; return; }
  if (c === '-' || (it.st.length === 1 && it.h < 0.3 * Math.max(it.w, 1) && c !== '=' && c !== '~')){ it.rel = 'flat'; it.b = it.cy + 0.3 * E; it.e = null; return; }
  if (c === "'" || c === ','){ it.rel = 'tiny'; it.b = it.cy; it.e = null; return; }
  /* Rechenzeichen: Lage über die Mittelachse (Höhe des „=“ schwankt stark) */
  if (/^[=+⊗*]$/.test(c) || c === 'pm'){ it.rel = 'op'; it.b = it.cy + 0.28 * Math.max(E, 1.2 * it.h); it.e = null; return; }
  if (c === '∫' || c === 'Σ'){ it.rel = 'bigop'; const v = VT[vtype(c)]; it.e = Math.max(E * 0.8, it.h / (v[1] - v[0])); it.b = it.y1 - v[1] * it.e; return; }
  const v = VT[vtype(c)];
  let e = it.h / (v[1] - v[0]);
  if (it.alts[0][1] < 0.3) it.rel = 'weak';
  if (OPEN.has(c) || CLOSE.has(c) || c === '|'){ if (it.h > 1.35 * E){ it.rel = 'big'; } }
  e = Math.max(0.3 * E, Math.min(2.2 * E, e));
  it.e = e; it.b = it.y1 - v[1] * e;
}
function layout(items, R){
  if (!items.length) return [];
  /* Geviert der Zeile aus sicheren Zeichen */
  const E0 = R.E || R.H / 0.75;
  items.forEach(it => { if (it.k === 'sym') caseFix(it, E0); metrics(it, E0); });
  items.sort((a, b) => sortX(a) - sortX(b));
  /* gestapelte Grenzen an ∫ und Σ */
  const taken = new Set();
  items.forEach(op => {
    if (op.k !== 'sym' || op.rel !== 'bigop') return;
    const isSum = op.alts[0][0] === 'Σ', m = isSum ? 0.35 * op.w + 0.15 * E0 : 0.5 * op.w + 0.2 * E0;
    const grab = (below) => {
      const cand = items.filter(it => it !== op && !taken.has(it) && (below ? it.y0 > op.y1 - 0.2 * op.h && it.y0 < op.y1 + 1.0 * E0 : it.y1 < op.y0 + 0.2 * op.h && it.y1 > op.y0 - 1.0 * E0) && it.x1 > op.x0 - m && it.x0 < op.x1 + m && it.h < 0.9 * op.h);
      if (!cand.length) return null;
      const set = cand.filter(it => it.cx > op.x0 - m && it.cx < op.x1 + m);
      if (!set.length) return null;
      /* nach rechts/links erweitern: gleiche Höhe, kleine Lücke */
      let bx = box(set), grew = true;
      const nextOp = items.find(o => o !== op && o.rel === 'bigop' && o.x0 > op.x1 && o.x0 < op.x1 + 3 * E0);
      const xMax = nextOp ? (op.cx + nextOp.cx) / 2 : Infinity;
      while (grew){ grew = false; for (const it of items){ if (it === op || taken.has(it) || set.includes(it) || it.cx > xMax) continue; const gap = Math.max(it.x0 - bx.x1, bx.x0 - it.x1); if (gap < 0.45 * E0 && it.cy > bx.y0 - 0.2 * E0 && it.cy < bx.y1 + 0.2 * E0 && (below ? it.y0 > op.y1 - 0.25 * op.h : it.y1 < op.y0 + 0.25 * op.h)){ set.push(it); bx = box(set); grew = true; } } }
      set.forEach(it => taken.add(it));
      return set;
    };
    const lo = grab(true), hi = grab(false);
    if (lo) op.lo = lo; if (hi) op.hi = hi;
  });
  const seq = items.filter(it => !taken.has(it));
  const L0 = levelOf(seq, E0);
  if (!(L0.e > 0)) L0.e = E0;
  const sub = arr => layoutSeq(arr.slice().sort((a, b) => sortX(a) - sortX(b)), null, R, E0);
  const nodes = layoutSeq(seq, L0, R, E0);
  /* Grenzen der großen Operatoren */
  const fix = list => list.forEach(n => {
    if (n.it.lo) n.lo = (n.lo || []).concat(sub(n.it.lo));
    if (n.it.hi) n.hi = (n.hi || []).concat(sub(n.it.hi));
    ['sup', 'sub', 'lo', 'hi'].forEach(k => n[k] && fix(n[k]));
  });
  fix(nodes);
  return nodes;
}
/* Lesereihenfolge: Mitte statt linker Rand (schräge hohe Striche wie | und ⟩ ragen weit nach links) */
/* j: der Haken unten ragt weit nach links (T_ij würde sonst T_ji) */
const sortX = it => it.k === 'sym' && it.st && ((it.st.length <= 2 && it.h > 2 * it.w) || (it.alts && it.alts[0][0] === 'j')) ? it.cx : 0.6 * it.x0 + 0.4 * it.cx;
function levelOf(arr, E0){
  /* Anker: Rechenzeichen (=, +, −) und die großen Buchstaben/Ziffern; Hoch-/Tiefgestelltes ist kleiner */
  const rel = arr.filter(it => it.rel === 'ok' && it.alts && /[0-9A-Za-zα-ωΑ-Ωħ∂]/.test(it.alts[0][0]));
  const ops = arr.filter(it => it.rel === 'op' || (it.rel === 'flat' && it.alts && it.alts[0][0] === '-' && it.w > 0.25 * E0 && it.w < 1.2 * E0));
  if (rel.length || ops.length){
    const eMax = rel.length ? pct(rel.map(it => it.e), 0.8) : E0;
    const big = rel.filter(it => it.e >= 0.78 * eMax);
    const bs = big.map(it => it.b).concat(ops.map(it => it.rel === 'flat' ? it.cy + 0.28 * eMax : it.cy + 0.28 * eMax));
    const e = big.length ? median(big.map(it => it.e)) : E0;
    const srt = bs.slice().sort((a, b) => a - b), m = srt.length % 2 ? srt[(srt.length - 1) / 2] : (srt[srt.length / 2 - 1] + srt[srt.length / 2]) / 2;
    return {b:m, e};
  }
  /* sonst Rechenzeichen, Brüche, Wurzeln, Matrizen (Lage aus der Mittelachse) */
  const f = arr.filter(it => (it.rel === 'ok' && it.k === 'sym') || it.rel === 'frac' || it.rel === 'sqrt' || it.k === 'mat' || (it.rel === 'flat' && it.alts && it.alts[0][0] === '-'));
  if (f.length) return {b:median(f.map(it => it.rel === 'flat' ? it.cy + 0.28 * E0 : it.b)), e:median(f.filter(it => it.e).map(it => it.e)) || E0};
  return {b:median(arr.map(it => it.y1)), e:median(arr.map(it => it.h)) / 0.7 || E0};
}
/* Zeichenfolge auf einer Ebene: Basis + Hoch/Tief rekursiv */
function layoutSeq(arr, lvl, R, E0){
  if (!arr.length) return [];
  if (!lvl) lvl = levelOf(arr, E0);
  const nodes = [];
  let i = 0;
  const yb = it => it.rel === 'ok' || it.rel === 'weak' || it.rel === 'frac' || it.rel === 'sqrt' ? it.b : it.rel === 'tiny' ? it.cy + 0.1 * lvl.e : it.cy + 0.28 * lvl.e;
  /* Buchstaben eines Funktionsworts (sin, cos …) stehen auf der Grundlinie */
  const inWord = new Set();
  for (let k = 0; k < arr.length; k++) for (const w of FUNCWORDS){
    if (k + w.length > arr.length) continue;
    let ok = true;
    for (let q = 0; q < w.length && ok; q++){ const it = arr[k + q]; ok = it.k === 'sym' && !!it.alts && it.alts.slice(0, 3).some(([c, p]) => p > 0.05 && (c === w[q] || WORDCH[c] === w[q] || (c === '5' && w[q] === 's'))); }
    if (ok){ for (let q = 0; q < w.length; q++) inWord.add(arr[k + q]); break; }
  }
  /* kleiner Index, der kaum tiefer sitzt: Oberkante gegen die Lage, die das Zeichen in voller Größe auf der Grundlinie hätte.
     Vorsichtigste Lesart unter den plausiblen (0 auch als o, 5 auch als s); nur Buchstaben und Ziffern.
     An CROHME-Trainingsausdrücken abgestimmt (Indizes 88 % statt 48 % erkannt, 3 % Fehlalarme) */
  const smallLow = (Y, B, E, yB) => {
    if (Y.k !== 'sym' || !Y.alts || inWord.has(Y) || !/^[0-9A-Za-zα-ωΑ-Ωħ]$/.test(Y.alts[0][0]) || Y.alts[0][0] === 'Σ') return false;
    const r = (Y.e || E) / E, dy = (yB - B) / E;
    if (!(dy > -0.1 && r < 0.8 && Y.y0 > B - 0.62 * E)) return false;
    const p0 = Y.alts[0][1];
    let top = 1;
    for (const [c, p] of Y.alts.slice(0, 3)){ if (p < 0.2 * p0) continue; for (const cc of c === '0' ? ['0', 'o'] : c === '5' ? ['5', 's'] : [c]) top = Math.min(top, Math.abs(VT[vtype(cc)][0])); }
    return dy + top * (1 - r) > 0.3;
  };
  const relTo = (B, E, Y, base) => {
    const bY = yb(Y);
    /* Grenzen rechts an ∫ und Σ: unten = Tief, oben = Hoch */
    if (base && base.rel === 'bigop'){
      const small = (Y.e ? Y.e < 0.85 * E : true) && Y.h < 0.85 * E && Y.rel !== 'bigop' && Y.k !== 'mat';
      const r = Y.e ? Y.e / E : 0.6;
      if (Y.k === 'frac' && Y.x0 < base.x1 + 0.7 * E){ if (Y.bar.cy < B - 0.4 * E) return 'sup'; if (Y.bar.cy > B + 0.05 * E) return 'sub'; return 'right'; }
      if (small && Y.x0 < base.x1 + 0.7 * E && (Y.cy > B || (r < 0.8 && Y.y0 > B - 0.35 * E))) return 'sub';
      if (small && Y.x0 < base.x1 + 0.7 * E && (Y.cy < B - 0.55 * E || (r < 0.8 && Y.y1 < B - 0.4 * E))) return 'sup';
      return 'right';
    }
    const dy = (bY - B) / E;
    if (Y.rel === 'tiny'){
      const c = Y.alts && Y.alts[0][0];
      if (Y.cy < B - 0.5 * E) return 'sup';
      if (c === "'" && Y.cy < B - 0.35 * E) return 'sup';
      return 'right';
    }
    if (Y.rel === 'flat' || Y.rel === 'op'){
      if (Y.alts && Y.alts[0][0] === '=') return 'right';      /* = nie hoch-/tiefgestellt (Grenzen der Σ kommen über die Grenzen-Erkennung) */
      const small = Y.rel === 'op' ? Y.h < 0.45 * E : Y.w < 0.4 * E;
      if (Y.cy < B - 0.62 * E || (small && Y.rel === 'op' && Y.cy < B - 0.47 * E)) return 'sup';
      /* L_+, L_-: kleines Zeichen auf oder unter der Grundlinie direkt am Buchstaben */
      if (small && Y.cy > B - 0.1 * E && base && base.k === 'sym' && /^[A-Za-zα-ωΑ-Ω]$/.test(base.alts[0][0]) && Y.x0 - base.x1 < 0.35 * E) return 'sub';
      return 'right';
    }
    if (Y.rel === 'big' || Y.rel === 'bigop' || Y.k === 'mat') return 'right';
    const r = (Y.e || E) / E;
    if ((dy < -0.3 && r < 0.92) || dy < -0.55) return (Y.rel === 'frac' ? Y.bar.cy < B - 0.45 * E : Y.y1 < B - 0.12 * E) ? 'sup' : 'right';
    if (dy > 0.13 && r < 0.88 && Y.y0 > B - 0.62 * E) return 'sub';
    if (dy > 0.3 && r < 1.0 && Y.y0 > B - 0.45 * E) return 'sub';
    if (smallLow(Y, B, E, bY) && !(base && base.k === 'sym' && inWord.has(base))) return 'sub';
    return 'right';
  };
  while (i < arr.length){
    const X = arr[i];
    const node = {it:X};
    nodes.push(node); i++;
    if (X.k === 'sym' && (X.rel === 'tiny' || X.rel === 'op' || X.rel === 'flat' || OPEN.has(X.alts[0][0]) || X.alts[0][0] === ',')) continue;
    /* Ebene der Basis */
    let B = lvl.b, E = lvl.e;
    if ((X.rel === 'ok' || X.rel === 'weak') && X.e > 0.6 * lvl.e && X.e < 1.6 * lvl.e){ B = 0.5 * X.b + 0.5 * lvl.b; }
    for (let guard = 0; guard < 3 && i < arr.length; guard++){
      const Y = arr[i];
      if (Y.x0 - X.x1 > 1.3 * E) break;
      let r = relTo(B, E, Y, X);
      /* Minus/Punkt vor Hochgestelltem */
      if (r === 'right' && (Y.rel === 'flat' || Y.rel === 'tiny') && arr[i + 1] && Y.cy < B - 0.42 * E){ const r2 = relTo(B, E, arr[i + 1], X); if (r2 === 'sup' && arr[i + 1].x0 - Y.x1 < 0.6 * E) r = 'sup'; }
      if (r === 'right') break;
      if (node[r]) break;
      if (X.rel === 'flat' || (X.rel === 'tiny' && !(X.alts && X.alts[0][0] === "'"))) break;
      if (X.k === 'sym' && /^[-+=]$/.test(X.alts[0][0]) && X.alts[0][1] > 0.5) break;
      /* Lauf sammeln */
      const run = [Y]; let j = i + 1, right = Y.x1;
      const sl = (Y.rel === 'ok' || Y.rel === 'weak') ? {b:Y.b, e:Y.e} : {b:r === 'sup' ? B - 0.48 * E : B + 0.22 * E, e:0.65 * E};
      while (j < arr.length){
        const Z = arr[j];
        if (Z.x0 - right > 0.9 * E) break;
        if (Z.rel === 'big' || Z.rel === 'bigop' || Z.k === 'mat') break;
        const zb = yb(Z);
        const dMain = Math.abs(zb - B) / E, dScr = Math.abs(zb - sl.b) / Math.max(sl.e, 0.3 * E);
        const ze = Z.e || sl.e;
        /* „=“ gehört nie in eine Hoch-/Tiefstellung (Grenzen von Σ kommen über die Grenzen-Erkennung) */
        if (Z.k === 'sym' && Z.alts && Z.alts[0][0] === '=') break;
        if (r === 'sup'){
          if (Z.rel === 'flat' || Z.rel === 'tiny' || Z.rel === 'op'){ if (Z.cy < B - 0.45 * E) { run.push(Z); right = Math.max(right, Z.x1); j++; continue; } break; }
          if (zb < B - 0.28 * E && ze < 1.0 * E) { run.push(Z); right = Math.max(right, Z.x1); j++; continue; }
          if (dScr < dMain * 0.7 && ze < 0.95 * E){ run.push(Z); right = Math.max(right, Z.x1); j++; continue; }
          break;
        } else {
          if (Z.rel === 'flat' || Z.rel === 'tiny' || Z.rel === 'op'){ if (Z.cy > B - 0.1 * E && Z.cy < B + 0.6 * E && j + 1 < arr.length) { const nx = arr[j + 1]; if (yb(nx) > B + 0.12 * E && (nx.e || E) < 0.9 * E){ run.push(Z); right = Math.max(right, Z.x1); j++; continue; } } break; }
          if (zb > B + 0.12 * E && ze < 0.9 * E && Z.y0 > B - 0.6 * E){ run.push(Z); right = Math.max(right, Z.x1); j++; continue; }
          /* weitere Indexzeichen (S_max, T_fus): klein, Oberkante deutlich tiefer als in voller Größe, oder auf der Linie des Index */
          if (smallLow(Z, B, E, zb)){ run.push(Z); right = Math.max(right, Z.x1); j++; continue; }
          if (dScr < 0.35 && dScr < dMain * 0.7 && ze < 0.85 * E){ run.push(Z); right = Math.max(right, Z.x1); j++; continue; }
          break;
        }
      }
      node[r] = layoutSeq(run, sl.e > 0 && (Y.rel === 'ok' || Y.rel === 'weak') ? null : sl, R, E0);
      i = j;
    }
    node.B = B; node.E = E;
    /* Grundlinie langsam nachführen (schräge Zeile) */
    if (X.rel === 'ok' && X.e > 0.6 * lvl.e && X.e < 1.6 * lvl.e){ lvl = {b:0.6 * lvl.b + 0.4 * X.b, e:0.8 * lvl.e + 0.2 * X.e}; }
  }
  /* Lesarten nach Lage gewichten: erwartetes Kästchen der Klasse (Lagetabelle VT) gegen das tatsächliche
     (trennt 1/|/l, c/C, p/P, 9/q, x/χ, s/S, ,/) …, die im normierten Bild gleich aussehen) */
  if (R.posW) nodes.forEach(n => {
    const it = n.it;
    if (it.k !== 'sym' || !(it.rel === 'ok' || it.rel === 'weak') || !it.alts || it.alts.length < 2 || n.B === undefined) return;
    const B = n.B, Ee = n.E, sg = 0.22 * Ee;
    let tot = 0;
    const out = it.alts.map(([c, p]) => {
      if (!/^[0-9A-Za-zα-ωΑ-Ωħ∂|()\[\]{}⟨⟩,']$/.test(c) || c === 'Σ') return [c, p];
      const v = VT[vtype(c)], ey0 = B + v[0] * Ee, ey1 = B + v[1] * Ee;
      const d2 = ((it.y0 - ey0) ** 2 + (it.y1 - ey1) ** 2) / (2 * sg * sg);
      return [c, p * Math.exp(-R.posW * Math.min(d2, 8))];
    });
    out.forEach(x => { tot += x[1]; });
    if (tot > 0){ it.alts = out.map(([c, p]) => [c, p / tot]).sort((a, b) => b[1] - a[1]); }
  });
  /* kleiner Einzelstrich: Komma (unten) oder Ableitungsstrich ' (oben) nach Lage, nicht nach Bild (Rat von Agent T) */
  nodes.forEach((n, k) => {
    const it = n.it;
    if (it.k !== 'sym' || it.st.length !== 1 || it.tiny || n.B === undefined || R.rctx.oracle) return;
    const s0 = it.st[0], Ee = n.E;
    if (!(it.h < 0.42 * Ee && it.w < 0.3 * Ee && s0.len < 1.4 * Math.max(s0.chord, 1) + 0.05 * Ee)) return;
    const prev = nodes[k - 1];
    let want = null;
    if (it.cy > n.B - 0.12 * Ee && it.y1 > n.B - 0.02 * Ee) want = ',';
    else if (it.cy < n.B - 0.45 * Ee && prev && prev.it.k === 'sym' && /^[A-Za-zα-ωΑ-Ω)']$/.test(prev.it.alts[0][0])) want = "'";
    if (!want) return;
    const a = it.alts.map(x => x.slice()), f = a.find(x => x[0] === want);
    if (f) f[1] = Math.max(f[1] * 4, 0.6); else a.push([want, 0.6]);
    const tot = a.reduce((t, x) => t + x[1], 0);
    it.alts = a.map(([c, p]) => [c, p / tot]).sort((x, y) => y[1] - x[1]);
  });
  /* Punkte: Malpunkt (Mitte) oder Dezimalpunkt (Grundlinie) */
  nodes.forEach((n, k) => {
    const it = n.it;
    if (it.k === 'sym' && it.rel === 'tiny' && it.alts[0][0] === '.'){
      let mid = it.cy < lvl.b - 0.14 * lvl.e;
      /* Ziffer davor/danach (auch wenn 1 zunächst als | gelesen wird) */
      const dig = m => m && m.it.k === 'sym' && !m.sup && !m.sub && m.it.alts.slice(0, 3).some(([c, p]) => isDigit(c) && p > 0.2);
      const pd = dig(nodes[k - 1]), nd = dig(nodes[k + 1]);
      /* zwischen eng stehenden Ziffern ist ein Punkt fast immer ein Dezimalpunkt, auch etwas über der Grundlinie */
      if (pd && nd && mid){ const g1 = it.x0 - nodes[k - 1].it.x1, g2 = nodes[k + 1].it.x0 - it.x1; if (!(it.cy < lvl.b - 0.4 * lvl.e) && !(g1 > 0.35 * lvl.e && g2 > 0.35 * lvl.e)) mid = false; }
      it.alts = mid ? [['·', 0.9], ['', 0.1]] : (pd && nd ? [['.', 0.75], ['·', 0.24], ['', 0.01]] : [['', 0.7], ['·', 0.3]]);
    }
  });
  return nodes;
}

/* ---------------- Ausgabe: Knoten + Lesart → Text der Eingabesprache ---------------- */
function flatten(nodes, out, role, parent){
  nodes.forEach((n, k) => {
    n.role = role; n.seq = nodes; n.pos = k;
    const it = n.it;
    if (it.k === 'sym'){ n.ix = out.length; out.push(n); }
    if (it.k === 'frac'){ flatten(it.num, out, 'num', n); flatten(it.den, out, 'den', n); }
    if (it.k === 'sqrt') flatten(it.inner, out, 'rad', n);
    if (it.k === 'mat') it.cells.forEach(r => r.forEach(c => flatten(c, out, 'cell', n)));
    if (n.sub) flatten(n.sub, out, 'sub', n);
    if (n.lo) flatten(n.lo, out, 'lo', n);
    if (n.hi) flatten(n.hi, out, 'hi', n);
    if (n.sup) flatten(n.sup, out, 'sup', n);
  });
  return out;
}
/* Alternativen je Zeichen nach Lage anpassen (z. B. hochgestelltes + → †) */
function roleAlts(n, R){
  const it = n.it; let a = it.alts.filter(x => x[1] > 0.002).slice(0, 5).map(x => x.slice());
  const parentSup = n.role === 'sup' && n.seq.length === 1;
  if (parentSup){
    const pa = n.parentBase;
    const dagOk = pa && (R.rctx.dag || (pa.k === 'sym' && /^[a-zA-Z]$/.test(pa.alts[0][0]) && pa.hat) || (pa.k === 'sym' && /^[A-Z]$/.test(pa.alts[0][0])));
    const pPlus = a.filter(x => x[0] === '+').reduce((s, x) => s + x[1], 0), pT = a.filter(x => x[0] === 't').reduce((s, x) => s + x[1], 0);
    if (pPlus || pT){
      const toD = pPlus + (dagOk ? 0.8 : 0.25) * pT;
      a = a.filter(x => x[0] !== '+' && !(x[0] === 't' && dagOk)).map(x => x[0] === 't' ? [x[0], 0.75 * x[1]] : x);
      const d = a.find(x => x[0] === '†'); if (d) d[1] += toD; else a.push(['†', toD]);
    }
    /* Strich ', 1 oder | allein hoch an einem Buchstaben/Klammer: eher Ableitungsstrich (Hochzahl 1 kommt kaum vor) */
    a = a.map(x => x[0] === ',' ? ["'", x[1]] : x);
    if (pa && pa.k === 'sym' && /^[A-Za-zα-ωΑ-Ω)']$/.test(pa.alts[0][0]) && it.st && it.st.length === 1){
      const pr = a.filter(x => /^[1|/l]$/.test(x[0])).reduce((t, x) => t + x[1], 0);
      if (pr){ a = a.map(x => /^[1|/l]$/.test(x[0]) ? [x[0], 0.25 * x[1]] : x); const q = a.find(x => x[0] === "'"); if (q) q[1] += 0.75 * pr; else a.push(["'", 0.75 * pr]); }
    }
  }
  if (n.role === 'sup' || n.role === 'sub' || n.role === 'lo' || n.role === 'hi') a = a.filter(x => x[0] !== '.' || x[1] > 0.5);
  /* † steht nur hochgestellt; auf der Grundlinie ist das Kreuz ein + */
  if (!parentSup) a = a.map(x => x[0] === '†' ? ['+', x[1]] : x);
  /* „∫“/„Σ“ nur auf der Grundlinie */
  const m = new Map(); a.forEach(([c, p]) => m.set(c, (m.get(c) || 0) + p));
  a = [...m.entries()].sort((x, y) => y[1] - x[1]);
  const tot = a.reduce((s, x) => s + x[1], 0) || 1;
  return a.map(([c, p]) => [c, p / tot]);
}
const LETTERISH = c => isLetterC(c) || c === '∂';
function pieceKind(c){
  if (c === '') return 'none';
  if (c === '∫' || c === 'Σ') return 'big';
  if (isDigit(c)) return 'num';
  if (c === '∞') return 'atom';
  if (LETTERISH(c)) return 'id';
  if (OPEN.has(c)) return 'open';
  if (CLOSE.has(c)) return 'close';
  if (c === '|') return 'bar';
  if (c === "'" || c === '!' || c === '†') return 'post';
  if (c === '∫' || c === 'Σ') return 'big';
  if (c === ',') return 'comma';
  if (c === '·' || c === '*' || c === '⊗' || c === '/') return 'mulop';
  if (c === '.') return 'dot';
  if (c === '+' || c === '-' || c === '=' || c === 'pm' || c === '±' || c === '<' || c === '>') return 'op';
  if (c === '↑' || c === '↓' || c === '∇') return 'atom';
  if (c === 'sqrt') return 'id';
  return 'atom';
}
const SHOW = c => c === 'pm' ? '±' : c === 'sqrt' ? 'sqrt' : c;
function oneAtom(t, pctx){
  if (!t || /\s/.test(t.replace(/\([^()]*\)/g, '()'))) return false;
  try { const e = parseExprStr(t, pctx); return !['mul', 'add', 'neg', 'div', 'pm', 'tensor', 'int', 'sum', 'deriv'].includes(e.t) && !(e.t === 'num' && e.v < 0); } catch(e){ return false; }
}
function topLevelOps(t){
  let d = 0;
  for (let k = 0; k < t.length; k++){
    const ch = t[k];
    if ('([{⟨'.includes(ch)) d++; else if (')]}⟩'.includes(ch)) d = Math.max(0, d - 1);
    else if (d === 0 && (ch === '=' || ch === ',' || ch === ';' || ch === '∫' || ch === 'Σ' || ch === '/' || ((ch === '+' || ch === '-' || ch === '±') && k > 0 && t[k - 1] === ' '))) return true;
  }
  return false;
}
function limText(t){ return /^-?([0-9]+|[A-Za-zα-ωΑ-Ωħ](_[0-9a-z])?|∞|π)$/.test(t) ? t : '{' + t + '}'; }
function genText(nodes, picks, R, role){
  const P = [];   /* Stücke {k, s, n} */
  const pickOf = n => n.ix !== undefined ? picks[n.ix] : null;
  /* Funktionswörter suchen: zusammenhängende Buchstaben ohne Hoch/Tief/Dach in der Mitte */
  const fw = new Map();
  for (let k = 0; k < nodes.length; k++){
    for (const w of FUNCWORDS){
      if (k + w.length > nodes.length) continue;
      let ok = true;
      for (let q = 0; q < w.length && ok; q++){
        const n = nodes[k + q], c = pickOf(n);
        if (n.it.k !== 'sym' || c === null || n.it.hat || ((n.sub || n.sup) && q < w.length - 1) || n.sub) { ok = false; break; }
        const cc = WORDCH[c] && !w.includes(c) ? WORDCH[c] : c;
        if (cc !== w[q]) ok = false;
      }
      if (ok && !fw.has(k)){ fw.set(k, w); break; }
    }
  }
  const intStack = [];
  for (let k = 0; k < nodes.length; k++){
    const n = nodes[k], it = n.it;
    if (fw.has(k)){
      const w = fw.get(k), last = nodes[k + w.length - 1];
      let s = w + (last.sup ? supText(last.sup, picks, R, last) : '');
      P.push({k:'fn', s, n:last}); k += w.length - 1; continue;
    }
    let s = '', kind;
    if (it.k === 'frac'){
      const nt = genText(it.num, picks, R, 'num'), dt = genText(it.den, picks, R, 'den');
      const ntc = nt.replace(/\s+/g, ''), dtc = dt.replace(/\s+/g, '');
      if (/^(d|∂)(\^[0-9])?([A-Za-zα-ωΑ-Ω](_[0-9a-z]+)?(\^\*)?)?$/.test(ntc) && /^(d|∂)[A-Za-zα-ωΑ-Ω]'?(\^[0-9])?$/.test(dtc)) s = ntc + '/' + dtc;
      else s = (topLevelOps(nt) || !nt ? '(' + nt + ')' : nt) + '/' + (oneAtom(dt, R.pctx) ? dt : '(' + dt + ')');
      kind = 'frac';
    } else if (it.k === 'sqrt'){ s = 'sqrt(' + genText(it.inner, picks, R, 'rad') + ')'; kind = 'sqrt'; }
    else if (it.k === 'mat'){ s = '(' + it.cells.map(r => r.map(c => genText(c, picks, R, 'cell')).join(', ')).join('; ') + ')'; kind = 'mat'; }
    else {
      const c = pickOf(n);
      kind = pieceKind(c);
      s = SHOW(c);
      if (kind === 'none') continue;
      if (it.hat && (kind === 'id')) s += '̂';
      if (kind === 'big'){
        const byX = (a, b) => a.it.x0 - b.it.x0;
        const lo = n.lo || n.sub ? (n.lo || []).concat(n.sub || []).sort(byX) : null, hi = n.hi || n.sup ? (n.hi || []).concat(n.sup || []).sort(byX) : null;
        if (c === 'Σ'){
          if (lo){ const t = genText(lo, picks, R, 'lo'); s += '_' + (/^[a-z]$/.test(t) ? t : '{' + t + '}'); }
          if (hi) s += '^' + limText(genText(hi, picks, R, 'hi'));
        } else {
          if (lo) s += '_' + limText(genText(lo, picks, R, 'lo'));
          if (hi) s += '^' + limText(genText(hi, picks, R, 'hi'));
          intStack.push(1);
        }
        P.push({k:'big', s, n}); continue;
      }
    }
    if (kind !== 'big'){
      /* Bruch mit Hoch-/Tiefstellung klammern: „v/R^2“ hieße v/R² */
      if (kind === 'frac' && (n.sub || n.sup)) s = '(' + s + ')';
      if (n.sub) s += subText(n.sub, picks, R);
      if (n.sup) s += supText(n.sup, picks, R, n);
    }
    P.push({k:kind, s, n, scr:!!(n.sub || n.sup), c:it.k === 'sym' ? pickOf(n) : null});
  }
  /* Differential dx im Integral: „d“ + Variable */
  if (intStack.length) for (let k = P.length - 2; k >= 0; k--){
    const a = P[k], b = P[k + 1];
    if (a.k === 'id' && a.c === 'd' && !a.scr && b.k === 'id' && !b.scr && /^[A-Za-zα-ω]$/.test(b.c) && (R.dvars.has(b.c))){
      if (P.slice(0, k).some(p => p.k === 'big' && p.s[0] === '∫')){ P.splice(k, 2, {k:'dvar', s:'d' + b.c, n:a.n}); }
    }
  }
  /* zusammensetzen */
  const scr = role === 'sup' || role === 'sub' || role === 'lo' || role === 'hi';
  let out = '';
  const factor = p => p && ['num', 'id', 'atom', 'close', 'frac', 'sqrt', 'mat', 'fn', 'post', 'bar', 'dvar'].includes(p.k);
  for (let k = 0; k < P.length; k++){
    const p = P[k], q = P[k - 1];
    let sep = '';
    if (!q){}
    else if (p.k === 'op' && (p.s === '+' || p.s === '-' || p.s === '±') && (q.k === 'bar' || q.s === '⟨' || q.k === 'comma') && P[k + 1] && (['⟩', '|', ','].includes(P[k + 1].s) || (P[k + 1].k === 'id' && /^[xyz]$/.test(P[k + 1].s) && P[k + 2] && ['⟩', '|', ','].includes(P[k + 2].s)))) sep = '';
    else if (q.k === 'op' && (q.s === '+' || q.s === '-' || q.s === '±') && P[k - 2] && (P[k - 2].k === 'bar' || P[k - 2].s === '⟨' || P[k - 2].k === 'comma') && (['⟩', '|', ','].includes(p.s) || (p.k === 'id' && /^[xyz]$/.test(p.s) && P[k + 1] && ['⟩', '|', ','].includes(P[k + 1].s)))) sep = '';
    else if (p.k === 'bar' || (q.k === 'bar' && p.k !== 'op')) sep = '';
    else if (p.k === 'op'){
      const unary = !factor(q) && q.k !== 'post';
      sep = (scr || q.k === 'open' || (q.k === 'bar' && unary)) ? '' : ' ';
      if (q.k === 'op' || q.k === 'comma') sep = q.k === 'comma' ? '' : ' ';
    }
    else if (q.k === 'op'){
      const qUnary = k - 1 === 0 || !(factor(P[k - 2]) || (P[k - 2] && P[k - 2].k === 'post'));
      sep = scr || (qUnary && q.s !== '=') ? '' : ' ';
    }
    else if (p.k === 'post' || p.k === 'close' || p.k === 'comma') sep = '';
    else if (q.k === 'comma'){
      /* Dezimalkomma: Ziffern eng um ein Komma (2,91) – mit Leerzeichen wäre es eine Aufzählung */
      const a = P[k - 2], g1 = a ? q.n.it.x0 - a.n.it.x1 : 1e9, g2 = p.n.it.x0 - q.n.it.x1;
      sep = scr || (a && a.k === 'num' && !a.scr && p.k === 'num' && g2 < 0.45 * R.E && g1 + g2 < 0.6 * R.E) ? '' : ' ';
    }
    else if (q.k === 'open') sep = '';
    else if (p.k === 'mulop' || q.k === 'mulop') sep = p.s === '/' || q.s === '/' ? '' : ' ';
    else if (p.k === 'frac' || q.k === 'frac' || p.k === 'sqrt' || q.k === 'sqrt' || p.k === 'big' || q.k === 'big' || p.k === 'mat' && factor(q) && q.k !== 'close' || p.k === 'dvar' || q.k === 'dvar' && p.k !== 'close') sep = ' ';
    else if (p.k === 'fn' || q.k === 'fn'){ sep = q.k === 'fn' && (p.k === 'open') ? '' : ' '; }
    else if (q.scr && p.k !== 'open') sep = ' ';
    else if (q.scr && p.k === 'open'){ const primesOnly = /'$/.test(q.s) && !/\^/.test(q.s); const fnOk = q.k === 'id' && ((q.n.sub && !q.n.sup) || primesOnly) && (R.funcs.has(q.c) || primesOnly); sep = fnOk ? '' : ' '; }
    else if (q.k === 'id' && p.k === 'num') sep = ' ';
    else if (q.k === 'num' && p.k === 'num'){ const gap = p.n.it.x0 - q.n.it.x1; sep = gap > 0.45 * R.E ? ' ' : ''; }
    else if (q.k === 'dot' || p.k === 'dot') sep = '';
    else if (p.k === 'open' && (q.k === 'id' || q.k === 'num' || q.k === 'close' || q.k === 'atom')){ const gap = p.n.it.x0 - q.n.it.x1; sep = (q.k === 'id' && R.funcs.has(q.c) && gap < 0.5 * R.E) || gap < 0.3 * R.E ? '' : ' '; if (p.s === '⟨') sep = ' '; }
    else if (p.k === 'open' && p.s === '⟨' && factor(q)) sep = ' ';
    else if (q.k === 'id' && p.k === 'id'){ const gap = p.n.it.x0 - q.n.it.x1; sep = gap > 0.5 * R.E ? ' ' : ''; }
    else if (p.k === 'bar' && (q.k === 'id' || q.k === 'num') ){ sep = ''; }
    else sep = '';
    if (p.k === 'op' && p.s === '=' && !q) out += '';
    out += sep + p.s;
  }
  /* Buchstabenfolgen dürfen kein anderes Wort ergeben (m u → „mu“ wäre μ) */
  out = out.replace(/[A-Za-z]{2,}/g, (run, off) => {
    if (FUNCWORDS.includes(run) || run === 'sqrt') return run;
    const prev = out[off - 1] || '';
    if (prev === '_' || prev === '\\') return run;
    try { const T = lex(run).filter(t => t.k !== 'eof'); if (T.length === run.length && T.every(t => t.k === 'id' && !t.fn && t.v.length === 1)) return run; } catch(e){}
    return run.split('').join(' ');
  });
  if (role === undefined || role === 'top'){ if (/^=/.test(out) && !/^= /.test(out)) out = '= ' + out.slice(1).replace(/^\s+/, ''); }
  return out;
}
function supText(sup, picks, R, base){
  const ix = n => n.ix !== undefined ? picks[n.ix] : null;
  if (sup.every(n => n.it.k === 'sym' && ix(n) === "'")) return "'".repeat(sup.length);
  if (sup.length === 1 && sup[0].it.k === 'sym'){
    const c = ix(sup[0]);
    if (c === '*' && !sup[0].sup && !sup[0].sub) return '^*';
    if (c === '†') return '†' + (sup[0].sup ? supText(sup[0].sup, picks, R) : '');
  }
  /* führende Striche, danach Hochzahl */
  let pre = '', rest = sup;
  while (rest.length && rest[0].it.k === 'sym' && ix(rest[0]) === "'"){ pre += "'"; rest = rest.slice(1); }
  if (rest.length && rest[rest.length - 1].it.k === 'sym' && (ix(rest[rest.length - 1]) === '*' || ix(rest[rest.length - 1]) === '†') && rest.length > 1){
    const last = ix(rest[rest.length - 1]);
    return pre + supText(rest.slice(0, -1), picks, R, base) + (last === '*' ? '^*' : '†');
  }
  if (!rest.length) return pre;
  const t = genText(rest, picks, R, 'sup');
  if (!t) return pre;
  if (/^([0-9]+|[A-Za-zα-ωΑ-Ωħ]̂?|∞|π)$/.test(t)) return pre + '^' + t;
  if (/^\([^()]*\)$/.test(t)) return pre + '^' + t;
  return pre + '^(' + t + ')';
}
function subText(sub, picks, R){
  const t = genText(sub, picks, R, 'sub');
  if (!t) return '';
  /* ohne Klammer nur ein Zeichen oder eine Zahl: „S_max“ hieße S_m·a·x */
  if (/^([0-9]+|[A-Za-zα-ωΑ-Ωħ]̂?|[+-])$/.test(t)) return '_' + t;
  return '_{' + t + '}';
}

/* ---------------- Zeichen-Bigramme der Eingabesprache ----------------
   aus den Inhaltszeilen außerhalb der Übungsziele gelernt (test/ink/build_lm.js); Ebenenanfang: S Zeile, ^ hoch, _ tief, # Nenner, r Wurzel */
const INKLM = {"n":8690,"uni":{"0":289,"1":393,"2":834,"3":105,"4":90,"5":45,"6":28,"7":2,"8":11,"9":7,"i":291,"π":163,"#":434,"+":170,"=":632,"e":155,"(":536,")":536,"-":378,"|":303,"z":32,"k":145,"x":325,"·":86,"φ":49,"∞":96,"α":30,"b":32,"∫":118,"d":171,"u":11,"I":8,"c":47,"s":90,"R":23,"n":158,"'":40,"[":16,"]":16,"δ":4,"a":98,"⟨":92,"⟩":114,",":66,";":30,"v":19,"f":46,"t":16,"A":82,"λ":43,"B":27,"μ":12,"θ":37,"σ":37,"↑":2,"↓":1,"U":5,"†":19,"N":1,"y":41,"L":187,"̂":20,"g":10,"pm":5,"κ":28,"C":17,"D":5,"K":2,"V":22,"r":111,"m":77,"∇":5,"ψ":97,"!":4,"P":5,"ħ":175,"∂":16,"Ψ":20,"ω":58,"E":35,"j":3,"T":2,"H":14,"Ĥ":5,"p":9,"q":24,"S":19," ":4,"â":7,"β":2,"Y":5,"χ":10},"prev":{"0":71,"1":160,"2":273,"3":46,"4":42,"5":18,"6":12,"7":1,"8":7,"9":4,"r":197,"S":1061,"i":283,"^":727,"#":547,"+":169,"=":618,"(":536,")":327,"π":89,"-":372,"|":277,"z":7,"k":119,"e":100,"φ":33,"_":396,"α":19,"x":183,"b":24,"∫":118,"d":158,"I":7,"c":47,"s":90,"R":12,"·":72,"n":128,"'":36,"[":16,"]":9,"δ":4,"a":53,"u":2,"⟨":92,"⟩":80,",":66,";":30,"v":19,"f":44,"t":11,"A":77,"λ":41,"B":26,"μ":12,"θ":35,"↑":2,"↓":1,"U":5,"†":19,"N":1,"σ":20,"L":103,"̂":20,"g":8,"pm":5,"y":30,"κ":22,"C":10,"D":5,"V":15,"∇":5,"ψ":80,"P":5,"ħ":101,"∂":13,"ω":32,"m":72,"Ψ":7,"E":25,"j":3,"T":2,"H":14,"Ĥ":5,"p":9,"q":22,"â":7,"β":2,"Y":5,"!":2,"χ":10},"bi":{"r\u00013":4,"S\u0001i":8,"i\u0001π":9,"^\u0001#":87,"#\u00013":11,"S\u00011":10,"1\u0001+":28,"+\u0001i":34,"i\u0001=":2,"=\u00012":70,"2\u0001e":4,"^\u00016":4,"S\u0001(":21,"(\u00011":78,"i\u0001)":54,")\u0001=":74,"^\u00012":394,"2\u0001π":36,"π\u0001i":2,"S\u0001=":273,"=\u00016":4,"6\u00014":2,"4\u0001e":2,"r\u00012":66,"S\u0001-":60,"-\u0001i":78,"#\u00014":29,"1\u0001-":34,"=\u0001e":14,"^\u00018":2,"-\u00018":2,"^\u0001-":39,"-\u00012":39,"=\u00011":123,"1\u00016":3,"(\u00012":88,"2\u0001+":11,"#\u0001(":157,"=\u0001(":49,")\u0001(":33,"S\u0001#":311,"(\u0001(":5,")\u0001)":29,"+\u00013":4,"3\u0001i":3,"#\u00012":94,"S\u0001|":41,"|\u0001(":12,")\u0001|":28,"|\u0001=":17,"+\u00019":2,"=\u00015":12,"=\u0001|":19,"|\u00012":4,"i\u0001|":7,"#\u0001|":3,"|\u00011":17,"|\u0001z":4,"z\u0001|":4,"=\u0001z":3,"2\u0001i":45,"i\u0001k":35,"k\u0001x":23,"+\u00012":6,")\u0001e":27,"(\u0001-":40,"-\u00013":5,"3\u0001+":5,"+\u00014":11,"^\u0001·":14,"z\u0001z":2,"^\u0001i":10,"e\u0001e":10,"S\u0001φ":8,"=\u0001π":3,"-\u0001π":6,"(\u00013":22,"(\u00015":4,"5\u0001-":2,"#\u00015":13,"_\u0001-":51,"-\u0001∞":39,"^\u0001∞":57,"-\u0001α":9,"α\u0001x":6,"x\u0001+":2,"+\u0001b":2,"α\u0001(":2,"(\u0001x":43,"x\u0001-":9,"-\u0001b":2,"2\u0001α":5,"α\u0001)":9,")\u0001+":16,"(\u00014":10,"4\u0001α":4,"S\u0001∫":24,"∫\u0001e":23,"e\u0001d":37,"d\u0001x":91,"x\u0001=":29,"=\u0001∫":22,"S\u0001b":7,"e\u0001∫":2,"d\u0001u":4,"S\u0001π":8,"r\u0001#":35,"#\u0001α":4,"-\u0001x":15,"c\u00010":23,"0\u0001s":23,"s\u0001(":23,"(\u0001k":47,"x\u0001)":66,")\u0001d":44,"=\u0001R":2,"R\u0001e":4,"e\u0001(":4,"(\u0001∫":2,"(\u0001i":3,"k\u0001)":23,"(\u0001e":4,"e\u0001)":10,"-\u0001k":7,"∫\u0001x":17,"x\u0001e":8,")\u0001∫":4,"=\u0001-":46,"-\u0001d":2,"#\u0001d":24,"d\u0001α":2,"_\u00010":163,"^\u0001π":24,"x\u0001c":4,"x\u0001(":2,"s\u0001i":65,"i\u0001n":65,"n\u0001(":67,")\u0001'":6,"'\u0001d":4,"=\u0001[":5,"[\u0001x":3,"x\u0001s":8,")\u0001]":5,"]\u0001+":4,"+\u0001∫":2,"∫\u0001s":19,"=\u00010":48,"0\u0001+":2,"]\u0001-":2,"0\u0001-":3,"∫\u0001δ":3,"δ\u0001(":4,"3\u0001x":7,"-\u00016":2,"6\u0001)":2,")\u0001x":7,"x\u0001d":4,"2\u0001)":9,"=\u00013":18,"·\u00014":10,"1\u00012":2,"=\u00014":5,"2\u0001x":8,"#\u0001a":41,"^\u00013":22,"-\u0001u":3,"a\u0001∫":2,"_\u00011":61,"_\u00012":28,"S\u0001⟨":52,"⟨\u0001e":6,"e\u0001|":12,"|\u0001e":2,"⟩\u0001=":60,"2\u0001(":12,"1\u0001,":28,",\u0001-":14,"1\u0001;":11,";\u0001-":3,"|\u0001v":15,"v\u0001⟩":15,";\u00012":5,",\u0001i":9,"-\u00011":36,"|\u0001⟨":10,"⟩\u0001|":10,"|\u0001+":9,"+\u0001|":10,"+\u00011":13,"⟨\u0001f":8,"f\u0001|":9,",\u00011":12,"1\u0001)":32,"3\u0001;":5,";\u0001i":12,"3\u0001-":2,"S\u0001c":15,"c\u0001=":13,"=\u0001⟨":16,";\u00011":7,"c\u0001|":5,"|\u0001f":11,"f\u0001⟩":11,"⟩\u0001+":7,"+\u0001c":4,"(\u0001c":3,"c\u0001+":2,"c\u0001)":2,"#\u0001=":2,"-\u0001c":4,"⟨\u0001a":3,"a\u0001|":3,"|\u0001a":8,"a\u0001⟩":3,"+\u0001(":2,"-\u00014":5,"r\u0001⟨":3,"r\u00016":7,"⟨\u0001b":2,"b\u0001|":2,"|\u0001b":2,"b\u0001⟩":2,"⟨\u0001v":2,"v\u0001|":2,"r\u00015":3,"(\u00010":20,"0\u0001;":2,"=\u0001i":10,"S\u0001d":9,"d\u0001e":5,"e\u0001t":5,"t\u0001(":6,"(\u0001A":4,"A\u0001-":4,"-\u0001λ":10,"λ\u0001I":4,"I\u0001)":5,"2\u0001-":5,"λ\u0001)":4,")\u0001-":9,"1\u0001=":3,"S\u0001λ":17,"λ\u0001-":6,"λ\u0001+":5,"3\u0001=":2,"(\u0001λ":4,"3\u0001)":2,"λ\u0001=":11,"S\u0001A":19,"-\u0001μ":3,"μ\u0001)":2,"i\u0001(":5,"S\u0001μ":5,"μ\u0001-":2,"μ\u0001=":4,"_\u0001x":16,"i\u0001θ":6,"θ\u0001σ":4,"S\u0001e":2,"e\u0001=":10,"=\u0001c":5,"(\u0001θ":25,"θ\u0001)":20,"i\u0001s":4,")\u0001,":2,"|\u0001↑":2,"↑\u0001⟩":2,"+\u0001x":7,"x\u0001⟩":8,"+\u0001e":2,"|\u0001-":3,"⟩\u0001)":3,"4\u0001=":6,"S\u0001U":3,"U\u0001†":3,"†\u0001=":5,"i\u0001;":9,"i\u0001,":9,"†\u0001U":2,"U\u0001=":2,"0\u0001,":7,",\u00012":3,",\u00010":11,"0\u0001)":21,"2\u0001,":4,"_\u0001y":10,"_\u0001z":22,"S\u0001[":5,"σ\u0001σ":2,"-\u0001σ":3,"-\u0001(":10,"_\u0001n":22,"⟨\u0001φ":7,"φ\u0001|":7,"S\u00012":20,"#\u0001L":67,"^\u0001L":25,"(\u0001n":37,"n\u0001π":29,"π\u0001x":27,"L\u0001)":43,"[\u0001-":4,"-\u0001L":6,"π\u0001)":24,"=\u0001L":5,"^\u0001n":8,"(\u0001[":2,"∫\u0001c":2,"L\u0001(":2,"+\u00010":2,"n\u0001+":6,"S\u00013":9,"L\u0001∫":10,"(\u0001π":16,"^\u00014":10,"L\u0001·":5,"·\u00013":5,"3\u0001L":4,"#\u00018":3,"f\u0001(":5,"3\u0001s":2,"-\u0001s":3,"4\u0001φ":2,"φ\u0001(":12,"_\u00013":2,"[\u0001L":7,"∫\u0001|":16,"|\u0001d":14,"∫\u00011":2,"=\u0001·":4,"·\u0001L":7,"S\u0001L":19,"1\u0001|":3,"2\u0001|":9,"|\u0001x":7,"x\u0001̂":6,"̂\u0001|":2,"|\u0001φ":3,")\u0001s":5,"·\u0001(":5,"(\u00019":2,"9\u0001π":2,"b\u0001=":4,"#\u0001π":14,"π\u0001∫":9,"∫\u0001f":2,"n\u0001x":11,"#\u0001n":5,"n\u0001]":2,"π\u0001(":4,"-\u0001a":2,"a\u0001)":19,"#\u0001∫":7,"k\u0001(":6,"+\u0001a":6,"k\u0001a":4,"·\u00011":14,"#\u0001·":3,"·\u0001e":3,"S\u0001k":9,"s\u0001g":2,"g\u0001n":2,"k\u0001-":11,"^\u0001λ":5,"λ\u0001x":6,"e\u0001+":3,"4\u0001)":4,"=\u0001pm":5,"S\u0001y":26,"y\u0001(":22,"=\u0001A":16,"A\u0001c":2,"+\u0001B":9,"B\u0001s":2,"A\u0001=":21,"y\u0001'":4,"'\u0001(":4,"B\u0001=":9,"-\u0001κ":7,"κ\u0001=":5,"pm\u0001κ":2,"κ\u0001x":3,"=\u0001C":6,"C\u0001e":2,"+\u0001D":3,"D\u0001e":2,"S\u0001C":2,"C\u0001=":2,"D\u0001=":3,"=\u0001y":2,"A\u0001s":8,"B\u0001c":4,"=\u0001B":5,"(\u0001L":10,"k\u0001L":9,"k\u0001=":7,"=\u0001n":5,"-\u0001C":2,"+\u0001κ":4,"i\u0001κ":9,"-\u0001B":4,"_\u0001K":2,"^\u0001R":4,"∫\u0001∫":12,"∫\u0001r":9,"r\u0001s":5,"d\u0001φ":6,"φ\u0001d":6,"d\u0001θ":6,"θ\u0001d":6,"d\u0001r":27,"π\u0001·":2,"·\u00012":9,"2\u0001·":14,"4\u0001π":10,"π\u0001R":7,"r\u0001=":13,"V\u0001∫":6,"r\u0001·":3,"·\u0001r":2,"R\u0001)":2,")\u0001·":12,"-\u0001r":23,"r\u0001e":10,"r\u0001π":3,"·\u0001a":3,"S\u0001∇":5,"∇\u0001f":2,"f\u0001=":4,"#\u0001r":12,"r\u0001d":13,"r\u0001(":10,"(\u0001r":17,"r\u0001f":2,"r\u0001)":10,"2\u0001r":5,"a\u0001+":6,"+\u0001r":4,"a\u0001-":3,"(\u0001a":7,"a\u0001r":2,"|\u0001A":29,"A\u0001|":29,"|\u0001r":6,"|\u0001·":6,"2\u0001b":7,"b\u0001)":11,"∇\u0001e":2,"=\u0001d":4,"#\u0001b":7,"b\u0001-":3,"_\u0001a":2,"^\u0001b":2,"|\u0001ψ":29,"ψ\u0001|":23,"x\u0001|":12,"|\u0001∫":10,"2\u0001=":3,"2\u0001!":2,"⟨\u0001x":5,"3\u00010":2,"^\u00015":7,"L\u0001-":4,"#\u00016":7,"∫\u0001(":3,"#\u0001σ":2,"A\u0001e":5,"k\u0001σ":2,"σ\u0001=":2,"r\u0001σ":2,"S\u0001P":5,"P\u0001=":5,"i\u0001ħ":33,"ħ\u0001∂":5,"∂\u0001Ψ":5,"#\u0001∂":8,"∂\u0001t":5,"t\u0001=":4,"ħ\u0001(":9,"ω\u0001)":26,")\u0001Ψ":4,"=\u0001ħ":50,"ħ\u0001ω":13,"-\u0001ħ":23,"2\u0001m":37,"m\u0001)":12,"ħ\u0001k":16,"S\u0001ħ":2,"ω\u0001=":2,"|\u0001Ψ":3,"Ψ\u0001(":2,"L\u0001s":2,"i\u0001E":8,"E\u0001t":5,"#\u0001ħ":18,"S\u0001j":3,"j\u0001=":3,"m\u0001i":3,"(\u0001ψ":6,"ψ\u0001ψ":2,"ψ\u0001'":5,"'\u0001-":2,"-\u0001ψ":2,"ψ\u0001(":16,"ψ\u0001)":3,"'\u0001)":7,"A\u0001i":2,"k\u0001+":19,"k\u0001A":4,"#\u0001m":6,"m\u0001R":2,"ħ\u0001)":17,")\u0001ψ":3,"(\u0001ħ":3,"=\u0001ψ":2,"-\u0001E":3,"E\u0001Ψ":2,"=\u0001E":3,"S\u0001T":2,"T\u0001=":2,"π\u0001ħ":8,"(\u0001E":3,"E\u0001)":3,"=\u0001m":3,"m\u0001L":2,"'\u0001'":6,"S\u0001E":8,"E\u0001=":9,"S\u0001ψ":7,"|\u0001L":2,"⟨\u0001H":7,"H\u0001⟩":7,"2\u0001E":6,"E\u0001+":4,"+\u0001E":3,"Ψ\u0001|":2,"|\u0001Ĥ":5,"Ĥ\u0001|":5,"⟨\u0001ψ":15,"ψ\u0001⟩":19,"+\u0001⟨":2,"∫\u0001ψ":2,"π\u0001σ":3,"σ\u0001)":9,"4\u0001σ":3,"σ\u0001k":3,"2\u0001σ":8,"⟨\u0001k":2,"k\u0001⟩":2,"∫\u0001k":2,"k\u0001|":3,"d\u0001k":6,"⟨\u0001p":3,"p\u0001⟩":2,"ħ\u0001x":8,"_\u0001g":2,"S\u0001v":2,"v\u0001=":2,"d\u0001ω":2,"#\u0001k":2,"p\u0001̂":7,"ψ\u0001=":4,"·\u0001ħ":4,"B\u0001)":4,"i\u0001q":2,"q\u0001C":3,"=\u0001q":2,"-\u0001q":4,"q\u0001)":16,"+\u0001q":13,"2\u0001k":3,"|\u0001B":4,"B\u0001|":4,"κ\u0001)":4,"r\u0001k":2,"|\u0001k":4,"κ\u0001|":5,"|\u0001C":2,"C\u0001|":2,"4\u0001k":2,"k\u0001q":2,"S\u0001κ":3,"κ\u0001A":4,"m\u0001α":6,"ħ\u0001A":2,"-\u0001m":6,"2\u0001ħ":17,"#\u0001)":2,"g\u0001⟩":2,")\u0001g":2,"f\u0001)":3,"g\u0001d":2,"ħ\u0001f":3,"f\u0001'":10,"̂\u0001f":3,"̂\u0001,":2,"̂\u0001]":2,"]\u0001f":2,"=\u0001x":2,"x\u0001f":10,"'\u0001+":4,"+\u0001ħ":7,"⟨\u0001A":2,"A\u0001⟩":2,"5\u0001)":4,"2\u00014":5,"2\u00015":2,"⟨\u0001+":6,"⟨\u0001-":2,"1\u0001·":4,"5\u00010":2,"⟨\u00010":3,"0\u0001|":3,"#\u0001+":2,"3\u0001ħ":4,"5\u0001ħ":2,"6\u0001·":3,"·\u00015":2,"_\u0001+":11,"+\u0001)":2,"(\u0001S":4,"=\u0001S":3,"+\u0001 ":3,"S\u0001S":5,"S\u0001)":3,")\u0001†":3,"2\u0001S":2,"S\u0001m":8,"m\u0001ω":40,"S\u0001â":2,"â\u0001ψ":2,"x\u0001ψ":13,"ψ\u0001+":5,"(\u0001m":14,"d\u0001ψ":9,"S\u0001x":3,"ω\u0001x":3,"â\u0001†":3,"ψ\u0001-":2,")\u0001⟨":8,"†\u0001)":4,"†\u0001|":2,"⟨\u0001n":5,"n\u0001|":5,"|\u0001n":5,"n\u0001⟩":5,"a\u0001†":9,"a\u0001a":2,"†\u0001+":2,"†\u0001a":3,"+\u0001n":2,"n\u0001)":2,"⟨\u00012":4,"|\u00010":5,"0\u0001⟩":9,"L\u0001,":6,",\u0001L":6,"L\u0001=":2,"L\u0001]":4,"i\u0001[":2,"ħ\u0001L":8,"L\u0001+":2,"i\u0001L":2,"^\u00011":10,"L\u0001̂":7,"̂\u0001Y":2,"Y\u0001(":5,"θ\u0001,":5,",\u0001φ":5,"φ\u0001)":5,"(\u00018":3,"8\u0001π":2,"i\u0001φ":16,"∂\u0001φ":2,"ħ\u0001·":5,"·\u0001i":2,"ħ\u0001Y":2,"1\u0001⟩":6,"ħ\u0001|":3,"r\u00011":2,"L\u00011":4,"̂\u0001e":3,"ħ\u0001e":2,"=\u0001μ":2,"̂\u0001s":2,"|\u0001R":5,"R\u0001(":5,"!\u0001a":2,"4\u0001a":3,"1\u00010":4,"⟨\u0001V":2,"V\u0001⟩":2,"V\u0001(":2,"m\u0001a":7,"a\u0001·":2,"+\u0001y":3,"y\u0001|":3,"|\u0001χ":8,"χ\u0001⟩":8,"⟨\u0001S":3,"S\u0001⟩":3,"#\u00011":3,"⟨\u0001χ":2,"χ\u0001|":2,"|\u0001H":7,"H\u0001'":7,"'\u0001|":7,"L\u0001V":6,"V\u0001·":3,"=\u0001V":9,"2\u0001λ":2,"=\u0001λ":3,"2\u0001V":2,"λ\u0001ħ":2}};
const LMV = Object.keys(INKLM.uni).length + 20;
const lmUni = c => ((INKLM.uni[c] || 0) + 0.5) / (INKLM.n + 0.5 * LMV);
function lmPMI(p, c){
  const bi = INKLM.bi[p + '\u0001' + c] || 0, np = INKLM.prev[p] || 0, pu = lmUni(c), beta = 6;
  return Math.log((bi + beta * pu) / (np + beta)) - Math.log(pu);
}
const ROLE_MARK = {top:'S', sup:'^', hi:'^', sub:'_', lo:'_', den:'#', num:'S', rad:'r', cell:'S'};
/* ---------------- Strahlsuche über Lesarten ---------------- */
function bonus(n, c, st, R){
  let b = 0;
  const seq = n.seq, pos = n.pos;
  const prevN = pos > 0 ? seq[pos - 1] : null, nextN = seq[pos + 1];
  const pk = m => m && m.ix !== undefined ? st.picks[m.ix] : null;
  const topAlt = m => m && m.it.k === 'sym' ? m.it.alts[0][0] : m ? m.it.k : null;
  /* Funktionswort endet hier */
  if (isLetterC(c) || isDigit(c) || c === '|' || c === 'S' || c === 'C'){
    for (const w of FUNCWORDS){
      if (pos + 1 < w.length) continue;
      const cc0 = WORDCH[c] && !w.includes(c) ? WORDCH[c] : c;
      if (cc0 !== w[w.length - 1]) continue;
      let ok = true;
      for (let q = 0; q < w.length - 1 && ok; q++){
        const m = seq[pos - w.length + 1 + q];
        if (!m || m.it.k !== 'sym' || m.sub || m.sup || m.it.hat || m.ix === undefined){ ok = false; break; }
        const pc = st.picks[m.ix], cc = WORDCH[pc] && !w.includes(pc) ? WORDCH[pc] : pc;
        if (cc !== w[q]) ok = false;
      }
      if (ok && !n.sub && !n.it.hat){ const nx = topAlt(nextN); b += w.length * Math.log(R.fnB || 5) + (nx === '(' || (nx && isLetterC(nx)) ? Math.log(2) : -Math.log(3)); break; }
    }
  }
  /* neue Abkürzung am Zeilenanfang (κ = …): Abwertung fremder Buchstaben dort ausgleichen */
  if (n.role === 'top' && pos === 0 && isLetterC(c) && !R.rctx.letters.has(c) && nextN && nextN.it.k === 'sym' && nextN.it.alts.some(a => a[0] === '=' && a[1] > 0.3)) b += Math.min(Math.log(10), -Math.log(Math.max(R.W[c] || 1, 0.01)));
  /* Funktionsaufruf ψ(x) */
  if (R.funcs.has(c) && nextN && topAlt(nextN) === '(' && !n.sup) b += Math.log(2.5);
  /* e^… */
  if (c === 'e' && n.sup) b += Math.log(3);
  /* Differential am Ende eines Integranden */
  if (R.dvars.has(c) && prevN && pk(prevN) === 'd' && st.int) b += Math.log(5);
  if (c === 'd' && st.int && nextN && nextN.it.k === 'sym' && R.dvars.has(topAlt(nextN))) b += Math.log(2);
  /* Ableitung im Bruch: d, ∂ im Zähler/Nenner */
  if ((n.role === 'num' || n.role === 'den') && pos === 0 && (c === 'd' || c === '∂')) b += Math.log(2);
  /* Klammern: passende Paare */
  if (CLOSE.has(c) || c === '|'){
    const want = {')':'(', ']':'[', '}':'{', '⟩':'⟨'}[c];
    const open = st.br.length ? st.br[st.br.length - 1] : null;
    if (want && open === want) b += Math.log(3);
    else if (c === '⟩' && open === '|') b += Math.log(3);
    else if (want && open && open !== want) b -= Math.log(4);
  }
  /* Bigramme: Vorgänger auf derselben Ebene (oder Ebenenanfang) */
  if (R.lmW){
    let pv;
    if (!prevN) pv = ROLE_MARK[n.role] || 'S';
    else if (prevN.it.k !== 'sym') pv = ')';
    else { pv = pk(prevN); if (pv === '' || pv == null) pv = 'S'; if (prevN.sup) pv = ')'; }
    const cc = c === '' ? null : c;
    if (cc) b += R.lmW * lmPMI(pv, cc);
  }
  /* Ziffer direkt nach Buchstabe auf der Grundlinie ist selten (wäre meist ein Index) */
  if (isDigit(c) && prevN && n.role !== 'sub' && pk(prevN) && isLetterC(pk(prevN)) && !prevN.sub && !prevN.sup) b -= Math.log(2);
  /* Gleichheitszeichen nicht in Hoch-/Tiefstellung außer bei Σ */
  if (c === '=' && (n.role === 'sup' || n.role === 'sub')) b -= Math.log(5);
  /* ∫, Σ mitten in Hochzahlen unwahrscheinlich */
  if ((c === '∫' || c === 'Σ') && n.role !== 'top' && n.role !== 'num' && n.role !== 'den' && n.role !== 'rad' && n.role !== 'cell') b -= Math.log(10);
  return b;
}
function stepState(st, n, c){
  const br = st.br.slice();
  if (OPEN.has(c)) br.push(c);
  else if (CLOSE.has(c)){ if (br.length) br.pop(); }
  else if (c === '|'){ if (br.length && br[br.length - 1] === '|') br.pop(); else br.push('|'); }
  return {br, int:st.int || c === '∫'};
}
function beamSearch(flat, R, beamW){
  let B = [{lp:0, picks:[], br:[], int:false}];
  for (const n of flat){
    const opts = n.alts;
    const nb = [];
    for (const s of B) for (const [c, p] of opts){
      const lp = s.lp + Math.log(Math.max(p, 1e-6)) + bonus(n, c, s, R);
      const t = stepState(s, n, c);
      const picks = s.picks.slice(); picks[n.ix] = c;
      nb.push({lp, picks, br:t.br, int:t.int});
    }
    nb.sort((a, b) => b.lp - a.lp);
    B = nb.slice(0, beamW);
  }
  return B;
}
function parseOk(text, R){ if (!text.trim()) return false; try { parseLine(text, R.pctx); return true; } catch(e){ return false; } }

/* Neigung der Grundlinie (Bogenmaß, positiv = fällt nach rechts): Grundlinienpunkt je sicherem Buchstaben/Ziffer (Lagetabelle),
   kleine Zeichen (Hoch/Tief) weglassen; Gerade mit den meisten Punkten innerhalb 0,1 Geviert (RANSAC über Punktpaare),
   nur wenn mindestens 5 Punkte und 60 % darauf liegen (Brüche, Hochzahlen und kurze Zeilen bleiben ungedreht) */
function baselineAngle(groups, H){
  const P = [];
  for (const g of groups){
    const c = g.alts[0][0];
    if (!(g.alts[0][1] > 0.3) || !/^[0-9A-Za-zα-ωΑ-Ωħ∂]$/.test(c) || c === 'Σ' || g.tiny) continue;
    const v = VT[vtype(c)], e = g.h / (v[1] - v[0]);
    P.push({x:g.cx, b:g.y1 - v[1] * e, e});
  }
  if (P.length < 5) return 0;
  const me = median(P.map(p => p.e)), Q = P.filter(p => p.e > 0.7 * me), tol = 0.1 * me;
  if (Q.length < 5) return 0;
  let best = null;
  for (let a = 0; a < Q.length; a++) for (let b = a + 1; b < Q.length; b++){
    const dx = Q[b].x - Q[a].x; if (Math.abs(dx) < 0.8 * H) continue;
    const m = (Q[b].b - Q[a].b) / dx; if (Math.abs(m) > 0.3) continue;
    const inl = Q.filter(p => Math.abs(p.b - (Q[a].b + m * (p.x - Q[a].x))) < tol);
    if (!best || inl.length > best.length || (inl.length === best.length && Math.abs(m) < Math.abs(best.m))){ best = inl; best.m = m; }
  }
  if (!best || best.length < Math.max(5, 0.6 * Q.length)) return 0;
  const mx = best.reduce((t, p) => t + p.x, 0) / best.length, mb = best.reduce((t, p) => t + p.b, 0) / best.length;
  let sxy = 0, sxx = 0; best.forEach(p => { sxy += (p.x - mx) * (p.b - mb); sxx += (p.x - mx) * (p.x - mx); });
  const m = sxx > 0 ? sxy / sxx : 0;
  return Math.abs(m) > 0.3 ? 0 : Math.atan(m);
}
/* ---------------- Hauptfunktion ---------------- */
function recognize(strokes, rctx, opts){
  const t0 = Date.now();
  opts = opts || {};
  rctx = rctx || inkContext(null);
  const empty = {text:'', alts:[], items:[], conf:0, ok:false, ms:0};
  if (!strokes || !strokes.length) return empty;
  if (!rctx.oracle && !model()) return Object.assign(empty, {err:'Kein Modell geladen'});
  const clean = strokes.map(pts => pts && pts.length ? (typeof pts[0].x === 'number' ? pts : pts.map(p => ({x:+p.x, y:+p.y}))) : null);
  let k = opts.noDeslant ? 0 : slantOf(clean.filter(Boolean));
  let S = clean.map((pts, i) => pts ? sInfo(pts, i, k) : null).filter(Boolean);
  S.forEach(s => { s.orig = strokes[s.i]; });
  if (!S.length) return empty;
  let H = estimateH(S);
  const R = {rctx, H, E:H / 0.75, wCls:opts.wCls, wGeo:opts.wGeo, lmW:opts.lmW !== undefined ? opts.lmW : 0.6, posW:opts.posW !== undefined ? opts.posW : 0.5, wN:opts.wN, fnB:opts.fnB, W:classWeights(rctx), pctx:rctx.pctx || {}, funcs:rctx.funcs || new Set(), dvars:new Set([...(typeof DIFF_VARS !== 'undefined' ? DIFF_VARS : ['x', 't', 'r', 'k', 'p', 'θ', 'φ']), ...(rctx.coords || [])])};
  /* Geviert aus einer ersten Zeichengruppierung schätzen (Buchstaben und Ziffern, Lage nach Klasse); bei großer Abweichung einmal wiederholen */
  const emPass = () => {
    let groups = [];
    for (let pass = 0; pass < 2; pass++){
      const es = [];
      groups = groupStrokes(S, R);
      groups.forEach(g => { const c = g.alts[0][0]; if (g.alts[0][1] > 0.3 && /^[0-9A-Za-zα-ωΑ-Ωħ∂]$/.test(c) && c !== 'Σ'){ const v = VT[vtype(c)]; es.push(g.h / (v[1] - v[0])); } });
      if (!es.length) break;
      /* Hoch-/Tiefgestelltes ist kleiner: obere Werte zählen (Grundlinie), aber höchstens 1,3 × Median */
      const E1 = Math.min(pct(es, 0.8), 1.3 * median(es));
      if (!(E1 > 4)) break;
      const H1 = 0.75 * E1, changed = Math.abs(H1 - R.H) / R.H > 0.2;
      R.E = E1; R.H = H = H1;
      if (!changed) break;
    }
    return groups;
  };
  const groups0 = emPass();
  /* schräge Grundlinie: Neigung aus den Grundlinienpunkten der ersten Gruppierung (Theil–Sen), ab 2° die Zeile zurückdrehen.
     Kästchen der Ergebnis-Zeichen liegen dann im gedrehten System; die Striche (items[].strokes) bleiben die Originale. */
  const ang = opts.noRotate ? 0 : baselineAngle(groups0, R.H);
  if (Math.abs(ang) > 0.052){
    const all = S.flatMap(s => s.pts), cx = all.reduce((t, p) => t + p.x, 0) / all.length, cy = all.reduce((t, p) => t + p.y, 0) / all.length;
    const c = Math.cos(ang), sn = Math.sin(ang);
    const rot = clean.map(pts => pts ? pts.map(p => ({x:cx + (p.x - cx) * c + (p.y - cy) * sn, y:cy - (p.x - cx) * sn + (p.y - cy) * c})) : null);
    k = opts.noDeslant ? 0 : slantOf(rot.filter(Boolean));
    S = rot.map((pts, i) => pts ? sInfo(pts, i, k) : null).filter(Boolean);
    S.forEach(s => { s.orig = strokes[s.i]; });
    R.H = H = estimateH(S); R.E = H / 0.75;
    emPass();
  }
  if (opts.groupsOnly) return {groups:groupStrokes(S, R).map(g => g.st.map(s => s.i)), H:R.H};
  const nodes = recogRegion(S, R, 0);
  /* Geviert aus den erkannten Zeichen nachschärfen und Lage neu bestimmen, wenn deutlich anders */
  const flat = flatten(nodes, [], 'top', null);
  flat.forEach(n => { n.parentBase = null; });
  (function setParents(list, base){ list.forEach(n => { if (n.sup) { n.sup.forEach(m => { m.parentBase = n.it; }); setParents(n.sup); } if (n.sub) setParents(n.sub); if (n.it.k === 'frac'){ setParents(n.it.num); setParents(n.it.den); } if (n.it.k === 'sqrt') setParents(n.it.inner); if (n.it.k === 'mat') n.it.cells.forEach(r => r.forEach(c => setParents(c))); if (n.lo) setParents(n.lo); if (n.hi) setParents(n.hi); }); })(nodes);
  flat.forEach(n => { n.alts = roleAlts(n, R); });
  const beamW = opts.beam || 64;
  const cands = flat.length ? beamSearch(flat, R, beamW) : [{lp:0, picks:[]}];
  /* offen gebliebene Klammern/Betragsstriche abwerten */
  cands.forEach(c => { if (c.br && c.br.length) c.lp -= 1.5 * c.br.length; });
  cands.sort((a, b) => b.lp - a.lp);
  const alts = [], seen = new Set();
  let firstText = null, firstPicks = null;
  for (const c of cands){
    const text = genText(nodes, c.picks, R, 'top').trim();
    if (firstText === null){ firstText = text; firstPicks = c.picks; }
    if (seen.has(text)) continue;
    seen.add(text);
    if (parseOk(text, R)) alts.push({text, lp:c.lp, picks:c.picks});
    if (alts.length >= 6 || seen.size > 60) break;
  }
  const best = alts[0] || {text:firstText || '', lp:cands[0] ? cands[0].lp : 0, picks:firstPicks || []};
  const ok = !!alts[0];
  const mx = alts.length ? alts[0].lp : 0, Z = alts.reduce((s, a) => s + Math.exp(a.lp - mx), 0) || 1;
  const items = flat.map((n, k) => ({k, role:n.role, c:best.picks[n.ix], show:SHOW(best.picks[n.ix] || ''), alts:n.alts.map(a => a.slice()), x0:n.it.x0, y0:n.it.y0, x1:n.it.x1, y1:n.it.y1, hat:!!n.it.hat, strokes:n.it.st.map(s => s.orig), sidx:n.it.st.map(s => s.i)}));
  const pp = flat.map(n => { const a = n.alts.find(x => x[0] === best.picks[n.ix]); return a ? a[1] : 0.01; });
  const conf = (pp.length ? Math.exp(pp.reduce((s, p) => s + Math.log(Math.max(p, 1e-4)), 0) / pp.length) : 0) * (ok ? 1 : 0.4) * (alts.length ? 1 / Z : 1);
  const res = {text:best.text, alts:alts.map(a => ({text:a.text, score:Math.exp(a.lp - mx) / Z})), items, conf:Math.round(conf * 1000) / 1000, ok, ms:Date.now() - t0};
  Object.defineProperty(res, '_d', {value:{nodes, flat, R, picks:best.picks}, enumerable:false});
  return res;
}
function itemChoices(result, k){
  if (!result || !result._d) return [];
  const {nodes, flat, R, picks} = result._d, n = flat[k];
  if (!n) return [];
  return n.alts.map(([c, p]) => {
    const pk = picks.slice(); pk[n.ix] = c;
    const text = genText(nodes, pk, R, 'top').trim();
    return {c, show:SHOW(c), p, text, ok:parseOk(text, R)};
  });
}
/* Text nach einer Korrektur: Zeichen k wird cls */
function applyChoice(result, k, cls){
  if (!result || !result._d) return result;
  const {nodes, flat, R, picks} = result._d, n = flat[k];
  if (!n) return result;
  const pk = picks.slice(); pk[n.ix] = SHOW_TO_CLS[cls] || cls;
  if (!n.alts.some(a => a[0] === pk[n.ix])) n.alts.push([pk[n.ix], 0.01]);
  const text = genText(nodes, pk, R, 'top').trim();
  const res = Object.assign({}, result, {text, ok:parseOk(text, R), items:result.items.map((it, j) => j === k ? Object.assign({}, it, {c:pk[n.ix], show:SHOW(pk[n.ix])}) : it)});
  Object.defineProperty(res, '_d', {value:{nodes, flat, R, picks:pk}, enumerable:false});
  return res;
}
/* Einzelzeichen (alle Striche = ein Zeichen), z. B. für die Anlernseite: [[klasse, p], …] */
function classifySymbol(strokes, rctx, k){
  if (!strokes || !strokes.length) return [];
  if (!(rctx && rctx.oracle) && !model()) return [];
  const pts = strokes.map(s => Array.isArray(s) ? s : (s && s.pts) || []).filter(s => s.length);
  if (!pts.length) return [];
  const R = {rctx:rctx || {letters:new Set()}, W:rctx ? classWeights(rctx) : {}};
  if (!rctx){ const W = {}; CLASSES.forEach(c => { W[c] = 1; }); R.W = W; }
  return classify(pts.map((p, i) => ({pts:p, i})), R).slice(0, k || 6);
}
/* im Browser: Modell gleich nach dem Start laden (füllt SYMQ_CLASSES); inkModelReady() lädt notfalls sofort */
if (typeof document !== 'undefined' && typeof setTimeout === 'function') setTimeout(() => { try { model(); } catch(e){} }, 0);
return {loadModel, model, rasterize, classifySymbol, cnnEval, evalStrokes, HANDQ, CLASSES, inkContext, recognize, itemChoices, applyChoice, classWeights, STAT, VT, VTYPE, _int:{sInfo, estimateH, groupStrokes, recogRegion, genText, flatten, pairFeat, pairSame}};
})();
var SYMQ_CLASSES = INKR.CLASSES;
var HANDQ = INKR.HANDQ;
function inkContext(taskCtx, extra){ return INKR.inkContext(taskCtx, extra); }
function recognizeInk(strokes, rctx, opts){ return INKR.recognize(strokes, rctx, opts); }
function inkItemChoices(result, k){ return INKR.itemChoices(result, k); }
function inkApplyChoice(result, k, cls){ return INKR.applyChoice(result, k, cls); }
function inkLoadModel(src){ return INKR.loadModel(src); }
function inkRasterize(strokes){ return INKR.rasterize(strokes); }
function inkModelReady(){ return !!INKR.model(); }
function inkClassifySymbol(strokes, rctx, k){ return INKR.classifySymbol(strokes, rctx, k); }
