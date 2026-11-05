/* ===== Mathe M7: Differentialgleichungen und Randwertprobleme ===== */
(function(){
const DGL = extra => Object.assign({coords:['x'], funcs:['y']}, extra || {});
topic({
  id:'m-dgl', ch:'math', title:'Differentialgleichungen und Randwertprobleme', short:'DGL',
  src:'Boas Kap. 8 und 13 · Griffiths & Schroeter Kap. 2.1–2.2',
  goals:[
    'Ich kann lineare DGL mit konstanten Koeffizienten über den Exponentialansatz $y = e^{\\lambda x}$ und die charakteristische Gleichung lösen.',
    'Ich kann Anfangs-, Rand- und Anschlussbedingungen einsetzen und erkläre, warum Randbedingungen nur einzelne Werte wie $k = n\\pi/L$ zulassen.',
    'Ich kann eine partielle DGL mit dem Separationsansatz $\\Psi(x,t) = \\varphi(x)f(t)$ in gewöhnliche DGL zerlegen.'
  ],
  needs:'Ableitungen von $e^{\\lambda x}$, $\\sin$, $\\cos$ (Kettenregel) · komplexe Zahlen und Euler-Formel (M1) · quadratische Gleichungen',
  check:[
    {q:'$\\frac{d^2}{dx^2}e^{\\lambda x}$ ist …', opts:['$\\lambda^2e^{\\lambda x}$', '$2\\lambda e^{\\lambda x}$', '$\\lambda e^{2\\lambda x}$'], a:0, ex:'Jede Ableitung liefert einen Faktor $\\lambda$: $\\frac{d^n}{dx^n}e^{\\lambda x} = \\lambda^ne^{\\lambda x}$. Darauf beruht der Exponentialansatz.', lex:'charakteristische-gleichung'},
    {q:'Die Lösungen von $\\lambda^2 + 4 = 0$ sind …', opts:['$\\lambda = \\pm 2i$', '$\\lambda = \\pm 2$', '$\\lambda = -4$'], a:0, ex:'$\\lambda^2 = -4$, also $\\lambda = \\pm\\sqrt{-4} = \\pm 2i$.', lex:'komplexe-zahlen', prev:'m-komplex'},
    {q:'$e^{ikx} + e^{-ikx}$ ist gleich …', opts:['$2\\cos kx$', '$2i\\sin kx$', '$2\\cosh kx$'], a:0, ex:'Mit der Euler-Formel heben sich die Sinusanteile weg: $(\\cos kx + i\\sin kx) + (\\cos kx - i\\sin kx) = 2\\cos kx$.', lex:'euler', prev:'m-komplex'},
    {q:'Für welche reellen $u$ ist $\\sin u = 0$?', opts:['$u = n\\pi$ mit ganzem $n$', '$u = \\pi/2 + n\\pi$', 'nur für $u = 0$'], a:0, ex:'Der Sinus hat seine Nullstellen bei allen ganzzahligen Vielfachen von $\\pi$. Die Nullstellen des Kosinus liegen bei $\\pi/2 + n\\pi$.', lex:'randwertproblem'}
  ],
  example:{
    title:'Anfangswertproblem mit dem Exponentialansatz',
    text:'Löse $y\'\' + 4y = 0$ mit $y(0) = 1$ und $y\'(0) = 6$.\n\nSchreibweise in der Lernhilfe: Funktionen immer mit Argument, also `y(x)`, `y\'(0)`, `y\'\'(x)`. Eine Zeile `y(x) = …` führt die Funktion ein.',
    ctx:DGL({unknowns:{λ:{ref:'2i', alt:['-2i'], kind:'complex'}, A:{ref:'1', kind:'real'}, B:{ref:'3', kind:'real'}}}),
    lines:[
      {l:'d^2/dx^2 e^(λx) + 4 e^(λx) = (λ^2 + 4) e^(λx)', why:{q:'Warum setzt man $y = e^{\\lambda x}$ an?', opts:['Ableiten reproduziert $e^{\\lambda x}$; die DGL wird zu einer algebraischen Gleichung für $\\lambda$.', 'Weil jede Lösung eine reelle Exponentialfunktion ist.', 'Weil $e^{\\lambda x}$ bei $x = 0$ den Wert 1 hat.'], a:0, ex:'Bei konstanten Koeffizienten bleibt nach dem Einsetzen nur ein Polynom in $\\lambda$ mal $e^{\\lambda x}$ übrig.'}},
      {l:'λ^2 + 4 = 0', why:{q:'Warum darf man durch $e^{\\lambda x}$ teilen?', opts:['$e^{\\lambda x}$ ist nie null.', 'Weil $\\lambda = 0$ ist.', 'Das ist nur eine Näherung.'], a:0, ex:'Übrig bleibt die **charakteristische Gleichung** $\\lambda^2 + 4 = 0$.'}},
      {l:'λ = ±2i', why:{q:'Was bedeuten imaginäre Wurzeln für die Lösung?', opts:['Sie schwingt: $e^{\\pm 2ix} = \\cos 2x \\pm i\\sin 2x$.', 'Es gibt keine reelle Lösung.', 'Sie wächst exponentiell.'], a:0, ex:'Euler-Formel (M1). Reelle Kombinationen von $e^{2ix}$ und $e^{-2ix}$ sind $\\cos 2x$ und $\\sin 2x$.'}},
      {l:'y(x) = A cos(2x) + B sin(2x)', why:{q:'Warum stehen hier zwei Konstanten?', opts:['Eine DGL 2. Ordnung hat zwei unabhängige Lösungen; jede Linearkombination ist wieder Lösung.', 'Man nimmt eine Wurzel und wirft die andere weg.', 'Aus Gewohnheit, eine würde reichen.'], a:0, ex:'Superposition: Die Gleichung ist linear und homogen. Die allgemeine Lösung hat so viele Konstanten wie die Ordnung.'}},
      {l:'y(0) = A = 1', why:{q:'Welche Konstante legt $y(0)$ fest?', opts:['$A$, denn $\\cos 0 = 1$ und $\\sin 0 = 0$.', '$B$', 'beide zusammen'], a:0, ex:'Bei $x = 0$ verschwindet der Sinus-Anteil.'}},
      {l:"y'(0) = 2B = 6", why:{q:'Woher kommt der Faktor 2?', opts:['Kettenregel: $\\frac{d}{dx}\\sin 2x = 2\\cos 2x$.', 'Von $\\lambda^2 = -4$.', 'Von $y(0) = 1$.'], a:0, ex:'$y\'(x) = -2A\\sin 2x + 2B\\cos 2x$, bei $x = 0$ bleibt $2B$. Also $B = 3$.'}},
      {l:'y(x) = cos(2x) + 3 sin(2x)', why:{q:'Wie prüfst du das Ergebnis am schnellsten?', opts:['Einsetzen: $y\'\' = -4y$, und beide Anfangswerte stimmen.', 'Ein Bild reicht.', 'Gar nicht, der Weg war richtig.'], a:0, ex:'$y\'\' = -4\\cos 2x - 12\\sin 2x = -4y$, $y(0) = 1$, $y\'(0) = 6$. Ein Anfangswertproblem hat genau eine Lösung – also ist es diese.'}}
    ],
    faded:{id:'md-fade', title:'Jetzt du: $y\'\' = \\kappa^2y$ mit beschränkter Lösung',
      text:'Für $x > 0$ gilt $y\'\' = \\kappa^2y$ mit $\\kappa > 0$. Die Lösung soll für $x\\to\\infty$ beschränkt bleiben, und es ist $y(0) = y_0$. Die charakteristische Gleichung ist schon gelöst.',
      ctx:DGL({domain:{x:['0', '∞']}, params:{κ:'pos', y_0:'pos'}, unknowns:{λ:{ref:'κ', alt:['-κ'], kind:'real'}, C:{ref:'0', kind:'real'}, D:{ref:'y_0', kind:'real'}}}),
      given:['λ^2 - κ^2 = 0', 'λ = ±κ'],
      goals:[{id:'a', prompt:'Bestimme $y(x)$.', type:'value', target:'y_0 e^(-κx)', points:2,
        hints:['Allgemein ist $y(x) = Ce^{\\kappa x} + De^{-\\kappa x}$.', '$e^{\\kappa x}$ wächst für $x\\to\\infty$ über alle Grenzen, also muss $C = 0$ sein.'],
        model:['λ^2 - κ^2 = 0', 'λ = ±κ', {l:'y(x) = C e^(κx) + D e^(-κx)', gap:'y(x) = C e^(κx) + ▢'}, {l:'C = 0', w:'beschränkt für x → ∞'}, 'y(0) = D = y_0', 'y(x) = y_0 e^(-κx)'],
        mistakes:[{expr:'y_0 e^(κx)', msg:'Diese Lösung wächst für $x\\to\\infty$ über alle Grenzen. Beschränkt bleibt nur der Anteil $e^{-\\kappa x}$.'}]}]}
  },
  puzzle:{
    title:'Gibt es immer eine Lösung?',
    text:'Die Gleichung $y\'\' = -k^2y$ mit $y(0) = 0$ und $y\'(0) = 1$ hat für jedes $k > 0$ genau eine Lösung: $y = \\sin(kx)/k$.\n\nJetzt ändern wir die zweite Bedingung: Statt $y\'(0) = 1$ verlangen wir $y(1) = 0$. Für wie viele Werte $k > 0$ gibt es dann eine Lösung, die nicht überall null ist?',
    q:{q:'Deine Vermutung:', opts:['für jedes $k$', 'für genau ein $k$', 'für unendlich viele, aber nur einzelne Werte $k$', 'für kein $k$'], a:2, ex:'$y = A\\sin kx$ erfüllt $y(1) = 0$ nur, wenn $\\sin k = 0$ ist.'},
    reveal:'Mit $y(0) = 0$ bleibt $y = A\\sin(kx)$. Die Bedingung $y(1) = 0$ verlangt $A\\sin k = 0$. Mit $A = 0$ wäre $y \\equiv 0$ – die triviale Lösung. Also $\\sin k = 0$, d. h. $k = n\\pi$ mit $n = 1, 2, 3, \\dots$\n\nDas ist der Unterschied zwischen **Anfangswertproblem** (beide Bedingungen an einer Stelle: immer genau eine Lösung) und **Randwertproblem** mit homogenen Bedingungen wie $y(0) = y(1) = 0$ (Bedingungen an zwei Stellen: nichttriviale Lösungen nur für bestimmte Parameter). Genau so entstehen im Kasten die Energien $E_n = \\frac{\\hbar^2}{2m}\\left(\\frac{n\\pi}{L}\\right)^2$ (Thema 3). Im Labor kannst du $k$ so lange verändern, bis $y(1) = 0$ ist.'
  },
  clarify:{
    core:'Eine lineare homogene DGL 2. Ordnung mit konstanten Koeffizienten,\n\n$$y\'\' + a\\,y\' + b\\,y = 0,$$\n\nlöst man mit dem Exponentialansatz $y = e^{\\lambda x}$. Er führt auf die **charakteristische Gleichung** $\\lambda^2 + a\\lambda + b = 0$:\n\n- zwei verschiedene reelle Wurzeln: $y = C_1e^{\\lambda_1x} + C_2e^{\\lambda_2x}$,\n- komplexe Wurzeln $\\lambda = \\alpha\\pm i\\beta$: $y = e^{\\alpha x}(A\\cos\\beta x + B\\sin\\beta x)$,\n- doppelte Wurzel $\\lambda_0$: $y = (C_1 + C_2x)e^{\\lambda_0x}$.\n\nDie zwei Konstanten werden durch zwei Bedingungen festgelegt. Stehen beide an derselben Stelle ($y(0)$ und $y\'(0)$: **Anfangswertproblem**), gibt es immer genau eine Lösung. Stehen sie an zwei Stellen und sind homogen ($y(0) = y(L) = 0$: **homogenes Randwertproblem**), hat $y\'\' = -k^2y$ nichttriviale Lösungen nur für $k = n\\pi/L$. Die Randbedingungen machen aus der DGL ein **Eigenwertproblem** – das ist der Mechanismus hinter der Energiequantisierung.\n\nEine partielle DGL wie $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi$ zerlegt der **Separationsansatz** $\\Psi = \\varphi(x)f(t)$ in zwei gewöhnliche DGL mit derselben Konstanten $E$: $i\\hbar f\' = Ef$ und $-\\frac{\\hbar^2}{2m}\\varphi\'\' = E\\varphi$.',
    keys:[
      'Zur Ordnung gehört die Zahl der freien Konstanten: zwei bei $y\'\'$, eine bei $f\' = -i\\omega f$.',
      '$y\'\' = -k^2y$ schwingt: $y = A\\sin kx + B\\cos kx = Ce^{ikx} + De^{-ikx}$. $y\'\' = +\\kappa^2y$ wächst oder fällt: $y = Ce^{\\kappa x} + De^{-\\kappa x} = A\\sinh\\kappa x + B\\cosh\\kappa x$.',
      'Superposition gilt nur, weil die Gleichung linear und homogen ist: Mit $y_1$ und $y_2$ ist jede Kombination $C_1y_1 + C_2y_2$ wieder Lösung.',
      'Normierbarkeit ist eine Randbedingung im Unendlichen: Für $x\\to\\infty$ muss der Anteil $e^{+\\kappa x}$ wegfallen.',
      'An einer Sprungstelle eines endlichen Potentials müssen $\\psi$ und $\\psi\'$ stetig sein (Thema 5). Diese Anschlussbedingungen verbinden die Lösungen der einzelnen Bereiche.'
    ],
    errors:[
      'Aus $A\\sin(kL) = 0$ auf $A = 0$ schließen. Das ist die triviale Lösung $y\\equiv 0$; gesucht sind die $k$ mit $\\sin(kL) = 0$.',
      'Vorzeichen in der charakteristischen Gleichung: $y\'\' = \\kappa^2y$ gibt $\\lambda^2 - \\kappa^2 = 0$, nicht $\\lambda^2 + \\kappa^2 = 0$.',
      'Bei komplexen Wurzeln $\\alpha\\pm i\\beta$ den Faktor $e^{\\alpha x}$ vergessen.',
      'Beim Ableiten die Kettenregel vergessen: $\\frac{d}{dx}\\sin kx = k\\cos kx$.'
    ],
    more:[
      {title:'Woher kommt $xe^{\\lambda_0x}$ bei der doppelten Wurzel?', text:'Für $y = xe^{\\lambda_0x}$ ist $y\'\' + ay\' + by = (\\lambda_0^2 + a\\lambda_0 + b)\\,xe^{\\lambda_0x} + (2\\lambda_0 + a)\\,e^{\\lambda_0x}$. Die erste Klammer ist null, weil $\\lambda_0$ Wurzel ist; die zweite, weil die doppelte Wurzel $\\lambda_0 = -a/2$ ist.'},
      {title:'Warum heißt es Eigenwertproblem?', text:'$-\\frac{d^2}{dx^2}y = k^2y$ hat die Form $\\hat Dy = \\mu y$ mit dem Operator $\\hat D = -d^2/dx^2$ (M4, M5). Die Randbedingungen legen den Funktionenraum fest, in dem $\\hat D$ wirkt. Erst in diesem Raum gibt es die diskreten Eigenwerte $\\mu_n = (n\\pi/L)^2$.'}
    ],
    checks:[
      {q:'Welche allgemeine Lösung hat $y\'\' - 9y = 0$?', opts:['$Ce^{3x} + De^{-3x}$', '$A\\sin 3x + B\\cos 3x$', '$Ce^{9x} + De^{-9x}$'], a:0, ex:'$\\lambda^2 - 9 = 0$ gibt $\\lambda = \\pm 3$: reelle Exponentialfunktionen, keine Schwingung.'},
      {q:'Welche Aussage über $y\'\' = -k^2y$, $y(0) = 0$, $y\'(0) = 1$ stimmt?', opts:['Für jedes $k > 0$ gibt es genau eine Lösung.', 'Nur für $k = n\\pi$ gibt es eine Lösung.', 'Es gibt unendlich viele Lösungen.'], a:0, ex:'Das ist ein Anfangswertproblem; die Lösung ist $y = \\sin(kx)/k$. Erst Randbedingungen an zwei Stellen wählen einzelne $k$ aus.'}
    ]
  },
  lab:{type:'ode', title:'Anfangswertproblem und Randbedingung',
    text:'Das Labor löst $y\'\' = -k^2y$ oder $y\'\' = +k^2y$ mit den Anfangswerten $y(0) = 0$, $y\'(0) = 1$ auf $[0, 1]$. Für jedes $k$ gibt es genau eine Lösung. Die Anzeige zeigt $y(1)$ und meldet, wenn zusätzlich die Randbedingung $y(1) = 0$ erfüllt ist.',
    questions:[
      {q:'Gleichung $y\'\' = -k^2y$: Bei welchem kleinsten $k > 0$ wird $y(1) = 0$?', opts:['$k \\approx 3{,}14$', '$k \\approx 1{,}57$', '$k \\approx 6{,}28$'], a:0, ex:'$y = \\sin(kx)/k$, also $y(1) = \\sin(k)/k = 0$ für $k = \\pi$. Die nächsten Werte sind $2\\pi \\approx 6{,}28$ und $3\\pi \\approx 9{,}42$.'},
      {q:'Stelle $y\'\' = +k^2y$ ein. Für welche $k > 0$ wird $y(1) = 0$?', opts:['für kein $k$', 'für $k = \\pi$', 'für jedes $k$'], a:0, ex:'Die Lösung ist $y = \\sinh(kx)/k$. Sie ist für $x > 0$ positiv und hat keine Nullstelle – ohne Schwingung hat das Randwertproblem $y(0) = y(1) = 0$ nur die triviale Lösung $y = 0$.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele Werte $k$ zwischen $0$ und $12$ erfüllen bei $y\'\' = -k^2y$, $y(0) = 0$ auch $y(1) = 0$?', opts:['3', '4', '12'], a:0, ex:'$k = \\pi, 2\\pi, 3\\pi$ (etwa 3,14, 6,28 und 9,42). $4\\pi \\approx 12{,}57$ liegt schon außerhalb.'}},
  compare:{
    text:'Randwertproblem: $y\'\' = -k^2y$ auf $[0, L]$ mit $y(0) = y(L) = 0$. Gesucht sind die erlaubten $k > 0$. Zwei richtige Wege:',
    ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos', n:{int:[1, 4]}}, unknowns:{A:{ref:'1', kind:'real'}, B:{ref:'0', kind:'real'}, C:{ref:'1/(2i)', kind:'complex'}, D:{ref:'-1/(2i)', kind:'complex'}, k:{ref:'nπ/L'}}}),
    A:{name:'Reelle Form', model:['y(x) = A sin(kx) + B cos(kx)', 'y(0) = B = 0', 'y(L) = A sin(kL) = 0', {l:'k = nπ/L', w:'A ≠ 0, also sin(kL) = 0'}]},
    B:{name:'Komplexe Form', text:'Ansatz mit $e^{\\pm ikx}$:', model:['y(x) = C e^(ikx) + D e^(-ikx)', 'y(0) = C + D = 0', 'D = -C', 'y(L) = C (e^(ikL) - e^(-ikL))', '= 2i C sin(kL) = 0', 'k = nπ/L']},
    questions:[
      {q:'Welche Funktion entsteht in Weg B mit $D = -C$?', opts:['$y = 2iC\\sin kx$ – dieselbe wie in Weg A mit $A = 2iC$', 'eine andere Funktion als in Weg A', '$y = 2C\\cos kx$'], a:0, ex:'$C(e^{ikx} - e^{-ikx}) = 2iC\\sin kx$. Beide Wege beschreiben dieselben Lösungen, nur mit anders benannten Konstanten.'},
      {q:'Wann ist die komplexe Form $e^{\\pm ikx}$ bequemer?', opts:['bei nach rechts und links laufenden Wellen (Thema 4, Thema 5)', 'bei stehenden Wellen im Kasten', 'nie'], a:0, ex:'$e^{ikx}$ hat den Impuls $+\\hbar k$, $e^{-ikx}$ den Impuls $-\\hbar k$. Für stehende Wellen mit Knoten an den Wänden ist $\\sin$/$\\cos$ bequemer.'}
    ]
  },
  practice:[
    {id:'md-p1', title:'Komplexe Wurzeln: gedämpfte Schwingung',
      text:'Löse $y\'\' + 2y\' + 5y = 0$ mit $y(0) = 1$ und $y\'(0) = 1$.',
      ctx:DGL({unknowns:{λ:{ref:'-1 + 2i', alt:['-1 - 2i'], kind:'complex'}, A:{ref:'1', kind:'real'}, B:{ref:'1', kind:'real'}, C:{ref:'(1 - i)/2', kind:'complex'}, D:{ref:'(1 + i)/2', kind:'complex'}}}),
      goals:[
        {id:'a', prompt:'a) Stelle die charakteristische Gleichung auf und bestimme beide Wurzeln $\\lambda$.', type:'solve', unknown:'λ', both:true, points:2, ph:'λ^2 + 2λ + 5 = 0',
          hints:['Exponentialansatz: $y\'\'\\to\\lambda^2$, $y\'\\to\\lambda$, $y\\to 1$.', 'Lösungsformel (Mitternachtsformel): $\\lambda = \\frac{-2\\pm\\sqrt{4 - 20}}{2}$ mit $\\sqrt{-16} = 4i$. Schreib am Ende $\\lambda = \\dots \\pm \\dots$'],
          model:['λ^2 + 2λ + 5 = 0', 'λ = (-2 ± sqrt(4 - 20))/2', 'λ = -1 ± 2i']},
        {id:'b', prompt:'b) Bestimme die reelle Lösung $y(x)$ des Anfangswertproblems.', type:'value', target:'e^(-x) (cos(2x) + sin(2x))', points:3, ph:'y(x) = e^(-x) (A cos(2x) + B sin(2x))',
          hints:['Mit $\\lambda = \\alpha\\pm i\\beta$ ist $y = e^{\\alpha x}(A\\cos\\beta x + B\\sin\\beta x)$.', '$y\'(x) = e^{-x}[(-A + 2B)\\cos 2x - (2A + B)\\sin 2x]$, also $y\'(0) = -A + 2B$.'],
          model:['y(x) = e^(-x) (A cos(2x) + B sin(2x))', 'y(0) = A = 1', "y'(0) = -A + 2B = 1", 'B = 1', 'y(x) = e^(-x) (cos(2x) + sin(2x))'],
          mistakes:[{expr:'e^(-x) (cos(2x) + 1/2 sin(2x))', msg:'Beim Ableiten liefert auch $e^{-x}$ einen Beitrag: $y\'(0) = -A + 2B$, nicht nur $2B$.'}, {expr:'e^(-x) cos(2x)', msg:'Vorzeichen prüfen: $\\frac{d}{dx}e^{-x} = -e^{-x}$, also $y\'(0) = -A + 2B$.'}],
          note:'Auch der komplexe Weg geht: $y = Ce^{(-1+2i)x} + De^{(-1-2i)x}$ mit $C = (1-i)/2$, $D = (1+i)/2 = C^*$. Weil $D = C^*$ ist, kommt eine reelle Funktion heraus.'}
      ]},
    {id:'md-p2', title:'Anschlussbedingungen an einer Stufe',
      text:'Links ($x < 0$) gilt $y\'\' = -k^2y$, rechts ($x > 0$) gilt $y\'\' = \\kappa^2y$, mit $k, \\kappa > 0$. Rechts soll $y$ beschränkt bleiben. Ansatz: $y_1(x) = \\cos(kx) + B\\sin(kx)$ links, $y_2(x) = C\\,e^{-\\kappa x}$ rechts. Bei $x = 0$ müssen $y$ und $y\'$ stetig sein.',
      ctx:DGL({params:{k:'pos', κ:'pos'}, unknowns:{B:{ref:'-κ/k', kind:'real'}, C:{ref:'1'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $C$ aus der Stetigkeit von $y$.', type:'solve', unknown:'C', points:1, ph:'y_1(0) = y_2(0)',
          hints:['Führe zuerst $y_1(x) = \\dots$ und $y_2(x) = \\dots$ ein.', '$y_1(0) = 1$ und $y_2(0) = C$.'],
          model:['y_1(x) = cos(kx) + B sin(kx)', 'y_2(x) = C e^(-κx)', {l:'y_1(0) = y_2(0)', w:'y stetig bei x = 0'}, '1 = C']},
        {id:'b', prompt:'b) Bestimme $B$ aus der Stetigkeit von $y\'$.', type:'solve', unknown:'B', points:2, ph:"y_1'(0) = y_2'(0)",
          hints:['$y_1\'(0) = kB$ und $y_2\'(0) = -\\kappa C$.', 'Setze $C = 1$ aus Teil a) ein.'],
          model:['y_1(x) = cos(kx) + B sin(kx)', 'y_2(x) = C e^(-κx)', {l:"y_1'(0) = y_2'(0)", w:"y' stetig bei x = 0"}, 'k B = -κ C', 'B = -κ/k'],
          mistakes:[{expr:'κ/k', msg:'Vorzeichen: $\\frac{d}{dx}e^{-\\kappa x} = -\\kappa e^{-\\kappa x}$, also $y_2\'(0) = -\\kappa C$.'}],
          note:'So entsteht in Thema 5 die Eindringtiefe: Rechts fällt $y$ wie $e^{-\\kappa x}$ ab, die Länge $1/\\kappa$ ist umso kleiner, je größer $\\kappa$.'}
      ]},
    {id:'md-p3', title:'Gemischte Randbedingungen',
      text:'$y\'\' = -k^2y$ auf $[0, L]$ mit $y(0) = 0$ und $y\'(L) = 0$ (waagrechte Tangente am rechten Rand). Gesucht sind die erlaubten $k > 0$; $n = 1, 2, 3, \\dots$ nummeriert sie.',
      ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', n:{int:[1, 4]}}, unknowns:{A:{ref:'1', kind:'real'}, B:{ref:'0', kind:'real'}, k:{ref:'(2n - 1)π/(2L)'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme alle erlaubten $k$ (als Ausdruck in $n$).', type:'solve', unknown:'k', points:3, ph:'y(x) = A sin(kx) + B cos(kx)',
          hints:['Aus $y(0) = 0$ folgt $B = 0$.', '$y\'(L) = Ak\\cos(kL) = 0$ mit $A \\ne 0$: $\\cos(kL) = 0$, also $kL = \\pi/2, 3\\pi/2, 5\\pi/2, \\dots$'],
          model:['y(x) = A sin(kx) + B cos(kx)', 'y(0) = B = 0', "y'(L) = A k cos(kL) = 0", 'k L = (n - 1/2) π', 'k = (2n - 1)π/(2L)'],
          mistakes:[{expr:'nπ/L', msg:'Das wäre die Bedingung $y(L) = 0$. Hier verschwindet die Ableitung: $\\cos(kL) = 0$.'}, {expr:'(2n + 1)π/(2L)', msg:'So zählt man ab $n = 0$. Hier beginnt $n$ bei 1: Das kleinste $k$ ist $\\pi/(2L)$.'}]},
        {id:'b', prompt:'b) Zu $k$ gehört die Energie $E = \\hbar^2k^2/(2m)$. Gib $E$ für das $n$-te $k$ an.', type:'value', target:'(2n - 1)^2 π^2 ħ^2/(8m L^2)', points:2, ph:'E = ħ^2 k^2/(2m)',
          hints:['Setze $k = (2n-1)\\pi/(2L)$ ein und quadriere: $k^2 = (2n-1)^2\\pi^2/(4L^2)$.'],
          model:['E = ħ^2 k^2/(2m)', '= ħ^2/(2m) · (2n - 1)^2 π^2/(4L^2)', '= (2n - 1)^2 π^2 ħ^2/(8m L^2)'],
          note:'Für $n = 1$ ist $E = \\frac{\\pi^2\\hbar^2}{8mL^2}$: Die Lösung $\\sin(\\pi x/(2L))$ ist die halbe Grundschwingung eines Kastens der Breite $2L$.'}
      ]},
    {id:'md-p4', title:'Separationsansatz: die Zeitgleichung',
      text:'Setzt man $\\Psi(x,t) = \\varphi(x)f(t)$ in $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi$ ein und teilt durch $\\varphi f$, hängt die linke Seite nur von $t$ ab, die rechte nur von $x$. Beide sind also gleich einer Konstanten $E$. Für die Zeit bleibt $i\\hbar f\'(t) = Ef(t)$.',
      ctx:{coords:['t'], params:{E:'pos'}, unknowns:{λ:{ref:'-i E/ħ', kind:'complex'}, τ:{ref:'πħ/E'}}},
      goals:[
        {id:'a', prompt:'a) Löse $i\\hbar f\'(t) = Ef(t)$ mit $f(0) = 1$.', type:'value', target:'e^(-i E t/ħ)', points:2, ph:'f(t) = e^(λt)',
          hints:['Der Ansatz $f(t) = e^{\\lambda t}$ erfüllt schon $f(0) = 1$.', 'Aus $i\\hbar\\lambda = E$ folgt $\\lambda = E/(i\\hbar) = -iE/\\hbar$.'],
          model:['f(t) = e^(λt)', "iħ f'(t) = E f(t)", 'iħ λ = E', 'λ = -i E/ħ', 'f(t) = e^(-i E t/ħ)'],
          mistakes:[{expr:'e^(i E t/ħ)', msg:'Vorzeichen: $1/i = -i$, also $\\lambda = -iE/\\hbar$.'}, {expr:'e^(-E t/ħ)', msg:'Es fehlt das $i$: Die Lösung dreht nur ihre Phase, ihr Betrag bleibt 1.'}]},
        {id:'b', prompt:'b) Nach welcher Zeit $\\tau > 0$ ist $f(\\tau) = -1$ zum ersten Mal?', type:'solve', unknown:'τ', points:2, ph:'e^(-i E τ/ħ) = -1',
          hints:['$e^{-i\\pi} = -1$, und vorher ist der Wert nie $-1$.'],
          model:['e^(-i E τ/ħ) = -1', {l:'E τ/ħ = π', w:'e^{-iπ} = −1'}, 'τ = πħ/E'],
          note:'Der Faktor $-1$ ist eine globale Phase: $|\\Psi|^2$ ändert sich nicht. Messbar werden solche Phasen erst in Überlagerungen verschiedener Energien (Thema 2 und 3).'}
      ]},
    {id:'md-p5', title:'Doppelte Wurzel',
      text:'Löse $y\'\' - 2y\' + y = 0$ mit $y(0) = 1$ und $y\'(0) = 0$.',
      ctx:DGL({unknowns:{λ:{ref:'1', kind:'real'}, A:{ref:'1', kind:'real'}, B:{ref:'-1', kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme die Wurzel $\\lambda$ der charakteristischen Gleichung.', type:'solve', unknown:'λ', points:1, ph:'λ^2 - 2λ + 1 = 0',
          hints:['$\\lambda^2 - 2\\lambda + 1$ ist ein Binom.'],
          model:['λ^2 - 2λ + 1 = 0', '(λ - 1)^2 = 0', 'λ = 1']},
        {id:'b', prompt:'b) Bestimme $y(x)$.', type:'value', target:'(1 - x) e^x', points:3, ph:'y(x) = (A + B x) e^x',
          hints:['Bei der doppelten Wurzel $\\lambda_0$ ist $y = (A + Bx)e^{\\lambda_0x}$.', '$y\'(x) = (A + B + Bx)e^x$, also $y\'(0) = A + B$.'],
          model:['y(x) = (A + B x) e^x', 'y(0) = A = 1', "y'(0) = A + B = 0", 'B = -1', 'y(x) = (1 - x) e^x'],
          mistakes:[{expr:'e^x', msg:'Mit $e^x$ allein ist $y\'(0) = 1 \\ne 0$. Bei der doppelten Wurzel gehört $xe^x$ dazu.'}]}
      ]}
  ],
  final:[
    {q:'Im Kasten ($y(0) = y(L) = 0$) sind nur bestimmte $k$ erlaubt. Welche Bedingung wählt sie aus?', opts:['die zweite Randbedingung $y(L) = 0$', 'die Normierung', 'die Linearität der Gleichung'], a:0, ex:'Nach $y(0) = 0$ bleibt $A\\sin kx$ für jedes $k$ übrig. Erst $y(L) = 0$ erzwingt $\\sin kL = 0$. Die Normierung legt danach nur $|A|$ fest.'},
    {task:{id:'md-f1', title:'Anfangswertproblem', text:'Löse $y\'\' + 9y = 0$ mit $y(0) = 2$ und $y\'(0) = 3$.',
      ctx:DGL({unknowns:{λ:{ref:'3i', alt:['-3i'], kind:'complex'}, A:{ref:'2', kind:'real'}, B:{ref:'1', kind:'real'}, C:{ref:'(2 - i)/2', kind:'complex'}, D:{ref:'(2 + i)/2', kind:'complex'}}}),
      goals:[{id:'a', prompt:'Bestimme $y(x)$.', type:'value', target:'2cos(3x) + sin(3x)', points:3,
        mistakes:[{expr:'2cos(3x) + 3 sin(3x)', msg:'Kettenregel: $\\frac{d}{dx}\\sin 3x = 3\\cos 3x$, also $y\'(0) = 3B$.'}],
        model:['λ^2 + 9 = 0', 'λ = ±3i', 'y(x) = A cos(3x) + B sin(3x)', 'y(0) = A = 2', "y'(0) = 3B = 3", 'y(x) = 2cos(3x) + sin(3x)']}]}},
    {q:'Für $x > 0$ gilt $y\'\' = \\kappa^2y$ mit $\\kappa > 0$, und $y$ soll normierbar sein. Was bleibt von $Ce^{\\kappa x} + De^{-\\kappa x}$?', opts:['$De^{-\\kappa x}$', '$Ce^{\\kappa x}$', 'beide Terme'], a:0, ex:'$e^{\\kappa x}$ wächst unbeschränkt; $\\int_0^\\infty|y|^2dx$ wäre unendlich. Also $C = 0$.'},
    {task:{id:'md-f2', title:'Randbedingungen an die Ableitung', text:'$y\'\' = -k^2y$ auf $[0, L]$ mit $y\'(0) = 0$ und $y\'(L) = 0$.',
      ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos'}, unknowns:{A:{ref:'0', kind:'real'}, B:{ref:'1', kind:'real'}, k:{ref:'π/L'}}}),
      goals:[{id:'a', prompt:'Bestimme das kleinste erlaubte $k > 0$.', type:'solve', unknown:'k', points:3,
        model:['y(x) = A sin(kx) + B cos(kx)', "y'(0) = A k = 0", 'A = 0', "y'(L) = -B k sin(kL) = 0", 'k = π/L'],
        note:'Hier ist auch $k = 0$ erlaubt: $y = B$ (konstant) erfüllt beide Bedingungen – anders als bei $y(0) = y(L) = 0$.'}]}}
  ],
  errors:[
    {id:'md-e1', title:'Die triviale Lösung',
      text:'Randwertproblem $y\'\' = -k^2y$ mit $y(0) = y(L) = 0$. Gesucht sind die $k$, für die es eine Lösung gibt, die nicht überall null ist. Jemand rechnet:',
      ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos', n:{int:[1, 4]}}, unknowns:{A:{ref:'1', kind:'real'}, B:{ref:'0', kind:'real'}, k:{ref:'nπ/L'}}}),
      lines:['y(x) = A sin(kx) + B cos(kx)', 'y(0) = B = 0', 'y(L) = A sin(kL) = 0', 'A = 0'],
      wrong:3,
      why:{q:'Was ist an der letzten Zeile falsch?', opts:['Mit $A = 0$ ist $y \\equiv 0$; gesucht ist aber eine nichttriviale Lösung, also $\\sin(kL) = 0$.', 'Es müsste $B = 1$ heißen.', 'Nichts, $A = 0$ ist die einzige Möglichkeit.'], a:0, ex:'$A\\sin(kL) = 0$ hat zwei Möglichkeiten: $A = 0$ (uninteressant) oder $\\sin(kL) = 0$. Der zweite liefert die Eigenwerte.'},
      fix:{id:'a', prompt:'Berichtige und bestimme die erlaubten $k$.', type:'solve', unknown:'k', model:['y(x) = A sin(kx) + B cos(kx)', 'y(0) = B = 0', 'y(L) = A sin(kL) = 0', 'sin(kL) = 0', 'k = nπ/L']}},
    {id:'md-e2', title:'Vorzeichen in der charakteristischen Gleichung',
      text:'Gesucht sind die Lösungen von $y\'\' = \\kappa^2y$ mit $\\kappa > 0$. Jemand rechnet:',
      ctx:{coords:['x'], params:{κ:'pos'}, unknowns:{λ:{ref:'κ', alt:['-κ'], kind:'real'}}},
      lines:['λ^2 e^(λx) = κ^2 e^(λx)', 'λ^2 + κ^2 = 0', 'λ = ±iκ'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 passiert?', opts:['$\\kappa^2$ wurde mit falschem Vorzeichen auf die linke Seite gebracht.', 'Man darf nicht durch $e^{\\lambda x}$ teilen.', 'Der Ansatz $e^{\\lambda x}$ passt hier nicht.'], a:0, ex:'Richtig ist $\\lambda^2 - \\kappa^2 = 0$, also $\\lambda = \\pm\\kappa$: reelle Exponentialfunktionen. Mit $\\lambda = \\pm i\\kappa$ käme eine Schwingung heraus – das wäre $y\'\' = -\\kappa^2y$.'},
      fix:{id:'a', prompt:'Berichtige: Bestimme beide Wurzeln $\\lambda$.', type:'solve', unknown:'λ', both:true, model:['λ^2 - κ^2 = 0', 'λ = ±κ']}}
  ]
});
})();
lexe('lineare-dgl', 'Lineare DGL mit konstanten Koeffizienten', '$y\'\' + ay\' + by = 0$. Ansatz $y = e^{\\lambda x}$ gibt $\\lambda^2 + a\\lambda + b = 0$. Zwei verschiedene Wurzeln: $y = C_1e^{\\lambda_1x} + C_2e^{\\lambda_2x}$; komplexe Wurzeln $\\alpha\\pm i\\beta$: $y = e^{\\alpha x}(A\\cos\\beta x + B\\sin\\beta x)$; doppelte Wurzel $\\lambda_0$: $y = (C_1 + C_2x)e^{\\lambda_0x}$. Linear und homogen heißt: Linearkombinationen von Lösungen sind wieder Lösungen (Superposition).', {topic:'m-dgl'});
lexe('charakteristische-gleichung', 'Charakteristische Gleichung', 'Setzt man $y = e^{\\lambda x}$ in eine lineare DGL mit konstanten Koeffizienten ein, wird jede Ableitung zu einem Faktor $\\lambda$: $y\'\'\\to\\lambda^2$, $y\'\\to\\lambda$. Nach Division durch $e^{\\lambda x} \\ne 0$ bleibt ein Polynom in $\\lambda$. Beispiele: $y\'\' = -k^2y$ gibt $\\lambda = \\pm ik$, $y\'\' = \\kappa^2y$ gibt $\\lambda = \\pm\\kappa$.', {topic:'m-dgl'});
lexe('anfangswertproblem', 'Anfangswertproblem', 'Eine DGL 2. Ordnung zusammen mit $y(x_0)$ und $y\'(x_0)$ an derselben Stelle. Für lineare DGL mit stetigen Koeffizienten gibt es immer genau eine Lösung. Beispiel: $y\'\' = -k^2y$, $y(0) = 0$, $y\'(0) = 1$ hat $y = \\sin(kx)/k$ für jedes $k > 0$. Erster Ordnung: $i\\hbar f\' = Ef$, $f(0) = 1$ gibt $f = e^{-iEt/\\hbar}$.', {topic:'m-dgl'});
lexe('randwertproblem', 'Randwertproblem und Eigenwerte', 'Bedingungen an zwei verschiedenen Stellen, z. B. $y(0) = y(L) = 0$. Dann hat $y\'\' = -k^2y$ nichttriviale Lösungen nur für $k = n\\pi/L$, $n = 1, 2, \\dots$: ein Eigenwertproblem. Varianten: $y(0) = 0$, $y\'(L) = 0$ gibt $k = (2n-1)\\pi/(2L)$; Normierbarkeit wirkt wie eine Randbedingung im Unendlichen; an Sprungstellen eines endlichen Potentials sind $\\psi$ und $\\psi\'$ stetig (Anschlussbedingungen).', {topic:'m-dgl'});
