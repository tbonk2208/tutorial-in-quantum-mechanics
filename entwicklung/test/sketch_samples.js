/* Realistische Skizzenaufgaben als Testdaten für den Skizzen-Kern (test/t_sketch.js).
   NICHT Teil der App-Inhalte. Musterfunktionen aus exakten Lösungen (ħ = m = 1, Längen dimensionslos):
   – Kasten: sin(nπx), – endlicher Topf: z·tan z = √(z0² − z²), – Barriere und Stufe: Transfermatrix (Stetigkeit von ψ und ψ'),
   – Oszillator: Hermite-Rekursion, – Wasserstoff 2s: R20 ∝ (2 − r)e^{−r/2}, – Y10 ∝ cos θ, – freies Gauß-Paket: σ(t) = σ0·√(1 + (t/τ)²). */
'use strict';
const PI = Math.PI;

/* ---------- komplexe Zahlen (klein) ---------- */
const cx = (re, im) => ({re, im: im || 0});
const cadd = (a, b) => cx(a.re + b.re, a.im + b.im), csub = (a, b) => cx(a.re - b.re, a.im - b.im);
const cmul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const cexp = a => { const e = Math.exp(a.re); return cx(e * Math.cos(a.im), e * Math.sin(a.im)); };
const cabs = a => Math.hypot(a.re, a.im);
const csqrtR = v => v >= 0 ? cx(Math.sqrt(v), 0) : cx(0, Math.sqrt(-v));   // k = √(2(E − V)), bei E < V rein imaginär

/* ---------- stückweise konstantes Potential: Streuzustand von links über Transfermatrizen ----------
   Bereiche j = 0..n mit Grenzen xb[0..n-1] und Potentialen V[0..n]; ψ_j = A_j e^{ik_j x} + B_j e^{−ik_j x}.
   Rechts nur auslaufend (A_n = t, B_n = 0), links A_0 = 1 (einlaufend), B_0 = r. */
function scatter(E, xb, V){
  const n = V.length - 1, k = V.map(v => csqrtR(2 * (E - v)));
  const coef = new Array(n + 1);
  coef[n] = [cx(1), cx(0)];
  for (let j = n - 1; j >= 0; j--){
    const x = xb[j], [A, B] = coef[j + 1], k1 = k[j + 1], k0 = k[j];
    const e1p = cexp(cmul(cx(0, 1), cmul(k1, cx(x)))), e1m = cexp(cmul(cx(0, -1), cmul(k1, cx(x))));
    const psi = cadd(cmul(A, e1p), cmul(B, e1m));                                   // ψ(x⁺)
    const dpsi = cmul(cmul(cx(0, 1), k1), csub(cmul(A, e1p), cmul(B, e1m)));        // ψ'(x⁺)
    // links: A0 e^{ik0x} + B0 e^{−ik0x} = psi, ik0(A0 e^{ik0x} − B0 e^{−ik0x}) = dpsi
    const e0p = cexp(cmul(cx(0, 1), cmul(k0, cx(x)))), e0m = cexp(cmul(cx(0, -1), cmul(k0, cx(x))));
    const q = cdiv(dpsi, cmul(cx(0, 1), k0));
    coef[j] = [cdiv(cmul(cadd(psi, q), cx(0.5)), e0p), cdiv(cmul(csub(psi, q), cx(0.5)), e0m)];
  }
  const A0 = coef[0][0];
  for (let j = 0; j <= n; j++) coef[j] = [cdiv(coef[j][0], A0), cdiv(coef[j][1], A0)];
  const reg = x => { let j = 0; while (j < n && x >= xb[j]) j++; return j; };
  const psi = x => { const j = reg(x), [A, B] = coef[j], kk = k[j]; return cadd(cmul(A, cexp(cmul(cx(0, 1), cmul(kk, cx(x))))), cmul(B, cexp(cmul(cx(0, -1), cmul(kk, cx(x)))))); };
  const dpsi = x => { const j = reg(x), [A, B] = coef[j], kk = k[j]; return cmul(cmul(cx(0, 1), kk), csub(cmul(A, cexp(cmul(cx(0, 1), cmul(kk, cx(x))))), cmul(B, cexp(cmul(cx(0, -1), cmul(kk, cx(x))))))); };
  const t = coef[n][0], r = coef[0][1];
  const T = cabs(t) ** 2 * k[n].re / k[0].re, Rr = cabs(r) ** 2;
  return {psi, dpsi, t, r, T, R:Rr, k};
}
/* Realteil nach globaler Phase e^{iα} */
const rePhase = (S, alpha) => x => { const p = cmul(cexp(cx(0, alpha)), S.psi(x)); return p.re; };
const reDPhase = (S, alpha) => x => { const p = cmul(cexp(cx(0, alpha)), S.dpsi(x)); return p.re; };

/* ---------- endlicher Topf, gerader Grundzustand ---------- */
function wellGround(a, V0){
  const z0 = a * Math.sqrt(2 * V0);
  let lo = 1e-9, hi = Math.min(PI / 2 - 1e-9, z0);
  const g = z => z * Math.tan(z) - Math.sqrt(Math.max(0, z0 * z0 - z * z));
  for (let i = 0; i < 200; i++){ const m = (lo + hi) / 2; if (g(m) > 0) hi = m; else lo = m; }
  const z = (lo + hi) / 2, k = z / a, kap = Math.sqrt(z0 * z0 - z * z) / a;
  const B = Math.cos(k * a);
  const f = x => Math.abs(x) <= a ? Math.cos(k * x) : B * Math.exp(-kap * (Math.abs(x) - a));
  const df = x => Math.abs(x) <= a ? -k * Math.sin(k * x) : -Math.sign(x) * kap * B * Math.exp(-kap * (Math.abs(x) - a));
  return {f, df, k, kap, z, z0, E:k * k / 2};
}
/* ---------- endlicher Topf, ungerader erster angeregter Zustand: −z·cot z = √(z0² − z²) ---------- */
function wellOdd(a, V0){
  const z0 = a * Math.sqrt(2 * V0);
  let lo = PI / 2 + 1e-9, hi = Math.min(PI - 1e-9, z0);
  const g = z => -z / Math.tan(z) - Math.sqrt(Math.max(0, z0 * z0 - z * z));
  for (let i = 0; i < 200; i++){ const m = (lo + hi) / 2; if (g(m) > 0) hi = m; else lo = m; }
  const z = (lo + hi) / 2, k = z / a, kap = Math.sqrt(z0 * z0 - z * z) / a, B = Math.sin(k * a);
  const f = x => Math.abs(x) <= a ? Math.sin(k * x) : Math.sign(x) * B * Math.exp(-kap * (Math.abs(x) - a));
  const df = x => Math.abs(x) <= a ? k * Math.cos(k * x) : -kap * B * Math.exp(-kap * (Math.abs(x) - a));
  return {f, df, k, kap, z, z0, E:k * k / 2};
}
/* ---------- Oszillator ---------- */
function hermite(n, x){ let h0 = 1, h1 = 2 * x; if (n === 0) return h0; for (let m = 1; m < n; m++){ const h2 = 2 * x * h1 - 2 * m * h0; h0 = h1; h1 = h2; } return h1; }
const oscPsi = n => x => hermite(n, x) * Math.exp(-x * x / 2);

