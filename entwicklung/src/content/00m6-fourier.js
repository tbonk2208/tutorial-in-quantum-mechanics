/* ===== Mathe M6: Fourier-Reihen und Fourier-Transformation ===== */
(function(){
const R = String.raw;
/* Graphen im Erklärteil: Teilsumme der Rechteckfunktion und Spektrum des Kastens der Breite 2 */
const SQW = (x, N) => { let s = 0; for (let n = 1; n <= N; n += 2) s += 4 / (Math.PI * n) * Math.sin(n * x); return s; };
const BOXFT = k => Math.abs(k) < 1e-9 ? 2 / Math.sqrt(2 * Math.PI) : 2 * Math.sin(k) / (k * Math.sqrt(2 * Math.PI));
const PER = (defs, extra) => Object.assign({coords:['x'], params:{n:{int:[1, 6]}}, defs:defs || {}}, extra || {});
topic({
  id:'m-fourier', ch:'math', title:'Fourier-Reihen und Fourier-Transformation', short:'Fourier',
  src:'Boas (3. Aufl.) Kap. 7 · Griffiths & Schroeter (3. Aufl.) Kap. 2.4',
  goals:[
    'Ich kann die Fourier-Koeffizienten einer periodischen Funktion berechnen, gerade und ungerade Funktionen ausnutzen und die Parseval-Gleichung anwenden.',
    'Ich kann Fourier-Transformierte in der Konvention $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$ berechnen, besonders für Gauß- und Kastenfunktionen.',
    'Ich kann die Regeln Verschiebung ↔ Phase und Ableitung ↔ $ik$ anwenden und die Breitenbeziehung $\\Delta x\\,\\Delta k \\ge \\frac12$ deuten.'
  ],
  needs:'Euler-Formel und komplexe Exponentialfunktion (M1) · Gauß-Integrale mit quadratischer Ergänzung (M2) · Entwicklung nach Orthonormalsystemen (M5)',
  check:[
    {q:'Ist $f(x) = x^2\\cos x$ gerade, ungerade oder keins von beiden?', opts:['gerade', 'ungerade', 'keins von beiden'], a:0, ex:'$x^2$ und $\\cos x$ sind gerade, ihr Produkt also auch: $f(-x) = f(x)$.', lex:'fourier-reihe'},
    {q:'$e^{i\\pi}$ ist …', opts:['$-1$', '$1$', '$i$'], a:0, ex:'$\\cos\\pi + i\\sin\\pi = -1$. Allgemein $e^{in\\pi} = (-1)^n$.', lex:'euler', prev:'m-komplex', seg:'mk-t2'},
    {q:'$\\int_{-\\infty}^\\infty e^{-x^2/2}\\,dx$ ist …', opts:['$\\sqrt{2\\pi}$', '$\\sqrt{\\pi}$', '$2\\pi$'], a:0, ex:'$\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/2$.', lex:'integrale', prev:'m-analysis', seg:'ma-t3'},
    {q:'Für ganze Zahlen $m \\ne n$ ist $\\int_{-\\pi}^\\pi e^{-imx}e^{inx}\\,dx$ gleich …', opts:['$0$', '$2\\pi$', '$1$'], a:0, ex:'$\\int_{-\\pi}^\\pi e^{i(n-m)x}dx = 0$ für $n \\ne m$: Die $e^{inx}$ sind orthogonal. Für $n = m$ kommt $2\\pi$ heraus.', lex:'vollstaendigkeit', prev:'m-hilbert', seg:'mh-t3'}
  ],
  wozu:'Jede Spektralanalyse – vom Prisma bis zum Spektrumanalysator – zerlegt ein Signal in Frequenzen. In der Quantenmechanik ist die Fourier-Transformation der Übergang vom Ort zum Impuls: $|\\varphi(k)|^2$ ist die Verteilung der Wellenzahl, und aus der Breitenbeziehung $\\Delta x\\,\\Delta k \\ge \\frac12$ wird die Unschärferelation. Auch das Beugungsbild einer Blende in großem Abstand ist die Fourier-Transformierte der Blendenöffnung.',
  bridge:'Die Fourier-Reihe ist die Entwicklung nach dem Orthonormalsystem $e^{inx}/\\sqrt{2\\pi}$ des Rings aus M5; Parseval und Konvergenz im Mittel kennst du von dort. Aus M1 brauchst du $e^{i\\varphi}$, aus M2 Gauß-Integrale und die δ-Distribution. Die Transformation kehrt in Thema 4 (Wellenpakete), Thema 6 (Impulsdarstellung) und Thema 7 (Oszillator) wieder.',
  diag:[
    {q:'Wie beginnst du, um die Fourier-Koeffizienten von $f(x) = x^3$ auf $(-\\pi, \\pi)$ zu bestimmen?', opts:['Ich stelle fest, dass $f$ ungerade ist; dann treten nur $b_n$ auf.', 'Ich entwickle $x^3$ zuerst in eine Taylor-Reihe um $x = 0$.', 'Ich setze $x = n$ in $f$ ein und erhalte $n^3$.', 'Das weiß ich noch nicht.'], a:0, ex:'Erst die Symmetrie: $x^3\\cos nx$ ist ungerade, also $a_n = 0$. Dann $b_n = \\frac2\\pi\\int_0^\\pi x^3\\sin nx\\,dx$ mit mehrfacher partieller Integration. Die Taylor-Reihe hilft hier nicht; sie ist schon $x^3$.'},
    {q:'Wie beginnst du, um die Fourier-Transformierte von $e^{-x^2/2}\\,e^{ik_0x}$ zu bestimmen?', opts:['Ich nutze die Transformierte von $e^{-x^2/2}$ und die Regel „Phase im Ort ergibt Verschiebung in $k$“.', 'Ich transformiere beide Faktoren einzeln und multipliziere die beiden Ergebnisse miteinander.', 'Ich setze $k = k_0$ in die Transformierte von $e^{-x^2/2}$ ein.', 'Das weiß ich noch nicht.'], a:0, ex:'$e^{-x^2/2} \\mapsto e^{-k^2/2}$, und $e^{ik_0x}\\psi(x) \\mapsto \\varphi(k - k_0)$. Ergebnis: $e^{-(k - k_0)^2/2}$. Die Transformierte eines Produkts ist nicht das Produkt der Transformierten.'}
  ],
  phenomenon:{
    title:'Rechteck durch den Tiefpass',
    text:'Ein Funktionsgenerator erzeugt eine Rechteckspannung, die zwischen $-1\\,$V und $+1\\,$V springt. Ein idealer Tiefpass lässt nur die Grundschwingung und die Oberschwingungen bis zur $N$-ten Harmonischen durch. Ein Oszilloskop zeigt das Ergebnis.\n\nWas siehst du kurz nach jeder Flanke, wenn du die Grenze $N$ immer weiter erhöhst?',
    q:{q:'Deine Vorhersage:', opts:['Ein Überschwingen bis etwa $1{,}18\\,$V, das schmaler, aber nicht niedriger wird.', 'Ein Überschwingen, das mit wachsendem $N$ kleiner wird und verschwindet.', 'Kein Überschwingen: Die Spannung nähert sich $1\\,$V von unten.', 'Ein Überschwingen, das mit wachsendem $N$ immer höher wird.'], a:0,
      ex:'Das ist das Gibbs-Phänomen. Der Überschwinger beträgt etwa 9 % der Sprunghöhe von $2\\,$V, also rund $0{,}18\\,$V.',
      fb:['Richtig. Das Überschwingen heißt Gibbs-Phänomen: Seine Höhe strebt gegen etwa 9 % der Sprunghöhe. Mit wachsendem $N$ rückt es nur näher an die Flanke.', 'Das wäre zu erwarten, wenn die Reihe überall gleichmäßig konvergierte. An einem Sprung tut sie das nicht: Der Überschwinger wird schmaler, seine Höhe bleibt.', 'Für kleine $N$ sieht es manchmal so aus. Ab wenigen Harmonischen schwingt die Teilsumme aber über $1\\,$V hinaus, und das bleibt so.', 'Die Höhe wächst nicht unbegrenzt. Das Maximum von $S_N$ nähert sich einem festen Wert: $\\frac2\\pi\\operatorname{Si}(\\pi) \\approx 1{,}18\\,$V mit dem Integralsinus $\\operatorname{Si}(\\pi) = \\int_0^\\pi\\frac{\\sin t}{t}dt \\approx 1{,}852$ (Wilbraham-Gibbs-Konstante).']},
    reveal:'Ein idealer Tiefpass schneidet die Fourier-Reihe nach der $N$-ten Harmonischen ab. Er liefert also die Teilsumme\n\n$$S_N(x) = \\frac4\\pi\\sum_{n\\ \\text{ungerade}}^{N}\\frac{\\sin nx}{n}.$$\n\nNeben jedem Sprung schwingt $S_N$ über, um etwa 9 % der Sprunghöhe. Mit wachsendem $N$ wird der Überschwinger schmaler, aber nicht niedriger. Das ist das **Gibbs-Phänomen**; in der Elektronik heißt es „Ringing“.\n\nGenau an der Flanke liefert die Reihe weder $+1$ noch $-1$, sondern den Mittelwert $0$. Die Reihe konvergiert trotzdem: im quadratischen Mittel und an jeder festen Stelle neben dem Sprung. Was das genau heißt, klärt Abschnitt 3.'
  },
  teach:[
    /* ===== Abschnitt 1: Fourier-Reihe, Signal ↔ Spektrum ===== */
    {id:'mf-t1', title:'Periodische Funktionen in Grundschwingungen zerlegen', steps:[
      {id:'mf-t1a', title:R`Schwingungen mit der Periode $2\pi$`,
        pre:{from:'m-komplex', seg:'mk-t2', title:'Euler-Formel', text:R`$e^{i\varphi} = \cos\varphi + i\sin\varphi$ und $|e^{i\varphi}| = 1$. Daraus folgen $\cos\varphi = \tfrac12(e^{i\varphi} + e^{-i\varphi})$ und $\sin\varphi = \tfrac{1}{2i}(e^{i\varphi} - e^{-i\varphi})$. Mini-Beispiel: $e^{2\pi i} = 1$ und $e^{i\pi} = -1$.`},
        num:{title:R`$e^{3ix}$ nach einer Periode`, text:R`$e^{3i(x + 2\pi)} = e^{3ix}\,e^{6\pi i} = e^{3ix}$, denn $e^{6\pi i} = \cos6\pi + i\sin6\pi = 1$. Für $e^{ix/2}$ dagegen gilt $e^{i(x + 2\pi)/2} = e^{ix/2}\,e^{i\pi} = -e^{ix/2}$.`},
        text:R`Ein Ton, eine Wechselspannung oder eine Funktion auf einem Ring wiederholt sich. Wir nehmen die Periode $2\pi$, also $f(x + 2\pi) = f(x)$, und betrachten $f$ auf $[-\pi, \pi]$. Die Bausteine sind die Schwingungen $e^{inx}$ mit ganzem $n$. Jede von ihnen hat die Periode $2\pi$, wie das Beispiel für $n = 3$ zeigt. Die Zahl $n$ zählt, wie oft die Schwingung in eine Periode passt: $n = 1$ ist die Grundschwingung, $n = 2, 3, \dots$ sind die Oberschwingungen. Negative $n$ laufen andersherum. Bei nicht ganzem $n$ passt die Schwingung nicht in die Periode.`,
        q:{q:R`Welche Funktion hat die Periode $2\pi$?`,
          opts:[R`$e^{ix/3} + \cos x$`, R`$\cos(5x) + e^{-2ix}$`, R`$\sin(\pi x) + 1$`], a:1,
          ex:R`$\cos5x$ und $e^{-2ix}$ haben ganzzahlige Frequenzen und damit beide die Periode $2\pi$; ihre Summe auch.`,
          fb:[R`$e^{ix/3}$ wiederholt sich erst nach $6\pi$: In eine Periode $2\pi$ passt nur ein Drittel Schwingung. Die Summe hat deshalb die Periode $6\pi$.`,
            '',
            R`$\sin(\pi x)$ hat die Periode $2$, nicht $2\pi$; die Konstante ändert daran nichts.`]}},
      {id:'mf-t1b', title:'Die Schwingungen sind orthogonal',
        pre:{from:'m-hilbert', seg:'mh-t3', title:'Orthonormalsysteme', text:R`Die $\varphi_n$ bilden ein Orthonormalsystem, wenn $\langle\varphi_n|\varphi_m\rangle = \int\varphi_n^*\varphi_m\,dx = \delta_{nm}$. Bei komplexen Funktionen wird die linke konjugiert. Mini-Beispiel: $\langle e^{ix}|e^{ix}\rangle = \int e^{-ix}e^{ix}dx = \int1\,dx$.`},
        num:{title:R`$m = 2$ und $n = 1$`, text:R`$$\begin{gathered}\int_{-\pi}^\pi e^{-2ix}e^{ix}\,dx = \int_{-\pi}^\pi e^{-ix}\,dx\\ = \left[\frac{e^{-ix}}{-i}\right]_{-\pi}^\pi = \frac{e^{-i\pi} - e^{i\pi}}{-i}\\ = \frac{-1 - (-1)}{-i} = 0.\end{gathered}$$`},
        text:R`Im Skalarprodukt aus M5 wird die linke Funktion konjugiert: $(e^{imx})^* = e^{-imx}$. Die Exponenten addieren sich zu $i(n - m)x$. Für $n \ne m$ ist das eine ganze Zahl voller Schwingungen, und das Integral verschwindet. Für $n = m$ ist der Integrand $1$:

$$\int_{-\pi}^\pi e^{-imx}e^{inx}\,dx = 2\pi\,\delta_{mn}.$$

Die $e^{inx}$ sind also orthogonal, aber nicht normiert. Normiert sind $e^{inx}/\sqrt{2\pi}$; das ist das Orthonormalsystem des Rings aus M5, und es ist vollständig. Die Herleitung prüft beide Fälle.`,
        derive:{ctx:{coords:['x'], params:{n:{int:[-3, 3]}, m:{int:[-3, 3], ne:'n'}}}, lines:[
          {l:'1/(2π) ∫_-π^π e^(-i m x) e^(i n x) dx = 1/(2π) [e^(i (n - m) x)/(i (n - m))]_-π^π', w:'für m ≠ n', why:{q:'Warum steht im Exponenten $n - m$?', opts:['Weil $e^{-imx}$ die Konjugierte von $e^{imx}$ ist und sich die Exponenten addieren.', 'Weil man $e^{inx}$ durch $e^{imx}$ teilt, wie bei jedem Skalarprodukt.', 'Weil $m$ und $n$ beim Integrieren vertauscht werden.'], a:0, ex:'Im Skalarprodukt $\\langle e^{imx}|e^{inx}\\rangle$ wird das erste Argument konjugiert: $(e^{imx})^* = e^{-imx}$. Zusammen ergibt das $e^{i(n-m)x}$.'}},
          {l:'= 0', w:'$e^{i(n-m)\\pi} = e^{-i(n-m)\\pi}$, weil $n - m$ ganz ist'},
          {l:'1/(2π) ∫_-π^π e^(-i n x) e^(i n x) dx = 1', w:'m = n: Der Integrand ist 1', why:{q:'Was folgt aus diesem Ergebnis?', opts:['Die Norm im Quadrat von $e^{inx}$ ist $2\\pi$, nicht $1$.', 'Die $e^{inx}$ sind schon ohne Vorfaktor normiert.', 'Es gilt nur für $n = 0$ und ist sonst falsch.'], a:0, ex:'Ohne den Vorfaktor $\\frac{1}{2\\pi}$ ergibt das Integral $\\langle e^{inx}|e^{inx}\\rangle = 2\\pi$. Normiert sind erst $e^{inx}/\\sqrt{2\\pi}$. Diese Norm im Quadrat taucht im nächsten Schritt als Vorfaktor wieder auf.'}}
        ]},
        q:{q:R`Was ergibt $\int_{-\pi}^\pi e^{-3ix}e^{3ix}\,dx$?`,
          opts:[R`$0$`, R`$2\pi$`, R`$1$`], a:1,
          ex:R`Für $m = n$ ist der Integrand $e^0 = 1$, und das Integral über eine Periode ist $2\pi$.`,
          fb:[R`Null kommt nur für $m \ne n$ heraus. Hier sind beide Frequenzen $3$.`,
            '',
            R`$1$ ergäbe sich erst mit dem Vorfaktor $\tfrac{1}{2\pi}$ oder mit den normierten Funktionen $e^{inx}/\sqrt{2\pi}$.`]}},
      {id:'mf-t1c', title:'Die Fourier-Reihe: Koeffizienten als Projektionen',
        num:{title:R`$f(x) = \cos^2x$`, text:R`Mit der Euler-Formel: $\cos^2x = \tfrac14\left(e^{ix} + e^{-ix}\right)^2 = \tfrac14e^{2ix} + \tfrac12 + \tfrac14e^{-2ix}$. Also ist $c_0 = \tfrac12$ und $c_{\pm2} = \tfrac14$, alle anderen sind null. Probe mit der Formel unten: $c_0 = \tfrac{1}{2\pi}\int_{-\pi}^\pi\cos^2x\,dx = \tfrac{1}{2\pi}\cdot\pi = \tfrac12$.`},
        text:R`Die **[[lex:fourier-reihe|Fourier-Reihe]]** ist die Entwicklung nach diesen Schwingungen:

$$\begin{gathered}f(x) = \sum_{n=-\infty}^\infty c_n\,e^{inx},\\ c_n = \frac{1}{2\pi}\int_{-\pi}^\pi f(x)\,e^{-inx}\,dx.\end{gathered}$$

Der Koeffizient ist eine Projektion, wie in M5. Weil die $e^{inx}$ nicht normiert sind, teilt man durch ihre Norm im Quadrat $2\pi$; daher der Vorfaktor $\tfrac{1}{2\pi}$. Das $e^{-inx}$ im Integral ist die konjugierte Basisfunktion. $c_0$ ist der Mittelwert von $f$ über eine Periode. $|c_n|$ sagt, wie stark die $n$-te Schwingung im Signal steckt.`,
        q:{q:R`Was ist $c_0$ für $f(x) = 3 + \sin x$?`,
          opts:[R`$\tfrac{3}{2\pi}$`, R`$6\pi$`, R`$3$`], a:2,
          ex:R`$c_0 = \tfrac{1}{2\pi}\int_{-\pi}^\pi(3 + \sin x)\,dx = \tfrac{1}{2\pi}\cdot6\pi = 3$: der Mittelwert. Der Sinus mittelt sich weg.`,
          fb:[R`Das Integral über die Konstante ist $3\cdot2\pi$, nicht $3$. Erst danach teilst du durch $2\pi$.`,
            R`$6\pi$ ist das Integral. Der Vorfaktor $\tfrac{1}{2\pi}$ fehlt.`,
            '']}},
      {id:'mf-t1d', title:'Die reelle Form mit Sinus und Kosinus',
        num:{title:R`$c_3 = 2 + i$ und $c_{-3} = 2 - i$`, text:R`$a_3 = c_3 + c_{-3} = 4$ und $b_3 = i(c_3 - c_{-3}) = i\cdot2i = -2$. Probe: $c_3e^{3ix} + c_{-3}e^{-3ix} = 4\cos3x - 2\sin3x$.`},
        text:R`Mit $e^{inx} = \cos nx + i\sin nx$ fasst man die Terme zu $n$ und $-n$ zusammen:

$$f(x) = \frac{a_0}{2} + \sum_{n=1}^\infty\big(a_n\cos nx + b_n\sin nx\big),$$

mit $a_n = \frac1\pi\int_{-\pi}^\pi f\cos nx\,dx$ und $b_n = \frac1\pi\int_{-\pi}^\pi f\sin nx\,dx$. Zwischen beiden Formen gilt $a_n = c_n + c_{-n}$ und $b_n = i(c_n - c_{-n})$. Für reelles $f$ ist $c_{-n} = c_n^*$; dann sind $a_n$ und $b_n$ reell. Die beiden Formen enthalten also dieselbe Information; die komplexe ist kürzer, die reelle anschaulicher. Hat $f$ die Periode $L$ statt $2\pi$, ersetzt du $nx$ durch $2\pi nx/L$ und integrierst über eine Periode. Die Vorfaktoren werden dann $\tfrac1L$ für $c_n$ und $\tfrac2L$ für $a_n$ und $b_n$.`,
        q:{q:R`Für ein reelles $f$ ist $c_2 = 1 - 3i$. Welche Koeffizienten der reellen Form gehören dazu?`,
          opts:[R`$a_2 = 2$, $b_2 = -6$`, R`$a_2 = 2$, $b_2 = 6$`, R`$a_2 = 1$, $b_2 = -3$`], a:1,
          ex:R`$c_{-2} = c_2^* = 1 + 3i$. Dann $a_2 = 2$ und $b_2 = i\big((1 - 3i) - (1 + 3i)\big) = i\cdot(-6i) = 6$.`,
          fb:[R`Rechne $b_2 = i(c_2 - c_{-2})$ genau: $i\cdot(-6i) = -6i^2 = +6$.`,
            '',
            R`Real- und Imaginärteil von $c_2$ sind nicht direkt $a_2$ und $b_2$. Es gilt $a_2 = 2\operatorname{Re}c_2$ und $b_2 = -2\operatorname{Im}c_2$.`]}},
      {id:'mf-t1e', title:'Signal und Spektrum',
        num:{title:'Ein Spektrum ablesen', text:R`Für $f(x) = \cos^2x$ sind die Beträge $|c_0| = \tfrac12$ und $|c_{\pm2}| = \tfrac14$. Als Balken über $n$ aufgetragen stehen drei Balken bei $n = -2, 0, 2$; die übrigen sind null. Das Spektrum verrät: $f$ hat einen Mittelwert und schwingt mit doppelter Grundfrequenz.`},
        text:R`Eine periodische Funktion hat zwei gleichwertige Beschreibungen. Im Ort gibst du an, welchen Wert $f$ an jeder Stelle hat. Im **Spektrum** gibst du an, mit welchem Gewicht $c_n$ jede Schwingung $e^{inx}$ beteiligt ist. Die Koeffizienten bilden eine Spalte $(\dots;\ c_{-1};\ c_0;\ c_1;\ \dots)$, unendlich lang in beide Richtungen. Aus der einen Beschreibung gewinnst du die andere: die Integrale für $c_n$ in die eine Richtung, die Summe der Reihe in die andere. Die Tafel zeigt das am Beispiel. Ein Spektrumanalysator zeigt solche Beträge als Linien über der Frequenz.`,
        reps:{obj:R`Die Funktion $f(x) = \cos^2x$ im Ort und im Spektrum`,
          rows:[
            {k:'graph', plot:{x:[-2 * Math.PI, 2 * Math.PI], y:[-0.2, 1.2], xlab:'x', ylab:'f'}, f:x => Math.cos(x) ** 2, lab:R`\cos^2x`,
              cap:R`Periode $\pi$ statt $2\pi$, Mittelwert $\tfrac12$.`},
            {k:'ort', tex:R`f(x) = \cos^2x = \tfrac12 + \tfrac12\cos2x`},
            {k:'formel', tex:R`\begin{gathered}f(x) = \tfrac14e^{-2ix} + \tfrac12 + \tfrac14e^{2ix},\\ c_n = \frac{1}{2\pi}\int_{-\pi}^\pi f(x)\,e^{-inx}\,dx\end{gathered}`},
            {k:'matrix', tex:R`\begin{gathered}(\dots;\ c_{-2};\ c_{-1};\ c_0;\ c_1;\ c_2;\ \dots)\\ = (\dots;\ \tfrac14;\ 0;\ \tfrac12;\ 0;\ \tfrac14;\ \dots)\end{gathered}`},
            {k:'physik', text:R`Ein Spektrumanalysator zeigt für dieses Signal einen Gleichanteil und eine Linie bei der doppelten Grundfrequenz. **Ausblick (Thema 8):** Auf einem Ring beschreibt $e^{inx}$ einen Zustand mit dem Drehimpuls $n\hbar$. Ist $f$ normiert, ist $2\pi|c_n|^2$ die Wahrscheinlichkeit, diesen Drehimpuls zu messen.`}
          ],
          links:[
            {from:'graph', to:'ort', rule:R`Lies Periode und Mittelwert ab und suche eine passende Formel; hier hilft $\cos^2x = \tfrac12(1 + \cos2x)$.`},
            {from:'ort', to:'formel', rule:R`Schreib jeden Kosinus mit der Euler-Formel als $\tfrac12(e^{inx} + e^{-inx})$, oder berechne die Integrale für $c_n$.`},
            {from:'formel', to:'matrix', rule:R`Lies die Vorfaktoren vor $e^{inx}$ ab und schreib sie nach $n$ geordnet in eine Spalte; fehlende $n$ bekommen eine $0$.`},
            {from:'matrix', to:'physik', rule:R`Trag $|c_n|$ als Balken über $n$ auf: Das ist das Bild eines Spektrumanalysators.`}
          ]},
        q:{q:R`Ein reelles Signal hat nur die Koeffizienten $c_1 = \tfrac{1}{2i}$ und $c_{-1} = -\tfrac{1}{2i}$. Welches Signal ist es?`, tr:{from:'matrix', to:'ort'},
          opts:[R`$\cos x$`, R`$\sin x$`, R`$\tfrac{1}{2i}\cos x$`], a:1,
          ex:R`$\tfrac{1}{2i}e^{ix} - \tfrac{1}{2i}e^{-ix} = \tfrac{1}{2i}(e^{ix} - e^{-ix}) = \sin x$.`,
          fb:[R`Zum Kosinus gehören zwei gleiche Koeffizienten $\tfrac12$. Hier haben sie verschiedene Vorzeichen und den Faktor $\tfrac1i$.`,
            '',
            R`Das Signal ist reell; $\tfrac{1}{2i}\cos x$ wäre rein imaginär. Setze die Reihe aus $c_1e^{ix} + c_{-1}e^{-ix}$ zusammen.`]}},
      {id:'mf-t1f', title:'Typischer Fehler: der falsche Vorfaktor',
        num:{title:'Drei Normen im Quadrat', text:R`$\int_{-\pi}^\pi|e^{inx}|^2dx = 2\pi$, aber $\int_{-\pi}^\pi\cos^2nx\,dx = \pi$ und $\int_{-\pi}^\pi\sin^2nx\,dx = \pi$ für $n \ge 1$. Deshalb steht vor $c_n$ der Faktor $\tfrac{1}{2\pi}$, vor $a_n$ und $b_n$ der Faktor $\tfrac1\pi$.`},
        text:R`Viele Fehler bei Fourier-Reihen sind Faktoren von $2$ oder $2\pi$. Die Regel dahinter ist immer dieselbe: Bei nicht normierten Basisfunktionen teilt man durch ihre Norm im Quadrat (M5). Für $e^{inx}$ ist das $2\pi$, für $\cos nx$ und $\sin nx$ nur $\pi$, weil $\cos^2$ und $\sin^2$ im Mittel nur $\tfrac12$ sind. Ein Sonderfall ist $n = 0$: $\cos0 = 1$ hat die Norm im Quadrat $2\pi$. Deshalb steht in der Reihe $\tfrac{a_0}{2}$ und nicht $a_0$. Wer unsicher ist, prüft an $f = \cos x$: Es muss $a_1 = 1$ herauskommen.`,
        q:{q:R`Für die Konstante $f = 5$ liefert die Formel $a_0 = \tfrac1\pi\int_{-\pi}^\pi5\,dx = 10$. Welcher Term steht in der Reihe?`,
          opts:[R`$10$`, R`$5$`, R`$\tfrac{5}{\pi}$`], a:1,
          ex:R`In der Reihe steht $\tfrac{a_0}{2} = 5$, der Mittelwert. Das gleicht den Faktor $\tfrac1\pi$ aus, der für $n = 0$ zu groß ist.`,
          fb:[R`$a_0$ selbst steht nicht in der Reihe, sondern $\tfrac{a_0}{2}$. Sonst käme die Konstante doppelt heraus.`,
            '',
            R`Das Integral ist $5\cdot2\pi = 10\pi$; mal $\tfrac1\pi$ gibt $a_0 = 10$, und in der Reihe steht die Hälfte.`]}}
    ]},
    /* ===== Abschnitt 2: Symmetrie, Beispiel x², Abfallregel ===== */
    {id:'mf-t2', title:'Symmetrie und Abfall der Koeffizienten', steps:[
      {id:'mf-t2a', title:'Symmetrie spart Arbeit',
        num:{title:R`$f(x) = x^2$`, text:R`$x^2$ ist gerade. Dann ist $x^2\sin nx$ ungerade: $(-x)^2\sin(-nx) = -x^2\sin nx$. Über das symmetrische Intervall $[-\pi, \pi]$ heben sich die Flächen auf, also ist $b_n = 0$ für alle $n$.`},
        text:R`Ist $f$ **gerade**, $f(-x) = f(x)$, dann ist $f\sin nx$ ungerade, und alle $b_n$ verschwinden. Übrig bleibt eine Kosinusreihe mit

$$a_n = \frac2\pi\int_0^\pi f(x)\cos nx\,dx.$$

Der Faktor $2$ kommt daher, dass das gerade Produkt $f\cos nx$ links dieselbe Fläche hat wie rechts. Ist $f$ **ungerade**, bleibt nur die Sinusreihe mit $b_n = \frac2\pi\int_0^\pi f\sin nx\,dx$. Prüfe die Symmetrie deshalb immer zuerst. Sie halbiert die Arbeit und ist eine gute Kontrolle: Taucht bei einer geraden Funktion ein Sinus auf, stimmt etwas nicht.`,
        q:{q:R`$f$ ist ungerade und $2\pi$-periodisch. Welche Koeffizienten können von null verschieden sein?`,
          opts:[R`nur die $a_n$, also die Kosinusterme`, R`nur $a_0$ und die $a_n$`, R`nur die $b_n$, also die Sinusterme`], a:2,
          ex:R`Ungerade mal $\cos$ ist ungerade und integriert sich zu null; ungerade mal $\sin$ ist gerade.`,
          fb:[R`Das gilt für gerade Funktionen. Bei ungeraden verschwinden gerade die $a_n$.`,
            R`$a_0$ ist das Doppelte des Mittelwerts, und der ist bei ungeraden Funktionen null.`,
            '']}},
      {id:'mf-t2b', title:R`Die Reihe von $x^2$: zweimal partiell integrieren`,
        pre:{from:'m-analysis', seg:'ma-t4', title:'Partielle Integration', text:R`$\int_a^bu\,v'\,dx = [uv]_a^b - \int_a^bu'v\,dx$. Wähle $u$ so, dass es beim Ableiten einfacher wird, etwa eine Potenz von $x$. Mini-Beispiel: $\int_0^\pi x\cos x\,dx = [x\sin x]_0^\pi - \int_0^\pi\sin x\,dx = -2$.`},
        num:{title:R`$a_1$ für $f = x^2$`, text:R`$a_1 = \frac1\pi\int_{-\pi}^\pi x^2\cos x\,dx = -4$. Kontrolle mit dem Ergebnis des nächsten Schritts: $\frac{4(-1)^1}{1^2} = -4$.`},
        text:R`Die Funktion $x^2$ ist gerade, also bleibt die Kosinusreihe. Für $a_n$ mit $n \ge 1$ integrierst du zweimal partiell. Jedes Mal wandert eine Ableitung auf die Potenz von $x$, und beim Integrieren von $\cos nx$ bzw. $\sin nx$ entsteht ein Faktor $1/n$. Die Randterme mit $\sin n\pi = 0$ fallen weg; die mit $\cos n\pi = (-1)^n$ bleiben. Die Herleitung zeigt den ersten Teil. Nach einer partiellen Integration bleibt ein Integral mit $x\sin nx$ übrig, das der nächste Schritt ausrechnet.`,
        derive:{ctx:PER({'f(x)':'x^2'}), lines:[
          {l:'a_n = 1/π ∫_-π^π x^2 cos(n x) dx', w:'Definition, n ≥ 1'},
          {l:'= 2/π ∫_0^π x^2 cos(n x) dx', w:'gerader Integrand', why:{q:'Warum ist der Integrand gerade?', opts:['Weil $x^2$ und $\\cos nx$ beide gerade sind.', 'Weil das Intervall symmetrisch ist; das genügt.', 'Weil $x^2 \\ge 0$ für alle $x$ gilt.'], a:0, ex:'Gerade mal gerade ist gerade, dann $\\int_{-\\pi}^\\pi = 2\\int_0^\\pi$. Ein symmetrisches Intervall allein reicht nicht.'}},
          {l:'= 2/π ([x^2 sin(n x)/n]_0^π - 2/n ∫_0^π x sin(n x) dx)', w:'partiell: u = x², v′ = cos nx'},
          {l:'= -4/(π n) ∫_0^π x sin(n x) dx', w:'Randterm null wegen sin(nπ) = 0', why:{q:R`Warum fällt der Randterm weg?`, opts:['Weil $\\sin n\\pi = 0$ und $\\sin 0 = 0$ für ganzes $n$ gilt.', 'Weil $x^2$ bei $x = 0$ verschwindet; bei $\\pi$ bleibt er.', 'Weil Randterme bei Fourier-Reihen immer wegfallen.'], a:0, ex:R`Bei $x = \pi$ ist $x^2 = \pi^2 \ne 0$, aber $\sin n\pi = 0$. Bei der zweiten partiellen Integration bleibt dagegen ein Randterm mit $\cos n\pi$ stehen.`}}
        ]},
        q:{q:R`Warum entsteht bei jeder partiellen Integration ein Faktor $1/n$?`,
          opts:[R`Weil $x^2$ beim Ableiten den Faktor $\tfrac1n$ bekommt.`, R`Weil $\int\cos nx\,dx = \tfrac1n\sin nx$ ist.`, R`Weil man durch die Periode $2\pi n$ teilt.`], a:1,
          ex:R`Die Stammfunktion von $\cos nx$ ist $\tfrac1n\sin nx$, die von $\sin nx$ ist $-\tfrac1n\cos nx$. Jede Integration bringt so ein $\tfrac1n$.`,
          fb:[R`$x^2$ wird abgeleitet zu $2x$; ein $n$ entsteht dabei nicht.`,
            '',
            R`Die Periode ist für alle $n$ gleich $2\pi$. Das $\tfrac1n$ kommt aus der Stammfunktion.`]}},
      {id:'mf-t2c', title:R`Die Reihe von $x^2$: Ergebnis und eine Summenformel`,
        num:{title:R`$a_1$ und $a_2$`, text:R`Das Restintegral für $n = 1$ und $n = 2$ ist $\int_0^\pi x\sin x\,dx = \pi$ und $\int_0^\pi x\sin2x\,dx = -\tfrac\pi2$. Mit dem Vorfaktor $-\tfrac{4}{\pi n}$ aus dem letzten Schritt:

$$\begin{gathered}a_1 = -\tfrac4\pi\cdot\pi = -4,\\ a_2 = -\tfrac2\pi\cdot\left(-\tfrac\pi2\right) = 1.\end{gathered}$$

Beide passen zu $4(-1)^n/n^2$.`},
        text:R`Die zweite partielle Integration liefert $a_n = 4(-1)^n/n^2$. Mit dem Mittelwert $\frac{a_0}{2} = \frac{1}{2\pi}\int_{-\pi}^\pi x^2dx = \frac{\pi^2}{3}$ lautet die Reihe auf $[-\pi, \pi]$

$$x^2 = \frac{\pi^2}{3} + 4\sum_{n=1}^\infty\frac{(-1)^n}{n^2}\cos nx.$$

Gelesen: ein Mittelwert und dann Kosinusschwingungen mit abwechselndem Vorzeichen, deren Gewicht wie $1/n^2$ abnimmt. Setzt du eine Stelle ein, entsteht eine Summenformel. Das klappt auch am Rand, weil die Fortsetzung von $x^2$ dort nicht springt. Bei $x = \pi$ ist $(-1)^n\cos n\pi = 1$. Aus $\pi^2 = \frac{\pi^2}{3} + 4\sum_n\frac{1}{n^2}$ folgt die berühmte Summe $\sum_n\frac{1}{n^2} = \frac{\pi^2}{6} \approx 1{,}645$.`,
        derive:{ctx:PER({'f(x)':'x^2'}), lines:[
          {l:'∫_0^π x sin(n x) dx = [-x cos(n x)/n]_0^π + 1/n ∫_0^π cos(n x) dx', w:'das Restintegral aus dem letzten Schritt, partiell: u = x, v′ = sin nx'},
          {l:'= -π (-1)^n/n', w:'cos(nπ) = (−1)ⁿ, Restintegral null', why:{q:R`Warum ist das Restintegral null?`, opts:['Weil $\\int_0^\\pi\\cos nx\\,dx = \\tfrac1n\\sin n\\pi = 0$ ist.', 'Weil $\\cos nx$ eine ungerade Funktion ist.', 'Weil es sich gegen den Randterm wegkürzt.'], a:0, ex:R`Die Stammfunktion $\tfrac1n\sin nx$ ist an beiden Grenzen null. $\cos nx$ ist gerade, nicht ungerade.`}},
          {l:'-4/(π n) · (-π (-1)^n/n) = 4 (-1)^n/n^2', w:R`mit dem Vorfaktor $-\tfrac{4}{\pi n}$ aus dem letzten Schritt: das ist $a_n$`, why:{q:R`Woher kommt der Faktor $(-1)^n$ in $a_n$?`, opts:[R`aus dem Randterm bei $x = \pi$, denn $\cos n\pi = (-1)^n$`, R`aus der Symmetrie, weil $x^2$ gerade ist`, R`aus dem Restintegral $\int_0^\pi\cos nx\,dx$`], a:0, ex:R`Der Randterm $[-x\cos(nx)/n]_0^\pi$ ist bei $x = 0$ null und bei $x = \pi$ gleich $-\pi(-1)^n/n$. Das Restintegral ist null; die Symmetrie liefert nur den Faktor $2$ vor $\int_0^\pi$.`}}
        ]},
        q:{q:R`Setze $x = 0$ in die Reihe für $x^2$ ein. Welche Summenformel folgt?`,
          opts:[R`$\sum_n\frac{1}{n^2} = \frac{\pi^2}{12}$`, R`$\sum_n\frac{(-1)^n}{n^2} = -\frac{\pi^2}{12}$`, R`$\sum_n\frac{(-1)^n}{n^2} = \frac{\pi^2}{3}$`], a:1,
          ex:R`$0 = \frac{\pi^2}{3} + 4\sum_n\frac{(-1)^n}{n^2}$, also $\sum_n\frac{(-1)^n}{n^2} = -\frac{\pi^2}{12}$.`,
          fb:[R`Bei $x = 0$ ist $\cos0 = 1$; das Vorzeichen $(-1)^n$ bleibt stehen.`,
            '',
            R`Die linke Seite ist $0^2 = 0$, nicht $\pi^2$. Bringe $\tfrac{\pi^2}{3}$ auf die andere Seite und teile durch $4$.`]}},
      {id:'mf-t2d', title:'Glatt fällt schnell: der Abfall der Koeffizienten',
        num:{title:'Rechteck und Dreieck', text:R`Das Rechteck $\operatorname{sgn}x$ hat $b_n = \tfrac{4}{n\pi}$ für ungerades $n$, das Dreieck $|x|$ hat $a_n = -\tfrac{4}{n^2\pi}$. Bei $n = 9$:

$$\tfrac{4}{9\pi} \approx 0{,}14\quad\text{gegen}\quad \tfrac{4}{81\pi} \approx 0{,}016.$$

Das springende Rechteck braucht viel mehr Oberschwingungen.`},
        text:R`Wie schnell die Koeffizienten abfallen, hängt an der Glattheit, und zwar der **periodisch fortgesetzten** Funktion. Das ist die **[[lex:koeffizientenabfall|Abfallregel]]**. Springt die Fortsetzung, fallen die Koeffizienten wie $1/n$. Ist sie stetig, hat aber Knicke, fallen sie wie $1/n^2$. Ist sie beliebig oft stetig differenzierbar, fallen sie schneller als jede Potenz $1/n^k$. Der Grund ist die partielle Integration: Jedes Verschieben einer Ableitung bringt einen Faktor $1/n$, bis eine Ableitung von $f$ springt. Dort bleibt ein Randterm stehen. Im Labor siehst du es: Das Dreieck ist schon mit $N = 5$ kaum von $f$ zu unterscheiden, das Rechteck nicht.`,
        reps:{obj:'Glattheit und Spektrum: Rechteck gegen Dreieck',
          rows:[
            {k:'graph', plot:{x:[-Math.PI, Math.PI], y:[-1.4, 3.6], xlab:'x', ylab:'f'}, f:x => (x > 0 ? 1 : x < 0 ? -1 : 0), lab:R`\operatorname{sgn}x`, f2:x => Math.abs(x), lab2:'|x|',
              cap:R`Das Rechteck springt, das Dreieck knickt nur. Periodisch fortgesetzt springt das Rechteck auch bei $\pm\pi$; das Dreieck bleibt stetig.`},
            {k:'worte', text:R`Ein Sprung braucht viele hohe Schwingungen, ein Knick weniger, eine glatte Funktion fast keine.`},
            {k:'formel', tex:R`\begin{gathered}\operatorname{sgn}x:\ b_n = \frac{4}{n\pi}\sim\frac1n,\\ |x|:\ a_n = -\frac{4}{n^2\pi}\sim\frac{1}{n^2},\\ \text{jeweils für ungerades}\ n\end{gathered}`},
            {k:'labor', text:R`Modus „Fourier-Reihe“, „höchste Ordnung N“ auf $5$: Beim „Dreieck“ meldet die Anzeige eine größte Abweichung von etwa $0{,}105$; beim „Rechteck“ bleibt der Überschwinger am Sprung.`}
          ],
          links:[
            {from:'graph', to:'worte', rule:R`Setze die Funktion periodisch fort und suche Sprünge und Knicke, auch an den Nahtstellen $\pm\pi$.`},
            {from:'worte', to:'formel', rule:R`Sprung: $1/n$. Knick: $1/n^2$. Jede weitere stetige Ableitung: ein Faktor $1/n$ mehr.`},
            {from:'formel', to:'labor', rule:R`Wähle dieselbe Funktion und dasselbe $N$. Je schneller die Koeffizienten fallen, desto früher liegt die blaue Teilsumme auf der grün gestrichelten Kurve.`}
          ]},
        q:{q:R`Der Graph einer $2\pi$-periodischen Funktion ist überall stetig und hat einzelne Knicke. Wie fallen ihre Koeffizienten ab?`, tr:{from:'graph', to:'formel'},
          opts:[R`wie $1/n$`, R`wie $1/n^2$`, R`schneller als jede Potenz`], a:1,
          ex:R`Stetig mit Knicken heißt: Die Funktion springt nicht, aber ihre Ableitung. Das gibt einen Abfall wie $1/n^2$, wie beim Dreieck.`,
          fb:[R`$1/n$ gehört zu Sprüngen der Funktion selbst. Hier springt nur die Ableitung.`,
            '',
            R`Schneller als jede Potenz fallen nur beliebig glatte Funktionen. Ein Knick verhindert das.`]}},
      {id:'mf-t2e', title:'Typischer Fehler: die Fortsetzung vergessen',
        num:{title:R`$f(x) = x$ auf $(-\pi, \pi)$`, text:R`Im Innern ist $x$ beliebig glatt. Periodisch fortgesetzt springt die Funktion aber bei $x = \pi$ von $\pi$ auf $-\pi$, um $2\pi$. Deshalb fallen ihre Koeffizienten $b_n = \tfrac{2(-1)^{n+1}}{n}$ nur wie $1/n$. Bei $x^2$ passt die Fortsetzung stetig zusammen, weil $(-\pi)^2 = \pi^2$.`},
        text:R`Der häufigste Fehler bei der Abfallregel: Man schaut nur auf das Innere des Intervalls. Für die Fourier-Reihe zählt aber die periodisch fortgesetzte Funktion, und die Ränder $\pm\pi$ werden zu Nahtstellen. Passt $f(-\pi)$ nicht zu $f(\pi)$, entsteht dort ein Sprung, auch wenn $f$ selbst ein Polynom ist. Prüfe deshalb immer beide Nahtstellen: Sind die Werte gleich? Sind die Ableitungen gleich? **Ausblick (Thema 5):** Dasselbe gilt für Wellenfunktionen. Eine mit Knick, wie im δ-Potential, hat ein Spektrum, das nur langsam abfällt (Abschnitt 4 und 6).`,
        q:{q:R`Welche Funktion auf $(-\pi, \pi)$ hat, $2\pi$-periodisch fortgesetzt, Koeffizienten, die nur wie $1/n$ abfallen?`,
          opts:[R`$f(x) = x^2$`, R`$f(x) = |x|$`, R`$f(x) = x$`], a:2,
          ex:R`Nur bei $f = x$ springt die Fortsetzung, und zwar bei $\pm\pi$. $x^2$ und $|x|$ sind stetig fortgesetzt und haben Knicke: $1/n^2$.`,
          fb:[R`$x^2$ passt an den Nahtstellen zusammen; nur die Ableitung springt. Das gibt $1/n^2$.`,
            R`$|x|$ ist stetig fortgesetzt mit Knicken bei $0$ und $\pm\pi$. Das gibt $1/n^2$.`,
            '']}}
    ]},
    /* ===== Abschnitt 3: Konvergenz an Sprungstellen ===== */
    {id:'mf-t3', title:'Was die Reihe an einer Sprungstelle tut', steps:[
      {id:'mf-t3a', title:'Im Mittel: die Parseval-Gleichung',
        pre:{from:'m-hilbert', seg:'mh-t4', title:'Parseval', text:R`Für ein vollständiges Orthonormalsystem ist $\sum_n|c_n|^2 = \|f\|^2$, und die Teilsummen konvergieren im Mittel: $\|f - S_N\| \to 0$. Einzelne Punkte zählen dabei nicht. Mini-Beispiel: Für $f = 1$ auf $[0, 1]$ in der Sinusbasis ist $\sum_n|c_n|^2 = 1$.`},
        num:{title:'Das Rechteck', text:R`$f = \operatorname{sgn}x$ hat $\tfrac{1}{2\pi}\int_{-\pi}^\pi|f|^2dx = 1$. Die ersten drei Terme der rechten Seite:

$$\begin{aligned}&\tfrac12\left(\tfrac{16}{\pi^2} + \tfrac{16}{9\pi^2} + \tfrac{16}{25\pi^2}\right)\\ &\approx 0{,}811 + 0{,}090 + 0{,}032 = 0{,}933.\end{aligned}$$`},
        text:R`Konvergiert eine Fourier-Reihe, und wogegen? Es gibt drei Antworten, je nachdem, was Konvergenz heißen soll. Die erste: **Im Mittel** konvergiert die Reihe für jedes $f$ mit $\int|f|^2dx < \infty$, weil das System $e^{inx}$ vollständig ist (M5). Es gilt die **[[lex:parseval|Parseval-Gleichung]]**

$$\begin{gathered}\frac{1}{2\pi}\int_{-\pi}^\pi|f|^2dx = \sum_n|c_n|^2\\ = \frac{|a_0|^2}{4} + \frac12\sum_{n\ge1}\big(|a_n|^2 + |b_n|^2\big).\end{gathered}$$

Gelesen: Das mittlere Betragsquadrat von $f$ über eine Periode ist die Summe der Betragsquadrate aller Koeffizienten. Bei einem Signal heißt das: Seine mittlere Leistung verteilt sich auf die einzelnen Schwingungen. Der Faktor $\tfrac{1}{2\pi}$ links gehört zur nicht normierten Basis. Die Herleitung wendet die Gleichung auf das Rechteck an und gewinnt eine Summenformel.`,
        derive:{ctx:PER({'f(x)':'sgn(x)'}), lines:[
          {l:'1/(2π) ∫_-π^π |f(x)|^2 dx = 1', w:'|sgn x|² = 1', why:{q:'Warum ist das Integral so einfach?', opts:['Weil $|\\operatorname{sgn}x|^2 = 1$ ist, außer im Punkt $0$, der nicht zählt.', 'Weil $\\operatorname{sgn}x$ ungerade ist und das Integral null wird.', 'Weil man nur über $[0, \\pi]$ integrieren muss.'], a:0, ex:'Ein Integral über $|f|^2$ ist nie null, wenn $f \\ne 0$. Ungerade ist $f$, nicht $|f|^2$.'}},
          {l:'Σ_{n=0}^∞ 1/2 · 16/(π^2 (2n + 1)^2) = 1', w:'rechte Seite: ½ Σ b² über die ungeraden Ordnungen 2n + 1', why:{q:'Warum zählt nur jede zweite Ordnung?', opts:['Weil für gerade $n$ gilt: $b_n = 0$.', 'Weil die Reihe sonst divergieren würde.', 'Weil die geraden $n$ in den $a_n$ stecken.'], a:0, ex:'$b_n = \\frac{2}{n\\pi}(1 - (-1)^n)$ ist für gerade $n$ null. Die $a_n$ sind alle null, weil $\\operatorname{sgn}x$ ungerade ist.'}},
          {l:'Σ_{n=0}^∞ 1/(2n + 1)^2 = π^2/8', w:'nach der Summe aufgelöst'}
        ]},
        q:{q:R`Für ein reelles $f$ ist $\tfrac{1}{2\pi}\int_{-\pi}^\pi|f|^2dx = 1$, und du hast schon $a_0 = 0$, $a_1 = 1$ und $b_1 = 1$. Wie viel bleibt für alle übrigen Koeffizienten?`,
          opts:[R`$\tfrac12$`, R`nichts: $\tfrac12(1^2 + 1^2) = 1$ ist schon alles`, R`nichts mehr, und die Rechnung widerspricht sich, denn $1^2 + 1^2 = 2 > 1$`], a:1,
          ex:R`Parseval: $\tfrac12(a_1^2 + b_1^2) = 1$ erschöpft schon die ganze Norm. Also ist $f = \cos x + \sin x$, alle anderen Koeffizienten sind null.`,
          fb:[R`Beide Terme zählen, jeder mit dem Faktor $\tfrac12$: $\tfrac12\cdot1 + \tfrac12\cdot1 = 1$.`,
            '',
            R`Vor der Summe steht der Faktor $\tfrac12$. Mit ihm ist $\tfrac12(1 + 1) = 1$, kein Widerspruch.`]}},
      {id:'mf-t3b', title:'Punktweise: der Mittelwert am Sprung',
        num:{title:R`Das Rechteck bei $x = 0$`, text:R`Jede Teilsumme ist $S_N(0) = \tfrac4\pi\sum\tfrac{\sin0}{n} = 0$. Das ist genau der Mittelwert $\tfrac12\big(f(0^-) + f(0^+)\big) = \tfrac12(-1 + 1) = 0$. Bei $x = \tfrac\pi2$ dagegen gehen die Teilsummen gegen $f(\tfrac\pi2) = 1$.`},
        text:R`Die zweite Antwort betrifft einzelne Stellen. Für stückweise glatte $f$ gilt der **Satz von Dirichlet**. An jeder Stelle, an der die Fortsetzung stetig ist, geht $S_N(x)$ gegen $f(x)$. An einer Sprungstelle geht $S_N(x)$ gegen den Mittelwert

$$\tfrac12\big(f(x^-) + f(x^+)\big)$$

aus links- und rechtsseitigem Grenzwert. Gelesen: „die Mitte des Sprungs“. Was $f$ an der Sprungstelle selbst ist, spielt keine Rolle. Das passt dazu, dass einzelne Punkte in $L^2$ nicht zählen (M5).`,
        q:{q:R`Wogegen konvergiert die Fourier-Reihe des Sägezahns $f(x) = x$ (auf $(-\pi, \pi)$, periodisch fortgesetzt) in $x = \pi$?`,
          opts:[R`$\pi$`, R`$0$`, R`$-\pi$`], a:1,
          ex:R`Die Fortsetzung springt bei $x = \pi$ von $\pi$ auf $-\pi$. Die Reihe liefert den Mittelwert $0$; jeder Term $\sin n\pi$ ist ohnehin null.`,
          fb:[R`$\pi$ ist nur der linksseitige Grenzwert. Rechts davon beginnt die nächste Periode bei $-\pi$.`,
            '',
            R`$-\pi$ ist nur der rechtsseitige Grenzwert. Die Reihe nimmt die Mitte.`]}},
      {id:'mf-t3c', title:'Gleichmäßig nicht: das Gibbs-Phänomen',
        num:{title:'Das Maximum der Teilsumme', text:R`Für $\operatorname{sgn}x$ mit der Sprunghöhe $2$ liegt das Maximum von $S_N$ kurz rechts vom Sprung. Bei $N = 15$ liegt es bei $x = \tfrac{\pi}{16} \approx 0{,}20$ und hat den Wert $1{,}180$. Allgemein liegt es für ungerades $N$ bei $x = \tfrac{\pi}{N + 1}$, also ungefähr bei $\tfrac\pi N$. Für großes $N$ nähert sich der Wert $\tfrac2\pi\operatorname{Si}(\pi) \approx 1{,}179$, mit dem Integralsinus $\operatorname{Si}(\pi) = \int_0^\pi\frac{\sin t}{t}\,dt$. Das sind etwa $9\,\%$ der Sprunghöhe über $1$.`},
        text:R`Die dritte Antwort: **Gleichmäßig**, also mit einer Fehlerschranke für alle $x$ zugleich, konvergiert die Reihe nur, wenn die Fortsetzung stetig ist. Neben einem Sprung scheitert sie am **[[lex:gibbs|Gibbs-Phänomen]]**: Jede Teilsumme schwingt über, um etwa $9\,\%$ der Sprunghöhe. Mit wachsendem $N$ rückt der Überschwinger näher an den Sprung und wird schmaler, aber nicht niedriger. Im Bild ist die blaue Kurve $S_N$, die grün gestrichelte die periodisch fortgesetzte Funktion. Die Anzeige meldet die Höhe des Überschwingers relativ zur Sprunghöhe.`,
        fig:{lab:'fourier', init:{mode:'reihe', key:'rect', N:15}, caption:R`Modus „Fourier-Reihe“: Teilsumme $S_N$ (blau) und die periodisch fortgesetzte Funktion (grün gestrichelt). Beim Rechteck zeigt die Anzeige die Höhe des Überschwingers relativ zur Sprunghöhe.`},
        reps:{obj:'Die Teilsumme des Rechtecks neben dem Sprung',
          rows:[
            {k:'formel', tex:R`\begin{gathered}S_N(x) = \frac4\pi\sum_{n\ \text{ungerade}}^{N}\frac{\sin nx}{n},\\ \max S_N \to \frac2\pi\operatorname{Si}(\pi) \approx 1{,}179\end{gathered}`},
            {k:'graph', plot:{x:[-0.4, 1.6], y:[-1.4, 1.4], xlab:'x', ylab:'S_N', yticks:[{y:1, lab:'1'}, {y:-1, lab:'-1'}]}, f:x => SQW(x, 15), lab:'S_{15}', f2:x => SQW(x, 41), lab2:'S_{41}',
              cap:R`Beide Teilsummen schwingen bis etwa $1{,}18$ über. $S_{41}$ tut es näher am Sprung und schmaler.`},
            {k:'labor', text:R`Modus „Fourier-Reihe“, Funktion „Rechteck“: Erhöhe „höchste Ordnung N“. Die Anzeige „Überschwingen an der Sprungstelle“ bleibt bei etwa $9\,\%$.`},
            {k:'worte', text:R`An jeder festen Stelle neben dem Sprung trifft die Reihe die Funktion. Es gibt aber immer eine Stelle nahe am Sprung, an der sie um etwa $9\,\%$ der Sprunghöhe darüber hinausschießt.`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Setze für $N$ eine Zahl ein, addiere die Sinusterme und zeichne über $x$. Suche das erste Maximum rechts vom Sprung.`},
            {from:'graph', to:'labor', rule:R`Stell dasselbe $N$ ein und vergleiche die blaue Kurve. Die Anzeige rechnet $(\max S_N - 1)/2$ in Prozent aus.`},
            {from:'labor', to:'worte', rule:R`Verdopple $N$ mehrmals. Bleibt die Prozentzahl gleich, ist die Konvergenz nicht gleichmäßig. Rückt das Maximum näher an den Sprung, konvergiert die Reihe trotzdem an jeder festen Stelle.`}
          ]},
        q:{q:R`Du erhöhst im Labor „höchste Ordnung N“ von $20$ auf $40$. Was zeigt die Anzeige für das Überschwingen?`, tr:{from:'labor', to:'worte'},
          opts:[R`etwa die Hälfte, rund $4{,}5\,\%$`, R`weiterhin etwa $9\,\%$`, R`null, ab $N = 40$ verschwindet es`], a:1,
          ex:R`Die Höhe des Überschwingers strebt gegen etwa $9\,\%$ der Sprunghöhe; bei $N = 20$ und $N = 40$ zeigt die Anzeige beide Male rund $9{,}0\,\%$. Nur die Lage rückt näher an den Sprung.`,
          fb:[R`Halbiert wird nur der Abstand des Maximums vom Sprung, ungefähr $\pi/N$. Die Höhe bleibt.`,
            '',
            R`Für kein endliches $N$ verschwindet das Überschwingen. Das ist der Kern des Gibbs-Phänomens.`]}},
      {id:'mf-t3d', title:'Typischer Fehler: Gibbs heißt nicht „keine Konvergenz“',
        num:{title:R`Die feste Stelle $x = 0{,}5$`, text:R`Bei $N = 5$ liegt der Überschwinger gerade dort: $S_5(0{,}5) \approx 1{,}186$. Bei $N = 101$ ist er längst näher am Sprung, und $S_{101}(0{,}5) \approx 0{,}990$. Bei $N = 401$ ist $S_{401}(0{,}5) \approx 0{,}997$. Die Werte schwanken immer weniger um $f(0{,}5) = 1$.`},
        text:R`Ein verbreiteter Fehlschluss lautet: „Weil der Überschwinger nicht kleiner wird, konvergiert die Reihe nicht.“ Das stimmt nicht. An jeder **festen** Stelle neben dem Sprung konvergiert sie, denn der Überschwinger wandert nach $x \approx \pi/N$ und zieht an jeder Stelle irgendwann vorbei. Was fehlt, ist nur die gleichmäßige Konvergenz: Für jedes $N$ gibt es eine Stelle mit großem Fehler, aber es ist jedes Mal eine andere. Im Mittel konvergiert die Reihe sowieso. **Anwendung:** Ein idealer Tiefpass schneidet die Reihe nach der $N$-ten Harmonischen ab. Das Überschwingen an Flanken heißt in der Elektronik „Ringing“.`,
        q:{q:R`Welche Aussage über die Fourier-Reihe des Rechtecks ist richtig?`,
          opts:[R`Sie konvergiert an keiner Stelle nahe dem Sprung, weil der Überschwinger bleibt.`, R`Sie konvergiert an jeder Stelle, aber nicht gleichmäßig.`, R`Sie konvergiert gleichmäßig, nur langsamer als beim Dreieck.`], a:1,
          ex:R`Punktweise konvergiert sie überall, am Sprung gegen den Mittelwert $0$. Gleichmäßig nicht, weil der Überschwinger von etwa $9\,\%$ bleibt.`,
          fb:[R`An jeder festen Stelle neben dem Sprung zieht der Überschwinger irgendwann vorbei; danach nähert sich $S_N$ dem Wert $1$.`,
            '',
            R`Gleichmäßig hieße: Der größte Fehler über alle $x$ geht gegen null. Neben dem Sprung gibt es aber für jedes $N$ eine Stelle, an der $S_N$ um etwa $0{,}18$ über $1$ hinausschießt.`]}}
    ]},
    /* ===== Abschnitt 4: Transformation, Gauß, Plancherel, Ort ↔ Spektrum ===== */
    {id:'mf-t4', title:'Von der Reihe zur Fourier-Transformation', steps:[
      {id:'mf-t4a', title:'Die Periode wächst: Wellenzahlen rücken zusammen',
        num:{title:'Drei Perioden', text:R`Mit der Periode $L$ sind die erlaubten Wellenzahlen $k_n = \tfrac{2\pi n}{L}$. Für $L = 2\pi$ liegen sie im Abstand $\Delta k = 1$, für $L = 20\pi$ im Abstand $0{,}1$, für $L = 200\pi$ im Abstand $0{,}01$. Im Intervall $0 \le k < 1$ liegen dann $1$, $10$ und $100$ von ihnen.`},
        text:R`Eine Funktion auf der ganzen Achse ist meist nicht periodisch. Den Übergang findest du, indem du die Periode $L$ gegen unendlich gehen lässt. Mit der Periode $L$ lautet die Reihe

$$\begin{gathered}f(x) = \sum_nc_n\,e^{ik_nx},\qquad k_n = \frac{2\pi n}{L},\\ c_n = \frac1L\int_{-L/2}^{L/2}f(x)\,e^{-ik_nx}\,dx.\end{gathered}$$

Die Größe $k$ heißt **Wellenzahl**: $e^{ikx}$ wiederholt sich nach der Länge $2\pi/k$. Die erlaubten Wellenzahlen liegen im Abstand $\Delta k = 2\pi/L$. Wird $L$ größer, rücken sie zusammen, bis schließlich jede reelle Zahl $k$ vorkommt.`,
        q:{q:R`Welchen Abstand haben die erlaubten Wellenzahlen bei der Periode $L = 4\pi$?`,
          opts:[R`$2$`, R`$4\pi$`, R`$\tfrac12$`], a:2,
          ex:R`$\Delta k = \tfrac{2\pi}{L} = \tfrac{2\pi}{4\pi} = \tfrac12$.`,
          fb:[R`Das ist $L/(2\pi)$, der Kehrwert. Je größer die Periode, desto kleiner der Abstand.`,
            R`$4\pi$ ist die Periode im Ort. Der Abstand in $k$ ist $2\pi$ geteilt durch die Periode.`,
            '']}},
      {id:'mf-t4b', title:'Aus der Summe wird ein Integral',
        num:{title:'Ein Kasten der Breite 2', text:R`$\psi(x) = 1$ für $|x| < 1$, sonst $0$:

$$\begin{aligned}\varphi(k) &= \frac{1}{\sqrt{2\pi}}\int_{-1}^1e^{-ikx}\,dx\\ &= \frac{1}{\sqrt{2\pi}}\cdot\frac{2\sin k}{k}.\end{aligned}$$

Bei $k = 0$ ist das $\tfrac{2}{\sqrt{2\pi}} \approx 0{,}798$; die erste Nullstelle liegt bei $k = \pi$.`},
        text:R`Setze $\varphi(k_n) = \tfrac{L}{\sqrt{2\pi}}c_n$. Dann wird die Reihe zu $f(x) = \tfrac{1}{\sqrt{2\pi}}\sum_n\varphi(k_n)e^{ik_nx}\Delta k$, und für $L \to \infty$ wird die Summe zum Integral. Es entsteht die **[[lex:fourier|Fourier-Transformation]]**:

$$\begin{gathered}\varphi(k) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^\infty\psi(x)\,e^{-ikx}\,dx,\\ \psi(x) = \frac{1}{\sqrt{2\pi}}\int_{-\infty}^\infty\varphi(k)\,e^{ikx}\,dk.\end{gathered}$$

Gelesen: $\varphi(k)$ ist das Gewicht der ebenen Welle $e^{ikx}$ in $\psi$. Aus der Spalte der $c_n$ wird eine Funktion von $k$, das Spektrum. Die ebenen Wellen sind die uneigentlichen Eigenfunktionen von $-i\,d/dx$ aus M5.`,
        q:{q:R`Was ist $\varphi(0)$, ausgedrückt durch $\psi$?`,
          opts:['$\\tfrac{1}{\\sqrt{2\\pi}}\\int|\\psi(x)|^2\\,dx$', '$\\tfrac{1}{\\sqrt{2\\pi}}\\int\\psi(x)\\,dx$', '$\\tfrac{1}{\\sqrt{2\\pi}}\\psi(0)$'], a:1,
          ex:R`Bei $k = 0$ ist $e^{-ikx} = 1$. Übrig bleibt das Integral über $\psi$, also die Fläche, geteilt durch $\sqrt{2\pi}$.`,
          fb:['Im Integral steht $\\psi$ selbst, nicht $|\\psi|^2$: Bei $k = 0$ wird nur $e^{-ikx}$ zu $1$.', '', '$\\varphi(0)$ hängt von allen Werten von $\\psi$ ab, nicht nur von dem bei $x = 0$.']}},
      {id:'mf-t4c', title:'Die Gauß-Funktion: quadratische Ergänzung',
        pre:{from:'m-analysis', seg:'ma-t3', title:'Gauß-Integral', text:R`$\int_{-\infty}^\infty e^{-\alpha x^2}dx = \sqrt{\pi/\alpha}$ für $\alpha > 0$. Mit linearem Term ergänzt man quadratisch: $-\alpha x^2 + bx = -\alpha\left(x - \tfrac{b}{2\alpha}\right)^2 + \tfrac{b^2}{4\alpha}$. Mini-Beispiel: $\int e^{-x^2/2}dx = \sqrt{2\pi}$.`},
        num:{title:R`$k = 1$ und $k = 2$`, text:R`Das Ergebnis der Herleitung, $\varphi(k) = e^{-k^2/2}$, gibt $\varphi(1) = e^{-1/2} \approx 0{,}607$ und $\varphi(2) = e^{-2} \approx 0{,}135$. Dieselben Zahlen hat $\psi(x) = e^{-x^2/2}$ bei $x = 1$ und $x = 2$.`},
        text:R`Die wichtigste Transformierte überhaupt gehört zur Gauß-Funktion $e^{-x^2/2}$. Der Trick ist die [[lex:quadratische-ergaenzung|quadratische Ergänzung]] im Exponenten. Du fasst $-\tfrac{x^2}{2} - ikx$ zu einem vollständigen Quadrat in $x + ik$ zusammen; übrig bleibt ein Faktor, der nur von $k$ abhängt. Das restliche Integral ist ein Gauß-Integral, auch wenn die Mitte ins Komplexe verschoben ist. Das Ergebnis: Die Gauß-Funktion geht in sich selbst über,

$$e^{-x^2/2}\ \mapsto\ e^{-k^2/2}.$$

Merke sie dir. Viele andere Transformierte folgen aus ihr mit den Regeln in Abschnitt 5.`,
        derive:{ctx:{coords:['k', 'x'], params:{}}, lines:[
          {l:'1/sqrt(2π) ∫_-∞^∞ e^(-x^2/2) e^(-i k x) dx = 1/sqrt(2π) ∫_-∞^∞ e^(-(x + i k)^2/2) e^(-k^2/2) dx', w:'quadratische Ergänzung', why:{q:'Warum gilt $-\\frac{x^2}{2} - ikx = -\\frac{(x + ik)^2}{2} - \\frac{k^2}{2}$?', opts:['Weil $(x + ik)^2 = x^2 + 2ikx - k^2$ ist; halbiert und negiert bleibt $+\\frac{k^2}{2}$ übrig.', 'Weil $(ik)^2 = +k^2$ ist und sich die Terme aufheben.', 'Weil man $ik$ wie eine reelle Konstante zu $x$ addieren darf.'], a:0, ex:'$-\\frac12(x^2 + 2ikx - k^2) = -\\frac{x^2}{2} - ikx + \\frac{k^2}{2}$. Damit die Gleichung stimmt, muss man $e^{-k^2/2}$ dazuschreiben.'}},
          {l:'= e^(-k^2/2) · 1/sqrt(2π) ∫_-∞^∞ e^(-(x + i k)^2/2) dx', w:'$e^{-k^2/2}$ hängt nicht von $x$ ab'},
          {l:'= e^(-k^2/2)', w:'die Verschiebung ins Komplexe ändert das Gauß-Integral √(2π) nicht', why:{q:'Woran erkennst du, dass das Ergebnis plausibel ist?', opts:['$\\varphi(0) = 1$ ist die Fläche unter $\\psi$ durch $\\sqrt{2\\pi}$.', 'Es ist reell, und Transformierte sind immer reell.', 'Es ist größer als $\\psi$, wie bei jeder Transformation.'], a:0, ex:'Nach dem letzten Schritt ist $\\varphi(0) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi\\,dx$, hier $\\frac{\\sqrt{2\\pi}}{\\sqrt{2\\pi}} = 1$. Außerdem fällt $\\varphi$ für große $|k|$ ab. Reell ist $\\varphi$ hier nur, weil $\\psi$ gerade und reell ist.'}}
        ]},
        q:{q:R`Welchen Wert hat die Transformierte von $e^{-x^2/2}$ an der Stelle $k = 3$?`,
          opts:[R`$e^{-3/2}$`, R`$\tfrac{1}{\sqrt{2\pi}}e^{-9/2}$`, R`$e^{-9/2}$`], a:2,
          ex:R`$\varphi(k) = e^{-k^2/2}$, also $\varphi(3) = e^{-9/2} \approx 0{,}011$.`,
          fb:[R`Im Exponenten steht $k^2$, nicht $k$: $e^{-3^2/2}$.`,
            R`Der Vorfaktor $\tfrac{1}{\sqrt{2\pi}}$ hebt sich gegen das Gauß-Integral $\sqrt{2\pi}$ weg.`,
            '']}},
      {id:'mf-t4d', title:'Plancherel und die Konventionen',
        num:{title:'Beide Seiten der Gauß-Funktion', text:R`$\int_{-\infty}^\infty|e^{-x^2/2}|^2dx = \int e^{-x^2}dx = \sqrt\pi \approx 1{,}772$, und ebenso $\int|e^{-k^2/2}|^2dk = \sqrt\pi$. Die Norm bleibt gleich.`},
        text:R`In diesem Tutorial steht $\tfrac{1}{\sqrt{2\pi}}$ symmetrisch vor beiden Integralen. Dann gilt die **Plancherel-Gleichung**

$$\int|\psi(x)|^2\,dx = \int|\varphi(k)|^2\,dk.$$

Sie ist die Parseval-Gleichung für das Kontinuum: Eine normierte Funktion hat eine normierte Transformierte. Andere Bücher setzen $\tfrac{1}{2\pi}$ ganz auf eine Seite oder schreiben $e^{+ikx}$ in die Hintransformation. Die Ergebnisse unterscheiden sich dann um Faktoren $\sqrt{2\pi}$ oder durch $k \to -k$. Prüfe deshalb die Konvention, bevor du Formeln aus verschiedenen Quellen mischst.`,
        q:{q:R`$\psi$ ist normiert. Was ist $\int_{-\infty}^\infty|\varphi(k)|^2dk$?`,
          opts:[R`$2\pi$`, R`$1$`, R`$1/\sqrt{2\pi}$`], a:1,
          ex:R`Plancherel in der symmetrischen Konvention: Die Norm bleibt erhalten.`,
          fb:[R`$2\pi$ käme heraus, wenn man $\varphi$ ohne den Vorfaktor $\tfrac{1}{\sqrt{2\pi}}$ definiert.`,
            '',
            R`Der Vorfaktor steht in $\varphi$ und wird beim Betragsquadrat mitgenommen; er bleibt nicht übrig.`]}},
      {id:'mf-t4e', title:'Funktion und Spektrum nebeneinander',
        num:{title:'Ein schmaler und ein breiter Kasten', text:R`Der Kasten der Breite $2$ hat $\varphi(k) = \tfrac{1}{\sqrt{2\pi}}\tfrac{2\sin k}{k}$ mit der ersten Nullstelle bei $k = \pi$. Ein Kasten der Breite $4$, also $\psi = 1$ für $|x| < 2$, hat $\varphi(k) = \tfrac{1}{\sqrt{2\pi}}\tfrac{2\sin2k}{k}$: erste Nullstelle bei $k = \tfrac\pi2$, Höhe bei $k = 0$ doppelt so groß.`},
        text:R`Jetzt hast du zwei Gestalten derselben Funktion. Im Ort sagt $\psi(x)$, wie groß die Funktion an jeder Stelle ist. Im Spektrum sagt $\varphi(k)$, wie stark jede Wellenzahl beteiligt ist. Zwischen ihnen übersetzt die Fourier-Transformation, in beide Richtungen mit demselben Bauplan, nur mit umgekehrtem Vorzeichen im Exponenten. Schon das Beispiel zeigt eine Regel, die Abschnitt 6 genauer macht: Ist die Funktion breiter, wird das Spektrum schmaler. Die Tafel stellt die Gestalten nebeneinander und schlägt die Brücke zur Physik.`,
        reps:{obj:R`Der Kasten $\psi(x) = 1$ für $|x| < 1$ im Ort und im Spektrum`,
          rows:[
            {k:'ort', tex:R`\psi(x) = \begin{cases}1, & |x| < 1\\ 0, & \text{sonst}\end{cases}`},
            {k:'formel', tex:R`\begin{aligned}\varphi(k) &= \frac{1}{\sqrt{2\pi}}\int_{-1}^1e^{-ikx}\,dx\\ &= \frac{1}{\sqrt{2\pi}}\,\frac{2\sin k}{k}\end{aligned}`},
            {k:'graph', plot:{x:[-12, 12], y:[-0.3, 1.15], xlab:R`x\ \text{bzw.}\ k`, ylab:R`\text{Wert}`, ticks:[{x:-Math.PI, lab:R`-\pi`}, {x:-1, lab:'-1'}, {x:1, lab:'1'}, {x:Math.PI, lab:R`\pi`}]}, f:x => (Math.abs(x) < 1 ? 1 : 0), lab:R`\psi(x)`, f2:k => BOXFT(k), lab2:R`\varphi(k)`,
              cap:R`Der Kasten (durchgezogen) hat die Breite $2$. Das Hauptmaximum des Spektrums (gestrichelt) reicht von $-\pi$ bis $\pi$, danach folgen Nebenmaxima mit wechselndem Vorzeichen.`},
            {k:'worte', text:R`Ein scharf begrenzter Bereich im Ort braucht viele Wellenzahlen. Das Spektrum klingt nur langsam ab und wechselt das Vorzeichen.`},
            {k:'physik', text:R`**Ausblick (Thema 4 und 6):** In der Quantenmechanik ist $\hbar k$ der Impuls. $\varphi(k)$ heißt dann Impulsdarstellung, und für normiertes $\psi$ ist $|\varphi(k)|^2dk$ die Wahrscheinlichkeit, eine Wellenzahl zwischen $k$ und $k + dk$ zu messen.`}
          ],
          links:[
            {from:'ort', to:'formel', rule:R`Multipliziere $\psi$ mit $e^{-ikx}$, integriere über $x$ und teile durch $\sqrt{2\pi}$. Wo $\psi = 0$ ist, trägt nichts bei.`},
            {from:'formel', to:'graph', rule:R`Zeichne $\varphi$ über $k$ auf derselben Achse wie $\psi$ über $x$. Suche den Wert bei $k = 0$ und die erste Nullstelle.`},
            {from:'graph', to:'worte', rule:R`Vergleiche die Breiten: Kasten von $-1$ bis $1$, Hauptmaximum von $-\pi$ bis $\pi$. Ein Sprung im Ort zeigt sich als langsames Abklingen in $k$.`},
            {from:'worte', to:'physik', rule:R`Ersetze „Wellenzahl $k$“ durch „Impuls $\hbar k$“ und „Gewicht“ durch „Wahrscheinlichkeitsdichte $|\varphi(k)|^2$“.`}
          ]},
        q:{q:R`Welches Spektrum hat ein Kasten der Breite $2a$, also $\psi = 1$ für $|x| < a$?`, tr:{from:'ort', to:'formel'},
          opts:[R`$\tfrac{1}{\sqrt{2\pi}}\,\tfrac{2\sin(k/a)}{k}$`, R`$\tfrac{1}{\sqrt{2\pi}}\,\tfrac{2\sin k}{ak}$`, R`$\tfrac{1}{\sqrt{2\pi}}\,\tfrac{2\sin(ka)}{k}$`], a:2,
          ex:R`$\int_{-a}^ae^{-ikx}dx = \tfrac{e^{-ika} - e^{ika}}{-ik} = \tfrac{2\sin(ka)}{k}$. Für $a = 1$ ergibt sich das Beispiel.`,
          fb:[R`Die Grenze $a$ landet im Exponenten als $e^{\pm ika}$, also als Produkt $ka$, nicht als Quotient.`,
            R`Prüfe bei $k = 0$: Das Spektrum muss $\tfrac{2a}{\sqrt{2\pi}}$ sein, die Fläche des Kastens geteilt durch $\sqrt{2\pi}$. Hier käme $\tfrac{2}{a\sqrt{2\pi}}$ heraus.`,
            '']}}
    ]},
    /* ===== Abschnitt 5: Rechenregeln ===== */
    {id:'mf-t5', title:'Rechenregeln: Verschiebung, Phase, Ableitung', steps:[
      {id:'mf-t5a', title:'Eine Verschiebung im Ort gibt eine Phase',
        num:{title:'Ein verschobener Kasten', text:R`Der Kasten $\psi(x) = 1$ für $|x| < 1$, um $a = 3$ nach rechts verschoben, ist $\psi(x - 3) = 1$ für $2 < x < 4$. Direkt gerechnet:

$$\begin{aligned}&\frac{1}{\sqrt{2\pi}}\int_2^4e^{-ikx}\,dx\\ &= e^{-3ik}\cdot\frac{1}{\sqrt{2\pi}}\,\frac{2\sin k}{k}.\end{aligned}$$

Der Betrag ist derselbe wie vorher, nur eine Phase $e^{-3ik}$ kommt dazu.`},
        text:R`Die meisten Transformierten musst du nicht neu ausrechnen. Aus einer bekannten folgen viele andere mit wenigen **[[lex:fourier-regeln|Rechenregeln]]**. Sei $\psi(x) \mapsto \varphi(k)$. Die erste Regel: Eine Verschiebung im Ort gibt eine Phase im Spektrum,

$$\psi(x - a)\ \mapsto\ e^{-ika}\,\varphi(k).$$

Die Herleitung zeigt das mit der Substitution $u = x - a$. Wegen $|e^{-ika}| = 1$ ändert sich $|\varphi(k)|^2$ nicht. Die Funktion liegt nur woanders; ihre Mischung aus Wellenzahlen bleibt dieselbe. Den Ort merkt sich das Spektrum in der Phase.`,
        derive:{ctx:{coords:['k', 'x', 'u'], params:{a:'real'}, abstract:{ψ:{args:['x']}}, defs:{'φ(k)':'1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-i k x) dx'}}, lines:[
          {l:'1/sqrt(2π) ∫_-∞^∞ ψ(x - a) e^(-i k x) dx = 1/sqrt(2π) ∫_-∞^∞ ψ(u) e^(-i k (u + a)) du', w:'u = x − a, du = dx', why:{q:'Warum ändern sich die Grenzen nicht?', opts:['Weil mit $x$ auch $u = x - a$ von $-\\infty$ bis $\\infty$ läuft.', 'Weil $a$ klein gegen die Breite von $\\psi$ ist.', 'Weil $\\psi$ eine gerade Funktion ist.'], a:0, ex:'Eine Verschiebung bildet $\\mathbb R$ auf sich ab. Auf einem endlichen Intervall würden sich die Grenzen mitverschieben.'}},
          {l:'= e^(-i k a) φ(k)', w:'$e^{-ika}$ hängt nicht von $u$ ab', why:{q:'Welche Regel ergibt sich daraus für $\\psi(x + 2)$?', opts:['$e^{2ik}\\varphi(k)$', '$e^{-2ik}\\varphi(k)$', '$\\varphi(k + 2)$'], a:0, ex:'$\\psi(x + 2) = \\psi(x - a)$ mit $a = -2$, also $e^{-ika} = e^{2ik}$.'}}
        ]},
        q:{q:R`Was ist die Transformierte von $\psi(x - 5)$?`,
          opts:[R`$e^{5ik}\varphi(k)$`, R`$e^{-5ik}\varphi(k)$`, R`$\varphi(k - 5)$`], a:1,
          ex:R`Mit $a = 5$: $\psi(x - 5) \mapsto e^{-5ik}\varphi(k)$. Der Betrag $|\varphi|$ bleibt gleich.`,
          fb:[R`Vorzeichen prüfen: Verschiebung um $+a$ gibt $e^{-ika}$, hier also $e^{-5ik}$.`,
            '',
            R`Eine Verschiebung im Ort verschiebt nicht das Spektrum, sie gibt ihm eine Phase. Verschoben wird das Spektrum durch eine Phase im Ort (nächster Schritt).`]}},
      {id:'mf-t5b', title:'Eine Phase im Ort verschiebt das Spektrum',
        num:{title:R`$e^{3ix}e^{-x^2/2}$`, text:R`Im Integral steht $e^{3ix}e^{-ikx} = e^{-i(k - 3)x}$. Also ist die Transformierte die der Gauß-Funktion an der Stelle $k - 3$:

$$e^{3ix}e^{-x^2/2}\ \mapsto\ e^{-(k - 3)^2/2}.$$

Ihr Maximum liegt jetzt bei $k = 3$ statt bei $0$.`},
        text:R`Die zweite Regel ist das Spiegelbild der ersten. Eine Phase im Ort verschiebt das Spektrum:

$$e^{ik_0x}\,\psi(x)\ \mapsto\ \varphi(k - k_0).$$

Das siehst du direkt, ohne Substitution: Die beiden Exponentialfaktoren im Integral fassen sich zu $e^{-i(k - k_0)x}$ zusammen. Gelesen: Multiplizierst du mit einer ebenen Welle der Wellenzahl $k_0$, schiebst du alle Wellenzahlen um $k_0$. Achte auf die Vorzeichen. Verschiebung um $+a$ im Ort gibt $e^{-ika}$, Phase $e^{+ik_0x}$ gibt Verschiebung um $+k_0$. **Ausblick (Thema 4):** So gibt man einem Wellenpaket einen mittleren Impuls.`,
        q:{q:R`Was ist die Transformierte von $e^{-2ix}\psi(x)$?`,
          opts:[R`$\varphi(k - 2)$`, R`$\varphi(k + 2)$`, R`$e^{-2ik}\varphi(k)$`], a:1,
          ex:R`Hier ist $k_0 = -2$, also $\varphi(k - k_0) = \varphi(k + 2)$: Das Spektrum rückt um $2$ nach links.`,
          fb:[R`$\varphi(k - 2)$ gehört zu $e^{+2ix}\psi$. Mit $e^{-2ix}$ ist $k_0 = -2$.`,
            '',
            R`Eine Phase $e^{-2ik}$ im Spektrum gehört zu einer Verschiebung im Ort, $\psi(x - 2)$.`]}},
      {id:'mf-t5c', title:R`Eine Ableitung gibt den Faktor $ik$`,
        num:{title:'Abgeleitete Gauß-Funktion', text:R`$\psi(x) = e^{-x^2/2}$ hat die Ableitung $\psi'(x) = -x\,e^{-x^2/2}$. Die Regel unten sagt: $\psi' \mapsto ik\,e^{-k^2/2}$. Bei $k = 1$ ist das $i\,e^{-1/2} \approx 0{,}607\,i$. Bei $k = 0$ ist es null, passend dazu, dass $\int\psi'\,dx = 0$ ist.`},
        text:R`Die dritte Regel macht aus einer Ableitung eine Multiplikation:

$$\psi'(x)\ \mapsto\ ik\,\varphi(k).$$

Der Grund ist die partielle Integration. Sie verschiebt die Ableitung von $\psi$ auf $e^{-ikx}$, und das liefert $-(-ik) = ik$. Der Randterm verschwindet, weil $\psi$ im Unendlichen abfällt. Zweimal angewandt gilt $\psi'' \mapsto (ik)^2\varphi = -k^2\varphi$. Gelesen: Im Spektrum wird Ableiten zum Multiplizieren mit $ik$. Deshalb wird eine Differentialgleichung, in der nur $\psi$ und seine Ableitungen mit festen Zahlen davor vorkommen, im $k$-Raum algebraisch. Aus $\psi'' - 4\psi$ etwa wird $(-k^2 - 4)\,\varphi(k)$: Statt abzuleiten, multiplizierst du mit einer Zahl (mehr dazu in M7). Die Tafel zeigt, was das für die Physik bedeutet.`,
        reps:{obj:'Die Ableitung im Ort und im Spektrum',
          rows:[
            {k:'ort', tex:R`\begin{gathered}\psi(x) = e^{-x^2/2},\\ \psi'(x) = -x\,e^{-x^2/2},\\ \psi''(x) = (x^2 - 1)\,e^{-x^2/2}\end{gathered}`},
            {k:'formel', tex:R`\begin{gathered}\psi'\ \mapsto\ ik\,e^{-k^2/2},\\ -i\,\psi'\ \mapsto\ k\,e^{-k^2/2},\\ \psi''\ \mapsto\ -k^2\,e^{-k^2/2}\end{gathered}`},
            {k:'graph', plot:{x:[-4, 4], y:[-0.8, 0.8], xlab:R`x\ \text{bzw.}\ k`, ylab:R`\text{Wert}`}, f:x => -x * Math.exp(-x * x / 2), lab:R`\psi'(x)`, f2:k => k * Math.exp(-k * k / 2), lab2:R`k\,e^{-k^2/2}`,
              cap:R`Durchgezogen: $\psi'(x)$. Gestrichelt: $k\,e^{-k^2/2}$, die Transformierte von $\psi'$ geteilt durch $i$. Der Faktor $k$ macht aus der geraden Gauß-Funktion eine ungerade mit Nullstelle bei $k = 0$.`},
            {k:'physik', text:R`**Ausblick (Thema 4 und 6):** Der Impulsoperator $-i\hbar\,d/dx$ wird im $k$-Raum zur Multiplikation mit $\hbar k$, die kinetische Energie $-\tfrac{\hbar^2}{2m}\tfrac{d^2}{dx^2}$ zur Multiplikation mit $\tfrac{\hbar^2k^2}{2m}$. Im Spektrum ist der Impuls einfach eine Zahl.`}
          ],
          links:[
            {from:'ort', to:'formel', rule:R`Ersetze jedes $d/dx$ durch den Faktor $ik$ und transformiere den Rest. Zweimal ableiten heißt zweimal $ik$, also $-k^2$.`},
            {from:'formel', to:'graph', rule:R`Zeichne $\psi'$ über $x$ und die Transformierte geteilt durch $i$ über $k$. Ein Faktor $k$ macht aus einer geraden Funktion eine ungerade.`},
            {from:'graph', to:'physik', rule:R`Lies $k$ als Impuls in Einheiten von $\hbar$: Wo das Spektrum bei großem $|k|$ liegt, ist der Impuls groß.`}
          ]},
        q:{q:R`Was ist die Transformierte von $\psi''(x)$?`, tr:{from:'ort', to:'formel'},
          opts:[R`$k^2\varphi(k)$`, R`$-ik^2\varphi(k)$`, R`$-k^2\varphi(k)$`], a:2,
          ex:R`Zweimal die Ableitungsregel: $(ik)^2\varphi = -k^2\varphi$. Deshalb ist $-\tfrac{\hbar^2}{2m}\psi''$ im $k$-Raum $\tfrac{\hbar^2k^2}{2m}\varphi$.`,
          fb:[R`Das Vorzeichen fehlt: $(ik)^2 = i^2k^2 = -k^2$.`,
            R`Das $i$ wird mitquadriert: $(ik)^2 = -k^2$, ohne übrig bleibendes $i$.`,
            '']}},
      {id:'mf-t5d', title:'Streckung: breit im Ort, schmal im Spektrum',
        num:{title:'Eine doppelt so breite Gauß-Funktion', text:R`$\psi(x/2) = e^{-x^2/8}$ ist doppelt so breit wie $e^{-x^2/2}$. Die Regel unten mit $s = 2$ gibt $2\,e^{-2k^2}$: halb so breit und doppelt so hoch. Probe mit Plancherel: $\int e^{-x^2/4}dx = 2\sqrt\pi$ und $\int4e^{-4k^2}dk = 4\cdot\tfrac{\sqrt\pi}{2} = 2\sqrt\pi$.`},
        text:R`Die vierte Regel betrifft die Breite. Für $s > 0$ gilt

$$\psi(x/s)\ \mapsto\ s\,\varphi(sk).$$

Gelesen: Ist $\psi$ um den Faktor $s$ breiter, wird $\varphi$ um den Faktor $s$ schmaler und um $s$ höher. Der Grund ist die Substitution $u = x/s$. Mit $dx = s\,du$ wird aus $e^{-ikx}$ der Faktor $e^{-i(sk)u}$, und das Integral ist $s$ mal $\varphi$ an der Stelle $sk$. Für die Gauß-Funktion folgt daraus die gestreckte Form $e^{-x^2/(2s^2)} \mapsto s\,e^{-s^2k^2/2}$. Das bereitet Abschnitt 6 vor.`,
        q:{q:R`Was ist die Transformierte von $e^{-x^2/18}$?`,
          opts:[R`$\tfrac13\,e^{-k^2/18}$`, R`$3\,e^{-k^2/18}$`, R`$3\,e^{-9k^2/2}$`], a:2,
          ex:R`$e^{-x^2/18} = e^{-x^2/(2\cdot9)}$, also $s = 3$: $3\,e^{-9k^2/2}$. Breit im Ort, schmal im Spektrum.`,
          fb:[R`Die Breite wandert in den Kehrwert: Im Spektrum steht $s^2k^2$ im Zähler des Exponenten, nicht $k^2/s^2$.`,
            R`Der Vorfaktor stimmt, aber der Exponent nicht: Aus $x^2/(2s^2)$ wird $s^2k^2/2$.`,
            '']}},
      {id:'mf-t5e', title:'Typischer Fehler: Vorzeichen und Rolle der Phase',
        num:{title:'Substitution in einer Zeile', text:R`Für $\psi(x + 2)$ setze $u = x + 2$, also $x = u - 2$. Dann ist $e^{-ikx} = e^{-iku}\,e^{2ik}$, und

$$\psi(x + 2)\ \mapsto\ e^{2ik}\,\varphi(k).$$

Eine Verschiebung nach links gibt die Phase $e^{+2ik}$.`},
        text:R`Die vier Regeln verwechselt man leicht. Häufig ist das falsche Vorzeichen: Bei der Verschiebung um $+a$ entsteht $e^{-ika}$, nicht $e^{+ika}$. Ebenso häufig ist die Verwechslung von Phase und Verschiebung: $\psi(x - a)$ ändert nur die Phase des Spektrums, $e^{ik_0x}\psi(x)$ verschiebt es. Ein dritter Fehler ist, die Transformierte eines Produkts für das Produkt der Transformierten zu halten. Wer unsicher ist, substituiert. Das dauert eine Zeile und ist sicherer als jede Merkregel.`,
        q:{q:R`Jemand schreibt: $\psi(x - 4) \mapsto \varphi(k - 4)$. Was ist falsch?`,
          opts:[R`Nichts, denn Verschiebungen bleiben Verschiebungen.`, R`Phase und Verschiebung vertauscht; richtig: $e^{-4ik}\varphi(k)$.`, R`Nur das Vorzeichen; richtig ist $\varphi(k + 4)$.`], a:1,
          ex:R`Eine Verschiebung im Ort wird zur Phase im Spektrum. $\varphi(k - 4)$ gehört zu $e^{4ix}\psi(x)$.`,
          fb:[R`Im Spektrum wird aus einer Verschiebung eine Phase. Rechne nach: $u = x - 4$ liefert den Faktor $e^{-4ik}$.`,
            '',
            R`Auch $\varphi(k + 4)$ wäre eine Verschiebung im Spektrum. Die gehört zu einer Phase im Ort, nicht zu $\psi(x - 4)$.`]}}
    ]},
    /* ===== Abschnitt 6: Breiten ===== */
    {id:'mf-t6', title:'Breiten: je schmaler im Ort, desto breiter in $k$', steps:[
      {id:'mf-t6a', title:'Breite als Standardabweichung',
        num:{title:'Eine einfache Verteilung', text:R`Eine Größe nehme die Werte $-1$ und $+1$ je mit der Wahrscheinlichkeit $\tfrac12$ an. Ihr Mittelwert ist $0$, das mittlere Quadrat des Abstands $\tfrac12\cdot1 + \tfrac12\cdot1 = 1$, die Standardabweichung also $1$. Bei den Werten $\pm2$ wäre sie $2$: Sie misst, wie weit die Werte typisch vom Mittelwert entfernt sind.`},
        text:R`Breiten misst man mit der **Standardabweichung**, der Wurzel aus dem mittleren Quadrat des Abstands vom Mittelwert. Für eine Funktion mit $\int|\psi|^2dx = 1$ ist $|\psi(x)|^2$ eine Verteilung über $x$, und

$$\begin{gathered}\langle x\rangle = \int x\,|\psi(x)|^2\,dx,\\ (\Delta x)^2 = \int(x - \langle x\rangle)^2\,|\psi(x)|^2\,dx.\end{gathered}$$

Gelesen: „Mittelwert von x“ ist die Lage, „Delta x“ die Breite. Wegen Plancherel ist $|\varphi(k)|^2$ ebenfalls eine Verteilung mit der Fläche $1$. Ganz analog misst $\Delta k$ die Breite des Spektrums. **Ausblick (M9):** Dort wird die Standardabweichung allgemein behandelt.`,
        q:{q:R`Die Verteilung $|\psi|^2$ wird als Ganzes um $5$ nach rechts verschoben. Was passiert mit $\langle x\rangle$ und $\Delta x$?`,
          opts:[R`Beide wachsen um $5$.`, R`$\Delta x$ wächst um $5$, $\langle x\rangle$ bleibt.`, R`$\langle x\rangle$ wächst um $5$, $\Delta x$ bleibt.`], a:2,
          ex:R`Die Lage rückt mit, die Breite ist ein Abstand vom Mittelwert und ändert sich nicht.`,
          fb:[R`Die Breite misst Abstände vom Mittelwert. Rücken alle Werte um $5$, bleiben die Abstände gleich.`,
            R`Genau umgekehrt: Die Lage ändert sich, die Breite nicht.`,
            '']}},
      {id:'mf-t6b', title:R`Das Gauß-Paket: $\Delta x = \sigma$`,
        num:{title:R`$\sigma = 2$`, text:R`$\psi(x) = (8\pi)^{-1/4}e^{-x^2/16}$ hat $|\psi|^2 = \tfrac{1}{\sqrt{8\pi}}e^{-x^2/8}$, eine Normalverteilung mit der Standardabweichung $2$. Also ist $\Delta x = 2$. Ihre Transformierte $\varphi(k) = (8/\pi)^{1/4}e^{-4k^2}$ hat $\Delta k = \tfrac14$.`},
        text:R`Für das **Gauß-Paket**

$$\psi(x) = (2\pi\sigma^2)^{-1/4}\,e^{-x^2/(4\sigma^2)}$$

ist $|\psi|^2$ eine Normalverteilung, also die Gauß-Kurve $\tfrac{1}{\sqrt{2\pi\sigma^2}}e^{-x^2/(2\sigma^2)}$ mit der Fläche $1$ und der Standardabweichung $\sigma$. Die Herleitung zeigt $\langle x^2\rangle = \sigma^2$. Weil $|\psi|^2$ gerade ist, ist $\langle x\rangle = 0$ und damit $\Delta x = \sigma$. Die Transformierte ist wieder eine Gauß-Funktion, $\varphi(k) = (2\sigma^2/\pi)^{1/4}e^{-\sigma^2k^2}$. Für sie ergibt dieselbe Rechnung $\Delta k = 1/(2\sigma)$ (Übungsaufgabe 3). Beachte die $4\sigma^2$ im Exponenten von $\psi$: Erst im Quadrat $|\psi|^2$ steht $2\sigma^2$, wie bei einer Normalverteilung.`,
        derive:{ctx:{coords:['x'], params:{σ:'pos'}, defs:{'ψ(x)':'(2π σ^2)^(-1/4) e^(-x^2/(4σ^2))'}}, lines:[
          {l:'|ψ(x)|^2 = 1/sqrt(2π σ^2) e^(-x^2/(2σ^2))', w:'quadriert: Normalverteilung mit Varianz σ²'},
          {l:'⟨x^2⟩ = ∫_-∞^∞ x^2 |ψ(x)|^2 dx', w:'⟨x⟩ = 0, weil |ψ|² gerade ist', why:{q:R`Warum ist $\langle x\rangle = 0$?`, opts:['Weil $|\\psi|^2$ gerade ist, also $x|\\psi|^2$ ungerade.', 'Weil $\\psi$ normiert ist, also die Fläche $1$ hat.', 'Weil $\\sigma$ die Standardabweichung ist.'], a:0, ex:R`Das Integral einer ungeraden Funktion über $\mathbb R$ ist null. Die Normierung allein legt die Lage nicht fest.`}},
          {l:'= 1/sqrt(2π σ^2) · σ^2 sqrt(2π σ^2)', w:'$\\int x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = \\frac{1}{2\\sigma^2}$', why:{q:'Woher kommt der Faktor $\\sigma^2\\sqrt{2\\pi\\sigma^2}$?', opts:['$\\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = \\frac{1}{2\\sigma^2}$', '$\\sqrt{\\pi/\\alpha}$ mit $\\alpha = \\frac{1}{2\\sigma^2}$ allein', 'aus einem Randterm der partiellen Integration'], a:0, ex:'$\\frac{1}{2\\alpha} = \\sigma^2$ und $\\sqrt{\\pi/\\alpha} = \\sqrt{2\\pi\\sigma^2}$. Ohne den Faktor $\\frac{1}{2\\alpha}$ wäre das nur die Normierung.'}},
          {l:'= σ^2', w:'gekürzt: also Δx = σ'}
        ]},
        q:{q:R`Ein Gauß-Paket hat $\Delta x = 0{,}5$. Welches $\Delta k$ hat es?`,
          opts:[R`$0{,}25$`, R`$2$`, R`$1$`], a:2,
          ex:R`$\Delta k = \tfrac{1}{2\sigma} = \tfrac{1}{2\cdot0{,}5} = 1$. Probe: $\Delta x\,\Delta k = \tfrac12$.`,
          fb:[R`Das ist $\sigma/2$. Die Breite im Spektrum ist der Kehrwert: $\tfrac{1}{2\sigma}$.`,
            R`Das ist $\tfrac1\sigma$; der Faktor $\tfrac12$ fehlt.`,
            '']}},
      {id:'mf-t6c', title:'Breite mal Breite bleibt fest',
        num:{title:'Drei Breiten', text:R`$\sigma = 0{,}5$: $\Delta x\,\Delta k = 0{,}5\cdot1 = \tfrac12$. $\sigma = 1$: $1\cdot\tfrac12 = \tfrac12$. $\sigma = 2$: $2\cdot\tfrac14 = \tfrac12$. Wie du $\sigma$ auch wählst, das Produkt bleibt.`},
        text:R`Für das Gauß-Paket ist

$$\Delta x\,\Delta k = \sigma\cdot\frac{1}{2\sigma} = \frac12,$$

unabhängig von $\sigma$. Im Labor kannst du das sehen. Die blaue Kurve ist $|\psi(x)|^2$, die rote $|\varphi(k)|^2$, beide auf derselben Achse. Die hell hinterlegten Streifen markieren $\pm\Delta x$ und $\pm\Delta k$. Ziehst du den Regler „Breite σ“ nach rechts, wird der blaue Streifen breiter und der rote schmaler. Die Anzeige rechnet das Produkt aus: Es bleibt $0{,}500$. Die Tafel verbindet Formel, Bild und Physik.`,
        fig:{lab:'fourier', init:{mode:'trafo', sg:1}, caption:R`Modus „Fourier-Transformation (Gauß)“: $|\psi(x)|^2$ (blau) und $|\varphi(k)|^2$ (rot) mit den Breiten $\Delta x = \sigma$ und $\Delta k = 1/(2\sigma)$. Das Produkt bleibt $\tfrac12$.`},
        reps:{obj:'Das Gauß-Paket im Ort und im Spektrum',
          rows:[
            {k:'ort', tex:R`\begin{gathered}\psi(x) = (2\pi\sigma^2)^{-1/4}e^{-x^2/(4\sigma^2)},\\ \Delta x = \sigma\end{gathered}`},
            {k:'formel', tex:R`\begin{gathered}\varphi(k) = \left(\frac{2\sigma^2}{\pi}\right)^{1/4}e^{-\sigma^2k^2},\\ \Delta k = \frac{1}{2\sigma}\end{gathered}`},
            {k:'graph', plot:{x:[-5, 5], y:[0, 1.75], xlab:R`x\ \text{bzw.}\ k`, ylab:R`\text{Dichte}`}, f:x => Math.exp(-x * x / 8) / Math.sqrt(8 * Math.PI), lab:R`|\psi(x)|^2,\ \sigma = 2`, f2:k => Math.sqrt(8 / Math.PI) * Math.exp(-8 * k * k), lab2:R`|\varphi(k)|^2`,
              cap:R`Mit $\sigma = 2$: breit und flach im Ort ($\Delta x = 2$), schmal und hoch im Spektrum ($\Delta k = \tfrac14$). Beide Flächen sind $1$.`},
            {k:'labor', text:R`Modus „Fourier-Transformation (Gauß)“: Der Regler „Breite σ“ ändert $\sigma$; die Anzeige zeigt $\Delta x$, $\Delta k$ und ihr Produkt $0{,}500$.`},
            {k:'physik', text:R`**Ausblick (Thema 4 und 6):** Mit $p = \hbar k$ wird daraus $\Delta x\,\Delta p = \hbar/2$. Ein Teilchen, dessen Ort eng eingegrenzt ist, hat einen breit gestreuten Impuls, und umgekehrt.`}
          ],
          links:[
            {from:'ort', to:'formel', rule:R`Transformiere mit quadratischer Ergänzung oder mit der Streckungsregel. Im Exponenten wandert $\sigma$ vom Nenner in den Zähler.`},
            {from:'formel', to:'graph', rule:R`Zeichne $|\psi|^2$ über $x$ und $|\varphi|^2$ über $k$ auf derselben Achse. Markiere $\pm\Delta x$ und $\pm\Delta k$.`},
            {from:'graph', to:'labor', rule:R`Stell denselben Wert von $\sigma$ ein. Blau ist $|\psi|^2$, rot $|\varphi|^2$; die Streifen sind $\pm\Delta x$ und $\pm\Delta k$.`},
            {from:'labor', to:'physik', rule:R`Multipliziere die angezeigte Breite $\Delta k$ mit $\hbar$: Das ist die Impulsbreite $\Delta p$.`}
          ]},
        q:{q:R`Im Labor stellst du „Breite σ“ von $1$ auf $0{,}5$. Was macht die rote Kurve?`, tr:{from:'labor', to:'formel'},
          opts:[R`Sie wird halb so breit und doppelt so hoch.`, R`Sie bleibt gleich; nur die blaue ändert sich.`, R`Sie wird doppelt so breit und halb so hoch.`], a:2,
          ex:R`$\Delta k = \tfrac{1}{2\sigma}$ wächst von $\tfrac12$ auf $1$. Die Höhe $\sqrt{2/\pi}\,\sigma$ halbiert sich, damit die Fläche $1$ bleibt.`,
          fb:[R`So verhält sich die blaue Kurve. Die rote reagiert gegenläufig.`,
            R`Beide Kurven hängen von $\sigma$ ab, in entgegengesetzter Richtung.`,
            '']}},
      {id:'mf-t6d', title:'Die Breitenrelation für jede Funktion',
        num:{title:R`Die Funktion $e^{-|x|}$`, text:R`$\psi(x) = e^{-|x|}$ ist normiert und hat $\Delta x = \tfrac{1}{\sqrt2} \approx 0{,}707$. Ihre Transformierte $\varphi(k) = \sqrt{\tfrac2\pi}\,\tfrac{1}{1 + k^2}$ hat $\Delta k = 1$. Das Produkt $0{,}707$ liegt über $\tfrac12$.`},
        text:R`Für jede Funktion mit $\int|\psi|^2dx = 1$ gilt die **[[lex:breitenrelation|Breitenrelation]]**

$$\Delta x\,\Delta k \ge \frac12.$$

Gleichheit gilt nur für Gauß-Funktionen, auch verschobene und solche mit einer Phase $e^{ik_0x}$. Jede andere Form liegt darüber, wie das Beispiel mit dem Knick bei $x = 0$ zeigt. Den Beweis führt Thema 6 mit der Cauchy-Schwarz-Ungleichung. Die Relation ist eine Eigenschaft von Wellen, keine Folge ungeschickten Messens: Ein kurzer Ton enthält viele Frequenzen, und ein schmaler Spalt beugt Licht in einen weiten Winkelbereich. **Ausblick:** Mit $p = \hbar k$ wird daraus die [[lex:unschaerfe|Unschärferelation]] $\Delta x\,\Delta p \ge \hbar/2$.`,
        q:{q:R`Für welche normierte Funktion ist $\Delta x\,\Delta k$ am kleinsten?`,
          opts:[R`für eine Kastenfunktion: $0$`, R`für eine Funktion mit Knick: $\tfrac14$`, R`für eine Gauß-Funktion: $\tfrac12$`], a:2,
          ex:R`Die Schranke $\tfrac12$ gilt für alle normierten Funktionen und wird nur von Gauß-Funktionen erreicht.`,
          fb:[R`Beim Kasten ist $\Delta k$ sogar unendlich (letzter Schritt dieses Abschnitts). Null kann das Produkt nie werden.`,
            R`Unter $\tfrac12$ kommt keine Funktion. $e^{-|x|}$ mit Knick hat $0{,}707$.`,
            '']}},
      {id:'mf-t6e', title:'Grenzfälle: ebene Welle und δ',
        pre:{from:'m-analysis', seg:'ma-t5', title:'Die δ-Distribution', text:R`$\delta(x - a)$ wirkt nur im Integral: $\int\delta(x - a)\,f(x)\,dx = f(a)$. Sie greift den Wert von $f$ an der Stelle $a$ heraus. Mini-Beispiel: $\int\delta(x - 2)\,x^2\,dx = 4$.`},
        num:{title:'Immer schmalere Gauß-Pakete', text:R`$\sigma = 0{,}1$: $\Delta x = 0{,}1$ und $\Delta k = 5$. $\sigma = 0{,}01$: $\Delta x = 0{,}01$ und $\Delta k = 50$. Im Grenzfall $\sigma \to 0$ wird $|\psi|^2$ zur δ-Spitze und das Spektrum unendlich breit und flach.`},
        text:R`Treibt man die Breiten ins Extreme, landet man bei zwei Grenzfällen. Die δ-Funktion ist im Ort scharf. Ihr Spektrum ist konstant, $\frac{1}{\sqrt{2\pi}}\int\delta(x)\,e^{-ikx}dx = \frac{1}{\sqrt{2\pi}}$, denn δ greift den Wert $e^{0} = 1$ heraus: Ein scharfer Punkt enthält alle Wellenzahlen gleich stark. Umgekehrt ist die ebene Welle $e^{ik_0x}$ im Ort unendlich ausgedehnt und im Spektrum scharf: $\sqrt{2\pi}\,\delta(k - k_0)$. Beide liegen an den Enden der Breitenrelation, mit einer Breite null und einer unendlichen. Und beide sind nicht normierbar. Sie liegen also nicht in $L^2$ und beschreiben keine möglichen Zustände (M5). Nützlich sind sie trotzdem, als Bausteine: Jede normierbare Funktion ist eine Überlagerung ebener Wellen, mit dem Spektrum $\varphi(k)$ als Gewicht.`,
        q:{q:R`Welches Spektrum hat $\psi(x) = e^{5ix}$?`,
          opts:[R`$\tfrac{1}{\sqrt{2\pi}}$, eine Konstante`, R`$e^{-5ik}$`, R`$\sqrt{2\pi}\,\delta(k - 5)$`], a:2,
          ex:R`Eine ebene Welle mit $k_0 = 5$ hat genau eine Wellenzahl: eine δ-Spitze bei $k = 5$.`,
          fb:[R`Ein konstantes Spektrum gehört zur δ-Spitze im Ort, $\delta(x)$.`,
            R`$e^{-5ik}$ ist das Spektrum von $\delta(x - 5)$, bis auf den Faktor $\tfrac{1}{\sqrt{2\pi}}$.`,
            '']}},
      {id:'mf-t6f', title:'Typischer Fehler: Hauptmaximum und Standardabweichung verwechseln',
        num:{title:R`Der Kasten der Breite $a$`, text:R`$\psi = \tfrac{1}{\sqrt a}$ für $|x| < \tfrac a2$ hat $\varphi(k) = \sqrt{\tfrac{2}{\pi a}}\,\tfrac{\sin(ka/2)}{k}$. Das Hauptmaximum reicht von $-\tfrac{2\pi}{a}$ bis $\tfrac{2\pi}{a}$. Aber $|\varphi|^2$ fällt nur wie $1/k^2$ ab, und $\int k^2|\varphi|^2dk$ divergiert: $\Delta k = \infty$.`},
        text:R`Ein verbreiteter Fehler: die Breite des Hauptmaximums für $\Delta k$ halten. Beim Kasten der Breite $a$ wird das Hauptmaximum breiter, wenn der Kasten schmaler wird; das passt zur Faustregel. Die Standardabweichung $\Delta k$ ist aber unendlich. Der Grund sind die Sprünge des Kastens. Sie lassen das Spektrum nur langsam abfallen, wie bei den Fourier-Reihen in Abschnitt 2, und die weit entfernten Nebenmaxima tragen zu $\int k^2|\varphi|^2dk$ unbegrenzt bei. Die Breitenrelation gilt trotzdem, nur eben als $\infty \ge \tfrac12$. Für Abschätzungen ist das Hauptmaximum nützlich; für $\Delta k$ zählt die Standardabweichung.`,
        q:{q:'Eine Dreiecksfunktion hat keine Sprünge, nur Knicke. Ihr Spektrum fällt wie $|\\varphi|^2 \\sim 1/k^4$ ab. Ist ihr $\\Delta k$ endlich?',
          opts:['Nein: Wie beim Kasten divergiert $\\int k^2|\\varphi|^2dk$ durch die Nebenmaxima.', 'Ja: $k^2|\\varphi|^2 \\sim 1/k^2$, und das Integral darüber ist endlich.', 'Ja, weil $\\Delta k$ die Breite des Hauptmaximums ist, und die ist endlich.'], a:1,
          ex:'$k^2|\\varphi|^2 \\sim k^2/k^4 = 1/k^2$, und $\\int^\\infty dk/k^2$ ist endlich. Ohne Sprünge fällt das Spektrum schnell genug ab. Beim Kasten dagegen ist $k^2|\\varphi|^2 \\sim \\sin^2(ka/2)$, und das Integral wächst ohne Grenze.',
          fb:['Beim Kasten ist $k^2|\\varphi|^2 \\sim \\sin^2(ka/2)$ und fällt gar nicht ab. Hier fällt es wie $1/k^2$, und das Integral bleibt endlich.', '', 'Das Ergebnis stimmt, die Begründung nicht: $\\Delta k$ ist die Standardabweichung. Sie hängt am Abfall des Spektrums, nicht an der Breite des Hauptmaximums.']}}
    ]}
  ],
  example:{
    title:'Fourier-Reihe der Rechteckschwingung',
    text:'$f(x) = \\operatorname{sgn}(x)$ auf $(-\\pi, \\pi)$, also $-1$ links und $+1$ rechts, wird $2\\pi$-periodisch fortgesetzt. Weil $f$ ungerade ist, verschwinden alle $a_n$. Bestimme $b_n = \\frac1\\pi\\int_{-\\pi}^\\pi f(x)\\sin(nx)\\,dx$ für $n = 1, 2, \\dots$',
    ctx:PER({'f(x)':'sgn(x)'}),
    lines:[
      {l:'b_n = 1/π ∫_-π^π f(x) sin(n x) dx', why:{q:'Warum steht hier $\\frac1\\pi$ und nicht $\\frac{1}{2\\pi}$?', opts:['$\\int_{-\\pi}^\\pi\\sin^2(nx)\\,dx = \\pi$; durch diese Norm wird geteilt.', 'Das ist eine reine Konvention ohne Grund.', 'Weil $f$ ungerade ist und man nur über $[0, \\pi]$ integriert.'], a:0, ex:'Die Funktionen $\\sin(nx)$ sind orthogonal, aber nicht normiert. Der Koeffizient ist die Projektion geteilt durch $\\|\\sin nx\\|^2 = \\pi$ (vgl. M5).'}},
      {l:'= 2/π ∫_0^π sin(n x) dx', why:{q:'Warum darf man auf $[0, \\pi]$ integrieren und verdoppeln?', opts:['$f(x)\\sin(nx)$ ist gerade: ungerade mal ungerade.', 'Weil $f = 0$ für $x < 0$ gilt und links nichts beiträgt.', 'Weil $\\sin(nx)$ auf $[0, \\pi]$ nie negativ wird.'], a:0, ex:'Für $x > 0$ ist $f = 1$; die linke Hälfte liefert denselben Beitrag noch einmal.'}},
      {l:'= 2/π [-cos(n x)/n]_0^π', why:{q:'Welche Stammfunktion steckt hier?', opts:['$\\int\\sin(nx)\\,dx = -\\cos(nx)/n$', '$\\int\\sin(nx)\\,dx = n\\cos(nx)$', '$\\int\\sin(nx)\\,dx = \\cos(nx)/n$'], a:0, ex:'Ableiten zur Probe: $\\frac{d}{dx}(-\\cos(nx)/n) = \\sin(nx)$.'}},
      {l:'= 2/(nπ) (1 - cos(nπ))', why:{q:'Wie fasst man $\\cos(n\\pi)$ zusammen?', opts:['$\\cos(n\\pi) = (-1)^n$', '$\\cos(n\\pi) = 0$', '$\\cos(n\\pi) = 1$'], a:0, ex:'$\\cos\\pi = -1$, $\\cos 2\\pi = 1$, …'}},
      {l:'= 2/(nπ) (1 - (-1)^n)', why:{q:'Wie sieht die Reihe damit aus?', opts:['$f(x) = \\frac4\\pi\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\dots\\right)$', '$f(x) = \\frac4\\pi\\left(\\sin x + \\sin 3x + \\sin 5x + \\dots\\right)$', '$f(x) = \\frac2\\pi\\left(\\sin x + \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} + \\dots\\right)$'], a:0, ex:'Für gerade $n$ ist $b_n = 0$, für ungerade $b_n = 4/(n\\pi)$. Die Koeffizienten fallen nur wie $1/n$ – typisch für eine Funktion mit Sprung.'}}
    ],
    faded:{id:'mf-fade', title:'Jetzt du: der Sägezahn $f(x) = x$', text:'$f(x) = x$ auf $(-\\pi, \\pi)$, $2\\pi$-periodisch fortgesetzt. Auch diese Funktion ist ungerade. Bestimme $b_n$ mit partieller Integration.',
      ctx:PER({'f(x)':'x'}),
      given:['b_n = 1/π ∫_-π^π x sin(n x) dx', '= 2/π ∫_0^π x sin(n x) dx'],
      goals:[{id:'a', prompt:'Bestimme $b_n$.', type:'value', target:'2 (-1)^(n+1)/n', points:3,
        hints:['Die Symmetrie ist schon genutzt. Integriere $x\\sin(nx)$ partiell so, dass der Faktor $x$ beim Ableiten verschwindet.', 'Partiell integrieren mit $u = x$, $v\' = \\sin(nx)$, also $v = -\\cos(nx)/n$.', 'Das Restintegral $\\int_0^\\pi\\cos(nx)\\,dx$ ist null; der Randterm ist $-\\pi(-1)^n/n$.'],
        model:['b_n = 1/π ∫_-π^π x sin(n x) dx', '= 2/π ∫_0^π x sin(n x) dx', {l:'= 2/π ([-x cos(n x)/n]_0^π + 1/n ∫_0^π cos(n x) dx)', gap:'= 2/π ([▢]_0^π + 1/n ∫_0^π cos(n x) dx)'}, '= 2/π (-π (-1)^n/n + 0)', '= 2 (-1)^(n+1)/n'],
        mistakes:[{expr:'2 (-1)^n/n', msg:'Vorzeichen: Der Randterm ist $-\\pi\\cos(n\\pi)/n = -\\pi(-1)^n/n$, also $b_n = 2(-1)^{n+1}/n$.'}]}]}
  },
  puzzle:{
    title:'Zwei Pakete statt einem',
    text:'Ein Gauß-Paket $g(x) = e^{-x^2/2}$ hat die Transformierte $G(k) = e^{-k^2/2}$. Jetzt sitzen zwei gleiche Pakete nebeneinander, eines bei $x = -d$ und eines bei $x = +d$:\n\n$$\\psi(x) = g(x + d) + g(x - d),\\qquad d = 5.$$\n\nWie sieht die Verteilung $|\\varphi(k)|^2$ der Wellenzahl aus?',
    q:{q:'Deine Vermutung:', opts:['wie bei einem Paket, nur viermal so hoch', 'eine Glocke mit Streifen: Nullstellen im Abstand $\\pi/d$', 'zwei Glocken, bei $k = -d$ und $k = +d$', 'eine Glocke, doppelt so breit wie bei einem Paket'], a:1, ex:'$\\varphi(k) = (e^{ikd} + e^{-ikd})\\,G(k) = 2\\cos(kd)\\,G(k)$, also $|\\varphi|^2 = 4\\cos^2(kd)\\,e^{-k^2}$.'},
    reveal:'Die Verschiebungsregel (Abschnitt 5) gibt $g(x \\mp d) \\mapsto e^{\\mp ikd}G(k)$. Die Summe ist\n\n$$\\varphi(k) = \\left(e^{ikd} + e^{-ikd}\\right)G(k) = 2\\cos(kd)\\,G(k),\\qquad |\\varphi(k)|^2 = 4\\cos^2(kd)\\,e^{-k^2}.$$\n\nUnter der Glocke $e^{-k^2}$ liegen Streifen. Nullstellen hat $\\cos(kd)$ bei $kd = \\frac\\pi2 + m\\pi$, also im Abstand $\\pi/d$. Je weiter die Pakete auseinander liegen, desto enger die Streifen.\n\nDas ist der Interferenzterm aus M1, diesmal im $k$-Raum: Die beiden Phasen $e^{\\pm ikd}$ haben die relative Phase $2kd$. Einzeln hätte jedes Paket dieselbe glatte Verteilung $e^{-k^2}$; die Verschiebung allein ändert $|\\varphi|^2$ nicht. Erst die Überlagerung erzeugt das Muster. „Viermal so hoch“ stimmt nur bei $k = 0$ und an den anderen Maxima, im Mittel über die Streifen sind es zweimal.\n\nAusblick: Genau so entsteht das Doppelspaltmuster. Im Fernfeld legt die Wellenzahl quer zu den Spalten die Richtung fest, und die Intensität ist proportional zu $|\\varphi(k)|^2$ der Überlagerung beider Spalte.'
  },
  clarify:{
    core:'**Fourier-Reihe.** Eine $2\\pi$-periodische Funktion lässt sich nach dem vollständigen Orthogonalsystem $e^{inx}$ entwickeln:\n\n$$f(x) = \\sum_{n=-\\infty}^\\infty c_ne^{inx},\\quad c_n = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi f(x)e^{-inx}dx,\\qquad \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi|f|^2dx = \\sum_n|c_n|^2.$$\n\nReell: $f = \\frac{a_0}{2} + \\sum_{n\\ge1}(a_n\\cos nx + b_n\\sin nx)$ mit $a_n = \\frac1\\pi\\int f\\cos nx\\,dx$, $b_n = \\frac1\\pi\\int f\\sin nx\\,dx$. Gerade Funktionen haben nur $a_n$, ungerade nur $b_n$.\n\n**Fourier-Transformation** (für nicht periodische Funktionen auf $\\mathbb R$):\n\n$$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^\\infty\\psi(x)e^{-ikx}dx,\\qquad \\psi(x) = \\frac{1}{\\sqrt{2\\pi}}\\int_{-\\infty}^\\infty\\varphi(k)e^{ikx}dk,\\qquad \\int|\\psi|^2dx = \\int|\\varphi|^2dk.$$\n\nWichtige Regeln: $\\psi(x - a) \\mapsto e^{-ika}\\varphi(k)$, $e^{ik_0x}\\psi(x) \\mapsto \\varphi(k - k_0)$, $\\psi\'(x) \\mapsto ik\\,\\varphi(k)$. Eine Gauß-Funktion geht in eine Gauß-Funktion über; je schmaler $\\psi$, desto breiter $\\varphi$, mit $\\Delta x\\,\\Delta k \\ge \\frac12$.',
    keys:[
      'Erst Symmetrie prüfen: Bei geraden oder ungeraden Funktionen fällt die Hälfte der Koeffizienten weg, und man integriert nur über $[0, \\pi]$.',
      'Entscheidend ist die $2\\pi$-periodische Fortsetzung: Ist sie glatt, fallen die Koeffizienten schnell ab. Ein Sprung – auch einer, der erst durch die Fortsetzung entsteht wie beim Sägezahn – gibt $1/n$, ein Knick $1/n^2$.',
      'Konvention beachten: Hier steht $\\frac{1}{\\sqrt{2\\pi}}$ symmetrisch in Hin- und Rücktransformation. Andere Bücher setzen $\\frac{1}{2\\pi}$ ganz auf eine Seite.',
      'Mit $p = \\hbar k$ ist $|\\varphi(k)|^2$ die Wahrscheinlichkeitsdichte der Wellenzahl; aus $\\Delta x\\,\\Delta k \\ge \\frac12$ wird $\\Delta x\\,\\Delta p \\ge \\frac\\hbar2$.',
      'Gauß-Integrale mit komplexem linearem Term: $\\int e^{-\\alpha x^2 + bx}dx = \\sqrt{\\pi/\\alpha}\\,e^{b^2/(4\\alpha)}$ gilt auch für $b = -ik$.'
    ],
    errors:[
      '$(-ik)^2 = +k^2$ rechnen. Richtig ist $(-ik)^2 = -k^2$, sonst wächst $\\varphi(k)$ für große $k$.',
      'Den Vorfaktor verwechseln: $\\frac1\\pi$ bei $a_n, b_n$, aber $\\frac{1}{2\\pi}$ bei $c_n$ und beim Mittelwert $a_0/2$.',
      'Bei der Verschiebung das Vorzeichen der Phase vertauschen: $\\psi(x - a) \\mapsto e^{-ika}\\varphi(k)$.',
      'Erwarten, dass die Fourier-Reihe an einer Sprungstelle den Funktionswert trifft: Sie liefert dort den Mittelwert, und ihre Teilsummen schwingen daneben über.'
    ],
    more:[{title:'Vom Ortsraum zum Impulsraum', text:'Setzt man $k = p/\\hbar$ und $\\tilde\\psi(p) = \\varphi(p/\\hbar)/\\sqrt\\hbar$ (der Faktor $1/\\sqrt\\hbar$ sorgt für $\\int|\\tilde\\psi|^2dp = 1$), wird die Transformation zu $\\tilde\\psi(p) = \\frac{1}{\\sqrt{2\\pi\\hbar}}\\int\\psi(x)e^{-ipx/\\hbar}dx$. Die Ableitungsregel $\\psi\' \\mapsto ik\\varphi$ bedeutet dann: Der Impulsoperator $-i\\hbar\\,d/dx$ wirkt im Impulsraum als Multiplikation mit $p$. Das ist der Grund, warum man freie Teilchen so bequem im $k$-Raum behandelt (Thema 4).'}],
    checks:[
      {q:'$f$ ist gerade und $2\\pi$-periodisch. Welche Koeffizienten sind null?', opts:['alle $b_n$', 'alle $a_n$', 'keine'], a:0, ex:'$f(x)\\sin(nx)$ ist dann ungerade und integriert sich über $[-\\pi, \\pi]$ zu null.'},
      {q:'$\\psi(x)$ hat die Transformierte $\\varphi(k)$. Was ist die Transformierte von $\\psi(x - 3)$?', opts:['$e^{-3ik}\\varphi(k)$', '$\\varphi(k - 3)$', '$e^{3ik}\\varphi(k)$'], a:0, ex:'Substitution $u = x - 3$: $\\int\\psi(u)e^{-ik(u+3)}du = e^{-3ik}\\sqrt{2\\pi}\\varphi(k)$. $|\\varphi|^2$ ändert sich nicht.'}
    ]
  },
  lab:{type:'fourier', title:'Teilsummen und Breiten',
    map:[
      {sym:R`S_N(x) = \sum_{|n|\le N}c_ne^{inx}`, ctl:'Fourier-Reihe', says:R`Modus „Fourier-Reihe“: Die blaue Kurve ist die Teilsumme $S_N$ bis zur $N$-ten Harmonischen, die grün gestrichelte die Funktion selbst, periodisch fortgesetzt.`},
      {sym:R`\operatorname{sgn}x,\ x,\ |x|`, ctl:'Rechteck', says:R`Auswahl „Funktion“: Rechteck $\operatorname{sgn}x$ und Sägezahn $x$ springen (Koeffizienten wie $1/n$), das Dreieck $|x|$ knickt nur (wie $1/n^2$). Die Anzeige nennt die jeweilige Reihe.`},
      {sym:R`N`, ctl:'höchste Ordnung N', says:R`Die höchste Harmonische der Teilsumme, wie die Grenzfrequenz eines idealen Tiefpasses. Beim Rechteck und beim Dreieck tragen nur ungerade $n$ bei.`},
      {sym:R`\frac{\max S_N - 1}{2}`, ctl:'Überschwingen an der Sprungstelle', says:R`Höhe des Gibbs-Überschwingers relativ zur Sprunghöhe. Sie strebt für $N \to \infty$ gegen etwa $9\,\%$, statt gegen null: Die Reihe konvergiert nicht gleichmäßig.`},
      {sym:R`\max|S_N - f|`, ctl:'größte Abweichung', says:R`Beim stetigen Dreieck meldet die Anzeige statt des Überschwingers den größten Fehler; er geht mit wachsendem $N$ gegen null.`},
      {sym:R`\varphi(k) = \tfrac{1}{\sqrt{2\pi}}\int\psi(x)e^{-ikx}dx`, ctl:'Fourier-Transformation (Gauß)', says:R`Modus „Fourier-Transformation (Gauß)“: blau $|\psi(x)|^2$ für das Gauß-Paket, rot $|\varphi(k)|^2$, beide auf derselben waagerechten Achse „x bzw. k“.`},
      {sym:R`\sigma = \Delta x`, ctl:'Breite σ', says:R`Breite des Gauß-Pakets im Ort. Die hellen Streifen markieren $\pm\Delta x = \pm\sigma$ (blau) und $\pm\Delta k = \pm\tfrac{1}{2\sigma}$ (rot); die Anzeige zeigt das Produkt $\Delta x\,\Delta k = \tfrac12$ für jedes $\sigma$.`}
    ],
    sketch:{id:'mf-lab-s', kind:'curve', draw:'abs2', title:'Vorhersage: die Breite im $k$-Raum',
      text:'Gleich zeigt das Labor im Modus „Fourier-Transformation (Gauß)“ die Dichten $|\\psi(x)|^2$ und $|\\varphi(k)|^2$. Für $\\sigma = 0{,}5$ ist $|\\psi(x)|^2$ eine Normalverteilung mit $\\Delta x = 0{,}5$. Skizziere vorher $|\\varphi(k)|^2$. Die Achse ist absolut. Stell danach diesen Modus und $\\sigma = 0{,}5$ ein und vergleiche mit der roten Kurve.',
      plot:{x:[-6, 6], y:[-0.25, 1], abs:true, xlab:'k', ylab:'|\\varphi(k)|^2', ticks:[{x:-4, lab:'-4'}, {x:-2, lab:'-2'}, {x:0, lab:'0'}, {x:2, lab:'2'}, {x:4, lab:'4'}], yticks:[{y:0.2, lab:'0{,}2'}, {y:0.4, lab:'0{,}4'}, {y:0.6, lab:'0{,}6'}, {y:0.8, lab:'0{,}8'}]},
      // |φ(k)|² = √(2/π)·σ·e^{−2σ²k²}, σ = 0,5: Höhe 0,399, Δk = 1/(2σ) = 1, Halbwertsbreite 2,355, Fläche 1 (Plancherel)
      f:k => Math.sqrt(2 / Math.PI) * 0.5 * Math.exp(-2 * 0.25 * k * k),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann $|\\varphi(k)|^2$ negativ sein?'},
        {id:'lage', type:'maxat', x:0, tol:0.4, msg:'$\\psi$ ist reell und gerade. Wo liegt dann das Maximum von $|\\varphi(k)|^2$?'},
        {id:'breite', type:'fwhm', v:2.355, tol:0.3, msg:'Wie hängt $\\Delta k$ mit $\\Delta x = \\sigma$ zusammen: wird $|\\varphi|^2$ schmaler oder breiter als $|\\psi|^2$? Auf halber Höhe ist deine Kurve {got} breit. (Abschnitt „Breiten“)'},
        {id:'flaeche', type:'area', range:[-4.5, 4.5], v:1, tol:0.25, msg:'Welche Fläche hat $|\\varphi(k)|^2$, wenn $\\psi$ normiert ist? Deine ist etwa {got}.'}
      ],
      reveal:'$|\\varphi(k)|^2 = \\sqrt{2/\\pi}\\,\\sigma\\,e^{-2\\sigma^2k^2}$ ist wieder eine Normalverteilung, mit $\\Delta k = 1/(2\\sigma) = 1$, also doppelt so breit wie $|\\psi(x)|^2$ mit $\\Delta x = 0{,}5$. Nach Plancherel ist ihre Fläche ebenfalls 1; darum ist sie nur halb so hoch ($\\approx 0{,}40$). Im Labor siehst du beide Kurven gegenläufig: Machst du $\\sigma$ kleiner, wird die blaue schmaler und die rote breiter, und $\\Delta x\\,\\Delta k = \\frac12$ bleibt.',
      hints:['Bestimme zuerst $\\Delta k$ aus $\\Delta x$, dann die Höhe aus der Fläche.', 'Für das Gauß-Paket gilt $\\Delta x\\,\\Delta k = \\frac12$. Eine Normalverteilung mit Standardabweichung $s$ hat die Höhe $1/(\\sqrt{2\\pi}\\,s)$ und auf halber Höhe die Breite $2{,}35\\,s$.'],
      wrong:[
        {f:k => Math.exp(-k * k / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.5), fails:['breite'], why:'gleiche Breite wie |ψ|² (Δk = Δx)'},
        {f:k => Math.exp(-k * k / (2 * 4)) / (Math.sqrt(2 * Math.PI) * 2), fails:['breite'], why:'Δk = 1/σ statt 1/(2σ)'},
        {f:k => 2 * Math.sqrt(2 / Math.PI) * 0.5 * Math.exp(-2 * 0.25 * k * k), fails:['flaeche'], why:'gleiche Höhe wie |ψ|²: Plancherel übersehen'}
      ]},
    text:'**Modus „Fourier-Reihe“:** Wähle eine $2\\pi$-periodische Funktion (Rechteck, Sägezahn oder Dreieck) auf $[-\\pi, \\pi]$ und mit dem Regler „höchste Ordnung $N$“ ($1$ bis $40$) die Teilsumme bis $n = N$. Beim Rechteck und beim Dreieck tragen nur ungerade $n$ bei. Beim Rechteck und beim Sägezahn zeigt die Anzeige das Überschwingen an der Sprungstelle; beim Sägezahn nähert es sich langsamer dem Grenzwert von etwa 9 %, bei kleinem $N$ liegt das Maximum sogar noch unter $\\pi$.\n\n**Modus „Fourier-Transformation (Gauß)“:** $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}$ mit $\\sigma$ zwischen $0{,}3$ und $3$. Gezeichnet sind $|\\psi(x)|^2$ und $|\\varphi(k)|^2$, angezeigt $\\Delta x = \\sigma$, $\\Delta k = 1/(2\\sigma)$ und ihr Produkt.',
    predict:{q:'Bevor du den Modus „Fourier-Transformation (Gauß)“ benutzt: Du halbierst $\\sigma$ von $2$ auf $1$, das Paket im Ort wird also schmaler. Was passiert mit der roten Kurve $|\\varphi(k)|^2$?', opts:['Sie wird doppelt so breit und halb so hoch.', 'Sie wird halb so breit und doppelt so hoch.', 'Sie bleibt gleich; nur $|\\psi|^2$ ändert sich.', 'Sie wird doppelt so breit und doppelt so hoch.'], a:0, ex:'$|\\varphi(k)|^2 = \\sqrt{2/\\pi}\\,\\sigma\\,e^{-2\\sigma^2k^2}$: Die Breite geht wie $1/\\sigma$, die Höhe wie $\\sigma$. Die Fläche bleibt $1$ (Plancherel), deshalb kann sie nicht zugleich breiter und höher werden.'},
    questions:[
      {q:'Modus „Fourier-Reihe“, Rechteck. Erhöhe $N$ von $5$ auf $40$. Was passiert mit dem Überschwinger neben der Sprungstelle?', opts:['Er wird schmaler, bleibt aber bei etwa 9 % der Sprunghöhe.', 'Er wird schmaler und niedriger und verschwindet schließlich.', 'Er wird mit jedem zusätzlichen Term ein Stück höher.'], a:0, ex:'Das ist das Gibbs-Phänomen. Die Reihe konvergiert trotzdem im quadratischen Mittel, weil die Fläche unter dem Überschwinger gegen null geht.'},
      {q:'Modus „Fourier-Transformation (Gauß)“: Stelle $\\sigma = 2$ ein und dann $\\sigma = 1$. Was passiert mit $\\Delta k$?', opts:['Es verdoppelt sich von $0{,}25$ auf $0{,}5$.', 'Es halbiert sich von $0{,}25$ auf $0{,}125$.', 'Es bleibt bei $0{,}25$, nur $\\Delta x$ ändert sich.'], a:0, ex:'$\\Delta k = 1/(2\\sigma)$, das Produkt $\\Delta x\\,\\Delta k$ bleibt $\\frac12$. Die Gauß-Funktion ist die Funktion mit minimalem Produkt $\\Delta x\\,\\Delta k = \\frac12$.'}
    ],
    noPic:{q:'Ohne Bild: Das Dreieck $|x|$ ist stetig mit Knicken, das Rechteck springt. Wessen Fourier-Koeffizienten fallen schneller ab?', opts:['die des Dreiecks, wie $1/n^2$', 'die des Rechtecks, wie $1/n^2$', 'beide gleich schnell'], a:0, ex:'Beim Rechteck ist $b_n \\propto 1/n$, beim Dreieck $a_n \\propto 1/n^2$. Je glatter die periodisch fortgesetzte Funktion, desto schneller fallen die Koeffizienten.'}},
  compare:{
    text:'Gesucht ist die Fourier-Transformierte von $\\psi(x) = e^{-(x - a)^2/2}$ mit reellem $a$. Bekannt ist $g(k) = e^{-k^2/2}$ als Transformierte von $e^{-x^2/2}$. In der Eingabe heißen die beiden Transformierten `φ(k)` und `g(k)`.',
    ctx:{coords:['k'], params:{a:'real'}, defs:{'φ(k)':'e^(-i k a) e^(-k^2/2)', 'g(k)':'e^(-k^2/2)'}},
    A:{name:'Substituieren', model:['φ(k) = 1/sqrt(2π) ∫_-∞^∞ e^(-(x - a)^2/2) e^(-ikx) dx', {l:'= 1/sqrt(2π) ∫_-∞^∞ e^(-u^2/2) e^(-ik(u + a)) du', w:'u = x − a'}, '= e^(-ika) · 1/sqrt(2π) ∫_-∞^∞ e^(-u^2/2) e^(-iku) du', '= e^(-ika) e^(-k^2/2)']},
    B:{name:'Verschiebungsregel', model:[{l:'φ(k) = e^(-ika) g(k)', w:'ψ(x − a) ↦ e^(−ika) · (Transformierte von ψ)'}, '= e^(-ika) e^(-k^2/2)']},
    questions:[
      {q:'Was ändert die Verschiebung an $|\\varphi(k)|^2$?', opts:['nichts – nur eine Phase kommt hinzu', '$|\\varphi|^2$ verschiebt sich um $a$', '$|\\varphi|^2$ wird breiter, weil das Paket wandert'], a:0, ex:'$|e^{-ika}| = 1$. Ein verschobenes Wellenpaket hat dieselbe Impulsverteilung.'},
      {q:'Welche Regel gilt umgekehrt für $e^{ik_0x}e^{-x^2/2}$?', opts:['$g(k - k_0)$: Verschiebung um $+k_0$', '$e^{-ik_0k}g(k)$: nur eine Phase', '$g(k + k_0)$: Verschiebung um $-k_0$'], a:0, ex:'Eine Phase $e^{ik_0x}$ im Ort verschiebt im $k$-Raum – so gibt man einem Wellenpaket den mittleren Impuls $\\hbar k_0$.'}
    ]
  },
  concept:[
    {id:'mf-c1', type:'mc2', seg:'mf-t3', lex:'gibbs',
      q:'Gegen welchen Wert konvergiert die Fourier-Reihe der Rechteckfunktion $\\operatorname{sgn}x$ im Punkt $x = 0$?', opts:['$0$', '$1$', '$-1$', 'gar nicht, sie divergiert dort'], a:0,
      ex:'Jede Teilsumme ist in $x = 0$ null, denn alle $\\sin 0 = 0$. Hätte man $\\operatorname{sgn}0 = 1$ definiert, käme trotzdem $0$ heraus: Die Koeffizienten hängen nicht vom Wert in einem einzelnen Punkt ab.',
      reason:{q:'Warum?', opts:['An einem Sprung liefert die Reihe den Mittelwert aus links- und rechtsseitigem Grenzwert.', 'Die Reihe trifft immer den Funktionswert, und $\\operatorname{sgn}0 = 0$.', 'Der Gibbs-Überschwinger lässt die Summe dort über alle Grenzen wachsen.'], a:0, ex:'$\\frac12(-1 + 1) = 0$. Dass $\\operatorname{sgn}0$ zufällig auch $0$ ist, ist nicht der Grund. Der Überschwinger ist beschränkt, etwa $1{,}18$, und liegt neben dem Sprung, nicht auf ihm.'}},
    {id:'mf-c2', type:'dialog', seg:'mf-t3', lex:'gibbs',
      text:'Die Teilsummen $S_N$ der Rechteckreihe schwingen neben dem Sprung über. Es geht um die Frage, was für $N \\to \\infty$ passiert.',
      people:[{name:'Lena', says:'Der Überschwinger bleibt bei etwa 9 % der Sprunghöhe; er wird nur schmaler. Die Reihe konvergiert trotzdem, im Mittel und an jeder festen Stelle.'}, {name:'Jonas', says:'Wenn die Reihe konvergiert, muss das Überschwingen mit genug Termen verschwinden. Sonst wäre es keine Konvergenz.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Der Überschwinger rückt mit wachsendem $N$ an den Sprung heran. Eine feste Stelle $x \\ne 0$ verlässt er irgendwann; dort konvergiert $S_N(x)$. Nur gleichmäßige Konvergenz scheitert – Jonas verwechselt beide Begriffe.'},
    {id:'mf-c3', type:'mc2', seg:'mf-t2', lex:'koeffizientenabfall',
      q:'$f(x) = x$ ist auf $(-\\pi, \\pi)$ beliebig oft differenzierbar. Wie fallen die Fourier-Koeffizienten der $2\\pi$-periodischen Fortsetzung ab?', opts:['wie $1/n$', 'schneller als jede Potenz von $1/n$', 'wie $1/n^2$'], a:0,
      ex:'$b_n = 2(-1)^{n+1}/n$. Glatt im Innern reicht nicht: Die Fortsetzung springt bei $\\pm\\pi$ von $\\pi$ auf $-\\pi$.',
      reason:{q:'Warum?', opts:['Entscheidend ist die periodische Fortsetzung, und die springt bei $x = \\pm\\pi$.', 'Glatte Funktionen haben immer schnell abfallende Koeffizienten.', 'Ungerade Funktionen haben stets Koeffizienten wie $1/n^2$.'], a:0, ex:'Die Fourier-Reihe „sieht“ nur die periodische Funktion. Ein Sprung irgendwo in der Periode gibt $1/n$, ein Knick $1/n^2$.'}},
    {id:'mf-c4', type:'dialog', seg:'mf-t6', lex:'breitenrelation',
      text:'Ein Wellenpaket $\\psi(x)$ wird im Ort halb so breit gemacht: $\\psi(x) \\to \\sqrt2\\,\\psi(2x)$.',
      people:[{name:'Lena', says:'Dann wird auch die Wellenzahlverteilung schmaler. Das Paket ist insgesamt schärfer bestimmt.'}, {name:'Jonas', says:'Umgekehrt: $\\psi(x/s)$ hat die Transformierte $s\\,\\varphi(sk)$. Halb so breit im Ort heißt doppelt so breit in $k$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Mit $s = \\frac12$: $\\sqrt2\\,\\psi(2x) \\mapsto \\frac{1}{\\sqrt2}\\varphi(k/2)$, doppelt so breit. $\\Delta x\\,\\Delta k$ bleibt gleich; schärfer in beiden Größen geht nicht, denn $\\Delta x\\,\\Delta k \\ge \\frac12$.'},
    {id:'mf-c5', type:'mc2', seg:'mf-t4', lex:'parseval',
      q:'Ein Lehrbuch definiert $\\tilde\\varphi(k) = \\int\\psi(x)e^{-ikx}dx$, ohne Vorfaktor. Gilt dann $\\int|\\tilde\\varphi|^2dk = \\int|\\psi|^2dx$?', opts:['Nein, es kommt $2\\pi\\int|\\psi|^2dx$ heraus.', 'Ja, Plancherel gilt in jeder Konvention gleich.', 'Nein, es kommt $\\frac{1}{2\\pi}\\int|\\psi|^2dx$ heraus.'], a:0,
      ex:'In dieser Konvention steht der ganze Faktor $\\frac{1}{2\\pi}$ in der Rücktransformation, und Plancherel lautet $\\int|\\tilde\\varphi|^2dk = 2\\pi\\int|\\psi|^2dx$.',
      reason:{q:'Warum?', opts:['$\\tilde\\varphi = \\sqrt{2\\pi}\\,\\varphi$, also $|\\tilde\\varphi|^2 = 2\\pi|\\varphi|^2$.', 'Der Vorfaktor ist reine Schreibweise und ändert keine Integrale.', 'Ohne Vorfaktor wird $\\tilde\\varphi$ um $\\sqrt{2\\pi}$ kleiner als $\\varphi$.'], a:0, ex:'Vorfaktoren gehen quadratisch in $|\\varphi|^2$ ein. Deshalb immer die Konvention prüfen, bevor man Formeln mischt.'}}
  ],
  practice:[
    {id:'mf-p1', title:'Fourier-Reihe der Dreiecksfunktion',
      text:'$f(x) = |x|$ auf $(-\\pi, \\pi)$, $2\\pi$-periodisch fortgesetzt. $f$ ist gerade.',
      ctx:PER({'f(x)':'|x|'}),
      goals:[
        {id:'a', prompt:'a) Berechne den Mittelwert $\\frac{a_0}{2} = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi f(x)\\,dx$.', type:'value', target:'π/2', points:1,
          hints:['Gesucht ist der Mittelwert von $|x|$ über eine Periode.', '$|x|$ ist gerade: $\\int_{-\\pi}^\\pi|x|\\,dx = 2\\int_0^\\pi x\\,dx$.'],
          model:['1/(2π) ∫_-π^π |x| dx = 1/π ∫_0^π x dx', '= 1/π · π^2/2', '= π/2']},
        {id:'b', prompt:'b) Berechne $a_n = \\frac1\\pi\\int_{-\\pi}^\\pi |x|\\cos(nx)\\,dx$ für $n \\ge 1$.', type:'value', target:'2((-1)^n - 1)/(π n^2)', points:3, ph:'a_n = 2/π ∫_0^π x cos(n x) dx',
          hints:['Strategie: erst die Symmetrie ausnutzen, dann einmal partiell integrieren.', 'Der Integrand ist gerade: $a_n = \\frac2\\pi\\int_0^\\pi x\\cos(nx)\\,dx$.', 'Partiell: $\\int_0^\\pi x\\cos(nx)\\,dx = \\left[\\frac{x\\sin nx}{n}\\right]_0^\\pi - \\frac1n\\int_0^\\pi\\sin(nx)\\,dx$.'],
          model:['a_n = 1/π ∫_-π^π |x| cos(n x) dx', '= 2/π ∫_0^π x cos(n x) dx', '= 2/π ([x sin(n x)/n]_0^π - 1/n ∫_0^π sin(n x) dx)', '= 2/π (0 + [cos(n x)/n^2]_0^π)', '= 2((-1)^n - 1)/(π n^2)'],
          mistakes:[{expr:'((-1)^n - 1)/(π n^2)', msg:'Es fehlt der Faktor 2 aus der Symmetrie: $\\int_{-\\pi}^\\pi = 2\\int_0^\\pi$ für gerade Integranden.'}, {expr:'2(1 - (-1)^n)/(π n^2)', msg:'Vorzeichen: $\\left[\\cos(nx)/n^2\\right]_0^\\pi = ((-1)^n - 1)/n^2$.'}],
          note:'Für ungerade $n$ ist $a_n = -4/(\\pi n^2)$: $|x| = \\frac\\pi2 - \\frac4\\pi\\left(\\cos x + \\frac{\\cos 3x}{9} + \\dots\\right)$.'},
        {id:'c', prompt:'c) Bestimme $b_n = \\frac1\\pi\\int_{-\\pi}^\\pi|x|\\sin(nx)\\,dx$.', type:'value', target:'0', points:1,
          hints:['Prüfe zuerst die Symmetrie des Integranden.', '$|x|$ ist gerade, $\\sin nx$ ungerade; ihr Produkt ist ungerade.'],
          model:['b_n = 1/π ∫_-π^π |x| sin(n x) dx', {l:'= 0', w:'Integrand ungerade'}]}
      ]},
    {id:'mf-p2', title:'Komplexe Koeffizienten und Parseval',
      text:'Die Rechteckschwingung $f(x) = \\operatorname{sgn}(x)$ auf $(-\\pi, \\pi)$ aus dem Beispiel, jetzt komplex entwickelt: $f = \\sum_n c_ne^{inx}$.',
      ctx:PER({'f(x)':'sgn(x)'}),
      goals:[
        {id:'a', prompt:'a) Berechne $c_n = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi f(x)e^{-inx}dx$ für $n \\ge 1$.', type:'value', target:'(1 - (-1)^n)/(i π n)', points:3, ph:'c_n = 1/(2π) (∫_0^π e^(-i n x) dx - ∫_-π^0 e^(-i n x) dx)',
          hints:['$f$ ist stückweise konstant; integriere die beiden Stücke getrennt.', 'Teile das Integral bei $x = 0$: rechts $f = 1$, links $f = -1$.', '$\\int_0^\\pi e^{-inx}dx = \\frac{1 - e^{-in\\pi}}{in}$ und $e^{\\pm in\\pi} = (-1)^n$.'],
          model:['c_n = 1/(2π) ∫_-π^π f(x) e^(-i n x) dx', '= 1/(2π) (∫_0^π e^(-i n x) dx - ∫_-π^0 e^(-i n x) dx)', '= 1/(2π) ((1 - e^(-i n π))/(i n) - (e^(i n π) - 1)/(i n))', '= (1 - (-1)^n)/(i π n)'],
          mistakes:[{expr:'2/(i π n)', msg:'Das gilt nur für ungerade $n$; für gerade $n$ ist $c_n = 0$. Beides zusammen: $(1 - (-1)^n)/(i\\pi n)$.'}, {expr:'(1 - (-1)^n)/(2 i π n)', msg:'Prüfe die Summe der beiden Hälften: Jede liefert $(1 - (-1)^n)/(in)$, zusammen das Doppelte.'}],
          note:'Vergleich mit dem Beispiel: $b_n = i(c_n - c_{-n}) = 2(1 - (-1)^n)/(n\\pi)$ ✓'},
        {id:'b', prompt:'b) Berechne die linke Seite der Parseval-Gleichung, $\\frac{1}{2\\pi}\\int_{-\\pi}^\\pi|f|^2dx$.', type:'value', target:'1', points:1,
          hints:['Für die linke Seite brauchst du nur $|f|^2$, keine Koeffizienten.', '$|\\operatorname{sgn}x|^2 = 1$ außer im Punkt $0$.'],
          model:['1/(2π) ∫_-π^π |f(x)|^2 dx = 1/(2π) · 2π', '= 1']},
        {id:'c', prompt:'c) Es ist $c_1 = -2i/\\pi$ und $c_{-1} = 2i/\\pi$. Welchen Anteil der Summe $\\sum|c_n|^2 = 1$ trägt die Grundschwingung, also $|c_1|^2 + |c_{-1}|^2$?', type:'value', target:'8/π^2', points:2,
          hints:['Addiere die Betragsquadrate der beiden angegebenen Koeffizienten.', '$|{\\pm 2i/\\pi}|^2 = 4/\\pi^2$.'],
          model:['|-2i/π|^2 + |2i/π|^2 = 4/π^2 + 4/π^2', '= 8/π^2'],
          note:'$8/\\pi^2 \\approx 0{,}81$: Schon die Grundschwingung trägt 81 %. Die restlichen 19 % verteilen sich auf $n = \\pm3, \\pm5, \\dots$'}
      ]},
    {id:'mf-p3', title:'Gauß-Paket im $k$-Raum',
      text:'$\\psi(x) = (2\\pi\\sigma^2)^{-1/4}\\,e^{-x^2/(4\\sigma^2)}$ ist normiert und hat $\\Delta x = \\sigma$. Nützlich: $\\int e^{-\\alpha x^2 + bx}dx = \\sqrt{\\pi/\\alpha}\\,e^{b^2/(4\\alpha)}$ und $\\int k^2e^{-\\beta k^2}dk = \\frac{1}{2\\beta}\\sqrt{\\pi/\\beta}$. In der Eingabe heißt die Transformierte `φ(k)`.',
      ctx:{coords:['k'], params:{σ:'pos'}, defs:{'φ(k)':'(2σ^2/π)^(1/4) e^(-σ^2 k^2)'}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\varphi(k)$.', type:'value', target:'(2σ^2/π)^(1/4) e^(-σ^2 k^2)', points:3, ph:'φ(k) = 1/sqrt(2π) (2π σ^2)^(-1/4) ∫_-∞^∞ e^(-x^2/(4σ^2) - i k x) dx',
          hints:['Das ist ein Gauß-Integral mit linearem Term im Exponenten; die Formel steht im Aufgabentext.', 'Hier ist $\\alpha = 1/(4\\sigma^2)$ und $b = -ik$.', '$b^2/(4\\alpha) = (-ik)^2\\sigma^2 = -\\sigma^2k^2$ und $\\sqrt{\\pi/\\alpha} = \\sqrt{4\\pi\\sigma^2}$.'],
          model:['φ(k) = 1/sqrt(2π) (2π σ^2)^(-1/4) ∫_-∞^∞ e^(-x^2/(4σ^2) - i k x) dx', {l:'= 1/sqrt(2π) (2π σ^2)^(-1/4) sqrt(4π σ^2) e^(-σ^2 k^2)', w:'α = 1/(4σ²), b = −ik'}, '= (2σ^2/π)^(1/4) e^(-σ^2 k^2)'],
          mistakes:[{expr:'(2σ^2/π)^(1/4) e^(σ^2 k^2)', msg:'Vorzeichen: $(-ik)^2 = -k^2$. Eine Transformierte, die für große $k$ wächst, kann nicht stimmen.'}]},
        {id:'b', prompt:'b) Berechne $(\\Delta k)^2 = \\int k^2|\\varphi(k)|^2dk$ (es gilt $\\langle k\\rangle = 0$).', type:'value', target:'1/(4σ^2)', points:2, ph:'∫_-∞^∞ k^2 |φ(k)|^2 dk = ',
          hints:['Wegen $\\langle k\\rangle = 0$ ist $(\\Delta k)^2 = \\langle k^2\\rangle$; du brauchst $|\\varphi|^2$ aus a).', '$|\\varphi(k)|^2 = \\sqrt{2\\sigma^2/\\pi}\\,e^{-2\\sigma^2k^2}$, also $\\beta = 2\\sigma^2$.'],
          model:['∫_-∞^∞ k^2 |φ(k)|^2 dk = sqrt(2σ^2/π) ∫_-∞^∞ k^2 e^(-2σ^2 k^2) dk', '= sqrt(2σ^2/π) · 1/(4σ^2) sqrt(π/(2σ^2))', '= 1/(4σ^2)'],
          note:'Also $\\Delta k = 1/(2\\sigma)$ und $\\Delta x\\,\\Delta k = \\frac12$ – das Minimum. Mit $p = \\hbar k$: $\\Delta x\\,\\Delta p = \\hbar/2$.'},
        {id:'c', prompt:'c) Prüfe Plancherel: Berechne $\\int|\\varphi(k)|^2dk$.', type:'value', target:'1', points:1,
          hints:['Bei normiertem $\\psi$ sagt Plancherel das Ergebnis voraus – rechne es trotzdem nach.', '$\\int e^{-\\beta k^2}dk = \\sqrt{\\pi/\\beta}$ mit $\\beta = 2\\sigma^2$.'],
          model:['∫_-∞^∞ |φ(k)|^2 dk = sqrt(2σ^2/π) ∫_-∞^∞ e^(-2σ^2 k^2) dk', '= sqrt(2σ^2/π) sqrt(π/(2σ^2))', '= 1']}
      ]},
    {id:'mf-p4', title:'Fourier-Transformierte eines Kastens',
      text:'$\\psi(x) = 1/\\sqrt a$ für $|x| < a/2$, sonst $0$. Berechne $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$. Bei Auswertungsklammern mit zwei Variablen schreibst du die Variable dazu: `[…]_{x=-a/2}^{a/2}`.',
      ctx:{coords:['k', 'x'], params:{a:'pos'}, defs:{'φ(k)':'1/sqrt(2π a) ∫_{-a/2}^{a/2} e^(-i k x) dx'}},
      goals:[
        {id:'a', prompt:'a) Bestimme $\\varphi(k)$ für $k \\ne 0$.', type:'value', target:'sqrt(2/(π a)) sin(k a/2)/k', points:3, ph:'φ(k) = 1/sqrt(2π a) ∫_{-a/2}^{a/2} e^(-ikx) dx',
          hints:['Außerhalb von $|x| < a/2$ ist $\\psi = 0$; integriere nur über den Kasten.', 'Stammfunktion von $e^{-ikx}$ ist $e^{-ikx}/(-ik)$.', '$e^{iu} - e^{-iu} = 2i\\sin u$ mit $u = ka/2$.'],
          model:['φ(k) = 1/sqrt(2π a) ∫_{-a/2}^{a/2} e^(-ikx) dx', '= 1/sqrt(2π a) [e^(-ikx)/(-ik)]_{x=-a/2}^{a/2}', '= 1/sqrt(2π a) · 2 sin(k a/2)/k', '= sqrt(2/(π a)) sin(k a/2)/k'],
          mistakes:[{expr:'sqrt(2/(π a)) sin(k a)/k', msg:'Die Grenzen sind $\\pm a/2$: Im Sinus steht $ka/2$.'}]},
        {id:'b', prompt:'b) Berechne $\\varphi(0)$.', type:'value', target:'sqrt(a/(2π))', points:1,
          hints:['Setze $k = 0$ direkt ins Integral ein, nicht in das Ergebnis von a).', 'Bei $k = 0$ ist $e^{-ikx} = 1$.'],
          model:['φ(0) = 1/sqrt(2π a) ∫_{-a/2}^{a/2} 1 dx', '= a/sqrt(2π a)', '= sqrt(a/(2π))'],
          note:'Die ersten Nullstellen liegen bei $k = \\pm2\\pi/a$. Je schmaler der Kasten, desto breiter das Hauptmaximum von $\\varphi(k)$ – schon das ist die Orts-Impuls-Unschärfe. Die Standardabweichung $\\Delta k$ ist beim Kasten sogar unendlich, weil $|\\varphi|^2 \\propto 1/k^2$ zu langsam abfällt.'}
      ]},
    {id:'mf-p5', title:'Die Ableitungsregel',
      text:'$\\psi(x)$ ist eine glatte Funktion, die für $|x| \\to \\infty$ schnell gegen null geht, mit Transformierter $\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$ (in der Eingabe `φ(k)`). Auswertungsklammern: `[…]_{x=-∞}^∞`.',
      ctx:{coords:['k', 'x'], params:{}, abstract:{ψ:{args:['x']}}, defs:{'φ(k)':'1/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-i k x) dx'}},
      goals:[{id:'a', prompt:'Zeige: Die Transformierte von $\\psi\'$ ist $ik\\,\\varphi(k)$.', type:'show', from:'1/sqrt(2π) ∫_-∞^∞ ψ\'(x) e^(-ikx) dx', to:'i k φ(k)', points:3,
        hints:['Die Ableitung muss von $\\psi$ auf $e^{-ikx}$ wandern. Welche Technik macht das?', 'Partiell integrieren mit $u = e^{-ikx}$ und $v\' = \\psi\'$.', 'Der Randterm $[\\psi e^{-ikx}]_{-\\infty}^\\infty$ verschwindet, weil $\\psi \\to 0$.'],
        model:['1/sqrt(2π) ∫_-∞^∞ ψ\'(x) e^(-ikx) dx = 1/sqrt(2π) [ψ(x) e^(-ikx)]_{x=-∞}^∞ - 1/sqrt(2π) ∫_-∞^∞ ψ(x) (-ik) e^(-ikx) dx', {l:'= ik/sqrt(2π) ∫_-∞^∞ ψ(x) e^(-ikx) dx', w:'ψ → 0 für |x| → ∞'}, '= i k φ(k)'],
        note:'Mit $\\hat p = -i\\hbar\\,d/dx$ folgt: $\\hat p\\psi \\mapsto \\hbar k\\,\\varphi(k)$. Im $k$-Raum ist der Impuls einfach ein Faktor.'}]}
  ],
  sketch:[
    {id:'mf-s1', kind:'curve', draw:'f', title:'Die Transformierte eines Kastens',
      text:'$\\psi(x) = 1/\\sqrt a$ für $|x| < a/2$, sonst $0$, mit $a = 2$. Skizziere die Fourier-Transformierte $\\varphi(k)$ im Bereich $-10 \\le k \\le 10$. Sie ist reell. Die Skala der $y$-Achse ist frei, aber Nullstellen und Vorzeichen sollen stimmen.',
      plot:{x:[-10, 10], xlab:'k', ylab:'\\varphi(k)', ticks:[{x:-3 * Math.PI, lab:'-3\\pi'}, {x:-2 * Math.PI, lab:'-2\\pi'}, {x:-Math.PI, lab:'-\\pi'}, {x:0, lab:'0'}, {x:Math.PI, lab:'\\pi'}, {x:2 * Math.PI, lab:'2\\pi'}, {x:3 * Math.PI, lab:'3\\pi'}]},
      // φ(k) = (1/√(2π))∫_{−1}^{1} (1/√2) e^{−ikx} dx = sin(k)/(√π k): Nullstellen bei k = nπ (n ≠ 0), erstes Nebenminimum ≈ −0,22·φ(0) bei k ≈ 4,49
      f:k => Math.abs(k) < 1e-9 ? 1 / Math.sqrt(Math.PI) : Math.sin(k) / (Math.sqrt(Math.PI) * k),
      checks:[
        {id:'sym', type:'parity', p:'even', about:0, msg:'$\\psi$ ist reell und gerade. Was folgt daraus für $\\varphi(k)$?'},
        {id:'max', type:'maxat', x:0, tol:0.5, msg:'Wo ist $\\varphi(k)$ am größten? Denk an $\\varphi(0) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi\\,dx$.'},
        {id:'null1', type:'zero', at:[-Math.PI, Math.PI], tol:0.3, msg:'Wo endet das Hauptmaximum? Bei welchem $k$ wird $\\sin(ka/2)$ zum ersten Mal null? (Abschnitt „Breiten“)'},
        {id:'neg', type:'sign', s:-1, range:[3.7, 5.6], msg:'Welches Vorzeichen hat $\\sin(ka/2)/k$ zwischen der ersten und der zweiten Nullstelle?'}
      ],
      reveal:'$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi a}}\\int_{-a/2}^{a/2}e^{-ikx}dx = \\sqrt{\\frac{2}{\\pi a}}\\,\\frac{\\sin(ka/2)}{k}$, für $a = 2$ also $\\sin k/(\\sqrt\\pi\\,k)$. Das Hauptmaximum reicht von $-2\\pi/a = -\\pi$ bis $\\pi$; ein schmalerer Kasten gäbe ein breiteres. Danach folgen Nebenmaxima mit wechselndem Vorzeichen, die nur wie $1/k$ abklingen. Die Ursache sind die Sprünge des Kastens.',
      hints:['Rechne $\\varphi(k)$ aus (Übung „Fourier-Transformierte eines Kastens“) und bestimme dann die Nullstellen des Zählers.', '$\\sin(ka/2) = 0$ für $ka/2 = n\\pi$. Zwischen zwei Nullstellen wechselt das Vorzeichen.'],
      wrong:[
        {f:k => Math.exp(-k * k / 8), fails:['null1', 'neg'], why:'wie beim Gauß-Paket: Glocke ohne Nullstellen'},
        {f:k => Math.abs(k) < 1e-9 ? 0.5 : Math.sin(k / 2) / k, fails:['null1', 'neg'], why:'Breite a mit der halben Breite verwechselt: Nullstellen bei ±2π'},
        {f:k => Math.abs(k) < 1e-9 ? 1 : Math.abs(Math.sin(k) / k), fails:['neg'], why:'Vorzeichenwechsel übersehen: alle Nebenmaxima positiv'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'mf-f3', title:'Fourier-Reihe einer Halbwelle', text:'$f(x) = 1$ für $0 < x < \\pi$ und $f(x) = 0$ für $-\\pi < x < 0$, $2\\pi$-periodisch fortgesetzt. In der Eingabe heißt die Funktion `f(x)`.',
      ctx:PER({'f(x)':'(1 + sgn(x))/2'}),
      goals:[
        {id:'a', prompt:'a) Berechne den Mittelwert $\\frac{a_0}{2} = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi f(x)\\,dx$.', type:'value', target:'1/2', points:1, model:['1/(2π) ∫_-π^π f(x) dx = 1/(2π) ∫_0^π 1 dx', '= 1/2']},
        {id:'b', prompt:'b) Berechne $b_n = \\frac1\\pi\\int_{-\\pi}^\\pi f(x)\\sin(nx)\\,dx$.', type:'value', target:'(1 - (-1)^n)/(nπ)', points:2, model:['b_n = 1/π ∫_-π^π f(x) sin(n x) dx', '= 1/π ∫_0^π sin(n x) dx', '= 1/π [-cos(n x)/n]_0^π', '= (1 - (-1)^n)/(nπ)'],
          mistakes:[{expr:'2(1 - (-1)^n)/(nπ)', msg:'$f$ ist weder gerade noch ungerade, und links ist $f = 0$: Es gibt keinen Symmetriefaktor $2$.'}]}
      ]}},
    {aim:1, task:{id:'mf-f1', title:'Exponentiell abfallende Funktion', text:'$\\psi(x) = e^{-|x|}$. In der Eingabe heißt die Transformierte `φ(k)`.',
      ctx:{coords:['k'], params:{}, defs:{'φ(k)':'sqrt(2/π)/(1 + k^2)'}},
      goals:[{id:'a', prompt:'Bestimme $\\varphi(k)$.', type:'value', target:'sqrt(2/π)/(1 + k^2)', points:3,
        model:['φ(k) = 1/sqrt(2π) (∫_-∞^0 e^((1 - ik)x) dx + ∫_0^∞ e^(-(1 + ik)x) dx)', '= 1/sqrt(2π) (1/(1 - ik) + 1/(1 + ik))', '= sqrt(2/π)/(1 + k^2)']}]}},
    {aim:2, task:{id:'mf-f7', title:'Gauß-Paket mal $x$', text:'Bekannt: $e^{-x^2/2}$ hat die Transformierte $e^{-k^2/2}$. Jetzt ist $\\psi(x) = x\\,e^{-x^2/2}$; die Transformierte heißt in der Eingabe `φ(k)`.',
      ctx:{coords:['k', 'x'], params:{}, defs:{'φ(k)':'-i k e^(-k^2/2)'}},
      goals:[{id:'a', prompt:'Bestimme $\\varphi(k)$.', type:'value', target:'-i k e^(-k^2/2)', points:2,
        model:[{l:'x e^(-x^2/2) = -d/dx e^(-x^2/2)', w:'ψ ist bis aufs Vorzeichen eine Ableitung'}, 'φ(k) = -i k e^(-k^2/2)'],
        mistakes:[{expr:'i k e^(-k^2/2)', msg:'Vorzeichen: $x\\,e^{-x^2/2} = -\\frac{d}{dx}e^{-x^2/2}$, und eine Ableitung gibt den Faktor $ik$.'}, {expr:'-k e^(-k^2/2)', msg:'Eine Ableitung im Ort gibt den Faktor $ik$, nicht $k$. Mit dem Minus aus $x\\,e^{-x^2/2} = -(e^{-x^2/2})\'$ entsteht $-ik$.'}]}]}},
    {aim:'k', id:'mf-fk1', type:'mc', lex:'fourier-reihe',
      q:'Gegen welchen Wert konvergiert die Fourier-Reihe von $f(x) = x^2$ (auf $(-\\pi, \\pi)$, $2\\pi$-periodisch fortgesetzt) im Punkt $x = \\pi$?', opts:['$\\pi^2$', '$0$', '$\\pi^2/2$', '$\\pi^2/3$'], a:0,
      ex:'Die Fortsetzung ist bei $x = \\pi$ stetig, denn von links und rechts kommt $\\pi^2$. Dort trifft die Reihe den Funktionswert. Der Mittelwert zweier Grenzwerte spielt nur an Sprüngen eine Rolle; $\\pi^2/3$ ist der Mittelwert von $f$ über die Periode.'},
    {aim:'k', id:'mf-fk2', type:'dialog', lex:'breitenrelation',
      text:'Ein Kasten der Breite $a$ hat die Transformierte $\\varphi(k) \\propto \\sin(ka/2)/k$.',
      people:[{name:'Lena', says:'Die Standardabweichung $\\Delta k$ ist für den Kasten unendlich, weil $|\\varphi|^2$ nur wie $1/k^2$ abfällt.'}, {name:'Jonas', says:'Trotzdem wird das Hauptmaximum von $|\\varphi|^2$ breiter, wenn man den Kasten schmaler macht.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:2,
      ex:'$\\int k^2|\\varphi|^2dk$ divergiert, also $\\Delta k = \\infty$. Das Hauptmaximum reicht von $-2\\pi/a$ bis $2\\pi/a$ und wächst mit $1/a$. Beide Aussagen beschreiben verschiedene Breitenmaße.'},
    {aim:2, sketch:{id:'mf-fs-a', kind:'curve', draw:'abs2', title:'Ein Gauß-Paket mit Phasenfaktor', points:3,
      text:'Ein Wellenpaket ist $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}\\,e^{ik_0x}$ mit $\\sigma = 1$ und $k_0 = 3$. Skizziere $|\\varphi(k)|^2$. Die Achse ist absolut: Achte auf Lage, Breite und Fläche.',
      plot:{x:[-6, 6], y:[-0.25, 1], abs:true, xlab:'k', ylab:'|\\varphi(k)|^2', ticks:[{x:-4, lab:'-4'}, {x:-2, lab:'-2'}, {x:0, lab:'0'}, {x:2, lab:'2'}, {x:4, lab:'4'}], yticks:[{y:0.2, lab:'0{,}2'}, {y:0.4, lab:'0{,}4'}, {y:0.6, lab:'0{,}6'}, {y:0.8, lab:'0{,}8'}]},
      // e^{ik_0x}ψ_0(x) ↦ φ_0(k − k_0): |φ|² = √(2/π)·σ·e^{−2σ²(k − 3)²}, Höhe 0,798, Δk = 0,5, Halbwertsbreite 1,177, Fläche 1
      f:k => Math.sqrt(2 / Math.PI) * Math.exp(-2 * (k - 3) ** 2),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann $|\\varphi(k)|^2$ irgendwo negativ sein?'},
        {id:'lage', type:'center', x:3, tol:0.3, msg:'Was macht der Faktor $e^{ik_0x}$ im Ort mit $\\varphi(k)$? Wo liegt das Maximum von $|\\varphi|^2$?'},
        {id:'breite', type:'fwhm', v:1.177, tol:0.3, msg:'Welche Breite $\\Delta k$ gehört zu $\\Delta x = \\sigma = 1$? Auf halber Höhe ist deine Kurve {got} breit.'},
        {id:'flaeche', type:'area', range:[0.5, 5.5], v:1, tol:0.3, msg:'Welche Fläche hat $|\\varphi(k)|^2$, wenn $\\psi$ normiert ist? Deine ist etwa {got}.'}
      ],
      reveal:'Eine Phase im Ort gibt eine Verschiebung in $k$: $e^{ik_0x}\\psi_0(x) \\mapsto \\varphi_0(k - k_0)$. $|\\varphi|^2$ ist also eine Normalverteilung um $k = 3$, mit $\\Delta k = 1/(2\\sigma) = 0{,}5$ (Breite auf halber Höhe $\\approx 1{,}18$) und nach Plancherel mit der Fläche 1, also der Höhe $\\approx 0{,}80$. Die Phase ändert $|\\psi(x)|^2$ nicht, wohl aber die Lage im $k$-Raum: Das Paket hat den mittleren Impuls $\\hbar k_0$.',
      wrong:[
        {f:k => Math.sqrt(2 / Math.PI) * Math.exp(-2 * k * k), fails:['lage'], why:'Phase e^{ik0x} für bedeutungslos gehalten: Maximum bei k = 0'},
        {f:k => Math.sqrt(2 / Math.PI) * Math.exp(-2 * (k + 3) ** 2), fails:['lage'], why:'Vorzeichen der Verschiebung falsch: Maximum bei −k0'},
        {f:k => Math.exp(-((k - 3) ** 2) / 2) / Math.sqrt(2 * Math.PI), fails:['breite'], why:'Δk = σ statt 1/(2σ)'},
        {f:k => 0.5 * Math.sqrt(2 / Math.PI) * Math.exp(-2 * (k - 3) ** 2), fails:['flaeche'], why:'Höhe von |ψ(x)|² übernommen: Plancherel übersehen'}
      ]}}
  ],
  finalB:[
    {aim:0, task:{id:'mf-f4', title:'Fourier-Reihe eines Rechteckpulses', text:'$f(x) = 1$ für $|x| < \\pi/2$ und $f(x) = 0$ für $\\pi/2 < |x| < \\pi$, $2\\pi$-periodisch fortgesetzt. In der Eingabe heißt die Funktion `f(x)`.',
      ctx:PER({'f(x)':'(sgn(x + π/2) - sgn(x - π/2))/2'}),
      goals:[
        {id:'a', prompt:'a) Berechne den Mittelwert $\\frac{a_0}{2} = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi f(x)\\,dx$.', type:'value', target:'1/2', points:1, model:['1/(2π) ∫_-π^π f(x) dx = 1/(2π) ∫_{-π/2}^{π/2} 1 dx', '= 1/2']},
        {id:'b', prompt:'b) Berechne $a_n = \\frac1\\pi\\int_{-\\pi}^\\pi f(x)\\cos(nx)\\,dx$ für $n \\ge 1$.', type:'value', target:'2 sin(nπ/2)/(nπ)', points:2, model:['a_n = 1/π ∫_-π^π f(x) cos(n x) dx', '= 1/π ∫_{-π/2}^{π/2} cos(n x) dx', '= 2/π ∫_0^{π/2} cos(n x) dx', '= 2/π [sin(n x)/n]_0^{π/2}', '= 2 sin(nπ/2)/(nπ)'],
          mistakes:[{expr:'sin(nπ/2)/(nπ)', msg:'Es fehlt der Faktor $2$: Der Integrand ist gerade, also $\\int_{-\\pi/2}^{\\pi/2} = 2\\int_0^{\\pi/2}$.'}]}
      ]}},
    {aim:1, task:{id:'mf-f5', title:'Einseitig abfallende Funktion', text:'$\\psi(x) = e^{-x}$ für $x > 0$ und $\\psi(x) = 0$ für $x < 0$. In der Eingabe heißt die Transformierte `φ(k)`.',
      ctx:{coords:['k', 'x'], params:{}, defs:{'φ(k)':'1/(sqrt(2π) (1 + i k))'}},
      goals:[{id:'a', prompt:'Bestimme $\\varphi(k)$.', type:'value', target:'1/(sqrt(2π) (1 + i k))', points:3,
        model:['φ(k) = 1/sqrt(2π) ∫_0^∞ e^(-x) e^(-ikx) dx', '= 1/sqrt(2π) ∫_0^∞ e^(-(1 + ik)x) dx', '= 1/sqrt(2π) [-e^(-(1 + ik)x)/(1 + ik)]_{x=0}^∞', '= 1/(sqrt(2π) (1 + i k))'],
        mistakes:[{expr:'1/(sqrt(2π) (1 - i k))', msg:'Vorzeichen: Im Exponenten steht $-(1 + ik)x$, also $1/(1 + ik)$.'}]}]}},
    {aim:2, task:{id:'mf-f6', title:'Verschobenes Gauß-Paket', text:'Bekannt: $e^{-x^2/2}$ hat die Transformierte $e^{-k^2/2}$. Jetzt ist $\\psi(x) = e^{-(x - 2)^2/2}$; die Transformierte heißt in der Eingabe `φ(k)`.',
      ctx:{coords:['k', 'x'], params:{}, defs:{'φ(k)':'e^(-2ik) e^(-k^2/2)'}},
      goals:[{id:'a', prompt:'Bestimme $\\varphi(k)$.', type:'value', target:'e^(-2ik) e^(-k^2/2)', points:2,
        model:['φ(k) = 1/sqrt(2π) ∫_-∞^∞ e^(-(x - 2)^2/2) e^(-ikx) dx', '= 1/sqrt(2π) ∫_-∞^∞ e^(-u^2/2) e^(-ik(u + 2)) du', '= e^(-2ik) e^(-k^2/2)'],
        mistakes:[{expr:'e^(2ik) e^(-k^2/2)', msg:'Vorzeichen der Phase: $\\psi(x - a) \\mapsto e^{-ika}\\varphi(k)$, hier mit $a = 2$.'}, {expr:'e^(-(k - 2)^2/2)', msg:'Eine Verschiebung im Ort verschiebt nicht in $k$, sie erzeugt eine Phase $e^{-2ik}$.'}]}]}},
    {aim:'k', id:'mf-fk3', type:'mc2', lex:'gibbs',
      q:'$g(x) = \\operatorname{sgn}x$ auf $(-\\pi, \\pi)$, aber mit dem abgeänderten Wert $g(0) = 5$. Gegen welchen Wert konvergiert die Fourier-Reihe von $g$ in $x = 0$?', opts:['$0$', '$5$', '$1$'], a:0,
      ex:'Die Fourier-Koeffizienten sind Integrale; ein einzelner Funktionswert ändert sie nicht. Die Reihe ist dieselbe wie für $\\operatorname{sgn}x$ und liefert am Sprung $\\frac12(-1 + 1) = 0$.',
      reason:{q:'Warum?', opts:['Ein einzelner Punktwert ändert keine Koeffizienten; am Sprung gibt die Reihe den Mittelwert.', 'Die Reihe konvergiert gegen den Funktionswert, wenn er definiert ist.', 'Wegen des Gibbs-Phänomens wird der größere der beiden Grenzwerte angenommen.'], a:0, ex:'Ob $g(0) = 0$, $5$ oder undefiniert ist, ändert keine Integrale. Gibbs betrifft die Umgebung des Sprungs, nicht den Wert genau dort.'}},
    {aim:'k', id:'mf-fk5', type:'dialog', lex:'breitenrelation',
      text:'Die Funktion $\\psi(x) = e^{-|x|}$ hat bei $x = 0$ einen Knick. Ihre Transformierte ist $\\varphi(k) \\propto 1/(1 + k^2)$.',
      people:[{name:'Lena', says:'Wegen des Knicks fällt $|\\varphi|^2$ nur wie eine Potenz von $k$ ab. Dann ist die Standardabweichung $\\Delta k$ unendlich, wie beim Kasten.'}, {name:'Jonas', says:'$|\\varphi|^2 \\propto (1 + k^2)^{-2}$ fällt wie $k^{-4}$ ab. Dann ist $\\int k^2|\\varphi|^2dk$ endlich und $\\Delta k$ auch.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'$\\langle k^2\\rangle = \\int\\frac{k^2}{(1 + k^2)^2}dk \\Big/ \\int\\frac{dk}{(1 + k^2)^2} = \\frac{\\pi/2}{\\pi/2} = 1$, also $\\Delta k = 1$. Es kommt darauf an, **wie schnell** $|\\varphi|^2$ abfällt. Ein Sprung (Kasten) gibt $|\\varphi|^2 \\propto k^{-2}$, und $\\int k^2\\cdot k^{-2}dk$ divergiert. Ein Knick gibt $k^{-4}$, und das Integral konvergiert. Mit $\\Delta x = 1/\\sqrt2$ ist $\\Delta x\\,\\Delta k \\approx 0{,}71 \\ge \\frac12$.'},
    {aim:2, sketch:{id:'mf-fs-b', kind:'curve', draw:'abs2', title:'Ein Gauß-Paket mit Phasenfaktor', points:3,
      text:'Ein Wellenpaket ist $\\psi(x) = (2\\pi\\sigma^2)^{-1/4}e^{-x^2/(4\\sigma^2)}\\,e^{ik_0x}$ mit $\\sigma = 1{,}5$ und $k_0 = -2$. Skizziere $|\\varphi(k)|^2$. Die Achse ist absolut: Achte auf Lage, Breite und Fläche.',
      plot:{x:[-5, 3], y:[-0.375, 1.5], abs:true, xlab:'k', ylab:'|\\varphi(k)|^2', ticks:[{x:-4, lab:'-4'}, {x:-3, lab:'-3'}, {x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}], yticks:[{y:0.4, lab:'0{,}4'}, {y:0.8, lab:'0{,}8'}, {y:1.2, lab:'1{,}2'}]},
      // |φ|² = √(2/π)·σ·e^{−2σ²(k + 2)²} mit σ = 1,5: Höhe 1,197, Δk = 1/(2σ) = 1/3, Halbwertsbreite 0,785, Fläche 1
      // (σ bewusst anders als im Labor, σ = 0,5, und in Form A, σ = 1)
      f:k => Math.sqrt(2 / Math.PI) * 1.5 * Math.exp(-4.5 * (k + 2) ** 2),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann $|\\varphi(k)|^2$ irgendwo negativ sein?'},
        {id:'lage', type:'center', x:-2, tol:0.3, msg:'Was macht der Faktor $e^{ik_0x}$ im Ort mit $\\varphi(k)$? Wo liegt das Maximum von $|\\varphi|^2$?'},
        {id:'breite', type:'fwhm', v:0.785, tol:0.3, msg:'Welche Breite $\\Delta k$ gehört zu $\\Delta x = \\sigma = 1{,}5$? Auf halber Höhe ist deine Kurve {got} breit.'},
        {id:'flaeche', type:'area', range:[-3.5, -0.5], v:1, tol:0.3, msg:'Welche Fläche hat $|\\varphi(k)|^2$, wenn $\\psi$ normiert ist? Deine ist etwa {got}.'}
      ],
      reveal:'Eine Phase im Ort gibt eine Verschiebung in $k$: $e^{ik_0x}\\psi_0(x) \\mapsto \\varphi_0(k - k_0)$. $|\\varphi|^2$ ist also eine Normalverteilung um $k = -2$, mit $\\Delta k = 1/(2\\sigma) = 1/3$ (Breite auf halber Höhe $\\approx 0{,}79$) und nach Plancherel mit der Fläche 1, also der Höhe $\\approx 1{,}20$. Die Phase ändert $|\\psi(x)|^2$ nicht, wohl aber die Lage im $k$-Raum: Das Paket hat den mittleren Impuls $\\hbar k_0 < 0$ und läuft nach links.',
      wrong:[
        {f:k => Math.sqrt(2 / Math.PI) * 1.5 * Math.exp(-4.5 * k * k), fails:['lage'], why:'Phase e^{ik0x} für bedeutungslos gehalten: Maximum bei k = 0'},
        {f:k => Math.sqrt(2 / Math.PI) * 1.5 * Math.exp(-4.5 * (k - 2) ** 2), fails:['lage'], why:'Vorzeichen der Verschiebung falsch: Maximum bei −k0'},
        {f:k => Math.exp(-((k + 2) ** 2) / (2 * 2.25)) / (Math.sqrt(2 * Math.PI) * 1.5), fails:['breite'], why:'Δk = σ statt 1/(2σ)'},
        {f:k => Math.exp(-((k + 2) ** 2) / (2 * 4 / 9)) / (Math.sqrt(2 * Math.PI) * 2 / 3), fails:['breite'], why:'Δk = 1/σ statt 1/(2σ)'},
        {f:k => Math.exp(-4.5 * (k + 2) ** 2) / (Math.sqrt(2 * Math.PI) * 1.5), fails:['flaeche'], why:'Höhe von |ψ(x)|² übernommen: Plancherel übersehen'}
      ]}}
  ],
  errors:[
    {id:'mf-e1', title:'Vorzeichenfehler bei der Gauß-Transformation',
      text:'Gesucht ist $\\varphi(k)$ für $\\psi(x) = e^{-x^2/2}$. So wurde gerechnet:',
      ctx:{coords:['k'], params:{}, defs:{'φ(k)':'e^(-k^2/2)'}},
      lines:['φ(k) = 1/sqrt(2π) ∫_-∞^∞ e^(-x^2/2) e^(-ikx) dx', '= 1/sqrt(2π) · sqrt(2π) e^((-ik)^2/2)', '= e^(k^2/2)'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$(-ik)^2 = i^2k^2 = -k^2$, nicht $+k^2$.', 'Der Vorfaktor $1/\\sqrt{2\\pi}$ fehlt.', 'Gauß-Integrale gelten nicht für komplexe Exponenten.'], a:0, ex:'Richtig ist $e^{-k^2/2}$. Ein $\\varphi(k)$, das für große $k$ wächst, wäre nicht einmal normierbar – im Widerspruch zu Plancherel.'},
      fix:{id:'a', prompt:'Berichtige: Bestimme $\\varphi(k)$.', type:'value', target:'e^(-k^2/2)', model:['φ(k) = 1/sqrt(2π) · sqrt(2π) e^((-ik)^2/2)', '= e^(-k^2/2)']}},
    {id:'mf-e2', title:'Falscher Vorfaktor beim Fourier-Koeffizienten',
      text:'Für die Rechteckschwingung $\\operatorname{sgn}(x)$ auf $(-\\pi, \\pi)$ soll $b_n$ bestimmt werden. In der Eingabe ist `b_n` der richtige Koeffizient. So wurde gerechnet:',
      ctx:PER({'b_n':'1/π ∫_-π^π sgn(x) sin(n x) dx'}),
      lines:['b_n = 1/(2π) ∫_-π^π sgn(x) sin(n x) dx', '= 1/π ∫_0^π sin(n x) dx', '= (1 - (-1)^n)/(nπ)'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['Vor $b_n$ gehört $\\frac1\\pi$, denn $\\int_{-\\pi}^\\pi\\sin^2(nx)\\,dx = \\pi$.', 'Die Grenzen müssen $0$ bis $2\\pi$ sein, nicht $-\\pi$ bis $\\pi$.', 'Es müsste $\\cos(nx)$ statt $\\sin(nx)$ im Integral stehen.'], a:0, ex:'$\\frac{1}{2\\pi}$ gehört zu den komplexen $c_n$ und zum Mittelwert $a_0/2$. Kontrolle: Mit dem halben $b_n$ ergäbe Parseval nur ein Viertel von $\\frac1\\pi\\int|f|^2dx = 2$.'},
      fix:{id:'a', prompt:'Berichtige: Bestimme $b_n$.', type:'value', target:'2(1 - (-1)^n)/(nπ)', model:['b_n = 1/π ∫_-π^π sgn(x) sin(n x) dx', '= 2/π ∫_0^π sin(n x) dx', '= 2(1 - (-1)^n)/(nπ)']}}
  ]
});
lexe('fourier-reihe', 'Fourier-Reihe', 'Für $2\\pi$-periodisches $f$: $f(x) = \\frac{a_0}{2} + \\sum_{n\\ge1}(a_n\\cos nx + b_n\\sin nx)$ mit $a_n = \\frac1\\pi\\int_{-\\pi}^\\pi f\\cos nx\\,dx$, $b_n = \\frac1\\pi\\int_{-\\pi}^\\pi f\\sin nx\\,dx$. Komplex: $f = \\sum_{n\\in\\mathbb Z}c_ne^{inx}$ mit $c_n = \\frac{1}{2\\pi}\\int_{-\\pi}^\\pi fe^{-inx}dx$. Gerades $f$: nur $a_n$; ungerades $f$: nur $b_n$. Für Periode $L$ ersetzt man $nx$ durch $2\\pi nx/L$ und die Vorfaktoren durch $2/L$ bzw. $1/L$.', {topic:'m-fourier'});
lexe('gibbs', 'Gibbs-Phänomen', 'Neben einer Sprungstelle schwingt jede Teilsumme der Fourier-Reihe über, um etwa 9 % der Sprunghöhe. Mit wachsender Termzahl wird der Überschwinger schmaler, aber nicht niedriger. Die Reihe konvergiert trotzdem im quadratischen Mittel; an der Sprungstelle selbst liefert sie den Mittelwert aus links- und rechtsseitigem Grenzwert.', {topic:'m-fourier'});
lexe('parseval', 'Parseval und Plancherel', 'Fourier-Reihe: $\\frac{1}{2\\pi}\\int_{-\\pi}^\\pi|f|^2dx = \\sum_n|c_n|^2 = \\frac{|a_0|^2}{4} + \\frac12\\sum_{n\\ge1}(|a_n|^2 + |b_n|^2)$. Fourier-Transformation mit symmetrischer Konvention: $\\int|\\psi(x)|^2dx = \\int|\\varphi(k)|^2dk$ (Plancherel). Eine normierte Wellenfunktion hat also eine normierte Transformierte. Allgemein für Orthonormalsysteme: siehe Vollständigkeit.', {topic:'m-fourier'});
lexe('fourier-regeln', 'Rechenregeln der Fourier-Transformation', 'Mit $\\psi(x) \\mapsto \\varphi(k)$: Verschiebung $\\psi(x - a) \\mapsto e^{-ika}\\varphi(k)$; Phase $e^{ik_0x}\\psi(x) \\mapsto \\varphi(k - k_0)$; Ableitung $\\psi\'(x) \\mapsto ik\\,\\varphi(k)$; Streckung $\\psi(x/s) \\mapsto |s|\\,\\varphi(sk)$; $\\delta(x) \\mapsto 1/\\sqrt{2\\pi}$ und $e^{ik_0x} \\mapsto \\sqrt{2\\pi}\\,\\delta(k - k_0)$; Gauß $e^{-x^2/(2s^2)} \\mapsto s\\,e^{-s^2k^2/2}$. Breiten: $\\Delta x\\,\\Delta k \\ge \\frac12$, Gleichheit nur für Gauß-Funktionen.', {topic:'m-fourier'});
lexe('breitenrelation', 'Breitenrelation $\\Delta x\\,\\Delta k \\ge \\frac12$', 'Für jede normierte Funktion $\\psi$ und ihre Fourier-Transformierte $\\varphi$ gilt $\\Delta x\\,\\Delta k \\ge \\frac12$, mit den Standardabweichungen von $|\\psi(x)|^2$ und $|\\varphi(k)|^2$. Gleichheit nur für Gauß-Funktionen (auch verschoben und mit Phase $e^{ik_0x}$). Je schmaler $\\psi$, desto breiter $\\varphi$: $\\psi(x/s) \\mapsto s\\,\\varphi(sk)$. Mit $p = \\hbar k$ folgt $\\Delta x\\,\\Delta p \\ge \\hbar/2$. Achtung: Die Breite des Hauptmaximums ist nicht die Standardabweichung; beim Kasten ist $\\Delta k = \\infty$.', {topic:'m-fourier'});
lexe('koeffizientenabfall', 'Abfall der Fourier-Koeffizienten', 'Wie schnell $c_n$, $a_n$, $b_n$ für große $n$ abfallen, hängt an der Glattheit der periodisch fortgesetzten Funktion: Sprung $\\sim 1/n$ (Rechteck, Sägezahn), Knick $\\sim 1/n^2$ (Dreieck $|x|$, $x^2$), beliebig oft stetig differenzierbar: schneller als jede Potenz. Grund: Jede partielle Integration liefert einen Faktor $1/n$, bis eine Ableitung springt. Entscheidend ist die Fortsetzung: $f(x) = x$ auf $(-\\pi, \\pi)$ ist glatt, ihre Fortsetzung springt aber bei $\\pm\\pi$.', {topic:'m-fourier'});
})();
