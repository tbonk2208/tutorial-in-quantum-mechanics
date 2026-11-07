/* ===== Mathe M3: Vektorräume und Skalarprodukt ===== */
(function(){
const R = String.raw;
const MVEK = extra => Object.assign({rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}}, extra || {});
topic({
  id:'m-vektor', ch:'math', title:'Vektorräume und Skalarprodukt', short:'Vektorräume',
  src:'Boas (3. Aufl.) Kap. 3 · Griffiths & Schroeter (3. Aufl.) Anhang A',
  goals:[
    'Ich kann Skalarprodukte und Normen in $\\mathbb C^n$ berechnen und dabei richtig konjugieren.',
    'Ich kann einen Vektor nach einer Orthonormalbasis entwickeln ($c_i = \\langle e_i|v\\rangle$) und Projektionen bilden.',
    'Ich kann mit dem Gram-Schmidt-Verfahren orthogonalisieren und die Cauchy-Schwarz-Ungleichung anwenden.'
  ],
  needs:'Vektoren im $\\mathbb R^3$: Skalarprodukt, Betrag, Winkel · komplexe Zahlen, $z^*z = |z|^2$ (M1)',
  wozu:'Ein Quantenzustand ist ein Vektor in einem komplexen Vektorraum, und Wahrscheinlichkeiten sind Betragsquadrate von Skalarprodukten, $P = |\\langle e|\\psi\\rangle|^2$. Dasselbe Rechnen kennst du aus der Optik: Ein Polarisationsfilter projiziert den Polarisationsvektor, und zirkular polarisiertes Licht braucht komplexe Komponenten. Die Dirac-Schreibweise (Thema 6), der Spin (Thema 10) und die Unschärferelation, die aus der Cauchy-Schwarz-Ungleichung folgt, bauen direkt auf M3 auf.',
  bridge:'Aus M1 brauchst du $|z|^2 = z^*z$: Das komplexe Skalarprodukt ist genau die Verallgemeinerung davon auf Vektoren. Aus der Schule kennst du das Skalarprodukt im $\\mathbb R^3$. Später überträgt M4 alles auf Matrizen und M5 auf Funktionen.',
  check:[
    {q:'$(1, 2, 2)\\cdot(2, 0, 1)$ ist …', opts:['$4$', '$3$', '$(2, 0, 2)$'], a:0, ex:'$1\\cdot 2 + 2\\cdot 0 + 2\\cdot 1 = 4$. Das Skalarprodukt ist eine Zahl, kein Vektor.', lex:'skalarprodukt'},
    {q:'Wie lang ist der Vektor $(3, 4)$?', opts:['$5$', '$7$', '$25$'], a:0, ex:'$\\sqrt{3^2 + 4^2} = 5$. $25$ ist das Quadrat der Länge.', lex:'skalarprodukt'},
    {q:'Für $z = 2 - i$ ist $z^*z$ …', opts:['$5$', '$3$', '$3 - 4i$'], a:0, ex:'$(2 + i)(2 - i) = 4 + 1 = 5$. Genau diese Rechnung steckt im komplexen Skalarprodukt.', lex:'komplexe-zahlen', prev:'m-komplex', seg:'mk-t1'},
    {q:'Die Vektoren $(1, 0)$ und $(1, 1)$ …', opts:['sind linear unabhängig, aber nicht orthogonal', 'sind orthogonal und damit unabhängig', 'sind linear abhängig, weil beide eine 1 enthalten'], a:0, ex:'Keiner ist ein Vielfaches des anderen, also unabhängig – sie bilden eine Basis. Ihr Skalarprodukt ist aber $1 \\neq 0$.', lex:'vektorraum'}
  ],
  diag:[
    {q:'Wie beginnst du, um $\\langle a|b\\rangle$ für $a = (1; i)$ und $b = (2; 1)$ zu berechnen?', opts:['Ich konjugiere die Einträge von $a$ und multipliziere sie mit denen von $b$.', 'Ich multipliziere die Einträge paarweise und addiere, wie im $\\mathbb R^n$.', 'Ich konjugiere die Einträge von $b$ und multipliziere sie mit denen von $a$.', 'weiß ich nicht'], a:0, ex:'$\\langle a|b\\rangle = \\sum a_i^*b_i = 1\\cdot 2 + (-i)\\cdot 1 = 2 - i$. Ohne Konjugation käme $2 + i$ heraus. Konjugiert man $b$, erhält man $\\langle b|a\\rangle = \\langle a|b\\rangle^* = 2 + i$ – das ist die Konvention vieler Mathematikbücher, nicht die der Physik.'},
    {q:'Wie beginnst du, um die Komponente $c_2$ von $v$ in einer Orthonormalbasis $e_1, e_2, e_3$ zu finden?', opts:['Ich berechne das Skalarprodukt $\\langle e_2|v\\rangle$.', 'Ich löse das ganze Gleichungssystem $v = \\sum c_ie_i$.', 'Ich lese den zweiten Eintrag der Spalte von $v$ ab.', 'weiß ich nicht'], a:0, ex:'In einer Orthonormalbasis ist $c_i = \\langle e_i|v\\rangle$. Das Gleichungssystem führt auch zum Ziel, ist aber viel aufwendiger. Der zweite Eintrag ist die Komponente in der Standardbasis, nicht in der Basis $e_i$.'}
  ],
  phenomenon:{
    title:'Drei Polarisationsfilter',
    text:'Licht ist in $x$-Richtung linear polarisiert. Es trifft auf einen Polarisationsfilter, der nur $y$-polarisiertes Licht durchlässt. Hinter diesem Filter ist es dunkel.\n\nNun stellst du **vor** den $y$-Filter einen zweiten Filter, dessen Durchlassrichtung $45°$ gegen die $x$-Achse geneigt ist. Das Licht geht also erst durch den $45°$-Filter, dann durch den $y$-Filter.',
    q:{q:'Welcher Anteil der ursprünglichen Intensität kommt jetzt hinter dem $y$-Filter an?', opts:['$1/4$', '$0$, ein zusätzlicher Filter kann nur weiteres Licht wegnehmen', '$1/2$', '$1/8$'], a:0,
      ex:'Jeder Filter lässt $\\cos^2 45° = 1/2$ der ankommenden Intensität durch: $\\tfrac12\\cdot\\tfrac12 = \\tfrac14$.',
      fb:[
        'Richtig. Der $45°$-Filter lässt $\\cos^2 45° = 1/2$ durch, der $y$-Filter davon wieder $\\cos^2 45° = 1/2$. Zusammen sind das $1/4$.',
        'Das ist die naheliegende Erwartung, wenn ein Filter nur „Anteile aussiebt“. Ein Filter projiziert aber auf seine Durchlassrichtung. Hinter dem $45°$-Filter ist das Licht $45°$-polarisiert und hat wieder einen $y$-Anteil.',
        'Nach dem $45°$-Filter ist die Hälfte übrig. Der $y$-Filter lässt davon aber nicht alles durch, sondern wieder nur $\\cos^2 45° = 1/2$.',
        'Der Faktor $1/2$ für unpolarisiertes Licht fällt hier weg: Das Licht ist schon polarisiert. Zwei Filter mit je $\\cos^2 45° = 1/2$ geben $1/4$.'
      ]},
    reveal:'Beschreibe die Polarisation durch einen Einheitsvektor. Ein Filter mit der Durchlassrichtung $e$ ersetzt das Feld $E$ durch seine **Projektion** $\\langle e|E\\rangle\\,e$. Die Intensität ist proportional zu $|\\langle e|E\\rangle|^2$; für lineare Polarisation ist das das Gesetz von Malus, $\\cos^2$ des Winkels.\n\n- Start: $E = (1, 0)$.\n- $45°$-Filter, $e = (1, 1)/\\sqrt2$: $\\langle e|E\\rangle = 1/\\sqrt2$, Intensität $1/2$, neues Feld $(1, 1)/2$.\n- $y$-Filter: $\\langle e_y|(1, 1)/2\\rangle = 1/2$, Intensität $1/4$.\n\nDer mittlere Filter erzeugt den $y$-Anteil nicht aus dem Nichts. Er wechselt die Basis: In der $45°$-Basis hat das $x$-polarisierte Licht zwei Komponenten. Genauso rechnet die Quantenmechanik für einzelne Photonen und für den Spin (Thema 10): Die Wahrscheinlichkeit ist $|\\langle e|\\psi\\rangle|^2$.'
  },
  teach:[
    /* ===== Abschnitt 1: Vektorraum, Spalten, Unabhängigkeit, Basis, Komponenten, Pfeil ↔ Spalte ===== */
    {id:'mv-t1', title:'Vektorräume: Überlagerung als Grundprinzip', steps:[
      {id:'mv-t1a', title:'Überlagern: was Vektoren gemeinsam haben',
        num:{title:'Spalten und Funktionen', text:R`Spalten: $\begin{pmatrix}1\\ 2\end{pmatrix} + 2\begin{pmatrix}3\\ -1\end{pmatrix} = \begin{pmatrix}7\\ 0\end{pmatrix}$. Funktionen auf $[0, 1]$: $\sin(\pi x)$ und $\sin(2\pi x)$ sind an beiden Rändern null, und $\sin(\pi x) + 2\sin(2\pi x)$ ist es auch. In beiden Fällen bleibt man beim Addieren und Vervielfachen in derselben Sorte von Objekten.`},
        text:R`**Ausblick (Thema 1):** In der Quantenmechanik gilt das **Superpositionsprinzip**. Sind $\psi_1$ und $\psi_2$ mögliche Zustände, dann auch $c_1\psi_1 + c_2\psi_2$ mit beliebigen komplexen Zahlen $c_1, c_2$. Die passende Struktur ist der [[lex:vektorraum|Vektorraum]] über $\mathbb C$: eine Menge, in der man Elemente addieren und mit komplexen Zahlen multiplizieren kann, ohne sie zu verlassen.

Dabei gelten die vertrauten Rechenregeln: Assoziativ-, Kommutativ- und Distributivgesetze, ein Nullvektor und zu jedem $v$ ein $-v$. Die Elemente heißen **Vektoren**, auch wenn sie keine Pfeile sind.`,
        q:{q:R`Welche Menge ist **kein** Vektorraum?`,
          opts:[R`die Funktionen auf $[0, 1]$ mit $f(0) = 1$`, R`die Polynome vom Grad höchstens 2`, R`die Funktionen auf $[0, 1]$ mit $f(0) = f(1) = 0$`], a:0,
          ex:R`Die Summe zweier Funktionen mit $f(0) = 1$ hat bei $0$ den Wert $2$. Man verlässt die Menge, und die Nullfunktion fehlt.`,
          fb:['',
            R`Summen und Vielfache von Polynomen vom Grad $\le 2$ sind wieder solche Polynome.`,
            R`Summen und Vielfache von Funktionen, die am Rand null sind, sind wieder am Rand null. Das sind die Kastenfunktionen aus Thema 3.`]}},
      {id:'mv-t1b', title:'Ein Vektor als Spalte: Polynome als Beispiel',
        num:{title:R`$p(x) = 1 + 2x + 3x^2$`, text:R`Mit den Bausteinen $1, x, x^2$ ist $p$ durch drei Zahlen festgelegt. Als Spalte geschrieben:

$$p \;\leftrightarrow\; \begin{pmatrix}1\\ 2\\ 3\end{pmatrix}.$$

Addieren von Polynomen ist dann Addieren von Spalten: $(1 + 2x + 3x^2) + (x - x^2) \leftrightarrow (1;\ 3;\ 2)$. Das Semikolon trennt die Einträge einer Spalte, so passt sie in eine Zeile.`},
        text:R`Vektoren müssen keine Pfeile sein. Drei Beispiele begleiten dich durch dieses Thema:

- $\mathbb C^n$, die Spalten aus $n$ komplexen Zahlen. Mit $n = 2$ beschreibt man Polarisationen und, ab Thema 10, Spinzustände.
- die Polynome vom Grad höchstens 2, also $a + bx + cx^2$.
- die Funktionen auf $[0, L]$, die an beiden Rändern verschwinden: die Wellenfunktionen im Kasten (Thema 3).

Das Beispiel zeigt einen Trick, der dich durch die ganze Quantenmechanik begleitet: Hat man feste Bausteine gewählt, wird jeder Vektor zu einer Spalte von Zahlen. Die Spalte $(a;\ b)$ mit Semikolon ist dieselbe wie die stehende Spalte mit $a$ oben und $b$ unten.`,
        q:{q:R`Welche Spalte gehört zu $4 - x^2$ mit den Bausteinen $1, x, x^2$?`, tr:{from:'formel', to:'matrix'},
          opts:[R`$(4;\ -1)$`, R`$(4;\ 0;\ -1)$`, R`$(-1;\ 0;\ 4)$`], a:1,
          ex:R`Vor $1$ steht $4$, vor $x$ steht $0$, vor $x^2$ steht $-1$. Auch eine fehlende Potenz bekommt ihren Eintrag.`,
          fb:[R`Der Eintrag für $x$ fehlt. Auch eine $0$ gehört in die Spalte, sonst verschieben sich die Plätze.`,
            '',
            R`Die Reihenfolge folgt den Bausteinen $1, x, x^2$: oben der Faktor vor $1$.`]}},
      {id:'mv-t1c', title:'Linear unabhängig',
        num:{title:R`$(1;\ 2)$ und $(2;\ 4)$`, text:R`Hier ist

$$2\begin{pmatrix}1\\ 2\end{pmatrix} - \begin{pmatrix}2\\ 4\end{pmatrix} = \begin{pmatrix}0\\ 0\end{pmatrix}:$$

Eine Kombination mit Koeffizienten ungleich null gibt den Nullvektor. Die beiden sind abhängig; sie liegen auf derselben Geraden. Im Komplexen zählen auch komplexe Vielfache: $(i;\ -1) = i\,(1;\ i)$.`},
        text:R`**Linear unabhängig** heißen $v_1, \dots, v_k$, wenn

$$c_1v_1 + \dots + c_kv_k = 0$$

nur für $c_1 = \dots = c_k = 0$ gilt. Sonst ist einer der Vektoren eine Kombination der anderen, und er bringt keine neue Richtung hinzu. Zwei Vektoren sind genau dann abhängig, wenn einer ein Vielfaches des anderen ist. Über $\mathbb C$ sind dabei komplexe Vielfache erlaubt. Deshalb können zwei Spalten abhängig sein, die ganz verschieden aussehen.`,
        derive:{title:'Probe: zwei abhängige Vektoren', ctx:MVEK({}),
          lines:[
            {l:'2 (1; 2) - (2; 4) = (0; 0)', w:'Kombination mit den Koeffizienten 2 und −1', why:{q:'Was zeigt diese Zeile über $(1; 2)$ und $(2; 4)$?', opts:['Sie sind linear abhängig.', 'Sie stehen senkrecht aufeinander.', 'Sie zeigen in verschiedene Richtungen.'], a:0, ex:'Eine Kombination mit Koeffizienten $\\neq 0$ ergibt den Nullvektor: $(2; 4) = 2\\,(1; 2)$. Die beiden liegen auf einer Geraden.'}}
          ]},
        q:{q:'Sind $(1;\\ i)$ und $(-i;\\ 1)$ in $\\mathbb C^2$ linear unabhängig?',
          opts:['Ja, keiner ist ein reelles Vielfaches des anderen.', 'Nein: $(-i;\\ 1) = -i\\,(1;\\ i)$.', 'Ja: Die Faktoren $-i$ (oben) und $1/i$ (unten) sind verschieden.'], a:1,
          ex:'Über $\\mathbb C$ sind auch komplexe Vielfache erlaubt: $-i\\cdot(1;\\ i) = (-i;\\ -i^2) = (-i;\\ 1)$. Der Faktor unten ist $1/i = -i$, derselbe wie oben.',
          fb:['Über $\\mathbb C$ zählen auch komplexe Vielfache. Prüfe den Faktor $-i$.', '', 'Es ist $\\tfrac1i = \\tfrac{-i}{i\\cdot(-i)} = -i$: Beide Faktoren sind gleich, also ist ein Vektor ein Vielfaches des anderen.']}},
      {id:'mv-t1d', title:'Basis und Dimension',
        num:{title:R`$(1;\ 0)$ und $(1;\ 1)$`, text:R`Jeder Vektor $(a;\ b)$ lässt sich aus diesen beiden bauen:

$$\begin{pmatrix}a\\ b\end{pmatrix} = (a - b)\begin{pmatrix}1\\ 0\end{pmatrix} + b\begin{pmatrix}1\\ 1\end{pmatrix}.$$

Und die beiden sind unabhängig. Also bilden sie eine Basis von $\mathbb C^2$.`},
        text:R`Eine **Basis** ist ein linear unabhängiges System, mit dem sich jeder Vektor darstellen lässt. Die Zahl ihrer Elemente ist die **Dimension**. $\mathbb C^n$ hat die Dimension $n$. Die Polynome vom Grad $\le 2$ haben die Basis $1, x, x^2$ und die Dimension 3.

Der Funktionenraum aus dem Kasten ist unendlich-dimensional: Keine endliche Liste von Funktionen reicht. **Ausblick (M5):** Mit einem Skalarprodukt und einer zusätzlichen Grenzwert-Eigenschaft, der Vollständigkeit, wird er zum [[lex:hilbertraum|Hilbertraum]].`,
        q:{q:R`Welche Dimension hat der Raum der Polynome $a + bx + cx^2 + dx^3$ mit komplexen Koeffizienten?`,
          opts:[R`$3$`, R`unendlich`, R`$4$`], a:2,
          ex:R`Basis $1, x, x^2, x^3$: vier Vektoren.`,
          fb:[R`Der höchste Grad ist 3, aber die Konstante zählt mit.`,
            R`Der Grad ist auf 3 beschränkt; vier Bausteine reichen.`,
            '']}},
      {id:'mv-t1e', title:'Komponenten hängen von der Basis ab',
        num:{title:R`$v = (2;\ 3)$ in der Basis $(1;\ 0)$, $(1;\ 1)$`, text:R`Gesucht sind $c_1, c_2$ mit $c_1(1;\ 0) + c_2(1;\ 1) = (2;\ 3)$. Die zweite Zeile gibt $c_2 = 3$, die erste $c_1 + 3 = 2$, also $c_1 = -1$. Probe: $-(1;\ 0) + 3(1;\ 1) = (2;\ 3)$.`},
        text:R`In einer Basis $b_1, \dots, b_n$ hat jeder Vektor eindeutige **Komponenten**: $v = \sum_ic_ib_i$. Eindeutig, weil die Differenz zweier Darstellungen eine Kombination wäre, die null ergibt – und das geht wegen der Unabhängigkeit nur mit lauter Nullen.

Die Komponenten hängen aber von der Basis ab. $v = (2;\ 3)$ hat in der Standardbasis die Komponenten $2$ und $3$, in der Basis aus dem Beispiel $-1$ und $3$. Ein Vektor ist also nicht „seine Spalte“. Die Spalte ist seine Darstellung in einer gewählten Basis. Die Herleitung rechnet das Beispiel Zeile für Zeile.`,
        derive:{title:'Herleitung: Komponenten in einer schiefen Basis', ctx:MVEK({unknowns:{c_1:{ref:'-1'}, c_2:{ref:'3'}}}),
          lines:[
            {l:'c_1 (1; 0) + c_2 (1; 1) = (2; 3)', w:'Ansatz: c₁b₁ + c₂b₂ = v', why:{q:'Was ist hier gesucht?', opts:['die Koeffizienten $c_1, c_2$ der Linearkombination', 'die Länge des Vektors $v$ in der neuen Basis', 'ein Vektor, der auf $b_1$ und $b_2$ senkrecht steht'], a:0, ex:'Komponenten sind die Koeffizienten der Linearkombination. Die Länge hängt nicht von der Basis ab.'}},
            {l:'c_1 + c_2 = 2', w:'erste Zeile', why:{q:'Woher kommt diese Gleichung?', opts:['erste Einträge: $c_1\\cdot 1 + c_2\\cdot 1 = 2$', 'aus dem Schul-Skalarprodukt $b_1\\cdot v = 2$', 'aus den Längen von $b_1$ und $b_2$'], a:0, ex:'Komponentenweise: Die erste Zeile von $c_1(1; 0) + c_2(1; 1) = (2; 3)$. Ein Skalarprodukt liefert hier nicht die Komponenten; wann es das tut, zeigt Abschnitt 3.'}},
            {l:'c_2 = 3', w:'zweite Zeile', why:{q:'Warum steht in der zweiten Zeile kein $c_1$?', opts:['Weil der zweite Eintrag von $b_1$ null ist.', 'Weil $c_1$ aus der ersten Zeile schon bekannt ist.', 'Weil $b_1$ und $b_2$ orthogonal sind.'], a:0, ex:'$c_1\\cdot 0 + c_2\\cdot 1 = 3$. Orthogonal sind $b_1$ und $b_2$ gerade nicht.'}},
            {l:'c_1 = -1', w:'einsetzen', why:{q:'Wie prüfst du das Ergebnis?', opts:['durch Einsetzen in $c_1b_1 + c_2b_2$', 'mit $c_1^2 + c_2^2 = 2^2 + 3^2$', 'mit dem Schul-Skalarprodukt $b_1\\cdot v = c_1$'], a:0, ex:'Einsetzen in die Linearkombination ist die sichere Probe. $c_1^2 + c_2^2 = 10 \\neq 13$: Eine Pythagoras-Probe gilt nur für senkrechte Basisvektoren der Länge 1 (Abschnitt 3).'}}
          ]},
        q:{q:R`In der Basis $b_1 = (1;\ 0)$, $b_2 = (1;\ 1)$: Welche Komponenten hat $w = (5;\ 2)$?`,
          opts:[R`$c_1 = 3$, $c_2 = 2$`, R`$c_1 = 5$, $c_2 = 2$`, R`$c_1 = 7$, $c_2 = 2$`], a:0,
          ex:R`Zweite Zeile: $c_2 = 2$. Erste Zeile: $c_1 + 2 = 5$, also $c_1 = 3$. Probe: $3(1;\ 0) + 2(1;\ 1) = (5;\ 2)$.`,
          fb:['',
            R`Das sind die Komponenten in der Standardbasis. In der Basis $b_1, b_2$ trägt $b_2$ auch zur ersten Zeile bei.`,
            R`Die erste Zeile ist $c_1 + c_2 = 5$; $c_2$ muss abgezogen, nicht addiert werden.`]}},
      {id:'mv-t1f', title:'Ein Vektor, zwei Spalten',
        num:{title:'Zurück in die Standardbasis', text:R`Aus der Spalte $(-1;\ 3)$ in der Basis $b_1 = (1;\ 0)$, $b_2 = (1;\ 1)$ wird der Vektor zurückgebaut:

$$-1\cdot\begin{pmatrix}1\\ 0\end{pmatrix} + 3\cdot\begin{pmatrix}1\\ 1\end{pmatrix} = \begin{pmatrix}2\\ 3\end{pmatrix}.$$

Jede Komponente wird mit ihrem Basisvektor multipliziert, dann wird addiert.`},
        text:R`Derselbe Vektor hat also mehrere Spalten, eine für jede Basis. Man schreibt $v \doteq (2;\ 3)$, gelesen „$v$ wird in dieser Basis dargestellt durch $(2;\ 3)$“. Übersetzen in die eine Richtung heißt: Komponenten mal Basisvektoren, aufsummieren. In die andere Richtung heißt es bisher: ein Gleichungssystem lösen. Abschnitt 3 zeigt, wie das mit einer besonderen Art von Basis viel schneller geht.

Die Tafel stellt die Gestalten nebeneinander. **Ausblick (Thema 6):** In der Quantenmechanik ist das zentral. Derselbe Zustand hat in der Orts-, Impuls- oder Energiebasis ganz verschiedene Komponenten.`,
        reps:{obj:R`Der Vektor $v$: „2 nach rechts, 3 nach oben“`,
          rows:[
            {k:'worte', text:'Ein Pfeil vom Ursprung: zwei Einheiten nach rechts, drei nach oben.'},
            {k:'matrix', tex:R`v \doteq \begin{pmatrix}2\\ 3\end{pmatrix}`, text:R`Spalte in der Standardbasis $e_1 = (1;\ 0)$, $e_2 = (0;\ 1)$`},
            {k:'formel', tex:R`v = -1\cdot b_1 + 3\cdot b_2\ \Longrightarrow\ v \doteq \begin{pmatrix}-1\\ 3\end{pmatrix}`, text:R`Spalte in der schiefen Basis $b_1 = (1;\ 0)$, $b_2 = (1;\ 1)$`},
            {k:'physik', text:R`**Ausblick (Thema 6):** Ein Zustand $\psi$ ist der Vektor, nicht eine seiner Spalten. In der Energiebasis hat er die Komponenten $c_n$, in der Ortsbasis die Werte $\psi(x)$. Beide Listen beschreiben denselben Zustand.`}
          ],
          links:[
            {from:'worte', to:'matrix', rule:R`„Nach rechts“ ist der Faktor vor $e_1$, „nach oben“ der vor $e_2$. Beide untereinander schreiben.`},
            {from:'matrix', to:'formel', rule:R`$c_1b_1 + c_2b_2 = v$ ansetzen und Zeile für Zeile lösen; die Lösung ist die neue Spalte.`},
            {from:'formel', to:'physik', rule:R`Die Basis als Wahl einer Messgröße lesen: Wechselst du die Basis, wechselt die Spalte, der Zustand bleibt.`}
          ]},
        q:{q:R`In der Basis $b_1 = (1;\ 0)$, $b_2 = (1;\ 1)$ hat ein Vektor die Spalte $(2;\ -1)$. Welche Spalte hat er in der Standardbasis?`, tr:{from:'formel', to:'matrix'},
          opts:[R`$(1;\ -1)$`, R`$(2;\ -1)$`, R`$(3;\ -1)$`], a:0,
          ex:R`$2(1;\ 0) - (1;\ 1) = (1;\ -1)$.`,
          fb:['',
            R`Die Spalte gehört zur Basis $b$. In der Standardbasis muss man erst $c_1b_1 + c_2b_2$ ausrechnen.`,
            R`Das Vorzeichen von $c_2 = -1$: In der ersten Zeile steht $2 - 1 = 1$.`]}},
      {id:'mv-t1g', title:'Typische Fehlvorstellung: Eine Basis muss senkrecht sein',
        num:{title:R`$(1;\ 0)$ und $(1;\ 1)$ schließen $45°$ ein`, text:R`Das Skalarprodukt aus der Schule ist $1\cdot1 + 0\cdot1 = 1 \ne 0$: Die beiden Vektoren stehen nicht senkrecht. Trotzdem lässt sich jeder Vektor aus ihnen bauen, wie im Schritt „Basis und Dimension“. Sie sind eine Basis.`},
        text:R`Viele denken bei „Basis“ an senkrechte Achsen. Das ist zu eng. Eine Basis muss nur zwei Dinge leisten: Jeder Vektor lässt sich darstellen, und die Darstellung ist eindeutig. Dafür braucht man lineare Unabhängigkeit, keinen rechten Winkel.

Senkrecht stehen kann man ohnehin erst sagen, wenn man ein Skalarprodukt hat; lineare Unabhängigkeit kommt ohne aus. Bei Polynomen oder Funktionen ist zunächst gar nicht klar, was „senkrecht“ heißen soll. Senkrechte, normierte Basen sind aber besonders bequem; sie sind das Thema von Abschnitt 3.`,
        q:{q:R`Welches Paar ist eine Basis von $\mathbb C^2$?`,
          opts:[R`$(1;\ 2)$ und $(2;\ 4)$`, R`$(1;\ i)$ und $(i;\ -1)$`, R`$(1;\ 1)$ und $(1;\ 2)$`], a:2,
          ex:R`$(1;\ 2)$ ist kein Vielfaches von $(1;\ 1)$: unabhängig, also eine Basis – auch wenn die beiden nicht senkrecht stehen.`,
          fb:[R`$(2;\ 4) = 2\,(1;\ 2)$: abhängig, nur eine Gerade.`,
            R`$(i;\ -1) = i\,(1;\ i)$: über $\mathbb C$ abhängig.`,
            '']}}
    ]},

    /* ===== Abschnitt 2: Skalarprodukt in ℂⁿ, Reihenfolge, Faktoren, Bra und Ket, Orthogonalität ===== */
    {id:'mv-t2', title:'Das Skalarprodukt in ℂⁿ – warum konjugiert wird', steps:[
      {id:'mv-t2a', title:'Das reelle Skalarprodukt versagt im Komplexen',
        num:{title:R`$a = (1;\ i)$`, text:R`Wörtlich übertragen: $a\cdot a = 1\cdot1 + i\cdot i = 1 + i^2 = 0$, obwohl $a$ nicht der Nullvektor ist. Für $(1;\ 2i)$ käme $1 + (2i)^2 = -3$ heraus – eine negative „Länge zum Quadrat“.`},
        text:R`Im $\mathbb R^n$ misst das Skalarprodukt $a\cdot b = \sum_ia_ib_i$ Längen und Winkel: $a\cdot a = |a|^2$ ist das Quadrat der Länge, und $a\cdot b = 0$ heißt senkrecht. Diese Formel möchte man auch in $\mathbb C^n$ benutzen, denn Länge und Senkrechtstehen braucht man dort ebenso.

Überträgt man sie wörtlich, geht etwas schief, wie das Beispiel zeigt. Ein Vektor, der nicht null ist, hätte die Länge null, ein anderer eine negative Länge zum Quadrat. Das komplexe Skalarprodukt muss also anders aussehen.`,
        q:{q:R`Was ergibt die reelle Formel $\sum_ia_i^2$ für $a = (2;\ i)$?`,
          opts:[R`$5$`, R`$\sqrt5$`, R`$3$`], a:2,
          ex:R`$2^2 + i^2 = 4 - 1 = 3$. Die tatsächliche Länge zum Quadrat ist aber $|2|^2 + |i|^2 = 5$ (nächster Schritt).`,
          fb:[R`$5$ entsteht erst mit Betragsquadraten, also mit Konjugation. Die reelle Formel quadriert ohne.`,
            R`$\sqrt5$ wäre die Länge mit Konjugation; die reelle Formel liefert $4 + i^2$.`,
            '']}},
      {id:'mv-t2b', title:'Links konjugieren',
        pre:{from:'m-komplex', seg:'mk-t1', title:'Betragsquadrat einer Zahl', text:R`Für eine komplexe Zahl ist $z^*z = |z|^2 = a^2 + b^2$ reell und nicht negativ; $z^2$ dagegen ist im Allgemeinen komplex. Mini-Beispiel: $(2i)^*\cdot 2i = (-2i)(2i) = 4$, aber $(2i)^2 = -4$.`},
        num:{title:R`$a = (1;\ i)$ mit Konjugation`, text:R`Konjugiert man die Einträge des linken Vektors, wird jedes Produkt ein Betragsquadrat:

$$\langle a|a\rangle = 1^*\cdot 1 + i^*\cdot i = 1 + (-i)\,i = 1 + 1 = 2.$$

Die Länge ist $\sqrt2$, wie es sein soll.`},
        text:R`Die Lösung kennst du aus M1: Für eine einzelne Zahl ist $z^*z = |z|^2 \ge 0$. Man konjugiert deshalb die Einträge des **linken** Vektors. Das [[lex:skalarprodukt|Skalarprodukt]] in $\mathbb C^n$ ist

$$\langle a|b\rangle = \sum_{i=1}^na_i^*\,b_i,\qquad \langle a|a\rangle = \sum_i|a_i|^2 \ge 0.$$

Man liest $\langle a|b\rangle$ „Skalarprodukt von $a$ und $b$“; das Ergebnis ist eine komplexe Zahl. Gleichheit $\langle a|a\rangle = 0$ gilt nur für $a = 0$. Die **Norm** ist $\|a\| = \sqrt{\langle a|a\rangle}$, die Länge des Vektors.`,
        q:{q:R`Für $a = (1;\ 2i)$ ist $\|a\|$ …`,
          opts:[R`$5$`, R`$\sqrt3$`, R`$\sqrt5$`], a:2,
          ex:R`$\langle a|a\rangle = |1|^2 + |2i|^2 = 5$; die Norm ist die Wurzel daraus.`,
          fb:[R`$5$ ist das Normquadrat $\langle a|a\rangle$. Die Norm ist seine Wurzel.`,
            R`$\sqrt3$ entsteht ohne Konjugation, aus $|1 + (2i)^2| = 3$.`,
            '']}},
      {id:'mv-t2c', title:'Die Reihenfolge zählt',
        num:{title:R`$a = (1;\ i)$, $b = (2;\ 1)$`, text:R`$\langle a|b\rangle = 1\cdot2 + (-i)\cdot1 = 2 - i$, aber $\langle b|a\rangle = 2\cdot1 + 1\cdot i = 2 + i$. Die beiden Zahlen sind zueinander konjugiert. Ihr Betrag ist in beiden Fällen $\sqrt5$.`},
        text:R`Im Reellen ist $a\cdot b = b\cdot a$. Im Komplexen dagegen hängt das Ergebnis davon ab, welcher Vektor links steht, denn nur dieser wird konjugiert. Vertauschst du die beiden, wird das Skalarprodukt konjugiert (Herleitung):

$$\langle b|a\rangle = \langle a|b\rangle^*.$$

Der Betrag $|\langle a|b\rangle|$ hängt also nicht von der Reihenfolge ab, die Phase schon. Für $a = b$ folgt $\langle a|a\rangle = \langle a|a\rangle^*$: Das Normquadrat ist reell, wie es sein muss.`,
        derive:{ctx:MVEK({params:{a_1:'complex', a_2:'complex', b_1:'complex', b_2:'complex', λ:'complex'}, states:{a:'(a_1; a_2)', b:'(b_1; b_2)'}}),
          lines:[
            {l:'⟨b|a⟩ = b_1^* a_1 + b_2^* a_2', w:'Definition: links konjugieren', why:{q:'Welche Einträge werden in $\\langle b|a\\rangle$ konjugiert?', opts:['die von $b$, dem linken Vektor', 'die von $a$, dem rechten Vektor', 'die von beiden Vektoren'], a:0, ex:'$\\langle b|a\\rangle = \\sum b_i^*a_i$. Würde man beide konjugieren, käme $(\\sum_i b_ia_i)^*$ heraus – für $a = (1; i)$ wäre $\\langle a|a\\rangle$ dann wieder $(1 + i^2)^* = 0$.'}},
            {l:'= (a_1^* b_1 + a_2^* b_2)^*', w:'$(z^*w)^* = z\\,w^*$', why:{q:'Warum ist das gleich $\\langle a|b\\rangle^*$?', opts:['Weil $(a_i^*b_i)^* = a_ib_i^*$ ist, gliedweise in der Summe.', 'Weil $\\langle a|b\\rangle$ immer eine reelle Zahl ist.', 'Weil man in jedem Produkt tauschen darf: $a_i^*b_i = b_ia_i^*$.'], a:0, ex:'Konjugieren ist mit Summe und Produkt verträglich. Vertauschen allein ändert nichts; erst das Konjugieren macht aus $\\langle a|b\\rangle$ den Wert $\\langle b|a\\rangle$.'}}
          ]},
        q:{q:R`Es ist $\langle a|b\rangle = 3i$. Was ist $\langle b|a\rangle$?`,
          opts:[R`$-3i$`, R`$3i$`, R`$3$`], a:0,
          ex:R`Vertauschen konjugiert: $(3i)^* = -3i$.`,
          fb:['',
            R`Das gilt nur im Reellen. Im Komplexen ist $\langle b|a\rangle = \langle a|b\rangle^*$.`,
            R`Der Betrag $3$ bleibt gleich, aber die Zahl selbst wird konjugiert, nicht durch ihren Betrag ersetzt.`]}},
      {id:'mv-t2d', title:'Faktoren: rechts unverändert, links konjugiert',
        num:{title:R`Der Faktor $2i$`, text:R`Mit $\langle a|b\rangle = 2 - i$ aus dem letzten Schritt: Rechts kommt der Faktor unverändert heraus,

$$\langle a|2i\,b\rangle = 2i(2 - i) = 2 + 4i.$$

Links kommt er konjugiert heraus: $\langle 2i\,a|b\rangle = -2i(2 - i) = -2 - 4i$.`},
        text:R`Ein Faktor im rechten Vektor kommt unverändert heraus: $\langle a|\lambda b\rangle = \lambda\langle a|b\rangle$. Man sagt, das Skalarprodukt ist im rechten Argument **linear**. Ein Faktor im linken Vektor kommt konjugiert heraus, $\langle\lambda a|b\rangle = \lambda^*\langle a|b\rangle$: **antilinear** (Herleitung). Daraus folgt $\|\lambda a\| = |\lambda|\,\|a\|$; ein Phasenfaktor $e^{i\alpha}$ ändert die Norm nicht.

Das ist die Konvention der Physik. Viele Mathematikbücher konjugieren den rechten Vektor; dann sind alle Formeln gespiegelt. Prüfe beim Lesen, welche Konvention gilt.`,
        derive:{ctx:MVEK({params:{a_1:'complex', a_2:'complex', b_1:'complex', b_2:'complex', λ:'complex'}, states:{a:'(a_1; a_2)', b:'(b_1; b_2)'}}),
          lines:[
            {l:'⟨λ a|b⟩ = (λ a_1)^* b_1 + (λ a_2)^* b_2', w:'λa steht links', why:{q:'Warum steht $(\\lambda a_1)^*$ und nicht $\\lambda a_1^*$?', opts:['Weil der ganze linke Vektor $\\lambda a$ konjugiert wird.', 'Weil $\\lambda$ als Vorfaktor immer reell ist.', 'Weil man $\\lambda$ erst ganz am Ende der Rechnung konjugiert.'], a:0, ex:'Die Einträge des linken Vektors sind $\\lambda a_i$; konjugiert werden sie vollständig.'}},
            {l:'= λ^* (a_1^* b_1 + a_2^* b_2)', w:'$(\\lambda a_i)^* = \\lambda^*a_i^*$', why:{q:'Welche Regel aus M1 steckt hier?', opts:['$(z_1z_2)^* = z_1^*z_2^*$', '$(z_1 + z_2)^* = z_1^* + z_2^*$', '$|z|^2 = z^*z$'], a:0, ex:'Die Konjugierte eines Produkts ist das Produkt der Konjugierten. Dann klammert man $\\lambda^*$ aus.'}},
            {l:'= λ^* ⟨a|b⟩', w:'antilinear im linken Argument', why:{q:'Was folgt für $\\langle 2i\\,a|b\\rangle$?', opts:['$-2i\\langle a|b\\rangle$', '$2i\\langle a|b\\rangle$', '$2\\langle a|b\\rangle$'], a:0, ex:'$(2i)^* = -2i$. Im rechten Argument käme der Faktor dagegen unverändert heraus: $\\langle a|2i\\,b\\rangle = 2i\\langle a|b\\rangle$.'}}
          ]},
        q:{q:R`Es ist $\langle a|b\rangle = 1 + 2i$. Was ist $\langle 3i\,a|b\rangle$?`,
          opts:[R`$6 - 3i$`, R`$-6 + 3i$`, R`$3 + 6i$`], a:0,
          ex:R`$\langle 3i\,a|b\rangle = (3i)^*\langle a|b\rangle = -3i(1 + 2i) = -3i + 6$.`,
          fb:['',
            R`Ohne Konjugation: $3i(1 + 2i) = -6 + 3i$. Im linken Argument wird der Faktor konjugiert.`,
            R`Rechne $(-3i)(1 + 2i)$ vollständig aus: $-3i - 6i^2 = 6 - 3i$.`]}},
      {id:'mv-t2e', title:'Bra, Ket und Zeile mal Spalte',
        num:{title:'Die Zeile zur Spalte', text:R`Zum Ket $|a\rangle = \begin{pmatrix}1\\ i\end{pmatrix}$ gehört die Zeile $\langle a| = (1,\ -i)$. Zeile mal Spalte:

$$\langle a|b\rangle = (1,\ -i)\begin{pmatrix}2\\ 1\end{pmatrix} = 2 - i.$$`},
        text:R`Die Physik schreibt Vektoren in der **Dirac-Schreibweise**. Den Vektor als Spalte nennt man **Ket** $|a\rangle$, gelesen „Ket a“. Zu ihm gehört die Zeile $\langle a|$, der **Bra**, mit den **konjugierten** Einträgen; gelesen „Bra a“. Das Skalarprodukt ist dann einfach Zeile mal Spalte. Daher die Namen: Bra und Ket bilden zusammen eine Klammer, englisch *bracket*.

Die Konjugation steckt jetzt in der Zeile. Wer den Bra richtig hinschreibt, kann sie nicht mehr vergessen. **Ausblick (M5 und Thema 6):** M5 überträgt das Skalarprodukt auf Funktionen, Thema 6 die ganze [[lex:dirac-notation|Dirac-Notation]].`,
        reps:{obj:R`Das Skalarprodukt von $a = (1;\ i)$ und $b = (2;\ 1)$`,
          rows:[
            {k:'worte', text:R`Wie weit zeigt $b$ in Richtung $a$? Ein Überlapp, mit Betrag und Phase.`},
            {k:'dirac', tex:R`\langle a|b\rangle`},
            {k:'matrix', tex:R`(1,\ -i)\begin{pmatrix}2\\ 1\end{pmatrix} = 1\cdot 2 + (-i)\cdot 1 = 2 - i`},
            {k:'formel', tex:R`\sum_i a_i^*\,b_i = 1^*\cdot 2 + i^*\cdot 1`},
            {k:'physik', text:R`**Ausblick (Thema 6 und 10):** Für normierte Zustände ist $|\langle a|b\rangle|^2$ eine Wahrscheinlichkeit: Ein System im Zustand $b$ wird bei einer passenden Messung mit dieser Wahrscheinlichkeit im Zustand $a$ gefunden. Hier, nach dem Normieren: $|2 - i|^2/(2\cdot 5) = \tfrac12$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`Der Vektor, in dessen Richtung du schaust, kommt in den Bra (links), der andere in den Ket (rechts).`},
            {from:'dirac', to:'matrix', rule:R`Den Bra als Zeile mit konjugierten Einträgen schreiben, den Ket als Spalte; dann Zeile mal Spalte.`},
            {from:'matrix', to:'formel', rule:R`Zeile mal Spalte ist die Summe der Produkte Eintrag für Eintrag; die Sterne stehen an den Einträgen der Zeile.`},
            {from:'formel', to:'physik', rule:R`Erst durch die Normen teilen, dann den Betrag quadrieren: $|\langle a|b\rangle|^2$ ist die Wahrscheinlichkeit, nicht $\langle a|b\rangle$ selbst.`}
          ]},
        q:{q:R`Welche Zeile gehört zum Bra $\langle c|$ für $|c\rangle = \begin{pmatrix}2i\\ 3\end{pmatrix}$?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$(2i,\ 3)$`, R`$(-2i,\ 3)$`, R`$\begin{pmatrix}-2i\\ 3\end{pmatrix}$`], a:1,
          ex:R`Transponieren macht die Zeile, Konjugieren macht aus $2i$ den Eintrag $-2i$. Die reelle $3$ bleibt.`,
          fb:[R`Nur transponiert. Ohne Konjugation käme $\langle c|c\rangle = (2i)^2 + 9 = 5$ statt $13$ heraus.`,
            '',
            R`Ein Bra ist eine Zeile, keine Spalte.`]}},
      {id:'mv-t2f', title:'Typischer Fehler: ohne Konjugation „senkrecht“',
        num:{title:'Zirkular polarisiertes Licht', text:R`Die Jones-Vektoren $r = \tfrac{1}{\sqrt2}(1;\ i)$ und $l = \tfrac{1}{\sqrt2}(1;\ -i)$ beschreiben die beiden Drehsinne. Mit Konjugation:

$$\langle r|l\rangle = \tfrac12\left(1\cdot1 + (-i)(-i)\right) = \tfrac12(1 + i^2) = 0.$$

Ohne Konjugation käme $\tfrac12(1 + i\cdot(-i)) = 1$ heraus – als wären beide gleich.`},
        text:R`**Orthogonal** heißen $a$ und $b$, wenn $\langle a|b\rangle = 0$ ist. Im Beispiel sind $r$ und $l$ orthogonal: Ein Filter, der die eine Zirkularpolarisation durchlässt, sperrt die andere vollständig ([[lex:polarisation-jones|Jones-Vektoren]]). Ohne Konjugation hätte man sie für gleich gehalten.

Der Fehler wirkt auch umgekehrt: Ohne Konjugation können Vektoren „senkrecht“ erscheinen, die es nicht sind. Ein schneller Test für jede Rechnung: Ein Normquadrat $\langle a|a\rangle$ muss reell und positiv sein. Ist es das nicht, fehlt ein Stern oder steht am falschen Vektor.`,
        q:{q:R`Sind $a = (1;\ 2i)$ und $b = (2;\ i)$ orthogonal?`,
          opts:[R`Ja: $1\cdot2 + 2i\cdot i = 0$.`, R`Ja, weil die Einträge nur vertauscht sind.`, R`Nein: $\langle a|b\rangle = 2 + 2 = 4$.`], a:2,
          ex:R`$\langle a|b\rangle = 1\cdot2 + (-2i)\cdot i = 2 - 2i^2 = 4$. Ohne Konjugation käme fälschlich $0$ heraus.`,
          fb:[R`Hier fehlt die Konjugation von $2i$ im linken Vektor. Mit ihr ist $(-2i)\cdot i = 2$.`,
            R`Vertauschte Einträge machen Vektoren nicht senkrecht; entscheidend ist $\langle a|b\rangle$.`,
            '']}}
    ]},

    /* ===== Abschnitt 3: ONB, Komponenten durch Skalarprodukte, Pfeil ↔ Labor ↔ Spalte, Parseval, Vollständigkeit ===== */
    {id:'mv-t3', title:'Orthonormalbasen: Komponenten durch Skalarprodukte', steps:[
      {id:'mv-t3a', title:'Orthonormalbasis',
        num:{title:R`$e_1 = \tfrac{1}{\sqrt2}(1;\ i)$, $e_2 = \tfrac{1}{\sqrt2}(1;\ -i)$`, text:R`Normiert: $\langle e_1|e_1\rangle = \tfrac12(1 + 1) = 1$, ebenso $\langle e_2|e_2\rangle = 1$. Senkrecht: $\langle e_1|e_2\rangle = \tfrac12\left(1 + (-i)(-i)\right) = \tfrac12(1 - 1) = 0$. Es sind die Zirkularpolarisationen aus dem letzten Abschnitt.`},
        text:R`Eine Basis $e_1, \dots, e_n$ heißt [[lex:orthonormalbasis|Orthonormalbasis]] (ONB), wenn

$$\langle e_i|e_j\rangle = \delta_{ij} = \begin{cases}1, & i = j,\\ 0, & i \ne j.\end{cases}$$

Das Symbol $\delta_{ij}$, gelesen „Kronecker-Delta“, ist nur eine Abkürzung für diese Fallunterscheidung. Alle Basisvektoren sind also normiert und stehen paarweise senkrecht. Orthonormale Vektoren sind automatisch unabhängig. In $\mathbb C^n$ bilden deshalb $n$ von ihnen immer eine Basis, ganz ohne weitere Prüfung.`,
        derive:{ctx:MVEK({params:{c_1:'complex', c_2:'complex'}, states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'c_1 (1; i)/sqrt(2) + c_2 (1; -i)/sqrt(2)'}}),
          lines:[
            {l:'⟨e_1|e_2⟩ = 1/2 (1, -i)(1; -i)', w:'Bra von e₁: konjugierte Zeile', why:{q:'Warum steht links die Zeile $(1, -i)$?', opts:['Die Zeile zum Bra $\\langle e_1|$ ist konjugiert.', 'Das Minus kommt aus dem Vektor $e_2$.', 'Transponieren allein dreht das Vorzeichen von $i$.'], a:0, ex:'$e_1 = (1; i)/\\sqrt2$, also $\\langle e_1| = (1, -i)/\\sqrt2$. Transponieren macht nur aus der Spalte eine Zeile.'}},
            {l:'= 0', w:'1 + (−i)(−i) = 1 + i² = 0', why:{q:'Was folgt zusammen mit $\\langle e_1|e_1\\rangle = \\langle e_2|e_2\\rangle = 1$?', opts:['$e_1, e_2$ sind eine Orthonormalbasis.', '$e_1$ und $e_2$ sind gleich.', '$e_1$ und $e_2$ sind linear abhängig.'], a:0, ex:'Zwei orthonormale Vektoren in $\\mathbb C^2$ sind unabhängig und bilden eine Basis. Orthogonale Vektoren $\\neq 0$ sind nie abhängig.'}}
          ]},
        q:{q:R`Für welches $c$ ist $\tfrac{1}{\sqrt2}(1;\ c)$ orthogonal zu $\tfrac{1}{\sqrt2}(1;\ i)$?`,
          opts:[R`$c = i$`, R`$c = -i$`, R`$c = -1$`], a:1,
          ex:R`$\tfrac12\left(1 + (-i)\,c\right) = 0$ verlangt $c = \tfrac1i = -i$.`,
          fb:[R`Mit $c = i$ ist es derselbe Vektor: $\tfrac12(1 + (-i)\,i) = 1$.`,
            '',
            R`$\tfrac12\left(1 + (-i)(-1)\right) = \tfrac12(1 + i) \ne 0$.`]}},
      {id:'mv-t3b', title:'Komponenten durch Skalarprodukte',
        num:{title:R`$v = (3;\ i)$ in der Basis $e_1, e_2$`, text:R`$c_1 = \langle e_1|v\rangle = \tfrac{1}{\sqrt2}\left(3 + (-i)\,i\right) = \tfrac{4}{\sqrt2} = 2\sqrt2$ und $c_2 = \langle e_2|v\rangle = \tfrac{1}{\sqrt2}(3 + i\cdot i) = \tfrac{2}{\sqrt2} = \sqrt2$. Probe:

$$2\sqrt2\cdot\tfrac{1}{\sqrt2}\begin{pmatrix}1\\ i\end{pmatrix} + \sqrt2\cdot\tfrac{1}{\sqrt2}\begin{pmatrix}1\\ -i\end{pmatrix} = \begin{pmatrix}3\\ i\end{pmatrix}.$$`},
        text:R`In einer ONB werden Komponenten besonders einfach. Setze $v = \sum_jc_je_j$ an und bilde das Skalarprodukt mit $e_i$ von links. Im rechten Argument ist das Skalarprodukt linear, die Summe darf also heraus:

$$\langle e_i|v\rangle = \sum_jc_j\langle e_i|e_j\rangle = \sum_jc_j\,\delta_{ij} = c_i.$$

Jede Komponente ist ein einzelnes Skalarprodukt, **ohne** Gleichungssystem (Herleitung). Achte auf die Reihenfolge: $c_i = \langle e_i|v\rangle$, nicht $\langle v|e_i\rangle = c_i^*$.`,
        derive:{ctx:MVEK({params:{c_1:'complex', c_2:'complex'}, states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'c_1 (1; i)/sqrt(2) + c_2 (1; -i)/sqrt(2)'}}),
          lines:[
            {l:'⟨e_1|v⟩ = c_1 ⟨e_1|e_1⟩ + c_2 ⟨e_1|e_2⟩', w:'linear im rechten Argument', why:{q:'Warum kommen $c_1$ und $c_2$ unverändert heraus?', opts:['Weil sie rechts stehen und $\\langle\\cdot|\\cdot\\rangle$ dort linear ist.', 'Weil $c_1$ und $c_2$ hier reelle Zahlen sind.', 'Weil man dabei stets beide Seiten konjugiert.'], a:0, ex:'$\\langle a|\\lambda b\\rangle = \\lambda\\langle a|b\\rangle$. Die $c_i$ dürfen komplex sein.'}},
            {l:'= c_1', w:'ONB', why:{q:'Warum fällt $c_2$ weg?', opts:['Wegen $\\langle e_1|e_2\\rangle = 0$', 'Weil $c_2$ klein ist', 'Wegen $\\langle e_1|e_1\\rangle = 0$'], a:0, ex:'Orthogonalität filtert $c_1$ heraus, die Normierung $\\langle e_1|e_1\\rangle = 1$ lässt es unverändert.'}}
          ]},
        q:{q:R`In einer ONB ist $v = 3e_1 + 4i\,e_2$. Was ist $\langle e_2|v\rangle$?`,
          opts:[R`$4i$`, R`$-4i$`, R`$5$`], a:0,
          ex:R`$c_2 = \langle e_2|v\rangle = 4i$.`,
          fb:['',
            R`$-4i$ wäre $\langle v|e_2\rangle = c_2^*$.`,
            R`$5$ ist die Norm von $v$, keine Komponente.`]}},
      {id:'mv-t3c', title:'Pfeil, Labor, Skalarprodukt und Spalte',
        num:{title:R`$v = (1;\ 1)$ in der um $30°$ gedrehten Basis`, text:R`Mit $e'_1 = (\cos30°;\ \sin30°)$ und $e'_2 = (-\sin30°;\ \cos30°)$:

$$c_1 = \tfrac{\sqrt3}{2} + \tfrac12 \approx 1{,}366,\qquad c_2 = -\tfrac12 + \tfrac{\sqrt3}{2} \approx 0{,}366.$$`},
        text:R`Für reelle Vektoren hat das Skalarprodukt $c_i = \langle e_i|v\rangle$ ein Bild: Es ist die Länge des Schattens von $v$ auf die Achse $e_i$, mit Vorzeichen. Fällst du von der Spitze von $v$ das Lot auf die Achse, triffst du den Punkt $c_ie_i$. Die beiden Anteile $c_1e_1$ und $c_2e_2$ ergeben zusammen wieder $v$.

Im Labor siehst du genau das. Die Tafel verbindet Pfeil, Laborbild, Skalarprodukt und Spalte am Beispiel. Achte im Labor darauf, was sich ändert, wenn du nur die Basis drehst: die Spalte, nicht der Pfeil.`,
        reps:{obj:R`$v = (1;\ 1)$ in der um $30°$ gedrehten Basis`,
          rows:[
            {k:'worte', text:R`Von der Spitze von $v$ das Lot auf jede der beiden gedrehten Achsen fällen; die Fußpunkte sind die Anteile.`},
            {k:'labor', text:R`„Komponente v₁“ und „Komponente v₂“ auf $1$, „Drehwinkel φ der Basis“ auf $30$. Die breiten Pfeile sind $c_1e'_1$ und $c_2e'_2$, die gestrichelten Linien die Lote.`},
            {k:'formel', tex:R`\begin{aligned}c_1 &= \cos30° + \sin30° \approx 1{,}366\\ c_2 &= -\sin30° + \cos30° \approx 0{,}366\end{aligned}`, text:R`Skalarprodukte $c_i = \langle e'_i|v\rangle$`},
            {k:'matrix', tex:R`v \doteq \begin{pmatrix}1{,}366\\ 0{,}366\end{pmatrix}`, text:R`Spalte in der gedrehten Basis $e'$. In der Standardbasis ist dieselbe Spalte $(1;\ 1)$.`},
            {k:'physik', text:R`**Ausblick (Thema 6):** In der Basis einer Messgröße heißen die Komponenten eines normierten Zustands Amplituden. Ihre Betragsquadrate sind die Wahrscheinlichkeiten der Messergebnisse; hier wären es nach dem Normieren $1{,}866/2 \approx 0{,}93$ und $0{,}134/2 \approx 0{,}07$.`}
          ],
          links:[
            {from:'worte', to:'labor', rule:R`$v$ mit den beiden Komponenten-Reglern einstellen, die Basis mit dem Drehwinkel drehen; die Lote zeichnet das Labor gestrichelt.`},
            {from:'labor', to:'formel', rule:R`Die Länge eines breiten Pfeils, mit Vorzeichen, ist das Skalarprodukt von $v$ mit dem zugehörigen Basisvektor.`},
            {from:'formel', to:'matrix', rule:R`Die Skalarprodukte $c_1, c_2$ untereinander schreiben: Das ist die Spalte von $v$ in der neuen Basis.`},
            {from:'matrix', to:'physik', rule:R`Die Spalte normieren und jeden Eintrag betragsquadrieren: Die Zahlen summieren sich zu 1.`}
          ]},
        q:{q:R`Im Labor: $v_1 = 0$, $v_2 = 2$ und „Drehwinkel φ der Basis“ auf $90$. Was zeigt die Anzeige für $c_1$ und $c_2$?`, tr:{from:'labor', to:'formel'},
          opts:[R`$c_1 = 0$, $c_2 = 2$`, R`$c_1 = 2$, $c_2 = 0$`, R`$c_1 = 0$, $c_2 = -2$`], a:1,
          ex:R`Bei $90°$ ist $e'_1 = (0;\ 1)$ und $e'_2 = (-1;\ 0)$. Also $c_1 = \langle e'_1|v\rangle = 2$ und $c_2 = 0$: $v$ liegt genau auf der Achse $e'_1$.`,
          fb:[R`Das sind die Komponenten in der ungedrehten Standardbasis. Nach der Drehung zeigt $e'_1$ nach oben.`,
            '',
            R`$e'_2 = (-1;\ 0)$ steht senkrecht auf $v = (0;\ 2)$; der Schatten darauf ist null.`]}},
      {id:'mv-t3d', title:'Parseval: Pythagoras in jeder Orthonormalbasis',
        num:{title:R`$v = (3;\ i)$`, text:R`In der Basis $e_1, e_2$ war $c_1 = 2\sqrt2$ und $c_2 = \sqrt2$. Dann ist

$$|c_1|^2 + |c_2|^2 = 8 + 2 = 10 = |3|^2 + |i|^2 = \langle v|v\rangle.$$

Dieselbe Länge, aus ganz anderen Zahlen.`},
        text:R`Für $v = \sum c_ie_i$ und $w = \sum d_ie_i$ in einer ONB folgt

$$\langle v|w\rangle = \sum_ic_i^*d_i,\qquad \langle v|v\rangle = \sum_i|c_i|^2.$$

Die zweite Gleichung heißt Parseval-Gleichung. Sie ist ein verallgemeinerter Pythagoras und eine gute Kontrolle jeder Entwicklung (Herleitung). Im Labor zeigt die Anzeige sie: $c_1^2 + c_2^2$ bleibt gleich $|v|^2$, wie auch immer du die Basis drehst; nur die Aufteilung ändert sich. **Ausblick (Thema 6):** Für einen normierten Zustand heißt das: Die Wahrscheinlichkeiten aller Messergebnisse summieren sich zu 1.`,
        fig:{lab:'vectors', caption:R`Ein fester Vektor $v$ in einer drehbaren Orthonormalbasis. Die breiten Pfeile sind die Anteile $c_ie'_i$ mit $c_i = \langle e'_i|v\rangle$. Sie ändern sich mit dem Drehwinkel, die Summe $c_1^2 + c_2^2 = |v|^2$ in der Anzeige bleibt gleich.`},
        derive:{ctx:MVEK({params:{c_1:'complex', c_2:'complex'}, states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'c_1 (1; i)/sqrt(2) + c_2 (1; -i)/sqrt(2)'}}),
          lines:[
            {l:'⟨v|v⟩ = |c_1|^2 + |c_2|^2', w:'Parseval', why:{q:'Warum steht hier $|c_1|^2$ und nicht $c_1^2$?', opts:['Weil ein Faktor $c_1$ von links kommt und konjugiert wird.', 'Weil eine Norm immer Beträge enthalten muss.', 'Weil $c_1^2 = |c_1|^2$ für jede komplexe Zahl gilt.'], a:0, ex:'$\\langle v|v\\rangle = \\sum_{i,j}c_i^*c_j\\langle e_i|e_j\\rangle = \\sum_i c_i^*c_i$. Für komplexe Zahlen ist $c^2 \\neq |c|^2$.'}}
          ]},
        q:{q:R`In einer ONB hat $v$ die Komponenten $c_1 = 1 + i$ und $c_2 = 2$. Wie lang ist $v$?`,
          opts:[R`$\|v\| = 6$`, R`$\|v\| = \sqrt6$`, R`$\|v\| = 2 + \sqrt2$`], a:1,
          ex:R`$\|v\|^2 = |1 + i|^2 + |2|^2 = 2 + 4 = 6$.`,
          fb:[R`$6$ ist das Normquadrat. Die Länge ist die Wurzel daraus.`,
            '',
            R`Längen addieren sich nicht einfach; die Quadrate addieren sich, wie bei Pythagoras.`]}},
      {id:'mv-t3e', title:'Vollständigkeit: die Eins einschieben',
        num:{title:'Spalte mal Zeile', text:R`Für $e_1 = \tfrac{1}{\sqrt2}(1;\ i)$:

$$|e_1\rangle\langle e_1| = \frac12\begin{pmatrix}1\\ i\end{pmatrix}(1,\ -i) = \frac12\begin{pmatrix}1 & -i\\ i & 1\end{pmatrix}.$$

Ebenso $|e_2\rangle\langle e_2| = \tfrac12\begin{pmatrix}1 & i\\ -i & 1\end{pmatrix}$. Die Summe ist $\begin{pmatrix}1 & 0\\ 0 & 1\end{pmatrix}$.`},
        text:R`Setzt du $c_i = \langle e_i|v\rangle$ in $v = \sum_ic_ie_i$ ein, gilt $|v\rangle = \sum_i|e_i\rangle\langle e_i|v\rangle$ für jedes $v$. Als Gleichung zwischen Matrizen schreibt man das

$$\sum_i|e_i\rangle\langle e_i| = \mathbb 1.$$

$|e_i\rangle\langle e_i|$ ist Spalte mal Zeile, also eine Matrix; $\langle e_i|e_i\rangle$ ist Zeile mal Spalte, also eine Zahl. Die Herleitung prüft die Gleichung im Beispiel. Dieses „Einschieben einer Eins“ ist einer der meistgebrauchten Rechenschritte in Thema 6.`,
        derive:{ctx:MVEK({params:{c_1:'complex', c_2:'complex'}, states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'c_1 (1; i)/sqrt(2) + c_2 (1; -i)/sqrt(2)'}}),
          lines:[
            {l:'(|e_1⟩⟨e_1|) + (|e_2⟩⟨e_2|) = (1, 0; 0, 1)', w:'Vollständigkeit', why:{q:'Was ist $|e_1\\rangle\\langle e_1|$ für eine Größe?', opts:['eine $2\\times 2$-Matrix: Spalte mal Zeile', 'eine Zahl: Zeile mal Spalte', 'ein Vektor, nämlich $e_1$ selbst'], a:0, ex:'$\\langle e_1|e_1\\rangle$ (Zeile mal Spalte) ist eine Zahl, $|e_1\\rangle\\langle e_1|$ (Spalte mal Zeile) eine Matrix. Was sie mit Vektoren macht, zeigt Abschnitt 4.'}}
          ]},
        q:{q:R`Was ist $|e\rangle\langle e|$ für $e = (1;\ 0)$?`,
          opts:[R`die Zahl $1$`, R`$\begin{pmatrix}1 & 0\\ 0 & 0\end{pmatrix}$`, R`$\begin{pmatrix}1 & 0\\ 0 & 1\end{pmatrix}$`], a:1,
          ex:R`Spalte mal Zeile: $\begin{pmatrix}1\\ 0\end{pmatrix}(1,\ 0)$. Nur der Eintrag oben links ist $1$.`,
          fb:[R`Die Zahl $1$ ist $\langle e|e\rangle$, Zeile mal Spalte.`,
            '',
            R`Die Einheitsmatrix entsteht erst, wenn man auch $|e_2\rangle\langle e_2|$ mit $e_2 = (0;\ 1)$ addiert.`]}},
      {id:'mv-t3f', title:'Typischer Fehler: Skalarprodukte in einer schiefen Basis',
        num:{title:R`$b_1 = (1;\ 0)$, $b_2 = (1;\ 1)$, $v = (2;\ 3)$`, text:R`Skalarprodukte geben $\langle b_1|v\rangle = 2$ und $\langle b_2|v\rangle = 5$. Die richtigen Komponenten aus Abschnitt 1 sind aber $-1$ und $3$. Probe: $2b_1 + 5b_2 = (7;\ 5) \ne v$.`},
        text:R`Die Formel $c_i = \langle e_i|v\rangle$ gilt nur in einer **Orthonormal**basis. In einer schiefen Basis wie im Beispiel liefert sie falsche Zahlen; dort musst du ein Gleichungssystem lösen. Auch die Parseval-Probe schlägt dort fehl: $(-1)^2 + 3^2 = 10 \ne 13$.

Ist die Basis orthogonal, aber nicht normiert, hilft ein Nenner: $c_i = \langle b_i|v\rangle/\langle b_i|b_i\rangle$. Der zweite häufige Fehler ist die Reihenfolge: $\langle v|e_i\rangle$ ist $c_i^*$, nicht $c_i$.`,
        q:{q:R`$b_1 = (1;\ 1)$ und $b_2 = (1;\ -1)$ sind orthogonal, aber nicht normiert. Welche Komponente $c_1$ hat $v = (3;\ 1)$ in dieser Basis?`,
          opts:[R`$c_1 = 2$`, R`$c_1 = 4$`, R`$c_1 = 2\sqrt2$`], a:0,
          ex:R`$c_1 = \frac{\langle b_1|v\rangle}{\langle b_1|b_1\rangle} = \frac42 = 2$. Probe: $2(1;\ 1) + 1\cdot(1;\ -1) = (3;\ 1)$.`,
          fb:['',
            R`$4 = \langle b_1|v\rangle$ ohne Nenner. Weil $b_1$ die Länge $\sqrt2$ hat, muss durch $\langle b_1|b_1\rangle = 2$ geteilt werden.`,
            R`$2\sqrt2$ ist die Komponente in der normierten Basis $b_1/\sqrt2$. Gefragt ist der Faktor vor $b_1$ selbst.`]}}
    ]},

    /* ===== Abschnitt 4: Projektion geometrisch ↔ Formel ↔ Matrix, Gram-Schmidt ===== */
    {id:'mv-t4', title:'Projektionen und das Gram-Schmidt-Verfahren', steps:[
      {id:'mv-t4a', title:'Projektion auf eine Richtung',
        num:{title:R`$v = (3;\ 1)$ auf $e = \tfrac{1}{\sqrt2}(1;\ 1)$`, text:R`$\langle e|v\rangle = \tfrac{1}{\sqrt2}(3 + 1) = 2\sqrt2$. Die Projektion ist

$$\langle e|v\rangle\,e = 2\sqrt2\cdot\tfrac{1}{\sqrt2}\begin{pmatrix}1\\ 1\end{pmatrix} = \begin{pmatrix}2\\ 2\end{pmatrix}.$$

Der Rest $v - (2;\ 2) = (1;\ -1)$ steht senkrecht auf $e$.`},
        text:R`Die [[lex:projektion|Projektion]] von $v$ auf die Richtung eines **normierten** Vektors $e$ ist $\langle e|v\rangle\,e$: die Komponente entlang $e$, mal $e$. Geometrisch ist das der Fußpunkt des Lots von der Spitze von $v$ auf die Gerade durch $e$.

Der Rest $v - \langle e|v\rangle e$ steht senkrecht auf $e$, denn $\langle e|v\rangle - \langle e|v\rangle\langle e|e\rangle = 0$. Jeder Vektor zerfällt so in einen Anteil entlang $e$ und einen Anteil senkrecht dazu. Das kennst du schon aus Abschnitt 3: Dort war jeder Anteil $c_ie_i$ eine Projektion.`,
        q:{q:R`Was ist die Projektion von $v = (2;\ 5)$ auf $e = (0;\ 1)$?`,
          opts:[R`die Zahl $5$`, R`$(2;\ 0)$`, R`$(0;\ 5)$`], a:2,
          ex:R`$\langle e|v\rangle = 5$, mal $e$: $(0;\ 5)$. Die Projektion ist ein Vektor, die Komponente eine Zahl.`,
          fb:[R`$5$ ist die Komponente $\langle e|v\rangle$. Die Projektion ist $5\,e$, ein Vektor.`,
            R`$(2;\ 0)$ ist der Rest, der senkrecht auf $e$ steht.`,
            '']}},
      {id:'mv-t4b', title:'Projektion geometrisch und als Formel',
        num:{title:R`$v = (3;\ 1)$ auf $a = (1;\ 1)$, nicht normiert`, text:R`Setze $e = a/\|a\| = a/\sqrt2$ ein:

$$\langle e|v\rangle\,e = \frac{\langle a|v\rangle}{\|a\|}\cdot\frac{a}{\|a\|} = \frac{\langle a|v\rangle}{\langle a|a\rangle}\,a = \frac42\begin{pmatrix}1\\ 1\end{pmatrix} = \begin{pmatrix}2\\ 2\end{pmatrix}.$$`},
        text:R`Ist der Richtungsvektor $a$ nicht normiert, setzt du $e = a/\|a\|$ ein und erhältst

$$P_av = \frac{\langle a|v\rangle}{\langle a|a\rangle}\,a.$$

Im Nenner steht $\langle a|a\rangle = \|a\|^2$, weil $a$ zweimal vorkommt: einmal im Skalarprodukt, einmal als Richtung. Als Matrix schreibt man $P_a = |a\rangle\langle a|/\langle a|a\rangle$; sie heißt [[lex:projektion|Projektor]] auf die Richtung $a$. Die Tafel zeigt dieselbe Projektion als Lot im Bild, als Formel und als Matrix, und sie zeigt, wo dir das in der Physik begegnet.`,
        reps:{obj:R`Projektion von $v = (3;\ 1)$ auf die Richtung $a = (1;\ 1)$`,
          rows:[
            {k:'worte', text:R`Der Schatten von $v$ auf der Geraden durch $a$, wenn das Licht senkrecht auf die Gerade fällt.`},
            {k:'graph', plot:{x:[0, 4], y:[0, 4], xlab:'x', ylab:'y', iso:true, ticks:[{x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}], yticks:[{y:1, lab:'1'}, {y:2, lab:'2'}, {y:3, lab:'3'}]}, f:x => x, lab:R`\text{Gerade durch } a`, f2:x => 4 - x, lab2:R`\text{Lot von } v`,
              cap:R`Das Lot von der Spitze $(3, 1)$ trifft die Gerade $y = x$ im Punkt $(2, 2)$. Das ist $P_av$. Der Rest $(1;\ -1)$ zeigt entlang des Lots.`},
            {k:'formel', tex:R`P_av = \frac{\langle a|v\rangle}{\langle a|a\rangle}\,a = \frac{4}{2}\begin{pmatrix}1\\ 1\end{pmatrix} = \begin{pmatrix}2\\ 2\end{pmatrix}`},
            {k:'matrix', tex:R`\begin{gathered}P_a = \frac{|a\rangle\langle a|}{\langle a|a\rangle} = \frac12\begin{pmatrix}1 & 1\\ 1 & 1\end{pmatrix}\\ P_a\begin{pmatrix}3\\ 1\end{pmatrix} = \begin{pmatrix}2\\ 2\end{pmatrix}\end{gathered}`},
            {k:'physik', text:R`Ein Polarisationsfilter mit Durchlassrichtung $e$ projiziert das Feld: Hinter ihm ist es $\langle e|E\rangle\,e$, die Intensität ist $|\langle e|E\rangle|^2$ (Vorhersage zu Beginn). **Ausblick (Thema 6):** Eine Messung projiziert einen Zustand ebenso. Die Zahl $\langle e|\psi\rangle$ heißt dann Wahrscheinlichkeitsamplitude; ihr Betragsquadrat ist die Wahrscheinlichkeit.`}
          ],
          links:[
            {from:'worte', to:'graph', rule:R`Die Gerade durch $a$ zeichnen und von der Spitze von $v$ das Lot fällen; der Fußpunkt ist die Projektion.`},
            {from:'graph', to:'formel', rule:R`Der Fußpunkt ist ein Vielfaches $\lambda a$. Weil der Rest $v - \lambda a$ senkrecht auf $a$ steht, ist $\lambda = \langle a|v\rangle/\langle a|a\rangle$.`},
            {from:'formel', to:'matrix', rule:R`Den Faktor vor $v$ herausziehen: Spalte $|a\rangle$ mal Zeile $\langle a|$, geteilt durch $\langle a|a\rangle$, ist die Projektionsmatrix.`},
            {from:'matrix', to:'physik', rule:R`$a$ durch die Durchlassrichtung des Filters ersetzen und $v$ durch das Feld; das Betragsquadrat der Komponente ist die durchgelassene Intensität.`}
          ]},
        q:{q:R`Im Bild fällst du das Lot von $v = (1;\ 2)$ auf die Gerade durch $a = (1;\ 1)$. Wo liegt der Fußpunkt?`, tr:{from:'graph', to:'formel'},
          opts:[R`bei $(3;\ 3)$`, R`bei $(1{,}5;\ 1{,}5)$`, R`bei $(1;\ 1)$`], a:1,
          ex:R`$\frac{\langle a|v\rangle}{\langle a|a\rangle}a = \frac32(1;\ 1)$. Probe: Der Rest $(-0{,}5;\ 0{,}5)$ steht senkrecht auf $a$.`,
          fb:[R`Der Nenner $\langle a|a\rangle = 2$ fehlt.`,
            '',
            R`$(1;\ 1)$ ist $a$ selbst. Der Rest $(0;\ 1)$ stünde nicht senkrecht auf $a$.`]}},
      {id:'mv-t4c', title:R`Typischer Fehler: der Nenner $\langle a|a\rangle$`,
        num:{title:R`Drei Rechnungen für $v = (3;\ 1)$, $a = (1;\ 1)$`, text:R`Ohne Nenner: $\langle a|v\rangle\,a = (4;\ 4)$, zu lang. Nur durch $\|a\|$ geteilt: $\tfrac{4}{\sqrt2}(1;\ 1) = (2\sqrt2;\ 2\sqrt2)$, immer noch zu lang. Richtig, durch $\langle a|a\rangle$ geteilt: $(2;\ 2)$. Nur dort steht der Rest $(1;\ -1)$ senkrecht auf $a$.`},
        text:R`Die Projektion auf einen nicht normierten Vektor ist der häufigste Rechenfehler dieses Abschnitts. Entweder fehlt der Nenner ganz, oder es wird nur durch $\|a\|$ geteilt statt durch $\|a\|^2$. Beide Fehler bemerkst du mit einer Probe: Der Rest $v - P_av$ muss senkrecht auf $a$ stehen.

Eine zweite Probe: Zweimal projizieren darf nichts mehr ändern, $P_a^2 = P_a$. Was schon auf der Geraden liegt, bleibt, wo es ist. Mit dem falschen Nenner würde jede weitere Projektion den Vektor weiter strecken.`,
        q:{q:R`Was ist die Projektion von $v = (3;\ 4)$ auf $a = (2;\ 0)$?`,
          opts:[R`$(6;\ 0)$`, R`$(12;\ 0)$`, R`$(3;\ 0)$`], a:2,
          ex:R`$\frac{\langle a|v\rangle}{\langle a|a\rangle}a = \frac64(2;\ 0) = (3;\ 0)$. Probe: Der Rest $(0;\ 4)$ steht senkrecht auf $a$.`,
          fb:[R`Hier wurde nur durch $\|a\| = 2$ geteilt. Der Nenner ist $\langle a|a\rangle = 4$.`,
            R`Der Nenner fehlt ganz: $6\cdot(2;\ 0)$.`,
            '']}},
      {id:'mv-t4d', title:'Gram-Schmidt: aus schief mach senkrecht',
        num:{title:R`$a_1 = (1;\ 0)$, $a_2 = (1;\ 1)$`, text:R`$e_1 = a_1$ ist schon normiert. Von $a_2$ die Projektion auf $e_1$ abziehen: $\langle e_1|a_2\rangle = 1$, also

$$w_2 = \begin{pmatrix}1\\ 1\end{pmatrix} - 1\cdot\begin{pmatrix}1\\ 0\end{pmatrix} = \begin{pmatrix}0\\ 1\end{pmatrix}.$$

Normiert ist das $e_2 = (0;\ 1)$. Aus der schiefen Basis ist die Standardbasis geworden.`},
        text:R`Aus linear unabhängigen Vektoren $a_1, a_2, \dots$ baut das [[lex:gram-schmidt|Gram-Schmidt-Verfahren]] eine ONB:

1. $e_1 = a_1/\|a_1\|$.
2. Vom nächsten Vektor die Projektionen auf alle fertigen $e_j$ abziehen: $w_k = a_k - \sum_{j<k}\langle e_j|a_k\rangle\,e_j$.
3. Normieren: $e_k = w_k/\|w_k\|$. Weiter mit Schritt 2.

Wie bei jeder Projektion steht der Rest $w_k$ senkrecht auf allen fertigen $e_j$. Er ist nie null, weil die $a_k$ unabhängig sind.`,
        q:{q:R`$a_1 = (2;\ 0)$ und $a_2 = (3;\ 1)$. Was ist $w_2 = a_2 - \langle e_1|a_2\rangle\,e_1$?`,
          opts:[R`$(0;\ 1)$`, R`$(1;\ 1)$`, R`$(-3;\ 1)$`], a:0,
          ex:R`Zuerst normieren: $e_1 = (1;\ 0)$. Dann $\langle e_1|a_2\rangle = 3$ und $w_2 = (3;\ 1) - 3(1;\ 0) = (0;\ 1)$.`,
          fb:['',
            R`Abgezogen wird nicht $a_1$, sondern die Projektion von $a_2$ auf $e_1$: $3\,e_1 = (3;\ 0)$.`,
            R`Hier wurde der Koeffizient mit dem nicht normierten $a_1$ gebildet: $\langle a_1|a_2\rangle = 6$ statt $\langle e_1|a_2\rangle = 3$. Erst normieren, dann projizieren.`]}},
      {id:'mv-t4e', title:R`Gram-Schmidt in $\mathbb C^2$`,
        num:{title:R`$a_1 = (1;\ i)$, $a_2 = (1;\ 1)$`, text:R`$e_1 = \tfrac{1}{\sqrt2}(1;\ i)$ und $\langle e_1|a_2\rangle = \tfrac{1}{\sqrt2}(1 - i)$. Abziehen gibt

$$w = \begin{pmatrix}1\\ 1\end{pmatrix} - \frac{1 - i}{2}\begin{pmatrix}1\\ i\end{pmatrix} = \begin{pmatrix}(1 + i)/2\\ (1 - i)/2\end{pmatrix}.$$

Hier ist $\langle w|w\rangle = \tfrac12 + \tfrac12 = 1$, also schon $e_2 = w$.`},
        text:R`Im Komplexen läuft das Verfahren genauso, mit dem komplexen Skalarprodukt. Der Koeffizient vor $e_1$ ist $\langle e_1|a_2\rangle$: der fertige Basisvektor links, konjugiert. Die Herleitung rechnet das Beispiel Zeile für Zeile und prüft am Ende, dass $w$ senkrecht auf $e_1$ steht.

Diese letzte Probe solltest du dir angewöhnen. Sie kostet eine Zeile und deckt Rechen- und Reihenfolgefehler sofort auf. **Ausblick (M8):** Wendet man Gram-Schmidt auf $1, x, x^2, \dots$ auf $[-1, 1]$ an, mit einem Skalarprodukt für Funktionen aus M5, entstehen bis auf die Normierung die [[lex:legendre-polynome|Legendre-Polynome]].`,
        derive:{title:R`Herleitung: ein Gram-Schmidt-Schritt in $\mathbb C^2$`, ctx:MVEK({states:{a_1:'(1; i)', a_2:'(1; 1)', e_1:'(1; i)/sqrt(2)', w:'((1 + i)/2; (1 - i)/2)'}}),
          lines:[
            {l:'⟨a_1|a_1⟩ = 2', w:'also e₁ = a₁/√2', why:{q:'Warum ist $\\langle a_1|a_1\\rangle = 2$ und nicht $0$?', opts:['$|1|^2 + |i|^2 = 1 + 1$', '$1^2 + i^2 = 1 - 1$, dann der Betrag', 'weil jede Norm mindestens 2 ist'], a:0, ex:'Mit Konjugation: $1\\cdot 1 + (-i)\\cdot i = 2$. Ohne Konjugation käme $0$ heraus.'}},
            {l:'⟨e_1|a_2⟩ = (1 - i)/sqrt(2)', w:'Zeile (1, −i)/√2 mal (1; 1)', why:{q:'Warum steht hier $1 - i$?', opts:['$1\\cdot 1 + (-i)\\cdot 1$, Zeile von $e_1$ konjugiert', '$1\\cdot 1 + i\\cdot 1$, ganz ohne Konjugation', '$a_2$ wird konjugiert, nicht $e_1$'], a:0, ex:'Der fertige Basisvektor $e_1$ steht links und wird konjugiert.'}},
            {l:'|a_2⟩ - ⟨e_1|a_2⟩ |e_1⟩ = ((1 + i)/2; (1 - i)/2)', w:'Projektion abziehen', why:{q:'Wie entsteht der zweite Eintrag $(1 - i)/2$?', opts:['$1 - \\frac{1 - i}{2}\\cdot i$', '$1 - \\frac{1 - i}{2}\\cdot 1$', '$1 - \\frac{1 - i}{\\sqrt2}\\cdot i$'], a:0, ex:'$\\frac{1 - i}{\\sqrt2}\\cdot\\frac{i}{\\sqrt2} = \\frac{i - i^2}{2} = \\frac{1 + i}{2}$, und $1 - \\frac{1 + i}{2} = \\frac{1 - i}{2}$. Die beiden $\\sqrt2$ geben zusammen den Nenner 2. Der Faktor $i$ ist der zweite Eintrag von $\\sqrt2\\,e_1$; der Faktor 1 gehört zum ersten Eintrag.'}},
            {l:'⟨w|w⟩ = 1', w:'zufällig schon normiert', why:{q:'Warum ist $\\langle w|w\\rangle = 1$?', opts:['$|\\tfrac{1 + i}{2}|^2 + |\\tfrac{1 - i}{2}|^2 = \\tfrac12 + \\tfrac12$', '$(\\tfrac{1 + i}{2})^2 + (\\tfrac{1 - i}{2})^2 = 1$', 'weil $w$ eine Projektion ist'], a:0, ex:'$|1 \\pm i|^2 = 2$, geteilt durch 4. Ohne Beträge käme $\\tfrac{2i}{4} - \\tfrac{2i}{4} = 0$ heraus. Projektionen sind im Allgemeinen nicht normiert.'}},
            {l:'⟨e_1|w⟩ = 0', w:'Kontrolle: senkrecht', why:{q:'Wozu dient diese Zeile?', opts:['als Probe, ob $w$ senkrecht auf $e_1$ steht', 'als Probe, ob $w$ normiert ist', 'als Probe, ob $e_1$ richtig berechnet ist'], a:0, ex:'Die Probe $\\langle e_1|w\\rangle = 0$ deckt Rechen- und Reihenfolgefehler sofort auf.'}}
          ]},
        q:{q:R`Welcher Koeffizient gehört vor $e_1$, wenn man von $a_2$ die Projektion auf $e_1$ abzieht?`,
          opts:[R`$\langle a_2|e_1\rangle$`, R`$\langle e_1|e_1\rangle$`, R`$\langle e_1|a_2\rangle$`], a:2,
          ex:R`Die Projektion von $a_2$ auf $e_1$ ist $\langle e_1|a_2\rangle\,e_1$, mit dem fertigen Basisvektor links.`,
          fb:[R`Das ist die konjugierte Zahl. Mit ihr steht der Rest nicht senkrecht auf $e_1$ (nächster Schritt).`,
            R`$\langle e_1|e_1\rangle = 1$ sagt nur, dass $e_1$ normiert ist; $a_2$ kommt darin gar nicht vor.`,
            '']}},
      {id:'mv-t4f', title:'Typischer Fehler: die Reihenfolge im Koeffizienten',
        num:{title:'Mit der falschen Reihenfolge', text:R`$\langle a_2|e_1\rangle = \tfrac{1}{\sqrt2}(1 + i)$ ist die konjugierte Zahl. Abziehen gibt $\left(\tfrac{1 - i}{2};\ \tfrac{3 - i}{2}\right)$, und die Probe schlägt fehl: Das Skalarprodukt mit $e_1$ ist $-\sqrt2\,i \ne 0$.`},
        text:R`Nimmt man als Koeffizienten $\langle a_k|e_j\rangle$ statt $\langle e_j|a_k\rangle$, also den konjugierten Wert, steht der Rest nicht senkrecht. Die Herleitung zeigt das am Beispiel. Im Reellen fällt dieser Fehler nicht auf, weil dort beide Reihenfolgen dasselbe ergeben.

Merke dir die Reihenfolge über die Bedeutung: $\langle e|a\rangle$ fragt „wie viel von $a$ liegt entlang $e$?“. Der Vektor, auf den projiziert wird, steht links. Dieselbe Regel gilt für Komponenten, $c_i = \langle e_i|v\rangle$, und für die Projektion im Beweis des nächsten Abschnitts.`,
        derive:{title:'Gegenprobe: falsche Reihenfolge', ctx:MVEK({states:{a_1:'(1; i)', a_2:'(1; 1)', e_1:'(1; i)/sqrt(2)', w:'((1 + i)/2; (1 - i)/2)'}}),
          lines:[
            {l:'⟨e_1|a_2 - ⟨a_2|e_1⟩ e_1⟩ = -sqrt(2) i', w:'falsche Reihenfolge: nicht senkrecht', why:{q:'Was zeigt dieses Ergebnis?', opts:['Mit $\\langle a_2|e_1\\rangle$ statt $\\langle e_1|a_2\\rangle$ ist der Rest nicht senkrecht.', 'Die Reihenfolge im Skalarprodukt ist gleichgültig.', 'Gram-Schmidt funktioniert in $\\mathbb C^2$ nicht.'], a:0, ex:'$\\langle a_2|e_1\\rangle = \\langle e_1|a_2\\rangle^*$. Im Komplexen ist das ein anderer Koeffizient, und der Rest behält einen Anteil entlang $e_1$.'}}
          ]},
        q:{q:R`Warum fällt der Reihenfolgefehler bei reellen Vektoren nicht auf?`,
          opts:['Weil reelle Vektoren immer senkrecht stehen, $\\langle a|b\\rangle = 0$.', 'Weil dort $\\langle a|b\\rangle = \\langle b|a\\rangle$ ist.', 'Weil Gram-Schmidt im Reellen ohne die Projektion $\\langle e|a\\rangle\\,e$ auskommt.'], a:1,
          ex:R`Für reelle Einträge ist $\langle b|a\rangle = \langle a|b\rangle^* = \langle a|b\rangle$; beide Koeffizienten sind gleich.`,
          fb:[R`Reelle Vektoren stehen keineswegs immer senkrecht, etwa $(1;\ 0)$ und $(1;\ 1)$.`,
            '',
            R`Auch im Reellen zieht Gram-Schmidt Projektionen ab, wie im Beispiel mit $(1;\ 0)$ und $(1;\ 1)$.`]}}
    ]},

    /* ===== Abschnitt 5: Cauchy-Schwarz, Beweis, Gleichheit, Überlapp als Wahrscheinlichkeit ===== */
    {id:'mv-t5', title:'Die Cauchy-Schwarz-Ungleichung', steps:[
      {id:'mv-t5a', title:'Der Überlapp ist nie größer als die Längen',
        num:{title:R`$a = (1;\ i)$, $b = (2;\ 1)$`, text:R`$\langle a|b\rangle = 2 - i$, also $|\langle a|b\rangle|^2 = 5$. Rechts: $\langle a|a\rangle\,\langle b|b\rangle = 2\cdot 5 = 10$. Es gilt $5 \le 10$.`},
        text:R`Im $\mathbb R^n$ gilt $a\cdot b = |a|\,|b|\cos\theta$, also $|a\cdot b| \le |a|\,|b|$. Im Komplexen gibt es keinen anschaulichen Winkel, aber die Ungleichung bleibt richtig. Die [[lex:cauchy-schwarz|Cauchy-Schwarz-Ungleichung]] lautet

$$|\langle a|b\rangle|^2 \le \langle a|a\rangle\,\langle b|b\rangle,$$

mit Gleichheit genau dann, wenn $a$ und $b$ linear abhängig sind. Wichtig ist der Betrag: $\langle a|b\rangle$ ist im Allgemeinen komplex, und komplexe Zahlen kann man nicht der Größe nach ordnen.`,
        q:{q:'Für welches Paar gilt in Cauchy-Schwarz das Gleichheitszeichen?',
          opts:['$a = (1;\\ 0)$ und $b = (0;\\ 1)$', '$a = (1;\\ i)$ und $b = (i;\\ -1)$', '$a = (1;\\ 0)$ und $b = \\tfrac{1}{\\sqrt2}(1;\\ 1)$'], a:1,
          ex:'$(i;\\ -1) = i\\,(1;\\ i)$: Die beiden sind linear abhängig, also gilt Gleichheit. Probe: $\\langle a|b\\rangle = 1\\cdot i + (-i)(-1) = 2i$, $|2i|^2 = 4 = 2\\cdot 2$.',
          fb:['Orthogonal ist der entgegengesetzte Extremfall: links $0$, rechts $1$.', '', 'Beide sind normiert, aber nicht parallel: $|\\langle a|b\\rangle|^2 = \\tfrac12 < 1$.']}},
      {id:'mv-t5b', title:'Beweis über eine Projektion',
        num:{title:'Im Beispiel', text:R`Mit $a = (1;\ i)$ und $b = (2;\ 1)$ ist $\mu = \frac{\langle b|a\rangle}{\langle b|b\rangle} = \frac{2 + i}{5}$. Der Rest $w = a - \mu b$ hat

$$\langle w|w\rangle = \langle a|a\rangle - \frac{|\langle b|a\rangle|^2}{\langle b|b\rangle} = 2 - \frac55 = 1 \ge 0.$$`},
        text:R`Für $b = 0$ ist nichts zu zeigen. Sonst ziehst du von $a$ seine Projektion auf $b$ ab: $w = a - \mu b$ mit $\mu = \langle b|a\rangle/\langle b|b\rangle$. Ein Normquadrat ist nie negativ, also $0 \le \langle w|w\rangle$. Die Herleitung rechnet $\langle w|w\rangle$ aus. Multipliziert mit $\langle b|b\rangle > 0$ ist das die Behauptung, denn $|\langle b|a\rangle| = |\langle a|b\rangle|$.

Der Beweis zeigt auch, was die Ungleichung bedeutet: Die Projektion eines Vektors ist nie länger als der Vektor selbst. Beim Ausmultiplizieren kommt $\mu$ aus dem linken Argument als $\mu^*$ heraus.`,
        derive:{title:'Herleitung: Beweis über eine Projektion', ctx:MVEK({params:{a_1:'complex', a_2:'complex', b_1:'complex', b_2:'complex'}, states:{a:'(a_1; a_2)', b:'(b_1; b_2)'}}),
          lines:[
            {l:'μ = ⟨b|a⟩/⟨b|b⟩', w:'Koeffizient der Projektion von a auf b', why:{q:'Warum steht $\\langle b|a\\rangle$ und nicht $\\langle a|b\\rangle$?', opts:['Weil $a$ auf $b$ projiziert wird; $b$ steht links.', 'Weil man beim Projizieren stets konjugieren muss.', 'Weil die Reihenfolge für $\\mu$ keine Rolle spielt.'], a:0, ex:'Wie bei Gram-Schmidt: $P_ba = \\frac{\\langle b|a\\rangle}{\\langle b|b\\rangle}b$. Mit der anderen Reihenfolge stünde der Rest nicht senkrecht auf $b$.'}},
            {l:'⟨a - μ b|a - μ b⟩ = ⟨a|a⟩ - μ ⟨a|b⟩ - μ^* ⟨b|a⟩ + |μ|^2 ⟨b|b⟩', w:'ausmultiplizieren; links antilinear', why:{q:'Warum steht beim dritten Term $\\mu^*$?', opts:['Weil dort $-\\mu b$ links steht und konjugiert wird.', 'Weil $\\mu$ hier eine reelle Zahl ist.', 'Weil man $\\mu$ und $\\mu^*$ frei tauschen darf.'], a:0, ex:'$\\langle -\\mu b|a\\rangle = -\\mu^*\\langle b|a\\rangle$. Im zweiten Term steht $-\\mu b$ rechts, dort bleibt $\\mu$.'}},
            {l:'= ⟨a|a⟩ - |⟨b|a⟩|^2/⟨b|b⟩', w:'μ einsetzen', why:{q:'Warum bleibt nur ein Bruch übrig?', opts:['Weil die drei $\\mu$-Terme gleich groß sind: $-1 - 1 + 1$.', 'Weil sich alle drei Terme mit $\\mu$ aufheben.', 'Weil $\\langle a|b\\rangle$ und $\\langle b|a\\rangle$ gleich sind.'], a:0, ex:'Jeder der drei Terme ist genau $|\\langle b|a\\rangle|^2/\\langle b|b\\rangle$: $\\mu\\langle a|b\\rangle = \\langle b|a\\rangle\\langle a|b\\rangle/\\langle b|b\\rangle = |\\langle a|b\\rangle|^2/\\langle b|b\\rangle$, ebenso $\\mu^*\\langle b|a\\rangle$ und $|\\mu|^2\\langle b|b\\rangle$. Weil $\\langle w|w\\rangle \\ge 0$ ist, folgt Cauchy-Schwarz.'}}
          ]},
        q:{q:R`Was bedeutet Cauchy-Schwarz geometrisch?`,
          opts:[R`Zwei Vektoren stehen nie genau senkrecht.`, R`Die Summe zweier Vektoren ist länger als jeder einzelne.`, R`Die Projektion eines Vektors ist nie länger als er selbst.`], a:2,
          ex:R`$\langle w|w\rangle \ge 0$ heißt $\langle a|a\rangle \ge |\langle b|a\rangle|^2/\langle b|b\rangle$, und rechts steht das Normquadrat der Projektion von $a$ auf $b$.`,
          fb:[R`Senkrecht ist sehr wohl möglich; dann ist die linke Seite null.`,
            R`Das stimmt im Allgemeinen nicht: $a + (-a) = 0$ ist kürzer. Die Ungleichung handelt von Projektionen.`,
            '']}},
      {id:'mv-t5c', title:'Gleichheit bei Abhängigkeit, nicht bei Orthogonalität',
        num:{title:R`$b = i\,a$`, text:R`Mit $a = (1;\ i)$ und $b = i\,a = (i;\ -1)$ ist $\langle a|b\rangle = 1\cdot i + (-i)(-1) = 2i$, also $|\langle a|b\rangle|^2 = 4 = 2\cdot2$: Gleichheit. Für die orthogonalen $e_1, e_2$ aus Abschnitt 3 ist die linke Seite dagegen $0$.`},
        text:R`Gleichheit gilt genau dann, wenn der Rest $w$ null ist, also $a = \mu b$. Das schließt komplexe Vielfache ein: $(i;\ -1)$ und $(1;\ i)$ sehen verschieden aus, sind aber abhängig. Orthogonale Vektoren sind der entgegengesetzte Extremfall: Dort ist der Überlapp null.

Aus Cauchy-Schwarz folgt außerdem die **Dreiecksungleichung** $\|a + b\| \le \|a\| + \|b\|$. **Ausblick (Thema 6):** Dort folgt aus Cauchy-Schwarz in wenigen Zeilen die [[lex:robertson|Robertson-Unschärferelation]].`,
        q:{q:R`Für $a = (1;\ 2)$ und $b = (2i;\ 4i)$: Was ist $|\langle a|b\rangle|^2$?`,
          opts:[R`$100$`, R`$10$`, R`$0$`], a:0,
          ex:R`$\langle a|b\rangle = 2i + 8i = 10i$, also $100 = 5\cdot 20 = \langle a|a\rangle\langle b|b\rangle$: Gleichheit, denn $b = 2i\,a$.`,
          fb:['',
            R`$10$ ist der Betrag $|\langle a|b\rangle|$; gefragt ist sein Quadrat.`,
            R`Die Einträge von $b$ sind imaginär, aber $b$ ist ein Vielfaches von $a$, nicht senkrecht dazu.`]}},
      {id:'mv-t5d', title:'Überlapp als Wahrscheinlichkeit',
        num:{title:R`$x = \tfrac{1}{\sqrt2}(1;\ 1)$, $y = \tfrac{1}{\sqrt2}(1;\ i)$`, text:R`Beide sind normiert. Ihr Überlapp ist

$$|\langle x|y\rangle|^2 = \left|\tfrac12(1 + i)\right|^2 = \frac{|1 + i|^2}{4} = \frac12.$$

Cauchy-Schwarz verlangt $\le 1\cdot 1 = 1$; das ist erfüllt.`},
        text:R`Für normierte Vektoren wird aus Cauchy-Schwarz

$$0 \le |\langle a|b\rangle|^2 \le 1.$$

Den Wert 1 erreichst du genau dann, wenn sich die Vektoren nur um einen Phasenfaktor unterscheiden, den Wert 0, wenn sie orthogonal sind. **Ausblick (Thema 6 und 10):** In der Quantenmechanik ist $|\langle a|b\rangle|^2$ die Wahrscheinlichkeit, ein System im Zustand $b$ bei einer passenden Messung im Zustand $a$ zu finden. Cauchy-Schwarz garantiert, dass das eine sinnvolle Wahrscheinlichkeit ist. Die Tafel übersetzt den Überlapp aus dem Beispiel bis in die Messung.`,
        reps:{obj:R`Der Überlapp von $x = \tfrac{1}{\sqrt2}(1;\ 1)$ und $y = \tfrac{1}{\sqrt2}(1;\ i)$`,
          rows:[
            {k:'worte', text:R`Wie sehr gleicht $y$ dem Vektor $x$? $0$ heißt senkrecht, $1$ heißt gleich bis auf eine Phase.`},
            {k:'dirac', tex:R`|\langle x|y\rangle|^2`},
            {k:'matrix', tex:R`\left|\tfrac12(1,\ 1)\begin{pmatrix}1\\ i\end{pmatrix}\right|^2 = \frac{|1 + i|^2}{4} = \frac12`},
            {k:'mathe', text:'Cauchy-Schwarz für normierte Vektoren', tex:R`0 \le |\langle x|y\rangle|^2 \le \langle x|x\rangle\langle y|y\rangle = 1`},
            {k:'physik', text:R`**Ausblick (Thema 10):** $x$ und $y$ sind die Spinzustände „in $+x$-Richtung“ und „in $+y$-Richtung“. Wer den einen präpariert und in der anderen Richtung misst, findet ihn mit der Wahrscheinlichkeit $\tfrac12$. Für Licht ist das ein Polarisationsfilter: Das Gesetz von Malus, $\cos^2\theta$, ist derselbe Überlapp.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Wie sehr gleicht $y$ dem $x$“ als Betragsquadrat des Skalarprodukts schreiben; den Zustand, nach dem gefragt wird, in den Bra.`},
            {from:'dirac', to:'matrix', rule:R`Bra als konjugierte Zeile, Ket als Spalte, Zeile mal Spalte – dann den Betrag quadrieren.`},
            {from:'matrix', to:'mathe', rule:R`Das Ergebnis mit $\langle x|x\rangle\langle y|y\rangle$ vergleichen; für normierte Vektoren muss es zwischen 0 und 1 liegen.`},
            {from:'mathe', to:'physik', rule:R`Eine Zahl zwischen 0 und 1 als Wahrscheinlichkeit lesen. Die Amplitude $\langle x|y\rangle$ selbst ist keine Wahrscheinlichkeit, erst ihr Betragsquadrat.`}
          ]},
        q:{q:R`Zwei normierte Zustände: $a = (1;\ 0)$ und $b = \tfrac15(3;\ 4i)$. Mit welcher Wahrscheinlichkeit findet eine passende Messung das System aus $b$ im Zustand $a$?`, tr:{from:'matrix', to:'physik'},
          opts:[R`$0{,}6$`, R`$0{,}36$`, R`$0{,}64$`], a:1,
          ex:R`$\langle a|b\rangle = \tfrac35$, Betragsquadrat $\tfrac{9}{25} = 0{,}36$.`,
          fb:[R`$0{,}6$ ist die Amplitude $\langle a|b\rangle$. Die Wahrscheinlichkeit ist ihr Betragsquadrat.`,
            '',
            R`$0{,}64 = |\tfrac{4i}{5}|^2$ gehört zur zweiten Komponente, also zum Zustand $(0;\ 1)$.`]}},
      {id:'mv-t5e', title:'Typischer Fehler: die Ungleichung falsch hinschreiben',
        num:{title:R`$\langle a|b\rangle = 2 - i$`, text:R`„$2 - i \le \sqrt{10}$“ hat keinen Sinn: Komplexe Zahlen lassen sich nicht der Größe nach ordnen. Richtig ist $|2 - i| = \sqrt5 \le \sqrt{10} = \|a\|\,\|b\|$, oder quadriert $5 \le 10$.`},
        text:R`Bei komplexen Vektoren muss in Cauchy-Schwarz der Betrag stehen. Ohne ihn ist die Ungleichung kein sinnvoller Satz, denn „kleiner als“ ist für komplexe Zahlen nicht definiert. Ein zweiter Fehler: links das Betragsquadrat, rechts aber nur das Produkt der Normen hinschreiben. Entweder beide Seiten quadriert, $|\langle a|b\rangle|^2 \le \langle a|a\rangle\langle b|b\rangle$, oder beide nicht, $|\langle a|b\rangle| \le \|a\|\,\|b\|$.

Ein dritter Fehler verwechselt Gleichheit mit Orthogonalität. Gleichheit heißt „parallel bis auf einen komplexen Faktor“, Orthogonalität heißt „Überlapp null“.`,
        q:{q:'Es ist $\\langle a|b\\rangle = 2i$ und $\\|a\\| = \\|b\\| = 2$. Welche Prüfung von Cauchy-Schwarz ist richtig aufgeschrieben?',
          opts:['$2i \\le 2\\cdot 2 = 4$', '$|2i|^2 = 4 \\le 2\\cdot 2$, also Gleichheit', '$|2i| = 2 \\le 2\\cdot 2 = 4$'], a:2,
          ex:'Links der Betrag $|2i| = 2$, rechts das Produkt der Normen $4$: $2 \\le 4$. Quadriert auf beiden Seiten: $4 \\le 16$.',
          fb:['Ohne Betrag steht links die komplexe Zahl $2i$; „kleiner als“ ist für sie nicht definiert.', 'Links quadriert, rechts nicht. Beide Seiten quadriert heißt $|2i|^2 = 4 \\le \\|a\\|^2\\|b\\|^2 = 16$; Gleichheit liegt nicht vor.', '']}}
    ]}
  ],
  example:{
    title:'Komponenten in einer Orthonormalbasis von $\\mathbb C^2$',
    text:'Die Vektoren $e_1 = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ i\\end{pmatrix}$ und $e_2 = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ -i\\end{pmatrix}$ bilden eine Basis von $\\mathbb C^2$. Entwickle $v = \\begin{pmatrix}1\\\\ 2i\\end{pmatrix}$ nach dieser Basis. In der Eingabe sind Spaltenvektoren `(a; b)` und Zeilen `(a, b)`.',
    ctx:MVEK({states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'(1; 2i)'}}),
    lines:[
      {l:'⟨e_1|e_2⟩ = 1/2 (1, -i)(1; -i)', why:{q:'Warum steht in der Zeile $(1, -i)$ und nicht $(1, i)$?', opts:['Die Zeile zum Bra $\\langle e_1|$ ist konjugiert.', 'Das Minus kommt aus dem Vektor $e_2$.', 'Transponieren allein dreht das Vorzeichen von $i$.'], a:0, ex:'$\\langle a|b\\rangle = \\sum_i a_i^*b_i$: Der linke Vektor wird konjugiert. Transponieren macht nur aus der Spalte eine Zeile.'}},
      {l:'= (1 + i^2)/2', why:{q:'Woher kommt $i^2$?', opts:['$(-i)\\cdot(-i) = i^2$', '$i\\cdot i$ aus $e_1$ und $e_2$', '$(-i)\\cdot i$ aus Bra und Ket'], a:0, ex:'Zweite Komponenten: $(-i)$ aus dem Bra mal $(-i)$ aus $e_2$. $(-i)\\cdot i$ wäre $+1$.'}},
      {l:'= 0', why:{q:'Was folgt daraus?', opts:['$e_1$ und $e_2$ sind orthogonal.', '$e_1$ und $e_2$ sind gleich.', '$e_1$ ist nicht normiert.'], a:0, ex:'Zusammen mit $\\langle e_i|e_i\\rangle = (1 + 1)/2 = 1$ ist das eine Orthonormalbasis.'}},
      {l:'⟨e_1|v⟩ = 1/sqrt(2) (1, -i)(1; 2i)', w:'Komponente c₁ = ⟨e₁|v⟩', why:{q:'Warum ist die Komponente einfach $\\langle e_1|v\\rangle$?', opts:['$\\langle e_1|e_1\\rangle = 1$ und $\\langle e_1|e_2\\rangle = 0$ filtern $c_1$ heraus.', 'So ist die Komponente in jeder Basis definiert.', 'Weil $v$ normiert ist, ist $\\langle e_1|v\\rangle$ die Komponente.'], a:0, ex:'Aus $v = c_1e_1 + c_2e_2$ folgt $\\langle e_1|v\\rangle = c_1\\langle e_1|e_1\\rangle + c_2\\langle e_1|e_2\\rangle = c_1$. Das klappt nur in einer **Orthonormal**basis; sonst müsste man ein Gleichungssystem lösen. $v$ ist hier gar nicht normiert.'}},
      {l:'= 3/sqrt(2)', why:{q:'Wie kommt man auf $3$?', opts:['$1 + (-i)(2i) = 1 + 2$', '$1 + i\\cdot 2i = 1 - 2$', '$1 + (-i)(2i) = 1 - 2$'], a:0, ex:'$(-i)(2i) = -2i^2 = +2$.'}},
      {l:'⟨e_2|v⟩ = 1/sqrt(2) (1, i)(1; 2i)', why:{q:'Welche Zeile gehört zu $\\langle e_2|$?', opts:['$(1, i)/\\sqrt2$', '$(1, -i)/\\sqrt2$', '$(1; i)/\\sqrt2$ als Spalte'], a:0, ex:'Konjugieren macht aus $-i$ ein $+i$; das Bra ist eine Zeile.'}},
      {l:'= -1/sqrt(2)', why:{q:'Wie kommt man auf $-1$?', opts:['$1 + i\\cdot 2i = 1 - 2$', '$1 + (-i)\\cdot 2i = 1 + 2$', '$1\\cdot 2i + i\\cdot 1 = 3i$'], a:0, ex:'$i\\cdot 2i = 2i^2 = -2$.'}},
      {l:'|⟨e_1|v⟩|^2 + |⟨e_2|v⟩|^2 = 9/2 + 1/2', why:{q:'Wozu diese Summe?', opts:['Kontrolle mit Parseval: $\\sum_i|c_i|^2 = \\langle v|v\\rangle$', 'Sie liefert die Basisvektoren zurück.', 'Sie muss für jeden Vektor 1 ergeben.'], a:0, ex:'In einer ONB ist das Normquadrat die Summe der Komponentenquadrate – wie Pythagoras. 1 ergibt sie nur für normierte Vektoren.'}},
      {l:'= 5', why:{q:'Stimmt das mit $\\langle v|v\\rangle$ überein?', opts:['Ja: $|1|^2 + |2i|^2 = 1 + 4 = 5$.', 'Nein, $\\langle v|v\\rangle = 1 + (2i)^2 = -3$.', 'Nur wenn $v$ normiert ist.'], a:0, ex:'Ohne Konjugation käme $-3$ heraus – eine negative „Länge“, ein sicheres Zeichen für einen Fehler.'}}
    ],
    faded:{id:'mv-fade', title:'Jetzt du: Komponenten in einer reellen ONB',
      text:'$f_1 = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ 1\\end{pmatrix}$, $f_2 = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\ -1\\end{pmatrix}$ und $v = \\begin{pmatrix}3\\\\ i\\end{pmatrix}$. Die erste Komponente ist schon berechnet.',
      ctx:MVEK({states:{f_1:'(1; 1)/sqrt(2)', f_2:'(1; -1)/sqrt(2)', v:'(3; i)'}}),
      given:['⟨f_1|v⟩ = 1/sqrt(2) (1, 1)(3; i)', '= (3 + i)/sqrt(2)'],
      goals:[{id:'a', prompt:'Bestimme $c_2 = \\langle f_2|v\\rangle$.', type:'value', target:'(3 - i)/sqrt(2)', points:2, hints:['In einer ONB ist jede Komponente ein Skalarprodukt: $c_2 = \\langle f_2|v\\rangle$.', 'Die Zeile zu $\\langle f_2|$ ist $(1, -1)/\\sqrt2$ – hier gibt es nichts zu konjugieren.', 'Rechne $1\\cdot 3 + (-1)\\cdot i$. Kontrolle: $|c_1|^2 + |c_2|^2 = 5 + 5 = 10 = |3|^2 + |i|^2$.'],
        model:['⟨f_1|v⟩ = 1/sqrt(2) (1, 1)(3; i)', '= (3 + i)/sqrt(2)', '⟨f_2|v⟩ = 1/sqrt(2) (1, -1)(3; i)', {l:'= (3 - i)/sqrt(2)', gap:'= (▢)/sqrt(2)'}],
        mistakes:[{expr:'(3 + i)/sqrt(2)', msg:'Das ist $c_1$. Für $c_2$ steht in der Zeile $(1, -1)$.'}, {expr:'(-3 + i)/sqrt(2)', msg:'Vorzeichen: $1\\cdot 3 + (-1)\\cdot i = 3 - i$.'}]}]}
  },
  puzzle:{
    title:'Drei Richtungen mit gleichem Überlapp',
    text:'Im $\\mathbb R^2$ haben zwei Einheitsvektoren mit $45°$ Zwischenwinkel den Überlapp $|\\langle a|b\\rangle|^2 = \\cos^2 45° = 1/2$. Drei Einheitsvektoren, die **paarweise** den Überlapp $1/2$ haben, gibt es im $\\mathbb R^2$ nicht: Ein dritter Vektor müsste zu beiden anderen $45°$ haben. Die beiden Richtungen mit $45°$ zum ersten Vektor bilden aber mit dem zweiten $0°$ oder $90°$.\n\nGibt es solche drei normierten Vektoren in $\\mathbb C^2$?',
    q:{q:'Deine Vermutung:', opts:['Nein, $\\mathbb C^2$ hat wie $\\mathbb R^2$ nur zwei Dimensionen.', 'Ja, in $\\mathbb C^2$ gibt es drei solche Vektoren.', 'Ja, in $\\mathbb C^2$ sogar beliebig viele.', 'Nein, in $\\mathbb C^2$ ist der Überlapp stets $0$ oder $1$.'], a:1, ex:'Zum Beispiel $(1; 0)$, $(1; 1)/\\sqrt2$ und $(1; i)/\\sqrt2$.'},
    reveal:'Ja. Nimm $e = (1; 0)$, $x = (1; 1)/\\sqrt2$ und $y = (1; i)/\\sqrt2$. Dann ist $|\\langle e|x\\rangle|^2 = |\\langle e|y\\rangle|^2 = 1/2$ und\n\n$$|\\langle x|y\\rangle|^2 = \\left|\\tfrac12(1\\cdot 1 + 1\\cdot i)\\right|^2 = \\frac{|1 + i|^2}{4} = \\frac12.$$\n\nDer komplexe Eintrag öffnet eine Richtung, die es im $\\mathbb R^2$ nicht gibt. Ein normierter Vektor in $\\mathbb C^2$ hat neben dem Mischungsverhältnis der Komponenten noch die **relative Phase** zwischen ihnen als zweiten Freiheitsgrad.\n\nBeliebig viele solche Vektoren gibt es aber nicht, höchstens drei. Das zeigt man mit der Bloch-Kugel (Thema 10): Dort entspricht dem Überlapp $1/2$ ein rechter Winkel, und im Raum stehen höchstens drei Richtungen paarweise senkrecht.\n\nAusblick: $e$, $x$ und $y$ sind die Spinzustände $|{+z}\\rangle$, $|{+x}\\rangle$ und $|{+y}\\rangle$. Wer $|{+z}\\rangle$ präpariert und den Spin in $x$- oder in $y$-Richtung misst, erhält jedes der beiden Ergebnisse mit der Wahrscheinlichkeit $1/2$.'
  },
  clarify:{
    core:'Ein **Vektorraum** über $\\mathbb C$ ist eine Menge, in der man Vektoren addieren und mit komplexen Zahlen multiplizieren kann. Beispiele: $\\mathbb C^n$, Polynome, quadratintegrable Funktionen (M5). Vektoren $v_1, \\dots, v_k$ sind **linear unabhängig**, wenn $\\sum c_iv_i = 0$ nur für alle $c_i = 0$ gilt; $n$ unabhängige Vektoren in $\\mathbb C^n$ bilden eine **Basis**.\n\nDas **Skalarprodukt** in $\\mathbb C^n$ ist $\\langle a|b\\rangle = \\sum_i a_i^*b_i$. Es ist linear im rechten, antilinear im linken Argument, $\\langle b|a\\rangle = \\langle a|b\\rangle^*$, und $\\|a\\| = \\sqrt{\\langle a|a\\rangle}$ ist die Norm.\n\nIn einer **Orthonormalbasis** ($\\langle e_i|e_j\\rangle = \\delta_{ij}$) gilt\n\n$$|v\\rangle = \\sum_i c_i|e_i\\rangle,\\qquad c_i = \\langle e_i|v\\rangle,\\qquad \\langle v|v\\rangle = \\sum_i|c_i|^2\\ \\text{(Parseval)},\\qquad \\sum_i|e_i\\rangle\\langle e_i| = \\mathbb 1.$$\n\nDie **Projektion** von $v$ auf einen normierten Vektor $e$ ist $\\langle e|v\\rangle\\,|e\\rangle$; für nicht normiertes $a$ ist es $\\frac{\\langle a|v\\rangle}{\\langle a|a\\rangle}|a\\rangle$. **Gram-Schmidt:** Von jedem neuen Vektor die Projektionen auf die schon fertigen abziehen, dann normieren. **Cauchy-Schwarz:** $|\\langle a|b\\rangle|^2 \\le \\langle a|a\\rangle\\langle b|b\\rangle$, mit Gleichheit genau für linear abhängige Vektoren.',
    keys:[
      'Bra = Zeile mit konjugierten Einträgen: Zu $|a\\rangle = (1; i)$ gehört $\\langle a| = (1, -i)$.',
      'Komponenten in einer ONB nie über ein Gleichungssystem, sondern direkt: $c_i = \\langle e_i|v\\rangle$.',
      'Reihenfolge beachten: $\\langle a|b\\rangle = \\langle b|a\\rangle^*$ und $\\langle\\lambda a|b\\rangle = \\lambda^*\\langle a|b\\rangle$.',
      'Parseval als Kontrolle: $\\sum_i|c_i|^2$ muss $\\langle v|v\\rangle$ ergeben.',
      'Bei Gram-Schmidt durch $\\langle a|a\\rangle$ teilen, solange $a$ noch nicht normiert ist; der fertige Basisvektor steht im Skalarprodukt links.',
      'Orthogonal im Zustandsraum heißt $\\langle a|b\\rangle = 0$ – nicht „senkrecht im Raum“.'
    ],
    errors:[
      'Skalarprodukt ohne Konjugation: $(1, i)\\cdot(1, i) = 0$, obwohl der Vektor nicht null ist.',
      '$\\langle\\lambda a|b\\rangle = \\lambda\\langle a|b\\rangle$ statt $\\lambda^*\\langle a|b\\rangle$.',
      'Komponenten in einer nicht orthonormalen Basis mit $\\langle b_i|v\\rangle$ ausrechnen.',
      'Bei der Projektion auf einen nicht normierten Vektor den Nenner $\\langle a|a\\rangle$ vergessen.',
      'Gleichheit in Cauchy-Schwarz mit Orthogonalität verwechseln.'
    ],
    more:[{title:'Warum braucht die Quantenmechanik das?', text:'Zustände sind Vektoren $|\\psi\\rangle$ in einem komplexen Vektorraum. Die Wahrscheinlichkeit, bei einer Messung den Zustand $|e_i\\rangle$ zu finden, ist $|\\langle e_i|\\psi\\rangle|^2 = |c_i|^2$ (Thema 6 und 10). Parseval heißt dann: Die Wahrscheinlichkeiten summieren sich zu $\\langle\\psi|\\psi\\rangle = 1$. Für Funktionen wird aus der Summe ein Integral (M5).'}],
    checks:[
      {q:'$\\langle a|b\\rangle$ für $a = (i; 1)$ und $b = (1; i)$ ist …', opts:['$0$', '$2i$', '$-2i$'], a:0, ex:'$(-i)\\cdot 1 + 1\\cdot i = 0$. Ohne Konjugation käme $i + i = 2i$ heraus.'},
      {q:'Wenn $\\langle a|b\\rangle = 2 + i$ ist, dann ist $\\langle b|a\\rangle$ …', opts:['$2 - i$', '$2 + i$', '$-2 - i$'], a:0, ex:'Vertauschen konjugiert: $\\langle b|a\\rangle = \\langle a|b\\rangle^*$.'}
    ]
  },
  lab:{type:'vectors', title:'Ein Vektor, zwei Orthonormalbasen',
    map:[
      {sym:R`v_1`, ctl:'Komponente v₁', says:R`Erster Eintrag von $v$ in der festen Standardbasis. Zusammen mit „Komponente v₂“ legt er den Pfeil $v$ fest.`},
      {sym:R`v_2`, ctl:'Komponente v₂', says:R`Zweiter Eintrag von $v$ in der Standardbasis. Die Anzeige $|v|^2 = v_1^2 + v_2^2$ hängt nur von $v_1$ und $v_2$ ab, nicht vom Drehwinkel.`},
      {sym:R`\varphi`, ctl:'Drehwinkel φ der Basis (Grad)', says:R`Dreht die Orthonormalbasis $e'_1 = (\cos\varphi;\ \sin\varphi)$, $e'_2 = (-\sin\varphi;\ \cos\varphi)$. Der Pfeil $v$ bleibt stehen; es ändern sich nur seine Komponenten $c_i = \langle e'_i|v\rangle$ in der Anzeige.`},
      {sym:R`e'_1,\ e'_2`, ctl:"e'₁", says:R`Die beiden dünnen Pfeile der Länge 1, senkrecht zueinander: die gedrehte Basis. Die gestrichelten Lote von der Spitze von $v$ treffen ihre Achsen in den Punkten $c_1e'_1$ und $c_2e'_2$, den breiten Pfeilen. Zusammen ergeben sie $v = c_1e'_1 + c_2e'_2$, und $c_1^2 + c_2^2 = |v|^2$ (Parseval).`}
    ],
    sketch:{id:'mv-lab-s', kind:'arrows', title:'Vorhersage: Komponenten in einer gedrehten Basis',
      text:'Gegeben sind $v = (1{,}6;\\ 0{,}6)$ und die um $\\varphi = 60°$ gedrehte Orthonormalbasis $e\'_1 = (\\cos 60°, \\sin 60°)$, $e\'_2 = (-\\sin 60°, \\cos 60°)$ (graue Pfeile). Zeichne die beiden Anteile $c_1e\'_1$ und $c_2e\'_2$ mit $c_i = \\langle e\'_i|v\\rangle$, je als Pfeil vom Ursprung aus. Stell danach im Labor $v_1 = 1{,}6$, $v_2 = 0{,}6$ und $\\varphi = 60°$ ein und vergleiche mit den breiten farbigen Pfeilen.',
      plot:{x:[-2.5, 2.5], y:[-2, 2], abs:true, xlab:'1', ylab:'2', unit:true, grid:0.5},
      // c_1 = 0,8 + 0,520 = 1,320, c_2 = −1,386 + 0,300 = −1,086; c_1e'_1 = (0,660; 1,143), c_2e'_2 = (0,940; −0,543)
      given:[{from:[0, 0], to:[1.6, 0.6], lab:'v'}, {from:[0, 0], to:[Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)], lab:"e'_1"}, {from:[0, 0], to:[-Math.sin(Math.PI / 3), Math.cos(Math.PI / 3)], lab:"e'_2"}],
      want:[
        {from:[0, 0], to:[(1.6 * Math.cos(Math.PI / 3) + 0.6 * Math.sin(Math.PI / 3)) * Math.cos(Math.PI / 3), (1.6 * Math.cos(Math.PI / 3) + 0.6 * Math.sin(Math.PI / 3)) * Math.sin(Math.PI / 3)], lab:"c_1e'_1", msg:'Berechne $c_1 = \\langle e\'_1|v\\rangle$. In welche Richtung zeigt $c_1e\'_1$, und wie lang ist der Pfeil? (Abschnitt „Orthonormalbasen“)'},
        {from:[0, 0], to:[(-1.6 * Math.sin(Math.PI / 3) + 0.6 * Math.cos(Math.PI / 3)) * -Math.sin(Math.PI / 3), (-1.6 * Math.sin(Math.PI / 3) + 0.6 * Math.cos(Math.PI / 3)) * Math.cos(Math.PI / 3)], lab:"c_2e'_2", msg:'Berechne $c_2 = \\langle e\'_2|v\\rangle$. Welches Vorzeichen hat es, und was bedeutet das für die Richtung von $c_2e\'_2$?'}],
      reveal:'$c_1 = 1{,}6\\cdot 0{,}5 + 0{,}6\\cdot 0{,}866 \\approx 1{,}32$ und $c_2 = -1{,}6\\cdot 0{,}866 + 0{,}6\\cdot 0{,}5 \\approx -1{,}09$. Weil $c_2$ negativ ist, zeigt $c_2e\'_2$ **gegen** $e\'_2$. Die beiden Anteile stehen senkrecht und ergeben zusammen wieder $v$. Kontrolle mit Parseval: $c_1^2 + c_2^2 \\approx 2{,}92 = 1{,}6^2 + 0{,}6^2$. Im Labor siehst du dieselben Anteile als breite Pfeile und die gestrichelten Lote von der Spitze von $v$.',
      hints:['Rechne beide Skalarprodukte mit den Zahlen aus und trage dann $c_i$-mal den Basisvektor ab.', 'In einer Orthonormalbasis ist $c_i = \\langle e\'_i|v\\rangle$, und $v = c_1e\'_1 + c_2e\'_2$. Ein negatives $c_i$ dreht die Richtung um.'],
      wrong:[
        {arrows:[{from:[0, 0], to:[0.660, 1.143]}, {from:[0, 0], to:[-0.940, 0.543]}], fails:[1], why:'Vorzeichen von c₂ übersehen: Anteil in Richtung +e′₂'},
        {arrows:[{from:[0, 0], to:[1.6, 0]}, {from:[0, 0], to:[0, 0.6]}], fails:[0, 1], why:'Komponenten in der alten Standardbasis gezeichnet'}
      ]},
    text:'Den Vektor $v$ stellst du mit den Reglern $v_1$ und $v_2$ ein. Mit dem Winkel $\\varphi$ drehst du die Orthonormalbasis $e\'_1 = (\\cos\\varphi, \\sin\\varphi)$, $e\'_2 = (-\\sin\\varphi, \\cos\\varphi)$. Gezeichnet sind $v$, die gedrehte Basis und die Projektionen von $v$ auf die Basisvektoren. Die Anzeige zeigt die Komponenten $c_i = \\langle e\'_i|v\\rangle$ und $c_1^2 + c_2^2$.',
    predict:{q:'Bevor du die Regler bewegst: Du drehst nur die Basis, $v$ bleibt fest. Was ändert sich?', opts:['nur $c_1$ und $c_2$; $c_1^2 + c_2^2$ bleibt gleich', 'auch der Pfeil $v$, er dreht sich mit', 'nichts, weil $v$ fest eingestellt ist'], a:0, ex:'Der Vektor ist derselbe, nur seine Darstellung ändert sich. Parseval: In jeder ONB ist $c_1^2 + c_2^2 = |v|^2$.'},
    questions:[
      {q:'Stelle $v = (1, 1)$ ein und drehe die Basis auf $\\varphi = 45°$. Welche Komponenten zeigt die Anzeige?', opts:['$c_1 = \\sqrt2 \\approx 1{,}41$, $c_2 = 0$', '$c_1 = c_2 = 1$', '$c_1 = 1$, $c_2 = 0$'], a:0, ex:'$e\'_1 = (1, 1)/\\sqrt2$ zeigt genau in Richtung $v$: $c_1 = 2/\\sqrt2 = \\sqrt2$, und $v$ hat keinen Anteil entlang $e\'_2$.'},
      {q:'Drehe die Basis bei festem $v$. Was passiert mit $c_1^2 + c_2^2$?', opts:['Es bleibt gleich $|v|^2$.', 'Es ist bei $\\varphi = 0$ am größten.', 'Es schwankt zwischen $0$ und $|v|^2$.'], a:0, ex:'Parseval: In jeder Orthonormalbasis ist $\\sum c_i^2 = |v|^2$. Nur die Aufteilung auf die Komponenten ändert sich.'}
    ],
    noPic:{q:'Ohne Bild: In der Basis $e\'_1 = (0, 1)$, $e\'_2 = (-1, 0)$ (also $\\varphi = 90°$) hat $v = (2, 3)$ die Komponenten …', opts:['$c_1 = 3$, $c_2 = -2$', '$c_1 = 2$, $c_2 = 3$', '$c_1 = -3$, $c_2 = 2$'], a:0, ex:'$c_1 = (0, 1)\\cdot(2, 3) = 3$, $c_2 = (-1, 0)\\cdot(2, 3) = -2$. Kontrolle: $9 + 4 = 13 = 2^2 + 3^2$.'}},
  compare:{
    text:'Gesucht sind die Komponenten von $v = (3; 1)$ in der Orthonormalbasis $f_1 = (1; 1)/\\sqrt2$, $f_2 = (1; -1)/\\sqrt2$, also $v = c_1f_1 + c_2f_2$. Zwei richtige Wege:',
    ctx:MVEK({states:{f_1:'(1; 1)/sqrt(2)', f_2:'(1; -1)/sqrt(2)', v:'(3; 1)'}, unknowns:{c_1:{ref:'2 sqrt(2)'}, c_2:{ref:'sqrt(2)'}}}),
    A:{name:'Skalarprodukte', model:['c_1 = ⟨f_1|v⟩', '= 1/sqrt(2) (1, 1)(3; 1)', '= 2 sqrt(2)', 'c_2 = ⟨f_2|v⟩', '= 1/sqrt(2) (1, -1)(3; 1)', '= sqrt(2)']},
    B:{name:'Gleichungssystem', text:'Komponentenweise aufschreiben und lösen.', model:['c_1 |f_1⟩ + c_2 |f_2⟩ = |v⟩', '(c_1 + c_2)/sqrt(2) = 3', '(c_1 - c_2)/sqrt(2) = 1', 'c_1 = 2 sqrt(2)', 'c_2 = sqrt(2)']},
    questions:[
      {q:'Welcher Weg bleibt in $\\mathbb C^{100}$ praktikabel?', opts:['Weg A: Jede Komponente ist ein einzelnes Skalarprodukt.', 'Weg B: ein Gleichungssystem mit 100 Unbekannten', 'Beide sind gleich aufwendig.'], a:0, ex:'In einer ONB entkoppeln die Gleichungen: Jedes $c_i$ hängt nur von $e_i$ und $v$ ab.'},
      {q:'Wann funktioniert nur Weg B?', opts:['wenn die Basis nicht orthonormal ist', 'wenn $v$ komplexe Einträge hat', 'nie, Weg A geht immer'], a:0, ex:'Für eine schiefe Basis ist $\\langle b_i|v\\rangle$ nicht die Komponente (siehe „Fehler finden“). Komplexe Einträge sind für Weg A kein Problem, wenn man konjugiert.'}
    ]
  },
  practice:[
    {id:'mv-p1', title:'Skalarprodukt und Norm in $\\mathbb C^3$',
      text:'$a = \\begin{pmatrix}1\\\\ i\\\\ 1 - i\\end{pmatrix}$, $b = \\begin{pmatrix}2\\\\ -i\\\\ 1\\end{pmatrix}$. In der Eingabe: `⟨a|b⟩` oder ausgeschrieben `(1, -i, 1 + i)(2; -i; 1)`; die Norm als `sqrt(⟨a|a⟩)`.',
      ctx:MVEK({states:{a:'(1; i; 1 - i)', b:'(2; -i; 1)', u:'N (2; -i; 1)'}, unknowns:{N:{ref:'1/sqrt(6)', alt:['-1/sqrt(6)']}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle a|b\\rangle$.', type:'value', target:'2 + i', points:2, ph:'⟨a|b⟩ = (1, -i, 1 + i)(2; -i; 1)',
          hints:['Skalarprodukt in $\\mathbb C^n$: Welcher der beiden Vektoren wird konjugiert?', '$\\langle a|b\\rangle = \\sum a_i^*b_i$. Die Zeile zu $\\langle a|$ ist $(1, -i, 1 + i)$.', '$(-i)(-i) = i^2 = -1$ und $(1 + i)\\cdot 1 = 1 + i$. Addiere alle drei Produkte.'],
          model:['⟨a|b⟩ = (1, -i, 1 + i)(2; -i; 1)', '= 2 + i^2 + 1 + i', '= 2 + i'],
          mistakes:[{expr:'4 - i', msg:'Ohne Konjugation gerechnet. Die Zeile zu $\\langle a|$ hat die Einträge $a_i^*$.'}, {expr:'2 - i', msg:'Das ist $\\langle b|a\\rangle = \\langle a|b\\rangle^*$. Konjugiert wird der **linke** Vektor.'}]},
        {id:'b', prompt:'b) Berechne die Norm $\\|a\\|$.', type:'value', target:'2', points:2, ph:'⟨a|a⟩ = 1 + 1 + |1 - i|^2',
          hints:['Die Norm ist die Wurzel aus dem Skalarprodukt des Vektors mit sich selbst.', '$\\langle a|a\\rangle = \\sum|a_i|^2$: Jeder Summand ist ein Betragsquadrat.', '$|1|^2 + |i|^2 + |1 - i|^2 = 1 + 1 + 2$. Zieh dann die Wurzel.'],
          model:['⟨a|a⟩ = 1 + 1 + |1 - i|^2', '= 4', 'sqrt(⟨a|a⟩) = 2'],
          mistakes:[{expr:'4', msg:'Das ist $\\langle a|a\\rangle = \\|a\\|^2$. Zieh noch die Wurzel.'}, {expr:'sqrt(-2i)', msg:'Ohne Konjugation gerechnet: $1 + i^2 + (1 - i)^2$ ist kein Betragsquadrat.'}, {expr:'-2i', msg:'Ohne Konjugation gerechnet: $1 + i^2 + (1 - i)^2$ ist keine Summe von Betragsquadraten. Es braucht $|a_i|^2 = a_i^*a_i$.'}]},
        {id:'c', prompt:'c) Bestimme $N > 0$ so, dass $u = N\\,b$ normiert ist.', type:'solve', unknown:'N', points:2, ph:'⟨u|u⟩ = 1',
          hints:['Normieren heißt: $\\langle u|u\\rangle = 1$ ansetzen und nach $N$ auflösen.', '$\\langle Nb|Nb\\rangle = |N|^2\\langle b|b\\rangle$.', '$\\langle b|b\\rangle = 4 + 1 + 1 = 6$, also $|N|^2 = 1/6$.'],
          model:['⟨u|u⟩ = 1', '|N|^2 (4 + 1 + 1) = 1', 'N = 1/sqrt(6)'],
          mistakes:[{expr:'1/sqrt(4)', msg:'Prüfe $|{-i}|^2 = 1$: $\\langle b|b\\rangle = 4 + 1 + 1 = 6$.'}, {expr:'1/6', msg:'$|N|^2\\cdot 6 = 1$ gibt $N = 1/\\sqrt6$, nicht $1/6$.'}]}
      ]},
    {id:'mv-p2', title:'Entwickeln nach einer Orthonormalbasis',
      text:'$f_1 = \\frac{1}{\\sqrt5}\\begin{pmatrix}1\\\\ 2i\\end{pmatrix}$, $f_2 = \\frac{1}{\\sqrt5}\\begin{pmatrix}2\\\\ -i\\end{pmatrix}$ und $v = \\begin{pmatrix}3\\\\ i\\end{pmatrix}$.',
      ctx:MVEK({states:{f_1:'(1; 2i)/sqrt(5)', f_2:'(2; -i)/sqrt(5)', v:'(3; i)'}}),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $f_1$ und $f_2$ orthogonal sind.', type:'show', from:'⟨f_1|f_2⟩', to:'0', points:2, hints:['Orthogonal heißt: Das Skalarprodukt ist null. Bilde $\\langle f_1|f_2\\rangle$.', 'Die Zeile zu $\\langle f_1|$ ist $(1, -2i)/\\sqrt5$.', 'Rechne $1\\cdot 2 + (-2i)(-i) = 2 + 2i^2$ und denk an den Faktor $1/5$.'],
          model:['⟨f_1|f_2⟩ = 1/5 (1, -2i)(2; -i)', '= (2 + 2i^2)/5', '= 0']},
        {id:'b', prompt:'b) Berechne $c_1 = \\langle f_1|v\\rangle$.', type:'value', target:'sqrt(5)', points:2, ph:'⟨f_1|v⟩ = 1/sqrt(5) (1, -2i)(3; i)',
          hints:['In einer ONB ist jede Komponente ein Skalarprodukt mit dem Basisvektor.', '$c_1 = \\langle f_1|v\\rangle$ mit der Zeile $(1, -2i)/\\sqrt5$.', '$1\\cdot 3 + (-2i)\\cdot i = 3 - 2i^2 = 5$. Teile noch durch $\\sqrt5$.'],
          model:['⟨f_1|v⟩ = 1/sqrt(5) (1, -2i)(3; i)', '= (3 - 2i^2)/sqrt(5)', '= sqrt(5)'],
          mistakes:[{expr:'1/sqrt(5)', msg:'Ohne Konjugation gerechnet: Die Zeile zu $(1; 2i)$ ist $(1, -2i)$.'}, {expr:'5', msg:'Der Normierungsfaktor $1/\\sqrt5$ von $f_1$ fehlt.'}]},
        {id:'c', prompt:'c) Berechne $c_2 = \\langle f_2|v\\rangle$ und prüfe $|c_1|^2 + |c_2|^2 = \\langle v|v\\rangle$.', type:'value', target:'sqrt(5)', points:2, ph:'⟨f_2|v⟩ = 1/sqrt(5) (2, i)(3; i)',
          hints:['Wie in b), jetzt mit $f_2$.', 'Die Zeile zu $\\langle f_2|$ ist $(2, i)/\\sqrt5$.', '$2\\cdot 3 + i\\cdot i = 6 - 1$. Teile durch $\\sqrt5$.'],
          model:['⟨f_2|v⟩ = 1/sqrt(5) (2, i)(3; i)', '= (6 + i^2)/sqrt(5)', '= sqrt(5)'],
          mistakes:[{expr:'7/sqrt(5)', msg:'Ohne Konjugation gerechnet: Die Zeile zu $(2; -i)$ ist $(2, i)$, und $i\\cdot i = -1$.'}],
          note:'Parseval: $|c_1|^2 + |c_2|^2 = 5 + 5 = 10 = |3|^2 + |i|^2$. Also $v = \\sqrt5\\,(f_1 + f_2)$.'}
      ]},
    {id:'mv-p3', title:'Projektion und Gram-Schmidt',
      text:'$a = \\begin{pmatrix}1\\\\ 1\\\\ 0\\end{pmatrix}$ und $b = \\begin{pmatrix}1\\\\ 0\\\\ 1\\end{pmatrix}$ sind linear unabhängig, aber nicht orthogonal.',
      ctx:MVEK({states:{a:'(1; 1; 0)', b:'(1; 0; 1)'}}),
      goals:[
        {id:'a', prompt:'a) Berechne den zu $a$ senkrechten Anteil $w = b - \\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}\\,a$.', type:'value', target:'(1/2; -1/2; 1)', points:3, ph:'⟨a|b⟩ = 1',
          hints:['Gesucht ist der Anteil von $b$, der senkrecht auf $a$ steht: $b$ minus seine Projektion auf $a$.', 'Projektion auf einen nicht normierten Vektor: $\\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}a$.', '$\\langle a|b\\rangle = 1$ und $\\langle a|a\\rangle = 2$, also $w = b - \\tfrac12 a$. Ergebnis als Spalte `(…; …; …)`.'],
          model:['⟨a|b⟩ = 1', '⟨a|a⟩ = 2', '|b⟩ - 1/2 |a⟩ = (1/2; -1/2; 1)'],
          mistakes:[{expr:'(0; -1; 1)', msg:'Du hast ganz $a$ abgezogen. Der Anteil entlang $a$ ist $\\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}a = \\tfrac12 a$, weil $a$ nicht normiert ist.'}, {expr:'(1 - 1/sqrt(2); -1/sqrt(2); 1)', msg:'Nur durch $\\sqrt{\\langle a|a\\rangle}$ geteilt. Die Projektion braucht $\\langle a|a\\rangle$ im Nenner (oder zweimal den normierten Vektor).'}],
          note:'Kontrolle: $\\langle a|w\\rangle = \\tfrac12 - \\tfrac12 + 0 = 0$.'},
        {id:'b', prompt:'b) Normiere $w = (\\tfrac12; -\\tfrac12; 1)$.', type:'value', target:'(1; -1; 2)/sqrt(6)', points:2, ph:'(1/2, -1/2, 1)(1/2; -1/2; 1) = 3/2',
          hints:['Normieren: durch die Norm teilen.', '$\\|w\\| = \\sqrt{\\langle w|w\\rangle}$, nicht $\\langle w|w\\rangle$.', '$\\langle w|w\\rangle = \\tfrac14 + \\tfrac14 + 1 = \\tfrac32$. Teile $w$ durch $\\sqrt{3/2}$.'],
          model:['(1/2, -1/2, 1)(1/2; -1/2; 1) = 3/2', '(1/2; -1/2; 1)/sqrt(3/2) = (1; -1; 2)/sqrt(6)'],
          mistakes:[{expr:'(1/2; -1/2; 1)/(3/2)', msg:'Teilen durch $\\langle w|w\\rangle$ normiert nicht. Man teilt durch die Norm $\\sqrt{\\langle w|w\\rangle}$.'}],
          note:'Zusammen mit $a/\\sqrt2$ ist das eine Orthonormalbasis der Ebene, die $a$ und $b$ aufspannen. Für einen dritten Vektor zieht man die Projektionen auf beide ab.'}
      ]},
    {id:'mv-p4', title:'Cauchy-Schwarz und Übergangswahrscheinlichkeit',
      text:'$a = \\begin{pmatrix}1\\\\ i\\end{pmatrix}$, $b = \\begin{pmatrix}1\\\\ 1\\end{pmatrix}$.',
      ctx:MVEK({states:{a:'(1; i)', b:'(1; 1)'}, unknowns:{λ:{ref:'-(1 - i)/2', kind:'complex'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\dfrac{|\\langle a|b\\rangle|^2}{\\langle a|a\\rangle\\langle b|b\\rangle}$. Nach Cauchy-Schwarz liegt das zwischen $0$ und $1$.', type:'value', target:'1/2', points:2, ph:'⟨a|b⟩ = 1 - i',
          hints:['Berechne die drei Skalarprodukte einzeln und setze sie in den Bruch ein.', '$\\langle a|b\\rangle = (1, -i)(1; 1)$ und $|\\langle a|b\\rangle|^2 = \\langle a|b\\rangle^*\\langle a|b\\rangle$.', '$\\langle a|b\\rangle = 1 - i$, $|1 - i|^2 = 2$ und $\\langle a|a\\rangle = \\langle b|b\\rangle = 2$.'],
          model:['⟨a|b⟩ = 1 - i', '|⟨a|b⟩|^2/(⟨a|a⟩ ⟨b|b⟩) = 2/(2 · 2)', '= 1/2'],
          mistakes:[{expr:'(1 + i)^2/4', msg:'Ohne Konjugation und ohne Betrag gerechnet. Es braucht $|\\langle a|b\\rangle|^2 = |1 - i|^2 = 2$.'}],
          note:'Normiert man $a$ und $b$, ist der Quotient $|\\langle a|b\\rangle|^2$: die Wahrscheinlichkeit, ein System im Zustand $b$ bei einer passenden Messung im Zustand $a$ zu finden. Hier: $1/2$ – wie bei Spin-Zuständen $|{+x}\\rangle$ und $|{+y}\\rangle$ (Thema 10).'},
        {id:'b', prompt:'b) Bestimme die komplexe Zahl $\\lambda$, für die $b + \\lambda a$ senkrecht auf $a$ steht.', type:'solve', unknown:'λ', points:2, ph:'⟨a|b⟩ + λ ⟨a|a⟩ = 0',
          hints:['Senkrecht auf $a$ heißt $\\langle a|b + \\lambda a\\rangle = 0$. Löse nach $\\lambda$ auf.', 'Linear im rechten Argument: $\\langle a|b + \\lambda a\\rangle = \\langle a|b\\rangle + \\lambda\\langle a|a\\rangle$.', 'Setze ein: $1 - i + 2\\lambda = 0$.'],
          model:['⟨a|b⟩ + λ ⟨a|a⟩ = 0', '1 - i + 2λ = 0', 'λ = -(1 - i)/2'],
          mistakes:[{expr:'-(1 + i)/2', msg:'Hier wurde $\\langle b|a\\rangle = 1 + i$ statt $\\langle a|b\\rangle$ benutzt. Für $\\langle a|b + \\lambda a\\rangle$ steht $a$ links.'}],
          note:'$-\\lambda a = \\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}a$ ist genau die Projektion von $b$ auf $a$ – ein Gram-Schmidt-Schritt.'}
      ]}
  ],
  concept:[
    {id:'mv-k1', type:'mc2', q:'Es ist $\\langle a|b\\rangle = 3i$. Was ist $\\langle b|a\\rangle$?', opts:['$-3i$', '$3i$', '$3$'], a:0,
      ex:'$\\langle b|a\\rangle = \\langle a|b\\rangle^* = (3i)^* = -3i$.',
      reason:{q:'Warum?', opts:['Vertauschen konjugiert: $\\langle b|a\\rangle = \\langle a|b\\rangle^*$.', 'Skalarprodukte sind symmetrisch, wie im $\\mathbb R^n$.', 'Man nimmt den Betrag, weil die Reihenfolge egal ist.'], a:0, ex:'Im $\\mathbb R^n$ ist das Skalarprodukt symmetrisch, in $\\mathbb C^n$ nur „konjugiert symmetrisch“. Der Betrag $|\\langle a|b\\rangle| = 3$ ist für beide Reihenfolgen gleich, das Skalarprodukt selbst nicht.'},
      seg:'mv-t2', lex:'skalarprodukt'},
    {id:'mv-k2', type:'dialog', text:'Es geht um die Polarisationsvektoren $r = (1; i)/\\sqrt2$ und $l = (1; -i)/\\sqrt2$ von rechts- und linkszirkular polarisiertem Licht.',
      people:[{name:'Lena', says:'Die beiden können nicht orthogonal sein. Beide Felder drehen sich in derselben Ebene, und ihre ersten Einträge sind sogar gleich.'}, {name:'Jonas', says:'Orthogonal heißt $\\langle r|l\\rangle = 0$. Hier ist $\\langle r|l\\rangle = \\tfrac12(1 + (-i)(-i)) = 0$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Orthogonalität im Raum der Zustände ist nicht dasselbe wie „senkrecht im Raum“. Ein Filter für $r$ sperrt $l$ vollständig. Ebenso sind beim Spin ½ die Zustände $|{\\uparrow_z}\\rangle$ und $|{\\downarrow_z}\\rangle$ orthogonal, obwohl die Spins antiparallel stehen (Thema 10).',
      seg:'mv-t2', lex:'polarisation-jones'},
    {id:'mv-k3', type:'mc', q:'Für $\\lambda = 2i$ ist $\\langle\\lambda a|b\\rangle$ gleich …', opts:['$-2i\\langle a|b\\rangle$', '$2i\\langle a|b\\rangle$', '$2\\langle a|b\\rangle$'], a:0,
      ex:'Im linken Argument kommt der Faktor konjugiert heraus: $(2i)^* = -2i$. $2i\\langle a|b\\rangle$ wäre richtig für $\\langle a|\\lambda b\\rangle$; $2 = |\\lambda|$ vergisst die Phase.',
      seg:'mv-t2', lex:'skalarprodukt'},
    {id:'mv-k4', type:'mc2', q:'$b_1 = (1; 1)$ und $b_2 = (1; -1)$ sind orthogonal, aber nicht normiert. Wie groß ist $c_1$ in $v = (3; 1) = c_1b_1 + c_2b_2$?', opts:['$c_1 = 2$', '$c_1 = 4$', '$c_1 = 2\\sqrt2$'], a:0,
      ex:'Probe: $2(1; 1) + 1\\cdot(1; -1) = (3; 1)$.',
      reason:{q:'Warum?', opts:['$c_1 = \\langle b_1|v\\rangle/\\langle b_1|b_1\\rangle = 4/2$', '$c_1 = \\langle b_1|v\\rangle$, wie in jeder Basis', '$c_1 = \\langle b_1|v\\rangle/\\|b_1\\|$, geteilt durch die Länge'], a:0, ex:'Aus $\\langle b_1|v\\rangle = c_1\\langle b_1|b_1\\rangle$ folgt der Nenner $\\langle b_1|b_1\\rangle = 2$. $c_i = \\langle b_i|v\\rangle$ gilt nur in einer Orthonormalbasis.'},
      seg:'mv-t3', lex:'orthonormalbasis'},
    {id:'mv-k5', type:'dialog', text:'Zwei Vektoren $a, b \\neq 0$ erfüllen $|\\langle a|b\\rangle|^2 = \\langle a|a\\rangle\\,\\langle b|b\\rangle$.',
      people:[{name:'Lena', says:'Dann ist $b = \\lambda a$ mit einer komplexen Zahl $\\lambda$, zum Beispiel $b = i\\,a$.'}, {name:'Jonas', says:'Dann stehen $a$ und $b$ senkrecht aufeinander.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Gleichheit in Cauchy-Schwarz gilt genau für linear abhängige Vektoren. Für orthogonale Vektoren ist die linke Seite null, die rechte positiv – das ist das Gegenteil von Gleichheit.',
      seg:'mv-t5', lex:'cauchy-schwarz'},
    {id:'mv-k6', type:'mc', q:'Beschreiben $(1; i)$ und $(i; -1)$ verschiedene Zustände eines Zwei-Zustands-Systems?', opts:['Nein, sie unterscheiden sich nur um den Faktor $i$.', 'Ja, denn alle ihre Einträge sind verschieden.', 'Ja, denn sie stehen orthogonal zueinander.'], a:0,
      ex:'$(i; -1) = i\\,(1; i)$, und $i = e^{i\\pi/2}$ ist ein globaler Phasenfaktor. Ihr Skalarprodukt ist $2i \\neq 0$; es gilt sogar Gleichheit in Cauchy-Schwarz.',
      seg:'mv-t5', lex:'phase-global-relativ'}
  ],
  sketch:[
    {id:'mv-s1', kind:'arrows', title:'Projektion und Rest',
      text:'Gegeben sind $a = (2;\\ 1)$ und $v = (1;\\ 2)$ (graue Pfeile). Zeichne zwei Pfeile: die Projektion $P_av$ vom Ursprung aus und den Rest $v - P_av$ von der Spitze von $P_av$ zur Spitze von $v$.',
      plot:{x:[-0.5, 2.5], y:[-0.5, 2.5], abs:true, xlab:'1', ylab:'2', grid:0.5},
      given:[{from:[0, 0], to:[2, 1], lab:'a'}, {from:[0, 0], to:[1, 2], lab:'v'}],
      // P_a v = ⟨a|v⟩/⟨a|a⟩·a = 4/5·(2; 1) = (1,6; 0,8); Rest (−0,6; 1,2) steht senkrecht auf a
      want:[
        {from:[0, 0], to:[1.6, 0.8], lab:'P_av', msg:'Die Projektion liegt auf der Geraden durch $a$. Welcher Faktor gehört vor $a$? (Abschnitt „Projektionen und das Gram-Schmidt-Verfahren“)', msgLen:'Die Richtung passt. Hast du durch $\\langle a|a\\rangle = \\|a\\|^2$ geteilt und nicht nur durch $\\|a\\|$?'},
        // Der Rest beginnt an der gezeichneten Spitze von P_av: Deren erlaubte Abweichung (Länge ±15 %, Richtung ±12°) verschiebt Anfang, Richtung und Länge des Rests mit, deshalb hier weitere Toleranzen
        {from:[1.6, 0.8], to:[1, 2], lab:'v - P_av', posTol:0.35, dirTol:16, lenTol:0.22, msg:'Der Rest führt von der Spitze von $P_av$ zur Spitze von $v$. Welchen Winkel muss er mit $a$ einschließen?', msgPos:'Wo beginnt der Rest? Er setzt an der Spitze von $P_av$ an.'}],
      reveal:'$P_av = \\frac{\\langle a|v\\rangle}{\\langle a|a\\rangle}a = \\frac45(2;\\ 1) = (1{,}6;\\ 0{,}8)$. Der Rest $v - P_av = (-0{,}6;\\ 1{,}2)$ steht senkrecht auf $a$, denn $2\\cdot(-0{,}6) + 1\\cdot 1{,}2 = 0$. Geometrisch fällst du von der Spitze von $v$ das Lot auf die Gerade durch $a$: Der Fußpunkt ist die Spitze der Projektion.',
      hints:['Berechne zuerst $\\langle a|v\\rangle$ und $\\langle a|a\\rangle$. Der Rest ergibt sich dann von selbst.', 'Der Rest $v - P_av$ steht senkrecht auf $a$: Die Projektion ist der Fußpunkt des Lots von $v$ auf die Gerade durch $a$.'],
      wrong:[
        {arrows:[{from:[0, 0], to:[0.8, 1.6]}, {from:[0.8, 1.6], to:[2, 1]}], fails:[0, 1], why:'a auf v projiziert statt v auf a'},
        {arrows:[{from:[0, 0], to:[4 / Math.sqrt(5) * 2, 4 / Math.sqrt(5)]}, {from:[4 / Math.sqrt(5) * 2, 4 / Math.sqrt(5)], to:[1, 2]}], fails:[0], why:'nur durch ‖a‖ statt durch ⟨a|a⟩ geteilt (der Rest von dieser Spitze aus ist folgerichtig)'},
        {arrows:[{from:[0, 0], to:[2, 1]}, {from:[2, 1], to:[1, 2]}], fails:[0, 1], why:'Faktor vergessen: a selbst als Projektion'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'mv-f1', title:'Norm', text:'$v = \\begin{pmatrix}1 + i\\\\ 1 - i\\\\ 1\\end{pmatrix}$.', ctx:MVEK({states:{v:'(1 + i; 1 - i; 1)'}}),
      goals:[{id:'a', prompt:'Berechne $\\|v\\|$.', type:'value', target:'sqrt(5)', points:2, model:['⟨v|v⟩ = |1 + i|^2 + |1 - i|^2 + 1', '= 5', 'sqrt(⟨v|v⟩) = sqrt(5)'],
        mistakes:[{expr:'5', msg:'Das ist $\\|v\\|^2$. Zieh noch die Wurzel.'}, {expr:'1', msg:'Ohne Konjugation gerechnet: $(1 + i)^2 + (1 - i)^2 + 1 = 1$. Es braucht $|1 \\pm i|^2 = 2$.'}]}]}},
    {aim:1, task:{id:'mv-f2', title:'Komponente', text:'$e_1 = \\frac{1}{\\sqrt2}(1; i)$, $e_2 = \\frac{1}{\\sqrt2}(1; -i)$, $v = (0; 2)$.', ctx:MVEK({states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'(0; 2)'}}),
      goals:[{id:'a', prompt:'Berechne $c_2 = \\langle e_2|v\\rangle$.', type:'value', target:'sqrt(2) i', points:2, model:['⟨e_2|v⟩ = 1/sqrt(2) (1, i)(0; 2)', '= sqrt(2) i'],
        mistakes:[{expr:'-sqrt(2) i', msg:'Ohne Konjugation gerechnet: Die Zeile zu $(1; -i)$ ist $(1, i)$.'}]}]}},
    {aim:2, task:{id:'mv-f3', title:'Gram-Schmidt-Schritt', text:'$a = (1; 0; 1)$ und $b = (2; 1; 0)$. Berechne den zu $a$ senkrechten Anteil von $b$.', ctx:MVEK({states:{a:'(1; 0; 1)', b:'(2; 1; 0)'}}),
      goals:[{id:'a', prompt:'Ergebnis als Spalte:', type:'value', target:'(1; 1; -1)', points:3, model:['⟨a|b⟩ = 2', '⟨a|a⟩ = 2', '|b⟩ - ⟨a|b⟩/⟨a|a⟩ |a⟩ = (1; 1; -1)'],
        mistakes:[{expr:'(0; 1; -2)', msg:'Der Anteil entlang $a$ ist $\\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}a = 1\\cdot a$, nicht $2a$: $a$ ist nicht normiert.'}, {expr:'(2 - sqrt(2); 1; -sqrt(2))', msg:'Nur durch $\\|a\\|$ geteilt. Die Projektion braucht $\\langle a|a\\rangle$ im Nenner.'}]}]}},
    {aim:'k', id:'mv-fk1', type:'mc2', q:'Für normierte Vektoren $a, b$ ergibt eine Rechnung $|\\langle a|b\\rangle|^2 = 1{,}3$. Was folgt?', opts:['Es liegt ein Rechenfehler vor.', 'Die Zustände sind sich besonders ähnlich.', 'Die Zustände sind orthogonal.'], a:0,
      ex:'Für normierte Vektoren ist $|\\langle a|b\\rangle|^2 \\le 1$.',
      reason:{q:'Warum?', opts:['Nach Cauchy-Schwarz ist $|\\langle a|b\\rangle|^2 \\le 1$.', 'Werte über 1 zeigen Gleichheit in Cauchy-Schwarz an.', 'Werte über 1 bedeuten, dass die Vektoren senkrecht stehen.'], a:0, ex:'Gleichheit bedeutet $|\\langle a|b\\rangle|^2 = 1$ genau, nicht mehr. Orthogonal hieße $0$. Ein Wert über 1 ist unmöglich – meist fehlt eine Konjugation oder eine Normierung.'}},
    {aim:'k', id:'mv-fk2', type:'dialog', text:'In der Orthonormalbasis $e_1 = (1; i)/\\sqrt2$, $e_2 = (1; -i)/\\sqrt2$ soll die Komponente $c_1$ von $v = (0; 1)$ bestimmt werden.',
      people:[{name:'Lena', says:'$c_1 = \\langle v|e_1\\rangle = (0, 1)(1; i)/\\sqrt2 = i/\\sqrt2$.'}, {name:'Jonas', says:'$c_1 = \\langle e_1|v\\rangle = (1, -i)(0; 1)/\\sqrt2 = -i/\\sqrt2$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Probe mit $c_2 = \\langle e_2|v\\rangle = i/\\sqrt2$: $c_1e_1 + c_2e_2 = \\tfrac{-i}{2}(1; i) + \\tfrac{i}{2}(1; -i) = (0; 1)$. Lena berechnet $c_1^*$.'},
    {aim:2, sketch:{id:'mv-fs-a', kind:'arrows', title:'Gram-Schmidt in der Ebene', points:3,
      text:'Gegeben sind $a_1 = (1;\\ 1)$ und $a_2 = (0;\\ 2)$ (graue Pfeile). Führe das Gram-Schmidt-Verfahren in dieser Reihenfolge aus und zeichne die Ergebnisse $e_1$ und $e_2$, je als Pfeil vom Ursprung aus.',
      plot:{x:[-2, 2.5], y:[-1.5, 2.5], abs:true, xlab:'1', ylab:'2', unit:true, grid:0.5},
      // e_1 = (1; 1)/√2; w = a_2 − ⟨e_1|a_2⟩e_1 = (0; 2) − (1; 1) = (−1; 1); e_2 = (−1; 1)/√2
      given:[{from:[0, 0], to:[1, 1], lab:'a_1'}, {from:[0, 0], to:[0, 2], lab:'a_2'}],
      want:[
        {from:[0, 0], to:[Math.SQRT1_2, Math.SQRT1_2], lab:'e_1', msg:'Was macht der erste Schritt mit $a_1$? Welche Länge hat $e_1$?'},
        {from:[0, 0], to:[-Math.SQRT1_2, Math.SQRT1_2], lab:'e_2', msg:'Was ziehst du von $a_2$ ab, bevor du normierst? Welchen Winkel schließt das Ergebnis mit $e_1$ ein, und auf welcher Seite von $e_1$ liegt es?'}],
      reveal:'$e_1 = a_1/\\|a_1\\| = (1;\\ 1)/\\sqrt2$. Dann $\\langle e_1|a_2\\rangle = \\sqrt2$ und $w = a_2 - \\sqrt2\\,e_1 = (-1;\\ 1)$. Normiert: $e_2 = (-1;\\ 1)/\\sqrt2$. Beide Pfeile haben die Länge 1 und enden auf dem Einheitskreis; $e_2$ steht senkrecht auf $e_1$, auf der Seite von $a_2$.',
      wrong:[
        {arrows:[{from:[0, 0], to:[Math.SQRT1_2, Math.SQRT1_2]}, {from:[0, 0], to:[0, 1]}], fails:[1], why:'a₂ nur normiert, nicht orthogonalisiert'},
        {arrows:[{from:[0, 0], to:[1, 1]}, {from:[0, 0], to:[-1, 1]}], fails:[0, 1], why:'nicht normiert'}
      ]}}
  ],
  finalB:[
    {aim:0, task:{id:'mv-g1', title:'Norm', text:'$v = \\begin{pmatrix}2 - i\\\\ i\\\\ 1 + i\\end{pmatrix}$.', ctx:MVEK({states:{v:'(2 - i; i; 1 + i)'}}),
      goals:[{id:'a', prompt:'Berechne $\\|v\\|$.', type:'value', target:'2 sqrt(2)', points:2, model:['⟨v|v⟩ = |2 - i|^2 + |i|^2 + |1 + i|^2', '= 8', 'sqrt(⟨v|v⟩) = 2 sqrt(2)'],
        mistakes:[{expr:'8', msg:'Das ist $\\|v\\|^2$. Zieh noch die Wurzel.'}, {expr:'sqrt(2 - 2i)', msg:'Ohne Konjugation gerechnet. Es braucht $|v_i|^2 = v_i^*v_i$.'}]}]}},
    {aim:1, task:{id:'mv-g2', title:'Komponente', text:'$e_1 = \\frac{1}{\\sqrt2}(1; i)$, $e_2 = \\frac{1}{\\sqrt2}(1; -i)$, $v = (1; 1)$.', ctx:MVEK({states:{e_1:'(1; i)/sqrt(2)', e_2:'(1; -i)/sqrt(2)', v:'(1; 1)'}}),
      goals:[{id:'a', prompt:'Berechne $c_1 = \\langle e_1|v\\rangle$.', type:'value', target:'(1 - i)/sqrt(2)', points:2, model:['⟨e_1|v⟩ = 1/sqrt(2) (1, -i)(1; 1)', '= (1 - i)/sqrt(2)'],
        mistakes:[{expr:'(1 + i)/sqrt(2)', msg:'Ohne Konjugation gerechnet: Die Zeile zu $(1; i)$ ist $(1, -i)$.'}]}]}},
    {aim:2, task:{id:'mv-g3', title:'Gram-Schmidt-Schritt', text:'$a = (1; 1; 0)$ und $b = (0; 1; 2)$. Berechne den zu $a$ senkrechten Anteil von $b$.', ctx:MVEK({states:{a:'(1; 1; 0)', b:'(0; 1; 2)'}}),
      goals:[{id:'a', prompt:'Ergebnis als Spalte:', type:'value', target:'(-1/2; 1/2; 2)', points:3, model:['⟨a|b⟩ = 1', '⟨a|a⟩ = 2', '|b⟩ - ⟨a|b⟩/⟨a|a⟩ |a⟩ = (-1/2; 1/2; 2)'],
        mistakes:[{expr:'(-1; 0; 2)', msg:'Der Anteil entlang $a$ ist $\\frac{\\langle a|b\\rangle}{\\langle a|a\\rangle}a = \\tfrac12a$, nicht $a$: $a$ ist nicht normiert.'}]}]}},
    {aim:'k', id:'mv-gk1', type:'mc2', q:'Für normierte Vektoren $a, b$ gilt $|\\langle a|b\\rangle|^2 = 1$. Was folgt?', opts:['$b = e^{i\\alpha}a$ mit reellem $\\alpha$', '$a$ und $b$ sind orthogonal', '$a = b$, Eintrag für Eintrag'], a:0,
      ex:'Gleichheit in Cauchy-Schwarz: $b = \\lambda a$, und wegen der Normierung ist $|\\lambda| = 1$.',
      reason:{q:'Warum?', opts:['Gleichheit in Cauchy-Schwarz gilt genau für abhängige Vektoren.', 'Der Wert 1 zeigt Orthogonalität an.', 'Nur gleiche Einträge geben ein Skalarprodukt vom Betrag 1.'], a:0, ex:'$b = i\\,a$ zum Beispiel hat andere Einträge und trotzdem $|\\langle a|b\\rangle| = 1$. Orthogonal hieße $\\langle a|b\\rangle = 0$.'}},
    {aim:'k', id:'mv-gk2', type:'dialog', text:'Der Projektor auf einen normierten Vektor $e$ ist $P = |e\\rangle\\langle e|$. Jetzt nimmt man statt $e$ den Vektor $e\' = i\\,e$.',
      people:[{name:'Lena', says:'$|e\'\\rangle\\langle e\'| = i\\cdot(-i)\\,|e\\rangle\\langle e| = P$. Der Projektor ändert sich nicht.'}, {name:'Jonas', says:'Beide Faktoren $i$ kommen heraus: $|e\'\\rangle\\langle e\'| = i\\cdot i\\,|e\\rangle\\langle e| = -P$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Das Bra $\\langle e\'|$ ist die Zeile mit den **konjugierten** Einträgen; der Faktor kommt dort als $i^* = -i$ heraus. Ein Phasenfaktor ändert den Projektor also nicht, und damit auch keine Wahrscheinlichkeit $|\\langle e|\\psi\\rangle|^2$. Jonas’ $-P$ wäre gar kein Projektor: $(-P)^2 = P \\neq -P$.'},
    {aim:2, sketch:{id:'mv-fs-b', kind:'arrows', title:'Gram-Schmidt in der Ebene', points:3,
      text:'Gegeben sind $a_1 = (1;\\ -1)$ und $a_2 = (2;\\ 0)$ (graue Pfeile). Führe das Gram-Schmidt-Verfahren in dieser Reihenfolge aus und zeichne die Ergebnisse $e_1$ und $e_2$, je als Pfeil vom Ursprung aus.',
      plot:{x:[-1.5, 2.5], y:[-2, 2], abs:true, xlab:'1', ylab:'2', unit:true, grid:0.5},
      // e_1 = (1; −1)/√2; w = a_2 − ⟨e_1|a_2⟩e_1 = (2; 0) − (1; −1) = (1; 1); e_2 = (1; 1)/√2
      given:[{from:[0, 0], to:[1, -1], lab:'a_1'}, {from:[0, 0], to:[2, 0], lab:'a_2'}],
      want:[
        {from:[0, 0], to:[Math.SQRT1_2, -Math.SQRT1_2], lab:'e_1', msg:'Was macht der erste Schritt mit $a_1$? Welche Länge hat $e_1$?'},
        {from:[0, 0], to:[Math.SQRT1_2, Math.SQRT1_2], lab:'e_2', msg:'Was ziehst du von $a_2$ ab, bevor du normierst? Welchen Winkel schließt das Ergebnis mit $e_1$ ein, und auf welcher Seite von $e_1$ liegt es?'}],
      reveal:'$e_1 = a_1/\\|a_1\\| = (1;\\ -1)/\\sqrt2$. Dann $\\langle e_1|a_2\\rangle = \\sqrt2$ und $w = a_2 - \\sqrt2\\,e_1 = (1;\\ 1)$. Normiert: $e_2 = (1;\\ 1)/\\sqrt2$. Beide Pfeile haben die Länge 1 und enden auf dem Einheitskreis; $e_2$ steht senkrecht auf $e_1$, auf der Seite von $a_2$.',
      wrong:[
        {arrows:[{from:[0, 0], to:[Math.SQRT1_2, -Math.SQRT1_2]}, {from:[0, 0], to:[1, 0]}], fails:[1], why:'a₂ nur normiert, nicht orthogonalisiert'},
        {arrows:[{from:[0, 0], to:[1, -1]}, {from:[0, 0], to:[1, 1]}], fails:[0, 1], why:'nicht normiert'}
      ]}}
  ],
  errors:[
    {id:'mv-e1', title:'Norm ohne Konjugation',
      text:'Gesucht ist die Norm von $a = \\begin{pmatrix}1 + i\\\\ 2i\\end{pmatrix}$. So wurde gerechnet:',
      ctx:MVEK({states:{a:'(1 + i; 2i)'}}),
      lines:['⟨a|a⟩ = (1 + i)^2 + (2i)^2', '= 2i - 4'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['Es fehlt die Konjugation: $\\langle a|a\\rangle = |1 + i|^2 + |2i|^2$.', 'Man muss die Summe $(1 + i) + 2i$ quadrieren.', 'Nichts, nur das Vorzeichen in Zeile 2 ist falsch.'], a:0, ex:'Ein Normquadrat ist reell und nicht negativ. $2i - 4$ kann nicht stimmen.'},
      fix:{id:'a', prompt:'Berichtige und berechne $\\|a\\|$.', type:'value', target:'sqrt(6)', model:['⟨a|a⟩ = |1 + i|^2 + |2i|^2', '= 2 + 4', 'sqrt(⟨a|a⟩) = sqrt(6)'],
        mistakes:[{expr:'6', msg:'Das ist $\\|a\\|^2$. Zieh noch die Wurzel.'}]}},
    {id:'mv-e2', title:'Komponenten in einer schiefen Basis',
      text:'Die Basis $b_1 = (1; 0)$, $b_2 = (1; 1)$ ist nicht orthogonal. Jemand bestimmt die Komponenten von $v = (2; 3)$ in $v = c_1b_1 + c_2b_2$ mit Skalarprodukten:',
      ctx:MVEK({states:{b_1:'(1; 0)', b_2:'(1; 1)', v:'(2; 3)'}, unknowns:{c_1:{ref:'-1'}, c_2:{ref:'3'}}}),
      lines:['c_1 = ⟨b_1|v⟩', '= 2', 'c_2 = ⟨b_2|v⟩', '= 5'],
      wrong:0,
      why:{q:'Was ist falsch?', opts:['$c_i = \\langle b_i|v\\rangle$ gilt nur in einer ONB.', 'Die Skalarprodukte sind falsch ausgerechnet.', 'Man muss noch durch $\\|b_2\\| = \\sqrt2$ teilen.'], a:0, ex:'Probe: $2b_1 + 5b_2 = (7; 5) \\neq v$. Hier muss man $c_1b_1 + c_2b_2 = v$ lösen: $c_1 = -1$, $c_2 = 3$, denn $-(1; 0) + 3(1; 1) = (2; 3)$.'},
      fix:{id:'a', prompt:'Bestimme $c_1$ aus $c_1b_1 + c_2b_2 = v$.', type:'solve', unknown:'c_1', model:['c_1 |b_1⟩ + c_2 |b_2⟩ = |v⟩', 'c_1 + c_2 = 2', 'c_2 = 3', 'c_1 = -1'],
        mistakes:[{expr:'2', msg:'Das ist $\\langle b_1|v\\rangle$ – in einer schiefen Basis nicht die Komponente.'}]}}
  ]
});
lexe('vektorraum', 'Vektorraum, Basis, lineare Unabhängigkeit', 'Ein Vektorraum über $\\mathbb C$: Vektoren lassen sich addieren und mit komplexen Zahlen multiplizieren. $v_1, \\dots, v_k$ heißen linear unabhängig, wenn $\\sum c_iv_i = 0$ nur für $c_1 = \\dots = c_k = 0$ gilt (auch komplexe $c_i$ sind erlaubt). Eine Basis ist ein unabhängiges System, mit dem sich jeder Vektor darstellen lässt; die Anzahl ihrer Vektoren ist die Dimension. Die Komponenten eines Vektors hängen von der Basis ab. Beispiele: $\\mathbb C^n$ (Dimension $n$), Funktionenräume (unendlich-dimensional, M5).', {topic:'m-vektor'});
lexe('skalarprodukt', 'Skalarprodukt in ℂⁿ', '$\\langle a|b\\rangle = \\sum_i a_i^*b_i$ (Konvention der Physik: antilinear im linken Argument). Eigenschaften: $\\langle a|b\\rangle^* = \\langle b|a\\rangle$, $\\langle a|\\lambda b\\rangle = \\lambda\\langle a|b\\rangle$, $\\langle\\lambda a|b\\rangle = \\lambda^*\\langle a|b\\rangle$, $\\langle a|a\\rangle \\ge 0$ mit Gleichheit nur für $a = 0$. Norm: $\\|a\\| = \\sqrt{\\langle a|a\\rangle}$. In Dirac-Notation ist $\\langle a|$ die Zeile mit den Einträgen $a_i^*$.', {topic:'m-vektor'});
lexe('orthonormalbasis', 'Orthonormalbasis und Komponenten', 'Eine Basis mit $\\langle e_i|e_j\\rangle = \\delta_{ij}$. Dann gilt $v = \\sum_i c_ie_i$ mit $c_i = \\langle e_i|v\\rangle$, $\\langle v|w\\rangle = \\sum_i c_i^*d_i$ mit $d_i = \\langle e_i|w\\rangle$ und Parseval $\\langle v|v\\rangle = \\sum_i|c_i|^2$. Vollständigkeit: $\\sum_i|e_i\\rangle\\langle e_i| = \\mathbb 1$. In einer nur orthogonalen Basis: $c_i = \\langle b_i|v\\rangle/\\langle b_i|b_i\\rangle$. Für Funktionen siehe Orthonormalität (Thema 3) und M5.', {topic:'m-vektor'});
lexe('projektion', 'Projektion und Projektor', 'Projektion von $v$ auf einen normierten Vektor $e$: $\\langle e|v\\rangle\\,|e\\rangle$; auf einen beliebigen Vektor $a \\neq 0$: $\\frac{\\langle a|v\\rangle}{\\langle a|a\\rangle}|a\\rangle$. Als Operator: $P = |e\\rangle\\langle e|$ mit $P^2 = P$ und $P^\\dagger = P$. Der Rest $v - Pv$ steht senkrecht auf $e$. Ein Polarisationsfilter wirkt als Projektor.', {topic:'m-vektor'});
lexe('gram-schmidt', 'Gram-Schmidt-Verfahren', 'Aus linear unabhängigen $a_1, a_2, \\dots$ eine Orthonormalbasis bauen: $e_1 = a_1/\\|a_1\\|$; dann $w_2 = a_2 - \\langle e_1|a_2\\rangle e_1$, $e_2 = w_2/\\|w_2\\|$; allgemein $w_k = a_k - \\sum_{j<k}\\langle e_j|a_k\\rangle e_j$. Im Komplexen auf die Reihenfolge achten: der fertige Basisvektor steht links. Angewandt auf $1, x, x^2, \\dots$ auf $[-1, 1]$ liefert es bis auf die Normierung die Legendre-Polynome (M8).', {topic:'m-vektor'});
lexe('cauchy-schwarz', 'Cauchy-Schwarz-Ungleichung', '$|\\langle a|b\\rangle|^2 \\le \\langle a|a\\rangle\\langle b|b\\rangle$, Gleichheit genau dann, wenn $a$ und $b$ linear abhängig sind. Für normierte Zustände heißt das $0 \\le |\\langle a|b\\rangle|^2 \\le 1$ – deshalb sind Übergangswahrscheinlichkeiten sinnvoll. Beweis: $\\langle w|w\\rangle \\ge 0$ für $w = a - \\frac{\\langle b|a\\rangle}{\\langle b|b\\rangle}b$. Aus ihr folgt die Robertson-Unschärferelation (Thema 6).', {topic:'m-vektor'});
lexe('polarisation-jones', 'Polarisation als Vektor (Jones-Vektor)', 'Die Polarisation einer ebenen Lichtwelle beschreibt man durch einen normierten Vektor in $\\mathbb C^2$: $(1; 0)$ und $(0; 1)$ für lineare Polarisation in $x$- bzw. $y$-Richtung, $(1; 1)/\\sqrt2$ für $45°$, $(1; \\pm i)/\\sqrt2$ für zirkulare Polarisation (welcher Drehsinn zu welchem Vorzeichen gehört, ist Konvention). Ein Polarisationsfilter mit Durchlassrichtung $e$ projiziert: Durchgelassen wird der Anteil $|\\langle e|E\\rangle|^2$ der Intensität (für linear polarisiertes Licht das Gesetz von Malus, $\\cos^2\\theta$). Für einzelne Photonen ist das die Wahrscheinlichkeit, den Filter zu passieren.', {topic:'m-vektor'});
})();
