/* ===== Thema 6: Formalismus – Dirac-Notation, Operatoren, Messung ===== */
(function(){
const R = String.raw;
const FORM_FG = () => ({coords:['x'], params:{m:'pos'}, abstract:{f:{args:['x']}, g:{args:['x']}, V:{args:['x'], real:true}}});
const FORM_MAT = () => ({rep:'mat', mat:{preset:'spin', mats:{A:'(1, 2i; -2i, 1)'}}, coords:['t'], params:{},
  states:{v:'(1; -i)/sqrt(2)', w:'(1; i)/sqrt(2)'}, unknowns:{λ:{ref:'3', kind:'real'}, μ:{ref:'-1', kind:'real'}}});
const FORM_BOX = (st) => ({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)', 'Ψ(x)':st}, state:'Ψ', normalized:true});
const FORM_DYN = () => ({coords:['x', 't'], params:{m:'pos'}, abstract:{ψ:{args:['x', 't']}, V:{args:['x'], real:true}}, dyn:{fn:'ψ'}, normalized:true});
topic({
  id:'form', math:['m-vektor', 'm-eigen', 'm-hilbert'], title:'Formalismus: Dirac-Notation, Operatoren, Messung', short:'Formalismus',
  src:'Griffiths & Schroeter Kap. 3 · Nolting 5/1 Kap. 3 · Sakurai Kap. 1',
  goals:[
    'Ich kann mit Bras, Kets und Matrixelementen rechnen und Skalarprodukte in Orts- und Matrixdarstellung bilden.',
    'Ich kann zeigen, dass ein Operator hermitesch ist, und Kommutatoren wie $[\\hat x, \\hat p^2]$ berechnen.',
    'Ich kann mit dem Messpostulat Wahrscheinlichkeiten, Erwartungswerte und Unschärfen bestimmen.'
  ],
  needs:'komplexe Zahlen · Matrizen und Eigenwerte · partielle Integration · Erwartungswerte aus Thema 1',
  wozu:'Die Dirac-Schreibweise ist die gemeinsame Sprache aller Quantensysteme: Wellenfunktionen, Spins, Photonenpolarisation, Qubits. Mit dem Messpostulat sagst du voraus, was ein Experiment liefert und mit welcher Wahrscheinlichkeit. Die Quantenkryptografie nutzt direkt aus, dass eine Messung in der „falschen“ Basis den Zustand verändert: Ein Lauscher hinterlässt Spuren. Und die Unschärferelation folgt hier nicht aus einem Gedankenexperiment, sondern in wenigen Zeilen aus einem Kommutator.',
  bridge:'Thema 1–5 werden hier neu gelesen: $\\psi(x)$ wird zum Ket $|\\psi\\rangle$, die Koeffizienten $c_n$ aus Thema 3 werden Komponenten $\\langle n|\\psi\\rangle$, und $\\varphi(k)$ aus Thema 4 ist derselbe Zustand in der Impulsbasis. Aus der Mathematik brauchst du Skalarprodukt und Cauchy-Schwarz (M3), hermitesche Matrizen und Eigenbasen (M4) sowie Funktionenräume (M5). Thema 7–11 bauen vollständig auf dieser Sprache auf.',
  check:[
    {q:'Für die Vektoren $a = (1, i)$ und $b = (i, 1)$ ist das Skalarprodukt $\\sum_k a_k^* b_k$ gleich …', opts:['$0$', '$2i$', '$2$'], a:0, ex:'$1^*\\cdot i + i^*\\cdot 1 = i - i = 0$. Ohne Konjugation käme fälschlich $2i$ heraus.', lex:'dirac-notation', prev:'m-vektor', seg:'mv-t2'},
    {q:'Welche Eigenwerte hat die Matrix $\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$?', opts:['$+1$ und $-1$', '$0$ und $1$', '$1$ und $1$'], a:0, ex:'$\\det\\begin{pmatrix}-\\lambda&1\\\\1&-\\lambda\\end{pmatrix} = \\lambda^2 - 1 = 0$.', lex:'hermitescher-operator', prev:'m-eigen', seg:'me-t3'},
    {q:'Partielle Integration: $\\int_a^b f\\,g\'\\,dx = $', opts:['$[fg]_a^b - \\int_a^b f\'g\\,dx$', '$[fg]_a^b + \\int_a^b f\'g\\,dx$', '$f(b)g\'(b) - f(a)g\'(a)$'], a:0, ex:'Das ist die Produktregel, integriert. Bei Wellenfunktionen, die im Unendlichen verschwinden, fällt der Randterm weg.', lex:'integrale'},
    {q:'Ein Teilchen ist im Energieeigenzustand $\\psi_2$. Du misst die Energie. Was kommt heraus?', opts:['mit Sicherheit $E_2$', '$E_1$ oder $E_2$, je zur Hälfte', 'der Erwartungswert, der zwischen den $E_n$ liegt'], a:0, ex:'In einem Eigenzustand der Messgröße ist das Ergebnis sicher der zugehörige Eigenwert.', lex:'messpostulat', prev:'kasten'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Wahrscheinlichkeit für den Messwert $a_2$ einer Observablen $\\hat A$ im Zustand $|\\psi\\rangle$ zu bestimmen?', opts:['den Eigenvektor $|a_2\\rangle$ bestimmen und $|\\langle a_2|\\psi\\rangle|^2$ berechnen', '$\\hat A|\\psi\\rangle$ berechnen und den Anteil mit dem Faktor $a_2$ ablesen', '$\\langle\\psi|\\hat A|\\psi\\rangle$ berechnen und das Ergebnis durch $a_2$ teilen'], a:0, dk:true,
      ex:'Die Born-Regel braucht die Komponente des Zustands entlang des Eigenvektors. $\\hat A|\\psi\\rangle$ zu bilden, ist keine Messung, und $\\langle A\\rangle$ ist ein Mittelwert über alle Messwerte.'},
    {q:'Wie beginnst du, um zu zeigen, dass ein Differentialoperator $\\hat A$ hermitesch ist?', opts:['$\\langle f|\\hat A g\\rangle$ als Integral schreiben und partiell integrieren', 'prüfen, ob alle Koeffizienten in $\\hat A$ reelle Zahlen sind', 'für eine Beispielfunktion die Eigenwerte berechnen'], a:0, dk:true,
      ex:'Hermitesch heißt $\\langle f|\\hat A g\\rangle = \\langle\\hat A f|g\\rangle$ für alle zulässigen $f, g$. $\\hat p = -i\\hbar\\,d/dx$ hat einen imaginären Koeffizienten und ist trotzdem hermitesch; ein Beispiel beweist nichts für alle Funktionen.'}
  ],
  phenomenon:{
    title:'Drei Polarisationsfilter',
    text:'Zwei Polarisationsfilter hintereinander, der erste senkrecht ($0°$), der zweite waagerecht ($90°$): Kein Licht kommt durch. Jetzt schiebst du einen dritten Filter unter $45°$ **zwischen** die beiden.\n\nWas siehst du hinter dem letzten Filter?',
    q:{q:'Deine Vorhersage:', opts:['Es bleibt dunkel: Ein weiterer Filter kann nur zusätzlich absorbieren.', 'Es wird wieder hell: Ein Teil des Lichts kommt durch.', 'Es wird so hell wie hinter dem ersten Filter allein.'], a:1,
      ex:'Hinter dem letzten Filter kommt ein Viertel der Intensität an, die hinter dem ersten Filter da war.',
      fb:[
        'Das ist die Erwartung, wenn man Filter als Siebe denkt. Ein Filter misst aber die Polarisation und präpariert dabei einen neuen Zustand. Nach dem $45°$-Filter ist das Licht unter $45°$ polarisiert – und davon lässt der waagerechte Filter wieder einen Teil durch.',
        'Richtig. Hinter dem ersten Filter ist das Licht senkrecht polarisiert. Der $45°$-Filter lässt die Hälfte durch und stellt die Polarisation auf $45°$. Davon lässt der letzte Filter wieder die Hälfte durch: ein Viertel der Intensität hinter dem ersten Filter.',
        'Es kommt Licht durch, aber weniger: Jeder Filter lässt nur den Anteil $\\cos^2 45° = 1/2$ durch. Hinter dem letzten Filter bleibt ein Viertel der Intensität hinter dem ersten Filter.'
      ]},
    reveal:'Für ein einzelnes Photon ist jeder Filter eine **Messung** der Polarisation in seiner Basis. Ein senkrecht polarisiertes Photon passiert einen Filter unter dem Winkel $\\theta$ mit der Wahrscheinlichkeit $\\cos^2\\theta$. Das ist $|\\langle\\theta|{\\updownarrow}\\rangle|^2$, das Betragsquadrat einer Komponente. Kommt es durch, ist es danach im Zustand $|\\theta\\rangle$; die alte Information ist weg.\n\nOhne Mittelfilter ist $|\\langle{\\leftrightarrow}|{\\updownarrow}\\rangle|^2 = 0$. Mit Mittelfilter kommt $\\frac12\\cdot\\frac12 = \\frac14$ durch. Genau das beschreiben die Postulate dieses Themas: Zustand als Vektor, Wahrscheinlichkeit als Betragsquadrat einer Komponente, Zustand nach der Messung als Eigenvektor.'
  },
  teach:[
    {id:'form-t1', title:'Postulat 1: Zustände sind Vektoren',
      text:R`Du hast Zustände schon in drei Gestalten gesehen: als Funktion $\psi(x)$ (Thema 1), als Folge von Koeffizienten $c_n$ im Kasten (Thema 3) und als Funktion $\varphi(k)$ im Impulsraum (Thema 4). Alle drei beschreiben dasselbe. Man addiert Zustände, multipliziert sie mit komplexen Zahlen, und Überlagerungen interferieren. Das ist die Struktur eines [[lex:vektorraum|Vektorraums]] (M3).

**Postulat 1.** Der Zustand eines Systems ist ein normierter Vektor $|\psi\rangle$ in einem komplexen [[lex:hilbertraum|Hilbertraum]]. Vektoren, die sich nur um einen konstanten Faktor $e^{i\alpha}$ unterscheiden, beschreiben denselben Zustand. Eine Übersicht aller Postulate steht unter [[lex:postulate|Postulate der Quantenmechanik]].

Die Schreibweise $|\psi\rangle$ heißt **Ket**. Sie legt sich auf keine Darstellung fest. Erst eine Basis macht aus dem Ket konkrete Zahlen: in der Basis der Kasten-Eigenzustände die $c_n$, in der Ortsdarstellung die Werte $\psi(x)$.

Zu jedem Ket gehört ein **Bra** $\langle\phi|$: die Vorschrift „bilde das Skalarprodukt mit $|\phi\rangle$“. Bra und Ket zusammen ergeben eine Zahl, das [[lex:skalarprodukt|Skalarprodukt]]

$$\langle\phi|\psi\rangle = \sum_n\phi_n^*\psi_n\qquad\text{bzw.}\qquad \langle\phi|\psi\rangle = \int\phi^*(x)\,\psi(x)\,dx.$$

Im Bra steht immer das komplex Konjugierte. Daraus folgen die Rechenregeln der [[lex:dirac-notation|Dirac-Notation]]:

$$\langle\phi|\psi\rangle^* = \langle\psi|\phi\rangle,\qquad \langle\phi|c\,\psi\rangle = c\,\langle\phi|\psi\rangle,\qquad \langle c\,\phi|\psi\rangle = c^*\langle\phi|\psi\rangle.$$

Das Skalarprodukt ist linear im zweiten und antilinear im ersten Argument. Für $\phi = \psi$ ist $\langle\psi|\psi\rangle$ reell und nicht negativ: das Quadrat der Norm.

**Orthonormalbasis und Vollständigkeit.** Für eine [[lex:orthonormalbasis|Orthonormalbasis]] gilt $\langle m|n\rangle = \delta_{mn}$. Jeder Zustand lässt sich entwickeln, und die Komponenten sind Skalarprodukte:

$$|\psi\rangle = \sum_n c_n|n\rangle,\qquad c_n = \langle n|\psi\rangle.$$

Setzt du $c_n$ ein, steht da $|\psi\rangle = \sum_n|n\rangle\langle n|\psi\rangle$. Also ist $\sum_n|n\rangle\langle n| = \hat 1$, die **Vollständigkeitsrelation**. Mit ihr schiebst du an jeder Stelle eine Eins ein – das häufigste Rechenwerkzeug dieses Themas. So folgt etwa $\langle\phi|\psi\rangle = \sum_n\langle\phi|n\rangle\langle n|\psi\rangle = \sum_n\phi_n^*\psi_n$.

**Typischer Fehler:** das Konjugieren im Bra vergessen. Die Herleitung zeigt an zwei Vektoren, dass $\langle u|w\rangle$ und $\langle w|u\rangle$ verschieden sind.`,
      derive:{ctx:{rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}, states:{u:'(1; i)/sqrt(2)', w:'(2; 1)/sqrt(5)'}}, lines:[
        {l:'⟨u|w⟩ = (1, -i)/sqrt(2) (2; 1)/sqrt(5)', w:'Bra: transponieren und konjugieren',
          why:{q:'Warum steht im Bra $(1, -i)$ und nicht $(1, i)$?', opts:['Das Bra ist der konjugiert transponierte Ket: $i^* = -i$.', 'Das Vorzeichen ist Konvention; $(1, i)$ ginge genauso.', 'Im Bra wird stets der zweite Eintrag negativ genommen.'], a:0, ex:'Nur mit Konjugation ist $\\langle u|u\\rangle = |u_1|^2 + |u_2|^2 \\ge 0$.'}},
        {l:'= (2 - i)/sqrt(10)', w:'ausmultipliziert'},
        {l:'⟨w|u⟩ = (2 + i)/sqrt(10)', w:'= ⟨u|w⟩*',
          why:{q:'Welche Regel zeigt diese Zeile?', opts:['$\\langle w|u\\rangle = \\langle u|w\\rangle^*$', '$\\langle w|u\\rangle = \\langle u|w\\rangle$', '$\\langle w|u\\rangle = -\\langle u|w\\rangle$'], a:0, ex:'Vertauschen der Reihenfolge konjugiert das Skalarprodukt. Für reelle Vektoren merkt man davon nichts.'}},
        {l:'|⟨u|w⟩|^2 = 1/2', w:'reell und unabhängig von der Reihenfolge'}
      ]},
      q:[
        {q:'Was ist $\\langle 2\\phi|\\,3i\\,\\psi\\rangle$, ausgedrückt durch $\\langle\\phi|\\psi\\rangle$?', opts:['$6i\\,\\langle\\phi|\\psi\\rangle$', '$-6i\\,\\langle\\phi|\\psi\\rangle$', '$6\\,\\langle\\phi|\\psi\\rangle$'], a:0,
          ex:'Der Faktor im Bra wird konjugiert ($2^* = 2$), der im Ket bleibt: $2\\cdot3i = 6i$. Stünde $3i$ im Bra, käme $-3i$ heraus.'},
        {q:'$|\\psi\\rangle = \\sum_n c_n|n\\rangle$ in einer Orthonormalbasis. Wie bekommst du $c_3$?', opts:['$c_3 = \\langle 3|\\psi\\rangle$', '$c_3 = \\langle\\psi|3\\rangle$', '$c_3 = |\\langle 3|\\psi\\rangle|^2$'], a:0,
          ex:'$\\langle 3|\\psi\\rangle = \\sum_n c_n\\langle 3|n\\rangle = c_3$. Die Reihenfolge zählt: $\\langle\\psi|3\\rangle = c_3^*$.'}
      ]},
    {id:'form-t2', title:'Postulat 2: Messgrößen sind hermitesche Operatoren',
      text:R`Ein Operator $\hat A$ ordnet jedem Vektor linear einen Vektor zu. In einer Basis wird er zur Matrix mit den **Matrixelementen** $A_{mn} = \langle m|\hat A|n\rangle$.

**Adjungierter Operator.** Zu $\hat A$ gehört der [[lex:adjungierte|adjungierte]] Operator $\hat A^\dagger$, definiert durch

$$\langle\phi|\hat A\psi\rangle = \langle\hat A^\dagger\phi|\psi\rangle\quad\text{für alle }\phi, \psi.$$

Als Matrix ist $\hat A^\dagger$ die konjugiert Transponierte: $(A^\dagger)_{mn} = A_{nm}^*$. Es gilt $(\hat A\hat B)^\dagger = \hat B^\dagger\hat A^\dagger$ – die Reihenfolge dreht sich um.

**Postulat 2.** Jeder Messgröße entspricht ein [[lex:hermitescher-operator|hermitescher Operator]], $\hat A^\dagger = \hat A$. Man nennt ihn **Observable**.

Warum gerade hermitesch? Zwei Eigenschaften machen solche Operatoren passend.

1. *Eigenwerte sind reell.* Aus $\hat A|a\rangle = a|a\rangle$ folgt $\langle a|\hat Aa\rangle = a\langle a|a\rangle$ und $\langle\hat Aa|a\rangle = a^*\langle a|a\rangle$. Für hermitesches $\hat A$ sind beide gleich, also $a = a^*$. Messwerte sind reelle Zahlen.
2. *Eigenvektoren zu verschiedenen Eigenwerten sind orthogonal.* Aus $\langle a'|\hat Aa\rangle = \langle\hat Aa'|a\rangle$ folgt $(a - a')\langle a'|a\rangle = 0$, also $\langle a'|a\rangle = 0$ für $a \ne a'$. Verschiedene Messergebnisse gehören zu Zuständen, die sich gegenseitig ausschließen.

Außerdem bilden die Eigenvektoren einer Observablen eine vollständige Basis. Für hermitesche Matrizen ist das der Spektralsatz ([[lex:diagonalisierung|Diagonalisierung]], M4); in unendlich vielen Dimensionen fordert man es für Observable zusätzlich.

**Hermitesch in der Ortsdarstellung.** Für Differentialoperatoren zeigt man $\langle f|\hat Ag\rangle = \langle\hat Af|g\rangle$ durch partielle Integration. Die Randterme verschwinden, weil zulässige Funktionen im Unendlichen abfallen ([[lex:randterme-hermitesch|Randterme]], M5). Im Beispiel siehst du das für $\hat p$: Das $i$ in $-i\hbar\,d/dx$ ist nötig, denn $d/dx$ allein ist nicht hermitesch. Die Herleitung zeigt es für $\hat H = \hat p^2/2m + V$ mit reellem $V$, mit zweimaliger partieller Integration.

**Typischer Fehler:** hermitesch mit symmetrisch verwechseln. Eine komplexe Matrix ist hermitesch, wenn $A_{mn} = A_{nm}^*$ gilt; die Diagonale ist dann reell. $\begin{pmatrix}1 & i\\ i & 1\end{pmatrix}$ ist symmetrisch, aber nicht hermitesch. Hermitesch sind $\hat x$, $\hat p$, $\hat H$ und die Pauli-Matrizen; nicht hermitesch sind etwa $d/dx$ und $\begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$. Ausblick: In Thema 7 kommt mit dem Absteigeoperator des Oszillators ein wichtiger nicht hermitescher Operator hinzu.`,
      derive:{ctx:FORM_FG(), lines:[
        {l:'⟨f|Ĥ g⟩ = ∫_-∞^∞ f^* (-ħ^2/(2m) g\'\' + V g) dx', w:'Ortsdarstellung, Bra konjugiert',
          why:{q:'Was steht im Integral für das Bra $\\langle f|$?', opts:['$f^*$, die konjugierte Funktion', '$f$ ohne Konjugation', '$f\'$, die Ableitung von $f$'], a:0, ex:'Wie bei Vektoren wird im Bra konjugiert.'}},
        {l:'= ∫_-∞^∞ (-ħ^2/(2m) (f^*)\'\' + V f^*) g dx', w:'zweimal partiell integriert, Randterme 0',
          why:{q:'Warum ändert sich beim zweifachen partiellen Integrieren das Vorzeichen nicht?', opts:['Jede partielle Integration bringt ein Minus; zwei heben sich auf.', 'Partielle Integration ändert nie das Vorzeichen.', 'Weil das Potential $V$ reell ist.'], a:0, ex:'$\\int f^*g\'\'dx = -\\int (f^*)\'g\'dx = +\\int (f^*)\'\'g\\,dx$, solange die Randterme verschwinden.'}},
        {l:'= ∫_-∞^∞ (-ħ^2/(2m) f\'\' + V f)^* g dx', w:'V reell',
          why:{q:'Wo wird benutzt, dass $V$ reell ist?', opts:['$Vf^* = (Vf)^*$ gilt nur für reelles $V$.', 'beim partiellen Integrieren', 'Es wird nirgends benutzt.'], a:0, ex:'Ein komplexes Potential (etwa zur Beschreibung von Absorption) ist nicht hermitesch.'}},
        {l:'= ⟨Ĥ f|g⟩', w:'Definition des Skalarprodukts'}
      ]},
      q:[
        {q:'Ein Operator hat den Eigenwert $2 + i$. Was folgt?', opts:['Er ist nicht hermitesch und kann keine Messgröße sein.', 'Eine Messung liefert entweder den Wert $2$ oder den Wert $1$.', 'Eine Messung liefert den Betrag $|2 + i| = \\sqrt5$.'], a:0,
          ex:'Hermitesche Operatoren haben nur reelle Eigenwerte.'},
        {q:'$\\hat A$ und $\\hat B$ sind hermitesch. Ist $\\hat A\\hat B$ hermitesch?', opts:['nur wenn $\\hat A\\hat B = \\hat B\\hat A$', 'immer, als Produkt hermitescher Operatoren', 'nie, Produkte sind antihermitesch'], a:0,
          ex:'$(\\hat A\\hat B)^\\dagger = \\hat B^\\dagger\\hat A^\\dagger = \\hat B\\hat A$. Das ist genau dann $\\hat A\\hat B$, wenn die Operatoren vertauschen.'}
      ]},
    {id:'form-t3', title:'Postulate 3 und 4: Messwerte und ihre Wahrscheinlichkeiten',
      text:R`**Postulat 3.** Eine Messung von $\hat A$ liefert immer einen Eigenwert $a_n$ von $\hat A$ – nie etwas anderes.

**Postulat 4 (Born-Regel).** Entwickle den Zustand nach den normierten Eigenvektoren, $|\psi\rangle = \sum_n c_n|a_n\rangle$. Dann liefert die Messung den Wert $a_n$ mit der Wahrscheinlichkeit

$$P(a_n) = |c_n|^2 = |\langle a_n|\psi\rangle|^2.$$

Das ist das [[lex:messpostulat|Messpostulat]]. Du kennst es aus Thema 3 für die Energie im Kasten; hier gilt es für jede Observable. Die Wahrscheinlichkeiten summieren sich zu $\sum_n|c_n|^2 = \langle\psi|\psi\rangle = 1$ – deshalb müssen Zustände normiert sein.

**Entartung.** Gehören zu einem Eigenwert $a$ mehrere orthonormale Eigenvektoren $|a, 1\rangle, |a, 2\rangle, \dots$, dann ist $a$ **entartet**. Die Wahrscheinlichkeit ist die Summe über den ganzen Eigenraum: $P(a) = \sum_j|\langle a, j|\psi\rangle|^2$. Beispiel: $\hat A = \mathrm{diag}(1, 1, 2)$ und $|\psi\rangle = (1, i, 1)^T/\sqrt3$. Dann ist $P(1) = \frac13 + \frac13 = \frac23$ und $P(2) = \frac13$.

**Erwartungswert.** Misst du an vielen gleich präparierten Systemen, ist der Mittelwert der Ergebnisse

$$\langle A\rangle = \sum_n a_n\,|c_n|^2 = \langle\psi|\hat A|\psi\rangle.$$

Die zweite Form folgt aus $\hat A|\psi\rangle = \sum_n c_na_n|a_n\rangle$ und der Orthonormalität. Sie ist praktisch, weil du dafür die Eigenvektoren nicht brauchst. Die Herleitung rechnet beide Formen an einem Zustand im Kasten nach. Aus Thema 3 brauchst du dafür nur: Die Eigenzustände $|\psi_n\rangle$ erfüllen $\hat H|\psi_n\rangle = E_n|\psi_n\rangle$ mit $E_n = n^2E_1$, $n = 1, 2, 3, \dots$, und sie sind orthonormal. Ebenso ist die [[lex:unschaerfe|Unschärfe]] $\Delta A = \sqrt{\langle A^2\rangle - \langle A\rangle^2}$ mit $\langle A^2\rangle = \sum_na_n^2|c_n|^2$. In der Ortsdarstellung wird das Sandwich zu der Formel, die du aus Thema 1 kennst: $\langle\psi|\hat x|\psi\rangle = \int\psi^*x\,\psi\,dx$.

**Typische Fehlvorstellung:** „$\langle A\rangle$ ist das Ergebnis einer Messung.“ Eine einzelne Messung liefert einen Eigenwert. $\langle A\rangle$ ist der Mittelwert vieler Messungen und muss selbst kein Eigenwert sein. Im Labor neben dem Text kannst du das ausprobieren.

**Warum ein Postulat?** Die Born-Regel folgt nicht aus der Schrödingergleichung; sie kommt als eigene Annahme hinzu. Sie verbindet den Formalismus mit den Zählraten im Experiment. Gestützt wird sie dadurch, dass ihre Vorhersagen bisher in allen Experimenten stimmen – vom Doppelspalt bis zur Spektroskopie.`,
      fig:{lab:'measure', caption:'Jede Messung liefert einen der Eigenwerte 1, 2 oder 3, zufällig mit Wahrscheinlichkeit $|c_n|^2$. Der Mittelwert vieler Messungen nähert sich $\\langle A\\rangle$ – als Einzelergebnis kommt $\\langle A\\rangle$ im Allgemeinen nicht vor.'},
      derive:{ctx:FORM_BOX('(sqrt(3) ψ_1(x) + i ψ_3(x))/2'), lines:[
        {l:'|⟨ψ_1|Ψ⟩|^2 = 3/4', w:'Born-Regel',
          why:{q:'Welche Wahrscheinlichkeit gibt diese Zeile an?', opts:['die für das Messergebnis $E_1$', 'die für das Messergebnis $\\langle H\\rangle$', 'die dafür, dass das System schon in $|\\psi_1\\rangle$ ist'], a:0, ex:'Vor der Messung ist das System in der Überlagerung, nicht „eigentlich“ in $|\\psi_1\\rangle$.'}},
        {l:'Ĥ Ψ(x) = (sqrt(3) E_1 ψ_1(x) + 9i E_1 ψ_3(x))/2', w:'Ĥψₙ = Eₙψₙ mit E₃ = 9E₁',
          why:{q:'Warum ist $\\hat H|\\Psi\\rangle$ kein Vielfaches von $|\\Psi\\rangle$?', opts:['Die Anteile bekommen verschiedene Faktoren $E_n$.', 'Weil $\\hat H$ hier nicht hermitesch ist.', 'Weil $|\\Psi\\rangle$ noch nicht normiert ist.'], a:0, ex:'Nur Eigenzustände werden von $\\hat H$ auf ein Vielfaches abgebildet.'}},
        {l:'⟨Ψ|Ĥ|Ψ⟩ = (3 E_1 + 9 E_1)/4', w:'Bra mal Ket, ⟨ψₘ|ψₙ⟩ = δₘₙ'},
        {l:'= 3/4 E_1 + 1/4 · 9 E_1', w:'Eigenwerte mal Wahrscheinlichkeiten',
          why:{q:'Was zeigt diese Zeile?', opts:['$\\langle\\Psi|\\hat H|\\Psi\\rangle = \\sum_n E_n|c_n|^2$', 'Jede Energie kommt mit Wahrscheinlichkeit $1/2$.', 'Eine Messung liefert stets $3E_1$.'], a:0, ex:'Das Sandwich ist der mit $|c_n|^2$ gewichtete Mittelwert der Eigenwerte.'}},
        {l:'= 3 E_1', w:'kein Eigenwert: 3 ist keine Quadratzahl'}
      ]},
      q:[
        {q:'$|\\Psi\\rangle = (\\sqrt3|\\psi_1\\rangle + i|\\psi_3\\rangle)/2$ im Kasten. Welche Energien kann eine einzelne Messung liefern?', opts:['$E_1$ oder $9E_1$', 'nur den Wert $\\langle H\\rangle = 3E_1$', '$E_1$, $4E_1$ oder $9E_1$'], a:0,
          ex:'Nur Eigenwerte mit $c_n \\ne 0$ sind möglich. $|\\psi_2\\rangle$ kommt im Zustand nicht vor, also ist $E_2 = 4E_1$ ausgeschlossen.'}
      ]},
    {id:'form-t4', title:'Postulat 5: der Zustand nach der Messung',
      text:R`Misst du eine Größe zweimal kurz hintereinander, ist das zweite Ergebnis dasselbe wie das erste. So verhalten sich Experimente, etwa wiederholte Stern-Gerlach-Messungen (Thema 10). Das verlangt eine Regel für den Zustand *nach* der Messung.

**Postulat 5.** Liefert die Messung von $\hat A$ den Wert $a_n$, ist das System unmittelbar danach im zugehörigen Eigenzustand $|a_n\rangle$. Bei Entartung ist es die normierte Projektion von $|\psi\rangle$ auf den Eigenraum:

$$|\psi\rangle \;\longrightarrow\; \frac{\hat P_a|\psi\rangle}{\|\hat P_a|\psi\rangle\|},\qquad \hat P_a = \sum_j|a, j\rangle\langle a, j|.$$

Man nennt das [[lex:zustandsreduktion|Zustandsreduktion]] oder „Kollaps“. Danach entwickelt sich der neue Zustand wieder nach der Schrödingergleichung.

**Messfolgen.** Nimm zwei Observable: $\hat A$ mit Eigenvektoren $|1\rangle, |2\rangle$ und $\hat B$ mit Eigenvektoren $|\pm\rangle = (|1\rangle \pm |2\rangle)/\sqrt2$. Miss $A$ mit Ergebnis $a_1$: Der Zustand ist $|1\rangle$. Miss dann $B$: Beide Ergebnisse haben die Wahrscheinlichkeit $|\langle\pm|1\rangle|^2 = 1/2$, und der Zustand wird $|+\rangle$ oder $|-\rangle$. Miss wieder $A$: Mit Wahrscheinlichkeit $1/2$ kommt jetzt $a_2$. Die $B$-Messung hat das $A$-Ergebnis „gelöscht“ – wie der mittlere Polarisationsfilter.

**Einen Operator anwenden ist keine Messung.** Das ist eine der häufigsten Verwechslungen (Singh & Marshman 2015). $\hat A|\psi\rangle$ ist ein Rechenschritt, kein physikalischer Vorgang. Die Herleitung zeigt für den Kastenzustand $|\Psi\rangle = (|\psi_1\rangle + |\psi_2\rangle)/\sqrt2$, was $\hat H|\Psi\rangle$ ist:

- kein Eigenzustand, sondern eine andere Überlagerung, die $|\psi_2\rangle$ viermal so stark gewichtet wie $|\psi_1\rangle$ (wegen $E_2 = 4E_1$),
- nicht normiert, und es trägt die Einheit einer Energie,
- für jedes $|\Psi\rangle$ eindeutig bestimmt – eine Messung dagegen liefert zufällig $|\psi_1\rangle$ *oder* $|\psi_2\rangle$.

Der Zustand nach der Energiemessung ist $|\psi_1\rangle$ oder $|\psi_2\rangle$, je mit Wahrscheinlichkeit $1/2$. Durch Anwenden von $\hat H$ kann man ihn nicht ausrechnen.

**Zeitentwicklung nach der Messung.** Nach einer Energiemessung mit Ergebnis $E_n$ ist der Zustand stationär und bleibt $|\psi_n\rangle$ (bis auf eine Phase). Misst man dagegen eine andere Größe, deren Eigenzustände keine Energieeigenzustände sind, ist der Zustand danach im Allgemeinen nicht stationär und entwickelt sich weiter. Ein Beispiel dafür kennst du aus Thema 3: die Ortsmessung im Kasten.`,
      fig:{lab:'measure', init:{seq:true}, caption:'Unten: Messfolge an einem einzelnen System. Miss $A$ zweimal hintereinander – zweimal dasselbe Ergebnis. Miss $A$, dann $B$, dann wieder $A$: Das zweite $A$-Ergebnis ist wieder zufällig, denn die $B$-Messung hat den Zustand verändert.'},
      derive:{ctx:FORM_BOX('(ψ_1(x) + ψ_2(x))/sqrt(2)'), lines:[
        {l:'Ĥ Ψ(x) = (E_1 ψ_1(x) + 4 E_1 ψ_2(x))/sqrt(2)', w:'Ĥψₙ = Eₙψₙ, E₂ = 4E₁',
          why:{q:'Ist $\\hat H|\\Psi\\rangle$ der Zustand nach einer Energiemessung?', opts:['Nein; nach der Messung ist der Zustand $|\\psi_1\\rangle$ oder $|\\psi_2\\rangle$.', 'Ja, die Messung multipliziert den Zustand mit $\\hat H$.', 'Ja, sobald man das Ergebnis normiert.'], a:0, ex:'Normiert wäre $\\hat H|\\Psi\\rangle \\propto |\\psi_1\\rangle + 4|\\psi_2\\rangle$ – weder $|\\psi_1\\rangle$ noch $|\\psi_2\\rangle$.'}},
        {l:'⟨Ψ|Ĥ^2|Ψ⟩ = (1 + 16)/2 E_1^2', w:'Normquadrat von ĤΨ'},
        {l:'= 17/2 E_1^2', w:'≠ 1, Einheit Energie²',
          why:{q:'Was zeigt $\\|\\hat H\\Psi\\|^2 = \\tfrac{17}{2}E_1^2$?', opts:['$\\hat H|\\Psi\\rangle$ ist nicht normiert und hat die Einheit einer Energie.', 'Eine Messung liefert den Wert $\\sqrt{17/2}\\,E_1$.', 'Die Messung gelingt mit der Wahrscheinlichkeit $17/2$.'], a:0, ex:'Ein Zustand ist dimensionslos normiert. $\\langle H^2\\rangle$ braucht man für die Unschärfe, nicht für den Zustand nach der Messung.'}},
        {l:'|⟨ψ_2|Ψ⟩|^2 = 1/2', w:'Wahrscheinlichkeit für E₂'},
        {l:'ψ_2(x) ⟨ψ_2|Ψ⟩ = 1/sqrt(2) ψ_2(x)', w:'Projektion; normiert ergibt sie ψ₂',
          why:{q:'Wie wird aus der Projektion der Zustand nach der Messung?', opts:['durch Normieren: $\\tfrac{1}{\\sqrt2}|\\psi_2\\rangle \\to |\\psi_2\\rangle$', 'durch Anwenden von $\\hat H$ auf die Projektion', 'gar nicht, die Projektion ist schon der Zustand'], a:0, ex:'Die Norm der Projektion, $1/\\sqrt2$, ist die Wurzel aus der Wahrscheinlichkeit des Ergebnisses.'}}
      ]},
      q:[
        {q:'$\\hat A = \\mathrm{diag}(1, 1, 2)$ und $|\\psi\\rangle = (1, i, 1)^T/\\sqrt3$. Die Messung von $\\hat A$ liefert $1$. Welcher Zustand liegt danach vor?', opts:['$(1, i, 0)^T/\\sqrt2$', '$(1, 0, 0)^T$ oder $(0, 1, 0)^T$, je mit Wahrscheinlichkeit $1/2$', '$(1, i, 1)^T/\\sqrt3$, denn der Eigenwert 1 ist entartet'], a:0,
          ex:'Bei Entartung projiziert man auf den ganzen Eigenraum und normiert: $\\hat P_1|\\psi\\rangle = (1, i, 0)^T/\\sqrt3$, normiert $(1, i, 0)^T/\\sqrt2$. Die relative Phase $i$ zwischen den Komponenten bleibt erhalten. Eine sofort wiederholte $A$-Messung liefert sicher wieder $1$.'}
      ]},
    {id:'form-t5', title:'Kontinuierliche Spektren: Ort, Impuls und δ-Normierung',
      text:R`Der Impulsoperator $\hat p = -i\hbar\,d/dx$ hat für jedes reelle $p$ die Eigenfunktion

$$f_p(x) = \frac{1}{\sqrt{2\pi\hbar}}\,e^{ipx/\hbar},\qquad \hat pf_p = p\,f_p.$$

Das Spektrum ist **kontinuierlich**. Die $f_p$ sind nicht normierbar (Thema 4), also keine Zustände im Hilbertraum. Man normiert sie stattdessen auf eine δ-Funktion:

$$\langle f_{p'}|f_p\rangle = \frac{1}{2\pi\hbar}\int e^{i(p - p')x/\hbar}\,dx = \delta(p - p').$$

Das ist die [[lex:delta-normierung|δ-Normierung]]. Aus dem Kronecker-Delta $\delta_{mn}$ wird die [[lex:delta-distribution|δ-Distribution]], aus Summen werden Integrale.

**Entwicklung und Wahrscheinlichkeit.** Jeder normierbare Zustand lässt sich nach den $f_p$ entwickeln:

$$\psi(x) = \int\tilde\psi(p)\,f_p(x)\,dp,\qquad \tilde\psi(p) = \langle f_p|\psi\rangle = \frac{1}{\sqrt{2\pi\hbar}}\int e^{-ipx/\hbar}\psi(x)\,dx.$$

Das ist die Fourier-Transformation aus Thema 4, jetzt mit $p$ statt $k$: $\tilde\psi(p) = \varphi(p/\hbar)/\sqrt\hbar$. Die Born-Regel wird zur **verallgemeinerten statistischen Deutung**: $|\tilde\psi(p)|^2\,dp$ ist die Wahrscheinlichkeit, einen Impuls in $[p, p + dp]$ zu messen. Statt einzelner Wahrscheinlichkeiten $|c_n|^2$ gibt es eine Dichte. Einen exakten Wert $p_0$ trifft man mit Wahrscheinlichkeit null. Erwartungswerte werden zu Integralen: $\langle p\rangle = \int p\,|\tilde\psi(p)|^2dp$. Für das Gauß-Paket aus Thema 4 ist $|\tilde\psi(p)|^2$ eine Gauß-Kurve der Breite $\hbar/(2\sigma)$.

**Ort.** Die Eigenfunktionen von $\hat x$ zum Eigenwert $y$ sind $g_y(x) = \delta(x - y)$, denn $x\,\delta(x - y) = y\,\delta(x - y)$. Die Komponente von $\psi$ in dieser „Basis“ ist (Herleitung)

$$\langle g_y|\psi\rangle = \int\delta(x - y)\,\psi(x)\,dx = \psi(y).$$

Die Wellenfunktion besteht also aus den Komponenten des Kets in der Ortsbasis: $\psi(x) = \langle x|\psi\rangle$ und $\tilde\psi(p) = \langle p|\psi\rangle$. Die Bornsche Regel aus Thema 1 ist der Spezialfall $|\langle x|\psi\rangle|^2$.

**Vorsicht beim Messen.** Nach einer idealen Ortsmessung wäre der Zustand $\delta(x - y)$, also nicht normierbar. Reale Messungen haben eine endliche Auflösung; der Zustand danach ist schmal, aber normierbar.

**Gemischte Spektren** gibt es auch. Der endliche Topf (Thema 5) hat einzelne gebundene Energien $E < 0$ und darüber ein Kontinuum von Streuzuständen. Eine Entwicklung braucht dann eine Summe und ein Integral.`,
      fig:{lab:'delta', init:{eps:0.15}, caption:'Eine schmale Funktion $\\delta_\\varepsilon$ mit Fläche 1: $\\int\\delta_\\varepsilon(x - a)f(x)\\,dx$ ist fast $f(a)$. Für $\\varepsilon \\to 0$ (Regler unter „Mehr Regler“) entsteht die δ-Distribution. Ein Ortseigenzustand wäre eine solche unendlich schmale Spitze – nicht normierbar, wie die ebene Welle.'},
      derive:{ctx:{coords:['x'], params:{σ:'pos', y:'real', p:'real'}, defs:{'ψ(x)':'(2πσ^2)^(-1/4) e^(-x^2/(4σ^2))', 'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)'}}, lines:[
        {l:'-iħ d/dx e^(i p x/ħ) = p e^(i p x/ħ)', w:'Eigenfunktion von p̂',
          why:{q:'Zu welchem Eigenwert gehört $e^{ipx/\\hbar}$?', opts:['zum Impuls $p$', 'zum Impuls $-p$', 'zum Impuls $p/\\hbar$'], a:0, ex:'$-i\\hbar\\cdot\\frac{ip}{\\hbar} = p$.'}},
        {l:'∫_-∞^∞ δ(x - y) ψ(x) dx = ψ(y)', w:'Komponente in der Ortsbasis',
          why:{q:'Was bedeutet diese Zeile?', opts:['$\\psi(y)$ ist die Komponente von $|\\psi\\rangle$ beim Ortseigenzustand $y$.', 'Die Wellenfunktion $\\psi$ verschwindet an der Stelle $y$.', 'Die Wahrscheinlichkeit, das Teilchen bei $y$ zu finden, ist $\\psi(y)$.'], a:0, ex:'Wahrscheinlichkeitsdichte ist $|\\psi(y)|^2$, nicht $\\psi(y)$.'}},
        {l:'1/sqrt(2πħ) ∫_-∞^∞ e^(-ipx/ħ) ψ(x) dx = 1/sqrt(ħ) φ(p/ħ)', w:'Impulsamplitude = Fourier-Transformierte aus Thema 4',
          why:{q:'Woher kommt der Faktor $1/\\sqrt\\hbar$?', opts:['Er sorgt für $\\int|\\tilde\\psi|^2dp = 1$, denn $dp = \\hbar\\,dk$.', 'aus der Ableitung von $e^{-ipx/\\hbar}$ nach $p$', 'Er ist reine Konvention und könnte auch fehlen.'], a:0, ex:'$\\int|\\tilde\\psi(p)|^2dp = \\int\\frac{1}{\\hbar}|\\varphi(p/\\hbar)|^2dp = \\int|\\varphi(k)|^2dk = 1$.'}}
      ]},
      q:[
        {q:'Warum ist $f_p(x) = e^{ipx/\\hbar}/\\sqrt{2\\pi\\hbar}$ kein möglicher Zustand eines Teilchens?', opts:['$\\int|f_p|^2dx$ divergiert; $f_p$ ist nicht normierbar.', 'Weil $f_p$ eine komplexe Funktion ist.', 'Weil $f_p$ keine Eigenfunktion von $\\hat p$ ist.'], a:0,
          ex:'$|f_p|^2 = 1/(2\\pi\\hbar)$ ist überall gleich. Physikalische Zustände sind Überlagerungen, also Wellenpakete.'},
        {q:'Was ist die Wahrscheinlichkeit, bei einer Impulsmessung *genau* den Wert $p_0$ zu finden?', opts:['null; nur Intervalle haben eine Wahrscheinlichkeit', '$|\\tilde\\psi(p_0)|^2$, der Wert der Dichte an dieser Stelle', '$|\\tilde\\psi(p_0)|$, der Betrag der Amplitude dort'], a:0,
          ex:'$|\\tilde\\psi|^2$ ist eine Dichte mit der Einheit 1/Impuls. Wahrscheinlichkeit ist $\\int_{p_1}^{p_2}|\\tilde\\psi|^2dp$.'}
      ]},
    {id:'form-t6', title:'Kommutatoren, verträgliche Observable und die Unschärferelation',
      text:R`Der [[lex:kommutator|Kommutator]] $[\hat A, \hat B] = \hat A\hat B - \hat B\hat A$ misst, ob die Reihenfolge zählt. Der wichtigste ist $[\hat x, \hat p] = i\hbar$; die Herleitung wendet ihn auf eine Testfunktion an. Rechenregeln: $[\hat A, \hat B] = -[\hat B, \hat A]$ und $[\hat A, \hat B\hat C] = [\hat A, \hat B]\hat C + \hat B[\hat A, \hat C]$.

**Verträgliche Observable.** Gilt $[\hat A, \hat B] = 0$, haben $\hat A$ und $\hat B$ eine gemeinsame Eigenbasis. Für einen nicht entarteten Eigenwert siehst du das direkt: Aus $\hat A|a\rangle = a|a\rangle$ folgt $\hat A(\hat B|a\rangle) = \hat B\hat A|a\rangle = a\,\hat B|a\rangle$. Also ist $\hat B|a\rangle$ Eigenvektor zu $a$ und damit ein Vielfaches von $|a\rangle$. Beide Größen sind dann gleichzeitig scharf messbar, und eine $B$-Messung zerstört ein $A$-Ergebnis nicht.

**Achtung, Entartung.** Ist $a$ entartet, ist nicht *jeder* Eigenvektor von $\hat A$ auch einer von $\hat B$. Beispiel freies Teilchen: $[\hat H, \hat p] = 0$, aber $\cos kx$ ist Eigenfunktion von $\hat H$ und keine von $\hat p$. Es gibt nur eine gemeinsame Basis ($e^{\pm ikx}$), die man gezielt wählen muss. Mehr unter [[lex:vertraegliche-observable|verträgliche Observable]].

**Robertson-Unschärferelation.** Für beliebige Observable gilt in jedem Zustand

$$\Delta A\,\Delta B \ge \frac12\left|\langle[\hat A, \hat B]\rangle\right|.$$

Herleitung in vier Schritten:

1. Setze $|f\rangle = (\hat A - \langle A\rangle)|\psi\rangle$ und $|g\rangle = (\hat B - \langle B\rangle)|\psi\rangle$. Weil $\hat A$ hermitesch ist, gilt $\langle f|f\rangle = (\Delta A)^2$; ebenso $\langle g|g\rangle = (\Delta B)^2$.
2. [[lex:cauchy-schwarz|Cauchy-Schwarz]] (M3): $\langle f|f\rangle\langle g|g\rangle \ge |\langle f|g\rangle|^2$.
3. Eine komplexe Zahl ist betragsmäßig mindestens so groß wie ihr Imaginärteil, und $\mathrm{Im}\,z = (z - z^*)/2i$.
4. Ausmultiplizieren: $\langle f|g\rangle - \langle g|f\rangle = \langle AB\rangle - \langle BA\rangle = \langle[\hat A, \hat B]\rangle$.

Die Herleitung prüft die Schritte 2 und 3 für beliebige Funktionen. Mit $[\hat x, \hat p] = i\hbar$ folgt $\Delta x\,\Delta p \ge \hbar/2$ für jeden Zustand ([[lex:robertson|Robertson]]).

**Deutung.** $\Delta A$ und $\Delta B$ sind Streuungen von Messreihen an vielen gleich präparierten Systemen. Die Relation sagt: Es gibt keinen Zustand, in dem beide Streuungen beliebig klein sind. Sie handelt nicht von der Ungenauigkeit eines Messgeräts.`,
      derive:{ctx:{coords:['x'], params:{}, abstract:{f:{args:['x']}, g:{args:['x']}}}, lines:[
        {l:'[x̂, p̂] f = x (-iħ f\') - (-iħ)(x f)\'', w:'auf eine Testfunktion angewandt'},
        {l:'= iħ f', w:'Produktregel: (xf)′ = f + xf′',
          why:{q:'Welcher Term bleibt nach der Produktregel übrig?', opts:['$i\\hbar f$, aus der Ableitung von $x$', '$-i\\hbar x f\'$, aus der Ableitung von $f$', 'keiner, $\\hat x$ und $\\hat p$ vertauschen'], a:0, ex:'Die Terme $\\mp i\\hbar xf\'$ heben sich weg; übrig bleibt der Beitrag der Ableitung von $x$.'}},
        {l:'⟨f|f⟩ ⟨g|g⟩ ≥ |⟨f|g⟩|^2', w:'Cauchy-Schwarz',
          why:{q:'Wann gilt in Cauchy-Schwarz das Gleichheitszeichen?', opts:['wenn $|g\\rangle$ ein Vielfaches von $|f\\rangle$ ist', 'wenn $\\langle f|g\\rangle = 0$ ist', 'nie, es gilt immer das Größerzeichen'], a:0, ex:'Gleichheit bei parallelen Vektoren. Zustände minimaler Unschärfe erfüllen deshalb $(\\hat B - \\langle B\\rangle)\\psi = c\\,(\\hat A - \\langle A\\rangle)\\psi$, und zwar mit rein imaginärem $c$: Sonst bliebe der Realteil von $\\langle f|g\\rangle$, und die nächste Ungleichung wäre nicht scharf. Das Gauß-Paket ist ein Beispiel.'}},
        {l:'|⟨f|g⟩|^2 ≥ Im(⟨f|g⟩)^2', w:'|z|² = (Re z)² + (Im z)²',
          why:{q:'Warum gilt diese Ungleichung?', opts:['$|z|^2 = (\\mathrm{Re}\\,z)^2 + (\\mathrm{Im}\\,z)^2 \\ge (\\mathrm{Im}\\,z)^2$', 'weil $\\langle f|g\\rangle$ immer reell ist', 'weil $\\mathrm{Im}\\,z$ immer positiv ist'], a:0, ex:'Der Realteil wird einfach weggelassen; deshalb ist die Robertson-Relation nicht immer scharf.'}},
        {l:'Im(⟨f|g⟩) = (⟨f|g⟩ - ⟨g|f⟩)/(2i)', w:'⟨g|f⟩ = ⟨f|g⟩*',
          why:{q:'Welche Regel steckt in dieser Zeile?', opts:['$\\langle g|f\\rangle = \\langle f|g\\rangle^*$ und $z - z^* = 2i\\,\\mathrm{Im}\\,z$', '$\\langle g|f\\rangle = -\\langle f|g\\rangle$ für alle Vektoren', '$\\langle g|f\\rangle = \\langle f|g\\rangle$ für alle Vektoren'], a:0, ex:'Mit Schritt 4 wird daraus $\\langle[\\hat A, \\hat B]\\rangle/2i$.'}}
      ]},
      q:[
        {q:'$\\hat A = \\mathrm{diag}(1, 1, 2)$ und $\\hat B = \\mathrm{diag}(3, 4, 5)$ vertauschen. Ist $(1, 1, 0)^T$ ein Eigenvektor von $\\hat B$?', opts:['Nein; er gehört zum entarteten Eigenwert 1 von $\\hat A$.', 'Ja, weil $\\hat A$ und $\\hat B$ miteinander vertauschen.', 'Ja, weil beide Matrizen diagonal sind.'], a:0,
          ex:'$\\hat B(1, 1, 0)^T = (3, 4, 0)^T$ ist kein Vielfaches. Gemeinsame Eigenbasis ist die Standardbasis; im entarteten Eigenraum muss man sie gezielt wählen.'},
        {q:'Ein Zustand hat $\\Delta x = 0{,}1\\,\\mathrm{nm}$. Was folgt für $\\Delta p$?', opts:['$\\Delta p \\ge \\hbar/(0{,}2\\,\\mathrm{nm})$', '$\\Delta p \\le \\hbar/(0{,}2\\,\\mathrm{nm})$', '$\\Delta p = \\hbar/(0{,}2\\,\\mathrm{nm})$'], a:0,
          ex:'Robertson gibt eine untere Schranke. Gleichheit gilt nur für Zustände minimaler Unschärfe wie das Gauß-Paket.'}
      ]},
    {id:'form-t7', title:'Postulat 6: Zeitentwicklung, Ehrenfest und Energie-Zeit-Unschärfe',
      text:R`**Postulat 6.** Zwischen Messungen entwickelt sich der Zustand nach der Schrödingergleichung $i\hbar\frac{d}{dt}|\psi(t)\rangle = \hat H|\psi(t)\rangle$. In der Energiebasis bekommt jede Komponente ihren Phasenfaktor: $c_n(t) = c_n(0)\,e^{-iE_nt/\hbar}$ (Thema 3).

**Wie ändern sich Erwartungswerte?** Leite $\langle A\rangle = \langle\psi|\hat A\psi\rangle$ nach der Zeit ab und setze $|\dot\psi\rangle = \hat H|\psi\rangle/(i\hbar)$ ein. Im Bra wird der Faktor konjugiert: $1/(i\hbar)^* = -1/(i\hbar)$. Für ein $\hat A$ ohne explizite Zeitabhängigkeit bleibt

$$\frac{d}{dt}\langle A\rangle = \frac{1}{i\hbar}\left(\langle\psi|\hat A\hat H\psi\rangle - \langle\hat H\psi|\hat A\psi\rangle\right) = \frac{i}{\hbar}\langle[\hat H, \hat A]\rangle.$$

Im letzten Schritt geht ein, dass $\hat H$ hermitesch ist. Das ist das [[lex:ehrenfest|Ehrenfest-Theorem]]. Zwei Folgerungen:

1. **Erhaltungsgrößen.** Vertauscht $\hat A$ mit $\hat H$, ist $\langle A\rangle$ in jedem Zustand konstant. Beim freien Teilchen ist $[\hat H, \hat p] = 0$; $\langle p\rangle$ und die ganze Impulsverteilung bleiben gleich (Thema 4).
2. **Klassische Grenze.** Mit $[\hat H, \hat x] = -i\hbar\hat p/m$ und $[\hat H, \hat p] = i\hbar V'(\hat x)$ (Herleitung) folgt $\frac{d}{dt}\langle x\rangle = \langle p\rangle/m$ und $\frac{d}{dt}\langle p\rangle = -\langle V'(x)\rangle$. Das sieht aus wie Newton. Im Allgemeinen ist aber $\langle V'(x)\rangle \ne V'(\langle x\rangle)$. Nur wenn das Paket schmal ist gegen die Länge, auf der sich $V'$ ändert, folgt $\langle x\rangle$ der klassischen Bahn.

**Energie-Zeit-Unschärfe.** Die Zeit ist in der Quantenmechanik ein Parameter, kein Operator. Eine Relation $\Delta E\,\Delta t \ge \hbar/2$ gilt deshalb nicht im selben Sinn wie für $x$ und $p$. Eine genaue Fassung erhältst du aus Robertson mit $\hat B = \hat H$ und dem Ehrenfest-Theorem:

$$\Delta H\,\Delta A \ge \frac12\left|\langle[\hat H, \hat A]\rangle\right| = \frac\hbar2\left|\frac{d\langle A\rangle}{dt}\right|.$$

Definiere $\Delta t_A = \Delta A/|d\langle A\rangle/dt|$, die Zeit, in der sich $\langle A\rangle$ um eine Standardabweichung ändert. Dann gilt $\Delta H\,\Delta t_A \ge \hbar/2$ ([[lex:energie-zeit-unschaerfe|Energie-Zeit-Unschärfe]]). Deutung: Ein Zustand mit scharfer Energie ($\Delta H = 0$) ändert sich nicht, er ist stationär. Schnelle Änderung verlangt eine breite Energieverteilung. Verwandt, aber eine eigene Aussage: Ein exponentiell zerfallender Zustand mit Lebensdauer $\tau$ hat eine Spektrallinie der Breite $\Gamma = \hbar/\tau$.`,
      derive:{ctx:FORM_FG(), lines:[
        {l:'[Ĥ, p̂] f = V (-iħ f\') - (-iħ)(V f)\'', w:'p̂²/2m vertauscht mit p̂',
          why:{q:'Warum taucht der kinetische Anteil $\\hat p^2/2m$ nicht auf?', opts:['$\\hat p^2$ vertauscht mit $\\hat p$.', 'Er ist klein gegen das Potential $V$.', 'Er hebt sich erst nach Integration weg.'], a:0, ex:'$[\\hat p^2, \\hat p] = \\hat p^3 - \\hat p^3 = 0$.'}},
        {l:'= iħ V\' f', w:'Produktregel',
          why:{q:'Was bleibt nach der Produktregel übrig?', opts:['nur der Term, in dem die Ableitung auf $V$ wirkt', 'nur der Term, in dem die Ableitung auf $f$ wirkt', 'nichts, der Kommutator ist null'], a:0, ex:'Damit wird $\\frac{d}{dt}\\langle p\\rangle = \\frac{i}{\\hbar}\\langle i\\hbar V\'\\rangle = -\\langle V\'\\rangle$.'}},
        {l:'[Ĥ, x̂] f = -ħ^2/(2m) (x f)\'\' + ħ^2/(2m) x f\'\'', w:'V vertauscht mit x̂'},
        {l:'= -ħ^2/m f\'', w:'(xf)″ = 2f′ + xf″'},
        {l:'= -iħ/m p̂ f', w:'−ħ²f′ = −iħ·(−iħ f′)',
          why:{q:'Was folgt daraus mit Ehrenfest?', opts:['$\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m$', '$\\frac{d}{dt}\\langle x\\rangle = 0$', '$\\frac{d}{dt}\\langle x\\rangle = -\\langle p\\rangle/m$'], a:0, ex:'$\\frac{i}{\\hbar}\\cdot\\left(-\\frac{i\\hbar}{m}\\langle p\\rangle\\right) = \\langle p\\rangle/m$. Übungsaufgabe 4 leitet dasselbe direkt aus der Schrödingergleichung her.'}}
      ]},
      q:[
        {q:'Ein Operator $\\hat A$ vertauscht mit $\\hat H$. Was folgt?', opts:['$\\langle A\\rangle$ ist in jedem Zustand zeitlich konstant.', '$\\langle A\\rangle$ ist in jedem Zustand null.', 'Jeder Zustand ist Eigenzustand von $\\hat A$.'], a:0,
          ex:'$\\frac{d}{dt}\\langle A\\rangle = \\frac{i}{\\hbar}\\langle[\\hat H, \\hat A]\\rangle = 0$. Das ist die quantenmechanische Form eines Erhaltungssatzes.'},
        {q:'Ein Zustand hat eine scharfe Energie ($\\Delta H = 0$). Was sagt die Energie-Zeit-Relation?', opts:['Kein Erwartungswert ändert sich: Der Zustand ist stationär.', 'Eine Energiemessung an ihm dauert unendlich lange.', 'Der Zustand zerfällt sofort, weil $\\Delta t = 0$ ist.'], a:0,
          ex:'$\\Delta H\\,\\Delta t_A \\ge \\hbar/2$ mit $\\Delta H = 0$ verlangt $\\Delta t_A = \\infty$, also $d\\langle A\\rangle/dt = 0$ für jede Observable.'}
      ]}
  ],
  example:{
    title:'$\\hat p$ ist hermitesch',
    text:'Zeige für zwei Funktionen $f, g$, die im Unendlichen verschwinden: $\\langle f|\\hat p\\,g\\rangle = \\langle\\hat p\\,f|g\\rangle$ mit $\\hat p = -i\\hbar\\,d/dx$.',
    ctx:FORM_FG(),
    lines:[
      {l:'⟨f|p̂ g⟩ = ∫_-∞^∞ f^* (-iħ) g\' dx', why:{q:'Was bedeutet $\\langle f|\\hat p g\\rangle$ in der Ortsdarstellung?', opts:['$\\int f^*(x)\\,(\\hat p g)(x)\\,dx$', '$\\int f(x)\\,(\\hat p g)(x)\\,dx$', '$f^*(0)\\,(\\hat p g)(0)$'], a:0, ex:'Das Bra wird komplex konjugiert, dann wird über $x$ integriert.'}},
      {l:'= iħ ∫_-∞^∞ (f^*)\' g dx', w:'partiell integriert, Randterm 0', why:{q:'Warum verschwindet der Randterm $-i\\hbar[f^*g]_{-\\infty}^{\\infty}$?', opts:['$f$ und $g$ gehen im Unendlichen gegen 0.', 'Weil $\\hbar$ sehr klein ist.', 'Weil das Integral reell ist.'], a:0, ex:'Normierbare Funktionen fallen ab; deshalb ist $[f^*g]_{-\\infty}^\\infty = 0$.'}},
      {l:'= ∫_-∞^∞ (-iħ f\')^* g dx', why:{q:'Wie wurde umgeformt?', opts:['$i\\hbar (f^*)\' = (-i\\hbar f\')^*$, weil $i^* = -i$', 'Die Ableitung wurde auf $g$ verschoben.', 'Beide Seiten wurden mit $-1$ multipliziert.'], a:0, ex:'Konjugieren dreht das Vorzeichen von $i$; die Ableitung vertauscht mit der Konjugation.'}},
      {l:'= ⟨p̂ f|g⟩', why:{q:'Was ist damit gezeigt?', opts:['$\\hat p^\\dagger = \\hat p$: $\\hat p$ ist hermitesch.', '$\\hat p$ hat nur reelle Matrixelemente.', '$f$ und $g$ sind zueinander orthogonal.'], a:0, ex:'Ein Operator mit $\\langle f|\\hat A g\\rangle = \\langle\\hat A f|g\\rangle$ für alle zulässigen $f, g$ heißt hermitesch. Ohne das $i$ in $\\hat p$ ginge es nicht: $d/dx$ allein ist antihermitesch.'}}
    ],
    faded:{id:'form-fade', title:'Jetzt du: der Kommutator $[\\hat x, \\hat p^2]$', text:'Wende $[\\hat x, \\hat p^2]$ auf eine Testfunktion $f$ an und zeige $[\\hat x, \\hat p^2]f = 2i\\hbar\\,\\hat p f$.',
      ctx:FORM_FG(),
      given:['[x̂, p̂^2] f = x̂ p̂^2 f - p̂^2 x̂ f', '= -ħ^2 x f\'\' + ħ^2 (x f)\'\''],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'show', from:'[x̂, p̂^2] f', to:'2iħ p̂ f',
        hints:['Ziel ist $2i\\hbar\\hat pf$: Rechne $(xf)\'\'$ aus und fasse die Terme zusammen.', 'Produktregel zweimal: $(xf)\'\' = 2f\' + xf\'\'$.', 'Am Ende: $2\\hbar^2 f\' = 2i\\hbar\\,(-i\\hbar f\')$.'],
        model:['[x̂, p̂^2] f = x̂ p̂^2 f - p̂^2 x̂ f', '= -ħ^2 x f\'\' + ħ^2 (x f)\'\'', {l:'= -ħ^2 x f\'\' + ħ^2 (2 f\' + x f\'\')', gap:'= -ħ^2 x f\'\' + ħ^2 (▢)'}, '= 2ħ^2 f\'', '= 2iħ (-iħ f\')']}]}
  },
  puzzle:{
    title:'Viele Filter statt einem',
    text:'Im Versuch mit den drei Polarisationsfiltern ersetzt du den $45°$-Filter durch $N - 1$ Filter. Auf den senkrechten Filter ($0°$) folgen also $N$ Filter, jeder um $90°/N$ weiter gedreht als der vorige; der letzte steht waagerecht ($90°$). Für $N = 2$ ist das genau der Versuch vom Anfang.',
    q:{q:'Was passiert mit der Wahrscheinlichkeit, dass ein senkrecht polarisiertes Photon alle Filter passiert, wenn $N$ sehr groß wird?', opts:['Sie geht gegen 0, weil jeder Filter etwas wegnimmt.', 'Sie geht gegen 1.', 'Sie bleibt bei $1/4$, wie mit einem Mittelfilter.', 'Sie geht gegen $1/2$.'], a:1, ex:'$P_N = \\left(\\cos^2\\frac{\\pi}{2N}\\right)^N \\to 1$.'},
    reveal:'Jeder Filter ist eine Messung in einer um $\\theta = 90°/N$ gedrehten Basis. Ein Photon, das den vorigen Filter passiert hat, ist in dessen Zustand und kommt mit der Wahrscheinlichkeit $\\cos^2\\theta$ durch den nächsten. Insgesamt\n\n$$P_N = \\left(\\cos^2\\frac{\\pi}{2N}\\right)^N:\\qquad P_1 = 0,\\quad P_2 = \\tfrac14,\\quad P_3 \\approx 0{,}42,\\quad P_{10} \\approx 0{,}78,\\quad P_{100} \\approx 0{,}98.$$\n\nFür großes $N$ ist $\\cos^2\\theta \\approx 1 - \\theta^2$, also $\\ln P_N \\approx -N\\theta^2 = -\\frac{\\pi^2}{4N} \\to 0$. Viele kleine Messschritte „ziehen“ die Polarisation mit, fast ohne Verlust – obwohl ohne Zwischenfilter gar nichts durchkommt.\n\nFür klassisches Licht folgt dasselbe aus dem Gesetz von Malus. Quantenmechanisch heißt es: Jedes einzelne Photon kommt mit der Wahrscheinlichkeit $P_N$ durch. Verwandt ist der **Quanten-Zeno-Effekt**: Häufige Messungen können die Änderung eines Zustands unterdrücken oder ihn, wie hier, gezielt mitführen. (Vorausgesetzt sind ideale Filter; reale Filter schwächen auch die durchgelassene Polarisation etwas.)'
  },
  clarify:{
    core:'Zustände sind Vektoren $|\\psi\\rangle$ in einem Hilbertraum. Messgrößen sind **hermitesche Operatoren** $\\hat A = \\hat A^\\dagger$; ihre Eigenwerte $a_n$ sind reell, Eigenvektoren zu verschiedenen Eigenwerten orthogonal.\n\nEntwickelt man $|\\psi\\rangle = \\sum_n c_n|a_n\\rangle$ mit $c_n = \\langle a_n|\\psi\\rangle$, dann gilt das **Messpostulat**: Eine Messung liefert $a_n$ mit Wahrscheinlichkeit $|c_n|^2$, danach ist der Zustand $|a_n\\rangle$. Bei kontinuierlichem Spektrum wird $|c_n|^2$ zur Dichte, etwa $|\\langle p|\\psi\\rangle|^2$.\n\nDaraus folgen Erwartungswert und Robertson-Relation:\n\n$$\\langle A\\rangle = \\langle\\psi|\\hat A|\\psi\\rangle = \\sum_n a_n|c_n|^2,\\qquad \\Delta A\\,\\Delta B \\ge \\tfrac12\\left|\\langle[\\hat A,\\hat B]\\rangle\\right|.$$',
    keys:[
      'Im Bra wird konjugiert: $\\langle\\phi|\\psi\\rangle = \\int\\phi^*\\psi\\,dx = \\sum_k\\phi_k^*\\psi_k$, und $\\langle\\phi|\\psi\\rangle = \\langle\\psi|\\phi\\rangle^*$.',
      'Adjungieren dreht die Reihenfolge um: $(\\hat A\\hat B)^\\dagger = \\hat B^\\dagger\\hat A^\\dagger$, und $(c\\hat A)^\\dagger = c^*\\hat A^\\dagger$.',
      'Kommutatorregeln: $[\\hat A,\\hat B\\hat C] = [\\hat A,\\hat B]\\hat C + \\hat B[\\hat A,\\hat C]$; damit $[\\hat x,\\hat p^n] = i\\hbar n\\hat p^{n-1}$.',
      'Vertauschen zwei Observablen, gibt es eine gemeinsame Eigenbasis; sie sind gleichzeitig scharf messbar. Bei Entartung ist aber nicht jeder Eigenvektor des einen auch einer des anderen.',
      'Ehrenfest: $\\frac{d}{dt}\\langle A\\rangle = \\frac{i}{\\hbar}\\langle[\\hat H, \\hat A]\\rangle$; daraus $\\frac{d}{dt}\\langle x\\rangle = \\frac{\\langle p\\rangle}{m}$ und $\\frac{d}{dt}\\langle p\\rangle = -\\langle V\'(x)\\rangle$.',
      'Einen Operator anwenden ist keine Messung: $\\hat A|\\psi\\rangle$ ist im Allgemeinen weder normiert noch ein Eigenzustand.'
    ],
    errors:[
      '$\\langle A\\rangle = \\sum a_n c_n$ statt $\\sum a_n|c_n|^2$: Wahrscheinlichkeiten sind Betragsquadrate.',
      '„$\\langle A\\rangle$ ist das Ergebnis einer Messung“: Einzelmessungen liefern nur Eigenwerte.',
      'Hermitesch mit symmetrisch verwechseln: Bei komplexen Matrizen muss $A_{ij} = A_{ji}^*$ gelten.',
      'Operatoren wie Zahlen vertauschen: $\\hat x\\hat p \\ne \\hat p\\hat x$.',
      'Nach einer Messung mit dem alten Zustand weiterrechnen.',
      '$\\hat A|\\psi\\rangle$ für den Zustand nach der Messung halten.'
    ],
    more:[{title:'Robertson-Unschärferelation für x und p', text:'Mit $[\\hat x, \\hat p] = i\\hbar$ folgt $\\Delta x\\,\\Delta p \\ge \\frac12|\\langle i\\hbar\\rangle| = \\hbar/2$ – für **jeden** Zustand. Die Unschärfe ist keine Messungenauigkeit, sondern eine Eigenschaft des Zustands: Es gibt keinen Zustand, in dem Ort und Impuls beide scharf sind.'}],
    checks:[
      {q:'$|\\psi\\rangle = \\frac35|a_1\\rangle + \\frac45 i|a_2\\rangle$ mit Eigenwerten $a_1 = 1$, $a_2 = 2$. Wie groß ist $\\langle A\\rangle$?', opts:['$41/25$', '$11/5$', '$3/2$'], a:0, ex:'$\\langle A\\rangle = 1\\cdot\\frac{9}{25} + 2\\cdot\\frac{16}{25} = \\frac{41}{25}$. Die Phase $i$ fällt im Betragsquadrat weg.'},
      {q:'Welche Matrix ist hermitesch?', opts:['$\\begin{pmatrix}1&i\\\\-i&2\\end{pmatrix}$', '$\\begin{pmatrix}1&i\\\\i&2\\end{pmatrix}$', '$\\begin{pmatrix}i&0\\\\0&1\\end{pmatrix}$'], a:0, ex:'Hermitesch: $A_{12} = A_{21}^*$ und reelle Diagonale. Hier ist $(-i)^* = i$.'}
    ]
  },
  lab:{type:'measure', title:'Messung an einem Dreiniveausystem',
    text:'Oben: viele gleich präparierte Systeme im Zustand $\\sum_n c_n|a_n\\rangle$ mit Eigenwerten $a_n = 1, 2, 3$. Mit den Reglern stellst du die Gewichte $|c_n|^2$ ein (sie werden automatisch normiert). Jede Messung liefert einen Eigenwert – zufällig, mit Wahrscheinlichkeit $|c_n|^2$. Unten: eine Messfolge an **einem** System mit zwei Observablen $A$ und $B$, die nicht vertauschen. Nach jeder Messung ist das System im Eigenzustand zum gemessenen Wert.',
    predict:{q:'Bevor du misst: Die Gewichte sind $0{,}5$, $0{,}3$ und $0{,}2$ für die Eigenwerte 1, 2, 3. Was erwartest du bei zehn Messungen?', opts:['eine Zufallsfolge aus 1, 2, 3, grob im Verhältnis 5 : 3 : 2', 'zehnmal den Wert $1{,}7$, also stets den Erwartungswert', 'genau fünfmal 1, dreimal 2 und zweimal 3'], a:0,
      ex:'Jede Messung liefert einen Eigenwert. Bei nur zehn Messungen schwanken die Häufigkeiten deutlich um $5 : 3 : 2$.'},
    questions:[
      {q:'Lass die Gewichte bei $0{,}5$, $0{,}3$ und $0{,}2$. Kann eine einzelne Messung den Wert $\\langle A\\rangle = 1{,}7$ liefern?', opts:['Nein, nur 1, 2 oder 3.', 'Ja, das ist der häufigste Wert.', 'Ja, aber nur selten.'], a:0, ex:'Messwerte sind Eigenwerte. $\\langle A\\rangle$ ist der Mittelwert vieler Messungen.'},
      {q:'Messfolge an einem System: Miss $A$ und sofort noch einmal $A$. Dann: $A$, $B$, $A$. Was beobachtest du?', opts:['$A \\to A$ gibt zweimal dasselbe; nach $B$ ist das zweite $A$ wieder zufällig.', '$A \\to A$ gibt zufällig verschiedene Werte, wie bei frisch präparierten Systemen.', '$A \\to B \\to A$ liefert immer zweimal denselben $A$-Wert.'], a:0, ex:'Die erste Messung präpariert den Eigenzustand $|a_n\\rangle$; eine sofortige Wiederholung bestätigt ihn. Die $B$-Messung präpariert einen $B$-Eigenzustand, in dem $A$ nicht scharf ist.'},
      {q:'Führe mehrere Messreihen mit je 100 Messungen durch. Was gilt für den Mittelwert einer Messreihe?', opts:['Er liegt nahe bei $\\langle A\\rangle$, schwankt aber.', 'Er ist in jeder Messreihe genau $\\langle A\\rangle$.', 'Er wächst von Messreihe zu Messreihe weiter an.'], a:0, ex:'Die Mittelwerte streuen um $\\langle A\\rangle$, und zwar etwa mit $\\Delta A/\\sqrt N$, wenn jede Reihe $N$ Messungen hat.'}
    ],
    noPic:{q:'Ohne Bild: $c_1 = \\frac12$, $c_2 = \\frac12$, $c_3 = \\frac{1}{\\sqrt2}$ bei Eigenwerten 1, 2, 3. Wie groß ist $\\langle A\\rangle$?', opts:['$9/4$', '$2$', '$\\frac32 + \\frac{3}{\\sqrt2}$'], a:0, ex:'$\\frac14\\cdot1 + \\frac14\\cdot2 + \\frac12\\cdot3 = \\frac94$.'}},
  compare:{
    text:'Gesucht ist $\\langle A\\rangle$ für $A = \\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$ im Zustand $|\\psi\\rangle = \\begin{pmatrix}3/5\\\\4/5\\end{pmatrix}$. Die Eigenvektoren von $A$ sind $|{+x}\\rangle = (1, 1)^T/\\sqrt2$ (Eigenwert $+1$) und $|{-x}\\rangle = (1, -1)^T/\\sqrt2$ (Eigenwert $-1$).',
    ctx:{rep:'mat', mat:{preset:'spin', mats:{A:'(0, 1; 1, 0)'}}, coords:['t'], params:{}, states:{ψ:'(3/5; 4/5)'}, state:'ψ'},
    A:{name:'Sandwich $\\langle\\psi|A|\\psi\\rangle$', model:['⟨A⟩ = ⟨ψ|A|ψ⟩', '= (3/5, 4/5) (0, 1; 1, 0) (3/5; 4/5)', '= 24/25']},
    B:{name:'Über die Eigenbasis', model:['⟨+x|ψ⟩ = 7/(5 sqrt(2))', '⟨-x|ψ⟩ = -1/(5 sqrt(2))', '⟨A⟩ = 1 · 49/50 + (-1) · 1/50', '= 24/25']},
    questions:[
      {q:'Was liefert Weg B zusätzlich?', opts:['die Wahrscheinlichkeiten der einzelnen Messwerte ($49/50$ und $1/50$)', 'nichts, nur einen längeren Rechenweg', 'den Zustand nach der Messung ohne weitere Information'], a:0, ex:'Weg B beantwortet auch: Wie oft kommt $+1$, wie oft $-1$?'},
      {q:'Wann ist Weg A klar schneller?', opts:['wenn die Eigenvektoren nicht bekannt sind', 'wenn der Zustand ein Eigenvektor ist', 'nie, beide sind immer gleich lang'], a:0, ex:'Für das Sandwich braucht man nur Matrix und Zustand, keine Diagonalisierung.'}
    ]
  },
  practice:[
    {id:'form-p1', title:'Eigenwerte und Eigenvektoren einer hermiteschen Matrix',
      text:'$A = \\begin{pmatrix}1&2i\\\\-2i&1\\end{pmatrix}$. Gegeben sind $v = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\-i\\end{pmatrix}$ und $w = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\i\\end{pmatrix}$. Matrizen schreibst du als `(1, 2i; -2i, 1)`, Spaltenvektoren als `(1; -i)`.',
      ctx:FORM_MAT(),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $v$ Eigenvektor ist, und bestimme den Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:2, ph:'A v = (1, 2i; -2i, 1)(1; -i)/sqrt(2)',
          hints:['Ein Eigenvektor erfüllt $Av = \\lambda v$: Berechne $Av$ und lies den Faktor ab.', 'Zeile mal Spalte; beachte $2i\\cdot(-i) = 2$.', '$Av = \\frac{1}{\\sqrt2}(3, -3i)^T = 3v$.'],
          model:['A v = (1, 2i; -2i, 1)(1; -i)/sqrt(2)', '= (3; -3i)/sqrt(2)', '= 3 v', 'A v = λ v', 'λ = 3']},
        {id:'b', prompt:'b) Bestimme den Eigenwert $\\mu$ zu $w$.', type:'solve', unknown:'μ', points:2,
          hints:['Wie bei a): Berechne $Aw$ und vergleiche mit $w$.', '$Aw = \\frac{1}{\\sqrt2}(1 + 2i\\cdot i,\\ -2i + i)^T = \\frac{1}{\\sqrt2}(-1, -i)^T$.'],
          model:['A w = (1, 2i; -2i, 1)(1; i)/sqrt(2)', '= (-1; -i)/sqrt(2)', '= -w', 'μ = -1']},
        {id:'c', prompt:'c) Berechne $\\langle v|w\\rangle$.', type:'value', target:'0', points:2,
          hints:['Skalarprodukt $\\langle v|w\\rangle = \\sum_k v_k^*w_k$: im Bra konjugieren.', 'Das Bra ist der konjugiert transponierte Vektor: $\\langle v| = \\frac{1}{\\sqrt2}(1, i)$.', 'Es bleibt $(1\\cdot1 + i\\cdot i)/2$.'],
          model:['⟨v|w⟩ = (1, i)/sqrt(2) (1; i)/sqrt(2)', '= (1 + i^2)/2', '= 0'], note:'Eigenvektoren zu verschiedenen Eigenwerten eines hermiteschen Operators sind orthogonal.'}
      ]},
    {id:'form-p2', title:'Kommutatoren in der Ortsdarstellung',
      text:'Wende die Kommutatoren auf eine Testfunktion $f(x)$ an. $\\hat p = -i\\hbar\\,d/dx$, $\\hat H = \\hat p^2/(2m) + V(x)$.',
      ctx:FORM_FG(),
      goals:[
        {id:'a', prompt:'a) Zeige $[\\hat x^2, \\hat p]f = 2i\\hbar\\,\\hat x f$.', type:'show', from:'[x̂^2, p̂] f', to:'2iħ x̂ f', points:3, ph:'[x̂^2, p̂] f = x^2 (-iħ f\') - (-iħ)(x^2 f)\'',
          hints:['Wende beide Produkte auf $f$ an und ziehe sie voneinander ab.', '$[\\hat x^2,\\hat p]f = x^2(\\hat p f) - \\hat p(x^2 f)$.', 'Produktregel: $(x^2f)\' = 2xf + x^2f\'$.'],
          model:['[x̂^2, p̂] f = x^2 (-iħ f\') - (-iħ)(x^2 f)\'', '= -iħ x^2 f\' + iħ (2x f + x^2 f\')', '= 2iħ x f']},
        {id:'b', prompt:'b) Zeige $[\\hat x, \\hat H]f = \\frac{i\\hbar}{m}\\hat p f$.', type:'show', from:'[x̂, Ĥ] f', to:'iħ/m p̂ f', points:3,
          hints:['Zerlege $\\hat H$ in kinetischen Teil und $V$; der Kommutator ist linear.', '$\\hat x$ vertauscht mit $V(x)$.', 'Benutze $[\\hat x, \\hat p^2] = 2i\\hbar\\hat p$.'],
          model:['[x̂, Ĥ] f = [x̂, p̂^2/(2m)] f + [x̂, V] f', '= 1/(2m) [x̂, p̂^2] f', '= 1/(2m) · 2ħ^2 f\'', '= iħ/m (-iħ f\')'],
          note:'Damit folgt aus $\\frac{d}{dt}\\langle x\\rangle = \\frac{i}{\\hbar}\\langle[\\hat H,\\hat x]\\rangle$ die Ehrenfest-Gleichung $\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m$.'}
      ]},
    {id:'form-p3', title:'Energiemessung an einer Überlagerung',
      text:'Ein Teilchen im Kasten ist im Zustand $|\\Psi\\rangle = \\frac{1}{\\sqrt6}\\left(|\\psi_1\\rangle + 2|\\psi_2\\rangle + i|\\psi_3\\rangle\\right)$ mit $E_n = n^2E_1$. Gib Energien in Vielfachen von $E_1$ an.',
      ctx:FORM_BOX('(ψ_1(x) + 2 ψ_2(x) + i ψ_3(x))/sqrt(6)'),
      goals:[
        {id:'a', prompt:'a) Mit welcher Wahrscheinlichkeit misst man $E_2 = 4E_1$?', type:'value', target:'2/3', points:2,
          hints:['Gesucht ist die Wahrscheinlichkeit eines Eigenwerts: Born-Regel mit der passenden Komponente.', '$P(E_2) = |\\langle\\psi_2|\\Psi\\rangle|^2 = |2/\\sqrt6|^2$.'],
          model:['|⟨ψ_2|Ψ⟩|^2 = |2/sqrt(6)|^2', '= 2/3']},
        {id:'b', prompt:'b) Berechne $\\langle H\\rangle$.', type:'value', target:'13/3 E_1', points:2,
          hints:['$\\langle H\\rangle$ ist der mit den Wahrscheinlichkeiten gewichtete Mittelwert der Eigenwerte.', '$\\langle H\\rangle = \\sum_n E_n|c_n|^2$ mit $|c_n|^2 = \\frac16, \\frac46, \\frac16$ und $E_n = E_1, 4E_1, 9E_1$.'],
          model:['⟨H⟩ = 1/6 E_1 + 4/6 · 4E_1 + 1/6 · 9E_1', '= 13/3 E_1'],
          mistakes:[{expr:'E_1 · 1/sqrt(6) + 4E_1 · 2/sqrt(6) + 9E_1 · 1/sqrt(6)', msg:'Gewichte sind die Wahrscheinlichkeiten $|c_n|^2$, nicht die Amplituden $c_n$.'}]},
        {id:'c', prompt:'c) Berechne die Energieunschärfe $\\Delta H$.', type:'value', target:'5 sqrt(2)/3 E_1', points:3,
          hints:['Berechne zuerst $\\langle H^2\\rangle$, dann die Unschärfe.', '$\\langle H^2\\rangle = \\sum_n E_n^2|c_n|^2$ und $\\Delta H = \\sqrt{\\langle H^2\\rangle - \\langle H\\rangle^2}$.', 'Es ist $\\langle H^2\\rangle = \\frac{73}{3}E_1^2$.'],
          model:['⟨H^2⟩ = E_1^2 (1/6 · 1 + 4/6 · 16 + 1/6 · 81)', '= 73/3 E_1^2', 'ΔH = sqrt(73/3 - 169/9) E_1', '= 5 sqrt(2)/3 E_1']}
      ]},
    {id:'form-p4', title:'Ehrenfest-Theorem für den Ort',
      text:'$\\psi(x,t)$ erfüllt $i\\hbar\\,\\partial_t\\psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\psi + V(x)\\psi$ mit reellem $V$ und ist normiert. Zeige $\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m$. Das Tutorial setzt für $\\partial\\psi/\\partial t$ automatisch die Schrödingergleichung ein.',
      ctx:FORM_DYN(),
      goals:[{id:'a', prompt:'Zeige $\\frac{d}{dt}\\int\\psi^*x\\psi\\,dx = \\langle p\\rangle/m$.', type:'show', from:'d/dt ∫_-∞^∞ ψ^* x ψ dx', to:'⟨p⟩/m', points:4, minSteps:3,
        hints:['Ziehe $d/dt$ ins Integral (Produktregel) und ersetze die Zeitableitungen mit der Schrödingergleichung.', 'Die $V$-Terme heben sich weg, weil $V$ reell ist.', 'Partiell integrieren: $\\int x(\\psi^*\\psi\'\' - \\psi^{*\\prime\\prime}\\psi)dx = \\int(\\psi^{*\\prime}\\psi - \\psi^*\\psi\')dx$.'],
        model:['d/dt ∫_-∞^∞ ψ^* x ψ dx = ∫_-∞^∞ x (∂ψ^*/∂t ψ + ψ^* ∂ψ/∂t) dx', {l:'= iħ/(2m) ∫_-∞^∞ x (ψ^* ∂^2ψ/∂x^2 - ∂^2ψ^*/∂x^2 ψ) dx', w:'Schrödingergleichung, V hebt sich weg'}, {l:'= iħ/(2m) ∫_-∞^∞ (∂ψ^*/∂x ψ - ψ^* ∂ψ/∂x) dx', w:'partiell integriert'}, {l:'= -iħ/m ∫_-∞^∞ ψ^* ∂ψ/∂x dx', w:'noch einmal partiell'}, '= ⟨p⟩/m']}]},
    {id:'form-p5', title:'Unschärferelation für zwei 2×2-Observable',
      text:'Ein Spin-½-System (mehr in Thema 10) hat die Observablen $S_x = \\frac\\hbar2\\begin{pmatrix}0&1\\\\1&0\\end{pmatrix}$, $S_y = \\frac\\hbar2\\begin{pmatrix}0&-i\\\\i&0\\end{pmatrix}$ und $S_z = \\frac\\hbar2\\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$. Ausmultiplizieren zeigt $[S_x, S_y] = i\\hbar S_z$ und $S_x^2 = S_y^2 = \\frac{\\hbar^2}{4}\\mathbb 1$. Der Zustand ist $|\\chi\\rangle = |{\\uparrow}\\rangle = \\begin{pmatrix}1\\\\0\\end{pmatrix}$, also $S_z|{\\uparrow}\\rangle = \\frac\\hbar2|{\\uparrow}\\rangle$. Robertson: $\\Delta S_x\\,\\Delta S_y \\ge \\frac12|\\langle[S_x,S_y]\\rangle|$.',
      ctx:{rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}, states:{χ:'|↑⟩'}, state:'χ'},
      goals:[
        {id:'a', prompt:'a) Berechne die rechte Seite $\\frac12|\\langle[S_x,S_y]\\rangle|$.', type:'value', target:'ħ^2/4', points:2,
          hints:['Setze den Kommutator ein und bilde dann seinen Erwartungswert in $|{\\uparrow}\\rangle$.', '$[S_x, S_y] = i\\hbar S_z$ und $\\langle{\\uparrow}|S_z|{\\uparrow}\\rangle = \\hbar/2$.'],
          model:['1/2 |⟨[S_x, S_y]⟩| = 1/2 |⟨iħ S_z⟩|', '= ħ/2 · ħ/2', '= ħ^2/4']},
        {id:'b', prompt:'b) Berechne $\\Delta S_x\\,\\Delta S_y$.', type:'value', target:'ħ^2/4', points:2,
          hints:['Berechne $\\Delta S_x$ und $\\Delta S_y$ einzeln mit $\\Delta A = \\sqrt{\\langle A^2\\rangle - \\langle A\\rangle^2}$.', '$\\langle S_x^2\\rangle = \\hbar^2/4$, weil $S_x^2 = \\frac{\\hbar^2}{4}\\mathbb 1$. Und $\\langle{\\uparrow}|S_x|{\\uparrow}\\rangle$ ist das obere linke Matrixelement, also $0$; für $S_y$ ebenso.'],
          model:['ΔS_x = sqrt(⟨S_x^2⟩ - ⟨S_x⟩^2)', '= ħ/2', 'ΔS_x ΔS_y = ħ/2 · ħ/2', '= ħ^2/4'], note:'Hier gilt das Gleichheitszeichen: $|{\\uparrow}\\rangle$ ist für $S_x$ und $S_y$ ein Zustand minimaler Unschärfe.'}
      ]}
  ],
  concept:[
    {id:'form-k1', type:'dialog', seg:'form-t4', keep:true,
      text:'Ein Atom wird als Zweiniveausystem beschrieben: $\\hat H|g\\rangle = E_g|g\\rangle$ und $\\hat H|e\\rangle = E_e|e\\rangle$ mit $E_g = 1\\,\\mathrm{eV}$ und $E_e = 3\\,\\mathrm{eV}$. Es ist im Zustand $|\\psi\\rangle = (|g\\rangle + |e\\rangle)/\\sqrt2$. Die Energie wird gemessen.',
      people:[{name:'Lena', says:'Nach der Messung ist der Zustand $|g\\rangle$ oder $|e\\rangle$, je nach Ergebnis. $\\hat H|\\psi\\rangle$ hat damit nichts zu tun.'}, {name:'Jonas', says:'Den Zustand nach der Messung bekommt man, indem man $\\hat H$ auf $|\\psi\\rangle$ anwendet und das Ergebnis normiert.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Jonas’ Vorschlag liefert $(|g\\rangle + 3|e\\rangle)/\\sqrt{10}$ – kein Eigenzustand, und jedes Mal derselbe. Eine Messung liefert zufällig $|g\\rangle$ oder $|e\\rangle$. „Operator anwenden = messen“ ist eine dokumentierte Lernschwierigkeit (Singh & Marshman 2015).'},
    {id:'form-k2', type:'mc2', seg:'form-t6', lex:'vertraegliche-observable',
      q:'$\\hat A$ und $\\hat B$ vertauschen. $|v\\rangle$ ist Eigenvektor von $\\hat A$ zum Eigenwert $a$. Ist $|v\\rangle$ dann auch Eigenvektor von $\\hat B$?', opts:['nicht unbedingt', 'ja, in jedem Fall', 'nein, in keinem Fall'], a:0,
      ex:'Nur wenn $a$ nicht entartet ist, folgt es zwingend.',
      reason:{q:'Warum?', opts:['Ist $a$ entartet, kann $|v\\rangle$ eine Mischung von $\\hat B$-Eigenvektoren aus dem Eigenraum sein.', 'Aus $[\\hat A, \\hat B] = 0$ folgt, dass jeder Eigenvektor gemeinsam ist.', 'Vertauschende Operatoren haben grundsätzlich verschiedene Eigenvektoren.'], a:0,
        ex:'Es gibt eine gemeinsame Eigenbasis, aber im entarteten Eigenraum muss man sie gezielt wählen. Beispiel: $\\cos kx$ beim freien Teilchen (Thema 4).'}},
    {id:'form-k3', type:'dialog', seg:'form-t4', lex:'zustandsreduktion',
      text:'Ein Photon ist senkrecht polarisiert ($0°$). Es kommt durch einen Filter unter $45°$. Danach trifft es auf einen senkrechten Filter ($0°$).',
      people:[{name:'Lena', says:'Es kommt sicher durch den letzten Filter, denn es war ja schon vorher senkrecht polarisiert.'}, {name:'Jonas', says:'Es kommt nur mit Wahrscheinlichkeit $1/2$ durch, denn der $45°$-Filter hat seinen Zustand auf $45°$ gestellt.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Hinter dem $45°$-Filter ist das Photon im Zustand $|45°\\rangle$, und $|\\langle 0°|45°\\rangle|^2 = \\cos^2 45° = 1/2$. Die Messung in der $45°$-Basis hat die Information „senkrecht“ gelöscht. Ein Photon „erinnert sich“ nicht an frühere Zustände.'},
    {id:'form-k4', type:'mc2', seg:'form-t3', lex:'messpostulat',
      q:'Eine Observable $\\hat A$ hat nur die Eigenwerte $-1$ und $+1$. In einem Zustand ist $\\langle A\\rangle = 0$. Was liefert eine einzelne Messung?', opts:['$-1$ oder $+1$', 'immer $0$', 'meist $0$, selten $\\pm 1$'], a:0,
      ex:'Hier sind beide Ergebnisse gleich wahrscheinlich: $\\langle A\\rangle = (+1)P_+ + (-1)P_- = 0$ mit $P_+ + P_- = 1$ verlangt $P_+ = P_- = 1/2$.',
      reason:{q:'Warum?', opts:['Messwerte sind Eigenwerte, und $0$ ist hier keiner.', '$\\langle A\\rangle$ ist der wahrscheinlichste Messwert.', 'Bei $\\langle A\\rangle = 0$ ist der Zustand ein Eigenzustand zum Wert $0$.'], a:0,
        ex:'$\\langle A\\rangle$ ist der Mittelwert vieler Messungen und muss selbst kein Eigenwert sein.'}},
    {id:'form-k5', type:'mc', seg:'form-t3',
      q:'Für einen beliebigen normierten Zustand $|\\Psi\\rangle$ eines Teilchens im Kasten gilt …', opts:['$\\langle\\Psi|\\hat H|\\Psi\\rangle = \\langle H\\rangle$, aber meist $\\hat H|\\Psi\\rangle \\ne \\langle H\\rangle|\\Psi\\rangle$', '$\\hat H|\\Psi\\rangle = E|\\Psi\\rangle$ mit $E = \\langle H\\rangle$', '$\\hat H|\\Psi\\rangle = E_1|\\Psi\\rangle$, weil das System im Grundzustand ist'], a:0,
      ex:'$\\hat H\\Psi = E\\Psi$ gilt nur für Energieeigenzustände. Die Annahme, jeder Zustand erfülle sie, ist eine bekannte Lernschwierigkeit (Styer 1996; Singh & Marshman 2015).'}
  ],
  final:[
    {aim:0, task:{id:'form-fa1', title:'Skalarprodukt und Matrixelement',
      text:'$v = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\i\\end{pmatrix}$, $w = \\frac15\\begin{pmatrix}3\\\\4i\\end{pmatrix}$ und $A = \\begin{pmatrix}2&1-i\\\\1+i&3\\end{pmatrix}$. Matrizen schreibst du als `(2, 1 - i; 1 + i, 3)`, Spaltenvektoren als `(3; 4i)/5`.',
      ctx:{rep:'mat', mat:{preset:'spin', mats:{A:'(2, 1 - i; 1 + i, 3)'}}, coords:['t'], params:{}, states:{v:'(1; i)/sqrt(2)', w:'(3; 4i)/5'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle v|w\\rangle$.', type:'value', target:'7/(5 sqrt(2))', points:2, model:['⟨v|w⟩ = (1, -i)/sqrt(2) (3; 4i)/5', '= (3 + 4)/(5 sqrt(2))', '= 7/(5 sqrt(2))']},
        {id:'b', prompt:'b) Berechne das Matrixelement $\\langle v|A|w\\rangle$.', type:'value', target:'(25 + i)/(5 sqrt(2))', points:3, model:['A w = (2, 1 - i; 1 + i, 3)(3; 4i)/5', '= (10 + 4i; 3 + 15i)/5', '⟨v|A|w⟩ = (1, -i)/sqrt(2) (10 + 4i; 3 + 15i)/5', '= (25 + i)/(5 sqrt(2))']}
      ]}},
    {aim:1, task:{id:'form-f2', title:'Kommutator mit $\\hat x^3$', text:'Wende $[\\hat p, \\hat x^3]$ auf eine Testfunktion $f(x)$ an.',
      ctx:FORM_FG(),
      goals:[{id:'a', prompt:'Zeige $[\\hat p, \\hat x^3]f = -3i\\hbar x^2 f$.', type:'show', from:'[p̂, x̂^3] f', to:'-3iħ x^2 f', points:3, model:['[p̂, x̂^3] f = -iħ (x^3 f)\' + iħ x^3 f\'', '= -iħ (3x^2 f + x^3 f\') + iħ x^3 f\'', '= -3iħ x^2 f']}]}},
    {aim:2, task:{id:'form-fa3', title:'Energiemessung im Kasten',
      text:'Ein Teilchen im Kasten ist im Zustand $|\\Psi\\rangle = \\frac12\\left(|\\psi_1\\rangle + \\sqrt2\\,i|\\psi_2\\rangle + |\\psi_3\\rangle\\right)$ mit $E_n = n^2E_1$. Gib Energien in Vielfachen von $E_1$ an.',
      ctx:FORM_BOX('(ψ_1(x) + sqrt(2) i ψ_2(x) + ψ_3(x))/2'),
      goals:[
        {id:'a', prompt:'a) Mit welcher Wahrscheinlichkeit misst man $E_2$?', type:'value', target:'1/2', points:1, model:['|⟨ψ_2|Ψ⟩|^2 = 1/2']},
        {id:'b', prompt:'b) Berechne $\\langle H\\rangle$.', type:'value', target:'9/2 E_1', points:2, model:['⟨H⟩ = 1/4 E_1 + 1/2 · 4E_1 + 1/4 · 9E_1', '= 9/2 E_1']},
        {id:'c', prompt:'c) Berechne $\\Delta H$.', type:'value', target:'sqrt(33)/2 E_1', points:3, model:['⟨H^2⟩ = E_1^2 (1/4 · 1 + 1/2 · 16 + 1/4 · 81)', '= 57/2 E_1^2', 'ΔH = sqrt(57/2 - 81/4) E_1', '= sqrt(33)/2 E_1']}
      ]}},
    {aim:'k', type:'mc2', id:'form-fk1',
      q:'Observable $\\hat A$ hat die Eigenvektoren $|1\\rangle, |2\\rangle$, Observable $\\hat B$ die Eigenvektoren $|\\pm\\rangle = (|1\\rangle \\pm |2\\rangle)/\\sqrt2$. Du misst $A$ (Ergebnis $a_1$), dann $B$, dann wieder $A$. Mit welcher Wahrscheinlichkeit liefert die dritte Messung $a_1$?', opts:['$1/2$', '$1$', '$0$'], a:0,
      ex:'Die $B$-Messung hat den Zustand $|1\\rangle$ zerstört.',
      reason:{q:'Warum?', opts:['Nach der $B$-Messung ist der Zustand $|\\pm\\rangle$, und $|\\langle 1|\\pm\\rangle|^2 = 1/2$.', 'Das System erinnert sich an das erste Ergebnis $a_1$.', 'Nach der $B$-Messung ist der Zustand $|1\\rangle$ ausgeschlossen.'], a:0,
        ex:'Jede Messung präpariert einen neuen Zustand; nur er zählt für die nächste Messung.'}},
    {aim:'k', type:'dialog', id:'form-fk2', keep:true,
      text:'Ein Zustand $|\\psi\\rangle = \\tfrac35|a_1\\rangle + \\tfrac45|a_2\\rangle$ wird auf $\\hat A$ gemessen; die Eigenwerte sind $a_1 = 1$ und $a_2 = 2$.',
      people:[{name:'Lena', says:'Danach ist das System im Zustand $\\hat A|\\psi\\rangle = \\tfrac35|a_1\\rangle + \\tfrac85|a_2\\rangle$, den man nur noch normieren muss.'}, {name:'Jonas', says:'Danach ist es in $|a_1\\rangle$ (Wahrscheinlichkeit $9/25$) oder in $|a_2\\rangle$ (Wahrscheinlichkeit $16/25$).'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'$\\hat A|\\psi\\rangle$ ist ein Rechenergebnis, kein Zustand nach der Messung. Nach der Messung liegt ein Eigenzustand vor.'}
  ],
  finalB:[
    {aim:0, task:{id:'form-fb1', title:'Skalarprodukt und Matrixelement',
      text:'$u = \\frac{1}{\\sqrt5}\\begin{pmatrix}2\\\\i\\end{pmatrix}$, $w = \\frac{1}{\\sqrt2}\\begin{pmatrix}1\\\\1\\end{pmatrix}$ und $B = \\begin{pmatrix}1&2i\\\\-2i&0\\end{pmatrix}$. Matrizen schreibst du als `(1, 2i; -2i, 0)`, Spaltenvektoren als `(1; 1)/sqrt(2)`.',
      ctx:{rep:'mat', mat:{preset:'spin', mats:{B:'(1, 2i; -2i, 0)'}}, coords:['t'], params:{}, states:{u:'(2; i)/sqrt(5)', w:'(1; 1)/sqrt(2)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle u|w\\rangle$.', type:'value', target:'(2 - i)/sqrt(10)', points:2, model:['⟨u|w⟩ = (2, -i)/sqrt(5) (1; 1)/sqrt(2)', '= (2 - i)/sqrt(10)']},
        {id:'b', prompt:'b) Berechne das Matrixelement $\\langle u|B|w\\rangle$.', type:'value', target:'4i/sqrt(10)', points:3, model:['B w = (1 + 2i; -2i)/sqrt(2)', '⟨u|B|w⟩ = (2, -i)/sqrt(5) (1 + 2i; -2i)/sqrt(2)', '= (2 + 4i - 2)/sqrt(10)', '= 4i/sqrt(10)']}
      ]}},
    {aim:1, task:{id:'form-fb2', title:'Kommutator mit $\\hat x\\hat p$', text:'Wende $[\\hat x\\hat p, \\hat x]$ auf eine Testfunktion $f(x)$ an.',
      ctx:FORM_FG(),
      goals:[{id:'a', prompt:'Zeige $[\\hat x\\hat p, \\hat x]f = -i\\hbar x f$.', type:'show', from:'[x̂ p̂, x̂] f', to:'-iħ x f', points:3, model:['[x̂ p̂, x̂] f = x (-iħ (x f)\') - x^2 (-iħ f\')', '= -iħ x (f + x f\') + iħ x^2 f\'', '= -iħ x f']}]}},
    {aim:2, task:{id:'form-fb3', title:'Energiemessung an einem anderen Kastenzustand',
      text:'Ein Teilchen im Kasten ist im Zustand $|\\Psi\\rangle = \\frac12\\left(\\sqrt2\\,|\\psi_1\\rangle + |\\psi_2\\rangle - i|\\psi_3\\rangle\\right)$ mit $E_n = n^2E_1$. Gib Energien in Vielfachen von $E_1$ an.',
      ctx:FORM_BOX('(sqrt(2) ψ_1(x) + ψ_2(x) - i ψ_3(x))/2'),
      goals:[
        {id:'a', prompt:'a) Mit welcher Wahrscheinlichkeit misst man $E_1$?', type:'value', target:'1/2', points:1, model:['|⟨ψ_1|Ψ⟩|^2 = 1/2']},
        {id:'b', prompt:'b) Berechne $\\langle H\\rangle$.', type:'value', target:'15/4 E_1', points:2, model:['⟨H⟩ = 1/2 E_1 + 1/4 · 4E_1 + 1/4 · 9E_1', '= 15/4 E_1']},
        {id:'c', prompt:'c) Berechne $\\Delta H$.', type:'value', target:'3 sqrt(19)/4 E_1', points:3, model:['⟨H^2⟩ = E_1^2 (1/2 · 1 + 1/4 · 16 + 1/4 · 81)', '= 99/4 E_1^2', 'ΔH = sqrt(99/4 - 225/16) E_1', '= 3 sqrt(19)/4 E_1']}
      ]}},
    {aim:'k', type:'mc2', id:'form-gk1',
      q:'Observable $\\hat A$ hat die Eigenvektoren $|1\\rangle, |2\\rangle$, Observable $\\hat B$ die Eigenvektoren $|\\pm\\rangle = (|1\\rangle \\pm |2\\rangle)/\\sqrt2$. Du misst $B$ (Ergebnis $+$), dann $A$, dann wieder $B$. Mit welcher Wahrscheinlichkeit liefert die dritte Messung $+$?', opts:['$1/2$', '$1$', '$0$'], a:0,
      ex:'Die $A$-Messung hat den Zustand $|+\\rangle$ zerstört.',
      reason:{q:'Warum?', opts:['Danach ist der Zustand $|1\\rangle$ oder $|2\\rangle$; beide haben $|\\langle +|n\\rangle|^2 = 1/2$.', 'Das System erinnert sich an das erste Ergebnis $+$.', 'Nach der $A$-Messung ist das Ergebnis $+$ ausgeschlossen.'], a:0,
        ex:'Nicht vertauschende Observable: Jede Messung der einen löscht die Information über die andere.'}},
    {aim:'k', type:'mc2', id:'form-gk2',
      q:'$|\\psi\\rangle = (|a_1\\rangle + 2i|a_2\\rangle)/\\sqrt5$ mit den Eigenwerten $a_1 = -1$ und $a_2 = 3$ von $\\hat A$. Man misst $\\hat A$ und gleich danach noch einmal. Jemand beschreibt die beiden Messungen durch $\\hat A^2|\\psi\\rangle \\propto |a_1\\rangle + 18i|a_2\\rangle$ und folgert, die zweite Messung liefere fast sicher $a_2$. Was stimmt?', opts:['Die zweite Messung liefert sicher dasselbe Ergebnis wie die erste.', 'Die zweite Messung liefert fast sicher $a_2$, wie $\\hat A^2|\\psi\\rangle$ zeigt.', 'Die zweite Messung liefert wieder $a_1$ mit $1/5$ und $a_2$ mit $4/5$, unabhängig von der ersten.'], a:0,
      ex:'Nach der ersten Messung ist der Zustand $|a_1\\rangle$ (Wahrscheinlichkeit $1/5$) oder $|a_2\\rangle$ ($4/5$). Die sofortige Wiederholung bestätigt das Ergebnis.',
      reason:{q:'Warum?', opts:['Eine Messung bringt den Zustand in einen Eigenzustand; $\\hat A$ anzuwenden ist keine Messung.', 'Jede Messung multipliziert den Zustand mit $\\hat A$; danach muss man normieren.', 'Messungen ändern den Zustand nicht, sie lesen nur einen Wert ab.'], a:0,
        ex:'$\\hat A|\\psi\\rangle$ und $\\hat A^2|\\psi\\rangle$ sind Rechenergebnisse, keine Zustände nach einer Messung. Einen Operator anzuwenden ist keine Messung (Singh & Marshman 2015).'}}
  ],
  errors:[
    {id:'form-e1', title:'Erwartungswert mit Amplituden',
      text:'Ein Teilchen im Kasten ist im Zustand $|\\Psi\\rangle = \\frac{1}{\\sqrt6}(|\\psi_1\\rangle + 2|\\psi_2\\rangle + i|\\psi_3\\rangle)$ mit $E_n = n^2E_1$. Gesucht ist $\\langle H\\rangle$:',
      ctx:FORM_BOX('(ψ_1(x) + 2 ψ_2(x) + i ψ_3(x))/sqrt(6)'),
      lines:['|⟨ψ_1|Ψ⟩|^2 = 1/6', '|⟨ψ_2|Ψ⟩|^2 = 2/3', '⟨H⟩ = E_1 · 1/sqrt(6) + 4E_1 · 2/sqrt(6) + 9E_1 · 1/sqrt(6)', '= 18 E_1/sqrt(6)'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['Gewichtet wurde mit $|c_n|$ statt mit $|c_n|^2$.', 'Die Energien $E_n$ im Kasten stimmen nicht.', 'Der Anteil $|\\psi_3\\rangle$ darf nicht mitgenommen werden.'], a:0, ex:'$\\langle H\\rangle = \\sum_n E_n|c_n|^2$. Die Gewichte müssen sich zu 1 addieren – $\\frac{1+2+1}{\\sqrt6}$ tut das nicht.'},
      fix:{id:'a', prompt:'Berichtige und berechne $\\langle H\\rangle$.', type:'value', target:'13/3 E_1', model:['⟨H⟩ = 1/6 E_1 + 4/6 · 4E_1 + 1/6 · 9E_1', '= 13/3 E_1']}},
    {id:'form-e2', title:'Reihenfolge beim Adjungieren',
      text:'Gesucht ist $(AB)^\\dagger$ für $A = \\begin{pmatrix}0&1\\\\0&0\\end{pmatrix}$ und $B = \\begin{pmatrix}1&0\\\\0&-1\\end{pmatrix}$. Das Ergebnis soll ein Vielfaches $c\\,A^\\dagger$ sein. Matrizen schreibst du als `(0, 0; 1, 0)`:',
      ctx:{rep:'mat', mat:{preset:'spin', mats:{A:'(0, 1; 0, 0)', B:'(1, 0; 0, -1)'}}, coords:['t'], params:{}, unknowns:{c:{ref:'-1', kind:'real'}}},
      lines:['A† = (0, 0; 1, 0)', '(A B)† = A† B†', '= A†'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Adjungieren dreht die Reihenfolge um: $(AB)^\\dagger = B^\\dagger A^\\dagger$.', '$B$ ist nicht hermitesch, also ist $B^\\dagger \\ne B$.', '$A$ ist hermitesch, also ist $A^\\dagger = A$.'], a:0, ex:'$A^\\dagger B^\\dagger = A^\\dagger B$ und $B^\\dagger A^\\dagger = BA^\\dagger$ sind verschieden, weil $A^\\dagger$ und $B$ nicht vertauschen. Hier ändert das sogar das Vorzeichen: $(AB)^\\dagger = -A^\\dagger$.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $c$ in $(AB)^\\dagger = c\\,A^\\dagger$.', type:'solve', unknown:'c',
        model:['(A B)† = B† A†', '= B A†', '= -A†', '(A B)† = c A†', 'c = -1']}}
  ]
});
})();
lexe('dirac-notation', 'Dirac-Notation', 'Ket $|\\psi\\rangle$: Zustandsvektor. Bra $\\langle\\phi|$: das zugehörige lineare Funktional (konjugiert transponiert). Skalarprodukt $\\langle\\phi|\\psi\\rangle = \\int\\phi^*(x)\\psi(x)dx$ bzw. $\\sum_k\\phi_k^*\\psi_k$; es gilt $\\langle\\phi|\\psi\\rangle^* = \\langle\\psi|\\phi\\rangle$. Matrixelement $\\langle\\phi|\\hat A|\\psi\\rangle = \\int\\phi^*\\hat A\\psi\\,dx$. Vollständigkeit: $\\sum_n|n\\rangle\\langle n| = \\mathbb 1$.', {topic:'form'});
lexe('hermitescher-operator', 'Hermitescher Operator', '$\\hat A^\\dagger = \\hat A$, d. h. $\\langle f|\\hat A g\\rangle = \\langle\\hat A f|g\\rangle$ für alle zulässigen $f, g$. Matrix: $A_{ij} = A_{ji}^*$. Eigenwerte sind reell, Eigenvektoren zu verschiedenen Eigenwerten orthogonal. Beispiele: $\\hat x$, $\\hat p = -i\\hbar\\,d/dx$, $\\hat H$, Pauli-Matrizen.', {topic:'form'});
lexe('kommutator', 'Kommutator', '$[\\hat A,\\hat B] = \\hat A\\hat B - \\hat B\\hat A$. Regeln: $[\\hat A,\\hat B] = -[\\hat B,\\hat A]$, $[\\hat A,\\hat B\\hat C] = [\\hat A,\\hat B]\\hat C + \\hat B[\\hat A,\\hat C]$. Wichtig: $[\\hat x,\\hat p] = i\\hbar$, $[\\hat x,\\hat p^n] = i\\hbar n\\hat p^{n-1}$, $[\\hat p, f(\\hat x)] = -i\\hbar f\'(\\hat x)$. Zum Ausrechnen in der Ortsdarstellung immer auf eine Testfunktion $f$ anwenden.', {topic:'form'});
lexe('messpostulat', 'Messpostulat', 'Eine Messung der Observablen $\\hat A$ liefert einen Eigenwert $a_n$ mit der Wahrscheinlichkeit $|\\langle a_n|\\psi\\rangle|^2$ (bei Entartung: Summe über den Eigenraum). Unmittelbar danach ist das System im zugehörigen Eigenzustand. Erwartungswert: $\\langle A\\rangle = \\sum_n a_n|c_n|^2 = \\langle\\psi|\\hat A|\\psi\\rangle$.', {topic:'form'});
lexe('robertson', 'Robertson-Unschärferelation', '$\\Delta A\\,\\Delta B \\ge \\frac12\\left|\\langle[\\hat A,\\hat B]\\rangle\\right|$ für jeden Zustand; Beweis mit der Cauchy-Schwarz-Ungleichung für $(\\hat A - \\langle A\\rangle)\\psi$ und $(\\hat B - \\langle B\\rangle)\\psi$. Mit $[\\hat x,\\hat p] = i\\hbar$ folgt $\\Delta x\\Delta p \\ge \\hbar/2$; mit $[S_x, S_y] = i\\hbar S_z$ folgt $\\Delta S_x\\Delta S_y \\ge \\frac\\hbar2|\\langle S_z\\rangle|$.', {topic:'form'});
lexe('ehrenfest', 'Ehrenfest-Theorem', 'Zeitentwicklung von Erwartungswerten: $\\frac{d}{dt}\\langle A\\rangle = \\frac{i}{\\hbar}\\langle[\\hat H,\\hat A]\\rangle + \\langle\\partial_t\\hat A\\rangle$. Für $\\hat H = \\hat p^2/2m + V$: $\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m$, $\\frac{d}{dt}\\langle p\\rangle = -\\langle V\'(x)\\rangle$.', {topic:'form'});
lexe('postulate', 'Postulate der Quantenmechanik', '1. Zustand: normierter Vektor $|\\psi\\rangle$ im Hilbertraum (bis auf eine Phase). 2. Messgröße: hermitescher Operator $\\hat A$. 3. Messwerte: nur Eigenwerte $a_n$. 4. Born-Regel: $P(a_n) = |\\langle a_n|\\psi\\rangle|^2$ (bei kontinuierlichem Spektrum eine Dichte). 5. Nach der Messung: Projektion auf den Eigenraum, normiert. 6. Zwischen Messungen: $i\\hbar\\,\\frac{d}{dt}|\\psi\\rangle = \\hat H|\\psi\\rangle$.', {topic:'form'});
lexe('delta-normierung', 'δ-Normierung', 'Eigenfunktionen mit kontinuierlichem Spektrum sind nicht normierbar. Man normiert sie auf eine δ-Funktion: $\\langle f_{p\'}|f_p\\rangle = \\delta(p - p\')$ für $f_p = e^{ipx/\\hbar}/\\sqrt{2\\pi\\hbar}$, und $\\langle g_{y\'}|g_y\\rangle = \\delta(y - y\')$ für $g_y = \\delta(x - y)$. Entwicklungen werden zu Integralen; $|\\langle p|\\psi\\rangle|^2$ ist eine Wahrscheinlichkeitsdichte.', {topic:'form'});
lexe('zustandsreduktion', 'Zustandsreduktion', 'Nach einer Messung mit Ergebnis $a$ ist der Zustand $\\hat P_a|\\psi\\rangle/\\|\\hat P_a|\\psi\\rangle\\|$ mit dem Projektor $\\hat P_a$ auf den Eigenraum zu $a$ („Kollaps“). Eine sofortige Wiederholung liefert sicher wieder $a$. Danach entwickelt sich der Zustand nach der Schrödingergleichung. Nicht zu verwechseln mit $\\hat A|\\psi\\rangle$.', {topic:'form'});
lexe('vertraegliche-observable', 'Verträgliche Observable und Entartung', 'Zwei Observable mit $[\\hat A, \\hat B] = 0$ haben eine gemeinsame Eigenbasis und sind gleichzeitig scharf messbar. Ist ein Eigenwert von $\\hat A$ entartet, ist nicht jeder Eigenvektor von $\\hat A$ auch Eigenvektor von $\\hat B$; die gemeinsame Basis muss man im Eigenraum wählen. Beispiel: $[\\hat H, \\hat p] = 0$ beim freien Teilchen, aber $\\cos kx$ ist keine Impulseigenfunktion.', {topic:'form'});
lexe('energie-zeit-unschaerfe', 'Energie-Zeit-Unschärfe', 'Die Zeit ist kein Operator. Aus Robertson mit $\\hat H$ und Ehrenfest folgt $\\Delta H\\,\\Delta t_A \\ge \\hbar/2$ mit $\\Delta t_A = \\Delta A/|d\\langle A\\rangle/dt|$, der Zeit, in der sich $\\langle A\\rangle$ um eine Standardabweichung ändert. Ein Zustand mit $\\Delta H = 0$ ist stationär. Verwandt: Lebensdauer $\\tau$ und Linienbreite $\\Gamma = \\hbar/\\tau$ bei exponentiellem Zerfall.', {topic:'form'});
