/* ===== Kernausdrücke: Bau, Vereinfachung, Ableitung, Ersetzung ===== */
// Knoten: {k:'n',re,im} {k:'v',name} {k:'+',a} {k:'*',a} {k:'/',a,b} {k:'^',a,b} {k:'f',name,a:[...]} {k:'int',v,lo,hi,b} {k:'sum',v,lo,hi,b} {k:'nd',v,n,b}
const N = (re, im) => ({k:'n', re, im:im || 0});
const ZERO = N(0), ONE = N(1), IUNIT = N(0, 1);
const V = name => ({k:'v', name});
const isN = e => e.k === 'n';
const isZero = e => e.k === 'n' && e.re === 0 && e.im === 0;
const isOne = e => e.k === 'n' && e.re === 1 && e.im === 0;
function nAdd(a, b){ return N(a.re + b.re, a.im + b.im); }
function nMul(a, b){ return N(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); }

function add(...xs){
  const terms = []; let c = N(0);
  for (const x of xs.flat()){
    if (!x) continue;
    if (x.k === '+') { for (const y of x.a){ if (isN(y)) c = nAdd(c, y); else terms.push(y); } }
    else if (isN(x)) c = nAdd(c, x);
    else terms.push(x);
  }
  if (!isZero(c)) terms.push(c);
  if (!terms.length) return N(0);
  if (terms.length === 1) return terms[0];
  return {k:'+', a:terms};
}
function mul(...xs){
  const fs = []; let c = N(1);
  for (const x of xs.flat()){
    if (!x) continue;
    if (x.k === '*') { for (const y of x.a){ if (isN(y)) c = nMul(c, y); else fs.push(y); } }
    else if (isN(x)) c = nMul(c, x);
    else fs.push(x);
  }
  if (isZero(c)) return N(0);
  if (!fs.length) return c;
  if (!isOne(c)) fs.unshift(c);
  if (fs.length === 1) return fs[0];
  return {k:'*', a:fs};
}
const neg = a => mul(N(-1), a);
const sub = (a, b) => add(a, neg(b));
function div(a, b){
  if (isZero(a)) return N(0);
  if (isOne(b)) return a;
  if (isN(b)) { const c = cdiv(C1, new C(b.re, b.im)); return mul(N(c.re, c.im), a); }
  return {k:'/', a, b};
}
function pow(a, b){
  if (isN(b) && b.im === 0){
    if (b.re === 0) return N(1);
    if (b.re === 1) return a;
    if (isN(a)){ const r = cpow(new C(a.re, a.im), new C(b.re, 0)); if (isFinite(r.re) && isFinite(r.im)) return N(r.re, r.im); }
  }
  if (isZero(a) && isN(b) && b.re > 0) return N(0);
  return {k:'^', a, b};
}
function fn(name, ...args){ return {k:'f', name, a:args}; }
const conjE = a => {
  if (isN(a)) return N(a.re, -a.im);
  if (a.k === 'v' && !a.cplx) return a;
  if (a.k === 'f' && a.name === 'conj') return a.a[0];
  return fn('conj', a);
};

/* freie Variablen (zwischengespeichert) */
const FV = new WeakMap();
function freeVars(e){
  if (FV.has(e)) return FV.get(e);
  let s;
  switch (e.k){
    case 'n': s = new Set(); break;
    case 'v': s = new Set([e.name]); break;
    case '+': case '*': s = new Set(); for (const x of e.a) for (const v of freeVars(x)) s.add(v); break;
    case '/': case '^': s = new Set([...freeVars(e.a), ...freeVars(e.b)]); break;
    case 'f': s = new Set(); for (const x of e.a) for (const v of freeVars(x)) s.add(v); break;
    case 'int': case 'sum': { s = new Set(freeVars(e.b)); s.delete(e.v); for (const v of freeVars(e.lo)) s.add(v); for (const v of freeVars(e.hi)) s.add(v); break; }
    case 'nd': s = new Set(freeVars(e.b)); break;
    case 'jet': s = new Set(freeVars(e.x)); s.add(e.tv || 't'); break;
    default: s = new Set();
  }
  FV.set(e, s);
  return s;
}
const dependsOn = (e, v) => freeVars(e).has(v);

/* Ersetzung von Variablen */
function subst(e, map){
  switch (e.k){
    case 'n': return e;
    case 'v': return Object.prototype.hasOwnProperty.call(map, e.name) ? map[e.name] : e;
    case '+': return add(e.a.map(x => subst(x, map)));
    case '*': return mul(e.a.map(x => subst(x, map)));
    case '/': return div(subst(e.a, map), subst(e.b, map));
    case '^': return pow(subst(e.a, map), subst(e.b, map));
    case 'f': return fnSimplify(e.name, e.a.map(x => subst(x, map)));
    case 'int': case 'sum': {
      const m2 = Object.assign({}, map); delete m2[e.v];
      return {k:e.k, v:e.v, lo:subst(e.lo, map), hi:subst(e.hi, map), b:subst(e.b, m2)};
    }
    case 'nd': return {k:'nd', v:e.v, n:e.n, b:subst(e.b, map), at:e.at ? subst(e.at, map) : null};
    case 'jet': return Object.assign({}, e, {x:subst(e.x, map)});
  }
  return e;
}
function fnSimplify(name, args){
  if (name === 'conj') return conjE(args[0]);
  if (args.every(isN)){
    const v = evalFnNum(name, args.map(a => new C(a.re, a.im)));
    if (v && isFinite(v.re) && isFinite(v.im)) return N(v.re, v.im);
  }
  return {k:'f', name, a:args};
}

