/* ===== Mathe M4: Lineare Operatoren und Eigenwerte ===== */
(function(){
const R = String.raw;
const MAT = (extra) => {
  const e = extra || {};
  const r = Object.assign({rep:'mat', coords:['t'], params:{}}, e, {mat:{preset:'spin', mats:Object.assign({}, e.mats || {})}}); delete r.mats; return r;
};
topic({
  id:'m-eigen', ch:'math', title:'Lineare Operatoren und Eigenwerte', short:'Eigenwerte',
  src:'Boas (3. Aufl.) Kap. 3 · Griffiths & Schroeter (3. Aufl.) Anhang A',
  goals:[
    'Ich kann Matrizen multiplizieren, adjungieren und Kommutatoren berechnen und erkenne hermitesche und unitäre Matrizen.',
    'Ich kann Eigenwerte über das charakteristische Polynom und die zugehörigen Eigenvektoren bestimmen und mit Spur und Determinante kontrollieren.',
    'Ich kann eine hermitesche Matrix diagonalisieren und damit Matrixfunktionen wie $e^{-iHt/\\hbar}$ berechnen.'
  ],
  needs:'Matrizen multiplizieren · Determinante einer $2\\times2$-Matrix · komplexe Zahlen (M1) · Skalarprodukt und Orthonormalbasen (M3)',
  check:[
    {q:'Was ergibt $\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}\\begin{pmatrix}1\\\\-1\\end{pmatrix}$?', opts:['$\\begin{pmatrix}-1\\\\-1\\end{pmatrix}$', '$\\begin{pmatrix}-2\\\\2\\end{pmatrix}$', '$\\begin{pmatrix}3\\\\7\\end{pmatrix}$'], a:0, ex:'Zeile mal Spalte: $1\\cdot1 + 2\\cdot(-1) = -1$ und $3\\cdot1 + 4\\cdot(-1) = -1$.', lex:'eigenwertproblem'},
    {q:'$\\det\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ ist …', opts:['$3$', '$5$', '$4$'], a:0, ex:'$\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad - bc = 4 - 1 = 3$.', lex:'charakteristisches-polynom'},
    {q:'$(3 - 2i)^*$ ist …', opts:['$3 + 2i$', '$-3 + 2i$', '$3 - 2i$'], a:0, ex:'Konjugieren dreht nur das Vorzeichen des Imaginärteils um.', lex:'komplexe-zahlen', prev:'m-komplex', seg:'mk-t1'},
    {q:'Für $v = \\begin{pmatrix}1\\\\i\\end{pmatrix}$ ist $\\langle v|v\\rangle = \\sum_k v_k^*v_k$ gleich …', opts:['$2$', '$0$', '$1 + i$'], a:0, ex:'$1\\cdot1 + (-i)\\cdot i = 1 + 1 = 2$. Ohne Konjugation käme fälschlich $1 + i^2 = 0$ heraus.', lex:'skalarprodukt', prev:'m-vektor', seg:'mv-t2'}
  ],
  wozu:'In der Quantenmechanik ist jede Messgröße ein hermitescher Operator, und ihre möglichen Messwerte sind seine Eigenwerte. Für Spin ½, Qubits oder ein Zwei-Niveau-System wie das Ammoniak-Molekül im Maser sind diese Operatoren einfach $2\\times2$-Matrizen. Die Zeitentwicklung ist die unitäre Matrix $e^{-iHt/\\hbar}$. Diagonalisieren heißt, eine Bewegung in unabhängige Schwingungen zu zerlegen – dasselbe Verfahren liefert auch die Eigenschwingungen gekoppelter Pendel oder Moleküle.',
  bridge:'Aus M3 kommen Skalarprodukt $\\langle u|v\\rangle = \\sum_k u_k^*v_k$, Orthonormalbasen und Projektionen wieder, aus M1 das Rechnen mit $i$ und $z^*$. Neu ist, dass Matrizen Vektoren verändern und dass es besondere Richtungen gibt, die nur gestreckt werden. M5 überträgt das auf Funktionen, Thema 6 und 10 auf Observable und Spin.',
  diag:[
    {q:'Wie beginnst du, um die Eigenwerte von $\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$ zu bestimmen?', opts:['Ich setze $\\det(A - \\lambda\\mathbb 1) = 0$ an und löse nach $\\lambda$ auf.', 'Ich lese die beiden Diagonaleinträge $1$ und $1$ als Eigenwerte ab.', 'Ich multipliziere $A$ mit $(1, 0)^T$ und lese $\\lambda$ ab.', 'Das weiß ich noch nicht.'], a:0, ex:'$\\det(A - \\lambda\\mathbb 1) = (1 - \\lambda)^2 - 4 = 0$ liefert $\\lambda = 3$ und $\\lambda = -1$. Die Diagonale ist nur bei Diagonal- und Dreiecksmatrizen die Antwort, und $(1, 0)^T$ ist hier kein Eigenvektor.'},
    {q:'Wie beginnst du, um $e^{-iHt/\\hbar}$ für eine hermitesche $2\\times2$-Matrix $H$ auszurechnen?', opts:['Ich bestimme Eigenwerte und Eigenvektoren von $H$ und lasse die Funktion auf die Eigenwerte wirken.', 'Ich bilde von jedem Eintrag einzeln $e^{-iH_{ij}t/\\hbar}$ und schreibe die Ergebnisse in eine Matrix.', 'Ich setze $e^{-iHt/\\hbar} = \\mathbb 1 - iHt/\\hbar$; das ist für Matrizen exakt.', 'Das weiß ich noch nicht.'], a:0, ex:'Mit $H = \\sum_nE_n|n\\rangle\\langle n|$ ist $e^{-iHt/\\hbar} = \\sum_ne^{-iE_nt/\\hbar}|n\\rangle\\langle n|$. Die Funktion einer Matrix ist nicht die Funktion ihrer Einträge, und $\\mathbb 1 - iHt/\\hbar$ ist nur die erste Ordnung der Reihe.'}
  ],
  phenomenon:{
    title:'Bleibt das Teilchen links?',
    text:'Ein Molekül wie Ammoniak hat zwei gleichwertige Lagen, „links“ $|L\\rangle = (1, 0)^T$ und „rechts“ $|R\\rangle = (0, 1)^T$. Beide haben die Energie $E_0$, und eine kleine Tunnelkopplung $\\Delta > 0$ verbindet sie. Die Hamilton-Matrix ist\n\n$$H = \\begin{pmatrix}E_0 & -\\Delta\\\\ -\\Delta & E_0\\end{pmatrix}.$$\n\nZur Zeit $t = 0$ ist das System sicher links, im Zustand $|L\\rangle$. Was passiert danach, solange niemand misst?',
    q:{q:'Deine Vorhersage:', opts:['Es bleibt links, denn $|L\\rangle$ hat die feste Energie $E_0$.', 'Es pendelt periodisch zwischen links und rechts hin und her.', 'Es springt irgendwann zufällig nach rechts und bleibt dort.', 'Es verteilt sich und bleibt dann je zur Hälfte links und rechts.'], a:1,
      ex:'$|L\\rangle$ ist kein Eigenvektor von $H$. Die Wahrscheinlichkeit, das System rechts zu finden, ist $\\sin^2(\\Delta t/\\hbar)$.',
      fb:['$H|L\\rangle = E_0|L\\rangle - \\Delta|R\\rangle$ ist kein Vielfaches von $|L\\rangle$. Also ist $|L\\rangle$ kein Eigenvektor und kein stationärer Zustand; eine feste Energie hat es nicht.', 'Richtig. $|L\\rangle$ ist eine Überlagerung zweier Eigenvektoren mit verschiedenen Energien. Ihre Phasen laufen verschieden schnell, daraus entsteht eine Schwebung zwischen links und rechts.', 'Ohne Messung ist die Zeitentwicklung deterministisch: $|\\psi(t)\\rangle = e^{-iHt/\\hbar}|L\\rangle$. Die Wahrscheinlichkeit rechts wächst und fällt stetig, Sprünge gibt es nicht.', 'Die Zeitentwicklung ist unitär und hat keine Dämpfung. Das System kommt immer wieder vollständig nach links zurück; halb und halb ist es nur zu bestimmten Zeiten.']},
    reveal:'Die Eigenvektoren von $H$ sind $|{\\pm}\\rangle = (|L\\rangle \\pm |R\\rangle)/\\sqrt2$ mit den Energien $E_0 \\mp \\Delta$. Der Startzustand ist ihre Überlagerung, $|L\\rangle = (|{+}\\rangle + |{-}\\rangle)/\\sqrt2$. Jeder Anteil bekommt seine eigene Phase $e^{-iEt/\\hbar}$, und es folgt\n\n$$P_R(t) = |\\langle R|\\psi(t)\\rangle|^2 = \\sin^2(\\Delta t/\\hbar).$$\n\nDas System pendelt mit der Frequenz $2\\Delta/h$ hin und her. Beim Ammoniak-Molekül liegt diese Inversionsfrequenz bei etwa $24\\,$GHz; das nutzt der Ammoniak-Maser.\n\nDer Schlüssel ist das Eigenwertproblem der Matrix $H$. Wie man es löst und warum es für hermitesche Matrizen immer gutartig ausgeht, zeigt der Lerntext. Abschnitt 6 erklärt die Zeitentwicklung; in der Übung „Zwei-Niveau-System“ (Schritt 6) rechnest du sie selbst aus.'
  },
  teach:[
    /* ===== Abschnitt 1: Matrix als Zahlenschema und als Abbildung, Produkt, Kommutator ===== */
    {id:'me-t1', title:'Matrizen als lineare Abbildungen – die Reihenfolge zählt', steps:[
      {id:'me-t1a', title:'Eine Matrix macht aus Vektoren Vektoren',
        num:{title:'Zeile mal Spalte', text:R`Für $A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$ und $v = (1;\ 0)$ rechnest du Zeile mal Spalte:

$$Av = \begin{pmatrix}2\cdot1 + 1\cdot0\\ 1\cdot1 + 2\cdot0\end{pmatrix} = \begin{pmatrix}2\\ 1\end{pmatrix}.$$

Ebenso ist $A\,(0;\ 1) = (1;\ 2)$ und $A\,(1;\ 1) = (3;\ 3)$.`},
        text:R`Eine $n\times n$-Matrix ist zunächst ein Zahlenschema mit $n$ Zeilen und $n$ Spalten. Sie ist aber mehr: eine Vorschrift, die aus jedem Vektor $v$ einen neuen Vektor $Av$ macht. Man nennt das eine **Abbildung**. Den $i$-ten Eintrag von $Av$ bekommst du, indem du die $i$-te Zeile von $A$ Eintrag für Eintrag mit der Spalte $v$ multiplizierst und addierst:

$$(Av)_i = \sum_jA_{ij}\,v_j.$$

Gelesen: „Eintrag $i$ von $A$ mal $v$ ist die Summe über $j$ von $A_{ij}$ mal $v_j$.“ Der erste Index von $A_{ij}$ nennt die Zeile, der zweite die Spalte. Im Beispiel wird aus dem waagerechten Pfeil $(1;\ 0)$ der schräge Pfeil $(2;\ 1)$.`,
        q:{q:R`Was ergibt $\begin{pmatrix}1&2\\ 3&4\end{pmatrix}\begin{pmatrix}2\\ 1\end{pmatrix}$?`,
          opts:[R`$(5;\ 8)$`, R`$(4;\ 10)$`, R`$(2;\ 4)$`], a:1,
          ex:R`Zeile mal Spalte: $1\cdot2 + 2\cdot1 = 4$ und $3\cdot2 + 4\cdot1 = 10$.`,
          fb:[R`Du hast die Spalten der Matrix statt ihrer Zeilen mit $v$ multipliziert: $1\cdot2 + 3\cdot1 = 5$. Richtig ist die erste Zeile $(1, 2)$ mal $(2;\ 1)$.`,
            '',
            R`Die Einträge neben der Diagonale zählen mit: $(Av)_1 = 1\cdot2 + 2\cdot1$, nicht nur $1\cdot2$.`]}},
      {id:'me-t1b', title:'Die Spalten sind die Bilder der Basisvektoren',
        num:{title:'Linearität ausgenutzt', text:R`Mit $e_1 = (1;\ 0)$ und $e_2 = (0;\ 1)$ ist $(1;\ 1) = e_1 + e_2$. Weil $A$ linear ist, gilt

$$A(e_1 + e_2) = Ae_1 + Ae_2 = (2;\ 1) + (1;\ 2) = (3;\ 3).$$

Das ist dasselbe Ergebnis wie mit Zeile mal Spalte.`},
        text:R`Die Abbildung $v \mapsto Av$ ist **linear**: $A(\alpha u + \beta v) = \alpha\,Au + \beta\,Av$ für alle Zahlen $\alpha, \beta$. Deshalb genügt es zu wissen, was $A$ mit den Basisvektoren macht. Die $j$-te Spalte von $A$ ist genau das Bild $Ae_j$. Jeden anderen Vektor zerlegst du in Basisvektoren und setzt die Bilder zusammen.

Im Labor siehst du das für viele Vektoren zugleich. Der graue Kreis enthält alle Vektoren $u$ der Länge $1$. Jeder graue Strich führt von $u$ zu seinem Bild $Au$, dem blauen Punkt. Die blaue Kurve ist das Bild des ganzen Kreises. Die farbigen Pfeile und gestrichelten Geraden erklärt Abschnitt 3.`,
        fig:{lab:'eigen', init:{a:2, b:1, d:2}, caption:R`Labor mit $a = d = 2$ und $b = 1$, also $A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$. Der Punkt $(1, 0)$ des Kreises landet bei $(2, 1)$, der Punkt $(0, 1)$ bei $(1, 2)$.`},
        reps:{obj:R`Die Matrix $A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$ als Abbildung`,
          rows:[
            {k:'matrix', tex:R`A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}`},
            {k:'formel', tex:R`\begin{gathered}Ae_1 = \begin{pmatrix}2\\ 1\end{pmatrix},\\ Ae_2 = \begin{pmatrix}1\\ 2\end{pmatrix},\\ A(\alpha e_1 + \beta e_2) = \alpha\begin{pmatrix}2\\ 1\end{pmatrix} + \beta\begin{pmatrix}1\\ 2\end{pmatrix}\end{gathered}`},
            {k:'worte', text:R`Der Pfeil nach rechts wird zum Pfeil nach $(2, 1)$, der Pfeil nach oben zum Pfeil nach $(1, 2)$. Jeder andere Pfeil wird aus diesen beiden zusammengesetzt.`},
            {k:'labor', text:R`Regler „a (oben links)“ $= 2$, „b (Nebendiagonale)“ $= 1$, „d (unten rechts)“ $= 2$: Der Einheitskreis wird zur blauen Ellipse, jeder graue Strich verbindet $u$ mit $Au$.`}
          ],
          links:[
            {from:'matrix', to:'formel', rule:R`Lies die Spalten ab: Spalte $j$ ist das Bild von $e_j$. Für einen beliebigen Vektor nimm $\alpha$-mal die erste plus $\beta$-mal die zweite Spalte.`},
            {from:'formel', to:'worte', rule:R`Zeichne die beiden Spalten als Pfeile vom Ursprung aus. Sie zeigen, wohin die Basispfeile gehen.`},
            {from:'worte', to:'labor', rule:R`Stell die drei Einträge mit den Reglern ein. Folge einem grauen Strich vom Kreis zum blauen Punkt: Das ist ein Pfeil vor und nach der Abbildung.`}
          ]},
        q:{q:R`Eine Matrix $M$ macht aus $e_1$ den Pfeil $e_2$ und aus $e_2$ den Pfeil $e_1$. Sie spiegelt also an der Winkelhalbierenden. Welche Matrix ist das?`, tr:{from:'worte', to:'matrix'},
          opts:[R`$\begin{pmatrix}1&0\\ 0&-1\end{pmatrix}$`, R`$\begin{pmatrix}0&-1\\ 1&0\end{pmatrix}$`, R`$\begin{pmatrix}0&1\\ 1&0\end{pmatrix}$`], a:2,
          ex:R`Die erste Spalte ist $Me_1 = e_2 = (0;\ 1)$, die zweite $Me_2 = e_1 = (1;\ 0)$.`,
          fb:[R`Diese Matrix lässt $e_1$ fest und dreht $e_2$ um: eine Spiegelung an der 1-Achse. Lies die Spalten ab: Die erste muss $Me_1 = e_2$ sein.`,
            R`Die zweite Spalte ist hier $(-1;\ 0)$, also $Me_2 = -e_1$. Das ist eine Drehung um $90^\circ$, keine Spiegelung.`,
            '']}},
      {id:'me-t1c', title:'Hintereinander ausführen: das Matrixprodukt',
        num:{title:'Erst drehen, dann spiegeln', text:R`$D = \begin{pmatrix}0&-1\\ 1&0\end{pmatrix}$ dreht um $90^\circ$, $S = \begin{pmatrix}1&0\\ 0&-1\end{pmatrix}$ spiegelt an der 1-Achse. Für $e_1 = (1;\ 0)$:

$$S(De_1) = S\,(0;\ 1) = (0;\ -1),\qquad D(Se_1) = D\,(1;\ 0) = (0;\ 1).$$

Die Reihenfolge ändert das Ergebnis.`},
        text:R`Wendest du erst $B$ und dann $A$ an, bekommst du $A(Bv)$. Das ist wieder eine lineare Abbildung. Ihre Matrix heißt $AB$:

$$(AB)_{ij} = \sum_kA_{ik}B_{kj}.$$

Gelesen: Eintrag $(i, j)$ von $AB$ ist Zeile $i$ von $A$ mal Spalte $j$ von $B$. Achte auf die Reihenfolge. In $ABv$ wirkt die **rechte** Matrix zuerst, so wie bei verketteten Funktionen $f(g(x))$ zuerst $g$ wirkt. Im Allgemeinen ist $AB \ne BA$. Das Beispiel zeigt es: $SD$ schickt $e_1$ nach unten, $DS$ nach oben.`,
        q:{q:R`Mit $D$ und $S$ aus dem Beispiel: Wohin schickt $DS$ den Vektor $e_2 = (0;\ 1)$?`,
          opts:[R`$(1;\ 0)$`, R`$(-1;\ 0)$`, R`$(0;\ -1)$`], a:0,
          ex:R`Zuerst $S$: $Se_2 = (0;\ -1)$. Dann $D$: $D\,(0;\ -1) = (1;\ 0)$.`,
          fb:['',
            R`Das ist $SD\,e_2$: erst gedreht, dann gespiegelt. In $DS\,e_2$ wirkt $S$ zuerst.`,
            R`Das ist nur $Se_2$. Danach wirkt noch $D$.`]}},
      {id:'me-t1d', title:'Der Kommutator misst die Reihenfolge',
        pre:{from:'m-komplex', seg:'mk-t1', title:R`Rechnen mit $i$`, text:R`Es gilt $i^2 = -1$. Damit ist $i\cdot(-i) = -i^2 = 1$ und $(-i)\cdot(-i) = i^2 = -1$. Mini-Beispiel: $(2i)(-2i) = -4i^2 = 4$.`},
        num:{title:'Zwei Produkte der Pauli-Matrizen', text:R`Mit $\sigma_x = \begin{pmatrix}0&1\\ 1&0\end{pmatrix}$ und $\sigma_y = \begin{pmatrix}0&-i\\ i&0\end{pmatrix}$:

$$\sigma_x\sigma_y = \begin{pmatrix}i&0\\ 0&-i\end{pmatrix},\qquad \sigma_y\sigma_x = \begin{pmatrix}-i&0\\ 0&i\end{pmatrix}.$$

Die beiden Reihenfolgen geben verschiedene Matrizen.`},
        text:R`Den Unterschied der beiden Reihenfolgen misst der **[[lex:kommutator|Kommutator]]**

$$[A, B] = AB - BA,$$

gelesen „Kommutator von A und B“. Ist er null, heißen $A$ und $B$ vertauschbar. Die wichtigsten Beispiele sind die [[lex:pauli|Pauli-Matrizen]] $\sigma_x$, $\sigma_y$ aus dem Beispiel und $\sigma_z = \begin{pmatrix}1&0\\ 0&-1\end{pmatrix}$. Die Herleitung zeigt $[\sigma_x, \sigma_y] = 2i\sigma_z$; zyklisch vertauscht gilt dasselbe. **Ausblick (Thema 10):** Die Pauli-Matrizen beschreiben den Spin eines Elektrons. Dass sie nicht vertauschen, hat dort eine messbare Folge: Zwei Spinkomponenten lassen sich nicht gleichzeitig scharf messen.`,
        derive:{ctx:MAT({}), lines:[
          {l:'[σ_x, σ_y] = σ_x σ_y - σ_y σ_x', w:'Definition des Kommutators'},
          {l:'= (i, 0; 0, -i) - (-i, 0; 0, i)', w:'beide Produkte: Zeile mal Spalte', why:{q:'Wie entsteht der Eintrag oben links von $\\sigma_x\\sigma_y$?', opts:['Erste Zeile von $\\sigma_x$ mal erste Spalte von $\\sigma_y$: $0\\cdot0 + 1\\cdot i = i$', 'Aus den beiden Einträgen oben links: $0\\cdot 0 = 0$', 'Erste Spalte von $\\sigma_x$ mal erste Zeile von $\\sigma_y$: $0$'], a:0, ex:'Matrizen multipliziert man nicht eintragsweise: $(\\sigma_x\\sigma_y)_{11} = \\sum_k(\\sigma_x)_{1k}(\\sigma_y)_{k1} = 0\\cdot 0 + 1\\cdot i = i$.'}},
          {l:'= (2i, 0; 0, -2i)', w:'Differenz Eintrag für Eintrag'},
          {l:'= 2i σ_z', w:R`$2i$ ausgeklammert`, why:{q:'Was zeigt das Ergebnis?', opts:['$\\sigma_x$ und $\\sigma_y$ vertauschen nicht; der Kommutator ist $2i\\sigma_z$.', '$\\sigma_x$ und $\\sigma_y$ vertauschen, denn der Kommutator ist diagonal.', 'Der Kommutator ist ein Vielfaches von $\\mathbb 1$, nämlich $2i\\,\\mathbb 1$.'], a:0, ex:'$2i\\sigma_z \\ne 0$, also $\\sigma_x\\sigma_y \\ne \\sigma_y\\sigma_x$. Die Diagonale von $\\sigma_z$ ist $(1, -1)$, nicht $(1, 1)$; deshalb ist das Ergebnis kein Vielfaches von $\\mathbb 1$.'}}
        ]},
        q:{q:R`Es gilt $\sigma_x\sigma_y = i\sigma_z$. Was ist dann $\sigma_y\sigma_x$?`,
          opts:[R`$i\sigma_z$`, R`$-i\sigma_z$`, R`$\mathbb 1$`], a:1,
          ex:R`Aus $\sigma_x\sigma_y - \sigma_y\sigma_x = 2i\sigma_z$ folgt $\sigma_y\sigma_x = i\sigma_z - 2i\sigma_z = -i\sigma_z$. Die beiden Produkte unterscheiden sich nur im Vorzeichen.`,
          fb:[R`Dann wäre der Kommutator null. Er ist aber $2i\sigma_z$, die beiden Produkte unterscheiden sich also.`,
            '',
            R`Das Produkt ist diagonal mit den Einträgen $-i$ und $i$, wie das Beispiel zeigt. $\mathbb 1$ hätte zweimal die $1$.`]}},
      {id:'me-t1e', title:'Rechenregeln und eine Überraschung bei der Spur',
        num:{title:'Die Spur eines Produkts', text:R`Die [[lex:spur-determinante|Spur]] ist die Summe der Diagonaleinträge. Für $A = \begin{pmatrix}1&2\\ 3&4\end{pmatrix}$ und $B = \sigma_x$:

$$AB = \begin{pmatrix}2&1\\ 4&3\end{pmatrix},\qquad BA = \begin{pmatrix}3&4\\ 1&2\end{pmatrix}.$$

Verschiedene Matrizen, aber beide haben die Spur $5$.`},
        text:R`Drei Rechenregeln brauchst du ständig: $[A, B] = -[B, A]$, $[A, A] = 0$ und die Produktregel

$$[A, BC] = [A, B]\,C + B\,[A, C].$$

Die **Spur** $\operatorname{tr}A = \sum_iA_{ii}$, gelesen „Spur von A“, hängt nicht von der Reihenfolge ab: $\operatorname{tr}(AB) = \operatorname{tr}(BA)$. Also hat jeder Kommutator von Matrizen die Spur null. Daraus folgt etwas Überraschendes. Für keine zwei $n\times n$-Matrizen gilt $[X, P] = c\,\mathbb 1$ mit $c \ne 0$; dabei ist $\mathbb 1$ die Einheitsmatrix. Rechts steht nämlich die Spur $cn$. **Ausblick (Thema 6):** Genau diese Gleichung gilt für Ort und Impuls. Sie braucht deshalb einen unendlichdimensionalen Raum (M5).`,
        q:{q:R`Kann für zwei $2\times2$-Matrizen $[A, B] = \mathbb 1$ gelten?`,
          opts:[R`Ja, zum Beispiel für $A = \sigma_x$ und $B = \sigma_y$.`, R`Ja, sobald $A$ und $B$ nicht vertauschen.`, R`Nein: Die Spur links ist $0$, rechts $2$.`], a:2,
          ex:R`$\operatorname{tr}[A, B] = \operatorname{tr}(AB) - \operatorname{tr}(BA) = 0$, aber $\operatorname{tr}\mathbb 1 = 2$.`,
          fb:[R`$[\sigma_x, \sigma_y] = 2i\sigma_z$ hat die Spur $0$, nicht $2$. Kein Kommutator von Matrizen ist ein Vielfaches von $\mathbb 1$ ungleich null.`,
            R`Nicht vertauschen heißt nur $[A, B] \ne 0$. Die Spur des Kommutators bleibt trotzdem $0$.`,
            '']}},
      {id:'me-t1f', title:'Typischer Fehler: Matrizen eintragsweise multiplizieren',
        num:{title:'Eintragsweise ist falsch', text:R`Wer $\sigma_x$ und $\sigma_y$ Eintrag für Eintrag multipliziert, erhält $\begin{pmatrix}0\cdot0 & 1\cdot(-i)\\ 1\cdot i & 0\cdot0\end{pmatrix} = \begin{pmatrix}0&-i\\ i&0\end{pmatrix}$. Richtig ist Zeile mal Spalte: $(\sigma_x\sigma_y)_{11} = 0\cdot0 + 1\cdot i = i$, also $\sigma_x\sigma_y = \begin{pmatrix}i&0\\ 0&-i\end{pmatrix}$.`},
        text:R`Der häufigste Rechenfehler mit Matrizen ist, sie Eintrag für Eintrag zu multiplizieren. Das sieht harmlos aus, hat aber mit dem Hintereinanderausführen nichts zu tun. Ein schneller Test: Die erste Spalte von $AB$ muss $A$ mal die erste Spalte von $B$ sein, denn sie ist das Bild von $e_1$. Der zweite häufige Fehler ist die Reihenfolge. $AB$ und $BA$ sind verschiedene Matrizen, und in $ABv$ wirkt $B$ zuerst. Bei Diagonalmatrizen merkst du von beiden Fehlern nichts. Deshalb fallen sie erst bei Matrizen wie den Pauli-Matrizen auf.`,
        q:{q:R`Jemand rechnet $\begin{pmatrix}1&1\\ 0&1\end{pmatrix}\begin{pmatrix}1&0\\ 1&1\end{pmatrix} = \begin{pmatrix}1&0\\ 0&1\end{pmatrix}$. Was stimmt?`,
          opts:[R`Richtig, denn die beiden Matrizen sind zueinander invers.`, R`Eintragsweise gerechnet; richtig ist $\begin{pmatrix}2&1\\ 1&1\end{pmatrix}$.`, R`Falsch; richtig ist $\begin{pmatrix}1&1\\ 1&2\end{pmatrix}$.`], a:1,
          ex:R`Oben links: erste Zeile $(1, 1)$ mal erste Spalte $(1;\ 1)$ gibt $2$. So entsteht $\begin{pmatrix}2&1\\ 1&1\end{pmatrix}$.`,
          fb:[R`Invers hieße, das Produkt ist $\mathbb 1$. Zeile mal Spalte gibt aber oben links $1\cdot1 + 1\cdot1 = 2$.`,
            '',
            R`Das ist das Produkt in umgekehrter Reihenfolge. Hier steht die erste Zeile der linken Matrix mal die erste Spalte der rechten.`]}}
    ]},
    /* ===== Abschnitt 2: Adjungieren, hermitesch, unitär ===== */
    {id:'me-t2', title:'Adjungieren: hermitesche und unitäre Matrizen', steps:[
      {id:'me-t2a', title:'Die Adjungierte: transponieren und konjugieren',
        pre:{from:'m-komplex', seg:'mk-t1', title:'Konjugieren', text:R`Konjugieren ersetzt $i$ durch $-i$: $(a + ib)^* = a - ib$. Reelle Zahlen bleiben unverändert. Mini-Beispiel: $(4 - i)^* = 4 + i$ und $(2i)^* = -2i$.`},
        num:{title:R`Eine $2\times2$-Matrix adjungiert`, text:R`Für $A = \begin{pmatrix}1 & 2i\\ 3 & 4 - i\end{pmatrix}$ transponierst du zuerst: Zeilen werden Spalten, $A^T = \begin{pmatrix}1 & 3\\ 2i & 4 - i\end{pmatrix}$. Dann konjugierst du jeden Eintrag:

$$A^\dagger = \begin{pmatrix}1 & 3\\ -2i & 4 + i\end{pmatrix}.$$`},
        text:R`Die **[[lex:adjungierte|Adjungierte]]** $A^\dagger$ einer Matrix, gelesen „A dagger“, ist

$$A^\dagger = (A^T)^*,\qquad (A^\dagger)_{ij} = A_{ji}^*.$$

Du transponierst also und konjugierst jeden Eintrag; die Reihenfolge der beiden Schritte ist egal. Für einen Spaltenvektor kennst du das aus M3. Aus dem Ket $|v\rangle$ wird so der Bra $\langle v|$, die konjugierte Zeile. Deshalb ist das Skalarprodukt $\langle u|v\rangle = u^\dagger v = \sum_ku_k^*v_k$ einfach Zeile mal Spalte.`,
        q:{q:R`Was ist $\begin{pmatrix}0 & 1 + i\\ 2 & 3i\end{pmatrix}^\dagger$?`,
          opts:[R`$\begin{pmatrix}0 & 1 - i\\ 2 & -3i\end{pmatrix}$`, R`$\begin{pmatrix}0 & 2\\ 1 + i & 3i\end{pmatrix}$`, R`$\begin{pmatrix}0 & 2\\ 1 - i & -3i\end{pmatrix}$`], a:2,
          ex:R`Transponiert: $\begin{pmatrix}0 & 2\\ 1 + i & 3i\end{pmatrix}$. Konjugiert: $1 + i \to 1 - i$ und $3i \to -3i$.`,
          fb:[R`Das ist nur konjugiert. Beim Adjungieren wandert außerdem der Eintrag $2$ von unten links nach oben rechts.`,
            R`Das ist nur transponiert. Die komplexen Einträge müssen noch konjugiert werden.`,
            '']}},
      {id:'me-t2b', title:'Die Adjungierte im Skalarprodukt',
        num:{title:'Nachgerechnet', text:R`$A = \begin{pmatrix}1 & i\\ 0 & 2\end{pmatrix}$, $u = (1;\ 1)$, $v = (0;\ 1)$. Dann ist $Av = (i;\ 2)$ und $\langle u|Av\rangle = 1\cdot i + 1\cdot2 = 2 + i$. Mit $A^\dagger = \begin{pmatrix}1 & 0\\ -i & 2\end{pmatrix}$ ist $A^\dagger u = (1;\ 2 - i)$ und

$$\langle A^\dagger u|v\rangle = 1^*\cdot0 + (2 - i)^*\cdot1 = 2 + i.$$`},
        text:R`Das Beispiel ist kein Zufall. Für jede Matrix gilt

$$\langle u|Av\rangle = \langle A^\dagger u|v\rangle.$$

Gelesen: „Wirkt $A$ rechts im Skalarprodukt, darfst du es als $A^\dagger$ nach links schieben.“ Der Beweis ist eine Zeile: $\sum_{i,j}u_i^*A_{ij}v_j = \sum_{i,j}(A_{ij}^*u_i)^*v_j$, und $\sum_iA_{ij}^*u_i$ ist die $j$-te Komponente von $A^\dagger u$. Diese Eigenschaft ist der eigentliche Sinn der Adjungierten. Aus ihr folgt auch $(AB)^\dagger = B^\dagger A^\dagger$: Beim Schieben nach links kommt zuerst $A$, dann $B$ an die Reihe, und die Reihenfolge dreht sich um.`,
        q:{q:R`Wie lautet $\langle u|ABv\rangle$, wenn du beide Matrizen nach links schiebst?`,
          opts:[R`$\langle A^\dagger B^\dagger u|v\rangle$`, R`$\langle BAu|v\rangle$`, R`$\langle B^\dagger A^\dagger u|v\rangle$`], a:2,
          ex:R`Schritt für Schritt: $\langle u|A(Bv)\rangle = \langle A^\dagger u|Bv\rangle = \langle B^\dagger A^\dagger u|v\rangle$. Auf $u$ wirkt zuerst $A^\dagger$.`,
          fb:[R`Schiebe einzeln: Zuerst wandert $A$ nach links und wirkt als $A^\dagger$ auf $u$. Danach kommt $B^\dagger$ davor: $B^\dagger A^\dagger u$.`,
            R`Beim Schieben nach links wird adjungiert. Ohne Dagger stimmt die Gleichung nur für besondere Matrizen.`,
            '']}},
      {id:'me-t2c', title:'Hermitesch: Spiegeln und Konjugieren ändert nichts',
        num:{title:R`$\sigma_y$ adjungiert`, text:R`$\sigma_y = \begin{pmatrix}0&-i\\ i&0\end{pmatrix}$ hat rein imaginäre Einträge. Transponieren gibt $\begin{pmatrix}0&i\\ -i&0\end{pmatrix}$, Konjugieren dreht beide Vorzeichen zurück. Also ist $\sigma_y^\dagger = \sigma_y$.`},
        text:R`Eine Matrix heißt **hermitesch**, wenn $A^\dagger = A$. Gelesen: Spiegeln an der Diagonale und Konjugieren ändert nichts. Daraus folgen zwei Kennzeichen, die du sofort prüfen kannst. Die Diagonaleinträge sind reell, denn $A_{ii} = A_{ii}^*$. Gegenüberliegende Einträge sind zueinander konjugiert: $A_{21} = A_{12}^*$. Eine hermitesche $2\times2$-Matrix hat also immer die Form $\begin{pmatrix}a & b\\ b^* & d\end{pmatrix}$ mit reellen $a$ und $d$. Im Skalarprodukt darf eine hermitesche Matrix ohne Änderung von rechts nach links wandern: $\langle u|Av\rangle = \langle Au|v\rangle$. Die Tafel zeigt, warum die Physik sich für diese Matrizen interessiert.`,
        reps:{obj:R`Die hermitesche Matrix $H = \begin{pmatrix}3 & 2i\\ -2i & 0\end{pmatrix}$`,
          rows:[
            {k:'worte', text:R`An der Diagonale gespiegelt und dann konjugiert, ergibt sich wieder dieselbe Matrix.`},
            {k:'matrix', tex:R`\begin{gathered}H = \begin{pmatrix}3 & 2i\\ -2i & 0\end{pmatrix}:\qquad H_{11} = 3,\ H_{22} = 0\ \text{reell},\\ H_{21} = -2i = (2i)^* = H_{12}^*\end{gathered}`},
            {k:'formel', tex:R`\begin{gathered}H^\dagger = H,\\ \langle u|Hv\rangle = \langle Hu|v\rangle\ \text{für alle } u, v\end{gathered}`},
            {k:'physik', text:R`**Ausblick (Thema 6):** In der Quantenmechanik gehört zu jeder messbaren Größe, etwa zur Energie, eine hermitesche Matrix. Die Zahlen, die eine Messung liefern kann, lassen sich aus ihr ausrechnen (Abschnitt 3), und sie sind reell (Abschnitt 4) – wie jeder Messwert.`}
          ],
          links:[
            {from:'worte', to:'matrix', rule:R`Vergleiche Eintrag $(1, 2)$ mit Eintrag $(2, 1)$: Der eine muss der konjugierte andere sein. Prüfe dann, ob die Diagonale reell ist.`},
            {from:'matrix', to:'formel', rule:R`Bilde $H^\dagger$: transponieren, dann konjugieren. Stimmt das Ergebnis Eintrag für Eintrag mit $H$ überein, ist $H^\dagger = H$.`},
            {from:'formel', to:'physik', rule:R`Lies „hermitesch“ als „kann eine messbare Größe darstellen“. Die möglichen Messwerte stecken in der Matrix und werden in Abschnitt 3 herausgerechnet.`}
          ]},
        q:{q:R`Welche Matrix ist hermitesch?`, tr:{from:'matrix', to:'formel'},
          opts:[R`$\begin{pmatrix}2 & 1+i\\ 1+i & 0\end{pmatrix}$`, R`$\begin{pmatrix}2i & 1\\ 1 & 0\end{pmatrix}$`, R`$\begin{pmatrix}2 & 1+i\\ 1-i & 0\end{pmatrix}$`], a:2,
          ex:R`Hermitesch verlangt eine reelle Diagonale und $A_{21} = A_{12}^*$. Bei der dritten Matrix ist $(1 + i)^* = 1 - i$ erfüllt.`,
          fb:[R`Hier ist $A_{21} = A_{12}$ statt $A_{12}^*$. Das ist symmetrisch, aber nicht hermitesch: $(1 + i)^* = 1 - i$.`,
            R`Ein Diagonaleintrag $2i$ ist nicht reell. Beim Adjungieren wird er zu $-2i$.`,
            '']}},
      {id:'me-t2d', title:'Typischer Fehler: symmetrisch ist nicht hermitesch',
        num:{title:'Zwei Gegenbeispiele', text:R`$B = \begin{pmatrix}2 & 1 + i\\ 1 + i & 0\end{pmatrix}$ ist symmetrisch, aber $B^\dagger = \begin{pmatrix}2 & 1 - i\\ 1 - i & 0\end{pmatrix} \ne B$. Und $N = \begin{pmatrix}1 & 2\\ 0 & 1\end{pmatrix}$ ist reell, aber $N^\dagger = \begin{pmatrix}1 & 0\\ 2 & 1\end{pmatrix} \ne N$.`},
        text:R`Zwei Faustregeln führen oft in die Irre. Erstens: „Hermitesch heißt symmetrisch.“ Das stimmt nur für reelle Matrizen. Bei komplexen Einträgen muss gegenüber die *konjugierte* Zahl stehen. Zweitens: „Hermitesche Matrizen haben reelle Einträge.“ Reelle Einträge sind weder nötig noch hinreichend. $\sigma_y$ hat imaginäre Einträge und ist hermitesch; $N$ im Beispiel ist reell und nicht hermitesch. Entscheidend ist allein die Bedingung $A^\dagger = A$. Prüfe sie Eintrag für Eintrag, und zwar immer mit Transponieren **und** Konjugieren.`,
        q:{q:R`Für welche Zahl $z$ ist $\begin{pmatrix}1 & z\\ 3 - 2i & 5\end{pmatrix}$ hermitesch?`,
          opts:[R`$z = 3 - 2i$`, R`$z = 3 + 2i$`, R`$z = -3 + 2i$`], a:1,
          ex:R`Es muss $z = A_{12} = A_{21}^* = (3 - 2i)^* = 3 + 2i$ sein. Die Diagonale $1, 5$ ist schon reell.`,
          fb:[R`Das macht die Matrix symmetrisch. Hermitesch verlangt die konjugierte Zahl: $(3 - 2i)^* = 3 + 2i$.`,
            '',
            R`Konjugieren dreht nur das Vorzeichen des Imaginärteils, nicht das der ganzen Zahl.`]}},
      {id:'me-t2e', title:'Unitär: Längen und Winkel bleiben erhalten',
        num:{title:R`Eine Drehung um $45^\circ$`, text:R`$U = \tfrac{1}{\sqrt2}\begin{pmatrix}1&-1\\ 1&1\end{pmatrix}$ dreht um $45^\circ$: $Ue_1 = \tfrac{1}{\sqrt2}(1;\ 1)$, wieder mit der Länge $\sqrt{\tfrac12 + \tfrac12} = 1$. Zeile mal Spalte gibt

$$U^\dagger U = \tfrac12\begin{pmatrix}1&1\\ -1&1\end{pmatrix}\begin{pmatrix}1&-1\\ 1&1\end{pmatrix} = \tfrac12\begin{pmatrix}2&0\\ 0&2\end{pmatrix} = \mathbb 1.$$`},
        text:R`Eine Matrix heißt **[[lex:unitaer|unitär]]**, wenn

$$U^\dagger U = \mathbb 1,\qquad\text{also}\qquad U^{-1} = U^\dagger.$$

Die Inverse bekommst du dann geschenkt: adjungieren. Unitäre Matrizen erhalten Skalarprodukte, denn $\langle Uu|Uv\rangle = \langle u|U^\dagger Uv\rangle = \langle u|v\rangle$. Damit bleiben Längen und Winkel erhalten. Gleichwertig ist: Die Spalten von $U$ bilden eine Orthonormalbasis (M3), denn $U^\dagger U$ enthält genau die Skalarprodukte der Spalten. Beispiele sind Drehungen, Spiegelungen und Basiswechsel zwischen Orthonormalbasen. Die Herleitung prüft $\sigma_y^\dagger\sigma_y = \mathbb 1$.`,
        derive:{ctx:MAT({}), lines:[
          {l:'σ_y† σ_y = (0, -i; i, 0)(0, -i; i, 0)', w:R`$\sigma_y^\dagger = \sigma_y$ eingesetzt (Schritt zuvor)`},
          {l:'= I', w:'Zeile mal Spalte: also unitär', why:{q:R`Was folgt aus $\sigma_y^\dagger\sigma_y = \mathbb 1$?`, opts:[R`$\sigma_y$ ist unitär und erhält alle Längen.`, R`$\sigma_y$ ist nicht hermitesch, sonst wäre das Produkt $\sigma_y$.`, R`$\sigma_y$ bildet jeden Vektor auf sich selbst ab.`], a:0, ex:R`$U^\dagger U = \mathbb 1$ ist die Definition von unitär. Weil $\sigma_y$ auch hermitesch ist, heißt das $\sigma_y^2 = \mathbb 1$: Zweimal angewandt ändert $\sigma_y$ nichts, einmal angewandt schon, denn $\sigma_y(1;\ 0) = (0;\ i)$.`}}
        ]},
        q:{q:R`$U$ ist unitär, und $\langle u|v\rangle = 2 - i$. Was ist $\langle Uu|Uv\rangle$?`,
          opts:[R`$|2 - i|^2 = 5$`, R`$2 - i$`, R`$2 + i$`], a:1,
          ex:R`$\langle Uu|Uv\rangle = \langle u|U^\dagger Uv\rangle = \langle u|v\rangle$. Unitäre Matrizen erhalten das ganze Skalarprodukt, mit Betrag und Phase.`,
          fb:[R`Das Skalarprodukt bleibt eine komplexe Zahl. Ein Betragsquadrat entsteht nirgends.`,
            '',
            R`Konjugiert würde nur, wenn man $u$ und $v$ vertauscht. Hier bleibt die Reihenfolge.`]}},
      {id:'me-t2f', title:R`Antihermitesch, und was ein Faktor $i$ ändert`,
        num:{title:R`Ein Faktor $-i$`, text:R`$K = \begin{pmatrix}0&1\\ -1&0\end{pmatrix}$ ist reell, und $K^\dagger = \begin{pmatrix}0&-1\\ 1&0\end{pmatrix} = -K$. Mit $-i$ multipliziert: $-iK = \begin{pmatrix}0&-i\\ i&0\end{pmatrix} = \sigma_y$, und das ist hermitesch.`},
        text:R`Eine Matrix mit $A^\dagger = -A$ heißt **antihermitesch**. Ihre Diagonale ist rein imaginär, und gegenüber steht das Negative der Konjugierten. Ein Faktor $i$ macht daraus eine hermitesche Matrix, denn $(iA)^\dagger = i^*A^\dagger = (-i)(-A) = iA$. Dasselbe gilt für $-iA$. Der Grund: Adjungieren macht aus einem Vorfaktor $c$ den Faktor $c^*$, und $i^* = -i$ bringt genau das fehlende Vorzeichen. Eine Matrix kann auch mehreres zugleich sein: $\sigma_y$ ist hermitesch und unitär. **Ausblick (M5):** Dasselbe Muster kehrt bei der Ableitung $d/dx$ wieder; erst $-i\,d/dx$ ist hermitesch.`,
        q:{q:R`$A$ ist antihermitesch. Was ist $(2iA)^\dagger$?`,
          opts:[R`$-2iA$`, R`$2iA$`, R`$-2A$`], a:1,
          ex:R`$(2iA)^\dagger = (2i)^*A^\dagger = (-2i)(-A) = 2iA$. Also ist $2iA$ hermitesch.`,
          fb:[R`Beide Vorzeichenwechsel zählen: $(2i)^* = -2i$ und $A^\dagger = -A$. Zusammen ergibt das $(-2i)(-A) = 2iA$.`,
            '',
            R`Der Faktor $i$ verschwindet nicht; er wird nur konjugiert.`]}}
    ]},
    /* ===== Abschnitt 3: Eigenwertgleichung als Bild, Matrixgleichung und Polynom ===== */
    {id:'me-t3', title:'Eigenwerte und Eigenvektoren', steps:[
      {id:'me-t3a', title:'Richtungen, die nur gestreckt werden',
        num:{title:'Drei Pfeile unter derselben Matrix', text:R`Für $A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$:

$$\begin{aligned}A\begin{pmatrix}1\\ 0\end{pmatrix} &= \begin{pmatrix}2\\ 1\end{pmatrix},\\ A\begin{pmatrix}1\\ 1\end{pmatrix} &= \begin{pmatrix}3\\ 3\end{pmatrix} = 3\begin{pmatrix}1\\ 1\end{pmatrix},\\ A\begin{pmatrix}1\\ -1\end{pmatrix} &= \begin{pmatrix}1\\ -1\end{pmatrix}.\end{aligned}$$

Der erste Pfeil kippt. Die beiden anderen behalten ihre Richtung; der eine wird dreimal so lang, der andere bleibt gleich lang.`},
        text:R`Die meisten Vektoren werden von einer Matrix gekippt und gestreckt. Manche Richtungen werden aber nur gestreckt:

$$Av = \lambda v,\qquad v \ne 0.$$

Gelesen: „$A$ mal $v$ ist ein Vielfaches von $v$.“ Dann heißt $v$ **Eigenvektor** und die Zahl $\lambda$, gelesen „lambda“, **[[lex:eigenwertproblem|Eigenwert]]**. Im Beispiel ist $(1;\ 1)$ Eigenvektor zum Eigenwert $3$ und $(1;\ -1)$ Eigenvektor zum Eigenwert $1$.

Im Labor siehst du das an der Ellipse. Die gestrichelten Geraden sind die Eigenrichtungen; sie liegen auf den Halbachsen. Die Pfeile $\lambda_+e_+$ und $\lambda_-e_-$ sind die normierten Eigenvektoren $e_\pm$, mit ihrem Eigenwert gestreckt. Hier sind sie $3$ und $1$ lang.`,
        fig:{lab:'eigen', init:{a:2, b:1, d:2}, caption:R`Dieselbe Matrix wie in Abschnitt 1. Rot gestrichelt die Richtung von $(1;\ 1)$ zum Eigenwert $3$, grün gestrichelt die von $(1;\ -1)$ zum Eigenwert $1$.`},
        q:{q:R`Was bedeutet ein Eigenwert $\lambda = -1$ im Bild?`,
          opts:[R`Der Pfeil wird um $90^\circ$ gedreht.`, R`Der Pfeil schrumpft auf die Länge null.`, R`Er bleibt auf seiner Geraden, kehrt sich aber um.`], a:2,
          ex:R`$Av = -v$: gleiche Gerade, gleiche Länge, umgekehrte Richtung. Eine Spiegelung hat zum Beispiel einen solchen Eigenvektor.`,
          fb:[R`Gedreht wird ein Eigenvektor nie, sonst wäre $Av$ kein Vielfaches von $v$.`,
            R`Länge null gehört zum Eigenwert $0$. Bei $-1$ bleibt die Länge gleich.`,
            '']}},
      {id:'me-t3b', title:'Von der Gleichung zur Determinante',
        num:{title:R`$A - \lambda\mathbb 1$ für zwei Werte von $\lambda$`, text:R`Mit $\lambda = 3$ wird $A - 3\cdot\mathbb 1 = \begin{pmatrix}-1&1\\ 1&-1\end{pmatrix}$. Ihre Determinante ist $1 - 1 = 0$, und $(1;\ 1)$ wird auf null abgebildet. Mit $\lambda = 2$ wird $A - 2\cdot\mathbb 1 = \begin{pmatrix}0&1\\ 1&0\end{pmatrix}$ mit der Determinante $-1$. Hier wird nur der Nullvektor auf null abgebildet.`},
        text:R`Wie findet man die Eigenwerte, ohne zu raten? Schreibe $Av = \lambda v$ als $Av - \lambda\mathbb 1v = 0$, also

$$(A - \lambda\mathbb 1)\,v = 0.$$

Diese Gleichung hat immer die Lösung $v = 0$. Ein Eigenvektor muss aber von null verschieden sein. Eine solche Lösung gibt es genau dann, wenn die Matrix $A - \lambda\mathbb 1$ nicht invertierbar ist. Das heißt: Ihre Determinante verschwindet,

$$\det(A - \lambda\mathbb 1) = 0.$$

Beachte: $\lambda$ wird nur auf der Diagonale abgezogen, denn $\lambda\mathbb 1$ hat nur dort Einträge. Im Beispiel ist $\lambda = 3$ ein Eigenwert, $\lambda = 2$ nicht.`,
        q:{q:R`Warum verlangt man $\det(A - \lambda\mathbb 1) = 0$?`,
          opts:['Weil $\\det(A - \\lambda\\mathbb 1)$ gleich dem Eigenwert $\\lambda$ ist.', 'Weil man aus $\\det(A - \\lambda\\mathbb 1) = 0$ den Eigenvektor $v$ direkt abliest.', 'Weil nur dann $(A - \\lambda\\mathbb 1)v = 0$ eine Lösung $v \\ne 0$ hat.'], a:2,
          ex:R`Ist $A - \lambda\mathbb 1$ invertierbar, folgt aus $(A - \lambda\mathbb 1)v = 0$ sofort $v = 0$. Erst bei Determinante null bleibt Platz für einen Eigenvektor.`,
          fb:[R`Die Determinante von $A - \lambda\mathbb 1$ ist ein Polynom in $\lambda$. Die Eigenwerte sind seine Nullstellen, nicht seine Werte.`,
            R`Die Determinante sagt nur, *ob* es einen Eigenvektor gibt. Ihn selbst findest du danach aus $(A - \lambda\mathbb 1)v = 0$.`,
            '']}},
      {id:'me-t3c', title:'Das charakteristische Polynom',
        num:{title:R`Das Polynom von $A$`, text:R`$$\begin{aligned}&\det\begin{pmatrix}2 - \lambda & 1\\ 1 & 2 - \lambda\end{pmatrix} = (2 - \lambda)^2 - 1\\ &= \lambda^2 - 4\lambda + 3 = (\lambda - 1)(\lambda - 3).\end{aligned}$$

Die Nullstellen sind $1$ und $3$. Kontrolle: $1 + 3 = 4$ ist die Spur von $A$, $1\cdot3 = 3$ ihre Determinante.`},
        text:R`Die linke Seite von $\det(A - \lambda\mathbb 1) = 0$ ist ein Polynom in $\lambda$, das **[[lex:charakteristisches-polynom|charakteristische Polynom]]**. Für eine $n\times n$-Matrix hat es den Grad $n$ und in $\mathbb C$ genau $n$ Nullstellen, wenn man mehrfache mitzählt. Für $2\times2$ lautet es immer

$$\lambda^2 - (\operatorname{tr}A)\,\lambda + \det A = 0.$$

Daraus folgt eine schnelle Kontrolle: Die Summe der Eigenwerte ist die Spur, ihr Produkt die Determinante. Die Tafel stellt die Gestalten der Eigenwertgleichung nebeneinander: als Bild, als Matrixgleichung und als Polynom mit seinem Graphen.`,
        reps:{obj:R`Die Eigenwerte von $A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$`,
          rows:[
            {k:'worte', text:R`Die Richtung von $(1;\ 1)$ bleibt und wird dreimal so lang. Die Richtung von $(1;\ -1)$ bleibt und behält ihre Länge.`},
            {k:'labor', text:R`Mit $a = d = 2$, $b = 1$: Die gestrichelten Eigenrichtungen liegen auf den Halbachsen der Ellipse, die Pfeile „λ₊e₊“ und „λ₋e₋“ sind $3$ und $1$ lang. Die Anzeige meldet $\lambda_+ = 3$ und $\lambda_- = 1$.`},
            {k:'matrix', tex:R`\begin{gathered}\begin{pmatrix}2&1\\ 1&2\end{pmatrix}\begin{pmatrix}1\\ 1\end{pmatrix} = 3\begin{pmatrix}1\\ 1\end{pmatrix},\\ \begin{pmatrix}2&1\\ 1&2\end{pmatrix}\begin{pmatrix}1\\ -1\end{pmatrix} = 1\cdot\begin{pmatrix}1\\ -1\end{pmatrix}\end{gathered}`},
            {k:'formel', tex:R`\begin{aligned}\det(A - \lambda\mathbb 1) &= \lambda^2 - 4\lambda + 3\\ &= (\lambda - 1)(\lambda - 3) = 0\end{aligned}`},
            {k:'graph', plot:{x:[-0.5, 4.5], y:[-1.5, 3.5], xlab:R`\lambda`, ylab:R`p(\lambda)`, ticks:[{x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}]}, f:x => x * x - 4 * x + 3, lab:R`p(\lambda) = \lambda^2 - 4\lambda + 3`,
              cap:R`Die Parabel schneidet die Achse bei $\lambda = 1$ und $\lambda = 3$: Das sind die Eigenwerte. Ihr Scheitel liegt bei der halben Spur, $\lambda = 2$.`}
          ],
          links:[
            {from:'worte', to:'labor', rule:R`Stell $a$, $b$, $d$ ein und suche die Richtungen, in denen ein grauer Strich vom Kreis geradlinig nach außen oder innen läuft, ohne zu kippen.`},
            {from:'labor', to:'matrix', rule:R`Nimm einen Vektor auf einer gestrichelten Geraden, schreibe ihn als Spalte und rechne $Av$ aus. Der Faktor zwischen $Av$ und $v$ ist der Eigenwert.`},
            {from:'matrix', to:'formel', rule:R`Bring $\lambda v$ nach links: $(A - \lambda\mathbb 1)v = 0$. Verlange $\det = 0$ und multipliziere aus.`},
            {from:'formel', to:'graph', rule:R`Zeichne das Polynom über $\lambda$. Jede Nullstelle ist ein Eigenwert; eine doppelte Nullstelle berührt die Achse nur.`}
          ]},
        q:{q:R`Der Graph des charakteristischen Polynoms einer $2\times2$-Matrix $M$ schneidet die $\lambda$-Achse bei $-1$ und bei $3$. Welche Spur und Determinante hat $M$?`, tr:{from:'graph', to:'formel'},
          opts:[R`Spur $-2$, Determinante $3$`, R`Spur $4$, Determinante $-3$`, R`Spur $2$, Determinante $-3$`], a:2,
          ex:R`Spur $= -1 + 3 = 2$, Determinante $= (-1)\cdot3 = -3$. Das Polynom ist $\lambda^2 - 2\lambda - 3$.`,
          fb:[R`Vorzeichen vertauscht: Im Polynom $\lambda^2 - (\operatorname{tr}M)\lambda + \det M$ steht die Spur mit Minus. Die Summe der Nullstellen ist $+2$.`,
            R`Die Spur ist die Summe der Eigenwerte, nicht ihr Abstand: $-1 + 3 = 2$.`,
            '']}},
      {id:'me-t3d', title:R`Die allgemeine Lösung für symmetrische $2\times2$-Matrizen`,
        num:{title:'Zwei Zahlenbeispiele', text:R`Mit $a = d = 2$ und $b = 1$ gibt die Formel unten $\lambda_\pm = 2 \pm \sqrt{0^2 + 1^2} = 2 \pm 1$, also $3$ und $1$ wie zuvor. Mit den Startwerten des Labors, $a = 1{,}5$, $b = 0{,}6$, $d = 0{,}5$, ergibt sich $\lambda_\pm = 1 \pm \sqrt{0{,}25 + 0{,}36} = 1 \pm 0{,}781$.`},
        text:R`Die Herleitung löst das Eigenwertproblem für jede reelle symmetrische Matrix $\begin{pmatrix}a&b\\ b&d\end{pmatrix}$, also genau für die Matrizen des Labors. Das Ergebnis

$$\lambda_\pm = \frac{a+d}{2} \pm \sqrt{\left(\frac{a-d}{2}\right)^2 + b^2}$$

liest sich so: Mitte plus oder minus Abstand. Die Mitte ist die halbe Spur. Unter der Wurzel steht eine Summe von Quadraten, also sind beide Eigenwerte reell. Ihr Abstand $\lambda_+ - \lambda_-$ ist mindestens $2|b|$. Eine Kopplung $b$ neben der Diagonale schiebt die Eigenwerte also auseinander, selbst wenn $a = d$ ist. **Ausblick (Thema 11):** Dort zeigt sich das als Abstoßung zweier Energieniveaus, sobald eine Kopplung sie verbindet.`,
        derive:{ctx:MAT({params:{a:'real', d:'real', b:'pos'}, mats:{A:'(a, b; b, d)'}, unknowns:{λ:{ref:'(a + d)/2 + sqrt(((a - d)/2)^2 + b^2)', alt:['(a + d)/2 - sqrt(((a - d)/2)^2 + b^2)'], kind:'real'}}}), lines:[
          {l:'det(A - λ I) = 0', w:'nichttriviale Lösung von (A − λ𝟙)v = 0'},
          {l:'(a - λ)(d - λ) - b^2 = 0', w:'Determinante: Hauptdiagonale minus Nebendiagonale', why:{q:'Woher kommt $-b^2$?', opts:['Von $ad - bc$ mit den Nebendiagonaleinträgen $b$ und $b$.', 'Von $\\lambda$, das man auch von $b$ abziehen muss.', 'Vom Quadrat der Spur $a + d$.'], a:0, ex:'$\\lambda$ steht nur auf der Diagonale. Die Nebendiagonale liefert $-b\\cdot b$.'}},
          {l:'λ^2 - (a + d) λ + a d - b^2 = 0', w:'ausmultipliziert: Spur und Determinante'},
          {l:'(λ - (a + d)/2)^2 = ((a + d)/2)^2 - a d + b^2', w:'quadratische Ergänzung'},
          {l:'(λ - (a + d)/2)^2 = ((a - d)/2)^2 + b^2', w:'rechte Seite zusammengefasst', why:{q:'Warum gilt $\\left(\\frac{a+d}{2}\\right)^2 - ad = \\left(\\frac{a-d}{2}\\right)^2$?', opts:['Beide Seiten sind gleich $\\frac{a^2 - 2ad + d^2}{4}$.', 'Weil hier $a = d$ vorausgesetzt ist.', 'Das gilt nur für positive $a$ und $d$.'], a:0, ex:'$\\frac{a^2 + 2ad + d^2}{4} - ad = \\frac{a^2 - 2ad + d^2}{4}$. Rechts steht eine Summe von Quadraten, sie ist nie negativ.'}},
          {l:'λ = (a + d)/2 + sqrt(((a - d)/2)^2 + b^2)', w:'Wurzel gezogen: größerer Eigenwert λ₊; mit Minus vor der Wurzel λ₋', why:{q:'Warum sind beide Eigenwerte reell?', opts:['Weil unter der Wurzel eine Summe reeller Quadrate steht.', 'Weil $b > 0$ vorausgesetzt ist.', 'Weil $a + d$ reell ist; die Wurzel spielt keine Rolle.'], a:0, ex:'$\\left(\\frac{a-d}{2}\\right)^2 + b^2 \\ge 0$. Das ist der $2\\times 2$-Fall eines allgemeinen Satzes über hermitesche Matrizen (Abschnitt 4).'}}
        ]},
        q:{q:R`Stell im Labor „a (oben links)“ und „d (unten rechts)“ auf $1$ und erhöhe „b (Nebendiagonale)“ von $0$ aus. Was meldet die Anzeige?`, tr:{from:'formel', to:'labor'},
          opts:[R`Beide Eigenwerte bleiben $1$; nur die Ellipse dreht sich.`, R`$\lambda_\pm = 1 \pm b$: Die Werte spalten symmetrisch auf.`, R`$\lambda_+ = 1 + b$, während $\lambda_- = 1$ fest bleibt.`], a:1,
          ex:R`Mit $a = d$ ist die Wurzel $\sqrt{0 + b^2} = |b|$, also $\lambda_\pm = 1 \pm b$ für $b \ge 0$.`,
          fb:[R`Die Mitte bleibt bei $1$, aber der Abstand wächst: $\lambda_+ - \lambda_- = 2b$.`,
            '',
            R`Beide Eigenwerte bewegen sich, symmetrisch um die halbe Spur $1$. Ihre Summe muss die Spur $2$ bleiben.`]}},
      {id:'me-t3e', title:'Eigenvektoren bestimmen und normieren',
        num:{title:R`Eigenvektor von $\sigma_x$ zu $\lambda = 1$`, text:R`$\sigma_x - 1\cdot\mathbb 1 = \begin{pmatrix}-1&1\\ 1&-1\end{pmatrix}$. Die erste Zeile von $(\sigma_x - \mathbb 1)v = 0$ heißt $-v_1 + v_2 = 0$, also $v_1 = v_2$. Wähle $v = (1;\ 1)$. Normiert: $\|v\| = \sqrt2$, also $\tfrac{1}{\sqrt2}(1;\ 1)$.`},
        text:R`Hast du einen Eigenwert, setzt du ihn in $(A - \lambda\mathbb 1)v = 0$ ein und löst nach $v$. Bei $2\times2$ sagen beide Zeilen dasselbe, denn die Determinante ist null; eine Zeile genügt. Ein Eigenvektor ist nur bis auf einen Faktor bestimmt: Mit $v$ ist auch $5v$ oder $-v$ ein Eigenvektor. Meist normiert man ihn auf $v^\dagger v = 1$. Eine Phase $e^{i\alpha}$ bleibt trotzdem frei. Hat ein Eigenwert mehrere linear unabhängige Eigenvektoren, heißt er **[[lex:entarteter-eigenwert|entartet]]**. Beispiel: Für $\mathbb 1$ ist jeder Vektor Eigenvektor zum Eigenwert $1$.`,
        q:{q:R`Welcher Vektor ist ein Eigenvektor von $\begin{pmatrix}3&0\\ 0&-1\end{pmatrix}$ zum Eigenwert $-1$?`,
          opts:[R`$(1;\ 0)$`, R`$(1;\ -1)$`, R`$(0;\ 5)$`], a:2,
          ex:R`Bei einer Diagonalmatrix sind die Basisvektoren Eigenvektoren. $(0;\ 5)$ ist ein Vielfaches von $(0;\ 1)$; normiert wäre es $(0;\ 1)$.`,
          fb:[R`$(1;\ 0)$ ist Eigenvektor zum Eigenwert $3$: Die Matrix streckt die 1-Richtung um $3$.`,
            R`$\begin{pmatrix}3&0\\ 0&-1\end{pmatrix}(1;\ -1) = (3;\ 1)$ ist kein Vielfaches von $(1;\ -1)$.`,
            '']}},
      {id:'me-t3f', title:'Typischer Fehler: die Diagonale als Eigenwerte ablesen',
        num:{title:'Diagonale abgelesen', text:R`Bei $\begin{pmatrix}1&2\\ 2&1\end{pmatrix}$ zeigt die Diagonale zweimal die $1$. Das charakteristische Polynom ist aber

$$(1 - \lambda)^2 - 4 = \lambda^2 - 2\lambda - 3 = (\lambda - 3)(\lambda + 1).$$

Die Eigenwerte sind $3$ und $-1$. Kontrolle: Summe $2$ = Spur, Produkt $-3$ = Determinante.`},
        text:R`Zwei Abkürzungen gehen oft schief. Erstens: die Diagonaleinträge als Eigenwerte ablesen. Das stimmt nur für Diagonal- und Dreiecksmatrizen, also wenn auf einer Seite der Diagonale nur Nullen stehen. Zweitens: $\lambda$ von allen vier Einträgen abziehen statt nur von der Diagonale. Dann löst du eine ganz andere Gleichung. Ein Test entlarvt beide Fehler: Summe der Eigenwerte gleich Spur, Produkt gleich Determinante. Für $\begin{pmatrix}1&2\\ 2&1\end{pmatrix}$ wären $1$ und $1$ zwar mit der Spur $2$ verträglich. Ihr Produkt $1$ ist aber nicht die Determinante $-3$.`,
        q:{q:R`Jemand liest bei $\begin{pmatrix}4&1\\ 2&3\end{pmatrix}$ die Eigenwerte $4$ und $3$ ab. Was sagt der Test mit Spur und Determinante?`,
          opts:[R`Beide Proben passen, also stimmen $4$ und $3$.`, R`$4\cdot3 = 12 \ne \det = 10$: falsch; richtig sind $5$ und $2$.`, R`Die Spur passt nicht; richtig sind $7$ und $10$.`], a:1,
          ex:R`Spur $7 = 4 + 3$ passt zufällig, aber $\det = 12 - 2 = 10$. Das Polynom $\lambda^2 - 7\lambda + 10 = (\lambda - 5)(\lambda - 2)$ liefert $5$ und $2$.`,
          fb:[R`Die Spur passt, das Produkt nicht: $\det = 4\cdot3 - 1\cdot2 = 10$, nicht $12$.`,
            '',
            R`$7$ und $10$ sind Spur und Determinante selbst, nicht die Eigenwerte. Gesucht sind zwei Zahlen mit Summe $7$ und Produkt $10$.`]}}
    ]},
    /* ===== Abschnitt 4: Spektralsatz ===== */
    {id:'me-t4', title:'Warum hermitesche Matrizen so gutartig sind', steps:[
      {id:'me-t4a', title:'Die Eigenwerte sind reell',
        num:{title:'Eine komplexe hermitesche Matrix', text:R`$H = \begin{pmatrix}3 & 2i\\ -2i & 0\end{pmatrix}$ hat die Spur $3$ und die Determinante $3\cdot0 - (2i)(-2i) = -4$. Das charakteristische Polynom $\lambda^2 - 3\lambda - 4 = (\lambda - 4)(\lambda + 1)$ hat die reellen Nullstellen $4$ und $-1$, obwohl $H$ komplexe Einträge hat.`},
        text:R`Für hermitesche Matrizen sind die Eigenwerte immer reell. Der Beweis braucht nur $\langle u|Av\rangle = \langle A^\dagger u|v\rangle$ aus Abschnitt 2. Sei $Av = \lambda v$ mit $v \ne 0$. Dann ist $\langle v|Av\rangle = \lambda\langle v|v\rangle$. Weil $A = A^\dagger$, darfst du $A$ nach links schieben: $\langle v|Av\rangle = \langle Av|v\rangle = \lambda^*\langle v|v\rangle$. Hier wird $\lambda$ aus dem linken Argument gezogen und dabei konjugiert. Beide Ausdrücke sind gleich, und $\langle v|v\rangle > 0$. Also ist $\lambda = \lambda^*$, und das heißt: $\lambda$ ist reell. Die Herleitung bestätigt es für $H$.`,
        derive:{ctx:MAT({mats:{H:'(3, 2i; -2i, 0)'}, states:{v:'(2i; 1)', w:'(1; 2i)'}, unknowns:{λ:{ref:'4', alt:['-1'], kind:'real'}}}), lines:[
          {l:'det(H - λ I) = 0', w:'H = (3, 2i; −2i, 0) ist hermitesch'},
          {l:'(3 - λ)(0 - λ) - (2i)(-2i) = 0', w:'Determinante: Hauptdiagonale minus Nebendiagonale', why:{q:'Was ergibt $(2i)(-2i)$?', opts:['$-4i^2 = 4$', '$4i^2 = -4$', '$-4i$'], a:0, ex:'$(2i)(-2i) = -4i^2 = +4$. Hier liegt die häufigste Fehlerquelle.'}},
          {l:'λ^2 - 3λ - 4 = 0', w:'ausmultipliziert: Spur 3, Determinante −4'},
          {l:'(λ - 4)(λ + 1) = 0', w:'faktorisiert: Eigenwerte 4 und −1', why:{q:R`Warum mussten reelle Nullstellen herauskommen?`, opts:[R`Weil $H^\dagger = H$ ist.`, R`Weil die Spur $3$ reell ist.`, R`Weil die Diagonale von $H$ reell ist.`], a:0, ex:R`Der Beweis braucht $H^\dagger = H$. Eine reelle Spur oder Diagonale genügt nicht: $\begin{pmatrix}1&1\\ -1&1\end{pmatrix}$ hat die Eigenwerte $1 \pm i$.`}}
        ]},
        q:{q:'Übertrage den Beweis auf eine Matrix mit $A^\\dagger = -A$ (antihermitesch). Was folgt dann für einen Eigenwert $\\lambda$?',
          opts:['$\\lambda = \\lambda^*$: $\\lambda$ ist reell, wie vorher.', '$\\lambda = -\\lambda^*$: $\\lambda$ ist rein imaginär.', '$\\lambda = -\\lambda$: also ist $\\lambda = 0$.'], a:1,
          ex:'Mit $A^\\dagger = -A$ wird $\\langle v|Av\\rangle = \\langle A^\\dagger v|v\\rangle = \\langle -Av|v\\rangle = -\\lambda^*\\langle v|v\\rangle$. Gleichsetzen mit $\\lambda\\langle v|v\\rangle$ gibt $\\lambda = -\\lambda^*$, also $\\operatorname{Re}\\lambda = 0$. Beispiel: $\\begin{pmatrix}0&1\\\\ -1&0\\end{pmatrix}$ hat die Eigenwerte $\\pm i$.',
          fb:['Den Schritt $\\langle v|Av\\rangle = \\langle Av|v\\rangle$ gibt es nur für $A^\\dagger = A$. Hier steht rechts $\\langle -Av|v\\rangle$.', '', 'Beim Herausziehen aus dem linken Argument wird $-\\lambda$ konjugiert: Es entsteht $-\\lambda^*$, nicht $-\\lambda$.']}},
      {id:'me-t4b', title:'Eigenvektoren zu verschiedenen Eigenwerten stehen senkrecht',
        num:{title:R`Die Eigenvektoren von $H$`, text:R`Aus der ersten Zeile von $(H - 4\cdot\mathbb 1)v = 0$, also $-v_1 + 2iv_2 = 0$, folgt $v = (2i;\ 1)$. Ebenso gehört $w = (1;\ 2i)$ zum Eigenwert $-1$. Ihr Skalarprodukt, mit konjugierter linker Zeile:

$$\langle v|w\rangle = (-2i)\cdot1 + 1\cdot2i = 0.$$`},
        text:R`Sei $A$ hermitesch, $Av_1 = \lambda_1v_1$ und $Av_2 = \lambda_2v_2$ mit $\lambda_1 \ne \lambda_2$. Rechne $\langle v_1|Av_2\rangle$ auf zwei Arten. Wirkt $A$ nach rechts, ist es $\lambda_2\langle v_1|v_2\rangle$. Schiebst du $A$ nach links, ist es $\lambda_1^*\langle v_1|v_2\rangle = \lambda_1\langle v_1|v_2\rangle$, denn $\lambda_1$ ist reell. Die Differenz ist $(\lambda_1 - \lambda_2)\langle v_1|v_2\rangle = 0$. Weil $\lambda_1 \ne \lambda_2$, folgt $\langle v_1|v_2\rangle = 0$. Die Herleitung prüft das für $H$. Normiert sind $v/\sqrt5$ und $w/\sqrt5$; zusammen bilden sie eine Orthonormalbasis.`,
        derive:{ctx:MAT({mats:{H:'(3, 2i; -2i, 0)'}, states:{v:'(2i; 1)', w:'(1; 2i)'}}), lines:[
          {l:'H v = (3 · 2i + 2i; -2i · 2i)', w:'v = (2i; 1) eingesetzt: Zeile mal Spalte'},
          {l:'= (8i; 4)', w:'ausgerechnet'},
          {l:'= 4 v', w:'Eigenvektor zum Eigenwert 4', why:{q:'Wie findet man $v = (2i, 1)^T$?', opts:['Erste Zeile von $(H - 4\\mathbb 1)v = 0$: $-v_1 + 2iv_2 = 0$, also $v_1 = 2iv_2$.', 'Man nimmt die erste Spalte von $H$ und teilt durch den Eigenwert.', 'Man rät; ein systematisches Verfahren dafür gibt es nicht.'], a:0, ex:'Mit $v_2 = 1$ ist $v_1 = 2i$. Die zweite Zeile, $-2iv_1 - 4v_2 = 4 - 4 = 0$, ist automatisch erfüllt.'}},
          {l:'H w = -w', w:'w = (1; 2i) zum Eigenwert −1'},
          {l:'⟨v|w⟩ = (-2i)(1) + (1)(2i)', w:'Bra: konjugierte Zeile (−2i, 1)', why:{q:R`Warum steht im Bra $-2i$?`, opts:['Weil der Bra die konjugierte Zeile ist: $(2i)^* = -2i$.', 'Weil man von $w$ den Eintrag $2i$ abzieht.', 'Weil im Bra jeder erste Eintrag negativ wird.'], a:0, ex:R`$\langle v| = v^\dagger = (2i,\ 1)^* = (-2i,\ 1)$. Ohne Konjugation käme $2i + 2i = 4i$ heraus.`}},
          {l:'= 0', w:'v und w stehen senkrecht', why:{q:'Warum musste hier $0$ herauskommen?', opts:['Weil Eigenvektoren von $H = H^\\dagger$ zu verschiedenen Eigenwerten senkrecht stehen.', 'Weil $v$ und $w$ beide normiert sind und deshalb senkrecht stehen.', 'Weil die Spur von $H$ gleich der Summe der beiden Eigenwerte ist.'], a:0, ex:'Das ist der Satz dieses Schritts. Normiert sind $v/\\sqrt5$ und $w/\\sqrt5$; zusammen bilden sie eine Orthonormalbasis des $\\mathbb C^2$.'}}
        ]},
        q:{q:R`$A$ ist hermitesch, $Au = 2u$ und $Aw = 5w$. Was ist $\langle u|w\rangle$?`,
          opts:[R`$\tfrac25$`, R`$0$`, R`Das hängt von $u$ und $w$ ab.`], a:1,
          ex:R`$(2 - 5)\langle u|w\rangle = 0$, also $\langle u|w\rangle = 0$, für jede Wahl der Eigenvektoren.`,
          fb:[R`Die Eigenwerte gehen nicht als Verhältnis ein. Aus $(\lambda_1 - \lambda_2)\langle u|w\rangle = 0$ folgt $\langle u|w\rangle = 0$.`,
            '',
            R`Für hermitesches $A$ und verschiedene Eigenwerte ist das Ergebnis immer $0$, egal welche Vielfachen du wählst.`]}},
      {id:'me-t4c', title:'Genug Eigenvektoren: der Spektralsatz',
        num:{title:'Ein entarteter Eigenwert', text:R`$A = \begin{pmatrix}2&0&0\\ 0&2&0\\ 0&0&5\end{pmatrix}$ hat die Eigenwerte $2, 2, 5$. Jeder Vektor $(x;\ y;\ 0)$ ist Eigenvektor zum Eigenwert $2$, etwa $(1;\ 0;\ 0)$, $(0;\ 1;\ 0)$ oder $\tfrac{1}{\sqrt2}(1;\ 1;\ 0)$. Wähle zwei davon orthonormal und nimm $(0;\ 0;\ 1)$ dazu: eine Orthonormalbasis aus Eigenvektoren.`},
        text:R`Senkrecht stehen reicht nicht. Man braucht auch **genug** Eigenvektoren für eine ganze Basis. Das garantiert der **Spektralsatz**: Jede hermitesche $n\times n$-Matrix hat eine Orthonormalbasis aus $n$ Eigenvektoren, auch wenn Eigenwerte mehrfach vorkommen. Beweisskizze: Das charakteristische Polynom hat in $\mathbb C$ eine Nullstelle, also gibt es einen normierten Eigenvektor $v$. Steht $w$ senkrecht auf $v$, dann auch $Aw$, denn $\langle v|Aw\rangle = \langle Av|w\rangle = \lambda\langle v|w\rangle = 0$. Im restlichen Raum der Dimension $n - 1$ wiederholst du das. Bei Entartung ist die Basis nicht eindeutig. Im **Eigenraum**, der Menge aller Eigenvektoren zu diesem Eigenwert samt Nullvektor, wählst du eine Orthonormalbasis, etwa mit [[lex:gram-schmidt|Gram-Schmidt]] (M3).`,
        q:{q:R`Eine hermitesche $3\times3$-Matrix hat die Eigenwerte $2$, $2$ und $5$. Aus wie vielen Vektoren besteht eine Orthonormalbasis aus ihren Eigenvektoren?`,
          opts:[R`aus $2$, einem je verschiedenen Eigenwert`, R`aus $3$`, R`Das hängt von der Matrix ab.`], a:1,
          ex:R`Der Spektralsatz garantiert eine Orthonormalbasis aus Eigenvektoren, auch bei Entartung. Zum Eigenwert $2$ gehört eine ganze Ebene, aus der du zwei orthonormale Vektoren wählst.`,
          fb:[R`Zum doppelten Eigenwert $2$ gehört eine Ebene von Eigenvektoren. Aus ihr nimmst du zwei, dazu einen zum Eigenwert $5$.`,
            '',
            R`Für hermitesche Matrizen hängt es nicht davon ab: Der Spektralsatz liefert immer $n$ orthonormale Eigenvektoren.`]}},
      {id:'me-t4d', title:'Was der Spektralsatz für eine Messgröße bedeutet',
        num:{title:R`$H$ in Zahlen`, text:R`Die Eigenwerte von $H$ sind $4$ und $-1$, die normierten Eigenvektoren $e_1 = \tfrac{1}{\sqrt5}(2i;\ 1)$ und $e_2 = \tfrac{1}{\sqrt5}(1;\ 2i)$. Der Vektor $(1;\ 0)$ hat darin die Komponenten

$$\langle e_1|(1;\ 0)\rangle = \tfrac{-2i}{\sqrt5},\qquad \langle e_2|(1;\ 0)\rangle = \tfrac{1}{\sqrt5}.$$

Ihre Betragsquadrate $\tfrac45$ und $\tfrac15$ ergeben zusammen $1$.`},
        text:R`Für eine hermitesche Matrix bekommst du also drei Dinge zusammen: reelle Eigenwerte, senkrechte Eigenvektoren und genug davon für eine Basis. Jeder Vektor zerlegt sich dann eindeutig in Eigenvektoren. Die Komponenten bekommst du wie in M3 als Skalarprodukte, ohne Gleichungssystem. Ist der Vektor normiert, ergeben ihre Betragsquadrate zusammen $1$. Die Tafel zeigt, wofür die Physik genau diese drei Eigenschaften braucht. Dafür musst du noch keine Quantenmechanik kennen. Es genügt, die Übersetzung im Kopf zu behalten, bis Thema 6 sie begründet.`,
        reps:{obj:R`Der Spektralsatz an $H = \begin{pmatrix}3 & 2i\\ -2i & 0\end{pmatrix}$`,
          rows:[
            {k:'matrix', tex:R`H = \begin{pmatrix}3 & 2i\\ -2i & 0\end{pmatrix} = H^\dagger`},
            {k:'formel', tex:R`\begin{gathered}He_1 = 4e_1,\quad He_2 = -e_2,\quad \langle e_1|e_2\rangle = 0,\\ \begin{pmatrix}1\\ 0\end{pmatrix} = \tfrac{-2i}{\sqrt5}\,e_1 + \tfrac{1}{\sqrt5}\,e_2\end{gathered}`},
            {k:'worte', text:R`Zwei reelle Streckfaktoren, zwei senkrechte Richtungen. Jeder Vektor ist eine Überlagerung dieser Richtungen, mit Anteilen, deren Betragsquadrate zusammen $1$ ergeben.`},
            {k:'physik', text:R`**Ausblick (Thema 6):** Stellt $H$ eine Messgröße dar, sind $4$ und $-1$ die einzigen möglichen Messwerte. Ein System im Zustand $(1;\ 0)$ liefert $4$ mit der Wahrscheinlichkeit $\tfrac45$ und $-1$ mit $\tfrac15$. Reell, weil Messwerte reell sind; Summe $1$, weil irgendein Wert herauskommt.`}
          ],
          links:[
            {from:'matrix', to:'formel', rule:R`Löse $\det(H - \lambda\mathbb 1) = 0$, setze jeden Eigenwert in $(H - \lambda\mathbb 1)v = 0$ ein und normiere. Die Komponenten eines Vektors $x$ sind $\langle e_n|x\rangle$.`},
            {from:'formel', to:'worte', rule:R`Lies jeden Eigenwert als Streckfaktor seiner Richtung und $\langle e_1|e_2\rangle = 0$ als „senkrecht“.`},
            {from:'worte', to:'physik', rule:R`Ersetze „Streckfaktor“ durch „möglicher Messwert“ und „Betragsquadrat der Komponente“ durch „Wahrscheinlichkeit dieses Werts“.`}
          ]},
        q:{q:R`Ein normierter Vektor hat in der Eigenbasis von $H$ die Komponente $0{,}6$ längs $e_1$ (Eigenwert $4$) und $0{,}8i$ längs $e_2$ (Eigenwert $-1$). Welche Wahrscheinlichkeit sagt die Übersetzung für den Messwert $-1$ voraus?`, tr:{from:'formel', to:'physik'},
          opts:[R`$0{,}8$`, R`$0{,}36$`, R`$0{,}64$`, R`$-0{,}64$`], a:2,
          ex:R`Betragsquadrat der Komponente längs $e_2$: $|0{,}8i|^2 = 0{,}64$. Zusammen mit $0{,}6^2 = 0{,}36$ ergibt sich $1$.`,
          fb:[R`$0{,}8$ ist der Betrag der Komponente, nicht ihr Quadrat. Wahrscheinlichkeiten sind Betragsquadrate.`,
            R`$0{,}36$ gehört zur Komponente längs $e_1$, also zum Messwert $4$.`,
            '',
            R`Das Betragsquadrat ist $(0{,}8i)^*\cdot0{,}8i = 0{,}64$, nicht $(0{,}8i)^2$. Eine Wahrscheinlichkeit ist nie negativ.`]}},
      {id:'me-t4e', title:'Was ohne Hermitezität schiefgehen kann',
        num:{title:'Zwei reelle Matrizen', text:R`Die Drehung $D = \begin{pmatrix}0&-1\\ 1&0\end{pmatrix}$ hat das Polynom $\lambda^2 + 1$ und die Eigenwerte $\pm i$: Keine Richtung der Ebene bleibt. Die Matrix $N = \begin{pmatrix}1&1\\ 0&1\end{pmatrix}$ hat das Polynom $(\lambda - 1)^2$. Aus $(N - \mathbb 1)v = (v_2;\ 0) = 0$ folgt $v_2 = 0$: Es gibt nur die Eigenvektoren $c\,(1;\ 0)$.`},
        text:R`Ohne Hermitezität kann zweierlei schiefgehen. Die Eigenwerte können komplex sein, wie bei der Drehung $D$. Oder es gibt zu wenige Eigenvektoren, wie bei $N$. Dann gibt es keine Basis aus Eigenvektoren; man sagt, $N$ ist [[lex:nicht-diagonalisierbar|nicht diagonalisierbar]]. Abschnitt 5 erklärt das Wort. Genau der Schritt aus der Beweisskizze scheitert: $(0;\ 1)$ steht senkrecht auf dem Eigenvektor $(1;\ 0)$, aber $N(0;\ 1) = (1;\ 1)$ nicht mehr. Reelle Einträge schützen davor nicht, Hermitezität schon. Umgekehrt ist Hermitezität für reelle Eigenwerte hinreichend, aber nicht notwendig: $N$ hat den reellen Eigenwert $1$.`,
        q:{q:R`Was gilt für $\begin{pmatrix}2&1\\ 0&2\end{pmatrix}$?`,
          opts:[R`Sie hat eine Eigenbasis, weil sie reell ist.`, R`Sie hat nur eine Eigenrichtung, also keine Eigenbasis.`, R`Sie hat eine Eigenbasis mit den Eigenwerten $2$ und $1$.`], a:1,
          ex:R`Der Eigenwert $2$ ist doppelt, und $(A - 2\cdot\mathbb 1)v = (v_2;\ 0) = 0$ liefert nur $v \propto (1;\ 0)$. Die Matrix ist nicht hermitesch, der Spektralsatz greift nicht.`,
          fb:[R`Reelle Einträge garantieren keine Eigenbasis. Hier gibt es nur die Richtung $(1;\ 0)$.`,
            '',
            R`Eine Dreiecksmatrix hat ihre Diagonale als Eigenwerte: zweimal die $2$. Die $1$ steht neben der Diagonale.`]}},
      {id:'me-t4f', title:'Typischer Fehler: Orthogonalität ohne Konjugation prüfen',
        num:{title:R`Die Eigenvektoren von $H$ noch einmal`, text:R`Ohne Konjugation: $2i\cdot1 + 1\cdot2i = 4i$ – als stünden $v = (2i;\ 1)$ und $w = (1;\ 2i)$ nicht senkrecht. Mit Konjugation: $\langle v|w\rangle = (-2i)\cdot1 + 1\cdot2i = 0$.`},
        text:R`Beim Nachprüfen der Orthogonalität passiert der häufigste Fehler: Die linke Spalte wird nicht konjugiert. Bei reellen Vektoren merkst du nichts, bei komplexen kommt Unsinn heraus. Dann scheint der Satz aus Schritt 2 verletzt, obwohl nur die Rechnung falsch ist. Merke: Ein Skalarprodukt ist Bra mal Ket, und der Bra ist die *konjugierte* Zeile. Ein zweiter Fehlschluss betrifft den Spektralsatz selbst: „Hermitesch heißt immer, es gibt eine Eigenbasis.“ Für Matrizen stimmt das. **Ausblick (M5):** In Räumen von Funktionen gibt es hermitesche Operatoren ohne eine einzige normierbare Eigenfunktion.`,
        q:{q:R`Jemand prüft für die Eigenvektoren $(1;\ i)$ und $(1;\ -i)$ von $\sigma_y$: $1\cdot1 + i\cdot(-i) = 2 \ne 0$, also nicht senkrecht. Was ist falsch?`,
          opts:[R`Die linke Spalte muss konjugiert werden: $1 + (-i)(-i) = 0$.`, R`Nichts; $\sigma_y$ ist eben nicht hermitesch.`, R`Zu verschiedenen Eigenwerten müssen Eigenvektoren nicht senkrecht stehen.`], a:0,
          ex:R`$\langle(1;\ i)|(1;\ -i)\rangle = 1^*\cdot1 + i^*\cdot(-i) = 1 + (-i)(-i) = 1 - 1 = 0$.`,
          fb:['',
            R`$\sigma_y$ ist hermitesch (Abschnitt 2). Der Fehler steckt in der fehlenden Konjugation.`,
            R`Für hermitesche Matrizen müssen sie es, das ist der Satz aus Schritt 2. Hier sind die Eigenwerte $+1$ und $-1$.`]}}
    ]},
    /* ===== Abschnitt 5: Diagonalisieren, Eigenbasis, Spektralzerlegung ===== */
    {id:'me-t5', title:'Diagonalisieren und Spektralzerlegung', steps:[
      {id:'me-t5a', title:'Eigenvektoren als Spalten: die Matrix U',
        num:{title:R`$A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$`, text:R`Die normierten Eigenvektoren sind $|{+x}\rangle = \tfrac{1}{\sqrt2}(1;\ 1)$ zu $3$ und $|{-x}\rangle = \tfrac{1}{\sqrt2}(1;\ -1)$ zu $1$. Die Namen kommen von $\sigma_x$, das dieselben Eigenvektoren hat. Als Spalten nebeneinander:

$$U = \tfrac{1}{\sqrt2}\begin{pmatrix}1&1\\ 1&-1\end{pmatrix},\qquad AU = \tfrac{1}{\sqrt2}\begin{pmatrix}3&1\\ 3&-1\end{pmatrix} = U\begin{pmatrix}3&0\\ 0&1\end{pmatrix}.$$`},
        text:R`Schreib die orthonormalen Eigenvektoren einer hermiteschen Matrix als Spalten in eine Matrix $U$. Weil die Spalten eine Orthonormalbasis bilden, ist $U$ unitär (Abschnitt 2). Spalte für Spalte gilt $AU = UD$ mit der Diagonalmatrix $D = \operatorname{diag}(\lambda_1, \dots, \lambda_n)$ der Eigenwerte. Multiplizierst du von links mit $U^\dagger$, folgt

$$D = U^\dagger AU,\qquad A = UDU^\dagger.$$

Das ist die **[[lex:diagonalisierung|Diagonalisierung]]**. Die Reihenfolge der Spalten in $U$ legt die Reihenfolge der Eigenwerte in $D$ fest. Die Herleitung rechnet es für $A$ nach.`,
        derive:{ctx:MAT({mats:{A:'(2, 1; 1, 2)', U:'(1, 1; 1, -1)/sqrt(2)'}}), lines:[
          {l:'A |+x⟩ = 3 |+x⟩', w:'A = 2·𝟙 + σ_x: Eigenvektoren von σ_x; ebenso A|−x⟩ = |−x⟩'},
          {l:'U = (1, 1; 1, -1)/sqrt(2)', w:'Spalten: |+x⟩ und |−x⟩', why:{q:'Warum ist $U$ unitär?', opts:['Weil seine Spalten normiert und zueinander orthogonal sind.', 'Weil alle seine Einträge den gleichen Betrag $1/\\sqrt2$ haben.', 'Weil $U$ reell und symmetrisch ist, also hermitesch.'], a:0, ex:'$U^\\dagger U$ enthält genau die Skalarprodukte der Spalten: $\\langle{+x}|{+x}\\rangle = 1$, $\\langle{+x}|{-x}\\rangle = 0$ und so weiter.'}},
          {l:'U† A U = (3, 0; 0, 1)', w:'in der Eigenbasis diagonal'}
        ]},
        q:{q:R`Du vertauschst die beiden Spalten von $U$. Was wird dann aus $D = U^\dagger AU$?`,
          opts:[R`$D$ bleibt $\operatorname{diag}(3, 1)$.`, R`$D$ wird $\operatorname{diag}(1, 3)$.`, R`$U^\dagger AU$ ist dann nicht mehr diagonal.`], a:1,
          ex:R`Die $j$-te Spalte von $U$ gehört zum $j$-ten Diagonaleintrag von $D$. Steht $|{-x}\rangle$ vorn, steht auch der Eigenwert $1$ vorn.`,
          fb:[R`Die Reihenfolge in $D$ folgt der Reihenfolge der Spalten. Vertauschen der Spalten vertauscht die Eigenwerte.`,
            '',
            R`Die Spalten sind weiter Eigenvektoren, also bleibt $D$ diagonal; nur die Reihenfolge ändert sich.`]}},
      {id:'me-t5b', title:'In der Eigenbasis wirkt A nur als Streckung',
        pre:{from:'m-vektor', seg:'mv-t3', title:'Komponenten in einer Orthonormalbasis', text:R`In einer Orthonormalbasis $e_1, e_2$ ist die Komponente $c_i = \langle e_i|v\rangle$, ohne Gleichungssystem. Mini-Beispiel: $e_{1,2} = \tfrac{1}{\sqrt2}(1;\ \pm1)$ und $v = (2;\ 0)$ geben $c_1 = c_2 = \sqrt2$, also $v = \sqrt2\,e_1 + \sqrt2\,e_2$.`},
        num:{title:'Zwei Wege, ein Ergebnis', text:R`$v = (2;\ 0)$ hat in der Eigenbasis die Komponenten $c_\pm = \langle{\pm x}|v\rangle = \sqrt2$. $A$ streckt sie zu $3\sqrt2$ und $1\cdot\sqrt2$. Zurück in der Standardbasis:

$$3\sqrt2\,|{+x}\rangle + \sqrt2\,|{-x}\rangle = (3;\ 3) + (1;\ -1) = (4;\ 2).$$

Direkt gerechnet: $A\,(2;\ 0) = (4;\ 2)$.`},
        text:R`Lies $A = UDU^\dagger$ von rechts nach links. $U^\dagger$ rechnet die Komponenten von $v$ in die Eigenbasis um, denn die Zeilen von $U^\dagger$ sind die Bras $\langle{\pm x}|$. Dort wirkt $D$: Jede Komponente wird mit ihrem Eigenwert multipliziert, sonst passiert nichts. $U$ setzt die Eigenvektoren wieder zusammen. Dieselbe Abbildung hat also zwei Matrizen: in der Standardbasis die volle Matrix $A$, in der Eigenbasis die Diagonalmatrix $D$. Im Labor siehst du das an der Ellipse. Längs der gestrichelten Achsen wird nur gestreckt, um $3$ und um $1$.`,
        reps:{obj:R`Eine Abbildung, zwei Matrizen: $A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$`,
          rows:[
            {k:'matrix', tex:R`\begin{gathered}\text{Standardbasis:}\quad A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix},\\ A\begin{pmatrix}2\\ 0\end{pmatrix} = \begin{pmatrix}4\\ 2\end{pmatrix}\end{gathered}`},
            {k:'worte', text:R`Streckt die Richtung $(1;\ 1)$ um $3$ und lässt die Richtung $(1;\ -1)$, wie sie ist. Jeder andere Pfeil kippt, weil seine beiden Anteile verschieden stark gestreckt werden.`},
            {k:'labor', text:R`Mit $a = d = 2$, $b = 1$ hat die Ellipse die Halbachsen $3$ und $1$, längs der gestrichelten Diagonalen.`},
            {k:'formel', tex:R`\begin{gathered}\text{Eigenbasis:}\quad U^\dagger AU = D = \begin{pmatrix}3&0\\ 0&1\end{pmatrix},\\ D\begin{pmatrix}\sqrt2\\ \sqrt2\end{pmatrix} = \begin{pmatrix}3\sqrt2\\ \sqrt2\end{pmatrix}\end{gathered}`}
          ],
          links:[
            {from:'matrix', to:'worte', rule:R`Rechne $A$ mal einige Pfeile. Suche die Pfeile, deren Bild ein Vielfaches ist; die Faktoren sind die Streckungen.`},
            {from:'worte', to:'labor', rule:R`Stell die Einträge ein. Die Halbachsen der Ellipse liegen in den Richtungen, die nur gestreckt werden; ihre Längen sind die Streckfaktoren.`},
            {from:'labor', to:'formel', rule:R`Nimm die Achsenrichtungen, normiert, als Spalten von $U$. Rechne die Komponenten mit $U^\dagger$ um und multipliziere jede mit ihrem Streckfaktor.`},
            {from:'formel', to:'matrix', rule:R`Zurück mit $A = UDU^\dagger$: Komponenten in der Eigenbasis strecken, dann mit $U$ wieder zusammensetzen.`}
          ]},
        q:{q:R`Welche Matrix hat $\begin{pmatrix}3&1\\ 1&3\end{pmatrix}$ in ihrer Eigenbasis $|{\pm x}\rangle$?`, tr:{from:'matrix', to:'formel'},
          opts:[R`$\operatorname{diag}(3, 3)$`, R`$\operatorname{diag}(3, 1)$`, R`$\operatorname{diag}(4, 2)$`], a:2,
          ex:R`$\begin{pmatrix}3&1\\ 1&3\end{pmatrix} = 3\cdot\mathbb 1 + \sigma_x$ streckt $|{+x}\rangle$ um $4$ und $|{-x}\rangle$ um $2$.`,
          fb:[R`Das ist die Diagonale in der Standardbasis. In der Eigenbasis stehen die Eigenwerte: Summe $6$, Produkt $\det = 8$.`,
            R`Das sind die Eigenwerte von $A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$. Hier ist die Diagonale um $1$ größer, also auch beide Eigenwerte.`,
            '']}},
      {id:'me-t5c', title:'Die Spektralzerlegung',
        pre:{from:'m-vektor', seg:'mv-t4', title:'Projektor', text:R`Die Projektion auf einen normierten Vektor $e$ ist $\langle e|v\rangle\,e$. Als Matrix ist das $P_e = |e\rangle\langle e|$, Spalte mal Zeile. Mini-Beispiel: $e = \tfrac{1}{\sqrt2}(1;\ 1)$ gibt $P_e = \tfrac12\begin{pmatrix}1&1\\ 1&1\end{pmatrix}$ und $P_e(2;\ 0) = (1;\ 1)$.`},
        num:{title:'Zwei Projektoren, gewichtet', text:R`$$\begin{aligned}&3\,|{+x}\rangle\langle{+x}| + 1\,|{-x}\rangle\langle{-x}|\\ &= \tfrac32\begin{pmatrix}1&1\\ 1&1\end{pmatrix} + \tfrac12\begin{pmatrix}1&-1\\ -1&1\end{pmatrix}\\ &= \begin{pmatrix}2&1\\ 1&2\end{pmatrix} = A.\end{aligned}$$`},
        text:R`Gleichwertig zu $A = UDU^\dagger$, und in der Physik üblicher, ist die **Spektralzerlegung**

$$A = \sum_n\lambda_n\,|n\rangle\langle n|.$$

Gelesen: „$A$ ist die Summe über alle Eigenwerte, jeweils mal dem Projektor auf ihre Eigenrichtung.“ Jedes $P_n = |n\rangle\langle n|$ ist ein [[lex:projektion|Projektor]], und zusammen ergeben sie $\sum_nP_n = \mathbb 1$. Auf einen Vektor mit den Komponenten $c_n = \langle n|v\rangle$ wirkt $A$ dann so: $Av = \sum_n\lambda_nc_n|n\rangle$. Jede Komponente wird mit ihrem Eigenwert multipliziert. **Ausblick (Thema 3 und 6):** Genau so rechnet die Quantenmechanik mit Entwicklungskoeffizienten.`,
        derive:{ctx:MAT({mats:{A:'(2, 1; 1, 2)'}}), lines:[
          {l:'A = 3 |+x⟩⟨+x| + 1 |-x⟩⟨-x|', w:'Spektralzerlegung', why:{q:'Was bedeutet diese Zeile?', opts:['$A$ streckt den Anteil längs $|{+x}\\rangle$ um $3$, den längs $|{-x}\\rangle$ um $1$.', '$A$ ist die Summe seiner beiden Eigenwerte $3$ und $1$.', '$A$ hat nur zwei von null verschiedene Einträge.'], a:0, ex:'$|n\\rangle\\langle n|$ projiziert auf die Eigenrichtung; das Beispiel oben multipliziert es aus.'}}
        ]},
        q:{q:R`$A = 2|1\rangle\langle1| - |2\rangle\langle2|$ mit orthonormalen $|1\rangle, |2\rangle$. Was ist $A(|1\rangle + |2\rangle)$?`,
          opts:[R`$|1\rangle + |2\rangle$`, R`$(2 - 1)(|1\rangle + |2\rangle)$`, R`$2|1\rangle - |2\rangle$`], a:2,
          ex:R`Jede Komponente wird mit ihrem Eigenwert multipliziert: $2\cdot1$ bei $|1\rangle$, $(-1)\cdot1$ bei $|2\rangle$.`,
          fb:[R`$|1\rangle + |2\rangle$ ist kein Eigenvektor; die beiden Anteile werden verschieden gestreckt.`,
            R`Die Eigenwerte werden nicht addiert. Jeder wirkt nur auf seine eigene Komponente.`,
            '']}},
      {id:'me-t5d', title:'Vertauschende Matrizen haben eine gemeinsame Eigenbasis',
        num:{title:R`$A$ und $\sigma_x$`, text:R`$A = 2\cdot\mathbb 1 + \sigma_x$ vertauscht mit $\sigma_x$: $A\sigma_x = 2\sigma_x + \sigma_x^2 = \sigma_xA$. Beide haben die Eigenvektoren $|{\pm x}\rangle$, mit den Eigenwerten $3$ und $1$ für $A$ und $+1$ und $-1$ für $\sigma_x$.`},
        text:R`Gilt $[A, B] = 0$ für hermitesche $A$ und $B$, dann haben sie eine [[lex:gemeinsame-eigenbasis|gemeinsame Eigenbasis]]. Der Kern des Arguments: Aus $Av = \lambda v$ folgt $A(Bv) = BAv = \lambda\,(Bv)$. Also ist $Bv$ wieder Eigenvektor von $A$ zum selben Eigenwert, oder null. $B$ bildet jeden Eigenraum von $A$ in sich ab. Ist der Eigenwert nicht entartet, muss $Bv$ ein Vielfaches von $v$ sein: $v$ ist auch Eigenvektor von $B$. Ist er entartet, diagonalisierst du $B$ innerhalb des Eigenraums. **Ausblick (Thema 6):** Vertauschende Messgrößen lassen sich gemeinsam scharf messen.`,
        q:{q:R`$A$ und $B$ sind hermitesch, $[A, B] = 0$, und alle Eigenwerte von $A$ sind verschieden. Was folgt?`,
          opts:[R`$A$ und $B$ haben dieselben Eigenwerte.`, R`Jeder Eigenvektor von $A$ ist auch Eigenvektor von $B$.`, R`Jeder Eigenvektor von $B$ ist einer von $A$, nicht umgekehrt.`], a:1,
          ex:R`Ohne Entartung ist jeder Eigenraum von $A$ eindimensional, und $B$ bildet ihn in sich ab: $Bv = \mu v$. Die Eigenwerte $\mu$ von $B$ können ganz andere sein.`,
          fb:[R`Gemeinsam sind die Eigenvektoren, nicht die Eigenwerte. Im Beispiel hat $A$ die Werte $3, 1$, $\sigma_x$ die Werte $\pm1$.`,
            '',
            R`Umgekehrt herum: Weil $A$ nicht entartet ist, ist jeder Eigenvektor von $A$ einer von $B$. Hat $B$ einen entarteten Eigenwert, gilt die Umkehrung nicht.`]}},
      {id:'me-t5e', title:'Typischer Fehler: vertauschbar heißt nicht „jeder Eigenvektor gemeinsam“',
        num:{title:R`$\mathbb 1$ und $\sigma_x$`, text:R`$\mathbb 1$ vertauscht mit $\sigma_x$. Für $\mathbb 1$ ist jeder Vektor Eigenvektor, auch $(1;\ 0)$. Aber $\sigma_x(1;\ 0) = (0;\ 1)$ ist kein Vielfaches von $(1;\ 0)$. Gemeinsam sind nur passend gewählte Eigenvektoren, hier $|{\pm x}\rangle$.`},
        text:R`Ein häufig falsch zitierter Satz lautet: „Vertauschen $A$ und $B$, dann ist jeder Eigenvektor von $A$ auch einer von $B$.“ Das stimmt nur, wenn $A$ keinen entarteten Eigenwert hat. Bei Entartung gibt es in einem Eigenraum viele Basen, und nur manche davon bestehen auch aus Eigenvektoren von $B$. Das extreme Beispiel ist $\mathbb 1$: Sie vertauscht mit allem, und ihr einziger Eigenwert $1$ ist so entartet wie möglich. Richtig ist also: Es *gibt* eine gemeinsame Eigenbasis. Du musst sie passend wählen.`,
        q:{q:R`$A = \operatorname{diag}(5, 5)$ und $B = \sigma_x$ vertauschen. Ist $(1;\ 0)$ ein gemeinsamer Eigenvektor?`,
          opts:[R`Ja, denn $A$ und $B$ vertauschen.`, R`Nein; gemeinsam sind etwa $\tfrac{1}{\sqrt2}(1;\ \pm1)$.`, R`Nein; die beiden haben gar keinen gemeinsamen Eigenvektor.`], a:1,
          ex:R`$(1;\ 0)$ ist Eigenvektor von $A = 5\cdot\mathbb 1$, aber nicht von $\sigma_x$. Die Eigenvektoren von $\sigma_x$ sind auch Eigenvektoren von $A$.`,
          fb:[R`Vertauschen garantiert nur, dass es eine gemeinsame Basis *gibt*. $\sigma_x(1;\ 0) = (0;\ 1)$, also ist $(1;\ 0)$ kein Eigenvektor von $B$.`,
            '',
            R`Die gemeinsame Eigenbasis existiert: $|{\pm x}\rangle$ sind Eigenvektoren von $\sigma_x$ und, wie jeder Vektor, von $5\cdot\mathbb 1$.`]}}
    ]},
    /* ===== Abschnitt 6: Matrixfunktionen, Zeitentwicklung ===== */
    {id:'me-t6', title:'Funktionen von Matrizen und Zeitentwicklung', steps:[
      {id:'me-t6a', title:'Potenzen über die Eigenbasis',
        num:{title:R`$A^2$ auf zwei Wegen`, text:R`Direkt: $A^2 = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}\begin{pmatrix}2&1\\ 1&2\end{pmatrix} = \begin{pmatrix}5&4\\ 4&5\end{pmatrix}$. Über die Eigenbasis werden die Eigenwerte $3$ und $1$ quadriert:

$$\begin{aligned}A^2 &= 9\,|{+x}\rangle\langle{+x}| + 1\,|{-x}\rangle\langle{-x}|\\ &= \tfrac92\begin{pmatrix}1&1\\ 1&1\end{pmatrix} + \tfrac12\begin{pmatrix}1&-1\\ -1&1\end{pmatrix}\\ &= \begin{pmatrix}5&4\\ 4&5\end{pmatrix}.\end{aligned}$$`},
        text:R`Aus $A = UDU^\dagger$ und $U^\dagger U = \mathbb 1$ folgt

$$A^2 = UDU^\dagger UDU^\dagger = UD^2U^\dagger,$$

und ebenso $A^k = UD^kU^\dagger$ für jede Potenz. In der Mitte hebt sich $U^\dagger U$ jedes Mal weg. Eine Diagonalmatrix zu potenzieren ist leicht: Du potenzierst die Diagonaleinträge. In der Spektralzerlegung heißt das $A^k = \sum_n\lambda_n^k\,|n\rangle\langle n|$. Die Eigenvektoren bleiben, nur die Eigenwerte werden potenziert. Für $A^{10}$ sparst du so neun Matrixprodukte.`,
        derive:{ctx:MAT({mats:{A:'(2, 1; 1, 2)'}}), lines:[
          {l:'A^2 = 9 |+x⟩⟨+x| + 1 |-x⟩⟨-x|', w:'f(λ) = λ² auf die Eigenwerte 3 und 1', why:{q:'Warum stehen hier $9$ und $1$?', opts:['$A^2 = UD^2U^\\dagger$: Die Eigenwerte $3$ und $1$ werden quadriert.', 'Man quadriert die Einträge $2$ und $1$ der Matrix $A$.', 'Weil $\\operatorname{tr}A^2 = 9 + 1$ sein muss.'], a:0, ex:'Die Eigenvektoren ändern sich nicht, die Eigenwerte werden quadriert.'}},
          {l:'= (5, 4; 4, 5)', w:'ausmultipliziert'},
          {l:'A A = (5, 4; 4, 5)', w:'Kontrolle durch direktes Multiplizieren'}
        ]},
        q:{q:R`Welche Eigenwerte hat $A^3$ für $A = \begin{pmatrix}2&1\\ 1&2\end{pmatrix}$?`,
          opts:[R`$8$ und $1$`, R`$27$ und $1$`, R`$9$ und $3$`], a:1,
          ex:R`Die Eigenwerte $3$ und $1$ werden in die dritte Potenz gehoben: $27$ und $1$.`,
          fb:[R`Das sind die dritten Potenzen der Einträge $2$ und $1$. Potenziert werden die Eigenwerte, nicht die Einträge.`,
            '',
            R`Das ist $3$ mal die Eigenwerte. Bei $A^3$ werden sie dreimal miteinander multipliziert: $3^3 = 27$.`]}},
      {id:'me-t6b', title:'Die Exponentialfunktion einer Matrix',
        num:{title:R`$e^{itA}$`, text:R`Mit $f(\lambda) = e^{it\lambda}$ auf die Eigenwerte $3$ und $1$:

$$e^{itA} = e^{3it}|{+x}\rangle\langle{+x}| + e^{it}|{-x}\rangle\langle{-x}| = \tfrac12\begin{pmatrix}e^{3it} + e^{it} & e^{3it} - e^{it}\\ e^{3it} - e^{it} & e^{3it} + e^{it}\end{pmatrix}.$$

Bei $t = 0$ ergibt das $\mathbb 1$, wie es sein muss.`},
        text:R`Eine **[[lex:matrixfunktion|Funktion einer Matrix]]** definiert man über die Potenzreihe, etwa $e^A = \sum_{k=0}^\infty A^k/k!$. Ausrechnen willst du diese Reihe nicht. Weil jede Potenz in der Eigenbasis nur die Eigenwerte potenziert, gilt für jede Potenzreihe

$$f(A) = U f(D)\,U^\dagger = \sum_nf(\lambda_n)\,|n\rangle\langle n|.$$

Gelesen: „$f$ wirkt auf die Eigenwerte, die Eigenvektoren bleiben.“ Für hermitesches $A$ und reelles $t$ ist $e^{itA}$ unitär. Denn die Eigenwerte $e^{it\lambda_n}$ haben den Betrag $1$, und die Eigenvektoren bilden eine Orthonormalbasis.`,
        derive:{ctx:MAT({mats:{A:'(2, 1; 1, 2)'}}), lines:[
          {l:'e^(i t A) = e^(3 i t) |+x⟩⟨+x| + e^(i t) |-x⟩⟨-x|', w:'$f(\\lambda) = e^{it\\lambda}$', why:{q:'Warum ist $e^{itA}$ unitär?', opts:['Weil die Eigenwerte $e^{3it}$ und $e^{it}$ den Betrag $1$ haben.', 'Weil $A$ nur reelle Einträge hat und symmetrisch ist.', 'Weil jede Exponentialfunktion einer Matrix unitär ist.'], a:0, ex:'Das liegt an der Hermitezität von $A$: Die Eigenvektoren bilden eine Orthonormalbasis, und reelle Eigenwerte $\\lambda_n$ ergeben $|e^{it\\lambda_n}| = 1$. Für $e^A$ selbst gilt das nicht, es hat die Eigenwerte $e^3$ und $e$.'}},
          {l:'= (e^(3 i t) + e^(i t), e^(3 i t) - e^(i t); e^(3 i t) - e^(i t), e^(3 i t) + e^(i t))/2', w:'Projektoren ausmultipliziert'}
        ]},
        q:{q:R`$A|n\rangle = \lambda_n|n\rangle$. Was ist $f(A)\,|n\rangle$?`,
          opts:[R`$\lambda_n\,f(|n\rangle)$`, R`$f(\lambda_n)\,|n\rangle$`, R`$f(A_{nn})\,|n\rangle$`], a:1,
          ex:R`Auf einen Eigenvektor wirkt jede Potenz $A^k$ als $\lambda_n^k$. Die Reihe von $f$ wird deshalb zu $f(\lambda_n)$.`,
          fb:[R`$f$ wirkt auf Zahlen, nicht auf Vektoren. Der Vektor $|n\rangle$ bleibt, wie er ist.`,
            '',
            R`Der Diagonaleintrag $A_{nn}$ ist nur in der Eigenbasis gleich $\lambda_n$. Allgemein zählt der Eigenwert.`]}},
      {id:'me-t6c', title:'Typischer Fehler: die Funktion auf jeden Eintrag',
        num:{title:R`$e^{i\pi\sigma_z/2}$`, text:R`$\sigma_z = \operatorname{diag}(1, -1)$ ist schon diagonal, also $e^{i\pi\sigma_z/2} = \operatorname{diag}(e^{i\pi/2}, e^{-i\pi/2}) = \operatorname{diag}(i, -i) = i\sigma_z$. Eintragsweise käme $\begin{pmatrix}e^{i\pi/2} & e^0\\ e^0 & e^{-i\pi/2}\end{pmatrix} = \begin{pmatrix}i & 1\\ 1 & -i\end{pmatrix}$ heraus – mit Einsen, wo Nullen stehen müssen.`},
        text:R`Der häufigste Fehler bei Matrixfunktionen: $f$ auf jeden Eintrag anwenden. $f(A)$ ist aber **nicht** die Matrix der Werte $f(A_{ij})$. Schon $A^2$ zeigt das: $\begin{pmatrix}2&1\\ 1&2\end{pmatrix}^2$ hat die Einträge $5$ und $4$, nicht $4$ und $1$. Nur bei Diagonalmatrizen stimmt die eintragsweise Rechnung auf der Diagonale. Neben der Diagonale muss die $0$ bleiben, und $e^0 = 1$ ist keine $0$. Ein zweiter Fehler ist, die Reihe nach dem ersten Glied abzubrechen: $e^A \approx \mathbb 1 + A$ ist nur eine Näherung für kleine $A$.`,
        q:{q:R`Was ist $e^{(\ln2)\,\sigma_z}$?`,
          opts:[R`$\begin{pmatrix}2&1\\ 1&\tfrac12\end{pmatrix}$`, R`$\operatorname{diag}(2, \tfrac12)$`, R`$\mathbb 1 + (\ln2)\,\sigma_z$`], a:1,
          ex:R`$\sigma_z$ ist diagonal mit den Eigenwerten $\pm1$: $\operatorname{diag}(e^{\ln2}, e^{-\ln2}) = \operatorname{diag}(2, \tfrac12)$.`,
          fb:[R`Eintragsweise gerechnet: Neben der Diagonale steht $e^0 = 1$ statt $0$.`,
            '',
            R`Das ist nur die erste Ordnung der Reihe. Exakt ist $\operatorname{diag}(2, \tfrac12)$, nicht $\operatorname{diag}(1{,}69;\ 0{,}31)$.`]}},
      {id:'me-t6d', title:'Ein Sonderfall: wenn das Quadrat 1 ist',
        pre:{from:'m-komplex', seg:'mk-t2', title:'Euler-Formel', text:R`$e^{i\theta} = \cos\theta + i\sin\theta$. Das folgt aus der Potenzreihe von $e^x$ (M2): Die geraden Potenzen von $i\theta$ ergeben $\cos\theta$, die ungeraden $i\sin\theta$, weil $i^2 = -1$. Mini-Beispiel: $e^{i\pi/2} = i$.`},
        num:{title:R`$e^{i\theta\sigma_x}$ für $\theta = \pi/2$`, text:R`Wegen $\sigma_x^2 = \mathbb 1$ ist $e^{i\theta\sigma_x} = \cos\theta\,\mathbb 1 + i\sin\theta\,\sigma_x$. Für $\theta = \tfrac\pi2$ ist $\cos\tfrac\pi2 = 0$ und $\sin\tfrac\pi2 = 1$, also $e^{i\pi\sigma_x/2} = i\sigma_x = \begin{pmatrix}0&i\\ i&0\end{pmatrix}$.`},
        text:R`Für Matrizen mit $\sigma^2 = \mathbb 1$, etwa alle Pauli-Matrizen, brauchst du nicht zu diagonalisieren. In der Reihe $\sum_k(i\theta\sigma)^k/k!$ ist jede gerade Potenz $\sigma^{2m} = \mathbb 1$ und jede ungerade $\sigma^{2m+1} = \sigma$. Die Reihe zerfällt deshalb genau wie bei der Euler-Formel:

$$e^{i\theta\sigma} = \cos\theta\,\mathbb 1 + i\sin\theta\,\sigma.$$

Probe über die Eigenbasis: $\sigma_x$ hat die Eigenwerte $\pm1$. Darauf wirkt $f$ als $e^{\pm i\theta} = \cos\theta \pm i\sin\theta$. Das passt zur Formel, denn $\sigma$ ist auf den beiden Eigenvektoren $+1$ bzw. $-1$.`,
        q:{q:R`Was ist $e^{i\pi\sigma_y}$?`,
          opts:[R`$i\sigma_y$`, R`$\mathbb 1$`, R`$-\mathbb 1$`], a:2,
          ex:R`$\cos\pi\,\mathbb 1 + i\sin\pi\,\sigma_y = -\mathbb 1$. Beide Eigenwerte $e^{\pm i\pi}$ sind $-1$.`,
          fb:[R`$i\sigma_y$ gehört zu $\theta = \tfrac\pi2$. Bei $\theta = \pi$ ist $\sin\pi = 0$.`,
            R`$\mathbb 1$ käme bei $\theta = 2\pi$ heraus. Bei $\theta = \pi$ ist $\cos\pi = -1$.`,
            '']}},
      {id:'me-t6e', title:'Zeitentwicklung: jede Eigenrichtung bekommt ihre Phase',
        num:{title:'Das Molekül vom Anfang', text:R`$H = \begin{pmatrix}E_0 & -\Delta\\ -\Delta & E_0\end{pmatrix}$ hat die Eigenvektoren $|{\pm}\rangle = \tfrac{1}{\sqrt2}(1;\ \pm1)$ zu $E_0 \mp \Delta$. Der Start $|L\rangle = (1;\ 0) = \tfrac{1}{\sqrt2}\left(|{+}\rangle + |{-}\rangle\right)$ entwickelt sich zu

$$\tfrac{1}{\sqrt2}\left(e^{-i(E_0 - \Delta)t/\hbar}|{+}\rangle + e^{-i(E_0 + \Delta)t/\hbar}|{-}\rangle\right).$$

Die zweite Komponente in der Basis $|L\rangle, |R\rangle$ hat das Betragsquadrat $\sin^2(\Delta t/\hbar)$.`},
        text:R`**Ausblick (Thema 2 und 6):** In der Quantenmechanik entwickelt sich ein Zustand nach der Regel $|\psi(t)\rangle = e^{-iHt/\hbar}|\psi(0)\rangle$. Dabei ist $H$ eine hermitesche Matrix und $\hbar$ eine Naturkonstante. Mathematisch ist das nur eine Matrixfunktion. Ein Eigenvektor $|n\rangle$ von $H$ zum Eigenwert $E_n$ bekommt die Phase $e^{-iE_nt/\hbar}$ und behält seine Richtung. Ein allgemeiner Vektor $\sum_nc_n|n\rangle$ wird zu $\sum_nc_ne^{-iE_nt/\hbar}|n\rangle$. Laufen die Phasen verschieden schnell, ändern sich die Komponenten in jeder anderen Basis. Weil $e^{-iHt/\hbar}$ unitär ist, bleibt die Norm $1$.`,
        reps:{obj:'Zeitentwicklung im Molekül mit zwei Lagen',
          rows:[
            {k:'matrix', tex:R`\begin{gathered}H = \begin{pmatrix}E_0 & -\Delta\\ -\Delta & E_0\end{pmatrix},\\ |L\rangle = \begin{pmatrix}1\\ 0\end{pmatrix},\\ |R\rangle = \begin{pmatrix}0\\ 1\end{pmatrix}\end{gathered}`},
            {k:'formel', tex:R`\begin{aligned}e^{-iHt/\hbar} = {}&e^{-i(E_0 - \Delta)t/\hbar}\,|{+}\rangle\langle{+}|\\ &+ e^{-i(E_0 + \Delta)t/\hbar}\,|{-}\rangle\langle{-}|\end{aligned}`},
            {k:'graph', plot:{x:[0, 2 * Math.PI], y:[0, 1.15], xlab:R`\Delta t/\hbar`, ylab:'P', ticks:[{x:Math.PI / 2, lab:R`\pi/2`}, {x:Math.PI, lab:R`\pi`}, {x:3 * Math.PI / 2, lab:R`3\pi/2`}, {x:2 * Math.PI, lab:R`2\pi`}]}, f:x => Math.sin(x) ** 2, lab:R`P_R = \sin^2(\Delta t/\hbar)`, f2:x => Math.cos(x) ** 2, lab2:R`P_L = \cos^2(\Delta t/\hbar)`,
              cap:R`Rechts und links tauschen sich periodisch aus. Bei $\Delta t/\hbar = \pi/2$ ist das System sicher rechts, bei $\pi$ wieder links.`},
            {k:'physik', text:R`**Ausblick:** Beim Ammoniak-Molekül klappt das Stickstoffatom so durch die Ebene der Wasserstoffatome, mit etwa $24\,$GHz. Der Ammoniak-Maser nutzt diese Frequenz.`}
          ],
          links:[
            {from:'matrix', to:'formel', rule:R`Diagonalisiere $H$: Eigenvektoren $|{\pm}\rangle$, Eigenwerte $E_0 \mp \Delta$. Setze dann $f(E) = e^{-iEt/\hbar}$ in die Spektralzerlegung ein.`},
            {from:'formel', to:'graph', rule:R`Wende die Matrix auf $|L\rangle$ an, nimm die zweite Komponente und bilde ihr Betragsquadrat. Trage es über $\Delta t/\hbar$ auf.`},
            {from:'graph', to:'physik', rule:R`Lies die Kurve als Wahrscheinlichkeit, das Molekül rechts zu finden. Eine Periode von $P_R$ dauert $\Delta t/\hbar = \pi$, also $t = h/(2\Delta)$; die Frequenz ist $2\Delta/h$.`}
          ]},
        q:{q:R`Im Graphen erreicht $P_R$ zum ersten Mal den Wert $1$. Zu welcher Zeit ist das?`, tr:{from:'graph', to:'formel'},
          opts:[R`$t = \pi\hbar/\Delta$`, R`$t = \hbar/\Delta$`, R`$t = \pi\hbar/(2\Delta)$`], a:2,
          ex:R`$\sin^2(\Delta t/\hbar) = 1$ zum ersten Mal bei $\Delta t/\hbar = \pi/2$, also $t = \pi\hbar/(2\Delta)$.`,
          fb:[R`Bei $\Delta t/\hbar = \pi$ ist $\sin^2\pi = 0$: Das System ist dann wieder links.`,
            R`Bei $\Delta t/\hbar = 1$ ist $\sin^21 \approx 0{,}71$, noch nicht $1$.`,
            '']}},
      {id:'me-t6f', title:'Vorsicht bei Summen im Exponenten',
        num:{title:'Zwei Matrizen, die nicht vertauschen', text:R`$A = \begin{pmatrix}0&1\\ 0&0\end{pmatrix}$ und $B = \begin{pmatrix}0&0\\ 1&0\end{pmatrix}$ haben $A^2 = B^2 = 0$, also $e^A = \mathbb 1 + A$ und $e^B = \mathbb 1 + B$. Damit ist $e^Ae^B = \begin{pmatrix}2&1\\ 1&1\end{pmatrix}$. Aber $A + B = \sigma_x$ hat die Eigenwerte $\pm1$, und

$$e^{\sigma_x} = \tfrac{e + e^{-1}}{2}\,\mathbb 1 + \tfrac{e - e^{-1}}{2}\,\sigma_x \approx \begin{pmatrix}1{,}543&1{,}175\\ 1{,}175&1{,}543\end{pmatrix}.$$`},
        text:R`Für Zahlen gilt $e^{a+b} = e^ae^b$. Für Matrizen gilt $e^{A+B} = e^Ae^B$ nur, wenn $[A, B] = 0$. Der Grund steckt schon in der zweiten Ordnung. Links steht $\tfrac12(A + B)^2 = \tfrac12(A^2 + AB + BA + B^2)$, rechts $\tfrac12A^2 + AB + \tfrac12B^2$. Rechts minus links ergibt $\tfrac12(AB - BA) = \tfrac12[A, B]$. Vertauschen die Matrizen, darfst du trennen. Das ist oft nützlich: $H = E_0\mathbb 1 - \Delta\sigma_x$ gibt $e^{-iHt/\hbar} = e^{-iE_0t/\hbar}\,e^{i\Delta t\sigma_x/\hbar}$, weil $\mathbb 1$ mit allem vertauscht. Prüfe also vor jedem Trennen, ob die beiden Matrizen vertauschen.`,
        q:{q:R`Für welches Paar gilt sicher $e^{A+B} = e^Ae^B$?`,
          opts:[R`$A = \sigma_x$, $B = \sigma_z$`, R`$A = 3\cdot\mathbb 1$, $B = \sigma_y$`, R`$A = \sigma_x$, $B = i\sigma_y$`], a:1,
          ex:R`$3\cdot\mathbb 1$ vertauscht mit jeder Matrix. Dann gilt $e^{3 + \sigma_y} = e^3\,e^{\sigma_y}$.`,
          fb:[R`$\sigma_x$ und $\sigma_z$ vertauschen nicht: $[\sigma_x, \sigma_z] = -2i\sigma_y \ne 0$.`,
            '',
            R`$[\sigma_x, i\sigma_y] = i\cdot2i\sigma_z = -2\sigma_z \ne 0$. Ein Faktor $i$ ändert daran nichts.`]}}
    ]}
  ],
  example:{
    title:'Eigenwerte und Eigenvektoren einer symmetrischen Matrix',
    text:'Bestimme die Eigenwerte von $A = \\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ und einen Eigenvektor zum größeren Eigenwert. In der Eingabe: `A` oder `(2, 1; 1, 2)`, die Einheitsmatrix als `I`, Spaltenvektoren als `(1; 1)`.',
    ctx:MAT({mats:{A:'(2, 1; 1, 2)'}, unknowns:{λ:{ref:'3', alt:['1'], kind:'real'}}}),
    lines:[
      {l:'det(A - λ I) = 0', why:{q:'Warum beginnt man mit der Determinante?', opts:['Nur wenn $A - \\lambda\\mathbb 1$ nicht invertierbar ist, gibt es eine Lösung $v \\ne 0$.', 'Weil man aus $\\det(A - \\lambda\\mathbb 1)$ direkt den Eigenvektor $v$ abliest.', 'Weil die Determinante einer Matrix stets gleich ihrer Spur ist.'], a:0, ex:'$Av = \\lambda v$ heißt $(A - \\lambda\\mathbb 1)v = 0$. Eine nichttriviale Lösung gibt es genau dann, wenn $\\det(A - \\lambda\\mathbb 1) = 0$.'}},
      {l:'(2 - λ)^2 - 1 = 0', why:{q:'Woher kommt diese Gleichung?', opts:['$\\det\\begin{pmatrix}2-\\lambda&1\\\\1&2-\\lambda\\end{pmatrix} = (2-\\lambda)^2 - 1\\cdot 1$', 'Man hat $\\lambda$ von allen vier Einträgen abgezogen.', 'Man hat $\\det(A^2) - \\lambda^2$ ausgerechnet.'], a:0, ex:'$\\lambda$ wird nur auf der Diagonale abgezogen, dann $ad - bc$.'}},
      {l:'λ^2 - 4λ + 3 = 0', why:{q:'Was steckt in den Koeffizienten $4$ und $3$?', opts:['Spur $= 4$ und Determinante $= 3$', 'Summe und Produkt der Nebendiagonale', 'die beiden Eigenwerte $4$ und $3$'], a:0, ex:'Für jede $2\\times2$-Matrix gilt $\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = 0$.'}},
      {l:'(λ - 1)(λ - 3) = 0', why:{q:'Wie kontrollierst du die Faktorisierung schnell?', opts:['$1 + 3 = 4 = \\operatorname{tr}A$ und $1\\cdot 3 = 3 = \\det A$', 'Man prüft, ob beide Eigenwerte positiv sind.', 'Man prüft, ob $1$ und $3$ auf der Diagonale von $A$ stehen.'], a:0, ex:'Summe der Eigenwerte = Spur, Produkt = Determinante.'}},
      {l:'λ = 3', w:'größerer Eigenwert; der andere ist λ = 1', why:{q:'Warum sind beide Eigenwerte reell?', opts:['$A$ ist reell und symmetrisch, also hermitesch.', 'Weil alle Einträge von $A$ positiv sind.', 'Weil die Determinante $3$ positiv ist.'], a:0, ex:'Hermitesche Matrizen haben reelle Eigenwerte – egal ob die Einträge positiv, negativ oder komplex sind.'}},
      {l:'A (1; 1) = (3; 3)', why:{q:'Wie findet man diesen Eigenvektor?', opts:['Aus $(A - 3\\mathbb 1)v = 0$: $-v_1 + v_2 = 0$, also $v \\propto (1, 1)^T$.', 'Aus $Av = 0$: $2v_1 + v_2 = 0$, also $v \\propto (1, -2)^T$.', 'Man nimmt die erste Spalte von $A$ und normiert sie.'], a:0, ex:'Beide Zeilen von $A - 3\\mathbb 1 = \\begin{pmatrix}-1&1\\\\1&-1\\end{pmatrix}$ sagen dasselbe: $v_1 = v_2$.'}},
      {l:'= 3 (1; 1)', why:{q:'Was ist der normierte Eigenvektor?', opts:['$\\frac{1}{\\sqrt2}(1, 1)^T$', '$(1, 1)^T$', '$\\frac12(1, 1)^T$'], a:0, ex:'$\\|(1, 1)\\| = \\sqrt2$. Ein Eigenvektor ist nur bis auf einen Faktor festgelegt; normiert wird mit $v^\\dagger v = 1$.'}}
    ],
    faded:{id:'me-fade', title:'Jetzt du: $B = \\begin{pmatrix}1&i\\\\-i&1\\end{pmatrix}$', text:'Bestimme den größeren Eigenwert $\\mu$ von $B$. In der Eingabe heißt die Matrix `B`.',
      ctx:MAT({mats:{B:'(1, i; -i, 1)'}, unknowns:{μ:{ref:'2', alt:['0'], kind:'real'}}}),
      given:['det(B - μ I) = 0', '(1 - μ)^2 - i (-i) = 0'],
      goals:[{id:'a', prompt:'Bestimme $\\mu$.', type:'solve', unknown:'μ', hints:['Das charakteristische Polynom ist schon aufgestellt. Vereinfache es zu einem Polynom in $\\mu$ und bestimme dessen Nullstellen.', '$i\\cdot(-i) = -i^2 = 1$.', 'Das Polynom $\\mu^2 - 2\\mu$ lässt sich ausklammern.'],
        model:['det(B - μ I) = 0', '(1 - μ)^2 - i (-i) = 0', {l:'(1 - μ)^2 - 1 = 0', gap:'(1 - μ)^2 - ▢ = 0'}, 'μ^2 - 2μ = 0', 'μ (μ - 2) = 0', 'μ = 2'],
        mistakes:[{expr:'1 + i', msg:'$B$ ist hermitesch, also müssen die Eigenwerte reell sein. Prüfe $i\\cdot(-i)$: Das ist $+1$.'}]}]}
  },
  puzzle:{
    title:'Addieren sich Eigenwerte?',
    text:'Die Pauli-Matrizen $\\sigma_x$ und $\\sigma_z$ haben beide die Eigenwerte $+1$ und $-1$.\n\nWelche Eigenwerte hat ihre Summe $\\sigma_x + \\sigma_z = \\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$?',
    q:{q:'Deine Vermutung:', opts:['$\\pm 2$, die Summen der Eigenwerte', '$\\pm\\sqrt2$', '$\\pm 1$, wie bei jeder Pauli-Matrix', '$0$ und $2$'], a:1, ex:'$\\det(\\sigma_x + \\sigma_z - \\lambda\\mathbb 1) = \\lambda^2 - 2$, also $\\lambda = \\pm\\sqrt2$.'},
    reveal:'Die Spur ist $0$, die Determinante $-1 - 1 = -2$. Das charakteristische Polynom ist also $\\lambda^2 - 2$, und $\\lambda = \\pm\\sqrt2$.\n\nSchneller geht es mit dem Quadrat:\n\n$$(\\sigma_x + \\sigma_z)^2 = \\sigma_x^2 + \\sigma_z^2 + \\sigma_x\\sigma_z + \\sigma_z\\sigma_x = 2\\,\\mathbb 1,$$\n\ndenn die beiden Pauli-Matrizen antivertauschen. Jeder Eigenwert erfüllt deshalb $\\lambda^2 = 2$.\n\nEigenwerte addieren sich nur, wenn die Matrizen eine gemeinsame Eigenbasis haben, also vertauschen (Abschnitt 5). Dann gilt in dieser Basis $(A + B)|n\\rangle = (a_n + b_n)|n\\rangle$. $\\sigma_x$ und $\\sigma_z$ vertauschen nicht. Ihre Eigenvektoren sind verschieden, und die Summe hat wieder andere.\n\nAusblick: $(\\sigma_x + \\sigma_z)/\\sqrt2$ gehört zur Spinkomponente in der Richtung genau zwischen $x$- und $z$-Achse. Sie hat wieder die Eigenwerte $\\pm 1$: Für einen Spin ist jede Richtung gleichberechtigt (Thema 10).'
  },
  clarify:{
    core:'Eine $n\\times n$-Matrix $A$ ist eine **lineare Abbildung** $v \\mapsto Av$. Die **Adjungierte** ist $A^\\dagger = (A^T)^*$; sie erfüllt $\\langle u|Av\\rangle = \\langle A^\\dagger u|v\\rangle$. Zwei Klassen sind in der QM zentral:\n\n- **hermitesch:** $A^\\dagger = A$ (Messgrößen),\n- **unitär:** $U^\\dagger U = \\mathbb 1$ (Basiswechsel, Zeitentwicklung; Normen bleiben erhalten).\n\n**Eigenwertproblem:** $Av = \\lambda v$ mit $v \\ne 0$. Die Eigenwerte sind die Nullstellen von $\\det(A - \\lambda\\mathbb 1)$; für $2\\times2$:\n\n$$\\lambda^2 - (\\operatorname{tr}A)\\,\\lambda + \\det A = 0.$$\n\nHermitesche Matrizen haben reelle Eigenwerte, und ihre normierten Eigenvektoren lassen sich zu einer Orthonormalbasis wählen. Mit der unitären Matrix $U$ aus diesen Eigenvektoren gilt $A = UDU^\\dagger$ mit diagonalem $D$ – und damit $f(A) = U f(D) U^\\dagger$, etwa $e^{-iAt}$.',
    keys:[
      'Die Reihenfolge zählt: im Allgemeinen ist $AB \\ne BA$. Der **Kommutator** $[A,B] = AB - BA$ misst den Unterschied.',
      'Adjungieren heißt transponieren **und** konjugieren. Dabei dreht sich die Reihenfolge um: $(AB)^\\dagger = B^\\dagger A^\\dagger$.',
      'Kontrolle für Eigenwerte: Summe = Spur, Produkt = Determinante.',
      'Ein Eigenvektor ist nur bis auf einen Faktor bestimmt; normiere ihn mit $v^\\dagger v = 1$. Eine Phase $e^{i\\alpha}$ bleibt frei.',
      'Hat ein Eigenwert mehrere unabhängige Eigenvektoren, heißt er **entartet**; dann ist jede von null verschiedene Linearkombination wieder Eigenvektor.'
    ],
    errors:[
      'Beim Adjungieren nur transponieren und das Konjugieren vergessen (oder umgekehrt).',
      '$\\lambda$ von allen Einträgen abziehen statt nur von der Diagonale: richtig ist $A - \\lambda\\mathbb 1$.',
      'Vorzeichenfehler bei Produkten wie $(2i)(-2i) = -4i^2 = +4$.',
      '$e^{A+B} = e^Ae^B$ benutzen, obwohl $[A,B] \\ne 0$.'
    ],
    more:[{title:'Warum sind die Eigenwerte hermitescher Matrizen reell?', text:'Aus $Av = \\lambda v$ folgt $\\langle v|Av\\rangle = \\lambda\\langle v|v\\rangle$. Wegen $A = A^\\dagger$ ist aber auch $\\langle v|Av\\rangle = \\langle Av|v\\rangle = \\lambda^*\\langle v|v\\rangle$. Da $\\langle v|v\\rangle > 0$, folgt $\\lambda = \\lambda^*$. Genauso zeigt man für zwei Eigenvektoren zu $\\lambda_1 \\ne \\lambda_2$: $(\\lambda_1 - \\lambda_2)\\langle v_1|v_2\\rangle = 0$, also stehen sie senkrecht. Dasselbe Argument funktioniert für Operatoren auf Funktionen (M5, Thema 6).'}],
    checks:[
      {q:'Welche Matrix ist unitär?', opts:['$\\frac{1}{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$', '$\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$', '$\\begin{pmatrix}2&0\\\\0&1/2\\end{pmatrix}$'], a:0, ex:'Die Spalten $(1, 1)/\\sqrt2$ und $(1, -1)/\\sqrt2$ sind normiert und orthogonal, also $U^\\dagger U = \\mathbb 1$. Die anderen verändern Längen.'},
      {q:'Eine $2\\times2$-Matrix hat Spur $1$ und Determinante $-6$. Ihre Eigenwerte sind …', opts:['$3$ und $-2$', '$6$ und $-1$', '$1$ und $-6$'], a:0, ex:'$3 + (-2) = 1$ und $3\\cdot(-2) = -6$.'}
    ]
  },
  lab:{type:'eigen', title:'Was eine symmetrische Matrix mit dem Einheitskreis macht',
    map:[
      {sym:R`A = \begin{pmatrix}a&b\\ b&d\end{pmatrix}`, ctl:'a (oben links)', says:R`Die drei Regler setzen die Einträge der symmetrischen Matrix: $a$ oben links, $b$ auf beiden Plätzen neben der Diagonale, $d$ unten rechts. Jede Änderung ändert die Abbildung $v \mapsto Av$ und damit die blaue Ellipse. Jeder graue Strich im Bild führt von einem Vektor $u$ des grauen Einheitskreises zu seinem Bild $Au$, dem blauen Punkt.`},
      {sym:R`b`, ctl:'b (Nebendiagonale)', says:R`Die Kopplung neben der Diagonale. Bei $b = 0$ ist $A$ diagonal, und die Eigenrichtungen liegen auf den Achsen. Wächst $|b|$, rücken die Eigenwerte auseinander: $\lambda_+ - \lambda_- \ge 2|b|$.`},
      {sym:R`d`, ctl:'d (unten rechts)', says:R`Der zweite Diagonaleintrag. Zusammen mit $a$ bestimmt er die Mitte $\tfrac{a+d}{2}$ der beiden Eigenwerte, also die halbe Spur.`},
      {sym:R`\lambda_+e_+`, ctl:'λ₊e₊', says:R`Roter Pfeil: der normierte Eigenvektor $e_+$ zum größeren Eigenwert, mit $\lambda_+$ gestreckt. Die rot gestrichelte Gerade ist seine Eigenrichtung. Die Anzeige nennt $\lambda_\pm = \tfrac{a+d}{2} \pm \sqrt{\left(\tfrac{a-d}{2}\right)^2 + b^2}$ sowie Spur und Determinante zur Kontrolle.`},
      {sym:R`\lambda_-e_-`, ctl:'λ₋e₋', says:R`Grüner Pfeil: $e_-$ mal $\lambda_-$. Ist $\lambda_- < 0$, zeigt der Pfeil gegen $e_-$ – die Richtung bleibt dieselbe Gerade, nur umgekehrt.`},
      {sym:R`\langle e_+|e_-\rangle = 0`, ctl:'Eigenvektoren senkrecht', says:R`Für jede symmetrische Matrix stehen die beiden Eigenrichtungen senkrecht (Abschnitt 4). Die Anzeige nennt dazu den Winkel von $e_+$ zur 1-Achse; er folgt aus $\tan2\theta = 2b/(a - d)$.`},
      {sym:R`\lambda_+ = \lambda_-`, ctl:'jeder Vektor ist Eigenvektor', says:R`Bei $a = d$ und $b = 0$ ist $A = a\,\mathbb 1$: Der Eigenwert ist entartet, die Ellipse ist ein Kreis, und jede Richtung ist Eigenrichtung.`}
    ],
    sketch:{id:'me-lab-s', kind:'arrows', title:'Vorhersage: die Eigenpfeile des Labors',
      text:'Das Labor zeichnet für $A = \\begin{pmatrix}a&b\\\\b&d\\end{pmatrix}$ die Pfeile $\\lambda_+e_+$ und $\\lambda_-e_-$: die normierten Eigenvektoren, mit ihren Eigenwerten gestreckt. Zeichne beide Pfeile für $a = d = 0{,}5$ und $b = 1{,}5$ vorher, je vom Ursprung aus. Das Vorzeichen eines Eigenvektors ist frei. Stell danach $a = 0{,}5$, $b = 1{,}5$ und $d = 0{,}5$ ein und vergleiche.',
      plot:{x:[-2.5, 2.5], y:[-2, 2], abs:true, xlab:'1', ylab:'2', unit:true, grid:0.5},
      // λ± = 0,5 ± 1,5, also 2 und −1; e+ = (1; 1)/√2, e− = (−1; 1)/√2; λ+e+ = (1,414; 1,414), λ−e− = (0,707; −0,707)
      want:[
        {from:[0, 0], to:[Math.SQRT2, Math.SQRT2], axis:true, lab:'\\lambda_+e_+', msg:'Bestimme $\\lambda_\\pm$ mit der Formel aus dem Lerntext. Welche Richtung wird um den größeren Eigenwert gestreckt? (Abschnitt „Eigenwerte und Eigenvektoren“)', msgLen:'Die Richtung passt. Wie lang ist $\\lambda_+e_+$, wenn $e_+$ normiert ist?'},
        {from:[0, 0], to:[Math.SQRT1_2, -Math.SQRT1_2], axis:true, lab:'\\lambda_-e_-', msg:'In welche Richtung zeigt der zweite Eigenvektor? Prüfe deinen Kandidaten mit $Av = \\lambda v$.', msgLen:'Die Richtung passt. Wie lang ist $\\lambda_-e_-$? Denk an den Betrag $|\\lambda_-|$.'}],
      reveal:'Für $a = d$ ist $\\lambda_\\pm = a \\pm |b|$, hier $2$ und $-1$, und die Eigenvektoren liegen auf den Diagonalen: $A(1;\\ 1) = 2\\,(1;\\ 1)$ und $A(1;\\ -1) = -(1;\\ -1)$. Der Pfeil $\\lambda_+e_+$ ist 2 lang, $\\lambda_-e_-$ ist 1 lang. Das Labor wählt $e_- = (-1;\\ 1)/\\sqrt2$; wegen $\\lambda_- < 0$ zeigt $\\lambda_-e_-$ dann gegen $e_-$, nach rechts unten. Weil das Vorzeichen eines Eigenvektors frei ist, sind die beiden Gegenpfeile ebenso richtig. Die Spalten von $A$ sind dagegen die Bilder der Basisvektoren, keine Eigenvektoren.',
      hints:['Berechne zuerst beide Eigenwerte. Suche dann zu jedem einen Vektor, der von $A$ nur gestreckt wird.', 'Bei $a = d$ ist $A = a\\mathbb 1 + b\\,\\sigma_x$. Welche Eigenvektoren hat $\\sigma_x$?'],
      wrong:[
        {arrows:[{from:[0, 0], to:[Math.SQRT1_2, Math.SQRT1_2]}, {from:[0, 0], to:[Math.SQRT1_2, -Math.SQRT1_2]}], fails:[0], why:'Eigenvektoren nicht mit den Eigenwerten gestreckt'},
        {arrows:[{from:[0, 0], to:[Math.SQRT1_2, Math.SQRT1_2]}, {from:[0, 0], to:[Math.SQRT2, -Math.SQRT2]}], fails:[0, 1], why:'Eigenwerte den falschen Eigenvektoren zugeordnet'},
        {arrows:[{from:[0, 0], to:[0.5, 1.5]}, {from:[0, 0], to:[1.5, 0.5]}], fails:[0, 1], why:'Spalten der Matrix als Eigenvektoren'}
      ]},
    text:'Die Matrix $A = \\begin{pmatrix}a&b\\\\b&d\\end{pmatrix}$ ist reell und symmetrisch, also hermitesch. Mit den Reglern stellst du $a$, $b$ und $d$ zwischen $-2$ und $2$ ein. Gezeichnet sind der Einheitskreis, sein Bild unter $A$ (eine Ellipse) und die Richtungen der beiden Eigenvektoren. Die Anzeige zeigt $\\lambda_\\pm = \\frac{a+d}{2} \\pm \\sqrt{\\left(\\frac{a-d}{2}\\right)^2 + b^2}$ sowie Spur und Determinante.',
    predict:{q:'Bevor du die Regler bewegst: Bei $a = d = 1$ und $b = 0$ ist $A = \\mathbb 1$. Was passiert mit den Eigenrichtungen, wenn du $b$ nur ein wenig auf $0{,}1$ erhöhst?', opts:['Sie springen sofort auf die Diagonalen $(1, \\pm1)$.', 'Sie drehen sich langsam von den Achsen weg, proportional zu $b$.', 'Sie bleiben auf den Koordinatenachsen liegen.'], a:0, ex:'Für $a = d$ ist $A = a\\mathbb 1 + b\\sigma_x$, und die Eigenvektoren von $\\sigma_x$ sind $(1, \\pm1)^T/\\sqrt2$, egal wie klein $b$ ist. Bei $b = 0$ ist jeder Vektor Eigenvektor (entartet). So wählt eine kleine Kopplung bei Entartung die passende Basis aus (Thema 11).'},
    questions:[
      {q:'Stelle $a = d = 1$ ein und erhöhe $b$ langsam von $0$ aus. Was passiert mit den Eigenwerten?', opts:['Sie spalten symmetrisch auf: $\\lambda_\\pm = 1 \\pm b$.', 'Beide wachsen gleich stark, ihr Abstand bleibt null.', 'Sie bleiben bei $1$, nur die Eigenvektoren drehen sich.'], a:0, ex:'Für $a = d$ ist $\\lambda_\\pm = a \\pm |b|$, und die Eigenvektoren liegen auf den Diagonalen. So spaltet ein entartetes Niveau durch eine Kopplung auf (Thema 11).'},
      {q:'Stelle $a = d = b = 1$ ein. Was zeigen Anzeige und Bild?', opts:['$\\lambda_- = 0$: Die Ellipse fällt zu einer Strecke zusammen.', '$\\lambda_+ = \\lambda_- = 1$: Das Bild bleibt ein Kreis vom Radius $1$.', 'Die Eigenvektoren stehen nicht mehr senkrecht aufeinander.'], a:0, ex:'$\\det A = 1 - 1 = 0$: Die Richtung $(1, -1)$ wird auf null abgebildet. Die Eigenvektoren bleiben senkrecht – das gilt für jede symmetrische Matrix.'}
    ],
    noPic:{q:'Ohne Bild: Eine symmetrische $2\\times2$-Matrix hat Spur $4$ und Determinante $3$. Welche Eigenwerte hat sie?', opts:['$1$ und $3$', '$2$ und $2$', '$4$ und $3$'], a:0, ex:'Gesucht sind zwei Zahlen mit Summe $4$ und Produkt $3$.'}},
  compare:{
    text:'Gesucht ist $e^{i\\theta\\sigma_x}$ mit $\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ und reellem $\\theta$. Weg A rechnet die Matrix aus, Weg B wendet sie über die Eigenbasis auf $|{\\uparrow}\\rangle = (1, 0)^T$ an. Die Eigenvektoren von $\\sigma_x$ sind $|{\\pm x}\\rangle = (1, \\pm1)^T/\\sqrt2$ mit Eigenwerten $\\pm1$.',
    ctx:MAT({params:{θ:'real'}}),
    A:{name:'Potenzreihe mit $\\sigma_x^2 = \\mathbb 1$', model:[{l:'e^(i θ σ_x) = cos(θ) I + i sin(θ) σ_x', w:'gerade Potenzen → cos, ungerade → sin'}, '= (cos(θ), i sin(θ); i sin(θ), cos(θ))']},
    B:{name:'Über die Eigenbasis', model:[{l:'e^(i θ σ_x) |↑⟩ = 1/sqrt(2) (e^(i θ σ_x) |+x⟩ + e^(i θ σ_x) |-x⟩)', w:'|↑⟩ = (|+x⟩ + |−x⟩)/√2'}, {l:'= 1/sqrt(2) (e^(i θ) |+x⟩ + e^(-i θ) |-x⟩)', w:'σ_x|±x⟩ = ±|±x⟩'}, '= cos(θ) |↑⟩ + i sin(θ) |↓⟩']},
    questions:[
      {q:'Welcher Weg funktioniert für jede hermitesche Matrix?', opts:['Weg B: Diagonalisieren geht für jede hermitesche Matrix.', 'Weg A: Jede hermitesche Matrix erfüllt $A^2 = \\mathbb 1$.', 'Keiner: Für $3\\times3$-Matrizen gibt es kein Verfahren.'], a:0, ex:'Weg A nutzt den Sonderfall $\\sigma_x^2 = \\mathbb 1$. Über die Eigenbasis gilt allgemein $f(A)|n\\rangle = f(\\lambda_n)|n\\rangle$.'},
      {q:'Was ist $e^{i\\pi\\sigma_x}$?', opts:['$-\\mathbb 1$', '$\\mathbb 1$', '$i\\sigma_x$'], a:0, ex:'$\\cos\\pi\\,\\mathbb 1 + i\\sin\\pi\\,\\sigma_x = -\\mathbb 1$. Bei Spin ½ gibt eine Drehung um $2\\pi$ genau so einen Faktor $-1$.'}
    ]
  },
  concept:[
    {id:'me-c1', type:'mc2', seg:'me-t1', lex:'spur-determinante',
      q:'Gibt es zwei $3\\times3$-Matrizen $X$ und $P$ mit $[X, P] = i\\,\\mathbb 1$?', opts:['Nein, für keine endliche Größe $n$.', 'Ja, man muss sie nur geschickt wählen.', 'Ja, aber erst ab $n = 3$, für $2\\times2$ nicht.'], a:0,
      ex:'Für endliche Matrizen ist das unmöglich. Deshalb wirken $\\hat x$ und $\\hat p$ mit $[\\hat x, \\hat p] = i\\hbar$ auf einem unendlichdimensionalen Raum. Schneidet man ihre Matrizen in der Oszillatorbasis (Thema 7) nach $N$ Zeilen ab, stimmt die Vertauschungsrelation im letzten Diagonaleintrag nicht mehr.',
      reason:{q:'Warum?', opts:['Jeder Kommutator hat die Spur null, $i\\,\\mathbb 1_n$ aber die Spur $in$.', 'Weil Matrizen gleicher Größe immer miteinander vertauschen.', 'Weil Matrizen mit komplexen Einträgen nicht erlaubt sind.'], a:0, ex:'$\\operatorname{tr}(XP) = \\operatorname{tr}(PX)$, also $\\operatorname{tr}[X, P] = 0 \\ne in$. Dass Matrizen nicht immer vertauschen, zeigen die Pauli-Matrizen; komplexe Einträge sind kein Problem.'}},
    {id:'me-c2', type:'dialog', seg:'me-t4', lex:'nicht-diagonalisierbar',
      text:'Die Matrix $N = \\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ hat das charakteristische Polynom $(1 - \\lambda)^2$, also den doppelten Eigenwert $1$.',
      people:[{name:'Lena', says:'$N$ hat nur die Eigenvektoren $c\\,(1, 0)^T$. Eine Eigenbasis gibt es nicht. Bei einer hermiteschen Matrix könnte das nicht passieren.'}, {name:'Jonas', says:'Zu einem doppelten Eigenwert gehören immer zwei unabhängige Eigenvektoren. Man muss den zweiten nur finden.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'$(N - \\mathbb 1)v = (v_2, 0)^T = 0$ verlangt $v_2 = 0$; der Eigenraum ist eindimensional. Die Vielfachheit als Nullstelle und die Zahl unabhängiger Eigenvektoren können verschieden sein. Für hermitesche Matrizen garantiert der Spektralsatz, dass sie übereinstimmen.'},
    {id:'me-c3', type:'mc2', seg:'me-t4', lex:'hermitesche-matrix',
      q:'Hat die reelle Matrix $K = \\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$ reelle Eigenwerte?', opts:['Nein, ihre Eigenwerte sind $\\pm i$.', 'Ja, denn sie hat nur reelle Einträge.', 'Ja, nämlich $+1$ und $-1$.'], a:0,
      ex:'$\\det(K - \\lambda\\mathbb 1) = \\lambda^2 + 1 = 0$, also $\\lambda = \\pm i$. $K$ ist eine Drehung um $90^\\circ$; keine reelle Richtung bleibt fest.',
      reason:{q:'Warum?', opts:['Reelle Eigenwerte garantiert $K^\\dagger = K$; hier ist $K^\\dagger = -K$.', 'Reelle Matrizen haben stets reelle Eigenwerte.', 'Die Spur ist null, also sind beide Eigenwerte null.'], a:0, ex:'Reelle Einträge entscheiden nichts. $K$ ist antisymmetrisch und damit antihermitesch; antihermitesche Matrizen haben rein imaginäre Eigenwerte, denn $iK$ ist hermitesch. Hermitezität ist für reelle Eigenwerte hinreichend, aber nicht notwendig: Die nicht hermitesche Matrix $N$ aus Abschnitt 4 hat den Eigenwert $1$.'}},
    {id:'me-c4', type:'dialog', seg:'me-t5', lex:'gemeinsame-eigenbasis',
      text:'$A = \\operatorname{diag}(2, 2, 5)$ und die hermitesche Matrix $B = \\begin{pmatrix}0&1&0\\\\1&0&0\\\\0&0&1\\end{pmatrix}$ erfüllen $[A, B] = 0$.',
      people:[{name:'Lena', says:'Weil $A$ und $B$ vertauschen, ist jeder Eigenvektor von $A$ auch Eigenvektor von $B$. Zum Beispiel $e_1 = (1, 0, 0)^T$.'}, {name:'Jonas', says:'Sie haben eine gemeinsame Eigenbasis, etwa $(e_1 \\pm e_2)/\\sqrt2$ und $e_3$. Aber $e_1$ ist nur Eigenvektor von $A$, nicht von $B$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'$Be_1 = e_2$ ist kein Vielfaches von $e_1$. Zum entarteten Eigenwert $2$ von $A$ gehört die ganze Ebene von $e_1$ und $e_2$; erst innerhalb dieser Ebene wählt $B$ die Richtungen $(e_1 \\pm e_2)/\\sqrt2$ aus.'},
    {id:'me-c5', type:'mc2', seg:'me-t6', lex:'matrixfunktion',
      q:'Gilt $e^{i\\theta(\\sigma_x + \\sigma_z)} = e^{i\\theta\\sigma_x}\\,e^{i\\theta\\sigma_z}$ für alle reellen $\\theta$?', opts:['Nein, im Allgemeinen nicht.', 'Ja, das gilt für alle Matrizen.', 'Ja, weil beide Matrizen hermitesch sind.'], a:0,
      ex:'Schon bis zur zweiten Ordnung ist $e^Ae^B = \\mathbb 1 + A + B + \\frac12A^2 + AB + \\frac12B^2 + \\dots$, aber $e^{A+B} = \\mathbb 1 + A + B + \\frac12(A^2 + AB + BA + B^2) + \\dots$ Der Unterschied ist $\\frac12[A, B]$.',
      reason:{q:'Warum?', opts:['$\\sigma_x$ und $\\sigma_z$ vertauschen nicht; die Regel braucht $[A, B] = 0$.', 'Weil $\\sigma_x + \\sigma_z$ nicht hermitesch ist.', 'Weil $e^{i\\theta\\sigma}$ für Pauli-Matrizen nicht unitär ist.'], a:0, ex:'$[\\sigma_x, \\sigma_z] = -2i\\sigma_y \\ne 0$. $\\sigma_x + \\sigma_z$ ist hermitesch, und $e^{i\\theta\\sigma}$ ist unitär – daran liegt es nicht.'}}
  ],
  practice:[
    {id:'me-p1', title:'Produkt, Kommutator, Adjungierte',
      text:'Pauli-Matrizen: $\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$, dazu $A = \\begin{pmatrix}1&2i\\\\3&4-i\\end{pmatrix}$. In der Eingabe: `σ_x`, Matrizen als `(1, 2i; 3, 4 - i)`, $A^\\dagger$ als `A†`.',
      ctx:MAT({mats:{A:'(1, 2i; 3, 4 - i)'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\sigma_x\\sigma_z$.', type:'value', target:'(0, -1; 1, 0)', points:2, ph:'σ_x σ_z = (0, 1; 1, 0)(1, 0; 0, -1)',
          hints:['Gesucht ist ein Matrixprodukt; die Reihenfolge $\\sigma_x\\sigma_z$ ist fest.', 'Eintrag $(i,j)$ = Zeile $i$ der linken Matrix mal Spalte $j$ der rechten.', 'Erste Zeile: $(0, 1)\\cdot(1, 0)^T = 0$ und $(0, 1)\\cdot(0, -1)^T = -1$.'],
          model:['σ_x σ_z = (0, 1; 1, 0)(1, 0; 0, -1)', '= (0, -1; 1, 0)'],
          mistakes:[{expr:'(0, 1; -1, 0)', msg:'Das ist $\\sigma_z\\sigma_x$. Die Reihenfolge zählt: Die linke Matrix liefert die Zeilen.'}]},
        {id:'b', prompt:'b) Zeige $[\\sigma_x, \\sigma_z] = -2i\\,\\sigma_y$.', type:'show', from:'[σ_x, σ_z]', to:'-2i σ_y', points:3,
          hints:['Schreib den Kommutator aus, rechne beide Produkte aus und vergleiche mit der rechten Seite.', '$[\\sigma_x, \\sigma_z] = \\sigma_x\\sigma_z - \\sigma_z\\sigma_x$; $\\sigma_x\\sigma_z$ kennst du aus a).', '$-2i\\,\\sigma_y = \\begin{pmatrix}0&-2\\\\2&0\\end{pmatrix}$.'],
          model:['[σ_x, σ_z] = σ_x σ_z - σ_z σ_x', '= (0, -1; 1, 0) - (0, 1; -1, 0)', '= (0, -2; 2, 0)', '= -2i σ_y']},
        {id:'c', prompt:'c) Bestimme $A^\\dagger$.', type:'value', target:'(1, 3; -2i, 4 + i)', points:2, ph:'A† = ',
          hints:['Adjungieren besteht aus zwei Schritten. Welchen?', 'Erst jeden Eintrag konjugieren, dann transponieren (Zeilen werden Spalten). Die Reihenfolge ist egal.', '$A^* = \\begin{pmatrix}1&-2i\\\\3&4+i\\end{pmatrix}$; jetzt nur noch transponieren.'],
          model:[{l:'A^* = (1, -2i; 3, 4 + i)', w:'konjugiert'}, {l:'A† = (1, 3; -2i, 4 + i)', w:'transponiert'}],
          mistakes:[{expr:'(1, 3; 2i, 4 - i)', msg:'Nur transponiert. Zum Adjungieren gehört auch das Konjugieren: $(A^\\dagger)_{ij} = A_{ji}^*$.'}, {expr:'(1, -2i; 3, 4 + i)', msg:'Nur konjugiert. Es fehlt das Transponieren: $(A^\\dagger)_{ij} = A_{ji}^*$.'}]}
      ]},
    {id:'me-p2', title:'Eigenwerte und Eigenvektoren einer hermiteschen Matrix',
      text:'$M = \\begin{pmatrix}2 & 1-i\\\\ 1+i & 3\\end{pmatrix}$. Die Vektoren $v = \\begin{pmatrix}1-i\\\\2\\end{pmatrix}$ und $w = \\begin{pmatrix}1-i\\\\-1\\end{pmatrix}$ heißen in der Eingabe `v` und `w`. Zeilenvektoren schreibst du als `(a, b)`, Spaltenvektoren als `(a; b)`.',
      ctx:MAT({defs:{'M':'(2, 1 - i; 1 + i, 3)'}, states:{v:'(1 - i; 2)', w:'(1 - i; -1)'}, unknowns:{λ:{ref:'4', kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Stelle das charakteristische Polynom auf und bestimme den größeren Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:3, ph:'det(M - λ I) = 0',
          hints:['Eigenwerte sind die Nullstellen von $\\det(M - \\lambda\\mathbb 1)$.', '$\\det\\begin{pmatrix}a & b\\\\ c & d\\end{pmatrix} = ad - bc$, und $(1-i)(1+i) = 2$.', 'Das Polynom $\\lambda^2 - 5\\lambda + 4$ faktorisiert.'],
          model:['det(M - λ I) = 0', '(2 - λ)(3 - λ) - (1 - i)(1 + i) = 0', 'λ^2 - 5λ + 4 = 0', '(λ - 1)(λ - 4) = 0', 'λ = 4'],
          mistakes:[{expr:'1', msg:'$\\lambda = 1$ ist der kleinere Eigenwert. Gefragt ist der größere.'}, {expr:'3', msg:'Prüfe $(1-i)(1+i)$: Das ist $1 - i^2 = 2$, nicht $0$.'}, {expr:'(5 + sqrt(17))/2', msg:'Prüfe $(1-i)(1+i)$: Das ist $1 - i^2 = 2$, nicht $4$.'}, {expr:'(5 + i sqrt(7))/2', msg:'Prüfe $(1-i)(1+i)$: Das ist $1 - i^2 = 2$, nicht $-2$. Eine hermitesche Matrix hat außerdem nur reelle Eigenwerte.'}]},
        {id:'b', prompt:'b) Zeige, dass $v$ Eigenvektor zum Eigenwert $4$ ist.', type:'show', from:'M v', to:'4 v', points:2,
          hints:['Zu zeigen ist $Mv = 4v$: Rechne $Mv$ aus und vergleiche mit $4v$.', 'Multipliziere zeilenweise: erste Zeile $2(1-i) + (1-i)\\cdot 2$.', 'Zweite Zeile: $(1+i)(1-i) + 3\\cdot 2 = 2 + 6$.'],
          model:['M v = (2(1 - i) + 2(1 - i); (1 + i)(1 - i) + 6)', '= (4 - 4i; 8)', '= 4 v'],
          note:'Normiert: $v/\\sqrt6$, denn $|1-i|^2 + 4 = 6$.'},
        {id:'c', prompt:'c) $w$ ist Eigenvektor zum Eigenwert $1$. Berechne $\\langle v|w\\rangle$.', type:'value', target:'0', points:2, ph:'⟨v|w⟩ = (1 + i, 2)(1 - i; -1)',
          hints:['Das Skalarprodukt ist Bra mal Ket. Wie entsteht das Bra $\\langle v|$ aus $v$?', 'Das Bra $\\langle v|$ ist die konjugierte Zeile $(1+i,\\ 2)$.', 'Zeile mal Spalte: $(1+i)(1-i) + 2\\cdot(-1)$.'],
          model:['⟨v|w⟩ = (1 + i, 2)(1 - i; -1)', '= (1 + i)(1 - i) - 2', '= 0'],
          mistakes:[{expr:'-2 - 2i', msg:'Im Bra muss konjugiert werden: $\\langle v| = (1+i,\\ 2)$, nicht $(1-i,\\ 2)$.'}],
          note:'Eigenvektoren einer hermiteschen Matrix zu verschiedenen Eigenwerten stehen senkrecht.'}
      ]},
    {id:'me-p3', title:'Eine Drehmatrix ist unitär',
      text:'$R = \\begin{pmatrix}\\cos\\theta & -\\sin\\theta\\\\ \\sin\\theta & \\cos\\theta\\end{pmatrix}$ dreht Vektoren der Ebene um den Winkel $\\theta$ (hier $0 < \\theta < \\pi$). In der Eingabe heißt sie `R`.',
      ctx:MAT({params:{θ:{range:[0.3, 2.8]}}, mats:{R:'(cos(θ), -sin(θ); sin(θ), cos(θ))'}, unknowns:{λ:{ref:'e^(i θ)', kind:'complex'}}}),
      goals:[
        {id:'a', prompt:'a) Zeige $R^\\dagger R = \\mathbb 1$.', type:'show', from:'R† R', to:'I', points:2,
          hints:['Bilde $R^\\dagger$ und multipliziere aus.', '$R$ ist reell, also ist $R^\\dagger = R^T$.', 'Auf der Diagonale entsteht $\\cos^2\\theta + \\sin^2\\theta = 1$, daneben heben sich die Terme weg.'],
          model:['R† R = (cos(θ), sin(θ); -sin(θ), cos(θ))(cos(θ), -sin(θ); sin(θ), cos(θ))', '= (cos(θ)^2 + sin(θ)^2, 0; 0, sin(θ)^2 + cos(θ)^2)', '= I']},
        {id:'b', prompt:'b) Bestimme den Eigenwert $\\lambda$ mit positivem Imaginärteil.', type:'solve', unknown:'λ', points:3, ph:'det(R - λ I) = 0',
          hints:['Charakteristisches Polynom aufstellen und die quadratische Gleichung lösen.', '$\\det(R - \\lambda\\mathbb 1) = (\\cos\\theta - \\lambda)^2 + \\sin^2\\theta$.', 'Mitternachtsformel: $\\lambda = \\cos\\theta \\pm\\sqrt{\\cos^2\\theta - 1} = \\cos\\theta \\pm i\\sin\\theta$.'],
          model:['det(R - λ I) = 0', '(cos(θ) - λ)^2 + sin(θ)^2 = 0', 'λ^2 - 2cos(θ) λ + 1 = 0', 'λ = cos(θ) + i sin(θ)', '= e^(i θ)'],
          mistakes:[{expr:'e^(-i θ)', msg:'Das ist der zweite Eigenwert $e^{-i\\theta}$ mit negativem Imaginärteil. Gefragt ist der mit positivem.'}],
          note:'Eine echte Drehung der Ebene ($0 < \\theta < \\pi$) lässt keine reelle Richtung fest, deshalb sind die Eigenwerte komplex. $R$ ist unitär, aber nicht hermitesch.'},
        {id:'c', prompt:'c) Berechne $|\\lambda|^2 = \\lambda^*\\lambda$.', type:'value', target:'1', points:2,
          hints:['$\\lambda^*$ ist das komplex Konjugierte deines Ergebnisses aus b).', 'Multipliziere $(\\cos\\theta - i\\sin\\theta)(\\cos\\theta + i\\sin\\theta)$ aus; die Mischterme heben sich weg.'],
          model:['|λ|^2 = (cos(θ) - i sin(θ))(cos(θ) + i sin(θ))', '= cos(θ)^2 + sin(θ)^2', '= 1'],
          note:'Das gilt für jede unitäre Matrix: Aus $Uv = \\lambda v$ folgt $\\|v\\| = \\|Uv\\| = |\\lambda|\\,\\|v\\|$.'}
      ]},
    {id:'me-p4', title:'Zwei-Niveau-System: diagonalisieren und Zeitentwicklung',
      text:'Ein Teilchen in einer Doppelmulde wird näherungsweise durch $H = \\begin{pmatrix}E_0 & -\\Delta\\\\ -\\Delta & E_0\\end{pmatrix}$ beschrieben ($E_0, \\Delta > 0$), in der Basis $|L\\rangle = (1, 0)^T$ (links) und $|R\\rangle = (0, 1)^T$ (rechts). In der Eingabe heißt die Matrix `H`, die Einheitsmatrix `I`.',
      ctx:MAT({params:{E_0:'pos', Δ:'pos'}, mats:{H:'(E_0, -Δ; -Δ, E_0)'}, unknowns:{E:{ref:'E_0 + Δ', kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme den größeren Eigenwert $E$.', type:'solve', unknown:'E', points:2, ph:'det(H - E I) = 0',
          hints:['Eigenwerte aus $\\det(H - E\\mathbb 1) = 0$.', '$\\det(H - E\\mathbb 1) = (E_0 - E)^2 - \\Delta^2$.', 'Aus $u^2 = \\Delta^2$ folgt $u = \\pm\\Delta$; der größere Eigenwert gehört zu $E_0 - E = -\\Delta$.'],
          model:['det(H - E I) = 0', '(E_0 - E)^2 - Δ^2 = 0', 'E_0 - E = -Δ', 'E = E_0 + Δ'],
          mistakes:[{expr:'E_0 - Δ', msg:'Das ist der kleinere Eigenwert. Gefragt ist der größere.'}]},
        {id:'b', prompt:'b) Zeige, dass $\\frac{1}{\\sqrt2}(1, -1)^T$ Eigenvektor zu $E_0 + \\Delta$ ist.', type:'show', from:'H (1; -1)/sqrt(2)', to:'(E_0 + Δ) (1; -1)/sqrt(2)', points:2,
          hints:['Zu zeigen ist $Hv = (E_0 + \\Delta)v$: Rechne $Hv$ aus.', 'Erste Zeile: $E_0\\cdot1 + (-\\Delta)(-1) = E_0 + \\Delta$; zweite Zeile: $-\\Delta - E_0$.'],
          model:['H (1; -1)/sqrt(2) = (E_0 + Δ; -Δ - E_0)/sqrt(2)', '= (E_0 + Δ) (1; -1)/sqrt(2)'],
          note:'Der andere Eigenvektor ist $\\frac{1}{\\sqrt2}(1, 1)^T$ zu $E_0 - \\Delta$: Die symmetrische Kombination liegt energetisch tiefer.'},
        {id:'c', prompt:'c) Berechne $\\det H$ und vergleiche mit dem Produkt der Eigenwerte.', type:'value', target:'E_0^2 - Δ^2', points:1,
          hints:['Determinante einer $2\\times2$-Matrix: $ad - bc$.', 'Achte auf das Vorzeichen: $(-\\Delta)(-\\Delta) = +\\Delta^2$ wird abgezogen.'],
          model:['det(H) = E_0 · E_0 - (-Δ)(-Δ)', '= E_0^2 - Δ^2'],
          note:'$(E_0 + \\Delta)(E_0 - \\Delta) = E_0^2 - \\Delta^2$ ✓'},
        {id:'d', prompt:'d) Berechne den Zeitentwicklungsoperator $e^{-iHt/\\hbar}$ als Matrix.', type:'value', target:'e^(-i E_0 t/ħ) (cos(Δ t/ħ), i sin(Δ t/ħ); i sin(Δ t/ħ), cos(Δ t/ħ))', points:3, ph:'e^(-i H t/ħ) = ',
          hints:['Strategie: $H$ in einen Teil zerlegen, der mit allem vertauscht, und einen Teil mit $\\sigma^2 = \\mathbb 1$ – oder über die Eigenbasis aus a) und b).', 'Schreibe $H = E_0\\mathbb 1 - \\Delta\\,\\sigma_x$. Weil $\\mathbb 1$ mit allem vertauscht, gilt $e^{-iHt/\\hbar} = e^{-iE_0t/\\hbar}\\,e^{i\\Delta t\\sigma_x/\\hbar}$.', 'Mit $\\sigma_x^2 = \\mathbb 1$: $e^{i\\alpha\\sigma_x} = \\cos\\alpha\\,\\mathbb 1 + i\\sin\\alpha\\,\\sigma_x$.'],
          model:[{l:'e^(-i H t/ħ) = e^(-i E_0 t/ħ) e^(i Δ t σ_x/ħ)', w:'H = E₀𝟙 − Δσ_x, und 𝟙 vertauscht mit σ_x'}, '= e^(-i E_0 t/ħ) (cos(Δ t/ħ) I + i sin(Δ t/ħ) σ_x)', '= e^(-i E_0 t/ħ) (cos(Δ t/ħ), i sin(Δ t/ħ); i sin(Δ t/ħ), cos(Δ t/ħ))'],
          mistakes:[{expr:'e^(-i E_0 t/ħ) (cos(Δ t/ħ), -i sin(Δ t/ħ); -i sin(Δ t/ħ), cos(Δ t/ħ))', msg:'Vorzeichen: Wegen $H = E_0\\mathbb 1 - \\Delta\\sigma_x$ steht im Exponenten $+i\\Delta t\\sigma_x/\\hbar$.'}, {expr:'(e^(-i E_0 t/ħ), e^(i Δ t/ħ); e^(i Δ t/ħ), e^(-i E_0 t/ħ))', msg:'Die Exponentialfunktion einer Matrix ist nicht die Exponentialfunktion der einzelnen Einträge. Diagonalisiere oder benutze $\\sigma_x^2 = \\mathbb 1$.'}],
          note:'Startet das Teilchen links, $|L\\rangle = (1, 0)^T$, ist die Wahrscheinlichkeit rechts $\\sin^2(\\Delta t/\\hbar)$: Es tunnelt periodisch hin und her.'}
      ]}
  ],
  sketch:[
    {id:'me-s1', kind:'arrows', title:'Zwei Abbildungen nacheinander',
      text:'$R = \\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}$ dreht um $90°$ gegen den Uhrzeigersinn, $S = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$ spiegelt an der $x$-Achse. Gegeben ist $v = (1{,}5;\\ 0{,}5)$ (grau). Zeichne $SRv$ als Pfeil vom Ursprung aus.',
      plot:{x:[-2, 2], y:[-2, 2], abs:true, xlab:'x', ylab:'y', grid:0.5},
      given:[{from:[0, 0], to:[1.5, 0.5], lab:'v'}],
      // Rv = (−0,5; 1,5), SRv = (−0,5; −1,5); zum Vergleich RSv = R(1,5; −0,5) = (0,5; 1,5)
      want:[{from:[0, 0], to:[-0.5, -1.5], lab:'SRv', msg:'Welche Matrix wirkt in $SRv$ zuerst auf $v$? Wende sie an und danach die andere. (Abschnitt „Matrizen als lineare Abbildungen“)'}],
      reveal:'Die rechte Matrix wirkt zuerst: $Rv = (-0{,}5;\\ 1{,}5)$, dann spiegelt $S$ an der $x$-Achse, $SRv = (-0{,}5;\\ -1{,}5)$. In der anderen Reihenfolge entsteht $RSv = (0{,}5;\\ 1{,}5)$, ein ganz anderer Pfeil. Also ist $SR \\ne RS$, und der Kommutator $[S, R]$ ist nicht null.',
      hints:['Rechne von rechts nach links: erst $u = Rv$, dann $Su$.', 'In $(AB)v = A(Bv)$ wirkt die rechte Matrix zuerst.'],
      wrong:[
        {arrows:[{from:[0, 0], to:[0.5, 1.5]}], fails:[0], why:'Reihenfolge vertauscht: RSv statt SRv'},
        {arrows:[{from:[0, 0], to:[-0.5, 1.5]}], fails:[0], why:'nur gedreht, Spiegelung vergessen'},
        {arrows:[{from:[0, 0], to:[1.5, -0.5]}], fails:[0], why:'nur gespiegelt, Drehung vergessen'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'me-f2', title:'Kommutator', text:'Pauli-Matrizen $\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$, in der Eingabe `σ_x`, `σ_y`, `σ_z`.',
      ctx:MAT({}),
      goals:[{id:'a', prompt:'Zeige $[\\sigma_y, \\sigma_z] = 2i\\,\\sigma_x$.', type:'show', from:'[σ_y, σ_z]', to:'2i σ_x', points:3, model:['[σ_y, σ_z] = σ_y σ_z - σ_z σ_y', '= (0, i; i, 0) - (0, -i; -i, 0)', '= (0, 2i; 2i, 0)', '= 2i σ_x']}]}},
    {aim:1, task:{id:'me-f1', title:'Eigenwerte und Eigenvektor', text:'$G = \\begin{pmatrix}2 & 1+i\\\\ 1-i & 1\\end{pmatrix}$, in der Eingabe `G`. Spaltenvektoren schreibst du als `(a; b)`.',
      ctx:MAT({mats:{G:'(2, 1 + i; 1 - i, 1)'}, unknowns:{λ:{ref:'3', alt:['0'], kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme den größeren Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:3, model:['det(G - λ I) = 0', '(2 - λ)(1 - λ) - (1 + i)(1 - i) = 0', 'λ^2 - 3λ = 0', 'λ (λ - 3) = 0', 'λ = 3'],
          mistakes:[{expr:'0', msg:'$\\lambda = 0$ ist der kleinere Eigenwert. Gefragt ist der größere.'}, {expr:'(3 + sqrt(17))/2', msg:'Prüfe $(1+i)(1-i)$: Das ist $1 - i^2 = 2$, nicht $4$.'}]},
        {id:'b', prompt:'b) Zeige, dass $(1+i, 1)^T$ ein Eigenvektor zu diesem Eigenwert ist.', type:'show', from:'G (1 + i; 1)', to:'3 (1 + i; 1)', points:2, model:['G (1 + i; 1) = (2(1 + i) + (1 + i); (1 - i)(1 + i) + 1)', '= (3 + 3i; 3)', '= 3 (1 + i; 1)']}
      ]}},
    {aim:2, task:{id:'me-f7', title:'Zeitentwicklung', text:'$C = \\begin{pmatrix}3&1\\\\1&3\\end{pmatrix}$, in der Eingabe `C`. Einen Spaltenvektor schreibst du als `(a; b)`, einen Zeilenvektor als `(a, b)`.',
      ctx:MAT({mats:{C:'(3, 1; 1, 3)'}}),
      goals:[{id:'a', prompt:'Berechne $e^{-itC}$ als Matrix.', type:'value', target:'(e^(-4 i t) + e^(-2 i t), e^(-4 i t) - e^(-2 i t); e^(-4 i t) - e^(-2 i t), e^(-4 i t) + e^(-2 i t))/2', points:3, ph:'e^(-i t C) = ',
        model:[{l:'e^(-i t C) = e^(-4 i t) (1; 1)(1, 1)/2 + e^(-2 i t) (1; -1)(1, -1)/2', w:'Eigenwerte 4 und 2, Eigenvektoren (1, ±1)/√2'}, '= (e^(-4 i t) + e^(-2 i t), e^(-4 i t) - e^(-2 i t); e^(-4 i t) - e^(-2 i t), e^(-4 i t) + e^(-2 i t))/2'],
        mistakes:[{expr:'(e^(-3 i t), e^(-i t); e^(-i t), e^(-3 i t))', msg:'Die Exponentialfunktion einer Matrix ist nicht die Exponentialfunktion ihrer Einträge. Diagonalisiere $C$ oder schreibe $C = 3\\,\\mathbb 1 + \\sigma_x$.'}]}]}},
    {aim:'k', id:'me-fk1', type:'mc', lex:'unitaer',
      q:'Eine $2\\times2$-Matrix ist zugleich hermitesch und unitär. Welche Eigenwerte sind möglich?', opts:['nur Werte aus $\\{+1, -1\\}$', 'beliebige reelle Zahlen', 'beliebige Zahlen vom Betrag $1$', 'nur Werte aus $\\{0, 1\\}$'], a:0,
      ex:'Hermitesch: Eigenwerte reell. Unitär: Betrag $1$. Beides zusammen lässt nur $\\pm1$ zu, auch doppelt: $\\mathbb 1$ hat zweimal den Eigenwert $+1$. Beispiele sind die Pauli-Matrizen und $\\frac{1}{\\sqrt2}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$. $0$ und $1$ sind die Eigenwerte eines Projektors, der nicht unitär ist.'},
    {aim:'k', id:'me-fk2', type:'dialog', lex:'eigenwertproblem',
      text:'Lena und Jonas bestimmen einen normierten Eigenvektor von $\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}$ zum Eigenwert $3$. Lena erhält $(1, 1)^T/\\sqrt2$, Jonas $(-1, -1)^T/\\sqrt2$.',
      people:[{name:'Lena', says:'Normierte Eigenvektoren sind eindeutig. Einer von uns hat sich verrechnet.'}, {name:'Jonas', says:'Beide Vektoren stimmen. Normiert ist ein Eigenvektor nur bis auf einen Faktor $e^{i\\alpha}$ festgelegt.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Mit $v$ ist auch $cv$ Eigenvektor; die Normierung legt nur $|c| = 1$ fest. $-1 = e^{i\\pi}$ ist ein solcher Faktor. In der QM beschreiben $v$ und $e^{i\\alpha}v$ denselben physikalischen Zustand.'},
    {aim:1, sketch:{id:'me-fs-a', kind:'arrows', title:'Eigenvektoren, mit den Eigenwerten gestreckt', points:3,
      text:'$A = \\begin{pmatrix}2&2\\\\2&-1\\end{pmatrix}$. Zeichne für jeden Eigenwert $\\lambda$ von $A$ den Pfeil $\\lambda e$ mit dem zugehörigen normierten Eigenvektor $e$, je vom Ursprung aus. Das Vorzeichen von $e$ ist frei.',
      plot:{x:[-3.5, 3.5], y:[-3.5, 3.5], abs:true, xlab:'1', ylab:'2', unit:true, grid:1},
      // tr A = 1, det A = −6: λ = 3 und −2; e_3 = (2; 1)/√5, e_{−2} = (1; −2)/√5
      want:[
        {from:[0, 0], to:[6 / Math.sqrt(5), 3 / Math.sqrt(5)], axis:true, msg:'Bestimme die Eigenwerte aus $\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = 0$. Welche Richtung wird um den Eigenwert mit dem größeren Betrag gestreckt?'},
        {from:[0, 0], to:[2 / Math.sqrt(5), -4 / Math.sqrt(5)], axis:true, msg:'Setze den zweiten Eigenwert in $(A - \\lambda\\mathbb 1)v = 0$ ein. In welche Richtung zeigt $v$, und wie lang ist der Pfeil $\\lambda e$?'}],
      reveal:'$\\operatorname{tr}A = 1$ und $\\det A = -6$ geben $\\lambda^2 - \\lambda - 6 = 0$, also $\\lambda = 3$ und $\\lambda = -2$. Für $\\lambda = 3$ verlangt die erste Zeile $-x + 2y = 0$, also $e \\propto (2;\\ 1)$; der Pfeil ist 3 lang. Für $\\lambda = -2$ verlangt sie $4x + 2y = 0$, also $e \\propto (1;\\ -2)$; der Pfeil ist 2 lang. Die beiden Richtungen stehen senkrecht, wie bei jeder symmetrischen Matrix. Weil das Vorzeichen von $e$ frei ist, ist jeder Pfeil auch in Gegenrichtung richtig.',
      wrong:[
        {arrows:[{from:[0, 0], to:[2, 2]}, {from:[0, 0], to:[2, -1]}], fails:[0, 1], why:'Spalten der Matrix als Eigenvektoren'},
        {arrows:[{from:[0, 0], to:[4 / Math.sqrt(5), 2 / Math.sqrt(5)]}, {from:[0, 0], to:[3 / Math.sqrt(5), -6 / Math.sqrt(5)]}], fails:[0, 1], why:'Eigenwerte den falschen Eigenvektoren zugeordnet'},
        {arrows:[{from:[0, 0], to:[2 / Math.sqrt(5), 1 / Math.sqrt(5)]}, {from:[0, 0], to:[1 / Math.sqrt(5), -2 / Math.sqrt(5)]}], fails:[0, 1], why:'nur normierte Eigenvektoren, nicht mit λ gestreckt'}
      ]}}
  ],
  finalB:[
    {aim:0, task:{id:'me-f4', title:'Kommutator', text:'Pauli-Matrizen $\\sigma_x = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$, $\\sigma_z = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$, in der Eingabe `σ_x`, `σ_y`, `σ_z`.',
      ctx:MAT({}),
      goals:[{id:'a', prompt:'Zeige $[\\sigma_z, \\sigma_x] = 2i\\,\\sigma_y$.', type:'show', from:'[σ_z, σ_x]', to:'2i σ_y', points:3, model:['[σ_z, σ_x] = σ_z σ_x - σ_x σ_z', '= (0, 1; -1, 0) - (0, -1; 1, 0)', '= (0, 2; -2, 0)', '= 2i σ_y']}]}},
    {aim:1, task:{id:'me-f5', title:'Eigenwerte und Eigenvektor', text:'$M = \\begin{pmatrix}0 & 1-i\\\\ 1+i & 1\\end{pmatrix}$, in der Eingabe `M`. Spaltenvektoren schreibst du als `(a; b)`.',
      ctx:MAT({mats:{M:'(0, 1 - i; 1 + i, 1)'}, unknowns:{λ:{ref:'2', alt:['-1'], kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme den größeren Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:3, model:['det(M - λ I) = 0', '(0 - λ)(1 - λ) - (1 - i)(1 + i) = 0', 'λ^2 - λ - 2 = 0', '(λ - 2)(λ + 1) = 0', 'λ = 2'],
          mistakes:[{expr:'-1', msg:'$\\lambda = -1$ ist der kleinere Eigenwert. Gefragt ist der größere.'}, {expr:'1', msg:'Prüfe $(1-i)(1+i)$: Das ist $1 - i^2 = 2$, nicht $0$.'}]},
        {id:'b', prompt:'b) Zeige, dass $(1-i, 2)^T$ ein Eigenvektor zu diesem Eigenwert ist.', type:'show', from:'M (1 - i; 2)', to:'2 (1 - i; 2)', points:2, model:['M (1 - i; 2) = (2(1 - i); (1 + i)(1 - i) + 2)', '= (2 - 2i; 4)', '= 2 (1 - i; 2)']}
      ]}},
    {aim:2, task:{id:'me-f6', title:'Zeitentwicklung', text:'$B = \\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}$, in der Eingabe `B`. Einen Spaltenvektor schreibst du als `(a; b)`, einen Zeilenvektor als `(a, b)`.',
      ctx:MAT({mats:{B:'(1, 2; 2, 1)'}}),
      goals:[{id:'a', prompt:'Berechne $e^{-itB}$ als Matrix.', type:'value', target:'(e^(-3 i t) + e^(i t), e^(-3 i t) - e^(i t); e^(-3 i t) - e^(i t), e^(-3 i t) + e^(i t))/2', points:3, ph:'e^(-i t B) = ',
        model:[{l:'e^(-i t B) = e^(-3 i t) (1; 1)(1, 1)/2 + e^(i t) (1; -1)(1, -1)/2', w:'Eigenwerte 3 und −1, Eigenvektoren (1, ±1)/√2'}, '= (e^(-3 i t) + e^(i t), e^(-3 i t) - e^(i t); e^(-3 i t) - e^(i t), e^(-3 i t) + e^(i t))/2'],
        mistakes:[{expr:'(e^(-i t), e^(-2 i t); e^(-2 i t), e^(-i t))', msg:'Die Exponentialfunktion einer Matrix ist nicht die Exponentialfunktion ihrer Einträge. Diagonalisiere $B$ oder schreibe $B = \\mathbb 1 + 2\\sigma_x$.'}]}]}},
    {aim:'k', id:'me-gk1', type:'mc', lex:'unitaer',
      q:'Eine $2\\times2$-Matrix ist zugleich antihermitesch ($A^\\dagger = -A$) und unitär. Welche Eigenwerte sind möglich?', opts:['nur Werte aus $\\{+i, -i\\}$', 'beliebige rein imaginäre Zahlen', 'beliebige Zahlen vom Betrag $1$', 'nur Werte aus $\\{+1, -1\\}$'], a:0,
      ex:'Antihermitesch: Die Eigenwerte sind rein imaginär, denn $iA$ ist hermitesch. Unitär: Sie haben den Betrag $1$. Beides zusammen lässt nur $\\pm i$ zu, auch doppelt. Beispiele sind $i\\sigma_x$, $i\\sigma_z$ und die Drehung $\\begin{pmatrix}0&1\\\\-1&0\\end{pmatrix}$. $\\pm 1$ gilt für Matrizen, die hermitesch und unitär sind.'},
    {aim:'k', id:'me-gk2', type:'dialog', lex:'eigenwertproblem',
      text:'Lena und Jonas bestimmen einen normierten Eigenvektor von $\\sigma_y = \\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$ zum Eigenwert $+1$. Lena erhält $(1, i)^T/\\sqrt2$, Jonas $(i, -1)^T/\\sqrt2$.',
      people:[{name:'Lena', says:'Normiert ist ein Eigenvektor bis auf das Vorzeichen eindeutig. Jonas’ Vektor ist weder $v$ noch $-v$, also falsch.'}, {name:'Jonas', says:'Beide stimmen: $(i, -1)^T = i\\,(1, i)^T$, und der Faktor $i$ hat den Betrag $1$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Probe: $\\sigma_y(i, -1)^T = ((-i)(-1),\\ i\\cdot i)^T = (i, -1)^T$. Mit $v$ ist auch $cv$ Eigenvektor; die Normierung legt nur $|c| = 1$ fest, also $c = e^{i\\alpha}$ – nicht nur $\\pm 1$. Hier ist $c = i = e^{i\\pi/2}$. „Bis auf das Vorzeichen“ gilt nur, wenn man sich auf reelle Vektoren beschränkt.'},
    {aim:1, sketch:{id:'me-fs-b', kind:'arrows', title:'Eigenvektoren, mit den Eigenwerten gestreckt', points:3,
      text:'$A = \\begin{pmatrix}-1&2\\\\2&2\\end{pmatrix}$. Zeichne für jeden Eigenwert $\\lambda$ von $A$ den Pfeil $\\lambda e$ mit dem zugehörigen normierten Eigenvektor $e$, je vom Ursprung aus. Das Vorzeichen von $e$ ist frei.',
      plot:{x:[-3.5, 3.5], y:[-3.5, 3.5], abs:true, xlab:'1', ylab:'2', unit:true, grid:1},
      // tr A = 1, det A = −6: λ = 3 und −2; e_3 = (1; 2)/√5, e_{−2} = (2; −1)/√5
      want:[
        {from:[0, 0], to:[3 / Math.sqrt(5), 6 / Math.sqrt(5)], axis:true, msg:'Bestimme die Eigenwerte aus $\\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A = 0$. Welche Richtung wird um den Eigenwert mit dem größeren Betrag gestreckt?'},
        {from:[0, 0], to:[4 / Math.sqrt(5), -2 / Math.sqrt(5)], axis:true, msg:'Setze den zweiten Eigenwert in $(A - \\lambda\\mathbb 1)v = 0$ ein. In welche Richtung zeigt $v$, und wie lang ist der Pfeil $\\lambda e$?'}],
      reveal:'$\\operatorname{tr}A = 1$ und $\\det A = -6$ geben $\\lambda^2 - \\lambda - 6 = 0$, also $\\lambda = 3$ und $\\lambda = -2$. Für $\\lambda = 3$ verlangt die erste Zeile $-4x + 2y = 0$, also $e \\propto (1;\\ 2)$; der Pfeil ist 3 lang. Für $\\lambda = -2$ verlangt sie $x + 2y = 0$, also $e \\propto (2;\\ -1)$; der Pfeil ist 2 lang. Die beiden Richtungen stehen senkrecht, wie bei jeder symmetrischen Matrix. Weil das Vorzeichen von $e$ frei ist, ist jeder Pfeil auch in Gegenrichtung richtig.',
      wrong:[
        {arrows:[{from:[0, 0], to:[-1, 2]}, {from:[0, 0], to:[2, 2]}], fails:[0, 1], why:'Spalten der Matrix als Eigenvektoren'},
        {arrows:[{from:[0, 0], to:[2 / Math.sqrt(5), 4 / Math.sqrt(5)]}, {from:[0, 0], to:[6 / Math.sqrt(5), -3 / Math.sqrt(5)]}], fails:[0, 1], why:'Eigenwerte den falschen Eigenvektoren zugeordnet'},
        {arrows:[{from:[0, 0], to:[1 / Math.sqrt(5), 2 / Math.sqrt(5)]}, {from:[0, 0], to:[2 / Math.sqrt(5), -1 / Math.sqrt(5)]}], fails:[0, 1], why:'nur normierte Eigenvektoren, nicht mit λ gestreckt'}
      ]}}
  ],
  errors:[
    {id:'me-e1', title:'Vorzeichenfehler im charakteristischen Polynom',
      text:'Gesucht sind die Eigenwerte von $A = \\begin{pmatrix}1&2i\\\\-2i&1\\end{pmatrix}$. So wurde gerechnet:',
      ctx:MAT({mats:{A:'(1, 2i; -2i, 1)'}, unknowns:{λ:{ref:'3', kind:'real'}}}),
      lines:['det(A - λ I) = 0', '(1 - λ)^2 + 4 = 0', '1 - λ = 2i', 'λ = 1 - 2i'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['$(2i)(-2i) = -4i^2 = +4$; abgezogen ergibt das $(1-\\lambda)^2 - 4$.', 'Die Determinante einer $2\\times2$-Matrix ist $ad + bc$.', '$\\lambda$ muss auch von den Nebendiagonalen abgezogen werden.'], a:0, ex:'$\\det(A - \\lambda\\mathbb 1) = (1-\\lambda)^2 - (2i)(-2i) = (1-\\lambda)^2 - 4$. Ein Warnsignal: $A$ ist hermitesch, ein komplexer Eigenwert wie $1 - 2i$ ist also unmöglich.'},
      fix:{id:'a', prompt:'Berichtige und bestimme den größeren Eigenwert.', type:'solve', unknown:'λ', model:['det(A - λ I) = 0', '(1 - λ)^2 - 4 = 0', '1 - λ = -2', 'λ = 3']}},
    {id:'me-e2', title:'Adjungieren ohne Konjugieren',
      text:'Ist $U = \\frac{1}{\\sqrt2}\\begin{pmatrix}1&i\\\\i&1\\end{pmatrix}$ unitär? Eine Kommilitonin rechnet:',
      ctx:MAT({mats:{U:'(1, i; i, 1)/sqrt(2)'}}),
      lines:['U† = (1, i; i, 1)/sqrt(2)', 'U† U = 1/2 (1, i; i, 1)(1, i; i, 1)', '= 1/2 (0, 2i; 2i, 0)'],
      wrong:0,
      why:{q:'Was ist schon in Zeile 1 falsch?', opts:['Es fehlt das Konjugieren: $U^\\dagger = \\frac{1}{\\sqrt2}\\begin{pmatrix}1&-i\\\\-i&1\\end{pmatrix}$.', 'Der Vorfaktor $1/\\sqrt2$ muss beim Adjungieren wegfallen.', 'Nichts; $U$ ist symmetrisch, also gilt $U^\\dagger = U$.'], a:0, ex:'Für komplexe Matrizen ist $U^\\dagger = (U^T)^* \\ne U^T$. Mit dem richtigen $U^\\dagger$ ergibt sich $U^\\dagger U = \\mathbb 1$: $U$ ist unitär.'},
      fix:{id:'a', prompt:'Berichtige: Zeige $U^\\dagger U = \\mathbb 1$.', type:'show', from:'U† U', to:'I', model:['U† U = 1/2 (1, -i; -i, 1)(1, i; i, 1)', '= 1/2 (2, 0; 0, 2)', '= I']}}
  ]
});
lexe('adjungierte', 'Adjungierte Matrix', '$A^\\dagger = (A^T)^*$, also $(A^\\dagger)_{ij} = A_{ji}^*$. Regeln: $(AB)^\\dagger = B^\\dagger A^\\dagger$, $(cA)^\\dagger = c^*A^\\dagger$, $(A^\\dagger)^\\dagger = A$. Kennzeichnend ist $\\langle u|Av\\rangle = \\langle A^\\dagger u|v\\rangle$ für alle $u, v$. Ein Ket (Spalte) wird durch Adjungieren zum Bra (konjugierte Zeile): $\\langle v| = |v\\rangle^\\dagger$.', {topic:'m-eigen'});
lexe('unitaer', 'Unitäre Matrix', '$U^\\dagger U = UU^\\dagger = \\mathbb 1$, also $U^{-1} = U^\\dagger$. Unitäre Matrizen erhalten Skalarprodukte und Normen: $\\langle Uu|Uv\\rangle = \\langle u|v\\rangle$. Ihre Eigenwerte haben Betrag $1$, ihre Spalten bilden eine Orthonormalbasis. Beispiele: Drehmatrizen, Basiswechsel zwischen Orthonormalbasen, die Zeitentwicklung $e^{-iHt/\\hbar}$ mit hermiteschem $H$.', {topic:'m-eigen'});
lexe('eigenwertproblem', 'Eigenwerte und Eigenvektoren', '$Av = \\lambda v$ mit $v \\ne 0$. Eigenwerte aus $\\det(A - \\lambda\\mathbb 1) = 0$, dann Eigenvektoren aus $(A - \\lambda\\mathbb 1)v = 0$. Eigenvektoren sind nur bis auf einen Faktor festgelegt; in der QM normiert man sie ($v^\\dagger v = 1$). Ein Eigenwert mit mehreren linear unabhängigen Eigenvektoren heißt **entartet**. Hermitesche Matrizen: reelle Eigenwerte, orthogonale Eigenvektoren.', {topic:'m-eigen'});
lexe('charakteristisches-polynom', 'Charakteristisches Polynom', '$p(\\lambda) = \\det(A - \\lambda\\mathbb 1)$; seine Nullstellen sind die Eigenwerte. Für $2\\times2$: $p(\\lambda) = \\lambda^2 - (\\operatorname{tr}A)\\lambda + \\det A$. Für eine hermitesche Matrix $\\begin{pmatrix}a&b\\\\b^*&d\\end{pmatrix}$ mit reellen $a, d$: $\\lambda_\\pm = \\frac{a+d}{2} \\pm \\sqrt{\\left(\\frac{a-d}{2}\\right)^2 + |b|^2}$.', {topic:'m-eigen'});
lexe('diagonalisierung', 'Diagonalisierung (Spektralsatz)', 'Jede hermitesche Matrix lässt sich unitär diagonalisieren: $A = UDU^\\dagger$ mit reeller Diagonalmatrix $D = \\operatorname{diag}(\\lambda_1, \\dots, \\lambda_n)$; die Spalten von $U$ sind die normierten Eigenvektoren. Gleichwertig: $A = \\sum_n\\lambda_n|n\\rangle\\langle n|$ (Spektralzerlegung). Vertauschende hermitesche Matrizen haben eine gemeinsame Eigenbasis.', {topic:'m-eigen'});
lexe('spur-determinante', 'Spur und Determinante', '$\\operatorname{tr}A = \\sum_i A_{ii} = \\sum_n\\lambda_n$ und $\\det A = \\prod_n\\lambda_n$. Beide hängen nicht von der Basis ab und sind ein schneller Test für ausgerechnete Eigenwerte. Außerdem gilt $\\operatorname{tr}(AB) = \\operatorname{tr}(BA)$; deshalb hat jeder Kommutator von Matrizen die Spur null.', {topic:'m-eigen'});
lexe('matrixfunktion', 'Funktionen von Matrizen', 'Definiert über die Potenzreihe, z. B. $e^A = \\sum_{k=0}^\\infty A^k/k!$. Für diagonalisierbares $A = UDU^\\dagger$ gilt $f(A) = U f(D)U^\\dagger$: $f$ wirkt auf die Eigenwerte, $f(A)|n\\rangle = f(\\lambda_n)|n\\rangle$. Mit $\\sigma^2 = \\mathbb 1$: $e^{i\\theta\\sigma} = \\cos\\theta\\,\\mathbb 1 + i\\sin\\theta\\,\\sigma$. Achtung: $e^{A+B} = e^Ae^B$ ist für $[A,B] = 0$ garantiert, im Allgemeinen aber falsch.', {topic:'m-eigen'});
lexe('entarteter-eigenwert', 'Entarteter Eigenwert', 'Ein Eigenwert $\\lambda$ heißt entartet, wenn es mehrere linear unabhängige Eigenvektoren zu ihm gibt. Sie spannen den Eigenraum auf, und jede von null verschiedene Linearkombination ist wieder Eigenvektor. Bei hermiteschen Matrizen ist die Dimension des Eigenraums gleich der Vielfachheit der Nullstelle im charakteristischen Polynom; im Eigenraum wählt man eine Orthonormalbasis. Beispiel: $\\mathbb 1$ hat den $n$-fach entarteten Eigenwert $1$, jeder Vektor ist Eigenvektor.', {topic:'m-eigen'});
lexe('nicht-diagonalisierbar', 'Nicht diagonalisierbare Matrix', 'Eine Matrix ist nicht diagonalisierbar, wenn sie weniger linear unabhängige Eigenvektoren als Zeilen hat. Beispiel: $\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}$ hat den doppelten Eigenwert $1$, aber nur die Eigenrichtung $(1, 0)^T$. Hermitesche und unitäre Matrizen sind immer (unitär) diagonalisierbar; reelle Einträge allein garantieren das nicht.', {topic:'m-eigen'});
lexe('gemeinsame-eigenbasis', 'Gemeinsame Eigenbasis vertauschender Matrizen', 'Hermitesche $A$, $B$ mit $[A, B] = 0$ haben eine gemeinsame Orthonormalbasis aus Eigenvektoren. Grund: $B$ bildet jeden Eigenraum von $A$ in sich ab, denn $A(Bv) = BAv = \\lambda Bv$. Ist $\\lambda$ nicht entartet, ist jeder Eigenvektor von $A$ auch einer von $B$. Bei Entartung gilt das nur für passend gewählte Vektoren im Eigenraum. In der QM: vertauschende Observable sind gemeinsam scharf messbar.', {topic:'m-eigen'});
})();
