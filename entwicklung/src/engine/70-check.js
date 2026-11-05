/* ===== Prüfen von Herleitungen Zeile für Zeile ===== */
const K_SAMPLES = 4;
const TOL = 1e-7, TOL_APPROX = 2e-5;

/* Stichproben für Parameter, Koordinaten und Unbekannte */
function makeSamples(ctx, K, seed){
  const R = rng(hashStr(seed || 'qm') ^ 0x9e3779b9);
  const out = [];
  const pspec = ctx.params;
  const ints = {};
  for (const [k, p] of Object.entries(pspec)){
    if (paramKind(p) === 'int'){
      const [a, b] = p.int; const vals = []; for (let v = a; v <= b; v++) vals.push(v);
      for (let i = vals.length - 1; i > 0; i--){ const j = Math.floor(R() * (i + 1)); [vals[i], vals[j]] = [vals[j], vals[i]]; }
      ints[k] = vals;
    }
  }
  for (let s = 0; s < K; s++){
    const smp = {__seed:(hashStr(seed || 'qm') + 7919 * (s + 1)) >>> 0};
    const pending = Object.entries(pspec);
    for (let pass = 0; pass < 6 && pending.length; pass++){
      for (let i = 0; i < pending.length; ){
        const [k, p] = pending[i];
        try { smp[k] = drawParam(k, p, smp, R, ctx, s, ints); pending.splice(i, 1); } catch(e){ if (pass === 5) throw new Error('Parameter ' + k + ': ' + e.message); i++; }
      }
    }
    // Koordinaten
    for (const c of ctx.coords){
      if (smp[c]) continue;
      let v;
      if (c === 't') v = 0.2 + 1.6 * R();
      else if (c === 'θ') v = 0.35 + (Math.PI - 0.7) * R();
      else if (c === 'φ') v = 0.2 + (2 * Math.PI - 0.4) * R();
      else {
        const d = ctx.domain[c];
        let lo = -Infinity, hi = Infinity;
        if (d){ try { lo = numOf(d.lo, smp, ctx); hi = numOf(d.hi, smp, ctx); } catch(e){} }
        if (isFinite(lo) && isFinite(hi)) v = lo + (0.12 + 0.76 * R()) * (hi - lo);
        else if (isFinite(lo)) v = lo + 0.3 + 2.2 * R();
        else if (isFinite(hi)) v = hi - 0.3 - 2.2 * R();
        else v = -1.6 + 3.2 * R();
      }
      smp[c] = new C(v, 0);
    }
    for (const [k, u] of Object.entries(ctx.unknowns)){
      const kind = u.kind;
      smp['§u:' + k] = kind === 'complex' ? new C(0.5 + R(), R() - 0.5) : kind === 'real' ? new C((R() < 0.5 ? -1 : 1) * (0.6 + 1.6 * R()), 0) : kind === 'int' ? new C(1 + Math.floor(4 * R()), 0) : new C(0.6 + 1.6 * R(), 0);
    }
    out.push(smp);
  }
  return out;
}
function numOf(ast, smp, ctx){
  const S = makeScope(ctx, smp, 'rand');
  const r = ctx.rep === 'mat' ? evalM(ast, S) : compile(elab(ast, S).e)(envFor(S));
  if (!isC(r)) throw new Error('keine Zahl');
  return r.re;
}
function drawParam(k, p, smp, R, ctx, s, ints){
  if (typeof p === 'string') p = {kind:p};
  if (p.value !== undefined) return new C(numOf(parseExprStr(String(p.value), ctx.pctx), smp, ctx), 0);
  if (p.int){
    if (p.ne && !smp[p.ne] && ctx.params[p.ne]) throw new Error('später ziehen');
    let vals = ints[k];
    let v = vals[s % vals.length];
    if (p.ne && smp[p.ne]){ let t = 0; while (v === smp[p.ne].re && t < vals.length){ t++; v = vals[(s + t) % vals.length]; } }
    if (p.range){ const lo = numOf(parseExprStr(p.range[0], ctx.pctx), smp, ctx), hi = numOf(parseExprStr(p.range[1], ctx.pctx), smp, ctx); const opts = []; for (let q = Math.ceil(lo - 1e-9); q <= hi + 1e-9; q++) opts.push(q); v = opts[Math.floor(R() * opts.length)]; }
    return new C(v, 0);
  }
  if (p.half){ const opts = p.half; return new C(opts[Math.floor(R() * opts.length)], 0); }
  if (p.range){
    const lo = numOf(parseExprStr(p.range[0], ctx.pctx), smp, ctx), hi = numOf(parseExprStr(p.range[1], ctx.pctx), smp, ctx);
    return new C(lo + (0.15 + 0.7 * R()) * (hi - lo), 0);
  }
  const kind = p.kind || 'pos';
  if (kind === 'real') return new C((R() < 0.5 ? -1 : 1) * (0.4 + 1.4 * R()), 0);
  if (kind === 'complex') return new C(R() * 2 - 1, R() * 2 - 1);
  return new C(0.6 + 1.6 * R(), 0);
}

/* ± auflösen */
function expandPM(ast){
  let found = false;
  const walk = (n, sgn) => {
    if (!n || typeof n !== 'object') return n;
    if (n.t === 'pm'){ found = true; const s = (n.s === '∓') ? -sgn : sgn; return s > 0 ? walk(n.a, sgn) : {t:'neg', a:walk(n.a, sgn)}; }
    if (Array.isArray(n)) return n.map(x => walk(x, sgn));
    const o = {};
    for (const [k, v] of Object.entries(n)) o[k] = (v && typeof v === 'object') ? walk(v, sgn) : v;
    return o;
  };
  const p = walk(ast, 1);
  if (!found) return [ast];
  return [p, walk(ast, -1)];
}

