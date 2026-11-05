/* ===== Bedeutung im Aufgabenkontext: Syntaxbaum -> Kernausdruck oder Operator ===== */
class ElabError extends Error { constructor(msg, kind, data){ super(msg); this.kind = kind || 'elab'; this.data = data; } }
class NeedUnroll extends Error {}

const FNMAP = {sin:'sin', cos:'cos', tan:'tan', cot:'cot', sinh:'sinh', cosh:'cosh', tanh:'tanh', coth:'coth', exp:'exp', ln:'ln', log:'ln',
  sqrt:'sqrt', arctan:'atan', atan:'atan', arcsin:'asin', asin:'asin', arccos:'acos', acos:'acos', Re:'re', Im:'im', erf:'erf', sgn:'sgn',
  hermite:'hermite', laguerre:'laguerre', legendre:'legendre', fact:'fact', binom:'binom', abs:'abs', conj:'conj'};

/* ---------- Operatoren in Ortsdarstellung ---------- */
const isOp = r => r && r.op === true;
const val = e => ({op:false, e});
function opMul(c){ return {op:true, ap:e => mul(c, e), adj:() => opMul(conjE(c)), mulv:c}; }
function opD(v, n){ return {op:true, ap:e => diff(e, v, n), adj:() => (n % 2 ? opScale(N(-1), opD(v, n)) : opD(v, n))}; }
function opComp(A, B){ return {op:true, ap:e => A.ap(B.ap(e)), adj:() => { const a = A.adj && A.adj(), b = B.adj && B.adj(); return a && b ? opComp(b, a) : null; }}; }
function opScale(c, A){ return {op:true, ap:e => mul(c, A.ap(e)), adj:() => { const a = A.adj && A.adj(); return a ? opScale(conjE(c), a) : null; }}; }
function opSum(list){ return {op:true, ap:e => add(list.map(A => A.ap(e))), adj:() => { const L = list.map(A => A.adj && A.adj()); return L.every(Boolean) ? opSum(L) : null; }}; }
const asOp = r => isOp(r) ? r : opMul(r.e);

/* ---------- Testfunktionen ---------- */
function testFunction(name, vars, dom, S, opts){
  // zufällige, glatte Funktion; Koeffizienten hängen von der Stichprobe ab
  const R = S.rnd(name);
  const cc = () => N(R() * 2 - 1, (opts && opts.real) ? 0 : R() * 2 - 1);
  const rr = (a, b) => N(a + (b - a) * R());
  const has = v => vars.includes(v);
  if (vars.length === 1 || (vars.length === 2 && has('t') && !has('r'))){
    const x = vars.find(v => v !== 't'), X = V(x), T = has('t') ? V('t') : null;
    const d = dom && dom[x];
    const tf = T ? (w => fn('exp', mul(N(0, -1), w, T))) : (() => ONE);
    if (d && isFinite(d.lo) && isFinite(d.hi)){
      const lo = d.loE, hi = d.hiE;
      const poly = add(cc(), mul(cc(), X), mul(cc(), pow(X, N(2))));
      const t1 = mul(sub(X, lo), sub(hi, X), poly, fn('exp', mul(rr(-0.5, 0.5), X)), tf(rr(0.3, 1.2)));
      const t2 = mul(sub(X, lo), sub(hi, X), cc(), pow(sub(X, lo), N(2)), tf(rr(1.3, 2)));
      return add(t1, t2);
    }
    if (d && isFinite(d.lo) && !isFinite(d.hi)){ // Halbachse, z. B. r
      const s = rr(0.6, 1.2);
      return mul(add(cc(), mul(cc(), X), mul(cc(), pow(X, N(2)))), fn('exp', neg(div(X, s))), tf(rr(0.3, 1.2)));
    }
    const mu = rr(-0.6, 0.6), s = rr(0.7, 1.3), nu = rr(-0.6, 0.6), w = rr(0.6, 1.2);
    const g1 = fn('exp', neg(div(pow(sub(X, mu), N(2)), mul(N(2), pow(s, N(2))))));
    const g2 = fn('exp', neg(div(pow(sub(X, nu), N(2)), mul(N(2), pow(w, N(2))))));
    return add(mul(add(cc(), mul(cc(), X), mul(cc(), pow(X, N(2)))), g1, tf(rr(0.3, 1.2))), mul(cc(), g2, tf(rr(1.3, 2))));
  }
  if (has('r') && has('θ') && has('φ')){
    const r = V('r'), th = V('θ'), ph = V('φ');
    const s = rr(0.6, 1.2);
    const ang = add(cc(), mul(cc(), r, fn('cos', th)), mul(cc(), r, fn('sin', th), fn('exp', mul(IUNIT, ph))),
      mul(cc(), pow(r, N(2)), pow(fn('sin', th), N(2)), fn('exp', mul(N(0, -2), ph))), mul(cc(), pow(r, N(2)), fn('cos', th), fn('sin', th), fn('exp', mul(N(0, -1), ph))));
    return mul(ang, fn('exp', neg(div(r, s))), has('t') ? fn('exp', mul(N(0, -1), rr(0.3, 1.2), V('t'))) : ONE);
  }
  // allgemein: Produkt einfacher Funktionen
  let e = ONE;
  for (const v of vars){ const X = V(v); e = mul(e, add(cc(), mul(cc(), X)), fn('exp', neg(mul(rr(0.2, 0.6), pow(X, N(2)))))); }
  return e;
}

