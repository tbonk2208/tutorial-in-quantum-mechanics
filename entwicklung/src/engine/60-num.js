/* ===== Numerische Auswertung: Kernausdruck -> Funktion ===== */
class EvalError extends Error {}

function evalFnNum(name, a){
  const x = a[0];
  switch (name){
    case 'sin': return csin(x); case 'cos': return ccos(x); case 'tan': return ctan(x);
    case 'cot': return cdiv(ccos(x), csin(x));
    case 'sinh': return csinh(x); case 'cosh': return ccosh(x); case 'tanh': return ctanh(x);
    case 'coth': return cdiv(ccosh(x), csinh(x));
    case 'exp': return cexp(x);
    case 'ln': case 'log': return clog(x);
    case 'sqrt': return csqrt(x);
    case 'atan': return catan(x); case 'asin': return casin(x); case 'acos': return cacos(x);
    case 'conj': return cconj(x);
    case 're': return new C(x.re, 0); case 'im': return new C(x.im, 0);
    case 'abs': return new C(cabs(x), 0);
    case 'arg': return new C(carg(x), 0);
    case 'erf': if (Math.abs(x.im) > 1e-12) throw new EvalError('erf komplex'); return new C(erfR(x.re), 0);
    case 'hermite': { const n = a[0].re; if (!Number.isInteger(n) || n < 0) throw new EvalError('Hermite-Index'); return hermiteC(n, a[1]); }
    case 'laguerre': { const n = a[0].re, k = a[1].re; if (!Number.isInteger(n) || n < 0) throw new EvalError('Laguerre-Index'); return laguerreC(n, k, a[2]); }
    case 'legendre': { const l = a[0].re, m = a[1].re; return new C(legendreR(l, m, a[2].re), 0); }
    case 'ylm': return YlmC(Math.round(a[0].re), Math.round(a[1].re), a[2].re, a[3].re);
    case 'fact': if (Math.abs(x.im) > 1e-12) throw new EvalError('Fakultät komplex'); return new C(factR(x.re), 0);
    case 'binom': return new C(binomR(a[0].re, a[1].re), 0);
    case 'heav': return new C(x.re > 0 ? 1 : x.re < 0 ? 0 : 0.5, 0);
    case 'sgn': return new C(Math.sign(x.re), 0);
    case 'kdelta': return new C(Math.abs(a[0].re - a[1].re) < 1e-9 && Math.abs(a[0].im - a[1].im) < 1e-9 ? 1 : 0, 0);
    case 'delta': throw new EvalError('Die Delta-Funktion lässt sich hier nur unter einem Integral auswerten.');
  }
  throw new EvalError('Unbekannte Funktion ' + name);
}

const GK_X = [0.991455371120812639206854697526329, 0.949107912342758524526189684047851, 0.864864423359769072789712788640926,
  0.741531185599394439863864773280788, 0.586087235467691130294144845693013, 0.405845151377397166906606412076961,
  0.207784955007898467600689403773245, 0];
const GK_WK = [0.022935322010529224963732008058970, 0.063092092629978553290700663189204, 0.104790010322250183839876322541518,
  0.140653259715525918745189590510238, 0.169004726639267902826583426598550, 0.190350578064785409913256402421014,
  0.204432940075298892414161999234649, 0.209482141084727828012999174891714];
