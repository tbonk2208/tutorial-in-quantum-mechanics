/* ===== Matrixdarstellung: Spin, Oszillator (Besetzungszahlbasis), Drehimpuls |j,m⟩ ===== */
const isVec = v => v && v.t === 'vec';
const isMat = v => v && v.t === 'mat';
const vec = (arr, bra) => ({t:'vec', v:arr, bra:!!bra});
const matOf = a => ({t:'mat', a});
function zeros(n){ return Array.from({length:n}, () => C0); }
function eye(n){ return matOf(Array.from({length:n}, (_, i) => Array.from({length:n}, (_, j) => i === j ? C1 : C0))); }
function zmat(n){ return matOf(Array.from({length:n}, () => zeros(n))); }
function basisVec(n, i){ const v = zeros(n); if (i >= 0 && i < n) v[i] = C1; return vec(v); }
function mScale(X, c){
  if (isC(X)) return cmul(X, c);
  if (isVec(X)) return vec(X.v.map(z => cmul(z, c)), X.bra);
  return matOf(X.a.map(r => r.map(z => cmul(z, c))));
}
function mAdd(X, Y){
  if (isC(X) && isC(Y)) return cadd(X, Y);
  if (isC(X) && isMat(Y)) return mAdd(mScale(eye(Y.a.length), X), Y);
  if (isMat(X) && isC(Y)) return mAdd(X, mScale(eye(X.a.length), Y));
  if (isVec(X) && isVec(Y)){
    if (X.bra !== Y.bra) throw new EvalError('Bra und Ket kann man nicht addieren');
    if (X.v.length !== Y.v.length) throw new EvalError('Vektoren verschiedener Länge');
    return vec(X.v.map((z, i) => cadd(z, Y.v[i])), X.bra);
  }
  if (isMat(X) && isMat(Y)){ if (X.a.length !== Y.a.length) throw new EvalError('Matrizen verschiedener Größe'); return matOf(X.a.map((r, i) => r.map((z, j) => cadd(z, Y.a[i][j])))); }
  if (isC(X) && isVec(Y) || isVec(X) && isC(Y)) throw new EvalError('Zahl und Zustand kann man nicht addieren');
  throw new EvalError('Diese Summe passt nicht zusammen (Zahl, Vektor, Matrix)');
}
function kron(A, B){
  if (isVec(A) && isVec(B)){ const out = []; for (const a of A.v) for (const b of B.v) out.push(cmul(a, b)); return vec(out, A.bra); }
  if (isMat(A) && isMat(B)){
    const n = A.a.length, m = B.a.length, out = [];
    for (let i = 0; i < n * m; i++){ out.push([]); for (let j = 0; j < n * m; j++) out[i].push(cmul(A.a[Math.floor(i / m)][Math.floor(j / m)], B.a[i % m][j % m])); }
    return matOf(out);
  }
  throw new EvalError('⊗ nur zwischen Zuständen oder zwischen Operatoren');
}
function mMul(X, Y, M){
  if (isC(X)) return mScale(Y, X);
  if (isC(Y)) return mScale(X, Y);
  if (isVec(X) && X.bra && isVec(Y) && !Y.bra){ if (X.v.length !== Y.v.length) throw new EvalError('Bra und Ket verschiedener Länge'); let r = 0, im = 0; X.v.forEach((z, i) => { const p = cmul(z, Y.v[i]); r += p.re; im += p.im; }); return new C(r, im); }
  if (isVec(X) && !X.bra && isVec(Y) && Y.bra) return matOf(X.v.map(a => Y.v.map(b => cmul(a, b))));
  if (isMat(X) && isVec(Y) && !Y.bra){ return vec(X.a.map(r => { let s = 0, im = 0; r.forEach((z, j) => { const p = cmul(z, Y.v[j]); s += p.re; im += p.im; }); return new C(s, im); })); }
  if (isVec(X) && X.bra && isMat(Y)){ const n = Y.a.length; const out = []; for (let j = 0; j < n; j++){ let s = 0, im = 0; for (let i = 0; i < n; i++){ const p = cmul(X.v[i], Y.a[i][j]); s += p.re; im += p.im; } out.push(new C(s, im)); } return vec(out, true); }
  if (isMat(X) && isMat(Y)){
    const n = X.a.length, out = [];
    for (let i = 0; i < n; i++){ out.push([]); for (let j = 0; j < n; j++){ let s = 0, im = 0; for (let k = 0; k < n; k++){ const a = X.a[i][k], b = Y.a[k][j]; if ((a.re || a.im) && (b.re || b.im)){ s += a.re * b.re - a.im * b.im; im += a.re * b.im + a.im * b.re; } } out[i].push(new C(s, im)); } }
    return matOf(out);
  }
  if (isVec(X) && isVec(Y) && X.bra === Y.bra && M && M.tensor) return kron(X, Y);
  if (isVec(X) && !X.bra && isMat(Y)) throw new EvalError('Ein Operator steht rechts von einem Ket: meinst du ⟨…| statt |…⟩?');
  throw new EvalError('Dieses Produkt passt nicht zusammen');
}
function mDag(X){
  if (isC(X)) return cconj(X);
  if (isVec(X)) return vec(X.v.map(cconj), !X.bra);
  return matOf(X.a[0].map((_, j) => X.a.map(r => cconj(r[j]))));
}
function mConj(X){ if (isC(X)) return cconj(X); if (isVec(X)) return vec(X.v.map(cconj), X.bra); return matOf(X.a.map(r => r.map(cconj))); }
function mNorm(X){ if (isC(X)) return cabs(X); if (isVec(X)) return Math.sqrt(X.v.reduce((s, z) => s + z.re * z.re + z.im * z.im, 0)); return Math.sqrt(X.a.reduce((s, r) => s + r.reduce((t, z) => t + z.re * z.re + z.im * z.im, 0), 0)); }
function expm(A){
  const n = A.a.length;
  const nrm = mNorm(A);
  let s = 0; while (nrm / Math.pow(2, s) > 0.5) s++;
  const B = mScale(A, new C(1 / Math.pow(2, s), 0));
  let term = eye(n), sum = eye(n);
  for (let k = 1; k < 30; k++){ term = mScale(mMul(term, B), new C(1 / k, 0)); sum = mAdd(sum, term); if (mNorm(term) < 1e-18) break; }
  for (let i = 0; i < s; i++) sum = mMul(sum, sum);
  return sum;
}
function mPowInt(A, k){ let r = eye(A.a.length); for (let i = 0; i < k; i++) r = mMul(r, A); return r; }