/* ---------- Parameter der Streuaufgaben ---------- */
// Rechteckbarriere 0 < x < d, E < V0: k = 2π/1,5 (λ = 1,5), κ = 2, d = 0,7
const BAR = (() => { const k = 2 * PI / 1.5, kap = 2, E = k * k / 2, V0 = E + kap * kap / 2, d = 0.7;
  const S = scatter(E, [0, d], [0, V0, 0]);
  const p = S.psi(d), alpha = -Math.atan2(p.im, p.re);       // ψ(d) reell positiv → Re ψ = |t| cosh(κ(x − d)) in der Barriere
  return {k, kap, E, V0, d, S, alpha, f:rePhase(S, alpha), df:reDPhase(S, alpha)}; })();
// Stufe bei x = 0, E > V0: λ links = 1, λ rechts = 1,7
const STEP = (() => { const k = 2 * PI, q = k / 1.7, E = k * k / 2, V0 = E - q * q / 2;
  const S = scatter(E, [0], [0, V0]); const alpha = PI / 5;
  return {k, q, E, V0, S, alpha, f:rePhase(S, alpha), df:reDPhase(S, alpha)}; })();
const WELL = wellGround(0.5, 8);
const WELL2 = wellOdd(0.5, 8);
// Stufe mit langer Wellenlänge (λ links = 2,5 = halbe Rahmenbreite), λ rechts = 1,7·λ links
const STEPL = (() => { const k = 2 * PI / 2.5, q = k / 1.7, E = k * k / 2, V0 = E - q * q / 2;
  const S = scatter(E, [0], [0, V0]); const alpha = PI / 5;
  return {k, q, E, V0, S, alpha, f:rePhase(S, alpha), df:reDPhase(S, alpha)}; })();
const P20 = r => r * r * (2 - r) * (2 - r) * Math.exp(-r);              // r²|R20|² (a0 = 1), Maxima bei 3 ∓ √5
const psi10sq = x => oscPsi(10)(x) ** 2;
const gauss = (x0, s) => x => Math.exp(-((x - x0) ** 2) / (2 * s * s));
const smoothstep = (a, b) => x => x <= a ? 0 : x >= b ? 1 : 0.5 - 0.5 * Math.cos(PI * (x - a) / (b - a));

/* ---------- Aufgaben ---------- */
const box = n => ({
  id:'smp-kasten-' + n, title:'$\\psi_' + n + '$ im unendlich tiefen Kasten', kind:'curve', draw:'psi',
  text:'Skizziere $\\psi_' + n + '(x)$ für den unendlich tiefen Kasten $0 < x < L$.',
  plot:{x:[-0.15, 1.15], dom:[0, 1], walls:[0, 1], xlab:'x', ylab:'\\psi_' + n + '(x)', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}]},
  f:x => Math.sin(n * PI * x),
  checks:[
    {id:'rand', type:'zero', at:[0, 1], msg:'Was verlangt die unendlich hohe Wand von $\\psi$ bei $x = 0$ und $x = L$?'},
    {id:'knoten', type:'nodes', n:n - 1, msg:'Wie viele Nullstellen hat $\\psi_' + n + '$ im Inneren des Kastens? Deine Skizze hat {got}.'},
    {id:'sym', type:'parity', p:n % 2 ? 'even' : 'odd', about:0.5, msg:'Ist $\\psi_' + n + '$ zur Kastenmitte symmetrisch oder antisymmetrisch? Deine Skizze ist {got}.'},
    {id:'buckel', type:'extrema', n, msg:'Wie viele halbe Wellen passen für $n = ' + n + '$ in den Kasten? Deine Skizze hat {got} Buckel.'}
  ].concat(n === 2 ? [{id:'mitte', type:'zero', at:[0.5], tol:0.04, msg:'Wo liegt der Knoten von $\\psi_2$? Denk an die Symmetrie des Kastens.'}] : []),
  reveal:'$\\psi_' + n + '(x) = \\sqrt{2/L}\\,\\sin(' + n + '\\pi x/L)$: ' + n + ' halbe Wellen, ' + (n - 1) + ' Knoten im Inneren, $\\psi = 0$ an beiden Wänden.',
  hints:['Wie viele halbe Wellenlängen passen in den Kasten, wenn $\\psi$ an beiden Wänden null ist?', 'Für $\\psi_n$ gilt $L = n\\,\\lambda/2$.'],
  wrong:[
    {f:x => Math.sin((n + 1) * PI * x), fails:['knoten', 'sym', 'buckel'], why:'n mit der Knotenzahl verwechselt'},
    {f:x => Math.cos((n - 0.6) * PI * (x - 0.5)) * (n % 2 ? 1 : 0) + (n % 2 ? 0 : Math.sin((n - 0.4) * PI * (x - 0.5))), fails:['rand'], why:'ψ an der unendlichen Wand nicht null'}
  ].concat(n > 1 ? [{f:x => Math.sin((n - 1) * PI * x), fails:['knoten', 'sym', 'buckel'], why:'einen Knoten zu wenig'}] : [])
   .concat(n === 2 ? [{f:x => Math.sin(2 * PI * (x < 0.35 ? x / 0.35 * 0.5 : 0.5 + (x - 0.35) / 0.65 * 0.5)), fails:['mitte', 'sym'], why:'Knoten an der falschen Stelle'}] : [])
});

