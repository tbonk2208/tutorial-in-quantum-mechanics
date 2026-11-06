/* ===== Fehlerbibliothek: typische Fehltransformationen erkennen (Gutachten E5) =====
   Idee: Eine falsche Zeile wird „repariert“, indem eine typische Fehltransformation rückgängig gemacht wird
   (ψ → |ψ|², ψ → ψ*, |c| → |c|², r² bzw. sin θ ins Integral, Grenzen tauschen …). Stimmt die reparierte Seite
   numerisch mit der Bezugsseite überein, ist der begriffliche Fehler gefunden. Dazu kommen Faktorvergleiche
   (Verhältnis der Seiten = ħ^k, −iħ, q/k, 4π …). Ergebnis: {msg, lex, kind} oder null. */

/* Lexikon-id nur zurückgeben, wenn es den Eintrag gibt (Inhalte ändern sich; ohne Inhalte wird nicht geprüft) */
function lexId(...ids){
  for (const id of ids){ if (!id) continue; if (typeof LEX === 'undefined' || !Array.isArray(LEX) || LEX.some(e => e.id === id)) return id; }
  return null;
}

/* ---------- Hilfen für Syntaxbäume ---------- */
function astClone(n){
  if (!n || typeof n !== 'object') return n;
  if (Array.isArray(n)){ const a = n.map(astClone); for (const k of Object.keys(n)) if (!/^\d+$/.test(k)) a[k] = n[k]; return a; }
  const o = {}; for (const [k, v] of Object.entries(n)) o[k] = astClone(v); return o;
}
/* Kopie, in der die Knoten aus `targets` (Identität) durch make(kopie) ersetzt sind */
function astReplace(root, targets, make){
  const T = new Set(targets);
  const walk = n => {
    if (!n || typeof n !== 'object') return n;
    if (T.has(n)) return make(astClone(n));
    if (Array.isArray(n)){ const a = n.map(walk); for (const k of Object.keys(n)) if (!/^\d+$/.test(k)) a[k] = n[k]; return a; }
    const o = {}; for (const [k, v] of Object.entries(n)) o[k] = walk(v); return o;
  };
  return walk(root);
}
/* Durchlauf mit Elternknoten; f(n, parent, key) === false: nicht weiter absteigen */
function astWalkP(n, f, parent, key){
  if (!n || typeof n !== 'object') return;
  if (Array.isArray(n)){ for (const x of n) astWalkP(x, f, parent, key); return; }
  if (f(n, parent, key) === false) return;
  for (const [k, v] of Object.entries(n)) if (v && typeof v === 'object') astWalkP(v, f, n, k);
}
const DG_SQ = a => ({t:'pow', a:{t:'abs', a}, b:{t:'num', v:2}});
const DG_SYM = name => ({t:'sym', name, hat:false, sub:null});

/* Wellenfunktionen (ψ, φ, χ, R, u, Y, f, g …), die in der Aufgabe definiert sind */
const WAVE_NAMES = new Set(['ψ', 'φ', 'χ', 'Ψ', 'Φ', 'u', 'R', 'Y', 'f', 'g']);
function isWaveSym(s, ctx){
  if (!s || s.t !== 'sym' || s.hat || !WAVE_NAMES.has(s.name)) return false;
  let key; try { key = symKeyOf(s, {}); } catch(e){ return false; }
  if (ctx.defs[key]) return true;
  if (s.sub && ctx.fam[s.name]) return true;
  if (!s.sub && ctx.abstract[s.name]) return true;
  return false;
}
function isWaveNode(n, ctx){
  if (n.t === 'call' && n.fn && typeof n.fn === 'object') return isWaveSym(n.fn, ctx);
  return n.t === 'sym' && isWaveSym(n, ctx);
}
/* Vorkommen von Wellenfunktionen außerhalb von Bra-Ket-Klammern */
function waveOcc(ast, ctx){
  const out = [];
  astWalkP(ast, (n, par, key) => {
    if (['braket', 'expect', 'ket', 'bra', 'unc'].includes(n.t)) return false;
    if (isWaveNode(n, ctx)){ out.push({n, par, key}); return false; }
  });
  return out;
}
/* steht ψ „nackt“ da (nicht in |…|, *, Potenz, Ableitung)? */
const plainOcc = o => (!o.par || !['abs', 'conj', 'pow', 'prime', 'deriv', 'dag'].includes(o.par.t)) && !o.n.primes;
const isSqPow = n => n && n.t === 'pow' && n.b && n.b.t === 'num' && n.b.v === 2;
const isExpNode = (n, ctx) => (n.t === 'call' && n.fn === 'exp') || (n.t === 'pow' && n.a && n.a.t === 'sym' && n.a.name === 'e' && !n.a.sub && !ctx.params.e && !ctx.defs.e);
const hasI = n => astHas(n, m => m.t === 'sym' && m.name === 'i' && !m.sub);
const isExpectish = n => astHas(n, m => m.t === 'expect' || m.t === 'unc' || (m.t === 'braket' && m.op));

