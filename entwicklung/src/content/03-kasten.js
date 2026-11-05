/* ===== Thema 3: Unendlicher Potentialtopf ===== */
(function(){
const FAM = {'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)'};
const BOX = (extra) => {
  const base = {coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:Object.assign({}, FAM)};
  const e = extra || {};
  return Object.assign(base, e, {defs:Object.assign({}, FAM, e.defs || {}), params:Object.assign({}, base.params, e.params || {})});
};
topic({
  id:'kasten', math:['m-dgl', 'm-hilbert'], title:'Unendlicher Potentialtopf', short:'Potentialtopf',
  src:'Griffiths & Schroeter Kap. 2.2 · Nolting 5/1 Kap. 4 · Schwabl Kap. 3',
  goals:[
    'Ich kann aus den Randbedingungen $\\psi(0) = \\psi(L) = 0$ die Eigenfunktionen $\\psi_n$ und Energien $E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$ herleiten.',
    'Ich kann einen Anfangszustand nach $\\psi_n$ entwickeln: $c_n = \\langle\\psi_n|\\Psi(0)\\rangle$, $P(E_n) = |c_n|^2$.',
    'Ich kann $\\Psi(x,t)$, $\\langle H\\rangle = \\sum|c_n|^2E_n$ sowie $\\langle x\\rangle$, $\\Delta x$ und $\\Delta p$ in $\\psi_n$ berechnen.'
  ],
  needs:'stationäre Schrödingergleichung (Thema 2) · $y\'\' = -k^2y$ · Normierung',
  check:[
    {q:'Welche Bedingung legt die Konstante $A$ in $\\psi = A\\sin(kx)$ fest?', opts:['die Normierung $\\int|\\psi|^2dx = 1$', 'die Randbedingung $\\psi(L) = 0$', 'die Energie'], a:0, ex:'Die Randbedingungen legen $k$ fest, die Normierung legt $|A|$ fest.', lex:'normierung', prev:'wf'},
    {q:'Für welche $k$ gilt $\\sin(kL) = 0$ mit $k > 0$?', opts:['$k = n\\pi/L$ mit $n = 1, 2, 3, \\dots$', '$k = n\\pi L$', '$k = \\pi/(2L)$'], a:0, ex:'Der Sinus ist null bei ganzzahligen Vielfachen von $\\pi$: $kL = n\\pi$.', lex:'schwingungsgleichung', prev:'m-dgl'},
    {q:'Wie lautet die stationäre Schrödingergleichung im Inneren ($V = 0$)?', opts:['$-\\frac{\\hbar^2}{2m}\\psi\'\' = E\\psi$', '$i\\hbar\\psi\' = E\\psi$', '$\\psi\'\' = E\\psi$'], a:0, ex:'$\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2}$ für $V = 0$.', lex:'hamilton', prev:'sg'},
    {q:'$\\int_0^L\\sin(2\\pi x/L)\\sin(3\\pi x/L)\\,dx$ ist …', opts:['$0$', '$L/2$', '$L$'], a:0, ex:'Für $n \\ne m$ sind die Sinusfunktionen orthogonal.', lex:'integrale'}
  ],
  example:{
    title:'Eigenfunktionen und Energien aus den Randbedingungen',
    text:'Im Inneren ($0 < x < L$) ist $V = 0$, außerhalb $V = \\infty$, also $\\psi = 0$ dort. Wegen der Stetigkeit gilt $\\psi(0) = \\psi(L) = 0$. Ansatz: $\\psi(x) = A\\sin(kx) + B\\cos(kx)$.',
    ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', n:{int:[1, 5]}}, defs:{'ψ(x)':'A sin(k x) + B cos(k x)'},
      unknowns:{A:{ref:'sqrt(2/L)'}, B:{ref:'0', kind:'real'}, k:{ref:'nπ/L'}, E:{ref:'n^2 π^2 ħ^2/(2m L^2)'}}},
    lines:[
      {l:'-ħ^2/(2m) ψ\'\' = E ψ', why:{q:'Warum diese Gleichung?', opts:['Stationäre Schrödingergleichung mit $V = 0$ im Inneren', 'Normierung', 'Zeitabhängige Schrödingergleichung'], a:0, ex:'Innen ist $V = 0$, also bleibt nur die kinetische Energie.'}},
      {l:'E = ħ^2 k^2/(2m)', why:{q:'Wie folgt das aus der Gleichung?', opts:['$\\psi\'\' = -k^2\\psi$ für den Ansatz', 'aus der Randbedingung', 'aus der Normierung'], a:0, ex:'Für $A\\sin kx + B\\cos kx$ gilt $\\psi\'\' = -k^2\\psi$, also $\\frac{\\hbar^2k^2}{2m}\\psi = E\\psi$.'}},
      {l:'ψ(0) = B = 0', why:{q:'Was folgt aus $\\psi(0) = 0$?', opts:['$B = 0$, weil $\\sin 0 = 0$ und $\\cos 0 = 1$', '$A = 0$', '$k = 0$'], a:0, ex:'Übrig bleibt $\\psi = A\\sin(kx)$.'}},
      {l:'ψ(L) = A sin(kL) = 0', why:{q:'Warum setzt man nicht einfach $A = 0$?', opts:['Dann wäre $\\psi \\equiv 0$, also kein Teilchen.', 'Weil $A$ normiert ist.', 'Das darf man.'], a:0, ex:'$\\psi = 0$ ist nicht normierbar. Also muss $\\sin(kL) = 0$ sein.'}},
      {l:'k = nπ/L', w:'n = 1, 2, 3, …', why:{q:'Warum nicht $n = 0$ oder negative $n$?', opts:['$n = 0$ gibt $\\psi \\equiv 0$; negative $n$ geben nur $-\\psi_n$, denselben Zustand.', 'Weil negative Energien verboten sind.', 'Das ist reine Konvention.'], a:0, ex:'$\\sin(-kx) = -\\sin(kx)$ unterscheidet sich nur durch die Phase $-1$.'}},
      {l:'E = n^2 π^2 ħ^2/(2m L^2)', why:{q:'Was bedeutet das Ergebnis?', opts:['Nur diskrete Energien sind möglich; die kleinste ist $E_1 > 0$.', 'Jede Energie ist möglich.', 'Die Energie hängt nicht von $L$ ab.'], a:0, ex:'Das ist die Quantisierung durch Einschluss. $E_1 > 0$ ist die Nullpunktsenergie.'}}
    ],
    faded:{id:'kasten-fade', title:'Jetzt du: Normierung von $\\psi_n = A\\sin(n\\pi x/L)$',
      text:'Bestimme $A > 0$. Benutze $\\int_0^L\\sin^2(n\\pi x/L)\\,dx = L/2$.',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', n:{int:[1, 5]}}, defs:{'ψ(x)':'A sin(nπ x/L)'}, unknowns:{A:{ref:'sqrt(2/L)', alt:['-sqrt(2/L)']}}},
      given:['∫_0^L |ψ|^2 dx = 1', '|A|^2 ∫_0^L sin(nπx/L)^2 dx = 1'],
      goals:[{id:'a', prompt:'Bestimme $A$.', type:'solve', unknown:'A', points:2, hints:['Setze das Integral $L/2$ ein.'],
        model:['∫_0^L |ψ|^2 dx = 1', '|A|^2 ∫_0^L sin(nπx/L)^2 dx = 1', {l:'|A|^2 L/2 = 1', gap:'|A|^2 · ▢ = 1'}, 'A = sqrt(2/L)']}]}
  },
  puzzle:{
    title:'Kann das Teilchen ruhen?',
    text:'Klassisch kann ein Teilchen im Kasten einfach liegen bleiben: Energie null.\n\nGilt das auch quantenmechanisch?',
    q:{q:'Deine Vermutung:', opts:['Ja, $E = 0$ ist mit $n = 0$ möglich.', 'Nein, die kleinste Energie ist $E_1 = \\pi^2\\hbar^2/(2mL^2) > 0$.', 'Ja, wenn die Wände weit genug weg sind.', 'Nein, die Energie ist immer unendlich.'], a:1, ex:'$n = 0$ liefert $\\psi \\equiv 0$ – kein Zustand.'},
    reveal:'Zwei Begründungen, die zusammenpassen:\n\n- **Rechnung:** $k = n\\pi/L$ mit $n = 0$ gibt $\\psi = A\\sin 0 = 0$. Das ist nicht normierbar, also kein Zustand. Die kleinste Energie ist $E_1 = \\frac{\\pi^2\\hbar^2}{2mL^2}$ (Nullpunktsenergie).\n- **Unschärfe:** Das Teilchen ist auf die Länge $L$ eingeschränkt, also $\\Delta x \\lesssim L$. Dann ist $\\Delta p \\gtrsim \\hbar/(2L)$ und damit $\\langle p^2\\rangle > 0$ – die kinetische Energie kann nicht null sein.\n\nJe enger der Kasten, desto größer $E_1 \\propto 1/L^2$. Das erklärt, warum eingesperrte Elektronen (Quantenpunkte) je nach Größe in verschiedenen Farben leuchten.'
  },
  clarify:{
    core:'Im Kasten mit unendlich hohen Wänden gilt $\\psi(0) = \\psi(L) = 0$. Daraus folgen\n\n$$\\psi_n(x) = \\sqrt{\\tfrac{2}{L}}\\sin\\!\\left(\\frac{n\\pi x}{L}\\right),\\qquad E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2},\\qquad n = 1, 2, 3, \\dots$$\n\nDie $\\psi_n$ sind **orthonormal** ($\\langle\\psi_m|\\psi_n\\rangle = \\delta_{mn}$) und **vollständig**: Jeder Anfangszustand lässt sich entwickeln, $\\Psi(x,0) = \\sum_n c_n\\psi_n(x)$ mit $c_n = \\int_0^L\\psi_n(x)\\Psi(x,0)\\,dx$. Die Zeitentwicklung ist dann einfach: $\\Psi(x,t) = \\sum_n c_n\\psi_n(x)e^{-iE_nt/\\hbar}$.\n\nEine Energiemessung liefert $E_n$ mit Wahrscheinlichkeit $|c_n|^2$; der Mittelwert ist $\\langle H\\rangle = \\sum_n|c_n|^2E_n$.',
    keys:[
      '$\\psi_n$ hat $n - 1$ Knoten im Inneren; die Wellenlänge ist $\\lambda_n = 2L/n$.',
      'Die Ableitung $\\psi\'$ springt an den Wänden – das ist hier erlaubt, weil $V$ dort unendlich ist.',
      'Für $c_n$ braucht man eigentlich $\\psi_n^*$; die $\\psi_n$ sind hier reell.',
      '$\\sum_n|c_n|^2 = 1$ ist eine gute Kontrolle der Rechnung.',
      'In jedem $\\psi_n$ ist $\\langle x\\rangle = L/2$ und $\\langle p\\rangle = 0$, aber $\\langle p^2\\rangle = (n\\pi\\hbar/L)^2 = 2mE_n$.'
    ],
    errors:[
      'Die Energie aus $E = \\hbar k$ statt $E = \\hbar^2k^2/2m$ bilden.',
      'Bei Überlagerungen nur die Wahrscheinlichkeiten, nicht die Phasen $e^{-iE_nt/\\hbar}$ mitnehmen.',
      'Den Faktor $1/\\sqrt2$ der Normierung vergessen, z. B. $\\langle H\\rangle = E_1 + E_2$ statt $\\tfrac12(E_1 + E_2)$.',
      'Annehmen, das Teilchen sei immer in einem Eigenzustand. Eine Messung von $E$ kann verschiedene Werte liefern.'
    ],
    checks:[
      {q:'Der Kasten wird doppelt so breit. Was passiert mit $E_1$?', opts:['Sie wird ein Viertel so groß.', 'Sie halbiert sich.', 'Sie bleibt gleich.'], a:0, ex:'$E_1 \\propto 1/L^2$.'},
      {q:'$\\Psi(x,0) = \\frac{1}{\\sqrt3}\\psi_1 + \\sqrt{\\frac23}\\psi_2$. Mit welcher Wahrscheinlichkeit misst man $E_2$?', opts:['$2/3$', '$\\sqrt{2/3}$', '$1/2$'], a:0, ex:'$P(E_2) = |c_2|^2 = 2/3$.'}
    ]
  },
  lab:{type:'box', title:'Eigenfunktionen im Kasten',
    text:'Die Linien zeigen die Energien $E_n$ in Einheiten von $E_1$; auf der Linie des eingestellten $n$ ist $\\psi_n$ (oder $|\\psi_n|^2$) eingezeichnet.',
    questions:[
      {q:'Stelle $n = 3$ ein. Wie viele Nullstellen hat $\\psi_3$ im Inneren des Kastens?', opts:['2', '3', '1'], a:0, ex:'$\\psi_n$ hat $n - 1$ Knoten im Inneren.'},
      {q:'Wie groß ist $E_3/E_1$?', opts:['9', '3', '6'], a:0, ex:'$E_n \\propto n^2$.'}
    ],
    noPic:{q:'Ohne Bild: Wo ist $|\\psi_2|^2$ maximal?', opts:['bei $x = L/4$ und $x = 3L/4$', 'bei $x = L/2$', 'an den Wänden'], a:0, ex:'$\\sin^2(2\\pi x/L)$ ist maximal, wo $2\\pi x/L = \\pi/2, 3\\pi/2$. Bei $L/2$ liegt ein Knoten.'}},
  compare:{
    text:'Gesucht ist $\\langle H\\rangle$ für $\\Psi = \\frac{1}{\\sqrt2}(\\psi_1 + \\psi_2)$. Zwei richtige Wege:',
    ctx:BOX({defs:{'Ψ(x)':'1/sqrt(2) (ψ_1(x) + ψ_2(x))'}, state:'Ψ', normalized:true}),
    A:{name:'Über die Koeffizienten', text:'Hier ist $c_1 = c_2 = 1/\\sqrt2$.', model:['⟨H⟩ = 1/2 E_1 + 1/2 E_2', '= 5/2 E_1']},
    B:{name:'Integral im Ortsraum', model:['⟨H⟩ = ∫_0^L Ψ^* (-ħ^2/(2m)) Ψ\'\' dx', '= 1/2 (E_1 + E_2)', '= 5/2 E_1']},
    questions:[
      {q:'Warum fallen bei Weg B die Mischterme weg?', opts:['Wegen der Orthogonalität: $\\int\\psi_1\\hat H\\psi_2\\,dx = E_2\\int\\psi_1\\psi_2\\,dx = 0$', 'Weil $\\psi_1\\psi_2$ überall null ist.', 'Weil $E_1 = E_2$.'], a:0, ex:'$\\hat H\\psi_2 = E_2\\psi_2$, und $\\psi_1 \\perp \\psi_2$.'},
      {q:'Ändert sich $\\langle H\\rangle$ mit der Zeit?', opts:['Nein, die $|c_n|^2$ bleiben konstant.', 'Ja, es schwingt mit $(E_2 - E_1)/\\hbar$.', 'Ja, es nimmt ab.'], a:0, ex:'$|c_ne^{-iE_nt/\\hbar}|^2 = |c_n|^2$. Die Energie ist erhalten, obwohl $\\langle x\\rangle$ schwingt.'}
    ]
  },
  practice:[
    {id:'kasten-p1', title:'Symmetrischer Kasten von −a bis a',
      text:'Der Kasten reicht jetzt von $-a$ bis $a$ (Breite $2a$). Der Grundzustand ist gerade: $\\psi(x) = A\\cos(kx)$.',
      ctx:{coords:['x'], domain:{x:['-a', 'a']}, params:{a:'pos', m:'pos'}, defs:{'ψ(x)':'A cos(k x)'}, unknowns:{k:{ref:'π/(2a)'}, A:{ref:'1/sqrt(a)', alt:['-1/sqrt(a)']}, E:{ref:'π^2 ħ^2/(8m a^2)'}}},
      goals:[
        {id:'a', prompt:'a) Bestimme das kleinste $k > 0$ aus der Randbedingung.', type:'solve', unknown:'k', points:2, ph:'ψ(a) = A cos(k a) = 0', hints:['$\\cos u = 0$ zum ersten Mal bei $u = \\pi/2$.'],
          model:['ψ(a) = A cos(k a) = 0', 'k a = π/2', 'k = π/(2a)']},
        {id:'b', prompt:'b) Bestimme die Grundzustandsenergie $E$.', type:'solve', unknown:'E', points:2, ph:'-ħ^2/(2m) ψ\'\' = E ψ', hints:['$E = \\hbar^2k^2/(2m)$.'],
          model:['-ħ^2/(2m) ψ\'\' = E ψ', 'ħ^2 k^2/(2m) = E', 'E = π^2 ħ^2/(8m a^2)'],
          note:'Kontrolle: Mit der Breite $L = 2a$ ist das genau $E_1 = \\pi^2\\hbar^2/(2mL^2)$.'},
        {id:'c', prompt:'c) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, hints:['$\\int_{-a}^a\\cos^2(\\pi x/2a)\\,dx = a$.'],
          model:['∫_-a^a |ψ|^2 dx = 1', '|A|^2 ∫_-a^a cos(πx/(2a))^2 dx = 1', '|A|^2 a = 1', 'A = 1/sqrt(a)']}
      ]},
    {id:'kasten-p2', title:'Entwicklung eines Anfangszustands',
      text:'Zur Zeit $t = 0$ ist $\\Psi(x,0) = \\sqrt{30/L^5}\\,x(L-x)$ (normiert, siehe Thema 1). Entwickle nach $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$. Nützlich: $\\int_0^Lx(L-x)\\sin(\\pi x/L)\\,dx = 4L^3/\\pi^3$.',
      ctx:BOX({defs:{'Ψ(x)':'sqrt(30/L^5) x (L - x)'}, state:'Ψ', normalized:true}),
      goals:[
        {id:'a', prompt:'a) Berechne $c_1 = \\langle\\psi_1|\\Psi\\rangle$.', type:'value', target:'8 sqrt(15)/π^3', points:3, ph:'c_1 = ⟨ψ_1|Ψ⟩',
          hints:['$c_1 = \\int_0^L\\psi_1(x)\\Psi(x,0)\\,dx$.', 'Zieh die Konstanten $\\sqrt{2/L}\\sqrt{30/L^5} = \\sqrt{60}/L^3$ vor das Integral.'],
          model:['c_1 = ⟨ψ_1|Ψ⟩', '= sqrt(2/L) sqrt(30/L^5) ∫_0^L x (L - x) sin(πx/L) dx', '= sqrt(60)/L^3 · 4L^3/π^3', '= 8 sqrt(15)/π^3']},
        {id:'b', prompt:'b) Mit welcher Wahrscheinlichkeit liefert eine Energiemessung $E_1$?', type:'value', target:'960/π^6', points:2, ph:'|⟨ψ_1|Ψ⟩|^2 = …', hints:['$P(E_1) = |c_1|^2$.'],
          model:['|⟨ψ_1|Ψ⟩|^2 = (8 sqrt(15)/π^3)^2', '= 960/π^6'], note:'$960/\\pi^6 \\approx 0{,}9986$: Die Parabel ähnelt dem Grundzustand sehr.'},
        {id:'c', prompt:'c) Berechne $\\langle H\\rangle$ direkt im Ortsraum.', type:'value', target:'5ħ^2/(m L^2)', points:3, ph:'⟨H⟩ = ∫_0^L Ψ (-ħ^2/(2m)) Ψ\'\' dx',
          hints:['$\\Psi\'\' = -2\\sqrt{30/L^5}$ ist konstant.', '$\\int_0^Lx(L-x)\\,dx = L^3/6$.'],
          model:['⟨H⟩ = ∫_0^L Ψ (-ħ^2/(2m)) Ψ\'\' dx', '= ħ^2/m · 30/L^5 ∫_0^L x (L - x) dx', '= ħ^2/m · 30/L^5 · L^3/6', '= 5ħ^2/(m L^2)'],
          note:'Vergleich: $5\\hbar^2/(mL^2) = \\frac{10}{\\pi^2}E_1 \\approx 1{,}013\\,E_1$ – etwas über der Grundzustandsenergie, wie es sein muss.'}
      ]},
    {id:'kasten-p3', title:'Zeitentwicklung einer Überlagerung',
      text:'$\\Psi(x,t) = \\frac{1}{\\sqrt2}\\left(\\psi_1e^{-iE_1t/\\hbar} + \\psi_2e^{-iE_2t/\\hbar}\\right)$. Aus Thema 2 kennst du $\\langle x\\rangle(t) = \\frac L2 - \\frac{16L}{9\\pi^2}\\cos\\left(\\frac{(E_2-E_1)t}{\\hbar}\\right)$.',
      ctx:BOX({coords:['x', 't'], defs:{'Ψ(x,t)':'1/sqrt(2) (ψ_1(x) e^(-i E_1 t/ħ) + ψ_2(x) e^(-i E_2 t/ħ))'}, state:'Ψ', normalized:true}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle p\\rangle(t)$ über $\\langle p\\rangle = m\\,\\frac{d\\langle x\\rangle}{dt}$.', type:'value', target:'8ħ/(3L) sin((E_2 - E_1) t/ħ)', points:3, ph:'⟨p⟩ = m d/dt ⟨x⟩',
          hints:['Leite den Kosinus nach $t$ ab.', '$E_2 - E_1 = 3\\pi^2\\hbar^2/(2mL^2)$.'],
          model:['⟨p⟩ = m d/dt ⟨x⟩', '= m d/dt (L/2 - 16L/(9π^2) cos((E_2 - E_1) t/ħ))', '= m · 16L/(9π^2) · (E_2 - E_1)/ħ · sin((E_2 - E_1) t/ħ)', '= 8ħ/(3L) sin((E_2 - E_1) t/ħ)'],
          note:'$\\langle p\\rangle = m\\,d\\langle x\\rangle/dt$ ist ein Spezialfall des Ehrenfest-Theorems (Thema 6).'},
        {id:'b', prompt:'b) Berechne $\\langle H\\rangle$ durch $m, L, \\hbar$.', type:'value', target:'5π^2 ħ^2/(4m L^2)', points:2, hints:['$\\langle H\\rangle = \\sum|c_n|^2E_n$.'],
          model:['⟨H⟩ = 1/2 E_1 + 1/2 E_2', '= 5π^2 ħ^2/(4m L^2)']}
      ]},
    {id:'kasten-p4', title:'Orthogonalität der Eigenfunktionen',
      text:'Zeige für ganze Zahlen $n \\ne j$, dass $\\psi_n$ und $\\psi_j$ orthogonal sind. Nützlich: $\\sin a\\sin b = \\tfrac12[\\cos(a - b) - \\cos(a + b)]$.',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', j:{int:[1, 4], ne:'n'}, n:{int:[1, 4]}}, defs:{'ψ_q(x)':'sqrt(2/L) sin(qπx/L)'}},
      goals:[
        {id:'a', prompt:'Berechne $\\langle\\psi_n|\\psi_j\\rangle$ für $n \\ne j$.', type:'value', target:'0', points:3, ph:'⟨ψ_n|ψ_j⟩ = 2/L ∫_0^L sin(nπx/L) sin(jπx/L) dx',
          hints:['Forme das Produkt in eine Differenz von Kosinusfunktionen um.', 'Die Stammfunktionen $\\sin((n\\pm j)\\pi x/L)$ sind bei $0$ und $L$ null.'],
          model:['⟨ψ_n|ψ_j⟩ = 2/L ∫_0^L sin(nπx/L) sin(jπx/L) dx', '= 1/L ∫_0^L (cos((n - j)πx/L) - cos((n + j)πx/L)) dx', '= 1/L [L sin((n - j)πx/L)/((n - j)π) - L sin((n + j)πx/L)/((n + j)π)]_0^L', '= 0']}
      ]},
    {id:'kasten-p5', title:'Unschärfen im n-ten Zustand',
      text:'$\\psi(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$. Es gilt $\\langle x\\rangle = L/2$ und $\\langle p\\rangle = 0$. Nützlich: $\\frac2L\\int_0^Lx^2\\sin^2(n\\pi x/L)dx = L^2\\left(\\frac13 - \\frac{1}{2n^2\\pi^2}\\right)$.',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', n:{int:[1, 5]}}, defs:{'ψ(x)':'sqrt(2/L) sin(nπ x/L)'}, state:'ψ', normalized:true},
      goals:[
        {id:'a', prompt:'a) Berechne $\\Delta x$.', type:'value', target:'L sqrt(1/12 - 1/(2n^2π^2))', points:3, ph:'⟨x^2⟩ = 2/L ∫_0^L x^2 sin(nπx/L)^2 dx',
          hints:['$\\Delta x = \\sqrt{\\langle x^2\\rangle - (L/2)^2}$.'],
          model:['⟨x^2⟩ = 2/L ∫_0^L x^2 sin(nπx/L)^2 dx', '= L^2 (1/3 - 1/(2n^2π^2))', 'Δx = sqrt(L^2 (1/3 - 1/(2n^2π^2)) - L^2/4)', '= L sqrt(1/12 - 1/(2n^2π^2))']},
        {id:'b', prompt:'b) Berechne $\\Delta p$.', type:'value', target:'nπħ/L', points:2, ph:'⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx',
          hints:['$\\psi\'\' = -(n\\pi/L)^2\\psi$.'],
          model:['⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx', '= (nπħ/L)^2', 'Δp = nπħ/L'],
          note:'Für $n = 1$: $\\Delta x\\,\\Delta p = \\hbar\\sqrt{\\pi^2/12 - 1/2} \\approx 0{,}57\\,\\hbar > \\hbar/2$.'}
      ]}
  ],
  final:[
    {q:'Wie verhält sich $E_2$ zu $E_1$?', opts:['$E_2 = 4E_1$', '$E_2 = 2E_1$', '$E_2 = E_1 + \\hbar\\omega$'], a:0, ex:'$E_n = n^2E_1$.'},
    {task:{id:'kasten-f1', title:'Normierung einer Überlagerung', text:'$\\Psi(x,0) = A(\\psi_1 + 2\\psi_2)$ mit den orthonormalen $\\psi_n$ des Kastens.',
      ctx:BOX({defs:{'Ψ(x)':'A (ψ_1(x) + 2 ψ_2(x))'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}}),
      goals:[{id:'a', prompt:'Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, model:['∫_0^L |Ψ|^2 dx = 1', '|A|^2 (1 + 4) = 1', 'A = 1/sqrt(5)']}]}},
    {q:'Ein Teilchen ist in $\\Psi = \\frac{1}{\\sqrt2}(\\psi_1 + \\psi_2)$. Was liefert eine einzelne Energiemessung?', opts:['entweder $E_1$ oder $E_2$, je mit Wahrscheinlichkeit $1/2$', 'immer $\\frac12(E_1 + E_2)$', 'immer $E_2$'], a:0, ex:'Messwerte sind Eigenwerte. Nur der Mittelwert vieler Messungen ist $\\frac12(E_1 + E_2)$.'},
    {task:{id:'kasten-f2', title:'Erwartungswert', text:'$\\psi_1(x) = \\sqrt{2/L}\\sin(\\pi x/L)$.', ctx:BOX({state:'ψ_1', normalized:true}),
      goals:[{id:'a', prompt:'Berechne $\\langle\\psi_1|\\hat x|\\psi_1\\rangle$.', type:'value', target:'L/2', points:2, model:['⟨ψ_1|x̂|ψ_1⟩ = 2/L ∫_0^L x sin(πx/L)^2 dx', '= L/2']}]}}
  ],
  errors:[
    {id:'kasten-e1', title:'Energieerwartungswert einer Überlagerung',
      text:'Für $\\Psi = \\frac{1}{\\sqrt2}(\\psi_1 + \\psi_2)$ wird $\\langle H\\rangle$ berechnet:',
      ctx:BOX({defs:{'Ψ(x)':'1/sqrt(2) (ψ_1(x) + ψ_2(x))'}, state:'Ψ', normalized:true}),
      lines:['⟨H⟩ = ⟨Ψ|Ĥ|Ψ⟩', '= ⟨ψ_1|Ĥ|ψ_1⟩ + ⟨ψ_2|Ĥ|ψ_2⟩', '= E_1 + E_2', '= 5E_1'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Der Faktor $(1/\\sqrt2)^2 = 1/2$ aus der Normierung fehlt.', 'Die Mischterme fehlen; sie sind nicht null.', '$\\langle\\psi_2|\\hat H|\\psi_2\\rangle$ ist nicht $E_2$.'], a:0, ex:'Die Mischterme sind wegen der Orthogonalität tatsächlich null. Aber jeder Diagonalterm trägt $|c_n|^2 = 1/2$.'},
      fix:{id:'a', prompt:'Berichtige: Wie groß ist $\\langle H\\rangle$ in Einheiten von $E_1$?', type:'value', target:'5/2 E_1', model:['⟨H⟩ = 1/2 (⟨ψ_1|Ĥ|ψ_1⟩ + ⟨ψ_2|Ĥ|ψ_2⟩)', '= 1/2 (E_1 + E_2)', '= 5/2 E_1']}}
  ]
});
})();
lexe('kasten', 'Unendlicher Potentialtopf', '$V = 0$ für $0 < x < L$, sonst $\\infty$. Eigenfunktionen $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$, Energien $E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$, $n = 1, 2, \\dots$ In $\\psi_n$: $\\langle x\\rangle = L/2$, $\\langle p\\rangle = 0$, $\\langle p^2\\rangle = (n\\pi\\hbar/L)^2$.', {topic:'kasten'});
lexe('nullpunktsenergie', 'Nullpunktsenergie', 'Die kleinste mögliche Energie eines gebundenen Teilchens ist größer als das Minimum des Potenzials. Im Kasten $E_1 = \\pi^2\\hbar^2/(2mL^2)$, beim Oszillator $\\hbar\\omega/2$. Ursache: Einschluss erzwingt $\\Delta p > 0$.', {topic:'kasten'});
lexe('entwicklung', 'Entwicklung nach Eigenfunktionen', '$\\Psi(x,0) = \\sum_nc_n\\psi_n(x)$ mit $c_n = \\langle\\psi_n|\\Psi(0)\\rangle = \\int\\psi_n^*\\Psi(x,0)\\,dx$. Zeitentwicklung: $\\Psi(x,t) = \\sum_nc_n\\psi_ne^{-iE_nt/\\hbar}$. Kontrolle: $\\sum|c_n|^2 = 1$. $P(E_n) = |c_n|^2$, $\\langle H\\rangle = \\sum|c_n|^2E_n$.', {topic:'kasten'});
lexe('orthonormal', 'Orthonormalität', '$\\langle\\psi_m|\\psi_n\\rangle = \\int\\psi_m^*\\psi_n\\,dx = \\delta_{mn}$. Eigenfunktionen eines hermiteschen Operators zu verschiedenen Eigenwerten sind automatisch orthogonal; normiert man sie, sind sie orthonormal.', {topic:'kasten'});
lexe('zeitentwicklung', 'Zeitentwicklung', 'Bei zeitunabhängigem $\\hat H$: Jeder Energieanteil dreht seine Phase mit $e^{-iE_nt/\\hbar}$. Messbare Größen ändern sich nur durch Interferenz verschiedener Energien, mit den Kreisfrequenzen $(E_m - E_n)/\\hbar$.', {topic:'kasten'});
