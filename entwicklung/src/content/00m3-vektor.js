/* ===== Mathe M3: Vektorräume und Skalarprodukt ===== */
const MVEK = extra => Object.assign({rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}}, extra || {});
topic({
  id:'m-vektor', ch:'math', title:'Vektorräume und Skalarprodukt', short:'Vektorräume',
  src:'Boas Kap. 3 · Griffiths & Schroeter Anhang A',
  goals:[
    'Ich kann Skalarprodukte und Normen in $\\mathbb C^n$ berechnen und dabei richtig konjugieren.',
    'Ich kann einen Vektor nach einer Orthonormalbasis entwickeln ($c_i = \\langle e_i|v\\rangle$) und Projektionen bilden.',
    'Ich kann mit dem Gram-Schmidt-Verfahren orthogonalisieren und die Cauchy-Schwarz-Ungleichung anwenden.'
  ],
  needs:'Vektoren im $\\mathbb R^3$: Skalarprodukt, Betrag, Winkel · komplexe Zahlen, $z^*z = |z|^2$ (M1)',
  check:[
    {q:'$(1, 2, 2)\\cdot(2, 0, 1)$ ist …', opts:['$4$', '$3$', '$(2, 0, 2)$'], a:0, ex:'$1\\cdot 2 + 2\\cdot 0 + 2\\cdot 1 = 4$. Das Skalarprodukt ist eine Zahl, kein Vektor.', lex:'skalarprodukt'},
    {q:'Wie lang ist der Vektor $(3, 4)$?', opts:['$5$', '$7$', '$25$'], a:0, ex:'$\\sqrt{3^2 + 4^2} = 5$. $25$ ist das Quadrat der Länge.', lex:'skalarprodukt'},
    {q:'Für $z = 2 - i$ ist $z^*z$ …', opts:['$5$', '$3$', '$3 - 4i$'], a:0, ex:'$(2 + i)(2 - i) = 4 + 1 = 5$. Genau diese Rechnung steckt im komplexen Skalarprodukt.', lex:'komplexe-zahlen', prev:'m-komplex'},
    {q:'Die Vektoren $(1, 0)$ und $(1, 1)$ …', opts:['sind linear unabhängig, aber nicht orthogonal', 'sind orthogonal', 'sind linear abhängig'], a:0, ex:'Keiner ist ein Vielfaches des anderen, also unabhängig – sie bilden eine Basis. Ihr Skalarprodukt ist aber $1 \\neq 0$.', lex:'vektorraum'}
  ],
  example:{
    title:'Komponenten in einer Orthonormalbasis von $\\mathbb C^2$',
    text:'Die Vektoren $e_1 = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ i\\end{pmatrix}$ und $e_2 = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ -i\\end{pmatrix}$ bilden eine Basis von $\\mathbb C^2$. Entwickle $v = \\begin{pmatrix}1\\\\ 2i\\end{pmatrix}$ nach dieser Basis. In der Eingabe sind Spaltenvektoren `(a; b)` und Zeilen `(a, b)`.',
    ctx:MVEK({states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'(1; 2i)'}}),
    lines:[
      {l:'⟨e_1|e_2⟩ = 1/2 (1, -i)(1; -i)', why:{q:'Warum steht in der Zeile $(1, -i)$ und nicht $(1, i)$?', opts:['Zum Bra $\\langle e_1|$ gehört die Zeile mit konjugierten Einträgen.', 'Das ist ein Tippfehler.', 'Weil $e_2$ ein $-i$ enthält.'], a:0, ex:'$\\langle a|b\\rangle = \\sum_i a_i^*b_i$: Der linke Vektor wird konjugiert.'}},
      {l:'= (1 + i^2)/2', why:{q:'Woher kommt $i^2$?', opts:['$(-i)\\cdot(-i) = i^2$', '$i\\cdot i$ aus $e_1$', 'aus der Normierung'], a:0, ex:'Zweite Komponenten: $(-i)$ aus dem Bra mal $(-i)$ aus $e_2$.'}},
      {l:'= 0', why:{q:'Was folgt daraus?', opts:['$e_1$ und $e_2$ sind orthogonal.', '$e_1 = e_2$', '$e_1$ ist nicht normiert.'], a:0, ex:'Zusammen mit $\\langle e_i|e_i\\rangle = (1 + 1)/2 = 1$ ist das eine Orthonormalbasis.'}},
      {l:'⟨e_1|v⟩ = 1/sqrt(2) (1, -i)(1; 2i)', w:'Komponente c₁ = ⟨e₁|v⟩', why:{q:'Warum ist die Komponente einfach $\\langle e_1|v\\rangle$?', opts:['Aus $v = c_1e_1 + c_2e_2$ folgt $\\langle e_1|v\\rangle = c_1\\langle e_1|e_1\\rangle + c_2\\langle e_1|e_2\\rangle = c_1$.', 'Das ist eine Definition, die immer gilt.', 'Weil $v$ normiert ist.'], a:0, ex:'Das klappt nur in einer **Orthonormal**basis. Sonst müsste man ein Gleichungssystem lösen.'}},
      {l:'= 3/sqrt(2)', why:{q:'Wie kommt man auf $3$?', opts:['$1\\cdot 1 + (-i)(2i) = 1 - 2i^2 = 3$', '$1 + 2 = 3$ ohne Rechnung', '$|1|^2 + |2i|^2 - 2$'], a:0, ex:'$(-i)(2i) = -2i^2 = +2$.'}},
      {l:'⟨e_2|v⟩ = 1/sqrt(2) (1, i)(1; 2i)', why:{q:'Welche Zeile gehört zu $\\langle e_2|$?', opts:['$(1, i)/\\sqrt2$, das Konjugierte von $(1; -i)/\\sqrt2$', '$(1, -i)/\\sqrt2$', '$(1; i)/\\sqrt2$'], a:0, ex:'Konjugieren macht aus $-i$ ein $+i$.'}},
      {l:'= -1/sqrt(2)', why:{q:'Rechnung:', opts:['$1 + i\\cdot 2i = 1 + 2i^2 = -1$', '$1 + 2 = 3$', '$1 - 2i$'], a:0, ex:'$i\\cdot 2i = 2i^2 = -2$.'}},
      {l:'|⟨e_1|v⟩|^2 + |⟨e_2|v⟩|^2 = 9/2 + 1/2', why:{q:'Wozu diese Summe?', opts:['Kontrolle mit Parseval: $\\sum_i|c_i|^2 = \\langle v|v\\rangle$', 'Sie ergibt die Basisvektoren.', 'Sie muss immer 1 sein.'], a:0, ex:'In einer ONB ist die Norm die Summe der Komponentenquadrate – wie Pythagoras.'}},
      {l:'= 5', why:{q:'Stimmt das mit $\\langle v|v\\rangle$ überein?', opts:['Ja: $|1|^2 + |2i|^2 = 1 + 4 = 5$.', 'Nein, $\\langle v|v\\rangle = 1 + (2i)^2 = -3$.', 'Nur wenn $v$ normiert ist.'], a:0, ex:'Ohne Konjugation käme $-3$ heraus – eine negative „Länge“, ein sicheres Zeichen für einen Fehler.'}}
    ],
    faded:{id:'mv-fade', title:'Jetzt du: Komponenten in einer reellen ONB',
      text:'$f_1 = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ 1\\end{pmatrix}$, $f_2 = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ -1\\end{pmatrix}$ und $v = \\begin{pmatrix}3\\\\ i\\end{pmatrix}$. Die erste Komponente ist schon berechnet.',
      ctx:MVEK({states:{f_1:'(1; 1)/sqrt(2)', f_2:'(1; -1)/sqrt(2)', v:'(3; i)'}}),
      given:['⟨f_1|v⟩ = 1/sqrt(2) (1, 1)(3; i)', '= (3 + i)/sqrt(2)'],
      goals:[{id:'a', prompt:'Bestimme $c_2 = \\langle f_2|v\\rangle$.', type:'value', target:'(3 - i)/sqrt(2)', points:2, hints:['Die Zeile zu $\\langle f_2|$ ist $(1, -1)/\\sqrt2$ – hier gibt es nichts zu konjugieren.', 'Kontrolle: $|c_1|^2 + |c_2|^2 = 5 + 5 = 10 = |3|^2 + |i|^2$.'],
        model:['⟨f_1|v⟩ = 1/sqrt(2) (1, 1)(3; i)', '= (3 + i)/sqrt(2)', '⟨f_2|v⟩ = 1/sqrt(2) (1, -1)(3; i)', {l:'= (3 - i)/sqrt(2)', gap:'= (▢)/sqrt(2)'}],
        mistakes:[{expr:'(3 + i)/sqrt(2)', msg:'Das ist $c_1$. Für $c_2$ steht in der Zeile $(1, -1)$.'}, {expr:'(-3 + i)/sqrt(2)', msg:'Vorzeichen: $1\\cdot 3 + (-1)\\cdot i = 3 - i$.'}]}]}
  },
  puzzle:{
    title:'Ein Vektor der Länge null?',
    text:'Der Vektor $a = \\begin{pmatrix}1\\\\ i\\end{pmatrix}$ ist offensichtlich nicht der Nullvektor.\n\nJemand rechnet seine Länge wie im $\\mathbb R^2$: $a\\cdot a = 1\\cdot 1 + i\\cdot i = 1 - 1 = 0$.\n\nWie lang ist $a$ wirklich?',
    q:{q:'Deine Vermutung:', opts:['$\\sqrt2$', '$0$, die Rechnung stimmt', '$1 + i$', 'Komplexe Vektoren haben keine Länge.'], a:0, ex:'$\\langle a|a\\rangle = |1|^2 + |i|^2 = 2$, also $\\|a\\| = \\sqrt2$.'},
    reveal:'Ohne Konjugation kann das „Skalarprodukt“ eines Vektors mit sich selbst null oder sogar komplex sein – als Länge taugt es dann nicht. Deshalb definiert man in $\\mathbb C^n$\n\n$$\\langle a|b\\rangle = \\sum_i a_i^*b_i,\\qquad \\langle a|a\\rangle = \\sum_i|a_i|^2 \\ge 0.$$\n\nDer Preis: Die Reihenfolge zählt, $\\langle a|b\\rangle^* = \\langle b|a\\rangle$. Ein Faktor im **rechten** Vektor kommt unverändert heraus, ein Faktor im **linken** konjugiert: $\\langle\\lambda a|b\\rangle = \\lambda^*\\langle a|b\\rangle$. Das ist die Konvention der Physik (in vielen Mathematikbüchern ist es umgekehrt).\n\nIn Dirac-Notation ist $|a\\rangle$ die Spalte und $\\langle a|$ die Zeile mit konjugierten Einträgen.'
  },
  clarify:{
    core:'Ein **Vektorraum** über $\\mathbb C$ ist eine Menge, in der man Vektoren addieren und mit komplexen Zahlen multiplizieren kann. Beispiele: $\\mathbb C^n$, Polynome, quadratintegrable Funktionen (M5). Vektoren $v_1, \\dots, v_k$ sind **linear unabhängig**, wenn $\\sum c_iv_i = 0$ nur für alle $c_i = 0$ gilt; $n$ unabhängige Vektoren in $\\mathbb C^n$ bilden eine **Basis**.\n\nDas **Skalarprodukt** in $\\mathbb C^n$ ist $\\langle a|b\\rangle = \\sum_i a_i^*b_i$. Es ist linear im rechten, antilinear im linken Argument, und $\\|a\\| = \\sqrt{\\langle a|a\\rangle}$ ist die Norm.\n\nIn einer **Orthonormalbasis** ($\\langle e_i|e_j\\rangle = \\delta_{ij}$) gilt\n\n$$|v\\rangle = \\sum_i c_i|e_i\\rangle,\\qquad c_i = \\langle e_i|v\\rangle,\\qquad \\langle v|v\\rangle = \\sum_i|c_i|^2\\ \\text{(Parseval)}.$$\n\nDie **Projektion** von $v$ auf einen normierten Vektor $e$ ist $\\langle e|v\\rangle\\,|e\\rangle$; für nicht normiertes $a$ ist es $\\frac{\\langle a|v\\rangle}{\\langle a|a\\rangle}|a\\rangle$. **Gram-Schmidt:** Von jedem neuen Vektor die Projektionen auf die schon fertigen abziehen, dann normieren. **Cauchy-Schwarz:** $|\\langle a|b\\rangle|^2 \\le \\langle a|a\\rangle\\langle b|b\\rangle$, mit Gleichheit genau für linear abhängige Vektoren.',
    keys:[
      'Bra = Zeile mit konjugierten Einträgen: Zu $|a\\rangle = (1; i)$ gehört $\\langle a| = (1, -i)$.',
      'Komponenten in einer ONB nie über ein Gleichungssystem, sondern direkt: $c_i = \\langle e_i|v\\rangle$.',
      'Reihenfolge beachten: $\\langle a|b\\rangle = \\langle b|a\\rangle^*$ und $\\langle\\lambda a|b\\rangle = \\lambda^*\\langle a|b\\rangle$.',
      'Parseval als Kontrolle: $\\sum_i|c_i|^2$ muss $\\langle v|v\\rangle$ ergeben.',
      'Bei Gram-Schmidt durch $\\langle a|a\\rangle$ teilen, solange $a$ noch nicht normiert ist.'
    ],
    errors:[
      'Skalarprodukt ohne Konjugation: $(1, i)\\cdot(1, i) = 0$, obwohl der Vektor nicht null ist.',
      '$\\langle\\lambda a|b\\rangle = \\lambda\\langle a|b\\rangle$ statt $\\lambda^*\\langle a|b\\rangle$.',
      'Komponenten in einer nicht orthonormalen Basis mit $\\langle b_i|v\\rangle$ ausrechnen.',
      'Bei der Projektion auf einen nicht normierten Vektor den Nenner $\\langle a|a\\rangle$ vergessen.'
    ],
    more:[{title:'Warum braucht die Quantenmechanik das?', text:'Zustände sind Vektoren $|\\psi\\rangle$ in einem komplexen Vektorraum. Die Wahrscheinlichkeit, bei einer Messung den Zustand $|e_i\\rangle$ zu finden, ist $|\\langle e_i|\\psi\\rangle|^2 = |c_i|^2$ (Thema 6 und 10). Parseval heißt dann: Die Wahrscheinlichkeiten summieren sich zu $\\langle\\psi|\\psi\\rangle = 1$. Für Funktionen wird aus der Summe ein Integral (M5).'}],
    checks:[
      {q:'$\\langle a|b\\rangle$ für $a = (i; 1)$ und $b = (1; i)$ ist …', opts:['$0$', '$2i$', '$-2i$'], a:0, ex:'$(-i)\\cdot 1 + 1\\cdot i = 0$. Ohne Konjugation käme $i + i = 2i$ heraus.'},
      {q:'Wenn $\\langle a|b\\rangle = 2 + i$ ist, dann ist $\\langle b|a\\rangle$ …', opts:['$2 - i$', '$2 + i$', '$-2 - i$'], a:0, ex:'Vertauschen konjugiert: $\\langle b|a\\rangle = \\langle a|b\\rangle^*$.'}
    ]
  },
  lab:{type:'vectors', title:'Ein Vektor, zwei Orthonormalbasen',
    text:'Den Vektor $v$ stellst du mit den Reglern $v_1$ und $v_2$ ein. Mit dem Winkel $\\varphi$ drehst du die Orthonormalbasis $e\'_1 = (\\cos\\varphi, \\sin\\varphi)$, $e\'_2 = (-\\sin\\varphi, \\cos\\varphi)$. Gezeichnet sind $v$, die gedrehte Basis und die Projektionen von $v$ auf die Basisvektoren. Die Anzeige zeigt die Komponenten $c_i = \\langle e\'_i|v\\rangle$ und $c_1^2 + c_2^2$.',
    questions:[
      {q:'Stelle $v = (1, 1)$ ein und drehe die Basis auf $\\varphi = 45°$. Welche Komponenten zeigt die Anzeige?', opts:['$c_1 = \\sqrt2 \\approx 1{,}41$, $c_2 = 0$', '$c_1 = c_2 = 1$', '$c_1 = 1$, $c_2 = 0$'], a:0, ex:'$e\'_1 = (1, 1)/\\sqrt2$ zeigt genau in Richtung $v$: $c_1 = 2/\\sqrt2 = \\sqrt2$, und $v$ hat keinen Anteil entlang $e\'_2$.'},
      {q:'Drehe die Basis bei festem $v$. Was passiert mit $c_1^2 + c_2^2$?', opts:['Es bleibt gleich $|v|^2$.', 'Es ist bei $\\varphi = 0$ am größten.', 'Es schwankt zwischen $0$ und $|v|^2$.'], a:0, ex:'Parseval: In jeder Orthonormalbasis ist $\\sum c_i^2 = |v|^2$. Nur die Aufteilung auf die Komponenten ändert sich.'}
    ],
    noPic:{q:'Ohne Bild: In der Basis $e\'_1 = (0, 1)$, $e\'_2 = (-1, 0)$ (also $\\varphi = 90°$) hat $v = (2, 3)$ die Komponenten …', opts:['$c_1 = 3$, $c_2 = -2$', '$c_1 = 2$, $c_2 = 3$', '$c_1 = -3$, $c_2 = 2$'], a:0, ex:'$c_1 = (0, 1)\\cdot(2, 3) = 3$, $c_2 = (-1, 0)\\cdot(2, 3) = -2$. Kontrolle: $9 + 4 = 13 = 2^2 + 3^2$.'}},
  compare:{
    text:'Gesucht sind die Komponenten von $v = (3; 1)$ in der Orthonormalbasis $f_1 = (1; 1)/\\sqrt2$, $f_2 = (1; -1)/\\sqrt2$, also $v = c_1f_1 + c_2f_2$. Zwei richtige Wege:',
    ctx:MVEK({states:{f_1:'(1; 1)/sqrt(2)', f_2:'(1; -1)/sqrt(2)', v:'(3; 1)'}, unknowns:{c_1:{ref:'2 sqrt(2)'}, c_2:{ref:'sqrt(2)'}}}),
    A:{name:'Skalarprodukte', model:['c_1 = ⟨f_1|v⟩', '= 1/sqrt(2) (1, 1)(3; 1)', '= 2 sqrt(2)', 'c_2 = ⟨f_2|v⟩', '= 1/sqrt(2) (1, -1)(3; 1)', '= sqrt(2)']},
    B:{name:'Gleichungssystem', text:'Komponentenweise aufschreiben und lösen.', model:['c_1 |f_1⟩ + c_2 |f_2⟩ = |v⟩', '(c_1 + c_2)/sqrt(2) = 3', '(c_1 - c_2)/sqrt(2) = 1', 'c_1 = 2 sqrt(2)', 'c_2 = sqrt(2)']},
    questions:[
      {q:'Welcher Weg bleibt in $\\mathbb C^{100}$ praktikabel?', opts:['Weg A: Jede Komponente ist ein einzelnes Skalarprodukt.', 'Weg B: ein Gleichungssystem mit 100 Unbekannten', 'Beide sind gleich aufwendig.'], a:0, ex:'In einer ONB entkoppeln die Gleichungen: Jedes $c_i$ hängt nur von $e_i$ und $v$ ab.'},
      {q:'Wann funktioniert nur Weg B?', opts:['wenn die Basis nicht orthonormal ist', 'wenn $v$ komplexe Einträge hat', 'nie'], a:0, ex:'Für eine schiefe Basis ist $\\langle b_i|v\\rangle$ nicht die Komponente (siehe „Fehler finden“).'}
    ]
  },
  practice:[
    {id:'mv-p1', title:'Skalarprodukt und Norm in $\\mathbb C^3$',
      text:'$a = \\begin{pmatrix}1\\\\ i\\\\ 1 - i\\end{pmatrix}$, $b = \\begin{pmatrix}2\\\\ -i\\\\ 1\\end{pmatrix}$. In der Eingabe: `⟨a|b⟩` oder ausgeschrieben `(1, -i, 1 + i)(2; -i; 1)`; die Norm als `sqrt(⟨a|a⟩)`.',
      ctx:MVEK({states:{a:'(1; i; 1 - i)', b:'(2; -i; 1)', u:'N (2; -i; 1)'}, unknowns:{N:{ref:'1/sqrt(6)', alt:['-1/sqrt(6)']}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle a|b\\rangle$.', type:'value', target:'2 + i', points:2, ph:'⟨a|b⟩ = (1, -i, 1 + i)(2; -i; 1)',
          hints:['Zeile zu $\\langle a|$: alle Einträge von $a$ konjugieren, also $(1, -i, 1 + i)$.', '$(-i)(-i) = i^2 = -1$ und $(1 + i)\\cdot 1 = 1 + i$.'],
          model:['⟨a|b⟩ = (1, -i, 1 + i)(2; -i; 1)', '= 2 + i^2 + 1 + i', '= 2 + i'],
          mistakes:[{expr:'4 - i', msg:'Ohne Konjugation gerechnet. Die Zeile zu $\\langle a|$ hat die Einträge $a_i^*$.'}, {expr:'2 - i', msg:'Das ist $\\langle b|a\\rangle = \\langle a|b\\rangle^*$. Konjugiert wird der **linke** Vektor.'}]},
        {id:'b', prompt:'b) Berechne die Norm $\\|a\\|$.', type:'value', target:'2', points:2, ph:'⟨a|a⟩ = 1 + 1 + |1 - i|^2',
          hints:['$\\langle a|a\\rangle = \\sum|a_i|^2$.', '$|1 - i|^2 = 2$, also $\\langle a|a\\rangle = 4$.'],
          model:['⟨a|a⟩ = 1 + 1 + |1 - i|^2', '= 4', 'sqrt(⟨a|a⟩) = 2'],
          mistakes:[{expr:'4', msg:'Das ist $\\langle a|a\\rangle = \\|a\\|^2$. Zieh noch die Wurzel.'}, {expr:'sqrt(-2i)', msg:'Ohne Konjugation gerechnet: $1 + i^2 + (1 - i)^2$ ist kein Betragsquadrat.'}, {expr:'-2i', msg:'Ohne Konjugation gerechnet: $1 + i^2 + (1 - i)^2$ ist keine Summe von Betragsquadraten. Es braucht $|a_i|^2 = a_i^*a_i$.'}]},
        {id:'c', prompt:'c) Bestimme $N > 0$ so, dass $u = N\\,b$ normiert ist.', type:'solve', unknown:'N', points:2, ph:'⟨u|u⟩ = 1',
          hints:['$\\langle u|u\\rangle = |N|^2\\langle b|b\\rangle$.', '$\\langle b|b\\rangle = 4 + 1 + 1 = 6$.'],
          model:['⟨u|u⟩ = 1', '|N|^2 (4 + 1 + 1) = 1', 'N = 1/sqrt(6)'],
          mistakes:[{expr:'1/sqrt(4)', msg:'Prüfe $|{-i}|^2 = 1$: $\\langle b|b\\rangle = 4 + 1 + 1 = 6$.'}, {expr:'1/6', msg:'$|N|^2\\cdot 6 = 1$ gibt $N = 1/\\sqrt6$, nicht $1/6$.'}]}
      ]},
    {id:'mv-p2', title:'Entwickeln nach einer Orthonormalbasis',
      text:'$f_1 = \\frac{1}{\\sqrt5}\\begin{pmatrix}1\\\\ 2i\\end{pmatrix}$, $f_2 = \\frac{1}{\\sqrt5}\\begin{pmatrix}2\\\\ -i\\end{pmatrix}$ und $v = \\begin{pmatrix}3\\\\ i\\end{pmatrix}$.',
      ctx:MVEK({states:{f_1:'(1; 2i)/sqrt(5)', f_2:'(2; -i)/sqrt(5)', v:'(3; i)'}}),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $f_1$ und $f_2$ orthogonal sind.', type:'show', from:'⟨f_1|f_2⟩', to:'0', points:2, hints:['Die Zeile zu $\\langle f_1|$ ist $(1, -2i)/\\sqrt5$.', '$(-2i)(-i) = 2i^2 = -2$.'],
          model:['⟨f_1|f_2⟩ = 1/5 (1, -2i)(2; -i)', '= (2 + 2i^2)/5', '= 0']},
        {id:'b', prompt:'b) Berechne $c_1 = \\langle f_1|v\\rangle$.', type:'value', target:'sqrt(5)', points:2, ph:'⟨f_1|v⟩ = 1/sqrt(5) (1, -2i)(3; i)',
          hints:['$(-2i)\\cdot i = -2i^2 = 2$.'],
          model:['⟨f_1|v⟩ = 1/sqrt(5) (1, -2i)(3; i)', '= (3 - 2i^2)/sqrt(5)', '= sqrt(5)'],
          mistakes:[{expr:'1/sqrt(5)', msg:'Ohne Konjugation gerechnet: Die Zeile zu $(1; 2i)$ ist $(1, -2i)$.'}, {expr:'5', msg:'Der Normierungsfaktor $1/\\sqrt5$ von $f_1$ fehlt.'}]},
        {id:'c', prompt:'c) Berechne $c_2 = \\langle f_2|v\\rangle$ und prüfe $|c_1|^2 + |c_2|^2 = \\langle v|v\\rangle$.', type:'value', target:'sqrt(5)', points:2, ph:'⟨f_2|v⟩ = 1/sqrt(5) (2, i)(3; i)',
          hints:['Die Zeile zu $\\langle f_2|$ ist $(2, i)/\\sqrt5$.', '$i\\cdot i = -1$.'],
          model:['⟨f_2|v⟩ = 1/sqrt(5) (2, i)(3; i)', '= (6 + i^2)/sqrt(5)', '= sqrt(5)'],
          mistakes:[{expr:'7/sqrt(5)', msg:'Ohne Konjugation gerechnet: Die Zeile zu $(2; -i)$ ist $(2, i)$, und $i\\cdot i = -1$.'}],
          note:'Parseval: $|c_1|^2 + |c_2|^2 = 5 + 5 = 10 = |3|^2 + |i|^2$. Also $v = \\sqrt5\\,(f_1 + f_2)$.'}
      ]},
    {id:'mv-p3', title:'Projektion und Gram-Schmidt',
      text:'$a = \\begin{pmatrix}1\\\\ 1\\\\ 0\\end{pmatrix}$ und $b = \\begin{pmatrix}1\\\\ 0\\\\ 1\\end{pmatrix}$ sind linear unabhängig, aber nicht orthogonal.',
      ctx:MVEK({states:{a:'(1; 1; 0)', b:'(1; 0; 1)'}}),
      goals:[
        {id:'a', prompt:'a) Berechne den zu $a$ senkrechten Anteil $w = b - \\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}\\,a$.', type:'value', target:'(1/2; -1/2; 1)', points:3, ph:'⟨a|b⟩ = 1',
          hints:['$\\langle a|b\\rangle = 1$ und $\\langle a|a\\rangle = 2$.', 'Also $w = b - \\tfrac12 a$. Ergebnis als Spalte `(…; …; …)`.'],
          model:['⟨a|b⟩ = 1', '⟨a|a⟩ = 2', '|b⟩ - 1/2 |a⟩ = (1/2; -1/2; 1)'],
          mistakes:[{expr:'(0; -1; 1)', msg:'Du hast ganz $a$ abgezogen. Der Anteil entlang $a$ ist $\\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}a = \\tfrac12 a$, weil $a$ nicht normiert ist.'}, {expr:'(1 - 1/sqrt(2); -1/sqrt(2); 1)', msg:'Nur durch $\\sqrt{\\langle a|a\\rangle}$ geteilt. Die Projektion braucht $\\langle a|a\\rangle$ im Nenner (oder zweimal den normierten Vektor).'}],
          note:'Kontrolle: $\\langle a|w\\rangle = \\tfrac12 - \\tfrac12 + 0 = 0$.'},
        {id:'b', prompt:'b) Normiere $w = (\\tfrac12; -\\tfrac12; 1)$.', type:'value', target:'(1; -1; 2)/sqrt(6)', points:2, ph:'(1/2, -1/2, 1)(1/2; -1/2; 1) = 3/2',
          hints:['$\\langle w|w\\rangle = \\tfrac14 + \\tfrac14 + 1 = \\tfrac32$.', 'Teile $w$ durch $\\sqrt{3/2}$.'],
          model:['(1/2, -1/2, 1)(1/2; -1/2; 1) = 3/2', '(1/2; -1/2; 1)/sqrt(3/2) = (1; -1; 2)/sqrt(6)'],
          mistakes:[{expr:'(1/2; -1/2; 1)/(3/2)', msg:'Teilen durch $\\langle w|w\\rangle$ normiert nicht. Man teilt durch die Norm $\\sqrt{\\langle w|w\\rangle}$.'}],
          note:'Zusammen mit $a/\\sqrt2$ ist das eine Orthonormalbasis der Ebene, die $a$ und $b$ aufspannen. Für einen dritten Vektor zieht man die Projektionen auf beide ab.'}
      ]},
    {id:'mv-p4', title:'Cauchy-Schwarz und Übergangswahrscheinlichkeit',
      text:'$a = \\begin{pmatrix}1\\\\ i\\end{pmatrix}$, $b = \\begin{pmatrix}1\\\\ 1\\end{pmatrix}$.',
      ctx:MVEK({states:{a:'(1; i)', b:'(1; 1)'}, unknowns:{λ:{ref:'-(1 - i)/2', kind:'complex'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\dfrac{|\\langle a|b\\rangle|^2}{\\langle a|a\\rangle\\langle b|b\\rangle}$. Nach Cauchy-Schwarz liegt das zwischen $0$ und $1$.', type:'value', target:'1/2', points:2, ph:'⟨a|b⟩ = 1 - i',
          hints:['$\\langle a|b\\rangle = 1 - i$, also $|\\langle a|b\\rangle|^2 = 2$.', '$\\langle a|a\\rangle = \\langle b|b\\rangle = 2$.'],
          model:['⟨a|b⟩ = 1 - i', '|⟨a|b⟩|^2/(⟨a|a⟩ ⟨b|b⟩) = 2/(2 · 2)', '= 1/2'],
          mistakes:[{expr:'(1 + i)^2/4', msg:'Ohne Konjugation und ohne Betrag gerechnet. Es braucht $|\\langle a|b\\rangle|^2 = |1 - i|^2 = 2$.'}],
          note:'Normiert man $a$ und $b$, ist der Quotient $|\\langle a|b\\rangle|^2$: die Wahrscheinlichkeit, ein System im Zustand $b$ bei einer passenden Messung im Zustand $a$ zu finden. Hier: $1/2$ – wie bei Spin-Zuständen $|{+x}\\rangle$ und $|{+y}\\rangle$ (Thema 10).'},
        {id:'b', prompt:'b) Bestimme die komplexe Zahl $\\lambda$, für die $b + \\lambda a$ senkrecht auf $a$ steht.', type:'solve', unknown:'λ', points:2, ph:'⟨a|b⟩ + λ ⟨a|a⟩ = 0',
          hints:['$\\langle a|b + \\lambda a\\rangle = \\langle a|b\\rangle + \\lambda\\langle a|a\\rangle$ (linear im rechten Argument).', '$1 - i + 2\\lambda = 0$.'],
          model:['⟨a|b⟩ + λ ⟨a|a⟩ = 0', '1 - i + 2λ = 0', 'λ = -(1 - i)/2'],
          mistakes:[{expr:'-(1 + i)/2', msg:'Hier wurde $\\langle b|a\\rangle = 1 + i$ statt $\\langle a|b\\rangle$ benutzt. Für $\\langle a|b + \\lambda a\\rangle$ steht $a$ links.'}],
          note:'$-\\lambda a = \\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}a$ ist genau die Projektion von $b$ auf $a$ – ein Gram-Schmidt-Schritt.'}
      ]}
  ],
  final:[
    {q:'Für $\\lambda \\in \\mathbb C$ gilt $\\langle\\lambda a|b\\rangle = $', opts:['$\\lambda^*\\langle a|b\\rangle$', '$\\lambda\\langle a|b\\rangle$', '$|\\lambda|\\langle a|b\\rangle$'], a:0, ex:'Im linken Argument wird konjugiert: $\\sum_i(\\lambda a_i)^*b_i = \\lambda^*\\sum_i a_i^*b_i$.'},
    {task:{id:'mv-f1', title:'Norm', text:'$v = \\begin{pmatrix}1 + i\\\\ 1 - i\\\\ 1\\end{pmatrix}$.', ctx:MVEK({states:{v:'(1 + i; 1 - i; 1)'}}),
      goals:[{id:'a', prompt:'Berechne $\\|v\\|$.', type:'value', target:'sqrt(5)', points:2, model:['⟨v|v⟩ = |1 + i|^2 + |1 - i|^2 + 1', '= 5', 'sqrt(⟨v|v⟩) = sqrt(5)'],
        mistakes:[{expr:'5', msg:'Das ist $\\|v\\|^2$. Zieh noch die Wurzel.'}, {expr:'1', msg:'Ohne Konjugation gerechnet: $(1 + i)^2 + (1 - i)^2 + 1 = 1$. Es braucht $|1 \\pm i|^2 = 2$.'}]}]}},
    {q:'In einer ONB $\\{e_1, e_2, e_3\\}$ ist $v = 2e_1 - ie_3$. Dann ist $\\langle v|v\\rangle$ …', opts:['$5$', '$3$', '$2 - i$'], a:0, ex:'Parseval: $|2|^2 + |{-i}|^2 = 4 + 1 = 5$.'},
    {task:{id:'mv-f2', title:'Komponente', text:'$e_1 = \\frac{1}{\\sqrt2}(1; i)$, $e_2 = \\frac{1}{\\sqrt2}(1; -i)$, $v = (0; 2)$.', ctx:MVEK({states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'(0; 2)'}}),
      goals:[{id:'a', prompt:'Berechne $c_2 = \\langle e_2|v\\rangle$.', type:'value', target:'sqrt(2) i', points:2, model:['⟨e_2|v⟩ = 1/sqrt(2) (1, i)(0; 2)', '= sqrt(2) i'],
        mistakes:[{expr:'-sqrt(2) i', msg:'Ohne Konjugation gerechnet: Die Zeile zu $(1; -i)$ ist $(1, i)$.'}]}]}}
  ],
  errors:[
    {id:'mv-e1', title:'Norm ohne Konjugation',
      text:'Gesucht ist die Norm von $a = \\begin{pmatrix}1 + i\\\\ 2i\\end{pmatrix}$. So wurde gerechnet:',
      ctx:MVEK({states:{a:'(1 + i; 2i)'}}),
      lines:['⟨a|a⟩ = (1 + i)^2 + (2i)^2', '= 2i - 4'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['Es fehlt die Konjugation: $\\langle a|a\\rangle = |1 + i|^2 + |2i|^2$.', 'Man muss $(1 + i) + 2i$ quadrieren.', 'Nichts, nur das Vorzeichen in Zeile 2.'], a:0, ex:'Ein Normquadrat ist reell und nicht negativ. $2i - 4$ kann nicht stimmen.'},
      fix:{id:'a', prompt:'Berichtige und berechne $\\|a\\|$.', type:'value', target:'sqrt(6)', model:['⟨a|a⟩ = |1 + i|^2 + |2i|^2', '= 2 + 4', 'sqrt(⟨a|a⟩) = sqrt(6)'],
        mistakes:[{expr:'6', msg:'Das ist $\\|a\\|^2$. Zieh noch die Wurzel.'}]}},
    {id:'mv-e2', title:'Komponenten in einer schiefen Basis',
      text:'Die Basis $b_1 = (1; 0)$, $b_2 = (1; 1)$ ist nicht orthogonal. Jemand bestimmt die Komponenten von $v = (2; 3)$ in $v = c_1b_1 + c_2b_2$ mit Skalarprodukten:',
      ctx:MVEK({states:{b_1:'(1; 0)', b_2:'(1; 1)', v:'(2; 3)'}, unknowns:{c_1:{ref:'-1'}, c_2:{ref:'3'}}}),
      lines:['c_1 = ⟨b_1|v⟩', '= 2', 'c_2 = ⟨b_2|v⟩', '= 5'],
      wrong:0,
      why:{q:'Was ist falsch?', opts:['$c_i = \\langle b_i|v\\rangle$ gilt nur in einer Orthonormalbasis. Hier muss man $c_1b_1 + c_2b_2 = v$ lösen.', 'Die Skalarprodukte sind falsch ausgerechnet.', 'Man muss noch durch $\\sqrt2$ teilen.'], a:0, ex:'Probe: $2b_1 + 5b_2 = (7; 5) \\neq v$. Richtig ist $c_1 = -1$, $c_2 = 3$: $-(1; 0) + 3(1; 1) = (2; 3)$.'},
      fix:{id:'a', prompt:'Bestimme $c_1$ aus $c_1b_1 + c_2b_2 = v$.', type:'solve', unknown:'c_1', model:['c_1 |b_1⟩ + c_2 |b_2⟩ = |v⟩', 'c_1 + c_2 = 2', 'c_2 = 3', 'c_1 = -1'],
        mistakes:[{expr:'2', msg:'Das ist $\\langle b_1|v\\rangle$ – in einer schiefen Basis nicht die Komponente.'}]}}
  ]
});
lexe('vektorraum', 'Vektorraum, Basis, lineare Unabhängigkeit', 'Ein Vektorraum über $\\mathbb C$: Vektoren lassen sich addieren und mit komplexen Zahlen multiplizieren. $v_1, \\dots, v_k$ heißen linear unabhängig, wenn $\\sum c_iv_i = 0$ nur für $c_1 = \\dots = c_k = 0$ gilt. Eine Basis ist ein unabhängiges System, mit dem sich jeder Vektor darstellen lässt; die Anzahl ihrer Vektoren ist die Dimension. Beispiele: $\\mathbb C^n$ (Dimension $n$), Funktionenräume (unendlich-dimensional, M5).', {topic:'m-vektor'});
lexe('skalarprodukt', 'Skalarprodukt in ℂⁿ', '$\\langle a|b\\rangle = \\sum_i a_i^*b_i$ (Konvention der Physik: antilinear im linken Argument). Eigenschaften: $\\langle a|b\\rangle^* = \\langle b|a\\rangle$, $\\langle a|\\lambda b\\rangle = \\lambda\\langle a|b\\rangle$, $\\langle\\lambda a|b\\rangle = \\lambda^*\\langle a|b\\rangle$, $\\langle a|a\\rangle \\ge 0$ mit Gleichheit nur für $a = 0$. Norm: $\\|a\\| = \\sqrt{\\langle a|a\\rangle}$. In Dirac-Notation ist $\\langle a|$ die Zeile mit den Einträgen $a_i^*$.', {topic:'m-vektor'});
lexe('orthonormalbasis', 'Orthonormalbasis und Komponenten', 'Eine Basis mit $\\langle e_i|e_j\\rangle = \\delta_{ij}$. Dann gilt $v = \\sum_i c_ie_i$ mit $c_i = \\langle e_i|v\\rangle$, $\\langle v|w\\rangle = \\sum_i c_i^*d_i$ mit $d_i = \\langle e_i|w\\rangle$ und Parseval $\\langle v|v\\rangle = \\sum_i|c_i|^2$. Vollständigkeit: $\\sum_i|e_i\\rangle\\langle e_i| = \\mathbb 1$. Für Funktionen siehe Orthonormalität (Thema 3) und M5.', {topic:'m-vektor'});
lexe('projektion', 'Projektion und Projektor', 'Projektion von $v$ auf einen normierten Vektor $e$: $\\langle e|v\\rangle\\,|e\\rangle$; auf einen beliebigen Vektor $a \\neq 0$: $\\frac{\\langle a|v\\rangle}{\\langle a|a\\rangle}|a\\rangle$. Als Operator: $P = |e\\rangle\\langle e|$ mit $P^2 = P$ und $P^\\dagger = P$. Der Rest $v - Pv$ steht senkrecht auf $e$.', {topic:'m-vektor'});
lexe('gram-schmidt', 'Gram-Schmidt-Verfahren', 'Aus linear unabhängigen $a_1, a_2, \\dots$ eine Orthonormalbasis bauen: $e_1 = a_1/\\|a_1\\|$; dann $w_2 = a_2 - \\langle e_1|a_2\\rangle e_1$, $e_2 = w_2/\\|w_2\\|$; allgemein $w_k = a_k - \\sum_{j<k}\\langle e_j|a_k\\rangle e_j$. Angewandt auf $1, x, x^2, \\dots$ auf $[-1, 1]$ liefert es bis auf die Normierung die Legendre-Polynome (M8).', {topic:'m-vektor'});
lexe('cauchy-schwarz', 'Cauchy-Schwarz-Ungleichung', '$|\\langle a|b\\rangle|^2 \\le \\langle a|a\\rangle\\langle b|b\\rangle$, Gleichheit genau dann, wenn $a$ und $b$ linear abhängig sind. Für normierte Zustände heißt das $0 \\le |\\langle a|b\\rangle|^2 \\le 1$ – deshalb sind Übergangswahrscheinlichkeiten sinnvoll. Aus ihr folgt die Robertson-Unschärferelation (Thema 6).', {topic:'m-vektor'});