/* Voreinstellungen */
const SQ2 = 1 / Math.SQRT2;
function makeMatCtx(ms, ctx, pctx){
  const M = {preset:ms.preset || 'spin', mats:{}, kets:{}, tensor:false};
  const hb = 'ħ';
  if (M.preset === 'spin'){
    M.dim = 2;
    const e0 = [C1, C0], e1 = [C0, C1];
    M.kets = {'↑':e0, '+':e0, '+z':e0, '0':e0, '↓':e1, '-':e1, '-z':e1, '1':e1,
      '+x':[cx(SQ2), cx(SQ2)], '-x':[cx(SQ2), cx(-SQ2)], '+y':[cx(SQ2), cx(0, SQ2)], '-y':[cx(SQ2), cx(0, -SQ2)], '→':[cx(SQ2), cx(SQ2)], '←':[cx(SQ2), cx(-SQ2)]};
    M.base = {
      'σ_x':[[0, 1], [1, 0]], 'σ_y':[[0, [0, -1]], [[0, 1], 0]], 'σ_z':[[1, 0], [0, -1]],
      'σ_+':[[0, 2], [0, 0]], 'σ_-':[[0, 0], [2, 0]]
    };
    M.spinHalf = true;
  } else if (M.preset === 'osc'){
    M.dim = ms.dim || 26; M.cmpDim = M.dim - 12;
  } else if (M.preset === 'jm'){
    M.js = ms.js || [0, 0.5, 1, 1.5, 2, 2.5, 3];
    M.offs = {}; let o = 0;
    for (const j of M.js){ M.offs[j] = o; o += Math.round(2 * j + 1); }
    M.dim = o;
  } else if (M.preset === 'spin2'){
    M.dim = 4; M.tensor = true;
    const up = [C1, C0], dn = [C0, C1];
    const k2 = (a, b) => [cmul(a[0], b[0]), cmul(a[0], b[1]), cmul(a[1], b[0]), cmul(a[1], b[1])];
    M.kets = {'↑↑':k2(up, up), '↑↓':k2(up, dn), '↓↑':k2(dn, up), '↓↓':k2(dn, dn), '↑':up, '↓':dn};
    M.coupled = {'1,1':k2(up, up), '1,0':k2(up, dn).map((z, i) => cadd(z, k2(dn, up)[i])).map(z => cscale(z, SQ2)),
      '1,-1':k2(dn, dn), '0,0':k2(up, dn).map((z, i) => csub(z, k2(dn, up)[i])).map(z => cscale(z, SQ2))};
  }
  M.user = {};
  for (const [k, v] of Object.entries(ms.mats || {})) M.user[k] = parseExprStr(v, pctx);
  return M;
}
function spinMats(S){
  const h = S.sample['ħ'].re / 2;
  const c = (x) => Array.isArray(x) ? new C(x[0], x[1]) : new C(x, 0);
  const sx = matOf([[C0, cx(h)], [cx(h), C0]]), sy = matOf([[C0, cx(0, -h)], [cx(0, h), C0]]), sz = matOf([[cx(h), C0], [C0, cx(-h)]]);
  return {sx, sy, sz};
}
function oscMats(S){
  const M = S.ctx.M, n = M.dim;
  const a = zmat(n);
  for (let k = 1; k < n; k++) a.a[k - 1][k] = cx(Math.sqrt(k));
  return {a, ad:mDag(a)};
}
function jmMats(S){
  const M = S.ctx.M, n = M.dim, h = S.sample['ħ'].re;
  const jz = zmat(n), jp = zmat(n), j2 = zmat(n);
  for (const j of M.js){
    const o = M.offs[j], d = Math.round(2 * j + 1);
    for (let k = 0; k < d; k++){
      const m = j - k; // Reihenfolge m = j, j-1, ..., -j
      jz.a[o + k][o + k] = cx(h * m);
      j2.a[o + k][o + k] = cx(h * h * j * (j + 1));
      if (k > 0){ const mm = m; jp.a[o + k - 1][o + k] = cx(h * Math.sqrt(j * (j + 1) - mm * (mm + 1))); }
    }
  }
  const jm = mDag(jp);
  const jx = mScale(mAdd(jp, jm), cx(0.5)), jy = mScale(mAdd(jp, mScale(jm, cx(-1))), cx(0, -0.5));
  return {jz, jp, jm, jx, jy, j2};
}
function jmIndex(M, j, m){
  if (M.offs[j] === undefined) return -1;
  const k = j - m;
  if (Math.abs(k - Math.round(k)) > 1e-9 || k < 0 || k > 2 * j + 1e-9) return -1;
  return M.offs[j] + Math.round(k);
}