/* Testfunktion, auf die Operatorgleichungen angewendet werden */
function applyToTest(r, S){
  const ctx = S.ctx;
  const vars = ctx.coords;
  const ck = 'abs:§T';
  if (!S.cache[ck]) S.cache[ck] = testFunction('§T', vars, domainNums(S), S, {});
  return r.ap(S.cache[ck]);
}
function evalPart(ast, S){
  if (S.ctx.rep === 'mat') return evalM(ast, S);
  const r = elab(ast, S);
  if (isOp(r)) return {op:true, val:compile(applyToTest(r, S))(envFor(S))};
  const env = envFor(S);
  const v = compile(r.e)(env);
  if (env.__approx) S.approx = true;
  return v;
}
/* beide Seiten; ist eine Seite ein Operator, wirken beide auf dieselbe Testfunktion */
function evalPair(P, Q, S){
  if (S.ctx.rep === 'mat') return [evalM(P, S), evalM(Q, S)];
  const a = elab(P, S), b = elab(Q, S);
  const env = envFor(S);
  const ev = e => { const v = compile(e)(env); return v; };
  let va, vb;
  if (isOp(a) || isOp(b)){
    const T = () => { const ck = 'abs:§T'; if (!S.cache[ck]) S.cache[ck] = testFunction('§T', S.ctx.coords, domainNums(S), S, {}); return S.cache[ck]; };
    va = ev(isOp(a) ? a.ap(T()) : mul(a.e, T()));
    vb = ev(isOp(b) ? b.ap(T()) : mul(b.e, T()));
  } else { va = ev(a.e); vb = ev(b.e); }
  if (env.__approx) S.approx = true;
  return [va, vb];
}
function valuesEqual(a, b, tol, M){
  if (a && a.op) a = a.val; if (b && b.op) b = b.val;
  if (isC(a) && isC(b)){
    if (!isFinite(a.re) || !isFinite(a.im) || !isFinite(b.re) || !isFinite(b.im)) return null;
    return cabs(csub(a, b)) <= tol * Math.max(cabs(a), cabs(b)) + 1e-10;
  }
  if (isC(a) && isVec(b)) return cabs(a) < 1e-12 && mNorm(b) < 1e-9;
  if (isVec(a) && isC(b)) return cabs(b) < 1e-12 && mNorm(a) < 1e-9;
  if (isC(a) && isMat(b)) return valuesEqual(mScale(eye(b.a.length), a), b, tol, M);
  if (isMat(a) && isC(b)) return valuesEqual(a, mScale(eye(a.a.length), b), tol, M);
  if (isVec(a) && isVec(b)){
    if (a.bra !== b.bra || a.v.length !== b.v.length) return false;
    const n = (M && M.cmpDim) || a.v.length;
    let d = 0, s = 0; for (let i = 0; i < n; i++){ d = Math.max(d, cabs(csub(a.v[i], b.v[i]))); s = Math.max(s, cabs(a.v[i]), cabs(b.v[i])); }
    return d <= tol * s + 1e-10;
  }
  if (isMat(a) && isMat(b)){
    if (a.a.length !== b.a.length) return false;
    const n = (M && M.cmpDim) || a.a.length;
    let d = 0, s = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++){ d = Math.max(d, cabs(csub(a.a[i][j], b.a[i][j]))); s = Math.max(s, cabs(a.a[i][j]), cabs(b.a[i][j])); }
    return d <= tol * s + 1e-10;
  }
  return false;
}
function kindOf(v){ if (v && v.op) return 'op'; if (isC(v)) return 'zahl'; if (isVec(v)) return v.bra ? 'bra' : 'ket'; if (isMat(v)) return 'matrix'; return '?'; }

/* Unbekannte, die ein Ausdruck benutzt */
function unknownsIn(ast, ctx){
  const out = new Set();
  const walk = n => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)){ n.forEach(walk); return; }
    if (n.t === 'sym' && ctx.unknowns[n.name + (n.sub ? '_' + subKey(n.sub, {}) : '')]) out.add(n.name + (n.sub ? '_' + subKey(n.sub, {}) : ''));
    for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v);
  };
  walk(ast);
  return out;
}
function astHas(ast, pred){
  let hit = false;
  const walk = n => { if (hit || !n || typeof n !== 'object') return; if (Array.isArray(n)){ n.forEach(walk); return; } if (pred(n)){ hit = true; return; } for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v); };
  walk(ast); return hit;
}
const isClosedForm = (ast, ctx) => !astHas(ast, n => ['int', 'sum', 'deriv', 'braket', 'expect', 'comm', 'unc', 'evalbr', 'lap', 'prime'].includes(n.t) || ((n.t === 'ket' || n.t === 'bra') && !(ctx && ctx.rep === 'mat')) || (n.t === 'sym' && n.hat));

/* Branches der Unbekannten */
function branchCombos(ctx, names){
  let combos = [{}];
  for (const k of names){
    const u = ctx.unknowns[k]; const nb = u.refs.length + u.alt.length;
    const next = []; for (const c of combos) for (let b = 0; b < nb; b++) next.push(Object.assign({}, c, {[k]:b}));
    combos = next.slice(0, 32);
  }
  return combos;
}

