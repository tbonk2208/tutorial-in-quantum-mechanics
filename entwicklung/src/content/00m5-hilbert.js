/* ===== Mathe M5: Funktionenräume und Hilbertraum ===== */
(function(){
const SIN = (extra) => {
  const e = extra || {};
  const base = {coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', n:{int:[1, 6]}}, defs:{'φ_n(x)':'sqrt(2/L) sin(nπx/L)'}};
  return Object.assign(base, e, {defs:Object.assign({}, base.defs, e.defs || {}), params:Object.assign({}, base.params, e.params || {})});
};
const FG = () => ({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos'}, abstract:{f:{args:['x']}, g:{args:['x']}}});
topic({
  id:'m-hilbert', ch:'math', title:'Funktionenräume und Hilbertraum', short:'Hilbertraum',
  src:'Griffiths & Schroeter Kap. 3.1–3.3 · Boas Kap. 7 und 12',
  goals:[
    'Ich kann Skalarprodukte $\\langle f|g\\rangle = \\int f^*g\\,dx$ und Normen von Funktionen berechnen und prüfen, ob eine Funktion quadratintegrabel ist.',
    'Ich kann eine Funktion nach einem Orthonormalsystem entwickeln ($c_n = \\langle\\varphi_n|f\\rangle$) und die Vollständigkeit über $\\sum_n|c_n|^2 = \\|f\\|^2$ kontrollieren.',
    'Ich kann mit partieller Integration zeigen, ob ein Differentialoperator hermitesch ist, und beurteile dabei die Randterme.'
  ],
  needs:'Skalarprodukt und Orthonormalbasis im $\\mathbb C^n$ (M3) · partielle Integration (M2) · Integrale mit $\\sin$, $\\cos$ und Polynomen · hermitesche Matrizen (M4)',
  check:[
    {q:'Für die Orthonormalbasis $e_1 = (1, 0)^T$, $e_2 = (0, 1)^T$ und $v = (3, 4)^T$ ist $\\langle e_2|v\\rangle$ gleich …', opts:['$4$', '$3$', '$5$'], a:0, ex:'Die Komponente bezüglich einer Orthonormalbasis ist das Skalarprodukt mit dem Basisvektor: $v = 3e_1 + 4e_2$.', lex:'orthonormalbasis', prev:'m-vektor'},
    {q:'$\\int_0^L \\sin(\\pi x/L)\\,\\sin(2\\pi x/L)\\,dx$ ist …', opts:['$0$', '$L/2$', '$L/\\pi$'], a:0, ex:'Sinusfunktionen mit verschiedenen $n$ sind auf $[0, L]$ orthogonal. Mit $\\sin a\\sin b = \\frac12[\\cos(a-b) - \\cos(a+b)]$ integrieren sich beide Kosinus zu null.', lex:'orthonormal'},
    {q:'$\\int_0^1 x\\,e^x\\,dx = [x\\,e^x]_0^1 - \\int_0^1 e^x\\,dx$ ergibt …', opts:['$1$', '$e$', '$e - 1$'], a:0, ex:'$e - (e - 1) = 1$.', lex:'partielle-integration', prev:'m-analysis'},
    {q:'Ist $f(x) = 1/x$ auf $[1, \\infty)$ quadratintegrabel?', opts:['Ja, denn $\\int_1^\\infty x^{-2}\\,dx = 1$ ist endlich.', 'Nein, denn $\\int_1^\\infty x^{-1}\\,dx$ divergiert.', 'Nein, denn $f$ wird nie null.'], a:0, ex:'Es kommt auf $\\int|f|^2dx$ an, nicht auf $\\int f\\,dx$. $f$ muss auch nicht null werden, nur schnell genug abfallen.', lex:'quadratintegrabel'}
  ],
  example:{
    title:'Die Konstante nach Sinusfunktionen entwickeln',
    text:'Auf $[0, L]$ bilden $\\varphi_n(x) = \\sqrt{2/L}\\,\\sin(n\\pi x/L)$, $n = 1, 2, \\dots$ ein vollständiges Orthonormalsystem (die Eigenfunktionen des Kastens, Thema 3). Entwickle $f(x) = 1$ danach: Bestimme $c_n = \\langle\\varphi_n|f\\rangle$.',
    ctx:SIN({defs:{'f(x)':'1'}}),
    lines:[
      {l:'c_n = ⟨φ_n|f⟩', why:{q:'Warum ist der Koeffizient ein Skalarprodukt?', opts:['Aus $f = \\sum_m c_m\\varphi_m$ folgt mit $\\langle\\varphi_n|\\varphi_m\\rangle = \\delta_{nm}$ gerade $\\langle\\varphi_n|f\\rangle = c_n$.', 'Das ist eine Definition ohne Begründung.', 'Weil $f$ reell ist.'], a:0, ex:'Genau wie im $\\mathbb C^n$: Die Komponente bezüglich einer Orthonormalbasis ist die Projektion auf den Basisvektor.'}},
      {l:'= sqrt(2/L) ∫_0^L sin(nπx/L) dx', why:{q:'Wo bleibt die Konjugation von $\\varphi_n$?', opts:['$\\varphi_n$ ist reell, also $\\varphi_n^* = \\varphi_n$.', 'Man darf sie immer weglassen.', 'Sie steckt im Faktor $\\sqrt{2/L}$.'], a:0, ex:'$\\langle\\varphi_n|f\\rangle = \\int\\varphi_n^*f\\,dx$. Für reelle Basisfunktionen ändert die Konjugation nichts.'}},
      {l:'= sqrt(2/L) [-L cos(nπx/L)/(nπ)]_0^L', why:{q:'Welche Stammfunktion wurde benutzt?', opts:['$\\int\\sin(kx)\\,dx = -\\cos(kx)/k$ mit $k = n\\pi/L$', '$\\int\\sin(kx)\\,dx = k\\cos(kx)$', '$\\int\\sin(kx)\\,dx = \\cos(kx)/k$'], a:0, ex:'Ableiten zur Kontrolle: $\\frac{d}{dx}(-\\cos kx/k) = \\sin kx$.'}},
      {l:'= sqrt(2/L) L/(nπ) (1 - cos(nπ))', why:{q:'Was ist $\\cos(n\\pi)$?', opts:['$(-1)^n$', '$0$', '$1$'], a:0, ex:'$\\cos\\pi = -1$, $\\cos 2\\pi = 1$, … also $(-1)^n$.'}},
      {l:'= sqrt(2L)/(nπ) (1 - (-1)^n)', why:{q:'Was bedeutet das Ergebnis?', opts:['Nur ungerade $n$ tragen bei, mit $c_n = 2\\sqrt{2L}/(n\\pi)$.', 'Alle $c_n$ sind gleich groß.', 'Die Konstante lässt sich nicht entwickeln.'], a:0, ex:'Für gerade $n$ ist $1 - (-1)^n = 0$: Die Konstante ist symmetrisch um $L/2$, die geraden $\\varphi_n$ sind dort antisymmetrisch. Kontrolle mit der Vollständigkeit: $\\sum_{n\\,\\text{ungerade}}\\frac{8L}{n^2\\pi^2} = \\frac{8L}{\\pi^2}\\cdot\\frac{\\pi^2}{8} = L = \\|f\\|^2$.'}}
    ],
    faded:{id:'mh-fade', title:'Jetzt du: $f(x) = x$', text:'Entwickle $f(x) = x$ auf $[0, L]$ nach denselben $\\varphi_n$. Partielle Integration: $\\int_0^L x\\sin(kx)\\,dx = \\left[-\\frac{x\\cos kx}{k}\\right]_0^L + \\frac1k\\int_0^L\\cos(kx)\\,dx$ mit $k = n\\pi/L$.',
      ctx:SIN({defs:{'f(x)':'x'}}),
      given:['c_n = ⟨φ_n|f⟩', '= sqrt(2/L) ∫_0^L x sin(nπx/L) dx'],
      goals:[{id:'a', prompt:'Bestimme $c_n$.', type:'value', target:'(-1)^(n+1) sqrt(2) L^(3/2)/(nπ)', points:3,
        hints:['Das Restintegral $\\int_0^L\\cos(n\\pi x/L)\\,dx$ ist null.', 'Der Randterm bei $x = L$: $-L\\cdot L\\cos(n\\pi)/(n\\pi) = -L^2(-1)^n/(n\\pi)$.'],
        model:['c_n = ⟨φ_n|f⟩', '= sqrt(2/L) ∫_0^L x sin(nπx/L) dx', {l:'= sqrt(2/L) ([-L x cos(nπx/L)/(nπ)]_0^L + L/(nπ) ∫_0^L cos(nπx/L) dx)', gap:'= sqrt(2/L) ([▢]_0^L + L/(nπ) ∫_0^L cos(nπx/L) dx)'}, '= sqrt(2/L) (-L^2 (-1)^n/(nπ) + 0)', '= (-1)^(n+1) sqrt(2) L^(3/2)/(nπ)'],
        mistakes:[{expr:'(-1)^n sqrt(2) L^(3/2)/(nπ)', msg:'Vorzeichen: Der Randterm ist $-L^2(-1)^n/(n\\pi) = (-1)^{n+1}L^2/(n\\pi)$.'}, {expr:'(-1)^(n+1) L^2/(nπ)', msg:'Der Normierungsfaktor $\\sqrt{2/L}$ von $\\varphi_n$ fehlt.'}]}]}
  },
  puzzle:{
    title:'Sinus für eine Konstante?',
    text:'Alle Funktionen $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ sind am Rand null: $\\varphi_n(0) = \\varphi_n(L) = 0$. Die Funktion $f(x) = 1$ ist am Rand aber $1$.\n\nKann die Reihe $\\sum_n c_n\\varphi_n$ trotzdem $f = 1$ darstellen?',
    q:{q:'Deine Vermutung:', opts:['Nein, das ist unmöglich.', 'Ja, im quadratischen Mittel: $\\|f - S_N\\| \\to 0$. Nur in den Randpunkten bleibt die Summe $0$.', 'Ja, sogar Punkt für Punkt einschließlich der Ränder.'], a:1, ex:'Im Hilbertraum zählt der Abstand $\\|f - S_N\\|^2 = \\int|f - S_N|^2dx$. Einzelne Punkte haben die Breite null und tragen dazu nichts bei.'},
    reveal:'Die Sinusfunktionen sind **vollständig**: Jede quadratintegrable Funktion auf $[0, L]$ lässt sich so entwickeln, und zwar im Sinn von\n\n$$\\lim_{N\\to\\infty}\\int_0^L|f - S_N|^2\\,dx = 0,\\qquad S_N = \\sum_{n=1}^N c_n\\varphi_n.$$\n\nPunktweise kann es an einzelnen Stellen anders aussehen: In $x = 0$ und $x = L$ ist jede Teilsumme null, und kurz daneben schwingt sie bis etwa $1{,}18$, also um $0{,}18$ über – knapp 9 % der Sprunghöhe $2$ der ungerade fortgesetzten Funktion (Gibbs-Phänomen, siehe Labor). Für die Physik reicht die Konvergenz im Mittel: Wahrscheinlichkeiten sind Integrale über $|\\psi|^2$, und dafür spielen einzelne Punkte keine Rolle.'
  },
  clarify:{
    core:'Funktionen verhalten sich wie Vektoren mit unendlich vielen Komponenten. Das **Skalarprodukt** ist\n\n$$\\langle f|g\\rangle = \\int f^*(x)\\,g(x)\\,dx,\\qquad \\|f\\|^2 = \\langle f|f\\rangle = \\int|f|^2dx.$$\n\nDer **Hilbertraum** $L^2$ besteht aus allen quadratintegrablen Funktionen ($\\|f\\| < \\infty$) – genau die normierbaren Wellenfunktionen. Funktionen, die sich nur in einzelnen Punkten unterscheiden, gelten in $L^2$ als gleich. Ein **Orthonormalsystem** $\\{\\varphi_n\\}$ erfüllt $\\langle\\varphi_n|\\varphi_m\\rangle = \\delta_{nm}$; es heißt **vollständig**, wenn sich jedes $f \\in L^2$ im quadratischen Mittel entwickeln lässt:\n\n$$f = \\sum_n c_n\\varphi_n,\\qquad c_n = \\langle\\varphi_n|f\\rangle,\\qquad \\sum_n|c_n|^2 = \\|f\\|^2\\ \\text{(Parseval)}.$$\n\nOperatoren wirken auf Funktionen, etwa $\\hat x f = xf$ oder $\\hat D f = f\'$. Ein Operator ist **hermitesch**, wenn $\\langle f|\\hat A g\\rangle = \\langle\\hat A f|g\\rangle$ für alle zulässigen $f, g$. Für Differentialoperatoren prüft man das mit partieller Integration; dabei entscheiden die **Randterme** und damit die Randbedingungen.',
    keys:[
      'Das Skalarprodukt ist im ersten Argument konjugiert: $\\langle f|g\\rangle = \\langle g|f\\rangle^*$ und $\\langle cf|g\\rangle = c^*\\langle f|g\\rangle$.',
      'Entwicklungskoeffizienten sind Projektionen, $c_n = \\langle\\varphi_n|f\\rangle$ – das klappt nur, weil die Basis orthonormal ist. Bei nicht normierten Basisfunktionen muss man durch $\\|\\varphi_n\\|^2$ teilen.',
      'Parseval ist ein schneller Test: Ist $\\sum|c_n|^2$ größer als $\\|f\\|^2$, steckt ein Fehler in den Koeffizienten.',
      '$d/dx$ ist antihermitesch ($\\langle f|g\'\\rangle = -\\langle f\'|g\\rangle$), $-i\\,d/dx$ und $-d^2/dx^2$ sind hermitesch – sofern die Randterme verschwinden.',
      'Wie bei Matrizen (M4): Hermitesche Operatoren haben reelle Eigenwerte, und Eigenfunktionen zu verschiedenen Eigenwerten sind orthogonal.'
    ],
    errors:[
      'Konjugation vergessen: $\\int f\\,g\\,dx$ statt $\\int f^*g\\,dx$. Dann wird $\\langle f|f\\rangle$ womöglich null oder komplex.',
      'Den Normierungsfaktor der Basisfunktionen vergessen, etwa $\\int\\sin(n\\pi x/L)f\\,dx$ statt $\\sqrt{2/L}\\int\\sin(n\\pi x/L)f\\,dx$.',
      'Bei der partiellen Integration das Minuszeichen verlieren – dann erscheint $d/dx$ fälschlich hermitesch.',
      'Randterme stillschweigend weglassen, obwohl die Funktionen am Rand nicht verschwinden.'
    ],
    more:[{title:'Warum ist $e^{ikx}$ nicht im Hilbertraum?', text:'$|e^{ikx}|^2 = 1$, also divergiert $\\int_{-\\infty}^\\infty|e^{ikx}|^2dx$. Ebene Wellen sind trotzdem nützlich: Sie sind „uneigentliche“ Eigenfunktionen von $\\hat p$ und werden auf eine δ-Funktion normiert, $\\langle e^{ik\'x}|e^{ikx}\\rangle = 2\\pi\\,\\delta(k - k\')$. Physikalische Zustände sind Überlagerungen davon, also Wellenpakete (M6, Thema 4).'}],
    checks:[
      {q:'$f = 3\\varphi_1 + 4i\\,\\varphi_2$ mit orthonormalen $\\varphi_n$. Wie groß ist $\\|f\\|^2$?', opts:['$25$', '$-7$', '$7$'], a:0, ex:'$\\|f\\|^2 = |3|^2 + |4i|^2 = 9 + 16 = 25$. Die Mischterme fallen wegen der Orthogonalität weg.'},
      {q:'Auf $[0, L]$ gelte $f(0) = f(L) = 0$ und $g(0) = g(L) = 0$. Dann ist $\\int_0^L f^*g\'\\,dx$ gleich …', opts:['$-\\int_0^L (f^*)\'\\,g\\,dx$', '$\\int_0^L (f^*)\'\\,g\\,dx$', '$0$'], a:0, ex:'Partielle Integration: $[f^*g]_0^L - \\int (f^*)\'g\\,dx$, und der Randterm ist null.'}
    ]
  },
  lab:{type:'expand', title:'Entwicklung nach Sinusfunktionen',
    text:'Die Funktion $f$ auf $[0, L]$ wird nach $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ entwickelt. Wähle $f$ (Parabel $x(L-x)$, Zelt, Stufe oder Konstante $1$) und mit dem Regler $N$ zwischen $1$ und $30$ die Zahl der Terme der Teilsumme $S_N = \\sum_{n\\le N}c_n\\varphi_n$. Die Anzeige vergleicht $\\sum_{n\\le N}|c_n|^2$ mit $\\int_0^L|f|^2dx$ (Anteil in Prozent), die Balken zeigen die einzelnen $|c_n|^2$ relativ zum größten Beitrag und logarithmisch (blau: in der Summe enthalten).',
    questions:[
      {q:'Wähle die Parabel $x(L-x)$. Ab welchem $N$ liegt der Anteil $\\sum|c_n|^2/\\|f\\|^2$ über 99 %?', opts:['schon bei $N = 1$', 'erst ab etwa $N = 10$', 'nie, weil die Parabel kein Sinus ist'], a:0, ex:'$|c_1|^2/\\|f\\|^2 = 960/\\pi^6 \\approx 0{,}9986$: Die Parabel sieht dem Grundzustand sehr ähnlich. Die geraden $n$ tragen aus Symmetriegründen gar nicht bei.'},
      {q:'Wähle die Konstante $1$ und erhöhe $N$ bis $30$. Was siehst du nahe den Rändern?', opts:['Die Teilsumme schwingt über und bleibt in $x = 0$ und $x = L$ bei null.', 'Die Teilsumme stimmt am Rand exakt.', 'Die Teilsumme wird am Rand unendlich groß.'], a:0, ex:'Das Gibbs-Phänomen: Der Überschwinger wird schmaler, aber nicht niedriger. Der Anteil $\\sum|c_n|^2/\\|f\\|^2$ geht trotzdem gegen 100 % – die Konvergenz im Mittel klappt.'}
    ],
    noPic:{q:'Ohne Bild: Die Stufe ist $f = 1$ für $x < L/2$ und $f = 0$ sonst. Wie groß ist $\\|f\\|^2$?', opts:['$L/2$', '$L$', '$1$'], a:0, ex:'$\\int_0^{L/2}1\\,dx = L/2$. Das ist zugleich der Grenzwert von $\\sum_n|c_n|^2$.'}},
  compare:{
    text:'$f(x) = \\sqrt{2/L}\\,\\sin^3(\\pi x/L)$ auf $[0, L]$. Gesucht ist $c_1 = \\langle\\varphi_1|f\\rangle$. Nützlich: $\\int_0^L\\sin^4(\\pi x/L)\\,dx = 3L/8$ und $\\sin^3u = \\frac14(3\\sin u - \\sin 3u)$.',
    ctx:SIN({defs:{'f(x)':'sqrt(2/L) sin(πx/L)^3'}}),
    A:{name:'Integral ausrechnen', model:['⟨φ_1|f⟩ = 2/L ∫_0^L sin(πx/L)^4 dx', '= 2/L · 3L/8', '= 3/4']},
    B:{name:'Umschreiben und ablesen', model:[{l:'f(x) = sqrt(2/L) (3 sin(πx/L) - sin(3πx/L))/4', w:'sin³u = (3 sin u − sin 3u)/4'}, '= 3/4 φ_1(x) - 1/4 φ_3(x)', {l:'⟨φ_1|f⟩ = 3/4', w:'Orthonormalität'}]},
    questions:[
      {q:'Was liefert Weg B zusätzlich?', opts:['alle Koeffizienten auf einmal: $c_1 = 3/4$, $c_3 = -1/4$, alle anderen null', 'nur $c_1$, genau wie Weg A', 'die Norm von $\\varphi_1$'], a:0, ex:'Ist $f$ schon als Kombination von Basisfunktionen geschrieben, liest man die Koeffizienten direkt ab – Integrale braucht man dann nicht.'},
      {q:'Wie prüfst du, dass keine Koeffizienten fehlen?', opts:['Parseval: $|c_1|^2 + |c_3|^2 = \\frac{9}{16} + \\frac{1}{16} = \\frac58 = \\|f\\|^2$', 'Man setzt $x = 0$ ein.', 'Gar nicht, die Reihe ist unendlich.'], a:0, ex:'$\\|f\\|^2 = \\frac2L\\int_0^L\\sin^6(\\pi x/L)\\,dx = \\frac2L\\cdot\\frac{5L}{16} = \\frac58$. Stimmt die Summe, ist die Entwicklung vollständig.'}
    ]
  },
  practice:[
    {id:'mh-p1', title:'Skalarprodukt und Norm komplexer Funktionen',
      text:'Auf $[-1, 1]$ sind $f(x) = 1 + ix$ und $g(x) = x$ gegeben. In der Eingabe: `⟨f|g⟩` oder das Integral `∫_-1^1 … dx`.',
      ctx:{coords:['x'], domain:{x:['-1', '1']}, params:{}, defs:{'f(x)':'1 + i x', 'g(x)':'x'}, unknowns:{A:{ref:'sqrt(3/8)', alt:['-sqrt(3/8)']}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle f|g\\rangle$.', type:'value', target:'-2i/3', points:2, ph:'⟨f|g⟩ = ∫_-1^1 (1 - i x) x dx',
          hints:['$\\langle f|g\\rangle = \\int f^*g\\,dx$ mit $f^* = 1 - ix$.', '$\\int_{-1}^1 x\\,dx = 0$ und $\\int_{-1}^1 x^2dx = 2/3$.'],
          model:['⟨f|g⟩ = ∫_-1^1 (1 - i x) x dx', '= ∫_-1^1 (x - i x^2) dx', '= 0 - 2i/3', '= -2i/3'],
          mistakes:[{expr:'2i/3', msg:'Das erste Argument muss konjugiert werden: $f^* = 1 - ix$.'}]},
        {id:'b', prompt:'b) Berechne $\\|f\\|^2 = \\langle f|f\\rangle$.', type:'value', target:'8/3', points:2, ph:'⟨f|f⟩ = ∫_-1^1 |1 + i x|^2 dx',
          hints:['$|1 + ix|^2 = (1 - ix)(1 + ix) = 1 + x^2$.'],
          model:['⟨f|f⟩ = ∫_-1^1 |1 + i x|^2 dx', '= ∫_-1^1 (1 + x^2) dx', '= 2 + 2/3', '= 8/3'],
          mistakes:[{expr:'4/3', msg:'Das ist $\\int f^2dx$ mit $(1 + ix)^2 = 1 + 2ix - x^2$. Für die Norm braucht man $|f|^2 = f^*f = 1 + x^2$.'}]},
        {id:'c', prompt:'c) Bestimme $A > 0$ so, dass $A f$ normiert ist.', type:'solve', unknown:'A', points:2,
          model:['∫_-1^1 |A f(x)|^2 dx = 1', '|A|^2 · 8/3 = 1', 'A = sqrt(3/8)']}
      ]},
    {id:'mh-p2', title:'Entwicklung einer linearen Funktion',
      text:'$f(x) = \\sqrt{3/L^3}\\,x$ auf $[0, L]$ wird nach $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ entwickelt. Aus der Lückenaufgabe weißt du: $\\sqrt{2/L}\\int_0^L x\\sin(n\\pi x/L)\\,dx = (-1)^{n+1}\\sqrt2\\,L^{3/2}/(n\\pi)$.',
      ctx:SIN({defs:{'f(x)':'sqrt(3/L^3) x'}}),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $f$ normiert ist: Berechne $\\langle f|f\\rangle$.', type:'value', target:'1', points:1,
          model:['⟨f|f⟩ = 3/L^3 ∫_0^L x^2 dx', '= 3/L^3 · L^3/3', '= 1']},
        {id:'b', prompt:'b) Bestimme $c_n = \\langle\\varphi_n|f\\rangle$.', type:'value', target:'(-1)^(n+1) sqrt(6)/(nπ)', points:2, ph:'c_n = ⟨φ_n|f⟩',
          hints:['Ziehe $\\sqrt{3/L^3}$ vor das Skalarprodukt und benutze das Ergebnis der Lückenaufgabe.'],
          model:['c_n = ⟨φ_n|f⟩', '= sqrt(3/L^3) · (-1)^(n+1) sqrt(2) L^(3/2)/(nπ)', '= (-1)^(n+1) sqrt(6)/(nπ)']},
        {id:'c', prompt:'c) Berechne $|c_1|^2 + |c_2|^2 + |c_3|^2$.', type:'value', target:'49/(6π^2)', points:2, ph:'|⟨φ_1|f⟩|^2 + |⟨φ_2|f⟩|^2 + |⟨φ_3|f⟩|^2 = ',
          hints:['$|c_n|^2 = 6/(n^2\\pi^2)$; das Vorzeichen fällt weg.'],
          model:['|⟨φ_1|f⟩|^2 + |⟨φ_2|f⟩|^2 + |⟨φ_3|f⟩|^2 = 6/π^2 (1 + 1/4 + 1/9)', '= 49/(6π^2)'],
          note:'$49/(6\\pi^2) \\approx 0{,}83$: Drei Terme erfassen 83 % der Norm. Die Vollständigkeit verlangt $\\sum_{n=1}^\\infty 6/(n^2\\pi^2) = 1$ – daraus folgt nebenbei $\\sum_{n=1}^\\infty 1/n^2 = \\pi^2/6$.'}
      ]},
    {id:'mh-p3', title:'Welche Ableitungsoperatoren sind hermitesch?',
      text:'$f$ und $g$ sind glatte Funktionen auf $[0, L]$ mit $f(0) = f(L) = 0$ und $g(0) = g(L) = 0$ (wie Wellenfunktionen im Kasten). Auswertungsklammern schreibst du als `[f^* g]_0^L`.',
      ctx:FG(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\int_0^L f^*g\'\\,dx = -\\int_0^L (f^*)\'\\,g\\,dx$. Damit ist $d/dx$ antihermitesch.', type:'show', from:'∫_0^L f^* g\' dx', to:'-∫_0^L (f^*)\' g dx', points:2,
          hints:['Partielle Integration mit $u = f^*$ und $v\' = g\'$.', 'Der Randterm $[f^*g]_0^L$ ist null, weil beide Funktionen am Rand verschwinden.'],
          model:['∫_0^L f^* g\' dx = [f^* g]_0^L - ∫_0^L (f^*)\' g dx', {l:'= -∫_0^L (f^*)\' g dx', w:'f(0) = f(L) = 0'}]},
        {id:'b', prompt:'b) Zeige, dass $-i\\,d/dx$ hermitesch ist: $\\int_0^L f^*(-ig\')\\,dx = \\int_0^L(-if\')^*g\\,dx$.', type:'show', from:'∫_0^L f^* (-i g\') dx', to:'∫_0^L (-i f\')^* g dx', points:2,
          hints:['Ziehe $-i$ vor das Integral und benutze a).', '$(-if\')^* = i(f^*)\'$.'],
          model:['∫_0^L f^* (-i g\') dx = -i ∫_0^L f^* g\' dx', {l:'= i ∫_0^L (f^*)\' g dx', w:'Teil a)'}, '= ∫_0^L (-i f\')^* g dx'],
          note:'Das $i$ macht aus dem antihermiteschen $d/dx$ einen hermiteschen Operator. Mit $\\hbar$ davor ist das der Impuls $\\hat p = -i\\hbar\\,d/dx$ (Thema 6). Hermitesch heißt aber nicht automatisch, dass es eine Eigenbasis gibt: Mit $f(0) = f(L) = 0$ hat $-i\\,d/dx$ im Kasten gar keine Eigenfunktionen, denn $e^{ikx}$ verschwindet nirgends.'},
        {id:'c', prompt:'c) Zeige $\\int_0^L f^*g\'\'\\,dx = \\int_0^L (f^*)\'\'\\,g\\,dx$. Damit ist $d^2/dx^2$ hermitesch.', type:'show', from:'∫_0^L f^* g\'\' dx', to:'∫_0^L (f^*)\'\' g dx', points:3,
          hints:['Zweimal partiell integrieren.', 'Beim ersten Mal verschwindet $[f^*g\']_0^L$ wegen $f = 0$ am Rand, beim zweiten Mal $[(f^*)\'g]_0^L$ wegen $g = 0$ am Rand.'],
          model:['∫_0^L f^* g\'\' dx = [f^* g\']_0^L - ∫_0^L (f^*)\' g\' dx', {l:'= -∫_0^L (f^*)\' g\' dx', w:'f(0) = f(L) = 0'}, '= -[(f^*)\' g]_0^L + ∫_0^L (f^*)\'\' g dx', {l:'= ∫_0^L (f^*)\'\' g dx', w:'g(0) = g(L) = 0'}],
          note:'Also ist auch der Hamiltonoperator des Kastens, $-\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2}$, hermitesch – deshalb sind seine Eigenwerte reell und die $\\varphi_n$ orthogonal.'}
      ]},
    {id:'mh-p4', title:'Eigenfunktionen auf einem Ring',
      text:'Auf einem Ring ist $x \\in [0, 2\\pi]$ periodisch. Die Funktionen $\\varphi_q(x) = e^{iqx}/\\sqrt{2\\pi}$ mit ganzem $q$ bilden dort ein vollständiges Orthonormalsystem. In den Aufgaben sind $n \\ne j$ ganze Zahlen.',
      ctx:{coords:['x'], domain:{x:['0', '2π']}, params:{n:{int:[-3, 3]}, j:{int:[-3, 3], ne:'n'}}, defs:{'φ_q(x)':'e^(i q x)/sqrt(2π)', 'f(x)':'cos(x)^2'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle\\varphi_j|\\varphi_n\\rangle$ für $j \\ne n$.', type:'value', target:'0', points:2, ph:'⟨φ_j|φ_n⟩ = 1/(2π) ∫_0^{2π} e^(i(n - j)x) dx',
          hints:['$\\varphi_j^* = e^{-ijx}/\\sqrt{2\\pi}$.', '$e^{2\\pi i m} = 1$ für jede ganze Zahl $m$.'],
          model:['⟨φ_j|φ_n⟩ = 1/(2π) ∫_0^{2π} e^(i(n - j)x) dx', '= 1/(2π) [e^(i(n - j)x)/(i(n - j))]_0^{2π}', '= 0']},
        {id:'b', prompt:'b) Zeige, dass $\\varphi_n$ Eigenfunktion von $-i\\,d/dx$ zum Eigenwert $n$ ist.', type:'show', from:'-i d/dx φ_n(x)', to:'n φ_n(x)', points:2,
          model:['-i d/dx φ_n(x) = -i · i n e^(i n x)/sqrt(2π)', '= n φ_n(x)'],
          note:'Die Periodizität verlangt $e^{iq\\cdot 2\\pi} = 1$, also ganzes $q$: Die Randbedingung macht das Spektrum diskret. Mit $\\hbar$ ist das der Drehimpuls $L_z = -i\\hbar\\,\\partial_\\varphi$ (Thema 8).'},
        {id:'c', prompt:'c) Bestimme den Koeffizienten $c_2 = \\langle\\varphi_2|f\\rangle$ von $f(x) = \\cos^2 x$.', type:'value', target:'sqrt(π/8)', points:3, ph:'⟨φ_2|f⟩ = 1/sqrt(2π) ∫_0^{2π} e^(-2ix) cos(x)^2 dx',
          hints:['$\\cos x = \\frac12(e^{ix} + e^{-ix})$, also $\\cos^2x = \\frac12 + \\frac14e^{2ix} + \\frac14e^{-2ix}$.', 'Nur der Term $\\frac14e^{2ix}$ überlebt das Integral, und zwar mit $2\\pi\\cdot\\frac14$.'],
          model:['⟨φ_2|f⟩ = 1/sqrt(2π) ∫_0^{2π} e^(-2ix) cos(x)^2 dx', {l:'= 1/sqrt(2π) ∫_0^{2π} e^(-2ix) (1/2 + e^(2ix)/4 + e^(-2ix)/4) dx', w:'Euler-Formel'}, '= 1/sqrt(2π) · 2π/4', '= sqrt(π/8)'],
          mistakes:[{expr:'1/4', msg:'Das ist der Koeffizient vor $e^{2ix}$. Bezüglich der normierten $\\varphi_2 = e^{2ix}/\\sqrt{2\\pi}$ kommt noch der Faktor $\\sqrt{2\\pi}$ hinzu.'}],
          note:'Das ist schon eine komplexe Fourier-Reihe (M6).'}
      ]}
  ],
  final:[
    {q:'Welche Funktion ist auf der ganzen reellen Achse quadratintegrabel?', opts:['$x\\,e^{-x^2}$', '$e^{ikx}$', '$1/\\sqrt{1 + |x|}$'], a:0, ex:'$\\int x^2e^{-2x^2}dx$ ist endlich. Bei $e^{ikx}$ ist $|f|^2 = 1$, bei $1/\\sqrt{1+|x|}$ ist $|f|^2 = 1/(1+|x|)$ – beide Integrale divergieren.'},
    {task:{id:'mh-f1', title:'Norm einer Überlagerung', text:'$f(x) = \\sqrt{2/L}\\left(\\sin(\\pi x/L) + 2\\sin(3\\pi x/L)\\right)$ auf $[0, L]$.',
      ctx:SIN({defs:{'f(x)':'sqrt(2/L) (sin(πx/L) + 2 sin(3πx/L))'}}),
      goals:[{id:'a', prompt:'Berechne $\\|f\\|^2 = \\langle f|f\\rangle$.', type:'value', target:'5', points:2, model:[{l:'⟨f|f⟩ = |1|^2 + |2|^2', w:'f = φ₁ + 2φ₃, Mischterme fallen weg'}, '= 5']}]}},
    {q:'Auf $[0, L]$ mit $f(0) = f(L) = 0$: Warum ist $-i\\,d/dx$ hermitesch, $d/dx$ aber nicht?', opts:['Partielle Integration liefert ein Minuszeichen; das $-i$ gleicht es aus, weil $(-i)^* = i$.', 'Weil $d/dx$ reelle Funktionen auf reelle abbildet.', 'Weil $-i\\,d/dx$ keine Randterme hat.'], a:0, ex:'$\\langle f|g\'\\rangle = -\\langle f\'|g\\rangle$, aber $\\langle f|-ig\'\\rangle = i\\langle f\'|g\\rangle = \\langle -if\'|g\\rangle$.'},
    {task:{id:'mh-f2', title:'Ein Matrixelement', text:'Mit $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ auf $[0, L]$. Nützlich: $\\int_0^L x\\sin(\\pi x/L)\\sin(2\\pi x/L)\\,dx = -\\frac{8L^2}{9\\pi^2}$.',
      ctx:SIN({}),
      goals:[{id:'a', prompt:'Berechne $\\langle\\varphi_1|\\hat x|\\varphi_2\\rangle$.', type:'value', target:'-16L/(9π^2)', points:2, model:['⟨φ_1|x̂|φ_2⟩ = 2/L ∫_0^L x sin(πx/L) sin(2πx/L) dx', '= 2/L · (-8L^2/(9π^2))', '= -16L/(9π^2)']}]}}
  ],
  errors:[
    {id:'mh-e1', title:'Norm ohne Betragsquadrat',
      text:'Ist $f(x) = e^{i\\pi x/L}/\\sqrt L$ auf $[0, L]$ normiert? So wurde gerechnet:',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos'}, defs:{'f(x)':'e^(iπx/L)/sqrt(L)'}},
      lines:['⟨f|f⟩ = 1/L ∫_0^L e^(2iπx/L) dx', '= 1/L [L e^(2iπx/L)/(2iπ)]_0^L', '= 0'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['Es wurde $f^2$ statt $|f|^2 = f^*f$ integriert.', 'Die Grenzen müssen $-L$ bis $L$ sein.', 'Der Faktor $1/L$ gehört nicht davor.'], a:0, ex:'$|e^{i\\pi x/L}|^2 = 1$. Eine Norm kann nie null sein, außer für $f = 0$ – das Ergebnis hätte stutzig machen müssen.'},
      fix:{id:'a', prompt:'Berichtige: Berechne $\\langle f|f\\rangle$.', type:'value', target:'1', model:['⟨f|f⟩ = 1/L ∫_0^L |e^(iπx/L)|^2 dx', '= 1/L ∫_0^L 1 dx', '= 1']}},
    {id:'mh-e2', title:'Koeffizient ohne Normierungsfaktor',
      text:'$f(x) = \\sin(\\pi x/L)$ auf $[0, L]$ soll nach $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ entwickelt werden. Für $c_1$ wurde gerechnet:',
      ctx:SIN({defs:{'f(x)':'sin(πx/L)'}}),
      lines:['⟨φ_1|f⟩ = ∫_0^L sin(πx/L)^2 dx', '= L/2'],
      wrong:0,
      why:{q:'Was ist falsch?', opts:['Der Faktor $\\sqrt{2/L}$ aus $\\varphi_1$ fehlt.', 'Es müsste $\\cos$ statt $\\sin$ stehen.', 'Das Integral ist $L$, nicht $L/2$.'], a:0, ex:'$c_1 = \\langle\\varphi_1|f\\rangle = \\sqrt{2/L}\\cdot L/2 = \\sqrt{L/2}$. Kontrolle mit Parseval: $|c_1|^2 = L/2 = \\|f\\|^2$ ✓, während $(L/2)^2$ nicht passt.'},
      fix:{id:'a', prompt:'Berichtige: Bestimme $c_1$.', type:'value', target:'sqrt(L/2)', model:['⟨φ_1|f⟩ = sqrt(2/L) ∫_0^L sin(πx/L)^2 dx', '= sqrt(2/L) · L/2', '= sqrt(L/2)']}}
  ]
});
lexe('hilbertraum', 'Hilbertraum', 'Vektorraum mit Skalarprodukt, in dem jede Cauchy-Folge konvergiert (vollständig). Nicht verwechseln: Ein *vollständiges Orthonormalsystem* ist eines, nach dem sich jedes Element entwickeln lässt. In der QM: $L^2$, der Raum der quadratintegrablen Funktionen mit $\\langle f|g\\rangle = \\int f^*g\\,dx$ (Funktionen, die sich nur in einzelnen Punkten unterscheiden, gelten dabei als gleich), oder der $\\mathbb C^n$ für Spin und andere endliche Systeme. Zustände sind normierte Vektoren, Messgrößen hermitesche Operatoren.', {topic:'m-hilbert'});
lexe('quadratintegrabel', 'Quadratintegrabel ($L^2$)', '$f$ heißt quadratintegrabel, wenn $\\|f\\|^2 = \\int|f|^2dx < \\infty$. Genau diese Funktionen lassen sich normieren. Beispiele auf $\\mathbb R$: $e^{-x^2}$, $1/(1+x^2)$ ja; $e^{ikx}$, $1$, $1/\\sqrt{1+|x|}$ nein. Entscheidend ist das Integral über $|f|^2$, nicht über $f$.', {topic:'m-hilbert'});
lexe('vollstaendigkeit', 'Vollständigkeit und Parseval-Gleichung', 'Ein Orthonormalsystem $\\{\\varphi_n\\}$ ist vollständig, wenn sich jedes $f$ als $f = \\sum_n c_n\\varphi_n$ mit $c_n = \\langle\\varphi_n|f\\rangle$ schreiben lässt (Konvergenz im Mittel). Gleichwertig: $\\sum_n|c_n|^2 = \\|f\\|^2$ für alle $f$ (Parseval) oder $\\sum_n\\varphi_n(x)\\varphi_n^*(x\') = \\delta(x - x\')$. In Dirac-Notation: $\\sum_n|n\\rangle\\langle n| = \\mathbb 1$.', {topic:'m-hilbert'});
lexe('randterme-hermitesch', 'Hermitesche Differentialoperatoren und Randterme', 'Ob ein Differentialoperator hermitesch ist, entscheidet die partielle Integration samt Randtermen: $\\langle f|g\'\\rangle = [f^*g] - \\langle f\'|g\\rangle$. Verschwinden die Randterme (Funktionen null am Rand, im Unendlichen abfallend oder periodisch), dann ist $d/dx$ antihermitesch, $-i\\,d/dx$ und $-d^2/dx^2$ sind hermitesch. Die Randbedingungen gehören also zur Definition des Operators.', {topic:'m-hilbert'});
})();
