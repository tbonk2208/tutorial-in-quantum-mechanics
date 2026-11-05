/* ===== Thema 11: Stationäre Störungstheorie ===== */
const STBOX = ops => CTX.box({params:{L:'pos', m:'pos', n:{int:[1, 5]}, V_0:'pos', λ:'real'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops});
const STOSC = () => ({rep:'mat', mat:{preset:'osc'}, coords:['t'], params:{m:'pos', ω:'pos', λ:'real', n:{int:[0, 5]}}, sumFrom:0});
topic({
  id:'stoer', math:['m-eigen', 'm-hilbert'], title:'Stationäre Störungstheorie', short:'Störungstheorie',
  src:'Griffiths & Schroeter Kap. 7 · Nolting 5/2 · Schwabl Kap. 11',
  goals:[
    'Ich kann Energiekorrekturen erster Ordnung $E_n^{(1)} = \\langle n|\\hat H\'|n\\rangle$ berechnen und mit Symmetrie abschätzen.',
    'Ich kann die zweite Ordnung $E_n^{(2)} = \\sum_{m\\ne n}\\frac{|\\langle m|\\hat H\'|n\\rangle|^2}{E_n^{(0)} - E_m^{(0)}}$ mit Leiteroperatoren auswerten.',
    'Ich kann bei Entartung die Störung im entarteten Unterraum diagonalisieren und mit dem Variationsverfahren eine obere Schranke für die Grundzustandsenergie finden.'
  ],
  needs:'Eigenzustände und Energien von Kasten und Oszillator · Matrixelemente $\\langle m|\\hat x|n\\rangle$ mit $\\hat a, \\hat a^\\dagger$ · Eigenwerte von $2\\times2$-Matrizen',
  check:[
    {q:'$|n\\rangle$ ist Eigenzustand von $\\hat H_0$ mit $\\hat H_0|n\\rangle = E_n|n\\rangle$. Was ist $\\langle n|\\hat H_0|n\\rangle$?', opts:['$E_n$', '$0$', '$E_n^2$'], a:0, ex:'$\\langle n|\\hat H_0|n\\rangle = E_n\\langle n|n\\rangle = E_n$.', prev:'form'},
    {q:'Die Energien im unendlich hohen Kasten der Breite $L$ sind …', opts:['$E_n = \\frac{n^2\\pi^2\\hbar^2}{2mL^2}$', '$E_n = \\hbar\\omega(n+\\frac12)$', '$E_n = \\frac{n\\pi\\hbar}{L}$'], a:0, ex:'Aus $k_n = n\\pi/L$ und $E = \\hbar^2k^2/(2m)$.', prev:'kasten'},
    {q:'Was ist $\\langle n|\\hat x|n\\rangle$ im harmonischen Oszillator?', opts:['$0$', '$\\sqrt{\\hbar/(2m\\omega)}$', '$n\\,\\hbar/(m\\omega)$'], a:0, ex:'$\\hat x\\propto\\hat a + \\hat a^\\dagger$ ändert $n$ um $\\pm1$; außerdem ist $|\\psi_n|^2$ gerade.', prev:'osz'},
    {q:'$\\int_0^{L/2}\\sin^2(n\\pi x/L)\\,dx$ ist für ganzzahliges $n \\ge 1$ …', opts:['$L/4$', '$L/2$', 'von $n$ abhängig'], a:0, ex:'$\\sin^2u = \\frac12(1 - \\cos2u)$; der Kosinus-Anteil gibt bei $x = L/2$ den Wert $\\sin(n\\pi) = 0$.', lex:'integrale'}
  ],
  example:{
    title:'Stufe auf der linken Hälfte des Kastens',
    text:'Ein Kasten $0 < x < L$ bekommt auf der linken Hälfte die Störung $\\hat H\' = V_0$ für $x < L/2$ (rechts $0$). Bestimme die Energiekorrektur erster Ordnung für den Zustand $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$.',
    ctx:STBOX({"H'":'V_0 Θ(L/2 - x)'}),
    lines:[
      {l:"E^(1) = ⟨ψ_n|H'|ψ_n⟩", why:{q:'Warum ist das die Korrektur erster Ordnung?', opts:['Sie ist der Erwartungswert der Störung im ungestörten Zustand.', 'Weil $\\hat H\'$ hermitesch ist.', 'Weil $E^{(1)}$ immer $0$ ist.'], a:0, ex:'$E_n \\approx E_n^{(0)} + \\langle n|\\hat H\'|n\\rangle$: Für die Energiekorrektur erster Ordnung genügt der ungestörte Zustand. Der Zustand selbst ändert sich schon in erster Ordnung ($|n^{(1)}\\rangle$); das wirkt sich erst in der zweiten Ordnung der Energie aus.'}},
      {l:'= 2/L V_0 ∫_0^{L/2} sin(nπx/L)^2 dx', why:{q:'Warum geht das Integral nur bis $L/2$?', opts:['Rechts von $L/2$ ist die Störung null.', 'Weil $\\psi_n$ rechts verschwindet.', 'Wegen der Symmetrie des Sinus.'], a:0, ex:'Der Integrand $\\psi_n^*\\hat H\'\\psi_n$ ist für $x > L/2$ null.'}},
      {l:'= 2/L V_0 · L/4', why:{q:'Woher kommt $L/4$?', opts:['$\\int_0^{L/2}\\sin^2(n\\pi x/L)dx = L/4$ für jedes ganze $n$', 'Das gilt nur für $n = 1$.', '$\\sin^2$ ist im Mittel $1/4$.'], a:0, ex:'Mit $\\sin^2u = \\frac12(1-\\cos2u)$ verschwindet der Kosinus-Anteil an beiden Grenzen.'}},
      {l:'= V_0/2', why:{q:'Ist das plausibel?', opts:['Ja: Das Teilchen ist mit Wahrscheinlichkeit $1/2$ links und spürt dort $V_0$.', 'Nein, die Korrektur müsste von $n$ abhängen.', 'Nein, sie müsste negativ sein.'], a:0, ex:'$E_n^{(1)} = V_0\\,P(x < L/2) = V_0/2$, weil $|\\psi_n|^2$ symmetrisch um $L/2$ ist.'}}
    ],
    faded:{id:'stoer-fade', title:'Jetzt du: schräger Boden $\\hat H\' = \\lambda x$', text:'Gleicher Kasten, jetzt mit der Störung $\\hat H\' = \\lambda x$. Nützlich: $\\int_0^Lx\\sin^2(n\\pi x/L)dx = L^2/4$.',
      ctx:STBOX({"H'":'λ x'}),
      given:["E^(1) = ⟨ψ_n|H'|ψ_n⟩", '= 2λ/L ∫_0^L x sin(nπx/L)^2 dx'],
      goals:[{id:'a', prompt:'Bestimme $E_n^{(1)}$.', type:'value', target:'λ L/2', hints:['Setze das angegebene Integral ein.', 'Es ist $\\lambda\\langle x\\rangle$ mit $\\langle x\\rangle = L/2$.'],
        model:["E^(1) = ⟨ψ_n|H'|ψ_n⟩", '= 2λ/L ∫_0^L x sin(nπx/L)^2 dx', {l:'= 2λ/L · L^2/4', gap:'= 2λ/L · ▢'}, '= λ L/2']}]}
  },
  puzzle:{
    title:'Wer spürt die Stufe stärker?',
    text:'Im Kasten $0<x<L$ wird die linke Hälfte um $V_0$ angehoben (kleines $V_0$). Der Grundzustand $n = 1$ hat seinen Bauch in der Mitte, der Zustand $n = 5$ ist über den ganzen Kasten verteilt.\n\nUm wie viel verschieben sich die beiden Energien in erster Ordnung?',
    q:{q:'Deine Vermutung:', opts:['beide um $V_0/2$', 'der Grundzustand mehr, weil er langsamer ist', 'der Zustand $n = 5$ mehr, weil er mehr Knoten hat', 'keiner von beiden'], a:0, ex:'Es zählt nur, wie viel Wahrscheinlichkeit links liegt.'},
    reveal:'$E_n^{(1)} = \\langle\\psi_n|\\hat H\'|\\psi_n\\rangle = V_0\\int_0^{L/2}|\\psi_n|^2dx$. Jede Dichte $|\\psi_n|^2 = \\frac2L\\sin^2(n\\pi x/L)$ ist spiegelsymmetrisch um $L/2$, also liegt bei **jedem** $n$ genau die Hälfte links: $E_n^{(1)} = V_0/2$.\n\nUnterschiede zwischen den Zuständen tauchen erst in zweiter Ordnung auf – dort, wo sich die Zustände durch die Störung verformen.'
  },
  clarify:{
    core:'Man zerlegt $\\hat H = \\hat H_0 + \\hat H\'$ mit bekannten Lösungen $\\hat H_0|n\\rangle = E_n^{(0)}|n\\rangle$ und kleiner Störung $\\hat H\'$. Ohne Entartung gilt\n\n$$E_n = E_n^{(0)} + \\langle n|\\hat H\'|n\\rangle + \\sum_{m\\ne n}\\frac{|\\langle m|\\hat H\'|n\\rangle|^2}{E_n^{(0)} - E_m^{(0)}} + \\dots$$\n\nDie Reihe ist brauchbar, wenn $|\\langle m|\\hat H\'|n\\rangle| \\ll |E_n^{(0)} - E_m^{(0)}|$. Bei Entartung diagonalisiert man $\\hat H\'$ im entarteten Unterraum; die Eigenwerte dieser Matrix sind die Korrekturen erster Ordnung.',
    keys:[
      'Erste Ordnung = Mittelwert der Störung im ungestörten Zustand. Symmetrie (Parität) macht viele Matrixelemente null.',
      'Zweite Ordnung für den Grundzustand ist immer $\\le 0$: alle Nenner $E_0^{(0)} - E_m^{(0)}$ sind negativ.',
      'Im Oszillator koppelt $\\hat x$ nur $n\\to n\\pm1$, $\\hat x^2$ nur $n\\to n, n\\pm2$ – die Summe hat wenige Glieder.',
      'Variationsprinzip: Für jeden normierten Versuchszustand ist $\\langle\\psi|\\hat H|\\psi\\rangle \\ge E_0$. Minimieren über Parameter gibt die beste Schranke.',
      'Bei entarteten Niveaus erst die „richtigen“ Zustände nullter Ordnung bestimmen (Eigenvektoren von $\\hat H\'$ im Unterraum), sonst teilt man durch null.'
    ],
    errors:[
      'Die Normierung $2/L$ der Kastenfunktionen im Matrixelement vergessen.',
      'In der zweiten Ordnung $m = n$ mitsummieren oder das Vorzeichen des Nenners vertauschen.',
      'Die nicht entartete Formel bei Entartung benutzen – der Nenner $E_n^{(0)} - E_m^{(0)}$ wird null.',
      'Das Variationsergebnis für die exakte Energie halten: Es ist eine obere Schranke, exakt nur, wenn der Ansatz die Lösung enthält.'
    ],
    more:[{title:'Exakter Vergleich: Oszillator mit $\\lambda x$', text:'Mit quadratischer Ergänzung ist $\\frac12m\\omega^2x^2 + \\lambda x = \\frac12m\\omega^2\\left(x + \\frac{\\lambda}{m\\omega^2}\\right)^2 - \\frac{\\lambda^2}{2m\\omega^2}$. Alle Niveaus sinken exakt um $\\frac{\\lambda^2}{2m\\omega^2}$ – genau das Ergebnis der zweiten Ordnung; die erste Ordnung ist null.'}],
    checks:[
      {q:'Für den Grundzustand ist die Korrektur zweiter Ordnung …', opts:['immer $\\le 0$', 'immer $\\ge 0$', 'immer $0$'], a:0, ex:'Alle Nenner $E_0^{(0)} - E_m^{(0)} < 0$, alle Zähler $\\ge 0$.'},
      {q:'Warum versagt die Formel zweiter Ordnung bei Entartung?', opts:['Ein Nenner $E_n^{(0)} - E_m^{(0)}$ wird null.', 'Weil $\\hat H\'$ dann nicht hermitesch ist.', 'Weil die erste Ordnung dann immer null ist.'], a:0, ex:'Man muss zuerst im entarteten Unterraum diagonalisieren; dann verschwinden die gefährlichen Matrixelemente.'}
    ]
  },
  lab:{type:'perturb', title:'Erste Ordnung gegen exakte Lösung',
    text:'Kasten mit Stufe $V_0$ auf der linken Hälfte. Grau: ungestörte Niveaus $n^2E_1$, orange: erste Ordnung $n^2E_1 + V_0/2$, blau: exakt (numerisch diagonalisiert). Verändere $V_0$.',
    questions:[
      {q:'Stelle $V_0 = 2E_1$ ein. Wo liegt die exakte Grundzustandsenergie?', opts:['etwas unter der ersten Ordnung', 'genau auf der ersten Ordnung', 'darüber'], a:0, ex:'$E_1 + V_0/2 = \\langle\\psi_1|\\hat H|\\psi_1\\rangle$ ist nach dem Variationsprinzip eine obere Schranke. Die zweite Ordnung ist negativ.'},
      {q:'Jetzt $V_0 = 5E_1$. Für welches der drei Niveaus weicht die erste Ordnung am stärksten ab?', opts:['$n = 1$', '$n = 2$', '$n = 3$'], a:0, ex:'Der Grundzustand hat nur Nachbarn darüber; alle Beiträge zweiter Ordnung drücken ihn nach unten. Bei $n = 3$ heben sich Beiträge von oben und unten teilweise auf.'}
    ],
    noPic:{q:'Ohne Bild: Hängt die Korrektur erster Ordnung $E_n^{(1)}$ für diese Stufe von $n$ ab?', opts:['nein, sie ist für alle $n$ gleich $V_0/2$', 'ja, sie wächst mit $n^2$', 'ja, sie fällt mit $1/n$'], a:0, ex:'Jede Dichte $|\\psi_n|^2$ ist symmetrisch um $L/2$; links liegt immer die Hälfte.'}},
  compare:{
    text:'Gesucht ist $E_n^{(1)}$ für die Stufe $V_0$ auf der linken Hälfte des Kastens. Zwei richtige Wege:',
    ctx:STBOX({"H'":'V_0 Θ(L/2 - x)'}),
    A:{name:'Integral ausrechnen', model:["⟨ψ_n|H'|ψ_n⟩ = 2/L V_0 ∫_0^{L/2} sin(nπx/L)^2 dx", '= 2/L V_0 · L/4', '= V_0/2']},
    B:{name:'Symmetrie der Dichte', text:'$|\\psi_n(L-x)|^2 = |\\psi_n(x)|^2$, also liegt die halbe Wahrscheinlichkeit links.', model:["⟨ψ_n|H'|ψ_n⟩ = V_0 ∫_0^{L/2} |ψ_n(x)|^2 dx", '= V_0/2 ∫_0^L |ψ_n(x)|^2 dx', '= V_0/2']},
    questions:[
      {q:'Für welche Störung hilft Weg B nicht mehr?', opts:['$\\hat H\' = V_0$ nur für $0 < x < L/4$', '$\\hat H\' = V_0$ nur für $L/2 < x < L$', '$\\hat H\' = V_0$ im ganzen Kasten'], a:0, ex:'Ein Viertel ist kein symmetrischer Anteil; dann hängt $E_n^{(1)}$ von $n$ ab und man muss integrieren.'},
      {q:'Was zeigt Weg B allgemein?', opts:['$E_n^{(1)} = V_0\\cdot P(\\text{Teilchen im Störbereich})$ für eine stückweise konstante Störung', 'dass die zweite Ordnung null ist', 'dass $\\psi_n$ sich nicht ändert'], a:0, ex:'Für $\\hat H\' = V_0$ auf einem Bereich $B$ ist $\\langle n|\\hat H\'|n\\rangle = V_0\\int_B|\\psi_n|^2dx$.'}
    ]
  },
  practice:[
    {id:'stoer-p1', title:'Buckel im Kasten',
      text:'Ein Kasten $0<x<L$ bekommt die Störung $\\hat H\' = V_0\\sin(\\pi x/L)$. Gesucht ist die Korrektur erster Ordnung für den Grundzustand $\\psi_1 = \\sqrt{2/L}\\sin(\\pi x/L)$. Nützlich: $\\int_0^\\pi\\sin^3u\\,du = 4/3$.',
      ctx:CTX.box({params:{L:'pos', m:'pos', V_0:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops:{"H'":'V_0 sin(πx/L)'}}),
      goals:[{id:'a', prompt:'Berechne $E_1^{(1)}$.', type:'value', target:'8V_0/(3π)', points:3, ph:"E^(1) = ⟨ψ_1|H'|ψ_1⟩",
        hints:['Im Integranden steht $\\sin^3(\\pi x/L)$.', 'Mit $u = \\pi x/L$: $\\int_0^L\\sin^3(\\pi x/L)dx = \\frac{L}{\\pi}\\cdot\\frac43$.'],
        model:["E^(1) = ⟨ψ_1|H'|ψ_1⟩", '= 2V_0/L ∫_0^L sin(πx/L)^3 dx', '= 2V_0/L · 4L/(3π)', '= 8V_0/(3π)'],
        mistakes:[{expr:'4V_0/(3π)', msg:'Prüfe die Normierung: $|\\psi_1|^2$ enthält den Faktor $2/L$.'}]}]},
    {id:'stoer-p2', title:'Oszillator im homogenen Feld',
      text:'Harmonischer Oszillator mit $\\hat H\' = \\lambda\\hat x$, $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$. In der Eingabe sind `x`, `a`, `a†` und die Kets `|n⟩` bekannt.',
      ctx:STOSC(),
      goals:[
        {id:'a', prompt:'a) Zeige, dass die erste Ordnung verschwindet.', type:'value', target:'0', points:1, ph:'⟨n|λ x|n⟩ = …',
          model:['⟨n|λ x|n⟩ = λ sqrt(ħ/(2mω)) ⟨n|a + a†|n⟩', '= 0']},
        {id:'b', prompt:'b) Berechne die Korrektur zweiter Ordnung $E^{(2)}$. Nur $m = n\\pm1$ tragen bei; $E_n^{(0)} - E_{n\\pm1}^{(0)} = \\mp\\hbar\\omega$.', type:'value', target:'-λ^2/(2 m ω^2)', points:3,
          hints:['$|\\langle n+1|\\hat x|n\\rangle|^2 = \\frac{\\hbar}{2m\\omega}(n+1)$ und $|\\langle n-1|\\hat x|n\\rangle|^2 = \\frac{\\hbar}{2m\\omega}n$.', '$E^{(2)} = \\lambda^2\\left(\\frac{|\\langle n-1|x|n\\rangle|^2}{\\hbar\\omega} - \\frac{|\\langle n+1|x|n\\rangle|^2}{\\hbar\\omega}\\right)$'],
          model:['|⟨n+1|x|n⟩|^2 = ħ/(2mω)(n+1)', '|⟨n-1|x|n⟩|^2 = ħ/(2mω) n', 'E^(2) = λ^2 (ħ/(2mω) n/(ħω) - ħ/(2mω)(n+1)/(ħω))', '= -λ^2/(2mω^2)'],
          mistakes:[{expr:'λ^2/(2 m ω^2)', msg:'Vorzeichen der Nenner prüfen: $E_n^{(0)} - E_{n+1}^{(0)} = -\\hbar\\omega$.'}],
          note:'Das ist exakt: $\\frac12m\\omega^2x^2 + \\lambda x$ ist ein verschobener Oszillator, der um $\\lambda^2/(2m\\omega^2)$ tiefer liegt. Unabhängig von $n$.'}
      ]},
    {id:'stoer-p3', title:'Oszillator mit steiferer Feder',
      text:'Harmonischer Oszillator mit $\\hat H\' = \\lambda\\hat x^2$.',
      ctx:STOSC(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\langle n|(\\hat a + \\hat a^\\dagger)^2|n\\rangle = 2n + 1$.', type:'show', from:'⟨n|(a + a†)^2|n⟩', to:'2n + 1', points:2,
          hints:['Beim Ausmultiplizieren tragen nur $\\hat a\\hat a^\\dagger$ und $\\hat a^\\dagger\\hat a$ bei.', '$\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$.'],
          model:['⟨n|(a + a†)^2|n⟩ = ⟨n|a a† + a† a|n⟩', '= (n + 1) + n', '= 2n + 1']},
        {id:'b', prompt:'b) Berechne $E_n^{(1)}$.', type:'value', target:'λ ħ (2n + 1)/(2 m ω)', points:2,
          model:['⟨n|λ x^2|n⟩ = λ ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= λ ħ/(2mω)(2n + 1)'],
          note:'Exakt ist $\\omega\' = \\omega\\sqrt{1 + 2\\lambda/(m\\omega^2)}$; die Entwicklung bis zur ersten Ordnung in $\\lambda$ gibt genau dieses Ergebnis.'}
      ]},
    {id:'stoer-p4', title:'Entartetes Niveau',
      text:'Zwei Zustände $|1\\rangle, |2\\rangle$ haben dieselbe Energie $E^{(0)}$. Im Unterraum hat die Störung die Matrix $W = \\begin{pmatrix}0&\\beta\\\\\\beta&0\\end{pmatrix}$ mit $\\beta > 0$. In der Eingabe heißt sie `W`, die Einheitsmatrix `I`.',
      ctx:{rep:'mat', mat:{preset:'spin', mats:{W:'(0, β; β, 0)'}}, coords:['t'], params:{β:'pos'}, unknowns:{ε:{ref:'β', alt:['-β'], kind:'real'}}},
      goals:[
        {id:'a', prompt:'a) Bestimme die Energiekorrekturen $\\varepsilon$ erster Ordnung (am Ende die positive: $\\varepsilon = \\dots$).', type:'solve', unknown:'ε', points:3, ph:'det(W - ε I) = 0',
          hints:['Die Korrekturen sind die Eigenwerte von $W$.', '$\\det\\begin{pmatrix}-\\varepsilon&\\beta\\\\\\beta&-\\varepsilon\\end{pmatrix} = \\varepsilon^2 - \\beta^2$.'],
          model:['det(W - ε I) = 0', 'det((-ε, β; β, -ε)) = 0', 'ε^2 - β^2 = 0', 'ε = β'], note:'Die zweite Korrektur ist $-\\beta$: Das Niveau spaltet in $E^{(0)}\\pm\\beta$ auf.'},
        {id:'b', prompt:'b) Zeige, dass $\\frac{1}{\\sqrt2}\\binom11$ der richtige Zustand nullter Ordnung zu $+\\beta$ ist.', type:'show', from:'W (1; 1)/sqrt(2)', to:'β (1; 1)/sqrt(2)', points:2,
          model:['W (1; 1)/sqrt(2) = (0, β; β, 0)(1; 1)/sqrt(2)', '= (β; β)/sqrt(2)', '= β (1; 1)/sqrt(2)']}
      ]},
    {id:'stoer-p5', title:'Variationsverfahren mit Gauß-Ansatz',
      text:'Für $\\hat H = \\frac{\\hat p^2}{2m} + \\frac12m\\omega^2\\hat x^2$ probieren wir $\\psi_b(x) = (2b/\\pi)^{1/4}e^{-bx^2}$ (normiert, $b > 0$). Es gilt $\\langle x^2\\rangle = 1/(4b)$.',
      ctx:{coords:['x'], params:{m:'pos', ω:'pos', b:'pos'}, defs:{'ψ(x)':'(2b/π)^(1/4) e^(-b x^2)', 'V(x)':'1/2 m ω^2 x^2'}, state:'ψ', normalized:true, unknowns:{b_0:{ref:'m ω/(2ħ)'}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle V\\rangle$.', type:'value', target:'m ω^2/(8b)', points:1,
          model:['⟨V⟩ = 1/2 m ω^2 ⟨x^2⟩', '= 1/2 m ω^2 · 1/(4b)', '= m ω^2/(8b)']},
        {id:'b', prompt:'b) Berechne $\\langle T\\rangle$.', type:'value', target:'ħ^2 b/(2m)', points:2, ph:"⟨T⟩ = -ħ^2/(2m) ∫_-∞^∞ ψ ψ'' dx",
          hints:['$\\psi\'\' = (4b^2x^2 - 2b)\\psi$.', '$\\langle T\\rangle = -\\frac{\\hbar^2}{2m}(4b^2\\langle x^2\\rangle - 2b)$.'],
          model:["⟨T⟩ = -ħ^2/(2m) ∫_-∞^∞ ψ ψ'' dx", '= -ħ^2/(2m) (4b^2 · 1/(4b) - 2b)', '= ħ^2 b/(2m)']},
        {id:'c', prompt:'c) Minimiere $\\langle H\\rangle(b) = \\frac{\\hbar^2b}{2m} + \\frac{m\\omega^2}{8b}$: Bestimme das optimale $b_0$.', type:'solve', unknown:'b_0', points:2, ph:'d/db (ħ^2 b/(2m) + m ω^2/(8b)) = …',
          model:['d/db (ħ^2 b/(2m) + m ω^2/(8b)) = ħ^2/(2m) - m ω^2/(8b^2)', 'ħ^2/(2m) - m ω^2/(8 b_0^2) = 0', 'b_0 = m ω/(2ħ)']},
        {id:'d', prompt:'d) Welche Energie liefert der beste Ansatz?', type:'value', target:'ħ ω/2', points:1,
          model:['E = ħ^2/(2m) · mω/(2ħ) + mω^2/8 · 2ħ/(mω)', '= ħω/2'], note:'Das ist exakt $E_0$, weil der Gauß-Ansatz den wahren Grundzustand enthält. Sonst erhält man nur eine obere Schranke.'}
      ]}
  ],
  final:[
    {q:'Ein System hat den Grundzustand $|0\\rangle$. Wie groß ist die Korrektur zweiter Ordnung höchstens?', opts:['höchstens $0$ (sie ist nie positiv)', 'höchstens $E_0^{(1)}$', 'Sie kann beliebig positiv sein.'], a:0, ex:'$E_0^{(2)} = \\sum_{m\\ne0}|\\langle m|\\hat H\'|0\\rangle|^2/(E_0^{(0)} - E_m^{(0)}) \\le 0$.'},
    {task:{id:'stoer-f1', title:'Stufe im rechten Viertel', text:'Kasten $0<x<L$ mit $\\hat H\' = V_0$ für $3L/4 < x < L$ (sonst $0$). Grundzustand $\\psi_1 = \\sqrt{2/L}\\sin(\\pi x/L)$. Es gilt $\\int_{3L/4}^L\\sin^2(\\pi x/L)dx = \\frac L8 - \\frac{L}{4\\pi}$.',
      ctx:CTX.box({params:{L:'pos', m:'pos', V_0:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)'}, ops:{"H'":'V_0 Θ(x - 3L/4)'}}),
      goals:[{id:'a', prompt:'Berechne $E_1^{(1)}$.', type:'value', target:'V_0 (1/4 - 1/(2π))', points:2, model:["E^(1) = ⟨ψ_1|H'|ψ_1⟩", '= 2V_0/L ∫_{3L/4}^L sin(πx/L)^2 dx', '= 2V_0/L (L/8 - L/(4π))', '= V_0 (1/4 - 1/(2π))']}]}},
    {q:'Zwei Zustände sind entartet, und $\\langle 1|\\hat H\'|2\\rangle \\ne 0$. Was ist zu tun?', opts:['$\\hat H\'$ im Unterraum $\\{|1\\rangle, |2\\rangle\\}$ diagonalisieren', 'die Formel zweiter Ordnung anwenden', 'die Störung vernachlässigen'], a:0, ex:'Die Eigenwerte der $2\\times2$-Matrix sind die Korrekturen erster Ordnung, die Eigenvektoren die richtigen Zustände nullter Ordnung.'},
    {task:{id:'stoer-f2', title:'Grundzustand mit $\\lambda x^2$', text:'Oszillator mit $\\hat H\' = \\lambda\\hat x^2$, Grundzustand $|0\\rangle$.',
      ctx:STOSC(),
      goals:[{id:'a', prompt:'Berechne $E_0^{(1)}$.', type:'value', target:'λ ħ/(2 m ω)', points:2, model:['⟨0|λ x^2|0⟩ = λ ħ/(2mω) ⟨0|(a + a†)^2|0⟩', '= λ ħ/(2mω)']}]}}
  ],
  errors:[
    {id:'stoer-e1', title:'Eine Stufe, die nur ein Viertel bringt?',
      text:'Für die Stufe $V_0$ auf der linken Hälfte des Kastens rechnet jemand:',
      ctx:STBOX({"H'":'V_0 Θ(L/2 - x)'}),
      lines:["E^(1) = ⟨ψ_n|H'|ψ_n⟩", '= V_0 ∫_0^{L/2} sin(nπx/L)^2 dx', '= V_0 L/4'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Die Normierung $2/L$ von $|\\psi_n|^2$ fehlt.', 'Das Integral muss bis $L$ gehen.', 'Es fehlt ein komplex konjugiertes $\\psi$.'], a:0, ex:'Ein Warnsignal ist die Einheit: $V_0L/4$ ist keine Energie, sondern Energie mal Länge.'},
      fix:{id:'a', prompt:'Berichtige und berechne $E_n^{(1)}$.', type:'value', target:'V_0/2', model:["E^(1) = ⟨ψ_n|H'|ψ_n⟩", '= 2/L V_0 ∫_0^{L/2} sin(nπx/L)^2 dx', '= 2/L V_0 · L/4', '= V_0/2']}}
  ]
});
lexe('stoerung-1', 'Störungstheorie: erste Ordnung', '$\\hat H = \\hat H_0 + \\hat H\'$, $\\hat H_0|n\\rangle = E_n^{(0)}|n\\rangle$ (nicht entartet). Energie: $E_n^{(1)} = \\langle n|\\hat H\'|n\\rangle$. Zustand: $|n^{(1)}\\rangle = \\sum_{m\\ne n}\\frac{\\langle m|\\hat H\'|n\\rangle}{E_n^{(0)} - E_m^{(0)}}|m\\rangle$. Eingabe: Störoperator `H\'`, z. B. `⟨ψ_n|H\'|ψ_n⟩`.', {topic:'stoer'});
lexe('stoerung-2', 'Störungstheorie: zweite Ordnung', '$E_n^{(2)} = \\sum_{m\\ne n}\\frac{|\\langle m|\\hat H\'|n\\rangle|^2}{E_n^{(0)} - E_m^{(0)}}$. Für den Grundzustand immer $\\le 0$ („Niveaus stoßen sich ab“). Gültig, solange $|\\langle m|\\hat H\'|n\\rangle| \\ll |E_n^{(0)} - E_m^{(0)}|$.', {topic:'stoer'});
lexe('entartete-stoerung', 'Entartete Störungstheorie', 'Ist $E^{(0)}$ $g$-fach entartet, bildet man die $g\\times g$-Matrix $W_{ij} = \\langle i|\\hat H\'|j\\rangle$ im entarteten Unterraum. Ihre Eigenwerte sind die Korrekturen erster Ordnung, ihre Eigenvektoren die „richtigen“ Zustände nullter Ordnung. Eingabe zum Beispiel `det(W - ε I) = 0`.', {topic:'stoer'});
lexe('variationsprinzip', 'Variationsprinzip', 'Für jeden normierten Zustand gilt $E_0 \\le \\langle\\psi|\\hat H|\\psi\\rangle$. Verfahren: Ansatz $\\psi_b$ mit Parameter(n) $b$, $\\langle H\\rangle(b)$ berechnen, $\\frac{d}{db}\\langle H\\rangle = 0$ lösen. Das Minimum ist eine obere Schranke für $E_0$, exakt nur, wenn der Ansatz den Grundzustand enthält.', {topic:'stoer'});
