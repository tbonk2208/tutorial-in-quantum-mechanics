/* ===== Thema 2: Schrödingergleichung und stationäre Zustände ===== */
(function(){
const BOX2 = (extra) => Object.assign({coords:['x', 't'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'},
  defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)'}}, extra || {});
const DYN = (extra) => Object.assign({coords:['x', 't'], params:{m:'pos'}, abstract:{ψ:{args:['x', 't']}, V:{args:['x'], real:true}}, dyn:{fn:'ψ'}}, extra || {});
topic({
  id:'sg', math:['m-komplex', 'm-dgl'], title:'Schrödingergleichung und stationäre Zustände', short:'Schrödingergleichung',
  src:'Griffiths & Schroeter Kap. 1 und 2.1 · Nolting 5/1 Kap. 2–3 · Schwabl Kap. 2',
  goals:[
    'Ich kann mit dem Separationsansatz $\\Psi(x,t) = \\psi(x)e^{-iEt/\\hbar}$ von der zeitabhängigen zur stationären Schrödingergleichung kommen.',
    'Ich kann begründen, warum in stationären Zuständen $|\\Psi|^2$ zeitunabhängig ist, und die Periode einer Überlagerung angeben.',
    'Ich kann die Wahrscheinlichkeitsstromdichte $j$ berechnen und die Kontinuitätsgleichung herleiten.'
  ],
  needs:'Bornsche Deutung und Normierung (Thema 1) · Ableiten von $e^{-i\\omega t}$ · partielle Ableitungen',
  check:[
    {q:'Was muss für eine Wellenfunktion zu jeder Zeit gelten?', opts:['$\\int|\\Psi(x,t)|^2dx = 1$', '$\\Psi(0,t) = 1$', '$\\Psi$ ist reell'], a:0, ex:'Das Teilchen ist mit Sicherheit irgendwo: Normierung.', lex:'normierung', prev:'wf'},
    {q:'$\\frac{\\partial}{\\partial t}e^{-iEt/\\hbar}$ ist …', opts:['$-\\frac{iE}{\\hbar}e^{-iEt/\\hbar}$', '$\\frac{iE}{\\hbar}e^{-iEt/\\hbar}$', '$-\\frac{E}{\\hbar}e^{-iEt/\\hbar}$'], a:0, ex:'Kettenregel: Der Faktor vor $t$ im Exponenten kommt heraus.', lex:'euler', prev:'m-komplex'},
    {q:'$|\\psi(x)e^{-iEt/\\hbar}|^2$ ist gleich …', opts:['$|\\psi(x)|^2$', '$|\\psi(x)|^2e^{-2iEt/\\hbar}$', '$|\\psi(x)|^2\\cos^2(Et/\\hbar)$'], a:0, ex:'$|e^{-iEt/\\hbar}|^2 = 1$ für reelles $E$.', lex:'komplexe-zahlen'},
    {q:'Wie lautet der Hamilton-Operator eines Teilchens im Potenzial $V(x)$?', opts:['$-\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2} + V(x)$', '$\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2} + V(x)$', '$-i\\hbar\\frac{d}{dx} + V(x)$'], a:0, ex:'$\\hat H = \\hat p^2/2m + V$ mit $\\hat p = -i\\hbar\\,d/dx$, also $\\hat p^2 = -\\hbar^2d^2/dx^2$.', lex:'hamilton'}
  ],
  example:{
    title:'Eine ebene Welle löst die freie Schrödingergleichung',
    text:'Für $V = 0$ ist $\\Psi(x,t) = A\\,e^{i(kx - \\omega t)}$. Für welches $\\omega$ erfüllt $\\Psi$ die Gleichung $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi$?',
    ctx:{coords:['x', 't'], params:{A:'pos', k:'pos', m:'pos'}, defs:{'Ψ(x,t)':'A e^(i(k x - ω t))'}, unknowns:{ω:{ref:'ħ k^2/(2m)'}}},
    lines:[
      {l:'iħ ∂Ψ/∂t = iħ (-iω) Ψ', why:{q:'Woher kommt der Faktor $-i\\omega$?', opts:['Ableitung des Exponenten $i(kx - \\omega t)$ nach $t$', 'Aus der Normierung', 'Aus $\\hat p = -i\\hbar\\,d/dx$'], a:0, ex:'$\\partial_t e^{i(kx-\\omega t)} = -i\\omega\\,e^{i(kx-\\omega t)}$.'}},
      {l:'= ħω Ψ', why:{q:'Warum wird daraus $\\hbar\\omega\\Psi$?', opts:['$i\\cdot(-i) = 1$', '$i^2 = 1$', 'Weil $\\Psi$ reell ist'], a:0, ex:'$i\\hbar\\cdot(-i\\omega) = -i^2\\hbar\\omega = \\hbar\\omega$.'}},
      {l:'-ħ^2/(2m) ∂^2Ψ/∂x^2 = -ħ^2/(2m) (ik)^2 Ψ', why:{q:'Woher kommt $(ik)^2$?', opts:['Zweimal nach $x$ ableiten gibt zweimal den Faktor $ik$.', 'Aus der Zeitableitung', 'Aus der Normierung'], a:0, ex:'Jede Ableitung nach $x$ liefert den Faktor $ik$.'}},
      {l:'= ħ^2 k^2/(2m) Ψ', why:{q:'Was ist $-(ik)^2$?', opts:['$k^2$', '$-k^2$', '$ik^2$'], a:0, ex:'$(ik)^2 = -k^2$, mit dem Minus davor also $+k^2$.'}},
      {l:'ħω = ħ^2 k^2/(2m)', why:{q:'Warum müssen die Vorfaktoren gleich sein?', opts:['Beide Seiten sind Vielfache derselben Funktion $\\Psi \\ne 0$.', 'Weil $\\omega = k$ ist.', 'Weil $A$ normiert ist.'], a:0, ex:'$\\hbar\\omega\\Psi = \\frac{\\hbar^2k^2}{2m}\\Psi$ für alle $x, t$ geht nur, wenn die Faktoren übereinstimmen.'}},
      {l:'ω = ħ k^2/(2m)', w:'Dispersionsrelation', why:{q:'Was bedeutet $\\hbar\\omega = \\hbar^2k^2/2m$ physikalisch?', opts:['$E = p^2/2m$ mit $E = \\hbar\\omega$, $p = \\hbar k$', '$E = mc^2$', 'Die Welle ist stehend.'], a:0, ex:'Mit de Broglie und Planck-Einstein ist das genau die klassische kinetische Energie.'}}
    ],
    faded:{id:'sg-fade', title:'Jetzt du: Dichte eines stationären Zustands',
      text:'Im Kasten ist $\\Psi(x,t) = \\sqrt{2/L}\\,\\sin(\\pi x/L)\\,e^{-iE_1t/\\hbar}$. Zeige, dass $|\\Psi|^2$ nicht von $t$ abhängt.',
      ctx:{coords:['x', 't'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', 'E_1':'pos'}, defs:{'Ψ(x,t)':'sqrt(2/L) sin(π x/L) e^(-i E_1 t/ħ)'}},
      given:['|Ψ(x,t)|^2 = Ψ^* Ψ', '= 2/L sin(πx/L)^2 e^(iE_1 t/ħ) e^(-iE_1 t/ħ)'],
      goals:[{id:'a', prompt:'Vereinfache bis zum Ende.', type:'value', target:'2/L sin(π x/L)^2', points:2, hints:['$e^{a}e^{-a} = 1$.'],
        model:['|Ψ(x,t)|^2 = Ψ^* Ψ', '= 2/L sin(πx/L)^2 e^(iE_1 t/ħ) e^(-iE_1 t/ħ)', {l:'= 2/L sin(πx/L)^2', gap:'= ▢'}]}]}
  },
  puzzle:{
    title:'Schwappt es oder nicht?',
    text:'Im Kasten sind $\\psi_1$ und $\\psi_2$ stationäre Zustände: Ihre Dichten hängen nicht von der Zeit ab. Nun präpariert man $\\Psi(x,0) = \\frac{1}{\\sqrt2}(\\psi_1 + \\psi_2)$.\n\nWas passiert mit der Aufenthaltswahrscheinlichkeit $|\\Psi(x,t)|^2$?',
    q:{q:'Deine Vermutung:', opts:['Sie bleibt konstant, weil beide Teile stationär sind.', 'Sie schwingt mit der Kreisfrequenz $(E_2 - E_1)/\\hbar$.', 'Sie schwingt mit $(E_1 + E_2)/\\hbar$.', 'Sie zerfließt langsam.'], a:1, ex:'Der Mischterm enthält $e^{-i(E_2-E_1)t/\\hbar}$.'},
    reveal:'Jeder Anteil bekommt seinen eigenen Phasenfaktor: $\\Psi(x,t) = \\frac{1}{\\sqrt2}\\left(\\psi_1e^{-iE_1t/\\hbar} + \\psi_2e^{-iE_2t/\\hbar}\\right)$. Beim Betragsquadrat bleiben die Phasen in den Einzeltermen nicht stehen, im Mischterm aber schon:\n\n$$|\\Psi|^2 = \\tfrac12\\left(\\psi_1^2 + \\psi_2^2\\right) + \\psi_1\\psi_2\\cos\\!\\left(\\frac{(E_2 - E_1)t}{\\hbar}\\right).$$\n\nDie Dichte schwappt also mit der Periode $T = 2\\pi\\hbar/(E_2 - E_1)$ hin und her. Eine Überlagerung stationärer Zustände ist selbst nicht stationär – ein häufiger Irrtum ist „jeder Zustand ist ein Energie-Eigenzustand“.'
  },
  clarify:{
    core:'Die Zeitentwicklung bestimmt die **zeitabhängige Schrödingergleichung**\n\n$$i\\hbar\\frac{\\partial\\Psi}{\\partial t} = \\hat H\\Psi,\\qquad \\hat H = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2}{\\partial x^2} + V(x).$$\n\nIst $V$ zeitunabhängig, führt der Ansatz $\\Psi = \\psi(x)\\,e^{-iEt/\\hbar}$ auf die **stationäre** Gleichung $\\hat H\\psi = E\\psi$. In einem stationären Zustand hängen $|\\Psi|^2$ und alle Erwartungswerte nicht von $t$ ab. Die allgemeine Lösung ist eine Überlagerung $\\Psi = \\sum_n c_n\\psi_n e^{-iE_nt/\\hbar}$.\n\nDie Wahrscheinlichkeit „fließt“ mit der Stromdichte $j = \\frac{\\hbar}{2mi}\\left(\\Psi^*\\partial_x\\Psi - \\Psi\\,\\partial_x\\Psi^*\\right)$, und es gilt die Kontinuitätsgleichung $\\partial_t|\\Psi|^2 + \\partial_x j = 0$. Daraus folgt: Die Normierung bleibt erhalten.',
    keys:[
      'Der Zeitfaktor heißt $e^{-iEt/\\hbar}$ mit Minus. Das Vorzeichen ist durch $i\\hbar\\partial_t$ festgelegt.',
      'Stationär heißt nicht „das Teilchen ruht“, sondern „die Wahrscheinlichkeitsverteilung ändert sich nicht“.',
      'Jeder Summand einer Überlagerung bekommt seinen eigenen Phasenfaktor $e^{-iE_nt/\\hbar}$.',
      'Für reelle $\\psi$ (zeitunabhängig) ist $j = 0$. Strom braucht komplexe Wellenfunktionen, etwa $e^{ikx}$.',
      'Bei der Kontinuitätsgleichung setzt man die Schrödingergleichung für $\\partial_t\\Psi$ und ihr komplex Konjugiertes für $\\partial_t\\Psi^*$ ein; $V$ muss dafür reell sein.'
    ],
    errors:[
      'Einen gemeinsamen Faktor $e^{-iEt/\\hbar}$ vor eine Überlagerung verschiedener Energien schreiben.',
      '$\\partial_t\\Psi^*$ mit demselben Vorzeichen wie $\\partial_t\\Psi$ einsetzen: Beim Konjugieren wird $i \\to -i$.',
      'Glauben, nur Energie-Eigenzustände seien erlaubte Zustände.',
      'Die Einheit von $j$ in einer Dimension vergessen: $1/\\mathrm{s}$ (Wahrscheinlichkeit pro Zeit).'
    ],
    more:[{title:'Warum ist $E$ reell?', text:'Setzt man $E = E_0 + i\\Gamma$ ein, wird $|\\Psi|^2 \\propto e^{2\\Gamma t/\\hbar}$. Dann könnte die Normierung nicht erhalten bleiben. Normierbare Lösungen gehören deshalb zu reellen Energien.'}],
    checks:[
      {q:'$\\Psi(x,t) = \\psi_1(x)e^{-iE_1t/\\hbar}$. Wie hängt $\\langle x\\rangle$ von der Zeit ab?', opts:['gar nicht', 'wie $\\cos(E_1t/\\hbar)$', 'linear in $t$'], a:0, ex:'Im Integral $\\int\\Psi^*x\\Psi\\,dx$ heben sich die Phasenfaktoren weg.'},
      {q:'Welches Vorzeichen hat die Stromdichte für $\\psi = e^{-ikx}$ mit $k > 0$?', opts:['negativ: der Strom fließt nach links', 'positiv', 'null'], a:0, ex:'$j = \\frac{\\hbar}{2mi}(\\psi^*\\psi\' - \\psi\\psi^{*\\prime}) = -\\hbar k/m$.'}
    ]
  },
  lab:{type:'twostate', title:'Überlagerung zweier Zustände im Kasten',
    text:'Die Kurve ist $|\\Psi(x,t)|^2$ für $\\Psi = c_1\\psi_1e^{-iE_1t/\\hbar} + c_2\\psi_2e^{-iE_2t/\\hbar}$. Stelle den Anteil $|c_1|^2$ ein und lass die Zeit laufen.',
    questions:[
      {q:'Stelle $|c_1|^2 = 1$ ein und spiele die Animation ab. Was passiert?', opts:['Nichts: die Dichte bleibt gleich.', 'Die Dichte schwappt hin und her.', 'Die Dichte wird breiter.'], a:0, ex:'Ein einzelner Energie-Eigenzustand ist stationär.'},
      {q:'Stelle $|c_1|^2 = 0{,}5$ ein. Nach welcher Zeit sieht die Dichte zum ersten Mal wieder aus wie bei $t = 0$?', opts:['nach $T = 2\\pi\\hbar/(E_2 - E_1)$', 'nach $T = 2\\pi\\hbar/E_1$', 'nie wieder'], a:0, ex:'Nur der Mischterm hängt von $t$ ab, und zwar über $\\cos((E_2 - E_1)t/\\hbar)$.'}
    ],
    noPic:{q:'Ohne Bild: Im Kasten überlagert man $\\psi_1$ und $\\psi_3$. Mit welcher Periode schwappt die Dichte? ($E_n = n^2E_1$)', opts:['$T = \\pi\\hbar/(4E_1)$', '$T = 2\\pi\\hbar/(3E_1)$', '$T = \\pi\\hbar/(8E_1)$'], a:0, ex:'$E_3 - E_1 = 8E_1$, also $T = 2\\pi\\hbar/(8E_1) = \\pi\\hbar/(4E_1)$.'}},
  compare:{
    text:'Gesucht ist die Stromdichte für $\\psi(x) = A\\,e^{ikx}$ (mit reellem $A$). Zwei richtige Wege:',
    ctx:{coords:['x'], params:{A:'pos', k:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x)'}},
    A:{name:'Definition der Stromdichte', model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) (A^2 i k + A^2 i k)', '= ħ k A^2/m']},
    B:{name:'Realteil von ψ* p̂ψ / m', text:'Es gilt allgemein $j = \\frac1m\\operatorname{Re}\\left(\\psi^*\\hat p\\psi\\right)$.', model:['j = 1/m Re(ψ^* (-iħ) ψ\')', '= 1/m Re(ħ k A^2)', '= ħ k A^2/m']},
    questions:[
      {q:'Was bedeutet das Ergebnis $j = |A|^2\\hbar k/m$?', opts:['Dichte $|A|^2$ mal Geschwindigkeit $v = \\hbar k/m$', 'Die Energie pro Zeit', 'Die Wahrscheinlichkeit, das Teilchen bei $x$ zu finden'], a:0, ex:'Wie bei einer Strömung: Strom = Dichte × Geschwindigkeit.'},
      {q:'Wann ist Weg B bequemer?', opts:['wenn $\\hat p\\psi$ schon bekannt ist, z. B. bei Impulseigenfunktionen', 'nur bei reellen Funktionen', 'nie'], a:0, ex:'Für $\\psi = Ae^{ikx}$ ist $\\hat p\\psi = \\hbar k\\psi$; dann ist $j$ sofort $\\hbar k|A|^2/m$.'}
    ]
  },
  practice:[
    {id:'sg-p1', title:'Grundzustand im Kasten löst die Schrödingergleichung',
      text:'Im Kasten ($V = 0$ für $0 < x < L$) ist $\\Psi(x,t) = \\sqrt{2/L}\\,\\sin(\\pi x/L)\\,e^{-iE_1t/\\hbar}$ mit $E_1 = \\frac{\\pi^2\\hbar^2}{2mL^2}$.',
      ctx:{coords:['x', 't'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:{'E_1':'π^2 ħ^2/(2m L^2)', 'Ψ(x,t)':'sqrt(2/L) sin(π x/L) e^(-i E_1 t/ħ)'}},
      goals:[
        {id:'a', prompt:'Zeige: $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi$.', type:'show', from:'iħ ∂Ψ/∂t', to:'-ħ^2/(2m) ∂^2Ψ/∂x^2', points:3,
          hints:['Rechne beide Seiten getrennt aus und vergleiche die Vorfaktoren.', '$\\partial_x^2\\sin(\\pi x/L) = -(\\pi/L)^2\\sin(\\pi x/L)$.'],
          model:['iħ ∂Ψ/∂t = iħ (-i E_1/ħ) Ψ', '= E_1 Ψ', '= π^2 ħ^2/(2m L^2) Ψ', '= -ħ^2/(2m) ∂^2Ψ/∂x^2']}
      ]},
    {id:'sg-p2', title:'Überlagerung: schwappender Erwartungswert',
      text:'Im Kasten ist $\\Psi(x,t) = \\frac{1}{\\sqrt2}\\left(\\psi_1(x)e^{-iE_1t/\\hbar} + \\psi_2(x)e^{-iE_2t/\\hbar}\\right)$ mit $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$ und $E_n = n^2\\pi^2\\hbar^2/(2mL^2)$. Es gilt $\\langle\\psi_n|\\hat x|\\psi_n\\rangle = L/2$.',
      ctx:BOX2({defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)', 'Ψ(x,t)':'1/sqrt(2) (ψ_1(x) e^(-i E_1 t/ħ) + ψ_2(x) e^(-i E_2 t/ħ))'}, state:'Ψ', normalized:true, unknowns:{T:{ref:'2πħ/(E_2 - E_1)'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle x\\rangle(t)$.', type:'value', target:'L/2 - 16L/(9π^2) cos((E_2 - E_1) t/ħ)', points:3, ph:'⟨x⟩ = L/2 + ⟨ψ_1|x̂|ψ_2⟩ cos((E_2 - E_1)t/ħ)',
          hints:['Multipliziere $\\langle\\Psi|\\hat x|\\Psi\\rangle$ aus: die Diagonalterme ergeben zusammen $L/2$, die beiden Mischterme zusammen $2\\operatorname{Re}(\\dots)$ (jeweils mit dem Vorfaktor $\\tfrac12$).', '$\\frac2L\\int_0^L x\\sin(\\pi x/L)\\sin(2\\pi x/L)dx = -\\frac{16L}{9\\pi^2}$.'],
          model:['⟨x⟩ = L/2 + ⟨ψ_1|x̂|ψ_2⟩ cos((E_2 - E_1)t/ħ)', '= L/2 + 2/L ∫_0^L x sin(πx/L) sin(2πx/L) dx · cos((E_2 - E_1)t/ħ)', '= L/2 - 16L/(9π^2) cos((E_2 - E_1)t/ħ)']},
        {id:'b', prompt:'b) Nach welcher Zeit $T$ wiederholt sich die Bewegung? Gib $T$ durch $m, L, \\hbar$ an.', type:'solve', unknown:'T', points:2, ph:'(E_2 - E_1) T/ħ = 2π',
          hints:['Der Kosinus hat die Periode $2\\pi$.', '$E_2 - E_1 = 3\\pi^2\\hbar^2/(2mL^2)$.'],
          model:['(E_2 - E_1) T/ħ = 2π', 'T = 2πħ/(E_2 - E_1)', 'T = 4m L^2/(3πħ)']}
      ]},
    {id:'sg-p3', title:'Stromdichte einer Überlagerung von hin- und rücklaufender Welle',
      text:'$\\psi(x) = A\\,e^{ikx} + B\\,e^{-ikx}$ mit reellen $A, B$ und $k > 0$.',
      ctx:{coords:['x'], params:{A:'pos', B:'pos', k:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x) + B e^(-i k x)'}},
      goals:[
        {id:'a', prompt:'Berechne $j = \\frac{\\hbar}{2mi}\\left(\\psi^*\\psi\' - \\psi\\,(\\psi^*)\'\\right)$.', type:'value', target:'ħ k (A^2 - B^2)/m', points:3, ph:'j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')',
          hints:['$\\psi\' = ik(Ae^{ikx} - Be^{-ikx})$.', 'Die Mischterme mit $e^{\\pm 2ikx}$ heben sich in der Differenz weg.'],
          model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) · 2i k (A^2 - B^2)', '= ħ k (A^2 - B^2)/m'],
          note:'Hinlaufender Strom minus rücklaufender Strom – die Interferenz trägt nichts zum Strom bei. Das braucht man in Thema 5 für Reflexion und Transmission.'}
      ]},
    {id:'sg-p4', title:'Herleitung der Kontinuitätsgleichung',
      text:'$\\Psi(x,t)$ erfüllt $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi + V\\Psi$ mit reellem $V(x)$. Das Tutorial kennt das: Zeitableitungen von $\\psi$ werden über die Schrödingergleichung geprüft.',
      ctx:DYN(),
      goals:[
        {id:'a', prompt:'Zeige: $\\partial_t|\\psi|^2 = -\\partial_x j$ mit $j = \\frac{\\hbar}{2mi}(\\psi^*\\partial_x\\psi - \\psi\\,\\partial_x\\psi^*)$.', type:'show', from:'∂/∂t |ψ|^2', to:'-∂/∂x (ħ/(2m i) (ψ^* ∂ψ/∂x - ψ ∂ψ^*/∂x))', points:4, minSteps:3,
          hints:['Produktregel: $\\partial_t(\\psi^*\\psi) = \\psi^*\\partial_t\\psi + \\psi\\,\\partial_t\\psi^*$.', 'Setze $\\partial_t\\psi = \\frac{i\\hbar}{2m}\\partial_x^2\\psi - \\frac{i}{\\hbar}V\\psi$ ein und für $\\partial_t\\psi^*$ das komplex Konjugierte. Die $V$-Terme heben sich weg.', '$\\psi^*\\psi\'\' - \\psi\\psi^{*\\prime\\prime} = \\partial_x(\\psi^*\\psi\' - \\psi\\psi^{*\\prime})$.'],
          model:['∂/∂t |ψ|^2 = ψ^* ∂ψ/∂t + ψ ∂ψ^*/∂t', '= ψ^* (iħ/(2m) ∂^2ψ/∂x^2 - i/ħ V ψ) + ψ (-iħ/(2m) ∂^2ψ^*/∂x^2 + i/ħ V ψ^*)', '= iħ/(2m) (ψ^* ∂^2ψ/∂x^2 - ψ ∂^2ψ^*/∂x^2)', '= -∂/∂x (ħ/(2m i) (ψ^* ∂ψ/∂x - ψ ∂ψ^*/∂x))'],
          mistakes:[{expr:'ψ^* (iħ/(2m) ∂^2ψ/∂x^2 - i/ħ V ψ) + ψ (iħ/(2m) ∂^2ψ^*/∂x^2 - i/ħ V ψ^*)', msg:'Beim Konjugieren der Schrödingergleichung wird $i \\to -i$: $\\partial_t\\psi^* = -\\frac{i\\hbar}{2m}\\partial_x^2\\psi^* + \\frac{i}{\\hbar}V\\psi^*$.'}]}
      ]},
    {id:'sg-p5', title:'Die Normierung bleibt erhalten',
      text:'Wie in Aufgabe 4 erfüllt $\\psi$ die Schrödingergleichung; außerdem fällt $\\psi$ für $|x|\\to\\infty$ schnell ab. Benutze die Kontinuitätsgleichung.',
      ctx:DYN(),
      goals:[
        {id:'a', prompt:'Zeige: $\\frac{d}{dt}\\int_{-\\infty}^\\infty|\\psi|^2dx = 0$.', type:'show', from:'d/dt ∫_-∞^∞ |ψ|^2 dx', to:'0', points:3, minSteps:3,
          hints:['Ziehe die Zeitableitung ins Integral.', 'Ein Integral über $\\partial_x j$ ist $[j]_{-\\infty}^{\\infty}$, und $j\\to 0$ im Unendlichen.'],
          model:['d/dt ∫_-∞^∞ |ψ|^2 dx = ∫_-∞^∞ ∂/∂t |ψ|^2 dx', '= -∫_-∞^∞ ∂/∂x (ħ/(2m i) (ψ^* ∂ψ/∂x - ψ ∂ψ^*/∂x)) dx', {l:'= 0', w:'j → 0 für |x| → ∞'}]}
      ]}
  ],
  final:[
    {q:'Wann ist ein Zustand stationär?', opts:['wenn er ein Energie-Eigenzustand ist: $\\Psi = \\psi(x)e^{-iEt/\\hbar}$', 'wenn $\\langle p\\rangle = 0$ ist', 'wenn das Potenzial null ist'], a:0, ex:'Nur dann kürzt sich der Zeitfaktor in allen Erwartungswerten.'},
    {task:{id:'sg-f1', title:'Stromdichte', text:'$\\psi(x) = A\\,e^{ikx}$ mit reellem $A$ und $k > 0$.', ctx:{coords:['x'], params:{A:'pos', k:'pos', m:'pos'}, defs:{'ψ(x)':'A e^(i k x)'}},
      goals:[{id:'a', prompt:'Berechne $j$.', type:'value', target:'ħ k A^2/m', points:2, model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ k A^2/m']}]}},
    {q:'$\\Psi = \\psi(x)e^{-iEt/\\hbar}$ und $\\Phi = e^{i\\alpha}\\Psi$ mit reellem $\\alpha$. Was gilt?', opts:['Beide beschreiben denselben physikalischen Zustand.', '$\\Phi$ hat die Energie $E + \\hbar\\alpha$.', '$\\Phi$ ist nicht normiert.'], a:0, ex:'Ein globaler Phasenfaktor ändert keine Wahrscheinlichkeit und keinen Erwartungswert.'},
    {task:{id:'sg-f2', title:'Periode', text:'Im Kasten überlagert man $\\psi_1$ und $\\psi_3$, mit $E_n = n^2\\pi^2\\hbar^2/(2mL^2)$.',
      ctx:BOX2({unknowns:{T:{ref:'2πħ/(E_3 - E_1)'}}}),
      goals:[{id:'a', prompt:'Bestimme die Periode $T$ der Dichte durch $m, L, \\hbar$.', type:'solve', unknown:'T', points:2, model:['T = 2πħ/(E_3 - E_1)', 'T = m L^2/(2πħ)']}]}}
  ],
  errors:[
    {id:'sg-e1', title:'Zeitableitung des Phasenfaktors',
      text:'Für $\\Psi(x,t) = \\psi_1(x)e^{-iE_1t/\\hbar}$ im Kasten soll $i\\hbar\\,\\partial_t\\Psi$ berechnet werden:',
      ctx:BOX2({defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)', 'Ψ(x,t)':'ψ_1(x) e^(-i E_1 t/ħ)'}}),
      lines:['∂Ψ/∂t = ∂/∂t (ψ_1 e^(-iE_1 t/ħ))', '= ψ_1 (iE_1/ħ) e^(-iE_1 t/ħ)', '= iE_1/ħ Ψ', 'iħ ∂Ψ/∂t = -E_1 Ψ'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Das Vorzeichen: $\\partial_t e^{-iE_1t/\\hbar} = -\\frac{iE_1}{\\hbar}e^{-iE_1t/\\hbar}$.', 'Man darf $\\psi_1$ nicht vorziehen.', 'Der Faktor $\\hbar$ gehört in den Zähler.'], a:0, ex:'Mit dem richtigen Vorzeichen ergibt sich $i\\hbar\\partial_t\\Psi = E_1\\Psi$. Eine negative „Energie“ $-E_1$ wäre ein Warnsignal.'},
      fix:{id:'a', prompt:'Berichtige: Was ist $i\\hbar\\,\\partial_t\\Psi$?', type:'value', target:'E_1 Ψ', model:['iħ ∂Ψ/∂t = iħ ψ_1 (-iE_1/ħ) e^(-iE_1 t/ħ)', '= E_1 Ψ']}}
  ]
});
})();
lexe('schroedinger', 'Schrödingergleichung', 'Zeitabhängig: $i\\hbar\\,\\partial_t\\Psi(x,t) = \\hat H\\Psi$, mit $\\hat H = -\\frac{\\hbar^2}{2m}\\partial_x^2 + V(x)$. Stationär (nach Separation $\\Psi = \\psi(x)e^{-iEt/\\hbar}$): $-\\frac{\\hbar^2}{2m}\\psi\'\' + V\\psi = E\\psi$. Die Gleichung ist linear: Überlagerungen von Lösungen sind wieder Lösungen.', {topic:'sg'});
lexe('hamilton', 'Hamilton-Operator', '$\\hat H = \\frac{\\hat p^2}{2m} + V(\\hat x) = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2} + V(x)$ in einer Dimension; in drei Dimensionen $-\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\vec r)$. Seine Eigenwerte sind die möglichen Energien.', {topic:'sg'});
lexe('stationaer', 'Stationärer Zustand', 'Lösung der Form $\\Psi(x,t) = \\psi(x)e^{-iEt/\\hbar}$ mit $\\hat H\\psi = E\\psi$. Dichte $|\\Psi|^2$ und alle Erwartungswerte sind zeitunabhängig; eine Energiemessung ergibt sicher $E$. Überlagerungen verschiedener Energien sind nicht stationär.', {topic:'sg'});
lexe('stromdichte', 'Wahrscheinlichkeitsstromdichte', '$j(x,t) = \\frac{\\hbar}{2mi}\\left(\\Psi^*\\partial_x\\Psi - \\Psi\\,\\partial_x\\Psi^*\\right) = \\frac1m\\operatorname{Re}\\left(\\Psi^*\\hat p\\Psi\\right)$. Für $Ae^{ikx}$: $j = |A|^2\\hbar k/m$. In 3D: $\\vec j = \\frac{\\hbar}{2mi}(\\Psi^*\\nabla\\Psi - \\Psi\\nabla\\Psi^*)$.', {topic:'sg'});
lexe('kontinuitaet', 'Kontinuitätsgleichung', '$\\partial_t\\rho + \\partial_x j = 0$ mit $\\rho = |\\Psi|^2$. Folgt aus der Schrödingergleichung bei reellem Potenzial. Integriert: $\\frac{d}{dt}\\int_a^b\\rho\\,dx = j(a) - j(b)$ – Wahrscheinlichkeit geht nicht verloren, sie fließt.', {topic:'sg'});
lexe('separation', 'Separationsansatz', 'Ansatz $\\Psi(x,t) = \\psi(x)\\,f(t)$ in der Schrödingergleichung mit zeitunabhängigem $V$: Beide Seiten nach Division durch $\\psi f$ hängen von verschiedenen Variablen ab, sind also gleich einer Konstanten $E$. Es folgt $f(t) = e^{-iEt/\\hbar}$ und $\\hat H\\psi = E\\psi$.', {topic:'sg'});