/* ---------- Reparaturen einer Seite X ---------- */
function dgCandidates(X, ctx, ch){
  const C = [];
  const push = (kind, ast, info) => { if (C.length < 16) C.push(Object.assign({kind, ast}, info || {})); };
  const pos = ctx.rep !== 'mat';
  if (pos){
    const occ = waveOcc(X, ctx);
    const plain = occ.filter(plainOcc);
    // ψ statt |ψ|² (Erwartungswert, Normierung, Wahrscheinlichkeit)
    if (plain.length && plain.length === occ.length && plain.length <= 3) push('abs2', astReplace(X, plain.map(o => o.n), DG_SQ));
    // ψ² statt |ψ|²
    const sq = occ.filter(o => o.par && isSqPow(o.par) && o.key === 'a').map(o => o.par);
    if (sq.length) push('sq', astReplace(X, sq, p => DG_SQ(p.a)));
    // fehlende Konjugation: mindestens zweimal ψ (auch als ψ', dψ/dx), kein *; einzeln oder paarweise konjugieren (Stromdichte: ψ*ψ' − ψ(ψ*)')
    const anyConj = astHas(X, n => (n.t === 'conj' || n.t === 'abs') && astHas(n, m => isWaveNode(m, ctx)));
    if (occ.length >= 2 && occ.length <= 4 && !anyConj){
      const units = occ.map(o => (plainOcc(o) || (o.n.primes && !(o.par && ['abs', 'conj', 'pow', 'dag'].includes(o.par.t)))) ? o.n : (o.par && (o.par.t === 'prime' || (o.par.t === 'deriv' && o.key === 'a')) ? o.par : null));
      if (units.every(Boolean)){
        const cj = a => ({t:'conj', a});
        for (const u of units.slice(0, 2)) push('conj', astReplace(X, [u], cj));
        if (units.length >= 3) for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) push('conj', astReplace(X, [units[i], units[j]], cj));
      }
    }
  }
  // |c_n| statt |c_n|², c_n bzw. ⟨a|ψ⟩ statt |…|²
  {
    const absN = [], ampN = [];
    // Amplitude: ⟨a|ψ⟩ oder c_n ohne Betrag; steht sie im Quadrat (c_n² bei komplexem c_n), wird das Quadrat ersetzt
    astWalkP(X, (n, par, key) => {
      if (n.t === 'abs'){ if (!(par && isSqPow(par) && key === 'a')) absN.push(n); return false; }
      const amp = (n.t === 'braket' && !n.op) || (n.t === 'sym' && n.name === 'c' && n.sub && !n.hat);
      if (amp){ if (!(par && (par.t === 'abs' || par.t === 'conj'))) ampN.push({n, at:par && isSqPow(par) && key === 'a' ? par : n}); return false; }
    });
    for (const n of absN.slice(0, 3)) push('cabs', astReplace(X, [n], a => ({t:'pow', a, b:{t:'num', v:2}})), {bk:n.a && n.a.t === 'braket'});
    if (ampN.length && ampN.length <= 3) push('camp', astReplace(X, ampN.map(o => o.at), m => m.t === 'pow' ? DG_SQ(m.a) : DG_SQ(m)), {bk:ampN[0].n.t === 'braket'});
  }
  if (pos){
    // Volumenelement in Kugelkoordinaten
    const ints = []; astWalkP(X, n => { if (n.t === 'int') ints.push(n); });
    const rI = ints.filter(n => n.v === 'r'), tI = ints.filter(n => n.v === 'θ');
    const mulBy = f => n => Object.assign(n, {a:{t:'mul', a:[n.a, f()], ex:[false, false]}});
    const r2 = () => ({t:'pow', a:DG_SYM('r'), b:{t:'num', v:2}}), sn = () => ({t:'call', fn:'sin', args:[DG_SYM('θ')]});
    if (rI.length === 1 && ctx.coords.includes('r')) push('r2', astReplace(X, rI, mulBy(r2)));
    if (tI.length === 1 && ctx.coords.includes('θ')) push('sin', astReplace(X, tI, mulBy(sn)));
    if (rI.length === 1 && tI.length === 1 && ctx.coords.includes('r') && ctx.coords.includes('θ')){
      const both = astReplace(X, rI, mulBy(r2)); const t2 = []; astWalkP(both, n => { if (n.t === 'int' && n.v === 'θ') t2.push(n); });
      push('r2sin', astReplace(both, t2, mulBy(sn)));
    }
    // Vorzeichen im Exponenten (e^{ikx} statt e^{-ikx}, e^{+iEt/ħ})
    const ex = []; astWalkP(X, n => { if (isExpNode(n, ctx) && hasI(n)){ ex.push(n); return false; } });
    for (const n of ex.slice(0, 3)) push('conjexp', astReplace(X, [n], a => ({t:'conj', a})), {t:astHas(n, m => m.t === 'sym' && m.name === 't')});
    // vertauschte Grenzen (nur wenn unten wirklich die größere Grenze steht)
    const lim = []; astWalkP(X, n => { if ((n.t === 'int' || n.t === 'evalbr') && n.lo && n.hi) lim.push(n); });
    for (const n of lim.slice(0, 3)){
      let lo, hi; try { lo = numOf(n.lo, ch.samples[0], ctx); hi = numOf(n.hi, ch.samples[0], ctx); } catch(e){ continue; }
      if (!(lo > hi)) continue;
      push('limits', astReplace(X, [n], m => Object.assign(m, {lo:m.hi, hi:m.lo})), {br:n.t === 'evalbr'});
    }
  }
  return C;
}