const GK_WG = [0.129484966168869693270611432679082, 0.279705391489276667901467771423780, 0.381830050505118944950369775488975, 0.417959183673469387755102040816327];
const IntStat = {evals:0};
/* Zeitbudget pro Zeile, damit eine sehr aufwendige Eingabe (z. B. verschachtelte unendliche Integrale) die Seite nicht blockiert */
const Budget = {until:0};
function gk15(f, a, b){
  if (Budget.until && Date.now() > Budget.until) throw new EvalError('Die Rechnung dauert zu lange. Vereinfache zuerst (z. B. das innere Integral ausrechnen) und prüfe dann weiter.');
  const c = (a + b) / 2, h = (b - a) / 2;
  let kr = 0, ki = 0, gr = 0, gi = 0;
  for (let j = 0; j < 8; j++){
    const xj = GK_X[j];
    if (xj === 0){ const v = f(c); kr += GK_WK[7] * v.re; ki += GK_WK[7] * v.im; gr += GK_WG[3] * v.re; gi += GK_WG[3] * v.im; continue; }
    const v1 = f(c - h * xj), v2 = f(c + h * xj);
    kr += GK_WK[j] * (v1.re + v2.re); ki += GK_WK[j] * (v1.im + v2.im);
    if (j % 2 === 1){ const w = GK_WG[(j - 1) / 2]; gr += w * (v1.re + v2.re); gi += w * (v1.im + v2.im); }
  }
  IntStat.evals += 15;
  return {re:kr * h, im:ki * h, err:Math.hypot((kr - gr) * h, (ki - gi) * h)};
}
function integrateFinite(f, a, b, rtol, atol){
  if (a === b) return C0;
  let sign = 1; if (a > b){ const t = a; a = b; b = t; sign = -1; }
  const first = gk15(f, a, b);
  const segs = [{a, b, r:first}];
  let tr = first.re, ti = first.im, te = first.err, it = 0;
  while (te > Math.max(atol, rtol * Math.hypot(tr, ti)) && it < 600){
    // Segment mit größtem Fehler teilen
    let wi = 0; for (let i = 1; i < segs.length; i++) if (segs[i].r.err > segs[wi].r.err) wi = i;
    const s = segs[wi], m = (s.a + s.b) / 2;
    const l = gk15(f, s.a, m), r = gk15(f, m, s.b);
    tr += l.re + r.re - s.r.re; ti += l.im + r.im - s.r.im; te += l.err + r.err - s.r.err;
    segs[wi] = {a:s.a, b:m, r:l}; segs.push({a:m, b:s.b, r:r});
    it++;
  }
  if (!isFinite(tr) || !isFinite(ti)) throw new EvalError('Integral nicht endlich');
  return new C(sign * tr, sign * ti);
}
function integrate(f, a, b, opts){
  const rtol = (opts && opts.rtol) || 1e-10, atol = (opts && opts.atol) || 1e-13;
  if (isFinite(a) && isFinite(b)) return integrateFinite(f, a, b, rtol, atol);
  if (a === -Infinity && b === Infinity){
    // in zwei Hälften, x = t/(1-t^2) auf (-1,1)
    const g = t => { const d = 1 - t * t; const x = t / d; const w = (1 + t * t) / (d * d); const v = f(x); return new C(v.re * w, v.im * w); };
    const r1 = integrateFinite(g, -1 + 1e-15, 0, rtol, atol), r2 = integrateFinite(g, 0, 1 - 1e-15, rtol, atol);
    return cadd(r1, r2);
  }
  if (a === Infinity && b === -Infinity) return cneg(integrate(f, b, a, opts));
  if (isFinite(a) && b === Infinity){
    const g = t => { const d = 1 - t; const x = a + t / d; const w = 1 / (d * d); const v = f(x); return new C(v.re * w, v.im * w); };
    return integrateFinite(g, 0, 1 - 1e-15, rtol, atol);
  }
  if (a === -Infinity && isFinite(b)){
    const g = t => { const d = 1 - t; const x = b - t / d; const w = 1 / (d * d); const v = f(x); return new C(v.re * w, v.im * w); };
    return integrateFinite(g, 0, 1 - 1e-15, rtol, atol);
  }
  if (isFinite(b) && a === Infinity) return cneg(integrate(f, b, a, opts));
  if (isFinite(a) && b === -Infinity) return cneg(integrate(f, b, a, opts));
  throw new EvalError('Integrationsgrenzen unklar');
}

