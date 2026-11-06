/* ===== Thema 10: Spin ½ ===== */
const SPIN = extra => Object.assign({rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}}, extra || {});
topic({
  id:'spin', math:['m-eigen', 'm-komplex'], title:'Spin ½', short:'Spin',
  src:'Griffiths & Schroeter Kap. 4.4 · Sakurai & Napolitano Kap. 1 · Nolting 5/2',
  goals:[
    'Ich kann mit Spinoren und den Matrizen $\\hat S_i = \\frac\\hbar2\\sigma_i$ rechnen und Eigenzustände von $\\hat S_x$, $\\hat S_y$, $\\hat S_z$ angeben.',
    'Ich kann Messwahrscheinlichkeiten $|\\langle\\pm|\\chi\\rangle|^2$ und Erwartungswerte berechnen, auch für Folgen von Stern-Gerlach-Messungen.',
    'Ich kann die Zeitentwicklung im Magnetfeld (Larmor-Präzession) mit $e^{-i\\hat Ht/\\hbar}$ berechnen.'
  ],
  needs:'Matrizen multiplizieren, Eigenwerte von $2\\times2$-Matrizen · Dirac-Notation $\\langle\\varphi|\\psi\\rangle$ · Messpostulat',
  wozu:'Auf dem Spin beruhen Kernspinresonanz (NMR) und Magnetresonanztomographie: Protonen präzedieren im Magnetfeld mit der Larmor-Frequenz, etwa 42,6 MHz pro Tesla, und genau diese Frequenz misst das Gerät. Dass jedes Orbital im Atom zwei Elektronen aufnimmt (Aufbau des Periodensystems), liegt am Pauli-Prinzip zusammen mit den zwei Spineinstellungen. Und ein Spin ½ ist das einfachste Quantensystem überhaupt – das Qubit der Quanteninformation.',
  bridge:'Aus Thema 8 kommen die Drehimpuls-Vertauschungsrelationen und die Leiteroperatoren zurück: Der Spin erfüllt dieselbe Algebra, nur mit $s = \\tfrac12$. Aus Thema 6 brauchst du Dirac-Schreibweise, Messpostulat und Zustandsreduktion, aus M4 Eigenwerte von $2\\times2$-Matrizen und aus Thema 2 die Zeitentwicklung mit Phasenfaktoren. Neu ist: Der Zustandsraum ist zweidimensional, eine Wellenfunktion im Ort kommt nicht vor.',
  check:[
    {q:'Welche Eigenwerte hat die Matrix $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$?', opts:['$+1$ und $-1$', '$0$ und $1$', '$1$ (doppelt)'], a:0, ex:'$\\det\\begin{pmatrix}-\\lambda&1\\\\1&-\\lambda\\end{pmatrix} = \\lambda^2 - 1 = 0$.', prev:'m-eigen', seg:'me-t3'},
    {q:'Für $|\\psi\\rangle = \\binom{a}{b}$ und $|\\varphi\\rangle = \\binom{c}{d}$ ist $\\langle\\varphi|\\psi\\rangle = $', opts:['$c^*a + d^*b$', '$ca + db$', '$a^*c + b^*d$'], a:0, ex:'Das Bra enthält die konjugierten Komponenten des Kets: $\\langle\\varphi| = (c^*, d^*)$.', prev:'form'},
    {q:'Ein Zustand ist $|\\chi\\rangle = \\sum_n c_n|a_n\\rangle$ (normiert, $|a_n\\rangle$ Eigenzustände von $\\hat A$). Mit welcher Wahrscheinlichkeit misst man $a_2$?', opts:['$|c_2|^2$', '$c_2$', '$|c_2|$'], a:0, ex:'Bornsche Regel: $P(a_n) = |\\langle a_n|\\chi\\rangle|^2 = |c_n|^2$.', prev:'form'},
    {q:'Welche Vertauschungsrelation gilt für Drehimpulse?', opts:['$[\\hat L_x, \\hat L_y] = i\\hbar\\hat L_z$', '$[\\hat L_x, \\hat L_y] = 0$', '$[\\hat L_x, \\hat L_y] = \\hbar\\hat L_z$'], a:0, ex:'Und zyklisch. Der Spin erfüllt dieselben Relationen.', prev:'dreh'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Wahrscheinlichkeit für $S_x = +\\hbar/2$ im Zustand $|\\chi\\rangle = \\binom ab$ zu berechnen?', opts:['den Eigenzustand $|{+x}\\rangle$ aufschreiben und $|\\langle{+x}|\\chi\\rangle|^2$ bilden', '$\\langle\\chi|\\hat S_x|\\chi\\rangle$ ausrechnen und durch $\\hbar/2$ teilen', '$|a|^2$ nehmen, weil die obere Komponente zu „plus“ gehört', 'weiß ich noch nicht'], a:0, ex:'Bornsche Regel: Man projiziert auf den Eigenzustand zum Messwert. $\\langle S_x\\rangle/(\\hbar/2)$ ist $P(+) - P(-)$, nicht $P(+)$; und $|a|^2$ ist die Wahrscheinlichkeit für $S_z = +\\hbar/2$.'},
    {q:'Wie beginnst du, um den Spinzustand zur Zeit $t$ im Feld $B\\hat z$ zu finden ($\\hat H = \\omega\\hat S_z$, Start $a|\\uparrow\\rangle + b|\\downarrow\\rangle$)?', opts:['nach Eigenzuständen von $\\hat H$ zerlegen und jedem Anteil $e^{-iE_nt/\\hbar}$ geben', 'den ganzen Zustand mit einem gemeinsamen Faktor $e^{-i\\omega t}$ multiplizieren', 'die Schrödingergleichung für eine Wellenfunktion $\\psi(x, t)$ im Ort lösen', 'weiß ich noch nicht'], a:0, ex:'$|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ sind Eigenzustände von $\\hat H$ mit $E = \\pm\\hbar\\omega/2$. Ein gemeinsamer Faktor wäre nur eine globale Phase und änderte nichts. Eine Ortswellenfunktion kommt beim reinen Spin nicht vor.'}
  ],
  phenomenon:{
    title:'Ein Strich oder zwei Flecken?',
    text:'Otto Stern und Walther Gerlach schickten 1922 einen Strahl von Silberatomen durch ein stark inhomogenes Magnetfeld. Jedes Atom trägt ein kleines magnetisches Moment $\\boldsymbol\\mu$. Im inhomogenen Feld wirkt darauf die Kraft $F_z = \\mu_z\\,\\partial B_z/\\partial z$. Sie lenkt jedes Atom je nach seinem $\\mu_z$ nach oben oder unten ab.\n\nDie Atome kommen aus einem heißen Ofen; ihre Momente sind zufällig orientiert. Hinter dem Magneten fängt eine Glasplatte die Atome auf.',
    q:{q:'Was erwartest du auf der Platte?', opts:['einen durchgehenden Strich, weil $\\mu_z$ jeden Wert annehmen kann', 'genau zwei getrennte Flecken', 'einen Fleck in der Mitte, weil sich die Ablenkungen aufheben', 'drei Flecken, wie bei einem Drehimpuls mit $l = 1$'], a:1,
      ex:'Beobachtet werden zwei Flecken: $\\mu_z$ hat nur zwei mögliche Werte.',
      fb:['Das ist die klassische Erwartung: zufällig orientierte Momente, also jeder Wert zwischen $-|\\boldsymbol\\mu|$ und $+|\\boldsymbol\\mu|$. Beobachtet wird aber etwas anderes.',
        'Richtig – und das ist überraschend. Egal wie die Momente im Ofen orientiert waren: $\\mu_z$ nimmt nur zwei Werte an.',
        'Ein Mittelwert entstünde nur, wenn alle Atome gleich abgelenkt würden. Jedes einzelne Atom wird aber nach seinem eigenen $\\mu_z$ abgelenkt.',
        'Gut, eine Quantisierung zu erwarten. Ein Bahndrehimpuls hat aber $2l + 1$ Einstellungen, also eine ungerade Zahl von Flecken. Beobachtet werden zwei.']},
    reveal:'Auf der Platte liegen **zwei** Flecken. Die $z$-Komponente des Moments ist quantisiert und hat nur zwei Werte. Ein Drehimpuls mit Quantenzahl $j$ hat $2j + 1$ Einstellungen; zwei Einstellungen verlangen $j = \\tfrac12$. Das kann kein Bahndrehimpuls sein (der hat ganzzahliges $l$). Beim Silberatom ist der Bahndrehimpuls aller Elektronen zusammen null; das Moment stammt vom Eigendrehimpuls, dem **Spin**, des äußeren Elektrons.\n\nDreht man den Magneten in $x$-Richtung, findet man wieder genau zwei Flecken. Wie man das mit Zuständen und Operatoren beschreibt, zeigt der Lerntext.'
  },
  teach:[
    {id:'spin-t1', title:'Stern-Gerlach: zwei Flecken statt eines Strichs',
      text:'**Das Phänomen.** Ein Elektron hat nicht nur Ort und Impuls. Es trägt auch ein eigenes [[lex:spin-moment|magnetisches Moment]] $\\boldsymbol\\mu$, als wäre es ein winziger geladener Kreisel. Den Nachweis lieferte 1922 der [[lex:stern-gerlach|Stern-Gerlach-Versuch]]: Ein Strahl von Silberatomen fliegt durch ein stark inhomogenes Magnetfeld und trifft dann auf eine Glasplatte.\n\n**Was die klassische Physik erwartet.** Ein Moment hat im Feld die Energie $U = -\\boldsymbol\\mu\\cdot\\mathbf B$. Ist das Feld inhomogen, wirkt die Kraft $F_z = \\mu_z\\,\\partial B_z/\\partial z$; die Beiträge der anderen Komponenten mitteln sich im Wesentlichen weg. Die Ablenkung ist also proportional zu $\\mu_z$. Die Atome kommen aus einem Ofen, ihre Momente zeigen in zufällige Richtungen. Klassisch nimmt $\\mu_z$ deshalb jeden Wert zwischen $-|\\boldsymbol\\mu|$ und $+|\\boldsymbol\\mu|$ an. Auf der Platte sollte ein durchgehender Strich entstehen.\n\n**Was man beobachtet.** Auf der Platte liegen zwei getrennte Flecken. $\\mu_z$ nimmt nur zwei Werte an. Dreht man den Magneten, so dass er in $x$-Richtung ablenkt, findet man wieder genau zwei Flecken, jetzt für $\\mu_x$. Jede Komponente ist quantisiert, gleich in welche Richtung man misst.\n\n**Warum das ein neuer Drehimpuls ist.** Ein magnetisches Moment gehört zu einem Drehimpuls: $\\boldsymbol\\mu = \\gamma\\mathbf S$ mit dem gyromagnetischen Verhältnis $\\gamma$. Aus Thema 8 weißt du: Ein Drehimpuls mit Quantenzahl $j$ hat $2j + 1$ mögliche Werte $m\\hbar$ seiner $z$-Komponente. Ein Bahndrehimpuls hat ganzzahliges $l$, also eine ungerade Zahl von Werten (1, 3, 5, …). Zwei Werte verlangen $2s + 1 = 2$, also $s = \\tfrac12$. Beim Silberatom ist der Bahndrehimpuls aller Elektronen zusammen null. Das Moment stammt vom Eigendrehimpuls, dem **Spin**, des einen äußeren Elektrons.\n\nHistorisch war das erst später klar. Stern und Gerlach wollten die „Richtungsquantelung“ des älteren Atommodells prüfen. Den Elektronenspin führten Uhlenbeck und Goudsmit 1925 ein, um Spektren zu erklären. Dass der Stern-Gerlach-Versuch ihn zeigt, erkannte man erst danach.\n\n**Kein kleiner Kreisel.** Der Spin hat kein klassisches Gegenstück. Stellt man sich das Elektron als geladene Kugel vom klassischen Elektronenradius vor, müsste ihre Oberfläche für den Drehimpuls $\\hbar/2$ schneller als das Licht rotieren. Der Spin ist eine innere Eigenschaft wie Masse oder Ladung, mit $s = \\tfrac12$ für Elektron, Proton und Neutron. Für das Elektron ist $\\gamma = -g\\,e/(2m_e)$ mit $g \\approx 2{,}002$, also $\\gamma \\approx -e/m_e$.\n\n**Typische Fehlvorstellung.** „Die Platte zeigt einen Mittelwert, die Ablenkungen heben sich teilweise auf.“ Nein: Jedes einzelne Atom landet in einem der beiden Flecken. Ein Mittelwert entsteht erst, wenn man über viele Atome mittelt.',
      q:[
        {q:'Ein Strahl von Teilchen mit Drehimpuls $j = 1$ (und $\\boldsymbol\\mu \\propto \\mathbf J$) geht durch einen Stern-Gerlach-Magneten. Wie viele Flecken erwartest du?', opts:['drei', 'zwei', 'einen durchgehenden Strich'], a:0, ex:'$2j + 1 = 3$ Werte $m = -1, 0, +1$, also drei Flecken.'},
        {q:'Warum kann ein Bahndrehimpuls die zwei Flecken beim Silberatom nicht erklären?', opts:['Er hat $2l+1$, also eine ungerade Zahl von Einstellungen.', 'Ein Bahndrehimpuls erzeugt kein magnetisches Moment.', 'Ein Bahndrehimpuls hat keine $z$-Komponente.'], a:0, ex:'Mit ganzzahligem $l$ ist $2l + 1$ ungerade. Zwei Einstellungen gehören zu $s = \\tfrac12$. (Ein Bahndrehimpuls erzeugt durchaus ein Moment – es ist hier nur null.)'}
      ]},
    {id:'spin-t2', title:'Der Zustandsraum: zwei komplexe Dimensionen',
      text:'**Idee.** Für den Spin allein brauchst du keine Wellenfunktion $\\psi(x)$. Eine Messung von $S_z$ hat nur zwei Ergebnisse, $+\\hbar/2$ und $-\\hbar/2$. Zu jedem gehört ein Eigenzustand, $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$. Sie sind orthonormal und bilden eine Basis eines zweidimensionalen [[lex:hilbertraum|Hilbertraums]] $\\mathbb C^2$:\n\n$$|\\uparrow\\rangle = \\binom10,\\qquad |\\downarrow\\rangle = \\binom01.$$\n\nJeder Spinzustand ist eine Überlagerung, ein [[lex:spinor|Spinor]]:\n\n$$|\\chi\\rangle = a|\\uparrow\\rangle + b|\\downarrow\\rangle = \\binom ab,\\qquad |a|^2 + |b|^2 = 1.$$\n\n**Deutung.** Das [[lex:messpostulat|Messpostulat]] aus Thema 6 gilt hier in seiner einfachsten Form: $P(S_z = +\\hbar/2) = |\\langle\\uparrow|\\chi\\rangle|^2 = |a|^2$ und $P(S_z = -\\hbar/2) = |b|^2$. Das Bra ist $\\langle\\chi| = (a^*, b^*)$; im [[lex:skalarprodukt|Skalarprodukt]] werden die Komponenten des linken Vektors konjugiert. Der Erwartungswert ist $\\langle S_z\\rangle = \\frac\\hbar2(|a|^2 - |b|^2)$.\n\n**Wie viele Zahlen beschreiben einen Spin?** Zwei komplexe Zahlen sind vier reelle. Die Normierung nimmt eine weg. Eine weitere ist ohne Bedeutung: Ein gemeinsamer Faktor $e^{i\\alpha}$ ändert keine Wahrscheinlichkeit $|\\langle\\varphi|\\chi\\rangle|^2$. Man nennt ihn globale Phase. Es bleiben zwei reelle Zahlen. Man wählt $a$ reell und $\\ge 0$ und schreibt\n\n$$|\\chi\\rangle = \\cos\\tfrac\\theta2\\,|\\uparrow\\rangle + e^{i\\varphi}\\sin\\tfrac\\theta2\\,|\\downarrow\\rangle,\\qquad 0\\le\\theta\\le\\pi,\\quad 0\\le\\varphi<2\\pi.$$\n\n$(\\theta, \\varphi)$ sind Polar- und Azimutwinkel eines Punktes auf einer Kugel, der [[lex:bloch-kugel|Bloch-Kugel]]. In Abschnitt 4 zeigt sich: Dieser Punkt ist genau die Richtung $\\hat n$, für die $|\\chi\\rangle$ „Spin $+\\hbar/2$ längs $\\hat n$“ bedeutet. Die Herleitung unten prüft Normierung und $\\langle S_z\\rangle = \\frac\\hbar2\\cos\\theta$.\n\n**Die relative Phase zählt.** Die Phase *zwischen* $a$ und $b$ ist messbar. $\\frac{1}{\\sqrt2}(|\\uparrow\\rangle + |\\downarrow\\rangle)$ und $\\frac{1}{\\sqrt2}(|\\uparrow\\rangle - |\\downarrow\\rangle)$ haben dieselben Wahrscheinlichkeiten für $S_z$. Sie sind aber zueinander orthogonal, und eine Messung von $S_x$ unterscheidet sie sicher.\n\n**Typische Fehlvorstellung: Der Hilbertraum ist nicht der Raum, in dem der Spin „zeigt“.** $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ stehen im $\\mathbb C^2$ senkrecht aufeinander: $\\langle\\uparrow|\\downarrow\\rangle = 0$. Im Ortsraum gehören sie aber zu *entgegengesetzten* Richtungen, $+z$ und $-z$. Auf der Bloch-Kugel liegen sie an Nord- und Südpol. Daher steht $\\theta/2$ in den Komponenten: Zum Winkel $\\theta$ zwischen zwei Raumrichtungen gehört der halbe Winkel $\\theta/2$ zwischen den Zustandsvektoren, $|\\langle\\chi_1|\\chi_2\\rangle| = \\cos\\frac\\theta2$. Entgegengesetzte Richtungen ($180^\\circ$) geben orthogonale Zustände ($90^\\circ$).',
      derive:{ctx:SPIN({params:{θ:'pos', φ:'pos', α:'pos'}, states:{χ:'cos(θ/2)|↑⟩ + e^(iφ) sin(θ/2)|↓⟩'}, state:'χ'}),
        lines:[
          {l:'⟨χ|χ⟩ = cos(θ/2)^2 + |e^(iφ)|^2 sin(θ/2)^2', w:'Bra mit konjugierten Komponenten',
            why:{q:'Warum steht hier $|e^{i\\varphi}|^2$ und nicht $e^{2i\\varphi}$?', opts:['Das Bra enthält $(e^{i\\varphi})^*$, und das Produkt ist $1$.', 'Phasen darf man beim Quadrieren immer weglassen.', 'Weil $\\varphi$ auf der Kugel nur bis $2\\pi$ läuft.'], a:0, ex:'$\\langle\\chi| = (\\cos\\frac\\theta2,\\ e^{-i\\varphi}\\sin\\frac\\theta2)$. Ohne Konjugation stünde $e^{2i\\varphi}$ da, und die Norm wäre keine reelle Zahl.'}},
          {l:'= 1', w:'$\\cos^2 + \\sin^2 = 1$'},
          {l:'⟨S_z⟩ = ħ/2 (cos(θ/2)^2 - sin(θ/2)^2)', w:'$\\frac\\hbar2(|a|^2 - |b|^2)$'},
          {l:'= ħ/2 cos(θ)', w:'Doppelwinkelformel',
            why:{q:'Welche Formel steckt in diesem Schritt?', opts:['$\\cos^2\\frac\\theta2 - \\sin^2\\frac\\theta2 = \\cos\\theta$', '$\\cos^2\\frac\\theta2 + \\sin^2\\frac\\theta2 = 1$', '$2\\sin\\frac\\theta2\\cos\\frac\\theta2 = \\sin\\theta$'], a:0, ex:'Doppelwinkelformel für den Kosinus. Für $\\theta = 0$ (Nordpol) ist $\\langle S_z\\rangle = +\\hbar/2$, für $\\theta = \\pi$ (Südpol) $-\\hbar/2$.'}},
          {l:'|⟨↑|e^(iα) χ⟩|^2 = |⟨↑|χ⟩|^2', w:'globale Phase ändert nichts',
            why:{q:'Was zeigt diese Zeile?', opts:['Ein gemeinsamer Phasenfaktor ändert keine Wahrscheinlichkeit.', 'Die relative Phase zwischen $a$ und $b$ ist unwichtig.', 'Der Zustand $e^{i\\alpha}|\\chi\\rangle$ ist nicht normiert.'], a:0, ex:'$|e^{i\\alpha}z|^2 = |z|^2$. Das gilt nur für einen *gemeinsamen* Faktor. Eine Phase zwischen den Komponenten ändert dagegen die Wahrscheinlichkeiten für $S_x$ und $S_y$.'}}
        ]},
      q:[
        {q:'Der Spin ist im Zustand $\\frac{1}{\\sqrt5}(|\\uparrow\\rangle + 2i|\\downarrow\\rangle)$. Was ist $\\langle S_z\\rangle$?', opts:['$-3\\hbar/10$', '$+3\\hbar/10$', '$-\\hbar/2$'], a:0, ex:'$\\langle S_z\\rangle = \\frac\\hbar2\\left(\\frac15 - \\frac45\\right) = -\\frac{3\\hbar}{10}$. Die Phase $i$ spielt für $S_z$ keine Rolle, denn $|2i|^2 = 4$.'},
        {q:'Welche beiden Zustände sind physikalisch gleich?', opts:['$|\\chi\\rangle$ und $-|\\chi\\rangle$', '$|\\uparrow\\rangle + |\\downarrow\\rangle$ und $|\\uparrow\\rangle - |\\downarrow\\rangle$', '$|\\uparrow\\rangle$ und $|\\downarrow\\rangle$'], a:0, ex:'$-1 = e^{i\\pi}$ ist eine globale Phase. $|\\uparrow\\rangle \\pm |\\downarrow\\rangle$ unterscheiden sich in der relativen Phase; sie sind orthogonal.'}
      ]},
    {id:'spin-t3', title:'Die Spinoperatoren und die Pauli-Matrizen',
      text:'**Was gesucht ist.** Zu jeder Spinkomponente gehört ein [[lex:hermitescher-operator|hermitescher Operator]], im $\\mathbb C^2$ also eine hermitesche $2\\times2$-Matrix. Drei Forderungen legen die Matrizen fest:\n\n1. $\\hat S_z$ hat die Eigenzustände $|\\uparrow\\rangle, |\\downarrow\\rangle$ zu den Eigenwerten $\\pm\\hbar/2$.\n2. Die Komponenten erfüllen dieselbe [[lex:drehimpuls-algebra|Drehimpuls-Algebra]] wie in Thema 8: $[\\hat S_x, \\hat S_y] = i\\hbar\\hat S_z$ und zyklisch.\n3. Mit $s = \\tfrac12$ gilt $\\hat S^2 = s(s+1)\\hbar^2 = \\tfrac34\\hbar^2$ für jeden Zustand.\n\n**$\\hat S_z$.** In seiner Eigenbasis ist ein Operator diagonal, mit den Eigenwerten auf der Diagonale: $\\hat S_z = \\frac\\hbar2\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$.\n\n**$\\hat S_x$ und $\\hat S_y$ über die Leiteroperatoren.** Aus Thema 8 kennst du die [[lex:drehimpuls-leiter|Leiteroperatoren]] $\\hat S_\\pm = \\hat S_x \\pm i\\hat S_y$ mit\n\n$$\\hat S_+|s, m\\rangle = \\hbar\\sqrt{s(s+1) - m(m+1)}\\,|s, m+1\\rangle.$$\n\nFür $s = \\tfrac12$, $m = -\\tfrac12$ ist die Wurzel $\\sqrt{\\tfrac34 + \\tfrac14} = 1$, also $\\hat S_+|\\downarrow\\rangle = \\hbar|\\uparrow\\rangle$. Außerdem ist $\\hat S_+|\\uparrow\\rangle = 0$, denn höher geht es nicht. Die Spalten einer Matrix sind die Bilder der Basisvektoren. Daraus folgen $\\hat S_\\pm$ und dann $\\hat S_x = \\frac12(\\hat S_+ + \\hat S_-)$, $\\hat S_y = \\frac{1}{2i}(\\hat S_+ - \\hat S_-)$. Die Herleitung unten geht Zeile für Zeile durch.\n\n**Ergebnis: die Pauli-Matrizen.** Man schreibt $\\hat S_i = \\frac\\hbar2\\sigma_i$ mit den [[lex:pauli|Pauli-Matrizen]]\n\n$$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\quad \\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix},\\quad \\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}.$$\n\nSie sind hermitesch, haben Spur 0 und die Eigenwerte $\\pm1$. Ihre Rechenregeln sind kurz: $\\sigma_i^2 = \\mathbb 1$ und $\\sigma_x\\sigma_y = i\\sigma_z = -\\sigma_y\\sigma_x$ (zyklisch). Daraus folgt sofort $[\\hat S_x, \\hat S_y] = \\frac{\\hbar^2}{4}\\cdot 2i\\sigma_z = i\\hbar\\hat S_z$; Forderung 2 ist erfüllt. Und $\\hat S^2 = \\frac{\\hbar^2}{4}(\\sigma_x^2 + \\sigma_y^2 + \\sigma_z^2) = \\frac34\\hbar^2\\,\\mathbb 1$; Forderung 3 auch.\n\n**Deutung.** $\\hat S_x$ ist nicht diagonal: $|\\uparrow\\rangle$ ist kein Eigenzustand von $\\hat S_x$. Ein Zustand mit festem $S_z$ hat also kein festes $S_x$. Das ist die Aussage des [[lex:kommutator|Kommutators]]; nach der [[lex:robertson|Robertson-Relation]] gilt $\\Delta S_x\\,\\Delta S_y \\ge \\frac\\hbar2|\\langle S_z\\rangle|$.\n\n**Typische Fehlvorstellung.** „Der Spin ist ein Pfeil der Länge $\\frac{\\sqrt3}{2}\\hbar$, der schräg zur $z$-Achse steht.“ Dann hätte auch $S_x$ einen festen Wert. Tatsächlich liefert im Zustand $|\\uparrow\\rangle$ eine Messung von $S_x$ zufällig $\\pm\\hbar/2$, je mit Wahrscheinlichkeit $\\frac12$. Fest sind nur $\\langle S_x\\rangle = \\langle S_y\\rangle = 0$ und $\\langle S_x^2\\rangle + \\langle S_y^2\\rangle = \\frac{\\hbar^2}{2}$.',
      derive:{ctx:SPIN(),
        lines:[
          {l:'S_+ = ħ (0, 1; 0, 0)', w:'$\\hat S_+|\\downarrow\\rangle = \\hbar|\\uparrow\\rangle$, $\\hat S_+|\\uparrow\\rangle = 0$',
            why:{q:'Warum steht das $\\hbar$ rechts oben?', opts:['Die 2. Spalte ist das Bild von $|\\downarrow\\rangle$, also $\\hbar|\\uparrow\\rangle$.', 'Die 1. Spalte ist das Bild von $|\\uparrow\\rangle$, also $\\hbar|\\downarrow\\rangle$.', 'Weil $\\hat S_+$ hermitesch und damit symmetrisch ist.'], a:0, ex:'Spalte $j$ einer Matrix ist das Bild des $j$-ten Basisvektors. $\\hat S_+$ ist nicht hermitesch: $\\hat S_+^\\dagger = \\hat S_-$.'}},
          {l:'S_- = ħ (0, 0; 1, 0)', w:'$\\hat S_- = \\hat S_+^\\dagger$'},
          {l:'S_x = 1/2 (S_+ + S_-)', w:'aus $\\hat S_\\pm = \\hat S_x \\pm i\\hat S_y$'},
          {l:'= ħ/2 (0, 1; 1, 0)'},
          {l:'S_y = 1/(2i) (S_+ - S_-)', w:'Differenz der Leiteroperatoren'},
          {l:'= ħ/2 (0, -i; i, 0)', w:'$\\frac{1}{i} = -i$',
            why:{q:'Woher kommt das $-i$ rechts oben?', opts:['Aus $\\frac{\\hbar}{2i} = -\\frac{i\\hbar}{2}$.', 'Aus der Konjugation im Bra.', 'Aus $\\sigma_y = \\sigma_z\\sigma_x$.'], a:0, ex:'$\\hat S_+ - \\hat S_- = \\hbar\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$, geteilt durch $2i$ gibt $\\frac\\hbar2\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$. (Es gilt $\\sigma_z\\sigma_x = i\\sigma_y$, nicht $\\sigma_y$.)'}},
          {l:'[S_x, S_y] = iħ S_z', w:'Forderung 2'},
          {l:'S_x^2 + S_y^2 + S_z^2 = 3/4 ħ^2 I', w:'Forderung 3',
            why:{q:'Was bedeutet diese Zeile?', opts:['Jeder Spinzustand ist Eigenzustand von $\\hat S^2$ mit $s = \\frac12$.', 'Der Spin hat in jeder Richtung den Wert $\\frac{\\sqrt3}2\\hbar$.', 'Nur $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ haben $s = \\frac12$.'], a:0, ex:'$\\hat S^2$ ist ein Vielfaches der Einheitsmatrix, also hat jeder Spinor $s(s+1)\\hbar^2 = \\frac34\\hbar^2$. Eine einzelne Komponente liefert trotzdem nur $\\pm\\hbar/2$.'}}
        ]},
      q:[
        {q:'Was ist $\\hat S_x|\\uparrow\\rangle$?', opts:['$\\frac\\hbar2|\\downarrow\\rangle$', '$\\frac\\hbar2|\\uparrow\\rangle$', '$0$'], a:0, ex:'$\\sigma_x$ vertauscht die Komponenten. $|\\uparrow\\rangle$ ist also kein Eigenzustand von $\\hat S_x$. Achtung: $\\hat S_x|\\uparrow\\rangle$ ist *nicht* der Zustand nach einer Messung von $S_x$ – der ist $|{+x}\\rangle$ oder $|{-x}\\rangle$.'},
        {q:'$\\sigma_y\\sigma_x = $', opts:['$-i\\sigma_z$', '$i\\sigma_z$', '$\\mathbb 1$'], a:0, ex:'Pauli-Matrizen antivertauschen: $\\sigma_y\\sigma_x = -\\sigma_x\\sigma_y = -i\\sigma_z$.'}
      ]},
    {id:'spin-t4', title:'Messen in beliebiger Richtung',
      text:'**Eigenzustände von $\\hat S_x$.** Gesucht sind Messwerte und Zustände für einen Magneten in $x$-Richtung. Das [[lex:eigenwertproblem|Eigenwertproblem]] $\\sigma_x\\binom ab = \\lambda\\binom ab$ gibt $\\det(\\sigma_x - \\lambda\\mathbb 1) = \\lambda^2 - 1 = 0$, also $\\lambda = \\pm1$. Die Messwerte von $S_x$ sind wieder $\\pm\\hbar/2$. Für $\\lambda = +1$ folgt $b = a$, für $\\lambda = -1$ folgt $b = -a$. Normiert, und für $\\hat S_y$ genauso, erhält man die [[lex:spin-eigenzustaende|Eigenzustände der Spinkomponenten]]:\n\n$$|{\\pm x}\\rangle = \\tfrac{1}{\\sqrt2}\\big(|\\uparrow\\rangle \\pm |\\downarrow\\rangle\\big),\\qquad |{\\pm y}\\rangle = \\tfrac{1}{\\sqrt2}\\big(|\\uparrow\\rangle \\pm i|\\downarrow\\rangle\\big).$$\n\n**Beliebige Richtung.** Für einen Einheitsvektor $\\hat n = (\\sin\\theta\\cos\\varphi, \\sin\\theta\\sin\\varphi, \\cos\\theta)$ ist die Spinkomponente längs $\\hat n$\n\n$$\\hat S_{\\hat n} = \\hat n\\cdot\\hat{\\mathbf S} = \\frac\\hbar2\\begin{pmatrix}\\cos\\theta & \\sin\\theta\\,e^{-i\\varphi}\\\\ \\sin\\theta\\,e^{i\\varphi} & -\\cos\\theta\\end{pmatrix}.$$\n\nIhre Eigenwerte sind für jede Richtung $\\pm\\hbar/2$: Spur 0 und Determinante $-\\hbar^2/4$. Der Eigenzustand zu $+\\hbar/2$ ist genau der Bloch-Zustand $|{+\\hat n}\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$; die Herleitung unten prüft das nach. Damit ist die [[lex:bloch-kugel|Bloch-Kugel]] erklärt: **Jeder Spinzustand ist „Spin $+\\hbar/2$“ längs irgendeiner Richtung.**\n\n**Wahrscheinlichkeiten.** Ist der Spin in $|\\uparrow\\rangle$ und misst man längs $\\hat n$, so ist $P(+\\hbar/2) = |\\langle{+\\hat n}|\\uparrow\\rangle|^2 = \\cos^2\\frac\\theta2$. Allgemein gilt für zwei Richtungen mit dem Winkel $\\alpha$ dazwischen\n\n$$|\\langle{+\\hat m}|{+\\hat n}\\rangle|^2 = \\cos^2\\tfrac\\alpha2 = \\tfrac12(1 + \\cos\\alpha).$$\n\n**Typische Fehlvorstellung: senkrecht im Raum heißt nicht orthogonal im Hilbertraum.** Viele schließen: „$z$ und $x$ stehen senkrecht, also ist $\\langle{\\uparrow_z}|{\\uparrow_x}\\rangle = 0$.“ Diese Verwechslung von Hilbertraum und Ortsraum ist gut dokumentiert (Zhu & Singh 2011; Singh & Marshman 2015). Rechne nach: $\\langle\\uparrow|{+x}\\rangle = \\frac{1}{\\sqrt2} \\ne 0$, passend zu $\\alpha = 90^\\circ$ und $\\cos^2 45^\\circ = \\frac12$. Orthogonal ($P = 0$) sind zwei Spinzustände nur für $\\alpha = 180^\\circ$, also für entgegengesetzte Richtungen. Zu $|\\uparrow\\rangle$ ist allein $|\\downarrow\\rangle$ orthogonal (bis auf eine Phase), zu $|{+x}\\rangle$ allein $|{-x}\\rangle$.\n\n**Mini-Beispiel.** Der Spin ist $|{+x}\\rangle$, gemessen wird $S_y$. Mit $\\langle{+y}| = \\frac{1}{\\sqrt2}(1, -i)$ ist $\\langle{+y}|{+x}\\rangle = \\frac12(1 - i)$ und $P(+y) = \\frac14\\cdot 2 = \\frac12$. Das passt zu $\\alpha = 90^\\circ$.',
      fig:{lab:'spin', caption:'Der Pfeil ist die Richtung $\\hat n(\\theta, \\varphi)$ des Zustands, die Balken zeigen $P(+\\hbar/2)$ für Magnete in $z$, $x$ und $y$. Stelle $\\theta = \\pi/2$, $\\varphi = 0$ ein: Der Pfeil zeigt in $x$-Richtung, und $P(\\uparrow z) = \\frac12$ – nicht $0$.'},
      derive:{ctx:SPIN({params:{θ:'pos', φ:'pos'}, mat:{preset:'spin', mats:{S_n:'ħ/2 (cos(θ), sin(θ) e^(-iφ); sin(θ) e^(iφ), -cos(θ))'}}, states:{χ:'cos(θ/2)|↑⟩ + e^(iφ) sin(θ/2)|↓⟩'}}),
        lines:[
          {l:'S_n = sin(θ) cos(φ) S_x + sin(θ) sin(φ) S_y + cos(θ) S_z', w:'$\\hat S_{\\hat n} = \\hat n\\cdot\\hat{\\mathbf S}$'},
          {l:'det(S_n - ħ/2 I) = 0', w:'$+\\hbar/2$ ist Eigenwert',
            why:{q:'Was zeigt diese Zeile?', opts:['$+\\hbar/2$ ist für jede Richtung ein Eigenwert von $\\hat S_{\\hat n}$.', 'Der Bloch-Zustand $\\chi$ ist für jede Richtung normiert.', 'Die Matrix $\\hat S_{\\hat n}$ hat die Determinante null.'], a:0, ex:'Eigenwerte sind Nullstellen von $\\det(\\hat S_{\\hat n} - \\lambda\\mathbb 1)$. Die Gleichung gilt für alle $\\theta, \\varphi$. Ebenso ist $-\\hbar/2$ Eigenwert.'}},
          {l:'S_n χ = ħ/2 χ', w:'Bloch-Zustand ist Eigenzustand'},
          {l:'|⟨↑|χ⟩|^2 = cos(θ/2)^2', w:'Messung in $z$'},
          {l:'= (1 + cos(θ))/2',
            why:{q:'Was folgt daraus für $\\theta = \\pi/2$?', opts:['$P = \\frac12$: Senkrechte Richtungen sind nicht orthogonal.', '$P = 0$: Senkrechte Richtungen sind orthogonal.', '$P = 1$: Der Spin zeigt sicher nach oben.'], a:0, ex:'$\\frac12(1 + \\cos 90^\\circ) = \\frac12$. Null wird $P$ erst bei $\\theta = \\pi$, also für die Gegenrichtung.'}},
          {l:'⟨↑|+x⟩ = 1/sqrt(2)', w:'$\\theta = \\pi/2$, $\\varphi = 0$'}
        ]},
      q:[
        {q:'Der Spin ist $|{+x}\\rangle$. Gemessen wird längs $\\hat n$ in der $x$-$z$-Ebene, $60^\\circ$ von der $x$-Achse entfernt. Wie groß ist $P(+\\hbar/2)$?', opts:['$3/4$', '$1/4$', '$1/2$'], a:0, ex:'$\\cos^2\\frac{60^\\circ}{2} = \\cos^2 30^\\circ = \\frac34$.'},
        {q:'Welcher Zustand ist orthogonal zu $|{+y}\\rangle$?', opts:['$|{-y}\\rangle$', '$|{+x}\\rangle$', '$|\\uparrow\\rangle$'], a:0, ex:'$\\langle{-y}|{+y}\\rangle = \\frac12(1 + i\\cdot i) = 0$. $|{+x}\\rangle$ und $|\\uparrow\\rangle$ gehören zu Richtungen senkrecht zu $y$; sie haben mit $|{+y}\\rangle$ den Überlapp-Betrag $1/\\sqrt2$.'}
      ]},
    {id:'spin-t5', title:'Messfolgen: Stern-Gerlach-Magnete hintereinander',
      text:'**Ein Magnet präpariert.** Blendet man hinter einem $z$-Magneten den unteren Teilstrahl aus, sind alle durchgelassenen Teilchen im Zustand $|\\uparrow\\rangle$. Das ist die Zustandsreduktion aus dem [[lex:messpostulat|Messpostulat]] (Thema 6): Nach einer Messung mit Ergebnis $a$ ist das System im Eigenzustand zu $a$. Ein zweiter $z$-Magnet bestätigt das: Alle Teilchen kommen oben heraus.\n\n**Regel für Folgen.** Jeder Magnet mit ausgeblendetem Teilstrahl ist ein Filter: eine Messung mit anschließender Präparation. Für eine Folge von Filtern multiplizieren sich die Wahrscheinlichkeiten,\n\n$$P(\\text{Folge}) = |\\langle a_1|\\chi\\rangle|^2\\cdot|\\langle a_2|a_1\\rangle|^2\\cdot|\\langle a_3|a_2\\rangle|^2\\cdots$$\n\nJeder Faktor ist eine [[lex:born|Bornsche Wahrscheinlichkeit]] für den Zustand, den der vorige Filter hergestellt hat.\n\n**Das klassische Rätsel.** Erst ein $z$-Filter ($\\uparrow$), dann ein $x$-Filter ($+x$), dann ein $z$-Magnet. Klassisch würde man sagen: Die Teilchen „haben“ jetzt $S_z = +\\hbar/2$ und dazu $S_x = +\\hbar/2$; am Ende kommen alle oben heraus. Die Quantenmechanik sagt etwas anderes. Der $x$-Filter präpariert $|{+x}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle + |\\downarrow\\rangle)$, und die Information über $S_z$ ist gelöscht. Am letzten Magneten kommt die Hälfte unten heraus. Bezogen auf die Teilchen hinter dem ersten Filter sind es $\\frac12\\cdot\\frac12 = \\frac14$; die Herleitung unten rechnet das vor.\n\nDer Grund ist $[\\hat S_x, \\hat S_z] \\ne 0$. Es gibt keinen gemeinsamen Eigenzustand, also keinen Zustand mit festem $S_x$ *und* festem $S_z$. Der $x$-Filter stört die $z$-Information nicht „mechanisch“, er ersetzt den Zustand.\n\n**Ohne Ausblenden.** Lässt man hinter dem $x$-Magneten beide Teilstrahlen weiterlaufen und schickt jeden in einen eigenen $z$-Magneten, landen insgesamt $\\frac12\\cdot\\frac12 + \\frac12\\cdot\\frac12 = \\frac12$ aller Teilchen bei $\\downarrow$. Die getrennten Wege wirken wie eine Messung von $S_x$, auch ohne Detektor. Erst wenn man die beiden Teilstrahlen so zusammenführt, dass die Wege prinzipiell nicht mehr unterscheidbar sind, entsteht wieder $|\\uparrow\\rangle$, und $\\downarrow$ kommt nicht mehr vor. Das ist ein Gedankenexperiment und technisch sehr schwierig; $S_x$ ist dann eben nicht gemessen worden.\n\n**Typische Fehlvorstellungen.** (1) „Nach dem $x$-Filter ist der Spin $\\uparrow$ und $+x$ zugleich.“ Einen solchen Zustand gibt es nicht. (2) „Ein Magnet in $x$-Richtung ändert $S_z$ nicht, weil er nur in $x$ ablenkt.“ Er ändert den Zustand und damit die Verteilung der Messwerte von $S_z$. (3) „Was am Ende herauskommt, hängt nur vom Anfangszustand ab.“ Die Verteilung *hinter* dem letzten Filter hängt nur vom zuletzt präparierten Zustand ab. Der Anteil am ursprünglichen Strahl ist dagegen das Produkt aller Filterwahrscheinlichkeiten.\n\n**Mini-Beispiel.** $z$-Filter $\\uparrow$, dann $y$-Filter $+y$, dann $x$-Magnet: $P(+x) = |\\langle{+x}|{+y}\\rangle|^2 = \\frac12$ für die Teilchen hinter dem $y$-Filter, denn $x$ und $y$ stehen senkrecht ($\\alpha = 90^\\circ$).',
      derive:{ctx:SPIN(),
        lines:[
          {l:'P = |⟨+x|↑⟩|^2 |⟨↓|+x⟩|^2', w:'Filter $+x$, danach Kanal $\\downarrow$',
            why:{q:'Warum steht im zweiten Faktor $|{+x}\\rangle$ und nicht $|\\uparrow\\rangle$?', opts:['Der $x$-Filter hat den Zustand $|{+x}\\rangle$ präpariert.', 'Weil $|\\uparrow\\rangle$ und $|{+x}\\rangle$ dasselbe bedeuten.', 'Weil die Reihenfolge der Faktoren beliebig ist.'], a:0, ex:'Jeder Faktor gehört zum zuletzt präparierten Zustand. Hinter dem $x$-Filter ist das $|{+x}\\rangle$, nicht mehr $|\\uparrow\\rangle$.'}},
          {l:'= 1/2 · 1/2', w:'$|\\langle{+x}|\\uparrow\\rangle| = |\\langle\\downarrow|{+x}\\rangle| = 1/\\sqrt2$'},
          {l:'= 1/4'},
          {l:'|⟨↓|↑⟩|^2 = 0', w:'ohne $x$-Filter',
            why:{q:'Was zeigt der Vergleich mit dieser Zeile?', opts:['Erst der $x$-Filter macht $\\downarrow$ wieder möglich.', 'Der $x$-Filter halbiert nur die Zahl der Teilchen.', 'Der $z$-Filter lässt immer einige $\\downarrow$ durch.'], a:0, ex:'Ohne $x$-Filter kommt hinter dem $z$-Filter nie $\\downarrow$ heraus. Mit $x$-Filter ein Viertel – obwohl ein Filter nur Teilchen entfernt.'}}
        ]},
      q:[
        {q:'Hinter einem $z$-Filter ($\\uparrow$) steht ein $y$-Filter ($+y$), dann ein $x$-Magnet. Welcher Anteil der Teilchen *hinter dem $y$-Filter* landet bei $+x$?', opts:['$1/2$', '$1/4$', '$1$'], a:0, ex:'Der $y$-Filter präpariert $|{+y}\\rangle$. Dann ist $P(+x) = |\\langle{+x}|{+y}\\rangle|^2 = \\frac12$. Die frühere $z$-Information spielt keine Rolle.'},
        {q:'Warum gibt es nach einem $z$-Filter und einem $x$-Filter wieder Teilchen mit $S_z = -\\hbar/2$?', opts:['Der $x$-Filter präpariert $|{+x}\\rangle$, darin ist $P(\\downarrow) = \\frac12$.', 'Der $x$-Magnet dreht die Spins mechanisch um.', 'Der $z$-Filter lässt immer einige falsche Teilchen durch.'], a:0, ex:'Ein Filter präpariert einen neuen Zustand. $|{+x}\\rangle$ enthält $|\\downarrow\\rangle$ mit Amplitude $1/\\sqrt2$.'}
      ]},
    {id:'spin-t6', title:'Spin im Magnetfeld: Larmor-Präzession und Drehung um 2π',
      text:'**Hamilton-Operator.** Ein Moment im homogenen Feld $\\mathbf B = B\\hat z$ hat die Energie $-\\boldsymbol\\mu\\cdot\\mathbf B$. Mit $\\hat{\\boldsymbol\\mu} = \\gamma\\hat{\\mathbf S}$ ist\n\n$$\\hat H = -\\gamma B\\,\\hat S_z = \\omega\\,\\hat S_z,\\qquad \\omega = -\\gamma B.$$\n\nDie Eigenzustände sind $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ mit $E = \\pm\\hbar\\omega/2$. Für das Elektron ist $\\gamma < 0$, also $\\omega > 0$, und $|\\uparrow\\rangle$ ist der energetisch höhere Zustand.\n\n**Zeitentwicklung.** Wie in Thema 2 bekommt jeder Energieanteil seinen eigenen Phasenfaktor ([[lex:zeitentwicklung|Zeitentwicklung]]). Mit $|\\chi(0)\\rangle = a|\\uparrow\\rangle + b|\\downarrow\\rangle$ ist\n\n$$|\\chi(t)\\rangle = e^{-i\\hat Ht/\\hbar}|\\chi(0)\\rangle = a\\,e^{-i\\omega t/2}|\\uparrow\\rangle + b\\,e^{i\\omega t/2}|\\downarrow\\rangle.$$\n\n$|a|^2$ und $|b|^2$ bleiben fest, also auch $\\langle S_z\\rangle$. Es ändert sich die relative Phase: Klammert man $e^{-i\\omega t/2}$ aus, wird aus $e^{i\\varphi}$ der Faktor $e^{i(\\varphi + \\omega t)}$. Auf der Bloch-Kugel wächst also $\\varphi$ gleichmäßig. Der Pfeil läuft mit der Winkelgeschwindigkeit $\\omega$ um die Feldrichtung: die [[lex:larmor|Larmor-Präzession]]. Für den Start $|{+x}\\rangle$ zeigt die Herleitung unten $\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t$ und $\\langle S_y\\rangle = \\frac\\hbar2\\sin\\omega t$.\n\n**Anwendung: Kernspinresonanz.** Protonen haben ebenfalls Spin ½. Ihre Larmor-Frequenz $\\omega/2\\pi$ ist etwa 42,6 MHz pro Tesla. Ein Radiofrequenzpuls mit genau dieser Frequenz kippt die Spins aus der Feldrichtung. Die präzedierende Magnetisierung induziert dann in einer Spule ein messbares Signal. Darauf beruhen NMR-Spektroskopie und Magnetresonanztomographie.\n\n**Drehung um $2\\pi$.** Der Operator $e^{-i\\alpha\\hat S_z/\\hbar}$ dreht den Spin um den Winkel $\\alpha$ um die $z$-Achse ([[lex:spin-drehung|Drehoperator]]); die Larmor-Präzession ist genau diese Drehung mit $\\alpha = \\omega t$. Für $\\alpha = 2\\pi$ erwartet man klassisch: alles wie vorher. Tatsächlich ist\n\n$$e^{-i2\\pi\\hat S_z/\\hbar} = \\begin{pmatrix}e^{-i\\pi}&0\\\\0&e^{i\\pi}\\end{pmatrix} = -\\mathbb 1.$$\n\nJeder Spinor bekommt den Faktor $-1$; erst nach $4\\pi$ ist er wieder er selbst. Für ein einzelnes Teilchen ist das eine globale Phase und ändert keine Wahrscheinlichkeit. Sichtbar wird das Vorzeichen, wenn man nur einen Teil einer Welle dreht und mit dem ungedrehten Teil überlagert. Das zeigten Neutronen-Interferometer 1975 (Rauch et al.; Werner et al.): Mit einem Magnetfeld auf einem der beiden Wege schwankte die Intensität mit dem Drehwinkel mit der Periode $4\\pi$, nicht $2\\pi$.\n\n**Typische Fehlvorstellung.** „Auch $|\\uparrow\\rangle$ präzediert im Feld $B\\hat z$.“ Nein: $|\\uparrow\\rangle$ ist Eigenzustand von $\\hat H$, also stationär. Nur eine globale Phase ändert sich, und $\\langle\\mathbf S\\rangle = (0, 0, \\hbar/2)$ bleibt fest. Präzession gibt es nur für Überlagerungen von $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$.',
      derive:{ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)'}, state:'χ'}),
        lines:[
          {l:'e^(-iHt/ħ) |+x⟩ = 1/sqrt(2) (e^(-iHt/ħ)|↑⟩ + e^(-iHt/ħ)|↓⟩)', w:'$e^{-i\\hat Ht/\\hbar}$ ist linear'},
          {l:'= 1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)', w:'$E = \\pm\\hbar\\omega/2$',
            why:{q:'Warum bekommt $|\\downarrow\\rangle$ den Faktor $e^{+i\\omega t/2}$?', opts:['Seine Energie ist $-\\hbar\\omega/2$, und $e^{-iEt/\\hbar}$ wird $e^{+i\\omega t/2}$.', 'Weil $|\\downarrow\\rangle$ nach unten zeigt und rückwärts läuft.', 'Weil im Bra $\\langle\\downarrow|$ konjugiert wird.'], a:0, ex:'Auf einen Eigenzustand wirkt $e^{-i\\hat Ht/\\hbar}$ als Zahl $e^{-iEt/\\hbar}$. Mit $E = -\\hbar\\omega/2$ ist das $e^{+i\\omega t/2}$.'}},
          {l:'⟨S_x⟩ = ħ/2 cos(ωt)', w:'$\\frac\\hbar2(a^*b + b^*a)$'},
          {l:'⟨S_y⟩ = ħ/2 sin(ωt)', w:'$\\frac\\hbar2(-ia^*b + ib^*a)$'},
          {l:'⟨S_z⟩ = 0', w:'$|a|^2 = |b|^2$ bleibt',
            why:{q:'Warum ändert sich $\\langle S_z\\rangle$ nicht?', opts:['Die Beträge $|a|$, $|b|$ bleiben fest, nur Phasen ändern sich.', 'Weil das Feld in $z$-Richtung keine Kraft ausübt.', 'Weil $\\langle S_z\\rangle$ für Spin ½ immer null ist.'], a:0, ex:'$\\hat S_z$ vertauscht mit $\\hat H = \\omega\\hat S_z$; die Wahrscheinlichkeiten $|a|^2, |b|^2$ sind zeitlich konstant.'}},
          {l:'e^(-i 2π S_z/ħ) = (e^(-iπ), 0; 0, e^(iπ))', w:'Drehung um $2\\pi$'},
          {l:'= -I',
            why:{q:'Ändert der Faktor $-1$ eine Messwahrscheinlichkeit am einzelnen Spin?', opts:['Nein, er ist eine globale Phase; nur Interferenz zeigt ihn.', 'Ja, nach $2\\pi$ zeigt der Spin in die Gegenrichtung.', 'Ja, $\\langle S_z\\rangle$ wechselt das Vorzeichen.'], a:0, ex:'$|\\langle\\varphi|(-\\chi)\\rangle|^2 = |\\langle\\varphi|\\chi\\rangle|^2$. Das Vorzeichen zeigt sich nur relativ zu einem ungedrehten Teil.'}}
        ]},
      q:[
        {q:'Start $|{+x}\\rangle$, $\\hat H = \\omega\\hat S_z$. Wann ist der Spin zum ersten Mal in $|{-x}\\rangle$ (bis auf eine Phase)?', opts:['bei $t = \\pi/\\omega$', 'bei $t = 2\\pi/\\omega$', 'bei $t = \\pi/(2\\omega)$'], a:0, ex:'$\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t = -\\frac\\hbar2$ bei $\\omega t = \\pi$: Der Pfeil hat sich um $180^\\circ$ gedreht.'},
        {q:'Der Spin ist $|\\downarrow\\rangle$ im Feld $B\\hat z$. Was passiert mit $\\langle\\mathbf S\\rangle$?', opts:['bleibt $(0, 0, -\\hbar/2)$', 'präzediert mit $\\omega$ um $z$', 'klappt langsam nach oben'], a:0, ex:'$|\\downarrow\\rangle$ ist Eigenzustand von $\\hat H$ und damit stationär.'}
      ]}
  ],
  example:{
    title:'Wahrscheinlichkeit für $S_y = +\\hbar/2$',
    text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt3}\\left(|\\uparrow\\rangle + \\sqrt2\\,i\\,|\\downarrow\\rangle\\right)$. Mit welcher Wahrscheinlichkeit ergibt eine Messung von $S_y$ den Wert $+\\hbar/2$? Es gilt $|{+y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{i}$.',
    ctx:SPIN({states:{χ:'1/sqrt(3)(|↑⟩ + sqrt(2) i|↓⟩)'}, state:'χ'}),
    lines:[
      {l:'P = |⟨+y|χ⟩|^2', why:{q:'Warum diese Formel?', opts:['Bornsche Regel: Betragsquadrat der Projektion', 'Weil der Erwartungswert $\\langle S_y\\rangle$ gleich $P$ ist', 'Weil $|{+y}\\rangle$ auf $1$ normiert ist'], a:0, ex:'Bornsche Regel: $P(+\\hbar/2) = |\\langle{+y}|\\chi\\rangle|^2$.'}},
      {l:'= |1/sqrt(2) (1, -i) · 1/sqrt(3) (1; sqrt(2) i)|^2', why:{q:'Warum steht im Bra $(1, -i)$ und nicht $(1, i)$?', opts:['Das Bra enthält die konjugierten Komponenten des Kets.', 'Das ist eine Konvention von Stern und Gerlach.', 'Weil $\\sigma_y$ oben rechts ein Minuszeichen hat.'], a:0, ex:'$\\langle{+y}| = (|{+y}\\rangle)^\\dagger = \\frac{1}{\\sqrt2}(1, -i)$.'}},
      {l:'= |(1 + sqrt(2))/sqrt(6)|^2', why:{q:'Woher kommt $1 + \\sqrt2$?', opts:['aus $1\\cdot 1 + (-i)\\cdot\\sqrt2\\,i$', 'aus $1\\cdot 1 + i\\cdot\\sqrt2\\,i$, als Betrag', 'aus $|i| = 1$, man lässt $i$ weg'], a:0, ex:'$(-i)\\cdot i = -i^2 = 1$, also $1 + \\sqrt2$. Mit $i\\cdot i = -1$ (ohne Konjugation) käme $1 - \\sqrt2$ heraus.'}},
      {l:'= (3 + 2 sqrt(2))/6', why:{q:'Ist das Ergebnis plausibel?', opts:['Ja, es liegt zwischen 0 und 1 (etwa 0,97).', 'Nein, für Spin ist jede Wahrscheinlichkeit 1/2.', 'Nein, eine Wahrscheinlichkeit kann nicht irrational sein.'], a:0, ex:'$(1+\\sqrt2)^2 = 3 + 2\\sqrt2$; geteilt durch 6 ergibt $\\approx 0{,}971$. Der Zustand liegt nahe bei $|{+y}\\rangle$.'}}
    ],
    faded:{id:'spin-fade', title:'Jetzt du: Wahrscheinlichkeit für $S_x = +\\hbar/2$', text:'Gleicher Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt3}(|\\uparrow\\rangle + \\sqrt2\\,i|\\downarrow\\rangle)$, jetzt mit $|{+x}\\rangle = \\frac{1}{\\sqrt2}\\binom11$.',
      ctx:SPIN({states:{χ:'1/sqrt(3)(|↑⟩ + sqrt(2) i|↓⟩)'}, state:'χ'}),
      given:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(3) (1; sqrt(2) i)|^2'],
      goals:[{id:'a', prompt:'Berechne $P(S_x = +\\hbar/2)$.', type:'value', target:'1/2', hints:['Bilde das Skalarprodukt Zeile mal Spalte; hier gibt es nichts zu konjugieren, weil $\\langle{+x}|$ reell ist.', 'Das Skalarprodukt ist $(1 + \\sqrt2\\,i)/\\sqrt6$.', '$|1 + \\sqrt2\\,i|^2 = 1 + 2$.'],
        model:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(3) (1; sqrt(2) i)|^2', {l:'= |1 + sqrt(2) i|^2/6', gap:'= |▢|^2/6'}, '= 1/2']}]}
  },
  puzzle:{
    title:'Viele Filter drehen den Spin um',
    text:'Ein $z$-Filter lässt nur $\\uparrow$ durch. Ganz am Ende steht ein Filter, der nur $\\downarrow$ durchlässt. Ohne etwas dazwischen kommt kein Teilchen durch; mit einem $x$-Filter dazwischen ist es ein Viertel.\n\nJetzt stellst du $N - 1$ Filter dazwischen. Ihre Richtungen liegen in der $x$-$z$-Ebene und drehen sich in gleichen Schritten von $+z$ nach $-z$, jeder um $180^\\circ/N$ gegen den vorigen.',
    q:{q:'Welcher Anteil der Teilchen hinter dem ersten Filter kommt für sehr großes $N$ durch den letzten?', opts:['fast alle', 'keiner, $\\uparrow$ und $\\downarrow$ sind orthogonal', 'ein Viertel, wie mit einem Zwischenfilter', 'die Hälfte'], a:0, ex:'$P_N = \\cos^{2N}\\left(\\frac{\\pi}{2N}\\right) \\to 1$.'},
    reveal:'Benachbarte Filterrichtungen bilden den Winkel $\\alpha = 180^\\circ/N$. Ein Filter lässt den Zustand des vorigen mit $|\\langle\\hat n_{k+1}|\\hat n_k\\rangle|^2 = \\cos^2(\\alpha/2)$ durch (halber Winkel im Hilbertraum, Abschnitt 4). Für $N$ Schritte ist\n\n$$P_N = \\cos^{2N}\\left(\\frac{\\pi}{2N}\\right):\\qquad P_1 = 0,\\quad P_2 = \\tfrac14,\\quad P_3 = \\left(\\tfrac34\\right)^3 \\approx 0{,}42,\\quad P_{10} \\approx 0{,}78.$$\n\nFür große $N$ ist $\\ln P_N \\approx -2N\\cdot\\frac12\\left(\\frac{\\pi}{2N}\\right)^2 = -\\frac{\\pi^2}{4N} \\to 0$, also $P_N \\to 1$. Viele kleine Schritte führen den Spin von $\\uparrow$ nach $\\downarrow$, fast ohne Verlust. Jeder Filter ist eine Messung, die neu präpariert – kein passives Ablesen eines Wertes, den der Spin schon hatte.'
  },
  clarify:{
    core:'Der Spin eines Elektrons lebt in einem zweidimensionalen Hilbertraum mit Basis $|\\uparrow\\rangle = \\binom10$, $|\\downarrow\\rangle = \\binom01$. Die Operatoren sind $\\hat S_i = \\frac\\hbar2\\sigma_i$ mit den Pauli-Matrizen\n\n$$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix},\\quad \\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix},\\quad \\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}.$$\n\nJede Komponente hat die Messwerte $\\pm\\hbar/2$; $\\hat S^2 = \\frac34\\hbar^2$. Ein allgemeiner Zustand ist $|\\chi\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ – ein Punkt auf der Bloch-Kugel und zugleich der Eigenzustand von $\\hat S_{\\hat n}$ zu $+\\hbar/2$ für die Richtung $\\hat n(\\theta, \\varphi)$.',
    keys:[
      'Eigenzustände: $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle \\pm |\\downarrow\\rangle)$, $|{\\pm y}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle \\pm i|\\downarrow\\rangle)$.',
      'Wahrscheinlichkeit: $P(\\pm\\hbar/2) = |\\langle\\pm n|\\chi\\rangle|^2$; im Bra stehen die konjugierten Komponenten.',
      'Zwei Richtungen mit Winkel $\\alpha$: $|\\langle{+\\hat m}|{+\\hat n}\\rangle|^2 = \\cos^2\\frac\\alpha2$. Orthogonal sind nur Zustände zu entgegengesetzten Richtungen.',
      '$[\\hat S_x, \\hat S_y] = i\\hbar\\hat S_z$ (zyklisch) und $\\sigma_i^2 = \\mathbb 1$, $\\sigma_x\\sigma_y = i\\sigma_z$.',
      'Messfolgen: Jeder Filter präpariert einen neuen Zustand; die Wahrscheinlichkeiten multiplizieren sich.',
      'Nur relative Phasen zählen: $e^{i\\alpha}|\\chi\\rangle$ ist derselbe Zustand, $|\\uparrow\\rangle + |\\downarrow\\rangle$ und $|\\uparrow\\rangle - |\\downarrow\\rangle$ sind verschieden.',
      'Im Feld $B\\hat z$: $\\hat H = \\omega\\hat S_z$; der Spin präzediert mit $\\omega$ um die $z$-Achse: $\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t$ für den Start $|{+x}\\rangle$. Eine Drehung um $2\\pi$ gibt den Faktor $-1$.'
    ],
    errors:[
      'Im Bra die Komponenten nicht konjugieren – bei $|{\\pm y}\\rangle$ ergibt das falsche Wahrscheinlichkeiten.',
      'Senkrechte Raumrichtungen für orthogonale Zustände halten: $\\langle\\uparrow|{+x}\\rangle = 1/\\sqrt2$, nicht $0$.',
      '$\\langle S_x\\rangle$ für einen Messwert halten: Gemessen wird immer $\\pm\\hbar/2$, der Mittelwert liegt dazwischen.',
      '$\\sigma_i$ und $\\hat S_i$ verwechseln: Der Faktor $\\hbar/2$ fehlt dann in jedem Ergebnis.',
      'Glauben, nach einer $x$-Messung sei die frühere $z$-Information noch vorhanden.',
      '$\\hat S_x|\\chi\\rangle$ für den Zustand nach einer Messung von $S_x$ halten.'
    ],
    more:[{title:'Spin im Magnetfeld', text:'Das magnetische Moment ist $\\hat{\\boldsymbol\\mu} = \\gamma\\hat{\\mathbf S}$ (für das Elektron $\\gamma \\approx -e/m_e$). Im Feld $B\\hat z$ ist $\\hat H = -\\gamma B\\hat S_z = \\omega\\hat S_z$ mit $\\omega = -\\gamma B$. Ein inhomogenes Feld lenkt die beiden Spinzustände verschieden ab – das ist der Stern-Gerlach-Versuch.'}],
    checks:[
      {q:'Welchen Wert hat $\\langle S_z\\rangle$ im Zustand $|{+x}\\rangle$?', opts:['$0$', '$+\\hbar/2$', '$\\hbar/\\sqrt2$'], a:0, ex:'$P(\\uparrow) = P(\\downarrow) = \\tfrac12$, also $\\langle S_z\\rangle = \\frac\\hbar2\\cdot\\frac12 - \\frac\\hbar2\\cdot\\frac12 = 0$.'},
      {q:'Was ist $\\sigma_y^2$?', opts:['$\\mathbb 1$', '$-\\mathbb 1$', '$0$'], a:0, ex:'Für jede Pauli-Matrix gilt $\\sigma_i^2 = \\mathbb 1$ – passend zu den Eigenwerten $\\pm1$.'}
    ]
  },
  lab:{type:'spin', title:'Bloch-Kugel und Stern-Gerlach',
    text:'Der Zustand $\\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ ist ein Pfeil auf der Kugel. Die Balken zeigen die Wahrscheinlichkeiten für die Messwerte $+\\hbar/2$ in $z$, $x$ und $y$. Mit den Knöpfen schickst du 100 Teilchen durch einen Magneten.',
    predict:{q:'Gleich stellst du $\\theta = \\pi/2$ ein: Der Pfeil liegt in der waagerechten Ebene. Was zeigt der Magnet in $z$-Richtung nach 100 Teilchen?', opts:['ungefähr 50 × ↑ und 50 × ↓, mit Schwankungen', 'genau 50 × ↑ und 50 × ↓, jedes Mal', 'alle in der Mitte, weil $S_z = 0$ ist'], a:0, ex:'$P(\\uparrow) = \\cos^2\\frac\\pi4 = \\frac12$. Jedes Teilchen landet bei $\\uparrow$ oder $\\downarrow$, nie in der Mitte; erst der Mittelwert ist $\\langle S_z\\rangle = 0$. Die Zählung schwankt zufällig um 50.'},
    questions:[
      {q:'Stelle $\\theta = \\pi/2$ (≈ 1,57), $\\varphi = 0$ ein. Welcher Zustand ist das?', opts:['$|{+x}\\rangle$', '$|\\uparrow\\rangle$', '$|{+y}\\rangle$'], a:0, ex:'$\\cos\\frac\\pi4|\\uparrow\\rangle + \\sin\\frac\\pi4|\\downarrow\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle + |\\downarrow\\rangle)$. Dann ist $P(+x) = 1$ und $P(\\uparrow z) = \\tfrac12$.'},
      {q:'Jetzt $\\theta = \\pi/2$, $\\varphi = \\pi/2$. Was zeigt der Magnet in $x$-Richtung nach 100 Teilchen ungefähr?', opts:['etwa 50 × + und 50 × −', 'fast alle 100 × +', 'etwa 75 × + und 25 × −'], a:0, ex:'Das ist $|{+y}\\rangle$ mit $P(+x) = \\tfrac12$. Die genauen Zahlen schwanken zufällig um 50.'}
    ],
    noPic:{q:'Ohne Bild: Der Spin ist im Zustand $|{-y}\\rangle$. Mit welcher Wahrscheinlichkeit misst man $S_z = +\\hbar/2$?', opts:['$1/2$', '$0$', '$1$'], a:0, ex:'$|\\langle\\uparrow|{-y}\\rangle|^2 = |1/\\sqrt2|^2 = 1/2$.'}},
  compare:{
    text:'Gesucht ist $\\langle S_x\\rangle$ für $|\\chi\\rangle = \\frac{1}{\\sqrt5}(2|\\uparrow\\rangle + |\\downarrow\\rangle)$. Zwei richtige Wege:',
    ctx:SPIN({states:{χ:'1/sqrt(5)(2|↑⟩ + |↓⟩)'}, state:'χ'}),
    A:{name:'Über die Wahrscheinlichkeiten', text:'$|\\langle{\\pm x}|\\chi\\rangle|^2 = |2 \\pm 1|^2/10$.', model:['⟨S_x⟩ = ħ/2 |⟨+x|χ⟩|^2 - ħ/2 |⟨-x|χ⟩|^2', '= ħ/2 · 9/10 - ħ/2 · 1/10', '= 2ħ/5']},
    B:{name:'Mit der Matrix', model:['⟨S_x⟩ = ⟨χ|S_x|χ⟩', '= ħ/2 · 1/5 (2, 1)(0, 1; 1, 0)(2; 1)', '= ħ/2 · 4/5', '= 2ħ/5']},
    questions:[
      {q:'Wann ist Weg A bequemer?', opts:['wenn man die Verteilung der Messwerte ohnehin braucht', 'immer, denn er kommt ganz ohne Matrizen aus', 'nur wenn der Zustand Eigenzustand von $\\hat S_x$ ist'], a:0, ex:'Weg A liefert nebenbei die Wahrscheinlichkeiten. Er braucht aber die Eigenzustände. Weg B braucht keine Eigenzustände und funktioniert für jeden Operator.'},
      {q:'Für welchen Operator wäre Weg B deutlich einfacher als Weg A?', opts:['für $\\hat S_{\\hat n}$ in schräger Richtung', 'für $\\hat S_z$, mit Eigenzuständen $|\\uparrow\\rangle, |\\downarrow\\rangle$', 'für keinen, beide sind gleich aufwendig'], a:0, ex:'Für eine schräge Richtung müsste man bei Weg A erst die Eigenzustände ausrechnen. $\\langle\\chi|\\hat S_{\\hat n}|\\chi\\rangle$ braucht nur eine Matrixmultiplikation.'}
    ]
  },
  practice:[
    {id:'spin-p1', title:'Eigenzustände von $\\hat S_x$',
      text:'$\\hat S_x = \\frac\\hbar2\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{\\pm1}$.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\hat S_x|{+x}\\rangle = \\frac\\hbar2|{+x}\\rangle$.', type:'show', from:'S_x |+x⟩', to:'ħ/2 |+x⟩', points:2, ph:'S_x |+x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; 1)',
          hints:['Zu zeigen ist: $\\hat S_x$ angewendet auf die Spalte $|{+x}\\rangle$ ergibt ein Vielfaches derselben Spalte.', 'Schreib $\\hat S_x$ als Matrix und $|{+x}\\rangle$ als Spalte. Matrix mal Spalte: $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}\\binom ab = \\binom ba$.', 'Erste Zeile: `S_x |+x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; 1)`. Was ergibt das Produkt?'],
          model:['S_x |+x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; 1)', '= ħ/2 · 1/sqrt(2) (1; 1)', '= ħ/2 |+x⟩']},
        {id:'b', prompt:'b) Zeige $\\hat S_x|{-x}\\rangle = -\\frac\\hbar2|{-x}\\rangle$.', type:'show', from:'S_x |-x⟩', to:'-ħ/2 |-x⟩', points:2,
          hints:['Wie in a), jetzt mit $|{-x}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{-1}$.', '$\\sigma_x$ vertauscht die beiden Komponenten.', 'Nach dem Vertauschen steht $\\frac{1}{\\sqrt2}\\binom{-1}{1}$ da – klammere $-1$ aus.'],
          model:['S_x |-x⟩ = ħ/2 (0, 1; 1, 0) · 1/sqrt(2) (1; -1)', '= ħ/2 · 1/sqrt(2) (-1; 1)', '= -ħ/2 |-x⟩']}
      ]},
    {id:'spin-p2', title:'Normieren, messen, mitteln',
      text:'Der Spin ist im Zustand $|\\chi\\rangle = A\\,(2|\\uparrow\\rangle + |\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'A(2|↑⟩ + |↓⟩)'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, ph:'⟨χ|χ⟩ = 1',
          hints:['Normierung heißt $\\langle\\chi|\\chi\\rangle = 1$.', 'Für $|\\chi\\rangle = \\binom ab$ ist $\\langle\\chi|\\chi\\rangle = |a|^2 + |b|^2$.', 'Es folgt $|A|^2(4 + 1) = 1$ – jetzt nach $A$ auflösen.'],
          model:['⟨χ|χ⟩ = 1', '|A|^2 (4 + 1) = 1', 'A = 1/sqrt(5)']},
        {id:'b', prompt:'b) Mit welcher Wahrscheinlichkeit misst man $S_x = +\\hbar/2$?', type:'value', target:'9/10', points:2, ph:'P = |⟨+x|χ⟩|^2',
          hints:['Bornsche Regel: Projiziere auf den Eigenzustand von $\\hat S_x$ zum Messwert $+\\hbar/2$.', '$\\langle{+x}| = \\frac{1}{\\sqrt2}(1, 1)$.', 'Das Skalarprodukt ist $\\frac{1}{\\sqrt{10}}(2 + 1)$; jetzt quadrieren.'],
          model:['P = |⟨+x|χ⟩|^2', '= |1/sqrt(2) (1, 1) · 1/sqrt(5) (2; 1)|^2', '= 9/10']},
        {id:'c', prompt:'c) Berechne $\\langle S_x\\rangle$.', type:'value', target:'2ħ/5', points:2,
          hints:['Erwartungswert = Summe aus Messwert mal Wahrscheinlichkeit.', '$P(-x) = 1 - P(+x)$.', '$\\langle S_x\\rangle = \\frac\\hbar2\\cdot\\frac{9}{10} - \\frac\\hbar2\\cdot\\frac{1}{10}$.'],
          model:['⟨S_x⟩ = ħ/2 · 9/10 - ħ/2 · 1/10', '= 2ħ/5'],
          mistakes:[{expr:'9ħ/20', msg:'Das ist nur der Beitrag von $+\\hbar/2$. Der Messwert $-\\hbar/2$ mit Wahrscheinlichkeit $1/10$ fehlt.'}]}
      ]},
    {id:'spin-p3', title:'Stern-Gerlach-Folge',
      text:'Ein Strahl im Zustand $|\\uparrow\\rangle$ geht durch einen Magneten in $x$-Richtung; nur $+x$ geht weiter in einen Magneten in $z$-Richtung.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Welcher Anteil des ursprünglichen Strahls kommt am Ende im Kanal $\\downarrow$ an?', type:'value', target:'1/4', points:2, ph:'P = |⟨+x|↑⟩|^2 |⟨+x|↓⟩|^2',
          hints:['Jeder Magnet mit Ausblenden ist eine Messung, die einen neuen Zustand präpariert; die Wahrscheinlichkeiten multiplizieren sich.', 'Erst die Wahrscheinlichkeit für $+x$, dann für $\\downarrow$ im neu präparierten Zustand $|{+x}\\rangle$.', '$|\\langle\\downarrow|{+x}\\rangle|^2 = |\\langle{+x}|\\downarrow\\rangle|^2$; beide Faktoren sind $\\frac12$.'],
          model:['P = |⟨+x|↑⟩|^2 |⟨+x|↓⟩|^2', '= 1/2 · 1/2', '= 1/4']},
        {id:'b', prompt:'b) Und wenn der $x$-Magnet entfernt wird?', type:'value', target:'0', points:1,
          hints:['Ohne $x$-Magnet trifft $|\\uparrow\\rangle$ direkt auf den $z$-Magneten.', 'Gesucht ist $|\\langle\\downarrow|\\uparrow\\rangle|^2$.'],
          model:['|⟨↓|↑⟩|^2 = 0'], note:'Erst die Messung in $x$-Richtung macht $\\downarrow$ wieder möglich.'}
      ]},
    {id:'spin-p4', title:'Larmor-Präzession',
      text:'Im Magnetfeld $B\\hat z$ ist $\\hat H = \\omega\\hat S_z$. Zur Zeit $0$ ist der Spin im Zustand $|{+x}\\rangle$. Es gilt $\\hat H|\\uparrow\\rangle = \\frac{\\hbar\\omega}{2}|\\uparrow\\rangle$, $\\hat H|\\downarrow\\rangle = -\\frac{\\hbar\\omega}{2}|\\downarrow\\rangle$.',
      ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Zeige $e^{-i\\hat Ht/\\hbar}|{+x}\\rangle = \\frac{1}{\\sqrt2}\\left(e^{-i\\omega t/2}|\\uparrow\\rangle + e^{i\\omega t/2}|\\downarrow\\rangle\\right)$.', type:'show', from:'e^(-iHt/ħ) |+x⟩', to:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)', points:2,
          hints:['Zerlege $|{+x}\\rangle$ in Eigenzustände von $\\hat H$.', 'Auf einen Eigenzustand wirkt $e^{-i\\hat Ht/\\hbar}$ als Zahl $e^{-iEt/\\hbar}$.', '$E_\\uparrow = +\\hbar\\omega/2$ gibt $e^{-i\\omega t/2}$, $E_\\downarrow = -\\hbar\\omega/2$ gibt $e^{+i\\omega t/2}$.'],
          model:[{l:'e^(-iHt/ħ) |+x⟩ = 1/sqrt(2) (e^(-iHt/ħ)|↑⟩ + e^(-iHt/ħ)|↓⟩)', w:'linear'}, {l:'= 1/sqrt(2)(e^(-iωt/2)|↑⟩ + e^(iωt/2)|↓⟩)', w:'E = ±ħω/2'}]},
        {id:'b', prompt:'b) Berechne $\\langle S_x\\rangle(t)$ im Zustand $|\\chi(t)\\rangle$ aus a).', type:'value', target:'ħ/2 cos(ωt)', points:2, ph:'⟨S_x⟩ = ⟨χ|S_x|χ⟩',
          hints:['$\\langle S_x\\rangle = \\langle\\chi|\\hat S_x|\\chi\\rangle$ mit dem Zustand aus a).', 'Mit $|\\chi\\rangle = \\binom ab$ ist $\\langle\\chi|\\sigma_x|\\chi\\rangle = a^*b + b^*a$.', 'Hier ist $a^*b = \\frac12e^{i\\omega t}$; dazu kommt das komplex Konjugierte.'],
          model:['⟨S_x⟩ = ⟨χ|S_x|χ⟩', '= ħ/2 · 1/2 (e^(-iωt) + e^(iωt))', '= ħ/2 cos(ωt)']},
        {id:'c', prompt:'c) Berechne $\\langle S_y\\rangle(t)$.', type:'value', target:'ħ/2 sin(ωt)', points:2,
          hints:['Wie b), jetzt mit $\\sigma_y$.', '$\\langle\\chi|\\sigma_y|\\chi\\rangle = -ia^*b + ib^*a$.', 'Es ergibt sich $-\\frac i2(e^{i\\omega t} - e^{-i\\omega t})$ – Euler-Formel für den Sinus.'],
          model:['⟨S_y⟩ = ħ/2 · i/2 (e^(-iωt) - e^(iωt))', '= ħ/2 sin(ωt)'], note:'Der Erwartungswert des Spins dreht sich mit $\\omega$ um die $z$-Achse; $\\langle S_z\\rangle = 0$ bleibt.'}
      ]},
    {id:'spin-p5', title:'Pauli-Algebra',
      text:'$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$, $\\hat S_i = \\frac\\hbar2\\sigma_i$.',
      ctx:SPIN(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\sigma_x\\sigma_y = i\\sigma_z$.', type:'show', from:'σ_x σ_y', to:'i σ_z', points:2,
          hints:['Matrizen multiplizieren: Eintrag $(j, k)$ ist Zeile $j$ mal Spalte $k$.', 'Das Produkt ist diagonal; vergleiche es mit $i\\sigma_z = \\begin{pmatrix}i&0\\\\0&-i\\end{pmatrix}$.', 'Erste Zeile: `σ_x σ_y = (0, 1; 1, 0)(0, -i; i, 0)`.'],
          model:['σ_x σ_y = (0, 1; 1, 0)(0, -i; i, 0)', '= (i, 0; 0, -i)', '= i σ_z']},
        {id:'b', prompt:'b) Zeige damit $[\\hat S_x, \\hat S_y] = i\\hbar\\hat S_z$. (Es gilt $\\sigma_y\\sigma_x = -i\\sigma_z$.)', type:'show', from:'[S_x, S_y]', to:'iħ S_z', points:3,
          hints:['Setze $\\hat S_i = \\frac\\hbar2\\sigma_i$ in den Kommutator ein.', '$[\\hat S_x, \\hat S_y] = \\frac{\\hbar^2}{4}(\\sigma_x\\sigma_y - \\sigma_y\\sigma_x)$.', '$\\sigma_x\\sigma_y - \\sigma_y\\sigma_x = i\\sigma_z - (-i\\sigma_z) = 2i\\sigma_z$.'],
          model:['[S_x, S_y] = ħ^2/4 (σ_x σ_y - σ_y σ_x)', '= ħ^2/4 (i σ_z + i σ_z)', '= iħ S_z']}
      ]},
    {id:'spin-p6', title:'Spin in schräger Richtung',
      text:'Für die Richtung $\\hat n = (\\sin\\theta, 0, \\cos\\theta)$ ist $\\hat S_{\\hat n} = \\frac\\hbar2\\begin{pmatrix}\\cos\\theta & \\sin\\theta\\\\ \\sin\\theta & -\\cos\\theta\\end{pmatrix}$. In der Eingabe heißt die Matrix `S_n`, die Einheitsmatrix `I`.',
      ctx:SPIN({params:{θ:'pos'}, mat:{preset:'spin', mats:{S_n:'ħ/2 (cos(θ), sin(θ); sin(θ), -cos(θ))'}}, unknowns:{λ:{ref:'ħ/2', alt:['-ħ/2'], kind:'real'}}}),
      goals:[{id:'a', prompt:'Bestimme die Eigenwerte $\\lambda$ von $\\hat S_{\\hat n}$ (am Ende den positiven: $\\lambda = \\dots$).', type:'solve', unknown:'λ', points:3, ph:'det(S_n - λ I) = 0',
        hints:['Charakteristisches Polynom: $\\det(\\hat S_{\\hat n} - \\lambda\\mathbb 1) = 0$.', '$\\cos^2\\theta + \\sin^2\\theta = 1$.', 'Ausmultipliziert: $(\\frac\\hbar2\\cos\\theta - \\lambda)(-\\frac\\hbar2\\cos\\theta - \\lambda) - \\frac{\\hbar^2}{4}\\sin^2\\theta = \\lambda^2 - \\frac{\\hbar^2}{4}$.'],
        model:['det(S_n - λ I) = 0', 'det((ħ/2 cos(θ) - λ, ħ/2 sin(θ); ħ/2 sin(θ), -ħ/2 cos(θ) - λ)) = 0', 'λ^2 - ħ^2/4 = 0', 'λ = ħ/2'],
        note:'Der zweite Eigenwert ist $-\\hbar/2$: Jede Spinkomponente hat die Messwerte $\\pm\\hbar/2$, egal in welche Richtung.'}]}
  ],
  concept:[
    {id:'spin-c1', type:'mc2', seg:'spin-t4', lex:'spin-eigenzustaende',
      q:'Die Achsen $z$ und $x$ stehen im Raum senkrecht aufeinander. Was gilt für die Zustände $|{\\uparrow_z}\\rangle = |\\uparrow\\rangle$ und $|{\\uparrow_x}\\rangle = |{+x}\\rangle$?',
      opts:['$\\langle\\uparrow|{+x}\\rangle = 1/\\sqrt2$, sie sind nicht orthogonal', '$\\langle\\uparrow|{+x}\\rangle = 0$, sie sind orthogonal', '$\\langle\\uparrow|{+x}\\rangle = 1$, sie sind gleich'], a:0,
      ex:'$\\langle\\uparrow|{+x}\\rangle = (1, 0)\\cdot\\frac{1}{\\sqrt2}\\binom11 = \\frac{1}{\\sqrt2}$. Eine Messung von $S_z$ an $|{+x}\\rangle$ gibt $\\uparrow$ mit Wahrscheinlichkeit $\\frac12$, nicht $0$.',
      reason:{q:'Warum?', opts:['Orthogonal sind Spinzustände nur zu entgegengesetzten Richtungen.', 'Senkrechte Raumrichtungen geben immer orthogonale Zustände.', 'Zwei verschiedene Spinzustände sind nie orthogonal.'], a:0, ex:'$|\\langle{+\\hat m}|{+\\hat n}\\rangle|^2 = \\cos^2\\frac\\alpha2$: null erst für $\\alpha = 180^\\circ$. Der Hilbertraum $\\mathbb C^2$ ist nicht der Ortsraum; $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ sind orthogonal.'}},
    {id:'spin-c2', type:'dialog', seg:'spin-t2',
      text:'Gesucht ist ein Zustand, der zu $|\\uparrow\\rangle$ orthogonal ist, und die Raumrichtung, zu der er gehört.',
      people:[{name:'Lena', says:'Orthogonal heißt senkrecht. Also gehört dazu jede Richtung in der $x$-$y$-Ebene, zum Beispiel $|{+x}\\rangle$.'},
        {name:'Jonas', says:'Orthogonal zu $|\\uparrow\\rangle$ ist nur $|\\downarrow\\rangle$, bis auf eine Phase. Dazu gehört die Richtung $-z$, also die Gegenrichtung.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. $\\langle\\uparrow|{+x}\\rangle = 1/\\sqrt2 \\ne 0$. Im $\\mathbb C^2$ gibt es zu $|\\uparrow\\rangle$ nur eine orthogonale Richtung, $|\\downarrow\\rangle$; auf der Bloch-Kugel ist das der Südpol. Lena überträgt „senkrecht im Raum“ auf den Hilbertraum.'},
    {id:'spin-c3', type:'mc', seg:'spin-t5', lex:'stern-gerlach',
      q:'Ein Strahl im Zustand $|\\uparrow\\rangle$ geht durch einen $x$-Magneten. **Beide** Teilstrahlen laufen weiter, jeder in einen eigenen $z$-Magneten. Welcher Anteil aller Teilchen landet insgesamt im Kanal $\\downarrow$?',
      opts:['$1/2$', '$0$', '$1/4$', '$1$'], a:0,
      ex:'Hinter dem $x$-Magneten sind die Wege getrennt: Je die Hälfte ist in $|{+x}\\rangle$ bzw. $|{-x}\\rangle$. In jedem $z$-Magneten landet die Hälfte bei $\\downarrow$: $\\frac12\\cdot\\frac12 + \\frac12\\cdot\\frac12 = \\frac12$. „$0$“ würde gelten, wenn der $x$-Magnet nichts gemessen hätte; „$1/4$“ ist das Ergebnis mit nur einem Teilstrahl.'},
    {id:'spin-c4', type:'mc2', seg:'spin-t2',
      q:'Unterscheiden sich $\\frac{1}{\\sqrt2}(|\\uparrow\\rangle + |\\downarrow\\rangle)$ und $\\frac{1}{\\sqrt2}(|\\uparrow\\rangle - |\\downarrow\\rangle)$ physikalisch?',
      opts:['ja, eine Messung von $S_x$ unterscheidet sie sicher', 'nein, sie haben gleiche Wahrscheinlichkeiten für $S_z$', 'nein, sie unterscheiden sich nur um eine Phase'], a:0,
      ex:'Es sind $|{+x}\\rangle$ und $|{-x}\\rangle$. Sie sind orthogonal; eine Messung von $S_x$ ergibt für den einen sicher $+\\hbar/2$, für den anderen sicher $-\\hbar/2$.',
      reason:{q:'Warum?', opts:['Die relative Phase zwischen den Komponenten ist messbar.', 'Auch ein gemeinsamer Faktor $e^{i\\alpha}$ ist messbar.', 'Gleiche $|a|^2$ und $|b|^2$ heißen gleicher Zustand.'], a:0, ex:'Eine globale Phase ist unbeobachtbar, eine relative nicht: Sie bestimmt die Wahrscheinlichkeiten für $S_x$ und $S_y$.'}},
    {id:'spin-c5', type:'dialog', seg:'spin-t6',
      text:'Ein Spin wird mit $e^{-i2\\pi\\hat S_z/\\hbar}$ um $2\\pi$ um die $z$-Achse gedreht. Danach ist er im Zustand $-|\\chi\\rangle$.',
      people:[{name:'Lena', says:'Dann ist er in einem anderen Zustand als vorher. Mit genug Messungen an gleich präparierten Spins sollte man das Vorzeichen sehen.'},
        {name:'Jonas', says:'Alle Wahrscheinlichkeiten sind gleich geblieben. Das Vorzeichen zeigt sich nur, wenn der gedrehte Teil mit einem ungedrehten interferiert.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. $-1$ ist eine globale Phase: $|\\langle\\varphi|(-\\chi)\\rangle|^2 = |\\langle\\varphi|\\chi\\rangle|^2$ für jedes $\\varphi$. Im Neutronen-Interferometer wird nur der Teilstrahl auf einem Weg gedreht; dann ist $-1$ eine *relative* Phase und kehrt die Interferenz um.'},
    {id:'spin-c6', type:'mc', seg:'spin-t3', lex:'messpostulat',
      q:'Der Spin ist $|\\uparrow\\rangle$. Jemand rechnet $\\hat S_x|\\uparrow\\rangle = \\frac\\hbar2|\\downarrow\\rangle$ und folgert: „Nach einer Messung von $S_x$ ist der Spin in $|\\downarrow\\rangle$.“ Was stimmt?',
      opts:['danach $|{+x}\\rangle$ oder $|{-x}\\rangle$, je mit $P = \\frac12$', 'danach $|\\downarrow\\rangle$, wie die Rechnung zeigt', 'danach $|\\uparrow\\rangle$, $S_x$ ändert $S_z$ nicht'], a:0,
      ex:'Einen Operator anwenden ist keine Messung. Nach der Messung ist der Spin im Eigenzustand zum gefundenen Messwert, also $|{+x}\\rangle$ oder $|{-x}\\rangle$. $\\hat S_x|\\uparrow\\rangle$ ist nicht einmal normiert.'}
  ],
  final:[
    {aim:0, task:{id:'spin-f1', title:'Normieren und Eigenzustand prüfen', text:'$|\\chi\\rangle = A\\,(|\\uparrow\\rangle + 2i|\\downarrow\\rangle)$ und $|{-y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{-i}$.',
      ctx:SPIN({states:{χ:'A(|↑⟩ + 2i|↓⟩)'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, model:['⟨χ|χ⟩ = 1', '|A|^2 (1 + 4) = 1', 'A = 1/sqrt(5)']},
        {id:'b', prompt:'b) Zeige $\\hat S_y|{-y}\\rangle = -\\frac\\hbar2|{-y}\\rangle$.', type:'show', from:'S_y |-y⟩', to:'-ħ/2 |-y⟩', points:2,
          model:['S_y |-y⟩ = ħ/2 (0, -i; i, 0) · 1/sqrt(2) (1; -i)', '= ħ/2 · 1/sqrt(2) (-1; i)', '= -ħ/2 |-y⟩']}
      ]}},
    {aim:1, task:{id:'spin-f2', title:'Erwartungswert und Messfolge', text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt5}(2|\\uparrow\\rangle + |\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'1/sqrt(5)(2|↑⟩ + |↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle S_z\\rangle$.', type:'value', target:'3ħ/10', points:2, model:['⟨S_z⟩ = ħ/2 · 4/5 - ħ/2 · 1/5', '= 3ħ/10']},
        {id:'b', prompt:'b) Ein Strahl in diesem Zustand geht durch einen $x$-Magneten; nur $+x$ geht weiter in einen $z$-Magneten. Welcher Anteil des ursprünglichen Strahls landet am Ende bei $\\uparrow$?', type:'value', target:'9/20', points:2,
          model:['P = |⟨+x|χ⟩|^2 |⟨↑|+x⟩|^2', '= 9/10 · 1/2', '= 9/20']}
      ]}},
    {aim:2, task:{id:'spin-f3', title:'Präzession aus $|{+y}\\rangle$', text:'Im Feld $B\\hat z$ ist $\\hat H = \\omega\\hat S_z$. Zur Zeit $0$ ist der Spin im Zustand $|{+y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{i}$.',
      ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ + i e^(iωt/2)|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'Berechne $\\langle S_y\\rangle(t)$.', type:'value', target:'ħ/2 cos(ωt)', points:3,
          model:['|χ(t)⟩ = e^(-iHt/ħ) |+y⟩', '= 1/sqrt(2)(e^(-iωt/2)|↑⟩ + i e^(iωt/2)|↓⟩)', '⟨S_y⟩ = ⟨χ|S_y|χ⟩', '= ħ/2 · 1/2 (e^(iωt) + e^(-iωt))', '= ħ/2 cos(ωt)']}
      ]}},
    {aim:'k', id:'spin-fk1', type:'mc2',
      q:'Der Spin ist im Zustand $|\\uparrow\\rangle$, das Feld ist $B\\hat z$. Ändert sich $\\langle\\mathbf S\\rangle$ mit der Zeit?',
      opts:['nein, $\\langle\\mathbf S\\rangle = (0, 0, \\hbar/2)$ bleibt', 'ja, er präzediert mit $\\omega$ um $z$', 'ja, er klappt langsam nach unten'], a:0,
      ex:'$|\\uparrow\\rangle$ ist Eigenzustand von $\\hat H = \\omega\\hat S_z$. Es entsteht nur der Faktor $e^{-i\\omega t/2}$.',
      reason:{q:'Warum?', opts:['Ein Eigenzustand von $\\hat H$ ändert nur seine globale Phase.', 'Ein Feld in $z$-Richtung wirkt nicht auf den Spin.', 'Präzession gibt es nur in inhomogenen Feldern.'], a:0, ex:'Präzession entsteht durch die sich ändernde *relative* Phase zwischen $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$. Im Zustand $|\\uparrow\\rangle$ gibt es keinen $|\\downarrow\\rangle$-Anteil.'}},
    {aim:'k', id:'spin-fk2', type:'dialog',
      text:'Gefragt ist, ob $|{+x}\\rangle$ und $|{+y}\\rangle$ orthogonal sind.',
      people:[{name:'Lena', says:'Die $x$- und die $y$-Achse stehen senkrecht. Also ist $\\langle{+x}|{+y}\\rangle = 0$.'},
        {name:'Jonas', says:'$\\langle{+x}|{+y}\\rangle = \\frac12(1 + i) \\ne 0$. Orthogonal zu $|{+x}\\rangle$ ist nur $|{-x}\\rangle$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. $|\\langle{+x}|{+y}\\rangle|^2 = \\frac12 = \\cos^2 45^\\circ$. Senkrecht im Raum heißt nicht orthogonal im Hilbertraum.'}
  ],
  finalB:[
    {aim:0, task:{id:'spin-g1', title:'Normieren und Eigenzustand prüfen', text:'$|\\chi\\rangle = A\\,(2|\\uparrow\\rangle - i|\\downarrow\\rangle)$ und $|{+y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{i}$.',
      ctx:SPIN({states:{χ:'A(2|↑⟩ - i|↓⟩)'}, unknowns:{A:{ref:'1/sqrt(5)', alt:['-1/sqrt(5)']}}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A > 0$.', type:'solve', unknown:'A', points:2, model:['⟨χ|χ⟩ = 1', '|A|^2 (4 + 1) = 1', 'A = 1/sqrt(5)']},
        {id:'b', prompt:'b) Zeige $\\hat S_y|{+y}\\rangle = \\frac\\hbar2|{+y}\\rangle$.', type:'show', from:'S_y |+y⟩', to:'ħ/2 |+y⟩', points:2,
          model:['S_y |+y⟩ = ħ/2 (0, -i; i, 0) · 1/sqrt(2) (1; i)', '= ħ/2 · 1/sqrt(2) (1; i)', '= ħ/2 |+y⟩']}
      ]}},
    {aim:1, task:{id:'spin-g2', title:'Erwartungswert und Messfolge', text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt5}(|\\uparrow\\rangle + 2|\\downarrow\\rangle)$.',
      ctx:SPIN({states:{χ:'1/sqrt(5)(|↑⟩ + 2|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle S_z\\rangle$.', type:'value', target:'-3ħ/10', points:2, model:['⟨S_z⟩ = ħ/2 · 1/5 - ħ/2 · 4/5', '= -3ħ/10']},
        {id:'b', prompt:'b) Ein Strahl in diesem Zustand geht durch einen $x$-Magneten; nur $+x$ geht weiter in einen $z$-Magneten. Welcher Anteil des ursprünglichen Strahls landet am Ende bei $\\downarrow$?', type:'value', target:'9/20', points:2,
          model:['P = |⟨+x|χ⟩|^2 |⟨↓|+x⟩|^2', '= 9/10 · 1/2', '= 9/20']}
      ]}},
    {aim:2, task:{id:'spin-g3', title:'Präzession aus $|{-y}\\rangle$', text:'Im Feld $B\\hat z$ ist $\\hat H = \\omega\\hat S_z$. Zur Zeit $0$ ist der Spin im Zustand $|{-y}\\rangle = \\frac{1}{\\sqrt2}\\binom{1}{-i}$.',
      ctx:SPIN({params:{ω:'pos'}, mat:{preset:'spin', mats:{H:'ω S_z'}}, states:{χ:'1/sqrt(2)(e^(-iωt/2)|↑⟩ - i e^(iωt/2)|↓⟩)'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'Berechne $\\langle S_x\\rangle(t)$.', type:'value', target:'ħ/2 sin(ωt)', points:3,
          model:['|χ(t)⟩ = e^(-iHt/ħ) |-y⟩', '= 1/sqrt(2)(e^(-iωt/2)|↑⟩ - i e^(iωt/2)|↓⟩)', '⟨S_x⟩ = ⟨χ|S_x|χ⟩', '= ħ/2 · i/2 (e^(-iωt) - e^(iωt))', '= ħ/2 sin(ωt)']}
      ]}},
    {aim:'k', id:'spin-fk3', type:'mc2',
      q:'Der Spin ist im Zustand $|{+x}\\rangle$, das Feld ist $B\\hat z$. Ist das ein stationärer Zustand?',
      opts:['nein, $\\langle\\mathbf S\\rangle$ präzediert mit $\\omega$ um $z$', 'ja, nur die globale Phase ändert sich', 'ja, denn $\\langle S_z\\rangle = 0$ bleibt konstant'], a:0,
      ex:'$|{+x}\\rangle$ ist eine Überlagerung von $|\\uparrow\\rangle$ und $|\\downarrow\\rangle$ mit verschiedenen Energien. $\\langle S_z\\rangle$ bleibt zwar null, aber $\\langle S_x\\rangle = \\frac\\hbar2\\cos\\omega t$ ändert sich.',
      reason:{q:'Warum?', opts:['$|{+x}\\rangle$ ist kein Eigenzustand von $\\hat H = \\omega\\hat S_z$.', 'Jeder normierte Zustand ist stationär.', 'Ein konstantes $\\langle S_z\\rangle$ heißt stationär.'], a:0, ex:'Stationär sind nur Eigenzustände von $\\hat H$. Dass *ein* Erwartungswert konstant ist, reicht nicht.'}},
    {aim:'k', id:'spin-fk4', type:'dialog',
      text:'Gefragt ist, welche Spinzustände zu $|{+y}\\rangle$ orthogonal sind.',
      people:[{name:'Lena', says:'$|{+x}\\rangle$ und $|\\uparrow\\rangle$, denn die $x$- und die $z$-Achse stehen beide senkrecht auf der $y$-Achse.'},
        {name:'Jonas', says:'Nur $|{-y}\\rangle$, bis auf eine Phase. $|{+x}\\rangle$ und $|\\uparrow\\rangle$ haben mit $|{+y}\\rangle$ den Überlapp-Betrag $1/\\sqrt2$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Jonas. In $\\mathbb C^2$ gibt es zu jedem Zustand genau eine orthogonale Richtung; sie gehört zur Gegenrichtung im Raum.'}
  ],
  errors:[
    {id:'spin-e1', title:'Ein Zustand, der nie $+y$ ergibt?',
      text:'Der Spin ist im Zustand $|\\chi\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle + i|\\downarrow\\rangle)$. Gesucht ist $P(S_y = +\\hbar/2)$. Eine Rechnung ergibt 0:',
      ctx:SPIN({states:{χ:'1/sqrt(2)(|↑⟩ + i|↓⟩)'}, state:'χ'}),
      lines:['P = |⟨+y|χ⟩|^2', '= |1/sqrt(2) (1, i) · 1/sqrt(2) (1; i)|^2', '= |1/2 (1 + i^2)|^2', '= 0'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Im Bra $\\langle{+y}|$ fehlt die Konjugation: $(1, -i)$.', 'Der Faktor $1/\\sqrt2$ darf nur einmal vorkommen.', 'Zwischen Bra und Ket gehört die Matrix $\\sigma_y$.'], a:0, ex:'Tatsächlich ist $|\\chi\\rangle = |{+y}\\rangle$, also $P = 1$. Ohne Konjugation wird aus $\\langle{+y}|{+y}\\rangle$ fälschlich $0$.'},
      fix:{id:'a', prompt:'Berichtige und berechne $P$.', type:'value', target:'1', model:['P = |⟨+y|χ⟩|^2', '= |1/sqrt(2) (1, -i) · 1/sqrt(2) (1; i)|^2', '= |1/2 (1 - i^2)|^2', '= 1']}}
  ]
});
lexe('pauli', 'Pauli-Matrizen', '$\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$. Eigenschaften: $\\sigma_i^2 = \\mathbb 1$, $\\sigma_x\\sigma_y = i\\sigma_z$ (zyklisch), $\\sigma_i\\sigma_j = \\delta_{ij}\\mathbb 1 + i\\varepsilon_{ijk}\\sigma_k$, Spur 0, Eigenwerte $\\pm1$. Spin: $\\hat S_i = \\frac\\hbar2\\sigma_i$. Eingabe: `σ_x`, `S_x`, `S_+`.', {topic:'spin'});
lexe('spinor', 'Spinor', 'Zustand eines Spin-½-Teilchens: $|\\chi\\rangle = a|\\uparrow\\rangle + b|\\downarrow\\rangle = \\binom ab$ mit $|a|^2 + |b|^2 = 1$. Das Bra ist $\\langle\\chi| = (a^*, b^*)$. Bis auf eine globale Phase: $|\\chi\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ (Bloch-Kugel). Eingabe: `|↑⟩`, `(a; b)` als Spalte, `(a, b)` als Zeile (Bra).', {topic:'spin'});
lexe('spin-eigenzustaende', 'Eigenzustände der Spinkomponenten', '$S_z$: $|\\uparrow\\rangle$, $|\\downarrow\\rangle$. $S_x$: $|{\\pm x}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle\\pm|\\downarrow\\rangle)$. $S_y$: $|{\\pm y}\\rangle = \\frac{1}{\\sqrt2}(|\\uparrow\\rangle\\pm i|\\downarrow\\rangle)$. Messwerte immer $\\pm\\hbar/2$. Zwei Richtungen mit Winkel $\\alpha$: $|\\langle{+\\hat m}|{+\\hat n}\\rangle|^2 = \\cos^2\\frac\\alpha2$ – orthogonal sind nur Zustände zu entgegengesetzten Richtungen. Eingabe: `|+x⟩`, `|-y⟩`.', {topic:'spin'});
lexe('stern-gerlach', 'Stern-Gerlach-Versuch', 'Ein inhomogenes Magnetfeld in Richtung $\\hat n$ spaltet einen Strahl von Spin-½-Teilchen in zwei Teilstrahlen ($S_{\\hat n} = \\pm\\hbar/2$). Ein ausgeblendeter Teilstrahl ist im entsprechenden Eigenzustand präpariert. Bei Folgen von Magneten in verschiedenen Richtungen multiplizieren sich die Wahrscheinlichkeiten $|\\langle\\cdot|\\cdot\\rangle|^2$; eine Messung in $x$ löscht die $z$-Information.', {topic:'spin'});
lexe('larmor', 'Larmor-Präzession', 'Im Feld $B\\hat z$: $\\hat H = \\omega\\hat S_z$ ($\\omega = -\\gamma B$). Zeitentwicklung $|\\chi(t)\\rangle = e^{-i\\hat Ht/\\hbar}|\\chi(0)\\rangle$, also $a\\,e^{-i\\omega t/2}|\\uparrow\\rangle + b\\,e^{i\\omega t/2}|\\downarrow\\rangle$. Der Erwartungswert $\\langle\\mathbf S\\rangle$ dreht sich mit $\\omega$ um die Feldrichtung; $\\langle S_z\\rangle$ bleibt konstant. Protonen: $\\omega/2\\pi \\approx 42{,}6$ MHz pro Tesla.', {topic:'spin'});
lexe('bloch-kugel', 'Bloch-Kugel', 'Jeder Spin-½-Zustand ist bis auf eine globale Phase $|\\chi\\rangle = \\cos\\frac\\theta2|\\uparrow\\rangle + e^{i\\varphi}\\sin\\frac\\theta2|\\downarrow\\rangle$ und entspricht dem Punkt $\\hat n = (\\sin\\theta\\cos\\varphi, \\sin\\theta\\sin\\varphi, \\cos\\theta)$ auf der Einheitskugel. $|\\chi\\rangle$ ist Eigenzustand von $\\hat S_{\\hat n}$ zu $+\\hbar/2$, und $\\langle\\hat{\\mathbf S}\\rangle = \\frac\\hbar2\\hat n$. Orthogonale Zustände liegen sich gegenüber (Nord- und Südpol für $|\\uparrow\\rangle$, $|\\downarrow\\rangle$).', {topic:'spin'});
lexe('spin-moment', 'Magnetisches Moment des Spins', '$\\hat{\\boldsymbol\\mu} = \\gamma\\hat{\\mathbf S}$ mit dem gyromagnetischen Verhältnis $\\gamma$. Elektron: $\\gamma = -g\\,e/(2m_e)$ mit $g \\approx 2{,}002$, also $\\gamma \\approx -e/m_e$. Energie im Feld: $\\hat H = -\\hat{\\boldsymbol\\mu}\\cdot\\mathbf B$. Im inhomogenen Feld wirkt die Kraft $F_z = \\mu_z\\,\\partial B_z/\\partial z$ (Stern-Gerlach).', {topic:'spin'});
lexe('spin-drehung', 'Drehoperator für Spin ½', '$\\hat R_{\\hat n}(\\alpha) = e^{-i\\alpha\\,\\hat n\\cdot\\hat{\\mathbf S}/\\hbar}$ dreht einen Spinzustand um den Winkel $\\alpha$ um die Achse $\\hat n$. Um die $z$-Achse: $e^{-i\\alpha\\hat S_z/\\hbar} = \\mathrm{diag}(e^{-i\\alpha/2}, e^{i\\alpha/2})$. Für $\\alpha = 2\\pi$ ergibt sich $-\\mathbb 1$: Ein Spinor wechselt bei einer vollen Drehung das Vorzeichen, erst nach $4\\pi$ ist er wieder gleich. Nachgewiesen mit Neutronen-Interferometern (1975). Eingabe: `e^(-iα S_z/ħ)`.', {topic:'spin'});
