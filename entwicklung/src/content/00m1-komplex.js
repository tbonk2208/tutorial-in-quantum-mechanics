/* ===== Mathe M1: Komplexe Zahlen und Funktionen ===== */
(function(){
const R = String.raw;
topic({
  id:'m-komplex', ch:'math', title:'Komplexe Zahlen und Funktionen', short:'Komplexe Zahlen',
  src:'Boas (3. Aufl.) Kap. 2',
  goals:[
    'Ich kann mit komplexen Zahlen in kartesischer Form und in Polarform rechnen: $z^*$, $|z|^2$, Division, Phase.',
    'Ich kann die Euler-Formel anwenden: Potenzen, Wurzeln, $\\cos$ und $\\sin$ durch $e^{\\pm i\\varphi}$ ausdrücken.',
    'Ich kann Betragsquadrate von Summen wie $|z_1 + z_2|^2$ berechnen und den Interferenzterm deuten.'
  ],
  needs:'Rechnen mit Termen und Brüchen · Sinus und Kosinus am Einheitskreis · Ableitung der Exponentialfunktion',
  wozu:'Die Schrödingergleichung enthält $i$, und Wellenfunktionen sind komplexwertig. Messbar sind Betragsquadrate wie $|\\psi|^2$. Phasen werden erst in Überlagerungen sichtbar: als Streifenmuster beim Doppelspalt, als „Schwappen“ einer Dichte (Thema 2) oder als Präzession eines Spins in der Kernspinresonanz (Thema 10). Auch Wechselstromtechnik und Optik rechnen mit komplexen Amplituden, weil Schwingungen dann zu Multiplikationen werden.',
  bridge:'M1 setzt nur Schulmathematik voraus: Sinus und Kosinus am Einheitskreis, die Exponentialfunktion und die binomischen Formeln. Was hier neu ist – $|z|^2 = z^*z$, Polarform, Interferenzterm –, kehrt in fast jedem späteren Thema wieder, zuerst beim Normieren in Thema 1 und bei den stationären Zuständen in Thema 2.',
  check:[
    {q:'$i^2$ ist gleich …', opts:['$-1$', '$1$', '$i$'], a:0, ex:'Das ist die Definition der imaginären Einheit: $i^2 = -1$.', lex:'komplexe-zahlen'},
    {q:'Der Punkt $(\\cos\\varphi, \\sin\\varphi)$ liegt für jedes reelle $\\varphi$ …', opts:['auf dem Kreis mit Radius 1 um den Ursprung', 'auf der Geraden $y = x$', 'je nach $\\varphi$ innerhalb oder außerhalb des Einheitskreises'], a:0, ex:'$\\cos^2\\varphi + \\sin^2\\varphi = 1$. Genau deshalb liegt $e^{i\\varphi}$ auf dem Einheitskreis.', lex:'polarform'},
    {q:'$\\frac{d}{dx}e^{ax}$ ist für eine Konstante $a$ …', opts:['$a\\,e^{ax}$', '$e^{ax}$', '$x\\,e^{ax - 1}$'], a:0, ex:'Kettenregel. Das gilt auch für komplexes $a$, zum Beispiel $\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$.', lex:'euler'},
    {q:'$(a + b)^2$ ist …', opts:['$a^2 + 2ab + b^2$', '$a^2 + b^2$', '$a^2 - b^2$'], a:0, ex:'Der Mischterm $2ab$ ist wichtig. Bei komplexen Zahlen wird aus ihm der Interferenzterm $2\\operatorname{Re}(z_1^*z_2)$.', lex:'interferenzterm'}
  ],
  diag:[
    {q:'Wie beginnst du, um $|(2 - i)\\,e^{i\\omega t}|^2$ für reelle $\\omega, t$ zu berechnen?', opts:['Ich bilde $z^*z$ und konjugiere jeden Faktor.', 'Ich quadriere den Ausdruck, also $z\\cdot z$.', 'Ich ersetze $e^{i\\omega t}$ durch $\\cos\\omega t$.', 'weiß ich nicht'], a:0, ex:'$|z|^2 = z^*z$, und Beträge von Produkten multiplizieren sich: $|2 - i|^2\\cdot|e^{i\\omega t}|^2 = 5\\cdot 1 = 5$. Quadrieren gäbe $(3 - 4i)e^{2i\\omega t}$, und den Imaginärteil darf man nicht einfach weglassen.'},
    {q:'Wie beginnst du am geschicktesten, um $(1 + i)^{10}$ zu berechnen?', opts:['Ich schreibe $1 + i = \\sqrt2\\,e^{i\\pi/4}$.', 'Ich multipliziere zehnmal kartesisch aus.', 'Ich rechne $1^{10} + i^{10}$.', 'weiß ich nicht'], a:0, ex:'In Polarform: $(\\sqrt2)^{10}e^{10i\\pi/4} = 32\\,e^{i\\pi/2}\\,e^{2\\pi i} = 32i$. Ausmultiplizieren geht auch, ist aber lang und fehleranfällig. $(a + b)^n \\neq a^n + b^n$.'}
  ],
  phenomenon:{
    title:'Schwingt die Aufenthaltswahrscheinlichkeit?',
    text:'Ein Quantenzustand mit fester Energie $E$ hat die Zeitabhängigkeit $\\Psi(x,t) = \\psi(x)\\,e^{-i\\omega t}$ mit $\\omega = E/\\hbar$ und einer reellen Funktion $\\psi(x)$ (Thema 2). Sein Realteil $\\operatorname{Re}\\Psi = \\psi(x)\\cos\\omega t$ schwingt also hin und her.\n\nGemessen wird aber nicht $\\Psi$ selbst, sondern die Wahrscheinlichkeitsdichte $|\\Psi(x,t)|^2$.',
    q:{q:'Wie hängt $|\\Psi(x,t)|^2$ von der Zeit ab?', opts:['Sie ist zeitlich konstant.', 'Sie schwingt mit der Frequenz $\\omega$.', 'Sie schwingt mit $2\\omega$, wie $\\cos^2\\omega t$.', 'Sie nimmt mit der Zeit ab.'], a:0,
      ex:'$|e^{-i\\omega t}|^2 = e^{i\\omega t}e^{-i\\omega t} = 1$, also $|\\Psi|^2 = \\psi(x)^2$.',
      fb:[
        'Richtig. Der Phasenfaktor hat den Betrag 1: $|e^{-i\\omega t}|^2 = e^{i\\omega t}e^{-i\\omega t} = 1$. Er fällt aus dem Betragsquadrat heraus.',
        'Der Realteil schwingt mit $\\omega$. Aber $|\\Psi|^2$ ist nicht der Realteil, sondern $(\\operatorname{Re}\\Psi)^2 + (\\operatorname{Im}\\Psi)^2$. Der Imaginärteil $-\\psi\\sin\\omega t$ gleicht genau aus.',
        'So wäre es für $(\\operatorname{Re}\\Psi)^2 = \\psi^2\\cos^2\\omega t$. Zum Betragsquadrat gehört aber auch $(\\operatorname{Im}\\Psi)^2 = \\psi^2\\sin^2\\omega t$. Die Summe ist $\\psi^2$, also konstant.',
        'Ein Faktor $e^{-i\\omega t}$ mit reellem $\\omega$ hat immer den Betrag 1. Abklingen gäbe es nur mit einem reellen Exponenten wie $e^{-\\gamma t}$.'
      ]},
    reveal:'Mit $|z|^2 = z^*z$ gilt\n\n$$|\\Psi|^2 = \\psi(x)\\,e^{+i\\omega t}\\cdot\\psi(x)\\,e^{-i\\omega t} = \\psi(x)^2.$$\n\nDie Dichte ist **zeitlich konstant**. Darum heißen solche Zustände stationär. Die Zahl $e^{-i\\omega t}$ läuft auf dem Einheitskreis um: Ihr Realteil schwingt, ihr Betrag nicht.\n\nSpannend wird es bei einer Überlagerung zweier Energien, $\\Psi = \\psi_1e^{-i\\omega_1t} + \\psi_2e^{-i\\omega_2t}$. Dann enthält $|\\Psi|^2$ den Mischterm $2\\psi_1\\psi_2\\cos((\\omega_2 - \\omega_1)t)$, und die Dichte schwappt hin und her. Wie man solche Betragsquadrate rechnet, lernst du in diesem Thema.'
  },
  teach:[
    /* ===== Abschnitt 1: kartesische Form, Zeiger, Konjugation, Betragsquadrat, Division ===== */
    {id:'mk-t1', title:'Rechnen mit komplexen Zahlen: Konjugation und Betrag', steps:[
      {id:'mk-t1a', title:'Die imaginäre Einheit und die Zahlenebene',
        num:{title:R`Die Zahl $3 + 4i$`, text:R`Ein Beispiel: $z = 3 + 4i$. Ihr Realteil ist $\operatorname{Re}z = 3$, ihr Imaginärteil $\operatorname{Im}z = 4$ – die reelle Zahl vor dem $i$, nicht $4i$. In der Zahlenebene ist $z$ der Punkt

$$(\operatorname{Re}z,\ \operatorname{Im}z) = (3,\ 4),$$

drei Einheiten nach rechts, vier nach oben.`},
        text:R`Die Gleichung $x^2 = -1$ hat keine reelle Lösung. Man erweitert deshalb die Zahlen um die **imaginäre Einheit** $i$ mit $i^2 = -1$. Eine [[lex:komplexe-zahlen|komplexe Zahl]] ist $z = a + ib$ mit zwei reellen Zahlen: dem **Realteil** $a = \operatorname{Re}z$ und dem **Imaginärteil** $b = \operatorname{Im}z$. Achtung: Der Imaginärteil ist $b$, nicht $ib$.

Jede komplexe Zahl ist also ein Paar reeller Zahlen. Man zeichnet sie als Punkt in die **komplexe Zahlenebene**: waagerecht der Realteil, senkrecht der Imaginärteil. Oft zeichnet man zusätzlich einen Pfeil vom Ursprung zum Punkt, den **Zeiger** von $z$.`,
        q:{q:R`Welchen Imaginärteil hat $z = 2 - 5i$?`,
          opts:[R`$-5i$`, R`$-5$`, R`$2$`], a:1,
          ex:R`$\operatorname{Im}z$ ist die reelle Zahl vor dem $i$, mit Vorzeichen: $-5$. Der Punkt liegt bei $(2, -5)$.`,
          fb:[R`Das ist der ganze imaginäre Summand $ib$. Der Imaginärteil ist nur die reelle Zahl $b = -5$.`,
            '',
            R`$2$ ist der Realteil, die waagerechte Koordinate.`]}},
      {id:'mk-t1b', title:'Addieren und Multiplizieren',
        num:{title:'Zwei Zahlen', text:R`Mit $z_1 = 1 + 2i$ und $z_2 = 3 - i$ ist die Summe $z_1 + z_2 = 4 + i$: Realteile und Imaginärteile getrennt addiert. Das Produkt rechnest du wie mit Klammern und ersetzt am Ende $i^2$ durch $-1$:

$$(1 + 2i)(3 - i) = 3 - i + 6i - 2i^2 = 3 + 5i + 2 = 5 + 5i.$$`},
        text:R`Addiert wird Teil für Teil: $(a + ib) + (c + id) = (a + c) + i(b + d)$. In der Zahlenebene heißt das: Du hängst den Zeiger von $z_2$ an die Spitze des Zeigers von $z_1$, wie bei Pfeilen aus der Schule.

Multipliziert wird mit dem Distributivgesetz, wobei du $i$ wie eine Variable behandelst. Neu ist nur eine Regel: Jedes $i^2$ wird zu $-1$. So entsteht aus zwei komplexen Zahlen wieder eine Zahl der Form $a + ib$. Was das Multiplizieren in der Ebene bedeutet, zeigt erst die Polarform in Abschnitt 2: Es dreht und streckt den Zeiger.`,
        q:{q:R`Was ist $(2 + i)(1 - i)$?`,
          opts:[R`$3 - i$`, R`$1 - i$`, R`$3 + i$`], a:0,
          ex:R`$2 - 2i + i - i^2 = 2 - i + 1 = 3 - i$.`,
          fb:['',
            R`Hier wurde $-i^2$ als $-1$ gezählt. Es ist $-i\cdot i = -i^2 = +1$.`,
            R`Prüfe den Imaginärteil: $-2i + i = -i$, nicht $+i$.`]}},
      {id:'mk-t1c', title:'Konjugieren: Spiegeln an der reellen Achse',
        num:{title:R`Die Konjugierte von $3 + 4i$`, text:R`Für $z = 3 + 4i$ ist $z^* = 3 - 4i$, der Punkt $(3, -4)$. Summe und Differenz liefern die beiden Teile zurück:

$$z + z^* = 6 = 2\operatorname{Re}z,\qquad z - z^* = 8i = 2i\operatorname{Im}z.$$`},
        text:R`**Konjugieren** heißt, überall $i$ durch $-i$ zu ersetzen: Zu $z = a + ib$ gehört $z^* = a - ib$, gelesen „z Stern“. In der Ebene ist das die Spiegelung an der reellen Achse. Im Labor siehst du beide Zeiger: Mit den Reglern stellst du Länge und Winkel des Pfeils $z$ ein; der Pfeil $z^*$ hat dieselbe Länge und den entgegengesetzten Winkel.

Konjugieren verträgt sich mit Summe und Produkt: $(z_1 + z_2)^* = z_1^* + z_2^*$ und $(z_1z_2)^* = z_1^*z_2^*$. Aus $z$ und $z^*$ gewinnst du die Teile zurück: $\operatorname{Re}z = \tfrac12(z + z^*)$ und $\operatorname{Im}z = \tfrac{1}{2i}(z - z^*)$. Eine Zahl ist genau dann reell, wenn $z^* = z$ gilt.`,
        fig:{lab:'complex', caption:R`Der Pfeil $z$ und sein Spiegelbild $z^*$ an der reellen Achse („Re“, waagerecht). Beide haben denselben Abstand vom Ursprung. Die Anzeige zeigt außerdem $|z|^2 = z^*z$ (nächster Schritt).`},
        q:{q:R`Wo liegt $z^*$ für $z = -1 + 2i$?`,
          opts:[R`bei $-1 - 2i$`, R`bei $1 - 2i$`, R`bei $1 + 2i$`], a:0,
          ex:R`Nur der Imaginärteil wechselt das Vorzeichen; der Realteil $-1$ bleibt. Das ist die Spiegelung an der waagerechten Achse.`,
          fb:['',
            R`Das ist $-z$, die Spiegelung am Ursprung: Beide Teile haben das Vorzeichen gewechselt.`,
            R`Das ist $-z^*$, die Spiegelung an der senkrechten Achse.`]}},
      {id:'mk-t1d', title:R`Das Betragsquadrat: $|z|^2 = z^*z$`,
        num:{title:R`Wie weit ist $3 + 4i$ vom Ursprung entfernt?`, text:R`Nach Pythagoras ist der Abstand von $(3, 4)$ zum Ursprung $\sqrt{3^2 + 4^2} = 5$. Dieselbe Zahl $25 = 5^2$ liefert das Produkt mit der Konjugierten:

$$z^*z = (3 - 4i)(3 + 4i) = 9 + 12i - 12i - 16i^2 = 9 + 16 = 25.$$

Die Mischterme $\pm 12i$ heben sich auf.`},
        text:R`Der **Betrag** $|z|$ ist der Abstand des Punktes $z$ vom Ursprung, nach Pythagoras $|z| = \sqrt{a^2 + b^2}$. Sein Quadrat erhältst du auch ohne Wurzel, als Produkt mit der Konjugierten:

$$|z|^2 = z^*z = a^2 + b^2 \ge 0.$$

Die Herleitung zeigt, warum: Die Mischterme heben sich auf, und $-i^2b^2$ wird zu $+b^2$. Übrig bleibt eine Summe zweier reeller Quadrate, also nie etwas Negatives. Diese Formel ist die wichtigste des Themas; sie kehrt in fast jedem späteren Thema wieder.`,
        derive:{ctx:{coords:['x'], params:{a:'real', b:'real'}},
          lines:[
            {l:'|a + i b|^2 = (a - i b)(a + i b)', w:'$|z|^2 = z^*z$', why:{q:'Warum steht vorn der Faktor $a - ib$?', opts:['Das ist $z^*$: $i$ wird durch $-i$ ersetzt.', 'Das ist $-z$, also $z$ mit Minus davor.', 'Das ist $1/z$, damit das Produkt reell wird.'], a:0, ex:'$z^* = a - ib$. Dagegen ist $-z = -a - ib$ und $1/z = (a - ib)/(a^2 + b^2)$.'}},
            {l:'= a^2 - i^2 b^2', w:'dritte binomische Formel', why:{q:'Wohin sind die Mischterme $\\pm iab$ verschwunden?', opts:['Sie heben sich auf: $+iab - iab = 0$.', 'Sie sind imaginär und werden weggelassen.', 'Sie stecken im Term $-i^2b^2$.'], a:0, ex:'$(a - ib)(a + ib) = a^2 + iab - iab - i^2b^2$. Die Mischterme heben sich genau auf. Man lässt nie etwas weg, nur weil es imaginär ist.'}},
            {l:'= a^2 + b^2', w:'i² = −1', why:{q:'Warum ist das Ergebnis nie negativ?', opts:['Weil $a^2$ und $b^2$ reelle Quadrate sind.', 'Weil $i^2 = +1$ ist.', 'Weil man am Ende den Betrag nimmt.'], a:0, ex:'Für reelle $a, b$ ist $a^2 \\ge 0$ und $b^2 \\ge 0$. Es gilt $i^2 = -1$; das Minus vor $i^2b^2$ macht daraus $+b^2$.'}}
          ]},
        q:{q:R`Was ist $(2 - i)^*\,(2 - i)$?`,
          opts:[R`$3 - 4i$`, R`$3$`, R`$5$`], a:2,
          ex:R`$(2 + i)(2 - i) = 4 + 1 = 5 = |2 - i|^2$.`,
          fb:[R`Das ist $(2 - i)^2$, das Quadrat ohne Konjugation.`,
            R`So wäre es, wenn man $b^2$ abzieht: $2^2 - 1^2$. Mit Konjugation addieren sich die Quadrate.`,
            '']}},
      {id:'mk-t1e', title:'Das Betragsquadrat in vier Gestalten',
        num:{title:'Im Labor', text:R`Stellst du im Labor „Betrag r“ auf $1{,}2$, zeigt die Anzeige $|z|^2 = z^*z = 1{,}44$ – bei jeder Stellung von „Phase φ“. Steht die Phase auf $0{,}93$ ($53°$), ist $z \approx 0{,}72 + 0{,}96\,i$, und tatsächlich ist $0{,}72^2 + 0{,}96^2 = 0{,}5184 + 0{,}9216 = 1{,}44$.`},
        text:R`Das Betragsquadrat zeigt gut, dass ein Objekt mehrere Gestalten hat. In Worten ist es das Quadrat des Abstands vom Ursprung. Als Formel ist es $z^*z$, ein Produkt ohne Wurzel. Geometrisch ist es Pythagoras mit Real- und Imaginärteil als Katheten. Im Labor ist es die Anzeige, die nur vom Regler „Betrag r“ abhängt.

Dazu kommt eine physikalische Bedeutung, die dir in fast jedem späteren Thema begegnet: Messbar ist bei komplexen Größen meist nur das Betragsquadrat. Die Tafel stellt die Gestalten nebeneinander und sagt, wie du von einer zur nächsten kommst.`,
        reps:{obj:R`Das Betragsquadrat von $z = 3 + 4i$`,
          rows:[
            {k:'worte', text:R`Wie weit liegt der Punkt $z$ vom Ursprung entfernt – zum Quadrat genommen?`},
            {k:'formel', tex:R`|z|^2 = z^*z = (3 - 4i)(3 + 4i) = 25`},
            {k:'mathe', text:'Pythagoras in der Zahlenebene', tex:R`\begin{aligned}|z|^2 &= (\operatorname{Re}z)^2 + (\operatorname{Im}z)^2\\ &= 3^2 + 4^2 = 25\end{aligned}`},
            {k:'labor', text:R`„Betrag r“ auf $r$ stellen: Die Anzeige zeigt $|z|^2 = z^*z = r^2$. „Phase φ“ dreht den Pfeil, ändert diese Anzeige aber nicht.`},
            {k:'physik', text:R`**Ausblick (Thema 1):** Eine Wellenfunktion $\psi(x)$ ordnet jedem Ort eine komplexe Zahl zu. Gemessen wird ihr Betragsquadrat $|\psi(x)|^2 = \psi^*(x)\,\psi(x)$: die Wahrscheinlichkeitsdichte, das Teilchen bei $x$ zu finden. Sie muss reell und nicht negativ sein – $z^*z$ ist das immer.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Den Abstand nicht mit einer Wurzel ausrechnen, sondern $z$ mit seiner Konjugierten multiplizieren: $z^*z$.`},
            {from:'formel', to:'mathe', rule:R`Ausmultiplizieren: Die Mischterme heben sich auf, $-i^2b^2$ wird $+b^2$. Übrig bleiben die Quadrate von Real- und Imaginärteil.`},
            {from:'mathe', to:'labor', rule:R`Die Länge des Pfeils auf „Betrag r“ stellen; die Anzeige quadriert sie.`},
            {from:'labor', to:'physik', rule:R`Den Zeiger als Wert von $\psi$ an einer Stelle lesen: Seine Länge zum Quadrat ist die Dichte dort. Der Winkel spielt für die Dichte keine Rolle.`}
          ]},
        q:{q:R`Im Labor steht „Betrag r“ auf $0{,}5$ und „Phase φ“ auf $2$. Welchen Wert zeigt die Anzeige $|z|^2 = z^*z$?`, tr:{from:'labor', to:'formel'},
          opts:[R`$0{,}5$`, R`$0{,}25$`, R`$0{,}25\cos^2 2 \approx 0{,}04$`], a:1,
          ex:R`$z^*z = r^2 = 0{,}25$, unabhängig vom Winkel.`,
          fb:[R`Das ist der Betrag $r$ selbst. Die Anzeige zeigt sein Quadrat.`,
            '',
            R`Das wäre $(\operatorname{Re}z)^2$ allein. Zum Betragsquadrat gehört auch $(\operatorname{Im}z)^2$; zusammen ergeben sie $r^2$.`]}},
      {id:'mk-t1f', title:R`Typischer Fehler: $|z|^2$ mit $z^2$ verwechseln`,
        num:{title:R`$z = 1 + i$`, text:R`Quadriert: $z^2 = 1 + 2i + i^2 = 2i$ – komplex, kein Abstand. Mit Konjugation: $|z|^2 = (1 - i)(1 + i) = 1 + 1 = 2$. Ein zweiter Fehler: $|1 + i|^2 = 1^2 + i^2 = 0$. Dabei wurde der Imaginärteil $1$ mit $i$ verwechselt.`},
        text:R`Für reelle Zahlen ist $|x|^2 = x^2$. Deshalb liegt es nahe, auch bei komplexen Zahlen einfach zu quadrieren. Das ist der häufigste Fehler mit komplexen Zahlen. $z^2$ ist im Allgemeinen komplex, $|z|^2$ dagegen immer reell und nicht negativ.

Ein schneller Test hilft: Kommt bei einem Betragsquadrat etwas Komplexes oder Negatives heraus, fehlt eine Konjugation. Achte außerdem darauf, in $a^2 + b^2$ den Imaginärteil $b$ einzusetzen, nicht $ib$. Beide Fehler fallen bei reellen Zahlen nicht auf und schleichen sich deshalb leicht ein.`,
        q:{q:R`Welche Aussage gilt für jedes $z = a + ib$?`,
          opts:[R`$z^2$ ist reell und $\ge 0$.`, R`$z + z^*$ ist rein imaginär.`, R`$z^*z$ ist reell und $\ge 0$.`], a:2,
          ex:R`$z^*z = a^2 + b^2$. Dagegen ist $z^2 = a^2 - b^2 + 2iab$ im Allgemeinen komplex, und $z + z^* = 2a$ ist reell.`,
          fb:[R`$z^2 = a^2 - b^2 + 2iab$ ist für $z = i$ sogar $-1$.`,
            R`$z + z^* = 2a$ ist reell. Rein imaginär ist $z - z^*$.`,
            '']}},
      {id:'mk-t1g', title:'Division: den Nenner reell machen',
        num:{title:R`$1/(3 + 4i)$`, text:R`Erweitere mit der Konjugierten des Nenners. Unten steht dann $z^*z = 25$:

$$\frac{1}{3 + 4i} = \frac{3 - 4i}{(3 + 4i)(3 - 4i)} = \frac{3 - 4i}{25} = 0{,}12 - 0{,}16\,i.$$

Probe: $(3 + 4i)\cdot\frac{3 - 4i}{25} = \frac{25}{25} = 1$.`},
        text:R`Durch eine komplexe Zahl teilst du mit einem Trick: Erweitere den Bruch mit der Konjugierten des Nenners. Der neue Nenner ist dann ein Betragsquadrat und damit reell:

$$\frac{1}{a + ib} = \frac{a - ib}{a^2 + b^2}.$$

Jetzt kannst du Real- und Imaginärteil einzeln durch die reelle Zahl $a^2 + b^2$ teilen. Für einen Bruch $w/z$ multiplizierst du Zähler und Nenner mit $z^*$. Mache am Ende die Probe: Ergebnis mal Nenner muss den Zähler geben.`,
        q:{q:R`Was ist $\dfrac{1}{2 + i}$?`,
          opts:[R`$\tfrac{2 + i}{5}$`, R`$\tfrac{2 - i}{3}$`, R`$\tfrac{2 - i}{5}$`], a:2,
          ex:R`$\frac{2 - i}{(2 + i)(2 - i)} = \frac{2 - i}{4 + 1}$. Probe: $(2 + i)(2 - i) = 5$, geteilt durch 5 gibt 1.`,
          fb:[R`Im Zähler muss die Konjugierte stehen. $(2 + i)\cdot\frac{2 + i}{5} = \frac{3 + 4i}{5} \ne 1$.`,
            R`Der Nenner ist $(2 + i)(2 - i) = 4 - i^2 = 5$, nicht $4 - 1$.`,
            '']}}
    ]},

    /* ===== Abschnitt 2: Polarform, Euler-Formel, vier Gestalten einer Zahl, Multiplikation ===== */
    {id:'mk-t2', title:'Polarform und Euler-Formel', steps:[
      {id:'mk-t2a', title:'Abstand und Winkel statt Real- und Imaginärteil',
        num:{title:R`$z = 1 + i$ in Polarkoordinaten`, text:R`Der Punkt $(1, 1)$ hat den Abstand $r = \sqrt{1^2 + 1^2} = \sqrt2$ vom Ursprung. Sein Winkel zur positiven reellen Achse erfüllt $\cos\varphi = 1/\sqrt2$ und $\sin\varphi = 1/\sqrt2$, also $\varphi = \pi/4$, das sind $45°$. Damit ist

$$1 + i = \sqrt2\left(\cos\tfrac\pi4 + i\sin\tfrac\pi4\right).$$`},
        text:R`Einen Punkt der Ebene kannst du statt durch Real- und Imaginärteil auch durch seinen **Abstand** $r = |z|$ vom Ursprung und den **Winkel** $\varphi$ zur positiven reellen Achse beschreiben. Aus dem rechtwinkligen Dreieck folgt $a = r\cos\varphi$ und $b = r\sin\varphi$, also

$$z = r(\cos\varphi + i\sin\varphi).$$

Der Winkel heißt **Phase** oder Argument, $\varphi = \arg z$. Er ist nur bis auf Vielfache von $2\pi$ bestimmt, denn eine volle Drehung führt zum selben Punkt. Üblich ist der Hauptwert $-\pi < \varphi \le \pi$. Winkel misst du hier im Bogenmaß.`,
        q:{q:R`Welche Phase (Hauptwert) hat $z = -2i$?`,
          opts:[R`$\pi/2$`, R`$3\pi/2$`, R`$-\pi/2$`], a:2,
          ex:R`$-2i$ liegt auf der negativen imaginären Achse: $r = 2$, $\cos\varphi = 0$, $\sin\varphi = -1$. Im Bereich $(-\pi, \pi]$ ist das $\varphi = -\pi/2$.`,
          fb:[R`$\pi/2$ zeigt nach oben, zu $+2i$.`,
            R`Die Richtung stimmt, aber $3\pi/2$ liegt nicht im Bereich $-\pi < \varphi \le \pi$. Ziehe $2\pi$ ab.`,
            '']}},
      {id:'mk-t2b', title:'Die Euler-Formel',
        num:{title:R`$\cos\varphi + i\sin\varphi$ an vier Stellen`, text:R`Setze vier Winkel ein:

$$\varphi = 0:\ 1,\qquad \varphi = \tfrac\pi2:\ i,\qquad \varphi = \pi:\ -1,\qquad \varphi = 2\pi:\ 1.$$

Der Punkt läuft auf dem Kreis mit Radius 1 einmal herum. Sein Abstand vom Ursprung ist immer $\sqrt{\cos^2\varphi + \sin^2\varphi} = 1$.`},
        text:R`Die [[lex:euler|Euler-Formel]] schreibt die Klammer der Polarform als Exponentialfunktion:

$$e^{i\varphi} = \cos\varphi + i\sin\varphi.$$

Lies sie als **Definition** von $e^{i\varphi}$. Dass der Name passt, prüft die Herleitung: Die rechte Seite hat bei $\varphi = 0$ den Wert $1$, und ihre Ableitung ist $i$ mal sie selbst – so wie $\frac{d}{d\varphi}e^{a\varphi} = a\,e^{a\varphi}$ mit $a = i$. Für reelles $\varphi$ liegt $e^{i\varphi}$ immer auf dem Einheitskreis, $|e^{i\varphi}| = 1$. Damit wird die Polarform kurz: $z = re^{i\varphi}$. **Ausblick (M2):** Einen zweiten Weg zeigt die Potenzreihe von $e^x$. Setzt man $i\varphi$ ein, ergeben die geraden Potenzen die Kosinusreihe und die ungeraden $i$ mal die Sinusreihe.`,
        derive:{title:R`Herleitung: $\cos\varphi + i\sin\varphi$ verhält sich beim Ableiten wie $e^{i\varphi}$`, ctx:{coords:['φ'], params:{θ:'real'}},
          lines:[
            {l:'d/dφ (cos φ + i sin φ) = -sin φ + i cos φ', w:'Real- und Imaginärteil getrennt ableiten', why:{q:'Wie leitet man eine komplexwertige Funktion einer reellen Variablen ab?', opts:['Real- und Imaginärteil getrennt; $i$ ist eine Konstante.', 'Erst den Betrag $|\\cos\\varphi + i\\sin\\varphi|$ bilden, dann ableiten.', 'Nur den Realteil $\\cos\\varphi$ ableiten; $i\\sin\\varphi$ ist konstant.'], a:0, ex:'$i$ ist eine feste Zahl. $\\frac{d}{d\\varphi}\\cos\\varphi = -\\sin\\varphi$ und $\\frac{d}{d\\varphi}(i\\sin\\varphi) = i\\cos\\varphi$.'}},
            {l:'= i (cos φ + i sin φ)', w:'i ausklammern', why:{q:'Warum darf man $i$ so ausklammern?', opts:['Weil $i\\cdot i\\sin\\varphi = -\\sin\\varphi$ ist.', 'Weil man $\\varphi = 0$ einsetzen darf.', 'Weil $\\sin$ und $\\cos$ vertauschbar sind.'], a:0, ex:'Ausmultiplizieren: $i\\cos\\varphi + i^2\\sin\\varphi = -\\sin\\varphi + i\\cos\\varphi$. Also gilt $f\' = if$, wie bei $e^{i\\varphi}$.'}}
          ]},
        q:{q:R`Was ist $e^{-i\pi/2}$?`,
          opts:[R`$-i$`, R`$i$`, R`$-1$`], a:0,
          ex:R`$\cos(-\tfrac\pi2) + i\sin(-\tfrac\pi2) = 0 - i$. Der Punkt liegt eine Vierteldrehung im Uhrzeigersinn von $1$ entfernt.`,
          fb:['',
            R`$i = e^{+i\pi/2}$. Das Minus im Exponenten dreht in die andere Richtung.`,
            R`$-1 = e^{i\pi}$ ist eine halbe Drehung; $-\pi/2$ ist nur eine Vierteldrehung.`]}},
      {id:'mk-t2c', title:'Eine Zahl, vier Gestalten',
        num:{title:R`$z = 1 + i$ im Labor`, text:R`Stell im Labor „Betrag r“ auf $1{,}41 \approx \sqrt2$ und „Phase φ“ auf $0{,}79$, das ist genau $\pi/4 = 45°$; der Regler rastet in Schritten von $1°$ ein. Die Anzeige zeigt dann $z = 1{,}00 + 1{,}00\,i$, also $1 + i$, denn

$$\sqrt2\cos\tfrac\pi4 = \sqrt2\sin\tfrac\pi4 = 1.$$

Nur $|z|^2 = 1{,}99$ verrät, dass $1{,}41$ etwas kleiner als $\sqrt2$ ist.`},
        text:R`Jetzt kennst du vier Gestalten derselben Zahl: den Zeiger, den du in Worten beschreibst oder im Labor einstellst, die **kartesische Form** $a + ib$ und die **Polarform** $re^{i\varphi}$. Keine ist „die richtige“. Jede passt zu einer anderen Rechnung: Addieren geht kartesisch am einfachsten, Multiplizieren in Polarform (nächster Schritt).

Übersetzen musst du in beide Richtungen. Von polar nach kartesisch ist es leicht: $a = r\cos\varphi$, $b = r\sin\varphi$. Umgekehrt brauchst du $r = \sqrt{a^2 + b^2}$ und für $\varphi$ **beide** Bedingungen $\cos\varphi = a/r$ und $\sin\varphi = b/r$. Die Tafel zeigt den ganzen Weg.`,
        reps:{obj:R`Die Zahl $z = 1 + i$`,
          rows:[
            {k:'worte', text:R`Ein Zeiger der Länge $\sqrt2 \approx 1{,}41$, um $45°$ gegen den Uhrzeigersinn von der positiven reellen Achse aus gedreht.`},
            {k:'labor', text:R`„Betrag r“ auf $1{,}41$, „Phase φ“ auf $0{,}79$ ($45°$). Die Anzeige: $z = 1{,}00 + 1{,}00\,i$, $|z|^2 = z^*z = 1{,}99$, $\arg z = 0{,}79$.`},
            {k:'formel', text:'kartesische Form', tex:R`z = a + ib = 1 + i`},
            {k:'mathe', text:'Polarform mit der Euler-Formel', tex:R`\begin{aligned}z &= r\,e^{i\varphi} = \sqrt2\,e^{i\pi/4}\\ &= \sqrt2\left(\cos\tfrac\pi4 + i\sin\tfrac\pi4\right)\end{aligned}`},
            {k:'physik', text:R`**Ausblick (Thema 1 bis 4):** Eine Wellenfunktion ordnet jedem Ort $x$ einen solchen Zeiger $\psi(x) = r(x)\,e^{i\varphi(x)}$ zu. Die Länge bestimmt die Dichte $r^2$, der Winkel heißt auch dort Phase. Bei der ebenen Welle $e^{ikx}$ dreht sich der Zeiger gleichmäßig, wenn man in $x$-Richtung weitergeht.`}
          ],
          links:[
            {from:'worte', to:'labor', rule:R`Die Länge auf „Betrag r“ stellen, den Winkel ins Bogenmaß umrechnen ($45° = \pi/4 \approx 0{,}79$) und auf „Phase φ“ stellen.`},
            {from:'labor', to:'formel', rule:R`Real- und Imaginärteil sind die Schatten des Zeigers auf die Achsen: $a = r\cos\varphi$, $b = r\sin\varphi$. Die Anzeige rechnet sie aus.`},
            {from:'formel', to:'mathe', rule:R`$r = \sqrt{a^2 + b^2}$ ausrechnen, dann $\varphi$ aus $\cos\varphi = a/r$ **und** $\sin\varphi = b/r$ bestimmen und $re^{i\varphi}$ schreiben.`},
            {from:'mathe', to:'physik', rule:R`$r$ als „wie viel“ und $\varphi$ als „wie gedreht“ lesen. Die Dichte hängt nur von $r$ ab; die Phase wird erst sichtbar, wenn sich zwei Zeiger addieren (Abschnitt 5).`}
          ]},
        q:{q:R`Welche Polarform hat $z = -1 - i\sqrt3$?`, tr:{from:'formel', to:'mathe'},
          opts:[R`$2\,e^{i\pi/3}$`, R`$2\,e^{-2i\pi/3}$`, R`$4\,e^{-2i\pi/3}$`], a:1,
          ex:R`$r = \sqrt{1 + 3} = 2$. $\cos\varphi = -\tfrac12$ und $\sin\varphi = -\tfrac{\sqrt3}{2}$: dritter Quadrant, also $\varphi = -2\pi/3$.`,
          fb:[R`$\arctan\big((-\sqrt3)/(-1)\big) = \arctan\sqrt3 = \pi/3$ zeigt in den ersten Quadranten; $2\,e^{i\pi/3} = 1 + i\sqrt3$.`,
            '',
            R`Die Richtung stimmt. Aber $r = \sqrt{a^2 + b^2} = 2$; $4 = a^2 + b^2$ ist $r^2$.`]}},
      {id:'mk-t2d', title:'Multiplizieren: Beträge mal, Phasen plus',
        num:{title:R`$(1 + i)^2$ auf zwei Wegen`, text:R`Kartesisch: $(1 + i)(1 + i) = 1 + 2i + i^2 = 2i$. In Polarform:

$$\sqrt2\,e^{i\pi/4}\cdot\sqrt2\,e^{i\pi/4} = 2\,e^{i\pi/2} = 2i.$$

Der Betrag wird $\sqrt2\cdot\sqrt2 = 2$, der Winkel $\tfrac\pi4 + \tfrac\pi4 = \tfrac\pi2$.`},
        text:R`Die Herleitung multipliziert zwei Zahlen vom Betrag 1 aus. Mit den Additionstheoremen folgt $e^{i\varphi}e^{i\theta} = e^{i(\varphi + \theta)}$. Für beliebige Zahlen heißt das

$$z_1z_2 = r_1r_2\,e^{i(\varphi_1 + \varphi_2)}.$$

**Beträge multiplizieren sich, Phasen addieren sich.** Multiplizieren mit $e^{i\alpha}$ dreht einen Zeiger um den Winkel $\alpha$ und lässt seine Länge gleich; mit $i = e^{i\pi/2}$ dreht es um $90°$. Konjugieren kehrt die Phase um, $z^* = re^{-i\varphi}$. Daraus folgt sofort wieder $z^*z = r^2$.`,
        derive:{title:'Herleitung: Phasen addieren sich', ctx:{coords:['φ'], params:{θ:'real'}},
          lines:[
            {l:'(cos φ + i sin φ)(cos θ + i sin θ) = cos φ cos θ - sin φ sin θ + i (sin φ cos θ + cos φ sin θ)', w:'ausmultiplizieren, i² = −1', why:{q:'Woher kommt das Minus vor $\\sin\\varphi\\sin\\theta$?', opts:['aus $i\\sin\\varphi\\cdot i\\sin\\theta = i^2\\sin\\varphi\\sin\\theta$', 'aus der Ableitung $(\\cos\\varphi)\' = -\\sin\\varphi$', 'aus dem Konjugieren $(i\\sin\\theta)^* = -i\\sin\\theta$'], a:0, ex:'Das Produkt der beiden Imaginärteile enthält $i^2 = -1$. Konjugiert wird hier nichts.'}},
            {l:'= cos(φ + θ) + i sin(φ + θ)', w:'Additionstheoreme', why:{q:'Was bedeutet das Ergebnis für $e^{i\\varphi}e^{i\\theta}$?', opts:['$e^{i\\varphi}e^{i\\theta} = e^{i(\\varphi + \\theta)}$: Phasen addieren sich.', '$e^{i\\varphi}e^{i\\theta} = e^{i\\varphi\\theta}$: Phasen multiplizieren sich.', '$e^{i\\varphi}e^{i\\theta} = \\cos(\\varphi\\theta)$, die Zahl wird reell.'], a:0, ex:'Die rechte Seite ist nach Euler $e^{i(\\varphi + \\theta)}$. Die Rechenregel für Exponenten gilt also auch für imaginäre Exponenten.'}}
          ]},
        q:{q:R`Was macht die Multiplikation mit $i$ aus $1 + i$?`,
          opts:[R`Sie spiegelt den Punkt an der reellen Achse.`, R`Sie dreht ihn um $90°$ gegen den Uhrzeigersinn.`, R`Sie streckt ihn um den Faktor $\sqrt2$.`], a:1,
          ex:R`$i = e^{i\pi/2}$ hat Betrag 1 und Phase $\pi/2$: $i(1 + i) = -1 + i$.`,
          fb:[R`Spiegeln wäre Konjugieren; das ergäbe $1 - i$.`,
            '',
            R`$|i| = 1$: Die Länge bleibt gleich. $\sqrt2$ ist die Länge von $1 + i$ selbst.`]}},
      {id:'mk-t2e', title:'Typischer Fehler: die Phase nur mit arctan bestimmen',
        num:{title:R`$z = -1 - i$`, text:R`Hier ist $b/a = 1$ und $\arctan 1 = \pi/4$. Dieser Winkel zeigt aber in den ersten Quadranten, zu $1 + i$. Der Punkt $(-1, -1)$ liegt im dritten. Richtig ist $\varphi = -3\pi/4$, also $-1 - i = \sqrt2\,e^{-3i\pi/4}$.`},
        text:R`Die Formel $\varphi = \arctan(b/a)$ liefert nur Winkel zwischen $-\pi/2$ und $\pi/2$, also nur die rechte Halbebene. Für $a < 0$ ist sie falsch, für $a = 0$ gar nicht definiert; dann ist $\varphi = \pm\pi/2$, je nach Vorzeichen von $b$. Der Grund: $b/a$ ist für $z$ und $-z$ gleich, der Tangens kann die beiden nicht unterscheiden.

Sicher gehst du so vor: Zeichne die Zahl kurz und bestimme den Quadranten. Prüfe dann beide Bedingungen $\cos\varphi = a/r$ und $\sin\varphi = b/r$. Das verhindert diesen Fehler zuverlässig.`,
        q:{q:R`Welche Phase (Hauptwert) hat $z = -\sqrt3 + i$?`,
          opts:[R`$5\pi/6$`, R`$-\pi/6$`, R`$\pi/6$`], a:0,
          ex:R`$r = 2$, $\cos\varphi = -\sqrt3/2$, $\sin\varphi = 1/2$: zweiter Quadrant, also $\varphi = \pi - \pi/6$.`,
          fb:['',
            R`$\arctan\big(1/(-\sqrt3)\big) = -\pi/6$ zeigt in den vierten Quadranten, zu $\sqrt3 - i$.`,
            R`$\pi/6$ gehört zu $\sqrt3 + i$. Hier ist der Realteil negativ.`]}}
    ]},

    /* ===== Abschnitt 3: Potenzen, Wurzeln, trigonometrische Formeln ===== */
    {id:'mk-t3', title:'Potenzen, Wurzeln und trigonometrische Formeln', steps:[
      {id:'mk-t3a', title:'Potenzen: Betrag hoch n, Phase mal n',
        num:{title:R`$(1 + i)^4$`, text:R`In Polarform ist

$$(1 + i)^4 = (\sqrt2)^4\,e^{4i\pi/4} = 4\,e^{i\pi} = -4.$$

Kartesisch zur Probe: $(1 + i)^2 = 2i$, und $(2i)^2 = 4i^2 = -4$.`},
        text:R`Multiplizierst du $n$-mal dieselbe Zahl, multipliziert sich der Betrag $n$-mal mit sich, und die Phase wird $n$-mal addiert. Das ist die Formel von de Moivre:

$$(re^{i\varphi})^n = r^n\,e^{in\varphi}\qquad(n\ \text{ganz}).$$

Hohe Potenzen werden damit einfach. Ausmultiplizieren ginge auch, ist aber schon bei der sechsten Potenz lang und fehleranfällig. Das Beispiel nach dem Erklärteil rechnet $(1 + i\sqrt3)^6 = 64$ in vier Zeilen. Für nicht ganzzahlige Exponenten gilt die Formel nicht ohne Weiteres; das zeigen die Wurzeln im nächsten Schritt.`,
        q:{q:R`Was ist $\left(2e^{i\pi/4}\right)^2$?`,
          opts:[R`$4e^{i\pi/4}$`, R`$4i$`, R`$2i$`], a:1,
          ex:R`$2^2 = 4$ und $2\cdot\tfrac\pi4 = \tfrac\pi2$, also $4e^{i\pi/2} = 4i$.`,
          fb:[R`Der Betrag ist richtig quadriert, aber die Phase muss sich verdoppeln: $e^{i\pi/4}\cdot e^{i\pi/4} = e^{i\pi/2}$.`,
            '',
            R`Die Phase stimmt, aber der Betrag $2$ muss quadriert werden: $2^2 = 4$.`]}},
      {id:'mk-t3b', title:'Wurzeln: n Lösungen auf einem Kreis',
        num:{title:R`Die Lösungen von $z^3 = 1$`, text:R`Schreibe $1 = e^{2\pi ik}$ mit ganzem $k$ und teile die Phase durch 3:

$$z_k = e^{2\pi ik/3}:\qquad z_0 = 1,\quad z_1 = -\tfrac12 + \tfrac{\sqrt3}{2}i,\quad z_2 = -\tfrac12 - \tfrac{\sqrt3}{2}i.$$

Für $k = 3$ kommt wieder $z_0$ heraus. Die drei Punkte sind die Ecken eines gleichseitigen Dreiecks.`},
        text:R`Gesucht sind alle $z$ mit $z^n = w$, wobei $w = \rho\,e^{i\alpha} \ne 0$ ist. Weil die Phase nur bis auf $2\pi$ bestimmt ist, schreibst du $w = \rho\,e^{i(\alpha + 2\pi k)}$ mit ganzem $k$. Dann sind

$$z_k = \rho^{1/n}\,e^{i(\alpha + 2\pi k)/n},\qquad k = 0, 1, \dots, n - 1,$$

genau $n$ verschiedene Lösungen. Sie liegen auf einem Kreis mit Radius $\rho^{1/n}$, im Winkelabstand $2\pi/n$. Für weitere $k$ wiederholen sie sich. Die Herleitung prüft $z_1$ aus dem Beispiel durch Einsetzen.`,
        derive:{title:'Probe: eine dritte Einheitswurzel', ctx:{coords:['x'], params:{φ:'real'}},
          lines:[
            {l:'(e^(2πi/3))^3 = e^(2πi)', w:'Phase verdreifachen', why:{q:'Welche Regel wird benutzt?', opts:['$(e^{i\\alpha})^n = e^{in\\alpha}$', '$(e^{i\\alpha})^n = e^{i\\alpha + n}$', '$(e^{i\\alpha})^n = n\\,e^{i\\alpha}$'], a:0, ex:'$n$-mal dieselbe Zahl multiplizieren heißt $n$-mal die Phase addieren.'}},
            {l:'= 1', w:'e^{2πi} = cos 2π + i sin 2π', why:{q:'Warum ist $e^{2\\pi i} = 1$?', opts:['weil $\\cos 2\\pi = 1$ und $\\sin 2\\pi = 0$ ist', 'weil der Betrag von $e^{2\\pi i}$ eins ist', 'weil $2\\pi i$ eine reelle Zahl ist'], a:0, ex:'Euler-Formel. Der Betrag allein reicht nicht: Auch $-1$ und $i$ haben den Betrag 1.'}},
            {l:'e^(2πi/3) = -1/2 + i sqrt(3)/2', w:'cos 120°, sin 120°', why:{q:'In welchem Quadranten liegt $e^{2\\pi i/3}$?', opts:['im zweiten, weil $90° < 120° < 180°$', 'im ersten, weil die Phase positiv ist', 'im dritten, weil $2\\pi/3 > \\pi/2$ ist'], a:0, ex:'$\\cos 120° = -\\tfrac12 < 0$ und $\\sin 120° = \\tfrac{\\sqrt3}{2} > 0$: zweiter Quadrant.'}}
          ]},
        q:{q:R`Wie viele verschiedene Lösungen hat $z^4 = -16$?`,
          opts:[R`zwei, nämlich $\pm 2i$`, R`keine, weil $-16 < 0$`, R`vier`], a:2,
          ex:R`Jede Zahl $w \ne 0$ hat genau $n$ verschiedene $n$-te Wurzeln. Hier $z_k = 2e^{i(\pi + 2\pi k)/4}$, also $\sqrt2(\pm 1 \pm i)$.`,
          fb:[R`$\pm 2i$ lösen $z^2 = -4$. Es ist $(2i)^4 = 16$, nicht $-16$.`,
            R`Im Komplexen hat jede Zahl $w \ne 0$ Wurzeln, auch eine negative.`,
            '']}},
      {id:'mk-t3c', title:'Typischer Fehler: Wurzelregeln aus dem Reellen',
        num:{title:R`$\sqrt{-1}\cdot\sqrt{-1}$`, text:R`Eine falsche Rechnung: $i\cdot i = \sqrt{-1}\cdot\sqrt{-1} = \sqrt{(-1)(-1)} = \sqrt1 = 1$. Richtig ist $i\cdot i = i^2 = -1$. Der Fehler steckt im zweiten Gleichheitszeichen.`},
        text:R`Im Reellen gilt $\sqrt a\sqrt b = \sqrt{ab}$ für $a, b \ge 0$. Im Komplexen gibt es keine Wurzel, die alle diese Regeln erfüllt; für zwei negative Radikanden ist die Regel falsch, wie das Beispiel zeigt. Der Grund: Jede Zahl $w \ne 0$ hat zwei Quadratwurzeln, und das Zeichen $\sqrt{\ }$ wählt nur eine davon aus. Beim Multiplizieren kann man unbemerkt zur anderen springen.

Sprich deshalb lieber von „den Lösungen von $z^2 = w$“ und rechne in Polarform. Dort sind beide Lösungen sichtbar: $\pm\sqrt\rho\,e^{i\alpha/2}$.`,
        q:{q:R`Welche Zahlen lösen $z^2 = -9$?`,
          opts:[R`nur $3i$, die Wurzel aus $-9$`, R`keine, eine negative Zahl hat keine Wurzel`, R`$3i$ und $-3i$`], a:2,
          ex:R`$(\pm 3i)^2 = 9i^2 = -9$. In Polarform: $-9 = 9e^{i\pi}$, also $z = 3e^{i\pi/2} = 3i$ oder $z = 3e^{3i\pi/2} = -3i$.`,
          fb:[R`Auch $(-3i)^2 = 9i^2 = -9$. Eine Gleichung $z^2 = w$ hat für $w \ne 0$ immer zwei Lösungen.`,
            R`Im Komplexen hat jede Zahl $w \ne 0$ zwei Quadratwurzeln.`,
            '']}},
      {id:'mk-t3d', title:R`Kosinus und Sinus durch $e^{\pm i\varphi}$`,
        num:{title:R`$\varphi = \pi/3$`, text:R`Mit $e^{\pm i\pi/3} = \tfrac12 \pm \tfrac{\sqrt3}{2}i$ ist

$$\frac{e^{i\pi/3} + e^{-i\pi/3}}{2} = \frac12 = \cos\frac\pi3,\qquad \frac{e^{i\pi/3} - e^{-i\pi/3}}{2i} = \frac{\sqrt3\,i}{2i} = \sin\frac\pi3.$$

Die Imaginärteile heben sich in der Summe auf, die Realteile in der Differenz.`},
        text:R`Addierst du $e^{i\varphi} = \cos\varphi + i\sin\varphi$ und $e^{-i\varphi} = \cos\varphi - i\sin\varphi$, fallen die Sinusteile weg. Ziehst du sie voneinander ab, fallen die Kosinusteile weg:

$$\cos\varphi = \frac{e^{i\varphi} + e^{-i\varphi}}{2},\qquad \sin\varphi = \frac{e^{i\varphi} - e^{-i\varphi}}{2i}.$$

Im Bild sind das zwei Zeiger der Länge 1, die sich gegenläufig drehen. Ihre Summe liegt immer auf der reellen Achse. Mit diesen Formeln werden Umformungen mit Kosinus und Sinus zu Rechnungen mit Potenzen.`,
        q:{q:R`$e^{ikx} + e^{-ikx}$ ist für reelle $k, x$ gleich …`,
          opts:[R`$2i\sin kx$`, R`$2\cos kx$`, R`$2\cos kx + 2i\sin kx$`], a:1,
          ex:R`Die Sinusanteile $\pm i\sin kx$ heben sich auf.`,
          fb:[R`$2i\sin kx$ ist die Differenz $e^{ikx} - e^{-ikx}$.`,
            '',
            R`Die Sinusanteile haben entgegengesetzte Vorzeichen und heben sich auf.`]}},
      {id:'mk-t3e', title:'Trigonometrische Formeln ohne Formelsammlung',
        num:{title:R`$\sin^2\varphi$ bei $\varphi = \pi/4$`, text:R`Direkt: $\sin^2\tfrac\pi4 = \left(\tfrac{1}{\sqrt2}\right)^2 = \tfrac12$. Die Formel aus der Herleitung gibt $\tfrac12\left(1 - \cos\tfrac\pi2\right) = \tfrac12(1 - 0) = \tfrac12$. Bei $\varphi = 0$ stimmt sie auch: $\tfrac12(1 - 1) = 0$.`},
        text:R`Die Herleitung rechnet ein Beispiel, das du im Kasten (Thema 3) ständig brauchst:

$$\sin^2\varphi = \tfrac12(1 - \cos 2\varphi).$$

Ersetze $\sin\varphi$ durch Exponentialfunktionen, quadriere mit der binomischen Formel und fasse $e^{2i\varphi} + e^{-2i\varphi}$ wieder zu $2\cos 2\varphi$ zusammen. Den Faktor $(2i)^2 = -4$ im Nenner übersieht man leicht; er liefert das Vorzeichen. Nach demselben Muster erhältst du Produktformeln wie $\sin a\sin b = \tfrac12[\cos(a - b) - \cos(a + b)]$, ohne sie auswendig zu kennen.`,
        derive:{title:R`Herleitung: $\sin^2\varphi$ über Exponentialfunktionen`, ctx:{coords:['x'], params:{φ:'real'}},
          lines:[
            {l:'sin(φ)^2 = ((e^(iφ) - e^(-iφ))/(2i))^2', w:'Sinus durch Exponentialfunktionen', why:{q:'Woher kommt der Nenner $2i$?', opts:['$e^{i\\varphi} - e^{-i\\varphi} = 2i\\sin\\varphi$', '$e^{i\\varphi} + e^{-i\\varphi} = 2i\\sin\\varphi$', 'aus der Ableitung $\\frac{d}{d\\varphi}e^{i\\varphi} = ie^{i\\varphi}$'], a:0, ex:'Bei der Differenz heben sich die Kosinusteile auf, und $i\\sin\\varphi$ bleibt doppelt stehen.'}},
            {l:'= -(e^(2iφ) - 2 + e^(-2iφ))/4', w:'(2i)² = −4; Mischterm −2', why:{q:'Woher kommt das Minus vor der Klammer?', opts:['aus $(2i)^2 = 4i^2 = -4$ im Nenner', 'aus dem Mischterm $-2e^{i\\varphi}e^{-i\\varphi}$', 'aus dem Konjugieren von $e^{i\\varphi}$'], a:0, ex:'Der Mischterm erklärt das $-2$ in der Klammer. Das Minus davor kommt aus dem Nenner $(2i)^2 = -4$.'}},
            {l:'= (1 - cos(2φ))/2', w:'e^{2iφ} + e^{−2iφ} = 2 cos 2φ', why:{q:'Welche Formel fasst $e^{2i\\varphi} + e^{-2i\\varphi}$ zusammen?', opts:['$2\\cos 2\\varphi$', '$2i\\sin 2\\varphi$', '$2\\cos^2\\varphi$'], a:0, ex:'$\\cos u = \\tfrac12(e^{iu} + e^{-iu})$ mit $u = 2\\varphi$. Dann ist $-(2\\cos 2\\varphi - 2)/4 = (1 - \\cos 2\\varphi)/2$.'}}
          ]},
        q:{q:R`Was ergibt $\sin\varphi\cos\varphi$, mit Exponentialfunktionen umgeformt?`,
          opts:[R`$\tfrac12\sin 2\varphi$`, R`$\tfrac12\cos 2\varphi$`, R`$\sin 2\varphi$`], a:0,
          ex:R`$\frac{(e^{i\varphi} - e^{-i\varphi})(e^{i\varphi} + e^{-i\varphi})}{4i} = \frac{e^{2i\varphi} - e^{-2i\varphi}}{4i} = \frac{2i\sin 2\varphi}{4i}$. Die Mischterme $\pm 1$ heben sich auf.`,
          fb:['',
            R`Die Differenz $e^{2i\varphi} - e^{-2i\varphi}$ gehört zum Sinus, nicht zum Kosinus.`,
            R`Der Nenner ist $2i\cdot 2 = 4i$; es bleibt ein Faktor $\tfrac12$.`]}},
      {id:'mk-t3f', title:'Komplex als Rechentrick – und wann nicht',
        num:{title:'Realteil eines Produkts', text:R`Mit $z = e^{i\omega t}$ ist $\operatorname{Re}z = \cos\omega t$. Bei $\omega t = \tfrac\pi2$ ist $(\operatorname{Re}z)^2 = 0$, aber $\operatorname{Re}(z^2) = \cos\pi = -1$. Der Realteil eines Produkts ist also nicht das Produkt der Realteile.`},
        text:R`In der Elektrotechnik und Optik schreibt man eine reelle Schwingung oft als Realteil, $\cos\omega t = \operatorname{Re}e^{i\omega t}$. Das ist bequem, weil Ableiten nur einen Faktor $i\omega$ bringt und Phasen sich beim Multiplizieren addieren. Am Ende nimmt man den Realteil. Bei Produkten wie Leistung oder Energie muss man aber aufpassen, wie das Beispiel zeigt.

**Ausblick (Thema 1 und 2):** In der Quantenmechanik ist die Wellenfunktion dagegen wirklich komplex. Dort ist $i$ kein Rechentrick, und man darf den Imaginärteil nie weglassen. Die Schrödingergleichung enthält $i$ selbst.`,
        q:{q:R`Warum darf man in der Quantenmechanik nicht mit $\operatorname{Re}\psi$ allein rechnen?`,
          opts:[R`Weil die Dichte $|\psi|^2$ Real- und Imaginärteil braucht.`, R`Man darf es: Wie in der Elektrotechnik nimmt man am Ende den Realteil.`, R`Weil $\operatorname{Re}\psi$ negativ werden kann, eine Dichte aber nicht.`], a:0,
          ex:R`$|\psi|^2 = (\operatorname{Re}\psi)^2 + (\operatorname{Im}\psi)^2$. Lässt man den Imaginärteil weg, ändert sich die Dichte – im Beispiel der Vorhersage würde sie sogar schwingen.`,
          fb:['',
            R`Das ist der Rechentrick aus der Schwingungslehre. In der Quantenmechanik ist $\psi$ wirklich komplex; der Imaginärteil trägt zur Dichte bei.`,
            R`Das Vorzeichen ist nicht das Problem, gemessen wird ja ein Quadrat. Aber $(\operatorname{Re}\psi)^2$ allein ist nicht die Dichte: Es fehlt $(\operatorname{Im}\psi)^2$.`]}}
    ]},

    /* ===== Abschnitt 4: komplexwertige Funktionen, Ableiten, Zeitfaktor, Integrale ===== */
    {id:'mk-t4', title:'Komplexe Funktionen: ebene Welle und Zeitfaktor', steps:[
      {id:'mk-t4a', title:'Funktionen mit komplexen Werten',
        num:{title:R`$f(x) = e^{ix}$`, text:R`Nach Euler ist $e^{ix} = \cos x + i\sin x$: Realteil $u(x) = \cos x$, Imaginärteil $v(x) = \sin x$. Bei $x = \pi/2$ ist $f = i$, bei $x = \pi$ ist $f = -1$. Das Integral über $[0, \pi]$ rechnest du Teil für Teil:

$$\int_0^\pi e^{ix}dx = \int_0^\pi\cos x\,dx + i\int_0^\pi\sin x\,dx = 0 + 2i.$$`},
        text:R`In der Quantenmechanik treten Funktionen einer reellen Variablen mit komplexen Werten auf, etwa die [[lex:ebene-welle|ebene Welle]] $e^{ikx}$ oder der Zeitfaktor $e^{-i\omega t}$. Eine solche Funktion ist $f(x) = u(x) + i\,v(x)$ mit zwei reellen Funktionen $u$ und $v$. Du kannst sie dir als Zeiger vorstellen, der sich mit $x$ dreht und streckt.

Ableiten und Integrieren geschehen für Real- und Imaginärteil getrennt. Die Konstante $i$ ziehst du einfach heraus, wie jeden anderen konstanten Faktor.`,
        q:{q:R`Was ist der Imaginärteil von $e^{-2ix}$ für reelles $x$?`,
          opts:[R`$-\sin 2x$`, R`$\sin 2x$`, R`$-i\sin 2x$`], a:0,
          ex:R`$e^{-2ix} = \cos 2x - i\sin 2x$. Der Imaginärteil ist die reelle Funktion vor dem $i$: $-\sin 2x$.`,
          fb:['',
            R`Das Minus im Exponenten kommt in den Sinus: $\sin(-2x) = -\sin 2x$.`,
            R`Der Imaginärteil ist reell. $-i\sin 2x$ ist der ganze imaginäre Summand.`]}},
      {id:'mk-t4b', title:R`Ableiten: der Faktor $ik$`,
        num:{title:R`$e^{3ix}$ abgeleitet`, text:R`Über Euler:

$$\frac{d}{dx}(\cos 3x + i\sin 3x) = -3\sin 3x + 3i\cos 3x = 3i(\cos 3x + i\sin 3x).$$

Das ist $3i\,e^{3ix}$ – genau das, was die Kettenregel mit dem Faktor $3i$ liefert.`},
        text:R`Aus Abschnitt 2 weißt du: $e^{i\varphi}$ bringt beim Ableiten den Faktor $i$. Mit der Kettenregel folgt für reelles $k$

$$\frac{d}{dx}e^{ikx} = ik\,e^{ikx},\qquad \frac{d^2}{dx^2}e^{ikx} = -k^2e^{ikx}.$$

Allgemein gilt $\frac{d}{dx}e^{ax} = a\,e^{ax}$ auch für komplexes $a = \alpha + i\beta$: Schreibe $e^{ax} = e^{\alpha x}e^{i\beta x}$ und nimm die Produktregel. Die zweite Ableitung bringt ein reelles Minus; darum lösen $e^{\pm ikx}$ die [[lex:schwingungsgleichung|Schwingungsgleichung]] $y'' = -k^2y$ (M7). Die Herleitung zeigt dasselbe für einen Zeitfaktor: Erst das $i$ in $i\hbar\,\partial_t$ macht aus der Ableitung die reelle Zahl $E$ (**Ausblick:** Thema 2).`,
        derive:{title:'Herleitung: Zeitableitung des Phasenfaktors', ctx:{coords:['x', 't'], params:{E:'pos', n:{int:[1, 5]}}},
          lines:[
            {l:'i ħ ∂/∂t e^(-i E t/ħ) = i ħ (-i E/ħ) e^(-i E t/ħ)', w:'Kettenregel', why:{q:'Welcher Faktor entsteht beim Ableiten von $e^{-iEt/\\hbar}$ nach $t$?', opts:['$-iE/\\hbar$, der Faktor vor $t$ im Exponenten', '$-iEt/\\hbar$, der ganze Exponent', '$E/\\hbar$, weil $i$ beim Ableiten wegfällt'], a:0, ex:'$\\frac{d}{dt}e^{ct} = c\\,e^{ct}$ mit $c = -iE/\\hbar$. Die Konstante $i$ bleibt erhalten.'}},
            {l:'= E e^(-i E t/ħ)', w:'i · (−i) = 1', why:{q:'Warum ist das Ergebnis reell mal Phasenfaktor?', opts:['$i\\cdot(-i) = -i^2 = 1$', '$i\\cdot(-i) = i^2 = -1$', 'weil $\\hbar$ sich kürzt'], a:0, ex:'$-i^2 = +1$. Das $\\hbar$ kürzt sich zwar auch, aber erst $i\\cdot(-i) = 1$ macht den Faktor reell.'}}
          ]},
        q:{q:R`Was ist $\dfrac{d^2}{dx^2}e^{-2ix}$?`,
          opts:[R`$4e^{-2ix}$`, R`$-4e^{-2ix}$`, R`$4i\,e^{-2ix}$`], a:1,
          ex:R`Jede Ableitung bringt den Faktor $-2i$; zweimal: $(-2i)^2 = 4i^2 = -4$.`,
          fb:[R`$(-2i)^2 = 4i^2 = -4$: Das $i^2$ gibt ein Minus.`,
            '',
            R`Ein einzelnes $i$ bleibt nicht übrig: $(-2i)^2 = -4$ ist reell.`]}},
      {id:'mk-t4c', title:'Der Zeitfaktor: ein Zeiger, der umläuft',
        num:{title:R`$e^{-i\omega t}$ zu vier Zeiten`, text:R`Bei $\omega t = 0, \tfrac\pi2, \pi, \tfrac{3\pi}{2}$ ist $e^{-i\omega t} = 1, -i, -1, i$. Der Zeiger dreht sich also im Uhrzeigersinn. Der Realteil $\cos\omega t$ schwingt zwischen $1$ und $-1$, der Betrag bleibt

$$|e^{-i\omega t}|^2 = e^{i\omega t}e^{-i\omega t} = 1.$$`},
        text:R`Konjugieren ersetzt auch im Exponenten $i$ durch $-i$: Für reelle $k$ und $x$ ist $(e^{ikx})^* = e^{-ikx}$. Deshalb ist $|e^{ikx}|^2 = e^{-ikx}e^{ikx} = 1$: Eine ebene Welle hat überall denselben Betrag. Ebenso ändert ein Zeitfaktor das Betragsquadrat nicht, $|\psi(x)\,e^{-i\omega t}|^2 = |\psi(x)|^2$.

Das löst die Vorhersage zu Beginn auf: Der Realteil eines umlaufenden Zeigers schwingt, sein Betrag nicht. Die Tafel zeigt den Zeitfaktor als Zeiger, als Formel, als zwei Kurven und als Aussage über eine Messung.`,
        reps:{obj:R`Der Zeitfaktor $e^{-i\omega t}$`,
          rows:[
            {k:'worte', text:R`Ein Zeiger der Länge 1, der sich gleichmäßig im Uhrzeigersinn dreht: eine Umdrehung in der Zeit $2\pi/\omega$.`},
            {k:'formel', tex:R`\begin{gathered}e^{-i\omega t} = \cos\omega t - i\sin\omega t\\ |e^{-i\omega t}|^2 = 1\end{gathered}`},
            {k:'graph', plot:{x:[0, 6.2832], y:[-1.3, 1.3], xlab:R`\omega t`, ylab:R`\text{Re},\ \text{Im}`, ticks:[{x:1.5708, lab:R`\pi/2`}, {x:3.1416, lab:R`\pi`}, {x:4.7124, lab:R`3\pi/2`}, {x:6.2832, lab:R`2\pi`}]},
              f:x => Math.cos(x), lab:R`\operatorname{Re} = \cos\omega t`, f2:x => -Math.sin(x), lab2:R`\operatorname{Im} = -\sin\omega t`,
              cap:R`Real- und Imaginärteil schwingen um eine Viertelperiode versetzt. Wo der eine null ist, hat der andere den Betrag 1: $\cos^2 + \sin^2 = 1$ zu jeder Zeit.`},
            {k:'physik', text:R`**Ausblick (Thema 2):** Ein Zustand fester Energie $E$ ist $\Psi(x, t) = \psi(x)\,e^{-i\omega t}$ mit $\omega = E/\hbar$. Seine Dichte $|\Psi|^2 = |\psi(x)|^2$ hängt nicht von der Zeit ab. Solche Zustände heißen stationär.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Den Zeiger mit Euler schreiben: Realteil $\cos$ des Winkels, Imaginärteil $\sin$ des Winkels. „Im Uhrzeigersinn“ heißt Winkel $-\omega t$.`},
            {from:'formel', to:'graph', rule:R`Real- und Imaginärteil getrennt über $\omega t$ auftragen. Der Betrag ist in diesem Bild nicht direkt zu sehen; er steckt in $\cos^2 + \sin^2$.`},
            {from:'graph', to:'physik', rule:R`Für die Dichte zählt nur das Betragsquadrat, keine der beiden Kurven allein. Weil $\cos^2 + \sin^2 = 1$ ist, fällt der Zeitfaktor aus $|\Psi|^2$ heraus.`}
          ]},
        q:{q:R`Ein anderer Zeitfaktor: Sein Realteil beginnt bei $\omega t = 0$ mit $1$, sein Imaginärteil beginnt bei $0$ und **steigt** zuerst an. Welche Funktion ist das?`, tr:{from:'graph', to:'formel'},
          opts:[R`$e^{-i\omega t}$`, R`$e^{i\omega t}$`, R`$\cos\omega t + \sin\omega t$`], a:1,
          ex:R`$e^{i\omega t} = \cos\omega t + i\sin\omega t$: Der Imaginärteil $\sin\omega t$ steigt bei $0$ an. Dieser Zeiger dreht gegen den Uhrzeigersinn.`,
          fb:[R`Bei $e^{-i\omega t}$ ist der Imaginärteil $-\sin\omega t$; er fällt zuerst, wie in der Tafel.`,
            '',
            R`Diese Funktion ist reell; sie hat gar keinen Imaginärteil. Gefragt ist nach einem Zeiger mit zwei Kurven.`]}},
      {id:'mk-t4d', title:'Integrieren: volle Umläufe heben sich auf',
        num:{title:R`$\int_0^{2\pi}e^{ix}\,dx$`, text:R`Teil für Teil: $\int_0^{2\pi}\cos x\,dx = 0$ und $\int_0^{2\pi}\sin x\,dx = 0$, also ist das Integral $0$. Mit einer Stammfunktion:

$$\left[\frac{e^{ix}}{i}\right]_0^{2\pi} = \frac{1 - 1}{i} = 0.$$

Für $e^{0\cdot x} = 1$ dagegen ist das Integral $2\pi$.`},
        text:R`Für ganze Zahlen $n$ gilt

$$\int_0^{2\pi}e^{inx}\,dx = \begin{cases}2\pi, & n = 0,\\ 0, & n \ne 0.\end{cases}$$

Für $n = 0$ integrierst du die Konstante 1. Für $n \ne 0$ ist $e^{inx}/(in)$ eine Stammfunktion, und wegen $e^{2\pi in} = 1$ wird die Differenz null (Herleitung). Anschaulich: Der Zeiger läuft $n$-mal um den Kreis, und die Beiträge aus entgegengesetzten Richtungen heben sich auf. Mit $(e^{imx})^*e^{inx} = e^{i(n - m)x}$ folgt: Das Integral über das Produkt zweier verschiedener solcher Funktionen, die linke konjugiert, ist null. **Ausblick (M6):** Darauf beruhen die [[lex:fourier-reihe|Fourier-Reihen]].`,
        derive:{title:'Herleitung: ein Integral über volle Umläufe', ctx:{coords:['x', 't'], params:{E:'pos', n:{int:[1, 5]}}},
          lines:[
            {l:'∫_0^(2π) e^(i n x) dx = [e^(i n x)/(i n)]_0^(2π)', w:'Stammfunktion, n ≠ 0', why:{q:'Warum ist $e^{inx}/(in)$ eine Stammfunktion?', opts:['Weil Ableiten den Faktor $in$ bringt, der sich kürzt.', 'Weil man nur den Realteil $\\cos nx$ integrieren muss.', 'Weil $\\int e^{u}du = e^{u}$ auch ohne Faktor gilt.'], a:0, ex:'$\\frac{d}{dx}\\frac{e^{inx}}{in} = \\frac{in\\,e^{inx}}{in} = e^{inx}$. Das gilt nur für $n \\neq 0$.'}},
            {l:'= (e^(2π i n) - 1)/(i n)', w:'Grenzen einsetzen', why:{q:'Was steht nach dem Einsetzen der unteren Grenze?', opts:['$e^0 = 1$, deshalb $-1$', '$e^0 = 0$, deshalb fällt sie weg', '$e^{-2\\pi in}$'], a:0, ex:'Bei $x = 0$ ist $e^{in\\cdot 0} = 1$.'}},
            {l:'= 0', w:'e^{2πin} = 1 für ganzes n', why:{q:'Warum ist $e^{2\\pi in} = 1$?', opts:['weil $2\\pi n$ genau $n$ volle Umläufe sind', 'weil der Betrag $|e^{2\\pi in}|$ eins ist', 'weil der Exponent $2\\pi in$ null ist'], a:0, ex:'$e^{2\\pi in} = \\cos 2\\pi n + i\\sin 2\\pi n = 1$ für ganzes $n$. Für nicht ganzes $n$ stimmt das nicht.'}}
          ]},
        q:{q:R`Was ist $\int_0^{2\pi}(e^{2ix})^*\,e^{2ix}\,dx$?`,
          opts:[R`$0$`, R`$2\pi$`, R`$\pi$`], a:1,
          ex:R`$(e^{2ix})^*e^{2ix} = e^{-2ix}e^{2ix} = 1$, also ist das Integral $2\pi$.`,
          fb:[R`Null wäre $\int_0^{2\pi}e^{4ix}dx$, das Integral ohne Konjugation.`,
            '',
            R`Der Integrand ist überall $1$, nicht $\tfrac12$. $\pi$ wäre $\int_0^{2\pi}\cos^2x\,dx$.`]}},
      {id:'mk-t4e', title:'Typischer Fehler: im Betragsquadrat nicht konjugieren',
        num:{title:R`$\int_0^L|e^{ikx}|^2dx$ mit $kL = \pi$`, text:R`Richtig: $|e^{ikx}|^2 = 1$, das Integral ist $L$. Ohne Konjugation stünde dort

$$\int_0^Le^{2ikx}dx = \frac{e^{2ikL} - 1}{2ik} = \frac{e^{2\pi i} - 1}{2ik} = 0$$

– die Fläche unter einer Dichte, die überall gleich groß ist, kann aber nicht null sein.`},
        text:R`Der häufigste Fehler mit komplexen Funktionen ist, im Betragsquadrat das Konjugieren zu vergessen: $|e^{ikx}|^2$ als $e^{2ikx}$ zu rechnen. Das Ergebnis ist dann komplex und hängt von $x$ ab, obwohl der Betrag überall 1 ist. Ein Integral über eine solche „Dichte“ kann sogar null werden.

Vorsicht auch bei komplexem $k$. Für $k = i\kappa$ mit reellem $\kappa > 0$ ist $e^{ikx} = e^{-\kappa x}$ reell und klingt für wachsendes $x$ ab. Dann gilt $(e^{ikx})^* = e^{-ik^*x}$, und das ist nicht $e^{-ikx}$. **Ausblick (Thema 5):** Genau das passiert im verbotenen Bereich beim Tunneln.`,
        q:{q:R`Was ist $|A\,e^{i(kx - \omega t)}|^2$ für reelle $k, x, \omega, t$ und komplexes $A$?`,
          opts:[R`$|A|^2$`, R`$A^2e^{2i(kx - \omega t)}$`, R`$|A|^2\cos^2(kx - \omega t)$`], a:0,
          ex:R`Der Phasenfaktor hat den Betrag 1: $|A|^2\cdot|e^{i(kx - \omega t)}|^2 = |A|^2$.`,
          fb:['',
            R`Das ist das Quadrat ohne Konjugation. Es ist komplex und kann kein Betragsquadrat sein.`,
            R`$\cos^2$ wäre das Quadrat des Realteils allein. Zum Betragsquadrat gehört auch der Imaginärteil.`]}}
    ]},

    /* ===== Abschnitt 5: Betragsquadrat einer Summe, relative Phase, Interferenz in der Zeit ===== */
    {id:'mk-t5', title:'Betragsquadrat einer Summe: der Interferenzterm', steps:[
      {id:'mk-t5a', title:'Zwei Wege: Amplituden addieren',
        num:{title:'Drei Fälle mit zwei Einsen', text:R`Zwei Amplituden haben je den Betrag 1. Je nach Phase ist ihre Summe sehr verschieden:

$$|1 + 1|^2 = 4,\qquad |1 + i|^2 = 2,\qquad |1 + (-1)|^2 = 0.$$

Die Einzelwerte $|z_1|^2 = |z_2|^2 = 1$ sind in allen drei Fällen gleich.`},
        text:R`Beim Doppelspalt gibt es zwei Wege zum Schirm. Jeder Weg liefert eine komplexe **Amplitude**, $z_1$ und $z_2$. Die Wellenoptik sagt, und die Quantenmechanik ebenso: Wird der Weg nicht festgestellt, **addiert man die Amplituden**. Intensität bzw. Wahrscheinlichkeit ist das Betragsquadrat der Summe, $|z_1 + z_2|^2$.

Wie hängt sie mit den Einzelwerten $|z_1|^2$ und $|z_2|^2$ zusammen? Das Beispiel zeigt: nicht allein über sie. Zwei Wege, die einzeln je den Wert 1 liefern, ergeben zusammen irgendetwas zwischen 0 und 4. Entscheidend ist, wie die beiden Zeiger zueinander stehen.`,
        q:{q:R`Zwei Amplituden sind $z_1 = 2$ und $z_2 = -2$. Was ist $|z_1 + z_2|^2$?`,
          opts:[R`$0$`, R`$8$`, R`$16$`], a:0,
          ex:R`Die Summe ist $0$: Die Zeiger zeigen in entgegengesetzte Richtungen und heben sich auf.`,
          fb:['',
            R`$8 = |z_1|^2 + |z_2|^2$ ergäbe sich, wenn man Betragsquadrate addiert. Addiert werden aber die Amplituden.`,
            R`$16 = |2 + 2|^2$ gehört zu gleich gerichteten Zeigern.`]}},
      {id:'mk-t5b', title:'Ausmultiplizieren: der Interferenzterm',
        num:{title:R`$z_1 = 2$, $z_2 = 1 + i$`, text:R`Direkt: $|3 + i|^2 = 9 + 1 = 10$. Über die Einzelteile: $|z_1|^2 + |z_2|^2 = 4 + 2 = 6$, und der Mischterm ist

$$2\operatorname{Re}(z_1^*z_2) = 2\operatorname{Re}\big(2(1 + i)\big) = 4.$$

Zusammen $6 + 4 = 10$.`},
        text:R`Die Herleitung rechnet $|z_1 + z_2|^2$ mit $|w|^2 = w^*w$ aus:

$$|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\operatorname{Re}(z_1^*z_2).$$

Der letzte Summand heißt [[lex:interferenzterm|Interferenzterm]]. Er entsteht aus den beiden Mischtermen $z_1^*z_2$ und $z_2^*z_1 = (z_1^*z_2)^*$. Eine Zahl plus ihre Konjugierte ist das Doppelte ihres Realteils; deshalb ist die Summe reell. Das ist das komplexe Gegenstück zum Mischterm $2ab$ in $(a + b)^2$.`,
        derive:{ctx:{coords:['x'], params:{z_1:'complex', z_2:'complex', α:'real'}},
          lines:[
            {l:'|z_1 + z_2|^2 = (z_1 + z_2)^* (z_1 + z_2)', w:'$|z|^2 = z^*z$', why:{q:'Warum schreibt man das Betragsquadrat als Produkt?', opts:['Weil $|w|^2 = w^*w$ ist, nicht $w^2$.', 'Weil man so den Betrag vermeidet.', 'Weil $(z_1 + z_2)^* = z_1 + z_2$ ist.'], a:0, ex:'Das ist die Definition aus Abschnitt 1. $(z_1 + z_2)^*$ ist im Allgemeinen nicht $z_1 + z_2$.'}},
            {l:'= (z_1^* + z_2^*)(z_1 + z_2)', w:'Konjugieren ist additiv', why:{q:'Welche Regel steckt in diesem Schritt?', opts:['$(z_1 + z_2)^* = z_1^* + z_2^*$', '$(z_1 + z_2)^* = z_1^*z_2^*$', '$(z_1 + z_2)^* = -(z_1 + z_2)$'], a:0, ex:'Konjugieren heißt $i \\to -i$ in jedem Summanden.'}},
            {l:'= |z_1|^2 + |z_2|^2 + z_1^* z_2 + z_2^* z_1', w:'ausmultiplizieren', why:{q:'Wie viele Produkte entstehen beim Ausmultiplizieren?', opts:['vier: zwei Betragsquadrate und zwei Mischterme', 'zwei: nur die Betragsquadrate', 'drei, weil die Mischterme gleich sind'], a:0, ex:'$z_1^*z_2$ und $z_2^*z_1$ sind im Allgemeinen verschieden; sie sind zueinander konjugiert.'}},
            {l:'= |z_1|^2 + |z_2|^2 + 2 Re(z_1^* z_2)', w:'$w + w^* = 2\\operatorname{Re}w$', why:{q:'Warum ist $z_1^*z_2 + z_2^*z_1$ reell?', opts:['Weil es $w + w^*$ mit $w = z_1^*z_2$ ist, also $2\\operatorname{Re}w$.', 'Weil $z_1^*z_2$ und $z_2^*z_1$ einzeln reell sind.', 'Weil sich die Mischterme aufheben: $z_1^*z_2 + z_2^*z_1 = 0$.'], a:0, ex:'$z_2^*z_1 = (z_1^*z_2)^*$. Einzeln sind die Mischterme meist komplex, ihre Summe ist reell.'}}
          ]},
        q:{q:R`$z_1 = 1$ und $z_2 = -1 + i$. Wie groß ist der Interferenzterm $2\operatorname{Re}(z_1^*z_2)$?`,
          opts:[R`$2$`, R`$-2$`, R`$0$`], a:1,
          ex:R`$z_1^*z_2 = -1 + i$, Realteil $-1$, doppelt: $-2$. Probe: $|z_1|^2 + |z_2|^2 - 2 = 1 + 2 - 2 = 1 = |i|^2$.`,
          fb:[R`Das Vorzeichen fehlt: Der Realteil von $-1 + i$ ist $-1$.`,
            '',
            R`Der Interferenzterm verschwindet nur, wenn $z_1^*z_2$ rein imaginär ist. Hier ist der Realteil $-1$.`]}},
      {id:'mk-t5c', title:'Die relative Phase entscheidet',
        num:{title:R`$z_1 = 1$, $z_2 = e^{i\Delta\varphi}$`, text:R`Hier ist $z_1^*z_2 = e^{i\Delta\varphi}$ mit Realteil $\cos\Delta\varphi$, also $|z_1 + z_2|^2 = 2 + 2\cos\Delta\varphi$:

$$\Delta\varphi = 0:\ 4,\qquad \Delta\varphi = \tfrac\pi2:\ 2,\qquad \Delta\varphi = \pi:\ 0.$$`},
        text:R`In Polarform, mit $z_1 = r_1e^{i\varphi_1}$ und $z_2 = r_2e^{i\varphi_2}$, ist $z_1^*z_2 = r_1r_2\,e^{i(\varphi_2 - \varphi_1)}$ und

$$|z_1 + z_2|^2 = r_1^2 + r_2^2 + 2r_1r_2\cos\Delta\varphi,\qquad \Delta\varphi = \varphi_2 - \varphi_1.$$

Es kommt nur auf die **relative Phase** $\Delta\varphi$ an. Bei $\Delta\varphi = 0$ zeigen beide Zeiger in dieselbe Richtung: konstruktive Interferenz. Bei $\Delta\varphi = \pi$ zeigen sie gegeneinander: destruktive Interferenz. Die Tafel übersetzt das in ein Bild und in eine Beobachtung.`,
        reps:{obj:R`Zwei gleich starke Amplituden $z_1 = 1$ und $z_2 = e^{i\Delta\varphi}$`,
          rows:[
            {k:'worte', text:R`Zwei Zeiger der Länge 1; der zweite ist um $\Delta\varphi$ gedreht. Wie lang ist ihre Summe, zum Quadrat?`},
            {k:'formel', tex:R`|1 + e^{i\Delta\varphi}|^2 = 1 + 1 + 2\cos\Delta\varphi`},
            {k:'graph', plot:{x:[0, 12.566], y:[0, 4.4], xlab:R`\Delta\varphi`, ylab:R`|z_1 + z_2|^2`, yticks:[{y:2, lab:'2'}, {y:4, lab:'4'}], ticks:[{x:3.1416, lab:R`\pi`}, {x:6.2832, lab:R`2\pi`}, {x:9.4248, lab:R`3\pi`}, {x:12.566, lab:R`4\pi`}]},
              f:x => 2 + 2 * Math.cos(x), lab:R`|z_1 + z_2|^2`, f2:x => 2, lab2:R`|z_1|^2 + |z_2|^2`,
              cap:R`Durchgezogen: mit Interferenzterm, zwischen 0 und 4. Gestrichelt: die Summe der Einzelwerte, immer 2.`},
            {k:'physik', text:R`Beim Doppelspalt wächst $\Delta\varphi$ gleichmäßig mit dem Ort auf dem Schirm, weil die beiden Wege verschieden lang werden. Helle Streifen liegen bei $\Delta\varphi = 0, 2\pi, 4\pi, \dots$, dunkle bei $\pi, 3\pi, \dots$`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`Beide Betragsquadrate ($1$ und $1$) hinschreiben und den Interferenzterm $2r_1r_2\cos\Delta\varphi$ addieren.`},
            {from:'formel', to:'graph', rule:R`$\Delta\varphi$ waagerecht auftragen: Der Kosinus lässt die Kurve um den Mittelwert $r_1^2 + r_2^2 = 2$ schwingen, mit der Amplitude $2r_1r_2 = 2$.`},
            {from:'graph', to:'physik', rule:R`Die waagerechte Achse als Ort auf dem Schirm lesen: Maxima der Kurve sind helle Streifen, Nullstellen dunkle.`}
          ]},
        q:{q:R`Jetzt ist $z_1 = 1$ und $z_2 = 2e^{i\Delta\varphi}$. Zwischen welchen Werten schwankt die Kurve $|z_1 + z_2|^2$?`, tr:{from:'formel', to:'graph'},
          opts:[R`zwischen $0$ und $9$`, R`zwischen $1$ und $9$`, R`zwischen $1$ und $5$`], a:1,
          ex:R`$1 + 4 + 4\cos\Delta\varphi$ liegt zwischen $5 - 4 = 1$ und $5 + 4 = 9$. Ungleich starke Zeiger heben sich nie ganz auf.`,
          fb:[R`Null erreichst du nur mit gleich langen Zeigern. Hier bleibt mindestens $|2 - 1|^2 = 1$.`,
            '',
            R`$5 = |z_1|^2 + |z_2|^2$ ist der Mittelwert, um den die Kurve schwingt, nicht ihr Maximum.`]}},
      {id:'mk-t5d', title:'Globale und relative Phase',
        num:{title:R`$z_1 = 1$, $z_2 = i$`, text:R`Ohne Änderung: $|1 + i|^2 = 2$. Beide mit $i$ multipliziert: $|i + i^2|^2 = |-1 + i|^2 = 2$, unverändert. Nur $z_2$ mit $i$ multipliziert: $|1 + i^2|^2 = |0|^2 = 0$. Die relative Phase ist dabei von $\tfrac\pi2$ auf $\pi$ gewachsen.`},
        text:R`Multiplizierst du die ganze Summe mit $e^{i\alpha}$, ändert sich nichts, denn $|e^{i\alpha}|^2 = 1$ (Herleitung). Eine solche [[lex:phase-global-relativ|globale Phase]] ist nicht beobachtbar. Änderst du dagegen nur $z_2 \to e^{i\alpha}z_2$, ändert sich $\Delta\varphi$ und damit das Ergebnis.

Der Satz „Phasen sind nicht messbar“ stimmt also nur für die gemeinsame Phase aller Summanden. Eine relative Phase ist messbar, beim Doppelspalt als Verschiebung des Streifenmusters. **Ausblick (Thema 1 und 6):** Deshalb beschreiben $\psi$ und $e^{i\alpha}\psi$ denselben Zustand, $\psi_1 + \psi_2$ und $\psi_1 - \psi_2$ aber nicht.`,
        derive:{title:'Herleitung: die globale Phase fällt heraus', ctx:{coords:['x'], params:{z_1:'complex', z_2:'complex', α:'real'}},
          lines:[
            {l:'|e^(iα) (z_1 + z_2)|^2 = |z_1 + z_2|^2', w:'globale Phase fällt heraus', why:{q:'Warum ändert der gemeinsame Faktor $e^{i\\alpha}$ nichts?', opts:['weil $|e^{i\\alpha}w|^2 = |e^{i\\alpha}|^2|w|^2$ und $|e^{i\\alpha}| = 1$ ist', 'weil $e^{i\\alpha} = 1$ für jeden reellen Winkel $\\alpha$ ist', 'weil $e^{i\\alpha}$ reell ist und im Quadrat herausfällt'], a:0, ex:'Beträge von Produkten multiplizieren sich. $e^{i\\alpha}$ selbst ist nur für $\\alpha = 2\\pi k$ gleich 1.'}}
          ]},
        q:{q:R`Welche Änderung lässt $|z_1 + z_2|^2$ sicher unverändert?`,
          opts:[R`nur $z_2$ mit einem Faktor $e^{i\alpha}$ multiplizieren`, R`die Amplitude $z_2$ durch $z_2^*$ ersetzen`, R`beide Amplituden mit demselben $e^{i\alpha}$ multiplizieren`], a:2,
          ex:R`Eine gemeinsame Phase fällt heraus: $|e^{i\alpha}(z_1 + z_2)|^2 = |z_1 + z_2|^2$.`,
          fb:[R`Das ändert die relative Phase um $\alpha$ und damit den Interferenzterm.`,
            R`$z_2^*$ hat die entgegengesetzte Phase; die relative Phase ändert sich im Allgemeinen.`,
            '']}},
      {id:'mk-t5e', title:'Interferenz in der Zeit: die Dichte schwappt',
        num:{title:'Zwei Zeitfaktoren an einer Stelle', text:R`An einer Stelle mit $\psi_1 = \psi_2 = 1$ und $\omega_2 - \omega_1 = \omega$ ist

$$|e^{-i\omega_1t} + e^{-i\omega_2t}|^2 = 2 + 2\cos\omega t.$$

Bei $t = 0$ ist der Wert $4$, bei $\omega t = \pi$ ist er $0$, bei $\omega t = 2\pi$ wieder $4$.`},
        text:R`Für eine Überlagerung zweier Anteile mit reellen $\psi_1, \psi_2$ und Zeitfaktoren gilt

$$|\psi_1e^{-i\omega_1t} + \psi_2e^{-i\omega_2t}|^2 = \psi_1^2 + \psi_2^2 + 2\psi_1\psi_2\cos((\omega_2 - \omega_1)t).$$

Jeder Anteil allein hat eine konstante Dichte. Der Interferenzterm aber schwingt mit der Differenzfrequenz. Im Labor ist die Kurve $|\Psi(x, t)|^2$; der Regler „Anteil |c₁|²“ verteilt das Gewicht auf beide Anteile, der Regler „Zeit t“ lässt die Zeit laufen. Die gestrichelte Linie markiert den mittleren Ort, der hin- und herwandert. **Ausblick (Thema 2 und 3):** So verhält sich ein Teilchen im Kasten, das nicht in einem stationären Zustand ist.`,
        fig:{lab:'twostate', caption:R`Überlagerung zweier stationärer Zustände im Kasten (Thema 3). Jeder Anteil allein hat eine konstante Dichte. Der Interferenzterm $2\psi_1\psi_2\cos((\omega_2 - \omega_1)t)$ lässt $|\Psi|^2$ hin- und herschwappen. Bei $|c_1|^2 = 0$ oder $1$ verschwindet er.`},
        q:{q:R`Im Labor stellst du „Anteil |c₁|²“ auf $1$ und lässt die Zeit laufen. Was zeigt die Kurve, und warum?`, tr:{from:'labor', to:'formel'},
          opts:['Sie schwappt doppelt so schnell, weil nur $\\psi_1$ schwingt.', 'Sie bleibt stehen, weil der Interferenzterm mit $\\psi_2$ fehlt.', 'Sie verschwindet, weil sich $\\psi_1$ und $\\psi_2$ aufheben.'], a:1,
          ex:R`Bei $|c_1|^2 = 1$ ist nur $\psi_1$ da. Ohne zweiten Anteil gibt es keinen Mischterm, und $|\psi_1e^{-i\omega_1t}|^2 = \psi_1^2$ ist konstant.`,
          fb:[R`Ein einzelner Anteil dreht nur seine Phase; seine Dichte bleibt: $|e^{-i\omega_1t}|^2 = 1$.`,
            '',
            R`Mit nur einem Anteil gibt es nichts, das sich aufheben könnte; die Dichte ist $\psi_1^2$.`]}},
      {id:'mk-t5f', title:'Typischer Fehler: Betragsquadrate einfach addieren',
        num:{title:R`$z_1 = z_2 = 1$`, text:R`Richtig: $|1 + 1|^2 = 4$. Falsch: $|1|^2 + |1|^2 = 2$. Der Fehler unterschätzt hier um den Faktor 2. Bei $z_2 = -1$ wäre es umgekehrt: richtig $0$, falsch $2$.`},
        text:R`Der Kurzschluss $|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2$ verliert den Interferenzterm. Er stimmt nur in zwei Fällen. Erstens, wenn $\operatorname{Re}(z_1^*z_2) = 0$ ist, zum Beispiel bei einer relativen Phase von $\pm\pi/2$. Zweitens im Mittel, wenn die relative Phase zufällig und gleichmäßig über $[0, 2\pi)$ schwankt und man darüber mittelt. Dann ist der Mittelwert von $\cos\Delta\varphi$ null.

Der zweite Fall erklärt, warum man im Alltag selten Interferenz sieht: Bei gewöhnlichen Lichtquellen schwankt die Phase schnell und zufällig.`,
        q:{q:R`Für welches $z_2$ gilt $|1 + z_2|^2 = 1 + |z_2|^2$?`,
          opts:[R`$z_2 = 2$`, R`$z_2 = -2$`, R`$z_2 = 2i$`], a:2,
          ex:R`Der Interferenzterm $2\operatorname{Re}(1\cdot z_2)$ verschwindet genau dann, wenn $z_2$ rein imaginär ist: $|1 + 2i|^2 = 5 = 1 + 4$.`,
          fb:[R`$|1 + 2|^2 = 9$, aber $1 + 4 = 5$: Gleich gerichtete Zeiger verstärken sich.`,
            R`$|1 - 2|^2 = 1$, aber $1 + 4 = 5$: Entgegengesetzte Zeiger schwächen sich.`,
            '']}}
    ]}
  ],
  example:{
    title:'Potenz in Polarform',
    text:'Berechne $(1 + i\\sqrt3)^6$. Sechsmal ausmultiplizieren wäre mühsam – in Polarform geht es schnell.',
    ctx:CTX.line({}),
    lines:[
      {l:'1 + i sqrt(3) = 2 e^(iπ/3)', w:'r = √(1 + 3) = 2, cos φ = 1/2, sin φ = √3/2', why:{q:'Wie findet man $r$ und $\\varphi$?', opts:['$r = \\sqrt{a^2 + b^2}$, $\\cos\\varphi = a/r$, $\\sin\\varphi = b/r$', '$r = a^2 + b^2$, und $\\tan\\varphi = b/a$ genügt', '$r = |a| + |b|$, $\\varphi = \\arctan(a/b)$'], a:0, ex:'Hier ist $r = 2$, $\\cos\\varphi = 1/2$, $\\sin\\varphi = \\sqrt3/2$, also $\\varphi = \\pi/3$ (erster Quadrant). $a^2 + b^2$ ist $r^2$, nicht $r$; und $\\tan\\varphi$ allein legt den Quadranten nicht fest.'}},
      {l:'(1 + i sqrt(3))^6 = 2^6 e^(6iπ/3)', why:{q:'Welche Regel steckt in diesem Schritt?', opts:['$(re^{i\\varphi})^n = r^ne^{in\\varphi}$ (de Moivre)', '$(a + b)^6 = a^6 + b^6$ für jede Summe', '$(re^{i\\varphi})^n = r^ne^{i\\varphi}$, die Phase bleibt'], a:0, ex:'Für ganzzahliges $n$ gilt $(e^{i\\varphi})^n = e^{in\\varphi}$: $n$-mal multiplizieren, die Phasen addieren sich. Für nicht ganzzahlige Exponenten gilt das nicht ohne Weiteres.'}},
      {l:'= 64 e^(2πi)', why:{q:'Was ist $6\\cdot\\pi/3$?', opts:['$2\\pi$', '$\\pi/2$', '$18\\pi$'], a:0, ex:'$6\\pi/3 = 2\\pi$: eine volle Umdrehung.'}},
      {l:'= 64', why:{q:'Warum ist $e^{2\\pi i} = 1$?', opts:['$\\cos 2\\pi + i\\sin 2\\pi = 1 + 0i$', 'weil $|e^{2\\pi i}| = 1$ ist', 'weil $e^{i\\pi} = 1$ ist und quadriert wird'], a:0, ex:'Euler-Formel. Der Betrag allein reicht nicht – auch $-1$ hat Betrag 1. Und $e^{i\\pi} = -1$; quadriert ergibt das zwar 1, aber nicht aus dem genannten Grund.'}}
    ],
    faded:{id:'mk-fade', title:'Jetzt du: $(1 - i)^8$',
      text:'Benutze die Polarform $1 - i = \\sqrt2\\,e^{-i\\pi/4}$ und berechne $(1 - i)^8$.',
      ctx:CTX.line({}),
      given:['1 - i = sqrt(2) e^(-iπ/4)'],
      goals:[{id:'a', prompt:'Berechne $(1 - i)^8$.', type:'value', target:'16', points:2, hints:['Potenz in Polarform: Betrag potenzieren, Phase vervielfachen.', '$(\\sqrt2)^8 = 2^{8/2}$.', '$8\\cdot(-\\pi/4) = -2\\pi$, und $e^{-2\\pi i} = 1$.'],
        model:['1 - i = sqrt(2) e^(-iπ/4)', {l:'(1 - i)^8 = sqrt(2)^8 e^(-8iπ/4)', gap:'(1 - i)^8 = ▢ e^(-8iπ/4)'}, '= 16 e^(-2πi)', '= 16'],
        mistakes:[{expr:'256', msg:'$(\\sqrt2)^8 = 2^{8/2} = 2^4 = 16$, nicht $2^8$.'}, {expr:'-16', msg:'Prüfe die Phase: $8\\cdot(-\\pi/4) = -2\\pi$, und $e^{-2\\pi i} = +1$.'}]}]}
  },
  puzzle:{
    title:'Drei Wellen, gleich stark',
    text:'Beim Doppelspalt mit $z_1 = 1$ und $z_2 = e^{i\\varphi}$ liegt $|z_1 + z_2|^2$ zwischen $0$ und $4$ (Abschnitt 5). Jetzt kommt ein dritter Spalt hinzu. Die drei Amplituden haben wieder alle den Betrag 1, und benachbarte Spalte haben dieselbe relative Phase: $1$, $e^{i\\varphi}$ und $e^{2i\\varphi}$.\n\nWelche Werte kann $|1 + e^{i\\varphi} + e^{2i\\varphi}|^2$ annehmen, wenn man $\\varphi$ verändert?',
    q:{q:'Deine Vermutung:', opts:['alles zwischen $1$ und $9$', 'alles zwischen $0$ und $9$', 'immer $3$', 'alles zwischen $0$ und $3$'], a:1, ex:'$|1 + e^{i\\varphi} + e^{2i\\varphi}|^2 = (1 + 2\\cos\\varphi)^2$ liegt zwischen $0$ und $9$.'},
    reveal:'Mit $|z|^2 = z^*z$ entstehen drei Betragsquadrate (je $1$) und drei Paare von Mischtermen. Die Paare $(1, e^{i\\varphi})$ und $(e^{i\\varphi}, e^{2i\\varphi})$ haben die relative Phase $\\varphi$, das Paar $(1, e^{2i\\varphi})$ die Phase $2\\varphi$:\n\n$$|1 + e^{i\\varphi} + e^{2i\\varphi}|^2 = 3 + 4\\cos\\varphi + 2\\cos 2\\varphi = (1 + 2\\cos\\varphi)^2.$$\n\nIm letzten Schritt steht $\\cos 2\\varphi = 2\\cos^2\\varphi - 1$. Bei $\\varphi = 0$ sind alle Pfeile gleich gerichtet: $3^2 = 9$. Bei $\\varphi = \\pi$ heben sich nur zwei Pfeile auf, und es bleibt $1$. **Null** wird das Ergebnis bei $\\varphi = \\pm 2\\pi/3$: Dann sind die drei Amplituden die dritten Einheitswurzeln aus Abschnitt 3. Ihre Pfeile bilden ein geschlossenes gleichseitiges Dreieck, ihre Summe ist $0$.\n\nAusblick: Mit $N$ gleichen Spalten wächst das Maximum auf $N^2$, und die hellen Streifen werden schmaler. So arbeitet ein optisches Gitter.'
  },
  clarify:{
    core:'Eine komplexe Zahl ist $z = a + ib$ mit reellem Realteil $a = \\operatorname{Re}z$ und Imaginärteil $b = \\operatorname{Im}z$. Konjugieren heißt $i \\to -i$: $z^* = a - ib$. Das **Betragsquadrat** ist reell und nicht negativ:\n\n$$|z|^2 = z^*z = a^2 + b^2.$$\n\nIn **Polarform** ist $z = re^{i\\varphi}$ mit $r = |z|$ und der Phase $\\varphi = \\arg z$. Die Phase ist nur bis auf Vielfache von $2\\pi$ bestimmt; üblich ist der Hauptwert $-\\pi < \\varphi \\le \\pi$. Die Euler-Formel $e^{i\\varphi} = \\cos\\varphi + i\\sin\\varphi$ verbindet beide Formen. Beim Multiplizieren multiplizieren sich die Beträge und addieren sich die Phasen; daraus folgt $(re^{i\\varphi})^n = r^ne^{in\\varphi}$.\n\nUmgekehrt: $\\cos\\varphi = \\tfrac12(e^{i\\varphi} + e^{-i\\varphi})$, $\\sin\\varphi = \\tfrac{1}{2i}(e^{i\\varphi} - e^{-i\\varphi})$. Für reelle $k, x$ gilt $|e^{ikx}| = 1$ und $\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$. Für Summen: $|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\\operatorname{Re}(z_1^*z_2)$.',
    keys:[
      'Konjugieren heißt überall $i \\to -i$ ersetzen, auch im Exponenten: $(e^{ikx})^* = e^{-ikx}$ für reelle $k$, $x$. Es gilt $(z_1z_2)^* = z_1^*z_2^*$.',
      'Division: mit dem Konjugierten des Nenners erweitern, dann ist der Nenner reell: $\\frac{1}{a + ib} = \\frac{a - ib}{a^2 + b^2}$.',
      'Multiplizieren und Potenzieren gehen in Polarform am schnellsten; Addieren in kartesischer Form.',
      'Die Phase nicht blind mit $\\arctan(b/a)$ bestimmen – erst den Quadranten prüfen. $-1 - i$ hat die Phase $-3\\pi/4$ (Hauptwert, $-\\pi < \\varphi \\le \\pi$), nicht $\\pi/4$.',
      'Eine Zahl $z \\neq 0$ hat genau $n$ verschiedene $n$-te Wurzeln: $r^{1/n}e^{i(\\varphi + 2\\pi k)/n}$ mit $k = 0, \\dots, n - 1$.',
      'Eine globale Phase $e^{i\\alpha}$ vor einer ganzen Summe ist unbeobachtbar; eine relative Phase zwischen Summanden ändert das Betragsquadrat.'
    ],
    errors:[
      '$|z|^2 = z^2$ rechnen. Für $z = 1 + i$ ist $z^2 = 2i$, aber $|z|^2 = 2$.',
      '$|a + ib| = a + b$ statt $\\sqrt{a^2 + b^2}$.',
      'Beim Konjugieren das $i$ im Exponenten vergessen: $(e^{i\\varphi})^* = e^{-i\\varphi}$, nicht $e^{i\\varphi}$.',
      '$|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2$ setzen und so den Interferenzterm verlieren.',
      '$\\sqrt a\\sqrt b = \\sqrt{ab}$ ungeprüft im Komplexen benutzen, etwa für zwei negative Zahlen.'
    ],
    more:[{title:'Warum braucht die Quantenmechanik komplexe Zahlen?', text:'Die Schrödingergleichung $i\\hbar\\,\\partial_t\\psi = \\hat H\\psi$ enthält $i$. Ein stationärer Zustand trägt den Phasenfaktor $e^{-iEt/\\hbar}$, der $|\\psi|^2$ nicht ändert (Thema 2). Messbar sind Betragsquadrate. Phasen**unterschiede** werden trotzdem sichtbar, nämlich im Interferenzterm einer Überlagerung.'}],
    checks:[
      {q:'$(3 - 2i)^*\\,(3 - 2i)$ ist …', opts:['$13$', '$5 - 12i$', '$5$'], a:0, ex:'$(3 + 2i)(3 - 2i) = 9 + 4 = 13$. Das ist $|3 - 2i|^2$. Dagegen ist $(3 - 2i)^2 = 5 - 12i$.'},
      {q:'Welche Polarform hat $z = -2$?', opts:['$2e^{i\\pi}$', '$2e^{i\\pi/2}$', '$2e^{-i\\pi/2}$'], a:0, ex:'Betrag $r = 2$, Richtung entlang der negativen reellen Achse: $\\varphi = \\pi$. $2e^{\\pm i\\pi/2} = \\pm 2i$.'}
    ]
  },
  lab:{type:'complex', title:'Komplexe Zahl in der Ebene',
    map:[
      {sym:R`r = |z|`, ctl:'Betrag r', says:R`Länge des Pfeils $z$, also sein Abstand vom Ursprung. Die Anzeige $|z|^2 = z^*z = r^2$ hängt nur von diesem Regler ab.`},
      {sym:R`\varphi = \arg z`, ctl:'Phase φ', says:R`Winkel des Pfeils $z$ zur positiven reellen Achse, im Bogenmaß; dahinter steht er in Grad. Der Regler rastet in Schritten von $1° = \pi/180$ ein, so sind $\pi/4$, $\pi/2$ und $\pi$ genau einstellbar. Vergrößerst du $\varphi$, dreht sich $z$ gegen den Uhrzeigersinn und $z^*$ im Uhrzeigersinn; $|z|^2$ bleibt gleich.`},
      {sym:R`z^* = r\,e^{-i\varphi}`, ctl:'z*', says:R`Der zweite Pfeil: das Spiegelbild von $z$ an der reellen Achse, gleich lang, mit entgegengesetzter Phase.`},
      {sym:R`a = r\cos\varphi`, ctl:'Re', says:R`Waagerechte Achse, der Realteil. Der Schatten der Pfeilspitze auf dieser Achse ist $a = r\cos\varphi$; $z$ und $z^*$ haben denselben. Die Anzeige nennt $a$ und $b$ in $z = a + ib$.`},
      {sym:R`b = r\sin\varphi`, ctl:'Im', says:R`Senkrechte Achse, der Imaginärteil $b = r\sin\varphi$. Bei $z^*$ hat er das umgekehrte Vorzeichen. Der Kreis ist $|z| = 1$; auf ihm liegen alle $e^{i\varphi}$.`}
    ],
    sketch:{id:'mk-lab-s', kind:'arrows', title:'Vorhersage: der Pfeil von $z^*$',
      text:'Gleich zeigt das Labor eine Zahl $z = re^{i\\varphi}$ und ihr Konjugiertes $z^*$. Gegeben ist $z$ mit $r = 1{,}2$ und $\\varphi = 2{,}2$ (grauer Pfeil). Zeichne vorher $z^*$ als Pfeil vom Ursprung aus. Stell danach im Labor $r = 1{,}2$ und $\\varphi = 2{,}2$ ein und vergleiche.',
      plot:{x:[-2, 2], y:[-1.6, 1.6], abs:true, xlab:'\\mathrm{Re}', ylab:'\\mathrm{Im}', unit:true, grid:0.5},
      // z = 1,2·e^{2,2i} = −0,706 + 0,970i, also z* = −0,706 − 0,970i
      given:[{from:[0, 0], to:[1.2 * Math.cos(2.2), 1.2 * Math.sin(2.2)], lab:'z'}],
      want:[{from:[0, 0], to:[1.2 * Math.cos(2.2), -1.2 * Math.sin(2.2)], lab:'z^*', msg:'Konjugieren heißt $i \\to -i$. Was passiert dabei mit dem Realteil von $z$, was mit dem Imaginärteil? (Abschnitt „Rechnen mit komplexen Zahlen“)', msgLen:'Die Richtung passt. Ändert das Konjugieren den Betrag $|z|$?'}],
      reveal:'$z^* = re^{-i\\varphi}$: gleicher Betrag, entgegengesetzte Phase. Der Realteil $-0{,}71$ bleibt, der Imaginärteil wechselt das Vorzeichen, $0{,}97 \\to -0{,}97$. Das ist die Spiegelung an der **reellen** Achse. Die Spiegelung am Ursprung wäre $-z$, die an der imaginären Achse $-z^*$. Im Labor siehst du außerdem: Dreht sich $z$ beim Vergrößern von $\\varphi$ nach links, dreht sich $z^*$ nach rechts.',
      hints:['Lies Real- und Imaginärteil von $z$ am Gitter ab und überlege, welcher davon beim Konjugieren sein Vorzeichen ändert.', '$z^* = a - ib$ für $z = a + ib$: Der Punkt wird an der waagerechten Achse gespiegelt.'],
      wrong:[
        {arrows:[{from:[0, 0], to:[-1.2 * Math.cos(2.2), -1.2 * Math.sin(2.2)]}], fails:[0], why:'Konjugieren als Punktspiegelung am Ursprung (−z)'},
        {arrows:[{from:[0, 0], to:[-1.2 * Math.cos(2.2), 1.2 * Math.sin(2.2)]}], fails:[0], why:'an der imaginären statt an der reellen Achse gespiegelt (−z*)'}
      ]},
    text:'Der eine Pfeil ist $z = re^{i\\varphi}$, der andere sein Spiegelbild $z^*$ an der reellen Achse. Verändere Betrag $r$ und Phase $\\varphi$ und beobachte die Anzeige.',
    predict:{q:'Bevor du die Regler bewegst: Du drehst $z$ bei festem $r$ einmal ganz herum ($\\varphi$ von $-\\pi$ bis $\\pi$). Was macht die Anzeige $|z|^2 = z^*z$?', opts:['Sie bleibt die ganze Zeit $r^2$.', 'Sie schwankt wie $r^2\\cos^2\\varphi$.', 'Sie wird bei $\\varphi = \\pm\\pi/2$ negativ.'], a:0, ex:'$z^*z = re^{-i\\varphi}\\,re^{i\\varphi} = r^2$ hängt nicht von $\\varphi$ ab. $r^2\\cos^2\\varphi$ wäre $(\\operatorname{Re}z)^2$, und negativ wird bei $\\pm\\pi/2$ nur $\\operatorname{Re}(z^2) = r^2\\cos 2\\varphi$.'},
    questions:[
      {q:'Stelle $r = 1$ und $\\varphi \\approx 1{,}57$ ($\\pi/2$) ein. Welche Zahl ist das?', opts:['$i$', '$-1$', '$1$'], a:0, ex:'$e^{i\\pi/2} = \\cos\\frac\\pi2 + i\\sin\\frac\\pi2 = i$.'},
      {q:'Was macht der Pfeil $z^*$, wenn du $\\varphi$ vergrößerst?', opts:['Er dreht sich gegenläufig zu $z$.', 'Er dreht sich in dieselbe Richtung wie $z$.', 'Er bleibt fest auf der reellen Achse.'], a:0, ex:'$z^* = re^{-i\\varphi}$: gleicher Betrag, entgegengesetzte Phase.'}
    ],
    noPic:{q:'Ohne Bild: Was ist $|e^{-i\\omega t}(3 + 4i)|^2$ für reelle $\\omega, t$?', opts:['$25$', '$25\\cos^2\\omega t$', '$7$'], a:0, ex:'$|e^{-i\\omega t}|^2 = 1$ und $|3 + 4i|^2 = 9 + 16 = 25$.'}},
  compare:{
    text:'Gesucht ist $\\left|\\frac{2 + i}{1 - i}\\right|^2$. Zwei richtige Wege:',
    ctx:CTX.line({}),
    A:{name:'Erst dividieren', model:['(2 + i)/(1 - i) = (2 + i)(1 + i)/((1 - i)(1 + i))', '= (1 + 3i)/2', '|(2 + i)/(1 - i)|^2 = (1 + 9)/4', '= 5/2']},
    B:{name:'Beträge getrennt', text:'Es gilt $|z_1/z_2| = |z_1|/|z_2|$.', model:['|(2 + i)/(1 - i)|^2 = |2 + i|^2/|1 - i|^2', '= 5/2']},
    questions:[
      {q:'Welcher Weg ist kürzer, wenn nur der Betrag gefragt ist?', opts:['Weg B', 'Weg A', 'Beide sind gleich lang.'], a:0, ex:'Beträge darf man getrennt bilden: $|2 + i|^2 = 5$, $|1 - i|^2 = 2$.'},
      {q:'Was liefert Weg A zusätzlich?', opts:['Real- und Imaginärteil, also auch die Phase', 'nichts, beide liefern dieselbe Information', 'nur den Betrag, nicht das Betragsquadrat'], a:0, ex:'Aus $(1 + 3i)/2$ liest man Lage und Phase in der Ebene ab. Weg B kennt nur den Betrag.'}
    ]
  },
  practice:[
    {id:'mk-p1', title:'Rechnen mit komplexen Zahlen',
      text:'Gegeben ist $z = (2 + 3i)\\,e^{i\\omega t}$ mit reellen $\\omega, t$.',
      ctx:CTX.line({params:{ω:'pos', t:'pos', m:'pos'}, defs:{'z':'(2 + 3i) e^(i ω t)'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $|z|^2$.', type:'value', target:'13', points:2, ph:'|z|^2 = z^* z', hints:['Gesucht ist ein Betragsquadrat. Welche Rechnung macht aus einer komplexen Zahl eine reelle, nicht negative?', '$|z|^2 = z^*z$ und $(z_1z_2)^* = z_1^*z_2^*$: Konjugiere $2 + 3i$ und $e^{i\\omega t}$ einzeln.', 'Schreibe $(2 - 3i)(2 + 3i)\\,e^{-i\\omega t}e^{i\\omega t}$ und multipliziere aus.'],
          model:['|z|^2 = z^* z', '= (2 - 3i)(2 + 3i) e^(-iωt) e^(iωt)', '= 4 + 9', '= 13'],
          mistakes:[{expr:'sqrt(13)', msg:'Das ist der Betrag $|z|$. Gefragt ist das Betragsquadrat $|z|^2$.'}, {expr:'(-5 + 12i) e^(2iωt)', msg:'Das ist $z^2$. Für $|z|^2$ braucht man $z^*z$, nicht $z\\cdot z$.'}, {expr:'-5 + 12i', msg:'Das ist $(2 + 3i)^2$. Für $|z|^2$ braucht man $z^*z$.'}]},
        {id:'b', prompt:'b) Schreibe $\\dfrac{1}{1 + i}$ in der Form $a + ib$.', type:'value', target:'1/2 - i/2', points:2, ph:'1/(1 + i) = (1 - i)/((1 + i)(1 - i))', hints:['Ziel ist ein reeller Nenner. Womit erweiterst du den Bruch?', 'Mit dem Konjugierten des Nenners: $(1 + i)(1 - i) = 1 - i^2$.', 'Der Nenner ist $2$. Teile Real- und Imaginärteil des Zählers $1 - i$ durch 2.'],
          model:['1/(1 + i) = (1 - i)/((1 + i)(1 - i))', '= (1 - i)/2', '= 1/2 - i/2']},
        {id:'c', prompt:'c) Schreibe $w = \\dfrac{1 + 2i}{3 - i}$ in der Form $a + ib$.', type:'value', target:'1/10 + 7i/10', points:2, ph:'w = (1 + 2i)(3 + i)/((3 - i)(3 + i))', hints:['Wie in b): Mache den Nenner reell.', 'Erweitere mit $3 + i$; der Nenner wird $(3 - i)(3 + i) = 9 + 1$.', 'Zähler: $(1 + 2i)(3 + i) = 3 + i + 6i + 2i^2$. Fasse zusammen und teile durch 10.'],
          model:['w = (1 + 2i)(3 + i)/((3 - i)(3 + i))', '= (3 + 7i - 2)/10', '= 1/10 + 7i/10'],
          mistakes:[{expr:'(1 + 7i)/8', msg:'Prüfe den Nenner: $(3 - i)(3 + i) = 9 - i^2 = 10$.'}]}
      ]},
    {id:'mk-p2', title:'Euler-Formel',
      text:'Für reelles $\\theta$ gilt $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$.',
      ctx:CTX.line({params:{θ:'real', m:'pos'}}),
      goals:[
        {id:'a', prompt:'a) Zeige: $\\dfrac{e^{i\\theta} + e^{-i\\theta}}{2} = \\cos\\theta$.', type:'show', from:'(e^(iθ) + e^(-iθ))/2', to:'cos(θ)', points:2, hints:['Schreibe beide Exponentialfunktionen mit der Euler-Formel als Kosinus und Sinus.', '$e^{-i\\theta} = \\cos\\theta - i\\sin\\theta$, weil $\\cos(-\\theta) = \\cos\\theta$ und $\\sin(-\\theta) = -\\sin\\theta$.', 'Addiere: Die Sinusterme heben sich auf. Teile dann durch 2.'],
          model:['(e^(iθ) + e^(-iθ))/2 = (cos θ + i sin θ + cos θ - i sin θ)/2', '= cos θ']},
        {id:'b', prompt:'b) Berechne $\\left(e^{i\\pi/3}\\right)^6$.', type:'value', target:'1', points:2, hints:['Potenz einer Exponentialfunktion: Was passiert mit dem Exponenten?', '$(e^{a})^n = e^{na}$ für ganzes $n$.', '$6\\cdot\\pi/3 = 2\\pi$. Werte $e^{2\\pi i}$ mit der Euler-Formel aus.'],
          model:['(e^(iπ/3))^6 = e^(6iπ/3)', '= e^(2πi)', '= 1'],
          mistakes:[{expr:'-1', msg:'$e^{2\\pi i} = \\cos 2\\pi + i\\sin 2\\pi = +1$. $-1$ ist dagegen $e^{i\\pi}$.'}]},
        {id:'c', prompt:'c) Zeige mit der Euler-Formel: $\\cos^2\\theta = \\tfrac12(1 + \\cos 2\\theta)$.', type:'show', from:'cos(θ)^2', to:'(1 + cos(2θ))/2', points:3, hints:['Ersetze $\\cos\\theta$ durch Exponentialfunktionen und rechne mit Potenzen weiter.', '$\\cos\\theta = \\tfrac12(e^{i\\theta} + e^{-i\\theta})$; beim Quadrieren hilft die binomische Formel.', 'Der Mischterm ist $2e^{i\\theta}e^{-i\\theta} = 2$. Fasse dann $e^{2i\\theta} + e^{-2i\\theta} = 2\\cos 2\\theta$ zusammen.'],
          model:['cos(θ)^2 = ((e^(iθ) + e^(-iθ))/2)^2', '= (e^(2iθ) + 2 + e^(-2iθ))/4', '= (1 + cos(2θ))/2'],
          note:'Diese Formel brauchst du ständig für $\\int\\sin^2$ und $\\int\\cos^2$, zum Beispiel beim Normieren im Kasten (Thema 3).'}
      ]},
    {id:'mk-p3', title:'Die richtige Phase',
      text:'Gegeben ist $z = -1 - i$. Gesucht ist die Phase $\\varphi = \\arg z$ im Bereich $-\\pi < \\varphi \\le \\pi$.',
      ctx:{coords:['x'], params:{}, defs:{'z':'-1 - i'}},
      goals:[
        {id:'a', prompt:'Bestimme $\\varphi$.', type:'value', target:'-3π/4', points:2, ph:'|z| = sqrt(2)', hints:['Zeichne $z$: In welchem Quadranten liegt die Zahl?', 'Die Phase muss $\\cos\\varphi = a/r$ **und** $\\sin\\varphi = b/r$ erfüllen; $\\arctan(b/a)$ allein reicht nicht.', 'Beide Teile sind negativ: dritter Quadrant. Die Richtung bildet $45°$ mit der negativen reellen Achse, also $\\varphi = -\\pi + \\pi/4$.'],
          model:['|z| = sqrt(2)', 'φ = -π + π/4', '= -3π/4'],
          mistakes:[{expr:'π/4', msg:'$\\arctan(b/a) = \\arctan 1 = \\pi/4$ zeigt in den ersten Quadranten. $z = -1 - i$ liegt aber im dritten.'}, {expr:'5π/4', msg:'Das ist dieselbe Richtung, liegt aber nicht im Bereich $(-\\pi, \\pi]$. Ziehe $2\\pi$ ab.'}, {expr:'3π/4', msg:'Das wäre die Richtung von $-1 + i$. Hier ist auch der Imaginärteil negativ.'}]}
      ]},
    {id:'mk-p4', title:'Komplexe Funktionen',
      text:'$k$ und $x$ sind reell. $A$ und $B$ sind reelle Konstanten.',
      ctx:{coords:['x'], params:{A:'real', B:'real', k:'real'}},
      goals:[
        {id:'a', prompt:'a) Zeige mit der Euler-Formel: $\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$.', type:'show', from:'d/dx e^(ikx)', to:'ik e^(ikx)', points:2, hints:['Führe die Ableitung der komplexen Funktion auf reelle Funktionen zurück.', 'Euler: $e^{ikx} = \\cos kx + i\\sin kx$. Leite Real- und Imaginärteil getrennt ab.', 'Klammere am Ende $ik$ aus: $-k\\sin kx + ik\\cos kx = ik(\\cos kx + i\\sin kx)$.'],
          model:['d/dx e^(ikx) = d/dx (cos(kx) + i sin(kx))', '= -k sin(kx) + ik cos(kx)', '= ik (cos(kx) + i sin(kx))', '= ik e^(ikx)']},
        {id:'b', prompt:'b) Berechne $|A\\,e^{ikx} + B\\,e^{-ikx}|^2$.', type:'value', target:'A^2 + B^2 + 2 A B cos(2kx)', points:3, ph:'|A e^(ikx) + B e^(-ikx)|^2 = (A e^(-ikx) + B e^(ikx))(A e^(ikx) + B e^(-ikx))',
          hints:['Betragsquadrat einer Summe: Schreibe $w^*w$ und multipliziere aus.', 'Konjugieren kehrt die Vorzeichen in den Exponenten um: $w^* = A\\,e^{-ikx} + B\\,e^{ikx}$, weil $A, B$ reell sind.', 'Die Mischterme sind $AB(e^{2ikx} + e^{-2ikx})$. Fasse sie mit dem Kosinus zusammen.'],
          model:['|A e^(ikx) + B e^(-ikx)|^2 = (A e^(-ikx) + B e^(ikx))(A e^(ikx) + B e^(-ikx))', '= A^2 + B^2 + A B (e^(2ikx) + e^(-2ikx))', '= A^2 + B^2 + 2 A B cos(2kx)'],
          mistakes:[{expr:'A^2 + B^2', msg:'Der Interferenzterm fehlt: Beim Ausmultiplizieren entstehen auch die Mischterme $AB\\,e^{\\pm 2ikx}$.'}, {expr:'(A + B)^2', msg:'Das gilt nur dort, wo $\\cos 2kx = 1$ ist, z. B. bei $x = 0$. Die Mischterme hängen von $x$ ab: $2AB\\cos 2kx$.'}],
          note:'Für $A = B$ ist das eine stehende Welle: $|\\psi|^2 = 4A^2\\cos^2 kx$ hat Knoten. Für $B = 0$ (reine ebene Welle) ist die Dichte überall gleich.'}
      ]},
    {id:'mk-p5', title:'Wurzeln komplexer Zahlen',
      text:'Benutze die Polarform: Aus $z^n = re^{i\\varphi}$ folgt $z = r^{1/n}e^{i(\\varphi + 2\\pi k)/n}$ mit $k = 0, \\dots, n - 1$.',
      ctx:{coords:['x'], params:{}, unknowns:{z:{ref:'(1 + i)/sqrt(2)', alt:['-(1 + i)/sqrt(2)']}}},
      goals:[
        {id:'a', prompt:'a) Löse $z^2 = i$. Eine Lösung genügt.', type:'solve', unknown:'z', points:2, ph:'z^2 = i', altMsg:'Richtig – das ist die eine der beiden Wurzeln. Die andere ist $(1 + i)/\\sqrt2$.',
          hints:['Wurzeln zieht man am besten in Polarform.', 'Schreibe $i = e^{i\\pi/2}$. Aus $z^2 = re^{i\\varphi}$ folgt $z = \\sqrt r\\,e^{i\\varphi/2}$ (oder das Negative davon).', '$z = e^{i\\pi/4} = \\cos\\frac\\pi4 + i\\sin\\frac\\pi4$.'],
          model:['z^2 = i', 'z^2 = e^(iπ/2)', 'z = e^(iπ/4)', 'z = (1 + i)/sqrt(2)'],
          mistakes:[{expr:'i/2', msg:'Wurzelziehen ist kein Halbieren der Zahl. In Polarform halbiert man die **Phase** und zieht aus dem Betrag die Wurzel.'}]},
        {id:'b', prompt:'b) Bestimme die Lösung von $w^3 = 1$ mit positivem Imaginärteil.', type:'value', target:'-1/2 + i sqrt(3)/2', points:2, ph:'1 = e^(2πi)',
          hints:['Alle Lösungen von $w^3 = 1$ liegen auf dem Einheitskreis. Wie findest du die nicht reellen?', 'Schreibe $1 = e^{2\\pi ik}$ mit $k = 0, 1, 2$ und teile die Phase durch 3.', 'Für $k = 1$: $w = e^{2\\pi i/3} = \\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3}$.'],
          model:['1 = e^(2πi)', 'w = e^(2πi/3)', '= -1/2 + i sqrt(3)/2'],
          mistakes:[{expr:'1', msg:'$w = 1$ ist die reelle Lösung. Die beiden anderen findest du mit $1 = e^{2\\pi ik}$ für $k = 1, 2$.'}, {expr:'-1/2 - i sqrt(3)/2', msg:'Das ist die dritte Lösung ($k = 2$); ihr Imaginärteil ist negativ.'}]}
      ]}
  ],
  concept:[
    {id:'mk-k1', type:'mc2', q:'Für $z = 1 + i$ rechnet jemand $|z|^2 = z^2 = 2i$. Was ist $|z|^2$ wirklich?', opts:['$2$', '$2i$', '$1^2 + i^2 = 0$'], a:0,
      ex:'$|z|^2 = z^*z = (1 - i)(1 + i) = 1 + 1 = 2$.',
      reason:{q:'Warum?', opts:['$|z|^2 = z^*z$ ist reell und nie negativ.', 'Wie bei reellen Zahlen gilt $|z|^2 = z^2$.', 'Man quadriert Real- und Imaginärteil, also $1$ und $i$.'], a:0, ex:'$z^*z = a^2 + b^2$ mit dem reellen Imaginärteil $b = 1$, nicht $ib$. Ein imaginäres oder negatives „Betragsquadrat“ zeigt sofort, dass die Konjugation fehlt.'},
      seg:'mk-t1', lex:'komplexe-zahlen'},
    {id:'mk-k2', type:'dialog', text:'Ein Zustand ist $\\psi = \\psi_1 + e^{i\\alpha}\\psi_2$ mit reellen Funktionen $\\psi_1, \\psi_2$ und einer reellen Konstanten $\\alpha$.',
      people:[{name:'Lena', says:'Nur ein Faktor vor der **ganzen** Summe fällt heraus. Hier steht $e^{i\\alpha}$ nur vor $\\psi_2$. Also hängt $|\\psi|^2$ von $\\alpha$ ab.'}, {name:'Jonas', says:'Phasenfaktoren sind nicht messbar. Also kann ich $e^{i\\alpha}$ weglassen; $|\\psi|^2$ hängt nicht von $\\alpha$ ab.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'$|\\psi|^2 = \\psi_1^2 + \\psi_2^2 + 2\\psi_1\\psi_2\\cos\\alpha$. Unbeobachtbar ist nur die globale Phase: $e^{i\\beta}\\psi$ und $\\psi$ haben dieselbe Dichte. Die relative Phase $\\alpha$ steckt im Interferenzterm.',
      seg:'mk-t5', lex:'phase-global-relativ'},
    {id:'mk-k3', type:'mc2', q:'Was ist $(3i\\,e^{-i\\omega t})^*$ für reelle $\\omega, t$?', opts:['$-3i\\,e^{i\\omega t}$', '$-3i\\,e^{-i\\omega t}$', '$3i\\,e^{i\\omega t}$'], a:0,
      ex:'$(3i)^* = -3i$ und $(e^{-i\\omega t})^* = e^{i\\omega t}$; konjugiert wird jeder Faktor.',
      reason:{q:'Welche Regel steckt dahinter?', opts:['Jedes $i$ wird zu $-i$, auch im Exponenten.', 'Nur der Vorfaktor wird konjugiert, nicht die Funktion.', 'Nur die Phase dreht sich um, der Vorfaktor bleibt.'], a:0, ex:'$(z_1z_2)^* = z_1^*z_2^*$, und $(e^{i\\varphi})^* = e^{-i\\varphi}$ für reelles $\\varphi$. Beim Betragsquadrat führt das Vergessen einer der beiden Konjugationen zu falschen, zeitabhängigen Ergebnissen.'},
      seg:'mk-t4', lex:'euler'},
    {id:'mk-k4', type:'mc', q:'Jemand rechnet $i\\cdot i = \\sqrt{-1}\\cdot\\sqrt{-1} = \\sqrt{(-1)(-1)} = \\sqrt1 = 1$. Wo steckt der Fehler?', opts:['$\\sqrt a\\sqrt b = \\sqrt{ab}$ gilt nicht für zwei negative Zahlen.', 'Bei $\\sqrt1 = 1$; richtig wäre hier $\\sqrt1 = -1$.', 'Bei $\\sqrt{-1} = i$; richtig wäre $\\sqrt{-1} = -i$.'], a:0,
      ex:'Es gilt $i\\cdot i = i^2 = -1$. Wurzeln aus negativen oder komplexen Zahlen sind nicht eindeutig, und die Produktregel der reellen Wurzel überträgt sich nicht allgemein. (Ist ein Faktor $\\ge 0$, gilt sie mit dem Hauptwert noch, z. B. $\\sqrt{4\\cdot(-1)} = 2i$.) Sicher rechnet man mit „allen Lösungen von $z^2 = w$“ in Polarform.',
      seg:'mk-t3', lex:'polarform'},
    {id:'mk-k5', type:'mc2', q:'Ein Detektor zählt mit nur Weg 1 offen $N$ Teilchen pro Sekunde, mit nur Weg 2 ebenfalls $N$. Wie viele zählt er, wenn beide Wege offen sind und der Weg nicht festgestellt wird?', opts:['je nach Ort zwischen $0$ und $4N$', 'überall genau $2N$, die Summe', 'überall genau $N$, wie mit einem Weg'], a:0,
      ex:'Mit gleich großen Amplituden ist $|z_1 + z_2|^2 = 2|z_1|^2(1 + \\cos\\Delta\\varphi)$, also zwischen $0$ und $4N$.',
      reason:{q:'Warum?', opts:['Amplituden addieren sich; der Mischterm hängt von der Phase ab.', 'Man addiert einfach die Wahrscheinlichkeiten beider Wege.', 'Gleich große Amplituden ändern zusammen nichts am Ergebnis.'], a:0, ex:'Ohne Wegbestimmung gilt $P = |z_1 + z_2|^2$, nicht $|z_1|^2 + |z_2|^2$. Erst wenn man den Weg feststellt, verschwindet der Interferenzterm, und es bleibt $2N$.'},
      seg:'mk-t5', lex:'interferenzterm'}
  ],
  sketch:[
    {id:'mk-s1', kind:'arrows', title:'Multiplikation mit $i$ in der Zahlenebene',
      text:'Gegeben ist $z = 1{,}4 + 0{,}6i$ (grauer Pfeil). Zeichne $iz$ als Pfeil vom Ursprung aus.',
      plot:{x:[-2, 2], y:[-2, 2], abs:true, xlab:'\\mathrm{Re}', ylab:'\\mathrm{Im}', unit:true, grid:0.5},
      given:[{from:[0, 0], to:[1.4, 0.6], lab:'z'}],
      // iz = i(1,4 + 0,6i) = −0,6 + 1,4i
      want:[{from:[0, 0], to:[-0.6, 1.4], lab:'iz', msg:'Schreibe $i$ in Polarform. Was macht die Multiplikation mit einer Zahl vom Betrag 1 mit dem Betrag von $z$, und um welchen Winkel dreht sie? (Abschnitt „Polarform und Euler-Formel“)', msgLen:'Die Richtung passt. Ändert die Multiplikation mit $i$ den Betrag?'}],
      reveal:'$i = e^{i\\pi/2}$ hat den Betrag 1 und die Phase $90°$. Beim Multiplizieren addieren sich die Phasen, die Beträge multiplizieren sich. $iz$ ist also $z$, um $90°$ **gegen** den Uhrzeigersinn gedreht, bei gleicher Länge. Kartesisch: $i(1{,}4 + 0{,}6i) = 1{,}4i + 0{,}6i^2 = -0{,}6 + 1{,}4i$.',
      hints:['Rechne $i(1{,}4 + 0{,}6i)$ kartesisch aus, oder denke in Polarform: Betrag und Phase von $i$.', 'Beträge multiplizieren sich, Phasen addieren sich. $i = e^{i\\pi/2}$.'],
      wrong:[
        {arrows:[{from:[0, 0], to:[1.4, -0.6]}], fails:[0], why:'mit z* verwechselt: an der reellen Achse gespiegelt'},
        {arrows:[{from:[0, 0], to:[0.6, -1.4]}], fails:[0], why:'im Uhrzeigersinn gedreht (−iz)'},
        {arrows:[{from:[0, 0], to:[0.6, 1.4]}], fails:[0], why:'Real- und Imaginärteil nur vertauscht'},
        {arrows:[{from:[0, 0], to:[1.4, 1.6]}], fails:[0], why:'i addiert statt multipliziert (z + i)'}
      ]},
    {id:'mk-s2', kind:'arrows', title:'Ein Produkt in der Zahlenebene',
      text:'Gegeben sind $z$ mit $|z| = 1{,}5$ und $\\arg z = 30°$ sowie $w$ mit $|w| = 0{,}8$ und $\\arg w = 100°$ (graue Pfeile). Zeichne das Produkt $zw$ als Pfeil vom Ursprung aus.',
      plot:{x:[-2, 2], y:[-2, 2], abs:true, xlab:'\\mathrm{Re}', ylab:'\\mathrm{Im}', unit:true, grid:0.5},
      given:[{from:[0, 0], to:[1.5 * Math.cos(Math.PI / 6), 1.5 * Math.sin(Math.PI / 6)], lab:'z'}, {from:[0, 0], to:[0.8 * Math.cos(100 * Math.PI / 180), 0.8 * Math.sin(100 * Math.PI / 180)], lab:'w'}],
      // zw = 1,5·0,8·e^{i(30° + 100°)} = 1,2·e^{i·130°} = −0,771 + 0,919i
      want:[{from:[0, 0], to:[1.2 * Math.cos(130 * Math.PI / 180), 1.2 * Math.sin(130 * Math.PI / 180)], lab:'zw', msg:'Schreibe $z$ und $w$ in Polarform und multipliziere. Was geschieht dabei mit den Beträgen, was mit den Phasen? (Abschnitt „Polarform und Euler-Formel“)', msgDir:'Welche Phase hat $zw$? Werden Phasen beim Multiplizieren addiert, multipliziert oder voneinander abgezogen?', msgLen:'Die Richtung passt. Wie groß ist $|zw|$ bei $|z| = 1{,}5$ und $|w| = 0{,}8$?'}],
      reveal:'$zw = 1{,}5\\cdot 0{,}8\\,e^{i(30° + 100°)} = 1{,}2\\,e^{i\\cdot 130°}$. Beträge multiplizieren sich, Phasen addieren sich. Der Pfeil ist deshalb kürzer als $z$, weil $|w| < 1$ ist, und um $100°$ weitergedreht. Mit der Vektorsumme $z + w$ hat das Produkt nichts zu tun.',
      hints:['Bestimme zuerst $|zw|$ und $\\arg(zw)$ aus den gegebenen Beträgen und Phasen; zeichne dann.', '$r_1e^{i\\varphi_1}\\cdot r_2e^{i\\varphi_2} = r_1r_2\\,e^{i(\\varphi_1 + \\varphi_2)}$.'],
      wrong:[
        {arrows:[{from:[0, 0], to:[1.5 * Math.cos(Math.PI / 6) + 0.8 * Math.cos(100 * Math.PI / 180), 1.5 * Math.sin(Math.PI / 6) + 0.8 * Math.sin(100 * Math.PI / 180)]}], fails:[0], why:'Produkt wie eine Vektorsumme z + w gezeichnet'},
        {arrows:[{from:[0, 0], to:[2.3 * Math.cos(130 * Math.PI / 180), 2.3 * Math.sin(130 * Math.PI / 180)]}], fails:[0], why:'Phasen addiert, Beträge aber addiert statt multipliziert'},
        {arrows:[{from:[0, 0], to:[1.2 * Math.cos(-70 * Math.PI / 180), 1.2 * Math.sin(-70 * Math.PI / 180)]}], fails:[0], why:'Phasen abgezogen statt addiert'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'mk-f2', title:'Division', text:'Schreibe $\\dfrac{3 + i}{1 + 2i}$ in der Form $a + ib$.', ctx:CTX.line({}),
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'1 - i', points:2, model:['(3 + i)/(1 + 2i) = (3 + i)(1 - 2i)/((1 + 2i)(1 - 2i))', '= (5 - 5i)/5', '= 1 - i'],
        mistakes:[{expr:'(5 - 5i)/(-3)', msg:'Prüfe den Nenner: $(1 + 2i)(1 - 2i) = 1 - 4i^2 = 5$.'}]}]}},
    {aim:1, task:{id:'mk-f3', title:'Potenz', text:'Berechne $(\\sqrt3 + i)^3$.', ctx:CTX.line({}),
      goals:[{id:'a', prompt:'Ergebnis in der Form $a + ib$:', type:'value', target:'8i', points:2, model:['sqrt(3) + i = 2 e^(iπ/6)', '(sqrt(3) + i)^3 = 8 e^(iπ/2)', '= 8i'],
        mistakes:[{expr:'8', msg:'Der Betrag stimmt. Die Phase ist aber $3\\cdot\\pi/6 = \\pi/2$, und $e^{i\\pi/2} = i$.'}, {expr:'3 sqrt(3) + i', msg:'$(a + b)^3 \\neq a^3 + b^3$. Rechne in Polarform oder mit dem binomischen Lehrsatz.'}]}]}},
    {aim:2, task:{id:'mk-f4', title:'Interferenzterm', text:'$\\theta$ ist reell. Berechne $|2 + i\\,e^{i\\theta}|^2$.', ctx:{coords:['x'], params:{θ:'real'}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'5 - 4 sin(θ)', points:3, model:['|2 + i e^(iθ)|^2 = (2 - i e^(-iθ))(2 + i e^(iθ))', '= 4 + 1 + 2i e^(iθ) - 2i e^(-iθ)', '= 5 - 4 sin(θ)'],
        mistakes:[{expr:'5', msg:'Der Interferenzterm fehlt. Beim Ausmultiplizieren entstehen die Mischterme $2i\\,e^{i\\theta} - 2i\\,e^{-i\\theta}$.'}, {expr:'5 + 4 cos(θ)', msg:'Der Faktor $i$ verschiebt die Phase um $\\pi/2$: $2\\operatorname{Re}(2i\\,e^{i\\theta}) = -4\\sin\\theta$.'}]}]}},
    {aim:'k', id:'mk-fk1', type:'mc2', q:'Für welche relative Phase $\\Delta\\varphi$ gilt $|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2$, wenn beide Amplituden nicht null sind?', opts:['$\\Delta\\varphi = \\pm\\pi/2$', '$\\Delta\\varphi = 0$', 'für jede Phase'], a:0,
      ex:'Dann ist der Interferenzterm $2r_1r_2\\cos\\Delta\\varphi = 0$.',
      reason:{q:'Warum?', opts:['Dann ist $\\operatorname{Re}(z_1^*z_2) = r_1r_2\\cos\\Delta\\varphi = 0$.', 'Dann zeigen beide Pfeile gleich und addieren sich einfach.', 'Betragsquadrate addieren sich immer.'], a:0, ex:'Bei $\\Delta\\varphi = 0$ ist der Mischterm maximal, $2r_1r_2$. Betragsquadrate addieren sich nur, wenn der Mischterm verschwindet.'}},
    {aim:'k', id:'mk-fk2', type:'dialog', text:'Zwei Phasenfaktoren mit verschiedenen Frequenzen werden **multipliziert**: $z(t) = e^{-i\\omega_1t}\\,e^{-i\\omega_2t}$ mit reellen $t$ und $\\omega_1 \\neq \\omega_2$.',
      people:[{name:'Lena', says:'$|z|^2 = |e^{-i\\omega_1t}|^2\\,|e^{-i\\omega_2t}|^2 = 1$ für jede Zeit $t$.'}, {name:'Jonas', says:'Zwei verschiedene Frequenzen interferieren. $|z|^2$ enthält deshalb einen Term mit $\\cos((\\omega_1 - \\omega_2)t)$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Bei einem **Produkt** multiplizieren sich die Beträge: $z = e^{-i(\\omega_1 + \\omega_2)t}$ hat den Betrag 1. Einen Interferenzterm gibt es nur im Betragsquadrat einer **Summe**, etwa $|e^{-i\\omega_1t} + e^{-i\\omega_2t}|^2 = 2 + 2\\cos((\\omega_1 - \\omega_2)t)$.'},
    {aim:1, sketch:{id:'mk-fs-a', kind:'arrows', title:'Alle dritten Wurzeln', points:3,
      text:'Zeichne **alle** Lösungen von $z^3 = -8$ als Pfeile vom Ursprung aus.',
      plot:{x:[-2.5, 2.5], y:[-2.5, 2.5], abs:true, xlab:'\\mathrm{Re}', ylab:'\\mathrm{Im}', unit:true, grid:0.5},
      // −8 = 8e^{iπ}: z_k = 2e^{i(π + 2πk)/3}, k = 0, 1, 2 → 2e^{iπ/3}, −2, 2e^{−iπ/3}
      want:[
        {from:[0, 0], to:[2 * Math.cos(Math.PI / 3), 2 * Math.sin(Math.PI / 3)], msg:'Schreibe $-8$ in Polarform. Welche Phase hat die Lösung mit $k = 0$?'},
        {from:[0, 0], to:[-2, 0], msg:'Ist eine der Lösungen reell? Probiere es durch Einsetzen.'},
        {from:[0, 0], to:[2 * Math.cos(Math.PI / 3), -2 * Math.sin(Math.PI / 3)], msg:'Wie viele Lösungen hat $z^3 = w$, und welchen Winkelabstand haben sie voneinander?'}],
      extra:'Es sind mehr Pfeile gezeichnet, als es Lösungen gibt. Radiere die überzähligen.',
      reveal:'$-8 = 8e^{i\\pi}$, also $z_k = 2\\,e^{i(\\pi + 2\\pi k)/3}$ für $k = 0, 1, 2$: die Phasen $60°$, $180°$ und $-60°$. Alle drei Lösungen haben den Betrag $8^{1/3} = 2$ und liegen im Winkelabstand $120°$ – die Ecken eines gleichseitigen Dreiecks. Die reelle Lösung $-2$ ist nur eine davon.',
      wrong:[
        {arrows:[{from:[0, 0], to:[-2, 0]}], fails:[0, 2], why:'nur die reelle Lösung −2'},
        {arrows:[{from:[0, 0], to:[2, 0]}, {from:[0, 0], to:[-1, Math.sqrt(3)]}, {from:[0, 0], to:[-1, -Math.sqrt(3)]}], fails:[0, 1, 2], why:'Phase von −8 vergessen: Wurzeln von +8 gezeichnet'},
        {arrows:[{from:[0, 0], to:[1, Math.sqrt(3)]}, {from:[0, 0], to:[-1, Math.sqrt(3)]}, {from:[0, 0], to:[-2, 0]}], fails:[2], why:'Winkelabstand π/n statt 2π/n'}
      ]}}
  ],
  finalB:[
    {aim:0, task:{id:'mk-g1', title:'Division', text:'Schreibe $\\dfrac{2 - i}{1 + i}$ in der Form $a + ib$.', ctx:CTX.line({}),
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'1/2 - 3i/2', points:2, model:['(2 - i)/(1 + i) = (2 - i)(1 - i)/((1 + i)(1 - i))', '= (1 - 3i)/2', '= 1/2 - 3i/2'],
        mistakes:[{expr:'1 - 3i', msg:'Teile noch durch den Nenner $(1 + i)(1 - i) = 1 - i^2 = 2$.'}]}]}},
    {aim:1, task:{id:'mk-g2', title:'Potenz', text:'Berechne $(-1 + i)^4$.', ctx:CTX.line({}),
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'-4', points:2, model:['-1 + i = sqrt(2) e^(3iπ/4)', '(-1 + i)^4 = 4 e^(3iπ)', '= -4'],
        mistakes:[{expr:'4', msg:'Der Betrag stimmt. Die Phase ist $4\\cdot 3\\pi/4 = 3\\pi$, und $e^{3\\pi i} = -1$.'}, {expr:'2', msg:'$(\\sqrt2)^4 = 4$.'}]}]}},
    {aim:2, task:{id:'mk-g3', title:'Interferenzterm', text:'$\\theta$ ist reell. Berechne $|1 - 2i\\,e^{i\\theta}|^2$.', ctx:{coords:['x'], params:{θ:'real'}},
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'5 + 4 sin(θ)', points:3, model:['|1 - 2i e^(iθ)|^2 = (1 + 2i e^(-iθ))(1 - 2i e^(iθ))', '= 1 + 4 - 2i e^(iθ) + 2i e^(-iθ)', '= 5 + 4 sin(θ)'],
        mistakes:[{expr:'5', msg:'Der Interferenzterm fehlt. Beim Ausmultiplizieren entstehen die Mischterme $-2i\\,e^{i\\theta} + 2i\\,e^{-i\\theta}$.'}, {expr:'5 - 4 cos(θ)', msg:'Der Faktor $-2i$ verschiebt die Phase: $2\\operatorname{Re}(-2i\\,e^{i\\theta}) = 4\\sin\\theta$.'}]}]}},
    {aim:'k', id:'mk-gk1', type:'mc2', q:'Zwei Amplituden sind $z_1 = 2$ und $z_2 = 2e^{i\\Delta\\varphi}$. Für welche $\\Delta\\varphi$ ist $|z_1 + z_2|^2 = 0$?', opts:['$\\Delta\\varphi = \\pi$', '$\\Delta\\varphi = \\pi/2$', 'für keine, weil beide Beträge 2 sind'], a:0,
      ex:'$|z_1 + z_2|^2 = 4 + 4 + 8\\cos\\Delta\\varphi$ ist bei $\\Delta\\varphi = \\pi$ null.',
      reason:{q:'Warum?', opts:['Dann ist $z_2 = -z_1$, und der Mischterm $-8$ hebt $4 + 4$ auf.', 'Dann stehen die Pfeile senkrecht und heben sich auf.', 'Betragsquadrate sind positiv, eine Summe davon nie null.'], a:0, ex:'Bei $\\Delta\\varphi = \\pi/2$ verschwindet nur der Mischterm; es bleibt $8$. Null wird nicht eine Summe von Betragsquadraten, sondern das Betragsquadrat einer Summe von Amplituden.'}},
    {aim:'k', id:'mk-gk2', type:'dialog', text:'Zwei Phasenfaktoren mit verschiedenen Wellenzahlen werden **addiert**: $z(x) = e^{ik_1x} + e^{ik_2x}$ mit reellen $x$ und $k_1 \\neq k_2$.',
      people:[{name:'Lena', says:'Jeder Summand hat den Betrag 1. Also ist $|z|^2 = 1 + 1 = 2$ für jedes $x$.'}, {name:'Jonas', says:'$|z|^2 = 2 + 2\\cos((k_2 - k_1)x)$ hängt von $x$ ab und wird an manchen Stellen null.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Bei einer **Summe** kommen zu den Betragsquadraten die Mischterme $e^{i(k_2 - k_1)x} + e^{-i(k_2 - k_1)x} = 2\\cos((k_2 - k_1)x)$ hinzu. Lena addiert Betragsquadrate statt Amplituden. Nur bei einem **Produkt** wie $e^{ik_1x}e^{ik_2x}$ wäre $|z|^2 = 1$ konstant.'},
    {aim:1, sketch:{id:'mk-fs-b', kind:'arrows', title:'Alle dritten Wurzeln', points:3,
      text:'Zeichne **alle** Lösungen von $z^3 = 8i$ als Pfeile vom Ursprung aus.',
      plot:{x:[-2.5, 2.5], y:[-2.5, 2.5], abs:true, xlab:'\\mathrm{Re}', ylab:'\\mathrm{Im}', unit:true, grid:0.5},
      // 8i = 8e^{iπ/2}: z_k = 2e^{i(π/2 + 2πk)/3} → 2e^{iπ/6}, 2e^{5iπ/6}, 2e^{3iπ/2} = −2i
      want:[
        {from:[0, 0], to:[2 * Math.cos(Math.PI / 6), 2 * Math.sin(Math.PI / 6)], msg:'Schreibe $8i$ in Polarform. Welche Phase hat die Lösung mit $k = 0$?'},
        {from:[0, 0], to:[-2 * Math.cos(Math.PI / 6), 2 * Math.sin(Math.PI / 6)], msg:'Wie viele Lösungen hat $z^3 = w$, und welchen Winkelabstand haben sie voneinander?'},
        {from:[0, 0], to:[0, -2], msg:'Liegt eine der Lösungen auf einer Achse? Probiere es durch Einsetzen.'}],
      extra:'Es sind mehr Pfeile gezeichnet, als es Lösungen gibt. Radiere die überzähligen.',
      reveal:'$8i = 8e^{i\\pi/2}$, also $z_k = 2\\,e^{i(\\pi/2 + 2\\pi k)/3}$ für $k = 0, 1, 2$: die Phasen $30°$, $150°$ und $270°$. Alle drei Lösungen haben den Betrag $8^{1/3} = 2$ und liegen im Winkelabstand $120°$. Probe für die dritte: $(-2i)^3 = -8i^3 = 8i$.',
      wrong:[
        {arrows:[{from:[0, 0], to:[0, -2]}], fails:[0, 1], why:'nur die eine Lösung −2i, die man durch Probieren findet'},
        {arrows:[{from:[0, 0], to:[2, 0]}, {from:[0, 0], to:[-1, Math.sqrt(3)]}, {from:[0, 0], to:[-1, -Math.sqrt(3)]}], fails:[0, 1, 2], why:'Phase von 8i vergessen: Wurzeln von +8 gezeichnet'},
        {arrows:[{from:[0, 0], to:[Math.sqrt(3), 1]}, {from:[0, 0], to:[0, 2]}, {from:[0, 0], to:[-Math.sqrt(3), 1]}], fails:[2], why:'Winkelabstand π/n statt 2π/n'}
      ]}}
  ],
  errors:[
    {id:'mk-e1', title:'Betragsquadrat ohne Konjugation',
      text:'Gesucht ist $|z|^2$ für $z = (1 + 2i)\\,e^{ikx}$ mit reellen $k$, $x$. So wurde gerechnet:',
      ctx:CTX.line({params:{k:'real', m:'pos'}, defs:{'z':'(1 + 2i) e^(i k x)'}}),
      lines:['|z|^2 = z^2', '= (1 + 2i)^2 e^(2ikx)', '= (-3 + 4i) e^(2ikx)'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['$|z|^2 = z^*z$, nicht $z^2$; das Ergebnis muss reell sein.', 'Der Exponent muss $e^{ikx}$ bleiben, nicht $e^{2ikx}$.', 'Nichts – nur das Ausmultiplizieren ist falsch.'], a:0, ex:'Ein Betragsquadrat ist immer reell und $\\ge 0$. $(-3 + 4i)e^{2ikx}$ kann also nicht stimmen.'},
      fix:{id:'a', prompt:'Berichtige und berechne $|z|^2$.', type:'value', target:'5', model:['|z|^2 = z^* z', '= (1 - 2i)(1 + 2i) e^(-ikx) e^(ikx)', '= 5']}},
    {id:'mk-e2', title:'Phase im falschen Quadranten',
      text:'Gesucht ist die Polarform von $z = -1 + i\\sqrt3$. Jemand rechnet $\\tan\\varphi = \\sqrt3/(-1) = -\\sqrt3$, also $\\varphi = -\\pi/3$:',
      ctx:{coords:['x'], params:{}, defs:{'z':'-1 + i sqrt(3)'}},
      lines:['|z| = 2', 'z = 2 e^(-iπ/3)'],
      wrong:1,
      why:{q:'Was ist falsch?', opts:['$\\arctan$ trifft nur $(-\\pi/2, \\pi/2)$; $z$ liegt im 2. Quadranten.', 'Der Betrag ist $1 + 3 = 4$, nicht $2$.', 'Der Tangens ist $+\\sqrt3$; das Minus gehört nicht dazu.'], a:0, ex:'$2e^{-i\\pi/3} = 1 - i\\sqrt3$ liegt im vierten Quadranten. Richtig ist $\\varphi = \\pi - \\pi/3 = 2\\pi/3$. Der Betrag ist $\\sqrt{1 + 3} = 2$, und $\\tan\\varphi = -\\sqrt3$ stimmt – er legt den Quadranten nur nicht fest.'},
      fix:{id:'a', prompt:'Bestimme die richtige Phase $\\varphi$ mit $-\\pi < \\varphi \\le \\pi$.', type:'value', target:'2π/3', model:['φ = π - π/3', '= 2π/3'],
        mistakes:[{expr:'-π/3', msg:'Das ist der Winkel aus $\\arctan$. Prüfe den Quadranten: Realteil negativ, Imaginärteil positiv.'}]}}
  ]
});
lexe('polarform', 'Polarform', '$z = re^{i\\varphi}$ mit $r = |z| = \\sqrt{a^2 + b^2}$ und der Phase $\\varphi = \\arg z$, für die $\\cos\\varphi = a/r$, $\\sin\\varphi = b/r$ gilt (Quadrant beachten!). $\\varphi$ ist nur bis auf Vielfache von $2\\pi$ bestimmt; üblich ist der Hauptwert $-\\pi < \\varphi \\le \\pi$. Rechenregeln: $z_1z_2 = r_1r_2e^{i(\\varphi_1 + \\varphi_2)}$, $z^n = r^ne^{in\\varphi}$, $z^* = re^{-i\\varphi}$. Die $n$-ten Wurzeln von $z$ sind $r^{1/n}e^{i(\\varphi + 2\\pi k)/n}$, $k = 0, \\dots, n-1$.', {topic:'m-komplex'});
lexe('interferenzterm', 'Betragsquadrat einer Summe (Interferenzterm)', '$|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\\operatorname{Re}(z_1^*z_2)$. Der Mischterm hängt von der relativen Phase ab: Für $|z_1| = |z_2| = 1$ und $z_2 = z_1e^{i\\varphi}$ ist $|z_1 + z_2|^2 = 2 + 2\\cos\\varphi$. In der Quantenmechanik überlagern sich Amplituden; der Interferenzterm erzeugt zum Beispiel das Doppelspaltmuster.', {topic:'m-komplex'});
lexe('phase-global-relativ', 'Globale und relative Phase', 'Ein gemeinsamer Faktor $e^{i\\alpha}$ vor einem ganzen Zustand (globale Phase) ändert kein Betragsquadrat: $|e^{i\\alpha}\\psi|^2 = |\\psi|^2$. Er ist nicht beobachtbar. Eine Phase zwischen den Summanden einer Überlagerung (relative Phase) ändert dagegen den Interferenzterm: $|\\psi_1 + e^{i\\alpha}\\psi_2|^2 = |\\psi_1|^2 + |\\psi_2|^2 + 2\\operatorname{Re}(e^{i\\alpha}\\psi_1^*\\psi_2)$.', {topic:'m-komplex'});
})();