const SAMPLES = [
  box(1), box(2), box(3), box(4), box(6),

  { id:'smp-topf-grund', title:'Grundzustand im endlichen Topf', kind:'curve', draw:'psi',
    text:'Skizziere den Grundzustand $\\psi_1(x)$ im endlichen Potentialtopf der Tiefe $V_0$ und Breite $L$.',
    plot:{x:[-1.6, 1.6], xlab:'x', ylab:'\\psi_1(x)', ticks:[{x:-0.5, lab:'-L/2'}, {x:0.5, lab:'L/2'}], V:x => Math.abs(x) < 0.5 ? 0 : 8, Vr:[0, 10], E:WELL.E, regions:[{x:[-1.6, -0.5], lab:'verboten'}, {x:[0.5, 1.6], lab:'verboten'}]},
    f:WELL.f,
    checks:[
      {id:'knoten', type:'nodes', n:0, msg:'Wie viele Knoten hat der Grundzustand? Deine Skizze hat {got}.'},
      {id:'sym', type:'parity', p:'even', about:0, msg:'Das Potential ist symmetrisch zu $x = 0$. Was folgt daraus für den Grundzustand?'},
      {id:'links', type:'decay', toward:'left', range:[-1.6, -0.5], msg:'Was macht $\\psi$ im klassisch verbotenen Bereich links vom Topf?'},
      {id:'rechts', type:'decay', toward:'right', range:[0.5, 1.6], msg:'Was macht $\\psi$ im klassisch verbotenen Bereich rechts vom Topf?'},
      {id:'glatt', type:'smooth', at:[-0.5, 0.5], msg:'Die Stufe ist endlich hoch. Was gilt dort für $\\psi$ und $\\psi\'$?'},
      {id:'vz', type:'sign', msg:'Kann der Grundzustand das Vorzeichen wechseln?'}
    ],
    reveal:'Innen $\\cos(kx)$, außen $e^{-\\kappa|x|}$; an den Stufen gehen Wert und Steigung stetig ineinander über.',
    wrong:[
      {f:x => Math.abs(x) < 0.5 ? Math.cos(PI * x) : 0, fails:['links', 'rechts', 'glatt'], why:'wie im unendlich tiefen Kasten: ψ = 0 außerhalb'},
      {f:x => Math.abs(x) <= 0.5 ? Math.cos(WELL.k * x) : WELL.f(0.5) * Math.exp(-4 * WELL.kap * (Math.abs(x) - 0.5)), fails:['glatt'], why:'Knick an der endlichen Stufe'},
      {f:x => Math.abs(x) <= 0.5 ? Math.sin(2.7 * x) : Math.sign(x) * Math.sin(1.35) * Math.exp(-3 * (Math.abs(x) - 0.5)), fails:['knoten', 'sym', 'vz'], why:'Grundzustand mit Knoten'},
      {f:x => Math.abs(x) <= 0.5 ? Math.cos(WELL.k * x) : WELL.f(0.5) * Math.cos(5 * (Math.abs(x) - 0.5)) * Math.exp(-0.6 * (Math.abs(x) - 0.5)) - 0.0 , fails:['links', 'rechts'], why:'Schwingung im verbotenen Bereich'}
    ] },

  { id:'smp-barriere', title:'Streuzustand an der Rechteckbarriere ($E < V_0$)', kind:'curve', draw:'psi',
    text:'Skizziere den Realteil des Streuzustands für ein Teilchen, das von links mit $E < V_0$ auf die Barriere trifft.',
    plot:{x:[-3, 3.7], xlab:'x', ylab:'\\mathrm{Re}\\,\\psi', ticks:[{x:0, lab:'0'}, {x:0.7, lab:'d'}], V:x => x > 0 && x < 0.7 ? BAR.V0 : 0, Vr:[0, BAR.V0 * 1.2], E:BAR.E, regions:[{x:[0, 0.7], lab:'Barriere'}]},
    f:BAR.f,
    checks:[
      {id:'links', type:'osc', range:[-3, 0], min:3, msg:'Wie sieht $\\psi$ im erlaubten Bereich vor der Barriere aus?'},
      {id:'innen', type:'noosc', range:[0, 0.7], msg:'Ist $E - V$ in der Barriere positiv oder negativ? Was bedeutet das für die Form von $\\psi$?'},
      {id:'abkl', type:'decay', toward:'right', range:[0, 0.7], ratio:0.7, msg:'Wird $|\\psi|$ in der Barriere größer oder kleiner?'},
      {id:'rechts', type:'osc', range:[0.7, 3.7], min:3, msg:'Kommt hinter der Barriere eine Welle an?'},
      {id:'lam', type:'wavelength', a:[-3, 0], b:[0.7, 3.7], cmp:'=', msg:'Hängt die Wellenlänge hinter der Barriere von $E - V$ ab? Wie groß ist $E - V$ dort im Vergleich zu links?'},
      {id:'amp', type:'amp', a:[-3, 0], b:[0.7, 3.7], cmp:'>', msg:'Ist die durchgelassene Welle größer oder kleiner als die Welle vor der Barriere?'},
      {id:'stetig', type:'cont', msg:'Darf $\\psi$ springen?'}
    ],
    reveal:'Links eine Welle (einlaufend plus reflektiert), in der Barriere kein Schwingen, sondern Abklingen, rechts eine kleinere Welle mit derselben Wellenlänge wie links.',
    wrong:[
      {f:x => x < 0 ? Math.cos(BAR.k * x) : x < 0.7 ? Math.cos(2.4 * BAR.k * x) * (1 - 0.6 * x) : 0.4 * Math.cos(BAR.k * x), fails:['innen', 'abkl'], why:'Schwingung in der Barriere'},
      {f:x => x <= 0.7 ? BAR.f(x) : BAR.f(0.7) * Math.cos(BAR.k / 1.7 * (x - 0.7)), fails:['lam'], why:'Energieverlust: längere Wellenlänge hinter der Barriere'},
      {f:x => x <= 0.7 ? BAR.f(x) : BAR.f(0.7) * Math.cos(BAR.k * 1.6 * (x - 0.7)), fails:['lam'], why:'kleinere Wellenlänge hinter der Barriere'},
      {f:x => x <= 0 ? BAR.f(x) : x < 0.7 ? BAR.f(0) * (1 - x / 0.7) ** 2 : 0, fails:['rechts', 'lam'], why:'keine Transmission'},
      {f:x => x < 0 ? Math.cos(BAR.k * x) : x < 0.7 ? Math.cos(BAR.k * 0.7) * 0 + (1 - x / 0.7) * 1 + (x / 0.7) * Math.cos(0) * 0.95 : 0.95 * Math.cos(BAR.k * (x - 0.7)), fails:['amp'], why:'gleiche Amplitude hinter der Barriere'}
    ] },

  { id:'smp-stufe', title:'Streuzustand an der Potentialstufe ($E > V_0$)', kind:'curve', draw:'psi',
    text:'Skizziere den Realteil des Streuzustands an der Stufe $V = V_0$ für $x > 0$ mit $E > V_0$.',
    plot:{x:[-2.5, 2.5], xlab:'x', ylab:'\\mathrm{Re}\\,\\psi', ticks:[{x:0, lab:'0'}], V:x => x > 0 ? STEP.V0 : 0, Vr:[0, STEP.E * 1.2], E:STEP.E},
    f:STEP.f,
    checks:[
      {id:'links', type:'osc', range:[-2.5, 0], min:3, msg:'Wie sieht $\\psi$ vor der Stufe aus?'},
      {id:'rechts', type:'osc', range:[0, 2.5], min:2, msg:'Ist der Bereich hinter der Stufe für $E > V_0$ erlaubt oder verboten?'},
      {id:'lam', type:'wavelength', a:[-2.5, 0], b:[0, 2.5], cmp:'<', msg:'Wie hängt die Wellenlänge von $E - V$ ab? Wo ist $E - V$ kleiner?'},
      {id:'stetig', type:'cont', msg:'Darf $\\psi$ an der Stufe springen?'}
    ],
    reveal:'Rechts ist $E - V$ kleiner, also $k$ kleiner und die Wellenlänge größer; an der Stufe gehen Wert und Steigung stetig über.',
    wrong:[
      {f:x => Math.cos(STEP.k * x + 0.6), fails:['lam'], why:'gleiche Wellenlänge auf beiden Seiten'},
      {f:x => x <= 0 ? STEP.f(x) : STEP.f(0) * Math.cos(STEP.k * 1.5 * x) + STEP.df(0) / (STEP.k * 1.5) * Math.sin(STEP.k * 1.5 * x), fails:['lam'], why:'kleinere Wellenlänge hinter der Stufe'},
      {f:x => x <= 0 ? STEP.f(x) : STEP.f(0) * Math.exp(-4 * x), fails:['rechts', 'lam'], why:'wie bei E < V0: Abklingen hinter der Stufe'},
      {f:x => x <= 0 ? STEP.f(x) : 0.7 * Math.sin(STEP.q * x), fails:['stetig'], why:'Sprung: die Welle beginnt hinter der Stufe neu bei null'}
    ] },

  { id:'smp-stufe-lang', title:'Langwelliger Streuzustand an der Stufe', kind:'curve', draw:'psi',
    text:'Skizziere den Realteil des Streuzustands an der Stufe bei $x = 0$ für $E$ knapp über $V_0$.',
    plot:{x:[-2.5, 2.5], xlab:'x', ylab:'\\mathrm{Re}\\,\\psi', ticks:[{x:0, lab:'0'}], V:x => x > 0 ? STEPL.V0 : 0, Vr:[0, STEPL.E * 1.2], E:STEPL.E},
    f:STEPL.f,
    checks:[
      {id:'glatt', type:'smooth', at:[0], msg:'Die Stufe ist endlich hoch. Was gilt dort für $\\psi\'$?'},
      {id:'stetig', type:'cont', msg:'Darf $\\psi$ an der Stufe springen?'},
      {id:'rechts', type:'osc', range:[0, 2.5], min:1, msg:'Ist der Bereich hinter der Stufe für $E > V_0$ erlaubt?'}
    ],
    reveal:'An einer endlich hohen Stufe sind $\\psi$ und $\\psi\'$ stetig, nur die Krümmung $\\psi\'\'$ springt.',
    wrong:[
      {f:x => x <= 0 ? STEPL.f(x) : STEPL.f(0) * Math.cos(STEPL.q * x) - 2 * STEPL.df(0) / STEPL.q * Math.sin(STEPL.q * x), fails:['glatt'], why:'Knick an der Stufe'},
      {f:x => x <= 0 ? STEPL.f(x) : 0.8 * Math.sin(STEPL.q * x), fails:['stetig'], why:'Sprung: die Welle beginnt hinter der Stufe neu bei null'}
    ] },

  { id:'smp-topf-2', title:'Erster angeregter Zustand im endlichen Topf', kind:'curve', draw:'psi',
    text:'Skizziere den ersten angeregten Zustand $\\psi_2(x)$ im endlichen Potentialtopf der Breite $L$.',
    plot:{x:[-1.6, 1.6], xlab:'x', ylab:'\\psi_2(x)', ticks:[{x:-0.5, lab:'-L/2'}, {x:0, lab:'0'}, {x:0.5, lab:'L/2'}], V:x => Math.abs(x) < 0.5 ? 0 : 8, Vr:[0, 10], E:WELL2.E},
    f:WELL2.f,
    checks:[
      {id:'knoten', type:'nodes', n:1, msg:'Wie viele Knoten hat der erste angeregte Zustand? Deine Skizze hat {got}.'},
      {id:'sym', type:'parity', p:'odd', about:0, msg:'Ist $\\psi_2$ gerade oder ungerade? Deine Skizze ist {got}.'},
      {id:'links', type:'decay', toward:'left', range:[-1.6, -0.5], ratio:0.5, msg:'Was macht $\\psi$ links vom Topf?'},
      {id:'rechts', type:'decay', toward:'right', range:[0.5, 1.6], ratio:0.5, msg:'Was macht $\\psi$ rechts vom Topf?'},
      {id:'glatt', type:'smooth', at:[-0.5, 0.5], msg:'Was gilt an den endlichen Stufen für $\\psi\'$?'}
    ],
    reveal:'Innen $\\sin(kx)$ mit einem Knoten in der Mitte, außen exponentielles Abklingen; an den Stufen glatter Übergang.',
    wrong:[
      {f:x => Math.abs(x) < 0.5 ? Math.sin(2 * PI * x) : 0, fails:['links', 'rechts', 'glatt'], why:'wie im unendlich tiefen Kasten'},
      {f:x => Math.abs(x) <= 0.5 ? Math.sin(WELL2.k * x) : Math.sign(x) * Math.sin(WELL2.k * 0.5) * Math.exp(-5 * WELL2.kap * (Math.abs(x) - 0.5)), fails:['glatt'], why:'Knick an der endlichen Stufe'},
      {f:WELL.f, fails:['knoten', 'sym'], why:'Grundzustand gezeichnet'}
    ] },

  { id:'smp-osz-2', title:'$\\psi_2$ des harmonischen Oszillators', kind:'curve', draw:'psi',
    text:'Skizziere $\\psi_2(x)$ des harmonischen Oszillators. Die klassischen Umkehrpunkte liegen bei $\\pm\\sqrt{5}\\,x_0$.',
    plot:{x:[-4.5, 4.5], xlab:'x/x_0', ylab:'\\psi_2', ticks:[{x:-2.236, lab:'-\\sqrt{5}'}, {x:0, lab:'0'}, {x:2.236, lab:'\\sqrt{5}'}], V:x => x * x / 2, Vr:[0, 8], E:2.5},
    f:oscPsi(2),
    checks:[
      {id:'knoten', type:'nodes', n:2, msg:'Wie viele Knoten hat $\\psi_2$? Deine Skizze hat {got}.'},
      {id:'sym', type:'parity', p:'even', about:0, msg:'Ist $\\psi_2$ gerade oder ungerade? Deine Skizze ist {got}.'},
      {id:'buckel', type:'extrema', n:3, msg:'Wie viele Buckel hat $\\psi_2$ zwischen den Umkehrpunkten?'},
      {id:'links', type:'decay', toward:'left', range:[-4.5, -2.4], msg:'Was macht $\\psi$ jenseits des linken Umkehrpunkts?'},
      {id:'rechts', type:'decay', toward:'right', range:[2.4, 4.5], msg:'Was macht $\\psi$ jenseits des rechten Umkehrpunkts?'}
    ],
    reveal:'$\\psi_2 \\propto (4x^2 - 2)\\,e^{-x^2/2}$: zwei Knoten bei $\\pm 1/\\sqrt{2}$, gerade, außerhalb der Umkehrpunkte rasches Abklingen.',
    wrong:[
      {f:oscPsi(1), fails:['knoten', 'sym', 'buckel'], why:'ψ1 statt ψ2'},
      {f:oscPsi(3), fails:['knoten', 'sym', 'buckel'], why:'ψ3 statt ψ2 (n mit Knotenzahl verwechselt)'},
      {f:x => Math.abs(x) < 2.236 ? Math.cos(1.5 * PI * x / 2.236) : 0, fails:['links', 'rechts'], why:'harte Wand am Umkehrpunkt, kein Eindringen'}
    ] },

  { id:'smp-osz-10', title:'$|\\psi_{10}|^2$ des harmonischen Oszillators', kind:'curve', draw:'abs2',
    text:'Skizziere $|\\psi_{10}(x)|^2$. Die klassischen Umkehrpunkte liegen bei $\\pm\\sqrt{21}\\,x_0 \\approx \\pm 4{,}6\\,x_0$.',
    plot:{x:[-6, 6], xlab:'x/x_0', ylab:'|\\psi_{10}|^2', ticks:[{x:-4.583, lab:'-\\sqrt{21}'}, {x:0, lab:'0'}, {x:4.583, lab:'\\sqrt{21}'}], V:x => x * x / 2, Vr:[0, 14], E:10.5},
    f:psi10sq,
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann eine Wahrscheinlichkeitsdichte negativ sein?'},
      {id:'knoten', type:'nodes', n:10, msg:'Wie viele Nullstellen hat $|\\psi_{10}|^2$? Deine Skizze hat {got}.'},
      {id:'sym', type:'parity', p:'even', about:0, msg:'Ist $|\\psi_{10}|^2$ symmetrisch?'},
      {id:'amp', type:'amp', a:[3, 5], b:[-1.5, 1.5], cmp:'>', msg:'Wo hält sich ein klassisches Teilchen länger auf: in der Mitte oder nahe den Umkehrpunkten? Wo sind die Buckel also höher?'},
      {id:'lam', type:'wavelength', a:[-1.5, 1.5], b:[2.6, 4.6], cmp:'<', msg:'Wo ist $E - V$ am größten? Wo liegen die Knoten also am dichtesten?'},
      {id:'rechts', type:'decay', toward:'right', range:[4.6, 6], msg:'Was passiert jenseits des Umkehrpunkts?'}
    ],
    reveal:'Elf Buckel, zur Mitte hin niedriger und schmaler, nahe den Umkehrpunkten höher und breiter (wie die klassische Aufenthaltsdichte), außen rasches Abklingen.',
    wrong:[
      {f:x => Math.abs(x) < 4.583 ? Math.sin(11 * PI * (x + 4.583) / (2 * 4.583)) ** 2 : 0, fails:['amp', 'lam'], why:'wie im Kasten: alle Buckel gleich hoch und gleich breit'},
      {f:x => Math.sin(11 * PI * (x + 4.583) / (2 * 4.583)) ** 2 * Math.exp(-x * x / 8) * (Math.abs(x) < 4.583 ? 1 : Math.exp(-3 * (Math.abs(x) - 4.583))), fails:['amp', 'lam'], why:'Buckel zur Mitte hin höher (wie im Grundzustand)'},
      {f:x => psi10sq(x) > 0 && Math.abs(x) < 4.6 ? 1 / Math.sqrt(Math.max(0.6, 21 - x * x)) : 1 / Math.sqrt(0.6) * Math.exp(-4 * (Math.abs(x) - 4.6)), fails:['knoten'], why:'klassische Dichte ohne Knoten'}
    ] },

  { id:'smp-delta', title:'Gebundener Zustand im δ-Potential', kind:'curve', draw:'psi',
    text:'Skizziere den gebundenen Zustand im Potential $V(x) = -\\alpha\\,\\delta(x)$.',
    plot:{x:[-3, 3], xlab:'x', ylab:'\\psi(x)', ticks:[{x:0, lab:'0'}]},
    f:x => Math.exp(-Math.abs(x)),
    checks:[
      {id:'knick', type:'kink', at:0, msg:'Was macht das δ-Potential mit der Steigung $\\psi\'$ bei $x = 0$?'},
      {id:'max', type:'maxat', x:0, tol:0.3, msg:'Wo ist $|\\psi|$ am größten?'},
      {id:'sym', type:'parity', p:'even', about:0, msg:'Ist der gebundene Zustand gerade oder ungerade?'},
      {id:'links', type:'decay', toward:'left', range:[-3, -0.2], msg:'Was macht $\\psi$ für $x < 0$, wo $E < V$ ist?'},
      {id:'rechts', type:'decay', toward:'right', range:[0.2, 3], msg:'Was macht $\\psi$ für $x > 0$, wo $E < V$ ist?'},
      {id:'knoten', type:'nodes', n:0, msg:'Hat der einzige gebundene Zustand einen Knoten?'}
    ],
    reveal:'$\\psi = \\sqrt{\\kappa}\\,e^{-\\kappa|x|}$: Spitze bei $x = 0$, weil $\\psi\'$ dort um $-2m\\alpha\\psi(0)/\\hbar^2$ springt.',
    wrong:[
      {f:x => Math.exp(-x * x / 2), fails:['knick'], why:'glatte Kuppe statt Knick'},
      {f:x => Math.abs(x) * Math.exp(-Math.abs(x)), fails:['max'], why:'ψ(0) = 0 am δ-Potential'},
      {f:x => Math.exp(-Math.abs(x) / 2) * Math.cos(2.5 * x), fails:['links', 'rechts', 'knoten'], why:'Schwingung im verbotenen Bereich'}
    ] },

  { id:'smp-radial-2s', title:'Radiale Aufenthaltsdichte des 2s-Zustands', kind:'curve', draw:'abs2',
    text:'Skizziere die radiale Aufenthaltsdichte $P(r) = r^2 |R_{20}(r)|^2$ des Wasserstoff-2s-Zustands.',
    plot:{x:[0, 15], xlab:'r/a_0', ylab:'r^2|R_{20}|^2', ticks:[{x:0, lab:'0'}, {x:2, lab:'2'}, {x:5, lab:'5'}, {x:10, lab:'10'}]},
    f:P20,
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann $P(r)$ negativ sein?'},
      {id:'null', type:'zero', at:[0], msg:'Welchen Wert hat $r^2|R|^2$ bei $r = 0$?'},
      {id:'knoten', type:'nodes', n:1, msg:'Wie viele radiale Knoten hat der Zustand $n = 2$, $l = 0$? Deine Skizze hat {got}.'},
      {id:'lage', type:'zero', at:[2], tol:0.5, msg:'Wo liegt der Knoten von $R_{20} \\propto (2 - r/a_0)\\,e^{-r/2a_0}$?'},
      {id:'max', type:'maxat', x:5.24, tol:1, msg:'Welches der beiden Maxima ist höher? Denk an den Faktor $r^2$.'},
      {id:'buckel', type:'extrema', n:2, kind:'max', msg:'Wie viele Maxima hat $P(r)$?'},
      {id:'aussen', type:'decay', toward:'right', range:[9, 15], msg:'Was macht $P(r)$ für große $r$?'}
    ],
    reveal:'Kleines Maximum bei $r \\approx 0{,}76\\,a_0$, Knoten bei $2a_0$, großes Maximum bei $r \\approx 5{,}2\\,a_0$.',
    wrong:[
      {f:r => P20(r) * 6 * Math.exp(-r / 2), fails:['max'], why:'inneres Maximum höher (Elektron „meist am Kern“)'},
      {f:r => r ** 4 * Math.exp(-r), fails:['knoten', 'lage', 'buckel'], why:'2s ohne Knoten (wie 2p)'},
      {f:r => (2 - r) ** 2 * Math.exp(-r), fails:['null', 'max'], why:'|R|² statt r²|R|²'}
    ] },

  { id:'smp-y10', title:'$|Y_{10}|^2$ über $\\theta$', kind:'curve', draw:'abs2',
    text:'Skizziere $|Y_{10}(\\theta, \\varphi)|^2$ als Funktion von $\\theta$ zwischen $0$ und $\\pi$.',
    plot:{x:[0, PI], xlab:'\\theta', ylab:'|Y_{10}|^2', ticks:[{x:0, lab:'0'}, {x:PI / 2, lab:'\\pi/2'}, {x:PI, lab:'\\pi'}]},
    f:t => Math.cos(t) ** 2,
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann $|Y|^2$ negativ sein?'},
      {id:'aequator', type:'zero', at:[PI / 2], tol:0.12, msg:'Welchen Wert hat $\\cos\\theta$ am Äquator?'},
      {id:'sym', type:'parity', p:'even', about:PI / 2, msg:'Was passiert mit $|\\cos\\theta|^2$, wenn man $\\theta$ durch $\\pi - \\theta$ ersetzt?'},
      {id:'knoten', type:'nodes', n:1, msg:'Wie viele Knotenkegel hat $Y_{10}$?'}
    ],
    reveal:'$|Y_{10}|^2 = \\frac{3}{4\\pi}\\cos^2\\theta$: Maxima an den Polen, Null am Äquator.',
    wrong:[
      {f:t => Math.sin(t) ** 2, fails:['aequator', 'knoten'], why:'mit |Y11|² verwechselt: Maximum am Äquator'},
      {f:t => Math.cos(t), fails:['pos', 'sym'], why:'cos θ statt cos² θ'},
      {f:t => 1, fails:['aequator', 'knoten'], why:'kugelsymmetrisch wie Y00'}
    ] },

  { id:'smp-paket', title:'Freies Gauß-Paket nach der Zeit $t$', kind:'curve', draw:'abs2',
    text:'Bei $t = 0$ ist $|\\psi|^2$ ein Gauß-Paket um $x = 0$ mit $\\sigma_0 = 0{,}5$ und mittlerem Impuls $\\hbar k_0$. Skizziere $|\\psi(x, t)|^2$ zur Zeit $t$ mit $\\hbar k_0 t/m = 4$ und $t = \\sqrt{3}\\,\\tau$.',
    plot:{x:[-3, 9], xlab:'x', ylab:'|\\psi(x,t)|^2', ticks:[{x:0, lab:'0'}, {x:4, lab:'4'}, {x:8, lab:'8'}]},
    f:gauss(4, 1.0),
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann $|\\psi|^2$ negativ sein?'},
      {id:'lage', type:'center', x:4, tol:0.5, msg:'Wo liegt der Schwerpunkt des Pakets zur Zeit $t$? Er bewegt sich mit $\\hbar k_0/m$.'},
      {id:'breite', type:'fwhm', v:2.355, tol:0.3, msg:'Wie ändert sich die Breite $\\sigma(t) = \\sigma_0\\sqrt{1 + (t/\\tau)^2}$? Deine Halbwertsbreite ist {got}.'},
      {id:'buckel', type:'extrema', n:1, kind:'max', msg:'Wie viele Maxima hat ein Gauß-Paket?'}
    ],
    reveal:'Schwerpunkt bei $x = 4$, Breite $\\sigma = 0{,}5\\sqrt{1 + 3} = 1$, also doppelt so breit (und halb so hoch) wie am Anfang.',
    wrong:[
      {f:gauss(0, 1.0), fails:['lage'], why:'Paket bewegt sich nicht'},
      {f:gauss(4, 0.5), fails:['breite'], why:'Paket zerfließt nicht'},
      {f:gauss(4, 0.3), fails:['breite'], why:'Paket wird schmaler'}
    ] },

  { id:'smp-gleich', title:'Gleichverteilung mit Fläche 1', kind:'curve', draw:'f',
    text:'Skizziere die Wahrscheinlichkeitsdichte $p(x)$ einer Gleichverteilung auf $0 \\le x \\le 2$.',
    plot:{x:[-0.5, 2.5], y:[0, 1.2], abs:true, dom:[0, 2], xlab:'x', ylab:'p(x)', ticks:[{x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}], yticks:[{y:0.5, lab:'1/2'}, {y:1, lab:'1'}]},
    f:x => 0.5,
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann eine Dichte negativ sein?'},
      {id:'hoehe', type:'level', v:0.5, tol:0.08, range:[0.1, 1.9], msg:'Wie hoch muss $p$ sein, damit die Fläche über $[0, 2]$ gleich 1 ist? Deine Höhe ist {got}.'},
      {id:'flaeche', type:'area', v:1, tol:0.15, msg:'Wie groß muss $\\int p\\,dx$ sein? Deine Fläche ist {got}.'}
    ],
    reveal:'$p(x) = 1/2$ auf $[0, 2]$, denn Breite mal Höhe muss 1 ergeben.',
    wrong:[
      {f:x => 1, fails:['hoehe', 'flaeche'], why:'Höhe 1 statt Fläche 1'},
      {f:x => 0.25, fails:['hoehe', 'flaeche'], why:'durch die doppelte Breite geteilt'}
    ] },

  { id:'smp-gaussdichte', title:'Normalverteilung mit $\\sigma = 1$', kind:'curve', draw:'f',
    text:'Skizziere die Dichte der Normalverteilung mit Mittelwert $0$ und Standardabweichung $\\sigma = 1$.',
    plot:{x:[-4, 4], y:[0, 1.1], abs:true, xlab:'x', ylab:'p(x)', ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}], yticks:[{y:0.2, lab:'0{,}2'}, {y:0.4, lab:'0{,}4'}, {y:1, lab:'1'}]},
    f:x => Math.exp(-x * x / 2) / Math.sqrt(2 * PI),
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann eine Dichte negativ sein?'},
      {id:'flaeche', type:'area', v:1, tol:0.25, msg:'Wie groß ist die Fläche unter einer Wahrscheinlichkeitsdichte? Deine ist etwa {got}.'},
      {id:'breite', type:'fwhm', v:2.355, tol:0.3, msg:'Die Halbwertsbreite ist $2\\sqrt{2\\ln 2}\\,\\sigma \\approx 2{,}35\\,\\sigma$. Wie breit ist deine Kurve auf halber Höhe? ({got})'},
      {id:'lage', type:'maxat', x:0, tol:0.3, msg:'Wo liegt das Maximum?'}
    ],
    reveal:'Maximum $1/\\sqrt{2\\pi} \\approx 0{,}40$ bei $x = 0$, Wendepunkte bei $\\pm\\sigma$, Halbwertsbreite $\\approx 2{,}35$.',
    wrong:[
      {f:x => Math.exp(-x * x / 2), fails:['flaeche'], why:'Maximum 1 statt Fläche 1'},
      {f:x => Math.exp(-x * x / 8) / Math.sqrt(2 * PI), fails:['flaeche', 'breite'], why:'doppelt so breit bei gleicher Höhe'},
      {f:x => Math.exp(-x * x / 0.5) / Math.sqrt(2 * PI), fails:['flaeche', 'breite'], why:'halb so breit bei gleicher Höhe'}
    ] },

  { id:'smp-ableitung', title:'Ableitung von $e^{-x^2}$', kind:'curve', draw:'f',
    text:'Skizziere die Ableitung $\\frac{d}{dx}e^{-x^2}$.',
    plot:{x:[-3, 3], xlab:'x', ylab:'f\'(x)', ticks:[{x:0, lab:'0'}]},
    f:x => -2 * x * Math.exp(-x * x),
    checks:[
      {id:'sym', type:'parity', p:'odd', about:0, msg:'Die Funktion $e^{-x^2}$ ist gerade. Was gilt dann für ihre Ableitung?'},
      {id:'null', type:'zero', at:[0], tol:0.15, msg:'Welche Steigung hat $e^{-x^2}$ im Maximum?'},
      {id:'vz', type:'sign', s:1, range:[-3, -0.15], msg:'Steigt oder fällt $e^{-x^2}$ für $x < 0$?'},
      {id:'buckel', type:'extrema', n:2, msg:'Wo ist $e^{-x^2}$ am steilsten? Wie viele Extrema hat die Ableitung?'},
      {id:'abkl', type:'decay', toward:'right', range:[1.6, 3], msg:'Was macht die Steigung für große $x$?'}
    ],
    reveal:'$f\'(x) = -2x\\,e^{-x^2}$: ungerade, positiv für $x < 0$, Extrema bei $x = \\mp 1/\\sqrt{2}$.',
    wrong:[
      {f:x => Math.exp(-x * x), fails:['sym', 'null'], why:'Funktion statt Ableitung'},
      {f:x => 2 * x * Math.exp(-x * x), fails:['vz'], why:'Vorzeichen der inneren Ableitung vergessen'},
      {f:x => -2 * x, fails:['buckel', 'abkl'], why:'nur die innere Ableitung'}
    ] },

  { id:'smp-gedaempft', title:'Gedämpfte Schwingung', kind:'curve', draw:'f',
    text:'Skizziere die Lösung $y(t) = e^{-\\gamma t}\\cos(\\omega t)$ für schwache Dämpfung ($\\gamma \\ll \\omega$).',
    plot:{x:[0, 10], xlab:'t', ylab:'y(t)', ticks:[{x:0, lab:'0'}, {x:5, lab:'5'}, {x:10, lab:'10'}]},
    f:t => Math.exp(-0.25 * t) * Math.cos(3 * t),
    checks:[
      {id:'osc', type:'osc', min:5, msg:'Schwingt die Lösung für $\\gamma \\ll \\omega$?'},
      {id:'amp', type:'amp', a:[0, 3], b:[6, 9], cmp:'>', msg:'Was macht der Faktor $e^{-\\gamma t}$ mit der Amplitude?'},
      {id:'lam', type:'wavelength', a:[0, 4], b:[4, 8], cmp:'=', msg:'Ändert sich die Periode mit der Zeit?'}
    ],
    reveal:'Gleichbleibende Periode $2\\pi/\\omega$, Amplitude nimmt mit $e^{-\\gamma t}$ ab.',
    wrong:[
      {f:t => Math.cos(3 * t), fails:['amp'], why:'Dämpfung vergessen'},
      {f:t => Math.exp(-0.5 * t), fails:['osc'], why:'aperiodischer Grenzfall statt schwacher Dämpfung'},
      {f:t => Math.exp(-0.25 * t) * Math.cos(1.5 * t + 0.25 * t * t), fails:['lam'], why:'Periode wird mit der Amplitude kürzer'}
    ] },

  /* ---------- Pfeile ---------- */
  { id:'smp-iz', title:'$iz$ als Zeiger', kind:'arrows',
    text:'Zeichne den Zeiger von $iz$ für das gegebene $z$.',
    plot:{x:[-2, 2], y:[-2, 2], abs:true, xlab:'\\mathrm{Re}', ylab:'\\mathrm{Im}', unit:true, grid:1},
    given:[{from:[0, 0], to:[1.5, 0.5], lab:'z'}],
    want:[{from:[0, 0], to:[-0.5, 1.5], lab:'iz', msg:'Was macht die Multiplikation mit $i = e^{i\\pi/2}$ mit dem Winkel und mit dem Betrag?'}],
    reveal:'$iz = i(1{,}5 + 0{,}5i) = -0{,}5 + 1{,}5i$: um $90°$ gegen den Uhrzeigersinn gedreht, gleicher Betrag.',
    wrong:[
      {arrows:[{from:[0, 0], to:[1.5, -0.5]}], fails:[0], why:'mit z̄ verwechselt'},
      {arrows:[{from:[0, 0], to:[0.5, -1.5]}], fails:[0], why:'im Uhrzeigersinn gedreht'},
      {arrows:[{from:[0, 0], to:[0.5, 1.5]}], fails:[0], why:'Real- und Imaginärteil nur vertauscht'}
    ] },
  { id:'smp-iz-zbar', title:'$iz$ und $\\bar z$', kind:'arrows',
    text:'Zeichne die Zeiger von $iz$ und $\\bar z$.',
    plot:{x:[-2, 2], y:[-2, 2], abs:true, xlab:'\\mathrm{Re}', ylab:'\\mathrm{Im}', unit:true, grid:1},
    given:[{from:[0, 0], to:[1.5, 0.5], lab:'z'}],
    want:[{from:[0, 0], to:[-0.5, 1.5], lab:'iz', msg:'Was macht die Multiplikation mit $i$ mit dem Winkel?'},
          {from:[0, 0], to:[1.5, -0.5], lab:'\\bar z', msg:'An welcher Achse spiegelt das Konjugieren?'}],
    extra:'Es sind mehr Pfeile gezeichnet als gefragt. Radiere die überzähligen.',
    reveal:'$iz = -0{,}5 + 1{,}5i$ (Drehung um $90°$), $\\bar z = 1{,}5 - 0{,}5i$ (Spiegelung an der reellen Achse).',
    wrong:[
      {arrows:[{from:[0, 0], to:[-0.5, 1.5]}, {from:[0, 0], to:[-1.5, -0.5]}], fails:[1], why:'Konjugieren als Punktspiegelung (−z)'},
      {arrows:[{from:[0, 0], to:[-0.5, 1.5]}, {from:[0, 0], to:[-1.5, 0.5]}], fails:[1], why:'an der imaginären Achse gespiegelt'}
    ] },
  { id:'smp-summe', title:'Summe zweier Vektoren', kind:'arrows',
    text:'Zeichne $\\vec a + \\vec b$ vom Ursprung aus.',
    plot:{x:[-2, 3.5], y:[-1.5, 3], abs:true, xlab:'x', ylab:'y', grid:1},
    given:[{from:[0, 0], to:[2, 0.5], lab:'\\vec a'}, {from:[0, 0], to:[0.5, 1.5], lab:'\\vec b'}],
    want:[{from:[0, 0], to:[2.5, 2], lab:'\\vec a + \\vec b', msg:'Setze $\\vec b$ an die Spitze von $\\vec a$. Wohin zeigt dann der Pfeil vom Ursprung zur neuen Spitze?'}],
    reveal:'$\\vec a + \\vec b = (2{,}5;\\ 2)$: Diagonale des von $\\vec a$ und $\\vec b$ aufgespannten Parallelogramms.',
    wrong:[
      {arrows:[{from:[0, 0], to:[1.5, -1]}], fails:[0], why:'Differenz a − b statt Summe'},
      {arrows:[{from:[0, 0], to:[-1.5, 1]}], fails:[0], why:'Differenz b − a statt Summe'},
      {arrows:[{from:[2, 0.5], to:[2.5, 2]}], fails:[0], why:'nur b an die Spitze von a gesetzt'}
    ] },
  { id:'smp-eigen', title:'Eigenvektoren einer symmetrischen Matrix', kind:'arrows',
    text:'Zeichne je einen Eigenvektor der Matrix $A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ zu jedem Eigenwert.',
    plot:{x:[-2, 2], y:[-2, 2], abs:true, xlab:'x', ylab:'y', grid:1},
    want:[{from:[0, 0], to:[1, 1], axis:true, len:false, lab:'\\vec v_3', msg:'Welcher Vektor wird von $A$ nur gestreckt? Probiere $A(1, 1)^T$.'},
          {from:[0, 0], to:[1, -1], axis:true, len:false, lab:'\\vec v_1', msg:'Welcher Vektor steht senkrecht auf dem ersten Eigenvektor?'}],
    reveal:'$(1, 1)^T$ zum Eigenwert 3 und $(1, -1)^T$ zum Eigenwert 1; sie stehen senkrecht aufeinander, weil $A$ symmetrisch ist.',
    wrong:[
      {arrows:[{from:[0, 0], to:[2, 1]}, {from:[0, 0], to:[1, 2]}], fails:[0, 1], why:'Spalten der Matrix als Eigenvektoren'},
      {arrows:[{from:[0, 0], to:[1.4, 0]}, {from:[0, 0], to:[0, 1.4]}], fails:[0, 1], why:'Koordinatenachsen als Eigenvektoren'}
    ] }
];

/* Physik-Gegenproben für den Test: Anschlussbedingungen und bekannte Werte */
const PHYS = {BAR, STEP, STEPL, WELL, WELL2, P20, hermite, scatter, cabs};
module.exports = {SAMPLES, PHYS};
