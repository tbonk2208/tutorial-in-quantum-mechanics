/* ===== Thema 5: Stufe, Barriere, Tunneleffekt ===== */
(function(){
const R = String.raw;
const TUN_UP = () => ({coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['1.3 V_0', '3 V_0']}},
  defs:{k:'sqrt(2m E)/ħ', q:'sqrt(2m (E - V_0))/ħ', 'ψ_L(x)':'e^(i k x) + B e^(-i k x)', 'ψ_R(x)':'C e^(i q x)'},
  unknowns:{B:{ref:'(k - q)/(k + q)', kind:'real'}, C:{ref:'2k/(k + q)', kind:'real'}}});
const TUN_DOWN = () => ({coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['0.15 V_0', '0.85 V_0']}},
  defs:{k:'sqrt(2m E)/ħ', κ:'sqrt(2m (V_0 - E))/ħ', 'ψ_L(x)':'e^(i k x) + B e^(-i k x)', 'ψ_R(x)':'C e^(-κ x)'},
  unknowns:{B:{ref:'(k - iκ)/(k + iκ)', kind:'complex'}, C:{ref:'2k/(k + iκ)', kind:'complex'}, d:{ref:'1/(2κ)'}}});
const TUN_DELTA = () => ({coords:['x'], params:{m:'pos', α:'pos'}, defs:{'ψ(x)':'A e^(-κ |x|)'},
  unknowns:{κ:{ref:'m α/ħ^2'}, A:{ref:'sqrt(m α)/ħ', alt:['-sqrt(m α)/ħ']}, E:{ref:'-m α^2/(2ħ^2)', kind:'real'}}});
const TUN_STEP = (E) => ({coords:[], params:{m:'pos', V_0:'pos'}, defs:{E, k:'sqrt(2m E)/ħ', q:'sqrt(2m (E - V_0))/ħ'},
  unknowns:{B:{ref:'(k - q)/(k + q)', kind:'real'}, C:{ref:'2k/(k + q)', kind:'real'}}});
const TUN_SYN = () => ({coords:['x', 'k'], space:['x'], params:{m:'pos', α:'pos'}, defs:{κ:'m α/ħ^2', 'ψ(x)':'sqrt(κ) e^(-κ |x|)', 'φ(k)':'sqrt(2κ^3/π)/(κ^2 + k^2)'}, state:'ψ', normalized:true});
/* ---- Skizzenaufgaben (didaktik/SKIZZE.md): Musterfunktionen aus den exakten Lösungen, dimensionslos ---- */
const SK = (() => {
  const PI = Math.PI;
  /* ---- kleine komplexe Rechnung ---- */
  const C = (re, im) => [re, im || 0];
  const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const cdv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const cex = ph => [Math.cos(ph), Math.sin(ph)];
  /* tunnel-lab: Rechteckbarriere wie im Labor (Energie in V0, Länge in ħ/√(2mV0), also k = √E, κ = √(1 − E)), E = 0,5, Breite a = 2.
     Rechts ψ = t e^{ikx}; innen ψ = t e^{ika}[cosh κ(x − a) + (ik/κ) sinh κ(x − a)] (ψ, ψ' stetig bei a);
     bei 0 mit e^{ikx} + r e^{−ikx}: t e^{ika} = 1/[cosh κa + (i/2)(κ/k − k/κ) sinh κa], r = ψ(0) − 1.
     Ergebnis: T = |t|² ≈ 0,211 (wie im Labor), Re ψ in der Barriere fällt ohne Nullstelle von 1 auf |t| ≈ 0,46. Gezeigt wird Re ψ wie im Labor zur Phase 0.
     Bei E = V0/2 ist κ = k, also t·e^{ika} = 1/cosh κa reell und positiv: Phase 0 ist genau der Zeitpunkt mit ψ(a) > 0 reell; dann ist Re ψ innen
     |t| cosh κ(x − a) (monoton, Steigung 0 bei a). Zu anderen Zeiten ist Re ψ innen cos φ·cosh + sin φ·sinh: für φ ≈ 15°–70° (mod 180°) fast flach oder
     mit Nulldurchgang, links zeitweise fast null (stehende Welle). Deshalb nennt der Text den Zeitpunkt. */
  const BARL = (() => {
    const E = 0.5, a = 2, k = Math.sqrt(E), ka = Math.sqrt(1 - E);
    const ta = cdv(C(1), C(Math.cosh(ka * a), 0.5 * (ka / k - k / ka) * Math.sinh(ka * a)));     // t·e^{ika}
    const t = cm(ta, cex(-k * a));
    const inside = x => cm(ta, C(Math.cosh(ka * (x - a)), k / ka * Math.sinh(ka * (x - a))));
    const r = [inside(0)[0] - 1, inside(0)[1]];
    const psi = x => x < 0 ? [Math.cos(k * x) + r[0] * Math.cos(k * x) + r[1] * Math.sin(k * x), Math.sin(k * x) - r[0] * Math.sin(k * x) + r[1] * Math.cos(k * x)]
      : x <= a ? inside(x) : cm(t, cex(k * x));
    return {E, a, k, ka, t, r, T:t[0] ** 2 + t[1] ** 2, R:r[0] ** 2 + r[1] ** 2, psi, f:x => psi(x)[0]};
  })();
  const lab = {
    id:'tunnel-sk-lab', title:'Streuzustand an der Barriere mit $E < V_0$', kind:'curve', draw:'psi',
    text:'Ein Teilchen läuft von links mit $E = V_0/2$ auf eine Rechteckbarriere der Breite $a$ ($a = 2$ in den Einheiten des Labors). Skizziere $\\mathrm{Re}\\,\\psi$ über den ganzen Bereich zu dem Zeitpunkt, an dem $\\psi(a)$ reell und positiv ist: Die durchgelassene Welle hat bei $x = a$ gerade einen Wellenberg. Stell danach im Labor $E/V_0 = 0{,}5$, Breite $2$ und „nur Re ψ“ ein, ohne die Zeit laufen zu lassen, und vergleiche.',
    plot:{x:[-15, 15], xlab:'x', ylab:'\\mathrm{Re}\\,\\psi', ticks:[{x:-10, lab:'-10'}, {x:0, lab:'0'}, {x:2, lab:'a'}, {x:10, lab:'10'}], V:x => x > 0 && x < 2 ? 1 : 0, Vr:[0, 1.3], E:0.5,
      regions:[{x:[0, 2], lab:'Barriere'}]},
    f:BARL.f,
    checks:[
      {id:'innen', name:'in der Barriere', type:'decay', toward:'right', range:[0, 2], ratio:0.7, msg:'Ist $E - V$ in der Barriere positiv oder negativ? Schwingt $\\psi$ dort, und wird $|\\psi|$ größer oder kleiner? (Abschnitt ‚Rechteckbarriere und Tunneleffekt‘)'},
      {id:'rechts', name:'Welle hinter der Barriere', type:'osc', range:[2, 15], min:2, msg:'Kommt hinter der Barriere eine Welle an?'},
      {id:'lam', name:'Wellenlänge links und rechts', type:'wavelength', a:[-15, 0], b:[2, 15], cmp:'=', msg:'Wovon hängt die Wellenlänge ab? Wie groß ist $E - V$ hinter der Barriere im Vergleich zu vorher? Dein Verhältnis ist {got}.'},
      {id:'amp', name:'Amplitude links und rechts', type:'amp', a:[-15, 0], b:[2, 15], cmp:'>', msg:'Kommen alle Teilchen durch? Was sagt das über die Amplitude hinter der Barriere?'}
    ],
    reveal:'Links überlagern sich einlaufende und reflektierte Welle. In der Barriere ist $E < V_0$: $\\psi$ krümmt sich von der Achse weg und nimmt im Wesentlichen exponentiell ab, ohne zu schwingen. Rechts läuft eine Welle mit **derselben** Wellenlänge wie links, denn $E$ und $V$ sind dieselben; nur ihre Amplitude ist kleiner, $|t| = \\sqrt T \\approx 0{,}46$. Das Teilchen verliert beim Tunneln keine Energie, es kommt nur mit kleinerer Wahrscheinlichkeit durch. Zu anderen Zeitpunkten („Zeit laufen lassen“) sieht $\\mathrm{Re}\\,\\psi$ anders aus: In der Barriere überlagern sich zwei Exponentialanteile mit verschiedener Phase, so dass $\\mathrm{Re}\\,\\psi$ dort zeitweise fast flach verläuft oder die Achse einmal kreuzt, und links ist die Überlagerung aus einlaufender und reflektierter Welle zeitweise fast null. Gleich bleiben die Wellenlänge, die Amplitude $|t|$ rechts und der Abfall von $|\\psi|$ in der Barriere.',
    hints:['Teile die Achse in drei Bereiche und bestimme jeweils das Vorzeichen von $E - V$.', 'Die Wellenlänge hängt nur von $E - V$ ab, die Amplitude davon, wie viel durchkommt.', 'Rechts ist $\\psi\' = ik\\psi$. Ist $\\psi(a)$ reell, hat $\\mathrm{Re}\\,\\psi$ bei $x = a$ die Steigung null. In der Barriere krümmt sich $\\mathrm{Re}\\,\\psi$ von der Achse weg.'],
    wrong:[
      {f:x => x < 0 ? BARL.f(x) : x < 2 ? BARL.f(0) * Math.cos(3 * x) : 0.46 * Math.cos(BARL.k * x + 1), fails:['innen'], why:'Schwingung in der Barriere'},
      {f:x => x <= 2 ? BARL.f(x) : BARL.f(2) * Math.cos(BARL.k / 1.7 * (x - 2)) - 0.2 * Math.sin(BARL.k / 1.7 * (x - 2)), fails:['lam'], why:'Energieverlust beim Tunneln: längere Wellenlänge hinter der Barriere (McKagan, Perkins & Wieman 2008)'},
      {f:x => x < 0 ? BARL.f(x) : x < 2 ? BARL.f(0) : 1.34 * Math.cos(BARL.k * (x - 2) + 0.73), fails:['innen', 'amp'], why:'kein Abklingen, gleiche Amplitude hinter der Barriere'},
      {f:x => x <= 0 ? BARL.f(x) : x < 2 ? BARL.f(0) * (1 - x / 2) ** 2 : 0, fails:['rechts', 'lam'], why:'kein Tunneln: hinter der Barriere ψ = 0'}
    ]
  };
  /* tunnel-s1: Stufe mit E = 3V0/2: k = 2π (λ links = 1), q = k/√3 (λ rechts = √3 ≈ 1,73).
     r = (k − q)/(k + q) ≈ 0,268 (R ≈ 0,072), t = 2k/(k + q) = 1 + r. Re(e^{iα}ψ) mit α = π/5:
     links cos(kx + α) + r cos(kx − α), rechts t cos(qx + α); ψ und ψ' stetig bei 0. */
  const STU = (() => {
    const k = 2 * PI, q = k / Math.sqrt(3), r = (k - q) / (k + q), t = 2 * k / (k + q), al = PI / 5;
    return {k, q, r, t, f:x => x < 0 ? Math.cos(k * x + al) + r * Math.cos(k * x - al) : t * Math.cos(q * x + al)};
  })();
  const s1 = {
    id:'tunnel-sk1', title:'Streuzustand an der Stufe mit $E > V_0$', kind:'curve', draw:'psi',
    text:'An der Stufe $V = 0$ für $x < 0$, $V = V_0$ für $x > 0$ läuft ein Teilchen mit $E = \\tfrac32V_0$ von links ein. Skizziere $\\mathrm{Re}\\,\\psi$ zu einem festen Zeitpunkt. Die Wellenlänge links ist durch die Teilstriche vorgegeben ($\\lambda = 1$).',
    plot:{x:[-2.5, 2.5], xlab:'x', ylab:'\\mathrm{Re}\\,\\psi', ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}], V:x => x > 0 ? 2 / 3 : 0, Vr:[0, 1.25], E:1},
    f:STU.f,
    checks:[
      {id:'links', name:'Welle vor der Stufe', type:'osc', range:[-2.5, 0], min:3, msg:'Wie sieht $\\psi$ vor der Stufe aus, wo $E > V$ ist?'},
      {id:'rechts', name:'Welle hinter der Stufe', type:'osc', range:[0, 2.5], min:2, msg:'Ist der Bereich hinter der Stufe für $E > V_0$ erlaubt oder verboten?'},
      {id:'lam', type:'wavelength', a:[-2.5, 0], b:[0, 2.5], cmp:'<', msg:'Wie hängt die Wellenlänge von $E - V$ ab? Auf welcher Seite ist $E - V$ kleiner? Dein Verhältnis links/rechts ist {got}.'},
      {id:'stetig', type:'cont', msg:'Darf $\\psi$ an der Stufe springen? (Abschnitt ‚Anschlussbedingungen‘)'}
    ],
    reveal:'Links ist $E - V = E$, rechts nur $E - V_0 = E/3$. Also ist $q = k/\\sqrt3$, und die Wellenlänge rechts ist $\\sqrt3 \\approx 1{,}7$-mal so lang. Links überlagern sich einlaufende und reflektierte Welle ($R = \\left(\\frac{k - q}{k + q}\\right)^2 \\approx 0{,}07$), rechts läuft nur die durchgelassene. An der Stufe gehen $\\psi$ und $\\psi\'$ stetig ineinander über.',
    hints:['Bestimme $E - V$ links und rechts. Was folgt daraus für $k$ und $q$?', 'Die Wellenlänge ist $2\\pi/k$ mit $k = \\sqrt{2m(E - V)}/\\hbar$.'],
    wrong:[
      {f:x => Math.cos(STU.k * x + 0.6), fails:['lam'], why:'gleiche Wellenlänge auf beiden Seiten'},
      {f:x => x <= 0 ? STU.f(x) : STU.f(0) * Math.cos(1.6 * STU.k * x) - 0.3 * Math.sin(1.6 * STU.k * x), fails:['lam'], why:'kürzere Wellenlänge hinter der Stufe („höheres V, schnellere Welle“)'},
      {f:x => x <= 0 ? STU.f(x) : STU.f(0) * Math.exp(-4 * x), fails:['rechts', 'lam'], why:'wie bei E < V0: Abklingen hinter der Stufe'},
      {f:x => x <= 0 ? STU.f(x) : 0.7 * Math.sin(STU.q * x), fails:['stetig'], why:'Sprung: die Welle beginnt hinter der Stufe neu bei null'}
    ]
  };
  /* tunnel-s2: gebundener Zustand im δ-Potential, ψ = √κ e^{−κ|x|} mit κ = mα/ħ² (Längen in 1/κ) */
  const s2 = {
    id:'tunnel-sk2', title:'Gebundener Zustand im $\\delta$-Potential', kind:'curve', draw:'psi',
    text:'Skizziere den gebundenen Zustand $\\psi(x)$ im Potential $V(x) = -\\alpha\\,\\delta(x)$ mit $\\alpha > 0$. Die Teilstriche liegen bei $\\pm1/\\kappa$.',
    plot:{x:[-3, 3], xlab:'x', ylab:'\\psi(x)', ticks:[{x:-2, lab:'-2/\\kappa'}, {x:-1, lab:'-1/\\kappa'}, {x:0, lab:'0'}, {x:1, lab:'1/\\kappa'}, {x:2, lab:'2/\\kappa'}]},
    f:x => Math.exp(-Math.abs(x)),
    checks:[
      {id:'knick', type:'kink', at:0, msg:'Was macht das $\\delta$-Potential mit der Steigung $\\psi\'$ bei $x = 0$? (Abschnitt ‚Das δ-Potential‘)'},
      {id:'max', type:'maxat', x:0, tol:0.3, msg:'Wo ist $|\\psi|$ am größten? Darf $\\psi(0)$ null sein, wenn die Sprungbedingung $\\psi\'(0^+) - \\psi\'(0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$ einen Knick erzeugen soll?'},
      {id:'links', name:'Abklingen links', type:'decay', toward:'left', range:[-3, -0.2], msg:'Was macht $\\psi$ für $x < 0$, wo $E < V = 0$ ist?'},
      {id:'rechts', name:'Abklingen rechts', type:'decay', toward:'right', range:[0.2, 3], msg:'Was macht $\\psi$ für $x > 0$, wo $E < V = 0$ ist?'}
    ],
    reveal:'$\\psi = \\sqrt\\kappa\\,e^{-\\kappa|x|}$: Außer bei $x = 0$ ist überall $E < V$, also fällt $\\psi$ nach beiden Seiten exponentiell ab und schwingt nicht. Bei $x = 0$ ist $\\psi$ stetig, aber $\\psi\'$ springt um $-2m\\alpha\\psi(0)/\\hbar^2$ von $+\\kappa\\psi(0)$ auf $-\\kappa\\psi(0)$: Es entsteht eine Spitze. Bei $x = \\pm1/\\kappa$ ist $\\psi$ auf $1/e$ des Maximums gefallen.',
    hints:['Überlege getrennt: Was gilt für $x \\ne 0$, und was passiert genau bei $x = 0$?', 'Für $x \\ne 0$ ist $V = 0 > E$: exponentielles Abklingen. Bei $x = 0$ springt $\\psi\'$, $\\psi$ selbst bleibt stetig.'],
    wrong:[
      {f:x => Math.exp(-x * x / 2), fails:['knick'], why:'glatte Kuppe: ψ′ auch am δ-Potential als stetig angesetzt'},
      {f:x => Math.abs(x) * Math.exp(-Math.abs(x)), fails:['max'], why:'ψ(0) = 0, als wäre das δ-Potential eine Wand'},
      {f:x => Math.exp(-Math.abs(x) / 2) * Math.cos(2.5 * x), fails:['links', 'rechts'], why:'Schwingung im klassisch verbotenen Bereich'}
    ]
  };
  /* Abschluss (Lernziel 1): |ψ|² an der Barriere (Laboreinheiten: k = √E, κ = √(1 − E), einlaufende Amplitude 1), unabhängig von der Phase.
     Rechts |ψ|² = |t|² = T (konstant, laufende Welle); innen |ψ|² = T[cosh²κ(x − a) + (k/κ)² sinh²κ(x − a)], fällt monoton auf T;
     links 1 + R + 2√R cos(2kx + φ), Periode λ/2.  A: E = 0,7, a = 1,5 → T ≈ 0,50.  B: E = 0,6, a = 1,61 → T ≈ 0,40.
     Höhe rechts: level T ± 0,14. T und √T (Fehlskizze) liegen nur gut 0,2 auseinander; 0,14 lässt das Muster bei noise 0,09 zu ≥ 95 % bestehen
     und weist √T bei noise 0,03 sicher ab (bei 0,06 zu etwa 90 %). */
  const barrier = (E, a) => {
    const k = Math.sqrt(E), ka = Math.sqrt(1 - E);
    const ta = cdv(C(1), C(Math.cosh(ka * a), 0.5 * (ka / k - k / ka) * Math.sinh(ka * a)));
    const t = cm(ta, cex(-k * a)), T = t[0] ** 2 + t[1] ** 2;
    const inside = x => cm(ta, C(Math.cosh(ka * (x - a)), k / ka * Math.sinh(ka * (x - a))));
    const r = [inside(0)[0] - 1, inside(0)[1]];
    const psi = x => x < 0 ? [Math.cos(k * x) + r[0] * Math.cos(k * x) + r[1] * Math.sin(k * x), Math.sin(k * x) - r[0] * Math.sin(k * x) + r[1] * Math.cos(k * x)]
      : x <= a ? inside(x) : cm(t, cex(k * x));
    return {k, ka, a, T, R:r[0] ** 2 + r[1] ** 2, psi, rho:x => { const p = psi(x); return p[0] * p[0] + p[1] * p[1]; }};
  };
  const fin = (o) => {
    const B = barrier(o.E, o.a), lam = 2 * PI / B.k, x0 = -2 * lam, x1 = o.a + 1.5 * lam, top = (1 + Math.sqrt(B.R)) ** 2;
    const y1 = Math.ceil(top * 1.1 * 2) / 2;
    return {
      id:o.id, title:'Aufenthaltsdichte an der Barriere', kind:'curve', draw:'abs2', points:3,
      text:'Ein Teilchen läuft von links mit $E = ' + o.Etex + 'V_0$ auf eine Rechteckbarriere ($0 < x < a$); die einlaufende Welle $e^{ikx}$ hat die Amplitude 1. Die Transmission ist $T = ' + o.Ttex + '$. Skizziere die Aufenthaltsdichte $|\\psi(x)|^2$ in der richtigen Höhe. Vor der Barriere genügt die ungefähre Form.',
      plot:{x:[x0, x1], y:[-0.25 * y1, y1], abs:true, xlab:'x', ylab:'|\\psi(x)|^2', ticks:[{x:0, lab:'0'}, {x:o.a, lab:'a'}],
        yticks:o.yticks, regions:[{x:[0, o.a], lab:'Barriere'}]},
      f:B.rho,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann $|\\psi|^2$ negativ sein?'},
        {id:'innen', name:'in der Barriere', type:'decay', toward:'right', range:[0, o.a], ratio:0.6, msg:'Ist $E - V$ in der Barriere positiv oder negativ? Wie ändert sich $|\\psi|^2$ dort?'},
        {id:'rechts', name:'Verlauf hinter der Barriere', type:'noosc', range:[o.a, x1], msg:'Hinter der Barriere läuft nur die Welle $F e^{ikx}$. Wie hängt $|F e^{ikx}|^2$ von $x$ ab?'},
        {id:'hoehe', name:'Höhe hinter der Barriere', type:'level', v:B.T, tol:o.tol, range:[o.a + 0.1 * lam, x1], msg:'Wie hängen $|F|^2$ und die Transmission $T$ zusammen? Deine Höhe hinter der Barriere ist {got}.'}
      ],
      reveal:'Hinter der Barriere läuft nur $Fe^{ikx}$, also ist $|\\psi|^2 = |F|^2 = T = ' + o.Ttex + '$ überall gleich, denn $|e^{ikx}| = 1$: Eine einzelne laufende Welle bildet keine Streifen. In der Barriere fällt $|\\psi|^2$ monoton auf diesen Wert ab, ohne zu schwingen. Vor der Barriere interferieren einlaufende und reflektierte Welle: $|\\psi|^2$ schwankt mit der halben Wellenlänge zwischen $(1 - \\sqrt R)^2$ und $(1 + \\sqrt R)^2$ um den Mittelwert $1 + R$, mit $R = 1 - T$. Dass rechts etwas ankommt, ist der Tunneleffekt.',
      hints:['Fang hinten an: Welche Welle gibt es hinter der Barriere, und wie groß ist ihr Betragsquadrat?', 'Für $x > a$ ist $\\psi = Fe^{ikx}$ mit $|F|^2 = T$. In der Barriere fällt $|\\psi|^2$ ab, vor ihr überlagern sich zwei Wellen.'],
      wrong:[
        {f:x => x <= 0 ? B.rho(x) : x < o.a ? B.rho(0) * (1 - x / o.a) ** 2 : 0, fails:['hoehe'], why:'kein Tunneln: hinter der Barriere ist die Dichte null'},
        {f:x => x <= o.a ? B.rho(x) : B.T * (1 + Math.cos(2 * B.k * (x - o.a))), fails:['rechts'], why:'Dichte hinter der Barriere schwingt wie Re ψ: laufende Welle mit stehender verwechselt'},
        {f:x => x <= 0 ? B.rho(x) : x < o.a ? B.rho(0) + (Math.sqrt(B.T) - B.rho(0)) * x / o.a : Math.sqrt(B.T), fails:['hoehe'], why:'Amplitude mit Dichte verwechselt: Höhe √T statt |F|² = T'},
        {f:x => x <= 0 ? B.rho(x) : x < o.a ? B.rho(0) * (0.6 + 0.4 * Math.cos(9 * x / o.a)) : B.T, fails:['innen'], why:'Schwingung in der Barriere'}
      ]
    };
  };
  const fA = fin({id:'tunnel-sk-A', E:0.7, Etex:'0{,}7\\,', a:1.5, Ttex:'0{,}50', tol:0.14, yticks:[{y:0.5, lab:'0{,}5'}, {y:1, lab:'1'}, {y:2, lab:'2'}, {y:3, lab:'3'}]});
  const fB = fin({id:'tunnel-sk-B', E:0.6, Etex:'0{,}6\\,', a:1.606, Ttex:'0{,}40', tol:0.14, yticks:[{y:0.4, lab:'0{,}4'}, {y:1, lab:'1'}, {y:2, lab:'2'}, {y:3, lab:'3'}]});
  return {lab, s1, s2, fA, fB};
})();
/* ---- Graphen für den Erklärteil (UMBAU2: reps-Zeilen k:'graph'), Einheiten wie im Labor bzw. dimensionslos ----
   barRho: |ψ|² an der Rechteckbarriere E = 0,5 V0, a = 2 (wie SK.lab, also T ≈ 0,211);
   step*: Stufe mit k = 2, q = 1 (E = 4V0/3): B = 1/3, C = 4/3, Re(e^{iπ/4}ψ) bzw. |ψ|² = 1 + 1/9 + (2/3)cos 4x links, 16/9 rechts;
   tanz/rhs: grafische Lösung tan z = √((z0/z)² − 1) im Topf mit z0 = 0,5 nm·√(2m·1 eV)/ħ ≈ 2,5616 (Werte über 6 abgeschnitten) */