class Checker {
  constructor(ctx, opts){
    this.ctx = ctx; this.opts = opts || {};
    this.samples = makeSamples(ctx, this.opts.K || K_SAMPLES, this.opts.seed || 'qm');
  }
  scope(i, mode, user, extra){ const S = makeScope(this.ctx, Object.assign({}, this.samples[i]), mode, {user}); if (extra) Object.assign(S, extra); return S; }
  /* beide Seiten in allen Stichproben vergleichen; Ergebnis true/false/null (nicht auswertbar) */
  compare(P, Q, rel, user, mode, branch, fix){
    let ok = 0, bad = 0, err = null, approx = false;
    const vals = [], used = new Set();
    for (let i = 0; i < this.samples.length; i++){
      const S = this.scope(i, mode, user, {branch});
      if (fix) for (const [k, v] of Object.entries(fix[i] || {})) S.sample['§u:' + k] = v;
      let a, b;
      try { [a, b] = evalPair(P, Q, S); }
      catch(e){ for (const u of S.used) used.add(u); if (e instanceof ElabError || e instanceof EvalError){ err = err || e; continue; } throw e; }
      for (const u of S.used) used.add(u);
      approx = approx || S.approx;
      vals.push([a, b]);
      const tol = S.approx ? TOL_APPROX : TOL;
      let r;
      if (rel === '=' || rel === ':=' || rel === '≈') r = valuesEqual(a, b, tol, this.ctx.M);
      else if (rel === '≠') r = !valuesEqual(a, b, tol, this.ctx.M);
      else {
        if (!isC(a) || !isC(b)) { err = err || new EvalError('Ungleichung nur zwischen Zahlen'); continue; }
        const x = a.re, y = b.re, eps = 1e-9 * (Math.abs(x) + Math.abs(y));
        r = rel === '<' ? x < y - eps : rel === '>' ? x > y + eps : rel === '≤' ? x <= y + eps : x >= y - eps;
      }
      if (r === null){ err = err || new EvalError('Wert nicht endlich'); continue; }
      if (r) ok++; else bad++;
    }
    if (ok + bad < 2) return {res:null, err, vals, used};
    return {res:bad === 0, err, vals, approx, used};
  }
  /* Ist die Aussage P rel Q wahr? */
  stepTruth(P, Q, rel, user){
    const Ps = expandPM(P), Qs = expandPM(Q);
    let anyNull = null, allTrue = true, usedRef = false, alt = false;
    for (const p of Ps) for (const q of Qs){
      if (Ps.length > 1 && Qs.length > 1 && Ps.indexOf(p) !== Qs.indexOf(q)) continue;
      let r = this.compare(p, q, rel, user, 'rand');
      if (r.res === true) continue;
      const unk = r.used;
      if (unk.size){
        let found = false;
        for (const br of branchCombos(this.ctx, [...unk])){
          const r2 = this.compare(p, q, rel, user, 'ref', br);
          if (r2.res === true){ found = true; usedRef = true; if (Object.entries(br).some(([k, b]) => b >= this.ctx.unknowns[k].refs.length)) alt = true; break; }
          if (r2.res === null && r.res !== false) r = r2;
        }
        if (found) continue;
      }
      if (r.res === null){ anyNull = r.err || new EvalError('nicht auswertbar'); allTrue = false; continue; }
      allTrue = false;
    }
    if (Ps.length > 1 || Qs.length > 1) alt = false;
    if (allTrue) return {truth:true, ref:usedRef, alt};
    if (anyNull) return {truth:null, err:anyNull};
    return {truth:false};
  }
  userUnknowns(user, ...asts){
    // Unbekannte, die über eigene Abkürzungen hereinkommen
    const out = new Set();
    for (const a of asts) for (const [k, v] of Object.entries(user)) if (astHas(a, n => n.t === 'sym' && n.name === k)) for (const u of unknownsIn(v, this.ctx)) out.add(u);
    return out;
  }
  /* Löst die Gleichung prev für die Unbekannte u (je Stichprobe) */
  solveFor(prevP, prevQ, u, user){
    const kind = this.ctx.unknowns[u].kind;
    const fixes = [];
    for (let i = 0; i < this.samples.length; i++){
      const roots = [];
      const resid = x => {
        const S = this.scope(i, 'rand', user);
        S.sample['§u:' + u] = new C(x, 0);
        try { const [a, b] = evalPair(prevP, prevQ, S); if (!isC(a) || !isC(b)) return NaN; const d = csub(a, b); return Math.abs(d.im) > 1e-6 * (cabs(a) + cabs(b) + 1e-12) ? NaN : d.re; } catch(e){ return NaN; }
      };
      const grid = [];
      if (kind === 'pos' || kind === 'int') for (let k = 0; k <= 240; k++) grid.push(Math.pow(10, -2.5 + 4.5 * k / 240));
      else for (let k = 0; k <= 240; k++){ const t = -1 + 2 * k / 240; grid.push(Math.sign(t) * Math.pow(10, -2.5 + 4.5 * Math.abs(t))); }
      let px = grid[0], pv = resid(px);
      for (let k = 1; k < grid.length; k++){
        const x = grid[k], v = resid(x);
        if (isFinite(pv) && isFinite(v) && pv * v <= 0){
          let a = px, b = x, fa = pv;
          for (let it = 0; it < 60; it++){ const m = (a + b) / 2, fm = resid(m); if (!isFinite(fm)) break; if (fa * fm <= 0) b = m; else { a = m; fa = fm; } }
          roots.push((a + b) / 2);
        }
        px = x; pv = v;
      }
      if (!roots.length) return null;
      fixes.push(roots);
    }
    return fixes;
  }
  folgeEq(P, Q, rel, user, prev){
    // gilt P rel Q, wenn man die Unbekannte aus der vorigen (falschen) Gleichung nimmt?
    if (!prev) return false;
    const unk = [...this.compare(P, Q, rel, user, 'rand').used];
    const unkPrev = [...this.compare(prev.P, prev.Q, '=', user, 'rand').used];
    if (unk.length !== 1 || unkPrev.length !== 1 || unk[0] !== unkPrev[0]) return false;
    const u = unk[0];
    const roots = this.solveFor(prev.P, prev.Q, u, user);
    if (!roots) return false;
    const nr = Math.max(...roots.map(r => r.length));
    for (let j = 0; j < nr; j++){
      const fix = roots.map(r => ({[u]:new C(r[Math.min(j, r.length - 1)], 0)}));
      const r = this.compare(P, Q, rel, user, 'rand', null, fix);
      if (r.res === true) return true;
    }
    return false;
  }
  /* Hinweise bei einem falschen Schritt */
  diagnose(P, Q, user, goal){
    const msgs = [];
    const mode = this.compare(P, Q, '=', user, 'rand').used.size ? 'ref' : 'rand';
    const pairs = [];
    for (let i = 0; i < this.samples.length; i++){
      const S = this.scope(i, mode, user);
      try { const [a, b] = evalPair(P, Q, S); pairs.push([a, b, i]); } catch(e){}
    }
    if (pairs.length < 2) return msgs;
    // eigene typische Fehler der Aufgabe
    if (goal && goal.mistakes){
      for (const m of goal.mistakes){
        try {
          const ast = parseExprStr(m.expr, this.ctx.pctx);
          const r = this.compare(Q, ast, '=', user, mode);
          if (r.res === true){ msgs.push(m.msg); return msgs; }
        } catch(e){}
      }
    }
    if (!pairs.every(([a, b]) => isC(a) && isC(b))){
      const ka = kindOf(pairs[0][0]), kb = kindOf(pairs[0][1]);
      const scalarMat = (ka === 'zahl' && kb === 'matrix') || (ka === 'matrix' && kb === 'zahl');
      if (ka !== kb && !scalarMat){ msgs.push('Links steht ' + artikel(ka) + ', rechts ' + artikel(kb) + '. Das kann nicht gleich sein.'); return msgs; }
      // proportional?
      const flat = X => isC(X) ? null : isVec(X) ? X.v : X.a.flat();
      const rs = [];
      for (const [a, b] of pairs){
        const A = isC(a) ? flat(mScale(eye(b.a.length), a)) : flat(a), B = isC(b) ? flat(mScale(eye(a.a.length), b)) : flat(b);
        let num = C0, den = 0; A.forEach((z, i) => { num = cadd(num, cmul(cconj(z), B[i])); den += z.re * z.re + z.im * z.im; });
        if (den < 1e-20) { rs.length = 0; break; }
        const r = cscale(num, 1 / den);
        const res = Math.sqrt(B.reduce((s, z, i) => { const d = csub(z, cmul(r, A[i])); return s + d.re * d.re + d.im * d.im; }, 0));
        if (res > 1e-7 * (Math.sqrt(den) * cabs(r) + 1e-12)) { rs.length = 0; break; }
        rs.push(r);
      }
      if (rs.length >= 2 && rs.every(r => cabs(csub(r, rs[0])) < 1e-6 * cabs(rs[0]))){
        const nm = factorName(rs[0]); msgs.push(nm || ('Beide Seiten sind bis auf den Faktor ' + fmtC(rs[0]) + ' gleich.'));
      } else if (rs.length >= 2) msgs.push('Beide Seiten sind zueinander proportional, aber der Faktor hängt von den Größen ab. Prüfe die Vorfaktoren.');
      return msgs;
    }
    if (pairs.every(([a, b]) => cabs(b) < 1e-11 && cabs(a) > 1e-9)){ msgs.push(this._who ? 'Die ' + this._who + ' Seite ist jetzt 0, vorher nicht.' : 'Rechts kommt 0 heraus, links nicht. Ist ein Term verloren gegangen?'); return msgs; }
    if (pairs.every(([a, b]) => cabs(a) < 1e-11 && cabs(b) > 1e-9)){ msgs.push(this._who ? 'Die ' + this._who + ' Seite war vorher 0.' : 'Links kommt 0 heraus, rechts nicht.'); return msgs; }
    // Betragsquadrat vergessen (Amplitude statt Wahrscheinlichkeit)?
    const sq = (x, y) => cabs(csub(cx(cabs(x) * cabs(x)), y)) < 1e-6 * (cabs(y) + 1e-12) && Math.abs(y.im) < 1e-9 * (cabs(y) + 1e-12);
    if (pairs.every(([a, b]) => cabs(a) > 1e-12 && cabs(b) > 1e-12) && !pairs.every(([a, b]) => cabs(csub(a, b)) < 1e-9)){
      if (pairs.every(([a, b]) => sq(b, a)) || pairs.every(([a, b]) => sq(a, b))){ msgs.push('Eine Seite ist das Betragsquadrat der anderen: Hier fehlt ein $|\\dots|^2$ oder es ist eins zu viel. (In der Quantenmechanik: Wahrscheinlichkeit $= |\\text{Amplitude}|^2$.)'); return msgs; }
    }
    const ratios = pairs.filter(([a]) => cabs(a) > 1e-12).map(([a, b]) => cdiv(b, a));
    const conjOk = pairs.every(([a, b]) => cabs(csub(cconj(a), b)) <= 1e-7 * (cabs(a) + 1e-12)) && pairs.some(([a]) => Math.abs(a.im) > 1e-9 * cabs(a));
    if (conjOk){ msgs.push('Rechts steht das komplex Konjugierte von links: Ein „*“ fehlt oder ist zu viel (bei i, bei ψ oder bei der Exponentialfunktion).'); return msgs; }
    if (ratios.length >= 2 && ratios.every(r => cabs(csub(r, ratios[0])) <= 1e-6 * cabs(ratios[0]))){
      const r = ratios[0];
      const name = factorName(r);
      if (name) msgs.push(name);
      else if (this._who) msgs.push('Die ' + this._who + ' Seite hat sich gegenüber der vorigen Zeile um den Faktor ' + fmtC(r) + ' verändert. Prüfe diesen Umformungsschritt.');
      else msgs.push('Beide Seiten unterscheiden sich um einen festen Faktor (etwa ' + fmtC(r) + '). Prüfe Vorfaktoren und Klammern.');
      return msgs;
    }
    if (pairs.every(([a, b]) => cabs(b) < 1e-12 && cabs(a) > 1e-9)){ msgs.push('Rechts kommt 0 heraus, links nicht.'); return msgs; }
    // Potenz einer Unbekannten vergessen (z. B. A statt |A|²)?
    if (mode === 'ref'){
      const used = [...this.compare(P, Q, '=', user, 'rand').used];
      for (const u of used){
        const uv = pairs.map(([, , i]) => { try { const S = this.scope(i, 'ref', user); return evalPart({t:'sym', name:u.split('_')[0], sub:u.includes('_') ? {t:'sym', name:u.split('_').slice(1).join('_'), hat:false, sub:null} : null, hat:false}, S); } catch(e){ return null; } });
        if (uv.some(x => !x || !isC(x))) continue;
        for (const k of [1, -1, 2, -2]){
          const ok = pairs.every(([a, b], j) => cabs(a) > 1e-12 && cabs(csub(cdiv(b, a), cpow(uv[j], cx(k)))) < 1e-6 * cabs(cpow(uv[j], cx(k))));
          if (ok){ msgs.push('Prüfe, wie oft ' + u + ' vorkommt: Die Seiten unterscheiden sich genau um ' + (Math.abs(k) === 1 ? u : u + '²') + '. Zum Beispiel steckt in $|\\psi|^2$ der Faktor $|' + u + '|^2$.'); return msgs; }
        }
      }
    }
    // Summanden
    const tm = this.termCheck(P, Q, user, mode);
    if (tm){ msgs.push(tm); return msgs; }
    // Abhängigkeit von einzelnen Größen
    const dep = this.ratioDependence(P, Q, user, mode);
    if (dep) msgs.push(dep);
    return msgs;
  }
  ratioDependence(P, Q, user, mode){
    const base = this.samples[0];
    const names = Object.keys(this.ctx.params).concat(this.ctx.coords);
    const changed = [];
    const ratioAt = smp => { const S = makeScope(this.ctx, smp, mode, {user}); const [a, b] = evalPair(P, Q, S); if (!isC(a) || !isC(b) || cabs(a) < 1e-12) return null; return cdiv(b, a); };
    let r0; try { r0 = ratioAt(Object.assign({}, base)); } catch(e){ return null; }
    if (!r0) return null;
    for (const k of names){
      const smp = Object.assign({}, base);
      if (!smp[k]) continue;
      const isInt = this.ctx.params[k] && paramKind(this.ctx.params[k]) === 'int';
      smp[k] = isInt ? new C(smp[k].re + 1, 0) : new C(smp[k].re * 1.37 + 0.05, 0);
      try { const r = ratioAt(smp); if (r && cabs(csub(r, r0)) > 1e-6 * cabs(r0)){ // Potenz schätzen
          const p = Math.log(cabs(r) / cabs(r0)) / Math.log((base[k].re * 1.37 + 0.05) / base[k].re);
          changed.push([k, p]);
        } } catch(e){}
    }
    if (!changed.length) return null;
    const ints = changed.filter(([k]) => this.ctx.params[k] && paramKind(this.ctx.params[k]) === 'int').map(c => c[0]);
    const crd = changed.filter(([k]) => this.ctx.coords.includes(k)).map(c => c[0]);
    if (crd.length && changed.length > 1) return 'Die beiden Seiten sind verschiedene Funktionen von ' + crd.join(', ') + ' (nicht nur ein konstanter Faktor). Prüfe ' + (crd.includes('t') ? 'Phasenfaktoren und Zeitabhängigkeit (sin/cos, Vorzeichen im Exponenten).' : 'Ableitungen, Produktregel und Integrationsgrenzen.');
    if (ints.length) return 'Die Abhängigkeit von ' + ints.join(', ') + ' stimmt nicht. Prüfe, wie die Quantenzahl in den Faktor eingeht (z. B. $\\sqrt{n}$ oder $\\sqrt{n+1}$).';
    if (changed.length === 1){
      const [k, p] = changed[0];
      const pr = Math.round(p * 2) / 2;
      if (this.ctx.coords.includes(k)) return 'Das Verhältnis der Seiten hängt von ' + k + ' ab: Geht beim Ableiten oder Integrieren etwas verloren (Kettenregel, Produktregel, Grenzen)?';
      if (Math.abs(p - pr) < 0.05 && pr !== 0) return 'Die Seiten unterscheiden sich um einen Faktor mit ' + k + (Math.abs(pr) !== 1 ? ' (etwa ' + k + '^' + fmtNum(pr) + ')' : '') + '. Prüfe die Potenzen von ' + k + (k === 'ħ' || k === 'm' || k === 'L' ? ' – eine Einheitenkontrolle hilft.' : '.');
      return 'Das Verhältnis der Seiten hängt von ' + k + ' ab.';
    }
    if (changed.length <= 3 && changed.every(([k]) => !this.ctx.coords.includes(k))) return 'Die Seiten unterscheiden sich um einen Faktor mit ' + changed.map(c => c[0]).join(', ') + '. Prüfe Vorfaktoren – eine Einheitenkontrolle hilft.';
    return null;
  }
  termCheck(P, Q, user, mode){
    const tryTerms = (A, B, sideA) => {
      if (A.t !== 'add' || A.a.length < 2 || A.a.length > 8) return null;
      for (let k = 0; k < A.a.length; k++){
        const rest = {t:'add', a:A.a.filter((_, j) => j !== k)};
        const flipped = {t:'add', a:A.a.map((t, j) => j === k ? (t.t === 'neg' ? t.a : {t:'neg', a:t}) : t)};
        const term = A.a[k];
        if (this.compare(rest, B, '=', user, mode).res === true) return {k:'drop', side:sideA, term};
        if (this.compare(flipped, B, '=', user, mode).res === true) return {k:'flip', side:sideA, term};
      }
      return null;
    };
    const r = tryTerms(Q, P, 'Q') || tryTerms(P, Q, 'P');
    if (!r) return null;
    const tt = '$' + tex(r.term.t === 'neg' ? r.term.a : r.term, 0) + '$';
    if (r.k === 'flip') return 'Das Vorzeichen beim Term ' + tt + ' stimmt nicht.';
    return r.side === 'Q' ? 'Der Term ' + tt + ' ist zu viel.' : 'Es fehlt der Term ' + tt + '.';
  }

