/* ===== Thema 7: Harmonischer Oszillator ===== */
const OSZ_MAT = (extra) => Object.assign({rep:'mat', mat:{preset:'osc'}, coords:['t'], params:{m:'pos', ω:'pos', n:{int:[0, 5]}}, sumFrom:0}, extra || {});
const OSZ_POS = (extra) => Object.assign({coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_0(x)':'(m ω/(π ħ))^(1/4) e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'}, normalized:true, state:'ψ_0'}, extra || {});
const OSZ_GROUND = () => ({coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_0(x)':'A e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'},
  unknowns:{A:{ref:'(m ω/(π ħ))^(1/4)', alt:['-(m ω/(π ħ))^(1/4)']}, β:{ref:'-m ω/ħ', kind:'real'}}});
topic({
  id:'osz', math:['m-spezial', 'm-analysis'], title:'Harmonischer Oszillator', short:'Oszillator',
  src:'Griffiths & Schroeter Kap. 2 · Nolting 5/1 Kap. 4 · Schwabl Kap. 3',
  goals:[
    'Ich kann mit den Leiteroperatoren $\\hat a$, $\\hat a^\\dagger$ rechnen und daraus das Spektrum $E_n = \\hbar\\omega(n + \\tfrac12)$ begründen.',
    'Ich kann den Grundzustand aus $\\hat a\\psi_0 = 0$ bestimmen und Erwartungswerte wie $\\langle x^2\\rangle$, $\\langle T\\rangle$, $\\langle V\\rangle$ berechnen.',
    'Ich kann Matrixelemente $\\langle m|\\hat x|n\\rangle$ ausrechnen und die Zeitentwicklung von $\\langle x\\rangle$ angeben.'
  ],
  needs:'Kommutatoren, besonders $[\\hat x,\\hat p] = i\\hbar$ · Gauß-Integrale · Dirac-Notation',
  check:[
    {q:'Welche potentielle Energie hat ein klassischer Oszillator der Masse $m$ und Kreisfrequenz $\\omega$?', opts:['$\\tfrac12 m\\omega^2x^2$', '$\\tfrac12 m\\omega x^2$', '$m\\omega^2x$'], a:0, ex:'Federkonstante $k = m\\omega^2$, also $V = \\tfrac12kx^2$.', lex:'oszillator-spektrum'},
    {q:'$\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = $', opts:['$\\sqrt{\\pi/\\alpha}$', '$\\pi/\\alpha$', '$1/(2\\alpha)$'], a:0, ex:'Das Gauß-Integral. Mit $x^2$ im Integranden kommt der Faktor $\\frac{1}{2\\alpha}$ dazu.', lex:'integrale', prev:'wf'},
    {q:'$[\\hat x, \\hat p] = $', opts:['$i\\hbar$', '$0$', '$-i\\hbar\\,\\hat x\\hat p$'], a:0, ex:'Der kanonische Kommutator. Alles Weitere zum Oszillator folgt daraus.', lex:'kommutator', prev:'form'},
    {q:'Ein Operator $\\hat N$ hat $\\hat N|n\\rangle = n|n\\rangle$. Was ist $\\langle n|\\hat N^2|n\\rangle$ für normiertes $|n\\rangle$?', opts:['$n^2$', '$n$', '$2n$'], a:0, ex:'$\\hat N^2|n\\rangle = n^2|n\\rangle$, also $\\langle n|\\hat N^2|n\\rangle = n^2$.', lex:'dirac-notation', prev:'form'}
  ],
  example:{
    title:'Grundzustand aus $\\hat a\\psi_0 = 0$',
    text:'Der Vernichter in Ortsdarstellung ist $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$. Für den Grundzustand gilt $\\hat a\\psi_0 = 0$. Bestimme $\\psi_0$ und normiere es. Im Tutorial schreibst du $\\hat a$ als `â` und $\\hat a^\\dagger$ als `â†`.',
    ctx:OSZ_GROUND(),
    lines:[
      {l:'â ψ_0 = sqrt(mω/(2ħ)) (x ψ_0 + ħ/(mω) dψ_0/dx)', why:{q:'Was steht hier?', opts:['$\\hat a$ in Ortsdarstellung, angewendet auf $\\psi_0$', 'die Schrödingergleichung', 'die Normierung'], a:0, ex:'$\\hat x$ multipliziert mit $x$, $\\hat p$ wird zu $-i\\hbar\\,d/dx$.'}},
      {l:'x ψ_0 + ħ/(mω) dψ_0/dx = 0', why:{q:'Warum gilt das?', opts:['Der Grundzustand kann nicht weiter abgesenkt werden: $\\hat a\\psi_0 = 0$.', 'Weil $\\psi_0(0) = 0$.', 'Weil $x = 0$ im Minimum.'], a:0, ex:'Sonst wäre $\\hat a\\psi_0$ ein Zustand mit der noch tieferen Energie $E_0 - \\hbar\\omega$, und $\\psi_0$ wäre nicht der Grundzustand. Endete die Leiter nie, käme man sogar zu negativen Energien – im Widerspruch zu $\\langle H\\rangle \\ge 0$.'}},
      {l:'dψ_0/dx = -mω/ħ x ψ_0', why:{q:'Was für eine Gleichung ist das?', opts:['eine lineare DGL erster Ordnung, lösbar durch Trennung der Variablen', 'eine Eigenwertgleichung für $\\hat H$', 'eine algebraische Gleichung'], a:0, ex:'$\\frac{d\\psi_0}{\\psi_0} = -\\frac{m\\omega}{\\hbar}x\\,dx$, also $\\ln\\psi_0 = -\\frac{m\\omega}{2\\hbar}x^2 + \\text{const}$.'}},
      {l:'ψ_0(x) = A e^(-mω x^2/(2ħ))', why:{q:'Wie viele Lösungen hat die Gleichung?', opts:['bis auf den Faktor $A$ genau eine – der Grundzustand ist nicht entartet', 'unendlich viele mit verschiedenen Formen', 'keine normierbare'], a:0, ex:'Eine DGL erster Ordnung hat eine Integrationskonstante; die legt die Normierung fest.'}},
      {l:'|A|^2 sqrt(πħ/(mω)) = 1', w:'Gauß-Integral mit α = mω/ħ', why:{q:'Welches Integral wurde benutzt?', opts:['$\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$ mit $\\alpha = m\\omega/\\hbar$', '$\\int e^{-\\alpha x}dx = 1/\\alpha$', '$\\int x^2e^{-\\alpha x^2}dx$'], a:0, ex:'$|\\psi_0|^2 = |A|^2e^{-m\\omega x^2/\\hbar}$: Der Exponent verdoppelt sich.'}},
      {l:'A = (mω/(πħ))^(1/4)', why:{q:'Welche Einheit hat $A$?', opts:['$1/\\sqrt{\\text{Länge}}$', 'keine', '$1/\\text{Länge}$'], a:0, ex:'$m\\omega/\\hbar$ hat die Einheit $1/\\text{Länge}^2$; die vierte Wurzel davon ist $1/\\sqrt{\\text{Länge}}$, wie es für eine Wellenfunktion in 1D sein muss.'}}
    ],
    faded:{id:'osz-fade', title:'Jetzt du: erster angeregter Zustand $\\psi_1 \\propto \\hat a^\\dagger\\psi_0$', text:'Mit $\\hat a^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$. Zeige $\\hat a^\\dagger\\psi_0 = \\sqrt{\\frac{2m\\omega}{\\hbar}}\\,x\\,\\psi_0$.',
      ctx:OSZ_GROUND(),
      given:['ψ_1 = â† ψ_0', '= sqrt(mω/(2ħ)) (x ψ_0 - ħ/(mω) dψ_0/dx)'],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'show', from:'â† ψ_0', to:'sqrt(2mω/ħ) x ψ_0', hints:['Setze $\\psi_0\' = -\\frac{m\\omega}{\\hbar}x\\psi_0$ ein.', '$x\\psi_0 + x\\psi_0 = 2x\\psi_0$'],
        model:['ψ_1 = â† ψ_0', '= sqrt(mω/(2ħ)) (x ψ_0 - ħ/(mω) dψ_0/dx)', {l:'= sqrt(mω/(2ħ)) · 2x ψ_0', gap:'= sqrt(mω/(2ħ)) · ▢'}, '= sqrt(2mω/ħ) x ψ_0']}]}
  },
  puzzle:{
    title:'Kann der Oszillator ruhen?',
    text:'Klassisch hat ein Pendel, das ruhig im Minimum hängt, die Energie $E = 0$. Ein Teilchen im Potential $\\tfrac12m\\omega^2x^2$ werde so weit wie möglich abgekühlt.',
    q:{q:'Welche Energie hat es dann mindestens?', opts:['$E = 0$', '$E = \\tfrac12\\hbar\\omega$', '$E = \\hbar\\omega$'], a:1, ex:'Die Nullpunktsenergie ist $\\tfrac12\\hbar\\omega$.'},
    reveal:'Ruhe im Minimum hieße $x = 0$ **und** $p = 0$ – beides scharf. Das verbietet $\\Delta x\\,\\Delta p \\ge \\hbar/2$. Mit $\\langle x\\rangle = \\langle p\\rangle = 0$ ist $\\langle H\\rangle = \\frac{(\\Delta p)^2}{2m} + \\frac12m\\omega^2(\\Delta x)^2$. Das Minimum unter der Nebenbedingung $\\Delta x\\Delta p = \\hbar/2$ liegt bei $(\\Delta x)^2 = \\frac{\\hbar}{2m\\omega}$ und ergibt genau $\\tfrac12\\hbar\\omega$. Der Grundzustand ist eine Gauß-Funktion – der Zustand minimaler Unschärfe.'
  },
  clarify:{
    core:'Mit $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right)$ und $\\hat a^\\dagger$ gilt $[\\hat a, \\hat a^\\dagger] = 1$ und\n\n$$\\hat H = \\hbar\\omega\\left(\\hat a^\\dagger\\hat a + \\tfrac12\\right),\\qquad \\hat a|n\\rangle = \\sqrt n\\,|n-1\\rangle,\\qquad \\hat a^\\dagger|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle.$$\n\nDaraus folgt $E_n = \\hbar\\omega(n + \\tfrac12)$, $n = 0, 1, 2, \\dots$ Umgekehrt ist $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$ und $\\hat p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}(\\hat a^\\dagger - \\hat a)$. Matrixelemente rechnet man damit ohne Integrale.',
    keys:[
      'Energieniveaus haben den festen Abstand $\\hbar\\omega$; der Grundzustand hat die Nullpunktsenergie $\\tfrac12\\hbar\\omega$.',
      '$\\psi_n(x) = \\frac{1}{\\sqrt{2^nn!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}H_n(\\xi)\\,e^{-\\xi^2/2}$ mit $\\xi = \\sqrt{m\\omega/\\hbar}\\,x$; $\\psi_n$ hat $n$ Knoten und die Parität $(-1)^n$.',
      '$\\hat x$ und $\\hat p$ verbinden nur Nachbarn: $\\langle m|\\hat x|n\\rangle \\ne 0$ nur für $m = n \\pm 1$.',
      'In jedem Eigenzustand gilt $\\langle T\\rangle = \\langle V\\rangle = \\tfrac12E_n$ (Virialsatz).',
      'Zeitentwicklung: $|n\\rangle \\to e^{-iE_nt/\\hbar}|n\\rangle$. Überlagerungen benachbarter Zustände schwingen mit $\\omega$.'
    ],
    errors:[
      '$\\hat a^\\dagger|n\\rangle = \\sqrt n\\,|n+1\\rangle$ statt $\\sqrt{n+1}$: Teste mit $n = 0$ – $\\hat a^\\dagger|0\\rangle$ darf nicht null sein.',
      '$\\hat a\\hat a^\\dagger$ und $\\hat a^\\dagger\\hat a$ verwechseln: $\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$.',
      'Den Vorfaktor $\\frac{\\hbar}{2m\\omega}$ in $\\hat x^2$ vergessen.',
      'Mit $\\hat a$ wie mit einer Observablen rechnen: $\\hat a$ ist nicht hermitesch, $\\langle n|\\hat a|n\\rangle = 0$ hat keine Messbedeutung.'
    ],
    more:[{title:'Warum endet die Leiter unten?', text:'Für jeden Zustand ist $\\langle\\psi|\\hat a^\\dagger\\hat a|\\psi\\rangle = \\|\\hat a\\psi\\|^2 \\ge 0$, also sind alle Eigenwerte von $\\hat N = \\hat a^\\dagger\\hat a$ nichtnegativ. Weil $\\hat a$ den Eigenwert um 1 senkt, muss es einen Zustand mit $\\hat a|0\\rangle = 0$ geben – sonst käme man zu negativen Werten.'}],
    checks:[
      {q:'Was ist $\\hat a^\\dagger\\hat a^\\dagger|1\\rangle$?', opts:['$\\sqrt6\\,|3\\rangle$', '$2|3\\rangle$', '$\\sqrt2\\,|3\\rangle$'], a:0, ex:'$\\hat a^\\dagger|1\\rangle = \\sqrt2|2\\rangle$, dann $\\hat a^\\dagger|2\\rangle = \\sqrt3|3\\rangle$, zusammen $\\sqrt6|3\\rangle$.'},
      {q:'Welche Matrixelemente $\\langle m|\\hat x|2\\rangle$ sind ungleich null?', opts:['$m = 1$ und $m = 3$', 'nur $m = 2$', 'alle $m$'], a:0, ex:'$\\hat x \\propto \\hat a + \\hat a^\\dagger$ ändert $n$ um genau $\\pm1$.'}
    ]
  },
  lab:{type:'osc', title:'Eigenfunktionen im Parabelpotential',
    text:'Die Parabel ist das Potential, die waagerechten Linien sind die Energien $E_n$, darauf liegt $|\\psi_n|^2$. Gestrichelt: die klassische Aufenthaltsdichte bei derselben Energie, die an den Umkehrpunkten unendlich wird.',
    questions:[
      {q:'Grundzustand $n = 0$: Wie groß ist die Wahrscheinlichkeit, das Teilchen außerhalb der klassischen Umkehrpunkte zu finden?', opts:['etwa 16 %', '0 %', '50 %'], a:0, ex:'$P = \\operatorname{erfc}(1) \\approx 0{,}157$. Klassisch wäre der Bereich verboten.'},
      {q:'Stelle $n = 5$ ein. Wie sieht $|\\psi_5|^2$ im Vergleich zur klassischen Dichte aus?', opts:['Es schwingt um die klassische Kurve und ist an den Rändern am größten.', 'Es ist in der Mitte am größten wie beim Grundzustand.', 'Es stimmt exakt mit der klassischen Kurve überein.'], a:0, ex:'Für große $n$ nähert sich das Mittel von $|\\psi_n|^2$ der klassischen Dichte – das Korrespondenzprinzip. Die Knoten bleiben.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele Nullstellen hat $\\psi_4(x)$?', opts:['4', '5', '2'], a:0, ex:'$\\psi_n$ hat genau $n$ Knoten (Hermite-Polynom vom Grad $n$).'}},
  compare:{
    text:'Gesucht ist $\\langle x^2\\rangle$ im Grundzustand $\\psi_0 = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-m\\omega x^2/(2\\hbar)}$. Zwei richtige Wege:',
    ctx:OSZ_POS(),
    A:{name:'Gauß-Integral', model:['⟨x^2⟩ = sqrt(mω/(πħ)) ∫_-∞^∞ x^2 e^(-mω x^2/ħ) dx', {l:'= sqrt(mω/(πħ)) · ħ/(2mω) sqrt(πħ/(mω))', w:'∫x²e^{−αx²}dx = √(π/α)/(2α)'}, '= ħ/(2mω)']},
    B:{name:'Leiteroperatoren', text:'Mit $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$ und $\\hat a\\psi_0 = 0$:', model:['⟨x^2⟩ = ħ/(2mω) ⟨ψ_0|(â + â†)^2|ψ_0⟩', {l:'= ħ/(2mω) ⟨ψ_0|â â†|ψ_0⟩', w:'nur ââ† überlebt'}, '= ħ/(2mω)']},
    questions:[
      {q:'Welcher Weg ist für $\\langle x^4\\rangle$ im Zustand $\\psi_3$ deutlich bequemer?', opts:['die Leiteroperatoren', 'das Integral', 'beide gleich'], a:0, ex:'Mit $\\hat a$, $\\hat a^\\dagger$ zählt man nur Wege auf der Leiter; das Integral bräuchte $H_3^2\\,x^4\\,e^{-\\xi^2}$.'},
      {q:'Warum bleibt in Weg B nur $\\langle\\psi_0|\\hat a\\hat a^\\dagger|\\psi_0\\rangle$ übrig?', opts:['$\\hat a\\psi_0 = 0$ tötet $\\hat a^\\dagger\\hat a$ und $\\hat a^2$; $\\hat a^{\\dagger 2}\\psi_0$ ist orthogonal zu $\\psi_0$.', 'weil $\\hat a = \\hat a^\\dagger$', 'weil das Integral symmetrisch ist'], a:0, ex:'Und $\\hat a\\hat a^\\dagger\\psi_0 = (\\hat a^\\dagger\\hat a + 1)\\psi_0 = \\psi_0$.'}
    ]
  },
  practice:[
    {id:'osz-p1', title:'Rechnen mit Leiteroperatoren',
      text:'Besetzungszahlbasis $|n\\rangle$. Hier schreibst du `a` und `a†` ohne Dach; `H` ist $\\hbar\\omega(a^\\dagger a + \\tfrac12)$, `x` und `p` sind die Orts- und Impulsoperatoren.',
      ctx:OSZ_MAT(),
      goals:[
        {id:'a', prompt:'a) Zeige $[H, a] = -\\hbar\\omega\\,a$.', type:'show', from:'[H, a]', to:'-ħω a', points:3,
          hints:['Die Konstante $\\tfrac12$ vertauscht mit allem.', 'Benutze $[a^\\dagger a, a] = [a^\\dagger, a]a$ und $[a^\\dagger, a] = -1$.'],
          model:['[H, a] = ħω [a† a, a]', '= ħω (a† a a - a a† a)', '= ħω [a†, a] a', '= -ħω a'],
          note:'Damit senkt $a$ die Energie um $\\hbar\\omega$: $H(a|n\\rangle) = (E_n - \\hbar\\omega)\\,a|n\\rangle$.'},
        {id:'b', prompt:'b) Berechne $\\langle n|x^2|n\\rangle$.', type:'value', target:'ħ/(2mω) (2n + 1)', points:3,
          hints:['$x^2 = \\frac{\\hbar}{2m\\omega}(a + a^\\dagger)^2$; nur die Terme mit gleich vielen $a$ und $a^\\dagger$ tragen bei.'],
          model:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω)(2n + 1)']},
        {id:'c', prompt:'c) Berechne $\\langle n|p^2|n\\rangle$.', type:'value', target:'m ħ ω/2 (2n + 1)', points:3,
          hints:['$p^2 = -\\frac{m\\omega\\hbar}{2}(a^\\dagger - a)^2$.'],
          model:['⟨n|p^2|n⟩ = -mħω/2 ⟨n|(a† - a)^2|n⟩', '= mħω/2 ⟨n|(a† a + a a†)|n⟩', '= mħω/2 (2n + 1)'], note:'Damit $\\langle T\\rangle = \\langle p^2\\rangle/2m = \\tfrac12E_n = \\langle V\\rangle$.'}
      ]},
    {id:'osz-p2', title:'Grundzustand: kinetische und potentielle Energie',
      text:'$\\psi_0$ ist der normierte Grundzustand; es gilt $\\langle x^2\\rangle = \\frac{\\hbar}{2m\\omega}$ und $\\langle H\\rangle = \\tfrac12\\hbar\\omega$. Im Tutorial sind `V` das Potential und `T` die kinetische Energie.',
      ctx:OSZ_POS(),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle V\\rangle$.', type:'value', target:'ħω/4', points:2, model:['⟨V⟩ = 1/2 m ω^2 ⟨x^2⟩', '= 1/2 m ω^2 · ħ/(2mω)', '= ħω/4']},
        {id:'b', prompt:'b) Berechne $\\langle T\\rangle$.', type:'value', target:'ħω/4', points:2, model:['⟨T⟩ = ⟨H⟩ - ⟨V⟩', '= ħω/2 - ħω/4', '= ħω/4']},
        {id:'c', prompt:'c) Berechne $\\Delta x\\,\\Delta p$. (Es gilt $\\langle x\\rangle = \\langle p\\rangle = 0$ und $\\langle p^2\\rangle = 2m\\langle T\\rangle$.)', type:'value', target:'ħ/2', points:2,
          model:['Δx = sqrt(ħ/(2mω))', 'Δp = sqrt(mħω/2)', 'Δx Δp = ħ/2'], note:'Der Grundzustand erreicht die Unschärfegrenze exakt.'}
      ]},
    {id:'osz-p3', title:'Der erste angeregte Zustand in Ortsdarstellung',
      text:'$\\psi_1(x) = A\\,x\\,e^{-m\\omega x^2/(2\\hbar)}$ und $\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2} + \\frac12m\\omega^2x^2$.',
      ctx:{coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_1(x)':'A x e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'}, unknowns:{A:{ref:'(4/π)^(1/4) (m ω/ħ)^(3/4)', alt:['-(4/π)^(1/4) (m ω/ħ)^(3/4)']}, E:{ref:'3/2 ħ ω'}}},
      goals:[
        {id:'a', prompt:'a) Zeige, dass $\\psi_1$ Eigenfunktion von $\\hat H$ ist, und bestimme $E$.', type:'solve', unknown:'E', points:3,
          hints:['$\\psi_1\'\' = \\left(\\frac{m^2\\omega^2x^2}{\\hbar^2} - \\frac{3m\\omega}{\\hbar}\\right)\\psi_1$', 'Die $x^2$-Terme heben sich mit dem Potential weg.'],
          model:['ψ_1\'\' = (m^2 ω^2 x^2/ħ^2 - 3mω/ħ) ψ_1', 'Ĥ ψ_1 = -ħ^2/(2m) (m^2 ω^2 x^2/ħ^2 - 3mω/ħ) ψ_1 + 1/2 m ω^2 x^2 ψ_1', '= 3/2 ħω ψ_1', 'E = 3/2 ħω']},
        {id:'b', prompt:'b) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['$\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = m\\omega/\\hbar$.'],
          model:['|A|^2 ∫_-∞^∞ x^2 e^(-mω x^2/ħ) dx = 1', '|A|^2 ħ/(2mω) sqrt(πħ/(mω)) = 1', 'A = (4/π)^(1/4) (mω/ħ)^(3/4)']}
      ]},
    {id:'osz-p4', title:'Schwingender Erwartungswert',
      text:'Zur Zeit $t$ ist $|\\psi(t)\\rangle = \\frac{1}{\\sqrt2}\\left(e^{-i\\omega t/2}|0\\rangle + e^{-3i\\omega t/2}|1\\rangle\\right)$. Mit `⟨x⟩` ist der Erwartungswert in diesem Zustand gemeint.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-iωt/2)|0⟩ + e^(-3iωt/2)|1⟩)/sqrt(2)'}, state:'ψ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle x\\rangle(t)$.', type:'value', target:'sqrt(ħ/(2mω)) cos(ωt)', points:3,
          hints:['$x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(a + a^\\dagger)$; nur $\\langle 0|a|1\\rangle = 1$ und $\\langle 1|a^\\dagger|0\\rangle = 1$ tragen bei.', 'Die Phasen ergeben $e^{-i\\omega t} + e^{i\\omega t}$.'],
          model:['⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 1/2 (e^(-iωt) + e^(iωt))', '= sqrt(ħ/(2mω)) cos(ωt)']},
        {id:'b', prompt:'b) Berechne $\\langle p\\rangle(t)$ mit Ehrenfest: $\\langle p\\rangle = m\\,\\frac{d}{dt}\\langle x\\rangle$.', type:'value', target:'-sqrt(m ħ ω/2) sin(ωt)', points:2,
          model:['⟨p⟩ = m d/dt ⟨x⟩', '= -m ω sqrt(ħ/(2mω)) sin(ωt)', '= -sqrt(mħω/2) sin(ωt)']}
      ]},
    {id:'osz-p5', title:'Normierung der Leiterzustände',
      text:'Es gilt $a^\\dagger|n\\rangle = c\\,|n+1\\rangle$ mit einer Konstanten $c > 0$. Bestimme $c$ aus der Norm.',
      ctx:OSZ_MAT({unknowns:{c:{ref:'sqrt(n + 1)'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle n|a\\,a^\\dagger|n\\rangle = \\|a^\\dagger|n\\rangle\\|^2$.', type:'value', target:'n + 1', points:2,
          hints:['$a a^\\dagger = a^\\dagger a + 1$.'], model:['⟨n|a a†|n⟩ = ⟨n|(a† a + 1)|n⟩', '= n + 1']},
        {id:'b', prompt:'b) Bestimme $c$.', type:'solve', unknown:'c', points:2, model:['a†|n⟩ = c |n+1⟩', 'c^2 = n + 1', 'c = sqrt(n + 1)']}
      ]}
  ],
  final:[
    {q:'Wie groß ist der Abstand benachbarter Energieniveaus des Oszillators?', opts:['$\\hbar\\omega$', '$\\tfrac12\\hbar\\omega$', 'wächst mit $n$'], a:0, ex:'$E_{n+1} - E_n = \\hbar\\omega$ für alle $n$.'},
    {task:{id:'osz-f1', title:'Ein Matrixelement', text:'Besetzungszahlbasis; `x` ist der Ortsoperator, `a` und `a†` die Leiteroperatoren.',
      ctx:OSZ_MAT(),
      goals:[{id:'a', prompt:'Berechne $\\langle 2|x^2|0\\rangle$.', type:'value', target:'ħ/(2mω) sqrt(2)', points:2, model:['⟨2|x^2|0⟩ = ħ/(2mω) ⟨2|(a + a†)^2|0⟩', '= ħ/(2mω) ⟨2|a† a†|0⟩', '= ħ/(2mω) sqrt(2)']}]}},
    {q:'Was bedeutet $\\hat a|0\\rangle = 0$?', opts:['Unter dem Grundzustand gibt es keinen weiteren Zustand.', 'Der Grundzustand hat die Energie 0.', '$|0\\rangle$ ist nicht normierbar.'], a:0, ex:'Die Energie von $|0\\rangle$ ist $\\tfrac12\\hbar\\omega$; $\\hat a|0\\rangle = 0$ ist der Nullvektor, kein Zustand.'},
    {task:{id:'osz-f2', title:'Vernichter auf den Grundzustand', text:'$\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-m\\omega x^2/(2\\hbar)}$, $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(x + \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$.',
      ctx:OSZ_POS(),
      goals:[{id:'a', prompt:'Berechne $\\hat a\\psi_0$.', type:'value', target:'0', points:2, model:['â ψ_0 = sqrt(mω/(2ħ)) (x ψ_0 + ħ/(mω) dψ_0/dx)', '= sqrt(mω/(2ħ)) (x ψ_0 - x ψ_0)', '= 0']}]}}
  ],
  errors:[
    {id:'osz-e1', title:'Ein vergessenes „+1“',
      text:'Gesucht ist $\\langle n|x^2|n\\rangle$:',
      ctx:OSZ_MAT(),
      lines:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω) (n + n)', '= ħ n/(mω)'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$\\langle n|a a^\\dagger|n\\rangle = n + 1$, nicht $n$.', '$\\langle n|a^\\dagger a|n\\rangle = n + 1$.', 'Der Vorfaktor gehört quadriert.'], a:0, ex:'$a a^\\dagger = a^\\dagger a + 1$. Test: Für $n = 0$ käme $\\langle x^2\\rangle = 0$ heraus – unmöglich bei einer Gauß-Funktion.'},
      fix:{id:'a', prompt:'Berichtige und rechne zu Ende.', type:'value', target:'ħ/(2mω) (2n + 1)', model:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω) (n + 1 + n)', '= ħ/(2mω) (2n + 1)']}},
    {id:'osz-e2', title:'Ein Vorzeichen in der Grundzustandsgleichung',
      text:'Aus $\\hat a\\psi_0 = 0$ wird $\\psi_0$ bestimmt. Gesucht ist die Zahl $\\beta$ in $\\psi_0\' = \\beta\\,x\\,\\psi_0$:',
      ctx:OSZ_GROUND(),
      lines:['x ψ_0 + ħ/(mω) dψ_0/dx = 0', 'dψ_0/dx = mω/ħ x ψ_0', 'ψ_0(x) = A e^(mω x^2/(2ħ))'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Beim Auflösen ging das Minuszeichen verloren: $\\psi_0\' = -\\frac{m\\omega}{\\hbar}x\\psi_0$.', 'Der Faktor $\\hbar/(m\\omega)$ muss im Zähler stehen.', 'Man darf nicht durch $\\psi_0$ teilen.'], a:0, ex:'Mit dem falschen Vorzeichen wüchse $\\psi_0$ wie $e^{+x^2}$ – nicht normierbar. Das ist ein guter Plausibilitätstest.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $\\beta$.', type:'solve', unknown:'β', model:['x ψ_0 + ħ/(mω) dψ_0/dx = 0', 'dψ_0/dx = β x ψ_0', 'β = -mω/ħ']}}
  ]
});
lexe('leiteroperatoren', 'Leiteroperatoren (Oszillator)', '$\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right)$, $\\hat a^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - \\frac{i}{m\\omega}\\hat p\\right)$, $[\\hat a,\\hat a^\\dagger] = 1$. Wirkung: $\\hat a|n\\rangle = \\sqrt n|n-1\\rangle$, $\\hat a^\\dagger|n\\rangle = \\sqrt{n+1}|n+1\\rangle$, $\\hat a^\\dagger\\hat a|n\\rangle = n|n\\rangle$. Ortsdarstellung: $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(x + \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$.', {topic:'osz'});
lexe('oszillator-spektrum', 'Harmonischer Oszillator: Spektrum', '$V = \\tfrac12m\\omega^2x^2$, $\\hat H = \\hbar\\omega(\\hat a^\\dagger\\hat a + \\tfrac12)$, $E_n = \\hbar\\omega(n + \\tfrac12)$, $n = 0, 1, 2, \\dots$ Nullpunktsenergie $\\tfrac12\\hbar\\omega$, äquidistante Niveaus, keine Entartung in 1D.', {topic:'osz'});
lexe('hermite-funktionen', 'Eigenfunktionen des Oszillators', '$\\psi_n(x) = \\frac{1}{\\sqrt{2^nn!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}H_n(\\xi)e^{-\\xi^2/2}$, $\\xi = \\sqrt{m\\omega/\\hbar}\\,x$. Hermite-Polynome: $H_0 = 1$, $H_1 = 2\\xi$, $H_2 = 4\\xi^2 - 2$, $H_3 = 8\\xi^3 - 12\\xi$. Im Tutorial: `H_n(ξ)` oder `hermite(n, ξ)`.', {topic:'osz'});
lexe('osz-orts-impuls', 'Ort und Impuls durch Leiteroperatoren', '$\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$, $\\hat p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}(\\hat a^\\dagger - \\hat a)$. Damit: $\\langle n|\\hat x^2|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n+1)$, $\\langle n|\\hat p^2|n\\rangle = \\frac{m\\omega\\hbar}{2}(2n+1)$, $\\langle n\\pm1|\\hat x|n\\rangle = \\sqrt{\\frac{\\hbar}{2m\\omega}}\\sqrt{n + \\tfrac12 \\pm \\tfrac12}$.', {topic:'osz'});