const TUN_G = (() => {
  const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const cdv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
  const E = 0.5, a = 2, k = Math.sqrt(E), ka = Math.sqrt(1 - E);
  const ta = cdv([1, 0], [Math.cosh(ka * a), 0.5 * (ka / k - k / ka) * Math.sinh(ka * a)]);
  const t = cm(ta, [Math.cos(-k * a), Math.sin(-k * a)]);
  const inside = x => cm(ta, [Math.cosh(ka * (x - a)), k / ka * Math.sinh(ka * (x - a))]);
  const r = [inside(0)[0] - 1, inside(0)[1]];
  const psi = x => x < 0 ? [Math.cos(k * x) + r[0] * Math.cos(k * x) + r[1] * Math.sin(k * x), Math.sin(k * x) - r[0] * Math.sin(k * x) + r[1] * Math.cos(k * x)]
    : x <= a ? inside(x) : cm(t, [Math.cos(k * x), Math.sin(k * x)]);
  const al = Math.PI / 4, Z0 = 2.5616;
  return {
    barRho:x => { const p = psi(x); return p[0] * p[0] + p[1] * p[1]; },
    stepRe:x => x < 0 ? Math.cos(2 * x + al) + Math.cos(2 * x - al) / 3 : 4 / 3 * Math.cos(x + al),
    stepRho:x => x < 0 ? 1 + 1 / 9 + 2 / 3 * Math.cos(4 * x) : 16 / 9,
    tanz:z => { const v = Math.tan(z); return v >= 0 && v <= 6 ? v : NaN; },
    rhs:z => { if (z <= 0 || z >= Z0) return NaN; const v = Math.sqrt((Z0 / z) ** 2 - 1); return v <= 6 ? v : NaN; },
    delta:x => Math.exp(-Math.abs(x))
  };
})();
topic({
  id:'tunnel', math:['m-dgl', 'm-analysis'], title:'Stufe, Barriere, Tunneleffekt', short:'Tunneleffekt',
  src:'Griffiths & Schroeter Kap. 2 · Nolting 5/1 Kap. 4',
  goals:[
    'Ich kann an einer Potentialstufe die Anschlussbedingungen aufstellen und Reflexions- und Transmissionswahrscheinlichkeit berechnen.',
    'Ich kann erklären, warum ein Teilchen in einen klassisch verbotenen Bereich eindringt und durch eine Barriere tunnelt.',
    'Ich kann den gebundenen Zustand im $\\delta$-Potential mit der Sprungbedingung für $\\psi\'$ bestimmen.'
  ],
  needs:'stationäre Schrödingergleichung · $e^{ikx}$ ableiten · komplexe Zahlen · Stromdichte $j = \\frac{\\hbar}{m}\\,\\mathrm{Im}(\\psi^*\\psi\')$',
  wozu:'Ohne Tunneleffekt gäbe es keinen α-Zerfall, und das Rastertunnelmikroskop könnte keine einzelnen Atome abbilden. In Flash-Speichern gelangen Elektronen beim Löschen durch eine dünne Oxidschicht – ebenfalls durch Tunneln. Die Methode dieses Themas, Lösungen stückweise anzusetzen und an den Grenzen anzuschließen, brauchst du überall, wo sich ein Potential sprunghaft ändert: an Oberflächen, an Grenzflächen in Halbleitern, in Quantentöpfen.',
  bridge:'Aus Thema 2 kommen die stationäre Schrödingergleichung und die Stromdichte $j$, aus Thema 4 die ebenen Wellen $e^{\\pm ikx}$ als Modell eines Teilchenstrahls, aus Thema 3 die Randbedingung an einer unendlich hohen Wand. Mathematisch brauchst du lineare DGL mit konstanten Koeffizienten (M7), komplexe Zahlen (M1) und die δ-Distribution (M2). Neu: Lösungen in mehreren Bereichen werden durch Anschlussbedingungen verbunden.',
  check:[
    {q:'Welche Lösung hat $\\psi\'\' = -k^2\\psi$ mit $k > 0$?', opts:['$\\psi = Ae^{ikx} + Be^{-ikx}$', '$\\psi = Ae^{kx} + Be^{-kx}$', '$\\psi = Ax + B$'], a:0, ex:'Zweimal Ableiten von $e^{\\pm ikx}$ liefert $-k^2e^{\\pm ikx}$. Bei $\\psi\'\' = +\\kappa^2\\psi$ wären es reelle Exponentialfunktionen.', lex:'lineare-dgl', prev:'m-dgl', seg:'md-t3'},
    {q:'Was ist $\\frac{d}{dx}\\,B\\,e^{-ikx}$?', opts:['$-ikB\\,e^{-ikx}$', '$ikB\\,e^{-ikx}$', '$-kB\\,e^{-ikx}$'], a:0, ex:'Kettenregel: Die innere Ableitung von $-ikx$ ist $-ik$.', lex:'komplexe-zahlen'},
    {q:'Für $z = \\frac{k - i\\kappa}{k + i\\kappa}$ mit reellen $k,\\kappa$ gilt $|z| = $', opts:['$1$', '$\\frac{k-\\kappa}{k+\\kappa}$', '$0$'], a:0, ex:'Zähler und Nenner sind zueinander konjugiert und haben denselben Betrag $\\sqrt{k^2+\\kappa^2}$.', lex:'komplexe-zahlen'},
    {q:'Ein Teilchen mit $E < V_0$ trifft klassisch auf eine Wand der Höhe $V_0$. Was passiert klassisch?', opts:['Es wird immer reflektiert.', 'Es geht mit kleinerer Geschwindigkeit weiter.', 'Es bleibt an der Wand stehen.'], a:0, ex:'Klassisch ist der Bereich mit $V > E$ verboten ($E_{kin} < 0$). Quantenmechanisch dringt die Welle trotzdem ein.', lex:'tunneleffekt'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Reflexionswahrscheinlichkeit an einer Potentialstufe zu berechnen?', opts:['in jedem Bereich die Lösung ansetzen und bei $x = 0$ $\\psi$ und $\\psi\'$ anschließen', 'die klassische Energieerhaltung nach der Geschwindigkeit hinter der Stufe auflösen', '$|\\psi|^2$ links und rechts gleichsetzen und nach der Amplitude auflösen'], a:0, dk:true,
      ex:'Reflexion an einer Stufe ist ein Welleneffekt; klassisch gäbe es sie bei $E > V_0$ gar nicht. Gleich sein müssen $\\psi$ und $\\psi\'$ an der Grenze, nicht die Dichten.'},
    {q:'Wie beginnst du, um die Energie des gebundenen Zustands im Potential $V = -\\alpha\\,\\delta(x)$ zu bestimmen?', opts:['$\\psi = Ae^{-\\kappa|x|}$ ansetzen und den Sprung von $\\psi\'$ bei $x = 0$ benutzen', 'die Lösung des unendlichen Kastens nehmen und die Breite gegen null gehen lassen', '$E = \\langle V\\rangle = -\\alpha$ setzen, weil nur bei $x = 0$ ein Potential wirkt'], a:0, dk:true,
      ex:'Außerhalb von $x = 0$ ist das Teilchen frei; normierbar ist nur $e^{-\\kappa|x|}$. Die Schrödingergleichung, über $x = 0$ integriert, liefert einen Knick in $\\psi$ und daraus $\\kappa$.'}
  ],
  phenomenon:{
    title:'Was kommt hinter der Barriere an?',
    text:'Ein Elektronenstrahl mit der Energie $E$ trifft auf eine dünne Barriere der Höhe $V_0 > E$. Links und rechts der Barriere ist $V = 0$. Ein kleiner Teil der Elektronen kommt durch.\n\nWas gilt für die durchgekommenen Elektronen?',
    q:{q:'Deine Vorhersage:', opts:['Sie haben weniger Energie als vorher und eine größere Wellenlänge.', 'Sie haben dieselbe Energie und dieselbe Wellenlänge; es sind nur weniger.', 'Sie haben mehr Energie, weil sie die Barriere überwinden mussten.'], a:1,
      ex:'In allen Bereichen gilt dasselbe $E$, und rechts ist $V = 0$ wie links.',
      fb:[
        'Diese Vorstellung ist unter Studierenden verbreitet (McKagan, Perkins & Wieman 2008): Das Teilchen „verbraucht“ in der Barriere Energie. Ein stationärer Zustand hat aber in allen Bereichen dasselbe $E$. Rechts ist $V = 0$ wie links, also ist auch $k = \\sqrt{2mE}/\\hbar$ gleich. Kleiner ist nur die Amplitude.',
        'Richtig. Die Wellenzahl hängt von der kinetischen Energie $E - V$ ab, und die ist rechts dieselbe wie links. Die kleinere Amplitude bedeutet: Nur wenige Elektronen kommen durch – diese aber mit voller Energie.',
        'Energie wird weder verbraucht noch gewonnen: In der stationären Schrödingergleichung steht in allen Bereichen dasselbe $E$. Wer durchkommt, kommt mit der Anfangsenergie an.'
      ]},
    reveal:'In der stationären Schrödingergleichung steht **ein** $E$ für alle Bereiche. Links und rechts der Barriere ist $V = 0$; deshalb ist die Wellenzahl $k = \\sqrt{2mE}/\\hbar$ auf beiden Seiten gleich – und damit auch die Wellenlänge. Die durchgelassene Welle hat nur eine kleinere **Amplitude**. Ihr Betragsquadrat ist die Wahrscheinlichkeit, dass ein einzelnes Elektron durchkommt. In der Barriere selbst schwingt $\\psi$ nicht, sondern ändert sich exponentiell.\n\nDie Vorstellung „Energieverlust beim Tunneln“ ist verbreitet und hängt oft damit zusammen, dass man die kleinere Amplitude als kleinere Energie liest (McKagan, Perkins & Wieman 2008). Die Energie siehst du an der Wellenlänge, nicht an der Amplitude.'
  },
  teach:[
    /* ===== Abschnitt 1: stückweise konstantes Potential ===== */
    {id:'tunnel-t1', title:'Stückweise konstantes Potential: Wellen und Exponentialfunktionen', steps:[
      {id:'tunnel-t1a', title:'Ein Potential aus Stücken',
        pre:{from:'m-dgl', seg:'md-t2', title:'Exponentialansatz', text:R`Eine lineare DGL mit konstanten Koeffizienten löst du mit $y = e^{\lambda x}$. Jede Ableitung wird zum Faktor $\lambda$, und es bleibt eine Gleichung für $\lambda$. Mini-Beispiel: $y'' = 4y$ gibt $\lambda^2 = 4$, also die Lösungen $e^{2x}$ und $e^{-2x}$.`},
        num:{title:'Ein Elektron mit 1 eV über drei Stücken', text:R`Ein Elektron mit $E = 1\,\mathrm{eV}$ läuft über drei Stücke mit $V = 0$, $V = 0{,}5\,\mathrm{eV}$ und $V = 2\,\mathrm{eV}$. Mit $2m/\hbar^2 \approx 26{,}2\,\mathrm{eV^{-1}nm^{-2}}$ ist der Faktor $\frac{2m}{\hbar^2}(V - E)$ der Reihe nach

$$-26{,}2\,\mathrm{nm}^{-2},\qquad -13{,}1\,\mathrm{nm}^{-2},\qquad +26{,}2\,\mathrm{nm}^{-2}.$$

In den ersten beiden Stücken ist er negativ, im dritten positiv.`},
        text:R`Viele Potentiale lassen sich gut durch Stücke mit konstantem $V$ annähern: eine Metalloberfläche, eine Oxidschicht zwischen zwei Leitern, eine dünne Halbleiterschicht. In jedem Stück ist die stationäre Schrödingergleichung eine [[lex:lineare-dgl|lineare DGL]] mit konstanten Koeffizienten (M7):

$$\psi'' = \frac{2m}{\hbar^2}(V - E)\,\psi.$$

Lies sie als Krümmungsregel: Die zweite Ableitung von $\psi$ ist die Funktion selbst mal einen festen Faktor. Alles hängt am Vorzeichen dieses Faktors, also an $V - E$. Ist er negativ, schwingt $\psi$. Ist er positiv, wächst oder fällt $\psi$ exponentiell.`,
        q:{q:R`In welchem Stück aus dem Beispiel schwingt $\psi$ **nicht**?`,
          opts:[R`im Stück mit $V = 0$`, R`im Stück mit $V = 0{,}5\,\mathrm{eV}$, weil dort $V > 0$ ist`, R`im Stück mit $V = 2\,\mathrm{eV}$`], a:2,
          ex:R`Nur dort ist $V - E = +1\,\mathrm{eV} > 0$, der Faktor also positiv. Dann ist $\psi'' = +\kappa^2\psi$, und $\psi$ wächst oder fällt exponentiell.`,
          fb:[R`Bei $V = 0$ ist $V - E = -1\,\mathrm{eV}$: Der Faktor ist negativ, $\psi$ schwingt.`,
            R`Es kommt nicht auf $V > 0$ an, sondern auf $V > E$. Hier ist $V - E = -0{,}5\,\mathrm{eV}$, also schwingt $\psi$.`, '']}},
      {id:'tunnel-t1b', title:'Erlaubter Bereich: Schwingen',
        pre:{from:'m-dgl', seg:'md-t3', title:'Schwingen oder Abklingen', text:R`$\psi'' = -k^2\psi$ hat die Lösungen $e^{\pm ikx}$: Schwingungen mit der Wellenlänge $2\pi/k$. $\psi'' = +\kappa^2\psi$ hat die Lösungen $e^{\pm\kappa x}$, die exponentiell wachsen oder fallen. Mini-Beispiel: $\psi'' = -9\psi$ schwingt mit $\lambda = 2\pi/3$.`},
        num:{title:'Zwei erlaubte Stücke', text:R`Mit $V = 0$ ist $k = \sqrt{26{,}2\cdot1}\,\mathrm{nm}^{-1} \approx 5{,}12\,\mathrm{nm}^{-1}$ und $\lambda \approx 1{,}23\,\mathrm{nm}$. Mit $V = 0{,}5\,\mathrm{eV}$ ist $k = \sqrt{26{,}2\cdot0{,}5}\,\mathrm{nm}^{-1} \approx 3{,}62\,\mathrm{nm}^{-1}$ und $\lambda \approx 1{,}73\,\mathrm{nm}$.`},
        text:R`Ist $E > V$, heißt der Bereich **klassisch erlaubt**. Dann ist $\psi'' = -k^2\psi$ mit

$$k = \frac{\sqrt{2m(E - V)}}{\hbar}.$$

Die Lösungen $e^{\pm ikx}$ bzw. $\cos kx$ und $\sin kx$ schwingen. $E - V$ ist die kinetische Energie. Je größer sie ist, desto größer $k$ und desto kürzer die Wellenlänge $\lambda = 2\pi/k$. Wo $V$ steigt, aber unter $E$ bleibt, wird die Welle also länger. Das ist dieselbe Rechnung wie beim freien Teilchen in Thema 4, nur mit $E - V$ statt $E$.`,
        q:{q:R`Eine Elektronenwelle läuft aus einem Bereich mit $V = 0$ in einen Bereich mit $V = V_1$, wobei $0 < V_1 < E$. Wie ändert sich die Wellenlänge?`,
          opts:[R`Sie wird kleiner, weil das Potential höher ist.`, R`Sie bleibt gleich, weil $E$ gleich bleibt.`, R`Sie wird größer, weil $E - V$ kleiner wird.`], a:2,
          ex:R`$\lambda = 2\pi\hbar/\sqrt{2m(E - V)}$ hängt von der kinetischen Energie ab. $E$ bleibt gleich, $E - V$ wird kleiner, also wird $\lambda$ größer.`,
          fb:[R`Höheres $V$ heißt weniger kinetische Energie, kleineres $k$ und damit längere Wellen.`,
            R`$E$ bleibt gleich, aber die Wellenlänge hängt von $E - V$ ab, und das ändert sich.`, '']}},
      {id:'tunnel-t1c', title:'Verbotener Bereich: Abklingen',
        num:{title:'1 eV unter dem Potential', text:R`Für $V - E = 1\,\mathrm{eV}$ ist $\kappa = \sqrt{26{,}2\cdot1}\,\mathrm{nm}^{-1} \approx 5{,}1\,\mathrm{nm}^{-1}$. Die Eindringtiefe ist $1/\kappa \approx 0{,}2\,\mathrm{nm}$, ein bis zwei Atomabstände. Nach $1\,\mathrm{nm}$ ist $\psi$ auf $e^{-5{,}1} \approx 0{,}6\,\%$ abgefallen.`},
        text:R`Ist $E < V$, heißt der Bereich **klassisch verboten**: Die kinetische Energie $E - V$ wäre negativ. Dann ist $\psi'' = +\kappa^2\psi$ mit

$$\kappa = \frac{\sqrt{2m(V - E)}}{\hbar}.$$

Die Lösungen $e^{\pm\kappa x}$ wachsen oder fallen exponentiell und schwingen nicht. Quantenmechanisch ist $\psi$ dort nicht null, sondern klingt auf der [[lex:eindringtiefe|Eindringtiefe]] $1/\kappa$ ab. Reicht der verbotene Bereich bis $x \to \infty$, bleibt nur $e^{-\kappa x}$; $e^{+\kappa x}$ wäre nicht normierbar. Die Herleitung prüft, dass $e^{-\kappa x}$ die Gleichung zur selben Energie $E$ löst.`,
        derive:{ctx:{coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['0.15 V_0', '0.85 V_0']}}, defs:{κ:'sqrt(2m (V_0 - E))/ħ'}}, lines:[
          {l:'-ħ^2/(2m) d^2/dx^2 e^(-κ x) + V_0 e^(-κ x) = (V_0 - ħ^2 κ^2/(2m)) e^(-κ x)', w:'zweimal ableiten: (−κ)² = κ²',
            why:{q:'Warum steht in der Klammer $-\\hbar^2\\kappa^2/2m$?', opts:['$\\frac{d^2}{dx^2}e^{-\\kappa x} = +\\kappa^2e^{-\\kappa x}$, und davor steht $-\\hbar^2/2m$', '$\\frac{d^2}{dx^2}e^{-\\kappa x} = -\\kappa^2e^{-\\kappa x}$, wie bei einer Welle', 'Das Minuszeichen kommt aus dem Potential $V_0$.'], a:0, ex:'$(-\\kappa)^2 = \\kappa^2 > 0$. Bei einer Welle $e^{ikx}$ wäre es $(ik)^2 = -k^2$ – daher der Unterschied zwischen Schwingen und Abklingen.'}},
          {l:'= E e^(-κ x)', w:'κ² = 2m(V₀ − E)/ħ² eingesetzt',
            why:{q:'Was zeigt diese Zeile?', opts:['$e^{-\\kappa x}$ löst die Gleichung zur selben Energie $E$, obwohl $E < V_0$.', 'Im verbotenen Bereich ist die Energie des Teilchens $V_0$.', 'Im verbotenen Bereich ist die Energie des Teilchens negativ.'], a:0, ex:'$V_0 - \\hbar^2\\kappa^2/2m = V_0 - (V_0 - E) = E$. Negativ ist nur die kinetische Energie $E - V_0$ im klassischen Sinn.'}}
        ]},
        q:{q:R`Ein verbotener Bereich reicht von $x = 0$ bis $x \to \infty$. Welcher Ansatz gehört dorthin?`,
          opts:[R`$Ce^{-\kappa x} + De^{\kappa x}$ mit beliebigem $D$`, R`$Ce^{-\kappa x}$`, R`$C\cos(\kappa x)$`], a:1,
          ex:R`$e^{+\kappa x}$ wächst für $x \to \infty$ über alle Grenzen; normierbar bleibt nur $e^{-\kappa x}$.`,
          fb:[R`Mit $D \ne 0$ wüchse $\psi$ nach rechts ohne Grenze. Also muss $D = 0$ sein.`, '',
            R`Im verbotenen Bereich schwingt $\psi$ nicht: $\psi'' = +\kappa^2\psi$ hat keine Kosinus-Lösungen.`]}},
      {id:'tunnel-t1d', title:'Typischer Fehler: Die Energie ändert sich von Bereich zu Bereich',
        num:{title:'Dasselbe E, drei kinetische Energien', text:R`Im Beispiel ist $E = 1\,\mathrm{eV}$ in allen drei Stücken. Die kinetische Energie $E - V$ ist dort $1\,\mathrm{eV}$, $0{,}5\,\mathrm{eV}$ und $-1\,\mathrm{eV}$. Zurück auf $V = 0$ ist sie wieder $1\,\mathrm{eV}$, mit $\lambda = 1{,}23\,\mathrm{nm}$ wie am Anfang.`},
        text:R`**Ein $E$ für alle Bereiche.** Das ist der wichtigste Punkt dieses Abschnitts. Die stationäre Gleichung $\hat H\psi = E\psi$ gilt überall mit derselben Zahl $E$. Von Bereich zu Bereich ändern sich nur $V$ und damit die *kinetische* Energie $E - V$. **Typische Fehlvorstellung:** „Wo $\psi$ klein ist, hat das Teilchen weniger Energie.“ Die kinetische Energie siehst du an der Wellenlänge, nicht an der Amplitude. Die Amplitude sagt nur, wie wahrscheinlich das Teilchen dort anzutreffen ist.`,
        q:{q:R`Eine Elektronenwelle hat hinter einer Barriere eine kleinere Amplitude, aber dieselbe Wellenlänge wie davor. Was schließt du?`,
          opts:[R`Die Elektronen dort haben weniger Energie.`, R`Dort sind weniger Elektronen, mit derselben Energie.`, R`Dort sind mehr Elektronen, weil sie sich stauen.`], a:1,
          ex:R`Gleiche Wellenlänge bei gleichem $V$ heißt gleiche Energie. Die kleinere Amplitude heißt: Die Aufenthaltswahrscheinlichkeit ist kleiner.`,
          fb:[R`Die Energie steckt in der Wellenlänge, und die ist gleich. Die Amplitude misst etwas anderes.`, '',
            R`Kleinere Amplitude heißt kleinere Dichte $|\psi|^2$, also weniger Elektronen, nicht mehr.`]}},
      {id:'tunnel-t1e', title:'Ein Ansatz je Bereich: Gleichung, Mathe, Bild',
        num:{title:'Die Barriere des Labors', text:R`Im Labor ist $V_0$ die Energieeinheit und $\hbar/\sqrt{2mV_0}$ die Längeneinheit. Dann ist $k = \sqrt{E/V_0}$ und in der Barriere $\kappa = \sqrt{1 - E/V_0}$. Für $E = 0{,}5\,V_0$ ist $k = \kappa \approx 0{,}71$: links und rechts die Wellenlänge $2\pi/k \approx 8{,}9$, in der Barriere die Eindringtiefe $1/\kappa \approx 1{,}4$.`},
        text:R`Jetzt setzt du die Teile zusammen. Für jeden Bereich bestimmst du das Vorzeichen von $V - E$ und schreibst den passenden Ansatz hin. Die Tafel zeigt den Weg an der Rechteckbarriere aus dem Labor: von der Gleichung über die charakteristische Gleichung aus M7 zum Bild. Links und rechts der Barriere schwingt $\mathrm{Re}\,\psi$ mit derselben Wellenlänge. In der Barriere krümmt es sich von der Achse weg und fällt ab, ohne zu schwingen. Achtung: In der Tafel ist $\lambda$ wie in M7 die Wurzel der charakteristischen Gleichung, nicht die Wellenlänge.`,
        reps:{obj:R`Rechteckbarriere mit $E = 0{,}5\,V_0$ und Breite $a = 2$ (Einheiten des Labors)`,
          rows:[
            {k:'worte', text:R`Links und rechts frei, in der Mitte ein Wall, der höher ist als die Energie des Teilchens.`},
            {k:'formel', tex:R`\psi'' = \frac{2m}{\hbar^2}\,(V - E)\,\psi,\qquad V = \begin{cases}0, & x < 0\\ V_0, & 0 < x < a\\ 0, & x > a\end{cases}`},
            {k:'mathe', tex:R`\lambda^2 = \frac{2m(V - E)}{\hbar^2}:\qquad \lambda = \pm ik\ \ (V < E),\qquad \lambda = \pm\kappa\ \ (V > E)`},
            {k:'graph', plot:{x:[-15, 15], xlab:'x', ylab:R`\mathrm{Re}\,\psi`, ticks:[{x:-10, lab:'-10'}, {x:0, lab:'0'}, {x:2, lab:'a'}, {x:10, lab:'10'}], V:x => x > 0 && x < 2 ? 1 : 0, Vr:[0, 1.3], E:0.5, regions:[{x:[0, 2], lab:'Barriere'}]}, f:SK.lab.f,
              cap:R`$\mathrm{Re}\,\psi$ zu einem festen Zeitpunkt. Grau das Potential, gestrichelt die Energie. Links Überlagerung aus ein- und auslaufender Welle, in der Barriere Abfall ohne Schwingung, rechts eine Welle mit derselben Wellenlänge und kleinerer Amplitude.`},
            {k:'labor', text:R`Labor „Transmission durch eine Rechteckbarriere“: Regler „Energie E/V₀“ auf $0{,}5$, „Breite“ auf $2$, Wellenfunktion „nur Re ψ“. Die dünne Kurve ist $\mathrm{Re}\,\psi$, auf der gestrichelten Energielinie aufgetragen.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Jedes Stück mit eigenem konstantem $V$ wird ein Fall in $V(x)$. In allen Fällen steht dasselbe $E$.`},
            {from:'formel', to:'mathe', rule:R`Mit $\psi = e^{\lambda x}$ wird $\psi''$ zu $\lambda^2\psi$. Es bleibt die charakteristische Gleichung $\lambda^2 = 2m(V - E)/\hbar^2$.`},
            {from:'mathe', to:'graph', rule:R`Imaginäre Wurzeln $\lambda = \pm ik$: eine Schwingung mit der Wellenlänge $2\pi/k$ zeichnen. Reelle Wurzeln $\pm\kappa$: Exponentialkurven ohne Nullstelle zeichnen.`},
            {from:'graph', to:'labor', rule:R`Dieselbe Energie und Breite im Labor einstellen und die dünne Kurve mit dem Bild vergleichen. Im Labor sitzt die Kurve auf der Energielinie, nicht auf der Achse.`}
          ]},
        q:{q:R`In einem Bereich eines anderen Potentials schwingt $\mathrm{Re}\,\psi$ mit der Wellenlänge $2\pi/3$ (Laboreinheiten). Welche Wurzeln hat dort die charakteristische Gleichung?`, tr:{from:'graph', to:'mathe'},
          opts:[R`$\lambda = \pm3$`, R`$\lambda = \pm3i$`, R`$\lambda = \pm2\pi/3$`], a:1,
          ex:R`Die Wellenlänge $2\pi/k = 2\pi/3$ gibt die Wellenzahl $k = 3$. Schwingung heißt imaginäre Wurzeln, also $\lambda = \pm ik = \pm3i$.`,
          fb:[R`Reelle Wurzeln $\pm3$ gäben $e^{\pm3x}$, also Abklingen ohne Schwingung.`, '',
            R`$2\pi/3$ ist die Wellenlänge, nicht die Wellenzahl $k$. Und für eine Schwingung muss die Wurzel $\lambda$ imaginär sein.`]}},
      {id:'tunnel-t1f', title:'Krümmung als Faustregel',
        num:{title:'Vorzeichen von ψ und ψ″', text:R`Im erlaubten Bereich sei $\psi = \cos kx$. Dann ist $\psi'' = -k^2\cos kx$: Wo $\psi > 0$ ist, ist $\psi'' < 0$, die Kurve biegt sich nach unten zur Achse. Im verbotenen Bereich sei $\psi = e^{-\kappa x} > 0$. Dann ist $\psi'' = \kappa^2e^{-\kappa x} > 0$: Die Kurve biegt sich nach oben, von der Achse weg.`},
        text:R`Für reelles $\psi$ sagt die Gleichung, wohin die Kurve gekrümmt ist. Im erlaubten Bereich hat $\psi''$ das entgegengesetzte Vorzeichen wie $\psi$: Die Kurve biegt sich zur Achse hin und schwingt. Im verbotenen Bereich hat $\psi''$ dasselbe Vorzeichen wie $\psi$: Die Kurve biegt sich von der Achse weg. Im Bild daneben ist $\mathrm{Re}\,\psi$ auf der gestrichelten Energielinie aufgetragen. Der getönte Streifen ist die Barriere mit $V = V_0$. Mit dieser Regel kannst du Wellenfunktionen skizzieren, bevor du rechnest.`,
        fig:{lab:'barrier', init:{a:4, e:0.6, show:'re'}, caption:'$\\mathrm{Re}\\,\\psi$, aufgetragen auf der Energielinie: Links schwingt $\\psi$; in der Barriere ($E < V$) fällt es ab, ohne zu schwingen; rechts schwingt es wieder – mit derselben Wellenlänge wie links, aber kleinerer Amplitude.'},
        q:{q:R`Wie ist ein reelles $\psi$ im verbotenen Bereich gekrümmt?`,
          opts:[R`zur Achse hin: $\psi''$ hat das entgegengesetzte Vorzeichen wie $\psi$`, R`von der Achse weg: $\psi''$ hat dasselbe Vorzeichen wie $\psi$`, R`gar nicht: im verbotenen Bereich ist $\psi$ eine Gerade`], a:1,
          ex:R`$\psi'' = \kappa^2\psi$ mit $\kappa^2 > 0$. Deshalb schwingt $\psi$ dort nicht.`,
          fb:[R`So ist es im erlaubten Bereich; dort schwingt $\psi$.`, '',
            R`Eine Gerade hätte $\psi'' = 0$. Hier ist $\psi'' = \kappa^2\psi \ne 0$.`]}}
    ]},

    /* ===== Abschnitt 2: Anschlussbedingungen ===== */
    {id:'tunnel-t2', title:'Anschlussbedingungen', steps:[
      {id:'tunnel-t2a', title:'Woher die Bedingungen kommen',
        num:{title:'Ein schmales Intervall', text:R`An einer Stufe springe $V - E$ von $-1\,\mathrm{eV}$ auf $+1\,\mathrm{eV}$, und es sei $|\psi| \le 1$. Über $[x_0 - \varepsilon, x_0 + \varepsilon]$ mit $\varepsilon = 0{,}01\,\mathrm{nm}$ ändert sich die Steigung höchstens um

$$26{,}2\,\mathrm{eV^{-1}nm^{-2}}\cdot1\,\mathrm{eV}\cdot0{,}02\,\mathrm{nm} \approx 0{,}5\,\mathrm{nm}^{-1}.$$

Mit $\varepsilon = 0{,}001\,\mathrm{nm}$ sind es nur noch $0{,}05\,\mathrm{nm}^{-1}$.`},
        text:R`Die Lösungen der einzelnen Bereiche müssen an den Grenzen zusammenpassen. Welche Bedingungen gelten dort? Du gewinnst sie aus der Schrödingergleichung selbst. Integriere $\psi'' = \frac{2m}{\hbar^2}(V - E)\psi$ über ein kleines Intervall um die Sprungstelle $x_0$:

$$\psi'(x_0 + \varepsilon) - \psi'(x_0 - \varepsilon) = \frac{2m}{\hbar^2}\int_{x_0 - \varepsilon}^{x_0 + \varepsilon}(V - E)\,\psi\,dx.$$

Links steht die Änderung der Steigung über das Intervall. Ist $V$ endlich, ist der Integrand beschränkt. Das Integral ist dann höchstens Höhe mal Breite $2\varepsilon$ und geht für $\varepsilon \to 0$ gegen null.`,
        q:{q:R`Warum geht das Integral auf der rechten Seite für $\varepsilon \to 0$ gegen null?`,
          opts:[R`Weil $\psi$ an der Sprungstelle null ist.`, R`Weil der Integrand beschränkt ist und das Intervall schrumpft.`, R`Weil $V - E$ dort das Vorzeichen wechselt und sich alles aufhebt.`], a:1,
          ex:R`Ein beschränkter Integrand über ein Intervall der Länge $2\varepsilon$ gibt höchstens Schranke mal $2\varepsilon$. Das geht gegen null, egal ob $V$ springt.`,
          fb:[R`$\psi$ ist an einer Stufe im Allgemeinen nicht null. Null wird es nur an einer unendlich hohen Wand.`, '',
            R`Ein Vorzeichenwechsel ist nicht nötig. Auch ein Sprung von $V$ von $1\,\mathrm{eV}$ auf $3\,\mathrm{eV}$ gäbe ein verschwindendes Integral.`]}},
      {id:'tunnel-t2b', title:'ψ und ψ′ sind stetig',
        num:{title:'Die Stufe mit k = 2 und q = 1', text:R`An einer Stufe bei $x = 0$ sei links $\psi_L = e^{2ix} + Be^{-2ix}$ und rechts $\psi_R = Ce^{ix}$. Bei $x = 0$ ist jede Exponentialfunktion $1$, und ihre Ableitung ist der Faktor im Exponenten:

$$\begin{gathered}\psi_L(0) = 1 + B,\quad \psi_R(0) = C,\\ \psi_L'(0) = 2i(1 - B),\quad \psi_R'(0) = iC.\end{gathered}$$`},
        text:R`Aus dem letzten Schritt folgt: Bei endlichem $V$ ist **$\psi'$ stetig**. Dann ist $\psi$ erst recht stetig, denn ein Sprung in $\psi$ würde ein unendliches $\psi'$ bedeuten. Das sind die [[lex:anschluss|Anschlussbedingungen]]:

$$\psi(x_0^-) = \psi(x_0^+),\qquad \psi'(x_0^-) = \psi'(x_0^+).$$

Nur $\psi''$ springt, zusammen mit $V$. Es gibt zwei Ausnahmen. An einer unendlich hohen Wand (Thema 3) ist das Integral nicht klein; dort gilt nur $\psi = 0$, und $\psi'$ springt. Beim δ-Potential (Abschnitt 6) liefert das Integral einen endlichen Beitrag, und $\psi'$ springt um einen festen Betrag.`,
        q:{q:R`An einer Stufe springt $V$ von $0$ auf ein endliches $V_0$. Was gilt bei $x = 0$?`,
          opts:[R`$\psi$ ist stetig, $\psi'$ springt.`, R`$\psi$ ist null, weil das Potential springt.`, R`$\psi$ und $\psi'$ sind stetig, $\psi''$ springt.`], a:2,
          ex:R`$\psi'' = \frac{2m}{\hbar^2}(V - E)\psi$ springt mit $V$. Einmal integriert, bleibt $\psi'$ stetig; $\psi = 0$ gilt nur an unendlich hohen Wänden.`,
          fb:[R`Einen Sprung in $\psi'$ gibt es nur bei unendlich hohem $V$ oder einem δ-Potential.`,
            R`Das gilt an einer unendlich hohen Wand. Bei endlichem $V_0$ dringt $\psi$ in die Stufe ein.`, '']}},
      {id:'tunnel-t2c', title:'Zwei Gleichungen, zwei Unbekannte',
        num:{title:'Aufgelöst', text:R`Aus dem Beispiel: $1 + B = C$ und $2i(1 - B) = iC$, also $2 - 2B = 1 + B$. Daraus folgen

$$B = \tfrac13,\qquad C = \tfrac43.$$

Probe: $1 + \tfrac13 = \tfrac43$ und $2\left(1 - \tfrac13\right) = \tfrac43$.`},
        text:R`**Abzählen.** An jeder Sprungstelle gibt es zwei Bedingungen. An einer [[lex:potentialstufe|Potentialstufe]] mit einlaufender Welle von links sind $B$ (reflektiert) und $C$ (durchgelassen) unbekannt: zwei Gleichungen, zwei Unbekannte. Die Amplitude der einlaufenden Welle setzt man auf $1$. Rechts gibt es keine von rechts einlaufende Welle, weil dort keine Quelle ist. Das Beispiel gehört zur Stufe mit $E = \tfrac43V_0$, denn $q^2/k^2 = (E - V_0)/E = \tfrac14$. Allgemein folgen $B = \frac{k - q}{k + q}$ und $C = \frac{2k}{k + q}$. Die allgemeine Rechnung für $B$ steht im Lernschritt „Beispiel“ dieses Themas.`,
        q:{q:R`Jetzt läuft die Welle von **rechts** auf dieselbe Stufe zu. Welcher Ansatz gehört dann links der Stufe ($x < 0$)?`,
          opts:[R`nur $Be^{-ikx}$`, R`$e^{ikx} + Be^{-ikx}$, wie bisher`, R`nur $Be^{ikx}$`], a:0,
          ex:R`Von links kommt nichts. Links bleibt nur die durchgelassene Welle, und die läuft nach links: $e^{-ikx}$. Angesetzt wird auf jeder Seite nur, was dort einläuft oder wegläuft.`,
          fb:['', R`Die einlaufende Welle $e^{ikx}$ kam von einer Quelle links. Die gibt es jetzt nicht mehr; links läuft nur Durchgelassenes weg.`,
            R`$e^{ikx}$ läuft nach rechts, also auf die Stufe zu. Was links ankommt, läuft aber von der Stufe weg nach links: $e^{-ikx}$.`]}},
      {id:'tunnel-t2d', title:'Anschluss als Gleichungssystem',
        num:{title:'In Matrixform', text:R`Sortiert nach den Unbekannten werden die Gleichungen aus dem Beispiel zu $B - C = -1$ und $2B + C = 2$:

$$\begin{pmatrix}1 & -1\\ 2 & 1\end{pmatrix}\begin{pmatrix}B\\ C\end{pmatrix} = \begin{pmatrix}-1\\ 2\end{pmatrix},\qquad \det = 1 + 2 = 3.$$

Aus der ersten Zeile folgt $C = B + 1$, eingesetzt in die zweite $3B + 1 = 2$. Also $B = \frac13$ und $C = \frac43$.`},
        text:R`Anschlussbedingungen sind ein lineares Gleichungssystem für die Amplituden. Das ist lineare Algebra, aber jede Zeile und jede Spalte hat eine physikalische Bedeutung. Die erste Zeile ist „$\psi$ stetig“, die zweite „$\psi'$ stetig“. Die Spalten gehören zur reflektierten und zur durchgelassenen Welle. Die rechte Seite stammt von der einlaufenden Welle; ohne sie wären alle Amplituden null. Die Tafel verfolgt die Stufe aus dem Beispiel von den Worten bis zum Bild.`,
        reps:{obj:R`Stufe mit $k = 2$ und $q = 1$, also $E = \tfrac43V_0$`,
          rows:[
            {k:'worte', text:R`Eine Welle läuft von links auf die Stufe. Ein Teil kommt zurück, ein Teil läuft weiter. Bei $x = 0$ gehen Wert und Steigung glatt ineinander über.`},
            {k:'formel', tex:R`1 + B = C,\qquad ik\,(1 - B) = iq\,C`},
            {k:'matrix', tex:R`\begin{pmatrix}1 & -1\\ k & q\end{pmatrix}\begin{pmatrix}B\\ C\end{pmatrix} = \begin{pmatrix}-1\\ k\end{pmatrix}`},
            {k:'mathe', text:R`Lineares $2\times2$-System mit $\det = k + q \ne 0$, also genau eine Lösung: $B = \frac{k - q}{k + q} = \frac13$ und $C = \frac{2k}{k + q} = \frac43$.`},
            {k:'graph', plot:{x:[-8, 8], y:[-1.6, 1.6], xlab:'x', ylab:R`\mathrm{Re}\,\psi`, ticks:[{x:-2 * Math.PI, lab:R`-2\pi`}, {x:-Math.PI, lab:R`-\pi`}, {x:0, lab:'0'}, {x:Math.PI, lab:R`\pi`}, {x:2 * Math.PI, lab:R`2\pi`}], V:x => x > 0 ? 0.75 : 0, Vr:[0, 1.5], E:1}, f:TUN_G.stepRe,
              cap:R`$\mathrm{Re}\,\psi$ zu einem festen Zeitpunkt. Links die Wellenlänge $\pi$, rechts $2\pi$. Bei $x = 0$ stimmen Wert und Steigung überein; nur die Krümmung springt.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Wert geht glatt über“ wird $\psi_L(0) = \psi_R(0)$, „Steigung geht glatt über“ wird $\psi_L'(0) = \psi_R'(0)$. Ansätze einsetzen, $x = 0$ setzen.`},
            {from:'formel', to:'matrix', rule:R`Den Faktor $i$ kürzen, dann nach $B$ und $C$ sortieren. Ihre Vorfaktoren werden die Matrix, alles andere die rechte Seite.`},
            {from:'matrix', to:'mathe', rule:R`Die Determinante bilden. Ist sie nicht null, gibt es genau eine Lösung; dann durch Einsetzen lösen.`},
            {from:'mathe', to:'graph', rule:R`$B$ und $C$ in die Ansätze einsetzen und $\mathrm{Re}\,\psi$ links und rechts zeichnen. Probe: Bei $x = 0$ treffen sich die Kurven ohne Knick.`}
          ]},
        q:{q:R`Eine Stufe hat $k = 3$ und $q = 1$. Welche Matrixgleichung beschreibt den Anschluss?`, tr:{from:'formel', to:'matrix'},
          opts:[R`$\begin{pmatrix}1 & 1\\ 3 & -1\end{pmatrix}\begin{pmatrix}B\\ C\end{pmatrix} = \begin{pmatrix}1\\ 3\end{pmatrix}$`, R`$\begin{pmatrix}1 & -1\\ 1 & 3\end{pmatrix}\begin{pmatrix}B\\ C\end{pmatrix} = \begin{pmatrix}-1\\ 1\end{pmatrix}$`, R`$\begin{pmatrix}1 & -1\\ 3 & 1\end{pmatrix}\begin{pmatrix}B\\ C\end{pmatrix} = \begin{pmatrix}-1\\ 3\end{pmatrix}$`], a:2,
          ex:R`$1 + B = C$ wird $B - C = -1$, und $3(1 - B) = C$ wird $3B + C = 3$. Lösung: $B = \tfrac12 = \frac{3 - 1}{3 + 1}$.`,
          fb:[R`Die erste Zeile muss aus $1 + B = C$ kommen, also $B - C = -1$. Hier sind Vorzeichen vertauscht.`,
            R`$k$ und $q$ sind vertauscht. $k = 3$ gehört zur reflektierten Welle links, also vor $B$.`, '']}},
      {id:'tunnel-t2e', title:'Die Stufe mit E < V₀: Totalreflexion',
        pre:{from:'m-komplex', seg:'mk-t1', title:'Betrag eines Quotienten', text:R`Es gilt $|z_1/z_2| = |z_1|/|z_2|$ und $|z^*| = |z|$. Ein Quotient aus einer Zahl und ihrer Konjugierten hat also den Betrag $1$. Mini-Beispiel: $\frac{1 - i}{1 + i} = -i$, und $|-i| = 1$.`},
        num:{title:'E = V₀/2', text:R`Dann ist $\kappa = k$, und die Formel unten gibt

$$B = \frac{k - ik}{k + ik} = \frac{1 - i}{1 + i} = -i,\qquad C = 1 + B = 1 - i.$$

Es ist $|B| = 1$: Alles wird reflektiert, mit der Phase $-i$, also um $90°$ verschoben.`},
        text:R`Ist $E < V_0$, wird rechts der Stufe aus der Welle ein abklingender Anteil: $\psi_L = e^{ikx} + Be^{-ikx}$ für $x < 0$ und $\psi_R = Ce^{-\kappa x}$ für $x > 0$. Dieselben zwei Anschlussbedingungen ergeben in der Herleitung

$$B = \frac{k - i\kappa}{k + i\kappa},\qquad |B| = 1.$$

Alles wird reflektiert. Trotzdem ist $\psi_R \ne 0$: Das Teilchen dringt in die Stufe ein. Die reflektierte Welle ist gegenüber der einlaufenden phasenverschoben, denn $B$ ist komplex. Wie groß die Phase ist, hängt von $\kappa/k$ ab.`,
        derive:{ctx:{coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['0.15 V_0', '0.85 V_0']}}, defs:{k:'sqrt(2m E)/ħ', κ:'sqrt(2m (V_0 - E))/ħ'}, unknowns:{B:{ref:'(k - iκ)/(k + iκ)', kind:'complex'}, C:{ref:'2k/(k + iκ)', kind:'complex'}}}, lines:[
          {l:'1 + B = C', w:'ψ stetig bei x = 0',
            why:{q:'Woher kommt diese Gleichung?', opts:['aus $\\psi_L(0) = \\psi_R(0)$; alle Exponentialfunktionen sind bei $x = 0$ gleich 1', 'aus $|\\psi_L|^2 = |\\psi_R|^2$, weil die Wahrscheinlichkeit erhalten ist', 'aus der Normierung: $B$ und $C$ müssen sich zu 1 ergänzen'], a:0, ex:'Stetig ist $\\psi$ selbst, nicht $|\\psi|^2$ allein. Bei $x = 0$ wird $e^{ikx}$, $e^{-ikx}$ und $e^{-\\kappa x}$ jeweils 1.'}},
          {l:'ik (1 - B) = -κ C', w:'ψ′ stetig bei x = 0',
            why:{q:'Warum steht rechts $-\\kappa C$?', opts:['weil $\\frac{d}{dx}Ce^{-\\kappa x} = -\\kappa Ce^{-\\kappa x}$ ist, bei $x = 0$ also $-\\kappa C$', 'weil im verbotenen Bereich die kinetische Energie negativ ist', 'weil $\\psi\'$ an der Stufe sein Vorzeichen wechseln muss'], a:0, ex:'Ableiten bringt den Faktor $-\\kappa$. Links bringt $e^{-ikx}$ den Faktor $-ik$, daher $ik(1 - B)$.'}},
          {l:'ik (1 - B) = -κ (1 + B)', w:'C eingesetzt'},
          {l:'B (κ - ik) = -κ - ik', w:'nach B sortiert'},
          {l:'B = (k - iκ)/(k + iκ)', w:'geteilt, Zähler und Nenner mit i multipliziert',
            why:{q:'Wie wird aus $B = \\frac{-\\kappa - ik}{\\kappa - ik}$ diese Form?', opts:['Zähler und Nenner mit $i$ multiplizieren', 'Zähler und Nenner konjugieren, $i \\to -i$', 'mit dem konjugierten Nenner $\\kappa + ik$ erweitern'], a:0, ex:'$i(-\\kappa - ik) = k - i\\kappa$ und $i(\\kappa - ik) = k + i\\kappa$.'}},
          {l:'|B| = 1', w:'Zähler und Nenner zueinander konjugiert',
            why:{q:'Was bedeutet $|B| = 1$?', opts:['Totalreflexion: $R = |B|^2 = 1$', 'Rechts der Stufe ist $\\psi = 0$', 'Die Welle kommt ohne Phasenverschiebung zurück'], a:0, ex:'Alles läuft zurück, aber $\\psi_R = Ce^{-\\kappa x} \\ne 0$, und $B$ hat eine Phase.'}}
        ]},
        q:{q:R`Bei einer Stufe mit $E < V_0$ ist $\kappa = 3k$. Welchen Betrag hat $B$?`,
          opts:[R`$\tfrac12$, aus $\frac{1 - 3}{1 + 3}$`, R`$1$`, R`$\tfrac13$, weil $\kappa = 3k$ ist`], a:1,
          ex:R`$B = \frac{1 - 3i}{1 + 3i}$: Zähler und Nenner sind zueinander konjugiert, also $|B| = 1$. Für jedes $E < V_0$ wird alles reflektiert.`,
          fb:[R`Das $i$ ist verloren gegangen. Mit $\frac{k - i\kappa}{k + i\kappa}$ haben Zähler und Nenner denselben Betrag.`, '',
            R`$|B|$ hängt nicht von $\kappa/k$ ab; nur die Phase von $B$ tut es.`]}},
      {id:'tunnel-t2f', title:'Typischer Fehler: Im verbotenen Bereich ist das Teilchen nie',
        num:{title:'Dichte hinter der Stufe', text:R`Mit $C = 1 - i$ aus dem letzten Schritt ist $|\psi_R|^2 = |C|^2e^{-2\kappa x} = 2\,e^{-2\kappa x}$. Bei $x = 0$ ist die Dichte $2$, bei $x = 1/\kappa$ noch $2/e^2 \approx 0{,}27$. Die Dichte fällt also mit der halben Eindringtiefe $1/(2\kappa)$ ab.`},
        text:R`**Typische Fehlvorstellung:** „Im verbotenen Bereich ist das Teilchen nie.“ Eine Ortsmessung kann es dort finden, mit kleiner, aber nicht verschwindender Wahrscheinlichkeit. Die Dichte $|\psi|^2$ fällt dort exponentiell ab, ist aber nicht null. Und der Energiesatz? Nach einer solchen Ortsmessung ist die Energie des Teilchens nicht mehr scharf; die Messung selbst überträgt Energie. Deshalb widerspricht das Eindringen nicht dem Energiesatz. Hinter einer unendlich langen Stufe kommt trotzdem nichts an. Wie der nächste Abschnitt zeigt, fließt dort kein Strom.`,
        q:{q:R`Wie groß ist die Dichte $|\psi_R|^2$ bei $x = 1/\kappa$ im Vergleich zu $x = 0$?`,
          opts:[R`$1/e \approx 0{,}37$-mal so groß`, R`$1/e^2 \approx 0{,}14$-mal so groß`, R`null, das Teilchen kann dort nicht sein`], a:1,
          ex:R`$|\psi|^2 \propto e^{-2\kappa x}$, bei $x = 1/\kappa$ also $e^{-2}$.`,
          fb:[R`Auf $1/e$ fällt $\psi$ selbst. Die Dichte ist das Quadrat davon.`, '',
            R`Die Dichte ist dort klein, aber nicht null. Das ist das Eindringen in den verbotenen Bereich.`]}}
    ]},

    /* ===== Abschnitt 3: Stromdichte, R und T ===== */
    {id:'tunnel-t3', title:'Stromdichte: Was heißen Reflexion und Transmission?', steps:[
      {id:'tunnel-t3a', title:'Warum Ströme?',
        pre:{from:'frei', seg:'frei-t2', title:'Ebene Welle als Strahl', text:R`Eine ebene Welle $Ae^{ikx}$ ist nicht normierbar. Als Modell eines Strahls ist sie trotzdem brauchbar: $|A|^2$ ist eine Teilchendichte, $j = \frac{\hbar k}{m}|A|^2$ die Zahl der Teilchen pro Zeit. Mini-Beispiel: $|A|^2 = 10^6\,\mathrm m^{-1}$ und $v = 6\cdot10^5\,\mathrm{m/s}$ geben $6\cdot10^{11}$ Teilchen pro Sekunde.`},
        num:{title:'Zwei Strahlen, gleiche Dichte', text:R`Mit $\hbar = m = 1$ hat $e^{2ix}$ die Dichte $1$ und den Strom $j = 2\cdot1 = 2$. $e^{ix}$ hat dieselbe Dichte, aber nur den Strom $j = 1$: Die Teilchen sind halb so schnell. Für $\frac43e^{ix}$ ist $j = 1\cdot\frac{16}{9} \approx 1{,}78$.`},
        text:R`Eine ebene Welle ist nicht normierbar (Thema 4). Deshalb deutet man bei der Streuung nicht $|C|^2$ als Wahrscheinlichkeit, sondern vergleicht Teilchen**ströme**. Die [[lex:stromdichte|Wahrscheinlichkeitsstromdichte]] aus Thema 2 ist

$$j = \frac{\hbar}{m}\,\mathrm{Im}\left(\psi^*\psi'\right).$$

Für $\psi = Ae^{ikx}$ ist $j = \frac{\hbar k}{m}|A|^2$: Dichte $|A|^2$ mal Geschwindigkeit $\hbar k/m$. Wie viele Teilchen pro Zeit durchkommen, hängt also auch davon ab, wie schnell sie sind. Zwei Wellen mit gleicher Amplitude können verschieden starke Ströme tragen.`,
        q:{q:R`Welchen Strom trägt $\psi = 3e^{-2ix}$ ($\hbar = m = 1$)?`,
          opts:[R`$+18$, denn Ströme sind immer positiv`, R`$-6$, also Amplitude mal Wellenzahl`, R`$-18$, der Strom fließt nach links`], a:2,
          ex:R`$j = \frac{\hbar k}{m}|A|^2 = (-2)\cdot9 = -18$. Das Vorzeichen gibt die Richtung.`,
          fb:[R`Das Vorzeichen von $j$ ist die Richtung. $e^{-2ix}$ läuft nach links.`,
            R`In $j$ steht das Betragsquadrat $|A|^2 = 9$, nicht $A$.`, '']}},
      {id:'tunnel-t3b', title:'Im stationären Zustand ist j überall gleich',
        pre:{from:'sg', seg:'sg-t6', title:'Kontinuitätsgleichung', text:R`$\partial_t|\Psi|^2 + \partial_xj = 0$. Die Wahrscheinlichkeit in einem Intervall ändert sich nur durch die Ströme an seinen Rändern: $\frac{d}{dt}\int_a^b|\Psi|^2dx = j(a) - j(b)$. Mini-Beispiel: Fließt bei $a$ mehr hinein als bei $b$ hinaus, wächst sie.`},
        num:{title:'Ein Gegenbeispiel, das es nicht gibt', text:R`Angenommen, links fließe $j = 2$ hinein und rechts nur $j = 1$ hinaus. Dann sammelte sich dazwischen in jeder Zeiteinheit die Wahrscheinlichkeit $1$ an. Die Dichte dort würde wachsen – im Widerspruch zu einem stationären Zustand, in dem $|\psi|^2$ fest ist.`},
        text:R`In einem stationären Zustand ist $|\psi|^2$ zeitunabhängig. Die [[lex:kontinuitaet|Kontinuitätsgleichung]] $\partial_t|\psi|^2 + \partial_xj = 0$ verlangt dann $\partial_xj = 0$. Der Strom ist also überall gleich: Was links ankommt, muss rechts weiterfließen. Das gilt auch über Sprungstellen von $V$ hinweg. Damit hast du eine Erhaltungsgröße, mit der du Reflexion und Transmission ausdrücken kannst. Links ist der Strom einlaufend minus reflektiert, rechts ist er der durchgelassene Strom.`,
        q:{q:R`In einem stationären Streuzustand ist links der Stufe der Strom $j = 0{,}9$ (netto nach rechts). Was gilt rechts?`,
          opts:[R`weniger als $0{,}9$, weil die Stufe bremst`, R`$j = 0{,}9$, weil sich nirgends etwas ansammelt`, R`$j = 1$, weil die einlaufende Welle die Amplitude $1$ hat`], a:1,
          ex:R`Im stationären Zustand ist $\partial_xj = 0$: Der Strom ist auf beiden Seiten gleich.`,
          fb:[R`Die Teilchen werden langsamer, aber dafür dichter. Der Strom bleibt.`, '',
            R`$1$ ist der einlaufende Strom bei $\hbar k/m = 1$. Netto fließt links nur einlaufend minus reflektiert.`]}},
      {id:'tunnel-t3c', title:'Links: einlaufend minus reflektiert',
        num:{title:'Die Stufe mit B = 1/3', text:R`Mit $k = 2$ und $B = \tfrac13$ ($\hbar = m = 1$):

$$j_L = 2\left(1 - \tfrac19\right) = \tfrac{16}{9}.$$

Rechts ist mit $q = 1$ und $C = \tfrac43$ der Strom $j_R = 1\cdot\tfrac{16}{9} = \tfrac{16}{9}$. Beide sind gleich, wie verlangt.`},
        text:R`Die Herleitung setzt $\psi_L = e^{ikx} + Be^{-ikx}$ in die Stromdichte ein. Die Mischterme aus einlaufender und reflektierter Welle fallen weg, und es bleibt

$$j_L = \frac{\hbar k}{m}\left(1 - |B|^2\right).$$

Lies das als Bilanz: einlaufender Strom $\hbar k/m$ minus reflektierter Strom $\frac{\hbar k}{m}|B|^2$. Rechts ist mit $\psi_R = Ce^{iqx}$ und $q = \sqrt{2m(E - V_0)}/\hbar$ der Strom $j_R = \frac{\hbar q}{m}|C|^2$. Die Dichte links schwankt mit $x$, der Strom tut es nicht.`,
        derive:{ctx:{coords:['x'], params:{m:'pos', k:'pos', 'b_1':'real', 'b_2':'real'}, defs:{B:'b_1 + i b_2', 'ψ_L(x)':'e^(i k x) + B e^(-i k x)'}}, lines:[
          {l:"ψ_L(x)^* = e^(-ikx) + B^* e^(ikx)", w:'ψ_L konjugiert',
            why:{q:'Woher kommt $B^*e^{ikx}$?', opts:['vom Konjugieren: $(Be^{-ikx})^* = B^*e^{ikx}$', 'vom Ableiten der reflektierten Welle $Be^{-ikx}$', 'Das ist die einlaufende Welle $e^{ikx}$.'], a:0, ex:'Konjugieren dreht das Vorzeichen von $i$ im Exponenten und konjugiert den Koeffizienten.'}},
          {l:"ψ_L'(x) = ik e^(ikx) - ik B e^(-ikx)", w:'ψ_L abgeleitet'},
          {l:"ψ_L(x)^* ψ_L'(x) = ik - ik |B|^2 + ik (B^* e^(2ikx) - B e^(-2ikx))", w:'beide Zeilen multipliziert und ausmultipliziert',
            why:{q:'Warum steht $-ik|B|^2$ und nicht $+ik|B|^2$?', opts:['Weil der Term aus $B^*e^{ikx}\\cdot(-ikB\\,e^{-ikx})$ entsteht.', 'Weil $|B|^2$ immer negativ ist.', 'Weil reflektierte Wellen negative Energie haben.'], a:0, ex:'Die Ableitung der reflektierten Welle bringt $-ik$; mal $B^*B = |B|^2$ ergibt $-ik|B|^2$.'}},
          {l:"ħ/m Im(ψ_L(x)^* ψ_L'(x)) = ħ k/m (1 - |B|^2)", w:'Imaginärteil genommen; der Mischterm ist reell',
            why:{q:'Warum fällt der Mischterm $ik(B^*e^{2ikx} - Be^{-2ikx})$ weg?', opts:['$B^*e^{2ikx} - Be^{-2ikx}$ ist rein imaginär, mal $ik$ also reell.', 'Er mittelt sich über $x$ weg; die Zeile gilt nur im Mittel.', 'Er ist klein, weil $|B| < 1$ ist, und wird weggelassen.'], a:0, ex:'Mit $w = Be^{-2ikx}$ ist $w^* - w = -2i\\,\\mathrm{Im}\\,w$ rein imaginär. Die Zeile gilt exakt, für jedes $x$.'}}
        ]},
        q:{q:R`An einer anderen Stufe ist $|B|^2 = 0{,}25$ und $k = 1$ ($\hbar = m = 1$). Wie groß ist $j_L$?`,
          opts:[R`$1{,}25$, einlaufend plus reflektiert`, R`$0{,}75$`, R`$0{,}5$, also $1 - |B|$`], a:1,
          ex:R`$j_L = 1\cdot(1 - 0{,}25) = 0{,}75$. Der reflektierte Strom fließt nach links und wird abgezogen.`,
          fb:[R`Der reflektierte Strom zeigt nach links; er zählt negativ.`, '',
            R`In der Bilanz steht $|B|^2$, nicht $|B|$.`]}},
      {id:'tunnel-t3d', title:'Reflexion und Transmission im Bild',
        num:{title:'Bilanz an der Stufe', text:R`Mit $B = \tfrac13$, $C = \tfrac43$ und $q/k = \tfrac12$:

$$\begin{gathered}R = |B|^2 = \tfrac19 \approx 0{,}11,\\ T = \frac qk|C|^2 = \tfrac12\cdot\tfrac{16}{9} = \tfrac89 \approx 0{,}89,\\ R + T = 1.\end{gathered}$$`},
        text:R`Aus $j_L = j_R$ folgt

$$R + T = 1\qquad\text{mit}\qquad R = |B|^2,\quad T = \frac{q}{k}|C|^2.$$

Das sind die [[lex:reflexion-transmission|Reflexions- und Transmissionswahrscheinlichkeit]]. Mit diesen Wahrscheinlichkeiten wird ein einzelnes Teilchen reflektiert oder durchgelassen. Die Tafel zeigt, wie du sie im Bild der Dichte wiederfindest. Links überlagern sich zwei Wellen, und $|\psi|^2$ bildet Streifen im Abstand einer halben Wellenlänge. Rechts läuft nur eine Welle, und $|\psi|^2$ ist konstant.`,
        reps:{obj:R`Reflexion und Transmission an der Stufe mit $k = 2$ und $q = 1$`,
          rows:[
            {k:'worte', text:R`Von neun einlaufenden Teilchen kommt im Mittel eines zurück, acht laufen weiter.`},
            {k:'formel', tex:R`j = \frac{\hbar}{m}\,\mathrm{Im}(\psi^*\psi'),\qquad R = \frac{|j_\mathrm{ref}|}{j_\mathrm{ein}} = |B|^2,\qquad T = \frac{j_\mathrm{trans}}{j_\mathrm{ein}} = \frac qk\,|C|^2`},
            {k:'graph', plot:{x:[-6, 6], y:[0, 2.1], xlab:'x', ylab:R`|\psi|^2`, ticks:[{x:-Math.PI, lab:R`-\pi`}, {x:-Math.PI / 2, lab:R`-\tfrac\pi2`}, {x:0, lab:'0'}, {x:Math.PI, lab:R`\pi`}], V:x => x > 0 ? 0.75 : 0, Vr:[0, 1.5], E:1}, f:TUN_G.stepRho,
              cap:R`Links schwankt $|\psi|^2$ zwischen $(1 - \tfrac13)^2 = \tfrac49$ und $(1 + \tfrac13)^2 = \tfrac{16}{9}$, im Abstand $\pi/2$. Rechts ist es konstant $|C|^2 = \tfrac{16}{9}$.`},
            {k:'physik', text:R`$R = \tfrac19$ und $T = \tfrac89$. Ein Zähler hinter der Stufe registriert pro Zeit $\tfrac89$ der einlaufenden Teilchen.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Teilchen pro Zeit“ heißt Strom. Den reflektierten und den durchgelassenen Strom durch den einlaufenden teilen.`},
            {from:'formel', to:'graph', rule:R`Die Dichte zeichnen. Links ist sie $1 + |B|^2 + 2|B|\cos(2kx)$ für reelles $B$, mit Streifen im Abstand $\pi/k$. Rechts ist sie $|C|^2$, ohne Streifen.`},
            {from:'graph', to:'physik', rule:R`Aus dem Streifenkontrast $|B|$ ablesen: Maximum $(1 + |B|)^2$, Minimum $(1 - |B|)^2$. Die Höhe rechts ist $|C|^2$; sie muss noch mit $q/k$ multipliziert werden.`}
          ]},
        q:{q:R`In einem anderen Bild schwankt $|\psi|^2$ links einer Stufe zwischen $0{,}64$ und $1{,}44$. Wie groß ist $R$?`, tr:{from:'graph', to:'physik'},
          opts:[R`$R = 0{,}2$`, R`$R = 0{,}8$, die Differenz der Werte`, R`$R = 0{,}04$`], a:2,
          ex:R`$(1 + |B|)^2 = 1{,}44$ und $(1 - |B|)^2 = 0{,}64$ geben $|B| = 0{,}2$, also $R = |B|^2 = 0{,}04$.`,
          fb:[R`$0{,}2$ ist $|B|$, die Amplitude. Die Wahrscheinlichkeit ist ihr Quadrat.`,
            R`Die Differenz $(1 + |B|)^2 - (1 - |B|)^2 = 4|B|$ ist kein Strom. Lies $|B|$ aus Maximum und Minimum ab.`, '']}},
      {id:'tunnel-t3e', title:'Typischer Fehler: T = |C|²',
        num:{title:'Die falsche Bilanz', text:R`Mit $B = \tfrac13$ und $C = \tfrac43$ wäre $|B|^2 + |C|^2 = \tfrac19 + \tfrac{16}{9} = \tfrac{17}{9} > 1$ – mehr Teilchen, als einlaufen. Erst der Faktor $q/k = \tfrac12$ bringt die Bilanz auf $\tfrac19 + \tfrac89 = 1$.`},
        text:R`**Typischer Fehler:** $T = |C|^2$. Dann wäre $|B|^2 + |C|^2 = 1$ – das gilt an der Stufe nicht. Rechts sind die Teilchen langsamer ($q < k$). Bei gleichem Strom drängen sie sich dichter: $|C|^2$ kann größer als $1$ sein, ohne dass mehr Teilchen durchkommen. Ähnlich staut sich der Verkehr, wo eine Straße langsamer wird. Kontrolliere deshalb immer $R + T = 1$. Im verbotenen Bereich ist $\psi_R = Ce^{-\kappa x}$, und $\psi_R^*\psi_R' = -\kappa|C|^2e^{-2\kappa x}$ ist reell. Dort fließt kein Strom: Hinter einer unendlich breiten Stufe ist $T = 0$ und deshalb $|B| = 1$.`,
        q:{q:R`An einer Stufe mit $E > V_0$ ist $C = 1{,}2$. Kommen dann mehr Teilchen durch, als einlaufen?`,
          opts:[R`Ja: $|C|^2 = 1{,}44 > 1$ heißt, dass die Welle verstärkt wird.`, R`Nein: Rechts sind sie langsamer und dichter; $T = \frac qk|C|^2 < 1$.`, R`Das kann nicht sein: Eine Amplitude $C > 1$ ist verboten.`], a:1,
          ex:R`Gezählt werden Teilchen pro Zeit, also Ströme. Die Dichte $|C|^2$ darf größer als $1$ sein.`,
          fb:[R`$|C|^2$ ist eine Dichte, kein Strom. Erst mit $q/k < 1$ wird daraus $T$.`, '',
            R`$C > 1$ ist erlaubt, etwa $C = 2k/(k + q)$ an der Stufe. Nur $T$ muss unter $1$ bleiben.`]}}
    ]},

    /* ===== Abschnitt 4: Rechteckbarriere ===== */
    {id:'tunnel-t4', title:'Rechteckbarriere und Tunneleffekt', steps:[
      {id:'tunnel-t4a', title:'Drei Bereiche, vier Unbekannte',
        num:{title:'Abzählen', text:R`Unbekannt sind $B$ (reflektiert), $C$ und $D$ (in der Barriere) und $F$ (durchgelassen). Bei $x = 0$ gibt es zwei Bedingungen, bei $x = a$ noch einmal zwei. Vier Gleichungen für vier Unbekannte: Das System hat genau eine Lösung.`},
        text:R`Jetzt ist der verbotene Bereich endlich: $V = V_0$ für $0 < x < a$, sonst $V = 0$, und $E < V_0$. Der Ansatz hat drei Teile:

$$\psi = \begin{cases} e^{ikx} + Be^{-ikx}, & x < 0,\\ Ce^{-\kappa x} + De^{\kappa x}, & 0 < x < a,\\ Fe^{ikx}, & x > a.\end{cases}$$

In der Barriere darfst du $e^{+\kappa x}$ nicht streichen. Der Bereich ist endlich, also wächst $e^{\kappa x}$ nirgends über alle Grenzen. Rechts steht wieder nur die auslaufende Welle. Die Rechnung ist länger als an der Stufe, aber nicht schwieriger.`,
        q:{q:R`Warum bleibt in der Barriere der Anteil $De^{+\kappa x}$ stehen?`,
          opts:[R`Weil er die Gleichung in der Barriere besser löst als $e^{-\kappa x}$.`, R`Weil der Bereich endlich ist; $e^{\kappa x}$ bleibt dort beschränkt.`, R`Weil von rechts ein Teilchen in die Barriere einläuft.`], a:1,
          ex:R`Gestrichen wird $e^{\kappa x}$ nur, wenn der Bereich bis $x \to \infty$ reicht. Hier endet er bei $x = a$.`,
          fb:[R`Beide lösen $\psi'' = \kappa^2\psi$ gleich gut. Es geht um die Normierbarkeit.`, '',
            R`Von rechts läuft nichts ein; das steckt im Ansatz $Fe^{ikx}$ allein. $De^{\kappa x}$ ist keine einlaufende Welle.`]}},
      {id:'tunnel-t4b', title:'Die Transmission T(E)',
        num:{title:'Die Barriere des Labors', text:R`$E = 0{,}5\,V_0$ und $a = 2$ in Laboreinheiten: $\kappa = \sqrt{0{,}5} \approx 0{,}707$, $\kappa a \approx 1{,}414$ und $\sinh^2(\kappa a) \approx 3{,}75$. Mit $\frac{V_0^2}{4E(V_0 - E)} = 1$ wird

$$T = \frac{1}{1 + 3{,}75} \approx 0{,}21.$$

Rund jedes fünfte Teilchen kommt durch.`},
        text:R`Die vier Anschlussbedingungen liefern

$$T = |F|^2 = \left[1 + \frac{V_0^2\sinh^2(\kappa a)}{4E(V_0 - E)}\right]^{-1}.$$

Hier ist $T = |F|^2$ ohne den Faktor aus Abschnitt 3, weil links und rechts dasselbe $k$ gilt. $\sinh$ ist der hyperbolische Sinus, $\sinh u = (e^u - e^{-u})/2$. Für jede endliche Breite ist $\sinh^2(\kappa a)$ endlich, also $T > 0$: Das Teilchen **tunnelt**. Das ist der [[lex:tunneleffekt|Tunneleffekt]]. Klassisch wäre $T = 0$ für jedes $E < V_0$.`,
        q:{q:R`Warum ist für $E < V_0$ und endliche Breite immer $T > 0$?`,
          opts:[R`Weil das Teilchen in der Barriere Energie gewinnt.`, R`Weil $\sinh$ für große Argumente negativ wird.`, R`Weil $\sinh^2(\kappa a)$ endlich ist und der Nenner endlich bleibt.`], a:2,
          ex:R`$T = 1/(1 + \text{endliche Zahl}) > 0$. Erst für $a \to \infty$ geht $T$ gegen null.`,
          fb:[R`Die Energie ist in allen Bereichen dieselbe. Tunneln braucht keinen Energiegewinn.`,
            R`$\sinh u$ ist für $u > 0$ positiv und wächst wie $e^u/2$.`, '']}},
      {id:'tunnel-t4c', title:'Dicke Barrieren: exponentiell kleines T',
        num:{title:'Ein Elektron vor 1 nm Oxid', text:R`Für $V_0 - E = 1\,\mathrm{eV}$ ist $\kappa \approx 5{,}12\,\mathrm{nm}^{-1}$. Bei $a = 1\,\mathrm{nm}$ ist $2\kappa a \approx 10{,}2$ und

$$e^{-2\kappa a} \approx 3{,}5\cdot10^{-5}.$$

Ein Proton ist $1836$-mal schwerer; sein $\kappa$ ist $\sqrt{1836} \approx 43$-mal so groß, und $e^{-2\kappa a} \approx e^{-440}$ ist praktisch null.`},
        text:R`Ist $\kappa a \gg 1$, dann ist $\sinh(\kappa a) \approx e^{\kappa a}/2$, und die Eins in der Klammer ist vernachlässigbar. Die Herleitung führt das aus:

$$T \approx 16\,\frac{E}{V_0}\left(1 - \frac{E}{V_0}\right)e^{-2\kappa a}.$$

Entscheidend ist der Exponentialfaktor. Er hängt von Breite, Höhe und Masse ab: $\kappa a = a\sqrt{2m(V_0 - E)}/\hbar$. Der Vorfaktor liegt dagegen immer zwischen $0$ und $4$. Deshalb tunneln Elektronen durch Schichten von einem Nanometer merklich, schwere Teilchen praktisch nie.`,
        derive:{ctx:{coords:[], params:{m:'pos', V_0:'pos', a:'pos', E:{range:['0.15 V_0', '0.85 V_0']}}, defs:{κ:'sqrt(2m (V_0 - E))/ħ'}}, lines:[
          {l:'V_0^2 sinh(κa)^2/(4E(V_0 - E)) = V_0^2 (e^(κa) - e^(-κa))^2/(16 E (V_0 - E))', w:'sinh u = (eᵘ − e⁻ᵘ)/2',
            why:{q:'Woher kommt der Faktor 16 im Nenner?', opts:['aus $\\sinh^2 u = (e^u - e^{-u})^2/4$ zusammen mit der 4', 'aus $V_0^2$ mit $V_0 = 4E$', 'aus der Normierung der einlaufenden Welle'], a:0, ex:'$4\\cdot 4 = 16$. Die Zeile ist noch exakt.'}},
          {l:'≈ V_0^2 e^(2κa)/(16 E (V_0 - E))', w:'κa ≫ 1: e^{−κa} vernachlässigt',
            why:{q:'Warum darf man $e^{-\\kappa a}$ weglassen?', opts:['Weil für $\\kappa a \\gg 1$ gilt: $e^{-\\kappa a} \\ll e^{\\kappa a}$.', 'Weil $e^{-\\kappa a}$ negativ ist.', 'Weil die Barriere dünn ist.'], a:0, ex:'Schon bei $\\kappa a = 3$ ist $e^{-\\kappa a}/e^{\\kappa a} = e^{-6} \\approx 0{,}0025$.'}},
          {l:'T ≈ 16 E (V_0 - E)/V_0^2 e^(-2κa)', w:'der Bruch ist ≫ 1, die Eins entfällt; Kehrwert',
            why:{q:'Welcher Faktor bestimmt $T$ hauptsächlich?', opts:['$e^{-2\\kappa a}$', 'der Vorfaktor $16E(V_0 - E)/V_0^2$', 'beide gleich stark'], a:0, ex:'Der Vorfaktor liegt zwischen 0 und 4; $e^{-2\\kappa a}$ ändert sich über viele Zehnerpotenzen.'}}
        ]},
        q:{q:R`Bei $\kappa a = 5$ wird die Barriere doppelt so breit. Um welchen Faktor ändert sich $T$ ungefähr?`,
          opts:[R`um den Faktor $\tfrac12$`, R`um $e^{-10} \approx 4{,}5\cdot10^{-5}$`, R`um $e^{-5} \approx 7\cdot10^{-3}$`], a:1,
          ex:R`$e^{-2\kappa a}$ wird zu $e^{-4\kappa a}$: Es kommt noch einmal $e^{-2\kappa a} = e^{-10}$ dazu.`,
          fb:[R`$T$ hängt exponentiell von $a$ ab, nicht wie $1/a$.`, '',
            R`Im Exponenten steht $2\kappa a$. Die zusätzliche Breite $a$ bringt also $e^{-2\cdot5}$.`]}},
      {id:'tunnel-t4d', title:'Tunneln in Formel, Bild und Labor',
        num:{title:'Amplitude und Wahrscheinlichkeit', text:R`Im Labor mit $E = 0{,}5\,V_0$ und $a = 2$ ist $T \approx 0{,}21$. Die durchgelassene Welle hat deshalb die Amplitude $|F| = \sqrt T \approx 0{,}46$. In $\mathrm{Re}\,\psi$ siehst du rechts Berge der Höhe $0{,}46$, in $|\psi|^2$ eine waagerechte Linie bei $0{,}21$.`},
        text:R`Die Tafel verbindet den Ansatz mit dem Bild und mit dem Labor. Achte auf zwei Übersetzungen, die oft verwechselt werden. Erstens ist rechts die **Amplitude** $|F| = \sqrt T$ kleiner, die **Wellenlänge** aber gleich. Das Teilchen verliert beim Tunneln keine Energie; es kommt nur seltener durch. Zweitens schwingt $\psi$ in der Barriere nicht. $|\psi|$ nimmt dort im Wesentlichen exponentiell ab, weil die beiden Anteile $Ce^{-\kappa x}$ und $De^{\kappa x}$ zusammenwirken.`,
        reps:{obj:R`Rechteckbarriere mit $E = 0{,}5\,V_0$ und $a = 2$ (Laboreinheiten)`,
          rows:[
            {k:'worte', text:R`Ein Teilchen trifft auf einen Wall, der höher ist als seine Energie. Etwa jedes fünfte kommt trotzdem durch, mit unveränderter Energie.`},
            {k:'formel', tex:R`\psi = \begin{cases} e^{ikx} + Be^{-ikx}\\ Ce^{-\kappa x} + De^{\kappa x}\\ Fe^{ikx}\end{cases}\qquad T = |F|^2 = \left[1 + \frac{V_0^2\sinh^2\kappa a}{4E(V_0 - E)}\right]^{-1}`},
            {k:'graph', plot:{x:[-15, 15], xlab:'x', ylab:R`\psi`, ticks:[{x:-10, lab:'-10'}, {x:0, lab:'0'}, {x:2, lab:'a'}, {x:10, lab:'10'}], V:x => x > 0 && x < 2 ? 1 : 0, Vr:[0, 1.3], E:0.5, regions:[{x:[0, 2], lab:'Barriere'}]}, f:SK.lab.f, lab:R`\mathrm{Re}\,\psi`, f2:TUN_G.barRho, lab2:R`|\psi|^2`,
              cap:R`Rechts ist $|\psi|^2 = |F|^2 \approx 0{,}21$ konstant, und $\mathrm{Re}\,\psi$ schwingt mit der Amplitude $0{,}46$ und derselben Wellenlänge wie links. In der Barriere fallen beide ohne Schwingung ab.`},
            {k:'labor', text:R`Regler „Energie E/V₀“ auf $0{,}5$, „Breite“ auf $2$. Die Anzeige nennt $T = |t|^2 \approx 0{,}21$ und $R = |r|^2 \approx 0{,}79$; das Labor nennt die Amplituden $r$ und $t$, hier heißen sie $B$ und $F$. Unten markiert ein Punkt $T$ auf der Kurve $T(E)$.`},
            {k:'physik', text:R`Von $1000$ Elektronen kommen im Mittel $211$ durch. Hinter der Barriere haben sie dieselbe Energie und Wellenlänge wie davor.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Drei Bereiche, drei Ansätze. „Kommt durch“ ist $|F|^2$; „unveränderte Energie“ heißt rechts dasselbe $k$ wie links.`},
            {from:'formel', to:'graph', rule:R`Die Konstanten aus den vier Anschlussbedingungen einsetzen. Rechts ist $|\psi|^2 = |F|^2$ konstant, $\mathrm{Re}\,\psi$ schwingt mit der Amplitude $|F|$.`},
            {from:'graph', to:'labor', rule:R`Dieselbe Energie und Breite im Labor einstellen. Die dicke Kurve ist $|\psi|^2$, die dünne $\mathrm{Re}\,\psi$; $T$ steht in der Anzeige.`},
            {from:'labor', to:'physik', rule:R`$T$ ist der Anteil der durchgelassenen Teilchen. Die Wellenlänge rechts zeigt, dass keine Energie verloren geht.`}
          ]},
        q:{q:R`Im Labor liest du bei einer anderen Einstellung $T = 0{,}04$ ab. Was heißt das für einen Strahl von $10^6$ Elektronen pro Sekunde?`, tr:{from:'labor', to:'physik'},
          opts:[R`Es kommen $2\cdot10^5$ pro Sekunde durch, denn $\sqrt{0{,}04} = 0{,}2$.`, R`Alle kommen durch, aber mit $4\,\%$ ihrer Energie.`, R`Es kommen etwa $4\cdot10^4$ pro Sekunde durch, mit voller Energie.`], a:2,
          ex:R`$T$ ist die Wahrscheinlichkeit für ein einzelnes Elektron: $0{,}04\cdot10^6 = 4\cdot10^4$. Ihre Energie ist dieselbe wie vorher.`,
          fb:[R`$\sqrt T = |F|$ ist die Amplitude. Gezählt wird mit $T = |F|^2$.`,
            R`$T$ ist kein Energieanteil. Durchgelassene Elektronen haben die volle Energie.`, '']}},
      {id:'tunnel-t4e', title:'Typischer Fehler: Energieverlust beim Tunneln',
        num:{title:'Breiter, aber nicht langsamer', text:R`Bei $E = 0{,}5\,V_0$ fällt $T$ von $0{,}21$ ($a = 2$) über $0{,}056$ ($a = 3$) auf $0{,}014$ ($a = 4$). Die Wellenlänge rechts bleibt in allen drei Fällen $2\pi/k \approx 8{,}9$.`},
        text:R`**Typische Fehlvorstellung:** „Beim Tunneln verliert das Teilchen Energie, deshalb ist die Welle rechts länger.“ Sie ist unter Studierenden verbreitet (McKagan, Perkins & Wieman 2008). Ein stationärer Zustand hat aber in allen Bereichen dasselbe $E$. Rechts ist $V = 0$ wie links, also sind auch $k$ und die Wellenlänge gleich. Im Labor siehst du das oben im Bild: Vergrößerst du die Breite, wird nur die Amplitude rechts kleiner. Unten zeigt die Kurve $T(E)$; ihr Punkt bei der eingestellten Energie sinkt mit wachsender Breite rasch ab.`,
        fig:{lab:'barrier', init:{a:3, e:0.5, view:'both'}, caption:'Oben: $V(x)$, die Energie $E$ (gestrichelt) und $\\psi$ auf der Energielinie (dünn $\\mathrm{Re}\\,\\psi$, dick $|\\psi|^2$). Unten: $T(E)$. Vergrößere die Breite: $T$ fällt exponentiell, die Wellenlänge rechts bleibt gleich. Oberhalb von $V_0$ gibt es Resonanzen mit $T = 1$.'},
        q:{q:R`Ein Elektron hat die Barriere durchtunnelt. Wie verhält sich seine Wellenlänge rechts zu der links?`,
          opts:[R`größer, weil $E$ in der Barriere abgenommen hat`, R`gleich, weil links und rechts $V = 0$ und $E$ gleich ist`, R`kleiner, weil es von der Barriere beschleunigt wurde`], a:1,
          ex:R`Kleiner ist nur die Amplitude. Die Energie – und damit $k$ – ist dieselbe (McKagan, Perkins & Wieman 2008).`,
          fb:[R`Das ist die verbreitete Fehlvorstellung. In der stationären Gleichung steht überall dasselbe $E$.`, '',
            R`Rechts ist $V = 0$ wie links. Es gibt nichts, was das Elektron beschleunigt hätte.`]}},
      {id:'tunnel-t4f', title:'Über der Barriere: Resonanzen',
        num:{title:'Breite 3', text:R`Für $E > V_0$ ist in Laboreinheiten $q = \sqrt{E/V_0 - 1}$. Bei $a = 3$ ist $qa = \pi$ für $E = \left(1 + (\pi/3)^2\right)V_0 \approx 2{,}10\,V_0$. Dort ist $T = 1$. Bei $E = 1{,}5\,V_0$ ist dagegen nur $T \approx 0{,}81$.`},
        text:R`Für $E > V_0$ wird aus $\kappa$ die reelle Wellenzahl $q = \sqrt{2m(E - V_0)}/\hbar$ und aus $\sinh$ ein $\sin$:

$$T = \left[1 + \frac{V_0^2\sin^2(qa)}{4E(E - V_0)}\right]^{-1}.$$

Dann ist im Allgemeinen $T < 1$: Auch über der Barriere wird ein Teil reflektiert. Nur bei $qa = n\pi$ ist $T = 1$. An diesen **Resonanzen** löschen sich die Reflexionen an beiden Kanten aus. Klassisch wäre $T = 1$ für alle $E > V_0$ und $T = 0$ für alle $E < V_0$. Quantenmechanisch steigt $T(E)$ stetig an.`,
        q:{q:R`Bei welcher Energie hat eine Barriere der Breite $a = \pi$ (Laboreinheiten) ihre erste Resonanz über $V_0$?`,
          opts:[R`bei $E = V_0$, genau an der Kante`, R`bei $E = 2V_0$`, R`bei $E = (1 + \pi^2)V_0$`], a:1,
          ex:R`$qa = \pi$ heißt $q = 1$, also $E/V_0 - 1 = 1$.`,
          fb:[R`Bei $E = V_0$ ist $q = 0$, und $\sin(qa)/q$ bleibt endlich: $T < 1$.`, '',
            R`Das wäre $q = \pi$, also $qa = \pi^2$. Gesucht ist $qa = \pi$.`]}}
    ]},

    /* ===== Abschnitt 5: endlicher Potentialtopf ===== */
    {id:'tunnel-t5', title:'Der endliche Potentialtopf', steps:[
      {id:'tunnel-t5a', title:'Ein Topf mit endlich hohen Wänden',
        num:{title:'Ein Quantentopf von 1 nm', text:R`Ein Elektron in einem Topf der Breite $2a = 1\,\mathrm{nm}$ und der Tiefe $V_0 = 1\,\mathrm{eV}$. Für eine Energie $0{,}2\,\mathrm{eV}$ über dem Boden ist

$$\begin{aligned}l &= \sqrt{26{,}2\cdot0{,}2}\,\mathrm{nm}^{-1}\\ &\approx 2{,}29\,\mathrm{nm}^{-1}\ \text{(innen)},\\ \kappa &= \sqrt{26{,}2\cdot0{,}8}\,\mathrm{nm}^{-1}\\ &\approx 4{,}58\,\mathrm{nm}^{-1}\ \text{(außen)}.\end{aligned}$$

Innen schwingt $\psi$, außen klingt es auf $1/\kappa \approx 0{,}22\,\mathrm{nm}$ ab.`},
        text:R`Kehre das Vorzeichen um: ein Topf mit $V = -V_0$ für $|x| < a$, außen $V = 0$. Für $-V_0 < E < 0$ ist das Innere erlaubt und das Äußere verboten. Das ist ein realistischeres Modell als der unendliche Kasten, etwa für ein Elektron in einer dünnen Halbleiterschicht (Quantentopf). Innen schwingt $\psi$ mit $l = \sqrt{2m(E + V_0)}/\hbar$, außen klingt es mit $\kappa = \sqrt{-2mE}/\hbar$ ab. Weil $V$ symmetrisch ist, kannst du gerade und ungerade Lösungen getrennt suchen.`,
        q:{q:R`Welcher Ansatz gehört außen rechts ($x > a$) zu einem gebundenen Zustand?`,
          opts:[R`$Fe^{ikx}$, eine auslaufende Welle`, R`$Fe^{-\kappa x}$`, R`$Fe^{-\kappa x} + Ge^{\kappa x}$`], a:1,
          ex:R`Für $E < 0$ ist außen verbotenes Gebiet, und der Bereich reicht bis $x \to \infty$. Normierbar bleibt nur $e^{-\kappa x}$.`,
          fb:[R`Eine laufende Welle gibt es nur bei $E > 0$. Gebunden heißt $E < 0$.`, '',
            R`$e^{\kappa x}$ wächst für $x \to \infty$ über alle Grenzen. Also muss $G = 0$ sein.`]}},
      {id:'tunnel-t5b', title:'Anschluss bei x = a: eine Gleichung für E',
        num:{title:'Die gerade Lösung im Beispiel', text:R`Mit $l \approx 2{,}29\,\mathrm{nm}^{-1}$ und $a = 0{,}5\,\mathrm{nm}$ ist $la \approx 1{,}15$ und $l\tan(la) \approx 2{,}29\cdot2{,}21\,\mathrm{nm}^{-1} \approx 5{,}1\,\mathrm{nm}^{-1}$. Das ist nicht ganz $\kappa \approx 4{,}58\,\mathrm{nm}^{-1}$: $0{,}2\,\mathrm{eV}$ liegt knapp daneben. Die Bedingung erfüllt erst $E + V_0 \approx 0{,}19\,\mathrm{eV}$.`},
        text:R`Für die geraden Lösungen setzt du an:

$$\psi = A\cos(lx)\ \ (|x| < a),\qquad \psi = Fe^{-\kappa|x|}\ \ (|x| > a).$$

Die Anschlussbedingungen bei $x = a$ ergeben in der Herleitung $l\tan(la) = \kappa$. Bei $x = -a$ folgt dasselbe aus der Symmetrie. Für ungerade Lösungen ($\sin lx$) entsteht $-l\cot(la) = \kappa$. Die Amplituden $A$ und $F$ fallen heraus. Übrig bleibt eine Gleichung, in der nur noch $E$ unbekannt ist, denn $l$ und $\kappa$ hängen beide von $E$ ab.`,
        derive:{ctx:{coords:['x'], params:{a:'pos', A:'pos', m:'pos', l:{range:['0.2/a', '1.3/a']}}, defs:{κ:'l tan(l a)', F:'A cos(l a) e^(κ a)'}}, lines:[
          {l:'A cos(l a) = F e^(-κ a)', w:'ψ stetig bei x = a',
            why:{q:'Welche Bedingung steckt in dieser Zeile?', opts:['$\\psi$ innen und außen sind bei $x = a$ gleich.', '$\\psi$ ist bei $x = a$ gleich null, wie an einer Wand.', 'Die Normierung von $\\psi$ über den Topf.'], a:0, ex:'Die Wand ist endlich hoch: $\\psi(a) \\ne 0$, die Funktion ragt hinaus.'}},
          {l:'-l A sin(l a) = -κ F e^(-κ a)', w:'ψ′ stetig bei x = a'},
          {l:'l tan(l a) = κ', w:'zweite Gleichung durch die erste geteilt',
            why:{q:'Warum teilt man die beiden Gleichungen durcheinander?', opts:['$A$ und $F$ fallen heraus; übrig bleibt eine Gleichung nur für $E$.', 'um $\\kappa$ unabhängig von $E$ zu machen', 'weil eine der beiden Gleichungen überflüssig ist'], a:0, ex:'$l$ und $\\kappa$ hängen beide von $E$ ab. Die Gleichung bestimmt die erlaubten Energien; $F/A$ folgt danach aus der ersten Zeile.'}}
        ]},
        q:{q:R`Was bestimmt die Gleichung $l\tan(la) = \kappa$?`,
          opts:[R`das Verhältnis $F/A$ der Amplituden`, R`die erlaubten Energien $E$`, R`die Breite $a$, die der Topf haben muss`], a:1,
          ex:R`$l$ und $\kappa$ hängen von $E$ ab, $a$ ist gegeben. Die Gleichung hat nur einzelne Lösungen $E$: Die Energie ist quantisiert.`,
          fb:[R`$F/A$ folgt erst danach aus der Stetigkeit. Beim Teilen ist es herausgefallen.`, '',
            R`Die Breite ist durch den Topf vorgegeben. Gesucht sind die Energien, die zu ihm passen.`]}},
      {id:'tunnel-t5c', title:'Grafische Lösung: Schnittpunkte sind Energien',
        num:{title:'Der Topf aus dem Beispiel', text:R`$z_0 = a\sqrt{2mV_0}/\hbar = 0{,}5\cdot\sqrt{26{,}2} \approx 2{,}56$. Der erste Ast von $\tan z$ schneidet $\sqrt{(z_0/z)^2 - 1}$ bei $z \approx 1{,}12$. Daraus folgt die Energie über dem Boden

$$E + V_0 = \frac{\hbar^2z^2}{2ma^2} = \frac{1{,}12^2}{26{,}2\cdot0{,}25}\,\mathrm{eV} \approx 0{,}19\,\mathrm{eV}.$$`},
        text:R`Mit $z = la$ und $z_0 = a\sqrt{2mV_0}/\hbar$ gilt $(la)^2 + (\kappa a)^2 = z_0^2$. Die Bedingung wird dann

$$\tan z = \sqrt{(z_0/z)^2 - 1}.$$

Zeichne beide Seiten über $z$; die Schnittpunkte sind die Energien. Die rechte Seite fällt von $\infty$ bei $z \to 0$ auf $0$ bei $z = z_0$. Der erste Ast von $\tan z$ steigt von $0$ an. Deshalb gibt es immer mindestens einen Schnittpunkt: Jeder endliche Topf in einer Dimension hat einen gebundenen Zustand, so flach er auch ist. Insgesamt gibt es $N = \lceil 2z_0/\pi\rceil$ gebundene Zustände, gerade und ungerade abwechselnd.`,
        reps:{obj:R`Gerade Zustände im Topf mit $z_0 \approx 2{,}56$`,
          rows:[
            {k:'worte', text:R`Nur bei bestimmten Energien passt eine Schwingung innen glatt an eine abklingende Lösung außen.`},
            {k:'formel', tex:R`l\tan(la) = \kappa,\qquad l^2 + \kappa^2 = \frac{2mV_0}{\hbar^2}`},
            {k:'mathe', tex:R`\tan z = \sqrt{(z_0/z)^2 - 1},\qquad z = la,\quad z_0 = \frac{a\sqrt{2mV_0}}{\hbar}`},
            {k:'graph', plot:{x:[0, 3], y:[0, 5], xlab:'z', ylab:'', ticks:[{x:Math.PI / 2, lab:R`\pi/2`}, {x:1.1188, lab:R`1{,}12`}, {x:2.5616, lab:'z_0'}]}, f:TUN_G.tanz, lab:R`\tan z`, f2:TUN_G.rhs, lab2:R`\sqrt{(z_0/z)^2 - 1}`,
              cap:R`Schnittpunkt bei $z \approx 1{,}12$: der gerade Grundzustand. Der nächste Ast von $\tan z$ beginnt erst bei $z = \pi > z_0$; einen zweiten geraden Zustand gibt es nicht.`},
            {k:'physik', text:R`Grundzustand $0{,}19\,\mathrm{eV}$ über dem Boden. Dazu kommt ein ungerader Zustand bei $0{,}70\,\mathrm{eV}$: zusammen $N = 2$ gebundene Zustände.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Innen schwingt, außen klingt ab, glatt verbunden“: $\psi$ und $\psi'$ bei $x = a$ gleichsetzen und durcheinander teilen.`},
            {from:'formel', to:'mathe', rule:R`Mit $a$ multiplizieren, $z = la$ setzen und $\kappa a$ durch $\sqrt{z_0^2 - z^2}$ ersetzen. Jetzt steht eine Gleichung in einer Variablen da.`},
            {from:'mathe', to:'graph', rule:R`Linke und rechte Seite als zwei Kurven über $z$ zeichnen und die Schnittpunkte suchen.`},
            {from:'graph', to:'physik', rule:R`Jeden Schnittpunkt $z$ in $E + V_0 = \hbar^2z^2/(2ma^2)$ umrechnen. Die Zahl der Schnittpunkte ist die Zahl der Zustände.`}
          ]},
        q:{q:R`Ein tieferer Topf hat $z_0 = 5$. Wie viele **gerade** gebundene Zustände zeigt das Bild dann?`, tr:{from:'graph', to:'physik'},
          opts:[R`$4$, so viele wie $\lceil 2z_0/\pi\rceil$`, R`$2$`, R`$1$, wie bei jedem Topf`], a:1,
          ex:R`Die Äste von $\tan z$ mit positiven Werten beginnen bei $0$ und bei $\pi \approx 3{,}14$; beide liegen unter $z_0 = 5$. Der nächste beginnt bei $2\pi > 5$.`,
          fb:[R`$4$ ist die Zahl aller gebundenen Zustände. Gefragt sind nur die geraden.`, '',
            R`Mindestens einen gibt es immer, aber ein tiefer Topf hat mehr.`]}},
      {id:'tunnel-t5d', title:'Typischer Fehler: die Energien des unendlichen Kastens übernehmen',
        pre:{from:'kasten', seg:'kasten-t2', title:'Unendlicher Kasten', text:R`Im unendlich hohen Kasten der Breite $L$ ist $E_n = \frac{n^2\pi^2\hbar^2}{2mL^2}$, und $\psi$ verschwindet an den Wänden. Mini-Beispiel: Für ein Elektron mit $L = 1\,\mathrm{nm}$ ist $E_1 \approx 0{,}38\,\mathrm{eV}$.`},
        num:{title:'Endlich gegen unendlich', text:R`Topf aus dem Beispiel: Grundzustand $0{,}19\,\mathrm{eV}$, erster angeregter Zustand $0{,}70\,\mathrm{eV}$ über dem Boden. Unendlicher Kasten derselben Breite $1\,\mathrm{nm}$: $0{,}38\,\mathrm{eV}$ und $1{,}50\,\mathrm{eV}$. Die Energien im endlichen Topf sind nur etwa halb so groß.`},
        text:R`**Typischer Fehler:** die Energien des unendlichen Kastens für den endlichen Topf übernehmen. Die Wellenfunktion ragt in die Wände hinein. Sie hat effektiv mehr Platz, eine größere Wellenlänge und deshalb weniger kinetische Energie. Die Energien, vom Topfboden aus gemessen, liegen also tiefer als im unendlichen Kasten der Breite $2a$. Für $z_0 \to \infty$ nähern sie sich diesen Werten von unten. Außerdem gibt es nur endlich viele gebundene Zustände. Zusammengefasst im Lexikon: [[lex:endlicher-topf|endlicher Potentialtopf]].`,
        q:{q:R`Ein endlicher Topf und ein unendlicher Kasten haben dieselbe Breite. Wo liegt die Grundzustandsenergie im endlichen Topf, vom Topfboden gemessen?`,
          opts:[R`höher, weil die Wände nur $V_0$ statt $\infty$ hoch sind`, R`genauso hoch, weil die Breite $2a$ gleich ist`, R`tiefer, weil $\psi$ in die Wände eindringt`], a:2,
          ex:R`Mehr Platz heißt größere Wellenlänge und weniger kinetische Energie.`,
          fb:[R`Niedrigere Wände halten das Teilchen schwächer fest. Es breitet sich weiter aus und hat dadurch weniger kinetische Energie.`,
            R`Im endlichen Topf ist $\psi$ an den Wänden nicht null, sondern ragt hinaus. Die effektive Breite ist größer.`, '']}}
    ]},

    /* ===== Abschnitt 6: δ-Potential ===== */
    {id:'tunnel-t6', title:'Das δ-Potential', steps:[
      {id:'tunnel-t6a', title:'Schmal und tief: das δ-Potential',
        pre:{from:'m-analysis', seg:'ma-t5', title:'δ als Grenzfall', text:R`Ein Rechteck der Breite $2\varepsilon$ und der Höhe $1/(2\varepsilon)$ hat die Fläche $1$. Für $\varepsilon \to 0$ wird es zur δ-Distribution mit $\int f(x)\,\delta(x)\,dx = f(0)$. Mini-Beispiel: $\int\cos x\,\delta(x)\,dx = 1$.`},
        num:{title:'Immer schmaler, immer tiefer', text:R`Halte $2aV_0 = \alpha = 0{,}1\,\mathrm{eV\,nm}$ fest. Ein Topf mit $2a = 0{,}1\,\mathrm{nm}$ hat dann $V_0 = 1\,\mathrm{eV}$, einer mit $2a = 0{,}01\,\mathrm{nm}$ schon $V_0 = 10\,\mathrm{eV}$. Die Fläche $2aV_0$ bleibt $0{,}1\,\mathrm{eV\,nm}$.`},
        text:R`Mach den Topf immer schmaler und tiefer, so dass die Fläche $2aV_0 = \alpha$ fest bleibt. Im Grenzfall entsteht das [[lex:delta-potential|δ-Potential]]

$$V(x) = -\alpha\,\delta(x),\qquad \alpha > 0.$$

Es ist ein einfaches Modell für eine sehr kurzreichweitige Anziehung, etwa eine Störstelle in einem Kristall. $\alpha$ hat die Einheit Energie mal Länge. Überall außer bei $x = 0$ ist $V = 0$, das Teilchen also frei. Die ganze Wirkung des Potentials sitzt in einem einzigen Punkt.`,
        q:{q:'Ein Topf der Breite $2a = 0{,}02\\,\\mathrm{nm}$ und der Tiefe $V_0 = 15\\,\\mathrm{eV}$ wird zum δ-Potential $V = -\\alpha\\,\\delta(x)$ zusammengezogen. Wie groß ist $\\alpha$?',
          opts:['$15\\,\\mathrm{eV}$', '$0{,}3\\,\\mathrm{eV\\,nm}$', '$0{,}15\\,\\mathrm{eV\\,nm}$', '$750\\,\\mathrm{eV/nm}$'], a:1,
          ex:'$\\alpha$ ist die Fläche $2aV_0 = 0{,}02\\,\\mathrm{nm}\\cdot 15\\,\\mathrm{eV} = 0{,}3\\,\\mathrm{eV\\,nm}$, also Energie mal Länge. Das passt zu $\\delta(x)$ mit der Einheit $1/\\text{Länge}$: Erst so ist $V$ eine Energie.',
          fb:['Das ist nur die Tiefe. $\\alpha$ ist die Fläche des Topfs und hat die Einheit Energie mal Länge.', '', 'Die Breite ist $2a = 0{,}02\\,\\mathrm{nm}$, nicht $a$. Mit $a$ allein käme die halbe Fläche heraus.', 'Geteilt statt multipliziert: $V_0/(2a)$ hat die Einheit Energie durch Länge, $\\alpha$ aber Energie mal Länge.']}},
      {id:'tunnel-t6b', title:'Die Sprungbedingung',
        num:{title:'Integrieren über die Spitze', text:R`Über $[-\varepsilon, \varepsilon]$ ist $\int\delta(x)\,\psi(x)\,dx = \psi(0)$, für jedes noch so kleine $\varepsilon$. Mit $2m\alpha/\hbar^2 = 26{,}2\cdot0{,}1\,\mathrm{nm}^{-1} \approx 2{,}6\,\mathrm{nm}^{-1}$ springt $\psi'$ bei $\psi(0) = 1$ also um $-2{,}6\,\mathrm{nm}^{-1}$.`},
        text:R`Integriere die Schrödingergleichung wie in Abschnitt 2 über $[-\varepsilon, \varepsilon]$. Jetzt verschwindet das Potentialintegral nicht, denn $\int\delta(x)\psi(x)\,dx = \psi(0)$ ([[lex:delta-distribution|δ-Distribution]], M2). Es bleibt die **Sprungbedingung**

$$\psi'(0^+) - \psi'(0^-) = -\frac{2m\alpha}{\hbar^2}\,\psi(0).$$

$\psi$ bleibt stetig, aber $\psi'$ springt: $\psi$ hat bei $x = 0$ einen Knick. Das Vorzeichen ist negativ, weil das Potential anzieht. Die Steigung wird beim Durchgang durch $x = 0$ kleiner; die Kurve knickt nach unten.`,
        q:{q:R`Was gilt bei $x = 0$ für $\psi$ im δ-Potential?`,
          opts:[R`$\psi$ springt, $\psi'$ ist stetig.`, R`$\psi$ ist stetig, $\psi'$ springt.`, R`beide sind stetig, wie an einer Stufe`], a:1,
          ex:R`Das Integral über die Spitze liefert $\psi(0)$ und damit einen endlichen Sprung von $\psi'$. Ein Sprung von $\psi$ selbst würde ein unendliches $\psi'$ verlangen.`,
          fb:[R`Umgekehrt. Ein Sprung von $\psi$ hieße, dass $\psi'$ unendlich wird; das passt zu keiner Gleichung mit $\delta$.`, '',
            R`An der Stufe ist $V$ endlich. Hier ist $V$ bei $x = 0$ unendlich, und das Integral bleibt endlich.`]}},
      {id:'tunnel-t6c', title:'Der gebundene Zustand',
        num:{title:'α = 0,1 eV nm', text:R`$\kappa = m\alpha/\hbar^2 = \tfrac12\cdot26{,}2\cdot0{,}1\,\mathrm{nm}^{-1} \approx 1{,}31\,\mathrm{nm}^{-1}$, also $1/\kappa \approx 0{,}76\,\mathrm{nm}$. Die Energie ist

$$E = -\frac{\hbar^2\kappa^2}{2m} = -\frac{1{,}31^2}{26{,}2}\,\mathrm{eV} \approx -0{,}066\,\mathrm{eV}.$$`},
        text:R`Für $E < 0$ ist überall außer bei $x = 0$ verbotenes Gebiet. Normierbar sind nur $e^{\kappa x}$ links und $e^{-\kappa x}$ rechts, mit $\kappa = \sqrt{-2mE}/\hbar$. Stetigkeit verlangt gleiche Amplituden: $\psi = Ae^{-\kappa|x|}$. Die Sprungbedingung legt $\kappa$ fest (Herleitung):

$$\kappa = \frac{m\alpha}{\hbar^2},\qquad E = -\frac{\hbar^2\kappa^2}{2m} = -\frac{m\alpha^2}{2\hbar^2}.$$

Es gibt **genau einen** gebundenen Zustand. Ein ungerader Zustand hätte $\psi(0) = 0$; mit $\pm Ae^{-\kappa|x|}$ geht das nur für $A = 0$. Die Normierung legt am Ende noch $A = \sqrt\kappa$ fest; sie ändert die Energie nicht.`,
        derive:{ctx:TUN_DELTA(), lines:[
          {l:'-κ A - κ A = -2m α/ħ^2 A', w:'ψ′(0⁺) − ψ′(0⁻) = −(2mα/ħ²) ψ(0)',
            why:{q:'Warum ist $\\psi\'(0^-) = +\\kappa A$?', opts:['Weil links $\\psi = Ae^{\\kappa x}$ ist, abgeleitet $\\kappa Ae^{\\kappa x}$.', 'Weil $\\psi\'$ bei $x = 0$ stetig sein muss.', 'Weil $|x|$ bei $x = 0$ die Ableitung $1$ hat.'], a:0, ex:'Für $x < 0$ ist $|x| = -x$, also $\\psi = Ae^{\\kappa x}$. Rechts fällt $\\psi$ ab: $\\psi\'(0^+) = -\\kappa A$.'}},
          {l:'κ = m α/ħ^2', w:'durch −2A geteilt'},
          {l:'E = -ħ^2 κ^2/(2m)', w:'für x ≠ 0 frei: ψ″ = κ²ψ',
            why:{q:'Woher kommt diese Beziehung?', opts:['Für $x \\ne 0$ ist $-\\frac{\\hbar^2}{2m}\\psi\'\' = E\\psi$ mit $\\psi\'\' = \\kappa^2\\psi$.', 'aus der Normierung $\\int|\\psi|^2dx = 1$', 'aus $E = \\langle V\\rangle = -\\alpha|\\psi(0)|^2$'], a:0, ex:'Außerhalb von $x = 0$ ist $V = 0$. Die Normierung legt nur $A$ fest, nicht $E$.'}},
          {l:'E = -m α^2/(2ħ^2)', w:'κ eingesetzt'}
        ]},
        q:{q:R`Das δ-Potential wird doppelt so stark ($\alpha \to 2\alpha$). Wie ändert sich die Bindungsenergie $|E|$?`,
          opts:[R`Sie verdoppelt sich.`, R`Sie vervierfacht sich.`, R`Sie halbiert sich, weil der Zustand schmaler wird.`], a:1,
          ex:R`$|E| = m\alpha^2/(2\hbar^2)$ wächst mit $\alpha^2$. Gleichzeitig verdoppelt sich $\kappa$: Der Zustand wird halb so breit.`,
          fb:[R`$\kappa$ verdoppelt sich, aber $E$ hängt von $\kappa^2$ ab.`, '',
            R`Schmaler wird der Zustand tatsächlich, aber gebunden ist er dadurch stärker, nicht schwächer.`]}},
      {id:'tunnel-t6d', title:'Der gebundene Zustand in Formel und Bild',
        num:{title:'Ablesen am Bild', text:R`Im Bild fällt $\psi$ von der Spitze bei $x = 0$ auf $1/e$ des Maximums bei $x = \pm1/\kappa$. Für $\alpha = 0{,}1\,\mathrm{eV\,nm}$ liegen diese Stellen bei $\pm0{,}76\,\mathrm{nm}$. Die Steigung springt von $+\kappa\psi(0)$ auf $-\kappa\psi(0)$, insgesamt um $2\kappa\psi(0)$.`},
        text:R`Die Tafel zeigt den gebundenen Zustand in fünf Darstellungen. Lies besonders die Spitze im Bild. Ihr Knick ist die Sprungbedingung: Links steigt $\psi$ mit $+\kappa\psi(0)$, rechts fällt es mit $-\kappa\psi(0)$. Die Größe des Knicks legt $\kappa$ fest und damit auch, wie schnell $\psi$ nach außen abklingt. Ein stärkeres Potential gibt einen schärferen Knick, ein schmaleres $\psi$ und eine tiefere Energie. Die Mathematik dahinter ist die Wirkung von $\delta$ unter dem Integral.`,
        reps:{obj:R`Gebundener Zustand im Potential $V = -\alpha\,\delta(x)$`,
          rows:[
            {k:'worte', text:R`Ein Teilchen, das an einem Punkt festgehalten wird. Es ist um diesen Punkt verteilt und fällt nach beiden Seiten exponentiell ab.`},
            {k:'formel', tex:R`\psi(x) = \sqrt\kappa\,e^{-\kappa|x|},\qquad \kappa = \frac{m\alpha}{\hbar^2},\qquad E = -\frac{m\alpha^2}{2\hbar^2}`},
            {k:'graph', plot:{x:[-3, 3], y:[-0.1, 1.15], xlab:R`\kappa x`, ylab:R`\psi/\psi(0)`, ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}]}, f:TUN_G.delta,
              cap:R`Knick bei $x = 0$: Steigung $+1$ links, $-1$ rechts (in Einheiten von $\kappa\psi(0)$). Bei $\kappa x = \pm1$ ist $\psi$ auf $1/e \approx 0{,}37$ gefallen.`},
            {k:'mathe', tex:R`\int_{-\varepsilon}^{\varepsilon}\psi''\,dx = \psi'(\varepsilon) - \psi'(-\varepsilon),\qquad \int_{-\varepsilon}^{\varepsilon}\delta(x)\,\psi(x)\,dx = \psi(0)`},
            {k:'physik', text:R`Bindungsenergie $|E| = m\alpha^2/(2\hbar^2)$, für $\alpha = 0{,}1\,\mathrm{eV\,nm}$ etwa $0{,}066\,\mathrm{eV}$. Die Ausdehnung des Zustands ist etwa $1/\kappa \approx 0{,}76\,\mathrm{nm}$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Exponentiell nach beiden Seiten“ heißt $e^{-\kappa|x|}$. „An einem Punkt festgehalten“ legt $\kappa$ über die Stärke $\alpha$ fest.`},
            {from:'formel', to:'graph', rule:R`$e^{-\kappa|x|}$ über $\kappa x$ zeichnen: Spitze bei $0$, auf $1/e$ bei $\pm1$. Die Steigungen links und rechts der Spitze sind $\pm\kappa\psi(0)$.`},
            {from:'graph', to:'mathe', rule:R`Den Knick als Sprung von $\psi'$ lesen. Die Gleichung über die Spitze integrieren: $\delta$ liefert genau $\psi(0)$, also den Sprung $-2m\alpha\psi(0)/\hbar^2$.`},
            {from:'mathe', to:'physik', rule:R`Den Sprung $-2\kappa\psi(0)$ gleich $-2m\alpha\psi(0)/\hbar^2$ setzen: $\kappa = m\alpha/\hbar^2$. Dann $E = -\hbar^2\kappa^2/(2m)$ ausrechnen.`}
          ]},
        q:{q:R`Im Bild eines solchen Zustands ist $\psi$ bei $x = \pm0{,}5\,\mathrm{nm}$ auf $1/e$ der Spitze gefallen. Welches $\kappa$ gehört dazu?`, tr:{from:'graph', to:'formel'},
          opts:[R`$\kappa = 0{,}5\,\mathrm{nm}^{-1}$`, R`$\kappa = 2\,\mathrm{nm}^{-1}$`, R`$\kappa = 1\,\mathrm{nm}^{-1}$, weil der Abstand der beiden Stellen $1\,\mathrm{nm}$ ist`], a:1,
          ex:R`$e^{-\kappa\cdot0{,}5\,\mathrm{nm}} = e^{-1}$ gibt $\kappa = 1/(0{,}5\,\mathrm{nm}) = 2\,\mathrm{nm}^{-1}$.`,
          fb:[R`$0{,}5\,\mathrm{nm}$ ist $1/\kappa$, nicht $\kappa$.`, '',
            R`Jede Seite fällt für sich auf $1/e$, im Abstand $1/\kappa$ von der Spitze.`]}},
      {id:'tunnel-t6e', title:'Streuung am δ-Potential',
        num:{title:'Schnell und langsam', text:R`Mit $\alpha = 0{,}1\,\mathrm{eV\,nm}$ ist $m\alpha^2/(2\hbar^2) \approx 0{,}066\,\mathrm{eV}$. Ein Elektron mit $E = 0{,}66\,\mathrm{eV}$ hat $T \approx 0{,}91$, eines mit $E = 0{,}0066\,\mathrm{eV}$ nur $T \approx 0{,}09$.`},
        text:R`Für $E > 0$ setzt du an wie an der Stufe: $\psi_L = e^{ikx} + Be^{-ikx}$, $\psi_R = Ce^{ikx}$. Mit $\beta = m\alpha/(\hbar^2k)$ folgt aus Stetigkeit und Sprungbedingung $C = 1/(1 - i\beta)$ und

$$T = |C|^2 = \frac{1}{1 + \beta^2} = \left(1 + \frac{m\alpha^2}{2\hbar^2E}\right)^{-1}.$$

Schnelle Teilchen ($\beta$ klein) gehen fast ungestört durch. Langsame werden fast vollständig reflektiert – obwohl das Potential anziehend ist. Reflexion ist eine Welleneigenschaft. Sie entsteht an jeder plötzlichen Änderung des Potentials, egal in welche Richtung.`,
        q:{q:R`Wie verändert sich $T$ für die Streuung am δ-Potential, wenn die Energie wächst?`,
          opts:[R`$T$ fällt, weil das Potential anzieht.`, R`$T$ ist für alle Energien gleich 1.`, R`$T$ wächst und geht gegen 1.`], a:2,
          ex:R`$T = (1 + m\alpha^2/(2\hbar^2E))^{-1} \to 1$ für $E \to \infty$.`,
          fb:[R`Anziehung verhindert Reflexion nicht. Im Gegenteil: Langsame Teilchen werden fast vollständig reflektiert.`,
            R`Das wäre klassisch so. Quantenmechanisch ist $T < 1$ für jedes endliche $E$.`, '']}},
      {id:'tunnel-t6f', title:'Typischer Fehler: ψ′ auch hier stetig ansetzen',
        num:{title:'Was dann herauskäme', text:R`Mit stetigem $\psi'$ wäre $\psi'(0^+) - \psi'(0^-) = -\kappa A - \kappa A = -2\kappa A = 0$, also $\kappa = 0$ und $E = 0$. Dann wäre $\psi = A$ überall konstant und nicht normierbar: kein gebundener Zustand.`},
        text:R`**Typischer Fehler:** $\psi'$ auch am δ-Potential als stetig ansetzen. Dann folgt $\kappa = 0$, und es gäbe keinen gebundenen Zustand. Die Regel „$\psi$ und $\psi'$ stetig“ aus Abschnitt 2 setzt ein *endliches* Potential voraus. Beim δ-Potential ist $V$ bei $x = 0$ unendlich, und das Integral über die Spitze bleibt endlich. Prüfe deshalb vor jeder Rechnung: Ist $V$ an der Sprungstelle endlich, unendlich hoch wie eine Wand oder eine δ-Spitze? Jede der drei Situationen hat ihre eigene Anschlussregel.`,
        q:{q:R`Welche Form hat $\psi$ des gebundenen Zustands bei $x = 0$?`,
          opts:[R`glatt, mit waagerechter Tangente`, R`stetig, mit einem Knick (Spitze)`, R`unstetig, mit einem Sprung`], a:1,
          ex:R`$\psi$ ist stetig, $\psi'$ springt von $+\kappa A$ auf $-\kappa A$.`,
          fb:[R`Eine glatte Kuppe hätte stetiges $\psi'$. Dann gäbe es keinen gebundenen Zustand.`, '',
            R`$\psi$ bleibt stetig; gesprungen ist nur die Ableitung.`]}}
    ]},

    /* ===== Abschnitt 7: Anwendungen ===== */
    {id:'tunnel-t7', title:'Anwendungen: Rastertunnelmikroskop und α-Zerfall', steps:[
      {id:'tunnel-t7a', title:'Rastertunnelmikroskop: das Prinzip',
        num:{title:'Spitze vor Oberfläche', text:R`Mit $V_0 - E \approx 4\,\mathrm{eV}$ ist $\kappa = \sqrt{26{,}2\cdot4}\,\mathrm{nm}^{-1} \approx 10\,\mathrm{nm}^{-1}$. Bei einem Abstand von $d = 0{,}5\,\mathrm{nm}$ ist $e^{-2\kappa d} \approx e^{-10} \approx 4{,}5\cdot10^{-5}$.`},
        text:R`Eine feine Metallspitze wird bis auf etwa $0{,}5$ bis $1\,\mathrm{nm}$ an eine leitende Oberfläche herangeführt. Das Vakuum dazwischen ist für die Elektronen eine Barriere. Ihre Höhe über der Energie der Elektronen ist ungefähr die Austrittsarbeit, einige eV. Legt man eine kleine Spannung an, fließt ein Tunnelstrom proportional zu $e^{-2\kappa d}$, wobei $d$ der Abstand ist. Gerd Binnig und Heinrich Rohrer erhielten für das [[lex:rastertunnelmikroskop|Rastertunnelmikroskop]] 1986 den Nobelpreis.`,
        q:{q:R`Was spielt im Rastertunnelmikroskop die Rolle der Barriere?`,
          opts:[R`die Metallspitze selbst`, R`das Vakuum zwischen Spitze und Probe`, R`die Spannung zwischen Spitze und Probe`], a:1,
          ex:R`Im Vakuum ist die potentielle Energie der Elektronen um etwa die Austrittsarbeit höher als im Metall. Diese Lücke durchtunneln sie.`,
          fb:[R`In der Spitze sind die Elektronen frei beweglich. Verboten ist der Spalt davor.`, '',
            R`Die Spannung treibt den Strom an. Die Barriere ist der Spalt, durch den er fließen muss.`]}},
      {id:'tunnel-t7b', title:'Warum nur die Abstandsänderung zählt',
        num:{title:'0,1 nm mehr Abstand', text:R`Mit $\kappa \approx 10\,\mathrm{nm}^{-1}$ und $b = 0{,}1\,\mathrm{nm}$ fällt der Strom um den Faktor

$$e^{-2\kappa b} = e^{-2} \approx 0{,}14,$$

also auf etwa ein Siebtel – egal, ob die Spitze vorher $0{,}5$ oder $0{,}8\,\mathrm{nm}$ entfernt war.`},
        text:R`Diese Empfindlichkeit macht atomare Auflösung möglich. Die Herleitung zeigt: Ändert sich der Abstand um $b$, ändert sich der Strom um den Faktor $e^{-2\kappa b}$, unabhängig vom Ausgangsabstand. Man fährt die Spitze über die Probe und regelt ihre Höhe so, dass der Strom konstant bleibt. Die Regelung zeichnet dann ein Höhenprofil, fein genug, um einzelne Atome zu sehen. Fast der ganze Strom fließt über das vorderste Atom der Spitze, weil schon das nächste Atom merklich weiter entfernt ist.`,
        derive:{ctx:{coords:[], params:{κ:'pos', d:'pos', b:'pos'}}, lines:[
          {l:'e^(-2κ (d + b))/e^(-2κ d) = e^(-2κ b)', w:'Abstand wächst von d auf d + b',
            why:{q:'Warum fällt der Ausgangsabstand $d$ heraus?', opts:['Weil das Verhältnis zweier Exponentialfunktionen nur von $b$ abhängt.', 'Weil $d$ gegen die Verschiebung $b$ vernachlässigbar klein ist.', 'Weil der Vorfaktor von $T$ den Abstand $d$ schon enthält.'], a:0, ex:'$e^{u + v}/e^u = e^v$. Deshalb ändert jede Verschiebung um $b$ den Strom um denselben Faktor $e^{-2\\kappa b}$.'}}
        ]},
        q:{q:R`Die Spitze eines Rastertunnelmikroskops fährt über ein Atom, das $0{,}1\,\mathrm{nm}$ höher liegt ($\kappa \approx 10\,\mathrm{nm}^{-1}$). Wie ändert sich der Strom ohne Regelung?`,
          opts:[R`Er steigt um etwa 10 % an.`, R`Er steigt auf etwa das 7-Fache.`, R`Er bleibt nahezu gleich groß.`], a:1,
          ex:R`Der Abstand wird um $0{,}1\,\mathrm{nm}$ kleiner: Faktor $e^{2\kappa\cdot0{,}1\,\mathrm{nm}} = e^2 \approx 7{,}4$.`,
          fb:[R`Das wäre eine lineare Abhängigkeit. Der Abstand steht aber im Exponenten.`, '',
            R`Gerade die starke Änderung macht das Mikroskop so empfindlich.`]}},
      {id:'tunnel-t7c', title:'α-Zerfall: Tunneln aus dem Kern',
        num:{title:'Zwei Kerne', text:R`Polonium-212 sendet α-Teilchen mit $E_\alpha \approx 8{,}8\,\mathrm{MeV}$ aus und zerfällt in weniger als einer Mikrosekunde. Uran-238 mit $E_\alpha \approx 4{,}3\,\mathrm{MeV}$ hat eine Halbwertszeit von $4{,}5$ Milliarden Jahren. Ein Faktor 2 in der Energie macht über 20 Zehnerpotenzen in der Zeit.`},
        text:R`Ein α-Teilchen ist im Kern durch die starke Kraft gebunden; außerhalb stößt die Coulomb-Kraft es ab. Zusammen entsteht eine Barriere, die viel höher ist als die Energie, mit der das α-Teilchen später davonfliegt. Klassisch käme es nie heraus. George Gamow und unabhängig Ronald Gurney und Edward Condon erklärten 1928 den Zerfall als Tunneln durch diese Barriere. Die Barriere ist nicht rechteckig; man ersetzt $e^{-2\kappa a}$ durch

$$T \approx \exp\left(-\frac{2}{\hbar}\int_{x_1}^{x_2}\sqrt{2m\,(V(x) - E)}\,dx\right),$$

ein Integral über den klassisch verbotenen Bereich. Diese WKB-Näherung gilt, wenn sich $V$ langsam ändert. Mehr dazu unter [[lex:alpha-zerfall|α-Zerfall]].`,
        q:{q:R`Wie wird aus $e^{-2\kappa a}$ der Ausdruck für eine Barriere beliebiger Form?`,
          opts:[R`$\kappa$ wird durch seinen Wert am höchsten Punkt ersetzt.`, R`$\kappa a$ wird zu $\int\kappa(x)\,dx$ über den verbotenen Bereich.`, R`$a$ wird durch den Kernradius ersetzt.`], a:1,
          ex:R`Mit $\kappa(x) = \sqrt{2m(V(x) - E)}/\hbar$ wird aus $2\kappa a$ das Integral $2\int\kappa(x)\,dx$. Bei konstantem $V$ kommt wieder $2\kappa a$ heraus.`,
          fb:[R`Das überschätzt die Barriere. Jedes Stück des verbotenen Bereichs trägt mit seinem eigenen $\kappa$ bei.`, '',
            R`Die Breite der Barriere ist der Abstand der Umkehrpunkte $x_1$ und $x_2$, nicht der Kernradius.`]}},
      {id:'tunnel-t7d', title:'Exponentielle Empfindlichkeit',
        num:{title:'Höhe im Exponenten', text:R`Bei der Rechteckbarriere aus Abschnitt 4 ($V_0 - E = 1\,\mathrm{eV}$, $a = 1\,\mathrm{nm}$) ist $2\kappa a \approx 10{,}2$. Verdoppelt sich $V_0 - E$, wächst $\kappa$ um den Faktor $\sqrt2$, und $e^{-2\kappa a}$ fällt von $3{,}5\cdot10^{-5}$ auf $e^{-14{,}5} \approx 5\cdot10^{-7}$.`},
        text:R`Steht eine Größe wie $\kappa a$ im Exponenten, reagiert das Ergebnis exponentiell empfindlich auf Breite, Höhe und Masse. Beim Rastertunnelmikroskop ist es die Breite: Ein Zehntel Nanometer macht einen Faktor sieben. Beim α-Zerfall ist es die Energie: Ein Faktor zwei macht über zwanzig Zehnerpotenzen. Beim Vergleich von Elektron und Proton ist es die Masse. Die Anlaufrate an die Barriere hängt dagegen nur linear von solchen Größen ab. Für die Größenordnung spielt sie deshalb kaum eine Rolle.`,
        q:{q:R`Was ist der Hauptgrund dafür, dass die α-Halbwertszeiten so stark von der Energie abhängen?`,
          opts:[R`Schnellere α-Teilchen stoßen öfter an die Barriere.`, R`$E$ steht im Exponenten der Tunnelwahrscheinlichkeit.`, R`Höhere Energie $E$ verringert die Ladung des Kerns.`], a:1,
          ex:R`Die Anlaufrate an die Barriere wächst zwar auch mit der Geschwindigkeit, aber nur proportional. Der Exponentialfaktor ändert sich um viele Zehnerpotenzen.`,
          fb:[R`Das gibt nur einen Faktor von der Größenordnung $\sqrt2$, keine zwanzig Zehnerpotenzen.`, '',
            R`Die Kernladung hängt nicht von der Energie des α-Teilchens ab.`]}}
    ]}
  ],
  example:{
    title:'Stufe mit $E > V_0$: Amplitude der reflektierten Welle',
    text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0$, und $E > V_0$. Links läuft eine Welle ein und wird teilweise reflektiert: $\\psi_L = e^{ikx} + B\\,e^{-ikx}$. Rechts läuft nur eine Welle nach rechts: $\\psi_R = C\\,e^{iqx}$. Dabei ist $k = \\sqrt{2mE}/\\hbar$ und $q = \\sqrt{2m(E - V_0)}/\\hbar$. Bestimme $B$.',
    ctx:TUN_UP(),
    lines:[
      {l:'ψ_L(0) = ψ_R(0)', why:{q:'Warum muss $\\psi$ bei $x = 0$ stetig sein?', opts:['Ein Sprung in $\\psi$ machte $\\psi\'$ unendlich; das erlaubt die Gleichung bei endlichem $V$ nicht.', 'Weil $\\psi$ an jeder Potentialstufe null sein muss, wie an einer Wand.', 'Weil links und rechts dasselbe $E$ gilt, also dieselbe Funktion.'], a:0, ex:'Bei endlichem Potentialsprung sind $\\psi$ und $\\psi\'$ stetig. Nur bei unendlich hohen Wänden oder $\\delta$-Potentialen ändert sich das.'}},
      {l:'1 + B = C', why:{q:'Was wurde eingesetzt?', opts:['$x = 0$, also $e^0 = 1$ in allen Termen', '$k = q$, weil die Energie gleich ist', 'die Normierung $\\int|\\psi|^2dx = 1$'], a:0, ex:'Bei $x = 0$ werden alle Exponentialfunktionen zu 1.'}},
      {l:'ik (1 - B) = iq C', w:'ψ\' stetig', why:{q:'Woher kommt das Minuszeichen vor $B$?', opts:['Die Ableitung von $e^{-ikx}$ bringt $-ik$.', 'Die reflektierte Welle hat negative Energie.', 'Das ist eine Konvention für reflektierte Wellen.'], a:0, ex:'$\\psi_L\' = ik\\,e^{ikx} - ikB\\,e^{-ikx}$, bei $x = 0$ also $ik(1 - B)$.'}},
      {l:'k (1 - B) = q (1 + B)', why:{q:'Wie entsteht diese Zeile?', opts:['$C = 1 + B$ einsetzen und durch $i$ teilen', 'beide Gleichungen addieren', 'beide Gleichungen quadrieren'], a:0, ex:'Zwei Gleichungen, zwei Unbekannte: $C$ eliminieren.'}},
      {l:'B = (k - q)/(k + q)', why:{q:'Was bedeutet $B \\ne 0$?', opts:['Auch bei $E > V_0$ wird ein Teil reflektiert – klassisch unmöglich.', 'Das Teilchen wird an der Stufe vollständig reflektiert.', 'Ein Teil der Teilchen verliert an der Stufe Energie.'], a:0, ex:'Die Reflexionswahrscheinlichkeit ist $|B|^2 = \\left(\\frac{k-q}{k+q}\\right)^2 > 0$. Sie verschwindet nur für $q = k$, also $V_0 = 0$.'}}
    ],
    faded:{id:'tunnel-fade', title:'Jetzt du: die durchgelassene Amplitude $C$', text:'Gleiche Stufe wie im Beispiel. Bestimme $C$.',
      ctx:TUN_UP(),
      given:['1 + B = C', 'ik (1 - B) = iq C'],
      goals:[{id:'a', prompt:'Bestimme $C$.', type:'solve', unknown:'C',
        hints:['Gesucht ist $C$; dafür muss $B$ aus den beiden Gleichungen verschwinden.', 'Aus der ersten Gleichung folgt $B = C - 1$.', 'Setze ein: $k(2 - C) = qC$.'],
        model:['1 + B = C', 'ik (1 - B) = iq C', {l:'k (2 - C) = q C', gap:'k (▢) = q C'}, '2k = (k + q) C', 'C = 2k/(k + q)']}]}
  },
  puzzle:{
    title:'Ein sehr tiefer Abgrund',
    text:'Ein langsames Teilchen läuft von links auf eine scharfe Stufe **nach unten**: Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = -V_0$. Die Stufe ist sehr tief, $V_0 \\gg E$. Klassisch fällt das Teilchen hinunter und wird schneller.\n\nWie groß ist die Reflexionswahrscheinlichkeit $R$? Benutze das Ergebnis für die Stufe nach oben, mit $q = \\sqrt{2m(E + V_0)}/\\hbar$.',
    q:{q:'Deine Vermutung:', opts:['$R \\to 0$: Ein Abgrund hält nichts auf.', '$R \\to 1$: Fast alles wird reflektiert.', '$R \\approx 1/2$: Die Hälfte kehrt um.', '$R$ hängt nicht von $V_0$ ab.'], a:1, ex:'$R = \\left(\\frac{q - k}{q + k}\\right)^2 \\to 1$ für $q \\gg k$.'},
    reveal:'Die Anschlussrechnung ist dieselbe wie bei der Stufe nach oben und liefert $B = \\frac{k - q}{k + q}$. Für $V_0 \\gg E$ ist $q \\gg k$, also\n\n$$R = \\left(\\frac{q - k}{q + k}\\right)^2 \\approx 1 - 4\\frac kq \\approx 1 - 4\\sqrt{\\frac{E}{V_0}} \\;\\to\\; 1.$$\n\nZahlenbeispiel: Für $E = 1\\,\\mathrm{meV}$ und $V_0 = 1\\,\\mathrm{eV}$ ist $R \\approx 0{,}88$. Fast alle Teilchen kehren an der Kante um, obwohl es dahinter nur „bergab“ geht.\n\nWarum? Reflexion entsteht dort, wo sich die Wellenzahl sprunghaft ändert, und die Richtung des Sprungs spielt keine Rolle: $R$ ist symmetrisch in $k$ und $q$. Ein sehr großer Sprung reflektiert fast vollständig, wie Licht an einem Übergang zwischen sehr verschiedenen Brechzahlen.\n\nZwei Einschränkungen: Die Rechnung setzt eine **scharfe** Stufe voraus, die sich auf einer Strecke viel kürzer als die Wellenlänge ändert. Bei einem sanften Abhang ist die Reflexion viel kleiner. Und je langsamer das Teilchen, desto stärker der Effekt. Man spricht von Quantenreflexion; beobachtet wurde sie mit sehr langsamen Atomen vor Oberflächen.'
  },
  clarify:{
    core:'Bei stückweise konstantem Potential löst man die stationäre Schrödingergleichung in jedem Bereich. Wo $E > V$, gibt es Wellen $e^{\\pm ikx}$ mit $k = \\sqrt{2m(E-V)}/\\hbar$. Wo $E < V$, gibt es $e^{\\pm\\kappa x}$ mit $\\kappa = \\sqrt{2m(V - E)}/\\hbar$.\n\nAn den Sprungstellen sind **$\\psi$ und $\\psi\'$ stetig**. Reflexion und Transmission gibt man über Stromdichten an:\n\n$$R = \\frac{|j_{ref}|}{j_{ein}},\\qquad T = \\frac{j_{trans}}{j_{ein}},\\qquad R + T = 1.$$\n\nFür eine Welle $Ae^{ikx}$ ist $j = \\frac{\\hbar k}{m}|A|^2$; deshalb steht in $T$ der Faktor $q/k$. Die Energie ist in allen Bereichen dieselbe: Wer durch eine Barriere tunnelt, verliert keine Energie.',
    keys:[
      'Im verbotenen Bereich wird nur die abklingende Lösung $e^{-\\kappa x}$ behalten; $e^{+\\kappa x}$ wäre nicht normierbar.',
      'Die Eindringtiefe ist $1/\\kappa$ (für $\\psi$) bzw. $1/(2\\kappa)$ (für $|\\psi|^2$).',
      'Rechteckbarriere der Breite $a$ mit $E < V_0$: $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1}$; für $\\kappa a \\gg 1$ ist $T \\approx 16\\frac{E}{V_0}\\left(1 - \\frac{E}{V_0}\\right)e^{-2\\kappa a}$.',
      '$\\delta$-Potential $V = -\\alpha\\,\\delta(x)$: $\\psi$ stetig, aber $\\psi\'$ springt: $\\psi\'(0^+) - \\psi\'(0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$. Es gibt genau einen gebundenen Zustand mit $E = -\\frac{m\\alpha^2}{2\\hbar^2}$.',
      'Im endlichen Topf gibt es immer mindestens einen gebundenen Zustand; die Energien liegen tiefer als im unendlichen Topf gleicher Breite, weil die Wellenfunktion in die Wände eindringt.'
    ],
    errors:[
      '$T = |C|^2$ statt $T = \\frac qk|C|^2$: Die Wahrscheinlichkeitsströme hängen von der Geschwindigkeit ab.',
      'Vorzeichen beim Ableiten der reflektierten Welle $Be^{-ikx}$ vergessen.',
      'Im verbotenen Bereich $e^{+\\kappa x}$ mitnehmen, obwohl der Bereich bis $x\\to\\infty$ reicht.',
      'Beim $\\delta$-Potential $\\psi\'$ als stetig ansetzen – dann gäbe es keinen gebundenen Zustand.',
      '„Das Teilchen ist nie in der Barriere“: Die Aufenthaltswahrscheinlichkeit dort ist klein, aber nicht null.',
      '„Beim Tunneln geht Energie verloren“: Hinter der Barriere sind Wellenlänge und Energie dieselben; kleiner ist nur die Amplitude.'
    ],
    more:[{title:'Woher kommt die Sprungbedingung beim δ-Potential?', text:'Integriere $-\\frac{\\hbar^2}{2m}\\psi\'\' - \\alpha\\delta(x)\\psi = E\\psi$ von $-\\varepsilon$ bis $\\varepsilon$ und lass $\\varepsilon\\to 0$ gehen. Die rechte Seite verschwindet, links bleibt $-\\frac{\\hbar^2}{2m}[\\psi\'(\\varepsilon) - \\psi\'(-\\varepsilon)] - \\alpha\\psi(0) = 0$.'}],
    checks:[
      {q:'An einer Stufe mit $E > V_0$ ist $B = 0{,}2$ und $C = 1{,}2$. Ist $|B|^2 + |C|^2 = 1$ zu erwarten?', opts:['Nein. Erhalten ist $|B|^2 + \\frac qk|C|^2 = 1$.', 'Ja, Wahrscheinlichkeiten addieren sich immer zu 1.', 'Nur wenn $V_0 = 0$.'], a:0, ex:'$C$ ist eine Amplitude, und $|C|^2$ ist das Verhältnis der Dichten von durchgelassener und einlaufender Welle – keine Wahrscheinlichkeit. Erhalten ist der Wahrscheinlichkeitsstrom.'},
      {q:'Eine Barriere wird bei gleicher Energie doppelt so breit ($\\kappa a \\gg 1$). Wie ändert sich $T$ ungefähr?', opts:['um den Faktor $e^{-2\\kappa a}$ kleiner', 'etwa um den Faktor $1/2$ kleiner', 'etwa um den Faktor $1/4$ kleiner'], a:0, ex:'$T \\propto e^{-2\\kappa a}$. Aus $a$ wird $2a$, also kommt noch einmal $e^{-2\\kappa a}$ dazu – exponentiell, nicht linear.'}
    ]
  },
  lab:{type:'barrier', sketch:SK.lab, title:'Transmission durch eine Rechteckbarriere',
    map:[
      {sym:R`E/V_0`, ctl:'Energie E/V₀', says:R`Die Energie in $k = \sqrt{2mE}/\hbar$ und $\kappa = \sqrt{2m(V_0 - E)}/\hbar$; in Laboreinheiten $k = \sqrt{E/V_0}$, $\kappa = \sqrt{1 - E/V_0}$. Im Bild die gestrichelte Linie, unten der Punkt auf $T(E)$. Unter $1$ tunnelt das Teilchen, über $1$ läuft es über die Barriere.`},
      {sym:R`a`, ctl:'Breite a·√(2mV₀)/ħ', says:R`Die Breite der Barriere in der Längeneinheit $\hbar/\sqrt{2mV_0}$. Sie steht im Exponenten: Für $\kappa a \gg 1$ ist $T \approx 16\frac{E}{V_0}\left(1 - \frac{E}{V_0}\right)e^{-2\kappa a}$.`},
      {sym:R`V(x)`, ctl:'V(x)', says:R`Der getönte Streifen ist die Barriere: $V = V_0$ für $0 < x < a$, sonst $V = 0$.`},
      {sym:R`\mathrm{Re}\,\psi,\ |\psi|^2`, ctl:'Wellenfunktion', says:R`Wählt die Kurven: dünn $\mathrm{Re}\,\psi$, dick $|\psi|^2$, beide auf der Energielinie aufgetragen. Links $e^{ikx} + re^{-ikx}$, innen $Ce^{-\kappa x} + De^{\kappa x}$, rechts $te^{ikx}$. Im Text heißen $r$ und $t$ dagegen $B$ und $F$.`},
      {sym:R`T = |t|^2,\ R = |r|^2`, ctl:'Transmission T', says:R`Die untere Kurve zeigt $T(E)$ für die eingestellte Breite. Die Anzeige nennt $T$ und $R$; stets ist $R + T = 1$. Über $V_0$ erreicht $T$ bei $qa = n\pi$ den Wert $1$.`},
      {sym:R`\lambda = 2\pi/k`, ctl:'Wellenlänge links und rechts gleich', says:R`Gleiche Energie und gleiches $V = 0$ links und rechts heißt gleiches $k$ und gleiche Wellenlänge. Rechts ist nur die Amplitude $|t| = \sqrt T$ kleiner: kein Energieverlust beim Tunneln.`},
      {sym:R`e^{-iEt/\hbar}`, ctl:'Zeit laufen lassen', says:R`Dreht die Phase des stationären Zustands mit $e^{-iEt/\hbar}$. $\mathrm{Re}\,\psi$ ändert sich dabei, $|\psi|^2$ nicht – der Zustand ist stationär.`}
    ],
    text:'Oben siehst du $V(x)$, die Energie $E$ (gestrichelt) und die Wellenfunktion, auf der Energielinie aufgetragen (dünn: $\\mathrm{Re}\\,\\psi$, dick: $|\\psi|^2$). Unten zeigt die Kurve die Transmission $T$ als Funktion von $E/V_0$; der Punkt ist die gewählte Energie. Unterhalb von $E = V_0$ tunnelt das Teilchen, oberhalb läuft es „über“ die Barriere. Mit „Zeit laufen lassen“ siehst du, wie sich die Phase von $\\psi$ dreht.',
    predict:{q:'Bevor du die Regler bewegst: Wie verläuft $T(E)$ in der Nähe von $E = V_0$?', opts:['stetig: schon unter $V_0$ ist $T > 0$, über $V_0$ noch $T < 1$', 'mit einem Sprung von $T = 0$ auf $T = 1$ genau bei $E = V_0$', 'mit einem scharfen Maximum $T = 1$ genau bei $E = V_0$'], a:0,
      ex:'Klassisch gäbe es den Sprung. Quantenmechanisch tunnelt das Teilchen unterhalb von $V_0$ und wird oberhalb teilweise reflektiert; $T$ steigt stetig an.'},
    questions:[
      {q:'Stelle $E/V_0 = 0{,}5$ ein und vergrößere die Breite. Was passiert mit $T$?', opts:['$T$ fällt sehr schnell, etwa exponentiell.', '$T$ fällt linear mit der Breite.', '$T$ bleibt gleich.'], a:0, ex:'Für breite Barrieren gilt $T \\propto e^{-2\\kappa a}$. Deshalb ist Tunneln für Elektronen nur bei sehr dünnen Barrieren merklich: Bei $V_0 - E = 1\\,\\mathrm{eV}$ ist $e^{-2\\kappa a}$ für $a = 1\\,\\mathrm{nm}$ schon etwa $4\\cdot 10^{-5}$.'},
      {q:'Stelle $E/V_0 = 0{,}5$ und eine Breite um $2$ ein. Vergleiche $\\mathrm{Re}\\,\\psi$ links und rechts der Barriere. Was fällt auf?', opts:['gleiche Wellenlänge, rechts kleinere Amplitude', 'rechts längere Wellenlänge, gleiche Amplitude', 'rechts längere Wellenlänge und kleinere Amplitude'], a:0, ex:'Gleiche Energie und gleiches $V$ heißt gleiches $k$. Die kleinere Amplitude zeigt nur, dass wenige Teilchen durchkommen. Wer eine längere Wellenlänge erwartet, denkt an einen Energieverlust beim Tunneln (McKagan, Perkins & Wieman 2008).'},
      {q:'Schau dir $E > V_0$ an. Ist dort immer $T = 1$?', opts:['Nein, $T < 1$ außer bei Resonanzen, wo $T = 1$ erreicht wird.', 'Ja, über der Barriere wird nichts reflektiert.', 'Nein, dort ist $T = 0$, weil die Barriere stört.'], a:0, ex:'Auch über der Barriere wird an den Kanten reflektiert. Bei $qa = n\\pi$ löschen sich die Reflexionen der beiden Kanten aus: Resonanz.'}
    ],
    noPic:{q:'Ohne Bild: Ein Proton und ein Elektron mit gleicher Energie treffen auf dieselbe Barriere ($E < V_0$). Wer tunnelt besser?', opts:['das Elektron', 'das Proton', 'beide gleich'], a:0, ex:'$\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$ wächst mit der Masse. Das Proton ist rund 1836-mal schwerer, $\\kappa$ also etwa 43-mal größer – $e^{-2\\kappa a}$ wird winzig.'}},
  compare:{
    text:'An der Stufe mit $E < V_0$ ist $B = \\frac{k - i\\kappa}{k + i\\kappa}$. Gezeigt werden soll $|B| = 1$ (Totalreflexion). Zwei richtige Wege:',
    ctx:TUN_DOWN(),
    A:{name:'Ausrechnen mit $B^*B$', model:['|B|^2 = B^* B', '= (k + iκ)/(k - iκ) · (k - iκ)/(k + iκ)', '= 1']},
    B:{name:'Beträge von Zähler und Nenner', text:'Zähler und Nenner sind zueinander komplex konjugiert.', model:['|k - iκ| = sqrt(k^2 + κ^2)', '|k + iκ| = sqrt(k^2 + κ^2)', '|B| = |k - iκ|/|k + iκ|', '= 1']},
    questions:[
      {q:'Was zeigt $|B| = 1$ physikalisch?', opts:['Alles wird reflektiert; rechts fließt kein Strom.', 'Rechts der Stufe ist $\\psi$ überall null.', 'Die Welle kommt unverändert zurück, ohne Phasenverschiebung.'], a:0, ex:'Rechts ist $\\psi \\ne 0$ (Eindringen), aber $C\\,e^{-\\kappa x}$ hat eine reelle Ortsabhängigkeit und trägt keinen Strom. Die Phase von $B$ ist dabei nicht null: Die reflektierte Welle ist phasenverschoben.'},
      {q:'Welcher Weg verallgemeinert sich auf $z = w/w^*$ mit beliebigem komplexem $w$?', opts:['Weg B: $|w^*| = |w|$, also $|z| = 1$', 'Weg A: Ausmultiplizieren klappt immer', 'keiner: Man braucht $w$ konkret'], a:0, ex:'Weg B braucht nur $|w^*| = |w|$ – das ist kürzer und gilt allgemein.'}
    ]
  },
  practice:[
    {id:'tunnel-p1', title:'Potentialstufe mit $E > V_0$',
      text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0 < E$. Ansatz: $\\psi_L = e^{ikx} + Be^{-ikx}$, $\\psi_R = Ce^{iqx}$ mit $k = \\sqrt{2mE}/\\hbar$, $q = \\sqrt{2m(E-V_0)}/\\hbar$. Die Größen $k$ und $q$ kannst du direkt benutzen.',
      ctx:TUN_UP(),
      goals:[
        {id:'a', prompt:'a) Stelle die Anschlussbedingungen auf und bestimme $B$.', type:'solve', unknown:'B', points:3, ph:'ψ_L(0) = ψ_R(0)',
          hints:['Gesucht ist $B$. Zwei Bedingungen bei $x = 0$ geben zwei Gleichungen für $B$ und $C$.', '$\\psi$ stetig: $1 + B = C$. $\\psi\'$ stetig: $ik(1 - B) = iqC$.', 'Setze $C = 1 + B$ in die zweite Gleichung ein und löse nach $B$ auf.'],
          model:[{l:'ψ_L(0) = ψ_R(0)', w:'ψ stetig'}, '1 + B = C', {l:'ψ_L\'(0) = ψ_R\'(0)', w:'ψ\' stetig'}, 'ik (1 - B) = iq C', 'k (1 - B) = q (1 + B)', 'B = (k - q)/(k + q)'],
          mistakes:[{expr:'(k + q)/(k - q)', msg:'Zähler und Nenner sind vertauscht: Für $V_0 \\to 0$ muss $B \\to 0$ gehen.'}]},
        {id:'b', prompt:'b) Berechne die Transmissionswahrscheinlichkeit $\\frac qk|C|^2$ mit $C = \\frac{2k}{k+q}$.', type:'value', target:'4k q/(k + q)^2', points:2, allowUnknowns:false,
          hints:['$T$ vergleicht Teilchenströme, nicht Dichten.', 'Der Faktor $q/k$ ist das Verhältnis der Geschwindigkeiten; setze $C = 2k/(k + q)$ ein.'],
          model:['q/k |C|^2 = q/k (2k/(k + q))^2', '= 4k q/(k + q)^2']},
        {id:'c', prompt:'c) Zeige, dass $|B|^2 + \\frac qk|C|^2 = 1$ ist.', type:'value', target:'1', points:2,
          hints:['Setze $|B|^2$ aus a) und $\\frac qk|C|^2$ aus b) ein.', 'Bringe beide Brüche auf den Nenner $(k+q)^2$.', '$(k - q)^2 + 4kq = (k + q)^2$'],
          model:['|B|^2 + q/k |C|^2 = (k - q)^2/(k + q)^2 + 4k q/(k + q)^2', '= (k^2 + 2k q + q^2)/(k + q)^2', '= 1']}
      ]},
    {id:'tunnel-p2', title:'Stufe mit $E < V_0$: Eindringen',
      text:'Jetzt ist $E < V_0$. Rechts klingt die Welle ab: $\\psi_R = Ce^{-\\kappa x}$ mit $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$; links wie bisher $\\psi_L = e^{ikx} + Be^{-ikx}$.',
      ctx:TUN_DOWN(),
      goals:[
        {id:'a', prompt:'a) Bestimme $C$.', type:'solve', unknown:'C', points:3, ph:'1 + B = C',
          hints:['Wie in Aufgabe 1, nur rechts $Ce^{-\\kappa x}$: zwei Anschlussbedingungen bei $x = 0$.', '$\\psi_R\'(0) = -\\kappa C$.', 'Aus $1 + B = C$ und $ik(1 - B) = -\\kappa C$ folgt $ik(2 - C) = -\\kappa C$.'],
          model:['1 + B = C', {l:'ik (1 - B) = -κ C', w:'ψ\' stetig'}, 'ik (2 - C) = -κ C', '2ik = (ik - κ) C', 'C = 2ik/(ik - κ)', 'C = 2k/(k + iκ)']},
        {id:'b', prompt:'b) In welcher Tiefe $d$ ist die Aufenthaltsdichte $|\\psi|^2$ auf $1/e$ ihres Werts bei $x = 0$ gefallen?', type:'solve', unknown:'d', points:2,
          hints:['Gesucht ist die Tiefe, in der $|\\psi|^2$ um den Faktor $e$ kleiner ist als bei $x = 0$.', '$|\\psi_R|^2 = |C|^2e^{-2\\kappa x}$; setze $e^{-2\\kappa d} = e^{-1}$.'],
          model:['e^(-2κ d) = e^(-1)', '2κ d = 1', 'd = 1/(2κ)'], note:'Für ein Elektron mit $V_0 - E = 1\\,\\mathrm{eV}$ ist $1/\\kappa \\approx 0{,}2\\,\\mathrm{nm}$.'}
      ]},
    {id:'tunnel-p3', title:'Gebundener Zustand im δ-Potential',
      text:'$V(x) = -\\alpha\\,\\delta(x)$ mit $\\alpha > 0$. Für einen gebundenen Zustand ($E < 0$) setzt man $\\psi(x) = A\\,e^{-\\kappa|x|}$ mit $\\kappa > 0$ an. Sprungbedingung: $\\psi\'(0^+) - \\psi\'(0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$.',
      ctx:TUN_DELTA(),
      goals:[
        {id:'a', prompt:'a) Bestimme $\\kappa$ aus der Sprungbedingung.', type:'solve', unknown:'κ', points:3,
          hints:['Die Sprungbedingung ist die einzige Gleichung, die $\\kappa$ festlegt.', '$\\psi\'(0^+) = -\\kappa A$, $\\psi\'(0^-) = +\\kappa A$, $\\psi(0) = A$.'],
          model:[{l:'-κ A - κ A = -2m α/ħ^2 A', w:'ψ\'(0⁺) − ψ\'(0⁻)'}, '2κ = 2m α/ħ^2', 'κ = m α/ħ^2'],
          mistakes:[{expr:'-m α/ħ^2', msg:'Vorzeichen prüfen: $\\psi\'(0^+) = -\\kappa A$, weil $\\psi$ nach rechts abfällt. Außerdem muss $\\kappa > 0$ sein.'}]},
        {id:'b', prompt:'b) Bestimme die Energie $E$.', type:'solve', unknown:'E', points:2,
          hints:['Außerhalb von $x = 0$ ist das Teilchen frei; dort gilt die Schrödingergleichung mit $V = 0$.', 'Für $x \\ne 0$: $-\\frac{\\hbar^2}{2m}\\psi\'\' = E\\psi$ mit $\\psi\'\' = \\kappa^2\\psi$.'],
          model:['-ħ^2/(2m) κ^2 = E', 'E = -ħ^2/(2m) (m α/ħ^2)^2', 'E = -m α^2/(2ħ^2)']},
        {id:'c', prompt:'c) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normierung: $\\int|\\psi|^2dx = 1$ ansetzen.', '$\\int_{-\\infty}^\\infty e^{-2\\kappa|x|}dx = 2\\int_0^\\infty e^{-2\\kappa x}dx = 1/\\kappa$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2/κ = 1', 'A = sqrt(κ)', 'A = sqrt(m α)/ħ']}
      ]},
    {id:'tunnel-p4', title:'Rechteckbarriere bei halber Barrierenhöhe',
      text:'Für eine Rechteckbarriere der Höhe $V_0$ und Breite $a$ mit $E < V_0$ gilt $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1}$ mit $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$. Hier ist $E = V_0/2$. Die Größe $\\kappa$ kannst du direkt benutzen.',
      ctx:{coords:[], params:{m:'pos', V_0:'pos', a:'pos'}, defs:{E:'V_0/2', κ:'sqrt(2m (V_0 - E))/ħ'}},
      goals:[{id:'a', prompt:'Vereinfache $T$ so weit wie möglich.', type:'value', target:'1/cosh(κ a)^2', points:3, ph:'T = 1/(1 + V_0^2 sinh(κa)^2/(4E(V_0 - E)))',
        hints:['Setze $E = V_0/2$ ein und vereinfache den Bruch.', '$4E(V_0 - E) = V_0^2$ bei $E = V_0/2$.', '$1 + \\sinh^2u = \\cosh^2u$.'],
        model:['T = 1/(1 + V_0^2 sinh(κa)^2/(4E(V_0 - E)))', '= 1/(1 + V_0^2 sinh(κa)^2/(4 · V_0/2 · V_0/2))', '= 1/(1 + sinh(κa)^2)', '= 1/cosh(κa)^2'],
        note:'Für $\\kappa a = 3$ ist $T \\approx 0{,}0099$; die Näherung $4e^{-2\\kappa a}$ liefert $0{,}0099$ – schon sehr gut.'}]},
    {id:'tunnel-p5', title:'Halbdurchlässige Barriere',
      text:'Wie in Aufgabe 4 ist $E = V_0/2$ und damit $T = 1/\\cosh^2(\\kappa a)$. Wie breit muss die Barriere sein, damit genau die Hälfte durchgeht?',
      ctx:{coords:[], params:{m:'pos', V_0:'pos'}, defs:{E:'V_0/2', κ:'sqrt(2m (V_0 - E))/ħ'}, unknowns:{a:{ref:'ln(1 + sqrt(2))/κ'}}},
      goals:[{id:'a', prompt:'Bestimme $a$.', type:'solve', unknown:'a', points:3,
        hints:['Setze $T = 1/\\cosh^2(\\kappa a) = 1/2$ und löse nach $a$ auf.', '$\\cosh^2(\\kappa a) = 2$, also $\\cosh(\\kappa a) = \\sqrt2$.', '$\\operatorname{arcosh}y = \\ln(y + \\sqrt{y^2 - 1})$'],
        model:['1/cosh(κa)^2 = 1/2', 'cosh(κa) = sqrt(2)', 'κa = ln(sqrt(2) + 1)', 'a = ln(1 + sqrt(2))/κ']}]},
    {id:'tunnel-p6', title:'Stromdichte einer ebenen Welle',
      text:'Für $\\psi(x) = C\\,e^{iqx}$ mit reellem $C > 0$ ist die Wahrscheinlichkeitsstromdichte $j = \\frac{\\hbar}{2mi}\\left(\\psi^*\\psi\' - \\psi\\,\\psi^{*\\prime}\\right)$.',
      ctx:{coords:['x'], params:{m:'pos', q:'pos', C:'pos'}, defs:{'ψ(x)':'C e^(i q x)'}},
      goals:[{id:'a', prompt:'Berechne $j$.', type:'value', target:'ħ q C^2/m', points:2, ph:'j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')',
        hints:['Setze $\\psi$ und $\\psi^*$ in die Formel ein und leite ab.', '$\\psi\' = iq\\psi$ und $(\\psi^*)\' = -iq\\psi^*$; $|\\psi|^2 = C^2$.'],
        model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) (i q C^2 + i q C^2)', '= ħ q C^2/m'],
        note:'$\\hbar q/m$ ist die Geschwindigkeit, $C^2$ die Dichte: $j = \\rho v$. Daher der Faktor $q/k$ in $T$.'}]},
    {id:'tunnel-s1', synth:true, title:'Synthese: ein Teilchen im δ-Potential',
      text:'Der gebundene Zustand im Potential $V = -\\alpha\\,\\delta(x)$ ist $\\psi(x) = \\sqrt\\kappa\\,e^{-\\kappa|x|}$ mit $\\kappa = m\\alpha/\\hbar^2$ und $E = -\\hbar^2\\kappa^2/2m$ (Aufgabe 3). Diese Aufgabe verbindet Thema 1 (Wahrscheinlichkeit, Unschärfe), Thema 2 (stationäre Zustände), Thema 4 (Impulsraum) und dieses Thema. $\\psi$, $\\varphi$ und $\\kappa$ kannst du direkt benutzen.',
      ctx:TUN_SYN(),
      goals:[
        {id:'a', prompt:'a) Mit welcher Wahrscheinlichkeit findet eine Ortsmessung das Teilchen im Bereich $|x| < 1/\\kappa$? (Thema 1)', type:'value', target:'1 - e^(-2)', points:2,
          hints:['Integriere $|\\psi|^2$ über das Intervall $[-1/\\kappa, 1/\\kappa]$.', '$|\\psi|^2 = \\kappa e^{-2\\kappa|x|}$ ist gerade: $2\\kappa\\int_0^{1/\\kappa}e^{-2\\kappa x}dx$.', 'Die Stammfunktion ist $-e^{-2\\kappa x}/(2\\kappa)$.'],
          model:['P = ∫_(-1/κ)^(1/κ) |ψ(x)|^2 dx', '= 2κ ∫_0^(1/κ) e^(-2κ x) dx', '= 1 - e^(-2)'],
          note:'Etwa $86\\,\\%$. Übrigens ist der ganze Bereich $x \\ne 0$ klassisch verboten ($E < 0 = V$): Das Teilchen hält sich fast nur dort auf.'},
        {id:'b', prompt:'b) Berechne die Impulsraum-Wellenfunktion $\\varphi(k)$. (Thema 4)', type:'value', target:'sqrt(2κ^3/π)/(κ^2 + k^2)', points:3,
          hints:['$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$; teile das Integral bei $x = 0$.', '$\\int_0^\\infty e^{-cx}dx = 1/c$ mit $c = \\kappa \\pm ik$.', '$\\frac{1}{\\kappa + ik} + \\frac{1}{\\kappa - ik} = \\frac{2\\kappa}{\\kappa^2 + k^2}$.'],
          model:['φ(k) = 1/sqrt(2π) ∫_-∞^∞ sqrt(κ) e^(-κ |x|) e^(-ikx) dx', '= sqrt(κ/(2π)) (1/(κ + ik) + 1/(κ - ik))', '= sqrt(κ/(2π)) · 2κ/(κ^2 + k^2)', '= sqrt(2κ^3/π)/(κ^2 + k^2)']},
        {id:'c', prompt:'c) Berechne den Erwartungswert der potentiellen Energie, $\\int V|\\psi|^2dx$. (dieses Thema)', type:'value', target:'-ħ^2 κ^2/m', points:2,
          hints:['Das Potential ist eine δ-Funktion: $\\int\\delta(x)f(x)\\,dx = f(0)$.', 'Es bleibt $-\\alpha|\\psi(0)|^2 = -\\alpha\\kappa$; drücke $\\alpha$ durch $\\kappa$ aus.'],
          model:['-α ∫_-∞^∞ δ(x) |ψ(x)|^2 dx = -α |ψ(0)|^2', '= -α κ', '= -ħ^2 κ^2/m']},
        {id:'d', prompt:'d) Im stationären Zustand ist $\\langle H\\rangle = E$ (Thema 2). Berechne damit die mittlere kinetische Energie $E - \\langle V\\rangle$.', type:'value', target:'ħ^2 κ^2/(2m)', points:2,
          hints:['Setze $E = -\\hbar^2\\kappa^2/2m$ und das Ergebnis aus c) ein.', '$-\\frac{\\hbar^2\\kappa^2}{2m} + \\frac{\\hbar^2\\kappa^2}{m}$'],
          model:['-ħ^2 κ^2/(2m) - (-ħ^2 κ^2/m) = ħ^2 κ^2/(2m)'],
          note:'Die kinetische Energie ist positiv, obwohl überall außer bei $x = 0$ $E < V$ gilt. Mit $\\langle p^2\\rangle = 2m\\langle T\\rangle = \\hbar^2\\kappa^2$ folgt $\\Delta p = \\hbar\\kappa$.'},
        {id:'e', prompt:'e) Berechne $\\Delta x$ und daraus $\\Delta x\\,\\Delta p$ mit $\\Delta p = \\hbar\\kappa$ aus d). Vergleiche mit $\\hbar/2$. (Thema 1)', type:'value', target:'ħ/sqrt(2)', points:3,
          hints:['Aus Symmetrie ist $\\langle x\\rangle = 0$, also $\\Delta x = \\sqrt{\\langle x^2\\rangle}$.', '$\\langle x^2\\rangle = 2\\kappa\\int_0^\\infty x^2e^{-2\\kappa x}dx$ und $\\int_0^\\infty x^2e^{-cx}dx = 2/c^3$.', '$\\langle x^2\\rangle = 1/(2\\kappa^2)$.'],
          model:['⟨x^2⟩ = 2κ ∫_0^∞ x^2 e^(-2κ x) dx', '= 1/(2κ^2)', 'Δx = 1/(sqrt(2) κ)', 'Δx · ħ κ = ħ/sqrt(2)'],
          note:'$\\hbar/\\sqrt2 \\approx 0{,}71\\,\\hbar > \\hbar/2$: Die Unschärferelation ist erfüllt, aber nicht minimal – $\\psi$ ist kein Gauß-Paket. Weil der Zustand stationär ist, gelten alle Ergebnisse für alle Zeiten.'}
      ]}
  ],
  concept:[
    {id:'tunnel-k1', type:'mc2', seg:'tunnel-t4', lex:'tunneleffekt',
      q:'Ein Elektron tunnelt durch eine Rechteckbarriere; links und rechts ist $V = 0$. Wie ist die Wellenlänge der durchgelassenen Welle im Vergleich zur einlaufenden?', opts:['gleich', 'größer', 'kleiner'], a:0,
      ex:'$k = \\sqrt{2mE}/\\hbar$ auf beiden Seiten.',
      reason:{q:'Warum?', opts:['$E$ ist in allen Bereichen gleich, und rechts ist $V$ wie links null.', 'Das Elektron verliert in der Barriere Energie; die kleinere Amplitude zeigt das.', 'Das Elektron muss Energie aufnehmen, um die Barriere zu überwinden.'], a:0,
        ex:'Die Vorstellung „Energieverlust beim Tunneln“ ist gut dokumentiert (McKagan, Perkins & Wieman 2008). Die kleinere Amplitude bedeutet eine kleinere Durchlasswahrscheinlichkeit, keine kleinere Energie.'}},
    {id:'tunnel-k2', type:'dialog', seg:'tunnel-t4', keep:true,
      text:'Hinter einer Barriere ist die Amplitude der Welle nur noch ein Hundertstel der einlaufenden.',
      people:[{name:'Lena', says:'Die Amplitude bestimmt, wie viele durchkommen: $T = 10^{-4}$. Jedes durchgekommene Elektron hat die volle Energie.'}, {name:'Jonas', says:'Dann haben die durchgekommenen Elektronen nur noch einen kleinen Teil ihrer ursprünglichen Energie.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'$|F|^2 = T$ ist eine Wahrscheinlichkeit. Die Energie steckt in $k$, und $k$ ist rechts wie links. Amplitude und Energie zu verknüpfen, ist der Kern der Fehlvorstellung (McKagan, Perkins & Wieman 2008).'},
    {id:'tunnel-k3', type:'mc', seg:'tunnel-t1',
      q:'Wie sieht $\\mathrm{Re}\\,\\psi$ innerhalb einer dicken Barriere ($E < V_0$) aus?', opts:['nicht schwingend, im Wesentlichen exponentiell abfallend', 'schwingend, mit kürzerer Wellenlänge als außen', 'schwingend, mit längerer Wellenlänge als außen'], a:0,
      ex:'In der Barriere ist $\\psi = Ce^{-\\kappa x} + De^{\\kappa x}$ – keine Schwingung. Wellenfunktionen qualitativ richtig zu skizzieren, ist eine dokumentierte Lernschwierigkeit (Singh & Marshman 2015).'},
    {id:'tunnel-k4', type:'mc2', seg:'tunnel-t2', lex:'eindringtiefe',
      q:'Ein Teilchen mit $E < V_0$ trifft auf eine Stufe der Höhe $V_0$, die nach rechts unendlich weit reicht. Kann eine Ortsmessung es rechts der Stufe finden?', opts:['Ja, mit kleiner Wahrscheinlichkeit nahe der Stufe', 'Nein, dort wäre die kinetische Energie negativ', 'Nein, denn alles wird reflektiert ($R = 1$)'], a:0,
      ex:'$|\\psi|^2 \\propto e^{-2\\kappa x}$ für $x > 0$.',
      reason:{q:'Warum?', opts:['$\\psi$ ist stetig und fällt rechts wie $e^{-\\kappa x}$ ab, nicht sprunghaft auf null.', '$R = 1$ heißt, dass das Teilchen nie bei $x > 0$ anzutreffen ist.', 'Ein Teilchen kann sich nur dort aufhalten, wo $E > V$ gilt.'], a:0,
        ex:'$R = 1$ sagt, dass am Ende alles zurückläuft, nicht dass $\\psi_R = 0$ ist.'}},
    {id:'tunnel-k5', type:'mc', seg:'tunnel-t5', lex:'endlicher-topf',
      q:'Drei Töpfe haben dieselbe Breite: A ist unendlich tief, B tief, C flach. Ordne die Grundzustandsenergien, jeweils vom Topfboden aus gemessen.', opts:['$E_C < E_B < E_A$', '$E_A < E_B < E_C$', '$E_A = E_B = E_C$'], a:0,
      ex:'Je flacher der Topf, desto weiter dringt $\\psi$ in die Wände ein, desto größer die Wellenlänge und desto kleiner die kinetische Energie.'}
  ],
  sketch:[SK.s1, SK.s2],
  final:[
    {aim:0, task:{id:'tunnel-fa1', title:'Reflexion und Transmission an einer Stufe',
      text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0$. Ein Teilchen läuft mit $E = \\tfrac43V_0$ von links ein. Benutze $k = \\sqrt{2mE}/\\hbar$, $q = \\sqrt{2m(E - V_0)}/\\hbar$ und die Amplituden $B$ (reflektiert) und $C$ (durchgelassen).',
      ctx:TUN_STEP('4V_0/3'),
      goals:[
        {id:'a', prompt:'a) Berechne die Reflexionswahrscheinlichkeit $R$.', type:'value', target:'1/9', points:3, model:['q = k/2', '1 + B = C', 'k (1 - B) = q C', 'B = (k - q)/(k + q)', '= 1/3', '|B|^2 = 1/9']},
        {id:'b', prompt:'b) Berechne die Transmissionswahrscheinlichkeit $T$.', type:'value', target:'8/9', points:2, model:['C = 2k/(k + q)', '= 4/3', 'q/k |C|^2 = 1/2 · 16/9', '= 8/9']}
      ]}},
    {aim:1, q:'An einer Stufe mit $E < V_0$ ist $\\psi$ für $x > 0$ nicht null. Welche Begründung ist richtig?', opts:['$\\psi(0) = \\psi\'(0) = 0$ ließe links nur $\\psi \\equiv 0$ zu; $\\psi$ und $\\psi\'$ sind stetig.', 'Das Teilchen leiht sich nach der Energie-Zeit-Unschärfe kurz die fehlende Energie.', 'Rechts der Stufe hat das Teilchen mehr Energie, deshalb kann es dort sein.'], a:0,
      ex:'Wäre $\\psi = 0$ für $x > 0$, dann wäre bei $x = 0$ sowohl $\\psi$ als auch $\\psi\'$ null, und die Schrödingergleichung links hätte nur die Nulllösung. Das Eindringen folgt aus der Gleichung selbst; eine „geliehene Energie“ braucht man nicht.'},
    {aim:2, task:{id:'tunnel-fa3', title:'Stärke eines δ-Potentials',
      text:'Ein Teilchen der Masse $m$ ist im Potential $V(x) = -\\alpha\\,\\delta(x)$ gebunden. Seine Energie ist $-E_b$ mit $E_b > 0$. Setze $\\psi = A\\,e^{-\\kappa|x|}$ an.',
      ctx:{coords:['x'], params:{m:'pos', E_b:'pos', A:'pos'}, defs:{'ψ(x)':'A e^(-κ |x|)'}, unknowns:{κ:{ref:'sqrt(2m E_b)/ħ'}, α:{ref:'ħ sqrt(2E_b/m)'}}},
      goals:[{id:'a', prompt:'Bestimme $\\alpha$.', type:'solve', unknown:'α', points:4,
        model:['-ħ^2 κ^2/(2m) = -E_b', 'κ = sqrt(2m E_b)/ħ', '-κ A - κ A = -2m α/ħ^2 A', 'α = ħ^2 κ/m', 'α = ħ sqrt(2E_b/m)']}]}},
    {aim:1, sketch:SK.fA},
    {aim:'k', type:'mc2', id:'tunnel-fk1',
      q:'Ein Elektron tunnelt durch eine Barriere. Links ist $V = 0$, rechts der Barriere ist $V = -V_1$ (tiefer als links). Wie ist die Wellenlänge rechts im Vergleich zu links?', opts:['kürzer', 'länger', 'gleich'], a:0,
      ex:'Rechts ist die kinetische Energie $E + V_1$ größer als links.',
      reason:{q:'Warum?', opts:['$E$ ist überall gleich, rechts ist aber $E - V$ größer.', 'Beim Tunneln verliert das Elektron Energie, also wird $k$ kleiner.', '$E$ ist überall gleich, also auch die Wellenlänge.'], a:0,
        ex:'Die Wellenlänge hängt von $E - V$ ab, nicht von $E$ allein und nicht vom Tunneln.'}},
    {aim:'k', type:'dialog', id:'tunnel-fk2', keep:true,
      text:'Ein Elektron mit $E < V_0$ trifft auf eine dünne Barriere.',
      people:[{name:'Lena', says:'In der Barriere wäre die kinetische Energie negativ. Deshalb kann eine Ortsmessung das Elektron dort nie finden.'}, {name:'Jonas', says:'Eine Ortsmessung kann es in der Barriere finden, mit kleiner Wahrscheinlichkeit. Danach ist seine Energie nicht mehr scharf.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'$|\\psi|^2 > 0$ in der Barriere. Die Ortsmessung lokalisiert das Elektron und überträgt dabei Energie; das widerspricht keinem Erhaltungssatz.'}
  ],
  finalB:[
    {aim:0, task:{id:'tunnel-fb1', title:'Reflexion und Transmission an einer anderen Stufe',
      text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0$. Ein Teilchen läuft mit $E = \\tfrac{25}{16}V_0$ von links ein. Benutze $k = \\sqrt{2mE}/\\hbar$, $q = \\sqrt{2m(E - V_0)}/\\hbar$ und die Amplituden $B$ (reflektiert) und $C$ (durchgelassen).',
      ctx:TUN_STEP('25V_0/16'),
      goals:[
        {id:'a', prompt:'a) Berechne die Reflexionswahrscheinlichkeit $R$.', type:'value', target:'1/16', points:3, model:['q = 3k/5', '1 + B = C', 'k (1 - B) = q C', 'B = (k - q)/(k + q)', '= 1/4', '|B|^2 = 1/16']},
        {id:'b', prompt:'b) Berechne die Transmissionswahrscheinlichkeit $T$.', type:'value', target:'15/16', points:2, model:['C = 2k/(k + q)', '= 5/4', 'q/k |C|^2 = 3/5 · 25/16', '= 15/16']}
      ]}},
    {aim:1, q:'An einer unendlich breiten Stufe mit $E < V_0$ wird alles reflektiert, durch eine endlich breite Barriere tunnelt ein Teil. Was macht den Unterschied?', opts:['In der Barriere sind $e^{-\\kappa x}$ und $e^{+\\kappa x}$ erlaubt; zusammen tragen sie Strom.', 'Die endliche Barriere gibt dem Teilchen beim Eindringen die fehlende Energie.', 'An der Stufe ist $\\psi$ für $x > 0$ null, in der Barriere aber nicht.'], a:0,
      ex:'$e^{-\\kappa x}$ allein trägt keinen Strom. Im endlichen Bereich kommt $e^{+\\kappa x}$ dazu; mit einer relativen Phase der Koeffizienten fließt ein Strom, und rechts kann eine laufende Welle anschließen. Auch an der Stufe ist $\\psi_R \\ne 0$.'},
    {aim:2, task:{id:'tunnel-fb3', title:'δ-Potential mit gemessener Aufenthaltsdichte',
      text:'Ein Teilchen der Masse $m$ ist im Potential $V(x) = -\\alpha\\,\\delta(x)$ gebunden. Man findet: Die Aufenthaltswahrscheinlichkeitsdichte $|\\psi|^2$ fällt vom Maximum aus auf der Länge $d$ auf $1/e$ ab. Setze $\\psi = A\\,e^{-\\kappa|x|}$ an.',
      ctx:{coords:['x'], params:{m:'pos', d:'pos', A:'pos'}, defs:{'ψ(x)':'A e^(-κ |x|)'}, unknowns:{κ:{ref:'1/(2d)'}, α:{ref:'ħ^2/(2m d)'}}},
      goals:[{id:'a', prompt:'Bestimme $\\alpha$.', type:'solve', unknown:'α', points:4,
        model:['e^(-2κ d) = e^(-1)', 'κ = 1/(2d)', '-κ A - κ A = -2m α/ħ^2 A', 'α = ħ^2 κ/m', 'α = ħ^2/(2m d)']}]}},
    {aim:1, sketch:SK.fB},
    {aim:'k', type:'mc2', id:'tunnel-gk1',
      q:'Ein Elektron tunnelt durch eine Barriere. Links ist $V = 0$, rechts der Barriere ist $V = V_1$ mit $0 < V_1 < E$. Wie ist die Wellenlänge rechts im Vergleich zu links?', opts:['länger', 'kürzer', 'gleich'], a:0,
      ex:'Rechts ist die kinetische Energie $E - V_1$ kleiner als links.',
      reason:{q:'Warum?', opts:['$E$ ist überall gleich, rechts ist aber $E - V$ kleiner.', 'Beim Tunneln verliert das Elektron Energie.', '$E$ ist überall gleich, also auch die Wellenlänge.'], a:0,
        ex:'Das Ergebnis „länger“ stimmt hier, aber nicht wegen eines Energieverlusts: Es liegt allein an $V_1$. Ohne $V_1$ wäre die Wellenlänge gleich.'}},
    {aim:'k', type:'dialog', id:'tunnel-gk2', keep:true,
      text:'Ein Teilchen mit $E < V_0$ trifft auf eine Stufe der Höhe $V_0$, die nach rechts unendlich weit reicht. Es gilt $R = 1$.',
      people:[{name:'Lena', says:'$R = 1$ heißt, dass am Ende alles zurückläuft; rechts der Stufe fließt kein Strom.'}, {name:'Jonas', says:'Trotzdem kann eine Ortsmessung das Teilchen kurz hinter der Stufe finden, mit kleiner Wahrscheinlichkeit.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:2,
      ex:'Beide Aussagen stimmen zugleich: Rechts ist $\\psi_R = Ce^{-\\kappa x} \\ne 0$, also $|\\psi|^2 > 0$, aber $\\psi_R^*\\psi_R\'$ ist reell und der Strom $j_R = 0$. Deshalb ist $R = 1$.'}
  ],
  errors:[
    {id:'tunnel-e1', title:'Wahrscheinlichkeitserhaltung an der Stufe',
      text:'An der Stufe mit $E > V_0$ ist $B = \\frac{k-q}{k+q}$ und $C = \\frac{2k}{k+q}$. Jemand will zeigen, dass Reflexion und Transmission zusammen 1 ergeben:',
      ctx:TUN_UP(),
      lines:['|B|^2 + |C|^2 = (k - q)^2/(k + q)^2 + 4k^2/(k + q)^2', '= (5k^2 - 2k q + q^2)/(k + q)^2', '= 1'],
      wrong:2,
      why:{q:'Was ist falsch?', opts:['Zeile 3: $|B|^2 + |C|^2 \\ne 1$; erhalten ist $|B|^2 + \\frac qk|C|^2$.', 'Zeile 2 ist falsch ausmultipliziert; im Zähler müsste $(k + q)^2$ stehen.', 'In Zeile 1 müsste $B$ statt $|B|^2$ stehen, weil $B$ reell ist.'], a:0, ex:'$|B|^2 + |C|^2 = 1$ gilt nicht; Zeile 2 ist richtig ausmultipliziert. Erhalten ist der Strom, und die Stromdichte rechts ist $\\frac{\\hbar q}{m}|C|^2$.'},
      fix:{id:'a', prompt:'Rechne richtig: Zeige $|B|^2 + \\frac qk|C|^2 = 1$.', type:'value', target:'1', model:['|B|^2 + q/k |C|^2 = (k - q)^2/(k + q)^2 + 4k q/(k + q)^2', '= (k + q)^2/(k + q)^2', '= 1']}},
    {id:'tunnel-e2', title:'Sprungbedingung beim δ-Potential',
      text:'Für $V = -\\alpha\\delta(x)$ und $\\psi = Ae^{-\\kappa|x|}$ wird gerechnet:',
      ctx:TUN_DELTA(),
      lines:['ψ(x) = A e^(-κ |x|)', 'κ A + κ A = -2m α/ħ^2 A', 'κ = -m α/ħ^2'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Falsche Vorzeichen: $\\psi\'(0^+) = -\\kappa A$ und $\\psi\'(0^-) = +\\kappa A$.', 'Rechts hätte $\\psi(0) = 0$ eingesetzt werden müssen, wie an einer Wand.', 'Der Faktor $2$ vor $m\\alpha$ gehört nicht in die Sprungbedingung.'], a:0, ex:'Rechts fällt $\\psi$ ab (negative Steigung), links steigt es zur Mitte hin an. Mit dem falschen Vorzeichen käme $\\kappa < 0$ heraus – nicht normierbar.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $\\kappa$.', type:'solve', unknown:'κ', model:['-κ A - κ A = -2m α/ħ^2 A', 'κ = m α/ħ^2']}}
  ]
});
})();
lexe('anschluss', 'Anschlussbedingungen', 'An einem endlichen Potentialsprung bei $x_0$: $\\psi(x_0^-) = \\psi(x_0^+)$ und $\\psi\'(x_0^-) = \\psi\'(x_0^+)$. An einer unendlich hohen Wand nur $\\psi = 0$ ($\\psi\'$ springt). Bei $V = -\\alpha\\delta(x - x_0)$: $\\psi$ stetig und $\\psi\'(x_0^+) - \\psi\'(x_0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(x_0)$.', {topic:'tunnel'});
lexe('reflexion-transmission', 'Reflexion und Transmission', 'Verhältnisse der Wahrscheinlichkeitsströme: $R = |j_{ref}|/j_{ein}$, $T = j_{trans}/j_{ein}$, $R + T = 1$. Für $\\psi_L = e^{ikx} + Be^{-ikx}$, $\\psi_R = Ce^{iqx}$: $R = |B|^2$, $T = \\frac qk|C|^2$. Stufe mit $E > V_0$: $R = \\left(\\frac{k-q}{k+q}\\right)^2$, $T = \\frac{4kq}{(k+q)^2}$.', {topic:'tunnel'});
lexe('tunneleffekt', 'Tunneleffekt', 'Ein Teilchen mit $E < V_0$ durchdringt eine Barriere endlicher Breite $a$ mit der Wahrscheinlichkeit $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0-E)}\\right]^{-1}$, $\\kappa = \\sqrt{2m(V_0-E)}/\\hbar$. Für $\\kappa a \\gg 1$: $T \\approx 16\\frac{E}{V_0}(1 - \\frac{E}{V_0})e^{-2\\kappa a}$. Das durchgelassene Teilchen hat dieselbe Energie wie vorher. Beispiele: Alpha-Zerfall, Rastertunnelmikroskop, Tunneldiode.', {topic:'tunnel'});
lexe('eindringtiefe', 'Eindringtiefe', 'Im klassisch verbotenen Bereich ($E < V$) ist $\\psi \\propto e^{-\\kappa x}$ mit $\\kappa = \\sqrt{2m(V-E)}/\\hbar$. $\\psi$ fällt auf der Länge $1/\\kappa$ auf $1/e$, die Dichte $|\\psi|^2$ auf der Länge $1/(2\\kappa)$.', {topic:'tunnel'});
lexe('delta-potential', 'δ-Potential', '$V(x) = -\\alpha\\delta(x)$, $\\alpha > 0$: genau ein gebundener Zustand $\\psi = \\sqrt\\kappa\\,e^{-\\kappa|x|}$ mit $\\kappa = m\\alpha/\\hbar^2$ und $E = -\\frac{m\\alpha^2}{2\\hbar^2}$. Für Streuzustände ($E > 0$) ist $T = \\left(1 + \\frac{m\\alpha^2}{2\\hbar^2E}\\right)^{-1}$.', {topic:'tunnel'});
lexe('endlicher-topf', 'Endlicher Potentialtopf', '$V = -V_0$ für $|x| < a$, sonst 0. Gebundene Zustände mit $-V_0 < E < 0$: innen Schwingung ($\\cos lx$ oder $\\sin lx$), außen $e^{-\\kappa|x|}$. Die Anschlussbedingungen führen auf transzendente Gleichungen, z. B. $l\\tan(la) = \\kappa$ für gerade Zustände. Es gibt immer mindestens einen gebundenen Zustand, insgesamt $\\lceil 2z_0/\\pi\\rceil$ mit $z_0 = a\\sqrt{2mV_0}/\\hbar$.', {topic:'tunnel'});
lexe('potentialstufe', 'Potentialstufe', '$V = 0$ für $x < 0$, $V = V_0$ für $x > 0$. Für $E > V_0$: teilweise Reflexion mit $R = \\left(\\frac{k-q}{k+q}\\right)^2$, auch wenn das klassisch unmöglich wäre. Für $E < V_0$: Totalreflexion ($|B| = 1$) mit Eindringen $\\psi \\propto e^{-\\kappa x}$ und Phasenverschiebung der reflektierten Welle.', {topic:'tunnel'});
lexe('rastertunnelmikroskop', 'Rastertunnelmikroskop', 'Eine Metallspitze im Abstand $d \\approx 0{,}5$–$1\\,\\mathrm{nm}$ über einer leitenden Probe; der Tunnelstrom ist proportional zu $e^{-2\\kappa d}$ mit $\\kappa \\approx 10\\,\\mathrm{nm}^{-1}$ (Austrittsarbeit einige eV). $0{,}1\\,\\mathrm{nm}$ mehr Abstand senkt den Strom auf etwa ein Siebtel. Regelt man auf konstanten Strom, entsteht ein Höhenprofil mit atomarer Auflösung (Binnig und Rohrer, Nobelpreis 1986).', {topic:'tunnel'});
lexe('alpha-zerfall', 'α-Zerfall', 'Ein α-Teilchen tunnelt durch die Coulomb-Barriere des Kerns (Gamow; Gurney und Condon, 1928). Näherung für glatte Barrieren (WKB): $T \\approx \\exp\\left(-\\frac2\\hbar\\int\\sqrt{2m(V - E)}\\,dx\\right)$ über den verbotenen Bereich. Weil $E$ im Exponenten steht, reichen die Halbwertszeiten von unter einer Mikrosekunde (Po-212) bis zu Milliarden Jahren (U-238).', {topic:'tunnel'});