  /* ganze Herleitung prüfen */
  run(lines, goal){
    const ctx = this.ctx;
    const user = {};
    const res = [];
    let prevExpr = null, prevLineBad = false, chainBad = false, lastEqWrong = null, firstExpr = null;
    let lastStmt = null, steps = 0, explicitSeen = false, chainStart = null;
    const goalHasOps = goal && goal.from ? astHas(parseExprStr(goal.from, ctx.pctx), n => (n.t === 'sym' && n.hat) || ['comm', 'braket', 'expect'].includes(n.t)) : false;
    for (let li = 0; li < lines.length; li++){
      Budget.until = Date.now() + 6000;
      const src = (lines[li] || '').trim();
      if (!src){ res.push({status:'empty'}); continue; }
      let line;
      try { line = parseLine(src, ctx.pctx); }
      catch(e){ res.push({status:'parse', msg:e.message, at:e.at}); continue; }
      if (!line.stmts.length){ res.push({status:'info', msg:'Kein Rechenausdruck in dieser Zeile.', tex:texLine(line)}); continue; }
      const r = {status:'ok', steps:[], tex:texLine(line), msgs:[]};
      let lineBad = false, lineFolge = false, lineNA = false;
      for (const st of line.stmts){
        let parts = st.parts.slice(), rels = st.rels.slice();
        if (st.cont){
          if (!prevExpr){ r.msgs.push('Die Zeile beginnt mit „' + rels[0] + '“, aber davor steht kein Ausdruck.'); lineNA = true; continue; }
          parts.unshift(prevExpr);
        }
        if (!firstExpr) firstExpr = parts[0];
        if (!st.cont) chainStart = parts[0];
        if (parts.length === 1){ prevExpr = parts[0]; lastStmt = {parts, rels, chainStart}; continue; }
        // eigene Abkürzung einführen?
        if (!st.cont && parts.length === 2 && (rels[0] === '=' || rels[0] === ':=')){
          const d = this.tryUserDef(parts[0], parts[1], user);
          if (d){ r.steps.push({status:'def', msg:d}); prevExpr = parts[1]; lastStmt = {parts, rels, def:true}; continue; }
        }
        for (let j = 0; j < rels.length; j++){
          const P = parts[j], Q = parts[j + 1], rel = rels[j];
          let stp;
          if (rel === '≈'){
            const t = this.stepTruth(P, Q, '=', user);
            stp = t.truth === true ? {status:'ok'} : {status:'info', msg:'Näherung (≈): wird nicht als Gleichheit geprüft.'};
          } else {
            const t = this.stepTruth(P, Q, rel, user);
            if (t.truth === true){ stp = {status:'ok', ref:t.ref}; if (t.alt) stp.msg = 'Auch eine Lösung; üblich ist die positive Wahl.'; }
            else if (t.truth === null){ stp = {status:'na', msg:explainErr(t.err)}; }
            else {
              // Folgefehler?
              let folge = false;
              if ((prevLineBad || chainBad) && lastEqWrong) folge = this.folgeEq(P, Q, rel, user, lastEqWrong);
              if (!folge && (prevLineBad || chainBad) && prevExpr && !st.cont && j === 0){
                const c1 = this.compare(Q, prevExpr, '=', user, 'rand');
                const c2 = this.compare(P, prevExpr, '=', user, 'rand');
                if (c1.res === true || c2.res === true) folge = true;
              }
              if (folge) stp = {status:'folge', msg:'Folgerichtig aus deiner vorigen Zeile – der Fehler liegt weiter oben.'};
              else {
                let msgs = null;
                if (!st.cont && j === 0 && lastStmt && lastStmt.parts.length === 2 && rels.length === 1){
                  const [lp, lq] = lastStmt.parts;
                  if (this.compare(Q, lq, '=', user, 'rand').res === true){ this._who = 'linke'; const d = this.diagnose(lp, P, user, goal); this._who = null; if (d.length) msgs = d; }
                  else if (this.compare(P, lp, '=', user, 'rand').res === true){ this._who = 'rechte'; const d = this.diagnose(lq, Q, user, goal); this._who = null; if (d.length) msgs = d; }
                }
                stp = {status:'wrong', msgs:msgs || this.diagnose(P, Q, user, goal)}; lastEqWrong = {P, Q};
              }
            }
          }
          if (stp.status === 'ok' || stp.status === 'folge'){ steps++; if (j > 0 || st.cont || li > 0) if (!astHas(Q, n => (n.t === 'sym' && n.hat) || ['comm', 'braket', 'expect'].includes(n.t))) explicitSeen = true; }
          if (stp.status === 'wrong') lineBad = true;
          if (stp.status === 'folge'){ lineFolge = true; lastEqWrong = {P, Q}; }
          if (stp.status === 'na') lineNA = true;
          r.steps.push(stp);
        }
        prevExpr = parts[parts.length - 1];
        lastStmt = {parts, rels, chainStart};
      }
      r.status = lineBad ? 'wrong' : lineFolge ? 'folge' : lineNA ? 'na' : (r.steps.length && r.steps.every(s => s.status === 'def')) ? 'def' : r.steps.length ? 'ok' : 'info';
      if (lineBad){ chainBad = true; }
      prevLineBad = lineBad || (prevLineBad && lineFolge);
      res.push(r);
    }
    const lastLine = res.filter(r => r.status !== 'empty').slice(-1)[0];
    const lastBad = !!(lastLine && lastLine.status === 'wrong');
    Budget.until = Date.now() + 6000;
    let final = null;
    try { final = goal ? this.judgeGoal(goal, lastStmt, user, {chainBad, steps, explicitSeen, goalHasOps, firstExpr, res, lastBad}) : null; }
    catch(e){ if (!(e instanceof EvalError)) { Budget.until = 0; throw e; } final = {state:'open', msg:e.message}; }
    Budget.until = 0;
    return {lines:res, final, user};
  }
  tryUserDef(L, Rh, user){
    let name = null, args = null;
    if (L.t === 'sym' && !L.hat) name = symKeyOf(L, {});
    else if (L.t === 'call' && typeof L.fn === 'object' && L.args.every(a => a.t === 'sym')){ name = symKeyOf(L.fn, {}); args = L.args.map(a => a.name); }
    if (!name) return null;
    // schon bekannt?
    const S = makeScope(this.ctx, Object.assign({}, this.samples[0]), 'rand', {user});
    if (args){
      if (this.ctx.defs[name] || this.ctx.abstract[name] || user[name + '()']) return null;
      try { if (this.ctx.rep === 'mat') evalM(L, S); else elab(L, S); return null; } catch(e){ if (!(e instanceof ElabError) || e.kind !== 'unknown') return null; }
    }
    else {
      S.noOpFallback = true;
      try { if (this.ctx.rep === 'mat') evalM(L, S); else elab(L, S); return null; }
      catch(e){ if (!(e instanceof ElabError) || e.kind !== 'unknown' || e.data !== name) return null; }
    }
    // rechte Seite muss auswertbar sein
    try { if (args) { /* geprüft beim Benutzen */ } else if (this.ctx.rep === 'mat') evalM(Rh, makeScope(this.ctx, Object.assign({}, this.samples[0]), 'rand', {user})); else elab(Rh, makeScope(this.ctx, Object.assign({}, this.samples[0]), 'rand', {user})); }
    catch(e){ return null; }
    if (args) user[name + '()'] = {args, body:Rh}; else user[name] = Rh;
    return 'Neue Abkürzung: ' + name + (args ? '(' + args.join(',') + ')' : '') + '. Sie wird ab jetzt eingesetzt.';
  }
  judgeGoal(goal, lastStmt, user, info){
    const ctx = this.ctx;
    if (!lastStmt) return {state:'open', msg:'Noch keine Rechnung.'};
    if (info.lastBad && goal.type !== 'show') return {state:'wrong', msg:'Die letzte Zeile stimmt noch nicht – sieh dir die Rückfrage dazu an.'};
    const F = lastStmt.parts[lastStmt.parts.length - 1];
    const F0 = lastStmt.parts[0];
    if (goal.type === 'solve'){
      const u = goal.unknown;
      const parts = lastStmt.parts;
      const isU = n => n.t === 'sym' && symKeyOf(n, {}) === u;
      let expr = null;
      if (parts.length === 2 && isU(parts[0])) expr = parts[1];
      else if (parts.length === 2 && isU(parts[1])) expr = parts[0];
      else if (lastStmt.chainStart && isU(lastStmt.chainStart) && lastStmt.rels.every(r => r === '=')) expr = parts[parts.length - 1];
      if (!expr) return {state:'open', msg:'Löse noch nach ' + u + ' auf: Am Ende sollte „' + u + ' = …“ stehen.'};
      if (astHas(expr, n => n.t === 'pm')){
        const br = expandPM(expr).map(e => this.matchTarget(e, goal, user, info, u));
        if (goal.both && br.every(m => m.state === 'solved')) return {state:'solved', msg:'Richtig: beide Lösungen.'};
        return {state:'open', msg:goal.both ? 'Prüfe beide Vorzeichen.' : 'Beide Vorzeichen lösen die Gleichung. Entscheide dich: Üblich ist die positive Wahl (die globale Phase ist frei). Schreib „' + u + ' = …“ ohne ±.'};
      }
      const left = [...unknownsIn(expr, ctx)];
      if (left.length) return {state:'open', msg:left.includes(u) ? 'Rechts darf ' + u + ' nicht mehr vorkommen.' : 'Rechts steht noch ' + left.join(', ') + ' – drücke das Ergebnis durch bekannte Größen aus.'};
      const m = this.matchTarget(expr, goal, user, info, u);
      if (goal.both && (m.state === 'solved' || m.state === 'solvedWithErrors')) return {state:'open', msg:'Diese Lösung stimmt. Es gibt aber zwei – gib beide an, z. B. als „' + u + ' = … ± …“.'};
      return m;
    }
    if (goal.type === 'value' || goal.type === 'eq'){
      // Teile der letzten Aussage, die mit „=“ verbunden sind (z. B. ΔxΔp = ħ√(10/28) ≥ ħ/2)
      const P = lastStmt.parts, Rl = lastStmt.rels;
      const eqParts = [P[0]]; for (let j = 0; j < Rl.length; j++){ if (Rl[j] === '=' || Rl[j] === '≈') eqParts.push(P[j + 1]); else break; }
      // Namen aus der Aufgabe (defs, Matrizen) dürfen im Ergebnis nur stehen, wenn auch das Ziel sie enthält – sonst wäre „φ(k)“ eine Antwort auf „berechne φ(k)“
      const echo = p => this.echoNames(p, goal);
      const cand = eqParts.slice().reverse().find(p => isClosedForm(p, ctx) && !unknownsIn(p, ctx).size && !echo(p).length);
      if (cand && cand !== F){ const m = this.matchTarget(cand, goal, user, info); if (m.state === 'solved' || m.state === 'solvedWithErrors') return m; }
      if (!isClosedForm(F, ctx)) return {state:'open', msg:'Rechne noch weiter, bis kein Integral, keine Ableitung und kein ⟨…⟩ mehr übrig ist.'};
      if (unknownsIn(F, ctx).size && !goal.allowUnknowns) return {state:'open', msg:'Im Ergebnis steht noch eine Unbekannte (' + [...unknownsIn(F, ctx)].join(', ') + '). Setze ihren Wert ein.'};
      const ec = echo(F);
      if (ec.length && !goal.allowNames) return {state:'open', msg:'Setze noch ein und rechne aus: Im Ergebnis steht noch ' + ec.join(', ') + '.'};
      return this.matchTarget(F, goal, user, info);
    }
    if (goal.type === 'show'){
      const from = parseExprStr(goal.from, ctx.pctx), to = parseExprStr(goal.to, ctx.pctx);
      const first = info.firstExpr;
      const same = (a, b) => this.compare(a, b, '=', user, 'rand').res === true || this.compare(a, b, '=', user, 'ref').res === true;
      const startsOk = first && (same(first, from) || same(first, to));
      const endsOk = same(F, to) || same(F, from);
      const syntacticEnd = goal.endForm ? goal.endForm(F) : true;
      const minSteps = goal.minSteps || 2;
      if (info.chainBad) return {state:'wrong', msg:'In der Herleitung steckt noch ein falscher Schritt.'};
      if (!startsOk) return {state:'open', msg:'Beginne mit der linken Seite der Behauptung.'};
      if (!endsOk || !syntacticEnd) return {state:'open', msg:'Am Ende sollte die rechte Seite der Behauptung stehen.'};
      if (info.steps < minSteps) return {state:'open', msg:'Das ist richtig, aber noch kein Nachweis: Zeig die Zwischenschritte (mindestens ' + minSteps + ').'};
      if (info.goalHasOps && !info.explicitSeen) return {state:'open', msg:'Schreib die Operatoren mindestens einmal aus (zum Beispiel p̂ = −iħ d/dx), sonst ist es kein Nachweis.'};
      return {state:'solved', msg:'Nachweis vollständig.'};
    }
    return {state:'open'};
  }
  echoNames(ast, goal){
    const ctx = this.ctx;
    if (!this._defNames){
      const M = ctx.M || {};
      this._defNames = new Set([...Object.keys(ctx.defs || {}), ...Object.keys(M.user || {}), ...Object.keys(M.base || {})]);
      this._famNames = new Set(Object.keys(ctx.fam || {}));
    }
    const namesOf = a => { const out = new Set(); const walk = n => { if (!n || typeof n !== 'object') return; if (Array.isArray(n)){ n.forEach(walk); return; } if (n.t === 'sym'){ const k = symKeyOf(n, {}); if (this._defNames.has(k)) out.add(k); else if (this._famNames.has(n.name) && (n.sub || (ctx.fam[n.name] && !ctx.fam[n.name].idx))) out.add(n.name); } for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v); }; walk(a); return out; };
    const tg = new Set();
    for (const t of [].concat(goal.target === undefined ? [] : goal.target, goal.alt || [])){ try { for (const k of namesOf(parseExprStr(String(t), ctx.pctx))) tg.add(k); } catch(e){} }
    return [...namesOf(ast)].filter(k => !tg.has(k));
  }
  matchTarget(expr, goal, user, info, u){
    const ctx = this.ctx;
    const targets = goal.target !== undefined ? (Array.isArray(goal.target) ? goal.target : [goal.target]).map(t => parseExprStr(String(t), ctx.pctx)) : (u ? ctx.unknowns[u].refs : []);
    const alts = goal.alt ? goal.alt.map(t => parseExprStr(t, ctx.pctx)) : (u && goal.target === undefined ? ctx.unknowns[u].alt : []);
    for (const T of targets){
      const r = this.compare(expr, T, '=', user, 'ref');
      if (r.res === true) return info.chainBad ? {state:'solvedWithErrors', msg:'Das Ergebnis stimmt, aber unterwegs ist eine Zeile falsch. Schau dir die rot markierte Zeile noch einmal an.'} : {state:'solved', msg:'Richtig!'};
    }
    for (const T of alts){
      const r = this.compare(expr, T, '=', user, 'ref');
      if (r.res === true){
        // „Bestimme A > 0“: die negative Lösung erfüllt die Gleichung, ist aber nicht gefragt
        if (u && targets.length && /(>|\\gt)\s*0/.test(goal.prompt || '')){ let neg = false; try { neg = this.compare(expr, {t:'neg', a:targets[0]}, '=', user, 'ref').res === true; } catch(e){} if (neg) return {state:'open', msg:'Das ist die negative Lösung. Gefragt ist ' + u + ' > 0.'}; }
        if (info.chainBad) return {state:'solvedWithErrors', msg:'Das Ergebnis stimmt, aber unterwegs ist eine Zeile falsch. Schau dir die rot markierte Zeile noch einmal an.'};
        return {state:'solved', msg:goal.altMsg || 'Auch richtig.'};
      }
    }
    if (info.chainBad && !info.lastBad) return {state:'folge', msg:'Dein Ergebnis passt zu deinem Rechenweg, aber in einer Zeile davor steckt ein Fehler.'};
    // passt der Wert zu einem typischen Fehler?
    if (goal.mistakes) for (const m of goal.mistakes){ try { if (this.compare(expr, parseExprStr(m.expr, ctx.pctx), '=', user, 'ref').res === true) return {state:'wrong', msg:m.msg}; } catch(e){} }
    const d = this.diagnose(targets[0], expr, user, null);
    return {state:'wrong', msg:'Das Ergebnis stimmt noch nicht.' + (d.length ? ' ' + d[0] : '')};
  }
}
function artikel(k){ return {zahl:'eine Zahl', ket:'ein Ket (Zustand)', bra:'ein Bra', matrix:'ein Operator (Matrix)', op:'ein Operator'}[k] || 'etwas anderes'; }
function fmtNum(x){
  for (let q = 1; q <= 12; q++){ const p = Math.round(x * q); if (p !== 0 && Math.abs(x - p / q) < 1e-7 * Math.abs(x)) return q === 1 ? String(p) : (p < 0 ? '−' : '') + Math.abs(p) + '/' + q; }
  const r = Math.round(x * 1000) / 1000; return String(r).replace('.', ',').replace('-', '−');
}
function fmtC(z){ if (Math.abs(z.im) < 1e-9 * cabs(z)) return fmtNum(z.re); if (Math.abs(z.re) < 1e-9 * cabs(z)) return fmtNum(z.im) + 'i'; return fmtNum(z.re) + (z.im < 0 ? ' − ' : ' + ') + fmtNum(Math.abs(z.im)) + 'i'; }
function factorName(r){
  const is = (z, w) => cabs(csub(z, w)) < 1e-6 * cabs(w);
  if (is(r, cx(-1))) return 'Vorzeichenfehler: Die eine Seite ist genau das Negative der anderen.';
  if (is(r, cx(0, 1)) || is(r, cx(0, -1))) return 'Es fehlt ein Faktor i (oder einer ist zu viel) – zum Beispiel bei p̂ = −iħ d/dx oder beim Ableiten von e^{ikx}.';
  if (is(r, cx(2)) || is(r, cx(0.5)) || is(r, cx(-2)) || is(r, cx(-0.5))) return 'Es fehlt ein Faktor 2 (oder einer ist zu viel)' + (r.re < 0 ? ', außerdem stimmt das Vorzeichen nicht' : '') + '. Häufig: Kettenregel, Doppelwinkel oder ½ vor dem Integral.';
  for (const [v, nm] of [[Math.PI, 'π'], [2 * Math.PI, '2π'], [Math.sqrt(Math.PI), '√π'], [Math.SQRT2, '√2'], [4, '4'], [3, '3']]){
    if (is(r, cx(v)) || is(r, cx(1 / v))) return 'Es fehlt ein Faktor ' + nm + ' (oder einer ist zu viel).';
    if (is(r, cx(-v)) || is(r, cx(-1 / v))) return 'Faktor ' + nm + ' und Vorzeichen prüfen.';
  }
  return null;
}
function explainErr(e){
  if (!e) return 'Diese Zeile kann ich nicht auswerten.';
  const m = String(e.message || e);
  if (e.kind === 'unknown') return m + ' Führe neue Größen mit „Name = …“ ein.';
  return m;
}

