/* ===== Mathe M4: Lineare Operatoren und Eigenwerte ===== */
(function(){
const MAT = (extra) => {
  const e = extra || {};
  const r = Object.assign({rep:'mat', coords:['t'], params:{}}, e, {mat:{preset:'spin', mats:Object.assign({}, e.mats || {})}}); delete r.mats; return r;
};
topic({
  id:'m-eigen', ch:'math', title:'Lineare Operatoren und Eigenwerte', short:'Eigenwerte',
  src:'Boas Kap. 3 · Griffiths & Schroeter Anhang A',
  goals:[
    'Ich kann Matrizen multiplizieren, adjungieren und Kommutatoren berechnen und erkenne hermitesche und unitäre Matrizen.',
    'Ich kann Eigenwerte über das charakteristische Polynom und die zugehörigen Eigenvektoren bestimmen und mit Spur und Determinante kontrollieren.',
    'Ich kann eine hermitesche Matrix diagonalisieren und damit Matrixfunktionen wie $e^{-iHt/\\hbar}$ berechnen.'
  ],
  needs:'Matrizen multiplizieren · Determinante einer $2\\times2$-Matrix · komplexe Zahlen (M1) · Skalarprodukt und Orthonormalbasen (M3)',
  check:[
    {q:'Was ergibt $\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}\\begin{pmatrix}1\\\\-1\\end{pmatrix}$?', opts:['$\\begin{pmatrix}-1\\\\-1\\end{pmatrix}$', '$\\begin{pmatrix}-2\\\\2\\end{pmatrix}$', '$\\begin{pmatrix}3\\\\7\\end{pmatrix}$'], a:0, ex:'Zeile mal Spalte: $1\\cdot1 + 2\\cdot(-1) = -1$ und $3\\cdot1 + 4\\cdot(-1) = -1$.', lex:'eigenwertproblem'},
    {q:'$\\det\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ ist …', opts:['$3$', '$5$', '$4$'], a:0, ex:'$\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad - bc = 4 - 1 = 3$.', lex:'charakteristisches-polynom'},
    {q:'$(3 - 2i)^*$ ist …', opts:['$3 + 2i$', '$-3 + 2i$', '$3 - 2i$'], a:0, ex:'Konjugieren dreht nur das Vorzeichen des Imaginärteils um.', lex:'komplexe-zahlen', prev:'m-komplex'},
    {q:'Für $v = \\begin{pmatrix}1\\\\i\\end{pmatrix}$ ist $\\langle v|v\\rangle = \\sum_k v_k^*v_k$ gleich …', opts:['$2$', '$0$', '$1 + i$'], a:0, ex:'$1\\cdot1 + (-i)\\cdot i = 1 + 1 = 2$. Ohne Konjugation käme fälschlich $1 + i^2 = 0$ heraus.', lex:'skalarprodukt', prev:'m-vektor'}
  ],
  example:{
    title:'Eigenwerte und Eigenvektoren einer symmetrischen Matrix',
    text:'Bestimme die Eigenwerte von $A = \\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ und einen Eigenvektor zum größeren Eigenwert. In der Eingabe: `A` oder `(2, 1; 1, 2)`, die Einheitsmatrix als `I`, Spaltenvektoren als `(1; 1)`.',
    ctx:MAT({mats:{A:'(2, 1; 1, 2)'}, unknowns:{λ:{ref:'3', alt:['1'], kind:'real'}}}),
    lines:[
      {l:'det(A - λ I) = 0', why:{q:'Warum beginnt man mit der Determinante?', opts:['$(A - \\lambda\\mathbb 1)v = 0$ hat nur dann eine Lösung $v \\ne 0$, wenn $A - \\lambda\\mathbb 1$ nicht invertierbar ist.', 'Weil die Determinante die Spur ist.', 'Weil man so $v$ direkt erhält.'], a:0, ex:'$Av = \\lambda v$ heißt $(A - \\lambda\\mathbb 1)v = 0$. Eine nichttriviale Lösung gibt es genau dann, wenn $\\det(A - \\lambda\\mathbb 1) = 0$.'}},
      {l:'(2 - λ)^2 - 1 = 0', why:{q:'Woher kommt diese Gleichung?', opts:['$\\det\\begin{pmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{pmatrix} = (2-\\lambda)^2 - 1\\cdot 1$', 'Man hat $A^2$ ausgerechnet.', 'Aus der Spur $2 + 2$.'], a:0, ex:'$\\lambda$ wird nur auf der Diagonale abgezogen, dann $ad - bc$.'}},
      {l:'λ^2 - 4λ + 3 = 0', why:{q:'Was steckt in den Koeffizienten $4$ und $3$?', opts:['Spur $= 4$ und Determinante $= 3$', 'Die Eigenwerte selbst.', 'Zufall.'], a:0, ex:'Für jede $2\\times2$-Matrix gilt $\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = 0$.'}},
      {l:'(λ - 1)(λ - 3) = 0', why:{q:'Wie kontrollierst du die Faktorisierung schnell?', opts:['$1 + 3 = 4 = \\operatorname{tr}A$ und $1\\cdot 3 = 3 = \\det A$', 'Man prüft, ob beide Eigenwerte positiv sind.', 'Gar nicht.'], a:0, ex:'Summe der Eigenwerte = Spur, Produkt = Determinante.'}},
      {l:'λ = 3', w:'größerer Eigenwert; der andere ist λ = 1', why:{q:'Warum sind beide Eigenwerte reell?', opts:['$A$ ist reell und symmetrisch, also hermitesch.', 'Weil alle Einträge positiv sind.', 'Weil die Determinante positiv ist.'], a:0, ex:'Hermitesche Matrizen haben reelle Eigenwerte – egal ob die Einträge positiv, negativ oder komplex sind.'}},
      {l:'A (1; 1) = (3; 3)', why:{q:'Wie findet man diesen Eigenvektor?', opts:['Aus $(A - 3\\mathbb 1)v = 0$: $-v_1 + v_2 = 0$, also $v \\propto (1, 1)^T$.', 'Man rät irgendeinen Vektor.', 'Man nimmt die erste Spalte von $A$.'], a:0, ex:'Beide Zeilen von $A - 3\\mathbb 1 = \\begin{pmatrix}-1&1\\\\1&-1\\end{pmatrix}$ sagen dasselbe: $v_1 = v_2$.'}},
      {l:'= 3 (1; 1)', why:{q:'Was ist der normierte Eigenvektor?', opts:['$\\frac{1}{\\sqrt2}(1, 1)^T$', '$(1, 1)^T$', '$\\frac12(1, 1)^T$'], a:0, ex:'$\\|(1, 1)\\| = \\sqrt2$. Ein Eigenvektor ist nur bis auf einen Faktor festgelegt; normiert wird mit $v^\\dagger v = 1$.'}}
    ],
    faded:{id:'me-fade', title:'Jetzt du: $B = \\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}$', text:'Bestimme den größeren Eigenwert $\\mu$ von $B$. In der Eingabe heißt die Matrix `B`.',
      ctx:MAT({mats:{B:'(1, i; -i, 1)'}, unknowns:{μ:{ref:'2', alt:['0'], kind:'real'}}}),
      given:['det(B - μ I) = 0', '(1 - μ)^2 - i (-i) = 0'],
      goals:[{id:'a', prompt:'Bestimme $\\mu$.', type:'solve', unknown:'μ', hints:['$i\\cdot(-i) = -i^2 = 1$.', 'Das Polynom $\\mu^2 - 2\\mu$ lässt sich ausklammern.'],
        model:['det(B - μ I) = 0', '(1 - μ)^2 - i (-i) = 0', {l:'(1 - μ)^2 - 1 = 0', gap:'(1 - μ)^2 - ▢ = 0'}, 'μ^2 - 2μ = 0', 'μ (μ - 2) = 0', 'μ = 2'],
        mistakes:[{expr:'1 + i', msg:'$B$ ist hermitesch, also müssen die Eigenwerte reell sein. Prüfe $i\\cdot(-i)$: Das ist $+1$.'}]}]}
  },
  puzzle:{
    title:'Komplexe Einträge, reelle Eigenwerte?',
    text:'Die Matrix $M = \\begin{pmatrix}0 & -i\\\\ i & 0\\end{pmatrix}$ hat rein imaginäre Einträge.\n\nWas vermutest du über ihre Eigenwerte?',
    q:{q:'Deine Vermutung:', opts:['Sie sind rein imaginär, nämlich $\\pm i$.', 'Sie sind reell, nämlich $\\pm 1$.', 'Es gibt keine Eigenwerte.', 'Beide sind $0$.'], a:1, ex:'$\\det(M - \\lambda\\mathbb 1) = \\lambda^2 - (-i)(i) = \\lambda^2 - 1$, also $\\lambda = \\pm 1$.'},
    reveal:'Entscheidend ist nicht, ob die Einträge reell sind, sondern ob die Matrix **hermitesch** ist: $M^\\dagger = (M^T)^* = M$. Hier gilt $M_{12} = -i = (M_{21})^* = (i)^*$. Hermitesche Matrizen haben immer reelle Eigenwerte, und Eigenvektoren zu verschiedenen Eigenwerten stehen senkrecht aufeinander.\n\nDas ist der mathematische Kern der Quantenmechanik: Messgrößen werden durch hermitesche Operatoren dargestellt, deshalb sind Messwerte reell. Die Matrix ist übrigens die Pauli-Matrix $\\sigma_y$ (Thema 10).'
  },
  clarify:{
    core:'Eine $n\\times n$-Matrix $A$ ist eine **lineare Abbildung** $v \\mapsto Av$. Die **Adjungierte** ist $A^\\dagger = (A^T)^*$; sie erfüllt $\\langle u|Av\\rangle = \\langle A^\\dagger u|v\\rangle$. Zwei Klassen sind in der QM zentral:\n\n- **hermitesch:** $A^\\dagger = A$ (Messgrößen),\n- **unitär:** $U^\\dagger U = \\mathbb 1$ (Basiswechsel, Zeitentwicklung; Normen bleiben erhalten).\n\n**Eigenwertproblem:** $Av = \\lambda v$ mit $v \\ne 0$. Die Eigenwerte sind die Nullstellen von $\\det(A - \\lambda\\mathbb 1)$; für $2\\times2$:\n\n$$\\lambda^2 - (\\operatorname{tr}A)\\,\\lambda + \\det A = 0.$$\n\nHermitesche Matrizen haben reelle Eigenwerte, und ihre normierten Eigenvektoren lassen sich zu einer Orthonormalbasis wählen. Mit der unitären Matrix $U$ aus diesen Eigenvektoren gilt $A = UDU^\\dagger$ mit diagonalem $D$ – und damit $f(A) = U f(D) U^\\dagger$, etwa $e^{-iAt}$.',
    keys:[
      'Die Reihenfolge zählt: im Allgemeinen ist $AB \\ne BA$. Der **Kommutator** $[A,B] = AB - BA$ misst den Unterschied.',
      'Adjungieren heißt transponieren **und** konjugieren. Dabei dreht sich die Reihenfolge um: $(AB)^\\dagger = B^\\dagger A^\\dagger$.',
      'Kontrolle für Eigenwerte: Summe = Spur, Produkt = Determinante.',
      'Ein Eigenvektor ist nur bis auf einen Faktor bestimmt; normiere ihn mit $v^\\dagger v = 1$. Eine Phase $e^{i\\alpha}$ bleibt frei.',
      'Hat ein Eigenwert mehrere unabhängige Eigenvektoren, heißt er **entartet**; dann ist jede von null verschiedene Linearkombination wieder Eigenvektor.'
    ],
    errors:[
      'Beim Adjungieren nur transponieren und das Konjugieren vergessen (oder umgekehrt).',
      '$\\lambda$ von allen Einträgen abziehen statt nur von der Diagonale: richtig ist $A - \\lambda\\mathbb 1$.',
      'Vorzeichenfehler bei Produkten wie $(2i)(-2i) = -4i^2 = +4$.',
      '$e^{A+B} = e^Ae^B$ benutzen, obwohl $[A,B] \\ne 0$.'
    ],
    more:[{title:'Warum sind die Eigenwerte hermitescher Matrizen reell?', text:'Aus $Av = \\lambda v$ folgt $\\langle v|Av\\rangle = \\lambda\\langle v|v\\rangle$. Wegen $A = A^\\dagger$ ist aber auch $\\langle v|Av\\rangle = \\langle Av|v\\rangle = \\lambda^*\\langle v|v\\rangle$. Da $\\langle v|v\\rangle > 0$, folgt $\\lambda = \\lambda^*$. Genauso zeigt man für zwei Eigenvektoren zu $\\lambda_1 \\ne \\lambda_2$: $(\\lambda_1 - \\lambda_2)\\langle v_1|v_2\\rangle = 0$, also stehen sie senkrecht. Dasselbe Argument funktioniert für Operatoren auf Funktionen (M5, Thema 6).'}],
    checks:[
      {q:'Welche Matrix ist unitär?', opts:['$\\frac{1}{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$', '$\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$', '$\\begin{pmatrix}2&0\\\\0&1/2\\end{pmatrix}$'], a:0, ex:'Die Spalten $(1, 1)/\\sqrt2$ und $(1, -1)/\\sqrt2$ sind normiert und orthogonal, also $U^\\dagger U = \\mathbb 1$. Die anderen verändern Längen.'},
      {q:'Eine $2\\times2$-Matrix hat Spur $1$ und Determinante $-6$. Ihre Eigenwerte sind …', opts:['$3$ und $-2$', '$6$ und $-1$', '$1$ und $-6$'], a:0, ex:'$3 + (-2) = 1$ und $3\\cdot(-2) = -6$.'}
    ]
  },
  lab:{type:'eigen', title:'Was eine symmetrische Matrix mit dem Einheitskreis macht',
    text:'Die Matrix $A = \\begin{pmatrix}a&b\\\\b&d\\end{pmatrix}$ ist reell und symmetrisch, also hermitesch. Mit den Reglern stellst du $a$, $b$ und $d$ zwischen $-2$ und $2$ ein. Gezeichnet sind der Einheitskreis, sein Bild unter $A$ (eine Ellipse) und die Richtungen der beiden Eigenvektoren. Die Anzeige zeigt $\\lambda_\\pm = \\frac{a+d}{2} \\pm \\sqrt{\\left(\\frac{a-d}{2}\\right)^2 + b^2}$ sowie Spur und Determinante.',
    questions:[
      {q:'Stelle $a = d = 1$ ein und erhöhe $b$ langsam von $0$ aus. Was passiert mit den Eigenwerten?', opts:['Sie spalten symmetrisch auf: $\\lambda_\\pm = 1 \\pm b$.', 'Beide wachsen gleich stark.', 'Sie bleiben beide bei $1$.'], a:0, ex:'Für $a = d$ ist $\\lambda_\\pm = a \\pm |b|$, und die Eigenvektoren liegen auf den Diagonalen. So spaltet ein entartetes Niveau durch eine Kopplung auf (Thema 11).'},
      {q:'Stelle $a = d = b = 1$ ein. Was zeigen Anzeige und Bild?', opts:['$\\lambda_- = 0$ und $\\det A = 0$; die Ellipse ist zu einer Strecke zusammengefallen.', '$\\lambda_+ = \\lambda_- = 1$; das Bild ist ein Kreis.', 'Die Eigenvektoren stehen nicht mehr senkrecht.'], a:0, ex:'$\\det A = 1 - 1 = 0$: Die Richtung $(1, -1)$ wird auf null abgebildet. Die Eigenvektoren bleiben senkrecht – das gilt für jede symmetrische Matrix.'}
    ],
    noPic:{q:'Ohne Bild: Eine symmetrische $2\\times2$-Matrix hat Spur $4$ und Determinante $3$. Welche Eigenwerte hat sie?', opts:['$1$ und $3$', '$2$ und $2$', '$4$ und $3$'], a:0, ex:'Gesucht sind zwei Zahlen mit Summe $4$ und Produkt $3$.'}},
  compare:{
    text:'Gesucht ist $e^{i\\theta\\sigma_x}$ mit $\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ und reellem $\\theta$. Weg A rechnet die Matrix aus, Weg B wendet sie über die Eigenbasis auf $|{\\uparrow}\\rangle = (1, 0)^T$ an. Die Eigenvektoren von $\\sigma_x$ sind $|{\\pm x}\\rangle = (1, \\pm1)^T/\\sqrt2$ mit Eigenwerten $\\pm1$.',
    ctx:MAT({params:{θ:'real'}}),
    A:{name:'Potenzreihe mit $\\sigma_x^2 = \\mathbb 1$', model:[{l:'e^(i θ σ_x) = cos(θ) I + i sin(θ) σ_x', w:'gerade Potenzen → cos, ungerade → sin'}, '= (cos(θ), i sin(θ); i sin(θ), cos(θ))']},
    B:{name:'Über die Eigenbasis', model:[{l:'e^(i θ σ_x) |↑⟩ = 1/sqrt(2) (e^(i θ σ_x) |+x⟩ + e^(i θ σ_x) |-x⟩)', w:'|↑⟩ = (|+x⟩ + |−x⟩)/√2'}, {l:'= 1/sqrt(2) (e^(i θ) |+x⟩ + e^(-i θ) |-x⟩)', w:'σ_x|±x⟩ = ±|±x⟩'}, '= cos(θ) |↑⟩ + i sin(θ) |↓⟩']},
    questions:[
      {q:'Welcher Weg funktioniert für jede hermitesche Matrix?', opts:['Weg B: Diagonalisieren geht immer.', 'Weg A: Jede Matrix erfüllt $A^2 = \\mathbb 1$.', 'Keiner von beiden.'], a:0, ex:'Weg A nutzt den Sonderfall $\\sigma_x^2 = \\mathbb 1$. Über die Eigenbasis gilt allgemein $f(A)|n\\rangle = f(\\lambda_n)|n\\rangle$.'},
      {q:'Was ist $e^{i\\pi\\sigma_x}$?', opts:['$-\\mathbb 1$', '$\\mathbb 1$', '$i\\sigma_x$'], a:0, ex:'$\\cos\\pi\\,\\mathbb 1 + i\\sin\\pi\\,\\sigma_x = -\\mathbb 1$. Bei Spin ½ gibt eine Drehung um $2\\pi$ genau so einen Faktor $-1$.'}
    ]
  },
  practice:[
    {id:'me-p1', title:'Produkt, Kommutator, Adjungierte',
      text:'Pauli-Matrizen: $\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$, dazu $A = \\begin{pmatrix}1&2i\\\\3&4-i\\end{pmatrix}$. In der Eingabe: `σ_x`, Matrizen als `(1, 2i; 3, 4 - i)`, $A^\\dagger$ als `A†`.',
      ctx:MAT({mats:{A:'(1, 2i; 3, 4 - i)'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\sigma_x\\sigma_z$.', type:'value', target:'(0, -1; 1, 0)', points:2, ph:'σ_x σ_z = (0, 1; 1, 0)(1, 0; 0, -1)',
          hints:['Eintrag $(i,j)$ = Zeile $i$ der linken Matrix mal Spalte $j$ der rechten.'],
          model:['σ_x σ_z = (0, 1; 1, 0)(1, 0; 0, -1)', '= (0, -1; 1, 0)'],
          mistakes:[{expr:'(0, 1; -1, 0)', msg:'Das ist $\\sigma_z\\sigma_x$. Die Reihenfolge zählt: Die linke Matrix liefert die Zeilen.'}]},
        {id:'b', prompt:'b) Zeige $[\\sigma_x, \\sigma_z] = -2i\\,\\sigma_y$.', type:'show', from:'[σ_x, σ_z]', to:'-2i σ_y', points:3,
          hints:['$[\\sigma_x, \\sigma_z] = \\sigma_x\\sigma_z - \\sigma_z\\sigma_x$; $\\sigma_x\\sigma_z$ kennst du aus a).', '$-2i\\,\\sigma_y = \\begin{pmatrix}0&-2\\\\2&0\\end{pmatrix}$.'],
          model:['[σ_x, σ_z] = σ_x σ_z - σ_z σ_x', '= (0, -1; 1, 0) - (0, 1; -1, 0)', '= (0, -2; 2, 0)', '= -2i σ_y']},
        {id:'c', prompt:'c) Bestimme $A^\\dagger$.', type:'value', target:'(1, 3; -2i, 4 + i)', points:2, ph:'A† = ',
          hints:['Erst jeden Eintrag konjugieren, dann transponieren (Zeilen werden Spalten). Die Reihenfolge ist egal.'],
          model:[{l:'A^* = (1, -2i; 3, 4 + i)', w:'konjugiert'}, {l:'A† = (1, 3; -2i, 4 + i)', w:'transponiert'}],
          mistakes:[{expr:'(1, 3; 2i, 4 - i)', msg:'Nur transponiert. Zum Adjungieren gehört auch das Konjugieren: $(A^\\dagger)_{ij} = A_{ji}^*$.'}, {expr:'(1, -2i; 3, 4 + i)', msg:'Nur konjugiert. Es fehlt das Transponieren: $(A^\\dagger)_{ij} = A_{ji}^*$.'}]}
      ]},
    {id:'me-p2', title:'Eigenwerte und Eigenvektoren einer hermiteschen Matrix',
      text:'$M = \\begin{pmatrix}2 & 1-i\\\\ 1+i & 3\\end{pmatrix}$. Die Vektoren $v = \\begin{pmatrix}1-i\\\\2\\end{pmatrix}$ und $w = \\begin{pmatrix}1-i\\\\-1\\end{pmatrix}$ heißen in der Eingabe `v` und `w`. Zeilenvektoren schreibst du als `(a, b)`, Spaltenvektoren als `(a; b)`.',
      ctx:MAT({defs:{'M':'(2, 1 - i; 1 + i, 3)'}, states:{v:'(1 - i; 2)', w:'(1 - i; -1)'}, unknowns:{λ:{ref:'4', kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Stelle das charakteristische Polynom auf und bestimme den größeren Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:3, ph:'det(M - λ I) = 0',
          hints:['$\\det\\begin{pmatrix}a & b\\\\ c & d\\end{pmatrix} = ad - bc$, und $(1-i)(1+i) = 2$.', 'Das Polynom $\\lambda^2 - 5\\lambda + 4$ faktorisiert.'],
          model:['det(M - λ I) = 0', '(2 - λ)(3 - λ) - (1 - i)(1 + i) = 0', 'λ^2 - 5λ + 4 = 0', '(λ - 1)(λ - 4) = 0', 'λ = 4'],
          mistakes:[{expr:'1', msg:'$\\lambda = 1$ ist der kleinere Eigenwert. Gefragt ist der größere.'}, {expr:'3', msg:'Prüfe $(1-i)(1+i)$: Das ist $1 - i^2 = 2$, nicht $0$.'}, {expr:'(5 + sqrt(17))/2', msg:'Prüfe $(1-i)(1+i)$: Das ist $1 - i^2 = 2$, nicht $4$.'}, {expr:'(5 + i sqrt(7))/2', msg:'Prüfe $(1-i)(1+i)$: Das ist $1 - i^2 = 2$, nicht $-2$. Eine hermitesche Matrix hat außerdem nur reelle Eigenwerte.'}]},
        {id:'b', prompt:'b) Zeige, dass $v$ Eigenvektor zum Eigenwert $4$ ist.', type:'show', from:'M v', to:'4 v', points:2,
          hints:['Multipliziere zeilenweise: erste Zeile $2(1-i) + (1-i)\\cdot 2$.'],
          model:['M v = (2(1 - i) + 2(1 - i); (1 + i)(1 - i) + 6)', '= (4 - 4i; 8)', '= 4 v'],
          note:'Normiert: $v/\\sqrt6$, denn $|1-i|^2 + 4 = 6$.'},
        {id:'c', prompt:'c) $w$ ist Eigenvektor zum Eigenwert $1$. Berechne $\\langle v|w\\rangle$.', type:'value', target:'0', points:2, ph:'⟨v|w⟩ = (1 + i, 2)(1 - i; -1)',
          hints:['Das Bra $\\langle v|$ ist die konjugierte Zeile $(1+i,\\ 2)$.'],
          model:['⟨v|w⟩ = (1 + i, 2)(1 - i; -1)', '= (1 + i)(1 - i) - 2', '= 0'],
          mistakes:[{expr:'-2 - 2i', msg:'Im Bra muss konjugiert werden: $\\langle v| = (1+i,\\ 2)$, nicht $(1-i,\\ 2)$.'}],
          note:'Eigenvektoren einer hermiteschen Matrix zu verschiedenen Eigenwerten stehen senkrecht.'}
      ]},
    {id:'me-p3', title:'Eine Drehmatrix ist unitär',
      text:'$R = \\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}$ dreht Vektoren der Ebene um den Winkel $\\theta$ (hier $0 < \\theta < \\pi$). In der Eingabe heißt sie `R`.',
      ctx:MAT({params:{θ:{range:[0.3, 2.8]}}, mats:{R:'(cos(θ), -sin(θ); sin(θ), cos(θ))'}, unknowns:{λ:{ref:'e^(i θ)', kind:'complex'}}}),
      goals:[
        {id:'a', prompt:'a) Zeige $R^\\dagger R = \\mathbb 1$.', type:'show', from:'R† R', to:'I', points:2,
          hints:['$R$ ist reell, also ist $R^\\dagger = R^T$.', '$\\cos^2\\theta + \\sin^2\\theta = 1$.'],
          model:['R† R = (cos(θ), sin(θ); -sin(θ), cos(θ))(cos(θ), -sin(θ); sin(θ), cos(θ))', '= (cos(θ)^2 + sin(θ)^2, 0; 0, sin(θ)^2 + cos(θ)^2)', '= I']},
        {id:'b', prompt:'b) Bestimme den Eigenwert $\\lambda$ mit positivem Imaginärteil.', type:'solve', unknown:'λ', points:3, ph:'det(R - λ I) = 0',
          hints:['$\\det(R - \\lambda\\mathbb 1) = (\\cos\\theta - \\lambda)^2 + \\sin^2\\theta$.', 'Mitternachtsformel: $\\lambda = \\cos\\theta \\pm\\sqrt{\\cos^2\\theta - 1} = \\cos\\theta \\pm i\\sin\\theta$.'],
          model:['det(R - λ I) = 0', '(cos(θ) - λ)^2 + sin(θ)^2 = 0', 'λ^2 - 2cos(θ) λ + 1 = 0', 'λ = cos(θ) + i sin(θ)', '= e^(i θ)'],
          mistakes:[{expr:'e^(-i θ)', msg:'Das ist der zweite Eigenwert $e^{-i\\theta}$ mit negativem Imaginärteil. Gefragt ist der mit positivem.'}],
          note:'Eine echte Drehung der Ebene ($0 < \\theta < \\pi$) lässt keine reelle Richtung fest, deshalb sind die Eigenwerte komplex. $R$ ist unitär, aber nicht hermitesch.'},
        {id:'c', prompt:'c) Berechne $|\\lambda|^2 = \\lambda^*\\lambda$.', type:'value', target:'1', points:2,
          hints:['$(\\cos\\theta - i\\sin\\theta)(\\cos\\theta + i\\sin\\theta)$'],
          model:['|λ|^2 = (cos(θ) - i sin(θ))(cos(θ) + i sin(θ))', '= cos(θ)^2 + sin(θ)^2', '= 1'],
          note:'Das gilt für jede unitäre Matrix: Aus $Uv = \\lambda v$ folgt $\\|v\\| = \\|Uv\\| = |\\lambda|\\,\\|v\\|$.'}
      ]},
    {id:'me-p4', title:'Zwei-Niveau-System: diagonalisieren und Zeitentwicklung',
      text:'Ein Teilchen in einer Doppelmulde wird näherungsweise durch $H = \\begin{pmatrix}E_0 & -\\Delta\\\\ -\\Delta & E_0\\end{pmatrix}$ beschrieben ($E_0, \\Delta > 0$), in der Basis $|L\\rangle = (1, 0)^T$ (links) und $|R\\rangle = (0, 1)^T$ (rechts). In der Eingabe heißt die Matrix `H`, die Einheitsmatrix `I`.',
      ctx:MAT({params:{E_0:'pos', Δ:'pos'}, mats:{H:'(E_0, -Δ; -Δ, E_0)'}, unknowns:{E:{ref:'E_0 + Δ', kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme den größeren Eigenwert $E$.', type:'solve', unknown:'E', points:2, ph:'det(H - E I) = 0',
          hints:['$\\det(H - E\\mathbb 1) = (E_0 - E)^2 - \\Delta^2$.', 'Aus $u^2 = \\Delta^2$ folgt $u = \\pm\\Delta$.'],
          model:['det(H - E I) = 0', '(E_0 - E)^2 - Δ^2 = 0', 'E_0 - E = -Δ', 'E = E_0 + Δ'],
          mistakes:[{expr:'E_0 - Δ', msg:'Das ist der kleinere Eigenwert. Gefragt ist der größere.'}]},
        {id:'b', prompt:'b) Zeige, dass $\\frac{1}{\\sqrt2}(1, -1)^T$ Eigenvektor zu $E_0 + \\Delta$ ist.', type:'show', from:'H (1; -1)/sqrt(2)', to:'(E_0 + Δ) (1; -1)/sqrt(2)', points:2,
          model:['H (1; -1)/sqrt(2) = (E_0 + Δ; -Δ - E_0)/sqrt(2)', '= (E_0 + Δ) (1; -1)/sqrt(2)'],
          note:'Der andere Eigenvektor ist $\\frac{1}{\\sqrt2}(1, 1)^T$ zu $E_0 - \\Delta$: Die symmetrische Kombination liegt energetisch tiefer.'},
        {id:'c', prompt:'c) Berechne $\\det H$ und vergleiche mit dem Produkt der Eigenwerte.', type:'value', target:'E_0^2 - Δ^2', points:1,
          model:['det(H) = E_0 · E_0 - (-Δ)(-Δ)', '= E_0^2 - Δ^2'],
          note:'$(E_0 + \\Delta)(E_0 - \\Delta) = E_0^2 - \\Delta^2$ ✓'},
        {id:'d', prompt:'d) Berechne den Zeitentwicklungsoperator $e^{-iHt/\\hbar}$ als Matrix.', type:'value', target:'e^(-i E_0 t/ħ) (cos(Δ t/ħ), i sin(Δ t/ħ); i sin(Δ t/ħ), cos(Δ t/ħ))', points:3, ph:'e^(-i H t/ħ) = ',
          hints:['Schreibe $H = E_0\\mathbb 1 - \\Delta\\,\\sigma_x$. Weil $\\mathbb 1$ mit allem vertauscht, gilt $e^{-iHt/\\hbar} = e^{-iE_0t/\\hbar}\\,e^{i\\Delta t\\sigma_x/\\hbar}$.', 'Mit $\\sigma_x^2 = \\mathbb 1$: $e^{i\\alpha\\sigma_x} = \\cos\\alpha\\,\\mathbb 1 + i\\sin\\alpha\\,\\sigma_x$.'],
          model:[{l:'e^(-i H t/ħ) = e^(-i E_0 t/ħ) e^(i Δ t σ_x/ħ)', w:'H = E₀𝟙 − Δσ_x, und 𝟙 vertauscht mit σ_x'}, '= e^(-i E_0 t/ħ) (cos(Δ t/ħ) I + i sin(Δ t/ħ) σ_x)', '= e^(-i E_0 t/ħ) (cos(Δ t/ħ), i sin(Δ t/ħ); i sin(Δ t/ħ), cos(Δ t/ħ))'],
          mistakes:[{expr:'e^(-i E_0 t/ħ) (cos(Δ t/ħ), -i sin(Δ t/ħ); -i sin(Δ t/ħ), cos(Δ t/ħ))', msg:'Vorzeichen: Wegen $H = E_0\\mathbb 1 - \\Delta\\sigma_x$ steht im Exponenten $+i\\Delta t\\sigma_x/\\hbar$.'}, {expr:'(e^(-i E_0 t/ħ), e^(i Δ t/ħ); e^(i Δ t/ħ), e^(-i E_0 t/ħ))', msg:'Die Exponentialfunktion einer Matrix ist nicht die Exponentialfunktion der einzelnen Einträge. Diagonalisiere oder benutze $\\sigma_x^2 = \\mathbb 1$.'}],
          note:'Startet das Teilchen links, $|L\\rangle = (1, 0)^T$, ist die Wahrscheinlichkeit rechts $\\sin^2(\\Delta t/\\hbar)$: Es tunnelt periodisch hin und her.'}
      ]}
  ],
  final:[
    {q:'Eine $2\\times2$-Matrix hat Spur $5$ und Determinante $6$. Welche Eigenwerte hat sie?', opts:['$2$ und $3$', '$1$ und $6$', '$5$ und $6$'], a:0, ex:'Summe $5$, Produkt $6$: $\\lambda^2 - 5\\lambda + 6 = (\\lambda - 2)(\\lambda - 3)$.'},
    {task:{id:'me-f1', title:'Eigenwerte', text:'$N = \\begin{pmatrix}1&1\\\\1&1\\end{pmatrix}$, in der Eingabe `N`.',
      ctx:MAT({mats:{N:'(1, 1; 1, 1)'}, unknowns:{λ:{ref:'2', kind:'real'}}}),
      goals:[{id:'a', prompt:'Bestimme den größeren Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:2, model:['det(N - λ I) = 0', '(1 - λ)^2 - 1 = 0', 'λ (λ - 2) = 0', 'λ = 2']}]}},
    {q:'Welche Aussage gilt für jede unitäre Matrix $U$?', opts:['$\\|Uv\\| = \\|v\\|$ für alle $v$, und alle Eigenwerte haben Betrag $1$.', 'Alle Eigenwerte sind reell.', '$U = U^\\dagger$'], a:0, ex:'$\\langle Uv|Uv\\rangle = \\langle v|U^\\dagger U v\\rangle = \\langle v|v\\rangle$. Reelle Eigenwerte hat man bei hermiteschen Matrizen.'},
    {task:{id:'me-f2', title:'Kommutator', text:'Pauli-Matrizen wie in Aufgabe 1 (`σ_x`, `σ_y`, `σ_z`).',
      ctx:MAT({}),
      goals:[{id:'a', prompt:'Zeige $[\\sigma_y, \\sigma_z] = 2i\\,\\sigma_x$.', type:'show', from:'[σ_y, σ_z]', to:'2i σ_x', points:3, model:['[σ_y, σ_z] = σ_y σ_z - σ_z σ_y', '= (0, i; i, 0) - (0, -i; -i, 0)', '= (0, 2i; 2i, 0)', '= 2i σ_x']}]}}
  ],
  errors:[
    {id:'me-e1', title:'Vorzeichenfehler im charakteristischen Polynom',
      text:'Gesucht sind die Eigenwerte von $A = \\begin{pmatrix}1&2i\\\\-2i&1\\end{pmatrix}$. So wurde gerechnet:',
      ctx:MAT({mats:{A:'(1, 2i; -2i, 1)'}, unknowns:{λ:{ref:'3', kind:'real'}}}),
      lines:['det(A - λ I) = 0', '(1 - λ)^2 + 4 = 0', '1 - λ = 2i', 'λ = 1 - 2i'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['$(2i)(-2i) = -4i^2 = +4$; abgezogen ergibt das $(1-\\lambda)^2 - 4$.', 'Die Determinante einer $2\\times2$-Matrix ist $ad + bc$.', '$\\lambda$ muss auch von den Nebendiagonalen abgezogen werden.'], a:0, ex:'$\\det(A - \\lambda\\mathbb 1) = (1-\\lambda)^2 - (2i)(-2i) = (1-\\lambda)^2 - 4$. Ein Warnsignal: $A$ ist hermitesch, ein komplexer Eigenwert wie $1 - 2i$ ist also unmöglich.'},
      fix:{id:'a', prompt:'Berichtige und bestimme den größeren Eigenwert.', type:'solve', unknown:'λ', model:['det(A - λ I) = 0', '(1 - λ)^2 - 4 = 0', '1 - λ = -2', 'λ = 3']}},
    {id:'me-e2', title:'Adjungieren ohne Konjugieren',
      text:'Ist $U = \\frac{1}{\\sqrt2}\\begin{pmatrix}1&i\\\\i&1\\end{pmatrix}$ unitär? Eine Kommilitonin rechnet:',
      ctx:MAT({mats:{U:'(1, i; i, 1)/sqrt(2)'}}),
      lines:['U† = (1, i; i, 1)/sqrt(2)', 'U† U = 1/2 (1, i; i, 1)(1, i; i, 1)', '= 1/2 (0, 2i; 2i, 0)'],
      wrong:0,
      why:{q:'Was ist schon in Zeile 1 falsch?', opts:['$U$ ist symmetrisch, aber $U^\\dagger$ verlangt zusätzlich das Konjugieren: $U^\\dagger = \\frac{1}{\\sqrt2}\\begin{pmatrix}1&-i\\\\-i&1\\end{pmatrix}$.', 'Der Vorfaktor $1/\\sqrt2$ muss beim Adjungieren wegfallen.', 'Nichts, erst Zeile 3 ist falsch.'], a:0, ex:'Für komplexe Matrizen ist $U^\\dagger = (U^T)^* \\ne U^T$. Mit dem richtigen $U^\\dagger$ ergibt sich $U^\\dagger U = \\mathbb 1$: $U$ ist unitär.'},
      fix:{id:'a', prompt:'Berichtige: Zeige $U^\\dagger U = \\mathbb 1$.', type:'show', from:'U† U', to:'I', model:['U† U = 1/2 (1, -i; -i, 1)(1, i; i, 1)', '= 1/2 (2, 0; 0, 2)', '= I']}}
  ]
});
lexe('adjungierte', 'Adjungierte Matrix', '$A^\\dagger = (A^T)^*$, also $(A^\\dagger)_{ij} = A_{ji}^*$. Regeln: $(AB)^\\dagger = B^\\dagger A^\\dagger$, $(cA)^\\dagger = c^*A^\\dagger$, $(A^\\dagger)^\\dagger = A$. Kennzeichnend ist $\\langle u|Av\\rangle = \\langle A^\\dagger u|v\\rangle$ für alle $u, v$. Ein Ket (Spalte) wird durch Adjungieren zum Bra (konjugierte Zeile): $\\langle v| = |v\\rangle^\\dagger$.', {topic:'m-eigen'});
lexe('unitaer', 'Unitäre Matrix', '$U^\\dagger U = UU^\\dagger = \\mathbb 1$, also $U^{-1} = U^\\dagger$. Unitäre Matrizen erhalten Skalarprodukte und Normen: $\\langle Uu|Uv\\rangle = \\langle u|v\\rangle$. Ihre Eigenwerte haben Betrag $1$, ihre Spalten bilden eine Orthonormalbasis. Beispiele: Drehmatrizen, Basiswechsel zwischen Orthonormalbasen, die Zeitentwicklung $e^{-iHt/\\hbar}$ mit hermiteschem $H$.', {topic:'m-eigen'});
lexe('eigenwertproblem', 'Eigenwerte und Eigenvektoren', '$Av = \\lambda v$ mit $v \\ne 0$. Eigenwerte aus $\\det(A - \\lambda\\mathbb 1) = 0$, dann Eigenvektoren aus $(A - \\lambda\\mathbb 1)v = 0$. Eigenvektoren sind nur bis auf einen Faktor festgelegt; in der QM normiert man sie ($v^\\dagger v = 1$). Ein Eigenwert mit mehreren linear unabhängigen Eigenvektoren heißt **entartet**. Hermitesche Matrizen: reelle Eigenwerte, orthogonale Eigenvektoren.', {topic:'m-eigen'});
lexe('charakteristisches-polynom', 'Charakteristisches Polynom', '$p(\\lambda) = \\det(A - \\lambda\\mathbb 1)$; seine Nullstellen sind die Eigenwerte. Für $2\\times2$: $p(\\lambda) = \\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A$. Für eine hermitesche Matrix $\\begin{pmatrix}a&b\\\\b^*&d\\end{pmatrix}$ mit reellen $a, d$: $\\lambda_\\pm = \\frac{a+d}{2} \\pm \\sqrt{\\left(\\frac{a-d}{2}\\right)^2 + |b|^2}$.', {topic:'m-eigen'});
lexe('diagonalisierung', 'Diagonalisierung (Spektralsatz)', 'Jede hermitesche Matrix lässt sich unitär diagonalisieren: $A = UDU^\\dagger$ mit reeller Diagonalmatrix $D = \\operatorname{diag}(\\lambda_1, \\dots, \\lambda_n)$; die Spalten von $U$ sind die normierten Eigenvektoren. Gleichwertig: $A = \\sum_n\\lambda_n|n\\rangle\\langle n|$ (Spektralzerlegung). Vertauschende hermitesche Matrizen haben eine gemeinsame Eigenbasis.', {topic:'m-eigen'});
lexe('spur-determinante', 'Spur und Determinante', '$\\operatorname{tr}A = \\sum_i A_{ii} = \\sum_n\\lambda_n$ und $\\det A = \\prod_n\\lambda_n$. Beide hängen nicht von der Basis ab und sind ein schneller Test für ausgerechnete Eigenwerte. Außerdem gilt $\\operatorname{tr}(AB) = \\operatorname{tr}(BA)$; deshalb hat jeder Kommutator von Matrizen die Spur null.', {topic:'m-eigen'});
lexe('matrixfunktion', 'Funktionen von Matrizen', 'Definiert über die Potenzreihe, z. B. $e^A = \\sum_{k=0}^\\infty A^k/k!$. Für diagonalisierbares $A = UDU^\\dagger$ gilt $f(A) = U f(D)U^\\dagger$: $f$ wirkt auf die Eigenwerte, $f(A)|n\\rangle = f(\\lambda_n)|n\\rangle$. Mit $\\sigma^2 = \\mathbb 1$: $e^{i\\theta\\sigma} = \\cos\\theta\\,\\mathbb 1 + i\\sin\\theta\\,\\sigma$. Achtung: $e^{A+B} = e^Ae^B$ ist für $[A,B] = 0$ garantiert, im Allgemeinen aber falsch.', {topic:'m-eigen'});
})();
