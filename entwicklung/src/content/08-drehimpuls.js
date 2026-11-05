/* ===== Thema 8: Drehimpuls ===== */
const DREH_JM = (extra) => Object.assign({rep:'mat', mat:{preset:'jm'}, coords:['t'], params:{l:{int:[0, 3]}, m:{int:[-3, 3], range:['-l', 'l']}}}, extra || {});
const DREH_SPH = (unk) => ({coords:['θ', 'φ'], space:['θ', 'φ'], measure:'sin(θ)', params:{}, abstract:{f:{args:['θ', 'φ']}}, unknowns:unk || {}});
topic({
  id:'dreh', math:['m-spezial', 'm-eigen'], title:'Drehimpuls', short:'Drehimpuls',
  src:'Griffiths & Schroeter Kap. 4 · Nolting 5/2 Kap. 5 · Sakurai Kap. 3',
  goals:[
    'Ich kann mit den Vertauschungsrelationen $[L_x, L_y] = i\\hbar L_z$ und den Leiteroperatoren $L_\\pm$ rechnen.',
    'Ich kann die Eigenwerte $\\hbar^2l(l+1)$ und $\\hbar m$ angeben und die Faktoren von $L_\\pm|l,m\\rangle$ bestimmen.',
    'Ich kann $\\hat L_z$ und $\\hat L^2$ in Kugelkoordinaten auf Kugelflächenfunktionen anwenden und sie normieren.'
  ],
  needs:'Kommutatoren und Dirac-Notation (Thema 6) · Kugelkoordinaten · $\\int_0^{2\\pi}e^{im\\varphi}d\\varphi$',
  check:[
    {q:'Der klassische Drehimpuls ist $\\vec L = \\vec r\\times\\vec p$. Was ist $L_z$?', opts:['$xp_y - yp_x$', '$yp_z - zp_y$', '$xp_x + yp_y$'], a:0, ex:'$z$-Komponente des Kreuzprodukts: $(\\vec r\\times\\vec p)_z = xp_y - yp_x$.', lex:'drehimpuls-algebra'},
    {q:'$[\\hat A, \\hat B\\hat C] = $', opts:['$[\\hat A,\\hat B]\\hat C + \\hat B[\\hat A,\\hat C]$', '$[\\hat A,\\hat B][\\hat A,\\hat C]$', '$\\hat B[\\hat A,\\hat C] - [\\hat A,\\hat B]\\hat C$'], a:0, ex:'Wie eine Produktregel; die Reihenfolge von $\\hat B$ und $\\hat C$ bleibt erhalten.', lex:'kommutator', prev:'form'},
    {q:'$\\int_0^{2\\pi}e^{i m\\varphi}\\,d\\varphi$ für ganzzahliges $m \\ne 0$ ist …', opts:['$0$', '$2\\pi$', '$2\\pi/m$'], a:0, ex:'Über eine volle Periode mittelt sich $e^{im\\varphi}$ weg. Für $m = 0$ kommt $2\\pi$ heraus.', lex:'integrale'},
    {q:'Warum muss $m$ in $e^{im\\varphi}$ für eine Wellenfunktion ganzzahlig sein?', opts:['$\\varphi$ und $\\varphi + 2\\pi$ beschreiben denselben Punkt, die Funktion muss eindeutig sein.', 'weil Drehimpulse immer positiv sind', 'wegen der Normierung'], a:0, ex:'Eindeutigkeit: $e^{im(\\varphi + 2\\pi)} = e^{im\\varphi}$ verlangt $m\\in\\mathbb Z$.', lex:'kugelflaechenfunktionen'}
  ],
  example:{
    title:'$[L_z, L_+] = \\hbar L_+$',
    text:'Mit $L_+ = L_x + iL_y$ und den Vertauschungsrelationen $[L_z, L_x] = i\\hbar L_y$, $[L_z, L_y] = -i\\hbar L_x$. Hier werden die Operatoren ohne Dach geschrieben.',
    ctx:DREH_JM(),
    lines:[
      {l:'[L_z, L_+] = [L_z, L_x] + i[L_z, L_y]', why:{q:'Welche Regel wurde benutzt?', opts:['Der Kommutator ist linear in jedem Argument.', 'Kommutatoren sind symmetrisch.', '$L_+$ vertauscht mit allem.'], a:0, ex:'$[A, B + cC] = [A,B] + c[A,C]$.'}},
      {l:'= iħ L_y + i(-iħ L_x)', why:{q:'Woher kommt $[L_z, L_y] = -i\\hbar L_x$?', opts:['zyklische Vertauschung: $[L_y, L_z] = i\\hbar L_x$, also $[L_z,L_y] = -i\\hbar L_x$', 'aus $L_z = -i\\hbar\\partial_\\varphi$', 'aus $L_+L_-$'], a:0, ex:'$[L_i, L_j] = i\\hbar\\varepsilon_{ijk}L_k$; Vertauschen der Argumente ändert das Vorzeichen.'}},
      {l:'= ħ (L_x + i L_y)', why:{q:'Was ist $i\\cdot(-i)$?', opts:['$1$', '$-1$', '$i$'], a:0, ex:'$-i^2 = 1$, also $i(-i\\hbar L_x) = \\hbar L_x$.'}},
      {l:'= ħ L_+', why:{q:'Was folgt für $L_+|l,m\\rangle$?', opts:['Es ist Eigenzustand von $L_z$ mit Eigenwert $\\hbar(m+1)$ (oder null).', 'Es hat denselben $L_z$-Eigenwert.', 'Es ist kein Eigenzustand von $L^2$.'], a:0, ex:'$L_zL_+|m\\rangle = L_+L_z|m\\rangle + \\hbar L_+|m\\rangle = \\hbar(m+1)L_+|m\\rangle$. Daher der Name „Aufsteiger“.'}}
    ],
    faded:{id:'dreh-fade', title:'Jetzt du: $[L_z, L_-]$', text:'Zeige $[L_z, L_-] = -\\hbar L_-$ mit $L_- = L_x - iL_y$.',
      ctx:DREH_JM(),
      given:['[L_z, L_-] = [L_z, L_x] - i[L_z, L_y]', '= iħ L_y - i(-iħ L_x)'],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'show', from:'[L_z, L_-]', to:'-ħ L_-', hints:['$-i\\cdot(-i\\hbar) = -\\hbar$.', 'Klammere $-\\hbar$ aus.'],
        model:['[L_z, L_-] = [L_z, L_x] - i[L_z, L_y]', '= iħ L_y - i(-iħ L_x)', {l:'= iħ L_y - ħ L_x', gap:'= iħ L_y ▢'}, '= -ħ (L_x - i L_y)', '= -ħ L_-']}]}
  },
  puzzle:{
    title:'Zeigt der Drehimpuls in z-Richtung?',
    text:'Ein Zustand hat $l = 1$ und $m = 1$, also den größten möglichen Wert von $L_z$.',
    q:{q:'Zeigt $\\vec L$ dann genau in $z$-Richtung?', opts:['Ja, denn $L_z = \\hbar$ ist der volle Betrag.', 'Nein, $|\\vec L| = \\sqrt2\\,\\hbar$ ist größer als $L_z = \\hbar$.', 'Das hängt von $\\varphi$ ab.'], a:1, ex:'$L^2 = \\hbar^2l(l+1) = 2\\hbar^2$, also $|\\vec L| = \\sqrt2\\hbar > \\hbar$.'},
    reveal:'Wäre $\\vec L$ genau entlang $z$, wären $L_x = L_y = 0$ scharf – zusammen mit $L_z$ widerspräche das $[L_x, L_y] = i\\hbar L_z$ und der Unschärferelation $\\Delta L_x\\Delta L_y \\ge \\frac\\hbar2|\\langle L_z\\rangle|$. Tatsächlich ist $\\langle L_x^2\\rangle + \\langle L_y^2\\rangle = \\langle L^2 - L_z^2\\rangle = \\hbar^2$. Im Vektormodell liegt $\\vec L$ auf einem Kegel um die $z$-Achse mit $\\cos\\vartheta = 1/\\sqrt2$, also $45°$.'
  },
  clarify:{
    core:'Die Komponenten des Drehimpulses vertauschen nicht: $[L_x, L_y] = i\\hbar L_z$ (und zyklisch), aber $[L^2, L_i] = 0$. Man wählt gemeinsame Eigenzustände $|l,m\\rangle$ von $L^2$ und $L_z$:\n\n$$L^2|l,m\\rangle = \\hbar^2l(l+1)|l,m\\rangle,\\qquad L_z|l,m\\rangle = \\hbar m|l,m\\rangle,\\qquad m = -l, \\dots, l.$$\n\nDie Leiteroperatoren $L_\\pm = L_x \\pm iL_y$ ändern $m$ um $\\pm1$: $L_\\pm|l,m\\rangle = \\hbar\\sqrt{l(l+1) - m(m\\pm1)}\\,|l,m\\pm1\\rangle$. Für den Bahndrehimpuls ist $l$ ganzzahlig und $\\langle\\theta,\\varphi|l,m\\rangle = Y_l^m(\\theta,\\varphi)$ mit $\\hat L_z = -i\\hbar\\partial_\\varphi$.',
    keys:[
      'Zu jedem $l$ gibt es $2l + 1$ Werte von $m$.',
      '$L_+L_- = L^2 - L_z^2 + \\hbar L_z$ und $L_-L_+ = L^2 - L_z^2 - \\hbar L_z$ – daraus folgen die Faktoren der Leiteroperatoren.',
      '$Y_l^m \\propto e^{im\\varphi}$, deshalb $\\hat L_zY_l^m = \\hbar mY_l^m$ sofort. $|Y_l^m|^2$ hängt nicht von $\\varphi$ ab.',
      'Normierung auf der Kugel: $\\int_0^\\pi\\int_0^{2\\pi}|Y_l^m|^2\\sin\\theta\\,d\\varphi\\,d\\theta = 1$ – das $\\sin\\theta$ nicht vergessen.',
      'Konvention: $Y_1^0 = \\sqrt{\\tfrac{3}{4\\pi}}\\cos\\theta$, $Y_1^{\\pm1} = \\mp\\sqrt{\\tfrac{3}{8\\pi}}\\sin\\theta\\,e^{\\pm i\\varphi}$ (Condon-Shortley-Phase).'
    ],
    errors:[
      '$|\\vec L| = \\hbar l$ statt $\\hbar\\sqrt{l(l+1)}$.',
      'Im Faktor von $L_+$ das Vorzeichen falsch: $m(m+1)$, nicht $m(m-1)$. Probe: $L_+|l,l\\rangle$ muss null sein.',
      '$L_\\pm$ für Observablen halten: Sie sind nicht hermitesch, $L_+^\\dagger = L_-$.',
      'Beim Integrieren über die Kugel $\\sin\\theta$ vergessen.',
      'Glauben, man könne $L_x$, $L_y$ und $L_z$ gleichzeitig scharf messen.'
    ],
    more:[{title:'Halbzahlige Drehimpulse', text:'Aus den Vertauschungsrelationen allein folgen auch halbzahlige Werte $j = \\tfrac12, \\tfrac32, \\dots$ Beim Bahndrehimpuls schließt die Eindeutigkeit von $e^{im\\varphi}$ sie aus; beim Spin (Thema 10) kommen sie vor. Das Tutorial kennt deshalb auch Kets $|j,m\\rangle$ mit halbzahligem $j$.'}],
    checks:[
      {q:'Welche Werte kann $L_z$ bei $l = 2$ annehmen?', opts:['$-2\\hbar, -\\hbar, 0, \\hbar, 2\\hbar$', '$0, \\hbar, 2\\hbar$', '$\\pm\\sqrt6\\hbar$'], a:0, ex:'$m = -l, \\dots, l$, also fünf Werte.'},
      {q:'Was ist $L_+|1,1\\rangle$?', opts:['der Nullvektor', '$\\sqrt2\\hbar|1,2\\rangle$', '$\\hbar|1,1\\rangle$'], a:0, ex:'$\\sqrt{l(l+1) - m(m+1)} = \\sqrt{2 - 2} = 0$: Die Leiter endet bei $m = l$.'}
    ]
  },
  lab:{type:'ylm', title:'Kugelflächenfunktionen im Polardiagramm',
    text:'Gezeichnet ist $|Y_l^m(\\theta,\\varphi)|^2$ als Abstand vom Ursprung in der $x$-$z$-Ebene. Weil $|Y_l^m|^2$ nicht von $\\varphi$ abhängt, entsteht die räumliche Form durch Drehen um die $z$-Achse.',
    questions:[
      {q:'Stelle $l = 1$, $m = 0$ ein. Wo ist $|Y_1^0|^2$ null?', opts:['in der $x$-$y$-Ebene ($\\theta = \\pi/2$)', 'auf der $z$-Achse', 'nirgends'], a:0, ex:'$|Y_1^0|^2 \\propto \\cos^2\\theta$ verschwindet bei $\\theta = \\pi/2$.'},
      {q:'Stelle $l = 1$, $m = 1$ ein. Welche Form ergibt sich nach Drehung um $z$?', opts:['ein Ring (Torus) um die $z$-Achse', 'eine Hantel entlang $z$', 'eine Kugel'], a:0, ex:'$|Y_1^{\\pm1}|^2 \\propto \\sin^2\\theta$ ist in der $x$-$y$-Ebene am größten und auf der $z$-Achse null.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele Knotenkegel ($\\theta$ = konstant) hat $Y_3^1$?', opts:['2', '3', '1'], a:0, ex:'Die Zahl der Knoten in $\\theta$ ist $l - |m| = 2$.'}},
  compare:{
    text:'Gesucht ist $\\hat L_zY_1^1$ mit $Y_1^1 = -\\sqrt{\\tfrac{3}{8\\pi}}\\sin\\theta\\,e^{i\\varphi}$ und $\\hat L_z = -i\\hbar\\,\\partial/\\partial\\varphi$. Zwei richtige Wege:',
    ctx:DREH_SPH(),
    A:{name:'Ableitung ausrechnen', model:['L̂_z Y_1^1(θ,φ) = -iħ ∂/∂φ (-sqrt(3/(8π)) sin(θ) e^(iφ))', '= -iħ · i (-sqrt(3/(8π)) sin(θ) e^(iφ))', '= ħ Y_1^1(θ,φ)']},
    B:{name:'Struktur $e^{im\\varphi}$ nutzen', text:'Jede $Y_l^m$ hängt nur über $e^{im\\varphi}$ von $\\varphi$ ab, also $\\partial_\\varphi Y_l^m = imY_l^m$.', model:['L̂_z Y_1^1(θ,φ) = -iħ · i · 1 · Y_1^1(θ,φ)', '= ħ Y_1^1(θ,φ)']},
    questions:[
      {q:'Für welche Aufgabe reicht Weg B nicht?', opts:['$\\hat L^2Y_l^m$: dafür braucht man die $\\theta$-Abhängigkeit.', '$\\hat L_zY_3^{-2}$', '$\\hat L_z e^{2i\\varphi}$'], a:0, ex:'$\\hat L^2$ enthält Ableitungen nach $\\theta$; dort hilft nur Ausrechnen oder das Wissen $\\hat L^2Y_l^m = \\hbar^2l(l+1)Y_l^m$.'},
      {q:'Was zeigt Weg A, das Weg B voraussetzt?', opts:['dass die gegebene Funktion wirklich nur $e^{i\\varphi}$ enthält', 'dass $\\hbar > 0$', 'nichts'], a:0, ex:'Weg B nimmt die Form $f(\\theta)e^{im\\varphi}$ an; Weg A prüft sie an der konkreten Funktion.'}
    ]
  },
  practice:[
    {id:'dreh-p1', title:'Algebra mit Leiteroperatoren',
      text:'Zustände $|l,m\\rangle$; Operatoren `L_x`, `L_y`, `L_z`, `L_+`, `L_-`, `L^2` (ohne Dach). Es gilt $[L_x, L_y] = i\\hbar L_z$.',
      ctx:DREH_JM(),
      goals:[
        {id:'a', prompt:'a) Zeige $L_+L_- = L^2 - L_z^2 + \\hbar L_z$.', type:'show', from:'L_+ L_-', to:'L^2 - L_z^2 + ħ L_z', points:3,
          hints:['Ausmultiplizieren: $(L_x + iL_y)(L_x - iL_y) = L_x^2 + L_y^2 - i[L_x, L_y]$.'],
          model:['L_+ L_- = (L_x + i L_y)(L_x - i L_y)', '= L_x^2 + L_y^2 - i[L_x, L_y]', '= L_x^2 + L_y^2 + ħ L_z', '= L^2 - L_z^2 + ħ L_z']},
        {id:'b', prompt:'b) Berechne $\\langle l,m|L_x^2|l,m\\rangle$. Aus Symmetriegründen ist $\\langle L_x^2\\rangle = \\langle L_y^2\\rangle$.', type:'value', target:'ħ^2/2 (l(l+1) - m^2)', points:2,
          hints:['$L_x^2 + L_y^2 = L^2 - L_z^2$.'],
          model:['⟨l,m|L_x^2|l,m⟩ = 1/2 ⟨l,m|(L^2 - L_z^2)|l,m⟩', '= ħ^2/2 (l(l+1) - m^2)']}
      ]},
    {id:'dreh-p2', title:'Der Faktor von $L_+$',
      text:'$L_+|l,m\\rangle$ ist proportional zu $|l,m+1\\rangle$. Den Betrag des Faktors bestimmst du über die Norm.',
      ctx:DREH_JM({unknowns:{c:{ref:'sqrt(2) ħ'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\|L_+|l,m\\rangle\\|^2 = \\langle l,m|L_-L_+|l,m\\rangle$.', type:'value', target:'ħ^2 (l(l+1) - m(m+1))', points:3,
          hints:['$L_-L_+ = L^2 - L_z^2 - \\hbar L_z$.'],
          model:['⟨l,m|L_- L_+|l,m⟩ = ⟨l,m|(L^2 - L_z^2 - ħ L_z)|l,m⟩', '= ħ^2 (l(l+1) - m^2 - m)']},
        {id:'b', prompt:'b) Bestimme $c$ in $L_+|1,-1\\rangle = c\\,|1,0\\rangle$.', type:'solve', unknown:'c', points:2,
          model:['L_+|1,-1⟩ = c |1, 0⟩', 'c = ħ sqrt(1·2 - (-1)·0)', 'c = sqrt(2) ħ']}
      ]},
    {id:'dreh-p3', title:'Eigenwerte in Kugelkoordinaten',
      text:'$\\hat L^2 = -\\hbar^2\\left[\\frac{1}{\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial}{\\partial\\theta}\\right) + \\frac{1}{\\sin^2\\theta}\\frac{\\partial^2}{\\partial\\varphi^2}\\right]$ und $\\hat L_z = -i\\hbar\\frac{\\partial}{\\partial\\varphi}$. Im Tutorial: `L̂^2` und `L̂_z`.',
      ctx:DREH_SPH({λ:{ref:'2ħ^2'}, μ:{ref:'ħ', kind:'real'}}),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $\\cos\\theta$ Eigenfunktion von $\\hat L^2$ ist, und bestimme den Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:3,
          hints:['$\\cos\\theta$ hängt nicht von $\\varphi$ ab; nur der $\\theta$-Teil trägt bei.', '$\\sin\\theta\\,\\partial_\\theta\\cos\\theta = -\\sin^2\\theta$.'],
          model:['L̂^2 cos(θ) = λ cos(θ)', 'L̂^2 cos(θ) = -ħ^2/sin(θ) ∂/∂θ (sin(θ) ∂/∂θ cos(θ))', '= -ħ^2/sin(θ) ∂/∂θ (-sin(θ)^2)', '= -ħ^2/sin(θ) (-2 sin(θ) cos(θ))', '= 2ħ^2 cos(θ)', 'λ = 2ħ^2'],
          note:'$\\lambda = 2\\hbar^2 = \\hbar^2l(l+1)$ mit $l = 1$: $\\cos\\theta \\propto Y_1^0$.'},
        {id:'b', prompt:'b) Bestimme den Eigenwert $\\mu$ von $\\hat L_z$ zu $\\sin\\theta\\,e^{i\\varphi}$.', type:'solve', unknown:'μ', points:2,
          model:['L̂_z sin(θ) e^(iφ) = μ sin(θ) e^(iφ)', 'L̂_z sin(θ) e^(iφ) = -iħ · i sin(θ) e^(iφ)', '= ħ sin(θ) e^(iφ)', 'μ = ħ']}
      ]},
    {id:'dreh-p4', title:'Normierung und Orthogonalität auf der Kugel',
      text:'Auf der Einheitskugel ist $\\langle f|g\\rangle = \\int_0^\\pi\\int_0^{2\\pi}f^*g\\,\\sin\\theta\\,d\\varphi\\,d\\theta$.',
      ctx:DREH_SPH({N:{ref:'sqrt(3/(4π))', alt:['-sqrt(3/(4π))']}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $N > 0$ so, dass $N\\cos\\theta$ normiert ist.', type:'solve', unknown:'N', points:2,
          hints:['$\\int_0^\\pi\\cos^2\\theta\\sin\\theta\\,d\\theta = 2/3$ (Substitution $u = \\cos\\theta$).'],
          model:['|N|^2 ∫_0^π ∫_0^{2π} cos(θ)^2 sin(θ) dφ dθ = 1', '|N|^2 · 2π · 2/3 = 1', 'N = sqrt(3/(4π))']},
        {id:'b', prompt:'b) Zeige $\\langle Y_1^0|Y_1^1\\rangle = 0$.', type:'value', target:'0', points:2,
          hints:['Das Produkt zerfällt in ein $\\theta$- und ein $\\varphi$-Integral.', '$\\int_0^{2\\pi}e^{i\\varphi}d\\varphi = 0$.'],
          model:['⟨Y_1^0(θ,φ)|Y_1^1(θ,φ)⟩ = ∫_0^π ∫_0^{2π} Y_1^0(θ,φ)^* Y_1^1(θ,φ) sin(θ) dφ dθ', '= -3/(4π sqrt(2)) ∫_0^π cos(θ) sin(θ)^2 dθ ∫_0^{2π} e^(iφ) dφ', '= 0']}
      ]},
    {id:'dreh-p5', title:'Matrixelemente bei $l = 1$',
      text:'Benutze $L_x = \\tfrac12(L_+ + L_-)$. Der Zustand $|\\chi\\rangle$ ist $|1,0\\rangle$; `⟨L_x⟩` und `ΔL_x` beziehen sich auf ihn.',
      ctx:DREH_JM({states:{χ:'|1, 0⟩'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle 1,1|L_x|1,0\\rangle$.', type:'value', target:'ħ/sqrt(2)', points:2,
          model:['⟨1,1|L_x|1, 0⟩ = 1/2 ⟨1,1|(L_+ + L_-)|1, 0⟩', '= 1/2 ħ sqrt(2)', '= ħ/sqrt(2)']},
        {id:'b', prompt:'b) Berechne $\\Delta L_x$ im Zustand $|1,0\\rangle$.', type:'value', target:'ħ', points:2,
          hints:['$\\langle L_x\\rangle = 0$, $\\langle L_x^2\\rangle = \\frac{\\hbar^2}{2}(l(l+1) - m^2)$.'],
          model:['ΔL_x = sqrt(⟨L_x^2⟩ - ⟨L_x⟩^2)', '= sqrt(ħ^2 - 0)', '= ħ']}
      ]}
  ],
  final:[
    {q:'Wie viele Zustände $|l,m\\rangle$ gibt es zu $l = 3$?', opts:['7', '3', '6'], a:0, ex:'$2l + 1 = 7$.'},
    {task:{id:'dreh-f1', title:'Eigenwert von $\\hat L_z$', text:'$\\hat L_z = -i\\hbar\\,\\partial/\\partial\\varphi$.',
      ctx:DREH_SPH({μ:{ref:'-2ħ', kind:'real'}}),
      goals:[{id:'a', prompt:'Bestimme $\\mu$ mit $\\hat L_z\\,\\sin^2\\theta\\,e^{-2i\\varphi} = \\mu\\,\\sin^2\\theta\\,e^{-2i\\varphi}$.', type:'solve', unknown:'μ', points:2,
        model:['L̂_z sin(θ)^2 e^(-2iφ) = μ sin(θ)^2 e^(-2iφ)', 'L̂_z sin(θ)^2 e^(-2iφ) = -iħ · (-2i) sin(θ)^2 e^(-2iφ)', '= -2ħ sin(θ)^2 e^(-2iφ)', 'μ = -2ħ']}]}},
    {q:'Welchen Eigenwert hat $L^2$ für $l = 3$?', opts:['$12\\hbar^2$', '$9\\hbar^2$', '$3\\hbar^2$'], a:0, ex:'$\\hbar^2l(l+1) = 12\\hbar^2$.'},
    {task:{id:'dreh-f2', title:'Leiterfaktor', text:'Zustände $|l,m\\rangle$, Aufsteiger `L_+`.',
      ctx:DREH_JM(),
      goals:[{id:'a', prompt:'Berechne $\\langle 2,1|L_+|2,0\\rangle$.', type:'value', target:'ħ sqrt(6)', points:2, model:['⟨2,1|L_+|2,0⟩ = ħ sqrt(2·3 - 0·1)', '= ħ sqrt(6)']}]}}
  ],
  errors:[
    {id:'dreh-e1', title:'Ein Vorzeichen im Leiterfaktor',
      text:'Gesucht ist $L_+|1,-1\\rangle = c\\,|1,0\\rangle$:',
      ctx:DREH_JM({unknowns:{c:{ref:'sqrt(2) ħ'}}}),
      lines:['L^2|1,-1⟩ = 2ħ^2 |1,-1⟩', 'L_+|1,-1⟩ = ħ sqrt(1·2 - (-1)(-2)) |1, 0⟩', 'L_+|1,-1⟩ = 0'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Im Faktor steht $m(m+1) = (-1)\\cdot 0$, nicht $m(m-1)$.', '$l(l+1)$ müsste $l^2$ sein.', 'Es fehlt ein Faktor $i$.'], a:0, ex:'$L_+$: $\\sqrt{l(l+1) - m(m+1)}$. Probe: Von $m = -l$ aus muss man aufsteigen können, also darf der Faktor dort nicht null sein.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $c$.', type:'solve', unknown:'c', model:['L_+|1,-1⟩ = ħ sqrt(1·2 - (-1)·0) |1, 0⟩', 'L_+|1,-1⟩ = c |1, 0⟩', 'c = sqrt(2) ħ']}},
    {id:'dreh-e2', title:'Kettenregel bei $\\hat L_z$',
      text:'Gesucht ist der Eigenwert $\\mu$ von $\\hat L_z$ zu $e^{2i\\varphi}$:',
      ctx:DREH_SPH({μ:{ref:'2ħ', kind:'real'}}),
      lines:['L̂_z e^(2iφ) = -iħ ∂/∂φ e^(2iφ)', '= -iħ · 2 e^(2iφ)', '= -2iħ e^(2iφ)'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Die innere Ableitung von $2i\\varphi$ ist $2i$, nicht $2$.', 'Es muss nach $\\theta$ abgeleitet werden.', '$\\hat L_z$ enthält kein $i$.'], a:0, ex:'Mit dem fehlenden $i$ käme ein imaginärer Eigenwert heraus – unmöglich für einen hermiteschen Operator.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $\\mu$.', type:'solve', unknown:'μ', model:['L̂_z e^(2iφ) = -iħ · 2i e^(2iφ)', '= 2ħ e^(2iφ)', 'L̂_z e^(2iφ) = μ e^(2iφ)', 'μ = 2ħ']}}
  ]
});
lexe('drehimpuls-algebra', 'Drehimpuls: Vertauschungsrelationen', '$[L_x, L_y] = i\\hbar L_z$, $[L_y, L_z] = i\\hbar L_x$, $[L_z, L_x] = i\\hbar L_y$, kurz $[L_i, L_j] = i\\hbar\\varepsilon_{ijk}L_k$. Außerdem $[L^2, L_i] = 0$, $[L_z, L_\\pm] = \\pm\\hbar L_\\pm$, $[L_+, L_-] = 2\\hbar L_z$. Klassisch $\\vec L = \\vec r\\times\\vec p$.', {topic:'dreh'});
lexe('drehimpuls-leiter', 'Drehimpuls: Leiteroperatoren', '$L_\\pm = L_x \\pm iL_y$, $L_\\pm^\\dagger = L_\\mp$. $L_\\pm|l,m\\rangle = \\hbar\\sqrt{l(l+1) - m(m\\pm1)}\\,|l,m\\pm1\\rangle$. Nützlich: $L_\\mp L_\\pm = L^2 - L_z^2 \\mp \\hbar L_z$ und $L_x = \\tfrac12(L_+ + L_-)$, $L_y = \\tfrac{1}{2i}(L_+ - L_-)$.', {topic:'dreh'});
lexe('drehimpuls-eigenwerte', 'Drehimpuls: Eigenwerte', '$L^2|l,m\\rangle = \\hbar^2l(l+1)|l,m\\rangle$, $L_z|l,m\\rangle = \\hbar m|l,m\\rangle$ mit $m = -l, -l+1, \\dots, l$. Bahndrehimpuls: $l = 0, 1, 2, \\dots$ (s, p, d, f). Allgemein (Spin) auch halbzahlig.', {topic:'dreh'});
lexe('kugelflaechenfunktionen', 'Kugelflächenfunktionen', '$Y_l^m(\\theta,\\varphi) = \\sqrt{\\frac{2l+1}{4\\pi}\\frac{(l-m)!}{(l+m)!}}P_l^m(\\cos\\theta)e^{im\\varphi}$ (mit Condon-Shortley-Phase in $P_l^m$). Beispiele: $Y_0^0 = \\frac{1}{\\sqrt{4\\pi}}$, $Y_1^0 = \\sqrt{\\frac{3}{4\\pi}}\\cos\\theta$, $Y_1^{\\pm1} = \\mp\\sqrt{\\frac{3}{8\\pi}}\\sin\\theta e^{\\pm i\\varphi}$, $Y_2^0 = \\sqrt{\\frac{5}{16\\pi}}(3\\cos^2\\theta - 1)$. Orthonormal bezüglich $\\sin\\theta\\,d\\theta\\,d\\varphi$. Im Tutorial: `Y_l^m(θ,φ)`, z. B. `Y_1^0(θ,φ)`.', {topic:'dreh'});
lexe('drehimpuls-kugel', 'Drehimpulsoperatoren in Kugelkoordinaten', '$\\hat L_z = -i\\hbar\\partial_\\varphi$, $\\hat L^2 = -\\hbar^2\\left[\\frac{1}{\\sin\\theta}\\partial_\\theta(\\sin\\theta\\,\\partial_\\theta) + \\frac{1}{\\sin^2\\theta}\\partial_\\varphi^2\\right]$, $\\hat L_\\pm = \\hbar e^{\\pm i\\varphi}\\left(\\pm\\partial_\\theta + i\\cot\\theta\\,\\partial_\\varphi\\right)$. Im Tutorial: `L̂_z`, `L̂^2`, `L̂_+`, `L̂_-`.', {topic:'dreh'});
