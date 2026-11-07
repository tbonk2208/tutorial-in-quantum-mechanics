/* ===== Mathe M8: Kugelkoordinaten und spezielle Funktionen ===== */
(function(){
const R = String.raw;
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
    /* ===== Abschnitt 1: Kugelkoordinaten, Volumenelement, Raumwinkel ===== */
    {id:'ms-t1', title:'Kugelkoordinaten und das Volumenelement', steps:[
      {id:'ms-t1a', title:'Drei Zahlen für einen Punkt',
        num:{title:R`$r = 2$, $\theta = \pi/3$, $\varphi = \pi/2$`, text:R`$x = 2\sin\tfrac{\pi}{3}\cos\tfrac{\pi}{2} = 0$, $y = 2\sin\tfrac{\pi}{3}\sin\tfrac{\pi}{2} = \sqrt3 \approx 1{,}73$, $z = 2\cos\tfrac{\pi}{3} = 1$. Probe: $x^2 + y^2 + z^2 = 0 + 3 + 1 = 4 = r^2$.`},
        text:R`Viele Probleme der Physik sind kugelsymmetrisch: Das Coulomb-Potential eines Kerns hängt nur vom Abstand ab. Dann sind [[lex:kugelkoordinaten|Kugelkoordinaten]] die natürliche Wahl:

$$\begin{gathered}x = r\sin\theta\cos\varphi,\qquad y = r\sin\theta\sin\varphi,\\ z = r\cos\theta.\end{gathered}$$

Dabei ist $r \ge 0$ der Abstand vom Ursprung. Der Polarwinkel $\theta$, gelesen „theta“, läuft von $0$ bis $\pi$ und wird von der positiven $z$-Achse aus gemessen. Der Azimut $\varphi$, gelesen „phi“, läuft von $0$ bis $2\pi$ und wird in der $xy$-Ebene von der $x$-Achse aus gemessen. $r\sin\theta$ ist der Abstand des Punkts von der $z$-Achse.`,
        q:{q:R`Ein Punkt hat $r = 3$, $\theta = \pi$ und $\varphi = \pi/2$. Wo liegt er?`,
          opts:[R`bei $(0, 3, 0)$`, R`bei $(0, 0, -3)$`, R`bei $(0, -3, 0)$`], a:1,
          ex:R`$\theta = \pi$ heißt: genau auf der negativen $z$-Achse. Dort spielt $\varphi$ keine Rolle, denn $\sin\pi = 0$.`,
          fb:[R`So läge der Punkt bei $\theta = \pi/2$. Mit $\theta = \pi$ ist $\sin\theta = 0$ und $z = r\cos\pi = -3$.`,
            '',
            R`$\theta$ misst den Winkel zur $z$-Achse. Bei $\theta = \pi$ zeigt der Punkt nach unten; $\varphi$ ist dann ohne Bedeutung.`]}},
      {id:'ms-t1b', title:'Das Volumenelement',
        num:{title:'Kleine Schritte in drei Richtungen', text:R`Bei $r = 1$ und $\theta = \pi/2$ sind die Kanten für $dr = d\theta = d\varphi = 0{,}01$ alle $0{,}01$ lang: Volumen $10^{-6}$. Bei $\theta = \pi/6$ ist der Breitenkreis nur halb so groß, $\sin\tfrac{\pi}{6} = \tfrac12$: Volumen $0{,}5\cdot 10^{-6}$. Bei $r = 2$ sind zwei Kanten doppelt so lang: Volumen $4\cdot 10^{-6}$.`},
        text:R`Beim Integrieren brauchst du das **Volumenelement**. Änderst du $r$, $\theta$ und $\varphi$ um $dr$, $d\theta$ und $d\varphi$, überstreichst du ein kleines, fast quaderförmiges Stück. Seine Kanten sind $dr$ in radialer Richtung, $r\,d\theta$ auf einem Großkreis mit Radius $r$ und $r\sin\theta\,d\varphi$ auf einem Breitenkreis mit Radius $r\sin\theta$. Das Produkt ist

$$d^3r = r^2\sin\theta\,dr\,d\theta\,d\varphi.$$

Dasselbe liefert formal die [[lex:jacobi-determinante|Jacobi-Determinante]] der Koordinatentransformation. Gleich große Schritte in den Koordinaten überstreichen also außen und am Äquator mehr Volumen als innen und nahe den Polen.`,
        q:{q:R`Warum steht im Volumenelement der Faktor $\sin\theta$?`,
          opts:[R`Der Breitenkreis hat den Radius $r\sin\theta$.`, R`Weil $\theta$ nur bis $\pi$ läuft und nicht bis $2\pi$.`, R`Er ist die Ableitung von $\cos\theta$ nach $\theta$, ohne Bedeutung.`], a:0,
          ex:R`Die Kante in $\varphi$-Richtung ist ein Stück Breitenkreis, $r\sin\theta\,d\varphi$. Nahe den Polen ist dieser Kreis klein.`,
          fb:['',
            R`Die Grenzen von $\theta$ erklären den Faktor nicht. Er kommt aus der Länge der Kante in $\varphi$-Richtung.`,
            R`Der Faktor hat eine geometrische Bedeutung: Er gibt den Breitenkreisen nahe den Polen weniger Gewicht.`]}},
      {id:'ms-t1c', title:'Der Raumwinkel',
        num:{title:'Die obere Halbkugel', text:R`Für $0 \le \theta \le \pi/2$ ist

$$\begin{gathered}\int_0^{\pi/2}\!\!\int_0^{2\pi}\sin\theta\,d\varphi\,d\theta\\ = 2\pi\left[-\cos\theta\right]_0^{\pi/2} = 2\pi.\end{gathered}$$

Das ist die Hälfte des vollen Raumwinkels $4\pi$, wie es für die halbe Kugel sein muss.`},
        text:R`Für Richtungen allein schreibt man $d^3r = r^2\,dr\,d\Omega$ mit dem **Raumwinkelelement**

$$d\Omega = \sin\theta\,d\theta\,d\varphi.$$

Über alle Richtungen ist $\int d\Omega = 4\pi$; die Herleitung rechnet das nach. Das ist die Oberfläche der Einheitskugel. Der Faktor $\sin\theta$ gibt den Richtungen nahe den Polen weniger Gewicht. Ein Streifen der Breite $d\theta$ um den Pol ist ein kleiner Ring, derselbe Streifen am Äquator ein großer. Deshalb liegt in einer Kappe um den Pol weniger Raumwinkel, als ihr Anteil am $\theta$-Bereich vermuten lässt.`,
        derive:{ctx:SPH({}),
          lines:[
            {l:'∫_0^π ∫_0^{2π} sin(θ) dφ dθ = 2π ∫_0^π sin(θ) dθ', w:'φ-Integral', why:{q:'Warum gibt das $\\varphi$-Integral einfach $2\\pi$?', opts:['weil der Integrand nicht von $\\varphi$ abhängt', 'weil $\\sin\\theta$ nach Mittelung $1$ ist', 'weil $\\varphi$ bis $\\pi$ läuft und doppelt zählt'], a:0, ex:'$\\int_0^{2\\pi}d\\varphi = 2\\pi$. Hängt der Integrand von $\\varphi$ ab, muss man wirklich integrieren.'}},
            {l:'= 2π [-cos(θ)]_0^π', w:'Stammfunktion'},
            {l:'= 4π', w:'voller Raumwinkel', why:{q:'Woher kommt der Faktor 2 im $\\theta$-Teil?', opts:['$-\\cos\\pi + \\cos 0 = 1 + 1 = 2$', 'aus den zwei Polen der Kugel, je einer zählt $1$', 'aus $\\sin^2\\theta + \\cos^2\\theta = 1$, doppelt genommen'], a:0, ex:'$[-\\cos\\theta]_0^\\pi = -(-1) - (-1) = 2$. Zusammen $2\\pi\\cdot 2 = 4\\pi$, die Oberfläche der Einheitskugel.'}}
          ]},
        q:{q:R`Welcher Anteil des vollen Raumwinkels liegt in der Kappe $0 \le \theta \le \pi/3$ um die $z$-Achse?`,
          opts:[R`$1/4$`, R`$1/3$`, R`$1/6$`], a:0,
          ex:R`$2\pi\left(1 - \cos\tfrac{\pi}{3}\right) = 2\pi\cdot\tfrac12 = \pi$, also $\pi/(4\pi) = 1/4$.`,
          fb:['',
            R`$1/3$ ist der Anteil des $\theta$-Bereichs. Richtungen nahe dem Pol zählen mit $\sin\theta$ aber weniger.`,
            R`$1/6$ wäre $\tfrac{\pi/3}{2\pi}$. Der $\varphi$-Bereich ist hier aber vollständig, nur $\theta$ ist begrenzt.`]}},
      {id:'ms-t1d', title:R`Winkelintegrale mit $u = \cos\theta$`,
        num:{title:R`$\int_0^\pi\cos^2\theta\,\sin\theta\,d\theta$`, text:R`Mit $u = \cos\theta$ ist $du = -\sin\theta\,d\theta$. Die Grenzen werden $\theta = 0 \to u = 1$ und $\theta = \pi \to u = -1$; das Minus dreht sie zurück:

$$\int_0^\pi\cos^2\theta\,\sin\theta\,d\theta = \int_{-1}^1u^2\,du = \tfrac23.$$`},
        text:R`Winkelintegrale haben oft die Form $\int_0^\pi g(\cos\theta)\sin\theta\,d\theta$. Der Faktor $\sin\theta$ aus dem Raumwinkel passt dann genau zur Substitution $u = \cos\theta$:

$$\int_0^\pi g(\cos\theta)\,\sin\theta\,d\theta = \int_{-1}^1 g(u)\,du.$$

Aus einem Integral über Winkelfunktionen wird ein Integral über ein Polynom auf $[-1, 1]$. Diese Substitution führt direkt zu den Legendre-Polynomen (Abschnitt 4). Sie gilt nur, wenn der Integrand wirklich den Faktor $\sin\theta$ enthält. Ohne ihn wäre $d\theta$ nicht durch $du$ zu ersetzen.`,
        q:{q:R`Welchen Wert hat $\int_0^\pi\!\int_0^{2\pi}\cos^2\theta\,\sin\theta\,d\varphi\,d\theta$?`,
          opts:[R`$\pi^2$`, R`$4\pi/3$`, R`$0$`], a:1,
          ex:R`Das $\varphi$-Integral gibt $2\pi$; mit $u = \cos\theta$ ist $\int_{-1}^1u^2du = 2/3$. Zusammen $4\pi/3$.`,
          fb:[R`$\pi^2$ entstünde ohne den Faktor $\sin\theta$ und ohne Substitution. Mit $u = \cos\theta$ wird das Integral einfach.`,
            '',
            R`$u^2$ ist gerade und nicht negativ; das Integral über $[-1, 1]$ ist positiv.`]}},
      {id:'ms-t1e', title:'Das Volumenelement in Worten, Formel und Bild: Tafel',
        num:{title:'Das Kugelvolumen', text:R`Mit dem vollen Maß zerfällt das Integral in drei Faktoren:

$$\begin{aligned}&\int_0^R\!\!\int_0^\pi\!\!\int_0^{2\pi}r^2\sin\theta\,d\varphi\,d\theta\,dr\\ &= 2\pi\cdot 2\cdot\frac{R^3}{3} = \frac{4\pi R^3}{3}.\end{aligned}$$

Für $R = 1{,}3$ sind das etwa $9{,}20$ Volumeneinheiten.`},
        text:R`Die Tafel stellt das Volumenelement in mehreren Darstellungen nebeneinander. In Worten sind es drei Kanten. Als Formel ist es ihr Produkt. Als Graph zeigt der Faktor $\sin\theta$, wie stark jeder Polarwinkel zählt. Als Mathe-Objekt ist es der Betrag der Jacobi-Determinante. In der Physik brauchst du es jedes Mal, wenn eine Dichte über den Raum integriert wird.

Der Graph lohnt einen zweiten Blick. Bei $\theta = 0$ und $\theta = \pi$ ist $\sin\theta = 0$: Am Pol schrumpft der Breitenkreis auf einen Punkt. Die Fläche unter $\sin\theta$ ist $2$; mit $2\pi$ aus dem $\varphi$-Integral gibt das den vollen Raumwinkel $4\pi$.`,
        reps:{obj:R`Das Volumenelement $d^3r$ in Kugelkoordinaten`,
          rows:[
            {k:'worte', text:R`Ein kleines Stück mit den Kanten $dr$, $r\,d\theta$ und $r\sin\theta\,d\varphi$.`},
            {k:'formel', tex:R`d^3r = r^2\sin\theta\,dr\,d\theta\,d\varphi = r^2\,dr\,d\Omega`},
            {k:'graph', plot:{x:[0, Math.PI], y:[-0.1, 1.2], xlab:'\\theta', ylab:'\\sin\\theta', ticks:[{x:Math.PI / 2, lab:'\\pi/2'}, {x:Math.PI, lab:'\\pi'}]}, f:t => Math.sin(t), lab:R`\sin\theta`,
              cap:R`Gewicht der Polarwinkel: null an den Polen, am größten am Äquator. Die Fläche unter der Kurve ist $2$.`},
            {k:'mathe', tex:R`\left|\det\frac{\partial(x, y, z)}{\partial(r, \theta, \varphi)}\right| = r^2\sin\theta`},
            {k:'physik', text:R`Ausblick: Eine Wellenfunktion $\psi(r, \theta, \varphi)$ im Raum ist normiert, wenn $\int|\psi|^2\,r^2\sin\theta\,dr\,d\theta\,d\varphi = 1$ ist, etwa beim Wasserstoffatom (Thema 9).`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Die drei Kantenlängen multiplizieren.`},
            {from:'formel', to:'graph', rule:R`Den Faktor $\sin\theta$ über $\theta \in [0, \pi]$ zeichnen; er sagt, wie viel Volumen ein Schritt $d\theta$ bei diesem Winkel überstreicht.`},
            {from:'graph', to:'mathe', rule:R`Dasselbe Gewicht liefert die Jacobi-Determinante: die Ableitungen von $x, y, z$ nach $r, \theta, \varphi$ in eine Matrix schreiben und den Betrag der Determinante bilden.`},
            {from:'mathe', to:'physik', rule:R`Beim Normieren oder Mitteln im Raum $d^3r$ immer durch $r^2\sin\theta\,dr\,d\theta\,d\varphi$ ersetzen.`}
          ]},
        q:{q:R`Im Graphen ist $\sin\theta$ bei $\theta = 0$ und $\theta = \pi$ null. Was bedeutet das für das Volumenelement?`, tr:{from:'graph', to:'formel'},
          opts:[R`Volumenstücke an den Polen werden sehr klein.`, R`An den Polen liegen gar keine Punkte des Raums mehr.`, R`Das $\theta$-Integral wird dort negativ und zieht Volumen ab.`], a:0,
          ex:R`Mit $\sin\theta \to 0$ schrumpft die Kante $r\sin\theta\,d\varphi$: Der Breitenkreis wird zum Punkt.`,
          fb:['',
            R`Die Pole sind Punkte der $z$-Achse; nur das Volumen, das ein Schritt $d\theta\,d\varphi$ dort überstreicht, ist klein.`,
            R`Auf $[0, \pi]$ ist $\sin\theta \ge 0$. Negativ würde es erst, wenn $\theta$ fälschlich bis $2\pi$ liefe.`]}},
      {id:'ms-t1f', title:'Typischer Fehler: Maß vergessen, Grenzen vertauscht',
        num:{title:'Zwei falsche Kugelvolumen', text:R`Ohne Maß: $\int_0^R\!\int_0^\pi\!\int_0^{2\pi}d\varphi\,d\theta\,dr = 2\pi^2R$, keine Länge hoch drei. Mit $\theta$ bis $2\pi$: $\int_0^{2\pi}\sin\theta\,d\theta = 0$, und der Raumwinkel verschwände.`},
        text:R`Zwei Fehler sind häufig. Der erste ist, das Maß zu vergessen und $dr\,d\theta\,d\varphi$ statt $r^2\sin\theta\,dr\,d\theta\,d\varphi$ zu schreiben. Der zweite ist, $\theta$ bis $2\pi$ laufen zu lassen. Dann würde jede Richtung doppelt gezählt, und der negative Teil des Sinus hebt alles auf.

Beide fallen bei einer Kontrolle auf. Ohne $r^2$ stimmt die Einheit nicht mehr: Ein Volumen muss die Einheit $\text{Länge}^3$ haben. Mit $\theta$ bis $2\pi$ wird der Raumwinkel null statt $4\pi$. Ein kurzer Test lohnt sich immer: Für das Volumen einer Kugel muss $\frac43\pi R^3$ herauskommen.`,
        q:{q:R`Jemand berechnet $\int_0^R\!\int_0^\pi\!\int_0^{2\pi}r\sin\theta\,d\varphi\,d\theta\,dr$ als Kugelvolumen. Woran erkennst du schnell den Fehler?`,
          opts:[R`Das Ergebnis hat die Einheit einer Fläche.`, R`Das Ergebnis wird für große Kugeln negativ.`, R`Der Winkel $\theta$ hätte bis $2\pi$ laufen müssen.`], a:0,
          ex:R`Mit $r$ statt $r^2$ kommt $2\pi R^2$ heraus. Ein Volumen braucht $\text{Länge}^3$: Es fehlt ein Faktor $r$.`,
          fb:['',
            R`Alle Faktoren sind auf diesen Bereichen positiv. Das Ergebnis $2\pi R^2$ ist positiv, aber hat die falsche Einheit.`,
            R`$\theta$ läuft richtig von $0$ bis $\pi$. Bis $2\pi$ würde der $\theta$-Teil null.`]}}
    ]},

    /* ===== Abschnitt 2: Radiale Funktionen, Dichte pro Volumen und pro Abstand ===== */
    {id:'ms-t2', title:'Radiale Funktionen und die radiale Wahrscheinlichkeitsdichte', steps:[
      {id:'ms-t2a', title:'Winkel ausintegrieren: Kugelschalen',
        pre:{from:'m-analysis', seg:'ma-t4', title:'Fakultätsintegrale', text:R`$\int_0^\infty x^ne^{-x}dx = n!$ und mit einem Parameter $\int_0^\infty x^ne^{-kx}dx = n!/k^{n+1}$ für $k > 0$. Mini-Beispiel: $\int_0^\infty x^2e^{-x/a}dx = 2!\,a^3 = 2a^3$.`},
        num:{title:R`$\int e^{-r/a}\,d^3r$`, text:R`Die Funktion hängt nur von $r$ ab. Das Winkelintegral gibt $4\pi$, das Maß $r^2$ bleibt:

$$\begin{aligned}\int e^{-r/a}\,d^3r &= 4\pi\int_0^\infty r^2e^{-r/a}\,dr\\ &= 4\pi\cdot 2a^3 = 8\pi a^3.\end{aligned}$$`},
        text:R`Hängt eine Funktion nur vom Abstand ab, $f = f(r)$, kannst du die Winkel sofort ausintegrieren:

$$\begin{aligned}\int f(r)\,d^3r &= \int_0^\infty f(r)\,r^2\,dr\int d\Omega\\ &= 4\pi\int_0^\infty f(r)\,r^2\,dr.\end{aligned}$$

Anschaulich zerlegst du den Raum in dünne Kugelschalen. Eine Schale mit dem Radius $r$ und der Dicke $dr$ hat das Volumen $4\pi r^2\,dr$, Oberfläche mal Dicke. Die Schalen werden nach außen immer größer. Das ist der Faktor $r^2$, und er bleibt im Integral stehen, auch wenn die Winkel schon erledigt sind.`,
        q:{q:R`Zwei Kugelschalen haben dieselbe Dicke $dr$, die eine bei $r = 1$, die andere bei $r = 2$. Wie verhalten sich ihre Volumen?`,
          opts:[R`Die äußere hat das doppelte Volumen.`, R`Die äußere hat das vierfache Volumen.`, R`Die äußere hat das achtfache Volumen.`], a:1,
          ex:R`$4\pi r^2\,dr$: Der Faktor $r^2$ wächst von $1$ auf $4$.`,
          fb:[R`Das Schalenvolumen wächst mit der Oberfläche $4\pi r^2$, also mit dem Quadrat des Radius.`,
            '',
            R`Ein Faktor $8 = 2^3$ gälte für das ganze Kugelvolumen bis $r$, nicht für eine dünne Schale.`]}},
      {id:'ms-t2b', title:'Dichte pro Volumen und Dichte pro Abstand',
        num:{title:'Eine gleichmäßig gefüllte Kugel', text:R`Eine Kugel mit $R = 1$ und der Masse $M$ hat die konstante Dichte $\rho = 3M/(4\pi)$. In der Schale bei $r$ liegt die Masse $4\pi r^2\rho\,dr = 3Mr^2\,dr$. Pro Abstand ist das $3Mr^2$: bei $r = 0{,}5$ gleich $0{,}75\,M$, bei $r = 1$ gleich $3M$.`},
        text:R`Eine Dichte $\rho(r)$ ist eine Menge **pro Volumen**, wie die Massendichte. Fragst du dagegen, wie viel in der Schale zwischen $r$ und $r + dr$ liegt, brauchst du die Dichte **pro Abstand**:

$$P(r) = 4\pi r^2\,\rho(r).$$

Sie entsteht aus der Volumendichte durch Multiplikation mit der Schalenfläche. Beide Dichten beantworten verschiedene Fragen, und ihre Maxima liegen im Allgemeinen an verschiedenen Stellen.

Ausblick: In der Quantenmechanik ist $|\psi|^2$ eine Wahrscheinlichkeitsdichte pro Volumen (Thema 1, M9). Dann heißt $P(r) = 4\pi r^2|\psi(r)|^2$ die [[lex:sph-radiale-dichte|radiale Wahrscheinlichkeitsdichte]]. Sie ist pro Länge normiert: $\int_0^\infty P(r)\,dr = 1$.`,
        q:{q:R`Eine Dichte pro Volumen ist $\rho(r) = e^{-r}$. Wie lautet die Dichte pro Abstand?`,
          opts:[R`$e^{-r}$, sie ist dieselbe`, R`$4\pi e^{-r}$, nur der Winkelanteil kommt dazu`, R`$4\pi r^2e^{-r}$`], a:2,
          ex:R`$P(r) = 4\pi r^2\rho(r)$: Oberfläche der Schale mal Dichte.`,
          fb:[R`Pro Volumen und pro Abstand sind verschiedene Größen. Die Schalenfläche $4\pi r^2$ fehlt.`,
            R`Der Winkelanteil allein reicht nicht. Die Schale hat die Fläche $4\pi r^2$, nicht $4\pi$.`,
            '']}},
      {id:'ms-t2c', title:'Normierung in drei Dimensionen',
        num:{title:'Der Bohrradius', text:R`Für den Wasserstoff-Grundzustand ist $a$ der [[lex:bohrradius|Bohrradius]], $a \approx 0{,}0529\,\mathrm{nm}$. Dann ist $A = 1/\sqrt{\pi a^3} \approx 46{,}3\,\mathrm{nm}^{-3/2}$ und $|\psi(0)|^2 = 1/(\pi a^3) \approx 2150\,\mathrm{nm}^{-3}$: eine Dichte, keine Wahrscheinlichkeit.`},
        text:R`Ausblick auf Thema 9: Der Grundzustand des Wasserstoffatoms ist $\psi(r) = A\,e^{-r/a}$. Er hängt nur vom Abstand $r$ zum Kern ab. Eine Wellenfunktion ist normiert, wenn $\int|\psi|^2\,d^3r = 1$ ist. Die Herleitung bestimmt so den Faktor $A$. Das Winkelintegral gibt $4\pi$, dann bleibt ein Fakultätsintegral, und es folgt

$$A = \frac{1}{\sqrt{\pi a^3}}.$$

Achte auf die Einheit. In drei Dimensionen hat $d^3r$ die Einheit $\text{Länge}^3$, also $|\psi|^2$ die Einheit $\text{Länge}^{-3}$ und $A$ die Einheit $\text{Länge}^{-3/2}$. In einer Dimension wäre es $\text{Länge}^{-1/2}$.`,
        derive:{ctx:SPH({params:{a:'pos'}, defs:{'ψ(r)':'A e^(-r/a)'}, unknowns:{A:{ref:'1/sqrt(π a^3)', alt:['-1/sqrt(π a^3)']}}}),
          lines:[
            {l:'∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 r^2 sin(θ) dφ dθ dr = 1', w:'Normierung mit vollem Maß'},
            {l:'4π |A|^2 ∫_0^∞ r^2 e^(-2r/a) dr = 1', w:'Winkelintegral = 4π', why:{q:'Woher kommt $e^{-2r/a}$?', opts:['$|e^{-r/a}|^2 = e^{-2r/a}$', 'aus dem Maß $r^2$, abgeleitet', 'aus der Substitution $u = 2r$'], a:0, ex:'Das Betragsquadrat verdoppelt den Exponenten.'}},
            {l:'4π |A|^2 · 2!/(2/a)^3 = 1', w:'∫ xⁿ e^(−kx) dx = n!/k^(n+1)', why:{q:'Welche Regel steckt hier?', opts:['$\\int_0^\\infty r^ne^{-kr}dr = n!/k^{n+1}$ mit $n = 2$, $k = 2/a$', '$\\int_0^\\infty r^2e^{-kr}dr = 1/k^2$ mit $k = 2/a$', 'partielle Integration ohne Randterme, $= 2/k$'], a:0, ex:'$2!/(2/a)^3 = 2a^3/8 = a^3/4$.'}},
            {l:'π |A|^2 a^3 = 1', w:'vereinfacht'},
            {l:'A = 1/sqrt(π a^3)', w:'Einheit Länge^(−3/2)', why:{q:'Welche Einheit muss $A$ in drei Dimensionen haben?', opts:['$\\text{Länge}^{-3/2}$, damit $|\\psi|^2d^3r$ dimensionslos ist', '$\\text{Länge}^{-1/2}$, wie in einer Dimension', 'keine, weil $\\psi$ eine Wahrscheinlichkeit ist'], a:0, ex:'$d^3r$ hat die Einheit $\\text{Länge}^3$, also $|\\psi|^2$ die Einheit $\\text{Länge}^{-3}$.'}}
          ]},
        q:{q:R`Ein Zustand hat $\psi(r) = A\,e^{-r/(2a)}$. Welches $A > 0$ normiert ihn?`,
          opts:[R`$1/\sqrt{2a^3}$`, R`$1/\sqrt{8\pi a^3}$`, R`$1/\sqrt{4\pi a}$`], a:1,
          ex:R`$4\pi A^2\int_0^\infty r^2e^{-r/a}dr = 4\pi A^2\cdot 2a^3 = 8\pi A^2a^3 = 1$.`,
          fb:[R`Hier fehlt das Winkelintegral $4\pi$.`,
            '',
            R`Hier fehlt das Maß $r^2$. Die Einheit verrät es: $A$ muss die Einheit $\text{Länge}^{-3/2}$ haben.`]}},
      {id:'ms-t2d', title:'Der wahrscheinlichste Abstand',
        num:{title:'Drei Werte der radialen Dichte', text:R`Für $P(r) = \frac{4}{a^3}r^2e^{-2r/a}$ ist $a\,P(a/2) = e^{-1} \approx 0{,}37$, $a\,P(a) = 4e^{-2} \approx 0{,}54$ und $a\,P(2a) = 16e^{-4} \approx 0{,}29$. Der Wert bei $r = a$ ist der größte.`},
        text:R`Für den Grundzustand ist $P(r) = 4\pi r^2|\psi|^2 = \frac{4}{a^3}r^2e^{-2r/a}$. Bei $r = 0$ ist $P = 0$, obwohl $|\psi|^2$ dort am größten ist: Die innersten Schalen haben kaum Volumen. Das Maximum folgt aus

$$\begin{gathered}\frac{d}{dr}\left(r^2e^{-2r/a}\right) = \left(2r - \frac{2r^2}{a}\right)e^{-2r/a} = 0\\ \Rightarrow\quad r = a.\end{gathered}$$

Der wahrscheinlichste Abstand ist der Bohrradius. Der mittlere Abstand $\langle r\rangle = \int_0^\infty r\,P(r)\,dr$, gelesen „Mittelwert von r“ wie $\langle x\rangle$ in M6, ist größer: $\tfrac32a$, weil $P(r)$ nach außen langsam abfällt. Im Bild daneben ist die blaue Kurve $r^2|R_{nl}|^2$; $R_{nl}$ ist der radiale Teil der Wellenfunktion. Für $n = 1$, $l = 0$ ist sie genau das $P(r)$ von oben, für andere Zustände deren radiale Dichte. Die rote Linie markiert $\langle r\rangle$. Mit den Reglern $n$ und $l$ siehst du andere Zustände.`,
        fig:{lab:'hydrogen', caption:'Radiale Wahrscheinlichkeitsdichte $r^2|R_{nl}|^2$ des Wasserstoffatoms. Für $n = 1$ liegt das Maximum bei $r = a_0$, obwohl $|\\psi|^2$ am Kern am größten ist; die rote Linie zeigt $\\langle r\\rangle$.'},
        q:{q:R`Für $\psi = e^{-r/a}/\sqrt{\pi a^3}$: Wo ist $|\psi|^2$ am größten, wo $P(r) = 4\pi r^2|\psi|^2$?`,
          opts:[R`beide bei $r = 0$, am Kern`, R`$|\psi|^2$ bei $r = 0$, $P(r)$ bei $r = a$`, R`beide bei $r = a$, am Bohrradius`], a:1,
          ex:R`$|\psi|^2 \propto e^{-2r/a}$ fällt von innen nach außen. $P(r) \propto r^2e^{-2r/a}$ beginnt bei null, weil die innersten Schalen kein Volumen haben.`,
          fb:[R`$P(r)$ enthält den Faktor $r^2$ und ist bei $r = 0$ null, nicht maximal.`,
            '',
            R`$|\psi|^2 \propto e^{-2r/a}$ hat kein Maximum bei $r = a$; es fällt von $r = 0$ an.`]}},
      {id:'ms-t2e', title:'Zwei Dichten in einem Bild: Tafel',
        num:{title:'Am Kern und beim Bohrradius', text:R`$a^3|\psi|^2$ ist bei $r = 0$ gleich $1/\pi \approx 0{,}32$ und bei $r = a$ nur noch $e^{-2}/\pi \approx 0{,}043$. $a\,P(r)$ ist bei $r = 0$ gleich $0$ und bei $r = a$ gleich $0{,}54$. Die eine Kurve fällt, die andere steigt erst an.`},
        text:R`Die Tafel zeigt den Grundzustand in mehreren Darstellungen. Die Formel liefert beide Dichten. Der Graph legt sie übereinander, damit du die Lage der Maxima vergleichen kannst. Für den Graphen sind beide dimensionslos gemacht: $\pi a^3|\psi|^2$ und $a\,P(r)$, mit $r$ in Einheiten von $a$.

Im Labor zum Wasserstoff siehst du nur die zweite Kurve, $r^2|R_{nl}|^2$. Die erste kommt dort nicht vor. Lies deshalb an der Achsenbeschriftung ab, welche Dichte gemeint ist, bevor du ein Maximum deutest.`,
        reps:{obj:R`Wasserstoff-Grundzustand $\psi = e^{-r/a}/\sqrt{\pi a^3}$`,
          rows:[
            {k:'formel', tex:R`\begin{gathered}|\psi|^2 = \frac{e^{-2r/a}}{\pi a^3}\\ P(r) = 4\pi r^2|\psi|^2 = \frac{4r^2}{a^3}\,e^{-2r/a}\end{gathered}`},
            {k:'graph', plot:{x:[0, 5], y:[-0.05, 1.1], xlab:'r/a', ylab:'\\text{Dichte}', ticks:[{x:1, lab:'a'}, {x:1.5, lab:'\\tfrac32 a'}]}, f:r => 4 * r * r * Math.exp(-2 * r), lab:R`a\,P(r)`, f2:r => Math.exp(-2 * r), lab2:R`\pi a^3|\psi|^2`,
              cap:R`Durchgezogen die Dichte pro Abstand, Maximum bei $r = a$. Gestrichelt die Dichte pro Volumen, Maximum am Kern. Markiert sind $a$ und der mittlere Abstand $\tfrac32a$.`},
            {k:'worte', text:R`Pro Volumen ist das Elektron am Kern am dichtesten. Pro Abstand liegt am meisten in der Schale bei $r = a$, weil die Schalen nach außen wachsen.`},
            {k:'labor', text:R`Labor zum Wasserstoff mit $n = 1$, $l = 0$: Die blaue Kurve $r^2|R_{10}|^2$ ist $P(r)$, die rote Linie markiert den mittleren Abstand $\langle r\rangle = 1{,}5\,a_0$.`},
            {k:'physik', text:R`Der wahrscheinlichste Abstand des Elektrons vom Kern ist der Bohrradius $a_0 \approx 0{,}053\,\mathrm{nm}$ (Thema 9).`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Beide Formeln dimensionslos machen und über $r/a$ zeichnen: $P$ mal $a$, $|\psi|^2$ mal $\pi a^3$.`},
            {from:'graph', to:'worte', rule:R`Bei jeder Kurve fragen, wo sie ihr Maximum hat und welche Frage sie beantwortet: „wie dicht“ oder „in welchem Abstand“.`},
            {from:'worte', to:'labor', rule:R`Im Labor die Achse lesen: $r^2|R_{nl}|^2$ ist die Dichte pro Abstand, also die durchgezogene Kurve der Tafel.`},
            {from:'labor', to:'physik', rule:R`Das Maximum der Laborkurve in Einheiten $a_0$ ablesen und mit $a_0 \approx 0{,}053\,\mathrm{nm}$ in eine Länge umrechnen.`}
          ]},
        q:{q:R`Im Labor zeigt die Kurve $r^2|R_{21}|^2$ für $n = 2$, $l = 1$ ihr Maximum bei $r = 4\,a_0$, die rote Linie steht bei $5\,a_0$. Was gibt das Maximum an?`, tr:{from:'labor', to:'physik'},
          opts:[R`den Ort, an dem $|\psi|^2$ am größten ist`, R`den wahrscheinlichsten Abstand vom Kern`, R`den mittleren Abstand $\langle r\rangle$`], a:1,
          ex:R`Die Kurve ist eine Dichte pro Abstand. Ihr Maximum ist der wahrscheinlichste Abstand; den Mittelwert zeigt die rote Linie.`,
          fb:[R`Die Laborkurve enthält den Faktor $r^2$; sie ist die Dichte pro Abstand, nicht pro Volumen.`,
            '',
            R`Den mittleren Abstand zeigt die rote Linie bei $5\,a_0$. Das Maximum liegt woanders, weil die Kurve nicht symmetrisch ist.`]}},
      {id:'ms-t2f', title:'Typischer Fehler: Dichte und Abstand verwechseln',
        num:{title:'Konstante Dichte in einer Kugel', text:R`Ist $\rho$ in einer Kugel vom Radius $R$ konstant, dann ist $P(r) \propto r^2$. Bei $r = R/2$ ist $P$ nur ein Viertel so groß wie bei $r = R$. Der wahrscheinlichste Abstand ist der Rand, obwohl die Dichte überall gleich ist.`},
        text:R`Ein verbreiteter Fehlschluss lautet: „Wo $|\psi|^2$ am größten ist, liegt auch der wahrscheinlichste Abstand.“ Das verwechselt Dichte pro Volumen mit Dichte pro Abstand. Der Faktor $4\pi r^2$ macht den Unterschied. Beim Wasserstoff-Grundzustand ist $|\psi|^2$ am Kern am größten, der wahrscheinlichste Abstand ist trotzdem $a$. Beide Aussagen stimmen; sie beantworten verschiedene Fragen.

Prüfe deshalb bei jeder Aufgabe zuerst, wonach gefragt ist. „Wo ist die Dichte am größten?“ zielt auf $|\psi|^2$. „In welchem Abstand findet man das Teilchen am ehesten?“ zielt auf $P(r)$.`,
        q:{q:R`Eine Wellenfunktion ist in einer Kugel mit Radius $R$ konstant und außerhalb null. Welcher Abstand vom Mittelpunkt ist am wahrscheinlichsten?`,
          opts:[R`$r = 0$, im Mittelpunkt`, R`alle Abstände gleich`, R`$r = R$, am Rand`], a:2,
          ex:R`$P(r) \propto r^2$ wächst bis zum Rand. Konstante Dichte pro Volumen heißt nicht konstante Dichte pro Abstand.`,
          fb:[R`Im Mittelpunkt hat die Schale kein Volumen, $P(0) = 0$.`,
            R`Gleich ist nur die Dichte pro Volumen. Die Schalen werden nach außen größer.`,
            '']}}
    ]},

    /* ===== Abschnitt 3: Laplace-Operator ===== */
    {id:'ms-t3', title:'Der Laplace-Operator in Kugelkoordinaten', steps:[
      {id:'ms-t3a', title:'Der Laplace-Operator: Krümmung in drei Richtungen',
        pre:{from:'m-dgl', seg:'md-t3', title:'Die zweite Ableitung als Krümmung', text:R`$y'' > 0$ heißt: Die Kurve biegt sich nach oben; $y'' < 0$: nach unten. Eine DGL zweiter Ordnung schreibt die Krümmung vor. Mini-Beispiel: $y = x^2$ hat überall $y'' = 2$.`},
        num:{title:'Zwei Funktionen', text:R`Für $f = x^2 + y^2 + z^2$ ist $\nabla^2f = 2 + 2 + 2 = 6$: in jeder Richtung nach oben gekrümmt. Für $g = x^2 - y^2$ ist $\nabla^2g = 2 - 2 + 0 = 0$: In $x$-Richtung biegt sich die Fläche nach oben, in $y$-Richtung gleich stark nach unten.`},
        text:R`Der [[lex:laplace-operator|Laplace-Operator]] ist die Summe der zweiten Ableitungen in drei Richtungen:

$$\nabla^2 = \frac{\partial^2}{\partial x^2} + \frac{\partial^2}{\partial y^2} + \frac{\partial^2}{\partial z^2},$$

gelesen „Nabla Quadrat“. Er ist die dreidimensionale Fassung der Krümmung $y''$. Ist $\nabla^2f > 0$, ist $f$ im Mittel nach oben gekrümmt; ist $\nabla^2f = 0$, heben sich die Krümmungen auf.

Ausblick: In der Quantenmechanik ist die kinetische Energie in drei Dimensionen $-\frac{\hbar^2}{2m}\nabla^2$, die Fassung von $-\frac{\hbar^2}{2m}\frac{d^2}{dx^2}$ im Raum. Für ein kugelsymmetrisches Potential brauchst du deshalb $\nabla^2$ in Kugelkoordinaten (Thema 9).`,
        q:{q:R`Was ist $\nabla^2(xy)$?`,
          opts:[R`$0$`, R`$2$`, R`$x + y$`], a:0,
          ex:R`$\partial_x^2(xy) = 0$, $\partial_y^2(xy) = 0$, $\partial_z^2(xy) = 0$. Die gemischte Ableitung $\partial_x\partial_y$ kommt in $\nabla^2$ nicht vor.`,
          fb:['',
            R`Hier wurde wohl $\partial_x\partial_y(xy) = 1$ doppelt gezählt. $\nabla^2$ enthält nur $\partial_x^2$, $\partial_y^2$, $\partial_z^2$.`,
            R`$x + y$ wäre die Summe der ersten Ableitungen $\partial_y(xy)$ und $\partial_x(xy)$. $\nabla^2$ verlangt zweite Ableitungen nach derselben Variablen.`]}},
      {id:'ms-t3b', title:R`Radiale Funktionen ableiten: $\partial r/\partial x = x/r$`,
        num:{title:R`Der Punkt $(3, 4, 0)$`, text:R`Dort ist $r = \sqrt{9 + 16} = 5$, also $\partial r/\partial x = 3/5 = 0{,}6$ und $\partial r/\partial y = 0{,}8$. Probe: Gehst du um $0{,}001$ in $x$-Richtung, wächst $r$ um etwa $0{,}0006$.`},
        text:R`Hängt $f$ nur von $r = \sqrt{x^2 + y^2 + z^2}$ ab, brauchst du die Kettenregel. Zuerst ist

$$\frac{\partial r}{\partial x} = \frac{2x}{2\sqrt{x^2 + y^2 + z^2}} = \frac{x}{r},$$

ebenso $y/r$ und $z/r$. Daraus folgt $\partial_x f = f'(r)\,x/r$. Der [[lex:nabla|Gradient]] einer radialen Funktion ist deshalb $\nabla f = f'(r)\,\vec r/r$: Er zeigt radial nach außen, und sein Betrag ist $|f'(r)|$. Der Vektor $\vec r/r$ hat die Länge 1 und heißt $\hat e_r$. Ändert sich $f$ nur mit dem Abstand, ändert es sich in tangentialer Richtung gar nicht.`,
        q:{q:R`Was ist $\nabla r$, der Gradient des Abstands selbst?`,
          opts:[R`der Vektor $\vec r$`, R`der Einheitsvektor $\vec r/r$`, R`der Vektor $(1, 1, 1)$`], a:1,
          ex:R`Mit $f = r$ ist $f' = 1$, also $\nabla r = \vec r/r = \hat e_r$: Länge 1, radial nach außen.`,
          fb:[R`$\vec r$ hat die Länge $r$. Der Gradient von $r$ hat aber den Betrag $f' = 1$.`,
            '',
            R`$(1, 1, 1)$ zeigt immer in dieselbe Richtung. Der Gradient von $r$ zeigt an jedem Punkt radial nach außen.`]}},
      {id:'ms-t3c', title:'Der Radialteil aus der Kettenregel',
        num:{title:R`$f = r^2$`, text:R`Mit $f' = 2r$ und $f'' = 2$ ist $f'' + \frac2rf' = 2 + 4 = 6$. Das stimmt mit $\nabla^2(x^2 + y^2 + z^2) = 6$ aus Schritt 1 überein. Nur $f'' = 2$ wäre zu wenig.`},
        text:R`Leitest du $\partial_x f = f'\,x/r$ noch einmal nach $x$ ab, brauchst du Produkt- und Kettenregel:

$$\partial_x^2 f = f''\,\frac{x^2}{r^2} + f'\left(\frac1r - \frac{x^2}{r^3}\right).$$

Dasselbe gilt für $y$ und $z$. Addierst du alle drei und benutzt $x^2 + y^2 + z^2 = r^2$, folgt

$$\nabla^2f = f'' + \frac2r\,f'.$$

Der Term $\frac2rf'$ ist der Unterschied zur Rechnung in einer Dimension. Er stammt daher, dass die Kugelflächen nach außen wachsen: Eine radiale Funktion verteilt sich auf immer größere Flächen.`,
        q:{q:R`Was ist $\nabla^2 r$ für $r > 0$?`,
          opts:[R`$2/r$`, R`$0$`, R`$1$`], a:0,
          ex:R`$f = r$: $f'' = 0$ und $\frac2rf' = \frac2r$.`,
          fb:['',
            R`$f'' = 0$ stimmt, aber der Term $\frac2rf'$ fehlt.`,
            R`$1$ ist die erste Ableitung $f'$. $\nabla^2$ verlangt $f'' + \frac2rf'$.`]}},
      {id:'ms-t3d', title:'Zwei bequeme Schreibweisen',
        num:{title:R`$f = e^{-r/a}$`, text:R`Mit der zweiten Schreibweise: $(r\,e^{-r/a})' = (1 - r/a)\,e^{-r/a}$ und $(r\,e^{-r/a})'' = \left(\frac{r}{a^2} - \frac2a\right)e^{-r/a}$. Geteilt durch $r$:

$$\nabla^2e^{-r/a} = \left(\frac{1}{a^2} - \frac{2}{ar}\right)e^{-r/a}.$$`},
        text:R`Für radiale Funktionen gibt es zwei gleichwertige Schreibweisen, die die Herleitung ineinander überführt:

$$\nabla^2f = \frac{1}{r^2}\frac{d}{dr}\left(r^2\frac{df}{dr}\right) = \frac1r\frac{d^2}{dr^2}(rf).$$

Die zweite ist oft am schnellsten: $r$ mal $f$ bilden, zweimal ableiten, durch $r$ teilen. Das Beispiel zeigt den zweiten Term $-\frac{2}{ar}e^{-r/a}$, den übersieht, wer nur $f''$ rechnet. Ebenso siehst du sofort: $\nabla^2\frac1r = \frac1r\cdot(1)'' = 0$ für $r > 0$.

Der volle Laplace-Operator in Kugelkoordinaten hat zusätzlich einen Winkelteil. Für radiale Funktionen ist er null.`,
        derive:{ctx:RAD({abstract:{f:{args:['r']}}}),
          lines:[
            {l:'1/r^2 d/dr (r^2 d/dr f(r)) = 1/r^2 (2r d/dr f(r) + r^2 d^2/dr^2 f(r))', w:'Produktregel', why:{q:'Welche Regel wird hier angewandt?', opts:['Produktregel für $r^2\\cdot f\'(r)$', 'Kettenregel mit $u = r^2$', 'partielle Integration nach $r$'], a:0, ex:'$(r^2f\')\' = 2rf\' + r^2f\'\'$.'}},
            {l:'= d^2/dr^2 f(r) + 2/r d/dr f(r)', w:'durch r² geteilt'},
            {l:'1/r d^2/dr^2 (r f(r)) = 1/r d/dr (f(r) + r d/dr f(r))', w:'zweite Form: einmal abgeleitet'},
            {l:'= 1/r (2 d/dr f(r) + r d^2/dr^2 f(r))', w:'noch einmal abgeleitet', why:{q:'Woher kommt die $2$ vor $f\'$?', opts:['$f\'$ entsteht zweimal: aus $f$ und aus $(r\\,f\')\'$', 'aus dem Faktor $r^2$ der ersten Form', 'aus der Kettenregel mit $\\partial r/\\partial x$'], a:0, ex:'$(f + rf\')\' = f\' + f\' + rf\'\' = 2f\' + rf\'\'$.'}},
            {l:'= d^2/dr^2 f(r) + 2/r d/dr f(r)', w:'beide Formen sind gleich'}
          ]},
        q:{q:R`Was ist $\nabla^2(1/r^2)$ für $r > 0$?`,
          opts:[R`$6/r^4$`, R`$2/r^4$`, R`$0$`], a:1,
          ex:R`$\frac1r\left(r\cdot\frac{1}{r^2}\right)'' = \frac1r\left(\frac1r\right)'' = \frac1r\cdot\frac{2}{r^3} = \frac{2}{r^4}$.`,
          fb:[R`$6/r^4$ ist nur $f''$. Der Term $\frac2rf' = -\frac{4}{r^4}$ fehlt.`,
            '',
            R`Null ist $\nabla^2(1/r)$, nicht $\nabla^2(1/r^2)$.`]}},
      {id:'ms-t3e', title:'Der radiale Laplace-Operator in vier Gestalten: Tafel',
        num:{title:R`$f = e^{-r}/r$`, text:R`Mit $u = rf = e^{-r}$ ist $u'' = e^{-r}$, also $\nabla^2f = u''/r = e^{-r}/r = f$. Eine numerische Probe am Punkt $(0{,}7;\ -0{,}4;\ 0{,}9)$ mit drei zweiten Differenzenquotienten ergibt denselben Wert, etwa $0{,}247$.`},
        text:R`Die Tafel verbindet die Gestalten des radialen Laplace-Operators. In Worten ist er die Krümmung plus ein Ausbreitungsterm. Als Formel ist er $f'' + \frac2rf'$. Als Rechenvorschrift ist er „mit $r$ malnehmen, zweimal ableiten, durch $r$ teilen“. Der Graph zeigt eine Funktion und ihren Laplace-Operator nebeneinander.

Die Substitution $u(r) = r\,f(r)$ ist dabei mehr als ein Rechentrick. Mit ihr wird $\nabla^2f = u''/r$, und eine Gleichung für $f$ im Raum wird eine eindimensionale Gleichung für $u$. Genau so wird die Radialgleichung des Wasserstoffatoms einfach (Thema 9).`,
        reps:{obj:R`Der radiale Laplace-Operator am Beispiel $f = e^{-r}$`,
          rows:[
            {k:'worte', text:R`Krümmung $f''$ plus ein Term, der vom Wachsen der Kugelflächen kommt.`},
            {k:'formel', tex:R`\begin{gathered}\nabla^2f = f'' + \frac2r\,f'\\ \Rightarrow\quad\nabla^2e^{-r} = \left(1 - \frac2r\right)e^{-r}\end{gathered}`},
            {k:'mathe', tex:R`\begin{gathered}\nabla^2f = \frac1r\,(rf)'',\\ u = rf\;\Rightarrow\;\nabla^2f = \frac{u''}{r}\end{gathered}`},
            {k:'graph', plot:{x:[0.4, 6], y:[-1.6, 0.8], xlab:'r', ylab:'', ticks:[{x:2, lab:'2'}]}, f:r => Math.exp(-r), lab:R`f = e^{-r}`, f2:r => (1 - 2 / r) * Math.exp(-r), lab2:R`\nabla^2 f`,
              cap:R`Für $r < 2$ ist $\nabla^2f < 0$, obwohl $f'' = e^{-r} > 0$ überall ist: Dort überwiegt der Term $\frac2rf'$. Bei $r = 2$ ist $\nabla^2f = 0$.`},
            {k:'physik', text:R`Ausblick: Mit $u = rR$ wird die Radialgleichung des Wasserstoffatoms eine Schrödingergleichung in einer Dimension für $u(r)$ (Thema 9).`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Krümmung“ ist $f''$, „Ausbreitung“ ist $\frac2rf'$; beides addieren.`},
            {from:'formel', to:'mathe', rule:R`Statt $f'$ und $f''$ getrennt zu bilden: $rf$ zweimal ableiten und durch $r$ teilen.`},
            {from:'mathe', to:'graph', rule:R`Für die gewählte Funktion $\nabla^2f$ ausrechnen und neben $f$ zeichnen; Vorzeichenwechsel zeigen, wo die Ausbreitung die Krümmung überwiegt.`},
            {from:'graph', to:'physik', rule:R`Die Funktion $u = rf$ statt $f$ betrachten; für $u$ gilt eine Gleichung wie in einer Dimension.`}
          ]},
        q:{q:R`Für eine radiale Funktion $f$ gilt mit $u = rf$ die Gleichung $u'' = 4u$. Was ist $\nabla^2f$?`, tr:{from:'mathe', to:'formel'},
          opts:[R`$4u$`, R`$4f$`, R`$4f/r$`], a:1,
          ex:R`$\nabla^2f = u''/r = 4u/r = 4f$.`,
          fb:[R`$u''$ ist noch durch $r$ zu teilen: $\nabla^2f = u''/r$.`,
            '',
            R`$u/r$ ist schon $f$; ein weiteres $1/r$ kommt nicht dazu.`]}},
      {id:'ms-t3f', title:R`Typischer Fehler: $\nabla^2f = f''$`,
        num:{title:R`$f = r^2$ noch einmal`, text:R`Nur zweimal nach $r$ abgeleitet gibt $f'' = 2$. Richtig ist $\nabla^2r^2 = 6$, denn kartesisch ist $\nabla^2(x^2 + y^2 + z^2) = 2 + 2 + 2$. Der fehlende Teil $4$ ist genau $\frac2rf' = \frac2r\cdot 2r$.`},
        text:R`Der häufigste Fehler mit dem Laplace-Operator: Für eine radiale Funktion einfach $\nabla^2f = f''$ setzen. Das gilt nur in einer Dimension. In drei Dimensionen fehlt dann der Term $\frac2rf'$.

Die schnellste Kontrolle ist ein Beispiel, das du kartesisch kennst, etwa $r^2 = x^2 + y^2 + z^2$ mit $\nabla^2r^2 = 6$. Eine zweite Kontrolle ist $\nabla^2\frac1r = 0$ für $r > 0$. Rechnet deine Formel dafür etwas anderes, fehlt der Ausbreitungsterm.`,
        q:{q:R`Was ist $\nabla^2e^{-r^2}$ in drei Dimensionen?`,
          opts:[R`$(4r^2 - 2)\,e^{-r^2}$`, R`$-2\,e^{-r^2}$`, R`$(4r^2 - 6)\,e^{-r^2}$`], a:2,
          ex:R`$f' = -2r\,e^{-r^2}$, $f'' = (4r^2 - 2)\,e^{-r^2}$ und $\frac2rf' = -4\,e^{-r^2}$. Zusammen $(4r^2 - 6)\,e^{-r^2}$.`,
          fb:[R`Das ist nur $f''$. Der Term $\frac2rf' = -4e^{-r^2}$ fehlt.`,
            R`$-2e^{-r^2}$ entsteht, wenn man den Exponenten nur einmal ableitet und die Produktregel vergisst.`,
            '']}}
    ]},

    /* ===== Abschnitt 4: Orthogonale Polynome: Rekursion, Nullstellen, Parität, Gewicht ===== */
    {id:'ms-t4', title:'Orthogonale Polynome mit Gewicht', steps:[
      {id:'ms-t4a', title:'Warum Polynome? Die Hermite-Gleichung',
        pre:{from:'m-dgl', seg:'md-t4', title:'Randbedingungen wählen Eigenwerte aus', text:R`$y'' = -k^2y$ hat für jedes $k$ Lösungen. Erst $y(0) = y(L) = 0$ lässt nur $k = n\pi/L$ zu. Mini-Beispiel: Für $L = 1$ geht $k = \pi$, aber $k = 3$ nicht, denn $\sin 3 \ne 0$.`},
        num:{title:R`$H_2 = 4x^2 - 2$`, text:R`Die Hermite-Gleichung mit $n = 2$ lautet $H'' - 2xH' + 4H = 0$. Für $H_2 = 4x^2 - 2$ ist $H_2' = 8x$ und $H_2'' = 8$:

$$\begin{aligned}&8 - 2x\cdot 8x + 4\,(4x^2 - 2)\\ &= 8 - 16x^2 + 16x^2 - 8 = 0.\end{aligned}$$`},
        text:R`Drei Familien von Polynomen tauchen in der Quantenmechanik immer wieder auf: Hermite, Legendre und Laguerre. Sie lösen DGL mit **nicht konstanten** Koeffizienten, etwa die Hermite-Gleichung

$$H'' - 2x\,H' + 2n\,H = 0.$$

Der Exponentialansatz aus M7 hilft hier nicht, denn der Koeffizient $-2x$ hängt von $x$ ab. Man setzt eine Potenzreihe an. Für die Physik brauchbar sind nur Lösungen, die nicht zu schnell wachsen. Das gelingt nur, wenn die Reihe abbricht. Dann ist die Lösung ein Polynom vom Grad $n$. Diese Abbruchbedingung wirkt wie eine Randbedingung und lässt nur ganze $n = 0, 1, 2, \dots$ zu.`,
        q:{q:R`Warum führt der Ansatz $y = e^{\lambda x}$ bei $H'' - 2xH' + 2nH = 0$ nicht zum Ziel?`,
          opts:['Weil der Koeffizient $-2x$ nicht konstant ist.', 'Weil die Hermite-Gleichung nichtlinear ist.', 'Weil $e^{\\lambda x}$ keine Nullstellen hat.'], a:0,
          ex:R`Eingesetzt ergibt sich $(\lambda^2 - 2x\lambda + 2n)\,e^{\lambda x}$. Die Klammer hängt von $x$ ab und kann nicht für alle $x$ null sein.`,
          fb:['',
            R`Die Hermite-Gleichung ist linear: $H$ und seine Ableitungen kommen nur in der ersten Potenz vor.`,
            R`Dass $e^{\lambda x}$ nie null ist, ist gerade der Grund, warum der Ansatz bei konstanten Koeffizienten klappt. Hier stört der Koeffizient $-2x$.`]}},
      {id:'ms-t4b', title:'Die Rekursion erzeugt die Hermite-Polynome',
        num:{title:R`$H_2$ und $H_3$`, text:R`Aus $H_0 = 1$ und $H_1 = 2x$ folgt mit $n = 1$: $H_2 = 2x\cdot 2x - 2\cdot 1\cdot 1 = 4x^2 - 2$. Mit $n = 2$: $H_3 = 2x\,(4x^2 - 2) - 4\cdot 2x = 8x^3 - 12x$.`},
        text:R`Die [[lex:hermite-polynome|Hermite-Polynome]] $H_n$ musst du nicht auswendig kennen. Eine **Rekursion** erzeugt sie der Reihe nach:

$$\begin{gathered}H_{n+1}(x) = 2x\,H_n(x) - 2n\,H_{n-1}(x),\\ H_0 = 1,\quad H_1 = 2x.\end{gathered}$$

Gelesen: Das nächste Polynom ist $2x$ mal das aktuelle minus $2n$ mal das vorige. Jeder Schritt erhöht den Grad um eins, und der führende Koeffizient verdoppelt sich. Also hat $H_n$ den Grad $n$ und den führenden Koeffizienten $2^n$. Achte auf den Index im zweiten Term: Für $H_{n+1}$ steht dort $2n$, nicht $2(n + 1)$.`,
        q:{q:R`Was ergibt die Rekursion für $H_4$, mit $H_3 = 8x^3 - 12x$ und $H_2 = 4x^2 - 2$?`,
          opts:[R`$16x^4 - 40x^2 + 8$`, R`$16x^4 - 48x^2 + 12$`, R`$16x^4 - 24x^2$`], a:1,
          ex:R`Mit $n = 3$: $H_4 = 2x\,(8x^3 - 12x) - 6\,(4x^2 - 2) = 16x^4 - 24x^2 - 24x^2 + 12$.`,
          fb:[R`Hier wurde $2n$ mit $n = 2$ statt $n = 3$ genommen. Für $H_{n+1} = H_4$ ist $n = 3$, also $-6H_2$.`,
            '',
            R`Der zweite Term $-2nH_{n-1} = -6H_2$ fehlt.`]}},
      {id:'ms-t4c', title:'Nullstellen und Parität im Bild',
        num:{title:R`$H_2$ und $H_3$`, text:R`$H_2 = 4x^2 - 2$ ist null bei $x = \pm 1/\sqrt2 \approx \pm 0{,}71$ und gerade. $H_3 = 4x\,(2x^2 - 3)$ ist null bei $x = 0$ und $x = \pm\sqrt{3/2} \approx \pm 1{,}22$ und ungerade: $H_3(-x) = -H_3(x)$.`},
        text:R`Zwei Eigenschaften siehst du jedem Graphen sofort an. Erstens hat $H_n$ genau $n$ einfache reelle Nullstellen. Zweitens hat $H_n$ die **Parität** $(-1)^n$: gerade für gerades $n$, ungerade für ungerades $n$. Die Parität folgt aus der Rekursion, denn der Faktor $2x$ wechselt bei jedem Schritt die Symmetrie.

Im Bild daneben zeichnet das Labor die Hermite-Funktion zum Grad $n$ als blaue Kurve. Das ist $H_n$ mal dem Gauß-Faktor $e^{-x^2/2}$ und einer Normierungskonstanten. Der Faktor ändert die Nullstellen nicht. Die blauen Punkte auf der Achse sind die Nullstellen, die Anzeige zählt sie. Die rot gestrichelte Kurve gehört zum Vergleichsgrad $m$.`,
        fig:{lab:'special', caption:'Hermite-Funktionen, Legendre- und Laguerre-Polynome: Zahl der Nullstellen und das Orthogonalitätsintegral mit Gewicht für zwei wählbare Grade $n$ und $m$.'},
        q:{q:R`Was weißt du über $H_5$, ohne es auszurechnen?`,
          opts:[R`fünf Nullstellen, gerade, keine Nullstelle bei $0$`, R`vier Nullstellen, ungerade`, R`fünf Nullstellen, ungerade, eine davon bei $0$`], a:2,
          ex:R`$H_5$ hat $5$ Nullstellen und die Parität $(-1)^5 = -1$. Eine ungerade Funktion ist bei $x = 0$ null; die übrigen vier liegen symmetrisch dazu.`,
          fb:[R`Die Parität ist $(-1)^5 = -1$: ungerade. Und jede ungerade Funktion verschwindet bei $x = 0$.`,
            R`Die Zahl der Nullstellen ist der Grad, also $5$.`,
            '']}},
      {id:'ms-t4d', title:'Ein Polynom in vier Darstellungen: Tafel',
        num:{title:R`$H_3$ an zwei Stellen`, text:R`$H_3(1) = 8 - 12 = -4$ und $H_3(2) = 64 - 24 = 40$: Das Polynom wächst für große $x$ schnell. Die normierte Hermite-Funktion $u_3 = H_3\,e^{-x^2/2}/\sqrt{48\sqrt\pi}$ ist bei $x = 1$ etwa $-0{,}26$ und klingt für große $|x|$ ab.`},
        text:R`Die Tafel zeigt $H_3$ in den Darstellungen, zwischen denen du wechseln musst. Die Rekursion baut das Polynom. Die Formel zeigt Grad, Nullstellen und Parität. Der Graph zeigt beides auf einen Blick, hier zusammen mit dem Gauß-Faktor. Das Labor zählt die Nullstellen, und die Physik nennt, wo diese Funktion auftritt.

Lies die Übersetzung in beide Richtungen. Vom Graphen kommst du zurück zur Formel: Zahl der Nullstellen gleich Grad, Symmetrie gleich Parität. Damit findest du zu einer Skizze das passende $H_n$.`,
        reps:{obj:R`Das Hermite-Polynom $H_3$`,
          rows:[
            {k:'mathe', tex:R`\begin{gathered}H_3 = 2x\,H_2 - 4\,H_1\\ = 2x\,(4x^2 - 2) - 8x\end{gathered}`},
            {k:'formel', tex:R`H_3(x) = 8x^3 - 12x = 4x\,(2x^2 - 3)`},
            {k:'graph', plot:{x:[-4, 4], y:[-0.8, 0.8], xlab:'x', ylab:'u_n(x)', ticks:[{x:-Math.sqrt(1.5), lab:'-1{,}22'}, {x:Math.sqrt(1.5), lab:'1{,}22'}]}, f:x => (8 * x ** 3 - 12 * x) * Math.exp(-x * x / 2) / Math.sqrt(48 * Math.sqrt(Math.PI)), lab:'u_3', f2:x => (4 * x * x - 2) * Math.exp(-x * x / 2) / Math.sqrt(8 * Math.sqrt(Math.PI)), lab2:'u_2',
              cap:R`Durchgezogen $u_3 \propto H_3\,e^{-x^2/2}$: drei Nullstellen, ungerade. Gestrichelt $u_2$: zwei Nullstellen, gerade.`},
            {k:'labor', text:R`Labor mit der Familie „Hermite-Funktionen“ und Grad $n = 3$: Die Anzeige nennt $H_3(x) = 8x^3 - 12x$ und „Nullstellen: 3“.`},
            {k:'physik', text:R`Ausblick: Der Zustand $\psi_3 \propto H_3(\xi)\,e^{-\xi^2/2}$ des harmonischen Oszillators hat drei Knoten und ist ungerade (Thema 7).`}
          ],
          links:[
            {from:'mathe', to:'formel', rule:R`Die Rekursion mit $n = 2$ einsetzen und ausmultiplizieren.`},
            {from:'formel', to:'graph', rule:R`Nullstellen aus der faktorisierten Form ablesen, Parität aus den Exponenten; dann mit $e^{-x^2/2}$ zeichnen.`},
            {from:'graph', to:'labor', rule:R`Im Labor den Grad so wählen, dass Zahl der Nullstellen und Symmetrie zur Skizze passen.`},
            {from:'labor', to:'physik', rule:R`Grad $n$ der Hermite-Funktion ist die Quantenzahl $n$ des Oszillators; Nullstellen heißen dort Knoten.`}
          ]},
        q:{q:R`Im Labor ist eine Hermite-Funktion ungerade und hat fünf Nullstellen. Welches Polynom steckt darin?`, tr:{from:'graph', to:'formel'},
          opts:[R`$32x^5 - 160x^3 + 120x$`, R`$16x^4 - 48x^2 + 12$`, R`$32x^5 - 160x^3 + 120$`], a:0,
          ex:R`Fünf Nullstellen heißt Grad 5. Ungerade heißt: nur ungerade Potenzen. Das ist $H_5$.`,
          fb:['',
            R`$H_4$ hat vier Nullstellen und ist gerade.`,
            R`Die Konstante $120$ macht das Polynom weder gerade noch ungerade. Ein ungerades Polynom enthält nur ungerade Potenzen.`]}},
      {id:'ms-t4e', title:'Orthogonal mit Gewicht',
        pre:{from:'m-hilbert', seg:'mh-t1', title:'Skalarprodukt von Funktionen', text:R`Für Funktionen ist $\langle f|g\rangle = \int_a^b f^*(x)\,g(x)\,dx$. Orthogonal heißt $\langle f|g\rangle = 0$. Mini-Beispiel: $\sin x$ und $\cos x$ sind auf $[0, 2\pi]$ orthogonal, obwohl sie sich überlappen.`},
        num:{title:R`$\int H_1^2\,e^{-x^2}dx$`, text:R`Mit $\int e^{-x^2}dx = \sqrt\pi$ und $\int x^2e^{-x^2}dx = \sqrt\pi/2$ über ganz $\mathbb R$ ist

$$\begin{aligned}\int_{-\infty}^\infty (2x)^2e^{-x^2}dx &= 4\cdot\frac{\sqrt\pi}{2} = 2\sqrt\pi\\ &= \sqrt\pi\,2^1\,1!.\end{aligned}$$`},
        text:R`Die wichtigste Eigenschaft der drei Familien ist ihre Orthogonalität **bezüglich einer [[lex:gewichtsfunktion|Gewichtsfunktion]]** $w(x) > 0$ auf einem festen Intervall:

$$\int_a^b p_n(x)\,p_m(x)\,w(x)\,dx = 0\quad (n \ne m).$$

Das ist ein Skalarprodukt wie in M5, nur mit Gewicht. Für Hermite ist $w = e^{-x^2}$ auf der ganzen Achse, und $\int H_n^2e^{-x^2}dx = \sqrt\pi\,2^nn!$. Ohne Gewicht gäbe es diese Integrale gar nicht, denn Polynome wachsen. Steckt man $\sqrt w$ in die Funktionen, sind sie ohne Gewicht orthogonal: Die $H_n(x)\,e^{-x^2/2}$ sind genau die Hermite-Funktionen im Labor. Die Herleitung prüft $H_0 \perp H_2$.`,
        derive:{ctx:{coords:['x']},
          lines:[
            {l:'∫_-∞^∞ H_0(x) H_2(x) e^(-x^2) dx = ∫_-∞^∞ (4x^2 - 2) e^(-x^2) dx', w:'H₀ = 1, H₂ = 4x² − 2'},
            {l:'= 4 · sqrt(π)/2 - 2 sqrt(π)', w:'Gauß-Integrale', why:{q:'Welche Gauß-Integrale werden benutzt?', opts:['$\\int x^2e^{-x^2}dx = \\frac{\\sqrt\\pi}{2}$ und $\\int e^{-x^2}dx = \\sqrt\\pi$', '$\\int x^2e^{-x^2}dx = \\sqrt\\pi$ und $\\int e^{-x^2}dx = \\frac{\\sqrt\\pi}{2}$', '$\\int x^2e^{-x^2}dx = 0$, weil $x^2e^{-x^2}$ ungerade ist'], a:0, ex:'Allgemein $\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1$.'}},
            {l:'= 0', w:'orthogonal mit Gewicht', why:{q:'Warum ist dieses Ergebnis bemerkenswert?', opts:['Weil beide Funktionen gerade sind und die Parität die Null nicht erklärt.', 'Weil Integrale über gerade Funktionen sonst immer null sind.', 'Weil $H_2$ an jeder Stelle null ist.'], a:0, ex:'Die Null kommt aus der genauen Form von $H_2$ zusammen mit dem Gewicht – das ist Orthogonalität.'}}
          ]},
        q:{q:R`Warum braucht das Skalarprodukt der Hermite-Polynome das Gewicht $e^{-x^2}$?`,
          opts:[R`Ohne Gewicht divergieren die Integrale über die ganze Achse.`, R`Ohne Gewicht wären die Polynome nicht mehr gerade oder ungerade.`, R`Das Gewicht normiert alle Hermite-Polynome auf $1$.`], a:0,
          ex:R`$\int(4x^2 - 2)\,dx$ über ganz $\mathbb R$ existiert nicht. Mit $e^{-x^2}$ werden alle Integrale endlich.`,
          fb:['',
            R`Die Parität ist eine Eigenschaft der Polynome selbst; das Gewicht ändert sie nicht.`,
            R`Auch mit Gewicht ist $\int H_n^2e^{-x^2}dx = \sqrt\pi\,2^nn!$, also nicht $1$.`]}},
      {id:'ms-t4f', title:'Zwei weitere Familien: Legendre und Laguerre',
        num:{title:R`$P_2$ und $L_2$`, text:R`$P_2 = \tfrac12(3x^2 - 1)$ ist null bei $x = \pm 1/\sqrt3 \approx \pm 0{,}58$, und $\int_{-1}^1P_0P_2\,dx = \tfrac12(2 - 2) = 0$. $L_2 = \tfrac12(x^2 - 4x + 2)$ ist null bei $x = 2 \pm \sqrt2$, also bei etwa $0{,}59$ und $3{,}41$.`},
        text:R`Nach demselben Muster gibt es zwei weitere Familien. Die [[lex:legendre-polynome|Legendre-Polynome]] $P_l$ sind orthogonal auf $[-1, 1]$ mit dem Gewicht $1$, und $\int_{-1}^1P_l^2\,dx = \frac{2}{2l + 1}$. Ihre Rekursion ist $(l + 1)P_{l+1} = (2l + 1)\,x\,P_l - l\,P_{l-1}$ mit $P_0 = 1$, $P_1 = x$.

Die [[lex:laguerre-polynome|Laguerre-Polynome]] $L_n$ sind orthogonal auf $[0, \infty)$ mit dem Gewicht $e^{-x}$, und $\int_0^\infty L_n^2e^{-x}dx = 1$. Beide haben wie $H_n$ genau $n$ Nullstellen im Intervall. Legendre-Polynome haben die Parität $(-1)^l$. Laguerre-Polynome haben keine Parität, denn ihr Intervall ist nicht symmetrisch.`,
        q:{q:R`$P_3 = \tfrac12(5x^3 - 3x)$. Wie viele Nullstellen hat es in $(-1, 1)$, und wo liegen sie?`, tr:{from:'formel', to:'graph'},
          opts:[R`zwei, bei $x \approx \pm 0{,}77$`, R`drei, bei $x = 0$ und $x \approx \pm 0{,}77$`, R`drei, bei $x = 0$ und $x = \pm 1$`], a:1,
          ex:R`$P_3 = \tfrac12x\,(5x^2 - 3)$ ist null bei $x = 0$ und $x = \pm\sqrt{3/5} \approx \pm 0{,}77$: drei Nullstellen, wie der Grad.`,
          fb:[R`Die Nullstelle bei $x = 0$ fehlt: $P_3$ ist ungerade.`,
            '',
            R`Am Rand ist $P_3(1) = 1$, nicht null. Die Nullstellen liegen im Inneren.`]}},
      {id:'ms-t4g', title:'Typischer Fehler: Orthogonalität mit Parität verwechseln',
        num:{title:R`$\int_{-1}^1P_1P_3\,dx$`, text:R`$P_1P_3 = x\cdot\tfrac12(5x^3 - 3x) = \tfrac12(5x^4 - 3x^2)$ ist **gerade**. Trotzdem ist

$$\begin{aligned}\int_{-1}^1P_1P_3\,dx &= \tfrac12\left(5\cdot\tfrac25 - 3\cdot\tfrac23\right)\\ &= \tfrac12(2 - 2) = 0.\end{aligned}$$`},
        text:R`Zwei Fehlvorstellungen kommen oft vor. Die erste: „Orthogonal heißt, das Produkt ist überall null.“ Falsch, orthogonale Funktionen überlappen sich. Nur ihr gewichtetes Integral verschwindet, weil sich positive und negative Beiträge genau aufheben.

Die zweite: „Orthogonalität folgt immer aus der Parität.“ Die Parität erledigt nur Paare mit verschiedener Parität, etwa $P_2$ und $P_3$: Das Produkt ist ungerade, das Integral über $[-1, 1]$ also null. Bei gleicher Parität hilft sie nicht. Das Beispiel $P_1P_3$ und die Herleitung zu $H_0H_2$ zeigen: Dann steckt die Null in der genauen Form der Polynome.`,
        q:{q:R`Ist $\int_{-1}^1P_1(x)P_3(x)\,dx = 0$ eine Folge der Parität?`,
          opts:[R`Ja: Das Produkt zweier ungerader ist ungerade.`, R`Nein: beide ungerade, es folgt aus der Orthogonalität.`, R`Nein: Das Integral ist gar nicht null.`], a:1,
          ex:R`$P_1P_3$ ist gerade, ungerade mal ungerade. Null ist das Integral trotzdem, weil die Legendre-Polynome orthogonal sind.`,
          fb:[R`Ungerade mal ungerade ist gerade, wie $x\cdot x = x^2$.`,
            '',
            R`Doch, das Beispiel rechnet es nach: $\tfrac12(2 - 2) = 0$.`]}}
    ]},

    /* ===== Abschnitt 5: Brücken zur Physik: Oszillator, Drehimpuls, Wasserstoff ===== */
    {id:'ms-t5', title:'Wo die speziellen Funktionen in der Quantenmechanik stehen', steps:[
      {id:'ms-t5a', title:'Ein gemeinsames Muster',
        pre:{from:'m-dgl', seg:'md-t5', title:'Separation', text:R`Ein Produktansatz zerlegt eine partielle DGL in gewöhnliche DGL, die über eine Konstante verbunden sind. Mini-Beispiel: $u = \varphi(x)f(t)$ in $\partial_tu = \partial_x^2u$ gibt $f'/f = \varphi''/\varphi = \text{const}$.`},
        num:{title:'Gleich weit auseinander', text:R`Beim Oszillator sind die erlaubten Energien $E_n = \hbar\omega\left(n + \tfrac12\right)$ (Thema 7). Mit $\hbar\omega = 0{,}2\,\mathrm{eV}$ sind das $0{,}1$, $0{,}3$ und $0{,}5\,\mathrm{eV}$ für $n = 0, 1, 2$, je mit $n$ Knoten in der Wellenfunktion.`},
        text:R`Ausblick: Jede der drei Familien gehört zu einem Grundproblem der Quantenmechanik. Allen ist dasselbe Muster gemeinsam. Die Separation zerlegt die Schrödingergleichung in gewöhnliche Teilgleichungen (M7). Diese haben Lösungen der Form Polynom mal Gewichtsfaktor. Die Forderung „normierbar“ bzw. „überall endlich“ verlangt, dass eine Reihe abbricht. Das lässt nur ganzzahlige Grade zu. Daraus kommen die Quantenzahlen $n$ und $l$. Die dritte, $m$, ist aus einem anderen Grund ganz: $e^{im\varphi}$ muss nach einer vollen Drehung um $2\pi$ zu sich zurückkehren, wie die Schwingungen in M6.

Die Mathematik dieses Abschnitts kennst du schon. Neu ist nur, wo sie steht: Hermite beim Oszillator, Legendre beim Drehimpuls, Laguerre beim Wasserstoff.`,
        q:{q:R`Woher kommt, dass die Quantenzahlen $n$ und $l$ ganze Zahlen sind?`,
          opts:[R`aus der Forderung „normierbar“ bzw. „endlich“`, R`aus einer Rundung der gemessenen Energiewerte`, R`aus der Linearität der Schrödingergleichung allein`], a:0,
          ex:R`Normierbar bzw. endlich sind nur die Lösungen, deren Reihe zu einem Polynom abbricht. Polynome haben ganzzahlige Grade.`,
          fb:['',
            R`Die Ganzzahligkeit ist eine Folge der Mathematik, nicht der Messung. Die Messungen bestätigen sie.`,
            R`Linearität erlaubt Überlagerungen, wählt aber keine einzelnen Werte aus. Das tun Rand- bzw. Abbruchbedingungen.`]}},
      {id:'ms-t5b', title:'Hermite und der harmonische Oszillator',
        num:{title:'Ein Elektron mit 1 eV', text:R`Mit $\xi = x\sqrt{m\omega/\hbar}$ ist die Längeneinheit $\sqrt{\hbar/(m\omega)}$. Für ein Elektron mit $\hbar\omega = 1\,\mathrm{eV}$ sind das etwa $0{,}28\,\mathrm{nm}$. $\psi_2 \propto (4\xi^2 - 2)\,e^{-\xi^2/2}$ hat Knoten bei $\xi = \pm 1/\sqrt2$, also bei $x \approx \pm 0{,}20\,\mathrm{nm}$.`},
        text:R`Ausblick auf Thema 7: Beim harmonischen Oszillator ist das Potential eine Parabel. Mit der dimensionslosen Länge $\xi = x\sqrt{m\omega/\hbar}$, gelesen „xi“, sind die Eigenfunktionen

$$\psi_n(x) \propto H_n(\xi)\,e^{-\xi^2/2}.$$

Der Gauß-Faktor $e^{-\xi^2/2}$ ist die Wurzel aus dem Gewicht $e^{-\xi^2}$. Er sorgt dafür, dass $\psi_n$ abklingt. Das Polynom $H_n$ liefert die Knoten, also $n$ Nullstellen, und die Parität. Die Orthogonalität der Eigenfunktionen ist genau die Orthogonalität der Hermite-Polynome mit Gewicht.`,
        q:{q:R`Warum steht in $\psi_n \propto H_n(\xi)\,e^{-\xi^2/2}$ der Faktor $e^{-\xi^2/2}$ und nicht $e^{-\xi^2}$?`,
          opts:[R`Weil $e^{-\xi^2}$ nicht normierbar wäre.`, R`So enthält $\psi_n\psi_m$ genau das Gewicht $e^{-\xi^2}$.`, R`Das ist eine Konvention ohne Folgen.`], a:1,
          ex:R`$\int\psi_n\psi_m\,d\xi \propto \int H_nH_me^{-\xi^2}d\xi$. So wird die Orthogonalität der Eigenfunktionen genau die der Hermite-Polynome.`,
          fb:[R`Auch $H_ne^{-\xi^2}$ wäre normierbar. Entscheidend ist, dass das Produkt zweier Eigenfunktionen das Gewicht ergibt.`,
            '',
            R`Mit $e^{-\xi^2}$ in jeder Funktion stünde im Skalarprodukt $e^{-2\xi^2}$, und die Hermite-Polynome wären dafür nicht orthogonal.`]}},
      {id:'ms-t5c', title:R`Legendre und die Winkel: aus $x$ wird $\cos\theta$`,
        num:{title:R`$Y_1^0$ an zwei Stellen`, text:R`$Y_1^0 = \sqrt{3/(4\pi)}\,\cos\theta$ ist bei $\theta = 0$, also auf der $z$-Achse, etwa $0{,}49$. Bei $\theta = \pi/2$ ist es null: Die ganze $xy$-Ebene ist eine Knotenfläche.`},
        text:R`Ausblick auf Thema 8: Setzt du $x = \cos\theta$, werden die Legendre-Polynome zu Funktionen auf der Kugel. Hängt eine Funktion nicht von $\varphi$ ab, gilt

$$Y_l^0(\theta) = \sqrt{\frac{2l + 1}{4\pi}}\,P_l(\cos\theta).$$

Die [[lex:kugelflaechenfunktionen|Kugelflächenfunktionen]] $Y_l^m$ beschreiben die Winkelabhängigkeit von Wellenfunktionen und damit die Form der Orbitale. Im Bild daneben ist $|Y_l^m|^2$ als Polardiagramm in der $xz$-Ebene gezeichnet: Der Abstand der Kurve vom Ursprung in Richtung $\theta$ ist proportional zu $|Y_l^m(\theta)|^2$. Für $l = 1$, $m = 0$ entsteht die Hantel $\propto\cos^2\theta$ entlang der $z$-Achse. Die Regler wählen $l$ und $m$.`,
        fig:{lab:'ylm', caption:'$|Y_l^m|^2$ als Polardiagramm in der $xz$-Ebene. Für $l = 1$, $m = 0$ entsteht die Hantel $\\propto\\cos^2\\theta$ entlang der $z$-Achse.'},
        q:{q:R`$Y_2^0 \propto P_2(\cos\theta) = \tfrac12(3\cos^2\theta - 1)$. Bei welchen Winkeln hat es Knoten?`,
          opts:[R`bei $\theta = 90°$, in der $xy$-Ebene`, R`bei $\theta \approx 54{,}7°$ und $\theta \approx 125{,}3°$`, R`bei $\theta = 0°$ und $\theta = 180°$`], a:1,
          ex:R`$\cos\theta = \pm 1/\sqrt3$ gibt $\theta \approx 54{,}7°$ und $125{,}3°$: zwei Kegel, passend zu den zwei Nullstellen von $P_2$.`,
          fb:[R`Bei $\theta = 90°$ ist $P_2(0) = -\tfrac12 \ne 0$. Die $xy$-Ebene ist ein Knoten von $Y_1^0$.`,
            '',
            R`Auf der $z$-Achse ist $P_2(\pm 1) = 1$, dort ist $|Y_2^0|^2$ am größten.`]}},
      {id:'ms-t5d', title:'Normiert auf der Kugel',
        num:{title:R`$|Y_1^0|^2$ über alle Richtungen`, text:R`$|Y_1^0|^2 = \tfrac{3}{4\pi}\cos^2\theta$. Mit $\int_0^\pi\cos^2\theta\sin\theta\,d\theta = \tfrac23$ aus Abschnitt 1 und dem Faktor $2\pi$ aus $\varphi$ ist $\tfrac{3}{4\pi}\cdot 2\pi\cdot\tfrac23 = 1$.`},
        text:R`Der Vorfaktor $\sqrt{(2l + 1)/(4\pi)}$ in $Y_l^0$ folgt aus der Normierung über die Kugel. Normiert heißt hier $\int|Y_l^m|^2\,d\Omega = 1$, mit dem Raumwinkelelement $d\Omega = \sin\theta\,d\theta\,d\varphi$. Zwei Bausteine kommen zusammen: Der Faktor $2l + 1$ gleicht $\int_{-1}^1P_l^2\,dx = \frac{2}{2l + 1}$ aus, und $4\pi$ ist der volle Raumwinkel.

Die Herleitung rechnet das für $l = 1$ nach. Sie benutzt die Substitution $u = \cos\theta$ aus Abschnitt 1. So wird das Winkelintegral zu einem Integral über ein Polynom.`,
        derive:{ctx:{coords:['θ', 'φ'], space:['θ', 'φ'], measure:'sin(θ)', params:{}},
          lines:[
            {l:'∫_0^π ∫_0^{2π} 3/(4π) cos(θ)^2 sin(θ) dφ dθ = 3/2 ∫_0^π cos(θ)^2 sin(θ) dθ', w:'|Y₁⁰|² = 3/(4π) cos²θ; φ-Integral = 2π'},
            {l:'= 3/2 ∫_-1^1 u^2 du', w:'u = cos θ', why:{q:'Warum laufen die neuen Grenzen von $-1$ bis $1$?', opts:['weil $du = -\\sin\\theta\\,d\\theta$ die Grenzen $1 \\to -1$ wieder umdreht', 'weil $\\cos\\theta$ immer zwischen $-1$ und $1$ liegt, egal wie', 'weil man $u$ beliebig wählen darf'], a:0, ex:'Bei $\\theta = 0$ ist $u = 1$, bei $\\theta = \\pi$ ist $u = -1$. Das Minus aus $du = -\\sin\\theta\\,d\\theta$ vertauscht die Grenzen zurück.'}},
            {l:'= 3/2 · 2/3', w:'∫ u² du = 2/3', why:{q:R`Woher kommt der Wert $\tfrac23$?`, opts:[R`$\left[\tfrac{u^3}{3}\right]_{-1}^{1} = \tfrac13 - \left(-\tfrac13\right)$`, R`$u^2$ ist ungerade, also zählt nur die halbe Fläche`, R`aus dem Vorfaktor $\tfrac32$, umgedreht`], a:0, ex:R`Das ist zugleich $\int_{-1}^1P_1^2\,du = \frac{2}{2\cdot 1 + 1}$, denn $P_1 = u$.`}},
            {l:'= 1', w:'Y₁⁰ ist normiert'}
          ]},
        q:{q:R`Welcher Vorfaktor normiert $Y_2^0 = c\,P_2(\cos\theta)$ auf der Kugel?`,
          opts:[R`$c = \sqrt{5/(4\pi)}$`, R`$c = \sqrt{5/2}$`, R`$c = 5/(4\pi)$`], a:0,
          ex:R`$c^2\cdot 2\pi\cdot\int_{-1}^1P_2^2\,du = c^2\cdot 2\pi\cdot\tfrac25 = 1$, also $c^2 = 5/(4\pi)$.`,
          fb:['',
            R`$\sqrt{5/2}$ normiert $P_2$ auf $[-1, 1]$. Auf der Kugel kommt noch der Faktor $2\pi$ aus $\varphi$ dazu.`,
            R`Das ist $c^2$. Der Vorfaktor ist die Wurzel daraus.`]}},
      {id:'ms-t5e', title:'Laguerre und die Radialfunktionen des Wasserstoffs',
        num:{title:R`Der Zustand $n = 2$, $l = 0$`, text:R`Mit $\rho = 2r/(na) = r/a$ ist $R_{20} \propto L_1^1(\rho)\,e^{-\rho/2} = (2 - \rho)\,e^{-r/(2a)}$. Der radiale Knoten liegt bei $\rho = 2$, also bei $r = 2a \approx 0{,}106\,\mathrm{nm}$.`},
        text:R`Ausblick auf Thema 9: Die [[lex:radialfunktionen|Radialfunktionen]] des Wasserstoffatoms haben die Form

$$R_{nl}(r) \propto \rho^l\,e^{-\rho/2}\,L_{n-l-1}^{2l+1}(\rho),\qquad \rho = \frac{2r}{na}.$$

Darin stehen zugeordnete Laguerre-Polynome $L_k^\alpha$, gelesen „L k alpha“, eine Verallgemeinerung der $L_n = L_n^0$. Sie sind auf $[0, \infty)$ orthogonal mit dem Gewicht $\rho^\alpha e^{-\rho}$. Der Faktor $e^{-\rho/2}$ ist wie beim Oszillator die Wurzel aus dem Exponentialteil des Gewichts und sorgt dafür, dass die Funktion abklingt. Der Grad $n - l - 1$ des Polynoms ist die Zahl der radialen Knoten, also der Kugelschalen, auf denen $R_{nl} = 0$ ist. Bücher normieren die Laguerre-Polynome unterschiedlich. Benutze Formeln deshalb immer zusammen aus derselben Quelle.`,
        q:{q:R`Wie viele radiale Knoten hat $R_{31}$?`,
          opts:[R`$2$`, R`$1$`, R`$3$`], a:1,
          ex:R`$n - l - 1 = 3 - 1 - 1 = 1$: der Grad des Laguerre-Polynoms $L_1^3$.`,
          fb:[R`$n - 1 = 2$ vergisst, dass $l$ auch zählt. Radiale Knoten sind $n - l - 1$.`,
            '',
            R`$n$ selbst ist zu groß; die Zahl der radialen Knoten ist $n - l - 1$.`]}},
      {id:'ms-t5f', title:'Drei Familien, drei Systeme: Tafel',
        num:{title:'Knoten zählen', text:R`Oszillator mit $n = 3$: $H_3$ hat Grad 3, also 3 Knoten. Winkelteil $Y_2^0$: $P_2$ hat Grad 2, also 2 Knotenkegel. Wasserstoff mit $n = 3$, $l = 0$: $L_2^1$ hat Grad 2, also 2 radiale Knoten.`},
        text:R`Die Tafel ordnet die drei Familien ihren Systemen zu. Die Mathe-Zeile nennt Polynom, Gewicht und Intervall. Die Formel zeigt, wie daraus die Wellenfunktion wird. Beim Oszillator und beim Wasserstoff ist es Polynom mal einem Faktor, der für Abklingen sorgt; beim Winkel ist es nur das Polynom in $\cos\theta$. In Worten gilt eine Regel für alle drei: Der Grad des Polynoms ist die Zahl der Knoten in der zugehörigen Variablen. Die Physik nennt das System und die Quantenzahl.

Mit dieser Tafel erkennst du Funktionen in einer Aufgabe wieder. Ein Polynom mal $e^{-\xi^2/2}$ ist ein Oszillatorzustand. Eine Funktion von $\cos\theta$ ist eine Kombination von Legendre-Polynomen. Ein Polynom in $r$ mal $e^{-r/(na)}$ ist eine Radialfunktion des Wasserstoffs.`,
        reps:{obj:'Hermite, Legendre und Laguerre in der Quantenmechanik',
          rows:[
            {k:'mathe', tex:R`\begin{aligned}H_n&:\ e^{-x^2}\ \text{auf}\ \mathbb R\\ P_l&:\ 1\ \text{auf}\ [-1, 1]\\ L_k^{\alpha}&:\ \rho^{\alpha}e^{-\rho}\ \text{auf}\ [0, \infty)\end{aligned}`},
            {k:'formel', tex:R`\begin{aligned}\psi_n &\propto H_n(\xi)\,e^{-\xi^2/2}\\ Y_l^0 &\propto P_l(\cos\theta)\\ R_{nl} &\propto \rho^l e^{-\rho/2}L_{n-l-1}^{2l+1}(\rho)\end{aligned}`},
            {k:'worte', text:R`Grad des Polynoms gleich Zahl der Knoten: $n$ Knoten in $x$, $l$ Knotenkegel bzw. -ebenen in $\theta$ (für $m = 0$), $n - l - 1$ Knotenschalen in $r$.`},
            {k:'physik', text:R`Oszillator (Thema 7), Drehimpuls und Orbitalform (Thema 8), Radialteil des Wasserstoffatoms (Thema 9).`}
          ],
          links:[
            {from:'mathe', to:'formel', rule:R`Je Familie die Variable übersetzen und den passenden Faktor anhängen. Hermite: $x \to \xi$, mal $e^{-\xi^2/2}$, der Wurzel aus dem Gewicht. Legendre: $x \to \cos\theta$, ohne Faktor. Laguerre: $x \to \rho = 2r/(na)$, mal $\rho^le^{-\rho/2}$.`},
            {from:'formel', to:'worte', rule:R`Den Grad des Polynoms in der Formel ablesen; er ist die Zahl der Nullstellen in dieser Variablen.`},
            {from:'worte', to:'physik', rule:R`Die Zahl der Knoten in die Quantenzahl des Systems übersetzen: $n$ beim Oszillator, $l$ beim Winkel, $n - l - 1$ radial.`}
          ]},
        q:{q:R`Ein Zustand des Wasserstoffatoms hat $n = 3$ und $l = 0$. Welches Polynom steckt in seiner Radialfunktion?`, tr:{from:'physik', to:'mathe'},
          opts:[R`ein Laguerre-Polynom vom Grad 3`, R`ein Legendre-Polynom vom Grad 2`, R`ein Laguerre-Polynom vom Grad 2`], a:2,
          ex:R`$L_{n-l-1}^{2l+1} = L_2^1$: Grad $2$, also zwei radiale Knoten.`,
          fb:[R`Der Grad ist $n - l - 1 = 2$, nicht $n$.`,
            R`Legendre-Polynome stehen im Winkelteil. Radial stehen Laguerre-Polynome.`,
            '']}},
      {id:'ms-t5g', title:'Typischer Fehler: Knoten falsch zählen',
        num:{title:R`$r^2e^{-r/(3a)}$`, text:R`Eine Funktion $r^2e^{-r/(3a)}$ mal einem Winkelanteil: Der Exponent $r/(na)$ gibt $n = 3$, die Potenz $r^l$ gibt $l = 2$. Radiale Knoten: $n - l - 1 = 0$. Wer $n - 1 = 2$ zählt, vergisst $l$.`},
        text:R`Beim Knotenzählen passieren zwei typische Fehler. Der erste ist ein verschobener Index: $\psi_n$ beim Oszillator hat $n$ Knoten, nicht $n + 1$, weil die Zählung bei $n = 0$ beginnt. Der zweite betrifft den Wasserstoff: Die radialen Knoten sind $n - l - 1$, nicht $n - 1$. Die übrigen $l$ Knoten stecken im Winkelteil.

Ein dritter Fehler betrifft Konventionen. Laguerre-Polynome werden in Büchern verschieden normiert, manchmal sogar mit anderem Vorzeichen. Die Nullstellen sind davon nicht betroffen; Vorfaktoren schon. Prüfe deshalb eine Normierung immer durch ein Integral, statt Formeln aus verschiedenen Quellen zu mischen.`,
        q:{q:R`Eine Wellenfunktion des Wasserstoffs hat die Form $r^2e^{-r/(3a)}$ mal einer Winkelfunktion. Was gilt?`,
          opts:[R`$n = 3$, keine radialen Knoten`, R`$n = 3$, zwei radiale Knoten`, R`$n = 2$, ein radialer Knoten`], a:0,
          ex:R`$e^{-r/(3a)}$ gibt $n = 3$, $r^2$ gibt $l = 2$, und $n - l - 1 = 0$: kein Polynom mit Nullstellen.`,
          fb:['',
            R`Zwei radiale Knoten hätte $l = 0$. Die Potenz $r^2$ zeigt aber $l = 2$.`,
            R`Der Exponent $r/(na)$ mit $3a$ im Nenner gehört zu $n = 3$.`]}}
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
    map:[
      {sym:R`H_n,\ P_n,\ L_n`, ctl:'Familie', says:R`Wählt die Familie. Hermite: die Hermite-Funktionen $u_n = H_n\,e^{-x^2/2}/\sqrt{\sqrt\pi\,2^nn!}$ auf der ganzen Achse. Legendre: $P_n$ auf $[-1, 1]$. Laguerre: $L_n\,e^{-x/2}$ auf $[0, \infty)$.`},
      {sym:'n', ctl:'Grad n', says:R`Der Grad des Polynoms, gezeichnet als blaue Kurve. Größeres $n$ heißt eine Nullstelle mehr; bei Hermite und Legendre wechselt dabei die Parität.`},
      {sym:'m', ctl:'Vergleich m', says:R`Der Grad der zweiten, rot gestrichelten Kurve. Er geht in das Orthogonalitätsintegral ein.`},
      {sym:R`n\ \text{Nullstellen}`, ctl:'Nullstellen', says:R`Die Anzeige zählt die Nullstellen der blauen Kurve und markiert sie als Punkte auf der Achse. Die Zahl ist immer der Grad $n$.`},
      {sym:R`\int p_n\,p_m\,w\,dx`, ctl:'erwartet 0: orthogonal', says:R`Das Integral mit Gewicht: $\int H_nH_me^{-x^2}dx$, $\int_{-1}^1P_nP_m\,dx$ bzw. $\int_0^\infty L_nL_me^{-x}dx$. Für $n \ne m$ ist es null, für $n = m$ die Normierung $\sqrt\pi\,2^nn!$, $\frac{2}{2n+1}$ bzw. $1$.`},
      {sym:R`e^{-x^2/2}`, ctl:'Hermite-Funktionen', says:R`Gezeichnet ist das Polynom mal $\sqrt w = e^{-x^2/2}$. Darum klingt die Kurve für große $|x|$ ab, obwohl $H_n$ selbst wächst.`}
    ],
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