/* symbolische Ableitung nach v */
function diff(e, v, n){
  n = n || 1;
  let r = e;
  for (let i = 0; i < n; i++) r = diff1(r, v);
  return r;
}
function diff1(e, v){
  if (!dependsOn(e, v)) return N(0);
  switch (e.k){
    case 'v': return e.name === v ? N(1) : N(0);
    case '+': return add(e.a.map(x => diff1(x, v)));
    case '*': {
      const terms = [];
      e.a.forEach((f, i) => { if (!dependsOn(f, v)) return; terms.push(mul(e.a.map((g, j) => i === j ? diff1(f, v) : g))); });
      return add(terms);
    }
    case '/': {
      const {a, b} = e;
      if (!dependsOn(b, v)) return div(diff1(a, v), b);
      return div(sub(mul(diff1(a, v), b), mul(a, diff1(b, v))), pow(b, N(2)));
    }
    case '^': {
      const {a, b} = e;
      if (!dependsOn(b, v)) return mul(b, pow(a, add(b, N(-1))), diff1(a, v));
      return mul(e, add(mul(diff1(b, v), fn('ln', a)), div(mul(b, diff1(a, v)), a)));
    }
    case 'f': return diffFn(e, v);
    case 'int': {
      const terms = [{k:'int', v:e.v, lo:e.lo, hi:e.hi, b:diff1(e.b, v)}];
      if (dependsOn(e.hi, v)) terms.push(mul(subst(e.b, {[e.v]:e.hi}), diff1(e.hi, v)));
      if (dependsOn(e.lo, v)) terms.push(neg(mul(subst(e.b, {[e.v]:e.lo}), diff1(e.lo, v))));
      if (isZero(terms[0].b)) terms.shift();
      return add(terms);
    }
    case 'sum': return {k:'sum', v:e.v, lo:e.lo, hi:e.hi, b:diff1(e.b, v)};
    case 'nd': return {k:'nd', v, n:1, b:e};
    case 'jet': {
      // Ortsableitungen zählen hoch; Zeitableitung über die Schrödingergleichung
      if (v === (e.tv || 't')) return e.dyn.dt(e);
      return mul(Object.assign({}, e, {i:e.i + 1}), diff1(e.x, v));
    }
  }
  return {k:'nd', v, n:1, b:e};
}
function diffFn(e, v){
  const a = e.a[0], da = () => diff1(a, v);
  switch (e.name){
    case 'sin': return mul(fn('cos', a), da());
    case 'cos': return neg(mul(fn('sin', a), da()));
    case 'tan': return div(da(), pow(fn('cos', a), N(2)));
    case 'cot': return neg(div(da(), pow(fn('sin', a), N(2))));
    case 'sinh': return mul(fn('cosh', a), da());
    case 'cosh': return mul(fn('sinh', a), da());
    case 'tanh': return div(da(), pow(fn('cosh', a), N(2)));
    case 'coth': return neg(div(da(), pow(fn('sinh', a), N(2))));
    case 'exp': return mul(e, da());
    case 'ln': case 'log': return div(da(), a);
    case 'sqrt': return div(da(), mul(N(2), e));
    case 'atan': return div(da(), add(N(1), pow(a, N(2))));
    case 'asin': return div(da(), fn('sqrt', sub(N(1), pow(a, N(2)))));
    case 'acos': return neg(div(da(), fn('sqrt', sub(N(1), pow(a, N(2))))));
    case 'conj': return conjE(da());
    case 're': return fn('re', da());
    case 'im': return fn('im', da());
    case 'abs': return div(fn('re', mul(conjE(a), da())), e);
    case 'erf': return mul(N(2 / Math.sqrt(Math.PI)), fn('exp', neg(pow(a, N(2)))), da());
    case 'hermite': { // hermite(n, z): d/dz H_n = 2n H_{n-1}
      const nn = e.a[0], z = e.a[1];
      if (!isN(nn)) break;
      if (nn.re === 0) return N(0);
      return mul(N(2 * nn.re), fn('hermite', N(nn.re - 1), z), diff1(z, v));
    }
    case 'laguerre': { // d/dz L_n^k(z) = -L_{n-1}^{k+1}(z)
      const nn = e.a[0], kk = e.a[1], z = e.a[2];
      if (!isN(nn) || !isN(kk)) break;
      if (nn.re === 0) return N(0);
      return neg(mul(fn('laguerre', N(nn.re - 1), N(kk.re + 1), z), diff1(z, v)));
    }
    case 'heav': return N(0);
    case 'sgn': return N(0);
    case 'kdelta': return N(0);
  }
  return {k:'nd', v, n:1, b:e};
}

/* Strukturgleichheit (für Zwischenspeicher) */
function keyOf(e){
  switch (e.k){
    case 'n': return e.re + (e.im ? '+' + e.im + 'i' : '');
    case 'v': return e.name;
    case '+': case '*': return e.k + '(' + e.a.map(keyOf).join(',') + ')';
    case '/': case '^': return e.k + '(' + keyOf(e.a) + ',' + keyOf(e.b) + ')';
    case 'f': return e.name + '(' + e.a.map(keyOf).join(',') + ')';
    case 'int': case 'sum': return e.k + '[' + e.v + ',' + keyOf(e.lo) + ',' + keyOf(e.hi) + '](' + keyOf(e.b) + ')';
    case 'nd': return 'nd[' + e.v + ',' + e.n + '](' + keyOf(e.b) + ')';
    case 'jet': return 'jet[' + e.id + ',' + e.i + '](' + keyOf(e.x) + ')';
  }
  return '?';
}
