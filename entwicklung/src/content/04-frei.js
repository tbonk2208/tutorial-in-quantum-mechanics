/* ===== Thema 4: Freies Teilchen und Wellenpakete ===== */
(function(){
const GAUSS = '(2πσ^2)^(-1/4) e^(-x^2/(4σ^2)) e^(i k_0 x)';
topic({
  id:'frei', math:['m-fourier', 'm-analysis'], title:'Freies Teilchen und Wellenpakete', short:'Freies Teilchen',
  src:'Griffiths & Schroeter Kap. 2.4 · Nolting 5/1 Kap. 2 · Schwabl Kap. 2',
  goals:[
    'Ich kann für ebene Wellen die Dispersion $\\omega = \\hbar k^2/2m$ angeben und Phasen- und Gruppengeschwindigkeit unterscheiden.',
    'Ich kann die Impulsraum-Wellenfunktion $\\varphi(k)$ eines Wellenpakets berechnen und damit $\\langle p\\rangle$ und $\\Delta p$ bestimmen.',
    'Ich kann zeigen, dass das Gauß-Paket $\\Delta x\\,\\Delta p = \\hbar/2$ erfüllt, und das Zerfließen $\\Delta x(t)$ deuten.'
  ],
  needs:'Fourier-Transformation (Mathe M6) und Gauß-Integrale (Mathe M2) · Schrödingergleichung (Thema 2) · Erwartungswerte (Thema 1)',
  check:[
    {q:'Wie lautet in diesem Tutorial die Fourier-Transformierte?', opts:['$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$', '$\\varphi(k) = \\int\\psi(x)e^{ikx}dx$', '$\\varphi(k) = \\frac{1}{2\\pi}\\int\\psi(x)\\cos(kx)\\,dx$'], a:0, ex:'Symmetrische Konvention mit $1/\\sqrt{2\\pi}$ in beiden Richtungen.', lex:'fourier', prev:'m-fourier'},
    {q:'$\\int_{-\\infty}^\\infty e^{-x^2/(2\\sigma^2)}dx$ ist …', opts:['$\\sqrt{2\\pi}\\,\\sigma$', '$\\sqrt{\\pi}\\,\\sigma$', '$2\\sigma$'], a:0, ex:'$\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/(2\\sigma^2)$.', lex:'integrale'},
    {q:'Die Welle $\\cos(kx - \\omega t)$ läuft mit welcher Geschwindigkeit?', opts:['$\\omega/k$ in $+x$-Richtung', '$k/\\omega$', '$\\omega k$ in $-x$-Richtung'], a:0, ex:'Konstante Phase $kx - \\omega t$ heißt $x = (\\omega/k)t + $ const.', lex:'ebene-welle'},
    {q:'Was gibt $\\hat p\\,e^{ikx}$ mit $\\hat p = -i\\hbar\\,d/dx$?', opts:['$\\hbar k\\,e^{ikx}$', '$-\\hbar k\\,e^{ikx}$', '$i\\hbar k\\,e^{ikx}$'], a:0, ex:'$-i\\hbar\\cdot ik = \\hbar k$: $e^{ikx}$ ist Eigenfunktion zum Impuls $p = \\hbar k$.', lex:'erwartungswert', prev:'wf'}
  ],
  example:{
    title:'Impulsraum-Wellenfunktion des Gauß-Pakets',
    text:'Das Gauß-Paket $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}$ hat $\\Delta x = \\sigma$. Berechne $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$ mit der Formel $\\int e^{-\\alpha x^2 + bx}dx = \\sqrt{\\pi/\\alpha}\\,e^{b^2/(4\\alpha)}$.',
    ctx:{coords:['k'], params:{σ:'pos'}, defs:{'ψ(x)':'(2πσ^2)^(-1/4) e^(-x^2/(4σ^2))', 'φ(k)':'1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-i k x) dx'}},
    lines:[
      {l:'φ(k) = 1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-ikx) dx', why:{q:'Was ist $\\varphi(k)$?', opts:['die Wellenfunktion im Impulsraum ($p = \\hbar k$)', 'die Ableitung von $\\psi$', 'die Wahrscheinlichkeit für $x = k$'], a:0, ex:'$|\\varphi(k)|^2dk$ ist die Wahrscheinlichkeit für Wellenzahlen in $[k, k + dk]$.'}},
      {l:'= (2πσ^2)^(-1/4)/sqrt(2π) ∫_-∞^∞ e^(-x^2/(4σ^2) - ikx) dx', why:{q:'Was wurde gemacht?', opts:['$\\psi$ eingesetzt, Exponenten zusammengefasst', 'partiell integriert', 'nach $k$ abgeleitet'], a:0, ex:'$e^ae^b = e^{a+b}$; der Vorfaktor von $\\psi$ steht vor dem Integral.'}},
      {l:'= (2πσ^2)^(-1/4)/sqrt(2π) · sqrt(4πσ^2) e^(-σ^2 k^2)', why:{q:'Welche Werte haben $\\alpha$ und $b$?', opts:['$\\alpha = 1/(4\\sigma^2)$, $b = -ik$', '$\\alpha = \\sigma^2$, $b = k$', '$\\alpha = 4\\sigma^2$, $b = ik$'], a:0, ex:'$b^2/(4\\alpha) = (-ik)^2\\sigma^2 = -k^2\\sigma^2$ und $\\sqrt{\\pi/\\alpha} = \\sqrt{4\\pi\\sigma^2}$.'}},
      {l:'= (2σ^2/π)^(1/4) e^(-σ^2 k^2)', why:{q:'Was sieht man am Ergebnis?', opts:['$\\varphi$ ist wieder eine Gauß-Funktion, umso schmaler, je breiter $\\psi$ ist.', '$\\varphi$ hängt nicht von $\\sigma$ ab.', '$\\varphi$ ist nicht normierbar.'], a:0, ex:'Breite in $x$: $\\sigma$; in $k$: $\\propto 1/\\sigma$. Das ist die Unschärfe in Formeln.'}}
    ],
    faded:{id:'frei-fade', title:'Jetzt du: Impulsunschärfe aus φ(k)',
      text:'Mit $\\varphi(k) = (2\\sigma^2/\\pi)^{1/4}e^{-\\sigma^2k^2}$ ist $\\langle k\\rangle = 0$. Berechne $\\Delta p = \\hbar\\sqrt{\\langle k^2\\rangle}$. Nützlich: $\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$.',
      ctx:{coords:['k'], space:['k'], params:{σ:'pos'}, defs:{'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)'}, state:'φ', normalized:true},
      given:['⟨k^2⟩ = ∫_-∞^∞ k^2 |φ(k)|^2 dk', '= sqrt(2σ^2/π) ∫_-∞^∞ k^2 e^(-2σ^2 k^2) dk'],
      goals:[{id:'a', prompt:'Bestimme $\\langle k^2\\rangle$ und dann $\\Delta p$.', type:'value', target:'ħ/(2σ)', points:3, hints:['$\\alpha = 2\\sigma^2$.', '$\\langle k^2\\rangle = 1/(4\\sigma^2)$.'],
        model:['⟨k^2⟩ = ∫_-∞^∞ k^2 |φ(k)|^2 dk', '= sqrt(2σ^2/π) ∫_-∞^∞ k^2 e^(-2σ^2 k^2) dk', {l:'= sqrt(2σ^2/π) · 1/(4σ^2) sqrt(π/(2σ^2))', gap:'= sqrt(2σ^2/π) · ▢'}, '= 1/(4σ^2)', 'ħ sqrt(⟨k^2⟩) = ħ/(2σ)'],
        note:'Mit $\\Delta x = \\sigma$ folgt $\\Delta x\\,\\Delta p = \\hbar/2$ – das Minimum der Unschärferelation.'}]}
  },
  puzzle:{
    title:'Wie schnell laufen die Wellenberge?',
    text:'Ein freies Teilchen mit Impuls $p = \\hbar k$ wird durch $\\Psi = e^{i(kx - \\omega t)}$ beschrieben, mit $\\hbar\\omega = \\frac{\\hbar^2k^2}{2m}$. Klassisch hat es die Geschwindigkeit $v = p/m$.\n\nMit welcher Geschwindigkeit wandern die Wellenberge von $\\operatorname{Re}\\Psi$?',
    q:{q:'Deine Vermutung:', opts:['mit $v = p/m$', 'mit $v/2$', 'mit Lichtgeschwindigkeit', 'gar nicht, es ist eine stehende Welle'], a:1, ex:'$v_\\mathrm{ph} = \\omega/k = \\hbar k/(2m) = v/2$.'},
    reveal:'Die **Phasengeschwindigkeit** $v_\\mathrm{ph} = \\omega/k = \\frac{\\hbar k}{2m}$ ist nur halb so groß wie die klassische Geschwindigkeit. Das ist kein Widerspruch: Eine einzelne ebene Welle ist überall gleich wahrscheinlich ($|\\Psi|^2 = 1$) – da bewegt sich nichts Messbares.\n\nEin Teilchen beschreibt man durch ein **Wellenpaket**, eine Überlagerung vieler $k$. Dessen Einhüllende läuft mit der **Gruppengeschwindigkeit** $v_\\mathrm{g} = \\frac{d\\omega}{dk} = \\frac{\\hbar k}{m} = v$. Weil $\\omega$ nicht linear in $k$ ist, laufen die Anteile verschieden schnell: Das Paket zerfließt.'
  },
  clarify:{
    core:'Für $V = 0$ lösen ebene Wellen $e^{i(kx - \\omega t)}$ mit $\\omega = \\hbar k^2/(2m)$ die Schrödingergleichung. Sie sind Impulseigenfunktionen ($p = \\hbar k$), aber **nicht normierbar** – also keine physikalischen Zustände. Physikalisch sind Wellenpakete\n\n$$\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\int\\varphi(k)\\,e^{i(kx - \\hbar k^2t/2m)}\\,dk,\\qquad \\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\Psi(x,0)e^{-ikx}dx.$$\n\n$|\\varphi(k)|^2$ ist die Verteilung der Wellenzahlen; sie ändert sich beim freien Teilchen nicht. Das Maximum des Pakets bewegt sich mit $v_\\mathrm{g} = d\\omega/dk = \\hbar k_0/m$. Das Gauß-Paket mit $\\Delta x(0) = \\sigma$ hat $\\Delta p = \\hbar/(2\\sigma)$ (minimale Unschärfe) und zerfließt wie $\\Delta x(t) = \\sigma\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma^2}\\right)^2}$.',
    keys:[
      '$v_\\mathrm{g} = 2v_\\mathrm{ph}$ für ein freies nichtrelativistisches Teilchen.',
      'Ein Faktor $e^{ik_0x}$ verschiebt $\\varphi(k)$ um $k_0$: Er gibt dem Paket den mittleren Impuls $\\hbar k_0$, ändert aber $|\\psi(x)|^2$ nicht.',
      '$\\Delta p$ bleibt beim freien Teilchen konstant; nur $\\Delta x$ wächst.',
      'Je schmaler das Paket anfangs ist, desto schneller zerfließt es: für große $t$ ist $\\Delta x \\approx \\Delta p\\,t/m = \\frac{\\hbar t}{2m\\sigma}$.',
      'Parseval: $\\int|\\varphi|^2dk = \\int|\\psi|^2dx$. Ist $\\psi$ normiert, dann auch $\\varphi$.'
    ],
    errors:[
      'Die Phasengeschwindigkeit $\\omega/k$ für die Geschwindigkeit des Teilchens halten.',
      'Beim Fourier-Integral das Vorzeichen in $(-ik)^2 = -k^2$ falsch nehmen.',
      'Eine ebene Welle wie ein normiertes $\\psi$ behandeln und $\\int|e^{ikx}|^2dx = 1$ ansetzen.',
      'Glauben, das Zerfließen verletze die Normierung: Die Fläche unter $|\\psi|^2$ bleibt $1$.'
    ],
    checks:[
      {q:'Was ändert der Faktor $e^{ik_0x}$ an $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/4\\sigma^2}$?', opts:['$\\langle p\\rangle$ wird $\\hbar k_0$, $|\\psi|^2$ bleibt gleich.', '$|\\psi|^2$ wird verschoben.', 'Nichts Messbares.'], a:0, ex:'$|e^{ik_0x}| = 1$, aber $\\varphi(k)$ wird um $k_0$ verschoben.'},
      {q:'Zwei Gauß-Pakete starten mit $\\sigma_A = 1\\,\\mathrm{nm}$ und $\\sigma_B = 2\\,\\mathrm{nm}$ (gleiche Masse). Welches ist nach langer Zeit breiter?', opts:['A', 'B', 'beide gleich'], a:0, ex:'Für große $t$ ist $\\Delta x \\approx \\hbar t/(2m\\sigma)$: das anfangs schmalere Paket hat das größere $\\Delta p$.'}
    ]
  },
  lab:{type:'packet', title:'Freies Gauß-Paket',
    text:'Dicke Kurve: $|\\psi(x,t)|^2$, dünne Kurve: $\\operatorname{Re}\\psi$. Einheiten mit $\\hbar = m = 1$.',
    questions:[
      {q:'Stelle $\\sigma_0 = 0{,}3$ ein und ziehe $t$ auf $2{,}5$. Dann dasselbe mit $\\sigma_0 = 1{,}0$. Welches Paket ist am Ende breiter?', opts:['das mit $\\sigma_0 = 0{,}3$', 'das mit $\\sigma_0 = 1{,}0$', 'beide gleich'], a:0, ex:'Schmaler Anfang heißt großes $\\Delta p = \\hbar/(2\\sigma_0)$ und damit schnelles Zerfließen.'},
      {q:'Was bewegt sich mit der Geschwindigkeit $\\hbar k_0/m$?', opts:['das Maximum von $|\\psi|^2$', 'die Wellenberge von $\\operatorname{Re}\\psi$', 'nichts'], a:0, ex:'Die Einhüllende läuft mit $v_\\mathrm{g} = \\hbar k_0/m$; die Wellenberge laufen mit $v_\\mathrm{ph} = v_\\mathrm{g}/2$ durch das Paket.'}
    ],
    noPic:{q:'Ohne Bild: Wie ändert sich $\\Delta p$ eines freien Wellenpakets mit der Zeit?', opts:['gar nicht', 'es wächst wie $\\Delta x$', 'es nimmt ab'], a:0, ex:'$\\hat p$ vertauscht mit $\\hat H = \\hat p^2/2m$; die Impulsverteilung $|\\varphi(k)|^2$ ist zeitunabhängig.'}},
  compare:{
    text:'Gesucht ist $\\langle p\\rangle$ für $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}e^{ik_0x}$. Die Impulsraum-Wellenfunktion ist $\\varphi(k) = (2\\sigma^2/\\pi)^{1/4}e^{-\\sigma^2(k - k_0)^2}$. Zwei richtige Wege:',
    ctx:{coords:['x'], params:{σ:'pos', 'k_0':'real'}, defs:{'ψ(x)':GAUSS, 'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 (k - k_0)^2)'}, state:'ψ', normalized:true},
    A:{name:'Im Ortsraum', model:['⟨p⟩ = ∫_-∞^∞ ψ^* (-iħ) ψ\' dx', {l:'= ∫_-∞^∞ |ψ|^2 (ħ k_0 + iħ x/(2σ^2)) dx', w:'ψ′ = (ik₀ − x/(2σ²)) ψ'}, {l:'= ħ k_0', w:'ungerader Anteil verschwindet'}]},
    B:{name:'Im Impulsraum', model:['⟨p⟩ = ∫_-∞^∞ ħ k |φ(k)|^2 dk', {l:'= ħ k_0', w:'symmetrisch um k₀'}]},
    questions:[
      {q:'Warum ist Weg B hier fast ohne Rechnung möglich?', opts:['$|\\varphi(k)|^2$ ist symmetrisch um $k_0$ und normiert.', 'Weil $\\hbar k$ konstant ist.', 'Weil $\\varphi$ reell ist.'], a:0, ex:'Ein Mittelwert einer symmetrischen Verteilung liegt im Symmetriepunkt.'},
      {q:'Wofür ist der Ortsraum besser geeignet?', opts:['für $\\langle x\\rangle$, $\\langle x^2\\rangle$ und $\\langle V(x)\\rangle$', 'für $\\langle p^2\\rangle$', 'für nichts'], a:0, ex:'Jede Größe ist dort einfach, wo sie ein Multiplikationsoperator ist: $x$ im Ortsraum, $p = \\hbar k$ im Impulsraum.'}
    ]
  },
  practice:[
    {id:'frei-p1', title:'Phasen- und Gruppengeschwindigkeit',
      text:'Für ein freies Teilchen gilt $\\omega(k) = \\hbar k^2/(2m)$. Schreibe $v_p$ für die Phasen- und $v_g$ für die Gruppengeschwindigkeit.',
      ctx:{coords:['x'], params:{k:'pos', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $v_p = \\omega/k$.', type:'value', target:'ħ k/(2m)', points:1, ph:'v_p = ω/k', model:['v_p = ω/k', '= ħ k/(2m)']},
        {id:'b', prompt:'b) Berechne $v_g = d\\omega/dk$.', type:'value', target:'ħ k/m', points:2, ph:'v_g = dω/dk', hints:['$\\frac{d}{dk}k^2 = 2k$.'],
          model:['v_g = dω/dk', '= d/dk (ħ k^2/(2m))', '= ħ k/m'], mistakes:[{expr:'ħ k/(2m)', msg:'Das ist die Phasengeschwindigkeit. Für $v_g$ wird abgeleitet, nicht geteilt.'}]}
      ]},
    {id:'frei-p2', title:'Ebene Welle als Eigenfunktion',
      text:'$\\psi(x) = e^{ikx}$ mit reellem $k$, freies Teilchen ($V = 0$).',
      ctx:{coords:['x'], params:{k:'real', m:'pos'}, defs:{'ψ(x)':'e^(i k x)'}},
      goals:[
        {id:'a', prompt:'a) Zeige: $\\hat p\\psi = \\hbar k\\,\\psi$.', type:'show', from:'p̂ ψ', to:'ħ k ψ', points:2, hints:['Schreib $\\hat p = -i\\hbar\\,d/dx$ aus.'],
          model:['p̂ ψ = -iħ d/dx e^(ikx)', '= -iħ · ik e^(ikx)', '= ħ k ψ']},
        {id:'b', prompt:'b) Zeige: $\\hat H\\psi = \\frac{\\hbar^2k^2}{2m}\\psi$.', type:'show', from:'Ĥ ψ', to:'ħ^2 k^2/(2m) ψ', points:2, hints:['$\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2}$.'],
          model:['Ĥ ψ = -ħ^2/(2m) d^2/dx^2 e^(ikx)', '= -ħ^2/(2m) (ik)^2 e^(ikx)', '= ħ^2 k^2/(2m) ψ']}
      ]},
    {id:'frei-p3', title:'Normierung und Ortsunschärfe des Gauß-Pakets',
      text:'$\\psi(x) = A\\,e^{-x^2/(4\\sigma^2)}e^{ik_0x}$ mit $\\sigma > 0$ und reellem $k_0$.',
      ctx:{coords:['x'], params:{σ:'pos', 'k_0':'real', m:'pos'}, defs:{'ψ(x)':'A e^(-x^2/(4σ^2)) e^(i k_0 x)'}, unknowns:{A:{ref:'(2πσ^2)^(-1/4)', alt:['-(2πσ^2)^(-1/4)']}}, state:'ψ'},
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, hints:['$|e^{ik_0x}|^2 = 1$; es bleibt $e^{-x^2/(2\\sigma^2)}$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2 ∫_-∞^∞ e^(-x^2/(2σ^2)) dx = 1', '|A|^2 sqrt(2πσ^2) = 1', 'A = (2πσ^2)^(-1/4)']},
        {id:'b', prompt:'b) Berechne $\\langle x^2\\rangle$ (es ist $\\langle x\\rangle = 0$, also $\\Delta x = \\sqrt{\\langle x^2\\rangle}$).', type:'value', target:'σ^2', points:2, hints:['$\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/(2\\sigma^2)$.'],
          model:['⟨x^2⟩ = (2πσ^2)^(-1/2) ∫_-∞^∞ x^2 e^(-x^2/(2σ^2)) dx', '= (2πσ^2)^(-1/2) · σ^2 sqrt(2πσ^2)', '= σ^2']}
      ]},
    {id:'frei-p4', title:'Wann ist das Paket doppelt so breit?',
      text:'Ein freies Gauß-Paket hat $\\Delta x(t) = \\sigma\\sqrt{1 + \\left(\\frac{\\hbar t}{2m\\sigma^2}\\right)^2}$. Nenne die gesuchte Zeit $\\tau$.',
      ctx:{coords:['x'], params:{σ:'pos', m:'pos'}, unknowns:{τ:{ref:'2 sqrt(3) m σ^2/ħ'}}},
      goals:[
        {id:'a', prompt:'Bestimme $\\tau$ mit $\\Delta x(\\tau) = 2\\sigma$.', type:'solve', unknown:'τ', points:3, ph:'σ sqrt(1 + (ħτ/(2mσ^2))^2) = 2σ',
          hints:['Durch $\\sigma$ teilen und quadrieren.', '$(\\hbar\\tau/(2m\\sigma^2))^2 = 3$.'],
          model:['σ sqrt(1 + (ħτ/(2mσ^2))^2) = 2σ', '1 + (ħτ/(2mσ^2))^2 = 4', 'ħτ/(2mσ^2) = sqrt(3)', 'τ = 2 sqrt(3) m σ^2/ħ'],
          note:'Beispiel: Elektron mit $\\sigma = 1\\,\\text{Å}$: $\\tau \\approx 3\\cdot10^{-16}\\,\\mathrm{s}$. Ein Staubkorn ($10^{-15}\\,\\mathrm{kg}$, $\\sigma = 1\\,\\mu\\mathrm{m}$) bräuchte etwa $3\\cdot10^7\\,\\mathrm s$ – rund ein Jahr.'}
      ]},
    {id:'frei-p5', title:'Impulsverteilung einer abfallenden Exponentialfunktion',
      text:'$\\psi(x) = \\frac{1}{\\sqrt a}e^{-|x|/a}$ (normiert, Thema 1). Teile das Fourier-Integral in $x < 0$ und $x > 0$ auf.',
      ctx:{coords:['k'], params:{a:'pos'}, defs:{'φ(k)':'sqrt(2a/π)/(1 + a^2 k^2)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'sqrt(2a/π)/(1 + a^2 k^2)', points:3, ph:'φ(k) = 1/sqrt(2π a) ∫_-∞^∞ e^(-|x|/a) e^(-ikx) dx',
          hints:['Für $x < 0$ substituiere $x \\to -x$: Es entsteht $\\int_0^\\infty e^{-x/a + ikx}dx$.', '$\\int_0^\\infty e^{-cx}dx = 1/c$ gilt auch für komplexes $c$ mit $\\operatorname{Re}c > 0$.'],
          model:['φ(k) = 1/sqrt(2π a) ∫_-∞^∞ e^(-|x|/a) e^(-ikx) dx', '= 1/sqrt(2π a) (∫_0^∞ e^(-x/a - ikx) dx + ∫_0^∞ e^(-x/a + ikx) dx)', '= 1/sqrt(2π a) (1/(1/a + ik) + 1/(1/a - ik))', '= sqrt(2a/π)/(1 + a^2 k^2)']},
        {id:'b', prompt:'b) Prüfe die Normierung: $\\int|\\varphi(k)|^2dk$. Nützlich: $\\int_{-\\infty}^\\infty\\frac{dk}{(1 + a^2k^2)^2} = \\frac{\\pi}{2a}$.', type:'value', target:'1', points:2,
          model:['∫_-∞^∞ |φ(k)|^2 dk = 2a/π ∫_-∞^∞ 1/(1 + a^2 k^2)^2 dk', '= 2a/π · π/(2a)', '= 1'], note:'Parseval bestätigt: $\\psi$ und $\\varphi$ sind beide normiert.'}
      ]}
  ],
  final:[
    {q:'Wie hängen Gruppen- und Phasengeschwindigkeit beim freien Teilchen zusammen?', opts:['$v_g = 2v_\\mathrm{ph}$', '$v_g = v_\\mathrm{ph}$', '$v_g = v_\\mathrm{ph}/2$'], a:0, ex:'$v_g = \\hbar k/m$, $v_\\mathrm{ph} = \\hbar k/2m$.'},
    {task:{id:'frei-f1', title:'Impulseigenwert', text:'$\\psi(x) = e^{-ikx}$ mit $k > 0$.', ctx:{coords:['x'], params:{k:'pos', m:'pos'}, defs:{'ψ(x)':'e^(-i k x)'}},
      goals:[{id:'a', prompt:'Zeige $\\hat p\\psi = -\\hbar k\\,\\psi$.', type:'show', from:'p̂ ψ', to:'-ħ k ψ', points:2, model:['p̂ ψ = -iħ d/dx e^(-ikx)', '= -iħ (-ik) e^(-ikx)', '= -ħ k ψ']}]}},
    {q:'Warum ist $\\psi(x) = e^{ikx}$ allein kein physikalischer Zustand?', opts:['Es ist nicht normierbar: $\\int|e^{ikx}|^2dx = \\infty$.', 'Es löst die Schrödingergleichung nicht.', 'Es ist komplex.'], a:0, ex:'$|e^{ikx}|^2 = 1$ überall. Erst Überlagerungen (Wellenpakete) sind normierbar.'},
    {task:{id:'frei-f2', title:'Minimale Unschärfe', text:'Für das Gauß-Paket gilt $\\Delta x = \\sigma$ und $\\Delta p = \\hbar/(2\\sigma)$.', ctx:{coords:['x'], params:{σ:'pos', m:'pos'}},
      goals:[{id:'a', prompt:'Berechne $\\Delta x\\,\\Delta p$.', type:'value', target:'ħ/2', points:2, model:['σ · ħ/(2σ) = ħ/2']}]}}
  ],
  errors:[
    {id:'frei-e1', title:'Gruppengeschwindigkeit',
      text:'Für $\\omega(k) = \\hbar k^2/(2m)$ wird die Gruppengeschwindigkeit berechnet:',
      ctx:{coords:['x'], params:{k:'pos', m:'pos'}, defs:{'ω':'ħ k^2/(2m)'}},
      lines:['v_g = dω/dk', '= d/dk (ħ k^2/(2m))', '= ħ k/(2m)', '= ω/k'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$\\frac{d}{dk}k^2 = 2k$; der Faktor 2 fehlt.', 'Man muss nach $x$ ableiten.', 'Nichts – $v_g = \\omega/k$ stimmt.'], a:0, ex:'Richtig ist $v_g = \\hbar k/m = 2v_\\mathrm{ph}$. Gleichheit $v_g = \\omega/k$ gilt nur für $\\omega \\propto k$ (etwa Licht im Vakuum).'},
      fix:{id:'a', prompt:'Berichtige und gib $v_g$ an.', type:'value', target:'ħ k/m', model:['v_g = dω/dk', '= ħ k/m']}}
  ]
});
})();
lexe('ebene-welle', 'Ebene Welle', '$\\Psi(x,t) = Ae^{i(kx - \\omega t)}$ mit $\\omega = \\hbar k^2/2m$ (freies Teilchen). Eigenfunktion von $\\hat p$ zum Eigenwert $\\hbar k$ und von $\\hat H$ zu $\\hbar^2k^2/2m$. Nicht normierbar; Stromdichte $j = |A|^2\\hbar k/m$.', {topic:'frei'});
lexe('gruppengeschwindigkeit', 'Phasen- und Gruppengeschwindigkeit', '$v_\\mathrm{ph} = \\omega/k$ (Wellenberge), $v_g = d\\omega/dk$ (Einhüllende eines Pakets, Energietransport). Freies Teilchen: $v_g = \\hbar k/m = p/m$, $v_\\mathrm{ph} = v_g/2$.', {topic:'frei'});
lexe('wellenpaket', 'Wellenpaket', 'Normierbare Überlagerung ebener Wellen: $\\Psi(x,t) = \\frac{1}{\\sqrt{2\\pi}}\\int\\varphi(k)e^{i(kx - \\omega(k)t)}dk$. $\\varphi(k)$ folgt aus $\\Psi(x,0)$ durch Fourier-Transformation. Je schärfer $\\varphi$, desto breiter $\\Psi$.', {topic:'frei'});
lexe('impulsraum', 'Impulsraum-Wellenfunktion', '$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$, oder mit $p = \\hbar k$: $\\tilde\\psi(p) = \\frac{1}{\\sqrt{2\\pi\\hbar}}\\int\\psi(x)e^{-ipx/\\hbar}dx$. $|\\tilde\\psi(p)|^2dp$ ist die Wahrscheinlichkeit für Impulse in $[p, p+dp]$; $\\langle p\\rangle = \\int p|\\tilde\\psi|^2dp$.', {topic:'frei'});
lexe('gauss-paket', 'Gauß-Paket und Zerfließen', '$\\psi(x,0) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/4\\sigma^2}e^{ik_0x}$: $\\Delta x = \\sigma$, $\\Delta p = \\hbar/2\\sigma$, also $\\Delta x\\Delta p = \\hbar/2$ (minimal). Frei: $\\Delta x(t) = \\sigma\\sqrt{1 + (\\hbar t/2m\\sigma^2)^2}$, das Maximum läuft mit $\\hbar k_0/m$.', {topic:'frei'});
