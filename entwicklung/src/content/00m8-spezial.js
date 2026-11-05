/* ===== Mathe M8: Kugelkoordinaten und spezielle Funktionen ===== */
(function(){
const SPH = extra => Object.assign({coords:['r', 'θ', 'φ']}, extra || {});
const RAD = extra => Object.assign({coords:['r'], radial:true}, extra || {});
topic({
  id:'m-spezial', ch:'math', title:'Kugelkoordinaten und spezielle Funktionen', short:'Kugelkoordinaten',
  src:'Boas Kap. 5, 10, 12 und 13 · Griffiths & Schroeter Kap. 2.3, 4.1 und 4.2',
  goals:[
    'Ich kann Integrale in Kugelkoordinaten mit $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$ ausrechnen, besonders für Funktionen, die nur von $r$ abhängen.',
    'Ich kann den Laplace-Operator auf radiale Funktionen anwenden: $\\nabla^2f = \\frac{1}{r^2}\\frac{d}{dr}\\left(r^2\\frac{df}{dr}\\right) = \\frac1r\\frac{d^2}{dr^2}(rf)$.',
    'Ich kenne Hermite-, Legendre- und Laguerre-Polynome, ihre Orthogonalität mit Gewicht und weiß, wo sie in der Quantenmechanik vorkommen.'
  ],
  needs:'Mehrfachintegrale und partielle Ableitungen · Gauß-Integrale und $\\int_0^\\infty x^ne^{-x}dx = n!$ (M2) · Orthogonalität von Funktionen (M5)',
  check:[
    {q:'Ein Punkt hat die Kugelkoordinaten $r = 2$, $\\theta = \\pi/2$, $\\varphi = 0$. Seine kartesischen Koordinaten sind …', opts:['$(2, 0, 0)$', '$(0, 0, 2)$', '$(0, 2, 0)$'], a:0, ex:'$x = r\\sin\\theta\\cos\\varphi = 2$, $y = r\\sin\\theta\\sin\\varphi = 0$, $z = r\\cos\\theta = 0$. $\\theta$ wird von der $z$-Achse aus gemessen.', lex:'kugelkoordinaten'},
    {q:'$\\int_0^\\infty x^3e^{-x}\\,dx$ ist …', opts:['$6$', '$3$', '$1$'], a:0, ex:'$\\int_0^\\infty x^ne^{-x}dx = n! = 3! = 6$.', lex:'integrale', prev:'m-analysis'},
    {q:'Mit $r = \\sqrt{x^2 + y^2 + z^2}$ ist $\\partial r/\\partial x$ gleich …', opts:['$x/r$', '$1$', '$2x$'], a:0, ex:'Kettenregel: $\\frac{\\partial r}{\\partial x} = \\frac{2x}{2\\sqrt{x^2 + y^2 + z^2}} = \\frac xr$. Daraus folgt $\\nabla r = \\vec r/r$.', lex:'nabla'},
    {q:'Zwei reelle Funktionen $f, g$ auf $[a, b]$ heißen orthogonal, wenn …', opts:['$\\int_a^bf(x)g(x)\\,dx = 0$', '$f(a)g(a) = 0$', '$f(x)g(x) = 0$ für alle $x$'], a:0, ex:'Orthogonal heißt: Das Skalarprodukt $\\langle f|g\\rangle = \\int f^*g\\,dx$ verschwindet. Die Funktionen dürfen sich dabei überlappen.', lex:'orthonormal', prev:'m-hilbert'}
  ],
  example:{
    title:'Volumen und mittlerer Abstand in einer Kugel',
    text:'Eine Kugel mit Radius $R$ ist gleichmäßig gefüllt. Berechne ihr Volumen $V_K$ und den mittleren Abstand $r_m$ vom Mittelpunkt.',
    ctx:SPH({params:{R:'pos'}}),
    lines:[
      {l:'V_K = ∫_0^R ∫_0^π ∫_0^{2π} r^2 sin(θ) dφ dθ dr', why:{q:'Warum steht $r^2\\sin\\theta$ im Integranden?', opts:['Das ist das Volumenelement $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$ (Jacobi-Determinante).', 'Weil die Kugel rund ist, wird quadriert.', 'Das ist die Dichte der Kugel.'], a:0, ex:'Ein kleiner Quader mit den Kanten $dr$, $r\\,d\\theta$ und $r\\sin\\theta\\,d\\varphi$ hat das Volumen $r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$.'}},
      {l:'= 2π · 2 · R^3/3', why:{q:'Warum zerfällt das Integral in drei Faktoren?', opts:['Der Integrand ist ein Produkt von Funktionen je einer Variablen, und die Grenzen sind konstant.', 'Das geht bei jedem Dreifachintegral.', 'Weil $\\sin\\theta$ konstant ist.'], a:0, ex:'$\\int_0^{2\\pi}d\\varphi = 2\\pi$, $\\int_0^\\pi\\sin\\theta\\,d\\theta = 2$, $\\int_0^Rr^2\\,dr = R^3/3$.'}},
      {l:'= 4π R^3/3', why:{q:'Woran erkennst du, dass das stimmt?', opts:['Es ist das bekannte Kugelvolumen; $4\\pi$ ist der volle Raumwinkel.', 'An der Einheit $\\text{Länge}^2$.', 'Gar nicht.'], a:0, ex:'$\\int d\\Omega = \\int_0^\\pi\\!\\int_0^{2\\pi}\\sin\\theta\\,d\\varphi\\,d\\theta = 4\\pi$. Die Einheit ist $\\text{Länge}^3$.'}},
      {l:'r_m = 1/V_K ∫_0^R ∫_0^π ∫_0^{2π} r · r^2 sin(θ) dφ dθ dr', why:{q:'Was berechnet diese Zeile?', opts:['den mittleren Abstand bei gleichmäßiger Verteilung über die Kugel', 'die Oberfläche der Kugel', 'noch einmal das Volumen'], a:0, ex:'Mittelwert $= \\frac{1}{V_K}\\int r\\,d^3r$. Die konstante Dichte $1/V_K$ ist auf 1 normiert.'}},
      {l:'= 3/(4π R^3) · 4π R^4/4', why:{q:'Woher kommt $R^4/4$?', opts:['$\\int_0^Rr\\cdot r^2\\,dr = R^4/4$; der Winkelteil gibt wieder $4\\pi$.', 'Aus $R^3/3$ mal $R$.', 'Aus der Ableitung des Volumens.'], a:0, ex:'Das Maß $r^2$ gehört immer dazu, auch beim Mittelwert.'}},
      {l:'= 3R/4', why:{q:'Warum liegt der Mittelwert über $R/2$?', opts:['Außen liegt mehr Volumen: Die Kugelschale wächst mit $r^2$.', 'Weil die Dichte außen größer ist.', 'Das ist ein Rechenfehler, richtig wäre $R/2$.'], a:0, ex:'Der Abstand ist mit $P(r) = 3r^2/R^3$ verteilt, nicht gleichmäßig in $r$. Dieselbe Rolle spielt $r^2$ beim Wasserstoffatom (Thema 9).'}}
    ],
    faded:{id:'ms-fade', title:'Jetzt du: Gauß-Funktion im Raum',
      text:'Berechne $\\int e^{-r^2/a^2}\\,d^3r$ über den ganzen Raum ($a > 0$). Nützlich: $\\int_0^\\infty r^2e^{-r^2/a^2}dr = \\frac{\\sqrt\\pi}{4}a^3$.',
      ctx:SPH({params:{a:'pos'}}),
      given:['∫_0^∞ ∫_0^π ∫_0^{2π} e^(-r^2/a^2) r^2 sin(θ) dφ dθ dr = 4π ∫_0^∞ r^2 e^(-r^2/a^2) dr'],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'value', target:'π^(3/2) a^3', points:2,
        hints:['Setze das Radialintegral ein.', '$4\\pi\\cdot\\frac{\\sqrt\\pi}{4} = \\pi^{3/2}$.'],
        model:['∫_0^∞ ∫_0^π ∫_0^{2π} e^(-r^2/a^2) r^2 sin(θ) dφ dθ dr = 4π ∫_0^∞ r^2 e^(-r^2/a^2) dr', {l:'= 4π · sqrt(π) a^3/4', gap:'= 4π · ▢'}, '= π^(3/2) a^3'],
        note:'Kontrolle kartesisch: $e^{-r^2/a^2} = e^{-x^2/a^2}e^{-y^2/a^2}e^{-z^2/a^2}$, also $(\\sqrt\\pi\\,a)^3$ – dasselbe Ergebnis.'}]}
  },
  puzzle:{
    title:'Wie viel steckt in der äußeren Schale?',
    text:'Eine Kugel mit Radius $R$ ist gleichmäßig mit Masse gefüllt.\n\nWelcher Anteil der Masse liegt in der äußeren Hälfte des Radius, also bei $R/2 < r < R$?',
    q:{q:'Deine Vermutung:', opts:['$1/2$', '$7/8$', '$3/4$', '$1/8$'], a:1, ex:'Das Volumen bis zum Radius $r$ wächst wie $r^3$: $1 - (1/2)^3 = 7/8$.'},
    reveal:'Die innere Kugel mit Radius $R/2$ hat nur $(1/2)^3 = 1/8$ des Volumens; die äußere Schale enthält $7/8$.\n\nIn Kugelkoordinaten steckt das im Maß: $\\int f(r)\\,d^3r = 4\\pi\\int f(r)\\,r^2\\,dr$ für Funktionen, die nur von $r$ abhängen. Deshalb ist beim Wasserstoff-Grundzustand die Dichte $|\\psi|^2$ im Kern am größten, der wahrscheinlichste *Abstand* aber $a_0$ (Thema 9): Die Dichte fällt nach außen, das Schalenvolumen $4\\pi r^2\\,dr$ wächst.'
  },
  clarify:{
    core:'**Kugelkoordinaten:** $x = r\\sin\\theta\\cos\\varphi$, $y = r\\sin\\theta\\sin\\varphi$, $z = r\\cos\\theta$ mit $r\\ge 0$, $0\\le\\theta\\le\\pi$, $0\\le\\varphi<2\\pi$. Die Jacobi-Determinante liefert das Volumenelement\n\n$$d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi = r^2\\,dr\\,d\\Omega,\\qquad \\int d\\Omega = 4\\pi.$$\n\nFür Funktionen nur von $r$ gilt $\\int f(r)\\,d^3r = 4\\pi\\int_0^\\infty r^2f(r)\\,dr$.\n\n**Laplace-Operator** in Kugelkoordinaten:\n\n$$\\nabla^2 = \\frac{1}{r^2}\\frac{\\partial}{\\partial r}\\left(r^2\\frac{\\partial}{\\partial r}\\right) + \\frac{1}{r^2\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial}{\\partial\\theta}\\right) + \\frac{1}{r^2\\sin^2\\theta}\\frac{\\partial^2}{\\partial\\varphi^2}.$$\n\nDer Winkelteil ist $-\\hat L^2/(\\hbar^2r^2)$ (Thema 8). Für radiale Funktionen bleibt $\\nabla^2f = \\frac1r\\frac{d^2}{dr^2}(rf)$.\n\nDie hier behandelten **speziellen Funktionen** (Hermite, Legendre, Laguerre) sind Polynomlösungen von DGL mit nicht konstanten Koeffizienten. Sie sind orthogonal bezüglich einer **Gewichtsfunktion** $w(x)$:\n\n- Hermite $H_n$: $\\int_{-\\infty}^\\infty H_nH_m\\,e^{-x^2}dx = \\sqrt\\pi\\,2^nn!\\,\\delta_{nm}$ – Oszillator (Thema 7).\n- Legendre $P_l$: $\\int_{-1}^1P_lP_m\\,dx = \\frac{2}{2l+1}\\delta_{lm}$, mit $x = \\cos\\theta$ – Kugelflächenfunktionen (Thema 8).\n- Laguerre $L_n$: $\\int_0^\\infty L_nL_m\\,e^{-x}dx = \\delta_{nm}$ – Radialfunktionen des Wasserstoffatoms (Thema 9).',
    keys:[
      'Das Maß nie vergessen: $r^2$ bei radialen Integralen, $\\sin\\theta$ beim Winkel. Fehlt $r^2$, stimmt schon die Einheit nicht; fehlt $\\sin\\theta$, ergibt der volle Raumwinkel $2\\pi^2$ statt $4\\pi$.',
      '$\\theta$ läuft von $0$ bis $\\pi$, $\\varphi$ von $0$ bis $2\\pi$. Mit $u = \\cos\\theta$ wird $\\int_0^\\pi g(\\cos\\theta)\\sin\\theta\\,d\\theta = \\int_{-1}^1g(u)\\,du$.',
      'Gradient einer radialen Funktion: $\\nabla f(r) = f\'(r)\\,\\hat e_r$, denn $\\partial r/\\partial x = x/r$.',
      '$H_n$, $P_n$ und $L_n$ haben genau $n$ einfache reelle Nullstellen im Orthogonalitätsbereich. $H_n$ und $P_n$ haben die Parität $(-1)^n$.',
      'Konventionen: $P_l(1) = 1$, $L_n(0) = 1$, und $H_n$ hat den führenden Koeffizienten $2^n$. Bei Laguerre-Polynomen unterscheiden sich Bücher in der Normierung – nachschlagen statt raten.'
    ],
    errors:[
      '$d^3r = dr\\,d\\theta\\,d\\varphi$ verwenden – der Faktor $r^2\\sin\\theta$ fehlt.',
      'Für radiale Funktionen $\\nabla^2f = f\'\'$ setzen. Es fehlt der Term $\\frac2rf\'$.',
      '$\\theta$ von $0$ bis $2\\pi$ laufen lassen. Dann ist $\\int\\sin\\theta\\,d\\theta = 0$ statt $2$.',
      'Orthogonalität ohne Gewicht prüfen: $\\int_{-\\infty}^\\infty H_0H_2\\,dx$ existiert nicht einmal; erst mit $e^{-x^2}$ ist das Integral null.'
    ],
    more:[
      {title:'Warum gerade Polynome?', text:'Setzt man in die Hermite-Gleichung $H\'\' - 2xH\' + 2\\nu H = 0$ eine Potenzreihe ein, wächst die Lösung im Allgemeinen wie $e^{x^2}$, und $H\\,e^{-x^2/2}$ wäre nicht normierbar. Nur wenn die Reihe abbricht, also für $\\nu = n = 0, 1, 2, \\dots$, entsteht ein Polynom. Diese Abbruchbedingung wirkt wie eine Randbedingung (M7) und macht die Oszillatorenergien diskret: $E_n = \\hbar\\omega(n + \\tfrac12)$.'},
      {title:'Rodrigues-Formeln und Rekursionen', text:'$H_n(x) = (-1)^ne^{x^2}\\frac{d^n}{dx^n}e^{-x^2}$, $P_l(x) = \\frac{1}{2^ll!}\\frac{d^l}{dx^l}(x^2 - 1)^l$, $L_n(x) = \\frac{e^x}{n!}\\frac{d^n}{dx^n}\\left(x^ne^{-x}\\right)$.\n\nRekursionen: $H_{n+1} = 2xH_n - 2nH_{n-1}$, $(l+1)P_{l+1} = (2l+1)xP_l - lP_{l-1}$, $(n+1)L_{n+1} = (2n+1-x)L_n - nL_{n-1}$.'}
    ],
    checks:[
      {q:'Welches Gewicht gehört zu den Legendre-Polynomen auf $[-1, 1]$?', opts:['$w(x) = 1$', '$w(x) = e^{-x^2}$', '$w(x) = e^{-x}$'], a:0, ex:'$\\int_{-1}^1P_lP_m\\,dx = \\frac{2}{2l+1}\\delta_{lm}$ ohne Gewicht. Das Maß $\\sin\\theta\\,d\\theta$ wird mit $x = \\cos\\theta$ gerade zu $dx$.'},
      {q:'Was ergibt $\\nabla^2(1/r)$ für $r > 0$?', opts:['$0$', '$2/r^3$', '$-1/r^2$'], a:0, ex:'$\\frac{1}{r^2}\\frac{d}{dr}\\left(r^2\\cdot\\left(-\\frac{1}{r^2}\\right)\\right) = \\frac{1}{r^2}\\frac{d}{dr}(-1) = 0$. Bei $r = 0$ gilt $\\nabla^2\\frac1r = -4\\pi\\delta^3(\\vec r)$. $2/r^3$ ist nur $f\'\'$.'}
    ]
  },
  lab:{type:'special', title:'Hermite, Legendre, Laguerre',
    text:'Wähle die Familie und die Grade $n$ und $m$. Gezeichnet werden $f_n$ und $f_m$: bei Hermite die normierten Hermite-Funktionen $u_n = H_ne^{-x^2/2}/\\sqrt{\\sqrt\\pi\\,2^nn!}$, bei Legendre $P_n$, bei Laguerre $L_ne^{-x/2}$. Die Anzeige nennt das Polynom, die Zahl seiner Nullstellen und das Orthogonalitätsintegral mit Gewicht: $\\int H_nH_me^{-x^2}dx$, $\\int_{-1}^1P_nP_m\\,dx$ bzw. $\\int_0^\\infty L_nL_me^{-x}dx$.',
    questions:[
      {q:'Hermite, $n = 3$: Wie viele Nullstellen hat die Kurve?', opts:['3', '2', '4'], a:0, ex:'$H_3 = 8x^3 - 12x = 4x(2x^2 - 3)$: Nullstellen bei $0$ und $\\pm\\sqrt{3/2}\\approx\\pm 1{,}22$. Allgemein hat $H_n$ genau $n$ Nullstellen – wie $\\psi_n$ beim Oszillator $n$ Knoten.'},
      {q:'Legendre, $n = m = 2$: Welchen Wert zeigt das Integral?', opts:['$2/5 = 0{,}4$', '$1$', '$0$'], a:0, ex:'$\\int_{-1}^1P_l^2\\,dx = \\frac{2}{2l+1}$. Die Legendre-Polynome sind orthogonal, aber nicht auf 1 normiert.'}
    ],
    noPic:{q:'Ohne Bild: Folgt $\\int_{-1}^1P_2(x)P_3(x)\\,dx = 0$ schon aus der Symmetrie?', opts:['Ja: $P_2$ ist gerade, $P_3$ ungerade, das Produkt ist ungerade.', 'Nein, das muss man ausrechnen.', 'Nein, das Integral ist $2/5$.'], a:0, ex:'Ungerade Integranden geben auf symmetrischen Intervallen null. Für $P_1$ und $P_3$ hilft die Parität nicht – dort braucht man die Orthogonalität.'}},
  compare:{
    text:'Gesucht ist $\\nabla^2f$ für $f(r) = e^{-r/a}$ mit $a > 0$. Zwei richtige Wege:',
    ctx:RAD({params:{a:'pos'}, defs:{'f(r)':'e^(-r/a)'}}),
    A:{name:'Radialteil direkt', model:['∇^2 f = 1/r^2 d/dr (r^2 d/dr f(r))', '= 1/r^2 d/dr (-r^2/a e^(-r/a))', '= 1/r^2 (-2r/a + r^2/a^2) e^(-r/a)', '= (1/a^2 - 2/(a r)) e^(-r/a)']},
    B:{name:'Über $rf$', text:'Für radiale Funktionen gilt $\\frac{1}{r^2}\\left(r^2f\'\\right)\' = \\frac1r(rf)\'\'$.', model:['∇^2 f = 1/r d^2/dr^2 (r f(r))', '= 1/r d^2/dr^2 (r e^(-r/a))', '= 1/r (r/a^2 - 2/a) e^(-r/a)', '= (1/a^2 - 2/(a r)) e^(-r/a)']},
    questions:[
      {q:'Warum lohnt sich Weg B oft?', opts:['$rf$ zweimal abzuleiten ist kürzer als Produktregel mit $r^2$ und Division durch $r^2$.', 'Er gilt auch für Funktionen, die von $\\theta$ abhängen.', 'Er braucht keine Ableitungen.'], a:0, ex:'Weg B gilt nur für den Radialteil. Er ist der Grund für die Substitution $u = rR$ in der Radialgleichung (Thema 9).'},
      {q:'Für welche Funktion verschwindet $\\nabla^2f$ für $r > 0$?', opts:['$f = 1/r$', '$f = r$', '$f = e^{-r}$'], a:0, ex:'Mit Weg B: $r\\cdot\\frac1r = 1$, und $1\'\' = 0$. Für $f = r$ ist $\\nabla^2r = 2/r$.'}
    ]
  },
  practice:[
    {id:'ms-p1', title:'Normierung in drei Dimensionen',
      text:'Ein Zustand hat $\\psi(r) = A\\,e^{-r^2/(2b^2)}$ mit $b > 0$; er hängt nicht von $\\theta$ und $\\varphi$ ab.',
      ctx:SPH({params:{b:'pos'}, defs:{'ψ(r)':'A e^(-r^2/(2b^2))'}, unknowns:{A:{ref:'π^(-3/4) b^(-3/2)', alt:['-π^(-3/4) b^(-3/2)']}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, ph:'4π |A|^2 ∫_0^∞ r^2 e^(-r^2/b^2) dr = 1',
          hints:['Der Winkelteil gibt $4\\pi$.', '$\\int_0^\\infty r^2e^{-r^2/b^2}dr = \\frac{\\sqrt\\pi}{4}b^3$.'],
          model:['∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 r^2 sin(θ) dφ dθ dr = 1', {l:'4π |A|^2 ∫_0^∞ r^2 e^(-r^2/b^2) dr = 1', w:'Winkelintegral = 4π'}, '4π |A|^2 · sqrt(π) b^3/4 = 1', 'A = π^(-3/4) b^(-3/2)'],
          mistakes:[{expr:'(4/(sqrt(π) b^3))^(1/2)', msg:'Das ist die Normierung ohne den Winkelanteil $4\\pi$.'}, {expr:'1/sqrt(2 π^(3/2) b)', msg:'Prüfe die Einheit: In drei Dimensionen hat $A$ die Einheit $\\text{Länge}^{-3/2}$. Vermutlich fehlt $r^2$ im Maß.'}]},
        {id:'b', prompt:'b) Berechne $\\langle r^2\\rangle$.', type:'value', target:'3b^2/2', points:2, ph:'⟨r^2⟩ = 4π |A|^2 ∫_0^∞ r^4 e^(-r^2/b^2) dr',
          hints:['$\\langle r^2\\rangle = 4\\pi|A|^2\\int_0^\\infty r^4e^{-r^2/b^2}dr$ mit $|A|^2 = \\pi^{-3/2}b^{-3}$.', '$\\int_0^\\infty r^4e^{-r^2/b^2}dr = \\frac{3\\sqrt\\pi}{8}b^5$.'],
          model:['⟨r^2⟩ = 4π |A|^2 ∫_0^∞ r^4 e^(-r^2/b^2) dr', '= 4π π^(-3/2) b^(-3) · 3 sqrt(π) b^5/8', '= 3b^2/2'],
          note:'Pro Raumrichtung ist $\\langle x^2\\rangle = b^2/2$; zusammen $\\langle x^2 + y^2 + z^2\\rangle = 3b^2/2$.'}
      ]},
    {id:'ms-p2', title:'Laplace-Operator radialer Funktionen',
      text:'Für Funktionen, die nur von $r$ abhängen, gilt $\\nabla^2f = \\frac{1}{r^2}\\frac{d}{dr}\\left(r^2\\frac{df}{dr}\\right) = \\frac1r\\frac{d^2}{dr^2}(rf)$. In der Lernhilfe schreibst du `∇^2 f(r)`.',
      ctx:RAD({params:{n:{int:[1, 4]}, κ:'pos'}, defs:{'f(r)':'e^(-κ r)/r'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\nabla^2r^n$ für eine natürliche Zahl $n$.', type:'value', target:'n (n + 1) r^(n - 2)', points:2, ph:'∇^2 r^n = 1/r^2 d/dr (r^2 d/dr r^n)',
          hints:['$\\frac{d}{dr}r^n = nr^{n-1}$; dann mit $r^2$ multiplizieren und noch einmal ableiten.'],
          model:['∇^2 r^n = 1/r^2 d/dr (r^2 · n r^(n-1))', '= 1/r^2 · n (n + 1) r^n', '= n (n + 1) r^(n - 2)'],
          mistakes:[{expr:'n (n - 1) r^(n - 2)', msg:'Das ist nur $f\'\'(r)$. In drei Dimensionen kommt $\\frac2rf\'$ dazu.'}],
          note:'Kontrolle für $n = 2$: $\\nabla^2(x^2 + y^2 + z^2) = 2 + 2 + 2 = 6$.'},
        {id:'b', prompt:'b) Zeige für $f(r) = e^{-\\kappa r}/r$: $\\nabla^2f = \\kappa^2f$ für $r > 0$.', type:'show', from:'∇^2 f(r)', to:'κ^2 f(r)', points:3, ph:'∇^2 f(r) = 1/r d^2/dr^2 (r f(r))',
          hints:['Mit $rf = e^{-\\kappa r}$ ist der Weg über $\\frac1r(rf)\'\'$ kurz.'],
          model:['∇^2 f(r) = 1/r d^2/dr^2 (r f(r))', '= 1/r d^2/dr^2 e^(-κ r)', '= κ^2 e^(-κ r)/r', '= κ^2 f(r)'],
          note:'$e^{-\\kappa r}/r$ ist das Yukawa-Potential. Für $\\kappa\\to 0$ wird es zu $1/r$ mit $\\nabla^2(1/r) = 0$ für $r > 0$.'}
      ]},
    {id:'ms-p3', title:'Hermite-Polynome',
      text:'Die Hermite-Polynome erfüllen $H_{n+1}(x) = 2xH_n(x) - 2nH_{n-1}(x)$ mit $H_0 = 1$ und $H_1 = 2x$. In der Lernhilfe kennt `H_n(x)` die Polynome.',
      ctx:{coords:['x']},
      goals:[
        {id:'a', prompt:'a) Berechne $H_3(x)$ mit der Rekursion.', type:'value', target:'8x^3 - 12x', points:2, ph:'H_3(x) = 2x H_2(x) - 4 H_1(x)',
          hints:['Mit $n = 2$: $H_3 = 2xH_2 - 4H_1$, und $H_2 = 2x\\cdot 2x - 2 = 4x^2 - 2$.'],
          model:['H_3(x) = 2x H_2(x) - 4 H_1(x)', '= 2x (4x^2 - 2) - 8x', '= 8x^3 - 12x'],
          mistakes:[{expr:'8x^3 - 4x', msg:'Der zweite Term der Rekursion ist $-2nH_{n-1} = -4\\cdot 2x = -8x$.'}]},
        {id:'b', prompt:'b) Berechne $\\int_{-\\infty}^\\infty H_2(x)^2e^{-x^2}dx$ und vergleiche mit $\\sqrt\\pi\\,2^nn!$ für $n = 2$.', type:'value', target:'8 sqrt(π)', points:3, ph:'∫_-∞^∞ H_2(x)^2 e^(-x^2) dx = …',
          hints:['$(4x^2 - 2)^2 = 16x^4 - 16x^2 + 4$.', 'Über ganz $\\mathbb R$: $\\int e^{-x^2}dx = \\sqrt\\pi$, $\\int x^2e^{-x^2}dx = \\sqrt\\pi/2$, $\\int x^4e^{-x^2}dx = 3\\sqrt\\pi/4$.'],
          model:['∫_-∞^∞ H_2(x)^2 e^(-x^2) dx = ∫_-∞^∞ (16x^4 - 16x^2 + 4) e^(-x^2) dx', '= 16 · 3sqrt(π)/4 - 16 · sqrt(π)/2 + 4 sqrt(π)', '= 8 sqrt(π)'],
          mistakes:[{expr:'8', msg:'Es fehlt $\\sqrt\\pi$ aus den Gauß-Integralen.'}],
          note:'$\\sqrt\\pi\\,2^2\\,2! = 8\\sqrt\\pi$ – passt. Daher kommt der Vorfaktor $1/\\sqrt{2^nn!}$ der Oszillator-Eigenfunktionen (Thema 7).'}
      ]},
    {id:'ms-p4', title:'Legendre-Polynome und Winkelintegrale',
      text:'$P_0 = 1$, $P_1 = x$, $P_2 = \\frac12(3x^2 - 1)$. Mit $x = \\cos\\theta$ beschreiben sie die Winkelabhängigkeit von $Y_l^0$ (Thema 8).',
      ctx:{coords:['x'], domain:{x:['-1', '1']}, defs:{'P_l(x)':'legendre(l, 0, x)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_{-1}^1P_2(x)^2\\,dx$.', type:'value', target:'2/5', points:2, ph:'∫_-1^1 P_2(x)^2 dx = …',
          hints:['$\\frac14(3x^2 - 1)^2 = \\frac14(9x^4 - 6x^2 + 1)$.'],
          model:['∫_-1^1 P_2(x)^2 dx = 1/4 ∫_-1^1 (9x^4 - 6x^2 + 1) dx', '= 1/4 (18/5 - 4 + 2)', '= 2/5'],
          mistakes:[{expr:'8/5', msg:'Den Faktor $\\frac14$ aus $\\left(\\frac12\\right)^2$ nicht vergessen.'}],
          note:'Allgemein ist $\\int_{-1}^1P_l^2\\,dx = \\frac{2}{2l+1}$; für $l = 2$ also $2/5$.'},
        {id:'b', prompt:'b) Im Zustand $Y_1^0$ ist $|Y_1^0|^2 = \\frac{3}{4\\pi}\\cos^2\\theta$. Berechne $\\langle\\cos^2\\theta\\rangle = \\int\\cos^2\\theta\\,|Y_1^0|^2\\,d\\Omega$.', type:'value', target:'3/5', points:3, ph:'∫_0^π ∫_0^{2π} cos(θ)^2 · 3/(4π) cos(θ)^2 sin(θ) dφ dθ = …',
          hints:['$d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$; das $\\varphi$-Integral gibt $2\\pi$.', 'Mit $x = \\cos\\theta$ wird $\\int_0^\\pi\\cos^4\\theta\\sin\\theta\\,d\\theta = \\int_{-1}^1x^4\\,dx = 2/5$.'],
          model:['∫_0^π ∫_0^{2π} cos(θ)^2 · 3/(4π) cos(θ)^2 sin(θ) dφ dθ = 3/2 ∫_-1^1 x^4 dx', '= 3/2 · 2/5', '= 3/5'],
          mistakes:[{expr:'9π/16', msg:'Im Raumwinkelelement fehlt $\\sin\\theta$: $d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$.'}, {expr:'1/3', msg:'$1/3$ wäre der Mittelwert von $\\cos^2\\theta$ bei gleichmäßiger Verteilung über die Kugel. Hier gewichtet $|Y_1^0|^2$ die Pole stärker.'}],
          note:'Gleichmäßig verteilt wäre $\\langle\\cos^2\\theta\\rangle = 1/3$. Der Zustand $Y_1^0$ ist entlang der $z$-Achse ausgerichtet.'}
      ]},
    {id:'ms-p5', title:'Laguerre-Polynome',
      text:'$L_0 = 1$, $L_1 = 1 - x$, $L_2 = \\frac12(x^2 - 4x + 2)$, Gewicht $e^{-x}$ auf $[0, \\infty)$. Nützlich: $\\int_0^\\infty x^ke^{-x}dx = k!$.',
      ctx:{coords:['x'], domain:{x:['0', '∞']}, defs:{'L_n(x)':'laguerre(n, 0, x)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_0^\\infty L_1(x)^2e^{-x}dx$.', type:'value', target:'1', points:2, ph:'∫_0^∞ L_1(x)^2 e^(-x) dx = …',
          hints:['$(1 - x)^2 = 1 - 2x + x^2$; dann $0! - 2\\cdot 1! + 2!$.'],
          model:['∫_0^∞ L_1(x)^2 e^(-x) dx = ∫_0^∞ (1 - 2x + x^2) e^(-x) dx', '= 1 - 2 + 2', '= 1'],
          mistakes:[{expr:'3', msg:'Der Mischterm fehlt: $(1 - x)^2 = 1 - 2x + x^2$, also $0! - 2\\cdot 1! + 2! = 1$.'}, {expr:'5', msg:'Vorzeichen prüfen: $(1 - x)^2 = 1 - 2x + x^2$, nicht $1 + 2x + x^2$. Also $1 - 2 + 2$.'}]},
        {id:'b', prompt:'b) Zeige durch Rechnung: $\\int_0^\\infty L_1(x)L_2(x)e^{-x}dx = 0$.', type:'value', target:'0', points:3, ph:'∫_0^∞ L_1(x) L_2(x) e^(-x) dx = …',
          hints:['$(1 - x)(x^2 - 4x + 2) = -x^3 + 5x^2 - 6x + 2$.', 'Mit $\\int_0^\\infty x^ke^{-x}dx = k!$: $\\frac12(-6 + 10 - 6 + 2)$.'],
          model:['∫_0^∞ L_1(x) L_2(x) e^(-x) dx = 1/2 ∫_0^∞ (-x^3 + 5x^2 - 6x + 2) e^(-x) dx', '= 1/2 (-6 + 10 - 6 + 2)', '= 0'],
          note:'In den Radialfunktionen des Wasserstoffs stehen die zugeordneten Laguerre-Polynome $L_{n-l-1}^{2l+1}(2r/(na_0))$ (Thema 9).'}
      ]}
  ],
  final:[
    {q:'Welcher Bereich gehört zum Polarwinkel $\\theta$ in Kugelkoordinaten?', opts:['$0\\le\\theta\\le\\pi$', '$0\\le\\theta<2\\pi$', '$-\\pi/2\\le\\theta\\le\\pi/2$'], a:0, ex:'$\\theta$ wird von der positiven $z$-Achse aus gemessen; $\\varphi$ läuft einmal herum, von $0$ bis $2\\pi$. Manche Geografie-Konventionen nutzen die Breite $\\pi/2 - \\theta$.'},
    {task:{id:'ms-f1', title:'Kugelschale', text:'Berechne $\\int\\frac1r\\,d^3r$ über die Kugelschale $a < r < b$.',
      ctx:SPH({params:{a:'pos', b:{range:['a', '3a']}}}),
      goals:[{id:'a', prompt:'Berechne das Integral.', type:'value', target:'2π (b^2 - a^2)', points:2,
        model:['∫_a^b ∫_0^π ∫_0^{2π} 1/r · r^2 sin(θ) dφ dθ dr = 4π ∫_a^b r dr', '= 2π (b^2 - a^2)'],
        mistakes:[{expr:'4π ln(b/a)', msg:'Das Maß $r^2$ fehlt: $\\frac1r\\cdot r^2 = r$, nicht $\\frac1r$.'}]}]}},
    {q:'Welche Aussage über $\\int_{-\\infty}^\\infty H_2(x)H_4(x)e^{-x^2}dx$ stimmt?', opts:['Es ist $0$, wegen der Orthogonalität mit Gewicht $e^{-x^2}$.', 'Es ist $0$, weil der Integrand ungerade ist.', 'Es ist positiv, weil beide Polynome gerade sind.'], a:0, ex:'$H_2$ und $H_4$ sind beide gerade, der Integrand also auch – die Parität hilft hier nicht. Null ist es trotzdem, wegen der Orthogonalität.'},
    {task:{id:'ms-f2', title:'Laplace einer radialen Funktion', text:'$f(r) = r\\,e^{-r/a}$ mit $a > 0$.',
      ctx:RAD({params:{a:'pos'}}),
      goals:[{id:'a', prompt:'Berechne $\\nabla^2f$ für $r > 0$.', type:'value', target:'(2/r - 4/a + r/a^2) e^(-r/a)', points:3,
        model:['∇^2 (r e^(-r/a)) = 1/r d^2/dr^2 (r^2 e^(-r/a))', '= 1/r (2 - 4r/a + r^2/a^2) e^(-r/a)', '= (2/r - 4/a + r/a^2) e^(-r/a)'],
        mistakes:[{expr:'(r/a^2 - 2/a) e^(-r/a)', msg:'Das ist nur $f\'\'(r)$. Es fehlt $\\frac2rf\'$.'}]}]}}
  ],
  errors:[
    {id:'ms-e1', title:'Normierung ohne Volumenelement',
      text:'Eine Wellenfunktion ist innerhalb einer Kugel mit Radius $R$ konstant, $\\psi = A$, und außerhalb null. Gesucht ist $A > 0$. Jemand rechnet:',
      ctx:SPH({params:{R:'pos'}, unknowns:{A:{ref:'sqrt(3/(4π R^3))', alt:['-sqrt(3/(4π R^3))']}}}),
      lines:['∫_0^R ∫_0^π ∫_0^{2π} |A|^2 dφ dθ dr = 1', '|A|^2 2π^2 R = 1', 'A = 1/sqrt(2π^2 R)'],
      wrong:0,
      why:{q:'Was fehlt in der ersten Zeile?', opts:['das Volumenelement $r^2\\sin\\theta$', 'ein Faktor 2', 'die Grenze $2\\pi$ bei $\\theta$'], a:0, ex:'Ohne Maß hätte $A$ die Einheit $\\text{Länge}^{-1/2}$. Richtig ist $\\int|A|^2d^3r = |A|^2\\cdot\\frac43\\pi R^3$.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $A$.', type:'solve', unknown:'A', model:['∫_0^R ∫_0^π ∫_0^{2π} |A|^2 r^2 sin(θ) dφ dθ dr = 1', '|A|^2 · 4π R^3/3 = 1', 'A = sqrt(3/(4π R^3))']}},
    {id:'ms-e2', title:'Laplace wie in einer Dimension',
      text:'Gesucht ist $\\nabla^2$ der Gauß-Funktion $e^{-r^2/(2b^2)}$ in drei Dimensionen. Jemand rechnet:',
      ctx:RAD({params:{b:'pos'}}),
      lines:['∇^2 e^(-r^2/(2b^2)) = d^2/dr^2 e^(-r^2/(2b^2))', '= (r^2/b^4 - 1/b^2) e^(-r^2/(2b^2))'],
      wrong:0,
      why:{q:'Was ist in der ersten Zeile falsch?', opts:['In drei Dimensionen ist $\\nabla^2f = f\'\' + \\frac2rf\'$, nicht nur $f\'\'$.', 'Man muss nach $x$ ableiten, nicht nach $r$.', 'Nichts, die zweite Zeile ist falsch.'], a:0, ex:'Die zweite Zeile ist eine richtige Ableitung – nur von der falschen Größe. Der Term $\\frac2rf\'$ liefert hier zusätzlich $-\\frac{2}{b^2}e^{-r^2/(2b^2)}$.'},
      fix:{id:'a', prompt:'Berichtige und rechne $\\nabla^2e^{-r^2/(2b^2)}$ aus.', type:'value', target:'(r^2/b^4 - 3/b^2) e^(-r^2/(2b^2))', model:['∇^2 e^(-r^2/(2b^2)) = 1/r^2 d/dr (r^2 · (-r/b^2) e^(-r^2/(2b^2)))', '= 1/r^2 (-3r^2/b^2 + r^4/b^4) e^(-r^2/(2b^2))', '= (r^2/b^4 - 3/b^2) e^(-r^2/(2b^2))']}}
  ]
});
})();
lexe('jacobi-determinante', 'Jacobi-Determinante und Volumenelement', 'Beim Wechsel der Integrationsvariablen $(x,y,z)\\to(u,v,w)$ gilt $dx\\,dy\\,dz = \\left|\\det\\frac{\\partial(x,y,z)}{\\partial(u,v,w)}\\right|du\\,dv\\,dw$. Kugelkoordinaten: $r^2\\sin\\theta$; Zylinderkoordinaten: $\\rho$; ebene Polarkoordinaten: $r$. Beispiel: $\\int e^{-r^2}d^3r = 4\\pi\\int_0^\\infty r^2e^{-r^2}dr = \\pi^{3/2}$.', {topic:'m-spezial'});
lexe('nabla', 'Nabla und Gradient', '$\\nabla = (\\partial_x, \\partial_y, \\partial_z)$. Der Gradient $\\nabla f$ zeigt in Richtung des stärksten Anstiegs. In Kugelkoordinaten: $\\nabla f = \\partial_rf\\,\\hat e_r + \\frac1r\\partial_\\theta f\\,\\hat e_\\theta + \\frac{1}{r\\sin\\theta}\\partial_\\varphi f\\,\\hat e_\\varphi$. Für $f(r)$: $\\nabla f = f\'(r)\\,\\hat e_r$, z. B. $\\nabla r = \\vec r/r$. Impulsoperator: $\\hat{\\vec p} = -i\\hbar\\nabla$.', {topic:'m-spezial'});
lexe('laplace-operator', 'Laplace-Operator', '$\\nabla^2 = \\partial_x^2 + \\partial_y^2 + \\partial_z^2$. In Kugelkoordinaten: $\\nabla^2 = \\frac{1}{r^2}\\partial_r(r^2\\partial_r) + \\frac{1}{r^2\\sin\\theta}\\partial_\\theta(\\sin\\theta\\,\\partial_\\theta) + \\frac{1}{r^2\\sin^2\\theta}\\partial_\\varphi^2 = \\frac{1}{r^2}\\partial_r(r^2\\partial_r) - \\frac{\\hat L^2}{\\hbar^2r^2}$. Radial: $\\nabla^2f(r) = f\'\' + \\frac2rf\' = \\frac1r(rf)\'\'$. Beispiele: $\\nabla^2r^n = n(n+1)r^{n-2}$, $\\nabla^2\\frac1r = 0$ für $r > 0$. Kinetische Energie: $\\hat T = -\\frac{\\hbar^2}{2m}\\nabla^2$. In der Lernhilfe: `∇^2 f(r)`.', {topic:'m-spezial'});
lexe('hermite-polynome', 'Hermite-Polynome', '$H_0 = 1$, $H_1 = 2x$, $H_2 = 4x^2 - 2$, $H_3 = 8x^3 - 12x$; Rekursion $H_{n+1} = 2xH_n - 2nH_{n-1}$. DGL: $H\'\' - 2xH\' + 2nH = 0$. Orthogonal mit Gewicht $e^{-x^2}$: $\\int_{-\\infty}^\\infty H_nH_me^{-x^2}dx = \\sqrt\\pi\\,2^nn!\\,\\delta_{nm}$. Oszillator: $\\psi_n\\propto H_n(\\xi)e^{-\\xi^2/2}$ (Thema 7). In der Lernhilfe: `H_n(x)`.', {topic:'m-spezial'});
lexe('legendre-polynome', 'Legendre-Polynome', '$P_0 = 1$, $P_1 = x$, $P_2 = \\frac12(3x^2 - 1)$, $P_3 = \\frac12(5x^3 - 3x)$; $P_l(1) = 1$. DGL: $(1 - x^2)P\'\' - 2xP\' + l(l+1)P = 0$. Orthogonal auf $[-1, 1]$ ohne Gewicht: $\\int_{-1}^1P_lP_m\\,dx = \\frac{2}{2l+1}\\delta_{lm}$. Mit $x = \\cos\\theta$: $Y_l^0(\\theta) = \\sqrt{\\frac{2l+1}{4\\pi}}P_l(\\cos\\theta)$ (Thema 8).', {topic:'m-spezial'});
lexe('laguerre-polynome', 'Laguerre-Polynome', '$L_0 = 1$, $L_1 = 1 - x$, $L_2 = \\frac12(x^2 - 4x + 2)$; $L_n(0) = 1$. DGL: $xL\'\' + (1 - x)L\' + nL = 0$. Orthogonal auf $[0, \\infty)$ mit Gewicht $e^{-x}$: $\\int_0^\\infty L_nL_me^{-x}dx = \\delta_{nm}$. Die zugeordneten Polynome $L_n^k$ stecken in den Radialfunktionen des Wasserstoffs: $R_{nl}\\propto\\rho^le^{-\\rho/2}L_{n-l-1}^{2l+1}(\\rho)$ mit $\\rho = 2r/(na_0)$ (Thema 9). Achtung: Manche Bücher normieren anders.', {topic:'m-spezial'});
lexe('gewichtsfunktion', 'Orthogonalität mit Gewicht', 'Funktionen $f_n$ heißen orthogonal bezüglich des Gewichts $w(x) > 0$ auf $[a, b]$, wenn $\\int_a^bf_nf_m\\,w\\,dx = 0$ für $n\\ne m$. Das ist ein Skalarprodukt wie in M5, nur mit Gewicht. Hermite: $w = e^{-x^2}$ auf $\\mathbb R$; Legendre: $w = 1$ auf $[-1, 1]$; Laguerre: $w = e^{-x}$ auf $[0, \\infty)$. Steckt man $\\sqrt w$ in die Funktionen (z. B. $H_ne^{-x^2/2}$), sind sie ohne Gewicht orthogonal.', {topic:'m-spezial'});
