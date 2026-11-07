/* ===== Mathe M2: Reihen, Integrale und δ-Distribution ===== */
(function(){
const R = String.raw;
topic({
  id:'m-analysis', ch:'math', title:'Reihen, Integrale und δ-Distribution', short:'Reihen und Integrale',
  src:'Boas (3. Aufl.) Kap. 1 (Reihen), Abschn. 8.11 (δ-Funktion), Kap. 11 (Gammafunktion)',
  goals:[
    'Ich kann Funktionen durch Taylor-Reihen nähern und geometrische Reihen summieren.',
    'Ich kann Gauß-Integrale, $\\int_0^\\infty x^ne^{-x}dx = n!$ und partielle Integration mit Randtermen sicher anwenden.',
    'Ich kann mit der δ-Distribution rechnen: $\\int\\delta(x - a)f(x)\\,dx = f(a)$ und $\\delta(cx) = \\delta(x)/|c|$.'
  ],
  needs:'Ableiten und Integrieren elementarer Funktionen · Substitution · komplexe Zahlen (M1)',
  wozu:'Fast jede Rechnung der Quantenmechanik I braucht drei Werkzeuge. Taylor-Näherungen erklären, warum kleine Schwingungen von Molekülen harmonisch sind (Thema 7) und tragen die Störungstheorie (Thema 11). Gauß- und Fakultätsintegrale braucht man für Wellenpakete (Thema 4) und das Wasserstoffatom (Thema 9). Die δ-Distribution beschreibt Punktladungen, Ortseigenzustände und das δ-Potential (Thema 5). Partielle Integration mit verschwindenden Randtermen steckt hinter dem Nachweis, dass der Impulsoperator hermitesch ist (Thema 6).',
  bridge:'Aus M1 kommen komplexe Exponentialfunktionen: Gauß-Integrale mit $e^{ikx}$ führen auf eine quadratische Ergänzung mit komplexem $b$, und die endliche geometrische Reihe mit $q = e^{i\\varphi}$ beschreibt Interferenz am Gitter. Ableiten, Substitution und das Integrieren elementarer Funktionen setzt M2 voraus.',
  check:[
    {q:'$\\frac{d}{dx}\\left(x\\,e^{-x}\\right)$ ist …', opts:['$(1 - x)\\,e^{-x}$', '$-x\\,e^{-x}$', '$(1 + x)\\,e^{-x}$'], a:0, ex:'Produktregel: $1\\cdot e^{-x} + x\\cdot(-e^{-x})$. Die partielle Integration ist die integrierte Produktregel.', lex:'partielle-integration'},
    {q:'$\\int_{-\\infty}^\\infty e^{-x^2}\\,dx$ ist …', opts:['$\\sqrt{\\pi}$', '$\\pi$', '$1$'], a:0, ex:'Das Gauß-Integral: $\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, hier $\\alpha = 1$.', lex:'gauss-integral'},
    {q:'Für kleines $x$ ist $e^x$ ungefähr …', opts:['$1 + x$', '$x$', '$1 - x$'], a:0, ex:'Die Tangente an $e^x$ bei $x = 0$ hat Achsenabschnitt $1$ und Steigung $1$.', lex:'taylor'},
    {q:'$\\int_{-1}^{1} x^3\\,dx$ ist …', opts:['$0$', '$1/2$', '$-1/2$'], a:0, ex:'Ein ungerader Integrand über ein symmetrisches Intervall ergibt null: Die Flächen links und rechts heben sich auf.', lex:'integrale'}
  ],
  diag:[
    {q:'Wie beginnst du, um $\\int_{-\\infty}^{\\infty}x^2e^{-3x^2}dx$ zu berechnen?', opts:['Ich leite $\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$ nach $\\alpha$ ab.', 'Ich suche eine elementare Stammfunktion von $x^2e^{-3x^2}$.', 'Ich substituiere $u = x^2$; dann bleibt $\\int e^{-3u}du$.', 'weiß ich nicht'], a:0, ex:'$\\int x^2e^{-\\alpha x^2}dx = -\\frac{d}{d\\alpha}\\sqrt{\\pi/\\alpha} = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 3$. Partielle Integration geht auch. Eine elementare Stammfunktion gibt es nicht, und bei $u = x^2$ fehlt der Faktor aus $dx = du/(2\\sqrt u)$.'},
    {q:'Wie beginnst du, um $\\int_{-\\infty}^{\\infty}\\delta(2x - 4)\\cos x\\,dx$ zu berechnen?', opts:['Ich schreibe $\\delta(2x - 4) = \\tfrac12\\delta(x - 2)$.', 'Ich setze $x = 4$ in $\\cos x$ ein.', 'Ich schreibe $\\delta(2x - 4) = 2\\delta(x - 2)$.', 'weiß ich nicht'], a:0, ex:'Die Spitze sitzt dort, wo das Argument null ist, bei $x = 2$, und $\\delta(cx) = \\delta(x)/|c|$. Ergebnis: $\\tfrac12\\cos 2$.'}
  ],
  phenomenon:{
    title:'Wo bleibt die kinetische Energie?',
    text:'Ein Teilchen der Masse $m$ mit der Geschwindigkeit $v$ hat nach der Relativitätstheorie die Energie\n\n$$E = \\frac{mc^2}{\\sqrt{1 - v^2/c^2}}.$$\n\nFür Alltagsgeschwindigkeiten ist $v/c$ winzig, für ein Auto etwa $10^{-7}$. Jemand argumentiert: „Dann ist die Wurzel praktisch 1, also ist $E - mc^2 \\approx 0$.“',
    q:{q:'Was ist $E - mc^2$ für $v \\ll c$ in führender Ordnung?', opts:['$\\tfrac12mv^2$', '$0$, die Korrektur ist vernachlässigbar', '$mv^2$', '$\\tfrac12mc^2$'], a:0,
      ex:'$(1 - \\varepsilon)^{-1/2} \\approx 1 + \\tfrac12\\varepsilon$ mit $\\varepsilon = v^2/c^2$.',
      fb:[
        'Richtig. Mit $(1 - \\varepsilon)^{-1/2} \\approx 1 + \\tfrac12\\varepsilon$ und $\\varepsilon = v^2/c^2$ folgt $E \\approx mc^2 + \\tfrac12mv^2$.',
        'Relativ zu $mc^2$ ist die Korrektur winzig, aber nicht null. Wer die Wurzel gleich 1 setzt, verliert genau den gesuchten Term. Man muss bis zur ersten Ordnung entwickeln, die nicht verschwindet.',
        'Die Größenordnung stimmt, der Faktor nicht: In $(1 - \\varepsilon)^{-1/2} \\approx 1 + a\\varepsilon$ ist $a = \\tfrac12$, nicht $1$.',
        'Dann wäre die Korrektur gar nicht klein. Für $v \\to 0$ muss $E - mc^2$ gegen null gehen; der Term muss also von $v$ abhängen.'
      ]},
    reveal:'Mit der Taylor-Näherung $(1 + x)^a \\approx 1 + ax$ für $|x| \\ll 1$, hier mit $x = -v^2/c^2$ und $a = -\\tfrac12$:\n\n$$E = mc^2\\left(1 - \\frac{v^2}{c^2}\\right)^{-1/2} \\approx mc^2\\left(1 + \\frac{v^2}{2c^2}\\right) = mc^2 + \\tfrac12mv^2.$$\n\nDie Newtonsche kinetische Energie ist die **erste Ordnung** der Taylor-Reihe. Die nächste Ordnung, $\\tfrac38mv^4/c^2$, ist die erste relativistische Korrektur. In der Quantenmechanik liefert sie einen Beitrag zur Feinstruktur des Wasserstoffs (dort in der Form $-\\hat p^4/(8m^3c^2)$). Dort ist die Energie durch den Impuls $p = \\gamma mv$ ausgedrückt statt durch $v$. Weil $p^2/(2m)$ selbst schon einen Beitrag $\\tfrac12mv^4/c^2$ enthält, hat die Korrektur dort ein anderes Vorzeichen und einen anderen Faktor: $\\tfrac12 - \\tfrac18 = \\tfrac38$.\n\nDie Lehre: Eine Näherung muss so weit gehen, bis der gesuchte Effekt zum ersten Mal auftaucht.'
  },
  teach:[
    /* ===== Abschnitt 1: Taylor – Tangente, Koeffizienten, Formel ↔ Graph ↔ Näherung, Ordnung, Konvergenz, kleine Schwingungen ===== */
    {id:'ma-t1', title:'Taylor-Reihen: Funktionen lokal durch Polynome ersetzen', steps:[
      {id:'ma-t1a', title:'Die Tangente als erste Näherung',
        num:{title:R`$e^x$ bei $x = 0{,}1$`, text:R`Genau ist $e^{0{,}1} = 1{,}10517\ldots$ Die Tangente bei $0$ hat den Wert $1$ und die Steigung $e^0 = 1$, also $e^x \approx 1 + x = 1{,}1$. Der Fehler $0{,}0052$ ist ungefähr $x^2/2 = 0{,}005$ – so groß wie der nächste Term.`},
        text:R`Viele Rechnungen der Physik werden erst lösbar, wenn man eine Funktion in der Nähe eines Punktes $x_0$ durch etwas Einfacheres ersetzt. Die einfachste Wahl ist die Tangente: Sie hat bei $x_0$ denselben Wert und dieselbe Steigung wie $f$,

$$f(x) \approx f(x_0) + f'(x_0)\,(x - x_0).$$

Im Graphen schmiegt sich die Gerade an die Kurve an. Je näher $x$ bei $x_0$ liegt, desto kleiner ist der Fehler. Er wächst etwa wie $(x - x_0)^2$: Halbierst du den Abstand, wird er rund viermal kleiner.`,
        q:{q:R`Welche Gerade nähert $\sin x$ in der Nähe von $x = 0$?`,
          opts:[R`$y = x$`, R`$y = 1 + x$`, R`$y = 1$`], a:0,
          ex:R`$\sin 0 = 0$ und $\sin'(0) = \cos 0 = 1$: Die Tangente ist $y = 0 + 1\cdot x$.`,
          fb:['',
            R`Der Wert bei $0$ ist $\sin 0 = 0$, nicht $1$.`,
            R`$y = 1$ ist die Tangente an $\cos x$. $\sin x$ steigt bei $0$ mit der Steigung 1.`]}},
      {id:'ma-t1b', title:R`Die Koeffizienten: $f^{(n)}(x_0)/n!$`,
        num:{title:R`Taylor-Polynom von $e^x$`, text:R`Alle Ableitungen von $e^x$ sind $e^x$, bei $0$ also $1$. Die Koeffizienten sind $1/n!$:

$$e^x \approx 1 + x + \frac{x^2}{2} + \frac{x^3}{6}.$$

Bei $x = 0{,}1$: $1 + 0{,}1 + 0{,}005 + 0{,}000167 = 1{,}105167$. Der Fehler ist nur noch $4\cdot10^{-6}$.`},
        text:R`Ein Polynom $p(x) = c_0 + c_1(x - x_0) + c_2(x - x_0)^2 + \dots$ soll bei $x_0$ denselben Wert, dieselbe Steigung, dieselbe Krümmung und so weiter haben wie $f$. Leitest du $p$ $n$-mal ab und setzt $x = x_0$ ein, bleibt nur $n!\,c_n$ übrig. Also ist $c_n = f^{(n)}(x_0)/n!$, und es entsteht die [[lex:taylor|Taylor-Reihe]]

$$f(x) = \sum_{n=0}^\infty\frac{f^{(n)}(x_0)}{n!}(x - x_0)^n.$$

Weil $n!$ sehr schnell wächst, werden die Terme hoher Ordnung für kleine $x - x_0$ rasch unbedeutend. Die wichtigsten Reihen um $0$ solltest du kennen: $e^x = 1 + x + \tfrac{x^2}{2} + \dots$, $\cos x = 1 - \tfrac{x^2}{2} + \dots$, $\sin x = x - \tfrac{x^3}{6} + \dots$ und $(1 + x)^a = 1 + ax + \tfrac{a(a - 1)}{2}x^2 + \dots$

**Rückblick (M1):** Setzt du in die Reihe von $e^x$ den Wert $i\varphi$ ein, wird $i^2 = -1$, $i^3 = -i$, $i^4 = 1$, und die Terme sortieren sich in zwei Gruppen:

$$\begin{aligned}e^{i\varphi} &= \Big(1 - \tfrac{\varphi^2}{2} + \tfrac{\varphi^4}{24} - \dots\Big)\\ &\quad + i\Big(\varphi - \tfrac{\varphi^3}{6} + \dots\Big)\\ &= \cos\varphi + i\sin\varphi.\end{aligned}$$

Das ist die Euler-Formel aus M1.`,
        q:{q:R`Wie lautet die Taylor-Näherung von $\cos x$ bis zur Ordnung $x^2$?`,
          opts:[R`$1 - x^2$`, R`$1 - x^2/2$`, R`$1 + x - x^2/2$`], a:1,
          ex:R`$\cos 0 = 1$, $\cos'(0) = -\sin 0 = 0$, $\cos''(0) = -1$; geteilt durch $2! = 2$ gibt $-x^2/2$.`,
          fb:[R`Der Faktor $1/2!$ fehlt: Der Koeffizient von $x^2$ ist $\cos''(0)/2$.`,
            '',
            R`Ein linearer Term tritt nicht auf, denn $\cos'(0) = -\sin 0 = 0$.`]}},
      {id:'ma-t1c', title:'Formel, Graph und Näherung',
        num:{title:R`$\cos x$ und $1 - x^2/2$`, text:R`Bei $x = 0{,}5$: $\cos 0{,}5 = 0{,}8776$, Näherung $0{,}875$. Bei $x = 1$: $0{,}5403$ gegen $0{,}5$. Bei $x = 3$: $-0{,}990$ gegen $-3{,}5$ – dort ist die Näherung unbrauchbar.`},
        text:R`Eine Taylor-Näherung ist eine Aussage über einen Graphen: Nahe $x_0$ ist die Kurve von ihrem Polynom kaum zu unterscheiden, weiter weg trennen sich beide. Wie weit „nahe“ reicht, hängt von der Funktion ab und von der Ordnung, bei der du abbrichst.

Beim Kosinus heißt die Näherung in Worten: Nahe $0$ sieht er aus wie eine nach unten geöffnete Parabel mit dem Scheitel bei $1$. Die Tafel zeigt Worte, Formel, Graph und Fehler zusammen. Lies den Fehler am Graphen ab und vergleiche ihn mit dem ersten weggelassenen Term $x^4/24$.`,
        reps:{obj:R`$\cos x$ und seine Näherung bis $x^2$`,
          rows:[
            {k:'worte', text:R`Nahe $0$: eine nach unten geöffnete Parabel mit dem Scheitel bei $1$.`},
            {k:'formel', tex:R`\cos x = 1 - \frac{x^2}{2} + \frac{x^4}{24} - \dots \approx 1 - \frac{x^2}{2}`},
            {k:'graph', plot:{x:[-2.5, 2.5], y:[-2.2, 1.3], xlab:'x', ylab:'y', ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:1, lab:'1'}, {x:2, lab:'2'}], yticks:[{y:1, lab:'1'}, {y:-1, lab:'-1'}]}, f:x => Math.cos(x), lab:R`\cos x`, f2:x => 1 - x * x / 2, lab2:R`1 - x^2/2`,
              cap:R`Bis etwa $|x| = 1$ liegen beide Kurven fast aufeinander, danach fällt die Parabel davon.`},
            {k:'mathe', text:R`Der Fehler ist etwa der erste weggelassene Term: Bei $x = 1$ ist $\tfrac{x^4}{24} \approx 0{,}042$, tatsächlich $0{,}5403 - 0{,}5 = 0{,}040$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Scheitelhöhe $f(0)$, Steigung $f'(0)$ und Krümmung $f''(0)$ bestimmen und als $c_n = f^{(n)}(0)/n!$ in das Polynom schreiben.`},
            {from:'formel', to:'graph', rule:R`Funktion und abgebrochenes Polynom in dasselbe Bild zeichnen; sie berühren sich bei $x_0$ und trennen sich nach außen.`},
            {from:'graph', to:'mathe', rule:R`Den senkrechten Abstand der Kurven an einer Stelle ablesen und mit dem ersten weggelassenen Term vergleichen.`}
          ]},
        q:{q:R`In einem anderen Bild schmiegt sich die Gerade $y = 1 - x$ bei $x = 0$ an eine Kurve. Welche Funktion kann das sein?`, tr:{from:'graph', to:'formel'},
          opts:[R`$\cos x$`, R`$\sin x$`, R`$e^{-x}$`], a:2,
          ex:R`$e^{-x}$ hat bei $0$ den Wert $1$ und die Steigung $-1$; ihre Tangente ist $1 - x$.`,
          fb:[R`$\cos x$ hat bei $0$ die Steigung $0$; seine Tangente ist waagerecht, $y = 1$.`,
            R`$\sin x$ geht durch den Ursprung; seine Tangente ist $y = x$.`,
            '']}},
      {id:'ma-t1d', title:'Ordnung: so weit entwickeln, bis der Effekt auftaucht',
        num:{title:R`$v^2/c^2 = 0{,}01$`, text:R`Mit $\varepsilon = v^2/c^2 = 0{,}01$ ist $(1 - \varepsilon)^{-1/2} = 1{,}0050378$. Nullte Ordnung: $1$, also $E - mc^2 \approx 0$ – der Effekt fehlt ganz. Erste Ordnung: $1 + \tfrac12\varepsilon = 1{,}005$, also $E - mc^2 \approx \tfrac12mv^2$. Der Rest $3{,}8\cdot10^{-5}$ ist etwa $\tfrac38\varepsilon^2$.`},
        text:R`Bricht man nach dem Term mit $x^n$ ab, ist der Fehler für kleine $x$ etwa so groß wie der erste weggelassene Term. Man schreibt $O(x^{n+1})$, gelesen „von der Ordnung $x^{n+1}$“. Wie weit man entwickeln muss, hängt von der Frage ab: so weit, bis der gesuchte Effekt zum ersten Mal auftaucht.

Das zeigt die Vorhersage zu Beginn. Mit $(1 - v^2/c^2)^{-1/2} \approx 1$ verschwindet die kinetische Energie ganz. Erst die erste Ordnung liefert $\tfrac12mv^2$. Die nächste Ordnung ist die erste relativistische Korrektur.`,
        q:{q:R`Wie lautet $(1 + x)^{-1}$ bis zur ersten Ordnung?`,
          opts:[R`$1 - x$`, R`$1 + x$`, R`$-x$`], a:0,
          ex:R`$(1 + x)^a \approx 1 + ax$ mit $a = -1$.`,
          fb:['',
            R`Das Vorzeichen kommt aus dem Exponenten $a = -1$: $1 + ax = 1 - x$.`,
            R`Die nullte Ordnung $1$ gehört dazu; $-x$ allein ist nur die Korrektur.`]}},
      {id:'ma-t1e', title:'Wo die Reihe gilt: der Konvergenzbereich',
        num:{title:R`$1/(1 + x)$ bei $x = 0{,}5$ und $x = 2$`, text:R`Die Reihe ist $1 - x + x^2 - x^3 + \dots$ Bei $x = 0{,}5$ geben die Teilsummen $1;\ 0{,}5;\ 0{,}75;\ 0{,}625;\ 0{,}6875$ – sie nähern sich $\tfrac{1}{1{,}5} \approx 0{,}667$. Bei $x = 2$ geben sie $1;\ -1;\ 3;\ -5;\ 11$, obwohl $\tfrac13$ ein harmloser Wert ist.`},
        text:R`Die Reihen von $e^x$, $\sin x$ und $\cos x$ konvergieren für alle $x$. Die Reihe von $(1 + x)^a$ konvergiert für $a \notin \{0, 1, 2, \dots\}$ genau für $|x| < 1$. Für $a \in \{0, 1, 2, \dots\}$ bricht sie ab und gilt überall. Die Reihe von $\ln(1 + x)$ konvergiert für $-1 < x \le 1$.

Außerhalb ihres Konvergenzbereichs ist eine Reihe wertlos, auch wenn die Funktion dort harmlos ist. Ein Polynom kann eine Funktion also nur in einem bestimmten Bereich ersetzen. Prüfe vor jeder Näherung, ob dein $x$ darin liegt.`,
        q:{q:R`Darf man $\sqrt{1 + x}$ für $x = 3$ durch die Taylor-Reihe um $0$ berechnen?`,
          opts:[R`Ja, eine Taylor-Reihe gilt überall.`, R`Ja, weil $\sqrt4 = 2$ endlich ist.`, R`Nein, sie konvergiert nur für $|x| < 1$.`], a:2,
          ex:R`$a = \tfrac12$ ist keine natürliche Zahl, also konvergiert die Reihe nur für $|x| < 1$. Bei $x = 3$ divergieren die Teilsummen.`,
          fb:[R`Von den Reihen dieses Abschnitts gelten nur die von $e^x$, $\sin x$, $\cos x$ und von Polynomen überall. Bei $(1 + x)^a$ ist meist bei $|x| = 1$ Schluss.`,
            R`Dass die Funktion dort einen endlichen Wert hat, sagt nichts über die Reihe. Bei $\tfrac{1}{1 + x}$ und $x = 2$ war es ebenso.`,
            '']}},
      {id:'ma-t1f', title:'Kleine Schwingungen: Taylor im Minimum',
        num:{title:R`Morse-Potential mit $D = \beta = 1$`, text:R`Bei $x = 0{,}1$ ist $V = (1 - e^{-0{,}1})^2 = 0{,}00906$. Die quadratische Näherung $D\beta^2x^2$ gibt $0{,}01$. Bei $x = 0{,}01$ ist der Unterschied nur noch $1\,\%$: $9{,}90\cdot10^{-5}$ gegen $1{,}00\cdot10^{-4}$.`},
        text:R`Ein Teilchen sitze im Minimum $x_0$ eines Potentials $V$. Dort ist $V'(x_0) = 0$, der lineare Term fehlt. Die Reihe beginnt deshalb mit

$$V(x) = V(x_0) + \tfrac12V''(x_0)(x - x_0)^2 + O((x - x_0)^3).$$

Bis auf eine Konstante ist das ein harmonisches Potential $\tfrac12m\omega^2(x - x_0)^2$ mit $m\omega^2 = V''(x_0)$. Die Herleitung zeigt das für das Morse-Potential $V(x) = D(1 - e^{-\beta x})^2$, ein Modell für die Bindung zweier Atome. **Ausblick (Thema 7):** Deshalb ist der [[lex:oszillator-spektrum|harmonische Oszillator]] überall: Er beschreibt in niedrigster Ordnung jede Schwingung um ein Gleichgewicht.`,
        derive:{title:'Herleitung: kleine Schwingungen im Morse-Potential', ctx:{coords:['x'], params:{D:'pos', β:'pos'}, defs:{'V(x)':'D (1 - e^(-β x))^2'}},
          lines:[
            {l:"V'(x) = 2 D β e^(-β x) (1 - e^(-β x))", w:'Kettenregel', why:{q:'Woher kommt der Faktor $\\beta e^{-\\beta x}$?', opts:['innere Ableitung von $1 - e^{-\\beta x}$', 'Ableitung des Vorfaktors $D$ nach $x$', 'Produktregel mit den Faktoren $D$ und $\\beta$'], a:0, ex:'$\\frac{d}{dx}(1 - e^{-\\beta x}) = \\beta e^{-\\beta x}$. $D$ ist eine Konstante, ihre Ableitung ist null.'}},
            {l:"V'(0) = 0", w:'Gleichgewicht bei x = 0', why:{q:'Was bedeutet $V\'(0) = 0$ für die Taylor-Reihe um $0$?', opts:['Der lineare Term fällt weg: $x = 0$ ist ein Gleichgewicht.', 'Die ganze Taylor-Reihe ist dann null: $V(x) = 0$.', 'Man muss um einen anderen Punkt $x_0 \\neq 0$ entwickeln.'], a:0, ex:'Der Koeffizient von $x$ ist $V\'(0)$. Weil er null ist, beginnt die Entwicklung nach der Konstanten erst mit $x^2$.'}},
            {l:"V''(0) = 2 D β^2", w:'noch einmal ableiten, x = 0 einsetzen', why:{q:'Warum trägt bei $x = 0$ nur ein Term der Produktregel bei?', opts:['Der Faktor $1 - e^{-\\beta x}$ ist bei $x = 0$ null.', 'Der Faktor $e^{-\\beta x}$ ist bei $x = 0$ null.', 'Höhere Ableitungen lässt man immer weg.'], a:0, ex:'Ableiten von $(1 - e^{-\\beta x})$ gibt $\\beta e^{-\\beta x}$, also $2D\\beta^2e^{-2\\beta x}$ plus einen Term mit $(1 - e^{-\\beta x})$, der bei $0$ verschwindet. $e^0 = 1$, nicht $0$.'}},
            {l:'V(x) ≈ D β^2 x^2', w:'V(0) = 0, Ordnung x²', why:{q:'Woher kommt der Vorfaktor $D\\beta^2$?', opts:['$V\'\'(0)/2! = 2D\\beta^2/2$', '$V\'\'(0)$ selbst, also $2D\\beta^2$', '$V(0) + V\'(0)$, also $D$'], a:0, ex:'Der Taylor-Koeffizient von $x^2$ ist $V\'\'(0)/2!$. Ohne die Fakultät wäre die Näherung doppelt so steil.'}}
          ]},
        q:{q:R`Welche Kreisfrequenz haben kleine Schwingungen der Masse $m$ im Morse-Potential?`,
          opts:[R`$\omega = \beta\sqrt{D/m}$`, R`$\omega = \beta\sqrt{2D/m}$`, R`$\omega = 2D\beta^2/m$`], a:1,
          ex:R`$m\omega^2 = V''(0) = 2D\beta^2$, also $\omega = \sqrt{2D\beta^2/m}$.`,
          fb:[R`Der Faktor 2 fehlt: $V''(0) = 2D\beta^2$, und $\tfrac12m\omega^2 = D\beta^2$.`,
            '',
            R`Das ist $\omega^2$, nicht $\omega$; die Wurzel fehlt.`]}},
      {id:'ma-t1g', title:R`Typischer Fehler: der Faktor $1/n!$ fehlt`,
        num:{title:R`Morse-Potential ohne $1/2!$`, text:R`Wer $V''(0) = 2D\beta^2$ direkt als Koeffizienten von $x^2$ nimmt, erhält $V \approx 2D\beta^2x^2$, doppelt so steil wie richtig. Bei $x = 0{,}1$ und $D = \beta = 1$ wäre das $0{,}02$ statt etwa $0{,}009$. Die Kreisfrequenz käme um den Faktor $\sqrt2$ zu groß heraus.`},
        text:R`Der häufigste Fehler mit Taylor-Reihen: $f^{(n)}(x_0)$ ohne den Faktor $1/n!$ als Koeffizienten nehmen. Bei der zweiten Ordnung macht das einen Faktor 2, bei höheren Ordnungen schnell mehr. Ein schneller Test ist $e^x$: Alle Ableitungen bei $0$ sind $1$, die Koeffizienten aber $1, 1, \tfrac12, \tfrac16, \dots$

Zwei weitere Fehler kennst du aus den letzten Schritten. Bricht man zu früh ab, fehlt der gesuchte Effekt. Benutzt man eine Reihe außerhalb ihres Konvergenzbereichs, ist das Ergebnis wertlos.`,
        q:{q:R`Wie lautet der Koeffizient von $x^3$ in der Taylor-Reihe von $e^{2x}$ um $0$?`,
          opts:[R`$8$`, R`$4/3$`, R`$8/3$`], a:1,
          ex:R`$\frac{d^3}{dx^3}e^{2x} = 8e^{2x}$, bei $0$ also $8$; geteilt durch $3! = 6$ gibt $\tfrac43$.`,
          fb:[R`$8$ ist die dritte Ableitung selbst. Der Koeffizient ist $f'''(0)/3!$.`,
            '',
            R`Geteilt wurde durch $3$ statt durch $3! = 6$.`]}}
    ]},

    /* ===== Abschnitt 2: geometrische Reihe – endlich, unendlich, Zustandssumme, Gitter ===== */
    {id:'ma-t2', title:'Die geometrische Reihe', steps:[
      {id:'ma-t2a', title:'Die endliche Summe: ein Verschiebetrick',
        num:{title:R`$1 + \tfrac12 + \tfrac14 + \tfrac18$`, text:R`Direkt: $\tfrac{8 + 4 + 2 + 1}{8} = \tfrac{15}{8}$. Mit der Formel für $q = \tfrac12$ und $N = 4$:

$$\frac{1 - (1/2)^4}{1 - 1/2} = \frac{15/16}{1/2} = \frac{15}{8}.$$`},
        text:R`Die [[lex:geometrische-reihe|geometrische Reihe]] ist die Reihe, die man in der QM I am häufigsten exakt summiert. Jeder Summand ist das $q$-fache des vorigen. Für die endliche Summe $S_N = 1 + q + \dots + q^{N-1}$ gibt es einen Trick: Multipliziere mit $q$. Dann rückt jeder Summand eine Stelle weiter, und in der Differenz $qS_N - S_N$ bleiben nur $q^N$ und $-1$ übrig (Herleitung). Also

$$\sum_{n=0}^{N-1}q^n = \frac{1 - q^N}{1 - q}\qquad (q \ne 1).$$

Für $q = 1$ ist die Summe einfach $N$.`,
        derive:{ctx:{coords:['y'], params:{q:{range:[0.1, 0.8]}, N:{int:[1, 6]}, x:'pos'}},
          lines:[
            {l:'q Σ_{n=0}^{N-1} q^n - Σ_{n=0}^{N-1} q^n = q^N - 1', w:'Teleskopsumme', why:{q:'Warum bleiben nur zwei Terme übrig?', opts:['Weil sich bis auf $q^N$ und $1$ alle Terme wegheben.', 'Weil man $q$ gleich null setzen darf.', 'Weil eine Summe mal $q$ wieder dieselbe Summe ist.'], a:0, ex:'$qS_N = q + q^2 + \\dots + q^N$ und $S_N = 1 + q + \\dots + q^{N-1}$. Die gemeinsamen Terme $q, \\dots, q^{N-1}$ fallen in der Differenz weg.'}},
            {l:'Σ_{n=0}^{N-1} q^n = (1 - q^N)/(1 - q)', w:'durch q − 1 teilen', why:{q:'Warum braucht man hier $q \\neq 1$?', opts:['Sonst teilt man durch $q - 1 = 0$.', 'Für $q = 1$ divergiert die endliche Summe.', 'Für $q = 1$ ist die Summe null.'], a:0, ex:'Für $q = 1$ ist die Summe einfach $N$. Eine endliche Summe divergiert nie.'}}
          ]},
        q:{q:R`Was ist $1 + 3 + 9 + 27$, mit der Formel gerechnet?`,
          opts:[R`$121$`, R`$-40$`, R`$40$`], a:2,
          ex:R`$\frac{1 - 3^4}{1 - 3} = \frac{-80}{-2} = 40$. Direkt: $1 + 3 + 9 + 27 = 40$.`,
          fb:[R`Das ist die Summe bis $3^4$, also mit fünf Summanden. Für $N = 4$ Summanden steht $q^4$ im Zähler.`,
            R`Zähler und Nenner sind beide negativ: $\frac{-80}{-2}$ ist positiv. Eine Summe positiver Zahlen ist positiv.`,
            '']}},
      {id:'ma-t2b', title:R`Die unendliche Reihe und die Bedingung $|q| < 1$`,
        num:{title:R`$q = \tfrac12$ und $q = 2$`, text:R`Für $q = \tfrac12$ sind die Teilsummen $1;\ 1{,}5;\ 1{,}75;\ 1{,}875;\ \dots$ Der Rest $q^N$ geht gegen null, und die Summe ist $\tfrac{1}{1 - 1/2} = 2$. Für $q = 2$ wachsen die Teilsummen über alle Grenzen; die Formel gäbe $\tfrac{1}{1 - 2} = -1$, eine negative Summe positiver Zahlen.`},
        text:R`Für $|q| < 1$ geht $q^N \to 0$, und aus der endlichen Formel folgt

$$\sum_{n=0}^{\infty}q^n = \frac{1}{1 - q}\qquad (|q| < 1).$$

Für $|q| \ge 1$ divergiert die Reihe; die rechte Seite ist dann keine gültige Summe. Die Formel gilt auch für komplexe $q$ mit $|q| < 1$. Ein Blick zurück: Die geometrische Reihe ist die Taylor-Reihe von $\frac{1}{1 - q}$ um $0$, mit dem Konvergenzbereich $|q| < 1$ aus Abschnitt 1. Die Tafel verbindet beide Sichtweisen.`,
        reps:{obj:R`Die geometrische Reihe $\sum_n q^n$`,
          rows:[
            {k:'worte', text:R`Jeder Summand ist das $q$-fache des vorigen, beginnend mit $1$.`},
            {k:'formel', tex:R`\sum_{n=0}^\infty q^n = \frac{1}{1 - q}\qquad(|q| < 1)`},
            {k:'graph', plot:{x:[-0.9, 0.9], y:[0, 10.5], xlab:'q', ylab:R`\text{Summe}`, ticks:[{x:-0.5, lab:'-0{,}5'}, {x:0.5, lab:'0{,}5'}], yticks:[{y:1, lab:'1'}, {y:2, lab:'2'}, {y:10, lab:'10'}]}, f:x => 1 / (1 - x), lab:R`1/(1 - q)`, f2:x => 1 + x + x * x, lab2:R`1 + q + q^2`,
              cap:R`Die Teilsumme bis $q^2$ (gestrichelt) liegt nahe $q = 0$ auf der Kurve $1/(1 - q)$. Für $q \to 1$ wächst die Summe über alle Grenzen.`},
            {k:'physik', text:R`**Ausblick (Thema 7 und Statistische Physik):** Der Oszillator hat die Energien $E_n = \hbar\omega(n + \tfrac12)$. Der Boltzmann-Faktor $e^{-E_n/(k_BT)}$ aus der Wärmelehre gibt an, wie stark ein Zustand bei der Temperatur $T$ besetzt ist. Die Summe aller dieser Gewichte heißt Zustandssumme. Sie ist eine geometrische Reihe mit $q = e^{-\hbar\omega/(k_BT)} < 1$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Den Faktor zwischen zwei Nachbarn als $q$ ablesen, den ersten Summanden vor die Summe schreiben und $\frac{1}{1 - q}$ einsetzen – erst nachdem $|q| < 1$ geprüft ist.`},
            {from:'formel', to:'graph', rule:R`$\frac{1}{1 - q}$ über $q$ zeichnen. Jede Teilsumme ist ein Polynom, das sich bei $q = 0$ an die Kurve schmiegt.`},
            {from:'graph', to:'physik', rule:R`$q$ als Verhältnis zweier aufeinanderfolgender Gewichte lesen: $e^{-E_{n+1}/(k_BT)}/e^{-E_n/(k_BT)} = e^{-\hbar\omega/(k_BT)}$.`}
          ]},
        q:{q:R`Eine Folge von Beiträgen beginnt mit $3$, jeder weitere ist halb so groß: $3 + \tfrac32 + \tfrac34 + \dots$ Was ist die Summe?`, tr:{from:'worte', to:'formel'},
          opts:[R`$6$`, R`unendlich`, R`$2$`], a:0,
          ex:R`$3\sum_n(\tfrac12)^n = 3\cdot\frac{1}{1 - 1/2} = 6$.`,
          fb:['',
            R`Unendlich viele Summanden können eine endliche Summe haben, wenn sie schnell genug kleiner werden: Hier ist $q = \tfrac12$.`,
            R`$2$ ist die Summe für den Startwert $1$. Hier steht vor jedem Summanden der Faktor 3.`]}},
      {id:'ma-t2c', title:'Eine Brücke zur Physik: die Zustandssumme',
        num:{title:R`$x = \ln 2$`, text:R`Dann ist $q = e^{-x} = \tfrac12$ und $e^{-x/2} = \tfrac{1}{\sqrt2}$:

$$Z = \frac{e^{-x/2}}{1 - e^{-x}} = \frac{1/\sqrt2}{1/2} = \sqrt2 \approx 1{,}414.$$

Die ersten Summanden $0{,}707 + 0{,}354 + 0{,}177 + 0{,}088 + \dots$ nähern sich diesem Wert.`},
        text:R`**Ausblick (Thema 7 und Statistische Physik):** Die Energien des Oszillators sind $E_n = \hbar\omega(n + \tfrac12)$. Die statistische Physik braucht die Zustandssumme $Z = \sum_n e^{-E_n/(k_BT)}$. Mit $x = \hbar\omega/(k_BT) > 0$ wird daraus eine geometrische Reihe, sobald du den Faktor $e^{-x/2}$ ausklammerst:

$$Z = \sum_{n=0}^\infty e^{-(n + 1/2)x} = \frac{e^{-x/2}}{1 - e^{-x}}.$$

Die Herleitung zeigt beide Schritte. Durch Ableiten nach $x$ folgt daraus die mittlere Energie, ein Schritt zum Planckschen Strahlungsgesetz. Mathematisch brauchst du nur zwei Dinge: einen konstanten Faktor herausziehen und prüfen, dass $q = e^{-x} < 1$ ist.`,
        derive:{ctx:{coords:['y'], params:{q:{range:[0.1, 0.8]}, N:{int:[1, 6]}, x:'pos'}},
          lines:[
            {l:'Σ_{n=0}^∞ e^(-(n + 1/2) x) = e^(-x/2) Σ_{n=0}^∞ (e^(-x))^n', w:'e^{−x/2} ausklammern', why:{q:'Warum darf man $e^{-x/2}$ vor die Summe ziehen?', opts:['Weil der Faktor nicht von $n$ abhängt.', 'Weil $e^{-x/2}$ für kleine $x$ ungefähr 1 ist.', 'Weil man Exponenten beliebig umsortieren darf.'], a:0, ex:'$e^{-(n + 1/2)x} = e^{-x/2}\\,(e^{-x})^n$. Konstante Faktoren zieht man aus jeder Summe heraus.'}},
            {l:'= e^(-x/2)/(1 - e^(-x))', w:'q = e^{−x} < 1', why:{q:'Warum konvergiert die Reihe?', opts:['Weil für $x > 0$ gilt: $0 < e^{-x} < 1$.', 'Weil jede Reihe mit $e$ konvergiert.', 'Weil die Summanden positiv sind.'], a:0, ex:'Die geometrische Reihe konvergiert genau für $|q| < 1$. Positive Summanden allein garantieren keine Konvergenz, wie $\\sum 1$ zeigt.'}}
          ]},
        q:{q:R`Welches $q$ hat die Reihe $\sum_{n=0}^\infty e^{-(2n + 1)y}$ für $y > 0$?`,
          opts:[R`$e^{-y}$`, R`$e^{-2y}$`, R`$e^{-(2n + 1)y}$`], a:1,
          ex:R`$e^{-(2n + 1)y} = e^{-y}\,(e^{-2y})^n$: Von Summand zu Summand kommt der Faktor $e^{-2y}$ hinzu.`,
          fb:[R`$e^{-y}$ ist der Faktor, den man ausklammert. Das Verhältnis zweier Nachbarn ist $e^{-2y}$.`,
            '',
            R`$q$ darf nicht von $n$ abhängen; es ist das feste Verhältnis zweier aufeinanderfolgender Summanden.`]}},
      {id:'ma-t2d', title:R`Endliche Reihe mit komplexem $q$: das Gitter`,
        pre:{from:'m-komplex', seg:'mk-t5', title:'Betragsquadrat einer Summe', text:R`Amplituden addieren sich; die Intensität ist das Betragsquadrat der Summe. Für zwei Zeiger der Länge 1 mit relativer Phase $\varphi$ ist $|1 + e^{i\varphi}|^2 = 2 + 2\cos\varphi$, also ein Wert zwischen $0$ und $4$.`},
        num:{title:'Vier Spalte', text:R`Bei $N = 4$ und $\varphi = \tfrac\pi2$ sind die Amplituden $1, i, -1, -i$. Ihre Summe ist $0$. Die Formel gibt ebenfalls

$$\frac{\sin^2(4\cdot\pi/4)}{\sin^2(\pi/4)} = \frac{0}{1/2} = 0.$$

Bei $\varphi \to 0$ dagegen zeigen alle vier Zeiger in dieselbe Richtung: $|4|^2 = 16$.`},
        text:R`Beim optischen Gitter mit $N$ Spalten addiert man die Amplituden $e^{in\varphi}$; $\varphi$ ist die Phasendifferenz von Spalt zu Spalt. Das ist eine endliche geometrische Reihe mit dem komplexen $q = e^{i\varphi}$. Für den Betrag brauchst du einen Zwischenschritt mit zwei Regeln aus M1, $|w|^2 = w^*w$ und $\sin^2\alpha = \tfrac12(1 - \cos2\alpha)$:

$$\begin{aligned}|1 - e^{iu}|^2 &= (1 - e^{-iu})(1 - e^{iu})\\ &= 2 - 2\cos u = 4\sin^2(u/2).\end{aligned}$$

Damit folgt

$$\left|\sum_{n=0}^{N-1}e^{in\varphi}\right|^2 = \frac{|1 - e^{iN\varphi}|^2}{|1 - e^{i\varphi}|^2} = \frac{\sin^2(N\varphi/2)}{\sin^2(\varphi/2)}.$$

Für $\varphi \to 0$ geht das gegen $N^2$: So entstehen die scharfen Hauptmaxima eines Gitters. Hier treffen sich M1 und M2.`,
        q:{q:R`Ein Gitter hat $N = 3$ Spalte, und die Phasendifferenz von Spalt zu Spalt ist $\varphi = \pi$. Wie groß ist $\left|\sum_{n=0}^{2}e^{in\varphi}\right|^2$?`,
          opts:[R`$0$`, R`$1$`, R`$3$`, R`$9$`], a:1,
          ex:R`Die Amplituden sind $1$, $e^{i\pi} = -1$ und $e^{2i\pi} = 1$; ihre Summe ist $1$. Die Formel gibt ebenso $\sin^2(3\pi/2)/\sin^2(\pi/2) = 1/1 = 1$.`,
          fb:[R`Die Zeiger $1, -1, 1$ heben sich nur paarweise auf. Bei drei Spalten bleibt einer übrig.`,
            '',
            R`$3$ ist die Summe der Einzelwerte $|e^{in\varphi}|^2$. Addiert werden aber zuerst die Amplituden, dann wird quadriert.`,
            R`$9 = N^2$ gilt nur im Hauptmaximum $\varphi = 0$, wenn alle Zeiger in dieselbe Richtung zeigen.`]}},
      {id:'ma-t2e', title:R`Typischer Fehler: falscher Startindex, $|q| \ge 1$`,
        num:{title:R`$\sum_{n=1}^\infty(1/3)^n$`, text:R`Die Summe beginnt bei $n = 1$, also fehlt der Summand $1$. Richtig ist $\frac{q}{1 - q} = \frac{1/3}{2/3} = \tfrac12$. Wer $\frac{1}{1 - q} = \tfrac32$ schreibt, zählt die $1$ zu viel mit.`},
        text:R`Zwei Fehler passieren mit der geometrischen Reihe am häufigsten. Erstens: Die Summe beginnt nicht bei $n = 0$, und man schreibt trotzdem $\frac{1}{1 - q}$. Beginnt sie bei $n = m$, klammere $q^m$ aus: $\sum_{n=m}^\infty q^n = \frac{q^m}{1 - q}$.

Zweitens: die Formel für $|q| \ge 1$ benutzen. Dann divergiert die Reihe, und $\frac{1}{1 - q}$ ist eine bedeutungslose Zahl. Mache deshalb immer erst zwei Prüfungen: Wo beginnt die Summe, und ist $|q| < 1$?`,
        q:{q:R`Darf man $\sum_{n=0}^\infty(-2)^n = \frac{1}{1 - (-2)} = \frac13$ schreiben?`,
          opts:[R`Ja, die Formel gilt für jedes $q \ne 1$.`, R`Nein, die Reihe divergiert für $|q| \ge 1$.`, R`Ja, weil sich die Vorzeichen abwechseln.`], a:1,
          ex:R`Die Teilsummen $1, -1, 3, -5, 11, \dots$ wachsen dem Betrag nach über alle Grenzen.`,
          fb:[R`Die endliche Formel gilt für $q \ne 1$, die unendliche nur für $|q| < 1$.`,
            '',
            R`Wechselnde Vorzeichen helfen nur, wenn die Summanden kleiner werden. Hier verdoppelt sich ihr Betrag.`]}}
    ]},

    /* ===== Abschnitt 3: Gauß-Integrale – Grundintegral, Parameter, Momente, Gauß-Dichte ===== */
    {id:'ma-t3', title:'Gauß-Integrale', steps:[
      {id:'ma-t3a', title:'Das Grundintegral: ein Umweg über die Ebene',
        num:{title:'Numerisch nachgeprüft', text:R`Eine Summe mit der Schrittweite $0{,}1$ von $-5$ bis $5$ gibt $\int e^{-x^2}dx \approx 1{,}77245$. Das ist $\sqrt\pi = 1{,}77245\ldots$ auf alle angegebenen Stellen. Schon bei $|x| = 3$ ist der Integrand nur noch $e^{-9} \approx 0{,}0001$.`},
        text:R`Die Gauß-Funktion $e^{-\alpha x^2}$ ist in der Quantenmechanik überall. Sie hat keine Stammfunktion aus elementaren Funktionen. Das Integral über die ganze Achse lässt sich trotzdem exakt ausrechnen, mit einem Umweg über zwei Dimensionen.

Sei $I = \int_{-\infty}^\infty e^{-x^2}dx$. Dann ist $I^2$ ein Doppelintegral über die Ebene. In Polarkoordinaten ist $x^2 + y^2 = r^2$ und $dx\,dy = r\,dr\,d\varphi$. Der zusätzliche Faktor $r$ macht das Integral elementar, denn $r\,e^{-r^2}$ hat die Stammfunktion $-\tfrac12e^{-r^2}$. Die Herleitung gibt $I^2 = \pi$, also $I = \sqrt\pi$.`,
        derive:{title:'Herleitung: Gauß-Integral über Polarkoordinaten', ctx:{coords:['x', 'y'], params:{α:'pos'}},
          lines:[
            {l:'(∫_-∞^∞ e^(-x^2) dx)^2 = ∫_-∞^∞ ∫_-∞^∞ e^(-x^2 - y^2) dx dy', w:'zweite Kopie mit y', why:{q:'Warum darf man das Quadrat als Doppelintegral schreiben?', opts:['weil der zweite Faktor mit $y$ statt $x$ dasselbe $I$ ist', 'weil $(\\int f)^2 = \\int f^2$ für jede Funktion gilt', 'weil das Integral von $x$ unabhängig ist und man quadrieren darf'], a:0, ex:'Der Name der Integrationsvariablen ist egal, und $e^{-x^2}e^{-y^2} = e^{-x^2 - y^2}$. $(\\int f)^2 = \\int f^2$ ist im Allgemeinen falsch.'}},
            {l:'= ∫_0^(2π) ∫_0^∞ e^(-r^2) r dr dφ', w:'Polarkoordinaten: dx dy = r dr dφ', why:{q:'Woher kommt der Faktor $r$?', opts:['aus dem Flächenelement in Polarkoordinaten', 'aus der Ableitung der Funktion $e^{-r^2}$', 'aus der Substitution $u = r^2$ im Exponenten'], a:0, ex:'$dx\\,dy = r\\,dr\\,d\\varphi$: Ein kleines Flächenstück in Polarkoordinaten hat die Kanten $dr$ und $r\\,d\\varphi$ (Jacobi-Determinante, M8).'}},
            {l:'= 2π · 1/2', w:'[−e^{−r²}/2]_0^∞ = 1/2', why:{q:'Woher kommt der Faktor $1/2$?', opts:['$\\int_0^\\infty re^{-r^2}dr = [-\\tfrac12e^{-r^2}]_0^\\infty$', '$\\int_0^\\infty e^{-r^2}dr = \\tfrac12$', 'aus der Hälfte des Winkelbereichs'], a:0, ex:'Die $\\varphi$-Integration gibt $2\\pi$, die $r$-Integration $\\tfrac12$. $\\int_0^\\infty e^{-r^2}dr$ ist $\\sqrt\\pi/2$, das brauchen wir hier nicht.'}},
            {l:'= π', w:'also I = √π', why:{q:'Was folgt für $I$ selbst?', opts:['$I = \\sqrt\\pi$, weil der Integrand positiv ist', '$I = \\pi$, weil das Doppelintegral schon $I$ ist', '$I = \\pm\\sqrt\\pi$, weil eine Wurzel zwei Vorzeichen hat'], a:0, ex:'$I^2 = \\pi$ und $I > 0$, also $I = \\sqrt\\pi$. Das Doppelintegral ist $I^2$, nicht $I$.'}}
          ]},
        q:{q:R`Warum rechnet man $I^2$ statt $I$ direkt aus?`,
          opts:[R`Weil $I$ negativ sein könnte und man das Vorzeichen loswerden will.`, R`Weil $e^{-x^2}$ keine elementare Stammfunktion hat, $r\,e^{-r^2}$ aber schon.`, R`Weil $I^2 = \int e^{-2x^2}dx$ einfacher ist.`], a:1,
          ex:R`In Polarkoordinaten bringt das Flächenelement den Faktor $r$. Dann ist $\int_0^\infty r\,e^{-r^2}dr = \tfrac12$ elementar.`,
          fb:[R`Der Integrand ist positiv, also ist $I > 0$. Um das Vorzeichen geht es nicht.`,
            '',
            R`$(\int f)^2 \ne \int f^2$: Das Quadrat eines Integrals ist ein Doppelintegral über zwei Variablen.`]}},
      {id:'ma-t3b', title:R`Mit Parameter: $\sqrt{\pi/\alpha}$`,
        num:{title:R`$\alpha = 4$`, text:R`$e^{-4x^2}$ ist halb so breit wie $e^{-x^2}$, bei gleicher Höhe $1$. Die Fläche halbiert sich:

$$\int_{-\infty}^\infty e^{-4x^2}dx = \sqrt{\frac\pi4} = \frac{\sqrt\pi}{2} \approx 0{,}886.$$`},
        text:R`Für $\alpha > 0$ setzt du $u = \sqrt\alpha\,x$. Dann ist $dx = du/\sqrt\alpha$, und die Grenzen bleiben $\pm\infty$ (Herleitung):

$$\int_{-\infty}^\infty e^{-\alpha x^2}dx = \sqrt{\frac{\pi}{\alpha}}.$$

Großes $\alpha$ macht die Glocke schmal und die Fläche klein. Eine Einheitenkontrolle schützt vor dem häufigen Fehler $\sqrt{\pi\alpha}$: Ist $x$ eine Länge, hat $\alpha$ die Einheit $1/\text{Länge}^2$. Das Integral hat die Einheit einer Länge, und $\sqrt{\pi/\alpha}$ ebenfalls.`,
        derive:{title:'Herleitung: Substitution', ctx:{coords:['x', 'y'], params:{α:'pos'}},
          lines:[
            {l:'∫_-∞^∞ e^(-α x^2) dx = 1/sqrt(α) ∫_-∞^∞ e^(-u^2) du', w:'u = √α x, dx = du/√α', why:{q:'Warum bleiben die Grenzen $\\pm\\infty$?', opts:['$u = \\sqrt\\alpha\\,x$ mit $\\alpha > 0$ bildet $\\pm\\infty$ auf $\\pm\\infty$ ab.', 'Grenzen ändern sich bei einer Substitution nie.', 'Weil $\\sqrt\\alpha$ beliebig groß sein darf.'], a:0, ex:'Bei endlichen Grenzen würden sie mitskaliert, zum Beispiel $x = 1 \\to u = \\sqrt\\alpha$.'}},
            {l:'= sqrt(π/α)', w:'Grundintegral', why:{q:'Welche Einheit hat das Ergebnis, wenn $x$ eine Länge ist?', opts:['eine Länge, wie $\\int dx$', 'keine, weil $e^{-\\alpha x^2}$ dimensionslos ist', 'Länge zum Quadrat'], a:0, ex:'$e^{-\\alpha x^2}$ ist dimensionslos, $dx$ trägt eine Länge. $\\sqrt{\\pi/\\alpha}$ hat mit $[\\alpha] = 1/\\text{Länge}^2$ ebenfalls die Einheit einer Länge.'}}
          ]},
        q:{q:R`$\int_{-\infty}^\infty e^{-x^2/2}dx$ ist …`,
          opts:[R`$\sqrt{2\pi}$`, R`$\sqrt{\pi/2}$`, R`$\sqrt\pi/2$`], a:0,
          ex:R`$\alpha = 1/2$, also $\sqrt{\pi/\alpha} = \sqrt{2\pi}$.`,
          fb:['',
            R`Das entsteht mit $\sqrt{\pi\alpha}$. Kleines $\alpha$ heißt breite Glocke und große Fläche.`,
            R`$\alpha$ steht unter der Wurzel im Nenner: $\sqrt{\pi/(1/2)} = \sqrt{2\pi}$.`]}},
      {id:'ma-t3c', title:'Momente: ungerade null, gerade durch Ableiten',
        num:{title:R`$\alpha = 1$`, text:R`$\int x\,e^{-x^2}dx = 0$, weil der Integrand ungerade ist. Für das zweite Moment leitest du $\sqrt{\pi/\alpha}$ nach $\alpha$ ab und setzt $\alpha = 1$:

$$\int_{-\infty}^\infty x^2e^{-x^2}dx = \frac{1}{2}\sqrt{\pi} \approx 0{,}886.$$`},
        text:R`Ungerade Potenzen geben null, $\int x^{2n+1}e^{-\alpha x^2}dx = 0$: Der Integrand ist ungerade, das Intervall symmetrisch, die Flächen links und rechts heben sich auf. Gerade Potenzen erhältst du durch **Ableiten nach dem Parameter**. Wegen $\frac{\partial}{\partial\alpha}e^{-\alpha x^2} = -x^2e^{-\alpha x^2}$ ist

$$\int_{-\infty}^\infty x^2e^{-\alpha x^2}dx = -\frac{d}{d\alpha}\sqrt{\frac\pi\alpha} = \frac{1}{2\alpha}\sqrt{\frac\pi\alpha}.$$

Noch einmal abgeleitet: $\int x^4e^{-\alpha x^2}dx = \frac{3}{4\alpha^2}\sqrt{\pi/\alpha}$. Steht im Exponenten zusätzlich ein linearer Term $bx$, hilft [[lex:quadratische-ergaenzung|quadratische Ergänzung]] (Beispiel nach dem Erklärteil).`,
        q:{q:R`Was ist $\int_{-\infty}^\infty x^3e^{-\alpha x^2}dx$?`,
          opts:[R`$\frac{3}{4\alpha^2}\sqrt{\pi/\alpha}$`, R`$\frac{1}{2\alpha^2}$`, R`$0$`], a:2,
          ex:R`$x^3e^{-\alpha x^2}$ ist ungerade, das Intervall symmetrisch.`,
          fb:[R`Das ist das vierte Moment, mit $x^4$.`,
            R`$\frac{1}{2\alpha^2}$ ist $\int_0^\infty x^3e^{-\alpha x^2}dx$, nur über die halbe Achse.`,
            '']}},
      {id:'ma-t3d', title:'Die Gauß-Dichte in vier Gestalten',
        num:{title:R`$\sigma = 1$`, text:R`Mit $\alpha = \tfrac{1}{2\sigma^2} = \tfrac12$ ist $\rho(x) = \tfrac{1}{\sqrt{2\pi}}e^{-x^2/2}$. Fläche: $\tfrac{1}{\sqrt{2\pi}}\sqrt{2\pi} = 1$. Zweites Moment: $\tfrac{1}{\sqrt{2\pi}}\cdot\tfrac{1}{2\alpha}\sqrt{\tfrac\pi\alpha} = \tfrac{1}{\sqrt{2\pi}}\cdot 1\cdot\sqrt{2\pi} = 1 = \sigma^2$.`},
        text:R`Teilt man die Glocke durch ihre Fläche, entsteht die Gauß-Dichte $\rho(x) = \sqrt{\alpha/\pi}\,e^{-\alpha x^2}$ mit $\int\rho\,dx = 1$. Aus dem zweiten Moment folgt $\langle x^2\rangle = \int x^2\rho\,dx = \frac{1}{2\alpha}$, gelesen „Mittelwert von $x^2$“. Schreibt man $\alpha = \frac{1}{2\sigma^2}$, wird daraus $\langle x^2\rangle = \sigma^2$.

Weil der Mittelwert hier $0$ ist, ist $\sigma = \sqrt{\langle x^2\rangle}$ die Standardabweichung (mehr dazu in M9): die typische Breite der Glocke. Die Tafel zeigt, wie dieselbe Glocke als Formel, als Bild, in Worten und in der Physik aussieht.`,
        reps:{obj:R`Die Gauß-Dichte mit $\sigma = 1$`,
          rows:[
            {k:'formel', tex:R`\begin{gathered}\rho(x) = \frac{1}{\sqrt{2\pi}\,\sigma}\,e^{-x^2/(2\sigma^2)}\\ \int\rho\,dx = 1,\qquad \langle x^2\rangle = \sigma^2\end{gathered}`},
            {k:'graph', plot:{x:[-4, 4], y:[0, 0.85], xlab:'x', ylab:R`\rho`, ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:1, lab:'1'}, {x:2, lab:'2'}]}, f:x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), lab:R`\sigma = 1`, f2:x => 2 * Math.exp(-2 * x * x) / Math.sqrt(2 * Math.PI), lab2:R`\sigma = 1/2`,
              cap:R`Halbes $\sigma$: halb so breit, doppelt so hoch, Fläche weiter 1. Bei $x = \pm\sigma$ ist die Kurve auf $e^{-1/2} \approx 61\,\%$ ihrer Höhe gefallen.`},
            {k:'worte', text:R`Eine Glocke um $0$; etwa zwei Drittel der Fläche liegen zwischen $-\sigma$ und $\sigma$.`},
            {k:'physik', text:R`**Ausblick (Thema 4 und 7):** Der Grundzustand des Oszillators und das Gaußsche Wellenpaket haben eine solche Dichte $|\psi(x)|^2$. Die Normierung $\int|\psi|^2dx = 1$ und die Breite $\sigma$ der Ortsverteilung rechnest du mit genau diesen Integralen.`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Höhe $\frac{1}{\sqrt{2\pi}\sigma}$ in der Mitte auftragen, Breite $\sigma$ nach beiden Seiten; bei $\pm\sigma$ ist der Wert auf $e^{-1/2}$ gefallen.`},
            {from:'graph', to:'worte', rule:R`Die Fläche zwischen $-\sigma$ und $\sigma$ abschätzen: rund $68\,\%$.`},
            {from:'worte', to:'physik', rule:R`„Breite der Glocke“ als Breite der Ortsverteilung lesen; in Thema 1 heißt sie Unschärfe $\Delta x$. Ein Teilchen mit dieser Dichte findet man meist innerhalb von etwa $\pm\sigma$ um die Mitte.`}
          ]},
        q:{q:R`Eine Gauß-Dichte hat $\alpha = 2$, also $\rho(x) = \sqrt{2/\pi}\,e^{-2x^2}$. Welche Breite $\sigma$ zeigt ihr Graph?`, tr:{from:'formel', to:'graph'},
          opts:[R`$\sigma = 2$`, R`$\sigma = \tfrac12$`, R`$\sigma = \tfrac14$`], a:1,
          ex:R`$\alpha = \frac{1}{2\sigma^2} = 2$ gibt $\sigma^2 = \tfrac14$, also $\sigma = \tfrac12$.`,
          fb:[R`Großes $\alpha$ heißt schmale Glocke, nicht breite: $\sigma^2 = \frac{1}{2\alpha}$.`,
            '',
            R`$\tfrac14$ ist $\sigma^2$; die Breite ist die Wurzel daraus.`]}},
      {id:'ma-t3e', title:'Typischer Fehler: Symmetrie, wo keine ist',
        num:{title:R`$\int x\,e^{-(x - 1)^2}dx$`, text:R`Mit $u = x - 1$ wird der Integrand $(u + 1)e^{-u^2}$:

$$\int_{-\infty}^\infty(u + 1)e^{-u^2}du = 0 + \sqrt\pi \approx 1{,}772.$$

Wer „ungerade, also null“ sagt, übersieht, dass die Glocke bei $x = 1$ sitzt.`},
        text:R`Die Regel „ungerade Potenz gibt null“ gilt nur, wenn die Glocke symmetrisch um den Ursprung liegt und über ein symmetrisches Intervall integriert wird. Sitzt die Glocke bei $x_0 \ne 0$, ist $x\,e^{-(x - x_0)^2}$ nicht ungerade. Dann verschiebst du zuerst mit $u = x - x_0$, und erst danach entscheidet die Symmetrie in $u$.

Prüfe Symmetrie deshalb immer am ganzen Integranden, nicht an einem Faktor. Ein zweiter Prüfstein ist die Einheit: $\sqrt{\pi/\alpha}$ hat die Einheit von $x$, $\sqrt{\pi\alpha}$ nicht.`,
        q:{q:R`Was ist $\int_{-\infty}^\infty x\,e^{-(x + 2)^2}dx$?`,
          opts:[R`$-2\sqrt\pi$`, R`$0$`, R`$2\sqrt\pi$`], a:0,
          ex:R`Mit $u = x + 2$ ist $x = u - 2$: $\int(u - 2)e^{-u^2}du = 0 - 2\sqrt\pi$. Die Glocke sitzt bei $x = -2$, der Mittelwert von $x$ ist negativ.`,
          fb:['',
            R`Der Integrand ist nicht ungerade: Die Glocke sitzt bei $x = -2$.`,
            R`Das Vorzeichen: Die Glocke sitzt links vom Ursprung, bei $x = -2$.`]}}
    ]},

    /* ===== Abschnitt 4: partielle Integration, Randterme, Fakultätsintegrale, Gammafunktion ===== */
    {id:'ma-t4', title:'Partielle Integration, Randterme und Fakultätsintegrale', steps:[
      {id:'ma-t4a', title:'Die integrierte Produktregel',
        num:{title:R`$\int_0^1 x\,e^x\,dx$`, text:R`Mit $f = x$ und $g' = e^x$, also $f' = 1$ und $g = e^x$:

$$\int_0^1x\,e^x\,dx = \big[x\,e^x\big]_0^1 - \int_0^1e^x\,dx = e - (e - 1) = 1.$$

Die Potenz $x$ ist beim Ableiten verschwunden.`},
        text:R`Die [[lex:partielle-integration|partielle Integration]] ist die integrierte Produktregel. Aus $(fg)' = f'g + fg'$ folgt

$$\int_a^bf\,g'\,dx = \big[f\,g\big]_a^b - \int_a^bf'\,g\,dx.$$

Sie lohnt sich, wenn $f'g$ einfacher ist als $fg'$, etwa wenn $f$ eine Potenz von $x$ ist, die beim Ableiten kleiner wird. Der Term $[fg]_a^b$, gelesen „$fg$ von $a$ bis $b$“, heißt **Randterm**. Er ist der Wert von $fg$ an der oberen Grenze minus den Wert an der unteren.`,
        q:{q:R`Was ist $\int_0^\pi x\cos x\,dx$?`,
          opts:[R`$-2$`, R`$2$`, R`$0$`], a:0,
          ex:R`$f = x$, $g' = \cos x$: $[x\sin x]_0^\pi - \int_0^\pi\sin x\,dx = 0 - 2$.`,
          fb:['',
            R`Das Minus vor dem Restintegral fehlt: $-\int_0^\pi\sin x\,dx = -2$.`,
            R`Der Randterm $[x\sin x]_0^\pi$ ist null, das Restintegral aber nicht: $\int_0^\pi\sin x\,dx = 2$.`]}},
      {id:'ma-t4b', title:'Randterme, die verschwinden',
        num:{title:R`$\psi = e^{-x^2/2}$ und $\phi = x\,e^{-x^2/2}$`, text:R`Hier ist $\phi' = (1 - x^2)e^{-x^2/2}$ und $\psi' = -x\,e^{-x^2/2}$. Mit den Gauß-Integralen aus Abschnitt 3:

$$\begin{aligned}\int\psi\,\phi'\,dx &= \int(1 - x^2)e^{-x^2}dx\\ &= \sqrt\pi - \tfrac{\sqrt\pi}{2} = \tfrac{\sqrt\pi}{2},\\ -\int\psi'\,\phi\,dx &= \int x^2e^{-x^2}dx = \tfrac{\sqrt\pi}{2}.\end{aligned}$$

Beide Seiten stimmen überein, denn der Randterm $[\psi\phi]_{-\infty}^\infty = [x\,e^{-x^2}]_{-\infty}^\infty$ ist null.`},
        text:R`In der Quantenmechanik verschwindet der Randterm sehr oft, und genau das macht viele Beweise kurz. Physikalische Wellenfunktionen gehen für $x \to \pm\infty$ gegen null; im Kasten (Thema 3) sind sie an den Wänden null. Dann gilt

$$\int\psi^*\,\phi'\,dx = -\int(\psi^*)'\,\phi\,dx.$$

Die Ableitung wandert von einer Funktion zur anderen und bringt ein Minus mit. Der Randterm darf aber nie stillschweigend wegfallen. Schreibe immer dazu, warum er null ist. Die Tafel zeigt den Randterm am Beispiel als Bild.`,
        reps:{obj:R`Partielle Integration mit $\psi = e^{-x^2/2}$ und $\phi = x\,e^{-x^2/2}$`,
          rows:[
            {k:'formel', tex:R`\int_{-\infty}^\infty\psi\,\phi'\,dx = \big[\psi\,\phi\big]_{-\infty}^\infty - \int_{-\infty}^\infty\psi'\,\phi\,dx`},
            {k:'graph', plot:{x:[-4, 4], y:[-0.55, 0.55], xlab:'x', ylab:R`\psi\phi`}, f:x => x * Math.exp(-x * x), lab:R`\psi\phi = x\,e^{-x^2}`,
              cap:R`Der Randterm ist $\psi\phi$ am rechten Rand minus $\psi\phi$ am linken Rand. Beide Enden der Kurve liegen auf der Achse: $[\psi\phi]_{-\infty}^\infty = 0 - 0$.`},
            {k:'worte', text:R`Die Ableitung von $\phi$ auf $\psi$ hinüberschieben, ein Minus davorsetzen – und begründen, dass $\psi\phi$ an beiden Enden verschwindet.`},
            {k:'physik', text:R`**Ausblick (Thema 6):** So zeigt man für den Impulsoperator $\hat p = -i\hbar\,d/dx$ die Gleichung $\int\psi^*(\hat p\phi)\,dx = \int(\hat p\psi)^*\phi\,dx$: Das Minus der partiellen Integration hebt sich gegen das Minus aus $(-i)^* = i$ weg.`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Das Produkt $\psi\phi$ zeichnen und seine Werte an den Integrationsgrenzen ablesen; die Differenz ist der Randterm.`},
            {from:'graph', to:'worte', rule:R`Liegen beide Enden auf der Achse, fällt der Randterm weg. Übrig bleibt: Ableitung hinüberschieben, Vorzeichen umdrehen.`},
            {from:'worte', to:'physik', rule:R`$\phi'$ durch $-i\hbar\,\phi'$ ersetzen und beim Hinüberschieben auch das $i$ konjugieren; dann stehen zwei Minuszeichen da, die sich aufheben.`}
          ]},
        q:{q:R`Für ein anderes Paar $f, g$ auf $[0, 1]$ zeigt der Graph von $fg$: bei $x = 0$ den Wert $0$, bei $x = 1$ den Wert $2$. Wie lautet $\int_0^1f\,g'\,dx$?`, tr:{from:'graph', to:'formel'},
          opts:[R`$-\int_0^1f'\,g\,dx$`, R`$-2 - \int_0^1f'\,g\,dx$`, R`$2 - \int_0^1f'\,g\,dx$`], a:2,
          ex:R`Der Randterm ist $[fg]_0^1 = 2 - 0 = 2$. Er verschwindet nur, wenn $fg$ an **beiden** Grenzen null ist.`,
          fb:[R`Der Randterm fehlt. Am rechten Rand ist $fg = 2$, nicht null.`,
            R`Der Randterm ist „oben minus unten“: $2 - 0 = +2$.`,
            '']}},
      {id:'ma-t4c', title:'Typischer Fehler: ein Randterm, der nicht verschwindet',
        num:{title:R`$\int_0^1x\,e^x\,dx$ und $e^{ikx}$`, text:R`Im ersten Schritt war $[x\,e^x]_0^1 = e$. Wer ihn weglässt, erhält $-\int_0^1e^x\,dx = 1 - e \approx -1{,}72$ statt $1$. Bei einer ebenen Welle hat $e^{ikx}$ für $x \to \infty$ gar keinen Grenzwert: $\cos kx$ schwingt ewig zwischen $-1$ und $1$.`},
        text:R`Der Randterm verschwindet nur, wenn das Produkt $fg$ an beiden Grenzen null ist. Bei Integralen über endliche Intervalle ist das meist nicht so, wie $\int_0^1x\,e^x\,dx$ zeigt. Auch bei Integralen über die ganze Achse musst du hinsehen: Funktionen, die im Unendlichen nicht abklingen, liefern keinen verschwindenden Randterm.

**Ausblick (Thema 4):** Die ebene Welle $e^{ikx}$ ist so eine Funktion. Dort hilft man sich mit Wellenpaketen oder mit einer anderen Art der Normierung (Abschnitt 5 und M6). Ein zweiter häufiger Fehler ist das vergessene Minus vor dem Restintegral.`,
        q:{q:R`Warum verschwindet der Randterm $[\psi^*\phi]_{-\infty}^{\infty}$ bei physikalischen Wellenfunktionen?`,
          opts:[R`Randterme verschwinden bei partieller Integration immer.`, R`Weil das Produkt $\psi^*\phi$ reell ist.`, R`Sie gehen für $x \to \pm\infty$ gegen null.`], a:2,
          ex:R`Streng genommen folgt das nicht schon aus der Normierbarkeit allein; für physikalische Wellenfunktionen setzt man es voraus.`,
          fb:[R`Nein: Bei $\int_0^1x\,e^x\,dx$ ist der Randterm $e$.`,
            R`Ein reelles Produkt kann am Rand durchaus von null verschieden sein.`,
            '']}},
      {id:'ma-t4d', title:R`Fakultätsintegrale: $\int_0^\infty x^ne^{-x}dx = n!$`,
        num:{title:R`$n = 1$ und $n = 2$`, text:R`$\int_0^\infty x\,e^{-x}dx = [-x\,e^{-x}]_0^\infty + \int_0^\infty e^{-x}dx = 0 + 1 = 1 = 1!$. Mit derselben Regel: $\int_0^\infty x^2e^{-x}dx = 2\int_0^\infty x\,e^{-x}dx = 2 = 2!$.`},
        text:R`Für das Wasserstoffatom (Thema 9) brauchst du Integrale der Form $\int_0^\infty x^ne^{-x}dx$. Partielle Integration mit $f = x^n$ und $g' = e^{-x}$ senkt die Potenz um eins. Der Randterm ist null: bei $x = 0$ wegen des Faktors $x^n$, für $x \to \infty$, weil $e^{-x}$ schneller fällt, als jede Potenz wächst. Wiederholt man den Schritt bis $\int_0^\infty e^{-x}dx = 1$, folgt

$$\int_0^\infty x^ne^{-x}dx = n!.$$

Mit $u = kx$ für $k > 0$ wird daraus $\int_0^\infty x^ne^{-kx}dx = n!/k^{n+1}$. Prüfe mit Einheiten: $x^n\,dx$ trägt $n + 1$ Längen, und $1/k$ ist eine Länge.`,
        derive:{ctx:{coords:['x'], params:{n:{int:[1, 5]}}},
          lines:[
            {l:'∫_0^∞ x^n e^(-x) dx = [-x^n e^(-x)]_0^∞ + n ∫_0^∞ x^(n-1) e^(-x) dx', w:'f = xⁿ, g′ = e^{−x}', why:{q:'Warum steht vor dem Restintegral ein Plus?', opts:['$-\\int f\'g\\,dx$ mit $g = -e^{-x}$ ergibt $+n\\int x^{n-1}e^{-x}dx$.', 'Bei partieller Integration steht immer $+\\int f\'g\\,dx$.', 'Weil man die Grenzen $0$ und $\\infty$ vertauscht hat.'], a:0, ex:'Die Regel hat ein Minus. Es trifft hier auf das Minus in der Stammfunktion $g = -e^{-x}$, zusammen ein Plus.'}},
            {l:'= n ∫_0^∞ x^(n-1) e^(-x) dx', w:'Randterm null an beiden Grenzen', why:{q:'Warum ist $[-x^ne^{-x}]_0^\\infty = 0$?', opts:['Bei $0$ wegen $x^n$, bei $\\infty$ fällt $e^{-x}$ schneller als $x^n$ wächst.', 'Randterme verschwinden bei partieller Integration immer.', 'Weil $e^{-x}$ bei $x = 0$ null ist.'], a:0, ex:'$e^0 = 1$, nicht $0$. Bei $x = 0$ sorgt der Faktor $x^n$ (mit $n \\ge 1$) für die Null.'}},
            {l:'∫_0^∞ x^3 e^(-x) dx = 3 · 2 · 1 ∫_0^∞ e^(-x) dx', w:'dreimal angewandt', why:{q:'Welches Integral bleibt am Ende übrig?', opts:['$\\int_0^\\infty e^{-x}dx = 1$', '$\\int_0^\\infty x\\,e^{-x}dx = 0$', '$\\int_0^\\infty e^{-x}dx = \\infty$'], a:0, ex:'$\\int_0^\\infty e^{-x}dx = [-e^{-x}]_0^\\infty = 0 - (-1) = 1$.'}},
            {l:'= 6', w:'3! = 6', why:{q:'Was ist allgemein $\\int_0^\\infty x^ne^{-x}dx$?', opts:['$n!$', '$n$', '$(n - 1)!$'], a:0, ex:'Jeder Schritt bringt einen Faktor: $n(n - 1)\\cdots 1 = n!$. $(n - 1)!$ ist $\\Gamma(n)$, also das Integral mit $x^{n-1}$.'}}
          ]},
        q:{q:R`$\int_0^\infty x^2e^{-3x}dx$ ist …`,
          opts:[R`$2/9$`, R`$2/27$`, R`$2/3$`], a:1,
          ex:R`$n!/k^{n+1} = 2!/3^3 = 2/27$.`,
          fb:[R`Das entsteht mit $1/k^n$ statt $1/k^{n+1}$. Zähle die Längen: $x^2\,dx$ trägt drei.`,
            '',
            R`Der Faktor $1/k$ steht hoch $n + 1 = 3$, nicht hoch 1.`]}},
      {id:'ma-t4e', title:'Die Gammafunktion verbindet Fakultät und Gauß',
        num:{title:R`$\Gamma(\tfrac12)$ und $\Gamma(\tfrac32)$`, text:R`Mit $t = u^2$, also $dt = 2u\,du$, ist

$$\Gamma(\tfrac12) = \int_0^\infty t^{-1/2}e^{-t}dt = 2\int_0^\infty e^{-u^2}du = \sqrt\pi.$$

Dann folgt $\Gamma(\tfrac32) = \tfrac12\Gamma(\tfrac12) = \tfrac{\sqrt\pi}{2} \approx 0{,}886$.`},
        text:R`Das Integral

$$\Gamma(s) = \int_0^\infty t^{s-1}e^{-t}dt$$

ist auch für nicht ganzzahliges $s > 0$ definiert. Es gilt $\Gamma(n + 1) = n!$, und dieselbe partielle Integration wie im letzten Schritt gibt $\Gamma(s + 1) = s\,\Gamma(s)$. Für $s = \tfrac12$ führt die Substitution $t = u^2$ auf das Gauß-Integral aus Abschnitt 3. Die [[lex:gammafunktion|Gammafunktion]] verbindet also beide Integraltypen. Achte auf die Verschiebung um eins: $\Gamma(n) = (n - 1)!$, nicht $n!$.`,
        q:{q:R`Was ist $\Gamma(\tfrac52)$?`,
          opts:[R`$\tfrac{3\sqrt\pi}{4}$`, R`$\tfrac{3\sqrt\pi}{2}$`, R`$\tfrac{5\sqrt\pi}{4}$`], a:0,
          ex:R`$\Gamma(\tfrac52) = \tfrac32\Gamma(\tfrac32) = \tfrac32\cdot\tfrac12\sqrt\pi$.`,
          fb:['',
            R`Ein Faktor fehlt: $\Gamma(\tfrac32) = \tfrac12\sqrt\pi$, nicht $\sqrt\pi$.`,
            R`Die Faktoren sind $\tfrac32$ und $\tfrac12$, nicht $\tfrac52$: $\Gamma(s + 1) = s\,\Gamma(s)$.`]}}
    ]},

    /* ===== Abschnitt 5: δ – Punktladung, δ-Folgen, Wirkung, Definition, Tafel, typischer Fehler ===== */
    {id:'ma-t5', title:'Die δ-Distribution: definiert durch ihre Wirkung', steps:[
      {id:'ma-t5a', title:'Eine Punktladung braucht eine neue Art Dichte',
        num:{title:'Immer schmalere Rechtecke', text:R`Ein Rechteck der Breite $2\varepsilon$ und der Höhe $\tfrac{1}{2\varepsilon}$ hat die Fläche $1$. Für $\varepsilon = 0{,}5;\ 0{,}1;\ 0{,}01$ ist die Höhe $1;\ 5;\ 50$. Die Fläche bleibt $1$, die Höhe wächst über alle Grenzen.`},
        text:R`Wie beschreibt man die Ladungsdichte einer Punktladung $q$ bei $x = a$? Die Dichte $\rho$ müsste überall null sein außer bei $a$ und trotzdem $\int\rho\,dx = q$ ergeben. Das kann keine gewöhnliche Funktion: Das Integral einer Funktion, die nur in einem einzigen Punkt nicht null ist, ist null.

Man nähert sich der Sache deshalb mit immer schmaleren Funktionen, deren Fläche fest bleibt. Die Funktionen selbst haben keinen sinnvollen Grenzwert, ihre Integrale aber schon. Diese Idee tragen die nächsten Schritte.`,
        q:{q:R`Ein Rechteck hat die Breite $0{,}02$ und die Fläche $1$. Wie hoch ist es?`,
          opts:[R`$0{,}02$`, R`$50$`, R`$1$`], a:1,
          ex:R`Fläche = Breite mal Höhe, also Höhe $= 1/0{,}02 = 50$.`,
          fb:[R`Breite und Höhe sind hier zueinander umgekehrt: $0{,}02\cdot h = 1$.`,
            '',
            R`Mit der Höhe $1$ wäre die Fläche nur $0{,}02$.`]}},
      {id:'ma-t5b', title:'δ-Folgen: schmale Spitzen mit Fläche 1',
        num:{title:R`Gauß-Form mit $\varepsilon = 0{,}5$`, text:R`$\delta_\varepsilon(x) = \frac{1}{\sqrt{2\pi}\,\varepsilon}e^{-x^2/(2\varepsilon^2)}$ hat bei $x = 0$ die Höhe $\frac{1}{\sqrt{2\pi}\cdot 0{,}5} \approx 0{,}80$. Auf halber Höhe ist sie $2\sqrt{2\ln 2}\,\varepsilon \approx 1{,}18$ breit. Ihre Fläche ist nach dem Gauß-Integral mit $\alpha = \frac{1}{2\varepsilon^2}$ genau $\frac{1}{\sqrt{2\pi}\varepsilon}\cdot\sqrt{2\pi}\,\varepsilon = 1$.`},
        text:R`Eine **δ-Folge** ist eine Familie schmaler Funktionen $\delta_\varepsilon$ mit Fläche 1, die für $\varepsilon \to 0$ immer schmaler werden. Drei Formen sind üblich: das Rechteck der Breite $2\varepsilon$ und Höhe $\tfrac{1}{2\varepsilon}$, die Gauß-Kurve aus dem Beispiel und die Lorentz-Kurve $\delta_\varepsilon(x) = \frac{\varepsilon}{\pi(x^2 + \varepsilon^2)}$.

Für $\varepsilon \to 0$ konvergieren die Funktionen nicht sinnvoll: Bei $x = 0$ wachsen sie über alle Grenzen, überall sonst gehen sie gegen null. Was dagegen konvergiert, zeigt der nächste Schritt.`,
        q:{q:R`Du halbierst bei der Gauß-Form $\varepsilon$. Was passiert mit Höhe und Fläche?`,
          opts:[R`Die Höhe verdoppelt sich, die Fläche bleibt 1.`, R`Die Höhe bleibt, die Fläche halbiert sich.`, R`Höhe und Fläche verdoppeln sich.`], a:0,
          ex:R`Die Höhe ist $\frac{1}{\sqrt{2\pi}\varepsilon}$, also umgekehrt proportional zu $\varepsilon$. Die Fläche ist für jedes $\varepsilon$ genau 1.`,
          fb:['',
            R`Bei fester Höhe würde die Fläche schrumpfen. Eine δ-Folge hält aber die Fläche fest, also muss die Spitze höher werden.`,
            R`Die Fläche ist bei jedem Glied der Folge 1; nur Höhe und Breite ändern sich.`]}},
      {id:'ma-t5c', title:'Die Wirkung unter dem Integral',
        num:{title:R`Rechteck mal $\cos x$`, text:R`Das Integral ist der Mittelwert von $\cos$ über $[-\varepsilon, \varepsilon]$:

$$\int_{-\varepsilon}^{\varepsilon}\frac{\cos x}{2\varepsilon}\,dx = \frac{\sin\varepsilon}{\varepsilon}:\qquad 0{,}959\ \text{bei}\ \varepsilon = 0{,}5,\quad 0{,}998\ \text{bei}\ \varepsilon = 0{,}1.$$

Es nähert sich $\cos 0 = 1$.`},
        text:R`Multiplizierst du eine δ-Folge mit einer stetigen Funktion $f$ und integrierst, greift die Spitze den Wert von $f$ an ihrer Stelle heraus:

$$\int\delta_\varepsilon(x - a)\,f(x)\,dx \to f(a)\qquad(\varepsilon \to 0).$$

Beim Rechteck siehst du es direkt: Das Integral ist der Mittelwert von $f$ über $[a - \varepsilon, a + \varepsilon]$. Im Labor ist die schmale Spitze $\delta_\varepsilon(x - a)$, die grüne Kurve $f$, und die helle Fläche ist das Produkt; ihr Inhalt ist das Integral. Die Anzeige vergleicht ihn mit $f(a)$. Die Herleitung rechnet zwei Formen mit $f = \cos x$ aus.`,
        fig:{lab:'delta', init:{form:'rect', eps:0.5}, caption:R`Rechteck-Form, $\varepsilon = 0{,}5$, $f = \cos x$: Die Anzeige gibt $0{,}959$ für das Integral und $1$ für $f(0)$. Verkleinere $\varepsilon$ (Regler unter „Mehr Regler“): Die Abweichung geht gegen null.`},
        derive:{title:R`Herleitung: zwei δ-Folgen mit $f(x) = \cos x$`, ctx:{coords:['x'], params:{ε:'pos'}},
          lines:[
            {l:'∫_-ε^ε cos(x)/(2ε) dx = sin(ε)/ε', w:'Rechteck: Mittelwert von cos über [−ε, ε]', why:{q:'Wie entsteht $\\sin\\varepsilon/\\varepsilon$?', opts:['$\\frac{1}{2\\varepsilon}[\\sin x]_{-\\varepsilon}^{\\varepsilon} = \\frac{2\\sin\\varepsilon}{2\\varepsilon}$', '$\\frac{1}{2\\varepsilon}[\\cos x]_{-\\varepsilon}^{\\varepsilon}$', 'aus der Taylor-Reihe $\\cos x \\approx 1$'], a:0, ex:'Die Stammfunktion von $\\cos$ ist $\\sin$, und $\\sin(-\\varepsilon) = -\\sin\\varepsilon$. Für $\\varepsilon \\to 0$ geht $\\sin\\varepsilon/\\varepsilon \\to 1 = \\cos 0$.'}},
            {l:'∫_-∞^∞ e^(-x^2/(2ε^2))/(sqrt(2π) ε) dx = 1', w:'Gauß-Folge hat Fläche 1', why:{q:'Warum hat die Gauß-Folge für jedes $\\varepsilon$ die Fläche 1?', opts:['Weil $\\int e^{-x^2/(2\\varepsilon^2)}dx = \\sqrt{2\\pi}\\,\\varepsilon$ den Vorfaktor aufhebt.', 'Weil ihre Höhe bei $x = 0$ gleich 1 ist.', 'Weil sie nur zwischen $-\\varepsilon$ und $\\varepsilon$ von null verschieden ist.'], a:0, ex:'Gauß-Integral mit $\\alpha = 1/(2\\varepsilon^2)$: $\\sqrt{\\pi/\\alpha} = \\sqrt{2\\pi}\\,\\varepsilon$. Die Höhe ist $1/(\\sqrt{2\\pi}\\varepsilon)$ und wächst, die Breite schrumpft.'}},
            {l:'∫_-∞^∞ e^(-x^2/(2ε^2))/(sqrt(2π) ε) cos(x) dx = e^(-ε^2/2)', w:'Gauß-Folge mal cos x', why:{q:'Was passiert mit $e^{-\\varepsilon^2/2}$ für $\\varepsilon \\to 0$?', opts:['Es geht gegen $1 = \\cos 0$.', 'Es geht gegen $0$.', 'Es wächst über alle Grenzen.'], a:0, ex:'Wie beim Rechteck: Der Grenzwert ist $f(0)$, unabhängig von der Form der Folge.'}}
          ]},
        q:{q:R`Gauß-Form, $f = \cos x$, $a = 0$: Das Integral ist $e^{-\varepsilon^2/2}$. Was liefert es für $\varepsilon \to 0$?`,
          opts:[R`$0$`, R`$1 = f(0)$`, R`einen Wert, der über alle Grenzen wächst`], a:1,
          ex:R`$e^{-\varepsilon^2/2} \to e^0 = 1 = \cos 0$, wie beim Rechteck. Der Grenzwert hängt nicht von der Form ab.`,
          fb:[R`Die Spitze wird schmaler, aber ihre Fläche bleibt 1. Das Integral geht gegen $f(0)$, nicht gegen null.`,
            '',
            R`Die Höhe der Spitze wächst, das Integral nicht: Es ist ein gewichteter Mittelwert von $f$ und bleibt beschränkt.`]}},
      {id:'ma-t5d', title:'Definition: δ ist durch seine Wirkung bestimmt',
        num:{title:R`$f(x) = x^2$, Spitze bei $2$`, text:R`$\int_{-\infty}^\infty\delta(x - 2)\,x^2\,dx = 2^2 = 4$. Über $[0, 5]$ integriert ebenfalls $4$, denn $2$ liegt im Inneren. Über $[0, 1]$ integriert: $0$, denn die Spitze liegt außerhalb.`},
        text:R`Die [[lex:delta-distribution|δ-Distribution]] ist durch genau diese Wirkung unter dem Integral definiert:

$$\int_{-\infty}^\infty\delta(x - a)\,f(x)\,dx = f(a)$$

für jede bei $a$ stetige Funktion $f$. Integrierst du nur über ein Intervall, kommt $f(a)$ heraus, wenn $a$ im Inneren liegt, und $0$, wenn $a$ außerhalb liegt. δ ist **keine Funktion** mit dem Wert „unendlich bei 0“; das ist nur ein Bild. Aus $\int\delta(x)\,dx = 1$ folgt die Einheit: Hat $x$ die Einheit Meter, hat $\delta(x)$ die Einheit $1/\text{m}$. Die Punktladungsdichte ist $\rho(x) = q\,\delta(x - a)$.`,
        q:{q:R`$\int_0^5\delta(x - 7)\,x^2\,dx$ ist …`,
          opts:[R`$49$`, R`$25$`, R`$0$`], a:2,
          ex:R`Die Spitze bei $x = 7$ liegt außerhalb von $[0, 5]$.`,
          fb:[R`$49$ wäre richtig, wenn man über die ganze Achse integriert.`,
            R`$25 = f(5)$: Die Spitze sitzt nicht am Rand, sondern bei $7$, außerhalb des Intervalls.`,
            '']}},
      {id:'ma-t5e', title:'δ in vier Gestalten',
        num:{title:'Im Labor', text:R`Stell „Form von δ_ε“ auf Gauß, „Testfunktion f“ auf $(1 + x)\,e^{-x^2}$, „Verschiebung a“ auf $1$ und „Breite ε“ auf $0{,}05$. Die Anzeige zeigt dann für das Integral $0{,}7358$, und $f(1) = 2/e \approx 0{,}7358$.`},
        text:R`Jetzt kennst du δ in mehreren Gestalten: als Spitze in Worten, als Grenzwert einer Folge im Graphen, als Regel unter dem Integral und als Anzeige im Labor. Keine dieser Gestalten ist δ allein. Die Spitze ist nur ein Bild, die Folge nur ein Weg dorthin; die Regel ist die Definition.

Übersetzen heißt hier vor allem: Das Bild einer schmalen Spitze bei $a$ mit Fläche 1 wird zur Regel „setze $a$ in $f$ ein“. Die Tafel zeigt auch, wofür die Physik δ braucht.`,
        reps:{obj:R`$\delta(x - a)$ mit $a = 1$`,
          rows:[
            {k:'worte', text:R`Eine unendlich schmale Spitze bei $x = 1$ mit der Fläche 1.`},
            {k:'graph', plot:{x:[-1, 3], y:[0, 4.2], xlab:'x', ylab:R`\delta_\varepsilon(x - 1)`, ticks:[{x:1, lab:'1'}, {x:2, lab:'2'}]}, f:x => Math.exp(-((x - 1) ** 2) / (2 * 0.01)) / (Math.sqrt(2 * Math.PI) * 0.1), lab:R`\varepsilon = 0{,}1`, f2:x => Math.exp(-((x - 1) ** 2) / (2 * 0.09)) / (Math.sqrt(2 * Math.PI) * 0.3), lab2:R`\varepsilon = 0{,}3`,
              cap:R`Zwei Glieder der Gauß-Folge. Beide haben die Fläche 1; die schmalere ist dreimal so hoch.`},
            {k:'formel', tex:R`\int_{-\infty}^\infty\delta(x - 1)\,f(x)\,dx = f(1)`},
            {k:'labor', text:R`„Verschiebung a“ auf $1$, „Breite ε“ klein: Die Anzeige für $\int\delta_\varepsilon(x - a)f(x)\,dx$ nähert sich $f(1)$, für jede „Form von δ_ε“.`},
            {k:'physik', text:R`**Ausblick (Thema 5 und 6):** Ein Teilchen, das sicher bei $x_0$ ist, hätte die „Wellenfunktion“ $\delta(x - x_0)$, einen Ortseigenzustand. Sie ist nicht normierbar und deshalb kein physikalischer Zustand, als Grenzfall aber unentbehrlich. Das δ-Potential $-\alpha\,\delta(x)$ beschreibt eine sehr schmale, tiefe Mulde.`}
          ],
          links:[
            {from:'worte', to:'graph', rule:R`Die Spitze durch ein Glied der Folge ersetzen: Mitte bei $1$, Breite $\varepsilon$, Höhe so, dass die Fläche 1 bleibt.`},
            {from:'graph', to:'formel', rule:R`Statt Werte der Kurve abzulesen, die Fläche unter $\delta_\varepsilon\cdot f$ bilden und $\varepsilon \to 0$ gehen lassen. Übrig bleibt $f$ an der Stelle der Spitze.`},
            {from:'formel', to:'labor', rule:R`$a$ auf „Verschiebung a“ stellen, $f$ als „Testfunktion f“ wählen; die Anzeige ist die linke Seite bei endlichem $\varepsilon$.`},
            {from:'labor', to:'physik', rule:R`Die Spitze als Aufenthaltsort lesen: ganz scharf bei $x_0$ heißt Breite null – und Breite null gibt es nur als Grenzwert, nicht als Zustand.`}
          ]},
        q:{q:R`Im Labor: „Testfunktion f“ auf $\cos x$, „Verschiebung a“ auf $-2$, „Breite ε“ auf $0{,}05$. Welchen Wert zeigt die Anzeige für das Integral ungefähr?`, tr:{from:'labor', to:'formel'},
          opts:[R`$\cos 0 = 1$`, R`$\cos 2 \approx -0{,}42$`, R`$0$, weil die Spitze bei $-2$ sitzt`], a:1,
          ex:R`Die Spitze sitzt bei $a = -2$ und greift $f(-2) = \cos(-2) = \cos 2 \approx -0{,}416$ heraus.`,
          fb:[R`$1 = f(0)$ wäre richtig, wenn die Spitze bei $0$ säße. Sie sitzt bei $a = -2$.`,
            '',
            R`Die Spitze liegt im angezeigten Bereich; sie greift den Wert $f(-2)$ heraus, und der ist nicht null.`]}},
      {id:'ma-t5f', title:'Typischer Fehler: δ wie eine Funktion behandeln',
        num:{title:R`$\int\delta_\varepsilon^2\,dx$`, text:R`Für die Gauß-Folge ist $\int\delta_\varepsilon(x)^2\,dx = \frac{1}{2\sqrt\pi\,\varepsilon}$: bei $\varepsilon = 0{,}1$ etwa $2{,}8$, bei $\varepsilon = 0{,}01$ etwa $28$. Für $\varepsilon \to 0$ wächst das über alle Grenzen. „$\delta(x)^2$“ hat deshalb keinen Sinn.`},
        text:R`Der typische Fehler ist, δ wie eine gewöhnliche Funktion zu behandeln und Werte an der Spitze einzusetzen. Ausdrücke wie $\delta(0)$ oder $\delta(x)^2$ haben keinen Sinn; das Beispiel zeigt, warum. Auch das Bild „eine Funktion, die bei 0 unendlich ist“ führt in die Irre: Zwei solche „Funktionen“ mit verschiedener Fläche wären nicht zu unterscheiden.

Rechne mit δ deshalb nur unter dem Integral, gegen eine stetige Funktion, und nur mit den Regeln des nächsten Abschnitts. Die Prüffrage lautet immer: Was ergibt das Integral mit einer Testfunktion?`,
        q:{q:R`Was ist $3\,\delta(x)$, verglichen mit $\delta(x)$?`,
          opts:['dreimal so stark, weil $\\int 3\\delta(x)f(x)\\,dx = 3f(0)$', 'dasselbe, weil beide bei $0$ unendlich sind', 'nicht definiert, weil $\\delta$ keine Funktion ist'], a:0,
          ex:R`Unterschieden werden δ-Ausdrücke durch ihre Wirkung unter dem Integral. $3\delta(x)$ greift das Dreifache von $f(0)$ heraus.`,
          fb:['',
            R`Gerade das zeigt, dass „unendlich bei 0“ kein brauchbares Bild ist: Unter dem Integral unterscheiden sich beide um den Faktor 3.`,
            R`Ein Vielfaches von δ ist definiert, eben durch seine Wirkung: $\int 3\delta(x)f(x)\,dx = 3f(0)$.`]}}
    ]},

    /* ===== Abschnitt 6: Rechenregeln für δ ===== */
    {id:'ma-t6', title:'Rechenregeln für δ', steps:[
      {id:'ma-t6a', title:R`Skalierung: $\delta(cx) = \delta(x)/c$ für $c > 0$`,
        num:{title:R`Rechteck mit $c = 2$`, text:R`Das Rechteck $\delta_\varepsilon(x)$ hat die Breite $2\varepsilon$ und die Höhe $\tfrac{1}{2\varepsilon}$. $\delta_\varepsilon(2x)$ ist nur für $|x| < \varepsilon/2$ von null verschieden: halb so breit, gleich hoch. Seine Fläche ist $\varepsilon\cdot\tfrac{1}{2\varepsilon} = \tfrac12$.`},
        text:R`Alle Regeln für δ beweist du auf dieselbe Weise: Schreibe die Behauptung unter ein Integral mit einer Testfunktion $f$ und forme um, meist durch Substitution. Für $c > 0$ setzt du $u = cx$, also $dx = du/c$; die Grenzen bleiben $\pm\infty$ (Herleitung):

$$\int\delta(cx)\,f(x)\,dx = \frac1c\int\delta(u)\,f(u/c)\,du = \frac{f(0)}{c}.$$

Also ist $\delta(cx) = \delta(x)/c$ für $c > 0$. Anschaulich wie im Beispiel: $\delta_\varepsilon(cx)$ ist $c$-mal schmaler bei gleicher Höhe und hat deshalb die Fläche $1/c$.`,
        derive:{ctx:{coords:['x'], params:{c:'pos'}, abstract:{f:{args:['x']}}},
          lines:[
            {l:'∫_-∞^∞ δ(c x) f(x) dx = 1/c ∫_-∞^∞ δ(u) f(u/c) du', w:'u = cx, dx = du/c', why:{q:'Woher kommt der Faktor $1/c$?', opts:['aus $dx = du/c$', 'aus $\\delta(u) = \\delta(cx)/c$, einer eigenen Regel', 'aus der Höhe der Spitze'], a:0, ex:'Nur die Substitution wird benutzt; die Regel für $\\delta(cx)$ ist das Ergebnis, nicht die Voraussetzung.'}},
            {l:'= f(0)/c', w:'Definition von δ, Spitze bei u = 0', why:{q:'Warum steht $f(0)$ und nicht $f(u/c)$?', opts:['Weil δ(u) die übrige Funktion bei $u = 0$ auswertet.', 'Weil $u/c$ für große $c$ ungefähr null ist.', 'Weil $f$ hier eine Konstante sein muss.'], a:0, ex:'$\\int\\delta(u)\\,g(u)\\,du = g(0)$ mit $g(u) = f(u/c)$, also $g(0) = f(0)$.'}}
          ]},
        q:{q:R`$\int_{-\infty}^\infty\delta(3x)\,\cos x\,dx$ ist …`,
          opts:[R`$3$`, R`$1/3$`, R`$1$`], a:1,
          ex:R`$\delta(3x) = \tfrac13\delta(x)$ und $\cos 0 = 1$.`,
          fb:[R`$\delta(3x)$ ist schmaler, nicht höher: Die Fläche schrumpft auf $\tfrac13$.`,
            '',
            R`Der Faktor $1/c$ aus $dx = du/3$ fehlt.`]}},
      {id:'ma-t6b', title:R`Negativer Faktor: $\delta(-x) = \delta(x)$`,
        num:{title:R`$\int\delta(-2x)\,e^x\,dx$`, text:R`Mit $u = -2x$ ist $dx = -du/2$, und die Grenzen vertauschen sich. Zurückgetauscht hebt sich das Minus auf:

$$\int_{-\infty}^\infty\delta(-2x)\,e^x\,dx = \frac12\int_{-\infty}^\infty\delta(u)\,e^{-u/2}\,du = \frac12.$$`},
        text:R`Für einen negativen Faktor, also $\delta(-cx)$ mit $c > 0$, setzt du $u = -cx$. Dann vertauschen sich die Grenzen: $x \to +\infty$ heißt $u \to -\infty$. Das Zurücktauschen gibt ein Minus, das das Minus aus $dx = -du/c$ aufhebt. Wieder kommt $f(0)/c$ heraus (Herleitung). Zusammen mit dem letzten Schritt:

$$\delta(cx) = \frac{\delta(x)}{|c|},\qquad \delta(-x) = \delta(x).$$

δ ist also gerade, und ein Faktor im Argument wird nie zu einem negativen Vorfaktor vor δ.`,
        derive:{ctx:{coords:['x'], params:{c:'pos'}, abstract:{f:{args:['x']}}},
          lines:[
            {l:'∫_-∞^∞ δ(-c x) f(x) dx = 1/c ∫_-∞^∞ δ(u) f(-u/c) du', w:'u = −cx: Grenzen tauschen, zwei Minus heben sich auf', why:{q:'Warum steht hier $1/c$ und nicht $-1/c$?', opts:['Das Minus aus $dx = -du/c$ hebt sich mit dem Vertauschen der Grenzen auf.', 'Das Minus darf man streichen, weil $\\delta(-x) = \\delta(x)$ gerade ist.', 'Ein Integral über $\\delta(u)$ ist nie negativ, also fällt das Minus weg.'], a:0, ex:'Für $x \\to +\\infty$ geht $u \\to -\\infty$. Das Zurücktauschen der Grenzen bringt ein Minus, das das Minus aus $dx$ aufhebt. $\\delta(-x) = \\delta(x)$ ist das Ergebnis dieser Rechnung. Und negative Integrale über δ gibt es sehr wohl, etwa $\\int\\delta(x)(-1)\\,dx = -1$.'}},
            {l:'= f(0)/c', w:'also δ(cx) = δ(x)/|c|', why:{q:'Was folgt aus beiden Rechnungen zusammen?', opts:['$\\delta(cx) = \\delta(x)/|c|$ für jedes $c \\neq 0$', '$\\delta(cx) = |c|\\,\\delta(x)$', '$\\delta(cx) = \\delta(x)/c$, auch mit Vorzeichen'], a:0, ex:'Für $c > 0$ und $c < 0$ kommt jeweils $f(0)/|c|$ heraus. $\\delta(cx)$ ist also nie ein negatives Vielfaches von $\\delta(x)$.'}}
          ]},
        q:{q:R`Was ist $\int_{-\infty}^\infty\delta(-4x)\,(1 + x)\,dx$?`,
          opts:[R`$-\tfrac14$`, R`$4$`, R`$\tfrac14$`], a:2,
          ex:R`$\delta(-4x) = \tfrac14\delta(x)$ und $1 + 0 = 1$.`,
          fb:[R`Das Minus im Argument erscheint nicht als Vorfaktor: Es gilt $\delta(cx) = \delta(x)/|c|$ mit dem Betrag.`,
            R`$\delta(-4x)$ ist schmaler, nicht höher; der Faktor ist $\tfrac14$.`,
            '']}},
      {id:'ma-t6c', title:'Spitzen dort, wo das Argument null wird',
        num:{title:R`$\delta(2x - 1)$ und $\delta(x^2 - 4)$`, text:R`$\delta(2x - 1) = \delta\big(2(x - \tfrac12)\big) = \tfrac12\delta(x - \tfrac12)$, also $\int\delta(2x - 1)\,e^x\,dx = \tfrac12e^{1/2} \approx 0{,}824$. Bei $g(x) = x^2 - 4$ wird das Argument an zwei Stellen null, bei $\pm2$, mit $|g'(\pm2)| = 4$: $\delta(x^2 - 4) = \tfrac14\left[\delta(x - 2) + \delta(x + 2)\right]$.`},
        text:R`Bei einem verschobenen Argument klammerst du den Faktor aus: $\delta(cx - d) = \frac{1}{|c|}\delta(x - d/c)$. Die Spitze sitzt dort, wo das Argument null wird, bei $x = d/c$. Allgemeiner gilt für eine Funktion $g$ mit einfachen Nullstellen $x_i$

$$\delta(g(x)) = \sum_i\frac{\delta(x - x_i)}{|g'(x_i)|}.$$

Jede Nullstelle trägt eine Spitze bei. Ihre Fläche ist umso kleiner, je steiler $g$ dort durch null geht: Ein steiles $g$ verweilt nur kurz in der Nähe von null. Die Tafel zeigt das am Beispiel $x^2 - 4$.`,
        reps:{obj:R`$\delta(x^2 - 4)$`,
          rows:[
            {k:'worte', text:R`Zwei Spitzen, bei $x = 2$ und $x = -2$, wo $x^2 - 4$ null wird. Jede hat die Fläche $\tfrac14$.`},
            {k:'formel', tex:R`\begin{aligned}\delta(x^2 - 4) &= \frac{\delta(x - 2)}{|2\cdot 2|} + \frac{\delta(x + 2)}{|2\cdot(-2)|}\\ &= \tfrac14\big[\delta(x - 2) + \delta(x + 2)\big]\end{aligned}`},
            {k:'graph', plot:{x:[-3.5, 3.5], y:[0, 1], xlab:'x', ylab:R`\delta_\varepsilon(x^2 - 4)`, ticks:[{x:-2, lab:'-2'}, {x:2, lab:'2'}]}, f:x => Math.exp(-((x * x - 4) ** 2) / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.5), lab:R`\varepsilon = 0{,}5`,
              cap:R`Die Gauß-Folge mit dem Argument $x^2 - 4$: zwei schmale Spitzen, jede ungefähr mit der Fläche $\tfrac14$. Ihre Breite ist etwa $\varepsilon/|g'(\pm2)| = \varepsilon/4$.`},
            {k:'mathe', text:R`Unter dem Integral: $\int\delta(x^2 - 4)\,f(x)\,dx = \tfrac14\left[f(2) + f(-2)\right]$.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Nullstellen $x_i$ des Arguments suchen, an jeder die Steigung $|g'(x_i)|$ bestimmen und je eine Spitze $\delta(x - x_i)/|g'(x_i)|$ hinschreiben.`},
            {from:'formel', to:'graph', rule:R`δ durch ein Glied der Folge ersetzen und $g(x)$ einsetzen: Bei jeder Nullstelle entsteht eine Spitze der Breite $\varepsilon/|g'(x_i)|$.`},
            {from:'graph', to:'mathe', rule:R`Jede Spitze greift $f$ an ihrer Stelle heraus, gewichtet mit ihrer Fläche $1/|g'(x_i)|$; die Beiträge addieren sich.`}
          ]},
        q:{q:R`Wo sitzen die Spitzen von $\delta(x^2 - 9)$, und welche Fläche hat jede?`, tr:{from:'formel', to:'graph'},
          opts:[R`bei $\pm3$, je $\tfrac19$`, R`bei $9$, Fläche $1$`, R`bei $\pm3$, je $\tfrac16$`], a:2,
          ex:R`Nullstellen $\pm3$, Steigung $|g'(\pm3)| = |2\cdot(\pm3)| = 6$.`,
          fb:[R`Geteilt wird durch die Steigung $|g'(x_i)| = 6$, nicht durch $x_i^2 = 9$.`,
            R`Die Spitzen sitzen dort, wo das Argument $x^2 - 9$ null wird, nicht bei $x = 9$.`,
            '']}},
      {id:'ma-t6d', title:'Mal einer Funktion, und die Stufenfunktion',
        num:{title:R`$x\,\delta(x)$ und $\Theta'$`, text:R`$\int x\,\delta(x)\cos x\,dx = 0\cdot\cos 0 = 0$, also ist $x\,\delta(x) = 0$. Für die Stufe $\Theta$ gibt partielle Integration mit $f = e^{-x^2}$:

$$\begin{aligned}&\int_{-\infty}^\infty\Theta'(x)\,e^{-x^2}dx\\ &= \big[\Theta\,e^{-x^2}\big]_{-\infty}^\infty - \int_0^\infty(-2x)e^{-x^2}dx\\ &= 0 + 1 = 1 = f(0).\end{aligned}$$`},
        text:R`Steht vor δ eine stetige Funktion $g$, darfst du sie an der Spitze auswerten: $g(x)\,\delta(x - a) = g(a)\,\delta(x - a)$. Insbesondere ist $x\,\delta(x) = 0$.

Die [[lex:stufenfunktion|Stufenfunktion]] $\Theta(x)$ springt bei $0$ von $0$ auf $1$. Mit partieller Integration zeigst du $\int\Theta'f\,dx = f(0)$ für jede abklingende Funktion $f$, also $\Theta'(x) = \delta(x)$. Ein Sprung in einer Funktion gibt eine δ-Spitze in ihrer Ableitung. **Ausblick (Thema 5):** Beim δ-Potential hat deshalb die Ableitung $\psi'$ der Wellenfunktion einen Sprung, $\psi$ selbst aber nicht.`,
        q:{q:R`Was ist $(x^2 + 1)\,\delta(x - 2)$?`,
          opts:[R`$5\,\delta(x - 2)$`, R`$(x^2 + 1)\,\delta(0)$`, R`$\delta(x - 2)$`], a:0,
          ex:R`Die Funktion vor δ wird an der Spitze ausgewertet: $2^2 + 1 = 5$.`,
          fb:['',
            R`$\delta(0)$ hat keinen Sinn. Ausgewertet wird die Funktion vor δ, nicht δ selbst.`,
            R`Der Vorfaktor verschwindet nicht; er wird an der Stelle $x = 2$ ausgewertet.`]}},
      {id:'ma-t6e', title:R`Typischer Fehler: $\delta(2x) = 2\delta(x)$`,
        num:{title:'Schmaler ist nicht höher', text:R`Ein Rechteck der Breite $2\varepsilon$ und Höhe $\tfrac{1}{2\varepsilon}$, gestaucht um den Faktor 2: Breite $\varepsilon$, Höhe unverändert, Fläche $\tfrac12$. Wer $\delta(2x) = 2\delta(x)$ schreibt, verdoppelt die Höhe, statt die Breite zu halbieren – ein Fehler um den Faktor 4.`},
        text:R`Der häufigste Fehler mit δ ist, „schmaler“ mit „höher“ zu verwechseln. Ein Faktor im Argument staucht die Spitze nur waagerecht. Ihre Höhe bleibt, ihre Fläche schrumpft. Deshalb steht in $\delta(cx) = \delta(x)/|c|$ der Faktor im Nenner.

Für jede Rechnung mit δ hilft eine kurze Prüfliste. Erstens: Wo wird das Argument null, und liegt diese Stelle im Integrationsbereich? Zweitens: Welcher Faktor $1/|c|$ bzw. $1/|g'(x_i)|$ kommt hinzu? Drittens: Erst dann $f$ an der Spitze auswerten.`,
        q:{q:R`$\int_0^\infty\delta(3x - 6)\,x\,dx$ ist …`,
          opts:[R`$\tfrac23$`, R`$2$`, R`$6$`], a:0,
          ex:R`Spitze bei $x = 2$, im Bereich; Faktor $\tfrac13$; $f(2) = 2$. Zusammen $\tfrac23$.`,
          fb:['',
            R`Der Faktor $\tfrac{1}{|c|} = \tfrac13$ fehlt.`,
            R`Hier wurde mit $3$ multipliziert statt durch $3$ geteilt: Schmaler heißt kleinere Fläche.`]}}
    ]}
  ],
  example:{
    title:'Gauß-Integral mit quadratischer Ergänzung',
    text:'Berechne $\\int_{-\\infty}^{\\infty} e^{-\\alpha x^2 + bx}\\,dx$ für $\\alpha > 0$ und reelles $b$. Dieses Integral kommt bei Wellenpaketen und Fourier-Transformationen ständig vor.',
    ctx:CTX.line({params:{α:'pos', b:'real', m:'pos'}}),
    lines:[
      {l:'∫_-∞^∞ e^(-α x^2 + b x) dx = ∫_-∞^∞ e^(-α (x - b/(2α))^2 + b^2/(4α)) dx', why:{q:'Was passiert im Exponenten?', opts:['quadratische Ergänzung zu $-\\alpha(x - c)^2 + \\text{const}$', 'Ausklammern von $\\alpha$ aus beiden Termen', 'Substitution $u = x^2$ im Exponenten'], a:0, ex:'$-\\alpha x^2 + bx = -\\alpha(x - \\frac{b}{2\\alpha})^2 + \\frac{b^2}{4\\alpha}$. Ausmultiplizieren der rechten Seite gibt wieder $-\\alpha x^2 + bx$.'}},
      {l:'= e^(b^2/(4α)) ∫_-∞^∞ e^(-α (x - b/(2α))^2) dx', why:{q:'Warum darf $e^{b^2/(4\\alpha)}$ vor das Integral?', opts:['Der Faktor hängt nicht von $x$ ab.', 'Weil $e^{b^2/(4\\alpha)} \\approx 1$ für kleine $b$ ist.', 'Weil sich Exponenten beim Integrieren addieren.'], a:0, ex:'$e^{u+v} = e^u e^v$, und konstante Faktoren zieht man heraus. Genähert wird hier nichts.'}},
      {l:'= e^(b^2/(4α)) ∫_-∞^∞ e^(-α u^2) du', w:'u = x − b/(2α)', why:{q:'Warum ändern sich die Grenzen nicht?', opts:['Eine Verschiebung bildet $(-\\infty, \\infty)$ auf sich ab.', 'Grenzen ändern sich bei Substitution nie.', 'Weil $du = dx/(2\\alpha)$ ist.'], a:0, ex:'Mit $u = x - c$ ist $du = dx$, und $\\pm\\infty$ bleibt $\\pm\\infty$. Bei endlichen Grenzen würden sie mitverschoben.'}},
      {l:'= sqrt(π/α) e^(b^2/(4α))', why:{q:'Welche Formel wird benutzt?', opts:['$\\int_{-\\infty}^\\infty e^{-\\alpha u^2}du = \\sqrt{\\pi/\\alpha}$', '$\\int_{-\\infty}^\\infty e^{-\\alpha u}du = 1/\\alpha$', '$\\int_{-\\infty}^\\infty u\\,e^{-\\alpha u^2}du = 0$'], a:0, ex:'Das Gauß-Integral. Die Formel gilt auch für komplexes $b$ – das nutzt die Lückenaufgabe. Dann verschiebt $u = x - b/(2\\alpha)$ den Integrationsweg in die komplexe Ebene; nach dem Cauchy\'schen Integralsatz ändert das den Wert nicht, weil $e^{-\\alpha x^2}$ an den Enden verschwindet.'}}
    ],
    faded:{id:'ma-fade', title:'Jetzt du: Gauß-Funktion mal Kosinus',
      text:'Berechne $I = \\int_{-\\infty}^\\infty e^{-x^2/2}\\cos(kx)\\,dx$ für reelles $k$. Weil $e^{-x^2/2}$ reell ist, gilt $I = \\operatorname{Re}\\int e^{-x^2/2 + ikx}dx$. Benutze die Formel aus dem Beispiel mit $\\alpha = 1/2$ und $b = ik$.',
      ctx:{coords:['x'], params:{k:'real'}},
      given:['I = ∫_-∞^∞ e^(-x^2/2) cos(k x) dx', '= Re(∫_-∞^∞ e^(-x^2/2 + i k x) dx)'],
      goals:[{id:'a', prompt:'Bestimme $I$.', type:'value', target:'sqrt(2π) e^(-k^2/2)', points:2, hints:['Vergleiche den Exponenten mit $-\\alpha x^2 + bx$ aus dem Beispiel: Welche Werte haben $\\alpha$ und $b$? Dann in die Ergebnisformel einsetzen.', '$\\alpha = 1/2$ und $b = ik$; damit ist $\\sqrt{\\pi/\\alpha} = \\sqrt{2\\pi}$.', '$b^2/(4\\alpha) = (ik)^2/2 = -k^2/2$.'],
        model:['I = ∫_-∞^∞ e^(-x^2/2) cos(k x) dx', '= Re(∫_-∞^∞ e^(-x^2/2 + i k x) dx)', {l:'= Re(sqrt(2π) e^((ik)^2/2))', gap:'= Re(sqrt(2π) e^(▢))'}, '= sqrt(2π) e^(-k^2/2)'],
        mistakes:[{expr:'sqrt(2π) e^(k^2/2)', msg:'Vorzeichen: $(ik)^2 = i^2k^2 = -k^2$.'}, {expr:'sqrt(π/2) e^(-k^2/2)', msg:'Prüfe $\\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/2$: $\\sqrt{\\pi/(1/2)} = \\sqrt{2\\pi}$.'}]}]}
  },
  puzzle:{
    title:'Die Ableitung einer δ-Folge',
    text:'Nimm die Gauß-Folge $\\delta_\\varepsilon(x) = e^{-x^2/(2\\varepsilon^2)}/(\\sqrt{2\\pi}\\,\\varepsilon)$ aus Abschnitt 5 und leite sie nach $x$ ab. $\\delta_\\varepsilon\'(x)$ ist ein positiver Buckel links von $0$ und ein negativer rechts davon. Wird $\\varepsilon$ kleiner, werden beide Buckel höher und rücken zusammen.\n\nWas ergibt $\\int_{-\\infty}^{\\infty}\\delta_\\varepsilon\'(x)\\,f(x)\\,dx$ für eine glatte, beschränkte Funktion $f$, wenn $\\varepsilon \\to 0$ geht?',
    q:{q:'Deine Vermutung:', opts:['$f\'(0)$', '$-f\'(0)$', '$0$, weil $\\delta_\\varepsilon\'$ ungerade ist', 'Es wächst über alle Grenzen.'], a:1, ex:'Partielle Integration: $\\int\\delta_\\varepsilon\'f\\,dx = [\\delta_\\varepsilon f] - \\int\\delta_\\varepsilon f\'\\,dx \\to -f\'(0)$.'},
    reveal:'Partielle Integration (Abschnitt 4) schiebt die Ableitung auf $f$:\n\n$$\\int_{-\\infty}^{\\infty}\\delta_\\varepsilon\'(x)\\,f(x)\\,dx = \\big[\\delta_\\varepsilon f\\big]_{-\\infty}^{\\infty} - \\int_{-\\infty}^{\\infty}\\delta_\\varepsilon(x)\\,f\'(x)\\,dx.$$\n\nDer Randterm ist null, weil die Gauß-Funktion im Unendlichen verschwindet. Das Restintegral geht nach Abschnitt 5 gegen $f\'(0)$. Also gilt $\\int\\delta_\\varepsilon\'f\\,dx \\to -f\'(0)$. Man **definiert** deshalb die Ableitung der δ-Distribution durch $\\int\\delta\'(x)f(x)\\,dx = -f\'(0)$.\n\nProbe mit $f(x) = x$: Es ist $\\delta_\\varepsilon\'(x) = -\\frac{x}{\\varepsilon^2}\\delta_\\varepsilon(x)$. Mit $\\int x^2\\delta_\\varepsilon\\,dx = \\varepsilon^2$ (Abschnitt 3, Standardabweichung $\\varepsilon$) folgt $\\int\\delta_\\varepsilon\'(x)\\,x\\,dx = -1$ für jedes $\\varepsilon$. Die Ungeradheit von $\\delta_\\varepsilon\'$ hilft nur bei geraden $f$; für $f = x$ ist das Produkt gerade. Die Buckel wachsen wie $1/\\varepsilon^2$, rücken aber zusammen. Zusammen messen sie die Steigung von $f$ bei $0$, mit Minuszeichen.\n\nAusblick: Ableitungen von δ treten zum Beispiel auf, wenn man den Impulsoperator $\\hat p$ in der Ortsdarstellung als Integralkern schreibt.'
  },
  clarify:{
    core:'**Taylor-Reihe** um $x_0$: $f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(x_0)}{n!}(x - x_0)^n$. Wichtig für Näherungen:\n\n$$e^x = \\sum_{n=0}^\\infty\\frac{x^n}{n!},\\quad \\sin x = x - \\frac{x^3}{6} + \\dots,\\quad \\cos x = 1 - \\frac{x^2}{2} + \\dots,\\quad (1 + x)^a = 1 + ax + \\frac{a(a-1)}{2}x^2 + \\dots$$\n\nDie Reihen gelten innerhalb ihres Konvergenzradius: $e^x$, $\\sin x$, $\\cos x$ für alle $x$, $(1 + x)^a$ (für $a \\notin \\{0, 1, 2, \\dots\\}$) für $|x| < 1$. Nahe einem Potentialminimum ist $V \\approx V(x_0) + \\tfrac12V\'\'(x_0)(x - x_0)^2$.\n\nDie **geometrische Reihe** $\\sum_{n=0}^\\infty q^n = \\frac{1}{1 - q}$ konvergiert nur für $|q| < 1$; endlich gilt $\\sum_{n=0}^{N-1}q^n = \\frac{1 - q^N}{1 - q}$.\n\n**Integrale** (für $\\alpha > 0$): $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$, $\\int_0^\\infty x^ne^{-x}dx = n!$. Partielle Integration: $\\int_a^b fg\'\\,dx = [fg]_a^b - \\int_a^b f\'g\\,dx$.\n\n**δ-Distribution:** $\\int\\delta(x - a)f(x)\\,dx = f(a)$, wenn $a$ im Inneren des Integrationsbereichs liegt und $f$ bei $a$ stetig ist (sonst $0$; liegt $a$ auf dem Rand, ist das Integral ohne Zusatzkonvention nicht definiert). Außerdem $\\delta(cx) = \\delta(x)/|c|$, $\\delta(-x) = \\delta(x)$ und $\\Theta\'(x) = \\delta(x)$ für die Stufenfunktion $\\Theta$. $\\delta(x)$ hat die Einheit $1/[x]$.',
    keys:[
      'Eine Taylor-Näherung immer mit ihrer Ordnung angeben: $\\sqrt{1 + x} = 1 + \\frac{x}{2} - \\frac{x^2}{8} + O(x^3)$. Entwickeln, bis der gesuchte Effekt auftaucht.',
      'Bei Gauß-Integralen zuerst auf die Form $e^{-\\alpha u^2}$ bringen; den Faktor vor $x^2$ ausklammern, bevor man quadratisch ergänzt.',
      'Symmetrie zuerst: Ungerade Integranden über $(-a, a)$ ergeben $0$, bei geraden gilt $\\int_{-a}^a = 2\\int_0^a$. Vorher prüfen, ob die Funktion wirklich um $0$ symmetrisch ist.',
      'Randterme nie stillschweigend weglassen: kurz begründen, warum $[fg]$ verschwindet.',
      'δ nur unter dem Integral auswerten. Bei $\\delta(cx - d)$ den Faktor $1/|c|$ nicht vergessen und prüfen, ob die Spitze $x = d/c$ im Bereich liegt.'
    ],
    errors:[
      '$\\delta(2x) = 2\\delta(x)$ statt $\\tfrac12\\delta(x)$.',
      '$\\int_0^\\infty\\delta(x - a)f(x)\\,dx = f(a)$ auch für $a < 0$ – dann liegt die Spitze außerhalb, und das Integral ist $0$.',
      'Bei partieller Integration das Minuszeichen vor dem Restintegral vergessen.',
      '$\\sqrt{\\pi\\alpha}$ statt $\\sqrt{\\pi/\\alpha}$. Eine Einheitenkontrolle hilft: $\\int e^{-\\alpha x^2}dx$ hat die Einheit einer Länge, $\\alpha$ die Einheit $1/\\text{Länge}^2$.',
      'Eine Reihe außerhalb ihres Konvergenzbereichs summieren, etwa $\\sum 2^n = -1$.'
    ],
    more:[{title:'Was ist $\\Gamma(1/2)$?', text:'Die Gammafunktion $\\Gamma(s) = \\int_0^\\infty t^{s-1}e^{-t}dt$ (für $s > 0$) verallgemeinert die Fakultät: $\\Gamma(n + 1) = n!$. Mit $t = u^2$ wird $\\Gamma(1/2) = 2\\int_0^\\infty e^{-u^2}du = \\sqrt\\pi$. So erklären sich die $\\sqrt\\pi$ in den Gauß-Integralen mit $x^{2n}$.'}],
    checks:[
      {q:'$\\int_{-\\infty}^\\infty \\delta(x - 3)\\,x^2\\,dx$ ist …', opts:['$9$', '$0$', '$3$'], a:0, ex:'Die δ-Distribution pickt den Wert bei $x = 3$ heraus: $3^2 = 9$.'},
      {q:'$\\sum_{n=0}^\\infty (1/3)^n$ ist …', opts:['$3/2$', '$1/3$', 'divergent'], a:0, ex:'Geometrische Reihe mit $q = 1/3$: $\\frac{1}{1 - 1/3} = \\frac32$.'}
    ]
  },
  lab:{type:'delta', title:'Die δ-Distribution als Grenzwert',
    map:[
      {sym:R`\delta_\varepsilon(x - a)`, ctl:'Form von δ_ε', says:R`Wählt das Glied der δ-Folge: Gauß, Lorentz oder Rechteck, jedes mit der Fläche 1. Die Anzeige $\int\delta_\varepsilon\,dx$ bestätigt das. Im Bild ist es die schmale Spitze.`},
      {sym:R`\varepsilon`, ctl:'Breite ε', says:R`Breite der Spitze. Kleineres $\varepsilon$ heißt schmaler und höher, die Fläche bleibt 1. Für $\varepsilon \to 0$ geht die angezeigte Abweichung von $f(a)$ gegen null.`},
      {sym:R`a`, ctl:'Verschiebung a', says:R`Ort der Spitze (gestrichelte Linie $a$). Dort wird das Argument $x - a$ null; die Spitze greift $f(a)$ heraus.`},
      {sym:R`f(x)`, ctl:'Testfunktion f', says:R`Die Funktion, auf die δ wirkt; im Bild die grüne Kurve. Die Anzeige nennt ihren Wert $f(a)$ an der Spitze.`},
      {sym:R`\int\delta_\varepsilon(x - a)\,f(x)\,dx`, ctl:'blaue Fläche', says:R`Die helle Fläche unter dem Produkt $\delta_\varepsilon(x - a)\,f(x)$. Ihr Inhalt ist das Integral; die Anzeige vergleicht ihn mit $f(a)$.`}
    ],
    sketch:{id:'ma-lab-s', kind:'curve', draw:'f', title:'Vorhersage: eine δ-Folge',
      text:'Gleich zeigt das Labor eine δ-Folge. Skizziere vorher die Gauß-Form $\\delta_\\varepsilon(x - a)$ aus dem Lerntext (Fläche 1) für $\\varepsilon = 0{,}25$ und $a = 1$. Achte auf Lage, Breite und Höhe; die Achse ist absolut. Stell danach im Labor die Form „Gauß“, $\\varepsilon = 0{,}25$ und $a = 1$ ein und vergleiche mit der schmalen Spitze.',
      plot:{x:[-3, 3], y:[-0.5, 2], abs:true, xlab:'x', ylab:'\\delta_\\varepsilon(x - a)', ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}], yticks:[{y:0.5, lab:'0{,}5'}, {y:1, lab:'1'}, {y:1.5, lab:'1{,}5'}]},
      // δ_ε(x − a) = e^{−(x−a)²/(2ε²)}/(√(2π) ε), ε = 0,25: Höhe 1,596, Halbwertsbreite 2√(2 ln 2)·ε = 0,589, Fläche 1
      f:x => Math.exp(-((x - 1) ** 2) / (2 * 0.0625)) / (Math.sqrt(2 * Math.PI) * 0.25),
      checks:[
        {id:'pos', type:'nonneg', msg:'Die Gauß-Kurve $e^{-u^2}$ ist überall positiv. Kann $\\delta_\\varepsilon(x - a)$ dann negativ werden?'},
        {id:'lage', type:'center', x:1, tol:0.2, msg:'Wo sitzt die Spitze von $\\delta_\\varepsilon(x - a)$? An welcher Stelle wird das Argument null?'},
        {id:'breite', type:'fwhm', v:0.589, tol:0.3, msg:'Wie hängt die Breite der Spitze von $\\varepsilon$ ab? Auf halber Höhe ist deine Kurve {got} breit.'},
        {id:'hoehe', type:'level', range:[0.95, 1.05], v:1.585, tol:0.4, msg:'Wie hoch ist die Spitze bei $x = a$? Deine liegt bei etwa {got}.'},
        {id:'flaeche', type:'area', range:[0.2, 1.8], v:1, tol:0.3, msg:'Welche Fläche hat jedes Glied einer δ-Folge? Deine ist etwa {got}. Wie hoch muss eine so schmale Spitze dann sein? (Abschnitt „Die δ-Distribution“)'}
      ],
      reveal:'Die Spitze sitzt bei $x = a = 1$, wo das Argument $x - a$ null wird. Ihre Breite auf halber Höhe ist $2\\sqrt{2\\ln 2}\\,\\varepsilon \\approx 0{,}59$. Damit die Fläche 1 bleibt, ist sie $1/(\\sqrt{2\\pi}\\,\\varepsilon) \\approx 1{,}6$ hoch – höher als 1. Halbiert man $\\varepsilon$, wird sie halb so breit und doppelt so hoch. Im Labor siehst du zusätzlich, wie die Spitze aus der Testfunktion den Wert $f(a)$ herausgreift.',
      hints:['Kläre nacheinander: Wo liegt die Mitte, wie breit ist die Glocke, und welche Fläche muss sie haben?', 'Eine Gauß-Glocke der Fläche 1 mit Standardabweichung $\\varepsilon$ hat die Höhe $1/(\\sqrt{2\\pi}\\,\\varepsilon)$.'],
      wrong:[
        {f:x => Math.exp(-((x + 1) ** 2) / (2 * 0.0625)) / (Math.sqrt(2 * Math.PI) * 0.25), fails:['lage'], why:'δ(x − a) bei x = −a statt bei x = a'},
        {f:x => Math.exp(-((x - 1) ** 2) / (2 * 0.0625)), fails:['hoehe'], why:'Höhe 1 statt Fläche 1'},
        {f:x => Math.exp(-((x - 1) ** 2) / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.25), fails:['breite', 'flaeche'], why:'Höhe zu ε passend, aber doppelt so breit (σ = 2ε): Fläche 2'}
      ]},
    text:'Die schmale Spitze ist $\\delta_\\varepsilon(x - a)$, die zweite Kurve die Testfunktion $f$, die helle Fläche das Produkt $\\delta_\\varepsilon(x - a)f(x)$. Wähle die Form von $\\delta_\\varepsilon$ (Gauß, Lorentz oder Rechteck, jeweils mit Fläche 1) und eine Testfunktion, verkleinere $\\varepsilon$ und verschiebe die Spitze mit $a$. Die Anzeige vergleicht den Inhalt der hellen Fläche, $\\int\\delta_\\varepsilon(x - a)f(x)\\,dx$, mit $f(a)$.',
    predict:{q:'Bevor du die Regler bewegst: Hängt der Grenzwert von $\\int\\delta_\\varepsilon(x - a)f(x)\\,dx$ für $\\varepsilon \\to 0$ von der Form der Spitze ab?', opts:['Nein, alle drei Formen geben $f(a)$.', 'Ja, nur die Gauß-Form gibt genau $f(a)$.', 'Ja, nur das Rechteck gibt genau $f(a)$.'], a:0, ex:'Entscheidend sind die Fläche 1 und das Schmalerwerden. Bei endlichem $\\varepsilon$ unterscheiden sich die Formen; die Lorentz-Form konvergiert wegen ihrer langen Ausläufer am langsamsten.'},
    questions:[
      {q:'Gauß-Form, $f = \\cos x$, $a = 0$: Verkleinere $\\varepsilon$ von $1$ auf $0{,}05$. Was passiert mit dem Integral?', opts:['Es nähert sich $f(0) = 1$.', 'Es wird null.', 'Es wächst über alle Grenzen.'], a:0, ex:'Für die Gauß-Form gilt $\\int\\delta_\\varepsilon(x)\\cos x\\,dx = e^{-\\varepsilon^2/2}$: bei $\\varepsilon = 1$ etwa $0{,}61$, bei $\\varepsilon = 0{,}05$ etwa $0{,}999$.'},
      {q:'Wähle $f = 1/(1 + x^2)$ und $\\varepsilon = 0{,}05$. Verschiebe $a$ auf $1$. Welcher Wert wird angezeigt?', opts:['etwa $0{,}5$', 'etwa $1$', 'etwa $0$'], a:0, ex:'Die Spitze sitzt jetzt bei $x = 1$ und pickt $f(1) = 1/2$ heraus: $\\int\\delta(x - a)f(x)\\,dx = f(a)$.'}
    ],
    noPic:{q:'Ohne Bild: $\\int_{-\\infty}^{\\infty}\\delta(2x)\\,dx$ ist …', opts:['$1/2$', '$1$', '$2$'], a:0, ex:'Mit $u = 2x$ ist $dx = du/2$, also $\\int\\delta(u)\\,du/2 = 1/2$. Das ist die Regel $\\delta(cx) = \\delta(x)/|c|$.'}},
  compare:{
    text:'Gesucht ist $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx$ für $\\alpha > 0$. Zwei richtige Wege:',
    ctx:CTX.line({params:{α:'pos', m:'pos'}}),
    A:{name:'Partiell integrieren', model:['∫_-∞^∞ x^2 e^(-α x^2) dx = ∫_-∞^∞ x · x e^(-α x^2) dx', {l:'= 1/(2α) ∫_-∞^∞ e^(-α x^2) dx', w:'f = x, g′ = x e^(−αx²); Randterm −x e^(−αx²)/(2α) verschwindet'}, '= 1/(2α) sqrt(π/α)']},
    B:{name:'Nach dem Parameter ableiten', model:['∫_-∞^∞ x^2 e^(-α x^2) dx = -d/dα ∫_-∞^∞ e^(-α x^2) dx', '= -d/dα sqrt(π/α)', '= 1/(2α) sqrt(π/α)']},
    questions:[
      {q:'Welcher Weg liefert am schnellsten auch $\\int x^4e^{-\\alpha x^2}dx$?', opts:['Weg B: noch einmal nach $\\alpha$ ableiten', 'Weg A: zweimal partiell integrieren', 'Keiner von beiden'], a:0, ex:'$\\int x^4e^{-\\alpha x^2}dx = \\frac{d^2}{d\\alpha^2}\\sqrt{\\pi/\\alpha} = \\frac{3}{4\\alpha^2}\\sqrt{\\pi/\\alpha}$.'},
      {q:'Was muss man bei Weg A zusätzlich begründen?', opts:['dass der Randterm verschwindet', 'dass $\\alpha$ positiv und reell ist', 'dass man unter dem Integral ableiten darf'], a:0, ex:'$x\\,e^{-\\alpha x^2}\\to 0$ für $x\\to\\pm\\infty$, deshalb fällt $[\\dots]_{-\\infty}^{\\infty}$ weg. $\\alpha > 0$ brauchen beide Wege; das Ableiten unter dem Integral gehört zu Weg B.'}
    ]
  },
  practice:[
    {id:'ma-p1', title:'Taylor-Reihen',
      text:'Die Taylor-Reihe um $x = 0$ ist $f(x) = \\sum_n c_nx^n$ mit $c_n = f^{(n)}(0)/n!$. Schreibe Fakultäten im Nenner mit Klammern, zum Beispiel `x^2/(2!)`.',
      ctx:{coords:['x'], params:{}, defs:{'f(x)':'sqrt(1 + x)'}},
      goals:[
        {id:'a', prompt:'a) Bestimme den Koeffizienten $c_2$ von $x^2$ in der Taylor-Reihe von $f(x) = \\sqrt{1 + x}$.', type:'value', target:'-1/8', points:2, ph:"c_2 = f''(0)/(2!)",
          hints:['Gesucht ist ein Taylor-Koeffizient. Welche Ableitung brauchst du, und wodurch teilst du?', '$c_n = f^{(n)}(0)/n!$. Leite $(1 + x)^{1/2}$ zweimal ab.', '$f\'\'(x) = -\\tfrac14(1 + x)^{-3/2}$, also $f\'\'(0) = -1/4$. Teile noch durch $2!$.'],
          model:["c_2 = f''(0)/(2!)", '= (-1/4)/2', '= -1/8'],
          mistakes:[{expr:'-1/4', msg:'Das ist $f\'\'(0)$. Der Taylor-Koeffizient ist $f\'\'(0)/2!$.'}, {expr:'1/8', msg:'Vorzeichen: $f\'\'(x) = -\\tfrac14(1 + x)^{-3/2}$ ist negativ.'}],
          note:'Also $\\sqrt{1 + x} \\approx 1 + \\frac x2 - \\frac{x^2}{8}$. Das ist ein Spezialfall von $(1 + x)^a \\approx 1 + ax + \\frac{a(a-1)}{2}x^2$ mit $a = 1/2$.'},
        {id:'b', prompt:'b) Nähere $e^{1/10}$ durch die Taylor-Reihe von $e^x$ bis einschließlich $x^2$. Gib das Ergebnis als Dezimalzahl an und schreib bei der Näherung „≈“.', type:'value', target:'1.105', points:2, ph:'e^x ≈ 1 + x + x^2/2',
          hints:['Setze den kleinen Wert in das Taylor-Polynom ein.', '$e^x \\approx 1 + x + x^2/2$ mit $x = 1/10$.', '$x^2/2 = 1/200 = 0{,}005$. Addiere die drei Terme.'],
          model:['e^x ≈ 1 + x + x^2/2', 'e^(1/10) ≈ 1 + 1/10 + 1/200', '= 1.105'],
          mistakes:[{expr:'e^(1/10)', msg:'Das ist der exakte Wert. Gefragt ist die Näherung $1 + x + x^2/2$ mit $x = 1/10$.'}, {expr:'1.1', msg:'Das ist nur die erste Ordnung. Nimm noch $x^2/2 = 1/200$ dazu.'}],
          note:'Der exakte Wert ist $1{,}10517\\ldots$; der Fehler $\\approx x^3/6 \\approx 1{,}7\\cdot 10^{-4}$ ist der erste weggelassene Term.'}
      ]},
    {id:'ma-p2', title:'Geometrische Reihe',
      text:'Benutze $\\sum_{n=0}^\\infty q^n = \\frac{1}{1 - q}$ für $|q| < 1$. Mit $E_n = \\hbar\\omega(n + \\tfrac12)$ (Thema 7) wird zum Beispiel die Zustandssumme $\\sum_n e^{-E_n/kT}$ der statistischen Physik eine geometrische Reihe.',
      ctx:{coords:['y'], params:{x:{range:[0.5, 3]}, q:{range:[0.1, 0.8]}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\sum_{n=0}^\\infty e^{-nx}$ für $x > 0$.', type:'value', target:'1/(1 - e^(-x))', points:2, ph:'Σ_{n=0}^∞ e^(-n x) = Σ_{n=0}^∞ (e^(-x))^n',
          hints:['Erkenne die Reihe: Ist das eine geometrische Reihe? Mit welchem $q$?', '$e^{-nx} = (e^{-x})^n$, also $q = e^{-x}$. Für $x > 0$ ist $0 < q < 1$.', 'Setze $q = e^{-x}$ in $1/(1 - q)$ ein.'],
          model:['Σ_{n=0}^∞ e^(-n x) = Σ_{n=0}^∞ (e^(-x))^n', '= 1/(1 - e^(-x))'],
          mistakes:[{expr:'1/(1 - e^x)', msg:'Hier ist $q = e^{-x}$, nicht $e^{x}$.'}, {expr:'e^(-x)/(1 - e^(-x))', msg:'Die Summe beginnt bei $n = 0$; der erste Summand ist $1$.'}]},
        {id:'b', prompt:'b) Berechne $\\sum_{n=0}^\\infty n\\,q^n$ für $0 < q < 1$ mit dem Ableitungstrick $n\\,q^n = q\\frac{d}{dq}q^n$.', type:'value', target:'q/(1 - q)^2', points:3, ph:'Σ_{n=0}^∞ n q^n = q d/dq Σ_{n=0}^∞ q^n',
          hints:['Führe die Summe mit dem Gewicht $n$ auf die geometrische Reihe zurück.', '$n\\,q^n = q\\frac{d}{dq}q^n$: Ziehe $q\\frac{d}{dq}$ vor die Summe. Setze den Ausdruck hinter $d/dq$ in Klammern: `q d/dq (1/(1 - q))`.', '$\\frac{d}{dq}\\frac{1}{1 - q} = \\frac{1}{(1 - q)^2}$. Multipliziere mit $q$.'],
          model:['Σ_{n=0}^∞ n q^n = q d/dq Σ_{n=0}^∞ q^n', '= q d/dq (1/(1 - q))', '= q/(1 - q)^2'],
          mistakes:[{expr:'1/(1 - q)^2', msg:'Der Faktor $q$ vor der Ableitung fehlt.'}, {expr:'-q/(1 - q)^2', msg:'Vorzeichen: $\\frac{d}{dq}(1 - q)^{-1} = +(1 - q)^{-2}$ (Kettenregel mit innerer Ableitung $-1$).'}]}
      ]},
    {id:'ma-p3', title:'Gauß-Integrale',
      text:'Es ist $\\alpha > 0$. Benutze $\\int_{-\\infty}^\\infty e^{-\\alpha u^2}du = \\sqrt{\\pi/\\alpha}$ und $\\int_{-\\infty}^\\infty u^2e^{-\\alpha u^2}du = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$.',
      ctx:CTX.line({params:{α:'pos', m:'pos'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_{-\\infty}^\\infty e^{-x^2 + 2x}\\,dx$.', type:'value', target:'sqrt(π) e', points:3, hints:['Bringe den Exponenten auf die Form $-(x - c)^2 + \\text{Konstante}$.', 'Quadratische Ergänzung: $-x^2 + 2x = -(x - 1)^2 + 1$.', 'Mit $u = x - 1$ bleibt $e\\int e^{-u^2}du$.'],
          model:['∫_-∞^∞ e^(-x^2 + 2x) dx = ∫_-∞^∞ e^(-(x - 1)^2 + 1) dx', '= e ∫_-∞^∞ e^(-u^2) du', '= e sqrt(π)'],
          mistakes:[{expr:'sqrt(π)', msg:'Der konstante Teil $e^{1}$ aus der quadratischen Ergänzung fehlt.'}]},
        {id:'b', prompt:'b) Berechne $\\int_0^\\infty x\\,e^{-\\alpha x^2}\\,dx$.', type:'value', target:'1/(2α)', points:2, hints:['Das Intervall ist nur $[0, \\infty)$; die Symmetrie hilft hier nicht. Suche eine Stammfunktion.', '$x\\,e^{-\\alpha x^2}$ ist bis auf einen Faktor die Ableitung von $e^{-\\alpha x^2}$.', 'Stammfunktion: $-\\frac{1}{2\\alpha}e^{-\\alpha x^2}$. Setze die Grenzen ein.'],
          model:['∫_0^∞ x e^(-α x^2) dx = [-e^(-α x^2)/(2α)]_0^∞', '= 1/(2α)'],
          mistakes:[{expr:'0', msg:'Über $(-\\infty, \\infty)$ wäre das Integral null (ungerader Integrand). Hier läuft es aber nur von $0$ bis $\\infty$.'}]},
        {id:'c', prompt:'c) Berechne $\\int_{-\\infty}^\\infty (x - 1)^2e^{-x^2}\\,dx$.', type:'value', target:'3 sqrt(π)/2', points:3, hints:['Zerlege den Integranden in Teile, deren Gauß-Integrale du kennst.', '$(x - 1)^2 = x^2 - 2x + 1$. Ungerade Teile ergeben über $(-\\infty, \\infty)$ null.', 'Es bleiben $\\int x^2e^{-x^2}dx = \\frac{\\sqrt\\pi}{2}$ und $\\int e^{-x^2}dx = \\sqrt\\pi$.'],
          model:['∫_-∞^∞ (x - 1)^2 e^(-x^2) dx = ∫_-∞^∞ (x^2 - 2x + 1) e^(-x^2) dx', {l:'= sqrt(π)/2 - 0 + sqrt(π)', w:'Term mit x ist ungerade'}, '= 3 sqrt(π)/2'],
          mistakes:[{expr:'2 sqrt(π)', msg:'Prüfe $\\int x^2e^{-x^2}dx$: Mit $\\alpha = 1$ ist das $\\frac12\\sqrt\\pi$, nicht $\\sqrt\\pi$.'}, {expr:'sqrt(π)/2 + sqrt(π) - 2', msg:'Der Term $-2\\int x\\,e^{-x^2}dx$ ist $0$, weil der Integrand ungerade ist.'}]}
      ]},
    {id:'ma-p4', title:'Fakultät und Randterme',
      text:'Benutze $\\int_0^\\infty u^ne^{-u}\\,du = n!$.',
      ctx:{coords:['x'], params:{}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_0^\\infty x^3e^{-2x}\\,dx$.', type:'value', target:'3/8', points:2, ph:'∫_0^∞ x^3 e^(-2x) dx = 1/2^4 ∫_0^∞ u^3 e^(-u) du',
          hints:['Bringe das Integral durch Substitution auf die Form $\\int_0^\\infty u^ne^{-u}du = n!$.', 'Substituiere $u = 2x$: $x^3 = u^3/8$ und $dx = du/2$.', 'Insgesamt entsteht der Faktor $1/2^4$, und $3! = 6$.'],
          model:[{l:'∫_0^∞ x^3 e^(-2x) dx = 1/2^4 ∫_0^∞ u^3 e^(-u) du', w:'u = 2x'}, '= 3!/16', '= 3/8'],
          mistakes:[{expr:'3/4', msg:'Bei der Substitution $u = 2x$ ist auch $dx = du/2$. Insgesamt entsteht $1/2^4$, nicht $1/2^3$.'}, {expr:'6', msg:'Das wäre $\\int_0^\\infty x^3e^{-x}dx$. Der Faktor 2 im Exponenten muss berücksichtigt werden.'}],
          note:'Allgemein: $\\int_0^\\infty x^ne^{-kx}dx = n!/k^{n+1}$ für $k > 0$. Diese Formel brauchst du beim Wasserstoffatom (Thema 9).'}
      ]},
    {id:'ma-p4b', title:'Randterme bei Funktionen, die am Rand verschwinden',
      text:'Gegeben sind Funktionen $f, g$ auf $[0, L]$ mit $f(0) = f(L) = 0$ und $g(0) = g(L) = 0$ (wie Wellenfunktionen im Kasten).',
      ctx:CTX.box({abstract:{f:{args:['x']}, g:{args:['x']}}}),
      goals:[
        {id:'a', prompt:'Zeige: $\\int_0^L f^*g\'\\,dx = -\\int_0^L (f^*)\'\\,g\\,dx$.', type:'show', from:'∫_0^L f^* g\' dx', to:'-∫_0^L (f^*)\' g dx', points:3, hints:['Partiell integrieren: Welche Funktion leitest du ab, welche integrierst du?', '$\\int_0^Lf^*g\'\\,dx = [f^*g]_0^L - \\int_0^L(f^*)\'g\\,dx$.', 'Der Randterm ist null, weil $f$ und $g$ bei $0$ und $L$ verschwinden.'],
          model:['∫_0^L f^* g\' dx = [f^* g]_0^L - ∫_0^L (f^*)\' g dx', {l:'= -∫_0^L (f^*)\' g dx', w:'f(0) = f(L) = 0'}],
          note:'Genau dieser Schritt zeigt später, dass $\\hat p = -i\\hbar\\,d/dx$ hermitesch ist (Thema 6).'}
      ]},
    {id:'ma-p5', title:'Rechnen mit der δ-Distribution',
      text:'Regeln: $\\int\\delta(x - a)f(x)\\,dx = f(a)$, wenn $a$ im Inneren des Integrationsbereichs liegt und $f$ bei $a$ stetig ist, sonst $0$ (liegt $a$ auf dem Rand, ist das Integral ohne Zusatzkonvention nicht definiert); $\\delta(cx - d) = \\frac{1}{|c|}\\delta(x - d/c)$.',
      ctx:{coords:['x'], params:{}, abstract:{f:{args:['x']}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\int_{-\\infty}^\\infty \\delta(2x - 1)\\,e^x\\,dx$.', type:'value', target:'e^(1/2)/2', points:2, ph:'∫_-∞^∞ δ(2x - 1) e^x dx = ∫_-∞^∞ 1/2 δ(x - 1/2) e^x dx',
          hints:['Bringe das Argument der δ-Distribution auf die Form $c(x - x_0)$.', '$\\delta(cx - d) = \\frac{1}{|c|}\\delta(x - d/c)$.', '$\\delta(2x - 1) = \\tfrac12\\delta(x - \\tfrac12)$. Werte $e^x$ bei $x = 1/2$ aus.'],
          model:['∫_-∞^∞ δ(2x - 1) e^x dx = ∫_-∞^∞ 1/2 δ(x - 1/2) e^x dx', '= e^(1/2)/2'],
          mistakes:[{expr:'e^(1/2)', msg:'Der Faktor $1/|c| = 1/2$ fehlt: $\\delta(2x - 1) = \\tfrac12\\delta(x - \\tfrac12)$.'}, {expr:'2 e^(1/2)', msg:'Umgekehrt: $\\delta(cx) = \\delta(x)/|c|$, also Faktor $\\tfrac12$, nicht $2$.'}, {expr:'e/2', msg:'Die Spitze liegt bei $2x - 1 = 0$, also $x = 1/2$, nicht bei $x = 1$.'}]},
        {id:'b', prompt:'b) Berechne $\\int_{-2}^{2}(x^3 + 1)\\,\\delta(x - 1)\\,dx + \\int_{-2}^{2}(x^3 + 1)\\,\\delta(x + 3)\\,dx$.', type:'value', target:'2', points:2,
          hints:['Prüfe für jeden Summanden: Wo liegt die Spitze, und liegt sie im Intervall $[-2, 2]$?', 'Spitze innen: $\\int\\delta(x - a)f\\,dx = f(a)$; Spitze außen: $0$.', 'Erster Summand: $f(1) = 2$. Zweiter: Die Spitze von $\\delta(x + 3)$ liegt bei $x = -3$.'],
          model:['∫_-2^2 (x^3 + 1) δ(x - 1) dx + ∫_-2^2 (x^3 + 1) δ(x + 3) dx = 2 + 0', '= 2'],
          mistakes:[{expr:'-24', msg:'$x = -3$ liegt außerhalb von $[-2, 2]$. Dort trägt $\\delta(x + 3)$ nichts bei.'}, {expr:'30', msg:'Zwei Fehler: Die Spitze von $\\delta(x + 3)$ liegt bei $x = -3$, nicht bei $x = +3$ – und sie liegt außerhalb von $[-2, 2]$. Dort trägt $\\delta(x + 3)$ nichts bei.'}]},
        {id:'c', prompt:'c) $f$ sei glatt und verschwinde für $x \\to \\infty$. Zeige: $\\int_{-\\infty}^\\infty\\Theta(x)\\,f\'(x)\\,dx = -f(0)$. Dabei ist $\\Theta$ die Stufenfunktion ($\\Theta = 0$ für $x < 0$, $1$ für $x > 0$).', type:'show', from:"∫_-∞^∞ Θ(x) f'(x) dx", to:'-f(0)', points:3,
          hints:['Die Stufenfunktion schneidet einen Teil des Integrationsbereichs ab.', 'Für $x < 0$ ist $\\Theta = 0$, für $x > 0$ ist $\\Theta = 1$. Dann gilt der Hauptsatz: $\\int_0^\\infty f\'dx = [f]_0^\\infty$.', '$f(\\infty) = 0$ nach Voraussetzung. Es bleibt $-f(0)$.'],
          model:["∫_-∞^∞ Θ(x) f'(x) dx = ∫_0^∞ f'(x) dx", '= [f(x)]_0^∞', '= -f(0)'],
          note:'Damit gilt $\\int\\Theta\'f\\,dx = [\\Theta f] - \\int\\Theta f\'\\,dx = 0 + f(0)$. Die Ableitung der Stufenfunktion wirkt also wie $\\delta(x)$: $\\Theta\'(x) = \\delta(x)$. Beim δ-Potential springt deshalb $\\psi\'$ (Thema 5).'}
      ]}
  ],
  concept:[
    {id:'ma-k1', type:'mc2', q:'Welcher Ausdruck ist gleich $\\delta(2x)$?', opts:['$\\tfrac12\\delta(x)$', '$2\\delta(x)$', '$\\delta(x)$'], a:0,
      ex:'$\\delta(cx) = \\delta(x)/|c|$ mit $c = 2$.',
      reason:{q:'Warum?', opts:['Mit $u = 2x$ ist $dx = du/2$; die Spitze hat nur die halbe Fläche.', 'Die Spitze wird doppelt so hoch, also doppelt so stark.', 'δ ist nur bei $0$ ungleich null; ein Faktor ändert dort nichts.'], a:0, ex:'$\\int\\delta(2x)f(x)\\,dx = \\tfrac12\\int\\delta(u)f(u/2)\\,du = \\tfrac12f(0)$. Bei einer δ-Folge ist $\\delta_\\varepsilon(2x)$ halb so breit bei gleicher Höhe. δ hat keinen „Wert bei 0“, mit dem man argumentieren könnte.'},
      seg:'ma-t6', lex:'delta-distribution'},
    {id:'ma-k2', type:'dialog', text:'Es geht um den Ausdruck $\\int_{-\\infty}^{\\infty}\\delta(x)^2\\,dx$.',
      people:[{name:'Lena', says:'$\\delta(x)$ ist null außer bei $0$ und dort unendlich. $\\delta(x)^2$ sieht genauso aus, also ist das Integral wieder $1$.'}, {name:'Jonas', says:'δ ist nur durch seine Wirkung unter einem Integral mit einer stetigen Funktion definiert. $\\delta^2$ ist nicht definiert: Für eine Rechteck-Folge ist $\\int\\delta_\\varepsilon^2dx = 1/(2\\varepsilon)$, und das wächst über alle Grenzen.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Rechteck: Höhe $1/(2\\varepsilon)$, Breite $2\\varepsilon$, also $\\int\\delta_\\varepsilon^2dx = (1/(2\\varepsilon))^2\\cdot 2\\varepsilon = 1/(2\\varepsilon)$. Lenas Bild „unendlich bei 0“ ist keine Definition und führt hier in die Irre.',
      seg:'ma-t5', lex:'delta-distribution'},
    {id:'ma-k3', type:'mc', q:'$x$ ist ein Ort in Metern. Welche Einheit hat $\\delta(x - a)$?', opts:['$1/\\text{m}$', 'keine, δ ist eine reine Zahl', '$\\text{m}$, wie das Argument'], a:0,
      ex:'Aus $\\int\\delta(x - a)\\,dx = 1$ folgt $[\\delta]\\cdot\\text{m} = 1$. Deshalb hat zum Beispiel eine Punktladungsdichte $q\\,\\delta(x - a)$ die Einheit Ladung pro Meter.',
      seg:'ma-t5', lex:'delta-distribution'},
    {id:'ma-k4', type:'mc2', q:'Was ist $\\int_{-\\infty}^\\infty x\\,e^{-(x - 1)^2}dx$?', opts:['$\\sqrt\\pi$', '$0$', '$1$'], a:0,
      ex:'Mit $u = x - 1$: $\\int(u + 1)e^{-u^2}du = 0 + \\sqrt\\pi$.',
      reason:{q:'Warum?', opts:['Mit $u = x - 1$ fällt nur der ungerade Teil $u\\,e^{-u^2}$ weg.', 'Der Integrand ist ungerade, weil der Faktor $x$ ungerade ist.', 'Die Glocke hat die Fläche $1$ und sitzt bei $x = 1$.'], a:0, ex:'$x\\,e^{-(x - 1)^2}$ ist nicht ungerade, denn die Glocke ist um $x = 1$ zentriert. Ihre Fläche ist $\\sqrt\\pi$, nicht 1.'},
      seg:'ma-t3', lex:'gauss-integral'},
    {id:'ma-k5', type:'mc', q:'Jemand schreibt $1 + 2 + 4 + 8 + \\dots = \\frac{1}{1 - 2} = -1$. Was stimmt?', opts:['Die Reihe divergiert; die Formel gilt nur für $|q| < 1$.', 'Das stimmt, die Formel gilt für jedes $q \\neq 1$.', 'Das stimmt, aber nur näherungsweise.'], a:0,
      ex:'Die Partialsummen $1, 3, 7, 15, \\dots$ wachsen über alle Grenzen. Für $q \\neq 1$ gilt nur die endliche Formel $\\frac{1 - q^N}{1 - q}$.',
      seg:'ma-t2', lex:'geometrische-reihe'},
    {id:'ma-k6', type:'dialog', text:'Gesucht ist $\\int_0^1 x\\,e^x\\,dx$ mit partieller Integration, $f = x$ und $g\' = e^x$.',
      people:[{name:'Lena', says:'Der Randterm $[x\\,e^x]_0^1 = e$ bleibt, denn $x\\,e^x$ ist bei $x = 1$ nicht null. Ergebnis: $e - (e - 1) = 1$.'}, {name:'Jonas', says:'Randterme fallen bei partieller Integration weg. Also ist das Integral $-\\int_0^1e^x\\,dx = 1 - e$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Randterme verschwinden nur, wenn $fg$ an beiden Grenzen null ist – etwa bei Wellenfunktionen, die im Unendlichen oder an Kastenwänden verschwinden. Jonas’ Ergebnis $1 - e < 0$ ist für einen positiven Integranden unmöglich.',
      seg:'ma-t4', lex:'partielle-integration'}
  ],
  sketch:[
    {id:'ma-s1', kind:'curve', draw:'f', title:'Taylor-Näherung zweiter Ordnung',
      text:'Skizziere die Taylor-Näherung zweiter Ordnung von $\\cos x$ um $x_0 = 0$, also das Polynom $p_2(x)$, im Bereich $-2 \\le x \\le 2$. Die Skala der $y$-Achse ist frei, aber die Nullstellen sollen an der richtigen Stelle liegen.',
      plot:{x:[-2, 2], xlab:'x', ylab:'p_2(x)', ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}]},
      // p_2(x) = 1 − x²/2: p_2(0) = 1, Nullstellen ±√2 ≈ ±1,41, p_2(±2) = −1 (cos 2 ≈ −0,42)
      f:x => 1 - x * x / 2,
      checks:[
        {id:'sym', type:'parity', p:'even', about:0, msg:'$\\cos x$ ist gerade. Welche Potenzen von $x$ kommen in seiner Taylor-Reihe deshalb vor?'},
        {id:'max', type:'maxat', x:0, tol:0.4, msg:'Welches Vorzeichen hat $f\'\'(0)$ für $f = \\cos x$? Hat $p_2$ bei $x = 0$ ein Maximum oder ein Minimum?'},
        {id:'null', type:'zero', at:[-Math.SQRT2, Math.SQRT2], tol:0.1, msg:'Wo wird $p_2(x)$ null? Rechne die Nullstellen aus und prüfe dabei den Koeffizienten $f\'\'(0)/2!$. (Abschnitt „Taylor-Reihen“)'},
        {id:'fern', type:'amp', a:[1.7, 2], b:[-0.5, 0.5], cmp:'=', f:1.6, msg:'Vergleiche $|p_2(2)|$ mit $p_2(0)$. Bleibt das Polynom so flach wie $\\cos x$, das bei $x = 2$ erst bei $-0{,}42$ liegt?'}
      ],
      reveal:'$p_2(x) = 1 - \\frac{x^2}{2}$: eine nach unten offene Parabel mit Maximum $1$ bei $x = 0$ und Nullstellen bei $\\pm\\sqrt2 \\approx \\pm 1{,}41$. Nahe $x = 0$ stimmt sie mit $\\cos x$ in Wert, Steigung und Krümmung überein. Weiter weg fällt sie schneller: $p_2(\\pm 2) = -1$, aber $\\cos 2 \\approx -0{,}42$, und bei $x = \\pm 3$ wäre $p_2 = -3{,}5$, während $\\cos x$ nie unter $-1$ sinkt. Für kleine $x$ ist der Fehler etwa der erste weggelassene Term $x^4/24$.',
      hints:['Bestimme $f(0)$, $f\'(0)$ und $f\'\'(0)$ für $f = \\cos x$, setze sie in die Taylor-Formel ein und berechne $p_2$ an ein paar Stellen.', 'Der Koeffizient von $x^n$ ist $f^{(n)}(0)/n!$, nicht $f^{(n)}(0)$.'],
      wrong:[
        {f:x => Math.cos(x), fails:['fern'], why:'cos x selbst gezeichnet: Näherung und Funktion gleichgesetzt, auch weit weg von x0'},
        {f:x => 1 - x * x, fails:['null', 'fern'], why:'Faktor 1/n! vergessen: 1 − x²'},
        {f:x => 1 + x * x / 2, fails:['max', 'null', 'fern'], why:'Vorzeichen der zweiten Ableitung falsch'}
      ]},
    {id:'ma-s2', kind:'curve', draw:'f', title:'Wo sitzt die Glocke?',
      text:'Skizziere den Integranden $g(x) = x\\,e^{-(x - 1)^2}$ des Integrals $\\int_{-\\infty}^\\infty x\\,e^{-(x - 1)^2}dx$ im Bereich $-2{,}5 \\le x \\le 3{,}5$. Die Skala der $y$-Achse ist frei. Überlege danach: Ist das Integral null?',
      plot:{x:[-2.5, 3.5], xlab:'x', ylab:'g(x)', ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}]},
      // g = x e^{−(x−1)²}: g' = 0 bei x = (1 ± √3)/2, Maximum 1,195 bei 1,366, Minimum −0,057 bei −0,366
      f:x => x * Math.exp(-((x - 1) ** 2)),
      checks:[
        {id:'null', type:'zero', at:[0], msg:'Welchen Wert hat $g$ bei $x = 0$?'},
        {id:'asym', type:'amp', a:[0, 3.5], b:[-2.5, 0], cmp:'>', msg:'Ist $g$ ungerade? Vergleiche $g(1)$ mit $g(-1)$. Wo sitzt die Glocke $e^{-(x - 1)^2}$? (Abschnitt „Gauß-Integrale“)'},
        {id:'lage', type:'maxat', x:1.366, tol:0.3, msg:'Wo liegt das Maximum von $g$? Die Glocke sitzt bei $x = 1$, und der Faktor $x$ wächst nach rechts.'},
        {id:'abkl', type:'decay', toward:'right', range:[2.5, 3.5], msg:'Was macht $g$ für große $x$: Gewinnt der Faktor $x$ oder die Gauß-Funktion?'}
      ],
      reveal:'Die Glocke $e^{-(x - 1)^2}$ sitzt bei $x = 1$. Der Faktor $x$ macht $g$ links von null negativ, dort ist die Glocke aber schon klein: Der negative Teil reicht nur bis etwa $-0{,}06$. Das Maximum $\\approx 1{,}2$ liegt bei $x = (1 + \\sqrt3)/2 \\approx 1{,}37$. $g$ ist also **nicht** ungerade, und das Integral ist nicht null: Mit $u = x - 1$ wird es $\\int(u + 1)e^{-u^2}du = 0 + \\sqrt\\pi$.',
      hints:['Zeichne zuerst die Glocke $e^{-(x - 1)^2}$ und multipliziere dann in Gedanken mit $x$: Wo ist $x$ negativ, wo größer als 1?', 'Ein Integrand ist nur dann ungerade, wenn $g(-x) = -g(x)$ gilt. Die Glocke ist um $x = 1$ symmetrisch, nicht um $x = 0$.'],
      wrong:[
        {f:x => x * Math.exp(-x * x), fails:['asym', 'lage'], why:'Symmetrie gesehen, wo keine ist: Glocke bei 0, Integrand ungerade'},
        {f:x => Math.exp(-((x - 1) ** 2)), fails:['null'], why:'Faktor x vergessen'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'ma-f3', title:'Geometrische Reihe', text:'Berechne $\\sum_{n=2}^\\infty 3^{-n}$.', ctx:{coords:['y'], params:{}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'1/6', points:2, model:['Σ_{n=2}^∞ 3^(-n) = 1/9 Σ_{n=0}^∞ (1/3)^n', '= 1/9 · 3/2', '= 1/6'],
        mistakes:[{expr:'3/2', msg:'Die Summe beginnt bei $n = 2$. Klammere $3^{-2} = 1/9$ aus.'}, {expr:'1/2', msg:'Das ist die Summe ab $n = 1$. Hier beginnt sie bei $n = 2$.'}]}]}},
    {aim:1, task:{id:'ma-f2', title:'Fakultätsintegral', text:'Berechne $\\int_0^\\infty x^2e^{-x/a}\\,dx$ für $a > 0$.', ctx:{coords:['x'], params:{a:'pos'}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'2 a^3', points:2, model:['∫_0^∞ x^2 e^(-x/a) dx = a^3 ∫_0^∞ u^2 e^(-u) du', '= 2 a^3'],
        mistakes:[{expr:'2 a^2', msg:'Mit $u = x/a$ ist $x^2 = a^2u^2$ und zusätzlich $dx = a\\,du$: insgesamt $a^3$.'}]}]}},
    {aim:2, task:{id:'ma-f4', title:'δ mit Vorfaktor', text:'Berechne $\\int_{-\\infty}^\\infty\\delta(3x + 6)\\,e^{-x}\\,dx$.', ctx:{coords:['x'], params:{}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'e^2/3', points:2, model:['∫_-∞^∞ δ(3x + 6) e^(-x) dx = 1/3 ∫_-∞^∞ δ(x + 2) e^(-x) dx', '= e^2/3'],
        mistakes:[{expr:'e^2', msg:'Der Faktor $1/|c| = 1/3$ fehlt.'}, {expr:'e^(-2)/3', msg:'Die Spitze liegt bei $x = -2$; dort ist $e^{-x} = e^{2}$.'}]}]}},
    {aim:'k', id:'ma-fk1', type:'mc2', q:'$\\int_0^\\infty\\delta(x + 1)\\,e^{x}\\,dx$ ist …', opts:['$0$', '$e^{-1}$', '$e$'], a:0,
      ex:'Die Spitze liegt bei $x = -1$, außerhalb von $[0, \\infty)$.',
      reason:{q:'Warum?', opts:['Die Spitze bei $x = -1$ liegt außerhalb des Bereichs.', 'δ wertet die Funktion an der Nullstelle $x = -1$ aus.', 'Die Spitze liegt bei $x = +1$, dort ist $e^x = e$.'], a:0, ex:'Erst prüfen, wo das Argument null wird und ob diese Stelle im Integrationsbereich liegt. Über die ganze Achse integriert wäre das Ergebnis $e^{-1}$.'}},
    {aim:'k', id:'ma-fk2', type:'dialog', text:'Ein Pendel der Länge $l$ ist längs seiner Kreisbahn um die Bogenlänge $s$ aus der Ruhelage ausgelenkt. Seine potentielle Energie ist $V(s) = mgl\\,(1 - \\cos(s/l))$. Gesucht ist eine Näherung für kleine Auslenkungen.',
      people:[{name:'Lena', says:'Man muss bis zur ersten Ordnung gehen, die nicht verschwindet: $\\cos(s/l) \\approx 1 - s^2/(2l^2)$, also $V \\approx \\frac{mg}{2l}s^2$ – ein harmonisches Potential.'}, {name:'Jonas', says:'Für kleine $s$ ist $\\cos(s/l) \\approx 1$, also $V \\approx 0$. Das Potential ist dann vernachlässigbar.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Jonas’ Näherung ist zu grob: Sie verliert genau den Term, der die Schwingung antreibt. Mit $m\\omega^2 = V\'\'(0) = mg/l$ folgt die bekannte Kreisfrequenz $\\omega = \\sqrt{g/l}$.'},
    {aim:2, sketch:{id:'ma-fs-a', kind:'curve', draw:'f', title:'Eine δ-Folge mit skaliertem Argument', points:3,
      text:'Für die Gauß-Folge $\\delta_\\varepsilon(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\varepsilon}e^{-x^2/(2\\varepsilon^2)}$ mit $\\varepsilon = 0{,}5$ ist $g(x) = \\delta_\\varepsilon(2x)$. Skizziere $g$. Die Achse ist absolut: Achte auf Höhe, Breite und Fläche.',
      plot:{x:[-2, 2], y:[0, 2], abs:true, xlab:'x', ylab:'\\delta_\\varepsilon(2x)', ticks:[{x:-1, lab:'-1'}, {x:-0.5, lab:'-0{,}5'}, {x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}], yticks:[{y:0.5, lab:'0{,}5'}, {y:1, lab:'1'}, {y:1.5, lab:'1{,}5'}]},
      // δ_ε(2x) = 0,798·e^{−8x²}: Höhe δ_ε(0) = 0,798, Standardabweichung ε/2 = 0,25, Halbwertsbreite 0,589, Fläche 1/2
      f:x => Math.exp(-4 * x * x / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.5),
      checks:[
        {id:'hoehe', type:'level', range:[-0.05, 0.05], v:0.798, tol:0.25, msg:'Welchen Wert hat $\\delta_\\varepsilon(2x)$ bei $x = 0$? Deine Höhe ist {got}.'},
        {id:'breite', type:'fwhm', v:0.589, tol:0.3, msg:'Bei welchem $x$ erreicht $\\delta_\\varepsilon(2x)$ denselben Wert wie $\\delta_\\varepsilon(x)$ bei $x = 0{,}5$? Auf halber Höhe ist deine Kurve {got} breit.'},
        {id:'flaeche', type:'area', range:[-0.8, 0.8], v:0.5, tol:0.25, msg:'Welche Fläche hat $\\delta_\\varepsilon(2x)$? Substituiere $u = 2x$. Deine ist etwa {got}.'},
        {id:'lage', type:'maxat', x:0, tol:0.15, msg:'Wo wird das Argument $2x$ null?'}
      ],
      reveal:'$\\delta_\\varepsilon(2x)$ hat bei $x = 0$ denselben Wert $1/(\\sqrt{2\\pi}\\cdot 0{,}5) \\approx 0{,}80$ wie $\\delta_\\varepsilon(x)$, ist aber halb so breit: Den Wert, den $\\delta_\\varepsilon$ bei $x$ hat, erreicht $\\delta_\\varepsilon(2x)$ schon bei $x/2$. Deshalb ist die Fläche $\\tfrac12$. Das ist die Regel $\\delta(cx) = \\delta(x)/|c|$: Unter dem Integral wirkt die gestauchte Spitze wie $\\tfrac12\\delta(x)$. Die Glieder selbst sind aber schmaler, nicht niedriger. Wer $\\delta(2x) = 2\\delta(x)$ schreibt, verwechselt „schmaler“ mit „höher“.',
      wrong:[
        {f:x => 2 * Math.exp(-x * x / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.5), fails:['hoehe', 'breite', 'flaeche'], why:'δ(2x) = 2δ(x): „schmaler“ mit „höher“ verwechselt'},
        {f:x => Math.exp(-x * x / (2 * 0.0625)) / (Math.sqrt(2 * Math.PI) * 0.25), fails:['hoehe', 'flaeche'], why:'schmaler, aber auf Fläche 1 nachnormiert (δ_{ε/2})'},
        {f:x => 0.5 * Math.exp(-x * x / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.5), fails:['hoehe', 'breite'], why:'Regel δ(x)/|c| als halbe Höhe bei gleicher Breite gezeichnet'}
      ]}}
  ],
  finalB:[
    {aim:0, task:{id:'ma-g1', title:'Geometrische Reihe', text:'Berechne $\\sum_{n=3}^\\infty 2^{-n}$.', ctx:{coords:['y'], params:{}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'1/4', points:2, model:['Σ_{n=3}^∞ 2^(-n) = 1/8 Σ_{n=0}^∞ (1/2)^n', '= 1/8 · 2', '= 1/4'],
        mistakes:[{expr:'2', msg:'Die Summe beginnt bei $n = 3$. Klammere $2^{-3} = 1/8$ aus.'}, {expr:'1/2', msg:'Das ist die Summe ab $n = 2$. Hier beginnt sie bei $n = 3$.'}]}]}},
    {aim:1, task:{id:'ma-g2', title:'Fakultätsintegral', text:'Berechne $\\int_0^\\infty x^3e^{-2x/a}\\,dx$ für $a > 0$.', ctx:{coords:['x'], params:{a:'pos'}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'3 a^4/8', points:2, model:['∫_0^∞ x^3 e^(-2x/a) dx = (a/2)^4 ∫_0^∞ u^3 e^(-u) du', '= 6 a^4/16', '= 3 a^4/8'],
        mistakes:[{expr:'3 a^3/4', msg:'Mit $u = 2x/a$ ist $x^3 = (a/2)^3u^3$ und zusätzlich $dx = (a/2)\\,du$: insgesamt $(a/2)^4$.'}]}]}},
    {aim:2, task:{id:'ma-g3', title:'δ mit Vorfaktor', text:'Berechne $\\int_{-\\infty}^\\infty\\delta(4x + 2)\\,e^{2x}\\,dx$.', ctx:{coords:['x'], params:{}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'e^(-1)/4', points:2, model:['∫_-∞^∞ δ(4x + 2) e^(2x) dx = 1/4 ∫_-∞^∞ δ(x + 1/2) e^(2x) dx', '= e^(-1)/4'],
        mistakes:[{expr:'e^(-1)', msg:'Der Faktor $1/|c| = 1/4$ fehlt.'}, {expr:'e/4', msg:'Die Spitze liegt bei $4x + 2 = 0$, also $x = -1/2$; dort ist $e^{2x} = e^{-1}$.'}, {expr:'4 e^(-1)', msg:'Umgekehrt: $\\delta(cx) = \\delta(x)/|c|$, also Faktor $\\tfrac14$, nicht $4$.'}]}]}},
    {aim:'k', id:'ma-gk1', type:'mc2', q:'$\\int_{-2}^{0}\\delta(x - 1)\\,x^2\\,dx$ ist …', opts:['$0$', '$1$', '$4$'], a:0,
      ex:'Die Spitze liegt bei $x = 1$, außerhalb von $[-2, 0]$.',
      reason:{q:'Warum?', opts:['Die Spitze bei $x = 1$ liegt außerhalb von $[-2, 0]$.', 'δ wertet $x^2$ an der Spitze aus, also $1^2$.', 'Man setzt die untere Grenze $x = -2$ ein.'], a:0, ex:'Zuerst prüfen, ob die Spitze im Integrationsbereich liegt. Nur dann wird $f$ dort ausgewertet.'}},
    {aim:'k', id:'ma-gk2', type:'dialog', text:'Ein Potential $V$ hat bei $x_0$ ein Minimum. Für kleine Auslenkungen $s = x - x_0$ soll es genähert werden.',
      people:[{name:'Lena', says:'$V \\approx V(x_0) + V\'(x_0)\\,s$. Die lineare Näherung genügt für kleine $s$.'}, {name:'Jonas', says:'Im Minimum ist $V\'(x_0) = 0$. Die erste nicht triviale Ordnung ist $\\tfrac12V\'\'(x_0)\\,s^2$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Lenas Näherung ergibt nur die Konstante $V(x_0)$ und damit keine rücktreibende Kraft. Die quadratische Ordnung liefert das harmonische Potential mit $m\\omega^2 = V\'\'(x_0)$.'},
    {aim:2, sketch:{id:'ma-fs-b', kind:'curve', draw:'f', title:'Eine δ-Folge mit skaliertem Argument', points:3,
      text:'Für die Gauß-Folge $\\delta_\\varepsilon(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\varepsilon}e^{-x^2/(2\\varepsilon^2)}$ mit $\\varepsilon = 0{,}25$ ist $g(x) = \\delta_\\varepsilon(x/2)$. Skizziere $g$. Die Achse ist absolut: Achte auf Höhe, Breite und Fläche.',
      plot:{x:[-2.5, 2.5], y:[0, 3.5], abs:true, xlab:'x', ylab:'\\delta_\\varepsilon(x/2)', ticks:[{x:-2, lab:'-2'}, {x:-1, lab:'-1'}, {x:-0.5, lab:'-0{,}5'}, {x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}, {x:2, lab:'2'}], yticks:[{y:0.5, lab:'0{,}5'}, {y:1, lab:'1'}, {y:1.5, lab:'1{,}5'}, {y:2, lab:'2'}, {y:3, lab:'3'}]},
      // δ_ε(x/2) = 1,596·e^{−2x²}: Höhe δ_ε(0) = 1,596, Standardabweichung 2ε = 0,5, Halbwertsbreite 1,177, Fläche 2
      f:x => Math.exp(-x * x / 4 / (2 * 0.0625)) / (Math.sqrt(2 * Math.PI) * 0.25),
      checks:[
        {id:'hoehe', type:'level', range:[-0.05, 0.05], v:1.596, tol:0.35, msg:'Welchen Wert hat $\\delta_\\varepsilon(x/2)$ bei $x = 0$? Deine Höhe ist {got}.'},
        {id:'breite', type:'fwhm', v:1.177, tol:0.3, msg:'Bei welchem $x$ erreicht $\\delta_\\varepsilon(x/2)$ denselben Wert wie $\\delta_\\varepsilon(x)$ bei $x = 0{,}25$? Auf halber Höhe ist deine Kurve {got} breit.'},
        {id:'flaeche', type:'area', range:[-1.6, 1.6], v:2, tol:0.25, msg:'Welche Fläche hat $\\delta_\\varepsilon(x/2)$? Substituiere $u = x/2$. Deine ist etwa {got}.'},
        {id:'lage', type:'maxat', x:0, tol:0.25, msg:'Wo wird das Argument $x/2$ null?'}
      ],
      reveal:'$\\delta_\\varepsilon(x/2)$ hat bei $x = 0$ denselben Wert $1/(\\sqrt{2\\pi}\\cdot 0{,}25) \\approx 1{,}6$ wie $\\delta_\\varepsilon(x)$, ist aber doppelt so breit: Den Wert, den $\\delta_\\varepsilon$ bei $x$ hat, erreicht $\\delta_\\varepsilon(x/2)$ erst bei $2x$. Deshalb ist die Fläche $2$. Das ist die Regel $\\delta(cx) = \\delta(x)/|c|$ mit $c = \\tfrac12$: Unter dem Integral wirkt die gestreckte Spitze wie $2\\delta(x)$. Die Glieder selbst sind aber breiter, nicht höher.',
      wrong:[
        {f:x => 0.5 * Math.exp(-x * x / (2 * 0.0625)) / (Math.sqrt(2 * Math.PI) * 0.25), fails:['hoehe', 'breite', 'flaeche'], why:'δ(x/2) = δ(x)/2: Faktor falsch herum und Breite nicht geändert'},
        {f:x => Math.exp(-x * x / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.5), fails:['hoehe', 'flaeche'], why:'breiter, aber auf Fläche 1 nachnormiert (δ_{2ε})'},
        {f:x => 2 * Math.exp(-x * x / (2 * 0.0625)) / (Math.sqrt(2 * Math.PI) * 0.25), fails:['hoehe', 'breite'], why:'Regel als doppelte Höhe bei gleicher Breite gezeichnet'}
      ]}}
  ],
  errors:[
    {id:'ma-e1', title:'Partielle Integration mit Vorzeichenfehler',
      text:'Gesucht ist $\\int_0^\\pi x\\cos x\\,dx$. So wurde gerechnet:',
      ctx:{coords:['x'], params:{}},
      lines:['∫_0^π x cos(x) dx = ∫_0^π x (sin(x))\' dx', '= [x sin(x)]_0^π + ∫_0^π sin(x) dx', '= 0 + 2', '= 2'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Vor dem Restintegral fehlt das Minus.', 'Der Randterm $[x\\sin x]_0^\\pi$ ist nicht null.', 'Es müsste $(\\cos x)\'$ statt $(\\sin x)\'$ heißen.'], a:0, ex:'Partielle Integration: $\\int fg\' = [fg] - \\int f\'g$. Mit dem Minus kommt $0 - 2 = -2$ heraus. Der Randterm ist null, weil $\\sin 0 = \\sin\\pi = 0$.'},
      fix:{id:'a', prompt:'Berichtige und rechne zu Ende.', type:'value', target:'-2', model:['∫_0^π x cos(x) dx = [x sin(x)]_0^π - ∫_0^π sin(x) dx', '= 0 - 2', '= -2']}},
    {id:'ma-e2', title:'δ mit Vorfaktor im Argument',
      text:'Gesucht ist $\\int_{-\\infty}^\\infty\\delta(3x - 6)\\,x^2\\,dx$. So wurde gerechnet:',
      ctx:{coords:['x'], params:{}},
      lines:['∫_-∞^∞ δ(3x - 6) x^2 dx = ∫_-∞^∞ 3 δ(x - 2) x^2 dx', '= 3 · 4', '= 12'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['Der Faktor muss $\\tfrac13$ sein, nicht $3$.', 'Die Spitze liegt bei $x = 6$, nicht bei $2$.', 'Die Spitze liegt bei $x = -2$, nicht bei $2$.'], a:0, ex:'$\\delta(3x - 6) = \\delta(3(x - 2)) = \\tfrac13\\delta(x - 2)$. Substitution $u = 3x$: $dx = du/3$. Im Bild einer δ-Folge ist $\\delta_\\varepsilon(3x)$ bei gleicher Höhe dreimal schmaler und hat daher die Fläche $1/3$.'},
      fix:{id:'a', prompt:'Berichtige und berechne das Integral.', type:'value', target:'4/3', model:['∫_-∞^∞ δ(3x - 6) x^2 dx = 1/3 ∫_-∞^∞ δ(x - 2) x^2 dx', '= 4/3'],
        mistakes:[{expr:'12', msg:'$\\delta(3x - 6) = \\tfrac13\\delta(x - 2)$: Der Faktor ist $1/3$, nicht $3$.'}, {expr:'4', msg:'Der Faktor $1/|c| = 1/3$ fehlt.'}]}}
  ]
});
lexe('taylor', 'Taylor-Reihe', '$f(x) = \\sum_{n=0}^\\infty\\frac{f^{(n)}(x_0)}{n!}(x - x_0)^n$. Wichtige Reihen um $0$: $e^x = \\sum x^n/n!$, $\\sin x = x - x^3/3! + \\dots$, $\\cos x = 1 - x^2/2! + \\dots$, $\\ln(1 + x) = x - x^2/2 + \\dots$, $(1 + x)^a = 1 + ax + \\frac{a(a-1)}{2}x^2 + \\dots$ Konvergenz: $e^x$, $\\sin x$, $\\cos x$ für alle $x$; $\\ln(1 + x)$ für $-1 < x \\le 1$; $(1 + x)^a$ (für $a \\notin \\{0, 1, 2, \\dots\\}$) für $|x| < 1$, für $a \\in \\{0, 1, 2, \\dots\\}$ ist sie ein Polynom. Eine Näherung bis zur Ordnung $n$ hat einen Fehler der Ordnung $x^{n+1}$. Nahe einem Minimum: $V(x) \\approx V(x_0) + \\tfrac12V\'\'(x_0)(x - x_0)^2$.', {topic:'m-analysis'});
lexe('geometrische-reihe', 'Geometrische Reihe', '$\\sum_{n=0}^\\infty q^n = \\frac{1}{1 - q}$ für $|q| < 1$; endlich: $\\sum_{n=0}^{N-1}q^n = \\frac{1 - q^N}{1 - q}$ für $q \\neq 1$. Für $|q| \\ge 1$ divergiert die unendliche Reihe. Ableitungstrick: $\\sum_n n\\,q^n = q\\frac{d}{dq}\\frac{1}{1 - q} = \\frac{q}{(1 - q)^2}$.', {topic:'m-analysis'});
lexe('gauss-integral', 'Gauß-Integrale', 'Für $\\alpha > 0$ (allgemeiner $\\operatorname{Re}\\alpha > 0$, dann $\\sqrt{\\cdot}$ als Hauptwert mit positivem Realteil): $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$, $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$, $\\int_{-\\infty}^\\infty x^{2n+1}e^{-\\alpha x^2}dx = 0$ (ungerade), $\\int_0^\\infty x\\,e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}$. Höhere Momente durch Ableiten nach $\\alpha$. Mit linearem Term: quadratische Ergänzung.', {topic:'m-analysis'});
lexe('gammafunktion', 'Gammafunktion und Fakultät', '$\\Gamma(s) = \\int_0^\\infty t^{s-1}e^{-t}dt$ für $s > 0$, $\\Gamma(n + 1) = n!$, $\\Gamma(1/2) = \\sqrt\\pi$, $\\Gamma(s + 1) = s\\,\\Gamma(s)$. Daraus: $\\int_0^\\infty x^ne^{-kx}dx = n!/k^{n+1}$ für $k > 0$.', {topic:'m-analysis'});
lexe('delta-distribution', 'δ-Distribution', 'Definiert durch $\\int\\delta(x - a)f(x)\\,dx = f(a)$ (wenn $a$ im Inneren des Integrationsbereichs liegt und $f$ bei $a$ stetig ist, sonst $0$; liegt $a$ auf dem Rand, ist das Integral ohne Zusatzkonvention nicht definiert). Grenzwert schmaler werdender Funktionen mit Fläche 1, etwa $\\delta_\\varepsilon(x) = e^{-x^2/(2\\varepsilon^2)}/(\\sqrt{2\\pi}\\varepsilon)$. Regeln: $\\delta(cx) = \\delta(x)/|c|$, $\\delta(-x) = \\delta(x)$, $x\\,\\delta(x) = 0$, $\\Theta\'(x) = \\delta(x)$. Einheit: $1/[x]$. Fourier-Darstellung: $\\delta(x) = \\frac{1}{2\\pi}\\int e^{ikx}dk$. Nur unter Integralen sinnvoll; $\\delta(0)$ und $\\delta^2$ sind nicht definiert.', {topic:'m-analysis'});
lexe('stufenfunktion', 'Stufenfunktion (Heaviside)', '$\\Theta(x) = 0$ für $x < 0$, $\\Theta(x) = 1$ für $x > 0$. Im Sinne der Distributionen ist $\\Theta\'(x) = \\delta(x)$. Damit beschreibt man Potentialstufen, zum Beispiel $V(x) = V_0\\,\\Theta(x)$ (Thema 5).', {topic:'m-analysis'});
})();
