/* ===== Mathe M5: Funktionenräume und Hilbertraum ===== */
(function(){
const R = String.raw;
const SIN = (extra) => {
  const e = extra || {};
  const base = {coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos', n:{int:[1, 6]}}, defs:{'φ_n(x)':'sqrt(2/L) sin(nπx/L)'}};
  return Object.assign(base, e, {defs:Object.assign({}, base.defs, e.defs || {}), params:Object.assign({}, base.params, e.params || {})});
};
const FG = () => ({coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos'}, abstract:{f:{args:['x']}, g:{args:['x']}}});
topic({
  id:'m-hilbert', ch:'math', title:'Funktionenräume und Hilbertraum', short:'Hilbertraum',
  src:'Griffiths & Schroeter (3. Aufl.) Kap. 3.1–3.3 · Boas (3. Aufl.) Kap. 7 und 12',
  goals:[
    'Ich kann Skalarprodukte $\\langle f|g\\rangle = \\int f^*g\\,dx$ und Normen von Funktionen berechnen und prüfen, ob eine Funktion quadratintegrabel ist.',
    'Ich kann eine Funktion nach einem Orthonormalsystem entwickeln ($c_n = \\langle\\varphi_n|f\\rangle$) und die Vollständigkeit über $\\sum_n|c_n|^2 = \\|f\\|^2$ kontrollieren.',
    'Ich kann mit partieller Integration zeigen, ob ein Differentialoperator hermitesch ist, und beurteile dabei die Randterme.'
  ],
  needs:'Skalarprodukt und Orthonormalbasis im $\\mathbb C^n$ (M3) · partielle Integration (M2) · Integrale mit $\\sin$, $\\cos$ und Polynomen · hermitesche Matrizen (M4)',
  check:[
    {q:'Für die Orthonormalbasis $e_1 = (1, 0)^T$, $e_2 = (0, 1)^T$ und $v = (3, 4)^T$ ist $\\langle e_2|v\\rangle$ gleich …', opts:['$4$', '$3$', '$5$'], a:0, ex:'Die Komponente bezüglich einer Orthonormalbasis ist das Skalarprodukt mit dem Basisvektor: $v = 3e_1 + 4e_2$.', lex:'orthonormalbasis', prev:'m-vektor', seg:'mv-t3'},
    {q:'$\\int_0^L \\sin(\\pi x/L)\\,\\sin(2\\pi x/L)\\,dx$ ist …', opts:['$0$', '$L/2$', '$L/\\pi$'], a:0, ex:'Sinusfunktionen mit verschiedenen $n$ sind auf $[0, L]$ orthogonal. Mit $\\sin a\\sin b = \\frac12[\\cos(a-b) - \\cos(a+b)]$ integrieren sich beide Kosinus zu null.', lex:'orthonormal'},
    {q:'$\\int_0^1 x\\,e^x\\,dx = [x\\,e^x]_0^1 - \\int_0^1 e^x\\,dx$ ergibt …', opts:['$1$', '$e$', '$e - 1$'], a:0, ex:'$e - (e - 1) = 1$.', lex:'partielle-integration', prev:'m-analysis', seg:'ma-t4'},
    {q:'Ist $f(x) = 1/x$ auf $[1, \\infty)$ quadratintegrabel?', opts:['Ja, denn $\\int_1^\\infty x^{-2}\\,dx = 1$ ist endlich.', 'Nein, denn $\\int_1^\\infty x^{-1}\\,dx$ divergiert.', 'Nein, denn $f$ wird nie null.'], a:0, ex:'Es kommt auf $\\int|f|^2dx$ an, nicht auf $\\int f\\,dx$. $f$ muss auch nicht null werden, nur schnell genug abfallen.', lex:'quadratintegrabel'}
  ],
  wozu:'Wellenfunktionen sind Vektoren in einem unendlichdimensionalen Raum. Erst wenn man Funktionen wie Vektoren behandelt – mit Skalarprodukt, Orthonormalbasis und Komponenten –, werden Amplituden $c_n = \\langle\\psi_n|\\psi\\rangle$, Messwahrscheinlichkeiten $|c_n|^2$ und Erwartungswerte zu einfachen Rechnungen. Dasselbe Werkzeug zerlegt in der Akustik einen Klang in Teiltöne, und die Bildkompression JPEG speichert Bilder als Koeffizienten in einer Kosinusbasis.',
  bridge:'Aus M3 kennst du Skalarprodukt, Orthonormalbasis und Komponenten $v_k = \\langle e_k|v\\rangle$, aus M4 hermitesche Matrizen mit reellen Eigenwerten. Hier wird aus der Summe ein Integral und aus der Matrix ein Differentialoperator; partielle Integration (M2) übernimmt die Rolle des Transponierens. Die Sinusfunktionen des Kastens (Thema 3) und die Fourier-Reihe (M6) sind die ersten Beispiele.',
  diag:[
    {q:'Wie beginnst du, um den Koeffizienten $c_3$ von $f$ bezüglich der Orthonormalbasis $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ zu bestimmen?', opts:['Ich berechne das Integral $\\int_0^L\\varphi_3^*(x)\\,f(x)\\,dx$.', 'Ich setze $x = 3$ in $f$ ein und teile durch $\\varphi_3(3)$.', 'Ich löse ein Gleichungssystem für alle $c_n$ gleichzeitig.', 'Das weiß ich noch nicht.'], a:0, ex:'Bei einer Orthonormalbasis ist jeder Koeffizient eine Projektion: $c_n = \\langle\\varphi_n|f\\rangle$. Ein Gleichungssystem braucht man nur bei nicht orthogonalen Basen.'},
    {q:'Wie beginnst du, um zu prüfen, ob $-i\\,d/dx$ auf Funktionen mit $f(0) = f(L) = 0$ hermitesch ist?', opts:['Ich schreibe $\\langle f|-ig\'\\rangle$ als Integral und integriere partiell.', 'Ich prüfe, ob $-i\\,d/dx$ reelle Funktionen auf reelle abbildet.', 'Ich setze $f = g$ und prüfe, ob das Ergebnis reell ist.', 'Das weiß ich noch nicht.'], a:0, ex:'Hermitesch heißt $\\langle f|\\hat Ag\\rangle = \\langle\\hat Af|g\\rangle$ für alle zulässigen $f, g$. Partielle Integration verschiebt die Ableitung von $g$ auf $f$; dabei entscheiden die Randterme. Der Test mit $f = g$ allein reicht nicht.'}
  ],
  phenomenon:{
    title:'Zwei Töne, eine Leistung',
    text:'Zwei Lautsprecher am selben Ort spielen reine Töne. Die Auslenkungen sind $f(t) = A\\sin(\\omega t)$ und $g(t) = B\\sin(2\\omega t + \\delta)$ mit einer beliebigen Phase $\\delta$. Die mittlere Leistung ist proportional zum Zeitmittel des Quadrats über eine Periode $T = 2\\pi/\\omega$. Einzeln ergibt das $\\overline{f^2} = A^2/2$ und $\\overline{g^2} = B^2/2$.\n\nWie groß ist das Zeitmittel $\\overline{(f + g)^2}$, wenn beide gleichzeitig spielen?',
    q:{q:'Deine Vorhersage:', opts:['genau $\\frac{A^2 + B^2}{2}$, für jede Phase $\\delta$', '$\\frac{(A + B)^2}{2}$, weil sich die Wellen verstärken', 'je nach $\\delta$ zwischen $\\frac{(A - B)^2}{2}$ und $\\frac{(A + B)^2}{2}$'], a:0,
      ex:'Das Zeitmittel des Mischterms $2fg$ ist null: $\\sin(\\omega t)$ und $\\sin(2\\omega t + \\delta)$ sind über eine Periode orthogonal.',
      fb:['Richtig. Im Quadrat steckt der Mischterm $2fg$, und dessen Zeitmittel verschwindet für jede Phase. Die Leistungen addieren sich einfach – das ist der Satz des Pythagoras für Funktionen.', 'Volle Verstärkung gäbe es nur für zwei Töne gleicher Frequenz und gleicher Phase. Bei verschiedenen Frequenzen sind die Auslenkungen mal gleich-, mal gegenphasig, und der Mischterm mittelt sich weg.', 'So verhalten sich zwei Töne *gleicher* Frequenz: Dort hängt der Mischterm von der Phase ab (Interferenz). Bei $\\omega$ und $2\\omega$ ist sein Zeitmittel für jedes $\\delta$ null.']},
    reveal:'Ausmultipliziert ist $(f + g)^2 = f^2 + g^2 + 2fg$. Das Zeitmittel des Mischterms ist\n\n$$\\frac{2AB}{T}\\int_0^T\\sin(\\omega t)\\sin(2\\omega t + \\delta)\\,dt = 0\\quad\\text{für jedes }\\delta.$$\n\nIn der Sprache dieses Themas: Das Integral ist ein Skalarprodukt $\\langle f|g\\rangle$, und es verschwindet – die beiden Funktionen sind **orthogonal**. Dann gilt $\\|f + g\\|^2 = \\|f\\|^2 + \\|g\\|^2$ wie bei senkrechten Vektoren.\n\nGenau das steckt hinter der Quantenmechanik: Ist $\\psi = c_1\\psi_1 + c_2\\psi_2$ mit orthonormalen $\\psi_1, \\psi_2$, dann ist $\\int|\\psi|^2dx = |c_1|^2 + |c_2|^2$, und die $|c_n|^2$ sind Wahrscheinlichkeiten. Bei Tönen gleicher Frequenz bleibt dagegen ein Mischterm – das ist Interferenz (M1).'
  },
  teach:[
    /* ===== Abschnitt 1: Funktion als Spalte, Summe → Integral, Orthogonalität ===== */
    {id:'mh-t1', title:'Funktionen sind Vektoren', steps:[
      {id:'mh-t1a', title:'Eine Funktion als lange Spalte',
        num:{title:'Vier Stellen', text:R`Die Funktion $f(x) = x(1 - x)$ auf $[0, 1]$, an den vier Stellen $x_i = \tfrac18, \tfrac38, \tfrac58, \tfrac78$ abgelesen:

$$f(x_i) = \tfrac{7}{64},\ \tfrac{15}{64},\ \tfrac{15}{64},\ \tfrac{7}{64}\qquad\Rightarrow\qquad f \approx \tfrac{1}{64}\begin{pmatrix}7\\ 15\\ 15\\ 7\end{pmatrix}.$$

Mit mehr Stellen wird die Spalte länger und beschreibt $f$ genauer.`},
        text:R`Ein Vektor im $\mathbb C^n$ ist eine Liste von $n$ Komponenten. Eine Funktion ist auch eine Liste: Zu jeder Stelle $x$ gehört ein Wert $f(x)$. Liest du $f$ an endlich vielen Stellen ab, bekommst du eine Spalte. Lässt du die Stellen immer dichter werden, wird die Spalte unendlich lang. Man stellt sich $f$ deshalb als Vektor mit einer Komponente für jedes $x$ vor. Der Index $i$ der Spalte wird zur Variablen $x$. Funktionen lassen sich Stelle für Stelle addieren und mit Zahlen multiplizieren, genau wie Spalten Eintrag für Eintrag. Sie bilden also einen [[lex:vektorraum|Vektorraum]] (M3).`,
        q:{q:R`Welche Spalte gehört an denselben vier Stellen zu $g(x) = 2f(x) + 1$?`, tr:{from:'ort', to:'matrix'},
          opts:[R`$\tfrac{1}{64}(15;\ 31;\ 31;\ 15)$`, R`$\tfrac{1}{64}(78;\ 94;\ 94;\ 78)$`, R`$\tfrac{1}{64}(14;\ 30;\ 30;\ 14)$`], a:1,
          ex:R`Stelle für Stelle: $2\cdot\tfrac{7}{64} + 1 = \tfrac{14 + 64}{64} = \tfrac{78}{64}$, ebenso $2\cdot\tfrac{15}{64} + 1 = \tfrac{94}{64}$.`,
          fb:[R`Die $1$ ist eine ganze Eins, also $\tfrac{64}{64}$, nicht $\tfrac{1}{64}$.`,
            '',
            R`Das ist nur $2f$. An jeder Stelle kommt noch die $1$ dazu.`]}},
      {id:'mh-t1b', title:'Aus der Summe wird ein Integral',
        pre:{from:'m-vektor', seg:'mv-t2', title:'Skalarprodukt in ℂⁿ', text:R`In $\mathbb C^n$ ist $\langle a|b\rangle = \sum_ia_i^*b_i$: links konjugieren, Eintrag für Eintrag multiplizieren, addieren. Die Norm ist $\|a\| = \sqrt{\langle a|a\rangle}$. Mini-Beispiel: $a = (1;\ i)$ hat $\langle a|a\rangle = 1 + (-i)\,i = 2$.`},
        num:{title:'Summe und Integral im Vergleich', text:R`Mit der Spalte aus dem letzten Schritt und dem Abstand $\Delta x = \tfrac14$ der Stellen:

$$\begin{aligned}&\sum_i|f(x_i)|^2\,\Delta x\\ &= \frac{49 + 225 + 225 + 49}{4096}\cdot\frac14\\ &\approx 0{,}0334,\\ &\int_0^1x^2(1 - x)^2\,dx = \frac{1}{30} \approx 0{,}0333.\end{aligned}$$`},
        text:R`Im $\mathbb C^n$ ist das Skalarprodukt eine Summe über Komponenten. Für Funktionen nimmst du an jeder Stelle $f^*(x_i)\,g(x_i)$, multiplizierst mit dem Abstand $\Delta x$ und addierst. Werden die Stellen dichter, wird daraus ein Integral. Das **[[lex:skalarprodukt|Skalarprodukt]]** zweier Funktionen auf $[a, b]$ ist

$$\langle f|g\rangle = \int_a^bf^*(x)\,g(x)\,dx,$$

gelesen „Skalarprodukt von $f$ und $g$“ wie in M3. Die **Norm** ist $\|f\| = \sqrt{\langle f|f\rangle}$ mit $\langle f|f\rangle = \int|f|^2dx$. Der Faktor $\Delta x$ bzw. $dx$ sorgt dafür, dass das Ergebnis nicht mit der Zahl der Stellen wächst.`,
        reps:{obj:R`Die Funktion $f(x) = x(1 - x)$ auf $[0, 1]$ als Vektor`,
          rows:[
            {k:'worte', text:R`Ein Vektor mit einer Komponente für jede Stelle $x$; die Komponente ist der Funktionswert.`},
            {k:'ort', tex:R`\begin{gathered}f(x) = x(1 - x),\\ \|f\|^2 = \int_0^1|f(x)|^2\,dx = \tfrac{1}{30}\end{gathered}`},
            {k:'matrix', tex:R`\begin{gathered}f \approx \tfrac{1}{64}\begin{pmatrix}7\\ 15\\ 15\\ 7\end{pmatrix},\\ \|f\|^2 \approx \sum_i|f(x_i)|^2\,\Delta x \approx 0{,}0334\end{gathered}`},
            {k:'graph', plot:{x:[0, 1], y:[0, 0.3], xlab:'x', ylab:'f'}, f:x => x * (1 - x), lab:'f(x)', f2:x => { const m = (Math.min(Math.floor(x * 4), 3) + 0.5) / 4; return m * (1 - m); }, lab2:R`\text{Treppe aus } f(x_i)`,
              cap:R`Die Treppe benutzt in jedem Viertel nur den Wert in der Mitte. Ihre Fläche $\sum_if(x_i)\,\Delta x = \tfrac{44}{256} \approx 0{,}172$ nähert die Fläche $\int_0^1f\,dx = \tfrac16 \approx 0{,}167$ unter der Kurve – das Skalarprodukt $\langle 1|f\rangle$.`}
          ],
          links:[
            {from:'worte', to:'ort', rule:R`Schreib die Vorschrift hin, die jeder Stelle $x$ ihre Komponente zuordnet.`},
            {from:'ort', to:'matrix', rule:R`Wähle Stellen $x_i$ im Abstand $\Delta x$ und schreib die Werte $f(x_i)$ untereinander. Aus $\int\dots dx$ wird $\sum_i\dots\Delta x$.`},
            {from:'matrix', to:'graph', rule:R`Trage jeden Eintrag als Stufe der Breite $\Delta x$ über seiner Stelle auf. Mehr Stellen machen die Treppe feiner, bis sie in die Kurve übergeht.`}
          ]},
        q:{q:R`Zwei Funktionen auf $[0, 1]$ werden an $1000$ Stellen im Abstand $\Delta x = 0{,}001$ abgelesen, als Spalten $(f_i)$ und $(g_i)$. Welcher Ausdruck nähert $\langle f|g\rangle$?`, tr:{from:'matrix', to:'ort'},
          opts:[R`$\sum_if_i^*g_i$`, R`$\sum_if_ig_i\cdot0{,}001$`, R`$\sum_if_i^*g_i\cdot0{,}001$`], a:2,
          ex:R`Die Summe über die Stellen ersetzt das Integral, $\Delta x = 0{,}001$ ersetzt $dx$, und die linke Funktion wird konjugiert.`,
          fb:[R`Ohne den Faktor $\Delta x$ wächst die Summe mit der Zahl der Stellen, hier etwa auf das Tausendfache.`,
            R`Ohne Konjugation stimmt das nur für reelle Funktionen. Im Skalarprodukt steht $f^*$.`,
            '']}},
      {id:'mh-t1c', title:'Rechenregeln, und warum konjugiert wird',
        num:{title:R`$e^{2\pi ix}$ auf $[0, 1]$`, text:R`Ohne Konjugation: $\int_0^1(e^{2\pi ix})^2dx = \int_0^1e^{4\pi ix}dx = 0$, obwohl $|e^{2\pi ix}| = 1$ überall. Mit Konjugation: $\int_0^1|e^{2\pi ix}|^2dx = \int_0^11\,dx = 1$.`},
        text:R`Es gelten dieselben Regeln wie in M3. Vertauschen konjugiert: $\langle f|g\rangle^* = \langle g|f\rangle$. Im zweiten Argument ist das Skalarprodukt linear: $\langle f|\alpha g + \beta h\rangle = \alpha\langle f|g\rangle + \beta\langle f|h\rangle$. Im ersten ist es antilinear: $\langle\alpha f|g\rangle = \alpha^*\langle f|g\rangle$. Und $\langle f|f\rangle \ge 0$, mit $0$ nur für $f = 0$. Die Konjugation braucht man wie in M3: Ohne sie hätte eine komplexe Funktion, die nirgends verschwindet, die „Länge“ null. Die Herleitung rechnet die Regeln an $f(x) = x + i$ und $g(x) = 1$ auf $[0, 1]$ nach.`,
        derive:{ctx:{coords:['x'], domain:{x:['0', '1']}, params:{}, defs:{'f(x)':'x + i', 'g(x)':'1'}}, lines:[
          {l:'⟨f|g⟩ = ∫_0^1 (x - i) · 1 dx', w:'f* = x − i', why:{q:'Warum steht im Integral $x - i$ statt $x + i$?', opts:['Das erste Argument wird konjugiert: $f^* = x - i$.', 'Das zweite Argument wird konjugiert, also $g$.', 'Weil $g = 1$ reell ist, dreht sich das Vorzeichen.'], a:0, ex:'$\\langle f|g\\rangle = \\int f^*g\\,dx$. Die Konvention dieses Tutorials: antilinear im ersten Argument.'}},
          {l:'= 1/2 - i', w:'integriert: ∫x dx = 1/2 und ∫i dx = i'},
          {l:'⟨g|f⟩ = ∫_0^1 1 · (x + i) dx', w:'Reihenfolge vertauscht: jetzt steht g im Bra'},
          {l:'= 1/2 + i', w:'integriert', why:{q:'Was zeigt der Vergleich der beiden Ergebnisse?', opts:['$\\langle g|f\\rangle = \\langle f|g\\rangle^*$: Vertauschen konjugiert.', 'Das Skalarprodukt ist symmetrisch in $f$ und $g$.', 'Eines der beiden Ergebnisse muss falsch sein.'], a:0, ex:'Für komplexe Funktionen ist das Skalarprodukt nicht symmetrisch, sondern konjugiert-symmetrisch.'}},
          {l:'⟨f|f⟩ = ∫_0^1 (x^2 + 1) dx', w:'|x + i|² = (x − i)(x + i) = x² + 1', why:{q:R`Warum steht $x^2 + 1$ im Integral?`, opts:[R`$(x - i)(x + i) = x^2 - i^2 = x^2 + 1$`, R`$(x + i)^2 = x^2 + 1$, weil $i^2 = 1$`, R`$(x + i)^2 = x^2 + 2ix - 1$, davon der Realteil`], a:0, ex:R`$|f|^2 = f^*f$ mit konjugiertem erstem Faktor. Ohne Konjugation stünde $x^2 + 2ix - 1$ im Integral, und die „Norm“ wäre komplex.`}},
          {l:'= 4/3', w:'reell und positiv, wie jede Norm im Quadrat'}
        ]},
        q:{q:R`Es ist $\langle f|g\rangle = 2 - 3i$. Was ist $\langle 2if|g\rangle$?`,
          opts:[R`$2i(2 - 3i) = 6 + 4i$`, R`$-2i(2 - 3i) = -6 - 4i$`, R`$2 - 3i$, weil Vorfaktoren sich kürzen`], a:1,
          ex:R`Antilinear im ersten Argument: $\langle\alpha f|g\rangle = \alpha^*\langle f|g\rangle$ mit $\alpha^* = -2i$. Ausmultipliziert: $-4i + 6i^2 = -6 - 4i$.`,
          fb:[R`Der Faktor steht im ersten Argument und wird deshalb konjugiert: $(2i)^* = -2i$.`,
            '',
            R`Vorfaktoren kürzen sich nicht; sie kommen aus dem Skalarprodukt heraus, im ersten Argument konjugiert.`]}},
      {id:'mh-t1d', title:'Orthogonale Funktionen',
        num:{title:R`$\sin(\pi x)$ und $\sin(2\pi x)$`, text:R`Auf $[0, 1]$ ist das Produkt $\sin(\pi x)\sin(2\pi x)$ links von $x = \tfrac12$ positiv und rechts davon spiegelbildlich negativ. Die Flächen heben sich auf:

$$\int_0^1\sin(\pi x)\,\sin(2\pi x)\,dx = 0.$$`},
        text:R`Zwei Funktionen heißen **orthogonal**, wenn $\langle f|g\rangle = 0$. Das hat nichts mit „senkrecht im Raum“ zu tun. Es heißt: Die Fläche unter $f^*g$ ist null; positive und negative Teile heben sich genau auf. Für orthogonale Funktionen gilt der Satz des Pythagoras

$$\|f + g\|^2 = \|f\|^2 + \|g\|^2,$$

denn beim Ausmultiplizieren fallen die Mischterme $\langle f|g\rangle + \langle g|f\rangle$ weg. Das löst die Frage nach den beiden Lautsprechern. $\sin\omega t$ und $\sin(2\omega t + \delta)$ sind über eine Periode orthogonal, also addieren sich die Leistungen.`,
        plot:{plot:{x:[0, 1], y:[-0.85, 0.85], xlab:'x', ylab:R`\text{Produkt}`}, f:x => Math.sin(Math.PI * x) * Math.sin(2 * Math.PI * x), lab:R`\sin(\pi x)\sin(2\pi x)`,
          cap:R`Die Fläche über der Achse links ist so groß wie die Fläche unter der Achse rechts.`},
        q:{q:R`Der Graph von $f(x)\,g(x)$ (beide reell) auf $[0, 1]$ hat über der Achse die Fläche $0{,}3$ und unter der Achse ebenfalls $0{,}3$. Was folgt?`, tr:{from:'graph', to:'formel'},
          opts:[R`$\langle f|g\rangle = 0{,}6$`, R`$\|f + g\|^2 = \|f\|^2 + \|g\|^2$`, R`$f$ und $g$ haben keine gemeinsame Nullstelle.`], a:1,
          ex:R`Die Flächen zählen mit Vorzeichen: $0{,}3 - 0{,}3 = 0$. Also sind $f$ und $g$ orthogonal, und Pythagoras gilt.`,
          fb:[R`Unter der Achse zählt die Fläche negativ. Das Integral ist $0{,}3 - 0{,}3 = 0$.`,
            '',
            R`Über Nullstellen sagt die Fläche nichts. Sie sagt, dass $\langle f|g\rangle = 0$ ist.`]}},
      {id:'mh-t1e', title:'Typischer Fehler: orthogonal heißt nicht „an verschiedenen Orten“',
        num:{title:'Zwei Fälle', text:R`Zwei Stufen ohne Überlapp, $f = 1$ auf $[0, \tfrac12]$ und $g = 1$ auf $[\tfrac12, 1]$ (sonst je $0$), sind orthogonal, weil $fg = 0$ überall. Aber auch $\sin(\pi x)$ und $\sin(2\pi x)$ sind auf $[0, 1]$ orthogonal, obwohl beide fast überall von null verschieden sind.`},
        text:R`Eine verbreitete Fehlvorstellung lautet: „Orthogonale Funktionen sind dort groß, wo die andere klein ist.“ Getrennte Stufen sind zwar orthogonal, aber das ist nur ein Sonderfall. Meist überlappen orthogonale Funktionen stark. Entscheidend ist allein, ob sich die Teilflächen unter $f^*g$ aufheben. Das hängt auch am Intervall. Auf $[0, \tfrac34]$ sind $\sin(\pi x)$ und $\sin(2\pi x)$ nicht mehr orthogonal, denn dort fehlt ein Teil der negativen Fläche: Das Integral ist $\tfrac{\sqrt2}{6\pi} \approx 0{,}075$. Prüfe Orthogonalität deshalb immer mit dem Integral, nicht mit dem Augenmaß.`,
        q:{q:R`Welche Aussage über $\sin(\pi x)$ und $\sin(3\pi x)$ auf $[0, 1]$ stimmt?`,
          opts:['Sie sind nicht orthogonal, weil beide in der Mitte groß sind.', 'Sie sind orthogonal, weil das Integral ihres Produkts null ist.', 'Sie sind orthogonal, weil sie verschiedene Nullstellen haben.'], a:1,
          ex:R`$\int_0^1\sin(\pi x)\sin(3\pi x)\,dx = 0$: Die Teilflächen heben sich auf, obwohl beide Funktionen fast überall von null verschieden sind.`,
          fb:[R`Groß an derselben Stelle verhindert Orthogonalität nicht. Es kommt auf die Summe der Teilflächen mit Vorzeichen an.`,
            '',
            R`Nullstellen sind nicht der Grund; die beiden teilen sogar die Nullstellen $0$ und $1$. Der Grund ist, dass sich die Teilflächen aufheben.`]}}
    ]},
    /* ===== Abschnitt 2: L², Cauchy-Schwarz, Hilbertraum ===== */
    {id:'mh-t2', title:'Welche Funktionen zugelassen sind: der Raum $L^2$', steps:[
      {id:'mh-t2a', title:'Quadratintegrabel: endliche Norm',
        num:{title:R`$e^{-|x|}$ und die Konstante`, text:R`$\int_{-\infty}^\infty e^{-2|x|}dx = 2\int_0^\infty e^{-2x}dx = 1$: endlich. Für die Konstante $1$ wächst $\int_{-R}^R1\,dx = 2R$ mit $R$ über alle Grenzen. Sie hat auf $\mathbb R$ keine endliche Norm.`},
        text:R`Nicht jede Funktion hat eine endliche Norm. Man lässt deshalb nur die **[[lex:quadratintegrabel|quadratintegrablen]]** Funktionen zu, also die mit

$$\|f\|^2 = \int|f(x)|^2\,dx < \infty.$$

Ihr Raum heißt $L^2$, gelesen „L zwei“. Auf $\mathbb R$ gehören $e^{-|x|}$, $e^{-x^2}$ und $1/(1 + x^2)$ dazu. Die Konstante $1$ und $e^{ikx}$ gehören nicht dazu, denn $|e^{ikx}|^2 = 1$. Auf einem endlichen Intervall wie $[0, 1]$ ist dagegen jede beschränkte Funktion quadratintegrabel. **Ausblick (Thema 1):** Wellenfunktionen müssen sich normieren lassen; deshalb ist $L^2$ ihr Raum.`,
        derive:{ctx:{coords:['x'], params:{}}, lines:[
          {l:'∫_-∞^∞ |e^(-|x|)|^2 dx = 2 ∫_0^∞ e^(-2x) dx', w:'gerade Funktion: doppelte rechte Hälfte', why:{q:'Warum darf man die linke Hälfte durch die rechte ersetzen?', opts:['Weil $|e^{-|x|}|^2 = e^{-2|x|}$ eine gerade Funktion ist.', 'Weil $e^{-|x|}$ für $x < 0$ verschwindet.', 'Weil man Integrale über $\\mathbb R$ immer so schreiben darf.'], a:0, ex:'Für gerade Integranden gilt $\\int_{-\\infty}^\\infty = 2\\int_0^\\infty$. Für ungerade wäre das Integral null, für andere gilt gar keine solche Regel.'}},
          {l:'= 1', w:'$\\big[-\\tfrac12e^{-2x}\\big]_0^\\infty = \\tfrac12$, mal $2$', why:{q:'Was folgt aus dem Ergebnis?', opts:['$e^{-|x|}$ ist schon normiert.', '$e^{-|x|}$ ist nicht quadratintegrabel.', '$e^{-|x|}$ muss mit $\\frac12$ multipliziert werden.'], a:0, ex:'$\\|e^{-|x|}\\|^2 = 1$: Die Funktion liegt in $L^2$ und hat die Norm $1$. **Ausblick (Thema 5):** Sie ist die Wellenfunktion des gebundenen Zustands im δ-Potential.'}}
        ]},
        q:{q:R`Welche Funktion liegt in $L^2(\mathbb R)$?`,
          opts:['$\\cos x$', '$e^{ix}e^{-|x|}$', '$e^{ix} + e^{-|x|}$'], a:1,
          ex:'$|e^{ix}e^{-|x|}|^2 = |e^{ix}|^2e^{-2|x|} = e^{-2|x|}$, und $\\int e^{-2|x|}dx = 1$ ist endlich (Beispiel oben).',
          fb:['$\\cos^2x$ schwankt immer zwischen $0$ und $1$; das Integral über $\\mathbb R$ wächst ohne Grenze.', '', 'Für große $|x|$ bleibt $e^{ix}$ übrig, mit $|e^{ix}|^2 = 1$; das Integral divergiert. Beim Produkt dagegen sorgt $e^{-|x|}$ für den Abfall.']}},
      {id:'mh-t2b', title:'Es zählt |f|², nicht |f|',
        num:{title:R`$1/x$ auf $[1, \infty)$`, text:R`$\int_1^R\tfrac{dx}{x} = \ln R$ wächst ohne Grenze. Aber $\int_1^R\tfrac{dx}{x^2} = 1 - \tfrac1R \to 1$. Also ist $1/x$ quadratintegrabel, obwohl ihr Integral divergiert.`},
        text:R`Zwei Fehlschlüsse sind verbreitet. Erstens: Es kommt auf $\int|f|^2dx$ an, nicht auf $\int|f|\,dx$. Das Quadrat macht kleine Werte noch kleiner; deshalb reicht schon ein langsamer Abfall wie $1/x$. Zweitens: Quadratintegrable Funktionen müssen nicht beschränkt sein. $f(x) = |x|^{-1/4}$ auf $[-1, 1]$ wird bei $x = 0$ unendlich groß, und trotzdem ist $\int_{-1}^1|x|^{-1/2}dx = 4$. Entscheidend ist, wie schnell $|f|^2$ wächst oder abfällt. Faustregel: $|x|^{-p}$ ist nahe $0$ integrierbar für $p < 1$, im Unendlichen für $p > 1$.`,
        derive:{ctx:{coords:['x'], params:{}}, lines:[
          {l:'∫_1^∞ 1/x^2 dx = 1', w:'1/x ist auf [1, ∞) quadratintegrabel', why:{q:'$\\int_1^\\infty\\frac{dx}{x}$ divergiert. Warum liegt $1/x$ trotzdem in $L^2$?', opts:['Weil für die Norm $\\int|f|^2dx = \\int x^{-2}dx$ zählt, und das ist endlich.', 'Weil $1/x$ gegen null geht; das genügt für $L^2$ immer.', 'Weil man $1/x$ auf $[1, \\infty)$ beliebig umnormieren darf.'], a:0, ex:'Gegen null gehen reicht nicht: $1/\\sqrt x$ geht auch gegen null, aber $\\int_1^\\infty x^{-1}dx$ divergiert.'}}
        ]},
        q:{q:R`Welche Funktion ist auf $[0, 1]$ quadratintegrabel?`,
          opts:[R`$x^{-1/2}$`, R`$x^{-1}$`, R`$x^{-1/4}$`], a:2,
          ex:R`$|x^{-1/4}|^2 = x^{-1/2}$, und $\int_0^1x^{-1/2}dx = 2$. Das Quadrat hat den Exponenten $p = \tfrac12 < 1$.`,
          fb:[R`$|x^{-1/2}|^2 = x^{-1}$, und $\int_0^1x^{-1}dx$ divergiert logarithmisch. Prüfe das Quadrat, nicht die Funktion.`,
            R`$|x^{-1}|^2 = x^{-2}$ ist nahe $0$ erst recht nicht integrierbar.`,
            '']}},
      {id:'mh-t2c', title:'Cauchy-Schwarz: Skalarprodukte bleiben endlich',
        pre:{from:'m-vektor', seg:'mv-t5', title:'Cauchy-Schwarz in ℂⁿ', text:R`$|\langle a|b\rangle|^2 \le \langle a|a\rangle\,\langle b|b\rangle$, mit Gleichheit genau dann, wenn $a$ und $b$ linear abhängig sind. Mini-Beispiel: $a = (1;\ 0)$ und $b = (1;\ 1)$ geben $1 \le 1\cdot2$.`},
        num:{title:R`$f = 1$ und $g = x$ auf $[0, 1]$`, text:R`$\langle f|g\rangle = \int_0^1x\,dx = \tfrac12$, $\|f\| = 1$ und $\|g\| = \sqrt{\int_0^1x^2dx} = \tfrac{1}{\sqrt3} \approx 0{,}577$. Tatsächlich ist $\tfrac12 \le 1\cdot0{,}577$.`},
        text:R`Ist das Integral $\int f^*g\,dx$ überhaupt endlich, wenn beide Funktionen in $L^2$ liegen? Ja, und zwar wegen der [[lex:cauchy-schwarz|Cauchy-Schwarz-Ungleichung]] aus M3. Sie gilt wörtlich auch für Funktionen:

$$|\langle f|g\rangle| \le \|f\|\,\|g\|.$$

Sind beide Normen endlich, ist es auch das Skalarprodukt. Gleichheit gilt nur, wenn $g$ ein Vielfaches von $f$ ist. Im Beispiel sind $1$ und $x$ keine Vielfachen voneinander, deshalb ist die Ungleichung echt. Das Verhältnis $|\langle f|g\rangle|/(\|f\|\,\|g\|) \approx 0{,}87$ misst, wie ähnlich sich die beiden Funktionen sind.`,
        q:{q:R`Es ist $\|f\| = 2$ und $\|g\| = 3$. Welcher Wert ist für $|\langle f|g\rangle|$ unmöglich?`,
          opts:[R`$0$`, R`$6$`, R`$7$`], a:2,
          ex:R`Cauchy-Schwarz: $|\langle f|g\rangle| \le 2\cdot3 = 6$. Der Wert $7$ liegt darüber.`,
          fb:[R`$0$ ist möglich: Dann sind $f$ und $g$ orthogonal.`,
            R`$6$ ist möglich, wenn $g$ ein Vielfaches von $f$ ist, etwa $g = \tfrac32f$.`,
            '']}},
      {id:'mh-t2d', title:'Punkte zählen nicht',
        num:{title:'Ein einzelner Ausreißer', text:R`$f = 1$ auf $[0, 1]$, und $g$ sei gleich $f$, nur $g(\tfrac12) = 5$. Dann ist $f - g$ überall null außer in einem Punkt, und

$$\|f - g\|^2 = \int_0^1|f - g|^2\,dx = 0.$$`},
        text:R`Ändert man eine Funktion an einem einzelnen Punkt, ändert sich kein Integral. Dann ist $\|f - g\| = 0$, obwohl $f$ und $g$ an dieser Stelle verschieden sind. In $L^2$ gelten solche Funktionen deshalb als gleich. Genau genommen sind die Elemente von $L^2$ Klassen von Funktionen, die sich nur auf vernachlässigbar kleinen Mengen unterscheiden. Für Rechnungen heißt das: Den Wert an einer Sprungstelle musst du nicht festlegen. **Ausblick (Thema 1):** Physikalisch ist das sinnvoll. Wahrscheinlichkeiten sind Integrale über $|\psi|^2$, und ein einzelner Punkt hat die Breite null.`,
        q:{q:R`$f$ und $g$ unterscheiden sich nur im Punkt $x = 0$. Was gilt in $L^2$?`,
          opts:[R`$\|f - g\| = |f(0) - g(0)|$`, R`$\|f - g\| = 0$; sie gelten als gleich.`, R`$\langle f|g\rangle$ ist dann nicht definiert.`], a:1,
          ex:R`Ein einzelner Punkt trägt zu keinem Integral bei, also ist $\int|f - g|^2dx = 0$.`,
          fb:[R`Die Norm ist ein Integral, kein Funktionswert. Ein Punkt hat die Breite null.`,
            '',
            R`Das Skalarprodukt ist definiert und hat denselben Wert wie $\langle f|f\rangle$.`]}},
      {id:'mh-t2e', title:'Was „Hilbertraum“ bedeutet',
        num:{title:'Eine unendliche Reihe', text:R`Nimm Funktionen $\varphi_n$, die paarweise orthogonal sind und die Norm $1$ haben (Abschnitt 3). Die Reihe $\sum_{n=1}^\infty\tfrac1n\varphi_n$ hat dann das Normquadrat $\sum_n\tfrac{1}{n^2} = \tfrac{\pi^2}{6} \approx 1{,}64$. Ab $N = 100$ tragen alle weiteren Terme zusammen weniger als $0{,}01$ dazu bei.`},
        text:R`Ein **[[lex:hilbertraum|Hilbertraum]]** ist ein Vektorraum mit Skalarprodukt, der *vollständig* ist. Das heißt: Jede Folge, deren Glieder einander beliebig nahe kommen, hat einen Grenzwert im Raum. Man nennt solche Folgen Cauchy-Folgen. $L^2$ hat diese Eigenschaft. Für die Praxis heißt das: Eine unendliche Reihe $\sum_nc_n\varphi_n$ mit $\sum_n|c_n|^2 < \infty$ landet wieder in $L^2$, wie die Reihe im Beispiel. Vorsicht beim Wort: Diese Vollständigkeit des *Raumes* ist etwas anderes als die Vollständigkeit einer *Basis aus Funktionen*, um die es in Abschnitt 4 geht. Beide heißen leider gleich.`,
        q:{q:R`Die $\varphi_n$ seien paarweise orthogonal mit Norm $1$. Welche Reihe hat sicher keinen Grenzwert in $L^2$?`,
          opts:[R`$\sum_n\tfrac1n\varphi_n$`, R`$\sum_n\tfrac{1}{\sqrt n}\varphi_n$`, R`$\sum_n2^{-n}\varphi_n$`], a:1,
          ex:R`Das Normquadrat wäre $\sum_n\tfrac1n$, und diese Reihe divergiert.`,
          fb:[R`$\sum_n\tfrac{1}{n^2} = \tfrac{\pi^2}{6}$ ist endlich; diese Reihe konvergiert in $L^2$.`,
            '',
            R`$\sum_n4^{-n} = \tfrac13$ ist endlich; diese Reihe konvergiert sogar sehr schnell.`]}}
    ]},
    /* ===== Abschnitt 3: Orthonormalsysteme, Koeffizienten als Spalte ===== */
    {id:'mh-t3', title:'Orthonormalsysteme und Komponenten', steps:[
      {id:'mh-t3a', title:'Orthonormalsysteme',
        num:{title:R`Die Sinusfunktionen auf $[0, 1]$`, text:R`$\varphi_n(x) = \sqrt2\sin(n\pi x)$. Normierung: $\int_0^12\sin^2(\pi x)\,dx = 2\cdot\tfrac12 = 1$. Orthogonalität: $\int_0^12\sin(\pi x)\sin(2\pi x)\,dx = 0$, wie in Abschnitt 1.`},
        text:R`Ein **Orthonormalsystem** ist eine Folge $\varphi_1, \varphi_2, \dots$ von Funktionen mit

$$\langle\varphi_n|\varphi_m\rangle = \delta_{nm},$$

gelesen „delta n m“: $1$ für $n = m$, sonst $0$. Jede hat die Norm $1$, und je zwei sind orthogonal. Zwei Beispiele kehren immer wieder. Auf $[0, L]$ sind es $\varphi_n(x) = \sqrt{2/L}\,\sin(n\pi x/L)$; der Faktor $\sqrt{2/L}$ macht die Norm zu $1$. Auf einem Ring $[0, 2\pi]$ mit periodischen Funktionen sind es $e^{inx}/\sqrt{2\pi}$ mit ganzem $n$, die Grundlage der Fourier-Reihe (M6). **Ausblick (Thema 3):** Die Sinusfunktionen beschreiben ein Teilchen in einem Kasten.`,
        q:{q:R`Welcher Vorfaktor $N$ normiert $N\sin(3\pi x/L)$ auf $[0, L]$?`,
          opts:[R`$\sqrt{2/(3L)}$`, R`$\sqrt{2/L}$`, R`$2/L$`], a:1,
          ex:R`$\int_0^L\sin^2(3\pi x/L)\,dx = \tfrac L2$ für jedes ganze $n \ne 0$, also $N^2\cdot\tfrac L2 = 1$.`,
          fb:[R`Das $n$ steckt nicht im Vorfaktor: Der Mittelwert von $\sin^2$ ist für jedes $n$ gleich $\tfrac12$.`,
            '',
            R`Normiert wird mit der Wurzel: $N^2 = \tfrac2L$, also $N = \sqrt{2/L}$.`]}},
      {id:'mh-t3b', title:'Komponenten sind Projektionen',
        pre:{from:'m-vektor', seg:'mv-t3', title:'Komponenten in einer Orthonormalbasis', text:R`Für eine Orthonormalbasis $e_i$ und $v = \sum_jc_je_j$ ist $c_i = \langle e_i|v\rangle$: ein Skalarprodukt je Komponente, kein Gleichungssystem. Reihenfolge beachten: $\langle v|e_i\rangle = c_i^*$. Mini-Beispiel: $v = (3;\ 4)$ hat $\langle e_2|v\rangle = 4$.`},
        num:{title:R`$c_1$ für $f = 1$`, text:R`Mit $L = 1$: $c_1 = \langle\varphi_1|f\rangle = \sqrt2\int_0^1\sin(\pi x)\,dx = \sqrt2\cdot\tfrac{2}{\pi} = \tfrac{2\sqrt2}{\pi} \approx 0{,}900$.`},
        text:R`Angenommen, $f = \sum_mc_m\varphi_m$. Bilde das Skalarprodukt mit $\varphi_n$. Im zweiten Argument ist es linear, also

$$\langle\varphi_n|f\rangle = \sum_mc_m\langle\varphi_n|\varphi_m\rangle = \sum_mc_m\delta_{nm} = c_n.$$

Jeder Koeffizient ist ein eigenes Integral: $c_n = \langle\varphi_n|f\rangle = \int\varphi_n^*f\,dx$. Das ist genau die Regel $c_i = \langle e_i|v\rangle$ aus M3, mit dem Integral an Stelle der Summe. Du brauchst kein Gleichungssystem. Die Herleitung rechnet $c_1$ für $f = 1$ auf $[0, L]$ aus.`,
        derive:{ctx:SIN({defs:{'f(x)':'1'}}), lines:[
          {l:'⟨φ_1|f⟩ = sqrt(2/L) ∫_0^L sin(πx/L) dx', w:'c₁ für f = 1; φ₁ ist reell'},
          {l:'= 2 sqrt(2L)/π', w:'∫_0^L sin(πx/L) dx = [−L cos(πx/L)/π]_0^L = 2L/π', why:{q:R`Was ergibt $\int_0^L\sin(\pi x/L)\,dx$?`, opts:[R`$\tfrac{2L}{\pi}$`, R`$0$, weil der Sinus symmetrisch ist`, R`$\tfrac{L}{\pi}$`], a:0, ex:R`$\big[-\tfrac{L}{\pi}\cos(\pi x/L)\big]_0^L = \tfrac{L}{\pi}(1 + 1)$. Auf $[0, L]$ ist $\sin(\pi x/L) \ge 0$; die Fläche kann nicht null sein.`}}
        ]},
        q:{q:R`$f = 3\varphi_1 - 2i\varphi_2$ mit orthonormalen $\varphi_n$. Was ist $\langle\varphi_2|f\rangle$?`,
          opts:[R`$2i$`, R`$-2$`, R`$-2i$`], a:2,
          ex:R`$\langle\varphi_2|f\rangle = 3\langle\varphi_2|\varphi_1\rangle - 2i\langle\varphi_2|\varphi_2\rangle = -2i$.`,
          fb:[R`Konjugiert wird nur, was im *ersten* Argument steht. Der Koeffizient $-2i$ steht im zweiten.`,
            R`Das $i$ bleibt erhalten; es gehört zum Koeffizienten.`,
            '']}},
      {id:'mh-t3c', title:'Die Koeffizienten als Spalte',
        num:{title:'Die Parabel in der Sinusbasis', text:R`Für $f(x) = x(1 - x)$ auf $[0, 1]$ ergibt sich $c_n = \tfrac{4\sqrt2}{(n\pi)^3}$ für ungerades $n$ und $c_n = 0$ für gerades $n$:

$$\begin{aligned}c_1 &\approx 0{,}1824, & c_2 &= 0,\\ c_3 &\approx 0{,}0068, & c_4 &= 0,\\ c_5 &\approx 0{,}0015.\end{aligned}$$

Schon $c_1$ trägt fast alles: $|c_1|^2 \approx 0{,}03329$ von $\|f\|^2 = \tfrac{1}{30} \approx 0{,}03333$.`},
        text:R`Ist die Basis fest, steckt die ganze Funktion in der Folge ihrer Koeffizienten. Du kannst $f$ also auch als Spalte $(c_1;\ c_2;\ c_3;\ \dots)$ schreiben. Das ist eine zweite Spalte für dieselbe Funktion, neben der Spalte der Funktionswerte aus Abschnitt 1. Ihr Vorteil: Sie ist oft schon nach wenigen Einträgen genau genug. Die Tafel zeigt den Weg von der Funktion über die Koeffizienten zurück zum Bild. Im Labor stellst du dieselbe Funktion ein. Die Balken sind die $|c_n|^2$, die blaue Kurve ist die Teilsumme, die grün gestrichelte Kurve die Funktion selbst.`,
        reps:{obj:R`Die Parabel $f(x) = x(1 - x)$ in der Sinusbasis`,
          rows:[
            {k:'ort', tex:R`\begin{gathered}f(x) = x(1 - x) = \sum_{n=1}^\infty c_n\,\varphi_n(x),\\ \varphi_n(x) = \sqrt2\sin(n\pi x)\end{gathered}`},
            {k:'formel', tex:R`\begin{aligned}c_n = \langle\varphi_n|f\rangle &= \int_0^1\sqrt2\sin(n\pi x)\,x(1 - x)\,dx\\ &= \frac{2\sqrt2\,\big(1 - (-1)^n\big)}{(n\pi)^3}\end{aligned}`},
            {k:'matrix', tex:R`f \;\doteq\; \begin{pmatrix}c_1\\ c_2\\ c_3\\ \vdots\end{pmatrix} \approx \begin{pmatrix}0{,}1824\\ 0\\ 0{,}0068\\ \vdots\end{pmatrix}`},
            {k:'graph', plot:{x:[0, 1], y:[-0.02, 0.3], xlab:'x', ylab:'f'}, f:x => x * (1 - x), lab:'f', f2:x => 8 / Math.PI ** 3 * Math.sin(Math.PI * x), lab2:R`S_1 = c_1\varphi_1`,
              cap:R`Schon der erste Term $c_1\varphi_1 = \tfrac{8}{\pi^3}\sin(\pi x)$ liegt fast auf der Parabel.`},
            {k:'labor', text:R`„Funktion f“ auf „Parabel x(L − x)“ und „Zahl der Terme N“ auf $1$: Die Anzeige meldet $99{,}86\,\%$ von $\int_0^L|f|^2dx$.`}
          ],
          links:[
            {from:'ort', to:'formel', rule:R`Für jede Basisfunktion ein Integral: $\varphi_n^*$ mal $f$, über das ganze Intervall.`},
            {from:'formel', to:'matrix', rule:R`Setze $n = 1, 2, 3, \dots$ ein und schreib die Zahlen untereinander. Die Reihenfolge folgt der Basis.`},
            {from:'matrix', to:'graph', rule:R`Nimm die ersten $N$ Einträge, multipliziere jeden mit seiner Basisfunktion und addiere: Das ist die Teilsumme $S_N$. Zeichne sie über $f$.`},
            {from:'graph', to:'labor', rule:R`Stell im Labor dieselbe Funktion und dasselbe $N$ ein. Blaue Kurve: $S_N$; grün gestrichelt: $f$; Balken: $|c_n|^2$.`}
          ]},
        q:{q:R`In der Basis $\varphi_n = \sqrt2\sin(n\pi x)$ hat eine Funktion die Koeffizientenspalte $(\tfrac{1}{\sqrt2};\ \tfrac{1}{\sqrt2};\ 0;\ 0;\ \dots)$. Welche Funktion ist es?`, tr:{from:'matrix', to:'ort'},
          opts:[R`$\tfrac{1}{\sqrt2}\big(\sin(\pi x) + \sin(2\pi x)\big)$`, R`$\sin(\pi x) + \sin(2\pi x)$`, R`$\tfrac{1}{\sqrt2} + \tfrac{1}{\sqrt2}\,x$`], a:1,
          ex:R`Jeder Koeffizient mal seine Basisfunktion: $\tfrac{1}{\sqrt2}\cdot\sqrt2\sin(\pi x) + \tfrac{1}{\sqrt2}\cdot\sqrt2\sin(2\pi x)$.`,
          fb:[R`Der Faktor $\sqrt2$ steckt in den Basisfunktionen und hebt sich gegen $\tfrac{1}{\sqrt2}$ weg.`,
            '',
            R`Die Einträge sind Koeffizienten der Sinusfunktionen, nicht eines Polynoms.`]}},
      {id:'mh-t3d', title:'Nicht normierte Basis: durch die Norm im Quadrat teilen',
        num:{title:R`$\chi_n = \sin(n\pi x)$ ohne Vorfaktor`, text:R`Auf $[0, 1]$ ist $\langle\chi_1|\chi_1\rangle = \int_0^1\sin^2(\pi x)\,dx = \tfrac12$. Für $f = 1$ ist $\langle\chi_1|f\rangle = \tfrac2\pi$, also $b_1 = \tfrac{2/\pi}{1/2} = \tfrac4\pi$. Probe: $b_1\chi_1 = \tfrac4\pi\sin(\pi x) = c_1\varphi_1$ wie zuvor.`},
        text:R`Oft benutzt man Basisfunktionen ohne Normierungsfaktor, etwa $\chi_n = \sin(n\pi x/L)$. Sie sind orthogonal, aber nicht normiert. Dann muss man durch die Norm im Quadrat teilen:

$$b_n = \frac{\langle\chi_n|f\rangle}{\langle\chi_n|\chi_n\rangle}.$$

Das folgt wie zuvor: $\langle\chi_n|f\rangle = \sum_mb_m\langle\chi_n|\chi_m\rangle = b_n\langle\chi_n|\chi_n\rangle$. Im Nenner steht die Norm im Quadrat, weil $\chi_n$ zweimal vorkommt: einmal im Skalarprodukt, einmal in der Entwicklung. Daher kommen die Vorfaktoren $\tfrac1\pi$ und $\tfrac{1}{2\pi}$ der Fourier-Reihe in M6.`,
        q:{q:R`Die Basis $\chi_n(x) = \sin(n\pi x/L)$ ist orthogonal, aber nicht normiert. Welche Formel liefert die Koeffizienten von $f = \sum_nb_n\chi_n$?`,
          opts:[R`$b_n = \int_0^L\sin(n\pi x/L)\,f\,dx$`, R`$b_n = \tfrac2L\int_0^L\sin(n\pi x/L)\,f\,dx$`, R`$b_n = \sqrt{\tfrac2L}\int_0^L\sin(n\pi x/L)\,f\,dx$`], a:1,
          ex:R`$\langle\chi_n|\chi_n\rangle = \tfrac L2$, also $b_n = \langle\chi_n|f\rangle/(L/2)$.`,
          fb:[R`Ohne Teilen stimmt die Formel nur für normierte Basisfunktionen. Hier fehlt der Faktor $\tfrac{1}{L/2}$.`,
            '',
            R`Das sind die Koeffizienten bezüglich der *normierten* $\varphi_n$. Für die $\chi_n$ teilt man durch $\tfrac L2$.`]}},
      {id:'mh-t3e', title:'Die beste Näherung und die Besselsche Ungleichung',
        num:{title:'Ein Term für die Konstante', text:R`Für $f = 1$ auf $[0, 1]$ ist $|c_1|^2 = \tfrac{8}{\pi^2} \approx 0{,}811$. Der Abstand von $f$ zu $S_1 = c_1\varphi_1$ ist

$$\|f - S_1\|^2 = \|f\|^2 - |c_1|^2 = 1 - 0{,}811 = 0{,}189.$$

Die Herleitung bestätigt das für beliebiges $L$ durch direktes Ausrechnen.`},
        text:R`Die Teilsumme $S_N = \sum_{n\le N}c_n\varphi_n$ ist die beste Näherung mit den ersten $N$ Basisfunktionen: Keine andere Kombination $\sum_{n\le N}a_n\varphi_n$ kommt $f$ im Sinn der Norm näher. Für den Abstand gilt

$$\|f - S_N\|^2 = \|f\|^2 - \sum_{n=1}^N|c_n|^2.$$

Der Rest $f - S_N$ steht senkrecht auf allen benutzten Basisfunktionen. Weil die linke Seite nicht negativ ist, folgt die **[[lex:bessel-ungleichung|Besselsche Ungleichung]]** $\sum_n|c_n|^2 \le \|f\|^2$. Sie ist ein Rechentest: Ist die Summe größer als die Norm, stimmt ein Koeffizient nicht. Im Labor vergleicht die Anzeige genau diese beiden Zahlen, in Prozent.`,
        fig:{lab:'expand', init:{key:'one', N:5}, caption:R`Teilsummen $S_N$ der Sinusentwicklung und die Anteile $|c_n|^2$. Die Anzeige vergleicht $\sum_{n\le N}|c_n|^2$ mit $\|f\|^2$; bei der Konstante $1$ und $N = 5$ sind es $93{,}31\,\%$.`},
        derive:{ctx:SIN({defs:{'f(x)':'1'}}), lines:[
          {l:'∫_0^L (1 - 4/π sin(πx/L))^2 dx = ∫_0^L (1 - 8/π sin(πx/L) + 16/π^2 sin(πx/L)^2) dx', w:'Abstand von f zu S₁ = c₁φ₁ = (4/π) sin(πx/L), Quadrat ausmultipliziert', why:{q:'Warum ist $c_1\\varphi_1 = \\frac4\\pi\\sin(\\pi x/L)$?', opts:['Weil $\\frac{2\\sqrt{2L}}{\\pi}\\cdot\\sqrt{\\frac2L} = \\frac{4}{\\pi}$ ist.', 'Weil der Koeffizient $c_1$ selbst gleich $4/\\pi$ ist.', 'Weil $\\varphi_1 = \\sin(\\pi x/L)$ ohne Vorfaktor ist.'], a:0, ex:'Koeffizient und Normierungsfaktor der Basisfunktion multiplizieren sich: $\\sqrt{2L}\\sqrt{2/L} = 2$.'}},
          {l:'= L - 16 L/π^2 + 8 L/π^2', w:'∫ sin = 2L/π und ∫ sin² = L/2'},
          {l:'= L - 8 L/π^2', w:'zusammengefasst', why:{q:'Wie passt das zu $\\|f - S_1\\|^2 = \\|f\\|^2 - |c_1|^2$?', opts:['$\\|f\\|^2 = L$ und $|c_1|^2 = 8L/\\pi^2$', '$\\|f\\|^2 = 1$ und $|c_1|^2 = 8/\\pi^2$', 'Gar nicht; die Formel gilt erst für $N \\to \\infty$.'], a:0, ex:'$\\int_0^L 1\\,dx = L$ und $|c_1|^2 = 8L/\\pi^2 \\approx 0{,}81L$. Schon ein Term erfasst 81 % der Norm.'}}
        ]},
        q:{q:R`Jemand berechnet für ein $f$ mit $\|f\|^2 = 2$ die Koeffizienten $c_1 = 1$ und $c_2 = 1{,}2$. Was sagt die Besselsche Ungleichung?`,
          opts:[R`Alles in Ordnung; die Reihe ist nur noch nicht fertig.`, R`Ein Koeffizient ist falsch, denn $1 + 1{,}44 > 2$.`, R`Alles in Ordnung, denn $1 + 1{,}2$ liegt nahe bei $2$.`], a:1,
          ex:R`Schon zwei Quadrate ergeben $1 + 1{,}44 = 2{,}44$, mehr als $\|f\|^2 = 2$. Weitere Terme würden die Summe nur vergrößern.`,
          fb:[R`Weitere Terme sind nicht negativ und können die Summe nur vergrößern. Sie ist schon jetzt zu groß.`,
            '',
            R`Verglichen werden die *Quadrate* der Beträge: $1^2 + 1{,}2^2 = 2{,}44$.`]}}
    ]},
    /* ===== Abschnitt 4: Vollständigkeit, Parseval, Wahrscheinlichkeiten ===== */
    {id:'mh-t4', title:'Vollständigkeit: Wann reicht ein System?', steps:[
      {id:'mh-t4a', title:'Ein System kann zu klein sein',
        num:{title:R`Ohne $\varphi_1$`, text:R`Lass aus den Sinusfunktionen $\varphi_1$ weg. Die übrigen $\varphi_2, \varphi_3, \dots$ sind weiter orthonormal. Für $f = \varphi_1$ sind aber alle Koeffizienten $\langle\varphi_n|\varphi_1\rangle$ mit $n \ge 2$ null. Die Entwicklung ergibt $0$, obwohl $\|f\| = 1$.`},
        text:R`Ein Orthonormalsystem kann zu klein sein: Dann gibt es Funktionen, die sich nicht danach entwickeln lassen. Ein Orthonormalsystem heißt deshalb **[[lex:vollstaendigkeit|vollständig]]**, wenn sich jedes $f \in L^2$ entwickeln lässt, im Sinn von

$$\lim_{N\to\infty}\|f - S_N\| = 0,\qquad S_N = \sum_{n=1}^Nc_n\varphi_n.$$

Gelesen: „Der Abstand von $f$ zur Teilsumme geht gegen null.“ Die Sinusfunktionen auf $[0, L]$ und die $e^{inx}/\sqrt{2\pi}$ auf dem Ring sind vollständig, ebenso weitere Systeme, die du später kennenlernst. Die Beweise sind schwer; man benutzt das Ergebnis. Im $\mathbb C^n$ ist die Frage einfach: Eine Orthonormalbasis braucht genau $n$ Vektoren.`,
        q:{q:R`Für ein Orthonormalsystem und eine Funktion $f \ne 0$ gilt $\langle\varphi_n|f\rangle = 0$ für alle $n$. Was folgt?`,
          opts:[R`$f$ liegt nicht in $L^2$.`, R`$f$ ist an allen Stellen null.`, R`Das System ist nicht vollständig.`], a:2,
          ex:R`In einem vollständigen System steht nichts außer der $0$ auf allen Basisfunktionen senkrecht. Hier fehlt also mindestens eine Richtung.`,
          fb:[R`Für die Koeffizienten braucht $f$ nur eine endliche Norm. Die Aussage betrifft das System, nicht $f$.`,
            R`Vorausgesetzt ist $f \ne 0$. Gerade das zeigt, dass dem System etwas fehlt.`,
            '']}},
      {id:'mh-t4b', title:'Parseval: Die Quadratsumme geht genau auf',
        num:{title:R`$f = 1$, Term für Term`, text:R`Mit $L = 1$ sind die Koeffizienten von $f = 1$ für ungerades $n$ gleich $\tfrac{2\sqrt2}{n\pi}$, für gerades null. Die Quadrate summieren sich auf:

$$\tfrac{8}{\pi^2}\left(1 + \tfrac19 + \tfrac{1}{25}\right) \approx 0{,}811 + 0{,}090 + 0{,}032 = 0{,}933.$$

Mit allen Termen ergibt sich genau $\|f\|^2 = 1$.`},
        text:R`Für ein vollständiges System wird die Besselsche Ungleichung zur Gleichung, der **Parseval-Gleichung**:

$$\sum_n|c_n|^2 = \|f\|^2\quad\text{für jedes } f.$$

Das folgt aus $\|f - S_N\|^2 = \|f\|^2 - \sum_{n\le N}|c_n|^2$, wenn der Rest gegen null geht. Gleichwertig ist: Nichts außer $0$ steht auf allen Basisfunktionen senkrecht. Parseval ist ein starker Rechentest und liefert nebenbei Summenformeln. Die Herleitung zeigt beides für $f = 1$: Die Quadratsumme erreicht genau $L$, und daraus folgt $\sum_n\tfrac{1}{(2n + 1)^2} = \tfrac{\pi^2}{8}$.`,
        derive:{ctx:SIN({defs:{'f(x)':'1'}}), lines:[
          {l:'⟨φ_n|f⟩ = sqrt(2/L) ∫_0^L sin(nπx/L) dx', w:'Koeffizienten von f = 1'},
          {l:'= sqrt(2L)/(nπ) (1 - (-1)^n)', w:'Stammfunktion −L cos(nπx/L)/(nπ) und cos(nπ) = (−1)ⁿ; null für gerade n', why:{q:'Warum verschwinden die Koeffizienten mit geradem $n$?', opts:['Weil dann $1 - (-1)^n = 0$ ist.', 'Weil gerade Sinusfunktionen nicht normiert sind.', 'Weil $f = 1$ am Rand nicht verschwindet.'], a:0, ex:'Die Konstante ist symmetrisch um $L/2$, $\\sin(n\\pi x/L)$ mit geradem $n$ antisymmetrisch. Das Integral über das Produkt ist null.'}},
          {l:'Σ_{n=0}^∞ 8 L/(π^2 (2n + 1)^2) = L', w:'Summe der |c|² über die ungeraden Ordnungen 2n + 1', why:{q:'Was bestätigt diese Summe?', opts:['Parseval: $\\sum|c_n|^2 = \\|f\\|^2 = L$.', 'Dass die Teilsummen in $x = 0$ gegen $1$ gehen.', 'Dass alle Koeffizienten $c_n$ gleich groß sind.'], a:0, ex:'Die Summe erreicht genau $\\int_0^L1\\,dx = L$. Punktweise bleibt $S_N(0) = 0$ – darum geht es in Schritt 4.'}},
          {l:'Σ_{n=0}^∞ 1/(2n + 1)^2 = π^2/8', w:'durch 8L/π² geteilt: eine bekannte Reihe'}
        ]},
        q:{q:R`Für ein Orthonormalsystem und ein $f$ mit $\|f\|^2 = 1$ ergibt $\sum_n|c_n|^2 = 0{,}9$, und alle $c_n$ sind richtig berechnet. Was folgt?`,
          opts:[R`Die Norm von $f$ ist in Wahrheit $0{,}9$.`, R`Die Reihe konvergiert nur punktweise.`, R`Das System ist nicht vollständig.`], a:2,
          ex:R`Bei einem vollständigen System gilt Parseval mit Gleichheit. Ein Rest mit $\|f - S\|^2 = 0{,}1$ steht senkrecht auf allen Basisfunktionen.`,
          fb:[R`Die Norm ist als $1$ gegeben. Die Lücke von $0{,}1$ liegt am System.`,
            R`Mit Konvergenzarten hat das nichts zu tun: Auch im Mittel fehlen $0{,}1$.`,
            '']}},
      {id:'mh-t4c', title:'Skalarprodukte aus Koeffizienten',
        pre:{from:'m-vektor', seg:'mv-t3', title:'Parseval in ℂⁿ', text:R`Für $v = \sum_ic_ie_i$ und $w = \sum_id_ie_i$ in einer Orthonormalbasis ist $\langle v|w\rangle = \sum_ic_i^*d_i$. Mini-Beispiel: $c = (1;\ i)$ und $d = (2;\ 1)$ geben $1\cdot2 + (-i)\cdot1 = 2 - i$.`},
        num:{title:'Zwei Funktionen, zwei Wege', text:R`$f = 3\varphi_1 + i\varphi_2$ und $g = \varphi_1 + \varphi_2$ mit orthonormalen $\varphi_n$. Über die Koeffizienten:

$$\langle f|g\rangle = 3^*\cdot1 + i^*\cdot1 = 3 - i.$$

Das Integral $\int f^*g\,dx$, ausmultipliziert, gibt dasselbe, denn die gemischten Integrale $\langle\varphi_1|\varphi_2\rangle$ sind null.`},
        text:R`Parseval gilt nicht nur für Normen. Für zwei Funktionen mit den Koeffizienten $c_n = \langle\varphi_n|f\rangle$ und $d_n = \langle\varphi_n|g\rangle$ ist

$$\langle f|g\rangle = \sum_nc_n^*\,d_n.$$

Skalarprodukte von Funktionen rechnest du also wie im $\mathbb C^n$: Zeile mal Spalte, nur mit den Koeffizienten statt mit den Funktionswerten. In der Schreibweise von M3 heißt das $\sum_n|\varphi_n\rangle\langle\varphi_n| = \mathbb 1$, die **Zerlegung der Eins**. Setzt du sie zwischen Bra und Ket, entsteht genau die Summe. Die Tafel stellt die drei Wege nebeneinander.`,
        reps:{obj:R`Das Skalarprodukt von $f = 3\varphi_1 + i\varphi_2$ und $g = \varphi_1 + \varphi_2$`,
          rows:[
            {k:'dirac', tex:R`\langle f|g\rangle = \sum_n\langle f|\varphi_n\rangle\langle\varphi_n|g\rangle`},
            {k:'matrix', tex:R`\begin{pmatrix}3^* & i^*\end{pmatrix}\begin{pmatrix}1\\ 1\end{pmatrix} = 3 - i`},
            {k:'ort', tex:R`\begin{aligned}\int f^*g\,dx &= 3\langle\varphi_1|\varphi_1\rangle + 3\langle\varphi_1|\varphi_2\rangle\\ &\quad - i\langle\varphi_2|\varphi_1\rangle - i\langle\varphi_2|\varphi_2\rangle\\ &= 3 - i\end{aligned}`},
            {k:'worte', text:R`Wie bei Pfeilen: Komponente mal Komponente, die linke konjugiert, und alles addiert. Ob die Komponenten Funktionswerte oder Koeffizienten sind, ist gleich.`}
          ],
          links:[
            {from:'dirac', to:'matrix', rule:R`Setze die Zerlegung der Eins ein. $\langle f|\varphi_n\rangle = c_n^*$ bildet die Zeile, $\langle\varphi_n|g\rangle = d_n$ die Spalte.`},
            {from:'matrix', to:'ort', rule:R`Ersetze jede Komponente durch ihre Basisfunktion, multipliziere aus und integriere. Die gemischten Integrale fallen weg, die übrigen sind $1$.`},
            {from:'ort', to:'worte', rule:R`Lies das Integral als „Summe über alle Stellen“ und die Koeffizientensumme als „Summe über alle Basisfunktionen“: dieselbe Rechnung in zwei Koordinaten.`}
          ]},
        q:{q:R`$f$ hat in einer Orthonormalbasis die Koeffizienten $(1;\ 2i;\ 0;\ \dots)$, $g$ die Koeffizienten $(i;\ 1;\ 0;\ \dots)$. Was ist $\int f^*g\,dx$?`, tr:{from:'matrix', to:'ort'},
          opts:[R`$3i$`, R`$-i$`, R`$i$`], a:1,
          ex:R`$\sum_nc_n^*d_n = 1^*\cdot i + (2i)^*\cdot1 = i - 2i = -i$.`,
          fb:[R`Das ist ohne Konjugation gerechnet: $1\cdot i + 2i\cdot1$. Die Koeffizienten von $f$ werden konjugiert.`,
            '',
            R`Hier wurde $g$ statt $f$ konjugiert. Konjugiert wird die linke Funktion im Skalarprodukt.`]}},
      {id:'mh-t4d', title:'Konvergenz im Mittel ist nicht punktweise Konvergenz',
        num:{title:'Rand und Mitte', text:R`Für $f = 1$ ist jede Teilsumme in $x = 0$ null, denn $\sin0 = 0$. Der Abstand im Mittel schrumpft trotzdem: $\|f - S_1\|^2 \approx 0{,}189$, $\|f - S_5\|^2 \approx 0{,}067$, und so weiter gegen $0$.`},
        text:R`Vollständigkeit verspricht nur, dass $\int|f - S_N|^2dx$ gegen null geht. Das ist **[[lex:konvergenz-im-mittel|Konvergenz im Mittel]]**. An einzelnen Punkten darf $S_N$ danebenliegen, und in kleinen Bereichen darf es überschwingen. Im Bild siehst du beides. Die blaue Teilsumme ist an den Rändern null, wo die grün gestrichelte Funktion $1$ ist. Daneben ragt sie über $1$ hinaus. Diese Bereiche werden mit wachsendem $N$ schmaler, und ihr Beitrag zum Integral verschwindet. Für die Physik genügt Konvergenz im Mittel, weil dort fast alles über Integrale berechnet wird.`,
        fig:{lab:'expand', init:{key:'one', N:30}, caption:R`Konstante $1$ mit $N = 30$ Termen. In $x = 0$ und $x = L$ bleibt die Teilsumme null, daneben schwingt sie über. Die Anzeige meldet trotzdem schon $98{,}65\,\%$.`},
        q:{q:R`Die Sinus-Teilsummen $S_N$ von $f = 1$ sind in $x = 0$ für jedes $N$ null. Was heißt das für die Konvergenz im Mittel?`,
          opts:[R`Sie gilt nicht, weil ein Punkt falsch bleibt.`, R`Nichts; sie gilt trotzdem.`, R`Sie gilt nur auf $(0, L/2)$.`], a:1,
          ex:R`Ein Punkt hat die Breite null und trägt nicht zu $\int|f - S_N|^2dx$ bei.`,
          fb:[R`Konvergenz im Mittel fragt nach dem Integral, nicht nach einzelnen Punkten.`,
            '',
            R`Sie gilt auf dem ganzen Intervall; der Rand stört das Integral nicht.`]}},
      {id:'mh-t4e', title:'Brücke: Koeffizienten und Wahrscheinlichkeiten',
        num:{title:'Die normierte Parabel', text:R`$g = \sqrt{30}\,x(1 - x)$ hat $\|g\|^2 = 30\cdot\tfrac{1}{30} = 1$. Ihre Koeffizienten sind die der Parabel mal $\sqrt{30}$:

$$|c_1|^2 = 30\cdot\tfrac{32}{\pi^6} \approx 0{,}9986,\qquad |c_3|^2 \approx 0{,}0014,\qquad |c_5|^2 \approx 0{,}00006.$$

Zusammen ergeben alle genau $1$.`},
        text:R`Für eine normierte Funktion sagt Parseval: $\sum_n|c_n|^2 = 1$. Die Zahlen $|c_n|^2$ sind dann nicht negativ und ergeben zusammen $1$, genau wie Wahrscheinlichkeiten. Jedes $|c_n|^2$ sagt, welcher Anteil der Norm auf die Basisfunktion $\varphi_n$ entfällt. Bei der normierten Parabel liegt fast alles bei $\varphi_1$. Die Tafel übersetzt das in die Sprache der Physik. Dafür musst du noch keine Quantenmechanik kennen. Wichtig ist nur die Rechenregel: normieren, Koeffizienten bestimmen, Betragsquadrate nehmen.`,
        reps:{obj:R`Die normierte Parabel $g = \sqrt{30}\,x(1 - x)$ in der Sinusbasis`,
          rows:[
            {k:'formel', tex:R`\|g\|^2 = \int_0^1|g|^2\,dx = 1 = \sum_n|c_n|^2`},
            {k:'matrix', tex:R`\begin{gathered}\big(|c_1|^2;\ |c_2|^2;\ |c_3|^2;\ |c_4|^2;\ |c_5|^2;\ \dots\big)\\ \approx (0{,}9986;\ 0;\ 0{,}0014;\ 0;\ 0{,}00006;\ \dots)\end{gathered}`},
            {k:'labor', text:R`„Funktion f“ auf „Parabel x(L − x)“: Die Balken zeigen die $|c_n|^2$ relativ zum größten, auf einer logarithmischen Skala; bei geraden $n$ fehlen sie. Die Anzeige teilt $\sum|c_n|^2$ durch $\int|f|^2dx$ und normiert damit selbst.`},
            {k:'physik', text:R`**Ausblick (Thema 3 und 6):** Beschreibt $g$ ein Teilchen im Kasten und $\varphi_n$ den Zustand mit der $n$-ten Energie, dann ist $|c_n|^2$ die Wahrscheinlichkeit, bei einer Energiemessung den $n$-ten Wert zu finden. Hier: fast sicher den kleinsten. Parseval garantiert, dass sich alle Wahrscheinlichkeiten zu $1$ addieren.`}
          ],
          links:[
            {from:'formel', to:'matrix', rule:R`Berechne jedes $c_n = \langle\varphi_n|g\rangle$ und quadriere den Betrag. Schreib die Zahlen in der Reihenfolge der Basis untereinander.`},
            {from:'matrix', to:'labor', rule:R`Jeder Eintrag wird ein Balken über $n$. Blau sind die Balken, die in der Summe der Anzeige enthalten sind.`},
            {from:'labor', to:'physik', rule:R`Lies $|c_n|^2/\|g\|^2$ als Wahrscheinlichkeit für den $n$-ten Messwert. Die Balkenhöhe selbst ist logarithmisch und relativ zum größten Balken; sie zeigt nur, welche $n$ beitragen.`}
          ]},
        q:{q:R`Eine normierte Funktion hat die Koeffizienten $c_1 = \tfrac12$, $c_2 = \tfrac{i}{\sqrt2}$, $c_3 = -\tfrac12$ und sonst null. Welche Wahrscheinlichkeit gehört nach der Übersetzung zu $\varphi_3$?`, tr:{from:'matrix', to:'physik'},
          opts:[R`$-\tfrac12$`, R`$\tfrac14$`, R`$\tfrac12$`], a:1,
          ex:R`$|c_3|^2 = \left|-\tfrac12\right|^2 = \tfrac14$. Probe: $\tfrac14 + \tfrac12 + \tfrac14 = 1$.`,
          fb:[R`$-\tfrac12$ ist der Koeffizient selbst. Wahrscheinlichkeiten sind Betragsquadrate und nie negativ.`,
            '',
            R`$\tfrac12$ gehört zu $\varphi_2$: $\left|\tfrac{i}{\sqrt2}\right|^2 = \tfrac12$.`]}}
    ]},
    /* ===== Abschnitt 5: Operatoren auf Funktionen, Hermitezität ===== */
    {id:'mh-t5', title:'Operatoren auf Funktionen: Wann ist einer hermitesch?', steps:[
      {id:'mh-t5a', title:'Operatoren machen aus Funktionen Funktionen',
        pre:{from:'m-eigen', seg:'me-t2', title:'Die Adjungierte einer Matrix', text:R`Für jede Matrix gilt $\langle u|Av\rangle = \langle A^\dagger u|v\rangle$ mit $A^\dagger = (A^T)^*$. Hermitesch heißt $A^\dagger = A$: Die Matrix darf im Skalarprodukt unverändert nach links. Mini-Beispiel: $\sigma_y^\dagger = \sigma_y$.`},
        num:{title:R`Zwei Operatoren an $f(x) = x(1 - x)$`, text:R`Der Multiplikationsoperator $\hat x$ macht daraus $\hat xf = x^2(1 - x) = x^2 - x^3$. Die Ableitung $D$ macht daraus $Df = f' = 1 - 2x$. Beide sind linear, zum Beispiel $D(2f + g) = 2f' + g'$.`},
        text:R`Matrizen machen aus Spalten Spalten. **Operatoren** machen aus Funktionen Funktionen. Die beiden wichtigsten sind der Multiplikationsoperator $\hat x$, gelesen „x Dach“, mit $\hat xf = x\,f$, und die Ableitung $D = d/dx$. Wie bei Matrizen ist der **adjungierte Operator** $\hat A^\dagger$ festgelegt durch

$$\langle f|\hat Ag\rangle = \langle\hat A^\dagger f|g\rangle\quad\text{für alle zulässigen } f, g.$$

[[lex:hermitescher-operator|Hermitesch]] heißt $\hat A^\dagger = \hat A$. Es gibt hier keine Einträge zum Spiegeln. Deshalb prüft man die Eigenschaft direkt am Skalarprodukt, also an einem Integral.`,
        q:{q:R`Welche Vorschrift ist kein linearer Operator?`,
          opts:[R`$f \mapsto x^2f$`, R`$f \mapsto f^2$`, R`$f \mapsto f''$`], a:1,
          ex:R`$(2f)^2 = 4f^2 \ne 2f^2$: Das Quadrieren verträgt sich nicht mit Vielfachen und Summen.`,
          fb:[R`Multiplizieren mit einer festen Funktion ist linear: $x^2(\alpha f + \beta g) = \alpha x^2f + \beta x^2g$.`,
            '',
            R`Ableiten ist linear, auch zweimal: $(\alpha f + \beta g)'' = \alpha f'' + \beta g''$.`]}},
      {id:'mh-t5b', title:'x̂ ist hermitesch, d/dx nicht',
        pre:{from:'m-analysis', seg:'ma-t4', title:'Partielle Integration', text:R`$\int_a^bf\,g'\,dx = \big[fg\big]_a^b - \int_a^bf'\,g\,dx$. Die Ableitung wandert von $g$ auf $f$; dafür ändert sich das Vorzeichen, und ein Randterm kommt hinzu. Mini-Beispiel: $\int_0^1x\,e^x\,dx = [xe^x]_0^1 - \int_0^1e^xdx = 1$.`},
        num:{title:R`$f = 1$, $g = x$ auf $[0, 1]$`, text:R`$\langle f|Dg\rangle = \int_0^11\cdot1\,dx = 1$, aber $\langle Df|g\rangle = \int_0^10\cdot x\,dx = 0$. Der Unterschied ist genau der Randterm $\big[f^*g\big]_0^1 = 1\cdot1 - 1\cdot0 = 1$.`},
        text:R`$\hat x$ ist hermitesch, weil $x$ reell ist: $\int f^*\,x\,g\,dx = \int(xf)^*g\,dx$. Bei der Ableitung hilft [[lex:partielle-integration|partielle Integration]]:

$$\langle f|Dg\rangle = \int_a^bf^*g'\,dx = \big[f^*g\big]_a^b - \int_a^b(f^*)'g\,dx.$$

Verschwindet der Randterm, bleibt $\langle f|Dg\rangle = -\langle Df|g\rangle$, also $D^\dagger = -D$. Die Ableitung ist dann **antihermitesch**, wie die Matrix $K$ in M4. Partielle Integration spielt hier die Rolle des Transponierens. Im Beispiel verschwindet der Randterm nicht, weil $f$ und $g$ am Rand nicht null sind.`,
        q:{q:R`Unter welcher Bedingung gilt $\langle f|Dg\rangle = -\langle Df|g\rangle$?`,
          opts:[R`immer, das folgt schon aus der Linearität`, R`wenn $f^*g$ an beiden Rändern denselben Wert hat`, R`wenn $f$ und $g$ reell sind`], a:1,
          ex:R`Dann ist der Randterm $\big[f^*g\big]_a^b = 0$, und die partielle Integration lässt nur das Vorzeichen zurück.`,
          fb:[R`Das Beispiel zeigt es: Mit $f = 1$, $g = x$ auf $[0, 1]$ ist $1 \ne -0$. Ohne verschwindenden Randterm geht es nicht.`,
            '',
            R`Auch reelle $f = 1$ und $g = x$ verletzen die Gleichung. Es kommt auf den Randterm an.`]}},
      {id:'mh-t5c', title:R`$-i\,d/dx$ ist hermitesch`,
        num:{title:R`Nachgerechnet mit $\sin(\pi x)$ und $\sin(2\pi x)$`, text:R`Auf $[0, 1]$, beide Funktionen am Rand null, ist $\Big\langle f\Big|-i\tfrac{dg}{dx}\Big\rangle = -2\pi i\int_0^1\sin(\pi x)\cos(2\pi x)\,dx$ und $\Big\langle -i\tfrac{df}{dx}\Big|g\Big\rangle = i\pi\int_0^1\cos(\pi x)\sin(2\pi x)\,dx$. Mit den Integralen $-\tfrac{2}{3\pi}$ und $\tfrac{4}{3\pi}$:

$$-2\pi i\cdot\left(-\tfrac{2}{3\pi}\right) = \tfrac{4i}{3},\qquad i\pi\cdot\tfrac{4}{3\pi} = \tfrac{4i}{3}.$$`},
        text:R`Wie bei der Matrix $K$ in M4 macht ein Faktor $i$ aus dem antihermiteschen Operator einen hermiteschen. Wenn die Randterme verschwinden, ist

$$\Big\langle f\Big|-i\frac{dg}{dx}\Big\rangle = \Big\langle -i\frac{df}{dx}\Big|g\Big\rangle.$$

Die Herleitung zeigt das auf $\mathbb R$ für Funktionen, die im Unendlichen abfallen. Zweimal partiell integriert folgt ebenso, dass $-d^2/dx^2$ hermitesch ist. Die Tafel stellt die Übersetzung zwischen Matrix und Operator zusammen. Ihre letzte Zeile zeigt, wofür die Physik das braucht.`,
        derive:{ctx:{coords:['x'], params:{}, abstract:{f:{args:['x']}, g:{args:['x']}}}, lines:[
          {l:'∫_-∞^∞ f^* (-i g\') dx = -i [f^* g]_-∞^∞ + i ∫_-∞^∞ (f^*)\' g dx', w:'partielle Integration', why:{q:'Woher kommt das Pluszeichen vor dem zweiten Integral?', opts:['Weil die Regel $-\\int(f^*)\'g\\,dx$ gibt und $-i\\cdot(-1) = +i$.', 'Weil beim Ableiten des Konjugierten $(f^*)\' = -(f\')^*$ gilt.', 'Weil man $i$ beim Integrieren konjugieren muss.'], a:0, ex:'$\\int f^*g\'\\,dx = [f^*g] - \\int(f^*)\'g\\,dx$. Der Vorfaktor $-i$ bleibt einfach stehen.'}},
          {l:'= i ∫_-∞^∞ (f^*)\' g dx', w:'Randterm null: f, g → 0 für |x| → ∞'},
          {l:'= ∫_-∞^∞ (-i f\')^* g dx', w:'Konjugation nach außen gezogen', why:{q:'Warum ist $i(f^*)\' = (-if\')^*$?', opts:['Weil $(-if\')^* = (-i)^*(f\')^* = i(f^*)\'$ ist.', 'Weil $i^* = i$ ist.', 'Weil Ableiten und Konjugieren nie vertauschen.'], a:0, ex:'Konjugieren und Ableiten nach dem reellen $x$ vertauschen: $(f\')^* = (f^*)\'$. Rechts steht also $\\langle -if\'|g\\rangle$: $-i\\,d/dx$ ist hermitesch.'}}
        ]},
        reps:{obj:'Hermitesch: bei Matrizen und bei Operatoren',
          rows:[
            {k:'matrix', tex:R`\begin{gathered}\langle u|Av\rangle = \sum_{i,j}u_i^*A_{ij}v_j = \langle Au|v\rangle\\ \Leftrightarrow\quad A_{ij} = A_{ji}^*\end{gathered}`},
            {k:'ort', tex:R`\int f^*(x)\,\big(-i\,g'(x)\big)\,dx = \int\big(-i\,f'(x)\big)^*\,g(x)\,dx`},
            {k:'mathe', text:R`Partielle Integration verschiebt die Ableitung von $g$ auf $f$, mit Vorzeichenwechsel und Randterm. Der Faktor $-i$ wird beim Verschieben zu $(-i)^* = i$ und gleicht den Vorzeichenwechsel aus.`},
            {k:'physik', text:R`**Ausblick (Thema 6):** In der Quantenmechanik ist $\hat p = -i\hbar\,d/dx$ der Impulsoperator. Dass er hermitesch ist, bedeutet: Der Impuls ist eine messbare Größe mit reellen Messwerten.`}
          ],
          links:[
            {from:'matrix', to:'ort', rule:R`Ersetze die Indizes durch die Variable $x$ und die Doppelsumme durch ein Integral. Statt Einträge zu spiegeln, verschiebst du den Operator ins andere Argument.`},
            {from:'ort', to:'mathe', rule:R`Integriere $\int f^*g'\,dx$ partiell und prüfe den Randterm $[f^*g]$ an beiden Enden.`},
            {from:'mathe', to:'physik', rule:R`Lies „hermitesch, mit passender Randbedingung“ als „messbare Größe mit reellen Werten“.`}
          ]},
        q:{q:R`Die Bedingung „$A$ ist hermitesch“ lautet für Matrizen $A_{ij} = A_{ji}^*$. Welche Gleichung tritt für einen Operator $\hat A$ an ihre Stelle?`, tr:{from:'matrix', to:'ort'},
          opts:[R`$\hat Af = (\hat Af)^*$ für jedes $f$`, R`$\int f^*\hat Ag\,dx = \int(\hat Af)^*g\,dx$`, R`$\int f^*\hat Af\,dx = 0$ für jedes $f$`], a:1,
          ex:R`Für alle zulässigen $f, g$ muss $\langle f|\hat Ag\rangle = \langle\hat Af|g\rangle$ gelten. Als Integral geschrieben ist das die zweite Option.`,
          fb:[R`Das würde verlangen, dass $\hat A$ nur reelle Funktionen erzeugt. Hermitesch ist eine Aussage über das Skalarprodukt.`,
            '',
            R`Für einen hermiteschen Operator ist $\int f^*\hat Af\,dx$ reell, aber nicht null.`]}},
      {id:'mh-t5d', title:'Die Randterme entscheiden',
        num:{title:'Ohne Randbedingung', text:R`Auf $[0, L]$ mit $f = 1$ und $g = x$: $\langle f|-iDg\rangle = \int_0^L(-i)\,dx = -iL$, aber $\langle -iDf|g\rangle = 0$, weil $f' = 0$. Der Randterm $-i\big[f^*g\big]_0^L = -iL$ macht den ganzen Unterschied.`},
        text:R`Wann verschwindet $[f^*g]_a^b$? Drei Fälle kommen vor. Im Kasten verlangt man $f(0) = f(L) = 0$ für alle zugelassenen Funktionen. Auf dem Ring sind die Funktionen periodisch, $f(0) = f(2\pi)$; dann heben sich die Randwerte auf, auch wenn sie nicht null sind. Auf der ganzen Achse fallen Funktionen aus $L^2$ im Unendlichen ab. Ohne solche Bedingungen geht es schief, wie das Beispiel zeigt. Die [[lex:randterme-hermitesch|Randbedingungen gehören also zum Operator]]: „$-i\,d/dx$“ allein ist noch keine vollständige Angabe. Man muss dazusagen, auf welchen Funktionen er wirkt.`,
        q:{q:R`Ist $-i\,d/dx$ auf dem Ring, also für periodische Funktionen auf $[0, 2\pi]$, hermitesch?`,
          opts:[R`Nein, denn die Funktionen sind am Rand nicht null.`, R`Nur für reelle Funktionen $f$ und $g$.`, R`Ja, $[f^*g]_0^{2\pi}$ verschwindet wegen der Periodizität.`], a:2,
          ex:R`$f^*(2\pi)g(2\pi) - f^*(0)g(0) = 0$, weil beide Funktionen an beiden Enden dieselben Werte haben. Null sein müssen sie dafür nicht.`,
          fb:[R`Null am Rand ist nur eine Möglichkeit. Gleiche Werte an beiden Enden reichen auch.`,
            R`Die Rechnung gilt für komplexe Funktionen ebenso; der Randterm verschwindet wegen der Periodizität.`,
            '']}},
      {id:'mh-t5e', title:'Was die Hermitezität bringt',
        num:{title:'Die Sinusfunktionen als Eigenfunktionen', text:R`Für $\varphi_n = \sqrt{2/L}\sin(n\pi x/L)$ ist $-\varphi_n'' = \left(\tfrac{n\pi}{L}\right)^2\varphi_n$. Mit $L = 1$ sind die Eigenwerte $\pi^2 \approx 9{,}87$, $4\pi^2 \approx 39{,}5$, $9\pi^2 \approx 88{,}8$ – alle reell und verschieden.`},
        text:R`Die Beweise aus M4 übertragen sich wörtlich, denn sie benutzen nur $\langle f|\hat Ag\rangle = \langle\hat Af|g\rangle$. Eine **Eigenfunktion** ist eine Funktion $f \ne 0$ mit $\hat Af = \lambda f$. Eigenwerte hermitescher Operatoren sind reell, und Eigenfunktionen zu verschiedenen Eigenwerten sind orthogonal. Die Sinusfunktionen des Kastens sind Eigenfunktionen von $-d^2/dx^2$ mit den Randbedingungen $f(0) = f(L) = 0$, zu verschiedenen Eigenwerten. Ihre Orthogonalität muss man deshalb gar nicht nachrechnen. **Ausblick (Thema 2 und 3):** Der Hamiltonoperator $-\tfrac{\hbar^2}{2m}\tfrac{d^2}{dx^2} + V(x)$ mit reellem $V$ ist aus demselben Grund hermitesch.`,
        q:{q:'Die Funktionen $\\cos(n\\pi x/L)$, $n = 0, 1, 2, \\dots$, lösen $-\\varphi\'\' = (n\\pi/L)^2\\varphi$ mit $\\varphi\'(0) = \\varphi\'(L) = 0$. Auch mit dieser Randbedingung ist $-d^2/dx^2$ hermitesch. Was folgt ohne Rechnung?',
          opts:['Nichts: Orthogonal sind nur Funktionen mit $\\varphi(0) = \\varphi(L) = 0$.', 'Sie sind orthogonal, da die Eigenwerte $(n\\pi/L)^2$ verschieden sind.', 'Sie sind orthogonal, weil jedes $\\cos(n\\pi x/L)$ gerade ist.'], a:1,
          ex:'Die Beweise benutzen nur $\\langle f|\\hat Ag\\rangle = \\langle\\hat Af|g\\rangle$. Verschiedene $n$ geben verschiedene Eigenwerte $(n\\pi/L)^2$, also sind die Kosinusfunktionen auf $[0, L]$ orthogonal.',
          fb:['Die Randbedingung muss nur die Randterme zum Verschwinden bringen. Das leistet auch $\\varphi\'(0) = \\varphi\'(L) = 0$.', '', 'Symmetrie um $x = 0$ spielt auf $[0, L]$ keine Rolle. Der Grund ist die Hermitezität mit verschiedenen Eigenwerten.']}}
    ]},
    /* ===== Abschnitt 6: Spektrum und Randbedingung, ebene Wellen ===== */
    {id:'mh-t6', title:'Hermitesch heißt nicht automatisch: Eigenbasis', steps:[
      {id:'mh-t6a', title:'Ring: Die Randbedingung macht das Spektrum diskret',
        num:{title:'Zwei Kandidaten', text:R`$e^{ix}$ erfüllt $-i\tfrac{d}{dx}e^{ix} = e^{ix}$ und ist $2\pi$-periodisch: Eigenwert $1$. $e^{ix/2}$ erfüllt die Gleichung mit $\tfrac12$, aber $e^{i\cdot2\pi/2} = e^{i\pi} = -1$, während $e^0 = 1$. Sie ist nicht periodisch und auf dem Ring nicht zugelassen.`},
        text:R`Für hermitesche Matrizen garantiert der Spektralsatz eine Orthonormalbasis aus Eigenvektoren (M4). Für Operatoren ist das nicht selbstverständlich; es kommt auf die Randbedingung an. Am einfachsten ist der Ring. $\varphi_q = e^{iqx}/\sqrt{2\pi}$ löst $-i\varphi_q' = q\varphi_q$, und Periodizität verlangt $e^{2\pi iq} = 1$, also ganzes $q$. Die Randbedingung macht das Spektrum diskret, und die Eigenfunktionen bilden eine vollständige Orthonormalbasis. Genauso liefert der Kasten die Sinusfunktionen für $-d^2/dx^2$. **Ausblick (Thema 8):** Mit $\hbar$ davor ist $-i\hbar\,d/d\varphi$ der Drehimpuls um eine Achse.`,
        q:{q:R`Welche Eigenwerte hat $-i\,d/dx$ auf dem Ring $[0, 2\pi]$ mit periodischen Funktionen?`,
          opts:[R`alle reellen Zahlen`, R`alle ganzen Zahlen`, R`nur $q = 0$, die Konstante`], a:1,
          ex:R`$e^{iq\cdot2\pi} = 1$ verlangt $q \in \mathbb Z$. Die Randbedingung entscheidet über das Spektrum.`,
          fb:[R`Alle reellen $k$ gibt es auf der ganzen Achse. Auf dem Ring scheiden nicht ganze $q$ aus, wie $e^{ix/2}$ zeigt.`,
            '',
            R`Die Konstante ist periodisch, aber nicht die einzige Lösung: Auch $e^{ix}$ hat bei $0$ und $2\pi$ denselben Wert, mit $q = 1$.`]}},
      {id:'mh-t6b', title:'Kasten: hermitesch, aber keine Eigenfunktion',
        num:{title:R`$-if' = kf$ mit $f(0) = 0$`, text:R`Jede Lösung hat die Form $f = Ce^{ikx}$. Aus $f(0) = C\cdot e^0 = C = 0$ folgt $f = 0$, für jedes $k$, auch für komplexes. Es bleibt keine Eigenfunktion übrig.`},
        text:R`Auf $[0, L]$ mit $f(0) = f(L) = 0$ ist $-i\,d/dx$ hermitesch, denn die Randterme verschwinden. Trotzdem hat er keine einzige Eigenfunktion. Der Grund: Jede Lösung von $-if' = kf$ ist ein Vielfaches von $e^{ikx}$. Diese Funktion wird nirgends null und kann die Randbedingung deshalb nicht erfüllen. Die Lehre: „Hermitesch, also gibt es eine Eigenbasis“ ist für Operatoren ein Fehlschluss. Prüfe immer die Randbedingung. Woran das genau liegt, zeigt der nächste Schritt. **Ausblick (Thema 3):** Ein Teilchen im Kasten hat deshalb keine Zustände mit scharfem Impuls.`,
        q:{q:R`Warum hat $-i\,d/dx$ auf $[0, L]$ mit $f(0) = f(L) = 0$ keine Eigenfunktion?`,
          opts:['Weil der Randterm $[f^*g]_0^L$ dort nicht verschwindet.', 'Weil keine Lösung $Ce^{ikx}$ mit $C \\ne 0$ am Rand null wird.', 'Weil die Eigenwerte $k$ dort komplex sein müssten.'], a:1,
          ex:R`$-if' = kf$ hat nur die Lösungen $Ce^{ikx}$. Sie sind für $C \ne 0$ nirgends null, also erzwingt schon $f(0) = 0$ den Wert $C = 0$.`,
          fb:['Der Randterm verschwindet: Mit $f(0) = f(L) = 0$ ist $[f^*g]_0^L = 0$, der Operator ist hermitesch. Das Problem liegt woanders.', '', 'Auch komplexe $k$ helfen nicht: $Ce^{ikx}$ ist für jedes $k$ nur mit $C = 0$ am Rand null.']}},
      {id:'mh-t6f', title:'Symmetrisch und selbstadjungiert',
        num:{title:'Wer im Randterm frei ist', text:R`Im Randterm $[f^*g]_0^L = f^*(L)\,g(L) - f^*(0)\,g(0)$ stammt $g$ aus dem Bereich des Operators, also $g(0) = g(L) = 0$. Dann ist der Randterm für **jedes** $f$ null, auch für $f = e^{ix}$ mit $f(0) = 1$. Die Gleichung $\langle f|\hat Ag\rangle = \langle -if'|g\rangle$ gilt also für viel mehr $f$, als der Operator selbst zulässt.`},
        text:R`Mathematiker unterscheiden hier zwei Begriffe. Gilt $\langle f|\hat Ag\rangle = \langle\hat Af|g\rangle$ für alle zugelassenen $f$ und $g$, heißt $\hat A$ **symmetrisch**. Das Wort hat nichts mit den symmetrischen Matrizen aus M4 zu tun; es meint genau das, was Physiker meist „hermitesch“ nennen. **Selbstadjungiert** heißt $\hat A$ erst, wenn auch $\hat A^\dagger$ auf genau denselben Funktionen wirkt. Mit $f(0) = f(L) = 0$ ist das nicht so, wie das Beispiel zeigt. Mit $f(L) = e^{i\alpha}f(0)$ dagegen verschwindet der Randterm für alle zugelassenen $g$ genau dann, wenn auch $f$ diese Bedingung erfüllt. Dann ist $-i\,d/dx$ selbstadjungiert, und $e^{ikx}$ mit $e^{ikL} = e^{i\alpha}$ sind Eigenfunktionen. Bei Matrizen fallen beide Begriffe zusammen.`,
        q:{q:R`Ein Lehrbuch nennt $-i\,d/dx$ mit $f(0) = f(L) = 0$ „symmetrisch, aber nicht selbstadjungiert“. Was ist damit gemeint?`,
          opts:[R`Der Randterm verschwindet, aber $\hat A^\dagger$ verträgt mehr Funktionen als $\hat A$.`, R`Seine Matrix ist gleich ihrer Transponierten, aber nicht hermitesch.`, R`Die Gleichung $\langle f|\hat Ag\rangle = \langle\hat Af|g\rangle$ gilt nur für reelle Funktionen.`], a:0,
          ex:R`Symmetrisch: $\langle f|\hat Ag\rangle = \langle\hat Af|g\rangle$ gilt auf dem Bereich des Operators. Selbstadjungiert: Außerdem wirkt $\hat A^\dagger$ auf genau denselben Funktionen. Mit $f(0) = f(L) = 0$ darf $f$ im Randterm beliebige Randwerte haben; deshalb fehlt die Selbstadjungiertheit und mit ihr die Eigenfunktionen.`,
          fb:['',
            R`Gemeint ist nicht die symmetrische Matrix aus M4. Bei Operatoren heißt „symmetrisch“: $\langle f|\hat Ag\rangle = \langle\hat Af|g\rangle$ auf dem Bereich des Operators.`,
            R`Die Gleichung gilt für alle zugelassenen komplexen $f, g$, denn der Randterm ist null. Der Unterschied liegt im Bereich von $\hat A^\dagger$.`]}},
      {id:'mh-t6c', title:'Ganze Achse: Eigenfunktionen außerhalb des Raums',
        pre:{from:'m-analysis', seg:'ma-t5', title:'Die δ-Distribution', text:R`$\delta(x - a)$ ist durch ihre Wirkung im Integral definiert: $\int\delta(x - a)\,f(x)\,dx = f(a)$. Sie ist keine Funktion, sondern der Grenzfall immer schmalerer, höherer Spitzen mit der Fläche $1$. Mini-Beispiel: $\int\delta(x - 2)\,x^2\,dx = 4$.`},
        num:{title:R`$e^{ikx}$ auf $[-R, R]$`, text:R`$\int_{-R}^R|e^{ikx}|^2dx = \int_{-R}^R1\,dx = 2R$. Mit $R = 10$ ist das $20$, mit $R = 1000$ schon $2000$. Für $R \to \infty$ gibt es keine endliche Norm.`},
        text:R`Auf $\mathbb R$ ist $e^{ikx}$ für jedes reelle $k$ eine Lösung von $-if' = kf$, wie die Herleitung zeigt. Sie ist aber nicht normierbar und liegt nicht in $L^2$. Solche **[[lex:uneigentliche-eigenfunktion|uneigentlichen Eigenfunktionen]]** normiert man auf eine δ-Funktion:

$$\int_{-\infty}^\infty e^{-ik'x}e^{ikx}\,dx = 2\pi\,\delta(k - k').$$

Die Entwicklung nach ihnen ist keine Summe, sondern ein Integral über $k$: die Fourier-Transformation (M6). Noch extremer ist $\hat x$. Seine „Eigenfunktionen“ zur Stelle $x_0$ sind $\delta(x - x_0)$ und damit gar keine Funktionen ([[lex:delta-distribution|δ-Distribution]], M2).`,
        derive:{ctx:{coords:['x'], params:{k:'real'}}, lines:[
          {l:'-i d/dx e^(i k x) = k e^(i k x)', w:'Eigenwertgleichung von −i d/dx, für jedes reelle k', why:{q:'Welcher Eigenwert gehört zu $e^{ikx}$?', opts:['$k$', '$ik$', '$-k$'], a:0, ex:'$\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$, mal $-i$ ergibt $k\\,e^{ikx}$.'}},
          {l:'|e^(i k x)|^2 = 1', w:'konstant: ∫|f|² dx divergiert auf ℝ', why:{q:'Was folgt daraus?', opts:['$e^{ikx}$ ist auf $\\mathbb R$ nicht quadratintegrabel.', '$e^{ikx}$ ist auf $\\mathbb R$ schon auf $1$ normiert.', 'Die Eigenwerte $k$ können dann nicht reell sein.'], a:0, ex:'$\\int_{-\\infty}^\\infty 1\\,dx = \\infty$. Auf dem Ring dagegen ist $\\int_0^{2\\pi}1\\,dx = 2\\pi$ endlich; dort ist $e^{inx}/\\sqrt{2\\pi}$ normiert.'}}
        ]},
        q:{q:R`Warum ist $e^{ikx}$ auf $\mathbb R$ kein Element von $L^2$?`,
          opts:[R`Weil $k$ nicht ganzzahlig sein muss.`, R`Weil $|e^{ikx}|^2 = 1$ und $\int1\,dx$ divergiert.`, R`Weil $e^{ikx}$ komplexe Werte hat.`], a:1,
          ex:R`Für $L^2$ zählt nur, ob $\int|f|^2dx$ endlich ist. Bei konstantem $|f|^2 = 1$ wächst das Integral mit der Länge des Bereichs.`,
          fb:[R`Ganzzahligkeit ist eine Frage der Randbedingung, nicht der Norm. Auch $e^{ix}$ liegt auf $\mathbb R$ nicht in $L^2$.`,
            '',
            R`Komplexe Funktionen können in $L^2$ liegen, etwa $e^{ix}e^{-x^2}$. Entscheidend ist der Betrag.`]}},
      {id:'mh-t6d', title:'Die ebene Welle in drei Darstellungen',
        num:{title:R`$k = 2$`, text:R`$f(x) = e^{2ix} = \cos2x + i\sin2x$. Der Realteil schwingt mit der Periode $\pi$, der Betrag ist überall $|f| = 1$. Die Ableitung: $-i\tfrac{d}{dx}e^{2ix} = -i\cdot2i\,e^{2ix} = 2e^{2ix}$.`},
        text:R`Die ebene Welle zeigt besonders klar, wie Formel, Bild und Bedeutung zusammenhängen. Die Formel sagt: Eigenfunktion zum Eigenwert $k$. Das Bild sagt: Der Realteil schwingt endlos weiter, der Betrag ist überall gleich. Daraus folgt die Bedeutung: Keine Stelle ist bevorzugt, und die Norm ist unendlich. Die Tafel verbindet die drei mit der Physik. **Die Lehre:** Ein physikalischer Zustand ist immer normierbar. Ebene Wellen und δ-Funktionen sind nützliche Rechenhilfen, aber keine Zustände. Echte Zustände sind Überlagerungen davon, sogenannte [[lex:wellenpaket|Wellenpakete]].`,
        reps:{obj:R`Die ebene Welle $e^{2ix}$`,
          rows:[
            {k:'formel', tex:R`\begin{gathered}-i\frac{d}{dx}e^{2ix} = 2\,e^{2ix},\\ |e^{2ix}|^2 = 1\end{gathered}`},
            {k:'graph', plot:{x:[-6, 6], y:[-1.4, 1.4], xlab:'x', ylab:'f'}, f:x => Math.cos(2 * x), lab:R`\operatorname{Re}e^{2ix}`, f2:x => 1, lab2:R`|e^{2ix}|^2`,
              cap:R`Der Realteil schwingt ohne Ende, das Betragsquadrat ist überall $1$. Die Fläche unter $|e^{2ix}|^2$ wächst mit der Länge des Bereichs.`},
            {k:'worte', text:R`Eigenfunktion zum Eigenwert $2$, aber überall gleich stark: keine endliche Norm, kein Element von $L^2$.`},
            {k:'physik', text:R`**Ausblick (Thema 4 und 6):** Mit $p = \hbar k$ beschreibt $e^{ikx}$ ein Teilchen mit genau bekanntem Impuls und völlig unbekanntem Ort. Ein solches Teilchen gibt es nicht; reale Teilchen sind Wellenpakete, Überlagerungen vieler $e^{ikx}$.`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Zerlege $e^{2ix} = \cos2x + i\sin2x$ und zeichne den Realteil. Zeichne daneben $|e^{2ix}|^2$: eine waagerechte Linie.`},
            {from:'graph', to:'worte', rule:R`Prüfe, ob die Fläche unter $|f|^2$ endlich bleibt, wenn du das Intervall vergrößerst. Wächst sie mit, liegt $f$ nicht in $L^2$.`},
            {from:'worte', to:'physik', rule:R`Lies „nicht normierbar“ als „kein möglicher Zustand“ und den Eigenwert $k$ als Impuls $\hbar k$.`}
          ]},
        q:{q:R`Der Graph von $|f(x)|^2$ fällt für $|x| \to \infty$ wie $1/|x|$ ab. Liegt $f$ in $L^2(\mathbb R)$?`, tr:{from:'graph', to:'worte'},
          opts:['Ja, weil $|f|^2$ für $|x| \\to \\infty$ gegen null geht.', 'Nein, weil die Fläche unter $1/|x|$ ohne Grenze wächst.', 'Ja, weil $f$ wie $1/x$ abfällt und $1/x$ quadratintegrabel ist.'], a:1,
          ex:R`$\int_1^R\tfrac{dx}{x} = \ln R$ wächst ohne Grenze. Abfallen allein genügt nicht; es muss schnell genug sein.`,
          fb:[R`Gegen null gehen reicht nicht. Es kommt darauf an, ob die Fläche unter $|f|^2$ endlich bleibt.`,
            '',
            R`Hier ist $|f|^2 \sim 1/|x|$, also $f \sim 1/\sqrt{|x|}$. Quadratintegrabel ist $1/x$, weil *ihr* Quadrat $1/x^2$ ist.`]}},
      {id:'mh-t6e', title:'Typischer Fehler: ebene Wellen und δ als Zustände',
        num:{title:'Überlagerung zu einem Paket', text:R`Überlagert man ebene Wellen mit einem Gauß-Gewicht, entsteht eine Funktion mit endlicher Norm:

$$\begin{aligned}f(x) &= \int_{-\infty}^\infty e^{-k^2/2}\,e^{ikx}\,dk\\ &= \sqrt{2\pi}\,e^{-x^2/2},\\ \int|f|^2dx &= 2\pi\sqrt\pi \approx 11{,}1.\end{aligned}$$`},
        text:R`Ein häufiger Fehlschluss lautet: „$e^{ikx}$ ist eine Eigenfunktion, also ein möglicher Zustand.“ Für einen Zustand braucht man aber eine endliche Norm. Ebene Wellen und δ-Funktionen haben keine. Sie sind trotzdem nützlich, nämlich als Bausteine. Überlagert man viele von ihnen mit einem Gewicht, das schnell genug abfällt, entsteht eine normierbare Funktion, ein Wellenpaket. Das Beispiel zeigt es mit einem Gauß-Gewicht. Wie man das Gewicht zu einer gegebenen Funktion findet, zeigt die Fourier-Transformation in M6.`,
        q:{q:R`Welche Funktion ist ein möglicher Zustand im Sinn von $L^2(\mathbb R)$?`,
          opts:[R`$e^{3ix}$`, R`$\delta(x - 1)$`, R`$e^{3ix}e^{-x^2}$`], a:2,
          ex:R`$|e^{3ix}e^{-x^2}|^2 = e^{-2x^2}$ hat das endliche Integral $\sqrt{\pi/2}$.`,
          fb:[R`$|e^{3ix}|^2 = 1$ überall: keine endliche Norm.`,
            R`$\delta$ ist keine Funktion, und $\int\delta^2dx$ ist nicht endlich.`,
            '']}}
    ]}
  ],
  example:{
    title:'Die Konstante nach Sinusfunktionen entwickeln',
    text:'Auf $[0, L]$ bilden $\\varphi_n(x) = \\sqrt{2/L}\\,\\sin(n\\pi x/L)$, $n = 1, 2, \\dots$ ein vollständiges Orthonormalsystem (die Eigenfunktionen des Kastens, Thema 3). Entwickle $f(x) = 1$ danach: Bestimme $c_n = \\langle\\varphi_n|f\\rangle$.',
    ctx:SIN({defs:{'f(x)':'1'}}),
    lines:[
      {l:'c_n = ⟨φ_n|f⟩', why:{q:'Warum ist der Koeffizient ein Skalarprodukt?', opts:['Aus $f = \\sum_m c_m\\varphi_m$ und $\\langle\\varphi_n|\\varphi_m\\rangle = \\delta_{nm}$ folgt $\\langle\\varphi_n|f\\rangle = c_n$.', 'Das ist eine Definition; begründen lässt es sich nicht.', 'Weil $f$ reell ist, ist $c_n$ der Mittelwert von $f\\varphi_n$.'], a:0, ex:'Genau wie im $\\mathbb C^n$: Die Komponente bezüglich einer Orthonormalbasis ist die Projektion auf den Basisvektor.'}},
      {l:'= sqrt(2/L) ∫_0^L sin(nπx/L) dx', why:{q:'Wo bleibt die Konjugation von $\\varphi_n$?', opts:['$\\varphi_n$ ist reell, also $\\varphi_n^* = \\varphi_n$.', 'Man darf sie immer weglassen.', 'Sie steckt im Faktor $\\sqrt{2/L}$.'], a:0, ex:'$\\langle\\varphi_n|f\\rangle = \\int\\varphi_n^*f\\,dx$. Für reelle Basisfunktionen ändert die Konjugation nichts.'}},
      {l:'= sqrt(2/L) [-L cos(nπx/L)/(nπ)]_0^L', why:{q:'Welche Stammfunktion wurde benutzt?', opts:['$\\int\\sin(kx)\\,dx = -\\cos(kx)/k$', '$\\int\\sin(kx)\\,dx = k\\cos(kx)$', '$\\int\\sin(kx)\\,dx = \\cos(kx)/k$'], a:0, ex:'Hier ist $k = n\\pi/L$. Ableiten zur Kontrolle: $\\frac{d}{dx}(-\\cos kx/k) = \\sin kx$.'}},
      {l:'= sqrt(2/L) L/(nπ) (1 - cos(nπ))', why:{q:'Was ist $\\cos(n\\pi)$?', opts:['$(-1)^n$', '$(-1)^{n+1}$', '$1$ für alle $n$'], a:0, ex:'$\\cos\\pi = -1$, $\\cos 2\\pi = 1$, … also $(-1)^n$.'}},
      {l:'= sqrt(2L)/(nπ) (1 - (-1)^n)', why:{q:'Was bedeutet das Ergebnis?', opts:['Nur ungerade $n$ tragen bei, mit $c_n = 2\\sqrt{2L}/(n\\pi)$.', 'Nur gerade $n$ tragen bei, weil $f$ symmetrisch ist.', 'Die Konstante lässt sich so nicht entwickeln.'], a:0, ex:'Für gerade $n$ ist $1 - (-1)^n = 0$: Die Konstante ist symmetrisch um $L/2$, die geraden $\\varphi_n$ sind dort antisymmetrisch. Kontrolle mit der Vollständigkeit: $\\sum_{n\\,\\text{ungerade}}\\frac{8L}{n^2\\pi^2} = \\frac{8L}{\\pi^2}\\cdot\\frac{\\pi^2}{8} = L = \\|f\\|^2$.'}}
    ],
    faded:{id:'mh-fade', title:'Jetzt du: $f(x) = x$', text:'Entwickle $f(x) = x$ auf $[0, L]$ nach denselben $\\varphi_n$. Partielle Integration: $\\int_0^L x\\sin(kx)\\,dx = \\left[-\\frac{x\\cos kx}{k}\\right]_0^L + \\frac1k\\int_0^L\\cos(kx)\\,dx$ mit $k = n\\pi/L$.',
      ctx:SIN({defs:{'f(x)':'x'}}),
      given:['c_n = ⟨φ_n|f⟩', '= sqrt(2/L) ∫_0^L x sin(nπx/L) dx'],
      goals:[{id:'a', prompt:'Bestimme $c_n$.', type:'value', target:'(-1)^(n+1) sqrt(2) L^(3/2)/(nπ)', points:3,
        hints:['Werte den Randterm und das Restintegral der angegebenen partiellen Integration getrennt aus; multipliziere am Ende mit $\\sqrt{2/L}$.', 'Das Restintegral $\\int_0^L\\cos(n\\pi x/L)\\,dx$ ist null.', 'Der Randterm bei $x = L$: $-L\\cdot L\\cos(n\\pi)/(n\\pi) = -L^2(-1)^n/(n\\pi)$.'],
        model:['c_n = ⟨φ_n|f⟩', '= sqrt(2/L) ∫_0^L x sin(nπx/L) dx', {l:'= sqrt(2/L) ([-L x cos(nπx/L)/(nπ)]_0^L + L/(nπ) ∫_0^L cos(nπx/L) dx)', gap:'= sqrt(2/L) ([▢]_0^L + L/(nπ) ∫_0^L cos(nπx/L) dx)'}, '= sqrt(2/L) (-L^2 (-1)^n/(nπ) + 0)', '= (-1)^(n+1) sqrt(2) L^(3/2)/(nπ)'],
        mistakes:[{expr:'(-1)^n sqrt(2) L^(3/2)/(nπ)', msg:'Vorzeichen: Der Randterm ist $-L^2(-1)^n/(n\\pi) = (-1)^{n+1}L^2/(n\\pi)$.'}, {expr:'(-1)^(n+1) L^2/(nπ)', msg:'Der Normierungsfaktor $\\sqrt{2/L}$ von $\\varphi_n$ fehlt.'}]}]}
  },
  puzzle:{
    title:'An jeder Stelle null – und trotzdem nicht klein?',
    text:'In Abschnitt 4 konvergieren die Teilsummen von $f = 1$ im Mittel, aber nicht an den Rändern. Geht es auch umgekehrt?\n\nAuf $[0, 1]$ sei $f_N(x) = \\sqrt N$ für $0 < x < 1/N$ und $f_N(x) = 0$ sonst. Für jedes feste $x$ ist $f_N(x) = 0$, sobald $N > 1/x$ ist (und bei $x = 0$ ohnehin). Die Folge geht also an jeder Stelle gegen $0$.\n\nGeht sie auch im Sinne von $L^2$ gegen die Nullfunktion, also $\\|f_N - 0\\| \\to 0$?',
    q:{q:'Deine Vermutung:', opts:['Ja, weil $f_N$ an jeder Stelle gegen $0$ geht.', 'Nein, denn $\\|f_N\\| = 1$ für jedes $N$.', 'Ja, weil das Intervall immer kürzer wird.', 'Nur, wenn man $f_N$ auch bei $x = 0$ abändert.'], a:1, ex:'$\\|f_N\\|^2 = \\int_0^{1/N}N\\,dx = 1$ für jedes $N$.'},
    reveal:'$\\|f_N\\|^2 = \\int_0^{1/N}N\\,dx = N\\cdot\\frac1N = 1$, für jedes $N$. Der Abstand zur Nullfunktion bleibt also $1$. Die Folge konvergiert punktweise gegen $0$, aber **nicht** im Mittel.\n\nZusammen mit Abschnitt 4 heißt das: Die beiden Konvergenzbegriffe sind in **beiden** Richtungen verschieden. Die Teilsummen von $f = 1$ konvergieren im Mittel, aber nicht an den Rändern. $f_N$ konvergiert an jeder Stelle, aber nicht im Mittel.\n\nAnschaulich: Die „Wahrscheinlichkeit“ $|f_N|^2$ verschwindet nicht, sie drängt sich immer enger bei $x = 0$ zusammen. An jedem festen Ort ist die Dichte irgendwann null, die Gesamtwahrscheinlichkeit bleibt trotzdem $1$. Darum genügt es in der QM nicht, nur auf Werte an einzelnen Orten zu schauen.\n\nAusblick: $|f_N|^2$ ist ein Rechteck der Fläche $1$, das immer schmaler wird – eine δ-Folge (M2). Im Sinne der Distributionen geht $|f_N|^2$ gegen $\\delta(x)$; als Grenzwert in $L^2$ hat $f_N$ aber gar keinen.'
  },
  clarify:{
    core:'Funktionen verhalten sich wie Vektoren mit unendlich vielen Komponenten. Das **Skalarprodukt** ist\n\n$$\\langle f|g\\rangle = \\int f^*(x)\\,g(x)\\,dx,\\qquad \\|f\\|^2 = \\langle f|f\\rangle = \\int|f|^2dx.$$\n\nDer **Hilbertraum** $L^2$ besteht aus allen quadratintegrablen Funktionen ($\\|f\\| < \\infty$) – genau die normierbaren Wellenfunktionen. Funktionen, die sich nur in einzelnen Punkten unterscheiden, gelten in $L^2$ als gleich. Ein **Orthonormalsystem** $\\{\\varphi_n\\}$ erfüllt $\\langle\\varphi_n|\\varphi_m\\rangle = \\delta_{nm}$; es heißt **vollständig**, wenn sich jedes $f \\in L^2$ im quadratischen Mittel entwickeln lässt:\n\n$$f = \\sum_n c_n\\varphi_n,\\qquad c_n = \\langle\\varphi_n|f\\rangle,\\qquad \\sum_n|c_n|^2 = \\|f\\|^2\\ \\text{(Parseval)}.$$\n\nOperatoren wirken auf Funktionen, etwa $\\hat x f = xf$ oder $\\hat D f = f\'$. Ein Operator ist **hermitesch**, wenn $\\langle f|\\hat A g\\rangle = \\langle\\hat A f|g\\rangle$ für alle zulässigen $f, g$. Für Differentialoperatoren prüft man das mit partieller Integration; dabei entscheiden die **Randterme** und damit die Randbedingungen.',
    keys:[
      'Das Skalarprodukt ist im ersten Argument konjugiert: $\\langle f|g\\rangle = \\langle g|f\\rangle^*$ und $\\langle cf|g\\rangle = c^*\\langle f|g\\rangle$.',
      'Entwicklungskoeffizienten sind Projektionen, $c_n = \\langle\\varphi_n|f\\rangle$ – das klappt nur, weil die Basis orthonormal ist. Bei nicht normierten Basisfunktionen muss man durch $\\|\\varphi_n\\|^2$ teilen.',
      'Parseval ist ein schneller Test: Ist $\\sum|c_n|^2$ größer als $\\|f\\|^2$, steckt ein Fehler in den Koeffizienten.',
      '$d/dx$ ist antihermitesch ($\\langle f|g\'\\rangle = -\\langle f\'|g\\rangle$), $-i\\,d/dx$ und $-d^2/dx^2$ sind hermitesch – sofern die Randterme verschwinden.',
      'Wie bei Matrizen (M4): Hermitesche Operatoren haben reelle Eigenwerte, und Eigenfunktionen zu verschiedenen Eigenwerten sind orthogonal.'
    ],
    errors:[
      'Konjugation vergessen: $\\int f\\,g\\,dx$ statt $\\int f^*g\\,dx$. Dann wird $\\langle f|f\\rangle$ womöglich null oder komplex.',
      'Den Normierungsfaktor der Basisfunktionen vergessen, etwa $\\int\\sin(n\\pi x/L)f\\,dx$ statt $\\sqrt{2/L}\\int\\sin(n\\pi x/L)f\\,dx$.',
      'Bei der partiellen Integration das Minuszeichen verlieren – dann erscheint $d/dx$ fälschlich hermitesch.',
      'Randterme stillschweigend weglassen, obwohl die Funktionen am Rand nicht verschwinden.'
    ],
    more:[{title:'Warum ist $e^{ikx}$ nicht im Hilbertraum?', text:'$|e^{ikx}|^2 = 1$, also divergiert $\\int_{-\\infty}^\\infty|e^{ikx}|^2dx$. Ebene Wellen sind trotzdem nützlich: Sie sind „uneigentliche“ Eigenfunktionen von $\\hat p$ und werden auf eine δ-Funktion normiert, $\\langle e^{ik\'x}|e^{ikx}\\rangle = 2\\pi\\,\\delta(k - k\')$. Physikalische Zustände sind Überlagerungen davon, also Wellenpakete (M6, Thema 4).'}],
    checks:[
      {q:'$f = 3\\varphi_1 + 4i\\,\\varphi_2$ mit orthonormalen $\\varphi_n$. Wie groß ist $\\|f\\|^2$?', opts:['$25$', '$-7$', '$7$'], a:0, ex:'$\\|f\\|^2 = |3|^2 + |4i|^2 = 9 + 16 = 25$. Die Mischterme fallen wegen der Orthogonalität weg.'},
      {q:'Auf $[0, L]$ gelte $f(0) = f(L) = 0$ und $g(0) = g(L) = 0$. Dann ist $\\int_0^L f^*g\'\\,dx$ gleich …', opts:['$-\\int_0^L (f^*)\'\\,g\\,dx$', '$\\int_0^L (f^*)\'\\,g\\,dx$', '$0$'], a:0, ex:'Partielle Integration: $[f^*g]_0^L - \\int (f^*)\'g\\,dx$, und der Randterm ist null.'}
    ]
  },
  lab:{type:'expand', title:'Entwicklung nach Sinusfunktionen',
    map:[
      {sym:R`f`, ctl:'Funktion f', says:R`Wählt die Funktion $f$ auf $[0, L]$ mit $L = 1$: Parabel $x(L - x)$, Zelt, Stufe oder Konstante $1$. Sie erscheint grün gestrichelt; ihre Norm $\int_0^L|f|^2dx$ steht in der Anzeige.`},
      {sym:R`S_N = \sum_{n=1}^Nc_n\varphi_n`, ctl:'Zahl der Terme N', says:R`Obere Grenze der Teilsumme, blau gezeichnet. Mehr Terme bringen $S_N$ im Mittel näher an $f$; an den Rändern bleibt jede Teilsumme null.`},
      {sym:R`\varphi_n(x) = \sqrt{2/L}\sin(n\pi x/L)`, ctl:'x / L', says:R`Waagerechte Achse in Einheiten von $L$. Alle Basisfunktionen verschwinden bei $x = 0$ und $x = L$, deshalb auch jede Teilsumme – gleichgültig, wie $f$ dort aussieht.`},
      {sym:R`|c_n|^2 = |\langle\varphi_n|f\rangle|^2`, ctl:'Balken: ', says:R`Unteres Bild: ein Balken je $n$, relativ zum größten und auf einer logarithmischen Skala über acht Zehnerpotenzen. Blau: in $S_N$ enthalten, grau: noch nicht. Fehlende Balken sind Koeffizienten null, etwa bei geraden $n$ für symmetrische $f$.`},
      {sym:R`\sum_{n\le N}|c_n|^2\ \text{von}\ \int_0^L|f|^2dx`, ctl:'(Einheiten mit L = 1)', says:R`Die Anzeige vergleicht die Quadratsumme mit der Norm, in Prozent. Bessel: nie über $100\,\%$. Parseval: gegen $100\,\%$ für $N \to \infty$, auch wenn $S_N$ einzelne Punkte verfehlt.`},
      {sym:R`f = x(L - x)`, ctl:'Parabel x(L − x)', says:R`Ein Beispiel, das dem ersten Sinus sehr ähnlich ist: Schon $N = 1$ erreicht $99{,}86\,\%$. Die Stufe und die Konstante brauchen dagegen viele Terme, weil sie springen bzw. am Rand nicht null sind.`}
    ],
    sketch:{id:'mh-lab-s', kind:'curve', draw:'f', title:'Vorhersage: die beste Näherung mit einem Term',
      text:'Gleich zeigt das Labor Teilsummen der Sinusentwicklung. Skizziere vorher $S_1 = c_1\\varphi_1$ für $f = 1$ auf $[0, L]$, mit $\\varphi_1 = \\sqrt{2/L}\\sin(\\pi x/L)$ und $c_1 = \\langle\\varphi_1|f\\rangle$. Die Achse ist absolut ($L = 1$); die Gerade $f = 1$ liegt in Höhe des Teilstrichs $1$. Stell danach die Funktion „Konstante 1“ und $N = 1$ ein und vergleiche.',
      plot:{x:[0, 1], y:[-0.3, 1.5], abs:true, xlab:'x', ylab:'S_1(x)', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}], yticks:[{y:0.5, lab:'0{,}5'}, {y:1, lab:'1'}]},
      // c_1 = √2 ∫_0^1 sin(πx) dx = 2√2/π, S_1 = c_1·√2 sin(πx) = (4/π) sin(πx) ≈ 1,273 sin(πx); Mittel über [0,4; 0,6] ≈ 1,252
      // 'hoehe' nimmt [1,05; 1,51] an: deutlich über f = 1 bis zum oberen Rahmen. Eine Kurve, die in der Mitte nur bis 1 reicht (Mittel 0,98), fällt durch.
      f:x => 4 / Math.PI * Math.sin(Math.PI * x),
      checks:[
        {id:'rand', type:'zero', at:[0, 1], msg:'Welchen Wert hat $\\varphi_1$ bei $x = 0$ und $x = L$? Was folgt daraus für jedes Vielfache $c_1\\varphi_1$?'},
        {id:'sym', type:'parity', p:'even', about:0.5, msg:'$f = 1$ und $\\varphi_1$ sind beide symmetrisch zur Mitte. Was gilt dann für $S_1$?'},
        {id:'lage', type:'maxat', x:0.5, tol:0.15, msg:'Wo hat $\\sin(\\pi x/L)$ sein Maximum?'},
        {id:'hoehe', type:'level', range:[0.4, 0.6], v:1.28, tol:0.18, msg:'Berechne $c_1 = \\sqrt{2/L}\\int_0^L\\sin(\\pi x/L)\\,dx$. Wie hoch ist $S_1$ dann in der Mitte – unter, auf oder über $f = 1$? Deine Kurve liegt dort bei {got}. (Abschnitt „Orthonormalsysteme und Komponenten“)'}
      ],
      reveal:'$c_1 = \\sqrt2\\int_0^1\\sin(\\pi x)\\,dx = 2\\sqrt2/\\pi$, also $S_1 = \\frac{4}{\\pi}\\sin(\\pi x/L) \\approx 1{,}27\\sin(\\pi x/L)$. $S_1$ ist an den Rändern null, weil $\\varphi_1$ dort null ist – gleichgültig, wie $f$ aussieht. In der Mitte ragt $S_1$ über $f = 1$ hinaus: Die beste Näherung im quadratischen Mittel gleicht das Zuwenig an den Rändern durch ein Zuviel in der Mitte aus. Mit wachsendem $N$ rückt die Teilsumme im Labor an $f$ heran, bleibt aber in $x = 0$ und $x = L$ null.',
      hints:['Rechne zuerst $c_1$ aus; $S_1$ ist dann ein Vielfaches von $\\sin(\\pi x/L)$.', '$\\int_0^L\\sin(\\pi x/L)\\,dx = 2L/\\pi$, und $\\varphi_1$ trägt den Faktor $\\sqrt{2/L}$ zweimal bei: einmal in $c_1$, einmal in $\\varphi_1$ selbst.'],
      wrong:[
        {f:x => 1, fails:['rand'], why:'S₁ ≈ f gezeichnet, auch am Rand'},
        {f:x => 2 / Math.PI * Math.sin(Math.PI * x), fails:['hoehe'], why:'mit dem nicht normierten sin(πx/L) gerechnet und nicht durch ⟨φ|φ⟩ geteilt'},
        {f:x => Math.sin(Math.PI * x), fails:['hoehe'], why:'S₁ reicht in der Mitte nur bis f = 1: Überschießen der besten Näherung nicht erwartet'}
      ]},
    text:'Die Funktion $f$ auf $[0, L]$ wird nach $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ entwickelt. Wähle $f$ (Parabel $x(L-x)$, Zelt, Stufe oder Konstante $1$) und mit dem Regler $N$ zwischen $1$ und $30$ die Zahl der Terme der Teilsumme $S_N = \\sum_{n\\le N}c_n\\varphi_n$. Die Anzeige vergleicht $\\sum_{n\\le N}|c_n|^2$ mit $\\int_0^L|f|^2dx$ (Anteil in Prozent), die Balken zeigen die einzelnen $|c_n|^2$ relativ zum größten Beitrag und logarithmisch (blau: in der Summe enthalten).',
    predict:{q:'Bevor du die Funktion wählst: Das Zelt hat seine Spitze bei $x = L/2$ und ist symmetrisch um diese Mitte. Welche Koeffizienten $c_n$ sind null?', opts:['alle mit geradem $n$', 'alle mit ungeradem $n$', 'keiner, alle tragen bei', 'alle außer $c_1$'], a:0, ex:'Für gerades $n$ ist $\\sin(n\\pi x/L)$ antisymmetrisch um $L/2$, das Zelt symmetrisch. Das Produkt ist antisymmetrisch, das Integral null. Dasselbe gilt für Parabel und Konstante.'},
    questions:[
      {q:'Wähle die Parabel $x(L-x)$. Ab welchem $N$ liegt der Anteil $\\sum|c_n|^2/\\|f\\|^2$ über 99 %?', opts:['schon bei $N = 1$', 'erst ab etwa $N = 10$', 'nie, weil die Parabel kein Sinus ist'], a:0, ex:'$|c_1|^2/\\|f\\|^2 = 960/\\pi^6 \\approx 0{,}9986$: Die Parabel sieht dem Grundzustand sehr ähnlich. Die geraden $n$ tragen aus Symmetriegründen gar nicht bei.'},
      {q:'Wähle die Konstante $1$ und erhöhe $N$ bis $30$. Was siehst du nahe den Rändern?', opts:['Sie schwingt über und bleibt in $x = 0$ und $x = L$ bei null.', 'Sie stimmt bei großem $N$ auch am Rand exakt mit $f$ überein.', 'Sie wächst am Rand mit $N$ über alle Grenzen.'], a:0, ex:'Das Gibbs-Phänomen: Der Überschwinger wird schmaler, aber nicht niedriger. Der Anteil $\\sum|c_n|^2/\\|f\\|^2$ geht trotzdem gegen 100 % – die Konvergenz im Mittel klappt.'}
    ],
    noPic:{q:'Ohne Bild: Die Stufe ist $f = 1$ für $x < L/2$ und $f = 0$ sonst. Wie groß ist $\\|f\\|^2$?', opts:['$L/2$', '$L$', '$1$'], a:0, ex:'$\\int_0^{L/2}1\\,dx = L/2$. Das ist zugleich der Grenzwert von $\\sum_n|c_n|^2$.'}},
  compare:{
    text:'$f(x) = \\sqrt{2/L}\\,\\sin^3(\\pi x/L)$ auf $[0, L]$. Gesucht ist $c_1 = \\langle\\varphi_1|f\\rangle$. Nützlich: $\\int_0^L\\sin^4(\\pi x/L)\\,dx = 3L/8$ und $\\sin^3u = \\frac14(3\\sin u - \\sin 3u)$.',
    ctx:SIN({defs:{'f(x)':'sqrt(2/L) sin(πx/L)^3'}}),
    A:{name:'Integral ausrechnen', model:['⟨φ_1|f⟩ = 2/L ∫_0^L sin(πx/L)^4 dx', '= 2/L · 3L/8', '= 3/4']},
    B:{name:'Umschreiben und ablesen', model:[{l:'f(x) = sqrt(2/L) (3 sin(πx/L) - sin(3πx/L))/4', w:'sin³u = (3 sin u − sin 3u)/4'}, '= 3/4 φ_1(x) - 1/4 φ_3(x)', {l:'⟨φ_1|f⟩ = 3/4', w:'Orthonormalität'}]},
    questions:[
      {q:'Was liefert Weg B zusätzlich?', opts:['alle Koeffizienten: $c_1 = 3/4$, $c_3 = -1/4$, sonst null', 'nur $c_1$, aber ohne das Integral über $\\sin^4$', 'eine Näherung für $c_1$, die nur für große $n$ gilt'], a:0, ex:'Ist $f$ schon als Kombination von Basisfunktionen geschrieben, liest man die Koeffizienten direkt ab – Integrale braucht man dann nicht.'},
      {q:'Wie prüfst du, dass keine Koeffizienten fehlen?', opts:['Parseval: $|c_1|^2 + |c_3|^2 = \\frac{9}{16} + \\frac{1}{16} = \\frac58 = \\|f\\|^2$', 'Man setzt $x = L/2$ ein und vergleicht $f$ mit der Summe.', 'Gar nicht, denn die Reihe ist unendlich lang.'], a:0, ex:'$\\|f\\|^2 = \\frac2L\\int_0^L\\sin^6(\\pi x/L)\\,dx = \\frac2L\\cdot\\frac{5L}{16} = \\frac58$. Stimmt die Summe, ist die Entwicklung vollständig.'}
    ]
  },
  concept:[
    {id:'mh-c1', type:'mc2', seg:'mh-t1', lex:'skalarprodukt',
      q:'Für $f(x) = e^{2\\pi ix/L}/\\sqrt L$ auf $[0, L]$ ist $\\int_0^Lf^2\\,dx = 0$. Was folgt daraus über die Norm von $f$?', opts:['Nichts; die Norm ist $\\sqrt{\\langle f|f\\rangle} = 1$.', 'Die Norm ist null, also ist $f$ die Nullfunktion.', 'Die Norm ist für komplexe $f$ nicht definiert.'], a:0,
      ex:'$|f|^2 = 1/L$, also $\\langle f|f\\rangle = \\int_0^L|f|^2dx = 1$. Das Integral über $f^2$ ist keine Norm; es kann für komplexe Funktionen null oder sogar negativ werden.',
      reason:{q:'Warum?', opts:['Im Skalarprodukt wird $f$ konjugiert; nur so ist $\\langle f|f\\rangle \\ge 0$.', 'Komplexe Funktionen haben grundsätzlich keine Norm.', 'Weil $|f|$ konstant ist, muss auch $\\int f^2dx$ gleich $1$ sein.'], a:0, ex:'$\\langle f|f\\rangle = \\int f^*f\\,dx = \\int|f|^2dx$. Ohne das $^*$ hätte man nur eine Bilinearform, die keine Längen misst.'}},
    {id:'mh-c2', type:'dialog', seg:'mh-t4', lex:'konvergenz-im-mittel',
      text:'Die Sinusreihe von $f = 1$ auf $[0, L]$ ist in $x = 0$ für jedes $N$ null, denn jedes $\\sin(n\\pi\\cdot 0/L)$ verschwindet.',
      people:[{name:'Lena', says:'Dann konvergiert die Reihe nicht gegen $f$. Die Sinusfunktionen sind also nicht vollständig.'}, {name:'Jonas', says:'Vollständigkeit verlangt nur $\\int|f - S_N|^2dx \\to 0$, und das gilt hier. Einzelne Punkte zählen dafür nicht.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Vollständig heißt: Konvergenz im quadratischen Mittel, gleichwertig $\\sum|c_n|^2 = \\|f\\|^2$. Für $f = 1$ ergibt die Summe genau $L$. Punktweise darf die Reihe an einzelnen Stellen abweichen.'},
    {id:'mh-c3', type:'mc2', seg:'mh-t6', lex:'randterme-hermitesch',
      q:'Der Operator $-i\\,d/dx$ ist auf Funktionen mit $f(0) = f(L) = 0$ hermitesch. Gibt es eine Orthonormalbasis aus seinen Eigenfunktionen?', opts:['Nein, er hat überhaupt keine Eigenfunktion.', 'Ja, die Funktionen $\\sqrt{2/L}\\sin(n\\pi x/L)$.', 'Ja, die Funktionen $e^{2\\pi inx/L}/\\sqrt L$.'], a:0,
      ex:'Die Sinusfunktionen sind Eigenfunktionen von $-d^2/dx^2$, aber $-i\\,d/dx$ macht aus einem Sinus einen Kosinus. Die $e^{2\\pi inx/L}$ sind Eigenfunktionen, erfüllen aber $f(0) = 0$ nicht.',
      reason:{q:'Warum?', opts:['Lösungen von $-if\' = kf$ sind $Ce^{ikx}$; $f(0) = 0$ erzwingt $C = 0$.', 'Hermitesche Operatoren auf Funktionen haben nie Eigenfunktionen.', 'Die Eigenwerte müssten imaginär sein, und das verbietet die Hermitezität.'], a:0, ex:'$e^{ikx}$ verschwindet für kein $k$. Hermitesch heißt hier nur symmetrisch; für eine Eigenbasis braucht man die passende Randbedingung, etwa periodisch.'}},
    {id:'mh-c4', type:'dialog', seg:'mh-t5', lex:'randterme-hermitesch',
      text:'Betrachtet werden beliebige glatte Funktionen auf $[0, L]$, ohne Randbedingungen, zum Beispiel $f = 1$ und $g = x$.',
      people:[{name:'Lena', says:'Ob $-i\\,d/dx$ hermitesch ist, hängt von den zugelassenen Funktionen ab. Hier ist $\\langle f|-ig\'\\rangle = -iL$, aber $\\langle -if\'|g\\rangle = 0$.'}, {name:'Jonas', says:'$-i\\,d/dx$ ist immer hermitesch. Das ist eine Eigenschaft des Ausdrucks $-i\\,d/dx$ selbst.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Bei der partiellen Integration bleibt der Randterm $-i[f^*g]_0^L = -iL$ stehen. Erst Randbedingungen wie $f(0) = f(L) = 0$ oder Periodizität lassen ihn verschwinden. Sie gehören zur Definition des Operators.'},
    {id:'mh-c5', type:'mc', seg:'mh-t2', lex:'quadratintegrabel',
      q:'Kann eine normierbare Funktion an einer Stelle unendlich groß werden?', opts:['Ja, zum Beispiel $|x|^{-1/4}$ auf $[-1, 1]$.', 'Nein, normierbare Funktionen sind immer beschränkt.', 'Nein, sonst wäre $\\int|\\psi|^2dx$ unendlich.'], a:0,
      ex:'$\\int_{-1}^1|x|^{-1/2}dx = 4$ ist endlich, obwohl $|x|^{-1/4}$ bei $0$ divergiert. Es kommt darauf an, wie schnell $|f|^2$ wächst: $|x|^{-p}$ ist nahe $0$ integrierbar für $p < 1$.'}
  ],
  practice:[
    {id:'mh-p1', title:'Skalarprodukt und Norm komplexer Funktionen',
      text:'Auf $[-1, 1]$ sind $f(x) = 1 + ix$ und $g(x) = x$ gegeben. In der Eingabe: `⟨f|g⟩` oder das Integral `∫_-1^1 … dx`.',
      ctx:{coords:['x'], domain:{x:['-1', '1']}, params:{}, defs:{'f(x)':'1 + i x', 'g(x)':'x'}, unknowns:{A:{ref:'sqrt(3/8)', alt:['-sqrt(3/8)']}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle f|g\\rangle$.', type:'value', target:'-2i/3', points:2, ph:'⟨f|g⟩ = ∫_-1^1 (1 - i x) x dx',
          hints:['Schreib das Skalarprodukt als Integral, multipliziere aus und integriere Term für Term.', '$\\langle f|g\\rangle = \\int f^*g\\,dx$ mit $f^* = 1 - ix$.', '$\\int_{-1}^1 x\\,dx = 0$ und $\\int_{-1}^1 x^2dx = 2/3$.'],
          model:['⟨f|g⟩ = ∫_-1^1 (1 - i x) x dx', '= ∫_-1^1 (x - i x^2) dx', '= 0 - 2i/3', '= -2i/3'],
          mistakes:[{expr:'2i/3', msg:'Das erste Argument muss konjugiert werden: $f^* = 1 - ix$.'}]},
        {id:'b', prompt:'b) Berechne $\\|f\\|^2 = \\langle f|f\\rangle$.', type:'value', target:'8/3', points:2, ph:'⟨f|f⟩ = ∫_-1^1 |1 + i x|^2 dx',
          hints:['Die Norm braucht $|f|^2 = f^*f$, nicht $f^2$.', '$|1 + ix|^2 = (1 - ix)(1 + ix) = 1 + x^2$.'],
          model:['⟨f|f⟩ = ∫_-1^1 |1 + i x|^2 dx', '= ∫_-1^1 (1 + x^2) dx', '= 2 + 2/3', '= 8/3'],
          mistakes:[{expr:'4/3', msg:'Das ist $\\int f^2dx$ mit $(1 + ix)^2 = 1 + 2ix - x^2$. Für die Norm braucht man $|f|^2 = f^*f = 1 + x^2$.'}]},
        {id:'c', prompt:'c) Bestimme $A > 0$ so, dass $A f$ normiert ist.', type:'solve', unknown:'A', points:2,
          hints:['Normiert heißt $\\langle Af|Af\\rangle = 1$.', '$\\langle Af|Af\\rangle = |A|^2\\langle f|f\\rangle$, und $\\langle f|f\\rangle$ kennst du aus b).'],
          model:['∫_-1^1 |A f(x)|^2 dx = 1', '|A|^2 · 8/3 = 1', 'A = sqrt(3/8)']}
      ]},
    {id:'mh-p2', title:'Entwicklung einer linearen Funktion',
      text:'$f(x) = \\sqrt{3/L^3}\\,x$ auf $[0, L]$ wird nach $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ entwickelt. Aus der Lückenaufgabe weißt du: $\\sqrt{2/L}\\int_0^L x\\sin(n\\pi x/L)\\,dx = (-1)^{n+1}\\sqrt2\\,L^{3/2}/(n\\pi)$.',
      ctx:SIN({defs:{'f(x)':'sqrt(3/L^3) x'}}),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $f$ normiert ist: Berechne $\\langle f|f\\rangle$.', type:'value', target:'1', points:1,
          hints:['Normiert heißt $\\langle f|f\\rangle = 1$; $f$ ist reell, also $|f|^2 = f^2$.', '$\\int_0^Lx^2dx = L^3/3$.'],
          model:['⟨f|f⟩ = 3/L^3 ∫_0^L x^2 dx', '= 3/L^3 · L^3/3', '= 1']},
        {id:'b', prompt:'b) Bestimme $c_n = \\langle\\varphi_n|f\\rangle$.', type:'value', target:'(-1)^(n+1) sqrt(6)/(nπ)', points:2, ph:'c_n = ⟨φ_n|f⟩',
          hints:['$c_n$ ist eine Projektion; der konstante Vorfaktor von $f$ lässt sich herausziehen.', 'Ziehe $\\sqrt{3/L^3}$ vor das Skalarprodukt und benutze das Ergebnis der Lückenaufgabe.', '$\\sqrt{3/L^3}\\cdot\\sqrt2\\,L^{3/2} = \\sqrt6$.'],
          model:['c_n = ⟨φ_n|f⟩', '= sqrt(3/L^3) · (-1)^(n+1) sqrt(2) L^(3/2)/(nπ)', '= (-1)^(n+1) sqrt(6)/(nπ)']},
        {id:'c', prompt:'c) Berechne $|c_1|^2 + |c_2|^2 + |c_3|^2$.', type:'value', target:'49/(6π^2)', points:2, ph:'|⟨φ_1|f⟩|^2 + |⟨φ_2|f⟩|^2 + |⟨φ_3|f⟩|^2 = ',
          hints:['Quadriere die Beträge der Koeffizienten aus b) und addiere.', '$|c_n|^2 = 6/(n^2\\pi^2)$; das Vorzeichen fällt weg.'],
          model:['|⟨φ_1|f⟩|^2 + |⟨φ_2|f⟩|^2 + |⟨φ_3|f⟩|^2 = 6/π^2 (1 + 1/4 + 1/9)', '= 49/(6π^2)'],
          note:'$49/(6\\pi^2) \\approx 0{,}83$: Drei Terme erfassen 83 % der Norm. Die Vollständigkeit verlangt $\\sum_{n=1}^\\infty 6/(n^2\\pi^2) = 1$ – daraus folgt nebenbei $\\sum_{n=1}^\\infty 1/n^2 = \\pi^2/6$.'}
      ]},
    {id:'mh-p3', title:'Welche Ableitungsoperatoren sind hermitesch?',
      text:'$f$ und $g$ sind glatte Funktionen auf $[0, L]$ mit $f(0) = f(L) = 0$ und $g(0) = g(L) = 0$ (wie Wellenfunktionen im Kasten). Auswertungsklammern schreibst du als `[f^* g]_0^L`.',
      ctx:FG(),
      goals:[
        {id:'a', prompt:'a) Zeige $\\int_0^L f^*g\'\\,dx = -\\int_0^L (f^*)\'\\,g\\,dx$. Damit ist $d/dx$ antihermitesch.', type:'show', from:'∫_0^L f^* g\' dx', to:'-∫_0^L (f^*)\' g dx', points:2,
          hints:['Welche Rechenregel verschiebt eine Ableitung von $g$ auf $f^*$?', 'Partielle Integration mit $u = f^*$ und $v\' = g\'$.', 'Der Randterm $[f^*g]_0^L$ ist null, weil beide Funktionen am Rand verschwinden.'],
          model:['∫_0^L f^* g\' dx = [f^* g]_0^L - ∫_0^L (f^*)\' g dx', {l:'= -∫_0^L (f^*)\' g dx', w:'f(0) = f(L) = 0'}]},
        {id:'b', prompt:'b) Zeige, dass $-i\\,d/dx$ hermitesch ist: $\\int_0^L f^*(-ig\')\\,dx = \\int_0^L(-if\')^*g\\,dx$.', type:'show', from:'∫_0^L f^* (-i g\') dx', to:'∫_0^L (-i f\')^* g dx', points:2,
          hints:['Ziehe $-i$ vor das Integral und benutze a).', '$(-if\')^* = i(f^*)\'$.'],
          model:['∫_0^L f^* (-i g\') dx = -i ∫_0^L f^* g\' dx', {l:'= i ∫_0^L (f^*)\' g dx', w:'Teil a)'}, '= ∫_0^L (-i f\')^* g dx'],
          note:'Das $i$ macht aus dem antihermiteschen $d/dx$ einen hermiteschen Operator. Mit $\\hbar$ davor ist das der Impuls $\\hat p = -i\\hbar\\,d/dx$ (Thema 6). Hermitesch heißt aber nicht automatisch, dass es eine Eigenbasis gibt: Mit $f(0) = f(L) = 0$ hat $-i\\,d/dx$ im Kasten gar keine Eigenfunktionen, denn $e^{ikx}$ verschwindet nirgends.'},
        {id:'c', prompt:'c) Zeige $\\int_0^L f^*g\'\'\\,dx = \\int_0^L (f^*)\'\'\\,g\\,dx$. Damit ist $d^2/dx^2$ hermitesch.', type:'show', from:'∫_0^L f^* g\'\' dx', to:'∫_0^L (f^*)\'\' g dx', points:3,
          hints:['Zweimal partiell integrieren.', 'Beim ersten Mal verschwindet $[f^*g\']_0^L$ wegen $f = 0$ am Rand, beim zweiten Mal $[(f^*)\'g]_0^L$ wegen $g = 0$ am Rand.'],
          model:['∫_0^L f^* g\'\' dx = [f^* g\']_0^L - ∫_0^L (f^*)\' g\' dx', {l:'= -∫_0^L (f^*)\' g\' dx', w:'f(0) = f(L) = 0'}, '= -[(f^*)\' g]_0^L + ∫_0^L (f^*)\'\' g dx', {l:'= ∫_0^L (f^*)\'\' g dx', w:'g(0) = g(L) = 0'}],
          note:'Also ist auch der Hamiltonoperator des Kastens, $-\\frac{\\hbar^2}{2m}\\frac{d^2}{dx^2}$, hermitesch – deshalb sind seine Eigenwerte reell und die $\\varphi_n$ orthogonal.'}
      ]},
    {id:'mh-p4', title:'Eigenfunktionen auf einem Ring',
      text:'Auf einem Ring ist $x \\in [0, 2\\pi]$ periodisch. Die Funktionen $\\varphi_q(x) = e^{iqx}/\\sqrt{2\\pi}$ mit ganzem $q$ bilden dort ein vollständiges Orthonormalsystem. In den Aufgaben sind $n \\ne j$ ganze Zahlen.',
      ctx:{coords:['x'], domain:{x:['0', '2π']}, params:{n:{int:[-3, 3]}, j:{int:[-3, 3], ne:'n'}}, defs:{'φ_q(x)':'e^(i q x)/sqrt(2π)', 'f(x)':'cos(x)^2'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle\\varphi_j|\\varphi_n\\rangle$ für $j \\ne n$.', type:'value', target:'0', points:2, ph:'⟨φ_j|φ_n⟩ = 1/(2π) ∫_0^{2π} e^(i(n - j)x) dx',
          hints:['Schreib das Skalarprodukt als Integral; im ersten Argument wird konjugiert.', '$\\varphi_j^* = e^{-ijx}/\\sqrt{2\\pi}$, die Exponenten addieren sich zu $i(n - j)x$.', '$e^{2\\pi i m} = 1$ für jede ganze Zahl $m$.'],
          model:['⟨φ_j|φ_n⟩ = 1/(2π) ∫_0^{2π} e^(i(n - j)x) dx', '= 1/(2π) [e^(i(n - j)x)/(i(n - j))]_0^{2π}', '= 0']},
        {id:'b', prompt:'b) Zeige, dass $\\varphi_n$ Eigenfunktion von $-i\\,d/dx$ zum Eigenwert $n$ ist.', type:'show', from:'-i d/dx φ_n(x)', to:'n φ_n(x)', points:2,
          hints:['Leite $\\varphi_n$ nach $x$ ab und multipliziere mit $-i$.', '$\\frac{d}{dx}e^{inx} = in\\,e^{inx}$ und $-i\\cdot i = 1$.'],
          model:['-i d/dx φ_n(x) = -i · i n e^(i n x)/sqrt(2π)', '= n φ_n(x)'],
          note:'Die Periodizität verlangt $e^{iq\\cdot 2\\pi} = 1$, also ganzes $q$: Die Randbedingung macht das Spektrum diskret. Mit $\\hbar$ ist das der Drehimpuls $L_z = -i\\hbar\\,\\partial_\\varphi$ (Thema 8).'},
        {id:'c', prompt:'c) Bestimme den Koeffizienten $c_2 = \\langle\\varphi_2|f\\rangle$ von $f(x) = \\cos^2 x$.', type:'value', target:'sqrt(π/8)', points:3, ph:'⟨φ_2|f⟩ = 1/sqrt(2π) ∫_0^{2π} e^(-2ix) cos(x)^2 dx',
          hints:['Schreib $\\cos^2x$ als Summe von Exponentialfunktionen; dann erledigt die Orthogonalität den Rest.', '$\\cos x = \\frac12(e^{ix} + e^{-ix})$, also $\\cos^2x = \\frac12 + \\frac14e^{2ix} + \\frac14e^{-2ix}$.', 'Nur der Term $\\frac14e^{2ix}$ überlebt das Integral, und zwar mit $2\\pi\\cdot\\frac14$.'],
          model:['⟨φ_2|f⟩ = 1/sqrt(2π) ∫_0^{2π} e^(-2ix) cos(x)^2 dx', {l:'= 1/sqrt(2π) ∫_0^{2π} e^(-2ix) (1/2 + e^(2ix)/4 + e^(-2ix)/4) dx', w:'Euler-Formel'}, '= 1/sqrt(2π) · 2π/4', '= sqrt(π/8)'],
          mistakes:[{expr:'1/4', msg:'Das ist der Koeffizient vor $e^{2ix}$. Bezüglich der normierten $\\varphi_2 = e^{2ix}/\\sqrt{2\\pi}$ kommt noch der Faktor $\\sqrt{2\\pi}$ hinzu.'}],
          note:'Das ist schon eine komplexe Fourier-Reihe (M6).'}
      ]}
  ],
  sketch:[
    {id:'mh-s1', kind:'curve', draw:'f', title:'Der Rest steht senkrecht',
      text:'Für $f = 1$ auf $[0, L]$ ist $S_1 = c_1\\varphi_1 = \\frac{4}{\\pi}\\sin(\\pi x/L)$ die beste Näherung mit einem Term (Labor). Skizziere den Rest $r = f - S_1$ auf $[0, L]$. Die Skala der $y$-Achse ist frei.',
      plot:{x:[0, 1], xlab:'x', ylab:'r(x)', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}]},
      // r = 1 − (4/π) sin(πx/L): r(0) = r(L) = 1, r(L/2) = 1 − 4/π ≈ −0,27, Nullstellen bei sin(πx/L) = π/4, also x ≈ 0,288 L und 0,712 L
      f:x => 1 - 4 / Math.PI * Math.sin(Math.PI * x),
      checks:[
        {id:'knoten', type:'nodes', n:2, msg:'Der Rest steht senkrecht auf $\\varphi_1$: $\\int_0^L\\varphi_1\\,r\\,dx = 0$. Kann das gelten, wenn $r$ überall dasselbe Vorzeichen hat, obwohl $\\varphi_1 > 0$ ist? Deine Skizze hat {got} Vorzeichenwechsel. (Abschnitt „Orthonormalsysteme und Komponenten“)'},
        {id:'sym', type:'parity', p:'even', about:0.5, msg:'$f$ und $S_1$ sind symmetrisch zur Mitte. Was gilt dann für ihre Differenz?'},
        {id:'rand', type:'amp', a:[0, 0.08], b:[0.35, 0.65], cmp:'>', msg:'Welchen Wert hat $S_1$ am Rand, und welchen hat $r$ dort folglich? Vergleiche mit der Mitte.'},
        {id:'mitte', type:'sign', s:-1, range:[0.4, 0.6], msg:'Ist $S_1$ in der Mitte größer oder kleiner als $f = 1$? Welches Vorzeichen hat $r$ dort?'}
      ],
      reveal:'$r = 1 - \\frac{4}{\\pi}\\sin(\\pi x/L)$ ist am Rand gleich $1$, weil $S_1$ dort null ist, und in der Mitte $1 - 4/\\pi \\approx -0{,}27$. Dazwischen wechselt $r$ zweimal das Vorzeichen. Das muss so sein: Der Rest steht senkrecht auf $\\varphi_1$, und weil $\\varphi_1$ im Inneren positiv ist, müssen sich positive und negative Beiträge von $\\varphi_1 r$ im Integral aufheben. Ohne Vorzeichenwechsel wäre $\\langle\\varphi_1|r\\rangle \\neq 0$, und $S_1$ wäre nicht die beste Näherung.',
      hints:['Zeichne erst $f = 1$ und $S_1$ übereinander, dann ihre Differenz: Wo liegt $S_1$ unter, wo über der Geraden?', 'Orthogonal heißt $\\int_0^L\\varphi_1\\,r\\,dx = 0$. Für ein positives $\\varphi_1$ geht das nur, wenn $r$ positive und negative Teile hat.'],
      wrong:[
        {f:x => 1 - Math.sin(Math.PI * x), fails:['knoten'], why:'Koeffizient 1 statt 4/π: Rest ohne Vorzeichenwechsel'},
        {f:x => 1 - 2 / Math.PI * Math.sin(Math.PI * x), fails:['knoten', 'mitte'], why:'mit dem nicht normierten sin(πx/L) gerechnet: Rest überall positiv'},
        {f:x => Math.sin(3 * Math.PI * x), fails:['rand'], why:'Rest nur als nächster Term c₃φ₃ gezeichnet, der am Rand verschwindet'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'mh-f5', title:'Unbeschränkt, aber normierbar?', text:'$f(x) = x^{-1/3}$ auf $(0, 1]$. Die Funktion wird für $x \\to 0$ unendlich groß. In der Eingabe heißt sie `f(x)`.',
      ctx:{coords:['x'], domain:{x:['0', '1']}, params:{}, defs:{'f(x)':'x^(-1/3)'}, unknowns:{N:{ref:'1/sqrt(3)', alt:['-1/sqrt(3)']}}},
      goals:[
        {id:'a', prompt:'a) Ist $f$ quadratintegrabel? Berechne dazu $\\|f\\|^2 = \\int_0^1|f|^2dx$.', type:'value', target:'3', points:2, ph:'⟨f|f⟩ = ',
          model:['⟨f|f⟩ = ∫_0^1 x^(-2/3) dx', '= [3 x^(1/3)]_0^1', '= 3'],
          mistakes:[{expr:'3/2', msg:'Das ist $\\int_0^1 f\\,dx$. Für die Norm zählt $\\int_0^1|f|^2dx = \\int_0^1x^{-2/3}dx$.'}]},
        {id:'b', prompt:'b) Bestimme $N > 0$ so, dass $Nf$ normiert ist.', type:'solve', unknown:'N', points:1,
          model:['∫_0^1 |N f(x)|^2 dx = 1', 'N^2 · 3 = 1', 'N = 1/sqrt(3)']}
      ]}},
    {aim:1, task:{id:'mh-f1', title:'Norm einer Überlagerung', text:'$f(x) = \\sqrt{2/L}\\left(\\sin(\\pi x/L) + 2\\sin(3\\pi x/L)\\right)$ auf $[0, L]$.',
      ctx:SIN({defs:{'f(x)':'sqrt(2/L) (sin(πx/L) + 2 sin(3πx/L))'}}),
      goals:[{id:'a', prompt:'Berechne $\\|f\\|^2 = \\langle f|f\\rangle$.', type:'value', target:'5', points:2, model:[{l:'⟨f|f⟩ = |1|^2 + |2|^2', w:'f = φ₁ + 2φ₃, Mischterme fallen weg'}, '= 5'],
        mistakes:[{expr:'3', msg:'Die Koeffizienten werden quadriert: $\\|f\\|^2 = |c_1|^2 + |c_3|^2$, nicht $c_1 + c_3$.'}]}]}},
    {aim:2, q:'Auf $[0, L]$ mit $f(0) = f(L) = 0$: Warum ist $-i\\,d/dx$ hermitesch, $d/dx$ aber nicht?', opts:['Partielle Integration gibt ein Minus; $(-i)^* = i$ gleicht es aus.', 'Weil $d/dx$ reelle Funktionen auf reelle abbildet, $-i\\,d/dx$ nicht.', 'Weil bei $-i\\,d/dx$ die Randterme wegfallen, bei $d/dx$ nicht.'], a:0, ex:'$\\langle f|g\'\\rangle = -\\langle f\'|g\\rangle$, aber $\\langle f|-ig\'\\rangle = i\\langle f\'|g\\rangle = \\langle -if\'|g\\rangle$. Die Randterme sind in beiden Fällen dieselben und hier null.'},
    {aim:'k', id:'mh-fk1', type:'mc', lex:'orthonormal',
      q:'Zwei normierte Funktionen $f$ und $g$ sind orthogonal. Was ist $\\|f + e^{i\\alpha}g\\|^2$ für reelles $\\alpha$?', opts:['$2$, für jedes $\\alpha$', '$2 + 2\\cos\\alpha$', '$4$', '$0$ für $\\alpha = \\pi$'], a:0,
      ex:'$\\|f + e^{i\\alpha}g\\|^2 = \\|f\\|^2 + \\|g\\|^2 + e^{i\\alpha}\\langle f|g\\rangle + e^{-i\\alpha}\\langle g|f\\rangle = 1 + 1 + 0$. Interferenz $2 + 2\\cos\\alpha$ gäbe es für $g = f$.'},
    {aim:'k', id:'mh-fk5', type:'mc2', lex:'vollstaendigkeit',
      q:'Die Funktionen $\\varphi_1, \\varphi_3, \\varphi_5, \\dots$ (nur ungerade $n$) aus $\\varphi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$ sind orthonormal. Für $f = 1$ auf $[0, L]$ gilt mit ihnen schon $\\sum_n|c_n|^2 = \\|f\\|^2$. Ist dieses Teilsystem vollständig?', opts:['Nein.', 'Ja, Parseval ist ja erfüllt.', 'Ja, es sind unendlich viele Funktionen.'], a:0,
      ex:'Vollständig heißt: Parseval gilt für **jedes** $f \\in L^2$. Für $f = 1$ fehlt nichts, weil die geraden Koeffizienten ohnehin null sind (Symmetrie um $L/2$). Für $f = \\varphi_2$ sind dagegen alle Koeffizienten null.',
      reason:{q:'Warum?', opts:['Parseval muss für jedes $f$ gelten; für $f = \\varphi_2$ ist $\\sum|c_n|^2 = 0 \\ne 1$.', 'Parseval gilt nur für Systeme mit endlich vielen Funktionen.', 'Ein vollständiges System muss auch die Konstante enthalten.'], a:0, ex:'$\\varphi_2$ steht auf allen $\\varphi_n$ mit ungeradem $n$ senkrecht. Ein einziges $f$, für das Parseval gilt, beweist also nichts. Eine einzige Funktion, für die es scheitert, widerlegt die Vollständigkeit.'}}
  ],
  finalB:[
    {aim:0, task:{id:'mh-g5', title:'Unbeschränkt, aber normierbar?', text:'$f(x) = x^{-3/8}$ auf $(0, 1]$. Die Funktion wird für $x \\to 0$ unendlich groß. In der Eingabe heißt sie `f(x)`.',
      ctx:{coords:['x'], domain:{x:['0', '1']}, params:{}, defs:{'f(x)':'x^(-3/8)'}, unknowns:{N:{ref:'1/2', alt:['-1/2']}}},
      goals:[
        {id:'a', prompt:'a) Ist $f$ quadratintegrabel? Berechne dazu $\\|f\\|^2 = \\int_0^1|f|^2dx$.', type:'value', target:'4', points:2, ph:'⟨f|f⟩ = ',
          model:['⟨f|f⟩ = ∫_0^1 x^(-3/4) dx', '= [4 x^(1/4)]_0^1', '= 4'],
          mistakes:[{expr:'8/5', msg:'Das ist $\\int_0^1 f\\,dx$. Für die Norm zählt $\\int_0^1|f|^2dx = \\int_0^1x^{-3/4}dx$.'}]},
        {id:'b', prompt:'b) Bestimme $N > 0$ so, dass $Nf$ normiert ist.', type:'solve', unknown:'N', points:1,
          model:['∫_0^1 |N f(x)|^2 dx = 1', 'N^2 · 4 = 1', 'N = 1/2']}
      ]}},
    {aim:1, task:{id:'mh-f4', title:'Norm einer komplexen Überlagerung', text:'$f(x) = \\sqrt{2/L}\\left(\\sin(2\\pi x/L) + 3i\\sin(4\\pi x/L)\\right)$ auf $[0, L]$.',
      ctx:SIN({defs:{'f(x)':'sqrt(2/L) (sin(2πx/L) + 3i sin(4πx/L))'}}),
      goals:[{id:'a', prompt:'Berechne $\\|f\\|^2 = \\langle f|f\\rangle$.', type:'value', target:'10', points:2, model:[{l:'⟨f|f⟩ = |1|^2 + |3i|^2', w:'f = φ₂ + 3iφ₄, Mischterme fallen weg'}, '= 10'],
        mistakes:[{expr:'-8', msg:'$|3i|^2 = 9$, nicht $(3i)^2 = -9$: Für die Norm zählt das Betragsquadrat.'}]}]}},
    {aim:2, q:'Auf dem Ring (periodische Funktionen auf $[0, 2\\pi]$): Ist $-d^2/dx^2$ hermitesch?', opts:['Ja, bei beiden partiellen Integrationen heben sich die Randterme weg.', 'Nein, denn ohne $f(0) = 0$ bleiben Randterme stehen.', 'Nein, zweite Ableitungen sind nie hermitesch.', 'Nur für reelle Funktionen, sonst stört die Konjugation.'], a:0, ex:'$[f^*g\']_0^{2\\pi}$ und $[(f^*)\'g]_0^{2\\pi}$ verschwinden, weil die Funktionen und ihre Ableitungen periodisch sind. Null am Rand müssen sie dafür nicht sein.'},
    {aim:'k', id:'mh-gk1', type:'mc', lex:'orthonormal',
      q:'Zwei normierte Funktionen $f$ und $g$ sind orthogonal. Was ist $\\langle f + g|f - g\\rangle$?', opts:['$0$', '$2$', '$1$', 'Das hängt von der Phase zwischen $f$ und $g$ ab.'], a:0,
      ex:'$\\langle f + g|f - g\\rangle = \\|f\\|^2 - \\langle f|g\\rangle + \\langle g|f\\rangle - \\|g\\|^2 = 1 - 0 + 0 - 1 = 0$. Die Mischterme fallen wegen der Orthogonalität weg, für jede Phase. Wegen $\\|f \\pm g\\|^2 = 2$ bilden $(f \\pm g)/\\sqrt2$ wieder ein Orthonormalpaar – wie die Diagonalen eines Quadrats.'},
    {aim:'k', id:'mh-fk3', type:'mc2', lex:'bessel-ungleichung',
      q:'Du hast für ein normiertes $f$ die Koeffizienten bezüglich eines Orthonormalsystems berechnet und findest $\\sum_n|c_n|^2 = 1{,}2$. Was folgt?', opts:['Mindestens ein Koeffizient ist falsch.', 'Das System ist unvollständig.', 'Bei unendlich vielen Termen ist das normal.'], a:0,
      ex:'$\\|f - S_N\\|^2 = \\|f\\|^2 - \\sum_{n\\le N}|c_n|^2 \\ge 0$ für jedes $N$. Eine Summe über $1$ ist also unmöglich. Ein unvollständiges System gäbe eine Summe *unter* $1$.',
      reason:{q:'Warum?', opts:['Für jedes Orthonormalsystem gilt $\\sum|c_n|^2 \\le \\|f\\|^2$ (Bessel).', 'Bei unvollständigen Systemen ist die Summe größer als die Norm.', 'Unendliche Summen dürfen die Norm überschreiten.'], a:0, ex:'Die Besselsche Ungleichung gilt für jedes Orthonormalsystem, vollständig oder nicht. Vollständigkeit macht daraus eine Gleichung.'}}
  ],
  errors:[
    {id:'mh-e1', title:'Norm ohne Betragsquadrat',
      text:'Ist $f(x) = e^{i\\pi x/L}/\\sqrt L$ auf $[0, L]$ normiert? So wurde gerechnet:',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos'}, defs:{'f(x)':'e^(iπx/L)/sqrt(L)'}},
      lines:['⟨f|f⟩ = 1/L ∫_0^L e^(2iπx/L) dx', '= 1/L [L e^(2iπx/L)/(2iπ)]_0^L', '= 0'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['Es wurde $f^2$ statt $|f|^2 = f^*f$ integriert.', 'Die Grenzen müssen $-L$ bis $L$ sein.', 'Der Faktor $1/L$ gehört nicht davor.'], a:0, ex:'$|e^{i\\pi x/L}|^2 = 1$. Eine Norm kann nie null sein, außer für $f = 0$ – das Ergebnis hätte stutzig machen müssen.'},
      fix:{id:'a', prompt:'Berichtige: Berechne $\\langle f|f\\rangle$.', type:'value', target:'1', model:['⟨f|f⟩ = 1/L ∫_0^L |e^(iπx/L)|^2 dx', '= 1/L ∫_0^L 1 dx', '= 1']}},
    {id:'mh-e2', title:'Koeffizient ohne Normierungsfaktor',
      text:'$f(x) = \\sin(\\pi x/L)$ auf $[0, L]$ soll nach $\\varphi_n(x) = \\sqrt{2/L}\\sin(n\\pi x/L)$ entwickelt werden. Für $c_1$ wurde gerechnet:',
      ctx:SIN({defs:{'f(x)':'sin(πx/L)'}}),
      lines:['⟨φ_1|f⟩ = ∫_0^L sin(πx/L)^2 dx', '= L/2'],
      wrong:0,
      why:{q:'Was ist falsch?', opts:['Der Faktor $\\sqrt{2/L}$ aus $\\varphi_1$ fehlt.', 'Es müsste $\\cos$ statt $\\sin$ stehen.', 'Das Integral ist $L$, nicht $L/2$.'], a:0, ex:'$c_1 = \\langle\\varphi_1|f\\rangle = \\sqrt{2/L}\\cdot L/2 = \\sqrt{L/2}$. Kontrolle mit Parseval: $|c_1|^2 = L/2 = \\|f\\|^2$ ✓, während $(L/2)^2$ nicht passt.'},
      fix:{id:'a', prompt:'Berichtige: Bestimme $c_1$.', type:'value', target:'sqrt(L/2)', model:['⟨φ_1|f⟩ = sqrt(2/L) ∫_0^L sin(πx/L)^2 dx', '= sqrt(2/L) · L/2', '= sqrt(L/2)']}}
  ]
});
lexe('hilbertraum', 'Hilbertraum', 'Vektorraum mit Skalarprodukt, in dem jede Cauchy-Folge konvergiert (vollständig). Nicht verwechseln: Ein *vollständiges Orthonormalsystem* ist eines, nach dem sich jedes Element entwickeln lässt. In der QM: $L^2$, der Raum der quadratintegrablen Funktionen mit $\\langle f|g\\rangle = \\int f^*g\\,dx$ (Funktionen, die sich nur in einzelnen Punkten unterscheiden, gelten dabei als gleich), oder der $\\mathbb C^n$ für Spin und andere endliche Systeme. Zustände sind normierte Vektoren, Messgrößen hermitesche Operatoren.', {topic:'m-hilbert'});
lexe('quadratintegrabel', 'Quadratintegrabel ($L^2$)', '$f$ heißt quadratintegrabel, wenn $\\|f\\|^2 = \\int|f|^2dx < \\infty$. Genau diese Funktionen lassen sich normieren. Beispiele auf $\\mathbb R$: $e^{-x^2}$, $1/(1+x^2)$ ja; $e^{ikx}$, $1$, $1/\\sqrt{1+|x|}$ nein. Entscheidend ist das Integral über $|f|^2$, nicht über $f$.', {topic:'m-hilbert'});
lexe('vollstaendigkeit', 'Vollständigkeit und Parseval-Gleichung', 'Ein Orthonormalsystem $\\{\\varphi_n\\}$ ist vollständig, wenn sich jedes $f$ als $f = \\sum_n c_n\\varphi_n$ mit $c_n = \\langle\\varphi_n|f\\rangle$ schreiben lässt (Konvergenz im Mittel). Gleichwertig: $\\sum_n|c_n|^2 = \\|f\\|^2$ für alle $f$ (Parseval) oder $\\sum_n\\varphi_n(x)\\varphi_n^*(x\') = \\delta(x - x\')$. In Dirac-Notation: $\\sum_n|n\\rangle\\langle n| = \\mathbb 1$.', {topic:'m-hilbert'});
lexe('randterme-hermitesch', 'Hermitesche Differentialoperatoren und Randterme', 'Ob ein Differentialoperator hermitesch ist, entscheidet die partielle Integration samt Randtermen: $\\langle f|g\'\\rangle = [f^*g] - \\langle f\'|g\\rangle$. Verschwinden die Randterme (Funktionen null am Rand, im Unendlichen abfallend oder periodisch), dann ist $d/dx$ antihermitesch, $-i\\,d/dx$ und $-d^2/dx^2$ sind hermitesch. Die Randbedingungen gehören also zur Definition des Operators.', {topic:'m-hilbert'});
lexe('konvergenz-im-mittel', 'Konvergenz im Mittel', 'Eine Folge $S_N$ konvergiert im (quadratischen) Mittel gegen $f$, wenn $\\int|f - S_N|^2dx \\to 0$. Das ist die Konvergenz im Hilbertraum $L^2$. Sie erlaubt Abweichungen an einzelnen Punkten: Die Sinusreihe von $f = 1$ auf $[0, L]$ ist in $x = 0$ stets null und konvergiert trotzdem im Mittel. Punktweise oder gleichmäßige Konvergenz sind stärkere Forderungen (Gibbs-Phänomen).', {topic:'m-hilbert'});
lexe('bessel-ungleichung', 'Besselsche Ungleichung', 'Für jedes Orthonormalsystem $\\{\\varphi_n\\}$ und $c_n = \\langle\\varphi_n|f\\rangle$ gilt $\\sum_n|c_n|^2 \\le \\|f\\|^2$, genauer $\\|f - S_N\\|^2 = \\|f\\|^2 - \\sum_{n\\le N}|c_n|^2$. Die Teilsumme $S_N = \\sum_{n\\le N}c_n\\varphi_n$ ist die beste Näherung von $f$ durch die ersten $N$ Basisfunktionen. Gleichheit für alle $f$ (Parseval) gilt genau dann, wenn das System vollständig ist. Rechentest: Ist $\\sum|c_n|^2 > \\|f\\|^2$, ist ein Koeffizient falsch.', {topic:'m-hilbert'});
lexe('uneigentliche-eigenfunktion', 'Uneigentliche Eigenfunktionen', 'Lösungen einer Eigenwertgleichung, die nicht normierbar sind, etwa $e^{ikx}$ für $-i\\,d/dx$ auf $\\mathbb R$ oder $\\delta(x - x_0)$ für $\\hat x$. Sie gehören zu einem kontinuierlichen Spektrum und werden auf eine δ-Funktion normiert: $\\int e^{-ik\'x}e^{ikx}dx = 2\\pi\\,\\delta(k - k\')$. Entwickelt wird mit einem Integral statt einer Summe (Fourier-Transformation). Physikalische Zustände sind normierbare Überlagerungen davon, etwa Wellenpakete.', {topic:'m-hilbert'});
})();
