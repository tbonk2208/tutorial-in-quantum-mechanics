/* ===== Mathe M6: Fourier-Reihen und Fourier-Transformation ===== */
(function(){
const PER = (defs, extra) => Object.assign({coords:['x'], params:{n:{int:[1, 6]}}, defs:defs || {}}, extra || {});
topic({
  id:'m-fourier', ch:'math', title:'Fourier-Reihen und Fourier-Transformation', short:'Fourier',
  src:'Boas Kap. 7 · Griffiths & Schroeter Kap. 2.4',
  goals:[
    'Ich kann die Fourier-Koeffizienten einer periodischen Funktion berechnen, gerade und ungerade Funktionen ausnutzen und die Parseval-Gleichung anwenden.',
    'Ich kann Fourier-Transformierte in der Konvention $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$ berechnen, besonders für Gauß- und Kastenfunktionen.',
    'Ich kann die Regeln Verschiebung ↔ Phase und Ableitung ↔ $ik$ anwenden und die Breitenbeziehung $\\Delta x\\,\\Delta k \\ge \\frac12$ deuten.'
  ],
  needs:'Euler-Formel und komplexe Exponentialfunktion (M1) · Gauß-Integrale mit quadratischer Ergänzung (M2) · Entwicklung nach Orthonormalsystemen (M5)',
  check:[
    {q:'Ist $f(x) = x^2\\cos x$ gerade, ungerade oder keins von beiden?', opts:['gerade', 'ungerade', 'keins von beiden'], a:0, ex:'$x^2$ und $\\cos x$ sind gerade, ihr Produkt also auch: $f(-x) = f(x)$.', lex:'fourier-reihe'},
    {q:'$e^{i\\pi}$ ist …', opts:['$-1$', '$1$', '$i$'], a:0, ex:'$\\cos\\pi + i\\sin\\pi = -1$. Allgemein $e^{in\\pi} = (-1)^n$.', lex:'euler', prev:'m-komplex'},
    {q:'$\\int_{-\\infty}^\\infty e^{-x^2/2}\\,dx$ ist …', opts:['$\\sqrt{2\\pi}$', '$\\sqrt{\\pi}$', '$2\\pi$'], a:0, ex:'$\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/2$.', lex:'integrale', prev:'m-analysis'},
    {q:'Für ganze Zahlen $m \\ne n$ ist $\\int_{-\\pi}^\\pi e^{-imx}e^{inx}\\,dx$ gleich …', opts:['$0$', '$2\\pi$', '$1$'], a:0, ex:'$\\int_{-\\pi}^\\pi e^{i(n-m)x}dx = 0$ für $n \\ne m$: Die $e^{inx}$ sind orthogonal. Für $n = m$ kommt $2\\pi$ heraus.', lex:'vollstaendigkeit', prev:'m-hilbert'}
  ],
  example:{
    title:'Fourier-Reihe der Rechteckschwingung',
    text:'$f(x) = \\operatorname{sgn}(x)$ auf $(-\\pi, \\pi)$, also $-1$ links und $+1$ rechts, wird $2\\pi$-periodisch fortgesetzt. Weil $f$ ungerade ist, verschwinden alle $a_n$. Bestimme $b_n = \\frac1\\pi\\int_{-\\pi}^\\pi f(x)\\sin(nx)\\,dx$ für $n = 1, 2, \\dots$',
    ctx:PER({'f(x)':'sgn(x)'}),
    lines:[
      {l:'b_n = 1/π ∫_-π^π f(x) sin(n x) dx', why:{q:'Warum steht hier $\\frac1\\pi$ und nicht $\\frac{1}{2\\pi}$?', opts:['$\\int_{-\\pi}^\\pi\\sin^2(nx)\\,dx = \\pi$; durch diese Norm wird geteilt.', 'Das ist eine reine Konvention ohne Grund.', 'Weil $f$ ungerade ist.'], a:0, ex:'Die Funktionen $\\sin(nx)$ sind orthogonal, aber nicht normiert. Der Koeffizient ist die Projektion geteilt durch $\\|\\sin nx\\|^2 = \\pi$ (vgl. M5).'}},
      {l:'= 2/π ∫_0^π sin(n x) dx', why:{q:'Warum darf man auf $[0, \\pi]$ integrieren und verdoppeln?', opts:['$f(x)\\sin(nx)$ ist gerade (ungerade mal ungerade).', 'Weil $f = 0$ für $x < 0$.', 'Weil $\\sin$ positiv ist.'], a:0, ex:'Für $x > 0$ ist $f = 1$; die linke Hälfte liefert denselben Beitrag noch einmal.'}},
      {l:'= 2/π [-cos(n x)/n]_0^π', why:{q:'Welche Stammfunktion steckt hier?', opts:['$\\int\\sin(nx)\\,dx = -\\cos(nx)/n$', '$\\int\\sin(nx)\\,dx = n\\cos(nx)$', '$\\int\\sin(nx)\\,dx = \\cos(nx)/n$'], a:0, ex:'Ableiten zur Probe: $\\frac{d}{dx}(-\\cos(nx)/n) = \\sin(nx)$.'}},
      {l:'= 2/(nπ) (1 - cos(nπ))', why:{q:'Wie fasst man $\\cos(n\\pi)$ zusammen?', opts:['$\\cos(n\\pi) = (-1)^n$', '$\\cos(n\\pi) = 0$', '$\\cos(n\\pi) = 1$'], a:0, ex:'$\\cos\\pi = -1$, $\\cos 2\\pi = 1$, …'}},
      {l:'= 2/(nπ) (1 - (-1)^n)', why:{q:'Wie sieht die Reihe damit aus?', opts:['$f(x) = \\frac4\\pi\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\dots\\right)$', '$f(x) = \\frac4\\pi\\sum_n\\sin(nx)$', '$f(x) = \\frac2\\pi\\sum_n\\cos(nx)/n$'], a:0, ex:'Für gerade $n$ ist $b_n = 0$, für ungerade $b_n = 4/(n\\pi)$. Die Koeffizienten fallen nur wie $1/n$ – typisch für eine Funktion mit Sprung.'}}
    ],
    faded:{id:'mf-fade', title:'Jetzt du: der Sägezahn $f(x) = x$', text:'$f(x) = x$ auf $(-\\pi, \\pi)$, $2\\pi$-periodisch fortgesetzt. Auch diese Funktion ist ungerade. Bestimme $b_n$ mit partieller Integration.',
      ctx:PER({'f(x)':'x'}),
      given:['b_n = 1/π ∫_-π^π x sin(n x) dx', '= 2/π ∫_0^π x sin(n x) dx'],
      goals:[{id:'a', prompt:'Bestimme $b_n$.', type:'value', target:'2 (-1)^(n+1)/n', points:3,
        hints:['Partiell integrieren mit $u = x$, $v\' = \\sin(nx)$, also $v = -\\cos(nx)/n$.', 'Das Restintegral $\\int_0^\\pi\\cos(nx)\\,dx$ ist null; der Randterm ist $-\\pi(-1)^n/n$.'],
        model:['b_n = 1/π ∫_-π^π x sin(n x) dx', '= 2/π ∫_0^π x sin(n x) dx', {l:'= 2/π ([-x cos(n x)/n]_0^π + 1/n ∫_0^π cos(n x) dx)', gap:'= 2/π ([▢]_0^π + 1/n ∫_0^π cos(n x) dx)'}, '= 2/π (-π (-1)^n/n + 0)', '= 2 (-1)^(n+1)/n'],
        mistakes:[{expr:'2 (-1)^n/n', msg:'Vorzeichen: Der Randterm ist $-\\pi\\cos(n\\pi)/n = -\\pi(-1)^n/n$, also $b_n = 2(-1)^{n+1}/n$.'}]}]}
  },
  puzzle:{
    title:'Eine einzige Wellenzahl',
    text:'Die ebene Welle $\\psi(x) = e^{ik_0x}$ erstreckt sich über die ganze $x$-Achse und hat genau eine Wellenzahl $k_0$.\n\nWas ist ihre Fourier-Transformierte $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int e^{ik_0x}e^{-ikx}dx$?',
    q:{q:'Deine Vermutung:', opts:['eine Gauß-Funktion um $k_0$', '$\\sqrt{2\\pi}\\,\\delta(k - k_0)$', '$\\varphi(k) = 1$ für alle $k$', 'Es gibt keine, auch nicht als Distribution.'], a:1, ex:'Als Distribution gilt $\\int_{-\\infty}^\\infty e^{i(k_0 - k)x}dx = 2\\pi\\,\\delta(k - k_0)$.'},
    reveal:'Im gewöhnlichen Sinn konvergiert das Integral tatsächlich nicht – $|e^{ik_0x}| = 1$ fällt nie ab. Als **Distribution** ist es aber wohldefiniert: $\\int e^{i(k_0-k)x}dx = 2\\pi\\,\\delta(k - k_0)$ (M2), also $\\varphi(k) = \\sqrt{2\\pi}\\,\\delta(k - k_0)$.\n\nDas ist der Grenzfall der Breitenbeziehung: unendlich ausgedehnt im Ort ($\\Delta x = \\infty$), scharf in $k$ ($\\Delta k = 0$). Umgekehrt hat $\\delta(x)$ die konstante Transformierte $1/\\sqrt{2\\pi}$. Beide sind nicht normierbar; physikalische Zustände sind Wellenpakete dazwischen (Thema 4).'
  },
  clarify:{
    core:'**Fourier-Reihe.** Eine $2\\pi$-periodische Funktion lässt sich nach dem vollständigen Orthogonalsystem $e^{inx}$ entwickeln:\n\n$$f(x) = \\sum_{n=-\\infty}^\\infty c_ne^{inx},\\quad c_n = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi f(x)e^{-inx}dx,\\qquad \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi|f|^2dx = \\sum_n|c_n|^2.$$\n\nReell: $f = \\frac{a_0}{2} + \\sum_{n\\ge1}(a_n\\cos nx + b_n\\sin nx)$ mit $a_n = \\frac1\\pi\\int f\\cos nx\\,dx$, $b_n = \\frac1\\pi\\int f\\sin nx\\,dx$. Gerade Funktionen haben nur $a_n$, ungerade nur $b_n$.\n\n**Fourier-Transformation** (für nicht periodische Funktionen auf $\\mathbb R$):\n\n$$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^\\infty\\psi(x)e^{-ikx}dx,\\qquad \\psi(x) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^\\infty\\varphi(k)e^{ikx}dk,\\qquad \\int|\\psi|^2dx = \\int|\\varphi|^2dk.$$\n\nWichtige Regeln: $\\psi(x - a) \\mapsto e^{-ika}\\varphi(k)$, $e^{ik_0x}\\psi(x) \\mapsto \\varphi(k - k_0)$, $\\psi\'(x) \\mapsto ik\\,\\varphi(k)$. Eine Gauß-Funktion geht in eine Gauß-Funktion über; je schmaler $\\psi$, desto breiter $\\varphi$, mit $\\Delta x\\,\\Delta k \\ge \\frac12$.',
    keys:[
      'Erst Symmetrie prüfen: Bei geraden oder ungeraden Funktionen fällt die Hälfte der Koeffizienten weg, und man integriert nur über $[0, \\pi]$.',
      'Entscheidend ist die $2\\pi$-periodische Fortsetzung: Ist sie glatt, fallen die Koeffizienten schnell ab. Ein Sprung – auch einer, der erst durch die Fortsetzung entsteht wie beim Sägezahn – gibt $1/n$, ein Knick $1/n^2$.',
      'Konvention beachten: Hier steht $\\frac{1}{\\sqrt{2\\pi}}$ symmetrisch in Hin- und Rücktransformation. Andere Bücher setzen $\\frac{1}{2\\pi}$ ganz auf eine Seite.',
      'Mit $p = \\hbar k$ ist $|\\varphi(k)|^2$ die Wahrscheinlichkeitsdichte der Wellenzahl; aus $\\Delta x\\,\\Delta k \\ge \\frac12$ wird $\\Delta x\\,\\Delta p \\ge \\frac\\hbar2$.',
      'Gauß-Integrale mit komplexem linearem Term: $\\int e^{-\\alpha x^2 + bx}dx = \\sqrt{\\pi/\\alpha}\\,e^{b^2/(4\\alpha)}$ gilt auch für $b = -ik$.'
    ],
    errors:[
      '$(-ik)^2 = +k^2$ rechnen. Richtig ist $(-ik)^2 = -k^2$, sonst wächst $\\varphi(k)$ für große $k$.',
      'Den Vorfaktor verwechseln: $\\frac1\\pi$ bei $a_n, b_n$, aber $\\frac{1}{2\\pi}$ bei $c_n$ und beim Mittelwert $a_0/2$.',
      'Bei der Verschiebung das Vorzeichen der Phase vertauschen: $\\psi(x - a) \\mapsto e^{-ika}\\varphi(k)$.',
      'Erwarten, dass die Fourier-Reihe an einer Sprungstelle den Funktionswert trifft: Sie liefert dort den Mittelwert, und ihre Teilsummen schwingen daneben über.'
    ],
    more:[{title:'Vom Ortsraum zum Impulsraum', text:'Setzt man $k = p/\\hbar$ und $\\tilde\\psi(p) = \\varphi(p/\\hbar)/\\sqrt\\hbar$ (der Faktor $1/\\sqrt\\hbar$ sorgt für $\\int|\\tilde\\psi|^2dp = 1$), wird die Transformation zu $\\tilde\\psi(p) = \\frac{1}{\\sqrt{2\\pi\\hbar}}\\int\\psi(x)e^{-ipx/\\hbar}dx$. Die Ableitungsregel $\\psi\' \\mapsto ik\\varphi$ bedeutet dann: Der Impulsoperator $-i\\hbar\\,d/dx$ wirkt im Impulsraum als Multiplikation mit $p$. Das ist der Grund, warum man freie Teilchen so bequem im $k$-Raum behandelt (Thema 4).'}],
    checks:[
      {q:'$f$ ist gerade und $2\\pi$-periodisch. Welche Koeffizienten sind null?', opts:['alle $b_n$', 'alle $a_n$', 'keine'], a:0, ex:'$f(x)\\sin(nx)$ ist dann ungerade und integriert sich über $[-\\pi, \\pi]$ zu null.'},
      {q:'$\\psi(x)$ hat die Transformierte $\\varphi(k)$. Was ist die Transformierte von $\\psi(x - 3)$?', opts:['$e^{-3ik}\\varphi(k)$', '$\\varphi(k - 3)$', '$e^{3ik}\\varphi(k)$'], a:0, ex:'Substitution $u = x - 3$: $\\int\\psi(u)e^{-ik(u+3)}du = e^{-3ik}\\sqrt{2\\pi}\\varphi(k)$. $|\\varphi|^2$ ändert sich nicht.'}
    ]
  },
  lab:{type:'fourier', title:'Teilsummen und Breiten',
    text:'**Modus „Fourier-Reihe“:** Wähle eine $2\\pi$-periodische Funktion (Rechteck, Sägezahn oder Dreieck) auf $[-\\pi, \\pi]$ und mit dem Regler „höchste Ordnung $N$“ ($1$ bis $40$) die Teilsumme bis $n = N$. Beim Rechteck und beim Dreieck tragen nur ungerade $n$ bei. Beim Rechteck und beim Sägezahn zeigt die Anzeige das Überschwingen an der Sprungstelle; beim Sägezahn nähert es sich langsamer dem Grenzwert von etwa 9 %, bei kleinem $N$ liegt das Maximum sogar noch unter $\\pi$.\n\n**Modus „Fourier-Transformation (Gauß)“:** $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}$ mit $\\sigma$ zwischen $0{,}3$ und $3$. Gezeichnet sind $|\\psi(x)|^2$ und $|\\varphi(k)|^2$, angezeigt $\\Delta x = \\sigma$, $\\Delta k = 1/(2\\sigma)$ und ihr Produkt.',
    questions:[
      {q:'Modus „Fourier-Reihe“, Rechteck. Erhöhe $N$ von $5$ auf $40$. Was passiert mit dem Überschwinger neben der Sprungstelle?', opts:['Er wird schmaler, bleibt aber etwa 9 % der Sprunghöhe hoch.', 'Er verschwindet allmählich.', 'Er wird immer höher.'], a:0, ex:'Das ist das Gibbs-Phänomen. Die Reihe konvergiert trotzdem im quadratischen Mittel, weil die Fläche unter dem Überschwinger gegen null geht.'},
      {q:'Modus „Fourier-Transformation (Gauß)“: Stelle $\\sigma = 2$ ein und dann $\\sigma = 1$. Was passiert mit $\\Delta k$?', opts:['Es verdoppelt sich von $0{,}25$ auf $0{,}5$; das Produkt bleibt $\\frac12$.', 'Es halbiert sich.', 'Es bleibt gleich.'], a:0, ex:'$\\Delta k = 1/(2\\sigma)$. Die Gauß-Funktion ist die Funktion mit minimalem Produkt $\\Delta x\\,\\Delta k = \\frac12$.'}
    ],
    noPic:{q:'Ohne Bild: Das Dreieck $|x|$ ist stetig mit Knicken, das Rechteck springt. Wessen Fourier-Koeffizienten fallen schneller ab?', opts:['die des Dreiecks, wie $1/n^2$', 'die des Rechtecks, wie $1/n^2$', 'beide gleich schnell'], a:0, ex:'Beim Rechteck ist $b_n \\propto 1/n$, beim Dreieck $a_n \\propto 1/n^2$. Je glatter die periodisch fortgesetzte Funktion, desto schneller fallen die Koeffizienten.'}},
  compare:{
    text:'Gesucht ist die Fourier-Transformierte von $\\psi(x) = e^{-(x - a)^2/2}$ mit reellem $a$. Bekannt ist $g(k) = e^{-k^2/2}$ als Transformierte von $e^{-x^2/2}$. In der Eingabe heißen die beiden Transformierten `φ(k)` und `g(k)`.',
    ctx:{coords:['k'], params:{a:'real'}, defs:{'φ(k)':'e^(-i k a) e^(-k^2/2)', 'g(k)':'e^(-k^2/2)'}},
    A:{name:'Substituieren', model:['φ(k) = 1/sqrt(2π) ∫_-∞^∞ e^(-(x - a)^2/2) e^(-ikx) dx', {l:'= 1/sqrt(2π) ∫_-∞^∞ e^(-u^2/2) e^(-ik(u + a)) du', w:'u = x − a'}, '= e^(-ika) · 1/sqrt(2π) ∫_-∞^∞ e^(-u^2/2) e^(-iku) du', '= e^(-ika) e^(-k^2/2)']},
    B:{name:'Verschiebungsregel', model:[{l:'φ(k) = e^(-ika) g(k)', w:'ψ(x − a) ↦ e^(−ika) · (Transformierte von ψ)'}, '= e^(-ika) e^(-k^2/2)']},
    questions:[
      {q:'Was ändert die Verschiebung an $|\\varphi(k)|^2$?', opts:['nichts – nur eine Phase kommt hinzu', '$|\\varphi|^2$ verschiebt sich um $a$', '$|\\varphi|^2$ wird breiter'], a:0, ex:'$|e^{-ika}| = 1$. Ein verschobenes Wellenpaket hat dieselbe Impulsverteilung.'},
      {q:'Welche Regel gilt umgekehrt für $e^{ik_0x}e^{-x^2/2}$?', opts:['$g(k - k_0)$: Die $k$-Verteilung verschiebt sich um $k_0$.', '$e^{ik_0k}g(k)$', '$g(k + k_0)$'], a:0, ex:'Eine Phase $e^{ik_0x}$ im Ort verschiebt im $k$-Raum – so gibt man einem Wellenpaket den mittleren Impuls $\\hbar k_0$.'}
    ]
  },
  practice:[
    {id:'mf-p1', title:'Fourier-Reihe der Dreiecksfunktion',
      text:'$f(x) = |x|$ auf $(-\\pi, \\pi)$, $2\\pi$-periodisch fortgesetzt. $f$ ist gerade.',
      ctx:PER({'f(x)':'|x|'}),
      goals:[
        {id:'a', prompt:'a) Berechne den Mittelwert $\\frac{a_0}{2} = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi f(x)\\,dx$.', type:'value', target:'π/2', points:1,
          model:['1/(2π) ∫_-π^π |x| dx = 1/π ∫_0^π x dx', '= 1/π · π^2/2', '= π/2']},
        {id:'b', prompt:'b) Berechne $a_n = \\frac1\\pi\\int_{-\\pi}^\\pi |x|\\cos(nx)\\,dx$ für $n \\ge 1$.', type:'value', target:'2((-1)^n - 1)/(π n^2)', points:3, ph:'a_n = 2/π ∫_0^π x cos(n x) dx',
          hints:['Der Integrand ist gerade: $a_n = \\frac2\\pi\\int_0^\\pi x\\cos(nx)\\,dx$.', 'Partiell: $\\int_0^\\pi x\\cos(nx)\\,dx = \\left[\\frac{x\\sin nx}{n}\\right]_0^\\pi - \\frac1n\\int_0^\\pi\\sin(nx)\\,dx$.'],
          model:['a_n = 1/π ∫_-π^π |x| cos(n x) dx', '= 2/π ∫_0^π x cos(n x) dx', '= 2/π ([x sin(n x)/n]_0^π - 1/n ∫_0^π sin(n x) dx)', '= 2/π (0 + [cos(n x)/n^2]_0^π)', '= 2((-1)^n - 1)/(π n^2)'],
          mistakes:[{expr:'((-1)^n - 1)/(π n^2)', msg:'Es fehlt der Faktor 2 aus der Symmetrie: $\\int_{-\\pi}^\\pi = 2\\int_0^\\pi$ für gerade Integranden.'}, {expr:'2(1 - (-1)^n)/(π n^2)', msg:'Vorzeichen: $\\left[\\cos(nx)/n^2\\right]_0^\\pi = ((-1)^n - 1)/n^2$.'}],
          note:'Für ungerade $n$ ist $a_n = -4/(\\pi n^2)$: $|x| = \\frac\\pi2 - \\frac4\\pi\\left(\\cos x + \\frac{\\cos 3x}{9} + \\dots\\right)$.'},
        {id:'c', prompt:'c) Bestimme $b_n = \\frac1\\pi\\int_{-\\pi}^\\pi|x|\\sin(nx)\\,dx$.', type:'value', target:'0', points:1,
          model:['b_n = 1/π ∫_-π^π |x| sin(n x) dx', {l:'= 0', w:'Integrand ungerade'}]}
      ]},
    {id:'mf-p2', title:'Komplexe Koeffizienten und Parseval',
      text:'Die Rechteckschwingung $f(x) = \\operatorname{sgn}(x)$ auf $(-\\pi, \\pi)$ aus dem Beispiel, jetzt komplex entwickelt: $f = \\sum_n c_ne^{inx}$.',
      ctx:PER({'f(x)':'sgn(x)'}),
      goals:[
        {id:'a', prompt:'a) Berechne $c_n = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi f(x)e^{-inx}dx$ für $n \\ge 1$.', type:'value', target:'(1 - (-1)^n)/(i π n)', points:3, ph:'c_n = 1/(2π) (∫_0^π e^(-i n x) dx - ∫_-π^0 e^(-i n x) dx)',
          hints:['Teile das Integral bei $x = 0$: rechts $f = 1$, links $f = -1$.', '$\\int_0^\\pi e^{-inx}dx = \\frac{1 - e^{-in\\pi}}{in}$ und $e^{\\pm in\\pi} = (-1)^n$.'],
          model:['c_n = 1/(2π) ∫_-π^π f(x) e^(-i n x) dx', '= 1/(2π) (∫_0^π e^(-i n x) dx - ∫_-π^0 e^(-i n x) dx)', '= 1/(2π) ((1 - e^(-i n π))/(i n) - (e^(i n π) - 1)/(i n))', '= (1 - (-1)^n)/(i π n)'],
          mistakes:[{expr:'2/(i π n)', msg:'Das gilt nur für ungerade $n$; für gerade $n$ ist $c_n = 0$. Beides zusammen: $(1 - (-1)^n)/(i\\pi n)$.'}, {expr:'(1 - (-1)^n)/(2 i π n)', msg:'Prüfe die Summe der beiden Hälften: Jede liefert $(1 - (-1)^n)/(in)$, zusammen das Doppelte.'}],
          note:'Vergleich mit dem Beispiel: $b_n = i(c_n - c_{-n}) = 2(1 - (-1)^n)/(n\\pi)$ ✓'},
        {id:'b', prompt:'b) Berechne die linke Seite der Parseval-Gleichung, $\\frac{1}{2\\pi}\\int_{-\\pi}^\\pi|f|^2dx$.', type:'value', target:'1', points:1,
          model:['1/(2π) ∫_-π^π |f(x)|^2 dx = 1/(2π) · 2π', '= 1']},
        {id:'c', prompt:'c) Es ist $c_1 = -2i/\\pi$ und $c_{-1} = 2i/\\pi$. Welchen Anteil der Summe $\\sum|c_n|^2 = 1$ trägt die Grundschwingung, also $|c_1|^2 + |c_{-1}|^2$?', type:'value', target:'8/π^2', points:2,
          model:['|-2i/π|^2 + |2i/π|^2 = 4/π^2 + 4/π^2', '= 8/π^2'],
          note:'$8/\\pi^2 \\approx 0{,}81$: Schon die Grundschwingung trägt 81 %. Die restlichen 19 % verteilen sich auf $n = \\pm3, \\pm5, \\dots$'}
      ]},
    {id:'mf-p3', title:'Gauß-Paket im $k$-Raum',
      text:'$\\psi(x) = (2\\pi\\sigma^2)^{-1/4}\\,e^{-x^2/(4\\sigma^2)}$ ist normiert und hat $\\Delta x = \\sigma$. Nützlich: $\\int e^{-\\alpha x^2 + bx}dx = \\sqrt{\\pi/\\alpha}\\,e^{b^2/(4\\alpha)}$ und $\\int k^2e^{-\\beta k^2}dk = \\frac{1}{2\\beta}\\sqrt{\\pi/\\beta}$. In der Eingabe heißt die Transformierte `φ(k)`.',
      ctx:{coords:['k'], params:{σ:'pos'}, defs:{'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'(2σ^2/π)^(1/4) e^(-σ^2 k^2)', points:3, ph:'φ(k) = 1/sqrt(2π) (2π σ^2)^(-1/4) ∫_-∞^∞ e^(-x^2/(4σ^2) - i k x) dx',
          hints:['Hier ist $\\alpha = 1/(4\\sigma^2)$ und $b = -ik$.', '$b^2/(4\\alpha) = (-ik)^2\\sigma^2 = -\\sigma^2k^2$ und $\\sqrt{\\pi/\\alpha} = \\sqrt{4\\pi\\sigma^2}$.'],
          model:['φ(k) = 1/sqrt(2π) (2π σ^2)^(-1/4) ∫_-∞^∞ e^(-x^2/(4σ^2) - i k x) dx', {l:'= 1/sqrt(2π) (2π σ^2)^(-1/4) sqrt(4π σ^2) e^(-σ^2 k^2)', w:'α = 1/(4σ²), b = −ik'}, '= (2σ^2/π)^(1/4) e^(-σ^2 k^2)'],
          mistakes:[{expr:'(2σ^2/π)^(1/4) e^(σ^2 k^2)', msg:'Vorzeichen: $(-ik)^2 = -k^2$. Eine Transformierte, die für große $k$ wächst, kann nicht stimmen.'}]},
        {id:'b', prompt:'b) Berechne $(\\Delta k)^2 = \\int k^2|\\varphi(k)|^2dk$ (es gilt $\\langle k\\rangle = 0$).', type:'value', target:'1/(4σ^2)', points:2, ph:'∫_-∞^∞ k^2 |φ(k)|^2 dk = ',
          hints:['$|\\varphi(k)|^2 = \\sqrt{2\\sigma^2/\\pi}\\,e^{-2\\sigma^2k^2}$, also $\\beta = 2\\sigma^2$.'],
          model:['∫_-∞^∞ k^2 |φ(k)|^2 dk = sqrt(2σ^2/π) ∫_-∞^∞ k^2 e^(-2σ^2 k^2) dk', '= sqrt(2σ^2/π) · 1/(4σ^2) sqrt(π/(2σ^2))', '= 1/(4σ^2)'],
          note:'Also $\\Delta k = 1/(2\\sigma)$ und $\\Delta x\\,\\Delta k = \\frac12$ – das Minimum. Mit $p = \\hbar k$: $\\Delta x\\,\\Delta p = \\hbar/2$.'},
        {id:'c', prompt:'c) Prüfe Plancherel: Berechne $\\int|\\varphi(k)|^2dk$.', type:'value', target:'1', points:1,
          model:['∫_-∞^∞ |φ(k)|^2 dk = sqrt(2σ^2/π) ∫_-∞^∞ e^(-2σ^2 k^2) dk', '= sqrt(2σ^2/π) sqrt(π/(2σ^2))', '= 1']}
      ]},
    {id:'mf-p4', title:'Fourier-Transformierte eines Kastens',
      text:'$\\psi(x) = 1/\\sqrt a$ für $|x| < a/2$, sonst $0$. Berechne $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$. Bei Auswertungsklammern mit zwei Variablen schreibst du die Variable dazu: `[…]_{x=-a/2}^{a/2}`.',
      ctx:{coords:['k', 'x'], params:{a:'pos'}, defs:{'φ(k)':'1/sqrt(2π a) ∫_{-a/2}^{a/2} e^(-i k x) dx'}},
      goals:[
        {id:'a', prompt:'a) Bestimme $\\varphi(k)$ für $k \\ne 0$.', type:'value', target:'sqrt(2/(π a)) sin(k a/2)/k', points:3, ph:'φ(k) = 1/sqrt(2π a) ∫_{-a/2}^{a/2} e^(-ikx) dx',
          hints:['Stammfunktion von $e^{-ikx}$ ist $e^{-ikx}/(-ik)$.', '$e^{iu} - e^{-iu} = 2i\\sin u$.'],
          model:['φ(k) = 1/sqrt(2π a) ∫_{-a/2}^{a/2} e^(-ikx) dx', '= 1/sqrt(2π a) [e^(-ikx)/(-ik)]_{x=-a/2}^{a/2}', '= 1/sqrt(2π a) · 2 sin(k a/2)/k', '= sqrt(2/(π a)) sin(k a/2)/k'],
          mistakes:[{expr:'sqrt(2/(π a)) sin(k a)/k', msg:'Die Grenzen sind $\\pm a/2$: Im Sinus steht $ka/2$.'}]},
        {id:'b', prompt:'b) Berechne $\\varphi(0)$.', type:'value', target:'sqrt(a/(2π))', points:1,
          model:['φ(0) = 1/sqrt(2π a) ∫_{-a/2}^{a/2} 1 dx', '= a/sqrt(2π a)', '= sqrt(a/(2π))'],
          note:'Die ersten Nullstellen liegen bei $k = \\pm2\\pi/a$. Je schmaler der Kasten, desto breiter das Hauptmaximum von $\\varphi(k)$ – schon das ist die Orts-Impuls-Unschärfe. Die Standardabweichung $\\Delta k$ ist beim Kasten sogar unendlich, weil $|\\varphi|^2 \\propto 1/k^2$ zu langsam abfällt.'}
      ]},
    {id:'mf-p5', title:'Die Ableitungsregel',
      text:'$\\psi(x)$ ist eine glatte Funktion, die für $|x| \\to \\infty$ schnell gegen null geht, mit Transformierter $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$ (in der Eingabe `φ(k)`). Auswertungsklammern: `[…]_{x=-∞}^∞`.',
      ctx:{coords:['k', 'x'], params:{}, abstract:{ψ:{args:['x']}}, defs:{'φ(k)':'1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-i k x) dx'}},
      goals:[{id:'a', prompt:'Zeige: Die Transformierte von $\\psi\'$ ist $ik\\,\\varphi(k)$.', type:'show', from:'1/sqrt(2π) ∫_-∞^∞ ψ\'(x) e^(-ikx) dx', to:'i k φ(k)', points:3,
        hints:['Partiell integrieren mit $u = e^{-ikx}$ und $v\' = \\psi\'$.', 'Der Randterm $[\\psi e^{-ikx}]_{-\\infty}^\\infty$ verschwindet, weil $\\psi \\to 0$.'],
        model:['1/sqrt(2π) ∫_-∞^∞ ψ\'(x) e^(-ikx) dx = 1/sqrt(2π) [ψ(x) e^(-ikx)]_{x=-∞}^∞ - 1/sqrt(2π) ∫_-∞^∞ ψ(x) (-ik) e^(-ikx) dx', {l:'= ik/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-ikx) dx', w:'ψ → 0 für |x| → ∞'}, '= i k φ(k)'],
        note:'Mit $\\hat p = -i\\hbar\\,d/dx$ folgt: $\\hat p\\psi \\mapsto \\hbar k\\,\\varphi(k)$. Im $k$-Raum ist der Impuls einfach ein Faktor.'}]}
  ],
  final:[
    {q:'Eine $2\\pi$-periodische Funktion ist ungerade. Welche Koeffizienten können von null verschieden sein?', opts:['nur die $b_n$ (Sinusterme)', 'nur die $a_n$ (Kosinusterme)', 'nur $a_0$'], a:0, ex:'Ungerade mal $\\cos$ ist ungerade und integriert sich zu null; ungerade mal $\\sin$ ist gerade.'},
    {task:{id:'mf-f1', title:'Exponentiell abfallende Funktion', text:'$\\psi(x) = e^{-|x|}$. In der Eingabe heißt die Transformierte `φ(k)`.',
      ctx:{coords:['k'], params:{}, defs:{'φ(k)':'sqrt(2/π)/(1 + k^2)'}},
      goals:[{id:'a', prompt:'Bestimme $\\varphi(k)$.', type:'value', target:'sqrt(2/π)/(1 + k^2)', points:3,
        hints:['Teile bei $x = 0$: $\\int_{-\\infty}^0 e^{(1-ik)x}dx = \\frac{1}{1-ik}$ und $\\int_0^\\infty e^{-(1+ik)x}dx = \\frac{1}{1+ik}$.'],
        model:['φ(k) = 1/sqrt(2π) (∫_-∞^0 e^((1 - ik)x) dx + ∫_0^∞ e^(-(1 + ik)x) dx)', '= 1/sqrt(2π) (1/(1 - ik) + 1/(1 + ik))', '= sqrt(2/π)/(1 + k^2)']}]}},
    {q:'$\\psi(x)$ wird doppelt so breit: $\\psi(x) \\to \\psi(x/2)$. Was passiert mit $\\varphi(k)$?', opts:['Es wird halb so breit und doppelt so hoch: $2\\varphi(2k)$.', 'Es wird ebenfalls doppelt so breit.', 'Es ändert sich nicht.'], a:0, ex:'Substitution $x = 2u$: $\\frac{1}{\\sqrt{2\\pi}}\\int\\psi(u)e^{-i(2k)u}\\,2\\,du = 2\\varphi(2k)$.'},
    {task:{id:'mf-f2', title:'Paket mit mittlerer Wellenzahl', text:'Bekannt: $e^{-x^2/2}$ hat die Transformierte $e^{-k^2/2}$. Jetzt ist $\\psi(x) = e^{-x^2/2}\\,e^{ik_0x}$ mit reellem $k_0$; die Transformierte heißt in der Eingabe `φ(k)`.',
      ctx:{coords:['k'], params:{k_0:'real'}, defs:{'φ(k)':'e^(-(k - k_0)^2/2)'}},
      goals:[{id:'a', prompt:'Bestimme $\\varphi(k)$.', type:'value', target:'e^(-(k - k_0)^2/2)', points:2,
        model:['φ(k) = 1/sqrt(2π) ∫_-∞^∞ e^(-x^2/2) e^(-i(k - k_0)x) dx', '= e^(-(k - k_0)^2/2)'],
        mistakes:[{expr:'e^(-(k + k_0)^2/2)', msg:'Die Phase $e^{ik_0x}$ verschiebt nach $k_0$: Im Exponenten steht $-i(k - k_0)x$.'}]}]}}
  ],
  errors:[
    {id:'mf-e1', title:'Vorzeichenfehler bei der Gauß-Transformation',
      text:'Gesucht ist $\\varphi(k)$ für $\\psi(x) = e^{-x^2/2}$. So wurde gerechnet:',
      ctx:{coords:['k'], params:{}, defs:{'φ(k)':'e^(-k^2/2)'}},
      lines:['φ(k) = 1/sqrt(2π) ∫_-∞^∞ e^(-x^2/2) e^(-ikx) dx', '= 1/sqrt(2π) · sqrt(2π) e^((-ik)^2/2)', '= e^(k^2/2)'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$(-ik)^2 = i^2k^2 = -k^2$, nicht $+k^2$.', 'Der Vorfaktor $1/\\sqrt{2\\pi}$ fehlt.', 'Gauß-Integrale gelten nicht für komplexe Exponenten.'], a:0, ex:'Richtig ist $e^{-k^2/2}$. Ein $\\varphi(k)$, das für große $k$ wächst, wäre nicht einmal normierbar – im Widerspruch zu Plancherel.'},
      fix:{id:'a', prompt:'Berichtige: Bestimme $\\varphi(k)$.', type:'value', target:'e^(-k^2/2)', model:['φ(k) = 1/sqrt(2π) · sqrt(2π) e^((-ik)^2/2)', '= e^(-k^2/2)']}},
    {id:'mf-e2', title:'Falscher Vorfaktor beim Fourier-Koeffizienten',
      text:'Für die Rechteckschwingung $\\operatorname{sgn}(x)$ auf $(-\\pi, \\pi)$ soll $b_n$ bestimmt werden. In der Eingabe ist `b_n` der richtige Koeffizient. So wurde gerechnet:',
      ctx:PER({'b_n':'1/π ∫_-π^π sgn(x) sin(n x) dx'}),
      lines:['b_n = 1/(2π) ∫_-π^π sgn(x) sin(n x) dx', '= 1/π ∫_0^π sin(n x) dx', '= (1 - (-1)^n)/(nπ)'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['Für $a_n$ und $b_n$ steht $\\frac1\\pi$ davor, weil $\\int_{-\\pi}^\\pi\\sin^2(nx)\\,dx = \\pi$.', 'Die Grenzen müssen $0$ bis $2\\pi$ sein.', 'Es müsste $\\cos(nx)$ statt $\\sin(nx)$ stehen.'], a:0, ex:'$\\frac{1}{2\\pi}$ gehört zu den komplexen $c_n$ und zum Mittelwert $a_0/2$. Kontrolle: Mit dem halben $b_n$ ergäbe Parseval nur ein Viertel von $\\frac1\\pi\\int|f|^2dx = 2$.'},
      fix:{id:'a', prompt:'Berichtige: Bestimme $b_n$.', type:'value', target:'2(1 - (-1)^n)/(nπ)', model:['b_n = 1/π ∫_-π^π sgn(x) sin(n x) dx', '= 2/π ∫_0^π sin(n x) dx', '= 2(1 - (-1)^n)/(nπ)']}}
  ]
});
lexe('fourier-reihe', 'Fourier-Reihe', 'Für $2\\pi$-periodisches $f$: $f(x) = \\frac{a_0}{2} + \\sum_{n\\ge1}(a_n\\cos nx + b_n\\sin nx)$ mit $a_n = \\frac1\\pi\\int_{-\\pi}^\\pi f\\cos nx\\,dx$, $b_n = \\frac1\\pi\\int_{-\\pi}^\\pi f\\sin nx\\,dx$. Komplex: $f = \\sum_{n\\in\\mathbb Z}c_ne^{inx}$ mit $c_n = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi fe^{-inx}dx$. Gerades $f$: nur $a_n$; ungerades $f$: nur $b_n$. Für Periode $L$ ersetzt man $nx$ durch $2\\pi nx/L$ und die Vorfaktoren durch $2/L$ bzw. $1/L$.', {topic:'m-fourier'});
lexe('gibbs', 'Gibbs-Phänomen', 'Neben einer Sprungstelle schwingt jede Teilsumme der Fourier-Reihe über, um etwa 9 % der Sprunghöhe. Mit wachsender Termzahl wird der Überschwinger schmaler, aber nicht niedriger. Die Reihe konvergiert trotzdem im quadratischen Mittel; an der Sprungstelle selbst liefert sie den Mittelwert aus links- und rechtsseitigem Grenzwert.', {topic:'m-fourier'});
lexe('parseval', 'Parseval und Plancherel', 'Fourier-Reihe: $\\frac{1}{2\\pi}\\int_{-\\pi}^\\pi|f|^2dx = \\sum_n|c_n|^2 = \\frac{|a_0|^2}{4} + \\frac12\\sum_{n\\ge1}(|a_n|^2 + |b_n|^2)$. Fourier-Transformation mit symmetrischer Konvention: $\\int|\\psi(x)|^2dx = \\int|\\varphi(k)|^2dk$ (Plancherel). Eine normierte Wellenfunktion hat also eine normierte Transformierte. Allgemein für Orthonormalsysteme: siehe Vollständigkeit.', {topic:'m-fourier'});
lexe('fourier-regeln', 'Rechenregeln der Fourier-Transformation', 'Mit $\\psi(x) \\mapsto \\varphi(k)$: Verschiebung $\\psi(x - a) \\mapsto e^{-ika}\\varphi(k)$; Phase $e^{ik_0x}\\psi(x) \\mapsto \\varphi(k - k_0)$; Ableitung $\\psi\'(x) \\mapsto ik\\,\\varphi(k)$; Streckung $\\psi(x/s) \\mapsto |s|\\,\\varphi(sk)$; $\\delta(x) \\mapsto 1/\\sqrt{2\\pi}$ und $e^{ik_0x} \\mapsto \\sqrt{2\\pi}\\,\\delta(k - k_0)$; Gauß $e^{-x^2/(2s^2)} \\mapsto s\\,e^{-s^2k^2/2}$. Breiten: $\\Delta x\\,\\Delta k \\ge \\frac12$, Gleichheit nur für Gauß-Funktionen.', {topic:'m-fourier'});
})();