/* Bequeme Schnittstelle für die Oberfläche */
function goalLabel(ctx, goal){
  // Für Wert-Ziele: Steht in der Musterlösung „P = …“ mit einem neuen Symbol P, bezeichnet P die gesuchte Größe.
  if (goal.__label !== undefined) return goal.__label;
  goal.__label = null;
  if (goal.label){ goal.__label = goal.label; return goal.label; }
  if (goal.type !== 'value' || goal.target === undefined || !goal.model) return null;
  let start = null;
  for (const m of goal.model){
    const l = typeof m === 'string' ? m : m.l;
    try { const ln = parseLine(l, ctx.pctx); for (const st of ln.stmts) if (!st.cont && st.parts.length > 1) start = st.parts[0]; } catch(e){}
  }
  if (!start || start.t !== 'sym' || start.hat) return null;
  const key = symKeyOf(start, {});
  const known = ctx.defs[key] || ctx.params[key] || ctx.unknowns[key] || ctx.coords.includes(key) || (start.sub && ctx.fam[start.name]) || ctx.abstract[key] || ['i', 'e', 'π'].includes(key) || ctx.opNames.has(key) || (ctx.rep === 'mat' && ctx.stateDefs[key]);
  if (!known) goal.__label = key;
  return goal.__label;
}
function checkTask(taskCtxSpec, goal, lines, seed){
  let ctx = taskCtxSpec.__ctx || (taskCtxSpec.__ctx = makeCtx(taskCtxSpec));
  const lab = goal ? goalLabel(ctx, goal) : null;
  if (lab){
    if (!goal.__ctxL){
      const c2 = Object.create(ctx);
      c2.unknowns = Object.assign({}, ctx.unknowns, {[lab]:{kind:'pos', refs:(Array.isArray(goal.target) ? goal.target : [goal.target]).map(t => parseExprStr(String(t), ctx.pctx)), alt:[], label:true}});
      goal.__ctxL = c2;
    }
    ctx = goal.__ctxL;
  }
  const ch = new Checker(ctx, {seed:seed || 'qm'});
  return ch.run(lines, goal);
}