const DG_MSG = {
  abs2E:'Ein Erwartungswert wird mit $|\\psi|^2$ gewichtet, nicht mit $\\psi$: $\\langle x\\rangle = \\int x\\,|\\psi|^2\\,dx$, allgemein $\\langle A\\rangle = \\int\\psi^*\\hat A\\,\\psi\\,dx$.',
  abs2N:'Normiert wird $|\\psi|^2$, nicht $\\psi$: Die Bedingung lautet $\\int|\\psi|^2\\,dx = 1$.',
  abs2P:'Wahrscheinlichkeiten kommen aus $|\\psi|^2$, nicht aus $\\psi$: $P(a < x < b) = \\int_a^b|\\psi|^2\\,dx$.',
  sq:'$\\psi^2$ ist hier nicht $|\\psi|^2$: $\\psi$ ist komplex, gemeint ist $|\\psi|^2 = \\psi^*\\psi$.',
  conj:'Hier fehlt die komplexe Konjugation: Links im Skalarprodukt bzw. Erwartungswert steht $\\psi^*$, also $\\int\\psi^*\\hat A\\,\\psi\\,dx$.',
  conjG:'Hier fehlt eine komplexe Konjugation: Für komplexes $\\psi$ ist $\\psi^* \\ne \\psi$ – etwa in $|\\psi|^2 = \\psi^*\\psi$ oder in der Stromdichte $j = \\frac{\\hbar}{2mi}\\left(\\psi^*\\psi\' - \\psi\\,(\\psi^*)\'\\right)$.',
  conjexp:'Das Vorzeichen im Exponenten stimmt nicht: $e^{-i\\dots}$ ist das komplex Konjugierte von $e^{+i\\dots}$.',
  conjexpT:'Das Vorzeichen im Exponenten stimmt nicht: Die Zeitentwicklung ist $e^{-iEt/\\hbar}$; $e^{+iEt/\\hbar}$ ist das komplex Konjugierte.',
  cabs:'Eine Wahrscheinlichkeit ist ein Betragsquadrat: $P_n = |c_n|^2$, nicht $|c_n|$.',
  cabsB:'Eine Wahrscheinlichkeit ist ein Betragsquadrat: $P = |\\langle a|\\psi\\rangle|^2$, nicht $|\\langle a|\\psi\\rangle|$.',
  camp:'Die Wahrscheinlichkeit ist das Betragsquadrat $|c_n|^2$, nicht die Amplitude $c_n$ selbst.',
  campB:'Die Wahrscheinlichkeit ist das Betragsquadrat $|\\langle a|\\psi\\rangle|^2$, nicht die Amplitude $\\langle a|\\psi\\rangle$ selbst.',
  r2:'Im Volumenelement fehlt $r^2$: In Kugelkoordinaten ist $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$, radial also $\\int_0^\\infty\\dots\\,r^2\\,dr$.',
  sin:'Im Volumenelement fehlt $\\sin\\theta$: $d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$.',
  r2sin:'Im Volumenelement fehlen $r^2$ und $\\sin\\theta$: $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$.',
  limits:'Die Integrationsgrenzen sind vertauscht: Unten steht die untere Grenze. Vertauschen ändert das Vorzeichen, $\\int_b^a f\\,dx = -\\int_a^b f\\,dx$.',
  limitsB:'Die Grenzen in der Auswertungsklammer sind vertauscht: $[F]_a^b = F(b) - F(a)$, obere minus untere Grenze.',
  fourpi:'Es fehlt der Winkelanteil $4\\pi$ (oder er ist doppelt): $\\int_0^{2\\pi}\\!\\int_0^\\pi\\sin\\theta\\,d\\theta\\,d\\varphi = 4\\pi$.',
  twopi:'Es fehlt der Faktor $2\\pi$ aus $\\int_0^{2\\pi}d\\varphi$ (oder er ist doppelt).',
  hbar:'Es fehlt ein Faktor $\\hbar$ (oder einer ist zu viel). Eine Einheitenkontrolle hilft: $\\hbar$ steckt z. B. in $\\hat p = -i\\hbar\\,d/dx$, $E = \\hbar\\omega$ und $p = \\hbar k$.',
  hbarI:'Es fehlt der Faktor $-i\\hbar$ bzw. $i\\hbar$ (oder er ist zu viel) – zum Beispiel aus $\\hat p = -i\\hbar\\,d/dx$ oder aus $i\\hbar\\,\\partial\\psi/\\partial t$.',
  hbar2:'Die Potenz von $\\hbar$ stimmt nicht (die Seiten unterscheiden sich um $\\hbar^2$) – etwa in $\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2}$ oder $\\hat p^2 = -\\hbar^2\\frac{d^2}{dx^2}$.',
  qk:'Beim Transmissionskoeffizienten fehlt der Faktor $q/k$ (oder er ist zu viel): $T = \\frac{q}{k}\\,\\frac{|C|^2}{|A|^2}$, denn die Stromdichte $j = \\frac{\\hbar k}{m}|A|^2$ enthält die Geschwindigkeit.',
};
const DG_LEX = {abs2E:['erwartungswert'], abs2N:['normierung'], abs2P:['born'], sq:['komplexe-zahlen'], conj:['komplexe-zahlen', 'skalarprodukt'], conjG:['komplexe-zahlen'], conjexp:['komplexe-zahlen'], conjexpT:['zeitentwicklung', 'komplexe-zahlen'],
  cabs:['messpostulat', 'born'], cabsB:['messpostulat', 'born'], camp:['messpostulat', 'born'], campB:['messpostulat', 'born'], r2:['kugelkoordinaten', 'jacobi-determinante'], sin:['kugelkoordinaten', 'jacobi-determinante'], r2sin:['kugelkoordinaten', 'jacobi-determinante'],
  fourpi:['kugelkoordinaten'], twopi:['kugelkoordinaten'], qk:['reflexion-transmission', 'stromdichte'], i:['komplexe-zahlen'], absAll:['born'], conjAll:['komplexe-zahlen']};