/* ---------- Kontext einer Aufgabe ---------- */
function parseKey(key){
  // "ψ_n(x,t)" -> {name:'ψ', idx:'n', args:['x','t']}; "V_0" -> {name:'V_0'}
  const m = /^([^_(]+)(?:_(\{[^}]*\}|[^(]+))?(?:\((.*)\))?$/.exec(key.replace(/\s/g, ''));
  if (!m) throw new Error('Definition unklar: ' + key);
  let name = m[1], sub = m[2] ? m[2].replace(/[{}]/g, '') : null, args = m[3] ? m[3].split(',') : null;
  return {name, sub, args};
}
const IDXVARS = new Set(['n', 'm', 'l', 'k', 'j', 'i', 'p', 'q', 's']);
function makeCtx(spec){
  const ctx = {spec, rep:spec.rep || 'pos'};
  ctx.coords = spec.coords || (ctx.rep === 'mat' ? ['t'] : ['x']);
  ctx.space = spec.space || ctx.coords.filter(c => c !== 't');
  const pctx = {funcs:new Set(), coords:ctx.coords};
  ctx.pctx = pctx;
  // Parameter
  ctx.params = Object.assign({'ħ':'pos'}, spec.params || {});
  // Definitionen
  ctx.defs = {}; ctx.fam = {}; ctx.funcs = new Set();
  for (const [k, v] of Object.entries(spec.defs || {})){
    const pk = parseKey(k);
    if (pk.args){ pctx.funcs.add(pk.name); pctx.funcs.add(pk.name + (pk.sub ? '_' + pk.sub : '')); ctx.funcs.add(pk.name); }
  }
  for (const f of Object.keys(spec.abstract || {})) { pctx.funcs.add(f); ctx.funcs.add(f); }
  if (spec.funcs) for (const f of spec.funcs) pctx.funcs.add(f);
  pctx.notFuncs = spec.notFuncs || [];
  for (const [k, v] of Object.entries(spec.defs || {})){
    const pk = parseKey(k);
    const body = typeof v === 'string' ? parseExprStr(v, pctx) : v;
    const d = {name:pk.name, key:pk.name + (pk.sub ? '_' + pk.sub : ''), args:pk.args, body, src:v};
    if (pk.sub && IDXVARS.has(pk.sub) && !(ctx.params[pk.name + '_' + pk.sub])){ d.idx = pk.sub; ctx.fam[pk.name] = d; }
    else ctx.defs[pk.name + (pk.sub ? '_' + pk.sub : '')] = d;
  }
  ctx.abstract = spec.abstract || {};
  ctx.dyn = spec.dyn || null;
  ctx.unknowns = {};
  for (const [k, u] of Object.entries(spec.unknowns || {})){
    const refs = (Array.isArray(u.ref) ? u.ref : [u.ref]).map(s => parseExprStr(s, pctx));
    const alt = (u.alt || []).map(s => parseExprStr(s, pctx));
    ctx.unknowns[k] = {kind:u.kind || 'pos', refs, alt, note:u.note};
  }
  // Integrationsbereich
  ctx.domain = {};
  const dd = Object.assign({}, ctx.rep === 'pos' ? {x:['-∞', '∞'], r:['0', '∞'], θ:['0', 'π'], φ:['0', '2π'], y:['-∞', '∞'], z:['-∞', '∞'], k:['-∞', '∞'], p:['-∞', '∞']} : {}, spec.domain || {});
  for (const [v, [lo, hi]] of Object.entries(dd)) ctx.domain[v] = {lo:parseExprStr(lo, pctx), hi:parseExprStr(hi, pctx)};
  ctx.measure = spec.measure ? parseExprStr(spec.measure, pctx) : (ctx.space.length === 3 && ctx.space.includes('r') ? parseExprStr('r^2 sin(θ)', pctx) : (spec.radial ? parseExprStr('r^2', pctx) : null));
  ctx.ops = {};
  for (const [k, v] of Object.entries(spec.ops || {})) ctx.ops[k] = parseExprStr(v, pctx);
  ctx.opNames = new Set(['x', 'p', 'H', 'T', 'V', 'L_z', 'L_x', 'L_y', 'L_+', 'L_-', 'a', 'S_x', 'S_y', 'S_z', 'J_z', 'N', ...Object.keys(spec.ops || {})]);
  ctx.state = spec.state || 'ψ';
  ctx.basis = spec.basis || null; // {fam:'ψ'}
  ctx.stateDefs = {};
  for (const [k, v] of Object.entries(spec.states || {})) ctx.stateDefs[k] = parseExprStr(v, pctx);
  if (ctx.rep === 'mat') ctx.M = makeMatCtx(spec.mat || {}, ctx, pctx);
  return ctx;
}

/* ---------- Auswertungsumgebung für eine Stichprobe ---------- */
function makeScope(ctx, sample, mode, extra){
  const S = {ctx, sample, mode:mode || 'rand', locals:{}, user:(extra && extra.user) || {}, cache:{}, depth:0, loopVars:new Set(), approx:false, used:new Set()};
  S.rnd = name => rng(hashStr(name) ^ (sample.__seed || 1));
  return S;
}
function withLocal(S, name, value, fnc){
  const old = Object.prototype.hasOwnProperty.call(S.locals, name) ? S.locals[name] : undefined;
  S.locals[name] = value;
  try { return fnc(); } finally { if (old === undefined) delete S.locals[name]; else S.locals[name] = old; }
}
function symKeyOf(node, S){
  if (!node.sub) return node.name;
  return node.name + '_' + subKey(node.sub, S);
}
function subKey(sub, S){
  if (sub.t === 'num') return String(sub.v);
  if (sub.t === 'sym') return sub.name + (sub.sub ? '_' + subKey(sub.sub, S) : '');
  if (sub.t === 'spec') return sub.v;
  if (sub.t === 'list') return sub.a.map(x => subKey(x, S)).join('');
  if (sub.t === 'mul') return sub.a.map(x => subKey(x, S)).join('');
  if (sub.t === 'grp') return subKey(sub.a, S);
  return '?';
}
function intValue(ast, S){
  const r = elab(ast, S);
  if (isOp(r)) throw new ElabError('Index ist kein Zahlenwert');
  const fv = freeVars(r.e);
  for (const v of fv){ if (S.loopVars.has(v)) throw new NeedUnroll(); }
  if (!isN(r.e)){
    // Parameterwert einsetzen
    const f = compile(r.e); const env = envFor(S);
    const c = f(env); return Math.round(c.re);
  }
  return Math.round(r.e.re);
}
function envFor(S){
  const env = {};
  for (const [k, v] of Object.entries(S.sample)) if (v instanceof C) env[k] = v;
  return env;
}

/* ---------- Hauptfunktion ---------- */
function elab(n, S, slot){
  switch (n.t){
    case 'num': return val(N(n.v));
    case 'grp': return elab(n.a, S, slot);
    case 'sym': return elabSym(n, S, slot);
    case 'call': return elabCall(n, S, slot);
    case 'add': {
      const rs = n.a.map(t => elab(t, S, slot));
      if (rs.some(isOp)) return opSum(rs.map(asOp));
      return val(add(rs.map(r => r.e)));
    }
    case 'neg': { const r = elab(n.a, S, slot); return isOp(r) ? opScale(N(-1), r) : val(neg(r.e)); }
    case 'pm': throw new ElabError('± bitte als zwei Fälle schreiben', 'pm');
    case 'mul': {
      let acc = elab(n.a[n.a.length - 1], S, slot);
      for (let i = n.a.length - 2; i >= 0; i--){
        const L = elab(n.a[i], S, slot);
        if (isOp(L)) acc = isOp(acc) ? opComp(L, acc) : val(L.ap(acc.e));
        else acc = isOp(acc) ? opScale(L.e, acc) : val(mul(L.e, acc.e));
      }
      return acc;
    }
    case 'tensor': throw new ElabError('⊗ gibt es nur bei Spinsystemen', 'unsupported');
    case 'div': {
      const a = elab(n.a, S, slot), b = elab(n.b, S, slot);
      if (isOp(b)) throw new ElabError('Durch einen Operator kann man nicht teilen', 'type');
      return isOp(a) ? opScale(div(ONE, b.e), a) : val(div(a.e, b.e));
    }
    case 'pow': {
      if (n.a.t === 'abs' && n.b.t === 'num' && n.b.v % 2 === 0){
        const r = elab(n.a.a, S, slot); if (isOp(r)) throw new ElabError('Betrag eines Operators', 'type');
        return val(pow(mul(r.e, conjE(r.e)), N(n.b.v / 2)));
      }
      if (n.a.t === 'sym' && !n.a.sub && ['L', 'S', 'J'].includes(n.a.name) && n.b.t === 'num' && n.b.v === 2 && (n.a.hat || slot === 'op' || !S.ctx.params[n.a.name])){
        const o = builtinOp('L²', S); if (o) return o;
      }
      const a = elab(n.a, S, slot);
      if (isOp(a)){
        const b = elab(n.b, S); if (isOp(b) || !isN(b.e) || !Number.isInteger(b.e.re) || b.e.re < 0) throw new ElabError('Operatorpotenzen nur mit natürlichen Zahlen', 'type');
        let acc = a; for (let i = 1; i < b.e.re; i++) acc = opComp(a, acc);
        return b.e.re === 0 ? opMul(ONE) : acc;
      }
      const b = elab(n.b, S);
      if (isOp(b)) throw new ElabError('Operator im Exponenten', 'type');
      return val(pow(a.e, b.e));
    }
    case 'conj': { const r = elab(n.a, S, slot); if (isOp(r)) throw new ElabError('„*“ bei einem Operator: meinst du †?', 'type'); return val(conjE(r.e)); }
    case 'dag': {
      const r = elab(n.a, S, slot === undefined ? 'op' : slot);
      if (!isOp(r)) return val(conjE(r.e));
      const a = r.adj && r.adj(); if (!a) throw new ElabError('Adjungierter Operator hier nicht bekannt', 'unsupported'); return a;
    }
    case 'fact': { const r = elab(n.a, S); return val(fnSimplify('fact', [r.e])); }
    case 'abs': { const r = elab(n.a, S, slot); if (isOp(r)) throw new ElabError('Betrag eines Operators', 'type'); return val(fnSimplify('abs', [r.e])); }
    case 'prime': return elabPrime(n, S, slot);
    case 'deriv': {
      if (!n.a){ return opD(n.v, n.n); }
      const r = elab(n.a, S, slot);
      if (isOp(r)) throw new ElabError('Ableitung eines Operators', 'type');
      return val(diff(r.e, n.v, n.n));
    }
    case 'lap': return lapOp(S);
    case 'int': return elabInt(n, S);
    case 'evalbr': return elabEvalBr(n, S);
    case 'sum': return elabSum(n, S, slot);
    case 'comm': {
      const A = asOp(elab(n.a, S, 'op')), B = asOp(elab(n.b, S, 'op'));
      return n.anti ? opSum([opComp(A, B), opComp(B, A)]) : opSum([opComp(A, B), opScale(N(-1), opComp(B, A))]);
    }
    case 'ket': return val(ketFun(n.lab, S));
    case 'bra': throw new ElabError('Ein Bra ⟨…| allein hat in der Ortsdarstellung keinen Wert', 'type');
    case 'braket': return val(braketPos(n.bra, n.op, n.ket, S));
    case 'expect': return val(expectPos(n.a, S));
    case 'unc': {
      const st = S.ctx.state;
      const A = n.a;
      const e2 = expectPos({t:'mul', a:[A, A]}, S), e1 = expectPos(A, S);
      return val(fn('sqrt', sub(e2, pow(e1, N(2)))));
    }
    case 'mat': throw new ElabError('Matrizen gibt es in dieser Aufgabe nicht', 'unsupported');
    case 'spec': throw new ElabError('Spin-Zustände gibt es in dieser Aufgabe nicht', 'unsupported');
    case 'list': throw new ElabError('Liste an dieser Stelle', 'unsupported');
  }
  throw new ElabError('Unbekannter Baustein ' + n.t);
}

function builtinOp(key, S){
  const ctx = S.ctx, hb = V('ħ');
  const has = c => ctx.coords.includes(c);
  if (ctx.ops[key]){ const ck = 'op:' + key; if (!S.cache[ck]) S.cache[ck] = asOp(elab(ctx.ops[key], S, 'op')); return S.cache[ck]; }
  if (key === 'x' && has('x')) return opMul(V('x'));
  if (key === 'r' && has('r')) return opMul(V('r'));
  if (key === 'p' && has('x')) return opScale(mul(N(0, -1), hb), opD('x', 1));
  if (key === 'p_x' && has('x')) return opScale(mul(N(0, -1), hb), opD('x', 1));
  if (key === 'T' && has('x')) return opScale(neg(div(pow(hb, N(2)), mul(N(2), massVar(S)))), opD('x', 2));
  if (key === 'V'){ return opMul(potential(S)); }
  if (key === 'H' && has('x')) return opSum([builtinOp('T', S), opMul(potential(S))]);
  if (key === 'a' && has('x')) { const m = massVar(S), w = V('ω'); const c = fn('sqrt', div(mul(m, w), mul(N(2), hb))); return opScale(c, opSum([opMul(V('x')), opScale(div(hb, mul(m, w)), opD('x', 1))])); }
  if (key === 'a†' && has('x')) { const m = massVar(S), w = V('ω'); const c = fn('sqrt', div(mul(m, w), mul(N(2), hb))); return opScale(c, opSum([opMul(V('x')), opScale(neg(div(hb, mul(m, w))), opD('x', 1))])); }
  if (has('θ') && has('φ')){
    const th = V('θ'), ph = V('φ'), cot = fn('cot', th);
    if (key === 'L_z') return opScale(mul(N(0, -1), hb), opD('φ', 1));
    if (key === 'L_x') return opScale(mul(IUNIT, hb), opSum([opScale(fn('sin', ph), opD('θ', 1)), opScale(mul(cot, fn('cos', ph)), opD('φ', 1))]));
    if (key === 'L_y') return opScale(mul(IUNIT, hb), opSum([opScale(neg(fn('cos', ph)), opD('θ', 1)), opScale(mul(cot, fn('sin', ph)), opD('φ', 1))]));
    if (key === 'L_+') return opScale(mul(hb, fn('exp', mul(IUNIT, ph))), opSum([opD('θ', 1), opScale(mul(IUNIT, cot), opD('φ', 1))]));
    if (key === 'L_-') return opScale(mul(hb, fn('exp', mul(N(0, -1), ph))), opSum([opScale(N(-1), opD('θ', 1)), opScale(mul(IUNIT, cot), opD('φ', 1))]));
    if (key === 'L²' || key === 'L^2'){
      const s = fn('sin', th);
      const A = {op:true, ap:e => add(div(diff(mul(s, diff(e, 'θ')), 'θ'), s), div(diff(e, 'φ', 2), pow(s, N(2)))), adj:() => A};
      return opScale(neg(pow(hb, N(2))), A);
    }
  }
  return null;
}
function massVar(S){ return S.ctx.params['μ'] && !S.ctx.params.m ? V('μ') : V('m'); }
function potential(S){
  const ctx = S.ctx;
  if (ctx.defs.V){ const d = ctx.defs.V; if (d.args) return callDef(d, d.args.map(a => V(a)), S, 0); return elab(d.body, S).e; }
  if (ctx.abstract.V) return abstractCall('V', ctx.abstract.V, (ctx.abstract.V.args || ['x']).map(a => V(a)), S);
  return N(0);
}
function lapOp(S){
  const c = S.ctx.space;
  if (c.length === 1 && c[0] === 'x') return opD('x', 2);
  if (c.length === 1 && c[0] === 'r') return {op:true, ap:e => div(diff(mul(pow(V('r'), N(2)), diff(e, 'r')), 'r'), pow(V('r'), N(2))), adj:null};
  if (c.includes('r') && c.includes('θ')){
    const r = V('r'), s = fn('sin', V('θ'));
    return {op:true, ap:e => add(div(diff(mul(pow(r, N(2)), diff(e, 'r')), 'r'), pow(r, N(2))), div(diff(mul(s, diff(e, 'θ')), 'θ'), mul(pow(r, N(2)), s)), div(diff(e, 'φ', 2), mul(pow(r, N(2)), pow(s, N(2))))), adj:null};
  }
  return opSum(c.map(v => opD(v, 2)));
}

function elabSym(n, S, slot){
  const ctx = S.ctx;
  const key = symKeyOf(n, S);
  if (!n.sub && !n.hat){
    if (Object.prototype.hasOwnProperty.call(S.locals, key)) return S.locals[key];
  } else if (Object.prototype.hasOwnProperty.call(S.locals, key)) return S.locals[key];
  // Operatoren
  if (n.hat || (slot === 'op' && ctx.opNames.has(key))){
    const o = builtinOp(key, S);
    if (o) return o;
    if (n.hat) throw new ElabError('Den Operator ' + key + '̂ gibt es in dieser Aufgabe nicht', 'unknown', key);
  }
  if (key === 'i' && !ctx.params.i) return val(IUNIT);
  if (key === 'π') return val(N(Math.PI));
  if (key === 'e' && !ctx.params.e && !ctx.defs.e) return val(N(Math.E));
  if (S.user[key]) return withDepth(S, () => elab(S.user[key], S, slot));
  if (ctx.defs[key]){
    const d = ctx.defs[key];
    if (d.args) return val(callDef(d, d.args.map(a => V(a)), S, 0));
    const ck = 'def:' + key + (slot === 'op' ? ':op' : '');
    if (S.cache[ck] === undefined) S.cache[ck] = withDepth(S, () => cleanElab(S, {}, () => elab(d.body, S, slot)));
    return S.cache[ck];
  }
  if (ctx.unknowns[key]) return unknownVal(key, S);
  if (Object.prototype.hasOwnProperty.call(ctx.params, key)){
    const p = S.sample[key];
    if (p === undefined) throw new ElabError('Kein Wert für ' + key, 'internal');
    if (paramKind(ctx.params[key]) === 'int' || paramKind(ctx.params[key]) === 'complex') return val(N(p.re, p.im));
    return val(V(key));
  }
  if (ctx.coords.includes(key)) return val(V(key));
  if (n.sub && ctx.fam[n.name]){
    const d = ctx.fam[n.name];
    const idx = intValue(n.sub.t === 'list' ? n.sub.a[0] : n.sub, S);
    return withLocal(S, d.idx, val(N(idx)), () => {
      if (d.args) return val(callDef(Object.assign({}, d, {name:d.name + '§' + idx}), d.args.map(a => V(a)), S, 0));
      return cleanElab(S, {[d.idx]:val(N(idx))}, () => elab(d.body, S, slot));
    });
  }
  if (ctx.abstract[n.name] && !n.sub){ const a = ctx.abstract[n.name]; return val(abstractCall(n.name, a, (a.args || ctx.coords).map(v => V(v)), S)); }
  if (n.name === 'δ' && n.sub && n.sub.t === 'list' && n.sub.a.length === 2){
    const a = elab(n.sub.a[0], S).e, b = elab(n.sub.a[1], S).e;
    return val(fnSimplify('kdelta', [a, b]));
  }
  // weitere Koordinaten in Integralen
  if (S.loopVars.has(key)) return val(V(key));
  // Operator ohne Dach, z. B. L_z oder H
  if (!n.hat && ctx.opNames.has(key) && !S.noOpFallback){ const o = builtinOp(key, S); if (o) return o; }
  throw new ElabError('„' + key + '“ ist hier nicht bekannt', 'unknown', key);
}
function withDepth(S, f){ if (++S.depth > 40){ S.depth = 0; throw new ElabError('Definition ruft sich selbst auf', 'internal'); } try { return f(); } finally { S.depth--; } }
function paramKind(p){ if (typeof p === 'string') return p; if (p.int) return 'int'; return p.kind || 'pos'; }
function unknownVal(key, S){
  const u = S.ctx.unknowns[key];
  S.used.add(key);
  if (S.mode === 'ref'){
    const bi = S.branch && S.branch[key] !== undefined ? S.branch[key] : 0;
    const all = u.refs.concat(u.alt);
    return withDepth(S, () => elab(all[Math.min(bi, all.length - 1)], S));
  }
  const p = S.sample['§u:' + key];
  return val(p ? N(p.re, p.im) : V('§u:' + key));
}
function abstractCall(name, a, args, S, primes){
  const vars = a.args || S.ctx.coords;
  const formal = vars.map(v => '§' + name + '.' + v);
  let body;
  const ck = 'abs:' + name;
  if (!S.cache[ck]){
    let tf = testFunction(name, vars, domainNums(S), S, a);
    S.cache[ck] = subst(tf, Object.fromEntries(vars.map((v, i) => [v, V(formal[i])])));
  }
  body = S.cache[ck];
  if (S.ctx.dyn && S.ctx.dyn.fn === name && vars.includes('t')) return jetFor(name, a, args, S, primes || 0);
  if (primes) body = diff(body, formal[0], primes);
  return subst(body, Object.fromEntries(formal.map((f, i) => [f, args[i]])));
}
/* Zustand, der die Schrödingergleichung erfüllt: Ortsableitungen frei, Zeitableitung aus iħ∂ψ/∂t = Hψ */
function jetFor(name, a, args, S, i){
  const ck = 'jet:' + name;
  if (!S.cache[ck]){
    const xv = '§jx';
    const g = subst(testFunction(name + '#g', ['x'], domainNums(S), S, {}), {x:V(xv)});
    const ders = [g];
    const hb = V('ħ'), m = massVar(S);
    const Vx = potential(S);
    const dyn = {xv, base:k => { while (ders.length <= k) ders.push(diff(ders[ders.length - 1], xv)); return ders[k]; }};
    dyn.dt = e => {
      const x = e.x;
      const J = k => ({k:'jet', id:name, i:k, x, dyn, tv:'t'});
      const Vv = subst(Vx, {x});
      const terms = [mul(div(mul(IUNIT, hb), mul(N(2), m)), J(e.i + 2))];
      for (let k = 0; k <= e.i; k++){
        let dV = Vv; for (let q = 0; q < k; q++) dV = diff(dV, 'x'); // V hängt von x ab (x ist hier die Ortsvariable)
        terms.push(mul(N(0, -binomR(e.i, k)), div(ONE, hb), dV, J(e.i - k)));
      }
      return add(terms);
    };
    S.cache[ck] = dyn;
  }
  const dyn = S.cache[ck];
  if (args.length && args[0].k !== 'v') throw new ElabError('Zeitabhängige Wellenfunktion nur mit (x,t)', 'unsupported');
  return {k:'jet', id:name, i, x:args[0], dyn, tv:'t'};
}
function domainNums(S){
  const out = {};
  for (const [v, d] of Object.entries(S.ctx.domain)){
    try {
      const lo = elab(d.lo, S).e, hi = elab(d.hi, S).e;
      const env = envFor(S);
      out[v] = {lo:compile(lo)(env).re, hi:compile(hi)(env).re, loE:lo, hiE:hi};
    } catch(e){ /* Bereich hängt von Unbekannten ab */ }
  }
  return out;
}
function cleanElab(S, locals, f){
  // Definitionen der Aufgabe sehen nur ihre eigenen Variablen
  const saved = S.locals; S.locals = locals;
  const lv = S.loopVars; S.loopVars = new Set();
  try { return f(); } finally { S.locals = saved; S.loopVars = lv; }
}
function callDef(d, args, S, primes){
  const dk = d.idx ? d.name : (d.key || d.name);
  const formal = d.args.map((a, i) => '§' + dk + i);
  const idxLocal = d.idx && S.locals[d.idx] ? {[d.idx]:S.locals[d.idx]} : {};
  const ck = 'call:' + dk + (d.idx ? '_' + (idxLocal[d.idx] ? keyOf(idxLocal[d.idx].e) : '') : '');
  let body = S.cache[ck];
  if (!body){
    const locals = Object.assign({}, idxLocal);
    d.args.forEach((a, i) => { locals[a] = val(V(formal[i])); });
    body = withDepth(S, () => cleanElab(S, locals, () => { const r = elab(d.body, S); if (isOp(r)) throw new ElabError('Definition ist ein Operator', 'type'); return r.e; }));
    S.cache[ck] = body;
  }
  if (primes) body = diff(body, formal[0], primes);
  return subst(body, Object.fromEntries(formal.map((f, i) => [f, args[i]])));
}
function elabCall(n, S, slot){
  if (typeof n.fn === 'string'){
    if (n.fn === 'Gamma'){ const r = elab(n.args[0], S); if (isOp(r)) throw new ElabError('Operator als Funktionsargument', 'type'); return val(fnSimplify('fact', [add(r.e, N(-1))])); }
    const f = FNMAP[n.fn];
    if (!f) throw new ElabError('Funktion ' + n.fn + ' unbekannt', 'unknown');
    const args = n.args.map(a => { const r = elab(a, S); if (isOp(r)) throw new ElabError('Operator als Funktionsargument', 'type'); return r.e; });
    if (f === 'hermite' || f === 'legendre' || f === 'laguerre'){
      args[0] = N(intValue(n.args[0], S)); if (f !== 'hermite') args[1] = N(intValue(n.args[1], S));
    }
    return val(fnSimplify(f, args));
  }
  const node = n.fn.t === 'prime' ? n.fn.a : n.fn;
  const primes = (n.primes || 0) + (n.fn.t === 'prime' ? n.fn.n : 0);
  const key = symKeyOf(node, S);
  const ctx = S.ctx;
  const argv = () => n.args.map(a => { const r = elab(a, S); if (isOp(r)) throw new ElabError('Operator als Funktionsargument', 'type'); return r.e; });
  if (S.user[key + '()']){ const u = S.user[key + '()']; return val(callUser(u, argv(), S, primes)); }
  if (ctx.defs[key] && ctx.defs[key].args) return val(callDef(ctx.defs[key], argv(), S, primes));
  if (node.sub && ctx.fam[node.name] && ctx.fam[node.name].args){
    const d = ctx.fam[node.name];
    const idx = intValue(node.sub.t === 'list' ? node.sub.a[0] : node.sub, S);
    const args = argv();
    return withLocal(S, d.idx, val(N(idx)), () => val(callDef(Object.assign({}, d, {name:d.name + '§' + idx}), args, S, primes)));
  }
  if (ctx.abstract[key]) return val(abstractCall(key, ctx.abstract[key], argv(), S, primes));
  // spezielle Funktionen
  if (node.name === 'H' && node.sub){ const k = intValue(node.sub, S); const a = argv(); let e = fnSimplify('hermite', [N(k), a[0]]); return val(primes ? diffFirstArg(e, a[0], primes) : e); }
  if (node.name === 'Y' && node.sub){
    const l = intValue(node.sub.t === 'list' ? node.sub.a[0] : node.sub, S);
    const m = node.supE ? intValue(node.supE, S) : (node.sub.t === 'list' ? intValue(node.sub.a[1], S) : 0);
    const a = argv(); return val(ylmExplicit(l, m, a[0], a[1]));
  }
  if (node.name === 'δ' && !node.sub){ const a = argv(); return val(fn('delta', a[0])); }
  if (node.name === 'Θ' && !node.sub){ const a = argv(); return val(fnSimplify('heav', [a[0]])); }
  if (node.name === 'V' && !ctx.defs.V && !ctx.abstract.V) {
    // V(x) ohne Definition: Potenzial 0?
    throw new ElabError('Das Potenzial V(x) ist in dieser Aufgabe nicht festgelegt', 'unknown', 'V');
  }
  // keine Funktion: als Produkt lesen, z. B. A(x-L)
  const head = elabSym(node, S, slot);
  const argr = n.args.length === 1 ? elab(n.args[0], S, slot) : null;
  if (!argr) throw new ElabError(key + '(…) ist keine bekannte Funktion', 'unknown', key);
  if (isOp(head)) return isOp(argr) ? opComp(head, argr) : val(head.ap(argr.e));
  return isOp(argr) ? opScale(head.e, argr) : val(mul(head.e, argr.e));
}
function diffFirstArg(e, a0, primes){
  // e ist f(a0); Ableitung nach dem Argument = d/dx (e) / a0' wenn a0 = x
  if (a0.k === 'v') return diff(e, a0.name, primes);
  return {k:'nd', v:a0.name, n:primes, b:e};
}
function callUser(u, args, S, primes){
  const formal = u.args.map((a, i) => '§u' + i);
  const saved = {};
  u.args.forEach((a, i) => { saved[a] = S.locals[a]; S.locals[a] = val(V(formal[i])); });
  let body;
  try { body = elab(u.body, S).e; } finally { u.args.forEach(a => { if (saved[a] === undefined) delete S.locals[a]; else S.locals[a] = saved[a]; }); }
  if (primes) body = diff(body, formal[0], primes);
  return subst(body, Object.fromEntries(formal.map((f, i) => [f, args[i]])));
}
function elabPrime(n, S, slot){
  const a = n.a;
  if (a.t === 'sym'){
    const key = symKeyOf(a, S);
    // H' als Störoperator
    if ((a.hat || slot === 'op') && S.ctx.ops[key + "'"]) return builtinOp(key + "'", S);
    if (S.ctx.ops[key + "'"] && !S.ctx.defs[key] && !S.ctx.abstract[key]) return builtinOp(key + "'", S);
    const ctx = S.ctx;
    if (ctx.defs[key] && ctx.defs[key].args) return val(callDef(ctx.defs[key], ctx.defs[key].args.map(x => V(x)), S, n.n));
    if (a.sub && ctx.fam[a.name] && ctx.fam[a.name].args){
      const d = ctx.fam[a.name]; const idx = intValue(a.sub.t === 'list' ? a.sub.a[0] : a.sub, S);
      return withLocal(S, d.idx, val(N(idx)), () => val(callDef(Object.assign({}, d, {name:d.name + '§' + idx}), d.args.map(x => V(x)), S, n.n)));
    }
    if (ctx.abstract[key]){ const ab = ctx.abstract[key]; return val(abstractCall(key, ab, (ab.args || ctx.coords).map(v => V(v)), S, n.n)); }
  }
  const r = elab(a, S, slot);
  if (isOp(r)) throw new ElabError('Strich an einem Operator', 'type');
  return val(diff(r.e, S.ctx.space[0] || S.ctx.coords[0], n.n));
}

/* Kugelflächenfunktionen als elementare Ausdrücke (für exakte Ableitungen) */
function ylmExplicit(l, m, th, ph){
  if (Math.abs(m) > l || l < 0) return N(0);
  const am = Math.abs(m);
  const c = fn('cos', th), s = fn('sin', th);
  // P_l^{|m|}(cos θ) mit Condon-Shortley-Phase über Rekursion
  let df = 1; for (let i = 1; i <= 2 * am - 1; i += 2) df *= i;
  let pmm = mul(N((am % 2 ? -1 : 1) * df), pow(s, N(am)));
  let P;
  if (l === am) P = pmm;
  else {
    let pm1 = mul(N(2 * am + 1), c, pmm);
    if (l === am + 1) P = pm1;
    else { let p0 = pmm, p1 = pm1; for (let ll = am + 2; ll <= l; ll++){ const p2 = div(sub(mul(N(2 * ll - 1), c, p1), mul(N(ll + am - 1), p0)), N(ll - am)); p0 = p1; p1 = p2; } P = p1; }
  }
  const Nlm = Math.sqrt((2 * l + 1) / (4 * Math.PI) * factR(l - am) / factR(l + am));
  let Y = mul(N(Nlm), P, am ? fn('exp', mul(N(0, am), ph)) : ONE);
  if (m < 0) Y = conjE(Y), Y = mul(N(am % 2 ? -1 : 1), mul(N(Nlm), P, fn('exp', mul(N(0, -am), ph))));
  return Y;
}

/* Integrale */
function elabInt(n, S){
  const v = n.v;
  const isCoord = S.ctx.coords.includes(v);
  const run = () => {
    const b = elab(n.a, S);
    if (isOp(b)) throw new ElabError('Im Integral steht ein Operator ohne Funktion, auf die er wirkt', 'type');
    const dom = S.ctx.domain[v];
    const lo = n.lo ? elab(n.lo, S).e : (dom ? elab(dom.lo, S).e : null);
    const hi = n.hi ? elab(n.hi, S).e : (dom ? elab(dom.hi, S).e : null);
    if (!lo || !hi) throw new ElabError('Unbestimmte Integrale kann ich nicht prüfen; schreib die Grenzen dazu', 'indef');
    return val(siftDelta({k:'int', v, lo, hi, b:b.e}));
  };
  if (isCoord) return run();
  return withLocal(S, v, val(V(v)), run);
}
function siftDelta(I){
  // ∫ f(x) δ(x - a) dx = f(a), wenn a im Bereich liegt
  const b = I.b;
  const fs = b.k === '*' ? b.a : [b];
  const di = fs.findIndex(f => f.k === 'f' && f.name === 'delta');
  if (di < 0) return I;
  const g = fs[di].a[0];
  const g1 = diff(g, I.v);
  if (dependsOn(g1, I.v)) throw new ElabError('δ-Funktion nur mit linearem Argument', 'unsupported');
  const g0 = subst(g, {[I.v]:N(0)});
  const root = neg(div(g0, g1));
  const rest = mul(fs.filter((_, i) => i !== di));
  const inside = mul(fnSimplify('heav', [sub(root, I.lo)]), fnSimplify('heav', [sub(I.hi, root)]));
  return mul(div(subst(rest, {[I.v]:root}), fn('abs', g1)), inside);
}
function elabEvalBr(n, S){
  const b = elab(n.a, S); if (isOp(b)) throw new ElabError('Auswertungsklammer mit Operator', 'type');
  let v = n.v;
  if (!v){
    const fv = freeVars(b.e);
    v = [...S.ctx.coords, 'x', 'r', 't', 'k', 'θ', 'φ', 'ξ', 'u', 'y', 'z'].find(c => fv.has(c));
    if (!v) return val(N(0));
  }
  // Grenzen ±∞ durch große Werte ersetzen (Randterme abklingender Funktionen)
  const fin = e => (isN(e) && !isFinite(e.re)) ? N(e.re > 0 ? 200 : -200) : e;
  const lo = fin(elab(n.lo, S).e), hi = fin(elab(n.hi, S).e);
  return val(sub(subst(b.e, {[v]:hi}), subst(b.e, {[v]:lo})));
}
function elabSum(n, S, slot){
  let v = n.v || 'n';
  const lo = n.lo ? intValue(n.lo, S) : (S.ctx.spec.sumFrom !== undefined ? S.ctx.spec.sumFrom : 1);
  let hi = n.hi ? (n.hi.t === 'num' && n.hi.v === Infinity ? Infinity : intValue(n.hi, S)) : Infinity;
  // erst symbolisch versuchen
  try {
    S.loopVars.add(v);
    const b = withLocal(S, v, val(V(v)), () => elab(n.a, S, slot));
    S.loopVars.delete(v);
    if (isOp(b)) throw new ElabError('Summe über Operatoren', 'unsupported');
    if (!isFinite(hi)) S.approx = true;
    return val({k:'sum', v, lo:N(lo), hi:N(hi), b:b.e});
  } catch(e){
    S.loopVars.delete(v);
    if (!(e instanceof NeedUnroll)) throw e;
  }
  const last = isFinite(hi) ? hi : lo + (S.ctx.spec.sumTerms || 120);
  if (!isFinite(hi)) S.approx = true;
  if (last - lo > 400) throw new ElabError('Summe zu lang', 'unsupported');
  const terms = [];
  for (let k = lo; k <= last; k++){
    const r = withLocal(S, v, val(N(k)), () => elab(n.a, S, slot));
    if (isOp(r)) throw new ElabError('Summe über Operatoren', 'unsupported');
    terms.push(r.e);
  }
  return val(add(terms));
}

/* Bra-Ket in Ortsdarstellung */
function ketFun(lab, S){
  if (lab.length !== 1) {
    if (S.ctx.basis && S.ctx.basis.multi) return basisFun(lab, S);
    throw new ElabError('Mehrere Quantenzahlen gibt es hier nicht', 'unsupported');
  }
  const L = lab[0];
  if (L.t === 'spec') throw new ElabError('Spin-Zustände gibt es in dieser Aufgabe nicht', 'unsupported');
  // Name eines Zustands?
  if (L.t === 'call' || (L.t === 'sym' && isStateSym(L, S))){
    const r = elab(L, S); if (!isOp(r)) return r.e;
  }
  if (S.ctx.basis) return basisFun(lab, S);
  const r = elab(L, S); if (isOp(r)) throw new ElabError('Operator im Ket', 'type'); return r.e;
}
function isStateSym(L, S){
  const ctx = S.ctx, key = symKeyOf(L, S);
  if (ctx.defs[key] || ctx.abstract[key] || ctx.stateDefs[key] || S.user[key]) return true;
  if (L.sub && ctx.fam[L.name]) return !(ctx.basis && ctx.basis.fam === L.name && false);
  return false;
}
function basisFun(lab, S){
  const b = S.ctx.basis;
  const d = S.ctx.fam[b.fam];
  if (!d) throw new ElabError('Basis unbekannt', 'internal');
  const idx = intValue(lab[0], S);
  if (b.min !== undefined && idx < b.min) return N(0);
  return withLocal(S, d.idx, val(N(idx)), () => d.args ? callDef(Object.assign({}, d, {name:d.name + '§' + idx}), d.args.map(a => V(a)), S, 0) : cleanElab(S, {[d.idx]:val(N(idx))}, () => elab(d.body, S).e));
}
function innerPos(f, g, S){
  let integrand = mul(conjE(f), g);
  if (S.ctx.measure) integrand = mul(integrand, elab(S.ctx.measure, S).e);
  let e = integrand;
  for (const v of S.ctx.space.slice().reverse()){
    const d = S.ctx.domain[v];
    if (!d) throw new ElabError('Integrationsbereich für ' + v + ' fehlt', 'internal');
    e = siftDelta({k:'int', v, lo:elab(d.lo, S).e, hi:elab(d.hi, S).e, b:e});
  }
  return e;
}
function braketPos(bra, op, ket, S){
  const f = ketFun(bra, S);
  let g = ketFun(ket, S);
  if (op){ const O = elab(op, S, 'op'); g = isOp(O) ? O.ap(g) : mul(O.e, g); }
  return innerPos(f, g, S);
}
function expectPos(A, S){
  const st = S.ctx.state;
  const psi = elab({t:'sym', name:st, hat:false, sub:null}, S).e;
  const O = elab(A, S, 'op');
  const g = isOp(O) ? O.ap(psi) : mul(O.e, psi);
  const num = innerPos(psi, g, S);
  if (S.ctx.spec.normalized) return num;
  return div(num, innerPos(psi, psi, S));
}
