/* ===== Thema 1: Wellenfunktion und Wahrscheinlichkeit ===== */
topic({
  id:'wf', math:['m-komplex', 'm-analysis'], title:'Wellenfunktion und Wahrscheinlichkeit', short:'Wellenfunktion',
  src:'Griffiths & Schroeter Kap. 1 · Nolting 5/1 Kap. 2 · Schwabl Kap. 2',
  goals:[
    'Ich kann eine Wellenfunktion normieren, auch wenn sie komplex ist.',
    'Ich kann Wahrscheinlichkeiten für Intervalle und Erwartungswerte $\\langle x\\rangle$, $\\langle x^2\\rangle$ berechnen.',
    'Ich kann die Unschärfe $\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$ bestimmen und deuten.'
  ],
  needs:'komplexe Zahlen ($z^*z = |z|^2$) · Integrale mit Polynomen, $e^{-ax}$ und $\\sin^2$ · Mittelwert einer Verteilung',
  check:[
    {q:'Für $z = 3 + 4i$ ist $|z|^2 = z^*z$ gleich …', opts:['$25$', '$-7 + 24i$', '$7$'], a:0, ex:'$z^*z = (3-4i)(3+4i) = 9 + 16 = 25$. Dagegen ist $z^2 = -7 + 24i$ – nicht dasselbe.', lex:'komplexe-zahlen', prev:'m-komplex'},
    {q:'$\\int_0^L \\sin^2(\\pi x/L)\\,dx$ ist …', opts:['$L/2$', '$L$', '$\\pi/2$'], a:0, ex:'Mit $\\sin^2 u = \\tfrac12(1 - \\cos 2u)$ bleibt nur der konstante Teil: $L/2$.', lex:'integrale'},
    {q:'Eine Zufallsgröße hat die Dichte $\\rho(x)$. Ihr Mittelwert ist …', opts:['$\\int x\\,\\rho(x)\\,dx$', '$\\int \\rho(x)\\,dx$', 'der Ort des Maximums von $\\rho$'], a:0, ex:'Mittelwert = mit $\\rho$ gewichtetes Integral über $x$. Das Maximum ist der wahrscheinlichste Wert, im Allgemeinen nicht der Mittelwert.', lex:'erwartungswert'},
    {q:'Was gibt $|\\psi(x,t)|^2\\,dx$ an?', opts:['die Wahrscheinlichkeit, das Teilchen zur Zeit $t$ zwischen $x$ und $x+dx$ zu finden', 'die Ladung zwischen $x$ und $x + dx$', 'die Energie am Ort $x$'], a:0, ex:'Das ist die Bornsche Wahrscheinlichkeitsdeutung.', lex:'born'}
  ],
  example:{
    title:'Normierung einer Exponentialfunktion',
    text:'Ein Teilchen auf der ganzen $x$-Achse hat die Wellenfunktion $\\psi(x) = A\\,e^{-|x|/a}$ mit $a > 0$. Bestimme $A > 0$ so, dass $\\psi$ normiert ist.',
    ctx:CTX.line({params:{a:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(-|x|/a)'}, unknowns:{A:{ref:'1/sqrt(a)'}}}),
    lines:[
      {l:'∫_-∞^∞ |ψ|^2 dx = 1', why:{q:'Warum beginnt man so?', opts:['Das Teilchen ist mit Wahrscheinlichkeit 1 irgendwo.', 'Weil $\\psi$ eine Energie ist.', 'Weil $\\psi(0) = 1$ sein muss.'], a:0, ex:'Die Gesamtwahrscheinlichkeit ist 1: $\\int|\\psi|^2dx = 1$.'}},
      {l:'|A|^2 ∫_-∞^∞ e^(-2|x|/a) dx = 1', why:{q:'Woher kommt die 2 im Exponenten?', opts:['$|e^{-|x|/a}|^2 = e^{-2|x|/a}$', 'Das ist ein Tippfehler.', 'Von der Ableitung.'], a:0, ex:'Quadrieren verdoppelt den Exponenten: $(e^{u})^2 = e^{2u}$.'}},
      {l:'2|A|^2 ∫_0^∞ e^(-2x/a) dx = 1', why:{q:'Warum darf man nur über $x > 0$ integrieren und mal 2 nehmen?', opts:['Der Integrand ist gerade: $f(-x) = f(x)$.', 'Weil $\\psi$ für $x < 0$ null ist.', 'Weil Integrale immer positiv sind.'], a:0, ex:'Für gerade Integranden gilt $\\int_{-\\infty}^\\infty = 2\\int_0^\\infty$.'}},
      {l:'2|A|^2 · a/2 = 1', why:{q:'Welche Regel steckt hier?', opts:['$\\int_0^\\infty e^{-kx}dx = 1/k$ mit $k = 2/a$', '$\\int e^{-kx}dx = -k$', '$e^0 = 0$'], a:0, ex:'$\\int_0^\\infty e^{-kx}\\,dx = [-e^{-kx}/k]_0^\\infty = 1/k$.'}},
      {l:'A = 1/sqrt(a)', w:'Phase frei: wähle A reell, positiv', why:{q:'Warum darf man $A > 0$ wählen?', opts:['Ein globaler Phasenfaktor $e^{i\\alpha}$ ändert keine Messgröße.', 'Weil $A^2 = 1/a$ nur eine Lösung hat.', 'Weil negative Wahrscheinlichkeiten verboten sind.'], a:0, ex:'$\\psi$ und $e^{i\\alpha}\\psi$ beschreiben denselben Zustand. Deshalb legt die Normierung nur $|A|$ fest.'}}
    ],
    faded:{id:'wf-fade', title:'Jetzt du: $\\psi(x) = A\\,x\\,e^{-x/a}$ für $x > 0$', text:'Für $x < 0$ ist $\\psi = 0$. Bestimme $A > 0$. Nützlich: $\\int_0^\\infty x^n e^{-kx}\\,dx = n!/k^{n+1}$.',
      ctx:CTX.line({params:{a:'pos', m:'pos'}, domain:{x:['0', '∞']}, defs:{'ψ(x)':'A x e^(-x/a)'}, unknowns:{A:{ref:'2/a^(3/2)'}}}),
      given:['∫_0^∞ |ψ|^2 dx = 1', '|A|^2 ∫_0^∞ x^2 e^(-2x/a) dx = 1'],
      goals:[{id:'a', prompt:'Bestimme $A$.', type:'solve', unknown:'A', hints:['Setze $n = 2$ und $k = 2/a$ in die Formel ein.', '$2!/(2/a)^3 = a^3/4$'],
        model:['∫_0^∞ |ψ|^2 dx = 1', '|A|^2 ∫_0^∞ x^2 e^(-2x/a) dx = 1', {l:'|A|^2 · 2!/(2/a)^3 = 1', gap:'|A|^2 · ▢ = 1'}, '|A|^2 a^3/4 = 1', 'A = 2/a^(3/2)']}]}
  },
  puzzle:{
    title:'Genau in der Mitte?',
    text:'Ein Teilchen im Kasten $0 < x < L$ hat die Wellenfunktion $\\psi(x) = \\sqrt{2/L}\\,\\sin(\\pi x/L)$. Die Dichte $|\\psi|^2$ ist bei $x = L/2$ am größten.\n\nWie groß ist die Wahrscheinlichkeit, das Teilchen bei einer Messung **exakt** bei $x = L/2$ zu finden?',
    q:{q:'Deine Vermutung:', opts:['$|\\psi(L/2)|^2 = 2/L$', '$1$, weil dort das Maximum liegt', '$0$', '$1/2$'], a:2, ex:'Für einen einzelnen Punkt ist die Wahrscheinlichkeit null.'},
    reveal:'$|\\psi(x)|^2$ ist eine **Dichte** (Einheit 1/Länge), keine Wahrscheinlichkeit. Wahrscheinlichkeiten gibt es nur für Intervalle: $P(a < x < b) = \\int_a^b|\\psi|^2dx$. Ein Punkt hat die Breite null, also $P = 0$. Schon der Wert $2/L$ zeigt das Problem: Für $L = 0{,}5\\,\\mathrm{nm}$ wäre er $4\\cdot 10^9\\,\\mathrm{m}^{-1}$ – keine Zahl zwischen 0 und 1.\n\nSinnvoll ist: Die Wahrscheinlichkeit für ein kleines Intervall $[L/2, L/2 + \\Delta x]$ ist ungefähr $|\\psi(L/2)|^2\\,\\Delta x$.'
  },
  clarify:{
    core:'Der Zustand eines Teilchens steckt in der komplexen Wellenfunktion $\\psi(x,t)$. Nach Born ist $|\\psi(x,t)|^2 = \\psi^*\\psi$ die **Wahrscheinlichkeitsdichte** für den Ort:\n\n$$P(a<x<b) = \\int_a^b |\\psi(x,t)|^2\\,dx,\\qquad \\int_{-\\infty}^{\\infty}|\\psi|^2\\,dx = 1.$$\n\nErwartungswerte sind gewichtete Mittel über viele gleich präparierte Systeme: $\\langle x\\rangle = \\int x|\\psi|^2dx$, $\\langle x^2\\rangle = \\int x^2|\\psi|^2dx$, und die Unschärfe ist $\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$.',
    keys:[
      'Immer $|\\psi|^2 = \\psi^*\\psi$ verwenden, nie $\\psi^2$ – bei komplexem $\\psi$ ist das ein Unterschied.',
      'Normierung legt nur $|A|$ fest; die globale Phase ist frei. Üblich: $A$ reell und positiv.',
      'In einer Dimension hat $\\psi$ die Einheit $1/\\sqrt{\\text{Länge}}$. Eine Einheitenkontrolle findet viele Fehler.',
      'Symmetrie spart Arbeit: Ist $|\\psi|^2$ symmetrisch um $x_0$, dann ist $\\langle x\\rangle = x_0$.',
      '$\\langle x\\rangle$ ist ein Mittelwert über viele Messungen, nicht der Ausgang einer einzelnen Messung und nicht unbedingt der wahrscheinlichste Ort.'
    ],
    errors:[
      '$\\int \\psi^2 dx = 1$ statt $\\int|\\psi|^2dx = 1$ (bei $\\psi \\propto e^{ikx}$ geht das schief).',
      '$\\langle x^2\\rangle$ mit $\\langle x\\rangle^2$ verwechseln. Ihre Differenz ist gerade $(\\Delta x)^2 \\ge 0$.',
      'Grenzen vergessen: Außerhalb des Kastens ist $\\psi = 0$, dort wird nicht integriert.',
      'Das Ergebnis „$P = 1{,}2$“ nicht bemerken: Wahrscheinlichkeiten liegen zwischen 0 und 1.'
    ],
    more:[{title:'Warum bleibt die Normierung zeitlich erhalten?', text:'Aus der Schrödingergleichung folgt $\\frac{d}{dt}\\int|\\psi|^2dx = 0$, wenn $\\psi$ im Unendlichen schnell genug abfällt (Thema 2: Kontinuitätsgleichung). Man muss also nur einmal normieren.'}],
    checks:[
      {q:'$\\psi(x) = A\\,e^{ikx}e^{-x^2/2}$. Was ergibt $|\\psi|^2$?', opts:['$|A|^2e^{-x^2}$', '$A^2e^{2ikx}e^{-x^2}$', '$|A|^2e^{-x^2/2}$'], a:0, ex:'$|e^{ikx}|^2 = 1$, und $(e^{-x^2/2})^2 = e^{-x^2}$.'},
      {q:'Ein Zustand hat $\\langle x\\rangle = 0$ und $\\langle x^2\\rangle = 4\\,\\mathrm{nm}^2$. Wie groß ist $\\Delta x$?', opts:['$2\\,\\mathrm{nm}$', '$4\\,\\mathrm{nm}$', '$16\\,\\mathrm{nm}$'], a:0, ex:'$\\Delta x = \\sqrt{4 - 0}\\,\\mathrm{nm} = 2\\,\\mathrm{nm}$.'}
    ]
  },
  lab:{type:'prob', title:'Dichte, Intervall und Erwartungswert',
    text:'Wähle eine Wellenfunktion im Kasten ($L = 1$). Die Fläche unter $|\\psi|^2$ zwischen den Grenzen ist die Wahrscheinlichkeit. Die rote Linie ist $\\langle x\\rangle$, der helle Streifen $\\langle x\\rangle \\pm \\Delta x$.',
    questions:[
      {q:'Stelle „(ψ₁ + ψ₂)/√2“ ein. Wo liegt $\\langle x\\rangle$?', opts:['links von der Mitte, bei etwa $0{,}32L$', 'genau bei $L/2$', 'rechts von der Mitte'], a:0, ex:'Der Mischterm $2\\psi_1\\psi_2$ ist links positiv und rechts negativ. Die Dichte kippt nach links: $\\langle x\\rangle = L/2 - 16L/(9\\pi^2) \\approx 0{,}32L$.'},
      {q:'Grundzustand ψ₁: Wie groß ist die Wahrscheinlichkeit für $0 < x < L/4$? (Grenzen einstellen)', opts:['etwa $0{,}09$', 'genau $0{,}25$', 'etwa $0{,}5$'], a:0, ex:'$\\int_0^{L/4}\\tfrac2L\\sin^2(\\pi x/L)dx = \\tfrac14 - \\tfrac{1}{2\\pi} \\approx 0{,}091$ – weniger als ein Viertel, weil die Dichte am Rand klein ist.'}
    ],
    noPic:{q:'Ohne Bild: $\\psi(x) = A\\,x(L-x)$ im Kasten. Wie groß ist $P(0 < x < L/2)$?', opts:['$1/2$', '$1/4$', 'Das lässt sich ohne Integral nicht sagen.'], a:0, ex:'$|\\psi|^2$ ist symmetrisch um $L/2$, also liegt genau die Hälfte der Wahrscheinlichkeit links.'}},
  compare:{
    text:'Gesucht ist $\\langle x\\rangle$ für $\\psi(x) = A\\,x(L-x)$ mit $A = \\sqrt{30/L^5}$. Zwei richtige Wege:',
    ctx:CTX.box({defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}, normalized:true}),
    A:{name:'Ausrechnen', model:['⟨x⟩ = ∫_0^L x |ψ|^2 dx', '= 30/L^5 ∫_0^L x^3 (L - x)^2 dx', '= 30/L^5 · L^6/60', '= L/2']},
    B:{name:'Symmetrie', text:'Mit $u = L - x$ gilt $|\\psi(L - u)|^2 = |\\psi(u)|^2$: Die Dichte ist spiegelsymmetrisch um $L/2$.', model:['⟨x - L/2⟩ = ∫_0^L (x - L/2) |ψ|^2 dx', '= 0', {l:'⟨x⟩ = L/2', w:'ungerader Integrand um L/2'}]},
    questions:[
      {q:'Wann darf man Weg B benutzen?', opts:['wenn $|\\psi|^2$ symmetrisch um einen Punkt $x_0$ ist', 'wenn $\\psi$ reell ist', 'immer'], a:0, ex:'Entscheidend ist die Symmetrie der Dichte, nicht von $\\psi$ selbst. Für $\\psi_1 + \\psi_2$ im Kasten klappt es zum Beispiel nicht.'},
      {q:'Bei $\\langle x^2\\rangle$ hilft die Symmetrie …', opts:['nicht direkt: man muss integrieren', 'genauso: $\\langle x^2\\rangle = L^2/4$', 'gar nicht, weil $x^2$ nicht definiert ist'], a:0, ex:'$\\langle x^2\\rangle \\ne \\langle x\\rangle^2$. Hier ist $\\langle x^2\\rangle = 2L^2/7$, größer als $L^2/4$.'}
    ]
  },
  practice:[
    {id:'wf-p1', title:'Parabel im Kasten',
      text:'Im Kasten $0 < x < L$ ist $\\psi(x) = A\\,x(L-x)$, außerhalb $\\psi = 0$.',
      ctx:CTX.box({defs:{'ψ(x)':'A x (L - x)'}, unknowns:{A:{ref:'sqrt(30/L^5)', alt:['-sqrt(30/L^5)']}}}),
      goals:[
        {id:'a', prompt:'a) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, ph:'∫_0^L |ψ|^2 dx = 1',
          hints:['Setze $\\psi$ in $\\int_0^L|\\psi|^2dx = 1$ ein und ziehe $|A|^2$ vor das Integral.', '$\\int_0^L x^2(L-x)^2dx = L^5/30$ (ausmultiplizieren: $L^2x^2 - 2Lx^3 + x^4$).'],
          model:[{l:'∫_0^L |ψ|^2 dx = 1', w:'Normierung'}, '|A|^2 ∫_0^L x^2 (L - x)^2 dx = 1', {l:'|A|^2 ∫_0^L (L^2 x^2 - 2L x^3 + x^4) dx = 1', w:'ausmultiplizieren'}, {l:'|A|^2 (L^5/3 - L^5/2 + L^5/5) = 1', gap:'|A|^2 (▢) = 1'}, '|A|^2 L^5/30 = 1', 'A = sqrt(30/L^5)'],
          mistakes:[{expr:'sqrt(30/L^4)', msg:'Prüfe die Potenz von $L$: $\\psi$ muss die Einheit $1/\\sqrt{\\text{Länge}}$ haben, also $A$ die Einheit $L^{-5/2}$.'}]},
        {id:'b', prompt:'b) Berechne $\\langle x\\rangle$.', type:'value', target:'L/2', points:2, ph:'⟨x⟩ = ∫_0^L x |ψ|^2 dx',
          hints:['Symmetrie oder ausrechnen: $\\int_0^L x^3(L-x)^2dx = L^6/60$.', '$\\langle x\\rangle = \\int_0^L x\\,|\\psi|^2\\,dx$ mit $|A|^2 = 30/L^5$.'],
          model:['⟨x⟩ = ∫_0^L x |ψ|^2 dx', '= 30/L^5 ∫_0^L x^3 (L - x)^2 dx', '= 30/L^5 · L^6/60', '= L/2']},
        {id:'c', prompt:'c) Berechne $\\langle x^2\\rangle$ und $\\Delta x$.', type:'value', target:'L/sqrt(28)', points:3, ph:'⟨x^2⟩ = ∫_0^L x^2 |ψ|^2 dx',
          hints:['$\\int_0^L x^4(L-x)^2dx = L^7/105$.', '$\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$; am Ende steht $\\Delta x = \\dots$'],
          model:['⟨x^2⟩ = 30/L^5 ∫_0^L x^4 (L - x)^2 dx', '= 30/L^5 · L^7/105', '= 2L^2/7', 'Δx = sqrt(2L^2/7 - L^2/4)', '= sqrt(L^2/28)', '= L/sqrt(28)'],
          mistakes:[{expr:'sqrt(2L^2/7)', msg:'Das ist $\\sqrt{\\langle x^2\\rangle}$. Für $\\Delta x$ fehlt noch $-\\langle x\\rangle^2$.'}]}
      ]},
    {id:'wf-p2', title:'Wahrscheinlichkeit im linken Viertel',
      text:'Wie Aufgabe 1: $\\psi(x) = \\sqrt{30/L^5}\\,x(L-x)$ im Kasten. Wie groß ist die Wahrscheinlichkeit, das Teilchen zwischen $0$ und $L/4$ zu finden?',
      ctx:CTX.box({defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}}),
      goals:[{id:'a', prompt:'Berechne $P(0 < x < L/4)$ als Bruch.', type:'value', target:'53/512', points:3, ph:'P = ∫_0^{L/4} |ψ|^2 dx',
        hints:['Stammfunktion von $x^2(L-x)^2$: $\\frac{L^2x^3}{3} - \\frac{Lx^4}{2} + \\frac{x^5}{5}$.', 'Bei $x = L/4$: $L^5\\left(\\frac{1}{192} - \\frac{1}{512} + \\frac{1}{5120}\\right)$.'],
        model:['P = ∫_0^{L/4} |ψ|^2 dx', '= 30/L^5 ∫_0^{L/4} x^2 (L - x)^2 dx', '= 30/L^5 [L^2 x^3/3 - L x^4/2 + x^5/5]_0^{L/4}', '= 30 (1/192 - 1/512 + 1/5120)', '= 53/512'],
        note:'Zum Vergleich: $53/512 \\approx 0{,}10$. Gleichverteilt wären es $0{,}25$.'}]},
    {id:'wf-p3', title:'Exponentiell abfallende Wellenfunktion',
      text:'$\\psi(x) = A\\,e^{-|x|/a}$ auf der ganzen Achse, $a > 0$.',
      ctx:CTX.line({params:{a:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(-|x|/a)'}, unknowns:{A:{ref:'1/sqrt(a)', alt:['-1/sqrt(a)']}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, hints:['Der Integrand ist gerade.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '2|A|^2 ∫_0^∞ e^(-2x/a) dx = 1', '|A|^2 a = 1', 'A = 1/sqrt(a)']},
        {id:'b', prompt:'b) Berechne $\\langle x^2\\rangle$ (mit dem normierten $\\psi$).', type:'value', target:'a^2/2', points:2, ph:'⟨x^2⟩ = 2/a ∫_0^∞ x^2 e^(-2x/a) dx',
          hints:['$\\int_0^\\infty x^2e^{-kx}dx = 2/k^3$ mit $k = 2/a$.'],
          model:['⟨x^2⟩ = 1/a ∫_-∞^∞ x^2 e^(-2|x|/a) dx', '= 2/a ∫_0^∞ x^2 e^(-2x/a) dx', '= 2/a · 2/(2/a)^3', '= a^2/2']},
        {id:'c', prompt:'c) Wie groß ist die Wahrscheinlichkeit, das Teilchen im Bereich $|x| > \\Delta x$ zu finden? (Es gilt $\\langle x\\rangle = 0$.)', type:'value', target:'e^(-sqrt(2))', points:2,
          hints:['$\\Delta x = a/\\sqrt 2$.', '$P = 2\\int_{\\Delta x}^\\infty |\\psi|^2dx$.'],
          model:['P = 2/a ∫_{a/sqrt(2)}^∞ e^(-2x/a) dx', '= 2/a · a/2 · e^(-sqrt(2))', '= e^(-sqrt(2))'], note:'$e^{-\\sqrt2}\\approx 0{,}24$: Etwa ein Viertel liegt außerhalb von $\\pm\\Delta x$.'}
      ]},
    {id:'wf-p4', title:'Impulsunschärfe und Unschärferelation',
      text:'Für $\\psi(x) = \\sqrt{30/L^5}\\,x(L-x)$ im Kasten gilt $\\Delta x = L/\\sqrt{28}$ (Aufgabe 1). Im Ortsraum wirkt $\\hat p = -i\\hbar\\,d/dx$.',
      ctx:CTX.box({defs:{'ψ(x)':'sqrt(30/L^5) x (L - x)'}, normalized:true}),
      goals:[
        {id:'a', prompt:'a) Zeige $\\langle p\\rangle = 0$.', type:'value', target:'0', points:2, ph:'⟨p⟩ = ∫_0^L ψ^* (-iħ) dψ/dx dx',
          hints:['$\\langle p\\rangle = \\int\\psi^*(-i\\hbar\\psi\')dx$. Für reelles $\\psi$ ist $\\psi\\psi\' = \\tfrac12(\\psi^2)\'$.'],
          model:['⟨p⟩ = ∫_0^L ψ^* (-iħ) dψ/dx dx', '= -iħ/2 [ψ^2]_0^L', '= 0']},
        {id:'b', prompt:'b) Berechne $\\langle p^2\\rangle$.', type:'value', target:'10ħ^2/L^2', points:3, ph:'⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx',
          hints:['$\\psi\'\' = -2\\sqrt{30/L^5}$ ist konstant.', '$\\int_0^Lx(L-x)dx = L^3/6$.'],
          model:['⟨p^2⟩ = ∫_0^L ψ (-ħ^2) ψ\'\' dx', '= 2ħ^2 · 30/L^5 ∫_0^L x (L - x) dx', '= 60 ħ^2/L^5 · L^3/6', '= 10 ħ^2/L^2']},
        {id:'c', prompt:'c) Berechne $\\Delta x\\,\\Delta p$ und vergleiche mit $\\hbar/2$.', type:'value', target:'ħ sqrt(10/28)', points:2,
          hints:['$\\Delta p = \\sqrt{\\langle p^2\\rangle}$, weil $\\langle p\\rangle = 0$.'],
          model:['Δx Δp = L/sqrt(28) · sqrt(10) ħ/L', '= ħ sqrt(10/28) ≥ ħ/2'], note:'$\\sqrt{10/28}\\approx 0{,}598 > 0{,}5$: Die Unschärferelation ist erfüllt, aber nicht minimal (minimal nur für Gauß-Funktionen).'}
      ]},
    {id:'wf-p5', title:'Gaußsche Wellenfunktion',
      text:'$\\psi(x) = A\\,e^{-\\lambda x^2}$ mit $\\lambda > 0$. Nützlich: $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$ und $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$.',
      ctx:CTX.line({params:{λ:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(-λ x^2)'}, unknowns:{A:{ref:'(2λ/π)^(1/4)', alt:['-(2λ/π)^(1/4)']}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, hints:['$|\\psi|^2 = |A|^2e^{-2\\lambda x^2}$, also $\\alpha = 2\\lambda$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2 ∫_-∞^∞ e^(-2λ x^2) dx = 1', '|A|^2 sqrt(π/(2λ)) = 1', 'A = (2λ/π)^(1/4)']},
        {id:'b', prompt:'b) Berechne $\\Delta x$. (Es gilt $\\langle x\\rangle = 0$.)', type:'value', target:'1/(2 sqrt(λ))', points:2,
          hints:['$\\langle x^2\\rangle = |A|^2\\cdot\\frac{1}{4\\lambda}\\sqrt{\\pi/(2\\lambda)}$.'],
          model:['⟨x^2⟩ = sqrt(2λ/π) ∫_-∞^∞ x^2 e^(-2λ x^2) dx', '= sqrt(2λ/π) · 1/(4λ) sqrt(π/(2λ))', '= 1/(4λ)', 'Δx = 1/(2 sqrt(λ))']}
      ]}
  ],
  final:[
    {q:'Welche Einheit hat eine Wellenfunktion $\\psi(x)$ in einer Dimension?', opts:['$\\mathrm{m}^{-1/2}$', 'keine', '$\\mathrm{m}^{-1}$'], a:0, ex:'$\\int|\\psi|^2dx = 1$ ist dimensionslos, also hat $|\\psi|^2$ die Einheit $1/\\mathrm{m}$.'},
    {task:{id:'wf-f1', title:'Normieren', text:'Im Kasten $0<x<L$ ist $\\psi(x) = A\\,\\sin^2(\\pi x/L)$. Es gilt $\\int_0^L\\sin^4(\\pi x/L)\\,dx = 3L/8$.',
      ctx:CTX.box({defs:{'ψ(x)':'A sin(π x/L)^2'}, unknowns:{A:{ref:'sqrt(8/(3L))', alt:['-sqrt(8/(3L))']}}}),
      goals:[{id:'a', prompt:'Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, model:['|A|^2 ∫_0^L sin(πx/L)^4 dx = 1', '|A|^2 · 3L/8 = 1', 'A = sqrt(8/(3L))']}]}},
    {q:'Ein Zustand hat $\\langle x\\rangle = 1\\,\\mathrm{nm}$ und $\\langle x^2\\rangle = 5\\,\\mathrm{nm}^2$. Dann ist $\\Delta x = $', opts:['$2\\,\\mathrm{nm}$', '$\\sqrt5\\,\\mathrm{nm}$', '$4\\,\\mathrm{nm}$'], a:0, ex:'$\\Delta x = \\sqrt{5 - 1}\\,\\mathrm{nm} = 2\\,\\mathrm{nm}$.'},
    {task:{id:'wf-f2', title:'Wahrscheinlichkeit', text:'$\\psi(x) = \\sqrt{2/L}\\,\\sin(\\pi x/L)$ im Kasten $0 < x < L$.',
      ctx:CTX.box({defs:{'ψ(x)':'sqrt(2/L) sin(π x/L)'}}),
      goals:[{id:'a', prompt:'Berechne $P(0 < x < L/2)$.', type:'value', target:'1/2', points:2, model:['P = 2/L ∫_0^{L/2} sin(πx/L)^2 dx', '= 2/L · L/4', '= 1/2']}]}}
  ],
  errors:[
    {id:'wf-e1', title:'Normierung einer ebenen Welle mit Gauß-Hülle',
      text:'Gesucht ist $A > 0$ für $\\psi(x) = A\\,e^{ikx}e^{-x^2/(2\\sigma^2)}$. Ein Kommilitone rechnet:',
      ctx:CTX.line({params:{k:'pos', σ:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x) e^(-x^2/(2σ^2))'}, unknowns:{A:{ref:'1/(π^(1/4) sqrt(σ))'}}}),
      lines:['∫_-∞^∞ |ψ|^2 dx = 1', '∫_-∞^∞ A^2 e^(2ikx) e^(-x^2/σ^2) dx = 1', 'A^2 e^(-k^2 σ^2) σ sqrt(π) = 1', 'A = e^(k^2 σ^2/2)/(π^(1/4) sqrt(σ))'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Es wurde $\\psi^2$ statt $|\\psi|^2 = \\psi^*\\psi$ eingesetzt.', 'Die Grenzen müssen $0$ bis $\\infty$ sein.', 'Der Exponent der Gauß-Funktion stimmt nicht.'], a:0, ex:'$|e^{ikx}|^2 = 1$. Mit $\\psi^2$ bleibt fälschlich $e^{2ikx}$ stehen; das Ergebnis hängt dann sogar von $k$ ab.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $A$.', type:'solve', unknown:'A', model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2 ∫_-∞^∞ e^(-x^2/σ^2) dx = 1', '|A|^2 σ sqrt(π) = 1', 'A = 1/(π^(1/4) sqrt(σ))']}}
  ]
});
lexe('born', 'Bornsche Wahrscheinlichkeitsdeutung', '$|\\psi(x,t)|^2\\,dx$ ist die Wahrscheinlichkeit, das Teilchen zur Zeit $t$ im Intervall $[x, x+dx]$ zu finden. Für endliche Intervalle: $P(a<x<b) = \\int_a^b|\\psi|^2dx$. Dafür muss $\\psi$ normiert sein.', {topic:'wf'});
lexe('normierung', 'Normierung', '$\\int_{-\\infty}^\\infty|\\psi(x,t)|^2dx = 1$. Vorgehen: unbekannten Vorfaktor $A$ ansetzen, $|A|^2$ vor das Integral ziehen, Integral ausrechnen, nach $|A|$ auflösen. Die Phase von $A$ ist frei wählbar (meist $A > 0$). In 3D: $\\int|\\psi|^2d^3r = 1$, in Kugelkoordinaten mit $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$.', {topic:'wf'});
lexe('erwartungswert', 'Erwartungswert', 'Mittelwert vieler Messungen an gleich präparierten Systemen: $\\langle x\\rangle = \\int x|\\psi|^2dx$, allgemein $\\langle A\\rangle = \\langle\\psi|\\hat A|\\psi\\rangle = \\int\\psi^*\\hat A\\psi\\,dx$. Der Operator steht zwischen $\\psi^*$ und $\\psi$ und wirkt nach rechts.', {topic:'wf'});
lexe('unschaerfe', 'Unschärfe (Standardabweichung)', '$\\Delta A = \\sqrt{\\langle A^2\\rangle - \\langle A\\rangle^2}$. Sie misst die Streuung der Messwerte. Heisenberg: $\\Delta x\\,\\Delta p \\ge \\hbar/2$; allgemein Robertson: $\\Delta A\\,\\Delta B \\ge \\tfrac12|\\langle[\\hat A,\\hat B]\\rangle|$.', {topic:'wf'});
lexe('integrale', 'Nützliche Integrale', '- $\\int_0^L\\sin^2(n\\pi x/L)dx = L/2$, $\\int_0^L\\sin(n\\pi x/L)\\sin(m\\pi x/L)dx = 0$ für $n\\neq m$\n- $\\int_0^\\infty x^ne^{-kx}dx = n!/k^{n+1}$\n- $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$\n- $\\int_{-\\infty}^\\infty e^{-\\alpha x^2 + \\beta x}dx = \\sqrt{\\pi/\\alpha}\\,e^{\\beta^2/(4\\alpha)}$ (auch für komplexes $\\beta$)\n- $\\sin^2u = \\tfrac12(1-\\cos 2u)$, $\\sin a\\sin b = \\tfrac12[\\cos(a-b) - \\cos(a+b)]$', {topic:'m-analysis'});
lexe('komplexe-zahlen', 'Komplexe Zahlen', '$z = a + ib = re^{i\\varphi}$, $z^* = a - ib$, $|z|^2 = z^*z = a^2 + b^2$. Euler: $e^{i\\varphi} = \\cos\\varphi + i\\sin\\varphi$, $|e^{i\\varphi}| = 1$. Achtung: $z^2 \\ne |z|^2$ für komplexes $z$.', {topic:'m-komplex'});