const dgResult = (key, extra) => ({kind:key, msg:DG_MSG[key] + (extra || ''), lex:lexId(...(DG_LEX[key] || []))});

/* Reparaturen ausprobieren: zuerst die neue Seite Q, dann P (P nur, wenn P nicht schon als richtig geprüft ist: ch._refOk) */
function dgRepair(ch, P, Q, user, mode, pairs){
  const ctx = ch.ctx;
  const scalar = pairs && pairs.length && pairs.every(([a, b]) => isC(a) && isC(b));
  // Ist die eine Seite genau das Negative der anderen, ist „Vorzeichenfehler“ die nächstliegende Deutung
  // (bei rein imaginären Werten wäre auch „konjugiert“ numerisch richtig) – nur vertauschte Grenzen prüfen.
  const negAll = scalar && pairs.every(([a, b]) => cabs(cadd(a, b)) <= 1e-7 * (cabs(a) + 1e-12));
  for (const [X, Y, yi] of ch._refOk ? [[Q, P, 0]] : [[Q, P, 0], [P, Q, 1]]){
    let cands; try { cands = dgCandidates(X, ctx, ch); } catch(e){ continue; }
    if (negAll) cands = cands.filter(c => c.kind === 'limits');
    for (const c of cands){
      // Schnelltest an einer Stichprobe (die meisten Reparaturen passen nicht), erst dann alle Stichproben.
      // Der Wert der Bezugsseite Y ist aus diagnose() schon bekannt.
      try {
        if (scalar){ const [a0, b0, i0] = pairs[0]; const S = ch.scope(i0, mode, user); const v = evalPart(c.ast, S); if (valuesEqual(v, yi ? b0 : a0, S.approx ? TOL_APPROX : TOL, ctx.M) === false) continue; }
        else { const S = ch.scope(0, mode, user); const [a, b] = evalPair(c.ast, Y, S); if (valuesEqual(a, b, S.approx ? TOL_APPROX : TOL, ctx.M) === false) continue; }
      } catch(e){ if (!(e instanceof ElabError || e instanceof EvalError || e instanceof NeedUnroll)) throw e; }
      let r; try { r = ch.compare(c.ast, Y, '=', user, mode); } catch(e){ if (e instanceof ElabError || e instanceof EvalError) continue; throw e; }
      if (!r || r.res !== true) continue;
      if (c.kind === 'abs2'){
        // Worum geht es? Erwartungswert, Normierung oder Wahrscheinlichkeit
        // Steht außer ψ noch eine Koordinate oder Ableitung im Integranden, ist es ein Erwartungswert
        const withoutWaves = astReplace(X, waveOcc(X, ctx).map(o => o.n), () => ({t:'num', v:1}));
        const coordOutside = astHas(withoutWaves, n => n.t === 'deriv' || n.t === 'prime' || (n.t === 'sym' && ctx.coords.includes(n.name) && !n.sub));
        if (isExpectish(Y) || coordOutside) return dgResult('abs2E');
        if (Y.t === 'num' && Y.v === 1) return dgResult('abs2N');
        return dgResult('abs2P');
      }
      if (c.kind === 'cabs') return dgResult(c.bk ? 'cabsB' : 'cabs');
      if (c.kind === 'camp') return dgResult(c.bk ? 'campB' : 'camp');
      if (c.kind === 'conjexp') return dgResult(c.t ? 'conjexpT' : 'conjexp');
      if (c.kind === 'conj') return dgResult(astHas(X, n => n.t === 'int') || isExpectish(Y) ? 'conj' : 'conjG');
      if (c.kind === 'limits') return dgResult(c.br ? 'limitsB' : 'limits');
      return dgResult(c.kind);
    }
  }
  return null;
}

