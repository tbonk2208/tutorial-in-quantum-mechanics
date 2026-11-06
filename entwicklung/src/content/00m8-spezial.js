/* ===== Mathe M8: Kugelkoordinaten und spezielle Funktionen ===== */
(function(){
const SPH = extra => Object.assign({coords:['r', 'θ', 'φ']}, extra || {});
const RAD = extra => Object.assign({coords:['r'], radial:true}, extra || {});
topic({
  id:'m-spezial', ch:'math', title:'Kugelkoordinaten und spezielle Funktionen', short:'Kugelkoordinaten',
  src:'Boas (3. Aufl.) Kap. 5, 10, 12 und 13 · Griffiths & Schroeter (3. Aufl.) Kap. 2.3, 4.1 und 4.2',
  goals:[
    'Ich kann Integrale in Kugelkoordinaten mit $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$ ausrechnen, besonders für Funktionen, die nur von $r$ abhängen.',
    'Ich kann den Laplace-Operator auf radiale Funktionen anwenden: $\\nabla^2f = \\frac{1}{r^2}\\frac{d}{dr}\\left(r^2\\frac{df}{dr}\\right) = \\frac1r\\frac{d^2}{dr^2}(rf)$.',
    'Ich kenne Hermite-, Legendre- und Laguerre-Polynome, ihre Orthogonalität mit Gewicht und weiß, wo sie in der Quantenmechanik vorkommen.'
  ],
  needs:'Mehrfachintegrale und partielle Ableitungen · Gauß-Integrale und $\\int_0^\\infty x^ne^{-x}dx = n!$ (M2) · Orthogonalität von Funktionen (M5)',
  wozu:'Atome, Kerne und viele Moleküle sind dreidimensional und oft kugelsymmetrisch. In Kugelkoordinaten zerfällt das Wasserstoffproblem in einfache Teile, und dieselben speziellen Funktionen tauchen immer wieder auf: Hermite-Funktionen bei Molekülschwingungen, Kugelflächenfunktionen bei der Form der Orbitale, Laguerre-Polynome in den Radialfunktionen – und damit in den Spektrallinien des Wasserstoffs.',
  bridge:'Aus M2 kommen Gauß-Integrale und $\\int_0^\\infty x^ne^{-x}dx = n!$, aus M5 Skalarprodukt und Orthogonalität von Funktionen, aus M7 die Separation und die Idee, dass Randbedingungen Eigenwerte auswählen; M9 liefert Wahrscheinlichkeitsdichte und Erwartungswert. Gebraucht wird das alles in Thema 7 (Hermite), Thema 8 (Legendre, Kugelflächenfunktionen) und Thema 9 (Kugelkoordinaten, Laguerre).',
  check:[
    {q:'Ein Punkt hat die Kugelkoordinaten $r = 2$, $\\theta = \\pi/2$, $\\varphi = 0$. Seine kartesischen Koordinaten sind …', opts:['$(2, 0, 0)$', '$(0, 0, 2)$', '$(0, 2, 0)$'], a:0, ex:'$x = r\\sin\\theta\\cos\\varphi = 2$, $y = r\\sin\\theta\\sin\\varphi = 0$, $z = r\\cos\\theta = 0$. $\\theta$ wird von der $z$-Achse aus gemessen.', lex:'kugelkoordinaten'},
    {q:'$\\int_0^\\infty x^3e^{-x}\\,dx$ ist …', opts:['$6$', '$3$', '$1$'], a:0, ex:'$\\int_0^\\infty x^ne^{-x}dx = n! = 3! = 6$.', lex:'integrale', prev:'m-analysis', seg:'ma-t4'},
    {q:'Mit $r = \\sqrt{x^2 + y^2 + z^2}$ ist $\\partial r/\\partial x$ gleich …', opts:['$x/r$', '$1$', '$2x$'], a:0, ex:'Kettenregel: $\\frac{\\partial r}{\\partial x} = \\frac{2x}{2\\sqrt{x^2 + y^2 + z^2}} = \\frac xr$. Daraus folgt $\\nabla r = \\vec r/r$.', lex:'nabla'},
    {q:'Zwei reelle Funktionen $f, g$ auf $[a, b]$ heißen orthogonal, wenn …', opts:['$\\int_a^bf(x)g(x)\\,dx = 0$', '$f(a)g(a) = 0$', '$f(x)g(x) = 0$ für alle $x$'], a:0, ex:'Orthogonal heißt: Das Skalarprodukt $\\langle f|g\\rangle = \\int f^*g\\,dx$ verschwindet. Die Funktionen dürfen sich dabei überlappen.', lex:'orthonormal', prev:'m-hilbert', seg:'mh-t1'}
  ],
  diag:[
    {q:'Wie beginnst du, um $\\int e^{-r/a}\\,d^3r$ über den ganzen Raum zu berechnen?', opts:['Winkel abspalten: $4\\pi\\int_0^\\infty r^2e^{-r/a}dr$', 'das Integral $\\int_0^\\infty e^{-r/a}dr$ dreimal nehmen', 'in kartesische Koordinaten umrechnen', 'weiß ich nicht'], a:0, ex:'Die Funktion hängt nur von $r$ ab. Das Winkelintegral gibt $4\\pi$, das Maß $r^2$ bleibt: $4\\pi\\cdot 2a^3 = 8\\pi a^3$.'},
    {q:'Wie beginnst du, um $\\nabla^2 e^{-r/a}$ zu berechnen?', opts:['Radialteil: $\\frac1r\\frac{d^2}{dr^2}(r\\,e^{-r/a})$', 'zweimal nach $r$ ableiten, das genügt', 'zuerst den Winkelteil $-\\hat L^2/\\hbar^2$ anwenden', 'weiß ich nicht'], a:0, ex:'Für radiale Funktionen ist $\\nabla^2f = \\frac1r(rf)\'\' = f\'\' + \\frac2rf\'$. Zweimal ableiten allein vergisst $\\frac2rf\'$; der Winkelteil gibt hier null.'}
  ],
  phenomenon:{
    title:'Wie leise wird es in doppeltem Abstand?',
    text:'Ein kleiner Lautsprecher strahlt Schall gleichmäßig in alle Richtungen ab. Die Schallleistung verteilt sich dabei auf Kugelflächen um den Lautsprecher; unterwegs geht keine Energie verloren.',
    q:{q:'Du gehst vom Abstand $1\\,\\mathrm{m}$ auf $2\\,\\mathrm{m}$. Wie ändert sich die Amplitude des Schalldrucks?', opts:['Sie halbiert sich.', 'Sie sinkt auf ein Viertel.', 'Sie sinkt auf ein Achtel.', 'Sie bleibt gleich.'], a:0,
      ex:'Die Intensität fällt wie $1/r^2$, die Amplitude wie $1/r$.',
      fb:[
        'Genau. Die Leistung pro Fläche (Intensität) fällt wie $1/r^2$, weil die Kugelfläche $4\\pi r^2$ wächst. Die Intensität ist proportional zum Quadrat der Amplitude; die Amplitude fällt also wie $1/r$.',
        'Ein Viertel gilt für die *Intensität*, die Leistung pro Fläche. Sie ist proportional zum Quadrat der Amplitude, die deshalb nur auf die Hälfte sinkt.',
        'Ein Achtel würde zum Volumen $\\frac43\\pi r^3$ passen. Die Leistung verteilt sich aber auf die Kugel*fläche* $4\\pi r^2$.',
        'Ohne Verluste bleibt die *Gesamt*leistung gleich, aber sie verteilt sich auf eine größere Fläche.'
      ]},
    reveal:'Die Leistung $P$ geht durch jede Kugelfläche $4\\pi r^2$. Die Intensität ist $I = P/(4\\pi r^2) \\propto 1/r^2$, die Amplitude ist $\\propto\\sqrt I \\propto 1/r$.\n\nMathematisch stecken darin zwei Bausteine dieses Themas. Erstens das Maß in Kugelkoordinaten: Eine Kugelschale hat das Volumen $4\\pi r^2\\,dr$. Zweitens der Laplace-Operator für radiale Funktionen: Die Kugelwelle $u = e^{ikr}/r$ löst $\\nabla^2u = -k^2u$, weil $\\nabla^2u = \\frac1r\\frac{d^2}{dr^2}(ru)$ ist und $ru = e^{ikr}$ eine einfache Schwingung. Derselbe Trick $u(r) = rR(r)$ macht später die Radialgleichung des Wasserstoffatoms einfach (Thema 9).'
  },
  teach:[
    {id:'ms-t1', title:'Kugelkoordinaten und das Volumenelement',
      text:'Viele Probleme der Quantenmechanik sind kugelsymmetrisch: Das Coulomb-Potential des Kerns hängt nur vom Abstand ab. Dann sind [[lex:kugelkoordinaten|Kugelkoordinaten]] die natürliche Wahl:\n\n$$x = r\\sin\\theta\\cos\\varphi, \\quad y = r\\sin\\theta\\sin\\varphi, \\quad z = r\\cos\\theta,$$\n\nmit $r \\ge 0$, $0 \\le \\theta \\le \\pi$ und $0 \\le \\varphi < 2\\pi$. Der Polarwinkel $\\theta$ wird von der positiven $z$-Achse aus gemessen, der Azimut $\\varphi$ in der $xy$-Ebene von der $x$-Achse aus.\n\nBeim Integrieren braucht man das **Volumenelement**. Ändert man $r$, $\\theta$ und $\\varphi$ um $dr$, $d\\theta$ und $d\\varphi$, überstreicht man ein kleines, fast quaderförmiges Stück. Seine Kanten sind:\n\n- in radialer Richtung $dr$,\n- in $\\theta$-Richtung ein Stück Großkreis mit Radius $r$, also $r\\,d\\theta$,\n- in $\\varphi$-Richtung ein Stück Breitenkreis mit Radius $r\\sin\\theta$, also $r\\sin\\theta\\,d\\varphi$.\n\nDas Produkt ergibt\n\n$$d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi = r^2\\,dr\\,d\\Omega, \\qquad d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi.$$\n\nDasselbe liefert formal die [[lex:jacobi-determinante|Jacobi-Determinante]] der Koordinatentransformation. $d\\Omega$ heißt Raumwinkelelement; über alle Richtungen ist $\\int d\\Omega = 4\\pi$ (Herleitung unten). Der Faktor $\\sin\\theta$ gibt den Breitenkreisen nahe den Polen weniger Gewicht – sie sind kürzer.\n\nMit $u = \\cos\\theta$ und $du = -\\sin\\theta\\,d\\theta$ wird ein Winkelintegral oft zu einem Polynomintegral: $\\int_0^\\pi g(\\cos\\theta)\\sin\\theta\\,d\\theta = \\int_{-1}^1 g(u)\\,du$. Diese Substitution führt direkt zu den Legendre-Polynomen (Abschnitt 4).\n\n**Typische Fehler:** das Maß vergessen ($dr\\,d\\theta\\,d\\varphi$ statt $r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$) und die Grenzen vertauschen ($\\theta$ bis $2\\pi$). Beide fallen bei einer Kontrolle auf: Ohne $r^2$ stimmt die Einheit nicht mehr, und mit $\\theta$ bis $2\\pi$ wird $\\int_0^{2\\pi}\\sin\\theta\\,d\\theta = 0$ – der Raumwinkel verschwände. Ein kurzer Test lohnt sich immer: Für das Volumen einer Kugel muss $\\frac43\\pi R^3$ herauskommen.',
      derive:{ctx:SPH({}),
        lines:[
          {l:'∫_0^π ∫_0^{2π} sin(θ) dφ dθ = 2π ∫_0^π sin(θ) dθ', w:'φ-Integral', why:{q:'Warum gibt das $\\varphi$-Integral einfach $2\\pi$?', opts:['Der Integrand hängt nicht von $\\varphi$ ab.', 'weil $\\sin\\theta$ nach Mittelung $1$ ist', 'weil $\\varphi$ bis $\\pi$ läuft und doppelt zählt'], a:0, ex:'$\\int_0^{2\\pi}d\\varphi = 2\\pi$. Hängt der Integrand von $\\varphi$ ab, muss man wirklich integrieren.'}},
          {l:'= 2π [-cos(θ)]_0^π', w:'Stammfunktion'},
          {l:'= 4π', w:'voller Raumwinkel', why:{q:'Woher kommt der Faktor 2 im $\\theta$-Teil?', opts:['$-\\cos\\pi + \\cos 0 = 1 + 1 = 2$', 'aus den zwei Polen der Kugel, je einer zählt $1$', 'aus $\\sin^2\\theta + \\cos^2\\theta = 1$, doppelt genommen'], a:0, ex:'$[-\\cos\\theta]_0^\\pi = -(-1) - (-1) = 2$. Zusammen $2\\pi\\cdot 2 = 4\\pi$, die Oberfläche der Einheitskugel.'}}
        ]},
      q:[
        {q:'Ein Punkt hat $r = 3$, $\\theta = \\pi$ und $\\varphi = \\pi/2$. Wo liegt er?', opts:['bei $(0, 0, -3)$', 'bei $(0, 3, 0)$', 'bei $(0, -3, 0)$'], a:0, ex:'$\\theta = \\pi$ heißt: genau auf der negativen $z$-Achse. Dort spielt $\\varphi$ keine Rolle, denn $\\sin\\pi = 0$.'},
        {q:'Welchen Wert hat $\\int_0^\\pi\\!\\int_0^{2\\pi}\\cos^2\\theta\\,\\sin\\theta\\,d\\varphi\\,d\\theta$?', opts:['$4\\pi/3$', '$\\pi^2$', '$0$'], a:0, ex:'Das $\\varphi$-Integral gibt $2\\pi$; mit $u = \\cos\\theta$ ist $\\int_{-1}^1u^2du = 2/3$. Zusammen $4\\pi/3$.'}
      ]},
    {id:'ms-t2', title:'Radiale Funktionen und die radiale Wahrscheinlichkeitsdichte',
      text:'Hängt eine Funktion nur vom Abstand ab, $f = f(r)$, kannst du die Winkel sofort ausintegrieren:\n\n$$\\int f(r)\\,d^3r = \\int_0^\\infty f(r)\\,r^2\\,dr\\int d\\Omega = 4\\pi\\int_0^\\infty f(r)\\,r^2\\,dr.$$\n\nAnschaulich zerlegst du den Raum in dünne Kugelschalen. Eine Schale mit Radius $r$ und Dicke $dr$ hat das Volumen $4\\pi r^2\\,dr$. Die Schalen werden nach außen immer größer – das ist der Faktor $r^2$.\n\nFür die Quantenmechanik ist das zentral. Ist $\\psi(r)$ eine kugelsymmetrische Wellenfunktion, dann ist $|\\psi|^2$ die Wahrscheinlichkeitsdichte **pro Volumen** ([[lex:stat-dichte|Dichte]], M9). Die Wahrscheinlichkeit, das Teilchen im Abstand zwischen $r$ und $r + dr$ zu finden, ist dagegen\n\n$$P(r)\\,dr = |\\psi(r)|^2\\,4\\pi r^2\\,dr.$$\n\n$P(r) = 4\\pi r^2|\\psi|^2$ heißt [[lex:sph-radiale-dichte|radiale Wahrscheinlichkeitsdichte]]. Sie ist pro *Länge* normiert: $\\int_0^\\infty P(r)\\,dr = 1$.\n\nBeispiel Wasserstoff-Grundzustand: $\\psi = A\\,e^{-r/a}$ mit dem [[lex:bohrradius|Bohrradius]] $a$. Die Normierung (Herleitung unten) ergibt $A = 1/\\sqrt{\\pi a^3}$. Die Dichte $|\\psi|^2$ ist am Kern ($r = 0$) am größten. Die radiale Dichte $P(r) = \\frac{4}{a^3}r^2e^{-2r/a}$ ist dort aber null und hat ihr Maximum bei $r = a$: Aus $\\frac{d}{dr}(r^2e^{-2r/a}) = (2r - 2r^2/a)\\,e^{-2r/a} = 0$ folgt $r = a$. Der wahrscheinlichste *Abstand* ist also der Bohrradius, obwohl die Dichte pro Volumen innen am größten ist. Beide Aussagen stimmen; sie beantworten verschiedene Fragen.\n\nErwartungswerte funktionieren genauso: $\\langle r\\rangle = \\int_0^\\infty r\\,P(r)\\,dr$. Für den Grundzustand ergibt sich $\\langle r\\rangle = \\frac32a$ – größer als der wahrscheinlichste Abstand, weil $P(r)$ nach außen langsam abfällt.\n\n**Typische Fehlvorstellung:** „Wo $|\\psi|^2$ am größten ist, liegt auch der wahrscheinlichste Abstand.“ Das verwechselt Dichte pro Volumen mit Dichte pro Abstand. Der Faktor $4\\pi r^2$ macht den Unterschied. Im Bild daneben siehst du $r^2|R_{nl}|^2$ für mehrere Zustände des Wasserstoffatoms.',
      fig:{lab:'hydrogen', caption:'Radiale Wahrscheinlichkeitsdichte $r^2|R_{nl}|^2$ des Wasserstoffatoms. Für $n = 1$ liegt das Maximum bei $r = a_0$, obwohl $|\\psi|^2$ am Kern am größten ist; die rote Linie zeigt $\\langle r\\rangle$.'},
      derive:{ctx:SPH({params:{a:'pos'}, defs:{'ψ(r)':'A e^(-r/a)'}, unknowns:{A:{ref:'1/sqrt(π a^3)', alt:['-1/sqrt(π a^3)']}}}),
        lines:[
          {l:'∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 r^2 sin(θ) dφ dθ dr = 1', w:'Normierung mit vollem Maß'},
          {l:'4π |A|^2 ∫_0^∞ r^2 e^(-2r/a) dr = 1', w:'Winkelintegral = 4π', why:{q:'Woher kommt $e^{-2r/a}$?', opts:['$|e^{-r/a}|^2 = e^{-2r/a}$', 'aus dem Maß $r^2$, abgeleitet', 'aus der Substitution $u = 2r$'], a:0, ex:'Das Betragsquadrat verdoppelt den Exponenten.'}},
          {l:'4π |A|^2 · 2!/(2/a)^3 = 1', w:'∫ xⁿ e^(−kx) dx = n!/k^(n+1)', why:{q:'Welche Regel steckt hier?', opts:['$\\int_0^\\infty r^ne^{-kr}dr = n!/k^{n+1}$ mit $n = 2$, $k = 2/a$', '$\\int_0^\\infty r^2e^{-kr}dr = 1/k^2$ mit $k = 2/a$', 'partielle Integration ohne Randterme, $= 2/k$'], a:0, ex:'$2!/(2/a)^3 = 2a^3/8 = a^3/4$.'}},
          {l:'π |A|^2 a^3 = 1'},
          {l:'A = 1/sqrt(π a^3)', w:'Einheit Länge^(−3/2)', why:{q:'Welche Einheit muss $A$ in drei Dimensionen haben?', opts:['$\\text{Länge}^{-3/2}$, damit $|\\psi|^2d^3r$ dimensionslos ist', '$\\text{Länge}^{-1/2}$, wie in einer Dimension', 'keine, weil $\\psi$ eine Wahrscheinlichkeit ist'], a:0, ex:'$d^3r$ hat die Einheit $\\text{Länge}^3$, also $|\\psi|^2$ die Einheit $\\text{Länge}^{-3}$.'}}
        ]},
      q:[
        {q:'Für $\\psi = e^{-r/a}/\\sqrt{\\pi a^3}$: Wo ist $|\\psi|^2$ am größten, wo $P(r) = 4\\pi r^2|\\psi|^2$?', opts:['$|\\psi|^2$ bei $r = 0$, $P(r)$ bei $r = a$', 'beide bei $r = 0$, am Kern', 'beide bei $r = a$, am Bohrradius'], a:0, ex:'$|\\psi|^2 \\propto e^{-2r/a}$ fällt von innen nach außen. $P(r) \\propto r^2e^{-2r/a}$ beginnt bei null, weil die innersten Schalen kein Volumen haben.'},
        {q:'Eine Wellenfunktion ist in einer Kugel mit Radius $R$ konstant und außerhalb null. Welcher Abstand ist am wahrscheinlichsten?', opts:['$r = R$, am Rand', '$r = 0$, im Mittelpunkt', 'alle Abstände gleich'], a:0, ex:'$P(r) \\propto r^2$ wächst bis zum Rand. Konstante Dichte pro Volumen heißt nicht konstante Dichte pro Abstand.'}
      ]},
    {id:'ms-t3', title:'Der Laplace-Operator in Kugelkoordinaten',
      text:'Die kinetische Energie ist $\\hat T = -\\frac{\\hbar^2}{2m}\\nabla^2$. In drei Dimensionen brauchst du deshalb den [[lex:laplace-operator|Laplace-Operator]] in Kugelkoordinaten:\n\n$$\\nabla^2 = \\frac{1}{r^2}\\frac{\\partial}{\\partial r}\\left(r^2\\frac{\\partial}{\\partial r}\\right) + \\frac{1}{r^2}\\left[\\frac{1}{\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial}{\\partial\\theta}\\right) + \\frac{1}{\\sin^2\\theta}\\frac{\\partial^2}{\\partial\\varphi^2}\\right].$$\n\nDie eckige Klammer enthält nur Winkel. Sie ist bis auf einen Faktor der Drehimpulsoperator: $[\\dots] = -\\hat L^2/\\hbar^2$ (Thema 8). Deshalb lässt sich die Schrödingergleichung mit kugelsymmetrischem Potential in einen Radial- und einen Winkelteil separieren (M7).\n\nFür eine **radiale** Funktion $f(r)$ verschwinden alle Winkelableitungen. Woher kommt der Radialteil? Mit der Kettenregel und $\\partial r/\\partial x = x/r$ ([[lex:nabla|Gradient]]) ist\n\n$$\\partial_x f = f\'(r)\\,\\frac xr, \\qquad \\partial_x^2 f = f\'\'\\,\\frac{x^2}{r^2} + f\'\\left(\\frac1r - \\frac{x^2}{r^3}\\right).$$\n\nDasselbe gilt für $y$ und $z$. Addiert man alle drei und benutzt $x^2 + y^2 + z^2 = r^2$, folgt\n\n$$\\nabla^2f = f\'\' + f\'\\left(\\frac3r - \\frac1r\\right) = f\'\' + \\frac2r\\,f\'.$$\n\nDer Term $\\frac2rf\'$ ist der Unterschied zur eindimensionalen Rechnung. Er stammt daher, dass die Kugelflächen nach außen wachsen. Zwei gleichwertige Schreibweisen sind nützlich (Herleitung unten):\n\n$$\\nabla^2f = \\frac{1}{r^2}\\frac{d}{dr}\\left(r^2\\frac{df}{dr}\\right) = \\frac1r\\frac{d^2}{dr^2}(rf).$$\n\nDie zweite Form ist oft am schnellsten. Beispiel $f = e^{-r/a}$: Es ist $(re^{-r/a})\'\' = \\left(\\frac{r}{a^2} - \\frac2a\\right)e^{-r/a}$, also $\\nabla^2f = \\left(\\frac{1}{a^2} - \\frac{2}{ar}\\right)e^{-r/a}$. Den zweiten Term übersieht, wer nur $f\'\'$ rechnet. Ebenso siehst du sofort: $\\nabla^2\\frac1r = \\frac1r\\cdot(1)\'\' = 0$ für $r > 0$. Und für $u(r) = rf(r)$ wird $\\nabla^2f = u\'\'/r$. Diese Substitution macht aus der dreidimensionalen Radialgleichung eine eindimensionale Gleichung für $u$ (Thema 9).\n\n**Typische Fehlvorstellung:** „Für radiale Funktionen ist $\\nabla^2f = f\'\'$.“ Das gilt nur in einer Dimension. In drei Dimensionen fehlt sonst $\\frac2rf\'$. Die Kontrolle: $\\nabla^2r^2 = \\nabla^2(x^2 + y^2 + z^2) = 6$, nicht $2$.',
      derive:{ctx:RAD({abstract:{f:{args:['r']}}}),
        lines:[
          {l:'1/r^2 d/dr (r^2 d/dr f(r)) = 1/r^2 (2r d/dr f(r) + r^2 d^2/dr^2 f(r))', w:'Produktregel', why:{q:'Welche Regel wird hier angewandt?', opts:['Produktregel für $r^2\\cdot f\'(r)$', 'Kettenregel mit $u = r^2$', 'partielle Integration nach $r$'], a:0, ex:'$(r^2f\')\' = 2rf\' + r^2f\'\'$.'}},
          {l:'= d^2/dr^2 f(r) + 2/r d/dr f(r)', w:'durch r² teilen'},
          {l:'1/r d^2/dr^2 (r f(r)) = 1/r d/dr (f(r) + r d/dr f(r))', w:'zweite Form: einmal ableiten'},
          {l:'= 1/r (2 d/dr f(r) + r d^2/dr^2 f(r))', w:'noch einmal ableiten', why:{q:'Woher kommt die $2$ vor $f\'$?', opts:['$f\'$ entsteht zweimal: aus $f$ und aus $(r\\,f\')\'$', 'aus dem Faktor $r^2$ der ersten Form', 'aus der Kettenregel mit $\\partial r/\\partial x$'], a:0, ex:'$(f + rf\')\' = f\' + f\' + rf\'\' = 2f\' + rf\'\'$.'}},
          {l:'= d^2/dr^2 f(r) + 2/r d/dr f(r)', w:'beide Formen sind gleich'}
        ]},
      q:[
        {q:'Was ist $\\nabla^2 r^2$ in drei Dimensionen?', opts:['$6$', '$2$', '$4r$'], a:0, ex:'$\\frac1r(r^3)\'\' = \\frac1r\\cdot 6r = 6$. Kartesisch: $\\nabla^2(x^2 + y^2 + z^2) = 2 + 2 + 2$. Die $2$ wäre nur $f\'\'$.'},
        {q:'Welche Rolle spielt die Substitution $u(r) = r\\,R(r)$?', opts:['Sie macht $\\nabla^2R$ zu $u\'\'/r$, also eindimensional.', 'Sie normiert die Radialfunktion auf $1$.', 'Sie entfernt den Winkelteil aus $\\nabla^2$.'], a:0, ex:'$\\nabla^2R = \\frac1r(rR)\'\' = u\'\'/r$. Den Winkelteil trennt die Separation ab, nicht die Substitution.'}
      ]},
    {id:'ms-t4', title:'Orthogonale Polynome mit Gewicht',
      text:'Drei Familien von Polynomen tauchen in der Quantenmechanik immer wieder auf: Hermite, Legendre und Laguerre. Sie lösen DGL mit **nicht konstanten** Koeffizienten, etwa die Hermite-Gleichung $H\'\' - 2xH\' + 2nH = 0$. Der Exponentialansatz aus M7 hilft dort nicht. Man setzt eine Potenzreihe an und findet: Brauchbare (normierbare) Lösungen gibt es nur, wenn die Reihe abbricht – dann ist die Lösung ein Polynom vom Grad $n$. Diese Abbruchbedingung wirkt wie eine Randbedingung und erzeugt diskrete Eigenwerte, zum Beispiel $E_n = \\hbar\\omega(n + \\tfrac12)$ beim Oszillator.\n\nIhre wichtigste Eigenschaft ist die Orthogonalität **bezüglich einer [[lex:gewichtsfunktion|Gewichtsfunktion]]** $w(x) > 0$ auf einem festen Intervall:\n\n$$\\int_a^b p_n(x)\\,p_m(x)\\,w(x)\\,dx = 0 \\qquad (n \\ne m).$$\n\nDas ist ein Skalarprodukt wie in M5, nur mit Gewicht. Für die drei Familien:\n\n- [[lex:hermite-polynome|Hermite]] $H_n$: Gewicht $e^{-x^2}$ auf $(-\\infty, \\infty)$, $\\int H_n^2e^{-x^2}dx = \\sqrt\\pi\\,2^nn!$.\n- [[lex:legendre-polynome|Legendre]] $P_l$: Gewicht $1$ auf $[-1, 1]$, $\\int P_l^2\\,dx = \\frac{2}{2l + 1}$.\n- [[lex:laguerre-polynome|Laguerre]] $L_n$: Gewicht $e^{-x}$ auf $[0, \\infty)$, $\\int L_n^2e^{-x}dx = 1$.\n\nWarum ein Gewicht? Ohne $e^{-x^2}$ existiert $\\int H_0H_2\\,dx$ auf der ganzen Achse gar nicht, denn Polynome wachsen. Das Gewicht macht die Integrale endlich. Steckt man $\\sqrt w$ in die Funktionen, sind sie ohne Gewicht orthogonal: Die $H_n(x)\\,e^{-x^2/2}$ sind die Eigenfunktionen des Oszillators.\n\nEin Beispiel (Herleitung unten): $H_0 = 1$ und $H_2 = 4x^2 - 2$ sind orthogonal, weil $\\int(4x^2 - 2)e^{-x^2}dx = 4\\cdot\\frac{\\sqrt\\pi}{2} - 2\\sqrt\\pi = 0$. Die Parität hilft hier nicht – beide sind gerade.\n\nZwei Eigenschaften helfen beim Skizzieren und Prüfen:\n\n- $H_n$, $P_n$ und $L_n$ haben genau $n$ einfache Nullstellen im Orthogonalitätsbereich. Deshalb hat $\\psi_n$ beim Oszillator $n$ Knoten.\n- $H_n$ und $P_n$ haben die Parität $(-1)^n$: gerade für gerades $n$, ungerade für ungerades $n$.\n\n**Typische Fehlvorstellungen:** „Orthogonal heißt, das Produkt ist überall null“ und „Orthogonalität folgt immer aus der Parität“. Beides ist falsch. Orthogonale Funktionen überlappen sich; nur ihr gewichtetes Integral verschwindet. Die Parität erledigt nur Paare mit verschiedener Parität.',
      fig:{lab:'special', caption:'Hermite-Funktionen, Legendre- und Laguerre-Polynome: Zahl der Nullstellen und das Orthogonalitätsintegral mit Gewicht für zwei wählbare Grade $n$ und $m$.'},
      derive:{ctx:{coords:['x']},
        lines:[
          {l:'∫_-∞^∞ H_0(x) H_2(x) e^(-x^2) dx = ∫_-∞^∞ (4x^2 - 2) e^(-x^2) dx', w:'H₀ = 1, H₂ = 4x² − 2'},
          {l:'= 4 · sqrt(π)/2 - 2 sqrt(π)', w:'Gauß-Integrale', why:{q:'Welche Gauß-Integrale werden benutzt?', opts:['$\\int x^2e^{-x^2}dx = \\frac{\\sqrt\\pi}{2}$ und $\\int e^{-x^2}dx = \\sqrt\\pi$', '$\\int x^2e^{-x^2}dx = \\sqrt\\pi$ und $\\int e^{-x^2}dx = \\frac{\\sqrt\\pi}{2}$', '$\\int x^2e^{-x^2}dx = 0$, weil $x^2e^{-x^2}$ ungerade ist'], a:0, ex:'Allgemein $\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1$.'}},
          {l:'= 0', w:'orthogonal mit Gewicht', why:{q:'Warum ist dieses Ergebnis bemerkenswert?', opts:['Beide Funktionen sind gerade; die Parität erklärt die Null nicht.', 'Weil Integrale über gerade Funktionen sonst immer null sind.', 'Weil $H_2$ an jeder Stelle null ist.'], a:0, ex:'Die Null kommt aus der genauen Form von $H_2$ zusammen mit dem Gewicht – das ist Orthogonalität.'}}
        ]},
      q:[
        {q:'Ist $\\int_{-1}^1 P_1(x)P_3(x)\\,dx = 0$ eine Folge der Parität?', opts:['Nein: beide ungerade, es folgt aus der Orthogonalität.', 'Ja: Das Produkt zweier ungerader ist ungerade.', 'Nein: Das Integral ist gar nicht null.'], a:0, ex:'$P_1P_3$ ist gerade (ungerade mal ungerade). Null ist das Integral trotzdem, weil die Legendre-Polynome orthogonal sind.'},
        {q:'Wie viele Knoten hat die Oszillator-Eigenfunktion $\\psi_4 \\propto H_4(\\xi)\\,e^{-\\xi^2/2}$?', opts:['$4$', '$5$', '$2$'], a:0, ex:'$H_4$ hat vier einfache reelle Nullstellen; $e^{-\\xi^2/2}$ hat keine.'}
      ]},
    {id:'ms-t5', title:'Wo die speziellen Funktionen in der Quantenmechanik stehen',
      text:'Jede der drei Familien gehört zu einem Grundproblem. Hier der Überblick, damit du sie in Thema 7 bis 9 wiedererkennst.\n\n**Hermite – harmonischer Oszillator (Thema 7).** Mit der dimensionslosen Länge $\\xi = x\\sqrt{m\\omega/\\hbar}$ sind die Eigenfunktionen\n\n$$\\psi_n(x) \\propto H_n(\\xi)\\,e^{-\\xi^2/2}.$$\n\nDer Gauß-Faktor stammt vom Gewicht, das Polynom liefert die Knoten. Die Rekursion $H_{n+1} = 2xH_n - 2nH_{n-1}$ erzeugt alle $H_n$ aus $H_0 = 1$ und $H_1 = 2x$.\n\n**Legendre – Winkelabhängigkeit (Thema 8).** Mit $x = \\cos\\theta$ werden die Legendre-Polynome zu Funktionen auf der Kugel. Für $m = 0$ gilt\n\n$$Y_l^0(\\theta) = \\sqrt{\\frac{2l + 1}{4\\pi}}\\,P_l(\\cos\\theta).$$\n\nDer Vorfaktor folgt aus der Normierung über die Kugel; die Herleitung unten zeigt das für $l = 1$. Die [[lex:kugelflaechenfunktionen|Kugelflächenfunktionen]] $Y_l^m$ mit $m \\ne 0$ enthalten zusätzlich $e^{im\\varphi}$ und zugeordnete Legendre-Funktionen. Sie beschreiben die Form der Orbitale: $|Y_1^0|^2 \\propto \\cos^2\\theta$ ist die Hantel des $p_z$-Orbitals.\n\n**Laguerre – Radialfunktionen des Wasserstoffs (Thema 9).** Die [[lex:radialfunktionen|Radialfunktionen]] haben die Form\n\n$$R_{nl}(r) \\propto \\rho^l\\,e^{-\\rho/2}\\,L_{n-l-1}^{2l+1}(\\rho), \\qquad \\rho = \\frac{2r}{na_0},$$\n\nmit zugeordneten Laguerre-Polynomen $L_k^\\alpha$. Die Zahl der radialen Knoten ist $n - l - 1$, der Grad dieses Polynoms. Bücher normieren die Laguerre-Polynome unterschiedlich – benutze Formeln immer zusammen aus derselben Quelle.\n\nAllen drei Fällen ist dasselbe Muster gemeinsam. Die Separation (M7) zerlegt die Schrödingergleichung in Teilgleichungen. Diese haben Polynomlösungen mal einem Gewichtsfaktor. Die Forderung „normierbar“ bzw. „überall endlich“ lässt nur ganzzahlige Grade zu. Daraus kommen die Quantenzahlen $n$, $l$ und $m$.\n\nSo erkennst du die Funktionen in einer Aufgabe wieder: Steht ein Polynom mal $e^{-\\xi^2/2}$ da, ist es ein Oszillatorzustand, und die Zahl der Nullstellen ist die Quantenzahl $n$. Hängt eine Funktion nur über $\\cos\\theta$ vom Winkel ab, ist sie eine Kombination von Legendre-Polynomen. Ein Polynom in $r$ mal $e^{-r/(na_0)}$ ist eine Radialfunktion des Wasserstoffs zur Hauptquantenzahl $n$.',
      fig:{lab:'ylm', caption:'$|Y_l^m|^2$ als Polardiagramm in der $xz$-Ebene. Für $l = 1$, $m = 0$ entsteht die Hantel $\\propto\\cos^2\\theta$ entlang der $z$-Achse.'},
      derive:{ctx:{coords:['θ', 'φ'], space:['θ', 'φ'], measure:'sin(θ)', params:{}},
        lines:[
          {l:'∫_0^π ∫_0^{2π} 3/(4π) cos(θ)^2 sin(θ) dφ dθ = 3/2 ∫_0^π cos(θ)^2 sin(θ) dθ', w:'|Y₁⁰|² = 3/(4π) cos²θ; φ-Integral = 2π'},
          {l:'= 3/2 ∫_-1^1 u^2 du', w:'u = cos θ', why:{q:'Warum laufen die neuen Grenzen von $-1$ bis $1$?', opts:['$du = -\\sin\\theta\\,d\\theta$ dreht die Grenzen $1 \\to -1$ wieder um.', 'weil $\\cos\\theta$ immer zwischen $-1$ und $1$ liegt, egal wie', 'weil man $u$ beliebig wählen darf'], a:0, ex:'Bei $\\theta = 0$ ist $u = 1$, bei $\\theta = \\pi$ ist $u = -1$. Das Minus aus $du = -\\sin\\theta\\,d\\theta$ vertauscht die Grenzen zurück.'}},
          {l:'= 3/2 · 2/3'},
          {l:'= 1', w:'Y₁⁰ ist normiert'}
        ]},
      q:[
        {q:'Wie viele radiale Knoten hat $R_{31}$?', opts:['$1$', '$2$', '$3$'], a:0, ex:'$n - l - 1 = 3 - 1 - 1 = 1$: Grad des Laguerre-Polynoms $L_1^3$.'},
        {q:'Warum steht in $\\psi_n \\propto H_n(\\xi)\\,e^{-\\xi^2/2}$ der Faktor $e^{-\\xi^2/2}$ und nicht $e^{-\\xi^2}$?', opts:['So enthält $\\psi_n\\psi_m$ genau das Gewicht $e^{-\\xi^2}$.', 'Weil $e^{-\\xi^2}$ nicht normierbar wäre.', 'Das ist eine Konvention ohne Folgen.'], a:0, ex:'$\\int\\psi_n\\psi_m\\,d\\xi \\propto \\int H_nH_me^{-\\xi^2}d\\xi$. So wird die Orthogonalität der Eigenfunktionen genau die der Hermite-Polynome.'}
      ]}
  ],
  example:{
    title:'Volumen und mittlerer Abstand in einer Kugel',
    text:'Eine Kugel mit Radius $R$ ist gleichmäßig gefüllt. Berechne ihr Volumen $V_K$ und den mittleren Abstand $r_m$ vom Mittelpunkt.',
    ctx:SPH({params:{R:'pos'}}),
    lines:[
      {l:'V_K = ∫_0^R ∫_0^π ∫_0^{2π} r^2 sin(θ) dφ dθ dr', why:{q:'Warum steht $r^2\\sin\\theta$ im Integranden?', opts:['Das ist das Volumenelement in Kugelkoordinaten.', 'weil die Kugel rund ist und der Radius quadriert wird', 'Das ist die Massendichte der gefüllten Kugel.'], a:0, ex:'Ein kleiner Quader mit den Kanten $dr$, $r\\,d\\theta$ und $r\\sin\\theta\\,d\\varphi$ hat das Volumen $r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$ (Jacobi-Determinante).'}},
      {l:'= 2π · 2 · R^3/3', why:{q:'Warum zerfällt das Integral in drei Faktoren?', opts:['Produkt aus Funktionen je einer Variablen, feste Grenzen', 'Das geht bei jedem Dreifachintegral, auch mit variablen Grenzen.', 'weil $\\sin\\theta$ auf $[0, \\pi]$ konstant ist'], a:0, ex:'$\\int_0^{2\\pi}d\\varphi = 2\\pi$, $\\int_0^\\pi\\sin\\theta\\,d\\theta = 2$, $\\int_0^Rr^2\\,dr = R^3/3$.'}},
      {l:'= 4π R^3/3', why:{q:'Woran erkennst du, dass das stimmt?', opts:['Bekanntes Kugelvolumen; $4\\pi$ ist der volle Raumwinkel.', 'An der Einheit: Ein Volumen hat die Einheit $\\text{Länge}^2$.', 'Gar nicht, man muss dem Rechenweg vertrauen.'], a:0, ex:'$\\int d\\Omega = \\int_0^\\pi\\!\\int_0^{2\\pi}\\sin\\theta\\,d\\varphi\\,d\\theta = 4\\pi$. Die Einheit ist $\\text{Länge}^3$.'}},
      {l:'r_m = 1/V_K ∫_0^R ∫_0^π ∫_0^{2π} r · r^2 sin(θ) dφ dθ dr', why:{q:'Was berechnet diese Zeile?', opts:['den mittleren Abstand vom Mittelpunkt', 'die Oberfläche der Kugel mit Radius $R$', 'noch einmal das Volumen, nur gewichtet'], a:0, ex:'Mittelwert $= \\frac{1}{V_K}\\int r\\,d^3r$. Die konstante Dichte $1/V_K$ ist auf 1 normiert.'}},
      {l:'= 3/(4π R^3) · 4π R^4/4', why:{q:'Woher kommt $R^4/4$?', opts:['$\\int_0^Rr\\cdot r^2\\,dr = R^4/4$; der Winkelteil gibt $4\\pi$.', 'aus dem Volumen $R^3/3$, mal $R$ genommen', 'aus der Ableitung des Volumens nach $R$'], a:0, ex:'Das Maß $r^2$ gehört immer dazu, auch beim Mittelwert.'}},
      {l:'= 3R/4', why:{q:'Warum liegt der Mittelwert über $R/2$?', opts:['Außen liegt mehr Volumen: Die Schale wächst mit $r^2$.', 'Weil die Dichte außen größer ist als innen.', 'Ein Rechenfehler, richtig wäre genau $R/2$.'], a:0, ex:'Der Abstand ist mit $P(r) = 3r^2/R^3$ verteilt, nicht gleichmäßig in $r$. Dieselbe Rolle spielt $r^2$ beim Wasserstoffatom (Thema 9).'}}
    ],
    faded:{id:'ms-fade', title:'Jetzt du: Gauß-Funktion im Raum',
      text:'Berechne $\\int e^{-r^2/a^2}\\,d^3r$ über den ganzen Raum ($a > 0$). Nützlich: $\\int_0^\\infty r^2e^{-r^2/a^2}dr = \\frac{\\sqrt\\pi}{4}a^3$.',
      ctx:SPH({params:{a:'pos'}}),
      given:['∫_0^∞ ∫_0^π ∫_0^{2π} e^(-r^2/a^2) r^2 sin(θ) dφ dθ dr = 4π ∫_0^∞ r^2 e^(-r^2/a^2) dr'],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'value', target:'π^(3/2) a^3', points:2,
        hints:['Der Winkelteil ist schon erledigt; es fehlt nur noch das Radialintegral.', 'Setze das angegebene Radialintegral $\\frac{\\sqrt\\pi}{4}a^3$ ein.', '$4\\pi\\cdot\\frac{\\sqrt\\pi}{4} = \\pi^{3/2}$.'],
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
    core:'**Kugelkoordinaten:** $x = r\\sin\\theta\\cos\\varphi$, $y = r\\sin\\theta\\sin\\varphi$, $z = r\\cos\\theta$ mit $r\\ge 0$, $0\\le\\theta\\le\\pi$, $0\\le\\varphi<2\\pi$. Die Jacobi-Determinante liefert das Volumenelement\n\n$$d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi = r^2\\,dr\\,d\\Omega,\\qquad \\int d\\Omega = 4\\pi.$$\n\nFür Funktionen nur von $r$ gilt $\\int f(r)\\,d^3r = 4\\pi\\int_0^\\infty r^2f(r)\\,dr$; die radiale Wahrscheinlichkeitsdichte ist $P(r) = 4\\pi r^2|\\psi(r)|^2$.\n\n**Laplace-Operator** in Kugelkoordinaten:\n\n$$\\nabla^2 = \\frac{1}{r^2}\\frac{\\partial}{\\partial r}\\left(r^2\\frac{\\partial}{\\partial r}\\right) + \\frac{1}{r^2\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial}{\\partial\\theta}\\right) + \\frac{1}{r^2\\sin^2\\theta}\\frac{\\partial^2}{\\partial\\varphi^2}.$$\n\nDer Winkelteil ist $-\\hat L^2/(\\hbar^2r^2)$ (Thema 8). Für radiale Funktionen bleibt $\\nabla^2f = \\frac1r\\frac{d^2}{dr^2}(rf)$.\n\nDie hier behandelten **speziellen Funktionen** (Hermite, Legendre, Laguerre) sind Polynomlösungen von DGL mit nicht konstanten Koeffizienten. Sie sind orthogonal bezüglich einer **Gewichtsfunktion** $w(x)$:\n\n- Hermite $H_n$: $\\int_{-\\infty}^\\infty H_nH_m\\,e^{-x^2}dx = \\sqrt\\pi\\,2^nn!\\,\\delta_{nm}$ – Oszillator (Thema 7).\n- Legendre $P_l$: $\\int_{-1}^1P_lP_m\\,dx = \\frac{2}{2l+1}\\delta_{lm}$, mit $x = \\cos\\theta$ – Kugelflächenfunktionen (Thema 8).\n- Laguerre $L_n$: $\\int_0^\\infty L_nL_m\\,e^{-x}dx = \\delta_{nm}$ – Radialfunktionen des Wasserstoffatoms (Thema 9).',
    keys:[
      'Das Maß nie vergessen: $r^2$ bei radialen Integralen, $\\sin\\theta$ beim Winkel. Fehlt $r^2$, stimmt schon die Einheit nicht; fehlt $\\sin\\theta$, ergibt der volle Raumwinkel $2\\pi^2$ statt $4\\pi$.',
      '$\\theta$ läuft von $0$ bis $\\pi$, $\\varphi$ von $0$ bis $2\\pi$. Mit $u = \\cos\\theta$ wird $\\int_0^\\pi g(\\cos\\theta)\\sin\\theta\\,d\\theta = \\int_{-1}^1g(u)\\,du$.',
      'Dichte pro Volumen ($|\\psi|^2$) und Dichte pro Abstand ($4\\pi r^2|\\psi|^2$) haben ihr Maximum an verschiedenen Stellen.',
      'Gradient einer radialen Funktion: $\\nabla f(r) = f\'(r)\\,\\hat e_r$, denn $\\partial r/\\partial x = x/r$.',
      '$H_n$, $P_n$ und $L_n$ haben genau $n$ einfache reelle Nullstellen im Orthogonalitätsbereich. $H_n$ und $P_n$ haben die Parität $(-1)^n$.',
      'Konventionen: $P_l(1) = 1$, $L_n(0) = 1$, und $H_n$ hat den führenden Koeffizienten $2^n$. Bei Laguerre-Polynomen unterscheiden sich Bücher in der Normierung – nachschlagen statt raten.'
    ],
    errors:[
      '$d^3r = dr\\,d\\theta\\,d\\varphi$ verwenden – der Faktor $r^2\\sin\\theta$ fehlt.',
      'Für radiale Funktionen $\\nabla^2f = f\'\'$ setzen. Es fehlt der Term $\\frac2rf\'$.',
      '$\\theta$ von $0$ bis $2\\pi$ laufen lassen. Dann ist $\\int\\sin\\theta\\,d\\theta = 0$ statt $2$.',
      'Orthogonalität ohne Gewicht prüfen: $\\int_{-\\infty}^\\infty H_0H_2\\,dx$ existiert nicht einmal; erst mit $e^{-x^2}$ ist das Integral null.',
      'Aus „$|\\psi|^2$ ist bei $r = 0$ am größten“ schließen, der wahrscheinlichste Abstand sei null.'
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
    sketch:{id:'ms-lab-s', kind:'curve', draw:'psi', title:'Vorhersage: die Hermite-Funktion $u_4$',
      text:'Gleich zeichnet das Labor die Hermite-Funktionen $u_n = H_n(x)\\,e^{-x^2/2}/\\sqrt{\\sqrt\\pi\\,2^nn!}$. Skizziere vorher $u_4$ für $-5 \\le x \\le 5$. Skala und Vorzeichen sind frei. Stell danach die Familie „Hermite-Funktionen“ und $n = 4$ ein und vergleiche; die Anzeige zählt auch die Nullstellen.',
      plot:{x:[-5, 5], xlab:'x', ylab:'u_4(x)', ticks:[{x:-4, lab:'-4'}, {x:-2, lab:'-2'}, {x:0, lab:'0'}, {x:2, lab:'2'}, {x:4, lab:'4'}]},
      // H_4 = 16x⁴ − 48x² + 12: Nullstellen ±0,525 und ±1,651; Extrema von H_4 e^{−x²/2} bei 0 (12), ±1,075 (−12,4), ±2,418 (15,0)
      f:x => (16 * x ** 4 - 48 * x * x + 12) * Math.exp(-x * x / 2),
      checks:[
        {id:'knoten', type:'nodes', n:4, msg:'Wie viele Nullstellen hat ein Polynom vom Grad $n$ aus dieser Familie? Deine Skizze hat {got}. (Abschnitt „Orthogonale Polynome mit Gewicht“)'},
        {id:'sym', type:'parity', p:'even', about:0, msg:'Welche Parität hat $H_n$ für gerades $n$? Deine Skizze ist {got}.'},
        {id:'links', type:'decay', toward:'left', range:[-5, -2.6], msg:'Was macht der Faktor $e^{-x^2/2}$ für große $|x|$ gegen das Polynom?'},
        {id:'rechts', type:'decay', toward:'right', range:[2.6, 5], msg:'Was macht $u_4$ für große $x$? Wer gewinnt: $x^4$ oder $e^{-x^2/2}$?'}
      ],
      reveal:'$u_4 \\propto (16x^4 - 48x^2 + 12)\\,e^{-x^2/2}$: vier Nullstellen bei $\\pm 0{,}52$ und $\\pm 1{,}65$, gerade, mit fünf Buckeln. Die äußeren Buckel sind die höchsten, weiter außen klingt die Funktion rasch ab, weil die Gauß-Funktion jede Potenz übertrifft. Genau so sieht der Oszillatorzustand $\\psi_4$ aus (Thema 7); das Labor zählt vier Nullstellen.',
      hints:['Zähle zuerst die Nullstellen, dann überlege die Symmetrie, zuletzt das Verhalten für große $|x|$.', '$H_n$ hat $n$ einfache Nullstellen und die Parität $(-1)^n$; der Gauß-Faktor $e^{-x^2/2}$ sorgt für das Abklingen.'],
      wrong:[
        {f:x => (8 * x ** 3 - 12 * x) * Math.exp(-x * x / 2), fails:['knoten', 'sym'], why:'u₃ gezeichnet: Grad und Knotenzahl um eins verschoben'},
        {f:x => 16 * x ** 4 - 48 * x * x + 12, fails:['links', 'rechts'], why:'Gauß-Faktor vergessen: nur das Polynom H₄'}
      ]},
    text:'Wähle die Familie und die Grade $n$ und $m$. Gezeichnet werden $f_n$ und $f_m$: bei Hermite die normierten Hermite-Funktionen $u_n = H_ne^{-x^2/2}/\\sqrt{\\sqrt\\pi\\,2^nn!}$, bei Legendre $P_n$, bei Laguerre $L_ne^{-x/2}$. Die Anzeige nennt das Polynom, die Zahl seiner Nullstellen und das Orthogonalitätsintegral mit Gewicht: $\\int H_nH_me^{-x^2}dx$, $\\int_{-1}^1P_nP_m\\,dx$ bzw. $\\int_0^\\infty L_nL_me^{-x}dx$.',
    predict:{q:'Bevor du das Labor bedienst: Hat die Hermite-Funktion $u_5$ eine Nullstelle bei $x = 0$?', opts:['ja, weil $H_5$ ungerade ist', 'nein, weil $u_5$ dort maximal ist', 'nur bei geradem Vergleichsgrad $m$'], a:0, ex:'$H_5$ hat die Parität $(-1)^5 = -1$, ist also ungerade und verschwindet bei $x = 0$. Die übrigen vier Nullstellen liegen symmetrisch dazu.'},
    questions:[
      {q:'Hermite, $n = 3$: Wie viele Nullstellen hat die Kurve?', opts:['3', '2', '4'], a:0, ex:'$H_3 = 8x^3 - 12x = 4x(2x^2 - 3)$: Nullstellen bei $0$ und $\\pm\\sqrt{3/2}\\approx\\pm 1{,}22$. Allgemein hat $H_n$ genau $n$ Nullstellen – wie $\\psi_n$ beim Oszillator $n$ Knoten.'},
      {q:'Legendre, $n = m = 2$: Welchen Wert zeigt das Integral?', opts:['$2/5 = 0{,}4$', '$1$, normiert', '$0$, orthogonal'], a:0, ex:'$\\int_{-1}^1P_l^2\\,dx = \\frac{2}{2l+1}$. Die Legendre-Polynome sind orthogonal, aber nicht auf 1 normiert.'}
    ],
    noPic:{q:'Ohne Bild: Folgt $\\int_{-1}^1P_2(x)P_3(x)\\,dx = 0$ schon aus der Symmetrie?', opts:['Ja: $P_2$ gerade, $P_3$ ungerade, Produkt ungerade.', 'Nein, dafür braucht man die Orthogonalitätsrelation.', 'Nein, das Integral ist $2/5$ wie bei $P_2^2$.'], a:0, ex:'Ungerade Integranden geben auf symmetrischen Intervallen null. Für $P_1$ und $P_3$ hilft die Parität nicht – dort braucht man die Orthogonalität.'}},
  compare:{
    text:'Gesucht ist $\\nabla^2f$ für $f(r) = e^{-r/a}$ mit $a > 0$. Zwei richtige Wege:',
    ctx:RAD({params:{a:'pos'}, defs:{'f(r)':'e^(-r/a)'}}),
    A:{name:'Radialteil direkt', model:['∇^2 f = 1/r^2 d/dr (r^2 d/dr f(r))', '= 1/r^2 d/dr (-r^2/a e^(-r/a))', '= 1/r^2 (-2r/a + r^2/a^2) e^(-r/a)', '= (1/a^2 - 2/(a r)) e^(-r/a)']},
    B:{name:'Über $rf$', text:'Für radiale Funktionen gilt $\\frac{1}{r^2}\\left(r^2f\'\\right)\' = \\frac1r(rf)\'\'$.', model:['∇^2 f = 1/r d^2/dr^2 (r f(r))', '= 1/r d^2/dr^2 (r e^(-r/a))', '= 1/r (r/a^2 - 2/a) e^(-r/a)', '= (1/a^2 - 2/(a r)) e^(-r/a)']},
    questions:[
      {q:'Warum lohnt sich Weg B oft?', opts:['$rf$ zweimal ableiten ist kürzer als die Produktregel mit $r^2$.', 'Er gilt auch für Funktionen, die von $\\theta$ abhängen.', 'Er kommt ganz ohne zweite Ableitungen aus.'], a:0, ex:'Weg B gilt nur für den Radialteil. Er ist der Grund für die Substitution $u = rR$ in der Radialgleichung (Thema 9).'},
      {q:'Für welche Funktion verschwindet $\\nabla^2f$ für $r > 0$?', opts:['$f = 1/r$', '$f = r$', '$f = e^{-r}$'], a:0, ex:'Mit Weg B: $r\\cdot\\frac1r = 1$, und $1\'\' = 0$. Für $f = r$ ist $\\nabla^2r = 2/r$.'}
    ]
  },
  practice:[
    {id:'ms-p1', title:'Normierung in drei Dimensionen',
      text:'Ein Zustand hat $\\psi(r) = A\\,e^{-r^2/(2b^2)}$ mit $b > 0$; er hängt nicht von $\\theta$ und $\\varphi$ ab.',
      ctx:SPH({params:{b:'pos'}, defs:{'ψ(r)':'A e^(-r^2/(2b^2))'}, unknowns:{A:{ref:'π^(-3/4) b^(-3/2)', alt:['-π^(-3/4) b^(-3/2)']}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, ph:'4π |A|^2 ∫_0^∞ r^2 e^(-r^2/b^2) dr = 1',
          hints:['Normierung in drei Dimensionen: $\\int|\\psi|^2d^3r = 1$ mit dem vollen Volumenelement.', 'Der Winkelteil gibt $4\\pi$; es bleibt $4\\pi|A|^2\\int_0^\\infty r^2e^{-r^2/b^2}dr = 1$.', '$\\int_0^\\infty r^2e^{-r^2/b^2}dr = \\frac{\\sqrt\\pi}{4}b^3$.'],
          model:['∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 r^2 sin(θ) dφ dθ dr = 1', {l:'4π |A|^2 ∫_0^∞ r^2 e^(-r^2/b^2) dr = 1', w:'Winkelintegral = 4π'}, '4π |A|^2 · sqrt(π) b^3/4 = 1', 'A = π^(-3/4) b^(-3/2)'],
          mistakes:[{expr:'(4/(sqrt(π) b^3))^(1/2)', msg:'Das ist die Normierung ohne den Winkelanteil $4\\pi$.'}, {expr:'1/sqrt(2 π^(3/2) b)', msg:'Prüfe die Einheit: In drei Dimensionen hat $A$ die Einheit $\\text{Länge}^{-3/2}$. Vermutlich fehlt $r^2$ im Maß.'}]},
        {id:'b', prompt:'b) Berechne $\\langle r^2\\rangle$.', type:'value', target:'3b^2/2', points:2, ph:'⟨r^2⟩ = 4π |A|^2 ∫_0^∞ r^4 e^(-r^2/b^2) dr',
          hints:['Erwartungswert wie die Normierung, nur mit zusätzlichem $r^2$ im Integranden.', '$\\langle r^2\\rangle = 4\\pi|A|^2\\int_0^\\infty r^4e^{-r^2/b^2}dr$ mit $|A|^2 = \\pi^{-3/2}b^{-3}$.', '$\\int_0^\\infty r^4e^{-r^2/b^2}dr = \\frac{3\\sqrt\\pi}{8}b^5$.'],
          model:['⟨r^2⟩ = 4π |A|^2 ∫_0^∞ r^4 e^(-r^2/b^2) dr', '= 4π π^(-3/2) b^(-3) · 3 sqrt(π) b^5/8', '= 3b^2/2'],
          note:'Pro Raumrichtung ist $\\langle x^2\\rangle = b^2/2$; zusammen $\\langle x^2 + y^2 + z^2\\rangle = 3b^2/2$.'}
      ]},
    {id:'ms-p2', title:'Laplace-Operator radialer Funktionen',
      text:'Für Funktionen, die nur von $r$ abhängen, gilt $\\nabla^2f = \\frac{1}{r^2}\\frac{d}{dr}\\left(r^2\\frac{df}{dr}\\right) = \\frac1r\\frac{d^2}{dr^2}(rf)$. In der Lernhilfe schreibst du `∇^2 f(r)`.',
      ctx:RAD({params:{n:{int:[1, 4]}, κ:'pos'}, defs:{'f(r)':'e^(-κ r)/r'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\nabla^2r^n$ für eine natürliche Zahl $n$.', type:'value', target:'n (n + 1) r^(n - 2)', points:2, ph:'∇^2 r^n = 1/r^2 d/dr (r^2 d/dr r^n)',
          hints:['Die Funktion hängt nur von $r$ ab: Nimm den Radialteil des Laplace-Operators.', '$\\frac{d}{dr}r^n = nr^{n-1}$; dann mit $r^2$ multiplizieren und noch einmal ableiten.', '$\\frac{d}{dr}(n\\,r^{n+1}) = n(n+1)r^n$; jetzt durch $r^2$ teilen.'],
          model:['∇^2 r^n = 1/r^2 d/dr (r^2 · n r^(n-1))', '= 1/r^2 · n (n + 1) r^n', '= n (n + 1) r^(n - 2)'],
          mistakes:[{expr:'n (n - 1) r^(n - 2)', msg:'Das ist nur $f\'\'(r)$. In drei Dimensionen kommt $\\frac2rf\'$ dazu.'}],
          note:'Kontrolle für $n = 2$: $\\nabla^2(x^2 + y^2 + z^2) = 2 + 2 + 2 = 6$.'},
        {id:'b', prompt:'b) Zeige für $f(r) = e^{-\\kappa r}/r$: $\\nabla^2f = \\kappa^2f$ für $r > 0$.', type:'show', from:'∇^2 f(r)', to:'κ^2 f(r)', points:3, ph:'∇^2 f(r) = 1/r d^2/dr^2 (r f(r))',
          hints:['Wähle die Form des Radialteils, bei der wenig abzuleiten ist.', 'Mit $\\nabla^2f = \\frac1r(rf)\'\'$ und $rf = e^{-\\kappa r}$ ist der Weg kurz.', '$\\frac{d^2}{dr^2}e^{-\\kappa r} = \\kappa^2e^{-\\kappa r}$; dann durch $r$ teilen.'],
          model:['∇^2 f(r) = 1/r d^2/dr^2 (r f(r))', '= 1/r d^2/dr^2 e^(-κ r)', '= κ^2 e^(-κ r)/r', '= κ^2 f(r)'],
          note:'$e^{-\\kappa r}/r$ ist das Yukawa-Potential. Für $\\kappa\\to 0$ wird es zu $1/r$ mit $\\nabla^2(1/r) = 0$ für $r > 0$.'}
      ]},
    {id:'ms-p3', title:'Hermite-Polynome',
      text:'Die Hermite-Polynome erfüllen $H_{n+1}(x) = 2xH_n(x) - 2nH_{n-1}(x)$ mit $H_0 = 1$ und $H_1 = 2x$. In der Lernhilfe kennt `H_n(x)` die Polynome.',
      ctx:{coords:['x']},
      goals:[
        {id:'a', prompt:'a) Berechne $H_3(x)$ mit der Rekursion.', type:'value', target:'8x^3 - 12x', points:2, ph:'H_3(x) = 2x H_2(x) - 4 H_1(x)',
          hints:['Rekursion zweimal anwenden: erst $H_2$, dann $H_3$.', 'Mit $n = 1$: $H_2 = 2xH_1 - 2H_0 = 4x^2 - 2$. Mit $n = 2$: $H_3 = 2xH_2 - 4H_1$.'],
          model:['H_3(x) = 2x H_2(x) - 4 H_1(x)', '= 2x (4x^2 - 2) - 8x', '= 8x^3 - 12x'],
          mistakes:[{expr:'8x^3 - 4x', msg:'Der zweite Term der Rekursion ist $-2nH_{n-1} = -4\\cdot 2x = -8x$.'}]},
        {id:'b', prompt:'b) Berechne $\\int_{-\\infty}^\\infty H_2(x)^2e^{-x^2}dx$ und vergleiche mit $\\sqrt\\pi\\,2^nn!$ für $n = 2$.', type:'value', target:'8 sqrt(π)', points:3, ph:'∫_-∞^∞ H_2(x)^2 e^(-x^2) dx = …',
          hints:['Quadrat ausmultiplizieren, dann jedes Gauß-Moment einzeln.', '$(4x^2 - 2)^2 = 16x^4 - 16x^2 + 4$.', 'Über ganz $\\mathbb R$: $\\int e^{-x^2}dx = \\sqrt\\pi$, $\\int x^2e^{-x^2}dx = \\sqrt\\pi/2$, $\\int x^4e^{-x^2}dx = 3\\sqrt\\pi/4$.'],
          model:['∫_-∞^∞ H_2(x)^2 e^(-x^2) dx = ∫_-∞^∞ (16x^4 - 16x^2 + 4) e^(-x^2) dx', '= 16 · 3sqrt(π)/4 - 16 · sqrt(π)/2 + 4 sqrt(π)', '= 8 sqrt(π)'],
          mistakes:[{expr:'8', msg:'Es fehlt $\\sqrt\\pi$ aus den Gauß-Integralen.'}],
          note:'$\\sqrt\\pi\\,2^2\\,2! = 8\\sqrt\\pi$ – passt. Daher kommt der Vorfaktor $1/\\sqrt{2^nn!}$ der Oszillator-Eigenfunktionen (Thema 7).'}
      ]},
    {id:'ms-p4', title:'Legendre-Polynome und Winkelintegrale',
      text:'$P_0 = 1$, $P_1 = x$, $P_2 = \\frac12(3x^2 - 1)$. Mit $x = \\cos\\theta$ beschreiben sie die Winkelabhängigkeit von $Y_l^0$ (Thema 8).',
      ctx:{coords:['x'], domain:{x:['-1', '1']}, defs:{'P_l(x)':'legendre(l, 0, x)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_{-1}^1P_2(x)^2\\,dx$.', type:'value', target:'2/5', points:2, ph:'∫_-1^1 P_2(x)^2 dx = …',
          hints:['Quadrieren, dann Potenzen von $x$ über $[-1, 1]$ integrieren.', '$\\frac14(3x^2 - 1)^2 = \\frac14(9x^4 - 6x^2 + 1)$.', '$\\int_{-1}^1x^4dx = \\frac25$ und $\\int_{-1}^1x^2dx = \\frac23$.'],
          model:['∫_-1^1 P_2(x)^2 dx = 1/4 ∫_-1^1 (9x^4 - 6x^2 + 1) dx', '= 1/4 (18/5 - 4 + 2)', '= 2/5'],
          mistakes:[{expr:'8/5', msg:'Den Faktor $\\frac14$ aus $\\left(\\frac12\\right)^2$ nicht vergessen.'}],
          note:'Allgemein ist $\\int_{-1}^1P_l^2\\,dx = \\frac{2}{2l+1}$; für $l = 2$ also $2/5$.'},
        {id:'b', prompt:'b) Im Zustand $Y_1^0$ ist $|Y_1^0|^2 = \\frac{3}{4\\pi}\\cos^2\\theta$. Berechne $\\langle\\cos^2\\theta\\rangle = \\int\\cos^2\\theta\\,|Y_1^0|^2\\,d\\Omega$.', type:'value', target:'3/5', points:3, ph:'∫_0^π ∫_0^{2π} cos(θ)^2 · 3/(4π) cos(θ)^2 sin(θ) dφ dθ = …',
          hints:['Mittelwert über die Kugel mit $|Y_1^0|^2$ als Gewicht; das Raumwinkelelement nicht vergessen.', '$d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$; das $\\varphi$-Integral gibt $2\\pi$.', 'Mit $x = \\cos\\theta$ wird $\\int_0^\\pi\\cos^4\\theta\\sin\\theta\\,d\\theta = \\int_{-1}^1x^4\\,dx = 2/5$.'],
          model:['∫_0^π ∫_0^{2π} cos(θ)^2 · 3/(4π) cos(θ)^2 sin(θ) dφ dθ = 3/2 ∫_-1^1 x^4 dx', '= 3/2 · 2/5', '= 3/5'],
          mistakes:[{expr:'9π/16', msg:'Im Raumwinkelelement fehlt $\\sin\\theta$: $d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$.'}, {expr:'1/3', msg:'$1/3$ wäre der Mittelwert von $\\cos^2\\theta$ bei gleichmäßiger Verteilung über die Kugel. Hier gewichtet $|Y_1^0|^2$ die Pole stärker.'}],
          note:'Gleichmäßig verteilt wäre $\\langle\\cos^2\\theta\\rangle = 1/3$. Der Zustand $Y_1^0$ ist entlang der $z$-Achse ausgerichtet.'}
      ]},
    {id:'ms-p5', title:'Laguerre-Polynome',
      text:'$L_0 = 1$, $L_1 = 1 - x$, $L_2 = \\frac12(x^2 - 4x + 2)$, Gewicht $e^{-x}$ auf $[0, \\infty)$. Nützlich: $\\int_0^\\infty x^ke^{-x}dx = k!$.',
      ctx:{coords:['x'], domain:{x:['0', '∞']}, defs:{'L_n(x)':'laguerre(n, 0, x)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_0^\\infty L_1(x)^2e^{-x}dx$.', type:'value', target:'1', points:2, ph:'∫_0^∞ L_1(x)^2 e^(-x) dx = …',
          hints:['Ausmultiplizieren und jede Potenz mit $\\int_0^\\infty x^ke^{-x}dx = k!$ integrieren.', '$(1 - x)^2 = 1 - 2x + x^2$; dann $0! - 2\\cdot 1! + 2!$.'],
          model:['∫_0^∞ L_1(x)^2 e^(-x) dx = ∫_0^∞ (1 - 2x + x^2) e^(-x) dx', '= 1 - 2 + 2', '= 1'],
          mistakes:[{expr:'3', msg:'Der Mischterm fehlt: $(1 - x)^2 = 1 - 2x + x^2$, also $0! - 2\\cdot 1! + 2! = 1$.'}, {expr:'5', msg:'Vorzeichen prüfen: $(1 - x)^2 = 1 - 2x + x^2$, nicht $1 + 2x + x^2$. Also $1 - 2 + 2$.'}]},
        {id:'b', prompt:'b) Zeige durch Rechnung: $\\int_0^\\infty L_1(x)L_2(x)e^{-x}dx = 0$.', type:'value', target:'0', points:3, ph:'∫_0^∞ L_1(x) L_2(x) e^(-x) dx = …',
          hints:['Wie in a): Produkt ausmultiplizieren, dann Term für Term mit $k!$.', '$(1 - x)(x^2 - 4x + 2) = -x^3 + 5x^2 - 6x + 2$.', 'Mit $\\int_0^\\infty x^ke^{-x}dx = k!$: $\\frac12(-6 + 10 - 6 + 2)$.'],
          model:['∫_0^∞ L_1(x) L_2(x) e^(-x) dx = 1/2 ∫_0^∞ (-x^3 + 5x^2 - 6x + 2) e^(-x) dx', '= 1/2 (-6 + 10 - 6 + 2)', '= 0'],
          note:'In den Radialfunktionen des Wasserstoffs stehen die zugeordneten Laguerre-Polynome $L_{n-l-1}^{2l+1}(2r/(na_0))$ (Thema 9).'}
      ]}
  ],
  concept:[
    {id:'ms-c1', type:'dialog', seg:'ms-t2', lex:'sph-radiale-dichte', text:'Im Grundzustand des Wasserstoffatoms ist $\\psi = e^{-r/a_0}/\\sqrt{\\pi a_0^3}$.',
      people:[{name:'Lena', says:'Die Wahrscheinlichkeitsdichte $|\\psi|^2$ ist am Kern, bei $r = 0$, am größten.'}, {name:'Jonas', says:'Der wahrscheinlichste Abstand des Elektrons vom Kern ist der Bohrradius $a_0$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:2,
      ex:'Beide Aussagen stimmen; sie beantworten verschiedene Fragen. $|\\psi|^2$ ist Dichte pro Volumen und fällt nach außen. $P(r) = 4\\pi r^2|\\psi|^2$ ist Dichte pro Abstand und hat ihr Maximum bei $a_0$, weil die Kugelschalen nach außen wachsen.'},
    {id:'ms-c2', type:'mc2', seg:'ms-t1', lex:'jacobi-determinante', q:'Jemand normiert $\\psi(r)$ mit $\\int_0^\\infty\\!\\int_0^\\pi\\!\\int_0^{2\\pi}|\\psi|^2\\,d\\varphi\\,d\\theta\\,dr = 1$. Stimmt das?', opts:['Nein, es fehlt $r^2\\sin\\theta$.', 'Ja, das ist das Volumenintegral.', 'Nein, $\\theta$ muss bis $2\\pi$ laufen.'], a:0,
      ex:'Richtig ist $\\int|\\psi|^2\\,r^2\\sin\\theta\\,d\\varphi\\,d\\theta\\,dr = 1$. Ohne Maß hätte $|\\psi|^2$ die falsche Einheit.',
      reason:{q:'Warum?', opts:['Ein Volumenstück hat die Kanten $dr$, $r\\,d\\theta$, $r\\sin\\theta\\,d\\varphi$.', 'In Kugelkoordinaten sind alle Volumenstücke gleich groß.', 'Der Faktor wird erst beim Erwartungswert gebraucht.'], a:0, ex:'Das Produkt der Kanten ist $r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$. Gleiche Schritte in $r$, $\\theta$, $\\varphi$ überstreichen außen und am Äquator mehr Volumen.'}},
    {id:'ms-c3', type:'mc2', seg:'ms-t4', lex:'gewichtsfunktion', q:'Gilt für $H_0 = 1$ und $H_2 = 4x^2 - 2$ die Gleichung $\\int_{-\\infty}^\\infty H_0H_2\\,dx = 0$?', opts:['Nein, das Integral existiert nicht.', 'Ja, Hermite-Polynome sind orthogonal.', 'Nein, es ist positiv und endlich.'], a:0,
      ex:'$\\int(4x^2 - 2)\\,dx$ über die ganze Achse divergiert. Null ist erst $\\int H_0H_2\\,e^{-x^2}dx$.',
      reason:{q:'Warum?', opts:['Orthogonal nur mit Gewicht $e^{-x^2}$; ohne divergiert es.', 'Orthogonalität gilt für jedes beliebige Gewicht, auch $w = 1$.', 'Gerade Polynome sind nie zueinander orthogonal.'], a:0, ex:'Das Gewicht gehört zum Skalarprodukt. Mit $\\sqrt w$ in den Funktionen, also $H_ne^{-x^2/2}$, braucht man es nicht mehr.'}},
    {id:'ms-c4', type:'dialog', seg:'ms-t3', lex:'laplace-operator', text:'Gesucht ist $\\nabla^2e^{-r/a}$ in drei Dimensionen.',
      people:[{name:'Lena', says:'Man leitet zweimal nach $r$ ab: $\\nabla^2e^{-r/a} = e^{-r/a}/a^2$.'}, {name:'Jonas', says:'In drei Dimensionen kommt $\\frac2rf\'$ dazu: $\\nabla^2e^{-r/a} = \\left(\\frac{1}{a^2} - \\frac{2}{ar}\\right)e^{-r/a}$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'$\\nabla^2f = f\'\' + \\frac2rf\'$ für radiale Funktionen. Mit $f\' = -f/a$ ergibt der Zusatzterm $-\\frac{2}{ar}e^{-r/a}$. Lenas Rechnung gilt nur in einer Dimension.'},
    {id:'ms-c5', type:'mc', seg:'ms-t1', lex:'kugelkoordinaten', q:'Jemand berechnet den vollen Raumwinkel als $\\int_0^{2\\pi}\\!\\int_0^{2\\pi}\\sin\\theta\\,d\\theta\\,d\\varphi$ und erhält $0$. Was ist falsch?', opts:['$\\theta$ läuft nur von $0$ bis $\\pi$.', 'Im Integranden fehlt der Faktor $r^2$.', '$\\varphi$ läuft nur von $0$ bis $\\pi$.'], a:0,
      ex:'Mit $0 \\le \\theta \\le \\pi$ ist $\\int_0^\\pi\\sin\\theta\\,d\\theta = 2$ und der Raumwinkel $4\\pi$. Bis $2\\pi$ würde jede Richtung doppelt gezählt, und der negative Teil des Sinus hebt alles auf. $r^2$ gehört zum Volumen, nicht zum Raumwinkel.'}
  ],
  sketch:[
    {id:'ms-s1', kind:'curve', draw:'abs2', title:'Radiale Dichte eines Gauß-Zustands',
      text:'Ein Zustand hat $\\psi(r) = A\\,e^{-r^2/(2b^2)}$ und hängt nicht von $\\theta$ und $\\varphi$ ab. Skizziere die radiale Wahrscheinlichkeitsdichte $P(r)$ für $0 \\le r \\le 3{,}5\\,b$. Die Skala der $y$-Achse ist frei.',
      plot:{x:[0, 3.5], xlab:'r/b', ylab:'P(r)', ticks:[{x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}]},
      // P(r) = 4πr²|ψ|² ∝ r² e^{−r²/b²}: P(0) = 0, Maximum bei r = b aus d/dr(r² e^{−r²}) = 0
      f:r => r * r * Math.exp(-r * r),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Wahrscheinlichkeitsdichte negativ sein?'},
        {id:'null', type:'zero', at:[0], msg:'Wie viel Volumen hat eine dünne Kugelschale bei $r \\to 0$? Welchen Wert hat $P(0)$ deshalb? (Abschnitt „Radiale Funktionen“)'},
        {id:'max', type:'maxat', x:1, tol:0.25, msg:'Wo hat $r^2e^{-r^2/b^2}$ sein Maximum? Leite ab und setze null.'},
        {id:'aussen', type:'decay', toward:'right', range:[1.8, 3.5], msg:'Was macht $P(r)$ für große $r$?'}
      ],
      reveal:'$P(r) = 4\\pi r^2|\\psi|^2 \\propto r^2e^{-r^2/b^2}$. Der Faktor $r^2$ (Schalenvolumen) macht $P(0) = 0$, obwohl $|\\psi|^2$ bei $r = 0$ am größten ist. Aus $\\frac{d}{dr}(r^2e^{-r^2/b^2}) = 2r(1 - r^2/b^2)\\,e^{-r^2/b^2} = 0$ folgt das Maximum bei $r = b$. Für große $r$ gewinnt die Gauß-Funktion.',
      hints:['Schreib $P(r)$ mit dem Faktor $4\\pi r^2$ hin und überlege, was bei $r = 0$ und für große $r$ passiert.', 'Dichte pro Volumen und Dichte pro Abstand unterscheiden sich um das Schalenvolumen $4\\pi r^2\\,dr$.'],
      wrong:[
        {f:r => Math.exp(-r * r), fails:['null', 'max'], why:'Radialdichte ohne r²: |ψ|² statt 4πr²|ψ|²'},
        {f:r => r * r * Math.exp(-r * r / 2), fails:['max'], why:'ψ statt |ψ|² mit r² multipliziert'}
      ]},
    {id:'ms-s2', kind:'curve', draw:'f', title:'Ein Legendre-Polynom als Funktion des Winkels',
      text:'Die Winkelabhängigkeit von $Y_2^0$ ist $P_2(\\cos\\theta)$ mit $P_2(x) = \\frac12(3x^2 - 1)$. Skizziere $P_2(\\cos\\theta)$ für $0 \\le \\theta \\le \\pi$. Die Skala der $y$-Achse ist frei; Vorzeichen und Nullstellen sollen stimmen.',
      plot:{x:[0, Math.PI], xlab:'\\theta', ylab:'P_2(\\cos\\theta)', ticks:[{x:0, lab:'0'}, {x:Math.PI / 4, lab:'\\pi/4'}, {x:Math.PI / 2, lab:'\\pi/2'}, {x:3 * Math.PI / 4, lab:'3\\pi/4'}, {x:Math.PI, lab:'\\pi'}]},
      // P_2(cos θ) = (3cos²θ − 1)/2: 1 an den Polen, −1/2 am Äquator, Nullstellen bei cos θ = ±1/√3, also θ ≈ 0,955 und 2,186
      f:t => (3 * Math.cos(t) ** 2 - 1) / 2,
      checks:[
        {id:'knoten', type:'nodes', n:2, msg:'Wie viele Nullstellen hat $P_2(x)$ zwischen $-1$ und $1$? Jede gehört zu einem Winkel $\\theta$. Deine Skizze hat {got}. (Abschnitt „Orthogonale Polynome mit Gewicht“)'},
        {id:'sym', type:'parity', p:'even', about:Math.PI / 2, msg:'Was macht $\\cos\\theta$, wenn man $\\theta$ durch $\\pi - \\theta$ ersetzt? Was folgt daraus für das gerade Polynom $P_2$?'},
        {id:'pole', type:'amp', a:[0, 0.3], b:[1.27, 1.87], cmp:'>', msg:'Vergleiche $P_2$ am Pol ($\\theta = 0$, also $x = 1$) mit dem Äquator ($\\theta = \\pi/2$, also $x = 0$).'},
        {id:'aeq', type:'sign', s:-1, range:[1.3, 1.84], msg:'Welches Vorzeichen hat $P_2(0)$? Das ist der Wert am Äquator.'}
      ],
      reveal:'An den Polen ist $\\cos\\theta = \\pm 1$ und $P_2 = 1$, am Äquator $\\cos\\theta = 0$ und $P_2 = -\\frac12$. Dazwischen liegen die zwei Nullstellen von $P_2$, bei $\\cos\\theta = \\pm 1/\\sqrt3$, also $\\theta \\approx 55°$ und $125°$: die Knotenkegel von $Y_2^0$. Weil $P_2$ gerade ist und $\\cos(\\pi - \\theta) = -\\cos\\theta$ gilt, ist die Kurve symmetrisch zu $\\theta = \\pi/2$.',
      hints:['Rechne die Werte bei $\\theta = 0$, $\\pi/2$ und $\\pi$ aus und bestimme die Winkel, bei denen $P_2(\\cos\\theta) = 0$ wird.', '$P_l$ hat $l$ Nullstellen in $(-1, 1)$; jede entspricht genau einem $\\theta$ zwischen $0$ und $\\pi$.'],
      wrong:[
        {f:t => Math.cos(t) ** 2, fails:['knoten'], why:'mit |Y₁₀|² ∝ cos²θ verwechselt: kein Vorzeichenwechsel'},
        {f:t => Math.cos(t), fails:['knoten', 'sym'], why:'P₁ statt P₂'},
        {f:t => (3 * Math.sin(t) ** 2 - 1) / 2, fails:['pole', 'aeq'], why:'θ wie eine geographische Breite vom Äquator statt vom Pol gemessen: P₂(sin θ) statt P₂(cos θ) (plausible Verwechslung, ohne Beleg)'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'ms-f1', title:'Kugelschale', text:'Berechne $\\int\\frac1r\\,d^3r$ über die Kugelschale $a < r < b$.',
      ctx:SPH({params:{a:'pos', b:{range:['a', '3a']}}}),
      goals:[{id:'a', prompt:'Berechne das Integral.', type:'value', target:'2π (b^2 - a^2)', points:2,
        model:['∫_a^b ∫_0^π ∫_0^{2π} 1/r · r^2 sin(θ) dφ dθ dr = 4π ∫_a^b r dr', '= 2π (b^2 - a^2)'],
        mistakes:[{expr:'4π ln(b/a)', msg:'Das Maß $r^2$ fehlt: $\\frac1r\\cdot r^2 = r$, nicht $\\frac1r$.'}]}]}},
    {aim:1, task:{id:'ms-f2', title:'Laplace einer radialen Funktion', text:'$f(r) = r\\,e^{-r/a}$ mit $a > 0$.',
      ctx:RAD({params:{a:'pos'}}),
      goals:[{id:'a', prompt:'Berechne $\\nabla^2f$ für $r > 0$.', type:'value', target:'(2/r - 4/a + r/a^2) e^(-r/a)', points:3,
        model:['∇^2 (r e^(-r/a)) = 1/r d^2/dr^2 (r^2 e^(-r/a))', '= 1/r (2 - 4r/a + r^2/a^2) e^(-r/a)', '= (2/r - 4/a + r/a^2) e^(-r/a)'],
        mistakes:[{expr:'(r/a^2 - 2/a) e^(-r/a)', msg:'Das ist nur $f\'\'(r)$. Es fehlt $\\frac2rf\'$.'}]}]}},
    {aim:2, q:'Welche Aussage über $\\int_{-\\infty}^\\infty H_2(x)H_4(x)e^{-x^2}dx$ stimmt?', opts:['Es ist $0$, wegen der Orthogonalität mit Gewicht $e^{-x^2}$.', 'Es ist $0$, weil der Integrand ungerade ist.', 'Es ist positiv, weil beide Polynome gerade sind.'], a:0, ex:'$H_2$ und $H_4$ sind beide gerade, der Integrand also auch – die Parität hilft hier nicht. Null ist es trotzdem, wegen der Orthogonalität.'},
    {aim:'k', id:'ms-fk1', type:'mc2', q:'Ein Zustand hat $|\\psi|^2 \\propto e^{-2r/a}$. In welcher von zwei gleich dicken Kugelschalen findet man das Teilchen eher: bei $r = a/10$ oder bei $r = a$?', opts:['in der Schale bei $r = a$', 'in der Schale bei $r = a/10$', 'in beiden gleich oft'], a:0,
      ex:'$P(r) \\propto r^2e^{-2r/a}$: bei $a/10$ etwa $0{,}008\\,a^2$, bei $a$ etwa $0{,}135\\,a^2$ – rund sechzehnmal mehr.',
      reason:{q:'Warum?', opts:['Die Schale bei $a$ hat das hundertfache Volumen; das überwiegt den Abfall der Dichte.', 'Die Dichte $|\\psi|^2$ ist bei $r = a$ am größten.', 'Gleich dicke Schalen enthalten immer gleich viel Wahrscheinlichkeit.'], a:0, ex:'Das Schalenvolumen $4\\pi r^2\\,dr$ wächst wie $r^2$, also um den Faktor 100. Die Dichte fällt nur um $e^{-1{,}8}\\approx 0{,}17$.'}},
    {aim:'k', id:'ms-fk2', type:'dialog', text:'Gesucht ist der Mittelwert von $\\cos^2\\theta$ über alle Richtungen im Raum, gleichmäßig gewichtet.',
      people:[{name:'Lena', says:'Das ist $1/2$, denn $\\cos^2$ hat über eine volle Periode den Mittelwert $1/2$.'}, {name:'Jonas', says:'Mit dem Raumwinkelelement $\\sin\\theta\\,d\\theta\\,d\\varphi$ kommt $\\frac{1}{4\\pi}\\int\\cos^2\\theta\\,d\\Omega = 1/3$ heraus.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Gleichmäßig über Richtungen heißt: mit $d\\Omega$ gewichten. $\\frac{1}{4\\pi}\\cdot 2\\pi\\int_{-1}^1u^2du = \\frac13$. Lenas $1/2$ wäre der Mittelwert über $\\theta$ ohne $\\sin\\theta$; sie gewichtet die Pole zu stark.'},
    {aim:2, sketch:{id:'ms-fs-a', kind:'curve', draw:'psi', title:'Ein Legendre-Polynom', points:2,
      text:'Skizziere das Legendre-Polynom $P_3(x)$ auf $[-1, 1]$. Skala und Vorzeichen sind frei; Nullstellen und Symmetrie sollen stimmen.',
      plot:{x:[-1, 1], xlab:'x', ylab:'P_3(x)', ticks:[{x:-1, lab:'-1'}, {x:-0.5, lab:'-0{,}5'}, {x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}]},
      // P_3 = (5x³ − 3x)/2: Nullstellen 0 und ±√(3/5) ≈ ±0,775, Extrema bei ±1/√5 ≈ ±0,447 (Wert ∓0,447), P_3(±1) = ±1
      f:x => (5 * x ** 3 - 3 * x) / 2,
      checks:[
        {id:'knoten', type:'nodes', n:3, msg:'Wie viele Nullstellen hat $P_3$ in $(-1, 1)$? Deine Skizze hat {got}.'},
        {id:'sym', type:'parity', p:'odd', about:0, msg:'Welche Parität hat $P_n$ für ungerades $n$? Deine Skizze ist {got}.'},
        {id:'buckel', type:'extrema', n:2, msg:'Wie viele Extrema liegen zwischen drei einfachen Nullstellen? Deine Skizze hat {got} im Inneren.'}
      ],
      reveal:'$P_3(x) = \\frac12(5x^3 - 3x)$ hat drei einfache Nullstellen in $(-1, 1)$, bei $0$ und $\\pm\\sqrt{3/5} \\approx \\pm 0{,}77$, und ist ungerade, wie jedes $P_n$ mit ungeradem $n$. Zwischen den Nullstellen liegen zwei Extrema bei $\\pm 1/\\sqrt5$. An den Rändern ist $|P_3| = 1$.',
      wrong:[
        {f:x => (3 * x * x - 1) / 2, fails:['knoten', 'sym'], why:'P₂ gezeichnet: Grad um eins verschoben'},
        {f:x => x ** 3, fails:['knoten', 'buckel'], why:'nur die führende Potenz x³: eine Nullstelle statt drei'}
      ]}}
  ],
  finalB:[
    {aim:0, task:{id:'ms-fb4', title:'Radiales Integral', text:'Berechne $\\int r\\,e^{-r/a}\\,d^3r$ über den ganzen Raum ($a > 0$).',
      ctx:SPH({params:{a:'pos'}}),
      goals:[{id:'a', prompt:'Berechne das Integral.', type:'value', target:'24π a^4', points:2,
        model:['∫_0^∞ ∫_0^π ∫_0^{2π} r e^(-r/a) r^2 sin(θ) dφ dθ dr = 4π ∫_0^∞ r^3 e^(-r/a) dr', '= 4π · 6a^4', '= 24π a^4'],
        mistakes:[{expr:'4π a^2', msg:'Das Maß $r^2$ fehlt: Zu integrieren ist $r\\cdot r^2 = r^3$, und $\\int_0^\\infty r^3e^{-r/a}dr = 3!\\,a^4$.'}, {expr:'8π a^4', msg:'Prüfe die Fakultät: $\\int_0^\\infty r^3e^{-r/a}dr = 3!\\,a^4 = 6a^4$.'}]}]}},
    {aim:1, task:{id:'ms-fb2', title:'Laplace einer radialen Funktion', text:'$f(r) = r^2e^{-r/a}$ mit $a > 0$.',
      ctx:RAD({params:{a:'pos'}}),
      goals:[{id:'a', prompt:'Berechne $\\nabla^2f$ für $r > 0$.', type:'value', target:'(6 - 6r/a + r^2/a^2) e^(-r/a)', points:3,
        model:['∇^2 (r^2 e^(-r/a)) = 1/r d^2/dr^2 (r^3 e^(-r/a))', '= 1/r (6r - 6r^2/a + r^3/a^2) e^(-r/a)', '= (6 - 6r/a + r^2/a^2) e^(-r/a)'],
        mistakes:[{expr:'(2 - 4r/a + r^2/a^2) e^(-r/a)', msg:'Das ist nur $f\'\'(r)$. Es fehlt $\\frac2rf\'$.'}]}]}},
    {aim:2, q:'Welche Aussage über $\\int_0^\\infty L_1(x)L_3(x)\\,e^{-x}dx$ stimmt?', opts:['Es ist $0$, wegen der Orthogonalität mit Gewicht $e^{-x}$.', 'Es ist $0$, weil der Integrand ungerade ist.', 'Es ist positiv, weil $L_n(0) = 1$ für alle $n$ gilt.'], a:0, ex:'Auf $[0, \\infty)$ gibt es keine Paritätsargumente. Null ist das Integral wegen der Orthogonalität der Laguerre-Polynome mit Gewicht $e^{-x}$.'},
    {aim:'k', id:'ms-fbk1', type:'mc2', q:'Eine Wellenfunktion ist in einer Kugel mit Radius $R$ konstant. In welcher von zwei gleich dicken Kugelschalen findet man das Teilchen eher: bei $r = R/2$ oder bei $r = R$?', opts:['in der Schale bei $r = R$', 'in der Schale bei $r = R/2$', 'in beiden gleich oft'], a:0,
      ex:'$P(r) \\propto r^2$: Die äußere Schale enthält viermal so viel Wahrscheinlichkeit.',
      reason:{q:'Warum?', opts:['Bei gleicher Dichte zählt das Schalenvolumen, $\\propto r^2$.', 'Die Dichte ist am Rand größer als im Inneren der Kugel.', 'Gleich dicke Schalen haben stets dasselbe Volumen.'], a:0, ex:'Konstante Dichte pro Volumen heißt nicht konstante Dichte pro Abstand.'}},
    {aim:'k', id:'ms-fbk2', type:'dialog', text:'Gesucht ist $\\langle r\\rangle$ für $\\psi(r) = e^{-r/a}/\\sqrt{\\pi a^3}$.',
      people:[{name:'Lena', says:'$\\langle r\\rangle = \\int_0^\\infty r\\,|\\psi|^2\\,dr$, wie in einer Dimension.'}, {name:'Jonas', says:'$\\langle r\\rangle = 4\\pi\\int_0^\\infty r\\,|\\psi|^2\\,r^2\\,dr$, mit dem Maß der Kugelschalen.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Erwartungswerte brauchen dasselbe Maß wie die Normierung: $d^3r = 4\\pi r^2\\,dr$ für radiale Funktionen. Jonas erhält $\\langle r\\rangle = \\frac32a$; Lenas Integral hat nicht einmal die richtige Einheit.'},
    {aim:2, sketch:{id:'ms-fs-b', kind:'curve', draw:'psi', title:'Ein Legendre-Polynom', points:2,
      text:'Skizziere das Legendre-Polynom $P_4(x)$ auf $[-1, 1]$. Skala und Vorzeichen sind frei; Nullstellen und Symmetrie sollen stimmen.',
      plot:{x:[-1, 1], xlab:'x', ylab:'P_4(x)', ticks:[{x:-1, lab:'-1'}, {x:-0.5, lab:'-0{,}5'}, {x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}]},
      // P_4 = (35x⁴ − 30x² + 3)/8: Nullstellen ±0,340 und ±0,861, Extrema bei 0 (3/8) und ±√(3/7) ≈ ±0,655 (−3/7), P_4(±1) = 1
      f:x => (35 * x ** 4 - 30 * x * x + 3) / 8,
      checks:[
        {id:'knoten', type:'nodes', n:4, msg:'Wie viele Nullstellen hat $P_4$ in $(-1, 1)$? Deine Skizze hat {got}.'},
        {id:'sym', type:'parity', p:'even', about:0, msg:'Welche Parität hat $P_n$ für gerades $n$? Deine Skizze ist {got}.'},
        {id:'buckel', type:'extrema', n:3, msg:'Wie viele Extrema liegen zwischen vier einfachen Nullstellen? Deine Skizze hat {got} im Inneren.'}
      ],
      reveal:'$P_4(x) = \\frac18(35x^4 - 30x^2 + 3)$ hat vier einfache Nullstellen in $(-1, 1)$, bei $\\pm 0{,}34$ und $\\pm 0{,}86$, und ist gerade, wie jedes $P_n$ mit geradem $n$. Zwischen den Nullstellen liegen drei Extrema, bei $0$ und $\\pm\\sqrt{3/7}$. An den Rändern ist $P_4 = 1$.',
      wrong:[
        {f:x => (5 * x ** 3 - 3 * x) / 2, fails:['knoten', 'sym'], why:'P₃ gezeichnet: Grad um eins verschoben'},
        {f:x => x ** 4, fails:['knoten', 'buckel'], why:'nur die führende Potenz x⁴: kein Vorzeichenwechsel'}
      ]}}
  ],
  errors:[
    {id:'ms-e1', title:'Normierung ohne Volumenelement',
      text:'Eine Wellenfunktion ist innerhalb einer Kugel mit Radius $R$ konstant, $\\psi = A$, und außerhalb null. Gesucht ist $A > 0$. Jemand rechnet:',
      ctx:SPH({params:{R:'pos'}, unknowns:{A:{ref:'sqrt(3/(4π R^3))', alt:['-sqrt(3/(4π R^3))']}}}),
      lines:['∫_0^R ∫_0^π ∫_0^{2π} |A|^2 dφ dθ dr = 1', '|A|^2 2π^2 R = 1', 'A = 1/sqrt(2π^2 R)'],
      wrong:0,
      why:{q:'Was fehlt in der ersten Zeile?', opts:['das Volumenelement $r^2\\sin\\theta$', 'ein Faktor 2 vor dem Integral', 'die Grenze $2\\pi$ beim Winkel $\\theta$'], a:0, ex:'Ohne Maß hätte $A$ die Einheit $\\text{Länge}^{-1/2}$. Richtig ist $\\int|A|^2d^3r = |A|^2\\cdot\\frac43\\pi R^3$.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $A$.', type:'solve', unknown:'A', model:['∫_0^R ∫_0^π ∫_0^{2π} |A|^2 r^2 sin(θ) dφ dθ dr = 1', '|A|^2 · 4π R^3/3 = 1', 'A = sqrt(3/(4π R^3))']}},
    {id:'ms-e2', title:'Laplace wie in einer Dimension',
      text:'Gesucht ist $\\nabla^2$ der Gauß-Funktion $e^{-r^2/(2b^2)}$ in drei Dimensionen. Jemand rechnet:',
      ctx:RAD({params:{b:'pos'}}),
      lines:['∇^2 e^(-r^2/(2b^2)) = d^2/dr^2 e^(-r^2/(2b^2))', '= (r^2/b^4 - 1/b^2) e^(-r^2/(2b^2))'],
      wrong:0,
      why:{q:'Was ist in der ersten Zeile falsch?', opts:['In drei Dimensionen ist $\\nabla^2f = f\'\' + \\frac2rf\'$.', 'Man muss nach $x$ ableiten, nicht nach $r$.', 'Nichts; erst die zweite Zeile ist falsch.'], a:0, ex:'Die zweite Zeile ist eine richtige Ableitung – nur von der falschen Größe. Der Term $\\frac2rf\'$ liefert hier zusätzlich $-\\frac{2}{b^2}e^{-r^2/(2b^2)}$.'},
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
lexe('sph-radiale-dichte', 'Radiale Wahrscheinlichkeitsdichte', 'Für eine kugelsymmetrische Wellenfunktion ist $|\\psi(r)|^2$ die Dichte pro Volumen, $P(r) = 4\\pi r^2|\\psi(r)|^2$ die Dichte pro Abstand: $P(r)\\,dr$ ist die Wahrscheinlichkeit für einen Abstand zwischen $r$ und $r + dr$, $\\int_0^\\infty P(r)\\,dr = 1$. Allgemein (mit Winkelanteil) $P(r) = r^2|R(r)|^2$. Wasserstoff-Grundzustand: $|\\psi|^2$ maximal bei $r = 0$, $P(r)$ maximal bei $r = a_0$, $\\langle r\\rangle = \\frac32a_0$.', {topic:'m-spezial'});
