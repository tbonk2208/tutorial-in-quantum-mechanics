/* ===== Thema 2: Schrödingergleichung und stationäre Zustände ===== */
(function(){
const R = String.raw;
const BOX2 = (extra) => Object.assign({coords:['x', 't'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'},
  defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)'}}, extra || {});
const DYN = (extra) => Object.assign({coords:['x', 't'], params:{m:'pos'}, abstract:{Ψ:{args:['x', 't']}, V:{args:['x'], real:true}}, dyn:{fn:'Ψ'}}, extra || {});
/* Erklärteil sg-t4d: Schießverfahren im Tal V = x² (Einheiten 2m/ħ² = 1, also ψ'' = (x² − E)ψ, Eigenwerte E = 1, 3, 5, …).
   Start links bei x = −5 mit der abfallenden Lösung e^{−x²/2}, Runge-Kutta 4. Ordnung bis x = 3,5.
   Nachgerechnet (scipy): ψ(3) ≈ +3,45 für E = 0,9 und ψ(3) ≈ −2,33 für E = 1,1. */
const SG_SHOOT = (() => {
  const run = E => {
    const x0 = -5, x1 = 3.5, n = 1700, hh = (x1 - x0) / n, F = (x, y) => (x * x - E) * y;
    let y = Math.exp(-x0 * x0 / 2), d = -x0 * Math.exp(-x0 * x0 / 2); const ys = [y];
    for (let i = 0; i < n; i++){
      const x = x0 + i * hh;
      const k1y = d, k1d = F(x, y), k2y = d + hh / 2 * k1d, k2d = F(x + hh / 2, y + hh / 2 * k1y);
      const k3y = d + hh / 2 * k2d, k3d = F(x + hh / 2, y + hh / 2 * k2y), k4y = d + hh * k3d, k4d = F(x + hh, y + hh * k3y);
      y += hh / 6 * (k1y + 2 * k2y + 2 * k3y + k4y); d += hh / 6 * (k1d + 2 * k2d + 2 * k3d + k4d); ys.push(y);
    }
    return x => { const t = (x - x0) / hh, i = Math.max(0, Math.min(n - 1, Math.floor(t))), f = t - i; return ys[i] * (1 - f) + ys[i + 1] * f; };
  };
  return {lo:run(0.9), hi:run(1.1)};
})();
/* ---- Skizzenaufgaben (didaktik/SKIZZE.md): Musterfunktionen aus den exakten Lösungen, dimensionslos ---- */
const SK = (() => {
  const PI = Math.PI;
  /* sg-s1: Topf mit Stufe im Boden (ħ = m = 1, a = 1): V = 0 für −1 < x < 0, V = V1 = 60 für 0 < x < 1, V = V0 = 120 für |x| > 1.
     Gebundener Zustand: links e^{κ(x+1)}, innen cos/sin, rechts e^{−κ(x−1)}; ψ und ψ' stetig bei −1, 0, 1.
     Eigenwert aus der Bedingung ψ'(1) + κψ(1) = 0 per Bisektion: E ≈ 85,83 (kL ≈ 4,17π, kR ≈ 2,29π, kL/kR ≈ 1,82, κ ≈ 8,3). */
  const STW = (() => {
    const V1 = 60, V0 = 120;
    const sh = E => { const kL = Math.sqrt(2 * E), kR = Math.sqrt(2 * (E - V1)), ka = Math.sqrt(2 * (V0 - E));
      const p0 = Math.cos(kL) + ka / kL * Math.sin(kL), d0 = -kL * Math.sin(kL) + ka * Math.cos(kL);
      const p1 = p0 * Math.cos(kR) + d0 / kR * Math.sin(kR), d1 = -p0 * kR * Math.sin(kR) + d0 * Math.cos(kR);
      return {g:d1 + ka * p1, kL, kR, ka, p0, d0, p1}; };
    let lo = 85, hi = 86.5; const s0 = Math.sign(sh(lo).g);
    for (let i = 0; i < 100; i++){ const m = (lo + hi) / 2; if (Math.sign(sh(m).g) === s0) lo = m; else hi = m; }
    const E = (lo + hi) / 2, S = sh(E);
    const f = x => x < -1 ? Math.exp(S.ka * (x + 1)) : x < 0 ? Math.cos(S.kL * (x + 1)) + S.ka / S.kL * Math.sin(S.kL * (x + 1))
      : x < 1 ? S.p0 * Math.cos(S.kR * x) + S.d0 / S.kR * Math.sin(S.kR * x) : S.p1 * Math.exp(-S.ka * (x - 1));
    return {V1, V0, E, f, S, V:x => Math.abs(x) > 1 ? V0 : x < 0 ? 0 : V1};
  })();
  const s1 = {
    id:'sg-sk1', title:'Krümmungsregel: Topf mit Stufe im Boden', kind:'curve', draw:'psi',
    text:'Im Potential der Abbildung ist $V = 0$ für $-a < x < 0$, $V = V_1$ für $0 < x < a$ und $V = V_0$ außerhalb. Ein gebundener Zustand hat die eingezeichnete Energie $E$ mit $V_1 < E < V_0$. Skizziere $\\psi(x)$. Auf die genaue Zahl der Nullstellen kommt es nicht an, wohl aber darauf, wie $\\psi$ sich in den drei Arten von Bereichen verhält.',
    plot:{x:[-1.6, 1.6], xlab:'x', ylab:'\\psi(x)', ticks:[{x:-1, lab:'-a'}, {x:0, lab:'0'}, {x:1, lab:'a'}], V:STW.V, Vr:[0, 140], E:STW.E,
      regions:[{x:[-1.6, -1], lab:'E < V'}, {x:[1, 1.6], lab:'E < V'}]},
    f:STW.f,
    checks:[
      {id:'rechts', name:'Schwingung über der Stufe', type:'osc', range:[0, 1], min:1, msg:'Ist $E - V$ für $0 < x < a$ positiv oder negativ? Wohin krümmt sich $\\psi$ dann?'},
      {id:'lam', type:'wavelength', a:[-1, 0], b:[0, 1], cmp:'<', msg:'In welcher Hälfte des Topfs ist $E - V$ größer? Wo krümmt sich $\\psi$ also stärker zur Achse hin, und was heißt das für den Abstand der Nullstellen? (Abschnitt ‚Welche Lösungen sind zulässig?‘)'},
      {id:'aussenL', name:'links außen', type:'decay', toward:'left', range:[-1.6, -1], msg:'Links von $-a$ ist $E < V$. Wohin krümmt sich $\\psi$ dort, und was verlangt die Normierbarkeit für $x \\to -\\infty$?'},
      {id:'aussenR', name:'rechts außen', type:'decay', toward:'right', range:[1, 1.6], msg:'Rechts von $a$ ist $E < V$. Wohin krümmt sich $\\psi$ dort, und was verlangt die Normierbarkeit für $x \\to \\infty$?'}
    ],
    reveal:'Aus $\\psi\'\' = \\frac{2m}{\\hbar^2}(V - E)\\,\\psi$: Links im Topf ist $E - V$ am größten, $\\psi$ krümmt sich am stärksten zur Achse hin und schwingt mit der kürzesten Wellenlänge. Über der Stufe ist $E - V_1$ kleiner, die Wellenlänge also länger (hier etwa 1,8-mal). Außen ist $E < V_0$: $\\psi$ krümmt sich von der Achse weg und fällt exponentiell ab. Auf die Amplituden kommt es hier nicht an: Bei einer scharfen Stufe hängt ihr Verhältnis davon ab, an welcher Stelle der Schwingung $\\psi$ die Stufe erreicht. Hier trifft $\\psi$ die Stufe fast in einem Bauch, und beide Hälften schwingen fast gleich weit aus.',
    hints:['Lies für jeden Bereich das Vorzeichen von $V - E$ ab. Es legt fest, wohin sich $\\psi$ krümmt.', 'Im erlaubten Bereich gilt $\\psi\'\' = -k^2\\psi$ mit $k^2 = 2m(E - V)/\\hbar^2$: größeres $E - V$, stärkere Krümmung, kürzere Wellenlänge.'],
    wrong:[
      {f:x => Math.abs(x) > 1 ? Math.cos(4.17 * PI * (Math.sign(x) - 0.03)) * Math.exp(-8.3 * (Math.abs(x) - 1)) : Math.cos(4.17 * PI * (x - 0.03)), fails:['lam'], why:'Stufe im Boden übersehen: überall dieselbe Wellenlänge'},
      {f:x => Math.abs(x) > 1 ? Math.exp(-8 * (Math.abs(x) - 1)) * (x < 0 ? Math.cos(2.3 * PI * -1) : Math.cos(4.2 * PI * 1)) : x < 0 ? Math.cos(2.3 * PI * x) : Math.cos(4.2 * PI * x), fails:['lam'], why:'Wellenlänge über der Stufe kürzer („höheres V, mehr Energie“)'},
      {f:x => Math.abs(x) > 1 ? STW.f(Math.sign(x)) * Math.cos(9 * (Math.abs(x) - 1)) : STW.f(x), fails:['aussenL', 'aussenR'], why:'Schwingung im klassisch verbotenen Bereich'}
    ]
  };

  /* sg-lab: |Ψ(x, T/4)|² für Ψ = (ψ1 e^{−iE1t/ħ} + ψ2 e^{−iE2t/ħ})/√2, L = 1, ψn = √2 sin(nπx), T = 2πħ/(E2 − E1).
     |Ψ|² = ½(ψ1² + ψ2²) + ψ1ψ2 cos((E2 − E1)t/ħ); bei t = T/4 ist cos(π/2) = 0 → sin²πx + sin²2πx
     (gerade zu L/2, Maxima bei x ≈ 0,29 und 0,71 mit 1,56, in der Mitte 1,0). */
  const box2 = (s, t) => x => { const a = Math.sin(PI * x), b = Math.sin(2 * PI * x); return a * a + b * b + 2 * a * b * Math.cos(2 * PI * t) * s; };
  const lab = {
    id:'sg-sk-lab', title:'Überlagerung nach einer Viertelperiode', kind:'curve', draw:'abs2',
    text:'Im Labor ist $\\Psi(x,t) = \\frac{1}{\\sqrt2}\\left(\\psi_1e^{-iE_1t/\\hbar} + \\psi_2e^{-iE_2t/\\hbar}\\right)$ mit der Periode $T = 2\\pi\\hbar/(E_2 - E_1)$. Bei $t = 0$ liegt die Dichte links. Skizziere $|\\Psi(x,t)|^2$ zur Zeit $t = T/4$. Stell danach $|c_1|^2 = 0{,}5$ und $t = 0{,}25\\,T$ ein und vergleiche.',
    plot:{x:[-0.1, 1.1], dom:[0, 1], walls:[0, 1], xlab:'x', ylab:'|\\Psi(x, T/4)|^2', ticks:[{x:0, lab:'0'}, {x:0.25, lab:'L/4'}, {x:0.5, lab:'L/2'}, {x:0.75, lab:'3L/4'}, {x:1, lab:'L'}]},
    f:box2(1, 0.25),
    checks:[
      {id:'pos', type:'nonneg', msg:'Deine Kurve wird negativ (Minimum {got}). Kann $|\\Psi|^2$ negativ sein?'},
      {id:'rand', name:'Null an den Wänden', type:'zero', at:[0, 1], msg:'Welchen Wert hat $\\Psi$ an den Wänden, zu jeder Zeit?'},
      {id:'sym', name:'Symmetrie zur Mitte', type:'parity', p:'even', about:0.5, msg:'Wie groß ist der Mischterm $\\psi_1\\psi_2\\cos\\frac{(E_2 - E_1)t}{\\hbar}$ bei $t = T/4$? Was bedeutet das für die Symmetrie zur Mitte? Deine Skizze ist {got}.'},
      {id:'buckel', name:'Zahl der Maxima', type:'extrema', n:2, kind:'max', msg:'Welche Terme von $|\\Psi|^2$ bleiben bei $t = T/4$ übrig? Wo tragen sie jeweils am meisten bei, und wo nur einer von beiden? Deine Skizze hat {got} Maxima.'}
    ],
    reveal:'Bei $t = T/4$ ist $(E_2 - E_1)t/\\hbar = \\pi/2$, und der Mischterm $\\psi_1\\psi_2\\cos(\\pi/2)$ verschwindet. Übrig bleibt $\\tfrac12(\\psi_1^2 + \\psi_2^2)$: symmetrisch zur Mitte, also $\\langle x\\rangle = L/2$. Die Dichte ist auf dem Weg von links nach rechts, aber nicht als ein einzelner Buckel in der Mitte: Dort trägt nur $\\psi_1^2$ bei, bei $L/4$ und $3L/4$ beide. Bei $t = T/2$ liegt sie rechts, bei $t = T$ wieder links.',
    hints:['Setze $t = T/4$ in den Mischterm $\\psi_1\\psi_2\\cos\\frac{(E_2 - E_1)t}{\\hbar}$ ein.', 'Ist der Mischterm null, bleibt $\\tfrac12(\\psi_1^2 + \\psi_2^2)$. Skizziere $\\psi_1^2$ und $\\psi_2^2$ und addiere.'],
    wrong:[
      {f:box2(1, 0), fails:['sym'], why:'Dichte wie bei t = 0: Überlagerung für stationär gehalten'},
      {f:box2(1, 0.5), fails:['sym'], why:'schon ganz nach rechts geschwappt: T/4 mit T/2 verwechselt'}
    ]
  };
  /* sg-fA: Ψ(x,0) = (ψ1 + ψ3)/√2, bei t = T/2 mit T = 2πħ/(E3 − E1): |Ψ|² = ½(ψ1 − ψ3)² ∝ (sin πx − sin 3πx)² = 4 cos²(2πx) sin²(πx)
     Maximum 4 bei L/2, Nullstellen bei L/4 und 3L/4, Seitenbuckel 0,30 (7 % des Maximums) bei x ≈ 0,13 und 0,87.
     sg-fB: Ψ(x,0) = (ψ1 − ψ3)/√2, bei t = T/2: |Ψ|² ∝ (sin πx + sin 3πx)² = 4 sin²(2πx) cos²(πx): Null bei L/2, Maxima 2,37 bei x ≈ 0,195 und 0,805. */
  const box13 = s => x => (Math.sin(PI * x) + s * Math.sin(3 * PI * x)) ** 2;
  const fA = {
    id:'sg-sk-A', title:'Überlagerung von $\\psi_1$ und $\\psi_3$ nach einer halben Periode', kind:'curve', draw:'abs2', points:3,
    text:'Im Kasten $0 < x < L$ ist $\\Psi(x,0) = \\frac{1}{\\sqrt2}(\\psi_1 + \\psi_3)$ mit $\\psi_n = \\sqrt{2/L}\\,\\sin(n\\pi x/L)$ und $E_n = n^2E_1$. Skizziere $|\\Psi(x,t)|^2$ zur Zeit $t = T/2$ mit $T = 2\\pi\\hbar/(E_3 - E_1)$.',
    plot:{x:[-0.1, 1.1], dom:[0, 1], walls:[0, 1], xlab:'x', ylab:'|\\Psi(x, T/2)|^2', ticks:[{x:0, lab:'0'}, {x:0.25, lab:'L/4'}, {x:0.5, lab:'L/2'}, {x:0.75, lab:'3L/4'}, {x:1, lab:'L'}]},
    f:box13(-1),
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann $|\\Psi|^2$ negativ sein?'},
      {id:'rand', name:'Null an den Wänden', type:'zero', at:[0, 1], msg:'Welchen Wert hat $\\Psi$ an den Wänden?'},
      {id:'sym', name:'Symmetrie zur Mitte', type:'parity', p:'even', about:0.5, msg:'Sind $\\psi_1$ und $\\psi_3$ zur Mitte symmetrisch? Was folgt für $|\\Psi|^2$ zu jeder Zeit?'},
      {id:'mitte', name:'Lage des Maximums', type:'maxat', x:0.5, tol:0.06, msg:'Welches Vorzeichen hat der Mischterm bei $t = T/2$? Werte $\\psi_1$ und $\\psi_3$ bei $x = L/2$ aus.'},
      {id:'hoch', name:'Mitte und Ränder', type:'amp', a:[0.4, 0.6], b:[0.05, 0.3], cmp:'>', f:2.5, msg:'Vergleiche $|\\psi_1 - \\psi_3|$ in der Mitte und nahe den Wänden. Wo addieren sich die Beträge, wo heben sie sich teilweise auf?'}
    ],
    reveal:'Bei $t = T/2$ ist $(E_3 - E_1)t/\\hbar = \\pi$; der Mischterm wechselt das Vorzeichen, und es ist $|\\Psi|^2 = \\tfrac12(\\psi_1 - \\psi_3)^2$. In der Mitte ist $\\psi_1 = \\sqrt{2/L}$ und $\\psi_3 = -\\sqrt{2/L}$: Die Differenz ist dort am größten. Bei $L/4$ und $3L/4$ ist $\\psi_1 = \\psi_3$, also $|\\Psi|^2 = 0$. Bei $t = 0$ war es umgekehrt (Knoten in der Mitte). Die Dichte bleibt immer symmetrisch, sie „atmet“ zwischen den Wänden und der Mitte.',
    hints:['Bestimme das Vorzeichen von $\\cos\\frac{(E_3 - E_1)t}{\\hbar}$ bei $t = T/2$.', 'Dann ist $|\\Psi|^2 = \\tfrac12(\\psi_1 \\pm \\psi_3)^2$ mit einem bestimmten Vorzeichen. Werte die Klammer bei $L/4$ und $L/2$ aus.'],
    wrong:[
      {f:box13(1), fails:['mitte', 'hoch'], why:'Dichte wie bei t = 0: Überlagerung für stationär gehalten'},
      {f:x => Math.sin(PI * x) ** 2 + Math.sin(3 * PI * x) ** 2, fails:['hoch'], why:'Mischterm vergessen: Dichten addiert'}
    ]
  };
  const fB = {
    id:'sg-sk-B', title:'Überlagerung von $\\psi_1$ und $\\psi_3$ nach einer halben Periode', kind:'curve', draw:'abs2', points:3,
    text:'Im Kasten $0 < x < L$ ist $\\Psi(x,0) = \\frac{1}{\\sqrt2}(\\psi_1 - \\psi_3)$ mit $\\psi_n = \\sqrt{2/L}\\,\\sin(n\\pi x/L)$ und $E_n = n^2E_1$. Skizziere $|\\Psi(x,t)|^2$ zur Zeit $t = T/2$ mit $T = 2\\pi\\hbar/(E_3 - E_1)$.',
    plot:{x:[-0.1, 1.1], dom:[0, 1], walls:[0, 1], xlab:'x', ylab:'|\\Psi(x, T/2)|^2', ticks:[{x:0, lab:'0'}, {x:0.25, lab:'L/4'}, {x:0.5, lab:'L/2'}, {x:0.75, lab:'3L/4'}, {x:1, lab:'L'}]},
    f:box13(1),
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann $|\\Psi|^2$ negativ sein?'},
      {id:'rand', name:'Null an den Wänden', type:'zero', at:[0, 1], msg:'Welchen Wert hat $\\Psi$ an den Wänden?'},
      {id:'sym', name:'Symmetrie zur Mitte', type:'parity', p:'even', about:0.5, msg:'Sind $\\psi_1$ und $\\psi_3$ zur Mitte symmetrisch? Was folgt für $|\\Psi|^2$ zu jeder Zeit?'},
      {id:'mitte', name:'Wert in der Mitte', type:'zero', at:[0.5], tol:0.04, msg:'Welches Vorzeichen hat der Mischterm bei $t = T/2$? Werte $\\psi_1$ und $\\psi_3$ bei $x = L/2$ aus.'},
      {id:'buckel', name:'Zahl der Maxima', type:'extrema', n:2, kind:'max', msg:'Wie viele Maxima hat $|\\Psi|^2$ bei $t = T/2$? Deine Skizze hat {got}.'}
    ],
    reveal:'Bei $t = T/2$ ist $(E_3 - E_1)t/\\hbar = \\pi$; der Mischterm wechselt das Vorzeichen, und es ist $|\\Psi|^2 = \\tfrac12(\\psi_1 + \\psi_3)^2$. In der Mitte ist $\\psi_1 = \\sqrt{2/L}$ und $\\psi_3 = -\\sqrt{2/L}$: Die Summe ist dort null. Links und rechts davon addieren sich die beiden Anteile zu zwei Buckeln. Bei $t = 0$ war es umgekehrt (Maximum in der Mitte). Die Dichte bleibt immer symmetrisch, sie „atmet“ zwischen der Mitte und den Seiten.',
    hints:['Bestimme das Vorzeichen von $\\cos\\frac{(E_3 - E_1)t}{\\hbar}$ bei $t = T/2$.', 'Dann ist $|\\Psi|^2 = \\tfrac12(\\psi_1 \\pm \\psi_3)^2$ mit einem bestimmten Vorzeichen. Werte die Klammer bei $L/4$ und $L/2$ aus.'],
    wrong:[
      {f:box13(-1), fails:['mitte', 'buckel'], why:'Dichte wie bei t = 0: Überlagerung für stationär gehalten'},
      {f:x => Math.sin(PI * x) ** 2 + Math.sin(3 * PI * x) ** 2, fails:['mitte', 'buckel'], why:'Mischterm vergessen: Dichten addiert'}
    ]
  };
  return {s1, lab, fA, fB};
})();
topic({
  id:'sg', math:['m-komplex', 'm-dgl'], title:'Schrödingergleichung und stationäre Zustände', short:'Schrödingergleichung',
  src:'Griffiths & Schroeter Kap. 1 und 2.1 · Nolting 5/1 Kap. 2–3 · Schwabl Kap. 2',
  wozu:'Die Schrödingergleichung ist das Bewegungsgesetz der Quantenmechanik – die Rolle, die $F = ma$ in der Mechanik spielt. Aus ihrer stationären Form folgen die erlaubten Energien von Atomen, Molekülen und Halbleiter-Strukturen und damit Spektrallinien und Farben. Aus der Zeitentwicklung von Überlagerungen folgt, mit welchen Frequenzen ein Atom beim Übergang zwischen zwei Niveaus strahlt. Der Wahrscheinlichkeitsstrom ist das Werkzeug für Reflexion, Transmission und den Tunneleffekt.',
  bridge:'Aus Thema 1 kehren die Bornsche Deutung, die Normierung und ihre Erhaltung sowie der Impulsoperator $\\hat p = -i\\hbar\\,\\partial_x$ wieder. Neu sind die Begründung der Schrödingergleichung, stationäre Zustände, Überlagerungen und der Strom. Aus der Mathematik brauchst du $e^{-i\\omega t}$ (M1) und gewöhnliche Differentialgleichungen (M7).',
  goals:[
    'Ich kann mit dem Separationsansatz $\\Psi(x,t) = \\psi(x)e^{-iEt/\\hbar}$ von der zeitabhängigen zur stationären Schrödingergleichung kommen.',
    'Ich kann begründen, warum in stationären Zuständen $|\\Psi|^2$ zeitunabhängig ist, und die Periode einer Überlagerung angeben.',
    'Ich kann die Wahrscheinlichkeitsstromdichte $j$ berechnen und die Kontinuitätsgleichung herleiten.'
  ],
  needs:'Bornsche Deutung und Normierung (Thema 1) · Ableiten von $e^{-i\\omega t}$ · partielle Ableitungen',
  check:[
    {q:'Was muss für eine Wellenfunktion zu jeder Zeit gelten?', opts:['$\\int|\\Psi(x,t)|^2dx = 1$', '$\\Psi(0,t) = 1$', '$\\Psi$ ist reell'], a:0, ex:'Das Teilchen ist mit Sicherheit irgendwo: Normierung.', lex:'normierung', prev:'wf', seg:'wf-t4'},
    {q:'$\\frac{\\partial}{\\partial t}e^{-iEt/\\hbar}$ ist …', opts:['$-\\frac{iE}{\\hbar}e^{-iEt/\\hbar}$', '$\\frac{iE}{\\hbar}e^{-iEt/\\hbar}$', '$-\\frac{E}{\\hbar}e^{-iEt/\\hbar}$'], a:0, ex:'Kettenregel: Der Faktor vor $t$ im Exponenten kommt heraus.', lex:'euler', prev:'m-komplex'},
    {q:'$|\\psi(x)e^{-iEt/\\hbar}|^2$ ist gleich …', opts:['$|\\psi(x)|^2$', '$|\\psi(x)|^2e^{-2iEt/\\hbar}$', '$|\\psi(x)|^2\\cos^2(Et/\\hbar)$'], a:0, ex:'$|e^{-iEt/\\hbar}|^2 = 1$ für reelles $E$.', lex:'komplexe-zahlen', prev:'m-komplex'},
    {q:'Wie wirkt der Impulsoperator $\\hat p$ in Ortsdarstellung?', opts:['$\\hat p\\psi = -i\\hbar\\,\\psi\'$', '$\\hat p\\psi = i\\hbar\\,\\psi\'$', '$\\hat p\\psi = m\\,\\psi\'$'], a:0, ex:'$\\hat p = -i\\hbar\\,d/dx$ (Thema 1). Damit ist $\\hat p^2 = -\\hbar^2d^2/dx^2$ und $\\hat H = \\hat p^2/2m + V$.', lex:'impulsoperator', prev:'wf', seg:'wf-t6'}
  ],
  diag:[
    {q:'Wie beginnst du, um zu prüfen, ob $\\Psi(x,t) = \\psi(x)\\,e^{-iEt/\\hbar}$ mit einem gegebenen $\\psi$ ein stationärer Zustand ist?', opts:['Ich prüfe, ob $\\hat H\\psi = E\\psi$ mit konstantem $E$ gilt.', 'Ich prüfe, ob $\\psi$ auf 1 normiert ist.', 'Ich prüfe, ob $\\psi$ reell und stetig ist.', 'Das weiß ich noch nicht.'], a:0, ex:'Stationär heißt: $\\psi$ ist Eigenfunktion von $\\hat H$. Normierung und Realität sagen darüber nichts.'},
    {q:'Wie beginnst du, um $\\Psi(x,t)$ für $\\Psi(x,0) = c_1\\psi_1 + c_2\\psi_2$ anzugeben ($\\psi_n$ Eigenfunktionen von $\\hat H$)?', opts:['Jeder Summand bekommt seinen Faktor $e^{-iE_nt/\\hbar}$.', 'Ich hänge an die ganze Summe einen Faktor $e^{-iEt/\\hbar}$.', 'Ich setze $\\Psi(x,t) = \\Psi(x,0)$, weil $\\psi_n$ stationär sind.', 'Das weiß ich noch nicht.'], a:0, ex:'Die Gleichung ist linear, und jede Eigenfunktion entwickelt sich mit ihrer eigenen Energie. Ein gemeinsamer Faktor ist nur bei gleichen Energien richtig.'}
  ],
  phenomenon:{
    title:'Schwappt es oder nicht?',
    text:'Im Kasten sind $\\psi_1$ und $\\psi_2$ stationäre Zustände: Ihre Dichten hängen nicht von der Zeit ab. Nun präpariert man die Überlagerung $\\Psi(x,0) = \\frac{1}{\\sqrt2}(\\psi_1 + \\psi_2)$.\n\nWas passiert danach mit der Aufenthaltswahrscheinlichkeit $|\\Psi(x,t)|^2$?',
    q:{q:'Deine Vorhersage:', opts:['Sie bleibt konstant, weil beide Teile stationär sind.', 'Sie schwingt mit der Kreisfrequenz $(E_2 - E_1)/\\hbar$.', 'Sie schwingt mit der Kreisfrequenz $(E_1 + E_2)/\\hbar$.', 'Sie zerfließt langsam, bis sie gleichverteilt ist.'], a:1, ex:'Der Mischterm enthält $e^{-i(E_2-E_1)t/\\hbar}$.',
      fb:['Jeder Anteil für sich ist stationär. Entscheidend ist aber der Mischterm: Er hängt von der Phasendifferenz der beiden Anteile ab, und die ändert sich mit der Zeit.',
        'Richtig. Im Mischterm bleibt $e^{-i(E_2 - E_1)t/\\hbar}$ stehen; die Dichte schwappt mit der Periode $2\\pi\\hbar/(E_2 - E_1)$.',
        'Die Summe der Energien tritt nur in einem gemeinsamen Phasenfaktor auf, und der ist unbeobachtbar. Messbar ist die Differenz der Energien.',
        'Mit nur zwei Energien ist die Bewegung exakt periodisch: Nach einer Periode sieht die Dichte wieder genau so aus wie am Anfang.']},
    reveal:'Jeder Anteil bekommt seinen eigenen Phasenfaktor: $\\Psi(x,t) = \\frac{1}{\\sqrt2}\\left(\\psi_1e^{-iE_1t/\\hbar} + \\psi_2e^{-iE_2t/\\hbar}\\right)$. Beim Betragsquadrat fallen die Phasen in den Einzeltermen weg, im Mischterm aber nicht:\n\n$$|\\Psi|^2 = \\tfrac12\\left(\\psi_1^2 + \\psi_2^2\\right) + \\psi_1\\psi_2\\cos\\!\\left(\\frac{(E_2 - E_1)t}{\\hbar}\\right).$$\n\nDie Dichte schwappt mit der Periode $T = 2\\pi\\hbar/(E_2 - E_1)$ hin und her. Eine Überlagerung stationärer Zustände mit verschiedenen Energien ist selbst nicht stationär. Ein häufiger Irrtum lautet: „Jeder Zustand ist ein Energie-Eigenzustand.“ Dieses Thema zeigt, woher die Phasenfaktoren kommen und warum.'
  },
  teach:[
    /* ===== Abschnitt 1: Plausibilität der Schrödingergleichung ===== */
    {id:'sg-t1', title:'Woher kommt die Schrödingergleichung?', steps:[
      {id:'sg-t1a', title:'Drei Forderungen an die Gleichung',
        text:R`Die Schrödingergleichung lässt sich nicht aus der klassischen Physik herleiten. Sie ist ein Grundgesetz wie die Newtonschen Gleichungen; ob sie stimmt, entscheiden Experimente. Man kann sie aber plausibel machen. Drei Forderungen grenzen sie stark ein.

1. **Linear.** Mit zwei Lösungen $\Psi_1$ und $\Psi_2$ soll auch $\Psi_1 + \Psi_2$ eine Lösung sein. Sonst gäbe es keine Interferenz wie am Doppelspalt (Thema 1).
2. **Erste Ordnung in der Zeit.** $\Psi$ zur Zeit $t = 0$ soll den Zustand vollständig festlegen. Eine Gleichung zweiter Ordnung bräuchte zusätzlich $\partial_t\Psi(x,0)$.
3. **Richtige Physik für freie Teilchen.** Eine ebene Welle soll ein freies Teilchen beschreiben, mit $E = p^2/2m$.

**Schreibweise.** In diesem Thema heißt die zeitabhängige Wellenfunktion $\Psi(x,t)$, mit großem Psi; in Thema 1 hieß sie $\psi(x,t)$. Das kleine $\psi(x)$ brauchst du ab Abschnitt 2 für eine Funktion nur des Orts.`,
        q:{q:R`Warum soll die Gleichung nur die erste Zeitableitung enthalten?`,
          opts:[R`Damit Wellen mit fester Frequenz $\omega$ überhaupt Lösungen sind.`, R`Damit $\Psi$ zur Zeit $t = 0$ allein die ganze Zukunft festlegt.`, R`Damit die Gleichung für jedes Potential linear bleibt.`], a:1,
          ex:R`Bei einer Gleichung erster Ordnung in $t$ reicht der Anfangswert $\Psi(x,0)$. Bei zweiter Ordnung bräuchte man zusätzlich $\partial_t\Psi(x,0)$, und der Zustand wäre nicht allein durch $\Psi$ beschrieben.`,
          fb:[R`Auch die gewohnte Wellengleichung, die zweiter Ordnung ist, hat Lösungen mit fester Frequenz. Es geht um die Anfangswerte.`,
            '',
            R`Linearität und Ordnung sind zwei verschiedene Eigenschaften. Auch eine Gleichung zweiter Ordnung kann linear sein.`]}},
      {id:'sg-t1b', title:'Was die Ableitungen aus einer ebenen Welle holen',
        pre:{from:'m-komplex', seg:'mk-t4', title:'Ableiten von Exponentialfunktionen', text:R`Die Regel $\frac{d}{dx}e^{ax} = a\,e^{ax}$ gilt auch für komplexes $a$. Also ist $\partial_xe^{ikx} = ik\,e^{ikx}$ und $\partial_te^{-i\omega t} = -i\omega\,e^{-i\omega t}$. Mini-Beispiel: $\partial_t e^{-2it} = -2i\,e^{-2it}$.`},
        num:{title:R`Ein Elektron mit $\lambda = 0{,}5\,\mathrm{nm}$`, text:R`Die Wellenzahl ist $k = 2\pi/\lambda \approx 12{,}6\,\mathrm{nm}^{-1}$, der Impuls $p = \hbar k \approx 1{,}33\cdot10^{-24}\,\mathrm{kg\,m/s}$. Die kinetische Energie ist

$$E = \frac{p^2}{2m_e} \approx 6{,}0\,\mathrm{eV},$$

also gehört zur Welle die Kreisfrequenz $\omega = E/\hbar \approx 9{,}1\cdot10^{15}\,\mathrm{s}^{-1}$.`},
        text:R`Eine ebene Welle $\Psi = A\,e^{i(kx - \omega t)}$ beschreibt ein freies Teilchen mit dem Impuls $p = \hbar k$ ([[lex:de-broglie|de Broglie]]) und der Energie $E = \hbar\omega$ (Planck–Einstein). Welche Ableitung holt welche Größe heraus?

Die Herleitung zeigt es. $i\hbar\,\partial_t$ liefert den Faktor $\hbar\omega$, also die Energie. $-i\hbar\,\partial_x$ liefert $\hbar k$, also den Impuls; das ist der [[lex:impulsoperator|Impulsoperator]] aus Thema 1. In beiden Fällen kommt die Welle unverändert zurück, nur mit einer Zahl davor. Im Beispiel wäre das $6{,}0\,\mathrm{eV}$ bei der Zeitableitung und $1{,}33\cdot10^{-24}\,\mathrm{kg\,m/s}$ bei der Ortsableitung.`,
        derive:{ctx:{coords:['x', 't'], params:{A:'pos', k:'pos', m:'pos'}, defs:{'ω':'ħ k^2/(2m)', 'Ψ(x,t)':'A e^(i(k x - ω t))'}},
          lines:[
            {l:'iħ ∂Ψ/∂t = ħω Ψ', w:'Zeitableitung liefert −iω', why:{q:'Warum liefert $i\\hbar\\,\\partial_t$ gerade $\\hbar\\omega$?', opts:['$\\partial_t e^{-i\\omega t} = -i\\omega\\,e^{-i\\omega t}$ und $i\\cdot(-i) = 1$', '$\\partial_t e^{-i\\omega t} = i\\omega\\,e^{-i\\omega t}$ und $i\\cdot i = 1$', 'Weil $\\Psi$ normiert ist und $|e^{-i\\omega t}| = 1$'], a:0, ex:'$i\\hbar\\cdot(-i\\omega) = \\hbar\\omega$. Das Minuszeichen im Exponenten passt zum $+i$ vor der Zeitableitung.'}},
            {l:'-iħ ∂Ψ/∂x = ħk Ψ', w:'p = ħk', why:{q:'Welche physikalische Größe ist $\\hbar k$?', opts:['der Impuls nach de Broglie, $p = \\hbar k = h/\\lambda$', 'die Energie nach Planck, $E = \\hbar k$', 'die Geschwindigkeit $v = \\hbar k$ des Teilchens'], a:0, ex:'$k = 2\\pi/\\lambda$, also $\\hbar k = h/\\lambda = p$.'}}
          ]},
        q:{q:R`Was ergibt $i\hbar\,\partial_t$ angewandt auf $A\,e^{i(kx - \omega t)}$?`,
          opts:[R`$-\hbar\omega\,A\,e^{i(kx - \omega t)}$`, R`$\hbar\omega\,A\,e^{i(kx - \omega t)}$`, R`$i\hbar\omega\,A\,e^{i(kx - \omega t)}$`], a:1,
          ex:R`$\partial_t$ holt den Faktor $-i\omega$ heraus, und $i\hbar\cdot(-i\omega) = \hbar\omega$: die Energie.`,
          fb:[R`Das Vorzeichen stimmt nicht: $i\cdot(-i) = -i^2 = +1$.`,
            '',
            R`Das $i$ vor der Ableitung hebt das $-i$ aus dem Exponenten auf. Übrig bleibt eine reelle Energie.`]}},
      {id:'sg-t1c', title:'Aus E = p²/2m wird eine Gleichung',
        num:{title:'Dasselbe Elektron', text:R`Zweimal $-i\hbar\,\partial_x$ ergibt den Faktor $(\hbar k)^2$. Geteilt durch $2m_e$ ist das

$$\frac{(\hbar k)^2}{2m_e} \approx \frac{(1{,}33\cdot10^{-24}\,\mathrm{kg\,m/s})^2}{2\cdot9{,}11\cdot10^{-31}\,\mathrm{kg}} \approx 6{,}0\,\mathrm{eV},$$

genau der Faktor $\hbar\omega$, den $i\hbar\,\partial_t$ liefert. Beide Seiten stimmen überein.`},
        text:R`Schreibt man $E = p^2/2m$ mit den Ableitungen aus dem letzten Schritt, entsteht die freie Schrödingergleichung. Die Herleitung prüft, dass die ebene Welle sie löst, wenn $\omega = \hbar k^2/2m$ ist. Mit einer potentiellen Energie wird aus $E = p^2/2m + V(x)$ die allgemeine [[lex:schroedinger|Schrödingergleichung]]

$$i\hbar\frac{\partial\Psi}{\partial t} = \hat H\Psi,\qquad \hat H = -\frac{\hbar^2}{2m}\frac{\partial^2}{\partial x^2} + V(x).$$

$\hat H$, gelesen „H Dach“, heißt [[lex:hamilton|Hamilton-Operator]]; er steht für die Gesamtenergie. Die Bestätigung kommt aus den Folgerungen: Die Gleichung liefert die Spektren von Atomen, den Tunneleffekt und die Bänder in Festkörpern.`,
        derive:{ctx:{coords:['x', 't'], params:{A:'pos', k:'pos', m:'pos'}, defs:{'ω':'ħ k^2/(2m)', 'Ψ(x,t)':'A e^(i(k x - ω t))'}},
          lines:[
            {l:'-ħ^2/(2m) ∂^2Ψ/∂x^2 = (ħk)^2/(2m) Ψ', w:'zweimal abgeleitet: p²/2m', why:{q:R`Warum steht rechts $+(\hbar k)^2/2m$, obwohl $(ik)^2 = -k^2$ ist?`, opts:['Weil das Minus von $(ik)^2$ das Minus vor $\\hbar^2/2m$ aufhebt.', 'Weil man beim zweiten Ableiten das Vorzeichen weglassen darf.', 'Weil $k$ hier negativ gewählt ist.'], a:0, ex:R`$-\frac{\hbar^2}{2m}(ik)^2 = -\frac{\hbar^2}{2m}(-k^2) = +\frac{\hbar^2k^2}{2m}$: die kinetische Energie ist positiv.`}},
            {l:'iħ ∂Ψ/∂t = -ħ^2/(2m) ∂^2Ψ/∂x^2', w:'E = p²/2m mit E = ħω', why:{q:'Warum folgt aus den Faktoren $\\hbar\\omega$ (Zeitableitung) und $(\\hbar k)^2/2m$ (Ortsableitung) diese Gleichung?', opts:['Weil hier $\\omega = \\hbar k^2/2m$ ist, also $\\hbar\\omega = (\\hbar k)^2/2m$: $E = p^2/2m$.', 'Weil Zeit- und Ortsableitung immer gleich sind', 'Weil $\\omega = k$ für jede ebene Welle gilt'], a:0, ex:'Die Gleichung ist genau so gebaut, dass für eine ebene Welle die klassische Beziehung $E = p^2/2m$ herauskommt.'}}
          ]},
        q:{q:R`Welche Beziehung steckt in der freien Schrödingergleichung, wenn man eine ebene Welle einsetzt?`,
          opts:[R`$E = pc$ mit $E = \hbar\omega$ und $p = \hbar k$`, R`$E = p^2/2m$ mit $E = \hbar k$ und $p = \hbar\omega$`, R`$E = p^2/2m$ mit $E = \hbar\omega$ und $p = \hbar k$`], a:2,
          ex:R`Die Dispersionsrelation $\omega = \hbar k^2/2m$ ist die klassische kinetische Energie, übersetzt mit Planck–Einstein und de Broglie.`,
          fb:[R`$E = pc$ gilt für Licht. Dazu gehört die gewohnte Wellengleichung, nicht die Schrödingergleichung.`,
            R`Die Zuordnung ist vertauscht: Die Frequenz gehört zur Energie, die Wellenzahl zum Impuls.`,
            '']}},
      {id:'sg-t1d', title:'Die Schrödingergleichung, gelesen',
        num:{title:'Zwei Wellen, eine Summe', text:R`Die Wellen $e^{i(kx - \omega t)}$ und $e^{i(-kx - \omega t)}$ lösen beide die freie Gleichung, mit demselben $\omega = \hbar k^2/2m$. Ihre Summe ist

$$e^{-i\omega t}\left(e^{ikx} + e^{-ikx}\right) = 2\cos(kx)\,e^{-i\omega t},$$

eine stehende Welle. Weil die Gleichung linear ist, löst sie auch diese Summe.`},
        text:R`Eine Gleichung kann man auf mehrere Arten lesen. Die Tafel zeigt vier. Physikalisch ist sie eine Energiebilanz: Energie gleich kinetische plus potentielle Energie, jede Größe ersetzt durch eine Ableitung. In Worten sagt sie: Wie schnell sich $\Psi$ an einer Stelle ändert, hängt davon ab, wie stark $\Psi$ dort gekrümmt ist und wie hoch das Potential ist.

Mathematisch ist sie eine lineare partielle Differentialgleichung, erster Ordnung in $t$ und zweiter in $x$ (M7). Linear heißt: Summen von Lösungen sind wieder Lösungen, wie die stehende Welle im Beispiel.`,
        reps:{obj:'Die Schrödingergleichung in vier Lesarten',
          rows:[
            {k:'physik', tex:R`E = \frac{p^2}{2m} + V(x)`},
            {k:'formel', tex:R`i\hbar\frac{\partial\Psi}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\Psi}{\partial x^2} + V(x)\,\Psi`},
            {k:'worte', text:R`Die zeitliche Änderung von $\Psi$ an einer Stelle hängt von der Krümmung von $\Psi$ dort und von der Höhe des Potentials ab.`},
            {k:'mathe', text:R`Lineare partielle Differentialgleichung, erster Ordnung in $t$, zweiter Ordnung in $x$ (M7). Mit $\Psi_1$ und $\Psi_2$ ist auch $c_1\Psi_1 + c_2\Psi_2$ eine Lösung.`}
          ],
          links:[
            {from:'physik', to:'formel', rule:R`$E$ durch $i\hbar\,\partial_t$ ersetzen, $p$ durch $-i\hbar\,\partial_x$, $V(x)$ stehen lassen und alles auf $\Psi$ wirken lassen.`},
            {from:'formel', to:'worte', rule:R`Links die zeitliche Änderung lesen, rechts erst die Krümmung $\partial_x^2\Psi$ und dann das Potential mal $\Psi$.`},
            {from:'worte', to:'mathe', rule:R`Zählen, wie oft nach $t$ und nach $x$ abgeleitet wird, und prüfen, ob $\Psi$ nur linear vorkommt.`}
          ]},
        q:{q:R`Ein Teilchen im Schwerefeld hat $E = p^2/2m + mgx$. Wie lautet seine Schrödingergleichung?`, tr:{from:'physik', to:'formel'},
          opts:[R`$i\hbar\,\partial_t\Psi = -\frac{\hbar^2}{2m}\partial_x^2\Psi + mgx$`, R`$i\hbar\,\partial_t\Psi = -\frac{\hbar^2}{2m}\partial_x^2\Psi + mgx\,\Psi$`, R`$i\hbar\,\partial_t\Psi = \frac{\hbar^2}{2m}\partial_x^2\Psi + mgx\,\Psi$`], a:1,
          ex:R`Jeder Energieterm wird zu einem Operator, der auf $\Psi$ wirkt: $p^2/2m \to -\frac{\hbar^2}{2m}\partial_x^2$, und $V = mgx$ multipliziert $\Psi$.`,
          fb:[R`Auch das Potential muss mit $\Psi$ multipliziert werden. Sonst wäre die Gleichung nicht linear in $\Psi$.`,
            '',
            R`Das Vorzeichen stimmt nicht: $(-i\hbar\,\partial_x)^2 = -\hbar^2\partial_x^2$.`]}},
      {id:'sg-t1e', title:'Typischer Fehler: die gewohnte Wellengleichung',
        num:{title:'Falsche Energie', text:R`Die Wellengleichung $\partial_t^2u = c^2\partial_x^2u$ verlangt $\omega = ck$, also $E = \hbar ck = pc$. Für das Elektron mit $\lambda = 0{,}5\,\mathrm{nm}$ gäbe das

$$E = \hbar ck \approx 2{,}5\,\mathrm{keV}$$

statt der richtigen $6{,}0\,\mathrm{eV}$. Bei Teilchen mit Masse ist $\omega \propto k^2$, nicht $\omega \propto k$.`},
        text:R`Warum nicht die gewohnte Wellengleichung? Sie ergibt $\omega = ck$, also $E = pc$. Das stimmt für Licht, nicht für Teilchen mit Masse. Außerdem ist sie zweiter Ordnung in der Zeit.

Warum das $i$? Ohne $i$ hätte man $\partial_t\Psi = D\,\partial_x^2\Psi$, die Wärmeleitungsgleichung. Ihre Lösungen zerfließen, $\int|\Psi|^2dx$ nimmt ab, und statt $e^{i(kx - \omega t)}$ gibt es nur abklingende Lösungen $e^{ikx}e^{-Dk^2t}$. Mit dem $i$ bleibt die Normierung erhalten (Thema 1), und Wellen mit fester Frequenz sind Lösungen. Deshalb ist $\Psi$ zwangsläufig komplex.`,
        q:{q:R`Was ginge verloren, wenn man das $i$ aus der Schrödingergleichung striche?`,
          opts:[R`die Linearität der Gleichung`, R`die Erhaltung der Normierung`, R`die Abhängigkeit vom Potential $V$`], a:1,
          ex:R`Ohne $i$ entsteht eine Gleichung wie die Wärmeleitung. Ihre Lösungen klingen ab, und $\int|\Psi|^2dx$ nimmt mit der Zeit ab.`,
          fb:[R`Auch die Wärmeleitungsgleichung ist linear. Das $i$ entscheidet über etwas anderes.`,
            '',
            R`Das Potential bliebe in der Gleichung stehen. Verloren ginge, dass die Gesamtwahrscheinlichkeit $1$ bleibt.`]}}
    ]},

    /* ===== Abschnitt 2: Separation, Zeitfaktor, Eigenwertgleichung ===== */
    {id:'sg-t2', title:'Separation: die stationäre Schrödingergleichung', steps:[
      {id:'sg-t2a', title:'Der Produktansatz',
        pre:{from:'m-dgl', seg:'md-t5', title:'Separationsansatz', text:R`Hängt die gesuchte Funktion von zwei Variablen ab, versucht man ein Produkt: $\Psi(x,t) = \varphi(x)\,f(t)$. Dann wird $\partial_t\Psi = \varphi\,f'$ und $\partial_x^2\Psi = \varphi''f$. Nach dem Teilen durch $\varphi f$ steht links nur $t$, rechts nur $x$.`},
        num:{title:'Ein Produkt im Kasten', text:R`Für $\Psi(x,t) = \sin(\pi x/L)\,e^{-i\omega t}$ ist

$$\partial_t\Psi = -i\omega\,\Psi,\qquad \partial_x^2\Psi = -\left(\frac{\pi}{L}\right)^2\Psi.$$

Beide Ableitungen geben $\Psi$ mal eine Zahl zurück. Teilst du durch $\Psi$, bleiben nur Konstanten: $-i\omega$ und $-(\pi/L)^2$.`},
        text:R`Hängt $V$ nicht von der Zeit ab, gibt es besonders einfache Lösungen. Man macht den [[lex:separation|Separationsansatz]] $\Psi(x,t) = \psi(x)\,f(t)$ und setzt ein:

$$i\hbar\,\psi\,\frac{df}{dt} = f\left(-\frac{\hbar^2}{2m}\psi'' + V\psi\right).$$

Teilen durch $\psi f$ ergibt

$$i\hbar\,\frac{1}{f}\frac{df}{dt} = \frac{1}{\psi}\left(-\frac{\hbar^2}{2m}\psi'' + V\psi\right).$$

Links steht jetzt nur noch $t$, rechts nur noch $x$: Die Variablen sind getrennt. Wie in Abschnitt 1 angekündigt, ist $\Psi(x,t)$ die zeitabhängige Wellenfunktion und $\psi(x)$ eine Funktion nur des Orts.`,
        q:{q:R`Warum verlangt der Ansatz ein Potential $V$, das nicht von der Zeit abhängt?`,
          opts:[R`Sonst hinge auch die rechte Seite von $t$ ab.`, R`Sonst wäre die Gleichung nicht mehr linear in $\Psi$.`, R`Sonst bliebe die Normierung nicht erhalten.`], a:0,
          ex:R`Mit $V(x,t)$ hinge $\frac1\psi\left(-\frac{\hbar^2}{2m}\psi'' + V\psi\right)$ auch von $t$ ab. Dann stünde nicht mehr links nur $t$ und rechts nur $x$, und die Trennung der Variablen misslingt.`,
          fb:['',
            R`Auch mit $V(x,t)$ kommt $\Psi$ nur linear vor. Das Problem ist die Trennung: Rechts stünde dann auch $t$.`,
            R`Ein reelles $V(x,t)$ erhält die Normierung ebenfalls (Thema 1). Das Problem ist die Trennung der Variablen.`]}},
      {id:'sg-t2b', title:'Beide Seiten sind dieselbe Konstante',
        num:{title:'Zwei Funktionen, die immer gleich sind', text:R`Angenommen, $g(t) = h(x)$ für alle $x$ und $t$. Halte $x = 1$ fest: Dann ist $g(t) = h(1)$ für jedes $t$, also ist $g$ konstant. Mit $g(t) = 3$ muss auch $h(x) = 3$ für jedes $x$ sein. Im Beispiel des letzten Schritts ist die Konstante $i\hbar\cdot(-i\omega) = \hbar\omega$.`},
        text:R`Links steht nur $t$, rechts nur $x$. Hält man $x$ fest und ändert $t$, bleibt die rechte Seite gleich; also darf sich auch die linke nicht ändern. Beide Seiten sind dieselbe Konstante. Man nennt sie $E$. Es bleiben zwei gewöhnliche Differentialgleichungen:

$$i\hbar\frac{df}{dt} = E\,f,\qquad -\frac{\hbar^2}{2m}\psi'' + V\psi = E\psi.$$

Aus einer partiellen Gleichung in zwei Variablen sind zwei Gleichungen in je einer Variablen geworden. Die erste regelt die Zeit, die zweite den Ort. Die Konstante $E$ verbindet beide. Dass sie die Energie ist, zeigt Abschnitt 3.`,
        q:{q:R`Warum müssen beide Seiten der separierten Gleichung konstant sein?`,
          opts:['Weil die Energie eines abgeschlossenen Systems immer erhalten ist.', 'Weil links nur $t$, rechts nur $x$ vorkommt und beide für alle $x$, $t$ gleich sind.', 'Weil $\\psi$ normiert ist und $f$ den Betrag 1 hat.'], a:1,
          ex:R`Eine Funktion nur von $t$, die für alle $t$ gleich einer Funktion nur von $x$ ist, kann sich weder mit $t$ noch mit $x$ ändern.`,
          fb:[R`Die Energieerhaltung ist hier nicht das Argument. Es geht allein um die Trennung der Variablen.`,
            '',
            R`Die Normierung legt nur einen Vorfaktor fest. Das Argument ist die Trennung der Variablen.`]}},
      {id:'sg-t2c', title:'Der Zeitfaktor',
        pre:{from:'m-komplex', seg:'mk-t2', title:'Euler-Formel und Betrag', text:R`$e^{i\varphi} = \cos\varphi + i\sin\varphi$ liegt auf dem Einheitskreis: $|e^{i\varphi}| = 1$ für jedes reelle $\varphi$. Nach $\varphi = 2\pi$ ist der Punkt wieder am Anfang. Mini-Beispiel: $e^{-i\pi/2} = -i$.`},
        num:{title:R`Grundzustand eines $1\,\mathrm{nm}$-Kastens`, text:R`Mit $E = 0{,}376\,\mathrm{eV}$ dreht sich der Zeitfaktor mit $\omega = E/\hbar \approx 5{,}7\cdot10^{14}\,\mathrm{s}^{-1}$. Einmal ganz herum ist er nach

$$T = \frac{2\pi\hbar}{E} = \frac{h}{E} \approx 11\,\mathrm{fs}.$$

Nach $T/4$ ist $e^{-iET/(4\hbar)} = e^{-i\pi/2} = -i$, nach $T/2$ ist er $-1$.`},
        text:R`Die Zeitgleichung $i\hbar f' = Ef$ hat die Lösung $f(t) = f(0)\,e^{-iEt/\hbar}$, wie die Herleitung zeigt. Die Konstante $f(0)$ steckt man in $\psi$. Der Zeitfaktor $e^{-iEt/\hbar}$ ist eine reine Phase, die sich mit der Kreisfrequenz $E/\hbar$ dreht.

$E$ muss reell sein. Mit $E = E_0 + i\Gamma$ wäre $|f|^2 = e^{2\Gamma t/\hbar}$, und die Normierung bliebe nicht erhalten. Für reelles $E$ ist dagegen $|f(t)|^2 = |f(0)|^2$ zu jeder Zeit.`,
        derive:{ctx:{coords:['t'], params:{E:'real', C:'complex'}, defs:{'f(t)':'C e^(-i E t/ħ)'}},
          lines:[
            {l:'iħ df/dt = E f(t)', w:'Zeitteil der Separation'},
            {l:'df/dt = -iE/ħ f(t)', w:'durch iħ geteilt', why:{q:'Woher kommt das Minuszeichen?', opts:['$1/i = -i$', '$i^2 = 1$', 'aus der Normierung von $f$'], a:0, ex:'$\\frac{E}{i\\hbar} = -\\frac{iE}{\\hbar}$, weil $\\frac1i = \\frac{i}{i^2} = -i$.'}},
            {l:'f(t) = f(0) e^(-iEt/ħ)', w:'Lösung von f′ = c f', why:{q:'Warum ist das die Lösung?', opts:['Weil $f\' = cf$ die Lösung $f(0)e^{ct}$ hat, hier mit $c = -iE/\\hbar$.', 'Weil jede Funktion von $t$ eine Exponentialfunktion ist.', 'Weil $f$ periodisch sein muss und $\\sin$ zu reell ist.'], a:0, ex:'Lineare Differentialgleichung erster Ordnung mit konstantem Koeffizienten (M7).'}},
            {l:'|f(t)|^2 = |f(0)|^2', w:'E reell', why:{q:'Wann hängt $|f(t)|^2$ nicht von $t$ ab?', opts:['wenn $E$ reell ist, denn dann ist $|e^{-iEt/\\hbar}| = 1$', 'wenn $f(0) = 1$ ist, denn dann ist $|f(0)|^2 = 1$', 'immer, denn $e^{-iEt/\\hbar}$ ist stets eine reine Phase'], a:0, ex:'Für $E = E_0 + i\\Gamma$ wäre $|e^{-iEt/\\hbar}|^2 = e^{2\\Gamma t/\\hbar}$.'}}
          ]},
        q:{q:R`Nach welcher Zeit hat sich der Zeitfaktor $e^{-iEt/\hbar}$ einmal ganz gedreht?`,
          opts:[R`nach $\hbar/E$`, R`nach $E/h$`, R`nach $h/E$`], a:2,
          ex:R`Einmal herum heißt $Et/\hbar = 2\pi$, also $t = 2\pi\hbar/E = h/E$. Im Beispiel sind das $11\,\mathrm{fs}$.`,
          fb:[R`Nach $\hbar/E$ ist die Phase erst $1$ Radiant, nicht $2\pi$.`,
            R`$E/h$ ist eine Frequenz, keine Zeit. Die Periode ist ihr Kehrwert.`,
            '']}},
      {id:'sg-t2d', title:'Die stationäre Gleichung ist eine Eigenwertgleichung',
        pre:{from:'m-eigen', seg:'me-t3', title:'Eigenwerte und Eigenvektoren', text:R`Eine Matrix dreht und streckt die meisten Vektoren. Manche Richtungen werden nur gestreckt: $Av = \lambda v$ mit $v \ne 0$. Dann ist $v$ ein Eigenvektor und $\lambda$ sein Eigenwert. Mini-Beispiel: $\begin{pmatrix}2 & 0\\ 0 & 3\end{pmatrix}\begin{pmatrix}1\\ 0\end{pmatrix} = 2\begin{pmatrix}1\\ 0\end{pmatrix}$.`},
        num:{title:'Eine Sinusfunktion im Kasten', text:R`Im Kasten ist innen $V = 0$. Für $\psi = \sin(2\pi x/L)$ ist $\psi'' = -(2\pi/L)^2\psi$, also

$$\hat H\psi = -\frac{\hbar^2}{2m}\psi'' = \frac{4\pi^2\hbar^2}{2mL^2}\,\psi.$$

$\hat H$ gibt $\psi$ mal einer Zahl zurück. Für $L = 1\,\mathrm{nm}$ und ein Elektron ist diese Zahl $1{,}50\,\mathrm{eV}$.`},
        text:R`Die Ortsgleichung ist die **stationäre Schrödingergleichung** $\hat H\psi = E\psi$. Sie ist eine Eigenwertgleichung ([[lex:eigenwertproblem|Eigenwerte und Eigenvektoren]]). Gesucht sind Funktionen, die $\hat H$ bis auf einen Zahlenfaktor unverändert lässt, und diese Faktoren $E$.

Die Tafel übersetzt zwischen Matrix und Operator. Die Funktion $\psi$ spielt die Rolle des Vektors, der Operator $\hat H$ die der Matrix, die Energie $E$ die des Eigenwerts. Nicht jedes $E$ ist erlaubt. Bei gebundenen Teilchen hat $\hat H\psi = E\psi$ nur für bestimmte $E$ normierbare Lösungen, die die Randbedingungen erfüllen. Das ist die Quantisierung; Thema 3 rechnet sie im Kasten vor.`,
        reps:{obj:'Die stationäre Schrödingergleichung',
          rows:[
            {k:'worte', text:R`$\hat H$ ändert $\psi$ nur um einen Zahlenfaktor; dieser Faktor ist die Energie.`},
            {k:'formel', tex:R`\hat H\psi = E\psi\quad\Longleftrightarrow\quad -\frac{\hbar^2}{2m}\psi''(x) + V(x)\,\psi(x) = E\,\psi(x)`},
            {k:'mathe', text:R`$Av = \lambda v$ (M4): Die Matrix $A$ streckt den Eigenvektor $v$ nur um den Eigenwert $\lambda$.`},
            {k:'physik', text:R`Die Eigenwerte $E$ sind die möglichen Energien. Bei gebundenen Teilchen sind es nur einzelne Werte, zum Beispiel im Kasten $E_2 = 1{,}50\,\mathrm{eV}$ für $L = 1\,\mathrm{nm}$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Nur ein Zahlenfaktor“ heißt: Rechts steht dieselbe Funktion $\psi$, mit einer Konstanten $E$ multipliziert.`},
            {from:'formel', to:'mathe', rule:R`Die Funktion $\psi$ als Vektor lesen, den Operator $\hat H$ als Matrix, die Zahl $E$ als Eigenwert $\lambda$.`},
            {from:'mathe', to:'physik', rule:R`Jeden Eigenwert als mögliche Energie lesen, den zugehörigen Eigenvektor als Zustand mit dieser Energie.`}
          ]},
        q:{q:R`In M4 ist $Av = \lambda v$. Was entspricht in $\hat H\psi = E\psi$ dem Eigenvektor $v$?`, tr:{from:'mathe', to:'formel'},
          opts:[R`die Energie $E$`, R`die Funktion $\psi(x)$`, R`der Operator $\hat H$`, R`der Zeitfaktor $e^{-iEt/\hbar}$`], a:1,
          ex:R`$\hat H$ wirkt auf $\psi$ wie $A$ auf $v$. $\psi$ ist also der „Vektor“, $E$ der Eigenwert.`,
          fb:[R`$E$ ist eine Zahl. Sie entspricht dem Eigenwert $\lambda$, nicht dem Vektor.`,
            '',
            R`$\hat H$ wirkt auf etwas, wie die Matrix $A$. Er entspricht $A$, nicht $v$.`,
            R`Der Zeitfaktor kommt in der Ortsgleichung gar nicht vor. Er gehört zur Zeitgleichung.`]}},
      {id:'sg-t2e', title:'Typischer Fehler: Ĥψ = Eψ gilt für jeden Zustand',
        num:{title:'Eine Summe zweier Sinusfunktionen', text:R`Im Kasten ist $\hat H\sin(\pi x/L) = E_1\sin(\pi x/L)$ und $\hat H\sin(2\pi x/L) = 4E_1\sin(2\pi x/L)$. Für die Summe $\psi = \sin(\pi x/L) + \sin(2\pi x/L)$ folgt

$$\hat H\psi = E_1\sin\frac{\pi x}{L} + 4E_1\sin\frac{2\pi x}{L}.$$

Das ist kein Vielfaches von $\psi$. Es gibt kein $E$ mit $\hat H\psi = E\psi$.`},
        text:R`$\hat H\psi = E\psi$ ist keine Gleichung, die jeder Zustand erfüllt. Sie wählt besondere Funktionen aus, die Energie-Eigenfunktionen. Die zeitabhängige Gleichung $i\hbar\,\partial_t\Psi = \hat H\Psi$ gilt dagegen für jeden Zustand.

Daraus folgt eine Regel für den Zeitfaktor. $e^{-iEt/\hbar}$ darfst du nur an eine Eigenfunktion hängen, mit ihrem eigenen $E$. Die Summe im Beispiel ist ein erlaubter Zustand. Aber $\psi(x)\,e^{-iEt/\hbar}$ ist für kein $E$ eine Lösung. Wie sich ein solcher Zustand entwickelt, zeigt Abschnitt 5.`,
        q:{q:'Im Kasten ist $\\hat H\\sin(n\\pi x/L) = n^2E_1\\sin(n\\pi x/L)$. Für welches Paar ist $\\psi(x)\\,e^{-iEt/\\hbar}$ eine Lösung der zeitabhängigen Gleichung?',
          opts:['$\\psi = \\sin(\\pi x/L) + \\sin(3\\pi x/L)$ mit $E = 5E_1$', '$\\psi = \\sin(3\\pi x/L)$ mit $E = 3E_1$', '$\\psi = 2\\sin(3\\pi x/L)$ mit $E = 9E_1$'], a:2,
          ex:'$\\hat H\\big(2\\sin(3\\pi x/L)\\big) = 9E_1\\cdot 2\\sin(3\\pi x/L)$: eine Eigenfunktion, mit ihrem eigenen $E = 9E_1$. Der Faktor 2 ändert daran nichts.',
          fb:['Die Summe ist keine Eigenfunktion: $\\hat H\\psi = E_1\\sin(\\pi x/L) + 9E_1\\sin(3\\pi x/L)$ ist kein Vielfaches von $\\psi$. Ein Mittelwert der Energien hilft nicht.', 'Der Eigenwert ist $n^2E_1 = 9E_1$, nicht $3E_1$. Mit einem falschen $E$ ist das Produkt keine Lösung.', '']}}
    ]},

    /* ===== Abschnitt 3: Stationäre Zustände, Zeigerbild ===== */
    {id:'sg-t3', title:'Stationäre Zustände', steps:[
      {id:'sg-t3a', title:'Die Dichte steht still',
        num:{title:R`$\psi_2$ an einer Stelle`, text:R`Die Sinusfunktionen aus Abschnitt 2 heißen normiert $\psi_n = \sqrt{2/L}\,\sin(n\pi x/L)$, mit $\hat H\psi_n = E_n\psi_n$ und $E_n = n^2E_1$; Thema 3 leitet sie her. Mit $L = 1$ ist bei $x = L/4$ der Wert $\psi_2(L/4) = \sqrt2\sin(\pi/2) = \sqrt2$. Also ist $\Psi(L/4, t) = \sqrt2\,e^{-iE_2t/\hbar}$, und

$$|\Psi(L/4, t)|^2 = \sqrt2\,e^{+iE_2t/\hbar}\cdot\sqrt2\,e^{-iE_2t/\hbar} = 2$$

zu jeder Zeit. Der Wert von $\Psi$ dreht sich, sein Betragsquadrat nicht.`},
        text:R`Eine Lösung $\Psi(x,t) = \psi(x)\,e^{-iEt/\hbar}$ mit $\hat H\psi = E\psi$ heißt [[lex:stationaer|stationärer Zustand]]. Was an ihr ist zeitunabhängig?

Zuerst die Dichte. Die Herleitung zeigt: Beim Betragsquadrat treffen $e^{+iEt/\hbar}$ aus $\Psi^*$ und $e^{-iEt/\hbar}$ aus $\Psi$ zusammen und ergeben $1$. Also ist $|\Psi(x,t)|^2 = |\psi(x)|^2$ an jeder Stelle und zu jeder Zeit. Wo man das Teilchen findet, ändert sich nicht. Das Beispiel zeigt es an einer Stelle mit Zahlen.`,
        derive:{ctx:{coords:['x', 't'], params:{E:'real', m:'pos'}, abstract:{ψ:{args:['x']}}, defs:{'Ψ(x,t)':'ψ(x) e^(-i E t/ħ)'}},
          lines:[
            {l:'|Ψ(x,t)|^2 = ψ(x)^* e^(iEt/ħ) ψ(x) e^(-iEt/ħ)', w:'Ψ* = ψ* e^(+iEt/ħ)', why:{q:'Warum steht bei $\\Psi^*$ der Exponent $+iEt/\\hbar$?', opts:['Konjugieren macht aus $i$ ein $-i$; $E$ und $t$ sind reell.', 'Weil $\\Psi^*$ rückwärts in der Zeit läuft, $t \\to -t$.', 'Das ist eine Konvention ohne Bedeutung für $|\\Psi|^2$.'], a:0, ex:'$(e^{-iEt/\\hbar})^* = e^{+iEt/\\hbar}$ für reelles $E$.'}},
            {l:'= |ψ(x)|^2', w:'Phasen heben sich weg'}
          ]},
        q:{q:R`$\Psi(x,t) = \psi_1(x)\,e^{-iE_1t/\hbar}$. Wie hängt $|\Psi(x,t)|^2$ von der Zeit ab?`,
          opts:[R`wie $\cos^2(E_1t/\hbar)$`, R`gar nicht`, R`wie $e^{-2iE_1t/\hbar}$`], a:1,
          ex:R`$|e^{-iE_1t/\hbar}|^2 = 1$. Es bleibt $|\psi_1(x)|^2$.`,
          fb:[R`$\cos^2$ entstünde, wenn man nur den Realteil quadrierte. Das Betragsquadrat enthält auch den Imaginärteil, und $\cos^2 + \sin^2 = 1$.`,
            '',
            R`Das wäre $\Psi^2$ statt $\Psi^*\Psi$. Beim Betragsquadrat heben sich die Phasen auf.`]}},
      {id:'sg-t3b', title:'Ein Zeiger, der sich dreht',
        num:{title:'Vier Zeitpunkte', text:R`An einer Stelle mit $\psi(x_0) = 1$ ist $\Psi(x_0, t) = e^{-iEt/\hbar}$. Mit $T = h/E$:

$$t = 0:\ 1,\qquad t = \tfrac T4:\ -i,\qquad t = \tfrac T2:\ -1,\qquad t = \tfrac{3T}{4}:\ i.$$

Der Zeiger läuft im Uhrzeigersinn um den Einheitskreis. Seine Länge bleibt $1$.`},
        text:R`Für einen festen Ort $x_0$ ist $\Psi(x_0, t)$ eine komplexe Zahl, die sich mit der Zeit dreht. Zeichne sie als Zeiger in der komplexen Ebene (M1). Die Länge des Zeigers ist $|\psi(x_0)|$, sein Winkel $-Et/\hbar$. Er dreht sich im Uhrzeigersinn, einmal in der Zeit $T = h/E$.

Gemessen wird nur die Länge zum Quadrat, $|\Psi|^2$. Die Drehung selbst bleibt unsichtbar. Im Graphen der Tafel siehst du sie als Real- und Imaginärteil, die gegeneinander schwingen. Ihre Quadratsumme bleibt konstant. Darum ist ein stationärer Zustand nicht starr: Seine Phase läuft. Sichtbar wird das erst, wenn zwei Zeiger mit verschiedener Geschwindigkeit zusammenkommen (Abschnitt 5).`,
        reps:{obj:'Ein stationärer Zustand an einer festen Stelle',
          rows:[
            {k:'worte', text:R`Ein Zeiger fester Länge, der sich gleichmäßig im Uhrzeigersinn dreht.`},
            {k:'formel', tex:R`\Psi(x_0, t) = \psi(x_0)\,e^{-iEt/\hbar}`},
            {k:'mathe', tex:R`e^{-i\varphi} = \cos\varphi - i\sin\varphi,\qquad \varphi = \frac{Et}{\hbar} = 2\pi\,\frac{t}{T}`},
            {k:'graph', plot:{x:[0, 1.25], y:[-1.2, 1.2], xlab:'t/T', ylab:R`\Psi(x_0, t)`, ticks:[{x:0.25, lab:'\\tfrac14'}, {x:0.5, lab:'\\tfrac12'}, {x:0.75, lab:'\\tfrac34'}, {x:1, lab:'1'}], yticks:[{y:-1, lab:'-1'}, {y:1, lab:'1'}]}, f:t => Math.cos(2 * Math.PI * t), lab:R`\operatorname{Re}\Psi`, f2:t => -Math.sin(2 * Math.PI * t), lab2:R`\operatorname{Im}\Psi`,
              cap:R`Für $\psi(x_0) = 1$: Real- und Imaginärteil schwingen um eine Viertelperiode versetzt. An jedem Zeitpunkt ist $(\operatorname{Re}\Psi)^2 + (\operatorname{Im}\Psi)^2 = 1$.`},
            {k:'physik', text:R`Die Ortsdichte $|\Psi(x_0,t)|^2 = |\psi(x_0)|^2$ und alle Erwartungswerte bleiben gleich. Die Phase selbst misst man nicht.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Die Länge des Zeigers ist $|\psi(x_0)|$, die Drehung steckt im Faktor $e^{-iEt/\hbar}$.`},
            {from:'formel', to:'mathe', rule:R`Den Exponenten als Winkel $\varphi = Et/\hbar$ lesen und mit der Euler-Formel in Real- und Imaginärteil zerlegen.`},
            {from:'mathe', to:'graph', rule:R`$\cos\varphi$ als erste und $-\sin\varphi$ als zweite Kurve über $t$ zeichnen, mit $\varphi = 2\pi t/T$.`},
            {from:'graph', to:'physik', rule:R`Beide Kurven an jedem Zeitpunkt quadrieren und addieren: Die Summe ist konstant, also auch die Dichte.`}
          ]},
        q:{q:R`Im Graphen ist zu einem Zeitpunkt $\operatorname{Re}\Psi = 0$ und $\operatorname{Im}\Psi = 1$. Welcher Zeitpunkt ist das?`, tr:{from:'graph', to:'formel'},
          opts:[R`$t = T/4$`, R`$t = T/2$`, R`$t = 3T/4$`], a:2,
          ex:R`$e^{-iEt/\hbar} = i$ verlangt den Winkel $-Et/\hbar = -3\pi/2$, also $t = 3T/4$.`,
          fb:[R`Bei $T/4$ ist $e^{-i\pi/2} = -i$: Der Imaginärteil ist $-1$, nicht $+1$. Der Zeiger dreht im Uhrzeigersinn.`,
            R`Bei $T/2$ ist der Zeiger bei $-1$: Realteil $-1$, Imaginärteil $0$.`,
            '']}},
      {id:'sg-t3c', title:'Erwartungswerte stehen still, die Energie ist scharf',
        num:{title:R`Der Zustand $\psi_2$ im Kasten`, text:R`Für $\Psi = \psi_2\,e^{-iE_2t/\hbar}$ ist $\langle x\rangle = L/2$ zu jeder Zeit, weil $|\psi_2|^2$ symmetrisch zur Mitte ist. Aus $\hat H\psi_2 = E_2\psi_2$ folgt $\hat H^2\psi_2 = E_2^2\psi_2$, also

$$\langle H\rangle = E_2,\qquad \langle H^2\rangle = E_2^2,\qquad \Delta H = \sqrt{E_2^2 - E_2^2} = 0.$$`},
        text:R`Nicht nur die Dichte, jeder Erwartungswert ist zeitunabhängig. Im Integral $\int\Psi^*\hat Q\Psi\,dx$ wirkt ein Operator $\hat Q$ aus $x$ und $\partial_x$ nicht auf den Zeitfaktor, und $e^{+iEt/\hbar}e^{-iEt/\hbar} = 1$. Die Herleitung zeigt das für $\langle x\rangle$ und $\langle p\rangle$. Weil $\langle x\rangle$ konstant ist, ist $\langle p\rangle = m\,d\langle x\rangle/dt = 0$ (Thema 1).

Außerdem ist die Energie scharf. Aus $\hat H\psi = E\psi$ folgt $\langle H\rangle = E$ und $\Delta H = 0$. Jede Energiemessung liefert $E$. Damit ist auch geklärt, dass die Separationskonstante $E$ die Energie des Zustands ist.`,
        derive:{ctx:{coords:['x', 't'], params:{E:'real', m:'pos'}, abstract:{ψ:{args:['x']}}, defs:{'Ψ(x,t)':'ψ(x) e^(-i E t/ħ)'}},
          lines:[
            {l:'∫_-∞^∞ Ψ^* x Ψ dx = ∫_-∞^∞ x |ψ(x)|^2 dx', w:'⟨x⟩ zeitunabhängig', why:{q:R`Warum fällt der Zeitfaktor aus $\langle x\rangle$ heraus?`, opts:['Weil $x$ nur multipliziert und $e^{+iEt/\\hbar}e^{-iEt/\\hbar} = 1$ übrig bleibt.', 'Weil $\\langle x\\rangle$ in jedem Zustand in der Mitte des Kastens liegt.', 'Weil man bei Erwartungswerten über die Zeit mittelt.'], a:0, ex:R`Der Operator $x$ lässt den Zeitfaktor unverändert. Im Produkt $\Psi^*x\Psi$ heben sich die Phasen auf.`}},
            {l:'∫_-∞^∞ Ψ^* (-iħ ∂Ψ/∂x) dx = ∫_-∞^∞ ψ^* (-iħ dψ/dx) dx', w:'∂x wirkt nicht auf den Zeitfaktor', why:{q:'Warum hängt auch $\\langle p\\rangle$ nicht von $t$ ab?', opts:['Weil $\\partial_x$ den Zeitfaktor nicht ändert.', 'Weil $\\hat p$ ein hermitescher Operator ist.', 'Weil der Impuls eines Teilchens immer erhalten ist.'], a:0, ex:'Der Zeitfaktor ist für $\\partial_x$ eine Konstante. Im Produkt $\\Psi^*\\ldots\\Psi$ ergibt er $e^{+iEt/\\hbar}e^{-iEt/\\hbar} = 1$.'}}
          ]},
        q:{q:R`$\Psi = \psi_2(x)\,e^{-iE_2t/\hbar}$ im Kasten. Was liefert eine Energiemessung?`,
          opts:[R`je nach Zeitpunkt $E_1$ oder $E_2$`, R`im Mittel $E_2$, einzeln andere Werte`, R`sicher den Wert $E_2$`], a:2,
          ex:R`$\hat H\psi_2 = E_2\psi_2$, also $\Delta H = 0$: Die Energie ist scharf.`,
          fb:[R`Der Zustand enthält nur $\psi_2$. Ein Anteil mit $E_1$ kommt gar nicht vor, zu keiner Zeit.`,
            R`Bei $\Delta H = 0$ streuen die Messwerte nicht. Jeder einzelne ist $E_2$.`,
            '']}},
      {id:'sg-t3d', title:'Typischer Fehler: stationär heißt in Ruhe',
        num:{title:R`Grundzustand eines $1\,\mathrm{nm}$-Kastens`, text:R`Für $\psi_1$ ist $\langle p\rangle = 0$, aber $\langle p^2\rangle = (\pi\hbar/L)^2$. Für ein Elektron und $L = 1\,\mathrm{nm}$ ist

$$\sqrt{\langle p^2\rangle} = \frac{\pi\hbar}{L} \approx 3{,}3\cdot10^{-25}\,\mathrm{kg\,m/s},\qquad \frac{\langle p^2\rangle}{2m_e} \approx 0{,}38\,\mathrm{eV}.$$

Die ganze Energie $E_1$ ist kinetisch.`},
        text:R`**Stationär heißt nicht „in Ruhe“.** Im Grundzustand des Kastens ist $\langle p\rangle = 0$, aber $\langle p^2\rangle > 0$: Die kinetische Energie ist nicht null. Positive und negative Impulse kommen gleich oft vor. Ihr Mittelwert ist null, ihre Quadrate nicht.

Stationär ist die Wahrscheinlichkeitsverteilung, nicht das Teilchen. Das Bild eines Teilchens, das ruhig an einer Stelle sitzt, passt zu keinem Zustand im Kasten. Ebenso falsch ist das Bild eines Teilchens auf einer festen Bahn, das hin- und herfliegt. Es gibt nur die Verteilung der Messwerte, und die ändert sich nicht.`,
        q:{q:R`Was gilt im Grundzustand $\psi_1$ eines Kastens?`,
          opts:[R`$\langle p\rangle = 0$ und $\langle p^2\rangle > 0$`, R`$\langle p\rangle = 0$ und $\langle p^2\rangle = 0$, das Teilchen ruht.`, R`$\langle p\rangle > 0$, weil die Energie positiv ist`], a:0,
          ex:R`$\langle p\rangle = 0$, weil $\psi_1$ reell ist. $\langle p^2\rangle = (\pi\hbar/L)^2 = 2mE_1 > 0$.`,
          fb:['',
            R`$\langle p^2\rangle = 0$ hieße kinetische Energie null. Im Kasten ist aber $E_1 > 0$, und sie ist ganz kinetisch.`,
            R`Positive Energie heißt nicht positiver Impuls. Die Impulse nach links und rechts mitteln sich weg.`]}},
      {id:'sg-t3e', title:'Typischer Fehler: jeder Zustand ist stationär',
        num:{title:R`Die Parabel $x(L - x)$`, text:R`Im Kasten ist $\psi = A\,x(L - x)$ ein erlaubter Zustand. Mit $\psi'' = -2A$ und $V = 0$ ist

$$\hat H\psi = -\frac{\hbar^2}{2m}\psi'' = \frac{\hbar^2A}{m}.$$

Das ist eine Konstante, kein Vielfaches von $\psi$. Es gibt kein $E$ mit $\hat H\psi = E\psi$.`},
        text:R`**Nicht jeder Zustand ist stationär.** Das ist eine der häufigsten Fehlvorstellungen der Quantenmechanik (Styer 1996; Singh & Marshman 2015). Die Parabel im Beispiel ist ein erlaubter Zustand, aber keine Energie-Eigenfunktion. Ihre Dichte ändert sich mit der Zeit. Thema 3 zeigt, wie: Man zerlegt sie in stationäre Zustände.

**Test.** Wende $\hat H$ auf $\psi$ an. Kommt ein konstantes Vielfaches von $\psi$ heraus *und* erfüllt $\psi$ die Randbedingungen, ist $\psi$ eine Energie-Eigenfunktion. Beispiel: $\sin(3\pi x/2L)$ erfüllt im Inneren des Kastens $\hat H\psi = E\psi$, aber wegen $\psi(L) \ne 0$ ist es keine Eigenfunktion des Kastens. Normierung und Realität von $\psi$ entscheiden die Frage nicht.`,
        q:{q:R`Welche Funktion ist eine Energie-Eigenfunktion im Kasten $0 < x < L$?`,
          opts:[R`$A\,x(L - x)$`, R`$A\sin(3\pi x/2L)$`, R`$A\sin(2\pi x/L)$`, R`$A\cos(\pi x/L)$`], a:2,
          ex:R`$\sin(2\pi x/L)$ erfüllt $\hat H\psi = E\psi$ und ist an beiden Wänden null.`,
          fb:[R`$\hat H$ macht daraus eine Konstante, kein Vielfaches von $\psi$.`,
            R`Im Inneren stimmt die Gleichung, aber bei $x = L$ ist $\sin(3\pi/2) = -1 \ne 0$. Die Randbedingung fehlt.`,
            '',
            R`Im Inneren stimmt die Gleichung, aber bei $x = 0$ ist $\cos 0 = 1 \ne 0$.`]}}
    ]},

    /* ===== Abschnitt 4: Anschlussbedingungen, Krümmung, Quantisierung ===== */
    {id:'sg-t4', title:'Welche Lösungen sind zulässig?', steps:[
      {id:'sg-t4a', title:'Stetig und glatt: die Anschlussbedingungen',
        num:{title:'Ein schmales Intervall an einer Stufe', text:R`Integriere $\psi'' = \frac{2m}{\hbar^2}(V - E)\psi$ über $[x_0 - \varepsilon,\ x_0 + \varepsilon]$. Mit $\frac{2m}{\hbar^2}|V - E| \le 1\,\mathrm{nm}^{-2}$, $|\psi| \le 1\,\mathrm{nm}^{-1/2}$ und $\varepsilon = 0{,}01\,\mathrm{nm}$ ist der Sprung von $\psi'$ höchstens

$$1\cdot1\cdot2\varepsilon = 0{,}02\,\mathrm{nm}^{-3/2}.$$

Für $\varepsilon \to 0$ geht er gegen null.`},
        text:R`Für jedes $E$ hat die stationäre Gleichung zwei unabhängige Lösungen. Physikalisch zulässig sind nur Lösungen mit drei Eigenschaften ([[lex:anschluss|Anschlussbedingungen]]):

- $\psi$ ist überall **stetig**. Ein Sprung in $\psi$ ergäbe in $\psi''$ die Ableitung einer δ-Funktion, und die kann kein Term der Gleichung ausgleichen.
- $\psi'$ ist stetig, **wo $V$ endlich ist**. Das zeigt das Beispiel: Der Sprung von $\psi'$ ist $\frac{2m}{\hbar^2}\int(V - E)\,\psi\,dx$ über ein schrumpfendes Intervall. Nur an unendlich hohen Wänden (Thema 3) oder bei einem δ-Potential darf $\psi'$ springen.
- Für gebundene Zustände ist $\psi$ **normierbar**.`,
        q:{q:R`An welcher Stelle darf $\psi'$ springen?`,
          opts:[R`an jeder Stufe des Potentials`, R`an einer unendlich hohen Wand`, R`nirgends, auch nicht an einer Wand`], a:1,
          ex:R`Bei endlichem $V$ verschwindet $\int(V - E)\psi\,dx$ über ein schrumpfendes Intervall, also ist $\psi'$ stetig. An einer unendlich hohen Wand gilt das Argument nicht.`,
          fb:[R`An einer endlichen Stufe bleibt $\psi'$ stetig. Erst ein unendlich hohes $V$ macht das Integral über das schrumpfende Intervall nicht klein.`,
            '',
            R`An einer unendlich hohen Wand versagt das Argument; dort darf $\psi'$ springen, etwa im Kasten.`]}},
      {id:'sg-t4b', title:'Krümmung: ψ″ gegen (V − E)ψ',
        pre:{from:'m-dgl', seg:'md-t3', title:'Schwingen oder Abklingen', text:R`Bei konstantem $V_0$ wird die stationäre Gleichung zu $\psi'' = -k^2\psi$ (für $E > V_0$) mit Schwingungen $e^{\pm ikx}$, oder zu $\psi'' = +\kappa^2\psi$ (für $E < V_0$) mit Lösungen $e^{\pm\kappa x}$, die wachsen oder abklingen. Mini-Beispiel: $\psi = e^{-2x}$ hat $\psi'' = 4\psi$.`},
        num:{title:'Zwei Stellen', text:R`Nimm Einheiten mit $2m/\hbar^2 = 1$ und $\psi = 0{,}5$ an einer Stelle. Ist dort $V - E = -1$, folgt $\psi'' = -0{,}5$: Die Kurve ist nach unten gekrümmt, zur Achse hin. Ist dort $V - E = +1$, folgt $\psi'' = +0{,}5$: Die Kurve ist nach oben gekrümmt, von der Achse weg.`},
        text:R`Die stationäre Gleichung lässt sich als Aussage über die Krümmung lesen:

$$\psi'' = \frac{2m}{\hbar^2}\,(V - E)\,\psi.$$

Wo $E > V$ ist (klassisch erlaubt), hat $\psi''$ das Vorzeichen von $-\psi$: $\psi$ krümmt sich zur Achse hin und schwingt, umso schneller, je größer $E - V$ ist. Wo $E < V$ ist (klassisch verboten), hat $\psi''$ das Vorzeichen von $\psi$: $\psi$ krümmt sich von der Achse weg und wächst oder fällt exponentiell. Mit dieser Regel kannst du Lösungen skizzieren, ohne sie auszurechnen.`,
        q:{q:R`In einem Bereich ist $E < V$. Wie verhält sich eine Lösung $\psi$ dort?`,
          opts:[R`Sie krümmt sich zur Achse hin und schwingt mit kleiner Wellenlänge.`, R`Sie muss dort überall exakt null sein, weil das Teilchen nicht hinkann.`, R`Sie krümmt sich von der Achse weg und wächst oder fällt exponentiell.`], a:2,
          ex:R`$\psi'' = \frac{2m}{\hbar^2}(V - E)\psi$ mit $V - E > 0$ hat das Vorzeichen von $\psi$. Null ist $\psi$ nur bei unendlich hohem $V$; bei endlichem $V$ dringt $\psi$ ein (Thema 5).`,
          fb:[R`Schwingen tut $\psi$ im erlaubten Bereich, wo $E > V$ ist.`,
            R`Bei endlichem $V$ ist $\psi$ im verbotenen Bereich nicht null. Es fällt ab, aber das Teilchen dringt ein Stück ein.`,
            '']}},
      {id:'sg-t4c', title:'Das Krümmungsbild an einer Stufe',
        num:{title:'Eine Stufe, zwei Bereiche', text:R`In Einheiten mit $2m/\hbar^2 = 1$ sei $V = 0$ für $x < 0$, $V = 2$ für $x > 0$ und $E = 1$. Dann ist links $\psi'' = -\psi$ und rechts $\psi'' = +\psi$. Eine Lösung ist

$$\psi = \sqrt2\cos\!\left(x + \tfrac\pi4\right)\ (x < 0),\qquad \psi = e^{-x}\ (x > 0).$$

Bei $x = 0$ passen Wert und Steigung: $\psi(0) = 1$ und $\psi'(0) = -1$ von beiden Seiten.`},
        text:R`Die Tafel zeigt die Krümmungsregel an diesem Beispiel. Im Graphen ist $\psi$ durchgezogen und $\psi''$ gestrichelt gezeichnet. Links, wo $E > V$ ist, liegen die beiden Kurven spiegelbildlich zur Achse: $\psi''$ hat stets das andere Vorzeichen als $\psi$, und $\psi$ schwingt. Rechts, wo $E < V$ ist, liegen sie aufeinander: gleiches Vorzeichen, $\psi$ fällt ab.

Achte auf die Stelle $x = 0$. Dort ändert $\psi''$ sprunghaft sein Vorzeichen, weil $V$ springt. $\psi$ selbst und seine Steigung gehen aber glatt über, wie es die Anschlussbedingungen verlangen.`,
        reps:{obj:'Krümmung an einer Potentialstufe',
          rows:[
            {k:'worte', text:R`Wo die Energie über dem Potential liegt, krümmt sich $\psi$ zur Achse hin; wo sie darunter liegt, von der Achse weg.`},
            {k:'formel', tex:R`\psi'' = \frac{2m}{\hbar^2}\,(V - E)\,\psi,\qquad V - E = \begin{cases}-1, & x < 0\\ +1, & x > 0\end{cases}\quad(2m/\hbar^2 = 1)`},
            {k:'graph', plot:{x:[-7, 3], y:[-1.6, 1.6], xlab:'x', ylab:R`\psi,\ \psi''`, regions:[{x:[-7, 0], lab:'E > V'}, {x:[0, 3], lab:'E < V'}]}, f:x => x < 0 ? Math.SQRT2 * Math.cos(x + Math.PI / 4) : Math.exp(-x), lab:R`\psi`, f2:x => x < 0 ? -Math.SQRT2 * Math.cos(x + Math.PI / 4) : Math.exp(-x), lab2:R`\psi''`,
              cap:R`Links spiegelbildlich: $\psi''$ und $\psi$ haben entgegengesetzte Vorzeichen, $\psi$ schwingt. Rechts deckungsgleich: gleiches Vorzeichen, $\psi$ fällt ab.`},
            {k:'physik', text:R`Links ist das Teilchen klassisch erlaubt. Rechts dringt es ein Stück in den verbotenen Bereich ein, auf einer Länge von etwa $1/\kappa$ (Thema 5).`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Energie über dem Potential“ heißt $V - E < 0$; das Vorzeichen von $V - E$ in die Gleichung einsetzen.`},
            {from:'formel', to:'graph', rule:R`$\psi''$ als zweite Kurve zeichnen: $\psi$ mit $V - E$ multipliziert. Bei $V - E < 0$ wird die Kurve an der Achse gespiegelt.`},
            {from:'graph', to:'physik', rule:R`Wo die Kurve schwingt, kann sich das Teilchen klassisch bewegen; wo sie abklingt, ist es klassisch verboten.`}
          ]},
        q:{q:R`In einem Graphen haben $\psi$ und $\psi''$ in einem Bereich dasselbe Vorzeichen. Was folgt dort für $V - E$?`, tr:{from:'graph', to:'formel'},
          opts:[R`$V - E > 0$: klassisch verboten`, R`$V - E < 0$: klassisch erlaubt`, R`$V - E = 0$: genau am Umkehrpunkt`], a:0,
          ex:R`$\psi'' = \frac{2m}{\hbar^2}(V - E)\psi$. Gleiches Vorzeichen von $\psi''$ und $\psi$ verlangt $V - E > 0$.`,
          fb:['',
            R`Bei $V - E < 0$ hätte $\psi''$ das entgegengesetzte Vorzeichen, und die Kurven lägen spiegelbildlich.`,
            R`Bei $V - E = 0$ wäre $\psi'' = 0$; die Kurve wäre dort gerade, nicht gekrümmt.`]}},
      {id:'sg-t4d', title:'Quantisierung ohne Zusatzannahme',
        num:{title:'Zwei Energien knapp nebeneinander', text:R`Im Tal $V = x^2$ (Einheiten mit $2m/\hbar^2 = 1$) startest du links mit einer abfallenden Lösung und rechnest nach rechts. Für $E = 0{,}9$ ist bei $x = 3$ schon $\psi \approx +3{,}5$, für $E = 1{,}1$ ist $\psi \approx -2{,}3$. Dazwischen, bei $E = 1$, fällt $\psi = e^{-x^2/2}$ auch rechts ab.`},
        text:R`Ein gebundenes Teilchen hat links und rechts verbotene Bereiche, und dort muss $\psi$ abfallen. Startet man links mit einer abfallenden Lösung und integriert nach rechts, läuft $\psi$ für fast jedes $E$ rechts gegen $+\infty$ oder $-\infty$. Nur für einzelne Energien fällt es auch rechts ab. Diese $E_n$ sind die erlaubten Energien.

Die Quantisierung folgt also allein aus der Gleichung und der Normierbarkeit. Im Bild siehst du zwei Energien knapp unter und über einem erlaubten Wert. Die Kurven laufen in entgegengesetzte Richtungen weg; der erlaubte Wert liegt dazwischen. Im Kasten (Thema 3) lässt sich das exakt ausrechnen, beim Oszillator (Thema 7) und beim Wasserstoffatom (Thema 9) ebenfalls.`,
        plot:{plot:{x:[-3.5, 3.2], y:[-2, 2], xlab:'x', ylab:R`\psi`, V:x => x * x, Vr:[0, 12], ticks:[{x:-3, lab:'-3'}, {x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}]}, f:x => SG_SHOOT.lo(x), lab:R`E = 0{,}9`, f2:x => SG_SHOOT.hi(x), lab2:R`E = 1{,}1`,
          cap:R`Grau das Potential $V = x^2$. Beide Lösungen starten links abfallend. Für $E = 0{,}9$ läuft $\psi$ rechts nach oben weg, für $E = 1{,}1$ nach unten. Bei $E = 1$ fällt es auf beiden Seiten ab.`},
        q:{q:R`Für eine Energie knapp über $E_n$ läuft die links abfallende Lösung rechts gegen $-\infty$. Was bedeutet das?`,
          opts:[R`Das Teilchen wird nach rechts beschleunigt und läuft davon.`, R`$\psi$ muss nur anders normiert werden, dann passt es wieder.`, R`Für ein gebundenes Teilchen ist diese Energie verboten.`], a:2,
          ex:R`Eine Lösung, die gegen $\pm\infty$ läuft, ist nicht normierbar. Erlaubt sind nur die Energien, bei denen $\psi$ auf beiden Seiten abfällt.`,
          fb:[R`$\psi$ beschreibt keine Bahn. Eine nach $\pm\infty$ laufende Lösung ist schlicht nicht normierbar.`,
            R`Kein Vorfaktor macht eine Funktion normierbar, die gegen unendlich läuft.`,
            '']}},
      {id:'sg-t4e', title:'Folgerung: Kein Teilchen liegt am Boden',
        num:{title:'Überall verboten', text:R`Wäre überall $E < V$, etwa mit $\frac{2m}{\hbar^2}(V - E) = 1$, dann wäre überall $\psi'' = \psi$. Die Lösungen sind $\psi = Ae^{x} + Be^{-x}$. Fällt $\psi$ links ab, ist $B = 0$, und rechts wächst $Ae^{x}$ über alle Grenzen. Auf beiden Seiten abfallen kann keine dieser Lösungen.`},
        text:R`Daraus folgt: $E$ muss größer sein als das Minimum von $V$. Sonst wäre überall $E < V$, und $\psi$ würde sich überall von der Achse wegkrümmen. Eine solche Kurve kann nicht auf beiden Seiten abfallen, wie das Beispiel zeigt.

Ein gebundenes Teilchen kann also nicht auf dem Boden des Potentials liegen. Das ist ein erster Grund für die Nullpunktsenergie; der zweite ist die Unschärferelation aus Thema 1. Im Kasten liegt der Boden bei $V = 0$, und die kleinste Energie ist $E_1 > 0$ (Thema 3).`,
        q:{q:R`Ein Potential hat sein Minimum bei $V_{\min} = -2\,\mathrm{eV}$. Welche Energie kann ein gebundener Zustand sicher nicht haben?`,
          opts:[R`$-1{,}9\,\mathrm{eV}$`, R`$-1\,\mathrm{eV}$`, R`$-2{,}5\,\mathrm{eV}$`], a:2,
          ex:R`Unter dem Minimum wäre überall $E < V$. Dann krümmt sich $\psi$ überall von der Achse weg und kann nicht normierbar sein.`,
          fb:[R`Knapp über dem Minimum ist ein gebundener Zustand möglich, wenn das Tal breit genug ist.`,
            R`Über dem Minimum gibt es einen erlaubten Bereich; dort kann $\psi$ schwingen.`,
            '']}}
    ]},

    /* ===== Abschnitt 5: Überlagerung, Zeitentwicklung, Labor ===== */
    {id:'sg-t5', title:'Überlagerung und Zeitentwicklung', steps:[
      {id:'sg-t5a', title:'Jeder Anteil dreht seine eigene Phase',
        pre:{from:'m-dgl', seg:'md-t1', title:'Linearität', text:R`Eine lineare Differentialgleichung enthält die gesuchte Funktion und ihre Ableitungen nur in der ersten Potenz. Dann ist mit zwei Lösungen $y_1$ und $y_2$ auch jede Kombination $c_1y_1 + c_2y_2$ eine Lösung. Mini-Beispiel: $\sin x$ und $\cos x$ lösen $y'' = -y$, also auch $3\sin x - 2\cos x$.`},
        num:{title:'Zwei Zeiger mit verschiedenem Tempo', text:R`Im Kasten ist $E_2 = 4E_1$. Der Anteil $\psi_1$ dreht seine Phase mit $E_1/\hbar$, der Anteil $\psi_2$ viermal so schnell. Nach der Zeit $t = \pi\hbar/(3E_1)$ hat der zweite Zeiger gegenüber dem ersten den Winkel

$$\frac{(E_2 - E_1)t}{\hbar} = \frac{3E_1}{\hbar}\cdot\frac{\pi\hbar}{3E_1} = \pi$$

aufgeholt. Aus $\psi_1 + \psi_2$ ist bis auf eine gemeinsame Phase $\psi_1 - \psi_2$ geworden.`},
        text:R`Die Schrödingergleichung ist linear. Erfüllen $\psi_1, \psi_2, \dots$ die Gleichungen $\hat H\psi_n = E_n\psi_n$, dann löst jede Summe

$$\Psi(x,t) = \sum_n c_n\,\psi_n(x)\,e^{-iE_nt/\hbar}$$

die zeitabhängige Gleichung ([[lex:superposition|Superpositionsprinzip]]). Jeder Summand behält **seinen eigenen** Phasenfaktor. Die Koeffizienten $c_n$ legt der Anfangszustand fest: $\Psi(x,0) = \sum_nc_n\psi_n(x)$. Damit hast du ein Rezept für die [[lex:zeitentwicklung|Zeitentwicklung]]: Anfangszustand zerlegen, an jeden Anteil $e^{-iE_nt/\hbar}$ hängen, fertig. Im Kasten lässt sich jeder Anfangszustand so zerlegen (Thema 3).`,
        q:{q:R`$\Psi(x,0) = (\psi_1 + \psi_3)/\sqrt2$ mit Energie-Eigenfunktionen $\psi_n$. Wie lautet $\Psi(x,t)$?`,
          opts:[R`$\tfrac{1}{\sqrt2}\left(\psi_1 + \psi_3\right)e^{-i(E_1 + E_3)t/2\hbar}$`, R`$\tfrac{1}{\sqrt2}\left(\psi_1e^{-iE_1t/\hbar} + \psi_3e^{-iE_3t/\hbar}\right)$`, R`$\tfrac{1}{\sqrt2}\left(\psi_1 + \psi_3\right)$, weil beide stationär sind`], a:1,
          ex:R`Jeder Anteil bekommt den Zeitfaktor seiner eigenen Energie. Ein gemeinsamer Faktor passt nur bei gleichen Energien.`,
          fb:[R`Ein gemeinsamer Faktor mit der mittleren Energie löst die Gleichung nicht, weil $\psi_1 + \psi_3$ keine Eigenfunktion ist.`,
            '',
            R`Jeder Anteil für sich ist stationär, die Summe nicht. Die Phasen der Anteile laufen verschieden schnell.`]}},
      {id:'sg-t5b', title:'Die Dichte schwappt',
        num:{title:R`Die Dichte bei $x = L/4$`, text:R`Im Kasten mit $L = 1$ ist bei $x = L/4$ der Wert $\psi_1 = 1$ und $\psi_2 = \sqrt2$. Für $\Psi = (\psi_1e^{-iE_1t/\hbar} + \psi_2e^{-iE_2t/\hbar})/\sqrt2$ ist dort

$$|\Psi|^2 = \tfrac12(1 + 2) + 1\cdot\sqrt2\cdot\cos\frac{(E_2 - E_1)t}{\hbar},$$

also $2{,}91$ bei $t = 0$, $1{,}5$ nach einer Viertelperiode und $0{,}09$ nach einer halben.`},
        text:R`Für $\Psi = \frac{1}{\sqrt2}\left(\psi_1e^{-iE_1t/\hbar} + \psi_2e^{-iE_2t/\hbar}\right)$ mit reellen $\psi_n$ rechnet die Herleitung die Dichte aus. Die Einzelterme verlieren ihre Phase, der Mischterm nicht:

$$|\Psi|^2 = \tfrac12\left(\psi_1^2 + \psi_2^2\right) + \psi_1\psi_2\cos\frac{(E_2 - E_1)t}{\hbar}.$$

Die Dichte schwingt mit der Kreisfrequenz $\omega_{21} = (E_2 - E_1)/\hbar$, gelesen „omega zwei eins“, und der Periode $T = 2\pi\hbar/(E_2 - E_1)$. Wo $\psi_1\psi_2 > 0$ ist, wird es abwechselnd dichter und dünner; wo $\psi_1\psi_2 < 0$ ist, genau umgekehrt.`,
        derive:{ctx:BOX2({defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)', 'Ψ(x,t)':'1/sqrt(2) (ψ_1(x) e^(-i E_1 t/ħ) + ψ_2(x) e^(-i E_2 t/ħ))'}}),
          lines:[
            {l:'|Ψ(x,t)|^2 = 1/2 (ψ_1(x)^2 + ψ_2(x)^2) + 1/2 ψ_1(x) ψ_2(x) (e^(i(E_2 - E_1)t/ħ) + e^(-i(E_2 - E_1)t/ħ))', w:'ausmultipliziert, ψ_n reell', why:{q:'Warum bleibt nur im Mischterm eine Zeitabhängigkeit?', opts:['Weil dort $e^{+iE_1t/\\hbar}$ und $e^{-iE_2t/\\hbar}$ zusammentreffen, mit $E_1 \\ne E_2$.', 'Weil die Einzelterme $\\psi_n^2$ zeitlich gemittelt werden.', 'Weil der Mischterm als einziger komplexe Zahlen enthält.'], a:0, ex:'In $|\\psi_1e^{-iE_1t/\\hbar}|^2$ heben sich die Phasen auf. Im Produkt $\\psi_1e^{+iE_1t/\\hbar}\\cdot\\psi_2e^{-iE_2t/\\hbar}$ bleibt $e^{-i(E_2-E_1)t/\\hbar}$ stehen.'}},
            {l:'= 1/2 (ψ_1(x)^2 + ψ_2(x)^2) + ψ_1(x) ψ_2(x) cos((E_2 - E_1) t/ħ)', w:'e^(iu) + e^(-iu) = 2 cos u'}
          ]},
        q:{q:R`$(\psi_1 + \psi_2)/\sqrt2$ im Kasten, mit $E_n = n^2E_1$: Nach welcher Zeit sieht die Dichte zum ersten Mal wieder aus wie bei $t = 0$?`,
          opts:[R`$T = 2\pi\hbar/E_1$`, R`$T = 2\pi\hbar/(3E_1)$`, R`$T = 2\pi\hbar/(5E_1)$`], a:1,
          ex:R`$E_2 - E_1 = 4E_1 - E_1 = 3E_1$, also $T = 2\pi\hbar/(3E_1)$. Die Summe $E_1 + E_2 = 5E_1$ spielt keine Rolle.`,
          fb:[R`Das ist die Periode des Zeitfaktors von $\psi_1$ allein. Die Dichte hängt nur von der Differenz der Energien ab.`,
            '',
            R`$5E_1 = E_1 + E_2$ ist die Summe. Im Mischterm steht die Differenz.`]}},
      {id:'sg-t5c', title:'Im Labor: zwei Zustände überlagert',
        num:{title:R`Ein Elektron im $1\,\mathrm{nm}$-Kasten`, text:R`Mit $E_1 \approx 0{,}38\,\mathrm{eV}$ ist $E_2 - E_1 = 3E_1 \approx 1{,}13\,\mathrm{eV}$. Die Periode ist

$$T = \frac{h}{E_2 - E_1} \approx 3{,}7\,\mathrm{fs}.$$

Licht mit dieser Energie hat $\lambda = hc/(E_2 - E_1) \approx 1{,}1\,\mu\mathrm{m}$: Mit dieser Frequenz strahlt ein System beim Übergang zwischen den beiden Niveaus.`},
        text:R`Im Bild ist die Kurve $|\Psi(x,t)|^2$ für $\Psi = c_1\psi_1e^{-iE_1t/\hbar} + c_2\psi_2e^{-iE_2t/\hbar}$. Der Regler „Anteil $|c_1|^2$“ legt die Gewichte fest; $|c_2|^2 = 1 - |c_1|^2$. Der Regler „Zeit $t$“ zählt in Perioden $T = 2\pi\hbar/(E_2 - E_1)$. Die rote Linie ist $\langle x\rangle$.

Stell $|c_1|^2 = 0{,}5$ ein und bewege die Zeit von $0$ bis $1$: Die Dichte wandert von links nach rechts und zurück, und $\langle x\rangle$ folgt ihr. Mit $|c_1|^2 = 1$ steht alles still: ein stationärer Zustand. Unter „Mehr Regler“ kannst du statt $\psi_2$ den Zustand $\psi_3$ wählen. Dann bleibt die Dichte symmetrisch zur Mitte und „atmet“ nur.`,
        fig:{lab:'twostate', keep:['Anteil', 'Zeit'], caption:R`$|\Psi(x,t)|^2$ für $c_1\psi_1e^{-iE_1t/\hbar} + c_2\psi_2e^{-iE_2t/\hbar}$. Nur bei $|c_1|^2 = 0$ oder $1$ steht die Dichte still.`},
        q:{q:R`Im Labor stellst du $|c_1|^2 = 0{,}5$ und $t = 0{,}5\,T$ ein. Wo liegt der größte Teil der Dichte?`, tr:{from:'formel', to:'labor'},
          opts:[R`links, wie bei $t = 0$`, R`rechts der Mitte`, R`symmetrisch zur Mitte verteilt`], a:1,
          ex:R`Bei $t = T/2$ ist $\cos\frac{(E_2 - E_1)t}{\hbar} = \cos\pi = -1$. Der Mischterm $\psi_1\psi_2$ wechselt das Vorzeichen, und die Dichte liegt rechts.`,
          fb:[R`Links ist die Dichte bei $t = 0$ und $t = T$. Nach einer halben Periode hat der Mischterm das Vorzeichen gewechselt.`,
            '',
            R`Symmetrisch ist die Dichte bei $t = T/4$, wenn der Mischterm null ist.`]}},
      {id:'sg-t5d', title:'Vom Zeigerpaar zur schwappenden Dichte',
        num:{title:R`$\langle x\rangle$ im Kasten`, text:R`Für $(\psi_1 + \psi_2)/\sqrt2$ im Kasten ergibt die Rechnung

$$\langle x\rangle(t) = \frac L2 - \frac{16L}{9\pi^2}\cos\frac{(E_2 - E_1)t}{\hbar}.$$

$\langle x\rangle$ pendelt also zwischen $0{,}32L$ bei $t = 0$ und $0{,}68L$ bei $t = T/2$.`},
        text:R`Die Tafel verbindet die Gestalten der Überlagerung. In Worten sind es zwei Zeiger, die sich verschieden schnell drehen. Mathematisch zählt nur ihr Winkelunterschied $(E_2 - E_1)t/\hbar$. In der Formel steckt er im Kosinus des Mischterms. Im Graphen siehst du die Dichte zu zwei Zeitpunkten, im Labor die ganze Bewegung.

Physikalisch schwingt der Mittelwert $\langle x\rangle$. Ein geladenes Teilchen, dessen Ladungsschwerpunkt schwingt, strahlt mit dieser Frequenz. Darum gehört zu einem Übergang zwischen zwei Niveaus Licht der Kreisfrequenz $(E_2 - E_1)/\hbar$, wie bei den Spektrallinien aus Thema 1.`,
        reps:{obj:R`Die Überlagerung $(\psi_1 + \psi_2)/\sqrt2$ im Kasten`,
          rows:[
            {k:'worte', text:R`Zwei Zeiger, einer viermal so schnell wie der andere. Wo sie gleich zeigen, ist die Dichte groß, wo sie entgegengesetzt zeigen, klein.`},
            {k:'mathe', tex:R`\psi_1e^{-iE_1t/\hbar} + \psi_2e^{-iE_2t/\hbar} = e^{-iE_1t/\hbar}\left(\psi_1 + \psi_2\,e^{-i(E_2 - E_1)t/\hbar}\right)`},
            {k:'formel', tex:R`|\Psi(x,t)|^2 = \tfrac12\left(\psi_1^2 + \psi_2^2\right) + \psi_1\psi_2\cos\frac{(E_2 - E_1)t}{\hbar}`},
            {k:'graph', plot:{x:[0, 1], y:[0, 3.6], xlab:'x/L', ylab:R`|\Psi|^2\cdot L`, ticks:[{x:0, lab:'0'}, {x:0.25, lab:'0{,}25'}, {x:0.5, lab:'0{,}5'}, {x:0.75, lab:'0{,}75'}, {x:1, lab:'1'}]}, f:x => (Math.sin(Math.PI * x) + Math.sin(2 * Math.PI * x)) ** 2, lab:'t = 0', f2:x => (Math.sin(Math.PI * x) - Math.sin(2 * Math.PI * x)) ** 2, lab2:'t = T/2',
              cap:R`Bei $t = 0$ liegt die Dichte links, bei $t = T/2$ spiegelbildlich rechts. Dazwischen wandert sie hin und her.`},
            {k:'labor', text:R`Labor „Überlagerung zweier Zustände im Kasten“: $|c_1|^2 = 0{,}5$, Zeit $t$ von $0$ bis $1\,T$. Die rote Linie $\langle x\rangle$ pendelt zwischen $0{,}32L$ und $0{,}68L$.`},
            {k:'physik', text:R`Der Mittelwert des Orts schwingt mit $\omega_{21} = (E_2 - E_1)/\hbar$. Mit dieser Kreisfrequenz strahlt das System beim Übergang zwischen den Niveaus.`}
          ],
          links:[
            {from:'worte', to:'mathe', rule:R`Die gemeinsame Phase $e^{-iE_1t/\hbar}$ ausklammern. Übrig bleibt die relative Phase des zweiten Zeigers.`},
            {from:'mathe', to:'formel', rule:R`Das Betragsquadrat bilden: Die gemeinsame Phase fällt weg, die relative Phase wird zum Kosinus im Mischterm.`},
            {from:'formel', to:'graph', rule:R`Für $t = 0$ den Kosinus $+1$ einsetzen, für $t = T/2$ den Wert $-1$, und jeweils über $x$ zeichnen.`},
            {from:'graph', to:'labor', rule:R`Im Labor dieselben Zeitpunkte mit dem Regler „Zeit $t$“ einstellen; dazwischen zeigt die Animation alle Zwischenstände.`},
            {from:'labor', to:'physik', rule:R`Die Bewegung der roten Linie ist die Schwingung von $\langle x\rangle$; ihre Kreisfrequenz ist $(E_2 - E_1)/\hbar$.`}
          ]},
        q:{q:R`Im Graphen ist die Dichte bei $t = T/2$ das Spiegelbild der Dichte bei $t = 0$. Welche relative Phase hat der zweite Zeiger dann gegenüber dem ersten?`, tr:{from:'graph', to:'mathe'},
          opts:[R`$\pi/2$`, R`$\pi$`, R`$2\pi$`, R`$0$`], a:1,
          ex:R`$(E_2 - E_1)t/\hbar = \pi$ bei $t = T/2$. Dann ist $e^{-i\pi} = -1$, und aus $\psi_1 + \psi_2$ wird $\psi_1 - \psi_2$.`,
          fb:[R`Bei $\pi/2$ ist der Mischterm null; die Dichte ist dann symmetrisch zur Mitte, nicht gespiegelt.`,
            '',
            R`Nach $2\pi$ zeigen die Zeiger wieder gleich; die Dichte ist dann wie bei $t = 0$.`,
            R`Bei relativer Phase $0$ sieht die Dichte aus wie bei $t = 0$, nicht wie ihr Spiegelbild.`]}},
      {id:'sg-t5e', title:'Globale und relative Phase',
        num:{title:'Zwei Faktoren', text:R`Multipliziere $\psi_1 + \psi_2$ mit $i$: Die Dichte $|i(\psi_1 + \psi_2)|^2 = |\psi_1 + \psi_2|^2$ bleibt. Multipliziere nur $\psi_2$ mit $i$: Bei $x = L/4$ ($L = 1$) ist

$$|1 + i\sqrt2|^2 = 1 + 2 = 3\qquad\text{statt}\qquad |1 + \sqrt2|^2 \approx 5{,}83.$$

Die relative Phase ändert die Dichte, die globale nicht.`},
        text:R`Ein gemeinsamer Faktor $e^{i\alpha}$ vor der ganzen Summe ist unbeobachtbar ([[lex:globale-phase|globale Phase]]). Die Phasendifferenz zwischen den Anteilen bestimmt dagegen, wohin die Dichte gerade geschwappt ist: $\psi_1 + \psi_2$ hat mehr Gewicht links, $\psi_1 - \psi_2$ mehr rechts.

In der Zeitentwicklung steckt beides. Klammerst du $e^{-iE_1t/\hbar}$ aus, bleibt die relative Phase $e^{-i(E_2 - E_1)t/\hbar}$. Nur sie hat Folgen. Deshalb ist es falsch, eine Überlagerung verschiedener Energien mit einem gemeinsamen Faktor $e^{-iEt/\hbar}$ zu versehen: Damit wäre die relative Phase eingefroren.`,
        q:{q:R`Welche Größe bestimmt, wo die Dichte von $(\psi_1e^{-iE_1t/\hbar} + \psi_2e^{-iE_2t/\hbar})/\sqrt2$ gerade liegt?`,
          opts:[R`die relative Phase $(E_2 - E_1)t/\hbar$`, R`die globale Phase $E_1t/\hbar$`, R`die Summe der Energien $E_1 + E_2$`], a:0,
          ex:R`Nach dem Ausklammern der globalen Phase bleibt nur die relative Phase. Sie geht in den Mischterm ein.`,
          fb:['',
            R`Die globale Phase fällt im Betragsquadrat weg. Sie hat keine Folgen.`,
            R`Die Summe der Energien tritt nur in einer gemeinsamen Phase auf und ist deshalb unbeobachtbar.`]}},
      {id:'sg-t5f', title:'Typischer Fehler: Die Summe stationärer Zustände ist stationär',
        num:{title:'Was sich ändert und was nicht', text:R`Für $(\psi_1 + \psi_2)/\sqrt2$ im $1\,\mathrm{nm}$-Kasten schwingt $\langle x\rangle$ zwischen $0{,}32\,\mathrm{nm}$ und $0{,}68\,\mathrm{nm}$. Die Gewichte $|c_1|^2 = |c_2|^2 = \tfrac12$ bleiben. Also bleibt auch

$$\langle H\rangle = \tfrac12E_1 + \tfrac12E_2 = \tfrac52E_1 \approx 0{,}94\,\mathrm{eV}.$$`},
        text:R`„$\psi_1$ und $\psi_2$ sind stationär, also auch ihre Summe“ ist falsch. Stationär ist eine Überlagerung nur, wenn alle beteiligten Energien gleich sind. Sonst schwappt die Dichte.

Was bleibt konstant? Die Gewichte $|c_ne^{-iE_nt/\hbar}|^2 = |c_n|^2$ ändern sich nicht. Damit ist auch $\langle H\rangle = \sum_n|c_n|^2E_n$ konstant, die Energieerhaltung, obwohl $\langle x\rangle$ schwingt. In $\langle H\rangle = \int\Psi^*\hat H\Psi\,dx$ fallen die Mischterme weg, weil $\int\psi_1\psi_2\,dx = 0$ ist; diese Orthogonalität zeigt Thema 3. **Ausblick:** Thema 3 zeigt auch, dass $|c_n|^2$ die Wahrscheinlichkeit ist, bei einer Energiemessung $E_n$ zu finden.`,
        q:{q:R`Was bleibt bei $(\psi_1 + \psi_2)/\sqrt2$ im Kasten zeitlich konstant?`,
          opts:[R`$\langle x\rangle$`, R`die Dichte bei $x = L/4$`, R`$\langle H\rangle$`], a:2,
          ex:R`$\langle H\rangle = \sum_n|c_n|^2E_n$ hängt nur von den Gewichten ab, und die bleiben. $\langle x\rangle$ und die Dichte schwingen.`,
          fb:[R`$\langle x\rangle$ pendelt zwischen $0{,}32L$ und $0{,}68L$; der Mischterm verschiebt die Dichte.`,
            R`Bei $x = L/4$ ist die Dichte $2{,}91$ bei $t = 0$ und $0{,}09$ bei $t = T/2$, jeweils in Einheiten von $1/L$.`,
            '']}}
    ]},

    /* ===== Abschnitt 6: Strom und Kontinuitätsgleichung ===== */
    {id:'sg-t6', title:'Wahrscheinlichkeitsstrom und Kontinuitätsgleichung', steps:[
      {id:'sg-t6a', title:'Wahrscheinlichkeit fließt durch die Ränder',
        pre:{from:'wf', seg:'wf-t5', title:'Die Normierung bleibt erhalten', text:R`In Thema 1 ergab die Rechnung $\frac{d}{dt}\int_{-\infty}^\infty|\Psi|^2dx = \frac{i\hbar}{2m}\left[\Psi^*\Psi' - \Psi\Psi^{*\prime}\right]_{-\infty}^{\infty}$. Der Randterm war null, weil $\Psi$ im Unendlichen verschwindet. Gebraucht wurden nur die Schrödingergleichung und ein reelles $V$.`},
        num:{title:'Ein Intervall füllt sich', text:R`Angenommen, an der linken Grenze eines Intervalls fließt die Wahrscheinlichkeit $j(a) = 0{,}3\,\mathrm{fs}^{-1}$ hinein, an der rechten $j(b) = 0{,}1\,\mathrm{fs}^{-1}$ hinaus. Die Zahlen sind ausgedacht, aber von typischer Größe für Elektronen. Dann ist

$$\frac{d}{dt}P_{ab} = j(a) - j(b) = 0{,}2\,\mathrm{fs}^{-1}.$$

In $0{,}1\,\mathrm{fs}$ wächst die Wahrscheinlichkeit im Intervall um etwa $0{,}02$.`},
        text:R`In Thema 1 hast du gezeigt, dass $\int|\Psi|^2dx$ über die ganze Achse erhalten bleibt. Was passiert in einem endlichen Stück $[a, b]$? Die Herleitung geht dieselben Schritte, nur mit endlichen Grenzen. Jetzt verschwindet der Randterm nicht:

$$\frac{d}{dt}\int_a^b|\Psi|^2dx = j(a,t) - j(b,t),\qquad j = \frac{\hbar}{2mi}\left(\Psi^*\frac{\partial\Psi}{\partial x} - \Psi\frac{\partial\Psi^*}{\partial x}\right).$$

$j$ heißt [[lex:stromdichte|Wahrscheinlichkeitsstromdichte]]. Die Wahrscheinlichkeit im Intervall ändert sich nur, weil bei $a$ etwas hinein- und bei $b$ etwas hinausfließt. Sie verschwindet nicht an einer Stelle, um woanders aufzutauchen.`,
        derive:{ctx:DYN({params:{m:'pos', a:'pos', b:'pos'}}),
          lines:[
            {l:'d/dt ∫_a^b |Ψ|^2 dx = iħ/(2m) ∫_a^b (Ψ^* ∂^2Ψ/∂x^2 - Ψ ∂^2Ψ^*/∂x^2) dx', w:'Produktregel, Schrödingergleichung, V reell'},
            {l:'= iħ/(2m) [Ψ^* ∂Ψ/∂x - Ψ ∂Ψ^*/∂x]_a^b', w:'Integrand ist eine Ableitung nach x', why:{q:'Warum ist $\\Psi^*\\Psi\'\' - \\Psi\\Psi^{*\\prime\\prime}$ eine Ableitung?', opts:['weil es $\\partial_x(\\Psi^*\\Psi\' - \\Psi\\Psi^{*\\prime})$ ist; $\\Psi^{*\\prime}\\Psi\'$ hebt sich weg', 'weil jede Funktion eine Stammfunktion hat', 'weil $\\Psi^*\\Psi\'\'$ und $\\Psi\\Psi^{*\\prime\\prime}$ gleich sind'], a:0, ex:'Produktregel: $\\partial_x(\\Psi^*\\Psi\') = \\Psi^{*\\prime}\\Psi\' + \\Psi^*\\Psi\'\'$, ebenso für den zweiten Term. Die gemischten Produkte heben sich in der Differenz weg.'}},
            {l:'= -[ħ/(2m i) (Ψ^* ∂Ψ/∂x - Ψ ∂Ψ^*/∂x)]_a^b', w:'= j(a) − j(b)', why:{q:'Wie liest man das Ergebnis?', opts:['Was bei $a$ hineinfließt, minus was bei $b$ hinausfließt.', 'Die Wahrscheinlichkeit in $[a, b]$ ist immer konstant.', 'Der Strom ist bei $a$ und $b$ immer gleich groß.'], a:0, ex:'$-[j]_a^b = j(a) - j(b)$. Nur wenn $j(a) = j(b)$, bleibt die Wahrscheinlichkeit im Intervall konstant.'}}
          ]},
        q:{q:R`In einem Intervall $[a, b]$ nimmt die Wahrscheinlichkeit gerade ab. Was folgt?`,
          opts:[R`$j(a) > j(b)$: links fließt mehr hinein als rechts hinaus.`, R`$j(b) > j(a)$: rechts fließt mehr hinaus als links hinein.`, R`$j$ ist im ganzen Intervall negativ.`], a:1,
          ex:R`$\frac{d}{dt}P_{ab} = j(a) - j(b) < 0$ heißt $j(b) > j(a)$. Das Vorzeichen von $j$ allein entscheidet nichts.`,
          fb:[R`Dann nähme die Wahrscheinlichkeit zu: Es käme mehr hinein, als hinausgeht.`,
            '',
            R`Auch mit negativem $j$ überall kann die Wahrscheinlichkeit zunehmen. Es kommt auf die Differenz $j(a) - j(b)$ an.`]}},
      {id:'sg-t6b', title:'Die Kontinuitätsgleichung',
        num:{title:'Ein Strom, der nach rechts schwächer wird', text:R`Angenommen, an einer Stelle sinkt der Strom auf $\Delta x = 0{,}01\,\mathrm{nm}$ von $0{,}30\,\mathrm{fs}^{-1}$ auf $0{,}28\,\mathrm{fs}^{-1}$. Also ist $\partial j/\partial x \approx -2\,\mathrm{nm}^{-1}\mathrm{fs}^{-1}$, und

$$\frac{\partial|\Psi|^2}{\partial t} = -\frac{\partial j}{\partial x} \approx +2\,\mathrm{nm}^{-1}\mathrm{fs}^{-1}.$$

Es fließt mehr hinein als hinaus: Die Dichte wächst.`},
        text:R`Weil $a$ und $b$ beliebig sind, folgt eine Gleichung an jedem Ort, die [[lex:kontinuitaet|Kontinuitätsgleichung]]:

$$\frac{\partial|\Psi|^2}{\partial t} + \frac{\partial j}{\partial x} = 0.$$

Dazu setzt man $b = a + \Delta x$, teilt durch $\Delta x$ und lässt $\Delta x \to 0$. Links wird aus dem Integral die Dichte mal $\Delta x$, rechts aus $j(a) - j(b)$ die Ableitung $-\partial_xj$ mal $\Delta x$.

Die Gleichung hat dieselbe Form wie die Ladungserhaltung in der Elektrodynamik. Wird der Strom an einer Stelle nach rechts schwächer, sammelt sich dort Wahrscheinlichkeit an, wie im Beispiel.`,
        q:{q:R`An einer Stelle wächst $j$ nach rechts hin, $\partial j/\partial x > 0$. Was macht die Dichte dort?`,
          opts:[R`Sie wächst, weil der Strom zunimmt.`, R`Sie bleibt gleich, weil der Strom positiv ist.`, R`Sie nimmt ab, weil mehr abfließt als ankommt.`], a:2,
          ex:R`$\partial_t|\Psi|^2 = -\partial_xj < 0$. Rechts fließt mehr ab, als links nachkommt.`,
          fb:[R`Ein stärker werdender Strom trägt mehr weg, als ankommt. Die Dichte sinkt.`,
            R`Es zählt nicht das Vorzeichen von $j$, sondern wie sich $j$ mit dem Ort ändert.`,
            '']}},
      {id:'sg-t6c', title:'Der Strom einer ebenen Welle',
        num:{title:R`Elektronen mit $k = 10\,\mathrm{nm}^{-1}$`, text:R`Für $\Psi = A\,e^{i(kx - \omega t)}$ ist $\Psi' = ik\Psi$, also $j = |A|^2\hbar k/m$. Mit $k = 10\,\mathrm{nm}^{-1}$ ist die Geschwindigkeit

$$v = \frac{\hbar k}{m_e} \approx 1{,}16\cdot10^6\,\mathrm{m/s} = 1{,}16\,\mathrm{nm/fs}.$$

Bei der Dichte $|A|^2 = 1\,\mathrm{nm}^{-1}$ ist $j \approx 1{,}16\,\mathrm{fs}^{-1}$: gut ein Teilchen pro Femtosekunde fließt vorbei.`},
        text:R`Eigenschaften von $j$:

- $j$ ist reell. Die Klammer ist $2i\,\mathrm{Im}(\Psi^*\partial_x\Psi)$, also $j = \frac{\hbar}{m}\mathrm{Im}(\Psi^*\partial_x\Psi) = \frac1m\mathrm{Re}(\Psi^*\hat p\Psi)$.
- In einer Dimension hat $j$ die Einheit $1/\mathrm{s}$: Wahrscheinlichkeit pro Zeit, die an einer Stelle vorbeifließt.
- Für $A\,e^{i(kx-\omega t)}$ ist $j = |A|^2\hbar k/m$: Dichte $|A|^2$ mal Geschwindigkeit $v = \hbar k/m$. Für $e^{-ikx}$ ist $j$ negativ; der Strom fließt nach links.
- Ist $\psi(x)$ reell, trägt $\psi(x)e^{-iEt/\hbar}$ keinen Strom. Strom braucht eine Phase, die sich mit dem Ort ändert.`,
        reps:{obj:'Der Strom einer ebenen Welle',
          rows:[
            {k:'worte', text:R`Die Dichte $|A|^2$ strömt mit der Geschwindigkeit $\hbar k/m$ nach rechts.`},
            {k:'formel', tex:R`j = \frac{\hbar}{2mi}\left(\Psi^*\Psi' - \Psi\Psi^{*\prime}\right) = \frac{\hbar}{2mi}\left(|A|^2ik + |A|^2ik\right) = |A|^2\frac{\hbar k}{m}`},
            {k:'mathe', text:R`$j = \frac{\hbar}{m}\operatorname{Im}(\Psi^*\Psi')$: Nur die Änderung der Phase mit $x$ trägt bei.`},
            {k:'physik', text:R`Ein Elektronenstrahl: Teilchen pro Zeit, die einen Punkt passieren. Mit $j$ berechnet Thema 5 Reflexion und Transmission an einer Barriere.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Dichte mal Geschwindigkeit“ als $|A|^2$ mal $\hbar k/m$ schreiben und mit der Definition von $j$ nachrechnen.`},
            {from:'formel', to:'mathe', rule:R`Die Klammer als zweimal $i$ mal Imaginärteil von $\Psi^*\Psi'$ lesen. Bei reellem $\Psi$ ist dieser Imaginärteil null.`},
            {from:'mathe', to:'physik', rule:R`Das Vorzeichen von $\operatorname{Im}(\Psi^*\Psi')$ gibt die Richtung des Strahls, sein Betrag die Zahl der Teilchen pro Zeit.`}
          ]},
        q:{q:R`$\Psi = A\,e^{-ikx}e^{-iEt/\hbar}$ mit $k > 0$. Wie groß ist der Strom?`, tr:{from:'formel', to:'physik'},
          opts:[R`$+|A|^2\hbar k/m$, nach rechts`, R`$-|A|^2\hbar k/m$, nach links`, R`$0$, eine reine Phase trägt keinen Strom`], a:1,
          ex:R`$\Psi' = -ik\Psi$, also $j = \frac{\hbar}{m}\operatorname{Im}(-ik|A|^2) = -|A|^2\hbar k/m$. Die Welle läuft nach links.`,
          fb:[R`Das Vorzeichen von $k$ im Exponenten bestimmt die Richtung. Mit $e^{-ikx}$ läuft die Welle nach links.`,
            '',
            R`Die Phase ändert sich mit dem Ort, und genau das trägt Strom. Keinen Strom trägt nur ein reelles $\psi(x)$.`]}},
      {id:'sg-t6d', title:'Typischer Fehler: stationär heißt stromlos',
        num:{title:'Zwei stationäre Zustände', text:R`$\psi_1(x)\,e^{-iE_1t/\hbar}$ im Kasten ist stationär, und weil $\psi_1$ reell ist, ist $j = 0$. $A\,e^{ikx}e^{-iEt/\hbar}$ ist ebenfalls stationär: Seine Dichte $|A|^2$ hängt nicht von $t$ ab. Trotzdem trägt es den Strom

$$j = |A|^2\frac{\hbar k}{m},$$

an jeder Stelle gleich groß.`},
        text:R`**Stationär heißt nicht stromlos.** In einem stationären Zustand ist $\partial_t|\Psi|^2 = 0$, also nach der Kontinuitätsgleichung $\partial_xj = 0$. Dann ist $j$ überall gleich, aber nicht unbedingt null. Was an einer Stelle hineinfließt, fließt an der nächsten wieder hinaus.

Gebundene stationäre Zustände wie im Kasten haben reelle $\psi$ und deshalb $j = 0$. Eine ebene Welle trägt dagegen einen konstanten Strom. Mit genau diesem Gedanken berechnet Thema 5 Reflexion und Transmission: Im stationären Zustand ist der Strom links und rechts einer Barriere gleich.`,
        q:{q:R`Ein stationärer Zustand trägt einen Strom $j$. Was gilt für $j$?`,
          opts:[R`$j$ ist an jeder Stelle gleich groß.`, R`$j$ ist überall null, weil sich nichts ändert.`, R`$j$ nimmt nach rechts ab, bis er null ist.`], a:0,
          ex:R`$\partial_t|\Psi|^2 = 0$ gibt mit der Kontinuitätsgleichung $\partial_xj = 0$. $j$ ist ortsunabhängig, kann aber ungleich null sein.`,
          fb:['',
            R`Eine ebene Welle mit Zeitfaktor ist stationär und trägt trotzdem den Strom $|A|^2\hbar k/m$.`,
            R`Nähme $j$ ab, sammelte sich Wahrscheinlichkeit an, und die Dichte wäre nicht stationär.`]}}
    ]}
  ],
  example:{
    title:'Eine ebene Welle löst die freie Schrödingergleichung',
    text:'Für $V = 0$ ist $\\Psi(x,t) = A\\,e^{i(kx - \\omega t)}$. Für welches $\\omega$ erfüllt $\\Psi$ die Gleichung $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi$?',
    ctx:{coords:['x', 't'], params:{A:'pos', k:'pos', m:'pos'}, defs:{'Ψ(x,t)':'A e^(i(k x - ω t))'}, unknowns:{ω:{ref:'ħ k^2/(2m)'}}},
    lines:[
      {l:'iħ ∂Ψ/∂t = iħ (-iω) Ψ', why:{q:'Woher kommt der Faktor $-i\\omega$?', opts:['Ableitung des Exponenten $i(kx - \\omega t)$ nach $t$', 'Aus der Normierung der ebenen Welle $\\Psi$', 'Aus dem Impulsoperator $\\hat p = -i\\hbar\\,d/dx$'], a:0, ex:'$\\partial_t e^{i(kx-\\omega t)} = -i\\omega\\,e^{i(kx-\\omega t)}$.'}},
      {l:'= ħω Ψ', why:{q:'Warum wird daraus $\\hbar\\omega\\Psi$?', opts:['$i\\cdot(-i) = 1$', '$i^2 = 1$', 'Weil $\\Psi$ reell ist'], a:0, ex:'$i\\hbar\\cdot(-i\\omega) = -i^2\\hbar\\omega = \\hbar\\omega$.'}},
      {l:'-ħ^2/(2m) ∂^2Ψ/∂x^2 = -ħ^2/(2m) (ik)^2 Ψ', why:{q:'Woher kommt $(ik)^2$?', opts:['Zweimal nach $x$ ableiten gibt zweimal den Faktor $ik$.', 'Aus der Zeitableitung, die $-i\\omega$ liefert', 'Aus dem Quadrat der Normierungskonstante $A$'], a:0, ex:'Jede Ableitung nach $x$ liefert den Faktor $ik$.'}},
      {l:'= ħ^2 k^2/(2m) Ψ', why:{q:'Was ist $-(ik)^2$?', opts:['$k^2$', '$-k^2$', '$ik^2$'], a:0, ex:'$(ik)^2 = -k^2$, mit dem Minus davor also $+k^2$.'}},
      {l:'ħω = ħ^2 k^2/(2m)', why:{q:'Warum müssen die Vorfaktoren gleich sein?', opts:['Beide Seiten sind Vielfache derselben Funktion $\\Psi \\ne 0$.', 'Weil Energie und Impuls immer gleich groß sind.', 'Weil $\\Psi$ an jeder Stelle den Betrag 1 hat.'], a:0, ex:'$\\hbar\\omega\\Psi = \\frac{\\hbar^2k^2}{2m}\\Psi$ für alle $x, t$ geht nur, wenn die Faktoren übereinstimmen.'}},
      {l:'ω = ħ k^2/(2m)', w:'Dispersionsrelation', why:{q:'Was bedeutet $\\hbar\\omega = \\hbar^2k^2/2m$ physikalisch?', opts:['$E = p^2/2m$ mit $E = \\hbar\\omega$, $p = \\hbar k$', '$E = pc$ mit $E = \\hbar\\omega$, $p = \\hbar k$', 'Die Welle ist stehend und trägt keinen Impuls.'], a:0, ex:'Mit de Broglie und Planck–Einstein ist das genau die klassische kinetische Energie.'}}
    ],
    faded:{id:'sg-fade', title:'Jetzt du: Dichte eines stationären Zustands',
      text:'Im Kasten ist $\\Psi(x,t) = \\sqrt{2/L}\\,\\sin(\\pi x/L)\\,e^{-iE_1t/\\hbar}$. Zeige, dass $|\\Psi|^2$ nicht von $t$ abhängt.',
      ctx:{coords:['x', 't'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', 'E_1':'pos'}, defs:{'Ψ(x,t)':'sqrt(2/L) sin(π x/L) e^(-i E_1 t/ħ)'}},
      given:['|Ψ(x,t)|^2 = Ψ^* Ψ', '= 2/L sin(πx/L)^2 e^(iE_1 t/ħ) e^(-iE_1 t/ħ)'],
      goals:[{id:'a', prompt:'Vereinfache bis zum Ende.', type:'value', target:'2/L sin(π x/L)^2', points:2, hints:['Was bleibt vom Produkt der beiden Phasenfaktoren übrig?', '$e^{a}e^{-a} = e^0 = 1$.'],
        model:['|Ψ(x,t)|^2 = Ψ^* Ψ', '= 2/L sin(πx/L)^2 e^(iE_1 t/ħ) e^(-iE_1 t/ħ)', {l:'= 2/L sin(πx/L)^2', gap:'= ▢'}]}]}
  },
  puzzle:{
    title:'Ein Potential, das Teilchen verschluckt',
    text:'Instabile Teilchen oder Teilchen, die in einem Material absorbiert werden, beschreibt man manchmal mit einem komplexen Potential $V(x) = V_r(x) - iW$. Dabei ist $V_r$ reell und $W > 0$ eine Konstante.\n\nWas passiert dann mit $N(t) = \\int_{-\\infty}^{\\infty}|\\Psi|^2dx$? Rechne wie beim Beweis der Normierungserhaltung in Thema 1, aber lass die $V$-Terme stehen. Nach welcher Zeit $\\tau$ ist $N$ von $1$ auf $1/e$ gefallen?',
    q:{q:'Deine Vermutung:', opts:['$N = e^{-2W t/\\hbar}$, also $\\tau = \\hbar/(2W)$', '$N = e^{-W t/\\hbar}$, also $\\tau = \\hbar/W$', '$N = 1$, weil sich die $V$-Terme wie immer wegheben', '$N = 1 - 2W t/\\hbar$, also linear fallend'], a:0, ex:'$\\frac{dN}{dt} = -\\frac{2W}{\\hbar}N$.'},
    reveal:'Wie in Thema 1: $\\frac{dN}{dt} = \\int(\\Psi^*\\partial_t\\Psi + \\Psi\\,\\partial_t\\Psi^*)\\,dx$. Die Terme mit $\\partial_x^2$ ergeben wieder einen Randterm, der verschwindet. Von den Potentialtermen bleibt diesmal etwas übrig, weil $V^* = V_r + iW \\ne V$ ist:\n\n$$\\frac{dN}{dt} = -\\frac{i}{\\hbar}\\int(V - V^*)\\,|\\Psi|^2dx = -\\frac{i}{\\hbar}(-2iW)\\,N = -\\frac{2W}{\\hbar}N.$$\n\nAlso ist $N(t) = e^{-2W t/\\hbar}$ mit der Lebensdauer $\\tau = \\hbar/(2W)$. Die Faktoren zählen: Die *Amplitude* fällt wie $e^{-W t/\\hbar}$, die *Wahrscheinlichkeit* wie das Quadrat.\n\nZwei Folgerungen:\n\n- Ein Separationsansatz liefert jetzt $\\Psi = \\psi(x)\\,e^{-i(E - iW)t/\\hbar}$: Die Energie ist formal komplex. Das passt zum Abschnitt über die Separation: Ein komplexes $E$ zerstört die Normierung – hier ist genau das gewollt.\n- Ein Zustand, der so zerfällt, hat keine scharfe Energie. Zerlegt man $e^{-iEt/\\hbar}e^{-W t/\\hbar}$ in Frequenzen (Fourier, M6), erhält man eine Verteilung um $E$ mit der vollen Halbwertsbreite $2W = \\hbar/\\tau$ (Thema 6 nennt diese Breite $\\Gamma$). Das ist die natürliche Linienbreite einer Spektrallinie: Je kurzlebiger ein Zustand, desto breiter die Linie.\n\nDas Modell beschreibt nur, dass Teilchen verschwinden, nicht wohin. Es ist eine effektive Beschreibung, keine fundamentale Schrödingergleichung.'
  },
  clarify:{
    core:'Die Zeitentwicklung bestimmt die **zeitabhängige Schrödingergleichung**\n\n$$i\\hbar\\frac{\\partial\\Psi}{\\partial t} = \\hat H\\Psi,\\qquad \\hat H = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2} + V(x).$$\n\nSie ist nicht herleitbar, aber plausibel: Für eine ebene Welle mit $E = \\hbar\\omega$ und $p = \\hbar k$ ergibt sie $E = p^2/2m$. Ist $V$ zeitunabhängig, führt der Ansatz $\\Psi = \\psi(x)\\,e^{-iEt/\\hbar}$ auf die **stationäre** Gleichung $\\hat H\\psi = E\\psi$. In einem stationären Zustand hängen $|\\Psi|^2$ und alle Erwartungswerte nicht von $t$ ab, und die Energie ist scharf. Die allgemeine Lösung ist eine Überlagerung $\\Psi = \\sum_n c_n\\psi_n e^{-iE_nt/\\hbar}$; sie ist nicht stationär, wenn verschiedene Energien beteiligt sind.\n\nDie Wahrscheinlichkeit „fließt“ mit der Stromdichte $j = \\frac{\\hbar}{2mi}\\left(\\Psi^*\\partial_x\\Psi - \\Psi\\,\\partial_x\\Psi^*\\right)$, und es gilt die Kontinuitätsgleichung $\\partial_t|\\Psi|^2 + \\partial_x j = 0$. Daraus folgt: Die Normierung bleibt erhalten.',
    keys:[
      'Der Zeitfaktor heißt $e^{-iEt/\\hbar}$ mit Minus. Das Vorzeichen ist durch $i\\hbar\\partial_t$ festgelegt.',
      'Stationär heißt nicht „das Teilchen ruht“, sondern „die Wahrscheinlichkeitsverteilung ändert sich nicht“.',
      '$\\hat H\\psi = E\\psi$ gilt nur für Energie-Eigenfunktionen; $i\\hbar\\partial_t\\Psi = \\hat H\\Psi$ gilt für jeden Zustand.',
      'Jeder Summand einer Überlagerung bekommt seinen eigenen Phasenfaktor $e^{-iE_nt/\\hbar}$.',
      'Für reelle $\\psi$ (zeitunabhängig) ist $j = 0$. Strom braucht eine ortsabhängige Phase, etwa $e^{ikx}$.',
      'Bei der Kontinuitätsgleichung setzt man die Schrödingergleichung für $\\partial_t\\Psi$ und ihr komplex Konjugiertes für $\\partial_t\\Psi^*$ ein; $V$ muss dafür reell sein.'
    ],
    errors:[
      'Einen gemeinsamen Faktor $e^{-iEt/\\hbar}$ vor eine Überlagerung verschiedener Energien schreiben.',
      '$\\partial_t\\Psi^*$ mit demselben Vorzeichen wie $\\partial_t\\Psi$ einsetzen: Beim Konjugieren wird $i \\to -i$.',
      'Glauben, nur Energie-Eigenzustände seien erlaubte Zustände, oder jeder Zustand erfülle $\\hat H\\psi = E\\psi$.',
      'Die Einheit von $j$ in einer Dimension vergessen: $1/\\mathrm{s}$ (Wahrscheinlichkeit pro Zeit).'
    ],
    more:[{title:'Warum ist $E$ reell?', text:'Setzt man $E = E_0 + i\\Gamma$ ein, wird $|\\Psi|^2 \\propto e^{2\\Gamma t/\\hbar}$. Dann könnte die Normierung nicht erhalten bleiben. Normierbare Lösungen gehören deshalb zu reellen Energien.'}],
    checks:[
      {q:'$\\Psi(x,t) = \\psi_1(x)e^{-iE_1t/\\hbar}$. Wie hängt $\\langle x\\rangle$ von der Zeit ab?', opts:['gar nicht', 'wie $\\cos(E_1t/\\hbar)$', 'linear in $t$'], a:0, ex:'Im Integral $\\int\\Psi^*x\\Psi\\,dx$ heben sich die Phasenfaktoren weg.'},
      {q:'Welches Vorzeichen hat die Stromdichte für $\\psi = e^{-ikx}$ mit $k > 0$?', opts:['negativ: der Strom fließt nach links', 'positiv: der Strom fließt nach rechts', 'null: eine reine Phase trägt keinen Strom'], a:0, ex:'$j = \\frac{\\hbar}{2mi}(\\psi^*\\psi\' - \\psi\\psi^{*\\prime}) = -\\hbar k/m$.'}
    ]
  },
  lab:{type:'twostate', sketch:SK.lab, title:'Überlagerung zweier Zustände im Kasten',
    text:'Die Kurve ist $|\\Psi(x,t)|^2$ für $\\Psi = c_1\\psi_1e^{-iE_1t/\\hbar} + c_2\\psi_2e^{-iE_2t/\\hbar}$. Stelle den Anteil $|c_1|^2$ ein und lass die Zeit laufen.',
    map:[
      {sym:R`|c_1|^2`, ctl:'Anteil |c₁|²', says:R`Gewicht von $\psi_1$ in $\Psi = c_1\psi_1e^{-iE_1t/\hbar} + c_2\psi_2e^{-iE_2t/\hbar}$; das Labor setzt $|c_2|^2 = 1 - |c_1|^2$ und nimmt beide $c_n$ reell und positiv. Bei $0$ oder $1$ ist der Zustand stationär. Die Stärke des Schwappens ist $2|c_1c_2|$.`},
      {sym:R`t/T,\quad T = \frac{2\pi\hbar}{E_2 - E_1}`, ctl:'Zeit t (in Perioden T)', says:R`Die Zeit in Vielfachen der Periode des Mischterms. Bei $t = 0$, $1$, $2$ sieht die Dichte gleich aus, bei $t = 0{,}5$ ist sie für $\psi_1 + \psi_2$ gespiegelt.`},
      {sym:R`e^{-iE_nt/\hbar}`, ctl:'Abspielen', says:R`Lässt die Zeit laufen. Jeder Anteil dreht seine Phase mit seiner eigenen Energie; sichtbar wird nur der Unterschied $(E_2 - E_1)t/\hbar$ im Mischterm.`},
      {sym:R`\psi_2\ \text{oder}\ \psi_3`, ctl:'Zweiter Zustand', says:R`Wählt den zweiten Anteil. Mit $\psi_3$ ist die Periode $2\pi\hbar/(E_3 - E_1) = 2\pi\hbar/(8E_1)$, und weil $\psi_1$ und $\psi_3$ beide symmetrisch zur Mitte sind, bleibt $\langle x\rangle = L/2$.`},
      {sym:R`|\Psi(x,t)|^2`, ctl:'|Ψ(x,t)|² · L', says:R`Die Kurve ist die Dichte $\tfrac12(\psi_1^2 + \psi_2^2) + \psi_1\psi_2\cos\frac{(E_2 - E_1)t}{\hbar}$ für $|c_1|^2 = \tfrac12$, mal $L$ genommen.`},
      {sym:R`\langle x\rangle`, ctl:'⟨x⟩', says:R`Die rote Linie ist $\langle x\rangle(t)$. Für $\psi_1 + \psi_2$ pendelt sie zwischen $0{,}32L$ und $0{,}68L$.`},
      {sym:R`\hat H\psi = E\psi`, ctl:'stationär: Dichte bleibt gleich', says:R`Diese Anzeige erscheint bei $|c_1|^2 = 0$ oder $1$: Dann ist nur ein Energie-Eigenzustand beteiligt, und der Zeitfaktor fällt im Betragsquadrat weg.`},
      {sym:R`x/L`, ctl:'x / L', says:R`Der Ort in Einheiten der Kastenbreite; bei $0$ und $1$ sind die Wände.`}
    ],
    predict:{q:'Vorhersage: Du stellst $|c_1|^2 = 0{,}9$ statt $0{,}5$ ein. Wie schwappt die Dichte dann?', opts:['schwächer, aber mit derselben Periode', 'genauso stark und mit derselben Periode', 'genauso stark, aber deutlich schneller', 'gar nicht mehr, weil $\\psi_1$ überwiegt'], a:0, ex:'Die Amplitude des Mischterms ist $2|c_1c_2|$: bei $0{,}5/0{,}5$ gleich $1$, bei $0{,}9/0{,}1$ nur $0{,}6$. Die Periode hängt nur von $E_2 - E_1$ ab.'},
    questions:[
      {q:'Stelle $|c_1|^2 = 1$ ein und spiele die Animation ab. Was passiert?', opts:['Nichts: die Dichte bleibt gleich.', 'Die Dichte schwappt hin und her.', 'Die Dichte wird langsam breiter.'], a:0, ex:'Ein einzelner Energie-Eigenzustand ist stationär.'},
      {q:'Stelle $|c_1|^2 = 0{,}5$ ein. Nach welcher Zeit sieht die Dichte zum ersten Mal wieder aus wie bei $t = 0$?', opts:['nach $T = 2\\pi\\hbar/(E_2 - E_1)$', 'nach $T = 2\\pi\\hbar/E_1$', 'nach $T = 2\\pi\\hbar/(E_1 + E_2)$'], a:0, ex:'Nur der Mischterm hängt von $t$ ab, und zwar über $\\cos((E_2 - E_1)t/\\hbar)$.'},
      {q:'Stelle $|c_1|^2 = 0{,}9$ ein. Wie weit wandert $\\langle x\\rangle$ jetzt im Vergleich zu $|c_1|^2 = 0{,}5$?', opts:['weniger weit, etwa auf $0{,}6$ der Strecke', 'genauso weit wie bei $0{,}5$', 'weiter, weil $\\psi_1$ stärker ist'], a:0, ex:'Die Auslenkung von $\\langle x\\rangle$ ist proportional zu $2|c_1c_2| = 2\\sqrt{0{,}9\\cdot0{,}1} = 0{,}6$.'}
    ],
    noPic:{q:'Ohne Bild: Im Kasten überlagert man $\\psi_1$ und $\\psi_3$. Mit welcher Periode schwappt die Dichte? ($E_n = n^2E_1$)', opts:['$T = \\pi\\hbar/(4E_1)$', '$T = 2\\pi\\hbar/(3E_1)$', '$T = \\pi\\hbar/(8E_1)$'], a:0, ex:'$E_3 - E_1 = 8E_1$, also $T = 2\\pi\\hbar/(8E_1) = \\pi\\hbar/(4E_1)$.'}},
  compare:{
    text:'Gesucht ist die Stromdichte für $\\psi(x) = A\\,e^{ikx}$ (mit reellem $A$). Zwei richtige Wege:',
    ctx:{coords:['x'], params:{A:'pos', k:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x)'}},
    A:{name:'Definition der Stromdichte', model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) (A^2 i k + A^2 i k)', '= ħ k A^2/m']},
    B:{name:'Realteil von ψ* p̂ψ / m', text:'Es gilt allgemein $j = \\frac1m\\operatorname{Re}\\left(\\psi^*\\hat p\\psi\\right)$.', model:['j = 1/m Re(ψ^* (-iħ) ψ\')', '= 1/m Re(ħ k A^2)', '= ħ k A^2/m']},
    questions:[
      {q:'Was bedeutet das Ergebnis $j = |A|^2\\hbar k/m$?', opts:['Dichte $|A|^2$ mal Geschwindigkeit $v = \\hbar k/m$', 'die Energie, die pro Zeit vorbeifließt', 'die Wahrscheinlichkeit, das Teilchen bei $x$ zu finden'], a:0, ex:'Wie bei einer Strömung: Strom = Dichte × Geschwindigkeit.'},
      {q:'Wann ist Weg B bequemer?', opts:['wenn $\\hat p\\psi$ leicht zu berechnen ist, etwa bei $e^{ikx}$', 'nur bei reellen Funktionen, für die $j = 0$ ist', 'nie, weil man den Realteil extra bilden muss'], a:0, ex:'Für $\\psi = Ae^{ikx}$ ist $\\hat p\\psi = \\hbar k\\psi$; dann ist $j$ sofort $\\hbar k|A|^2/m$.'}
    ]
  },
  concept:[
    {id:'sg-k1', type:'mc2', seg:'sg-t3', q:'Im Kasten ist $\\Psi(x,0) = A\\,x(L-x)$. Ist das ein stationärer Zustand?', opts:['Nein, seine Dichte ändert sich mit der Zeit.', 'Ja, denn er erfüllt die Randbedingungen.', 'Ja, denn er ist normiert und reell.'], a:0, ex:'Es gibt kein $E$ mit $\\hat H\\Psi = E\\Psi$.',
      reason:{q:'Warum?', opts:['$\\hat H\\Psi = \\hbar^2A/m$ ist konstant, also kein Vielfaches von $\\Psi$.', 'Jede Funktion, die bei $0$ und $L$ verschwindet, ist stationär.', 'Reelle Funktionen tragen keinen Strom, also ändert sich nichts.'], a:0, ex:'Randbedingungen und Normierung reichen nicht. Und $j = 0$ zur Zeit $t = 0$ heißt nur, dass sich die Dichte in diesem Moment nicht ändert – später schon (Styer 1996 und Singh & Marshman 2015 beschreiben „jeder Zustand ist stationär“ als häufige Fehlvorstellung).'}},
    {id:'sg-k2', type:'dialog', seg:'sg-t2', text:'Zwei Studierende sprechen über die beiden Schrödingergleichungen.',
      people:[{name:'Lena', says:'$i\\hbar\\,\\partial_t\\Psi = \\hat H\\Psi$ gilt für jeden Zustand. $\\hat H\\psi = E\\psi$ gilt nur für besondere Zustände, die Energie-Eigenzustände.'}, {name:'Jonas', says:'Auch $\\hat H\\psi = E\\psi$ gilt für jeden Zustand. Man muss nur $E$ passend wählen, nämlich $E = \\langle H\\rangle$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Für $\\Psi = (\\psi_1 + \\psi_2)/\\sqrt2$ ist $\\hat H\\Psi = (E_1\\psi_1 + E_2\\psi_2)/\\sqrt2$ – kein Vielfaches von $\\Psi$, auch nicht $\\langle H\\rangle\\Psi$. Die stationäre Gleichung ist eine Eigenwertgleichung, die nur besondere Funktionen erfüllen.'},
    {id:'sg-k3', type:'mc', seg:'sg-t3', q:'Ein Teilchen ist im Grundzustand des Kastens, einem stationären Zustand. Was gilt?', opts:['Seine Ortsverteilung ist konstant, aber $\\langle p^2\\rangle > 0$.', 'Das Teilchen ruht, deshalb ist auch $\\langle p^2\\rangle = 0$.', 'Das Teilchen ruht in der Mitte des Kastens bei $L/2$.'], a:0, ex:'$\\langle p\\rangle = 0$, aber $\\langle p^2\\rangle = (\\pi\\hbar/L)^2 = 2mE_1 > 0$. Stationär ist die Verteilung, nicht das Teilchen.'},
    {id:'sg-k4', type:'mc2', seg:'sg-t5', q:'Vergleiche bei $t = 0$ die Zustände $\\Psi_\\pm = (\\psi_1 \\pm \\psi_2)/\\sqrt2$ im Kasten. Haben sie dieselbe Ortsverteilung?', opts:['Nein: $\\Psi_+$ liegt mehr links, $\\Psi_-$ mehr rechts.', 'Ja, denn ein Vorzeichen ist nur eine Phase.', 'Ja, denn beide haben $|c_1|^2 = |c_2|^2 = 1/2$.'], a:0, ex:'$|\\Psi_\\pm|^2 = \\tfrac12(\\psi_1^2 + \\psi_2^2) \\pm \\psi_1\\psi_2$; links ist $\\psi_1\\psi_2 > 0$.',
      reason:{q:'Warum?', opts:['Eine relative Phase zwischen den Anteilen ändert den Mischterm.', 'Eine globale Phase verschiebt die Dichte nach links oder rechts.', 'Das Minuszeichen ändert die Energien der beiden Anteile.'], a:0, ex:'Nur eine globale Phase vor dem ganzen Zustand ist unbeobachtbar. Das Vorzeichen vor $\\psi_2$ ist eine relative Phase $e^{i\\pi}$.'}},
    {id:'sg-k5', type:'dialog', seg:'sg-t6', text:'Es geht um den Zustand $\\Psi = A\\,e^{ikx}e^{-iEt/\\hbar}$ mit $E = \\hbar^2k^2/2m$ und $k > 0$.',
      people:[{name:'Lena', says:'Das ist ein stationärer Zustand. Also fließt auch nichts: $j = 0$.'}, {name:'Jonas', says:'Die Dichte ist konstant, aber es fließt ein Strom $j = \\hbar k|A|^2/m$, überall gleich groß.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Aus $\\partial_t|\\Psi|^2 = 0$ folgt mit der Kontinuitätsgleichung nur $\\partial_xj = 0$, also $j$ konstant. Ein konstanter Strom ändert die Dichte nirgends: Was an einer Stelle hineinfließt, fließt auch wieder hinaus.'},
    {id:'sg-k6', type:'mc', seg:'sg-t5', q:'Im Zustand $(\\psi_1e^{-iE_1t/\\hbar} + \\psi_2e^{-iE_2t/\\hbar})/\\sqrt2$ schwingt $\\langle x\\rangle$. Wie verhält sich $\\langle H\\rangle$?', opts:['Es bleibt konstant bei $(E_1 + E_2)/2$.', 'Es schwingt mit derselben Frequenz wie $\\langle x\\rangle$.', 'Es springt zwischen $E_1$ und $E_2$ hin und her.'], a:0, ex:'$\\langle H\\rangle = \\sum_n|c_n|^2E_n$, und die $|c_n|^2$ hängen nicht von $t$ ab. Die Mischterme verschwinden, weil $\\hat H\\psi_2 = E_2\\psi_2$ und $\\int\\psi_1\\psi_2\\,dx = 0$ ist (Orthogonalität, Thema 3).'}
  ],
  practice:[
    {id:'sg-p1', title:'Grundzustand im Kasten löst die Schrödingergleichung',
      text:'Im Kasten ($V = 0$ für $0 < x < L$) ist $\\Psi(x,t) = \\sqrt{2/L}\\,\\sin(\\pi x/L)\\,e^{-iE_1t/\\hbar}$ mit $E_1 = \\frac{\\pi^2\\hbar^2}{2mL^2}$.',
      ctx:{coords:['x', 't'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:{'E_1':'π^2 ħ^2/(2m L^2)', 'Ψ(x,t)':'sqrt(2/L) sin(π x/L) e^(-i E_1 t/ħ)'}},
      goals:[
        {id:'a', prompt:'Zeige: $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi$.', type:'show', from:'iħ ∂Ψ/∂t', to:'-ħ^2/(2m) ∂^2Ψ/∂x^2', points:3,
          hints:['Rechne beide Seiten getrennt aus und vergleiche die Vorfaktoren vor $\\Psi$.', '$\\partial_te^{-iE_1t/\\hbar} = -\\frac{iE_1}{\\hbar}e^{-iE_1t/\\hbar}$ und $\\partial_x^2\\sin(\\pi x/L) = -(\\pi/L)^2\\sin(\\pi x/L)$.', 'Links steht $E_1\\Psi$, rechts $\\frac{\\hbar^2\\pi^2}{2mL^2}\\Psi$. Setze $E_1$ ein.'],
          model:['iħ ∂Ψ/∂t = iħ (-i E_1/ħ) Ψ', '= E_1 Ψ', '= π^2 ħ^2/(2m L^2) Ψ', '= -ħ^2/(2m) ∂^2Ψ/∂x^2']}
      ]},
    {id:'sg-p2', title:'Überlagerung: schwappender Erwartungswert',
      text:'Im Kasten ist $\\Psi(x,t) = \\frac{1}{\\sqrt2}\\left(\\psi_1(x)e^{-iE_1t/\\hbar} + \\psi_2(x)e^{-iE_2t/\\hbar}\\right)$ mit $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$ und $E_n = n^2\\pi^2\\hbar^2/(2mL^2)$. Es gilt $\\int_0^L x\\,\\psi_n^2\\,dx = L/2$.',
      ctx:BOX2({defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)', 'Ψ(x,t)':'1/sqrt(2) (ψ_1(x) e^(-i E_1 t/ħ) + ψ_2(x) e^(-i E_2 t/ħ))'}, state:'Ψ', normalized:true, unknowns:{T:{ref:'2πħ/(E_2 - E_1)'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle x\\rangle(t)$.', type:'value', target:'L/2 - 16L/(9π^2) cos((E_2 - E_1) t/ħ)', points:3, ph:'⟨x⟩ = ∫_0^L x |Ψ|^2 dx',
          hints:['Setze $\\Psi$ in $\\langle x\\rangle = \\int_0^L x\\,|\\Psi|^2dx$ ein und multipliziere aus: zwei Diagonal- und zwei Mischterme.', 'Diagonalterme: zusammen $\\tfrac12(L/2 + L/2) = L/2$. Mischterme: zusammen $\\int_0^L x\\,\\psi_1\\psi_2\\,dx\\cdot\\cos((E_2 - E_1)t/\\hbar)$, weil die $\\psi_n$ reell sind.', '$\\frac2L\\int_0^L x\\sin(\\pi x/L)\\sin(2\\pi x/L)dx = -\\frac{16L}{9\\pi^2}$.'],
          model:['⟨x⟩ = ∫_0^L x |Ψ|^2 dx', '= L/2 + 2/L ∫_0^L x sin(πx/L) sin(2πx/L) dx · cos((E_2 - E_1)t/ħ)', '= L/2 - 16L/(9π^2) cos((E_2 - E_1)t/ħ)']},
        {id:'b', prompt:'b) Nach welcher Zeit $T$ wiederholt sich die Bewegung? Gib $T$ durch $m, L, \\hbar$ an.', type:'solve', unknown:'T', points:2, ph:'(E_2 - E_1) T/ħ = 2π',
          hints:['Die Bewegung wiederholt sich, wenn das Argument des Kosinus um $2\\pi$ gewachsen ist.', '$(E_2 - E_1)T/\\hbar = 2\\pi$.', '$E_2 - E_1 = 3\\pi^2\\hbar^2/(2mL^2)$.'],
          model:['(E_2 - E_1) T/ħ = 2π', 'T = 2πħ/(E_2 - E_1)', 'T = 4m L^2/(3πħ)']}
      ]},
    {id:'sg-p3', title:'Stromdichte einer Überlagerung von hin- und rücklaufender Welle',
      text:'$\\psi(x) = A\\,e^{ikx} + B\\,e^{-ikx}$ mit reellen $A, B$ und $k > 0$.',
      ctx:{coords:['x'], params:{A:'pos', B:'pos', k:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x) + B e^(-i k x)'}},
      goals:[
        {id:'a', prompt:'Berechne $j = \\frac{\\hbar}{2mi}\\left(\\psi^*\\psi\' - \\psi\\,(\\psi^*)\'\\right)$.', type:'value', target:'ħ k (A^2 - B^2)/m', points:3, ph:'j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')',
          hints:['Berechne $\\psi\'$, $\\psi^*$ und $(\\psi^*)\'$ und setze in die Definition ein.', '$\\psi\' = ik(Ae^{ikx} - Be^{-ikx})$ und $\\psi^* = Ae^{-ikx} + Be^{ikx}$.', 'Die Mischterme mit $e^{\\pm 2ikx}$ heben sich in der Differenz weg; es bleibt $2ik(A^2 - B^2)$.'],
          model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) · 2i k (A^2 - B^2)', '= ħ k (A^2 - B^2)/m'],
          note:'Hinlaufender Strom minus rücklaufender Strom – die Interferenz trägt nichts zum Strom bei. Das braucht man in Thema 5 für Reflexion und Transmission.'}
      ]},
    {id:'sg-p4', title:'Herleitung der Kontinuitätsgleichung',
      text:'$\\Psi(x,t)$ erfüllt $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi + V\\Psi$ mit reellem $V(x)$. Für $\\partial_t\\Psi$ setzt die App beim Prüfen die Schrödingergleichung ein.',
      ctx:DYN(),
      goals:[
        {id:'a', prompt:'Zeige: $\\partial_t|\\Psi|^2 = -\\partial_x j$ mit $j = \\frac{\\hbar}{2mi}(\\Psi^*\\partial_x\\Psi - \\Psi\\,\\partial_x\\Psi^*)$.', type:'show', from:'∂/∂t |Ψ|^2', to:'-∂/∂x (ħ/(2m i) (Ψ^* ∂Ψ/∂x - Ψ ∂Ψ^*/∂x))', points:4, minSteps:3,
          hints:['Ziel: $\\partial_t|\\Psi|^2$ als Ableitung nach $x$ schreiben. Beginne mit der Produktregel und ersetze dann die Zeitableitungen.', 'Produktregel $\\partial_t(\\Psi^*\\Psi) = \\Psi^*\\partial_t\\Psi + \\Psi\\,\\partial_t\\Psi^*$; dann $\\partial_t\\Psi = \\frac{i\\hbar}{2m}\\partial_x^2\\Psi - \\frac{i}{\\hbar}V\\Psi$ und für $\\partial_t\\Psi^*$ das komplex Konjugierte.', 'Die $V$-Terme heben sich weg. Dann: $\\Psi^*\\Psi\'\' - \\Psi\\Psi^{*\\prime\\prime} = \\partial_x(\\Psi^*\\Psi\' - \\Psi\\Psi^{*\\prime})$.'],
          model:['∂/∂t |Ψ|^2 = Ψ^* ∂Ψ/∂t + Ψ ∂Ψ^*/∂t', '= Ψ^* (iħ/(2m) ∂^2Ψ/∂x^2 - i/ħ V Ψ) + Ψ (-iħ/(2m) ∂^2Ψ^*/∂x^2 + i/ħ V Ψ^*)', '= iħ/(2m) (Ψ^* ∂^2Ψ/∂x^2 - Ψ ∂^2Ψ^*/∂x^2)', '= -∂/∂x (ħ/(2m i) (Ψ^* ∂Ψ/∂x - Ψ ∂Ψ^*/∂x))'],
          mistakes:[{expr:'Ψ^* (iħ/(2m) ∂^2Ψ/∂x^2 - i/ħ V Ψ) + Ψ (iħ/(2m) ∂^2Ψ^*/∂x^2 - i/ħ V Ψ^*)', msg:'Beim Konjugieren der Schrödingergleichung wird $i \\to -i$: $\\partial_t\\Psi^* = -\\frac{i\\hbar}{2m}\\partial_x^2\\Psi^* + \\frac{i}{\\hbar}V\\Psi^*$.'}]}
      ]},
    {id:'sg-p5', title:'Die Normierung bleibt erhalten',
      text:'Wie in Aufgabe 4 erfüllt $\\Psi$ die Schrödingergleichung; außerdem fällt $\\Psi$ für $|x|\\to\\infty$ schnell ab. Benutze die Kontinuitätsgleichung.',
      ctx:DYN(),
      goals:[
        {id:'a', prompt:'Zeige: $\\frac{d}{dt}\\int_{-\\infty}^\\infty|\\Psi|^2dx = 0$.', type:'show', from:'d/dt ∫_-∞^∞ |Ψ|^2 dx', to:'0', points:3, minSteps:3,
          hints:['Ziehe die Zeitableitung ins Integral und benutze die Kontinuitätsgleichung.', 'Ein Integral über eine Ableitung ist ein Randterm: $\\int_{-\\infty}^\\infty\\partial_xj\\,dx = [j]_{-\\infty}^{\\infty}$.', '$j \\to 0$ für $|x|\\to\\infty$, weil $\\Psi$ dort schnell abfällt.'],
          model:['d/dt ∫_-∞^∞ |Ψ|^2 dx = ∫_-∞^∞ ∂/∂t |Ψ|^2 dx', '= -∫_-∞^∞ ∂/∂x (ħ/(2m i) (Ψ^* ∂Ψ/∂x - Ψ ∂Ψ^*/∂x)) dx', {l:'= 0', w:'j → 0 für |x| → ∞'}]}
      ]}
  ],
  sketch:[SK.s1],
  final:[
    {aim:0, task:{id:'sg-f1', title:'Energie aus der Schrödingergleichung', text:'Im Kasten ($V = 0$ für $0 < x < L$) ist $\\Psi(x,t) = \\sqrt{2/L}\\,\\sin(3\\pi x/L)\\,e^{-iEt/\\hbar}$.',
      ctx:{coords:['x', 't'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:{'Ψ(x,t)':'sqrt(2/L) sin(3π x/L) e^(-i E t/ħ)'}, unknowns:{E:{ref:'9π^2 ħ^2/(2m L^2)'}}},
      goals:[{id:'a', prompt:'Für welches $E$ löst $\\Psi$ die zeitabhängige Schrödingergleichung?', type:'solve', unknown:'E', points:3, model:['iħ ∂Ψ/∂t = -ħ^2/(2m) ∂^2Ψ/∂x^2', 'E Ψ = 9π^2 ħ^2/(2m L^2) Ψ', 'E = 9π^2 ħ^2/(2m L^2)']}]}},
    {aim:1, task:{id:'sg-f2', title:'Periode', text:'Im Kasten überlagert man $\\psi_1$ und $\\psi_3$, mit $E_n = n^2\\pi^2\\hbar^2/(2mL^2)$.',
      ctx:BOX2({unknowns:{T:{ref:'2πħ/(E_3 - E_1)'}}}),
      goals:[{id:'a', prompt:'Bestimme die Periode $T$ der Dichte durch $m, L, \\hbar$.', type:'solve', unknown:'T', points:2, model:['T = 2πħ/(E_3 - E_1)', 'T = m L^2/(2πħ)']}]}},
    {aim:2, task:{id:'sg-f3', title:'Stromdichte', text:'$\\psi(x) = A\\,e^{ikx}e^{-x^2/(2\\sigma^2)}$ mit reellem $A$, $k > 0$ und $\\sigma > 0$.',
      ctx:{coords:['x'], params:{A:'pos', k:'pos', σ:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x) e^(-x^2/(2σ^2))'}},
      goals:[{id:'a', prompt:'Berechne $j(x)$.', type:'value', target:'ħ k A^2 e^(-x^2/σ^2)/m', points:3, model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) · 2i k A^2 e^(-x^2/σ^2)', '= ħ k A^2 e^(-x^2/σ^2)/m']}]}},
    {aim:1, sketch:SK.fA},
    {aim:'k', id:'sg-fk1', type:'mc2', q:'$\\Psi(x,0) = (\\psi_1 + \\psi_2)/\\sqrt2$ im Kasten. Ist $\\Psi(x,t) = \\Psi(x,0)\\,e^{-i(E_1 + E_2)t/(2\\hbar)}$ richtig?', opts:['Nein, jeder Anteil braucht seinen eigenen Faktor.', 'Ja, mit der mittleren Energie im Exponenten.', 'Ja, aber nur für kurze Zeiten $t \\ll \\hbar/E_1$.'], a:0, ex:'Richtig ist $\\frac{1}{\\sqrt2}(\\psi_1e^{-iE_1t/\\hbar} + \\psi_2e^{-iE_2t/\\hbar})$.',
      reason:{q:'Warum?', opts:['Mit nur einem Faktor löst $\\Psi$ die Schrödingergleichung nicht.', 'Weil man die mittlere Energie $(E_1 + E_2)/2$ nie messen kann.', 'Weil Phasenfaktoren nur vor reellen Funktionen stehen dürfen.'], a:0, ex:'Ein gemeinsamer Zeitfaktor setzt voraus, dass $\\Psi(x,0)$ eine Eigenfunktion von $\\hat H$ ist; hier ist $\\hat H\\Psi(x,0) = (E_1\\psi_1 + E_2\\psi_2)/\\sqrt2$ kein Vielfaches von $\\Psi(x,0)$. Mit ihm bliebe $|\\Psi|^2$ konstant – tatsächlich schwappt die Dichte.'}},
    {aim:'k', id:'sg-fk2', type:'dialog', text:'Ein Teilchen ist im Zustand $\\Psi = \\psi_1(x)\\,e^{-iE_1t/\\hbar}$ im Kasten.',
      people:[{name:'Lena', says:'$\\langle x\\rangle$ hängt nicht von der Zeit ab. Deshalb ist $\\langle p\\rangle = m\\,d\\langle x\\rangle/dt = 0$.'}, {name:'Jonas', says:'Trotzdem hat das Teilchen kinetische Energie, denn $\\langle p^2\\rangle = (\\pi\\hbar/L)^2 > 0$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:2,
      ex:'Beide Aussagen stimmen. Stationär ist die Verteilung: $\\langle x\\rangle$ und $\\langle p\\rangle = 0$ sind konstant. Die Impulsmesswerte streuen aber um null, deshalb ist $\\langle p^2\\rangle = 2mE_1 > 0$.'}
  ],
  finalB:[
    {aim:0, task:{id:'sg-fB1', title:'Energie aus der Schrödingergleichung', text:'Im Kasten $-a < x < a$ (dort $V = 0$) ist $\\Psi(x,t) = \\sqrt{1/a}\\,\\cos\\!\\left(\\frac{\\pi x}{2a}\\right)e^{-iEt/\\hbar}$.',
      ctx:{coords:['x', 't'], domain:{x:['-a', 'a']}, params:{a:'pos', m:'pos'}, defs:{'Ψ(x,t)':'sqrt(1/a) cos(π x/(2a)) e^(-i E t/ħ)'}, unknowns:{E:{ref:'π^2 ħ^2/(8m a^2)'}}},
      goals:[{id:'a', prompt:'Für welches $E$ löst $\\Psi$ die zeitabhängige Schrödingergleichung?', type:'solve', unknown:'E', points:3, model:['iħ ∂Ψ/∂t = -ħ^2/(2m) ∂^2Ψ/∂x^2', 'E Ψ = π^2 ħ^2/(8m a^2) Ψ', 'E = π^2 ħ^2/(8m a^2)']}]}},
    {aim:1, task:{id:'sg-fB2', title:'Periode', text:'Im Kasten $0 < x < L$ überlagert man $\\psi_2$ und $\\psi_3$, mit $E_n = n^2\\pi^2\\hbar^2/(2mL^2)$.',
      ctx:BOX2({unknowns:{T:{ref:'2πħ/(E_3 - E_2)'}}}),
      goals:[{id:'a', prompt:'Bestimme die Periode $T$ der Dichte durch $m, L, \\hbar$.', type:'solve', unknown:'T', points:2, model:['T = 2πħ/(E_3 - E_2)', 'T = 4m L^2/(5πħ)']}]}},
    {aim:2, task:{id:'sg-fB3', title:'Stromdichte', text:'$\\psi(x) = A\\,e^{-ikx}e^{-x^2/(2\\sigma^2)}$ mit reellem $A$, $k > 0$ und $\\sigma > 0$.',
      ctx:{coords:['x'], params:{A:'pos', k:'pos', σ:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(-i k x) e^(-x^2/(2σ^2))'}},
      goals:[{id:'a', prompt:'Berechne $j(x)$.', type:'value', target:'-ħ k A^2 e^(-x^2/σ^2)/m', points:3, model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) · (-2i k) A^2 e^(-x^2/σ^2)', '= -ħ k A^2 e^(-x^2/σ^2)/m']}]}},
    {aim:1, sketch:SK.fB},
    {aim:'k', id:'sg-fBk1', type:'mc2', q:'Im Kasten ist $\\Psi(x,0) = (\\psi_2 - \\psi_3)/\\sqrt2$. Jemand schreibt $\\Psi(x,t) = \\Psi(x,0)\\,e^{-iE_2t/\\hbar}$ und folgert: „$\\langle x\\rangle$ bleibt für alle Zeiten gleich.“ Stimmt die Folgerung?', opts:['Nein: $\\langle x\\rangle$ schwingt mit der Kreisfrequenz $(E_3 - E_2)/\\hbar$.', 'Ja: Mit einem gemeinsamen Faktor bleibt $|\\Psi|^2$ konstant.', 'Ja, weil $\\psi_2$ und $\\psi_3$ beide stationär sind.'], a:0, ex:'Richtig ist $\\Psi(x,t) = \\frac{1}{\\sqrt2}\\left(\\psi_2e^{-iE_2t/\\hbar} - \\psi_3e^{-iE_3t/\\hbar}\\right)$; im Mischterm bleibt $\\cos((E_3 - E_2)t/\\hbar)$ stehen.',
      reason:{q:'Warum?', opts:['$\\Psi(x,0)$ ist keine Eigenfunktion von $\\hat H$; jeder Anteil braucht seinen eigenen Phasenfaktor.', 'Ein gemeinsamer Faktor ist richtig, er muss nur die mittlere Energie enthalten.', 'Das Minuszeichen zwischen $\\psi_2$ und $\\psi_3$ macht den Zustand stationär.'], a:0, ex:'$\\hat H\\Psi(x,0) = (E_2\\psi_2 - E_3\\psi_3)/\\sqrt2$ ist kein Vielfaches von $\\Psi(x,0)$. Mit einem gemeinsamen Faktor, gleich welcher Energie, löst $\\Psi$ die Schrödingergleichung nicht.'}},
    {aim:'k', id:'sg-fBk2', type:'mc2', q:'Viele Elektronen sind im stationären Zustand $\\psi_2(x)\\,e^{-iE_2t/\\hbar}$ eines Kastens. An jedem misst man einmal den Impuls. Was gilt für die Messwerte?', opts:['Sie streuen um null; ihr Mittel ist $0$, das Mittel ihrer Quadrate $(2\\pi\\hbar/L)^2$.', 'Sie sind alle $0$, weil sich in einem stationären Zustand nichts bewegt.', 'Sie ändern sich periodisch mit der Zeit, zu der man misst.'], a:0, ex:'$\\langle p\\rangle = 0$, aber $\\langle p^2\\rangle = 2mE_2 = (2\\pi\\hbar/L)^2 > 0$.',
      reason:{q:'Warum?', opts:['Stationär ist nur die Verteilung; die Energie $E_2 > 0$ ist ganz kinetisch.', 'Ein stationärer Zustand hat keine kinetische Energie, nur potentielle.', 'Der Zeitfaktor $e^{-iE_2t/\\hbar}$ lässt den Impuls periodisch schwanken.'], a:0, ex:'Im Inneren ist $V = 0$, also ist die ganze Energie $E_2 = \\langle p^2\\rangle/2m$ kinetisch. $\\langle p\\rangle = m\\,d\\langle x\\rangle/dt = 0$ heißt nur, dass sich positive und negative Impulse wegmitteln. Der Zeitfaktor fällt in allen Erwartungswerten heraus.'}}
  ],
  errors:[
    {id:'sg-e1', title:'Zeitableitung des Phasenfaktors',
      text:'Für $\\Psi(x,t) = \\psi_1(x)e^{-iE_1t/\\hbar}$ im Kasten soll $i\\hbar\\,\\partial_t\\Psi$ berechnet werden:',
      ctx:BOX2({defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)', 'Ψ(x,t)':'ψ_1(x) e^(-i E_1 t/ħ)'}}),
      lines:['∂Ψ/∂t = ∂/∂t (ψ_1 e^(-iE_1 t/ħ))', '= ψ_1 (iE_1/ħ) e^(-iE_1 t/ħ)', '= iE_1/ħ Ψ', 'iħ ∂Ψ/∂t = -E_1 Ψ'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Das Vorzeichen: $\\partial_t e^{-iE_1t/\\hbar} = -\\frac{iE_1}{\\hbar}e^{-iE_1t/\\hbar}$.', 'Man darf $\\psi_1$ nicht vor die Ableitung ziehen.', 'Der Faktor $\\hbar$ gehört in den Zähler, nicht in den Nenner.'], a:0, ex:'Mit dem richtigen Vorzeichen ergibt sich $i\\hbar\\partial_t\\Psi = E_1\\Psi$. Eine negative „Energie“ $-E_1$ wäre ein Warnsignal.'},
      fix:{id:'a', prompt:'Berichtige: Was ist $i\\hbar\\,\\partial_t\\Psi$?', type:'value', target:'E_1 Ψ', model:['iħ ∂Ψ/∂t = iħ ψ_1 (-iE_1/ħ) e^(-iE_1 t/ħ)', '= E_1 Ψ']}}
  ]
});
})();
lexe('schroedinger', 'Schrödingergleichung', 'Zeitabhängig: $i\\hbar\\,\\partial_t\\Psi(x,t) = \\hat H\\Psi$, mit $\\hat H = -\\frac{\\hbar^2}{2m}\\partial_x^2 + V(x)$. Nicht herleitbar, aber plausibel: linear, erster Ordnung in $t$, und für eine ebene Welle mit $E = \\hbar\\omega$, $p = \\hbar k$ folgt $E = p^2/2m$. Stationär (nach Separation $\\Psi = \\psi(x)e^{-iEt/\\hbar}$): $-\\frac{\\hbar^2}{2m}\\psi\'\' + V\\psi = E\\psi$. Die Gleichung ist linear: Überlagerungen von Lösungen sind wieder Lösungen.', {topic:'sg'});
lexe('hamilton', 'Hamilton-Operator', '$\\hat H = \\frac{\\hat p^2}{2m} + V(\\hat x) = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2} + V(x)$ in einer Dimension; in drei Dimensionen $-\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\vec r)$. Seine Eigenwerte sind die möglichen Energien.', {topic:'sg'});
lexe('stationaer', 'Stationärer Zustand', 'Lösung der Form $\\Psi(x,t) = \\psi(x)e^{-iE\\,t/\\hbar}$ mit $\\hat H\\psi = E\\psi$. Dichte $|\\Psi|^2$ und alle Erwartungswerte sind zeitunabhängig; eine Energiemessung ergibt sicher $E$ ($\\Delta H = 0$). Stationär heißt nicht „in Ruhe“: $\\langle p^2\\rangle$ kann positiv sein. Überlagerungen verschiedener Energien sind nicht stationär.', {topic:'sg'});
lexe('stromdichte', 'Wahrscheinlichkeitsstromdichte', '$j(x,t) = \\frac{\\hbar}{2mi}\\left(\\Psi^*\\partial_x\\Psi - \\Psi\\,\\partial_x\\Psi^*\\right) = \\frac1m\\operatorname{Re}\\left(\\Psi^*\\hat p\\Psi\\right)$. Für $Ae^{ikx}$: $j = |A|^2\\hbar k/m$. Für reelles $\\psi(x)$ (auch mit Zeitfaktor) ist $j = 0$. In 3D: $\\vec j = \\frac{\\hbar}{2mi}(\\Psi^*\\nabla\\Psi - \\Psi\\nabla\\Psi^*)$.', {topic:'sg'});
lexe('kontinuitaet', 'Kontinuitätsgleichung', '$\\partial_t\\rho + \\partial_x j = 0$ mit $\\rho = |\\Psi|^2$. Folgt aus der Schrödingergleichung bei reellem Potenzial. Integriert: $\\frac{d}{dt}\\int_a^b\\rho\\,dx = j(a) - j(b)$ – Wahrscheinlichkeit geht nicht verloren, sie fließt. Im stationären Zustand ist $j$ ortsunabhängig, aber nicht unbedingt null.', {topic:'sg'});
lexe('separation', 'Separationsansatz', 'Ansatz $\\Psi(x,t) = \\psi(x)\\,f(t)$ in der Schrödingergleichung mit zeitunabhängigem $V$: Beide Seiten nach Division durch $\\psi f$ hängen von verschiedenen Variablen ab, sind also gleich einer Konstanten $E$. Es folgt $f(t) = e^{-iEt/\\hbar}$ und $\\hat H\\psi = E\\psi$.', {topic:'sg'});
lexe('superposition', 'Superpositionsprinzip', 'Die Schrödingergleichung ist linear: Mit $\\Psi_1$ und $\\Psi_2$ ist auch $c_1\\Psi_1 + c_2\\Psi_2$ eine Lösung. Für Energie-Eigenfunktionen: $\\Psi(x,t) = \\sum_nc_n\\psi_n(x)e^{-iE_nt/\\hbar}$, jeder Summand mit seinem eigenen Phasenfaktor. Die relative Phase der Anteile ist messbar (Interferenz), eine gemeinsame globale Phase nicht.', {topic:'sg'});