/* Kernausdruck übersetzen */
function compile(e){
  switch (e.k){
    case 'n': { const c = new C(e.re, e.im); return () => c; }
    case 'v': { const nm = e.name; return env => { const v = env[nm]; if (v === undefined) throw new EvalError('Wert für ' + nm + ' fehlt'); return v; }; }
    case '+': { const fs = e.a.map(compile); return env => { let r = 0, i = 0; for (const f of fs){ const v = f(env); r += v.re; i += v.im; } return new C(r, i); }; }
    case '*': { const fs = e.a.map(compile); return env => { let acc = fs[0](env); for (let j = 1; j < fs.length; j++) acc = cmul(acc, fs[j](env)); return acc; }; }
    case '/': { const a = compile(e.a), b = compile(e.b); return env => cdiv(a(env), b(env)); }
    case '^': {
      const a = compile(e.a);
      if (isN(e.b) && e.b.im === 0 && Number.isInteger(e.b.re) && Math.abs(e.b.re) <= 64){ const n = e.b.re; return env => cpowInt(a(env), n); }
      const b = compile(e.b); return env => cpow(a(env), b(env));
    }
    case 'f': {
      const fs = e.a.map(compile), nm = e.name;
      if (fs.length === 1){ const f0 = fs[0]; return env => evalFnNum(nm, [f0(env)]); }
      return env => evalFnNum(nm, fs.map(f => f(env)));
    }
    case 'int': {
      const lo = compile(e.lo), hi = compile(e.hi), body = compile(e.b), v = e.v;
      return env => {
        const a = lo(env), b = hi(env);
        if (Math.abs(a.im) > 1e-12 || Math.abs(b.im) > 1e-12) throw new EvalError('Komplexe Integrationsgrenze');
        const old = env[v];
        const f = x => { env[v] = new C(x, 0); return body(env); };
        try { return integrate(f, a.re, b.re, env.__intOpts); } finally { if (old === undefined) delete env[v]; else env[v] = old; }
      };
    }
    case 'sum': {
      const lo = compile(e.lo), hi = compile(e.hi), body = compile(e.b), v = e.v;
      return env => {
        const a = lo(env).re, b = hi(env).re;
        if (!Number.isInteger(Math.round(a))) throw new EvalError('Summengrenze');
        const old = env[v]; let r = 0, im = 0, small = 0;
        const last = isFinite(b) ? Math.round(b) : Math.round(a) + 20000;
        try {
          for (let n = Math.round(a); n <= last; n++){
            env[v] = new C(n, 0); const t = body(env); r += t.re; im += t.im;
            if (!isFinite(b)){ if (Math.hypot(t.re, t.im) < 1e-17 * (Math.hypot(r, im) + 1e-300)) { if (++small > 30) break; } else small = 0; }
          }
        } finally { if (old === undefined) delete env[v]; else env[v] = old; }
        if (!isFinite(b)) env.__approx = true;
        return new C(r, im);
      };
    }
    case 'nd': {
      const body = compile(e.b), v = e.v, n = e.n;
      return env => {
        const x0 = env[v]; if (!x0) throw new EvalError('Ableitungsvariable ' + v + ' ohne Wert');
        const at = h => { env[v] = new C(x0.re + h, x0.im); const r = body(env); return r; };
        const D = h => n === 1 ? cscale(csub(at(h), at(-h)), 1 / (2 * h)) : cscale(cadd(csub(at(h), cscale(at(0), 2)), at(-h)), 1 / (h * h));
        try {
          const h = n === 1 ? 1e-3 : 1e-2;
          const d1 = D(h), d2 = D(h / 2);
          return cscale(csub(cscale(d2, 4), d1), 1 / 3); // Richardson
        } finally { env[v] = x0; env.__approx = true; }
      };
    }
    case 'jet': {
      const g = e.dyn.base(e.i), gc = compile(g), x = compile(e.x), xv = e.dyn.xv;
      return env => { const old = env[xv]; env[xv] = x(env); try { return gc(env); } finally { env[xv] = old; } };
    }
  }
  throw new EvalError('Interner Fehler: ' + e.k);
}
