/* ===== Thema 5: Stufe, Barriere, Tunneleffekt ===== */
const TUN_UP = () => ({coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['1.3 V_0', '3 V_0']}},
  defs:{k:'sqrt(2m E)/ħ', q:'sqrt(2m (E - V_0))/ħ', 'ψ_L(x)':'e^(i k x) + B e^(-i k x)', 'ψ_R(x)':'C e^(i q x)'},
  unknowns:{B:{ref:'(k - q)/(k + q)', kind:'real'}, C:{ref:'2k/(k + q)', kind:'real'}}});
const TUN_DOWN = () => ({coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['0.15 V_0', '0.85 V_0']}},
  defs:{k:'sqrt(2m E)/ħ', κ:'sqrt(2m (V_0 - E))/ħ', 'ψ_L(x)':'e^(i k x) + B e^(-i k x)', 'ψ_R(x)':'C e^(-κ x)'},
  unknowns:{B:{ref:'(k - iκ)/(k + iκ)', kind:'complex'}, C:{ref:'2k/(k + iκ)', kind:'complex'}, d:{ref:'1/(2κ)'}}});
const TUN_DELTA = () => ({coords:['x'], params:{m:'pos', α:'pos'}, defs:{'ψ(x)':'A e^(-κ |x|)'},
  unknowns:{κ:{ref:'m α/ħ^2'}, A:{ref:'sqrt(m α)/ħ', alt:['-sqrt(m α)/ħ']}, E:{ref:'-m α^2/(2ħ^2)', kind:'real'}}});
