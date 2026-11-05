/* ===== Thema 10: Spin ½ ===== */
const SPIN = extra => Object.assign({rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}}, extra || {});
topic({
  id:'spin', math:['m-eigen', 'm-komplex'], title:'Spin ½', short:'Spin',
  src:'Griffiths & Schroeter Kap. 4.4 · Sakurai & Napolitano Kap. 1 · Nolting 5/2',
  goals:[
    'Ich kann mit Spinoren und den Matrizen $\\hat S_i = \\frac\\hbar2\\sigma_i$ rechnen und Eigenzustände von $\\hat S_x$, $\\hat S_y$, $\\hat S_z$ angeben.',
    'Ich kann Messwahrscheinlichkeiten $|\\langle\\pm|\\chi\\rangle|^2$ und Erwartungswerte berechnen, auch für Folgen von Stern-Gerlach-Messungen.',
    'Ich kann die Zeitentwicklung im Magnetfeld (Larmor-Präzession) mit $e^{-i\\hat Ht/\\hbar}$ berechnen.'
  ],
  needs:'Matrizen multiplizieren, Eigenwerte von $2\\times2$-Matrizen · Dirac-Notation $\\langle\\varphi|\\psi\\rangle$ · Messpostulat',
  check:[
    {q:'Welche Eigenwerte hat die Matrix $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$?', opts:['$+1$ und $-1$', '$0$ und $1$', '$1$ (doppelt)'], a:0, ex:'$\\det\\begin{pmatrix}-\\lambda&1\\\\1&-\\lambda\\end{pmatrix} = \\lambda^2 - 1 = 0$.', prev:'m-eigen'},
    {q:'Für $|\\psi\\rangle = \\binom{a}{b}$ und $|\\varphi\\rangle = \\binom{c}{d}$ ist $\\langle\\varphi|\\psi\\rangle = $', opts:['$c^*a + d^*b$', '$ca + db$', '$a^*c + b^*d$'], a:0, ex:'Das Bra enthält die konjugierten Komponenten des Kets: $\\langle\\varphi| = (c^*, d^*)$.', prev:'form'},
    {q:'Ein Zustand ist $|\\chi\\rangle = \\sum_n c_n|a_n\\rangle$ (normiert, $|a_n\\rangle$ Eigenzustände von $\\hat A$). Mit welcher Wahrscheinlichkeit misst man $a_2$?', opts:['$|c_2|^2$', '$c_2$', '$|c_2|$'], a:0, ex:'Bornsche Regel: $P(a_n) = |\\langle a_n|\\chi\\rangle|^2 = |c_n|^2$.', prev:'form'},
    {q:'Welche Vertauschungsrelation gilt für Drehimpulse?', opts:['$[\\hat L_x, \\hat L_y] = i\\hbar\\hat L_z$', '$[\\hat L_x, \\hat L_y] = 0$', '$[\\hat L_x, \\hat L_y] = \\hbar\\hat L_z$'], a:0, ex:'Und zyklisch. Der Spin erfüllt dieselben Relationen.', prev:'dreh'}
  ],
  example:{
    title:'Wahrscheinlichkeit für $S_y = +\\hbar/2$',
    text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt3}\\left(|\\uparrow\\rangle + \\sqrt2\\,i\\,|\\downarrow\\rangle\\right)$. Mit welcher Wahrscheinlichkeit ergibt eine Messung von $S_y$ den Wert $+\\hbar/2$? Es gilt $|{+y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{i}$.',
    ctx:SPIN({states:{χ:'1/sqrt(3)(|↑⟩ + sqrt(2) i|↓⟩)'}, state:'χ'}),
    lines:[
      {l:'P = |⟨+y|χ⟩|^2', why:{q:'Warum diese Formel?', opts:['Messwahrscheinlichkeit = Betragsquadrat der Projektion auf den Eigenzustand zum Messwert.', 'Weil $\\langle S_y\\rangle = P$ ist.', 'Weil $|{+y}\\rangle$ normiert ist.'], a:0, ex:'Bornsche Regel: $P(+\\hbar/2) = |\\langle{+y}|\\chi\\rangle|^2$.'}},
      {l:'= |1/sqrt(2) (1, -i) · 1/sqrt(3) (1; sqrt(2) i)|^2', why:{q:'Warum steht im Bra $(1, -i)$ und nicht $(1, i)$?', opts:['Das Bra enthält die komplex konjugierten Komponenten des Kets.', 'Das ist eine Konvention von Stern und Gerlach.', 'Weil $S_y$ ein Minuszeichen hat.'], a:0, ex:'$\\langle{+y}| = (|{+y}\\rangle)^\\dagger = \\frac{1}{\\sqrt2}(1, -i)$.'}},
      {l:'= |(1 + sqrt(2))/sqrt(6)|^2', why:{q:'Woher kommt $1 + \\sqrt2$?', opts:['$1\\cdot1 + (-i)(\\sqrt2\\,i) = 1 + \\sqrt2$', '$1 + i\\sqrt2$', '$1 - \\sqrt2$'], a:0, ex:'$(-i)\\cdot i = -i^2 = 1$.'}},
      {l:'= (3 + 2 sqrt(2))/6', why:{q:'Ist das Ergebnis plausibel?', opts:['Ja, es liegt zwischen 0 und 1 (etwa 0,97).', 'Nein, Wahrscheinlichkeiten für Spin sind immer 1/2.', 'Nein, es müsste negativ sein.'], a:0, ex:'$(1+\\sqrt2)^2 = 3 + 2\\sqrt2$; geteilt durch 6 ergibt $\\approx 0{,}971$. Der Zustand liegt nahe bei $|{+y}\\rangle$.'}}
    ],
    faded:{id:'spin-fade', title:'Jetzt du: Wahrscheinlichkeit für $S_x = +\\hbar/2$', text:'Gleicher Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt3}(|\\uparrow\\rangle + \\sqrt2\\,i|\\downarrow\\rangle)$, jetzt mit $|{+x}\\rangle = \\frac{1}{\\sqrt2}\\binom11$.',
      ctx:SPIN({states:{χ:'1/sqrt(3)(|↑⟩ + sqrt(2) i|↓⟩)'}, state:'χ'}),
      given:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(3) (1; sqrt(2) i)|^2'],
      goals:[{id:'a', prompt:'Berechne $P(S_x = +\\hbar/2)$.', type:'value', target:'1/2', hints:['Das Skalarprodukt ist $(1 + \\sqrt2\\,i)/\\sqrt6$.', '$|1 + \\sqrt2\\,i|^2 = 1 + 2$.'],
        model:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(3) (1; sqrt(2) i)|^2', {l:'= |1 + sqrt(2) i|^2/6', gap:'= |▢|^2/6'}, '= 1/2']}]}
  },
  puzzle:{
    title:'Drei Magnete hintereinander',
    text:'Ein Strahl von Teilchen mit Spin ½ geht durch einen Stern-Gerlach-Magneten in $z$-Richtung. Nur der Teilstrahl $\\uparrow$ geht weiter, in einen Magneten in $x$-Richtung. Davon geht nur der Teilstrahl $+x$ weiter, wieder in einen Magneten in $z$-Richtung.\n\nWelcher Anteil der Teilchen, die den $x$-Magneten im Kanal $+x$ verlassen, landet im letzten Magneten im Kanal $\\downarrow$?',
    q:{q:'Deine Vermutung:', opts:['$0$ – sie waren ja schon als $\\uparrow$ ausgesucht', '$1/2$', '$1/4$', '$1$'], a:1, ex:'Die $x$-Messung präpariert $|{+x}\\rangle$ neu.'},
    reveal:'Nach dem $x$-Magneten ist der Zustand $|{+x}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle + |\\downarrow\\rangle)$ – die frühere $z$-Information ist weg. Also $P(\\downarrow) = |\\langle\\downarrow|{+x}\\rangle|^2 = \\tfrac12$.\n\nBezogen auf alle Teilchen, die den ersten Magneten im Kanal $\\uparrow$ verlassen, sind es $\\tfrac12\\cdot\\tfrac12 = \\tfrac14$. Der Grund: $\\hat S_x$ und $\\hat S_z$ vertauschen nicht; es gibt keinen Zustand, der für beide einen festen Wert hat.'
  },
  clarify:{
    core:'Der Spin eines Elektrons lebt in einem zweidimensionalen Hilbertraum mit Basis $|\\uparrow\\rangle = \\binom10$, $|\\downarrow\\rangle = \\binom01$. Die Operatoren sind $\\hat S_i = \\frac\\hbar2\\sigma_i$ mit den Pauli-Matrizen\n\n$$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\quad \\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix},\\quad \\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}.$$\n\nJede Komponente hat die Messwerte $\\pm\\hbar/2$; $\\hat S^2 = \\frac34\\hbar^2$. Ein allgemeiner Zustand ist $|\\chi\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ – ein Punkt auf der Bloch-Kugel.',
    keys:[
      'Eigenzustände: $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle \\pm |\\downarrow\\rangle)$, $|{\\pm y}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle \\pm i|\\downarrow\\rangle)$.',
      'Wahrscheinlichkeit: $P(\\pm\\hbar/2) = |\\langle\\pm n|\\chi\\rangle|^2$; im Bra stehen die konjugierten Komponenten.',
      '$[\\hat S_x, \\hat S_y] = i\\hbar\\hat S_z$ (zyklisch) und $\\sigma_i^2 = \\mathbb 1$, $\\sigma_x\\sigma_y = i\\sigma_z$.',
      'Nur relative Phasen zählen: $e^{i\\alpha}|\\chi\\rangle$ ist derselbe Zustand, $|\\uparrow\\rangle + |\\downarrow\\rangle$ und $|\\uparrow\\rangle - |\\downarrow\\rangle$ sind verschieden.',
      'Im Feld $B\\hat z$: $\\hat H = \\omega\\hat S_z$; der Spin präzediert mit $\\omega$ um die $z$-Achse: $\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t$ für den Start $|{+x}\\rangle$.'
    ],
    errors:[
      'Im Bra die Komponenten nicht konjugieren – bei $|{\\pm y}\\rangle$ ergibt das falsche Wahrscheinlichkeiten.',
      '$\\langle S_x\\rangle$ für einen Messwert halten: Gemessen wird immer $\\pm\\hbar/2$, der Mittelwert liegt dazwischen.',
      '$\\sigma_i$ und $\\hat S_i$ verwechseln: Der Faktor $\\hbar/2$ fehlt dann in jedem Ergebnis.',
      'Glauben, nach einer $x$-Messung sei die frühere $z$-Information noch vorhanden.'
    ],
    more:[{title:'Spin im Magnetfeld', text:'Das magnetische Moment ist $\\hat{\\boldsymbol\\mu} = \\gamma\\hat{\\mathbf S}$ (für das Elektron $\\gamma \\approx -e/m_e$). Im Feld $B\\hat z$ ist $\\hat H = -\\gamma B\\hat S_z = \\omega\\hat S_z$ mit $\\omega = -\\gamma B$. Ein inhomogenes Feld lenkt die beiden Spinzustände verschieden ab – das ist der Stern-Gerlach-Versuch.'}],
    checks:[
      {q:'Welchen Wert hat $\\langle S_z\\rangle$ im Zustand $|{+x}\\rangle$?', opts:['$0$', '$+\\hbar/2$', '$\\hbar/\\sqrt2$'], a:0, ex:'$P(\\uparrow) = P(\\downarrow) = \\tfrac12$, also $\\langle S_z\\rangle = \\frac\\hbar2\\cdot\\frac12 - \\frac\\hbar2\\cdot\\frac12 = 0$.'},
      {q:'Was ist $\\sigma_y^2$?', opts:['$\\mathbb 1$', '$-\\mathbb 1$', '$0$'], a:0, ex:'Für jede Pauli-Matrix gilt $\\sigma_i^2 = \\mathbb 1$ – passend zu den Eigenwerten $\\pm1$.'}
    ]
  },
  lab:{type:'spin', title:'Bloch-Kugel und Stern-Gerlach',
    text:'Der Zustand $\\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ ist ein Pfeil auf der Kugel. Die Balken zeigen die Wahrscheinlichkeiten für die Messwerte $+\\hbar/2$ in $z$, $x$ und $y$. Mit den Knöpfen schickst du 100 Teilchen durch einen Magneten.',
    questions:[
      {q:'Stelle $\\theta = \\pi/2$ (≈ 1,57), $\\varphi = 0$ ein. Welcher Zustand ist das?', opts:['$|{+x}\\rangle$', '$|\\uparrow\\rangle$', '$|{+y}\\rangle$'], a:0, ex:'$\\cos\\frac\\pi4|\\uparrow\\rangle + \\sin\\frac\\pi4|\\downarrow\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle + |\\downarrow\\rangle)$. Dann ist $P(+x) = 1$ und $P(\\uparrow z) = \\tfrac12$.'},
      {q:'Jetzt $\\theta = \\pi/2$, $\\varphi = \\pi/2$. Was zeigt der Magnet in $x$-Richtung nach 100 Teilchen ungefähr?', opts:['etwa 50 × + und 50 × −', '100 × +', '100 × −'], a:0, ex:'Das ist $|{+y}\\rangle$ mit $P(+x) = \\tfrac12$. Die genauen Zahlen schwanken zufällig um 50.'}
    ],
    noPic:{q:'Ohne Bild: Der Spin ist im Zustand $|{-y}\\rangle$. Mit welcher Wahrscheinlichkeit misst man $S_z = +\\hbar/2$?', opts:['$1/2$', '$0$', '$1$'], a:0, ex:'$|\\langle\\uparrow|{-y}\\rangle|^2 = |1/\\sqrt2|^2 = 1/2$.'}},
  compare:{
    text:'Gesucht ist $\\langle S_x\\rangle$ für $|\\chi\\rangle = \\frac{1}{\\sqrt5}(2|\\uparrow\\rangle + |\\downarrow\\rangle)$. Zwei richtige Wege:',
    ctx:SPIN({states:{χ:'1/sqrt(5)(2|↑⟩ + |↓⟩)'}, state:'χ'}),
    A:{name:'Über die Wahrscheinlichkeiten', text:'$|\\langle{\\pm x}|\\chi\\rangle|^2 = |2 \\pm 1|^2/10$.', model:['⟨S_x⟩ = ħ/2 |⟨+x|χ⟩|^2 - ħ/2 |⟨-x|χ⟩|^2', '= ħ/2 · 9/10 - ħ/2 · 1/10', '= 2ħ/5']},
    B:{name:'Mit der Matrix', model:['⟨S_x⟩ = ⟨χ|S_x|χ⟩', '= ħ/2 · 1/5 (2, 1)(0, 1; 1, 0)(2; 1)', '= ħ/2 · 4/5', '= 2ħ/5']},
    questions:[
      {q:'Wann ist Weg A bequemer?', opts:['wenn man die Wahrscheinlichkeiten ohnehin braucht oder die Eigenzustände kennt', 'immer, weil er keine Matrizen braucht', 'nie'], a:0, ex:'Weg A liefert nebenbei die Verteilung der Messwerte. Weg B braucht keine Eigenzustände und funktioniert für jeden Operator.'},
      {q:'Für welchen Operator wäre Weg B deutlich einfacher als Weg A?', opts:['für $\\hat S_{\\hat n}$ in einer schrägen Richtung, deren Eigenzustände man erst ausrechnen müsste', 'für $\\hat S_z$', 'für keinen'], a:0, ex:'$\\langle\\chi|\\hat S_{\\hat n}|\\chi\\rangle$ braucht nur eine Matrixmultiplikation.'}
    ]
  },
  practice:[
    {id:'spin-p1', title:'Eigenzustände von $\\hat S_x$',
      text:'$\\hat S_x = \\frac\\hbar2\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{\\pm1}$.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\hat S_x|{+x}\\rangle = \\frac\\hbar2|{+x}\\rangle$.', type:'show', from:'S_x |+x⟩', to:'ħ/2 |+x⟩', points:2, ph:'S_x |+x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; 1)',
          hints:['Schreib $\\hat S_x$ als Matrix und $|{+x}\\rangle$ als Spalte.'],
          model:['S_x |+x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; 1)', '= ħ/2 · 1/sqrt(2) (1; 1)', '= ħ/2 |+x⟩']},
        {id:'b', prompt:'b) Zeige $\\hat S_x|{-x}\\rangle = -\\frac\\hbar2|{-x}\\rangle$.', type:'show', from:'S_x |-x⟩', to:'-ħ/2 |-x⟩', points:2,
          model:['S_x |-x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; -1)', '= ħ/2 · 1/sqrt(2) (-1; 1)', '= -ħ/2 |-x⟩']}
      ]},
    {id:'spin-p2', title:'Normieren, messen, mitteln',
      text:'Der Spin ist im Zustand $|\\chi\\rangle = A\\,(2|\\uparrow\\rangle + |\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'A(2|↑⟩ + |↓⟩)'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, ph:'⟨χ|χ⟩ = 1',
          model:['⟨χ|χ⟩ = 1', '|A|^2 (4 + 1) = 1', 'A = 1/sqrt(5)']},
        {id:'b', prompt:'b) Mit welcher Wahrscheinlichkeit misst man $S_x = +\\hbar/2$?', type:'value', target:'9/10', points:2, ph:'P = |⟨+x|χ⟩|^2',
          hints:['$\\langle{+x}| = \\frac{1}{\\sqrt2}(1, 1)$.'],
          model:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(5) (2; 1)|^2', '= 9/10']},
        {id:'c', prompt:'c) Berechne $\\langle S_x\\rangle$.', type:'value', target:'2ħ/5', points:2,
          hints:['$P(-x) = 1 - P(+x)$.'],
          model:['⟨S_x⟩ = ħ/2 · 9/10 - ħ/2 · 1/10', '= 2ħ/5'],
          mistakes:[{expr:'9ħ/20', msg:'Das ist nur der Beitrag von $+\\hbar/2$. Der Messwert $-\\hbar/2$ mit Wahrscheinlichkeit $1/10$ fehlt.'}]}
      ]},
    {id:'spin-p3', title:'Stern-Gerlach-Folge',
      text:'Ein Strahl im Zustand $|\\uparrow\\rangle$ geht durch einen Magneten in $x$-Richtung; nur $+x$ geht weiter in einen Magneten in $z$-Richtung.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Welcher Anteil des ursprünglichen Strahls kommt am Ende im Kanal $\\downarrow$ an?', type:'value', target:'1/4', points:2, ph:'P = |⟨+x|↑⟩|^2 |⟨+x|↓⟩|^2',
          hints:['Erst die Wahrscheinlichkeit für $+x$, dann für $\\downarrow$ im neu präparierten Zustand $|{+x}\\rangle$.', '$|\\langle\\downarrow|{+x}\\rangle|^2 = |\\langle{+x}|\\downarrow\\rangle|^2$.'],
          model:['P = |⟨+x|↑⟩|^2 |⟨+x|↓⟩|^2', '= 1/2 · 1/2', '= 1/4']},
        {id:'b', prompt:'b) Und wenn der $x$-Magnet entfernt wird?', type:'value', target:'0', points:1,
          model:['|⟨↓|↑⟩|^2 = 0'], note:'Erst die Messung in $x$-Richtung macht $\\downarrow$ wieder möglich.'}
      ]},
    {id:'spin-p4', title:'Larmor-Präzession',
      text:'Im Magnetfeld $B\\hat z$ ist $\\hat H = \\omega\\hat S_z$. Zur Zeit $0$ ist der Spin im Zustand $|{+x}\\rangle$. Es gilt $\\hat H|\\uparrow\\rangle = \\frac{\\hbar\\omega}{2}|\\uparrow\\rangle$, $\\hat H|\\downarrow\\rangle = -\\frac{\\hbar\\omega}{2}|\\downarrow\\rangle$.',
      ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Zeige $e^{-i\\hat Ht/\\hbar}|{+x}\\rangle = \\frac{1}{\\sqrt2}\\left(e^{-i\\omega t/2}|\\uparrow\\rangle + e^{i\\omega t/2}|\\downarrow\\rangle\\right)$.', type:'show', from:'e^(-iHt/ħ) |+x⟩', to:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)', points:2,
          hints:['Zerlege $|{+x}\\rangle$ in Eigenzustände von $\\hat H$; auf jeden wirkt $e^{-i\\hat Ht/\\hbar}$ als Zahl $e^{-iE t/\\hbar}$.'],
          model:[{l:'e^(-iHt/ħ) |+x⟩ = 1/sqrt(2) (e^(-iHt/ħ)|↑⟩ + e^(-iHt/ħ)|↓⟩)', w:'linear'}, {l:'= 1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)', w:'E = ±ħω/2'}]},
        {id:'b', prompt:'b) Berechne $\\langle S_x\\rangle(t)$ im Zustand $|\\chi(t)\\rangle$ aus a).', type:'value', target:'ħ/2 cos(ωt)', points:2, ph:'⟨S_x⟩ = ⟨χ|S_x|χ⟩',
          hints:['Mit $|\\chi\\rangle = \\binom ab$ ist $\\langle\\chi|\\sigma_x|\\chi\\rangle = a^*b + b^*a$.'],
          model:['⟨S_x⟩ = ⟨χ|S_x|χ⟩', '= ħ/2 · 1/2 (e^(-iωt) + e^(iωt))', '= ħ/2 cos(ωt)']},
        {id:'c', prompt:'c) Berechne $\\langle S_y\\rangle(t)$.', type:'value', target:'ħ/2 sin(ωt)', points:2,
          hints:['$\\langle\\chi|\\sigma_y|\\chi\\rangle = -ia^*b + ib^*a$.'],
          model:['⟨S_y⟩ = ħ/2 · i/2 (e^(-iωt) - e^(iωt))', '= ħ/2 sin(ωt)'], note:'Der Erwartungswert des Spins dreht sich mit $\\omega$ um die $z$-Achse; $\\langle S_z\\rangle = 0$ bleibt.'}
      ]},
    {id:'spin-p5', title:'Pauli-Algebra',
      text:'$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$, $\\hat S_i = \\frac\\hbar2\\sigma_i$.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\sigma_x\\sigma_y = i\\sigma_z$.', type:'show', from:'σ_x σ_y', to:'i σ_z', points:2,
          model:['σ_x σ_y = (0, 1; 1, 0)(0, -i; i, 0)', '= (i, 0; 0, -i)', '= i σ_z']},
        {id:'b', prompt:'b) Zeige damit $[\\hat S_x, \\hat S_y] = i\\hbar\\hat S_z$. (Es gilt $\\sigma_y\\sigma_x = -i\\sigma_z$.)', type:'show', from:'[S_x, S_y]', to:'iħ S_z', points:3,
          hints:['$[\\hat S_x, \\hat S_y] = \\frac{\\hbar^2}{4}(\\sigma_x\\sigma_y - \\sigma_y\\sigma_x)$.'],
          model:['[S_x, S_y] = ħ^2/4 (σ_x σ_y - σ_y σ_x)', '= ħ^2/4 (i σ_z + i σ_z)', '= iħ S_z']}
      ]},
    {id:'spin-p6', title:'Spin in schräger Richtung',
      text:'Für die Richtung $\\hat n = (\\sin\\theta, 0, \\cos\\theta)$ ist $\\hat S_{\\hat n} = \\frac\\hbar2\\begin{pmatrix}\\cos\\theta & \\sin\\theta\\\\ \\sin\\theta & -\\cos\\theta\\end{pmatrix}$. In der Eingabe heißt die Matrix `S_n`, die Einheitsmatrix `I`.',
      ctx:SPIN({params:{θ:'pos'}, mat:{preset:'spin', mats:{S_n:'ħ/2 (cos(θ), sin(θ); sin(θ), -cos(θ))'}}, unknowns:{λ:{ref:'ħ/2', alt:['-ħ/2'], kind:'real'}}}),
      goals:[{id:'a', prompt:'Bestimme die Eigenwerte $\\lambda$ von $\\hat S_{\\hat n}$ (am Ende den positiven: $\\lambda = \\dots$).', type:'solve', unknown:'λ', points:3, ph:'det(S_n - λ I) = 0',
        hints:['Charakteristisches Polynom: $\\det(\\hat S_{\\hat n} - \\lambda\\mathbb 1) = 0$.', '$\\cos^2\\theta + \\sin^2\\theta = 1$.'],
        model:['det(S_n - λ I) = 0', 'det((ħ/2 cos(θ) - λ, ħ/2 sin(θ); ħ/2 sin(θ), -ħ/2 cos(θ) - λ)) = 0', 'λ^2 - ħ^2/4 = 0', 'λ = ħ/2'],
        note:'Der zweite Eigenwert ist $-\\hbar/2$: Jede Spinkomponente hat die Messwerte $\\pm\\hbar/2$, egal in welche Richtung.'}]}
  ],
  final:[
    {q:'Der Spin ist in $|{+x}\\rangle$. Was liefert eine Messung von $S_z$?', opts:['$+\\hbar/2$ oder $-\\hbar/2$, je mit Wahrscheinlichkeit $1/2$', 'immer $0$', 'immer $+\\hbar/2$'], a:0, ex:'Gemessen wird ein Eigenwert. Erst der Mittelwert vieler Messungen ist $0$.'},
    {task:{id:'spin-f1', title:'Normieren', text:'$|\\chi\\rangle = A\\,(|\\uparrow\\rangle + 2i|\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'A(|↑⟩ + 2i|↓⟩)'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}, state:'χ'}),
      goals:[{id:'a', prompt:'Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, model:['⟨χ|χ⟩ = 1', '|A|^2 (1 + 4) = 1', 'A = 1/sqrt(5)']}]}},
    {q:'Eine Messung von $S_x$ hat $+\\hbar/2$ ergeben. Man misst sofort noch einmal $S_x$. Ergebnis?', opts:['sicher wieder $+\\hbar/2$', '$\\pm\\hbar/2$ mit je $1/2$', 'sicher $-\\hbar/2$'], a:0, ex:'Nach der Messung ist der Zustand $|{+x}\\rangle$ (Zustandsreduktion); die Wiederholung bestätigt den Wert.'},
    {task:{id:'spin-f2', title:'Erwartungswert von $S_z$', text:'$|\\chi\\rangle = \\frac{1}{\\sqrt5}(2|\\uparrow\\rangle + |\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'1/sqrt(5)(2|↑⟩ + |↓⟩)'}, state:'χ'}),
      goals:[{id:'a', prompt:'Berechne $\\langle S_z\\rangle$.', type:'value', target:'3ħ/10', points:2, model:['⟨S_z⟩ = ħ/2 · 4/5 - ħ/2 · 1/5', '= 3ħ/10']}]}}
  ],
  errors:[
    {id:'spin-e1', title:'Ein Zustand, der nie $+y$ ergibt?',
      text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle + i|\\downarrow\\rangle)$. Gesucht ist $P(S_y = +\\hbar/2)$. Eine Rechnung ergibt 0:',
      ctx:SPIN({states:{χ:'1/sqrt(2)(|↑⟩ + i|↓⟩)'}, state:'χ'}),
      lines:['P = |⟨+y|χ⟩|^2', '= |1/sqrt(2) (1, i) · 1/sqrt(2) (1; i)|^2', '= |1/2 (1 + i^2)|^2', '= 0'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Das Bra $\\langle{+y}|$ muss die konjugierten Komponenten $(1, -i)/\\sqrt2$ haben.', 'Der Faktor $1/\\sqrt2$ fehlt einmal.', 'Man muss $\\sigma_y$ dazwischenschreiben.'], a:0, ex:'Tatsächlich ist $|\\chi\\rangle = |{+y}\\rangle$, also $P = 1$. Ohne Konjugation wird aus $\\langle{+y}|{+y}\\rangle$ fälschlich $0$.'},
      fix:{id:'a', prompt:'Berichtige und berechne $P$.', type:'value', target:'1', model:['P = |⟨+y|χ⟩|^2', '= |1/sqrt(2) (1, -i) · 1/sqrt(2) (1; i)|^2', '= |1/2 (1 - i^2)|^2', '= 1']}}
  ]
});
lexe('pauli', 'Pauli-Matrizen', '$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$. Eigenschaften: $\\sigma_i^2 = \\mathbb 1$, $\\sigma_x\\sigma_y = i\\sigma_z$ (zyklisch), $\\sigma_i\\sigma_j = \\delta_{ij}\\mathbb 1 + i\\varepsilon_{ijk}\\sigma_k$, Spur 0, Eigenwerte $\\pm1$. Spin: $\\hat S_i = \\frac\\hbar2\\sigma_i$. Eingabe: `σ_x`, `S_x`, `S_+`.', {topic:'spin'});
lexe('spinor', 'Spinor', 'Zustand eines Spin-½-Teilchens: $|\\chi\\rangle = a|\\uparrow\\rangle + b|\\downarrow\\rangle = \\binom ab$ mit $|a|^2 + |b|^2 = 1$. Das Bra ist $\\langle\\chi| = (a^*, b^*)$. Bis auf eine globale Phase: $|\\chi\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ (Bloch-Kugel). Eingabe: `|↑⟩`, `(a; b)` als Spalte, `(a, b)` als Zeile (Bra).', {topic:'spin'});
lexe('spin-eigenzustaende', 'Eigenzustände der Spinkomponenten', '$S_z$: $|\\uparrow\\rangle$, $|\\downarrow\\rangle$. $S_x$: $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle\\pm|\\downarrow\\rangle)$. $S_y$: $|{\\pm y}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle\\pm i|\\downarrow\\rangle)$. Messwerte immer $\\pm\\hbar/2$. Eingabe: `|+x⟩`, `|-y⟩`.', {topic:'spin'});
lexe('stern-gerlach', 'Stern-Gerlach-Versuch', 'Ein inhomogenes Magnetfeld in Richtung $\\hat n$ spaltet einen Strahl von Spin-½-Teilchen in zwei Teilstrahlen ($S_{\\hat n} = \\pm\\hbar/2$). Ein ausgeblendeter Teilstrahl ist im entsprechenden Eigenzustand präpariert. Bei Folgen von Magneten in verschiedenen Richtungen multiplizieren sich die Wahrscheinlichkeiten $|\\langle\\cdot|\\cdot\\rangle|^2$; eine Messung in $x$ löscht die $z$-Information.', {topic:'spin'});
lexe('larmor', 'Larmor-Präzession', 'Im Feld $B\\hat z$: $\\hat H = \\omega\\hat S_z$ ($\\omega = -\\gamma B$). Zeitentwicklung $|\\chi(t)\\rangle = e^{-i\\hat Ht/\\hbar}|\\chi(0)\\rangle$, also $a\\,e^{-i\\omega t/2}|\\uparrow\\rangle + b\\,e^{i\\omega t/2}|\\downarrow\\rangle$. Der Erwartungswert $\\langle\\mathbf S\\rangle$ dreht sich mit $\\omega$ um die Feldrichtung; $\\langle S_z\\rangle$ bleibt konstant.', {topic:'spin'});
