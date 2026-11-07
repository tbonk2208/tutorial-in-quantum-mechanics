/* ===== Thema 6: Formalismus – Dirac-Notation, Operatoren, Messung ===== */
(function(){
const R = String.raw;
const FORM_FG = () => ({coords:['x'], params:{m:'pos'}, abstract:{f:{args:['x']}, g:{args:['x']}, V:{args:['x'], real:true}}});
const FORM_MAT = () => ({rep:'mat', mat:{preset:'spin', mats:{A:'(1, 2i; -2i, 1)'}}, coords:['t'], params:{},
  states:{v:'(1; -i)/sqrt(2)', w:'(1; i)/sqrt(2)'}, unknowns:{λ:{ref:'3', kind:'real'}, μ:{ref:'-1', kind:'real'}}});
const FORM_BOX = (st) => ({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', m:'pos'}, defs:{'ψ_n(x)':'sqrt(2/L) sin(nπx/L)', 'E_n':'n^2 π^2 ħ^2/(2m L^2)', 'Ψ(x)':st}, state:'Ψ', normalized:true});
const FORM_DYN = () => ({coords:['x', 't'], params:{m:'pos'}, abstract:{ψ:{args:['x', 't']}, V:{args:['x'], real:true}}, dyn:{fn:'ψ'}, normalized:true});
const FORM_FT = () => ({coords:['x'], params:{σ:'pos', y:'real', p:'real'}, defs:{'ψ(x)':'(2πσ^2)^(-1/4) e^(-x^2/(4σ^2))', 'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)'}});
/* ---- Skizzenaufgaben (didaktik/SKIZZE.md): Musterfunktionen aus den exakten Lösungen, dimensionslos ---- */
const SK = (() => {
  /* form-s1: Zustand nach der Messung (Postulat 5), reelle Komponenten in der Basis |1⟩, |2⟩.
     |ψ⟩ = (3|1⟩ − |2⟩)/√10 ≈ (0,949; −0,316). B̂ hat |±⟩ = (|1⟩ ± |2⟩)/√2 zu b± = ±1.
     P(b+) = |⟨+|ψ⟩|² = ((3 − 1)/√20)² = 0,2. Danach |+⟩ = (0,707; 0,707), Länge 1 (−|+⟩ ist derselbe Zustand → axis).
     Fehlskizzen: unverändert ψ; Projektion ohne Normierung ⟨+|ψ⟩|+⟩ = (0,316; 0,316), Länge 0,447; B̂|ψ⟩ = (−0,316; 0,949) (an |+⟩ gespiegelt). */
  const s10 = Math.sqrt(10), r2 = Math.SQRT1_2;
  const s1 = {
    id:'form-sk1', title:'Der Zustand nach der Messung', kind:'arrows',
    text:'Ein System ist im Zustand $|\\psi\\rangle = (3|1\\rangle - |2\\rangle)/\\sqrt{10}$ (grauer Pfeil; ein Zustand $c_1|1\\rangle + c_2|2\\rangle$ mit reellen $c_n$ ist der Pfeil zum Punkt $(c_1, c_2)$). Die Observable $\\hat B$ hat die Eigenvektoren $|\\pm\\rangle = (|1\\rangle \\pm |2\\rangle)/\\sqrt2$ zu den Eigenwerten $b_\\pm = \\pm1$. Eine Messung von $\\hat B$ ergibt $b_+$. Zeichne den Zustand unmittelbar nach der Messung als Pfeil vom Ursprung.',
    plot:{x:[-1.3, 1.3], y:[-1.3, 1.3], abs:true, xlab:'c_1', ylab:'c_2', unit:true, grid:0.5},
    given:[{from:[0, 0], to:[3 / s10, -1 / s10], lab:'\\psi'}],
    want:[{id:'nach', name:'Zustand nach der Messung', from:[0, 0], to:[r2, r2], lab:'\\psi\'', axis:true,
      msg:'In welchem Zustand ist das System, nachdem die Messung $b_+$ ergeben hat? (Abschnitt ‚Postulat 5: der Zustand nach der Messung‘)',
      msgDir:'Die Länge passt, die Richtung nicht. Zu welchem Eigenvektor gehört das Ergebnis $b_+$, und wohin zeigt er?',
      msgLen:'Die Richtung stimmt. Welche Länge muss ein Zustandsvektor haben? Denk an $\\sum_n |c_n|^2 = 1$.'}],
    reveal:'Nach Postulat 5 ist das System im Eigenzustand $|+\\rangle = (|1\\rangle + |2\\rangle)/\\sqrt2$: Richtung $45°$, Länge 1, die Spitze liegt auf dem Einheitskreis. Ob der Pfeil nach rechts oben oder nach links unten zeigt, ist gleich, denn $-|+\\rangle$ unterscheidet sich nur um die globale Phase $-1$. Die Projektion $\\langle +|\\psi\\rangle\\,|+\\rangle$ ist nur $2/\\sqrt{20} \\approx 0{,}45$ lang; ihr Quadrat $0{,}2$ ist die Wahrscheinlichkeit für $b_+$. Erst normiert ist sie der neue Zustand. $\\hat B|\\psi\\rangle$ wäre der an $|+\\rangle$ gespiegelte Pfeil: Einen Operator anwenden ist keine Messung.',
    hints:['Frage zuerst: Welcher Vektor gehört zum Messwert $b_+$?', 'Nach der Messung ist das System im normierten Eigenvektor zum gemessenen Eigenwert. Auf den alten Zustand kommt es nur für die Wahrscheinlichkeit an.'],
    wrong:[
      {arrows:[{from:[0, 0], to:[3 / s10, -1 / s10]}], fails:[0], why:'Messung ändert den Zustand nicht'},
      {arrows:[{from:[0, 0], to:[2 / Math.sqrt(20) * r2, 2 / Math.sqrt(20) * r2]}], fails:[0], why:'Projektion ⟨+|ψ⟩|+⟩ ohne Normierung'},
      {arrows:[{from:[0, 0], to:[-1 / s10, 3 / s10]}], fails:[0], why:'B̂|ψ⟩ als Zustand nach der Messung: Operator angewendet statt gemessen (Singh & Marshman 2015)'}
    ]
  };
  return {s1};
})();
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
    /* ===== Abschnitt 1: Zustand, Bra, Skalarprodukt, Darstellungen eines Zustands ===== */
    {id:'form-t1', title:'Postulat 1: Zustände sind Vektoren', steps:[
      {id:'form-t1a', title:'Ein Zustand, viele Gestalten',
        text:R`Du kennst Zustände schon in drei Gestalten: als Funktion $\psi(x)$ (Thema 1), als Liste von Koeffizienten $c_n$ im Kasten (Thema 3) und als Funktion $\varphi(k)$ im Impulsraum (Thema 4). Alle drei beschreiben dasselbe. Und du rechnest mit allen gleich: Du addierst Zustände, multiplizierst sie mit komplexen Zahlen, und Überlagerungen interferieren. Das ist die Struktur eines [[lex:vektorraum|Vektorraums]] (M3).

**Postulat 1.** Der Zustand eines Systems ist ein normierter Vektor $|\psi\rangle$ in einem komplexen [[lex:hilbertraum|Hilbertraum]]. Man liest $|\psi\rangle$ „Ket psi“. Vektoren, die sich nur um einen konstanten Faktor $e^{i\alpha}$ unterscheiden, beschreiben denselben Zustand. Eine Übersicht aller Postulate steht unter [[lex:postulate|Postulate der Quantenmechanik]].`,
        q:{q:R`$|\psi\rangle$ ist normiert. Welcher normierte Vektor beschreibt denselben Zustand?`,
          opts:[R`der Vektor mit den konjugierten Komponenten von $|\psi\rangle$`, R`$-|\psi\rangle$`, R`$\tfrac{1}{\sqrt2}\left(|\psi\rangle + |\phi\rangle\right)$ mit einem zu $|\psi\rangle$ orthogonalen $|\phi\rangle$`], a:1,
          ex:R`$-|\psi\rangle = e^{i\pi}|\psi\rangle$ unterscheidet sich nur um eine konstante Phase. Keine Messwahrscheinlichkeit hängt davon ab.`,
          fb:[R`Konjugieren ändert den Zustand. $\psi^*(x)$ hat zwar dieselbe Dichte $|\psi|^2$, aber den entgegengesetzten mittleren Impuls.`,
            '',
            R`Das ist eine Überlagerung und damit ein anderer Zustand. Eine Messung kann jetzt auch das Ergebnis liefern, das zu $|\phi\rangle$ gehört.`]}},
      {id:'form-t1b', title:'Der Ket in einer Basis: eine Spalte',
        num:{title:'Zwei Basiszustände', text:R`Ein System habe zwei Basiszustände $|1\rangle$ und $|2\rangle$, etwa die Polarisationen $\updownarrow$ und $\leftrightarrow$ eines Photons. Der Zustand $|\psi\rangle = \tfrac35|1\rangle + \tfrac{4i}{5}|2\rangle$ wird in dieser Basis zur Spalte

$$|\psi\rangle \;\doteq\; \begin{pmatrix}3/5\\ 4i/5\end{pmatrix}.$$

Probe der Normierung: $\left|\tfrac35\right|^2 + \left|\tfrac{4i}{5}\right|^2 = \tfrac{9}{25} + \tfrac{16}{25} = 1$.`},
        text:R`Ein Ket legt sich auf keine Darstellung fest. Erst eine Basis macht aus ihm Zahlen. Entwickelst du $|\psi\rangle = \sum_n c_n|n\rangle$, dann ist die Spalte der Koeffizienten $c_n$ die **Matrixdarstellung** des Kets. Das Zeichen $\doteq$ heißt „wird in dieser Basis dargestellt durch“.

Für zwei Basiszustände hat die Spalte zwei Einträge, im Kasten unendlich viele: die $c_1, c_2, c_3, \dots$ aus Thema 3. Die Einträge sind komplexe Zahlen. Ihre Beträge sagen, wie stark ein Basiszustand beteiligt ist. Ihre Phasen bestimmen, wie die Anteile interferieren. Normiert heißt hier $\sum_n|c_n|^2 = 1$. Eine andere Basis gibt eine andere Spalte für denselben Ket.`,
        q:{q:R`In der Basis $|1\rangle, |2\rangle$ ist $|\chi\rangle = \tfrac{1}{\sqrt2}\left(|1\rangle - i\,|2\rangle\right)$. Welche Spalte stellt $|\chi\rangle$ dar?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$\tfrac{1}{\sqrt2}\begin{pmatrix}1\\ -i\end{pmatrix}$`, R`$\tfrac{1}{\sqrt2}\begin{pmatrix}1\\ i\end{pmatrix}$`, R`$\tfrac{1}{\sqrt2}\begin{pmatrix}-i\\ 1\end{pmatrix}$`], a:0,
          ex:R`Der Vorfaktor von $|1\rangle$ kommt in die erste Zeile, der von $|2\rangle$ in die zweite – so, wie er dasteht, ohne Konjugation.`,
          fb:['',
            R`Im Ket wird nicht konjugiert. Konjugieren gehört zum Bra, also zur Zeile (nächster Schritt).`,
            R`Die Reihenfolge der Einträge folgt der Reihenfolge der Basis: oben $|1\rangle$, unten $|2\rangle$.`]}},
      {id:'form-t1c', title:'Der Bra: die konjugierte Zeile',
        pre:{from:'m-komplex', seg:'mk-t1', title:'Konjugieren und Betragsquadrat', text:R`Konjugieren heißt, $i$ durch $-i$ zu ersetzen: $(a + ib)^* = a - ib$. Eine Zahl mal ihre Konjugierte ist reell und nicht negativ: $z^*z = |z|^2 = a^2 + b^2$. Mini-Beispiel: $(4i)^*\cdot 4i = (-4i)\cdot 4i = 16$, aber $(4i)^2 = -16$.`},
        num:{title:'Die Zeile zur Spalte', text:R`Zur Spalte $\begin{pmatrix}3/5\\ 4i/5\end{pmatrix}$ gehört die Zeile $\langle\psi| \doteq \left(\tfrac35,\ -\tfrac{4i}{5}\right)$. Zeile mal Spalte:

$$\langle\psi|\psi\rangle = \tfrac35\cdot\tfrac35 + \left(-\tfrac{4i}{5}\right)\cdot\tfrac{4i}{5} = \tfrac{9}{25} + \tfrac{16}{25} = 1.$$`},
        text:R`Zu jedem Ket $|\psi\rangle$ gehört ein **Bra** $\langle\psi|$, gelesen „Bra psi“. In einer Basis ist der Bra die Zeile mit den konjugierten Einträgen: transponieren und konjugieren. Kurz: $\langle\psi| = |\psi\rangle^\dagger$, gelesen „psi dagger“.

Ein Bra allein ist weder eine Zahl noch ein Zustand. Er ist eine Vorschrift: „Nimm einen Ket und bilde Zeile mal Spalte.“ Erst Bra und Ket zusammen ergeben eine Zahl. Daher die Namen: *bra-c-ket*, die Klammer. Die Konjugation sorgt dafür, dass $\langle\psi|\psi\rangle = \sum_n|c_n|^2$ reell und positiv ist. Das ist genau die Normierung aus dem letzten Schritt.`,
        q:{q:R`Welche Zeile ist der Bra zu $|\chi\rangle \doteq \tfrac{1}{\sqrt2}\begin{pmatrix}1\\ -i\end{pmatrix}$?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$\tfrac{1}{\sqrt2}(1,\ -i)$`, R`$\tfrac{1}{\sqrt2}(1,\ i)$`, R`$\tfrac{1}{\sqrt2}(-1,\ i)$`], a:1,
          ex:R`Transponieren macht die Zeile, Konjugieren macht aus $-i$ den Eintrag $+i$. Probe: $\tfrac12\left(1\cdot1 + i\cdot(-i)\right) = 1$.`,
          fb:[R`Das ist nur transponiert. Ohne Konjugation käme $\langle\chi|\chi\rangle = \tfrac12(1 + (-i)^2) = 0$ heraus.`,
            '',
            R`Konjugieren dreht nur das Vorzeichen von $i$, nicht das ganzer Einträge. Die reelle $1$ bleibt $1$.`]}},
      {id:'form-t1d', title:'Das Skalarprodukt: Zeile mal Spalte',
        pre:{from:'m-vektor', seg:'mv-t2', title:'Skalarprodukt in ℂⁿ', text:R`In $\mathbb C^n$ ist $\langle a|b\rangle = \sum_i a_i^*\,b_i$: links konjugieren, dann Eintrag für Eintrag multiplizieren und addieren. Vertauschen konjugiert: $\langle b|a\rangle = \langle a|b\rangle^*$. Mini-Beispiel: $a = (1;\ i)$ und $b = (i;\ 1)$ geben $1\cdot i + (-i)\cdot 1 = 0$.`},
        num:{title:'Zwei Zustände', text:R`$|\phi\rangle \doteq \tfrac{1}{\sqrt2}\begin{pmatrix}1\\ 1\end{pmatrix}$ und $|\psi\rangle \doteq \begin{pmatrix}3/5\\ 4i/5\end{pmatrix}$:

$$\langle\phi|\psi\rangle = \tfrac{1}{\sqrt2}\left(\tfrac35 + \tfrac{4i}{5}\right) = \frac{3 + 4i}{5\sqrt2},\qquad \langle\psi|\phi\rangle = \tfrac{1}{\sqrt2}\left(\tfrac35 - \tfrac{4i}{5}\right) = \frac{3 - 4i}{5\sqrt2}.$$

Die beiden Zahlen sind zueinander konjugiert. Ihr Betragsquadrat ist in beiden Fällen $\tfrac{25}{50} = \tfrac12$.`},
        text:R`Das [[lex:skalarprodukt|Skalarprodukt]] $\langle\phi|\psi\rangle$, gelesen „Bra phi, Ket psi“, ist Zeile mal Spalte:

$$\langle\phi|\psi\rangle = \sum_n\phi_n^*\,\psi_n.$$

Daraus folgen die Rechenregeln der [[lex:dirac-notation|Dirac-Notation]]:

$$\langle\phi|\psi\rangle^* = \langle\psi|\phi\rangle,\qquad \langle\phi|c\,\psi\rangle = c\,\langle\phi|\psi\rangle,\qquad \langle c\,\phi|\psi\rangle = c^*\langle\phi|\psi\rangle.$$

Ein Faktor im Ket kommt unverändert heraus, ein Faktor im Bra konjugiert. Man sagt: linear im zweiten, antilinear im ersten Argument. Der Betrag $|\langle\phi|\psi\rangle|$ hängt nicht von der Reihenfolge ab, die Phase schon. Die Herleitung prüft das an zwei weiteren Vektoren.`,
        derive:{ctx:{rep:'mat', mat:{preset:'spin'}, coords:['t'], params:{}, states:{u:'(1; i)/sqrt(2)', w:'(2; 1)/sqrt(5)'}}, lines:[
          {l:'⟨u|w⟩ = 1/sqrt(10) (1, -i) (2; 1)', w:'Bra: transponieren und konjugieren; Vorfaktoren 1/√2 · 1/√5 vorgezogen',
            why:{q:'Warum steht im Bra $(1, -i)$ und nicht $(1, i)$?', opts:['Das Bra ist der konjugiert transponierte Ket: $i^* = -i$.', 'Das Vorzeichen ist Konvention; $(1, i)$ ginge genauso.', 'Im Bra wird stets der zweite Eintrag negativ genommen.'], a:0, ex:'Nur mit Konjugation ist $\\langle u|u\\rangle = |u_1|^2 + |u_2|^2 \\ge 0$.'}},
          {l:'= (2 - i)/sqrt(10)', w:'Zeile mal Spalte ausmultipliziert'},
          {l:'⟨w|u⟩ = (2 + i)/sqrt(10)', w:'= ⟨u|w⟩*',
            why:{q:'Welche Regel zeigt diese Zeile?', opts:['$\\langle w|u\\rangle = \\langle u|w\\rangle^*$', '$\\langle w|u\\rangle = \\langle u|w\\rangle$', '$\\langle w|u\\rangle = -\\langle u|w\\rangle$'], a:0, ex:'Vertauschen der Reihenfolge konjugiert das Skalarprodukt. Für reelle Vektoren merkt man davon nichts.'}},
          {l:'|⟨u|w⟩|^2 = 1/2', w:'Betragsquadrat: reell, unabhängig von der Reihenfolge'}
        ]},
        q:{q:R`Was ist $\langle 2\phi|\,3i\,\psi\rangle$, ausgedrückt durch $\langle\phi|\psi\rangle$?`,
          opts:[R`$-6i\,\langle\phi|\psi\rangle$`, R`$6\,\langle\phi|\psi\rangle$`, R`$6i\,\langle\phi|\psi\rangle$`], a:2,
          ex:R`Der Faktor im Bra wird konjugiert ($2^* = 2$), der im Ket bleibt: $2\cdot3i = 6i$. Stünde $3i$ im Bra, käme $-3i$ heraus.`,
          fb:[R`So wäre es, wenn $3i$ im Bra stünde. Konjugiert wird nur ein Faktor im Bra; hier steht dort die reelle $2$.`,
            R`Das $i$ verschwindet nicht. Ein Faktor im Ket kommt unverändert heraus.`,
            '']}},
      {id:'form-t1e', title:'Typischer Fehler: das Konjugieren vergessen',
        num:{title:'Länge null?', text:R`Für $|a\rangle \doteq \begin{pmatrix}1\\ i\end{pmatrix}$ ohne Konjugation: $1\cdot 1 + i\cdot i = 0$ – als hätte der Vektor die Länge null. Mit Konjugation: $\langle a|a\rangle = 1\cdot 1 + (-i)\cdot i = 2$, also $\|a\| = \sqrt2$.`},
        text:R`Der häufigste Rechenfehler mit Bras ist, das Konjugieren zu vergessen. Dann kann ein Normquadrat null, negativ oder komplex werden. Mit Konjugation ist $\langle\psi|\psi\rangle = \sum_n|\psi_n|^2$ immer reell und positiv. Daraus folgt ein schneller Test: Kommt bei $\langle\psi|\psi\rangle$ etwas Komplexes oder Negatives heraus, fehlt ein Stern.

Der zweite häufige Fehler ist die falsche Reihenfolge. $\langle\phi|\psi\rangle$ und $\langle\psi|\phi\rangle$ sind zueinander konjugiert, nicht gleich. Bei reellen Vektoren merkst du von beidem nichts. Deshalb fallen die Fehler erst auf, wenn komplexe Zahlen ins Spiel kommen – in der Quantenmechanik also fast immer.`,
        q:{q:R`Jemand rechnet für $|\chi\rangle \doteq \tfrac{1}{\sqrt5}\begin{pmatrix}1\\ 2i\end{pmatrix}$: $\langle\chi|\chi\rangle = \tfrac15\left(1 + (2i)^2\right) = -\tfrac35$. Was ist falsch?`,
          opts:[R`Im Bra fehlt die Konjugation; richtig ist $\tfrac15(1 + 4) = 1$.`, R`Der Vorfaktor müsste $\tfrac{1}{\sqrt5}$ statt $\tfrac15$ sein.`, R`Nichts: Bei imaginären Einträgen darf ein Normquadrat negativ sein.`], a:0,
          ex:R`Im Bra steht $(2i)^* = -2i$, also $(-2i)(2i) = 4$. Ein negatives Normquadrat ist immer ein Warnsignal.`,
          fb:['',
            R`Der Vorfaktor stimmt: $\left(\tfrac{1}{\sqrt5}\right)^2 = \tfrac15$. Der Fehler steckt im zweiten Eintrag.`,
            R`Ein Normquadrat ist $\sum_n|\chi_n|^2$ und damit nie negativ. Ein negatives Ergebnis zeigt eine fehlende Konjugation an.`]}},
      {id:'form-t1f', title:'Funktionen: Aus der Summe wird ein Integral',
        pre:{from:'m-hilbert', seg:'mh-t1', title:'Funktionen sind Vektoren', text:R`Eine Funktion ist ein Vektor mit einer Komponente $f(x)$ für jedes $x$. Ihr Skalarprodukt ist $\langle f|g\rangle = \int f^*(x)\,g(x)\,dx$, mit denselben Rechenregeln wie in $\mathbb C^n$. Mini-Beispiel auf $[0, 1]$ mit $f = 1$ und $g = x$: $\langle f|g\rangle = \int_0^1 x\,dx = \tfrac12$.`},
        num:{title:'Kasten mit L = 1', text:R`$\psi_1(x) = \sqrt2\sin(\pi x)$ und $\psi_2(x) = \sqrt2\sin(2\pi x)$. Das Produkt $\psi_1\psi_2$ ist links von $x = \tfrac12$ positiv und rechts davon spiegelbildlich negativ. Die Flächen heben sich auf:

$$\langle\psi_1|\psi_2\rangle = \int_0^1 2\sin(\pi x)\sin(2\pi x)\,dx = 0.$$

Für $\psi_1$ mit sich selbst ist das Produkt überall positiv: $\langle\psi_1|\psi_1\rangle = \int_0^1 2\sin^2(\pi x)\,dx = 1$.`},
        text:R`Eine Wellenfunktion ist ein Vektor mit einer Komponente $\psi(x)$ für jede Stelle $x$. Dann wird aus dem Index $n$ die Variable $x$ und aus der Summe ein Integral:

$$\langle\phi|\psi\rangle = \int\phi^*(x)\,\psi(x)\,dx.$$

Das Integral ist die Fläche unter der Kurve $\phi^*\psi$, mit Vorzeichen. **Orthogonal** heißt dann: Positive und negative Flächen heben sich genau auf. Mit getrennten Orten hat das nichts zu tun – $\psi_1$ und $\psi_2$ sind fast überall beide von null verschieden. Die Tafel stellt die Gestalten des Skalarprodukts nebeneinander. Bei komplexen Funktionen gilt das Bild für Real- und Imaginärteil von $\phi^*\psi$ getrennt.`,
        reps:{obj:'Skalarprodukt zweier Zustände',
          rows:[
            {k:'worte', text:R`Wie weit zeigt $|\psi\rangle$ in Richtung $|\phi\rangle$? Ein Überlapp, mit Betrag und Phase.`},
            {k:'dirac', tex:R`\langle\phi|\psi\rangle`},
            {k:'matrix', tex:R`\left(\phi_1^*,\ \phi_2^*\right)\begin{pmatrix}\psi_1\\ \psi_2\end{pmatrix} = \phi_1^*\psi_1 + \phi_2^*\psi_2`},
            {k:'ort', tex:R`\int\phi^*(x)\,\psi(x)\,dx`},
            {k:'graph', plot:{x:[0, 1], y:[-1.7, 2.1], xlab:'x/L', ylab:R`\phi^*\psi`}, f:x => 2 * Math.sin(Math.PI * x) * Math.sin(2 * Math.PI * x), lab:R`\psi_1\psi_2`, f2:x => 2 * Math.sin(Math.PI * x) ** 2, lab2:R`\psi_1^2`,
              cap:R`Kurve $\psi_1\psi_2$: Die Flächen über und unter der Achse heben sich auf, also $\langle\psi_1|\psi_2\rangle = 0$. Zweite Kurve $\psi_1^2$: Fläche $1$, also $\langle\psi_1|\psi_1\rangle = 1$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Überlapp von $\psi$ mit $\phi$“: Der Zustand, in dessen Richtung du schaust, kommt in den Bra, der andere in den Ket.`},
            {from:'dirac', to:'matrix', rule:R`Bra als Zeile mit konjugierten Einträgen, Ket als Spalte; dann Zeile mal Spalte.`},
            {from:'matrix', to:'ort', rule:R`Der Index $n$ wird zur Variablen $x$, die Summe $\sum_n$ wird zum Integral $\int dx$. Konjugiert wird weiter die linke Funktion.`},
            {from:'ort', to:'graph', rule:R`Zeichne $\phi^*\psi$ über $x$. Das Integral ist die Fläche: über der Achse positiv, darunter negativ.`}
          ]},
        q:{q:R`Du siehst den Graphen von $\psi_1(x)\,\psi_3(x)$ im Kasten. Woran erkennst du, ob $\langle\psi_1|\psi_3\rangle = 0$ ist?`, tr:{from:'graph', to:'dirac'},
          opts:[R`Die Kurve hat mindestens eine Nullstelle im Inneren.`, R`Die Flächen über und unter der Achse sind gleich groß.`, R`$\psi_1$ und $\psi_3$ sind an verschiedenen Stellen groß.`], a:1,
          ex:R`Das Skalarprodukt ist die Fläche unter $\psi_1\psi_3$ mit Vorzeichen. Es ist null, wenn sich die Teilflächen genau aufheben.`,
          fb:[R`Nullstellen allein reichen nicht. $\psi_2^2$ hat bei $x = L/2$ eine Nullstelle und trotzdem die Fläche $1$. Es kommt auf die Größe der Teilflächen über und unter der Achse an.`,
            '',
            R`Orthogonal heißt nicht „an verschiedenen Orten“. $\psi_1$ und $\psi_3$ überlappen stark und sind trotzdem orthogonal.`]}},
      {id:'form-t1g', title:'Ein Zustand als Spalte, als Funktion, als Bild',
        num:{title:'Zwei Kastenzustände überlagert', text:R`Kasten mit $L = 1$ und $|\psi\rangle = \tfrac{1}{\sqrt2}\left(|\psi_1\rangle + |\psi_2\rangle\right)$. In der Basis der Kastenzustände ist das die Spalte $\tfrac{1}{\sqrt2}(1;\ 1;\ 0;\ 0;\ \dots)$. Als Funktion:

$$\psi(x) = \tfrac{1}{\sqrt2}\left(\psi_1(x) + \psi_2(x)\right) = \sin(\pi x) + \sin(2\pi x).$$

Bei $x = \tfrac14$ addieren sich die Anteile: $\psi = \tfrac{\sqrt2}{2} + 1 \approx 1{,}71$. Bei $x = \tfrac34$ heben sie sich teilweise auf: $\psi = \tfrac{\sqrt2}{2} - 1 \approx -0{,}29$.`},
        text:R`Jetzt hast du alle Teile für eine Übersetzung. Die Komponente eines Kets in einer Orthonormalbasis ist ein Skalarprodukt:

$$c_n = \langle n|\psi\rangle.$$

Denn $\langle m|\psi\rangle = \sum_n c_n\langle m|n\rangle = c_m$, weil $\langle m|n\rangle = \delta_{mn}$. Aus den Komponenten baust du die Funktion: $\psi(x) = \sum_n c_n\,\psi_n(x)$, jede Komponente mal ihre Basisfunktion. Achte auf die Reihenfolge: $\langle\psi|n\rangle = c_n^*$. Die Tafel zeigt den Weg von den Worten bis zum Bild.

**Ausblick:** In Abschnitt 5 siehst du, dass auch $\psi(x)$ selbst eine Komponente ist, nämlich $\langle x|\psi\rangle$.`,
        reps:{obj:'Ein Zustand im Kasten',
          rows:[
            {k:'worte', text:R`Je zur Hälfte Grundzustand und erster angeregter Zustand, ohne relative Phase.`},
            {k:'dirac', tex:R`|\psi\rangle = \tfrac{1}{\sqrt2}\left(|\psi_1\rangle + |\psi_2\rangle\right)`},
            {k:'matrix', tex:R`\begin{pmatrix}c_1\\ c_2\\ c_3\\ \vdots\end{pmatrix} = \frac{1}{\sqrt2}\begin{pmatrix}1\\ 1\\ 0\\ \vdots\end{pmatrix}`},
            {k:'ort', tex:R`\psi(x) = \sum_n c_n\psi_n(x) = \tfrac{1}{\sqrt L}\left(\sin\tfrac{\pi x}{L} + \sin\tfrac{2\pi x}{L}\right)`},
            {k:'graph', plot:{x:[0, 1], y:[-1, 2], xlab:'x/L', ylab:R`\psi\,\sqrt L`}, f:x => Math.sin(Math.PI * x) + Math.sin(2 * Math.PI * x),
              cap:R`$\psi(x)$ für $L = 1$: links groß, wo sich die Anteile addieren, rechts klein, wo sie sich teilweise aufheben.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`Jeder genannte Anteil wird ein Basisket mit Vorfaktor. „Je zur Hälfte“ meint die Wahrscheinlichkeiten $\tfrac12$ (Thema 3), also die Vorfaktoren $1/\sqrt2$.`},
            {from:'dirac', to:'matrix', rule:R`Die Vorfaktoren der Basiskets werden die Einträge, $c_n = \langle\psi_n|\psi\rangle$. Basiskets, die nicht vorkommen, geben eine $0$.`},
            {from:'matrix', to:'ort', rule:R`Jeden Eintrag $c_n$ mit seiner Basisfunktion $\psi_n(x)$ multiplizieren und alles addieren.`},
            {from:'ort', to:'graph', rule:R`Die Funktion Punkt für Punkt auswerten. Wo die Anteile gleiches Vorzeichen haben, addieren sie sich, sonst heben sie sich teilweise auf.`}
          ]},
        q:{q:R`Im Kasten hat ein Zustand die Spalte $(0;\ \tfrac{1}{\sqrt2};\ \tfrac{i}{\sqrt2};\ 0;\ \dots)$. Welche Wellenfunktion gehört dazu?`, tr:{from:'matrix', to:'ort'},
          opts:[R`$\tfrac{1}{\sqrt2}\left(\psi_1(x) + i\,\psi_2(x)\right)$`, R`$\tfrac{1}{\sqrt2}\left(\psi_2(x) + \psi_3(x)\right)$, denn die Phase $i$ zählt nicht`, R`$\tfrac{1}{\sqrt2}\left(\psi_2(x) + i\,\psi_3(x)\right)$`], a:2,
          ex:R`Der erste Eintrag gehört zu $\psi_1$, der zweite zu $\psi_2$, der dritte zu $\psi_3$. Die relative Phase $i$ bleibt stehen.`,
          fb:[R`Die Zählung beginnt bei $n = 1$: Der erste Eintrag ist $c_1 = 0$.`,
            R`Eine *relative* Phase zwischen zwei Anteilen ändert den Zustand, etwa die Dichte $|\psi|^2$. Nur eine gemeinsame Phase aller Anteile zählt nicht.`,
            '']}}
    ]},

    /* ===== Abschnitt 2: Operator ↔ Matrix ↔ Differentialoperator, hermitesch ===== */
    {id:'form-t2', title:'Postulat 2: Messgrößen sind hermitesche Operatoren', steps:[
      {id:'form-t2a', title:'Ein Operator als Matrix',
        pre:{from:'m-eigen', seg:'me-t1', title:'Matrix mal Vektor', text:R`Eine Matrix bildet Vektoren linear auf Vektoren ab. Ihre $j$-te Spalte ist das Bild des $j$-ten Basisvektors. Mini-Beispiel: $\begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}\begin{pmatrix}1\\ 0\end{pmatrix} = \begin{pmatrix}0\\ 1\end{pmatrix}$, die erste Spalte.`},
        num:{title:'Bilder der Basiszustände', text:R`Ein Operator $\hat\sigma_y$ mache aus den Basiszuständen $\hat\sigma_y|1\rangle = i|2\rangle$ und $\hat\sigma_y|2\rangle = -i|1\rangle$. Die Bilder werden die Spalten:

$$\hat\sigma_y \;\doteq\; \begin{pmatrix}0 & -i\\ i & 0\end{pmatrix}.$$

Das ist die Pauli-Matrix $\sigma_y$ aus M4. Ein einzelner Eintrag ist ein Skalarprodukt: $\langle 2|\hat\sigma_y|1\rangle = \langle 2|\left(i\,|2\rangle\right) = i$, Zeile 2, Spalte 1.`},
        text:R`Ein **Operator** $\hat A$, gelesen „A Dach“, macht aus jedem Ket linear einen neuen Ket. In einer Basis wird er zur Matrix. Ihre Einträge sind die **Matrixelemente**

$$A_{mn} = \langle m|\hat A|n\rangle,$$

gelesen „m, A, n“. Wende $\hat A$ auf $|n\rangle$ an und nimm vom Ergebnis die Komponente entlang $|m\rangle$. Der Bra bestimmt die Zeile, der Ket die Spalte. Dann ist $\hat A|\psi\rangle$ einfach Matrix mal Spalte: $(A\psi)_m = \sum_n A_{mn}c_n$. Für Spin ½ (Thema 10) sind alle Operatoren solche $2\times2$-Matrizen. Im Kasten werden sie unendlich groß.`,
        q:{q:R`Welchen Wert hat $\langle 1|\hat\sigma_y|2\rangle$, der Eintrag in Zeile 1, Spalte 2?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$i$`, R`$-i$`, R`$0$`], a:1,
          ex:R`$\hat\sigma_y|2\rangle = -i|1\rangle$, davon die Komponente entlang $|1\rangle$: $-i$.`,
          fb:[R`Das ist $\langle 2|\hat\sigma_y|1\rangle$, Zeile 2, Spalte 1. Der Bra bestimmt die Zeile.`,
            '',
            R`$\hat\sigma_y|2\rangle$ hat sehr wohl eine Komponente entlang $|1\rangle$, nämlich $-i$. Null ist $\langle 2|\hat\sigma_y|2\rangle$.`]}},
      {id:'form-t2b', title:'Ein Operator auf Funktionen',
        pre:{from:'wf', seg:'wf-t6', title:'Der Impulsoperator', text:R`In Thema 1 kam $\hat p = -i\hbar\,\partial/\partial x$ ins Spiel: $\langle p\rangle = \int\psi^*\left(-i\hbar\,\partial_x\psi\right)dx$, so wie $\langle x\rangle = \int\psi^*\,x\,\psi\,dx$. Der Operator steht zwischen $\psi^*$ und $\psi$ und wirkt nach rechts.`},
        num:{title:'Eine Gauß-Funktion', text:R`Nimm $\psi(x) = e^{-x^2/2}$. Der Ortsoperator multipliziert: $\hat x\psi = x\,e^{-x^2/2}$. Der Impulsoperator leitet ab:

$$\hat p\psi = -i\hbar\frac{d}{dx}e^{-x^2/2} = -i\hbar\cdot(-x)\,e^{-x^2/2} = i\hbar\,x\,e^{-x^2/2}.$$

Beide Ergebnisse sind wieder Funktionen, aber keine Vielfachen von $\psi$.`},
        text:R`In der Ortsdarstellung ist ein Ket eine Funktion. Ein Operator ist dann eine Rechenvorschrift für Funktionen. Die zwei wichtigsten: Der **Ortsoperator** $\hat x$ multipliziert mit $x$. Der [[lex:impulsoperator|Impulsoperator]]

$$\hat p = -i\hbar\frac{d}{dx}$$

leitet ab und multipliziert mit $-i\hbar$. Aus beiden baust du andere Operatoren: $\hat H = \hat p^2/2m + V(\hat x)$ heißt auf Funktionen $-\frac{\hbar^2}{2m}\psi'' + V\psi$. Ein Operator wirkt immer auf alles, was rechts von ihm steht. Deshalb ist $\hat p\,\hat x\,\psi = -i\hbar\,(x\psi)'$, und die Produktregel gehört dazu.`,
        q:{q:R`Was ergibt $\hat p$ angewandt auf $f(x) = x^2$?`,
          opts:[R`$-2i\hbar\,x$`, R`$2x$, denn $\hat p$ ist die Ableitung`, R`$-i\hbar\,x^2$`], a:0,
          ex:R`$\hat pf = -i\hbar\,\frac{d}{dx}x^2 = -2i\hbar\,x$.`,
          fb:['',
            R`Der Faktor $-i\hbar$ gehört zum Operator. Ohne ihn hättest du nur $d/dx$, und das ist kein Impuls.`,
            R`$\hat p$ multipliziert nicht nur, es leitet ab. Multiplizieren tut $\hat x$.`]}},
      {id:'form-t2c', title:'Matrixelemente als Integrale',
        num:{title:'Der Ortsoperator im Kasten', text:R`Kasten mit $\psi_n(x) = \sqrt{2/L}\sin(n\pi x/L)$. Das Diagonalelement $\langle\psi_1|\hat x|\psi_1\rangle = \int_0^L x\,\psi_1^2\,dx = L/2$ ist die Kastenmitte. Das Nebendiagonalelement ist

$$\langle\psi_1|\hat x|\psi_2\rangle = \int_0^L\psi_1(x)\,x\,\psi_2(x)\,dx = -\frac{16L}{9\pi^2} \approx -0{,}18\,L.$$

Es ist negativ: Der Integrand ist rechts der Mitte negativ und dort wegen des Faktors $x$ dem Betrag nach größer als links positiv.`},
        text:R`Matrix und Differentialoperator sind zwei Darstellungen desselben Operators. Die Brücke ist das Matrixelement:

$$\langle m|\hat A|n\rangle = \int\psi_m^*(x)\,\big(\hat A\psi_n\big)(x)\,dx.$$

Erst wirkt $\hat A$ auf $\psi_n$, dann bildest du das Skalarprodukt mit $\psi_m$. So bekommt jeder Differentialoperator in einer Basis eine Matrix, im Kasten eine unendlich große. Umgekehrt verrät eine Matrix allein nicht, wie der Operator auf Funktionen wirkt. Das sagt erst die Ortsdarstellung. Die Tafel zeigt den Ortsoperator im Kasten in allen Gestalten.`,
        reps:{obj:'Der Ortsoperator im Kasten',
          rows:[
            {k:'worte', text:R`Multipliziere die Wellenfunktion mit dem Ort $x$.`},
            {k:'dirac', tex:R`\hat x|\psi\rangle,\qquad x_{mn} = \langle\psi_m|\hat x|\psi_n\rangle`},
            {k:'ort', tex:R`(\hat x\psi)(x) = x\,\psi(x),\qquad x_{mn} = \int_0^L\psi_m(x)\,x\,\psi_n(x)\,dx`},
            {k:'graph', plot:{x:[0, 1], y:[-1.2, 0.6], xlab:'x/L', ylab:R`\psi_1\,x\,\psi_2`}, f:x => 2 * x * Math.sin(Math.PI * x) * Math.sin(2 * Math.PI * x),
              cap:R`Integrand von $x_{12}$ für $L = 1$: Die Fläche unter der Achse überwiegt, $x_{12} \approx -0{,}18$.`},
            {k:'matrix', tex:R`\begin{pmatrix}x_{11} & x_{12}\\ x_{21} & x_{22}\end{pmatrix} = \begin{pmatrix}L/2 & -\frac{16L}{9\pi^2}\\ -\frac{16L}{9\pi^2} & L/2\end{pmatrix}\quad(\text{Ausschnitt})`},
            {k:'physik', text:R`Die Diagonale enthält den mittleren Ort $\langle x\rangle$ in $\psi_1$ bzw. $\psi_2$. Das Nebendiagonalelement koppelt beide: Es bestimmt, wie weit $\langle x\rangle$ in einer Überlagerung hin- und herschwingt.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Der Operator wirkt auf den Zustand“: $\hat x$ steht links vom Ket.`},
            {from:'dirac', to:'ort', rule:R`Kets durch Funktionen ersetzen. $\hat x$ wird „mal $x$“, der Bra wird $\psi_m^*$, und das Skalarprodukt wird $\int dx$.`},
            {from:'ort', to:'graph', rule:R`Den Integranden $\psi_m\,x\,\psi_n$ zeichnen; das Matrixelement ist seine Fläche mit Vorzeichen.`},
            {from:'graph', to:'matrix', rule:R`Für jedes Paar $(m, n)$ eine Fläche bestimmen und in Zeile $m$, Spalte $n$ eintragen.`},
            {from:'matrix', to:'physik', rule:R`Diagonalelemente sind Mittelwerte in einem Basiszustand, Nebendiagonalelemente koppeln zwei Basiszustände.`}
          ]},
        q:{q:R`Wie lautet $\langle\psi_2|\hat p|\psi_1\rangle$ im Kasten als Integral?`, tr:{from:'dirac', to:'ort'},
          opts:[R`$\int_0^L\psi_1(x)\,(-i\hbar)\,\psi_2'(x)\,dx$`, R`$\int_0^L(-i\hbar)\,\psi_2'(x)\,\psi_1'(x)\,dx$`, R`$\int_0^L\psi_2(x)\,(-i\hbar)\,\psi_1'(x)\,dx$`], a:2,
          ex:R`Der Operator wirkt auf den Ket $\psi_1$, der Bra liefert $\psi_2^* = \psi_2$. Das Ergebnis ist $-\frac{8i\hbar}{3L}$.`,
          fb:[R`Hier wirkt $\hat p$ auf $\psi_2$. Das ist $\langle\psi_1|\hat p|\psi_2\rangle$, das andere Nebendiagonalelement.`,
            R`Abgeleitet wird nur die Funktion im Ket, rechts vom Operator. Der Bra bleibt unverändert.`,
            '']}},
      {id:'form-t2d', title:'Adjungiert und hermitesch',
        pre:{from:'m-eigen', seg:'me-t2', title:'Die adjungierte Matrix', text:R`$A^\dagger$ entsteht durch Transponieren und Konjugieren: $(A^\dagger)_{ij} = A_{ji}^*$. Sie ist die Matrix, die man im Skalarprodukt nach links schieben darf: $\langle u|Av\rangle = \langle A^\dagger u|v\rangle$. Mini-Beispiel: $\begin{pmatrix}1 & 2i\\ 0 & 3\end{pmatrix}^\dagger = \begin{pmatrix}1 & 0\\ -2i & 3\end{pmatrix}$.`},
        num:{title:'Spiegeln und konjugieren', text:R`Für $\sigma_y = \begin{pmatrix}0 & -i\\ i & 0\end{pmatrix}$ gibt Transponieren $\begin{pmatrix}0 & i\\ -i & 0\end{pmatrix}$, Konjugieren dann wieder $\begin{pmatrix}0 & -i\\ i & 0\end{pmatrix}$. Also ist $\sigma_y^\dagger = \sigma_y$, obwohl die Einträge imaginär sind. Die Kastenmatrix von $\hat x$ aus dem letzten Schritt ist reell und symmetrisch, also ebenfalls gleich ihrer Adjungierten.`},
        text:R`Zu jedem Operator gehört der [[lex:adjungierte|adjungierte]] Operator $\hat A^\dagger$, gelesen „A dagger“. Er ist definiert durch

$$\langle\phi|\hat A\psi\rangle = \langle\hat A^\dagger\phi|\psi\rangle\quad\text{für alle }\phi, \psi.$$

In einer Basis heißt das: transponieren und konjugieren, $(A^\dagger)_{mn} = A_{nm}^*$. Beim Produkt dreht sich die Reihenfolge um: $(\hat A\hat B)^\dagger = \hat B^\dagger\hat A^\dagger$.

Ein Operator mit $\hat A^\dagger = \hat A$ heißt [[lex:hermitescher-operator|hermitesch]]. Seine Matrix ist an der Diagonale gespiegelt gleich ihrer Konjugierten: $A_{mn} = A_{nm}^*$. Die Diagonale ist deshalb reell.`,
        q:{q:R`$\hat A$ und $\hat B$ sind hermitesch. Ist $\hat A\hat B$ hermitesch?`,
          opts:['nur wenn $\\hat A\\hat B = \\hat B\\hat A$, denn $(\\hat A\\hat B)^\\dagger = \\hat B\\hat A$', 'immer, denn $(\\hat A\\hat B)^\\dagger = \\hat A^\\dagger\\hat B^\\dagger = \\hat A\\hat B$', 'nie, denn $(\\hat A\\hat B)^\\dagger = -\\hat A\\hat B$'], a:0,
          ex:R`$(\hat A\hat B)^\dagger = \hat B^\dagger\hat A^\dagger = \hat B\hat A$. Das ist genau dann $\hat A\hat B$, wenn die Operatoren vertauschen.`,
          fb:['',
            R`Beim Adjungieren dreht sich die Reihenfolge um. $(\hat A\hat B)^\dagger = \hat B\hat A$ ist im Allgemeinen ein anderer Operator.`,
            R`Vertauschen $\hat A$ und $\hat B$, ist $\hat A\hat B$ sehr wohl hermitesch, etwa $\hat x\cdot\hat x = \hat x^2$.`]}},
      {id:'form-t2e', title:'Postulat 2: Warum Messgrößen hermitesch sind',
        num:{title:R`Eigenwerte von $\sigma_y$`, text:R`$\sigma_y$ hat die Eigenvektoren $|a_\pm\rangle \doteq \tfrac{1}{\sqrt2}\begin{pmatrix}1\\ \pm i\end{pmatrix}$. Probe: $\sigma_y\begin{pmatrix}1\\ i\end{pmatrix} = \begin{pmatrix}(-i)\cdot i\\ i\end{pmatrix} = \begin{pmatrix}1\\ i\end{pmatrix}$, also Eigenwert $+1$; ebenso $-1$ für $(1;\ -i)$. Beide Eigenwerte sind reell, und die Eigenvektoren sind orthogonal: $\langle a_+|a_-\rangle = \tfrac12\left(1 + (-i)(-i)\right) = 0$.`},
        text:R`**Postulat 2.** Jeder Messgröße entspricht ein hermitescher Operator. Man nennt ihn **Observable**.

Warum gerade hermitesch? Für $\hat A^\dagger = \hat A$ gilt dreierlei:

1. *Die Eigenwerte sind reell.* Aus $\hat A|a\rangle = a|a\rangle$ folgt $a\langle a|a\rangle = \langle a|\hat Aa\rangle = \langle\hat Aa|a\rangle = a^*\langle a|a\rangle$, also $a = a^*$. Messwerte sind reelle Zahlen.
2. *Eigenvektoren zu verschiedenen Eigenwerten sind orthogonal.* Aus $\hat A|b\rangle = b|b\rangle$ mit reellem $b$ folgt ebenso $a\langle b|a\rangle = \langle b|\hat Aa\rangle = \langle\hat Ab|a\rangle = b\langle b|a\rangle$, also $(a - b)\langle b|a\rangle = 0$. Für $a \ne b$ ist $\langle b|a\rangle = 0$. Die Ergebnisse $a$ und $b$ schließen sich gegenseitig aus.
3. *Die Eigenvektoren bilden eine Orthonormalbasis.* Für Matrizen ist das der Spektralsatz ([[lex:diagonalisierung|Diagonalisierung]], M4); in unendlich vielen Dimensionen fordert man es für Observable zusätzlich.`,
        q:{q:R`Ein Operator hat den Eigenwert $2 + i$. Was folgt?`,
          opts:[R`Eine Messung liefert entweder den Wert $2$ oder den Wert $1$.`, R`Eine Messung liefert den Betrag $|2 + i| = \sqrt5$.`, R`Er ist nicht hermitesch und kann keine Messgröße sein.`], a:2,
          ex:R`Hermitesche Operatoren haben nur reelle Eigenwerte. Ein komplexer Eigenwert schließt eine Observable aus.`,
          fb:[R`Real- und Imaginärteil sind keine getrennten Messwerte. Ein komplexer Eigenwert zeigt: Der Operator ist keine Observable.`,
            R`Einen Betrag zu nehmen, ist keine Regel der Quantenmechanik. Messwerte sind Eigenwerte, und die einer Observablen sind reell.`,
            '']}},
      {id:'form-t2f', title:'Hermitesch in der Ortsdarstellung',
        pre:{from:'m-hilbert', seg:'mh-t5', title:'Wann ist ein Differentialoperator hermitesch?', text:R`Partielle Integration mit verschwindendem Randterm gibt für $D = d/dx$: $\langle f|Dg\rangle = \int f^*g'\,dx = -\int(f^*)'g\,dx = -\langle Df|g\rangle$. Also ist $D$ antihermitesch, und $-iD$ ist hermitesch. Der Randterm $[f^*g]$ verschwindet für Funktionen, die im Unendlichen abfallen oder an Kastenwänden null sind.`},
        num:{title:'Die Impulsmatrix im Kasten', text:R`Im Kasten ist $\langle\psi_1|\hat p|\psi_2\rangle = \frac{8i\hbar}{3L}$ und $\langle\psi_2|\hat p|\psi_1\rangle = -\frac{8i\hbar}{3L}$. Gespiegelt und konjugiert stimmen sie überein: Die Matrix von $\hat p$ ist hermitesch, obwohl ihre Einträge imaginär sind. Ohne den Faktor $-i\hbar$ wären die Einträge $-\frac{8}{3L}$ und $+\frac{8}{3L}$: Spiegeln dreht das Vorzeichen, $d/dx$ ist antihermitesch.`},
        text:R`Für Differentialoperatoren zeigst du $\langle f|\hat Ag\rangle = \langle\hat Af|g\rangle$ mit [[lex:partielle-integration|partieller Integration]]. Jede partielle Integration schiebt eine Ableitung von $g$ auf $f$ und bringt ein Minuszeichen. Die Randterme verschwinden, weil zulässige Funktionen im Unendlichen abfallen ([[lex:randterme-hermitesch|Randterme]], M5).

Für $\hat p$ reicht eine partielle Integration. Ihr Minus hebt sich gegen das Minus aus $i^* = -i$ weg; das vorgerechnete Beispiel nach dem Erklärteil zeigt es. Die Herleitung hier behandelt $\hat H = \hat p^2/2m + V$. Dort sind es zwei partielle Integrationen, deren Minuszeichen sich aufheben, und $V$ muss reell sein.`,
        derive:{ctx:FORM_FG(), lines:[
          {l:'⟨f|Ĥ g⟩ = ∫_-∞^∞ f^* (-ħ^2/(2m) g\'\' + V g) dx', w:'Ortsdarstellung, Bra konjugiert',
            why:{q:'Was steht im Integral für das Bra $\\langle f|$?', opts:['$f^*$, die konjugierte Funktion', '$f$ ohne Konjugation', '$f\'$, die Ableitung von $f$'], a:0, ex:'Wie bei Vektoren wird im Bra konjugiert.'}},
          {l:'= -ħ^2/(2m) ∫_-∞^∞ f^* g\'\' dx + ∫_-∞^∞ V f^* g dx', w:'Integral aufgeteilt'},
          {l:'= ħ^2/(2m) ∫_-∞^∞ (f^*)\' g\' dx + ∫_-∞^∞ V f^* g dx', w:'einmal partiell integriert, Randterm 0',
            why:{q:'Warum dreht sich das Vorzeichen vor dem ersten Integral um?', opts:['Weil partielle Integration ein Minus bringt.', 'Weil das Potential $V$ reell ist.', 'Weil im Bra $f^*$ steht und $i^* = -i$ gilt.'], a:0, ex:'$\\int f^*g\'\'dx = [f^*g\']_{-\\infty}^{\\infty} - \\int (f^*)\'g\'dx$. Der Randterm $[f^*g\']_{-\\infty}^{\\infty}$ ist null, weil zulässige Funktionen im Unendlichen abfallen.'}},
          {l:'= -ħ^2/(2m) ∫_-∞^∞ (f^*)\'\' g dx + ∫_-∞^∞ V f^* g dx', w:'noch einmal partiell integriert, Randterm 0',
            why:{q:'Warum steht nach zwei partiellen Integrationen wieder das ursprüngliche Vorzeichen?', opts:['Jede partielle Integration bringt ein Minus; zwei heben sich auf.', 'Partielle Integration ändert das Vorzeichen nie, nur die Ableitungen.', 'Weil das Potential $V$ reell ist und das Vorzeichen festlegt.'], a:0, ex:'$\\int f^*g\'\'dx = -\\int (f^*)\'g\'dx = +\\int (f^*)\'\'g\\,dx$, solange die Randterme verschwinden.'}},
          {l:'= ∫_-∞^∞ (-ħ^2/(2m) (f^*)\'\' + V f^*) g dx', w:'zu einem Integral zusammengefasst'},
          {l:'= ∫_-∞^∞ (-ħ^2/(2m) f\'\' + V f)^* g dx', w:'V reell, Konjugation nach außen gezogen',
            why:{q:'Wo wird benutzt, dass $V$ reell ist?', opts:['$Vf^* = (Vf)^*$ gilt nur für reelles $V$.', 'beim partiellen Integrieren von $\\int f^*g\'\'\\,dx$', 'nirgends; $Vf^* = (Vf)^*$ gilt für jedes $V$'], a:0, ex:'Ein komplexes Potential (etwa zur Beschreibung von Absorption) ist nicht hermitesch.'}},
          {l:'= ⟨Ĥ f|g⟩', w:'Definition des Skalarprodukts'}
        ]},
        q:{q:R`Warum ist $d/dx$ allein nicht hermitesch, $-i\hbar\,d/dx$ aber schon?`,
          opts:['Weil erst $\\hbar$ die Einheit eines Impulses herstellt.', 'Weil das $i$ das Minus der partiellen Integration ausgleicht.', 'Weil $d/dx$ an den Rändern nicht verschwindet.'], a:1,
          ex:R`$\langle f|Dg\rangle = -\langle Df|g\rangle$. Mit dem Faktor $-i$ kommt beim Herüberziehen in den Bra $(-i)^* = i = -(-i)$ hinzu, und die beiden Minuszeichen heben sich auf.`,
          fb:[R`Die Einheit ändert nichts an der Hermitezität. Entscheidend ist das Vorzeichen aus der partiellen Integration und das $i$.`,
            '',
            R`Verschwinden müssen die Funktionen am Rand, nicht der Operator. Dann ist der Randterm null – für $d/dx$ wie für $-i\hbar\,d/dx$.`]}},
      {id:'form-t2g', title:'Typischer Fehler: symmetrisch statt hermitesch',
        num:{title:'Symmetrisch, aber nicht hermitesch', text:R`$B = \begin{pmatrix}1 & i\\ i & 1\end{pmatrix}$ ist symmetrisch, $B^T = B$. Konjugiert ist aber $B^\dagger = \begin{pmatrix}1 & -i\\ -i & 1\end{pmatrix} \ne B$. Die Eigenwerte sind $1 \pm i$ – keine möglichen Messwerte.`},
        text:R`Bei reellen Matrizen heißt hermitesch dasselbe wie symmetrisch. Bei komplexen nicht: Gespiegelte Einträge müssen *konjugiert* gleich sein, $A_{mn} = A_{nm}^*$. Umgekehrt sind imaginäre Einträge kein Hindernis, wie $\sigma_y$ zeigt.

Hermitesch sind $\hat x$, $\hat p$, $\hat H$ mit reellem $V$ und die Pauli-Matrizen. Nicht hermitesch sind etwa $d/dx$ und $\begin{pmatrix}0 & 1\\ 0 & 0\end{pmatrix}$. Ein schneller Test für eine Matrix: Ist die Diagonale reell, und ist jeder Eintrag die Konjugierte seines Spiegelbilds? **Ausblick:** In Thema 7 kommt mit dem Absteigeoperator des Oszillators ein wichtiger nicht hermitescher Operator hinzu.`,
        q:{q:R`Für welches $b$ ist $\begin{pmatrix}2 & 3 + i\\ b & 5\end{pmatrix}$ hermitesch?`,
          opts:[R`$b = 3 + i$`, R`$b = 3 - i$`, R`$b = -3 - i$`], a:1,
          ex:R`Hermitesch verlangt $A_{21} = A_{12}^* = (3 + i)^* = 3 - i$. Die Diagonale $2, 5$ ist reell.`,
          fb:[R`Das macht die Matrix symmetrisch, nicht hermitesch. Der gespiegelte Eintrag muss konjugiert sein.`,
            '',
            R`Konjugieren dreht nur das Vorzeichen von $i$. Mit $-3 - i$ wäre die Matrix weder symmetrisch noch hermitesch.`]}}
    ]},

    /* ===== Abschnitt 3: Eigenwertgleichung, Entwicklung, Born-Regel, Erwartungswert ===== */
    {id:'form-t3', title:'Postulate 3 und 4: Messwerte und ihre Wahrscheinlichkeiten', steps:[
      {id:'form-t3a', title:'Postulat 3: Messwerte sind Eigenwerte',
        num:{title:'Einmal Matrix, einmal Funktion', text:R`Matrix: Für $\sigma_y$ ist $\det(\sigma_y - a\mathbb 1) = \det\begin{pmatrix}-a & -i\\ i & -a\end{pmatrix} = a^2 - 1 = 0$, also sind $a = \pm1$ die möglichen Messwerte.

Funktion: $\hat p\,e^{ikx} = -i\hbar\cdot ik\,e^{ikx} = \hbar k\,e^{ikx}$. Für $k = 3\,\mathrm{nm}^{-1}$ ist der Eigenwert $p = 3\hbar/\mathrm{nm} \approx 3{,}2\cdot10^{-25}\,\mathrm{kg\,m/s}$.`},
        text:R`**Postulat 3.** Eine Messung von $\hat A$ liefert immer einen Eigenwert $a$ von $\hat A$ – nie etwas anderes. Gesucht sind also die Lösungen der **Eigenwertgleichung**

$$\hat A|a\rangle = a\,|a\rangle,$$

gelesen „A auf Ket a gibt a mal Ket a“. Sie sieht je nach Darstellung anders aus. In einer Basis ist sie ein lineares Gleichungssystem, $(A - a\mathbb 1)v = 0$; die Bedingung $\det(A - a\mathbb 1) = 0$ liefert die Eigenwerte (M4). In der Ortsdarstellung ist sie eine Differentialgleichung, etwa $-i\hbar f' = pf$. Im Kasten kennst du sie als stationäre Schrödingergleichung. Dort sorgen die Randbedingungen dafür, dass nur einzelne Energien vorkommen.`,
        reps:{obj:'Eigenwertgleichung',
          rows:[
            {k:'worte', text:R`Gesucht sind Zustände, die der Operator nur mit einer Zahl multipliziert. Die Zahl ist ein möglicher Messwert.`},
            {k:'dirac', tex:R`\hat A|a\rangle = a\,|a\rangle`},
            {k:'matrix', tex:R`\begin{pmatrix}0 & -i\\ i & 0\end{pmatrix}\begin{pmatrix}v_1\\ v_2\end{pmatrix} = a\begin{pmatrix}v_1\\ v_2\end{pmatrix},\qquad \det(\sigma_y - a\mathbb 1) = a^2 - 1 = 0`},
            {k:'ort', tex:R`\begin{gathered}-i\hbar\,f'(x) = p\,f(x)\;\Rightarrow\; f = e^{ipx/\hbar};\\ -\tfrac{\hbar^2}{2m}\psi'' = E\psi,\ \ \psi(0) = \psi(L) = 0\end{gathered}`},
            {k:'mathe', text:R`Eigenwertproblem einer hermiteschen Matrix (M4) bzw. Randwertproblem einer linearen Differentialgleichung (M7)`},
            {k:'physik', text:R`Die Eigenwerte sind die einzig möglichen Messergebnisse. Im Eigenzustand $|a\rangle$ ist das Ergebnis sicher $a$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`Derselbe Zustand steht links im Ket und rechts, mit der Zahl $a$ davor.`},
            {from:'dirac', to:'matrix', rule:R`Ket als Spalte, Operator als Matrix. Aus $a|a\rangle$ wird $a\,\mathbb 1\,v$, also $(A - a\mathbb 1)v = 0$.`},
            {from:'matrix', to:'ort', rule:R`Statt Matrix mal Spalte wirkt ein Differentialoperator auf eine Funktion. Aus dem Gleichungssystem wird eine Differentialgleichung.`},
            {from:'ort', to:'mathe', rule:R`Lösbar ist das nur für bestimmte $a$: bei der Matrix wegen $\det = 0$, bei der Differentialgleichung wegen der Randbedingungen.`},
            {from:'mathe', to:'physik', rule:R`Die Lösungen $a$ des Mathe-Problems bilden das Spektrum, also die Liste der möglichen Messwerte.`}
          ]},
        q:{q:R`Wie lautet die Eigenwertgleichung $\hat p|p\rangle = p\,|p\rangle$ in der Ortsdarstellung?`, tr:{from:'dirac', to:'ort'},
          opts:[R`$f'(x) = p\,f(x)$`, R`$-i\hbar\,f'(x) = p\,f(x)$`, R`$-i\hbar\,f'(x) = p$`], a:1,
          ex:R`Ket wird Funktion $f$, $\hat p$ wird $-i\hbar\,d/dx$, und rechts steht der Eigenwert mal dieselbe Funktion.`,
          fb:[R`Der Faktor $-i\hbar$ gehört zum Impulsoperator. Ohne ihn wäre $p$ hier keine reelle Zahl für eine Welle.`,
            '',
            R`Auf der rechten Seite fehlt die Funktion. $a|a\rangle$ heißt „Zahl mal derselbe Zustand“.`]}},
      {id:'form-t3b', title:'Entwickeln nach der Eigenbasis: Komponenten als Projektionen',
        pre:{from:'m-vektor', seg:'mv-t4', title:'Projektion', text:R`Die Projektion von $v$ auf einen normierten Vektor $e$ ist $\langle e|v\rangle\,e$; der Rest steht senkrecht auf $e$. In einer Orthonormalbasis ist jede Komponente ein Skalarprodukt, $c_i = \langle e_i|v\rangle$, und es gilt $\sum_i|e_i\rangle\langle e_i| = \mathbb 1$. Mini-Beispiel: $v = (2;\ 1)$ auf $e = (1;\ 0)$ projiziert gibt $(2;\ 0)$, der Rest ist $(0;\ 1)$.`},
        num:{title:'Zerlegen in zwei Richtungen', text:R`Die Observable $\hat B \doteq \sigma_x = \begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}$ hat die Eigenvektoren $|\pm\rangle \doteq \tfrac{1}{\sqrt2}(1;\ \pm1)$ zu den Eigenwerten $\pm1$ – für ein Photon die Polarisation unter $\pm45°$. Für $|\psi\rangle \doteq \tfrac{1}{\sqrt5}(2;\ 1)$ ist

$$c_+ = \langle +|\psi\rangle = \frac{2 + 1}{\sqrt{10}} = \frac{3}{\sqrt{10}},\qquad c_- = \langle -|\psi\rangle = \frac{2 - 1}{\sqrt{10}} = \frac{1}{\sqrt{10}}.$$

Probe: $c_+|+\rangle + c_-|-\rangle \doteq \tfrac{1}{\sqrt{20}}(3 + 1;\ 3 - 1) = \tfrac{1}{\sqrt5}(2;\ 1)$.`},
        text:R`Die Eigenvektoren einer Observablen bilden eine Orthonormalbasis. Also kannst du jeden Zustand nach ihnen entwickeln:

$$|\psi\rangle = \sum_n c_n|a_n\rangle,\qquad c_n = \langle a_n|\psi\rangle.$$

Geometrisch ist $c_n|a_n\rangle$ die [[lex:projektion|Projektion]] von $|\psi\rangle$ auf die Richtung $|a_n\rangle$ (M3). Setzt du $c_n$ ein, steht da $|\psi\rangle = \sum_n|a_n\rangle\langle a_n|\psi\rangle$. Also ist

$$\sum_n|a_n\rangle\langle a_n| = \hat 1,$$

die **Vollständigkeitsrelation**. Mit ihr schiebst du an jeder Stelle eine Eins ein. So folgt etwa $\langle\phi|\psi\rangle = \sum_n\langle\phi|a_n\rangle\langle a_n|\psi\rangle$: Skalarprodukte rechnest du in jeder Orthonormalbasis mit den Komponenten aus.`,
        q:{q:R`$\hat B$ wie im Beispiel, jetzt mit $|\psi\rangle \doteq \tfrac{1}{\sqrt5}(i;\ 2)$. Welche Komponente $c_-$ hat $|\psi\rangle$ entlang $|-\rangle$?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$-\tfrac{2 + i}{\sqrt{10}}$`, R`$\tfrac{2 + i}{\sqrt{10}}$`, R`$\tfrac{i - 2}{\sqrt{10}}$`, R`$\tfrac12$`], a:2,
          ex:R`$c_- = \langle -|\psi\rangle = \tfrac{1}{\sqrt2}(1,\ -1)\,\tfrac{1}{\sqrt5}\begin{pmatrix}i\\ 2\end{pmatrix} = \tfrac{i - 2}{\sqrt{10}}$. Die Reihenfolge zählt: $\langle\psi|-\rangle = c_-^*$.`,
          fb:[R`Das ist $\langle\psi|-\rangle = c_-^*$: Hier wurde $|\psi\rangle$ konjugiert. In $c_- = \langle -|\psi\rangle$ steht der Basisvektor im Bra.`,
            R`Das ist $c_+ = \langle +|\psi\rangle$. Für $c_-$ steht im Bra die Zeile $\tfrac{1}{\sqrt2}(1,\ -1)$.`,
            '',
            R`Das ist $|c_-|^2$, schon eine Wahrscheinlichkeit (nächster Schritt). Die Komponente selbst ist eine komplexe Zahl mit Phase.`]}},
      {id:'form-t3c', title:'Postulat 4: die Born-Regel',
        num:{title:'Zählraten vorhersagen', text:R`Im Beispiel ist $P(+1) = |c_+|^2 = \tfrac{9}{10}$ und $P(-1) = |c_-|^2 = \tfrac{1}{10}$, zusammen $1$. Von 1000 gleich präparierten Systemen liefern also etwa 900 den Wert $+1$ und etwa 100 den Wert $-1$.`},
        text:R`**Postulat 4 (Born-Regel).** Die Messung von $\hat A$ im Zustand $|\psi\rangle$ liefert den Eigenwert $a_n$ mit der Wahrscheinlichkeit

$$P(a_n) = |c_n|^2 = |\langle a_n|\psi\rangle|^2.$$

Das ist das [[lex:messpostulat|Messpostulat]]. Aus Thema 3 kennst du es für die Energie im Kasten; hier gilt es für jede Observable. Die Wahrscheinlichkeiten summieren sich zu $\sum_n|c_n|^2 = \langle\psi|\psi\rangle = 1$. Deshalb müssen Zustände normiert sein.

Die Born-Regel folgt nicht aus der Schrödingergleichung. Sie ist eine eigene Annahme, die den Formalismus mit den Zählraten im Experiment verbindet. Ihre Vorhersagen stimmen bisher in allen Experimenten – vom Doppelspalt bis zur Spektroskopie.`,
        reps:{obj:'Wahrscheinlichkeit eines Messwerts',
          rows:[
            {k:'worte', text:R`Wie groß ist der Anteil von $|\psi\rangle$ in Richtung des Eigenvektors – zum Quadrat genommen?`},
            {k:'dirac', tex:R`P(a_n) = |\langle a_n|\psi\rangle|^2`},
            {k:'matrix', tex:R`P(+1) = \left|\tfrac{1}{\sqrt2}(1,\ 1)\,\tfrac{1}{\sqrt5}\begin{pmatrix}2\\ 1\end{pmatrix}\right|^2 = \tfrac{9}{10}`},
            {k:'ort', tex:R`P(E_n) = \left|\int_0^L\psi_n^*(x)\,\psi(x)\,dx\right|^2`},
            {k:'mathe', text:R`Länge der Projektion von $|\psi\rangle$ auf den Eigenvektor, zum Quadrat (M3)`},
            {k:'physik', text:R`relative Häufigkeit des Ergebnisses $a_n$ in vielen Messungen an gleich präparierten Systemen`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`Den Anteil in Richtung $|a_n\rangle$ liefert das Skalarprodukt mit dem Bra $\langle a_n|$; danach das Betragsquadrat.`},
            {from:'dirac', to:'matrix', rule:R`Eigenvektor als konjugierte Zeile, Zustand als Spalte, Zeile mal Spalte, dann Betragsquadrat.`},
            {from:'matrix', to:'ort', rule:R`Statt der Summe über Komponenten ein Integral über $x$. Der Eigenvektor wird zur Eigenfunktion $\psi_n(x)$.`},
            {from:'ort', to:'mathe', rule:R`Das Integral ist die Komponente entlang $\psi_n$. Ihr Betragsquadrat ist die quadrierte Länge der Projektion.`},
            {from:'mathe', to:'physik', rule:R`Je länger die Projektion auf $|a_n\rangle$, desto häufiger das Ergebnis $a_n$. Alle Quadrate zusammen ergeben $1$.`}
          ]},
        q:{q:R`Ein normierter Zustand hat entlang des Eigenvektors $|a_1\rangle$ die Projektionslänge $0{,}6$. Was bedeutet das für die Messung?`, tr:{from:'mathe', to:'physik'},
          opts:[R`Etwa 36 % der Messungen ergeben $a_1$.`, R`Etwa 60 % der Messungen ergeben $a_1$.`, R`Jede Messung ergibt den Wert $0{,}6\,a_1$.`], a:0,
          ex:R`Wahrscheinlichkeit ist das Quadrat der Projektionslänge: $0{,}6^2 = 0{,}36$.`,
          fb:['',
            R`$0{,}6$ ist die Amplitude, nicht die Wahrscheinlichkeit. Die Born-Regel quadriert.`,
            R`Eine Messung liefert immer einen ganzen Eigenwert, nie einen Bruchteil davon.`]}},
      {id:'form-t3d', title:'Entartung: mehrere Eigenvektoren zu einem Wert',
        num:{title:'Drei Komponenten, zwei Messwerte', text:R`$\hat A \doteq \mathrm{diag}(1, 1, 2)$ und $|\psi\rangle \doteq \tfrac{1}{\sqrt3}(1;\ i;\ 1)$. Zum Eigenwert $1$ gehören die Eigenvektoren $(1;\ 0;\ 0)$ und $(0;\ 1;\ 0)$. Dann ist

$$P(1) = \left|\tfrac{1}{\sqrt3}\right|^2 + \left|\tfrac{i}{\sqrt3}\right|^2 = \tfrac13 + \tfrac13 = \tfrac23,\qquad P(2) = \tfrac13.$$`},
        text:R`Gehören zu einem Eigenwert $a$ mehrere orthonormale Eigenvektoren $|a, 1\rangle, |a, 2\rangle, \dots$, dann heißt $a$ [[lex:entarteter-eigenwert|entartet]]. Die Messung unterscheidet diese Eigenvektoren nicht; sie liefert nur den Wert $a$. Deshalb addierst du die Wahrscheinlichkeiten über den ganzen Eigenraum:

$$P(a) = \sum_j|\langle a, j|\psi\rangle|^2.$$

Welche Orthonormalbasis du im Eigenraum wählst, ändert diese Summe nicht. Entartung kennst du schon: Beim freien Teilchen haben $e^{ikx}$ und $e^{-ikx}$ dieselbe Energie (Thema 4). Addiert werden immer Wahrscheinlichkeiten, nie Amplituden verschiedener Eigenvektoren.`,
        q:{q:R`$\hat A \doteq \mathrm{diag}(1, 1, 2)$ und $|\psi\rangle \doteq \tfrac13(2;\ 2;\ 1)$. Mit welcher Wahrscheinlichkeit liefert die Messung den Wert $1$?`,
          opts:[R`$\tfrac49$`, R`$\tfrac89$`, R`$\left|\tfrac23 + \tfrac23\right|^2 = \tfrac{16}{9}$`], a:1,
          ex:R`$P(1) = \left(\tfrac23\right)^2 + \left(\tfrac23\right)^2 = \tfrac89$; dazu $P(2) = \tfrac19$, zusammen $1$.`,
          fb:[R`Das ist nur der Beitrag eines Eigenvektors. Zum Eigenwert $1$ gehören zwei.`,
            '',
            R`Addiert werden Wahrscheinlichkeiten, nicht Amplituden. Eine Wahrscheinlichkeit über $1$ ist ein sicheres Warnsignal.`]}},
      {id:'form-t3e', title:'Der Erwartungswert: zwei Formeln, ein Mittelwert',
        num:{title:'Zwei Wege, ein Ergebnis', text:R`Im Beispiel mit $\hat B$ und $|\psi\rangle \doteq \tfrac{1}{\sqrt5}(2;\ 1)$: Über die Wahrscheinlichkeiten ist $\langle B\rangle = (+1)\cdot\tfrac{9}{10} + (-1)\cdot\tfrac{1}{10} = \tfrac45$. Als Sandwich: $B|\psi\rangle \doteq \tfrac{1}{\sqrt5}(1;\ 2)$, also

$$\langle\psi|\hat B|\psi\rangle = \tfrac15\left(2\cdot1 + 1\cdot2\right) = \tfrac45.$$`},
        text:R`Misst du an vielen gleich präparierten Systemen, ist der Mittelwert der Ergebnisse der [[lex:erwartungswert|Erwartungswert]]

$$\langle A\rangle = \sum_n a_n\,|c_n|^2 = \langle\psi|\hat A|\psi\rangle.$$

Die erste Form ist ein gewichteter Mittelwert: Eigenwerte mal Wahrscheinlichkeiten. Die zweite Form, das **Sandwich** $\langle\psi|\hat A|\psi\rangle$, folgt daraus mit $\hat A|\psi\rangle = \sum_n c_na_n|a_n\rangle$ und der Orthonormalität. Sie braucht keine Eigenvektoren, nur Operator und Zustand. In der Ortsdarstellung ist sie die Formel aus Thema 1, $\langle x\rangle = \int\psi^*x\,\psi\,dx$. Die Tafel verbindet alle Formen, auch die Anzeige im Labor.`,
        reps:{obj:'Erwartungswert',
          rows:[
            {k:'worte', text:R`Mittelwert vieler Messungen an gleich präparierten Systemen`},
            {k:'formel', tex:R`\langle A\rangle = \sum_n a_n\,|c_n|^2`},
            {k:'dirac', tex:R`\langle A\rangle = \langle\psi|\hat A|\psi\rangle`},
            {k:'matrix', tex:R`\psi^\dagger B\,\psi = \tfrac15\,(2,\ 1)\begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}\begin{pmatrix}2\\ 1\end{pmatrix} = \tfrac45`},
            {k:'ort', tex:R`\int\psi^*(x)\,\big(\hat A\psi\big)(x)\,dx,\qquad\text{z. B. } \langle p\rangle = \int\psi^*\left(-i\hbar\,\psi'\right)dx`},
            {k:'labor', text:R`Anzeige $\langle A\rangle = \sum_n a_n|c_n|^2$ unter dem Labor; daneben „Mittelwert der Messungen“, der um diesen Wert schwankt`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Mittelwert einer Zufallsgröße: jeden möglichen Wert mit seiner Wahrscheinlichkeit gewichten und addieren (M9).`},
            {from:'formel', to:'dirac', rule:R`Setze $|c_n|^2 = \langle\psi|a_n\rangle\langle a_n|\psi\rangle$ ein, nutze $a_n|a_n\rangle = \hat A|a_n\rangle$ und die Vollständigkeit: Die Summe wird zum Sandwich.`},
            {from:'dirac', to:'matrix', rule:R`Bra als konjugierte Zeile, Operator als Matrix, Ket als Spalte; erst Matrix mal Spalte, dann Zeile mal Ergebnis.`},
            {from:'matrix', to:'ort', rule:R`Spalte wird Funktion, Matrix mal Spalte wird Operator auf Funktion, Zeile mal Spalte wird $\int\psi^*\dots dx$.`},
            {from:'ort', to:'labor', rule:R`Das Labor rechnet die Summenform aus den eingestellten Gewichten. Der Mittelwert einer endlichen Messreihe schwankt um diesen Wert.`}
          ]},
        q:{q:R`Wie schreibst du $\langle\psi|\hat p^2|\psi\rangle$ in der Ortsdarstellung?`, tr:{from:'dirac', to:'ort'},
          opts:[R`$\int|\psi|^2\,p^2\,dx$`, R`$\left(\int\psi^*\left(-i\hbar\,\psi'\right)dx\right)^2$`, R`$\int\psi^*\left(-\hbar^2\psi''\right)dx$`], a:2,
          ex:R`$\hat p^2 = (-i\hbar)^2\,d^2/dx^2 = -\hbar^2\,d^2/dx^2$ wirkt auf $\psi$; dann Skalarprodukt mit $\psi$.`,
          fb:[R`In der Ortsdarstellung ist $p$ keine Zahl, mit der man die Dichte multipliziert. $\hat p^2$ muss auf $\psi$ wirken.`,
            R`Das ist $\langle p\rangle^2$, nicht $\langle p^2\rangle$. Die Differenz ist gerade $(\Delta p)^2$.`,
            '']}},
      {id:'form-t3f', title:'Typische Fehlvorstellung: ⟨A⟩ als Messwert',
        num:{title:'Ein Wert, der nie gemessen wird', text:R`Im Beispiel war $\langle B\rangle = \tfrac45$. Eine einzelne Messung liefert aber nur $+1$ oder $-1$, niemals $0{,}8$. Erst der Mittelwert vieler Ergebnisse liegt bei $0{,}8$.`},
        text:R`„$\langle A\rangle$ ist das Ergebnis einer Messung“ ist eine der häufigsten Fehlvorstellungen. Eine einzelne Messung liefert einen Eigenwert. $\langle A\rangle$ ist der Mittelwert vieler Messungen und muss selbst kein Eigenwert sein. Die Herleitung zeigt das für einen Kastenzustand: Beide Formeln geben $\langle H\rangle = 3E_1$, aber $3E_1$ ist keine Kastenenergie, denn $E_n = n^2E_1$.

Im Labor daneben gehören die blauen Balken zu $|c_n|^2$, die roten zu den gemessenen Häufigkeiten. Die Anzeige $\langle A\rangle$ ist der mit den blauen Balken gewichtete Mittelwert der Eigenwerte 1, 2, 3. „1× messen“ trifft trotzdem immer einen dieser drei Werte.`,
        fig:{lab:'measure', caption:'Jede Messung liefert einen der Eigenwerte 1, 2 oder 3, zufällig mit Wahrscheinlichkeit $|c_n|^2$. Der Mittelwert vieler Messungen nähert sich $\\langle A\\rangle$ – als Einzelergebnis kommt $\\langle A\\rangle$ im Allgemeinen nicht vor.'},
        derive:{ctx:FORM_BOX('(sqrt(3) ψ_1(x) + i ψ_3(x))/2'), lines:[
          {l:'|⟨ψ_1|Ψ⟩|^2 = 3/4', w:'Born-Regel',
            why:{q:'Welche Wahrscheinlichkeit gibt diese Zeile an?', opts:['die für das Messergebnis $E_1$', 'die für das Messergebnis $\\langle H\\rangle$', 'die dafür, dass das System schon in $|\\psi_1\\rangle$ ist'], a:0, ex:'Vor der Messung ist das System in der Überlagerung, nicht „eigentlich“ in $|\\psi_1\\rangle$.'}},
          {l:'Ĥ Ψ(x) = (sqrt(3) E_1 ψ_1(x) + 9i E_1 ψ_3(x))/2', w:'Ĥψₙ = Eₙψₙ mit E₃ = 9E₁',
            why:{q:'Warum ist $\\hat H|\\Psi\\rangle$ kein Vielfaches von $|\\Psi\\rangle$?', opts:['Weil die Anteile verschiedene Faktoren $E_n$ bekommen.', 'Weil $\\hat H$ in diesem Zustand nicht hermitesch ist.', 'Weil $|\\Psi\\rangle$ noch nicht auf $1$ normiert ist.'], a:0, ex:'Nur Eigenzustände werden von $\\hat H$ auf ein Vielfaches abgebildet.'}},
          {l:'⟨Ψ|Ĥ|Ψ⟩ = (3 E_1 + 9 E_1)/4', w:'Bra mal Ket, ⟨ψₘ|ψₙ⟩ = δₘₙ'},
          {l:'= 3/4 E_1 + 1/4 · 9 E_1', w:'als Eigenwerte mal Wahrscheinlichkeiten geschrieben',
            why:{q:'Was zeigt diese Zeile?', opts:['$\\langle\\Psi|\\hat H|\\Psi\\rangle = \\sum_n E_n|c_n|^2$', 'Jede Energie kommt mit Wahrscheinlichkeit $1/2$.', 'Eine Messung liefert stets $3E_1$.'], a:0, ex:'Das Sandwich ist der mit $|c_n|^2$ gewichtete Mittelwert der Eigenwerte.'}},
          {l:'= 3 E_1', w:'kein Eigenwert: 3 ist keine Quadratzahl'}
        ]},
        q:{q:R`$|\Psi\rangle = \tfrac12\left(\sqrt3\,|\psi_1\rangle + i\,|\psi_3\rangle\right)$ im Kasten. Welche Energien kann eine einzelne Messung liefern?`,
          opts:[R`nur den Wert $\langle H\rangle = 3E_1$`, R`$E_1$ oder $9E_1$`, R`$E_1$, $4E_1$ oder $9E_1$`], a:1,
          ex:R`Nur Eigenwerte mit $c_n \ne 0$ sind möglich. $|\psi_2\rangle$ kommt im Zustand nicht vor, also ist $E_2 = 4E_1$ ausgeschlossen.`,
          fb:[R`$3E_1$ ist der Mittelwert vieler Messungen. Eine einzelne Messung liefert einen Eigenwert, und $3E_1$ ist keiner.`,
            '',
            R`$E_2 = 4E_1$ ist zwar ein Eigenwert, aber $c_2 = 0$. Seine Wahrscheinlichkeit ist $|c_2|^2 = 0$.`]}}
    ]},

    /* ===== Abschnitt 4: Zustand nach der Messung ===== */
    {id:'form-t4', title:'Postulat 5: der Zustand nach der Messung', steps:[
      {id:'form-t4a', title:'Nach der Messung im Eigenzustand',
        num:{title:'Zweimal hintereinander', text:R`$\hat B$ mit $|\pm\rangle \doteq \tfrac{1}{\sqrt2}(1;\ \pm1)$ und $|\psi\rangle \doteq \tfrac{1}{\sqrt5}(2;\ 1)$. Die Messung ergibt $+1$, was mit Wahrscheinlichkeit $\tfrac{9}{10}$ passiert. Danach ist der Zustand $|+\rangle$. Eine sofortige zweite Messung von $\hat B$ ergibt $+1$ mit der Wahrscheinlichkeit $|\langle +|+\rangle|^2 = 1$.`},
        text:R`Misst du eine Größe zweimal kurz hintereinander, ist das zweite Ergebnis dasselbe wie das erste. So verhalten sich Experimente, etwa wiederholte Stern-Gerlach-Messungen (Thema 10). Das verlangt eine Regel für den Zustand *nach* der Messung.

**Postulat 5.** Liefert die Messung von $\hat A$ den Wert $a_n$, ist das System unmittelbar danach im zugehörigen Eigenzustand $|a_n\rangle$. Man nennt das [[lex:zustandsreduktion|Zustandsreduktion]] oder „Kollaps“. Der alte Zustand bestimmt nur, mit welcher Wahrscheinlichkeit welcher Eigenzustand entsteht. Danach entwickelt sich der neue Zustand wieder nach der Schrödingergleichung.`,
        q:{q:R`Die Messung von $\hat B$ an $|\psi\rangle \doteq \tfrac{1}{\sqrt5}(2;\ 1)$ hat $-1$ ergeben. In welchem Zustand ist das System jetzt?`,
          opts:[R`$\tfrac{1}{\sqrt5}(2;\ 1)$, denn die Messung liest nur ab`, R`$\langle -|\psi\rangle\,|-\rangle \doteq \tfrac{1}{\sqrt{20}}(1;\ -1)$`, R`$|-\rangle \doteq \tfrac{1}{\sqrt2}(1;\ -1)$`], a:2,
          ex:R`Nach Postulat 5 ist das System im normierten Eigenzustand zum gemessenen Wert $-1$.`,
          fb:[R`Eine Messung ändert den Zustand. Sonst lieferte eine sofortige Wiederholung nicht sicher dasselbe Ergebnis.`,
            R`Die Richtung stimmt, aber die Länge nicht: Die Projektion hat die Länge $1/\sqrt{10}$. Ein Zustand muss normiert sein.`,
            '']}},
      {id:'form-t4b', title:'Bei Entartung: Projektion auf den Eigenraum',
        num:{title:'Zwei Komponenten bleiben', text:R`$\hat A \doteq \mathrm{diag}(1, 1, 2)$, $|\psi\rangle \doteq \tfrac{1}{\sqrt3}(1;\ i;\ 1)$, Ergebnis $1$. Der Projektor auf den Eigenraum behält die ersten beiden Komponenten: $\hat P_1|\psi\rangle \doteq \tfrac{1}{\sqrt3}(1;\ i;\ 0)$. Ihr Normquadrat ist $\tfrac23 = P(1)$. Normiert bleibt $\tfrac{1}{\sqrt2}(1;\ i;\ 0)$.`},
        text:R`Ist der gemessene Eigenwert entartet, projiziert die Messung auf den ganzen Eigenraum und normiert:

$$|\psi\rangle \;\longrightarrow\; \frac{\hat P_a|\psi\rangle}{\|\hat P_a|\psi\rangle\|},\qquad \hat P_a = \sum_j|a, j\rangle\langle a, j|.$$

Der **Projektor** $\hat P_a$, gelesen „P a“, behält genau die Komponenten im Eigenraum und streicht den Rest. Das Normquadrat der Projektion ist die Wahrscheinlichkeit des Ergebnisses. Ohne Entartung ist $\hat P_a = |a\rangle\langle a|$, und es bleibt $|a\rangle$ bis auf eine Phase. Die relativen Phasen innerhalb des Eigenraums bleiben erhalten. Die Messung verrät nicht, „welcher“ Eigenvektor es war.`,
        q:{q:R`$\hat A \doteq \mathrm{diag}(1, 1, 2)$ und $|\psi\rangle \doteq \tfrac{1}{\sqrt6}(1;\ 2i;\ 1)$. Die Messung liefert $1$. Welcher Zustand liegt danach vor?`,
          opts:[R`$\tfrac{1}{\sqrt5}(1;\ 2i;\ 0)$`, R`$(1;\ 0;\ 0)$ oder $(0;\ 1;\ 0)$, zufällig`, R`$\tfrac{1}{\sqrt6}(1;\ 2i;\ 0)$`], a:0,
          ex:R`Projizieren gibt $\tfrac{1}{\sqrt6}(1;\ 2i;\ 0)$ mit dem Normquadrat $\tfrac56$; normiert $\tfrac{1}{\sqrt5}(1;\ 2i;\ 0)$. Eine sofort wiederholte Messung liefert sicher wieder $1$.`,
          fb:['',
            R`Die Messung liefert nur den Wert $1$ und unterscheidet die beiden Eigenvektoren nicht. Deshalb bleibt die Überlagerung im Eigenraum erhalten.`,
            R`Das ist die Projektion vor dem Normieren. Ihr Normquadrat ist $\tfrac56$, nicht $1$.`]}},
      {id:'form-t4c', title:'Messfolgen: Eine Messung löscht die vorige',
        num:{title:'A, dann B, dann wieder A', text:R`$\hat A$ hat die Eigenvektoren $|1\rangle, |2\rangle$. $\hat B$ hat die Eigenvektoren $|b_+\rangle = \tfrac12\left(\sqrt3\,|1\rangle + |2\rangle\right)$ und $|b_-\rangle = \tfrac12\left(|1\rangle - \sqrt3\,|2\rangle\right)$, für ein Photon ein Filter unter $30°$. Miss $A$ mit Ergebnis $a_1$: Der Zustand ist $|1\rangle$. Miss $B$: $P(b_+) = |\langle b_+|1\rangle|^2 = \tfrac34$ und $P(b_-) = \tfrac14$. Ergibt sich $b_+$, ist der Zustand jetzt $|b_+\rangle$. Miss wieder $A$:

$$P(a_1) = |\langle 1|b_+\rangle|^2 = \tfrac34,\quad\text{nicht } 1.$$`},
        text:R`Haben zwei Observable verschiedene Eigenbasen, stören sich ihre Messungen. Die $B$-Messung präpariert einen $B$-Eigenzustand. In ihm ist $A$ nicht mehr scharf; das erste $A$-Ergebnis ist „gelöscht“ – wie beim mittleren Polarisationsfilter aus der Vorhersage.

Im Labor daneben siehst du das an einem einzelnen System mit drei Niveaus. Die Balken „P(A = …)“ zeigen $|\langle a_n|\psi\rangle|^2$ für den aktuellen Zustand, die Balken „P(B = …)“ ebenso $|\langle b_j|\psi\rangle|^2$. Nach „A messen“ springt ein A-Balken auf 1: Das ist Postulat 5. „Erneut messen“ bestätigt das Ergebnis.`,
        fig:{lab:'measure', init:{seq:true}, caption:'Unten: Messfolge an einem einzelnen System. Miss $A$ zweimal hintereinander – zweimal dasselbe Ergebnis. Miss $A$, dann $B$, dann wieder $A$: Das zweite $A$-Ergebnis ist wieder zufällig, denn die $B$-Messung hat den Zustand verändert.'},
        q:{q:R`Im Labor misst du am einzelnen System erst $A$ und erhältst $A = 1$. Was zeigen danach die Balken „P(B = …)“?`, tr:{from:'labor', to:'dirac'},
          opts:[R`die Wahrscheinlichkeiten $|\langle b_j|a_1\rangle|^2$ für die nächste B-Messung`, R`die eingestellten Gewichte $|c_n|^2$ des Anfangszustands`, R`eine 1 beim Wert $B = 1$, weil $A = 1$ war`], a:0,
          ex:R`Nach der A-Messung ist der Zustand $|a_1\rangle$. Die B-Balken zeigen seine Komponenten in der B-Basis, zum Quadrat; im Labor sind das $\tfrac13$, $\tfrac12$ und $\tfrac16$.`,
          fb:['',
            R`Der Anfangszustand ist nach der Messung weg. Für die nächste Messung zählt nur $|a_1\rangle$.`,
            R`$A$ und $B$ haben verschiedene Eigenbasen. $|a_1\rangle$ ist kein Eigenzustand von $\hat B$, also ist $B$ nicht scharf.`]}},
      {id:'form-t4d', title:'Typischer Fehler: Einen Operator anwenden ist keine Messung',
        num:{title:'Anwenden gegen Messen', text:R`Kasten, $|\Psi\rangle = \tfrac{1}{\sqrt2}\left(|\psi_1\rangle + |\psi_2\rangle\right)$. Anwenden: $\hat H|\Psi\rangle = \tfrac{E_1}{\sqrt2}\left(|\psi_1\rangle + 4|\psi_2\rangle\right)$ – jedes Mal dasselbe. Messen: Mit Wahrscheinlichkeit $\tfrac12$ kommt $E_1$ und danach $|\psi_1\rangle$, mit Wahrscheinlichkeit $\tfrac12$ kommt $4E_1$ und danach $|\psi_2\rangle$.`},
        text:R`Eine der häufigsten Verwechslungen ist „Messen heißt, den Operator anzuwenden“ (Singh & Marshman 2015). $\hat A|\psi\rangle$ ist ein Rechenschritt, kein physikalischer Vorgang. Das Ergebnis ist im Allgemeinen kein Eigenzustand, nicht normiert, und es trägt die Einheit der Messgröße. Vor allem ist es eindeutig bestimmt, während eine Messung zufällig einen von mehreren Eigenzuständen liefert.

Den Zustand nach der Messung bekommst du nur über Postulat 5: Eigenzustand zum gemessenen Wert, bei Entartung die normierte Projektion. Durch Anwenden von $\hat H$ kann man ihn nicht ausrechnen. Die Herleitung rechnet das Beispiel nach.`,
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
        q:{q:R`Was ist $\hat H|\Psi\rangle$ für $|\Psi\rangle = \tfrac{1}{\sqrt2}\left(|\psi_1\rangle + |\psi_2\rangle\right)$, nachdem man es normiert hat?`,
          opts:[R`$|\psi_2\rangle$, der Zustand nach der Messung`, R`$\tfrac{1}{\sqrt{17}}\left(|\psi_1\rangle + 4|\psi_2\rangle\right)$`, R`wieder $|\Psi\rangle$, weil $\hat H$ hermitesch ist`], a:1,
          ex:R`$\hat H|\Psi\rangle \propto |\psi_1\rangle + 4|\psi_2\rangle$, normiert mit $\sqrt{1 + 16} = \sqrt{17}$. Das ist weder $|\psi_1\rangle$ noch $|\psi_2\rangle$ – also kein möglicher Zustand nach einer Energiemessung.`,
          fb:[R`Den Zustand nach der Messung liefert Postulat 5, nicht das Anwenden von $\hat H$. Und er wäre zufällig $|\psi_1\rangle$ oder $|\psi_2\rangle$.`,
            '',
            R`Hermitesch heißt nicht, dass $\hat H$ jeden Zustand auf sich selbst abbildet. Das tun nur Eigenzustände, und $|\Psi\rangle$ ist keiner.`]}}
    ]},

    /* ===== Abschnitt 5: kontinuierliche Spektren, Orts- und Impulsdarstellung ===== */
    {id:'form-t5', title:'Kontinuierliche Spektren: Ort, Impuls und δ-Normierung', steps:[
      {id:'form-t5a', title:'Impulseigenfunktionen: ein kontinuierliches Spektrum',
        num:{title:'Eine ebene Welle', text:R`Für $p = 2\hbar/\mathrm{nm}$ ist $f_p(x) = \frac{1}{\sqrt{2\pi\hbar}}\,e^{2ix/\mathrm{nm}}$ eine Welle mit der Wellenlänge $\lambda = 2\pi\hbar/p = \pi\,\mathrm{nm} \approx 3{,}1\,\mathrm{nm}$. Ihr Betragsquadrat ist überall $\frac{1}{2\pi\hbar}$. Über ein Stück der Länge $\ell$ integriert gibt das $\frac{\ell}{2\pi\hbar}$ – und das wächst ohne Grenze, wenn $\ell$ wächst.`},
        text:R`Der Impulsoperator hat für jedes reelle $p$ eine Eigenfunktion:

$$f_p(x) = \frac{1}{\sqrt{2\pi\hbar}}\,e^{ipx/\hbar},\qquad \hat pf_p = p\,f_p.$$

Das Spektrum ist **kontinuierlich**: Jeder Wert $p$ kommt vor, nicht nur einzelne. Die $f_p$ sind aber nicht normierbar (Thema 4), also keine Zustände im Hilbertraum. Nützlich sind sie trotzdem, als Bausteine. Ein physikalischer Zustand ist eine Überlagerung vieler $f_p$, ein Wellenpaket. Die Herleitung prüft die Eigenwertgleichung.`,
        derive:{ctx:FORM_FT(), lines:[
          {l:'-iħ d/dx e^(i p x/ħ) = p e^(i p x/ħ)', w:'Eigenfunktion von p̂',
            why:{q:'Zu welchem Eigenwert gehört $e^{ipx/\\hbar}$?', opts:['zum Impuls $p$', 'zum Impuls $-p$', 'zum Impuls $p/\\hbar$'], a:0, ex:'$-i\\hbar\\cdot\\frac{ip}{\\hbar} = p$.'}}
        ]},
        q:{q:R`Warum ist $f_p(x) = e^{ipx/\hbar}/\sqrt{2\pi\hbar}$ kein möglicher Zustand eines Teilchens?`,
          opts:['Weil $f_p$ eine komplexe Funktion ist.', 'Weil $\\int|f_p|^2dx$ divergiert; $f_p$ ist nicht normierbar.', 'Weil $f_p$ keine Eigenfunktion von $\\hat p$ ist.'], a:1,
          ex:R`$|f_p|^2 = 1/(2\pi\hbar)$ ist überall gleich. Physikalische Zustände sind Überlagerungen, also Wellenpakete.`,
          fb:[R`Komplexe Wellenfunktionen sind erlaubt und sogar die Regel. Das Problem ist die Normierung.`,
            '',
            R`$f_p$ ist eine Eigenfunktion von $\hat p$ zum Eigenwert $p$ – das zeigt die Herleitung.`]}},
      {id:'form-t5b', title:'δ-Normierung: Aus Summen werden Integrale',
        pre:{from:'m-analysis', seg:'ma-t5', title:'Die δ-Distribution', text:R`$\delta(x - a)$ ist durch ihre Wirkung unter dem Integral definiert: $\int\delta(x - a)\,f(x)\,dx = f(a)$. Sie ist keine gewöhnliche Funktion. Hat $x$ die Einheit m, so hat $\delta(x)$ die Einheit 1/m. Aus M5 und Thema 4 kennst du $\int e^{i(k - k')x}\,dx = 2\pi\,\delta(k - k')$.`},
        num:{title:'Kronecker gegen Dirac', text:R`Im Kasten ist $\langle\psi_m|\psi_n\rangle = \delta_{mn}$: $1$ für $m = n$, sonst $0$. Für zwei Impulseigenfunktionen mit $p \ne p'$ schwingt $f_{p'}^*f_p \propto e^{i(p - p')x/\hbar}$, und das Integral mittelt sich weg. Für $p = p'$ ist es unendlich, wie im letzten Schritt. Genau dieses Verhalten hat $\delta(p - p')$: null außer bei $p = p'$, Fläche $1$.`},
        text:R`Statt auf $1$ normiert man die $f_p$ auf eine δ-Funktion:

$$\langle f_{p'}|f_p\rangle = \frac{1}{2\pi\hbar}\int e^{i(p - p')x/\hbar}\,dx = \delta(p - p').$$

Das ist die [[lex:delta-normierung|δ-Normierung]]. Aus dem Kronecker-Delta $\delta_{mn}$ wird die [[lex:delta-distribution|δ-Distribution]], aus Summen über $n$ werden Integrale über $p$. Für die Born-Regel heißt das: Aus einzelnen Wahrscheinlichkeiten $|c_n|^2$ wird eine **Dichte**, und einen exakten Wert $p_0$ trifft man mit Wahrscheinlichkeit null. Es gibt auch gemischte Spektren: Der endliche Topf (Thema 5) hat einzelne gebundene Energien und darüber ein Kontinuum. Eine Entwicklung braucht dann eine Summe und ein Integral.`,
        q:{q:R`Welche Einheit hat $\delta(p - p')$?`,
          opts:[R`keine, δ ist eine reine Zahl`, R`1/Impuls, also $\mathrm{s/(kg\,m)}$`, R`Impuls, also $\mathrm{kg\,m/s}$`], a:1,
          ex:R`$\int\delta(p - p')\,dp = 1$ ist dimensionslos, und $dp$ hat die Einheit eines Impulses. Also hat δ die Einheit 1/Impuls – wie eine Wahrscheinlichkeitsdichte pro Impuls.`,
          fb:[R`Das Kronecker-Delta ist eine reine Zahl, die δ-Distribution nicht. Ihr Integral über $p$ ist $1$.`,
            '',
            R`Umgekehrt: $\delta(p - p')\,dp$ muss dimensionslos sein, also hat δ die Einheit 1/Impuls.`]}},
      {id:'form-t5c', title:'Ortseigenzustände: ψ(x) ist eine Komponente',
        num:{title:'Komponente bei y = 0', text:R`Gauß-Paket mit $\sigma = 1\,\mathrm{nm}$: $\psi(x) = (2\pi\sigma^2)^{-1/4}e^{-x^2/(4\sigma^2)}$. Die Komponente beim Ortseigenzustand $y = 0$ ist $\psi(0) = (2\pi)^{-1/4}\,\mathrm{nm}^{-1/2} \approx 0{,}63\,\mathrm{nm}^{-1/2}$. Die Wahrscheinlichkeit, das Teilchen in $[-0{,}01;\ 0{,}01]\,\mathrm{nm}$ zu finden, ist etwa $|\psi(0)|^2\cdot 0{,}02\,\mathrm{nm} \approx 0{,}008$.`},
        text:R`Der Ortsoperator hat zum Eigenwert $y$ die „Eigenfunktion“ $g_y(x) = \delta(x - y)$, denn $x\,\delta(x - y) = y\,\delta(x - y)$. Auch sie ist nicht normierbar, sondern δ-normiert. Die Komponente von $\psi$ entlang $g_y$ ist (Herleitung)

$$\langle g_y|\psi\rangle = \int\delta(x - y)\,\psi(x)\,dx = \psi(y).$$

Man schreibt $|y\rangle$ für $g_y$. Dann gilt $\psi(x) = \langle x|\psi\rangle$: Die Wellenfunktion ist die Liste der Komponenten des Kets in der Ortsbasis. Die Born-Regel aus Thema 1 ist der Spezialfall $|\langle x|\psi\rangle|^2$. Im Bild daneben ist die blaue Fläche $\delta_\varepsilon(x - a)f(x)$; ihr Inhalt nähert sich $f(a)$, je schmaler $\delta_\varepsilon$ wird. Eine ideale Ortsmessung hinterließe $\delta(x - y)$, also keinen Zustand. Reale Messungen haben eine endliche Auflösung.`,
        fig:{lab:'delta', init:{eps:0.15}, caption:'Eine schmale Funktion $\\delta_\\varepsilon$ mit Fläche 1: $\\int\\delta_\\varepsilon(x - a)f(x)\\,dx$ ist fast $f(a)$. Für $\\varepsilon \\to 0$ (Regler unter „Mehr Regler“) entsteht die δ-Distribution. Ein Ortseigenzustand wäre eine solche unendlich schmale Spitze – nicht normierbar, wie die ebene Welle.'},
        derive:{ctx:FORM_FT(), lines:[
          {l:'∫_-∞^∞ δ(x - y) ψ(x) dx = ψ(y)', w:'Komponente in der Ortsbasis',
            why:{q:'Was bedeutet diese Zeile?', opts:['$\\psi(y)$ ist die Komponente von $|\\psi\\rangle$ beim Ortseigenzustand $y$.', 'Die Wellenfunktion $\\psi$ verschwindet an der Stelle $y$.', 'Die Wahrscheinlichkeit, das Teilchen bei $y$ zu finden, ist $\\psi(y)$.'], a:0, ex:'Wahrscheinlichkeitsdichte ist $|\\psi(y)|^2$, nicht $\\psi(y)$.'}}
        ]},
        q:{q:R`Was ist $\langle x_0|\psi\rangle$ für einen Zustand mit der Wellenfunktion $\psi(x)$?`, tr:{from:'dirac', to:'ort'},
          opts:[R`$|\psi(x_0)|^2$, die Dichte bei $x_0$`, R`$x_0\,\psi(x_0)$, Ort mal Amplitude`, R`$\psi(x_0)$, die Amplitude bei $x_0$`], a:2,
          ex:R`$\langle x_0|\psi\rangle = \int\delta(x - x_0)\,\psi(x)\,dx = \psi(x_0)$. Das Betragsquadrat davon ist die Dichte.`,
          fb:[R`Das ist das Betragsquadrat der Komponente. Die Komponente selbst ist die Amplitude.`,
            R`Das wäre $\hat x$ angewandt und dann ausgewertet. Im Skalarprodukt $\langle x_0|\psi\rangle$ steht kein Operator.`,
            '']}},
      {id:'form-t5d', title:'Impulsdarstellung: derselbe Ket in der Impulsbasis',
        pre:{from:'m-fourier', seg:'mf-t4', title:'Fourier-Transformation', text:R`In diesem Tutorial gilt $\varphi(k) = \frac{1}{\sqrt{2\pi}}\int\psi(x)\,e^{-ikx}\,dx$ und $\psi(x) = \frac{1}{\sqrt{2\pi}}\int\varphi(k)\,e^{ikx}\,dk$, mit Plancherel $\int|\psi|^2dx = \int|\varphi|^2dk$. Mini-Beispiel: $e^{-x^2/2}$ geht in $e^{-k^2/2}$ über.`},
        num:{title:'Das Gauß-Paket im Impuls', text:R`Gauß-Paket mit $\sigma = 1\,\mathrm{nm}$. Seine Impulsdarstellung ist wieder eine Gauß-Kurve, $|\tilde\psi(p)|^2 \propto e^{-2\sigma^2p^2/\hbar^2}$, mit der Breite $\Delta p = \hbar/(2\sigma) \approx 5{,}3\cdot10^{-26}\,\mathrm{kg\,m/s}$. Für ein Elektron entspricht das einer Geschwindigkeitsunschärfe von $\Delta p/m_e \approx 58\,\mathrm{km/s}$.`},
        text:R`Entwickelst du nach den Impulseigenfunktionen, sind die Komponenten

$$\tilde\psi(p) = \langle p|\psi\rangle = \frac{1}{\sqrt{2\pi\hbar}}\int e^{-ipx/\hbar}\,\psi(x)\,dx.$$

Das ist die [[lex:fourier|Fourier-Transformation]] aus Thema 4, mit $p$ statt $k$: $\tilde\psi(p) = \varphi(p/\hbar)/\sqrt\hbar$ (Herleitung). In manchen Büchern heißt $\tilde\psi$ einfach $\phi(p)$ oder $\Phi(p)$. $|\tilde\psi(p)|^2\,dp$ ist die Wahrscheinlichkeit, einen Impuls in $[p, p + dp]$ zu messen, und $\langle p\rangle = \int p\,|\tilde\psi|^2\,dp$. Orts- und Impulsdarstellung sind also zwei Komponentenlisten desselben Kets in zwei Basen. Die Fourier-Transformation ist der Basiswechsel. Die Tafel stellt beide nebeneinander.`,
        reps:{obj:'Basiswechsel Ort ↔ Impuls am Gauß-Paket',
          rows:[
            {k:'dirac', tex:R`|\psi\rangle = \int|x\rangle\langle x|\psi\rangle\,dx = \int|p\rangle\langle p|\psi\rangle\,dp`},
            {k:'matrix', text:R`diskret: Komponenten $c_n = \langle n|\psi\rangle$, eine Zahl je Basiszustand`},
            {k:'ort', tex:R`\psi(x) = \langle x|\psi\rangle = (2\pi\sigma^2)^{-1/4}\,e^{-x^2/(4\sigma^2)}`},
            {k:'impuls', tex:R`\tilde\psi(p) = \langle p|\psi\rangle = \left(\frac{2\sigma^2}{\pi\hbar^2}\right)^{1/4}e^{-\sigma^2p^2/\hbar^2}`},
            {k:'graph', plot:{x:[-3.5, 3.5], y:[-0.2, 0.9], xlab:R`x\ \text{bzw.}\ p`, ylab:'\\text{Dichte}'}, f:x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), lab:R`|\psi(x)|^2`, f2:p => Math.sqrt(2 / Math.PI) * Math.exp(-2 * p * p), lab2:R`|\tilde\psi(p)|^2`,
              cap:R`Für $\sigma = 1$ und $\hbar = 1$: $|\psi(x)|^2$ ist breit (Standardabweichung $1$), $|\tilde\psi(p)|^2$ schmal ($\tfrac12$). Beide Flächen sind $1$.`},
            {k:'mathe', text:R`Fourier-Transformation (M6) als Basiswechsel, der die Norm erhält: $\int|\psi|^2dx = \int|\tilde\psi|^2dp$ (Plancherel)`}
          ],
          links:[
            {from:'dirac', to:'matrix', rule:R`In einer diskreten Basis sind die Komponenten einzelne Zahlen $c_n$. In der Orts- oder Impulsbasis werden sie Funktionen.`},
            {from:'matrix', to:'ort', rule:R`Den Index $n$ durch die stetige Variable $x$ ersetzen: $c_n = \langle n|\psi\rangle$ wird $\psi(x) = \langle x|\psi\rangle$.`},
            {from:'ort', to:'impuls', rule:R`Mit $e^{-ipx/\hbar}/\sqrt{2\pi\hbar}$ multiplizieren und über $x$ integrieren. Zurück geht es mit $e^{+ipx/\hbar}$ und $\int dp$.`},
            {from:'impuls', to:'graph', rule:R`Beide Betragsquadrate zeichnen. Je breiter $|\psi(x)|^2$, desto schmaler $|\tilde\psi(p)|^2$; beim Gauß-Paket ist $\Delta x\,\Delta p = \hbar/2$.`},
            {from:'graph', to:'mathe', rule:R`Die Gesamtfläche ist in beiden Bildern $1$: Der Basiswechsel ändert die Länge des Kets nicht.`}
          ]},
        derive:{ctx:FORM_FT(), lines:[
          {l:'1/sqrt(2πħ) ∫_-∞^∞ e^(-ipx/ħ) ψ(x) dx = 1/sqrt(ħ) φ(p/ħ)', w:'Impulsamplitude = Fourier-Transformierte aus Thema 4',
            why:{q:'Woher kommt der Faktor $1/\\sqrt\\hbar$?', opts:['Er sorgt für $\\int|\\tilde\\psi|^2dp = 1$, denn $dp = \\hbar\\,dk$.', 'aus der Ableitung nach $p$, denn sie bringt $1/\\hbar$', 'Konvention, denn ein Faktor ändert den Zustand nicht'], a:0, ex:'$\\int|\\tilde\\psi(p)|^2dp = \\int\\frac{1}{\\hbar}|\\varphi(p/\\hbar)|^2dp = \\int|\\varphi(k)|^2dk = 1$.'}}
        ]},
        q:{q:R`Das Gauß-Paket wird im Ort doppelt so breit, $\sigma \to 2\sigma$. Was passiert mit $|\tilde\psi(p)|^2$?`, tr:{from:'ort', to:'impuls'},
          opts:[R`Es wird doppelt so breit.`, R`Es wird halb so breit.`, R`Es bleibt gleich; nur $\psi(x)$ ändert sich.`], a:1,
          ex:R`$\Delta p = \hbar/(2\sigma)$: Doppeltes $\sigma$ halbiert $\Delta p$. Orts- und Impulsbreite verhalten sich gegenläufig.`,
          fb:[R`Umgekehrt: Je breiter im Ort, desto schmaler im Impuls. Das Produkt $\Delta x\,\Delta p$ bleibt $\hbar/2$.`,
            '',
            R`$\tilde\psi$ ist kein zweiter, unabhängiger Zustand. Es ist derselbe Ket in der Impulsbasis und ändert sich mit $\psi$.`]}},
      {id:'form-t5f', title:'Operatoren in der Impulsdarstellung',
        num:{title:R`$\langle p^2\rangle$ auf zwei Wegen`, text:R`Gauß-Paket aus dem letzten Schritt. In der Impulsdarstellung ist $\hat p^2$ nur ein Faktor $p^2$:

$$\langle p^2\rangle = \int p^2\,|\tilde\psi(p)|^2\,dp = \frac{\hbar^2}{4\sigma^2}.$$

Das ist einfach $(\Delta p)^2$, denn $\langle p\rangle = 0$, und $|\tilde\psi|^2$ ist eine Gauß-Kurve mit der Breite $\Delta p = \hbar/(2\sigma)$. In der Ortsdarstellung musst du $\psi$ dafür zweimal ableiten, $\langle p^2\rangle = \int\psi\,(-\hbar^2\psi'')\,dx$. Das Ergebnis ist dasselbe (Herleitung).`},
        text:R`In der Impulsdarstellung tauschen Ort und Impuls die Rollen. Jetzt multipliziert $\hat p$, und $\hat x$ leitet ab:

$$(\hat p\tilde\psi)(p) = p\,\tilde\psi(p),\qquad (\hat x\tilde\psi)(p) = i\hbar\,\frac{\partial\tilde\psi}{\partial p}.$$

Beim Ortsoperator steht $+i\hbar$, beim Impulsoperator im Ort $-i\hbar$. Warum? Leite $\tilde\psi(p) = \frac{1}{\sqrt{2\pi\hbar}}\int e^{-ipx/\hbar}\psi(x)\,dx$ aus dem letzten Schritt nach $p$ ab. Der Exponent $e^{-ipx/\hbar}$ bringt den Faktor $-ix/\hbar$ herunter. Mal $i\hbar$ bleibt die Fourier-Transformierte von $x\,\psi(x)$, also die Impulsdarstellung von $\hat x\psi$ (letzte Zeile der Herleitung). Probe mit einer Testfunktion $g(p)$: $[\hat x, \hat p]\,g = i\hbar\,(pg)' - p\,i\hbar\,g' = i\hbar\,g$, wie im Ort.`,
        derive:{ctx:FORM_FT(), lines:[
          {l:'1/ħ ∫_-∞^∞ p^2 |φ(p/ħ)|^2 dp = ħ^2/(4σ^2)', w:R`$\langle p^2\rangle$ im Impuls: $|\tilde\psi|^2 = |\varphi(p/\hbar)|^2/\hbar$, mit $p^2$ gewichtet`,
            why:{q:'Warum steht hier kein Differentialoperator?', opts:['Weil $\\hat p$ in der Impulsdarstellung als Multiplikation mit $p$ wirkt.', 'Weil $\\langle p\\rangle = 0$ ist und deshalb nichts abzuleiten bleibt.', 'Weil $|\\tilde\\psi|^2$ reell ist und Ableitungen dann wegfallen.'], a:0, ex:'Wie $\\hat x$ im Ort einfach mit $x$ multipliziert, multipliziert $\\hat p$ im Impuls mit $p$.'}},
          {l:'∫_-∞^∞ ψ(x) (-ħ^2 ψ\'\'(x)) dx = ħ^2/(4σ^2)', w:R`dasselbe im Ort: $\hat p^2 = -\hbar^2\,d^2/dx^2$`},
          {l:'iħ d/dp (1/sqrt(2πħ) ∫_-∞^∞ e^(-ipx/ħ) ψ(x) dx) = 1/sqrt(2πħ) ∫_-∞^∞ e^(-ipx/ħ) x ψ(x) dx', w:R`$\hat x$ im Impuls: $i\hbar\,\partial/\partial p$ auf $\tilde\psi$ angewandt`,
            why:{q:'Woher kommt rechts der Faktor $x$?', opts:['Die Ableitung von $e^{-ipx/\\hbar}$ nach $p$ gibt $-\\tfrac{ix}{\\hbar}$; mal $i\\hbar$ ist das $x$.', 'Er wurde eingefügt, damit die Einheiten stimmen.', 'Aus der Ableitung von $\\psi(x)$ nach $x$.'], a:0, ex:'$i\\hbar\\cdot\\left(-\\tfrac{ix}{\\hbar}\\right) = x$. Rechts steht also die Fourier-Transformierte von $x\\psi(x)$.'}}
        ]},
        q:{q:R`Wie lautet $\langle x\rangle$ in der Impulsdarstellung?`, tr:{from:'dirac', to:'impuls'},
          opts:[R`$\int\tilde\psi^*(p)\,\big(-i\hbar\,\tilde\psi'(p)\big)\,dp$`, R`$\int x\,|\tilde\psi(p)|^2\,dp$`, R`$\int\tilde\psi^*(p)\,\big(i\hbar\,\tilde\psi'(p)\big)\,dp$`], a:2,
          ex:R`$\langle x\rangle = \langle\psi|\hat x|\psi\rangle$, und im Impuls ist $\hat x = i\hbar\,\partial/\partial p$. Dann Skalarprodukt mit $\tilde\psi$, also $\int\tilde\psi^*\dots dp$.`,
          fb:[R`Das Vorzeichen ist das des Impulsoperators im Ort. Im Impuls ist $\hat x = +i\hbar\,\partial/\partial p$.`,
            R`In der Impulsdarstellung ist $x$ keine Variable, mit der man die Dichte multiplizieren kann; integriert wird über $p$. $\hat x$ muss als $i\hbar\,\partial_p$ auf $\tilde\psi$ wirken.`,
            '']}},
      {id:'form-t5e', title:'Typischer Fehler: zwei Funktionen, zwei Zustände?',
        num:{title:'Ein Zustand, zwei Breiten', text:R`Das Gauß-Paket mit $\sigma = 1\,\mathrm{nm}$ hat $\Delta x = 1\,\mathrm{nm}$ und $\Delta p = \hbar/(2\,\mathrm{nm})$. Beide Zahlen gehören zu *einem* Zustand. Machst du $\psi(x)$ schmaler, wird $\tilde\psi(p)$ von selbst breiter.`},
        text:R`„$\psi(x)$ und $\tilde\psi(p)$ sind zwei verschiedene Zustände“ ist eine häufige Verwechslung. Es ist derselbe Ket in zwei Basen, wie ein Pfeil in zwei gedrehten Koordinatensystemen. Du darfst also nicht $\psi(x)$ und $\tilde\psi(p)$ unabhängig voneinander wählen. Ist das eine bekannt, ist das andere festgelegt.

Daraus folgt eine Faustregel: Rechne eine Größe dort aus, wo ihr Operator eine Multiplikation ist. $x$ und $V(x)$ rechnest du im Ort, $p$ und $p^2/2m$ im Impuls. Das Ergebnis ist in beiden Darstellungen dasselbe, nur der Rechenweg ist verschieden lang.`,
        q:{q:'Lena wählt für ein Teilchen $\\psi(x)$ als Gauß-Kurve mit $\\Delta x = 2\\,\\mathrm{nm}$ und dazu $\\tilde\\psi(p)$ als Gauß-Kurve mit $\\Delta p = \\hbar/(10\\,\\mathrm{nm})$. Was stimmt?',
          opts:['Das geht: $\\psi(x)$ und $\\tilde\\psi(p)$ sind unabhängig wählbar.', 'Das geht nicht: $\\tilde\\psi$ folgt aus $\\psi$, hier mit $\\Delta p = \\hbar/(4\\,\\mathrm{nm})$.', 'Das geht nicht, weil die Fourier-Transformierte von $e^{-x^2}$ keine Gauß-Kurve ist.'], a:1,
          ex:'$\\tilde\\psi$ ist die Fourier-Transformierte von $\\psi$; für ein Gauß-Paket ist $\\Delta p = \\hbar/(2\\Delta x) = \\hbar/(4\\,\\mathrm{nm})$. Lenas Wahl hätte $\\Delta x\\,\\Delta p = \\hbar/5 < \\hbar/2$ und verletzt damit die Unschärferelation.',
          fb:[R`$\psi(x)$ und $\tilde\psi(p)$ beschreiben denselben Zustand. Mit $\psi$ liegt $\tilde\psi$ fest.`,
            '',
            R`Die Fourier-Transformierte einer Gauß-Kurve ist wieder eine Gauß-Kurve. Der Fehler liegt in der unabhängigen Wahl der Breite.`]}}
    ]},

    /* ===== Abschnitt 6: Unschärfe, Kommutator, verträgliche Observable, Robertson ===== */
    {id:'form-t6', title:'Kommutatoren, verträgliche Observable und die Unschärferelation', steps:[
      {id:'form-t6a', title:'Die Unschärfe ΔA',
        pre:{from:'m-stat', seg:'st-t4', title:'Varianz und Standardabweichung', text:R`Die Varianz misst die Streuung um den Mittelwert: $(\Delta x)^2 = \langle(x - \langle x\rangle)^2\rangle = \langle x^2\rangle - \langle x\rangle^2$. Die Standardabweichung $\Delta x$ hat dieselbe Einheit wie $x$. Mini-Beispiel: Werte $\pm1$ je mit Wahrscheinlichkeit $\tfrac12$ geben $\langle x\rangle = 0$, $\langle x^2\rangle = 1$, $\Delta x = 1$.`},
        num:{title:'Streuung im Beispiel', text:R`$\hat B$ mit den Eigenwerten $\pm1$ und $|\psi\rangle \doteq \tfrac{1}{\sqrt5}(2;\ 1)$: $\langle B\rangle = \tfrac45$. Wegen $B^2 = \mathbb 1$ ist $\langle B^2\rangle = 1$. Also

$$\Delta B = \sqrt{1 - \tfrac{16}{25}} = \tfrac35.$$`},
        text:R`Wie stark streuen die Messwerte um $\langle A\rangle$? Das misst die [[lex:unschaerfe|Unschärfe]]

$$\Delta A = \sqrt{\langle A^2\rangle - \langle A\rangle^2},\qquad \langle A^2\rangle = \sum_n a_n^2|c_n|^2 = \langle\psi|\hat A^2|\psi\rangle.$$

$\Delta A$ ist die Standardabweichung einer Messreihe an vielen gleich präparierten Systemen. Sie ist genau dann null, wenn $|\psi\rangle$ ein Eigenzustand von $\hat A$ ist; dann kommt jedes Mal derselbe Wert. Wieder hast du zwei Wege: über die Wahrscheinlichkeiten oder über das Sandwich mit $\hat A^2$.`,
        q:{q:R`In welchem Zustand ist $\Delta B = 0$ für $\hat B$ mit den Eigenvektoren $|\pm\rangle$?`,
          opts:[R`in $|+\rangle$ oder in $|-\rangle$`, R`in $\tfrac{1}{\sqrt2}\left(|+\rangle + |-\rangle\right)$, weil dort $\langle B\rangle = 0$ ist`, R`in keinem Zustand; Quantenmessungen streuen immer`], a:0,
          ex:R`In einem Eigenzustand ist das Ergebnis sicher, also streut nichts. $\langle B\rangle = 0$ heißt nur, dass sich $+1$ und $-1$ im Mittel aufheben.`,
          fb:['',
            R`Ein Erwartungswert von null ist keine Streuung von null. In dieser Überlagerung kommen $+1$ und $-1$ je zur Hälfte, also ist $\Delta B = 1$.`,
            R`In einem Eigenzustand von $\hat B$ streut $B$ nicht. Unschärfe ist eine Eigenschaft des Zustands, nicht jeder Messung.`]}},
      {id:'form-t6b', title:'Der Kommutator: Zählt die Reihenfolge?',
        num:{title:'Zwei Matrizen, zwei Reihenfolgen', text:R`$\sigma_x\sigma_z = \begin{pmatrix}0 & 1\\ 1 & 0\end{pmatrix}\begin{pmatrix}1 & 0\\ 0 & -1\end{pmatrix} = \begin{pmatrix}0 & -1\\ 1 & 0\end{pmatrix}$, aber $\sigma_z\sigma_x = \begin{pmatrix}0 & 1\\ -1 & 0\end{pmatrix}$. Die Differenz ist

$$[\sigma_x, \sigma_z] = \begin{pmatrix}0 & -2\\ 2 & 0\end{pmatrix} = -2i\,\sigma_y.$$`},
        text:R`Der [[lex:kommutator|Kommutator]] $[\hat A, \hat B] = \hat A\hat B - \hat B\hat A$, gelesen „Kommutator von A und B“, misst, ob die Reihenfolge zählt. Für Zahlen ist er immer null, für Operatoren meist nicht. Der wichtigste ist

$$[\hat x, \hat p] = i\hbar.$$

Du rechnest ihn aus, indem du ihn auf eine Testfunktion $f$ anwendest (Herleitung). Die Produktregel liefert genau einen übrigen Term. Rechenregeln: $[\hat A, \hat B] = -[\hat B, \hat A]$ und $[\hat A, \hat B\hat C] = [\hat A, \hat B]\hat C + \hat B[\hat A, \hat C]$. Bemerkenswert: Keine endliche Matrix erfüllt $[X, P] = i\hbar\,\mathbb 1$, denn jeder Kommutator von Matrizen hat die Spur null (M4). Ort und Impuls brauchen unendlich viele Dimensionen.`,
        derive:{ctx:{coords:['x'], params:{}, abstract:{f:{args:['x']}, g:{args:['x']}}}, lines:[
          {l:'[x̂, p̂] f = x (-iħ f\') - (-iħ)(x f)\'', w:'auf eine Testfunktion angewandt',
            why:{q:'Warum steht im zweiten Term $(xf)\'$ und nicht $x f\'$?', opts:['$\\hat p$ wirkt auf alles rechts von ihm, also auf $xf$.', 'Weil $\\hat x$ und $\\hat p$ vertauschen.', 'Das ist eine Konvention; $xf\'$ ginge genauso.'], a:0, ex:'In $\\hat p\\hat x f$ wirkt zuerst $\\hat x$, dann leitet $\\hat p$ das Produkt $xf$ ab.'}},
          {l:'= -iħ x f\' + iħ (f + x f\')', w:'Produktregel: (xf)′ = f + xf′'},
          {l:'= iħ f', w:'die Terme mit xf′ heben sich weg',
            why:{q:'Welcher Term bleibt nach der Produktregel übrig?', opts:['$i\\hbar f$, aus der Ableitung von $x$', '$-i\\hbar x f\'$, aus der Ableitung von $f$', 'keiner, $\\hat x$ und $\\hat p$ vertauschen'], a:0, ex:'Die Terme $\\mp i\\hbar xf\'$ heben sich weg; übrig bleibt der Beitrag der Ableitung von $x$.'}}
        ]},
        q:{q:R`Was ist $[\hat p, \hat x]$?`,
          opts:[R`$i\hbar$`, R`$-i\hbar$`, R`$0$, weil $\hat x$ und $\hat p$ beide hermitesch sind`], a:1,
          ex:R`$[\hat p, \hat x] = -[\hat x, \hat p] = -i\hbar$.`,
          fb:[R`Die Reihenfolge im Kommutator zählt: Vertauschen dreht das Vorzeichen.`,
            '',
            R`Hermitesch zu sein, heißt nicht zu vertauschen. $\hat x$ und $\hat p$ sind beide hermitesch und vertauschen nicht.`]}},
      {id:'form-t6c', title:'Verträgliche Observable: eine gemeinsame Eigenbasis',
        num:{title:'Zwei Diagonalmatrizen', text:R`$\hat A \doteq \mathrm{diag}(1, 2)$ und $\hat B \doteq \mathrm{diag}(5, 7)$ vertauschen. Beide haben die Eigenvektoren $(1;\ 0)$ und $(0;\ 1)$. Im Zustand $(1;\ 0)$ sind beide scharf: $A = 1$ und $B = 5$, jedes Mal. Dagegen vertauscht $\sigma_x$ nicht mit $\sigma_z$, und kein Vektor ist Eigenvektor von beiden.`},
        text:R`Gilt $[\hat A, \hat B] = 0$, heißen die Observablen **verträglich**. Sie haben dann eine gemeinsame Eigenbasis ([[lex:gemeinsame-eigenbasis|gemeinsame Eigenbasis]], M4). Für einen nicht entarteten Eigenwert siehst du das direkt: Aus $\hat A|a\rangle = a|a\rangle$ folgt

$$\hat A\big(\hat B|a\rangle\big) = \hat B\hat A|a\rangle = a\,\hat B|a\rangle.$$

Also ist $\hat B|a\rangle$ Eigenvektor zu $a$ und damit ein Vielfaches von $|a\rangle$. In einem gemeinsamen Eigenzustand sind beide Größen gleichzeitig scharf. Eine $B$-Messung zerstört dann ein $A$-Ergebnis nicht. Vertauschen die Observablen nicht, gibt es Messfolgen wie in Abschnitt 4, in denen eine Messung die vorige löscht.`,
        q:{q:R`$[\hat A, \hat B] = 0$, und das System ist im Eigenzustand $|a\rangle$ von $\hat A$ zu einem nicht entarteten Eigenwert. Du misst $B$ und dann wieder $A$. Was liefert die zweite $A$-Messung?`,
          opts:[R`$a$ mit Wahrscheinlichkeit $\tfrac12$`, R`irgendeinen Eigenwert von $\hat A$, je nach $B$-Ergebnis`, R`sicher wieder $a$`], a:2,
          ex:R`$|a\rangle$ ist auch Eigenzustand von $\hat B$. Die $B$-Messung lässt ihn unverändert, also kommt wieder sicher $a$.`,
          fb:[R`So wäre es bei nicht vertauschenden Observablen wie in Abschnitt 4. Hier vertauschen sie.`,
            R`Die $B$-Messung präpariert einen $B$-Eigenzustand. Weil $|a\rangle$ schon einer ist, bleibt er erhalten.`,
            '']}},
      {id:'form-t6d', title:'Achtung, Entartung: nicht jeder Eigenvektor ist gemeinsam',
        num:{title:'Ein Eigenvektor, der nicht passt', text:R`$\hat A \doteq \mathrm{diag}(1, 1, 2)$ und $\hat B \doteq \mathrm{diag}(3, 4, 5)$ vertauschen. $(1;\ 1;\ 0)$ ist Eigenvektor von $\hat A$ zum entarteten Eigenwert $1$. Aber $\hat B(1;\ 1;\ 0) = (3;\ 4;\ 0)$ ist kein Vielfaches davon, also kein Eigenvektor von $\hat B$.`},
        text:R`Ist ein Eigenwert $a$ von $\hat A$ entartet, trägt das Argument aus dem letzten Schritt nicht mehr. $\hat B|a\rangle$ liegt dann zwar wieder im Eigenraum zu $a$, muss aber kein Vielfaches von $|a\rangle$ sein.

„Vertauschbar“ heißt deshalb nicht, dass *jeder* Eigenvektor von $\hat A$ auch einer von $\hat B$ ist. Es heißt nur: Es gibt eine gemeinsame Eigenbasis, und im entarteten Eigenraum musst du sie gezielt wählen. Im Beispiel ist die gemeinsame Basis die Standardbasis, und $(1;\ 1;\ 0)$ gehört nicht dazu. Mehr dazu unter [[lex:vertraegliche-observable|verträgliche Observable]].`,
        q:{q:R`Beim freien Teilchen ist $[\hat H, \hat p] = 0$, und $\cos kx$ ist eine Eigenfunktion von $\hat H$. Ist $\cos kx$ auch eine Eigenfunktion von $\hat p$?`,
          opts:[R`Ja, weil $\hat H$ und $\hat p$ vertauschen.`, R`Nein: $\hat p\cos kx = i\hbar k\sin kx$ ist kein Vielfaches.`, R`Ja, zum Eigenwert $\hbar k$, wie $e^{ikx}$.`], a:1,
          ex:R`Die Energie zu $\hbar k$ ist zweifach entartet ($e^{ikx}$ und $e^{-ikx}$). $\cos kx$ ist eine Mischung beider und deshalb keine Impulseigenfunktion. Gemeinsam sind nur $e^{\pm ikx}$.`,
          fb:[R`Genau das ist der Fehlschluss. Bei Entartung folgt aus dem Vertauschen nicht, dass jede Eigenfunktion gemeinsam ist.`,
            '',
            R`$\cos kx = \tfrac12\left(e^{ikx} + e^{-ikx}\right)$ enthält die Impulse $+\hbar k$ und $-\hbar k$.`]}},
      {id:'form-t6e', title:'Die Robertson-Unschärferelation',
        pre:{from:'m-vektor', seg:'mv-t5', title:'Cauchy-Schwarz', text:R`Für alle Vektoren gilt $|\langle a|b\rangle|^2 \le \langle a|a\rangle\,\langle b|b\rangle$, mit Gleichheit genau dann, wenn $a$ und $b$ linear abhängig sind. Mini-Beispiel: $a = (1;\ 0)$, $b = (1;\ 1)$ geben $|\langle a|b\rangle|^2 = 1 \le 1\cdot2$.`},
        num:{title:'Der Kasten-Grundzustand', text:R`Im Grundzustand des Kastens ist $\Delta x = L\sqrt{\tfrac{1}{12} - \tfrac{1}{2\pi^2}} \approx 0{,}181\,L$ und $\Delta p = \pi\hbar/L$. Das Produkt ist $\Delta x\,\Delta p \approx 0{,}568\,\hbar$. Das liegt über der Schranke $\hbar/2$, wie es sein muss. Das Gauß-Paket erreicht die Schranke genau.`},
        text:R`Für zwei beliebige Observable gilt in jedem Zustand die [[lex:robertson|Robertson-Unschärferelation]]

$$\Delta A\,\Delta B \ge \frac12\left|\langle[\hat A, \hat B]\rangle\right|.$$

Die Idee des Beweises: Setze $|f\rangle = (\hat A - \langle A\rangle)|\psi\rangle$ und $|g\rangle = (\hat B - \langle B\rangle)|\psi\rangle$. Dann ist $\langle f|f\rangle = (\Delta A)^2$ und $\langle g|g\rangle = (\Delta B)^2$. [[lex:cauchy-schwarz|Cauchy-Schwarz]] und „Betrag mindestens Imaginärteil“ geben die Schranke. Zuletzt zeigt Ausmultiplizieren $\langle f|g\rangle - \langle g|f\rangle = \langle[\hat A, \hat B]\rangle$. Die Herleitung geht die drei Schritte dazwischen durch. Mit $[\hat x, \hat p] = i\hbar$ folgt $\Delta x\,\Delta p \ge \hbar/2$ für jeden Zustand.`,
        derive:{ctx:{coords:['x'], params:{}, abstract:{f:{args:['x']}, g:{args:['x']}}}, lines:[
          {l:'⟨f|f⟩ ⟨g|g⟩ ≥ |⟨f|g⟩|^2', w:'Cauchy-Schwarz',
            why:{q:'Wann gilt in Cauchy-Schwarz das Gleichheitszeichen?', opts:['wenn $|g\\rangle$ ein Vielfaches von $|f\\rangle$ ist', 'wenn $\\langle f|g\\rangle = 0$ ist', 'nie, es gilt immer das Größerzeichen'], a:0, ex:'Gleichheit bei parallelen Vektoren. Zustände minimaler Unschärfe erfüllen deshalb $(\\hat B - \\langle B\\rangle)\\psi = c\\,(\\hat A - \\langle A\\rangle)\\psi$, und zwar mit rein imaginärem $c$: Sonst bliebe der Realteil von $\\langle f|g\\rangle$, und die nächste Ungleichung wäre nicht scharf. Das Gauß-Paket ist ein Beispiel.'}},
          {l:'|⟨f|g⟩|^2 ≥ Im(⟨f|g⟩)^2', w:'|z|² = (Re z)² + (Im z)²',
            why:{q:'Warum gilt diese Ungleichung?', opts:['weil $|z|^2 = (\\mathrm{Re}\\,z)^2 + (\\mathrm{Im}\\,z)^2$ ist', 'weil $\\langle f|g\\rangle$ für jeden Zustand reell ist', 'weil $\\mathrm{Im}\\,z$ für jedes $z$ positiv ist'], a:0, ex:'Der Realteil wird einfach weggelassen; deshalb ist die Robertson-Relation nicht immer scharf.'}},
          {l:'Im(⟨f|g⟩) = (⟨f|g⟩ - ⟨g|f⟩)/(2i)', w:'⟨g|f⟩ = ⟨f|g⟩*',
            why:{q:'Welche Regel steckt in dieser Zeile?', opts:['$\\langle g|f\\rangle = \\langle f|g\\rangle^*$ und $z - z^* = 2i\\,\\mathrm{Im}\\,z$', '$\\langle g|f\\rangle = -\\langle f|g\\rangle$ für alle Vektoren', '$\\langle g|f\\rangle = \\langle f|g\\rangle$ für alle Vektoren'], a:0, ex:'Mit $\\langle f|g\\rangle - \\langle g|f\\rangle = \\langle[\\hat A, \\hat B]\\rangle$ wird daraus $\\langle[\\hat A, \\hat B]\\rangle/2i$.'}}
        ]},
        q:{q:R`Ein Zustand hat $\Delta x = 0{,}1\,\mathrm{nm}$. Was folgt für $\Delta p$?`,
          opts:[R`$\Delta p \le \hbar/(0{,}2\,\mathrm{nm})$`, R`$\Delta p = \hbar/(0{,}2\,\mathrm{nm})$`, R`$\Delta p \ge \hbar/(0{,}2\,\mathrm{nm})$`], a:2,
          ex:R`Robertson gibt eine untere Schranke: $\Delta p \ge \hbar/(2\Delta x)$. Gleichheit gilt nur für Zustände minimaler Unschärfe wie das Gauß-Paket.`,
          fb:[R`Die Relation begrenzt das Produkt nach unten. Kleines $\Delta x$ erzwingt großes $\Delta p$, nicht kleines.`,
            R`Gleichheit gilt nur für Zustände minimaler Unschärfe. Der Kasten-Grundzustand etwa liegt darüber.`,
            '']}},
      {id:'form-t6f', title:'Typische Fehlvorstellung: Unschärfe als Messfehler',
        num:{title:'Zwei Messreihen', text:R`An 1000 gleich präparierten Elektronen misst ein ideales Gerät den Ort, an 1000 anderen den Impuls. Die Ortswerte streuen um $\Delta x = 0{,}18\,\mathrm{nm}$. Dann streuen die Impulswerte um mindestens $\hbar/(0{,}36\,\mathrm{nm}) \approx 2{,}9\cdot10^{-25}\,\mathrm{kg\,m/s}$ – wie genau das Gerät auch ist.`},
        text:R`**Deutung.** $\Delta A$ und $\Delta B$ sind Streuungen von Messreihen an vielen gleich präparierten Systemen: An einem Teil misst man $A$, am anderen $B$. Die Relation sagt: Es gibt keinen Zustand, in dem beide Streuungen beliebig klein sind.

Sie handelt nicht von der Ungenauigkeit eines Messgeräts und auch nicht davon, dass eine Messung das System „anstößt“. Ein perfektes Gerät ändert nichts an $\Delta x\,\Delta p \ge \hbar/2$. Die Schranke kommt allein aus dem Kommutator, also aus der Mathematik der Zustände. Sie ist eine Eigenschaft des Zustands.`,
        q:{q:R`Was beschreibt $\Delta x$ in $\Delta x\,\Delta p \ge \hbar/2$?`,
          opts:[R`die Auflösung des Messgeräts für den Ort`, R`die Störung des Orts durch eine Impulsmessung`, R`die Streuung der Ortswerte in einer Messreihe`], a:2,
          ex:R`$\Delta x$ ist die Standardabweichung der Ortswerte vieler Messungen an gleich präparierten Systemen – eine Eigenschaft des Zustands.`,
          fb:[R`Auch ein ideales Gerät misst Werte, die mit $\Delta x$ streuen. Die Auflösung kommt in der Relation nicht vor.`,
            R`In der Relation wird an einem System nur eine Größe gemessen. Von einer Störung durch die andere Messung handelt sie nicht.`,
            '']}}
    ]},

    /* ===== Abschnitt 7: Zeitentwicklung, Ehrenfest, Energie-Zeit ===== */
    {id:'form-t7', title:'Postulat 6: Zeitentwicklung, Ehrenfest und Energie-Zeit-Unschärfe', steps:[
      {id:'form-t7a', title:'Postulat 6: die Schrödingergleichung für Kets',
        pre:{from:'kasten', seg:'kasten-t5', title:'Zeitentwicklung im Kasten', text:R`Jeder Eigenzustand bekommt seinen eigenen Phasenfaktor: $\Psi(x, t) = \sum_n c_n\,\psi_n(x)\,e^{-iE_nt/\hbar}$. Die Gewichte $|c_n|^2$ bleiben gleich, nur die relativen Phasen drehen sich. Deshalb „schwappt“ die Dichte einer Überlagerung.`},
        num:{title:'Zwei Phasen, eine Periode', text:R`Kasten mit $L = 1\,\mathrm{nm}$, Elektron, $E_1 \approx 0{,}376\,\mathrm{eV}$. Für $|\Psi(0)\rangle = \tfrac{1}{\sqrt2}\left(|\psi_1\rangle + |\psi_2\rangle\right)$ ist

$$c_1(t) = \tfrac{1}{\sqrt2}e^{-iE_1t/\hbar},\qquad c_2(t) = \tfrac{1}{\sqrt2}e^{-4iE_1t/\hbar}.$$

Die relative Phase dreht sich mit $3E_1/\hbar$. Nach $T = 2\pi\hbar/(3E_1) \approx 3{,}7\,\mathrm{fs}$ ist der Zustand wieder der alte, bis auf eine globale Phase.`},
        text:R`**Postulat 6.** Zwischen Messungen entwickelt sich der Zustand nach der Schrödingergleichung

$$i\hbar\frac{d}{dt}|\psi(t)\rangle = \hat H|\psi(t)\rangle.$$

In der Energiebasis zerfällt sie in einzelne Gleichungen, eine je Komponente, mit der Lösung $c_n(t) = c_n(0)\,e^{-iE_nt/\hbar}$. In der Ortsdarstellung ist sie die partielle Differentialgleichung aus Thema 2. Nach einer Energiemessung mit Ergebnis $E_n$ ist der Zustand $|\psi_n\rangle$ stationär; er ändert sich nur um eine Phase. Nach der Messung einer anderen Größe entwickelt er sich dagegen im Allgemeinen weiter, etwa nach einer Ortsmessung im Kasten (Thema 3).`,
        reps:{obj:'Zeitentwicklung',
          rows:[
            {k:'worte', text:R`Jede Energiekomponente dreht ihre Phase, umso schneller, je größer ihre Energie.`},
            {k:'dirac', tex:R`i\hbar\,\tfrac{d}{dt}|\psi(t)\rangle = \hat H|\psi(t)\rangle`},
            {k:'matrix', tex:R`\begin{pmatrix}c_1(t)\\ c_2(t)\end{pmatrix} = \begin{pmatrix}e^{-iE_1t/\hbar} & 0\\ 0 & e^{-iE_2t/\hbar}\end{pmatrix}\begin{pmatrix}c_1(0)\\ c_2(0)\end{pmatrix}`},
            {k:'ort', tex:R`i\hbar\,\partial_t\Psi(x, t) = -\tfrac{\hbar^2}{2m}\,\partial_x^2\Psi + V(x)\,\Psi`},
            {k:'physik', text:R`Die Energie-Wahrscheinlichkeiten $|c_n|^2$ bleiben konstant. Größen, die nicht mit $\hat H$ vertauschen, schwingen mit den Frequenzen $(E_m - E_n)/\hbar$.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`Die Zeitableitung des Kets ist $\hat H$ angewandt auf den Ket, geteilt durch $i\hbar$.`},
            {from:'dirac', to:'matrix', rule:R`In der Energiebasis ist $\hat H$ diagonal. Jede Komponente erfüllt $i\hbar\,\dot c_n = E_nc_n$, also $c_n(t) = c_n(0)\,e^{-iE_nt/\hbar}$.`},
            {from:'matrix', to:'ort', rule:R`Komponenten mal Eigenfunktionen aufsummieren: $\Psi(x, t) = \sum_n c_n(t)\,\psi_n(x)$ löst die partielle Differentialgleichung.`},
            {from:'ort', to:'physik', rule:R`In $|\Psi|^2$ und in Erwartungswerten treten Mischterme mit $e^{-i(E_m - E_n)t/\hbar}$ auf. Sie lassen die Dichte schwingen; die Betragsquadrate $|c_n|^2$ selbst bleiben fest.`}
          ]},
        q:{q:R`In der Energiebasis ist $|\psi(0)\rangle \doteq (c_1;\ c_2)$. Was ist $|\psi(t)\rangle$?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$e^{-i\langle H\rangle t/\hbar}\,(c_1;\ c_2)$, eine gemeinsame Phase`, R`$\left(c_1\cos\tfrac{E_1t}{\hbar};\ c_2\cos\tfrac{E_2t}{\hbar}\right)$`, R`$\left(c_1e^{-iE_1t/\hbar};\ c_2e^{-iE_2t/\hbar}\right)$`], a:2,
          ex:R`$\hat H$ ist in der Energiebasis diagonal. Jede Komponente bekommt ihren eigenen Phasenfaktor.`,
          fb:[R`Eine gemeinsame Phase würde nichts verändern. Jede Komponente hat aber ihre eigene Energie und dreht sich verschieden schnell.`,
            R`Die Lösung von $i\hbar\,\dot c = Ec$ ist komplex, $e^{-iEt/\hbar}$. Mit dem Kosinus allein bliebe die Norm nicht erhalten.`,
            '']}},
      {id:'form-t7b', title:'Wie sich Erwartungswerte ändern: Ehrenfest',
        num:{title:'Was konstant bleibt, was schwingt', text:R`Für den Zustand aus dem letzten Schritt ist $\langle H\rangle = \tfrac12E_1 + \tfrac12\cdot4E_1 = 2{,}5\,E_1$ zu jeder Zeit, denn die $|c_n(t)|^2$ ändern sich nicht. Der mittlere Ort dagegen schwingt, mit dem Kastenmatrixelement aus Abschnitt 2:

$$\langle x\rangle(t) = \frac L2 - \frac{16L}{9\pi^2}\cos\frac{3E_1t}{\hbar}.$$`},
        text:R`Leite $\langle A\rangle = \langle\psi|\hat A\psi\rangle$ nach der Zeit ab. Die Produktregel gibt zwei Terme: einen mit $|\dot\psi\rangle$ im Bra, einen im Ket. Setze $|\dot\psi\rangle = \hat H|\psi\rangle/(i\hbar)$ ein. Im Bra wird der Faktor konjugiert, $1/(i\hbar)^* = -1/(i\hbar)$, und weil $\hat H$ hermitesch ist, darfst du es aus dem Bra nach rechts schieben:

$$\begin{aligned}\frac{d}{dt}\langle A\rangle &= \langle\dot\psi|\hat A\psi\rangle + \langle\psi|\hat A\dot\psi\rangle\\ &= \tfrac{1}{i\hbar}\big(\langle\psi|\hat A\hat H\psi\rangle - \langle\psi|\hat H\hat A\psi\rangle\big).\end{aligned}$$

Die Klammer ist $\langle[\hat A, \hat H]\rangle$, und $\frac{1}{i\hbar}[\hat A, \hat H] = \frac{i}{\hbar}[\hat H, \hat A]$. Für ein $\hat A$ ohne explizite Zeitabhängigkeit ist das das [[lex:ehrenfest|Ehrenfest-Theorem]]

$$\frac{d}{dt}\langle A\rangle = \frac{i}{\hbar}\langle[\hat H, \hat A]\rangle.$$

Daraus folgt sofort: Vertauscht $\hat A$ mit $\hat H$, ist $\langle A\rangle$ in jedem Zustand konstant, eine **Erhaltungsgröße**. Beim freien Teilchen ist $[\hat H, \hat p] = 0$; $\langle p\rangle$ und die ganze Impulsverteilung bleiben gleich (Thema 4). Im Kasten vertauscht $\hat x$ nicht mit $\hat H$, deshalb schwingt $\langle x\rangle$.`,
        q:{q:R`Ein Operator $\hat A$ vertauscht mit $\hat H$. Was folgt?`,
          opts:[R`$\langle A\rangle$ ist in jedem Zustand null.`, R`$\langle A\rangle$ ist in jedem Zustand zeitlich konstant.`, R`Jeder Zustand ist Eigenzustand von $\hat A$.`], a:1,
          ex:R`$\frac{d}{dt}\langle A\rangle = \frac{i}{\hbar}\langle[\hat H, \hat A]\rangle = 0$. Das ist die quantenmechanische Form eines Erhaltungssatzes.`,
          fb:[R`Ehrenfest sagt etwas über die Änderung, nicht über den Wert. Konstant heißt nicht null.`,
            '',
            R`Vertauschen heißt: Es gibt eine gemeinsame Eigenbasis. Andere Zustände bleiben Überlagerungen.`]}},
      {id:'form-t7c', title:'Die klassische Grenze',
        num:{title:'Der Oszillator', text:R`Harmonischer Oszillator, $V = \tfrac12m\omega^2x^2$: $V' = m\omega^2x$ ist linear, also gilt exakt $\langle V'\rangle = m\omega^2\langle x\rangle$. Mit den beiden Gleichungen unten folgt $\frac{d^2}{dt^2}\langle x\rangle = -\omega^2\langle x\rangle$. Der Mittelwert schwingt also genau wie ein klassisches Teilchen (Thema 7).`},
        text:R`Mit $[\hat H, \hat p] = i\hbar V'(\hat x)$ und $[\hat H, \hat x] = -i\hbar\hat p/m$ (Herleitung) gibt das Ehrenfest-Theorem

$$\frac{d}{dt}\langle x\rangle = \frac{\langle p\rangle}{m},\qquad \frac{d}{dt}\langle p\rangle = -\langle V'(x)\rangle.$$

Das sieht aus wie Newton: Geschwindigkeit gleich Impuls durch Masse, Kraft gleich minus Ableitung des Potentials. Ist $V'$ linear in $x$, wie beim Oszillator oder im homogenen Feld, gelten die klassischen Gleichungen für die Mittelwerte exakt. Die Herleitung wendet beide Kommutatoren auf eine Testfunktion an, eine Umformung je Zeile.`,
        derive:{ctx:FORM_FG(), lines:[
          {l:'[Ĥ, p̂] f = V (-iħ f\') - (-iħ)(V f)\'', w:'p̂²/2m vertauscht mit p̂',
            why:{q:'Warum taucht der kinetische Anteil $\\hat p^2/2m$ nicht auf?', opts:['$\\hat p^2$ vertauscht mit $\\hat p$.', 'Er ist klein gegen das Potential $V$.', 'Er hebt sich erst nach Integration weg.'], a:0, ex:'$[\\hat p^2, \\hat p] = \\hat p^3 - \\hat p^3 = 0$.'}},
          {l:'= -iħ V f\' + iħ (V\' f + V f\')', w:'Produktregel: (Vf)′ = V′f + Vf′'},
          {l:'= iħ V\' f', w:'die Terme mit Vf′ heben sich weg',
            why:{q:'Was bleibt nach der Produktregel übrig?', opts:['nur der Term, in dem die Ableitung auf $V$ wirkt', 'nur der Term, in dem die Ableitung auf $f$ wirkt', 'nichts, der Kommutator ist null'], a:0, ex:'Damit wird $\\frac{d}{dt}\\langle p\\rangle = \\frac{i}{\\hbar}\\langle i\\hbar V\'\\rangle = -\\langle V\'\\rangle$.'}},
          {l:'[Ĥ, x̂] f = -ħ^2/(2m) (x f)\'\' + ħ^2/(2m) x f\'\'', w:'V vertauscht mit x̂'},
          {l:'= -ħ^2/(2m) (2 f\' + x f\'\') + ħ^2/(2m) x f\'\'', w:'Produktregel zweimal: (xf)″ = 2f′ + xf″',
            why:{q:'Woher kommt der Faktor 2 in $(xf)\'\' = 2f\' + xf\'\'$?', opts:['Jede der beiden Ableitungen trifft einmal das $x$.', 'aus dem Faktor $\\tfrac{1}{2m}$ in $\\hat H$', 'Er ist ein Rundungsfehler und eigentlich 1.'], a:0, ex:'$(xf)\' = f + xf\'$, noch einmal abgeleitet $f\' + f\' + xf\'\' = 2f\' + xf\'\'$.'}},
          {l:'= -ħ^2/m f\'', w:'die Terme mit xf″ heben sich weg'},
          {l:'= -iħ/m p̂ f', w:'−ħ²f′ = −iħ·(−iħ f′)',
            why:{q:'Was folgt daraus mit Ehrenfest?', opts:['$\\frac{d}{dt}\\langle x\\rangle = \\langle p\\rangle/m$', '$\\frac{d}{dt}\\langle x\\rangle = 0$', '$\\frac{d}{dt}\\langle x\\rangle = -\\langle p\\rangle/m$'], a:0, ex:'$\\frac{i}{\\hbar}\\cdot\\left(-\\frac{i\\hbar}{m}\\langle p\\rangle\\right) = \\langle p\\rangle/m$. Übungsaufgabe 4 leitet dasselbe direkt aus der Schrödingergleichung her.'}}
        ]},
        q:{q:R`Ein Teilchen fällt im homogenen Schwerefeld, $V = mgx$. Was gilt für $\langle x\rangle(t)$?`,
          opts:[R`Es folgt der klassischen Wurfbahn nur, wenn das Paket schmal ist.`, R`Es bleibt konstant, weil $\hat H$ nicht von der Zeit abhängt.`, R`Es folgt exakt der klassischen Wurfbahn.`], a:2,
          ex:R`$V' = mg$ ist konstant, also $\langle V'\rangle = mg$ für jeden Zustand. Damit gilt $\frac{d^2}{dt^2}\langle x\rangle = -g$ exakt.`,
          fb:[R`Die Bedingung „schmales Paket“ braucht man nur, wenn $V'$ nicht linear ist. Hier ist $V'$ sogar konstant.`,
            R`Ein zeitunabhängiges $\hat H$ macht $\langle H\rangle$ konstant, aber nicht $\langle x\rangle$: $\hat x$ vertauscht nicht mit $\hat H$.`,
            '']}},
      {id:'form-t7d', title:'Typischer Fehler: ⟨V′(x)⟩ ist nicht V′(⟨x⟩)',
        num:{title:'Ein stark gekrümmtes Potential', text:R`$V = x^4$ in passenden Einheiten, also $V' = 4x^3$. Ein Gauß-Paket um $\langle x\rangle = 1$ mit $\Delta x = 0{,}5$ hat $\langle x^3\rangle = \langle x\rangle^3 + 3\langle x\rangle(\Delta x)^2 = 1 + 0{,}75 = 1{,}75$. Also ist $\langle V'\rangle = 7$, aber $V'(\langle x\rangle) = 4$.`},
        text:R`Die Gleichung $\frac{d}{dt}\langle p\rangle = -\langle V'(x)\rangle$ verleitet dazu, $V'$ einfach an der Stelle $\langle x\rangle$ auszuwerten. Das ist im Allgemeinen falsch: Der Mittelwert einer Funktion ist nicht die Funktion des Mittelwerts.

Nur wenn das Paket schmal ist gegen die Länge, auf der sich $V'$ ändert, gilt näherungsweise $\langle V'(x)\rangle \approx V'(\langle x\rangle)$. Dann folgt $\langle x\rangle$ der klassischen Bahn. Ein breites Paket in einem stark gekrümmten Potential bewegt sich anders als ein klassisches Teilchen. Im Beispiel ist die mittlere Kraft fast doppelt so groß wie die Kraft am mittleren Ort.`,
        q:{q:R`Für welches Potential gilt $\langle V'(x)\rangle = V'(\langle x\rangle)$ in jedem Zustand?`,
          opts:[R`$V = x^4$`, R`$V = \tfrac12m\omega^2x^2$`, R`$V = V_0\cos(x/a)$`], a:1,
          ex:R`Nur wenn $V'$ linear in $x$ ist, darf man den Mittelwert hineinziehen: $\langle m\omega^2x\rangle = m\omega^2\langle x\rangle$.`,
          fb:[R`$V' = 4x^3$ ist nicht linear; im Beispiel ist $\langle V'\rangle = 7$, aber $V'(\langle x\rangle) = 4$.`,
            '',
            R`$V' = -\tfrac{V_0}{a}\sin(x/a)$ ist nicht linear. Der Mittelwert des Sinus ist nicht der Sinus des Mittelwerts.`]}},
      {id:'form-t7e', title:'Energie-Zeit-Unschärfe',
        num:{title:'Wie schnell sich etwas ändern kann', text:R`Für $|\Psi\rangle = \tfrac{1}{\sqrt2}\left(|\psi_1\rangle + |\psi_2\rangle\right)$ ist $\langle H\rangle = 2{,}5\,E_1$ und $\langle H^2\rangle = \tfrac12(1 + 16)E_1^2 = 8{,}5\,E_1^2$, also $\Delta H = \sqrt{8{,}5 - 6{,}25}\,E_1 = 1{,}5\,E_1$. Für $L = 1\,\mathrm{nm}$ ist $\hbar/(2\Delta H) = \hbar/(3E_1) \approx 0{,}6\,\mathrm{fs}$. So lange braucht jeder Erwartungswert in diesem Zustand mindestens, um sich um eine Standardabweichung zu ändern.`},
        text:R`Die Zeit ist in der Quantenmechanik ein Parameter, kein Operator. Eine Relation $\Delta E\,\Delta t \ge \hbar/2$ gilt deshalb nicht im selben Sinn wie für $x$ und $p$. Eine genaue Fassung folgt aus Robertson mit $\hat B = \hat H$ und dem Ehrenfest-Theorem:

$$\Delta H\,\Delta A \ge \frac12\left|\langle[\hat H, \hat A]\rangle\right| = \frac\hbar2\left|\frac{d\langle A\rangle}{dt}\right|.$$

Mit $\Delta t_A = \Delta A/|d\langle A\rangle/dt|$, der Zeit, in der sich $\langle A\rangle$ um eine Standardabweichung ändert, wird daraus $\Delta H\,\Delta t_A \ge \hbar/2$ ([[lex:energie-zeit-unschaerfe|Energie-Zeit-Unschärfe]]). Ein Zustand mit scharfer Energie ändert sich nicht. Schnelle Änderung verlangt eine breite Energieverteilung. Verwandt, aber eine eigene Aussage: Ein exponentiell zerfallender Zustand mit Lebensdauer $\tau$ hat eine Spektrallinie der Breite $\Gamma = \hbar/\tau$.`,
        q:{q:R`Ein Zustand hat eine scharfe Energie ($\Delta H = 0$). Was sagt die Energie-Zeit-Relation?`,
          opts:[R`Kein Erwartungswert ändert sich: Der Zustand ist stationär.`, R`Eine Energiemessung an ihm dauert unendlich lange.`, R`Der Zustand zerfällt sofort, weil $\Delta t = 0$ ist.`], a:0,
          ex:R`$\Delta H\,\Delta t_A \ge \hbar/2$ mit $\Delta H = 0$ verlangt $\Delta t_A = \infty$, also $d\langle A\rangle/dt = 0$ für jede Observable.`,
          fb:['',
            R`$\Delta t_A$ ist keine Messdauer, sondern die Zeit, in der sich ein Erwartungswert merklich ändert.`,
            R`Umgekehrt: $\Delta H = 0$ erzwingt $\Delta t_A = \infty$. Der Zustand ändert sich nie.`]}}
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
    map:[
      {sym:R`|c_n|^2`, ctl:'|c₁|² (Gewicht)', says:R`Die Regler $|c_1|^2$, $|c_2|^2$, $|c_3|^2$ stellen die Gewichte im Zustand $\sum_n c_n|a_n\rangle$ ein; das Labor normiert sie auf die Summe $1$. Nach der Born-Regel sind sie die Wahrscheinlichkeiten $P(a_n)$, im Bild die blauen Balken.`},
      {sym:R`a_n = 1, 2, 3`, ctl:'Messwert a (Eigenwerte 1, 2, 3)', says:R`Die Eigenwerte von $\hat A$ auf der waagerechten Achse. Nur diese drei Werte kann eine Messung liefern (Postulat 3).`},
      {sym:R`N`, ctl:'100× messen', says:R`$N$ weitere Messungen an gleich präparierten Systemen. Die roten Balken zeigen die relativen Häufigkeiten; mit wachsendem $N$ nähern sie sich den blauen Balken $|c_n|^2$.`},
      {sym:R`\langle A\rangle = \sum_n a_n|c_n|^2`, ctl:'Mittelwert der Messungen', says:R`Die Anzeige rechnet $\langle A\rangle$ und $\Delta A$ aus den Gewichten. Der Mittelwert der Messungen schwankt um $\langle A\rangle$, typisch um $\Delta A/\sqrt N$ (Anzeige „erwartete Streuung des Mittelwerts“).`},
      {sym:R`P(a_n) = |\langle a_n|\psi\rangle|^2`, ctl:'P(A = …)', says:R`Balken für den aktuellen Zustand des einzelnen Systems in der Messfolge. Nach „A messen“ steht ein Balken auf $1$: Das System ist im Eigenzustand zum Ergebnis (Postulat 5).`},
      {sym:R`|\langle b_j|\psi\rangle|^2`, ctl:'P(B = …)', says:R`Dieselbe Born-Regel für $\hat B$ mit der Eigenbasis $b_1 \doteq \tfrac{1}{\sqrt3}(1;\ 1;\ 1)$, $b_2 \doteq \tfrac{1}{\sqrt2}(1;\ 0;\ -1)$, $b_3 \doteq \tfrac{1}{\sqrt6}(1;\ -2;\ 1)$. Nach dem Ergebnis $A = 1$ zeigen die Balken $\tfrac13$, $\tfrac12$, $\tfrac16$.`},
      {sym:R`|\psi\rangle \to |a_n\rangle`, ctl:'A messen', says:R`Eine Messung von $\hat A$ am einzelnen System: zufälliges Ergebnis nach der Born-Regel, danach der Eigenzustand. „Erneut messen“ wiederholt die letzte Messung und bestätigt das Ergebnis.`},
      {sym:R`|\psi\rangle \to |b_j\rangle`, ctl:'B messen', says:R`Eine Messung von $\hat B$. $\hat A$ und $\hat B$ vertauschen nicht: Nach der B-Messung ist das nächste A-Ergebnis wieder zufällig.`},
      {sym:R`|\psi\rangle = \sum_n|c_n|\,|a_n\rangle`, ctl:'Neu präparieren', says:R`Setzt das einzelne System auf den Anfangszustand zurück, mit reellen, positiven Amplituden aus den eingestellten Gewichten.`}
    ],
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
  sketch:[SK.s1],
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