/* konstantes Verhältnis in Kugelkoordinaten: 4π, 2π */
function dgSpherical(ctx, P, Q){
  if (ctx.rep === 'mat') return false;
  if (['r', 'θ', 'φ'].some(c => ctx.coords.includes(c))) return true;
  return astHas(P, n => n.t === 'int' && ['r', 'θ', 'φ'].includes(n.v)) || astHas(Q, n => n.t === 'int' && ['r', 'θ', 'φ'].includes(n.v));
}
function dgConstFactor(r, ctx, P, Q){
  const is = (z, w) => cabs(csub(z, w)) < 1e-6 * cabs(w);
  if (dgSpherical(ctx, P, Q)){
    for (const [v, key] of [[4 * Math.PI, 'fourpi'], [2 * Math.PI, 'twopi']]) if (is(r, cx(v)) || is(r, cx(1 / v))) return dgResult(key);
  }
  return null;
}

/* Verhältnis der Seiten hängt nur von ħ bzw. q/k ab */
function dgParamFactor(ch, pairs, user, mode){
  const ctx = ch.ctx;
  const rat = pairs.map(([a, b, i]) => (isC(a) && isC(b) && cabs(a) > 1e-12) ? [cdiv(b, a), i] : null);
  if (rat.length < 2 || rat.some(x => !x)) return null;
  const constant = zs => zs.every(z => isFinite(z.re) && isFinite(z.im) && cabs(csub(z, zs[0])) <= 1e-6 * cabs(zs[0]));
  const is = (z, w) => cabs(csub(z, w)) < 1e-6 * cabs(w);
  // ħ^k mit k = ±1, ±2 und Vorfaktor ±1, ±i
  const hb = rat.map(([, i]) => ch.samples[i]['ħ']);
  if (hb.every(h => h && isC(h)) && !hb.every(h => Math.abs(h.re - hb[0].re) < 1e-9 * hb[0].re)){
    for (const k of [1, -1, 2, -2]){
      const cs = rat.map(([z], j) => cdiv(z, cx(Math.pow(hb[j].re, k))));
      if (!constant(cs)) continue;
      const c = cs[0];
      if (Math.abs(k) === 1){
        if (is(c, cx(1)) || is(c, cx(-1))) return dgResult('hbar', is(c, cx(-1)) ? ' Außerdem stimmt das Vorzeichen nicht.' : '');
        if (is(c, cx(0, 1)) || is(c, cx(0, -1))) return dgResult('hbarI');
      } else {
        if (is(c, cx(1)) || is(c, cx(-1))) return dgResult('hbar2', is(c, cx(-1)) ? ' Außerdem stimmt das Vorzeichen nicht.' : '');
        if (is(c, cx(0, 1)) || is(c, cx(0, -1))) return dgResult('hbar2', ' Außerdem fehlt ein Faktor $i$ (oder einer ist zu viel).');
      }
    }
  }
  // q/k (Transmission)
  const has = n => ctx.defs[n] || ctx.params[n];
  if (has('q') && has('k')){
    let qk;
    try { const ast = parseExprStr('q/k', ctx.pctx); qk = rat.map(([, i]) => { const v = evalPart(ast, ch.scope(i, mode, user)); return isC(v) ? v : null; }); } catch(e){ qk = null; }
    if (qk && qk.every(Boolean) && !constant(qk)){
      for (const e of [1, -1]){ const cs = rat.map(([z], j) => cdiv(z, cpow(qk[j], cx(e)))); if (constant(cs) && is(cs[0], cx(1))) return dgResult('qk'); }
    }
  }
  return null;
}
