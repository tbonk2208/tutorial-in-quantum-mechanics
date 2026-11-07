/* ===== Mathe M7: Differentialgleichungen und Randwertprobleme ===== */
(function(){
const R = String.raw;
const DGL = extra => Object.assign({coords:['x'], funcs:['y']}, extra || {});
topic({
  id:'m-dgl', ch:'math', title:'Differentialgleichungen und Randwertprobleme', short:'DGL',
  src:'Boas (3. Aufl.) Kap. 8 und 13 · Griffiths & Schroeter (3. Aufl.) Kap. 2.1–2.2',
  goals:[
    'Ich kann lineare DGL mit konstanten Koeffizienten über den Exponentialansatz $y = e^{\\lambda x}$ und die charakteristische Gleichung lösen.',
    'Ich kann Anfangs-, Rand- und Anschlussbedingungen einsetzen und erkläre, warum Randbedingungen nur einzelne Werte wie $k = n\\pi/L$ zulassen.',
    'Ich kann eine partielle DGL mit dem Separationsansatz $\\Psi(x,t) = \\varphi(x)f(t)$ in gewöhnliche DGL zerlegen.'
  ],
  needs:'Ableitungen von $e^{\\lambda x}$, $\\sin$, $\\cos$ (Kettenregel) · komplexe Zahlen und Euler-Formel (M1) · quadratische Gleichungen',
  wozu:'Fast jedes Gesetz der Physik ist eine Differentialgleichung: Newtons Bewegungsgleichung, die Maxwell-Gleichungen, die Wärmeleitung – und die Schrödingergleichung. In der Quantenmechanik entscheiden Randbedingungen, welche Energien erlaubt sind. Daraus folgen die diskreten Spektrallinien der Atome, die größenabhängigen Farben von Quantenpunkten und, ganz klassisch, die Obertöne einer eingespannten Saite.',
  bridge:'Aus M1 kommen $e^{i\\varphi}$ und komplexe Wurzeln, aus M4 und M5 die Begriffe Eigenwert und Eigenfunktion. Die Gleichungen $y\'\' = -k^2y$ und $y\'\' = +\\kappa^2y$ sind die Bausteine von Thema 2 bis Thema 5: Separation (Thema 2), Kasten (Thema 3), freies Teilchen (Thema 4) und Tunneln (Thema 5).',
  check:[
    {q:'$\\frac{d^2}{dx^2}e^{\\lambda x}$ ist …', opts:['$\\lambda^2e^{\\lambda x}$', '$2\\lambda e^{\\lambda x}$', '$\\lambda e^{2\\lambda x}$'], a:0, ex:'Jede Ableitung liefert einen Faktor $\\lambda$: $\\frac{d^n}{dx^n}e^{\\lambda x} = \\lambda^ne^{\\lambda x}$. Darauf beruht der Exponentialansatz.', lex:'charakteristische-gleichung'},
    {q:'Die Lösungen von $\\lambda^2 + 4 = 0$ sind …', opts:['$\\lambda = \\pm 2i$', '$\\lambda = \\pm 2$', '$\\lambda = -4$'], a:0, ex:'$\\lambda^2 = -4$, also $\\lambda = \\pm\\sqrt{-4} = \\pm 2i$.', lex:'komplexe-zahlen', prev:'m-komplex', seg:'mk-t3'},
    {q:'$e^{ikx} + e^{-ikx}$ ist gleich …', opts:['$2\\cos kx$', '$2i\\sin kx$', '$2\\cosh kx$'], a:0, ex:'Mit der Euler-Formel heben sich die Sinusanteile weg: $(\\cos kx + i\\sin kx) + (\\cos kx - i\\sin kx) = 2\\cos kx$.', lex:'euler', prev:'m-komplex', seg:'mk-t2'},
    {q:'Für welche reellen $u$ ist $\\sin u = 0$?', opts:['$u = n\\pi$ mit ganzem $n$', '$u = \\pi/2 + n\\pi$', 'nur für $u = 0$'], a:0, ex:'Der Sinus hat seine Nullstellen bei allen ganzzahligen Vielfachen von $\\pi$. Die Nullstellen des Kosinus liegen bei $\\pi/2 + n\\pi$.', lex:'randwertproblem'}
  ],
  diag:[
    {q:'Wie beginnst du, um $y\'\' - 3y\' + 2y = 0$ zu lösen?', opts:['$y = e^{\\lambda x}$ einsetzen: $\\lambda^2 - 3\\lambda + 2 = 0$', 'beide Seiten zweimal nach $x$ integrieren', 'eine Potenzreihe bis $x^2$ ansetzen und abbrechen', 'weiß ich nicht'], a:0, ex:'Bei konstanten Koeffizienten führt der Exponentialansatz auf die charakteristische Gleichung. Hier $\\lambda = 1, 2$, also $y = C_1e^x + C_2e^{2x}$.'},
    {q:'Wie beginnst du, um die erlaubten $k$ für $y\'\' = -k^2y$ mit $y(0) = y(L) = 0$ zu finden?', opts:['allgemeine Lösung $A\\sin kx + B\\cos kx$, dann beide Randwerte einsetzen', '$k$ aus der Normierung $\\int_0^L|y|^2dx = 1$ bestimmen', 'die Gleichung direkt nach $k$ auflösen: $k^2 = -y\'\'/y$', 'weiß ich nicht'], a:0, ex:'Erst die allgemeine Lösung, dann die Randbedingungen. $y(0) = 0$ gibt $B = 0$, $y(L) = 0$ gibt $\\sin kL = 0$. Die Normierung legt danach nur $|A|$ fest.'}
  ],
  phenomenon:{
    title:'Welche Töne hat eine eingespannte Saite?',
    text:'Eine Gitarrensaite der Länge $L$ ist an beiden Enden fest eingespannt. Zupft man sie an, schwingt sie und erzeugt einen Klang. Für eine Schwingung mit fester Frequenz $f$ erfüllt die Auslenkung $y(x)$ die Gleichung $y\'\' = -k^2y$ mit $k = 2\\pi f/c$ ($c$: Wellengeschwindigkeit auf der Saite). An beiden Enden ist $y = 0$.',
    q:{q:'Welche Frequenzen kommen im Klang vor?', opts:['jede Frequenz, je nachdem wie man zupft', 'nur ganzzahlige Vielfache einer Grundfrequenz', 'nur eine einzige Frequenz je Saite', 'alle Frequenzen unterhalb einer Grenze'], a:1,
      ex:'Die Randbedingungen $y(0) = y(L) = 0$ lassen nur $k = n\\pi/L$ zu, also $f_n = n\\,c/(2L)$.',
      fb:[
        'Die Zupfstelle bestimmt, *wie stark* die einzelnen Töne beteiligt sind – nicht, welche Frequenzen überhaupt möglich sind. Die legen die Randbedingungen fest.',
        'Genau. Nur Schwingungen mit $y = 0$ an beiden Enden passen auf die Saite: $\\sin kL = 0$, also $k = n\\pi/L$ und $f_n = n\\,c/(2L)$.',
        'Die Grundfrequenz dominiert oft, aber der Klang enthält auch Obertöne $2f_1, 3f_1, \\dots$ – darum klingt eine Gitarre anders als eine Stimmgabel.',
        'Eine obere Grenze gibt es in diesem Modell nicht: $f_n = n\\,c/(2L)$ für alle $n = 1, 2, 3, \\dots$ Entscheidend ist, dass zwischen den erlaubten Frequenzen keine weiteren liegen.'
      ]},
    reveal:'Nur bestimmte Frequenzen sind möglich: $f_n = n\\,f_1$ mit $f_1 = c/(2L)$. Der Grund ist nicht die Gleichung $y\'\' = -k^2y$ selbst – sie hat für jedes $k$ Lösungen –, sondern die **Randbedingungen** $y(0) = y(L) = 0$. Sie lassen nur $\\sin kL = 0$ zu, also $k = n\\pi/L$.\n\nDerselbe Mechanismus erzeugt in der Quantenmechanik diskrete Energien. Im Kasten gilt $\\psi\'\' = -k^2\\psi$ mit $k^2 = 2mE/\\hbar^2$ und $\\psi(0) = \\psi(L) = 0$, also $E_n = \\frac{\\hbar^2}{2m}\\left(\\frac{n\\pi}{L}\\right)^2$ (Thema 3). Wie man solche Gleichungen löst und warum Randbedingungen quantisieren, zeigt dieses Thema.'
  },
  teach:[
    /* ===== Abschnitt 1: DGL, Ordnung, linear und homogen, Superposition ===== */
    {id:'md-t1', title:'Was eine Differentialgleichung ist – und warum Linearität zählt', steps:[
      {id:'md-t1a', title:'Gesucht ist eine Funktion',
        num:{title:'Eine Lösung prüfen', text:R`Ist $y(x) = e^{2x}$ eine Lösung von $y' = 2y$? Setze ein: Links steht $y' = 2e^{2x}$, rechts $2y = 2e^{2x}$. Beide Seiten stimmen für jedes $x$ überein, etwa bei $x = 1$ mit $2e^2 \approx 14{,}78$ auf beiden Seiten. Die Funktion $y = x^2$ gibt links $2x$ und rechts $2x^2$. Das passt nur bei $x = 0$ und $x = 1$, also nicht für alle $x$.`},
        text:R`Eine **Differentialgleichung** (DGL) verknüpft eine gesuchte Funktion mit ihren Ableitungen. Gesucht ist also keine Zahl, sondern eine ganze Funktion $y(x)$. Eine Lösung muss die Gleichung für **alle** $x$ erfüllen, nicht nur an einzelnen Stellen. Ob eine Funktion eine Lösung ist, prüfst du immer gleich: ableiten, einsetzen, beide Seiten vergleichen.

Fast jedes Gesetz der Physik ist eine DGL. Newtons Gesetz $m\ddot x = F(x)$ gehört dazu, die Schwingungsgleichung $\ddot x = -\omega^2x$ auch. Der Punkt über $x$ steht für die Ableitung nach der Zeit. In der Quantenmechanik ist die Schrödingergleichung eine DGL für die Wellenfunktion (Ausblick auf Thema 2).`,
        q:{q:R`Welche Funktion löst $y' = -3y$ für alle $x$?`,
          opts:[R`$y = e^{-3x}$`, R`$y = e^{3x}$`, R`$y = -3x$`], a:0,
          ex:R`$\frac{d}{dx}e^{-3x} = -3e^{-3x} = -3y$. Die Gleichung gilt an jeder Stelle.`,
          fb:['',
            R`$\frac{d}{dx}e^{3x} = 3e^{3x}$, also $y' = +3y$. Das Vorzeichen im Exponenten muss zum Faktor in der Gleichung passen.`,
            R`Hier ist $y' = -3$, aber $-3y = 9x$. Beide Seiten stimmen nur bei einem einzigen $x$ überein, nicht für alle.`]}},
      {id:'md-t1b', title:'Ordnung und freie Konstanten',
        num:{title:R`$y'' = 0$ und $y' = 0$`, text:R`Aus $y'' = 0$ folgt durch zweimaliges Integrieren $y = A + Bx$: jede Gerade, mit **zwei** freien Konstanten $A$ und $B$. Aus $y' = 0$ folgt $y = C$: jede Konstante, mit **einer** freien Konstanten. So lösen $y = 3 - 2x$ und $y = 7x$ beide $y'' = 0$.`},
        text:R`Die **Ordnung** einer DGL ist die höchste Ableitung, die in ihr vorkommt. $f'(t) = -i\omega f(t)$ hat die Ordnung 1, die Schwingungsgleichung $y'' = -k^2y$ die Ordnung 2. Hier ist $k$ eine feste positive Zahl.

Das Beispiel zeigt eine Faustregel: Die Lösungen einer DGL der Ordnung $n$ haben $n$ freie Konstanten. Jede Ableitung, die du durch Integrieren rückgängig machst, bringt eine Integrationskonstante. Eine Lösung mit allen freien Konstanten heißt **allgemeine Lösung**. Welche Werte die Konstanten haben, legen erst Zusatzbedingungen fest, etwa Anfangswerte oder Randwerte (Abschnitt 4).`,
        q:{q:R`Wie viele freie Konstanten hat die allgemeine Lösung von $y''' = 0$?`,
          opts:['3', '2', '1', 'keine'], a:0,
          ex:R`Dreimal integrieren gibt $y = A + Bx + Cx^2$: drei Konstanten, passend zur Ordnung 3.`,
          fb:['',
            R`Zwei Konstanten gehören zur Ordnung 2. Hier steht die dritte Ableitung.`,
            R`Eine Konstante hätte eine Gleichung erster Ordnung wie $y' = 0$.`,
            R`Die Gleichung legt $y$ nicht eindeutig fest: Jedes Polynom vom Grad höchstens 2 ist eine Lösung.`]}},
      {id:'md-t1c', title:'Linear und homogen',
        num:{title:'Eine Lösung verdoppeln', text:R`$y = -6/x^2$ löst $y'' + y^2 = 0$, denn $y'' = -36/x^4$ und $y^2 = 36/x^4$. Verdoppelt, also $y = -12/x^2$, gibt es $y'' + y^2 = -72/x^4 + 144/x^4 = 72/x^4 \ne 0$. Bei $y'' + x^2y = 0$ geht das Verdoppeln immer gut: $2y'' + x^2\cdot 2y = 2\,(y'' + x^2y) = 0$.`},
        text:R`Eine DGL heißt **linear**, wenn $y$ und seine Ableitungen nur in der ersten Potenz vorkommen und nie miteinander multipliziert werden. Die Koeffizienten davor dürfen von $x$ abhängen. Sie heißt **homogen**, wenn kein Term ohne $y$ dasteht. Für die Ordnung 2 sieht jede lineare homogene DGL so aus:

$$y'' + a(x)\,y' + b(x)\,y = 0.$$

Gelesen: zweite Ableitung plus $a$ mal erste Ableitung plus $b$ mal $y$ gleich null. Das Beispiel zeigt, warum das zählt. Bei einer linearen homogenen DGL darfst du eine Lösung mit einer Zahl malnehmen und erhältst wieder eine Lösung. Bei $y'' + y^2 = 0$ geht das schief, denn $y^2$ wächst beim Verdoppeln auf das Vierfache.`,
        q:{q:'Welche dieser Gleichungen ist linear und homogen?',
          opts:[R`$y'' + y = x$`, R`$y'' + x^2y = 0$`, R`$y'' + y^2 = 0$`], a:1,
          ex:R`Der Koeffizient $x^2$ darf von $x$ abhängen; entscheidend ist, dass $y$ nur linear vorkommt und kein Term ohne $y$ dasteht.`,
          fb:[R`Der Term $x$ enthält kein $y$. Die Gleichung ist linear, aber inhomogen.`,
            '',
            R`$y^2$ ist nicht linear: Beim Verdoppeln von $y$ vervierfacht sich dieser Term.`]}},
      {id:'md-t1d', title:'Superposition: Summen von Lösungen',
        pre:{from:'m-vektor', seg:'mv-t1', title:'Linearkombinationen', text:R`In einem Vektorraum darfst du Elemente addieren und mit Zahlen multiplizieren, ohne ihn zu verlassen. Eine **Linearkombination** ist $c_1v_1 + c_2v_2$ mit Zahlen $c_1, c_2$. Funktionen bilden einen solchen Raum. Mini-Beispiel: $3\sin x + 2\cos x$ ist eine Linearkombination von $\sin x$ und $\cos x$.`},
        num:{title:R`Zwei Lösungen von $y'' = -4y$`, text:R`$y_1 = \sin 2x$ und $y_2 = \cos 2x$ lösen beide $y'' = -4y$, denn $(\sin 2x)'' = -4\sin 2x$ und $(\cos 2x)'' = -4\cos 2x$. Für die Kombination $y = 3\sin 2x + \cos 2x$ ist

$$\begin{aligned}y'' &= -12\sin 2x - 4\cos 2x\\ &= -4\,(3\sin 2x + \cos 2x) = -4y.\end{aligned}$$

Auch sie ist eine Lösung.`},
        text:R`Für lineare homogene DGL gilt das [[lex:dgl-superposition|Superpositionsprinzip]]: Sind $y_1$ und $y_2$ Lösungen, dann ist auch jede Linearkombination $C_1y_1 + C_2y_2$ eine Lösung. Der Grund ist, dass Ableiten linear ist:

$$(C_1y_1 + C_2y_2)'' = C_1y_1'' + C_2y_2''.$$

Jeder Term der Gleichung behält diese Struktur, also bleibt die Summe null. Die Herleitung zeigt das für $y'' = -k^2y$ mit beliebigem $k > 0$.

Daraus folgt der Bauplan der allgemeinen Lösung. Eine lineare homogene DGL der Ordnung $n$ hat $n$ voneinander unabhängige Lösungen. Ihre Linearkombination mit $n$ freien Konstanten ist die allgemeine Lösung.`,
        derive:{ctx:{coords:['x'], params:{k:'pos', C_1:'complex', C_2:'complex'}},
          lines:[
            {l:'d^2/dx^2 sin(kx) = -k^2 sin(kx)', w:'erste Lösung'},
            {l:'d^2/dx^2 cos(kx) = -k^2 cos(kx)', w:'zweite Lösung'},
            {l:'d^2/dx^2 (C_1 sin(kx) + C_2 cos(kx)) = C_1 d^2/dx^2 sin(kx) + C_2 d^2/dx^2 cos(kx)', w:'Ableiten ist linear', why:{q:'Welche Eigenschaft wird hier benutzt?', opts:['Die Ableitung einer Linearkombination ist die Linearkombination der Ableitungen.', 'Sinus und Kosinus sind orthogonal zueinander.', 'Die zweite Ableitung einer Summe ist das Produkt der Ableitungen.'], a:0, ex:'$(af + bg)\'\' = af\'\' + bg\'\'$. Genau das macht jede lineare DGL superpositionsfähig.'}},
            {l:'= -k^2 (C_1 sin(kx) + C_2 cos(kx))', w:'also wieder eine Lösung', why:{q:'Was zeigt diese Zeile?', opts:['Jede Kombination $C_1\\sin kx + C_2\\cos kx$ löst $y\'\' = -k^2y$.', 'Nur für $C_1 = C_2$ ist die Summe eine Lösung.', 'Die Summe löst eine andere Gleichung mit $-2k^2$.'], a:0, ex:'Das ist die allgemeine Lösung mit zwei freien Konstanten – passend zur Ordnung 2.'}}
          ]},
        q:{q:R`$y_1 = e^{x}$ und $y_2 = e^{-x}$ lösen $y'' = y$. Welche Funktion löst die Gleichung **nicht**?`,
          opts:[R`$5e^{x} - 2e^{-x}$`, R`$e^{x}\cdot e^{-x}$`, R`$\tfrac12\left(e^{x} + e^{-x}\right)$`], a:1,
          ex:R`$e^x\cdot e^{-x} = 1$, und $1'' = 0 \ne 1$. Superposition erlaubt Summen mit Zahlfaktoren, keine Produkte von Lösungen.`,
          fb:[R`Das ist eine Linearkombination mit $C_1 = 5$ und $C_2 = -2$, also eine Lösung.`,
            '',
            R`Das ist eine Linearkombination mit $C_1 = C_2 = \tfrac12$. Sie löst $y'' = y$.`]}},
      {id:'md-t1e', title:'Superposition in Formel, Bild und Physik',
        num:{title:'Zwei Kurven addieren', text:R`Bei $x = \pi/8$ ist $\sin 2x = \cos 2x = \tfrac{\sqrt2}{2} \approx 0{,}71$, also $y = 3\sin 2x + \cos 2x \approx 2{,}83$. Bei $x = 3\pi/8$ ist $\sin 2x \approx 0{,}71$ und $\cos 2x \approx -0{,}71$, also $y \approx 1{,}41$. Du addierst die Kurven Punkt für Punkt.`},
        text:R`Superposition hat ein Bild. Die Summe zweier Lösungen ist die Kurve, die du erhältst, wenn du ihre Werte an jeder Stelle addierst. Die Summe von $3\sin 2x$ und $\cos 2x$ ist wieder eine reine Schwingung mit derselben Wellenlänge $\pi$, nur verschoben und etwas höher. Das muss so sein, denn sie löst dieselbe Gleichung $y'' = -4y$.

Für die Physik ist das zentral. Die Schrödingergleichung, die Grundgleichung der Quantenmechanik, ist linear (Thema 2). Deshalb sind Überlagerungen von Lösungen wieder Lösungen, und darauf beruht jede Interferenz. Die Tafel stellt die Darstellungen nebeneinander.`,
        reps:{obj:R`Die Überlagerung $y = 3\sin 2x + \cos 2x$`,
          rows:[
            {k:'worte', text:R`Zwei Lösungen derselben linearen homogenen DGL, mit Zahlen gewichtet und addiert.`},
            {k:'formel', tex:R`\begin{gathered}y'' = -4y:\quad y = 3\,y_1 + y_2\\ y_1 = \sin 2x,\quad y_2 = \cos 2x\end{gathered}`},
            {k:'graph', plot:{x:[0, 3.2], y:[-3.6, 3.6], xlab:'x', ylab:'y', ticks:[{x:Math.PI / 2, lab:'\\pi/2'}, {x:Math.PI, lab:'\\pi'}]}, f:x => 3 * Math.sin(2 * x) + Math.cos(2 * x), lab:R`3\sin 2x + \cos 2x`, f2:x => 3 * Math.sin(2 * x), lab2:R`3\sin 2x`,
              cap:R`Die Summe (durchgezogen) entsteht Punkt für Punkt aus $3\sin 2x$ (gestrichelt) und $\cos 2x$. Sie hat dieselbe Wellenlänge $\pi$.`},
            {k:'physik', text:R`Ausblick: Die Schrödingergleichung ist linear. Mit $\psi_1$ und $\psi_2$ ist auch $c_1\psi_1 + c_2\psi_2$ eine Lösung (Thema 2). Solche Überlagerungen erzeugen Interferenz.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Jeder genannten Lösung einen Namen $y_1, y_2$ und einen Zahlfaktor geben; dann addieren.`},
            {from:'formel', to:'graph', rule:R`Beide Teilkurven zeichnen und an jeder Stelle $x$ ihre Werte addieren.`},
            {from:'graph', to:'physik', rule:R`Wo sich die Teilkurven verstärken oder abschwächen, entsteht in der Quantenmechanik Interferenz.`}
          ]},
        q:{q:R`$y_1$ und $y_2$ lösen beide $y'' = -9y$. Was weißt du über den Graphen von $y_1 + y_2$, ohne zu rechnen?`, tr:{from:'formel', to:'graph'},
          opts:[R`Er schwingt mit derselben Wellenlänge $2\pi/3$.`, R`Er schwingt mit der halben Wellenlänge $\pi/3$.`, R`Er schwingt nicht mehr, sondern wächst.`], a:0,
          ex:R`Die Summe löst dieselbe Gleichung $y'' = -9y$. Deren Lösungen haben alle die Form $A\sin 3x + B\cos 3x$ mit der Wellenlänge $2\pi/3$.`,
          fb:['',
            R`Die Wellenlänge hängt nur von der Gleichung ab, nicht davon, wie viele Lösungen du addierst.`,
            R`Die Summe löst dieselbe Gleichung wie die Summanden, hat also auch deren Form $A\sin 3x + B\cos 3x$.`]}},
      {id:'md-t1f', title:'Typischer Fehler: Superposition bei inhomogenen Gleichungen',
        num:{title:R`$y'' + y = 1$`, text:R`$y_1 = 1$ löst $y'' + y = 1$, denn $0 + 1 = 1$. Auch $y_2 = 1 + \sin x$ ist eine Lösung: $-\sin x + 1 + \sin x = 1$. Für die Summe $y_1 + y_2 = 2 + \sin x$ ergibt sich aber $-\sin x + 2 + \sin x = 2 \ne 1$.`},
        text:R`Der häufigste Fehler mit Superposition: Man wendet sie auf Gleichungen an, für die sie nicht gilt. Die Summe zweier Lösungen ist nur bei **linearen homogenen** Gleichungen wieder eine Lösung. Bei einer inhomogenen Gleichung wie $y'' + y = 1$ steht rechts eine feste Zahl. Addierst du zwei Lösungen, addieren sich auch die rechten Seiten, und aus $1$ wird $2$.

Bei nichtlinearen Gleichungen scheitert schon das Vervielfachen (Schritt 3). Prüfe deshalb vor jeder Überlagerung beide Eigenschaften: Kommt $y$ nur linear vor? Steht kein Term ohne $y$ da?`,
        q:{q:R`$y_1$ und $y_2$ lösen beide $y'' + 4y = \cos x$. Welche Gleichung löst die Differenz $y_1 - y_2$?`,
          opts:[R`$y'' + 4y = \cos x$`, R`$y'' + 4y = 0$`, R`$y'' + 4y = 2\cos x$`], a:1,
          ex:R`$(y_1 - y_2)'' + 4(y_1 - y_2) = \cos x - \cos x = 0$. Die Differenz löst die homogene Gleichung.`,
          fb:[R`Die rechten Seiten subtrahieren sich mit: $\cos x - \cos x = 0$.`,
            '',
            R`$2\cos x$ gehört zur Summe $y_1 + y_2$, nicht zur Differenz.`]}},
      {id:'md-t1g', title:'Lösungen verschiedener Gleichungen addieren',
        num:{title:R`Zwei verschiedene $k$`, text:R`$\sin x$ löst $y'' = -1\cdot y$, $\sin 2x$ löst $y'' = -4y$. Für die Summe $y = \sin x + \sin 2x$ ist $y'' = -\sin x - 4\sin 2x$. Das Verhältnis $y''/y$ ist bei $x = \pi/2$ gleich $-1$, bei $x = \pi/4$ etwa $-2{,}76$. Es ist nicht konstant: Die Summe löst $y'' = -k^2y$ für **kein** $k$.`},
        text:R`Superposition gilt innerhalb **einer** Gleichung. Gehören zwei Lösungen zu verschiedenen Werten von $k$, dann sind $y'' = -1\cdot y$ und $y'' = -4y$ zwei verschiedene Gleichungen. Ihre Summe löst keine von beiden.

Genau diese Lage kommt in der Quantenmechanik ständig vor (Ausblick). Dort spielt die Energie $E$ die Rolle von $k^2$: Zu jeder erlaubten Energie $E_n$ gehört eine Lösung $\psi_n$ der zeitunabhängigen Schrödingergleichung (Thema 2). Die Summe $\psi_1 + \psi_2$ mit $E_1 \ne E_2$ löst diese Gleichung für kein einzelnes $E$. Sie ist trotzdem ein erlaubter Zustand: Bekommt jeder Summand seinen eigenen Zeitfaktor, löst die Summe die zeitabhängige Gleichung (Abschnitt 5).`,
        q:{q:R`$y_1$ löst $y'' = -9y$, $y_2$ löst $y'' = -16y$, und beide sind nicht überall null. Was gilt für $y_1 + y_2$?`,
          opts:[R`Es löst $y'' = -k^2y$ für kein einzelnes $k$.`, R`Es löst $y'' = -25y$, denn $9 + 16 = 25$.`, R`Es löst $y'' = -12{,}5\,y$, den Mittelwert.`], a:0,
          ex:R`$(y_1 + y_2)'' = -9y_1 - 16y_2$ ist kein festes Vielfaches von $y_1 + y_2$.`,
          fb:['',
            R`Die Faktoren addieren sich nicht: $-9y_1 - 16y_2 \ne -25\,(y_1 + y_2)$.`,
            R`Ein Mittelwert der Faktoren taucht nirgends auf; das Verhältnis $y''/y$ ändert sich von Stelle zu Stelle.`]}}
    ]},

    /* ===== Abschnitt 2: Exponentialansatz und charakteristische Gleichung ===== */
    {id:'md-t2', title:'Der Exponentialansatz und die charakteristische Gleichung', steps:[
      {id:'md-t2a', title:'Die Idee: Ableiten reproduziert die Exponentialfunktion',
        num:{title:R`$y = e^{3x}$`, text:R`Für $y = e^{3x}$ ist $y' = 3e^{3x}$ und $y'' = 9e^{3x}$. Jede Ableitung bringt nur einen Faktor $3$. Deshalb ist $y'' - 9y = 9e^{3x} - 9e^{3x} = 0$: $e^{3x}$ löst $y'' = 9y$. Ebenso $e^{-3x}$, denn $(-3)^2 = 9$.`},
        text:R`Viele DGL der Physik haben **konstante Koeffizienten**: In $y'' + a\,y' + b\,y = 0$ sind $a$ und $b$ feste Zahlen. Für sie gibt es ein Verfahren, das immer funktioniert, den **Exponentialansatz** $y = e^{\lambda x}$. Der griechische Buchstabe $\lambda$, gelesen „lambda“, ist eine noch unbekannte Zahl.

Die Idee: Die Exponentialfunktion reproduziert sich beim Ableiten. Nach der Kettenregel ist $\frac{d}{dx}e^{\lambda x} = \lambda e^{\lambda x}$. Jede Ableitung wird also zu einem Faktor $\lambda$. Setzt du ein, steht in jedem Term derselbe Faktor $e^{\lambda x}$, und es bleibt nur eine Bedingung an die Zahl $\lambda$.`,
        q:{q:R`Für welche $\lambda$ löst $e^{\lambda x}$ die Gleichung $y'' = 4y$?`,
          opts:[R`$\lambda = 2$ und $\lambda = -2$`, R`nur $\lambda = 2$`, R`$\lambda = 4$ und $\lambda = -4$`], a:0,
          ex:R`$\lambda^2e^{\lambda x} = 4e^{\lambda x}$ verlangt $\lambda^2 = 4$, also $\lambda = \pm 2$.`,
          fb:['',
            R`Auch $(-2)^2 = 4$: $e^{-2x}$ ist ebenso eine Lösung.`,
            R`Zweimal ableiten gibt den Faktor $\lambda^2$, nicht $\lambda$. Mit $\lambda = 4$ wäre $y'' = 16y$.`]}},
      {id:'md-t2b', title:'Die charakteristische Gleichung',
        num:{title:R`$y'' - 3y' + 2y = 0$`, text:R`Mit $y = e^{\lambda x}$ wird $y''$ zu $\lambda^2$, $y'$ zu $\lambda$ und $y$ zu $1$, jeweils mal $e^{\lambda x}$:

$$\begin{gathered}(\lambda^2 - 3\lambda + 2)\,e^{\lambda x} = 0\\ \Rightarrow\quad (\lambda - 1)(\lambda - 2) = 0.\end{gathered}$$

Also $\lambda = 1$ oder $\lambda = 2$, und $y = C_1e^{x} + C_2e^{2x}$. Probe für $e^{2x}$: $4 - 6 + 2 = 0$.`},
        text:R`Allgemein gibt der Ansatz $(\lambda^2 + a\lambda + b)\,e^{\lambda x} = 0$ (Herleitung). Weil $e^{\lambda x}$ nie null ist, muss die Klammer verschwinden. Das ist die [[lex:charakteristische-gleichung|charakteristische Gleichung]]

$$\lambda^2 + a\lambda + b = 0.$$

Aus einer DGL ist eine quadratische Gleichung geworden. Ihre Wurzeln sind $\lambda_{1,2} = -\tfrac a2 \pm \sqrt{\tfrac{a^2}{4} - b}$. Zu zwei verschiedenen Wurzeln gehören zwei unabhängige Lösungen, und die allgemeine Lösung ist $y = C_1e^{\lambda_1x} + C_2e^{\lambda_2x}$. Die Übersetzung merkst du dir so: Jede Ableitung wird ein Faktor $\lambda$, die Funktion selbst wird $1$, und alle Vorzeichen bleiben stehen.`,
        derive:{ctx:{coords:['x'], params:{a:'real', b:'real', λ:'complex'}},
          lines:[
            {l:'d/dx e^(λx) = λ e^(λx)', w:'Kettenregel', why:{q:'Woher kommt der Faktor $\\lambda$?', opts:['Kettenregel: innere Ableitung von $\\lambda x$', 'Produktregel mit den Faktoren $\\lambda$ und $e^x$', 'aus der Normierung der Funktion $e^{\\lambda x}$'], a:0, ex:'$\\frac{d}{dx}e^{u(x)} = u\'(x)\\,e^{u(x)}$ mit $u = \\lambda x$.'}},
            {l:'d^2/dx^2 e^(λx) = λ^2 e^(λx)', w:'noch einmal abgeleitet'},
            {l:'d^2/dx^2 e^(λx) + a d/dx e^(λx) + b e^(λx) = (λ^2 + a λ + b) e^(λx)', w:'eingesetzt und ausgeklammert', why:{q:'Warum folgt daraus $\\lambda^2 + a\\lambda + b = 0$?', opts:['weil $e^{\\lambda x}$ nie null ist; also muss die Klammer null sein', 'weil man $x = 0$ einsetzen darf und dort $e^0 = 1$ ist', 'weil $a$ und $b$ bei Schwingungen immer null sind'], a:0, ex:'Damit $e^{\\lambda x}$ die DGL für **alle** $x$ löst, muss der Faktor vor $e^{\\lambda x}$ null sein.'}}
          ]},
        q:{q:R`Welche charakteristische Gleichung gehört zu $y'' + 5y' - 6y = 0$?`, tr:{from:'formel', to:'mathe'},
          opts:[R`$\lambda^2 - 5\lambda - 6 = 0$`, R`$\lambda^2 + 5\lambda + 6 = 0$`, R`$\lambda^2 + 5\lambda - 6 = 0$`], a:2,
          ex:R`$y''\to\lambda^2$, $y'\to\lambda$, $y\to 1$, mit allen Vorzeichen. Es ist $\lambda^2 + 5\lambda - 6 = (\lambda + 6)(\lambda - 1)$, also $\lambda = 1$ und $\lambda = -6$.`,
          fb:[R`Das Vorzeichen vor $y'$ bleibt erhalten: $+5y'$ wird $+5\lambda$.`,
            R`Das Vorzeichen vor $y$ bleibt erhalten: $-6y$ wird $-6$.`,
            '']}},
      {id:'md-t2c', title:'Komplexe Wurzeln: Schwingung mit Hüllkurve',
        pre:{from:'m-komplex', seg:'mk-t2', title:'Euler-Formel', text:R`$e^{i\varphi} = \cos\varphi + i\sin\varphi$, gelesen „e hoch i phi“. Für einen komplexen Exponenten $\alpha + i\beta$ gilt deshalb $e^{(\alpha + i\beta)x} = e^{\alpha x}\left(\cos\beta x + i\sin\beta x\right)$. Mini-Beispiel: $e^{i\pi} = -1$.`},
        num:{title:R`$y'' + 2y' + 5y = 0$`, text:R`Die charakteristische Gleichung $\lambda^2 + 2\lambda + 5 = 0$ hat die Wurzeln

$$\lambda = -1 \pm \sqrt{1 - 5} = -1 \pm 2i.$$

Mit der Euler-Formel ist $e^{(-1 + 2i)x} = e^{-x}(\cos 2x + i\sin 2x)$. Real- und Imaginärteil geben die reellen Lösungen $e^{-x}\cos 2x$ und $e^{-x}\sin 2x$.`},
        text:R`Ist $\tfrac{a^2}{4} < b$, steht unter der Wurzel eine negative Zahl. Die Wurzeln sind komplex: $\lambda = \alpha \pm i\beta$ mit $\alpha = -a/2$. Mit der [[lex:euler|Euler-Formel]] wird daraus eine Schwingung. Reelle Lösungen sind

$$y = e^{\alpha x}\left(A\cos\beta x + B\sin\beta x\right).$$

Lies die Teile so: Der Imaginärteil $\beta$ macht die Schwingung mit der Periode $2\pi/\beta$. Der Realteil $\alpha$ macht die **Hüllkurve** $e^{\alpha x}$. Ist $\alpha < 0$, klingt die Schwingung ab; ist $\alpha > 0$, wächst sie.

Komplexe Wurzeln sind also kein Hindernis. Ist die Gleichung reell, dann sind Real- und Imaginärteil einer komplexen Lösung einzeln Lösungen.`,
        q:{q:R`Welche Wurzeln hat die charakteristische Gleichung von $y'' - 4y' + 13y = 0$, und was tut die Lösung?`,
          opts:[R`$-2 \pm 3i$: Schwingung mit fallender Hülle`, R`$2 \pm 3i$: Schwingung mit wachsender Hülle`, R`$\pm\sqrt{13}$: keine Schwingung`], a:1,
          ex:R`$\lambda^2 - 4\lambda + 13 = 0$ gibt $\lambda = 2 \pm \sqrt{4 - 13} = 2 \pm 3i$. Die Hülle $e^{2x}$ wächst.`,
          fb:[R`Vorzeichen prüfen: $\alpha = -a/2$ mit $a = -4$ gibt $\alpha = +2$. Die Hülle $e^{2x}$ wächst.`,
            '',
            R`Hier fehlt der Term $-4y'$. Außerdem ist $4 - 13 < 0$, die Wurzeln sind komplex.`]}},
      {id:'md-t2d', title:'Die doppelte Wurzel',
        num:{title:R`$y'' + 6y' + 9y = 0$`, text:R`$\lambda^2 + 6\lambda + 9 = (\lambda + 3)^2 = 0$ hat nur die Wurzel $\lambda_0 = -3$. Der Ansatz liefert also nur $e^{-3x}$. Probe für $y = x\,e^{-3x}$: Es ist $y' = (1 - 3x)\,e^{-3x}$ und $y'' = (9x - 6)\,e^{-3x}$, also

$$\begin{aligned}&y'' + 6y' + 9y\\ &= (9x - 6 + 6 - 18x + 9x)\,e^{-3x}\\ &= 0.\end{aligned}$$`},
        text:R`Ist $\tfrac{a^2}{4} = b$, fallen beide Wurzeln zu einer **doppelten Wurzel** $\lambda_0 = -a/2$ zusammen. Der Exponentialansatz liefert dann nur eine Lösung, die DGL zweiter Ordnung braucht aber zwei. Die zweite ist $x\,e^{\lambda_0x}$, wie das Beispiel zeigt. Die allgemeine Lösung lautet

$$y = (C_1 + C_2x)\,e^{\lambda_0x}.$$

Bei der gedämpften Schwingung $\ddot x + 2\gamma\dot x + \omega_0^2x = 0$ ist das der **aperiodische Grenzfall** $\gamma = \omega_0$. Dabei ist $\gamma$ die Dämpfung und $\omega_0$ die Kreisfrequenz ohne Dämpfung. Die Auslenkung kehrt dann zur Ruhelage zurück, ohne zu schwingen.`,
        q:{q:R`Für $y'' + 6y' + 9y = 0$ ist $\lambda = -3$ eine doppelte Wurzel. Welche Funktion gehört neben $e^{-3x}$ zur allgemeinen Lösung?`,
          opts:[R`$e^{-3x}\cos x$`, R`$x^2e^{-3x}$`, R`$x\,e^{-3x}$`], a:2,
          ex:R`Bei der doppelten Wurzel $\lambda_0$ ist auch $x\,e^{\lambda_0x}$ eine Lösung: $y = (C_1 + C_2x)\,e^{-3x}$.`,
          fb:[R`Ein Kosinus gehört zu komplexen Wurzeln. Hier ist die Wurzel reell und doppelt.`,
            R`Für $x^2e^{-3x}$ bleibt beim Einsetzen ein Rest $2e^{-3x}$ übrig. Die zweite Lösung ist $x\,e^{-3x}$.`,
            '']}},
      {id:'md-t2e', title:'Von den Wurzeln zum Bild: Tafel',
        num:{title:R`$y'' + 0{,}4\,y' + 9{,}04\,y = 0$`, text:R`$\lambda^2 + 0{,}4\lambda + 9{,}04 = 0$ hat die Wurzeln $\lambda = -0{,}2 \pm \sqrt{0{,}04 - 9{,}04} = -0{,}2 \pm 3i$. Also ist $y = e^{-0{,}2x}(A\cos 3x + B\sin 3x)$: Periode $2\pi/3 \approx 2{,}09$, Hülle $e^{-0{,}2x}$. Bei $x = 10$ ist die Hülle auf $e^{-2} \approx 0{,}14$ gefallen.`},
        text:R`Jetzt kannst du in beide Richtungen übersetzen. Von der DGL kommst du über die charakteristische Gleichung zu den Wurzeln, von den Wurzeln zur Formel der Lösung und von dort zum Bild. Umgekehrt liest du aus einem Bild die Wurzeln ab: den Imaginärteil aus der Periode, den Realteil aus der Hüllkurve.

Die Tafel zeigt das an einer gedämpften Schwingung. Die drei Fälle unterscheidest du an den Wurzeln. Zwei reelle Wurzeln geben Wachsen oder Abklingen ohne Schwingung. Komplexe Wurzeln geben eine Schwingung mit Hülle. Eine doppelte Wurzel ist der Grenzfall dazwischen.`,
        reps:{obj:R`Gedämpfte Schwingung $y'' + 0{,}4\,y' + 9{,}04\,y = 0$`,
          rows:[
            {k:'formel', tex:R`y'' + 0{,}4\,y' + 9{,}04\,y = 0`},
            {k:'mathe', tex:R`\begin{gathered}\lambda^2 + 0{,}4\,\lambda + 9{,}04 = 0\\ \Rightarrow\quad\lambda = -0{,}2 \pm 3i\end{gathered}`},
            {k:'worte', text:R`Realteil $-0{,}2$: Die Hülle fällt wie $e^{-0{,}2x}$. Imaginärteil $3$: Schwingung mit der Periode $2\pi/3$.`},
            {k:'graph', plot:{x:[0, 10], y:[-1.1, 1.1], xlab:'x', ylab:'y'}, f:x => Math.exp(-0.2 * x) * Math.sin(3 * x), lab:R`e^{-0{,}2x}\sin 3x`, f2:x => Math.exp(-0.2 * x), lab2:R`e^{-0{,}2x}`,
              cap:R`Die Lösung mit $y(0) = 0$ und $y'(0) = 3$ (durchgezogen) und ihre Hüllkurve (gestrichelt). Die Nullstellen haben überall denselben Abstand $\pi/3$.`},
            {k:'physik', text:R`Ein Federpendel mit Reibung: $\ddot x + 2\gamma\dot x + \omega_0^2x = 0$ mit $\gamma = 0{,}2$ und $\omega_0^2 = 9{,}04$. Für $\gamma < \omega_0$ schwingt es, für $\gamma > \omega_0$ kriecht es zurück.`}
          ],
          links:[
            {from:'formel', to:'mathe', rule:R`$y''$ durch $\lambda^2$, $y'$ durch $\lambda$ und $y$ durch $1$ ersetzen; dann die quadratische Gleichung lösen.`},
            {from:'mathe', to:'worte', rule:R`Die Wurzeln $\alpha \pm i\beta$ zerlegen: $\alpha$ wird die Hüllkurve $e^{\alpha x}$, $\beta$ die Schwingung mit der Periode $2\pi/\beta$.`},
            {from:'worte', to:'graph', rule:R`Erst die Hülle $\pm e^{\alpha x}$ zeichnen, dann darin eine Schwingung mit dem Nullstellenabstand $\pi/\beta$.`},
            {from:'graph', to:'physik', rule:R`$x$ als Zeit lesen: Die Kurve ist die Auslenkung des Pendels, die Hülle zeigt, wie schnell die Reibung die Schwingung dämpft.`}
          ]},
        q:{q:R`Eine Lösung von $y'' + ay' + by = 0$ schwingt mit der Periode $\pi$, und ihre Hülle wächst wie $e^{0{,}5x}$. Welche Wurzeln hat die charakteristische Gleichung?`, tr:{from:'graph', to:'mathe'},
          opts:[R`$\lambda = -0{,}5 \pm 2i$`, R`$\lambda = 0{,}5 \pm 2i$`, R`$\lambda = 0{,}5 \pm \pi i$`], a:1,
          ex:R`Hülle $e^{0{,}5x}$ heißt $\alpha = 0{,}5$. Periode $2\pi/\beta = \pi$ heißt $\beta = 2$. Die Gleichung ist $\lambda^2 - \lambda + 4{,}25 = 0$.`,
          fb:[R`Ein negativer Realteil gäbe eine fallende Hülle. Hier wächst sie.`,
            '',
            R`Die Periode ist $2\pi/\beta$, nicht $\beta$ selbst. Aus $2\pi/\beta = \pi$ folgt $\beta = 2$.`]}},
      {id:'md-t2f', title:'Typischer Fehler: das Vorzeichen in der charakteristischen Gleichung',
        num:{title:R`$y'' = 4y$`, text:R`Richtig: alles auf eine Seite, $y'' - 4y = 0$, also $\lambda^2 - 4 = 0$ und $\lambda = \pm 2$. Das gibt $y = C_1e^{2x} + C_2e^{-2x}$. Falsch abgelesen als $\lambda^2 + 4 = 0$ käme $\lambda = \pm 2i$ heraus, also $\sin 2x$. Probe: $(\sin 2x)'' = -4\sin 2x$, nicht $+4\sin 2x$.`},
        text:R`Ein häufiger Fehler steckt im Vorzeichen. Bei $y'' = \kappa^2y$, gelesen „kappa Quadrat y“, liest man schnell $\lambda^2 + \kappa^2 = 0$ ab. Dann erhält man komplexe Wurzeln und eine Schwingung, obwohl die Lösung wächst oder abklingt. Die Regel ist einfach: Bring zuerst alles auf eine Seite, sodass rechts null steht. Erst dann ersetzt du die Ableitungen durch Potenzen von $\lambda$.

Ein zweiter Fehler: „Bei komplexen Wurzeln gibt es keine reelle Lösung.“ Doch, $e^{\alpha x}\cos\beta x$ und $e^{\alpha x}\sin\beta x$ sind reell. Und ein dritter: bei komplexen Wurzeln den Faktor $e^{\alpha x}$ vergessen. Er macht aus der Schwingung eine abklingende oder wachsende.`,
        q:{q:R`Welche allgemeine Lösung hat $y'' = 16y$?`,
          opts:[R`$A\sin 4x + B\cos 4x$`, R`$C_1e^{4x} + C_2e^{-4x}$`, R`$C_1e^{16x} + C_2e^{-16x}$`], a:1,
          ex:R`$y'' - 16y = 0$ gibt $\lambda^2 - 16 = 0$, also $\lambda = \pm 4$: reelle Exponentialfunktionen.`,
          fb:[R`Das wäre die Lösung von $y'' = -16y$. Hier steht $+16y$: erst auf eine Seite bringen, dann $\lambda^2 - 16 = 0$.`,
            '',
            R`Die Wurzeln von $\lambda^2 = 16$ sind $\pm 4$, nicht $\pm 16$.`]}}
    ]},

    /* ===== Abschnitt 3: Krümmungsbild, Schwingen und Abklingen, Brücke zur Schrödingergleichung ===== */
    {id:'md-t3', title:'Schwingen oder Abklingen: die zwei Grundgleichungen', steps:[
      {id:'md-t3a', title:'Die zweite Ableitung als Krümmung',
        num:{title:'Drei Kurven', text:R`$y = x^2$ hat $y'' = 2 > 0$: Die Kurve ist nach oben gekrümmt, wie ein Tal. $y = -x^2$ hat $y'' = -2 < 0$: nach unten gekrümmt, wie ein Berg. $y = \sin x$ hat bei $x = \pi/2$ den Wert $1$ und $y'' = -\sin(\pi/2) = -1$: Dort biegt sich die Kurve nach unten.`},
        text:R`Die zweite Ableitung hat ein Bild: Sie misst die **Krümmung** einer Kurve. Ist $y'' > 0$, nimmt die Steigung zu, und die Kurve biegt sich nach oben. Ist $y'' < 0$, nimmt die Steigung ab, und die Kurve biegt sich nach unten. Ist $y'' = 0$, verläuft sie dort ohne Biegung.

Eine DGL zweiter Ordnung wie $y'' = -k^2y$ ist deshalb eine Vorschrift für die Krümmung. An jeder Stelle sagt sie, wohin und wie stark sich die Kurve biegen muss. Mit diesem Blick kannst du Lösungen skizzieren, ohne sie auszurechnen. Das brauchst du in der Quantenmechanik ständig.`,
        q:{q:R`An einer Stelle ist $y = 2$, $y' = 0$ und $y'' = -3$. Wie sieht die Kurve dort aus?`,
          opts:[R`ein Hochpunkt: waagrecht und nach unten gebogen`, R`ein Tiefpunkt: waagrecht und nach oben gebogen`, R`ein gerades Stück ohne jede Biegung`], a:0,
          ex:R`$y' = 0$ heißt waagrechte Tangente, $y'' < 0$ heißt nach unten gekrümmt. Zusammen ist das ein Hochpunkt.`,
          fb:['',
            R`Nach oben gebogen hieße $y'' > 0$. Hier ist $y'' = -3$.`,
            R`Ohne Biegung hieße $y'' = 0$. Hier ist $y'' = -3$.`]}},
      {id:'md-t3b', title:R`$y'' = -k^2y$: Die Kurve biegt sich zur Achse`,
        num:{title:R`$y = \sin 2x$`, text:R`$y = \sin 2x$ löst $y'' = -4y$. Bei $x = \pi/4$ ist $y = 1$ und $y'' = -4$: Oberhalb der Achse biegt sich die Kurve nach unten. Bei $x = 3\pi/4$ ist $y = -1$ und $y'' = +4$: Unterhalb biegt sie sich nach oben. Dazwischen kreuzt sie die Achse, bei $x = \pi/2$.`},
        text:R`In der Gleichung $y'' = -k^2y$ hat die Krümmung immer das **umgekehrte** Vorzeichen von $y$. Liegt die Kurve oberhalb der Achse, biegt sie sich nach unten; liegt sie darunter, biegt sie sich nach oben. Sie wird also immer zur Achse zurückgezogen, schießt darüber hinaus und kehrt wieder um. So entsteht eine Schwingung. Die Gleichung heißt deshalb [[lex:schwingungsgleichung|Schwingungsgleichung]].

Die Wurzeln $\lambda = \pm ik$ bestätigen das Bild: $y = A\sin kx + B\cos kx$. Die Wellenlänge ist $2\pi/k$. Je größer $k$, desto stärker die Krümmung bei gleichem $y$, und desto kürzer die Wellenlänge.`,
        q:{q:R`$y_a$ löst $y'' = -4y$, $y_b$ löst $y'' = -16y$. Wie verhalten sich die Wellenlängen?`,
          opts:[R`Die von $y_b$ ist halb so groß.`, R`Die von $y_b$ ist ein Viertel so groß.`, R`Die von $y_b$ ist doppelt so groß.`], a:0,
          ex:R`$k_a = 2$ und $k_b = 4$. Die Wellenlänge $2\pi/k$ ist $\pi$ bzw. $\pi/2$.`,
          fb:['',
            R`Die Wellenlänge geht mit $1/k$, und $k$ ist die Wurzel aus $16$, also $4$.`,
            R`Stärkere Krümmung zieht schneller zur Achse zurück: kürzere Wellenlänge, nicht längere.`]}},
      {id:'md-t3c', title:R`$y'' = +\kappa^2y$: Die Kurve biegt sich von der Achse weg`,
        num:{title:R`$y'' = y$ mit $y(0) = 0$ und $y'(0) = 1$`, text:R`Die Lösung ist $y = \sinh x = \tfrac12\left(e^{x} - e^{-x}\right)$. Bei $x = 1$ ist $y \approx 1{,}18$, bei $x = 2$ schon $3{,}63$. Weil $y'' = y > 0$ ist, biegt sich die Kurve immer weiter nach oben und kehrt nie zur Achse zurück.`},
        text:R`In $y'' = +\kappa^2y$ hat die Krümmung **dasselbe** Vorzeichen wie $y$. Oberhalb der Achse biegt sich die Kurve nach oben, darunter nach unten. Sie wird von der Achse weggedrückt. Eine Schwingung ist so unmöglich: Die Kurve kann die Achse höchstens einmal kreuzen.

Die Wurzeln $\lambda = \pm\kappa$ geben $y = Ce^{\kappa x} + De^{-\kappa x}$, einen wachsenden und einen abklingenden Teil. Gleichwertig ist $A\sinh\kappa x + B\cosh\kappa x$ mit $\cosh x = \tfrac12\left(e^{x} + e^{-x}\right)$. Im Bild daneben ist die blaue Kurve die Lösung mit $y(0) = 0$ und $y'(0) = 1$, also $\sinh(\kappa x)/\kappa$. Das Labor nennt die Konstante in beiden Gleichungen $k$. Schalte auf $y'' = -k^2y$ um: Dann ist sie $\sin(kx)/k$. Der Punkt rechts zeigt jeweils den Wert $y(1)$.`,
        fig:{lab:'ode', init:{eq:'exp', k:2}, caption:'Umschalten zwischen $y\'\' = -k^2y$ (Schwingung mit Nullstellen) und $y\'\' = +k^2y$ (Wachstum ohne Nullstelle), jeweils mit $y(0) = 0$ und $y\'(0) = 1$.'},
        q:{q:R`Kann eine Lösung von $y'' = 4y$, die nicht überall null ist, zwei Nullstellen haben?`,
          opts:[R`Ja, wenn man die Konstanten passend wählt.`, R`Nein, höchstens eine.`, R`Ja, sie hat sogar unendlich viele.`], a:1,
          ex:R`$Ce^{2x} + De^{-2x} = 0$ heißt $e^{4x} = -D/C$. Diese Gleichung hat höchstens eine Lösung $x$. Im Bild: Die Kurve wird von der Achse weggedrückt und kehrt nicht zurück.`,
          fb:[R`Versuche es: $e^{4x} = -D/C$ hat für feste $C$ und $D$ höchstens ein $x$, weil $e^{4x}$ streng wächst.`,
            '',
            R`Unendlich viele Nullstellen hat eine Schwingung, also eine Lösung von $y'' = -4y$.`]}},
      {id:'md-t3d', title:'Brücke zur Physik: die Schrödingergleichung bei konstantem Potential',
        num:{title:'Ein Elektron', text:R`Für ein Elektron mit $E - V_0 = 1\,\mathrm{eV}$ ist $k = \sqrt{2m_e\cdot 1\,\mathrm{eV}}/\hbar \approx 5{,}12\,\mathrm{nm}^{-1}$. Die Wellenlänge ist $2\pi/k \approx 1{,}23\,\mathrm{nm}$. Bei $E - V_0 = 4\,\mathrm{eV}$ verdoppelt sich $k$, und die Wellenlänge halbiert sich auf $0{,}61\,\mathrm{nm}$.`},
        text:R`Ausblick: In der Quantenmechanik beschreibt eine Funktion $\psi(x)$, die Wellenfunktion, ein Teilchen (Thema 1). Bei konstantem Potential $V_0$ erfüllt sie die zeitunabhängige [[lex:schroedinger|Schrödingergleichung]] (Thema 2)

$$-\frac{\hbar^2}{2m}\psi'' + V_0\,\psi = E\,\psi.$$

Dabei ist $m$ die Masse, $E$ die Energie und $\hbar$ das reduzierte Plancksche Wirkungsquantum. Umgestellt ist das $\psi'' = -\frac{2m(E - V_0)}{\hbar^2}\psi$, eine DGL mit konstanten Koeffizienten. Für $E > V_0$ ist sie die Schwingungsgleichung mit $k = \sqrt{2m(E - V_0)}/\hbar$; man nennt den Bereich **klassisch erlaubt**. Für $E < V_0$ ist sie $\psi'' = +\kappa^2\psi$ mit $\kappa = \sqrt{2m(V_0 - E)}/\hbar$: **klassisch verboten**. Die Herleitung prüft, dass $e^{ikx}$ die Gleichung im erlaubten Fall löst.`,
        derive:{ctx:{coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['V_0', '3V_0']}}},
          lines:[
            {l:'k = sqrt(2m(E - V_0))/ħ', w:'Abkürzung für E > V₀'},
            {l:'-ħ^2/(2m) d^2/dx^2 e^(ikx) = ħ^2 k^2/(2m) e^(ikx)', w:'zweimal abgeleitet', why:{q:'Warum steht rechts ein positiver Faktor?', opts:['weil $(ik)^2 = -k^2$ das Minus davor aufhebt', 'weil $e^{ikx}$ eine reelle Funktion von $x$ ist', 'weil $k$ im erlaubten Bereich imaginär ist'], a:0, ex:'$\\frac{d^2}{dx^2}e^{ikx} = (ik)^2e^{ikx} = -k^2e^{ikx}$; mit $-\\frac{\\hbar^2}{2m}$ davor wird daraus $+\\frac{\\hbar^2k^2}{2m}$.'}},
            {l:'= (E - V_0) e^(ikx)', w:'k eingesetzt'},
            {l:'-ħ^2/(2m) d^2/dx^2 e^(ikx) + V_0 e^(ikx) = E e^(ikx)', w:'also löst e^(ikx) die Gleichung', why:{q:'Was bedeutet $\\hbar^2k^2/(2m) = E - V_0$ physikalisch?', opts:['Es ist die kinetische Energie des Teilchens.', 'Es ist die potentielle Energie des Teilchens.', 'Es ist die Gesamtenergie des Teilchens.'], a:0, ex:'Mit $p = \\hbar k$ ist $\\frac{p^2}{2m} = E - V_0$: Gesamtenergie minus potentielle Energie.'}}
          ]},
        q:{q:R`In einem Bereich ist $V_0 = 5\,\mathrm{eV}$, das Teilchen hat $E = 3\,\mathrm{eV}$. Welche Form hat $\psi$ dort?`,
          opts:[R`$A\sin kx + B\cos kx$`, R`$Ce^{\kappa x} + De^{-\kappa x}$`, R`$\psi = 0$`], a:1,
          ex:R`$E < V_0$: klassisch verboten, $\psi'' = +\kappa^2\psi$. $\psi$ ist dort nicht null, sondern wächst oder fällt exponentiell.`,
          fb:[R`Schwingungen gehören zu $E > V_0$. Hier ist $E - V_0 = -2\,\mathrm{eV} < 0$.`,
            '',
            R`$\psi$ ist im verbotenen Bereich nicht null, sondern wächst oder klingt exponentiell ab (übernächster Schritt).`]}},
      {id:'md-t3e', title:'Gleichung, Lösung, Graph, Krümmungsbild: Tafel',
        num:{title:'Krümmung ablesen', text:R`Für $y = \sin 2x$ ist $y''/4 = -\sin 2x$: an jeder Stelle das Spiegelbild von $y$. Bei $x = 0{,}3$ ist $y \approx 0{,}56$ und $y''/4 \approx -0{,}56$. Für $y = e^{-2x}$ ist dagegen $y''/4 = e^{-2x} = y$: Kurve und Krümmung haben dasselbe Vorzeichen.`},
        text:R`Die Tafel verbindet die Darstellungen der Gleichung $y'' = -4y$. Die Formel sagt, wie die Krümmung von $y$ abhängt. Die charakteristische Gleichung liefert die Lösung als Formel. Der Graph zeigt Kurve und Krümmung übereinander. In Worten sagst du, was die Kurve tun muss, und die Physik sagt, wo diese Gleichung vorkommt.

Mit dieser Übersetzung prüfst du jede Skizze. Wo $y$ und $y''$ verschiedene Vorzeichen haben, biegt die Kurve zur Achse. Wo sie dasselbe Vorzeichen haben, biegt sie weg. Eine Skizze einer Lösung von $y'' = -k^2y$, die sich irgendwo von der Achse wegbiegt, ist falsch.`,
        reps:{obj:R`Die Schwingungsgleichung $y'' = -4y$`,
          rows:[
            {k:'formel', tex:R`y'' = -4y`},
            {k:'mathe', tex:R`\begin{gathered}\lambda^2 + 4 = 0\;\Rightarrow\;\lambda = \pm 2i\\ \Rightarrow\; y = A\cos 2x + B\sin 2x\end{gathered}`},
            {k:'graph', plot:{x:[0, 6.3], y:[-1.3, 1.3], xlab:'x', ylab:'y', ticks:[{x:Math.PI / 2, lab:'\\pi/2'}, {x:Math.PI, lab:'\\pi'}, {x:3 * Math.PI / 2, lab:'3\\pi/2'}, {x:2 * Math.PI, lab:'2\\pi'}]}, f:x => Math.sin(2 * x), lab:R`y = \sin 2x`, f2:x => -Math.sin(2 * x), lab2:R`$y''/4$`,
              cap:R`Durchgezogen $y = \sin 2x$, gestrichelt die Krümmung $y''/4$. Sie ist das Spiegelbild: Wo $y$ oben ist, zieht die Krümmung nach unten.`},
            {k:'worte', text:R`Die Kurve biegt sich immer zur Achse hin, umso stärker, je weiter sie von ihr weg ist. Sie schwingt mit der Wellenlänge $\pi$.`},
            {k:'physik', text:R`Dieselbe Form hat die Schrödingergleichung im klassisch erlaubten Bereich, $E > V_0$: Die Wellenfunktion schwingt (Thema 3, Thema 4).`}
          ],
          links:[
            {from:'formel', to:'mathe', rule:R`$y''$ durch $\lambda^2$ und $y$ durch $1$ ersetzen, die Wurzeln bestimmen und mit der Euler-Formel reell schreiben.`},
            {from:'mathe', to:'graph', rule:R`Die Lösung zeichnen; dann $y''$ ausrechnen und mit dem Faktor $1/4$ darüberlegen.`},
            {from:'graph', to:'worte', rule:R`Vorzeichen von $y$ und $y''$ vergleichen: verschieden heißt „zur Achse hin“, gleich hieße „von der Achse weg“.`},
            {from:'worte', to:'physik', rule:R`„Zur Achse hin gebogen“ heißt: Hier ist das Teilchen klassisch erlaubt, $E > V_0$, und $\psi$ schwingt.`}
          ]},
        q:{q:R`Eine Skizze zeigt eine Kurve, die oberhalb der Achse nach oben und unterhalb nach unten gebogen ist. Zu welcher Gleichung kann sie gehören?`, tr:{from:'graph', to:'formel'},
          opts:[R`$y'' = -9y$`, R`$y'' = +9y$`, R`zu beiden, je nach Anfangswerten`], a:1,
          ex:R`Krümmung und $y$ haben dasselbe Vorzeichen: $y'' = +9y$. Die Kurve wird von der Achse weggedrückt.`,
          fb:[R`Bei $y'' = -9y$ biegt sich die Kurve immer zur Achse hin. Hier biegt sie weg.`,
            '',
            R`Anfangswerte ändern Lage und Höhe der Kurve. Ob sie sich zur Achse hin oder weg biegt, legt allein die Gleichung fest.`]}},
      {id:'md-t3f', title:R`Typischer Fehler: „Im verbotenen Bereich ist $\psi = 0$“`,
        num:{title:'Wie schnell klingt es ab?', text:R`Für ein Elektron mit $V_0 - E = 1\,\mathrm{eV}$ ist $\kappa \approx 5{,}12\,\mathrm{nm}^{-1}$, also $1/\kappa \approx 0{,}20\,\mathrm{nm}$. Nach $0{,}5\,\mathrm{nm}$ im verbotenen Bereich ist $e^{-\kappa x}$ auf $e^{-2{,}56} \approx 0{,}08$ gefallen: klein, aber nicht null.`},
        text:R`Ein verbreiteter Fehlschluss lautet: „Im klassisch verbotenen Bereich ist $\psi = 0$.“ Die Mathematik sagt etwas anderes. Die Gleichung $\psi'' = +\kappa^2\psi$ hat die Lösungen $Ce^{\kappa x} + De^{-\kappa x}$, und die sind nicht null. Reicht der Bereich nach rechts bis ins Unendliche, bleibt nur der abklingende Teil. Er fällt auf der Länge $1/\kappa$ um den Faktor $e$. Diese Länge heißt [[lex:eindringtiefe|Eindringtiefe]]. Darauf beruht der Tunneleffekt (Thema 5).

Ein Sonderfall ist $E = V_0$. Dann ist $\psi'' = 0$, und die Lösung ist eine Gerade $A + Bx$: weder Schwingung noch Exponentialfunktion.`,
        q:{q:R`In einem verbotenen Bereich wird $V_0 - E$ viermal so groß. Was passiert mit der Eindringtiefe $1/\kappa$?`,
          opts:[R`Sie halbiert sich.`, R`Sie wird ein Viertel so groß.`, R`Sie bleibt gleich, denn $\psi$ ist dort ohnehin null.`], a:0,
          ex:R`$\kappa \propto \sqrt{V_0 - E}$: Der Faktor $4$ unter der Wurzel gibt den Faktor $2$ für $\kappa$, also die halbe Eindringtiefe.`,
          fb:['',
            R`$\kappa$ wächst mit der Wurzel aus $V_0 - E$, nicht linear.`,
            R`$\psi$ ist im verbotenen Bereich nicht null; es klingt auf der Länge $1/\kappa$ ab.`]}}
    ]},

    /* ===== Abschnitt 4: Anfangswerte, Randwerte, Eigenwerte, Quantisierung ===== */
    {id:'md-t4', title:'Anfangswerte, Randwerte – und warum Randbedingungen quantisieren', steps:[
      {id:'md-t4a', title:'Anfangswertproblem: alles an einer Stelle',
        num:{title:R`$y'' = -4y$ mit $y(0) = 0$ und $y'(0) = 1$`, text:R`Allgemein ist $y = A\sin 2x + B\cos 2x$. Aus $y(0) = B = 0$ folgt $B = 0$. Aus $y'(0) = 2A = 1$ folgt $A = \tfrac12$. Also ist $y = \tfrac12\sin 2x$: genau eine Lösung.`},
        text:R`Die allgemeine Lösung einer DGL zweiter Ordnung hat zwei freie Konstanten. Zwei Zusatzbedingungen legen sie fest. Wo diese Bedingungen stehen, macht einen grundlegenden Unterschied.

Stehen beide an derselben Stelle, etwa $y(0)$ und $y'(0)$, heißt das ein [[lex:anfangswertproblem|Anfangswertproblem]]. Für lineare DGL mit stetigen Koeffizienten hat es **immer genau eine** Lösung. Physikalisch kennst du das: Ort und Geschwindigkeit zur Zeit null legen die Bahn fest. Für $y'' = -k^2y$ mit $y(0) = 0$ und $y'(0) = 1$ ist die Lösung $y = \sin(kx)/k$, und zwar für jedes $k > 0$.`,
        q:{q:R`Für welche $k > 0$ hat $y'' = -k^2y$ mit $y(0) = 0$ und $y'(0) = 1$ eine Lösung?`,
          opts:[R`nur für $k = n\pi$ mit ganzem $n$`, R`für jedes $k > 0$ genau eine`, R`für jedes $k > 0$ unendlich viele`], a:1,
          ex:R`Das ist ein Anfangswertproblem: $y = \sin(kx)/k$ für jedes $k$. Einzelne $k$ wählt erst eine Bedingung an einer zweiten Stelle aus.`,
          fb:[R`Das gilt für das Randwertproblem $y(0) = y(1) = 0$ (nächster Schritt). Hier stehen beide Bedingungen bei $x = 0$.`,
            '',
            R`Zwei Bedingungen legen beide Konstanten fest. Es bleibt keine Freiheit.`]}},
      {id:'md-t4b', title:'Randwertproblem: Bedingungen an zwei Stellen',
        num:{title:R`$y(0) = y(1) = 0$`, text:R`$y'' = -k^2y$ auf $[0, 1]$. Aus $y(0) = 0$ folgt $y = A\sin kx$. Für $k = 2$ verlangt $y(1) = A\sin 2 \approx 0{,}91\,A = 0$, also $A = 0$: nur $y \equiv 0$. Für $k = \pi$ ist $\sin\pi = 0$, und jedes $A$ erfüllt die Bedingung.`},
        text:R`Stehen die Bedingungen an zwei verschiedenen Stellen, etwa $y(0) = 0$ und $y(L) = 0$, heißt das ein [[lex:randwertproblem|Randwertproblem]]. Jetzt ist eine Lösung keineswegs garantiert. Die Funktion $y \equiv 0$, gelesen „y identisch null“, erfüllt zwar Gleichung und Randbedingungen immer. Sie heißt **triviale Lösung** und beschreibt nichts.

Gesucht sind die **nichttrivialen** Lösungen, also solche, die nicht überall null sind. Das Beispiel zeigt: Für die meisten $k$ gibt es keine, für einzelne $k$ gleich unendlich viele, nämlich alle Vielfachen einer Lösung. Welche $k$ das sind, rechnet der nächste Schritt aus.`,
        q:{q:R`Randwertproblem $y'' = -k^2y$ mit $y(0) = y(1) = 0$ und $k = 3$. Was gilt?`,
          opts:[R`Es gibt nur die triviale Lösung.`, R`Es gibt genau eine Lösung, $y = \sin(3x)/3$.`, R`Jedes $A\sin 3x$ ist eine Lösung.`], a:0,
          ex:R`$\sin 3 \approx 0{,}14 \ne 0$, also $A = 0$. Nichttriviale Lösungen gibt es erst bei $k = \pi \approx 3{,}14$.`,
          fb:['',
            R`$\sin(3x)/3$ löst das Anfangswertproblem. Bei $x = 1$ hat es den Wert $\sin(3)/3 \approx 0{,}05$, nicht null.`,
            R`Dazu müsste $\sin 3 = 0$ sein. Das ist es nicht; $3$ liegt knapp neben $\pi$.`]}},
      {id:'md-t4c', title:R`Die Eigenwerte $k_n = n\pi/L$`,
        pre:{from:'m-eigen', seg:'me-t3', title:'Eigenwertproblem', text:R`Eine Matrix $A$ hat den Eigenvektor $v \ne 0$ zum Eigenwert $\lambda$, wenn $Av = \lambda v$. Nur für einzelne Zahlen $\lambda$ gibt es solche $v$. Mini-Beispiel: $\begin{pmatrix}2 & 0\\ 0 & 3\end{pmatrix}\begin{pmatrix}1\\ 0\end{pmatrix} = 2\begin{pmatrix}1\\ 0\end{pmatrix}$, also der Eigenwert $2$.`},
        num:{title:'Ein Intervall der Länge 1', text:R`Für $L = 1$ sind die erlaubten Werte $k = \pi, 2\pi, 3\pi, \dots$, also etwa $3{,}14$, $6{,}28$ und $9{,}42$. Probe für $n = 2$: $y = \sin(2\pi x)$ ist bei $x = 0$ und $x = 1$ null und hat dazwischen eine Nullstelle bei $x = \tfrac12$.`},
        text:R`Die Herleitung rechnet allgemein. $y(0) = 0$ erzwingt $B = 0$. $y(L) = 0$ verlangt $A\sin kL = 0$. Mit $A \ne 0$ muss $\sin kL = 0$ sein, also

$$k_n = \frac{n\pi}{L},\qquad n = 1, 2, 3, \dots$$

Das ist ein **Eigenwertproblem** wie bei Matrizen. Schreib die Gleichung als $-y'' = k^2y$. Links wirkt der Operator $\hat D = -d^2/dx^2$ auf $y$, rechts steht eine Zahl mal $y$. Die Eigenwerte sind $\mu_n = k_n^2$, die Eigenfunktionen $\sin(n\pi x/L)$. Die Randbedingungen gehören dazu: Sie legen fest, welche Funktionen überhaupt zugelassen sind. Die Konstante $A$ bleibt frei.`,
        derive:{ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos', n:{int:[1, 4]}}, unknowns:{A:{ref:'1', kind:'real'}, B:{ref:'0', kind:'real'}, k:{ref:'nπ/L'}}}),
          lines:[
            {l:'y(x) = A sin(kx) + B cos(kx)', w:'allgemeine Lösung', why:{q:'Warum stehen hier zwei Konstanten?', opts:['Ordnung 2: zwei unabhängige Lösungen, also zwei Konstanten', 'eine für den Real- und eine für den Imaginärteil', 'eine je Randpunkt, also für $x = 0$ und $x = L$'], a:0, ex:'Die Zahl der freien Konstanten ist die Ordnung der DGL. Dass es hier auch zwei Randpunkte gibt, hat damit nichts zu tun – bei $y(0) = 0$, $y\'(0) = 1$ wären es zwei Bedingungen an einer Stelle.'}},
            {l:'y(0) = B = 0', w:'linker Rand', why:{q:'Warum fällt $B$ weg?', opts:['$\\sin 0 = 0$ und $\\cos 0 = 1$', 'weil $B$ immer null gewählt wird', 'wegen der Normierung'], a:0, ex:'Bei $x = 0$ bleibt nur $B\\cos 0 = B$.'}},
            {l:'y(L) = A sin(kL) = 0', w:'rechter Rand'},
            {l:'k = nπ/L', w:'A ≠ 0, also sin(kL) = 0', why:{q:'Warum nicht einfach $A = 0$?', opts:['Weil dann $y \\equiv 0$ wäre, die triviale Lösung.', 'Weil die Normierung $A = 1$ schon festlegt.', 'Weil $\\sin kL$ nie null werden kann.'], a:0, ex:'$A = 0$ ist die triviale Lösung. Nichttriviale Lösungen verlangen $\\sin kL = 0$, also $kL = n\\pi$. $n = 0$ gäbe wieder $y \\equiv 0$, negative $n$ dieselben Funktionen wie positive.'}}
          ]},
        q:{q:R`Wie viele Werte $k$ zwischen $0$ und $20$ geben für $y'' = -k^2y$ mit $y(0) = y(1) = 0$ eine nichttriviale Lösung?`,
          opts:['6', '7', '20'], a:0,
          ex:R`$k = n\pi$ mit $n = 1, \dots, 6$; $6\pi \approx 18{,}85$ liegt noch unter $20$, $7\pi \approx 21{,}99$ nicht mehr.`,
          fb:['',
            R`$7\pi \approx 22{,}0$ ist schon größer als $20$. Und $k = 0$ gibt nur $y \equiv 0$.`,
            R`Die erlaubten $k$ sind Vielfache von $\pi$, keine ganzen Zahlen.`]}},
      {id:'md-t4d', title:'Randbedingung im Bild und im Labor: Tafel',
        num:{title:R`$k = 9$ und $k = 3\pi$`, text:R`Das Anfangswertproblem mit $y(0) = 0$ und $y'(0) = 1$ liefert $y = \sin(kx)/k$. Für $k = 9$ ist $y(1) = \sin(9)/9 \approx 0{,}046$: knapp daneben. Für $k = 3\pi \approx 9{,}42$ ist $y(1) = 0$: Die Kurve trifft genau den rechten Rand.`},
        text:R`Das Labor dieses Themas verbindet Anfangs- und Randwertproblem. Es löst das Anfangswertproblem für jedes $k$ und prüft dann, ob die Lösung zusätzlich $y(1) = 0$ erfüllt. Im Bild ist das wie ein Zielschießen: Die Kurve startet bei $x = 0$ mit der Steigung 1. Du drehst am Regler $k$, bis sie den rechten Rand genau bei null trifft.

So siehst du, warum nur einzelne $k$ gehen. Für fast jedes $k$ landet die Kurve bei $x = 1$ über oder unter der Achse. Nur bei $k = n\pi$ trifft sie. Die Zahl der Nullstellen im Inneren ist dann $n - 1$.`,
        reps:{obj:R`Randwertproblem $y'' = -k^2y$ mit $y(0) = y(1) = 0$`,
          rows:[
            {k:'worte', text:R`Gesucht sind Schwingungen, die genau an beiden Enden eines Intervalls der Länge 1 null sind.`},
            {k:'formel', tex:R`\begin{gathered}y = A\sin kx,\\ A\sin k = 0\;\Rightarrow\; k = n\pi\end{gathered}`},
            {k:'mathe', tex:R`\begin{gathered}\hat D\,y = \mu\,y\quad\text{mit}\quad\hat D = -\frac{d^2}{dx^2}:\\ \mu_n = (n\pi)^2,\quad y_n = \sin(n\pi x)\end{gathered}`},
            {k:'graph', plot:{x:[0, 1], y:[-0.13, 0.13], xlab:'x', ylab:'y', ticks:[{x:1 / 3, lab:'1/3'}, {x:2 / 3, lab:'2/3'}, {x:1, lab:'1'}]}, f:x => Math.sin(3 * Math.PI * x) / (3 * Math.PI), lab:R`k = 3\pi`, f2:x => Math.sin(9 * x) / 9, lab2:R`$k = 9$`,
              cap:R`Durchgezogen $k = 3\pi$: trifft $y(1) = 0$, mit zwei Nullstellen im Inneren. Gestrichelt $k = 9$: verfehlt den Rand knapp.`},
            {k:'labor', text:R`Regler $k$ bei der Gleichung $y'' = -k^2y$: Bei $k \approx 3{,}14$, $6{,}28$ und $9{,}42$ meldet die Anzeige „Randbedingung $y(1) = 0$ erfüllt“, und der Punkt bei $x = 1$ liegt auf der Achse.`},
            {k:'physik', text:R`Eine Saite der Länge $L$, an beiden Enden eingespannt: Nur $k_n = n\pi/L$ passen, also die Frequenzen $f_n = n\,c/(2L)$, Grundton und Obertöne.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Null am linken Ende“ streicht den Kosinus; „null am rechten Ende“ wird zur Bedingung $\sin k = 0$.`},
            {from:'formel', to:'mathe', rule:R`Die Gleichung als $-y'' = k^2y$ schreiben: Der Operator $-d^2/dx^2$ spielt die Rolle der Matrix in $Av = \lambda v$, $k^2$ die des Eigenwerts. Die Randbedingungen legen fest, welche Funktionen als „Vektoren“ zugelassen sind.`},
            {from:'mathe', to:'graph', rule:R`Zu jedem Eigenwert $\mu_n$ die Eigenfunktion $y_n$ zeichnen: $n$ halbe Wellen zwischen den beiden Nullstellen am Rand.`},
            {from:'formel', to:'graph', rule:R`Für jedes erlaubte $n$ eine Kurve mit $n$ halben Wellen in $[0, 1]$ zeichnen; für andere $k$ endet die Kurve neben der Achse.`},
            {from:'graph', to:'labor', rule:R`Den Regler $k$ so lange drehen, bis der Endpunkt der Kurve auf der Achse liegt. Dieses $k$ ist ein Eigenwert.`},
            {from:'labor', to:'physik', rule:R`Jeder Eigenwert $k_n$ ist eine Eigenschwingung der Saite; mit $k = 2\pi f/c$ wird daraus eine Frequenz.`}
          ]},
        q:{q:R`Im Labor steht $k = 6{,}28$, und die Anzeige meldet „Randbedingung erfüllt“. Wie viele Nullstellen hat die Kurve im Inneren von $(0, 1)$?`, tr:{from:'labor', to:'graph'},
          opts:['1', '2', '6'], a:0,
          ex:R`$6{,}28 \approx 2\pi$, also $n = 2$: zwei halbe Wellen und eine Nullstelle im Inneren, bei $x = \tfrac12$.`,
          fb:['',
            R`Zwei Nullstellen im Inneren hat $n = 3$, also $k \approx 9{,}42$.`,
            R`Die Zahl der Nullstellen ist $n - 1$ mit $n = k/\pi$, nicht $k$ selbst.`]}},
      {id:'md-t4e', title:'Brücke zur Physik: Energiequantisierung im Kasten',
        num:{title:'Ein Elektron im Kasten von 1 nm', text:R`Mit $k_n = n\pi/L$ und $E = \hbar^2k^2/(2m)$ ist

$$E_n = \frac{n^2\pi^2\hbar^2}{2mL^2}.$$

Für ein Elektron und $L = 1\,\mathrm{nm}$ ist $E_1 \approx 0{,}376\,\mathrm{eV}$, $E_2 = 4E_1 \approx 1{,}50\,\mathrm{eV}$ und $E_3 = 9E_1 \approx 3{,}38\,\mathrm{eV}$.`},
        text:R`Ausblick auf Thema 3: Ein Teilchen in einem [[lex:kasten|Kasten]] mit undurchdringlichen Wänden bei $x = 0$ und $x = L$ erfüllt drinnen $\psi'' = -k^2\psi$ mit $k^2 = 2mE/\hbar^2$. An den Wänden muss $\psi = 0$ sein. Das ist genau das Randwertproblem dieses Abschnitts. Also sind nur $k_n = n\pi/L$ erlaubt und damit nur einzelne Energien $E_n$.

Die Quantisierung steckt nicht in der Gleichung allein, sondern in Gleichung **und** Randbedingungen. Im Bild daneben ist jede waagrechte Linie eine Energie $E_n \propto n^2$. Darauf sitzt die Eigenfunktion $\sin(n\pi x/L)$ mit $n - 1$ Knoten, so heißen die Nullstellen im Inneren.`,
        fig:{lab:'box', caption:'Die Lösungen des Randwertproblems $\\psi(0) = \\psi(L) = 0$: $\\psi_n \\propto \\sin(n\\pi x/L)$ mit $n - 1$ Knoten im Inneren und den Energien $E_n \\propto n^2$ (Thema 3).'},
        q:{q:R`Warum hat ein Teilchen auf der ganzen $x$-Achse ohne Wände beliebige Energien, ein Teilchen im Kasten aber nicht?`,
          opts:[R`Im Kasten wird die Gleichung durch die Wände nichtlinear.`, R`Ohne Wände wählt keine Randbedingung einzelne $k$ aus.`, R`Ohne Wände gibt es für kein $E$ eine Lösung $\psi$.`], a:1,
          ex:R`Im Kasten wählen $\psi(0) = \psi(L) = 0$ einzelne $k$ aus. $e^{ikx}$ löst die freie Gleichung für jedes $k$; keine zweite Stelle stellt eine Bedingung.`,
          fb:[R`Die Gleichung ist in beiden Fällen dieselbe lineare DGL $\psi'' = -k^2\psi$. Den Unterschied machen die Randbedingungen.`,
            '',
            R`$e^{ikx}$ löst die Gleichung für jedes $k$. Es gibt eher zu viele Lösungen als zu wenige.`]}},
      {id:'md-t4f', title:'Andere Randbedingungen: Ableitung null, Abklingen, Anschluss',
        num:{title:R`$y(0) = 0$ und $y'(L) = 0$`, text:R`Aus $y(0) = 0$ folgt $y = A\sin kx$. Die Bedingung $y'(L) = Ak\cos kL = 0$ verlangt $\cos kL = 0$, also $kL = \tfrac{\pi}{2}, \tfrac{3\pi}{2}, \dots$ Für $L = 1$ sind das $k \approx 1{,}57$, $4{,}71$ und $7{,}85$.`},
        text:R`Randbedingungen müssen nicht $y = 0$ heißen. Eine waagrechte Tangente $y'(L) = 0$ wählt andere $k$ aus, aber wieder nur einzelne. In der Quantenmechanik kommen Randbedingungen in drei Formen vor (Ausblick):

- **Wände:** $\psi = 0$ am Rand eines unendlich hohen Potentials (Thema 3).
- **Abklingen:** Reicht ein Bereich bis $x \to \infty$, muss $\psi$ dort beschränkt bleiben. Von $Ce^{\kappa x} + De^{-\kappa x}$ fällt dann $C$ weg. Diese Bedingung „im Unendlichen“ wählt die Energien im endlichen Topf (Thema 5) und beim Oszillator (Thema 7) aus.
- **[[lex:anschluss|Anschluss]]:** An einer Stufe des Potentials müssen $\psi$ und $\psi'$ stetig sein. Das verbindet die Lösungen benachbarter Bereiche (Thema 5).`,
        q:{q:R`$y'' = -k^2y$ auf $[0, 2]$ mit $y(0) = 0$ und $y'(2) = 0$. Welches ist das kleinste erlaubte $k > 0$?`,
          opts:[R`$\pi/4$`, R`$\pi/2$`, R`$\pi$`], a:0,
          ex:R`$y = A\sin kx$ und $y'(2) = Ak\cos 2k = 0$, also $2k = \pi/2$ und $k = \pi/4$.`,
          fb:['',
            R`$\pi/2$ wäre richtig für $L = 1$. Hier ist $L = 2$: Aus $2k = \pi/2$ folgt $k = \pi/4$.`,
            R`$\cos(2\pi) = 1 \ne 0$. Hier verschwindet die Ableitung, gesucht ist $\cos 2k = 0$.`]}},
      {id:'md-t4g', title:'Typischer Fehler: aus $A\\sin kL = 0$ auf $A = 0$ schließen',
        num:{title:R`$A\sin(kL) = 0$`, text:R`Ein Produkt ist null, wenn ein Faktor null ist. Hier gibt es zwei Möglichkeiten: $A = 0$ oder $\sin(kL) = 0$. Mit $A = 0$ ist $y \equiv 0$, und die Rechnung endet, bevor sie etwas gefunden hat. Mit $\sin(kL) = 0$ folgen die Eigenwerte $k_n = n\pi/L$.`},
        text:R`Ein häufiger Fehler beim Randwertproblem ist, aus $A\sin kL = 0$ sofort $A = 0$ zu schließen. Das ist formal richtig, liefert aber nur die triviale Lösung $y \equiv 0$. In der Quantenmechanik hieße das: kein Teilchen. Gesucht sind gerade die $k$, für die eine nichttriviale Lösung existiert.

Zwei weitere Fallen: $n = 0$ gibt $\sin 0 = 0$, also wieder $y \equiv 0$; es gehört nicht dazu. Negative $n$ geben $\sin(-n\pi x/L) = -\sin(n\pi x/L)$, also dieselben Funktionen bis auf das Vorzeichen. Deshalb zählt man $n = 1, 2, 3, \dots$`,
        q:{q:R`Jemand schreibt: „$A\sin(kL) = 0$, also $A = 0$. Das Randwertproblem hat keine Lösung.“ Was ist falsch?`,
          opts:[R`Nichts, die Rechnung ist vollständig.`, R`Der Fall $\sin(kL) = 0$ fehlt; er gibt $k = n\pi/L$.`, R`Aus $y(0) = 0$ hätte $A = 1$ folgen müssen.`], a:1,
          ex:R`Beide Faktoren können null sein. Der interessante Fall ist $\sin(kL) = 0$.`,
          fb:[R`Die triviale Lösung $y \equiv 0$ erfüllt alles, beschreibt aber nichts. Gesucht sind die $k$ mit nichttrivialer Lösung.`,
            '',
            R`$y(0) = 0$ legt $B$ fest, nicht $A$. $A$ bleibt frei; in der Quantenmechanik legt es die Normierung fest.`]}}
    ]},

    /* ===== Abschnitt 5: Separationsansatz ===== */
    {id:'md-t5', title:'Separationsansatz: aus einer partiellen DGL werden zwei gewöhnliche', steps:[
      {id:'md-t5a', title:'Partielle DGL: Funktionen von zwei Variablen',
        num:{title:'Die Wärmeleitungsgleichung', text:R`Die Temperatur $u(x, t)$ in einem dünnen Stab erfüllt $\partial_t u = \partial_x^2u$, in passenden Einheiten. Prüfe $u = \sin x\,e^{-t}$: Es ist $\partial_t u = -\sin x\,e^{-t}$ und $\partial_x^2u = -\sin x\,e^{-t}$. Beide Seiten stimmen überein.`},
        text:R`Hängt die gesuchte Funktion von mehreren Variablen ab, enthält die Gleichung **partielle** Ableitungen. $\partial_t u$, gelesen „d nach t von u“, ist die Ableitung nach $t$, während $x$ festgehalten wird. Eine solche Gleichung heißt **partielle DGL**. Gleichungen mit nur einer Variablen wie in den Abschnitten 1 bis 4 heißen **gewöhnlich**.

Die Grundgleichung der Quantenmechanik ist eine partielle DGL (Ausblick auf Thema 2). Für ein freies Teilchen lautet die zeitabhängige Schrödingergleichung

$$i\hbar\,\frac{\partial\Psi}{\partial t} = -\frac{\hbar^2}{2m}\frac{\partial^2\Psi}{\partial x^2}.$$

Gesucht ist die Wellenfunktion $\Psi(x, t)$, eine Funktion von Ort und Zeit.`,
        q:{q:'Welche Gleichung ist eine partielle DGL?',
          opts:[R`$\partial_t u = 3\,\partial_x^2 u$ für $u(x, t)$`, R`$y'' + 4y = 0$ für $y(x)$`, R`$i\hbar f'(t) = Ef(t)$ für $f(t)$`], a:0,
          ex:R`Nur $u$ hängt von zwei Variablen ab, und die Gleichung verknüpft Ableitungen nach beiden.`,
          fb:['',
            R`$y$ hängt nur von $x$ ab: eine gewöhnliche DGL.`,
            R`$f$ hängt nur von $t$ ab: gewöhnlich, auch wenn $i$ und $\hbar$ darin stehen.`]}},
      {id:'md-t5b', title:'Der Produktansatz: Variablen trennen',
        num:{title:R`$u = \varphi(x)\,f(t)$`, text:R`Setze $u = \varphi(x)f(t)$ in $\partial_t u = \partial_x^2u$ ein: $\varphi f' = \varphi''f$. Teilen durch $\varphi f$ gibt

$$\frac{f'(t)}{f(t)} = \frac{\varphi''(x)}{\varphi(x)}.$$

Für $u = \sin x\,e^{-t}$ ist links $-e^{-t}/e^{-t} = -1$ und rechts $-\sin x/\sin x = -1$. Beide Seiten sind dieselbe Konstante.`},
        text:R`Der [[lex:separation|Separationsansatz]] versucht es mit einem Produkt aus einer Funktion des Orts und einer Funktion der Zeit. Nach dem Teilen steht links nur $t$, rechts nur $x$. Jetzt kommt das entscheidende Argument. Hältst du $t$ fest und änderst $x$, ändert sich die linke Seite nicht. Also kann sich auch die rechte nicht ändern, und ebenso umgekehrt. Beide Seiten sind deshalb gleich derselben **Konstanten**, der Separationskonstanten.

Aus einer partiellen DGL werden so zwei gewöhnliche, verbunden über diese Konstante. Für gewöhnliche DGL hast du in den Abschnitten 2 bis 4 alle Werkzeuge.`,
        q:{q:R`Nach dem Einsetzen gilt $g(t) = h(x)$ für alle $x$ und $t$. Was folgt daraus?`,
          opts:[R`Beide Seiten sind gleich null, für alle $x$ und $t$.`, R`Beide Seiten sind gleich derselben Konstanten.`, R`$x$ und $t$ können nicht unabhängig sein.`], a:1,
          ex:R`Hält man $t$ fest und variiert $x$, bleibt $g(t)$ gleich – also ist $h(x)$ konstant. Ebenso $g(t)$. Null muss die Konstante nicht sein.`,
          fb:[R`Konstant heißt nicht null. Bei $\sin x\,e^{-t}$ ist die Konstante $-1$.`,
            '',
            R`$x$ und $t$ sind unabhängige Variablen; gerade deshalb müssen beide Seiten konstant sein.`]}},
      {id:'md-t5c', title:'Zwei gewöhnliche DGL aus der Schrödingergleichung',
        pre:{from:'m-komplex', seg:'mk-t4', title:'Der Zeitfaktor', text:R`Die Regel $\frac{d}{dt}e^{at} = a\,e^{at}$ gilt auch für komplexes $a$. Der Zeitfaktor $e^{-i\omega t}$ hat für alle $t$ den Betrag $1$; nur seine Phase dreht sich. Mini-Beispiel: $\frac{d}{dt}e^{-2it} = -2i\,e^{-2it}$.`},
        num:{title:'Ein Elektron mit 1 eV', text:R`Für $E = 1\,\mathrm{eV}$ und $\hbar \approx 6{,}58\cdot 10^{-16}\,\mathrm{eV\,s}$ dreht sich die Phase von $f(t) = e^{-iEt/\hbar}$ einmal ganz herum nach

$$T = \frac{2\pi\hbar}{E} \approx 4{,}14\cdot 10^{-15}\,\mathrm{s} = 4{,}14\,\mathrm{fs}.$$`},
        text:R`Für die Schrödingergleichung des freien Teilchens gibt derselbe Ansatz $\Psi = \varphi(x)f(t)$ nach dem Teilen

$$i\hbar\,\frac{f'(t)}{f(t)} = -\frac{\hbar^2}{2m}\,\frac{\varphi''(x)}{\varphi(x)} = E.$$

Die Konstante heißt $E$, weil sie sich als Energie herausstellt. Die Zeitgleichung $i\hbar f' = Ef$ hat die Ordnung 1; der Exponentialansatz gibt $f(t) = e^{-iEt/\hbar}$. Die Ortsgleichung $-\frac{\hbar^2}{2m}\varphi'' = E\varphi$ ist die zeitunabhängige Schrödingergleichung, ein Eigenwertproblem wie in Abschnitt 4. Randbedingungen an $\varphi$ legen fest, welche $E$ erlaubt sind. Die Herleitung prüft das Ganze für $\varphi = e^{ikx}$.`,
        derive:{ctx:{coords:['x', 't'], params:{m:'pos', k:'pos'}, funcs:['Ψ', 'f']},
          lines:[
            {l:'E = ħ^2 k^2/(2m)', w:'Separationskonstante für φ = e^(ikx)'},
            {l:'f(t) = e^(-i E t/ħ)', w:'Lösung der Zeitgleichung'},
            {l:'iħ d/dt f(t) = E f(t)', w:'Probe', why:{q:'Warum steht im Exponenten $-iE/\\hbar$?', opts:['Aus $i\\hbar\\lambda = E$ folgt $\\lambda = -iE/\\hbar$, denn $1/i = -i$.', 'Das ist Konvention, denn $e^{+iEt/\\hbar}$ löst die Gleichung genauso.', 'Damit $f$ für große $t$ abklingt, denn $E$ ist positiv.'], a:0, ex:'$f$ klingt nicht ab: $|e^{-iEt/\\hbar}| = 1$. Nur die Phase dreht sich. Und $e^{+iEt/\\hbar}$ gäbe $i\\hbar f\' = -Ef$, also die falsche Gleichung.'}},
            {l:'Ψ(x,t) = e^(ikx) f(t)', w:'Produktansatz'},
            {l:'iħ ∂/∂t Ψ(x,t) = E Ψ(x,t)', w:'linke Seite'},
            {l:'-ħ^2/(2m) ∂^2/∂x^2 Ψ(x,t) = E Ψ(x,t)', w:'rechte Seite', why:{q:R`Woher kommt auf der rechten Seite derselbe Faktor $E$?`, opts:['weil $-\\frac{\\hbar^2}{2m}(ik)^2 = \\frac{\\hbar^2k^2}{2m} = E$ ist', 'weil $f(t)$ den Faktor $E$ schon in sich trägt', 'weil beide Seiten für alle $x$ gleich null sind'], a:0, ex:R`$-\frac{\hbar^2}{2m}(ik)^2 = \frac{\hbar^2k^2}{2m}$, genau die Separationskonstante aus Zeile 1.`}},
            {l:'iħ ∂/∂t Ψ(x,t) = -ħ^2/(2m) ∂^2/∂x^2 Ψ(x,t)', w:'beide Seiten gleich: Lösung', why:{q:'Was zeigt die Rechnung?', opts:['Das Produkt ist eine Lösung, weil beide Teile dasselbe $E$ haben.', 'Jede Lösung hat diese Produktform, weil der Ansatz alle Lösungen findet.', 'Die Gleichung gilt nur bei $t = 0$, weil dort $f(0) = 1$ ist.'], a:0, ex:'Die gemeinsame Konstante $E$ verbindet Zeit- und Ortsteil. Überlagerungen verschiedener $E$ sind ebenfalls Lösungen, aber keine Produkte.'}}
          ]},
        q:{q:R`Wie verändert sich der Betrag $|f(t)|$ von $f(t) = e^{-iEt/\hbar}$ mit der Zeit?`,
          opts:[R`Er bleibt $1$; nur die Phase dreht sich.`, R`Er fällt exponentiell ab wie $e^{-Et/\hbar}$.`, R`Er schwingt zwischen $-1$ und $1$.`], a:0,
          ex:R`$|e^{-i\varphi}| = 1$ für jedes reelle $\varphi$. Real- und Imaginärteil schwingen, der Betrag nicht.`,
          fb:['',
            R`Ohne das $i$ im Exponenten wäre es so. Mit $i$ ist der Exponent rein imaginär.`,
            R`So verhält sich der Realteil $\cos(Et/\hbar)$. Ein Betrag ist nie negativ und hier immer $1$.`]}},
      {id:'md-t5d', title:'Produktlösung in Formel und Bild: Tafel',
        num:{title:'Realteil und Betrag', text:R`Für $\Psi = e^{ikx}e^{-i\omega t}$ mit $\omega = E/\hbar$ ist der Realteil $\cos(kx - \omega t)$. Mit $k = 2\pi$ ist er bei $t = 0$ gleich $\cos(2\pi x)$ und eine Viertelperiode später gleich $\cos(2\pi x - \pi/2) = \sin(2\pi x)$. Der Betrag ist immer $|\Psi| = 1$, also auch $|\Psi|^2 = 1$.`},
        text:R`Eine Produktlösung hat eine besondere Eigenschaft. Ihr Betragsquadrat ist $|\Psi|^2 = |\varphi(x)|^2\,|f(t)|^2 = |\varphi(x)|^2$, denn $|f(t)| = 1$. Es hängt nicht von der Zeit ab. Real- und Imaginärteil bewegen sich, das Betragsquadrat steht still.

In der Quantenmechanik ist $|\Psi|^2$ die Aufenthaltswahrscheinlichkeit pro Länge (Thema 1). Deshalb heißen Produktlösungen [[lex:stationaer|stationär]]: Nichts, was man am Ort misst, ändert sich. Die Tafel zeigt das am freien Teilchen mit $\varphi = e^{ikx}$.`,
        reps:{obj:R`Die Produktlösung $\Psi(x,t) = e^{ikx}\,e^{-i\omega t}$`,
          rows:[
            {k:'formel', tex:R`i\hbar\,\partial_t\Psi = -\tfrac{\hbar^2}{2m}\,\partial_x^2\Psi`},
            {k:'mathe', tex:R`\begin{gathered}i\hbar f' = Ef,\qquad -\tfrac{\hbar^2}{2m}\varphi'' = E\varphi\\ E = \tfrac{\hbar^2k^2}{2m} = \hbar\omega\end{gathered}`},
            {k:'graph', plot:{x:[0, 2], y:[-1.3, 1.3], xlab:'x', ylab:R`\mathrm{Re}\,\Psi`, ticks:[{x:1, lab:'2\\pi/k'}, {x:2, lab:'4\\pi/k'}]}, f:x => Math.cos(2 * Math.PI * x), lab:R`$t = 0$`, f2:x => Math.sin(2 * Math.PI * x), lab2:R`\omega t = \pi/2`,
              cap:R`Der Realteil $\cos(kx - \omega t)$ verschiebt sich mit der Zeit nach rechts. $|\Psi|^2 = 1$ bleibt überall gleich.`},
            {k:'worte', text:R`Ortsteil mal Zeitfaktor. Der Zeitfaktor dreht nur die Phase; das Betragsquadrat hängt nicht von $t$ ab.`},
            {k:'physik', text:R`Ausblick: Ein stationärer Zustand hat eine zeitlich konstante Aufenthaltswahrscheinlichkeit $|\Psi|^2$ und eine feste Energie $E$ (Thema 2).`}
          ],
          links:[
            {from:'formel', to:'mathe', rule:R`$\Psi = \varphi f$ einsetzen, durch $\varphi f$ teilen und beide Seiten gleich $E$ setzen.`},
            {from:'mathe', to:'graph', rule:R`Beide Lösungen multiplizieren, $e^{ikx}e^{-i\omega t} = e^{i(kx - \omega t)}$, und den Realteil für zwei Zeiten zeichnen.`},
            {from:'graph', to:'worte', rule:R`Die Kurven vergleichen: Die Form wandert, der Betrag $|e^{i(kx - \omega t)}| = 1$ bleibt.`},
            {from:'worte', to:'physik', rule:R`„Betragsquadrat zeitunabhängig“ heißt in der Quantenmechanik „stationär“.`}
          ]},
        q:{q:R`Für die Produktlösung $\Psi = \sin(\pi x)\,e^{-i\omega t}$ auf $[0, 1]$: Wie sieht der Graph von $|\Psi|^2$ zu verschiedenen Zeiten aus?`, tr:{from:'formel', to:'graph'},
          opts:[R`immer dieselbe Kurve $\sin^2(\pi x)$`, R`$\sin^2(\pi x)$, mal höher, mal flacher`, R`eine Kurve, die nach rechts wandert`], a:0,
          ex:R`$|e^{-i\omega t}| = 1$, also ist $|\Psi|^2 = \sin^2(\pi x)$ zu jeder Zeit.`,
          fb:['',
            R`Das Betragsquadrat des Zeitfaktors ist immer $1$; es streckt nichts.`,
            R`Wandern tut der Realteil einer laufenden Welle. $|\Psi|^2$ eines Produkts steht still.`]}},
      {id:'md-t5e', title:'Die allgemeine Lösung: eine Überlagerung',
        pre:{from:'m-hilbert', seg:'mh-t3', title:'Entwickeln nach einem Orthonormalsystem', text:R`Ist $\varphi_1, \varphi_2, \dots$ ein Orthonormalsystem, dann hat $f = \sum_n c_n\varphi_n$ die Komponenten $c_n = \langle\varphi_n|f\rangle = \int\varphi_n^*f\,dx$. Mini-Beispiel: $f = 3\varphi_1 - \varphi_2$ hat $c_1 = 3$ und $c_2 = -1$.`},
        num:{title:'Zwei Produktlösungen im Kasten', text:R`Im Kasten mit $L = 1\,\mathrm{nm}$ sind $\varphi_1e^{-iE_1t/\hbar}$ und $\varphi_2e^{-iE_2t/\hbar}$ Produktlösungen, mit $E_1 \approx 0{,}376\,\mathrm{eV}$ und $E_2 = 4E_1$ (Abschnitt 4). Das Betragsquadrat ihrer Summe enthält einen Mischterm mit $\cos\left((E_2 - E_1)t/\hbar\right)$. Er wiederholt sich nach $T = 2\pi\hbar/(E_2 - E_1) \approx 3{,}7\,\mathrm{fs}$.`},
        text:R`Die Schrödingergleichung ist linear (Abschnitt 1). Also ist jede Summe von Produktlösungen wieder eine Lösung:

$$\Psi(x,t) = \sum_n c_n\,\varphi_n(x)\,e^{-iE_nt/\hbar}.$$

Das ist die **allgemeine Lösung**. Die Koeffizienten $c_n$ folgen aus dem Anfangszustand $\Psi(x, 0)$ durch Entwicklung nach den $\varphi_n$. Eine Summe steht da, wenn Randbedingungen nur einzelne $E_n$ erlauben. Ohne Wände wird sie zu einem Integral über $k$ (M6, Thema 4).

Im Bild daneben ist die blaue Kurve $|\Psi|^2$ für zwei Anteile. Der Regler $|c_1|^2$ stellt das Gewicht von $\varphi_1$ ein, der zweite Regler die Zeit $t$. Die rote Linie markiert den Schwerpunkt der Kurve. Bei $|c_1|^2 = 0$ oder $1$ bleibt alles stehen, sonst schwappt die Kurve hin und her.`,
        fig:{lab:'twostate', caption:'Eine Überlagerung zweier Produktlösungen ist selbst kein Produkt: Ihre Dichte schwappt hin und her. Nur bei $|c_1|^2 = 0$ oder $1$ bleibt sie stehen.'},
        q:{q:R`$\Psi = \varphi_1e^{-iE_1t/\hbar} + \varphi_2e^{-iE_2t/\hbar}$ mit $E_1 \ne E_2$. Welche Aussage stimmt?`,
          opts:[R`$\Psi$ ist keine Lösung, weil kein Produkt.`, R`$\Psi$ ist ein Produkt mit $E = E_1 + E_2$.`, R`$\Psi$ ist eine Lösung, aber kein Produkt.`], a:2,
          ex:R`Die Gleichung ist linear, also ist die Summe zweier Lösungen eine Lösung. Ein Produkt ist sie nicht: Ihr Betragsquadrat hängt von $t$ ab.`,
          fb:[R`Lösungen müssen keine Produkte sein. Die Gleichung ist linear, also ist die Summe eine Lösung.`,
            R`Bei einem Produkt wäre $|\Psi|^2$ zeitunabhängig. Hier enthält es einen Mischterm, der mit der Zeit schwankt.`,
            '']}},
      {id:'md-t5f', title:'Typischer Fehler: „Jede Lösung ist ein Produkt“',
        num:{title:'Zwei Produkte addiert', text:R`$u = \sin x\,e^{-t} + \sin 2x\,e^{-4t}$ löst die Wärmeleitungsgleichung. Wäre $u$ ein Produkt $\varphi(x)f(t)$, dann wäre das Verhältnis $u(\pi/4, t)/u(\pi/2, t)$ zeitlich konstant. Es ist aber $0{,}71 + e^{-3t}$, also $1{,}71$ bei $t = 0$ und $0{,}76$ bei $t = 1$. Die Form der Kurve ändert sich.`},
        text:R`Ein verbreiteter Irrtum lautet: „Der Separationsansatz findet alle Lösungen, also ist jede Lösung ein Produkt.“ Der Ansatz findet nur die Produktlösungen. Ihre Überlagerungen sind ebenfalls Lösungen, aber im Allgemeinen keine Produkte. Bei einem Produkt behält die Kurve über $x$ ihre Form und ändert nur Höhe oder Phase. Bei einer Überlagerung ändert sich die Form.

Separation liefert also die Bausteine, nicht alle Lösungen. Das Verfahren funktioniert, wenn sich die Gleichung so umstellen lässt, dass jede Seite nur von einer Variablen abhängt. Mit einem zeitunabhängigen Potential $V(x)$ klappt es genauso. In drei Dimensionen trennt man ebenso den Abstand $r$ von den Winkeln (M8, Thema 9).`,
        q:{q:'Ist $u(x, t) = \\sin x\\,\\cos 2t + \\sin x\\,\\sin 2t$ ein Produkt $\\varphi(x)f(t)$?',
          opts:['Nein, es ist eine Summe zweier Produkte.', 'Ja: $u = \\sin x\\,(\\cos 2t + \\sin 2t)$, die Form über $x$ bleibt.', 'Nein: Die Höhe von $u$ ändert sich mit der Zeit.'], a:1,
          ex:'Beide Summanden haben dieselbe Ortsfunktion $\\sin x$. Ausklammern gibt $u = \\sin x\\,(\\cos 2t + \\sin 2t)$, ein Produkt: Die Form bleibt $\\sin x$, nur die Höhe ändert sich. Eine Überlagerung ist erst dann kein Produkt, wenn verschiedene Ortsfunktionen mit verschiedenen Zeitfaktoren vorkommen, wie im Beispiel oben.',
          fb:['Eine Summe kann trotzdem ein Produkt sein: Beide Summanden enthalten $\\sin x$, das lässt sich ausklammern.', '', 'Die Höhe darf sich auch bei einem Produkt ändern, etwa bei $\\sin x\\,e^{-t}$. Entscheidend ist, ob sich die Form über $x$ ändert.']}}
    ]}
  ],
  example:{
    title:'Anfangswertproblem mit dem Exponentialansatz',
    text:'Löse $y\'\' + 4y = 0$ mit $y(0) = 1$ und $y\'(0) = 6$.\n\nSchreibweise in der Lernhilfe: Funktionen immer mit Argument, also `y(x)`, `y\'(0)`, `y\'\'(x)`. Eine Zeile `y(x) = …` führt die Funktion ein.',
    ctx:DGL({unknowns:{λ:{ref:'2i', alt:['-2i'], kind:'complex'}, A:{ref:'1', kind:'real'}, B:{ref:'3', kind:'real'}}}),
    lines:[
      {l:'d^2/dx^2 e^(λx) + 4 e^(λx) = (λ^2 + 4) e^(λx)', why:{q:'Warum setzt man $y = e^{\\lambda x}$ an?', opts:['Ableiten reproduziert $e^{\\lambda x}$; übrig bleibt eine Gleichung für $\\lambda$.', 'Weil jede Lösung einer DGL eine reelle Exponentialfunktion ist.', 'Weil $e^{\\lambda x}$ bei $x = 0$ den Wert 1 hat, wie $y(0)$.'], a:0, ex:'Bei konstanten Koeffizienten bleibt nach dem Einsetzen nur ein Polynom in $\\lambda$ mal $e^{\\lambda x}$ übrig.'}},
      {l:'λ^2 + 4 = 0', why:{q:'Warum darf man durch $e^{\\lambda x}$ teilen?', opts:['$e^{\\lambda x}$ ist nie null.', 'Weil hier $\\lambda = 0$ ist.', 'Das ist nur eine Näherung.'], a:0, ex:'Übrig bleibt die **charakteristische Gleichung** $\\lambda^2 + 4 = 0$.'}},
      {l:'λ = ±2i', why:{q:'Was bedeuten imaginäre Wurzeln für die Lösung?', opts:['Sie schwingt: $e^{\\pm 2ix} = \\cos 2x \\pm i\\sin 2x$.', 'Es gibt keine reelle Lösung.', 'Sie wächst exponentiell an.'], a:0, ex:'Euler-Formel (M1). Reelle Kombinationen von $e^{2ix}$ und $e^{-2ix}$ sind $\\cos 2x$ und $\\sin 2x$.'}},
      {l:'y(x) = A cos(2x) + B sin(2x)', why:{q:'Warum stehen hier zwei Konstanten?', opts:['Zwei unabhängige Lösungen; jede Kombination löst die DGL wieder.', 'Eine Konstante für den Real-, eine für den Imaginärteil.', 'Aus Gewohnheit; eine einzige Konstante würde genügen.'], a:0, ex:'Superposition: Die Gleichung ist linear und homogen. Die allgemeine Lösung hat so viele Konstanten wie die Ordnung.'}},
      {l:'y(0) = A = 1', why:{q:'Welche Konstante legt $y(0)$ fest?', opts:['$A$, denn $\\cos 0 = 1$ und $\\sin 0 = 0$.', '$B$, denn $\\sin 0 = 1$ und $\\cos 0 = 0$.', 'beide zusammen, als Summe $A + B$.'], a:0, ex:'Bei $x = 0$ verschwindet der Sinus-Anteil.'}},
      {l:"y'(0) = 2B = 6", why:{q:'Woher kommt der Faktor 2?', opts:['Kettenregel: $\\frac{d}{dx}\\sin 2x = 2\\cos 2x$.', 'Aus der Anfangsbedingung $y(0) = 1$.', 'Aus der Produktregel für $B\\sin 2x$.'], a:0, ex:'$y\'(x) = -2A\\sin 2x + 2B\\cos 2x$, bei $x = 0$ bleibt $2B$. Also $B = 3$.'}},
      {l:'y(x) = cos(2x) + 3 sin(2x)', why:{q:'Wie prüfst du das Ergebnis am schnellsten?', opts:['Einsetzen: $y\'\' = -4y$, und beide Anfangswerte stimmen.', 'Eine Skizze der Kurve reicht dafür aus.', 'Gar nicht nötig, der Rechenweg war ja richtig.'], a:0, ex:'$y\'\' = -4\\cos 2x - 12\\sin 2x = -4y$, $y(0) = 1$, $y\'(0) = 6$. Ein Anfangswertproblem hat genau eine Lösung – also ist es diese.'}}
    ],
    faded:{id:'md-fade', title:'Jetzt du: $y\'\' = \\kappa^2y$ mit beschränkter Lösung',
      text:'Für $x > 0$ gilt $y\'\' = \\kappa^2y$ mit $\\kappa > 0$. Die Lösung soll für $x\\to\\infty$ beschränkt bleiben, und es ist $y(0) = y_0$. Die charakteristische Gleichung ist schon gelöst.',
      ctx:DGL({domain:{x:['0', '∞']}, params:{κ:'pos', y_0:'pos'}, unknowns:{λ:{ref:'κ', alt:['-κ'], kind:'real'}, C:{ref:'0', kind:'real'}, D:{ref:'y_0', kind:'real'}}}),
      given:['λ^2 - κ^2 = 0', 'λ = ±κ'],
      goals:[{id:'a', prompt:'Bestimme $y(x)$.', type:'value', target:'y_0 e^(-κx)', points:2,
        hints:['Schreib die allgemeine Lösung zu $\\lambda = \\pm\\kappa$ auf und prüfe, welcher Teil für $x\\to\\infty$ beschränkt bleibt.', 'Allgemein ist $y(x) = Ce^{\\kappa x} + De^{-\\kappa x}$.', '$e^{\\kappa x}$ wächst für $x\\to\\infty$ über alle Grenzen, also muss $C = 0$ sein.'],
        model:['λ^2 - κ^2 = 0', 'λ = ±κ', {l:'y(x) = C e^(κx) + D e^(-κx)', gap:'y(x) = C e^(κx) + ▢'}, {l:'C = 0', w:'beschränkt für x → ∞'}, 'y(0) = D = y_0', 'y(x) = y_0 e^(-κx)'],
        mistakes:[{expr:'y_0 e^(κx)', msg:'Diese Lösung wächst für $x\\to\\infty$ über alle Grenzen. Beschränkt bleibt nur der Anteil $e^{-\\kappa x}$.'}]}]}
  },
  puzzle:{
    title:'Ein Rand, der nicht null ist',
    text:'In Abschnitt 4 hat $y\'\' = -k^2y$ mit $y(0) = 0$ und $y(1) = 0$ nur für $k = \\pi, 2\\pi, 3\\pi, \\dots$ eine Lösung, die nicht überall null ist.\n\nJetzt ändern wir die zweite Randbedingung: Statt $y(1) = 0$ verlangen wir $y(1) = 1$. Für welche $k > 0$ gibt es dann eine Lösung?',
    q:{q:'Deine Vermutung:', opts:['nur für $k = n\\pi$, wie bei $y(1) = 0$', 'für alle $k > 0$ außer $k = n\\pi$', 'für jedes $k > 0$', 'für kein $k$'], a:1, ex:'$y = A\\sin kx$ mit $A\\sin k = 1$: Das geht genau dann, wenn $\\sin k \\neq 0$ ist.'},
    reveal:'Mit $y(0) = 0$ bleibt wieder $y = A\\sin(kx)$. Die neue Bedingung verlangt $A\\sin k = 1$. Ist $\\sin k \\neq 0$, folgt $A = 1/\\sin k$: genau eine Lösung. Ist $k = n\\pi$, steht links $0$, und es gibt **keine** Lösung.\n\nDas ist genau umgekehrt wie beim homogenen Problem. Bei $y(1) = 0$ gibt es nur für die Eigenwerte $k = n\\pi$ eine nichttriviale Lösung. Bei $y(1) = 1$ scheitert das Problem gerade bei diesen Werten und klappt sonst immer. Diese Gegenüberstellung heißt **Fredholm-Alternative**: Entweder hat das homogene Problem eine nichttriviale Lösung, oder das inhomogene ist für jede rechte Seite eindeutig lösbar.\n\nIn der Nähe von $k = n\\pi$ wird die Amplitude $A = 1/\\sin k$ beliebig groß. Physikalisch ist das eine **Resonanz**. Bewegt man das Ende einer bei $x = 0$ eingespannten Saite periodisch mit fester Amplitude, beschreibt $y(x)$ die Form der erzwungenen Schwingung, und $k$ gehört zur Anregungsfrequenz. Nahe einer Eigenfrequenz wird die Amplitude sehr groß; genau bei ihr gibt es keine solche stationäre Schwingung.'
  },
  clarify:{
    core:'Eine lineare homogene DGL 2. Ordnung mit konstanten Koeffizienten,\n\n$$y\'\' + a\\,y\' + b\\,y = 0,$$\n\nlöst man mit dem Exponentialansatz $y = e^{\\lambda x}$. Er führt auf die **charakteristische Gleichung** $\\lambda^2 + a\\lambda + b = 0$:\n\n- zwei verschiedene reelle Wurzeln: $y = C_1e^{\\lambda_1x} + C_2e^{\\lambda_2x}$,\n- komplexe Wurzeln $\\lambda = \\alpha\\pm i\\beta$: $y = e^{\\alpha x}(A\\cos\\beta x + B\\sin\\beta x)$,\n- doppelte Wurzel $\\lambda_0$: $y = (C_1 + C_2x)e^{\\lambda_0x}$.\n\nDie zwei Konstanten werden durch zwei Bedingungen festgelegt. Stehen beide an derselben Stelle ($y(0)$ und $y\'(0)$: **Anfangswertproblem**), gibt es immer genau eine Lösung. Stehen sie an zwei Stellen und sind homogen ($y(0) = y(L) = 0$: **homogenes Randwertproblem**), hat $y\'\' = -k^2y$ nichttriviale Lösungen nur für $k = n\\pi/L$. Die Randbedingungen machen aus der DGL ein **Eigenwertproblem** – das ist der Mechanismus hinter der Energiequantisierung.\n\nEine partielle DGL wie $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi$ zerlegt der **Separationsansatz** $\\Psi = \\varphi(x)f(t)$ in zwei gewöhnliche DGL mit derselben Konstanten $E$: $i\\hbar f\' = Ef$ und $-\\frac{\\hbar^2}{2m}\\varphi\'\' = E\\varphi$. Die allgemeine Lösung ist die Überlagerung $\\sum_nc_n\\varphi_ne^{-iE_nt/\\hbar}$.',
    keys:[
      'Zur Ordnung gehört die Zahl der freien Konstanten: zwei bei $y\'\'$, eine bei $f\' = -i\\omega f$.',
      '$y\'\' = -k^2y$ schwingt: $y = A\\sin kx + B\\cos kx = Ce^{ikx} + De^{-ikx}$. $y\'\' = +\\kappa^2y$ wächst oder fällt: $y = Ce^{\\kappa x} + De^{-\\kappa x} = A\\sinh\\kappa x + B\\cosh\\kappa x$.',
      'Superposition gilt nur, weil die Gleichung linear und homogen ist: Mit $y_1$ und $y_2$ ist jede Kombination $C_1y_1 + C_2y_2$ wieder Lösung.',
      'Normierbarkeit ist eine Randbedingung im Unendlichen: Für $x\\to\\infty$ muss der Anteil $e^{+\\kappa x}$ wegfallen.',
      'An einer Sprungstelle eines endlichen Potentials müssen $\\psi$ und $\\psi\'$ stetig sein (Thema 5). Diese Anschlussbedingungen verbinden die Lösungen der einzelnen Bereiche.',
      'Produktlösungen $\\varphi(x)e^{-iEt/\\hbar}$ sind stationär; die allgemeine Lösung ist eine Summe solcher Produkte.'
    ],
    errors:[
      'Aus $A\\sin(kL) = 0$ auf $A = 0$ schließen. Das ist die triviale Lösung $y\\equiv 0$; gesucht sind die $k$ mit $\\sin(kL) = 0$.',
      'Vorzeichen in der charakteristischen Gleichung: $y\'\' = \\kappa^2y$ gibt $\\lambda^2 - \\kappa^2 = 0$, nicht $\\lambda^2 + \\kappa^2 = 0$.',
      'Bei komplexen Wurzeln $\\alpha\\pm i\\beta$ den Faktor $e^{\\alpha x}$ vergessen.',
      'Beim Ableiten die Kettenregel vergessen: $\\frac{d}{dx}\\sin kx = k\\cos kx$.',
      'Annehmen, jede Lösung der zeitabhängigen Gleichung sei ein Produkt $\\varphi(x)f(t)$.'
    ],
    more:[
      {title:'Woher kommt $xe^{\\lambda_0x}$ bei der doppelten Wurzel?', text:'Für $y = xe^{\\lambda_0x}$ ist $y\'\' + ay\' + by = (\\lambda_0^2 + a\\lambda_0 + b)\\,xe^{\\lambda_0x} + (2\\lambda_0 + a)\\,e^{\\lambda_0x}$. Die erste Klammer ist null, weil $\\lambda_0$ Wurzel ist; die zweite, weil die doppelte Wurzel $\\lambda_0 = -a/2$ ist.'},
      {title:'Warum heißt es Eigenwertproblem?', text:'$-\\frac{d^2}{dx^2}y = k^2y$ hat die Form $\\hat Dy = \\mu y$ mit dem Operator $\\hat D = -d^2/dx^2$ (M4, M5). Die Randbedingungen legen den Funktionenraum fest, in dem $\\hat D$ wirkt. Erst in diesem Raum gibt es die diskreten Eigenwerte $\\mu_n = (n\\pi/L)^2$.'}
    ],
    checks:[
      {q:'Welche allgemeine Lösung hat $y\'\' - 9y = 0$?', opts:['$Ce^{3x} + De^{-3x}$', '$A\\sin 3x + B\\cos 3x$', '$Ce^{9x} + De^{-9x}$'], a:0, ex:'$\\lambda^2 - 9 = 0$ gibt $\\lambda = \\pm 3$: reelle Exponentialfunktionen, keine Schwingung.'},
      {q:'Welche Aussage über $y\'\' = -k^2y$, $y(0) = 0$, $y\'(0) = 1$ stimmt?', opts:['Für jedes $k > 0$ gibt es genau eine Lösung.', 'Nur für $k = n\\pi$ gibt es eine Lösung.', 'Es gibt jeweils unendlich viele Lösungen.'], a:0, ex:'Das ist ein Anfangswertproblem; die Lösung ist $y = \\sin(kx)/k$. Erst Randbedingungen an zwei Stellen wählen einzelne $k$ aus.'}
    ]
  },
  lab:{type:'ode', title:'Anfangswertproblem und Randbedingung',
    map:[
      {sym:R`y'' = \mp k^2y`, ctl:'Gleichung', says:R`Wählt die Gleichung: $y'' = -k^2y$ (Krümmung zur Achse hin, Schwingung) oder $y'' = +k^2y$ (Krümmung von der Achse weg, Wachstum). Beide Male gelten die Anfangswerte $y(0) = 0$ und $y'(0) = 1$.`},
      {sym:'k', ctl:'k', says:R`Die Konstante in der Gleichung. Bei der Schwingung ist $\pi/k$ der Abstand der Nullstellen: Größeres $k$ heißt stärkere Krümmung und mehr Nullstellen in $[0, 1]$.`},
      {sym:R`y(x) = \sin(kx)/k`, ctl:"y'' = −k²y", says:R`Die blaue Kurve ist die Lösung des Anfangswertproblems, für jedes $k$ genau eine. Bei $y'' = +k^2y$ ist sie $\sinh(kx)/k$.`},
      {sym:R`y(1) = 0`, ctl:'Randbedingung y(1) = 0', says:R`Die Anzeige meldet, ob die Lösung zusätzlich die Randbedingung bei $x = 1$ erfüllt. „Erfüllt“ heißt $\sin k = 0$; dann wird der Punkt bei $x = 1$ grün und liegt auf der Achse.`},
      {sym:R`k_n = n\pi`, ctl:'Eigenwerte', says:R`Die Anzeige nennt die Eigenwerte des Randwertproblems $y(0) = y(1) = 0$: $k = \pi, 2\pi, 3\pi \approx 3{,}14;\ 6{,}28;\ 9{,}42$. Zu $k_n$ gehören $n - 1$ Nullstellen im Inneren.`},
      {sym:R`y = \sinh(kx)/k`, ctl:'Hier ist y(1) > 0 für jedes k', says:R`Bei $y'' = +k^2y$ biegt sich die Kurve von der Achse weg und hat für $x > 0$ keine Nullstelle. Das Randwertproblem hat dann nur die triviale Lösung $y \equiv 0$.`}
    ],
    sketch:{id:'md-lab-s', kind:'curve', draw:'f', title:'Vorhersage: Anfangswertproblem bei $k = 3\\pi$',
      text:'Gleich löst das Labor $y\'\' = -k^2y$ mit $y(0) = 0$ und $y\'(0) = 1$ auf $[0, 1]$. Skizziere vorher die Lösung für $k = 3\\pi \\approx 9{,}42$. Die Skala der $y$-Achse ist frei. Stell danach die Gleichung $y\'\' = -k^2y$ und $k = 9{,}42$ ein und vergleiche; achte auch auf die Meldung zur Randbedingung $y(1) = 0$.',
      plot:{x:[0, 1], xlab:'x', ylab:'y(x)', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}]},
      // y = sin(kx)/k mit k = 3π: Nullstellen bei 0, 1/3, 2/3, 1; drei Buckel; symmetrisch zu x = 1/2
      f:x => Math.sin(3 * Math.PI * x) / (3 * Math.PI),
      checks:[
        {id:'rand', type:'zero', at:[0, 1], msg:'Welchen Wert hat die Lösung bei $x = 0$, und welchen hat $\\sin k$ für $k = 3\\pi$?'},
        {id:'knoten', type:'nodes', n:2, msg:'Wie viele halbe Wellen der Länge $\\pi/k$ passen in das Intervall $[0, 1]$? Wie viele Nullstellen liegen dann im Inneren? Deine Skizze hat {got}.'},
        {id:'buckel', type:'extrema', n:3, msg:'Wie viele Buckel hat $\\sin(3\\pi x)$ zwischen $0$ und $1$? Deine Skizze hat {got}.'},
        {id:'sym', type:'parity', p:'even', about:0.5, msg:'Ist $\\sin(3\\pi x)$ zur Mitte $x = 1/2$ symmetrisch oder antisymmetrisch?'}
      ],
      reveal:'$y = \\sin(kx)/k$ mit $k = 3\\pi$: drei halbe Wellen, Nullstellen bei $x = 1/3$ und $2/3$ im Inneren und genau bei $x = 1$. Die Anfangswerte allein legen die Lösung für jedes $k$ fest; nur für $k = n\\pi$ erfüllt sie zusätzlich die Randbedingung $y(1) = 0$. Darum meldet das Labor bei $k \\approx 9{,}42$ „erfüllt“, bei $k = 9$ oder $k = 10$ nicht.',
      hints:['Schreib die Lösung des Anfangswertproblems hin (Abschnitt „Anfangswerte, Randwerte“) und setze $k = 3\\pi$ ein.', '$\\sin(3\\pi x)$ ist null bei $x = 0, \\tfrac13, \\tfrac23, 1$.'],
      wrong:[
        {f:x => Math.sin(2 * Math.PI * x), fails:['knoten', 'buckel', 'sym'], why:'eine halbe Welle zu wenig (k = 2π)'},
        {f:x => Math.cos(3 * Math.PI * x), fails:['rand'], why:'y(0) = 1 statt y′(0) = 1 eingesetzt'},
        {f:x => Math.sinh(3 * Math.PI * x), fails:['rand', 'knoten'], why:'Vorzeichen in der Gleichung verwechselt: Wachstum statt Schwingung'}
      ]},
    text:'Das Labor löst $y\'\' = -k^2y$ oder $y\'\' = +k^2y$ mit den Anfangswerten $y(0) = 0$, $y\'(0) = 1$ auf $[0, 1]$. Für jedes $k$ gibt es genau eine Lösung. Die Anzeige zeigt $y(1)$ und meldet, wenn zusätzlich die Randbedingung $y(1) = 0$ erfüllt ist.',
    predict:{q:'Bevor du das Labor bedienst: $y\'\' = -k^2y$ mit $y(0) = 0$, $y\'(0) = 1$ und $k = 10$. Wie viele Nullstellen hat $y$ im Inneren von $(0, 1)$?', opts:['3', '10', '1', 'keine'], a:0, ex:'$y = \\sin(10x)/10$ ist null bei $x = n\\pi/10$, also bei etwa $0{,}31$, $0{,}63$ und $0{,}94$. Je größer $k$, desto mehr Nullstellen – im Kasten entsprechen dem mehr Knoten bei höherer Energie.'},
    questions:[
      {q:'Gleichung $y\'\' = -k^2y$: Bei welchem kleinsten $k > 0$ wird $y(1) = 0$?', opts:['$k \\approx 3{,}14$', '$k \\approx 1{,}57$', '$k \\approx 6{,}28$'], a:0, ex:'$y = \\sin(kx)/k$, also $y(1) = \\sin(k)/k = 0$ für $k = \\pi$. Die nächsten Werte sind $2\\pi \\approx 6{,}28$ und $3\\pi \\approx 9{,}42$.'},
      {q:'Stelle $y\'\' = +k^2y$ ein. Für welche $k > 0$ wird $y(1) = 0$?', opts:['für kein $k$', 'für $k = \\pi$', 'für jedes $k$'], a:0, ex:'Die Lösung ist $y = \\sinh(kx)/k$. Sie ist für $x > 0$ positiv und hat keine Nullstelle – ohne Schwingung hat das Randwertproblem $y(0) = y(1) = 0$ nur die triviale Lösung $y = 0$.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele Werte $k$ zwischen $0$ und $12$ erfüllen bei $y\'\' = -k^2y$, $y(0) = 0$ auch $y(1) = 0$?', opts:['3', '4', '12'], a:0, ex:'$k = \\pi, 2\\pi, 3\\pi$ (etwa 3,14, 6,28 und 9,42). $4\\pi \\approx 12{,}57$ liegt schon außerhalb.'}},
  compare:{
    text:'Randwertproblem: $y\'\' = -k^2y$ auf $[0, L]$ mit $y(0) = y(L) = 0$. Gesucht sind die erlaubten $k > 0$. Zwei richtige Wege:',
    ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos', n:{int:[1, 4]}}, unknowns:{A:{ref:'1', kind:'real'}, B:{ref:'0', kind:'real'}, C:{ref:'1/(2i)', kind:'complex'}, D:{ref:'-1/(2i)', kind:'complex'}, k:{ref:'nπ/L'}}}),
    A:{name:'Reelle Form', model:['y(x) = A sin(kx) + B cos(kx)', 'y(0) = B = 0', 'y(L) = A sin(kL) = 0', {l:'k = nπ/L', w:'A ≠ 0, also sin(kL) = 0'}]},
    B:{name:'Komplexe Form', text:'Ansatz mit $e^{\\pm ikx}$:', model:['y(x) = C e^(ikx) + D e^(-ikx)', 'y(0) = C + D = 0', 'D = -C', 'y(L) = C (e^(ikL) - e^(-ikL))', '= 2i C sin(kL) = 0', 'k = nπ/L']},
    questions:[
      {q:'Welche Funktion entsteht in Weg B mit $D = -C$?', opts:['$y = 2iC\\sin kx$, also Weg A mit $A = 2iC$', 'eine andere Funktion als in Weg A', '$y = 2C\\cos kx$, also Weg A mit $B = 2C$'], a:0, ex:'$C(e^{ikx} - e^{-ikx}) = 2iC\\sin kx$. Beide Wege beschreiben dieselben Lösungen, nur mit anders benannten Konstanten.'},
      {q:'Wann ist die komplexe Form $e^{\\pm ikx}$ bequemer?', opts:['bei laufenden Wellen (Thema 4, Thema 5)', 'bei stehenden Wellen mit Knoten im Kasten', 'nie, die reelle Form ist immer einfacher'], a:0, ex:'$e^{ikx}$ hat den Impuls $+\\hbar k$, $e^{-ikx}$ den Impuls $-\\hbar k$. Für stehende Wellen mit Knoten an den Wänden ist $\\sin$/$\\cos$ bequemer.'}
    ]
  },
  practice:[
    {id:'md-p1', title:'Komplexe Wurzeln: gedämpfte Schwingung',
      text:'Löse $y\'\' + 2y\' + 5y = 0$ mit $y(0) = 1$ und $y\'(0) = 1$.',
      ctx:DGL({unknowns:{λ:{ref:'-1 + 2i', alt:['-1 - 2i'], kind:'complex'}, A:{ref:'1', kind:'real'}, B:{ref:'1', kind:'real'}, C:{ref:'(1 - i)/2', kind:'complex'}, D:{ref:'(1 + i)/2', kind:'complex'}}}),
      goals:[
        {id:'a', prompt:'a) Stelle die charakteristische Gleichung auf und bestimme beide Wurzeln $\\lambda$.', type:'solve', unknown:'λ', both:true, points:2, ph:'λ^2 + 2λ + 5 = 0',
          hints:['Gesucht sind die Exponenten $\\lambda$ des Ansatzes $y = e^{\\lambda x}$.', 'Exponentialansatz: $y\'\'\\to\\lambda^2$, $y\'\\to\\lambda$, $y\\to 1$; dann die Lösungsformel für quadratische Gleichungen.', '$\\lambda = \\frac{-2\\pm\\sqrt{4 - 20}}{2}$ mit $\\sqrt{-16} = 4i$. Schreib am Ende $\\lambda = \\dots \\pm \\dots$'],
          model:['λ^2 + 2λ + 5 = 0', 'λ = (-2 ± sqrt(4 - 20))/2', 'λ = -1 ± 2i']},
        {id:'b', prompt:'b) Bestimme die reelle Lösung $y(x)$ des Anfangswertproblems.', type:'value', target:'e^(-x) (cos(2x) + sin(2x))', points:3, ph:'y(x) = e^(-x) (A cos(2x) + B sin(2x))',
          hints:['Schreib die reelle allgemeine Lösung zu $\\lambda = \\alpha\\pm i\\beta$ auf und setze dann die Anfangswerte ein.', 'Mit $\\lambda = \\alpha\\pm i\\beta$ ist $y = e^{\\alpha x}(A\\cos\\beta x + B\\sin\\beta x)$.', '$y\'(x) = e^{-x}[(-A + 2B)\\cos 2x - (2A + B)\\sin 2x]$, also $y\'(0) = -A + 2B$.'],
          model:['y(x) = e^(-x) (A cos(2x) + B sin(2x))', 'y(0) = A = 1', "y'(0) = -A + 2B = 1", 'B = 1', 'y(x) = e^(-x) (cos(2x) + sin(2x))'],
          mistakes:[{expr:'e^(-x) (cos(2x) + 1/2 sin(2x))', msg:'Beim Ableiten liefert auch $e^{-x}$ einen Beitrag: $y\'(0) = -A + 2B$, nicht nur $2B$.'}, {expr:'e^(-x) cos(2x)', msg:'Vorzeichen prüfen: $\\frac{d}{dx}e^{-x} = -e^{-x}$, also $y\'(0) = -A + 2B$.'}],
          note:'Auch der komplexe Weg geht: $y = Ce^{(-1+2i)x} + De^{(-1-2i)x}$ mit $C = (1-i)/2$, $D = (1+i)/2 = C^*$. Weil $D = C^*$ ist, kommt eine reelle Funktion heraus.'}
      ]},
    {id:'md-p2', title:'Anschlussbedingungen an einer Stufe',
      text:'Links ($x < 0$) gilt $y\'\' = -k^2y$, rechts ($x > 0$) gilt $y\'\' = \\kappa^2y$, mit $k, \\kappa > 0$. Rechts soll $y$ beschränkt bleiben. Ansatz: $y_1(x) = \\cos(kx) + B\\sin(kx)$ links, $y_2(x) = C\\,e^{-\\kappa x}$ rechts. Bei $x = 0$ müssen $y$ und $y\'$ stetig sein.',
      ctx:DGL({params:{k:'pos', κ:'pos'}, unknowns:{B:{ref:'-κ/k', kind:'real'}, C:{ref:'1'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $C$ aus der Stetigkeit von $y$.', type:'solve', unknown:'C', points:1, ph:'y_1(0) = y_2(0)',
          hints:['Stetigkeit heißt: Beide Teillösungen haben bei $x = 0$ denselben Wert.', 'Führe zuerst $y_1(x) = \\dots$ und $y_2(x) = \\dots$ ein.', '$y_1(0) = 1$ und $y_2(0) = C$.'],
          model:['y_1(x) = cos(kx) + B sin(kx)', 'y_2(x) = C e^(-κx)', {l:'y_1(0) = y_2(0)', w:'y stetig bei x = 0'}, '1 = C']},
        {id:'b', prompt:'b) Bestimme $B$ aus der Stetigkeit von $y\'$.', type:'solve', unknown:'B', points:2, ph:"y_1'(0) = y_2'(0)",
          hints:['Jetzt müssen die Steigungen bei $x = 0$ übereinstimmen.', '$y_1\'(0) = kB$ und $y_2\'(0) = -\\kappa C$.', 'Setze $C = 1$ aus Teil a) ein.'],
          model:['y_1(x) = cos(kx) + B sin(kx)', 'y_2(x) = C e^(-κx)', {l:"y_1'(0) = y_2'(0)", w:"y' stetig bei x = 0"}, 'k B = -κ C', 'B = -κ/k'],
          mistakes:[{expr:'κ/k', msg:'Vorzeichen: $\\frac{d}{dx}e^{-\\kappa x} = -\\kappa e^{-\\kappa x}$, also $y_2\'(0) = -\\kappa C$.'}],
          note:'So entsteht in Thema 5 die Eindringtiefe: Rechts fällt $y$ wie $e^{-\\kappa x}$ ab, die Länge $1/\\kappa$ ist umso kleiner, je größer $\\kappa$.'}
      ]},
    {id:'md-p3', title:'Gemischte Randbedingungen',
      text:'$y\'\' = -k^2y$ auf $[0, L]$ mit $y(0) = 0$ und $y\'(L) = 0$ (waagrechte Tangente am rechten Rand). Gesucht sind die erlaubten $k > 0$; $n = 1, 2, 3, \\dots$ nummeriert sie.',
      ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos', m:'pos', n:{int:[1, 4]}}, unknowns:{A:{ref:'1', kind:'real'}, B:{ref:'0', kind:'real'}, k:{ref:'(2n - 1)π/(2L)'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme alle erlaubten $k$ (als Ausdruck in $n$).', type:'solve', unknown:'k', points:3, ph:'y(x) = A sin(kx) + B cos(kx)',
          hints:['Allgemeine Lösung aufschreiben, dann eine Randbedingung nach der anderen einsetzen.', 'Aus $y(0) = 0$ folgt $B = 0$.', '$y\'(L) = Ak\\cos(kL) = 0$ mit $A \\ne 0$: $\\cos(kL) = 0$, also $kL = \\pi/2, 3\\pi/2, 5\\pi/2, \\dots$'],
          model:['y(x) = A sin(kx) + B cos(kx)', 'y(0) = B = 0', "y'(L) = A k cos(kL) = 0", 'k L = (n - 1/2) π', 'k = (2n - 1)π/(2L)'],
          mistakes:[{expr:'nπ/L', msg:'Das wäre die Bedingung $y(L) = 0$. Hier verschwindet die Ableitung: $\\cos(kL) = 0$.'}, {expr:'(2n + 1)π/(2L)', msg:'So zählt man ab $n = 0$. Hier beginnt $n$ bei 1: Das kleinste $k$ ist $\\pi/(2L)$.'}]},
        {id:'b', prompt:'b) Zu $k$ gehört die Energie $E = \\hbar^2k^2/(2m)$. Gib $E$ für das $n$-te $k$ an.', type:'value', target:'(2n - 1)^2 π^2 ħ^2/(8m L^2)', points:2, ph:'E = ħ^2 k^2/(2m)',
          hints:['Setze das Ergebnis aus a) in die Energieformel ein.', '$k^2 = (2n-1)^2\\pi^2/(4L^2)$; dann mit $\\hbar^2/(2m)$ multiplizieren.'],
          model:['E = ħ^2 k^2/(2m)', '= ħ^2/(2m) · (2n - 1)^2 π^2/(4L^2)', '= (2n - 1)^2 π^2 ħ^2/(8m L^2)'],
          note:'Für $n = 1$ ist $E = \\frac{\\pi^2\\hbar^2}{8mL^2}$: Die Lösung $\\sin(\\pi x/(2L))$ ist die halbe Grundschwingung eines Kastens der Breite $2L$.'}
      ]},
    {id:'md-p4', title:'Separationsansatz: die Zeitgleichung',
      text:'Setzt man $\\Psi(x,t) = \\varphi(x)f(t)$ in $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi$ ein und teilt durch $\\varphi f$, hängt die linke Seite nur von $t$ ab, die rechte nur von $x$. Beide sind also gleich einer Konstanten $E$. Für die Zeit bleibt $i\\hbar f\'(t) = Ef(t)$.',
      ctx:{coords:['t'], params:{E:'pos'}, unknowns:{λ:{ref:'-i E/ħ', kind:'complex'}, τ:{ref:'πħ/E'}}},
      goals:[
        {id:'a', prompt:'a) Löse $i\\hbar f\'(t) = Ef(t)$ mit $f(0) = 1$.', type:'value', target:'e^(-i E t/ħ)', points:2, ph:'f(t) = e^(λt)',
          hints:['Eine DGL 1. Ordnung mit konstantem Koeffizienten: Exponentialansatz.', 'Der Ansatz $f(t) = e^{\\lambda t}$ erfüllt schon $f(0) = 1$; einsetzen gibt $i\\hbar\\lambda = E$.', '$\\lambda = E/(i\\hbar) = -iE/\\hbar$, denn $1/i = -i$.'],
          model:['f(t) = e^(λt)', "iħ f'(t) = E f(t)", 'iħ λ = E', 'λ = -i E/ħ', 'f(t) = e^(-i E t/ħ)'],
          mistakes:[{expr:'e^(i E t/ħ)', msg:'Vorzeichen: $1/i = -i$, also $\\lambda = -iE/\\hbar$.'}, {expr:'e^(-E t/ħ)', msg:'Es fehlt das $i$: Die Lösung dreht nur ihre Phase, ihr Betrag bleibt 1.'}]},
        {id:'b', prompt:'b) Nach welcher Zeit $\\tau > 0$ ist $f(\\tau) = -1$ zum ersten Mal?', type:'solve', unknown:'τ', points:2, ph:'e^(-i E τ/ħ) = -1',
          hints:['Wann ist eine Phase $e^{-i\\varphi}$ gleich $-1$?', '$e^{-i\\pi} = -1$, und für $0 < \\varphi < \\pi$ ist $e^{-i\\varphi} \\ne -1$.', 'Setze $E\\tau/\\hbar = \\pi$ und löse nach $\\tau$ auf.'],
          model:['e^(-i E τ/ħ) = -1', {l:'E τ/ħ = π', w:'e^{-iπ} = −1'}, 'τ = πħ/E'],
          note:'Der Faktor $-1$ ist eine globale Phase: $|\\Psi|^2$ ändert sich nicht. Messbar werden solche Phasen erst in Überlagerungen verschiedener Energien (Thema 2 und 3).'}
      ]},
    {id:'md-p5', title:'Doppelte Wurzel',
      text:'Löse $y\'\' - 2y\' + y = 0$ mit $y(0) = 1$ und $y\'(0) = 0$.',
      ctx:DGL({unknowns:{λ:{ref:'1', kind:'real'}, A:{ref:'1', kind:'real'}, B:{ref:'-1', kind:'real'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme die Wurzel $\\lambda$ der charakteristischen Gleichung.', type:'solve', unknown:'λ', points:1, ph:'λ^2 - 2λ + 1 = 0',
          hints:['Exponentialansatz, dann die quadratische Gleichung lösen.', '$\\lambda^2 - 2\\lambda + 1$ ist ein Binom: $(\\lambda - 1)^2$.'],
          model:['λ^2 - 2λ + 1 = 0', '(λ - 1)^2 = 0', 'λ = 1']},
        {id:'b', prompt:'b) Bestimme $y(x)$.', type:'value', target:'(1 - x) e^x', points:3, ph:'y(x) = (A + B x) e^x',
          hints:['Bei einer doppelten Wurzel brauchst du neben $e^{\\lambda_0x}$ eine zweite Lösung.', 'Bei der doppelten Wurzel $\\lambda_0$ ist $y = (A + Bx)e^{\\lambda_0x}$.', '$y\'(x) = (A + B + Bx)e^x$, also $y\'(0) = A + B$.'],
          model:['y(x) = (A + B x) e^x', 'y(0) = A = 1', "y'(0) = A + B = 0", 'B = -1', 'y(x) = (1 - x) e^x'],
          mistakes:[{expr:'e^x', msg:'Mit $e^x$ allein ist $y\'(0) = 1 \\ne 0$. Bei der doppelten Wurzel gehört $xe^x$ dazu.'}]}
      ]}
  ],
  concept:[
    {id:'md-c1', type:'dialog', seg:'md-t1', lex:'dgl-superposition', text:'Im Kasten lösen $\\psi_1$ und $\\psi_2$ die zeitunabhängige Gleichung $\\hat H\\psi = E\\psi$ zu $E_1$ bzw. $E_2 = 4E_1$. Betrachtet wird $\\phi = (\\psi_1 + \\psi_2)/\\sqrt2$.',
      people:[{name:'Lena', says:'Die Gleichung ist linear, also löst $\\phi$ auch $\\hat H\\phi = E\\phi$, und zwar mit $E = 2{,}5\\,E_1$.'}, {name:'Jonas', says:'$\\phi$ ist ein erlaubter Zustand, aber keine Lösung von $\\hat H\\phi = E\\phi$: $\\hat H\\phi = (E_1\\psi_1 + E_2\\psi_2)/\\sqrt2$ ist kein Vielfaches von $\\phi$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Superposition gilt innerhalb **einer** linearen Gleichung. $\\hat H\\psi = E_1\\psi$ und $\\hat H\\psi = E_2\\psi$ sind zwei verschiedene Gleichungen. $\\phi$ löst die zeitabhängige Schrödingergleichung (mit den Phasenfaktoren), ist aber nicht stationär.'},
    {id:'md-c2', type:'mc2', seg:'md-t4', lex:'randwertproblem', q:'Woher kommen im unendlichen Kasten die diskreten Energien?', opts:['aus den Randbedingungen $\\psi(0) = \\psi(L) = 0$', 'aus der Normierung $\\int_0^L|\\psi|^2dx = 1$', 'aus der Linearität der Schrödingergleichung'], a:0,
      ex:'Nach $\\psi(0) = 0$ bleibt $A\\sin kx$ für jedes $k$ übrig. Erst $\\psi(L) = 0$ erzwingt $\\sin kL = 0$. Die Normierung legt danach nur $|A|$ fest.',
      reason:{q:'Warum?', opts:['$\\psi\'\' = -k^2\\psi$ hat für jedes $k$ Lösungen; erst $\\psi(L) = 0$ wählt $k_n$ aus.', 'Die Normierung lässt nur ganzzahlige Vorfaktoren $A$ zu.', 'Lineare Gleichungen haben immer nur diskrete Lösungen.'], a:0, ex:'Ohne zweite Randbedingung (freies Teilchen) ist jedes $k$ erlaubt – das Spektrum ist kontinuierlich.'}},
    {id:'md-c3', type:'dialog', seg:'md-t5', lex:'separation', text:'Für die Schrödingergleichung im Kasten hat man mit dem Separationsansatz die Lösungen $\\psi_n(x)\\,e^{-iE_nt/\\hbar}$ gefunden.',
      people:[{name:'Lena', says:'Andere Lösungen gibt es nicht. Der Ansatz hat ja alle gefunden.'}, {name:'Jonas', says:'Jede Überlagerung $\\sum_nc_n\\psi_ne^{-iE_nt/\\hbar}$ ist auch eine Lösung, und die meisten davon sind keine Produkte.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Der Ansatz findet nur die Produktlösungen. Weil die Gleichung linear ist, sind auch ihre Überlagerungen Lösungen; mit ihnen lässt sich jeder Anfangszustand darstellen.'},
    {id:'md-c4', type:'mc', seg:'md-t3', lex:'eindringtiefe', q:'Ein Bereich endlicher Breite hat $V_0 > E$. Was gilt dort für $\\psi$?', opts:['eine Kombination aus $e^{\\kappa x}$ und $e^{-\\kappa x}$, nicht null', 'überall null, das Teilchen darf dort nicht sein', 'eine Schwingung mit kleinerer Wellenlänge'], a:0,
      ex:'$\\psi\'\' = \\kappa^2\\psi$ mit $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$. $\\psi$ klingt ab, ist aber nicht null – deshalb kann ein Teilchen eine dünne Barriere durchtunneln (Thema 5).'},
    {id:'md-c5', type:'mc2', seg:'md-t2', lex:'charakteristische-gleichung', q:'Welche Lösungen hat $y\'\' = 4y$?', opts:['$e^{2x}$ und $e^{-2x}$', '$\\sin 2x$ und $\\cos 2x$', '$e^{2ix}$ und $e^{-2ix}$'], a:0,
      ex:'Reelle Exponentialfunktionen: Die Lösung wächst oder fällt, sie schwingt nicht.',
      reason:{q:'Warum?', opts:['Umgestellt $y\'\' - 4y = 0$, also $\\lambda^2 = 4$ und $\\lambda = \\pm 2$.', 'Aus $\\lambda^2 + 4 = 0$ folgt $\\lambda = \\pm 2i$.', 'Jede Gleichung mit $y\'\'$ hat Schwingungslösungen.'], a:0, ex:'Erst alles auf eine Seite bringen: $\\lambda^2 - 4 = 0$. Das Vorzeichen entscheidet zwischen Schwingen und Wachsen.'}}
  ],
  sketch:[
    {id:'md-s1', kind:'curve', draw:'f', title:'Exponentialansatz mit Anfangswerten',
      text:'Bestimme mit dem Exponentialansatz die Form der Lösung von $y\'\' + 0{,}4\\,y\' + 9{,}04\\,y = 0$ mit $y(0) = 0$ und $y\'(0) = 3$ und skizziere sie für $0 \\le x \\le 10$. Die Skala der $y$-Achse ist frei.',
      plot:{x:[0, 10], xlab:'x', ylab:'y(x)', ticks:[{x:0, lab:'0'}, {x:2, lab:'2'}, {x:4, lab:'4'}, {x:6, lab:'6'}, {x:8, lab:'8'}, {x:10, lab:'10'}]},
      // λ² + 0,4λ + 9,04 = 0 → λ = −0,2 ± 3i; y = e^{−0,2x}(A cos 3x + B sin 3x), y(0) = 0 → A = 0, y'(0) = 3B = 3 → B = 1
      // 'start': max|y| in [0; 0,1] ≤ 0,8·(Höhe des ersten Buckels in [0; 1,5]). Muster: 0,29/0,90. Unempfindlich dagegen, wo genau die Hand das erste Maximum (bei 0,49) setzt; y(0) = 1 (cos) gibt 1,0/0,81.
      f:x => Math.exp(-0.2 * x) * Math.sin(3 * x),
      checks:[
        {id:'start', type:'amp', a:[0, 0.1], b:[0, 1.5], cmp:'<', name:'Anfangswert', msg:'Welchen Wert hat $y$ bei $x = 0$? Startet die Kurve beim Maximum oder bei null?'},
        {id:'osc', type:'osc', min:5, msg:'Welche Wurzeln hat die charakteristische Gleichung, reelle oder komplexe? Was bedeutet ein Imaginärteil der Wurzeln für die Lösung? (Abschnitt „Der Exponentialansatz“)'},
        {id:'amp', type:'amp', a:[0, 3], b:[6, 9], cmp:'>', msg:'Was macht der Realteil $\\alpha$ der Wurzeln mit der Hüllkurve $e^{\\alpha x}$? Welches Vorzeichen hat $\\alpha$ hier?'},
        {id:'lam', type:'wavelength', a:[0, 4.5], b:[4.5, 9], cmp:'=', msg:'Ändert sich der Abstand der Nullstellen mit der Zeit, oder bleibt die Periode $2\\pi/\\beta$ gleich?'}
      ],
      reveal:'$\\lambda^2 + 0{,}4\\lambda + 9{,}04 = 0$ hat die Wurzeln $\\lambda = -0{,}2 \\pm 3i$. Die Lösung ist $y = e^{-0{,}2x}\\sin 3x$: Sie startet bei null, schwingt mit der festen Periode $2\\pi/3 \\approx 2{,}1$, und ihre Amplitude nimmt mit der Hüllkurve $e^{-0{,}2x}$ ab, bis $x = 10$ auf $e^{-2} \\approx 14\\,\\%$. Komplexe Wurzeln heißen also nicht „keine reelle Lösung“, sondern „Schwingung“.',
      hints:['Stelle die charakteristische Gleichung auf und bestimme Real- und Imaginärteil der Wurzeln. Setze dann die Anfangswerte ein.', 'Bei $\\lambda = \\alpha \\pm i\\beta$ ist $y = e^{\\alpha x}(A\\cos\\beta x + B\\sin\\beta x)$: Schwingung mit der Hüllkurve $e^{\\alpha x}$.'],
      wrong:[
        {f:x => Math.sin(3 * x), fails:['amp'], why:'Dämpfungsterm vergessen'},
        {f:x => Math.exp(0.2 * x) * Math.sin(3 * x), fails:['amp'], why:'Vorzeichen des Realteils falsch: anwachsende Schwingung'},
        {f:x => Math.exp(-0.2 * x) * Math.cos(3 * x), fails:['start'], why:'Anfangswerte vertauscht: y(0) = 1 angenommen'},
        {f:x => x * Math.exp(-x), fails:['osc'], why:'komplexe Wurzeln für „keine Schwingung“ gehalten: kriechende Lösung'}
      ]},
    {id:'md-s2', kind:'curve', draw:'f', title:'Zwei Gleichungen, ein Anschluss bei $x = 0$',
      text:'Links ($x < 0$) gilt $y\'\' = -k^2y$, rechts ($x > 0$) gilt $y\'\' = \\kappa^2y$, mit $k = \\kappa = 1$. Rechts soll $y$ beschränkt bleiben. Bei $x = 0$ sind $y$ und $y\'$ stetig, und $y(0) = 1$. Skizziere $y$ für $-7 \\le x \\le 3$. Die Skala der $y$-Achse ist frei.',
      plot:{x:[-7, 3], xlab:'x', ylab:'y(x)', ticks:[{x:-6, lab:'-6'}, {x:-4, lab:'-4'}, {x:-2, lab:'-2'}, {x:0, lab:'0'}, {x:2, lab:'2'}], regions:[{x:[0, 3], lab:"$y'' = +\\kappa^2y$"}]},
      // rechts y = e^{−κx} (beschränkt), links y = cos kx + B sin kx mit y'(0): kB = −κ → y = cos x − sin x = √2 cos(x + π/4); Nullstellen −3π/4, −7π/4
      f:x => x <= 0 ? Math.cos(x) - Math.sin(x) : Math.exp(-x),
      checks:[
        {id:'links', type:'osc', range:[-7, 0], min:2, msg:'Welche Lösungen hat $y\'\' = -k^2y$? Was macht die Kurve links von $x = 0$?'},
        {id:'rechts', type:'decay', toward:'right', range:[0, 3], msg:'Welche der beiden Lösungen $e^{\\pm\\kappa x}$ bleibt für große $x$ beschränkt? (Abschnitt „Schwingen oder Abklingen“)'},
        {id:'ruhig', type:'noosc', range:[0, 3], msg:'Hat $y\'\' = +\\kappa^2y$ Lösungen mit Nullstellen? Bring die Gleichung auf eine Seite und lies die charakteristische Gleichung ab.'},
        {id:'glatt', type:'smooth', at:[0], msg:'Was verlangen die Anschlussbedingungen von der Steigung $y\'$ bei $x = 0$?'},
        {id:'stetig', type:'cont', msg:'Darf $y$ bei $x = 0$ springen?'}
      ],
      reveal:'Rechts bleibt nur $y = e^{-x}$ beschränkt; es startet mit $y(0) = 1$ und $y\'(0) = -1$. Links ist $y = \\cos x + B\\sin x$, und die Stetigkeit von $y\'$ verlangt $B = -1$. Also $y = \\cos x - \\sin x = \\sqrt2\\cos(x + \\pi/4)$: eine Schwingung mit Amplitude $\\sqrt2$ und Nullstellen bei $-3\\pi/4$ und $-7\\pi/4$, die bei $x = 0$ ohne Knick in das Abklingen übergeht. So sieht eine Wellenfunktion an einer endlichen Potentialstufe aus (Thema 5).',
      hints:['Löse zuerst rechts: Welche Konstante muss wegen der Beschränktheit null sein? Bestimme dann links die Konstanten aus $y(0)$ und $y\'(0)$.', 'Bei $y\'\' = -k^2y$ krümmt sich die Kurve zur Achse hin, bei $y\'\' = +\\kappa^2y$ von ihr weg.'],
      wrong:[
        {f:x => x <= 0 ? Math.cos(x) - Math.sin(x) : Math.exp(-4 * x), fails:['glatt'], why:'Knick: Steigung bei x = 0 nicht angeglichen'},
        {f:x => x <= 0 ? Math.cos(x) - Math.sin(x) : Math.cos(1.6 * x) * Math.exp(-0.2 * x) - 0.62 * Math.sin(1.6 * x) * Math.exp(-0.2 * x), fails:['rechts', 'ruhig'], why:'Vorzeichenfehler λ² + κ² = 0: Schwingung auch rechts'},
        {f:x => x <= 0 ? -Math.sin(x) : 0, fails:['rechts'], why:'wie an einer unendlich hohen Wand: y = 0 rechts'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'md-f1', title:'Anfangswertproblem', text:'Löse $y\'\' + 9y = 0$ mit $y(0) = 2$ und $y\'(0) = 3$.',
      ctx:DGL({unknowns:{λ:{ref:'3i', alt:['-3i'], kind:'complex'}, A:{ref:'2', kind:'real'}, B:{ref:'1', kind:'real'}, C:{ref:'(2 - i)/2', kind:'complex'}, D:{ref:'(2 + i)/2', kind:'complex'}}}),
      goals:[{id:'a', prompt:'Bestimme $y(x)$.', type:'value', target:'2cos(3x) + sin(3x)', points:3,
        mistakes:[{expr:'2cos(3x) + 3 sin(3x)', msg:'Kettenregel: $\\frac{d}{dx}\\sin 3x = 3\\cos 3x$, also $y\'(0) = 3B$.'}],
        model:['λ^2 + 9 = 0', 'λ = ±3i', 'y(x) = A cos(3x) + B sin(3x)', 'y(0) = A = 2', "y'(0) = 3B = 3", 'y(x) = 2cos(3x) + sin(3x)']}]}},
    {aim:1, task:{id:'md-f2', title:'Randbedingungen an die Ableitung', text:'$y\'\' = -k^2y$ auf $[0, L]$ mit $y\'(0) = 0$ und $y\'(L) = 0$.',
      ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos'}, unknowns:{A:{ref:'0', kind:'real'}, B:{ref:'1', kind:'real'}, k:{ref:'π/L'}}}),
      goals:[{id:'a', prompt:'Bestimme das kleinste erlaubte $k > 0$.', type:'solve', unknown:'k', points:3,
        model:['y(x) = A sin(kx) + B cos(kx)', "y'(0) = A k = 0", 'A = 0', "y'(L) = -B k sin(kL) = 0", 'k = π/L'],
        note:'Hier ist auch $k = 0$ erlaubt: $y = B$ (konstant) erfüllt beide Bedingungen – anders als bei $y(0) = y(L) = 0$.'}]}},
    {aim:2, q:'Setzt man $\\Psi = \\varphi(x)f(t)$ in $i\\hbar\\,\\partial_t\\Psi = -\\frac{\\hbar^2}{2m}\\partial_x^2\\Psi + V(x)\\Psi$ ein und teilt durch $\\varphi f$, welche Gleichung erhält $f$?', opts:['$i\\hbar f\' = E f$ mit einer Konstanten $E$', '$i\\hbar f\' = V(x) f$ mit dem Potential', '$f\'\' = -E f$ mit einer Konstanten $E$'], a:0, ex:'Die linke Seite $i\\hbar f\'/f$ hängt nur von $t$ ab, die rechte nur von $x$; beide sind gleich einer Konstanten $E$. Das Potential gehört zur Ortsgleichung.'},
    {aim:'k', id:'md-fk1', type:'mc2', q:'Für $x > 0$ gilt $y\'\' = \\kappa^2y$ mit $\\kappa > 0$, und $y$ soll normierbar sein. Was bleibt von $Ce^{\\kappa x} + De^{-\\kappa x}$?', opts:['$De^{-\\kappa x}$', '$Ce^{\\kappa x}$', 'beide Terme'], a:0,
      ex:'$e^{\\kappa x}$ wächst unbeschränkt; $\\int_0^\\infty|y|^2dx$ wäre unendlich. Also $C = 0$.',
      reason:{q:'Warum?', opts:['Normierbarkeit wirkt wie eine Randbedingung bei $x\\to\\infty$.', 'Die DGL selbst verbietet wachsende Lösungen.', 'Eine Konstante muss immer null sein.'], a:0, ex:'Die DGL lässt beide Terme zu. Erst die Forderung $\\int|y|^2dx < \\infty$ wählt $e^{-\\kappa x}$ aus – eine Bedingung „im Unendlichen“.'}},
    {aim:'k', id:'md-fk2', type:'dialog', text:'Betrachtet wird $y\'\' = -k^2y$ mit $y(0) = 0$ und $y\'(0) = 1$.',
      people:[{name:'Lena', says:'Eine Lösung gibt es nur für $k = n\\pi$, sonst passt sie nicht.'}, {name:'Jonas', says:'Für jedes $k > 0$ gibt es genau eine Lösung, $y = \\sin(kx)/k$. Erst eine zweite Bedingung bei $x = 1$ würde einzelne $k$ auswählen.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Beide Bedingungen stehen an derselben Stelle: ein Anfangswertproblem. Das hat immer genau eine Lösung. Lena verwechselt es mit dem Randwertproblem $y(0) = y(1) = 0$.'},
    {aim:1, sketch:{id:'md-fs-a', kind:'curve', draw:'psi', title:'Gemischte Randbedingungen', points:3,
      text:'$y\'\' = -k^2y$ auf $[0, L]$ mit $y(0) = 0$ und $y\'(L) = 0$. Skizziere die nichttriviale Lösung zum **kleinsten** erlaubten $k > 0$. Skala und Vorzeichen sind frei.',
      plot:{x:[0, 1], xlab:'x', ylab:'y(x)', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}]},
      // y(0) = 0 → y = A sin kx; y'(L) = kA cos kL = 0 → kL = (2n − 1)π/2; kleinstes k = π/(2L): ein Viertel einer Welle
      f:x => Math.sin(Math.PI * x / 2),
      checks:[
        {id:'start', type:'zero', at:[0], msg:'Welche Lösungen von $y\'\' = -k^2y$ erfüllen $y(0) = 0$?'},
        {id:'knoten', type:'nodes', n:0, msg:'Hat die Lösung zum kleinsten $k$ eine Nullstelle im Inneren? Deine Skizze hat {got}.'},
        {id:'ende', type:'maxat', x:1, tol:0.33, msg:'Was bedeutet $y\'(L) = 0$ für die Kurve am rechten Rand: Nullstelle oder waagrechte Tangente? Wo ist $|y|$ dann am größten?'}
      ],
      reveal:'Aus $y(0) = 0$ folgt $y = A\\sin kx$. Die Bedingung $y\'(L) = kA\\cos kL = 0$ verlangt $\\cos kL = 0$, also $kL = \\pi/2, 3\\pi/2, \\dots$ Die kleinste Lösung $\\sin(\\pi x/2L)$ ist eine Viertelwelle: Sie startet bei null, steigt ohne Nullstelle und erreicht bei $x = L$ ihr Maximum mit waagrechter Tangente. Andere $k$ erfüllen beide Bedingungen nicht.',
      wrong:[
        {f:x => Math.sin(Math.PI * x), fails:['ende'], why:'y(L) = 0 statt y′(L) = 0: halbe Welle wie im Kasten'},
        {f:x => Math.cos(Math.PI * x / 2), fails:['start', 'ende'], why:'Randbedingungen vertauscht'},
        {f:x => Math.sin(3 * Math.PI * x / 2), fails:['knoten'], why:'nicht die kleinste Lösung (kL = 3π/2)'}
      ]}}
  ],
  finalB:[
    {aim:0, task:{id:'md-fb1', title:'Anfangswertproblem', text:'Löse $y\'\' + 16y = 0$ mit $y(0) = 1$ und $y\'(0) = 8$.',
      ctx:DGL({unknowns:{λ:{ref:'4i', alt:['-4i'], kind:'complex'}, A:{ref:'1', kind:'real'}, B:{ref:'2', kind:'real'}, C:{ref:'(1 - 2i)/2', kind:'complex'}, D:{ref:'(1 + 2i)/2', kind:'complex'}}}),
      goals:[{id:'a', prompt:'Bestimme $y(x)$.', type:'value', target:'cos(4x) + 2 sin(4x)', points:3,
        mistakes:[{expr:'cos(4x) + 8 sin(4x)', msg:'Kettenregel: $\\frac{d}{dx}\\sin 4x = 4\\cos 4x$, also $y\'(0) = 4B$.'}],
        model:['λ^2 + 16 = 0', 'λ = ±4i', 'y(x) = A cos(4x) + B sin(4x)', 'y(0) = A = 1', "y'(0) = 4B = 8", 'y(x) = cos(4x) + 2 sin(4x)']}]}},
    {aim:1, task:{id:'md-fb2', title:'Gemischte Randbedingungen', text:'$y\'\' = -k^2y$ auf $[0, L]$ mit $y\'(0) = 0$ und $y(L) = 0$.',
      ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos'}, unknowns:{A:{ref:'0', kind:'real'}, B:{ref:'1', kind:'real'}, k:{ref:'π/(2L)'}}}),
      goals:[{id:'a', prompt:'Bestimme das kleinste erlaubte $k > 0$.', type:'solve', unknown:'k', points:3,
        model:['y(x) = A sin(kx) + B cos(kx)', "y'(0) = A k = 0", 'A = 0', 'y(L) = B cos(kL) = 0', 'k = π/(2L)'],
        mistakes:[{expr:'π/L', msg:'Nach $y\'(0) = 0$ bleibt $B\\cos kx$. Die Bedingung $y(L) = 0$ verlangt $\\cos kL = 0$, nicht $\\sin kL = 0$.'}]}]}},
    {aim:2, q:'Beim Separationsansatz erhält man $i\\hbar f\'(t)/f(t) = -\\frac{\\hbar^2}{2m}\\varphi\'\'(x)/\\varphi(x)$. Warum sind beide Seiten konstant?', opts:['Links steht nur $t$, rechts nur $x$, und das für alle $x$, $t$.', 'Weil die Energie eines Systems erhalten ist.', 'Weil $f$ und $\\varphi$ beide normiert sind.'], a:0, ex:'Eine Funktion von $t$ allein kann nur dann für alle $x$ gleich einer Funktion von $x$ allein sein, wenn beide konstant sind. Dass die Konstante die Energie ist, ist eine Folgerung, kein Grund.'},
    {aim:'k', id:'md-fbk1', type:'mc2', q:'Für $x < 0$ gilt $y\'\' = \\kappa^2y$ mit $\\kappa > 0$, und $y$ soll für $x\\to -\\infty$ beschränkt bleiben. Was bleibt von $Ce^{\\kappa x} + De^{-\\kappa x}$?', opts:['$Ce^{\\kappa x}$', '$De^{-\\kappa x}$', 'beide Terme'], a:0,
      ex:'Für $x\\to -\\infty$ wächst $e^{-\\kappa x}$ unbeschränkt, $e^{\\kappa x}$ fällt ab. Also $D = 0$.',
      reason:{q:'Warum?', opts:['Beschränktheit wirkt wie eine Randbedingung bei $x\\to -\\infty$.', 'Links bleibt immer der Term mit dem Minuszeichen.', 'Die DGL selbst verbietet den Term $e^{-\\kappa x}$.'], a:0, ex:'Welcher Term wegfällt, hängt davon ab, in welche Richtung der Bereich ins Unendliche reicht.'}},
    {aim:'k', id:'md-fbk2', type:'dialog', text:'Betrachtet wird $y\'\' = -k^2y$ auf $[0, L]$ mit $y(0) = y(L) = 0$.',
      people:[{name:'Lena', says:'$y \\equiv 0$ erfüllt die Gleichung und beide Randbedingungen für jedes $k$. Also ist jedes $k$ erlaubt.'}, {name:'Jonas', says:'Gesucht sind Lösungen, die nicht überall null sind. Die gibt es nur für $k = n\\pi/L$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'$y \\equiv 0$ ist die triviale Lösung und beschreibt nichts. Eigenwerte sind die $k$, für die es eine nichttriviale Lösung gibt.'},
    {aim:1, sketch:{id:'md-fs-b', kind:'curve', draw:'psi', title:'Gemischte Randbedingungen', points:3,
      text:'$y\'\' = -k^2y$ auf $[0, L]$ mit $y\'(0) = 0$ und $y(L) = 0$. Skizziere die nichttriviale Lösung zum **kleinsten** erlaubten $k > 0$. Skala und Vorzeichen sind frei.',
      plot:{x:[0, 1], xlab:'x', ylab:'y(x)', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'L/2'}, {x:1, lab:'L'}]},
      // y'(0) = 0 → y = A cos kx; y(L) = A cos kL = 0 → kL = (2n − 1)π/2; kleinstes k = π/(2L)
      f:x => Math.cos(Math.PI * x / 2),
      checks:[
        {id:'ende', type:'zero', at:[1], msg:'Welchen Wert muss $y$ bei $x = L$ haben?'},
        {id:'knoten', type:'nodes', n:0, msg:'Hat die Lösung zum kleinsten $k$ eine Nullstelle im Inneren? Deine Skizze hat {got}.'},
        {id:'start', type:'maxat', x:0, tol:0.33, msg:'Was bedeutet $y\'(0) = 0$ für die Kurve am linken Rand: Nullstelle oder waagrechte Tangente? Wo ist $|y|$ dann am größten?'}
      ],
      reveal:'Aus $y\'(0) = 0$ folgt $y = A\\cos kx$. Die Bedingung $y(L) = A\\cos kL = 0$ verlangt $kL = \\pi/2, 3\\pi/2, \\dots$ Die kleinste Lösung $\\cos(\\pi x/2L)$ ist eine Viertelwelle: Sie beginnt mit waagrechter Tangente bei ihrem Maximum, fällt ohne Nullstelle im Inneren und erreicht bei $x = L$ die Null. Andere $k$ erfüllen beide Bedingungen nicht.',
      wrong:[
        {f:x => Math.sin(Math.PI * x), fails:['start'], why:'y(0) = 0 statt y′(0) = 0: halbe Welle wie im Kasten'},
        {f:x => Math.sin(Math.PI * x / 2), fails:['ende', 'start'], why:'Randbedingungen vertauscht'},
        {f:x => Math.cos(3 * Math.PI * x / 2), fails:['knoten'], why:'nicht die kleinste Lösung (kL = 3π/2)'}
      ]}}
  ],
  errors:[
    {id:'md-e1', title:'Die triviale Lösung',
      text:'Randwertproblem $y\'\' = -k^2y$ mit $y(0) = y(L) = 0$. Gesucht sind die $k$, für die es eine Lösung gibt, die nicht überall null ist. Jemand rechnet:',
      ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos', n:{int:[1, 4]}}, unknowns:{A:{ref:'1', kind:'real'}, B:{ref:'0', kind:'real'}, k:{ref:'nπ/L'}}}),
      lines:['y(x) = A sin(kx) + B cos(kx)', 'y(0) = B = 0', 'y(L) = A sin(kL) = 0', 'A = 0'],
      wrong:3,
      why:{q:'Was ist an der letzten Zeile falsch?', opts:['Mit $A = 0$ ist $y \\equiv 0$; nötig ist $\\sin(kL) = 0$.', 'Aus $y(0) = 0$ müsste $B = 1$ folgen, nicht $B = 0$.', 'Nichts, $A = 0$ ist die einzige Möglichkeit.'], a:0, ex:'$A\\sin(kL) = 0$ hat zwei Möglichkeiten: $A = 0$ (uninteressant) oder $\\sin(kL) = 0$. Der zweite liefert die Eigenwerte.'},
      fix:{id:'a', prompt:'Berichtige und bestimme die erlaubten $k$.', type:'solve', unknown:'k', model:['y(x) = A sin(kx) + B cos(kx)', 'y(0) = B = 0', 'y(L) = A sin(kL) = 0', 'sin(kL) = 0', 'k = nπ/L']}},
    {id:'md-e2', title:'Vorzeichen in der charakteristischen Gleichung',
      text:'Gesucht sind die Lösungen von $y\'\' = \\kappa^2y$ mit $\\kappa > 0$. Jemand rechnet:',
      ctx:{coords:['x'], params:{κ:'pos'}, unknowns:{λ:{ref:'κ', alt:['-κ'], kind:'real'}}},
      lines:['λ^2 e^(λx) = κ^2 e^(λx)', 'λ^2 + κ^2 = 0', 'λ = ±iκ'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 passiert?', opts:['$\\kappa^2$ wurde mit falschem Vorzeichen auf die linke Seite gebracht.', 'Man darf nicht durch $e^{\\lambda x}$ teilen, es kann null werden.', 'Der Ansatz $e^{\\lambda x}$ passt nur zu Schwingungsgleichungen.'], a:0, ex:'Richtig ist $\\lambda^2 - \\kappa^2 = 0$, also $\\lambda = \\pm\\kappa$: reelle Exponentialfunktionen. Mit $\\lambda = \\pm i\\kappa$ käme eine Schwingung heraus – das wäre $y\'\' = -\\kappa^2y$.'},
      fix:{id:'a', prompt:'Berichtige: Bestimme beide Wurzeln $\\lambda$.', type:'solve', unknown:'λ', both:true, model:['λ^2 - κ^2 = 0', 'λ = ±κ']}}
  ]
});
})();
lexe('lineare-dgl', 'Lineare DGL mit konstanten Koeffizienten', '$y\'\' + ay\' + by = 0$. Ansatz $y = e^{\\lambda x}$ gibt $\\lambda^2 + a\\lambda + b = 0$. Zwei verschiedene Wurzeln: $y = C_1e^{\\lambda_1x} + C_2e^{\\lambda_2x}$; komplexe Wurzeln $\\alpha\\pm i\\beta$: $y = e^{\\alpha x}(A\\cos\\beta x + B\\sin\\beta x)$; doppelte Wurzel $\\lambda_0$: $y = (C_1 + C_2x)e^{\\lambda_0x}$. Linear und homogen heißt: Linearkombinationen von Lösungen sind wieder Lösungen (Superposition).', {topic:'m-dgl'});
lexe('charakteristische-gleichung', 'Charakteristische Gleichung', 'Setzt man $y = e^{\\lambda x}$ in eine lineare DGL mit konstanten Koeffizienten ein, wird jede Ableitung zu einem Faktor $\\lambda$: $y\'\'\\to\\lambda^2$, $y\'\\to\\lambda$. Nach Division durch $e^{\\lambda x} \\ne 0$ bleibt ein Polynom in $\\lambda$. Beispiele: $y\'\' = -k^2y$ gibt $\\lambda = \\pm ik$, $y\'\' = \\kappa^2y$ gibt $\\lambda = \\pm\\kappa$.', {topic:'m-dgl'});
lexe('anfangswertproblem', 'Anfangswertproblem', 'Eine DGL 2. Ordnung zusammen mit $y(x_0)$ und $y\'(x_0)$ an derselben Stelle. Für lineare DGL mit stetigen Koeffizienten gibt es immer genau eine Lösung. Beispiel: $y\'\' = -k^2y$, $y(0) = 0$, $y\'(0) = 1$ hat $y = \\sin(kx)/k$ für jedes $k > 0$. Erster Ordnung: $i\\hbar f\' = Ef$, $f(0) = 1$ gibt $f = e^{-iEt/\\hbar}$.', {topic:'m-dgl'});
lexe('randwertproblem', 'Randwertproblem und Eigenwerte', 'Bedingungen an zwei verschiedenen Stellen, z. B. $y(0) = y(L) = 0$. Dann hat $y\'\' = -k^2y$ nichttriviale Lösungen nur für $k = n\\pi/L$, $n = 1, 2, \\dots$: ein Eigenwertproblem. Varianten: $y(0) = 0$, $y\'(L) = 0$ gibt $k = (2n-1)\\pi/(2L)$; Normierbarkeit wirkt wie eine Randbedingung im Unendlichen; an Sprungstellen eines endlichen Potentials sind $\\psi$ und $\\psi\'$ stetig (Anschlussbedingungen).', {topic:'m-dgl'});
lexe('dgl-superposition', 'Superpositionsprinzip', 'Für eine lineare homogene DGL gilt: Sind $y_1$ und $y_2$ Lösungen, dann auch $C_1y_1 + C_2y_2$, denn Ableiten ist linear. Das gilt **nicht** für inhomogene Gleichungen ($y\'\' + y = 1$) und nicht für nichtlineare ($y\' = y^2$). In der QM: Die zeitabhängige Schrödingergleichung ist linear, also sind Überlagerungen $\\sum_nc_n\\psi_ne^{-iE_nt/\\hbar}$ Lösungen. Die Gleichung $\\hat H\\psi = E\\psi$ gilt für die Summe aber nur, wenn alle Summanden dasselbe $E$ haben.', {topic:'m-dgl'});
