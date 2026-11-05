/* Synthetische Handschriftzeilen: Syntaxbaum einer Musterzeile → 2D-Satz (Boxen) → Striche.
   Jeder Strich trägt sein Zeichen (_g Nummer, _lab Klasse, _n Strichzahl) für den Orakel-Klassifikator.
   Zeichenformen: eigene Strichschrift (font.js) oder Striche fremder Schreiber (strokes_test.json). */
const {glyph, CLASSES} = require('./font.js');
const CLS = new Set(CLASSES);
/* kleiner Zufallsgenerator mit Startwert */
function rng(seed){ let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const clsOf = ch => ch === 'o' ? '0' : ch === '·' ? '.' : ch === '±' ? 'pm' : ch === '<' ? '⟨' : ch === '>' ? '⟩' : ch;
/* ---------- Boxen ---------- */
function gbox(ch, s, st){
  const g = glyph(ch);
  if (!g) return {w:0.5 * s, asc:0.7 * s, desc:0, items:[{t:'g', ch, cls:clsOf(ch), x:0, y:0, s, missing:true}]};
  /* mit fremden Schreibern: Probe schon beim Setzen wählen, ihre Breite bestimmt den Platz */
  if (st && st.bank){
    const cls = clsOf(ch), sh = shapeOf(cls, ch, st, st.bank);
    if (sh && sh.real){
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      sh.strokes.forEach(q => q.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }));
      const th = (g.y1 - g.y0) * s, flat = th < 0.08 * s, sw = Math.max(x1 - x0, 1e-6), shh = Math.max(y1 - y0, 1e-6);
      const k = flat ? (g.x1 - g.x0) * s / sw : Math.min(th / shh, 4 * Math.max(g.x1 - g.x0, 0.3) * s / sw);
      const w = Math.max(sw * k, 0.05 * s);
      return {w:w + 0.06 * s, asc:-g.y0 * s, desc:Math.max(0, g.y1 * s), items:[{t:'g', ch, cls, x:0, y:0, s, smp:sh, fitw:w}]};
    }
  }
  return {w:g.adv * s, asc:-g.y0 * s, desc:Math.max(0, g.y1 * s), items:[{t:'g', ch, cls:clsOf(ch), x:0, y:0, s}]};
}
function place(b, dx, dy){ return {w:b.w, asc:b.asc - dy, desc:b.desc + dy, items:b.items.map(it => Object.assign({}, it, {x:it.x + dx, y:it.y + dy}))}; }
let GAPR = null;   /* Zufall für einzelne Lücken (pro Zeile gesetzt) */
function hcat(list, gaps){
  let x = 0, asc = 0, desc = 0; const items = [];
  list.forEach((b, k) => { if (!b) return; if (k && gaps) x += (gaps[k - 1] || 0) * (GAPR ? 0.6 + 0.8 * GAPR() : 1); b.items.forEach(it => items.push(Object.assign({}, it, {x:it.x + x}))); asc = Math.max(asc, b.asc); desc = Math.max(desc, b.desc); x += b.w; });
  return {w:x, asc, desc, items};
}
function overlay(a, b, dx, dy){ const pb = place(b, dx, dy); return {w:Math.max(a.w, dx + b.w), asc:Math.max(a.asc, pb.asc), desc:Math.max(a.desc, pb.desc), items:a.items.concat(pb.items)}; }
function text(str, s, st){ const bs = [...str].map(ch => gbox(ch, s, st)); return hcat(bs, bs.map(() => st.cg * s)); }
function delim(ch, inner, s, st){
  /* Klammer passend zur Höhe des Inhalts */
  const big = inner.asc > 0.85 * s || inner.desc > 0.32 * s;
  if (!big) return gbox(ch, s, st);
  const top = -(inner.asc + 0.08 * s), bot = inner.desc + 0.08 * s;
  const g = glyph(ch), w = (g.x1 - g.x0) * s * (1 + 0.25 * (bot - top) / s);
  return {w:w + 0.08 * s, asc:-top, desc:bot, items:[{t:'g', ch, cls:clsOf(ch), x:0, y:0, s, fit:{x0:0.02 * s, x1:0.02 * s + Math.min(w, 0.45 * s), y0:top, y1:bot}}]};
}
const stripGrp = n => n && n.t === 'grp' && n.br === '(' ? n.a : n;
/* ---------- Satz eines Syntaxbaums ---------- */
function R(n, s, st, env){
  env = env || {};
  const R1 = (m, e) => R(m, s, st, Object.assign({}, env, e || {}));
  const g = st.cg * s, og = st.og * s;
  switch (n.t){
    case 'num': return text(n.v === Infinity ? '∞' : (n.txt || String(n.v)), s, st);
    case 'sym': {
      let b = text(n.name === 'Gamma' ? 'Γ' : n.name, s, st);
      if (n.hat){ const gl = b.items[0]; b = {w:b.w, asc:Math.max(b.asc, b.asc + 0.22 * s), desc:b.desc, items:b.items.concat([{t:'hat', x:0.05 * s, y:-(b.asc + 0.08 * s), w:Math.max(0.28 * s, b.w - 0.1 * s), h:0.16 * s, s}])}; }
      let sub = n.sub ? subBox(n.sub, s, st) : null, sup = null;
      if (n.sup) sup = text('(' + n.sup + ')', s * st.ss, st);
      if (n.supE) sup = R(n.supE, s * st.ss, st, {scr:true});
      return scripts(b, sub, sup, s, st);
    }
    case 'add': {
      const parts = [], gaps = [], G2 = env.scr ? g : og;
      n.a.forEach((t, i) => {
        let op = null, body = t;
        if (t.t === 'neg'){ op = '-'; body = t.a; } else if (t.t === 'pm'){ op = '±'; body = t.a; } else if (i) op = '+';
        const bb = body.t === 'add' ? paren(R1(body), s, st) : R1(body);
        if (op){ if (parts.length) gaps.push(G2); parts.push(gbox(op, s, st)); gaps.push(i ? G2 : g); }
        else if (parts.length) gaps.push(G2);
        parts.push(bb);
      });
      return hcat(parts, gaps);
    }
    case 'neg': { const a = n.a.t === 'add' ? paren(R1(n.a), s, st) : R1(n.a); return hcat([gbox('-', s, st), a], [g]); }
    case 'pm': return hcat([gbox('±', s, st), R1(n.a)], [g]);
    case 'mul': {
      const parts = [], gaps = [];
      n.a.forEach((f, i) => {
        let b = (f.t === 'add' || (f.t === 'neg' && i > 0)) ? paren(R1(f), s, st) : R1(f);
        if (i){ if (n.ex && n.ex[i]){ gaps.push(og * 0.7); parts.push(gbox('·', s, st)); gaps.push(og * 0.7); } else gaps.push(st.fg * s * (f.t === 'div' || n.a[i - 1].t === 'div' ? 1.6 : 1)); }
        parts.push(b);
      });
      return hcat(parts, gaps);
    }
    case 'tensor': return hcat([R1(n.a), gbox('⊗', s, st), R1(n.b)], [og, og]);
    case 'div': {
      /* a/b c/d liest der Parser als ((a/b)·c)/d: so zeichnen, wie man es schreibt (gleichwertig) */
      if (n.a.t === 'mul' && !env.noSplit){
        const f = n.a.a, ex = n.a.ex || [];
        let cut = 0;
        for (let i = 1; i < f.length; i++) if (ex[i] || ['div', 'mat', 'deriv', 'int', 'sum'].includes(f[i - 1].t)) cut = i;
        if (cut > 0){
          const pre = {t:'mul', a:f.slice(0, cut), ex:ex.slice(0, cut)};
          const num = f.length - cut === 1 ? f[cut] : {t:'mul', a:f.slice(cut), ex:[false].concat(ex.slice(cut + 1))};
          const fr = R(Object.assign({}, n, {a:num}), s, st, Object.assign({}, env, {noSplit:true}));
          const pb = R1(pre);
          return ex[cut] ? hcat([pb, gbox('·', s, st), fr], [og * 0.7, og * 0.7]) : hcat([pb, fr], [st.fg * s * 1.6]);
        }
      }
      env = Object.assign({}, env, {noSplit:false});
      const simple = m => m.t === 'num' || m.t === 'sym' || (m.t === 'pow' && (m.a.t === 'sym' || m.a.t === 'num'));
      if (env.scr && st.r() < st.inline && simple(stripGrp(n.a)) && simple(stripGrp(n.b))) return hcat([R1(stripGrp(n.a)), gbox('/', s, st), R1(stripGrp(n.b))], [g, g]);
      return frac(R1(stripGrp(n.a)), R1(stripGrp(n.b)), s, st);
    }
    case 'pow': {
      if (n.fnpow && n.a.t === 'call'){ const f = n.a; const head = scripts(text(f.fn === 'cos' || f.fn === 'cosh' ? f.fn.replace('o', 'o') : f.fn, s, st), null, R(stripGrp(n.b), s * st.ss, st, {scr:true}), s, st); return hcat([head, args(f.args, s, st, env)], [st.pg * 0.8 * s]); }
      let a = n.a;
      if (a.t === 'sym' && a.sub && !a.sup && !a.supE){
        const b0 = R1(Object.assign({}, a, {sub:null}));
        return scripts(b0, subBox(a.sub, s, st), R(stripGrp(n.b), s * st.ss, st, {scr:true}), s, st);
      }
      let base = ['add', 'neg', 'mul', 'div', 'pm'].includes(a.t) ? paren(R1(a), s, st) : R1(a);
      return scripts(base, null, R(stripGrp(n.b), s * st.ss, st, {scr:true}), s, st);
    }
    case 'call': {
      if (n.fn === 'sqrt') return radical(R1(stripGrp(n.args[0])), s, st);
      if (typeof n.fn === 'string'){
        const name = n.fn === 'Gamma' ? 'Γ' : n.fn;
        const head = text(name, s, st);
        if (n.args.noParen) return hcat([head, R1(n.args[0])], [st.fg * s]);
        return hcat([head, args(n.args, s, st, env)], [st.pg * 0.8 * s]);
      }
      let head = n.fn.t === 'prime' ? R1(n.fn) : R1(n.fn);
      if (n.primes) head = primes(head, n.primes, s, st);
      return hcat([head, args(n.args, s, st, env)], [st.pg * 0.8 * s]);
    }
    case 'prime': return primes(R1(n.a), n.n, s, st);
    case 'conj': { const a = ['add', 'neg', 'mul', 'div'].includes(n.a.t) ? paren(R1(n.a), s, st) : R1(n.a); return scripts(a, null, gbox('*', s * st.ss, st), s, st); }
    case 'dag': { const a = ['add', 'neg', 'mul', 'div'].includes(n.a.t) ? paren(R1(n.a), s, st) : R1(n.a); return scripts(a, null, gbox(st.r() < st.dagPlus ? '+' : '†', s * st.ss, st), s, st); }
    case 'fact': { const a = n.a.t === 'sym' || n.a.t === 'num' ? R1(n.a) : paren(R1(stripGrp(n.a)), s, st); return hcat([a, gbox('!', s, st)], [0.03 * s]); }
    case 'grp': {
      const inner = R1(n.a), o = n.br === '[' ? '[' : n.br === '{' ? '{' : '(', c = n.br === '[' ? ']' : n.br === '{' ? '}' : ')';
      return hcat([delim(o, inner, s, st), inner, delim(c, inner, s, st)], [st.pg * s, st.pg * s]);
    }
    case 'mat': {
      /* Zeilenvektor schreibt man mit Kommas */
      if (n.rows.length === 1){ const parts = [], gaps = []; n.rows[0].forEach((c, i) => { if (i){ parts.push(gbox(',', s, st)); gaps.push(0.02 * s); gaps.push(og); } parts.push(R1(c)); }); const inner = hcat(parts, gaps); return hcat([delim('(', inner, s, st), inner, delim(')', inner, s, st)], [st.pg * s, st.pg * s]); }
      return matrix(n.rows.map(r => r.map(c => R1(c))), s, st);
    }
    case 'comm': { const a = R1(n.a), b = R1(n.b), o = n.anti ? '{' : '[', c = n.anti ? '}' : ']'; const inner = hcat([a, gbox(',', s, st), b], [0.04 * s, og]); return hcat([delim(o, inner, s, st), inner, delim(c, inner, s, st)], [st.pg * s, st.pg * s]); }
    case 'evalbr': {
      const inner = R1(n.a), br = hcat([delim('[', inner, s, st), inner, delim(']', inner, s, st)], [st.pg * s, st.pg * s]);
      const lo = n.v ? hcat([text(n.v, s * st.ss, st), gbox('=', s * st.ss, st), R(n.lo, s * st.ss, st, {scr:true})], [g, g]) : R(n.lo, s * st.ss, st, {scr:true});
      return scripts(br, lo, R(n.hi, s * st.ss, st, {scr:true}), s, st, true);
    }
    case 'abs': { const inner = R1(n.a); return hcat([delim('|', inner, s, st), inner, delim('|', inner, s, st)], [st.pg * s, st.pg * s]); }
    case 'ket': { const inner = labels(n.lab, s, st, env); return hcat([delim('|', inner, s, st), inner, delim('⟩', inner, s, st)], [st.pg * s, st.pg * s]); }
    case 'bra': { const inner = labels(n.lab, s, st, env); return hcat([delim('⟨', inner, s, st), inner, delim('|', inner, s, st)], [st.pg * s, st.pg * s]); }
    case 'expect': { const inner = R1(n.a); return hcat([delim('⟨', inner, s, st), inner, delim('⟩', inner, s, st)], [st.pg * s, st.pg * s]); }
    case 'braket': {
      const parts = [labels(n.bra, s, st, env)]; if (n.op) parts.push(R1(n.op)); parts.push(labels(n.ket, s, st, env));
      const hh = hcat(parts, parts.map(() => 0));
      const bars = [delim('⟨', hh, s, st)]; const gaps = [st.pg * s];
      parts.forEach((p, k) => { bars.push(p); gaps.push(st.pg * s); if (k < parts.length - 1){ bars.push(delim('|', hh, s, st)); gaps.push(st.pg * s); } });
      bars.push(delim('⟩', hh, s, st));
      return hcat(bars, gaps);
    }
    case 'int': {
      const I = gbox('∫', s, st);
      let head = I;
      if (n.lo || n.hi){
        const lo = n.lo ? R(n.lo, s * st.ls, st, {scr:true}) : null, hi = n.hi ? R(n.hi, s * st.ls, st, {scr:true}) : null;
        if (st.r() < st.stackInt){ head = I; if (lo) head = overlay(head, lo, (I.w - lo.w) / 2, I.desc + lo.asc + 0.04 * s); if (hi) head = overlay(head, hi, (I.w - hi.w) / 2 + 0.05 * s, -(I.asc + hi.desc + 0.04 * s)); }
        else { if (lo) head = overlay(head, lo, I.w - 0.08 * s, I.desc - 0.05 * s); if (hi) head = overlay(head, hi, I.w + 0.02 * s, -I.asc + hi.asc * 0.6); }
      }
      const body = R1(n.a), dv = text('d' + n.v.replace("'", ''), s, st);
      if (n.dfirst) return hcat([head, dv, body], [og, og]);
      return hcat([head, body, dv], [og * 0.8, og]);
    }
    case 'sum': {
      const Sg = gbox('Σ', s, st);
      let head = Sg;
      const lo = n.v ? hcat([text(n.v, s * st.ls, st)].concat(n.lo ? [gbox('=', s * st.ls, st), R(n.lo, s * st.ls, st, {scr:true})] : []), [st.pg * s, st.pg * s]) : null;
      const hi = n.hi ? R(n.hi, s * st.ls, st, {scr:true}) : null;
      if (lo) head = overlay(head, lo, (Sg.w - lo.w) / 2, Sg.desc + lo.asc + 0.05 * s);
      if (hi) head = overlay(head, hi, (Sg.w - hi.w) / 2, -(Sg.asc + hi.desc + 0.05 * s));
      if (lo && lo.w > Sg.w) head = place(head, (lo.w - Sg.w) / 2, 0), head.w += (lo.w - Sg.w) / 2;
      return hcat([head, R1(n.a)], [og * 0.8]);
    }
    case 'deriv': {
      const D = n.partial ? '∂' : 'd';
      const ord = k => k > 1 ? R({t:'num', v:k}, s * st.ss, st, {scr:true}) : null;
      let num = scripts(gbox(D, s, st), null, ord(n.n), s, st);
      if (n.leibniz && n.a){ const a = n.a.t === 'conj' ? scripts(R1(n.a.a), null, gbox('*', s * st.ss, st), s, st) : R1(n.a); num = hcat([num, a], [0.04 * s]); }
      const den = scripts(hcat([gbox(D, s, st), text(n.v.replace("'", ''), s, st)], [0.04 * s]), null, ord(n.n), s, st);
      const fr = frac(num, den, s, st);
      if (n.leibniz || !n.a) return fr;
      return hcat([fr, R1(n.a)], [st.fg * s * 1.5]);
    }
    case 'lap': return n.grad ? gbox('∇', s, st) : scripts(gbox('∇', s, st), null, R({t:'num', v:2}, s * st.ss, st), s, st);
    case 'unc': return hcat([gbox('Δ', s, st), R1(n.a)], [0.03 * s]);
    case 'spec': return text(n.v, s, st);
    case 'list': { const parts = [], gaps = []; n.a.forEach((x, i) => { if (i && !n.tight && !env.subList){ parts.push(gbox(',', s, st)); gaps.push(0.02 * s); gaps.push(g * 2); } else if (i) gaps.push(g); parts.push(R1(x)); }); return hcat(parts, gaps); }
    case 'unit': return text(n.v || '?', s, st);
  }
  return text('?', s, st);
}
function subBox(sub, s, st){ return R(sub, s * st.ss, st, {scr:true, subList:true}); }
function paren(b, s, st){ return hcat([delim('(', b, s, st), b, delim(')', b, s, st)], [st.pg * s, st.pg * s]); }
function args(list, s, st, env){
  const parts = [], gaps = [];
  list.forEach((a, i) => { if (i){ parts.push(gbox(',', s, st)); gaps.push(0.02 * s); gaps.push(st.og * s); } parts.push(R(a, s, st, env)); });
  const inner = hcat(parts, gaps);
  return hcat([delim('(', inner, s, st), inner, delim(')', inner, s, st)], [st.pg * s, st.pg * s]);
}
function labels(labs, s, st, env){ const parts = [], gaps = []; labs.forEach((l, i) => { if (i){ parts.push(gbox(',', s, st)); gaps.push(0.02 * s); gaps.push(0.12 * s); } parts.push(R(l, s, st, env)); }); return hcat(parts, gaps); }
function scripts(base, sub, sup, s, st, tall){
  let b = base;
  const x = base.w + st.sg * s;
  if (sub){ const dy = Math.max(st.sd * s, base.desc * (tall ? 0.8 : 0.5)) + sub.asc * 0.25; b = overlay(b, sub, x - 0.02 * s, dy); }
  if (sup){
    let dy = -st.sr * s;
    if (base.asc > 0.9 * s) dy = -(base.asc - 0.3 * s) ;
    dy = Math.min(dy, -(sup.desc + 0.18 * s));
    b = overlay(b, sup, x + (sub ? 0.02 * s : 0), dy);
  }
  if (sub || sup) b.w = Math.max(b.w, x + Math.max(sub ? sub.w : 0, sup ? sup.w : 0));
  return b;
}
function primes(b, n, s, st){ let out = b; for (let k = 0; k < n; k++){ const p = gbox("'", s, st); out = overlay(out, p, out.w + 0.03 * s, -(b.asc - 0.05 * s)); } return out; }
function frac(num, den, s, st){
  const W = Math.max(num.w, den.w) + 0.18 * s, axis = 0.28 * s, gp = st.fgap * s;
  const nb = place(num, (W - num.w) / 2, -(axis + gp + num.desc));
  const db = place(den, (W - den.w) / 2, -axis + gp + den.asc);
  return {w:W, asc:nb.asc, desc:Math.max(0, db.desc), items:[{t:'bar', x:0, y:-axis, w:W, s}].concat(nb.items, db.items)};
}
function radical(inner, s, st){
  const top = -(inner.asc + 0.12 * s), bot = Math.max(inner.desc, 0) + 0.05 * s, hw = 0.35 * s;
  const b = place(inner, hw + 0.06 * s, 0);
  return {w:hw + inner.w + 0.15 * s, asc:-top, desc:bot, items:[{t:'rad', x:0, y:0, y0:top, y1:bot, hw, w:hw + inner.w + 0.15 * s, s}].concat(b.items)};
}
function matrix(rows, s, st){
  const nr = rows.length, nc = rows[0].length;
  const cw = []; for (let c = 0; c < nc; c++) cw.push(Math.max(...rows.map(r => r[c].w)));
  const rh = rows.map(r => ({asc:Math.max(...r.map(b => b.asc), 0.5 * s), desc:Math.max(...r.map(b => b.desc), 0.05 * s)}));
  const cg = st.mcg * s, rg = st.mrg * s;
  let y = 0; const ys = [];
  rh.forEach((h, k) => { if (k) y += rh[k - 1].desc + rg + h.asc; ys.push(y); });
  const totalTop = -rh[0].asc, totalBot = ys[nr - 1] + rh[nr - 1].desc, mid = (totalTop + totalBot) / 2, shift = -0.28 * s - mid;
  let items = [], x = 0;
  for (let c = 0; c < nc; c++){ for (let r = 0; r < nr; r++){ const b = rows[r][c]; items = items.concat(place(b, x + (cw[c] - b.w) / 2, ys[r] + shift).items); } x += cw[c] + (c < nc - 1 ? cg : 0); }
  const inner = {w:x, asc:-(totalTop + shift), desc:totalBot + shift, items};
  return hcat([delim('(', inner, s, st), inner, delim(')', inner, s, st)], [1.3 * st.pg * s, 1.3 * st.pg * s]);
}
function renderLine(ast, st){
  const parts = [], gaps = [];
  const push = (b, gap) => { if (parts.length) gaps.push(gap); parts.push(b); };
  ast.stmts.forEach((S, i) => {
    if (i) push(gbox(',', 1, st), 0.02);
    if (S.cont) push(gbox(S.rels[0], 1, st), i ? 0.4 : 0);
    S.parts.forEach((p, k) => {
      if (k) push(gbox(S.rels[S.cont ? k : k - 1], 1, st), st.og * 1.2);
      push(R(p, 1, st, {}), (k || S.cont) ? st.og * 1.2 : (i ? 0.4 : 0));
    });
  });
  return hcat(parts, gaps);
}
/* ---------- Striche erzeugen ---------- */
function style(seed, opts){
  const r = rng(seed * 7919 + 13);
  opts = opts || {};
  const u = (a, b) => a + (b - a) * r();
  /* Abstände nach CROHME-Messung (Lücke zwischen Nachbarzeichen: Median ≈ 0,24 Zeichenhöhen, Quartile 0,08–0,7) */
  return Object.assign({r, em:u(30, 44), cg:u(0.08, 0.2), fg:u(0.15, 0.32), og:u(0.2, 0.38), ss:u(0.6, 0.72), ls:u(0.55, 0.68), sr:u(0.38, 0.52), sd:u(0.14, 0.26), fgap:u(0.07, 0.16),
    slant:u(-0.02, 0.18), drift:u(0.0, 0.1), period:u(6, 14), phase:u(0, 6.28), jit:u(0.01, 0.035), sjit:u(0.03, 0.09), noise:u(0.1, 0.5), stackInt:0.4, inline:0.3, dagPlus:0.25,
    mcg:u(0.6, 0.9), mrg:u(0.25, 0.45), xr:u(0.62, 0.72), pg:u(0.08, 0.24), sg:u(0.03, 0.12)}, opts);
}
function resample(pts, step){
  if (pts.length < 2) return pts;
  const out = [pts[0]];
  for (let k = 1; k < pts.length; k++){
    const a = pts[k - 1], b = pts[k], d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / step));
    for (let q = 1; q <= n; q++) out.push([a[0] + (b[0] - a[0]) * q / n, a[1] + (b[1] - a[1]) * q / n]);
  }
  return out;
}
/* HASY-Skelette zerfallen in Teilstücke; Stifteingabe ist zusammenhängend: Stücke mit nahen Endpunkten verbinden */
function joinFragments(strokes){
  let S = strokes.map(s => s.slice());
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  S.forEach(s => s.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }));
  const lim = 0.16 * Math.max(x1 - x0, y1 - y0, 1);
  const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  for (;;){
    let best = null;
    for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++){
      const a = S[i], b = S[j], A = [a[0], a[a.length - 1]], B = [b[0], b[b.length - 1]];
      for (let ea = 0; ea < 2; ea++) for (let eb = 0; eb < 2; eb++){ const dd = d(A[ea], B[eb]); if (!best || dd < best.d) best = {i, j, ea, eb, d:dd}; }
    }
    if (!best || best.d > lim) break;
    let a = S[best.i], b = S[best.j];
    if (best.ea === 0) a = a.slice().reverse();
    if (best.eb === 1) b = b.slice().reverse();
    S[best.i] = a.concat(b); S.splice(best.j, 1);
  }
  return S;
}
/* Zeichenform holen: Schrift oder fremder Schreiber */
function shapeOf(cls, ch, st, bank){
  /* Szenario „ein Schreiber“: zuerst Proben dieses Schreibers */
  if (bank && bank.__wb && bank.__wb[cls] && bank.__wb[cls].length){
    const W = bank.__wb[cls], smp = W[Math.floor(st.r() * W.length)];
    bank.__wbHits = (bank.__wbHits || 0) + 1;
    return {strokes:smp.map(s => s.map(p => [p[0], p[1]])), real:true};
  }
  if (bank && bank.__wb) bank.__wbMiss = (bank.__wbMiss || 0) + 1;
  if (bank && bank[cls] && bank[cls].length){
    const k = Math.floor(st.r() * bank[cls].length), smp = bank[cls][k];
    let strokes = smp.map(s => s.map(p => Array.isArray(p) ? [p[0], p[1]] : [p.x, p.y]));
    const src = bank.__meta && bank.__meta[cls] && bank.__meta[cls][k] ? bank.__meta[cls][k].src : 'crohme';
    if (src !== 'crohme' && !bank.__raw) strokes = joinFragments(strokes);
    return {strokes, real:true};
  }
  const g = glyph(ch) || glyph(cls);
  return g ? {strokes:g.strokes, real:false, g} : null;
}
function toStrokes(box, st, bank){
  const out = [], glyphs = [];
  let gid = 0;
  const em = st.em, X0 = 20, Y0 = 20 + box.asc * em;
  const tf = (x, y) => {
    const yy = y + st.drift * Math.sin(2 * Math.PI * x / st.period + st.phase);
    return {x:X0 + (x - st.slant * yy) * em + (st.r() - 0.5) * st.noise, y:Y0 + yy * em + (st.r() - 0.5) * st.noise};
  };
  const emit = (pl, info) => {
    const id = ++gid;
    const strokes = pl.map(s => resample(s, 2.5 / em)).map(s => s.map(([x, y]) => tf(x, y)));
    strokes.forEach(s => { Object.defineProperty(s, '_g', {value:id}); Object.defineProperty(s, '_lab', {value:info.cls}); Object.defineProperty(s, '_n', {value:strokes.length}); out.push(s); });
    glyphs.push(Object.assign({id, n:strokes.length}, info));
  };
  for (const it of box.items){
    const s = it.s, jx = (st.r() - 0.5) * 2 * st.jit * s, jy = (st.r() - 0.5) * 2 * st.jit * s, js = 1 + (st.r() - 0.5) * 2 * st.sjit;
    if (it.t === 'bar'){ const a = st.r() * 0.03 * s; emit([[[it.x + 0.02 * s, it.y + a], [it.x + it.w - 0.02 * s, it.y - a]]], {cls:'-', role:'bar'}); continue; }
    if (it.t === 'hat'){ emit([[[it.x, it.y], [it.x + it.w / 2, it.y - it.h], [it.x + it.w, it.y]]], {cls:'^', role:'hat'}); continue; }
    if (it.t === 'rad'){
      const y0 = it.y + it.y0, y1 = it.y + it.y1, hw = it.hw;
      emit([[[it.x, (y0 + y1) / 2 + 0.05 * s], [it.x + 0.08 * s, (y0 + y1) / 2 - 0.02 * s], [it.x + hw * 0.45, y1], [it.x + hw, y0], [it.x + it.w, y0 + 0.01 * s]]], {cls:'sqrt', role:'rad'});
      continue;
    }
    const cls = it.cls, sh = it.smp || shapeOf(cls, it.ch, st, bank);
    if (!sh){ glyphs.push({cls, missing:true}); continue; }
    const g = glyph(it.ch) || glyph(cls) || {x0:0, x1:0.4, y0:-0.7, y1:0};
    let pl;
    if (sh.real){
      /* Probe in das Zielfeld der Schrift einpassen (Seitenverhältnis der Probe behalten) */
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      sh.strokes.forEach(s => s.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }));
      const tb = it.fit || (it.fitw ? {x0:0, x1:it.fitw, y0:g.y0 * s, y1:g.y1 * s} : {x0:g.x0 * s, x1:g.x1 * s, y0:g.y0 * s, y1:g.y1 * s});
      const th = tb.y1 - tb.y0, tw = tb.x1 - tb.x0, sw = Math.max(x1 - x0, 1e-6), shh = Math.max(y1 - y0, 1e-6);
      const flat = th < 0.08 * s;
      /* Höhe wie in der Schrift (Breite folgt der Probe, nur extreme Breiten begrenzen) */
      let k = flat ? tw / sw : Math.min(th / shh, 4 * Math.max(tw, 0.3 * s) / sw), kx = k;
      /* gestreckte Klammer: in ihr Feld einpassen (Breite eigens) */
      if (it.fit && !flat){ k = th / shh; kx = Math.min(k, Math.max(tw, 0.12 * s) / sw); }
      const cxT = (tb.x0 + tb.x1) / 2, cyT = (tb.y0 + tb.y1) / 2;
      pl = sh.strokes.map(st2 => st2.map(([x, y]) => [it.x + cxT + (x - (x0 + x1) / 2) * kx * js + jx, it.y + cyT + (y - (y0 + y1) / 2) * k * js + jy]));
    } else if (it.fit){
      const fx = (it.fit.x1 - it.fit.x0) / Math.max(g.x1 - g.x0, 1e-6), fy = (it.fit.y1 - it.fit.y0) / Math.max(g.y1 - g.y0, 1e-6);
      pl = sh.strokes.map(st2 => st2.map(([x, y]) => [it.x + it.fit.x0 + (x - g.x0) * fx + jx, it.y + it.fit.y0 + (y - g.y0) * fy + jy]));
    } else {
      pl = sh.strokes.map(st2 => st2.map(([x, y]) => [it.x + x * s * js + jx, it.y + y * s * js + jy]));
    }
    emit(pl, {cls, ch:it.ch});
  }
  return {strokes:out, glyphs};
}
/* Orakel: bekannte Klasse, wenn die Gruppe genau die Striche eines Zeichens umfasst */
function oracle(pts){
  if (!pts.length) return null;
  const g = pts[0]._g;
  if (g === undefined || !pts.every(p => p._g === g) || pts.length !== pts[0]._n) return [['?', 0.01]];
  return [[pts[0]._lab, 0.995], ['?', 0.005]];
}
/* Strukturtypen einer Zeile */
function structTypes(ast){
  const T = new Set();
  const walk = n => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)){ n.forEach(walk); return; }
    switch (n.t){
      case 'div': T.add('Bruch'); break;
      case 'deriv': T.add(n.leibniz ? 'dψ/dx' : 'd/dx'); if (n.partial) T.add('∂'); if (n.n > 1) T.add('2. Ableitung'); break;
      case 'pow': T.add('Potenz'); break;
      case 'call': if (n.fn === 'sqrt') T.add('Wurzel'); else if (typeof n.fn === 'string') T.add('Funktion'); else T.add('ψ(x)'); if (n.primes) T.add("Strich '"); break;
      case 'prime': T.add("Strich '"); break;
      case 'conj': T.add('^*'); break;
      case 'dag': T.add('†'); break;
      case 'int': T.add(n.lo || n.hi ? '∫ mit Grenzen' : '∫'); break;
      case 'sum': T.add('Σ'); break;
      case 'mat': T.add(n.rows.length === 1 ? 'Zeilenvektor' : n.rows[0].length > 1 ? 'Matrix' : 'Spaltenvektor'); break;
      case 'ket': case 'bra': case 'braket': case 'expect': T.add('Dirac'); break;
      case 'comm': T.add('Kommutator'); break;
      case 'evalbr': T.add('[…]_a^b'); break;
      case 'abs': T.add('Betrag'); break;
      case 'sym': if (n.sub) T.add('Index'); if (n.hat) T.add('Dach'); break;
    }
    for (const k of Object.keys(n)) if (k !== 't' && n[k] && typeof n[k] === 'object') walk(n[k]);
  };
  walk(ast);
  return T;
}
function synthLine(ast, seed, opts){
  const st = style(seed, opts && opts.style);
  st.bank = opts && opts.bank || null;
  GAPR = rng(seed * 31 + 7);
  const box = renderLine(ast, st);
  GAPR = null;
  const res = toStrokes(box, st, opts && opts.bank);
  res.missing = res.glyphs.filter(g => g.missing || !(CLS.has(g.cls) || g.cls === '^')).map(g => g.cls || g.ch);
  res.style = st;
  return res;
}
module.exports = {synthLine, renderLine, toStrokes, style, oracle, structTypes, rng, CLS};
