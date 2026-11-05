/* ===== Thema 9: Wasserstoffatom ===== */
const HRAD = extra => Object.assign({coords:['r'], space:['r'], radial:true, params:{a_0:'pos', m:'pos'}}, extra || {});
const HDEFS = {'V(r)':'-ħ^2/(m a_0 r)', 'R_10(r)':'2 a_0^(-3/2) e^(-r/a_0)', 'R_20(r)':'1/sqrt(2) a_0^(-3/2) (1 - r/(2a_0)) e^(-r/(2a_0))', 'R_21(r)':'1/sqrt(24) a_0^(-3/2) (r/a_0) e^(-r/(2a_0))', 'E_n':'-ħ^2/(2 m a_0^2 n^2)'};
topic({
  id:'h', math:['m-spezial', 'm-dgl'], title:'Wasserstoffatom', short:'Wasserstoff',
  src:'Griffiths & Schroeter Kap. 4 · Nolting 5/2 · Schwabl Kap. 6',
  goals:[
    'Ich kann radiale Wellenfunktionen mit dem Maß $r^2\\,dr$ normieren und Erwartungswerte wie $\\langle r\\rangle$ und $\\langle 1/r\\rangle$ berechnen.',
    'Ich kann mit der Radialgleichung für $u = rR$ prüfen, ob eine Funktion ein Eigenzustand ist, und die Energie bestimmen.',
    'Ich kenne $E_n = -\\frac{\\hbar^2}{2ma_0^2n^2}$, die Quantenzahlen $n, l, m$ und die Entartung $n^2$.'
  ],
  needs:'Kugelkoordinaten und $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$ · Drehimpuls $L^2Y_l^m = \\hbar^2l(l+1)Y_l^m$ · Integrale $\\int_0^\\infty r^ne^{-kr}dr = n!/k^{n+1}$',
  check:[
    {q:'In Kugelkoordinaten ist das Volumenelement $d^3r$ gleich …', opts:['$r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$', '$dr\\,d\\theta\\,d\\varphi$', '$r\\,dr\\,d\\theta\\,d\\varphi$'], a:0, ex:'Die Kugelschale hat die Fläche $4\\pi r^2$; deshalb steckt $r^2$ im Maß, $\\sin\\theta$ kommt von den Breitenkreisen.', lex:'kugelkoordinaten'},
    {q:'Für die Kugelflächenfunktionen gilt $\\hat L^2Y_l^m = \\dots$', opts:['$\\hbar^2l(l+1)\\,Y_l^m$', '$\\hbar l\\,Y_l^m$', '$\\hbar^2l^2\\,Y_l^m$'], a:0, ex:'Eigenwert $\\hbar^2l(l+1)$, und $\\hat L_zY_l^m = \\hbar m\\,Y_l^m$.', prev:'dreh'},
    {q:'$\\int_0^\\infty r^2e^{-2r/a}\\,dr$ ist …', opts:['$a^3/4$', '$a^2/2$', '$2a^3$'], a:0, ex:'$n!/k^{n+1}$ mit $n = 2$, $k = 2/a$: $2/(8/a^3) = a^3/4$.', lex:'integrale'},
    {q:'Ein normierter Zustand $\\psi(r)$ hängt nur von $r$ ab. Die Wahrscheinlichkeit für einen Abstand zwischen $r$ und $r + dr$ ist …', opts:['$4\\pi r^2|\\psi(r)|^2\\,dr$', '$|\\psi(r)|^2\\,dr$', '$4\\pi|\\psi(r)|^2\\,dr$'], a:0, ex:'Man integriert $|\\psi|^2$ über die Kugelschale mit Volumen $4\\pi r^2dr$.', prev:'wf'}
  ],
  example:{
    title:'Radialfunktion des Grundzustands normieren',
    text:'Für $n = 1$, $l = 0$ ist $R(r) = A\\,e^{-r/a_0}$. Bestimme $A > 0$ so, dass $\\int_0^\\infty|R|^2r^2dr = 1$ (die Kugelflächenfunktion ist für sich normiert).',
    ctx:HRAD({defs:{'R(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'2/a_0^(3/2)'}}}),
    lines:[
      {l:'∫_0^∞ |R(r)|^2 r^2 dr = 1', why:{q:'Warum steht $r^2$ im Integral?', opts:['Es kommt aus $d^3r = r^2\\,dr\\,d\\Omega$; der Winkelteil ist mit $\\int|Y|^2d\\Omega = 1$ schon erledigt.', 'Weil $R$ quadriert wird.', 'Das ist eine Konvention ohne Grund.'], a:0, ex:'$\\int|\\psi|^2d^3r = \\int_0^\\infty|R|^2r^2dr\\cdot\\int|Y_l^m|^2d\\Omega$.'}},
      {l:'|A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', why:{q:'Woher kommt $e^{-2r/a_0}$?', opts:['$|e^{-r/a_0}|^2 = e^{-2r/a_0}$', 'Aus der Ableitung.', 'Aus dem Maß $r^2$.'], a:0, ex:'Beim Quadrieren verdoppelt sich der Exponent.'}},
      {l:'|A|^2 · 2!/(2/a_0)^3 = 1', why:{q:'Welche Formel steckt hier?', opts:['$\\int_0^\\infty r^ne^{-kr}dr = n!/k^{n+1}$ mit $n = 2$, $k = 2/a_0$', 'partielle Integration ohne Randterm', '$\\int_0^\\infty e^{-kr}dr = k$'], a:0, ex:'Die Formel folgt aus der Gammafunktion $\\Gamma(n+1) = n!$.'}},
      {l:'|A|^2 a_0^3/4 = 1', why:{q:'Stimmt die Vereinfachung?', opts:['Ja: $2/(8/a_0^3) = a_0^3/4$.', 'Nein, es müsste $a_0^3/8$ heißen.', 'Nein, es müsste $a_0^2/4$ heißen.'], a:0, ex:'$(2/a_0)^3 = 8/a_0^3$, und $2 : 8/a_0^3 = a_0^3/4$.'}},
      {l:'A = 2/a_0^(3/2)', w:'Phase frei: A > 0', why:{q:'Welche Einheit hat $A$, und passt das?', opts:['$\\text{Länge}^{-3/2}$; in 3D muss $|\\psi|^2$ die Einheit $1/\\text{Volumen}$ haben.', 'dimensionslos', '$\\text{Länge}^{-1/2}$ wie in einer Dimension'], a:0, ex:'$R^2r^2dr$ ist dimensionslos, also hat $R$ die Einheit $\\text{Länge}^{-3/2}$.'}}
    ],
    faded:{id:'h-fade', title:'Jetzt du: $R(r) = A\\,r\\,e^{-r/(2a_0)}$ (Zustand 2p)', text:'Bestimme $A > 0$ mit $\\int_0^\\infty|R|^2r^2dr = 1$.',
      ctx:HRAD({defs:{'R(r)':'A r e^(-r/(2a_0))'}, unknowns:{A:{ref:'1/sqrt(24 a_0^5)'}}}),
      given:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^4 e^(-r/a_0) dr = 1'],
      goals:[{id:'a', prompt:'Bestimme $A$.', type:'solve', unknown:'A', hints:['$n = 4$, $k = 1/a_0$ in $n!/k^{n+1}$.', '$4!\\,a_0^5 = 24a_0^5$'],
        model:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^4 e^(-r/a_0) dr = 1', {l:'|A|^2 · 4! a_0^5 = 1', gap:'|A|^2 · ▢ = 1'}, 'A = 1/sqrt(24 a_0^5)']}]}
  },
  puzzle:{
    title:'Wo ist das Elektron am wahrscheinlichsten?',
    text:'Im Grundzustand ist $\\psi_{100}(r) = e^{-r/a_0}/\\sqrt{\\pi a_0^3}$. Die Dichte $|\\psi_{100}|^2$ ist im Kern ($r = 0$) am größten.\n\nBei welchem **Abstand** $r$ vom Kern findet man das Elektron am wahrscheinlichsten?',
    q:{q:'Deine Vermutung:', opts:['bei $r = 0$', 'bei $r = a_0$', 'bei $r = \\tfrac32a_0$', 'alle Abstände sind gleich wahrscheinlich'], a:1, ex:'Die Wahrscheinlichkeit für den Abstand enthält das Volumen der Kugelschale.'},
    reveal:'Gefragt ist nicht die Dichte an einem Punkt, sondern die Wahrscheinlichkeit für eine **Kugelschale** zwischen $r$ und $r+dr$:\n\n$$P(r)\\,dr = 4\\pi r^2|\\psi_{100}|^2dr = \\frac{4}{a_0^3}r^2e^{-2r/a_0}dr.$$\n\nDer Faktor $r^2$ drückt $P$ bei $r = 0$ auf null, $e^{-2r/a_0}$ drückt es für große $r$. Aus $dP/dr = 0$ folgt $r = a_0$ – der Bohrsche Radius. Der Mittelwert $\\langle r\\rangle = \\tfrac32a_0$ liegt weiter außen, weil die Verteilung nach außen einen langen Ausläufer hat.'
  },
  clarify:{
    core:'Im Coulombpotential $V(r) = -\\frac{e^2}{4\\pi\\varepsilon_0 r} = -\\frac{\\hbar^2}{ma_0r}$ trennt man $\\psi_{nlm} = R_{nl}(r)\\,Y_l^m(\\theta,\\varphi)$. Mit $u(r) = rR(r)$ wird die Radialgleichung eindimensional:\n\n$$-\\frac{\\hbar^2}{2m}u\'\' + \\left[V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}\\right]u = Eu,\\qquad u(0) = 0.$$\n\nGebundene Lösungen gibt es nur für $E_n = -\\frac{\\hbar^2}{2ma_0^2n^2} \\approx -\\frac{13{,}6\\,\\mathrm{eV}}{n^2}$ mit $n = 1, 2, \\dots$, $l = 0, \\dots, n-1$, $m = -l, \\dots, l$. Die Energie hängt nur von $n$ ab: $n^2$ Zustände (ohne Spin).',
    keys:[
      'Normierung und Erwartungswerte radial immer mit $r^2\\,dr$: $\\int_0^\\infty|R_{nl}|^2r^2dr = 1$.',
      'Das Zentrifugalglied $\\hbar^2l(l+1)/(2mr^2)$ hält Zustände mit $l > 0$ vom Kern fern: $R_{nl}\\propto r^l$ für kleine $r$.',
      'Radiale Knoten: $n - l - 1$. Der Zustand mit $l = n-1$ hat keinen.',
      'Bohrscher Radius $a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{me^2} \\approx 0{,}529\\,\\text{Å}$; Grundzustand: $\\langle r\\rangle = \\tfrac32a_0$, wahrscheinlichster Abstand $a_0$.',
      'Virialsatz für $V\\propto 1/r$: $\\langle V\\rangle = 2E_n$ und $\\langle T\\rangle = -E_n$.'
    ],
    errors:[
      '$r^2$ im Maß vergessen – dann ist schon die Normierung falsch.',
      'Den Ort größter Dichte ($r = 0$) mit dem wahrscheinlichsten Abstand ($r = a_0$) verwechseln.',
      '$l = n$ zulassen: Für $n = 1$ gibt es nur $l = 0$.',
      'Vorzeichen der Energie: Gebundene Zustände haben $E_n < 0$, höhere $n$ liegen näher an $0$.'
    ],
    more:[{title:'Mitbewegter Kern', text:'Mit der reduzierten Masse $\\mu = m_em_p/(m_e+m_p)$ statt $m_e$ verschieben sich alle Energien um etwa $0{,}05\\,\\%$: $13{,}598\\,\\mathrm{eV}$ statt $13{,}606\\,\\mathrm{eV}$. In diesem Tutorial steht $m$ für die Masse in der Radialgleichung.'}],
    checks:[
      {q:'Wie viele Zustände (ohne Spin) gehören zu $n = 2$?', opts:['$4$', '$2$', '$3$'], a:0, ex:'$l = 0$ (ein Zustand) und $l = 1$ (drei Zustände): $n^2 = 4$.'},
      {q:'Für welchen Zustand ist $R_{nl}(0) \\ne 0$?', opts:['nur für $l = 0$', 'für alle $l$', 'nur für $l = n-1$'], a:0, ex:'$R_{nl}\\propto r^l$ nahe $r = 0$. Nur s-Zustände haben eine endliche Dichte am Kern.'}
    ]
  },
  lab:{type:'hydrogen', title:'Radiale Aufenthaltswahrscheinlichkeit',
    text:'Das Bild zeigt $P(r) = r^2|R_{nl}(r)|^2$ (Längen in $a_0$). Die rote Linie ist $\\langle r\\rangle$. Wähle $n$ und $l$.',
    questions:[
      {q:'Stelle $n = 2$, $l = 1$ ein. Wo hat $P(r)$ sein Maximum?', opts:['bei $4a_0$', 'bei $2a_0$', 'bei $5a_0$'], a:0, ex:'$P\\propto r^4e^{-r/a_0}$ ist bei $r = 4a_0$ maximal. $\\langle r\\rangle = 5a_0$ liegt weiter außen.'},
      {q:'$n = 3$, $l = 0$: Wie viele Nullstellen hat $P(r)$ für $r > 0$?', opts:['$2$', '$3$', '$0$'], a:0, ex:'Radiale Knoten: $n - l - 1 = 2$.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele radiale Knoten hat der Zustand $n = 4$, $l = 3$?', opts:['$0$', '$1$', '$3$'], a:0, ex:'$n - l - 1 = 0$. Zustände mit $l = n-1$ haben eine einzige Schale, wie im Bohrschen Modell.'}},
  compare:{
    text:'Gesucht ist $\\langle V\\rangle$ im Grundzustand $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$ mit $V(r) = -\\hbar^2/(ma_0r)$. Zwei richtige Wege:',
    ctx:HRAD({defs:HDEFS, state:'R_10'}),
    A:{name:'Integral ausrechnen', model:['⟨V⟩ = ∫_0^∞ V(r) |R_10(r)|^2 r^2 dr', '= -ħ^2/(m a_0) · 4/a_0^3 ∫_0^∞ r e^(-2r/a_0) dr', '= -ħ^2/(m a_0) · 4/a_0^3 · a_0^2/4', '= -ħ^2/(m a_0^2)']},
    B:{name:'Virialsatz', text:'Für $V\\propto 1/r$ gilt in stationären Zuständen $2\\langle T\\rangle = -\\langle V\\rangle$, also $E = \\langle T\\rangle + \\langle V\\rangle = \\tfrac12\\langle V\\rangle$.', model:['⟨V⟩ = 2 E_1', '= 2 · (-ħ^2/(2m a_0^2))', '= -ħ^2/(m a_0^2)']},
    questions:[
      {q:'Was braucht Weg B, was Weg A nicht braucht?', opts:['die Energie $E_1$ und den Virialsatz', 'die normierte Wellenfunktion', 'eine Ableitung von $R$'], a:0, ex:'Weg B kommt ohne Integral aus, setzt aber $E_1$ voraus. Weg A braucht nur $R_{10}$.'},
      {q:'Für welchen Zustand liefert Weg B ebenso schnell $\\langle V\\rangle$?', opts:['für jeden stationären Zustand $\\psi_{nlm}$: $\\langle V\\rangle = 2E_n$', 'nur für den Grundzustand', 'für jede Überlagerung von Zuständen'], a:0, ex:'Der Virialsatz gilt für jeden Eigenzustand von $\\hat H$. Für Überlagerungen verschiedener $n$ kommen zeitabhängige Mischterme hinzu; dann gilt $\\langle V\\rangle = 2\\langle H\\rangle$ nur noch im Zeitmittel.'}
    ]
  },
  practice:[
    {id:'h-p1', title:'Grundzustand in drei Dimensionen normieren',
      text:'$\\psi(r) = A\\,e^{-r/a_0}$ hängt nicht von $\\theta, \\varphi$ ab. Normiere mit $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$.',
      ctx:{coords:['r', 'θ', 'φ'], params:{a_0:'pos', m:'pos'}, defs:{'ψ(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'1/sqrt(π a_0^3)', alt:['-1/sqrt(π a_0^3)']}}},
      goals:[{id:'a', prompt:'Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, ph:'4π |A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1',
        hints:['Die Winkelintegrale geben $\\int_0^\\pi\\sin\\theta\\,d\\theta\\int_0^{2\\pi}d\\varphi = 4\\pi$.', '$\\int_0^\\infty r^2e^{-2r/a_0}dr = a_0^3/4$.'],
        model:['∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 r^2 sin(θ) dφ dθ dr = 1', {l:'4π |A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', w:'Winkelintegral = 4π'}, '4π |A|^2 · a_0^3/4 = 1', 'A = 1/sqrt(π a_0^3)'],
        mistakes:[{expr:'2/a_0^(3/2)', msg:'Das ist die Normierung der Radialfunktion $R_{10}$ allein. Für $\\psi$ selbst fehlt der Winkelanteil $4\\pi$.'}]}]},
    {id:'h-p2', title:'Mittlerer Abstand und mittleres $1/r$',
      text:'Grundzustand: $R_{10}(r) = 2a_0^{-3/2}e^{-r/a_0}$.',
      ctx:HRAD({defs:HDEFS, state:'R_10'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle r\\rangle$.', type:'value', target:'3 a_0/2', points:2, ph:'⟨r⟩ = ∫_0^∞ r |R_10(r)|^2 r^2 dr',
          hints:['Der Integrand ist $r\\cdot|R_{10}|^2\\cdot r^2 = \\frac{4}{a_0^3}r^3e^{-2r/a_0}$.', '$\\int_0^\\infty r^3e^{-kr}dr = 3!/k^4$.'],
          model:['⟨r⟩ = ∫_0^∞ r |R_10(r)|^2 r^2 dr', '= 4/a_0^3 ∫_0^∞ r^3 e^(-2r/a_0) dr', '= 4/a_0^3 · 3!/(2/a_0)^4', '= 3/2 a_0'],
          mistakes:[{expr:'3/4 a_0', msg:'Prüfe den Vorfaktor: $|R_{10}|^2 = 4a_0^{-3}e^{-2r/a_0}$, und $3!/(2/a_0)^4 = 6a_0^4/16$.'}]},
        {id:'b', prompt:'b) Berechne $\\langle 1/r\\rangle$.', type:'value', target:'1/a_0', points:2, ph:'⟨1/r⟩ = ∫_0^∞ 1/r |R_10(r)|^2 r^2 dr',
          hints:['Vom Maß bleibt ein Faktor $r$: $\\int_0^\\infty re^{-2r/a_0}dr = a_0^2/4$.'],
          model:['⟨1/r⟩ = ∫_0^∞ 1/r |R_10(r)|^2 r^2 dr', '= 4/a_0^3 ∫_0^∞ r e^(-2r/a_0) dr', '= 4/a_0^3 · a_0^2/4', '= 1/a_0'], note:'Allgemein gilt $\\langle 1/r\\rangle = 1/(n^2a_0)$. Beachte $\\langle 1/r\\rangle \\ne 1/\\langle r\\rangle$.'}
      ]},
    {id:'h-p3', title:'Wahrscheinlichster Abstand',
      text:'Die radiale Aufenthaltswahrscheinlichkeit ist $P(r) = r^2|R_{nl}(r)|^2$. Für $1s$ ist $P \\propto r^2e^{-2r/a_0}$, für $2p$ ist $P\\propto r^4e^{-r/a_0}$. Nenne den gesuchten Abstand $r_m$ bzw. $r_p$.',
      ctx:HRAD({unknowns:{r_m:{ref:'a_0'}, r_p:{ref:'4 a_0'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme den wahrscheinlichsten Abstand $r_m$ im Zustand $1s$.', type:'solve', unknown:'r_m', points:2, ph:'d/dr (r^2 e^(-2r/a_0)) = …',
          hints:['Leite $r^2e^{-2r/a_0}$ mit der Produktregel ab und setze die Ableitung bei $r_m$ null.', 'Der Faktor $e^{-2r/a_0}$ ist nie null; $r = 0$ ist ein Minimum.'],
          model:['d/dr (r^2 e^(-2r/a_0)) = (2r - 2r^2/a_0) e^(-2r/a_0)', '2 r_m - 2 r_m^2/a_0 = 0', 'r_m = a_0']},
        {id:'b', prompt:'b) Dasselbe für $2p$: Bestimme $r_p$.', type:'solve', unknown:'r_p', points:2, ph:'d/dr (r^4 e^(-r/a_0)) = …',
          model:['d/dr (r^4 e^(-r/a_0)) = (4r^3 - r^4/a_0) e^(-r/a_0)', '4 r_p^3 - r_p^4/a_0 = 0', 'r_p = 4 a_0'], note:'Das ist der Bohrsche Radius $n^2a_0$ für $n = 2$ – für $l = n-1$ stimmt das Bohrsche Modell hier überein.'}
      ]},
    {id:'h-p4', title:'Energie des Grundzustands aus der Radialgleichung',
      text:'Für $l = 0$ lautet die Radialgleichung $-\\frac{\\hbar^2}{2m}u\'\' + V(r)u = Eu$ mit $V(r) = -\\frac{\\hbar^2}{ma_0r}$. Probiere $u(r) = r\\,e^{-r/a_0}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r e^(-r/a_0)'}, unknowns:{E:{ref:'-ħ^2/(2 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$.', type:'solve', unknown:'E', points:3, ph:"-ħ^2/(2m) u'' + V(r) u = E u",
        hints:['$u\' = (1 - r/a_0)e^{-r/a_0}$, $u\'\' = (r/a_0^2 - 2/a_0)e^{-r/a_0}$.', 'Die Terme mit $1/r$ heben sich weg – genau dafür muss der Exponent $r/a_0$ sein.'],
        model:["-ħ^2/(2m) u'' + V(r) u = E u", '-ħ^2/(2m) (r/a_0^2 - 2/a_0) e^(-r/a_0) - ħ^2/(m a_0 r) · r e^(-r/a_0) = E r e^(-r/a_0)', '-ħ^2/(2m a_0^2) r e^(-r/a_0) = E r e^(-r/a_0)', 'E = -ħ^2/(2m a_0^2)'],
        mistakes:[{expr:'ħ^2/(2m a_0^2)', msg:'Vorzeichen prüfen: Ein gebundener Zustand hat $E < 0$.'}]}]},
    {id:'h-p5', title:'Ein Zustand mit $l = 1$',
      text:'Für $l = 1$ kommt das Zentrifugalglied $\\frac{\\hbar^2l(l+1)}{2mr^2} = \\frac{\\hbar^2}{mr^2}$ hinzu. Probiere $u(r) = r^2e^{-r/(2a_0)}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r^2 e^(-r/(2a_0))'}, unknowns:{E:{ref:'-ħ^2/(8 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$. Welches $n$ gehört dazu?', type:'solve', unknown:'E', points:3, ph:"-ħ^2/(2m) u'' + (V(r) + ħ^2/(m r^2)) u = E u",
        hints:['$u\'\' = \\left(2 - \\frac{2r}{a_0} + \\frac{r^2}{4a_0^2}\\right)e^{-r/(2a_0)}$.', 'Die Glieder mit $r^0$ und $r^1$ heben sich weg.'],
        model:["-ħ^2/(2m) u'' + (V(r) + ħ^2/(m r^2)) u = E u", '-ħ^2/(2m) (2 - 2r/a_0 + r^2/(4a_0^2)) e^(-r/(2a_0)) + (-ħ^2/(m a_0 r) + ħ^2/(m r^2)) r^2 e^(-r/(2a_0)) = E r^2 e^(-r/(2a_0))', '-ħ^2/(8m a_0^2) r^2 e^(-r/(2a_0)) = E r^2 e^(-r/(2a_0))', 'E = -ħ^2/(8m a_0^2)'],
        note:'$E = E_1/4 = E_2$: Das ist der Zustand $2p$ ($n = 2$, $l = 1$), entartet mit $2s$.'}]},
    {id:'h-p6', title:'Virialsatz und Spektrallinie',
      text:'Grundzustand $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$, $V(r) = -\\hbar^2/(ma_0r)$, $E_n = -\\frac{\\hbar^2}{2ma_0^2n^2}$.',
      ctx:HRAD({defs:HDEFS, state:'R_10', ops:{T:'-ħ^2/(2m) (1/r^2) d/dr r^2 d/dr'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle V\\rangle$ im Grundzustand.', type:'value', target:'-ħ^2/(m a_0^2)', points:2, ph:'⟨V⟩ = ∫_0^∞ V(r) |R_10(r)|^2 r^2 dr',
          hints:['Vom Maß $r^2$ und $1/r$ bleibt $r$: $\\int_0^\\infty re^{-2r/a_0}dr = a_0^2/4$.'],
          model:['⟨V⟩ = ∫_0^∞ V(r) |R_10(r)|^2 r^2 dr', '= -ħ^2/(m a_0) · 4/a_0^3 · a_0^2/4', '= -ħ^2/(m a_0^2)']},
        {id:'b', prompt:'b) Bestimme $\\langle T\\rangle$ aus $E_1$ und $\\langle V\\rangle$.', type:'value', target:'ħ^2/(2m a_0^2)', points:2,
          model:['⟨T⟩ = E_1 - ⟨V⟩', '= -ħ^2/(2m a_0^2) + ħ^2/(m a_0^2)', '= ħ^2/(2m a_0^2)'], note:'Also $\\langle T\\rangle = -E_1$ und $\\langle V\\rangle = 2E_1$ (Virialsatz).'},
        {id:'c', prompt:'c) Welche Energie hat das Photon beim Übergang $n = 3 \\to n = 2$ (Balmer-$H_\\alpha$)?', type:'value', target:'5ħ^2/(72 m a_0^2)', points:2, ph:'E_3 - E_2 = …',
          hints:['$E_3 - E_2 = -\\frac{\\hbar^2}{2ma_0^2}\\left(\\frac19 - \\frac14\\right)$.'],
          model:['E_3 - E_2 = -ħ^2/(2m a_0^2) (1/9 - 1/4)', '= 5ħ^2/(72 m a_0^2)'], note:'Mit $\\hbar^2/(2ma_0^2) \\approx 13{,}6\\,\\mathrm{eV}$: $\\approx 1{,}89\\,\\mathrm{eV}$, also $\\lambda \\approx 656\\,\\mathrm{nm}$ (rot).'}
      ]}
  ],
  final:[
    {q:'Wie viele Zustände (ohne Spin) haben die Energie $E_3$?', opts:['$9$', '$3$', '$6$'], a:0, ex:'$l = 0, 1, 2$ mit $1 + 3 + 5 = 9 = n^2$ Zuständen.'},
    {task:{id:'h-f1', title:'Mittlerer Abstand im Zustand 2p', text:'$R_{21}(r) = \\frac{1}{\\sqrt{24}}a_0^{-3/2}\\frac{r}{a_0}e^{-r/(2a_0)}$. Nützlich: $\\int_0^\\infty r^5e^{-r/a_0}dr = 5!\\,a_0^6$.',
      ctx:HRAD({defs:HDEFS, state:'R_21'}),
      goals:[{id:'a', prompt:'Berechne $\\langle r\\rangle$.', type:'value', target:'5 a_0', points:2, model:['⟨r⟩ = 1/(24 a_0^5) ∫_0^∞ r^5 e^(-r/a_0) dr', '= 1/(24 a_0^5) · 5! a_0^6', '= 5 a_0']}]}},
    {q:'Wie verhält sich $E_2$ zu $E_1$?', opts:['$E_2 = E_1/4$', '$E_2 = E_1/2$', '$E_2 = 4E_1$'], a:0, ex:'$E_n\\propto 1/n^2$. Beide sind negativ; $E_2$ liegt näher an null.'},
    {task:{id:'h-f2', title:'Ionisierung aus dem ersten angeregten Zustand', text:'$E_n = -\\frac{\\hbar^2}{2ma_0^2n^2}$.',
      ctx:HRAD({defs:HDEFS}),
      goals:[{id:'a', prompt:'Welche Energie braucht man mindestens, um ein Elektron aus $n = 2$ zu lösen ($E_\\infty = 0$)?', type:'value', target:'ħ^2/(8 m a_0^2)', points:2, model:['0 - E_2 = ħ^2/(2m a_0^2 · 4)', '= ħ^2/(8m a_0^2)']}]}}
  ],
  errors:[
    {id:'h-e1', title:'Normierung ohne Maß',
      text:'Gesucht ist $A > 0$ für $R(r) = A\\,e^{-r/a_0}$. Jemand rechnet:',
      ctx:HRAD({defs:{'R(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'2/a_0^(3/2)'}}}),
      lines:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ e^(-2r/a_0) dr = 1', '|A|^2 a_0/2 = 1', 'A = sqrt(2/a_0)'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Der Faktor $r^2$ aus dem Maß ist verloren gegangen.', 'Der Exponent muss $-r/a_0$ bleiben.', 'Die untere Grenze muss $-\\infty$ sein.'], a:0, ex:'Ohne $r^2$ hat $A$ die falsche Einheit $\\text{Länge}^{-1/2}$ – ein Warnsignal.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $A$.', type:'solve', unknown:'A', model:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', '|A|^2 a_0^3/4 = 1', 'A = 2/a_0^(3/2)']}}
  ]
});
lexe('kugelkoordinaten', 'Kugelkoordinaten', '$x = r\\sin\\theta\\cos\\varphi$, $y = r\\sin\\theta\\sin\\varphi$, $z = r\\cos\\theta$ mit $r\\ge 0$, $0\\le\\theta\\le\\pi$, $0\\le\\varphi<2\\pi$. Volumenelement $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi = r^2dr\\,d\\Omega$, Raumwinkel $\\int d\\Omega = 4\\pi$. Laplace-Operator: $\\nabla^2 = \\frac{1}{r^2}\\partial_r(r^2\\partial_r) - \\frac{\\hat L^2}{\\hbar^2r^2}$.', {topic:'h'});
lexe('bohrradius', 'Bohrscher Radius', '$a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{m_ee^2} \\approx 0{,}529\\cdot10^{-10}\\,\\mathrm{m}$. Damit ist $\\frac{e^2}{4\\pi\\varepsilon_0} = \\frac{\\hbar^2}{m_ea_0}$ und $V(r) = -\\frac{\\hbar^2}{m_ea_0r}$. Im Grundzustand ist $a_0$ der wahrscheinlichste Abstand, $\\langle r\\rangle = \\tfrac32a_0$.', {topic:'h'});
lexe('wasserstoff-energie', 'Energieniveaus des Wasserstoffatoms', '$E_n = -\\frac{\\hbar^2}{2m_ea_0^2n^2} = -\\frac{m_e}{2\\hbar^2}\\left(\\frac{e^2}{4\\pi\\varepsilon_0}\\right)^2\\frac{1}{n^2} \\approx -\\frac{13{,}6\\,\\mathrm{eV}}{n^2}$ (unendlich schwerer Kern; mit reduzierter Masse $13{,}598\\,\\mathrm{eV}$). Quantenzahlen: $n\\ge1$, $l = 0,\\dots,n-1$, $m = -l,\\dots,l$; Entartung $n^2$ (ohne Spin). Übergänge: $h\\nu = E_{n_o} - E_{n_u}$; Balmer-Serie endet bei $n_u = 2$.', {topic:'h'});
lexe('radialgleichung', 'Radialgleichung', 'Mit $\\psi = R(r)Y_l^m(\\theta,\\varphi)$ und $u = rR$: $-\\frac{\\hbar^2}{2m}u\'\' + V_{\\text{eff}}(r)u = Eu$, $V_{\\text{eff}} = V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}$, Randbedingung $u(0) = 0$. Normierung $\\int_0^\\infty|u|^2dr = \\int_0^\\infty|R|^2r^2dr = 1$.', {topic:'h'});
lexe('radialfunktionen', 'Radialfunktionen des Wasserstoffatoms', '- $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$\n- $R_{20} = \\frac{1}{\\sqrt2}a_0^{-3/2}\\left(1 - \\frac{r}{2a_0}\\right)e^{-r/(2a_0)}$\n- $R_{21} = \\frac{1}{\\sqrt{24}}a_0^{-3/2}\\frac{r}{a_0}e^{-r/(2a_0)}$\n\nGrundzustand $\\psi_{100} = \\frac{1}{\\sqrt{\\pi a_0^3}}e^{-r/a_0}$ (mit $Y_0^0 = 1/\\sqrt{4\\pi}$). Allgemein $\\langle r\\rangle_{nl} = \\frac{a_0}{2}[3n^2 - l(l+1)]$, $\\langle 1/r\\rangle_{nl} = \\frac{1}{n^2a_0}$.', {topic:'h'});
lexe('virialsatz', 'Virialsatz', 'Für stationäre Zustände im Potential $V\\propto r^k$ gilt $2\\langle T\\rangle = k\\langle V\\rangle$. Coulomb ($k = -1$): $\\langle T\\rangle = -E_n$, $\\langle V\\rangle = 2E_n$. Oszillator ($k = 2$): $\\langle T\\rangle = \\langle V\\rangle = E_n/2$.', {topic:'h'});