topic({
  id:'tunnel', math:['m-dgl', 'm-analysis'], title:'Stufe, Barriere, Tunneleffekt', short:'Tunneleffekt',
  src:'Griffiths & Schroeter Kap. 2 · Nolting 5/1 Kap. 4',
  goals:[
    'Ich kann an einer Potentialstufe die Anschlussbedingungen aufstellen und Reflexions- und Transmissionswahrscheinlichkeit berechnen.',
    'Ich kann erklären, warum ein Teilchen in einen klassisch verbotenen Bereich eindringt und durch eine Barriere tunnelt.',
    'Ich kann den gebundenen Zustand im $\\delta$-Potential mit der Sprungbedingung für $\\psi\'$ bestimmen.'
  ],
  needs:'stationäre Schrödingergleichung · $e^{ikx}$ ableiten · komplexe Zahlen · Stromdichte $j = \\frac{\\hbar}{m}\\,\\mathrm{Im}(\\psi^*\\psi\')$',
  check:[
    {q:'Welche Lösung hat $\\psi\'\' = -k^2\\psi$ mit $k > 0$?', opts:['$\\psi = Ae^{ikx} + Be^{-ikx}$', '$\\psi = Ae^{kx} + Be^{-kx}$', '$\\psi = Ax + B$'], a:0, ex:'Zweimal Ableiten von $e^{\\pm ikx}$ liefert $-k^2e^{\\pm ikx}$. Bei $\\psi\'\' = +\\kappa^2\\psi$ wären es reelle Exponentialfunktionen.', lex:'anschluss', prev:'sg'},
    {q:'Was ist $\\frac{d}{dx}\\,B\\,e^{-ikx}$?', opts:['$-ikB\\,e^{-ikx}$', '$ikB\\,e^{-ikx}$', '$-kB\\,e^{-ikx}$'], a:0, ex:'Kettenregel: Die innere Ableitung von $-ikx$ ist $-ik$.', lex:'komplexe-zahlen'},
    {q:'Für $z = \\frac{k - i\\kappa}{k + i\\kappa}$ mit reellen $k,\\kappa$ gilt $|z| = $', opts:['$1$', '$\\frac{k-\\kappa}{k+\\kappa}$', '$0$'], a:0, ex:'Zähler und Nenner sind zueinander konjugiert und haben denselben Betrag $\\sqrt{k^2+\\kappa^2}$.', lex:'komplexe-zahlen'},
    {q:'Ein Teilchen mit $E < V_0$ trifft klassisch auf eine Wand der Höhe $V_0$. Was passiert klassisch?', opts:['Es wird immer reflektiert.', 'Es geht mit kleinerer Geschwindigkeit weiter.', 'Es bleibt an der Wand stehen.'], a:0, ex:'Klassisch ist der Bereich mit $V > E$ verboten ($E_{kin} < 0$). Quantenmechanisch dringt die Welle trotzdem ein.', lex:'tunneleffekt'}
  ],
  example:{
    title:'Stufe mit $E > V_0$: Amplitude der reflektierten Welle',
    text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0$, und $E > V_0$. Links läuft eine Welle ein und wird teilweise reflektiert: $\\psi_L = e^{ikx} + B\\,e^{-ikx}$. Rechts läuft nur eine Welle nach rechts: $\\psi_R = C\\,e^{iqx}$. Dabei ist $k = \\sqrt{2mE}/\\hbar$ und $q = \\sqrt{2m(E - V_0)}/\\hbar$. Bestimme $B$.',
    ctx:TUN_UP(),
    lines:[
      {l:'ψ_L(0) = ψ_R(0)', why:{q:'Warum muss $\\psi$ bei $x = 0$ stetig sein?', opts:['Sonst wäre $\\psi\'$ dort unendlich und $\\psi\'\'$ erst recht – die Schrödingergleichung mit endlichem $V$ ließe das nicht zu.', 'Weil $\\psi(0) = 0$ gelten muss.', 'Weil beide Bereiche dieselbe Energie haben.'], a:0, ex:'Bei endlichem Potentialsprung sind $\\psi$ und $\\psi\'$ stetig. Nur bei unendlich hohen Wänden oder $\\delta$-Potentialen ändert sich das.'}},
      {l:'1 + B = C', why:{q:'Was wurde eingesetzt?', opts:['$e^0 = 1$ in beiden Lösungen', '$k = q$', 'die Normierung'], a:0, ex:'Bei $x = 0$ werden alle Exponentialfunktionen zu 1.'}},
      {l:'ik (1 - B) = iq C', w:'ψ\' stetig', why:{q:'Woher kommt das Minuszeichen vor $B$?', opts:['Die Ableitung von $e^{-ikx}$ bringt $-ik$.', 'Die reflektierte Welle hat negative Energie.', 'Das ist eine Konvention.'], a:0, ex:'$\\psi_L\' = ik\\,e^{ikx} - ikB\\,e^{-ikx}$, bei $x = 0$ also $ik(1 - B)$.'}},
      {l:'k (1 - B) = q (1 + B)', why:{q:'Wie entsteht diese Zeile?', opts:['$C = 1 + B$ einsetzen und durch $i$ teilen', 'beide Gleichungen addieren', 'quadrieren'], a:0, ex:'Zwei Gleichungen, zwei Unbekannte: $C$ eliminieren.'}},
      {l:'B = (k - q)/(k + q)', why:{q:'Was bedeutet $B \\ne 0$?', opts:['Auch bei $E > V_0$ wird ein Teil reflektiert – klassisch unmöglich.', 'Das Teilchen wird vollständig reflektiert.', 'Die Rechnung enthält einen Fehler.'], a:0, ex:'Die Reflexionswahrscheinlichkeit ist $|B|^2 = \\left(\\frac{k-q}{k+q}\\right)^2 > 0$. Sie verschwindet nur für $q = k$, also $V_0 = 0$.'}}
    ],
    faded:{id:'tunnel-fade', title:'Jetzt du: die durchgelassene Amplitude $C$', text:'Gleiche Stufe wie im Beispiel. Bestimme $C$.',
      ctx:TUN_UP(),
      given:['1 + B = C', 'ik (1 - B) = iq C'],
      goals:[{id:'a', prompt:'Bestimme $C$.', type:'solve', unknown:'C', hints:['Eliminiere diesmal $B$: Aus der ersten Gleichung folgt $B = C - 1$.', 'Setze ein: $k(2 - C) = qC$.'],
        model:['1 + B = C', 'ik (1 - B) = iq C', {l:'k (2 - C) = q C', gap:'k (▢) = q C'}, '2k = (k + q) C', 'C = 2k/(k + q)']}]}
  },
  puzzle:{
    title:'Reflexion an einer Stufe nach unten',
    text:'Ein Teilchen läuft von links auf eine Stufe **nach unten**: Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = -V_0$ (tiefer). Klassisch wird es dort nur schneller.\n\nWird es quantenmechanisch teilweise reflektiert?',
    q:{q:'Deine Vermutung:', opts:['Nein, eine Stufe nach unten reflektiert nichts.', 'Ja, ein Teil wird reflektiert.', 'Es wird vollständig reflektiert.'], a:1, ex:'Ja – Reflexion entsteht an jedem Sprung der Wellenzahl, egal in welche Richtung.'},
    reveal:'Rechts ist die Wellenzahl $q = \\sqrt{2m(E + V_0)}/\\hbar > k$. Die Anschlussrechnung ist dieselbe wie bei der Stufe nach oben und liefert $B = \\frac{k-q}{k+q}$, jetzt negativ, aber $|B|^2 > 0$. Reflexion ist eine Welleneigenschaft: Sie tritt an jeder Stelle auf, an der sich die Wellenlänge sprunghaft ändert – wie Licht an einer Glasoberfläche, egal ob es ins dichtere oder dünnere Medium geht.'
  },
  clarify:{
    core:'Bei stückweise konstantem Potential löst man die stationäre Schrödingergleichung in jedem Bereich: Wo $E > V$, gibt es Wellen $e^{\\pm ikx}$ mit $k = \\sqrt{2m(E-V)}/\\hbar$; wo $E < V$, gibt es $e^{\\pm\\kappa x}$ mit $\\kappa = \\sqrt{2m(V - E)}/\\hbar$. An den Sprungstellen sind **$\\psi$ und $\\psi\'$ stetig**. Reflexion und Transmission gibt man über Stromdichten an:\n\n$$R = \\frac{|j_{ref}|}{j_{ein}},\\qquad T = \\frac{j_{trans}}{j_{ein}},\\qquad R + T = 1.$$\n\nFür eine Welle $Ae^{ikx}$ ist $j = \\frac{\\hbar k}{m}|A|^2$; deshalb steht in $T$ der Faktor $q/k$.',
    keys:[
      'Im verbotenen Bereich wird nur die abklingende Lösung $e^{-\\kappa x}$ behalten; $e^{+\\kappa x}$ wäre nicht normierbar.',
      'Die Eindringtiefe ist $1/\\kappa$ (für $\\psi$) bzw. $1/(2\\kappa)$ (für $|\\psi|^2$).',
      'Rechteckbarriere der Breite $a$ mit $E < V_0$: $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1}$; für $\\kappa a \\gg 1$ ist $T \\approx 16\\frac{E}{V_0}\\left(1 - \\frac{E}{V_0}\\right)e^{-2\\kappa a}$.',
      '$\\delta$-Potential $V = -\\alpha\\,\\delta(x)$: $\\psi$ stetig, aber $\\psi\'$ springt: $\\psi\'(0^+) - \\psi\'(0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$. Es gibt genau einen gebundenen Zustand mit $E = -\\frac{m\\alpha^2}{2\\hbar^2}$.',
      'Im endlichen Topf gibt es immer mindestens einen gebundenen Zustand; die Energien liegen tiefer als im unendlichen Topf gleicher Breite, weil die Wellenfunktion in die Wände eindringt.'
    ],
    errors:[
      '$T = |C|^2$ statt $T = \\frac qk|C|^2$: Die Wahrscheinlichkeitsströme hängen von der Geschwindigkeit ab.',
      'Vorzeichen beim Ableiten der reflektierten Welle $Be^{-ikx}$ vergessen.',
      'Im verbotenen Bereich $e^{+\\kappa x}$ mitnehmen, obwohl der Bereich bis $x\\to\\infty$ reicht.',
      'Beim $\\delta$-Potential $\\psi\'$ als stetig ansetzen – dann gäbe es keinen gebundenen Zustand.',
      '„Das Teilchen ist nie in der Barriere“: Die Aufenthaltswahrscheinlichkeit dort ist klein, aber nicht null.'
    ],
    more:[{title:'Woher kommt die Sprungbedingung beim δ-Potential?', text:'Integriere $-\\frac{\\hbar^2}{2m}\\psi\'\' - \\alpha\\delta(x)\\psi = E\\psi$ von $-\\varepsilon$ bis $\\varepsilon$ und lass $\\varepsilon\\to 0$ gehen. Die rechte Seite verschwindet, links bleibt $-\\frac{\\hbar^2}{2m}[\\psi\'(\\varepsilon) - \\psi\'(-\\varepsilon)] - \\alpha\\psi(0) = 0$.'}],
    checks:[
      {q:'An einer Stufe mit $E > V_0$ ist $B = 0{,}2$ und $C = 1{,}2$. Ist $|B|^2 + |C|^2 = 1$ zu erwarten?', opts:['Nein. Erhalten ist $|B|^2 + \\frac qk|C|^2 = 1$.', 'Ja, Wahrscheinlichkeiten addieren sich immer zu 1.', 'Nur wenn $V_0 = 0$.'], a:0, ex:'$C$ ist eine Amplitude, und $|C|^2$ ist das Verhältnis der Dichten von durchgelassener und einlaufender Welle – keine Wahrscheinlichkeit. Erhalten ist der Wahrscheinlichkeitsstrom.'},
      {q:'Eine Barriere wird bei gleicher Energie doppelt so breit ($\\kappa a \\gg 1$). Wie ändert sich $T$ ungefähr?', opts:['um den Faktor $e^{-2\\kappa a}$ kleiner', 'halbiert', 'gar nicht'], a:0, ex:'$T \\propto e^{-2\\kappa a}$. Aus $a$ wird $2a$, also kommt noch einmal $e^{-2\\kappa a}$ dazu – exponentiell, nicht linear.'}
    ]
  },
  lab:{type:'barrier', title:'Transmission durch eine Rechteckbarriere',
    text:'Die Kurve zeigt die Transmission $T$ als Funktion von $E/V_0$ für eine Barriere der eingestellten Breite. Der rote Punkt ist die gewählte Energie. Unterhalb von $E = V_0$ tunnelt das Teilchen, oberhalb läuft es „über“ die Barriere.',
    questions:[
      {q:'Stelle $E/V_0 = 0{,}5$ ein und vergrößere die Breite. Was passiert mit $T$?', opts:['$T$ fällt sehr schnell, etwa exponentiell.', '$T$ fällt linear mit der Breite.', '$T$ bleibt gleich.'], a:0, ex:'Für breite Barrieren gilt $T \\propto e^{-2\\kappa a}$. Deshalb ist Tunneln für Elektronen nur bei sehr dünnen Barrieren merklich: Bei $V_0 - E = 1\\,\\mathrm{eV}$ ist $e^{-2\\kappa a}$ für $a = 1\\,\\mathrm{nm}$ schon etwa $4\\cdot 10^{-5}$.'},
      {q:'Schau dir $E > V_0$ an. Ist dort immer $T = 1$?', opts:['Nein, $T < 1$ außer bei Resonanzen, wo $T = 1$ erreicht wird.', 'Ja, über der Barriere wird nichts reflektiert.', 'Nein, dort ist $T = 0$.'], a:0, ex:'Auch über der Barriere wird an den Kanten reflektiert. Bei $qa = n\\pi$ löschen sich die Reflexionen der beiden Kanten aus: Resonanz.'}
    ],
    noPic:{q:'Ohne Bild: Ein Proton und ein Elektron mit gleicher Energie treffen auf dieselbe Barriere ($E < V_0$). Wer tunnelt besser?', opts:['das Elektron', 'das Proton', 'beide gleich'], a:0, ex:'$\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$ wächst mit der Masse. Das Proton ist rund 1836-mal schwerer, $\\kappa$ also etwa 43-mal größer – $e^{-2\\kappa a}$ wird winzig.'}},
  compare:{
    text:'An der Stufe mit $E < V_0$ ist $B = \\frac{k - i\\kappa}{k + i\\kappa}$. Gezeigt werden soll $|B| = 1$ (Totalreflexion). Zwei richtige Wege:',
    ctx:TUN_DOWN(),
    A:{name:'Ausrechnen mit $B^*B$', model:['|B|^2 = B^* B', '= (k + iκ)/(k - iκ) · (k - iκ)/(k + iκ)', '= 1']},
    B:{name:'Beträge von Zähler und Nenner', text:'Zähler und Nenner sind zueinander komplex konjugiert.', model:['|k - iκ| = sqrt(k^2 + κ^2)', '|k + iκ| = sqrt(k^2 + κ^2)', '|B| = |k - iκ|/|k + iκ|', '= 1']},
    questions:[
      {q:'Was zeigt $|B| = 1$ physikalisch?', opts:['Alles wird reflektiert; rechts fließt im Mittel kein Strom.', 'Rechts ist $\\psi = 0$.', 'Die Welle kommt unverändert zurück, ohne Phasenverschiebung.'], a:0, ex:'Rechts ist $\\psi \\ne 0$ (Eindringen), aber $C\\,e^{-\\kappa x}$ hat eine reelle Ortsabhängigkeit und trägt keinen Strom. Die Phase von $B$ ist dabei nicht null: Die reflektierte Welle ist phasenverschoben.'},
      {q:'Welcher Weg verallgemeinert sich auf $z = w/w^*$ mit beliebigem komplexem $w$?', opts:['Weg B: $|w| = |w^*|$, also $|z| = 1$.', 'nur Weg A', 'keiner'], a:0, ex:'Weg B braucht nur $|w^*| = |w|$ – das ist kürzer und gilt allgemein.'}
    ]
  },
  practice:[
    {id:'tunnel-p1', title:'Potentialstufe mit $E > V_0$',
      text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0 < E$. Ansatz: $\\psi_L = e^{ikx} + Be^{-ikx}$, $\\psi_R = Ce^{iqx}$ mit $k = \\sqrt{2mE}/\\hbar$, $q = \\sqrt{2m(E-V_0)}/\\hbar$. Die Größen $k$ und $q$ kannst du direkt benutzen.',
      ctx:TUN_UP(),
      goals:[
        {id:'a', prompt:'a) Stelle die Anschlussbedingungen auf und bestimme $B$.', type:'solve', unknown:'B', points:3, ph:'ψ_L(0) = ψ_R(0)',
          hints:['Zwei Bedingungen bei $x = 0$: $\\psi$ stetig und $\\psi\'$ stetig.', '$1 + B = C$ und $ik(1 - B) = iqC$.'],
          model:[{l:'ψ_L(0) = ψ_R(0)', w:'ψ stetig'}, '1 + B = C', {l:'ψ_L\'(0) = ψ_R\'(0)', w:'ψ\' stetig'}, 'ik (1 - B) = iq C', 'k (1 - B) = q (1 + B)', 'B = (k - q)/(k + q)'],
          mistakes:[{expr:'(k + q)/(k - q)', msg:'Zähler und Nenner sind vertauscht: Für $V_0 \\to 0$ muss $B \\to 0$ gehen.'}]},
        {id:'b', prompt:'b) Berechne die Transmissionswahrscheinlichkeit $\\frac qk|C|^2$ mit $C = \\frac{2k}{k+q}$.', type:'value', target:'4k q/(k + q)^2', points:2, allowUnknowns:false,
          hints:['Der Faktor $q/k$ ist das Verhältnis der Stromdichten.'],
          model:['q/k |C|^2 = q/k (2k/(k + q))^2', '= 4k q/(k + q)^2']},
        {id:'c', prompt:'c) Zeige, dass $|B|^2 + \\frac qk|C|^2 = 1$ ist.', type:'value', target:'1', points:2,
          hints:['Bringe beide Brüche auf den Nenner $(k+q)^2$.', '$(k - q)^2 + 4kq = (k + q)^2$'],
          model:['|B|^2 + q/k |C|^2 = (k - q)^2/(k + q)^2 + 4k q/(k + q)^2', '= (k^2 + 2k q + q^2)/(k + q)^2', '= 1']}
      ]},
    {id:'tunnel-p2', title:'Stufe mit $E < V_0$: Eindringen',
      text:'Jetzt ist $E < V_0$. Rechts klingt die Welle ab: $\\psi_R = Ce^{-\\kappa x}$ mit $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$; links wie bisher $\\psi_L = e^{ikx} + Be^{-ikx}$.',
      ctx:TUN_DOWN(),
      goals:[
        {id:'a', prompt:'a) Bestimme $C$.', type:'solve', unknown:'C', points:3, ph:'1 + B = C',
          hints:['$\\psi_R\'(0) = -\\kappa C$.', 'Aus $1 + B = C$ und $ik(1 - B) = -\\kappa C$ folgt $ik(2 - C) = -\\kappa C$.'],
          model:['1 + B = C', {l:'ik (1 - B) = -κ C', w:'ψ\' stetig'}, 'ik (2 - C) = -κ C', '2ik = (ik - κ) C', 'C = 2ik/(ik - κ)', 'C = 2k/(k + iκ)']},
        {id:'b', prompt:'b) In welcher Tiefe $d$ ist die Aufenthaltsdichte $|\\psi|^2$ auf $1/e$ ihres Werts bei $x = 0$ gefallen?', type:'solve', unknown:'d', points:2,
          hints:['$|\\psi_R|^2 = |C|^2e^{-2\\kappa x}$.'],
          model:['e^(-2κ d) = e^(-1)', '2κ d = 1', 'd = 1/(2κ)'], note:'Für ein Elektron mit $V_0 - E = 1\\,\\mathrm{eV}$ ist $1/\\kappa \\approx 0{,}2\\,\\mathrm{nm}$.'}
      ]},
    {id:'tunnel-p3', title:'Gebundener Zustand im δ-Potential',
      text:'$V(x) = -\\alpha\\,\\delta(x)$ mit $\\alpha > 0$. Für einen gebundenen Zustand ($E < 0$) setzt man $\\psi(x) = A\\,e^{-\\kappa|x|}$ mit $\\kappa > 0$ an. Sprungbedingung: $\\psi\'(0^+) - \\psi\'(0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$.',
      ctx:TUN_DELTA(),
      goals:[
        {id:'a', prompt:'a) Bestimme $\\kappa$ aus der Sprungbedingung.', type:'solve', unknown:'κ', points:3,
          hints:['$\\psi\'(0^+) = -\\kappa A$, $\\psi\'(0^-) = +\\kappa A$.'],
          model:[{l:'-κ A - κ A = -2m α/ħ^2 A', w:'ψ\'(0⁺) − ψ\'(0⁻)'}, '2κ = 2m α/ħ^2', 'κ = m α/ħ^2'],
          mistakes:[{expr:'-m α/ħ^2', msg:'Vorzeichen prüfen: $\\psi\'(0^+) = -\\kappa A$, weil $\\psi$ nach rechts abfällt. Außerdem muss $\\kappa > 0$ sein.'}]},
        {id:'b', prompt:'b) Bestimme die Energie $E$.', type:'solve', unknown:'E', points:2,
          hints:['Für $x \\ne 0$ gilt $-\\frac{\\hbar^2}{2m}\\psi\'\' = E\\psi$ und $\\psi\'\' = \\kappa^2\\psi$.'],
          model:['-ħ^2/(2m) κ^2 = E', 'E = -ħ^2/(2m) (m α/ħ^2)^2', 'E = -m α^2/(2ħ^2)']},
        {id:'c', prompt:'c) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['$\\int_{-\\infty}^\\infty e^{-2\\kappa|x|}dx = 1/\\kappa$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2/κ = 1', 'A = sqrt(κ)', 'A = sqrt(m α)/ħ']}
      ]},
    {id:'tunnel-p4', title:'Rechteckbarriere bei halber Barrierenhöhe',
      text:'Für eine Rechteckbarriere der Höhe $V_0$ und Breite $a$ mit $E < V_0$ gilt $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1}$ mit $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$. Hier ist $E = V_0/2$. Die Größe $\\kappa$ kannst du direkt benutzen.',
      ctx:{coords:[], params:{m:'pos', V_0:'pos', a:'pos'}, defs:{E:'V_0/2', κ:'sqrt(2m (V_0 - E))/ħ'}},
      goals:[{id:'a', prompt:'Vereinfache $T$ so weit wie möglich.', type:'value', target:'1/cosh(κ a)^2', points:3, ph:'T = 1/(1 + V_0^2 sinh(κa)^2/(4E(V_0 - E)))',
        hints:['Setze $E = V_0/2$ ein: $4E(V_0 - E) = V_0^2$.', '$1 + \\sinh^2u = \\cosh^2u$.'],
        model:['T = 1/(1 + V_0^2 sinh(κa)^2/(4E(V_0 - E)))', '= 1/(1 + V_0^2 sinh(κa)^2/(4 · V_0/2 · V_0/2))', '= 1/(1 + sinh(κa)^2)', '= 1/cosh(κa)^2'],
        note:'Für $\\kappa a = 3$ ist $T \\approx 0{,}0099$; die Näherung $4e^{-2\\kappa a}$ liefert $0{,}0099$ – schon sehr gut.'}]},
    {id:'tunnel-p5', title:'Halbdurchlässige Barriere',
      text:'Wie in Aufgabe 4 ist $E = V_0/2$ und damit $T = 1/\\cosh^2(\\kappa a)$. Wie breit muss die Barriere sein, damit genau die Hälfte durchgeht?',
      ctx:{coords:[], params:{m:'pos', V_0:'pos'}, defs:{E:'V_0/2', κ:'sqrt(2m (V_0 - E))/ħ'}, unknowns:{a:{ref:'ln(1 + sqrt(2))/κ'}}},
      goals:[{id:'a', prompt:'Bestimme $a$.', type:'solve', unknown:'a', points:3,
        hints:['$\\cosh^2(\\kappa a) = 2$, also $\\cosh(\\kappa a) = \\sqrt2$.', '$\\operatorname{arcosh}y = \\ln(y + \\sqrt{y^2 - 1})$'],
        model:['1/cosh(κa)^2 = 1/2', 'cosh(κa) = sqrt(2)', 'κa = ln(sqrt(2) + 1)', 'a = ln(1 + sqrt(2))/κ']}]},
    {id:'tunnel-p6', title:'Stromdichte einer ebenen Welle',
      text:'Für $\\psi(x) = C\\,e^{iqx}$ mit reellem $C > 0$ ist die Wahrscheinlichkeitsstromdichte $j = \\frac{\\hbar}{2mi}\\left(\\psi^*\\psi\' - \\psi\\,\\psi^{*\\prime}\\right)$.',
      ctx:{coords:['x'], params:{m:'pos', q:'pos', C:'pos'}, defs:{'ψ(x)':'C e^(i q x)'}},
      goals:[{id:'a', prompt:'Berechne $j$.', type:'value', target:'ħ q C^2/m', points:2, ph:'j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')',
        hints:['$\\psi\' = iq\\psi$ und $(\\psi^*)\' = -iq\\psi^*$.'],
        model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) (i q C^2 + i q C^2)', '= ħ q C^2/m'],
        note:'$\\hbar q/m$ ist die Geschwindigkeit, $C^2$ die Dichte: $j = \\rho v$. Daher der Faktor $q/k$ in $T$.'}]}
  ],
  final:[
    {q:'Welche Anschlussbedingungen gelten am Sprung eines endlich hohen Potentials?', opts:['$\\psi$ und $\\psi\'$ sind stetig.', 'Nur $\\psi$ ist stetig, $\\psi\'$ springt.', '$\\psi$ ist am Sprung null.'], a:0, ex:'$\\psi\'$ springt nur bei $\\delta$-Potentialen; $\\psi = 0$ gilt an unendlich hohen Wänden.'},
    {task:{id:'tunnel-f1', title:'Energie im δ-Potential', text:'Für $V = -\\alpha\\delta(x)$ gilt $\\kappa = m\\alpha/\\hbar^2$. Berechne $E = -\\hbar^2\\kappa^2/(2m)$.',
      ctx:{coords:[], params:{m:'pos', α:'pos'}, defs:{κ:'m α/ħ^2'}},
      goals:[{id:'a', prompt:'Gib $E$ durch $m$, $\\alpha$, $\\hbar$ an.', type:'value', target:'-m α^2/(2ħ^2)', points:2, model:['E = -ħ^2 κ^2/(2m)', '= -ħ^2/(2m) · m^2 α^2/ħ^4', '= -m α^2/(2ħ^2)']}]}},
    {q:'Eine Barriere wird höher ($V_0$ größer), $E$ und $a$ bleiben gleich ($\\kappa a \\gg 1$). Wie ändert sich $T$?', opts:['$T$ sinkt stark, weil $\\kappa$ wächst.', '$T$ steigt.', '$T$ bleibt gleich.'], a:0, ex:'$\\kappa = \\sqrt{2m(V_0-E)}/\\hbar$ steht im Exponenten von $e^{-2\\kappa a}$.'},
    {task:{id:'tunnel-f2', title:'Reflexion bei $E = 2V_0$', text:'An der Stufe nach oben ist $R = \\left(\\frac{k-q}{k+q}\\right)^2$. Jetzt ist $E = 2V_0$; $k$ und $q$ kannst du direkt benutzen.',
      ctx:{coords:[], params:{m:'pos', V_0:'pos'}, defs:{E:'2V_0', k:'sqrt(2m E)/ħ', q:'sqrt(2m (E - V_0))/ħ'}},
      goals:[{id:'a', prompt:'Berechne $R$ exakt.', type:'value', target:'17 - 12 sqrt(2)', points:3, model:['q = k/sqrt(2)', '((k - q)/(k + q))^2 = ((1 - 1/sqrt(2))/(1 + 1/sqrt(2)))^2', '= ((sqrt(2) - 1)/(sqrt(2) + 1))^2', '= (sqrt(2) - 1)^4', '= 17 - 12 sqrt(2)'], note:'Das sind etwa 3 %.'}]}}
  ],
  errors:[
    {id:'tunnel-e1', title:'Wahrscheinlichkeitserhaltung an der Stufe',
      text:'An der Stufe mit $E > V_0$ ist $B = \\frac{k-q}{k+q}$ und $C = \\frac{2k}{k+q}$. Jemand will zeigen, dass Reflexion und Transmission zusammen 1 ergeben:',
      ctx:TUN_UP(),
      lines:['|B|^2 + |C|^2 = (k - q)^2/(k + q)^2 + 4k^2/(k + q)^2', '= (5k^2 - 2k q + q^2)/(k + q)^2', '= 1'],
      wrong:2,
      why:{q:'Was ist falsch?', opts:['$|C|^2$ ist nicht die Transmissionswahrscheinlichkeit; richtig ist $\\frac qk|C|^2$. Die letzte Zeile stimmt rechnerisch nicht.', 'Bei der Stufe gibt es keine Erhaltung.', '$|B|^2$ müsste $B$ heißen.'], a:0, ex:'$|B|^2 + |C|^2 = 1$ gilt nicht. Erhalten ist der Strom, und die Stromdichte rechts ist $\\frac{\\hbar q}{m}|C|^2$.'},
      fix:{id:'a', prompt:'Rechne richtig: Zeige $|B|^2 + \\frac qk|C|^2 = 1$.', type:'value', target:'1', model:['|B|^2 + q/k |C|^2 = (k - q)^2/(k + q)^2 + 4k q/(k + q)^2', '= (k + q)^2/(k + q)^2', '= 1']}},
    {id:'tunnel-e2', title:'Sprungbedingung beim δ-Potential',
      text:'Für $V = -\\alpha\\delta(x)$ und $\\psi = Ae^{-\\kappa|x|}$ wird gerechnet:',
      ctx:TUN_DELTA(),
      lines:['ψ(x) = A e^(-κ |x|)', 'κ A + κ A = -2m α/ħ^2 A', 'κ = -m α/ħ^2'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Die Ableitungen haben das falsche Vorzeichen: $\\psi\'(0^+) = -\\kappa A$ und $\\psi\'(0^-) = +\\kappa A$.', 'Es hätte $\\psi(0) = 0$ eingesetzt werden müssen.', 'Der Faktor 2 gehört nicht dahin.'], a:0, ex:'Rechts fällt $\\psi$ ab (negative Steigung), links steigt es zur Mitte hin an. Mit dem falschen Vorzeichen käme $\\kappa < 0$ heraus – nicht normierbar.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $\\kappa$.', type:'solve', unknown:'κ', model:['-κ A - κ A = -2m α/ħ^2 A', 'κ = m α/ħ^2']}}
  ]
});
lexe('anschluss', 'Anschlussbedingungen', 'An einem endlichen Potentialsprung bei $x_0$: $\\psi(x_0^-) = \\psi(x_0^+)$ und $\\psi\'(x_0^-) = \\psi\'(x_0^+)$. An einer unendlich hohen Wand nur $\\psi = 0$ ($\\psi\'$ springt). Bei $V = -\\alpha\\delta(x - x_0)$: $\\psi$ stetig und $\\psi\'(x_0^+) - \\psi\'(x_0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(x_0)$.', {topic:'tunnel'});
lexe('reflexion-transmission', 'Reflexion und Transmission', 'Verhältnisse der Wahrscheinlichkeitsströme: $R = |j_{ref}|/j_{ein}$, $T = j_{trans}/j_{ein}$, $R + T = 1$. Für $\\psi_L = e^{ikx} + Be^{-ikx}$, $\\psi_R = Ce^{iqx}$: $R = |B|^2$, $T = \\frac qk|C|^2$. Stufe mit $E > V_0$: $R = \\left(\\frac{k-q}{k+q}\\right)^2$, $T = \\frac{4kq}{(k+q)^2}$.', {topic:'tunnel'});
lexe('tunneleffekt', 'Tunneleffekt', 'Ein Teilchen mit $E < V_0$ durchdringt eine Barriere endlicher Breite $a$ mit der Wahrscheinlichkeit $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0-E)}\\right]^{-1}$, $\\kappa = \\sqrt{2m(V_0-E)}/\\hbar$. Für $\\kappa a \\gg 1$: $T \\approx 16\\frac{E}{V_0}(1 - \\frac{E}{V_0})e^{-2\\kappa a}$. Beispiele: Alpha-Zerfall, Rastertunnelmikroskop, Tunneldiode.', {topic:'tunnel'});
lexe('eindringtiefe', 'Eindringtiefe', 'Im klassisch verbotenen Bereich ($E < V$) ist $\\psi \\propto e^{-\\kappa x}$ mit $\\kappa = \\sqrt{2m(V-E)}/\\hbar$. $\\psi$ fällt auf der Länge $1/\\kappa$ auf $1/e$, die Dichte $|\\psi|^2$ auf der Länge $1/(2\\kappa)$.', {topic:'tunnel'});
lexe('delta-potential', 'δ-Potential', '$V(x) = -\\alpha\\delta(x)$, $\\alpha > 0$: genau ein gebundener Zustand $\\psi = \\sqrt\\kappa\\,e^{-\\kappa|x|}$ mit $\\kappa = m\\alpha/\\hbar^2$ und $E = -\\frac{m\\alpha^2}{2\\hbar^2}$. Für Streuzustände ($E > 0$) ist $T = \\left(1 + \\frac{m\\alpha^2}{2\\hbar^2E}\\right)^{-1}$.', {topic:'tunnel'});
lexe('endlicher-topf', 'Endlicher Potentialtopf', '$V = -V_0$ für $|x| < a$, sonst 0. Gebundene Zustände mit $-V_0 < E < 0$: innen Schwingung ($\\cos lx$ oder $\\sin lx$), außen $e^{-\\kappa|x|}$. Die Anschlussbedingungen führen auf transzendente Gleichungen, z. B. $\\tan(la) = \\kappa/l$ für gerade Zustände. Es gibt immer mindestens einen gebundenen Zustand; die Anzahl wächst mit $a\\sqrt{2mV_0}/\\hbar$.', {topic:'tunnel'});
