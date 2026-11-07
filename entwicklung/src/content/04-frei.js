/* ===== Thema 4: Freies Teilchen und Wellenpakete ===== */
(function(){
const R = String.raw;
const GAUSS = '(2πσ^2)^(-1/4) e^(-x^2/(4σ^2)) e^(i k_0 x)';
/* ---- Graphen für den Erklärteil (UMBAU2: reps-Zeilen k:'graph' und Schritt-Feld plot), Einheiten ħ = m = 1 ----
   Gauß-Paket σ = 0,5, k0 = 4: ψ(x,0) = (π/2)^(-1/4) e^(−x²) e^(4ix) (Einhüllende env = |ψ|), |φ(k)|² = (2π)^(-1/2) e^(−(k − k0)²/2);
   sum5/env5: Σ cos kx für k = 3 … 5 im Abstand 0,5 = cos 4x · (1 + 2 cos(x/2) + 2 cos x) */
const FREI_G = (() => {
  const gN = (x0, s) => x => Math.exp(-((x - x0) ** 2) / (2 * s * s)) / (Math.sqrt(2 * Math.PI) * s);
  return {gN,
    sum5:x => [3, 3.5, 4, 4.5, 5].reduce((a, k) => a + Math.cos(k * x), 0),
    env5:x => 1 + 2 * Math.cos(0.5 * x) + 2 * Math.cos(x),
    phi2:k0 => k => Math.exp(-((k - k0) ** 2) / 2) / Math.sqrt(2 * Math.PI),
    rePsi:x => Math.pow(Math.PI / 2, -0.25) * Math.exp(-x * x) * Math.cos(4 * x),
    env:x => Math.pow(Math.PI / 2, -0.25) * Math.exp(-x * x)};
})();
/* ---- Skizzenaufgaben (didaktik/SKIZZE.md): Musterfunktionen aus den exakten Lösungen, dimensionslos ---- */
const SK = (() => {
  const PI = Math.PI;
  const gauss = (x0, s) => x => Math.exp(-((x - x0) ** 2) / (2 * s * s));
  const gaussN = (x0, s) => x => Math.exp(-((x - x0) ** 2) / (2 * s * s)) / (Math.sqrt(2 * PI) * s);   // Fläche 1
  /* frei-s1: Impulsverteilung des Gauß-Pakets ψ = (2πσ²)^{-1/4} e^{-x²/4σ²} e^{ik0x} mit σ = 0,25 nm, k0 = 4 nm⁻¹:
     |φ(k)|² ∝ exp(−(k − k0)²/(2σk²)) mit σk² = 1/(4σ²), also σk = 1/(2σ) = 2 nm⁻¹, Halbwertsbreite 2√(2 ln 2)·σk ≈ 4,71 nm⁻¹ */
  const s1 = {
    id:'frei-sk1', title:'Impulsverteilung eines Gauß-Pakets', kind:'curve', draw:'abs2',
    text:'Ein Elektron ist im Zustand $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}e^{ik_0x}$ mit $\\sigma = 0{,}25\\,\\mathrm{nm}$ und $k_0 = 4\\,\\mathrm{nm}^{-1}$. Skizziere die Verteilung $|\\varphi(k)|^2$ der Wellenzahlen. Die Höhe ist frei; Lage und Breite sollen stimmen.',
    plot:{x:[-4, 12], xlab:'k\\;(\\mathrm{nm}^{-1})', ylab:'|\\varphi(k)|^2', ticks:[{x:-2, lab:'-2'}, {x:0, lab:'0'}, {x:2, lab:'2'}, {x:4, lab:'4'}, {x:6, lab:'6'}, {x:8, lab:'8'}, {x:10, lab:'10'}]},
    f:gauss(4, 2),
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann $|\\varphi(k)|^2$ negativ sein?'},
      {id:'lage', type:'center', x:4, tol:0.6, msg:'Was bewirkt der Faktor $e^{ik_0x}$ im Impulsraum? Wo liegt also die Mitte der Verteilung? (Abschnitt ‚Der Impulsraum: dieselbe Information, anders geschrieben‘)'},
      {id:'breite', type:'fwhm', v:4.71, tol:0.3, msg:'Wie hängt die Breite von $|\\varphi|^2$ mit $\\sigma$ zusammen? Ein schmales Paket im Ort heißt … im Impuls. Deine Halbwertsbreite ist {got}.'},
      {id:'buckel', type:'extrema', n:1, kind:'max', msg:'Wie viele Maxima hat eine Gauß-Kurve? Deine Skizze hat {got}.'}
    ],
    reveal:'$|\\varphi(k)|^2$ ist eine Gauß-Kurve um $k_0 = 4\\,\\mathrm{nm}^{-1}$, denn $e^{ik_0x}$ verschiebt die Verteilung um $k_0$. Ihre Varianz ist $1/(4\\sigma^2)$, die Standardabweichung also $1/(2\\sigma) = 2\\,\\mathrm{nm}^{-1}$ und die Halbwertsbreite etwa $4{,}7\\,\\mathrm{nm}^{-1}$. Je schmaler das Paket im Ort, desto breiter die Verteilung der Wellenzahlen: $\\Delta x\\,\\Delta p = \\sigma\\cdot\\hbar/(2\\sigma) = \\hbar/2$.',
    hints:['Lies Mitte und Breite getrennt ab: Was verschiebt die Verteilung, was legt ihre Breite fest?', '$|\\varphi|^2$ ist eine Gauß-Kurve um $k_0$ mit Varianz $1/(4\\sigma^2)$. Die Halbwertsbreite ist etwa $2{,}35$ Standardabweichungen.'],
    wrong:[
      {f:gauss(0, 2), fails:['lage'], why:'e^{ik0x} wie eine bedeutungslose Phase behandelt: Verteilung um k = 0'},
      {f:gauss(4, 0.25), fails:['breite'], why:'Breite wie im Ortsraum (σ statt 1/(2σ)): schmal im Ort und schmal im Impuls'}
    ]
  };
  /* frei-lab: Paket des Labors (ħ = m = 1), σ0 = 0,5, k0 = 4, t = 1: ⟨x⟩ = k0 t = 4, Δx(t) = σ0 √(1 + (t/(2σ0²))²) = 0,5·√5 ≈ 1,118, Halbwertsbreite ≈ 2,63 */
  const st = 0.5 * Math.sqrt(1 + (1 / (2 * 0.25)) ** 2);
  const lab = {
    id:'frei-sk-lab', title:'Das Paket nach der Zeit $t$', kind:'curve', draw:'abs2',
    text:'Bei $t = 0$ ist $|\\psi|^2$ ein Gauß-Paket um $x = 0$ mit $\\sigma_0 = 0{,}5$ und mittlerer Wellenzahl $k_0 = 4$ (Einheiten mit $\\hbar = m = 1$). Skizziere $|\\psi(x,t)|^2$ zur Zeit $t = 1$; die Höhe ist frei. Stell danach im Labor $\\sigma_0 = 0{,}5$, $k_0 = 4$ und $t = 1$ ein und vergleiche mit der dicken Kurve.',
    plot:{x:[-4, 12], xlab:'x', ylab:'|\\psi(x,1)|^2', ticks:[{x:-2, lab:'-2'}, {x:0, lab:'0'}, {x:2, lab:'2'}, {x:4, lab:'4'}, {x:6, lab:'6'}, {x:8, lab:'8'}, {x:10, lab:'10'}]},
    f:gauss(4, st),
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann $|\\psi|^2$ negativ sein?'},
      {id:'lage', type:'center', x:4, tol:0.6, msg:'Mit welcher Geschwindigkeit bewegt sich das Maximum von $|\\psi|^2$, mit $\\hbar k_0/2m$ oder mit $\\hbar k_0/m$? Wo ist es also bei $t = 1$? (Abschnitt ‚Phasen- und Gruppengeschwindigkeit‘)'},
      {id:'breite', type:'fwhm', v:2.355 * st, tol:0.3, msg:'Bleibt die Breite gleich? Wie groß ist $\\Delta x$ bei $t = 1$ im Vergleich zu $\\sigma_0$? (Abschnitt ‚Unschärfe und Zerfließen‘) Deine Halbwertsbreite ist {got}.'},
      {id:'buckel', type:'extrema', n:1, kind:'max', msg:'Wie viele Maxima hat das Paket? Deine Skizze hat {got}.'}
    ],
    reveal:'Die Einhüllende läuft mit der Gruppengeschwindigkeit $\\hbar k_0/m = 4$, ihr Maximum ist bei $t = 1$ also bei $x = 4$. Gleichzeitig zerfließt das Paket: $\\Delta x = 0{,}5\\sqrt{1 + 2^2} \\approx 1{,}1$, gut doppelt so breit wie am Anfang und entsprechend niedriger. Die Wellenberge von $\\mathrm{Re}\\,\\psi$ laufen nur halb so schnell; das siehst du an der dünnen Kurve, wenn du $t$ langsam veränderst.',
    hints:['Trenne zwei Fragen: Wo ist das Maximum zur Zeit $t$, und wie breit ist das Paket dann?', 'Das Maximum läuft mit $v_\\mathrm{g} = \\hbar k_0/m$. Für die Breite gilt $\\Delta x(t) = \\sigma_0\\sqrt{1 + (\\hbar t/2m\\sigma_0^2)^2}$.'],
    wrong:[
      {f:gauss(4, 0.5), fails:['breite'], why:'Paket zerfließt nicht'},
      {f:gauss(2, st), fails:['lage'], why:'Paket läuft mit der Phasengeschwindigkeit ħk0/2m'}
    ]
  };
  /* Abschluss (Lernziel 2), absolute Höhe: Fläche 1 bleibt beim Zerfließen erhalten.
     A: σ = 1, k0 = 1, t = 2√3 = √3·t0 (t0 = 2mσ²/ħ = 2): Δx = 2σ = 2, ⟨x⟩ = 2√3 ≈ 3,46, Maximum 1/(2√(2π)) ≈ 0,20 (vorher 0,40)
     B: σ = 1, k0 = 0,5, t = 4√2 = √8·t0: Δx = 3σ = 3, ⟨x⟩ = 2√2 ≈ 2,83, Maximum 1/(3√(2π)) ≈ 0,13 */
  const fin = (o) => ({
    id:o.id, title:'Zerfließendes Paket in der richtigen Höhe', kind:'curve', draw:'f', points:3,
    text:'Ein freies Gauß-Paket ($\\hbar = m = 1$) hat bei $t = 0$ die Breite $\\Delta x = \\sigma = 1$, den Schwerpunkt $\\langle x\\rangle = 0$ und die mittlere Wellenzahl $k_0 = ' + o.k0tex + '$. Bei $t = 0$ ist $|\\psi|^2$ eine Gauß-Kurve mit dem Maximum $1/\\sqrt{2\\pi} \\approx 0{,}40$. Skizziere $|\\psi(x,t)|^2$ zur Zeit $t = ' + o.ttex + '$ in der richtigen Lage, Breite **und Höhe**.',
    plot:{x:o.x, y:[-0.125, 0.5], abs:true, xlab:'x', ylab:'|\\psi(x,t)|^2', ticks:o.ticks, yticks:[{y:0.1, lab:'0{,}1'}, {y:0.2, lab:'0{,}2'}, {y:0.3, lab:'0{,}3'}, {y:0.4, lab:'0{,}4'}]},
    f:gaussN(o.xc, o.s),
    checks:[
      {id:'pos', type:'nonneg', msg:'Kann $|\\psi|^2$ negativ sein?'},
      {id:'lage', type:'center', x:o.xc, tol:0.6, msg:'Wo ist der Schwerpunkt zur Zeit $t$? Mit welcher Geschwindigkeit bewegt er sich?'},
      {id:'breite', type:'fwhm', v:2.355 * o.s, tol:0.3, msg:'Wie breit ist das Paket zur Zeit $t$? Deine Halbwertsbreite ist {got}.'},
      {id:'flaeche', type:'area', v:1, tol:0.25, msg:'Welche Fläche muss unter $|\\psi|^2$ liegen, zu jeder Zeit? Deine Fläche ist etwa {got}.'}
    ],
    reveal:'Der Schwerpunkt läuft mit $\\hbar k_0/m$ und ist bei $\\langle x\\rangle = k_0t = ' + o.xctex + '$. Mit $t_0 = 2m\\sigma^2/\\hbar = 2$ ist $\\Delta x(t) = \\sigma\\sqrt{1 + (t/t_0)^2} = ' + o.s + '$. Weil die Fläche unter $|\\psi|^2$ immer 1 bleibt, sinkt das Maximum auf $1/(' + o.s + '\\sqrt{2\\pi}) \\approx ' + o.htex + '$: Das Paket wird breiter **und** niedriger.',
    hints:['Bestimme nacheinander Schwerpunkt, Breite und Höhe.', 'Breite: $\\Delta x(t) = \\sigma\\sqrt{1 + (\\hbar t/2m\\sigma^2)^2}$. Höhe: Eine Gauß-Kurve mit Fläche 1 und Standardabweichung $s$ hat das Maximum $1/(s\\sqrt{2\\pi})$.'],
    wrong:[
      {f:gaussN(o.xc, 1), fails:['breite'], why:'Paket zerfließt nicht'},
      {f:x => gaussN(o.xc, o.s)(x) * o.s, fails:['flaeche'], why:'breiter, aber gleich hoch: Normierung verletzt (Fehlvorstellung aus dem Abschnitt „Unschärfe und Zerfließen“)'},
      {f:gaussN(o.xc / 2, o.s), fails:['lage'], why:'Schwerpunkt mit der Phasengeschwindigkeit ħk0/2m'}
    ]
  });
  const fA = fin({id:'frei-sk-A', k0tex:'1', ttex:'2\\sqrt3 \\approx 3{,}5', x:[-5, 11], xc:2 * Math.sqrt(3), xctex:'2\\sqrt3 \\approx 3{,}5', s:2, htex:'0{,}20',
    ticks:[{x:-4, lab:'-4'}, {x:-2, lab:'-2'}, {x:0, lab:'0'}, {x:2, lab:'2'}, {x:4, lab:'4'}, {x:6, lab:'6'}, {x:8, lab:'8'}, {x:10, lab:'10'}]});
  const fB = fin({id:'frei-sk-B', k0tex:'0{,}5', ttex:'4\\sqrt2 \\approx 5{,}7', x:[-9, 15], xc:2 * Math.sqrt(2), xctex:'2\\sqrt2 \\approx 2{,}8', s:3, htex:'0{,}13',
    ticks:[{x:-8, lab:'-8'}, {x:-4, lab:'-4'}, {x:0, lab:'0'}, {x:4, lab:'4'}, {x:8, lab:'8'}, {x:12, lab:'12'}]});
  return {s1, lab, fA, fB};
})();
topic({
  id:'frei', math:['m-fourier', 'm-analysis'], title:'Freies Teilchen und Wellenpakete', short:'Freies Teilchen',
  src:'Griffiths & Schroeter Kap. 2.4 · Nolting 5/1 Kap. 2 · Schwabl Kap. 2',
  goals:[
    'Ich kann für ebene Wellen die Dispersion $\\omega = \\hbar k^2/2m$ angeben und Phasen- und Gruppengeschwindigkeit unterscheiden.',
    'Ich kann die Impulsraum-Wellenfunktion $\\varphi(k)$ eines Wellenpakets berechnen und damit $\\langle p\\rangle$ und $\\Delta p$ bestimmen.',
    'Ich kann zeigen, dass das Gauß-Paket $\\Delta x\\,\\Delta p = \\hbar/2$ erfüllt, und das Zerfließen $\\Delta x(t)$ deuten.'
  ],
  needs:'Fourier-Transformation (Mathe M6) und Gauß-Integrale (Mathe M2) · Schrödingergleichung (Thema 2) · Erwartungswerte (Thema 1)',
  wozu:'Jedes Teilchen, das frei fliegt, ist ein Wellenpaket: Elektronen im Elektronenmikroskop, Neutronen im Interferometer, Atome nach dem Abschalten einer Falle. Bei ultrakalten Atomen misst man die Impulsverteilung genau so: Man lässt die Wolke frei fliegen und fotografiert sie nach einer Flugzeit. Dieselbe Fourier-Beziehung zwischen Breite im Ort und Breite in der Wellenzahl begegnet dir bei kurzen Laserpulsen: Je kürzer der Puls, desto breiter sein Spektrum.',
  bridge:'Aus Thema 2 kommt der Separationsansatz, aus Thema 1 Erwartungswert, Unschärfe und $\\hat p = -i\\hbar\\,\\partial_x$, aus Thema 3 das Rezept „entwickeln, Phasen anhängen, aufsummieren“. Mathematisch brauchst du die Fourier-Transformation (M6) und Gauß-Integrale (M2). Neu: Ohne Randbedingungen ist die Energie nicht quantisiert, und die Eigenfunktionen sind nicht normierbar – Thema 5 benutzt sie als Teilchenstrahlen, Thema 6 macht daraus die δ-Normierung.',
  check:[
    {q:'Wie lautet in diesem Tutorial die Fourier-Transformierte?', opts:['$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$', '$\\varphi(k) = \\int\\psi(x)e^{ikx}dx$', '$\\varphi(k) = \\frac{1}{2\\pi}\\int\\psi(x)\\cos(kx)\\,dx$'], a:0, ex:'Symmetrische Konvention mit $1/\\sqrt{2\\pi}$ in beiden Richtungen.', lex:'fourier', prev:'m-fourier', seg:'mf-t4'},
    {q:'$\\int_{-\\infty}^\\infty e^{-x^2/(2\\sigma^2)}dx$ ist …', opts:['$\\sqrt{2\\pi}\\,\\sigma$', '$\\sqrt{\\pi}\\,\\sigma$', '$2\\sigma$'], a:0, ex:'$\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/(2\\sigma^2)$.', lex:'integrale'},
    {q:'Die Welle $\\cos(kx - \\omega t)$ läuft mit welcher Geschwindigkeit?', opts:['$\\omega/k$ in $+x$-Richtung', '$k/\\omega$ in $+x$-Richtung', '$\\omega/k$ in $-x$-Richtung'], a:0, ex:'Konstante Phase $kx - \\omega t$ heißt $x = (\\omega/k)t + $ const.', lex:'ebene-welle'},
    {q:'Was gibt $\\hat p\\,e^{ikx}$ mit $\\hat p = -i\\hbar\\,d/dx$?', opts:['$\\hbar k\\,e^{ikx}$', '$-\\hbar k\\,e^{ikx}$', '$i\\hbar k\\,e^{ikx}$'], a:0, ex:'$-i\\hbar\\cdot ik = \\hbar k$: $e^{ikx}$ ist Eigenfunktion zum Impuls $p = \\hbar k$.', lex:'erwartungswert', prev:'wf'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Wahrscheinlichkeit für Impulse zwischen $p_1$ und $p_2$ im Zustand $\\psi(x)$ zu bestimmen?', opts:['$\\varphi(k)$ berechnen und $|\\varphi|^2$ von $p_1/\\hbar$ bis $p_2/\\hbar$ integrieren', '$\\hat p\\psi$ bilden und den Faktor vor $\\psi$ als Impuls ablesen', '$\\langle p\\rangle$ und $\\Delta p$ berechnen und eine Normalverteilung annehmen'], a:0, dk:true,
      ex:'Die Impulsverteilung steckt in $|\\varphi(k)|^2$ mit $p = \\hbar k$. $\\hat p\\psi/\\psi$ ist nur für Impulseigenfunktionen eine Konstante, und eine Normalverteilung liegt nur beim Gauß-Paket vor.'},
    {q:'Wie beginnst du, um die Geschwindigkeit des Maximums eines freien Wellenpakets mit mittlerer Wellenzahl $k_0$ zu bestimmen?', opts:['$d\\omega/dk$ an der Stelle $k_0$ ausrechnen', '$\\omega/k$ an der Stelle $k_0$ ausrechnen', 'die Zeitableitung von $|\\varphi(k)|^2$ bei $k_0$ bilden'], a:0, dk:true,
      ex:'Die Einhüllende läuft mit der Gruppengeschwindigkeit $d\\omega/dk$. $\\omega/k$ ist die Geschwindigkeit der Wellenberge, und $|\\varphi(k)|^2$ ändert sich beim freien Teilchen gar nicht.'}
  ],
  phenomenon:{
    title:'Wie breit ist ein Elektron nach einer Nanosekunde?',
    text:'Ein Elektron wird so präpariert, dass sein Ort auf $\\Delta x = 0{,}1\\,\\mathrm{nm}$ genau festliegt – etwa der Durchmesser eines Atoms. Danach fliegt es kräftefrei: Nichts zieht oder drückt an ihm.\n\nWie groß ist $\\Delta x$ nach $1\\,\\mathrm{ns}$?',
    q:{q:'Deine Vorhersage:', opts:['etwa $0{,}1\\,\\mathrm{nm}$: ohne Kraft ändert sich nichts', 'etwa $0{,}2\\,\\mathrm{nm}$: es wird etwas breiter', 'etwa $0{,}6\\,\\mathrm{mm}$: millionenfach breiter'], a:2,
      ex:'$\\Delta x(t) \\approx \\Delta v\\,t$ mit $\\Delta v = \\hbar/(2m\\Delta x) \\approx 6\\cdot10^5\\,\\mathrm{m/s}$.',
      fb:[
        'Ohne Kraft bleibt $\\langle p\\rangle$ konstant – aber nicht $\\Delta x$. Ein Ort, der auf $0{,}1\\,\\mathrm{nm}$ genau festliegt, verlangt eine Impulsunschärfe $\\Delta p \\ge \\hbar/(2\\Delta x)$. Die verschiedenen Impulsanteile laufen auseinander.',
        'Die Richtung stimmt, die Größe nicht. Die Geschwindigkeitsunschärfe ist hier etwa $\\hbar/(2m\\Delta x) \\approx 6\\cdot10^5\\,\\mathrm{m/s}$. In $1\\,\\mathrm{ns}$ laufen die Anteile damit um etwa $0{,}6\\,\\mathrm{mm}$ auseinander.',
        'Richtig. Die Geschwindigkeitsunschärfe $\\Delta v = \\hbar/(2m\\Delta x) \\approx 6\\cdot10^5\\,\\mathrm{m/s}$ ist riesig, weil das Elektron leicht und der Ort sehr scharf ist. Nach $1\\,\\mathrm{ns}$ ist $\\Delta x \\approx \\Delta v\\,t \\approx 0{,}6\\,\\mathrm{mm}$.'
      ]},
    reveal:'Die Impulsunschärfe ist mindestens $\\Delta p = \\hbar/(2\\Delta x)$, die Geschwindigkeitsunschärfe also $\\Delta v = \\hbar/(2m\\Delta x) \\approx 6\\cdot10^{5}\\,\\mathrm{m/s}$. Nach der Zeit $t$ ist das Paket etwa $\\Delta v\\,t$ breit, nach $1\\,\\mathrm{ns}$ also rund $0{,}6\\,\\mathrm{mm}$. Das ist das **Zerfließen** des Wellenpakets.\n\nEs heißt nicht, dass das Elektron „größer“ wird. Eine Ortsmessung findet es weiterhin an einer Stelle. Breiter wird die Verteilung der Messergebnisse. Eine Wolke klassischer Teilchen mit derselben Geschwindigkeitsstreuung liefe genauso auseinander. Neu ist in der Quantenmechanik: Die Streuung lässt sich nicht vermeiden, sobald der Ort scharf ist.'
  },
  teach:[
    /* ===== Abschnitt 1: ebene Wellen, Dispersion, Impuls, Spektrum ===== */
    {id:'frei-t1', title:'Ebene Wellen: Lösungen ohne Potential', steps:[
      {id:'frei-t1a', title:'Ohne Potential: die stationäre Gleichung',
        pre:{from:'sg', seg:'sg-t2', title:'Separation', text:R`Hängt $V$ nicht von $t$ ab, setzt du $\Psi(x,t) = \psi(x)\,e^{-iEt/\hbar}$ an. Für $\psi$ bleibt die stationäre Schrödingergleichung $-\frac{\hbar^2}{2m}\psi'' + V\psi = E\psi$. Mini-Beispiel: Im Kasten liefert sie die $\psi_n$ und die $E_n$.`},
        num:{title:'Ein Elektron mit 1 eV', text:R`Für $V = 0$ und $E = 1\,\mathrm{eV}$ wird die Gleichung zu $\psi'' = -k^2\psi$ mit

$$k = \frac{\sqrt{2mE}}{\hbar} = \frac{\sqrt{2\cdot 9{,}11\cdot10^{-31}\,\mathrm{kg}\cdot 1{,}60\cdot10^{-19}\,\mathrm J}}{1{,}055\cdot10^{-34}\,\mathrm{J\,s}} \approx 5{,}12\,\mathrm{nm}^{-1}.$$

Die Wellenlänge ist $\lambda = 2\pi/k \approx 1{,}23\,\mathrm{nm}$, einige Atomabstände.`},
        text:R`Ohne Potential ($V = 0$) wirkt keine Kraft. Klassisch fliegt das Teilchen geradeaus mit konstantem Impuls. Was sagt die Schrödingergleichung? Wie in Thema 2 trennst du Ort und Zeit. Für $\psi$ bleibt die [[lex:schroedinger|stationäre Schrödingergleichung]]

$$-\frac{\hbar^2}{2m}\psi'' = E\psi \quad\Longleftrightarrow\quad \psi'' = -k^2\psi,\qquad k = \frac{\sqrt{2mE}}{\hbar}.$$

Lies die Gleichung so: Die zweite Ableitung ist proportional zur Funktion selbst, mit negativem Faktor. Das ist die Schwingungsgleichung aus M7. Für $E > 0$ ist $k$ reell. Es heißt Wellenzahl und wächst mit der Wurzel der Energie.`,
        q:{q:R`Ein Elektron hat statt $1\,\mathrm{eV}$ die Energie $4\,\mathrm{eV}$. Wie ändert sich $k$?`,
          opts:[R`Es vervierfacht sich auf etwa $20{,}5\,\mathrm{nm}^{-1}$.`, R`Es verdoppelt sich auf etwa $10{,}2\,\mathrm{nm}^{-1}$.`, R`Es halbiert sich, weil die Welle schneller wird.`], a:1,
          ex:R`$k = \sqrt{2mE}/\hbar$ wächst wie $\sqrt E$, und $\sqrt4 = 2$.`,
          fb:[R`Vervierfachen hieße $k \propto E$. In $k$ steht aber $\sqrt E$.`, '',
            R`Mehr Energie heißt größeres $k$ und kürzere Wellenlänge, nicht kleineres $k$.`]}},
      {id:'frei-t1b', title:'Die ebene Welle und ihre Dispersion',
        pre:{from:'m-dgl', seg:'md-t3', title:R`Schwingen: $\psi'' = -k^2\psi$`, text:R`Die Gleichung $\psi'' = -k^2\psi$ hat die Lösungen $e^{ikx}$ und $e^{-ikx}$, reell geschrieben $\cos kx$ und $\sin kx$. Probe: $(e^{ikx})'' = (ik)^2e^{ikx} = -k^2e^{ikx}$.`},
        num:{title:'Der Zeitfaktor dazu', text:R`Mit $E = 1\,\mathrm{eV}$ ist $\omega = E/\hbar \approx 1{,}52\cdot10^{15}\,\mathrm s^{-1}$. Zusammen mit $e^{ikx}$ entsteht

$$\Psi(x,t) = e^{ikx}\,e^{-i\omega t} = e^{i(kx - \omega t)},\qquad k \approx 5{,}12\,\mathrm{nm}^{-1}.$$

Probe: $\hbar\omega = E = \hbar^2k^2/2m$.`},
        text:R`Die Lösungen $e^{\pm ikx}$ mal dem Zeitfaktor $e^{-iEt/\hbar}$ ergeben die [[lex:ebene-welle|ebene Welle]]

$$\Psi_k(x,t) = e^{i(kx - \omega t)},\qquad \omega(k) = \frac{\hbar k^2}{2m}.$$

Die Beziehung $\omega(k)$ heißt [[lex:dispersion|Dispersionsrelation]]. Sie sagt, welche Frequenz zu welcher Wellenzahl gehört. Hier ist sie quadratisch, nicht linear wie bei Licht im Vakuum ($\omega = ck$). Die Folgen siehst du in Abschnitt 5 und 6. Die Herleitung prüft Zeile für Zeile: $\Psi_k$ löst die zeitabhängige Gleichung genau dann, wenn $\omega = \hbar k^2/2m$ gilt.`,
        derive:{ctx:{coords:['x', 't'], params:{k:'real', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}}, lines:[
          {l:'iħ ∂/∂t e^(i(k x - ω t)) = ħω e^(i(k x - ω t))', w:'linke Seite der Schrödingergleichung',
            why:{q:'Woher kommt der Faktor $\\hbar\\omega$?', opts:['$\\partial_t$ bringt $-i\\omega$, und $i\\hbar\\cdot(-i\\omega) = \\hbar\\omega$', '$\\partial_t$ bringt $+i\\omega$, und $i\\hbar\\cdot i\\omega = \\hbar\\omega$', 'aus der Normierung der ebenen Welle'], a:0, ex:'$\\partial_t e^{-i\\omega t} = -i\\omega\\,e^{-i\\omega t}$ und $i\\cdot(-i) = 1$. Mit $+i\\omega$ käme $-\\hbar\\omega$ heraus.'}},
          {l:'-ħ^2/(2m) ∂^2/∂x^2 e^(i(k x - ω t)) = ħ^2 k^2/(2m) e^(i(k x - ω t))', w:'rechte Seite: zweimal ∂ₓ bringt (ik)²',
            why:{q:'Warum ist das Ergebnis positiv?', opts:['weil $(ik)^2 = -k^2$ ist und das Minus vor $\\hbar^2/2m$ es aufhebt', 'weil $k^2$ positiv ist und kein $i$ in der Rechnung vorkommt', 'weil die Energie per Definition positiv ist'], a:0, ex:'Zweimal Ableiten bringt $(ik)^2 = -k^2$. Zusammen mit $-\\hbar^2/2m$ entsteht $+\\hbar^2k^2/2m$.'}},
          {l:'ħω = ħ^2 k^2/(2m)', w:'beide Seiten gleichgesetzt',
            why:{q:'Was folgt aus dieser Zeile?', opts:['Die ebene Welle löst die Gleichung nur mit $\\omega = \\hbar k^2/2m$.', 'Jede Kombination von $k$ und $\\omega$ löst die Gleichung.', 'Die Frequenz hängt nur von der Masse ab.'], a:0, ex:'Das ist die Dispersionsrelation: $E = \\hbar\\omega = p^2/2m$ mit $p = \\hbar k$.'}}
        ]},
        q:{q:R`Die Wellenzahl einer freien Elektronenwelle wird verdoppelt. Was passiert mit $\omega$?`,
          opts:[R`Es verdoppelt sich, wie bei Licht.`, R`Es bleibt gleich; nur die Wellenlänge ändert sich.`, R`Es vervierfacht sich.`], a:2,
          ex:R`$\omega = \hbar k^2/2m$ wächst mit $k^2$, und $2^2 = 4$.`,
          fb:[R`Bei Licht ist $\omega = ck$ linear in $k$. Beim Elektron steht $k^2$ in der Dispersionsrelation.`,
            R`$\omega$ und $k$ sind durch $\omega = \hbar k^2/2m$ gekoppelt. Eine andere Wellenzahl heißt eine andere Energie.`, '']}},
      {id:'frei-t1c', title:R`Impuls $\hbar k$ und Laufrichtung`,
        pre:{from:'wf', seg:'wf-t7', title:'De Broglie', text:R`Der Impulsoperator $\hat p = -i\hbar\,d/dx$ macht aus $e^{ikx}$ das Vielfache $\hbar k\,e^{ikx}$. Die Welle hat also den scharfen Impuls $p = \hbar k = h/\lambda$. Mini-Beispiel: $\lambda = 1\,\mathrm{nm}$ gibt $p = h/\lambda \approx 6{,}6\cdot10^{-25}\,\mathrm{kg\,m/s}$.`},
        num:{title:'Zwei Richtungen', text:R`Für $k = +5\,\mathrm{nm}^{-1}$ ist $\hat p\,e^{ikx} = -i\hbar\cdot ik\,e^{ikx} = \hbar k\,e^{ikx}$ mit $p = \hbar k \approx +5{,}3\cdot10^{-25}\,\mathrm{kg\,m/s}$. Für $k = -5\,\mathrm{nm}^{-1}$ kommt derselbe Betrag mit negativem Vorzeichen heraus: Die Welle läuft nach links.`},
        text:R`Die ebene Welle ist Eigenfunktion des Impulses zum Eigenwert $p = \hbar k$. Das ist die de-Broglie-Beziehung $p = h/\lambda$ mit $\lambda = 2\pi/|k|$. Das Vorzeichen von $k$ gibt die Richtung: Für $k > 0$ läuft die Welle nach rechts, für $k < 0$ nach links. Die Energie ist $E = p^2/2m$, wie klassisch. Eine ebene Welle beschreibt also ein Teilchen mit genau bekanntem Impuls. Die Herleitung zeigt, dass der Zeitfaktor daran nichts ändert.`,
        derive:{ctx:{coords:['x', 't'], params:{k:'real', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}}, lines:[
          {l:'-iħ ∂/∂x e^(i(k x - ω t)) = ħ k e^(i(k x - ω t))', w:'Impulsoperator angewandt: Eigenwert ħk',
            why:{q:'Was zeigt die Zeile?', opts:['$e^{i(kx - \\omega t)}$ ist Impulseigenfunktion zum Eigenwert $\\hbar k$.', 'Der Impuls ist $-\\hbar k$, weil ein $-i$ davorsteht.', 'Der Impuls hängt von der Zeit ab.'], a:0, ex:'$-i\\hbar\\cdot ik = \\hbar k$. Der Zeitfaktor ändert daran nichts.'}}
        ]},
        q:{q:R`Welchen Impuls hat $\Psi(x,t) = e^{-i(3x + \omega t)}$ mit $x$ in nm?`,
          opts:[R`$p = +3\hbar/\mathrm{nm}$, denn nur der Betrag von $k$ zählt`, R`$p = -3i\hbar/\mathrm{nm}$, wegen des Faktors $-i$`, R`$p = -3\hbar/\mathrm{nm}$, die Welle läuft nach links`], a:2,
          ex:R`$e^{-i(3x + \omega t)} = e^{i(-3x - \omega t)}$: Das ist eine ebene Welle mit $k = -3\,\mathrm{nm}^{-1}$, also $p = \hbar k = -3\hbar/\mathrm{nm}$.`,
          fb:[R`Das Vorzeichen von $k$ trägt die Richtung. Hier steht $e^{-3ix}$, also $k < 0$.`,
            R`Ein Impulsmesswert ist reell. Das $-i$ des Operators hebt sich mit dem Faktor aus der Ableitung auf: $-i\hbar\cdot(-3i) = -3\hbar$.`, '']}},
      {id:'frei-t1d', title:'Eine ebene Welle in vier Darstellungen',
        num:{title:'Wellenberge zu zwei Zeiten', text:R`Bei $t = 0$ ist $\mathrm{Re}\,\Psi = \cos(kx)$, ein Wellenberg liegt bei $x = 0$. Eine Viertelperiode später ist $\omega t = \pi/2$ und $\mathrm{Re}\,\Psi = \cos(kx - \pi/2)$. Der Berg liegt jetzt bei $kx = \pi/2$, also bei $x = \lambda/4$: Er ist nach rechts gewandert. Der Betrag bleibt überall $|\Psi| = 1$.`},
        text:R`Eine ebene Welle kannst du in Worten, als Formel, als Bild und als Messaussage beschreiben. Die Tafel stellt die vier Darstellungen nebeneinander. Achte besonders auf zwei Übersetzungen. Erstens zeigt das Bild nur den Realteil. Die Wellenberge von $\mathrm{Re}\,\Psi$ wandern, $|\Psi|^2$ dagegen ist überall gleich. Zweitens steht das Messbare in $k$ und $\omega$, nicht in der Lage der Berge. Der Impuls ist $\hbar k$, die Energie $\hbar\omega$, und die Ortsverteilung ist gleichmäßig.`,
        reps:{obj:R`Ebene Welle mit $k > 0$`,
          rows:[
            {k:'worte', text:R`Ein Teilchen mit genau bekanntem Impuls, das nach rechts fliegt und überall gleich wahrscheinlich ist.`},
            {k:'formel', tex:R`\Psi_k(x,t) = e^{i(kx - \omega t)},\qquad \omega = \frac{\hbar k^2}{2m}`},
            {k:'graph', plot:{x:[0, 2], y:[-1.3, 1.3], xlab:R`x/\lambda`, ylab:R`\mathrm{Re}\,\Psi`}, f:x => Math.cos(2 * Math.PI * x), lab:'t = 0', f2:x => Math.cos(2 * Math.PI * x - Math.PI / 2), lab2:'t = T/4',
              cap:R`Durchgezogen $t = 0$, gestrichelt eine Viertelperiode $T/4$ später: Die Berge sind um $\lambda/4$ nach rechts gerückt.`},
            {k:'physik', text:R`Impulsmessung: immer $p = \hbar k$. Energiemessung: immer $E = \hbar\omega$. Ortsmessung: $|\Psi|^2 = 1$ überall, also kein bevorzugter Ort.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Aus dem Impuls $p$ die Wellenzahl $k = p/\hbar$ bilden; „nach rechts“ heißt $k > 0$. Dann $\omega$ aus der Dispersionsrelation berechnen.`},
            {from:'formel', to:'graph', rule:R`Den Realteil $\cos(kx - \omega t)$ zu festen Zeiten über $x$ zeichnen. Ein Berg liegt dort, wo $kx - \omega t = 0, 2\pi, \dots$ ist.`},
            {from:'graph', to:'physik', rule:R`Aus dem Abstand $\lambda$ der Berge den Impuls $h/\lambda$ ablesen, aus der Laufrichtung sein Vorzeichen. Die Lage der Berge selbst misst man nicht.`}
          ]},
        q:{q:R`Im Bild einer anderen freien Welle rücken die Berge von $\mathrm{Re}\,\Psi$ in einer Viertelperiode um $\lambda/4$ nach **links**. Welche Formel passt ($k > 0$, $\omega > 0$)?`, tr:{from:'graph', to:'formel'},
          opts:[R`$e^{i(kx - \omega t)}$, die Richtung zeigt das Bild nicht`, R`$e^{i(-kx - \omega t)}$`, R`$e^{i(kx + \omega t)}$`], a:1,
          ex:R`$\mathrm{Re}\,e^{i(-kx - \omega t)} = \cos(kx + \omega t)$: Ein Berg liegt bei $x = -\omega t/k$ und wandert nach links. Die Wellenzahl ist $-k$, der Zeitfaktor bleibt $e^{-i\omega t}$.`,
          fb:[R`Das ist die Welle aus der Tafel. Ihre Berge laufen nach rechts.`, '',
            R`Diese Berge laufen zwar nach links, aber $e^{+i\omega t}$ gehört zur Energie $-\hbar\omega < 0$. Freie Lösungen haben $e^{-i\omega t}$ mit $\omega > 0$; die Richtung steckt im Vorzeichen von $k$.`]}},
      {id:'frei-t1e', title:'Ein kontinuierliches Spektrum',
        num:{title:'Kasten gegen freie Achse', text:R`Im Kasten mit $L = 1\,\mathrm{nm}$ sind für ein Elektron nur $E_1 \approx 0{,}38\,\mathrm{eV}$, $E_2 \approx 1{,}50\,\mathrm{eV}$, $E_3 \approx 3{,}38\,\mathrm{eV}$, … erlaubt. Ohne Wände gibt es zu jeder Energie $E \ge 0$ eine Lösung:

$$\begin{aligned}E &= 1\,\mathrm{eV}: & k &\approx 5{,}12\,\mathrm{nm}^{-1},\\ E &= 1{,}01\,\mathrm{eV}: & k &\approx 5{,}15\,\mathrm{nm}^{-1}.\end{aligned}$$`},
        text:R`Im Kasten (Thema 3) legte die Randbedingung $kL = n\pi$ fest, welche $k$ erlaubt sind. Auf der freien Achse gibt es keine Wände und damit keine Randbedingung, die $k$ einschränkt. Jede Energie $E \ge 0$ ist erlaubt: Das Spektrum ist **kontinuierlich**.

Und $E < 0$? Dann wäre $\psi'' = +\kappa^2\psi$ mit $\kappa = \sqrt{-2mE}/\hbar$. Die Lösung $Ae^{\kappa x} + Be^{-\kappa x}$ wächst mindestens auf einer Seite über alle Grenzen. Ein freies Teilchen hat deshalb keine Energie-Eigenfunktionen mit negativer Energie. Das passt zur Regel aus Thema 2: Unter dem Minimum des Potentials, hier $V = 0$, gibt es keine brauchbare Lösung.`,
        q:{q:R`Für welche Energien hat die freie stationäre Gleichung eine Lösung $\psi(x)$, die nirgends über alle Grenzen wächst?`,
          opts:[R`nur für einzelne Werte $E_n$, wie im Kasten`, R`für jede Energie $E \ge 0$, aber für keine negative`, R`für jede Energie, auch für negative`], a:1,
          ex:R`Zu jedem $E \ge 0$ gehört $k = \sqrt{2mE}/\hbar$ und die beschränkte Lösung $e^{\pm ikx}$. Für $E < 0$ gibt es nur Exponentialfunktionen, die auf mindestens einer Seite wachsen.`,
          fb:[R`Die einzelnen Werte im Kasten kamen von den Randbedingungen an den Wänden. Ohne Wände schränkt nichts $k$ ein.`, '',
            R`Für $E < 0$ ist $\psi'' = \kappa^2\psi$. Jede Lösung $Ae^{\kappa x} + Be^{-\kappa x}$ wächst mindestens auf einer Seite über alle Grenzen.`]}},
      {id:'frei-t1f', title:'Zwei Richtungen, eine Energie: Entartung',
        num:{title:'Zwei Wellen zu 1 eV', text:R`Zu $E = 1\,\mathrm{eV}$ gehören $k = +5{,}12\,\mathrm{nm}^{-1}$ und $k = -5{,}12\,\mathrm{nm}^{-1}$. Auch ihre Überlagerung hat diese Energie:

$$\tfrac12\left(e^{ikx} + e^{-ikx}\right) = \cos kx.$$

$\cos kx$ enthält die Impulse $+\hbar k$ und $-\hbar k$ zu gleichen Teilen.`},
        text:R`Zu jeder Energie $E > 0$ gehören zwei Lösungen, $e^{ikx}$ und $e^{-ikx}$ mit $k = \sqrt{2mE}/\hbar$. Die eine läuft nach rechts, die andere nach links. Die Energie $\hbar^2k^2/2m$ hängt nur von $k^2$ ab, also nicht von der Richtung.

Gehören zu einer Energie mehrere unabhängige Lösungen, heißt die Energie **entartet**, hier zweifach. Jede Überlagerung $\psi = Ae^{ikx} + Be^{-ikx}$ hat dieselbe Energie. Für $|A| = |B|$ ist das eine stehende Welle wie im Kasten, etwa $\cos kx$ im Beispiel. Ob eine solche Überlagerung noch einen scharfen Impuls hat, prüft die Frage.`,
        q:{q:R`Ist $\psi(x) = \cos(kx)$ eine Eigenfunktion von $\hat p$?`,
          opts:['Ja, zum Eigenwert $\\hbar k$, weil $\\cos kx$ die Wellenzahl $k$ hat.', 'Ja, zum Eigenwert $0$, weil $\\cos kx$ eine reelle Funktion ist.', 'Nein, weil $\\hat p\\cos kx = i\\hbar k\\sin kx$ kein Vielfaches von $\\cos kx$ ist.'], a:2,
          ex:R`$\cos kx = \tfrac12(e^{ikx} + e^{-ikx})$ enthält $+\hbar k$ und $-\hbar k$. Eigenfunktion von $\hat H$ ist $\cos kx$ trotzdem, zur Energie $\hbar^2k^2/2m$.`,
          fb:[R`$\cos kx$ ist eine Überlagerung von $e^{ikx}$ und $e^{-ikx}$. Eine Impulsmessung kann beide Vorzeichen liefern.`,
            R`$\langle p\rangle = 0$ heißt nicht Eigenwert $0$. Wende $\hat p$ an: Es kommt $\sin kx$ heraus, nicht ein Vielfaches von $\cos kx$.`, '']}}
    ]},

    /* ===== Abschnitt 2: nicht normierbar, Ring, Überlagerung, Strahl, δ-Normierung ===== */
    {id:'frei-t2', title:'Nicht normierbar – und trotzdem nützlich', steps:[
      {id:'frei-t2a', title:'Normieren geht nicht',
        pre:{from:'wf', seg:'wf-t4', title:'Normierung', text:R`Eine Wellenfunktion ist normiert, wenn $\int_{-\infty}^{\infty}|\psi|^2dx = 1$ ist. Sonst teilt man durch die Wurzel des Integrals. Mini-Beispiel: $\psi = e^{-|x|}$ hat $\int e^{-2|x|}dx = 1$ und ist schon normiert.`},
        num:{title:'Ein immer längeres Stück', text:R`Über ein Stück der Länge $L$ ist

$$\int_{-L/2}^{L/2}|e^{ikx}|^2dx = \int_{-L/2}^{L/2}1\,dx = L.$$

Für $L = 1\,\mathrm{nm}$ ist das $1\,\mathrm{nm}$, für $L = 1\,\mathrm m$ schon $10^9\,\mathrm{nm}$. Für $L \to \infty$ wächst es ohne Grenze.`},
        text:R`Versuch, die ebene Welle zu [[lex:normierung|normieren]]. Es ist $|e^{ikx}|^2 = 1$ für alle $x$, also

$$\int_{-\infty}^{\infty}|e^{ikx}|^2\,dx = \infty.$$

Kein Vorfaktor $A$ hilft: $|A|^2\cdot\infty$ ist entweder $0$ oder $\infty$. Eine ebene Welle ist deshalb **kein physikalischer Zustand**. Sie beschreibt ein Teilchen mit scharfem Impuls, das überall gleich wahrscheinlich ist – auch am anderen Ende des Universums. So etwas lässt sich nicht präparieren. Das passt zur [[lex:unschaerfe|Unschärfe]] aus Thema 1: $\Delta p = 0$ verlangt $\Delta x = \infty$.`,
        q:{q:R`Warum ist $\psi(x) = A\,e^{ikx}$ für kein $A \ne 0$ normierbar?`,
          opts:[R`$e^{ikx}$ ist komplex, und komplexe Funktionen lassen sich nicht normieren.`, R`$|\psi|^2 = |A|^2$ ist überall gleich; das Integral über alle $x$ divergiert.`, R`$\int e^{ikx}dx = 0$; die Norm ist also null und nicht eins.`], a:1,
          ex:R`Normiert wird $|\psi|^2$, nicht $\psi$. Hier ist $|\psi|^2$ eine Konstante, und ihr Integral über die ganze Achse ist unendlich.`,
          fb:[R`Komplexe Funktionen wie $e^{-x^2}e^{ikx}$ sind problemlos normierbar. Es kommt auf $|\psi|^2$ an.`, '',
            R`In die Normierung geht $\int|\psi|^2dx$ ein, nicht $\int\psi\,dx$. Und $|e^{ikx}|^2 = 1$.`]}},
      {id:'frei-t2b', title:'Der Grenzfall eines großen Rings',
        num:{title:'Ein Ring von 100 nm', text:R`Mit $\psi(x + L) = \psi(x)$ und $L = 100\,\mathrm{nm}$ sind nur $k = 2\pi n/L$ erlaubt. Benachbarte Werte liegen $2\pi/L \approx 0{,}063\,\mathrm{nm}^{-1}$ auseinander. Normiert ist $e^{ikx}/\sqrt L$, denn

$$\int_0^L\left|\frac{e^{ikx}}{\sqrt L}\right|^2dx = \int_0^L\frac1L\,dx = 1.$$`},
        text:R`Du kannst dir den Grenzfall so vorstellen: Sperre das Teilchen in einen sehr großen Ring der Länge $L$. Dann ist $e^{ikx}/\sqrt L$ normiert, und $k = 2\pi n/L$ ist quantisiert. Für $L \to \infty$ rücken die erlaubten $k$ beliebig dicht zusammen. Aus dem diskreten Spektrum wird ein kontinuierliches, und der Vorfaktor $1/\sqrt L$ geht gegen null. In der Festkörperphysik rechnet man oft genau so: mit großem, aber endlichem $L$, und erst am Ende $L \to \infty$.`,
        q:{q:R`Der Ring wird doppelt so lang. Was passiert mit dem Abstand der erlaubten $k$ und mit dem Normierungsfaktor?`,
          opts:[R`Abstand doppelt so groß, Faktor $\sqrt2$-mal größer`, R`Abstand halb so groß, Faktor halb so groß`, R`Abstand halb so groß, Faktor $\sqrt2$-mal kleiner`], a:2,
          ex:R`Der Abstand ist $2\pi/L$, der Faktor $1/\sqrt L$. Aus $L$ wird $2L$: $\pi/L$ und $1/\sqrt{2L}$.`,
          fb:[R`$2\pi/L$ wird mit wachsendem $L$ kleiner, nicht größer. Und auch $1/\sqrt L$ wird kleiner.`,
            R`Der Abstand stimmt. Der Faktor ist aber $1/\sqrt L$, nicht $1/L$; er schrumpft nur um $\sqrt2$.`, '']}},
      {id:'frei-t2c', title:'Zwei Wellen überlagert',
        pre:{from:'m-komplex', seg:'mk-t5', title:'Der Interferenzterm', text:R`$|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\,\mathrm{Re}(z_1^*z_2)$. Der letzte Term hängt von der relativen Phase ab. Mini-Beispiel: $z_1 = 1$, $z_2 = e^{i\varphi}$ gibt $2 + 2\cos\varphi$, also $4$ für $\varphi = 0$ und $0$ für $\varphi = \pi$.`},
        num:{title:'Wellenzahlen 5 und 6 pro nm', text:R`Für $\psi = e^{5ix} + e^{6ix}$ ($x$ in nm) ist

$$|\psi|^2 = 1 + 1 + 2\cos\big((6 - 5)x\big) = 2 + 2\cos x.$$

Die Dichte ist nicht mehr gleichmäßig: $4$ bei $x = 0$, null bei $x = \pi\,\mathrm{nm} \approx 3{,}1\,\mathrm{nm}$. Das Muster wiederholt sich alle $2\pi\,\mathrm{nm} \approx 6{,}3\,\mathrm{nm}$.`},
        text:R`Ebene Wellen sind trotzdem unverzichtbar, zuerst **als Bausteine**. Die Schrödingergleichung ist linear. Also löst jede Überlagerung ebener Wellen sie ebenfalls. Schon zwei Wellen machen die Dichte ungleichmäßig, wie das Beispiel zeigt. Wo ihre Phasen übereinstimmen, verstärken sie sich; anderswo löschen sie sich aus. Mit vielen Wellen nahe beieinander bleibt nur eine Stelle mit großer Dichte übrig. So entstehen normierbare Wellenpakete (Abschnitt 3). Die ebenen Wellen spielen dabei die Rolle, die im Kasten die $\psi_n$ spielen – mit einem Integral über $k$ statt einer Summe über $n$.`,
        q:{q:'Wo hat $|\\psi|^2$ für $\\psi = e^{2ix} + e^{5ix}$ ($x$ in nm) die erste Nullstelle mit $x > 0$?',
          opts:['nirgends: $|\\psi|^2 = |e^{2ix}|^2 + |e^{5ix}|^2 = 2$', 'bei $x = \\pi/3\\,\\mathrm{nm} \\approx 1{,}05\\,\\mathrm{nm}$', 'bei $x = 2\\pi/3\\,\\mathrm{nm} \\approx 2{,}09\\,\\mathrm{nm}$'], a:1,
          ex:'$|\\psi|^2 = 2 + 2\\cos\\big((5 - 2)x\\big) = 2 + 2\\cos 3x$. $\\cos 3x = -1$ zum ersten Mal bei $3x = \\pi$, also $x = \\pi/3\\,\\mathrm{nm}$. Dort sind die beiden Wellen genau gegenphasig.',
          fb:['Das Betragsquadrat einer Summe ist nicht die Summe der Betragsquadrate. Der Interferenzterm $2\\cos 3x$ fehlt.', '', 'Bei $x = 2\\pi/3\\,\\mathrm{nm}$ ist $\\cos 3x = \\cos 2\\pi = 1$: Dort liegt das nächste Maximum, nicht eine Nullstelle.']}},
      {id:'frei-t2d', title:'Ein Strahl: Dichte mal Geschwindigkeit',
        pre:{from:'sg', seg:'sg-t6', title:'Stromdichte', text:R`Die Wahrscheinlichkeitsstromdichte ist $j = \frac{\hbar}{m}\,\mathrm{Im}(\psi^*\psi')$. Sie gibt an, wie viel Wahrscheinlichkeit pro Zeit an einer Stelle vorbeifließt. Mini-Beispiel: $\psi = Ae^{ikx}$ hat $\psi^*\psi' = ik|A|^2$, also $j = \frac{\hbar k}{m}|A|^2$.`},
        num:{title:'Ein Elektronenstrahl', text:R`Elektronen mit $1\,\mathrm{eV}$ haben $v = \hbar k/m \approx 5{,}9\cdot10^5\,\mathrm{m/s}$. Kommt im Mittel ein Elektron auf $1\,\mu\mathrm m$ Strahllänge, ist $|A|^2 = 10^6\,\mathrm m^{-1}$ und

$$j = v\,|A|^2 \approx 5{,}9\cdot10^{11}\,\mathrm s^{-1}.$$

So viele Elektronen passieren pro Sekunde eine Stelle.`},
        text:R`Der zweite Nutzen: ebene Wellen **als Modell für einen Strahl**. In der Streuung (Thema 5) beschreibt $A\,e^{ikx}$ einen gleichmäßigen Strom vieler Teilchen. Dann ist $|A|^2$ nicht die Dichte eines einzelnen Teilchens, sondern eine Teilchendichte. Die [[lex:stromdichte|Stromdichte]] $j = \frac{\hbar k}{m}|A|^2$ ist die Zahl der Teilchen pro Zeit: Dichte mal Geschwindigkeit. Dass $\int|A|^2dx$ divergiert, stört hier nicht. Ein unendlich langer Strahl enthält eben unendlich viele Teilchen.`,
        q:{q:R`Ein Elektronenstrahl wird durch $A\,e^{ikx}$ beschrieben. Wofür steht $\frac{\hbar k}{m}|A|^2$?`,
          opts:[R`für die Wahrscheinlichkeit, ein Elektron bei $x$ zu finden`, R`für die kinetische Energie eines Elektrons`, R`für die Zahl der Teilchen pro Zeit (Stromdichte)`], a:2,
          ex:R`$|A|^2$ ist eine Dichte, $\hbar k/m$ eine Geschwindigkeit; ihr Produkt ist ein Strom. Thema 5 rechnet damit Reflexion und Transmission aus.`,
          fb:[R`Dafür stünde $|A|^2$ allein. Der Faktor $\hbar k/m$ ist eine Geschwindigkeit.`,
            R`Die kinetische Energie ist $\hbar^2k^2/2m$. Hier steht $|A|^2$ als Faktor; das Produkt zählt Teilchen pro Zeit.`, '']}},
      {id:'frei-t2e', title:'Normierung auf eine δ-Funktion',
        pre:{from:'m-analysis', seg:'ma-t5', title:'Die δ-Distribution', text:R`$\delta(x)$ ist durch ihre Wirkung im Integral definiert: $\int f(x)\,\delta(x - a)\,dx = f(a)$. Mini-Beispiel: $\int x^2\,\delta(x - 3)\,dx = 9$.`},
        num:{title:'Ein Integral, das zur Spitze wird', text:R`Über ein Stück der Länge $L$ ist

$$\int_{-L/2}^{L/2}e^{i(k - k')x}dx = \frac{2\sin\big((k - k')L/2\big)}{k - k'}.$$

Bei $k = k'$ ist der Wert $L$, die Spitze ist etwa $2\pi/L$ breit, und die Fläche unter der Kurve über $k$ ist immer $2\pi$.`},
        text:R`Statt $\int|\psi|^2dx = 1$ benutzt man für ebene Wellen eine Normierung auf eine δ-Funktion. Das Beispiel zeigt, woher sie kommt: Für wachsendes $L$ wird die Kurve bei $k = k'$ immer höher und schmaler, ihre Fläche bleibt $2\pi$. Im Grenzfall gilt

$$\int_{-\infty}^{\infty}e^{-ik'x}\,e^{ikx}\,dx = 2\pi\,\delta(k - k').$$

Das ist die Fourier-Darstellung der [[lex:delta-distribution|δ-Distribution]] (M6). Ebene Wellen zu verschiedenen $k$ sind in diesem Sinn „orthogonal“; zu gleichem $k$ ist das Integral unendlich. **Ausblick:** Thema 6 macht daraus die δ-Normierung kontinuierlicher Spektren.`,
        q:{q:R`Du bildest $\int_{-L/2}^{L/2}e^{i(k - k')x}dx$ und lässt $L$ wachsen. Was passiert?`,
          opts:[R`Für alle $k$ und $k'$ wächst es gleichmäßig wie $L$.`, R`Bei $k = k'$ bleibt es $1$, daneben wird es genau null.`, R`Bei $k = k'$ wächst es wie $L$, daneben bleibt es beschränkt.`], a:2,
          ex:R`Bei $k = k'$ ist der Integrand $1$, das Integral also $L$. Daneben ist es höchstens $2/|k - k'|$. Diese Spitze wird im Grenzfall zu $2\pi\,\delta(k - k')$.`,
          fb:[R`Nur bei $k = k'$ ist der Integrand konstant. Daneben schwingt er, und die Beiträge heben sich weitgehend auf.`,
            R`Bei $k = k'$ ist der Integrand $e^0 = 1$, das Integral über die Länge $L$ also $L$, nicht $1$.`, '']}},
      {id:'frei-t2f', title:'Typischer Fehler: Lösung heißt nicht Zustand',
        num:{title:'Zwei Funktionen im Vergleich', text:R`$e^{3ix}$ löst die stationäre Gleichung, aber $\int|e^{3ix}|^2dx = \infty$. $e^{-x^2}e^{3ix}$ löst sie nicht, ist aber normierbar:

$$\int_{-\infty}^{\infty}e^{-2x^2}\,dx = \sqrt{\pi/2} \approx 1{,}25.$$

Nur die zweite ist (nach Normierung) ein möglicher Zustand.`},
        text:R`**Typische Fehlvorstellung:** „Wenn $e^{ikx}$ die Schrödingergleichung löst, ist es ein möglicher Zustand.“ Ein Zustand muss außerdem normierbar sein (Thema 1). Das freie Teilchen hat deshalb keinen einzigen normierbaren Eigenzustand von $\hat H$. Umgekehrt muss ein Zustand keine Energie-Eigenfunktion sein. Jeder physikalische Zustand des freien Teilchens ist eine Überlagerung verschiedener Energien. Er ändert sich deshalb mit der Zeit: Er zerfließt, und für $\langle p\rangle \ne 0$ läuft er.`,
        q:{q:R`Welche Funktion ist (nach Normierung) ein möglicher Zustand eines freien Teilchens?`,
          opts:['$e^{2ix}$, weil sie die stationäre Gleichung löst', '$e^{-|x|}e^{2ix}$, weil sie normierbar ist', '$e^{2x}$, weil sie die Gleichung für $E < 0$ löst'], a:1,
          ex:'Zustand heißt normierbar: $\\int|e^{-|x|}e^{2ix}|^2dx = \\int e^{-2|x|}dx = 1$. Ob die Funktion die *stationäre* Gleichung löst, ist dafür egal; ihre Zeitentwicklung bestimmt dann die zeitabhängige Gleichung.',
          fb:['$|e^{2ix}|^2 = 1$ überall; das Integral divergiert.', '', '$e^{2x}$ wächst für $x \\to \\infty$ über alle Grenzen und ist nicht normierbar.']}}
    ]},

    /* ===== Abschnitt 3: Wellenpakete und Fourier-Transformation ===== */
    {id:'frei-t3', title:'Wellenpakete: überlagern mit der Fourier-Transformation', steps:[
      {id:'frei-t3a', title:'Ein Paket aus fünf Wellen',
        num:{title:'Fünf Wellen um k = 4', text:R`Addiere $\cos(kx)$ für $k = 3;\ 3{,}5;\ 4;\ 4{,}5;\ 5$. Die Summe lässt sich schreiben als

$$\cos(4x)\,\big(1 + 2\cos(x/2) + 2\cos x\big).$$

Bei $x = 0$ ist sie $5$. Der Faktor in der Klammer hat seine erste Nullstelle bei $x = 4\pi/5 \approx 2{,}5$. Erst bei $x = 4\pi \approx 12{,}6$ sind wieder alle fünf Phasen gleich.`},
        text:R`Ein Teilchen, das sich irgendwo befindet, braucht eine normierbare Wellenfunktion. Du baust sie aus ebenen Wellen mit benachbarten Wellenzahlen. Wo alle Wellen in Phase sind, addieren sie sich. Daneben laufen ihre Phasen auseinander, und sie löschen sich weitgehend aus. Das Bild zeigt die Summe aus dem Beispiel: eine schnelle Schwingung mit der mittleren Wellenzahl $4$ unter einem langsamen Faktor. Je größer der Bereich der Wellenzahlen, desto schmaler der Buckel. Nimmst du unendlich viele Wellen mit beliebig kleinem Abstand, wiederholt sich der Buckel nie: ein einzelnes Paket.`,
        plot:{x:[-14, 14], y:[-5.5, 5.5], xlab:'x', ylab:R`\textstyle\sum\cos kx`, f:FREI_G.sum5, lab:'Summe', f2:FREI_G.env5, lab2:R`1 + 2\cos\frac x2 + 2\cos x`,
          cap:R`Die Summe (durchgezogen) schwingt mit $\cos 4x$ unter dem langsamen Faktor (gestrichelt). Bei $x = \pm12{,}6$ wiederholt sich das Muster.`},
        q:{q:R`Du nimmst statt der Wellen im Abstand $0{,}5$ fünf Wellen im Abstand $1$, also $k = 2$ bis $6$. Was passiert mit dem Buckel bei $x = 0$?`,
          opts:[R`Er wird doppelt so breit.`, R`Er wird etwa halb so breit.`, R`Er bleibt gleich breit, wird aber höher.`], a:1,
          ex:R`Der doppelte Bereich der Wellenzahlen halbiert die Breite: Die erste Nullstelle rückt von $4\pi/5$ auf $2\pi/5$. Die Höhe bleibt $5$, denn bei $x = 0$ ist jeder Kosinus $1$.`,
          fb:[R`Umgekehrt: Je weiter die Wellenzahlen auseinanderliegen, desto schneller laufen ihre Phasen auseinander.`, '',
            R`Bei $x = 0$ ist jeder der fünf Kosinus $1$, die Höhe bleibt also $5$. Die Breite ändert sich.`]}},
      {id:'frei-t3b', title:'Das Wellenpaket als Integral',
        num:{title:'Gewichte statt gleicher Beiträge', text:R`Im Beispiel hatte jede Welle das Gewicht $1$. Gib der Welle bei $k_j$ das Gewicht $\varphi(k_j)$ und rücke die Werte im Abstand $\Delta k$ zusammen:

$$\Psi(x,0) \approx \frac{1}{\sqrt{2\pi}}\sum_j\varphi(k_j)\,e^{ik_jx}\,\Delta k.$$

Für $\Delta k \to 0$ wird die Summe zum Integral, wie eine Riemann-Summe.`},
        text:R`Jede ebene Welle bekommt ein Gewicht $\varphi(k)$ und ihren eigenen Zeitfaktor. Dann summierst du kontinuierlich, also mit einem Integral:

$$\Psi(x,t) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}\varphi(k)\,e^{i(kx - \omega(k)t)}\,dk.$$

Das ist ein [[lex:wellenpaket|Wellenpaket]]. Es löst die Schrödingergleichung, weil jeder Summand sie löst und die Gleichung linear ist. Der Faktor $1/\sqrt{2\pi}$ ist Konvention; er macht die Formeln symmetrisch. $\varphi(k)$ darf komplex sein. Sein Betrag sagt, wie stark die Wellenzahl $k$ beteiligt ist; seine Phase sagt, wie diese Welle mit den anderen interferiert.`,
        q:{q:R`Warum löst das Integral die freie Schrödingergleichung?`,
          opts:['Weil das Integral über alle $k$ normiert ist.', 'Weil $\\varphi(k)$ selbst die Gleichung löst.', 'Weil jede Welle sie löst und die Gleichung linear ist.'], a:2,
          ex:R`Ableitungen nach $x$ und $t$ wirken auf $e^{i(kx - \omega t)}$ unter dem Integral. Jede Welle mit $\omega = \hbar k^2/2m$ erfüllt die Gleichung, also auch jede gewichtete Summe.`,
          fb:[R`Normierung ist eine weitere Bedingung an einen Zustand. Mit der Gleichung selbst hat sie nichts zu tun.`,
            R`$\varphi(k)$ ist ein Gewicht und hängt nicht von $x$ und $t$ ab. Die Gleichung erfüllt jede einzelne Welle $e^{i(kx - \omega t)}$.`, '']}},
      {id:'frei-t3c', title:R`$\varphi(k)$ aus $\Psi(x,0)$: die Fourier-Transformation`,
        pre:{from:'m-fourier', seg:'mf-t4', title:'Fourier-Transformation', text:R`In diesem Tutorial gilt $\varphi(k) = \frac{1}{\sqrt{2\pi}}\int\psi(x)e^{-ikx}dx$ und zurück $\psi(x) = \frac{1}{\sqrt{2\pi}}\int\varphi(k)e^{ikx}dk$. Plancherel: $\int|\psi|^2dx = \int|\varphi|^2dk$. Mini-Beispiel: $e^{-x^2/2}$ geht in $e^{-k^2/2}$ über.`},
        num:{title:'Das Rezept an einer Gauß-Funktion', text:R`Start: $\Psi(x,0) = e^{-x^2/2}$ (nicht normiert), $\hbar = m = 1$. (1) $\varphi(k) = e^{-k^2/2}$. (2) Mit $\omega = k^2/2$ bekommt jede Komponente den Faktor $e^{-ik^2t/2}$. (3) Zurücktransformieren:

$$\Psi(x,t) = \frac{1}{\sqrt{2\pi}}\int e^{-k^2/2}\,e^{-ik^2t/2}\,e^{ikx}\,dk.$$

Bei $t = 0$ kommt wieder $e^{-x^2/2}$ heraus.`},
        text:R`Wie findet man $\varphi(k)$? Setze $t = 0$. Dann steht im Wellenpaket eine inverse [[lex:fourier|Fourier-Transformation]] (M6). Umgekehrt gilt

$$\varphi(k) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^{\infty}\Psi(x,0)\,e^{-ikx}\,dx.$$

Das Rezept für jedes freie Anfangswertproblem: (1) $\varphi(k)$ aus $\Psi(x,0)$ berechnen. (2) Jede Komponente mit ihrem Phasenfaktor $e^{-i\omega(k)t}$ versehen. (3) Zurücktransformieren. Es ist dasselbe Rezept wie im Kasten (Thema 3): entwickeln, Phasen anhängen, aufsummieren. Nach [[lex:parseval|Parseval und Plancherel]] ist mit $\Psi$ auch $\varphi$ normiert.`,
        q:{q:R`Ein freies Teilchen startet mit $\Psi(x,0)$. In welcher Reihenfolge bestimmst du $\Psi(x,t)$?`,
          opts:[R`die Phasen $e^{-i\omega t}$ direkt an $\Psi(x,0)$ hängen, dann transformieren`, R`transformieren, Phasen $e^{-i\omega(k)t}$ anhängen, zurücktransformieren`, R`$\Psi(x,0)$ mit $e^{-iEt/\hbar}$ zu einer einzigen Energie multiplizieren`], a:1,
          ex:R`Nur die Komponenten $\varphi(k)$ haben jeweils eine feste Energie und damit einen einfachen Phasenfaktor. Deshalb erst zerlegen, dann die Phasen anhängen.`,
          fb:[R`$\Psi(x,0)$ hat keine einzelne Frequenz. Jede Wellenzahl braucht ihren eigenen Faktor $e^{-i\omega(k)t}$.`, '',
            R`Ein freies Paket ist eine Überlagerung vieler Energien. Ein einziger Phasenfaktor würde es nie verändern.`]}},
      {id:'frei-t3d', title:'Ein Paket im Spektrum und im Ort',
        num:{title:'Das Gauß-Paket des Labors', text:R`Mit $\hbar = m = 1$, $\sigma = 0{,}5$ und $k_0 = 4$ ist

$$\Psi(x,0) = (2\pi\sigma^2)^{-1/4}e^{-x^2/(4\sigma^2)}e^{ik_0x} = (\pi/2)^{-1/4}\,e^{-x^2}\,e^{4ix}.$$

Seine Transformierte ist $\varphi(k) = (2\sigma^2/\pi)^{1/4}e^{-\sigma^2(k - k_0)^2} = (2\pi)^{-1/4}e^{-(k - 4)^2/4}$. $|\varphi|^2$ hat die Mitte $4$ und die Standardabweichung $1$.`},
        text:R`Das Bild über der Tafel zeigt das **Spektrum** $|\varphi(k)|^2$: welche Wellenzahlen wie stark beteiligt sind. Die Tafel übersetzt es Schritt für Schritt in das Bild im Ort. Verfolge dabei zwei Zahlen. Die Mitte $k_0 = 4$ des Spektrums wird zur Wellenzahl der schnellen Schwingung von $\mathrm{Re}\,\Psi$. Die Breite $1$ des Spektrums gehört zur Breite $\sigma = 0{,}5$ der Einhüllenden. Breit in $k$ heißt schmal in $x$.`,
        plot:{x:[0, 8], y:[-0.05, 0.45], xlab:'k', ylab:R`|\varphi(k)|^2`, f:FREI_G.phi2(4), lab:R`|\varphi|^2`,
          cap:R`Spektrum des Pakets: Gauß-Kurve mit Mitte $k_0 = 4$ und Standardabweichung $\Delta k = 1$.`},
        reps:{obj:R`Gauß-Paket mit $\sigma = 0{,}5$ und $k_0 = 4$ ($\hbar = m = 1$)`,
          rows:[
            {k:'worte', text:R`Ein Teilchen um $x = 0$, ungefähr $0{,}5$ breit verteilt, mit Wellenzahlen um $4$, die um etwa $1$ streuen.`},
            {k:'impuls', tex:R`\varphi(k) = (2\pi)^{-1/4}\,e^{-(k - 4)^2/4}`},
            {k:'formel', tex:R`\Psi(x,0) = \frac{1}{\sqrt{2\pi}}\int\varphi(k)\,e^{ikx}\,dk`},
            {k:'ort', tex:R`\Psi(x,0) = (\pi/2)^{-1/4}\,e^{-x^2}\,e^{4ix}`},
            {k:'graph', plot:{x:[-2.5, 2.5], y:[-1, 1], xlab:'x', ylab:R`\Psi`}, f:FREI_G.rePsi, lab:R`\mathrm{Re}\,\Psi`, f2:FREI_G.env, lab2:R`|\Psi|`,
              cap:R`Durchgezogen $\mathrm{Re}\,\Psi$: Schwingung mit $k_0 = 4$. Gestrichelt die Einhüllende $|\Psi| \propto e^{-x^2}$; ihr Quadrat $|\Psi|^2$ ist eine Gauß-Kurve mit Standardabweichung $0{,}5$.`}
          ],
          links:[
            {from:'worte', to:'impuls', rule:R`„Wellenzahlen um 4, Streuung 1“ wird ein Spektrum mit Mitte $k_0 = 4$ und $\Delta k = 1$. Beim Gauß-Paket ist $\varphi \propto e^{-(k - k_0)^2/(4\Delta k^2)}$.`},
            {from:'impuls', to:'formel', rule:R`Jede Welle $e^{ikx}$ mit ihrem Gewicht $\varphi(k)$ multiplizieren und über $k$ integrieren.`},
            {from:'formel', to:'ort', rule:R`Das Gauß-Integral ausrechnen. Die Mitte $k_0$ wird zum Faktor $e^{ik_0x}$, die Breite $\Delta k$ zur Breite $\sigma = 1/(2\Delta k)$ im Ort.`},
            {from:'ort', to:'graph', rule:R`Realteil und Betrag über $x$ zeichnen. $|\Psi|$ ist die Einhüllende, darunter schwingt $\cos 4x$.`}
          ]},
        q:{q:R`Ein anderes Gauß-Paket hat ein Spektrum mit Mitte $k_0 = -2$ und Breite $\Delta k = 0{,}25$. Welche Ortsfunktion gehört dazu, bis auf den Vorfaktor?`, tr:{from:'impuls', to:'ort'},
          opts:[R`$e^{-x^2/16}\,e^{-2ix}$`, R`$e^{-x^2/16}\,e^{2ix}$`, R`$e^{-4x^2}\,e^{-2ix}$, also $\Delta x = 0{,}25$ wie $\Delta k$`], a:0,
          ex:R`$\sigma = 1/(2\Delta k) = 2$, also $e^{-x^2/(4\sigma^2)} = e^{-x^2/16}$. Die Mitte $k_0 = -2$ wird zum Faktor $e^{-2ix}$.`,
          fb:['', R`Das Vorzeichen von $k_0$ bleibt im Faktor $e^{ik_0x}$ erhalten: $k_0 = -2$ gibt $e^{-2ix}$.`,
            R`Die Breiten verhalten sich umgekehrt: $\Delta x = 1/(2\Delta k) = 2$, nicht $0{,}25$.`]}},
      {id:'frei-t3e', title:R`Wo das Paket sitzt, steckt in der Phase von $\varphi$`,
        pre:{from:'m-fourier', seg:'mf-t5', title:'Verschiebungsregel', text:R`Verschiebung im Ort gibt eine Phase in $k$: $\psi(x - a) \mapsto e^{-ika}\varphi(k)$. Wegen $|e^{-ika}| = 1$ ändert sich $|\varphi|^2$ nicht. Mini-Beispiel: $\psi(x - 2)$ hat die Transformierte $e^{-2ik}\varphi(k)$.`},
        num:{title:'Das Paket um 3 verschoben', text:R`Das Paket aus dem letzten Schritt sitze bei $x_0 = 3$, also $\Psi(x - 3, 0)$. Dann ist

$$\varphi_3(k) = e^{-3ik}\,(2\pi)^{-1/4}\,e^{-(k - 4)^2/4},\qquad |\varphi_3(k)|^2 = |\varphi(k)|^2.$$

Bei $k = 4$ ist die Phase $e^{-12i}$, bei $k = 5$ schon $e^{-15i}$.`},
        text:R`$\varphi(k)$ darf komplex sein, und seine Phase trägt Information. Verschiebst du das Paket im Ort, $\psi(x) \to \psi(x - x_0)$, so wird $\varphi(k) \to e^{-ikx_0}\varphi(k)$. Das Spektrum $|\varphi|^2$ bleibt gleich. Nur die Phase ändert sich, und zwar linear in $k$. Wo das Paket sitzt, steckt also in der Phase von $\varphi$. Welche Impulse es enthält, steckt in $|\varphi|^2$. Deshalb kannst du aus $|\varphi|^2$ allein nicht auf $\Psi(x)$ zurückschließen.`,
        q:{q:R`Zwei Pakete haben dasselbe Spektrum $|\varphi(k)|^2$. Was folgt daraus?`,
          opts:[R`Sie sind derselbe Zustand, nur anders geschrieben.`, R`Gleiche Impulsverteilung, aber vielleicht an anderen Orten.`, R`Sie haben dieselbe Ortsverteilung, aber verschiedene Impulse.`], a:1,
          ex:R`$|\varphi|^2$ ist die Impulsverteilung. Lage und Form im Ort hängen zusätzlich von der Phase von $\varphi$ ab.`,
          fb:[R`Die Phase von $\varphi$ fehlt. Ein verschobenes Paket hat dasselbe $|\varphi|^2$, ist aber ein anderer Zustand.`, '',
            R`Gleiches $|\varphi|^2$ heißt gleiche Impulsverteilung. Über die Ortsverteilung sagt es allein nichts.`]}},
      {id:'frei-t3f', title:R`Breite in $x$, Breite in $k$`,
        num:{title:'Ein Rechteck von 1 nm', text:R`Ein Paket mit $\psi = 1/\sqrt a$ für $|x| < a/2$ und $a = 1\,\mathrm{nm}$ hat die Transformierte $\varphi(k) \propto \sin(ka/2)/k$. Ihre erste Nullstelle liegt bei $k = 2\pi/a \approx 6{,}3\,\mathrm{nm}^{-1}$. Mit $a = 0{,}5\,\mathrm{nm}$ rückt sie auf $12{,}6\,\mathrm{nm}^{-1}$.`},
        text:R`Die Herleitung transformiert das Rechteckpaket aus dem Beispiel. Sie zeigt eine Regel, die für jede Fourier-Transformation gilt: Je schmaler das Paket im Ort, desto breiter die Verteilung der Wellenzahlen. Beim Gauß-Paket hast du es schon gesehen: Breite $\sigma$ in $x$, Breite $1/(2\sigma)$ in $k$. Allgemein gilt für jedes Fourier-Paar $\Delta x\,\Delta k \ge \tfrac12$, mit Gleichheit nur für Gauß-Funktionen. Mit $p = \hbar k$ ist das die Unschärferelation $\Delta x\,\Delta p \ge \hbar/2$ aus Thema 1, hier als Eigenschaft der Fourier-Transformation.`,
        derive:{ctx:{coords:['x', 'k'], params:{a:'pos'}}, lines:[
          {l:'1/sqrt(2π) ∫_(-a/2)^(a/2) 1/sqrt(a) e^(-ikx) dx = 1/sqrt(2π a) [e^(-ikx)/(-ik)]_(-a/2)^(a/2)', w:'ψ = 1/√a nur für |x| < a/2, Stammfunktion',
            why:{q:'Warum laufen die Grenzen nur von $-a/2$ bis $a/2$?', opts:['Weil außerhalb $\\psi = 0$ ist.', 'Weil das Integral über alle $x$ divergieren würde.', 'Weil $e^{-ikx}$ außerhalb null ist.'], a:0, ex:'Das Integral läuft formal über alle $x$, aber nur das Intervall mit $\\psi \\ne 0$ trägt bei.'}},
          {l:'= 1/sqrt(2π a) · (e^(ika/2) - e^(-ika/2))/(ik)', w:'Grenzen eingesetzt'},
          {l:'= sqrt(2/(π a)) sin(k a/2)/k', w:'eⁱᵘ − e⁻ⁱᵘ = 2i sin u',
            why:{q:'Wo liegt die erste Nullstelle von $\\varphi(k)$ für $k > 0$?', opts:['bei $k = 2\\pi/a$', 'bei $k = \\pi/a$', 'bei $k = a/2$'], a:0, ex:'$\\sin(ka/2) = 0$ für $ka/2 = \\pi$. Je kleiner $a$, desto weiter außen: schmal im Ort heißt breit in $k$.'}}
        ]},
        q:{q:R`Ein Paket wird im Ort halb so breit. Was passiert mit der Breite von $|\varphi(k)|^2$?`,
          opts:[R`Sie halbiert sich ebenfalls.`, R`Sie bleibt gleich; nur die Höhe ändert sich.`, R`Sie verdoppelt sich ungefähr.`], a:2,
          ex:R`Die Breiten in $x$ und $k$ verhalten sich umgekehrt: Beim Rechteck liegt die erste Nullstelle bei $2\pi/a$, beim Gauß-Paket ist $\Delta k = 1/(2\Delta x)$.`,
          fb:[R`Das wäre so, wenn Ort und Wellenzahl gleich skalierten. Bei der Fourier-Transformation verhalten sie sich umgekehrt.`,
            R`Die Breite ändert sich sehr wohl. Das Produkt $\Delta x\,\Delta k$ bleibt ungefähr gleich, also muss $\Delta k$ wachsen.`, '']}},
      {id:'frei-t3g', title:'Typischer Fehler: Hauptmaximum und Streuung verwechseln',
        num:{title:'Das Rechteck hat unendliches Δk', text:R`Beim Rechteck ist $|\varphi(k)|^2 \propto \sin^2(ka/2)/k^2$. Für große $k$ fällt das nur wie $1/k^2$. Dann ist $k^2|\varphi|^2$ ungefähr $\sin^2(ka/2)$, im Mittel $\tfrac12$, und

$$\langle k^2\rangle = \int k^2|\varphi(k)|^2\,dk = \infty.$$`},
        text:R`Das Hauptmaximum des Rechtecks reicht von $-2\pi/a$ bis $2\pi/a$. Es ist aber falsch, daraus eine Standardabweichung $\Delta k \approx 2\pi/a$ zu machen. Die langsam abfallenden Nebenmaxima tragen zu $\langle k^2\rangle$ so viel bei, dass das Integral divergiert. Physikalisch heißt das $\langle p^2\rangle = \infty$: Die Sprünge an den Kanten kosten unendlich viel kinetische Energie. Ein reales Paket hat deshalb glatte Kanten. Die Regel „schmal im Ort, breit in $k$“ bleibt richtig; nur das Maß der Breite muss man mit Bedacht wählen.`,
        q:{q:R`Warum ist für das Rechteckpaket $\langle p^2\rangle$ unendlich?`,
          opts:[R`Weil $|\varphi|^2$ für große $k$ nur wie $1/k^2$ abfällt.`, R`Weil das Rechteck mit $\psi = 1/\sqrt a$ nicht normierbar ist.`, R`Weil das Hauptmaximum $|\varphi(0)|^2$ unendlich hoch ist.`], a:0,
          ex:R`$k^2|\varphi|^2$ fällt dann gar nicht mehr ab, und das Integral divergiert. Ursache sind die Sprünge von $\psi$ an den Kanten.`,
          fb:['', R`Das Rechteck ist normiert: $\int|\psi|^2dx = a\cdot\tfrac1a = 1$.`,
            R`Das Hauptmaximum hat die endliche Höhe $|\varphi(0)|^2 = a/(2\pi)$. Es kommt auf die Ausläufer an.`]}}
    ]},

    /* ===== Abschnitt 4: Impulsraum ===== */
    {id:'frei-t4', title:'Der Impulsraum: dieselbe Information, anders geschrieben', steps:[
      {id:'frei-t4a', title:'Die Verteilung der Wellenzahlen',
        pre:{from:'m-stat', seg:'st-t2', title:'Wahrscheinlichkeitsdichte', text:R`Für eine kontinuierliche Größe ist $P(a \le x \le b) = \int_a^b\rho(x)\,dx$ mit $\int\rho\,dx = 1$. Mini-Beispiel: Bei einer Gauß-Dichte liegen etwa 68 % der Werte innerhalb einer Standardabweichung um den Mittelwert.`},
        num:{title:'Wellenzahlen zwischen 3 und 5', text:R`Für das Paket mit $|\varphi(k)|^2 = (2\pi)^{-1/2}e^{-(k - 4)^2/2}$ ist

$$P(3 \le k \le 5) = \int_3^5|\varphi(k)|^2\,dk \approx 0{,}68.$$

Mit $\hbar = 1$ heißt das: Eine Impulsmessung liefert in 68 % der Fälle einen Wert zwischen $3$ und $5$.`},
        text:R`Du kennst $|\psi(x)|^2$ als Wahrscheinlichkeitsdichte für den Ort. Die Funktion $\varphi(k)$ spielt dieselbe Rolle für den Impuls $p = \hbar k$:

$$P(k_1 \le k \le k_2) = \int_{k_1}^{k_2}|\varphi(k)|^2\,dk.$$

Deshalb heißt $\varphi$ [[lex:impulsraum|Impulsraum-Wellenfunktion]]. Diese Deutung kommt als Annahme zur Bornschen Regel aus Thema 1 hinzu. Plancherel sorgt dafür, dass alle Wahrscheinlichkeiten zusammen $1$ ergeben. **Ausblick:** Thema 6 zeigt, dass beide Regeln Spezialfälle eines einzigen Messpostulats sind.`,
        q:{q:R`Mit welcher Wahrscheinlichkeit liefert eine Impulsmessung am selben Paket einen Wert über $5\hbar$?`,
          opts:[R`etwa $0{,}32$`, R`etwa $0{,}16$`, R`etwa $0{,}68$`], a:1,
          ex:R`Außerhalb von $[3, 5]$ liegen $1 - 0{,}68 = 0{,}32$. Die Kurve ist symmetrisch um $4$, also liegt die Hälfte davon über $5$.`,
          fb:[R`$0{,}32$ liegt außerhalb von $[3, 5]$ – auf beiden Seiten zusammen. Gefragt ist nur die obere Seite.`, '',
            R`$0{,}68$ ist die Wahrscheinlichkeit für den Bereich zwischen $3$ und $5$.`]}},
      {id:'frei-t4b', title:'Impulsmittelwerte im Impulsraum',
        pre:{from:'m-stat', seg:'st-t3', title:'Erwartungswert und Momente', text:R`Für eine Dichte $\rho$ ist $\langle x\rangle = \int x\,\rho(x)\,dx$ und $\langle x^2\rangle = \int x^2\rho(x)\,dx$; die Varianz ist $\langle x^2\rangle - \langle x\rangle^2$. Mini-Beispiel: Eine Gauß-Dichte mit Mitte $4$ und Standardabweichung $1$ hat $\langle x\rangle = 4$ und $\langle x^2\rangle = 17$.`},
        num:{title:'Mitte 4, Breite 1', text:R`Für $|\varphi|^2$ mit Mitte $4$ und Standardabweichung $1$ ($\hbar = 1$):

$$\langle p\rangle = 4,\qquad \langle p^2\rangle = 4^2 + 1^2 = 17,\qquad \Delta p = \sqrt{17 - 16} = 1.$$`},
        text:R`Mit $|\varphi|^2$ berechnest du Impulsmittelwerte wie Ortsmittelwerte:

$$\langle p\rangle = \int\hbar k\,|\varphi(k)|^2\,dk,\qquad \langle p^2\rangle = \int\hbar^2k^2\,|\varphi(k)|^2\,dk.$$

Jeder Wert $\hbar k$ wird mit seiner Wahrscheinlichkeitsdichte gewichtet, genau wie $x$ mit $|\psi|^2$. Die Herleitung führt das am Gauß-Paket aus. Ergebnis: $\langle p\rangle = \hbar k_0$ und $\langle p^2\rangle = \hbar^2\left(k_0^2 + \frac{1}{4\sigma^2}\right)$, also $\Delta p = \hbar/(2\sigma)$, unabhängig von $k_0$. Die mittlere kinetische Energie ist $\langle p^2\rangle/2m$. Bewegung ($k_0$) und Lokalisierung ($\sigma$) tragen beide zu ihr bei. Ein ruhendes, aber schmales Paket hat also trotzdem kinetische Energie.`,
        derive:{ctx:{coords:['x', 'k'], params:{σ:'pos', 'k_0':'real'}, defs:{'ψ(x)':'(2πσ^2)^(-1/4) e^(-x^2/(4σ^2)) e^(i k_0 x)', 'φ(k)':'1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-i k x) dx'}}, lines:[
          {l:'φ(k) = 1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-ikx) dx', w:'Fourier-Transformierte des Gauß-Pakets mit e^{ik₀x}'},
          {l:'= (2πσ^2)^(-1/4)/sqrt(2π) ∫_-∞^∞ e^(-x^2/(4σ^2) - i(k - k_0)x) dx', w:'ψ eingesetzt, Exponenten zusammengefasst',
            why:{q:'Was bewirkt der Faktor $e^{ik_0x}$ im Fourier-Integral?', opts:['Er ersetzt $k$ durch $k - k_0$.', 'Er ersetzt $x$ durch $x - k_0$.', 'Er multipliziert das Ergebnis mit $k_0$.'], a:0, ex:'$e^{ik_0x}e^{-ikx} = e^{-i(k - k_0)x}$. Das Integral ist dasselbe wie für $k_0 = 0$, nur an der Stelle $k - k_0$.'}},
          {l:'= (2σ^2/π)^(1/4) e^(-σ^2 (k - k_0)^2)', w:'Ergebnis aus dem Beispiel, an der Stelle k − k₀'},
          {l:'∫_-∞^∞ ħ k sqrt(2σ^2/π) e^(-2σ^2 (k - k_0)^2) dk = ħ k_0', w:'⟨p⟩ im Impulsraum',
            why:{q:'Warum kommt ohne lange Rechnung $\\hbar k_0$ heraus?', opts:['Weil $|\\varphi|^2$ normiert und symmetrisch um $k_0$ ist.', 'Weil $\\hbar k$ eine Konstante ist.', 'Weil $\\varphi(k)$ eine reelle Funktion ist.'], a:0, ex:'Der Mittelwert einer symmetrischen, normierten Verteilung liegt im Symmetriepunkt.'}}
        ]},
        q:{q:R`Ein Gauß-Paket hat $k_0 = 0$ und $\sigma = 0{,}5$ ($\hbar = m = 1$). Wie groß ist seine mittlere kinetische Energie?`,
          opts:[R`$0$, weil das Paket im Mittel ruht`, R`$1$`, R`$\tfrac12$`], a:2,
          ex:R`$\langle p^2\rangle = \hbar^2/(4\sigma^2) = 1$, also $\langle p^2\rangle/2m = \tfrac12$. Allein die Lokalisierung kostet Energie.`,
          fb:[R`$\langle p\rangle = 0$ heißt nicht $\langle p^2\rangle = 0$. Die Impulse streuen um null.`,
            R`$1$ ist $\langle p^2\rangle$. Die kinetische Energie ist $\langle p^2\rangle/2m$.`, '']}},
      {id:'frei-t4c', title:'Die Ableitung wird zur Multiplikation',
        pre:{from:'m-fourier', seg:'mf-t5', title:'Ableitungsregel', text:R`Eine Ableitung im Ort gibt den Faktor $ik$: $\psi'(x) \mapsto ik\,\varphi(k)$. Zweimal angewandt: $\psi'' \mapsto -k^2\varphi$. Mini-Beispiel: $e^{-x^2/2} \mapsto e^{-k^2/2}$, also $-x\,e^{-x^2/2} \mapsto ik\,e^{-k^2/2}$.`},
        num:{title:'Der Impulsoperator an der Gauß-Funktion', text:R`$\psi = e^{-x^2/2}$ hat $-i\hbar\psi' = i\hbar x\,e^{-x^2/2}$. Transformiert wird daraus

$$-i\hbar\cdot ik\,e^{-k^2/2} = \hbar k\,e^{-k^2/2} = \hbar k\,\varphi(k).$$

Im Impulsraum steht also einfach $\hbar k$ mal $\varphi(k)$.`},
        text:R`Dasselbe $\langle p\rangle$ liefert $\int\psi^*(-i\hbar\,\partial_x)\psi\,dx$ im Ortsraum. Das ist kein Zufall. Leite $\psi(x) = \frac{1}{\sqrt{2\pi}}\int\varphi(k)e^{ikx}dk$ nach $x$ ab: Unter dem Integral entsteht der Faktor $ik$. Zu $-i\hbar\psi'$ gehört also die Impulsfunktion $\hbar k\,\varphi(k)$. Unter der Fourier-Transformation wird die Ableitung zur Multiplikation. **Faustregel:** Rechne eine Größe dort aus, wo ihr Operator eine Multiplikation ist: $x$ und $V(x)$ im Ortsraum, $p$ und $p^2/2m$ im Impulsraum.`,
        q:{q:R`Was gehört im Impulsraum zu $-\frac{\hbar^2}{2m}\psi''(x)$?`, tr:{from:'ort', to:'impuls'},
          opts:[R`$-\frac{\hbar^2k^2}{2m}\varphi(k)$`, R`$\frac{\hbar^2k^2}{2m}\varphi(k)$`, R`$\frac{\hbar^2}{2m}\varphi''(k)$`], a:1,
          ex:R`$\psi'' \mapsto (ik)^2\varphi = -k^2\varphi$. Mit $-\hbar^2/2m$ davor wird daraus $+\frac{\hbar^2k^2}{2m}\varphi$: die kinetische Energie als Multiplikation.`,
          fb:[R`$(ik)^2 = -k^2$, und das Minus vor $\hbar^2/2m$ hebt es auf. Kinetische Energie ist nicht negativ.`, '',
            R`Im Impulsraum wird die Ableitung zur Multiplikation mit $ik$. Es entsteht keine Ableitung nach $k$.`]}},
      {id:'frei-t4d', title:'Den Impuls in zwei Darstellungen bestimmen',
        num:{title:R`$k_0 = 4$ gegen $k_0 = 0$`, text:R`Das Paket mit $\sigma = 0{,}5$ ohne Phasenfaktor hat $|\varphi|^2$ um $k = 0$. Mit $e^{4ix}$ liegt dieselbe Kurve um $k = 4$. Im Ort ist der Unterschied unsichtbar: Wegen $|e^{4ix}| = 1$ haben beide dieselbe Dichte $|\psi|^2$.`},
        text:R`Die Tafel übersetzt eine Frage zwischen Ort und Impuls: Wie ist der Impuls verteilt? Im Ort steckt der Impuls in der Ableitung, also in der ortsabhängigen Phase von $\psi$. Im Impulsraum steht er offen da, als Lage und Breite von $|\varphi|^2$. Das Bild zeigt beide Spektren aus dem Beispiel. Sie haben dieselbe Form, aber verschiedene Mitten. Am Bild liest du ab, was eine Impulsmessung liefert: Die Mitte mal $\hbar$ ist $\langle p\rangle$, die Standardabweichung mal $\hbar$ ist $\Delta p$.`,
        reps:{obj:R`Impuls eines Gauß-Pakets mit $\sigma = 0{,}5$ ($\hbar = 1$)`,
          rows:[
            {k:'worte', text:R`Welche Impulse findet eine Messung, und wie oft?`},
            {k:'ort', tex:R`\psi(x) = (\pi/2)^{-1/4}\,e^{-x^2}\,e^{4ix},\qquad \langle p\rangle = \int\psi^*\left(-i\hbar\,\partial_x\psi\right)dx`},
            {k:'impuls', tex:R`\varphi(k) = (2\pi)^{-1/4}\,e^{-(k - 4)^2/4},\qquad \langle p\rangle = \int\hbar k\,|\varphi(k)|^2\,dk`},
            {k:'graph', plot:{x:[-4, 8], y:[-0.05, 0.45], xlab:'k', ylab:R`|\varphi(k)|^2`}, f:FREI_G.phi2(4), lab:R`k_0 = 4`, f2:FREI_G.phi2(0), lab2:R`k_0 = 0`,
              cap:R`Durchgezogen das Paket mit $e^{4ix}$, gestrichelt ohne. Gleiche Breite $\Delta k = 1$, verschobene Mitte.`},
            {k:'physik', text:R`$\langle p\rangle = 4\hbar$ und $\Delta p = \hbar$. Etwa 68 % der Messwerte liegen zwischen $3\hbar$ und $5\hbar$.`}
          ],
          links:[
            {from:'worte', to:'ort', rule:R`Im Ort den Impulsoperator $-i\hbar\,\partial_x$ zwischen $\psi^*$ und $\psi$ setzen und über $x$ integrieren.`},
            {from:'ort', to:'impuls', rule:R`Fourier-transformieren. Die Ableitung wird zum Faktor $ik$, der Faktor $e^{4ix}$ verschiebt $\varphi$ um $4$.`},
            {from:'impuls', to:'graph', rule:R`$|\varphi(k)|^2$ über $k$ zeichnen: Mitte $k_0$, Standardabweichung $1/(2\sigma)$.`},
            {from:'graph', to:'physik', rule:R`Mitte und Standardabweichung des Graphen mit $\hbar$ multiplizieren. Die Fläche über einem Intervall ist die Wahrscheinlichkeit dafür.`}
          ]},
        q:{q:R`Ein Graph zeigt $|\varphi(k)|^2$ als Gauß-Kurve mit Mitte $k = -3$ und Standardabweichung $2$. Was liefern Impulsmessungen?`, tr:{from:'graph', to:'physik'},
          opts:[R`$\langle p\rangle = 3\hbar$ und $\Delta p = 2\hbar$, denn Impulse zählen als Betrag`, R`$\langle p\rangle = -3\hbar$ und $\Delta p = 4\hbar$, die doppelte Standardabweichung`, R`$\langle p\rangle = -3\hbar$ und $\Delta p = 2\hbar$`], a:2,
          ex:R`Die Mitte gibt $\langle p\rangle = \hbar k_0 = -3\hbar$: Das Paket läuft nach links. Die Standardabweichung gibt $\Delta p = 2\hbar$.`,
          fb:[R`Das Vorzeichen ist die Richtung. Eine Mitte bei negativem $k$ heißt: Das Paket läuft nach links.`,
            R`$\Delta p$ ist die Standardabweichung selbst, nicht ihr Doppeltes.`, '']}},
      {id:'frei-t4e', title:R`Ein Faktor $e^{ik_0x}$ verschiebt den Impuls`,
        num:{title:'Im Fourier-Integral', text:R`Mit $e^{4ix}$ steht im Integral $e^{4ix}e^{-ikx} = e^{-i(k - 4)x}$. Das Integral ist dasselbe wie ohne den Faktor, nur an der Stelle $k - 4$: Aus $\varphi(k)$ wird $\varphi(k - 4)$.`},
        text:R`Multipliziere $\psi(x)$ mit $e^{ik_0x}$. Die Ortsdichte bleibt gleich, denn $|e^{ik_0x}| = 1$. Im Fourier-Integral wird aber $e^{-ikx}$ zu $e^{-i(k - k_0)x}$: Aus $\varphi(k)$ wird $\varphi(k - k_0)$. Die ganze Impulsverteilung rückt um $\hbar k_0$ nach oben. Eine ortsabhängige Phase trägt also Impuls. Ohne Bedeutung ist nur ein *konstanter* Faktor $e^{i\alpha}$. Umgekehrt gilt: Ist $\psi(x)$ reell, dann ist $\varphi(-k) = \varphi(k)^*$. Dann ist $|\varphi|^2$ symmetrisch, und $\langle p\rangle = 0$.`,
        q:{q:R`$\psi_1(x) = f(x)$ und $\psi_2(x) = f(x)\,e^{ik_0x}$ mit reellem $f$. Welche Aussage stimmt?`,
          opts:[R`gleiche Ortsverteilung und auch gleiche Impulsverteilung`, R`gleiche Ortsverteilung, Impulsverteilung um $\hbar k_0$ verschoben`, R`Ortsverteilung um $k_0$ verschoben, Impulsverteilung gleich`], a:1,
          ex:R`$|e^{ik_0x}| = 1$ lässt $|\psi|^2$ unverändert, verschiebt aber $\varphi(k)$ zu $\varphi(k - k_0)$.`,
          fb:[R`Nur eine *konstante* Phase ändert nichts. $e^{ik_0x}$ hängt von $x$ ab und verschiebt die Impulse.`, '',
            R`Eine Verschiebung im Ort wäre $f(x - x_0)$. Ein Phasenfaktor ändert $|\psi|^2$ nicht.`]}},
      {id:'frei-t4f', title:'Typischer Fehler: zwei Formeln, zwei Zustände?',
        num:{title:'Ein Zustand, zwei Formeln', text:R`$\psi(x) = e^{-|x|}$ ist normiert. Seine Transformierte ist $\varphi(k) = \sqrt{2/\pi}\,/(1 + k^2)$. Die Wahrscheinlichkeit für $|k| < 1$ ist ein Integral über $k$:

$$\int_{-1}^{1}|\varphi(k)|^2\,dk = \tfrac12 + \tfrac1\pi \approx 0{,}82.$$`},
        text:R`**Häufige Verwechslung:** „$\psi(x)$ und $\varphi(k)$ sind zwei verschiedene Zustände.“ Es ist derselbe Zustand in zwei Darstellungen. Aus $\psi$ folgt $\varphi$ und umgekehrt, ohne Informationsverlust. Vergleiche das mit einem Vektor, den du in zwei Koordinatensystemen angibst: andere Zahlen, derselbe Pfeil. Für die Ortsverteilung nimmst du $|\psi|^2$, für die Impulsverteilung $|\varphi|^2$. Wer eine Impulswahrscheinlichkeit mit $\int|\psi|^2dx$ ausrechnet, integriert in der falschen Darstellung. **Ausblick:** Thema 6 schreibt beides als Komponenten desselben Zustandsvektors.`,
        q:{q:R`$\psi(x) = e^{-|x|}$. Wie berechnest du die Wahrscheinlichkeit für $|p| < \hbar$?`,
          opts:[R`$\int_{-1}^{1}|\psi(x)|^2\,dx$, denn es ist derselbe Zustand`, R`$\int_{-1}^{1}|\varphi(k)|^2\,dk$ mit der Transformierten $\varphi$`, R`$|\varphi(1)|^2 - |\varphi(-1)|^2$`], a:1,
          ex:R`$|p| < \hbar$ heißt $|k| < 1$. Die Dichte für $k$ ist $|\varphi(k)|^2$.`,
          fb:[R`Derselbe Zustand, aber eine andere Messgröße. $\int_{-1}^1|\psi|^2dx$ ist die Wahrscheinlichkeit für $|x| < 1$.`, '',
            R`Wahrscheinlichkeiten sind Flächen unter $|\varphi|^2$, nicht Differenzen von Funktionswerten. Hier wäre die Differenz sogar null.`]}}
    ]},

    /* ===== Abschnitt 5: Phasen- und Gruppengeschwindigkeit ===== */
    {id:'frei-t5', title:'Phasen- und Gruppengeschwindigkeit', steps:[
      {id:'frei-t5a', title:'Wie schnell laufen die Wellenberge?',
        pre:{from:'m-komplex', seg:'mk-t4', title:'Ebene Welle und Zeitfaktor', text:R`Bei $e^{i(kx - \omega t)}$ bleibt die Phase $kx - \omega t$ konstant, wenn $x = (\omega/k)\,t + \text{const}$ ist. Ein Wellenberg läuft also mit $\omega/k$. Mini-Beispiel: $\cos(2x - 6t)$ läuft mit $3$ nach rechts.`},
        num:{title:'Ein Elektron mit 1 eV', text:R`$v_\mathrm{ph} = \omega/k = \hbar k/2m \approx 3{,}0\cdot10^5\,\mathrm{m/s}$. Klassisch hat das Elektron $v = p/m = \hbar k/m \approx 5{,}9\cdot10^5\,\mathrm{m/s}$, also doppelt so viel.`},
        text:R`Bei einer einzelnen ebenen Welle wandern die Wellenberge mit der [[lex:gruppengeschwindigkeit|Phasengeschwindigkeit]]

$$v_\mathrm{ph} = \frac{\omega}{k} = \frac{\hbar k}{2m}.$$

Das ist nur die **Hälfte** der klassischen Geschwindigkeit $v = p/m = \hbar k/m$. Ein Widerspruch? Nein. Bei einer ebenen Welle ist $|\Psi|^2$ überall gleich; da bewegt sich nichts Messbares. Die Berge von $\mathrm{Re}\,\Psi$ kann man nicht beobachten. Messbar wird eine Bewegung erst bei einem Paket: Man kann fragen, wo es sich befindet.`,
        q:{q:R`Mit welcher Geschwindigkeit laufen die Berge von $\cos(4x - 8t)$ ($\hbar = m = 1$)?`,
          opts:[R`$4$ nach rechts, die klassische Geschwindigkeit`, R`$2$ nach rechts`, R`$\tfrac12$ nach rechts`], a:1,
          ex:R`$\omega/k = 8/4 = 2$. Die klassische Geschwindigkeit $\hbar k/m = 4$ ist doppelt so groß.`,
          fb:[R`$4 = \hbar k/m$ ist die klassische Geschwindigkeit. Die Berge laufen mit $\omega/k$.`, '',
            R`$\tfrac12 = k/\omega$ ist der Kehrwert. Konstante Phase heißt $x = (\omega/k)\,t$.`]}},
      {id:'frei-t5b', title:'Zwei Wellen: Träger und Einhüllende',
        num:{title:'Wellenzahlen 3,8 und 4,2', text:R`Mit $\hbar = m = 1$ ist $\omega = k^2/2$, also $\omega_1 = 7{,}22$ und $\omega_2 = 8{,}82$. Dann ist $q = 0{,}2$ und $\Omega = 0{,}8$. Die Einhüllende läuft mit $\Omega/q = 4$, die Berge der Trägerwelle mit $\omega_m/k_m = 8{,}02/4 \approx 2{,}0$.`},
        text:R`Messbar ist die Lage der **Einhüllenden**. Die Herleitung zeigt sie an zwei Wellen mit $k_1$ und $k_2$. Ihre Summe ist ein Produkt: eine schnell schwingende Trägerwelle mit der mittleren Wellenzahl $k_m$ mal eine langsame Einhüllende $\cos(qx - \Omega t)$. Dabei ist $q = (k_2 - k_1)/2$ und $\Omega = (\omega_2 - \omega_1)/2$. Die Einhüllende läuft mit $\Omega/q = \Delta\omega/\Delta k$. Für $\omega = \hbar k^2/2m$ ist das genau die klassische Geschwindigkeit bei $k_m$.`,
        derive:{ctx:{coords:['x', 't'], params:{'k_1':'real', 'k_2':'real', m:'pos'}, defs:{'ω_1':'ħ k_1^2/(2m)', 'ω_2':'ħ k_2^2/(2m)', 'k_m':'(k_1 + k_2)/2', 'ω_m':'(ω_1 + ω_2)/2', q:'(k_2 - k_1)/2', 'Ω':'(ω_2 - ω_1)/2'}}, lines:[
          {l:'e^(i(k_1 x - ω_1 t)) + e^(i(k_2 x - ω_2 t)) = e^(i(k_m x - ω_m t)) (e^(-i(q x - Ω t)) + e^(i(q x - Ω t)))', w:'mittlere Phase ausgeklammert',
            why:{q:'Warum darf man $e^{i(k_mx - \\omega_mt)}$ ausklammern?', opts:['Weil $k_1 = k_m - q$, $k_2 = k_m + q$ und ebenso für $\\omega$ gilt.', 'Weil $k_1$ und $k_2$ fast gleich sind; es ist eine Näherung.', 'Weil die Schrödingergleichung linear ist.'], a:0, ex:'Die Zeile ist exakt, keine Näherung: $k_mx - qx = k_1x$ und $k_mx + qx = k_2x$.'}},
          {l:'= 2 e^(i(k_m x - ω_m t)) cos(q x - Ω t)', w:'e^{iu} + e^{−iu} = 2 cos u'},
          {l:'Ω/q = ħ (k_2^2 - k_1^2)/(2m (k_2 - k_1))', w:'Geschwindigkeit der Einhüllenden',
            why:{q:'Warum läuft die Einhüllende mit $\\Omega/q$?', opts:['Weil $\\cos(qx - \\Omega t)$ konstant ist, wenn $x = (\\Omega/q)\\,t$ + const.', 'Weil $\\Omega$ die größere der beiden Frequenzen ist.', 'Weil $q$ die mittlere Wellenzahl ist.'], a:0, ex:'Dieselbe Überlegung wie bei der Phasengeschwindigkeit, angewandt auf den Kosinus.'}},
          {l:'= ħ (k_1 + k_2)/(2m)', w:'k₂² − k₁² = (k₂ − k₁)(k₂ + k₁)'},
          {l:'= ħ k_m/m', w:'klassische Geschwindigkeit bei k_m',
            why:{q:'Wie schnell laufen dagegen die Wellenberge der Trägerwelle?', opts:['mit $\\omega_m/k_m$, für $k_1 \\approx k_2$ etwa $\\hbar k_m/2m$', 'ebenfalls mit $\\hbar k_m/m$', 'mit $\\Omega/q$, wie die Einhüllende'], a:0, ex:'$\\omega_m/k_m = \\hbar(k_1^2 + k_2^2)/(2m(k_1 + k_2))$; für $k_1 \\to k_2$ wird das $\\hbar k_m/2m = v_\\mathrm{ph}$.'}}
        ]},
        q:{q:R`Zwei Wellen mit $k_1 = 2$ und $k_2 = 4$ ($\hbar = m = 1$). Wie schnell läuft ihre Einhüllende?`,
          opts:[R`$\tfrac53$, so schnell wie die Trägerwelle`, R`$6$`, R`$3$`], a:2,
          ex:R`$\omega_1 = 2$, $\omega_2 = 8$, also $\Omega/q = 3/1 = 3 = k_m$.`,
          fb:[R`$\tfrac53 = \omega_m/k_m$ ist die Geschwindigkeit der Berge der Trägerwelle, nicht die der Einhüllenden.`,
            R`$6 = \omega_2 - \omega_1$. Geteilt werden muss durch $k_2 - k_1 = 2$.`, '']}},
      {id:'frei-t5c', title:'Viele Wellen: die Gruppengeschwindigkeit',
        pre:{from:'m-analysis', seg:'ma-t1', title:'Taylor-Entwicklung', text:R`Nahe einer Stelle $k_0$ ist $f(k) \approx f(k_0) + f'(k_0)(k - k_0) + \tfrac12f''(k_0)(k - k_0)^2$. Mini-Beispiel: $f(k) = k^2/2$ bei $k_0 = 4$ gibt $8 + 4(k - 4) + \tfrac12(k - 4)^2$ – hier sogar exakt.`},
        num:{title:'Das Paket des Labors', text:R`Mit $\omega = k^2/2$ und $k_0 = 4$ ist $v_\mathrm{g} = d\omega/dk = k_0 = 4$ und $v_\mathrm{ph} = \omega_0/k_0 = 8/4 = 2$. Nach $t = 1$ ist das Maximum also bei $x = 4$. Die Berge sind relativ zu ihm um $2$ zurückgefallen.`},
        text:R`Bei vielen Wellen nahe $k_0$ entwickelst du $\omega(k)$ nach [[lex:taylor|Taylor]] (M2): $\omega(k) \approx \omega_0 + v_\mathrm{g}\,(k - k_0)$. Im Wellenpaket bleibt dann

$$\Psi(x,t) \approx e^{i(k_0x - \omega_0t)}\,F(x - v_\mathrm{g}t),\qquad v_\mathrm{g} = \frac{d\omega}{dk}\bigg|_{k_0} = \frac{\hbar k_0}{m}.$$

Die Einhüllende $F$ hängt nur von $x - v_\mathrm{g}t$ ab: Sie läuft starr mit der **Gruppengeschwindigkeit**. Das ist die klassische Geschwindigkeit $p_0/m$. Erst der nächste Taylor-Term, $\frac12\omega''(k - k_0)^2$, verformt $F$ – das ist das Zerfließen in Abschnitt 6.`,
        q:{q:R`Für Licht im Vakuum ist $\omega = ck$. Was folgt für ein Lichtpaket?`,
          opts:[R`$v_\mathrm{g} = 2v_\mathrm{ph}$, wie beim Elektron`, R`$v_\mathrm{g} = v_\mathrm{ph} = c$; die Form bleibt erhalten`, R`$v_\mathrm{g} = c/2$, weil die Einhüllende nachhinkt`], a:1,
          ex:R`$d\omega/dk = c = \omega/k$. Bei linearer Dispersion ist $\omega'' = 0$: Alle Anteile laufen gleich schnell, das Paket zerfließt nicht.`,
          fb:[R`Der Faktor 2 kommt aus $\omega \propto k^2$. Bei $\omega = ck$ sind Ableitung und Quotient gleich.`, '',
            R`$d\omega/dk$ von $ck$ ist $c$. Nichts hinkt nach.`]}},
      {id:'frei-t5d', title:'Phasen- und Gruppengeschwindigkeit im Bild',
        num:{title:'Zwei Steigungen an einer Parabel', text:R`Zeichne $\omega = k^2/2$. Am Punkt $(4;\ 8)$ hat die Tangente die Steigung $\omega'(4) = 4 = v_\mathrm{g}$. Die Gerade vom Ursprung zum selben Punkt hat die Steigung $8/4 = 2 = v_\mathrm{ph}$.`},
        text:R`Beide Geschwindigkeiten stecken in der Dispersionsrelation. Du kannst sie direkt am Graphen von $\omega(k)$ ablesen. Die Phasengeschwindigkeit ist die Steigung der Geraden vom Ursprung zum Punkt, die Gruppengeschwindigkeit die Steigung der Tangente. Bei der Parabel ist die Tangente überall doppelt so steil wie diese Ursprungsgerade. Bei Licht im Vakuum ist $\omega(k)$ selbst eine Ursprungsgerade, und beide Steigungen fallen zusammen. Die Tafel führt von der Formel über das Bild bis ins Labor.`,
        reps:{obj:R`Phasen- und Gruppengeschwindigkeit bei $k_0 = 4$ ($\hbar = m = 1$)`,
          rows:[
            {k:'worte', text:R`Die Wellenberge laufen halb so schnell wie das Paket. Das Paket läuft so schnell wie ein klassisches Teilchen.`},
            {k:'formel', tex:R`v_\mathrm{ph} = \frac{\omega(k_0)}{k_0} = \frac{\hbar k_0}{2m} = 2,\qquad v_\mathrm{g} = \frac{d\omega}{dk}\bigg|_{k_0} = \frac{\hbar k_0}{m} = 4`},
            {k:'graph', plot:{x:[0, 6], y:[-1, 18], xlab:'k', ylab:R`\omega`}, f:k => k * k / 2, lab:R`\omega = k^2/2`, f2:k => 8 + 4 * (k - 4), lab2:R`\text{Tangente bei } k_0 = 4`,
              cap:R`Die gestrichelte Tangente bei $k_0 = 4$ hat die Steigung $4 = v_\mathrm{g}$. Eine Gerade vom Ursprung zum Punkt $(4;\ 8)$ hätte die Steigung $2 = v_\mathrm{ph}$.`},
            {k:'labor', text:R`Labor „Freies Gauß-Paket“ mit $k_0 = 4$: Das Maximum der dicken Kurve $|\psi|^2$ steht bei $t = 1$ bei $x = 4$. Die Berge der dünnen Kurve $\mathrm{Re}\,\psi$ wandern durch das Paket nach hinten.`},
            {k:'physik', text:R`Ein Detektor im Abstand $L$ registriert das Paket nach der Flugzeit $L/v_\mathrm{g}$. Die Phasengeschwindigkeit misst er nicht.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Wellenberge“ heißt konstante Phase: $\omega/k$. „Paket“ heißt Einhüllende: $d\omega/dk$.`},
            {from:'formel', to:'graph', rule:R`$\omega(k)$ zeichnen. $v_\mathrm{ph}$ ist die Steigung der Geraden vom Ursprung zum Punkt bei $k_0$, $v_\mathrm{g}$ die Steigung der Tangente dort.`},
            {from:'graph', to:'labor', rule:R`Mit der Tangentensteigung die Lage des Maximums vorhersagen, $x = v_\mathrm{g}\,t$. Dann im Labor $k_0$ und $t$ einstellen und vergleichen.`},
            {from:'labor', to:'physik', rule:R`Was im Labor mit dem Maximum der dicken Kurve wandert, kommt im Experiment am Detektor an.`}
          ]},
        q:{q:R`Bei einer anderen Welle ist $\omega(k)$ im Graphen eine Gerade, die nicht durch den Ursprung geht: $\omega = 2 + 3k$. Was gilt bei $k_0 = 1$?`, tr:{from:'graph', to:'formel'},
          opts:[R`$v_\mathrm{g} = v_\mathrm{ph} = 3$, weil der Graph eine Gerade ist`, R`$v_\mathrm{g} = 3$ und $v_\mathrm{ph} = 5$`, R`$v_\mathrm{g} = 5$ und $v_\mathrm{ph} = 3$`], a:1,
          ex:R`Tangente = die Gerade selbst, Steigung $3$. Die Ursprungsgerade zum Punkt $(1;\ 5)$ hat die Steigung $5$.`,
          fb:[R`Gleich wären beide nur bei einer Geraden durch den Ursprung. Hier ist $\omega(1)/1 = 5$.`, '',
            R`Vertauscht: Die Tangentensteigung $3$ ist $v_\mathrm{g}$, der Quotient $\omega/k = 5$ ist $v_\mathrm{ph}$.`]}},
      {id:'frei-t5e', title:'Im Labor: dicke und dünne Kurve',
        num:{title:R`$k_0 = 3$ und $t = 1$`, text:R`Mit $\hbar = m = 1$ ist $v_\mathrm{g} = 3$: Das Maximum von $|\psi|^2$ ist bei $t = 1$ bei $x = 3$. Die Berge von $\mathrm{Re}\,\psi$ laufen mit $v_\mathrm{ph} = 1{,}5$. Relativ zum Maximum fallen sie in dieser Zeit um $1{,}5$ zurück.`},
        text:R`So liest du das Labor als Formel. Die dicke Kurve ist $|\psi(x,t)|^2 = |F(x - v_\mathrm{g}t)|^2$. Ihr Maximum steht bei $x = \langle x\rangle = \hbar k_0t/m$; die Anzeige unter dem Bild nennt den Wert. Die dünne Kurve ist $\mathrm{Re}\,\psi$, die Trägerwelle mal Einhüllende. Ihr Abstand von Berg zu Berg ist ungefähr $2\pi/k_0$. Bewegst du den Zeitregler langsam, tauchen die Berge vorn im Paket auf. Sie wandern relativ zur Einhüllenden nach hinten und verschwinden dort.`,
        fig:{lab:'packet', init:{s0:0.5, k0:3, t:1}, keep:['Wellenzahl', 'Zeit'], caption:'Mit $k_0 = 3$ ist das Paket bis $t = 1$ um $\\hbar k_0t/m = 3$ gewandert ($\\hbar = m = 1$). Das Maximum von $|\\psi|^2$ (dick) läuft mit $v_\\mathrm{g}$, die Wellenberge von $\\mathrm{Re}\\,\\psi$ (dünn) halb so schnell.'},
        q:{q:R`Im Labor steht $k_0 = 2$. Zu welcher Zeit steht das Maximum der dicken Kurve bei $x = 5$?`, tr:{from:'labor', to:'formel'},
          opts:[R`bei $t = 5$, denn das Paket läuft mit $\hbar k_0/2m$`, R`bei $t = 2{,}5$`, R`bei $t = 10$`], a:1,
          ex:R`$\langle x\rangle = \hbar k_0t/m = 2t = 5$ gibt $t = 2{,}5$, das Ende des Zeitreglers.`,
          fb:[R`Mit $\hbar k_0/2m$ laufen die Berge der dünnen Kurve, nicht das Maximum der dicken.`, '',
            R`$t = 10$ entspräche einer Geschwindigkeit von $0{,}5$. Das Maximum läuft mit $v_\mathrm{g} = k_0 = 2$.`]}},
      {id:'frei-t5f', title:'Typischer Fehler: Das Teilchen läuft mit der Phasengeschwindigkeit',
        num:{title:'Ein anderer Energienullpunkt', text:R`Verschiebe alle Energien um $V_0$, hier mit $V_0/\hbar = 2$ ($\hbar = m = 1$). Bei $k = 4$ wird $\omega = 8 + 2 = 10$ und $v_\mathrm{ph} = 10/4 = 2{,}5$ statt $2$. Die Ableitung $d\omega/dk = 4$ ändert sich nicht.`},
        text:R`**Typische Fehlvorstellung:** „Das Teilchen bewegt sich mit der Phasengeschwindigkeit $\omega/k$.“ Die Phasengeschwindigkeit hat hier keine physikalische Bedeutung. Sie hängt sogar vom willkürlichen Energienullpunkt ab: Verschiebst du die Energie um eine Konstante $V_0$, ändert sich $\omega$ um $V_0/\hbar$ und damit $v_\mathrm{ph}$, aber nicht $v_\mathrm{g}$. Eine messbare Geschwindigkeit darf nicht von einer Konvention abhängen. Zur Kontrolle: Für $V = 0$ bewegt sich der Ortsmittelwert mit $\langle p\rangle/m$, exakt und für jedes Paket. **Ausblick:** Thema 6 begründet das mit dem Ehrenfest-Theorem.`,
        q:{q:R`Jemand misst die Flugzeit von Elektronen mit $1\,\mathrm{eV}$ und erhält $v \approx 5{,}9\cdot10^5\,\mathrm{m/s}$. Welche Geschwindigkeit hat er gemessen?`,
          opts:[R`die Phasengeschwindigkeit $\hbar k_0/2m$`, R`den Mittelwert $\tfrac12(v_\mathrm{g} + v_\mathrm{ph})$`, R`die Gruppengeschwindigkeit $\hbar k_0/m$`], a:2,
          ex:R`$\hbar k/m \approx 5{,}9\cdot10^5\,\mathrm{m/s}$ für $1\,\mathrm{eV}$. Die Flugzeit misst, wann das Paket ankommt, also seine Einhüllende.`,
          fb:[R`Die Phasengeschwindigkeit wäre mit $3{,}0\cdot10^5\,\mathrm{m/s}$ nur halb so groß – und man kann sie nicht messen.`,
            R`Einen solchen Mittelwert misst kein Detektor. Gemessen wird die Ankunft des Pakets.`, '']}}
    ]},

    /* ===== Abschnitt 6: Unschärfe und Zerfließen ===== */
    {id:'frei-t6', title:'Unschärfe und Zerfließen', steps:[
      {id:'frei-t6a', title:'Das Gauß-Paket: minimale Unschärfe',
        num:{title:'σ = 0,5', text:R`$\Delta x = \sigma = 0{,}5$ und $\Delta p = \hbar/(2\sigma) = \hbar$. Das Produkt ist $\Delta x\,\Delta p = 0{,}5\,\hbar = \hbar/2$. Für ein Elektron mit $\sigma = 0{,}1\,\mathrm{nm}$ ist $\Delta p = \hbar/(2\sigma) \approx 5{,}3\cdot10^{-25}\,\mathrm{kg\,m/s}$, also $\Delta v \approx 5{,}8\cdot10^5\,\mathrm{m/s}$.`},
        text:R`Das [[lex:gauss-paket|Gauß-Paket]] $\psi(x,0) = (2\pi\sigma^2)^{-1/4}e^{-x^2/4\sigma^2}e^{ik_0x}$ ist das wichtigste Beispiel. Es hat $\Delta x = \sigma$ und, wie die Herleitung in Abschnitt 4 gezeigt hat, $\Delta p = \hbar/(2\sigma)$. Das Produkt $\Delta x\,\Delta p = \hbar/2$ ist das kleinste, das die [[lex:unschaerfe|Unschärferelation]] aus Thema 1 erlaubt. Das Gauß-Paket ist deshalb ein Zustand **minimaler Unschärfe**. Jede andere Form hat ein größeres Produkt, zum Beispiel $e^{-|x|}$ mit $\Delta x\,\Delta k = 1/\sqrt2 \approx 0{,}71$.`,
        q:{q:R`Ein Gauß-Paket wird im Ort doppelt so breit präpariert. Was passiert mit $\Delta p$ und mit dem Produkt $\Delta x\,\Delta p$?`,
          opts:[R`$\Delta p$ halbiert sich, das Produkt bleibt $\hbar/2$.`, R`$\Delta p$ verdoppelt sich, das Produkt wird $2\hbar$.`, R`beide bleiben gleich, weil $\Delta p$ nicht von $\sigma$ abhängt`], a:0,
          ex:R`$\Delta p = \hbar/(2\sigma)$: doppeltes $\sigma$, halbes $\Delta p$. Das Produkt bleibt beim Minimum $\hbar/2$.`,
          fb:['', R`Breiter im Ort heißt schmaler im Impuls, nicht breiter.`,
            R`$\Delta p = \hbar/(2\sigma)$ hängt sehr wohl von $\sigma$ ab. Nur von $k_0$ hängt es nicht ab.`]}},
      {id:'frei-t6b', title:'Die Impulsverteilung bleibt, wie sie ist',
        num:{title:'Ein Phasenfaktor mit Betrag 1', text:R`Zur Zeit $t$ hat die Komponente bei $k$ den Wert $\varphi(k)\,e^{-i\omega(k)t}$. Ihr Betragsquadrat ist $|\varphi(k)|^2\cdot|e^{-i\omega t}|^2 = |\varphi(k)|^2$. Für $k = 4$ und $t = 1$ ($\hbar = m = 1$) ist der Faktor $e^{-8i}$, sein Betrag $1$.`},
        text:R`Was passiert mit der Zeit? Beim freien Teilchen bekommt jede Impulskomponente nur einen Phasenfaktor $e^{-i\omega(k)t}$, und dessen Betrag ist $1$. Deshalb ändert sich $|\varphi(k)|^2$ nicht: $\langle p\rangle$ und $\Delta p$ bleiben für alle Zeiten konstant. Das passt zur klassischen Erwartung, denn ohne Kraft ändert sich kein Impuls. Was sich ändert, sind die relativen Phasen zwischen den Komponenten. Von ihnen hängt ab, wie die Wellen im Ort interferieren. Die Ortsverteilung kann sich also stark ändern, obwohl die Impulsverteilung gleich bleibt.`,
        q:{q:R`Wie ändert sich $\Delta p$ eines freien Wellenpakets mit der Zeit?`,
          opts:[R`Es wächst wie $\Delta x$.`, R`Es nimmt ab, weil sich das Paket ausbreitet.`, R`gar nicht`], a:2,
          ex:R`$\hat H = \hat p^2/2m$ enthält nur $\hat p$: Jede Impulskomponente bekommt nur einen Phasenfaktor, und $|\varphi(k)|^2$ bleibt gleich.`,
          fb:[R`$\Delta x$ wächst, $\Delta p$ nicht. Die Impulsverteilung ändert sich beim freien Teilchen nie.`,
            R`Die Ausbreitung im Ort ist gerade eine Folge des *unveränderten* $\Delta p$: Die Anteile laufen auseinander.`, '']}},
      {id:'frei-t6c', title:'Das Paket zerfließt',
        pre:{from:'m-analysis', seg:'ma-t3', title:'Gauß-Integral mit linearem Term', text:R`$\int_{-\infty}^{\infty}e^{-\alpha k^2 + bk}\,dk = \sqrt{\pi/\alpha}\;e^{b^2/(4\alpha)}$. Das gilt auch für komplexes $b$ und für komplexes $\alpha$ mit $\mathrm{Re}\,\alpha > 0$. Mini-Beispiel: $\alpha = 1$, $b = 2i$ gibt $\sqrt\pi\,e^{-1}$.`},
        num:{title:'σ = 0,5 nach t = 1', text:R`Mit $\hbar = m = 1$ ist $\alpha = \sigma^2 + it/2 = 0{,}25 + 0{,}5i$, also $|\alpha| \approx 0{,}559$ und $s = |\alpha|/\sigma \approx 1{,}118$. Die Formel unten gibt dasselbe:

$$\Delta x(1) = 0{,}5\sqrt{1 + \left(\frac{1}{2\cdot0{,}25}\right)^2} = 0{,}5\sqrt5 \approx 1{,}12.$$`},
        text:R`Für die Ortsverteilung setzt du $\varphi(k)$ ins Wellenpaket ein. Das Integral ist wieder ein Gauß-Integral, jetzt mit komplexem $\alpha = \sigma^2 + i\hbar t/2m$. Die Herleitung führt es für $k_0 = 0$ aus. Ergebnis: $|\Psi(x,t)|^2$ ist eine Gauß-Kurve mit der Breite

$$\Delta x(t) = \sigma\sqrt{1 + \left(\frac{\hbar t}{2m\sigma^2}\right)^2}.$$

Das Paket **zerfließt**. Der Imaginärteil von $\alpha$ kommt allein aus dem Zeitfaktor $e^{-i\hbar k^2t/2m}$. Wäre $\omega$ linear in $k$, gäbe es ihn nicht – und kein Zerfließen.`,
        derive:{ctx:{coords:['x', 't'], params:{σ:'pos', m:'pos'}, defs:{'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)', 'α':'σ^2 + iħ t/(2m)', s:'σ sqrt(1 + (ħ t/(2m σ^2))^2)'}}, lines:[
          {l:'Ψ = 1/sqrt(2π) ∫_-∞^∞ φ(k) e^(i k x - iħ k^2 t/(2m)) dk', w:'Wellenpaket mit ω = ħk²/2m, φ aus dem Beispiel'},
          {l:'= 1/sqrt(2π) (2σ^2/π)^(1/4) ∫_-∞^∞ e^(-α k^2 + i x k) dk', w:'Exponenten zusammengefasst, α = σ² + iħt/2m',
            why:{q:'Woher kommt der Imaginärteil von $\\alpha$?', opts:['aus dem Zeitfaktor $e^{-i\\hbar k^2t/2m}$', 'aus dem Ortsfaktor $e^{ikx}$ im Integranden', 'aus dem Vorfaktor $(2\\sigma^2/\\pi)^{1/4}$ von $\\varphi$'], a:0, ex:'$-\\sigma^2k^2 - i\\hbar k^2t/2m = -\\alpha k^2$. Wäre $\\omega$ linear in $k$, käme kein Imaginärteil dazu – und kein Zerfließen.'}},
          {l:'= 1/sqrt(2π) (2σ^2/π)^(1/4) sqrt(π/α) e^(-x^2/(4α))', w:'Gauß-Integral mit b = ix, gilt auch für komplexes α mit Re α > 0'},
          {l:'|Ψ|^2 = 1/(sqrt(2π) s) e^(-x^2/(2 s^2))', w:'Betragsquadrat: |α| = σ s',
            why:{q:'Was ist $s$ in dieser Zeile?', opts:['die Breite $\\Delta x(t)$ der Gauß-Kurve', 'die Lage des Maximums zur Zeit $t$', 'die mittlere Wellenzahl des Pakets'], a:0, ex:'Eine Dichte $\\frac{1}{\\sqrt{2\\pi}s}e^{-x^2/2s^2}$ hat die Standardabweichung $s$. Hier ist $s = \\Delta x(t)$.'}},
          {l:'s^2 = σ^2 + (ħ/(2σ))^2 t^2/m^2', w:'Δx(t)² = σ² + (Δp t/m)²',
            why:{q:'Wie deutest du die Summe $\\sigma^2 + (\\Delta p\\,t/m)^2$?', opts:['Anfangsbreite plus Auseinanderlaufen der Impulsanteile', 'die Breite in $x$ plus die Breite in $k$, jeweils quadriert', 'eine Näherung, die nur für kleine Zeiten $t$ gültig ist'], a:0, ex:'Die Formel ist exakt. Der zweite Term ist die Strecke, um die sich Anteile mit Geschwindigkeitsunterschied $\\Delta p/m$ in der Zeit $t$ trennen.'}}
        ]},
        q:{q:R`Wie breit ist ein Gauß-Paket mit $\sigma = 1$ zur Zeit $t = 2$ ($\hbar = m = 1$)?`,
          opts:[R`$2$, denn $\sigma + \Delta p\,t/m = 1 + 1$`, R`$\sqrt2 \approx 1{,}41$`, R`$\sqrt5 \approx 2{,}24$`], a:1,
          ex:R`$\Delta x = 1\cdot\sqrt{1 + (2/2)^2} = \sqrt2$. Die Beiträge addieren sich quadratisch.`,
          fb:[R`Die Breiten addieren sich nicht einfach, sondern im Quadrat: $\sqrt{\sigma^2 + (\Delta p\,t/m)^2}$.`, '',
            R`$\sqrt5$ wäre richtig für $\sigma = 0{,}5$ und $t = 1$. Hier ist $\hbar t/(2m\sigma^2) = 1$.`]}},
      {id:'frei-t6d', title:'Anfangsbreite plus Auseinanderlaufen',
        num:{title:'Die Summe der Quadrate', text:R`Im Beispiel mit $\sigma = 0{,}5$, $\Delta p = 1$ und $t = 1$: $\sigma^2 + (\Delta p\,t/m)^2 = 0{,}25 + 1 = 1{,}25$, also $\Delta x = \sqrt{1{,}25} \approx 1{,}12$. Die Zeitskala ist $t_0 = 2m\sigma^2/\hbar = 0{,}5$. Bei $t = t_0$ ist $\Delta x = \sqrt2\cdot0{,}5 \approx 0{,}71$.`},
        text:R`Quadriert heißt die Formel $\Delta x(t)^2 = \sigma^2 + (\Delta p\,t/m)^2$. Zur Anfangsbreite kommt die Strecke, um die die Impulsanteile in der Zeit $t$ auseinanderlaufen. Für große $t$ wächst $\Delta x \approx \Delta p\,t/m$ linear. Ein anfangs schmales Paket zerfließt schneller, weil es mehr verschiedene Impulse enthält. Die Zeitskala ist $t_0 = 2m\sigma^2/\hbar$: Für $t \ll t_0$ ändert sich $\Delta x$ kaum, für $t \gg t_0$ wächst es linear. Eine Wolke klassischer Teilchen mit derselben Streuung liefe genauso auseinander. Quantenmechanisch neu ist: Die Streuung $\Delta p \ge \hbar/(2\Delta x)$ ist unvermeidlich.`,
        q:{q:R`Zwei Gauß-Pakete starten mit $\sigma_A = 1\,\mathrm{nm}$ und $\sigma_B = 2\,\mathrm{nm}$ (gleiche Masse). Welches ist nach langer Zeit breiter?`,
          opts:[R`A, das anfangs schmalere`, R`B, das anfangs breitere`, R`beide gleich, weil die Masse gleich ist`], a:0,
          ex:R`Für große $t$ ist $\Delta x \approx \hbar t/(2m\sigma)$: Das anfangs schmalere Paket hat das größere $\Delta p$.`,
          fb:['', R`B ist anfangs breiter, enthält aber weniger verschiedene Impulse. Nach langer Zeit zählt nur noch $\Delta p\,t/m$.`,
            R`Die Masse ist gleich, aber $\Delta p = \hbar/(2\sigma)$ nicht.`]}},
      {id:'frei-t6e', title:'Zerfließen in Formel, Bild und Labor',
        num:{title:'Höhe und Fläche', text:R`Eine Gauß-Kurve mit Fläche $1$ und Standardabweichung $s$ hat das Maximum $1/(s\sqrt{2\pi})$. Für $s = 0{,}5$ ist es $0{,}80$, für $s = 1{,}12$ nur $0{,}36$. Die Kurve wird breiter **und** niedriger; die Fläche bleibt $1$.`},
        text:R`Die Tafel verbindet die Formel für $\Delta x(t)$ mit dem Bild und mit dem Labor. Im Bild siehst du dasselbe Paket zweimal. Es läuft mit $v_\mathrm{g} = 4$ nach rechts und wird dabei breiter. Weil die Fläche unter $|\Psi|^2$ immer $1$ bleibt, muss das Maximum sinken. Breite und Höhe hängen also zusammen: Ihr Produkt bleibt fest. Im Labor stellst du dieselben Zahlen ein und liest $\Delta x(t)$ in der Anzeige unter dem Bild ab.`,
        reps:{obj:R`Das Paket mit $\sigma = 0{,}5$ und $k_0 = 4$ bei $t = 0$ und $t = 1$ ($\hbar = m = 1$)`,
          rows:[
            {k:'worte', text:R`Das Paket fliegt nach rechts, wird breiter und flacher. Die Wahrscheinlichkeit, es irgendwo zu finden, bleibt $1$.`},
            {k:'formel', tex:R`\Delta x(t) = \sigma\sqrt{1 + \left(\frac{\hbar t}{2m\sigma^2}\right)^2},\qquad \langle x\rangle(t) = \frac{\hbar k_0}{m}\,t`},
            {k:'graph', plot:{x:[-2, 8], y:[-0.05, 0.9], xlab:'x', ylab:R`|\Psi(x,t)|^2`}, f:FREI_G.gN(0, 0.5), lab:'t = 0', f2:FREI_G.gN(4, 0.5 * Math.sqrt(5)), lab2:'t = 1',
              cap:R`Durchgezogen $t = 0$: Mitte $0$, Breite $0{,}5$, Höhe $0{,}80$. Gestrichelt $t = 1$: Mitte $4$, Breite $1{,}12$, Höhe $0{,}36$.`},
            {k:'labor', text:R`Regler „Anfangsbreite σ₀“ auf $0{,}5$, „Wellenzahl k₀“ auf $4$, „Zeit t“ von $0$ auf $1$. Die Anzeige nennt dann $\Delta x(t) = 1{,}12$ und $\langle x\rangle = 4{,}00$.`},
            {k:'physik', text:R`Nach langer Flugzeit ist der Ort fast nur noch durch den Impuls bestimmt, $x \approx p\,t/m$. Dann bildet $|\Psi|^2$ die Impulsverteilung ab – so misst man sie bei kalten Atomen.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Fliegt nach rechts“ ist $\langle x\rangle = v_\mathrm{g}t$, „wird breiter“ ist $\Delta x(t)$.`},
            {from:'formel', to:'graph', rule:R`Zu jeder Zeit eine Gauß-Kurve mit Mitte $\langle x\rangle(t)$ und Standardabweichung $\Delta x(t)$ zeichnen, Höhe $1/(\Delta x\sqrt{2\pi})$.`},
            {from:'graph', to:'labor', rule:R`Dieselben Werte im Labor einstellen. Die dicke Kurve ist $|\Psi|^2$, die Anzeige rechnet die Formel aus.`},
            {from:'labor', to:'physik', rule:R`Den Zeitregler weit aufziehen: Die Breite wächst dann linear, $\Delta x \approx \Delta p\,t/m$, und misst so die Impulsstreuung.`}
          ]},
        q:{q:R`Im Labor zeigt die Anzeige bei $\sigma_0 = 0{,}5$ und $t = 2$ die Breite $\Delta x \approx 2{,}06$. Was zeigt sie bei $\sigma_0 = 1{,}0$ und $t = 2$?`, tr:{from:'labor', to:'formel'},
          opts:[R`etwa $4{,}12$, doppelt so viel`, R`etwa $1{,}03$, halb so viel`, R`etwa $1{,}41$`], a:2,
          ex:R`$\Delta x = 1{,}0\cdot\sqrt{1 + (2/2)^2} = \sqrt2 \approx 1{,}41$. Das breitere Paket zerfließt viel langsamer.`,
          fb:[R`Die Breite ist nicht proportional zu $\sigma_0$. Mit größerem $\sigma_0$ wird der Zerfließ-Term $\hbar t/(2m\sigma_0^2)$ kleiner.`,
            R`$\Delta x(t)$ kann nie kleiner als $\sigma_0 = 1{,}0$ werden. Setz in die Formel ein.`, '']}},
      {id:'frei-t6f', title:'Typischer Fehler: Das Elektron wird größer',
        num:{title:'Ein Elektron, auf 0,1 nm genau', text:R`Für $\sigma = 0{,}1\,\mathrm{nm}$ ist $t_0 = 2m\sigma^2/\hbar \approx 1{,}7\cdot10^{-16}\,\mathrm s$. Doppelt so breit ($\Delta x = 2\sigma$) ist das Paket bei $t = \sqrt3\,t_0 \approx 3\cdot10^{-16}\,\mathrm s$. Nach $1\,\mathrm{ns}$ ist $\Delta x \approx \Delta p\,t/m \approx 0{,}6\,\mathrm{mm}$.`},
        text:R`**Typische Fehlvorstellungen.** „Das Elektron wird größer“: $|\Psi|^2$ ist eine Verteilung von Messergebnissen. Jede Ortsmessung findet das Elektron an einer Stelle (Thema 1); breiter wird nur die Streuung dieser Stellen. „Zerfließen verletzt die Normierung“: Die Fläche unter $|\Psi|^2$ bleibt $1$; die Kurve wird breiter und niedriger. Im Labor siehst du beides an der dicken Kurve, also an $|\Psi|^2$: Das Paket mit $\sigma_0 = 0{,}3$ ist bei $t = 2{,}5$ über zehnmal so breit wie am Anfang und entsprechend niedriger. Mit $\sigma_0 = 1{,}0$ ist es zur selben Zeit schmaler – trotz größerer Anfangsbreite.`,
        fig:{lab:'packet', init:{s0:0.3, k0:0, t:2.5}, keep:['Anfangsbreite'], caption:'Das Paket startete mit $\\sigma_0 = 0{,}3$ und ist bei $t = 2{,}5$ schon über zehnmal so breit. Stelle $\\sigma_0 = 1{,}0$ ein: Das anfangs breitere Paket ist jetzt schmaler. Die Fläche unter $|\\psi|^2$ bleibt $1$. Die Höhenachse richtet sich nach der Anfangsspitze; vergleiche Höhen an den Achsenwerten.'},
        q:{q:R`Ein Gauß-Paket zerfließt. Was gilt für die Fläche unter $|\Psi(x,t)|^2$ und die Höhe des Maximums?`,
          opts:[R`Fläche wächst wie $\Delta x(t)$, Maximum bleibt`, R`Fläche bleibt $1$, Maximum sinkt wie $1/\Delta x(t)$`, R`beide bleiben gleich, nur die Form ändert sich`], a:1,
          ex:R`Die Normierung bleibt erhalten (Thema 1). Eine breitere Gauß-Kurve mit Fläche $1$ muss niedriger sein: Maximum $1/(\sqrt{2\pi}\,\Delta x)$.`,
          fb:[R`Die Fläche ist die Gesamtwahrscheinlichkeit. Sie bleibt nach Thema 1 für alle Zeiten $1$.`, '',
            R`Breiter bei gleicher Fläche geht nur, wenn das Maximum sinkt.`]}},
      {id:'frei-t6g', title:'Warum man das Zerfließen im Alltag nicht sieht',
        num:{title:'Ein Staubkorn', text:R`Masse $10^{-15}\,\mathrm{kg}$, $\sigma = 1\,\mu\mathrm m$: $t_0 = 2m\sigma^2/\hbar \approx 1{,}9\cdot10^{7}\,\mathrm s$. Doppelt so breit ist das Paket nach $\sqrt3\,t_0 \approx 3{,}3\cdot10^7\,\mathrm s$, also nach rund einem Jahr.`},
        text:R`Die Zeitskala $t_0 = 2m\sigma^2/\hbar$ wächst mit der Masse und mit dem Quadrat der Anfangsbreite. Für ein Elektron, das auf ein Atom genau lokalisiert ist, sind das Bruchteile einer Femtosekunde. Für ein Staubkorn ist es ein Jahr, für einen Tennisball unvorstellbar lang. Deshalb sieht man das Zerfließen im Alltag nicht. Die Schrödingergleichung gilt für schwere Körper genauso. Nur ist bei ihnen $\Delta p/m$ so klein, dass sich die Impulsanteile praktisch nicht trennen.`,
        q:{q:R`Warum ist das Zerfließen bei einem Staubkorn praktisch unsichtbar?`,
          opts:[R`Für schwere Körper gilt die Schrödingergleichung nicht.`, R`Ein Staubkorn hat $\Delta p = 0$, also keine Impulsunschärfe.`, R`Die große Masse macht $\Delta p/m$ winzig.`], a:2,
          ex:R`$\Delta x$ wächst wie $\hbar t/(2m\sigma)$. Bei $m = 10^{-15}\,\mathrm{kg}$ dauert die Verdopplung etwa ein Jahr.`,
          fb:[R`Die Gleichung gilt für alle Massen. Nur werden die Effekte für große $m$ sehr langsam.`,
            R`Auch ein Staubkorn hat $\Delta p \ge \hbar/(2\Delta x)$. Geteilt durch die große Masse ist die Geschwindigkeitsstreuung aber winzig.`, '']}}
    ]}
  ],
  example:{
    title:'Impulsraum-Wellenfunktion des Gauß-Pakets',
    text:'Das Gauß-Paket $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}$ hat $\\Delta x = \\sigma$. Berechne $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$ mit der Formel $\\int e^{-\\alpha x^2 + bx}dx = \\sqrt{\\pi/\\alpha}\\,e^{b^2/(4\\alpha)}$.',
    ctx:{coords:['k'], params:{σ:'pos'}, defs:{'ψ(x)':'(2πσ^2)^(-1/4) e^(-x^2/(4σ^2))', 'φ(k)':'1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-i k x) dx'}},
    lines:[
      {l:'φ(k) = 1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-ikx) dx', why:{q:'Was ist $\\varphi(k)$?', opts:['die Wellenfunktion im Impulsraum ($p = \\hbar k$)', 'die Ableitung von $\\psi$ nach $x$', 'die Wahrscheinlichkeit für den Ort $x = k$'], a:0, ex:'$|\\varphi(k)|^2dk$ ist die Wahrscheinlichkeit für Wellenzahlen in $[k, k + dk]$.'}},
      {l:'= (2πσ^2)^(-1/4)/sqrt(2π) ∫_-∞^∞ e^(-x^2/(4σ^2) - ikx) dx', why:{q:'Was wurde gemacht?', opts:['$\\psi$ eingesetzt, Exponenten zusammengefasst', 'partiell integriert, Randterm weggelassen', 'nach $k$ abgeleitet und $x = 0$ gesetzt'], a:0, ex:'$e^ae^b = e^{a+b}$; der Vorfaktor von $\\psi$ steht vor dem Integral.'}},
      {l:'= (2πσ^2)^(-1/4)/sqrt(2π) · sqrt(4πσ^2) e^(-σ^2 k^2)', why:{q:'Welche Werte haben $\\alpha$ und $b$?', opts:['$\\alpha = 1/(4\\sigma^2)$, $b = -ik$', '$\\alpha = \\sigma^2$, $b = k$', '$\\alpha = 4\\sigma^2$, $b = ik$'], a:0, ex:'$b^2/(4\\alpha) = (-ik)^2\\sigma^2 = -k^2\\sigma^2$ und $\\sqrt{\\pi/\\alpha} = \\sqrt{4\\pi\\sigma^2}$.'}},
      {l:'= (2σ^2/π)^(1/4) e^(-σ^2 k^2)', why:{q:'Was sieht man am Ergebnis?', opts:['wieder eine Gauß-Kurve, umso schmaler, je breiter $\\psi$ ist', 'wieder eine Gauß-Kurve, umso breiter, je breiter $\\psi$ ist', 'eine Gauß-Kurve, deren Breite nicht von $\\sigma$ abhängt'], a:0, ex:'Breite in $x$: $\\sigma$; in $k$: $\\propto 1/\\sigma$. Das ist die Unschärfe in Formeln.'}}
    ],
    faded:{id:'frei-fade', title:'Jetzt du: Impulsunschärfe aus φ(k)',
      text:'Mit $\\varphi(k) = (2\\sigma^2/\\pi)^{1/4}e^{-\\sigma^2k^2}$ ist $\\langle k\\rangle = 0$. Berechne $\\Delta p = \\hbar\\sqrt{\\langle k^2\\rangle}$. Nützlich: $\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$.',
      ctx:{coords:['k'], space:['k'], params:{σ:'pos'}, defs:{'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)'}, state:'φ', normalized:true},
      given:['⟨k^2⟩ = ∫_-∞^∞ k^2 |φ(k)|^2 dk', '= sqrt(2σ^2/π) ∫_-∞^∞ k^2 e^(-2σ^2 k^2) dk'],
      goals:[{id:'a', prompt:'Bestimme $\\langle k^2\\rangle$ und dann $\\Delta p$.', type:'value', target:'ħ/(2σ)', points:3,
        hints:['Das Integral hat die Form $\\int k^2e^{-\\alpha k^2}dk$ – benutze die angegebene Formel.', 'Hier ist $\\alpha = 2\\sigma^2$.', 'Es kommt $\\langle k^2\\rangle = 1/(4\\sigma^2)$ heraus; dann $\\Delta p = \\hbar\\sqrt{\\langle k^2\\rangle}$.'],
        model:['⟨k^2⟩ = ∫_-∞^∞ k^2 |φ(k)|^2 dk', '= sqrt(2σ^2/π) ∫_-∞^∞ k^2 e^(-2σ^2 k^2) dk', {l:'= sqrt(2σ^2/π) · 1/(4σ^2) sqrt(π/(2σ^2))', gap:'= sqrt(2σ^2/π) · ▢'}, '= 1/(4σ^2)', 'ħ sqrt(⟨k^2⟩) = ħ/(2σ)'],
        note:'Mit $\\Delta x = \\sigma$ folgt $\\Delta x\\,\\Delta p = \\hbar/2$ – das Minimum der Unschärferelation.'}]}
  },
  puzzle:{
    title:'Ein Paket, das erst schmaler wird',
    text:'Ein freies Teilchen ($V = 0$) startet im Zustand\n\n$$\\psi(x,0) = (2\\pi\\sigma^2)^{-1/4}\\,e^{-x^2/(4\\sigma^2)}\\,e^{-i\\beta x^2}\\qquad(\\beta > 0).$$\n\nDie Ortsdichte $|\\psi(x,0)|^2$ ist dieselbe wie beim gewöhnlichen Gauß-Paket, also $\\Delta x(0) = \\sigma$. Nur die Phase hängt jetzt quadratisch von $x$ ab.\n\nWie verhält sich $\\Delta x(t)$ für $t > 0$? Tipp: Welche lokale Wellenzahl $k(x) = \\frac{d}{dx}(\\text{Phase})$ hat das Paket links und rechts der Mitte?',
    q:{q:'Deine Vermutung:', opts:['$\\Delta x$ wächst sofort, wie bei jedem freien Gauß-Paket', '$\\Delta x$ nimmt erst ab und wächst dann', '$\\Delta x$ bleibt $\\sigma$, weil $|\\psi(x,0)|^2$ dasselbe ist', '$\\Delta x$ nimmt für immer ab'], a:1, ex:'Die Phase $-\\beta x^2$ gibt rechts der Mitte Impulse nach links und links der Mitte Impulse nach rechts: Das Paket läuft zunächst zusammen.'},
    reveal:'Die lokale Wellenzahl ist $k(x) = \\frac{d}{dx}(-\\beta x^2) = -2\\beta x$: Rechts der Mitte zeigen die Impulse nach links, links der Mitte nach rechts. Das Paket läuft zusammen, ähnlich wie Licht hinter einer Sammellinse.\n\nDie Rechnung geht wie im Abschnitt zum Zerfließen. Schreibt man $\\psi(x,0) \\propto e^{-x^2/(4\\alpha_0)}$ mit komplexem $\\alpha_0$, dann ist $\\psi(x,t) \\propto e^{-x^2/(4\\alpha(t))}$ mit $\\alpha(t) = \\alpha_0 + \\frac{i\\hbar t}{2m}$ und $\\Delta x(t)^2 = |\\alpha(t)|^2/\\mathrm{Re}\\,\\alpha_0$. Hier ist $\\frac{1}{\\alpha_0} = \\frac{1}{\\sigma^2} + 4i\\beta$. Ergebnis:\n\n- Am schmalsten ist das Paket zur Zeit $t^* = \\frac{8m\\beta\\sigma^4}{\\hbar(1 + 16\\beta^2\\sigma^4)}$, mit $\\Delta x_{\\min} = \\frac{\\sigma}{\\sqrt{1 + 16\\beta^2\\sigma^4}} < \\sigma$.\n- Danach zerfließt es wie gewohnt.\n- Die Impulsverteilung bleibt konstant, mit $\\Delta p = \\hbar\\sqrt{\\frac{1}{4\\sigma^2} + 4\\beta^2\\sigma^2} > \\frac{\\hbar}{2\\sigma}$. Am Anfang ist also $\\Delta x\\,\\Delta p > \\hbar/2$; an der schmalsten Stelle gilt $\\Delta x_{\\min}\\,\\Delta p = \\hbar/2$.\n\nLehre: $|\\psi|^2$ allein legt die Zukunft nicht fest; die Phase gehört zum Zustand. Ein gewöhnliches Gauß-Paket bekommt beim Zerfließen selbst eine Phase $\\propto +x^2$: Seine Anteile laufen nach außen. Ein Paket mit $e^{-i\\beta x^2}$ ist gewissermaßen der rückwärts laufende Film davon.'
  },
  clarify:{
    core:'Für $V = 0$ lösen ebene Wellen $e^{i(kx - \\omega t)}$ mit $\\omega = \\hbar k^2/(2m)$ die Schrödingergleichung. Sie sind Impulseigenfunktionen ($p = \\hbar k$), aber **nicht normierbar**, also keine physikalischen Zustände.\n\nPhysikalisch sind Wellenpakete:\n\n$$\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\int\\varphi(k)\\,e^{i(kx - \\hbar k^2t/2m)}\\,dk,\\qquad \\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\Psi(x,0)e^{-ikx}dx.$$\n\n$|\\varphi(k)|^2$ ist die Verteilung der Wellenzahlen; beim freien Teilchen ändert sie sich nicht. Das Maximum des Pakets bewegt sich mit $v_\\mathrm{g} = d\\omega/dk = \\hbar k_0/m$. Das Gauß-Paket mit $\\Delta x(0) = \\sigma$ hat $\\Delta p = \\hbar/(2\\sigma)$ (minimale Unschärfe). Es zerfließt wie $\\Delta x(t) = \\sigma\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma^2}\\right)^2}$.',
    keys:[
      '$v_\\mathrm{g} = 2v_\\mathrm{ph}$ für ein freies nichtrelativistisches Teilchen.',
      'Ein Faktor $e^{ik_0x}$ verschiebt $\\varphi(k)$ um $k_0$: Er gibt dem Paket den mittleren Impuls $\\hbar k_0$, ändert aber $|\\psi(x)|^2$ nicht.',
      '$\\Delta p$ bleibt beim freien Teilchen konstant; nur $\\Delta x$ wächst.',
      'Je schmaler das Paket anfangs ist, desto schneller zerfließt es: für große $t$ ist $\\Delta x \\approx \\Delta p\\,t/m = \\frac{\\hbar t}{2m\\sigma}$.',
      'Parseval: $\\int|\\varphi|^2dk = \\int|\\psi|^2dx$. Ist $\\psi$ normiert, dann auch $\\varphi$.'
    ],
    errors:[
      'Die Phasengeschwindigkeit $\\omega/k$ für die Geschwindigkeit des Teilchens halten.',
      'Beim Fourier-Integral das Vorzeichen in $(-ik)^2 = -k^2$ falsch nehmen.',
      'Eine ebene Welle wie ein normiertes $\\psi$ behandeln und $\\int|e^{ikx}|^2dx = 1$ ansetzen.',
      'Glauben, das Zerfließen verletze die Normierung: Die Fläche unter $|\\psi|^2$ bleibt $1$.'
    ],
    checks:[
      {q:'Was ändert der Faktor $e^{ik_0x}$ an $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/4\\sigma^2}$?', opts:['$\\langle p\\rangle$ wird $\\hbar k_0$, $|\\psi|^2$ bleibt gleich.', '$|\\psi|^2$ wird um $k_0$ verschoben, $\\langle p\\rangle$ bleibt.', 'Nichts Messbares, es ist nur eine Phase.'], a:0, ex:'$|e^{ik_0x}| = 1$, aber $\\varphi(k)$ wird um $k_0$ verschoben. Ohne Bedeutung ist nur eine konstante Phase.'},
      {q:'Zwei Gauß-Pakete starten mit $\\sigma_A = 1\\,\\mathrm{nm}$ und $\\sigma_B = 2\\,\\mathrm{nm}$ (gleiche Masse). Welches ist nach langer Zeit breiter?', opts:['A', 'B', 'beide gleich'], a:0, ex:'Für große $t$ ist $\\Delta x \\approx \\hbar t/(2m\\sigma)$: das anfangs schmalere Paket hat das größere $\\Delta p$.'}
    ]
  },
  lab:{type:'packet', sketch:SK.lab, title:'Freies Gauß-Paket',
    map:[
      {sym:R`\sigma_0`, ctl:'Anfangsbreite σ₀', says:R`Die Breite $\Delta x(0) = \sigma_0$ des Anfangspakets $\psi(x,0) \propto e^{-x^2/4\sigma_0^2}e^{ik_0x}$. Kleineres $\sigma_0$ heißt größeres $\Delta p = \hbar/(2\sigma_0)$: Das Paket zerfließt schneller.`},
      {sym:R`k_0`, ctl:'Wellenzahl k₀', says:R`Die Mitte des Spektrums $|\varphi(k)|^2$, also $\langle p\rangle = \hbar k_0$. Im Bild ist der Abstand der Berge von $\mathrm{Re}\,\psi$ etwa $2\pi/k_0$, und das Maximum läuft mit $v_\mathrm{g} = \hbar k_0/m$. Bei $k_0 = 0$ bleibt das Paket stehen und zerfließt nur.`},
      {sym:R`t`, ctl:'Zeit t', says:R`Die Zeit im Phasenfaktor $e^{-i\omega(k)t}$ jeder Komponente. Mit wachsendem $t$ wandert $\langle x\rangle = \hbar k_0t/m$, und $\Delta x(t)$ wächst.`},
      {sym:R`|\psi(x,t)|^2`, ctl:'|ψ|² (dick)', says:R`Die dicke Kurve: die Ortsdichte, eine Gauß-Kurve mit Mitte $\langle x\rangle$ und Standardabweichung $\Delta x(t)$. Ihre Fläche bleibt $1$, deshalb sinkt sie, wenn sie breiter wird. Die Höhenachse reicht bis zur Spitze bei $t = 0$, mindestens bis $0{,}9$; für kleines $\sigma_0$ wird sie höher. Beim Ziehen an $t$ bleibt sie fest, so siehst du das Sinken direkt.`},
      {sym:R`\mathrm{Re}\,\psi(x,t)`, ctl:'Re ψ (dünn)', says:R`Die dünne Kurve: Trägerwelle $e^{i(k_0x - \omega_0t)}$ mal Einhüllende, davon der Realteil. Ihre Berge laufen mit $v_\mathrm{ph} = v_\mathrm{g}/2$, relativ zum Maximum also nach hinten.`},
      {sym:R`\Delta x(t),\ \langle x\rangle,\ \Delta p`, ctl:'Einheiten ħ = m = 1', says:R`Die Anzeigezeile unter dem Bild rechnet $\Delta x(t) = \sigma_0\sqrt{1 + (\hbar t/2m\sigma_0^2)^2}$, $\langle x\rangle = \hbar k_0t/m$ und $\Delta p = \hbar/(2\sigma_0)$ aus, in Einheiten mit $\hbar = m = 1$. $\Delta p$ ändert sich mit $t$ nicht.`}
    ],
    text:'Dicke Kurve: $|\\psi(x,t)|^2$, dünne Kurve: $\\operatorname{Re}\\psi$. Einheiten mit $\\hbar = m = 1$.',
    predict:{q:'Bevor du den Zeitregler bewegst: Stell $k_0 = 3$ ein. Wie bewegen sich die Wellenberge von $\\mathrm{Re}\\,\\psi$ im Vergleich zum Maximum von $|\\psi|^2$?', opts:['langsamer: Sie wandern im Paket nach hinten', 'gleich schnell: Das Muster läuft starr mit', 'schneller: Sie wandern im Paket nach vorn'], a:0,
      ex:'$v_\\mathrm{ph} = \\hbar k_0/2m$ ist halb so groß wie $v_\\mathrm{g} = \\hbar k_0/m$. Relativ zur Einhüllenden laufen die Wellenberge deshalb nach hinten.'},
    questions:[
      {q:'Stelle $\\sigma_0 = 0{,}3$ ein und ziehe $t$ auf $2{,}5$. Dann dasselbe mit $\\sigma_0 = 1{,}0$. Welches Paket ist am Ende breiter?', opts:['das mit $\\sigma_0 = 0{,}3$', 'das mit $\\sigma_0 = 1{,}0$', 'beide gleich'], a:0, ex:'Schmaler Anfang heißt großes $\\Delta p = \\hbar/(2\\sigma_0)$ und damit schnelles Zerfließen.'},
      {q:'Was bewegt sich mit der Geschwindigkeit $\\hbar k_0/m$?', opts:['das Maximum von $|\\psi|^2$', 'die Wellenberge von $\\operatorname{Re}\\psi$', 'die Nullstellen von $\\operatorname{Re}\\psi$'], a:0, ex:'Die Einhüllende läuft mit $v_\\mathrm{g} = \\hbar k_0/m$; die Wellenberge und Nullstellen laufen mit $v_\\mathrm{ph} = v_\\mathrm{g}/2$ durch das Paket.'}
    ],
    noPic:{q:'Ohne Bild: Wie ändert sich $\\Delta p$ eines freien Wellenpakets mit der Zeit?', opts:['gar nicht', 'es wächst wie $\\Delta x$', 'es nimmt ab'], a:0, ex:'$\\hat H = \\hat p^2/2m$ enthält nur $\\hat p$: Jede Impulskomponente bekommt nur einen Phasenfaktor $e^{-i\\omega(k)t}$, und $|\\varphi(k)|^2$ ändert sich nicht.'}},
  compare:{
    text:'Gesucht ist $\\langle p\\rangle$ für $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}e^{ik_0x}$. Die Impulsraum-Wellenfunktion ist $\\varphi(k) = (2\\sigma^2/\\pi)^{1/4}e^{-\\sigma^2(k - k_0)^2}$. Zwei richtige Wege:',
    ctx:{coords:['x'], params:{σ:'pos', 'k_0':'real'}, defs:{'ψ(x)':GAUSS, 'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 (k - k_0)^2)'}, state:'ψ', normalized:true},
    A:{name:'Im Ortsraum', model:['⟨p⟩ = ∫_-∞^∞ ψ^* (-iħ) ψ\' dx', {l:'= ∫_-∞^∞ |ψ|^2 (ħ k_0 + iħ x/(2σ^2)) dx', w:'ψ′ = (ik₀ − x/(2σ²)) ψ'}, {l:'= ħ k_0', w:'ungerader Anteil verschwindet'}]},
    B:{name:'Im Impulsraum', model:['⟨p⟩ = ∫_-∞^∞ ħ k |φ(k)|^2 dk', {l:'= ħ k_0', w:'symmetrisch um k₀'}]},
    questions:[
      {q:'Warum ist Weg B hier fast ohne Rechnung möglich?', opts:['$|\\varphi(k)|^2$ ist symmetrisch um $k_0$ und normiert.', 'Weil $\\hbar k$ unter dem Integral konstant ist.', 'Weil $\\varphi(k)$ hier eine reelle Funktion ist.'], a:0, ex:'Ein Mittelwert einer symmetrischen Verteilung liegt im Symmetriepunkt.'},
      {q:'Wofür ist der Ortsraum besser geeignet?', opts:['für $\\langle x\\rangle$, $\\langle x^2\\rangle$, $\\langle V(x)\\rangle$', 'für $\\langle p^2\\rangle$ und $\\langle p\\rangle$', 'für $\\langle p^2/2m\\rangle$ allein'], a:0, ex:'Jede Größe ist dort einfach, wo sie ein Multiplikationsoperator ist: $x$ im Ortsraum, $p = \\hbar k$ im Impulsraum.'}
    ]
  },
  practice:[
    {id:'frei-p1', title:'Phasen- und Gruppengeschwindigkeit',
      text:'Für ein freies Teilchen gilt $\\omega(k) = \\hbar k^2/(2m)$. Schreibe $v_p$ für die Phasen- und $v_g$ für die Gruppengeschwindigkeit.',
      ctx:{coords:['x'], params:{k:'pos', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $v_p = \\omega/k$.', type:'value', target:'ħ k/(2m)', points:1, ph:'v_p = ω/k',
          hints:['Gesucht ist die Geschwindigkeit der Wellenberge: Die Phase $kx - \\omega t$ bleibt konstant.', 'Teile $\\omega(k) = \\hbar k^2/2m$ durch $k$.'],
          model:['v_p = ω/k', '= ħ k/(2m)']},
        {id:'b', prompt:'b) Berechne $v_g = d\\omega/dk$.', type:'value', target:'ħ k/m', points:2, ph:'v_g = dω/dk',
          hints:['Gesucht ist die Geschwindigkeit der Einhüllenden. Sie hängt davon ab, wie sich $\\omega$ mit $k$ ändert.', '$v_g = d\\omega/dk$, und $\\frac{d}{dk}k^2 = 2k$.', 'Schreib `v_g = d/dk (ħ k^2/(2m))` und leite ab.'],
          model:['v_g = dω/dk', '= d/dk (ħ k^2/(2m))', '= ħ k/m'], mistakes:[{expr:'ħ k/(2m)', msg:'Das ist die Phasengeschwindigkeit. Für $v_g$ wird abgeleitet, nicht geteilt.'}]}
      ]},
    {id:'frei-p2', title:'Ebene Welle als Eigenfunktion',
      text:'$\\psi(x) = e^{ikx}$ mit reellem $k$, freies Teilchen ($V = 0$).',
      ctx:{coords:['x'], params:{k:'real', m:'pos'}, defs:{'ψ(x)':'e^(i k x)'}},
      goals:[
        {id:'a', prompt:'a) Zeige: $\\hat p\\psi = \\hbar k\\,\\psi$.', type:'show', from:'p̂ ψ', to:'ħ k ψ', points:2,
          hints:['Zeigen heißt: links $\\hat p\\psi$ ausschreiben und umformen, bis $\\hbar k\\,\\psi$ dasteht.', 'Setze $\\hat p = -i\\hbar\\,d/dx$ ein; $\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$.', 'Es bleibt $-i\\hbar\\cdot ik = \\hbar k$.'],
          model:['p̂ ψ = -iħ d/dx e^(ikx)', '= -iħ · ik e^(ikx)', '= ħ k ψ']},
        {id:'b', prompt:'b) Zeige: $\\hat H\\psi = \\frac{\\hbar^2k^2}{2m}\\psi$.', type:'show', from:'Ĥ ψ', to:'ħ^2 k^2/(2m) ψ', points:2,
          hints:['Wie bei a): $\\hat H\\psi$ ausschreiben und vereinfachen.', '$\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2}$; zweimal ableiten bringt $(ik)^2 = -k^2$.'],
          model:['Ĥ ψ = -ħ^2/(2m) d^2/dx^2 e^(ikx)', '= -ħ^2/(2m) (ik)^2 e^(ikx)', '= ħ^2 k^2/(2m) ψ']}
      ]},
    {id:'frei-p3', title:'Normierung und Ortsunschärfe des Gauß-Pakets',
      text:'$\\psi(x) = A\\,e^{-x^2/(4\\sigma^2)}e^{ik_0x}$ mit $\\sigma > 0$ und reellem $k_0$.',
      ctx:{coords:['x'], params:{σ:'pos', 'k_0':'real', m:'pos'}, defs:{'ψ(x)':'A e^(-x^2/(4σ^2)) e^(i k_0 x)'}, unknowns:{A:{ref:'(2πσ^2)^(-1/4)', alt:['-(2πσ^2)^(-1/4)']}}, state:'ψ'},
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normierung: $\\int|\\psi|^2dx = 1$ ansetzen und nach $A$ auflösen.', '$|e^{ik_0x}|^2 = 1$; es bleibt $|A|^2\\int e^{-x^2/(2\\sigma^2)}dx$, ein Gauß-Integral.', '$\\int e^{-x^2/(2\\sigma^2)}dx = \\sqrt{2\\pi\\sigma^2}$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2 ∫_-∞^∞ e^(-x^2/(2σ^2)) dx = 1', '|A|^2 sqrt(2πσ^2) = 1', 'A = (2πσ^2)^(-1/4)']},
        {id:'b', prompt:'b) Berechne $\\langle x^2\\rangle$ (es ist $\\langle x\\rangle = 0$, also $\\Delta x = \\sqrt{\\langle x^2\\rangle}$).', type:'value', target:'σ^2', points:2,
          hints:['$\\langle x^2\\rangle = \\int x^2|\\psi|^2dx$ mit dem $A$ aus a).', '$\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/(2\\sigma^2)$.'],
          model:['⟨x^2⟩ = (2πσ^2)^(-1/2) ∫_-∞^∞ x^2 e^(-x^2/(2σ^2)) dx', '= (2πσ^2)^(-1/2) · σ^2 sqrt(2πσ^2)', '= σ^2']}
      ]},
    {id:'frei-p4', title:'Wann ist das Paket doppelt so breit?',
      text:'Ein freies Gauß-Paket hat $\\Delta x(t) = \\sigma\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma^2}\\right)^2}$. Nenne die gesuchte Zeit $\\tau$.',
      ctx:{coords:['x'], params:{σ:'pos', m:'pos'}, unknowns:{τ:{ref:'2 sqrt(3) m σ^2/ħ'}}},
      goals:[
        {id:'a', prompt:'Bestimme $\\tau$ mit $\\Delta x(\\tau) = 2\\sigma$.', type:'solve', unknown:'τ', points:3, ph:'σ sqrt(1 + (ħτ/(2mσ^2))^2) = 2σ',
          hints:['Setze $\\Delta x(\\tau) = 2\\sigma$ an und löse nach $\\tau$ auf.', 'Durch $\\sigma$ teilen und quadrieren.', 'Es bleibt $(\\hbar\\tau/(2m\\sigma^2))^2 = 3$.'],
          model:['σ sqrt(1 + (ħτ/(2mσ^2))^2) = 2σ', '1 + (ħτ/(2mσ^2))^2 = 4', 'ħτ/(2mσ^2) = sqrt(3)', 'τ = 2 sqrt(3) m σ^2/ħ'],
          note:'Beispiel: Elektron mit $\\sigma = 1\\,\\text{Å}$: $\\tau \\approx 3\\cdot10^{-16}\\,\\mathrm{s}$. Ein Staubkorn ($10^{-15}\\,\\mathrm{kg}$, $\\sigma = 1\\,\\mu\\mathrm{m}$) bräuchte etwa $3\\cdot10^7\\,\\mathrm s$ – rund ein Jahr.'}
      ]},
    {id:'frei-p5', title:'Impulsverteilung einer abfallenden Exponentialfunktion',
      text:'$\\psi(x) = \\frac{1}{\\sqrt a}e^{-|x|/a}$ (normiert, Thema 1). Teile das Fourier-Integral in $x < 0$ und $x > 0$ auf.',
      ctx:{coords:['k'], params:{a:'pos'}, defs:{'φ(k)':'sqrt(2a/π)/(1 + a^2 k^2)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'sqrt(2a/π)/(1 + a^2 k^2)', points:3, ph:'φ(k) = 1/sqrt(2π a) ∫_-∞^∞ e^(-|x|/a) e^(-ikx) dx',
          hints:['Teile das Integral bei $x = 0$: Für $x > 0$ ist $|x| = x$, für $x < 0$ ist $|x| = -x$.', 'Für $x < 0$ substituiere $x \\to -x$: Es entsteht $\\int_0^\\infty e^{-x/a + ikx}dx$.', '$\\int_0^\\infty e^{-cx}dx = 1/c$ gilt auch für komplexes $c$ mit $\\operatorname{Re}c > 0$.'],
          model:['φ(k) = 1/sqrt(2π a) ∫_-∞^∞ e^(-|x|/a) e^(-ikx) dx', '= 1/sqrt(2π a) (∫_0^∞ e^(-x/a - ikx) dx + ∫_0^∞ e^(-x/a + ikx) dx)', '= 1/sqrt(2π a) (1/(1/a + ik) + 1/(1/a - ik))', '= sqrt(2a/π)/(1 + a^2 k^2)']},
        {id:'b', prompt:'b) Prüfe die Normierung: $\\int|\\varphi(k)|^2dk$. Nützlich: $\\int_{-\\infty}^\\infty\\frac{dk}{(1 + a^2k^2)^2} = \\frac{\\pi}{2a}$.', type:'value', target:'1', points:2,
          hints:['Setze $\\varphi(k)$ aus a) ein; $\\varphi$ ist reell, also $|\\varphi|^2 = \\varphi^2$.', 'Der Vorfaktor ist $2a/\\pi$; das Integral steht in der Aufgabe.'],
          model:['∫_-∞^∞ |φ(k)|^2 dk = 2a/π ∫_-∞^∞ 1/(1 + a^2 k^2)^2 dk', '= 2a/π · π/(2a)', '= 1'], note:'Parseval bestätigt: $\\psi$ und $\\varphi$ sind beide normiert.'}
      ]}
  ],
  concept:[
    {id:'frei-k1', type:'mc2', seg:'frei-t6', lex:'gauss-paket',
      q:'Das Gauß-Paket $\\psi(x,0) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/4\\sigma^2}e^{ik_0x}$ bewegt sich frei ($V = 0$). Ist es ein stationärer Zustand?', opts:['Nein', 'Ja', 'Nur für $k_0 = 0$'], a:0,
      ex:'Auch für $k_0 = 0$ zerfließt das Paket; $|\\psi(x,t)|^2$ hängt von $t$ ab.',
      reason:{q:'Warum?', opts:['Es überlagert verschiedene $k$, also verschiedene Energien; $|\\psi|^2$ wandert und zerfließt.', 'Ohne Kraft ändert sich am Zustand nichts; auch $\\langle p\\rangle$ bleibt ja konstant.', '$|\\varphi(k)|^2$ ist zeitlich konstant, also ändert sich auch der Zustand nicht.'], a:0,
        ex:'Stationär ist nur ein Zustand mit einer einzigen Energie. Dass $|\\varphi(k)|^2$ konstant ist, betrifft die Impulsverteilung, nicht die Ortsverteilung. Die Vorstellung „jeder Zustand ist stationär“ ist eine bekannte Lernschwierigkeit (Styer 1996).'}},
    {id:'frei-k2', type:'dialog', seg:'frei-t6', keep:true,
      text:'Ein Elektron startet als Gauß-Paket mit $\\Delta x = 0{,}1\\,\\mathrm{nm}$. Nach einer Nanosekunde ist $\\Delta x \\approx 0{,}6\\,\\mathrm{mm}$.',
      people:[{name:'Lena', says:'Eine Ortsmessung findet es an einer Stelle. Erst viele Messungen an gleich präparierten Elektronen zeigen die Streuung von $0{,}6\\,\\mathrm{mm}$.'}, {name:'Jonas', says:'Dann ist das Elektron jetzt über einen halben Millimeter ausgedehnt. Eine Ortsmessung findet es über diesen Bereich verschmiert.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'$|\\Psi|^2$ ist eine Wahrscheinlichkeitsdichte, keine Materieverteilung. Jede Messung liefert einen Ort; die Breite zeigt sich in der Statistik vieler Messungen. $\\psi$ als physikalisch ausgedehnte Materiewelle zu lesen, ist eine verbreitete Fehlvorstellung.'},
    {id:'frei-k3', type:'mc', seg:'frei-t4', lex:'impulsraum',
      q:'Ein Wellenpaket hat $\\langle p\\rangle = \\hbar k_0$ und $\\Delta p = \\hbar/(2\\sigma)$. Du misst den Impuls eines einzelnen Teilchens. Was kommt heraus?', opts:['ein Wert $\\hbar k$, zufällig verteilt nach $|\\varphi(k)|^2$', 'genau $\\hbar k_0$, denn das ist der Impuls des Pakets', 'das Intervall $\\hbar k_0 \\pm \\hbar/(2\\sigma)$ als Ergebnis'], a:0,
      ex:'Eine Einzelmessung liefert einen Wert. $\\langle p\\rangle$ ist der Mittelwert vieler Messungen, $\\Delta p$ ihre Streuung. Den Erwartungswert als Einzelergebnis zu lesen, ist ein häufiger Fehler.'},
    {id:'frei-k4', type:'mc2', seg:'frei-t5', lex:'gruppengeschwindigkeit',
      q:'Bei einem Elektronen-Wellenpaket mit mittlerer Wellenzahl $k_0$ laufen die Wellenberge mit $\\hbar k_0/2m$. Wie schnell bewegt sich der Ortsmittelwert $\\langle x\\rangle$?', opts:['mit $\\hbar k_0/m$', 'mit $\\hbar k_0/2m$', 'gar nicht, $\\langle x\\rangle$ bleibt'], a:0,
      ex:'$\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m = \\hbar k_0/m$.',
      reason:{q:'Warum?', opts:['Die Einhüllende läuft mit $d\\omega/dk$, und das ist $\\hbar k_0/m$.', 'Ort und Wellenberge bewegen sich immer gleich schnell.', 'Ohne Kraft bewegt sich der Mittelwert des Orts nicht.'], a:0,
        ex:'Die Wellenberge haben keine Messbedeutung. Messbar ist $|\\Psi|^2$; ihr Schwerpunkt läuft mit $\\langle p\\rangle/m$.'}},
    {id:'frei-k5', type:'mc', seg:'frei-t1',
      q:'Ist $\\psi(x) = \\cos(kx)$ für das freie Teilchen ein Eigenzustand von $\\hat H$? Und von $\\hat p$?', opts:['von $\\hat H$ ja, von $\\hat p$ nein', 'von beiden, weil $\\hat H$ nur $\\hat p$ enthält', 'von keinem, weil $\\cos kx$ reell ist'], a:0,
      ex:'$\\hat H\\cos kx = \\frac{\\hbar^2k^2}{2m}\\cos kx$, aber $\\hat p\\cos kx = i\\hbar k\\sin kx$. $\\hat H = \\hat p^2/2m$ enthält nur $\\hat p$, und doch ist nicht jede Eigenfunktion von $\\hat H$ eine von $\\hat p$: Zur Energie $\\hbar^2k^2/2m$ gehören die beiden Impulse $\\pm\\hbar k$ (Entartung), und $\\cos kx$ überlagert beide. Wie man gemeinsame Eigenfunktionen allgemein findet, zeigt Thema 6.'}
  ],
  sketch:[SK.s1],
  final:[
    {aim:0, task:{id:'frei-fa1', title:'Phasen- und Gruppengeschwindigkeit im konstanten Potential',
      text:'In einem Bereich mit konstantem Potential $V_0$ gilt für ein Elektron $\\hbar\\omega = \\frac{\\hbar^2k^2}{2m} + V_0$. Schreibe $v_p$ und $v_g$.',
      ctx:{coords:['x'], params:{k:'pos', m:'pos', V_0:'real'}, defs:{'ω':'ħ k^2/(2m) + V_0/ħ'}},
      goals:[
        {id:'a', prompt:'a) Berechne die Phasengeschwindigkeit $v_p$.', type:'value', target:'ħ k/(2m) + V_0/(ħ k)', points:1, model:['v_p = ω/k', '= ħ k/(2m) + V_0/(ħ k)']},
        {id:'b', prompt:'b) Berechne die Gruppengeschwindigkeit $v_g$.', type:'value', target:'ħ k/m', points:2, model:['v_g = dω/dk', '= d/dk (ħ k^2/(2m) + V_0/ħ)', '= ħ k/m'],
          note:'$V_0$ ändert $v_p$, aber nicht $v_g$: Nur die Gruppengeschwindigkeit ist physikalisch.'}
      ]}},
    {aim:1, task:{id:'frei-fa2', title:'Impulsraum-Wellenfunktion eines Rechteckpakets',
      text:'$\\psi(x) = 1/\\sqrt a$ für $0 < x < a$, sonst $\\psi = 0$.',
      ctx:{coords:['x', 'k'], params:{a:'pos'}, defs:{'φ(k)':'(1 - e^(-i k a))/(i k sqrt(2π a))'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'(1 - e^(-i k a))/(i k sqrt(2π a))', points:3,
          model:['φ(k) = 1/sqrt(2π) ∫_0^a 1/sqrt(a) e^(-ikx) dx', '= 1/sqrt(2π a) [e^(-ikx)/(-ik)]_0^a', '= (1 - e^(-ika))/(ik sqrt(2π a))']},
        {id:'b', prompt:'b) Berechne $|\\varphi(k)|^2$ und vereinfache mit $1 - \\cos u = 2\\sin^2(u/2)$.', type:'value', target:'2 sin(k a/2)^2/(π a k^2)', points:2,
          model:['|φ(k)|^2 = (1 - e^(-ika))(1 - e^(ika))/(2π a k^2)', '= (2 - 2cos(k a))/(2π a k^2)', '= 2 sin(k a/2)^2/(π a k^2)']}
      ]}},
    {aim:2, task:{id:'frei-fa3', title:'Impulsunschärfe des Gauß-Pakets',
      text:'$\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}e^{ik_0x}$ mit $\\sigma > 0$ und reellem $k_0$. Es ist $\\Delta x = \\sigma$.',
      ctx:{coords:['x'], params:{σ:'pos', 'k_0':'real'}, defs:{'ψ(x)':GAUSS}, state:'ψ', normalized:true},
      goals:[
        {id:'a', prompt:'a) Berechne $\\Delta p$.', type:'value', target:'ħ/(2σ)', points:3,
          model:['φ(k) = (2σ^2/π)^(1/4) e^(-σ^2 (k - k_0)^2)', '⟨p⟩ = ħ k_0', '⟨p^2⟩ = ħ^2 ∫_-∞^∞ k^2 |φ(k)|^2 dk', '= ħ^2 (k_0^2 + 1/(4σ^2))', 'Δp = sqrt(⟨p^2⟩ - ⟨p⟩^2)', '= ħ/(2σ)']},
        {id:'b', prompt:'b) Berechne $\\Delta x\\,\\Delta p$.', type:'value', target:'ħ/2', points:1, model:['Δx Δp = σ · ħ/(2σ)', '= ħ/2']}
      ]}},
    {aim:2, sketch:SK.fA},
    {aim:'k', type:'mc2', id:'frei-fk1',
      q:'Zwei freie Gauß-Pakete gleicher Masse: A mit $\\sigma_A = 1\\,\\mathrm{nm}$, B mit $\\sigma_B = 3\\,\\mathrm{nm}$. Welches ist nach sehr langer Zeit breiter?', opts:['A', 'B', 'beide gleich'], a:0,
      ex:'Für große $t$ ist $\\Delta x \\approx \\hbar t/(2m\\sigma)$; A ist dann dreimal so breit wie B.',
      reason:{q:'Warum?', opts:['A hat das größere $\\Delta p$; für große $t$ ist $\\Delta x \\approx \\Delta p\\,t/m$.', 'B ist anfangs breiter, und die Breite wächst proportional zur Anfangsbreite.', 'Ohne Kraft zerfließen alle Pakete gleich schnell.'], a:0,
        ex:'Schmal im Ort heißt breit im Impuls: $\\Delta p = \\hbar/(2\\sigma)$.'}},
    {aim:'k', type:'dialog', id:'frei-fk2', keep:true,
      text:'Ein langsames Neutron hat die de-Broglie-Wellenlänge $\\lambda = 0{,}4\\,\\mathrm{nm}$ und soll eine Flugstrecke von $1\\,\\mathrm{m}$ zurücklegen. Die Wellenberge seines Wellenpakets laufen mit $\\omega/k = h/(2m\\lambda) \\approx 500\\,\\mathrm{m/s}$.',
      people:[{name:'Lena', says:'Dann braucht das Neutron für den Meter etwa $2\\,\\mathrm{ms}$, denn es fliegt mit der Geschwindigkeit seiner Wellenberge.'}, {name:'Jonas', says:'Ein Detektor am Ende spricht im Mittel schon nach etwa $1\\,\\mathrm{ms}$ an, denn das Paket läuft mit $d\\omega/dk = h/(m\\lambda) \\approx 1000\\,\\mathrm{m/s}$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Messbar ist, wo $|\\Psi|^2$ groß ist. Das Maximum läuft mit der Gruppengeschwindigkeit $v_\\mathrm{g} = \\hbar k/m = h/(m\\lambda) \\approx 990\\,\\mathrm{m/s}$, der klassischen Geschwindigkeit $p/m$. Die Phasengeschwindigkeit ist halb so groß und hat keine Messbedeutung; sie hängt sogar vom Energienullpunkt ab.'}
  ],
  finalB:[
    {aim:0, task:{id:'frei-fb1', title:'Phasen- und Gruppengeschwindigkeit eines Leitungselektrons',
      text:'Ein Elektron im Leitungsband eines Halbleiters verhält sich näherungsweise wie ein freies Teilchen mit der effektiven Masse $M$ (oft $m^*$ geschrieben), oberhalb der Bandkante $E_c$: $\\hbar\\omega = E_c + \\frac{\\hbar^2k^2}{2M}$. Schreibe $v_p$ und $v_g$.',
      ctx:{coords:['x'], params:{k:'pos', M:'pos', 'E_c':'real'}, defs:{'ω':'E_c/ħ + ħ k^2/(2M)'}},
      goals:[
        {id:'a', prompt:'a) Berechne die Phasengeschwindigkeit $v_p$.', type:'value', target:'E_c/(ħ k) + ħ k/(2M)', points:1, model:['v_p = ω/k', '= E_c/(ħ k) + ħ k/(2M)']},
        {id:'b', prompt:'b) Berechne die Gruppengeschwindigkeit $v_g$.', type:'value', target:'ħ k/M', points:2, model:['v_g = dω/dk', '= d/dk (E_c/ħ + ħ k^2/(2M))', '= ħ k/M'],
          note:'$E_c$ ändert $v_p$, aber nicht $v_g$. Das Elektron bewegt sich mit $v_g = \\hbar k/M$, wie ein freies Teilchen der Masse $M$.'}
      ]}},
    {aim:1, task:{id:'frei-fb2', title:'Impulsraum-Wellenfunktion einer einseitigen Exponentialfunktion',
      text:'$\\psi(x) = \\sqrt{2\\kappa}\\,e^{-\\kappa x}$ für $x > 0$, sonst $\\psi = 0$ (normiert, $\\kappa > 0$).',
      ctx:{coords:['x', 'k'], params:{κ:'pos'}, defs:{'φ(k)':'sqrt(κ/π)/(κ + i k)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'sqrt(κ/π)/(κ + i k)', points:3,
          model:['φ(k) = 1/sqrt(2π) ∫_0^∞ sqrt(2κ) e^(-κ x) e^(-ikx) dx', '= sqrt(κ/π) ∫_0^∞ e^(-(κ + ik) x) dx', '= sqrt(κ/π)/(κ + ik)']},
        {id:'b', prompt:'b) Berechne $|\\varphi(k)|^2$.', type:'value', target:'κ/(π (κ^2 + k^2))', points:2,
          model:['|φ(k)|^2 = κ/π · 1/((κ + ik)(κ - ik))', '= κ/(π (κ^2 + k^2))']}
      ]}},
    {aim:2, task:{id:'frei-fb3', title:'Impulsunschärfe eines anders geschriebenen Gauß-Pakets',
      text:'$\\psi(x) = (\\pi b^2)^{-1/4}e^{-x^2/(2b^2)}e^{ik_0x}$ mit $b > 0$ und reellem $k_0$. Es ist $\\Delta x = b/\\sqrt2$.',
      ctx:{coords:['x'], params:{b:'pos', 'k_0':'real'}, defs:{'ψ(x)':'(π b^2)^(-1/4) e^(-x^2/(2b^2)) e^(i k_0 x)'}, state:'ψ', normalized:true},
      goals:[
        {id:'a', prompt:'a) Berechne $\\Delta p$.', type:'value', target:'ħ/(sqrt(2) b)', points:3,
          model:['⟨p⟩ = ħ k_0', '⟨p^2⟩ = ħ^2 (k_0^2 + 1/(2b^2))', 'Δp = sqrt(⟨p^2⟩ - ⟨p⟩^2)', '= ħ/(sqrt(2) b)']},
        {id:'b', prompt:'b) Berechne $\\Delta x\\,\\Delta p$.', type:'value', target:'ħ/2', points:1, model:['Δx Δp = b/sqrt(2) · ħ/(sqrt(2) b)', '= ħ/2']}
      ]}},
    {aim:2, sketch:SK.fB},
    {aim:'k', type:'mc2', id:'frei-gk1',
      q:'Ein freies Elektronen-Wellenpaket soll nach einer festen Flugzeit $t$ möglichst schmal sein. Wie wählst du die Anfangsbreite $\\sigma$?', opts:['nicht beliebig klein: Für ein bestimmtes $\\sigma$ ist $\\Delta x(t)$ am kleinsten', 'so klein wie möglich, denn ein schmaler Start bleibt am schmalsten', 'so groß wie möglich, denn breite Pakete zerfließen am langsamsten'], a:0,
      ex:'$\\Delta x(t)^2 = \\sigma^2 + \\left(\\frac{\\hbar t}{2m\\sigma}\\right)^2$ ist am kleinsten für $\\sigma^2 = \\hbar t/(2m)$; dann ist $\\Delta x(t) = \\sqrt{\\hbar t/m}$.',
      reason:{q:'Warum?', opts:['Kleines $\\sigma$ heißt großes $\\Delta p$ und schnelles Zerfließen.', 'Ohne Kraft bleibt die Breite eines freien Pakets immer erhalten.', 'Die spätere Breite wächst proportional zur Anfangsbreite.'], a:0,
        ex:'Zwei Beiträge konkurrieren: die Anfangsbreite $\\sigma$ und das Auseinanderlaufen der Impulsanteile, $\\Delta p\\,t/m$ mit $\\Delta p = \\hbar/(2\\sigma)$. Ein sehr schmaler Start zerfließt schnell, ein breiter Start ist schon am Anfang breit.'}},
    {aim:'k', type:'dialog', id:'frei-gk2', keep:true,
      text:'Für ein freies Elektron ist $\\omega = \\hbar k^2/2m$. Verschiebt man den Energienullpunkt um $V_0$, wird $\\omega = \\hbar k^2/2m + V_0/\\hbar$.',
      people:[{name:'Lena', says:'Dann bewegt sich das Elektron nach der Verschiebung anders, denn die Wellenberge laufen jetzt mit einer anderen Geschwindigkeit.'}, {name:'Jonas', says:'Durch die Verschiebung ändert sich gar nichts – weder die Bewegung des Elektrons noch die Geschwindigkeit der Wellenberge.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:3,
      ex:'Die Wellenberge laufen tatsächlich anders: $v_\\mathrm{ph} = \\omega/k$ ändert sich um $V_0/(\\hbar k)$. Die Bewegung des Elektrons ändert sich aber nicht: Alle Komponenten bekommen denselben Phasenfaktor $e^{-iV_0t/\\hbar}$, also bleiben $|\\Psi|^2$ und $v_\\mathrm{g} = d\\omega/dk$ gleich.'}
  ],
  errors:[
    {id:'frei-e1', title:'Gruppengeschwindigkeit',
      text:'Für $\\omega(k) = \\hbar k^2/(2m)$ wird die Gruppengeschwindigkeit berechnet:',
      ctx:{coords:['x'], params:{k:'pos', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}},
      lines:['v_g = dω/dk', '= d/dk (ħ k^2/(2m))', '= ħ k/(2m)', '= ω/k'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$\\frac{d}{dk}k^2 = 2k$; der Faktor 2 fehlt.', 'Man muss nach $x$ ableiten, nicht nach $k$.', 'Nichts – $v_g = \\omega/k$ stimmt hier.'], a:0, ex:'Richtig ist $v_g = \\hbar k/m = 2v_\\mathrm{ph}$. Gleichheit $v_g = \\omega/k$ gilt nur für $\\omega \\propto k$ (etwa Licht im Vakuum).'},
      fix:{id:'a', prompt:'Berichtige und gib $v_g$ an.', type:'value', target:'ħ k/m', model:['v_g = dω/dk', '= ħ k/m']}}
  ]
});
})();
lexe('ebene-welle', 'Ebene Welle', '$\\Psi(x,t) = Ae^{i(kx - \\omega t)}$ mit $\\omega = \\hbar k^2/2m$ (freies Teilchen). Eigenfunktion von $\\hat p$ zum Eigenwert $\\hbar k$ und von $\\hat H$ zu $\\hbar^2k^2/2m$. Nicht normierbar; Stromdichte $j = |A|^2\\hbar k/m$.', {topic:'frei'});
lexe('gruppengeschwindigkeit', 'Phasen- und Gruppengeschwindigkeit', '$v_\\mathrm{ph} = \\omega/k$ (Wellenberge), $v_g = d\\omega/dk$ (Einhüllende eines Pakets, Energietransport). Freies Teilchen: $v_g = \\hbar k/m = p/m$, $v_\\mathrm{ph} = v_g/2$.', {topic:'frei'});
lexe('wellenpaket', 'Wellenpaket', 'Normierbare Überlagerung ebener Wellen: $\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\int\\varphi(k)e^{i(kx - \\omega(k)t)}dk$. $\\varphi(k)$ folgt aus $\\Psi(x,0)$ durch Fourier-Transformation. Je schärfer $\\varphi$, desto breiter $\\Psi$.', {topic:'frei'});
lexe('impulsraum', 'Impulsraum-Wellenfunktion', '$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$, oder mit $p = \\hbar k$: $\\tilde\\psi(p) = \\frac{1}{\\sqrt{2\\pi\\hbar}}\\int\\psi(x)e^{-ipx/\\hbar}dx$. $|\\tilde\\psi(p)|^2dp$ ist die Wahrscheinlichkeit für Impulse in $[p, p+dp]$; $\\langle p\\rangle = \\int p|\\tilde\\psi|^2dp$.', {topic:'frei'});
lexe('gauss-paket', 'Gauß-Paket und Zerfließen', '$\\psi(x,0) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/4\\sigma^2}e^{ik_0x}$: $\\Delta x = \\sigma$, $\\Delta p = \\hbar/2\\sigma$, also $\\Delta x\\Delta p = \\hbar/2$ (minimal). Frei: $\\Delta x(t) = \\sigma\\sqrt{1 + (\\hbar t/2m\\sigma^2)^2}$, das Maximum läuft mit $\\hbar k_0/m$.', {topic:'frei'});
lexe('dispersion', 'Dispersionsrelation', 'Zusammenhang $\\omega(k)$ zwischen Frequenz und Wellenzahl. Freies nichtrelativistisches Teilchen: $\\omega = \\hbar k^2/2m$ (quadratisch, daher Zerfließen von Wellenpaketen); Licht im Vakuum: $\\omega = ck$ (linear, kein Zerfließen). Phasengeschwindigkeit $\\omega/k$, Gruppengeschwindigkeit $d\\omega/dk$.', {topic:'frei'});
