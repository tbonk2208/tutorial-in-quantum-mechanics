/* ===== Thema 7: Harmonischer Oszillator ===== */
const OSZ_MAT = (extra) => Object.assign({rep:'mat', mat:{preset:'osc'}, coords:['t'], params:{m:'pos', ω:'pos', n:{int:[0, 5]}}, sumFrom:0}, extra || {});
const OSZ_POS = (extra) => Object.assign({coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_0(x)':'(m ω/(π ħ))^(1/4) e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'}, normalized:true, state:'ψ_0'}, extra || {});
const OSZ_GROUND = () => ({coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_0(x)':'A e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'},
  unknowns:{A:{ref:'(m ω/(π ħ))^(1/4)', alt:['-(m ω/(π ħ))^(1/4)']}, β:{ref:'-m ω/ħ', kind:'real'}}});
const OSZ_XI = () => ({coords:['ξ'], params:{}, abstract:{h:{args:['ξ']}}});
const OSZ_PSI1 = () => ({coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_1(x)':'(4/π)^(1/4) (m ω/ħ)^(3/4) x e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'}, normalized:true, state:'ψ_1'});
topic({
  id:'osz', math:['m-spezial', 'm-analysis'], title:'Harmonischer Oszillator', short:'Oszillator',
  src:'Griffiths & Schroeter Kap. 2 · Nolting 5/1 Kap. 4 · Schwabl Kap. 3',
  goals:[
    'Ich kann mit den Leiteroperatoren $\\hat a$, $\\hat a^\\dagger$ rechnen und daraus das Spektrum $E_n = \\hbar\\omega(n + \\tfrac12)$ begründen.',
    'Ich kann den Grundzustand aus $\\hat a\\psi_0 = 0$ bestimmen und Erwartungswerte wie $\\langle x^2\\rangle$, $\\langle T\\rangle$, $\\langle V\\rangle$ berechnen.',
    'Ich kann Matrixelemente $\\langle m|\\hat x|n\\rangle$ ausrechnen und die Zeitentwicklung von $\\langle x\\rangle$ angeben.'
  ],
  needs:'Kommutatoren, besonders $[\\hat x,\\hat p] = i\\hbar$ · Gauß-Integrale · Dirac-Notation',
  wozu:'Fast jedes System nahe einer stabilen Gleichgewichtslage ist ein harmonischer Oszillator: die Schwingung zweier Atome in einem Molekül, die Gitterschwingungen eines Kristalls, jede Mode des elektromagnetischen Feldes. Die Infrarotspektroskopie misst die Schwingungsquanten $\\hbar\\omega$ von Molekülen und erkennt daran Bindungen – bei Chlorwasserstoff etwa bei $\\lambda \\approx 3{,}5\\,\\mu\\mathrm m$. Die Rechenmethode mit Leiteroperatoren kehrt beim Drehimpuls und in der Quantenfeldtheorie wieder.',
  bridge:'Aus Thema 6 brauchst du Dirac-Schreibweise, Kommutatoren, hermitesche Operatoren und $[\\hat x,\\hat p] = i\\hbar$, aus Thema 2 stationäre Zustände und ihre Zeitentwicklung. Knoten und das Abklingen im klassisch verbotenen Bereich kennst du aus Thema 3 und 5. Neu ist, ein Spektrum rein algebraisch herzuleiten.',
  diag:[
    {q:'Wie beginnst du, um $\\langle n|\\hat x^2|n\\rangle$ zu berechnen?', opts:['$\\hat x$ durch $\\hat a$ und $\\hat a^\\dagger$ ausdrücken und ausmultiplizieren', '$\\psi_n(x)$ als Potenzreihe ansetzen und die Gleichung lösen', '$\\langle n|\\hat x|n\\rangle$ berechnen und das Ergebnis quadrieren'], a:0,
      ex:'Mit $\\hat x = \\sqrt{\\hbar/(2m\\omega)}\\,(\\hat a + \\hat a^\\dagger)$ zählt man nur die Wege auf der Leiter, die zu $|n\\rangle$ zurückführen. $\\langle x\\rangle^2$ ist nicht $\\langle x^2\\rangle$; hier ist $\\langle x\\rangle = 0$, aber $\\langle x^2\\rangle > 0$. (Wer $E_n$ kennt, kommt auch mit dem Virialsatz zum Ziel.)'},
    {q:'Ein Oszillator startet im Zustand $(|0\\rangle + |1\\rangle)/\\sqrt2$. Wie beginnst du, um $\\langle x\\rangle(t)$ zu bestimmen?', opts:['Jeden Anteil mit seinem Phasenfaktor $e^{-iE_nt/\\hbar}$ versehen', 'Die klassische Lösung $x(t) = A\\cos(\\omega t)$ einsetzen', '$\\langle x\\rangle$ bei $t = 0$ berechnen; der Wert bleibt konstant'], a:0,
      ex:'Jeder Eigenzustand bekommt seine eigene Phase (Thema 2). Weil die Phasen verschieden sind, entsteht im Mischterm $e^{\\pm i\\omega t}$, und $\\langle x\\rangle$ schwingt. Konstant wäre $\\langle x\\rangle$ nur in einem stationären Zustand.'}
  ],
  phenomenon:{
    title:'Wasserstoff und Deuterium',
    text:'Ein H₂-Molekül und ein D₂-Molekül (Deuterium: Kern aus Proton und Neutron) haben dieselben Elektronen. Deshalb ist ihre Potentialkurve $V(R)$ als Funktion des Kernabstands $R$ in sehr guter Näherung dieselbe: gleich tiefe Mulde, gleiche Krümmung. D₂ ist aber etwa doppelt so schwer.\n\nBeide Gase werden so weit wie möglich abgekühlt. Dann misst man, wie viel Energie man zuführen muss, um ein Molekül in zwei Atome zu zerlegen (Dissoziationsenergie).',
    q:{q:'Welches Molekül braucht mehr Energie zur Dissoziation?', opts:['Beide gleich viel – die Mulde ist ja gleich tief.', 'D₂ – es sitzt tiefer in der Mulde.', 'H₂ – leichtere Kerne sind fester gebunden.'], a:1,
      ex:'D₂ braucht mehr, weil seine Nullpunktsenergie kleiner ist.',
      fb:['So wäre es klassisch: Ein abgekühltes Molekül ruhte im Minimum, und beide bräuchten genau die Muldentiefe. Quantenmechanisch bleibt aber eine Nullpunktsenergie – und die hängt von der Masse ab.',
        'Richtig. Das schwerere D₂ schwingt langsamer, denn $\\omega = \\sqrt{k/\\mu}$. Seine Nullpunktsenergie ist kleiner, es liegt tiefer unter der Dissoziationsgrenze.',
        'Die Bindung selbst – die Mulde – ist für beide gleich. Der Unterschied liegt in der Nullpunktsenergie, und die ist beim leichteren H₂ größer, nicht kleiner.']},
    reveal:'Gemessen werden etwa $4{,}48\\,\\mathrm{eV}$ für H₂ und $4{,}56\\,\\mathrm{eV}$ für D₂. Der Unterschied von rund $0{,}08\\,\\mathrm{eV}$ ist in harmonischer Näherung die Differenz der Nullpunktsenergien $\\tfrac12\\hbar\\omega$. Mit gleichem $k$ und doppelter reduzierter Masse ist $\\omega_{\\mathrm{D_2}} \\approx \\omega_{\\mathrm{H_2}}/\\sqrt2$. Für H₂ ist $\\tfrac12\\hbar\\omega \\approx 0{,}27\\,\\mathrm{eV}$, für D₂ etwa $0{,}19\\,\\mathrm{eV}$.\n\nEin Molekül kann also auch bei $T \\to 0$ nicht ruhen. In diesem Thema leitest du her, warum die tiefste Energie eines Oszillators $\\tfrac12\\hbar\\omega$ ist und nicht null.'
  },
  teach:[
    {id:'osz-t1', title:'Warum gerade die Parabel?',
      text:[
        'Fast jedes System, das um eine stabile Gleichgewichtslage schwingt, ist bei kleinen Auslenkungen ein harmonischer Oszillator. Der Grund ist die [[lex:taylor|Taylor-Entwicklung]]. Hat ein Potential $V(x)$ bei $x_{\\min}$ ein Minimum, so ist dort $V\'(x_{\\min}) = 0$, und es bleibt',
        '$$V(x) \\approx V(x_{\\min}) + \\tfrac12V\'\'(x_{\\min})\\,(x - x_{\\min})^2.$$',
        'Die Konstante $V(x_{\\min})$ verschiebt nur den Energienullpunkt. Mit der Federkonstanten $k = V\'\'(x_{\\min}) > 0$ und $\\omega = \\sqrt{k/m}$ wird daraus $V = \\tfrac12m\\omega^2x^2$, wenn man $x$ ab dem Minimum misst. So beschreibt man die Schwingung zweier Atome in einem Molekül (mit der reduzierten Masse), die Schwingungen der Atome in einem Kristall und jede Mode des elektromagnetischen Feldes in einem Hohlraum. Der Oszillator ist deshalb neben dem Wasserstoffatom das wichtigste exakt lösbare Modell der Quantenmechanik.',
        '**Klassisch** schwingt das Teilchen als $x(t) = A\\cos(\\omega t)$ mit der Energie $E = \\tfrac12m\\omega^2A^2$. Jede Energie $E \\ge 0$ ist möglich, auch $E = 0$: Das Teilchen ruht im Minimum. Zwischen den Umkehrpunkten $\\pm A$ hält es sich dort am längsten auf, wo es langsam ist, also am Rand. Die klassische Aufenthaltsdichte ist',
        '$$\\rho_{\\text{kl}}(x) = \\frac{1}{\\pi\\sqrt{A^2 - x^2}},\\qquad |x| < A.$$',
        'Sie wird an den Umkehrpunkten unendlich, ist aber normiert. Im Labor ist sie gestrichelt eingezeichnet.',
        '**Quantenmechanisch** lautet der [[lex:hamilton|Hamilton-Operator]]',
        '$$\\hat H = \\frac{\\hat p^2}{2m} + \\frac12m\\omega^2\\hat x^2.$$',
        'Gesucht sind die stationären Zustände, also die Lösungen von $\\hat H\\psi = E\\psi$ (Thema 2). Man kann diese Differentialgleichung direkt lösen; Abschnitt 5 skizziert das. Eleganter ist eine algebraische Methode, die nur $[\\hat x,\\hat p] = i\\hbar$ benutzt. Ihr gehören die nächsten drei Abschnitte.',
        '**Natürliche Einheiten.** Aus $m$, $\\omega$ und $\\hbar$ lassen sich genau eine Länge und eine Energie bilden:',
        '$$\\sqrt{\\frac{\\hbar}{m\\omega}}\\quad\\text{(Oszillatorlänge)},\\qquad \\hbar\\omega\\quad\\text{(Energiequant)}.$$',
        'Jedes Ergebnis muss sich in diesen Einheiten schreiben lassen. Das ist eine gute Probe: $\\langle x^2\\rangle$ muss ein Vielfaches von $\\hbar/(m\\omega)$ sein. Ein Ergebnis wie $\\hbar/(m\\omega^2)$ hat die falsche Einheit und kann nicht stimmen.'
      ].join('\n\n'),
      q:[
        {q:'Ein Potential hat bei $x_{\\min}$ ein Minimum mit $V\'\'(x_{\\min}) = k$. Welche Kreisfrequenz hat die kleine Schwingung eines Teilchens der Masse $m$?', opts:['$\\sqrt{k/m}$', '$k/m$', '$\\sqrt{km}$'], a:0, ex:'$V \\approx \\tfrac12k(x - x_{\\min})^2$ ist eine Feder mit Federkonstante $k$, also $\\omega = \\sqrt{k/m}$.'},
        {q:'Welcher Ausdruck hat die Einheit einer Länge?', opts:['$\\sqrt{\\hbar/(m\\omega)}$', '$\\hbar/(m\\omega)$', '$\\sqrt{\\hbar m/\\omega}$'], a:0, ex:'$\\hbar/(m\\omega)$ hat die Einheit $\\mathrm{J\\,s}/(\\mathrm{kg\\,s^{-1}}) = \\mathrm m^2$, die Wurzel also Meter.'}
      ]},
    {id:'osz-t2', title:'Faktorisieren: vom Kommutator zu den Leiteroperatoren',
      text:[
        'Für Zahlen gilt $u^2 + v^2 = (u - iv)(u + iv)$. Diracs Idee: Man zerlegt $\\hat H = \\frac{1}{2m}\\left[\\hat p^2 + (m\\omega\\hat x)^2\\right]$ genauso in zwei Faktoren. Dazu definiert man die [[lex:leiteroperatoren|Leiteroperatoren]]',
        '$$\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right),\\qquad \\hat a^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - \\frac{i}{m\\omega}\\hat p\\right).$$',
        'Weil $\\hat x$ und $\\hat p$ [[lex:hermitescher-operator|hermitesch]] sind, ist $\\hat a^\\dagger$ wirklich die Adjungierte von $\\hat a$. Der Vorfaktor macht beide dimensionslos.',
        'Beim Ausmultiplizieren von $\\hat a^\\dagger\\hat a$ darf man die Reihenfolge nicht vertauschen. Es bleiben zwei Mischterme $\\hat x\\hat p$ und $\\hat p\\hat x$ übrig. Sie heben sich nicht weg, sondern ergeben den [[lex:kommutator|Kommutator]] $[\\hat x,\\hat p] = i\\hbar$. Die Herleitung zeigt das Zeile für Zeile; im Rechenblatt schreibst du die Operatoren ohne Dach. Ergebnis:',
        '$$\\hat a^\\dagger\\hat a = \\frac{\\hat H}{\\hbar\\omega} - \\frac12,\\qquad\\text{also}\\qquad \\hat H = \\hbar\\omega\\left(\\hat a^\\dagger\\hat a + \\tfrac12\\right).$$',
        'Das $\\tfrac12$ ist kein Rechentrick. Es stammt genau aus dem Kommutator. Wären $\\hat x$ und $\\hat p$ vertauschbar wie klassische Zahlen, fehlte es. Darin steckt schon die [[lex:nullpunktsenergie|Nullpunktsenergie]].',
        'Genauso rechnet man den Kommutator der Leiteroperatoren aus. Nur die gemischten Terme tragen bei:',
        '$$[\\hat a,\\hat a^\\dagger] = \\frac{m\\omega}{2\\hbar}\\cdot\\left(-\\frac{2i}{m\\omega}\\right)[\\hat x,\\hat p] = 1,\\qquad\\text{also}\\qquad \\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1.$$',
        'Den Operator $\\hat N = \\hat a^\\dagger\\hat a$ nennt man Besetzungszahloperator. Er ist hermitesch, denn $(\\hat a^\\dagger\\hat a)^\\dagger = \\hat a^\\dagger\\hat a$. Das Eigenwertproblem von $\\hat H$ ist damit auf das von $\\hat N$ zurückgeführt: Hat $\\hat N$ den Eigenwert $\\nu$, so hat $\\hat H$ denselben Eigenvektor mit dem Eigenwert $\\hbar\\omega(\\nu + \\tfrac12)$.',
        '**Achtung:** $\\hat a$ selbst ist *nicht* hermitesch, denn $\\hat a^\\dagger \\ne \\hat a$. Es ist keine Observable, und $\\hat a\\psi$ beschreibt weder eine Messung noch einen physikalischen Vorgang. $\\hat a$ ist ein Rechenwerkzeug, das Eigenzustände ineinander überführt – wie, zeigt der nächste Abschnitt.'
      ].join('\n\n'),
      derive:{ctx:OSZ_MAT(), lines:[
        {l:'a† a = mω/(2ħ) (x - i/(mω) p)(x + i/(mω) p)', w:'Definitionen eingesetzt',
          why:{q:'Warum steht $\\hat a^\\dagger$ links?', opts:['So ist $\\hat a^\\dagger\\hat a$ definiert; die Reihenfolge zählt.', 'Die Reihenfolge ist egal, es sind Faktoren.', 'Weil $\\hat a^\\dagger$ hermitesch ist und vorn steht.'], a:0, ex:'Operatoren vertauschen im Allgemeinen nicht. $\\hat a\\hat a^\\dagger$ ist ein anderer Operator, nämlich $\\hat a^\\dagger\\hat a + 1$.'}},
        {l:'= mω/(2ħ) (x^2 + p^2/(m^2 ω^2) + i/(mω) (x p - p x))',
          why:{q:'Woher kommen die beiden Mischterme?', opts:['Aus $\\frac{i}{m\\omega}\\hat x\\hat p$ und $-\\frac{i}{m\\omega}\\hat p\\hat x$', 'Aus der Normierung von $\\hat a$', 'Aus $\\hat x^2 + \\hat p^2$ durch Umstellen'], a:0, ex:'$(\\hat x - i\\hat p/m\\omega)(\\hat x + i\\hat p/m\\omega)$ hat vier Terme. Die beiden gemischten behalten ihre Reihenfolge.'}},
        {l:'= mω/(2ħ) (x^2 + p^2/(m^2 ω^2) + i/(mω) [x, p])',
          why:{q:'Was steht in der letzten Klammer?', opts:['der Kommutator $[\\hat x,\\hat p] = i\\hbar$', 'null, weil $\\hat x\\hat p = \\hat p\\hat x$', 'der Antikommutator $\\hat x\\hat p + \\hat p\\hat x$'], a:0, ex:'$\\hat x\\hat p - \\hat p\\hat x = [\\hat x,\\hat p] = i\\hbar$ – das ist der einzige quantenmechanische Eingriff in die Rechnung.'}},
        {l:'= mω/(2ħ) x^2 + p^2/(2m ħ ω) - 1/2',
          why:{q:'Woher kommt $-\\tfrac12$?', opts:['$\\frac{m\\omega}{2\\hbar}\\cdot\\frac{i}{m\\omega}\\cdot i\\hbar = -\\frac12$', '$\\frac{m\\omega}{2\\hbar}\\cdot\\frac{1}{m\\omega}\\cdot\\hbar = \\frac12$, Vorzeichen frei', 'aus der Nullpunktsenergie, die man einsetzt'], a:0, ex:'$i\\cdot i = -1$. Das Vorzeichen ist wichtig: Es führt zu $+\\tfrac12$ in $\\hat H$.'}},
        {l:'= H/(ħω) - 1/2',
          why:{q:'Warum sind die beiden ersten Terme $\\hat H/(\\hbar\\omega)$?', opts:['Sie sind $\\tfrac12m\\omega^2\\hat x^2$ und $\\hat p^2/2m$, je geteilt durch $\\hbar\\omega$.', 'Weil $\\hat H$ als $\\hat a^\\dagger\\hat a$ definiert ist.', 'Weil $\\hat x^2 = \\hat p^2$ in natürlichen Einheiten gilt.'], a:0, ex:'$\\frac{m\\omega}{2\\hbar}\\hat x^2 = \\frac{1}{\\hbar\\omega}\\cdot\\frac12m\\omega^2\\hat x^2$ und $\\frac{\\hat p^2}{2m\\hbar\\omega} = \\frac{1}{\\hbar\\omega}\\cdot\\frac{\\hat p^2}{2m}$.'}},
        {l:'H = ħω (a† a + 1/2)', w:'nach Ĥ aufgelöst'},
        {l:'[a, a†] = 1',
          why:{q:'Was folgt daraus für $\\hat a\\hat a^\\dagger$?', opts:['$\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$', '$\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a$', '$\\hat a\\hat a^\\dagger = 1$'], a:0, ex:'$[\\hat a,\\hat a^\\dagger] = \\hat a\\hat a^\\dagger - \\hat a^\\dagger\\hat a = 1$. Diese Regel braucht man ständig.'}}
      ]},
      q:[
        {q:'Was wäre $\\hat a^\\dagger\\hat a$, wenn $\\hat x$ und $\\hat p$ vertauschten?', opts:['$\\hat H/(\\hbar\\omega)$, ohne den Term $-\\tfrac12$', '$\\hat H/(\\hbar\\omega) - \\tfrac12$, wie vorher', '$\\hat H/(\\hbar\\omega) + \\tfrac12$, mit anderem Vorzeichen'], a:0, ex:'Das $-\\tfrac12$ kommt allein aus $[\\hat x,\\hat p] = i\\hbar$. Ohne Kommutator gäbe es keine Nullpunktsenergie – wie klassisch.'},
        {q:'Ist $\\hat a$ eine Observable?', opts:['Nein, denn $\\hat a^\\dagger \\ne \\hat a$.', 'Ja, sie misst die Zahl der Quanten.', 'Ja, weil $\\hat x$ und $\\hat p$ Observablen sind.'], a:0, ex:'Observablen sind hermitesch. $\\hat a$ ist es nicht; seine Erwartungswerte sind im Allgemeinen komplex. Die Zahl der Quanten misst $\\hat N = \\hat a^\\dagger\\hat a$.'}
      ]},
    {id:'osz-t3', title:'Die Leiter: absteigen, aufsteigen – und wo sie endet',
      text:[
        'Angenommen, $\\psi$ ist ein Eigenzustand von $\\hat H$ mit der Energie $E$. Was ist dann $\\hat a\\psi$? Der Schlüssel ist der Kommutator',
        '$$[\\hat H, \\hat a] = -\\hbar\\omega\\,\\hat a,\\qquad [\\hat H,\\hat a^\\dagger] = +\\hbar\\omega\\,\\hat a^\\dagger.$$',
        'Die Herleitung braucht nur $\\hat H = \\hbar\\omega(\\hat a^\\dagger\\hat a + \\tfrac12)$ und $[\\hat a,\\hat a^\\dagger] = 1$. Schreibt man $\\hat H\\hat a = \\hat a\\hat H + [\\hat H,\\hat a]$, folgt',
        '$$\\hat H(\\hat a\\psi) = \\hat a\\hat H\\psi - \\hbar\\omega\\,\\hat a\\psi = (E - \\hbar\\omega)\\,(\\hat a\\psi).$$',
        'Also ist $\\hat a\\psi$ wieder ein Eigenzustand, mit einer um $\\hbar\\omega$ kleineren Energie – oder der Nullvektor. Ebenso hebt $\\hat a^\\dagger$ die Energie um $\\hbar\\omega$. Daher die Namen Absteiger und Aufsteiger (oder Vernichter und Erzeuger). Von einem einzigen Eigenzustand aus erreicht man eine ganze Leiter von Energien im Abstand $\\hbar\\omega$.',
        '**Die Leiter muss unten enden.** Für jeden Zustand $\\psi$ gilt',
        '$$\\langle\\psi|\\hat a^\\dagger\\hat a|\\psi\\rangle = \\langle\\hat a\\psi|\\hat a\\psi\\rangle = \\|\\hat a\\psi\\|^2 \\ge 0.$$',
        'Im ersten Schritt wird $\\hat a^\\dagger$ als Adjungierte in das Bra gezogen (Thema 6). Ist $\\psi$ ein normierter Eigenzustand von $\\hat N$ mit Eigenwert $\\nu$, so steht links $\\nu$. Alle Eigenwerte von $\\hat N$ sind also nichtnegativ, und für die Energie gilt $E \\ge \\tfrac12\\hbar\\omega$.',
        'Wendet man $\\hat a$ immer wieder an, sinkt $\\nu$ bei jedem Schritt um 1. Irgendwann würde $\\nu$ negativ – das ist verboten. Die Kette muss also abbrechen: Es gibt einen Zustand $\\psi_0$ mit $\\hat a\\psi_0 = 0$. Für ihn ist $\\hat N\\psi_0 = \\hat a^\\dagger(\\hat a\\psi_0) = 0$, also $\\nu = 0$ und',
        '$$E_0 = \\tfrac12\\hbar\\omega.$$',
        'Abbrechen kann die Kette nur bei $\\nu = 0$, denn für $\\nu > 0$ ist $\\|\\hat a\\psi\\|^2 = \\nu > 0$. Darum muss jedes $\\nu$ ganzzahlig sein. Hätte $\\hat N$ etwa den Eigenwert $2{,}5$, käme man über $1{,}5$ und $0{,}5$ zu $-0{,}5$, ohne je auf null zu treffen – ein Widerspruch. Steigt man von $\\psi_0$ mit $\\hat a^\\dagger$ auf, bricht die Leiter nie ab, denn $\\|\\hat a^\\dagger\\psi\\|^2 = \\nu + 1 > 0$. Das ganze [[lex:oszillator-spektrum|Spektrum]] ist',
        '$$E_n = \\hbar\\omega\\left(n + \\tfrac12\\right),\\qquad n = 0, 1, 2, \\dots$$',
        'Es ist äquidistant, beginnt bei der Nullpunktsenergie und ist in einer Dimension nicht entartet: $\\hat a\\psi_0 = 0$ hat bis auf einen Faktor nur eine Lösung (Abschnitt 5), und jeder höhere Zustand entsteht eindeutig daraus.',
        '**Typische Fehlvorstellung:** „Im Grundzustand ruht das Teilchen, also ist $E_0 = 0$.“ Die Rechnung zeigt das Gegenteil. $\\hat a\\psi_0 = 0$ heißt nicht $E = 0$, sondern $\\hat N\\psi_0 = 0$; die Energie $\\tfrac12\\hbar\\omega$ bleibt. Dasselbe folgt aus der [[lex:robertson|Unschärferelation]]: Ruhe im Minimum hieße $\\Delta x = 0$ und $\\Delta p = 0$ zugleich.'
      ].join('\n\n'),
      derive:{ctx:OSZ_MAT({params:{m:'pos', ω:'pos', n:{int:[0, 5]}, ν:{int:[0, 5]}}}), lines:[
        {l:'[H, a] = ħω [a† a, a]',
          why:{q:'Wohin ist der Summand $\\tfrac12$ aus $\\hat H$ verschwunden?', opts:['Eine Zahl vertauscht mit jedem Operator.', 'Er hebt sich gegen $[\\hat a,\\hat a^\\dagger] = 1$ weg.', 'Er wird erst am Ende addiert.'], a:0, ex:'$[\\tfrac12\\hbar\\omega, \\hat a] = 0$. Nur $\\hbar\\omega\\,\\hat a^\\dagger\\hat a$ trägt bei.'}},
        {l:'= ħω (a† a a - a a† a)', w:'Kommutator ausgeschrieben'},
        {l:'= ħω [a†, a] a',
          why:{q:'Warum darf man $\\hat a$ rechts ausklammern?', opts:['Beide Terme enden auf $\\hat a$; die Reihenfolge bleibt.', 'Weil $\\hat a$ mit $\\hat a^\\dagger$ vertauscht und man umordnen darf.', 'Weil $\\hat a\\hat a = 0$ ist und dieser Term entfällt.'], a:0, ex:'$\\hat a^\\dagger\\hat a\\hat a - \\hat a\\hat a^\\dagger\\hat a = (\\hat a^\\dagger\\hat a - \\hat a\\hat a^\\dagger)\\hat a = [\\hat a^\\dagger,\\hat a]\\,\\hat a$.'}},
        {l:'= -ħω a',
          why:{q:'Welcher Kommutator wurde eingesetzt?', opts:['$[\\hat a^\\dagger,\\hat a] = -1$', '$[\\hat a^\\dagger,\\hat a] = +1$', '$[\\hat a^\\dagger,\\hat a] = i\\hbar$'], a:0, ex:'Vertauscht man die Argumente in $[\\hat a,\\hat a^\\dagger] = 1$, dreht sich das Vorzeichen.'}},
        {l:'H a|ν⟩ = a H|ν⟩ - ħω a|ν⟩',
          why:{q:'Woher kommt diese Zeile?', opts:['Aus $\\hat H\\hat a = \\hat a\\hat H + [\\hat H,\\hat a]$', 'Aus $\\hat H\\hat a = \\hat a\\hat H$', 'Aus der Schrödingergleichung mit Zeitableitung'], a:0, ex:'Mit $[\\hat H,\\hat a] = -\\hbar\\omega\\hat a$ wird $\\hat H\\hat a = \\hat a\\hat H - \\hbar\\omega\\hat a$. Hier ist $|\\nu\\rangle$ ein Eigenzustand von $\\hat N$ mit noch beliebigem Eigenwert $\\nu$, also mit der Energie $E = \\hbar\\omega(\\nu + \\tfrac12)$. Dass $\\nu$ ganzzahlig ist, zeigt erst das Argument unten.'}},
        {l:'H a|ν⟩ = (ν - 1/2) ħω a|ν⟩',
          why:{q:'Was bedeutet diese Zeile?', opts:['$\\hat a|\\nu\\rangle$ hat die Energie $E - \\hbar\\omega$ (oder ist null).', '$\\hat a|\\nu\\rangle$ hat dieselbe Energie wie $|\\nu\\rangle$.', 'Die Energie von $|\\nu\\rangle$ ist $(\\nu - \\tfrac12)\\hbar\\omega$.'], a:0, ex:'$(\\nu + \\tfrac12)\\hbar\\omega - \\hbar\\omega = (\\nu - \\tfrac12)\\hbar\\omega$: eine Sprosse tiefer.'}}
      ]},
      q:[
        {q:'$\\psi$ ist Eigenzustand mit $E = \\tfrac72\\hbar\\omega$. Was ist $\\hat a\\psi$?', opts:['ein Eigenzustand zu $\\tfrac52\\hbar\\omega$', 'ein Eigenzustand zu $\\tfrac92\\hbar\\omega$', 'wieder ein Eigenzustand zu $\\tfrac72\\hbar\\omega$'], a:0, ex:'$\\hat a$ senkt um $\\hbar\\omega$. Normiert ist $\\hat a\\psi$ allerdings nicht (Abschnitt 4).'},
        {q:'Warum kann $\\hat N$ nicht den Eigenwert $\\nu = 0{,}3$ haben?', opts:['Absteigen ergäbe einen Zustand mit $\\nu = -0{,}7$.', 'Weil $\\hat N$ nur gerade Eigenwerte hat.', 'Weil $0{,}8\\,\\hbar\\omega$ unter $\\tfrac12\\hbar\\omega$ liegt.'], a:0, ex:'$\\|\\hat a\\psi\\|^2 = 0{,}3 > 0$, also ist $\\hat a\\psi \\ne 0$ ein Eigenvektor mit $\\nu = -0{,}7 < 0$ – verboten. (Die Energie $0{,}8\\,\\hbar\\omega$ läge übrigens über $\\tfrac12\\hbar\\omega$.)'}
      ]},
    {id:'osz-t4', title:'Normierte Leiterzustände und Matrixelemente',
      text:[
        'Für Rechnungen braucht man die Zahlenfaktoren. Wir schreiben $|n\\rangle$ für den normierten Eigenzustand mit $\\hat N|n\\rangle = n|n\\rangle$ ([[lex:dirac-notation|Dirac-Schreibweise]], Thema 6). Weil $\\hat a|n\\rangle$ proportional zu $|n-1\\rangle$ ist, setzt man $\\hat a|n\\rangle = c_n|n-1\\rangle$. Den Betrag von $c_n$ liefert die Norm:',
        '$$|c_n|^2 = \\|\\hat a|n\\rangle\\|^2 = \\langle n|\\hat a^\\dagger\\hat a|n\\rangle = n.$$',
        'Die Phase ist frei; man wählt $c_n = \\sqrt n$ reell und positiv. Für den Aufsteiger braucht man $\\hat a\\hat a^\\dagger = \\hat N + 1$, also $\\|\\hat a^\\dagger|n\\rangle\\|^2 = n + 1$. Zusammen:',
        '$$\\hat a|n\\rangle = \\sqrt n\\,|n-1\\rangle,\\qquad \\hat a^\\dagger|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle,\\qquad |n\\rangle = \\frac{(\\hat a^\\dagger)^n}{\\sqrt{n!}}\\,|0\\rangle.$$',
        'Merkhilfe: Unter der Wurzel steht immer die größere der beiden Zahlen $n$ und $n\\pm1$. Probe mit $n = 0$: $\\hat a|0\\rangle = 0$, aber $\\hat a^\\dagger|0\\rangle = |1\\rangle$.',
        '**Ort und Impuls auf der Leiter.** Addiert und subtrahiert man die Definitionen von $\\hat a$ und $\\hat a^\\dagger$, erhält man [[lex:osz-orts-impuls|Ort und Impuls]]:',
        '$$\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}\\,(\\hat a + \\hat a^\\dagger),\\qquad \\hat p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}\\,(\\hat a^\\dagger - \\hat a).$$',
        'Damit werden Matrixelemente zu Abzählaufgaben. $\\hat x$ ändert $n$ um genau $\\pm1$. Darum ist $\\langle m|\\hat x|n\\rangle$ nur für $m = n\\pm1$ von null verschieden, etwa $\\langle n+1|\\hat x|n\\rangle = \\sqrt{\\hbar/(2m\\omega)}\\,\\sqrt{n+1}$. Insbesondere ist $\\langle n|\\hat x|n\\rangle = \\langle n|\\hat p|n\\rangle = 0$.',
        'In $\\hat x^2$ tragen zu $\\langle n|\\hat x^2|n\\rangle$ nur die Terme bei, die gleich oft auf- und absteigen, also $\\hat a\\hat a^\\dagger$ und $\\hat a^\\dagger\\hat a$. Die Herleitung zeigt das. Ergebnis:',
        '$$\\langle n|\\hat x^2|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n+1),\\qquad \\langle n|\\hat p^2|n\\rangle = \\frac{m\\omega\\hbar}{2}(2n+1).$$',
        'Daraus folgen $\\langle V\\rangle = \\langle T\\rangle = \\tfrac12E_n$ ([[lex:virialsatz|Virialsatz]]) und $\\Delta x\\,\\Delta p = (n + \\tfrac12)\\hbar$. Der Grundzustand erreicht die Grenze $\\hbar/2$ der Unschärferelation genau.',
        '**Ein häufiger Fehler** ist, die Faktoren als Wahrscheinlichkeiten oder als Vorgang zu lesen: „$\\hat a|2\\rangle = \\sqrt2|1\\rangle$, also ist das System danach im Zustand $\\sqrt2|1\\rangle$.“ Das ist kein Zustand nach einem Vorgang, sondern ein nicht normierter Vektor. Wahrscheinlichkeiten entstehen nur aus normierten Zuständen, als $|\\langle n|\\psi\\rangle|^2$ ([[lex:messpostulat|Messpostulat]]).'
      ].join('\n\n'),
      derive:{ctx:OSZ_MAT(), lines:[
        {l:'⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩',
          why:{q:'Woher kommt der Vorfaktor $\\frac{\\hbar}{2m\\omega}$?', opts:['Er ist das Quadrat von $\\sqrt{\\hbar/(2m\\omega)}$.', 'Er ist die Nullpunktsenergie geteilt durch $m$.', 'Er stammt aus der Normierung von $|n\\rangle$.'], a:0, ex:'$\\hat x^2 = \\frac{\\hbar}{2m\\omega}(\\hat a + \\hat a^\\dagger)^2$.'}},
        {l:'= ħ/(2mω) ⟨n|(a a + a a† + a† a + a† a†)|n⟩',
          why:{q:'Warum vier Terme statt $\\hat a^2 + 2\\hat a^\\dagger\\hat a + \\hat a^{\\dagger2}$?', opts:['$\\hat a\\hat a^\\dagger$ und $\\hat a^\\dagger\\hat a$ sind verschieden.', 'Weil $\\hat a^2 = 0$ ist.', 'Die binomische Formel gilt nur für drei Terme.'], a:0, ex:'Die binomische Formel setzt $\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a$ voraus – falsch für Operatoren.'}},
        {l:'= ħ/(2mω) ⟨n|(a a† + a† a)|n⟩',
          why:{q:'Warum fallen $\\hat a\\hat a$ und $\\hat a^\\dagger\\hat a^\\dagger$ weg?', opts:['Sie ändern $n$ um $\\pm2$, und $\\langle n|n\\pm2\\rangle = 0$.', 'Sie sind null, weil $\\hat a$ nilpotent ist.', 'Sie heben sich gegenseitig auf.'], a:0, ex:'$\\hat a^2|n\\rangle \\propto |n-2\\rangle$ ist orthogonal zu $|n\\rangle$.'}},
        {l:'= ħ/(2mω) (n + 1 + n)',
          why:{q:'Was ist $\\langle n|\\hat a\\hat a^\\dagger|n\\rangle$?', opts:['$n + 1$', '$n$', '$\\sqrt{n(n+1)}$'], a:0, ex:'$\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$. Probe $n = 0$: $\\langle x^2\\rangle$ darf nicht null sein.'}},
        {l:'= ħ/(2mω) (2n + 1)'}
      ]},
      q:[
        {q:'Was ist $\\hat a^\\dagger|3\\rangle$?', opts:['$2\\,|4\\rangle$', '$\\sqrt3\\,|4\\rangle$', '$\\sqrt3\\,|2\\rangle$'], a:0, ex:'$\\hat a^\\dagger|n\\rangle = \\sqrt{n+1}|n+1\\rangle$, also $\\sqrt4\\,|4\\rangle = 2|4\\rangle$.'},
        {q:'Welche Matrixelemente $\\langle m|\\hat x^2|3\\rangle$ sind ungleich null?', opts:['$m = 1, 3, 5$', 'nur $m = 3$', '$m = 2$ und $m = 4$'], a:0, ex:'$\\hat x^2 \\propto (\\hat a + \\hat a^\\dagger)^2$ ändert $n$ um $-2$, $0$ oder $+2$.'}
      ]},
    {id:'osz-t5', title:'Eigenfunktionen in Ortsdarstellung',
      text:[
        'Bisher kam keine Wellenfunktion vor. Um sie zu bekommen, schreibt man $\\hat a\\psi_0 = 0$ in Ortsdarstellung mit $\\hat p = -i\\hbar\\,d/dx$:',
        '$$\\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(x + \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)\\psi_0 = 0 \\quad\\Longrightarrow\\quad \\psi_0\' = -\\frac{m\\omega}{\\hbar}\\,x\\,\\psi_0.$$',
        'Das ist eine Differentialgleichung erster Ordnung. Ihre Lösung ist bis auf einen Faktor eindeutig – deshalb ist der Grundzustand nicht entartet. Normiert mit dem [[lex:gauss-integral|Gauß-Integral]] ergibt sich',
        '$$\\psi_0(x) = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-m\\omega x^2/(2\\hbar)}.$$',
        'Das vorgerechnete Beispiel im nächsten Schritt geht diese Rechnung Zeile für Zeile durch. Die angeregten Zustände erhält man durch Anwenden von $\\hat a^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(x - \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$. Mit der dimensionslosen Koordinate $\\xi = x\\sqrt{m\\omega/\\hbar}$ entstehen die [[lex:hermite-funktionen|Eigenfunktionen]]',
        '$$\\psi_n(x) = \\frac{1}{\\sqrt{2^n n!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}H_n(\\xi)\\,e^{-\\xi^2/2}$$',
        'mit den [[lex:hermite-polynome|Hermite-Polynomen]] $H_0 = 1$, $H_1 = 2\\xi$, $H_2 = 4\\xi^2 - 2$, $H_3 = 8\\xi^3 - 12\\xi$.',
        '**Die analytische Methode** kommt ohne Leiteroperatoren aus und zeigt, woher die Quantisierung kommt. In $\\xi$ lautet $\\hat H\\psi = E\\psi$ einfach $-\\psi\'\' + \\xi^2\\psi = K\\psi$ mit $K = 2E/(\\hbar\\omega)$. Für große $|\\xi|$ dominiert $\\xi^2$; das legt den Ansatz $\\psi = h(\\xi)\\,e^{-\\xi^2/2}$ nahe. Einsetzen (Herleitung) ergibt die Hermite-Gleichung',
        '$$h\'\' - 2\\xi h\' + (K - 1)\\,h = 0.$$',
        'Mit der Potenzreihe $h = \\sum_j c_j\\xi^j$ folgt durch Koeffizientenvergleich die Rekursion',
        '$$c_{j+2} = \\frac{2j + 1 - K}{(j+1)(j+2)}\\,c_j.$$',
        'Für große $j$ ist $c_{j+2} \\approx \\frac{2}{j}\\,c_j$. So wachsen die Koeffizienten von $e^{\\xi^2}$; dann wüchse $\\psi$ wie $e^{+\\xi^2/2}$ und wäre nicht normierbar. Eine normierbare Lösung gibt es nur, wenn die Reihe abbricht: $K = 2n + 1$ für ein ganzes $n \\ge 0$, und die jeweils andere Teilreihe (gerade oder ungerade Potenzen) wird null gesetzt. Daraus folgt wieder $E_n = \\hbar\\omega(n + \\tfrac12)$. Die Quantisierung entsteht hier aus der Normierbarkeit – genau so wird es beim Wasserstoffatom sein (Thema 9).',
        '**Eigenschaften, die man ohne Rechnung sieht:** $\\psi_n$ hat $n$ Knoten und die Parität $(-1)^n$. Die $\\psi_n$ sind [[lex:orthonormal|orthonormal]]: orthogonal, weil $\\hat H$ hermitesch ist und die Eigenwerte verschieden sind; normiert sind sie durch die Wahl der Vorfaktoren. Und sie reichen über die klassischen Umkehrpunkte $\\pm\\sqrt{2n+1}\\,\\sqrt{\\hbar/(m\\omega)}$ hinaus. Im Grundzustand findet man das Teilchen mit etwa 16 % Wahrscheinlichkeit im klassisch verbotenen Bereich. Dort ist $\\psi$ nicht null, sondern fällt ab und krümmt sich von der Achse weg, wie in Thema 5.'
      ].join('\n\n'),
      fig:{lab:'osc', init:{n:3}, caption:'Parabelpotential, die Niveaus $E_n$ und darauf $|\\psi_n|^2$. Stelle $n$ ein, zähle die Knoten und achte auf die Ausläufer jenseits der Umkehrpunkte.'},
      derive:{ctx:OSZ_XI(), lines:[
        {l:"d/dξ (h(ξ) e^(-ξ^2/2)) = (h'(ξ) - ξ h(ξ)) e^(-ξ^2/2)",
          why:{q:'Welche Regel steckt in dieser Zeile?', opts:['Produktregel; $\\frac{d}{d\\xi}e^{-\\xi^2/2} = -\\xi e^{-\\xi^2/2}$', 'Quotientenregel mit $e^{\\xi^2/2}$ im Nenner', 'partielle Integration ohne Randterm'], a:0, ex:'Die innere Ableitung von $-\\xi^2/2$ ist $-\\xi$.'}},
        {l:"d^2/dξ^2 (h(ξ) e^(-ξ^2/2)) = (h''(ξ) - 2ξ h'(ξ) + (ξ^2 - 1) h(ξ)) e^(-ξ^2/2)",
          why:{q:'Warum steht $-2\\xi h\'$ da und nicht $-\\xi h\'$?', opts:['$-\\xi h\'$ entsteht zweimal.', 'Weil man mit 2 multipliziert hat.', 'Weil $h\'\' = 2h\'$ ist.'], a:0, ex:'Einmal aus der Ableitung von $-\\xi h$, einmal aus $h\'\\cdot(-\\xi)$. Dazu kommen $-h$ und $\\xi^2h$.'}},
        {l:"-d^2/dξ^2 (h(ξ) e^(-ξ^2/2)) + ξ^2 h(ξ) e^(-ξ^2/2) = (-h''(ξ) + 2ξ h'(ξ) + h(ξ)) e^(-ξ^2/2)",
          why:{q:'Was ist mit dem Term $\\xi^2h$ passiert?', opts:['Er hebt sich gegen $\\xi^2h$ aus $\\psi\'\'$ weg.', 'Er wurde vernachlässigt, weil $\\xi$ klein ist.', 'Er steckt jetzt in $h\'\'$.'], a:0, ex:'Genau dafür ist der Faktor $e^{-\\xi^2/2}$ da. Setzt man das gleich $K\\,h\\,e^{-\\xi^2/2}$, folgt $h\'\' - 2\\xi h\' + (K-1)h = 0$.'}},
        {l:"d^2/dξ^2 H_2(ξ) - 2ξ d/dξ H_2(ξ) + 4 H_2(ξ) = 0",
          why:{q:'Welche Energie gehört zu $H_2$?', opts:['$K - 1 = 4$, also $E = \\tfrac52\\hbar\\omega$', '$K = 4$, also $E = 2\\hbar\\omega$', '$K - 1 = 2$, also $E = \\tfrac32\\hbar\\omega$'], a:0, ex:'$K = 2n + 1 = 5$ und $E = K\\hbar\\omega/2$.'}}
      ]},
      q:[
        {q:'Wie viele Knoten hat $\\psi_3$, und welche Parität?', opts:['3 Knoten, ungerade', '3 Knoten, gerade', '4 Knoten, ungerade'], a:0, ex:'$n$ Knoten und Parität $(-1)^n$; $H_3 = 8\\xi^3 - 12\\xi$ ist ungerade.'},
        {q:'Warum muss die Potenzreihe für $h(\\xi)$ abbrechen?', opts:['Sonst wüchse $\\psi$ wie $e^{+\\xi^2/2}$.', 'Sonst wäre $\\psi$ bei $\\xi = 0$ unstetig.', 'Sonst wäre die Energie negativ.'], a:0, ex:'Eine nicht abbrechende Reihe wächst wie $e^{\\xi^2}$; $\\psi$ wäre nicht normierbar.'}
      ]},
    {id:'osz-t6', title:'Zeitentwicklung, klassische Grenze und Molekülschwingungen',
      text:[
        '**Stationär oder nicht?** Ein Eigenzustand entwickelt sich nur mit einer Phase: $|n\\rangle \\to e^{-iE_nt/\\hbar}|n\\rangle$ ([[lex:zeitentwicklung|Zeitentwicklung]], Thema 2). Alle Erwartungswerte bleiben dann konstant, insbesondere $\\langle x\\rangle = 0$. Ein Eigenzustand „schwingt“ also nicht, obwohl er zum Oszillator gehört. Bewegung entsteht erst durch Überlagerung. Für $|\\psi(0)\\rangle = c_0|0\\rangle + c_1|1\\rangle$ folgt',
        '$$\\langle x\\rangle(t) = \\sqrt{\\frac{2\\hbar}{m\\omega}}\\;|c_0c_1|\\cos(\\omega t - \\delta),$$',
        'wobei $\\delta$ die Phase von $c_0^*c_1$ ist. Der Erwartungswert schwingt mit genau der klassischen Frequenz. Das verlangt das [[lex:ehrenfest|Ehrenfest-Theorem]]: Für $V = \\frac12m\\omega^2x^2$ ist $\\frac{d}{dt}\\langle p\\rangle = -m\\omega^2\\langle x\\rangle$ exakt die klassische Gleichung. In Überlagerungen, deren $n$ sich um 2 unterscheiden, etwa $|0\\rangle + |2\\rangle$, ist dagegen $\\langle x\\rangle = 0$ für alle Zeiten, denn $\\hat x$ verbindet nur Nachbarn. Dort schwingt nur die Breite $\\langle x^2\\rangle$, mit $2\\omega$.',
        '**Klassische Grenze.** Für große $n$ ähnelt $|\\psi_n|^2$ im Mittel der klassischen Dichte: klein in der Mitte, groß an den Umkehrpunkten. Die $n$ Knoten bleiben, liegen aber immer dichter. Jedes Messgerät mit endlicher Auflösung mittelt sie weg. Das ist das [[lex:osz-korrespondenz|Korrespondenzprinzip]]; im Labor siehst du es bei $n = 5$ schon deutlich. Ein klassisch schwingendes Teilchen entspricht aber nicht einem einzelnen $|n\\rangle$. Es entspricht einer Überlagerung vieler benachbarter Zustände; erst sie bildet ein Wellenpaket, das hin- und herläuft.',
        '**Molekülschwingungen und IR-Spektren.** Zwei Atome einer Bindung schwingen gegeneinander. Mit der reduzierten Masse $\\mu = m_1m_2/(m_1 + m_2)$ ist das ein Oszillator mit $\\omega = \\sqrt{k/\\mu}$. Infrarotlicht wird absorbiert, wenn seine Photonenenergie zu $E_{n+1} - E_n$ passt. Das Licht koppelt an das elektrische Dipolmoment, das in erster Näherung proportional zur Auslenkung $x$ ist. Darum zählt das Matrixelement $\\langle m|\\hat x|n\\rangle$, und das ist nur für $m = n\\pm1$ ungleich null: die **Auswahlregel** $\\Delta n = \\pm1$. Im harmonischen Modell erwartet man eine einzige Linie bei $\\hbar\\omega$, gleich von welchem $n$ aus. Bei Chlorwasserstoff liegt sie bei der Wellenzahl $2886\\,\\mathrm{cm^{-1}}$, also $\\lambda \\approx 3{,}5\\,\\mu\\mathrm m$ und $\\hbar\\omega \\approx 0{,}36\\,\\mathrm{eV}$. Mit $\\mu \\approx 0{,}98\\,\\mathrm u$ folgt eine Federkonstante von etwa $480\\,\\mathrm{N/m}$ ([[lex:osz-molekuel|Molekülschwingungen]]). Dieser Wert ist aus der beobachteten Grundschwingung gerechnet. Lehrbücher nennen meist etwa $516\\,\\mathrm{N/m}$; das folgt aus der harmonischen Konstante $\\omega_e \\approx 2991\\,\\mathrm{cm^{-1}}$, bei der die Anharmonizität herausgerechnet ist.',
        'Weil $\\hbar\\omega$ viel größer als $k_BT \\approx 0{,}026\\,\\mathrm{eV}$ bei Zimmertemperatur ist, sitzen fast alle Moleküle im Grundzustand. Man sieht auch schwache Obertöne bei knapp $2\\hbar\\omega$. Sie zeigen: Weder ist das Dipolmoment exakt linear in $x$, noch ist die Bindung exakt harmonisch. Dass sie knapp *unter* $2\\hbar\\omega$ liegen, zeigt die Anharmonizität der Bindung; solche Abweichungen behandelt man mit Störungstheorie (Thema 11). Im Gas kommt außerdem eine Rotationsstruktur hinzu (Thema 8).',
        '**Die Nullpunktsenergie ist messbar.** H₂ und D₂ haben dieselbe Potentialkurve, aber verschiedene reduzierte Massen. Wegen $E_0 = \\tfrac12\\hbar\\omega \\propto 1/\\sqrt\\mu$ sitzt D₂ tiefer in der Mulde und braucht zur Dissoziation mehr Energie – die Vorhersage vom Anfang.'
      ].join('\n\n'),
      fig:{lab:'osc', init:{n:5}, caption:'Klassische Grenze: Stelle $n = 5$ ein und vergleiche $|\\psi_5|^2$ mit der gestrichelten klassischen Dichte bei derselben Energie.'},
      q:[
        {q:'Ein Oszillator ist im Zustand $|3\\rangle$. Wie hängt $\\langle x\\rangle$ von der Zeit ab?', opts:['konstant null', 'schwingt mit $\\omega$', 'schwingt mit $3\\omega$'], a:0, ex:'$|3\\rangle$ ist stationär; die Phase $e^{-iE_3t/\\hbar}$ fällt im Erwartungswert heraus, und $\\langle 3|\\hat x|3\\rangle = 0$.'},
        {q:'Warum sieht man im harmonischen Modell nur eine IR-Linie?', opts:['Nur $\\Delta n = \\pm1$ ist erlaubt, und alle Abstände sind $\\hbar\\omega$.', 'Nur Moleküle im Grundzustand können Licht absorbieren.', 'Die höheren Niveaus fallen zu einem einzigen zusammen.'], a:0, ex:'Jeder erlaubte Übergang $n \\to n+1$ hat dieselbe Energie $\\hbar\\omega$. Bei Zimmertemperatur startet zudem fast jedes Molekül in $n = 0$.'}
      ]}
  ],
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
      {l:'â ψ_0 = sqrt(mω/(2ħ)) (x ψ_0 + ħ/(mω) dψ_0/dx)', why:{q:'Was steht hier?', opts:['$\\hat a$ in Ortsdarstellung, angewendet auf $\\psi_0$', 'die zeitunabhängige Schrödingergleichung für $\\psi_0$', 'die Normierungsbedingung für $\\psi_0$'], a:0, ex:'$\\hat x$ multipliziert mit $x$, $\\hat p$ wird zu $-i\\hbar\\,d/dx$.'}},
      {l:'x ψ_0 + ħ/(mω) dψ_0/dx = 0', why:{q:'Warum gilt das?', opts:['Unter $\\psi_0$ gibt es keinen Zustand: $\\hat a\\psi_0 = 0$.', 'Der Grundzustand hat die Energie null, also $\\hat a\\psi_0 = 0$.', 'Im Minimum ist $x = 0$, also verschwindet die Klammer.'], a:0, ex:'Sonst wäre $\\hat a\\psi_0$ ein Zustand mit der noch tieferen Energie $E_0 - \\hbar\\omega$, und $\\psi_0$ wäre nicht der Grundzustand. Endete die Leiter nie, käme man sogar zu negativen Energien – im Widerspruch zu $\\langle H\\rangle \\ge \\tfrac12\\hbar\\omega$. Die Energie von $\\psi_0$ ist $\\tfrac12\\hbar\\omega$, nicht null.'}},
      {l:'dψ_0/dx = -mω/ħ x ψ_0', why:{q:'Was für eine Gleichung ist das?', opts:['lineare DGL 1. Ordnung, Trennung der Variablen', 'Eigenwertgleichung für $\\hat H$ mit $E = 0$', 'DGL 2. Ordnung wie die Schrödingergleichung'], a:0, ex:'$\\frac{d\\psi_0}{\\psi_0} = -\\frac{m\\omega}{\\hbar}x\\,dx$, also $\\ln\\psi_0 = -\\frac{m\\omega}{2\\hbar}x^2 + \\text{const}$.'}},
      {l:'ψ_0(x) = A e^(-mω x^2/(2ħ))', why:{q:'Wie viele Lösungen hat die Gleichung?', opts:['bis auf den Faktor $A$ genau eine', 'zwei, eine gerade und eine ungerade', 'keine, die normierbar ist'], a:0, ex:'Eine DGL erster Ordnung hat eine Integrationskonstante; die legt die Normierung fest. Deshalb ist der Grundzustand nicht entartet.'}},
      {l:'|A|^2 sqrt(πħ/(mω)) = 1', w:'Gauß-Integral mit α = mω/ħ', why:{q:'Welches Integral wurde benutzt?', opts:['$\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\alpha = m\\omega/\\hbar$', '$\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\alpha = m\\omega/(2\\hbar)$', '$\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$, $\\alpha = m\\omega/\\hbar$'], a:0, ex:'$|\\psi_0|^2 = |A|^2e^{-m\\omega x^2/\\hbar}$: Der Exponent verdoppelt sich beim Quadrieren.'}},
      {l:'A = (mω/(πħ))^(1/4)', why:{q:'Welche Einheit hat $A$?', opts:['$1/\\sqrt{\\text{Länge}}$', 'keine', '$1/\\text{Länge}$'], a:0, ex:'$m\\omega/\\hbar$ hat die Einheit $1/\\text{Länge}^2$; die vierte Wurzel davon ist $1/\\sqrt{\\text{Länge}}$, wie es für eine Wellenfunktion in 1D sein muss.'}}
    ],
    faded:{id:'osz-fade', title:'Jetzt du: erster angeregter Zustand $\\psi_1 \\propto \\hat a^\\dagger\\psi_0$', text:'Mit $\\hat a^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$. Zeige $\\hat a^\\dagger\\psi_0 = \\sqrt{\\frac{2m\\omega}{\\hbar}}\\,x\\,\\psi_0$.',
      ctx:OSZ_GROUND(),
      given:['ψ_1 = â† ψ_0', '= sqrt(mω/(2ħ)) (x ψ_0 - ħ/(mω) dψ_0/dx)'],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'show', from:'â† ψ_0', to:'sqrt(2mω/ħ) x ψ_0', hints:['Strategie: Ersetze die Ableitung durch das, was du über $\\psi_0$ schon weißt.', 'Aus $\\hat a\\psi_0 = 0$ folgt $\\psi_0\' = -\\frac{m\\omega}{\\hbar}x\\psi_0$.', 'Eingesetzt: $x\\psi_0 + x\\psi_0 = 2x\\psi_0$; dann den Vorfaktor zusammenfassen.'],
        model:['ψ_1 = â† ψ_0', '= sqrt(mω/(2ħ)) (x ψ_0 - ħ/(mω) dψ_0/dx)', {l:'= sqrt(mω/(2ħ)) · 2x ψ_0', gap:'= sqrt(mω/(2ħ)) · ▢'}, '= sqrt(2mω/ħ) x ψ_0']}]}
  },
  puzzle:{
    title:'Nullpunktsenergie ohne Parabel',
    text:'Für die Parabel liefert die Unschärferelation genau $\\tfrac12\\hbar\\omega$. Nun sei das Potential rein quartisch, $V(x) = \\lambda x^4$ mit $\\lambda > 0$. Es hat kein $x^2$-Glied, also auch kein $\\omega$, und die Leiteroperatoren helfen nicht.\n\nSchätze mit derselben Idee wie für die Parabel ab: Wie hängt die Grundzustandsenergie von $\\lambda$ ab (bei festem $m$ und $\\hbar$)?',
    q:{q:'Deine Vermutung:', opts:['$E_0 \\propto \\lambda^{1/3}$', '$E_0 \\propto \\lambda^{1/2}$', '$E_0 \\propto \\lambda$', '$E_0 = 0$, weil das Minimum ganz flach ist'], a:0, ex:'Die Abschätzung ergibt $E_0 \\propto (\\hbar^4\\lambda/m^2)^{1/3}$.'},
    reveal:'Mit $\\langle x\\rangle = \\langle p\\rangle = 0$, $\\Delta p \\approx \\hbar/(2\\Delta x)$ und grob $\\langle x^4\\rangle \\approx (\\Delta x)^4$ ist\n\n$$E(\\Delta x) \\approx \\frac{\\hbar^2}{8m(\\Delta x)^2} + \\lambda(\\Delta x)^4.$$\n\nDer erste Term bestraft eine kleine Breite, der zweite eine große. Aus $dE/d(\\Delta x) = 0$ folgt $(\\Delta x)^6 = \\frac{\\hbar^2}{16m\\lambda}$, und beide Terme sind dann von der Ordnung $(\\hbar^4\\lambda/m^2)^{1/3}$. Also $E_0 \\propto \\lambda^{1/3}$. Eine Einheitenbetrachtung bestätigt das: Aus $\\hbar$, $m$ und $\\lambda$ (Einheit $\\mathrm{J/m^4}$) lässt sich genau eine Energie bilden, $(\\hbar^4\\lambda/m^2)^{1/3}$. Den Zahlenfaktor trifft die grobe Abschätzung nur ungefähr; genauer wird er mit dem Variationsprinzip (Thema 11) oder numerisch.\n\nAuch ohne Parabel bleibt also eine Nullpunktsenergie – sie folgt allein aus der Unschärferelation.'
  },
  clarify:{
    core:'Mit $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right)$ und $\\hat a^\\dagger$ gilt $[\\hat a, \\hat a^\\dagger] = 1$ und\n\n$$\\hat H = \\hbar\\omega\\left(\\hat a^\\dagger\\hat a + \\tfrac12\\right),\\qquad \\hat a|n\\rangle = \\sqrt n\\,|n-1\\rangle,\\qquad \\hat a^\\dagger|n\\rangle = \\sqrt{n+1}\\,|n+1\\rangle.$$\n\nWeil $\\|\\hat a\\psi\\|^2 \\ge 0$, endet die Leiter unten bei $\\hat a|0\\rangle = 0$. Daraus folgt $E_n = \\hbar\\omega(n + \\tfrac12)$, $n = 0, 1, 2, \\dots$ Umgekehrt ist $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$ und $\\hat p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}(\\hat a^\\dagger - \\hat a)$. Matrixelemente rechnet man damit ohne Integrale.',
    keys:[
      'Energieniveaus haben den festen Abstand $\\hbar\\omega$; der Grundzustand hat die Nullpunktsenergie $\\tfrac12\\hbar\\omega$.',
      '$\\psi_n(x) = \\frac{1}{\\sqrt{2^nn!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}H_n(\\xi)\\,e^{-\\xi^2/2}$ mit $\\xi = \\sqrt{m\\omega/\\hbar}\\,x$; $\\psi_n$ hat $n$ Knoten und die Parität $(-1)^n$.',
      '$\\hat x$ und $\\hat p$ verbinden nur Nachbarn: $\\langle m|\\hat x|n\\rangle \\ne 0$ nur für $m = n \\pm 1$. Daraus folgt die IR-Auswahlregel $\\Delta n = \\pm1$.',
      'In jedem Eigenzustand gilt $\\langle T\\rangle = \\langle V\\rangle = \\tfrac12E_n$ (Virialsatz).',
      'Zeitentwicklung: $|n\\rangle \\to e^{-iE_nt/\\hbar}|n\\rangle$. Eigenzustände sind stationär; erst Überlagerungen benachbarter Zustände lassen $\\langle x\\rangle$ mit $\\omega$ schwingen.'
    ],
    errors:[
      '$\\hat a^\\dagger|n\\rangle = \\sqrt n\\,|n+1\\rangle$ statt $\\sqrt{n+1}$: Teste mit $n = 0$ – $\\hat a^\\dagger|0\\rangle$ darf nicht null sein.',
      '$\\hat a\\hat a^\\dagger$ und $\\hat a^\\dagger\\hat a$ verwechseln: $\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a + 1$.',
      'Den Vorfaktor $\\frac{\\hbar}{2m\\omega}$ in $\\hat x^2$ vergessen.',
      'Mit $\\hat a$ wie mit einer Observablen rechnen: $\\hat a$ ist nicht hermitesch, $\\langle n|\\hat a|n\\rangle = 0$ hat keine Messbedeutung, und $\\hat a|n\\rangle$ ist kein Zustand „nach einem Vorgang“.',
      'Glauben, das Teilchen könne nicht außerhalb der klassischen Umkehrpunkte gefunden werden.'
    ],
    more:[{title:'Warum endet die Leiter unten?', text:'Für jeden Zustand ist $\\langle\\psi|\\hat a^\\dagger\\hat a|\\psi\\rangle = \\|\\hat a\\psi\\|^2 \\ge 0$, also sind alle Eigenwerte von $\\hat N = \\hat a^\\dagger\\hat a$ nichtnegativ. Weil $\\hat a$ den Eigenwert um 1 senkt, muss es einen Zustand mit $\\hat a|0\\rangle = 0$ geben – sonst käme man zu negativen Werten.'}],
    checks:[
      {q:'Was ist $\\hat a^\\dagger\\hat a^\\dagger|1\\rangle$?', opts:['$\\sqrt6\\,|3\\rangle$', '$2|3\\rangle$', '$\\sqrt2\\,|3\\rangle$'], a:0, ex:'$\\hat a^\\dagger|1\\rangle = \\sqrt2|2\\rangle$, dann $\\hat a^\\dagger|2\\rangle = \\sqrt3|3\\rangle$, zusammen $\\sqrt6|3\\rangle$.'},
      {q:'Welche Matrixelemente $\\langle m|\\hat x|2\\rangle$ sind ungleich null?', opts:['$m = 1$ und $m = 3$', 'nur $m = 2$', 'alle $m$'], a:0, ex:'$\\hat x \\propto \\hat a + \\hat a^\\dagger$ ändert $n$ um genau $\\pm1$.'}
    ]
  },
  lab:{type:'osc', title:'Eigenfunktionen im Parabelpotential',
    text:'Die Parabel ist das Potential, die waagerechten Linien sind die Energien $E_n$, darauf liegt $|\\psi_n|^2$. Gestrichelt: die klassische Aufenthaltsdichte bei derselben Energie, die an den Umkehrpunkten unendlich wird.',
    predict:{q:'Bevor du den Regler bewegst: Wo ist $|\\psi_5|^2$ am größten?', opts:['nahe den klassischen Umkehrpunkten', 'in der Mitte bei $x = 0$', 'überall gleich groß zwischen den Umkehrpunkten'], a:0, ex:'Wie klassisch: Wo das Teilchen langsam ist, also $E - V$ klein, ist die Amplitude groß. Bei $x = 0$ hat $\\psi_5$ sogar einen Knoten, denn $\\psi_5$ ist ungerade.'},
    questions:[
      {q:'Grundzustand $n = 0$: Wie groß ist die Wahrscheinlichkeit, das Teilchen außerhalb der klassischen Umkehrpunkte zu finden?', opts:['etwa 16 %', 'genau 0 %', 'etwa 50 %'], a:0, ex:'$P = \\operatorname{erfc}(1) \\approx 0{,}157$. Klassisch wäre der Bereich verboten.'},
      {q:'Stelle $n = 5$ ein. Wie sieht $|\\psi_5|^2$ im Vergleich zur klassischen Dichte aus?', opts:['Es schwingt um die klassische Kurve und ist an den Rändern am größten.', 'Es ist in der Mitte am größten wie beim Grundzustand.', 'Es stimmt exakt mit der klassischen Kurve überein.'], a:0, ex:'Für große $n$ nähert sich das Mittel von $|\\psi_n|^2$ der klassischen Dichte – das Korrespondenzprinzip. Die Knoten bleiben.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele Nullstellen hat $\\psi_4(x)$?', opts:['4', '5', '2'], a:0, ex:'$\\psi_n$ hat genau $n$ Knoten (Hermite-Polynom vom Grad $n$).'}},
  compare:{
    text:'Gesucht ist $\\langle x^2\\rangle$ im Grundzustand $\\psi_0 = \\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}e^{-m\\omega x^2/(2\\hbar)}$. Zwei richtige Wege:',
    ctx:OSZ_POS(),
    A:{name:'Gauß-Integral', model:['⟨x^2⟩ = sqrt(mω/(πħ)) ∫_-∞^∞ x^2 e^(-mω x^2/ħ) dx', {l:'= sqrt(mω/(πħ)) · ħ/(2mω) sqrt(πħ/(mω))', w:'∫x²e^{−αx²}dx = √(π/α)/(2α)'}, '= ħ/(2mω)']},
    B:{name:'Leiteroperatoren', text:'Mit $\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$ und $\\hat a\\psi_0 = 0$:', model:['⟨x^2⟩ = ħ/(2mω) ⟨ψ_0|(â + â†)^2|ψ_0⟩', {l:'= ħ/(2mω) ⟨ψ_0|â â†|ψ_0⟩', w:'nur ââ† überlebt'}, '= ħ/(2mω)']},
    questions:[
      {q:'Welcher Weg ist für $\\langle x^4\\rangle$ im Zustand $\\psi_3$ deutlich bequemer?', opts:['die Leiteroperatoren', 'das Gauß-Integral mit $H_3$', 'beide gleich aufwendig'], a:0, ex:'Mit $\\hat a$, $\\hat a^\\dagger$ zählt man nur Wege auf der Leiter; das Integral bräuchte $H_3^2\\,x^4\\,e^{-\\xi^2}$.'},
      {q:'Warum bleibt in Weg B nur $\\langle\\psi_0|\\hat a\\hat a^\\dagger|\\psi_0\\rangle$ übrig?', opts:['$\\hat a\\psi_0 = 0$, und $\\hat a^{\\dagger2}\\psi_0 \\perp \\psi_0$', 'weil $\\hat a\\hat a^\\dagger = \\hat a^\\dagger\\hat a$ gilt', 'weil ungerade Terme symmetrisch wegfallen'], a:0, ex:'$\\hat a\\psi_0 = 0$ tötet $\\hat a^\\dagger\\hat a$ und $\\hat a^2$; $\\hat a^{\\dagger2}\\psi_0 \\propto \\psi_2$ ist orthogonal zu $\\psi_0$. Und $\\hat a\\hat a^\\dagger\\psi_0 = (\\hat a^\\dagger\\hat a + 1)\\psi_0 = \\psi_0$.'}
    ]
  },
  concept:[
    {id:'osz-k1', type:'mc2', seg:'osz-t3', lex:'nullpunktsenergie',
      q:'Ein Oszillator wird beliebig weit abgekühlt. Kann seine Energie null werden?', opts:['Nein, sie bleibt mindestens $\\tfrac12\\hbar\\omega$.', 'Ja, bei $T = 0$ ruht er im Minimum.', 'Ja, im Zustand $\\hat a|0\\rangle$.'], a:0,
      ex:'Die tiefste Energie ist $E_0 = \\tfrac12\\hbar\\omega$. $\\hat a|0\\rangle$ ist der Nullvektor, kein Zustand mit Energie null.',
      reason:{q:'Warum?', opts:['$\\langle\\hat N\\rangle = \\|\\hat a\\psi\\|^2 \\ge 0$ und $\\hat H = \\hbar\\omega(\\hat N + \\tfrac12)$', 'Weil die Temperatur nie ganz null werden kann', 'Weil der Grundzustand zweifach entartet ist'], a:0,
        ex:'Für jeden Zustand ist $\\langle H\\rangle = \\hbar\\omega(\\|\\hat a\\psi\\|^2 + \\tfrac12) \\ge \\tfrac12\\hbar\\omega$. Das gilt auch bei $T = 0$; der Grundzustand ist nicht entartet.'}},
    {id:'osz-k2', type:'dialog', seg:'osz-t5',
      text:'Ein Oszillator ist im Grundzustand $\\psi_0$. Die klassischen Umkehrpunkte liegen bei $\\pm\\sqrt{\\hbar/(m\\omega)}$.',
      people:[
        {name:'Lena', says:'Außerhalb der Umkehrpunkte wäre die kinetische Energie negativ. Dort kann man das Teilchen nie finden.'},
        {name:'Jonas', says:'Eine Ortsmessung findet es dort in etwa 16 % der Fälle. Eine negative kinetische Energie misst man dabei trotzdem nicht.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$\\psi_0$ ist außerhalb nicht null; $P = \\operatorname{erfc}(1) \\approx 0{,}16$. Lenas Argument setzt voraus, dass Ort und kinetische Energie zugleich scharf sind. $\\hat x$ und $\\hat T$ vertauschen aber nicht; „kinetische Energie $E - V(x)$ am Ort $x$“ ist keine Messgröße.'},
    {id:'osz-k3', type:'mc2', seg:'osz-t6', lex:'stationaer',
      q:'Ein Oszillator ist im Zustand $\\frac{1}{\\sqrt2}(|0\\rangle + |2\\rangle)$. Schwingt $\\langle x\\rangle$?', opts:['Nein, $\\langle x\\rangle = 0$ für alle $t$.', 'Ja, mit der Frequenz $\\omega$.', 'Ja, mit der Frequenz $2\\omega$.'], a:0,
      ex:'Der Zustand ist nicht stationär – aber $\\langle x\\rangle$ bleibt null. Schwingen tut $\\langle x^2\\rangle$, mit $2\\omega$.',
      reason:{q:'Warum?', opts:['$\\hat x$ verbindet nur $n$ und $n\\pm1$; $|0\\rangle$ und $|2\\rangle$ sind keine Nachbarn.', 'Überlagerungen von Eigenzuständen sind immer stationär.', 'Weil $E_2 - E_0 = 2\\hbar\\omega$ die Frequenz festlegt.'], a:0,
        ex:'Der Mischterm in $\\langle x\\rangle$ enthält $\\langle 0|\\hat x|2\\rangle = 0$. In $\\langle x^2\\rangle$ dagegen ist $\\langle 0|\\hat x^2|2\\rangle \\ne 0$; dieser Term schwingt mit $(E_2 - E_0)/\\hbar = 2\\omega$.'}},
    {id:'osz-k4', type:'mc', seg:'osz-t5',
      q:'Wie sieht $\\psi_{10}(x)$ qualitativ aus?', opts:['Amplitude am Rand größer, Knoten in der Mitte dichter', 'Amplitude überall gleich, Knoten gleichmäßig verteilt', 'Amplitude in der Mitte größer, Knoten am Rand dichter'], a:0,
      ex:'In der Mitte ist $E - V$ am größten: großer Impuls, kurze Wellenlänge, also dichte Knoten und kleine Amplitude. Nahe den Umkehrpunkten ist das Teilchen langsam, die Wellenlänge lang und die Amplitude groß – wie die klassische Dichte.'},
    {id:'osz-k5', type:'dialog', seg:'osz-t4',
      text:'Es gilt $\\hat a|2\\rangle = \\sqrt2\\,|1\\rangle$.',
      people:[
        {name:'Lena', says:'Wendet man $\\hat a$ an, misst man gewissermaßen ein Quant heraus. Danach ist das System im Zustand $\\sqrt2\\,|1\\rangle$.'},
        {name:'Jonas', says:'$\\hat a$ ist keine Observable und beschreibt keine Messung. $\\sqrt2\\,|1\\rangle$ ist nicht einmal normiert. Wichtig ist nur, dass $\\hat a|2\\rangle$ proportional zu $|1\\rangle$ ist.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'Einen Operator anwenden ist keine Messung. Nach einer Messung ist der Zustand normiert und ein Eigenzustand der gemessenen Observablen. $\\hat a$ ist nicht hermitesch, und der Faktor $\\sqrt2$ ist kein Wahrscheinlichkeitsgewicht.'}
  ],
  practice:[
    {id:'osz-p1', title:'Rechnen mit Leiteroperatoren',
      text:'Besetzungszahlbasis $|n\\rangle$. Hier schreibst du `a` und `a†` ohne Dach; `H` ist $\\hbar\\omega(a^\\dagger a + \\tfrac12)$, `x` und `p` sind die Orts- und Impulsoperatoren.',
      ctx:OSZ_MAT(),
      goals:[
        {id:'a', prompt:'a) Zeige $[H, a] = -\\hbar\\omega\\,a$.', type:'show', from:'[H, a]', to:'-ħω a', points:3,
          hints:['Gesucht ist ein Kommutator. Setze $H = \\hbar\\omega(a^\\dagger a + \\tfrac12)$ ein; die Zahl $\\tfrac12$ vertauscht mit allem.', 'Regel: $[AB, C] = A[B, C] + [A, C]B$, dazu $[a, a^\\dagger] = 1$.', 'Nächster Schritt: $[a^\\dagger a, a] = [a^\\dagger, a]\\,a$, denn $[a, a] = 0$.'],
          model:['[H, a] = ħω [a† a, a]', '= ħω (a† a a - a a† a)', '= ħω [a†, a] a', '= -ħω a'],
          note:'Damit senkt $a$ die Energie um $\\hbar\\omega$: $H(a|n\\rangle) = (E_n - \\hbar\\omega)\\,a|n\\rangle$.'},
        {id:'b', prompt:'b) Berechne $\\langle n|x^2|n\\rangle$.', type:'value', target:'ħ/(2mω) (2n + 1)', points:3,
          hints:['Drücke $x$ durch die Leiteroperatoren aus; dann ist $\\langle n|x^2|n\\rangle$ eine Abzählaufgabe.', 'Regel: $x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(a + a^\\dagger)$; nur Terme mit gleich vielen $a$ und $a^\\dagger$ führen zu $|n\\rangle$ zurück.', 'Nächster Schritt: $\\langle n|a a^\\dagger|n\\rangle = n + 1$ und $\\langle n|a^\\dagger a|n\\rangle = n$.'],
          model:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω)(2n + 1)']},
        {id:'c', prompt:'c) Berechne $\\langle n|p^2|n\\rangle$.', type:'value', target:'m ħ ω/2 (2n + 1)', points:3,
          hints:['Gleiche Strategie wie in b): $p$ durch $a$ und $a^\\dagger$ ausdrücken.', 'Regel: $p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}(a^\\dagger - a)$, also $p^2 = -\\frac{m\\omega\\hbar}{2}(a^\\dagger - a)^2$.', 'Nächster Schritt: Von $(a^\\dagger - a)^2$ tragen nur $-a^\\dagger a - a a^\\dagger$ bei; dieses Minus hebt das Minus im Vorfaktor auf.'],
          model:['⟨n|p^2|n⟩ = -mħω/2 ⟨n|(a† - a)^2|n⟩', '= mħω/2 ⟨n|(a† a + a a†)|n⟩', '= mħω/2 (2n + 1)'], note:'Damit $\\langle T\\rangle = \\langle p^2\\rangle/2m = \\tfrac12E_n = \\langle V\\rangle$.'}
      ]},
    {id:'osz-p2', title:'Grundzustand: kinetische und potentielle Energie',
      text:'$\\psi_0$ ist der normierte Grundzustand; es gilt $\\langle x^2\\rangle = \\frac{\\hbar}{2m\\omega}$ und $\\langle H\\rangle = \\tfrac12\\hbar\\omega$. Im Tutorial sind `V` das Potential und `T` die kinetische Energie.',
      ctx:OSZ_POS(),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle V\\rangle$.', type:'value', target:'ħω/4', points:2,
          hints:['$V$ hängt nur von $x$ ab. Welche Größe aus dem Aufgabentext kannst du verwenden?', 'Regel: $\\langle V\\rangle = \\tfrac12m\\omega^2\\langle x^2\\rangle$.', 'Setze $\\langle x^2\\rangle = \\frac{\\hbar}{2m\\omega}$ ein und kürze.'],
          model:['⟨V⟩ = 1/2 m ω^2 ⟨x^2⟩', '= 1/2 m ω^2 · ħ/(2mω)', '= ħω/4']},
        {id:'b', prompt:'b) Berechne $\\langle T\\rangle$.', type:'value', target:'ħω/4', points:2,
          hints:['Du musst nicht ableiten: Die Gesamtenergie ist bekannt.', 'Regel: $\\langle H\\rangle = \\langle T\\rangle + \\langle V\\rangle$, weil der Erwartungswert linear ist.', 'Nächster Schritt: $\\langle T\\rangle = \\tfrac12\\hbar\\omega - \\langle V\\rangle$.'],
          model:['⟨T⟩ = ⟨H⟩ - ⟨V⟩', '= ħω/2 - ħω/4', '= ħω/4']},
        {id:'c', prompt:'c) Berechne $\\Delta x\\,\\Delta p$. (Es gilt $\\langle x\\rangle = \\langle p\\rangle = 0$ und $\\langle p^2\\rangle = 2m\\langle T\\rangle$.)', type:'value', target:'ħ/2', points:2,
          hints:['Unschärfe heißt Standardabweichung. Bestimme $\\Delta x$ und $\\Delta p$ einzeln.', 'Regel: $\\Delta x = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$, ebenso für $p$.', 'Nächster Schritt: $\\Delta x = \\sqrt{\\hbar/(2m\\omega)}$ und $\\langle p^2\\rangle = 2m\\cdot\\frac{\\hbar\\omega}{4}$.'],
          model:['Δx = sqrt(ħ/(2mω))', 'Δp = sqrt(mħω/2)', 'Δx Δp = ħ/2'], note:'Der Grundzustand erreicht die Unschärfegrenze exakt.'}
      ]},
    {id:'osz-p3', title:'Der erste angeregte Zustand in Ortsdarstellung',
      text:'$\\psi_1(x) = A\\,x\\,e^{-m\\omega x^2/(2\\hbar)}$ und $\\hat H = -\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2} + \\frac12m\\omega^2x^2$.',
      ctx:{coords:['x'], params:{m:'pos', ω:'pos'}, defs:{'ψ_1(x)':'A x e^(-m ω x^2/(2ħ))', 'V(x)':'1/2 m ω^2 x^2'}, unknowns:{A:{ref:'(4/π)^(1/4) (m ω/ħ)^(3/4)', alt:['-(4/π)^(1/4) (m ω/ħ)^(3/4)']}, E:{ref:'3/2 ħ ω'}}},
      goals:[
        {id:'a', prompt:'a) Zeige, dass $\\psi_1$ Eigenfunktion von $\\hat H$ ist, und bestimme $E$.', type:'solve', unknown:'E', points:3,
          hints:['Rechne $\\hat H\\psi_1$ aus und prüfe, ob ein Vielfaches von $\\psi_1$ herauskommt.', 'Zweimal Produktregel: $\\psi_1\'\' = \\left(\\frac{m^2\\omega^2x^2}{\\hbar^2} - \\frac{3m\\omega}{\\hbar}\\right)\\psi_1$.', 'Die $x^2$-Terme heben sich mit dem Potential weg; was übrig bleibt, ist $E$.'],
          model:['ψ_1\'\' = (m^2 ω^2 x^2/ħ^2 - 3mω/ħ) ψ_1', 'Ĥ ψ_1 = -ħ^2/(2m) (m^2 ω^2 x^2/ħ^2 - 3mω/ħ) ψ_1 + 1/2 m ω^2 x^2 ψ_1', '= 3/2 ħω ψ_1', 'E = 3/2 ħω']},
        {id:'b', prompt:'b) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normieren heißt $\\int|\\psi_1|^2dx = 1$; es bleibt ein Gauß-Moment.', 'Regel: $\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = m\\omega/\\hbar$.', 'Nächster Schritt: $|A|^2\\frac{\\hbar}{2m\\omega}\\sqrt{\\frac{\\pi\\hbar}{m\\omega}} = 1$ nach $A$ auflösen.'],
          model:['|A|^2 ∫_-∞^∞ x^2 e^(-mω x^2/ħ) dx = 1', '|A|^2 ħ/(2mω) sqrt(πħ/(mω)) = 1', 'A = (4/π)^(1/4) (mω/ħ)^(3/4)']}
      ]},
    {id:'osz-p4', title:'Schwingender Erwartungswert',
      text:'Zur Zeit $t$ ist $|\\psi(t)\\rangle = \\frac{1}{\\sqrt2}\\left(e^{-i\\omega t/2}|0\\rangle + e^{-3i\\omega t/2}|1\\rangle\\right)$. Mit `⟨x⟩` ist der Erwartungswert in diesem Zustand gemeint.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-iωt/2)|0⟩ + e^(-3iωt/2)|1⟩)/sqrt(2)'}, state:'ψ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle x\\rangle(t)$.', type:'value', target:'sqrt(ħ/(2mω)) cos(ωt)', points:3,
          hints:['Bilde $\\langle\\psi(t)|x|\\psi(t)\\rangle$ mit den gegebenen Phasen; nur Mischterme können beitragen.', 'Regel: $x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(a + a^\\dagger)$; nur $\\langle 0|a|1\\rangle = 1$ und $\\langle 1|a^\\dagger|0\\rangle = 1$ tragen bei.', 'Nächster Schritt: Die Phasen ergeben $\\tfrac12(e^{-i\\omega t} + e^{i\\omega t}) = \\cos(\\omega t)$.'],
          model:['⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 1/2 (e^(-iωt) + e^(iωt))', '= sqrt(ħ/(2mω)) cos(ωt)']},
        {id:'b', prompt:'b) Berechne $\\langle p\\rangle(t)$ mit Ehrenfest: $\\langle p\\rangle = m\\,\\frac{d}{dt}\\langle x\\rangle$.', type:'value', target:'-sqrt(m ħ ω/2) sin(ωt)', points:2,
          hints:['Du brauchst nur das Ergebnis aus a) und eine Zeitableitung.', 'Regel: $\\frac{d}{dt}\\cos(\\omega t) = -\\omega\\sin(\\omega t)$.', 'Nächster Schritt: $m\\omega\\sqrt{\\frac{\\hbar}{2m\\omega}} = \\sqrt{\\frac{m\\hbar\\omega}{2}}$.'],
          model:['⟨p⟩ = m d/dt ⟨x⟩', '= -m ω sqrt(ħ/(2mω)) sin(ωt)', '= -sqrt(mħω/2) sin(ωt)']}
      ]},
    {id:'osz-p5', title:'Normierung der Leiterzustände',
      text:'Es gilt $a^\\dagger|n\\rangle = c\\,|n+1\\rangle$ mit einer Konstanten $c > 0$. Bestimme $c$ aus der Norm.',
      ctx:OSZ_MAT({unknowns:{c:{ref:'sqrt(n + 1)'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle n|a\\,a^\\dagger|n\\rangle = \\|a^\\dagger|n\\rangle\\|^2$.', type:'value', target:'n + 1', points:2,
          hints:['Bringe $a\\,a^\\dagger$ in eine Form, deren Wirkung auf $|n\\rangle$ du kennst.', 'Regel: $a a^\\dagger = a^\\dagger a + 1$.', 'Nächster Schritt: $\\langle n|a^\\dagger a|n\\rangle = n$ und $\\langle n|n\\rangle = 1$.'],
          model:['⟨n|a a†|n⟩ = ⟨n|(a† a + 1)|n⟩', '= n + 1']},
        {id:'b', prompt:'b) Bestimme $c$.', type:'solve', unknown:'c', points:2,
          hints:['Vergleiche die Norm beider Seiten von $a^\\dagger|n\\rangle = c\\,|n+1\\rangle$.', 'Rechts steht $|c|^2\\langle n+1|n+1\\rangle = c^2$, links das Ergebnis aus a).', 'Nächster Schritt: $c^2 = n + 1$ mit $c > 0$.'],
          model:['a†|n⟩ = c |n+1⟩', 'c^2 = n + 1', 'c = sqrt(n + 1)']}
      ]},
    {id:'osz-p6', synth:true, title:'Synthese: ein präparierter Oszillator',
      text:'Diese Aufgabe verbindet Normieren (Thema 1), Zeitentwicklung (Thema 2), Messung (Thema 6) und Leiteroperatoren. Ein Oszillator wird bei $t = 0$ im Zustand $|\\psi(0)\\rangle = A\\left(|0\\rangle + \\sqrt2\\,|1\\rangle\\right)$ mit $A > 0$ präpariert. Im Tutorial ist `ψ` schon der normierte, zeitentwickelte Zustand $|\\psi(t)\\rangle$; `H` und `x` sind wie in den anderen Aufgaben definiert.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-iωt/2)|0⟩ + sqrt(2) e^(-3iωt/2)|1⟩)/sqrt(3)'}, state:'ψ', unknowns:{A:{ref:'1/sqrt(3)'}}}),
      goals:[
        {id:'a', prompt:'a) Normiere: Bestimme $A$.', type:'solve', unknown:'A', points:2,
          hints:['Normieren heißt $\\langle\\psi|\\psi\\rangle = 1$.', 'Regel: Für orthonormale $|n\\rangle$ ist $\\langle\\psi|\\psi\\rangle = \\sum_n|c_n|^2$.', 'Nächster Schritt: $|A|^2(1 + 2) = 1$.'],
          model:['|A|^2 (1^2 + sqrt(2)^2) = 1', '3 A^2 = 1', 'A = 1/sqrt(3)']},
        {id:'b', prompt:'b) Berechne den Erwartungswert der Energie $\\langle H\\rangle$.', type:'value', target:'7/6 ħ ω', points:2,
          hints:['Entwickle nach Eigenzuständen; jede Energie zählt mit ihrem Gewicht $|c_n|^2$.', 'Regel: $\\langle H\\rangle = \\sum_n|c_n|^2E_n$ mit $E_n = \\hbar\\omega(n + \\tfrac12)$.', 'Nächster Schritt: $\\tfrac13\\cdot\\tfrac12\\hbar\\omega + \\tfrac23\\cdot\\tfrac32\\hbar\\omega$.'],
          model:['⟨H⟩ = 1/3 · 1/2 ħω + 2/3 · 3/2 ħω', '= 7/6 ħω'], note:'$\\langle H\\rangle$ hängt nicht von $t$ ab: Die Gewichte $|c_n|^2$ ändern sich bei der Zeitentwicklung nicht.'},
        {id:'c', prompt:'c) Berechne $\\langle x\\rangle(t)$.', type:'value', target:'2/3 sqrt(ħ/(mω)) cos(ωt)', points:3,
          hints:['Jeder Anteil bekommt seine Phase $e^{-iE_nt/\\hbar}$; dann $x$ durch $a$, $a^\\dagger$ ausdrücken.', 'Regel: $\\langle x\\rangle = \\sqrt{\\frac{\\hbar}{2m\\omega}}\\cdot 2\\,\\mathrm{Re}(c_0^*c_1)$ für einen Zustand aus $|0\\rangle$ und $|1\\rangle$.', 'Nächster Schritt: $c_0^*c_1 = \\frac{\\sqrt2}{3}e^{-i\\omega t}$.'],
          model:['⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 2 sqrt(2)/3 cos(ωt)', '= 2/3 sqrt(ħ/(mω)) cos(ωt)']},
        {id:'d', prompt:'d) Bestimme die Energieunschärfe $\\Delta H = \\sqrt{\\langle H^2\\rangle - \\langle H\\rangle^2}$.', type:'value', target:'sqrt(2)/3 ħ ω', points:2,
          hints:['Berechne zuerst $\\langle H^2\\rangle$ auf dieselbe Weise wie $\\langle H\\rangle$.', 'Regel: $\\langle H^2\\rangle = \\sum_n|c_n|^2E_n^2$.', 'Nächster Schritt: $\\langle H^2\\rangle = \\tfrac13\\left(\\tfrac{\\hbar\\omega}{2}\\right)^2 + \\tfrac23\\left(\\tfrac{3\\hbar\\omega}{2}\\right)^2 = \\tfrac{19}{12}\\hbar^2\\omega^2$.'],
          model:['⟨H^2⟩ = 1/3 (ħω/2)^2 + 2/3 (3ħω/2)^2', '= 19/12 ħ^2 ω^2', 'ΔH = sqrt(⟨H^2⟩ - ⟨H⟩^2)', '= sqrt(19/12 - 49/36) ħω', '= sqrt(2)/3 ħω']},
        {id:'e', prompt:'e) Zur Zeit $t$ wird die Energie gemessen. Mit welcher Wahrscheinlichkeit erhält man $\\tfrac32\\hbar\\omega$?', type:'value', target:'2/3', points:1,
          hints:['Welcher Eigenzustand gehört zu $\\tfrac32\\hbar\\omega$?', 'Regel (Messpostulat): $P(E_n) = |\\langle n|\\psi\\rangle|^2$.', 'Nächster Schritt: Die Phase hat den Betrag 1; es bleibt $|\\sqrt2/\\sqrt3|^2$.'],
          model:['|⟨1|ψ⟩|^2 = 2/3']},
        {id:'f', prompt:'f) Die Messung hat $\\tfrac32\\hbar\\omega$ ergeben. Berechne danach die Ortsunschärfe $\\Delta x$.', type:'value', target:'sqrt(3ħ/(2mω))', points:2,
          hints:['Nach der Messung ist das System im zugehörigen Eigenzustand – welcher ist das?', 'Regel: $\\Delta x = \\sqrt{\\langle 1|x^2|1\\rangle - \\langle 1|x|1\\rangle^2}$ mit $\\langle n|x^2|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n+1)$.', 'Nächster Schritt: $\\langle 1|x|1\\rangle = 0$ und $\\langle 1|x^2|1\\rangle = \\frac{3\\hbar}{2m\\omega}$.'],
          model:['⟨1|x^2|1⟩ = 3ħ/(2mω)', '⟨1|x|1⟩ = 0', 'sqrt(⟨1|x^2|1⟩ - ⟨1|x|1⟩^2) = sqrt(3ħ/(2mω))'],
          note:'Nach der Messung ist der Zustand $|1\\rangle$ stationär: $\\langle x\\rangle$ schwingt nicht mehr, und eine zweite Energiemessung liefert sicher wieder $\\tfrac32\\hbar\\omega$.'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'osz-f3', title:'Der Aufsteiger hebt die Energie', text:'Besetzungszahlbasis; `H` ist $\\hbar\\omega(a^\\dagger a + \\tfrac12)$, `a` und `a†` sind die Leiteroperatoren.',
      ctx:OSZ_MAT(),
      goals:[{id:'a', prompt:'Zeige $[H, a^\\dagger] = \\hbar\\omega\\,a^\\dagger$.', type:'show', from:'[H, a†]', to:'ħω a†', points:3, model:['[H, a†] = ħω [a† a, a†]', '= ħω a† [a, a†]', '= ħω a†']}]}},
    {aim:1, task:{id:'osz-f4', title:'Grundzustand im Impulsraum', text:'In der Impulsdarstellung ist der Grundzustand eine Funktion $\\varphi_0(p)$. Dort multipliziert $\\hat p$ mit $p$, und es gilt $\\hat x = i\\hbar\\,d/dp$. Auch hier erfüllt der Grundzustand $\\hat a\\varphi_0 = 0$ mit $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right)$. Im Tutorial heißt die Funktion `φ_0`.',
      ctx:{coords:['p'], params:{m:'pos', ω:'pos'}, defs:{'φ_0(p)':'B e^(-p^2/(2 m ω ħ))'}, unknowns:{B:{ref:'(π m ω ħ)^(-1/4)', alt:['-(π m ω ħ)^(-1/4)']}, γ:{ref:'-1/(m ω ħ)', kind:'real'}}, state:'φ_0'},
      goals:[
        {id:'a', prompt:'a) Schreibe $\\hat a\\varphi_0 = 0$ als Differentialgleichung der Form $\\varphi_0\' = \\gamma\\,p\\,\\varphi_0$. Bestimme $\\gamma$.', type:'solve', unknown:'γ', points:2,
          model:['iħ dφ_0/dp + i p/(mω) φ_0 = 0', 'dφ_0/dp = γ p φ_0', 'γ = -1/(mωħ)']},
        {id:'b', prompt:'b) Die Lösung ist $\\varphi_0 = B\\,e^{\\gamma p^2/2}$. Normiere sie ($B > 0$) und berechne $\\langle p^2\\rangle$.', type:'value', target:'m ħ ω/2', points:3,
          model:['|B|^2 ∫_-∞^∞ e^(-p^2/(mωħ)) dp = 1', '|B|^2 = 1/sqrt(π m ω ħ)', '⟨p^2⟩ = |B|^2 ∫_-∞^∞ p^2 e^(-p^2/(mωħ)) dp', '= 1/sqrt(π m ω ħ) · mωħ/2 · sqrt(π m ω ħ)', '= mħω/2']}
      ]}},
    {aim:2, task:{id:'osz-f1', title:'Matrixelement und schwingender Erwartungswert', text:'Besetzungszahlbasis; `x` ist der Ortsoperator, `a` und `a†` die Leiteroperatoren. In b) ist `ψ` der zeitentwickelte Zustand $|\\psi(t)\\rangle$, und `⟨x⟩` ist der Erwartungswert darin.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-5iωt/2)|2⟩ + e^(-7iωt/2)|3⟩)/sqrt(2)'}, state:'ψ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle 2|x^2|0\\rangle$.', type:'value', target:'ħ/(2mω) sqrt(2)', points:2, model:['⟨2|x^2|0⟩ = ħ/(2mω) ⟨2|(a + a†)^2|0⟩', '= ħ/(2mω) ⟨2|a† a†|0⟩', '= ħ/(2mω) sqrt(2)']},
        {id:'b', prompt:'b) Bei $t = 0$ ist der Oszillator im Zustand $\\frac{1}{\\sqrt2}(|2\\rangle + |3\\rangle)$. Berechne $\\langle x\\rangle(t)$.', type:'value', target:'sqrt(3ħ/(2mω)) cos(ωt)', points:3,
          model:['|ψ(t)⟩ = (e^(-5iωt/2)|2⟩ + e^(-7iωt/2)|3⟩)/sqrt(2)', '⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 1/2 · sqrt(3) (e^(-iωt) + e^(iωt))', '= sqrt(3ħ/(2mω)) cos(ωt)']}
      ]}},
    {aim:'k', id:'osz-fk1', type:'mc2',
      q:'Ein Oszillator ist im Zustand $\\frac{1}{\\sqrt2}(|1\\rangle + |2\\rangle)$. Man misst die Energie. Welche Ergebnisse sind möglich?', opts:['$\\tfrac32\\hbar\\omega$ oder $\\tfrac52\\hbar\\omega$', 'nur der Mittelwert $2\\hbar\\omega$', 'jeder Wert zwischen $\\tfrac32\\hbar\\omega$ und $\\tfrac52\\hbar\\omega$'], a:0,
      ex:'Jedes Ergebnis ist ein Eigenwert, hier je mit Wahrscheinlichkeit $\\tfrac12$. Der Erwartungswert $2\\hbar\\omega$ ist der Mittelwert vieler Messungen, kein mögliches Einzelergebnis.',
      reason:{q:'Warum?', opts:['Eine Messung liefert stets einen Eigenwert von $\\hat H$.', 'Eine Messung liefert stets den Erwartungswert.', 'In Überlagerungen ist die Energie kontinuierlich verteilt.'], a:0, ex:'Messpostulat: mögliche Ergebnisse sind die Eigenwerte $E_n$, mit Wahrscheinlichkeit $|\\langle n|\\psi\\rangle|^2$.'}},
    {aim:'k', id:'osz-fk2', type:'dialog',
      text:'Ein Oszillator ist im Grundzustand $\\psi_0$.',
      people:[
        {name:'Lena', says:'Im Grundzustand ist $\\langle x\\rangle = 0$ und $\\langle p\\rangle = 0$. Das Teilchen ruht also im Minimum, und seine kinetische Energie ist null.'},
        {name:'Jonas', says:'Aus $\\langle p\\rangle = 0$ folgt nicht $\\langle p^2\\rangle = 0$. Die mittlere kinetische Energie ist $\\tfrac14\\hbar\\omega$.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$\\langle T\\rangle = \\langle p^2\\rangle/(2m) = \\tfrac14\\hbar\\omega$ – die Hälfte der Nullpunktsenergie. $\\langle p\\rangle = 0$ heißt nur, dass positive und negative Impulse gleich wahrscheinlich sind.'}
  ],
  finalB:[
    {aim:0, task:{id:'osz-f5', title:'Besetzungszahl und Aufsteiger', text:'Besetzungszahlbasis; `N` ist $a^\\dagger a$, `a` und `a†` sind die Leiteroperatoren.',
      ctx:OSZ_MAT(),
      goals:[{id:'a', prompt:'Zeige $[N, a^\\dagger] = a^\\dagger$.', type:'show', from:'[N, a†]', to:'a†', points:3, model:['[N, a†] = [a† a, a†]', '= a† [a, a†]', '= a†']}]}},
    {aim:1, task:{id:'osz-f6', title:'Oszillator mit verschobener Ruhelage', text:'Das Potential ist $V(x) = \\tfrac12m\\omega^2(x - x_0)^2$ mit einer festen Verschiebung $x_0$. Der Absteiger ist dann $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - x_0 + \\frac{i}{m\\omega}\\hat p\\right)$, und der Grundzustand erfüllt $\\hat a\\psi_0 = 0$. Rechne in Ortsdarstellung mit $\\hat p = -i\\hbar\\,d/dx$.',
      ctx:{coords:['x'], params:{m:'pos', ω:'pos', x_0:'real'}, defs:{'ψ_0(x)':'A e^(-m ω (x - x_0)^2/(2ħ))'}, unknowns:{A:{ref:'(m ω/(π ħ))^(1/4)', alt:['-(m ω/(π ħ))^(1/4)']}, β:{ref:'-m ω/ħ', kind:'real'}}, state:'ψ_0'},
      goals:[
        {id:'a', prompt:'a) Schreibe $\\hat a\\psi_0 = 0$ als Differentialgleichung der Form $\\psi_0\' = \\beta\\,(x - x_0)\\,\\psi_0$. Bestimme $\\beta$.', type:'solve', unknown:'β', points:2,
          model:['(x - x_0) ψ_0 + ħ/(mω) dψ_0/dx = 0', 'dψ_0/dx = β (x - x_0) ψ_0', 'β = -mω/ħ']},
        {id:'b', prompt:'b) Die Lösung ist $\\psi_0 = A\\,e^{\\beta(x - x_0)^2/2}$. Normiere sie ($A > 0$) und berechne $\\langle x^2\\rangle$.', type:'value', target:'x_0^2 + ħ/(2mω)', points:3,
          model:['|A|^2 ∫_-∞^∞ e^(-mω (x - x_0)^2/ħ) dx = 1', '|A|^2 = sqrt(mω/(πħ))', '⟨x^2⟩ = |A|^2 ∫_-∞^∞ x^2 e^(-mω (x - x_0)^2/ħ) dx', '= sqrt(mω/(πħ)) ∫_-∞^∞ (u + x_0)^2 e^(-mω u^2/ħ) du', '= sqrt(mω/(πħ)) (ħ/(2mω) sqrt(πħ/(mω)) + x_0^2 sqrt(πħ/(mω)))', '= x_0^2 + ħ/(2mω)']}
      ]}},
    {aim:2, task:{id:'osz-f7', title:'Impuls-Matrixelement und schwingender Erwartungswert', text:'Besetzungszahlbasis; `p` ist der Impulsoperator, `x` der Ortsoperator, `a` und `a†` die Leiteroperatoren. In b) ist `ψ` der zeitentwickelte Zustand $|\\psi(t)\\rangle$, und `⟨x⟩` ist der Erwartungswert darin.',
      ctx:OSZ_MAT({states:{ψ:'(e^(-7iωt/2)|3⟩ + e^(-9iωt/2)|4⟩)/sqrt(2)'}, state:'ψ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle 3|p^2|1\\rangle$.', type:'value', target:'-mħω/2 sqrt(6)', points:2, model:['⟨3|p^2|1⟩ = -mħω/2 ⟨3|(a† - a)^2|1⟩', '= -mħω/2 ⟨3|a† a†|1⟩', '= -mħω/2 sqrt(6)']},
        {id:'b', prompt:'b) Bei $t = 0$ ist der Oszillator im Zustand $\\frac{1}{\\sqrt2}(|3\\rangle + |4\\rangle)$. Berechne $\\langle x\\rangle(t)$.', type:'value', target:'sqrt(2ħ/(mω)) cos(ωt)', points:3,
          model:['|ψ(t)⟩ = (e^(-7iωt/2)|3⟩ + e^(-9iωt/2)|4⟩)/sqrt(2)', '⟨x⟩ = sqrt(ħ/(2mω)) ⟨ψ|(a + a†)|ψ⟩', '= sqrt(ħ/(2mω)) · 1/2 · 2 (e^(-iωt) + e^(iωt))', '= sqrt(2ħ/(mω)) cos(ωt)']}
      ]}},
    {aim:'k', id:'osz-fk3', type:'mc2',
      q:'Viele Oszillatoren werden gleich präpariert, im Zustand $\\frac{1}{\\sqrt2}(|0\\rangle + |3\\rangle)$. An jedem misst man einmal die Energie. Welche Einzelergebnisse treten auf?', opts:['nur $\\tfrac12\\hbar\\omega$ und $\\tfrac72\\hbar\\omega$', 'bei jedem Oszillator $2\\hbar\\omega$', 'Werte zwischen $\\tfrac12\\hbar\\omega$ und $\\tfrac72\\hbar\\omega$, gehäuft um $2\\hbar\\omega$'], a:0,
      ex:'Jede Einzelmessung liefert einen Eigenwert, hier jeden in etwa der Hälfte der Fälle. Der Mittelwert $2\\hbar\\omega$ ist kein Eigenwert und tritt bei keiner Einzelmessung auf.',
      reason:{q:'Warum?', opts:['Messergebnisse sind Eigenwerte von $\\hat H$.', 'Jeder einzelne Oszillator hat die mittlere Energie.', 'Überlagerungen haben ein kontinuierliches Spektrum.'], a:0, ex:'Messpostulat: Mögliche Ergebnisse sind die Eigenwerte $E_n = \\hbar\\omega(n + \\tfrac12)$, mit Wahrscheinlichkeit $|\\langle n|\\psi\\rangle|^2$. Das Spektrum von $\\hat H$ bleibt diskret, gleich welcher Zustand präpariert ist.'}},
    {aim:'k', id:'osz-fk4', type:'dialog',
      text:'Ein Oszillator ist im ersten angeregten Zustand $\\psi_1$.',
      people:[
        {name:'Lena', says:'In $\\psi_1$ ist $\\langle x\\rangle = 0$. Das Teilchen ist also im Mittel im Minimum, und die mittlere potentielle Energie $\\langle V\\rangle$ ist null.'},
        {name:'Jonas', says:'Aus $\\langle x\\rangle = 0$ folgt nicht $\\langle x^2\\rangle = 0$. Die mittlere potentielle Energie ist $\\tfrac34\\hbar\\omega$.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$\\langle V\\rangle = \\tfrac12m\\omega^2\\langle x^2\\rangle = \\tfrac12m\\omega^2\\cdot\\frac{3\\hbar}{2m\\omega} = \\tfrac34\\hbar\\omega$ – die Hälfte von $E_1 = \\tfrac32\\hbar\\omega$. $\\langle x\\rangle = 0$ heißt nur, dass Auslenkungen nach links und rechts gleich wahrscheinlich sind.'}
  ],
  errors:[
    {id:'osz-e1', title:'Ein vergessenes „+1“',
      text:'Gesucht ist $\\langle n|x^2|n\\rangle$:',
      ctx:OSZ_MAT(),
      lines:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a + a†)^2|n⟩', '= ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω) (n + n)', '= ħ n/(mω)'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$\\langle n|a a^\\dagger|n\\rangle = n + 1$, nicht $n$.', '$\\langle n|a^\\dagger a|n\\rangle = n + 1$, nicht $n$.', 'Der Vorfaktor müsste quadriert werden.'], a:0, ex:'$a a^\\dagger = a^\\dagger a + 1$. Test: Für $n = 0$ käme $\\langle x^2\\rangle = 0$ heraus – unmöglich bei einer Gauß-Funktion.'},
      fix:{id:'a', prompt:'Berichtige und rechne zu Ende.', type:'value', target:'ħ/(2mω) (2n + 1)', model:['⟨n|x^2|n⟩ = ħ/(2mω) ⟨n|(a a† + a† a)|n⟩', '= ħ/(2mω) (n + 1 + n)', '= ħ/(2mω) (2n + 1)']}},
    {id:'osz-e2', title:'Ein Vorzeichen in der Grundzustandsgleichung',
      text:'Aus $\\hat a\\psi_0 = 0$ wird $\\psi_0$ bestimmt. Gesucht ist die Zahl $\\beta$ in $\\psi_0\' = \\beta\\,x\\,\\psi_0$:',
      ctx:OSZ_GROUND(),
      lines:['x ψ_0 + ħ/(mω) dψ_0/dx = 0', 'dψ_0/dx = mω/ħ x ψ_0', 'ψ_0(x) = A e^(mω x^2/(2ħ))'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Das Minuszeichen ging beim Auflösen verloren.', 'Der Faktor $m\\omega/\\hbar$ gehört in den Nenner.', 'Man darf nicht durch $\\hbar/(m\\omega)$ teilen.'], a:0, ex:'Richtig ist $\\psi_0\' = -\\frac{m\\omega}{\\hbar}x\\psi_0$. Mit dem falschen Vorzeichen wüchse $\\psi_0$ wie $e^{+x^2}$ – nicht normierbar. Das ist ein guter Plausibilitätstest.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $\\beta$.', type:'solve', unknown:'β', model:['x ψ_0 + ħ/(mω) dψ_0/dx = 0', 'dψ_0/dx = β x ψ_0', 'β = -mω/ħ']}}
  ]
});
lexe('leiteroperatoren', 'Leiteroperatoren (Oszillator)', '$\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x + \\frac{i}{m\\omega}\\hat p\\right)$, $\\hat a^\\dagger = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(\\hat x - \\frac{i}{m\\omega}\\hat p\\right)$, $[\\hat a,\\hat a^\\dagger] = 1$. Wirkung: $\\hat a|n\\rangle = \\sqrt n|n-1\\rangle$, $\\hat a^\\dagger|n\\rangle = \\sqrt{n+1}|n+1\\rangle$, $\\hat a^\\dagger\\hat a|n\\rangle = n|n\\rangle$. Ortsdarstellung: $\\hat a = \\sqrt{\\frac{m\\omega}{2\\hbar}}\\left(x + \\frac{\\hbar}{m\\omega}\\frac{d}{dx}\\right)$. $\\hat a$ ist nicht hermitesch und keine Observable.', {topic:'osz'});
lexe('oszillator-spektrum', 'Harmonischer Oszillator: Spektrum', '$V = \\tfrac12m\\omega^2x^2$, $\\hat H = \\hbar\\omega(\\hat a^\\dagger\\hat a + \\tfrac12)$, $E_n = \\hbar\\omega(n + \\tfrac12)$, $n = 0, 1, 2, \\dots$ Nullpunktsenergie $\\tfrac12\\hbar\\omega$, äquidistante Niveaus, keine Entartung in 1D.', {topic:'osz'});
lexe('hermite-funktionen', 'Eigenfunktionen des Oszillators', '$\\psi_n(x) = \\frac{1}{\\sqrt{2^nn!}}\\left(\\frac{m\\omega}{\\pi\\hbar}\\right)^{1/4}H_n(\\xi)e^{-\\xi^2/2}$, $\\xi = \\sqrt{m\\omega/\\hbar}\\,x$. Hermite-Polynome: $H_0 = 1$, $H_1 = 2\\xi$, $H_2 = 4\\xi^2 - 2$, $H_3 = 8\\xi^3 - 12\\xi$. Im Tutorial: `H_n(ξ)` oder `hermite(n, ξ)`.', {topic:'osz'});
lexe('osz-orts-impuls', 'Ort und Impuls durch Leiteroperatoren', '$\\hat x = \\sqrt{\\frac{\\hbar}{2m\\omega}}(\\hat a + \\hat a^\\dagger)$, $\\hat p = i\\sqrt{\\frac{m\\omega\\hbar}{2}}(\\hat a^\\dagger - \\hat a)$. Damit: $\\langle n|\\hat x^2|n\\rangle = \\frac{\\hbar}{2m\\omega}(2n+1)$, $\\langle n|\\hat p^2|n\\rangle = \\frac{m\\omega\\hbar}{2}(2n+1)$, $\\langle n\\pm1|\\hat x|n\\rangle = \\sqrt{\\frac{\\hbar}{2m\\omega}}\\sqrt{n + \\tfrac12 \\pm \\tfrac12}$.', {topic:'osz'});
lexe('osz-korrespondenz', 'Korrespondenzprinzip (Oszillator)', 'Für große Quantenzahlen nähern sich quantenmechanische Ergebnisse den klassischen: Das räumliche Mittel von $|\\psi_n|^2$ nähert sich der klassischen Aufenthaltsdichte $\\rho_{\\text{kl}} = 1/(\\pi\\sqrt{A^2 - x^2})$, die Knoten werden immer feiner. $\\langle x\\rangle$ und $\\langle p\\rangle$ folgen in jedem Zustand exakt der klassischen Bewegung mit $\\omega$ (Ehrenfest). $\\langle x^2\\rangle$ kann dagegen mit $2\\omega$ schwingen, etwa in $|0\\rangle + |2\\rangle$.', {topic:'osz'});
lexe('osz-molekuel', 'Molekülschwingungen und IR-Spektren', 'Eine Bindung nahe ihrem Gleichgewichtsabstand ist ein Oszillator mit $\\omega = \\sqrt{k/\\mu}$, $\\mu = m_1m_2/(m_1+m_2)$. Dipolübergänge haben im harmonischen Modell die Auswahlregel $\\Delta n = \\pm1$ und die Energie $\\hbar\\omega$. Beispiel HCl: Wellenzahl $2886\\,\\mathrm{cm^{-1}}$, $\\hbar\\omega \\approx 0{,}36\\,\\mathrm{eV}$, $k \\approx 480\\,\\mathrm{N/m}$ (aus der beobachteten Grundschwingung; mit der harmonischen Konstante $\\omega_e \\approx 2991\\,\\mathrm{cm^{-1}}$ ergeben sich etwa $516\\,\\mathrm{N/m}$). Schwache Obertöne bei knapp $2\\hbar\\omega$ zeigen: Weder das Dipolmoment ist exakt linear noch die Bindung exakt harmonisch. Dass sie knapp unter $2\\hbar\\omega$ liegen, zeigt die Anharmonizität der Bindung.', {topic:'osz'});