/* Operator- oder Matrixname in der Matrixdarstellung */
function matSym(key, S){
  const M = S.ctx.M, ck = 'm:' + key;
  if (S.cache[ck]) return S.cache[ck];
  let r = null;
  const k0 = key.replace(/̂/g, '');
  if (M.user[k0]) r = evalM(M.user[k0], S);
  else if (M.preset === 'spin'){
    const {sx, sy, sz} = spinMats(S);
    const sp = mAdd(sx, mScale(sy, CI)), sm = mAdd(sx, mScale(sy, cx(0, -1)));
    const T = {'S_x':sx, 'S_y':sy, 'S_z':sz, 'S_+':sp, 'S_-':sm, 'S²':mScale(eye(2), cx(0.75 * Math.pow(S.sample['ħ'].re, 2))),
      'σ_x':matOf([[C0, C1], [C1, C0]]), 'σ_y':matOf([[C0, cx(0, -1)], [CI, C0]]), 'σ_z':matOf([[C1, C0], [C0, cx(-1)]]), 'I':eye(2), '𝟙':eye(2)};
    r = T[k0] || null;
  } else if (M.preset === 'osc'){
    const {a, ad} = oscMats(S);
    const hb = S.sample['ħ'].re, m = S.sample.m ? S.sample.m.re : 1, w = S.sample['ω'] ? S.sample['ω'].re : 1;
    const T = {'a':a, 'a†':ad, 'N':mMul(ad, a), 'x':mScale(mAdd(a, ad), cx(Math.sqrt(hb / (2 * m * w)))),
      'p':mScale(mAdd(ad, mScale(a, cx(-1))), cx(0, Math.sqrt(m * w * hb / 2))), 'H':mScale(mAdd(mMul(ad, a), mScale(eye(M.dim), cx(0.5))), cx(hb * w)), 'I':eye(M.dim)};
    r = T[k0] || null;
  } else if (M.preset === 'jm'){
    const J = jmMats(S);
    const T = {};
    for (const L of ['J', 'L', 'S']){ T[L + '_z'] = J.jz; T[L + '_+'] = J.jp; T[L + '_-'] = J.jm; T[L + '_x'] = J.jx; T[L + '_y'] = J.jy; T[L + '²'] = J.j2; }
    T.I = eye(M.dim);
    r = T[k0] || null;
  } else if (M.preset === 'spin2'){
    const {sx, sy, sz} = spinMats(S), I2 = eye(2);
    const T = {'S_1x':kron(sx, I2), 'S_1y':kron(sy, I2), 'S_1z':kron(sz, I2), 'S_2x':kron(I2, sx), 'S_2y':kron(I2, sy), 'S_2z':kron(I2, sz)};
    T.S_x = mAdd(T.S_1x, T.S_2x); T.S_y = mAdd(T.S_1y, T.S_2y); T.S_z = mAdd(T.S_1z, T.S_2z);
    T['S²'] = mAdd(mAdd(mMul(T.S_x, T.S_x), mMul(T.S_y, T.S_y)), mMul(T.S_z, T.S_z));
    T['S_1·S_2'] = mAdd(mAdd(mMul(T.S_1x, T.S_2x), mMul(T.S_1y, T.S_2y)), mMul(T.S_1z, T.S_2z));
    T.I = eye(4);
    r = T[k0] || null;
  }
  if (r) S.cache[ck] = r;
  return r;
}
function ketM(lab, S, bra){
  const M = S.ctx.M;
  let v = null;
  if (lab.length === 1 && lab[0].t === 'spec'){
    const arr = M.kets[lab[0].v]; if (!arr) throw new EvalError('Zustand |' + lab[0].v + '⟩ unbekannt');
    v = vec(arr.slice());
  } else if (lab.length === 1 && (lab[0].t === 'sym' || lab[0].t === 'call') && isStateName(lab[0], S)){
    v = evalM(lab[0], S);
    if (!isVec(v)) throw new EvalError('Das ist kein Zustand');
    if (v.bra) v = mDag(v);
  } else if (M.preset === 'osc' && lab.length === 1){
    const n = evalScalarInt(lab[0], S); v = basisVec(M.dim, n);
  } else if (M.preset === 'jm' && lab.length === 2){
    const j = evalScalarHalf(lab[0], S), m = evalScalarHalf(lab[1], S);
    v = basisVec(M.dim, jmIndex(M, j, m));
  } else if (M.preset === 'spin2' && lab.length === 2){
    const s = evalScalarInt(lab[0], S), m = evalScalarInt(lab[1], S);
    const arr = M.coupled[s + ',' + m]; v = arr ? vec(arr.slice()) : vec(zeros(4));
  } else if (M.preset === 'spin' && lab.length === 1 && lab[0].t === 'num'){
    const arr = M.kets[String(lab[0].v)]; if (!arr) throw new EvalError('Zustand unbekannt'); v = vec(arr.slice());
  } else {
    const r = evalM(lab[0], S);
    if (isVec(r)) v = r.bra ? mDag(r) : r; else throw new EvalError('Zustand unklar');
  }
  return bra ? mDag(v) : v;
}
function isStateName(n, S){
  const name = n.t === 'call' ? (typeof n.fn === 'object' ? n.fn.name : n.fn) : n.name;
  const key = n.t === 'sym' ? symKeyOf(n, S) : name;
  return !!(S.ctx.stateDefs[key] || S.ctx.stateDefs[name] || S.ctx.defs[key] || (S.ctx.defs[name] && S.ctx.defs[name].args) || S.user[key]);
}
function evalScalarInt(ast, S){ const v = evalM(ast, S); if (!isC(v)) throw new EvalError('Quantenzahl ist keine Zahl'); const r = Math.round(v.re); if (Math.abs(v.re - r) > 1e-9) return -999; return r; }
function evalScalarHalf(ast, S){ const v = evalM(ast, S); if (!isC(v)) throw new EvalError('Quantenzahl ist keine Zahl'); return Math.round(v.re * 2) / 2; }

