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
  wozu:'Das Wasserstoffatom ist das einzige Atom, dessen Schrödingergleichung sich exakt lösen lässt (zusammen mit wasserstoffähnlichen Ionen wie He⁺). Seine Energieniveaus erklären die Spektrallinien des Wasserstoffs, etwa die rote $H_\\alpha$-Linie bei $656\\,\\mathrm{nm}$, mit der Astronomen leuchtende Gaswolken kartieren. Die Quantenzahlen $n, l, m$ und die Orbitale s, p, d sind die Grundlage für das Periodensystem und die Chemie.',
  bridge:'Aus Thema 8 kommen $\\hat L^2$, die Kugelflächenfunktionen $Y_l^m$ und der Eigenwert $\\hbar^2l(l+1)$. Die Radialgleichung ist ein eindimensionales Problem wie in Thema 3 und 5, und die Quantisierung durch den Abbruch einer Potenzreihe kennst du vom Oszillator (Thema 7). Mathematisch brauchst du Kugelkoordinaten und den Laplace-Operator (M8).',
  diag:[
    {q:'Wie beginnst du, um $\\langle r\\rangle$ im Zustand mit der Radialfunktion $R_{21}$ zu berechnen?', opts:['$\\int_0^\\infty r\\,|R_{21}|^2\\,r^2\\,dr$ aufstellen', '$\\int_0^\\infty r\\,|R_{21}|^2\\,dr$ aufstellen', '$\\langle r\\rangle = n^2a_0$ aus dem Bohrschen Modell nehmen'], a:0,
      ex:'Das Maß in Kugelkoordinaten enthält $r^2$; der Winkelteil ist mit $\\int|Y|^2d\\Omega = 1$ erledigt. Der Bohrsche Radius $n^2a_0$ ist der wahrscheinlichste Abstand für $l = n-1$, nicht der Mittelwert ($\\langle r\\rangle = 5a_0$ für $2p$).'},
    {q:'Wie beginnst du, um zu prüfen, ob $u(r) = r^2e^{-r/(2a_0)}$ zu einem Eigenzustand mit $l = 1$ gehört?', opts:['In die Radialgleichung mit dem Glied $\\frac{\\hbar^2l(l+1)}{2mr^2}$ einsetzen', 'In die Radialgleichung ohne Zentrifugalglied einsetzen', 'Prüfen, ob $u$ auf $\\int_0^\\infty|u|^2dr = 1$ normiert ist'], a:0,
      ex:'Ob eine Funktion Eigenzustand ist, zeigt nur die Eigenwertgleichung, und für $l = 1$ gehört das Zentrifugalglied $\\hbar^2/(mr^2)$ dazu. Die Normierung ändert daran nichts.'}
  ],
  phenomenon:{
    title:'Vier Linien und eine Grenze',
    text:'Schickt man Strom durch Wasserstoffgas, leuchtet es rötlich. Ein Gitter zerlegt das Licht in einzelne scharfe Linien. Im Sichtbaren sieht man vier: bei $656$, $486$, $434$ und $410\\,\\mathrm{nm}$. Ein Spektrometer, das auch ins nahe Ultraviolett reicht, findet weitere Linien derselben Serie.',
    q:{q:'Wie liegen die weiteren Linien?', opts:['in gleichen Energieabständen, ohne Ende', 'immer dichter, bis zu einer Grenze bei etwa $365\\,\\mathrm{nm}$', 'Es gibt keine weiteren; vier Linien gehören zu vier Niveaus.'], a:1,
      ex:'Sie rücken immer dichter zusammen und häufen sich an einer Seriengrenze.',
      fb:['Gleiche Abstände der Photonenenergien gäbe es bei gleich weit entfernten Niveaus, wie beim Oszillator (Thema 7). Hier liegen die Niveaus wie $-1/n^2$ – nach oben immer dichter. Deshalb rücken auch die Linien zusammen.',
        'Richtig. Die Linien gehören zu Übergängen $n \\to 2$ mit $n = 3, 4, 5, \\dots$ Für $n\\to\\infty$ rücken die Niveaus zusammen; die Linien häufen sich bei der Seriengrenze nahe $365\\,\\mathrm{nm}$.',
        'Eine Linie gehört nicht zu einem Niveau, sondern zu einem **Paar** von Niveaus. Und es gibt unendlich viele gebundene Niveaus.']},
    reveal:'Die Wellenlängen folgen der Balmer-Formel\n\n$$\\frac1\\lambda = R_H\\left(\\frac14 - \\frac1{n^2}\\right),\\qquad n = 3, 4, 5, \\dots$$\n\nmit der Rydberg-Konstanten $R_H \\approx 1{,}097\\cdot10^7\\,\\mathrm m^{-1}$. Für $n \\to \\infty$ folgt $\\lambda \\to 4/R_H \\approx 365\\,\\mathrm{nm}$. Die Formel war 1885 empirisch bekannt. In diesem Thema leitest du sie aus der Schrödingergleichung her: $E_n = -13{,}6\\,\\mathrm{eV}/n^2$, und jede Linie ist die Energiedifferenz zweier Niveaus.'
  },
  teach:[
    {id:'h-t1', title:'Ein Elektron im Coulombfeld',
      text:[
        'Das Wasserstoffatom besteht aus einem Proton und einem Elektron. Sie ziehen sich mit dem Coulombpotential an:',
        '$$V(r) = -\\frac{e^2}{4\\pi\\varepsilon_0\\,r}.$$',
        'Hier ist $r$ der Abstand der beiden Teilchen. Wie in der klassischen Mechanik trennt man die Bewegung des Schwerpunkts ab. Übrig bleibt ein einziges Teilchen mit der reduzierten Masse $\\mu = m_em_p/(m_e+m_p)$ im festen Potential $V(r)$. Weil das Proton rund 1836-mal schwerer ist, ist $\\mu$ nur um $0{,}05\\,\\%$ kleiner als $m_e$. Im Folgenden steht $m$ für diese Masse.',
        'Die zeitunabhängige [[lex:schroedinger|Schrödingergleichung]] ist jetzt dreidimensional:',
        '$$-\\frac{\\hbar^2}{2m}\\nabla^2\\psi + V(r)\\,\\psi = E\\,\\psi.$$',
        'Das Potential hängt nur vom Abstand ab, nicht von der Richtung. So ein [[lex:h-zentralpotential|Zentralpotential]] ist kugelsymmetrisch. Daraus folgt: $\\hat H$ vertauscht mit allen Komponenten des Drehimpulses und mit $\\hat L^2$. Man kann also Energie, $L^2$ und $L_z$ gleichzeitig scharf wählen (Thema 8). Die Eigenzustände tragen drei Quantenzahlen $n, l, m$.',
        '**Natürliche Einheiten.** Aus $\\hbar$, $m$ und $e^2/(4\\pi\\varepsilon_0)$ lässt sich genau eine Länge bilden, der [[lex:bohrradius|Bohrsche Radius]]',
        '$$a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{me^2} \\approx 0{,}529\\cdot10^{-10}\\,\\mathrm m.$$',
        'Damit ist $e^2/(4\\pi\\varepsilon_0) = \\hbar^2/(ma_0)$, und das Potential lautet',
        '$$V(r) = -\\frac{\\hbar^2}{m a_0\\,r}.$$',
        'So schreibt das Tutorial das Potential. Die zugehörige Energieskala ist $\\frac{\\hbar^2}{2ma_0^2} \\approx 13{,}6\\,\\mathrm{eV}$. Das ist, wie sich zeigen wird, die Ionisierungsenergie aus dem Grundzustand.',
        '**Was das Bohrsche Modell konnte und was nicht.** Bohr ließ 1913 das Elektron auf Kreisbahnen mit Drehimpuls $L = n\\hbar$ laufen und erhielt die richtigen Energien. Die Quantenmechanik bestätigt die Energien, aber nicht das Bild. Es gibt keine Bahnen, und im Grundzustand ist der Bahndrehimpuls nicht $\\hbar$, sondern null. Außerdem erklärt erst sie, warum zu einem $n$ mehrere Zustände gehören und wie sich das Elektron um den Kern verteilt.'
      ].join('\n\n'),
      q:[
        {q:'Warum kann man $\\hat H$, $\\hat L^2$ und $\\hat L_z$ gleichzeitig scharf wählen?', opts:['Weil $V$ nur von $r$ abhängt (kugelsymmetrisch).', 'Weil das Elektron auf einer festen Kreisbahn läuft.', 'Weil alle drei Operatoren dieselben Eigenwerte haben.'], a:0, ex:'Ein kugelsymmetrisches $\\hat H$ vertauscht mit allen Drehungen, also mit $\\hat L^2$ und $\\hat L_z$. Diese vertauschen untereinander (Thema 8).'},
        {q:'Welche Länge entsteht aus $\\hbar$, $m$ und $e^2/(4\\pi\\varepsilon_0)$?', opts:['$\\frac{4\\pi\\varepsilon_0\\hbar^2}{me^2}$', '$\\frac{4\\pi\\varepsilon_0\\hbar}{me^2}$', '$\\frac{me^2}{4\\pi\\varepsilon_0\\hbar^2}$'], a:0, ex:'$e^2/(4\\pi\\varepsilon_0)$ hat die Einheit Energie mal Länge. $\\hbar^2/m$ ebenfalls Energie mal Länge². Der Quotient ist eine Länge: $a_0$. Der dritte Ausdruck ist $1/a_0$.'}
      ]},
    {id:'h-t2', title:'Separation in Kugelkoordinaten',
      text:[
        'In [[lex:kugelkoordinaten|Kugelkoordinaten]] zerfällt der [[lex:laplace-operator|Laplace-Operator]] in einen radialen Teil und einen Winkelteil. Der Winkelteil ist genau $-\\hat L^2/(\\hbar^2r^2)$ aus Thema 8:',
        '$$\\nabla^2 = \\frac{1}{r^2}\\frac{\\partial}{\\partial r}\\left(r^2\\frac{\\partial}{\\partial r}\\right) - \\frac{\\hat L^2}{\\hbar^2r^2}.$$',
        'Die Schrödingergleichung lautet damit',
        '$$-\\frac{\\hbar^2}{2m}\\frac{1}{r^2}\\frac{\\partial}{\\partial r}\\left(r^2\\frac{\\partial\\psi}{\\partial r}\\right) + \\frac{\\hat L^2}{2mr^2}\\psi + V(r)\\psi = E\\psi.$$',
        'Der Term $\\hat L^2/(2mr^2)$ ist die Rotationsenergie, wie klassisch $L^2/(2mr^2)$.',
        '**Separationsansatz.** Weil $\\hat L^2$ nur auf die Winkel wirkt, versucht man ([[lex:separation|Separation]], wie in Thema 2)',
        '$$\\psi(r,\\theta,\\varphi) = R(r)\\,Y_l^m(\\theta,\\varphi).$$',
        'Mit $\\hat L^2Y_l^m = \\hbar^2l(l+1)Y_l^m$ wird aus dem Operator $\\hat L^2$ die Zahl $\\hbar^2l(l+1)$. Der Faktor $Y_l^m$ steht dann in jedem Term und fällt heraus. Übrig bleibt eine gewöhnliche Differentialgleichung für $R(r)$:',
        '$$-\\frac{\\hbar^2}{2m}\\frac{1}{r^2}\\frac{d}{dr}\\left(r^2\\frac{dR}{dr}\\right) + \\left[V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}\\right]R = ER.$$',
        'Der Winkelteil ist für **jedes** Zentralpotential derselbe; nur die Radialgleichung hängt von $V(r)$ ab. Die Quantenzahl $m$ kommt in ihr nicht vor. Deshalb hängt die Energie in einem Zentralpotential nie von $m$ ab: Jedes Niveau mit Drehimpuls $l$ ist mindestens $(2l+1)$-fach entartet.',
        '**Die Substitution $u = rR$.** Der Ausdruck $\\frac{1}{r^2}(r^2R\')\'$ ist unhandlich. Mit $u(r) = r\\,R(r)$ wird er zu $u\'\'/r$ (Herleitung). Nach Multiplikation mit $r$ entsteht die [[lex:radialgleichung|Radialgleichung]]',
        '$$-\\frac{\\hbar^2}{2m}u\'\' + V_{\\text{eff}}(r)\\,u = E\\,u,\\qquad V_{\\text{eff}} = V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}.$$',
        'Sie sieht aus wie eine eindimensionale Schrödingergleichung auf der Halbachse $r > 0$. Auch die Normierung wird eindimensional:',
        '$$\\int|\\psi|^2d^3r = \\int_0^\\infty|R|^2r^2dr\\cdot\\int|Y_l^m|^2d\\Omega = \\int_0^\\infty|u|^2dr = 1.$$',
        'Das Maß $r^2dr$ ist kein Zusatz, sondern das Volumen der Kugelschale. Wer es vergisst, normiert falsch.',
        '**Radialfunktion oder Wellenfunktion?** Ein häufiger Fehler ist, $R$ und $\\psi$ zu verwechseln. $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$ ist auf $\\int_0^\\infty|R|^2r^2dr = 1$ normiert. Die Wellenfunktion ist $\\psi_{100} = R_{10}Y_0^0$ mit $Y_0^0 = 1/\\sqrt{4\\pi}$; sie ist auf $\\int|\\psi|^2d^3r = 1$ normiert. Beide unterscheiden sich also um den Faktor $1/\\sqrt{4\\pi}$. Für $l = 0$ fehlt das Zentrifugalglied, und die Radialgleichung sieht genau wie eine eindimensionale Schrödingergleichung aus – mit der Randbedingung $u(0) = 0$ (nächster Abschnitt).'
      ].join('\n\n'),
      derive:{ctx:HRAD({abstract:{u:{args:['r']}}, defs:{'R(r)':'u(r)/r'}}), lines:[
        {l:"d/dr R(r) = u'(r)/r - u(r)/r^2",
          why:{q:'Welche Regel wurde benutzt?', opts:['Quotientenregel (oder Produktregel mit $1/r$)', 'Kettenregel mit innerer Funktion $r^2$', 'partielle Integration ohne Randterm'], a:0, ex:'$\\frac{d}{dr}\\frac{u}{r} = \\frac{u\'}{r} - \\frac{u}{r^2}$.'}},
        {l:"r^2 d/dr R(r) = r u'(r) - u(r)", w:'mit r² multipliziert'},
        {l:"d/dr (r^2 d/dr R(r)) = r u''(r)",
          why:{q:'Wohin sind die Terme mit $u\'$ verschwunden?', opts:['$u\' + ru\'\' - u\'$: die beiden $u\'$ heben sich weg.', 'Sie sind null, weil $u(0) = 0$ ist.', 'Sie wurden vernachlässigt, weil $r$ groß ist.'], a:0, ex:'Produktregel für $ru\'$ gibt $u\' + ru\'\'$, die Ableitung von $-u$ gibt $-u\'$.'}},
        {l:"1/r^2 d/dr (r^2 d/dr R(r)) = u''(r)/r",
          why:{q:'Was gewinnt man damit?', opts:['Mit $r$ multipliziert, sieht sie aus wie in 1D.', 'Man spart sich das Maß $r^2dr$ in allen Erwartungswerten.', 'Das Zentrifugalglied fällt dabei vollständig weg.'], a:0, ex:'Jeder Term der Gleichung für $R$ enthält dann den Faktor $1/r$; multipliziert man mit $r$, steht $u$ allein da. Das Zentrifugalglied bleibt.'}}
      ]},
      q:[
        {q:'Warum kommt $m$ in der Radialgleichung nicht vor?', opts:['Sie enthält nur $\\hat L^2$, und dessen Eigenwert hängt nur von $l$ ab.', 'Weil $m$ bei gebundenen Zuständen immer null ist.', 'Weil $\\hat L_z$ nicht mit $\\hat H$ vertauscht und deshalb herausfällt.'], a:0, ex:'$\\hat L_z$ vertauscht sehr wohl mit $\\hat H$; es kommt im Hamilton-Operator aber nicht vor.'},
        {q:'Wie lautet die Normierung, ausgedrückt durch $u = rR$?', opts:['$\\int_0^\\infty|u|^2dr = 1$', '$\\int_0^\\infty|u|^2r^2dr = 1$', '$4\\pi\\int_0^\\infty|u|^2dr = 1$'], a:0, ex:'$|R|^2r^2 = |u|^2$. Der Faktor $4\\pi$ steckt schon in $\\int|Y|^2d\\Omega = 1$.'}
      ]},
    {id:'h-t3', title:'Die Radialgleichung: Verhalten am Rand',
      text:[
        'Bevor man die Radialgleichung löst, lohnt ein Blick auf ihr Verhalten bei kleinen und großen $r$.',
        '**Das effektive Potential.** Für $l > 0$ ist $V_{\\text{eff}}$ die Summe aus dem anziehenden Coulombterm und der abstoßenden Zentrifugalbarriere $\\hbar^2l(l+1)/(2mr^2)$. Nahe $r = 0$ gewinnt die Barriere, denn $1/r^2$ wächst schneller als $1/r$. Sie hält Elektronen mit Drehimpuls vom Kern fern. Nur für $l = 0$ fehlt sie.',
        '**Kleine $r$.** Dort dominieren $u\'\'$ und das Zentrifugalglied. Der Ansatz $u \\propto r^s$ ergibt $s(s-1) = l(l+1)$, also $s = l + 1$ oder $s = -l$. Die zweite Lösung ist unbrauchbar. Für $l \\ge 1$ ist sie nicht normierbar. Für $l = 0$ wäre $R = u/r \\propto 1/r$; das löst die Schrödingergleichung am Ursprung nicht, weil $\\nabla^2(1/r)$ dort eine δ-Funktion erzeugt. Also',
        '$$u(r) \\propto r^{l+1},\\qquad R(r) \\propto r^l\\qquad (r\\to0),\\qquad u(0) = 0.$$',
        'Nur s-Zustände ($l = 0$) haben am Kern eine von null verschiedene Dichte.',
        '**Große $r$.** Dort fallen beide Potentialterme weg, und es bleibt $u\'\' = \\kappa^2u$ mit $\\kappa = \\sqrt{-2mE}/\\hbar$. Für gebundene Zustände ist $E < 0$, also $\\kappa$ reell. Die normierbare Lösung fällt ab:',
        '$$u(r) \\propto e^{-\\kappa r}\\qquad (r\\to\\infty).$$',
        'Die andere Lösung $e^{+\\kappa r}$ ist verboten. Für $E > 0$ gäbe es statt des Abfalls Wellen, die ins Unendliche laufen. Das sind die ungebundenen Streuzustände: das ionisierte Atom. Ihre Energien sind nicht quantisiert.',
        '**Die Idee der Lösung** ist also der Ansatz $u = r^{l+1}\\,e^{-\\kappa r}\\,v(r)$ mit einer Funktion $v$, die zwischen beiden Grenzen vermittelt. Wie beim Oszillator (Thema 7) wird sich zeigen: Nur wenn $v$ ein Polynom ist, bleibt $u$ normierbar. Das legt die erlaubten $\\kappa$ und damit die Energien fest.',
        '**Ein erstes Beispiel** lässt sich schon prüfen. Für $l = 0$ hat $u = r\\,e^{-r/a_0}$ an beiden Rändern die richtige Form. Setzt man es ein, heben sich die Terme mit $1/r$ genau dann weg, wenn der Exponent $r/a_0$ ist, und es bleibt $E = -\\hbar^2/(2ma_0^2)$: der Grundzustand. Eine Übungsaufgabe rechnet das nach.'
      ].join('\n\n'),
      derive:{ctx:HRAD({params:{a_0:'pos', m:'pos', l:{int:[0, 3]}, κ:'pos'}}), lines:[
        {l:'d^2/dr^2 r^(l+1) = l(l+1) r^(l-1)',
          why:{q:'Was wurde benutzt?', opts:['zweimal die Potenzregel: $(l+1)\\,l\\,r^{l-1}$', 'die Produktregel mit $r^l$ und $r$', 'die Kettenregel mit innerer Funktion $l + 1$'], a:0, ex:'$\\frac{d}{dr}r^{l+1} = (l+1)r^l$, noch einmal: $(l+1)l\\,r^{l-1}$.'}},
        {l:'-d^2/dr^2 r^(l+1) + l(l+1)/r^2 r^(l+1) = 0',
          why:{q:'Was zeigt diese Zeile?', opts:['Nahe $r = 0$ gleichen sich $u\'\'$ und Zentrifugalglied aus.', 'Die Energie ist null für $l > 0$.', 'Das Coulombpotential ist bei kleinem $r$ unwichtig, weil es klein ist.'], a:0, ex:'Coulomb- und Energieterm sind bei kleinem $r$ um Potenzen von $r$ kleiner als diese beiden Terme. Das Coulombpotential ist dort zwar groß, aber nicht so groß wie $1/r^2$.'}},
        {l:'d^2/dr^2 e^(-κ r) = κ^2 e^(-κ r)',
          why:{q:'Welche Gleichung erfüllt $e^{-\\kappa r}$?', opts:['$u\'\' = \\kappa^2u$, die Gleichung für große $r$', 'die volle Radialgleichung für alle $r$', '$u\'\' = -\\kappa^2u$ wie eine Schwingung'], a:0, ex:'Für große $r$ bleibt $-\\frac{\\hbar^2}{2m}u\'\' = Eu$ mit $E < 0$, also $u\'\' = \\kappa^2u$.'}}
      ]},
      q:[
        {q:'Wie verhält sich $R_{nl}(r)$ für $r \\to 0$ bei $l = 2$?', opts:['$\\propto r^2$', '$\\propto r^3$', 'endlich, aber nicht null'], a:0, ex:'$u \\propto r^{l+1} = r^3$, also $R = u/r \\propto r^2$.'},
        {q:'Warum muss für gebundene Zustände $E < 0$ sein?', opts:['Sonst klingt $u$ für große $r$ nicht ab.', 'Weil die kinetische Energie negativ ist.', 'Weil $V_{\\text{eff}}$ überall negativ ist.'], a:0, ex:'Für $E > 0$ ist $\\kappa$ imaginär: $u$ schwingt bis ins Unendliche und ist nicht normierbar. $V_{\\text{eff}}$ ist für $l > 0$ nahe dem Kern positiv.'}
      ]},
    {id:'h-t4', title:'Energieniveaus und Entartung',
      text:[
        '**Ein einfacher Fall zuerst.** Für $l = n - 1$ ist $v$ eine Konstante. Probiere',
        '$$u(r) = r^n e^{-r/(na_0)},\\qquad l = n - 1.$$',
        'Die Herleitung zeigt: Das ist eine Lösung der Radialgleichung, und zwar mit',
        '$$E_n = -\\frac{\\hbar^2}{2ma_0^2}\\,\\frac{1}{n^2} \\approx -\\frac{13{,}6\\,\\mathrm{eV}}{n^2}.$$',
        'Die Terme mit $1/r^2$ heben sich mit der Zentrifugalbarriere weg, die mit $1/r$ mit dem Coulombpotential. Übrig bleibt eine Konstante mal $u$ – die Energie.',
        '**Allgemein.** Mit $\\kappa = \\sqrt{-2mE}/\\hbar$ und $\\rho = \\kappa r$ setzt man $u = \\rho^{l+1}e^{-\\rho}v(\\rho)$ an. Für $v = \\sum_jc_j\\rho^j$ folgt aus der Radialgleichung durch Koeffizientenvergleich die Rekursion',
        '$$c_{j+1} = \\frac{2(j + l + 1) - \\rho_0}{(j+1)(j + 2l + 2)}\\,c_j,\\qquad \\rho_0 = \\frac{2}{\\kappa a_0}.$$',
        'Für große $j$ ist $c_{j+1} \\approx \\frac{2}{j}c_j$. So wachsen die Koeffizienten von $e^{2\\rho}$; dann wüchse $u$ wie $e^{+\\rho}$ und wäre nicht normierbar. Die Reihe muss also abbrechen: Bei einem $j_{\\max} = N$ wird der Zähler null, $\\rho_0 = 2(N + l + 1)$. Man nennt',
        '$$n = N + l + 1 = 1, 2, 3, \\dots$$',
        'die **Hauptquantenzahl**. Aus $\\rho_0 = 2n$ folgt $\\kappa = 1/(na_0)$ und wieder $E_n = -\\hbar^2/(2ma_0^2n^2)$ ([[lex:wasserstoff-energie|Energieniveaus]]). Die Polynome $v$ sind zugeordnete [[lex:laguerre-polynome|Laguerre-Polynome]]; $N = n - l - 1$ ist die Zahl der radialen Knoten.',
        '**Quantenzahlen und Entartung.** Zu festem $n$ ist $l = 0, 1, \\dots, n - 1$ möglich, denn $N \\ge 0$. Zu jedem $l$ gibt es $2l + 1$ Werte von $m$. Die Energie hängt aber nur von $n$ ab. Also gehören zu $E_n$ insgesamt',
        '$$\\sum_{l=0}^{n-1}(2l+1) = n^2$$',
        'Zustände: $E_n$ ist $n^2$-fach [[lex:h-entartung|entartet]] (ohne Spin; mit Spin $2n^2$). Die Entartung in $m$ hat jedes Zentralpotential. Die Entartung in $l$ ist eine Besonderheit des $1/r$-Potentials. Sie hängt mit einer zusätzlichen Erhaltungsgröße zusammen, dem Lenz-Runge-Vektor, der auch klassisch die Keplerellipsen festhält. In Atomen mit mehreren Elektronen fehlt diese Entartung; dort liegt etwa $3s$ tiefer als $3p$.',
        '**Benennung.** Man schreibt $n$ als Zahl und $l$ als Buchstaben: s, p, d, f für $l = 0, 1, 2, 3$. Der Grundzustand ist $1s$. Zum ersten angeregten Niveau gehören $2s$ und drei $2p$-Zustände. Typischer Fehler: $l = n$ zulassen. Für $n = 1$ gibt es nur $l = 0$; einen Zustand $1p$ gibt es nicht.'
      ].join('\n\n'),
      derive:{ctx:HRAD({params:{a_0:'pos', m:'pos', n:{int:[1, 4]}}, defs:{'u(r)':'r^n e^(-r/(n a_0))', 'V(r)':'-ħ^2/(m a_0 r)'}}), lines:[
        {l:"u'(r) = (n/r - 1/(n a_0)) u(r)",
          why:{q:'Was wurde gemacht?', opts:['Produktregel; danach $u$ ausgeklammert', 'Quotientenregel mit $e^{r/(na_0)}$', 'logarithmisch integriert'], a:0, ex:'$(r^n)\' = \\frac nr r^n$ und $(e^{-r/(na_0)})\' = -\\frac{1}{na_0}e^{-r/(na_0)}$.'}},
        {l:"u''(r) = (n(n-1)/r^2 - 2/(a_0 r) + 1/(n^2 a_0^2)) u(r)",
          why:{q:'Woher kommt $-2/(a_0r)$?', opts:['aus $2\\cdot\\frac nr\\cdot\\left(-\\frac{1}{na_0}\\right)$; das $n$ kürzt sich', 'aus dem Coulombpotential, eingesetzt', 'aus der Ableitung von $1/(n^2a_0^2)$'], a:0, ex:'$u\'\' = \\left[-\\frac{n}{r^2} + \\left(\\frac nr - \\frac{1}{na_0}\\right)^2\\right]u$; der Mischterm des Quadrats ist $-\\frac{2}{a_0r}$.'}},
        {l:"-ħ^2/(2m) u''(r) + (V(r) + ħ^2 n(n-1)/(2m r^2)) u(r) = -ħ^2/(2m n^2 a_0^2) u(r)",
          why:{q:'Was ist mit den Termen in $1/r$ und $1/r^2$ geschehen?', opts:['Sie heben sich gegen Coulombterm und Zentrifugalglied weg.', 'Sie wurden für große Abstände $r$ einfach vernachlässigt.', 'Sie sind jetzt in der Energie auf der rechten Seite enthalten.'], a:0, ex:'$l = n - 1$ gibt $l(l+1) = n(n-1)$. Es bleibt nur der konstante Term – die Energie $E_n$.'}}
      ]},
      q:[
        {q:'Welche Werte von $l$ gibt es zu $n = 3$?', opts:['$0, 1, 2$', '$1, 2, 3$', '$0, 1, 2, 3$'], a:0, ex:'$l = 0, \\dots, n-1$.'},
        {q:'Im Natriumatom liegt $3s$ tiefer als $3p$. Warum widerspricht das nicht der Entartung beim Wasserstoff?', opts:['Die $l$-Entartung gibt es nur im reinen $1/r$-Potential.', 'Bei Natrium hängt die Energie zusätzlich von $m$ ab.', 'Bei Natrium hat $3p$ eine größere Hauptquantenzahl.'], a:0, ex:'Die inneren Elektronen schirmen den Kern ab; das Potential ist dann nicht mehr $\\propto 1/r$. Die $m$-Entartung bleibt in jedem Zentralpotential.'}
      ]},
    {id:'h-t5', title:'Radialfunktionen und wo das Elektron ist',
      text:[
        'Die ersten [[lex:radialfunktionen|Radialfunktionen]] sind',
        '$$R_{10} = \\frac{2}{a_0^{3/2}}e^{-r/a_0},\\qquad R_{20} = \\frac{1}{\\sqrt2\\,a_0^{3/2}}\\left(1 - \\frac{r}{2a_0}\\right)e^{-r/(2a_0)},\\qquad R_{21} = \\frac{1}{\\sqrt{24}\\,a_0^{3/2}}\\,\\frac{r}{a_0}\\,e^{-r/(2a_0)}.$$',
        'Mit $Y_0^0 = 1/\\sqrt{4\\pi}$ ist der Grundzustand $\\psi_{100} = e^{-r/a_0}/\\sqrt{\\pi a_0^3}$. Die Zahl der radialen Knoten ist $n - l - 1$: $R_{20}$ hat einen bei $r = 2a_0$, $R_{21}$ keinen.',
        '**Dichte oder Abstand?** $|\\psi_{100}|^2$ ist am Kern am größten. Trotzdem ist $r = 0$ nicht der wahrscheinlichste Abstand. Die Wahrscheinlichkeit, das Elektron in einer Kugelschale zwischen $r$ und $r + dr$ zu finden, enthält das Schalenvolumen $4\\pi r^2dr$:',
        '$$P(r)\\,dr = r^2|R_{nl}(r)|^2\\,dr.$$',
        'Für $1s$ ist $P \\propto r^2e^{-2r/a_0}$. Der Faktor $r^2$ drückt $P$ am Kern auf null, die Exponentialfunktion drückt es weit draußen. Das Maximum liegt bei $r = a_0$. Beide Aussagen sind richtig: Ein kleines Volumen am Kern enthält das Elektron mit größerer Wahrscheinlichkeit als ein gleich großes bei $a_0$. Aber bei $a_0$ gibt es sehr viel mehr Volumen als am Kern.',
        '**Mittelwerte.** Mit dem Maß $r^2dr$ rechnet man [[lex:erwartungswert|Erwartungswerte]] wie in Thema 1. Für $1s$ ist $\\langle r\\rangle = \\tfrac32a_0$; die Herleitung rechnet $\\langle r\\rangle$ für $2s$ vor. Der Mittelwert liegt weiter außen als das Maximum, weil die Verteilung nach außen einen langen Ausläufer hat. Allgemein gilt',
        '$$\\langle r\\rangle = \\frac{a_0}{2}\\left[3n^2 - l(l+1)\\right],\\qquad \\left\\langle\\frac1r\\right\\rangle = \\frac{1}{n^2a_0}.$$',
        'Mit dem [[lex:virialsatz|Virialsatz]] folgt $\\langle V\\rangle = 2E_n$ und $\\langle T\\rangle = -E_n$.',
        '**Kein Planetensystem.** Das Elektron läuft nicht auf einer Bahn. In einem stationären Zustand ist $|\\psi|^2$ zeitlich konstant; es gibt keine Bewegung, die man verfolgen könnte. Für $l = n - 1$ liegt das Maximum von $P(r)$ bei $n^2a_0$, an Bohrs Radius. Für die Lage stimmt das alte Modell also, für den Drehimpuls nicht: Bohr hätte $L = n\\hbar$, die Quantenmechanik gibt $\\hbar\\sqrt{l(l+1)} = \\hbar\\sqrt{n(n-1)}$.',
        'Im Labor siehst du $P(r)$ für $n \\le 4$. Achte auf die Knoten und darauf, wie die Verteilung mit $n$ nach außen wandert: Die Größe des Atoms wächst wie $n^2$.'
      ].join('\n\n'),
      fig:{lab:'hydrogen', init:{n:2, l:0}, caption:'Radiale Aufenthaltswahrscheinlichkeit $P(r) = r^2|R_{nl}|^2$, Längen in $a_0$; die rote Linie ist $\\langle r\\rangle$. Vergleiche $1s$, $2s$ und $2p$.'},
      derive:{ctx:HRAD({defs:HDEFS, state:'R_20'}), lines:[
        {l:'⟨r⟩ = ∫_0^∞ r |R_20(r)|^2 r^2 dr',
          why:{q:'Warum stehen zwei Faktoren $r$ im Integral?', opts:['Einer ist die Messgröße, $r^2$ kommt vom Maß.', 'Beide stammen aus dem Volumenelement $r^2dr$.', 'Einer stammt aus der Substitution $u = rR$.'], a:0, ex:'$\\langle r\\rangle = \\int r\\,|\\psi|^2d^3r$; der Winkelteil gibt 1, übrig bleibt $\\int r\\cdot|R|^2\\cdot r^2dr$.'}},
        {l:'= 1/(2a_0^3) ∫_0^∞ r^3 (1 - r/(2a_0))^2 e^(-r/a_0) dr', w:'|R₂₀|² eingesetzt'},
        {l:'= 1/(2a_0^3) ∫_0^∞ (r^3 - r^4/a_0 + r^5/(4a_0^2)) e^(-r/a_0) dr', w:'ausmultipliziert'},
        {l:'= 1/(2a_0^3) (3! a_0^4 - 4! a_0^4 + 5! a_0^4/4)',
          why:{q:'Welche Formel steckt hier?', opts:['$\\int_0^\\infty r^ke^{-r/a_0}dr = k!\\,a_0^{k+1}$', '$\\int_0^\\infty r^ke^{-r/a_0}dr = a_0^{k+1}/k!$', '$\\int_0^\\infty r^ke^{-r/a_0}dr = k\\,a_0^{k}$'], a:0, ex:'Das ist $n!/\\alpha^{n+1}$ mit $\\alpha = 1/a_0$.'}},
        {l:'= 6 a_0',
          why:{q:'Passt das zur allgemeinen Formel?', opts:['Ja: $\\frac{a_0}{2}(3\\cdot4 - 0) = 6a_0$.', 'Nein, $2s$ müsste $4a_0$ haben.', 'Nein, $2s$ müsste $5a_0$ haben.'], a:0, ex:'$4a_0$ ist der wahrscheinlichste Abstand für $2p$, $5a_0$ der Mittelwert für $2p$.'}}
      ]},
      q:[
        {q:'Wie viele radiale Knoten hat $R_{31}$?', opts:['$1$', '$2$', '$0$'], a:0, ex:'$n - l - 1 = 3 - 1 - 1 = 1$.'},
        {q:'Wo ist im Grundzustand die Wahrscheinlichkeit pro Volumen am größten, wo die pro Abstandsintervall $dr$?', opts:['am Kern bzw. bei $r = a_0$', 'beide bei $r = a_0$', 'beide am Kern'], a:0, ex:'$|\\psi_{100}|^2$ ist bei $r = 0$ maximal, $P(r) = r^2|R_{10}|^2$ bei $r = a_0$.'}
      ]},
    {id:'h-t6', title:'Spektrallinien',
      text:[
        'Ein Atom kann von einem Niveau $E_{n_o}$ in ein tieferes $E_{n_u}$ übergehen und dabei ein Photon aussenden. Wegen der Energieerhaltung gilt',
        '$$h\\nu = E_{n_o} - E_{n_u} = \\frac{\\hbar^2}{2ma_0^2}\\left(\\frac{1}{n_u^2} - \\frac{1}{n_o^2}\\right).$$',
        'Die Frequenz gehört also zu einem **Paar** von Niveaus, nicht zu einem Niveau. Mit $\\lambda = c/\\nu$ erhält man die Rydberg-Formel',
        '$$\\frac{1}{\\lambda} = R\\left(\\frac{1}{n_u^2} - \\frac{1}{n_o^2}\\right),\\qquad R = \\frac{\\hbar^2}{2ma_0^2}\\cdot\\frac{1}{hc}.$$',
        'Mit der Elektronenmasse ist $R_\\infty \\approx 1{,}0974\\cdot10^7\\,\\mathrm m^{-1}$; mit der reduzierten Masse ist $R_H$ um $0{,}05\\,\\%$ kleiner. Die Rydberg-Konstante gehört zu den genauesten gemessenen Naturkonstanten.',
        '**Serien.** Alle Linien mit demselben unteren Niveau bilden eine [[lex:h-spektralserien|Serie]]:',
        '- Lyman ($n_u = 1$): ultraviolett, ab $122\\,\\mathrm{nm}$,\n- Balmer ($n_u = 2$): sichtbar, $H_\\alpha = 656\\,\\mathrm{nm}$ (rot), $H_\\beta = 486\\,\\mathrm{nm}$, $H_\\gamma = 434\\,\\mathrm{nm}$, …\n- Paschen ($n_u = 3$): infrarot, ab $1875\\,\\mathrm{nm}$.',
        'Innerhalb jeder Serie rücken die Linien zur Seriengrenze $1/\\lambda = R/n_u^2$ zusammen, weil die Niveaus nach oben immer dichter liegen. Das ist die Auflösung der Vorhersage vom Anfang. Photonen oberhalb der Grenze können das Atom ionisieren; dann ist das Spektrum kontinuierlich.',
        '**Auswahlregel.** Nicht jedes Paar von Zuständen liefert eine Linie. Das Licht koppelt an das Dipolmoment $-e\\vec r$. Ein Übergang braucht deshalb ein von null verschiedenes Matrixelement $\\langle n\'l\'m\'|\\vec r|nlm\\rangle$. Weil $\\vec r$ die Parität umkehrt und sich unter Drehungen wie ein Drehimpuls 1 verhält, muss $\\Delta l = \\pm1$ sein (und $\\Delta m = 0, \\pm1$). Ein $2s$-Zustand kann deshalb nicht durch Dipolstrahlung in $1s$ übergehen und lebt vergleichsweise lange. $2p \\to 1s$ ist dagegen erlaubt; das ist die Lyman-α-Linie. Für die Lage der Linien spielt die Regel beim Wasserstoff keine Rolle, weil $E$ nur von $n$ abhängt.',
        '**Was das Modell auslässt.** Genaue Messungen zeigen, dass jede Linie aus mehreren dicht benachbarten Komponenten besteht. Ursachen sind relativistische Korrekturen und der Spin (Feinstruktur), der Kernspin (Hyperfeinstruktur) und die Lamb-Verschiebung. Sie sind um Größenordnungen kleiner als $E_n$. Feinstruktur und Hyperfeinstruktur behandelt man mit Störungstheorie (Thema 11). Die Lamb-Verschiebung erklärt erst die Quantenelektrodynamik.'
      ].join('\n\n'),
      derive:{ctx:HRAD({defs:HDEFS}), lines:[
        {l:'E_4 - E_2 = -ħ^2/(2m a_0^2) (1/16 - 1/4)',
          why:{q:'Warum ist diese Differenz positiv?', opts:['$E_4$ liegt näher an null, also höher als $E_2$.', 'Weil $|E_4| > |E_2|$ ist.', 'Weil Energien im Atom positiv sind.'], a:0, ex:'Beide sind negativ; $-\\frac{1}{16}$ ist größer als $-\\frac14$. Das Photon trägt die Differenz.'}},
        {l:'= 3/16 · ħ^2/(2m a_0^2)',
          why:{q:'Welche Linie ist das?', opts:['$\\tfrac{3}{16}\\cdot13{,}6\\,\\mathrm{eV} \\approx 2{,}55\\,\\mathrm{eV}$: $H_\\beta$ bei $486\\,\\mathrm{nm}$', '$\\tfrac{3}{16}\\cdot13{,}6\\,\\mathrm{eV} \\approx 1{,}89\\,\\mathrm{eV}$: $H_\\alpha$ bei $656\\,\\mathrm{nm}$', '$\\tfrac{3}{16}\\cdot13{,}6\\,\\mathrm{eV} \\approx 10{,}2\\,\\mathrm{eV}$: Lyman-α bei $122\\,\\mathrm{nm}$'], a:0, ex:'$\\lambda = hc/E \\approx 1240\\,\\mathrm{eV\\,nm}/2{,}55\\,\\mathrm{eV} \\approx 486\\,\\mathrm{nm}$.'}},
        {l:'0 - E_2 = 1/4 · ħ^2/(2m a_0^2)',
          why:{q:'Was bedeutet diese Energie?', opts:['die Seriengrenze der Balmer-Serie, $3{,}4\\,\\mathrm{eV}$', 'die Energie $E_2$ des Zustands $n = 2$ selbst', 'die Photonenenergie der roten Linie $H_\\alpha$'], a:0, ex:'Übergang von $E = 0$ (Ionisierungsgrenze) nach $n = 2$: $\\lambda \\approx 365\\,\\mathrm{nm}$.'}}
      ]},
      q:[
        {q:'Welcher Übergang liefert die Linie $H_\\alpha$?', opts:['$n = 3 \\to n = 2$', '$n = 2 \\to n = 1$', '$n = 3 \\to n = 1$'], a:0, ex:'Die Balmer-Serie endet bei $n_u = 2$; die erste Linie kommt von $n_o = 3$.'},
        {q:'Warum geht $2s$ nicht durch Dipolstrahlung in $1s$ über, obwohl $E_2 > E_1$?', opts:['Die Auswahlregel verlangt $\\Delta l = \\pm1$.', 'Die Energiedifferenz ist dafür zu klein.', '$2s$ und $1s$ haben dieselbe Energie.'], a:0, ex:'Beide haben $l = 0$. Das Dipolmatrixelement $\\langle 100|\\vec r|200\\rangle$ ist null.'}
      ]}
  ],
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
      {l:'∫_0^∞ |R(r)|^2 r^2 dr = 1', why:{q:'Warum steht $r^2$ im Integral?', opts:['Es kommt aus dem Volumenelement $d^3r = r^2dr\\,d\\Omega$.', 'Es kommt aus $|R|^2$, weil $R \\propto 1/r$ ist.', 'Es ist der Zentrifugalterm $l(l+1)/r^2$, umgestellt.'], a:0, ex:'$\\int|\\psi|^2d^3r = \\int_0^\\infty|R|^2r^2dr\\cdot\\int|Y_l^m|^2d\\Omega$, und der Winkelteil ist für sich schon 1.'}},
      {l:'|A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', why:{q:'Woher kommt $e^{-2r/a_0}$?', opts:['$|e^{-r/a_0}|^2 = e^{-2r/a_0}$', 'Aus der Ableitung von $R$.', 'Aus dem Maß $r^2$.'], a:0, ex:'Beim Quadrieren verdoppelt sich der Exponent.'}},
      {l:'|A|^2 · 2!/(2/a_0)^3 = 1', why:{q:'Welche Formel steckt hier?', opts:['$\\int_0^\\infty r^ne^{-kr}dr = n!/k^{n+1}$ mit $n = 2$, $k = 2/a_0$', 'partielle Integration ohne Randterm', '$\\int_0^\\infty e^{-kr}dr = k$'], a:0, ex:'Die Formel folgt aus der Gammafunktion $\\Gamma(n+1) = n!$.'}},
      {l:'|A|^2 a_0^3/4 = 1', why:{q:'Stimmt die Vereinfachung?', opts:['Ja: $2/(8/a_0^3) = a_0^3/4$.', 'Nein, es müsste $a_0^3/8$ heißen.', 'Nein, es müsste $a_0^2/4$ heißen.'], a:0, ex:'$(2/a_0)^3 = 8/a_0^3$, und $2 : 8/a_0^3 = a_0^3/4$.'}},
      {l:'A = 2/a_0^(3/2)', w:'Phase frei: A > 0', why:{q:'Welche Einheit hat $A$, und passt das?', opts:['$\\text{Länge}^{-3/2}$, passend zu $1/\\text{Volumen}$', 'dimensionslos, weil $R$ normiert ist', '$\\text{Länge}^{-1/2}$ wie in einer Dimension'], a:0, ex:'$R^2r^2dr$ ist dimensionslos, also hat $R$ die Einheit $\\text{Länge}^{-3/2}$; in 3D hat $|\\psi|^2$ die Einheit $1/\\text{Volumen}$.'}}
    ],
    faded:{id:'h-fade', title:'Jetzt du: $R(r) = A\\,r\\,e^{-r/(2a_0)}$ (Zustand 2p)', text:'Bestimme $A > 0$ mit $\\int_0^\\infty|R|^2r^2dr = 1$.',
      ctx:HRAD({defs:{'R(r)':'A r e^(-r/(2a_0))'}, unknowns:{A:{ref:'1/sqrt(24 a_0^5)'}}}),
      given:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^4 e^(-r/a_0) dr = 1'],
      goals:[{id:'a', prompt:'Bestimme $A$.', type:'solve', unknown:'A', hints:['Strategie: Das Integral ist von der Form $\\int_0^\\infty r^ne^{-kr}dr$ – welche $n$ und $k$?', '$n = 4$, $k = 1/a_0$ in $n!/k^{n+1}$.', '$4!\\,a_0^5 = 24a_0^5$; dann nach $A$ auflösen.'],
        model:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^4 e^(-r/a_0) dr = 1', {l:'|A|^2 · 4! a_0^5 = 1', gap:'|A|^2 · ▢ = 1'}, 'A = 1/sqrt(24 a_0^5)']}]}
  },
  puzzle:{
    title:'Wie oft ist das Elektron im verbotenen Bereich?',
    text:'Klassisch könnte sich ein Elektron mit der Energie $E_1 = -\\frac{\\hbar^2}{2ma_0^2}$ nur dort aufhalten, wo $V(r) \\le E_1$ ist, also innerhalb eines Umkehrradius $r_{\\text{kl}}$. Beim Oszillator lag im Grundzustand etwa 16 % der Wahrscheinlichkeit jenseits der Umkehrpunkte (Thema 7).\n\nBestimme $r_{\\text{kl}}$ und schätze ab, welcher Anteil im Grundzustand des Wasserstoffs weiter draußen liegt.',
    q:{q:'Deine Vermutung:', opts:['etwa 24 %', 'genau 0 %', 'etwa 50 %', 'etwa 2 %'], a:0, ex:'Es sind $13e^{-4} \\approx 0{,}24$.'},
    reveal:'Aus $-\\frac{\\hbar^2}{ma_0r} = -\\frac{\\hbar^2}{2ma_0^2}$ folgt $r_{\\text{kl}} = 2a_0$. Mit $P(r) = \\frac{4}{a_0^3}r^2e^{-2r/a_0}$ und $x = 2r/a_0$ ist\n\n$$P(r > 2a_0) = \\frac12\\int_4^\\infty x^2e^{-x}\\,dx = \\frac12e^{-4}(16 + 8 + 2) = 13e^{-4} \\approx 0{,}24.$$\n\nFast ein Viertel der Wahrscheinlichkeit liegt im klassisch verbotenen Bereich – mehr als beim Oszillator, weil das Coulombpotential nach außen nur langsam ansteigt. Wie dort ist das kein Widerspruch: Ort und kinetische Energie sind nicht zugleich scharf, und eine Ortsmessung findet nie eine negative kinetische Energie.'
  },
  clarify:{
    core:'Im Coulombpotential $V(r) = -\\frac{e^2}{4\\pi\\varepsilon_0 r} = -\\frac{\\hbar^2}{ma_0r}$ trennt man $\\psi_{nlm} = R_{nl}(r)\\,Y_l^m(\\theta,\\varphi)$. Mit $u(r) = rR(r)$ wird die Radialgleichung eindimensional:\n\n$$-\\frac{\\hbar^2}{2m}u\'\' + \\left[V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}\\right]u = Eu,\\qquad u(0) = 0.$$\n\nGebundene Lösungen gibt es nur für $E_n = -\\frac{\\hbar^2}{2ma_0^2n^2} \\approx -\\frac{13{,}6\\,\\mathrm{eV}}{n^2}$ mit $n = 1, 2, \\dots$, $l = 0, \\dots, n-1$, $m = -l, \\dots, l$. Die Energie hängt nur von $n$ ab: $n^2$ Zustände (ohne Spin). Spektrallinien gehören zu Energiedifferenzen $E_{n_o} - E_{n_u}$.',
    keys:[
      'Normierung und Erwartungswerte radial immer mit $r^2\\,dr$: $\\int_0^\\infty|R_{nl}|^2r^2dr = 1$.',
      'Das Zentrifugalglied $\\hbar^2l(l+1)/(2mr^2)$ hält Zustände mit $l > 0$ vom Kern fern: $R_{nl}\\propto r^l$ für kleine $r$.',
      'Radiale Knoten: $n - l - 1$. Der Zustand mit $l = n-1$ hat keinen.',
      'Bohrscher Radius $a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{me^2} \\approx 0{,}529\\,\\text{Å}$; Grundzustand: $\\langle r\\rangle = \\tfrac32a_0$, wahrscheinlichster Abstand $a_0$.',
      'Virialsatz für $V\\propto 1/r$: $\\langle V\\rangle = 2E_n$ und $\\langle T\\rangle = -E_n$.',
      'Rydberg-Formel $1/\\lambda = R(1/n_u^2 - 1/n_o^2)$; Dipolübergänge nur mit $\\Delta l = \\pm1$.'
    ],
    errors:[
      '$r^2$ im Maß vergessen – dann ist schon die Normierung falsch.',
      'Den Ort größter Dichte ($r = 0$) mit dem wahrscheinlichsten Abstand ($r = a_0$) verwechseln.',
      '$l = n$ zulassen: Für $n = 1$ gibt es nur $l = 0$.',
      'Vorzeichen der Energie: Gebundene Zustände haben $E_n < 0$, höhere $n$ liegen näher an $0$.',
      'Das Elektron auf einer Bohrschen Bahn mit $L = n\\hbar$ denken: Im Grundzustand ist $L = 0$.'
    ],
    more:[{title:'Mitbewegter Kern', text:'Mit der reduzierten Masse $\\mu = m_em_p/(m_e+m_p)$ statt $m_e$ verschieben sich alle Energien um etwa $0{,}05\\,\\%$: $13{,}598\\,\\mathrm{eV}$ statt $13{,}606\\,\\mathrm{eV}$. In diesem Tutorial steht $m$ für die Masse in der Radialgleichung.'}],
    checks:[
      {q:'Wie viele Zustände (ohne Spin) gehören zu $n = 2$?', opts:['$4$', '$2$', '$3$'], a:0, ex:'$l = 0$ (ein Zustand) und $l = 1$ (drei Zustände): $n^2 = 4$.'},
      {q:'Für welchen Zustand ist $R_{nl}(0) \\ne 0$?', opts:['nur für $l = 0$', 'für alle $l$', 'nur für $l = n-1$'], a:0, ex:'$R_{nl}\\propto r^l$ nahe $r = 0$. Nur s-Zustände haben eine endliche Dichte am Kern.'}
    ]
  },
  lab:{type:'hydrogen', title:'Radiale Aufenthaltswahrscheinlichkeit',
    text:'Das Bild zeigt $P(r) = r^2|R_{nl}(r)|^2$ (Längen in $a_0$). Die rote Linie ist $\\langle r\\rangle$. Wähle $n$ und $l$.',
    predict:{q:'Bevor du die Regler bewegst: Wo liegt das Maximum von $P(r)$ für $n = 3$, $l = 2$ ungefähr?', opts:['bei $9a_0$', 'bei $3a_0$', 'bei $r = 0$'], a:0, ex:'Für $l = n - 1$ ist $P \\propto r^{2n}e^{-2r/(na_0)}$ mit dem Maximum bei $n^2a_0$ – dem Bohrschen Radius. Bei $r = 0$ ist $P$ immer null.'},
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
      {q:'Für welche Zustände liefert Weg B ebenso schnell $\\langle V\\rangle$?', opts:['für jeden Eigenzustand $\\psi_{nlm}$', 'nur für den Grundzustand', 'für jede Überlagerung'], a:0, ex:'Der Virialsatz gilt für jeden Eigenzustand von $\\hat H$: $\\langle V\\rangle = 2E_n$. Für Überlagerungen verschiedener $n$ kommen zeitabhängige Mischterme hinzu; dann gilt $\\langle V\\rangle = 2\\langle H\\rangle$ nur noch im Zeitmittel.'}
    ]
  },
  concept:[
    {id:'h-k1', type:'dialog', seg:'h-t5',
      text:'Ein Elektron ist im Grundzustand $\\psi_{100} = e^{-r/a_0}/\\sqrt{\\pi a_0^3}$.',
      people:[
        {name:'Lena', says:'Ein kleiner Würfel am Kern enthält das Elektron mit größerer Wahrscheinlichkeit als ein gleich großer Würfel im Abstand $a_0$.'},
        {name:'Jonas', says:'Der wahrscheinlichste Abstand vom Kern ist trotzdem $a_0$ und nicht null.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:2,
      ex:'Lena spricht über die Dichte $|\\psi|^2$ pro Volumen; sie ist am Kern maximal. Jonas spricht über $P(r) = 4\\pi r^2|\\psi|^2$, die Wahrscheinlichkeit pro Abstandsintervall; sie ist bei $a_0$ maximal, weil es dort viel mehr Volumen gibt.'},
    {id:'h-k2', type:'mc', seg:'h-t1',
      q:'Welchen Betrag des Bahndrehimpulses hat das Elektron im Grundzustand $1s$?', opts:['$0$', '$\\hbar$', '$\\sqrt2\\,\\hbar$', '$\\tfrac12\\hbar$'], a:0,
      ex:'$l = 0$, also $L^2 = \\hbar^2l(l+1) = 0$. Das Bohrsche Modell gab $L = \\hbar$; eine kreisende Bewegung gibt es im $1s$-Zustand nicht. (Die Zahl $\\tfrac12$ gehört zum Spin des Elektrons, Thema 10 – mit dem Bahndrehimpuls hat sie nichts zu tun.)'},
    {id:'h-k3', type:'mc2', seg:'h-t4', lex:'stationaer',
      q:'Ist $\\psi = \\frac{1}{\\sqrt2}(\\psi_{200} + \\psi_{211})$ ein stationärer Zustand?', opts:['Ja', 'Nein', 'nur für $t = 0$'], a:0,
      ex:'Ja: Beide Anteile gehören zu $E_2$. Die Summe ist Eigenfunktion von $\\hat H$, und $|\\psi(t)|^2$ ist zeitlich konstant. Anders bei $\\psi_{100} + \\psi_{210}$: Dort schwingt $|\\psi|^2$.',
      reason:{q:'Warum?', opts:['Beide Anteile haben dieselbe Energie; die Summe ist Eigenfunktion von $\\hat H$.', 'Eine Überlagerung verschiedener Orbitale ist nie stationär.', 'Verschiedene $l$ bedeuten verschiedene Energien.'], a:0,
        ex:'Wegen der Entartung bekommen beide Anteile denselben Phasenfaktor $e^{-iE_2t/\\hbar}$; er fällt aus $|\\psi|^2$ heraus.'}},
    {id:'h-k4', type:'mc', seg:'h-t4',
      q:'Zustand $\\frac{1}{\\sqrt2}(\\psi_{100} + \\psi_{210})$. Welche Ergebnisse kann eine Energiemessung liefern?', opts:['$E_1$ oder $E_2$, je mit $\\tfrac12$', 'immer den Mittelwert $\\tfrac12(E_1 + E_2)$', 'jeden Wert zwischen $E_1$ und $E_2$'], a:0,
      ex:'Messergebnisse sind Eigenwerte von $\\hat H$. Der Erwartungswert $\\tfrac12(E_1 + E_2) = \\tfrac58E_1$ ist ein Mittelwert über viele Messungen, kein mögliches Einzelergebnis.'},
    {id:'h-k5', type:'mc2', seg:'h-t6', lex:'h-spektralserien',
      q:'Ein Atom ist im Niveau $n = 3$ und sendet ein Photon aus. Welche Photonenenergien sind möglich?', opts:['$E_3 - E_2$ oder $E_3 - E_1$', 'nur $|E_3|$', 'jede Energie unter $|E_3|$'], a:0,
      ex:'Das Photon trägt die Differenz zwischen Anfangs- und Endniveau. Von $n = 3$ aus gibt es zwei tiefere Niveaus (je nach $l$ nicht von jedem Zustand aus beide).',
      reason:{q:'Warum?', opts:['Ein Photon trägt die Differenz zweier Niveaus.', 'Das Photon trägt die Energie des verlassenen Niveaus.', 'Die Energie wird kontinuierlich abgegeben.'], a:0,
        ex:'$|E_3|$ wäre die Ionisierungsenergie aus $n = 3$, nicht die Energie eines ausgesandten Photons. Welche Übergänge vorkommen, regelt zusätzlich $\\Delta l = \\pm1$: $3s$ und $3d$ gehen nur nach $2p$, $3p$ nach $2s$ oder $1s$.'}}
  ],
  practice:[
    {id:'h-p1', title:'Grundzustand in drei Dimensionen normieren',
      text:'$\\psi(r) = A\\,e^{-r/a_0}$ hängt nicht von $\\theta, \\varphi$ ab. Normiere mit $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi$.',
      ctx:{coords:['r', 'θ', 'φ'], params:{a_0:'pos', m:'pos'}, defs:{'ψ(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'1/sqrt(π a_0^3)', alt:['-1/sqrt(π a_0^3)']}}},
      goals:[{id:'a', prompt:'Bestimme $A > 0$.', type:'solve', unknown:'A', points:3, ph:'4π |A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1',
        hints:['Normieren heißt $\\int|\\psi|^2d^3r = 1$. Weil $\\psi$ nicht von den Winkeln abhängt, kannst du die Winkelintegrale sofort ausführen.', 'Regel: $\\int_0^\\pi\\sin\\theta\\,d\\theta\\int_0^{2\\pi}d\\varphi = 4\\pi$.', 'Nächster Schritt: $\\int_0^\\infty r^2e^{-2r/a_0}dr = a_0^3/4$.'],
        model:['∫_0^∞ ∫_0^π ∫_0^{2π} |ψ(r)|^2 r^2 sin(θ) dφ dθ dr = 1', {l:'4π |A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', w:'Winkelintegral = 4π'}, '4π |A|^2 · a_0^3/4 = 1', 'A = 1/sqrt(π a_0^3)'],
        mistakes:[{expr:'2/a_0^(3/2)', msg:'Das ist die Normierung der Radialfunktion $R_{10}$ allein. Für $\\psi$ selbst fehlt der Winkelanteil $4\\pi$.'}]}]},
    {id:'h-p2', title:'Mittlerer Abstand und mittleres $1/r$',
      text:'Grundzustand: $R_{10}(r) = 2a_0^{-3/2}e^{-r/a_0}$.',
      ctx:HRAD({defs:HDEFS, state:'R_10'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle r\\rangle$.', type:'value', target:'3 a_0/2', points:2, ph:'⟨r⟩ = ∫_0^∞ r |R_10(r)|^2 r^2 dr',
          hints:['Erwartungswert mit dem Maß $r^2dr$: $\\langle r\\rangle = \\int_0^\\infty r\\,|R_{10}|^2r^2dr$.', 'Regel: $\\int_0^\\infty r^3e^{-kr}dr = 3!/k^4$.', 'Nächster Schritt: Der Integrand ist $\\frac{4}{a_0^3}r^3e^{-2r/a_0}$, also $k = 2/a_0$.'],
          model:['⟨r⟩ = ∫_0^∞ r |R_10(r)|^2 r^2 dr', '= 4/a_0^3 ∫_0^∞ r^3 e^(-2r/a_0) dr', '= 4/a_0^3 · 3!/(2/a_0)^4', '= 3/2 a_0'],
          mistakes:[{expr:'3/4 a_0', msg:'Prüfe den Vorfaktor: $|R_{10}|^2 = 4a_0^{-3}e^{-2r/a_0}$, und $3!/(2/a_0)^4 = 6a_0^4/16$.'}]},
        {id:'b', prompt:'b) Berechne $\\langle 1/r\\rangle$.', type:'value', target:'1/a_0', points:2, ph:'⟨1/r⟩ = ∫_0^∞ 1/r |R_10(r)|^2 r^2 dr',
          hints:['Wie in a), nur mit $1/r$ statt $r$ als Messgröße.', 'Regel: Vom Maß bleibt ein Faktor $r$; $\\int_0^\\infty re^{-2r/a_0}dr = a_0^2/4$.', 'Nächster Schritt: $\\frac{4}{a_0^3}\\cdot\\frac{a_0^2}{4}$.'],
          model:['⟨1/r⟩ = ∫_0^∞ 1/r |R_10(r)|^2 r^2 dr', '= 4/a_0^3 ∫_0^∞ r e^(-2r/a_0) dr', '= 4/a_0^3 · a_0^2/4', '= 1/a_0'], note:'Allgemein gilt $\\langle 1/r\\rangle = 1/(n^2a_0)$. Beachte $\\langle 1/r\\rangle \\ne 1/\\langle r\\rangle$.'}
      ]},
    {id:'h-p3', title:'Wahrscheinlichster Abstand',
      text:'Die radiale Aufenthaltswahrscheinlichkeit ist $P(r) = r^2|R_{nl}(r)|^2$. Für $1s$ ist $P \\propto r^2e^{-2r/a_0}$, für $2p$ ist $P\\propto r^4e^{-r/a_0}$. Nenne den gesuchten Abstand $r_m$ bzw. $r_p$.',
      ctx:HRAD({unknowns:{r_m:{ref:'a_0'}, r_p:{ref:'4 a_0'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme den wahrscheinlichsten Abstand $r_m$ im Zustand $1s$.', type:'solve', unknown:'r_m', points:2, ph:'d/dr (r^2 e^(-2r/a_0)) = …',
          hints:['Der wahrscheinlichste Abstand ist das Maximum von $P(r)$: Ableitung null setzen.', 'Regel: Produktregel für $r^2e^{-2r/a_0}$.', 'Nächster Schritt: Der Faktor $e^{-2r/a_0}$ ist nie null, und $r = 0$ ist ein Minimum.'],
          model:['d/dr (r^2 e^(-2r/a_0)) = (2r - 2r^2/a_0) e^(-2r/a_0)', '2 r_m - 2 r_m^2/a_0 = 0', 'r_m = a_0']},
        {id:'b', prompt:'b) Dasselbe für $2p$: Bestimme $r_p$.', type:'solve', unknown:'r_p', points:2, ph:'d/dr (r^4 e^(-r/a_0)) = …',
          hints:['Gleiches Vorgehen wie in a), jetzt mit $P\\propto r^4e^{-r/a_0}$.', 'Regel: $\\frac{d}{dr}(r^4e^{-r/a_0}) = (4r^3 - r^4/a_0)e^{-r/a_0}$.', 'Nächster Schritt: Teile durch $r_p^3e^{-r_p/a_0} \\ne 0$.'],
          model:['d/dr (r^4 e^(-r/a_0)) = (4r^3 - r^4/a_0) e^(-r/a_0)', '4 r_p^3 - r_p^4/a_0 = 0', 'r_p = 4 a_0'], note:'Das ist der Bohrsche Radius $n^2a_0$ für $n = 2$ – für $l = n-1$ stimmt das Bohrsche Modell hier überein.'}
      ]},
    {id:'h-p4', title:'Energie des Grundzustands aus der Radialgleichung',
      text:'Für $l = 0$ lautet die Radialgleichung $-\\frac{\\hbar^2}{2m}u\'\' + V(r)u = Eu$ mit $V(r) = -\\frac{\\hbar^2}{ma_0r}$. Probiere $u(r) = r\\,e^{-r/a_0}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r e^(-r/a_0)'}, unknowns:{E:{ref:'-ħ^2/(2 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$.', type:'solve', unknown:'E', points:3, ph:"-ħ^2/(2m) u'' + V(r) u = E u",
        hints:['Setze ein und prüfe, ob links eine Konstante mal $u$ herauskommt; diese Konstante ist $E$.', 'Regel: $u\' = (1 - r/a_0)e^{-r/a_0}$, $u\'\' = (r/a_0^2 - 2/a_0)e^{-r/a_0}$.', 'Nächster Schritt: Die Terme mit $1/r$ heben sich weg – genau dafür muss der Exponent $r/a_0$ sein.'],
        model:["-ħ^2/(2m) u'' + V(r) u = E u", '-ħ^2/(2m) (r/a_0^2 - 2/a_0) e^(-r/a_0) - ħ^2/(m a_0 r) · r e^(-r/a_0) = E r e^(-r/a_0)', '-ħ^2/(2m a_0^2) r e^(-r/a_0) = E r e^(-r/a_0)', 'E = -ħ^2/(2m a_0^2)'],
        mistakes:[{expr:'ħ^2/(2m a_0^2)', msg:'Vorzeichen prüfen: Ein gebundener Zustand hat $E < 0$.'}]}]},
    {id:'h-p5', title:'Ein Zustand mit $l = 1$',
      text:'Für $l = 1$ kommt das Zentrifugalglied $\\frac{\\hbar^2l(l+1)}{2mr^2} = \\frac{\\hbar^2}{mr^2}$ hinzu. Probiere $u(r) = r^2e^{-r/(2a_0)}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r^2 e^(-r/(2a_0))'}, unknowns:{E:{ref:'-ħ^2/(8 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$. Welches $n$ gehört dazu?', type:'solve', unknown:'E', points:3, ph:"-ħ^2/(2m) u'' + (V(r) + ħ^2/(m r^2)) u = E u",
        hints:['Gleiche Strategie wie beim Grundzustand, jetzt mit Zentrifugalglied.', 'Regel: $u\'\' = \\left(2 - \\frac{2r}{a_0} + \\frac{r^2}{4a_0^2}\\right)e^{-r/(2a_0)}$.', 'Nächster Schritt: Die Glieder mit $r^0$ und $r^1$ heben sich weg; es bleibt ein Vielfaches von $r^2e^{-r/(2a_0)}$.'],
        model:["-ħ^2/(2m) u'' + (V(r) + ħ^2/(m r^2)) u = E u", '-ħ^2/(2m) (2 - 2r/a_0 + r^2/(4a_0^2)) e^(-r/(2a_0)) + (-ħ^2/(m a_0 r) + ħ^2/(m r^2)) r^2 e^(-r/(2a_0)) = E r^2 e^(-r/(2a_0))', '-ħ^2/(8m a_0^2) r^2 e^(-r/(2a_0)) = E r^2 e^(-r/(2a_0))', 'E = -ħ^2/(8m a_0^2)'],
        note:'$E = E_1/4 = E_2$: Das ist der Zustand $2p$ ($n = 2$, $l = 1$), entartet mit $2s$.'}]},
    {id:'h-p6', title:'Virialsatz und Spektrallinie',
      text:'Grundzustand $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$, $V(r) = -\\hbar^2/(ma_0r)$, $E_n = -\\frac{\\hbar^2}{2ma_0^2n^2}$.',
      ctx:HRAD({defs:HDEFS, state:'R_10', ops:{T:'-ħ^2/(2m) (1/r^2) d/dr r^2 d/dr'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle V\\rangle$ im Grundzustand.', type:'value', target:'-ħ^2/(m a_0^2)', points:2, ph:'⟨V⟩ = ∫_0^∞ V(r) |R_10(r)|^2 r^2 dr',
          hints:['Erwartungswert von $V(r)$ mit dem Maß $r^2dr$.', 'Regel: Vom Maß $r^2$ und $1/r$ bleibt $r$: $\\int_0^\\infty re^{-2r/a_0}dr = a_0^2/4$.', 'Nächster Schritt: Vorfaktor $-\\frac{\\hbar^2}{ma_0}\\cdot\\frac{4}{a_0^3}$.'],
          model:['⟨V⟩ = ∫_0^∞ V(r) |R_10(r)|^2 r^2 dr', '= -ħ^2/(m a_0) · 4/a_0^3 · a_0^2/4', '= -ħ^2/(m a_0^2)']},
        {id:'b', prompt:'b) Bestimme $\\langle T\\rangle$ aus $E_1$ und $\\langle V\\rangle$.', type:'value', target:'ħ^2/(2m a_0^2)', points:2,
          hints:['Im Eigenzustand ist $E_1 = \\langle T\\rangle + \\langle V\\rangle$.', 'Regel: $E_1 = -\\frac{\\hbar^2}{2ma_0^2}$.', 'Nächster Schritt: $\\langle T\\rangle = E_1 - \\langle V\\rangle$.'],
          model:['⟨T⟩ = E_1 - ⟨V⟩', '= -ħ^2/(2m a_0^2) + ħ^2/(m a_0^2)', '= ħ^2/(2m a_0^2)'], note:'Also $\\langle T\\rangle = -E_1$ und $\\langle V\\rangle = 2E_1$ (Virialsatz).'},
        {id:'c', prompt:'c) Welche Energie hat das Photon beim Übergang $n = 3 \\to n = 2$ (Balmer-$H_\\alpha$)?', type:'value', target:'5ħ^2/(72 m a_0^2)', points:2, ph:'E_3 - E_2 = …',
          hints:['Ein Photon trägt die Energiedifferenz zweier Niveaus.', 'Regel: $E_3 - E_2 = -\\frac{\\hbar^2}{2ma_0^2}\\left(\\frac19 - \\frac14\\right)$.', 'Nächster Schritt: $\\frac19 - \\frac14 = -\\frac{5}{36}$.'],
          model:['E_3 - E_2 = -ħ^2/(2m a_0^2) (1/9 - 1/4)', '= 5ħ^2/(72 m a_0^2)'], note:'Mit $\\hbar^2/(2ma_0^2) \\approx 13{,}6\\,\\mathrm{eV}$: $\\approx 1{,}89\\,\\mathrm{eV}$, also $\\lambda \\approx 656\\,\\mathrm{nm}$ (rot).'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'h-f1', title:'Mittleres Abstandsquadrat im Zustand 2p', text:'$R_{21}(r) = \\frac{1}{\\sqrt{24}}a_0^{-3/2}\\frac{r}{a_0}e^{-r/(2a_0)}$.',
      ctx:HRAD({defs:HDEFS, state:'R_21'}),
      goals:[{id:'a', prompt:'Berechne $\\langle r^2\\rangle$.', type:'value', target:'30 a_0^2', points:3, model:['⟨r^2⟩ = ∫_0^∞ r^2 |R_21(r)|^2 r^2 dr', '= 1/(24 a_0^5) ∫_0^∞ r^6 e^(-r/a_0) dr', '= 1/(24 a_0^5) · 6! a_0^7', '= 30 a_0^2']}]}},
    {aim:1, task:{id:'h-f3', title:'Ein Zustand mit $l = 2$', text:'Radialgleichung $-\\frac{\\hbar^2}{2m}u\'\' + \\left[V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}\\right]u = Eu$ mit $V(r) = -\\frac{\\hbar^2}{ma_0r}$ und $l = 2$. Probiere $u(r) = r^3e^{-r/(3a_0)}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r^3 e^(-r/(3a_0))'}, unknowns:{E:{ref:'-ħ^2/(18 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$.', type:'solve', unknown:'E', points:3,
        model:["-ħ^2/(2m) u'' + (V(r) + 3ħ^2/(m r^2)) u = E u", "u'' = (6/r^2 - 2/(a_0 r) + 1/(9a_0^2)) u", '-ħ^2/(18 m a_0^2) u = E u', 'E = -ħ^2/(18 m a_0^2)']}]}},
    {aim:2, q:'Wie viele Zustände (ohne Spin) haben die Energie $E_3$?', opts:['$9$', '$3$', '$6$'], a:0, ex:'$l = 0, 1, 2$ mit $1 + 3 + 5 = 9 = n^2$ Zuständen.'},
    {aim:'k', id:'h-fk1', type:'mc2',
      q:'Für welchen Zustand ist die Dichte $|\\psi|^2$ direkt am Kern von null verschieden?', opts:['$2s$', '$2p$', '$3d$'], a:0,
      ex:'Nur s-Zustände reichen bis an den Kern.',
      reason:{q:'Warum?', opts:['Nur für $l = 0$ fehlt die Zentrifugalbarriere; sonst ist $R \\propto r^l$.', 'Je größer $n$, desto näher ist das Elektron am Kern.', 'Nur Zustände mit $m = 0$ erreichen den Kern.'], a:0,
        ex:'Nahe $r = 0$ ist $R_{nl} \\propto r^l$; das ist nur für $l = 0$ dort von null verschieden. Mit $n$ wächst das Atom, es schrumpft nicht.'}},
    {aim:'k', id:'h-fk2', type:'dialog',
      text:'Es geht um den Zustand $2p$.',
      people:[
        {name:'Lena', says:'Im Zustand $2p$ ist $l = 1$, der Betrag des Drehimpulses also $\\sqrt2\\,\\hbar$.'},
        {name:'Jonas', says:'Nach Bohr hat das Elektron bei $n = 2$ den Drehimpuls $2\\hbar$. Weil die Energie dieselbe ist wie bei Bohr, muss auch der Drehimpuls derselbe sein.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:0,
      ex:'$|\\vec L| = \\hbar\\sqrt{l(l+1)} = \\sqrt2\\,\\hbar$. Gleiche Energie heißt nicht gleicher Drehimpuls: Zu $n = 2$ gehört auch $2s$ mit $L = 0$. Bohrs Modell trifft die Energien, nicht die Drehimpulse.'}
  ],
  finalB:[
    {aim:0, task:{id:'h-f4', title:'Mittleres $1/r$ im Zustand 2p', text:'$R_{21}(r) = \\frac{1}{\\sqrt{24}}a_0^{-3/2}\\frac{r}{a_0}e^{-r/(2a_0)}$.',
      ctx:HRAD({defs:HDEFS, state:'R_21'}),
      goals:[{id:'a', prompt:'Berechne $\\langle 1/r\\rangle$.', type:'value', target:'1/(4 a_0)', points:3, model:['⟨1/r⟩ = ∫_0^∞ 1/r |R_21(r)|^2 r^2 dr', '= 1/(24 a_0^5) ∫_0^∞ r^3 e^(-r/a_0) dr', '= 1/(24 a_0^5) · 3! a_0^4', '= 1/(4 a_0)']}]}},
    {aim:1, task:{id:'h-f5', title:'Ein Zustand mit $l = 3$', text:'Radialgleichung $-\\frac{\\hbar^2}{2m}u\'\' + \\left[V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}\\right]u = Eu$ mit $V(r) = -\\frac{\\hbar^2}{ma_0r}$ und $l = 3$. Probiere $u(r) = r^4e^{-r/(4a_0)}$.',
      ctx:HRAD({defs:{'V(r)':'-ħ^2/(m a_0 r)', 'u(r)':'r^4 e^(-r/(4a_0))'}, unknowns:{E:{ref:'-ħ^2/(32 m a_0^2)', kind:'real'}}}),
      goals:[{id:'a', prompt:'Setze $u$ ein und bestimme $E$.', type:'solve', unknown:'E', points:3,
        model:["-ħ^2/(2m) u'' + (V(r) + 6ħ^2/(m r^2)) u = E u", "u'' = (12/r^2 - 2/(a_0 r) + 1/(16a_0^2)) u", '-ħ^2/(32 m a_0^2) u = E u', 'E = -ħ^2/(32 m a_0^2)']}]}},
    {aim:2, q:'Wie viele Zustände (ohne Spin) haben die Energie $E_4$?', opts:['$16$', '$4$', '$10$'], a:0, ex:'$l = 0, 1, 2, 3$ mit $1 + 3 + 5 + 7 = 16 = n^2$ Zuständen. $10 = 1 + 2 + 3 + 4$ erhält man, wenn man je $l$ nur $l + 1$ statt $2l + 1$ Werte von $m$ zählt.'},
    {aim:'k', id:'h-fk3', type:'mc2',
      q:'Ein Elektron ist in einem Zustand mit $n = 3$. In welchem Zustand ist die Wahrscheinlichkeit am größten, es in einer winzigen Kugel um den Kern (Radius $\\ll a_0$) zu finden?', opts:['$3s$', '$3d$', 'in allen gleich, die Energie ist ja dieselbe'], a:0,
      ex:'Nur im $3s$-Zustand ist die Dichte am Kern von null verschieden. Für $3p$ und $3d$ geht sie dort gegen null.',
      reason:{q:'Warum?', opts:['Nahe $r = 0$ ist $R_{nl} \\propto r^l$; nur für $l = 0$ ist $R(0) \\ne 0$.', 'Zustände mit größerem $l$ liegen näher am Kern.', 'Gleiche Energie heißt gleiche räumliche Verteilung.'], a:0,
        ex:'Die Zentrifugalbarriere hält Zustände mit $l > 0$ vom Kern fern. Entartete Zustände können ganz verschieden verteilt sein: $3s$, $3p$ und $3d$ haben dieselbe Energie, aber verschiedene $R_{nl}$.'}},
    {aim:'k', id:'h-fk4', type:'dialog',
      text:'Es geht um die Zustände $3s$ und $3d$ des Wasserstoffatoms.',
      people:[
        {name:'Lena', says:'$3s$ und $3d$ haben dieselbe Energie $E_3$. Nach Bohr gehört zu $n = 3$ der Drehimpuls $3\\hbar$, also haben beide diesen Drehimpuls.'},
        {name:'Jonas', says:'Der Betrag des Drehimpulses hängt von $l$ ab, nicht von $n$. In $3s$ ist er null, in $3d$ ist er $\\sqrt6\\,\\hbar$.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$|\\vec L| = \\hbar\\sqrt{l(l+1)}$: $0$ für $l = 0$ und $\\sqrt6\\,\\hbar$ für $l = 2$. Gleiche Energie heißt nicht gleicher Drehimpuls. Bohrs Modell trifft die Energien, nicht die Drehimpulse; den Wert $3\\hbar$ hat kein Zustand mit $n = 3$.'}
  ],
  errors:[
    {id:'h-e1', title:'Normierung ohne Maß',
      text:'Gesucht ist $A > 0$ für $R(r) = A\\,e^{-r/a_0}$. Jemand rechnet:',
      ctx:HRAD({defs:{'R(r)':'A e^(-r/a_0)'}, unknowns:{A:{ref:'2/a_0^(3/2)'}}}),
      lines:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ e^(-2r/a_0) dr = 1', '|A|^2 a_0/2 = 1', 'A = sqrt(2/a_0)'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Der Faktor $r^2$ aus dem Maß ist verloren gegangen.', 'Der Exponent muss beim Quadrieren $-r/a_0$ bleiben.', 'Die untere Integrationsgrenze muss $-\\infty$ sein.'], a:0, ex:'Ohne $r^2$ hat $A$ die falsche Einheit $\\text{Länge}^{-1/2}$ – ein Warnsignal.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $A$.', type:'solve', unknown:'A', model:['∫_0^∞ |R(r)|^2 r^2 dr = 1', '|A|^2 ∫_0^∞ r^2 e^(-2r/a_0) dr = 1', '|A|^2 a_0^3/4 = 1', 'A = 2/a_0^(3/2)']}}
  ]
});
lexe('kugelkoordinaten', 'Kugelkoordinaten', '$x = r\\sin\\theta\\cos\\varphi$, $y = r\\sin\\theta\\sin\\varphi$, $z = r\\cos\\theta$ mit $r\\ge 0$, $0\\le\\theta\\le\\pi$, $0\\le\\varphi<2\\pi$. Volumenelement $d^3r = r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\varphi = r^2dr\\,d\\Omega$, Raumwinkel $\\int d\\Omega = 4\\pi$. Laplace-Operator: $\\nabla^2 = \\frac{1}{r^2}\\partial_r(r^2\\partial_r) - \\frac{\\hat L^2}{\\hbar^2r^2}$.', {topic:'h'});
lexe('bohrradius', 'Bohrscher Radius', '$a_0 = \\frac{4\\pi\\varepsilon_0\\hbar^2}{m_ee^2} \\approx 0{,}529\\cdot10^{-10}\\,\\mathrm{m}$. Damit ist $\\frac{e^2}{4\\pi\\varepsilon_0} = \\frac{\\hbar^2}{m_ea_0}$ und $V(r) = -\\frac{\\hbar^2}{m_ea_0r}$. Im Grundzustand ist $a_0$ der wahrscheinlichste Abstand, $\\langle r\\rangle = \\tfrac32a_0$.', {topic:'h'});
lexe('wasserstoff-energie', 'Energieniveaus des Wasserstoffatoms', '$E_n = -\\frac{\\hbar^2}{2m_ea_0^2n^2} = -\\frac{m_e}{2\\hbar^2}\\left(\\frac{e^2}{4\\pi\\varepsilon_0}\\right)^2\\frac{1}{n^2} \\approx -\\frac{13{,}6\\,\\mathrm{eV}}{n^2}$ (unendlich schwerer Kern; mit reduzierter Masse $13{,}598\\,\\mathrm{eV}$). Quantenzahlen: $n\\ge1$, $l = 0,\\dots,n-1$, $m = -l,\\dots,l$; Entartung $n^2$ (ohne Spin). Übergänge: $h\\nu = E_{n_o} - E_{n_u}$; Balmer-Serie endet bei $n_u = 2$.', {topic:'h'});
lexe('radialgleichung', 'Radialgleichung', 'Mit $\\psi = R(r)Y_l^m(\\theta,\\varphi)$ und $u = rR$: $-\\frac{\\hbar^2}{2m}u\'\' + V_{\\text{eff}}(r)u = Eu$, $V_{\\text{eff}} = V(r) + \\frac{\\hbar^2l(l+1)}{2mr^2}$, Randbedingung $u(0) = 0$. Normierung $\\int_0^\\infty|u|^2dr = \\int_0^\\infty|R|^2r^2dr = 1$. Verhalten: $u \\propto r^{l+1}$ für $r \\to 0$, $u \\propto e^{-\\kappa r}$ mit $\\kappa = \\sqrt{-2mE}/\\hbar$ für $r \\to \\infty$.', {topic:'h'});
lexe('radialfunktionen', 'Radialfunktionen des Wasserstoffatoms', '- $R_{10} = 2a_0^{-3/2}e^{-r/a_0}$\n- $R_{20} = \\frac{1}{\\sqrt2}a_0^{-3/2}\\left(1 - \\frac{r}{2a_0}\\right)e^{-r/(2a_0)}$\n- $R_{21} = \\frac{1}{\\sqrt{24}}a_0^{-3/2}\\frac{r}{a_0}e^{-r/(2a_0)}$\n\nGrundzustand $\\psi_{100} = \\frac{1}{\\sqrt{\\pi a_0^3}}e^{-r/a_0}$ (mit $Y_0^0 = 1/\\sqrt{4\\pi}$). Allgemein $\\langle r\\rangle_{nl} = \\frac{a_0}{2}[3n^2 - l(l+1)]$, $\\langle 1/r\\rangle_{nl} = \\frac{1}{n^2a_0}$.', {topic:'h'});
lexe('virialsatz', 'Virialsatz', 'Für stationäre Zustände im Potential $V\\propto r^k$ gilt $2\\langle T\\rangle = k\\langle V\\rangle$. Coulomb ($k = -1$): $\\langle T\\rangle = -E_n$, $\\langle V\\rangle = 2E_n$. Oszillator ($k = 2$): $\\langle T\\rangle = \\langle V\\rangle = E_n/2$.', {topic:'h'});
lexe('h-zentralpotential', 'Zentralpotential', 'Ein Potential $V(r)$, das nur vom Abstand abhängt. Dann vertauscht $\\hat H$ mit $\\hat L^2$ und $\\hat L_z$, und der Ansatz $\\psi = R(r)Y_l^m(\\theta,\\varphi)$ trennt die Schrödingergleichung in den Winkelteil (für jedes $V$ dieselben $Y_l^m$) und die Radialgleichung. Die Energie hängt nicht von $m$ ab; jedes Niveau ist mindestens $(2l+1)$-fach entartet.', {topic:'h'});
lexe('h-entartung', 'Entartung im Wasserstoffatom', '$E_n$ hängt nur von $n$ ab. Zu $n$ gehören $l = 0, \\dots, n-1$ und je $2l+1$ Werte von $m$: zusammen $\\sum_{l=0}^{n-1}(2l+1) = n^2$ Zustände (mit Spin $2n^2$). Die $m$-Entartung hat jedes Zentralpotential; die $l$-Entartung ist eine Besonderheit von $V \\propto 1/r$ (Lenz-Runge-Vektor). Überlagerungen entarteter Zustände sind wieder stationär.', {topic:'h'});
lexe('h-spektralserien', 'Spektralserien des Wasserstoffs', 'Rydberg-Formel $\\frac1\\lambda = R\\left(\\frac{1}{n_u^2} - \\frac{1}{n_o^2}\\right)$, $R_\\infty \\approx 1{,}0974\\cdot10^7\\,\\mathrm m^{-1}$, $R_H$ um $0{,}05\\,\\%$ kleiner. Lyman ($n_u = 1$, UV, ab $122\\,\\mathrm{nm}$), Balmer ($n_u = 2$, sichtbar: $656$, $486$, $434$, $410\\,\\mathrm{nm}$, Grenze nahe $365\\,\\mathrm{nm}$), Paschen ($n_u = 3$, IR, ab $1875\\,\\mathrm{nm}$). Dipolübergänge nur mit $\\Delta l = \\pm1$.', {topic:'h'});
