/* ===== Thema 3: Unendlicher Potentialtopf ===== */
(function(){
const R = String.raw;
const FAM = {'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)'};
const BOX = (extra) => {
  const base = {coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:Object.assign({}, FAM)};
  const e = extra || {};
  return Object.assign(base, e, {defs:Object.assign({}, FAM, e.defs || {}), params:Object.assign({}, base.params, e.params || {})});
};
/* ---- Skizzenaufgaben (didaktik/SKIZZE.md): Musterfunktionen aus den exakten Lösungen, dimensionslos ---- */
const SK = (() => {
  const PI = Math.PI;
  /* kasten-lab: ψ3 = √(2/L) sin(3πx/L), L = 1 */
  const boxRange = {x:[-0.15, 1.15], dom:[0, 1], walls:[0, 1]};
  const ticksL = [{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}];
  const lab = {
    id:'kasten-sk-lab', title:'$\\psi_3$ im unendlich tiefen Kasten', kind:'curve', draw:'psi',
    text:'Skizziere $\\psi_3(x)$ für den Kasten $0 < x < L$. Stell danach im Labor $n = 3$ und die Anzeige $\\psi_n(x)$ ein und vergleiche.',
    plot:Object.assign({xlab:'x', ylab:'\\psi_3(x)', ticks:[{x:0, lab:'0'}, {x:1 / 3, lab:'L/3'}, {x:0.5, lab:'L/2'}, {x:2 / 3, lab:'2L/3'}, {x:1, lab:'L'}]}, boxRange),
    f:x => Math.sin(3 * PI * x),
    checks:[
      {id:'rand', name:'Null an den Wänden', type:'zero', at:[0, 1], msg:'Was verlangt die unendlich hohe Wand von $\\psi$ bei $x = 0$ und $x = L$? (Abschnitt ‚Das Modell: unendlich hohe Wände‘)'},
      {id:'knoten', type:'nodes', n:2, msg:'Wie viele Nullstellen hat $\\psi_3$ im Inneren des Kastens? Deine Skizze hat {got}.'},
      {id:'sym', type:'parity', p:'even', about:0.5, msg:'Ist $\\psi_3$ zur Kastenmitte symmetrisch oder antisymmetrisch? Deine Skizze ist {got}.'},
      {id:'buckel', name:'Zahl der Buckel', type:'extrema', n:3, msg:'Wie viele halbe Wellenlängen passen für $n = 3$ in den Kasten? Deine Skizze hat {got} Buckel.'}
    ],
    reveal:'$\\psi_3 = \\sqrt{2/L}\\,\\sin(3\\pi x/L)$: Aus $kL = 3\\pi$ folgt $L = 3\\lambda/2$, also drei halbe Wellen. Dazwischen liegen zwei Knoten bei $L/3$ und $2L/3$, an beiden Wänden ist $\\psi = 0$. Weil $n$ ungerade ist, ist $\\psi_3$ symmetrisch zur Mitte; dort liegt ein Maximum des Betrags.',
    hints:['Wie viele halbe Wellenlängen passen in den Kasten, wenn $\\psi$ an beiden Wänden null ist?', 'Für $\\psi_n$ gilt $L = n\\,\\lambda_n/2$, und $\\psi_n$ hat $n - 1$ Knoten im Inneren.'],
    wrong:[
      {f:x => Math.sin(4 * PI * x), fails:['knoten', 'sym', 'buckel'], why:'n mit der Knotenzahl verwechselt: drei Knoten'},
      {f:x => Math.cos(2.4 * PI * (x - 0.5)), fails:['rand'], why:'ψ an der unendlich hohen Wand nicht null'},
      {f:x => Math.sin(2 * PI * x), fails:['knoten', 'sym', 'buckel'], why:'einen Knoten zu wenig'}
    ]
  };
  /* kasten-s1: Zustand nach der Energiemessung. Vorher Ψ = (ψ1 + ψ2 + ψ3)/√3, Ergebnis E2 → danach ψ2, Dichte |ψ2|² = 2 sin²(2πx)/L */
  const pre = x => (Math.sin(PI * x) + Math.sin(2 * PI * x) + Math.sin(3 * PI * x)) ** 2;
  const s1 = {
    id:'kasten-sk1', title:'Ortsdichte nach einer Energiemessung', kind:'curve', draw:'abs2',
    text:'Ein Teilchen im Kasten ist im Zustand $\\Psi = \\frac{1}{\\sqrt3}(\\psi_1 + \\psi_2 + \\psi_3)$. Eine Energiemessung ergibt $E_2$. Skizziere die Ortsdichte $|\\psi(x)|^2$ unmittelbar nach dieser Messung.',
    plot:Object.assign({xlab:'x', ylab:'|\\psi(x)|^2', ticks:[{x:0, lab:'0'}, {x:0.25, lab:'L/4'}, {x:0.5, lab:'L/2'}, {x:0.75, lab:'3L/4'}, {x:1, lab:'L'}]}, boxRange),
    f:x => Math.sin(2 * PI * x) ** 2,
    checks:[
      {id:'pos', type:'nonneg', msg:'Deine Kurve wird negativ (Minimum {got}). Kann eine Ortsdichte negativ sein?'},
      {id:'rand', name:'Nullstellen', type:'zero', at:[0, 0.5, 1], msg:'In welchem Zustand ist das Teilchen nach dem Messergebnis $E_2$? Wo hat dieser Zustand seine Nullstellen? (Abschnitt ‚Energiemessung und der Zustand danach‘)'},
      {id:'sym', type:'parity', p:'even', about:0.5, msg:'Ist die Dichte nach der Messung symmetrisch zur Mitte? Spielt der alte Zustand $\\Psi$ noch eine Rolle?'},
      {id:'buckel', name:'Zahl der Buckel', type:'extrema', n:2, kind:'max', msg:'Wie viele Buckel hat die Dichte des Zustands, in dem das Teilchen nach der Messung ist? Deine Skizze hat {got}.'}
    ],
    reveal:'Nach dem Messergebnis $E_2$ ist das Teilchen im Eigenzustand $\\psi_2$ (Kollaps). Die Dichte ist $|\\psi_2|^2 = \\frac2L\\sin^2(2\\pi x/L)$: zwei gleiche Buckel bei $L/4$ und $3L/4$, Nullstellen an den Wänden und in der Mitte. Vom alten Zustand $\\Psi$ ist danach nichts mehr zu sehen. Weil $\\psi_2$ stationär ist, bleibt diese Dichte, bis wieder gemessen wird.',
    hints:['Frage zuerst: In welchem Zustand ist das System unmittelbar nach dem Messergebnis $E_2$?', 'Nach dem Messpostulat ist es im Eigenzustand zum gemessenen Eigenwert. Skizziere dessen Betragsquadrat.'],
    wrong:[
      {f:pre, fails:['sym', 'buckel'], why:'Dichte unverändert wie vor der Messung'},
      {f:x => (Math.sin(PI * x) + 4 * Math.sin(2 * PI * x) + 9 * Math.sin(3 * PI * x)) ** 2, fails:['rand', 'buckel'], why:'ĤΨ statt Messung: Ĥ angewendet und normiert (Singh & Marshman 2015)'},
      {f:x => Math.sin(2 * PI * x), fails:['pos', 'sym'], why:'ψ2 statt |ψ2|² gezeichnet'}
    ]
  };
  /* kasten-s2: Kasten mit endlich hohen Wänden, Grundzustand (ħ = m = 1, L = 1, V0 = 8): Mitte bei L/2, Halbbreite a = 1/2, z0 = a√(2V0) = 2.
     Gerade Lösung: z tan z = √(z0² − z²) → z ≈ 1,030, k = 2z ≈ 2,06, κ ≈ 3,43, E = k²/2 ≈ 2,12 (V0/E ≈ 3,8).
     Innen cos(k(x − L/2)), außen cos(ka) e^{−κ(|x − L/2| − a)}; ψ und ψ' stetig an den Wänden. */
  const WG = (() => {
    const a = 0.5, V0 = 8, z0 = a * Math.sqrt(2 * V0);
    let lo = 1e-9, hi = Math.min(PI / 2 - 1e-9, z0);
    const g = z => z * Math.tan(z) - Math.sqrt(Math.max(0, z0 * z0 - z * z));
    for (let i = 0; i < 200; i++){ const m = (lo + hi) / 2; if (g(m) > 0) hi = m; else lo = m; }
    const z = (lo + hi) / 2, k = z / a, kap = Math.sqrt(z0 * z0 - z * z) / a, B = Math.cos(k * a);
    const f = x => { const u = x - 0.5; return Math.abs(u) <= a ? Math.cos(k * u) : B * Math.exp(-kap * (Math.abs(u) - a)); };
    return {f, k, kap, E:k * k / 2, V0, B};
  })();
  const s2 = {
    id:'kasten-sk2', title:'Grundzustand bei endlich hohen Wänden', kind:'curve', draw:'psi',
    text:'Die Wände sind jetzt nicht unendlich hoch: $V = 0$ für $0 < x < L$ und $V = V_0$ außerhalb, mit $V_0$ knapp viermal so groß wie die Energie $E$ des Grundzustands (Abbildung). Skizziere den Grundzustand $\\psi(x)$.',
    plot:{x:[-1.1, 2.1], xlab:'x', ylab:'\\psi(x)', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}], V:x => x > 0 && x < 1 ? 0 : WG.V0, Vr:[0, 10], E:WG.E,
      regions:[{x:[-1.1, 0], lab:'E < V_0'}, {x:[1, 2.1], lab:'E < V_0'}]},
    f:WG.f,
    checks:[
      {id:'links', name:'links außen', type:'decay', toward:'left', range:[-1.1, 0], msg:'Ist $\\psi$ links von der Wand null? Was macht $\\psi$ dort, wo $E < V_0$ ist? (Abschnitt ‚Das Modell: unendlich hohe Wände‘)'},
      {id:'rechts', name:'rechts außen', type:'decay', toward:'right', range:[1, 2.1], msg:'Was macht $\\psi$ rechts von der Wand, wo $E < V_0$ ist?'},
      {id:'glatt', name:'Übergang an den Wänden', type:'smooth', at:[0, 1], msg:'Die Wand ist endlich hoch. Was gilt dort für $\\psi$ und $\\psi\'$?'},
      {id:'knoten', type:'nodes', n:0, msg:'Wie viele Knoten hat ein Grundzustand? Deine Skizze hat {got}.'}
    ],
    reveal:'Innen ist $\\psi = \\cos(k(x - L/2))$, außen fällt es wie $e^{-\\kappa d}$ ab, $d$ = Abstand von der Wand. An den Wänden passen Wert und Steigung zusammen, weil $V$ dort endlich ist. Das Eindringen in die Wände gibt $\\psi$ mehr Platz: Die Wellenlänge innen ist größer als im unendlich tiefen Kasten ($\\lambda/2 > L$), also liegt $E$ unter dessen $E_1$. Der Grundzustand hat wie dort keinen Knoten.',
    hints:['Teile die $x$-Achse in drei Bereiche und überlege für jeden, ob $E > V$ oder $E < V$ ist.', 'Wo $E < V$ ist, krümmt sich $\\psi$ von der Achse weg und fällt ab. An einer endlich hohen Wand sind $\\psi$ und $\\psi\'$ stetig.'],
    wrong:[
      {f:x => x > 0 && x < 1 ? Math.sin(PI * x) : 0, fails:['links', 'rechts', 'glatt'], why:'wie im unendlich tiefen Kasten: ψ = 0 außerhalb'},
      {f:x => { const u = x - 0.5; return Math.abs(u) <= 0.5 ? Math.cos(WG.k * u) : WG.B * Math.exp(-4 * WG.kap * (Math.abs(u) - 0.5)); }, fails:['glatt'], why:'Knick an der endlichen Wand'},
      {f:x => { const u = x - 0.5; return Math.abs(u) <= 0.5 ? Math.cos(WG.k * u) : WG.B * Math.cos(5 * (Math.abs(u) - 0.5)) * Math.exp(-0.6 * (Math.abs(u) - 0.5)); }, fails:['links', 'rechts'], why:'Schwingung im klassisch verbotenen Bereich'},
      {f:x => { const u = x - 0.5; return Math.abs(u) <= 0.5 ? Math.sin(2.7 * u) : Math.sign(u) * Math.sin(1.35) * Math.exp(-3 * (Math.abs(u) - 0.5)); }, fails:['knoten'], why:'Grundzustand mit Knoten'}
    ]
  };
  /* Abschluss (Lernziel 0): Zustand zu gegebener Energie. A: E = 16E1 → n = 4; B: E = 25E1 → n = 5 */
  const fin = (n, E, idp) => ({
    id:idp, title:'Eigenfunktion zur Energie $' + E + 'E_1$', kind:'curve', draw:'psi', points:3,
    text:'Ein Teilchen im unendlich tiefen Kasten $0 < x < L$ ist im Energie-Eigenzustand mit $E = ' + E + 'E_1$. Skizziere seine Wellenfunktion $\\psi(x)$.',
    plot:Object.assign({xlab:'x', ylab:'\\psi(x)', ticks:ticksL}, boxRange),
    f:x => Math.sin(n * PI * x),
    checks:[
      {id:'rand', name:'Null an den Wänden', type:'zero', at:[0, 1], msg:'Was verlangen die unendlich hohen Wände von $\\psi$?'},
      {id:'knoten', type:'nodes', n:n - 1, msg:'Welches $n$ gehört zu $E = ' + E + 'E_1$, und wie viele Knoten hat $\\psi_n$ im Inneren? Deine Skizze hat {got}.'},
      {id:'sym', type:'parity', p:n % 2 ? 'even' : 'odd', about:0.5, msg:'Ist $\\psi_n$ für dieses $n$ symmetrisch oder antisymmetrisch zur Mitte? Deine Skizze ist {got}.'},
      {id:'buckel', name:'Zahl der Buckel', type:'extrema', n, msg:'Wie viele halbe Wellen passen für dieses $n$ in den Kasten? Deine Skizze hat {got} Buckel.'}
    ],
    reveal:'Aus $E_n = n^2E_1 = ' + E + 'E_1$ folgt $n = ' + n + '$. Also $\\psi_' + n + ' = \\sqrt{2/L}\\,\\sin(' + n + '\\pi x/L)$: ' + n + ' halbe Wellen, ' + (n - 1) + ' Knoten im Inneren, $\\psi = 0$ an beiden Wänden, ' + (n % 2 ? 'symmetrisch' : 'antisymmetrisch') + ' zur Mitte.',
    hints:['Bestimme zuerst $n$ aus $E_n = n^2E_1$.', 'Für $\\psi_n$ gilt $L = n\\lambda_n/2$, mit $n - 1$ Knoten im Inneren.'],
    wrong:[
      {f:x => Math.sin((n + 1) * PI * x), fails:['knoten', 'sym', 'buckel'], why:'n mit der Knotenzahl verwechselt'},
      {f:x => Math.sin((n - 1) * PI * x), fails:['knoten', 'sym', 'buckel'], why:'einen Knoten zu wenig'},
      {f:x => Math.cos((n - 0.6) * PI * (x - 0.5)) * (n % 2 ? 1 : 0) + (n % 2 ? 0 : Math.sin((n - 0.4) * PI * (x - 0.5))), fails:['rand'], why:'ψ an der unendlich hohen Wand nicht null'}
    ]
  });
  const fA = fin(4, 16, 'kasten-sk-A'), fB = fin(5, 25, 'kasten-sk-B');
  return {lab, s1, s2, fA, fB};
})();
topic({
  id:'kasten', math:['m-dgl', 'm-hilbert'], title:'Unendlicher Potentialtopf', short:'Potentialtopf',
  src:'Griffiths & Schroeter Kap. 2.2 · Nolting 5/1 Kap. 4 · Schwabl Kap. 3 · Singh & Marshman 2015 (Lernschwierigkeiten zur Messung)',
  wozu:'Der Kasten ist das einfachste Modell für eingesperrte Elektronen: in Quantentöpfen von Laserdioden, in Quantenpunkten, deren Leuchtfarbe von der Größe abhängt, und näherungsweise für die π-Elektronen langer Farbstoffmoleküle. Weil sich hier alles exakt ausrechnen lässt, lernst du an ihm das Standardverfahren der Quantenmechanik: Eigenfunktionen bestimmen, einen Zustand danach entwickeln, zeitlich entwickeln und vorhersagen, was eine Energiemessung ergibt.',
  bridge:'Aus Thema 1 kommen Normierung, Erwartungswerte und Unschärfe, aus Thema 2 die stationäre Schrödingergleichung, die Phasenfaktoren $e^{-iE_nt/\\hbar}$ und die Anschlussbedingungen. Aus der Mathematik brauchst du $y\'\' = -k^2y$ (M7) und Orthogonalität und Vollständigkeit von Funktionen (M5, M6). Neu sind Entwicklung nach Eigenfunktionen und die Energiemessung.',
  goals:[
    'Ich kann aus den Randbedingungen $\\psi(0) = \\psi(L) = 0$ die Eigenfunktionen $\\psi_n$ und Energien $E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$ herleiten.',
    'Ich kann einen Anfangszustand nach $\\psi_n$ entwickeln: $c_n = \\langle\\psi_n|\\Psi(0)\\rangle$, $P(E_n) = |c_n|^2$.',
    'Ich kann $\\Psi(x,t)$, $\\langle H\\rangle = \\sum|c_n|^2E_n$ sowie $\\langle x\\rangle$, $\\Delta x$ und $\\Delta p$ in $\\psi_n$ berechnen.'
  ],
  needs:'stationäre Schrödingergleichung (Thema 2) · $y\'\' = -k^2y$ · Normierung',
  check:[
    {q:'Welche Bedingung legt die Konstante $A$ in $\\psi = A\\sin(kx)$ fest?', opts:['die Normierung $\\int|\\psi|^2dx = 1$', 'die Randbedingung $\\psi(L) = 0$', 'die Energie $E = \\hbar^2k^2/2m$'], a:0, ex:'Die Randbedingungen legen $k$ fest, die Normierung legt $|A|$ fest.', lex:'normierung', prev:'wf', seg:'wf-t4'},
    {q:'Für welche $k$ gilt $\\sin(kL) = 0$ mit $k > 0$?', opts:['$k = n\\pi/L$ mit $n = 1, 2, 3, \\dots$', '$k = n\\pi L$ mit $n = 1, 2, 3, \\dots$', '$k = (n + \\tfrac12)\\pi/L$ mit $n = 0, 1, \\dots$'], a:0, ex:'Der Sinus ist null bei ganzzahligen Vielfachen von $\\pi$: $kL = n\\pi$. Halbzahlige Vielfache sind die Nullstellen des Kosinus.', lex:'schwingungsgleichung', prev:'m-dgl', seg:'md-t4'},
    {q:'Wie lautet die stationäre Schrödingergleichung im Inneren ($V = 0$)?', opts:['$-\\frac{\\hbar^2}{2m}\\psi\'\' = E\\psi$', '$i\\hbar\\psi\' = E\\psi$', '$\\psi\'\' = E\\psi$'], a:0, ex:'$\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2}$ für $V = 0$.', lex:'hamilton', prev:'sg', seg:'sg-t2'},
    {q:'$\\int_0^L\\sin(2\\pi x/L)\\sin(3\\pi x/L)\\,dx$ ist …', opts:['$0$', '$L/2$', '$L$'], a:0, ex:'Für $n \\ne m$ sind die Sinusfunktionen orthogonal.', lex:'integrale', prev:'m-hilbert', seg:'mh-t3'}
  ],
  diag:[
    {q:'Wie beginnst du, um die erlaubten Energien eines Teilchens im Kasten zu finden?', opts:['Lösung von $\\psi\'\' = -k^2\\psi$ ansetzen, $\\psi(0) = \\psi(L) = 0$ fordern', '$E = \\hbar k$ mit $k = \\pi/L$ einsetzen und nach $E$ auflösen', 'die Normierung $\\int|\\psi|^2dx = 1$ nach $E$ auflösen', 'Das weiß ich noch nicht.'], a:0, ex:'Die Energien folgen aus den Randbedingungen. Die Normierung legt nur die Amplitude fest; die Energie ist $\\hbar^2k^2/2m$, nicht $\\hbar k$.'},
    {q:'Wie beginnst du, um für $\\Psi(x,0) = A\\,x(L-x)$ die Wahrscheinlichkeit $P(E_1)$ zu berechnen?', opts:['$c_1 = \\int\\psi_1\\Psi\\,dx$ berechnen, dann $|c_1|^2$ bilden', '$|\\Psi(x,0)|^2$ bei $x = L/2$ auswerten', '$\\langle H\\rangle$ berechnen und durch $E_1$ teilen', 'Das weiß ich noch nicht.'], a:0, ex:'$P(E_n) = |c_n|^2$ mit $c_n = \\langle\\psi_n|\\Psi\\rangle$. $\\langle H\\rangle$ ist ein Mittelwert, keine Wahrscheinlichkeit.'}
  ],
  phenomenon:{
    title:'Farben von Quantenpunkten',
    text:'Quantenpunkte sind Halbleiter-Nanokristalle von wenigen Nanometern Durchmesser, etwa aus Cadmiumselenid. Gleiches Material, verschiedene Größen: Unter UV-Licht leuchten sie in verschiedenen Farben.\n\nEin einfaches Modell: Ein Elektron ist in einem Kasten der Breite $L$ eingesperrt, und die Farbe gehört zur Energie eines Übergangs zwischen zwei Niveaus.\n\nWie ändert sich die Farbe, wenn die Kristalle kleiner werden?',
    q:{q:'Deine Vorhersage:', opts:['zum Blauen hin, weil die Abstände der Niveaus wie $1/L^2$ wachsen', 'zum Roten hin, weil ein kleinerer Kristall weniger Energie speichert', 'gar nicht, weil die Farbe nur vom Material abhängt', 'zum Blauen hin, weil die Abstände der Niveaus wie $1/L$ wachsen'], a:0, ex:'$E_n \\propto 1/L^2$: kleinere Kristalle, größere Abstände, kürzere Wellenlängen.',
      fb:['Richtig. Mit $E_n = n^2\\pi^2\\hbar^2/(2mL^2)$ heißt halbe Größe vierfache Abstände, also deutlich kürzere Wellenlänge.',
        'Klassisch naheliegend, quantenmechanisch umgekehrt: Je enger der Einschluss, desto größer die Energien. Das ist dieselbe Ursache wie die Nullpunktsenergie.',
        'Für große Kristalle stimmt das. Bei wenigen Nanometern bestimmt aber der Einschluss die Energien mit, und die Farbe hängt von der Größe ab.',
        'Die Richtung stimmt, die Abhängigkeit nicht: $E = p^2/2m$ mit $p \\propto 1/L$ ergibt $E_n \\propto 1/L^2$.']},
    reveal:'Im Kasten ist $E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$. Der Abstand der untersten Niveaus, $E_2 - E_1 = 3E_1$, wächst wie $1/L^2$. Kleinere Kristalle senden also energiereicheres, blaueres Licht aus.\n\nReale Quantenpunkte sind dreidimensional, und zur Einschlussenergie kommt die Bandlücke des Materials. Die Abhängigkeit von der Größe erklärt aber genau dieser Einschluss. Für Entdeckung und Herstellung der Quantenpunkte gab es 2023 den Nobelpreis für Chemie.\n\nDieses Thema leitet $E_n$ und $\\psi_n$ her und zeigt, wie sich beliebige Zustände im Kasten zeitlich entwickeln und was eine Energiemessung ergibt.'
  },
  teach:[
    /* ===== Abschnitt 1: Modell, Randbedingungen, Gleichung innen ===== */
    {id:'kasten-t1', title:'Das Modell: unendlich hohe Wände', steps:[
      {id:'kasten-t1a', title:'Eingesperrte Elektronen',
        text:R`Viele Systeme sperren ein Elektron in einen kleinen Bereich: dünne Halbleiterschichten in Laserdioden, Nanokristalle, die π-Elektronen langer Moleküle. Das einfachste Modell dafür ist der [[lex:kasten|unendliche Potentialtopf]], auch Kasten genannt:

$$V(x) = \begin{cases}0, & 0 < x < L,\\ \infty, & \text{sonst.}\end{cases}$$

Innen ist das Teilchen frei, außen kommt es nicht hin. Das ist eine Idealisierung, aber eine lehrreiche: Alles lässt sich exakt ausrechnen. Quantisierung, Nullpunktsenergie und Zeitentwicklung zeigen sich in reiner Form. Dieses Thema geht dabei das Standardverfahren der Quantenmechanik einmal ganz durch.`,
        q:{q:R`Was sagt $V(x) = \infty$ außerhalb von $0 < x < L$ in Worten?`,
          opts:[R`Außerhalb hat das Teilchen die Energie $E = \infty$.`, R`Das Teilchen kann den Bereich $0 < x < L$ nie verlassen.`, R`Außerhalb wirkt überall eine unendlich große Kraft.`], a:1,
          ex:R`Ein Teilchen mit endlicher Energie $E$ kommt in einen Bereich mit $V = \infty$ nicht hinein. Reale Wände sind endlich hoch; der Kasten ist die Idealisierung, an der man das Verfahren ohne Nebenrechnungen lernt.`,
          fb:[R`Mit endlicher Energie $E$ kommt das Teilchen dort gar nicht hin. Es hat außen keine unendliche Energie, es ist dort einfach nicht.`,
            '',
            R`Die Kraft ist $-V'(x)$. Außen ist $V$ konstant, also wirkt dort keine Kraft; nur an den Wänden springt $V$.`]}},
      {id:'kasten-t1b', title:'Außen ist ψ = 0',
        pre:{from:'sg', seg:'sg-t4', title:'Krümmung im verbotenen Bereich', text:R`Wo $E < V$ ist, hat $\psi''$ das Vorzeichen von $\psi$. Bei konstantem $V_0$ fällt die normierbare Lösung wie $e^{-\kappa d}$ ab, mit $\kappa = \sqrt{2m(V_0 - E)}/\hbar$ und dem Abstand $d$ von der Wand. Mini-Beispiel: Bei $\kappa d = 1$ ist $\psi$ auf $e^{-1} \approx 0{,}37$ gefallen.`},
        num:{title:'Immer höhere Wände', text:R`Für ein Elektron ist die Eindringtiefe $1/\kappa$ bei

$$\begin{aligned}V_0 - E = 1\,\mathrm{eV}&:\ 0{,}20\,\mathrm{nm},\\ 10\,\mathrm{eV}&:\ 0{,}062\,\mathrm{nm},\\ 100\,\mathrm{eV}&:\ 0{,}020\,\mathrm{nm}.\end{aligned}$$

Je höher die Wand, desto kürzer reicht $\psi$ hinein. Für $V_0 \to \infty$ geht die Eindringtiefe gegen null.`},
        text:R`Bei einer endlich hohen Wand mit $V_0 > E$ fällt $\psi$ außen wie $e^{-\kappa d}$ ab. Dabei ist $d$ der Abstand von der Wand und

$$\kappa = \frac{\sqrt{2m(V_0 - E)}}{\hbar}.$$

Das Beispiel zeigt, was beim Erhöhen der Wand passiert: $\kappa$ wächst, und die Eindringtiefe $1/\kappa$ schrumpft. Für $V_0 \to \infty$ wird $\kappa$ unendlich groß, und $\psi$ verschwindet außen ganz. Im Kasten ist deshalb $\psi = 0$ für $x \le 0$ und $x \ge L$. Das Teilchen ist mit Sicherheit innen.`,
        q:{q:R`Warum ist im unendlichen Kasten $\psi = 0$ außerhalb von $[0, L]$?`,
          opts:['Weil man das Teilchen außerhalb des Kastens nie sucht.', 'Weil $\\psi\'$ an der Wand beliebig springen darf.', 'Weil $\\psi$ bei $V_0 \\to \\infty$ außen unendlich schnell abklingt.'], a:2,
          ex:R`Die Abklingkonstante $\kappa = \sqrt{2m(V_0 - E)}/\hbar$ wächst mit $V_0$ über alle Grenzen. Der Sprung von $\psi'$ ist eine Folge davon, kein Grund.`,
          fb:[R`Ob man sucht, ändert $\psi$ nicht. Der Grund liegt in der Gleichung: Außen ist $E \ll V_0$.`,
            R`Der Sprung von $\psi'$ ist eine Folge des unendlich hohen $V$, nicht der Grund für $\psi = 0$.`,
            '']}},
      {id:'kasten-t1c', title:'Randbedingungen an den Wänden',
        num:{title:'Ein Wert an der Wand', text:R`Bei einer $100\,\mathrm{eV}$ hohen Wand ist $\kappa \approx 51\,\mathrm{nm}^{-1}$. Schon $0{,}1\,\mathrm{nm}$ hinter der Wand ist $\psi$ auf

$$e^{-\kappa\cdot0{,}1\,\mathrm{nm}} \approx e^{-5{,}1} \approx 0{,}006$$

seines Werts an der Wand gefallen. Für $V_0 \to \infty$ fällt $\psi$ auf der Strecke null auf null. Weil $\psi$ stetig ist, muss es dann schon an der Wand null sein.`},
        text:R`$\psi$ ist stetig (Thema 2). Außen ist $\psi = 0$, also muss $\psi$ an beiden Wänden null sein:

$$\psi(0) = 0,\qquad \psi(L) = 0.$$

Das sind die **Randbedingungen** des Kastens. Die Ableitung $\psi'$ darf an den Wänden dagegen springen, weil $V$ dort unendlich ist ([[lex:anschluss|Anschlussbedingungen]]). Innen ist $\psi'$ an der Wand im Allgemeinen nicht null, außen schon. Diese beiden Bedingungen werden gleich die erlaubten Energien festlegen.`,
        q:{q:R`Welche Bedingungen gelten an den Wänden des unendlichen Kastens?`,
          opts:[R`$\psi = 0$ und $\psi' = 0$`, R`nur $\psi = 0$; $\psi'$ darf springen`, R`nur $\psi' = 0$; $\psi$ darf springen`], a:1,
          ex:R`$\psi$ ist überall stetig, also null an der Wand. Für $\psi'$ gilt die Stetigkeit nur bei endlichem $V$.`,
          fb:[R`Verlangte man auch $\psi' = 0$, gäbe es nur die Lösung $\psi \equiv 0$: Eine Lösung von $\psi'' = -k^2\psi$ mit $\psi = \psi' = 0$ an einer Stelle ist überall null.`,
            '',
            R`$\psi$ darf nirgends springen. Ein Sprung ergäbe in $\psi''$ die Ableitung einer δ-Funktion.`]}},
      {id:'kasten-t1d', title:'Innen: die Gleichung ψ″ = −k²ψ',
        pre:{from:'m-dgl', seg:'md-t3', title:'Schwingen oder Abklingen', text:R`Bei konstantem Potential ist die stationäre Gleichung eine Differentialgleichung mit konstanten Koeffizienten. Für $E > V_0$ wird sie zu $\psi'' = -k^2\psi$ mit Lösungen $A\sin kx + B\cos kx = Ce^{ikx} + De^{-ikx}$. Mini-Beispiel: $\psi = \sin 2x$ hat $\psi'' = -4\psi$, also $k = 2$.`},
        num:{title:R`Ein Elektron mit $0{,}376\,\mathrm{eV}$`, text:R`Für $E = 0{,}376\,\mathrm{eV}$ ist

$$k = \frac{\sqrt{2m_eE}}{\hbar} \approx 3{,}14\,\mathrm{nm}^{-1},$$

also fast genau $\pi\,\mathrm{nm}^{-1}$. Die Wellenlänge $2\pi/k$ ist dann $2\,\mathrm{nm}$. Dass dieser Wert nicht zufällig ist, zeigt Abschnitt 2.`},
        text:R`Innen ist $V = 0$. Die stationäre Schrödingergleichung lautet dort

$$-\frac{\hbar^2}{2m}\psi'' = E\psi\quad\Longleftrightarrow\quad \psi'' = -k^2\psi,\qquad k = \frac{\sqrt{2mE}}{\hbar}.$$

Das ist die Schwingungsgleichung ([[lex:schwingungsgleichung|die Gleichung y″ = −k²y]]) aus M7. Gelesen: Die Krümmung ist $-k^2$ mal der Funktion selbst. $k$ heißt Wellenzahl. Sie wächst mit der Wurzel der Energie: Vierfache Energie gibt doppeltes $k$ und halbe Wellenlänge. Für $E > 0$ schwingt $\psi$ also im Kasten, umso schneller, je größer $E$ ist.`,
        q:{q:R`Ein Elektron im Kasten hat viermal so viel Energie wie im Beispiel. Wie groß ist $k$?`,
          opts:[R`etwa $12{,}6\,\mathrm{nm}^{-1}$`, R`etwa $6{,}3\,\mathrm{nm}^{-1}$`, R`etwa $1{,}6\,\mathrm{nm}^{-1}$`], a:1,
          ex:R`$k \propto \sqrt E$: Vierfache Energie gibt doppeltes $k$, also $2\pi\,\mathrm{nm}^{-1} \approx 6{,}3\,\mathrm{nm}^{-1}$.`,
          fb:[R`$k$ wächst wie $\sqrt E$, nicht wie $E$. Vierfache Energie heißt doppeltes, nicht vierfaches $k$.`,
            '',
            R`Mehr Energie gibt größeres $k$, nicht kleineres.`]}},
      {id:'kasten-t1e', title:'Warum E > 0 sein muss',
        num:{title:'Der Fall $E < 0$ mit Zahlen', text:R`Für $E < 0$ ist $\psi'' = \kappa^2\psi$, und $\psi(0) = 0$ lässt nur $\psi = 2A\sinh(\kappa x)$ übrig. Mit $\kappa L = 1$ ist

$$\psi(L) = 2A\sinh 1 \approx 2{,}35\,A.$$

$\psi(L) = 0$ verlangt also $A = 0$, und dann ist $\psi$ überall null.`},
        text:R`Dass $E > 0$ sein muss, zeigt eine kurze Prüfung der anderen Fälle.

- $E < 0$: Dann ist $\psi'' = \kappa^2\psi$ mit $\kappa = \sqrt{-2mE}/\hbar$ und Lösungen $Ae^{\kappa x} + Be^{-\kappa x}$. Aus $\psi(0) = 0$ folgt $B = -A$, also $\psi = 2A\sinh(\kappa x)$. Weil $\sinh(\kappa L) \ne 0$ ist, erzwingt $\psi(L) = 0$ dann $A = 0$.
- $E = 0$: Dann ist $\psi'' = 0$, also $\psi = Ax + B$. Beide Randbedingungen geben $A = B = 0$.

In beiden Fällen bleibt nur $\psi \equiv 0$. Das ist kein Zustand, denn es lässt sich nicht normieren. Das passt zur Regel aus Thema 2: $E$ muss über dem Minimum von $V$ liegen, hier also über null.`,
        q:{q:R`Für $E < 0$ bleibt nach $\psi(0) = 0$ die Funktion $\psi = 2A\sinh(\kappa x)$. Warum gibt es trotzdem keinen Zustand?`,
          opts:[R`Weil $\sinh(\kappa L) \ne 0$ ist und $\psi(L) = 0$ deshalb $A = 0$ verlangt.`, R`Weil $\sinh$ eine ungerade Funktion ist.`, R`Weil negative Energien grundsätzlich verboten sind.`], a:0,
          ex:R`$\sinh$ ist nur bei $0$ null. Die zweite Randbedingung lässt nur $A = 0$ zu, also $\psi \equiv 0$.`,
          fb:['',
            R`Auch $\sin$ ist ungerade und liefert Zustände. Entscheidend ist, dass $\sinh$ außer bei $0$ keine Nullstelle hat.`,
            R`Negative Energien sind nicht grundsätzlich verboten, etwa im Wasserstoffatom. Hier scheitert es an den Randbedingungen.`]}}
    ]},

    /* ===== Abschnitt 2: Herleitung von k_n, E_n, ψ_n ===== */
    {id:'kasten-t2', title:'Eigenfunktionen und Energien herleiten', steps:[
      {id:'kasten-t2a', title:'Die allgemeine Lösung innen',
        pre:{from:'m-komplex', seg:'mk-t4', title:'Komplexe Exponentialfunktionen ableiten', text:R`$\frac{d}{dx}e^{ikx} = ik\,e^{ikx}$ und $\frac{d^2}{dx^2}e^{ikx} = -k^2e^{ikx}$. Die zweite Ableitung bringt ein reelles Minus. Mini-Beispiel: $e^{-3ix}$ hat die zweite Ableitung $(-3i)^2e^{-3ix} = -9\,e^{-3ix}$.`},
        num:{title:'Zwei Wellen', text:R`Für $k = \pi\,\mathrm{nm}^{-1}$ sind $e^{i\pi x/\mathrm{nm}}$ und $e^{-i\pi x/\mathrm{nm}}$ zwei Lösungen von $\psi'' = -k^2\psi$: Zweimal abgeleitet ergibt jede den Faktor $(\pm i\pi)^2 = -\pi^2$. Die erste läuft mit der Zeit nach rechts, die zweite nach links. Jede Kombination $Ce^{ikx} + De^{-ikx}$ ist ebenfalls eine Lösung.`},
        text:R`Für $E > 0$ ist die allgemeine Lösung von $\psi'' = -k^2\psi$ eine Überlagerung zweier [[lex:ebene-welle|ebener Wellen]]:

$$\psi(x) = C\,e^{ikx} + D\,e^{-ikx}.$$

Die beiden Konstanten $C$ und $D$ sind noch frei, ebenso $k$. Die Herleitung zeigt zuerst, wie $E$ und $k$ zusammenhängen: Beide Wellen geben eingesetzt $E = \hbar^2k^2/2m$. Diese Beziehung folgt aus der Gleichung allein. Die Randbedingungen kommen erst in den nächsten beiden Schritten dazu; sie legen $D$ und dann $k$ fest.`,
        derive:{ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', C:'complex', n:{int:[1, 5]}}, defs:{'ψ(x)':'C e^(i k x) + D e^(-i k x)'}, unknowns:{D:{ref:'-C', kind:'complex'}, k:{ref:'nπ/L'}, E:{ref:'n^2 π^2 ħ^2/(2m L^2)'}}},
          lines:[
            {l:'-ħ^2/(2m) ψ\'\' = E ψ', w:'stationäre Gleichung innen, V = 0'},
            {l:'E = ħ^2 k^2/(2m)', w:'ψ″ = −k²ψ für beide Exponentialfunktionen', why:{q:'Warum gilt $E = \\hbar^2k^2/2m$?', opts:['$\\partial_x^2e^{\\pm ikx} = -k^2e^{\\pm ikx}$, also $-\\frac{\\hbar^2}{2m}\\psi\'\' = \\frac{\\hbar^2k^2}{2m}\\psi$', 'Aus der Randbedingung $\\psi(L) = 0$ mit $kL = n\\pi$', 'Aus $E = \\hbar\\omega$ mit $\\omega = k$'], a:0, ex:'Die Beziehung zwischen $E$ und $k$ folgt aus der Gleichung allein; die Randbedingungen kommen erst danach.'}}
          ]},
        q:{q:R`Wie viele freie Konstanten hat die allgemeine Lösung $Ce^{ikx} + De^{-ikx}$ bei festem $k$?`,
          opts:[R`eine, denn $D$ folgt immer aus $C$`, R`zwei, $C$ und $D$`, R`keine, die Gleichung legt $\psi$ fest`], a:1,
          ex:R`Eine Gleichung zweiter Ordnung hat zwei unabhängige Lösungen, also zwei freie Konstanten. Erst die Randbedingungen schränken sie ein.`,
          fb:[R`$D = -C$ folgt erst aus der Randbedingung $\psi(0) = 0$, nicht aus der Gleichung.`,
            '',
            R`Die Gleichung lässt zwei Konstanten frei. Festgelegt werden sie durch Randbedingungen und Normierung.`]}},
      {id:'kasten-t2b', title:'Randbedingung links: eine stehende Welle',
        pre:{from:'m-komplex', seg:'mk-t2', title:'Euler-Formel', text:R`$e^{iu} = \cos u + i\sin u$. Daraus folgt $e^{iu} - e^{-iu} = 2i\sin u$ und $e^{iu} + e^{-iu} = 2\cos u$. Mini-Beispiel: Bei $u = \pi/2$ ist $e^{i\pi/2} - e^{-i\pi/2} = i - (-i) = 2i$.`},
        num:{title:R`$C = 1$ ausprobiert`, text:R`Mit $C = 1$ und $D = -1$ ist $\psi = e^{ikx} - e^{-ikx} = 2i\sin(kx)$. Bei $x = 0$ ist das $2i\sin 0 = 0$. Mit $D = +1$ wäre $\psi(0) = 1 + 1 = 2$, und die Randbedingung wäre verletzt.`},
        text:R`Die Herleitung setzt die linke Randbedingung ein. Bei $x = 0$ sind beide Exponentialfunktionen $1$, also ist $\psi(0) = C + D$. Aus $\psi(0) = 0$ folgt $D = -C$: Die beiden Wellen sind gleich stark und gegenphasig.

Zusammen ergeben sie mit der Euler-Formel die **stehende Welle**

$$\psi(x) = 2iC\sin(kx).$$

Eine nach rechts und eine nach links laufende Welle gleicher Stärke überlagern sich so, dass Knoten (Nullstellen) und Bäuche (Stellen größten Betrags) an festen Stellen bleiben. Der Faktor $2iC$ ist eine Konstante. Er legt nur Betrag und Phase fest, nicht die Form.`,
        derive:{ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', C:'complex', n:{int:[1, 5]}}, defs:{'ψ(x)':'C e^(i k x) + D e^(-i k x)'}, unknowns:{D:{ref:'-C', kind:'complex'}, k:{ref:'nπ/L'}, E:{ref:'n^2 π^2 ħ^2/(2m L^2)'}}},
          lines:[
            {l:'ψ(0) = C + D = 0', w:'Randbedingung links', why:{q:'Was folgt aus $\\psi(0) = 0$?', opts:['$D = -C$: beide Wellen gleich stark, gegenphasig', '$C = D = 0$: es gibt keine Lösung', '$k = 0$: die Welle hat keine Wellenlänge'], a:0, ex:'$e^{0} = 1$, also $\\psi(0) = C + D$. Nur $D = -C$ erfüllt die Bedingung, ohne dass $\\psi$ verschwindet.'}},
            {l:'ψ(x) = C (e^(i k x) - e^(-i k x))', w:'D = −C eingesetzt'},
            {l:'= 2i C sin(k x)', w:'e^(iu) − e^(−iu) = 2i sin u'}
          ]},
        q:{q:R`Nach der linken Randbedingung ist $\psi = 2iC\sin(kx)$. Welche Aussage stimmt?`,
          opts:[R`$\psi$ ist rein imaginär und kann deshalb kein Zustand sein.`, R`$\psi$ ist eine nach rechts laufende Welle.`, R`$\psi$ hat die Form $\sin(kx)$; $2iC$ ist nur ein konstanter Faktor.`], a:2,
          ex:R`Ein konstanter Faktor ändert keine Wahrscheinlichkeit. Seine Phase wählt man später so, dass $\psi$ reell ist.`,
          fb:[R`Eine globale Phase wie $i$ ändert nichts Messbares. Mit passendem $C$ wird $\psi$ reell.`,
            R`Gleich starke Wellen nach rechts und links ergeben eine stehende Welle, keine laufende.`,
            '']}},
      {id:'kasten-t2c', title:'Randbedingung rechts: k L = nπ',
        num:{title:R`Kasten mit $L = 1\,\mathrm{nm}$`, text:R`$\sin(kL) = 0$ verlangt $kL = \pi, 2\pi, 3\pi, \dots$ Für $L = 1\,\mathrm{nm}$ ist also

$$k_1 = \pi\,\mathrm{nm}^{-1},\quad k_2 = 2\pi\,\mathrm{nm}^{-1},\quad k_3 = 3\pi\,\mathrm{nm}^{-1},$$

mit den Wellenlängen $\lambda_n = 2\pi/k_n = 2\,\mathrm{nm}$, $1\,\mathrm{nm}$, $0{,}67\,\mathrm{nm}$. Andere Werte von $k$ sind nicht erlaubt.`},
        text:R`Jetzt die rechte Wand: $\psi(L) = 2iC\sin(kL) = 0$. Mit $C = 0$ wäre $\psi \equiv 0$. Also muss $\sin(kL) = 0$ sein, das heißt $kL = n\pi$. Daraus folgen die erlaubten Wellenzahlen und Energien

$$k_n = \frac{n\pi}{L},\qquad E_n = \frac{\hbar^2k_n^2}{2m} = \frac{n^2\pi^2\hbar^2}{2mL^2},\qquad n = 1, 2, 3, \dots$$

Warum nur positive $n$? $n = 0$ gibt $\psi \equiv 0$. Negative $n$ geben $\sin(-kx) = -\sin(kx)$, also denselben Zustand mit der [[lex:globale-phase|globalen Phase]] $-1$. Die Zahl $n$ heißt **Quantenzahl**. Die Quantisierung folgt allein aus den beiden Randbedingungen; eine Zusatzannahme braucht es dafür nicht.`,
        derive:{ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', C:'complex', n:{int:[1, 5]}}, defs:{'ψ(x)':'C e^(i k x) + D e^(-i k x)'}, unknowns:{D:{ref:'-C', kind:'complex'}, k:{ref:'nπ/L'}, E:{ref:'n^2 π^2 ħ^2/(2m L^2)'}}},
          lines:[
            {l:'ψ(L) = 2i C sin(k L) = 0', w:'Randbedingung rechts', why:{q:'Warum setzt man nicht einfach $C = 0$?', opts:['Weil dann $\\psi \\equiv 0$ wäre, und das ist nicht normierbar.', 'Weil $C$ erst durch die Normierung festliegt.', 'Weil $C$ komplex ist und nicht null sein kann.'], a:0, ex:'$\\psi \\equiv 0$ beschreibt kein Teilchen. Also muss $\\sin(kL) = 0$ gelten – das quantisiert $k$.'}},
            {l:'k = nπ/L', w:'n = 1, 2, 3, …'},
            {l:'E = n^2 π^2 ħ^2/(2m L^2)', w:'in E = ħ²k²/2m eingesetzt', why:{q:'Was bedeutet das Ergebnis?', opts:['Nur diskrete Energien sind möglich; die kleinste ist $E_1 > 0$.', 'Jede Energie $E > 0$ ist möglich, wenn $n$ groß genug ist.', 'Die Energien hängen nicht von der Breite $L$ ab.'], a:0, ex:'Das ist die Quantisierung durch Einschluss. $E_1 > 0$ ist die Nullpunktsenergie.'}}
          ]},
        q:{q:R`Warum gehört $n = -2$ nicht zu einem neuen Zustand?`,
          opts:[R`Es gibt die negative Energie $-4E_1$, und die ist nicht erlaubt.`, R`$\sin(-2\pi x/L) = -\sin(2\pi x/L)$ ist derselbe Zustand mit der Phase $-1$.`, R`Für $n = -2$ ist $\psi$ an der rechten Wand nicht null.`], a:1,
          ex:R`Ein Faktor $-1$ vor der ganzen Wellenfunktion ist eine globale Phase. Er ändert keine Messgröße. Die Energie $E_{-2} = E_2$ ist ohnehin positiv.`,
          fb:[R`$E_n \propto n^2$, also ist $E_{-2} = 4E_1$ positiv. Der Grund ist ein anderer.`,
            '',
            R`$\sin(-2\pi) = 0$: Auch für $n = -2$ ist die Randbedingung erfüllt.`]}},
      {id:'kasten-t2d', title:'Randbedingung, Bild und Quantisierung',
        num:{title:R`Der Zustand $n = 3$`, text:R`Für $n = 3$ und $L = 1\,\mathrm{nm}$ ist $\lambda_3 = 2L/3 \approx 0{,}67\,\mathrm{nm}$: Genau drei halbe Wellen passen in den Kasten. Die Energie ist

$$E_3 = 9E_1 = 9\cdot0{,}376\,\mathrm{eV} \approx 3{,}38\,\mathrm{eV}.$$`},
        text:R`Die Tafel übersetzt die Quantisierung zwischen fünf Gestalten. In Worten: $\psi$ muss an beiden Wänden null sein. Als Formel: $\sin(kL) = 0$. Mathematisch ist das ein Randwertproblem (M7); es hat nur für einzelne $k$ Lösungen. Im Bild passen genau $n$ halbe Wellen in den Kasten, also $L = n\lambda_n/2$. Physikalisch folgen daraus die Energien $E_n = n^2E_1$.

Lies die Tafel auch rückwärts: Zählst du in einem Bild die halben Wellen, kennst du $n$ und damit die Energie. Das Beispiel zeigt es für $n = 3$.`,
        reps:{obj:'Vom Rand zur Quantisierung im Kasten',
          rows:[
            {k:'worte', text:R`$\psi$ verschwindet an beiden Wänden. Dazwischen schwingt es wie eine eingespannte Saite.`},
            {k:'formel', tex:R`\psi(0) = \psi(L) = 0\quad\Longrightarrow\quad \sin(kL) = 0`},
            {k:'mathe', text:R`Randwertproblem (M7): $\sin(kL) = 0$ gilt genau für $k_nL = n\pi$ mit $n = 1, 2, 3, \dots$`},
            {k:'graph', plot:{x:[-0.1, 1.1], dom:[0, 1], walls:[0, 1], y:[-1.6, 1.6], xlab:'x/L', ylab:R`\psi\,\sqrt L`, ticks:[{x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}]}, f:x => Math.SQRT2 * Math.sin(Math.PI * x), lab:R`\psi_1`, f2:x => Math.SQRT2 * Math.sin(2 * Math.PI * x), lab2:R`\psi_2`,
              cap:R`$\psi_1$: eine halbe Welle, $L = \lambda_1/2$. $\psi_2$: zwei halbe Wellen, $L = \lambda_2$. Beide sind an den Wänden null.`},
            {k:'physik', tex:R`E_n = \frac{\hbar^2k_n^2}{2m} = n^2E_1,\qquad E_1 = \frac{\pi^2\hbar^2}{2mL^2} \approx 0{,}376\,\mathrm{eV}\ \ (L = 1\,\mathrm{nm})`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Null an beiden Wänden“ als $\psi(0) = 0$ und $\psi(L) = 0$ schreiben; die erste macht aus der Lösung $\sin(kx)$, die zweite verlangt $\sin(kL) = 0$.`},
            {from:'formel', to:'mathe', rule:R`Die Nullstellen des Sinus nehmen: $kL$ muss ein ganzzahliges Vielfaches von $\pi$ sein.`},
            {from:'mathe', to:'graph', rule:R`$k_nL = n\pi$ heißt $L = n\lambda_n/2$. Zeichne $n$ halbe Wellen zwischen die Wände.`},
            {from:'graph', to:'physik', rule:R`Die halben Wellen zählen, das gibt $n$; dann $E_n = n^2E_1$ ausrechnen.`}
          ]},
        q:{q:R`In einem Bild passen genau vier halbe Wellen zwischen die Wände. Welche Energie hat dieser Zustand?`, tr:{from:'graph', to:'physik'},
          opts:[R`$4E_1$`, R`$9E_1$`, R`$16E_1$`, R`$25E_1$`], a:2,
          ex:R`Vier halbe Wellen heißt $n = 4$, also $E_4 = 16E_1$. Dazwischen liegen drei Knoten.`,
          fb:[R`$E_n$ wächst wie $n^2$, nicht wie $n$.`,
            R`$9E_1$ gehört zu drei halben Wellen. Hast du die Knoten gezählt statt der halben Wellen?`,
            '',
            R`$25E_1$ gehört zu fünf halben Wellen. Vier halbe Wellen haben drei Knoten im Inneren, nicht vier.`]}},
      {id:'kasten-t2e', title:'Normierung der Eigenfunktionen',
        pre:{from:'wf', seg:'wf-t4', title:'Das Normierungsrezept', text:R`Vorfaktor ansetzen, $|A|^2$ vor das Integral ziehen, integrieren, nach $|A|$ auflösen. Die Phase von $A$ bleibt frei. Mini-Beispiel aus Thema 1: $A\sin(\pi x/L)$ im Kasten gibt $|A|^2L/2 = 1$, also $|A| = \sqrt{2/L}$.`},
        num:{title:R`$L = 1\,\mathrm{nm}$, beliebiges $n$`, text:R`$\int_0^L\sin^2(n\pi x/L)\,dx = L/2$ gilt für jedes $n$, denn über $n$ ganze halbe Wellen mittelt sich $\cos(2n\pi x/L)$ weg. Also ist für jedes $n$

$$|2iC| = \sqrt{\frac2L} \approx 1{,}41\,\mathrm{nm}^{-1/2}.$$`},
        text:R`Der Faktor $2iC$ ist noch frei. Die [[lex:normierung|Normierung]] $|2iC|^2\int_0^L\sin^2(n\pi x/L)\,dx = |2iC|^2\,L/2 = 1$ legt seinen Betrag fest, $|2iC| = \sqrt{2/L}$. Die Phase ist frei. Man wählt sie so, dass $\psi$ reell ist und positiv beginnt:

$$\psi_n(x) = \sqrt{\frac{2}{L}}\sin\!\left(\frac{n\pi x}{L}\right),\qquad n = 1, 2, 3, \dots$$

Das sind die Eigenfunktionen des Kastens. Alle haben denselben Vorfaktor $\sqrt{2/L}$, gleich wie viele halbe Wellen sie enthalten.`,
        q:{q:R`Welcher Vorfaktor normiert $A\sin(3\pi x/L)$ im Kasten?`,
          opts:[R`$\sqrt{2/(3L)}$`, R`$\sqrt{6/L}$`, R`$\sqrt{2/L}$`, R`$2/L$`], a:2,
          ex:R`$\int_0^L\sin^2(3\pi x/L)\,dx = L/2$ wie für jedes $n$. Also ist $A = \sqrt{2/L}$.`,
          fb:[R`Die Zahl der halben Wellen ändert das Integral nicht. Es bleibt $L/2$.`,
            R`Auch hier steckt die Quantenzahl fälschlich im Vorfaktor. Das Integral über $\sin^2$ ist für jedes $n$ gleich $L/2$.`,
            '',
            R`$2/L$ ist $|\psi_n|^2$ im Maximum, nicht der Vorfaktor von $\psi_n$.`]}},
      {id:'kasten-t2f', title:'Nullpunktsenergie und Größenordnung',
        num:{title:'Zwei Kastenbreiten', text:R`Für ein Elektron ist

$$\begin{aligned}E_1 &= \frac{\pi^2\hbar^2}{2m_eL^2} \approx 0{,}38\,\mathrm{eV}\ \ (L = 1\,\mathrm{nm}),\\ E_1 &\approx 1{,}5\,\mathrm{eV}\ \ (L = 0{,}5\,\mathrm{nm}).\end{aligned}$$

Halbe Breite, vierfache Energie. Zum Vergleich: Die thermische Energie bei Raumtemperatur ist nur $k_BT \approx 0{,}026\,\mathrm{eV}$.`},
        text:R`Die Quantisierung entsteht wie bei einer eingespannten Saite. Mit de Broglie, $p_n = h/\lambda_n = n\pi\hbar/L$, und $E_n = p_n^2/2m$ ergibt sich dieselbe Formel. Die kleinste Energie ist $E_1 = \pi^2\hbar^2/(2mL^2) > 0$, die [[lex:nullpunktsenergie|Nullpunktsenergie]]. Ein eingesperrtes Teilchen kann nicht ruhen: Mit $\Delta x < L/2$ erzwingt die Unschärferelation $\Delta p > \hbar/L$ (Thema 1).

Die de-Broglie-Überlegung ist nur ein Merkbild. Eine Impulsmessung in $\psi_n$ liefert nicht nur die Werte $\pm n\pi\hbar/L$ (Abschnitt 3). Weil $E_1$ viel größer ist als $k_BT$, sitzt ein Elektron in einem so kleinen Kasten bei Raumtemperatur fast immer im Grundzustand.`,
        q:{q:R`Kann ein Teilchen im Kasten die Energie $E = 0$ haben?`,
          opts:[R`Ja: mit $n = 0$ und einer konstanten Wellenfunktion.`, R`Nein: $E = 0$ gäbe $\psi \equiv 0$; die kleinste Energie ist $E_1$.`, R`Ja: wenn das Teilchen genau in der Mitte des Kastens liegt.`], a:1,
          ex:R`$n = 0$ liefert $\sin 0 = 0$, eine Konstante verletzt die Randbedingungen. Das Teilchen hat mindestens $E_1 = \pi^2\hbar^2/(2mL^2)$.`,
          fb:[R`Eine Konstante ungleich null verletzt $\psi(0) = 0$. Und $n = 0$ gibt $\sin 0 = 0$, also gar keinen Zustand.`,
            '',
            R`Ein Teilchen, das genau an einer Stelle liegt, hätte $\Delta x = 0$ und damit einen unendlich unscharfen Impuls. Seine Energie wäre riesig, nicht null.`]}}
    ]},

    /* ===== Abschnitt 3: Eigenschaften der ψ_n, Niveaus, Labor ===== */
    {id:'kasten-t3', title:'Eigenschaften der Eigenfunktionen', steps:[
      {id:'kasten-t3a', title:'Das Energieniveau-Diagramm im Labor',
        num:{title:'Die untersten Abstände', text:R`Aus $E_n = n^2E_1$ folgen die Niveaus $1, 4, 9, 16$ in Einheiten von $E_1$. Die Abstände wachsen:

$$E_{n+1} - E_n = (2n + 1)E_1:\qquad 3E_1,\ 5E_1,\ 7E_1,\ \dots$$

Für $L = 1\,\mathrm{nm}$ sind das $1{,}13\,\mathrm{eV}$, $1{,}88\,\mathrm{eV}$ und $2{,}63\,\mathrm{eV}$.`},
        text:R`Die Abbildung ist ein **Energieniveau-Diagramm**. Die senkrechte Achse ist die Energie $E/E_1$. Jede waagerechte Linie ist ein Niveau $E_n = n^2E_1$, beschriftet mit $n$. Auf der Linie des eingestellten $n$ ist $\psi_n$ eingezeichnet, als Kurve um diese Höhe. Die dicken senkrechten Striche sind die Wände.

Der Regler „Quantenzahl $n$“ wählt das Niveau. Die Anzeige darunter nennt $E_n$, die Zahl der Knoten im Inneren und die Wellenlänge $\lambda = 2L/n$. Mit „Anzeige“ wechselst du zwischen $\psi_n$ und $|\psi_n|^2$. Beachte: Die Höhe der Kurve über ihrer Linie ist nicht maßstäblich; sie zeigt nur die Form.`,
        fig:{lab:'box', init:{n:1}, caption:R`$\psi_n$ (oder $|\psi_n|^2$) auf der Höhe von $E_n = n^2E_1$. Zähle die Knoten und vergleiche die Abstände der Niveaus.`},
        q:{q:R`Wie groß ist der Abstand zwischen den Niveaus $E_4$ und $E_5$?`,
          opts:[R`$E_1$`, R`$9E_1$`, R`$25E_1$`, R`$3E_1$`], a:1,
          ex:R`$E_5 - E_4 = 25E_1 - 16E_1 = 9E_1 = (2\cdot4 + 1)E_1$.`,
          fb:[R`Die Abstände sind nicht gleich. Sie wachsen wie $2n + 1$.`,
            '',
            R`$25E_1$ ist das Niveau $E_5$ selbst, nicht sein Abstand zu $E_4$.`,
            R`$3E_1$ ist der unterste Abstand, $E_2 - E_1$. Nach oben werden die Abstände größer.`]}},
      {id:'kasten-t3b', title:'Niveaus, Formel und Spektrum',
        num:{title:R`Ein Sprung von $n = 3$ nach $n = 2$`, text:R`Für $L = 1\,\mathrm{nm}$ trägt das Licht beim Sprung von $E_3$ nach $E_2$ die Energie $5E_1 \approx 1{,}88\,\mathrm{eV}$. Die Wellenlänge ist

$$\lambda = \frac{hc}{5E_1} = \frac{1240\,\mathrm{eV\,nm}}{1{,}88\,\mathrm{eV}} \approx 660\,\mathrm{nm},$$

rotes Licht. Der Sprung von $E_2$ nach $E_1$ ($3E_1$) liegt bei $1{,}1\,\mu\mathrm{m}$ im Infraroten.`},
        text:R`Die Tafel verbindet das Diagramm mit Formel, Labor und Messung. Im Graphen steht jedes Niveau als waagerechter Strich über seiner Quantenzahl $n$. Die gestrichelte Parabel $n^2$ zeigt, wie schnell die Niveaus steigen.

Ein Spektrum misst die Abstände, nicht die Niveaus selbst. Beim Sprung von $E_m$ nach $E_n$ trägt das Licht $E_m - E_n$, wie bei den Linienspektren aus Thema 1. Weil alle Energien wie $1/L^2$ skalieren, rücken alle Linien zum Blauen, wenn der Kasten kleiner wird. Das ist die Farbe der Quantenpunkte aus dem Einstieg.`,
        reps:{obj:'Das Energieniveau-Diagramm des Kastens',
          rows:[
            {k:'formel', tex:R`E_n = n^2E_1,\qquad E_{n+1} - E_n = (2n + 1)\,E_1`},
            {k:'graph', plot:{x:[0.5, 4.5], y:[0, 17.5], xlab:'n', ylab:R`E/E_1`, ticks:[{x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}, {x:4, lab:'4'}], yticks:[{y:1, lab:'1'}, {y:4, lab:'4'}, {y:9, lab:'9'}, {y:16, lab:'16'}]}, f:x => { const n = Math.round(x); return Math.abs(x - n) <= 0.3 ? n * n : NaN; }, lab:R`E_n`, f2:x => x * x, lab2:R`n^2`,
              cap:R`Striche: die Niveaus bei $1, 4, 9, 16$. Gestrichelt die Parabel $n^2$, auf der sie liegen. Die Abstände wachsen: $3, 5, 7$.`},
            {k:'labor', text:R`Labor „Eigenfunktionen im Kasten“: waagerechte Linien „n=1“ bis „n=4“ auf der Achse $E/E_1$; der Regler „Quantenzahl $n$“ hebt eine Linie hervor.`},
            {k:'physik', text:R`Für $L = 1\,\mathrm{nm}$: Sprung $2 \to 1$ bei $1{,}13\,\mathrm{eV}$ ($1{,}1\,\mu\mathrm{m}$), Sprung $3 \to 2$ bei $1{,}88\,\mathrm{eV}$ ($660\,\mathrm{nm}$). Kleinerer Kasten, blaueres Licht.`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Für jedes $n$ einen waagerechten Strich in der Höhe $n^2$ über $n$ zeichnen.`},
            {from:'graph', to:'labor', rule:R`Im Labor sind dieselben Niveaus waagerechte Linien über dem Kasten; ihre Höhe liest du auf der Achse $E/E_1$ ab.`},
            {from:'labor', to:'physik', rule:R`Die Höhendifferenz zweier Linien mit $E_1$ multiplizieren. Das ist die Photonenenergie; $\lambda = hc/\Delta E$ gibt die Farbe.`}
          ]},
        q:{q:R`Im Diagramm springt ein Elektron im $1\,\mathrm{nm}$-Kasten von $n = 3$ auf $n = 1$. Welche Energie trägt das Licht?`, tr:{from:'graph', to:'physik'},
          opts:[R`$3{,}38\,\mathrm{eV}$`, R`$3{,}01\,\mathrm{eV}$`, R`$0{,}75\,\mathrm{eV}$`, R`$1{,}88\,\mathrm{eV}$`], a:1,
          ex:R`$E_3 - E_1 = 9E_1 - E_1 = 8E_1 \approx 3{,}01\,\mathrm{eV}$, violettes Licht bei etwa $412\,\mathrm{nm}$.`,
          fb:[R`Das ist $E_3 = 9E_1$ selbst. Das Licht trägt die Differenz zum unteren Niveau.`,
            '',
            R`Das ist $(3 - 1)E_1$, mit $n$ statt $n^2$ gerechnet. Die Höhen im Diagramm sind $9$ und $1$, nicht $3$ und $1$.`,
            R`Das ist der Sprung von $n = 3$ auf $n = 2$, nicht auf $n = 1$.`]}},
      {id:'kasten-t3c', title:'Knoten und Symmetrie',
        num:{title:R`$\psi_2$ genauer`, text:R`$\psi_2 = \sqrt{2/L}\sin(2\pi x/L)$ ist null bei $x = 0$, $L/2$ und $L$: ein Knoten im Inneren. Links der Mitte ist es positiv, rechts negativ, spiegelbildlich: $\psi_2(L - x) = -\psi_2(x)$. Die Dichte $|\psi_2|^2 = \tfrac2L\sin^2(2\pi x/L)$ hat zwei gleiche Buckel bei $L/4$ und $3L/4$.`},
        text:R`Drei Eigenschaften der $\psi_n$ findest du bei vielen anderen Potentialen wieder.

1. **Knoten.** $\psi_n$ hat $n - 1$ Nullstellen im Inneren ([[lex:knoten|Knotenregel]]). Mehr Knoten heißt stärkere Krümmung und mehr kinetische Energie.
2. **Symmetrie.** Um die Mitte $L/2$ sind die $\psi_n$ abwechselnd gerade, also symmetrisch ($n$ ungerade), und ungerade, also antisymmetrisch ($n$ gerade).
3. **Dichte.** $|\psi_n|^2$ hat $n$ Buckel, getrennt durch die $n - 1$ Knoten.

Die Tafel zeigt $\psi_2$ als Formel, als Bild und im Labor.`,
        reps:{obj:R`Die Eigenfunktion $\psi_2$`,
          rows:[
            {k:'worte', text:R`Zwei halbe Wellen, ein Knoten in der Mitte, links positiv und rechts negativ.`},
            {k:'formel', tex:R`\psi_2(x) = \sqrt{\frac2L}\sin\frac{2\pi x}{L},\qquad |\psi_2|^2 = \frac2L\sin^2\frac{2\pi x}{L}`},
            {k:'graph', plot:{x:[-0.1, 1.1], dom:[0, 1], walls:[0, 1], y:[-1.6, 2.2], xlab:'x/L', ylab:R`\psi_2\sqrt L,\ |\psi_2|^2L`, ticks:[{x:0, lab:'0'}, {x:0.25, lab:'0{,}25'}, {x:0.5, lab:'0{,}5'}, {x:0.75, lab:'0{,}75'}, {x:1, lab:'1'}]}, f:x => Math.SQRT2 * Math.sin(2 * Math.PI * x), lab:R`\psi_2`, f2:x => 2 * Math.sin(2 * Math.PI * x) ** 2, lab2:R`|\psi_2|^2`,
              cap:R`$\psi_2$ wechselt in der Mitte das Vorzeichen. $|\psi_2|^2$ ist dort null und hat zwei gleiche Buckel.`},
            {k:'labor', text:R`Labor „Eigenfunktionen im Kasten“: „Quantenzahl $n$“ $= 2$, „Anzeige“ $\psi_n(x)$ oder $|\psi_n(x)|^2$. Die Anzeige nennt „Knoten im Inneren: 1“.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Zwei halbe Wellen heißt $n = 2$; in $\sqrt{2/L}\sin(n\pi x/L)$ einsetzen.`},
            {from:'formel', to:'graph', rule:R`Die Nullstellen des Sinus bei $x = 0, L/2, L$ markieren und dazwischen je eine halbe Welle zeichnen; die Dichte ist das Quadrat.`},
            {from:'graph', to:'labor', rule:R`Im Labor $n = 2$ einstellen und mit „Anzeige“ zwischen den beiden Kurven wechseln.`}
          ]},
        q:{q:R`Im Labor zeigt die Anzeige $|\psi_n(x)|^2$ vier gleich hohe Buckel. Was gilt für $\psi_n$?`, tr:{from:'labor', to:'formel'},
          opts:[R`$n = 4$, drei Knoten, antisymmetrisch zur Mitte`, R`$n = 4$, vier Knoten, symmetrisch zur Mitte`, R`$n = 5$, vier Knoten, symmetrisch zur Mitte`], a:0,
          ex:R`$|\psi_n|^2$ hat $n$ Buckel, also $n = 4$. Dazwischen liegen $n - 1 = 3$ Knoten. Gerades $n$ heißt antisymmetrisch zur Mitte. Stell im Labor $n = 4$ ein und prüfe es.`,
          fb:['',
            R`Zwischen vier Buckeln liegen nur drei Knoten. Und gerades $n$ gibt eine zur Mitte antisymmetrische Funktion.`,
            R`$\psi_5$ hätte fünf Buckel in der Dichte. Zähle die Buckel, nicht die Knoten plus eins.`]}},
      {id:'kasten-t3d', title:'Orthonormal: Flächen, die sich aufheben',
        pre:{from:'m-hilbert', seg:'mh-t3', title:'Orthonormalsysteme', text:R`Ein Orthonormalsystem ist eine Folge $\varphi_1, \varphi_2, \dots$ mit $\langle\varphi_n|\varphi_m\rangle = \int\varphi_n^*\varphi_m\,dx = \delta_{nm}$. Auf $[0, L]$ ist $\varphi_n = \sqrt{2/L}\sin(n\pi x/L)$ das wichtigste Beispiel. Mini-Beispiel: $\int_0^L\varphi_1^2\,dx = 1$.`},
        num:{title:R`$\psi_1\psi_2$ links und rechts`, text:R`Für $L = 1$ ist $\psi_1\psi_2 = 2\sin(\pi x)\sin(2\pi x)$. Links der Mitte sind beide positiv, und

$$\int_0^{1/2}\psi_1\psi_2\,dx = \frac{4}{3\pi} \approx 0{,}42.$$

Rechts ist $\psi_2$ negativ, und das Integral ist $-0{,}42$. Zusammen: $\int_0^1\psi_1\psi_2\,dx = 0$.`},
        text:R`Die Eigenfunktionen sind **orthonormal** ([[lex:orthonormal|Orthonormalität]]):

$$\int_0^L\psi_m\,\psi_n\,dx = \delta_{mn} = \begin{cases}1, & m = n\\ 0, & m \ne n.\end{cases}$$

$\delta_{mn}$, gelesen „Kronecker-Delta“, ist $1$ für gleiche und $0$ für verschiedene Indizes. Für $m \ne n$ zeigt man das mit $\sin a\sin b = \tfrac12[\cos(a - b) - \cos(a + b)]$ (Aufgabe 4). Anschaulich: Die Flächen über und unter der Achse heben sich genau auf, wie im Beispiel. **Ausblick:** Thema 6 zeigt, dass das kein Zufall des Kastens ist. Energie-Eigenfunktionen zu verschiedenen Energien sind immer orthogonal.`,
        q:{q:R`$\psi_1\psi_2$ ist fast überall ungleich null. Warum ist trotzdem $\int_0^L\psi_1\psi_2\,dx = 0$?`,
          opts:[R`Weil $\psi_1$ und $\psi_2$ an verschiedenen Orten groß sind.`, R`Weil $\psi_2$ in der Mitte einen Knoten hat und dort null ist.`, R`Weil sich die Flächen links und rechts der Mitte aufheben.`], a:2,
          ex:R`Orthogonal heißt: Die Fläche unter dem Produkt ist null, mit Vorzeichen gezählt. Hier ist sie links $+0{,}42$ und rechts $-0{,}42$.`,
          fb:[R`Beide Funktionen sind in der Mitte groß und überlappen stark. Orthogonal heißt nicht „räumlich getrennt“.`,
            R`Ein Knoten allein reicht nicht. Entscheidend ist, dass die Teilflächen gleich groß und entgegengesetzt sind.`,
            '']}},
      {id:'kasten-t3e', title:'Erwartungswerte in ψₙ',
        num:{title:R`$\psi_2$ im $1\,\mathrm{nm}$-Kasten`, text:R`In $\psi_2$ ist $\langle x\rangle = L/2$ und $\langle p\rangle = 0$. Für den Impuls im Quadrat gilt

$$\langle p^2\rangle = \left(\frac{2\pi\hbar}{L}\right)^2,\qquad \sqrt{\langle p^2\rangle} \approx 6{,}6\cdot10^{-25}\,\mathrm{kg\,m/s},$$

und $\langle p^2\rangle/2m_e = 4E_1 \approx 1{,}50\,\mathrm{eV}$, genau $E_2$.`},
        text:R`In jedem $\psi_n$ ist $\langle x\rangle = L/2$, weil die Dichte symmetrisch zur Mitte ist. Und $\langle p\rangle = 0$, weil $\psi_n$ reell ist (Thema 1). Aber $\langle p^2\rangle$ ist nicht null. Die Herleitung rechnet

$$\langle p^2\rangle = \left(\frac{n\pi\hbar}{L}\right)^2 = 2mE_n.$$

Dazu wirkt $\hat p^2 = -\hbar^2\,d^2/dx^2$ auf $\psi_n$; zweimal ableiten gibt den Faktor $-(n\pi/L)^2$. Innen ist $V = 0$, also ist die ganze Energie kinetisch: $\langle H\rangle = \langle p^2\rangle/2m = E_n$. Das passt zu $E_n = \hbar^2k_n^2/2m$ aus Abschnitt 2.`,
        derive:{ctx:BOX({params:{n:{int:[1, 5]}}, defs:{'ψ(x)':'sqrt(2/L) sin(nπ x/L)'}, state:'ψ', normalized:true}),
          lines:[
            {l:'⟨p̂^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx', w:'p̂² = −ħ² d²/dx², ψ reell'},
            {l:'= (nπħ/L)^2 ∫_0^L |ψ|^2 dx', w:'ψ″ = −(nπ/L)² ψ', why:{q:'Woher kommt der Faktor $(n\\pi/L)^2$?', opts:['Zweimal abgeleitet: $\\psi\'\' = -(n\\pi/L)^2\\psi$', 'Aus der Normierung $\\sqrt{2/L}$, zum Quadrat genommen', 'Aus dem Erwartungswert $\\langle x\\rangle = L/2$, quadriert'], a:0, ex:'$\\psi_n$ ist Eigenfunktion von $d^2/dx^2$. Mit $-\\hbar^2$ davor wird das Vorzeichen positiv.'}},
            {l:'= (nπħ/L)^2', w:'Normierung'},
            {l:'⟨Ĥ⟩ = ⟨p̂^2⟩/(2m)', w:'innen V = 0'},
            {l:'= n^2 π^2 ħ^2/(2m L^2)', w:'⟨p²⟩ eingesetzt', why:{q:'Was zeigt dieses Ergebnis?', opts:['Die ganze Energie ist kinetisch, obwohl $\\langle p\\rangle = 0$ ist.', 'Das Teilchen ruht, weil $\\langle p\\rangle = 0$ ist.', 'Die Energie ist im Mittel null, nur einzeln nicht.'], a:0, ex:'Die Impulsverteilung ist symmetrisch um null. Positive und negative Werte mitteln sich weg, ihre Quadrate nicht. (Sie ist kontinuierlich, nicht auf $\\pm n\\pi\\hbar/L$ beschränkt; siehe den nächsten Schritt.)'}}
          ]},
        q:{q:R`In welchem Zustand ist $\langle p^2\rangle$ viermal so groß wie im Grundzustand?`,
          opts:[R`in $\psi_4$`, R`in $\psi_2$`, R`in $\psi_{16}$`], a:1,
          ex:R`$\langle p^2\rangle = (n\pi\hbar/L)^2 \propto n^2$. Viermal so groß heißt $n = 2$.`,
          fb:[R`$\langle p^2\rangle$ wächst wie $n^2$. In $\psi_4$ ist es sechzehnmal so groß.`,
            '',
            R`Das wäre richtig, wenn $\langle p^2\rangle$ wie $\sqrt n$ wüchse. Es wächst wie $n^2$.`]}},
      {id:'kasten-t3f', title:'Typischer Fehler: Impulse nur ±nπħ/L',
        num:{title:R`Die Impulsverteilung von $\psi_1$`, text:R`Die Fourier-Transformierte von $\psi_1$ (Thema 4) ergibt eine kontinuierliche Verteilung der Impulse. Ihr Maximum liegt bei $p = 0$. Dort ist die Dichte etwa $1{,}6$-mal so groß wie bei $p = \pm\pi\hbar/L$, dem Wert aus dem de-Broglie-Bild. Trotzdem ist $\langle p^2\rangle = (\pi\hbar/L)^2$.`},
        text:R`Aus $\langle p^2\rangle = (n\pi\hbar/L)^2$ folgt nicht, dass eine Impulsmessung in $\psi_n$ nur die Werte $\pm n\pi\hbar/L$ liefert. $\psi_n$ ist ein Sinus, der an den Wänden abgeschnitten ist. Außerhalb ist $\psi_n = 0$. Die Zerlegung $\sin(n\pi x/L) = (e^{in\pi x/L} - e^{-in\pi x/L})/2i$ gilt nur innen.

Die Fourier-Transformierte der ganzen Funktion ist deshalb eine kontinuierliche Verteilung. Für $n \ge 2$ hat sie zwei Buckel etwas innerhalb von $\pm n\pi\hbar/L$; für $\psi_1$ liegt ihr Maximum sogar bei $p = 0$. Erst für große $n$ rücken die Buckel nahe an $\pm n\pi\hbar/L$ heran.`,
        q:{q:R`Ein Teilchen ist im Grundzustand $\psi_1$. Was liefert eine Impulsmessung?`,
          opts:[R`nur $+\pi\hbar/L$ oder $-\pi\hbar/L$, je mit Wahrscheinlichkeit $\tfrac12$`, R`viele verschiedene Werte, am häufigsten nahe $p = 0$`, R`immer $p = 0$, weil $\langle p\rangle = 0$ ist`], a:1,
          ex:R`Die Impulsverteilung von $\psi_1$ ist kontinuierlich und hat ihr Maximum bei $p = 0$. Nur die Mittelwerte $\langle p\rangle = 0$ und $\langle p^2\rangle = (\pi\hbar/L)^2$ passen zum einfachen Bild.`,
          fb:[R`Das wäre richtig für eine Welle, die sich unendlich weit fortsetzt. $\psi_1$ ist aber an den Wänden abgeschnitten.`,
            '',
            R`$\langle p\rangle = 0$ ist ein Mittelwert. Einzelne Messungen streuen, denn $\langle p^2\rangle > 0$.`]}},
      {id:'kasten-t3g', title:'Große n: die klassische Grenze',
        num:{title:R`$n = 20$`, text:R`$|\psi_{20}|^2 = \tfrac2L\sin^2(20\pi x/L)$ hat $20$ Buckel, jeder nur $L/20$ breit. Ein Detektor mit der Auflösung $L/5$ mittelt über vier Buckel. Er misst im Mittel

$$\frac2L\cdot\frac12 = \frac1L,$$

überall gleich. Für $L = 1\,\mathrm{nm}$ sind die Buckel nur $0{,}05\,\mathrm{nm}$ breit.`},
        text:R`Klassisch ist ein Teilchen, das zwischen den Wänden hin- und herfliegt, überall gleich wahrscheinlich: $\rho_{\text{kl}} = 1/L$. $|\psi_n|^2$ hat dagegen $n$ Buckel mit Nullstellen dazwischen. Für großes $n$ liegen die Buckel so dicht, dass jede Messung mit endlicher Auflösung über viele mittelt. Im Mittel ergibt sich $1/L$.

So geht die Quantenmechanik bei großen Quantenzahlen in die klassische Physik über. **Wichtig:** Die $\psi_n$ sind besondere Zustände, aber nicht die einzigen. Ein Teilchen im Kasten kann in jedem normierten Zustand mit $\psi(0) = \psi(L) = 0$ sein, etwa in $A\,x(L - x)$. Solche Zustände sind Überlagerungen der $\psi_n$ und nicht stationär (Thema 2).`,
        q:{q:R`Ein Detektor mittelt über Bereiche der Breite $L/4$. Was misst er im Zustand $\psi_{40}$?`,
          opts:[R`eine fast gleichmäßige Dichte $1/L$`, R`$40$ deutlich getrennte Buckel`, R`die Dichte null, weil sich die Buckel wegmitteln`], a:0,
          ex:R`In jedem Bereich der Breite $L/4$ liegen zehn Buckel. Der Mittelwert von $\sin^2$ ist $\tfrac12$, also misst er $\tfrac2L\cdot\tfrac12 = \tfrac1L$.`,
          fb:['',
            R`Die Buckel sind nur $L/40$ breit. Mit einer Auflösung von $L/4$ kann der Detektor sie nicht trennen.`,
            R`Die Dichte ist nie negativ. Beim Mitteln bleibt der Mittelwert $\tfrac1L$, nicht null.`]}}
    ]},

    /* ===== Abschnitt 4: Entwicklung, Koeffizienten, Spalte ===== */
    {id:'kasten-t4', title:'Entwicklung nach Eigenfunktionen', steps:[
      {id:'kasten-t4a', title:'Jeder Zustand ist eine Summe von ψₙ',
        pre:{from:'m-hilbert', seg:'mh-t4', title:'Vollständigkeit', text:R`Ein Orthonormalsystem heißt vollständig, wenn sich jede quadratintegrable Funktion danach entwickeln lässt: $f = \sum_nc_n\varphi_n$, im Sinne der mittleren quadratischen Abweichung. Dann gilt Parseval: $\sum_n|c_n|^2 = \|f\|^2$. Die Sinusfunktionen auf $[0, L]$ sind vollständig.`},
        num:{title:'Die Parabel und der Grundzustand', text:R`Für $\Psi(x,0) = \sqrt{30/L^5}\,x(L - x)$ ist der erste Koeffizient

$$c_1 = \frac{8\sqrt{15}}{\pi^3} \approx 0{,}9993,\qquad |c_1|^2 = \frac{960}{\pi^6} \approx 0{,}9986.$$

Schon der erste Summand trägt also $99{,}86\,\%$ der Normierung. Die übrigen $0{,}14\,\%$ verteilen sich auf $\psi_3, \psi_5, \dots$`},
        text:R`Die $\psi_n$ sind **vollständig**. Jede vernünftige Funktion auf $[0, L]$ lässt sich als Reihe nach ihnen schreiben. Das ist die Fourier-Sinusreihe (M6). Also lässt sich jeder Anfangszustand zerlegen ([[lex:entwicklung|Entwicklung nach Eigenfunktionen]]):

$$\Psi(x,0) = \sum_{n=1}^{\infty}c_n\,\psi_n(x).$$

Die Koeffizienten $c_n$ sind komplexe Zahlen. Ihre Beträge sagen, wie stark jede Eigenfunktion beteiligt ist; ihre Phasen bestimmen, wie die Anteile interferieren. Die Parabel im Beispiel ähnelt dem Grundzustand sehr, ist aber nicht genau $\psi_1$.`,
        q:{q:R`Was bedeutet es, dass die $\psi_n$ vollständig sind?`,
          opts:[R`Es gibt unendlich viele $\psi_n$, für jedes $n$ eine.`, R`Jeder zulässige Zustand ist eine Summe $\sum_nc_n\psi_n$.`, R`Jede einzelne $\psi_n$ ist auf $1$ normiert und reell.`], a:1,
          ex:R`Vollständig heißt: Nichts fehlt. Jeder Zustand im Kasten lässt sich aus den $\psi_n$ zusammensetzen.`,
          fb:[R`Unendlich viele Funktionen reichen nicht. Lässt man $\psi_1$ weg, bleiben unendlich viele, aber $\psi_1$ selbst ist nicht mehr darstellbar.`,
            '',
            R`Das ist die Normierung. Vollständigkeit ist eine Aussage über das ganze System.`]}},
      {id:'kasten-t4b', title:'Koeffizienten durch Projektion',
        pre:{from:'m-vektor', seg:'mv-t3', title:'Komponenten in einer Orthonormalbasis', text:R`In einer Orthonormalbasis $e_1, \dots, e_n$ ist jede Komponente ein einzelnes Skalarprodukt: Aus $v = \sum_jc_je_j$ folgt $c_i = \langle e_i|v\rangle$. Mini-Beispiel im $\mathbb R^2$: $v = (3, 4)$ hat $c_1 = e_1\cdot v = 3$.`},
        num:{title:'Ein Zustand mit zwei Anteilen', text:R`Für $\Psi = \tfrac{1}{\sqrt{10}}(3\psi_1 - \psi_3)$ multiplizierst du mit $\psi_1$ und integrierst:

$$\int_0^L\psi_1\Psi\,dx = \tfrac{3}{\sqrt{10}}\cdot1 - \tfrac{1}{\sqrt{10}}\cdot0 = \tfrac{3}{\sqrt{10}}.$$

Mit $\psi_3$ statt $\psi_1$ kommt $-\tfrac{1}{\sqrt{10}}$ heraus, mit $\psi_2$ null.`},
        text:R`Wie findet man $c_n$? Multipliziere beide Seiten der Reihe mit $\psi_m(x)$ und integriere. Wegen der Orthonormalität bleibt von der Summe nur der Term $n = m$:

$$\int_0^L\psi_m\,\Psi(x,0)\,dx = \sum_nc_n\int_0^L\psi_m\psi_n\,dx = \sum_nc_n\,\delta_{mn} = c_m.$$

Allgemein, auch für komplexe Funktionen, gilt $c_n = \int\psi_n^*\,\Psi(x,0)\,dx$, in der Schreibweise von M5 $\langle\psi_n|\Psi\rangle$. Das Sternchen gehört an $\psi_n$; im Kasten sind die $\psi_n$ reell. Das ist dieselbe Rechnung wie für einen Vektor in einer Orthonormalbasis (M3): $c_n$ ist die Komponente von $\Psi$ entlang $\psi_n$. **Ausblick:** Thema 6 baut darauf die Dirac-Schreibweise auf.`,
        q:{q:R`$\Psi(x,0) = (\psi_1 + i\psi_2)/\sqrt2$. Was ist $c_2 = \int\psi_2^*\Psi\,dx$?`,
          opts:[R`$-i/\sqrt2$`, R`$1/\sqrt2$, denn Phasen zählen nicht`, R`$i/\sqrt2$`], a:2,
          ex:R`$\psi_2$ ist reell, also $c_2 = \tfrac{1}{\sqrt2}\int\psi_2(\psi_1 + i\psi_2)\,dx = \tfrac{i}{\sqrt2}$. Die Phase $i$ gehört zum Koeffizienten.`,
          fb:[R`Konjugiert wird $\psi_2$, nicht $\Psi$. Mit konjugiertem $\Psi$ erhieltest du $c_2^*$.`,
            R`Die Phase eines Koeffizienten ist eine relative Phase zwischen den Anteilen. Sie bestimmt die Interferenz und gehört dazu.`,
            '']}},
      {id:'kasten-t4c', title:'Ein Beispiel mit zwei Termen',
        num:{title:'Probe in der Mitte', text:R`Für $\Psi(x,0) = \sqrt{16/(5L)}\,\sin^3(\pi x/L)$ ist in der Mitte $\Psi(L/2) = \sqrt{16/5}/\sqrt L \approx 1{,}789/\sqrt L$. Die Zerlegung gibt dort

$$\tfrac{3}{\sqrt{10}}\psi_1(L/2) - \tfrac{1}{\sqrt{10}}\psi_3(L/2) = \tfrac{3 + 1}{\sqrt{10}}\sqrt{\tfrac2L} \approx \frac{1{,}789}{\sqrt L},$$

denn $\psi_3(L/2) = -\sqrt{2/L}$.`},
        text:R`Die Herleitung zerlegt $\Psi(x,0) = \sqrt{16/(5L)}\,\sin^3(\pi x/L)$. Mit $\sin^3u = \tfrac34\sin u - \tfrac14\sin 3u$ besteht $\Psi$ aus nur zwei Eigenfunktionen:

$$\Psi(x,0) = \frac{3}{\sqrt{10}}\psi_1(x) - \frac{1}{\sqrt{10}}\psi_3(x),\qquad |c_1|^2 + |c_3|^2 = \tfrac{9}{10} + \tfrac{1}{10} = 1.$$

Die Summe der Betragsquadrate ist $1$, wie es für einen normierten Zustand sein muss ([[lex:vollstaendigkeit|Parseval-Gleichung]]). Alle anderen $c_n$ sind null, auch $c_2$: $\Psi$ ist symmetrisch um $L/2$, $\psi_2$ antisymmetrisch, also verschwindet das Integral. Die Herleitung bestätigt jeden Koeffizienten noch einmal als Projektion.`,
        derive:{ctx:BOX({defs:{'Ψ(x)':'sqrt(16/(5L)) sin(πx/L)^3'}, state:'Ψ', normalized:true}),
          lines:[
            {l:'∫_0^L |Ψ(x)|^2 dx = 1', w:'Ψ ist normiert'},
            {l:'Ψ(x) = sqrt(16/(5L)) (3/4 sin(πx/L) - 1/4 sin(3πx/L))', w:'sin³u = ¾ sin u − ¼ sin 3u', why:{q:'Woher stammt diese Umformung?', opts:['Aus $\\sin 3u = 3\\sin u - 4\\sin^3u$, nach $\\sin^3u$ aufgelöst', 'Aus $\\sin^3u = \\sin(3u)$ für jeden Winkel $u$', 'Aus der Normierung von $\\Psi$ auf dem Kasten'], a:0, ex:'$\\sin 3u = 3\\sin u - 4\\sin^3u$ (Additionstheorem), also $\\sin^3u = \\tfrac34\\sin u - \\tfrac14\\sin 3u$.'}},
            {l:'= 3/sqrt(10) ψ_1(x) - 1/sqrt(10) ψ_3(x)', w:'sin(nπx/L) = sqrt(L/2) ψ_n(x)', why:{q:R`Woher kommt der Vorfaktor $3/\sqrt{10}$?`, opts:[R`$\sqrt{16/(5L)}\cdot\tfrac34\cdot\sqrt{L/2} = \tfrac{3}{\sqrt{10}}$`, R`$\sqrt{16/(5L)}\cdot\tfrac34 = \tfrac{3}{\sqrt{10}}$, ohne weiteren Faktor`, R`Aus $|c_1|^2 = \tfrac{9}{10}$, das man vorher kennt`], a:0, ex:R`$\sin(\pi x/L) = \sqrt{L/2}\,\psi_1$. Also $\sqrt{\tfrac{16}{5L}}\cdot\tfrac34\cdot\sqrt{\tfrac L2} = \tfrac34\sqrt{\tfrac{8}{5}} = \tfrac{3}{\sqrt{10}}$.`}},
            {l:'⟨ψ_1|Ψ⟩ = 3/sqrt(10)', w:'Projektion bestätigt c_1'},
            {l:'⟨ψ_2|Ψ⟩ = 0', w:'Symmetrie', why:{q:'Warum ist $c_2 = 0$?', opts:['Weil $\\Psi$ symmetrisch um $L/2$ ist, $\\psi_2$ aber antisymmetrisch.', 'Weil $\\psi_2$ bei $L/2$ einen Knoten hat und dort $\\Psi$ maximal ist.', 'Weil nur ungerade Potenzen des Sinus vorkommen dürfen.'], a:0, ex:'Das Produkt einer symmetrischen und einer antisymmetrischen Funktion ist antisymmetrisch um $L/2$; sein Integral über den Kasten verschwindet.'}},
            {l:'⟨ψ_3|Ψ⟩ = -1/sqrt(10)', w:'Projektion bestätigt c_3'}
          ]},
        q:{q:R`Wie groß ist $c_4$ für $\Psi(x,0) = \sqrt{16/(5L)}\,\sin^3(\pi x/L)$?`,
          opts:[R`klein, aber nicht null`, R`$0$`, R`$-1/\sqrt{10}$, wie $c_3$`], a:1,
          ex:R`$\Psi$ ist genau $\tfrac{3}{\sqrt{10}}\psi_1 - \tfrac{1}{\sqrt{10}}\psi_3$. Wegen der Orthonormalität ist jedes andere $c_n$ null.`,
          fb:[R`Bei der Parabel gibt es unendlich viele kleine Koeffizienten. Hier besteht $\Psi$ exakt aus zwei Termen.`,
            '',
            R`$c_3$ gehört zu $\psi_3$. $\psi_4$ kommt in der Zerlegung gar nicht vor.`]}},
      {id:'kasten-t4d', title:'Funktion, Spalte und Bild',
        num:{title:'Die Gewichte', text:R`Für $\Psi = \tfrac{1}{\sqrt{10}}(3\psi_1 - \psi_3)$ ist die Spalte der Koeffizienten

$$(c_1;\ c_2;\ c_3;\ c_4;\ \dots) = \left(\tfrac{3}{\sqrt{10}};\ 0;\ -\tfrac{1}{\sqrt{10}};\ 0;\ \dots\right),$$

also etwa $(0{,}949;\ 0;\ -0{,}316;\ 0;\ \dots)$.

Die Betragsquadrate $0{,}9$ und $0{,}1$ addieren sich zu $1$.`},
        text:R`Derselbe Zustand hat mehrere Gestalten. Als Funktion ist er $\sqrt{16/(5L)}\sin^3(\pi x/L)$. Als Spalte ist er die Liste seiner Koeffizienten. Die Spalte ist eine vollständige Beschreibung: Aus ihr baust du die Funktion zurück, jeden Eintrag mal seine Eigenfunktion. Im Bild siehst du, dass $\Psi$ fast wie $\psi_1$ aussieht. Der kleine Anteil $-\psi_3$ macht ihn in der Mitte etwas höher und an den Rändern flacher.

Die Spalte ist besonders praktisch, wenn es um Energien geht. Jeder Eintrag gehört zu einer Energie $E_n$; Abschnitt 5 und 6 rechnen nur noch mit ihr.`,
        reps:{obj:R`Der Zustand $\sqrt{16/(5L)}\,\sin^3(\pi x/L)$`,
          rows:[
            {k:'worte', text:R`Fast ganz Grundzustand, dazu ein wenig $\psi_3$ mit negativem Vorzeichen.`},
            {k:'formel', tex:R`\Psi(x,0) = \sqrt{\tfrac{16}{5L}}\sin^3\frac{\pi x}{L} = \frac{3}{\sqrt{10}}\psi_1(x) - \frac{1}{\sqrt{10}}\psi_3(x)`},
            {k:'graph', plot:{x:[-0.1, 1.1], dom:[0, 1], walls:[0, 1], y:[0, 2], xlab:'x/L', ylab:R`\Psi\sqrt L`, ticks:[{x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}]}, f:x => Math.sqrt(16 / 5) * Math.sin(Math.PI * x) ** 3, lab:R`\Psi`, f2:x => 3 / Math.sqrt(10) * Math.SQRT2 * Math.sin(Math.PI * x), lab2:R`\tfrac{3}{\sqrt{10}}\psi_1`,
              cap:R`Durchgezogen $\Psi$, gestrichelt sein Anteil $\tfrac{3}{\sqrt{10}}\psi_1$. Der Unterschied ist $-\tfrac{1}{\sqrt{10}}\psi_3$: in der Mitte positiv, an den Rändern negativ.`},
            {k:'mathe', text:R`$c_n = \int_0^L\psi_n\,\Psi\,dx$ ist die Komponente von $\Psi$ in der Orthonormalbasis der $\psi_n$ (M3, M5).`},
            {k:'matrix', tex:R`\begin{pmatrix}c_1\\ c_2\\ c_3\\ c_4\\ \vdots\end{pmatrix} = \frac{1}{\sqrt{10}}\begin{pmatrix}3\\ 0\\ -1\\ 0\\ \vdots\end{pmatrix}`},
            {k:'physik', text:R`Die Betragsquadrate $\tfrac{9}{10}$ und $\tfrac{1}{10}$ sind die Gewichte der Energien $E_1$ und $E_3 = 9E_1$ (Abschnitt 6).`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Jeden beteiligten Zustand als Summanden $c_n\psi_n$ schreiben; „ein wenig mit negativem Vorzeichen“ heißt kleines, negatives $c_n$.`},
            {from:'formel', to:'graph', rule:R`$\Psi$ und seinen größten Anteil über $x$ zeichnen. Die Differenz der Kurven ist der Rest der Summe.`},
            {from:'graph', to:'mathe', rule:R`Für jedes $n$ das Produkt $\psi_n\Psi$ bilden und seine Fläche bestimmen. Diese Fläche ist $c_n$.`},
            {from:'mathe', to:'matrix', rule:R`Die $c_n$ der Reihe nach untereinander schreiben, oben $n = 1$. Eigenfunktionen, die nicht vorkommen, geben eine $0$.`},
            {from:'matrix', to:'physik', rule:R`Jeden Eintrag betragsquadrieren. Das ist das Gewicht der zugehörigen Energie $E_n$; zusammen ergeben sie $1$.`}
          ]},
        q:{q:R`Ein Zustand im Kasten hat die Spalte $(0;\ \tfrac{1}{\sqrt2};\ 0;\ -\tfrac{i}{\sqrt2};\ 0;\ \dots)$. Welche Funktion gehört dazu?`, tr:{from:'matrix', to:'formel'},
          opts:[R`$\tfrac{1}{\sqrt2}\left(\psi_1 - i\psi_3\right)$`, R`$\tfrac{1}{\sqrt2}\left(\psi_2 - i\psi_4\right)$`, R`$\tfrac{1}{\sqrt2}\left(\psi_2 + i\psi_4\right)$`, R`$\tfrac{1}{\sqrt2}\left(\psi_2 - \psi_4\right)$`], a:1,
          ex:R`Der zweite Eintrag gehört zu $\psi_2$, der vierte zu $\psi_4$. Jeder Eintrag steht so, wie er ist, vor seiner Eigenfunktion.`,
          fb:[R`Die Zählung beginnt bei $n = 1$: Der erste Eintrag ist $c_1 = 0$.`,
            '',
            R`Beim Zurückübersetzen wird nicht konjugiert. Der Eintrag $-i/\sqrt2$ kommt unverändert vor $\psi_4$.`,
            R`Die relative Phase $-i$ gehört zum Zustand. Ohne sie wäre es ein anderer Zustand.`]}},
      {id:'kasten-t4e', title:'Eine unendliche Reihe: die Parabel',
        num:{title:'Die ersten Koeffizienten', text:R`Für $\Psi(x,0) = \sqrt{30/L^5}\,x(L - x)$ ist $c_n = 8\sqrt{15}/(n\pi)^3$ für ungerade $n$ und $c_n = 0$ für gerade $n$:

$$c_1 \approx 0{,}9993,\qquad c_3 \approx 0{,}0370,\qquad c_5 \approx 0{,}0080.$$

$|c_1|^2 + |c_3|^2 \approx 0{,}99855 + 0{,}00137 = 0{,}99993$. Die Summe aller $|c_n|^2$ ist $1$.`},
        text:R`Nicht jeder Zustand besteht aus endlich vielen $\psi_n$. Die Parabel braucht unendlich viele. Ihre Koeffizienten fallen aber schnell ab, wie $1/n^3$. Die geraden fehlen ganz, aus demselben Grund wie beim $\sin^3$-Zustand: Die Parabel ist symmetrisch um $L/2$.

Die Abbildung zeigt die Teilsummen. Die blaue Kurve ist $\sum_{n\le N}c_n\psi_n$, die gestrichelte die Funktion selbst. Mit dem Regler „Zahl der Terme $N$“ fügst du Summanden hinzu. Die Balken darunter sind die $|c_n|^2$, logarithmisch aufgetragen; die Anzeige vergleicht $\sum|c_n|^2$ mit $\int|f|^2dx$. Im Labor ist die Parabel nicht normiert. Dort ist $\int|f|^2dx = 1/30$, nicht $1$.`,
        fig:{lab:'expand', init:{key:'par', N:1}, keep:'all', caption:R`Teilsummen $\sum_{n\le N}c_n\psi_n$ (blau) nähern sich der Funktion (gestrichelt). Die Balken zeigen $|c_n|^2$; bei der Parabel fehlen alle geraden $n$.`},
        q:{q:R`Warum fehlen bei der Parabel alle geraden $n$?`,
          opts:[R`Die Parabel ist symmetrisch um $L/2$, $\psi_n$ mit geradem $n$ antisymmetrisch.`, R`Gerade $n$ haben für diesen Zustand zu hohe Energien und fallen weg.`, R`Die Parabel erfüllt die Randbedingungen nur für ungerade $n$ richtig.`], a:0,
          ex:R`Das Produkt aus symmetrischer Parabel und antisymmetrischem $\psi_n$ ist antisymmetrisch um $L/2$. Sein Integral über den Kasten ist null.`,
          fb:['',
            R`Die Höhe der Energie spielt keine Rolle. Auch hohe ungerade $n$ kommen vor, nur mit kleinen $c_n$.`,
            R`Die Parabel erfüllt die Randbedingungen $\Psi(0) = \Psi(L) = 0$; die $c_n$ hängen davon nicht ab.`]}},
      {id:'kasten-t4f', title:'Typischer Fehler: Stern und Reihenfolge',
        num:{title:'Zwei Integrale', text:R`Für $\Psi = (\psi_1 + i\psi_2)/\sqrt2$ ist

$$\int\psi_2^*\Psi\,dx = \frac{i}{\sqrt2} = c_2,\qquad \int\Psi^*\psi_2\,dx = -\frac{i}{\sqrt2} = c_2^*.$$

Beide haben das Betragsquadrat $\tfrac12$. Aber sie unterscheiden sich in der Phase.`},
        text:R`Ein häufiger Fehler ist, den Stern an die falsche Funktion zu setzen. $c_n = \int\psi_n^*\Psi\,dx$: konjugiert wird die Eigenfunktion, nicht der Zustand. Vertauscht man das, erhält man $c_n^*$.

Für die Gewichte $|c_n|^2$ merkt man davon nichts. Für alles, was mit Interferenz zu tun hat, schon. Die Phasen der $c_n$ bestimmen, wie die Anteile zusammenwirken, etwa wohin die Dichte in einer Überlagerung schwappt (Thema 2). Im Kasten sind die $\psi_n$ reell, deshalb steht der Stern dort oft gar nicht da. Gehört er doch zu $\Psi$, wird das Ergebnis falsch, sobald $\Psi$ komplex ist.`,
        q:{q:R`Jemand berechnet die Koeffizienten als $\int\Psi^*\psi_n\,dx$. Was erhält er?`,
          opts:[R`$c_n^*$; die Gewichte $|c_n|^2$ stimmen, die Phasen nicht`, R`genau $c_n$, weil die $\psi_n$ im Kasten reell sind`, R`$|c_n|^2$, also gleich die Gewichte der Anteile`], a:0,
          ex:R`$\int\Psi^*\psi_n\,dx = \left(\int\psi_n^*\Psi\,dx\right)^* = c_n^*$. Das gleiche Betragsquadrat, die entgegengesetzte Phase.`,
          fb:['',
            R`Dass $\psi_n$ reell ist, hilft nicht: Konjugiert wird jetzt $\Psi$, und das ist im Allgemeinen komplex.`,
            R`Ein einzelnes Integral liefert eine Amplitude, kein Betragsquadrat.`]}}
    ]},

    /* ===== Abschnitt 5: Zeitentwicklung ===== */
    {id:'kasten-t5', title:'Zeitentwicklung im Kasten', steps:[
      {id:'kasten-t5a', title:'Das Rezept für jedes Anfangswertproblem',
        pre:{from:'sg', seg:'sg-t5', title:'Jeder Anteil dreht seine eigene Phase', text:R`Erfüllen die $\psi_n$ die Gleichungen $\hat H\psi_n = E_n\psi_n$, dann löst $\Psi(x,t) = \sum_nc_n\psi_n(x)\,e^{-iE_nt/\hbar}$ die zeitabhängige Schrödingergleichung. Jeder Summand behält seinen eigenen Phasenfaktor. Mini-Beispiel: $\psi_2$ dreht sich viermal so schnell wie $\psi_1$.`},
        num:{title:'Ein Zustand aus Abschnitt 4', text:R`Für $\Psi(x,0) = \tfrac{1}{\sqrt{10}}(3\psi_1 - \psi_3)$ und $E_3 = 9E_1$ ist

$$\Psi(x,t) = \tfrac{3}{\sqrt{10}}\,\psi_1\,e^{-iE_1t/\hbar} - \tfrac{1}{\sqrt{10}}\,\psi_3\,e^{-9iE_1t/\hbar}.$$

Der zweite Zeiger dreht sich neunmal so schnell wie der erste.`},
        text:R`Ist $\Psi(x,0) = \sum_nc_n\psi_n$ zerlegt, folgt die [[lex:zeitentwicklung|Zeitentwicklung]] ohne weitere Rechnung (Thema 2). Jeder Anteil bekommt seinen eigenen Phasenfaktor:

$$\Psi(x,t) = \sum_n c_n\,\psi_n(x)\,e^{-iE_nt/\hbar}.$$

**Rezept für jedes Anfangswertproblem im Kasten:**

1. Prüfen, ob $\Psi(x,0)$ normiert ist; sonst normieren.
2. $c_n = \int_0^L\psi_n\,\Psi(x,0)\,dx$ berechnen.
3. An jeden Summanden $e^{-iE_nt/\hbar}$ hängen.
4. Gesuchte Größen ausrechnen: Dichte, Erwartungswerte, Wahrscheinlichkeiten.`,
        q:{q:R`Welcher Zeitfaktor gehört im Kasten an $\psi_3$?`,
          opts:[R`$e^{-3iE_1t/\hbar}$`, R`$e^{+9iE_1t/\hbar}$`, R`$e^{-iE_1t/\hbar}$, wie an alle Anteile`, R`$e^{-9iE_1t/\hbar}$`], a:3,
          ex:R`$E_3 = 3^2E_1 = 9E_1$, und der Zeitfaktor ist $e^{-iE_3t/\hbar}$.`,
          fb:[R`Die Energie wächst wie $n^2$, nicht wie $n$: $E_3 = 9E_1$.`,
            R`Das Vorzeichen ist durch $i\hbar\,\partial_t$ festgelegt: Der Zeitfaktor ist $e^{-iEt/\hbar}$ mit Minus.`,
            R`Jeder Anteil hat seine eigene Energie und damit seinen eigenen Zeitfaktor.`,
            '']}},
      {id:'kasten-t5b', title:'Die Dichte atmet',
        num:{title:'Die Dichte in der Mitte', text:R`Bei $x = L/2$ ($L = 1$) ist $\psi_1 = \sqrt2$ und $\psi_3 = -\sqrt2$. Dort ist

$$|\Psi|^2 = \tfrac{9}{10}\cdot2 + \tfrac{1}{10}\cdot2 - \tfrac35\cdot\left(-2\right)\cos\frac{8E_1t}{\hbar} = 2 + 1{,}2\cos\frac{8E_1t}{\hbar},$$

also $3{,}2$ bei $t = 0$ und $0{,}8$ nach einer halben Periode des Mischterms.`},
        text:R`Für $\Psi(x,0) = \frac{1}{\sqrt{10}}(3\psi_1 - \psi_3)$ zeigt die Herleitung

$$|\Psi(x,t)|^2 = \tfrac{9}{10}\psi_1^2 + \tfrac{1}{10}\psi_3^2 - \tfrac35\,\psi_1\psi_3\cos\frac{(E_3 - E_1)t}{\hbar}.$$

Die Dichte „atmet“ mit der Kreisfrequenz $(E_3 - E_1)/\hbar = 8E_1/\hbar$: Sie zieht sich abwechselnd zur Mitte zusammen und läuft wieder auseinander. $\langle x\rangle$ bleibt dabei $L/2$, denn $\psi_1$ und $\psi_3$ sind beide symmetrisch um die Mitte. Ein konstantes $\langle x\rangle$ heißt also nicht, dass der Zustand stationär ist. Konstant sind die Gewichte $|c_n|^2$ und damit $\langle H\rangle = \sum_n|c_n|^2E_n = \tfrac95E_1$.`,
        derive:{ctx:BOX({coords:['x', 't'], defs:{'Ψ(x,t)':'3/sqrt(10) ψ_1(x) e^(-i E_1 t/ħ) - 1/sqrt(10) ψ_3(x) e^(-i E_3 t/ħ)'}, state:'Ψ', normalized:true}),
          lines:[
            {l:'|Ψ(x,t)|^2 = 9/10 ψ_1(x)^2 + 1/10 ψ_3(x)^2 - 3/5 ψ_1(x) ψ_3(x) cos((E_3 - E_1) t/ħ)', w:'Mischterm: 2 Re(c_1* c_3 …)', why:{q:'Woher kommt der Vorfaktor $-\\tfrac35$ des Mischterms?', opts:['$2\\cdot\\frac{3}{\\sqrt{10}}\\cdot\\left(-\\frac{1}{\\sqrt{10}}\\right) = -\\frac{6}{10}$', '$\\frac{9}{10} - \\frac{1}{10} - \\frac{2}{10} = \\frac{6}{10}$, mit Minus', '$\\left(\\frac{3}{\\sqrt{10}}\\right)^2 \\cdot \\left(-\\frac{1}{\\sqrt{10}}\\right)^2 \\cdot 6$'], a:0, ex:'$|c_1\\psi_1e^{-i\\ldots} + c_3\\psi_3e^{-i\\ldots}|^2$ enthält $2c_1c_3\\psi_1\\psi_3\\cos((E_3 - E_1)t/\\hbar)$ für reelle $c_n$ und $\\psi_n$.'}},
            {l:'⟨x̂⟩ = L/2', w:'beide Anteile symmetrisch um L/2'},
            {l:'⟨Ĥ⟩ = 9/5 E_1', w:'Σ |c_n|² E_n'},
            {l:'Ψ(x, t + 4m L^2/(πħ)) = Ψ(x,t)', w:'Wiederkehr nach T = 2πħ/E_1', why:{q:'Warum kehrt der Zustand nach $T = 2\\pi\\hbar/E_1$ zurück?', opts:['Weil $e^{-iE_nT/\\hbar} = e^{-2\\pi in^2} = 1$ für alle $n$ ist', 'Weil die Gewichte $|c_n|^2$ zeitlich konstant sind', 'Weil jeder Zustand im Kasten stationär ist'], a:0, ex:'Alle Phasen drehen sich um ganzzahlige Vielfache von $2\\pi$. Das klappt, weil alle $E_n/E_1$ ganze Zahlen sind.'}}
          ]},
        q:{q:R`Bei welcher Überlagerung schwingt $\langle x\rangle$ mit der Zeit?`,
          opts:[R`$(\psi_1 + \psi_3)/\sqrt2$`, R`$(\psi_2 + \psi_4)/\sqrt2$`, R`$(\psi_1 + \psi_2)/\sqrt2$`], a:2,
          ex:R`Nur wenn ein symmetrischer und ein antisymmetrischer Anteil zusammenkommen, ist der Mischterm $\psi_m\psi_n$ antisymmetrisch um $L/2$ und verschiebt $\langle x\rangle$. In den beiden anderen Fällen „atmet“ die Dichte nur.`,
          fb:[R`$\psi_1$ und $\psi_3$ sind beide symmetrisch um die Mitte. Ihr Mischterm ist symmetrisch und verschiebt $\langle x\rangle$ nicht.`,
            R`$\psi_2$ und $\psi_4$ sind beide antisymmetrisch. Ihr Produkt ist symmetrisch, $\langle x\rangle$ bleibt bei $L/2$.`,
            '']}},
      {id:'kasten-t5c', title:'Zeitentwicklung als Spalte, Formel und Bild',
        num:{title:'Eine halbe Periode des Mischterms', text:R`Nach $t = \pi\hbar/(8E_1)$ ist $(E_3 - E_1)t/\hbar = \pi$. Der zweite Zeiger hat gegenüber dem ersten eine halbe Drehung aufgeholt. Bis auf die gemeinsame Phase ist aus $3\psi_1 - \psi_3$ dann $3\psi_1 + \psi_3$ geworden. Für $L = 1\,\mathrm{nm}$ sind das nur $0{,}69\,\mathrm{fs}$.`},
        text:R`Die Tafel zeigt die Zeitentwicklung in fünf Gestalten. In der Spalte dreht sich jeder Eintrag mit seiner eigenen Frequenz; seine Länge bleibt. In der Formel für die Dichte wird daraus der Kosinus des Mischterms. Im Bild siehst du die Dichte zu zwei Zeitpunkten: in der Mitte erst hoch, dann flach.

Lies die Tafel als Arbeitsanweisung. Was nur von den Beträgen der Einträge abhängt, ist zeitlich konstant: die Gewichte und $\langle H\rangle$. Was von den relativen Phasen abhängt, ändert sich: die Form der Dichte.`,
        reps:{obj:R`Der Zustand $(3\psi_1 - \psi_3)/\sqrt{10}$ im Lauf der Zeit`,
          rows:[
            {k:'worte', text:R`Zwei Zeiger, der zweite neunmal so schnell. Ihre Längen bleiben, ihr Winkel zueinander ändert sich.`},
            {k:'matrix', tex:R`\begin{pmatrix}c_1e^{-iE_1t/\hbar}\\ c_2e^{-iE_2t/\hbar}\\ c_3e^{-iE_3t/\hbar}\\ \vdots\end{pmatrix} = \frac{1}{\sqrt{10}}\begin{pmatrix}3\,e^{-iE_1t/\hbar}\\ 0\\ -e^{-9iE_1t/\hbar}\\ \vdots\end{pmatrix}`},
            {k:'formel', tex:R`|\Psi(x,t)|^2 = \tfrac{9}{10}\psi_1^2 + \tfrac{1}{10}\psi_3^2 - \tfrac35\,\psi_1\psi_3\cos\frac{8E_1t}{\hbar}`},
            {k:'graph', plot:{x:[-0.1, 1.1], dom:[0, 1], walls:[0, 1], y:[0, 3.5], xlab:'x/L', ylab:R`|\Psi|^2L`, ticks:[{x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}], yticks:[{y:0.8, lab:'0{,}8'}, {y:3.2, lab:'3{,}2'}]}, f:x => 0.2 * (3 * Math.sin(Math.PI * x) - Math.sin(3 * Math.PI * x)) ** 2, lab:'t = 0', f2:x => 0.2 * (3 * Math.sin(Math.PI * x) + Math.sin(3 * Math.PI * x)) ** 2, lab2:R`t = \pi\hbar/(8E_1)`,
              cap:R`Bei $t = 0$ ist die Dichte schmal und in der Mitte $3{,}2/L$ hoch. Eine halbe Periode des Mischterms später ist sie breit und in der Mitte nur $0{,}8/L$ hoch. Beide sind symmetrisch zur Mitte.`},
            {k:'physik', text:R`$\langle x\rangle = L/2$ zu jeder Zeit, $\langle H\rangle = \tfrac95E_1 \approx 0{,}68\,\mathrm{eV}$ für $L = 1\,\mathrm{nm}$. Nach $T = 2\pi\hbar/E_1 \approx 11\,\mathrm{fs}$ ist der Zustand wieder genau der alte.`}
          ],
          links:[
            {from:'worte', to:'matrix', rule:R`Jeden Zeiger als Eintrag $c_ne^{-iE_nt/\hbar}$ schreiben; die Länge ist $|c_n|$, die Drehgeschwindigkeit $E_n/\hbar$.`},
            {from:'matrix', to:'formel', rule:R`Einträge mit ihren $\psi_n$ multiplizieren, addieren und das Betragsquadrat bilden. Aus den Phasen zweier Einträge wird der Kosinus ihres Unterschieds.`},
            {from:'formel', to:'graph', rule:R`Für zwei Zeitpunkte den Kosinus einsetzen, $+1$ und $-1$, und die Dichte über $x$ zeichnen.`},
            {from:'graph', to:'physik', rule:R`Symmetrische Kurven heißen $\langle x\rangle = L/2$. Die Fläche bleibt $1$, und die Gewichte geben $\langle H\rangle$.`}
          ]},
        q:{q:R`Welche Größe kannst du allein aus den Beträgen der Einträge der Spalte ablesen, ohne $t$ zu kennen?`, tr:{from:'matrix', to:'physik'},
          opts:[R`$\langle H\rangle = \sum_n|c_n|^2E_n$`, R`die Dichte $|\Psi(L/2, t)|^2$ in der Mitte`, R`die Breite der Ortsverteilung`], a:0,
          ex:R`Die Beträge $|c_ne^{-iE_nt/\hbar}| = |c_n|$ hängen nicht von $t$ ab, und $\langle H\rangle$ braucht nur sie. Dichte und Breite hängen von den relativen Phasen ab.`,
          fb:['',
            R`Die Dichte in der Mitte schwankt zwischen $3{,}2/L$ und $0{,}8/L$. Dafür brauchst du die relative Phase.`,
            R`Die Breite „atmet“. Sie hängt vom Mischterm und damit von der relativen Phase ab.`]}},
      {id:'kasten-t5d', title:'Wiederkehr nach T = 2πħ/E₁',
        num:{title:R`Ein Elektron im $1\,\mathrm{nm}$-Kasten`, text:R`Mit $E_1 \approx 0{,}376\,\mathrm{eV}$ ist

$$T = \frac{2\pi\hbar}{E_1} = \frac{h}{E_1} \approx 11\,\mathrm{fs}.$$

Das Schwappen von $(\psi_1 + \psi_2)/\sqrt2$ hat die Periode $h/(3E_1) \approx 3{,}7\,\mathrm{fs}$, ein Drittel davon. Das Atmen von $(3\psi_1 - \psi_3)/\sqrt{10}$ hat $h/(8E_1) \approx 1{,}4\,\mathrm{fs}$.`},
        text:R`Im Kasten sind alle Energien ganzzahlige Vielfache von $E_1$. Nach der Zeit $T = 2\pi\hbar/E_1 = 4mL^2/(\pi\hbar)$ ist deshalb jeder Phasenfaktor $e^{-in^2\cdot2\pi} = 1$. Jeder Zustand im Kasten kehrt exakt in seine Anfangsform zurück.

Die einzelnen Mischterme haben kürzere Perioden, $h/(E_m - E_n)$, und alle passen ganzzahlig in $T$. Die exakte Wiederkehr ist eine Besonderheit des Kastens. In anderen Potentialen sind die Energien meist nicht so einfach verwandt, und ein Zustand kehrt höchstens näherungsweise zurück.`,
        q:{q:R`Nach welcher Zeit kehrt jeder Zustand im Kasten in seine Anfangsform zurück?`,
          opts:[R`nach $2\pi\hbar/(E_2 - E_1)$`, R`nach $2\pi\hbar/E_1$`, R`nie, die Phasen laufen auseinander`], a:1,
          ex:R`Nach $T = 2\pi\hbar/E_1$ hat jeder Anteil die Phase $2\pi n^2$ gedreht, ein Vielfaches von $2\pi$.`,
          fb:[R`Das ist die Periode des Mischterms von $\psi_1$ und $\psi_2$ allein. Für andere Anteile passt sie nicht.`,
            '',
            R`Weil alle $E_n/E_1$ ganze Zahlen sind, kommen die Phasen nach $T$ alle gleichzeitig wieder an.`]}},
      {id:'kasten-t5e', title:'Typischer Fehler: nur die Gewichte mitnehmen',
        num:{title:'Ohne Mischterm', text:R`Wer bei $(3\psi_1 - \psi_3)/\sqrt{10}$ nur die Gewichte $\tfrac{9}{10}$ und $\tfrac{1}{10}$ mitnimmt, schreibt $|\Psi|^2 = \tfrac{9}{10}\psi_1^2 + \tfrac{1}{10}\psi_3^2$. In der Mitte ergäbe das

$$\tfrac{9}{10}\cdot2 + \tfrac{1}{10}\cdot2 = 2\quad\text{statt}\quad 3{,}2\ \text{bei } t = 0,$$

und zu jeder Zeit denselben Wert.`},
        text:R`**Häufiger Fehler:** nur die Wahrscheinlichkeiten $|c_n|^2$ mitnehmen und die Phasen vergessen. Dann fehlt der Mischterm, und jeder Zustand scheint stationär zu sein. Das Beispiel zeigt, dass schon die Dichte bei $t = 0$ falsch wird.

Die Gewichte reichen für alles, was nicht von der Zeit abhängt: $\langle H\rangle$ und die Wahrscheinlichkeiten einer Energiemessung. Für die Dichte und für $\langle x\rangle$ brauchst du die Amplituden $c_n$ mit ihren Phasen und die Zeitfaktoren. Die Orthogonalität tilgt die Mischterme nur in Integralen über den ganzen Kasten, nicht an einer einzelnen Stelle.`,
        q:{q:R`Bei $(3\psi_1 - \psi_3)/\sqrt{10}$ erhält jemand in der Mitte die Dichte $2/L$ statt $3{,}2/L$ bei $t = 0$. Was fehlt in seiner Rechnung?`,
          opts:[R`die Normierung des Zustands`, R`der Mischterm $-\tfrac35\psi_1\psi_3\cos(8E_1t/\hbar)$`, R`der Zeitfaktor von $\psi_1$ allein`], a:1,
          ex:R`In der Mitte ist $\psi_1\psi_3 = -2/L$, also trägt der Mischterm bei $t = 0$ genau $+1{,}2/L$ bei.`,
          fb:[R`Die Gewichte $\tfrac{9}{10} + \tfrac{1}{10}$ sind richtig normiert. Es fehlt ein ganzer Term.`,
            '',
            R`Ein einzelner Zeitfaktor fällt im Betragsquadrat weg. Es fehlt der Term, in dem sich zwei Anteile treffen.`]}}
    ]},

    /* ===== Abschnitt 6: Energiemessung ===== */
    {id:'kasten-t6', title:'Energiemessung und der Zustand danach', steps:[
      {id:'kasten-t6a', title:'Mögliche Ergebnisse: nur die Eigenwerte',
        num:{title:'Zwei mögliche Werte', text:R`Für $(3\psi_1 - \psi_3)/\sqrt{10}$ im $1\,\mathrm{nm}$-Kasten kann eine Energiemessung nur

$$E_1 \approx 0{,}38\,\mathrm{eV}\qquad\text{oder}\qquad E_3 = 9E_1 \approx 3{,}38\,\mathrm{eV}$$

ergeben. Der Mittelwert $\langle H\rangle = \tfrac95E_1 \approx 0{,}68\,\mathrm{eV}$ kommt als Einzelergebnis nie vor.`},
        text:R`Was liefert eine Energiemessung an $\Psi = \sum_nc_n\psi_ne^{-iE_nt/\hbar}$? Die Antwort gehört zu den Postulaten der Quantenmechanik ([[lex:messpostulat|Messpostulat]], Thema 6). Für den Kasten heißt sie zuerst:

**Mögliche Ergebnisse** sind nur die Eigenwerte $E_n$, und zwar die, deren $c_n \ne 0$ ist. Der Mittelwert $\langle H\rangle$ kommt als Einzelergebnis nicht vor, wenn er kein Eigenwert ist. Jede einzelne Messung liefert also eine der Energien aus dem Niveau-Diagramm, nie einen Wert dazwischen.`,
        q:{q:R`Welche Ergebnisse kann eine Energiemessung an $(\psi_1 + \psi_2)/\sqrt2$ liefern?`,
          opts:[R`nur $\tfrac52E_1$, den Mittelwert`, R`jeden Wert zwischen $E_1$ und $4E_1$`, R`$E_1$ oder $4E_1$`], a:2,
          ex:R`Beteiligt sind $\psi_1$ und $\psi_2$, also sind $E_1$ und $E_2 = 4E_1$ möglich, sonst nichts.`,
          fb:[R`$\tfrac52E_1$ ist der Mittelwert vieler Messungen, aber kein Eigenwert. Einzeln kommt er nicht vor.`,
            R`Die Ergebnisse sind diskret: nur Eigenwerte, keine Zwischenwerte.`,
            '']}},
      {id:'kasten-t6b', title:'Wahrscheinlichkeiten: |cₙ|²',
        pre:{from:'m-stat', seg:'st-t1', title:'Diskrete Zufallsgrößen', text:R`Eine diskrete Zufallsgröße nimmt nur einzelne Werte $x_n$ an, jeden mit einer Wahrscheinlichkeit $P_n$, und es gilt $\sum_nP_n = 1$. Ihr Erwartungswert ist $\sum_nx_nP_n$. Mini-Beispiel: Werte $1$ und $9$ mit $P = 0{,}9$ und $0{,}1$ geben den Mittelwert $0{,}9 + 0{,}9 = 1{,}8$.`},
        num:{title:'Tausend Messungen', text:R`Präparierst du $1000$-mal den Zustand $(3\psi_1 - \psi_3)/\sqrt{10}$ und misst jedes Mal die Energie, findest du etwa $900$-mal $E_1$ und etwa $100$-mal $E_3$. Der Mittelwert der Ergebnisse liegt nahe

$$\langle H\rangle = 0{,}9\,E_1 + 0{,}1\cdot9E_1 = 1{,}8\,E_1.$$`},
        text:R`**Wahrscheinlichkeiten:** Das Ergebnis $E_n$ tritt mit der Wahrscheinlichkeit

$$P(E_n) = |c_n|^2$$

auf, zu jeder Zeit gleich, denn $|c_ne^{-iE_nt/\hbar}| = |c_n|$. Für ein einzelnes System ist $|c_n|^2$ eine Wahrscheinlichkeit. Für viele gleich präparierte Systeme ist es eine relative Häufigkeit, wie bei jeder diskreten Zufallsgröße (M9). Der Mittelwert vieler Messungen ist der Erwartungswert

$$\langle H\rangle = \sum_n|c_n|^2E_n.$$

Die Normierung des Zustands, $\sum_n|c_n|^2 = 1$, ist genau die Normierung dieser Verteilung.`,
        q:{q:R`$\Psi(x,0) = (\psi_1 + i\psi_2)/\sqrt2$. Wie groß ist $P(E_2)$?`,
          opts:[R`$-\tfrac12$`, R`$\tfrac{1}{\sqrt2}$`, R`$\tfrac12$`], a:2,
          ex:R`$c_2 = i/\sqrt2$, also $P(E_2) = |c_2|^2 = \tfrac12$. Die Phase $i$ beeinflusst Interferenz, nicht $|c_2|^2$.`,
          fb:[R`Das wäre $c_2^2 = (i/\sqrt2)^2$. Die Wahrscheinlichkeit ist das Betragsquadrat und nie negativ.`,
            R`Das ist der Betrag $|c_2|$, die Amplitude. Die Wahrscheinlichkeit ist ihr Quadrat.`,
            '']}},
      {id:'kasten-t6c', title:'Im Labor: viele Energiemessungen',
        num:{title:'Drei Niveaus mit Gewichten', text:R`Ein Zustand habe die Gewichte $|c_1|^2 = 0{,}5$, $|c_2|^2 = 0{,}3$ und $|c_3|^2 = 0{,}2$. Dann ist

$$\langle H\rangle = 0{,}5\cdot E_1 + 0{,}3\cdot4E_1 + 0{,}2\cdot9E_1 = 3{,}5\,E_1,$$

für $L = 1\,\mathrm{nm}$ etwa $1{,}32\,\mathrm{eV}$. Jede einzelne Messung liefert aber $E_1$, $4E_1$ oder $9E_1$.`},
        text:R`Im Labor stehen die Werte $1$, $2$, $3$ auf der Achse für die drei Ergebnisse, hier also für $n = 1, 2, 3$ mit den Energien $E_1$, $4E_1$, $9E_1$. Die Regler stellen die Gewichte $|c_n|^2$ ein; das Labor normiert sie auf die Summe $1$. Die blauen Balken sind $P(E_n) = |c_n|^2$. „100× messen“ misst an hundert frisch präparierten Systemen, die roten Balken zeigen die relativen Häufigkeiten.

Achtung beim Mittelwert: Die Achse zählt die Quantenzahl $n$. Die Anzeige $\langle n\rangle = \sum_n n\,|c_n|^2$ und der „Mittelwert der Messungen von $n$“ mitteln deshalb $n$, nicht die Energie: Mit den Gewichten aus dem Beispiel steht dort $1{,}7$, nicht $3{,}5$. Den Energiemittelwert zeigt das Labor erst, wenn du unter „Energiemittelwert ⟨E⟩“ „anzeigen“ wählst. Rechne die Frage vorher selbst, mit $E_n = n^2E_1$.`,
        fig:{lab:'measure', keep:'all', caption:R`Blau: $|c_n|^2$, also $P(E_n)$. Rot: relative Häufigkeiten der Messungen. Die Achse zählt $n = 1, 2, 3$; $\langle n\rangle$ ist nicht $\langle H\rangle$. Die Energie zeigt das Labor erst, wenn du „Energiemittelwert ⟨E⟩“ auf „anzeigen“ stellst.`},
        reps:{obj:'Energiemessung an einem Zustand mit drei Anteilen',
          rows:[
            {k:'worte', text:R`Jede Messung liefert eine der drei Energien, zufällig, aber mit festen Wahrscheinlichkeiten.`},
            {k:'formel', tex:R`\begin{aligned}P(E_n) &= |c_n|^2,\\ \langle H\rangle &= \sum_n|c_n|^2E_n\\ &= (0{,}5 + 0{,}3\cdot4 + 0{,}2\cdot9)\,E_1\\ &= 3{,}5\,E_1\end{aligned}`},
            {k:'labor', text:R`Messlabor im Bild: Regler $|c_1|^2 = 0{,}5$, $|c_2|^2 = 0{,}3$, $|c_3|^2 = 0{,}2$. Blaue Balken über $1, 2, 3$: die Wahrscheinlichkeiten. Rote Balken: die Häufigkeiten nach „100× messen“. Die Auswahl „Energiemittelwert ⟨E⟩“ blendet $\langle E\rangle$ in Einheiten von $E_1$ ein.`},
            {k:'physik', text:R`Von $1000$ Messungen ergeben etwa $500$ den Wert $E_1$, $300$ den Wert $4E_1$ und $200$ den Wert $9E_1$. Ihr Mittelwert liegt nahe $3{,}5\,E_1$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Feste Wahrscheinlichkeiten“ heißt $P(E_n) = |c_n|^2$; der Mittelwert ist die mit ihnen gewichtete Summe der Energien.`},
            {from:'formel', to:'labor', rule:R`Jedes $|c_n|^2$ mit dem Regler $n$ einstellen. Die Achsenwerte $1, 2, 3$ als $n$ lesen, nicht als Energie.`},
            {from:'labor', to:'physik', rule:R`Die roten Balken mal der Zahl der Messungen ergeben die Trefferzahlen; mit $E_n = n^2E_1$ gewichtet ergibt sich der Mittelwert der Energien.`}
          ]},
        q:{q:R`Nach $1000$ Messungen zeigen die roten Balken $0{,}49$, $0{,}31$ und $0{,}20$. Welcher Mittelwert der gemessenen Energien folgt daraus ungefähr?`, tr:{from:'labor', to:'formel'},
          opts:[R`$1{,}7\,E_1$`, R`$3{,}5\,E_1$`, R`$4{,}7\,E_1$`, R`$9\,E_1$`], a:1,
          ex:R`$0{,}49\cdot1 + 0{,}31\cdot4 + 0{,}20\cdot9 = 3{,}53$, also etwa $3{,}5\,E_1$.`,
          fb:[R`$1{,}7$ ist der Mittelwert der Achsenwerte $1, 2, 3$. Die Energien sind aber $1, 4, 9$ in Einheiten von $E_1$.`,
            '',
            R`$4{,}7$ ist der ungewichtete Mittelwert von $1$, $4$ und $9$. Die Werte kommen verschieden oft vor.`,
            R`$9E_1$ ist nur das höchste der drei Niveaus.`]}},
      {id:'kasten-t6d', title:'Der Zustand nach der Messung',
        pre:{from:'wf', seg:'wf-t3', title:'Kollaps', text:R`Eine Messung präpariert einen neuen Zustand. Nach einer Ortsmessung mit Ergebnis $x_0$ ist $\psi$ scharf um $x_0$ konzentriert; eine sofort folgende Messung bestätigt $x_0$. Das ist der Kollaps aus Thema 1. Danach entwickelt sich der neue Zustand nach der Schrödingergleichung weiter.`},
        num:{title:'Das linke Drittel', text:R`Für $\Psi = \sqrt{16/(5L)}\sin^3(\pi x/L)$ ist die Wahrscheinlichkeit im linken Drittel bei $t = 0$

$$\int_0^{L/3}|\Psi|^2\,dx = \frac13 - \frac{9\sqrt3}{20\pi} \approx 0{,}085.$$

Nach dem Messergebnis $E_3$ ist der Zustand $\psi_3$. Dann ist sie genau $\tfrac13$, denn jeder der drei Buckel von $|\psi_3|^2$ trägt ein Drittel.`},
        text:R`**Zustand danach:** Ergibt die Messung $E_n$, ist das System unmittelbar danach im Zustand $\psi_n$ (bis auf eine Phase). Das ist der [[lex:kollaps|Kollaps]] aus Thema 1, jetzt für die Energie.

Daraus folgt: Eine zweite Energiemessung ergibt sicher wieder $E_n$, sofort oder viel später. Denn $\psi_n$ ist stationär und kehrt nicht in die alte Überlagerung zurück. Auch die Ortsverteilung hat sich geändert, von $|\Psi|^2$ zu $|\psi_n|^2$. Die Herleitung rechnet das Beispiel nach. Weil die alte Überlagerung „atmet“, gilt die $0{,}085$ nur bei $t = 0$; ohne Messung schwankt der Wert zwischen $0{,}085$ und $\tfrac13$.`,
        derive:{ctx:BOX({defs:{'Ψ(x)':'sqrt(16/(5L)) sin(πx/L)^3'}, state:'Ψ', normalized:true}),
          lines:[
            {l:'|⟨ψ_3|Ψ⟩|^2 = 1/10', w:'P(E_3) vor der Messung'},
            {l:'∫_0^{L/3} |Ψ(x)|^2 dx = 1/3 - 9 sqrt(3)/(20π)', w:'P(0 < x < L/3) bei t = 0 vor der Messung, ≈ 0,085', why:{q:'Warum ist diese Wahrscheinlichkeit so klein?', opts:['Weil $|\\Psi|^2 \\propto \\sin^6$ am Rand sehr flach ist.', 'Weil $c_3$ negativ ist und Wahrscheinlichkeit abzieht.', 'Weil das linke Drittel außerhalb des Kastens liegt.'], a:0, ex:'Der Zustand ähnelt stark $\\psi_1$, nur noch schmaler. Im linken Drittel liegt deshalb wenig Wahrscheinlichkeit.'}},
            {l:'∫_0^{L/3} |ψ_3(x)|^2 dx = 1/3', w:'nach dem Messergebnis E_3', why:{q:'Warum ändert die Energiemessung die Ortsverteilung?', opts:['Der Zustand ist danach $\\psi_3$, mit drei gleichen Buckeln.', 'Die Messung stößt das Teilchen aus $x < L/3$ hinaus.', 'Sie ändert sie nicht; beide Zahlen müssen $0{,}085$ sein.'], a:0, ex:'Jeder der drei Buckel von $|\\psi_3|^2$ trägt die Wahrscheinlichkeit $1/3$; der erste liegt genau im linken Drittel.'}}
          ]},
        q:{q:R`An $(\psi_1 + \psi_2)/\sqrt2$ ergibt eine Energiemessung bei $t = 0$ den Wert $E_2$. Wie groß ist danach $P(0 < x < L/2)$?`,
          opts:[R`etwa $0{,}92$, wie vor der Messung`, R`$\tfrac12$`, R`$1$, das Teilchen ist links`], a:1,
          ex:R`Nach dem Ergebnis $E_2$ ist der Zustand $\psi_2$. $|\psi_2|^2$ ist symmetrisch zur Mitte, also liegt genau die Hälfte links.`,
          fb:[R`$0{,}92$ galt für die Überlagerung bei $t = 0$. Die Messung hat den Zustand auf $\psi_2$ reduziert.`,
            '',
            R`Eine Energiemessung legt den Ort nicht fest. $|\psi_2|^2$ hat je einen Buckel links und rechts.`]}},
      {id:'kasten-t6e', title:'Typischer Fehler: einen Operator anwenden heißt messen',
        num:{title:R`$\hat H\Psi$ ausgerechnet`, text:R`Für $\Psi = (3\psi_1 - \psi_3)/\sqrt{10}$ ist

$$\hat H\Psi = \frac{1}{\sqrt{10}}\left(3E_1\psi_1 - 9E_1\psi_3\right).$$

Normiert ist das $(\psi_1 - 3\psi_3)/\sqrt{10}$, mit den Gewichten $0{,}1$ und $0{,}9$. Das ist weder der alte Zustand noch ein Eigenzustand. Mit einer Messung hat es nichts zu tun.`},
        text:R`**Typische Fehlvorstellungen**, die zweite und die dritte untersuchen Singh & Marshman (2015):

- „Die Messung ergibt $\langle H\rangle$.“ Einzelne Messungen liefern nur Eigenwerte.
- „Nach der Messung kehrt das System mit der Zeit in den alten Zustand zurück.“ Nein: $\psi_n$ ist stationär.
- „$\hat H\Psi$ ist der Zustand nach der Messung.“ $\hat H\Psi = \sum_nc_nE_n\psi_n$ ist im Allgemeinen weder normiert noch ein Eigenzustand, wie das Beispiel zeigt.
- „Nach einer Ortsmessung hat das Teilchen noch seine alte Energie.“ Nach einer Ortsmessung ist $\psi$ ein schmaler Gipfel, also eine Überlagerung sehr vieler $\psi_n$. Eine Energiemessung danach kann viele Werte liefern (mehr in Thema 4).`,
        q:{q:R`Eine Energiemessung an $(3\psi_1 - \psi_3)/\sqrt{10}$ ergibt $E_3$. In welchem Zustand ist das System danach?`,
          opts:[R`in $(\psi_1 - 3\psi_3)/\sqrt{10}$, dem normierten $\hat H\Psi$`, R`in $\psi_3$`, R`weiter in $(3\psi_1 - \psi_3)/\sqrt{10}$`, R`in $\psi_1$, dem wahrscheinlicheren Zustand`], a:1,
          ex:R`Nach dem Ergebnis $E_3$ ist das System im Eigenzustand $\psi_3$. Eine zweite Messung ergibt sicher wieder $E_3$.`,
          fb:[R`Einen Operator anwenden ist keine Messung. $\hat H\Psi$ ist nicht einmal ein Eigenzustand.`,
            '',
            R`Eine Messung verändert den Zustand. Sonst könnte eine Wiederholung auch $E_1$ ergeben.`,
            R`Das Ergebnis war $E_3$. Der Zustand danach gehört zum gemessenen Wert, nicht zum wahrscheinlicheren.`]}}
    ]}
  ],
  example:{
    title:'Eigenfunktionen und Energien aus den Randbedingungen',
    text:'Im Inneren ($0 < x < L$) ist $V = 0$, außerhalb $V = \\infty$, also $\\psi = 0$ dort. Wegen der Stetigkeit gilt $\\psi(0) = \\psi(L) = 0$. Ansatz, diesmal mit Sinus und Kosinus: $\\psi(x) = A\\sin(kx) + B\\cos(kx)$.',
    ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', n:{int:[1, 5]}}, defs:{'ψ(x)':'A sin(k x) + B cos(k x)'},
      unknowns:{A:{ref:'sqrt(2/L)'}, B:{ref:'0', kind:'real'}, k:{ref:'nπ/L'}, E:{ref:'n^2 π^2 ħ^2/(2m L^2)'}}},
    lines:[
      {l:'-ħ^2/(2m) ψ\'\' = E ψ', why:{q:'Warum diese Gleichung?', opts:['Stationäre Schrödingergleichung mit $V = 0$ im Inneren', 'Normierung der Wellenfunktion im Inneren', 'Zeitabhängige Schrödingergleichung im Inneren'], a:0, ex:'Innen ist $V = 0$, also bleibt nur die kinetische Energie.'}},
      {l:'E = ħ^2 k^2/(2m)', why:{q:'Wie folgt das aus der Gleichung?', opts:['$\\psi\'\' = -k^2\\psi$ für den Ansatz', 'aus der Randbedingung $\\psi(0) = 0$', 'aus der Normierung $\\int|\\psi|^2 = 1$'], a:0, ex:'Für $A\\sin kx + B\\cos kx$ gilt $\\psi\'\' = -k^2\\psi$, also $\\frac{\\hbar^2k^2}{2m}\\psi = E\\psi$.'}},
      {l:'ψ(0) = B = 0', why:{q:'Was folgt aus $\\psi(0) = 0$?', opts:['$B = 0$, weil $\\sin 0 = 0$ und $\\cos 0 = 1$', '$A = 0$, weil $\\sin 0 = 0$ ist', '$k = 0$, weil sonst $\\psi(0) \\ne 0$ wäre'], a:0, ex:'Übrig bleibt $\\psi = A\\sin(kx)$.'}},
      {l:'ψ(L) = A sin(kL) = 0', why:{q:'Warum setzt man nicht einfach $A = 0$?', opts:['Dann wäre $\\psi \\equiv 0$, also kein Teilchen.', 'Weil $A$ erst durch die Normierung festgelegt wird.', 'Das darf man; es ist eine weitere Lösung.'], a:0, ex:'$\\psi = 0$ ist nicht normierbar. Also muss $\\sin(kL) = 0$ sein.'}},
      {l:'k = nπ/L', w:'n = 1, 2, 3, …', why:{q:'Warum nicht $n = 0$ oder negative $n$?', opts:['$n = 0$ gibt $\\psi \\equiv 0$; $-n$ gibt nur $-\\psi_n$.', 'Weil negative $n$ negative Energien ergäben.', 'Weil $n$ eine Zählnummer ist und Zählen bei 1 beginnt.'], a:0, ex:'$\\sin(-kx) = -\\sin(kx)$ unterscheidet sich nur durch die Phase $-1$. Und $E_{-n} = E_n$ ist positiv.'}},
      {l:'E = n^2 π^2 ħ^2/(2m L^2)', why:{q:'Was bedeutet das Ergebnis?', opts:['Nur diskrete Energien sind möglich; die kleinste ist $E_1 > 0$.', 'Jede Energie $E > 0$ ist möglich, wenn $n$ groß genug ist.', 'Die Energien hängen nicht von der Breite $L$ ab.'], a:0, ex:'Das ist die Quantisierung durch Einschluss. $E_1 > 0$ ist die Nullpunktsenergie.'}}
    ],
    faded:{id:'kasten-fade', title:'Jetzt du: Normierung von $\\psi_n = A\\sin(n\\pi x/L)$',
      text:'Bestimme $A > 0$. Benutze $\\int_0^L\\sin^2(n\\pi x/L)\\,dx = L/2$.',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', n:{int:[1, 5]}}, defs:{'ψ(x)':'A sin(nπ x/L)'}, unknowns:{A:{ref:'sqrt(2/L)', alt:['-sqrt(2/L)']}}},
      given:['∫_0^L |ψ|^2 dx = 1', '|A|^2 ∫_0^L sin(nπx/L)^2 dx = 1'],
      goals:[{id:'a', prompt:'Bestimme $A$.', type:'solve', unknown:'A', points:2, hints:['Das Integral ist angegeben; setze es ein.', '$|A|^2\\cdot L/2 = 1$; nach $A > 0$ auflösen.'],
        model:['∫_0^L |ψ|^2 dx = 1', '|A|^2 ∫_0^L sin(nπx/L)^2 dx = 1', {l:'|A|^2 L/2 = 1', gap:'|A|^2 · ▢ = 1'}, 'A = sqrt(2/L)']}]}
  },
  puzzle:{
    title:'Plötzlich doppelt so breit',
    text:'Ein Teilchen ist im Grundzustand $\\psi_1$ eines Kastens $0 < x < L$. Plötzlich wird die rechte Wand nach $x = 2L$ verschoben – so schnell, dass sich $\\psi$ dabei nicht ändert. Danach misst man die Energie.\n\nMit welcher Wahrscheinlichkeit erhält man die alte Grundzustandsenergie $E_1 = \\pi^2\\hbar^2/(2mL^2)$?',
    q:{q:'Deine Vermutung:', opts:['$0$, denn im neuen Kasten ist $E_1$ kein Niveau', '$1/2$', '$1$, denn $\\psi$ hat sich ja nicht geändert', 'etwa $0{,}36$'], a:1, ex:'Im neuen Kasten ist $E_1$ das Niveau $n = 2$, und $c\'_2 = 1/\\sqrt2$.'},
    reveal:'Im neuen Kasten der Breite $2L$ sind die Energien $E\'_n = \\frac{n^2\\pi^2\\hbar^2}{2m(2L)^2} = \\frac{n^2}{4}E_1$. Die alte Energie $E_1$ ist also das Niveau $n = 2$ des neuen Kastens. Mit $\\psi\'_n = \\sqrt{1/L}\\,\\sin(n\\pi x/2L)$ ist $\\psi\'_2 = \\sqrt{1/L}\\,\\sin(\\pi x/L)$, und\n\n$$c\'_2 = \\int_0^L\\sqrt{\\tfrac1L}\\sin\\tfrac{\\pi x}{L}\\cdot\\sqrt{\\tfrac2L}\\sin\\tfrac{\\pi x}{L}\\,dx = \\frac{1}{\\sqrt2},\\qquad P(E_1) = \\frac12.$$\n\nDer neue Grundzustand hat $c\'_1 = \\frac{4\\sqrt2}{3\\pi}$, also $P(E_1/4) = \\frac{32}{9\\pi^2} \\approx 0{,}36$. Der Rest verteilt sich auf ungerade $n \\ge 3$; gerade $n \\ge 4$ kommen nicht vor.\n\nDrei Lehren:\n\n- Ob ein Zustand „Grundzustand“ ist, hängt vom Hamilton-Operator ab. Derselbe Zustand $\\psi_1$ ist nach dem Verschieben eine Überlagerung.\n- Der wahrscheinlichste Messwert ist hier nicht die niedrigste Energie.\n- Der Mittelwert $\\langle H\\rangle$ bleibt $E_1$: $\\psi$ hat sich nicht geändert, und $\\langle H\\rangle = \\frac{\\hbar^2}{2m}\\int|\\psi\'|^2dx$ hängt nur von $\\psi$ ab.'
  },
  clarify:{
    core:'Im Kasten mit unendlich hohen Wänden gilt $\\psi(0) = \\psi(L) = 0$. Daraus folgen\n\n$$\\psi_n(x) = \\sqrt{\\tfrac{2}{L}}\\sin\\!\\left(\\frac{n\\pi x}{L}\\right),\\qquad E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2},\\qquad n = 1, 2, 3, \\dots$$\n\nDie $\\psi_n$ sind **orthonormal** ($\\langle\\psi_m|\\psi_n\\rangle = \\delta_{mn}$) und **vollständig**: Jeder Anfangszustand lässt sich entwickeln, $\\Psi(x,0) = \\sum_n c_n\\psi_n(x)$ mit $c_n = \\int_0^L\\psi_n(x)\\Psi(x,0)\\,dx$. Die Zeitentwicklung ist dann einfach: $\\Psi(x,t) = \\sum_n c_n\\psi_n(x)e^{-iE_nt/\\hbar}$.\n\nEine Energiemessung liefert $E_n$ mit Wahrscheinlichkeit $|c_n|^2$; der Mittelwert ist $\\langle H\\rangle = \\sum_n|c_n|^2E_n$. Nach dem Ergebnis $E_n$ ist das System im Zustand $\\psi_n$ und bleibt dort.',
    keys:[
      '$\\psi_n$ hat $n - 1$ Knoten im Inneren; die Wellenlänge ist $\\lambda_n = 2L/n$.',
      'Die Ableitung $\\psi\'$ springt an den Wänden – das ist hier erlaubt, weil $V$ dort unendlich ist.',
      'Für $c_n$ braucht man eigentlich $\\psi_n^*$; die $\\psi_n$ sind hier reell.',
      '$\\sum_n|c_n|^2 = 1$ ist eine gute Kontrolle der Rechnung.',
      'In jedem $\\psi_n$ ist $\\langle x\\rangle = L/2$ und $\\langle p\\rangle = 0$, aber $\\langle p^2\\rangle = (n\\pi\\hbar/L)^2 = 2mE_n$.',
      'Nach einer Energiemessung mit Ergebnis $E_n$ ist der Zustand $\\psi_n$; eine Wiederholung ergibt sicher wieder $E_n$.'
    ],
    errors:[
      'Die Energie aus $E = \\hbar k$ statt $E = \\hbar^2k^2/2m$ bilden.',
      'Bei Überlagerungen nur die Wahrscheinlichkeiten, nicht die Phasen $e^{-iE_nt/\\hbar}$ mitnehmen.',
      'Den Faktor $1/\\sqrt2$ der Normierung vergessen, z. B. $\\langle H\\rangle = E_1 + E_2$ statt $\\tfrac12(E_1 + E_2)$.',
      'Annehmen, das Teilchen sei immer in einem Eigenzustand. Eine Messung von $E$ kann verschiedene Werte liefern.',
      '$\\hat H\\Psi$ für den Zustand nach der Messung halten oder glauben, das System kehre nach der Messung in den alten Zustand zurück.'
    ],
    checks:[
      {q:'Der Kasten wird doppelt so breit. Was passiert mit $E_1$?', opts:['Sie wird ein Viertel so groß.', 'Sie halbiert sich, weil $E_1 \\propto 1/L$.', 'Sie bleibt gleich, weil $V$ innen null ist.'], a:0, ex:'$E_1 \\propto 1/L^2$.'},
      {q:'$\\Psi(x,0) = \\frac{1}{\\sqrt3}\\psi_1 + \\sqrt{\\frac23}\\psi_2$. Mit welcher Wahrscheinlichkeit misst man $E_2$?', opts:['$2/3$', '$\\sqrt{2/3}$', '$1/2$'], a:0, ex:'$P(E_2) = |c_2|^2 = 2/3$.'}
    ]
  },
  lab:{type:'box', sketch:SK.lab, title:'Eigenfunktionen im Kasten',
    text:'Die Linien zeigen die Energien $E_n$ in Einheiten von $E_1$; auf der Linie des eingestellten $n$ ist $\\psi_n$ (oder $|\\psi_n|^2$) eingezeichnet.',
    map:[
      {sym:'n', ctl:'Quantenzahl n', says:R`Die Quantenzahl aus $k_nL = n\pi$. Sie wählt das Niveau $E_n = n^2E_1$ und die Eigenfunktion $\psi_n$; die Linie dieses Niveaus wird hervorgehoben.`},
      {sym:R`E_n/E_1 = n^2`, ctl:'E / E₁', says:R`Die senkrechte Achse ist die Energie in Einheiten von $E_1 = \pi^2\hbar^2/(2mL^2)$. Die waagerechten Linien liegen bei $1, 4, 9, 16$; ihre Abstände wachsen wie $2n + 1$.`},
      {sym:R`\psi_n(x) = \sqrt{2/L}\,\sin(n\pi x/L)`, ctl:'ψₙ(x)', says:R`Anzeige der Eigenfunktion selbst, gezeichnet um die Höhe ihres Niveaus. Sie ist an beiden Wänden null und hat $n$ halbe Wellen; die Höhe der Kurve ist nicht maßstäblich.`},
      {sym:R`|\psi_n(x)|^2`, ctl:'|ψₙ(x)|²', says:R`Anzeige der Dichte: $n$ Buckel, getrennt durch $n - 1$ Knoten. Für großes $n$ wird sie im Mittel gleichmäßig, wie klassisch.`},
      {sym:R`\psi \leftrightarrow |\psi|^2`, ctl:'Anzeige', says:R`Wechselt zwischen $\psi_n$ und $|\psi_n|^2$. Vorzeichen und Symmetrie siehst du nur bei $\psi_n$, die Aufenthaltswahrscheinlichkeit nur bei $|\psi_n|^2$.`},
      {sym:R`n - 1`, ctl:'Knoten im Inneren', says:R`Die Anzeige zählt die Nullstellen von $\psi_n$ zwischen den Wänden (Knotenregel). Mehr Knoten heißt stärkere Krümmung und höhere Energie.`},
      {sym:R`x/L`, ctl:'x / L', says:R`Der Ort in Einheiten der Kastenbreite. Die dicken Striche bei $0$ und $1$ sind die unendlich hohen Wände; dort ist $\psi_n = 0$.`}
    ],
    predict:{q:'Vorhersage: Wie ändert sich der Abstand zwischen benachbarten Energieniveaus, wenn $n$ wächst?', opts:['Er wächst mit $n$.', 'Er bleibt gleich.', 'Er wird kleiner.'], a:0, ex:'$E_{n+1} - E_n = (2n + 1)E_1$: $3E_1$, $5E_1$, $7E_1$, … Beim Oszillator (Thema 7) sind die Abstände dagegen gleich.'},
    questions:[
      {q:'Stelle $n = 3$ ein. Wie viele Nullstellen hat $\\psi_3$ im Inneren des Kastens?', opts:['2', '3', '1'], a:0, ex:'$\\psi_n$ hat $n - 1$ Knoten im Inneren.'},
      {q:'Wie groß ist $E_3/E_1$?', opts:['9', '3', '6'], a:0, ex:'$E_n \\propto n^2$.'},
      {q:'Stelle $n = 4$ und die Anzeige $|\\psi_n|^2$ ein. Wie viele Maxima hat die Dichte?', opts:['4', '3', '8'], a:0, ex:'$|\\psi_n|^2$ hat $n$ Buckel, getrennt durch $n - 1$ Knoten.'}
    ],
    noPic:{q:'Ohne Bild: Wo ist $|\\psi_2|^2$ maximal?', opts:['bei $x = L/4$ und $x = 3L/4$', 'nur in der Mitte bei $x = L/2$', 'an den Wänden $x = 0$ und $x = L$'], a:0, ex:'$\\sin^2(2\\pi x/L)$ ist maximal, wo $2\\pi x/L = \\pi/2, 3\\pi/2$. Bei $L/2$ liegt ein Knoten.'}},
  compare:{
    text:'Gesucht ist $\\langle H\\rangle$ für $\\Psi = \\frac{1}{\\sqrt2}(\\psi_1 + \\psi_2)$. Zwei richtige Wege:',
    ctx:BOX({defs:{'Ψ(x)':'1/sqrt(2) (ψ_1(x) + ψ_2(x))'}, state:'Ψ', normalized:true}),
    A:{name:'Über die Koeffizienten', text:'Hier ist $c_1 = c_2 = 1/\\sqrt2$.', model:['⟨H⟩ = 1/2 E_1 + 1/2 E_2', '= 5/2 E_1']},
    B:{name:'Integral im Ortsraum', model:['⟨H⟩ = ∫_0^L Ψ^* (-ħ^2/(2m)) Ψ\'\' dx', '= 1/2 (E_1 + E_2)', '= 5/2 E_1']},
    questions:[
      {q:'Warum fallen bei Weg B die Mischterme weg?', opts:['Orthogonalität: $\\int\\psi_1\\hat H\\psi_2\\,dx = E_2\\int\\psi_1\\psi_2\\,dx = 0$', 'Weil das Produkt $\\psi_1\\psi_2$ überall null ist.', 'Weil sich $E_1$ und $E_2$ in der Summe gegenseitig aufheben.'], a:0, ex:'$\\hat H\\psi_2 = E_2\\psi_2$, und $\\psi_1 \\perp \\psi_2$. Das Produkt $\\psi_1\\psi_2$ ist nicht null, nur sein Integral.'},
      {q:'Ändert sich $\\langle H\\rangle$ mit der Zeit?', opts:['Nein, die $|c_n|^2$ bleiben konstant.', 'Ja, es schwingt mit $(E_2 - E_1)/\\hbar$.', 'Ja, es nimmt langsam ab.'], a:0, ex:'$|c_ne^{-iE_nt/\\hbar}|^2 = |c_n|^2$. Die Energie ist erhalten, obwohl $\\langle x\\rangle$ schwingt.'}
    ]
  },
  concept:[
    {id:'kasten-k1', type:'mc2', seg:'kasten-t6', q:'$\\Psi = (\\psi_1 + \\psi_2)/\\sqrt2$. Eine Energiemessung ergibt $E_2$. Was ergibt eine zweite Energiemessung unmittelbar danach?', opts:['sicher wieder $E_2$', '$E_1$ oder $E_2$, je mit $1/2$', 'sicher $E_1$, weil $E_2$ „verbraucht“ ist'], a:0, ex:'Die erste Messung hat den Zustand auf $\\psi_2$ reduziert.',
      reason:{q:'Warum?', opts:['Nach der Messung ist das System im Eigenzustand $\\psi_2$.', 'Messungen ändern die Wahrscheinlichkeiten $|c_n|^2$ nie.', 'Jede Messung wählt neu aus der alten Überlagerung aus.'], a:0, ex:'Messung mit Ergebnis $E_n$ heißt: Zustand danach $\\psi_n$. Eine sofortige Wiederholung bestätigt das Ergebnis.'}},
    {id:'kasten-k2', type:'dialog', seg:'kasten-t6', text:'Eine Energiemessung an $(\\psi_1 + \\psi_2)/\\sqrt2$ hat $E_2$ ergeben. Danach wartet man eine Stunde und misst wieder die Energie.',
      people:[{name:'Lena', says:'Mit der Zeit entwickelt sich das System zurück in die Überlagerung $(\\psi_1 + \\psi_2)/\\sqrt2$. Dann sind wieder $E_1$ und $E_2$ möglich.'}, {name:'Jonas', says:'Das System bleibt in $\\psi_2$; nur die Phase dreht sich. Die Messung ergibt auch nach einer Stunde sicher $E_2$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'$\\psi_2e^{-iE_2t/\\hbar}$ ist stationär. Die Vorstellung, ein System kehre nach der Messung in seinen alten Zustand zurück, ist in Studien gut dokumentiert (Singh & Marshman 2015) – sie ist falsch: Die Information über die alte Überlagerung ist nach der Messung verloren.'},
    {id:'kasten-k3', type:'mc2', seg:'kasten-t3', q:'Ein Teilchen ist im Grundzustand $\\psi_1$. Nach de Broglie passt eine halbe Wellenlänge in den Kasten, also $p = h/\\lambda_1 = \\pi\\hbar/L$. Was liefert eine Impulsmessung?', opts:['viele verschiedene Werte, am häufigsten nahe $p = 0$', 'nur $+\\pi\\hbar/L$ oder $-\\pi\\hbar/L$, je mit Wahrscheinlichkeit $1/2$', 'immer $p = 0$, weil $\\langle p\\rangle = 0$ ist'], a:0, ex:'Die Impulsverteilung von $\\psi_1$ ist kontinuierlich, hat ihr Maximum bei $p = 0$ und reicht über $\\pm\\pi\\hbar/L$ hinaus. Trotzdem ist $\\langle p^2\\rangle = (\\pi\\hbar/L)^2$.',
      reason:{q:'Warum?', opts:['$\\psi_1$ ist ein abgeschnittener Sinus, keine Überlagerung von nur zwei Wellen $e^{\\pm i\\pi x/L}$.', 'Im Kasten ist $\\sin(\\pi x/L) = (e^{i\\pi x/L} - e^{-i\\pi x/L})/2i$, also gibt es nur zwei Impulse.', 'Weil $\\psi_1$ reell ist, ist jeder einzelne Impulswert null.'], a:0, ex:'Die Zerlegung in $e^{\\pm i\\pi x/L}$ gilt nur innerhalb des Kastens; außerhalb ist $\\psi_1 = 0$. Die Fourier-Transformierte der ganzen Funktion (M6, Thema 4) ist kontinuierlich. Nur $\\langle p\\rangle = 0$ und $\\langle p^2\\rangle = (\\pi\\hbar/L)^2$ stimmen mit dem einfachen Bild überein.'}},
    {id:'kasten-k4', type:'mc2', seg:'kasten-t4', q:'$\\Psi(x,0) = A\\,x(L - x)$. Welche Werte kann eine Energiemessung liefern?', opts:['nur $E_n$ mit ungeradem $n$', 'jedes $E_n$ mit $n = 1, 2, 3, \\dots$', 'nur $E_1$, weil $\\Psi$ dem Grundzustand ähnelt', 'nur den Mittelwert $\\langle H\\rangle$'], a:0, ex:'$c_n = 8\\sqrt{15}/(n\\pi)^3$ für ungerade $n$, $c_n = 0$ für gerade $n$. $P(E_1) \\approx 0{,}9986$, aber nicht 1.',
      reason:{q:'Warum?', opts:['$\\Psi$ ist symmetrisch um $L/2$, die $\\psi_n$ mit geradem $n$ antisymmetrisch.', 'Gerade $n$ haben für diesen Zustand zu hohe Energien.', 'Die Parabel erfüllt die Randbedingungen nur für ungerade $n$.'], a:0, ex:'Das Integral einer um $L/2$ antisymmetrischen Funktion über den Kasten ist null. Die Höhe der Energie spielt keine Rolle.'}},
    {id:'kasten-k5', type:'dialog', seg:'kasten-t6', text:'Ein Teilchen ist im Zustand $(\\psi_1 + \\psi_2)/\\sqrt2$.',
      people:[{name:'Lena', says:'Jede einzelne Energiemessung ergibt $\\tfrac52E_1$, denn das ist die Energie dieses Zustands.'}, {name:'Jonas', says:'Eine einzelne Messung ergibt $E_1$ oder $4E_1$. $\\tfrac52E_1$ ist nur der Mittelwert vieler Messungen.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Messwerte sind Eigenwerte. Der Zustand hat keine scharfe Energie: $\\Delta H = \\tfrac32E_1$. $\\langle H\\rangle = \\tfrac52E_1$ ist der Mittelwert über ein Ensemble.'},
    {id:'kasten-k6', type:'mc2', seg:'kasten-t5', q:'Für $\\Psi(x,0) = (\\psi_2 + \\psi_3)/\\sqrt2$ schreibt jemand $|\\Psi(x,t)|^2 = \\tfrac12(\\psi_2^2 + \\psi_3^2)$, „weil die Mischterme wegen $\\int\\psi_2\\psi_3\\,dx = 0$ wegfallen“. Was stimmt?', opts:['Falsch: Der Mischterm mit $\\cos((E_3 - E_2)t/\\hbar)$ bleibt.', 'Richtig: Wegen der Orthogonalität fehlen alle Mischterme.', 'Richtig, weil $|c_2|^2$ und $|c_3|^2$ zeitlich konstant sind.'], a:0, ex:'Richtig ist $|\\Psi(x,t)|^2 = \\tfrac12(\\psi_2^2 + \\psi_3^2) + \\psi_2\\psi_3\\cos((E_3 - E_2)t/\\hbar)$: Die Dichte schwappt.',
      reason:{q:'Warum?', opts:['Orthogonalität tilgt Mischterme nur in Integralen über $x$, nicht an einer Stelle.', 'Mischterme gibt es nur, wenn die Koeffizienten komplex sind.', 'Die Phasen $e^{-iE_nt/\\hbar}$ heben sich im Betragsquadrat immer weg.'], a:0, ex:'Orthogonal heißt: Das Integral von $\\psi_2\\psi_3$ über den Kasten ist null. An einzelnen Stellen ist $\\psi_2\\psi_3$ nicht null. Deshalb fehlen die Mischterme in $\\int|\\Psi|^2dx = 1$ und in $\\langle H\\rangle$, aber nicht in $|\\Psi(x,t)|^2$. Hier schwingt sogar $\\langle x\\rangle$, weil $\\psi_2$ und $\\psi_3$ verschiedene Symmetrie haben.'}}
  ],
  practice:[
    {id:'kasten-p1', title:'Symmetrischer Kasten von −a bis a',
      text:'Der Kasten reicht jetzt von $-a$ bis $a$ (Breite $2a$). Der Grundzustand ist gerade: $\\psi(x) = A\\cos(kx)$.',
      ctx:{coords:['x'], domain:{x:['-a', 'a']}, params:{a:'pos', m:'pos'}, defs:{'ψ(x)':'A cos(k x)'}, unknowns:{k:{ref:'π/(2a)'}, A:{ref:'1/sqrt(a)', alt:['-1/sqrt(a)']}, E:{ref:'π^2 ħ^2/(8m a^2)'}}},
      goals:[
        {id:'a', prompt:'a) Bestimme das kleinste $k > 0$ aus der Randbedingung.', type:'solve', unknown:'k', points:2, ph:'ψ(a) = A cos(k a) = 0',
          hints:['Gesucht ist das kleinste $k$, für das die Randbedingung bei $x = a$ erfüllt ist.', '$\\psi(a) = A\\cos(ka) = 0$, und $\\cos u = 0$ zum ersten Mal bei $u = \\pi/2$.', '$ka = \\pi/2$; nach $k$ auflösen.'],
          model:['ψ(a) = A cos(k a) = 0', 'k a = π/2', 'k = π/(2a)']},
        {id:'b', prompt:'b) Bestimme die Grundzustandsenergie $E$.', type:'solve', unknown:'E', points:2, ph:'-ħ^2/(2m) ψ\'\' = E ψ',
          hints:['Setze den Ansatz in die stationäre Schrödingergleichung ein.', '$\\psi\'\' = -k^2\\psi$, also $E = \\hbar^2k^2/(2m)$.', 'Setze $k = \\pi/(2a)$ aus a) ein.'],
          model:['-ħ^2/(2m) ψ\'\' = E ψ', 'ħ^2 k^2/(2m) = E', 'E = π^2 ħ^2/(8m a^2)'],
          note:'Kontrolle: Mit der Breite $L = 2a$ ist das genau $E_1 = \\pi^2\\hbar^2/(2mL^2)$.'},
        {id:'c', prompt:'c) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normierung über den ganzen Kasten von $-a$ bis $a$.', '$\\cos^2u = \\tfrac12(1 + \\cos 2u)$; über eine halbe Periode bleibt nur der konstante Teil.', '$\\int_{-a}^a\\cos^2(\\pi x/2a)\\,dx = a$.'],
          model:['∫_-a^a |ψ|^2 dx = 1', '|A|^2 ∫_-a^a cos(πx/(2a))^2 dx = 1', '|A|^2 a = 1', 'A = 1/sqrt(a)']}
      ]},
    {id:'kasten-p2', title:'Entwicklung eines Anfangszustands',
      text:'Zur Zeit $t = 0$ ist $\\Psi(x,0) = \\sqrt{30/L^5}\\,x(L-x)$ (normiert, siehe Thema 1). Entwickle nach $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$. Nützlich: $\\int_0^Lx(L-x)\\sin(\\pi x/L)\\,dx = 4L^3/\\pi^3$.',
      ctx:BOX({defs:{'Ψ(x)':'sqrt(30/L^5) x (L - x)'}, state:'Ψ', normalized:true}),
      goals:[
        {id:'a', prompt:'a) Berechne $c_1 = \\langle\\psi_1|\\Psi\\rangle$.', type:'value', target:'8 sqrt(15)/π^3', points:3, ph:'c_1 = ⟨ψ_1|Ψ⟩',
          hints:['$c_1$ ist die Projektion von $\\Psi$ auf $\\psi_1$: ein Integral über den Kasten.', '$c_1 = \\int_0^L\\psi_1(x)\\Psi(x,0)\\,dx$. Zieh die Konstanten $\\sqrt{2/L}\\sqrt{30/L^5} = \\sqrt{60}/L^3$ vor das Integral.', 'Das Integral ist angegeben: $4L^3/\\pi^3$.'],
          model:['c_1 = ⟨ψ_1|Ψ⟩', '= sqrt(2/L) sqrt(30/L^5) ∫_0^L x (L - x) sin(πx/L) dx', '= sqrt(60)/L^3 · 4L^3/π^3', '= 8 sqrt(15)/π^3']},
        {id:'b', prompt:'b) Mit welcher Wahrscheinlichkeit liefert eine Energiemessung $E_1$?', type:'value', target:'960/π^6', points:2, ph:'|⟨ψ_1|Ψ⟩|^2 = …',
          hints:['Die Wahrscheinlichkeit für den Messwert $E_1$ folgt aus dem Koeffizienten aus a).', '$P(E_1) = |c_1|^2$.', '$(8\\sqrt{15}/\\pi^3)^2 = 64\\cdot 15/\\pi^6$.'],
          model:['|⟨ψ_1|Ψ⟩|^2 = (8 sqrt(15)/π^3)^2', '= 960/π^6'], note:'$960/\\pi^6 \\approx 0{,}9986$: Die Parabel ähnelt dem Grundzustand sehr.'},
        {id:'c', prompt:'c) Berechne $\\langle H\\rangle$ direkt im Ortsraum.', type:'value', target:'5ħ^2/(m L^2)', points:3, ph:'⟨H⟩ = ∫_0^L Ψ (-ħ^2/(2m)) Ψ\'\' dx',
          hints:['Direkt im Ortsraum: $\\langle H\\rangle = \\int\\Psi\\,\\hat H\\Psi\\,dx$ mit $V = 0$ im Inneren.', '$\\Psi\'\' = -2\\sqrt{30/L^5}$ ist konstant.', '$\\int_0^Lx(L-x)\\,dx = L^3/6$.'],
          model:['⟨H⟩ = ∫_0^L Ψ (-ħ^2/(2m)) Ψ\'\' dx', '= ħ^2/m · 30/L^5 ∫_0^L x (L - x) dx', '= ħ^2/m · 30/L^5 · L^3/6', '= 5ħ^2/(m L^2)'],
          note:'Vergleich: $5\\hbar^2/(mL^2) = \\frac{10}{\\pi^2}E_1 \\approx 1{,}013\\,E_1$ – etwas über der Grundzustandsenergie, wie es sein muss.'}
      ]},
    {id:'kasten-p3', title:'Zeitentwicklung einer Überlagerung',
      text:'$\\Psi(x,t) = \\frac{1}{\\sqrt2}\\left(\\psi_1e^{-iE_1t/\\hbar} + \\psi_2e^{-iE_2t/\\hbar}\\right)$. Aus Thema 2 kennst du $\\langle x\\rangle(t) = \\frac L2 - \\frac{16L}{9\\pi^2}\\cos\\left(\\frac{(E_2-E_1)t}{\\hbar}\\right)$.',
      ctx:BOX({coords:['x', 't'], defs:{'Ψ(x,t)':'1/sqrt(2) (ψ_1(x) e^(-i E_1 t/ħ) + ψ_2(x) e^(-i E_2 t/ħ))'}, state:'Ψ', normalized:true}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle p\\rangle(t)$ über $\\langle p\\rangle = m\\,\\frac{d\\langle x\\rangle}{dt}$.', type:'value', target:'8ħ/(3L) sin((E_2 - E_1) t/ħ)', points:3, ph:'⟨p⟩ = m d/dt ⟨x⟩',
          hints:['Benutze den Zusammenhang $\\langle p\\rangle = m\\,d\\langle x\\rangle/dt$ aus Thema 1.', 'Leite den Kosinus nach $t$ ab: $\\frac{d}{dt}\\cos(\\omega t) = -\\omega\\sin(\\omega t)$.', '$\\omega = (E_2 - E_1)/\\hbar$ mit $E_2 - E_1 = 3\\pi^2\\hbar^2/(2mL^2)$.'],
          model:['⟨p⟩ = m d/dt ⟨x⟩', '= m d/dt (L/2 - 16L/(9π^2) cos((E_2 - E_1) t/ħ))', '= m · 16L/(9π^2) · (E_2 - E_1)/ħ · sin((E_2 - E_1) t/ħ)', '= 8ħ/(3L) sin((E_2 - E_1) t/ħ)'],
          note:'$\\langle p\\rangle = m\\,d\\langle x\\rangle/dt$ ist ein Spezialfall des Ehrenfest-Theorems (Thema 6).'},
        {id:'b', prompt:'b) Berechne $\\langle H\\rangle$ durch $m, L, \\hbar$.', type:'value', target:'5π^2 ħ^2/(4m L^2)', points:2,
          hints:['Den Energieerwartungswert bekommst du aus den Gewichten der Energien.', '$\\langle H\\rangle = \\sum|c_n|^2E_n$ mit $|c_1|^2 = |c_2|^2 = 1/2$.', '$\\tfrac12(E_1 + 4E_1) = \\tfrac52E_1$; setze $E_1$ ein.'],
          model:['⟨H⟩ = 1/2 E_1 + 1/2 E_2', '= 5π^2 ħ^2/(4m L^2)']}
      ]},
    {id:'kasten-p4', title:'Orthogonalität der Eigenfunktionen',
      text:'Zeige für ganze Zahlen $n \\ne j$, dass $\\psi_n$ und $\\psi_j$ orthogonal sind. Nützlich: $\\sin a\\sin b = \\tfrac12[\\cos(a - b) - \\cos(a + b)]$.',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', j:{int:[1, 4], ne:'n'}, n:{int:[1, 4]}}, defs:{'ψ_q(x)':'sqrt(2/L) sin(qπx/L)'}},
      goals:[
        {id:'a', prompt:'Berechne $\\langle\\psi_n|\\psi_j\\rangle$ für $n \\ne j$.', type:'value', target:'0', points:3, ph:'⟨ψ_n|ψ_j⟩ = 2/L ∫_0^L sin(nπx/L) sin(jπx/L) dx',
          hints:['Schreibe das Produkt zweier Sinusfunktionen als Differenz von Kosinusfunktionen.', '$\\sin a\\sin b = \\tfrac12[\\cos(a - b) - \\cos(a + b)]$; beide Kosinusse lassen sich direkt integrieren.', 'Die Stammfunktionen $\\sin((n\\pm j)\\pi x/L)$ sind bei $0$ und $L$ null.'],
          model:['⟨ψ_n|ψ_j⟩ = 2/L ∫_0^L sin(nπx/L) sin(jπx/L) dx', '= 1/L ∫_0^L (cos((n - j)πx/L) - cos((n + j)πx/L)) dx', '= 1/L [L sin((n - j)πx/L)/((n - j)π) - L sin((n + j)πx/L)/((n + j)π)]_0^L', '= 0']}
      ]},
    {id:'kasten-p5', title:'Unschärfen im n-ten Zustand',
      text:'$\\psi(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$. Es gilt $\\langle x\\rangle = L/2$ und $\\langle p\\rangle = 0$. Nützlich: $\\frac2L\\int_0^Lx^2\\sin^2(n\\pi x/L)dx = L^2\\left(\\frac13 - \\frac{1}{2n^2\\pi^2}\\right)$.',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', n:{int:[1, 5]}}, defs:{'ψ(x)':'sqrt(2/L) sin(nπ x/L)'}, state:'ψ', normalized:true},
      goals:[
        {id:'a', prompt:'a) Berechne $\\Delta x$.', type:'value', target:'L sqrt(1/12 - 1/(2n^2π^2))', points:3, ph:'⟨x^2⟩ = 2/L ∫_0^L x^2 sin(nπx/L)^2 dx',
          hints:['Erst $\\langle x^2\\rangle$, dann $\\Delta x$ mit $\\langle x\\rangle = L/2$.', '$\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$; das Integral für $\\langle x^2\\rangle$ ist angegeben.', '$L^2\\left(\\frac13 - \\frac{1}{2n^2\\pi^2}\\right) - \\frac{L^2}{4}$ zusammenfassen und die Wurzel ziehen.'],
          model:['⟨x^2⟩ = 2/L ∫_0^L x^2 sin(nπx/L)^2 dx', '= L^2 (1/3 - 1/(2n^2π^2))', 'Δx = sqrt(L^2 (1/3 - 1/(2n^2π^2)) - L^2/4)', '= L sqrt(1/12 - 1/(2n^2π^2))']},
        {id:'b', prompt:'b) Berechne $\\Delta p$.', type:'value', target:'nπħ/L', points:2, ph:'⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx',
          hints:['Wegen $\\langle p\\rangle = 0$ reicht $\\langle p^2\\rangle$.', '$\\hat p^2 = -\\hbar^2d^2/dx^2$ und $\\psi\'\' = -(n\\pi/L)^2\\psi$.', 'Mit der Normierung bleibt $\\langle p^2\\rangle = (n\\pi\\hbar/L)^2$; noch die Wurzel ziehen.'],
          model:['⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx', '= (nπħ/L)^2', 'Δp = nπħ/L'],
          note:'Für $n = 1$: $\\Delta x\\,\\Delta p = \\hbar\\sqrt{\\pi^2/12 - 1/2} \\approx 0{,}57\\,\\hbar > \\hbar/2$.'}
      ]}
  ],
  sketch:[SK.s1, SK.s2],
  final:[
    {aim:0, task:{id:'kasten-f1', title:'Ungerader Zustand im symmetrischen Kasten', text:'Ein Kasten reicht von $-a$ bis $a$ (dort $V = 0$, außen $V = \\infty$). Der tiefste Zustand, der um $x = 0$ ungerade ist, hat die Form $\\psi(x) = A\\sin(kx)$ mit $k > 0$.',
      ctx:{coords:['x'], domain:{x:['-a', 'a']}, params:{a:'pos', m:'pos', A:'pos'}, defs:{'ψ(x)':'A sin(k x)'}, unknowns:{k:{ref:'π/a'}, E:{ref:'π^2 ħ^2/(2m a^2)'}}},
      goals:[{id:'a', prompt:'Bestimme seine Energie $E$ aus Randbedingung und Schrödingergleichung.', type:'solve', unknown:'E', points:3, model:['ψ(a) = A sin(k a) = 0', 'k a = π', 'k = π/a', '-ħ^2/(2m) ψ\'\' = E ψ', 'E = ħ^2 k^2/(2m)', 'E = π^2 ħ^2/(2m a^2)']}]}},
    {aim:1, task:{id:'kasten-f2', title:'Wahrscheinlichkeit einer Energie', text:'Im Kasten $0 < x < L$ ist $\\Psi(x,0) = A\\,\\sin(\\pi x/L)\\,\\left(1 + \\cos(\\pi x/L)\\right)$ mit einer Normierungskonstanten $A > 0$.',
      ctx:BOX({defs:{'Ψ(x)':'A sin(πx/L) (1 + cos(πx/L))'}, unknowns:{A:{ref:'sqrt(8/(5L))'}}}),
      goals:[{id:'a', prompt:'Mit welcher Wahrscheinlichkeit liefert eine Energiemessung $E_2$?', type:'value', target:'1/5', points:3, model:['Ψ(x) = A (sin(πx/L) + 1/2 sin(2πx/L))', '= A sqrt(L/2) (ψ_1(x) + 1/2 ψ_2(x))', '|A|^2 L/2 (1 + 1/4) = 1', 'A = sqrt(8/(5L))', '|⟨ψ_2|Ψ⟩|^2 = (A sqrt(L/2) · 1/2)^2', '= 1/5']}]}},
    {aim:2, task:{id:'kasten-f3', title:'Energieerwartungswert', text:'Im Kasten ist $\\Psi(x,0) = \\frac{1}{\\sqrt5}\\left(\\psi_1(x) + 2\\psi_2(x)\\right)$.',
      ctx:BOX({defs:{'Ψ(x)':'1/sqrt(5) (ψ_1(x) + 2 ψ_2(x))'}, state:'Ψ', normalized:true}),
      goals:[{id:'a', prompt:'Berechne $\\langle H\\rangle$ zu einer beliebigen Zeit $t > 0$, ausgedrückt durch $m$, $L$ und $\\hbar$.', type:'value', target:'17π^2 ħ^2/(10m L^2)', points:2, model:['⟨H⟩ = 1/5 E_1 + 4/5 E_2', '= 1/5 E_1 + 16/5 E_1', '= 17/5 E_1', '= 17π^2 ħ^2/(10m L^2)']}]}},
    {aim:0, sketch:SK.fA},
    {aim:'k', id:'kasten-fk1', type:'mc2', q:'Eine Energiemessung an $(\\psi_1 + 2\\psi_2)/\\sqrt5$ ergibt $E_2$. Direkt danach misst man den Ort. Wie groß ist $P(0 < x < L/2)$?', opts:['genau $1/2$', '$4/5$, das Gewicht von $\\psi_2$', 'je nach Messzeitpunkt verschieden'], a:0, ex:'Nach der Energiemessung ist der Zustand $\\psi_2$.',
      reason:{q:'Warum?', opts:['Der Zustand ist jetzt $\\psi_2$, und $|\\psi_2|^2$ ist symmetrisch um $L/2$.', 'Die Ortsverteilung hängt nur von den Gewichten $|c_n|^2$ ab.', 'Eine Energiemessung ändert die Ortsverteilung nicht.'], a:0, ex:'$|\\psi_2|^2$ hat zwei gleiche Buckel links und rechts der Mitte. Vor der Messung war die Verteilung eine andere – die Messung hat den Zustand verändert.'}},
    {aim:'k', id:'kasten-fk2', type:'dialog', text:'Ein Teilchen ist sicher im Grundzustand $\\psi_1$. Eine Ortsmessung findet es in einem schmalen Bereich um $x_0 = L/3$. Danach misst man die Energie.',
      people:[{name:'Lena', says:'Weil das Teilchen vorher im Grundzustand war, ergibt die Energiemessung sicher $E_1$.'}, {name:'Jonas', says:'Die Ortsmessung hat den Zustand in einen schmalen Gipfel verwandelt. Jetzt sind viele verschiedene $E_n$ möglich.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Ein schmaler Gipfel ist eine Überlagerung vieler $\\psi_n$. Die Ortsmessung hat die Information „Grundzustand“ zerstört.'}
  ],
  finalB:[
    {aim:0, task:{id:'kasten-fB1', title:'Zweiter gerader Zustand im symmetrischen Kasten', text:'Ein Kasten reicht von $-a$ bis $a$ (dort $V = 0$, außen $V = \\infty$). Die geraden Zustände haben die Form $\\psi(x) = A\\cos(kx)$ mit $k > 0$.',
      ctx:{coords:['x'], domain:{x:['-a', 'a']}, params:{a:'pos', m:'pos', A:'pos'}, defs:{'ψ(x)':'A cos(k x)'}, unknowns:{k:{ref:'3π/(2a)'}, E:{ref:'9π^2 ħ^2/(8m a^2)'}}},
      goals:[{id:'a', prompt:'Bestimme die Energie $E$ des zweitniedrigsten geraden Zustands.', type:'solve', unknown:'E', points:3, model:['ψ(a) = A cos(k a) = 0', 'k a = 3π/2', 'k = 3π/(2a)', '-ħ^2/(2m) ψ\'\' = E ψ', 'E = ħ^2 k^2/(2m)', 'E = 9π^2 ħ^2/(8m a^2)']}]}},
    {aim:1, task:{id:'kasten-fB2', title:'Wahrscheinlichkeit einer Energie', text:'Im Kasten $0 < x < L$ ist $\\Psi(x,0) = A\\,\\sin(\\pi x/L)\\,\\left(3 + 2\\cos(\\pi x/L)\\right)$ mit einer Normierungskonstanten $A > 0$.',
      ctx:BOX({defs:{'Ψ(x)':'A sin(πx/L) (3 + 2 cos(πx/L))'}, unknowns:{A:{ref:'sqrt(1/(5L))'}}}),
      goals:[{id:'a', prompt:'Mit welcher Wahrscheinlichkeit liefert eine Energiemessung $E_1$?', type:'value', target:'9/10', points:3, model:['Ψ(x) = A (3 sin(πx/L) + sin(2πx/L))', '= A sqrt(L/2) (3 ψ_1(x) + ψ_2(x))', '|A|^2 L/2 (9 + 1) = 1', 'A = sqrt(1/(5L))', '|⟨ψ_1|Ψ⟩|^2 = (3 A sqrt(L/2))^2', '= 9/10']}]}},
    {aim:2, task:{id:'kasten-fB3', title:'Energieerwartungswert', text:'Im Kasten ist $\\Psi(x,0) = \\frac{1}{\\sqrt5}\\left(2\\psi_1(x) + \\psi_3(x)\\right)$.',
      ctx:BOX({defs:{'Ψ(x)':'1/sqrt(5) (2 ψ_1(x) + ψ_3(x))'}, state:'Ψ', normalized:true}),
      goals:[{id:'a', prompt:'Berechne $\\langle H\\rangle$ zu einer beliebigen Zeit $t > 0$, ausgedrückt durch $m$, $L$ und $\\hbar$.', type:'value', target:'13π^2 ħ^2/(10m L^2)', points:2, model:['⟨H⟩ = 4/5 E_1 + 1/5 E_3', '= 4/5 E_1 + 9/5 E_1', '= 13/5 E_1', '= 13π^2 ħ^2/(10m L^2)']}]}},
    {aim:0, sketch:SK.fB},
    {aim:'k', id:'kasten-fBk1', type:'mc2', q:'Im Zustand $(\\psi_1 + \\psi_2)/\\sqrt2$ schwingt $\\langle x\\rangle$. Eine Energiemessung ergibt $E_1$. Wie verhält sich $\\langle x\\rangle$ danach?', opts:['Es bleibt konstant bei $L/2$.', 'Es schwingt weiter wie zuvor.', 'Es schwingt mit halber Amplitude.'], a:0, ex:'Nach der Messung ist der Zustand $\\psi_1$.',
      reason:{q:'Warum?', opts:['Nach der Messung ist der Zustand $\\psi_1$, und der ist stationär.', 'Eine Energiemessung betrifft den Ort nicht, also bleibt alles wie vorher.', 'Jede Messung halbiert die Amplitude der Schwingung.'], a:0, ex:'Ohne den Anteil $\\psi_2$ fehlt der Mischterm, der $\\langle x\\rangle$ schwingen ließ.'}},
    {aim:'k', id:'kasten-fBk2', type:'dialog', text:'Ein Teilchen ist im Zustand $\\psi_3$. Eine Ortsmessung findet es in einem schmalen Bereich um $x_0 = L/2$, genau am mittleren Maximum von $|\\psi_3|^2$. Danach misst man die Energie.',
      people:[{name:'Lena', says:'Das Teilchen wurde dort gefunden, wo $|\\psi_3|^2$ am größten ist. Die Ortsmessung passt also zu $\\psi_3$ und ändert nichts: Die Energiemessung ergibt sicher $E_3$.'}, {name:'Jonas', says:'Nach der Ortsmessung ist der Zustand ein schmaler Gipfel um $L/2$. Der enthält viele $\\psi_n$; $E_3$ ist nur einer von vielen möglichen Werten.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Auch ein „passender“ Messwert verändert den Zustand: $\\psi_3$ ist über den ganzen Kasten verteilt, der Gipfel nach der Messung nicht. Ein schmaler Gipfel um $L/2$ ist symmetrisch um die Mitte und enthält deshalb viele $\\psi_n$ mit ungeradem $n$, mit ähnlichen Gewichten.'}
  ],
  errors:[
    {id:'kasten-e1', title:'Energieerwartungswert einer Überlagerung',
      text:'Für $\\Psi = \\frac{1}{\\sqrt2}(\\psi_1 + \\psi_2)$ wird $\\langle H\\rangle$ berechnet:',
      ctx:BOX({defs:{'Ψ(x)':'1/sqrt(2) (ψ_1(x) + ψ_2(x))'}, state:'Ψ', normalized:true}),
      lines:['⟨H⟩ = ⟨Ψ|Ĥ|Ψ⟩', '= ⟨ψ_1|Ĥ|ψ_1⟩ + ⟨ψ_2|Ĥ|ψ_2⟩', '= E_1 + E_2', '= 5E_1'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Der Faktor $(1/\\sqrt2)^2 = 1/2$ aus der Normierung fehlt.', 'Die Mischterme fehlen; sie sind hier nicht null.', '$\\langle\\psi_2|\\hat H|\\psi_2\\rangle$ ist nicht gleich $E_2$.'], a:0, ex:'Die Mischterme sind wegen der Orthogonalität tatsächlich null. Aber jeder Diagonalterm trägt $|c_n|^2 = 1/2$.'},
      fix:{id:'a', prompt:'Berichtige: Wie groß ist $\\langle H\\rangle$ in Einheiten von $E_1$?', type:'value', target:'5/2 E_1', model:['⟨H⟩ = 1/2 (⟨ψ_1|Ĥ|ψ_1⟩ + ⟨ψ_2|Ĥ|ψ_2⟩)', '= 1/2 (E_1 + E_2)', '= 5/2 E_1']}}
  ]
});
})();
lexe('kasten', 'Unendlicher Potentialtopf', '$V = 0$ für $0 < x < L$, sonst $\\infty$. Randbedingungen $\\psi(0) = \\psi(L) = 0$. Eigenfunktionen $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$, Energien $E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$, $n = 1, 2, \\dots$ In $\\psi_n$: $\\langle x\\rangle = L/2$, $\\langle p\\rangle = 0$, $\\langle p^2\\rangle = (n\\pi\\hbar/L)^2$. Jeder Zustand kehrt nach $T = 2\\pi\\hbar/E_1$ in seine Anfangsform zurück.', {topic:'kasten'});
lexe('nullpunktsenergie', 'Nullpunktsenergie', 'Die kleinste mögliche Energie eines gebundenen Teilchens ist größer als das Minimum des Potenzials. Im Kasten $E_1 = \\pi^2\\hbar^2/(2mL^2)$, beim Oszillator $\\hbar\\omega/2$. Ursache: Einschluss erzwingt $\\Delta p > 0$.', {topic:'kasten'});
lexe('entwicklung', 'Entwicklung nach Eigenfunktionen', '$\\Psi(x,0) = \\sum_nc_n\\psi_n(x)$ mit $c_n = \\langle\\psi_n|\\Psi(0)\\rangle = \\int\\psi_n^*\\Psi(x,0)\\,dx$ (mit $\\psi_m$ multiplizieren, integrieren, Orthonormalität nutzen). Zeitentwicklung: $\\Psi(x,t) = \\sum_nc_n\\psi_ne^{-iE_nt/\\hbar}$. Kontrolle: $\\sum|c_n|^2 = 1$. $P(E_n) = |c_n|^2$, $\\langle H\\rangle = \\sum|c_n|^2E_n$.', {topic:'kasten'});
lexe('orthonormal', 'Orthonormalität', '$\\langle\\psi_m|\\psi_n\\rangle = \\int\\psi_m^*\\psi_n\\,dx = \\delta_{mn}$. Eigenfunktionen eines hermiteschen Operators zu verschiedenen Eigenwerten sind automatisch orthogonal; normiert man sie, sind sie orthonormal.', {topic:'kasten'});
lexe('zeitentwicklung', 'Zeitentwicklung', 'Bei zeitunabhängigem $\\hat H$: Jeder Energieanteil dreht seine Phase mit $e^{-iE_nt/\\hbar}$. Messbare Größen ändern sich nur durch Interferenz verschiedener Energien, mit den Kreisfrequenzen $(E_m - E_n)/\\hbar$. Die Gewichte $|c_n|^2$ und $\\langle H\\rangle$ bleiben konstant.', {topic:'kasten'});
lexe('knoten', 'Knotenregel', 'In einem eindimensionalen Potential hat die Eigenfunktion des $k$-ten gebundenen Zustands, nach steigender Energie gezählt und beim Grundzustand mit $k = 1$ beginnend, genau $k - 1$ Nullstellen (Knoten) im Inneren. Im Kasten hat $\\psi_n$ also $n - 1$ Knoten, beim Oszillator (Zählung ab $n = 0$) hat $\\psi_n$ genau $n$ Knoten. Mehr Knoten bedeuten stärkere Krümmung und höhere kinetische Energie.', {topic:'kasten'});