/* Auswertung eines Syntaxbaums in der Matrixdarstellung */
function evalM(n, S){
  switch (n.t){
    case 'num': return new C(n.v, 0);
    case 'grp': return evalM(n.a, S);
    case 'sym': return evalMSym(n, S);
    case 'add': return n.a.map(t => evalM(t, S)).reduce((a, b) => mAdd(a, b));
    case 'neg': return mScale(evalM(n.a, S), cx(-1));
    case 'pm': throw new ElabError('± bitte als zwei Fälle schreiben', 'pm');
    case 'mul': {
      // Ableitungsoperator wirkt auf alles rechts davon
      const di = n.a.findIndex(f => f.t === 'deriv' && !f.a);
      if (di >= 0){
        const left = n.a.slice(0, di), right = n.a.slice(di + 1);
        if (!right.length) throw new EvalError('Ableitung ohne Ausdruck dahinter');
        const d = n.a[di];
        const rest = right.length === 1 ? right[0] : {t:'mul', a:right};
        const dv = numDerivM(rest, d.v, d.n, S);
        return left.reduce((acc, f) => mMul(acc, evalM(f, S)), C1) === C1 ? dv : mMul(left.reduce((acc, f) => mMul(acc, evalM(f, S)), C1), dv);
      }
      let acc = evalM(n.a[0], S);
      for (let i = 1; i < n.a.length; i++) acc = mMul(acc, evalM(n.a[i], S), S.ctx.M);
      return acc;
    }
    case 'tensor': return kron(evalM(n.a, S), evalM(n.b, S));
    case 'div': { const a = evalM(n.a, S), b = evalM(n.b, S); if (!isC(b)) throw new EvalError('Durch einen Vektor oder eine Matrix kann man nicht teilen'); return mScale(a, cdiv(C1, b)); }
    case 'pow': {
      if (n.a.t === 'sym' && !n.a.sub && (n.a.name === 'S' || n.a.name === 'L' || n.a.name === 'J') && n.b.t === 'num' && n.b.v === 2){ const r = matSym(n.a.name + '²', S); if (r) return r; }
      if (n.a.t === 'abs' && n.b.t === 'num' && n.b.v === 2){ const z = evalM(n.a.a, S); if (isC(z)) return new C(z.re * z.re + z.im * z.im, 0); }
      const a = evalM(n.a, S), b = evalM(n.b, S);
      if (isMat(b) && isC(a)){ if (Math.abs(a.re - Math.E) < 1e-12 && Math.abs(a.im) < 1e-12) return expm(b); return expm(mScale(b, clog(a))); }
      if (!isC(b)) throw new EvalError('Exponent ist keine Zahl');
      if (isMat(a)){ if (!Number.isInteger(b.re) || b.re < 0 || b.im) throw new EvalError('Matrixpotenz nur mit natürlichen Zahlen'); return mPowInt(a, b.re); }
      if (isVec(a)) throw new EvalError('Potenz eines Zustands');
      return cpow(a, b);
    }
    case 'conj': return mConj(evalM(n.a, S));
    case 'dag': {
      if (n.a.t === 'sym'){ const k = symKeyOf(n.a, S); const r = matSym(k + '†', S); if (r) return r; }
      return mDag(evalM(n.a, S));
    }
    case 'fact': { const a = evalM(n.a, S); return new C(factR(a.re), 0); }
    case 'abs': { const a = evalM(n.a, S); if (!isC(a)) return new C(mNorm(a), 0); return new C(cabs(a), 0); }
    case 'call': return evalMCall(n, S);
    case 'deriv': {
      if (!n.a) throw new EvalError('Ableitung ohne Ausdruck dahinter');
      return numDerivM(n.a, n.v, n.n, S);
    }
    case 'int': {
      const lo = evalM(n.lo, S), hi = evalM(n.hi, S), v = n.v;
      const old = S.sample[v];
      try { return integrate(x => { S.sample[v] = new C(x, 0); S.cache = {}; const r = evalM(n.a, S); if (!isC(r)) throw new EvalError('Integrand ist keine Zahl'); return r; }, lo.re, hi.re); }
      finally { S.sample[v] = old; S.cache = {}; }
    }
    case 'sum': {
      const v = n.v || 'n';
      const lo = n.lo ? evalScalarInt(n.lo, S) : 0;
      const hi = n.hi ? (n.hi.t === 'num' && n.hi.v === Infinity ? S.ctx.M.dim - 1 : evalScalarInt(n.hi, S)) : S.ctx.M.dim - 1;
      let acc = null;
      for (let k = lo; k <= hi; k++){
        const r = withMLocal(S, v, new C(k, 0), () => evalM(n.a, S));
        acc = acc === null ? r : mAdd(acc, r);
      }
      return acc === null ? C0 : acc;
    }
    case 'comm': {
      const A = evalM(n.a, S), B = evalM(n.b, S);
      const AB = mMul(A, B), BA = mMul(B, A);
      return n.anti ? mAdd(AB, BA) : mAdd(AB, mScale(BA, cx(-1)));
    }
    case 'ket': return ketM(n.lab, S, false);
    case 'bra': return ketM(n.lab, S, true);
    case 'braket': {
      const b = ketM(n.bra, S, true), k = ketM(n.ket, S, false);
      if (n.op){ const O = evalM(n.op, S); return mMul(b, mMul(O, k)); }
      return mMul(b, k);
    }
    case 'expect': {
      const psi = stateVec(S);
      const O = evalM(n.a, S);
      const num = mMul(mDag(psi), mMul(O, psi)), den = mMul(mDag(psi), psi);
      return cdiv(num, den);
    }
    case 'unc': {
      const psi = stateVec(S), O = evalM(n.a, S);
      const den = mMul(mDag(psi), psi);
      const e1 = cdiv(mMul(mDag(psi), mMul(O, psi)), den), e2 = cdiv(mMul(mDag(psi), mMul(O, mMul(O, psi))), den);
      return csqrt(csub(e2, cmul(e1, e1)));
    }
    case 'mat': {
      const rows = n.rows.map(r => r.map(e => { const z = evalM(e, S); if (!isC(z)) throw new EvalError('Matrixeintrag ist keine Zahl'); return z; }));
      if (rows[0].length === 1) return vec(rows.map(r => r[0]));
      if (rows.length === 1) return vec(rows[0], true);
      if (rows.length !== rows[0].length) throw new EvalError('Nur quadratische Matrizen');
      return matOf(rows);
    }
    case 'spec': return ketM([n], S, false);
    case 'lap': throw new EvalError('∇² gibt es hier nicht');
    case 'prime': throw new EvalError('Ableitungsstriche gibt es hier nicht');
    case 'evalbr': {
      const v = n.v || 't'; const lo = evalM(n.lo, S), hi = evalM(n.hi, S);
      const at = x => withMLocal(S, v, x, () => evalM(n.a, S));
      return mAdd(at(hi), mScale(at(lo), cx(-1)));
    }
  }
  throw new EvalError('Baustein ' + n.t + ' hier nicht möglich');
}
function withMLocal(S, v, value, f){
  const had = Object.prototype.hasOwnProperty.call(S.locals, v), old = S.locals[v];
  S.locals[v] = value; const oc = S.cache; S.cache = {};
  try { return f(); } finally { if (had) S.locals[v] = old; else delete S.locals[v]; S.cache = oc; }
}
function numDerivM(ast, v, order, S){
  const x0 = S.sample[v] || S.locals[v];
  if (!x0) throw new EvalError('Ableitung nach ' + v + ' hier nicht möglich');
  const at = h => { const oc = S.cache; S.cache = {}; const old = S.sample[v]; S.sample[v] = new C(x0.re + h, 0); try { return evalM(ast, S); } finally { S.sample[v] = old; S.cache = oc; } };
  const D = h => order === 1 ? mScale(mAdd(at(h), mScale(at(-h), cx(-1))), cx(1 / (2 * h))) : mScale(mAdd(mAdd(at(h), mScale(at(0), cx(-2))), at(-h)), cx(1 / (h * h)));
  const h = order === 1 ? 1e-3 : 1e-2;
  S.approx = true;
  return mAdd(mScale(D(h / 2), cx(4 / 3)), mScale(D(h), cx(-1 / 3)));
}
function stateVec(S){
  const st = S.ctx.state;
  const r = evalM({t:'sym', name:st, hat:false, sub:null}, S);
  if (!isVec(r)) throw new EvalError('Zustand ' + st + ' ist kein Vektor');
  return r.bra ? mDag(r) : r;
}
function evalMSym(n, S){
  const key = symKeyOf(n, S);
  const ctx = S.ctx;
  if (Object.prototype.hasOwnProperty.call(S.locals, key)){ const r = S.locals[key]; return r && r.op === false ? evalCore(r.e, S) : r; }
  if (key === 'i' && !ctx.params.i) return CI;
  if (key === 'π') return new C(Math.PI, 0);
  if (key === 'e' && !ctx.params.e) return new C(Math.E, 0);
  if (S.user[key]) return evalM(S.user[key], S);
  if (ctx.stateDefs[key]) return evalM(ctx.stateDefs[key], S);
  if (ctx.defs[key] && !ctx.defs[key].args) return evalM(ctx.defs[key].body, S);
  if (ctx.defs[key] && ctx.defs[key].args) return callMDef(ctx.defs[key], ctx.defs[key].args.map(a => evalM({t:'sym', name:a, hat:false, sub:null}, S)), S);
  const ms = matSym(key, S); if (ms) return ms;
  if (ctx.unknowns[key]){
    S.used.add(key);
    if (S.mode === 'ref'){ const u = ctx.unknowns[key]; const all = u.refs.concat(u.alt); const bi = S.branch && S.branch[key] !== undefined ? S.branch[key] : 0; return evalM(all[Math.min(bi, all.length - 1)], S); }
    const p = S.sample['§u:' + key]; if (p) return p;
  }
  if (S.sample[key] instanceof C) return S.sample[key];
  if (n.sub && ctx.fam[n.name]){
    const d = ctx.fam[n.name]; const idx = evalScalarInt(n.sub.t === 'list' ? n.sub.a[0] : n.sub, S);
    return withMLocal(S, d.idx, new C(idx, 0), () => evalM(d.body, S));
  }
  if (n.name === 'δ' && n.sub && n.sub.t === 'list' && n.sub.a.length === 2){ const a = evalM(n.sub.a[0], S), b = evalM(n.sub.a[1], S); return cabs(csub(a, b)) < 1e-9 ? C1 : C0; }
  if (key === 'I' || key === '𝟙'){ return eye(S.ctx.M.dim); }
  throw new ElabError('„' + key + '“ ist hier nicht bekannt', 'unknown', key);
}
function evalCore(e, S){ const env = envFor(S); for (const [k, v] of Object.entries(S.locals)) if (v instanceof C) env[k] = v; return compile(e)(env); }
function callMDef(d, args, S){
  const saved = {};
  d.args.forEach((a, i) => { saved[a] = S.locals[a]; S.locals[a] = args[i]; });
  const oc = S.cache; S.cache = {};
  try { return evalM(d.body, S); } finally { d.args.forEach(a => { if (saved[a] === undefined) delete S.locals[a]; else S.locals[a] = saved[a]; }); S.cache = oc; }
}
function evalMCall(n, S){
  if (typeof n.fn === 'string'){
    if (n.fn === 'Gamma'){ const a = evalM(n.args[0], S); if (!isC(a)) throw new EvalError('Γ nur für Zahlen'); return new C(factR(a.re - 1), 0); }
    const f = FNMAP[n.fn];
    const args = n.args.map(a => evalM(a, S));
    if (f === 'exp' && isMat(args[0])) return expm(args[0]);
    if ((n.fn === 'tr' || n.fn === 'Tr') && isMat(args[0])){ let s = C0; args[0].a.forEach((r, i) => { s = cadd(s, r[i]); }); return s; }
    if (n.fn === 'det' && isMat(args[0]) && args[0].a.length === 2){ const a = args[0].a; return csub(cmul(a[0][0], a[1][1]), cmul(a[0][1], a[1][0])); }
    if (!args.every(isC)) throw new EvalError(n.fn + ' nur für Zahlen');
    if (f === 'conj') return cconj(args[0]);
    if (f === 'abs') return new C(cabs(args[0]), 0);
    return evalFnNum(f, args);
  }
  const node = n.fn.t === 'prime' ? n.fn.a : n.fn;
  const key = symKeyOf(node, S);
  const ctx = S.ctx;
  const args = n.args.map(a => evalM(a, S));
  if (ctx.defs[key] && ctx.defs[key].args) return callMDef(ctx.defs[key], args, S);
  if (S.user[key + '()']) return callMDef(S.user[key + '()'], args, S);
  // Zustand mit Zeitargument: χ(t)
  if (ctx.stateDefs[key]){
    const t = args[0]; const old = S.sample.t; const oc = S.cache; S.cache = {};
    S.sample.t = t; try { return evalM(ctx.stateDefs[key], S); } finally { S.sample.t = old; S.cache = oc; }
  }
  // sonst Produkt
  const head = evalMSym(node, S);
  if (args.length !== 1) throw new EvalError(key + '(…) unbekannt');
  return mMul(head, args[0]);
}
