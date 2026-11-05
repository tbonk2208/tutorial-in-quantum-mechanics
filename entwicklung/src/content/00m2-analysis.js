/* ===== Mathe M2: Reihen, Integrale und δ-Distribution ===== */
topic({
  id:'m-analysis', ch:'math', title:'Reihen, Integrale und δ-Distribution', short:'Reihen und Integrale',
  src:'Boas Kap. 1 (Reihen), Abschn. 8.11 (δ-Funktion), Kap. 11 (Gammafunktion)',
  goals:[
    'Ich kann Funktionen durch Taylor-Reihen nähern und geometrische Reihen summieren.',
    'Ich kann Gauß-Integrale, $\\int_0^\\infty x^ne^{-x}dx = n!$ und partielle Integration mit Randtermen sicher anwenden.',
    'Ich kann mit der δ-Distribution rechnen: $\\int\\delta(x - a)f(x)\\,dx = f(a)$ und $\\delta(cx) = \\delta(x)/|c|$.'
  ],
  needs:'Ableiten und Integrieren elementarer Funktionen · Substitution · komplexe Zahlen (M1)',
  check:[
    {q:'$\\frac{d}{dx}\\left(x\\,e^{-x}\\right)$ ist …', opts:['$(1 - x)\\,e^{-x}$', '$-e^{-x}$', '$e^{-x} - x$'], a:0, ex:'Produktregel: $1\\cdot e^{-x} + x\\cdot(-e^{-x})$. Die partielle Integration ist die integrierte Produktregel.', lex:'partielle-integration'},
    {q:'$\\int_{-\\infty}^\\infty e^{-x^2}\\,dx$ ist …', opts:['$\\sqrt{\\pi}$', '$\\pi$', '$1$'], a:0, ex:'Das Gauß-Integral: $\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, hier $\\alpha = 1$.', lex:'gauss-integral'},
    {q:'Für kleines $x$ ist $e^x$ ungefähr …', opts:['$1 + x$', '$x$', '$1 - x$'], a:0, ex:'Die Tangente an $e^x$ bei $x = 0$ hat Achsenabschnitt $1$ und Steigung $1$.', lex:'taylor'},
    {q:'$\\int_{-1}^{1} x^3\\,dx$ ist …', opts:['$0$', '$1/2$', '$-1/2$'], a:0, ex:'Ein ungerader Integrand über ein symmetrisches Intervall ergibt null: Die Flächen links und rechts heben sich auf.', lex:'integrale'}
  ],
  example:{
    title:'Gauß-Integral mit quadratischer Ergänzung',
    text:'Berechne $\\int_{-\\infty}^{\\infty} e^{-\\alpha x^2 + bx}\\,dx$ für $\\alpha > 0$ und reelles $b$. Dieses Integral kommt bei Wellenpaketen und Fourier-Transformationen ständig vor.',
    ctx:CTX.line({params:{α:'pos', b:'real', m:'pos'}}),
    lines:[
      {l:'∫_-∞^∞ e^(-α x^2 + b x) dx = ∫_-∞^∞ e^(-α (x - b/(2α))^2 + b^2/(4α)) dx', why:{q:'Was passiert im Exponenten?', opts:['Quadratische Ergänzung: $-\\alpha x^2 + bx = -\\alpha(x - \\frac{b}{2\\alpha})^2 + \\frac{b^2}{4\\alpha}$', 'Der Exponent wird abgeleitet.', 'Man setzt $x = 0$ ein.'], a:0, ex:'Ausmultiplizieren der rechten Seite gibt wieder $-\\alpha x^2 + bx$.'}},
      {l:'= e^(b^2/(4α)) ∫_-∞^∞ e^(-α (x - b/(2α))^2) dx', why:{q:'Warum darf $e^{b^2/(4\\alpha)}$ vor das Integral?', opts:['Der Faktor hängt nicht von $x$ ab.', 'Weil er klein ist.', 'Weil $b$ reell ist.'], a:0, ex:'$e^{u+v} = e^u e^v$, und konstante Faktoren zieht man heraus.'}},
      {l:'= e^(b^2/(4α)) ∫_-∞^∞ e^(-α u^2) du', w:'u = x − b/(2α)', why:{q:'Warum ändern sich die Grenzen nicht?', opts:['Eine Verschiebung bildet $(-\\infty, \\infty)$ auf sich ab.', 'Grenzen ändern sich bei Substitution nie.', 'Weil $du = 2dx$.'], a:0, ex:'Mit $u = x - c$ ist $du = dx$, und $\\pm\\infty$ bleibt $\\pm\\infty$.'}},
      {l:'= sqrt(π/α) e^(b^2/(4α))', why:{q:'Welche Formel wird benutzt?', opts:['$\\int_{-\\infty}^\\infty e^{-\\alpha u^2}du = \\sqrt{\\pi/\\alpha}$', '$\\int e^{-\\alpha u}du = 1/\\alpha$', '$\\int u\\,e^{-\\alpha u^2}du = 0$'], a:0, ex:'Das Gauß-Integral. Die Formel gilt auch für komplexes $b$ – das nutzt die Lückenaufgabe. Dann verschiebt $u = x - b/(2\\alpha)$ den Integrationsweg in die komplexe Ebene; nach dem Cauchy\'schen Integralsatz ändert das den Wert nicht, weil $e^{-\\alpha x^2}$ an den Enden verschwindet.'}}
    ],
    faded:{id:'ma-fade', title:'Jetzt du: Gauß-Funktion mal Kosinus',
      text:'Berechne $I = \\int_{-\\infty}^\\infty e^{-x^2/2}\\cos(kx)\\,dx$ für reelles $k$. Weil $e^{-x^2/2}$ reell ist, gilt $I = \\operatorname{Re}\\int e^{-x^2/2 + ikx}dx$. Benutze die Formel aus dem Beispiel mit $\\alpha = 1/2$ und $b = ik$.',
      ctx:{coords:['x'], params:{k:'real'}},
      given:['I = ∫_-∞^∞ e^(-x^2/2) cos(k x) dx', '= Re(∫_-∞^∞ e^(-x^2/2 + i k x) dx)'],
      goals:[{id:'a', prompt:'Bestimme $I$.', type:'value', target:'sqrt(2π) e^(-k^2/2)', points:2, hints:['$\\sqrt{\\pi/\\alpha} = \\sqrt{2\\pi}$.', '$b^2/(4\\alpha) = (ik)^2/2 = -k^2/2$.'],
        model:['I = ∫_-∞^∞ e^(-x^2/2) cos(k x) dx', '= Re(∫_-∞^∞ e^(-x^2/2 + i k x) dx)', {l:'= Re(sqrt(2π) e^((ik)^2/2))', gap:'= Re(sqrt(2π) e^(▢))'}, '= sqrt(2π) e^(-k^2/2)'],
        mistakes:[{expr:'sqrt(2π) e^(k^2/2)', msg:'Vorzeichen: $(ik)^2 = i^2k^2 = -k^2$.'}, {expr:'sqrt(π/2) e^(-k^2/2)', msg:'Prüfe $\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/2$: $\\sqrt{\\pi/(1/2)} = \\sqrt{2\\pi}$.'}]}]}
  },
  puzzle:{
    title:'Immer schmaler, immer höher',
    text:'Ein Rechteck $\\delta_\\varepsilon(x)$ hat die Breite $2\\varepsilon$ um $x = 0$ und die Höhe $1/(2\\varepsilon)$. Seine Fläche ist also immer 1.\n\nWas passiert mit $\\int_{-\\infty}^{\\infty}\\delta_\\varepsilon(x)\\cos x\\,dx$, wenn $\\varepsilon \\to 0$ geht?',
    q:{q:'Deine Vermutung:', opts:['Es geht gegen $\\cos 0 = 1$.', 'Es geht gegen $0$, weil das Intervall verschwindet.', 'Es wächst über alle Grenzen, weil die Höhe wächst.', 'Es hängt davon ab, ob man ein Rechteck oder eine Glockenkurve nimmt.'], a:0, ex:'$\\int_{-\\varepsilon}^{\\varepsilon}\\frac{\\cos x}{2\\varepsilon}dx = \\frac{\\sin\\varepsilon}{\\varepsilon} \\to 1$.'},
    reveal:'Das Integral ist der **Mittelwert** von $\\cos x$ über $[-\\varepsilon, \\varepsilon]$: $\\frac{\\sin\\varepsilon}{\\varepsilon} \\to 1$. Für jede stetige, beschränkte Funktion $f$ geht $\\int\\delta_\\varepsilon f\\,dx$ gegen $f(0)$ – egal ob Rechteck, Gauß- oder Lorentz-Kurve, solange die Fläche 1 ist.\n\nDen Grenzwert schreibt man als **δ-Distribution**: $\\int\\delta(x)f(x)\\,dx = f(0)$. $\\delta(x)$ ist keine gewöhnliche Funktion – „unendlich hoch bei $x = 0$“ ist nur ein Bild. Sie ist nur unter einem Integral sinnvoll.\n\nIn der Quantenmechanik begegnet sie dir als verallgemeinerte (uneigentliche) Eigenfunktion des Ortsoperators, beim δ-Potential (Thema 5) und in $\\int e^{i(k - k\')x}dx = 2\\pi\\delta(k - k\')$ (M6).'
  },
  clarify:{
    core:'**Taylor-Reihe** um $x_0$: $f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(x_0)}{n!}(x - x_0)^n$. Wichtig für Näherungen:\n\n$$e^x = \\sum_{n=0}^\\infty\\frac{x^n}{n!},\\quad \\sin x = x - \\frac{x^3}{6} + \\dots,\\quad \\cos x = 1 - \\frac{x^2}{2} + \\dots,\\quad (1 + x)^a = 1 + ax + \\frac{a(a-1)}{2}x^2 + \\dots$$\n\nDie Reihen gelten innerhalb ihres Konvergenzradius: $e^x$, $\\sin x$, $\\cos x$ für alle $x$, $(1 + x)^a$ (für nicht ganzzahliges $a$) für $|x| < 1$.\n\nDie **geometrische Reihe** $\\sum_{n=0}^\\infty q^n = \\frac{1}{1 - q}$ konvergiert nur für $|q| < 1$.\n\n**Integrale** (für $\\alpha > 0$): $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$, $\\int_0^\\infty x^ne^{-x}dx = n!$. Partielle Integration: $\\int_a^b fg\'\\,dx = [fg]_a^b - \\int_a^b f\'g\\,dx$.\n\n**δ-Distribution:** $\\int\\delta(x - a)f(x)\\,dx = f(a)$, wenn $a$ im Inneren des Integrationsbereichs liegt und $f$ bei $a$ stetig ist (sonst $0$; liegt $a$ auf dem Rand, ist das Integral ohne Zusatzkonvention nicht definiert). Außerdem $\\delta(cx) = \\delta(x)/|c|$, $\\delta(-x) = \\delta(x)$ und $\\Theta\'(x) = \\delta(x)$ für die Stufenfunktion $\\Theta$.',
    keys:[
      'Eine Taylor-Näherung immer mit ihrer Ordnung angeben: $\\sqrt{1 + x} = 1 + \\frac{x}{2} - \\frac{x^2}{8} + O(x^3)$.',
      'Bei Gauß-Integralen zuerst auf die Form $e^{-\\alpha u^2}$ bringen; den Faktor vor $x^2$ ausklammern, bevor man quadratisch ergänzt.',
      'Symmetrie zuerst: Ungerade Integranden über $(-a, a)$ ergeben $0$, bei geraden gilt $\\int_{-a}^a = 2\\int_0^a$.',
      'Randterme nie stillschweigend weglassen: kurz begründen, warum $[fg]$ verschwindet.',
      'δ nur unter dem Integral auswerten. Bei $\\delta(cx - d)$ den Faktor $1/|c|$ nicht vergessen und prüfen, ob die Spitze $x = d/c$ im Bereich liegt.'
    ],
    errors:[
      '$\\delta(2x) = 2\\delta(x)$ statt $\\tfrac12\\delta(x)$.',
      '$\\int_0^\\infty\\delta(x - a)f(x)\\,dx = f(a)$ auch für $a < 0$ – dann liegt die Spitze außerhalb, und das Integral ist $0$.',
      'Bei partieller Integration das Minuszeichen vor dem Restintegral vergessen.',
      '$\\sqrt{\\pi\\alpha}$ statt $\\sqrt{\\pi/\\alpha}$. Eine Einheitenkontrolle hilft: $\\int e^{-\\alpha x^2}dx$ hat die Einheit einer Länge, $\\alpha$ die Einheit $1/\\text{Länge}^2$.'
    ],
    more:[{title:'Was ist $\\Gamma(1/2)$?', text:'Die Gammafunktion $\\Gamma(s) = \\int_0^\\infty t^{s-1}e^{-t}dt$ (für $s > 0$) verallgemeinert die Fakultät: $\\Gamma(n + 1) = n!$. Mit $t = u^2$ wird $\\Gamma(1/2) = 2\\int_0^\\infty e^{-u^2}du = \\sqrt\\pi$. So erklären sich die $\\sqrt\\pi$ in den Gauß-Integralen mit $x^{2n}$.'}],
    checks:[
      {q:'$\\int_{-\\infty}^\\infty \\delta(x - 3)\\,x^2\\,dx$ ist …', opts:['$9$', '$0$', '$3$'], a:0, ex:'Die δ-Distribution pickt den Wert bei $x = 3$ heraus: $3^2 = 9$.'},
      {q:'$\\sum_{n=0}^\\infty (1/3)^n$ ist …', opts:['$3/2$', '$1/3$', 'divergent'], a:0, ex:'Geometrische Reihe mit $q = 1/3$: $\\frac{1}{1 - 1/3} = \\frac32$.'}
    ]
  },
  lab:{type:'delta', title:'Die δ-Distribution als Grenzwert',
    text:'Die schmale Spitze ist $\\delta_\\varepsilon(x - a)$, die zweite Kurve die Testfunktion $f$, die helle Fläche das Produkt $\\delta_\\varepsilon(x - a)f(x)$. Wähle die Form von $\\delta_\\varepsilon$ (Gauß, Lorentz oder Rechteck, jeweils mit Fläche 1) und eine Testfunktion, verkleinere $\\varepsilon$ und verschiebe die Spitze mit $a$. Die Anzeige vergleicht den Inhalt der hellen Fläche, $\\int\\delta_\\varepsilon(x - a)f(x)\\,dx$, mit $f(a)$.',
    questions:[
      {q:'Gauß-Form, $f = \\cos x$, $a = 0$: Verkleinere $\\varepsilon$ von $1$ auf $0{,}05$. Was passiert mit dem Integral?', opts:['Es nähert sich $f(0) = 1$.', 'Es wird null.', 'Es wächst über alle Grenzen.'], a:0, ex:'Für die Gauß-Form gilt $\\int\\delta_\\varepsilon(x)\\cos x\\,dx = e^{-\\varepsilon^2/2}$: bei $\\varepsilon = 1$ etwa $0{,}61$, bei $\\varepsilon = 0{,}05$ etwa $0{,}999$.'},
      {q:'Wähle $f = 1/(1 + x^2)$ und $\\varepsilon = 0{,}05$. Verschiebe $a$ auf $1$. Welcher Wert wird angezeigt?', opts:['etwa $0{,}5$', 'etwa $1$', 'etwa $0$'], a:0, ex:'Die Spitze sitzt jetzt bei $x = 1$ und pickt $f(1) = 1/2$ heraus: $\\int\\delta(x - a)f(x)\\,dx = f(a)$.'}
    ],
    noPic:{q:'Ohne Bild: $\\int_{-\\infty}^{\\infty}\\delta(2x)\\,dx$ ist …', opts:['$1/2$', '$1$', '$2$'], a:0, ex:'Mit $u = 2x$ ist $dx = du/2$, also $\\int\\delta(u)\\,du/2 = 1/2$. Das ist die Regel $\\delta(cx) = \\delta(x)/|c|$.'}},
  compare:{
    text:'Gesucht ist $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx$ für $\\alpha > 0$. Zwei richtige Wege:',
    ctx:CTX.line({params:{α:'pos', m:'pos'}}),
    A:{name:'Partiell integrieren', model:['∫_-∞^∞ x^2 e^(-α x^2) dx = ∫_-∞^∞ x · x e^(-α x^2) dx', {l:'= 1/(2α) ∫_-∞^∞ e^(-α x^2) dx', w:'f = x, g′ = x e^(−αx²); Randterm −x e^(−αx²)/(2α) verschwindet'}, '= 1/(2α) sqrt(π/α)']},
    B:{name:'Nach dem Parameter ableiten', model:['∫_-∞^∞ x^2 e^(-α x^2) dx = -d/dα ∫_-∞^∞ e^(-α x^2) dx', '= -d/dα sqrt(π/α)', '= 1/(2α) sqrt(π/α)']},
    questions:[
      {q:'Welcher Weg liefert am schnellsten auch $\\int x^4e^{-\\alpha x^2}dx$?', opts:['Weg B: noch einmal nach $\\alpha$ ableiten', 'Weg A: zweimal partiell integrieren', 'Keiner von beiden'], a:0, ex:'$\\int x^4e^{-\\alpha x^2}dx = \\frac{d^2}{d\\alpha^2}\\sqrt{\\pi/\\alpha} = \\frac{3}{4\\alpha^2}\\sqrt{\\pi/\\alpha}$.'},
      {q:'Was muss man bei Weg A zusätzlich begründen?', opts:['dass der Randterm verschwindet', 'dass $\\alpha$ reell ist', 'nichts'], a:0, ex:'$x\\,e^{-\\alpha x^2}\\to 0$ für $x\\to\\pm\\infty$, deshalb fällt $[\\dots]_{-\\infty}^{\\infty}$ weg.'}
    ]
  },
  practice:[
    {id:'ma-p1', title:'Taylor-Reihen',
      text:'Die Taylor-Reihe um $x = 0$ ist $f(x) = \\sum_n c_nx^n$ mit $c_n = f^{(n)}(0)/n!$. Schreibe Fakultäten im Nenner mit Klammern, zum Beispiel `x^2/(2!)`.',
      ctx:{coords:['x'], params:{}, defs:{'f(x)':'sqrt(1 + x)'}},
      goals:[
        {id:'a', prompt:'a) Bestimme den Koeffizienten $c_2$ von $x^2$ in der Taylor-Reihe von $f(x) = \\sqrt{1 + x}$.', type:'value', target:'-1/8', points:2, ph:"c_2 = f''(0)/(2!)",
          hints:['$f\'(x) = \\tfrac12(1 + x)^{-1/2}$, $f\'\'(x) = -\\tfrac14(1 + x)^{-3/2}$.', 'Teile $f\'\'(0) = -1/4$ noch durch $2! = 2$.'],
          model:["c_2 = f''(0)/(2!)", '= (-1/4)/2', '= -1/8'],
          mistakes:[{expr:'-1/4', msg:'Das ist $f\'\'(0)$. Der Taylor-Koeffizient ist $f\'\'(0)/2!$.'}, {expr:'1/8', msg:'Vorzeichen: $f\'\'(x) = -\\tfrac14(1 + x)^{-3/2}$ ist negativ.'}],
          note:'Also $\\sqrt{1 + x} \\approx 1 + \\frac x2 - \\frac{x^2}{8}$. Das ist ein Spezialfall von $(1 + x)^a \\approx 1 + ax + \\frac{a(a-1)}{2}x^2$ mit $a = 1/2$.'},
        {id:'b', prompt:'b) Nähere $e^{1/10}$ durch die Taylor-Reihe von $e^x$ bis einschließlich $x^2$. Gib das Ergebnis als Dezimalzahl an und schreib bei der Näherung „≈“.', type:'value', target:'1.105', points:2, ph:'e^x ≈ 1 + x + x^2/2',
          hints:['Setze $x = 1/10$ in $1 + x + x^2/2$ ein.', '$x^2/2 = 1/200 = 0{,}005$.'],
          model:['e^x ≈ 1 + x + x^2/2', 'e^(1/10) ≈ 1 + 1/10 + 1/200', '= 1.105'],
          mistakes:[{expr:'e^(1/10)', msg:'Das ist der exakte Wert. Gefragt ist die Näherung $1 + x + x^2/2$ mit $x = 1/10$.'}, {expr:'1.1', msg:'Das ist nur die erste Ordnung. Nimm noch $x^2/2 = 1/200$ dazu.'}],
          note:'Der exakte Wert ist $1{,}10517\\ldots$; der Fehler $\\approx x^3/6 \\approx 1{,}7\\cdot 10^{-4}$ ist der erste weggelassene Term.'}
      ]},
    {id:'ma-p2', title:'Geometrische Reihe',
      text:'Benutze $\\sum_{n=0}^\\infty q^n = \\frac{1}{1 - q}$ für $|q| < 1$. Mit $E_n = \\hbar\\omega(n + \\tfrac12)$ (Thema 7) wird zum Beispiel die Zustandssumme $\\sum_n e^{-E_n/kT}$ der statistischen Physik eine geometrische Reihe.',
      ctx:{coords:['y'], params:{x:{range:[0.5, 3]}, q:{range:[0.1, 0.8]}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\sum_{n=0}^\\infty e^{-nx}$ für $x > 0$.', type:'value', target:'1/(1 - e^(-x))', points:2, ph:'Σ_{n=0}^∞ e^(-n x) = Σ_{n=0}^∞ (e^(-x))^n',
          hints:['$e^{-nx} = (e^{-x})^n$: Das ist eine geometrische Reihe mit $q = e^{-x}$.', 'Für $x > 0$ ist $0 < q < 1$.'],
          model:['Σ_{n=0}^∞ e^(-n x) = Σ_{n=0}^∞ (e^(-x))^n', '= 1/(1 - e^(-x))'],
          mistakes:[{expr:'1/(1 - e^x)', msg:'Hier ist $q = e^{-x}$, nicht $e^{x}$.'}, {expr:'e^(-x)/(1 - e^(-x))', msg:'Die Summe beginnt bei $n = 0$; der erste Summand ist $1$.'}]},
        {id:'b', prompt:'b) Berechne $\\sum_{n=0}^\\infty n\\,q^n$ für $0 < q < 1$ mit dem Ableitungstrick $n\\,q^n = q\\frac{d}{dq}q^n$.', type:'value', target:'q/(1 - q)^2', points:3, ph:'Σ_{n=0}^∞ n q^n = q d/dq Σ_{n=0}^∞ q^n',
          hints:['Ziehe $q\\,\\frac{d}{dq}$ vor die Summe und setze die geometrische Reihe ein. Setze den Ausdruck hinter $d/dq$ in Klammern: `q d/dq (1/(1 - q))`.', '$\\frac{d}{dq}\\frac{1}{1 - q} = \\frac{1}{(1 - q)^2}$.'],
          model:['Σ_{n=0}^∞ n q^n = q d/dq Σ_{n=0}^∞ q^n', '= q d/dq (1/(1 - q))', '= q/(1 - q)^2'],
          mistakes:[{expr:'1/(1 - q)^2', msg:'Der Faktor $q$ vor der Ableitung fehlt.'}, {expr:'-q/(1 - q)^2', msg:'Vorzeichen: $\\frac{d}{dq}(1 - q)^{-1} = +(1 - q)^{-2}$ (Kettenregel mit innerer Ableitung $-1$).'}]}
      ]},
    {id:'ma-p3', title:'Gauß-Integrale',
      text:'Es ist $\\alpha > 0$. Benutze $\\int_{-\\infty}^\\infty e^{-\\alpha u^2}du = \\sqrt{\\pi/\\alpha}$ und $\\int_{-\\infty}^\\infty u^2e^{-\\alpha u^2}du = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$.',
      ctx:CTX.line({params:{α:'pos', m:'pos'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_{-\\infty}^\\infty e^{-x^2 + 2x}\\,dx$.', type:'value', target:'sqrt(π) e', points:3, hints:['Quadratische Ergänzung: $-x^2 + 2x = -(x - 1)^2 + 1$.', 'Mit $u = x - 1$ bleibt $e\\int e^{-u^2}du$.'],
          model:['∫_-∞^∞ e^(-x^2 + 2x) dx = ∫_-∞^∞ e^(-(x - 1)^2 + 1) dx', '= e ∫_-∞^∞ e^(-u^2) du', '= e sqrt(π)'],
          mistakes:[{expr:'sqrt(π)', msg:'Der konstante Teil $e^{1}$ aus der quadratischen Ergänzung fehlt.'}]},
        {id:'b', prompt:'b) Berechne $\\int_0^\\infty x\\,e^{-\\alpha x^2}\\,dx$.', type:'value', target:'1/(2α)', points:2, hints:['$x\\,e^{-\\alpha x^2}$ ist bis auf einen Faktor die Ableitung von $e^{-\\alpha x^2}$.', 'Stammfunktion: $-\\frac{1}{2\\alpha}e^{-\\alpha x^2}$.'],
          model:['∫_0^∞ x e^(-α x^2) dx = [-e^(-α x^2)/(2α)]_0^∞', '= 1/(2α)'],
          mistakes:[{expr:'0', msg:'Über $(-\\infty, \\infty)$ wäre das Integral null (ungerader Integrand). Hier läuft es aber nur von $0$ bis $\\infty$.'}]},
        {id:'c', prompt:'c) Berechne $\\int_{-\\infty}^\\infty (x - 1)^2e^{-x^2}\\,dx$.', type:'value', target:'3 sqrt(π)/2', points:3, hints:['Ausmultiplizieren: $(x - 1)^2 = x^2 - 2x + 1$.', 'Der Term $-2x\\,e^{-x^2}$ ist ungerade und fällt weg.'],
          model:['∫_-∞^∞ (x - 1)^2 e^(-x^2) dx = ∫_-∞^∞ (x^2 - 2x + 1) e^(-x^2) dx', {l:'= sqrt(π)/2 - 0 + sqrt(π)', w:'Term mit x ist ungerade'}, '= 3 sqrt(π)/2'],
          mistakes:[{expr:'2 sqrt(π)', msg:'Prüfe $\\int x^2e^{-x^2}dx$: Mit $\\alpha = 1$ ist das $\\frac12\\sqrt\\pi$, nicht $\\sqrt\\pi$.'}, {expr:'sqrt(π)/2 + sqrt(π) - 2', msg:'Der Term $-2\\int x\\,e^{-x^2}dx$ ist $0$, weil der Integrand ungerade ist.'}]}
      ]},
    {id:'ma-p4', title:'Fakultät und Randterme',
      text:'Benutze $\\int_0^\\infty u^ne^{-u}\\,du = n!$.',
      ctx:{coords:['x'], params:{}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_0^\\infty x^3e^{-2x}\\,dx$.', type:'value', target:'3/8', points:2, ph:'∫_0^∞ x^3 e^(-2x) dx = 1/2^4 ∫_0^∞ u^3 e^(-u) du',
          hints:['Substituiere $u = 2x$: $x^3 = u^3/8$ und $dx = du/2$.', 'Insgesamt entsteht der Faktor $1/2^4$, und $3! = 6$.'],
          model:[{l:'∫_0^∞ x^3 e^(-2x) dx = 1/2^4 ∫_0^∞ u^3 e^(-u) du', w:'u = 2x'}, '= 3!/16', '= 3/8'],
          mistakes:[{expr:'3/4', msg:'Bei der Substitution $u = 2x$ ist auch $dx = du/2$. Insgesamt entsteht $1/2^4$, nicht $1/2^3$.'}, {expr:'6', msg:'Das wäre $\\int_0^\\infty x^3e^{-x}dx$. Der Faktor 2 im Exponenten muss berücksichtigt werden.'}],
          note:'Allgemein: $\\int_0^\\infty x^ne^{-kx}dx = n!/k^{n+1}$ für $k > 0$. Diese Formel brauchst du beim Wasserstoffatom (Thema 9).'}
      ]},
    {id:'ma-p4b', title:'Randterme bei Funktionen, die am Rand verschwinden',
      text:'Gegeben sind Funktionen $f, g$ auf $[0, L]$ mit $f(0) = f(L) = 0$ und $g(0) = g(L) = 0$ (wie Wellenfunktionen im Kasten).',
      ctx:CTX.box({abstract:{f:{args:['x']}, g:{args:['x']}}}),
      goals:[
        {id:'a', prompt:'Zeige: $\\int_0^L f^*g\'\\,dx = -\\int_0^L (f^*)\'\\,g\\,dx$.', type:'show', from:'∫_0^L f^* g\' dx', to:'-∫_0^L (f^*)\' g dx', points:3, hints:['Partielle Integration mit $f^*$ und $g$.', 'Der Randterm $[f^*g]_0^L$ ist null, weil beide Funktionen am Rand verschwinden.'],
          model:['∫_0^L f^* g\' dx = [f^* g]_0^L - ∫_0^L (f^*)\' g dx', {l:'= -∫_0^L (f^*)\' g dx', w:'f(0) = f(L) = 0'}],
          note:'Genau dieser Schritt zeigt später, dass $\\hat p = -i\\hbar\\,d/dx$ hermitesch ist (Thema 6).'}
      ]},
    {id:'ma-p5', title:'Rechnen mit der δ-Distribution',
      text:'Regeln: $\\int\\delta(x - a)f(x)\\,dx = f(a)$, wenn $a$ im Inneren des Integrationsbereichs liegt und $f$ bei $a$ stetig ist, sonst $0$ (liegt $a$ auf dem Rand, ist das Integral ohne Zusatzkonvention nicht definiert); $\\delta(cx - d) = \\frac{1}{|c|}\\delta(x - d/c)$.',
      ctx:{coords:['x'], params:{}, abstract:{f:{args:['x']}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_{-\\infty}^\\infty \\delta(2x - 1)\\,e^x\\,dx$.', type:'value', target:'e^(1/2)/2', points:2, ph:'∫_-∞^∞ δ(2x - 1) e^x dx = ∫_-∞^∞ 1/2 δ(x - 1/2) e^x dx',
          hints:['Schreibe $\\delta(2x - 1) = \\delta(2(x - \\tfrac12)) = \\tfrac12\\delta(x - \\tfrac12)$.'],
          model:['∫_-∞^∞ δ(2x - 1) e^x dx = ∫_-∞^∞ 1/2 δ(x - 1/2) e^x dx', '= e^(1/2)/2'],
          mistakes:[{expr:'e^(1/2)', msg:'Der Faktor $1/|c| = 1/2$ fehlt: $\\delta(2x - 1) = \\tfrac12\\delta(x - \\tfrac12)$.'}, {expr:'2 e^(1/2)', msg:'Umgekehrt: $\\delta(cx) = \\delta(x)/|c|$, also Faktor $\\tfrac12$, nicht $2$.'}, {expr:'e/2', msg:'Die Spitze liegt bei $2x - 1 = 0$, also $x = 1/2$, nicht bei $x = 1$.'}]},
        {id:'b', prompt:'b) Berechne $\\int_{-2}^{2}(x^3 + 1)\\,\\delta(x - 1)\\,dx + \\int_{-2}^{2}(x^3 + 1)\\,\\delta(x + 3)\\,dx$.', type:'value', target:'2', points:2,
          hints:['Erster Summand: Die Spitze bei $x = 1$ liegt im Bereich.', 'Zweiter Summand: Wo liegt die Spitze von $\\delta(x + 3)$?'],
          model:['∫_-2^2 (x^3 + 1) δ(x - 1) dx + ∫_-2^2 (x^3 + 1) δ(x + 3) dx = 2 + 0', '= 2'],
          mistakes:[{expr:'-24', msg:'$x = -3$ liegt außerhalb von $[-2, 2]$. Dort trägt $\\delta(x + 3)$ nichts bei.'}, {expr:'30', msg:'Zwei Fehler: Die Spitze von $\\delta(x + 3)$ liegt bei $x = -3$, nicht bei $x = +3$ – und sie liegt außerhalb von $[-2, 2]$. Dort trägt $\\delta(x + 3)$ nichts bei.'}]},
        {id:'c', prompt:'c) $f$ sei glatt und verschwinde für $x \\to \\infty$. Zeige: $\\int_{-\\infty}^\\infty\\Theta(x)\\,f\'(x)\\,dx = -f(0)$. Dabei ist $\\Theta$ die Stufenfunktion ($\\Theta = 0$ für $x < 0$, $1$ für $x > 0$).', type:'show', from:"∫_-∞^∞ Θ(x) f'(x) dx", to:'-f(0)', points:3,
          hints:['Wegen $\\Theta$ trägt nur $x > 0$ bei.', 'Hauptsatz: $\\int_0^\\infty f\'\\,dx = [f]_0^\\infty$.'],
          model:["∫_-∞^∞ Θ(x) f'(x) dx = ∫_0^∞ f'(x) dx", '= [f(x)]_0^∞', '= -f(0)'],
          note:'Damit gilt $\\int\\Theta\'f\\,dx = [\\Theta f] - \\int\\Theta f\'\\,dx = 0 + f(0)$. Die Ableitung der Stufenfunktion wirkt also wie $\\delta(x)$: $\\Theta\'(x) = \\delta(x)$. Beim δ-Potential springt deshalb $\\psi\'$ (Thema 5).'}
      ]}
  ],
  final:[
    {q:'$\\delta(-3x)$ ist gleich …', opts:['$\\tfrac13\\delta(x)$', '$-\\tfrac13\\delta(x)$', '$3\\delta(x)$'], a:0, ex:'$\\delta(cx) = \\delta(x)/|c|$ mit $|c| = 3$. Das Vorzeichen spielt keine Rolle, weil $\\delta$ gerade ist.'},
    {task:{id:'ma-f1', title:'Gauß-Integral', text:'Berechne $\\int_{-\\infty}^\\infty e^{-2x^2}\\,dx$.', ctx:CTX.line({}),
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'sqrt(π/2)', points:2, model:['∫_-∞^∞ e^(-2x^2) dx = sqrt(π/2)'],
        mistakes:[{expr:'sqrt(2π)', msg:'$\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 2$ – der Parameter steht im Nenner.'}]}]}},
    {q:'Die Taylor-Reihe von $\\ln(1 + x)$ um $x = 0$ beginnt mit …', opts:['$x - x^2/2$', '$1 + x$', '$x + x^2/2$'], a:0, ex:'$\\ln 1 = 0$, $\\frac{d}{dx}\\ln(1 + x) = \\frac{1}{1 + x} = 1 - x + \\dots$; integrieren gibt $x - x^2/2 + \\dots$'},
    {task:{id:'ma-f2', title:'Fakultätsintegral', text:'Berechne $\\int_0^\\infty x^2e^{-x/a}\\,dx$ für $a > 0$.', ctx:{coords:['x'], params:{a:'pos'}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'2 a^3', points:2, model:['∫_0^∞ x^2 e^(-x/a) dx = a^3 ∫_0^∞ u^2 e^(-u) du', '= 2 a^3'],
        mistakes:[{expr:'2 a^2', msg:'Mit $u = x/a$ ist $x^2 = a^2u^2$ und zusätzlich $dx = a\\,du$: insgesamt $a^3$.'}]}]}}
  ],
  errors:[
    {id:'ma-e1', title:'Partielle Integration mit Vorzeichenfehler',
      text:'Gesucht ist $\\int_0^\\pi x\\cos x\\,dx$. So wurde gerechnet:',
      ctx:{coords:['x'], params:{}},
      lines:['∫_0^π x cos(x) dx = ∫_0^π x (sin(x))\' dx', '= [x sin(x)]_0^π + ∫_0^π sin(x) dx', '= 0 + 2', '= 2'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Vor dem Restintegral muss ein Minus stehen: $[fg] - \\int f\'g\\,dx$.', 'Der Randterm ist nicht null.', 'Die Grenzen sind vertauscht.'], a:0, ex:'Partielle Integration: $\\int fg\' = [fg] - \\int f\'g$. Mit dem Minus kommt $0 - 2 = -2$ heraus.'},
      fix:{id:'a', prompt:'Berichtige und rechne zu Ende.', type:'value', target:'-2', model:['∫_0^π x cos(x) dx = [x sin(x)]_0^π - ∫_0^π sin(x) dx', '= 0 - 2', '= -2']}},
    {id:'ma-e2', title:'δ mit Vorfaktor im Argument',
      text:'Gesucht ist $\\int_{-\\infty}^\\infty\\delta(3x - 6)\\,x^2\\,dx$. So wurde gerechnet:',
      ctx:{coords:['x'], params:{}},
      lines:['∫_-∞^∞ δ(3x - 6) x^2 dx = ∫_-∞^∞ 3 δ(x - 2) x^2 dx', '= 3 · 4', '= 12'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['$\\delta(3x - 6) = \\delta(3(x - 2)) = \\tfrac13\\delta(x - 2)$, nicht $3\\delta(x - 2)$.', 'Die Spitze liegt bei $x = 6$.', 'Man darf $\\delta$ nicht umformen.'], a:0, ex:'Substitution $u = 3x$: $dx = du/3$. Im Bild einer δ-Folge ist $\\delta_\\varepsilon(3x)$ bei gleicher Höhe dreimal schmaler und hat daher die Fläche $1/3$.'},
      fix:{id:'a', prompt:'Berichtige und berechne das Integral.', type:'value', target:'4/3', model:['∫_-∞^∞ δ(3x - 6) x^2 dx = 1/3 ∫_-∞^∞ δ(x - 2) x^2 dx', '= 4/3'],
        mistakes:[{expr:'12', msg:'$\\delta(3x - 6) = \\tfrac13\\delta(x - 2)$: Der Faktor ist $1/3$, nicht $3$.'}, {expr:'4', msg:'Der Faktor $1/|c| = 1/3$ fehlt.'}]}}
  ]
});
lexe('taylor', 'Taylor-Reihe', '$f(x) = \\sum_{n=0}^\\infty\\frac{f^{(n)}(x_0)}{n!}(x - x_0)^n$. Wichtige Reihen um $0$: $e^x = \\sum x^n/n!$, $\\sin x = x - x^3/3! + \\dots$, $\\cos x = 1 - x^2/2! + \\dots$, $\\ln(1 + x) = x - x^2/2 + \\dots$, $(1 + x)^a = 1 + ax + \\frac{a(a-1)}{2}x^2 + \\dots$ Konvergenz: $e^x$, $\\sin x$, $\\cos x$ für alle $x$; $\\ln(1 + x)$ für $-1 < x \\le 1$; $(1 + x)^a$ (nicht ganzzahliges $a$) für $|x| < 1$. Eine Näherung bis zur Ordnung $n$ hat einen Fehler der Ordnung $x^{n+1}$.', {topic:'m-analysis'});
lexe('geometrische-reihe', 'Geometrische Reihe', '$\\sum_{n=0}^\\infty q^n = \\frac{1}{1 - q}$ für $|q| < 1$; endlich: $\\sum_{n=0}^{N-1}q^n = \\frac{1 - q^N}{1 - q}$. Ableitungstrick: $\\sum_n n\\,q^n = q\\frac{d}{dq}\\frac{1}{1 - q} = \\frac{q}{(1 - q)^2}$.', {topic:'m-analysis'});
lexe('gauss-integral', 'Gauß-Integrale', 'Für $\\alpha > 0$ (allgemeiner $\\operatorname{Re}\\alpha > 0$, dann $\\sqrt{\\cdot}$ als Hauptwert mit positivem Realteil): $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$, $\\int_{-\\infty}^\\infty x^{2n+1}e^{-\\alpha x^2}dx = 0$ (ungerade), $\\int_0^\\infty x\\,e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}$. Höhere Momente durch Ableiten nach $\\alpha$. Mit linearem Term: quadratische Ergänzung.', {topic:'m-analysis'});
lexe('gammafunktion', 'Gammafunktion und Fakultät', '$\\Gamma(s) = \\int_0^\\infty t^{s-1}e^{-t}dt$ für $s > 0$, $\\Gamma(n + 1) = n!$, $\\Gamma(1/2) = \\sqrt\\pi$, $\\Gamma(s + 1) = s\\,\\Gamma(s)$. Daraus: $\\int_0^\\infty x^ne^{-kx}dx = n!/k^{n+1}$ für $k > 0$.', {topic:'m-analysis'});
lexe('delta-distribution', 'δ-Distribution', 'Definiert durch $\\int\\delta(x - a)f(x)\\,dx = f(a)$ (wenn $a$ im Inneren des Integrationsbereichs liegt und $f$ bei $a$ stetig ist, sonst $0$; liegt $a$ auf dem Rand, ist das Integral ohne Zusatzkonvention nicht definiert). Grenzwert schmaler werdender Funktionen mit Fläche 1, etwa $\\delta_\\varepsilon(x) = e^{-x^2/(2\\varepsilon^2)}/(\\sqrt{2\\pi}\\varepsilon)$. Regeln: $\\delta(cx) = \\delta(x)/|c|$, $\\delta(-x) = \\delta(x)$, $x\\,\\delta(x) = 0$, $\\Theta\'(x) = \\delta(x)$. Fourier-Darstellung: $\\delta(x) = \\frac{1}{2\\pi}\\int e^{ikx}dk$. Nur unter Integralen sinnvoll.', {topic:'m-analysis'});
lexe('stufenfunktion', 'Stufenfunktion (Heaviside)', '$\\Theta(x) = 0$ für $x < 0$, $\\Theta(x) = 1$ für $x > 0$. Im Sinne der Distributionen ist $\\Theta\'(x) = \\delta(x)$. Damit beschreibt man Potentialstufen, zum Beispiel $V(x) = V_0\\,\\Theta(x)$ (Thema 5).', {topic:'m-analysis'});
