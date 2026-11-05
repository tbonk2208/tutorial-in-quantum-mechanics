/* ===== Thema 6: Formalismus – Dirac-Notation, Operatoren, Messung ===== */
const FORM_FG = () => ({coords:['x'], params:{m:'pos'}, abstract:{f:{args:['x']}, g:{args:['x']}, V:{args:['x'], real:true}}});
const FORM_MAT = () => ({rep:'mat', mat:{preset:'spin', mats:{A:'(1, 2i; -2i, 1)'}}, coords:['t'], params:{},
  states:{v:'(1; -i)/sqrt(2)', w:'(1; i)/sqrt(2)'}, unknowns:{λ:{ref:'3', kind:'real'}, μ:{ref:'-1', kind:'real'}}});
const FORM_OSC = (st) => ({rep:'mat', mat:{preset:'osc'}, coords:['t'], params:{m:'pos', ω:'pos'}, states:{ψ:st}, state:'ψ', sumFrom:0});
const FORM_DYN = () => ({coords:['x', 't'], params:{m:'pos'}, abstract:{ψ:{args:['x', 't']}, V:{args:['x'], real:true}}, dyn:{fn:'ψ'}, normalized:true});
topic({
  id:'form', math:['m-vektor', 'm-eigen', 'm-hilbert'], title:'Formalismus: Dirac-Notation, Operatoren, Messung', short:'Formalismus',
  src:'Griffiths & Schroeter Kap. 3 · Nolting 5/1 Kap. 3 · Sakurai Kap. 1',
  goals:[
    'Ich kann mit Bras, Kets und Matrixelementen rechnen und Skalarprodukte in Orts- und Matrixdarstellung bilden.',
    'Ich kann zeigen, dass ein Operator hermitesch ist, und Kommutatoren wie $[\\hat x, \\hat p^2]$ berechnen.',
    'Ich kann mit dem Messpostulat Wahrscheinlichkeiten, Erwartungswerte und Unschärfen bestimmen.'
  ],
  needs:'komplexe Zahlen · Matrizen und Eigenwerte · partielle Integration · Erwartungswerte aus Thema 1',
  check:[
    {q:'Für die Vektoren $a = (1, i)$ und $b = (i, 1)$ ist das Skalarprodukt $\\sum_k a_k^* b_k$ gleich …', opts:['$0$', '$2i$', '$2$'], a:0, ex:'$1^*\\cdot i + i^*\\cdot 1 = i - i = 0$. Ohne Konjugation käme fälschlich $2i$ heraus.', lex:'dirac-notation', prev:'m-vektor'},
    {q:'Welche Eigenwerte hat die Matrix $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$?', opts:['$+1$ und $-1$', '$0$ und $1$', '$1$ und $1$'], a:0, ex:'$\\det\\begin{pmatrix}-\\lambda&1\\\\1&-\\lambda\\end{pmatrix} = \\lambda^2 - 1 = 0$.', lex:'hermitescher-operator'},
    {q:'Partielle Integration: $\\int_a^b f\\,g\'\\,dx = $', opts:['$[fg]_a^b - \\int_a^b f\'g\\,dx$', '$[fg]_a^b + \\int_a^b f\'g\\,dx$', '$f(b)g\'(b) - f(a)g\'(a)$'], a:0, ex:'Das ist die Produktregel, integriert. Bei Wellenfunktionen, die im Unendlichen verschwinden, fällt der Randterm weg.', lex:'integrale'},
    {q:'Ein Teilchen ist im Energieeigenzustand $\\psi_2$. Du misst die Energie. Was kommt heraus?', opts:['mit Sicherheit $E_2$', '$E_1$ oder $E_2$, je zur Hälfte', 'der Erwartungswert, der zwischen den $E_n$ liegt'], a:0, ex:'In einem Eigenzustand der Messgröße ist das Ergebnis sicher der zugehörige Eigenwert.', lex:'messpostulat', prev:'kasten'}
  ],
  example:{
    title:'$\\hat p$ ist hermitesch',
    text:'Zeige für zwei Funktionen $f, g$, die im Unendlichen verschwinden: $\\langle f|\\hat p\\,g\\rangle = \\langle\\hat p\\,f|g\\rangle$ mit $\\hat p = -i\\hbar\\,d/dx$.',
    ctx:FORM_FG(),
    lines:[
      {l:'⟨f|p̂ g⟩ = ∫_-∞^∞ f^* (-iħ) g\' dx', why:{q:'Was bedeutet $\\langle f|\\hat p g\\rangle$ in der Ortsdarstellung?', opts:['$\\int f^*(x)\\,(\\hat p g)(x)\\,dx$', '$\\int f(x)\\,g(x)\\,dx$', '$f(0)\\,\\hat p\\,g(0)$'], a:0, ex:'Das Bra wird komplex konjugiert, dann wird über $x$ integriert.'}},
      {l:'= iħ ∫_-∞^∞ (f^*)\' g dx', w:'partiell integriert, Randterm 0', why:{q:'Warum verschwindet der Randterm $-i\\hbar[f^*g]_{-\\infty}^{\\infty}$?', opts:['$f$ und $g$ gehen im Unendlichen gegen 0.', 'Weil $\\hbar$ klein ist.', 'Weil das Integral reell ist.'], a:0, ex:'Normierbare Funktionen fallen ab; deshalb ist $[f^*g]_{-\\infty}^\\infty = 0$.'}},
      {l:'= ∫_-∞^∞ (-iħ f\')^* g dx', why:{q:'Wie wurde umgeformt?', opts:['$i\\hbar (f^*)\' = (-i\\hbar f\')^*$, weil $i^* = -i$', 'Die Ableitung wurde auf $g$ verschoben.', 'Es wurde mit $-1$ multipliziert.'], a:0, ex:'Konjugieren dreht das Vorzeichen von $i$; die Ableitung vertauscht mit der Konjugation.'}},
      {l:'= ⟨p̂ f|g⟩', why:{q:'Was ist damit gezeigt?', opts:['$\\hat p^\\dagger = \\hat p$: $\\hat p$ ist hermitesch.', '$\\hat p$ ist reell.', '$\\langle f|g\\rangle = 0$.'], a:0, ex:'Ein Operator mit $\\langle f|\\hat A g\\rangle = \\langle\\hat A f|g\\rangle$ für alle zulässigen $f, g$ heißt hermitesch. Ohne das $i$ in $\\hat p$ ginge es nicht: $d/dx$ allein ist antihermitesch.'}}
    ],
    faded:{id:'form-fade', title:'Jetzt du: der Kommutator $[\\hat x, \\hat p^2]$', text:'Wende $[\\hat x, \\hat p^2]$ auf eine Testfunktion $f$ an und zeige $[\\hat x, \\hat p^2]f = 2i\\hbar\\,\\hat p f$.',
      ctx:FORM_FG(),
      given:['[x̂, p̂^2] f = x̂ p̂^2 f - p̂^2 x̂ f', '= -ħ^2 x f\'\' + ħ^2 (x f)\'\''],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'show', from:'[x̂, p̂^2] f', to:'2iħ p̂ f', hints:['Produktregel zweimal: $(xf)\'\' = 2f\' + xf\'\'$.', 'Am Ende: $2\\hbar^2 f\' = 2i\\hbar\\,(-i\\hbar f\')$.'],
        model:['[x̂, p̂^2] f = x̂ p̂^2 f - p̂^2 x̂ f', '= -ħ^2 x f\'\' + ħ^2 (x f)\'\'', {l:'= -ħ^2 x f\'\' + ħ^2 (2 f\' + x f\'\')', gap:'= -ħ^2 x f\'\' + ħ^2 (▢)'}, '= 2ħ^2 f\'', '= 2iħ (-iħ f\')']}]}
  },
  puzzle:{
    title:'Zweimal messen',
    text:'Ein Teilchen ist im Zustand $|\\psi\\rangle = \\frac{1}{\\sqrt2}(|1\\rangle + |2\\rangle)$ aus zwei Energieeigenzuständen. Du misst die Energie und erhältst $E_2$. Unmittelbar danach misst du die Energie noch einmal.',
    q:{q:'Was ergibt die zweite Messung?', opts:['mit Sicherheit $E_2$', '$E_1$ oder $E_2$, je mit Wahrscheinlichkeit $1/2$', '$(E_1 + E_2)/2$'], a:0, ex:'Nach der Messung ist das System im Eigenzustand $|2\\rangle$.'},
    reveal:'Die erste Messung ändert den Zustand: Nach dem Ergebnis $E_2$ ist das System in $|2\\rangle$ („Kollaps“ oder Zustandsreduktion). Eine sofortige Wiederholung bestätigt $E_2$ mit Sicherheit. Die Wahrscheinlichkeiten $|c_n|^2 = 1/2$ gelten nur für die **erste** Messung am ursprünglichen Zustand. Und $(E_1+E_2)/2$ ist der Erwartungswert vieler Messungen an vielen gleich präparierten Systemen – als Einzelergebnis kommt er nie vor.'
  },
  clarify:{
    core:'Zustände sind Vektoren $|\\psi\\rangle$ in einem Hilbertraum, Messgrößen sind **hermitesche Operatoren** $\\hat A = \\hat A^\\dagger$. Ihre Eigenwerte $a_n$ sind reell, Eigenvektoren zu verschiedenen Eigenwerten orthogonal. Entwickelt man $|\\psi\\rangle = \\sum_n c_n|a_n\\rangle$ mit $c_n = \\langle a_n|\\psi\\rangle$, dann gilt das **Messpostulat**: Eine Messung liefert $a_n$ mit Wahrscheinlichkeit $|c_n|^2$, danach ist der Zustand $|a_n\\rangle$. Daraus folgt\n\n$$\\langle A\\rangle = \\langle\\psi|\\hat A|\\psi\\rangle = \\sum_n a_n|c_n|^2,\\qquad \\Delta A\\,\\Delta B \\ge \\tfrac12\\left|\\langle[\\hat A,\\hat B]\\rangle\\right|.$$',
    keys:[
      'Im Bra wird konjugiert: $\\langle\\phi|\\psi\\rangle = \\int\\phi^*\\psi\\,dx = \\sum_k\\phi_k^*\\psi_k$, und $\\langle\\phi|\\psi\\rangle = \\langle\\psi|\\phi\\rangle^*$.',
      'Adjungieren dreht die Reihenfolge um: $(\\hat A\\hat B)^\\dagger = \\hat B^\\dagger\\hat A^\\dagger$, und $(c\\hat A)^\\dagger = c^*\\hat A^\\dagger$.',
      'Kommutatorregeln: $[\\hat A,\\hat B\\hat C] = [\\hat A,\\hat B]\\hat C + \\hat B[\\hat A,\\hat C]$; damit $[\\hat x,\\hat p^n] = i\\hbar n\\hat p^{n-1}$.',
      'Vertauschen zwei Observablen, gibt es eine gemeinsame Eigenbasis; sie sind gleichzeitig scharf messbar.',
      'Ehrenfest: $\\frac{d}{dt}\\langle x\\rangle = \\frac{\\langle p\\rangle}{m}$ und $\\frac{d}{dt}\\langle p\\rangle = -\\langle V\'(x)\\rangle$ – die klassischen Gleichungen für Mittelwerte.'
    ],
    errors:[
      '$\\langle A\\rangle = \\sum a_n c_n$ statt $\\sum a_n|c_n|^2$: Wahrscheinlichkeiten sind Betragsquadrate.',
      '„$\\langle A\\rangle$ ist das Ergebnis einer Messung“: Einzelmessungen liefern nur Eigenwerte.',
      'Hermitesch mit symmetrisch verwechseln: Bei komplexen Matrizen muss $A_{ij} = A_{ji}^*$ gelten.',
      'Operatoren wie Zahlen vertauschen: $\\hat x\\hat p \\ne \\hat p\\hat x$.',
      'Nach einer Messung mit dem alten Zustand weiterrechnen.'
    ],
    more:[{title:'Robertson-Unschärferelation für x und p', text:'Mit $[\\hat x, \\hat p] = i\\hbar$ folgt $\\Delta x\\,\\Delta p \\ge \\frac12|\\langle i\\hbar\\rangle| = \\hbar/2$ – für **jeden** Zustand. Die Unschärfe ist keine Messungenauigkeit, sondern eine Eigenschaft des Zustands: Es gibt keinen Zustand, in dem Ort und Impuls beide scharf sind.'}],
    checks:[
      {q:'$|\\psi\\rangle = \\frac35|a_1\\rangle + \\frac45 i|a_2\\rangle$ mit Eigenwerten $a_1 = 1$, $a_2 = 2$. Wie groß ist $\\langle A\\rangle$?', opts:['$41/25$', '$11/5$', '$3/2$'], a:0, ex:'$\\langle A\\rangle = 1\\cdot\\frac{9}{25} + 2\\cdot\\frac{16}{25} = \\frac{41}{25}$. Die Phase $i$ fällt im Betragsquadrat weg.'},
      {q:'Welche Matrix ist hermitesch?', opts:['$\\begin{pmatrix}1&i\\\\-i&2\\end{pmatrix}$', '$\\begin{pmatrix}1&i\\\\i&2\\end{pmatrix}$', '$\\begin{pmatrix}i&0\\\\0&1\\end{pmatrix}$'], a:0, ex:'Hermitesch: $A_{12} = A_{21}^*$ und reelle Diagonale. $(-i)^* = i$ ✓.'}
    ]
  },
  lab:{type:'measure', title:'Messung an einem Dreiniveausystem',
    text:'Ein Zustand $\\sum_n c_n|a_n\\rangle$ mit Eigenwerten $a_n = 1, 2, 3$. Mit den Reglern stellst du die Gewichte $|c_n|^2$ ein (sie werden automatisch normiert). Jede Messung liefert einen Eigenwert – zufällig, mit Wahrscheinlichkeit $|c_n|^2$. Jede Messung findet an einem frisch präparierten System statt.',
    questions:[
      {q:'Lass die Gewichte bei $0{,}5$, $0{,}3$ und $0{,}2$. Kann eine einzelne Messung den Wert $\\langle A\\rangle = 1{,}7$ liefern?', opts:['Nein, nur 1, 2 oder 3.', 'Ja, das ist der häufigste Wert.', 'Ja, aber selten.'], a:0, ex:'Messwerte sind Eigenwerte. $\\langle A\\rangle$ ist der Mittelwert vieler Messungen.'},
      {q:'Miss mehrmals 100-mal. Was passiert mit dem Mittelwert der Messungen?', opts:['Er nähert sich $\\langle A\\rangle$, schwankt aber.', 'Er ist sofort genau $\\langle A\\rangle$.', 'Er wächst immer weiter.'], a:0, ex:'Die relative Schwankung des Mittelwerts fällt etwa wie $1/\\sqrt N$.'}
    ],
    noPic:{q:'Ohne Bild: $c_1 = \\frac12$, $c_2 = \\frac12$, $c_3 = \\frac{1}{\\sqrt2}$ bei Eigenwerten 1, 2, 3. Wie groß ist $\\langle A\\rangle$?', opts:['$9/4$', '$2$', '$\\frac32 + \\frac{3}{\\sqrt2}$'], a:0, ex:'$\\frac14\\cdot1 + \\frac14\\cdot2 + \\frac12\\cdot3 = \\frac94$.'}},
  compare:{
    text:'Gesucht ist $\\langle A\\rangle$ für $A = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ im Zustand $|\\psi\\rangle = \\begin{pmatrix}3/5\\\\4/5\\end{pmatrix}$. Die Eigenvektoren von $A$ sind $|{+x}\\rangle = (1, 1)^T/\\sqrt2$ (Eigenwert $+1$) und $|{-x}\\rangle = (1, -1)^T/\\sqrt2$ (Eigenwert $-1$).',
    ctx:{rep:'mat', mat:{preset:'spin', mats:{A:'(0, 1; 1, 0)'}}, coords:['t'], params:{}, states:{ψ:'(3/5; 4/5)'}, state:'ψ'},
    A:{name:'Sandwich $\\langle\\psi|A|\\psi\\rangle$', model:['⟨A⟩ = ⟨ψ|A|ψ⟩', '= (3/5, 4/5) (0, 1; 1, 0) (3/5; 4/5)', '= 24/25']},
    B:{name:'Über die Eigenbasis', model:['⟨+x|ψ⟩ = 7/(5 sqrt(2))', '⟨-x|ψ⟩ = -1/(5 sqrt(2))', '⟨A⟩ = 1 · 49/50 + (-1) · 1/50', '= 24/25']},
    questions:[
      {q:'Was liefert Weg B zusätzlich?', opts:['die Wahrscheinlichkeiten der einzelnen Messwerte ($49/50$ und $1/50$)', 'nichts, nur einen längeren Rechenweg', 'den Zustand nach der Messung ohne weitere Information'], a:0, ex:'Weg B beantwortet auch: Wie oft kommt $+1$, wie oft $-1$?'},
      {q:'Wann ist Weg A klar schneller?', opts:['wenn die Eigenvektoren nicht bekannt sind', 'wenn der Zustand ein Eigenvektor ist', 'nie'], a:0, ex:'Für das Sandwich braucht man nur Matrix und Zustand, keine Diagonalisierung.'}
    ]
  },
  practice:[
    {id:'form-p1', title:'Eigenwerte und Eigenvektoren einer hermiteschen Matrix',
      text:'$A = \\begin{pmatrix}1&2i\\\\-2i&1\\end{pmatrix}$. Gegeben sind $v = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\-i\\end{pmatrix}$ und $w = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\i\\end{pmatrix}$. Matrizen schreibst du als `(1, 2i; -2i, 1)`, Spaltenvektoren als `(1; -i)`.',
      ctx:FORM_MAT(),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $v$ Eigenvektor ist, und bestimme den Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:2, ph:'A v = (1, 2i; -2i, 1)(1; -i)/sqrt(2)',
          hints:['Rechne $Av$ aus und vergleiche mit $v$.', '$Av = \\frac{1}{\\sqrt2}(3, -3i)^T$.'],
          model:['A v = (1, 2i; -2i, 1)(1; -i)/sqrt(2)', '= (3; -3i)/sqrt(2)', '= 3 v', 'A v = λ v', 'λ = 3']},
        {id:'b', prompt:'b) Bestimme den Eigenwert $\\mu$ zu $w$.', type:'solve', unknown:'μ', points:2,
          model:['A w = (1, 2i; -2i, 1)(1; i)/sqrt(2)', '= (-1; -i)/sqrt(2)', '= -w', 'μ = -1']},
        {id:'c', prompt:'c) Berechne $\\langle v|w\\rangle$.', type:'value', target:'0', points:2,
          hints:['Das Bra ist der konjugiert transponierte Vektor: $\\langle v| = \\frac{1}{\\sqrt2}(1, i)$.'],
          model:['⟨v|w⟩ = (1, i)/sqrt(2) (1; i)/sqrt(2)', '= (1 + i^2)/2', '= 0'], note:'Eigenvektoren zu verschiedenen Eigenwerten eines hermiteschen Operators sind orthogonal.'}
      ]},
    {id:'form-p2', title:'Kommutatoren in der Ortsdarstellung',
      text:'Wende die Kommutatoren auf eine Testfunktion $f(x)$ an. $\\hat p = -i\\hbar\\,d/dx$, $\\hat H = \\hat p^2/(2m) + V(x)$.',
      ctx:FORM_FG(),
      goals:[
        {id:'a', prompt:'a) Zeige $[\\hat x^2, \\hat p]f = 2i\\hbar\\,\\hat x f$.', type:'show', from:'[x̂^2, p̂] f', to:'2iħ x̂ f', points:3, ph:'[x̂^2, p̂] f = x^2 (-iħ f\') - (-iħ)(x^2 f)\'',
          hints:['$[\\hat x^2,\\hat p]f = x^2(\\hat p f) - \\hat p(x^2 f)$.', 'Produktregel: $(x^2f)\' = 2xf + x^2f\'$.'],
          model:['[x̂^2, p̂] f = x^2 (-iħ f\') - (-iħ)(x^2 f)\'', '= -iħ x^2 f\' + iħ (2x f + x^2 f\')', '= 2iħ x f']},
        {id:'b', prompt:'b) Zeige $[\\hat x, \\hat H]f = \\frac{i\\hbar}{m}\\hat p f$.', type:'show', from:'[x̂, Ĥ] f', to:'iħ/m p̂ f', points:3,
          hints:['$\\hat x$ vertauscht mit $V(x)$.', 'Benutze $[\\hat x, \\hat p^2] = 2i\\hbar\\hat p$.'],
          model:['[x̂, Ĥ] f = [x̂, p̂^2/(2m)] f + [x̂, V] f', '= 1/(2m) [x̂, p̂^2] f', '= 1/(2m) · 2ħ^2 f\'', '= iħ/m (-iħ f\')'],
          note:'Damit folgt aus $\\frac{d}{dt}\\langle x\\rangle = \\frac{i}{\\hbar}\\langle[\\hat H,\\hat x]\\rangle$ die Ehrenfest-Gleichung $\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m$.'}
      ]},
    {id:'form-p3', title:'Energiemessung an einer Überlagerung',
      text:'Ein Oszillator ist im Zustand $|\\psi\\rangle = \\frac{1}{\\sqrt6}\\left(|0\\rangle + 2|1\\rangle + i|2\\rangle\\right)$ mit $E_n = \\hbar\\omega(n + \\tfrac12)$. Im Tutorial heißt der Hamiltonoperator hier `H`.',
      ctx:FORM_OSC('(|0⟩ + 2|1⟩ + i|2⟩)/sqrt(6)'),
      goals:[
        {id:'a', prompt:'a) Mit welcher Wahrscheinlichkeit misst man $E_1 = \\tfrac32\\hbar\\omega$?', type:'value', target:'2/3', points:2,
          model:['|⟨1|ψ⟩|^2 = |2/sqrt(6)|^2', '= 2/3']},
        {id:'b', prompt:'b) Berechne $\\langle H\\rangle$.', type:'value', target:'3/2 ħω', points:2,
          hints:['$\\langle H\\rangle = \\sum_n E_n|c_n|^2$ mit $|c_n|^2 = \\frac16, \\frac46, \\frac16$.'],
          model:['⟨H⟩ = 1/6 · ħω/2 + 4/6 · 3ħω/2 + 1/6 · 5ħω/2', '= 3/2 ħω'],
          mistakes:[{expr:'ħω/2 · 1/sqrt(6) + 3ħω/2 · 2/sqrt(6) + 5ħω/2 · 1/sqrt(6)', msg:'Gewichte sind die Wahrscheinlichkeiten $|c_n|^2$, nicht die Amplituden $c_n$.'}]},
        {id:'c', prompt:'c) Berechne die Energieunschärfe $\\Delta H$.', type:'value', target:'ħω/sqrt(3)', points:3,
          hints:['$\\langle H^2\\rangle = \\sum_n E_n^2|c_n|^2$.', '$\\Delta H = \\sqrt{\\langle H^2\\rangle - \\langle H\\rangle^2}$'],
          model:['⟨H^2⟩ = ħ^2ω^2 (1/6 · 1/4 + 4/6 · 9/4 + 1/6 · 25/4)', '= 31/12 ħ^2 ω^2', 'ΔH = sqrt(31/12 - 9/4) ħω', '= ħω/sqrt(3)']}
      ]},
    {id:'form-p4', title:'Ehrenfest-Theorem für den Ort',
      text:'$\\psi(x,t)$ erfüllt $i\\hbar\\,\\partial_t\\psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\psi + V(x)\\psi$ mit reellem $V$ und ist normiert. Zeige $\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m$. Das Tutorial setzt für $\\partial\\psi/\\partial t$ automatisch die Schrödingergleichung ein.',
      ctx:FORM_DYN(),
      goals:[{id:'a', prompt:'Zeige $\\frac{d}{dt}\\int\\psi^*x\\psi\\,dx = \\langle p\\rangle/m$.', type:'show', from:'d/dt ∫_-∞^∞ ψ^* x ψ dx', to:'⟨p⟩/m', points:4, minSteps:3,
        hints:['Ziehe $d/dt$ ins Integral und setze die Schrödingergleichung für $\\partial_t\\psi$ und $\\partial_t\\psi^*$ ein. Die $V$-Terme heben sich weg.', 'Partiell integrieren: $\\int x(\\psi^*\\psi\'\' - \\psi^{*\\prime\\prime}\\psi)dx = \\int(\\psi^{*\\prime}\\psi - \\psi^*\\psi\')dx$.'],
        model:['d/dt ∫_-∞^∞ ψ^* x ψ dx = ∫_-∞^∞ x (∂ψ^*/∂t ψ + ψ^* ∂ψ/∂t) dx', {l:'= iħ/(2m) ∫_-∞^∞ x (ψ^* ∂^2ψ/∂x^2 - ∂^2ψ^*/∂x^2 ψ) dx', w:'Schrödingergleichung, V hebt sich weg'}, {l:'= iħ/(2m) ∫_-∞^∞ (∂ψ^*/∂x ψ - ψ^* ∂ψ/∂x) dx', w:'partiell integriert'}, {l:'= -iħ/m ∫_-∞^∞ ψ^* ∂ψ/∂x dx', w:'noch einmal partiell'}, '= ⟨p⟩/m']}]},
    {id:'form-p5', title:'Unschärferelation für Spin-Komponenten',
      text:'Für Spin ½ gilt $[S_x, S_y] = i\\hbar S_z$. Der Zustand ist $|\\chi\\rangle = |{\\uparrow}\\rangle$. Robertson: $\\Delta S_x\\,\\Delta S_y \\ge \\frac12|\\langle[S_x,S_y]\\rangle|$.',
      ctx:{rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}, states:{χ:'|↑⟩'}, state:'χ'},
      goals:[
        {id:'a', prompt:'a) Berechne die rechte Seite $\\frac12|\\langle[S_x,S_y]\\rangle|$.', type:'value', target:'ħ^2/4', points:2,
          model:['1/2 |⟨[S_x, S_y]⟩| = 1/2 |⟨iħ S_z⟩|', '= ħ/2 · ħ/2', '= ħ^2/4']},
        {id:'b', prompt:'b) Berechne $\\Delta S_x\\,\\Delta S_y$.', type:'value', target:'ħ^2/4', points:2,
          hints:['$S_x^2 = \\hbar^2/4\\cdot\\mathbb 1$ und $\\langle S_x\\rangle = 0$ in $|{\\uparrow}\\rangle$.'],
          model:['ΔS_x = sqrt(⟨S_x^2⟩ - ⟨S_x⟩^2)', '= ħ/2', 'ΔS_x ΔS_y = ħ/2 · ħ/2', '= ħ^2/4'], note:'Hier gilt das Gleichheitszeichen: $|{\\uparrow}\\rangle$ ist ein Zustand minimaler Unschärfe.'}
      ]}
  ],
  final:[
    {q:'Was gilt für die Eigenwerte eines hermiteschen Operators?', opts:['Sie sind reell.', 'Sie sind rein imaginär.', 'Sie sind immer positiv.'], a:0, ex:'Aus $\\langle a|\\hat A a\\rangle = \\langle\\hat A a|a\\rangle$ folgt $a = a^*$.'},
    {task:{id:'form-f1', title:'Erwartungswert in einer Überlagerung', text:'Oszillator im Zustand $|\\psi\\rangle = \\frac{1}{\\sqrt2}(|0\\rangle + |1\\rangle)$ mit $E_n = \\hbar\\omega(n+\\tfrac12)$.',
      ctx:FORM_OSC('(|0⟩ + |1⟩)/sqrt(2)'),
      goals:[{id:'a', prompt:'Berechne $\\langle H\\rangle$.', type:'value', target:'ħω', points:2, model:['⟨H⟩ = 1/2 · ħω/2 + 1/2 · 3ħω/2', '= ħω']}]}},
    {q:'$[\\hat A, \\hat B] = 0$. Was folgt daraus?', opts:['Es gibt eine gemeinsame Eigenbasis; beide Größen sind gleichzeitig scharf messbar.', '$\\hat A = \\hat B$', '$\\langle A\\rangle = \\langle B\\rangle$'], a:0, ex:'Vertauschende hermitesche Operatoren lassen sich gemeinsam diagonalisieren.'},
    {task:{id:'form-f2', title:'Kommutator mit $\\hat x^3$', text:'Wende $[\\hat p, \\hat x^3]$ auf eine Testfunktion $f(x)$ an.',
      ctx:FORM_FG(),
      goals:[{id:'a', prompt:'Zeige $[\\hat p, \\hat x^3]f = -3i\\hbar x^2 f$.', type:'show', from:'[p̂, x̂^3] f', to:'-3iħ x^2 f', points:3, model:['[p̂, x̂^3] f = -iħ (x^3 f)\' + iħ x^3 f\'', '= -iħ (3x^2 f + x^3 f\') + iħ x^3 f\'', '= -3iħ x^2 f']}]}}
  ],
  errors:[
    {id:'form-e1', title:'Erwartungswert mit Amplituden',
      text:'Oszillator im Zustand $|\\psi\\rangle = \\frac{1}{\\sqrt6}(|0\\rangle + 2|1\\rangle + i|2\\rangle)$. Gesucht ist $\\langle H\\rangle$:',
      ctx:FORM_OSC('(|0⟩ + 2|1⟩ + i|2⟩)/sqrt(6)'),
      lines:['|⟨0|ψ⟩|^2 = 1/6', '|⟨1|ψ⟩|^2 = 2/3', '⟨H⟩ = ħω/2 · 1/sqrt(6) + 3ħω/2 · 2/sqrt(6) + 5ħω/2 · 1/sqrt(6)', '= 6ħω/sqrt(6)'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['Es wurden die Amplituden $|c_n|$ statt der Wahrscheinlichkeiten $|c_n|^2$ als Gewichte genommen.', 'Die Energien $E_n$ stimmen nicht.', 'Man darf $|2\\rangle$ nicht mitnehmen.'], a:0, ex:'$\\langle H\\rangle = \\sum_n E_n|c_n|^2$. Die Gewichte müssen sich zu 1 addieren – $\\frac{1+2+1}{\\sqrt6}$ tut das nicht.'},
      fix:{id:'a', prompt:'Berichtige und berechne $\\langle H\\rangle$.', type:'value', target:'3/2 ħω', model:['⟨H⟩ = 1/6 · ħω/2 + 4/6 · 3ħω/2 + 1/6 · 5ħω/2', '= 3/2 ħω']}},
    {id:'form-e2', title:'Reihenfolge beim Adjungieren',
      text:'Gesucht ist $(S_+S_z)^\\dagger$ für Spin ½ mit $S_+^\\dagger = S_-$. Ergebnis soll ein Vielfaches $c\\,S_-$ sein:',
      ctx:{rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}, unknowns:{c:{ref:'-ħ/2', kind:'real'}}},
      lines:['(S_+)† = S_-', '(S_+ S_z)† = S_- S_z', '= ħ/2 S_-'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Beim Adjungieren dreht sich die Reihenfolge um: $(AB)^\\dagger = B^\\dagger A^\\dagger = S_z S_-$.', '$S_z$ ist nicht hermitesch.', '$S_+^\\dagger$ ist $S_+$.'], a:0, ex:'$S_zS_- \\ne S_-S_z$, denn $[S_z, S_-] = -\\hbar S_-$. Hier ändert das sogar das Vorzeichen des Ergebnisses.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $c$ in $(S_+S_z)^\\dagger = c\\,S_-$.', type:'solve', unknown:'c',
        model:['(S_+ S_z)† = S_z S_-', '= -ħ/2 S_-', '(S_+ S_z)† = c S_-', 'c = -ħ/2']}}
  ]
});
lexe('dirac-notation', 'Dirac-Notation', 'Ket $|\\psi\\rangle$: Zustandsvektor. Bra $\\langle\\phi|$: das zugehörige lineare Funktional (konjugiert transponiert). Skalarprodukt $\\langle\\phi|\\psi\\rangle = \\int\\phi^*(x)\\psi(x)dx$ bzw. $\\sum_k\\phi_k^*\\psi_k$; es gilt $\\langle\\phi|\\psi\\rangle^* = \\langle\\psi|\\phi\\rangle$. Matrixelement $\\langle\\phi|\\hat A|\\psi\\rangle = \\int\\phi^*\\hat A\\psi\\,dx$. Vollständigkeit: $\\sum_n|n\\rangle\\langle n| = \\mathbb 1$.', {topic:'form'});
lexe('hermitescher-operator', 'Hermitescher Operator', '$\\hat A^\\dagger = \\hat A$, d. h. $\\langle f|\\hat A g\\rangle = \\langle\\hat A f|g\\rangle$ für alle zulässigen $f, g$. Matrix: $A_{ij} = A_{ji}^*$. Eigenwerte sind reell, Eigenvektoren zu verschiedenen Eigenwerten orthogonal. Beispiele: $\\hat x$, $\\hat p = -i\\hbar\\,d/dx$, $\\hat H$, Pauli-Matrizen.', {topic:'form'});
lexe('kommutator', 'Kommutator', '$[\\hat A,\\hat B] = \\hat A\\hat B - \\hat B\\hat A$. Regeln: $[\\hat A,\\hat B] = -[\\hat B,\\hat A]$, $[\\hat A,\\hat B\\hat C] = [\\hat A,\\hat B]\\hat C + \\hat B[\\hat A,\\hat C]$. Wichtig: $[\\hat x,\\hat p] = i\\hbar$, $[\\hat x,\\hat p^n] = i\\hbar n\\hat p^{n-1}$, $[\\hat p, f(\\hat x)] = -i\\hbar f\'(\\hat x)$. Zum Ausrechnen in der Ortsdarstellung immer auf eine Testfunktion $f$ anwenden.', {topic:'form'});
lexe('messpostulat', 'Messpostulat', 'Eine Messung der Observablen $\\hat A$ liefert einen Eigenwert $a_n$ mit der Wahrscheinlichkeit $|\\langle a_n|\\psi\\rangle|^2$ (bei Entartung: Summe über den Eigenraum). Unmittelbar danach ist das System im zugehörigen Eigenzustand. Erwartungswert: $\\langle A\\rangle = \\sum_n a_n|c_n|^2 = \\langle\\psi|\\hat A|\\psi\\rangle$.', {topic:'form'});
lexe('robertson', 'Robertson-Unschärferelation', '$\\Delta A\\,\\Delta B \\ge \\frac12\\left|\\langle[\\hat A,\\hat B]\\rangle\\right|$ für jeden Zustand. Mit $[\\hat x,\\hat p] = i\\hbar$ folgt $\\Delta x\\Delta p \\ge \\hbar/2$; mit $[S_x, S_y] = i\\hbar S_z$ folgt $\\Delta S_x\\Delta S_y \\ge \\frac\\hbar2|\\langle S_z\\rangle|$.', {topic:'form'});
lexe('ehrenfest', 'Ehrenfest-Theorem', 'Zeitentwicklung von Erwartungswerten: $\\frac{d}{dt}\\langle A\\rangle = \\frac{i}{\\hbar}\\langle[\\hat H,\\hat A]\\rangle + \\langle\\partial_t\\hat A\\rangle$. Für $\\hat H = \\hat p^2/2m + V$: $\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m$, $\\frac{d}{dt}\\langle p\\rangle = -\\langle V\'(x)\\rangle$.', {topic:'form'});
