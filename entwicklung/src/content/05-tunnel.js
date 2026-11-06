/* ===== Thema 5: Stufe, Barriere, Tunneleffekt ===== */
(function(){
const R = String.raw;
const TUN_UP = () => ({coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['1.3 V_0', '3 V_0']}},
  defs:{k:'sqrt(2m E)/ħ', q:'sqrt(2m (E - V_0))/ħ', 'ψ_L(x)':'e^(i k x) + B e^(-i k x)', 'ψ_R(x)':'C e^(i q x)'},
  unknowns:{B:{ref:'(k - q)/(k + q)', kind:'real'}, C:{ref:'2k/(k + q)', kind:'real'}}});
const TUN_DOWN = () => ({coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['0.15 V_0', '0.85 V_0']}},
  defs:{k:'sqrt(2m E)/ħ', κ:'sqrt(2m (V_0 - E))/ħ', 'ψ_L(x)':'e^(i k x) + B e^(-i k x)', 'ψ_R(x)':'C e^(-κ x)'},
  unknowns:{B:{ref:'(k - iκ)/(k + iκ)', kind:'complex'}, C:{ref:'2k/(k + iκ)', kind:'complex'}, d:{ref:'1/(2κ)'}}});
const TUN_DELTA = () => ({coords:['x'], params:{m:'pos', α:'pos'}, defs:{'ψ(x)':'A e^(-κ |x|)'},
  unknowns:{κ:{ref:'m α/ħ^2'}, A:{ref:'sqrt(m α)/ħ', alt:['-sqrt(m α)/ħ']}, E:{ref:'-m α^2/(2ħ^2)', kind:'real'}}});
const TUN_STEP = (E) => ({coords:[], params:{m:'pos', V_0:'pos'}, defs:{E, k:'sqrt(2m E)/ħ', q:'sqrt(2m (E - V_0))/ħ'},
  unknowns:{B:{ref:'(k - q)/(k + q)', kind:'real'}, C:{ref:'2k/(k + q)', kind:'real'}}});
const TUN_SYN = () => ({coords:['x', 'k'], space:['x'], params:{m:'pos', α:'pos'}, defs:{κ:'m α/ħ^2', 'ψ(x)':'sqrt(κ) e^(-κ |x|)', 'φ(k)':'sqrt(2κ^3/π)/(κ^2 + k^2)'}, state:'ψ', normalized:true});
topic({
  id:'tunnel', math:['m-dgl', 'm-analysis'], title:'Stufe, Barriere, Tunneleffekt', short:'Tunneleffekt',
  src:'Griffiths & Schroeter Kap. 2 · Nolting 5/1 Kap. 4',
  goals:[
    'Ich kann an einer Potentialstufe die Anschlussbedingungen aufstellen und Reflexions- und Transmissionswahrscheinlichkeit berechnen.',
    'Ich kann erklären, warum ein Teilchen in einen klassisch verbotenen Bereich eindringt und durch eine Barriere tunnelt.',
    'Ich kann den gebundenen Zustand im $\\delta$-Potential mit der Sprungbedingung für $\\psi\'$ bestimmen.'
  ],
  needs:'stationäre Schrödingergleichung · $e^{ikx}$ ableiten · komplexe Zahlen · Stromdichte $j = \\frac{\\hbar}{m}\\,\\mathrm{Im}(\\psi^*\\psi\')$',
  wozu:'Ohne Tunneleffekt gäbe es keinen α-Zerfall, und das Rastertunnelmikroskop könnte keine einzelnen Atome abbilden. In Flash-Speichern gelangen Elektronen beim Löschen durch eine dünne Oxidschicht – ebenfalls durch Tunneln. Die Methode dieses Themas, Lösungen stückweise anzusetzen und an den Grenzen anzuschließen, brauchst du überall, wo sich ein Potential sprunghaft ändert: an Oberflächen, an Grenzflächen in Halbleitern, in Quantentöpfen.',
  bridge:'Aus Thema 2 kommen die stationäre Schrödingergleichung und die Stromdichte $j$, aus Thema 4 die ebenen Wellen $e^{\\pm ikx}$ als Modell eines Teilchenstrahls, aus Thema 3 die Randbedingung an einer unendlich hohen Wand. Mathematisch brauchst du lineare DGL mit konstanten Koeffizienten (M7), komplexe Zahlen (M1) und die δ-Distribution (M2). Neu: Lösungen in mehreren Bereichen werden durch Anschlussbedingungen verbunden.',
  check:[
    {q:'Welche Lösung hat $\\psi\'\' = -k^2\\psi$ mit $k > 0$?', opts:['$\\psi = Ae^{ikx} + Be^{-ikx}$', '$\\psi = Ae^{kx} + Be^{-kx}$', '$\\psi = Ax + B$'], a:0, ex:'Zweimal Ableiten von $e^{\\pm ikx}$ liefert $-k^2e^{\\pm ikx}$. Bei $\\psi\'\' = +\\kappa^2\\psi$ wären es reelle Exponentialfunktionen.', lex:'lineare-dgl', prev:'m-dgl', seg:'md-t3'},
    {q:'Was ist $\\frac{d}{dx}\\,B\\,e^{-ikx}$?', opts:['$-ikB\\,e^{-ikx}$', '$ikB\\,e^{-ikx}$', '$-kB\\,e^{-ikx}$'], a:0, ex:'Kettenregel: Die innere Ableitung von $-ikx$ ist $-ik$.', lex:'komplexe-zahlen'},
    {q:'Für $z = \\frac{k - i\\kappa}{k + i\\kappa}$ mit reellen $k,\\kappa$ gilt $|z| = $', opts:['$1$', '$\\frac{k-\\kappa}{k+\\kappa}$', '$0$'], a:0, ex:'Zähler und Nenner sind zueinander konjugiert und haben denselben Betrag $\\sqrt{k^2+\\kappa^2}$.', lex:'komplexe-zahlen'},
    {q:'Ein Teilchen mit $E < V_0$ trifft klassisch auf eine Wand der Höhe $V_0$. Was passiert klassisch?', opts:['Es wird immer reflektiert.', 'Es geht mit kleinerer Geschwindigkeit weiter.', 'Es bleibt an der Wand stehen.'], a:0, ex:'Klassisch ist der Bereich mit $V > E$ verboten ($E_{kin} < 0$). Quantenmechanisch dringt die Welle trotzdem ein.', lex:'tunneleffekt'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Reflexionswahrscheinlichkeit an einer Potentialstufe zu berechnen?', opts:['in jedem Bereich die Lösung ansetzen und bei $x = 0$ $\\psi$ und $\\psi\'$ anschließen', 'die klassische Energieerhaltung nach der Geschwindigkeit hinter der Stufe auflösen', '$|\\psi|^2$ links und rechts gleichsetzen und nach der Amplitude auflösen'], a:0, dk:true,
      ex:'Reflexion an einer Stufe ist ein Welleneffekt; klassisch gäbe es sie bei $E > V_0$ gar nicht. Gleich sein müssen $\\psi$ und $\\psi\'$ an der Grenze, nicht die Dichten.'},
    {q:'Wie beginnst du, um die Energie des gebundenen Zustands im Potential $V = -\\alpha\\,\\delta(x)$ zu bestimmen?', opts:['$\\psi = Ae^{-\\kappa|x|}$ ansetzen und den Sprung von $\\psi\'$ bei $x = 0$ benutzen', 'die Lösung des unendlichen Kastens nehmen und die Breite gegen null gehen lassen', '$E = \\langle V\\rangle = -\\alpha$ setzen, weil nur bei $x = 0$ ein Potential wirkt'], a:0, dk:true,
      ex:'Außerhalb von $x = 0$ ist das Teilchen frei; normierbar ist nur $e^{-\\kappa|x|}$. Die Schrödingergleichung, über $x = 0$ integriert, liefert einen Knick in $\\psi$ und daraus $\\kappa$.'}
  ],
  phenomenon:{
    title:'Was kommt hinter der Barriere an?',
    text:'Ein Elektronenstrahl mit der Energie $E$ trifft auf eine dünne Barriere der Höhe $V_0 > E$. Links und rechts der Barriere ist $V = 0$. Ein kleiner Teil der Elektronen kommt durch.\n\nWas gilt für die durchgekommenen Elektronen?',
    q:{q:'Deine Vorhersage:', opts:['Sie haben weniger Energie als vorher und eine größere Wellenlänge.', 'Sie haben dieselbe Energie und dieselbe Wellenlänge; es sind nur weniger.', 'Sie haben mehr Energie, weil sie die Barriere überwinden mussten.'], a:1,
      ex:'In allen Bereichen gilt dasselbe $E$, und rechts ist $V = 0$ wie links.',
      fb:[
        'Diese Vorstellung ist unter Studierenden verbreitet (McKagan, Perkins & Wieman 2008): Das Teilchen „verbraucht“ in der Barriere Energie. Ein stationärer Zustand hat aber in allen Bereichen dasselbe $E$. Rechts ist $V = 0$ wie links, also ist auch $k = \\sqrt{2mE}/\\hbar$ gleich. Kleiner ist nur die Amplitude.',
        'Richtig. Die Wellenzahl hängt von der kinetischen Energie $E - V$ ab, und die ist rechts dieselbe wie links. Die kleinere Amplitude bedeutet: Nur wenige Elektronen kommen durch – diese aber mit voller Energie.',
        'Energie wird weder verbraucht noch gewonnen: In der stationären Schrödingergleichung steht in allen Bereichen dasselbe $E$. Wer durchkommt, kommt mit der Anfangsenergie an.'
      ]},
    reveal:'In der stationären Schrödingergleichung steht **ein** $E$ für alle Bereiche. Links und rechts der Barriere ist $V = 0$; deshalb ist die Wellenzahl $k = \\sqrt{2mE}/\\hbar$ auf beiden Seiten gleich – und damit auch die Wellenlänge. Die durchgelassene Welle hat nur eine kleinere **Amplitude**. Ihr Betragsquadrat ist die Wahrscheinlichkeit, dass ein einzelnes Elektron durchkommt. In der Barriere selbst schwingt $\\psi$ nicht, sondern ändert sich exponentiell.\n\nDie Vorstellung „Energieverlust beim Tunneln“ ist verbreitet und hängt oft damit zusammen, dass man die kleinere Amplitude als kleinere Energie liest (McKagan, Perkins & Wieman 2008). Die Energie siehst du an der Wellenlänge, nicht an der Amplitude.'
  },
  teach:[
    {id:'tunnel-t1', title:'Stückweise konstantes Potential: Wellen und Exponentialfunktionen',
      text:R`Viele Potentiale lassen sich gut durch Stücke mit konstantem $V$ annähern: eine Metalloberfläche, eine Oxidschicht zwischen zwei Leitern, eine dünne Halbleiterschicht. In jedem Stück ist die stationäre Schrödingergleichung eine DGL mit konstanten Koeffizienten ([[lex:lineare-dgl|lineare DGL]], M7):

$$\psi'' = -\frac{2m}{\hbar^2}(E - V)\,\psi.$$

Es gibt zwei Fälle.

- **Erlaubter Bereich, $E > V$:** $\psi'' = -k^2\psi$ mit $k = \sqrt{2m(E - V)}/\hbar$. Die Lösungen $e^{\pm ikx}$ bzw. $\cos kx$, $\sin kx$ schwingen. Je größer die kinetische Energie $E - V$, desto größer $k$ und desto kürzer die Wellenlänge $\lambda = 2\pi/k$.
- **Verbotener Bereich, $E < V$:** $\psi'' = +\kappa^2\psi$ mit $\kappa = \sqrt{2m(V - E)}/\hbar$. Die Lösungen $e^{\pm\kappa x}$ wachsen oder fallen exponentiell und schwingen nicht.

„Verboten“ heißt klassisch: Die kinetische Energie $E - V$ wäre negativ. Quantenmechanisch ist $\psi$ dort nicht null, sondern klingt auf der [[lex:eindringtiefe|Eindringtiefe]] $1/\kappa$ ab. Reicht der verbotene Bereich bis $x \to \infty$, bleibt nur $e^{-\kappa x}$; $e^{+\kappa x}$ wäre nicht normierbar. Die Herleitung prüft, dass $e^{-\kappa x}$ die Gleichung mit derselben Energie $E$ löst.

**Ein $E$ für alle Bereiche.** Das ist der wichtigste Punkt dieses Abschnitts. Die stationäre Schrödingergleichung $\hat H\psi = E\psi$ gilt überall mit derselben Zahl $E$. Von Bereich zu Bereich ändern sich nur $V$ und damit die *kinetische* Energie $E - V$. Die kinetische Energie siehst du an der Wellenlänge, nicht an der Amplitude. Die Amplitude sagt, wie wahrscheinlich das Teilchen dort anzutreffen ist.

**Krümmung als Faustregel.** Für reelles $\psi$ sagt die Gleichung, wohin die Kurve gekrümmt ist. Im erlaubten Bereich hat $\psi''$ das entgegengesetzte Vorzeichen wie $\psi$: Die Kurve biegt sich zur Achse hin und schwingt. Im verbotenen Bereich hat $\psi''$ dasselbe Vorzeichen wie $\psi$: Die Kurve biegt sich von der Achse weg. Damit kannst du Wellenfunktionen skizzieren, bevor du rechnest. Für stehende Wellen in einem langsam veränderlichen $V$ gilt außerdem: Die Amplitude ist dort größer, wo $E - V$ klein ist, denn dort wäre ein klassisches Teilchen langsam und hielte sich länger auf. Das ist eine Aussage über die Aufenthaltswahrscheinlichkeit, nicht über die Energie.

Ein Zahlenbeispiel: Für ein Elektron mit $V - E = 1\,\mathrm{eV}$ ist $\kappa \approx 5\,\mathrm{nm}^{-1}$, die Eindringtiefe also etwa $0{,}2\,\mathrm{nm}$ – ein bis zwei Atomabstände.`,
      fig:{lab:'barrier', init:{a:4, e:0.6, show:'re'}, caption:'$\\mathrm{Re}\\,\\psi$, aufgetragen auf der Energielinie: Links schwingt $\\psi$; in der Barriere ($E < V$) fällt es ab, ohne zu schwingen; rechts schwingt es wieder – mit derselben Wellenlänge wie links, aber kleinerer Amplitude.'},
      derive:{ctx:{coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['0.15 V_0', '0.85 V_0']}}, defs:{κ:'sqrt(2m (V_0 - E))/ħ'}}, lines:[
        {l:'-ħ^2/(2m) d^2/dx^2 e^(-κ x) + V_0 e^(-κ x) = (V_0 - ħ^2 κ^2/(2m)) e^(-κ x)', w:'zweimal ableiten: (−κ)² = κ²',
          why:{q:'Warum steht in der Klammer $-\\hbar^2\\kappa^2/2m$?', opts:['$\\frac{d^2}{dx^2}e^{-\\kappa x} = +\\kappa^2e^{-\\kappa x}$, und davor steht $-\\hbar^2/2m$', '$\\frac{d^2}{dx^2}e^{-\\kappa x} = -\\kappa^2e^{-\\kappa x}$, wie bei einer Welle', 'Das Minuszeichen kommt aus dem Potential $V_0$.'], a:0, ex:'$(-\\kappa)^2 = \\kappa^2 > 0$. Bei einer Welle $e^{ikx}$ wäre es $(ik)^2 = -k^2$ – daher der Unterschied zwischen Schwingen und Abklingen.'}},
        {l:'= E e^(-κ x)', w:'κ² = 2m(V₀ − E)/ħ²',
          why:{q:'Was zeigt diese Zeile?', opts:['$e^{-\\kappa x}$ löst die Gleichung zur selben Energie $E$, obwohl $E < V_0$.', 'Im verbotenen Bereich ist die Energie des Teilchens $V_0$.', 'Im verbotenen Bereich ist die Energie des Teilchens negativ.'], a:0, ex:'$V_0 - \\hbar^2\\kappa^2/2m = V_0 - (V_0 - E) = E$. Negativ ist nur die kinetische Energie $E - V_0$ im klassischen Sinn.'}}
      ]},
      q:[
        {q:'Eine Elektronenwelle läuft aus einem Bereich mit $V = 0$ in einen Bereich mit $V = V_1$, wobei $0 < V_1 < E$. Wie ändert sich die Wellenlänge?', opts:['Sie wird größer, weil $E - V$ kleiner wird.', 'Sie wird kleiner, weil das Potential höher ist.', 'Sie bleibt gleich, weil $E$ gleich bleibt.'], a:0,
          ex:'$\\lambda = 2\\pi\\hbar/\\sqrt{2m(E - V)}$ hängt von der kinetischen Energie ab. $E$ bleibt gleich, $E - V$ wird kleiner, also wird $\\lambda$ größer.'},
        {q:'Wie ist ein reelles $\\psi$ im verbotenen Bereich gekrümmt?', opts:['von der Achse weg: $\\psi\'\'$ hat dasselbe Vorzeichen wie $\\psi$', 'zur Achse hin: $\\psi\'\'$ hat das entgegengesetzte Vorzeichen', 'gar nicht: im verbotenen Bereich ist $\\psi$ eine Gerade'], a:0,
          ex:'$\\psi\'\' = \\kappa^2\\psi$ mit $\\kappa^2 > 0$. Deshalb schwingt $\\psi$ dort nicht.'}
      ]},
    {id:'tunnel-t2', title:'Anschlussbedingungen',
      text:R`Die Lösungen der einzelnen Bereiche müssen an den Grenzen zusammenpassen. Welche Bedingungen gelten dort? Du gewinnst sie aus der Schrödingergleichung selbst. Integriere $\psi'' = \frac{2m}{\hbar^2}(V - E)\psi$ über ein kleines Intervall um die Sprungstelle $x_0$:

$$\psi'(x_0 + \varepsilon) - \psi'(x_0 - \varepsilon) = \frac{2m}{\hbar^2}\int_{x_0 - \varepsilon}^{x_0 + \varepsilon}(V - E)\,\psi\,dx.$$

Ist $V$ endlich, ist der Integrand beschränkt, und das Integral geht für $\varepsilon \to 0$ gegen null. Also ist **$\psi'$ stetig**. Dann ist $\psi$ erst recht stetig, denn ein Sprung in $\psi$ würde ein unendliches $\psi'$ bedeuten. Das sind die [[lex:anschluss|Anschlussbedingungen]]:

$$\psi(x_0^-) = \psi(x_0^+),\qquad \psi'(x_0^-) = \psi'(x_0^+).$$

Nur $\psi''$ springt, zusammen mit $V$. Zwei Ausnahmen: An einer unendlich hohen Wand (Thema 3) ist das Integral nicht klein; dort gilt nur $\psi = 0$, und $\psi'$ springt. Beim δ-Potential (Abschnitt 6) liefert das Integral einen endlichen Beitrag, und $\psi'$ springt um einen festen Betrag.

**Abzählen.** An jeder Sprungstelle gibt es zwei Bedingungen. An einer [[lex:potentialstufe|Potentialstufe]] mit einlaufender Welle von links sind $B$ (reflektiert) und $C$ (durchgelassen) unbekannt: zwei Gleichungen, zwei Unbekannte. Die Amplitude der einlaufenden Welle setzt man auf 1. Rechts gibt es keine von rechts einlaufende Welle, weil dort keine Quelle ist.

**Die Stufe mit $E < V_0$.** Für $x < 0$ ist $\psi_L = e^{ikx} + Be^{-ikx}$, für $x > 0$ ist $\psi_R = Ce^{-\kappa x}$. Die Herleitung ergibt

$$B = \frac{k - i\kappa}{k + i\kappa},\qquad |B| = 1.$$

Alles wird reflektiert. Trotzdem ist $\psi_R \ne 0$: Das Teilchen dringt in die Stufe ein. Die reflektierte Welle ist gegenüber der einlaufenden phasenverschoben, denn $B$ ist komplex. Wie groß die Phase ist, hängt von $\kappa/k$ ab.

**Typische Fehlvorstellung:** „Im verbotenen Bereich ist das Teilchen nie.“ Eine Ortsmessung kann es dort finden, mit kleiner Wahrscheinlichkeit. Nach dieser Messung ist seine Energie nicht mehr scharf; die Messung selbst überträgt Energie. Deshalb widerspricht das nicht dem Energiesatz.`,
      derive:{ctx:{coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['0.15 V_0', '0.85 V_0']}}, defs:{k:'sqrt(2m E)/ħ', κ:'sqrt(2m (V_0 - E))/ħ'}, unknowns:{B:{ref:'(k - iκ)/(k + iκ)', kind:'complex'}, C:{ref:'2k/(k + iκ)', kind:'complex'}}}, lines:[
        {l:'1 + B = C', w:'ψ stetig bei x = 0',
          why:{q:'Woher kommt diese Gleichung?', opts:['aus $\\psi_L(0) = \\psi_R(0)$; alle Exponentialfunktionen sind bei $x = 0$ gleich 1', 'aus $|\\psi_L|^2 = |\\psi_R|^2$, weil die Wahrscheinlichkeit erhalten ist', 'aus der Normierung: $B$ und $C$ müssen sich zu 1 ergänzen'], a:0, ex:'Stetig ist $\\psi$ selbst, nicht $|\\psi|^2$ allein. Bei $x = 0$ wird $e^{ikx}$, $e^{-ikx}$ und $e^{-\\kappa x}$ jeweils 1.'}},
        {l:'ik (1 - B) = -κ C', w:'ψ′ stetig bei x = 0',
          why:{q:'Warum steht rechts $-\\kappa C$?', opts:['$\\frac{d}{dx}Ce^{-\\kappa x} = -\\kappa C e^{-\\kappa x}$, bei $x = 0$ also $-\\kappa C$', 'weil im verbotenen Bereich die kinetische Energie negativ ist', 'weil $\\psi\'$ an der Stufe sein Vorzeichen wechseln muss'], a:0, ex:'Ableiten bringt den Faktor $-\\kappa$. Links bringt $e^{-ikx}$ den Faktor $-ik$, daher $ik(1 - B)$.'}},
        {l:'ik (1 - B) = -κ (1 + B)', w:'C eingesetzt'},
        {l:'B (κ - ik) = -κ - ik', w:'nach B sortiert'},
        {l:'B = (k - iκ)/(k + iκ)', w:'geteilt, Zähler und Nenner mit i multipliziert',
          why:{q:'Wie wird aus $B = \\frac{-\\kappa - ik}{\\kappa - ik}$ diese Form?', opts:['Zähler und Nenner mit $i$ multiplizieren', 'Zähler und Nenner komplex konjugieren', 'mit dem konjugierten Nenner erweitern'], a:0, ex:'$i(-\\kappa - ik) = k - i\\kappa$ und $i(\\kappa - ik) = k + i\\kappa$.'}},
        {l:'|B| = 1', w:'Zähler und Nenner zueinander konjugiert',
          why:{q:'Was bedeutet $|B| = 1$?', opts:['Totalreflexion: $R = |B|^2 = 1$', 'Rechts der Stufe ist $\\psi = 0$', 'Die Welle kommt ohne Phasenverschiebung zurück'], a:0, ex:'Alles läuft zurück, aber $\\psi_R = Ce^{-\\kappa x} \\ne 0$, und $B$ hat eine Phase.'}}
      ]},
      q:[
        {q:'An einer Stufe springt $V$ von $0$ auf ein endliches $V_0$. Was gilt bei $x = 0$?', opts:['$\\psi$ und $\\psi\'$ sind stetig, $\\psi\'\'$ springt.', '$\\psi$ ist stetig, $\\psi\'$ springt.', '$\\psi$ ist null, weil das Potential springt.'], a:0,
          ex:'$\\psi\'\' = \\frac{2m}{\\hbar^2}(V - E)\\psi$ springt mit $V$. Einmal integriert, bleibt $\\psi\'$ stetig; $\\psi = 0$ gilt nur an unendlich hohen Wänden.'}
      ]},
    {id:'tunnel-t3', title:'Stromdichte: Was heißen Reflexion und Transmission?',
      text:R`Eine ebene Welle ist nicht normierbar (Thema 4). Deshalb deutet man bei der Streuung nicht $|C|^2$ als Wahrscheinlichkeit, sondern vergleicht Teilchen**ströme**. Die [[lex:stromdichte|Wahrscheinlichkeitsstromdichte]] aus Thema 2 ist

$$j = \frac{\hbar}{m}\,\mathrm{Im}\left(\psi^*\psi'\right).$$

Für $\psi = Ae^{ikx}$ ist $j = \frac{\hbar k}{m}|A|^2$: Dichte $|A|^2$ mal Geschwindigkeit $\hbar k/m$. Wie viele Teilchen pro Zeit durchkommen, hängt also auch davon ab, wie schnell sie sind.

**$j$ ist überall gleich.** In einem stationären Zustand ist $|\psi|^2$ zeitunabhängig. Die [[lex:kontinuitaet|Kontinuitätsgleichung]] $\partial_t|\psi|^2 + \partial_xj = 0$ verlangt dann $\partial_xj = 0$: Was links ankommt, muss rechts weiterfließen.

**Links: einlaufend minus reflektiert.** Die Herleitung setzt $\psi_L = e^{ikx} + Be^{-ikx}$ ein. Die Mischterme fallen weg, und es bleibt

$$j_L = \frac{\hbar k}{m}\left(1 - |B|^2\right).$$

Rechts ist mit $\psi_R = Ce^{iqx}$ und $q = \sqrt{2m(E - V_0)}/\hbar$ der Strom $j_R = \frac{\hbar q}{m}|C|^2$. Aus $j_L = j_R$ folgt

$$R + T = 1\qquad\text{mit}\qquad R = |B|^2,\quad T = \frac{q}{k}|C|^2.$$

Das sind die [[lex:reflexion-transmission|Reflexions- und Transmissionswahrscheinlichkeit]]. Mit diesen Wahrscheinlichkeiten wird ein einzelnes Teilchen reflektiert oder durchgelassen.

**Warum $q/k$?** Rechts sind die Teilchen langsamer ($q < k$). Bei gleichem Strom drängen sie sich dichter: $|C|^2$ kann größer als 1 sein, ohne dass mehr Teilchen durchkommen. An der Stufe mit $E > V_0$ ist zum Beispiel $C = 2k/(k + q) > 1$.

**Verbotener Bereich.** Für $\psi_R = Ce^{-\kappa x}$ ist $\psi_R^*\psi_R' = -\kappa|C|^2e^{-2\kappa x}$ reell, also $j_R = 0$. Hinter einer unendlich breiten Stufe fließt kein Strom; daher ist $|B| = 1$. Erst eine *endlich* breite Barriere lässt Strom durch: Dort tragen $e^{-\kappa x}$ und $e^{+\kappa x}$ gemeinsam einen Strom, wenn ihre Koeffizienten eine Phase gegeneinander haben (Abschnitt 4).

**Typischer Fehler:** $T = |C|^2$. Dann wäre $|B|^2 + |C|^2 = 1$ – das gilt an der Stufe nicht. Kontrolliere immer $R + T = 1$.`,
      derive:{ctx:{coords:['x'], params:{m:'pos', k:'pos', 'b_1':'real', 'b_2':'real'}, defs:{B:'b_1 + i b_2', 'ψ_L(x)':'e^(i k x) + B e^(-i k x)'}}, lines:[
        {l:'ħ/m Im(ψ_L(x)^* d/dx ψ_L(x)) = ħ/m Im((e^(-ikx) + B^* e^(ikx)) (ik e^(ikx) - ik B e^(-ikx)))', w:'ψ_L* und ψ_L′ eingesetzt',
          why:{q:'Woher kommt $B^*e^{ikx}$ im ersten Faktor?', opts:['vom Konjugieren: $(Be^{-ikx})^* = B^*e^{ikx}$', 'vom Ableiten der reflektierten Welle $Be^{-ikx}$', 'Das ist die einlaufende Welle $e^{ikx}$.'], a:0, ex:'Konjugieren dreht das Vorzeichen von $i$ im Exponenten und konjugiert den Koeffizienten.'}},
        {l:'= ħ/m Im(ik - ik |B|^2 + ik (B^* e^(2ikx) - B e^(-2ikx)))', w:'ausmultipliziert'},
        {l:'= ħ k/m (1 - |B|^2)', w:'Mischterm ist reell',
          why:{q:'Warum fällt der Mischterm $ik(B^*e^{2ikx} - Be^{-2ikx})$ weg?', opts:['$B^*e^{2ikx} - Be^{-2ikx}$ ist rein imaginär, mal $ik$ also reell.', 'Er mittelt sich über $x$ weg; die Zeile gilt nur im Mittel.', 'Er ist klein, weil $|B| < 1$ ist, und wird weggelassen.'], a:0, ex:'Mit $w = Be^{-2ikx}$ ist $w^* - w = -2i\\,\\mathrm{Im}\\,w$ rein imaginär. Die Zeile gilt exakt, für jedes $x$.'}}
      ]},
      q:[
        {q:'An einer Stufe mit $E > V_0$ ist $C = 1{,}2$. Kommen dann mehr Teilchen durch, als einlaufen?', opts:['Nein: Rechts sind sie langsamer und dichter; $T = \\frac qk|C|^2 < 1$.', 'Ja: $|C|^2 = 1{,}44 > 1$ heißt, dass die Welle verstärkt wird.', 'Das kann nicht sein: Eine Amplitude $C > 1$ ist verboten.'], a:0,
          ex:'Gezählt werden Teilchen pro Zeit, also Ströme. Die Dichte $|C|^2$ darf größer als 1 sein.'}
      ]},
    {id:'tunnel-t4', title:'Rechteckbarriere und Tunneleffekt',
      text:R`Jetzt ist der verbotene Bereich endlich: $V = V_0$ für $0 < x < a$, sonst $V = 0$, und $E < V_0$. Der Ansatz hat drei Teile:

$$\psi = \begin{cases} e^{ikx} + Be^{-ikx}, & x < 0,\\ Ce^{-\kappa x} + De^{\kappa x}, & 0 < x < a,\\ Fe^{ikx}, & x > a.\end{cases}$$

In der Barriere darfst du $e^{+\kappa x}$ nicht streichen, denn der Bereich ist endlich. Vier Unbekannte ($B, C, D, F$), vier Anschlussbedingungen (je zwei bei $x = 0$ und $x = a$). Die Rechnung ist länger, aber nicht schwieriger als an der Stufe. Sie liefert

$$T = |F|^2 = \left[1 + \frac{V_0^2\sinh^2(\kappa a)}{4E(V_0 - E)}\right]^{-1}.$$

Hier ist $T = |F|^2$ ohne Faktor, weil links und rechts dasselbe $k$ gilt. $T$ ist für jede endliche Breite größer als null: Das Teilchen **tunnelt**. Das ist der [[lex:tunneleffekt|Tunneleffekt]].

**Dicke Barrieren.** Ist $\kappa a \gg 1$, dann ist $\sinh(\kappa a) \approx e^{\kappa a}/2$, und die Eins in der Klammer ist vernachlässigbar. Die Herleitung führt das aus:

$$T \approx 16\,\frac{E}{V_0}\left(1 - \frac{E}{V_0}\right)e^{-2\kappa a}.$$

Entscheidend ist der Exponentialfaktor. Er hängt von Breite, Höhe und Masse ab: $\kappa a = a\sqrt{2m(V_0 - E)}/\hbar$. Für ein Elektron mit $V_0 - E = 1\,\mathrm{eV}$ und $a = 1\,\mathrm{nm}$ ist $e^{-2\kappa a} \approx 4\cdot10^{-5}$. Für ein Proton ist $\kappa$ etwa 43-mal so groß, und $e^{-2\kappa a}$ ist praktisch null.

**Das Wellenbild.** Links überlagern sich einlaufende und reflektierte Welle. In der Barriere schwingt $\psi$ nicht; $|\psi|$ nimmt im Wesentlichen exponentiell ab. Rechts läuft eine Welle mit **derselben Wellenlänge** wie links, aber mit der kleinen Amplitude $|F| = \sqrt T$. Das Teilchen verliert beim Tunneln keine Energie. Es ist nur unwahrscheinlich, dass es durchkommt.

**Über der Barriere.** Für $E > V_0$ wird aus $\kappa$ die reelle Wellenzahl $q$ und aus $\sinh$ ein $\sin$. Dann ist $T < 1$; nur bei $qa = n\pi$ ist $T = 1$. An diesen Resonanzen löschen sich die Reflexionen an beiden Kanten aus. Klassisch wäre $T = 1$ für alle $E > V_0$ und $T = 0$ für $E < V_0$.`,
      fig:{lab:'barrier', init:{a:3, e:0.5, view:'both'}, caption:'Oben: $V(x)$, die Energie $E$ (gestrichelt) und $\\psi$ auf der Energielinie (dünn $\\mathrm{Re}\\,\\psi$, dick $|\\psi|^2$). Unten: $T(E)$. Vergrößere die Breite: $T$ fällt exponentiell, die Wellenlänge rechts bleibt gleich. Oberhalb von $V_0$ gibt es Resonanzen mit $T = 1$.'},
      derive:{ctx:{coords:[], params:{m:'pos', V_0:'pos', a:'pos', E:{range:['0.15 V_0', '0.85 V_0']}}, defs:{κ:'sqrt(2m (V_0 - E))/ħ'}}, lines:[
        {l:'V_0^2 sinh(κa)^2/(4E(V_0 - E)) = V_0^2 (e^(κa) - e^(-κa))^2/(16 E (V_0 - E))', w:'sinh u = (eᵘ − e⁻ᵘ)/2',
          why:{q:'Woher kommt der Faktor 16 im Nenner?', opts:['aus $\\sinh^2 u = (e^u - e^{-u})^2/4$ zusammen mit der 4', 'aus $V_0^2$ mit $V_0 = 4E$', 'aus der Normierung der einlaufenden Welle'], a:0, ex:'$4\\cdot 4 = 16$. Die Zeile ist noch exakt.'}},
        {l:'≈ V_0^2 e^(2κa)/(16 E (V_0 - E))', w:'κa ≫ 1: e^{−κa} vernachlässigt',
          why:{q:'Warum darf man $e^{-\\kappa a}$ weglassen?', opts:['Für $\\kappa a \\gg 1$ ist $e^{-\\kappa a} \\ll e^{\\kappa a}$.', 'Weil $e^{-\\kappa a}$ negativ ist.', 'Weil die Barriere dünn ist.'], a:0, ex:'Schon bei $\\kappa a = 3$ ist $e^{-\\kappa a}/e^{\\kappa a} = e^{-6} \\approx 0{,}0025$.'}},
        {l:'T ≈ 16 E (V_0 - E)/V_0^2 e^(-2κa)', w:'der Bruch ist ≫ 1, die Eins entfällt; Kehrwert',
          why:{q:'Welcher Faktor bestimmt $T$ hauptsächlich?', opts:['$e^{-2\\kappa a}$', 'der Vorfaktor $16E(V_0 - E)/V_0^2$', 'beide gleich stark'], a:0, ex:'Der Vorfaktor liegt zwischen 0 und 4; $e^{-2\\kappa a}$ ändert sich über viele Zehnerpotenzen.'}}
      ]},
      q:[
        {q:'Bei $\\kappa a = 5$ wird die Barriere doppelt so breit. Um welchen Faktor ändert sich $T$ ungefähr?', opts:['um $e^{-10} \\approx 4{,}5\\cdot10^{-5}$', 'um den Faktor $1/2$', 'um $e^{-5} \\approx 7\\cdot10^{-3}$'], a:0,
          ex:'$e^{-2\\kappa a}$ wird zu $e^{-4\\kappa a}$: Es kommt noch einmal $e^{-2\\kappa a} = e^{-10}$ dazu.'},
        {q:'Ein Elektron hat die Barriere durchtunnelt. Wie verhält sich seine Wellenlänge rechts zu der links?', opts:['gleich, weil links und rechts $V = 0$ und $E$ gleich ist', 'größer, weil es in der Barriere Energie verloren hat', 'kleiner, weil es von der Barriere beschleunigt wurde'], a:0,
          ex:'Kleiner ist nur die Amplitude. Die Energie – und damit $k$ – ist dieselbe (McKagan, Perkins & Wieman 2008).'}
      ]},
    {id:'tunnel-t5', title:'Der endliche Potentialtopf',
      text:R`Kehre das Vorzeichen um: ein Topf $V = -V_0$ für $|x| < a$, außen $V = 0$. Für $-V_0 < E < 0$ ist das Innere erlaubt und das Äußere verboten. Das ist ein realistischeres Modell als der unendliche Kasten, etwa für ein Elektron in einer dünnen Halbleiterschicht (Quantentopf).

**Ansatz.** Innen schwingt $\psi$ mit $l = \sqrt{2m(E + V_0)}/\hbar$, außen klingt es mit $\kappa = \sqrt{-2mE}/\hbar$ ab. Weil $V$ symmetrisch ist, kannst du gerade und ungerade Lösungen getrennt suchen. Für die geraden ist

$$\psi = A\cos(lx)\ \ (|x| < a),\qquad \psi = Fe^{-\kappa|x|}\ \ (|x| > a).$$

Die Anschlussbedingungen bei $x = a$ ergeben in der Herleitung $l\tan(la) = \kappa$; bei $x = -a$ folgt dasselbe aus der Symmetrie. Für ungerade Lösungen ($\sin lx$) entsteht $-l\cot(la) = \kappa$.

**Warum ist $E$ jetzt quantisiert?** $l$ und $\kappa$ hängen beide von $E$ ab. Die Bedingung $l\tan(la) = \kappa$ ist eine Gleichung für $E$ und hat nur einzelne Lösungen. Physikalisch: Nur bei bestimmten Energien passt eine Schwingung innen glatt an eine abklingende Lösung außen. Bei allen anderen Energien müsste außen ein Anteil $e^{+\kappa|x|}$ dazukommen – nicht normierbar.

**Grafisch lösen.** Mit $z = la$ und $z_0 = a\sqrt{2mV_0}/\hbar$ gilt $(la)^2 + (\kappa a)^2 = z_0^2$, und die Bedingung wird

$$\tan z = \sqrt{(z_0/z)^2 - 1}.$$

Zeichne beide Seiten über $z$; die Schnittpunkte sind die Energien. Die rechte Seite fällt von $\infty$ (bei $z \to 0$) auf $0$ (bei $z = z_0$). Der erste Ast von $\tan z$ steigt von $0$ an. Deshalb gibt es immer mindestens einen Schnittpunkt: Jeder endliche Topf in einer Dimension hat einen gebundenen Zustand, so flach er auch ist. Insgesamt gibt es $N = \lceil 2z_0/\pi\rceil$ gebundene Zustände, gerade und ungerade abwechselnd.

**Vergleich mit dem unendlichen Kasten.** Die Wellenfunktion ragt in die Wände hinein. Sie hat effektiv mehr Platz, eine größere Wellenlänge und deshalb weniger kinetische Energie. Die Energien, vom Topfboden aus gemessen, liegen tiefer als im unendlichen Kasten der Breite $2a$. Für $z_0 \to \infty$ nähern sie sich diesen Werten von unten. Zusammengefasst im Lexikon: [[lex:endlicher-topf|endlicher Potentialtopf]].`,
      derive:{ctx:{coords:['x'], params:{a:'pos', A:'pos', m:'pos', l:{range:['0.2/a', '1.3/a']}}, defs:{κ:'l tan(l a)', F:'A cos(l a) e^(κ a)'}}, lines:[
        {l:'A cos(l a) = F e^(-κ a)', w:'ψ stetig bei x = a',
          why:{q:'Welche Bedingung steckt in dieser Zeile?', opts:['$\\psi$ innen und außen sind bei $x = a$ gleich.', '$\\psi$ ist bei $x = a$ gleich null, wie an einer Wand.', 'Die Normierung von $\\psi$ über den Topf.'], a:0, ex:'Die Wand ist endlich hoch: $\\psi(a) \\ne 0$, die Funktion ragt hinaus.'}},
        {l:'-l A sin(l a) = -κ F e^(-κ a)', w:'ψ′ stetig bei x = a'},
        {l:'l tan(l a) = κ', w:'zweite Gleichung durch die erste geteilt',
          why:{q:'Warum teilt man die beiden Gleichungen durcheinander?', opts:['$A$ und $F$ fallen heraus; übrig bleibt eine Gleichung nur für $E$.', 'um $\\kappa$ unabhängig von $E$ zu machen', 'weil eine der beiden Gleichungen überflüssig ist'], a:0, ex:'$l$ und $\\kappa$ hängen beide von $E$ ab. Die Gleichung bestimmt die erlaubten Energien; $F/A$ folgt danach aus der ersten Zeile.'}}
      ]},
      q:[
        {q:'Ein endlicher Topf und ein unendlicher Kasten haben dieselbe Breite. Wo liegt die Grundzustandsenergie im endlichen Topf (vom Topfboden gemessen)?', opts:['tiefer, weil $\\psi$ in die Wände eindringt', 'höher, weil die Wände nur endlich hoch sind', 'genauso hoch, weil die Breite gleich ist'], a:0,
          ex:'Mehr Platz heißt größere Wellenlänge und weniger kinetische Energie.'},
        {q:'Ein sehr flacher, schmaler Topf hat $z_0 = 0{,}3$. Wie viele gebundene Zustände hat er?', opts:['genau einen', 'keinen, dafür ist er zu flach', 'zwei: einen geraden, einen ungeraden'], a:0,
          ex:'$N = \\lceil 2z_0/\\pi\\rceil = \\lceil 0{,}19\\rceil = 1$. In einer Dimension gibt es immer mindestens einen gebundenen Zustand.'}
      ]},
    {id:'tunnel-t6', title:'Das δ-Potential',
      text:R`Mach den Topf immer schmaler und tiefer, so dass die Fläche $2aV_0 = \alpha$ fest bleibt. Im Grenzfall entsteht das [[lex:delta-potential|δ-Potential]]

$$V(x) = -\alpha\,\delta(x),\qquad \alpha > 0.$$

Es ist ein einfaches Modell für eine sehr kurzreichweitige Anziehung, etwa eine Störstelle in einem Kristall. Überall außer bei $x = 0$ ist das Teilchen frei.

**Sprungbedingung.** Integriere die Schrödingergleichung wie in Abschnitt 2 über $[-\varepsilon, \varepsilon]$. Jetzt verschwindet das Potentialintegral nicht, denn $\int\delta(x)\psi(x)\,dx = \psi(0)$ ([[lex:delta-distribution|δ-Distribution]], M2). Es bleibt

$$\psi'(0^+) - \psi'(0^-) = -\frac{2m\alpha}{\hbar^2}\,\psi(0).$$

$\psi$ bleibt stetig, aber $\psi'$ springt: $\psi$ hat bei $x = 0$ einen Knick.

**Der gebundene Zustand.** Für $E < 0$ ist überall außer bei $x = 0$ verbotenes Gebiet. Normierbar sind nur $e^{\kappa x}$ links und $e^{-\kappa x}$ rechts, mit $\kappa = \sqrt{-2mE}/\hbar$. Stetigkeit verlangt gleiche Amplituden: $\psi = Ae^{-\kappa|x|}$. Die Sprungbedingung legt $\kappa$ fest (Herleitung):

$$\kappa = \frac{m\alpha}{\hbar^2},\qquad E = -\frac{\hbar^2\kappa^2}{2m} = -\frac{m\alpha^2}{2\hbar^2}.$$

Es gibt **genau einen** gebundenen Zustand. Ein ungerader Zustand hätte $\psi(0) = 0$, und mit $\pm Ae^{-\kappa|x|}$ geht das nur für $A = 0$.

**Streuung am δ-Potential.** Für $E > 0$ setzt du an wie an der Stufe: $\psi_L = e^{ikx} + Be^{-ikx}$, $\psi_R = Ce^{ikx}$. Mit $\beta = m\alpha/(\hbar^2k)$ folgt aus Stetigkeit und Sprungbedingung $C = 1/(1 - i\beta)$ und

$$T = |C|^2 = \frac{1}{1 + \beta^2} = \left(1 + \frac{m\alpha^2}{2\hbar^2E}\right)^{-1}.$$

Schnelle Teilchen ($\beta$ klein) gehen fast ungestört durch, langsame werden fast vollständig reflektiert – obwohl das Potential anziehend ist. Reflexion ist eine Welleneigenschaft. Sie entsteht an jeder plötzlichen Änderung des Potentials, egal in welche Richtung.

**Typischer Fehler:** $\psi'$ auch hier als stetig ansetzen. Dann folgt $\kappa = 0$, und es gäbe keinen gebundenen Zustand.`,
      derive:{ctx:TUN_DELTA(), lines:[
        {l:'-κ A - κ A = -2m α/ħ^2 A', w:'ψ′(0⁺) − ψ′(0⁻) = −(2mα/ħ²) ψ(0)',
          why:{q:'Warum ist $\\psi\'(0^-) = +\\kappa A$?', opts:['Links ist $\\psi = Ae^{\\kappa x}$ mit der Ableitung $\\kappa Ae^{\\kappa x}$.', 'Weil $\\psi\'$ bei $x = 0$ stetig sein muss.', 'Weil $|x|$ bei $x = 0$ die Ableitung $1$ hat.'], a:0, ex:'Für $x < 0$ ist $|x| = -x$, also $\\psi = Ae^{\\kappa x}$. Rechts fällt $\\psi$ ab: $\\psi\'(0^+) = -\\kappa A$.'}},
        {l:'κ = m α/ħ^2', w:'durch −2A geteilt'},
        {l:'E = -ħ^2 κ^2/(2m)', w:'für x ≠ 0 frei: ψ″ = κ²ψ',
          why:{q:'Woher kommt diese Beziehung?', opts:['Für $x \\ne 0$ ist $-\\frac{\\hbar^2}{2m}\\psi\'\' = E\\psi$ mit $\\psi\'\' = \\kappa^2\\psi$.', 'aus der Normierung $\\int|\\psi|^2dx = 1$', 'aus $E = \\langle V\\rangle = -\\alpha|\\psi(0)|^2$'], a:0, ex:'Außerhalb von $x = 0$ ist $V = 0$. Die Normierung legt nur $A$ fest, nicht $E$.'}},
        {l:'E = -m α^2/(2ħ^2)', w:'κ eingesetzt'}
      ]},
      q:[
        {q:'Welche Form hat $\\psi$ des gebundenen Zustands bei $x = 0$?', opts:['stetig, mit einem Knick (Spitze)', 'glatt, mit waagerechter Tangente', 'unstetig, mit einem Sprung'], a:0,
          ex:'$\\psi$ ist stetig, $\\psi\'$ springt von $+\\kappa A$ auf $-\\kappa A$.'},
        {q:'Wie verändert sich $T$ für die Streuung am δ-Potential, wenn die Energie wächst?', opts:['$T$ wächst und geht gegen 1.', '$T$ fällt, weil das Potential anzieht.', '$T$ ist für alle Energien gleich 1.'], a:0,
          ex:'$T = (1 + m\\alpha^2/(2\\hbar^2E))^{-1} \\to 1$ für $E \\to \\infty$.'}
      ]},
    {id:'tunnel-t7', title:'Anwendungen: Rastertunnelmikroskop und α-Zerfall',
      text:R`**Rastertunnelmikroskop.** Eine feine Metallspitze wird bis auf etwa $0{,}5$ bis $1\,\mathrm{nm}$ an eine leitende Oberfläche herangeführt. Das Vakuum dazwischen ist für die Elektronen eine Barriere. Ihre Höhe über der Energie der Elektronen ist ungefähr die Austrittsarbeit, einige eV. Legt man eine kleine Spannung an, fließt ein Tunnelstrom proportional zu $e^{-2\kappa d}$, wobei $d$ der Abstand ist. Mit $V_0 - E \approx 4\,\mathrm{eV}$ ist $\kappa \approx 10\,\mathrm{nm}^{-1}$. Wird der Abstand um $0{,}1\,\mathrm{nm}$ größer, fällt der Strom um den Faktor $e^{-2} \approx 0{,}14$, also auf etwa ein Siebtel.

Diese Empfindlichkeit macht atomare Auflösung möglich. Man fährt die Spitze über die Probe und regelt ihre Höhe so, dass der Strom konstant bleibt. Die Regelung zeichnet dann ein Höhenprofil, fein genug, um einzelne Atome zu sehen. Fast der ganze Strom fließt über das vorderste Atom der Spitze, weil schon das nächste Atom merklich weiter entfernt ist. Gerd Binnig und Heinrich Rohrer erhielten für das [[lex:rastertunnelmikroskop|Rastertunnelmikroskop]] 1986 den Nobelpreis.

**α-Zerfall.** Ein α-Teilchen (zwei Protonen, zwei Neutronen) ist im Kern durch die starke Kraft gebunden; außerhalb stößt die Coulomb-Kraft es ab. Zusammen entsteht eine Barriere, die viel höher ist als die Energie, mit der das α-Teilchen später davonfliegt. Klassisch käme es nie heraus. George Gamow und unabhängig Ronald Gurney und Edward Condon erklärten 1928 den Zerfall als Tunneln durch diese Barriere. Die Barriere ist nicht rechteckig; man ersetzt $e^{-2\kappa a}$ durch

$$T \approx \exp\left(-\frac{2}{\hbar}\int_{x_1}^{x_2}\sqrt{2m\,(V(x) - E)}\,dx\right),$$

ein Integral über den klassisch verbotenen Bereich. Diese WKB-Näherung gilt, wenn sich $V$ langsam ändert. Weil die Energie im Exponenten steht, hängen die Halbwertszeiten extrem empfindlich von $E$ ab: Polonium-212 ($E_\alpha \approx 8{,}8\,\mathrm{MeV}$) zerfällt in weniger als einer Mikrosekunde, Uran-238 ($E_\alpha \approx 4{,}3\,\mathrm{MeV}$) hat eine Halbwertszeit von $4{,}5$ Milliarden Jahren. Ein Faktor 2 in der Energie macht über 20 Zehnerpotenzen in der Zeit. Mehr dazu unter [[lex:alpha-zerfall|α-Zerfall]].

**Was du mitnehmen sollst:** Steht eine Größe wie $\kappa a$ im Exponenten, reagiert das Ergebnis exponentiell empfindlich auf Breite, Höhe und Masse. Die Herleitung zeigt, warum beim Rastertunnelmikroskop nur die Abstandsänderung zählt.`,
      derive:{ctx:{coords:[], params:{κ:'pos', d:'pos', b:'pos'}}, lines:[
        {l:'e^(-2κ (d + b))/e^(-2κ d) = e^(-2κ b)', w:'Abstand wächst von d auf d + b',
          why:{q:'Warum fällt der Ausgangsabstand $d$ heraus?', opts:['Das Verhältnis zweier Exponentialfunktionen hängt nur von $b$ ab.', 'Weil $d$ gegen die Verschiebung $b$ vernachlässigbar klein ist.', 'Weil der Vorfaktor von $T$ den Abstand $d$ schon enthält.'], a:0, ex:'$e^{u + v}/e^u = e^v$. Deshalb ändert jede Verschiebung um $b$ den Strom um denselben Faktor $e^{-2\\kappa b}$.'}}
      ]},
      q:[
        {q:'Die Spitze eines Rastertunnelmikroskops fährt über ein Atom, das $0{,}1\\,\\mathrm{nm}$ höher liegt ($\\kappa \\approx 10\\,\\mathrm{nm}^{-1}$). Wie ändert sich der Strom ohne Regelung?', opts:['Er steigt etwa auf das 7-Fache.', 'Er steigt um etwa 10 %.', 'Er bleibt nahezu gleich.'], a:0,
          ex:'Der Abstand wird um $0{,}1\\,\\mathrm{nm}$ kleiner: Faktor $e^{2\\kappa\\cdot0{,}1\\,\\mathrm{nm}} = e^2 \\approx 7{,}4$.'},
        {q:'Was ist der Hauptgrund dafür, dass die α-Halbwertszeiten so stark von der Energie abhängen?', opts:['$E$ steht im Exponenten der Tunnelwahrscheinlichkeit.', 'Schnellere α-Teilchen stoßen öfter an die Barriere.', 'Höhere Energie verringert die Ladung des Kerns.'], a:0,
          ex:'Die Anlaufrate an die Barriere wächst zwar auch mit der Geschwindigkeit, aber nur proportional. Der Exponentialfaktor ändert sich um viele Zehnerpotenzen.'}
      ]}
  ],
  example:{
    title:'Stufe mit $E > V_0$: Amplitude der reflektierten Welle',
    text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0$, und $E > V_0$. Links läuft eine Welle ein und wird teilweise reflektiert: $\\psi_L = e^{ikx} + B\\,e^{-ikx}$. Rechts läuft nur eine Welle nach rechts: $\\psi_R = C\\,e^{iqx}$. Dabei ist $k = \\sqrt{2mE}/\\hbar$ und $q = \\sqrt{2m(E - V_0)}/\\hbar$. Bestimme $B$.',
    ctx:TUN_UP(),
    lines:[
      {l:'ψ_L(0) = ψ_R(0)', why:{q:'Warum muss $\\psi$ bei $x = 0$ stetig sein?', opts:['Ein Sprung in $\\psi$ machte $\\psi\'$ unendlich; das erlaubt die Gleichung bei endlichem $V$ nicht.', 'Weil $\\psi$ an jeder Potentialstufe null sein muss, wie an einer Wand.', 'Weil links und rechts dasselbe $E$ gilt, also dieselbe Funktion.'], a:0, ex:'Bei endlichem Potentialsprung sind $\\psi$ und $\\psi\'$ stetig. Nur bei unendlich hohen Wänden oder $\\delta$-Potentialen ändert sich das.'}},
      {l:'1 + B = C', why:{q:'Was wurde eingesetzt?', opts:['$x = 0$, also $e^0 = 1$ in allen Termen', '$k = q$, weil die Energie gleich ist', 'die Normierung $\\int|\\psi|^2dx = 1$'], a:0, ex:'Bei $x = 0$ werden alle Exponentialfunktionen zu 1.'}},
      {l:'ik (1 - B) = iq C', w:'ψ\' stetig', why:{q:'Woher kommt das Minuszeichen vor $B$?', opts:['Die Ableitung von $e^{-ikx}$ bringt $-ik$.', 'Die reflektierte Welle hat negative Energie.', 'Das ist eine Konvention für reflektierte Wellen.'], a:0, ex:'$\\psi_L\' = ik\\,e^{ikx} - ikB\\,e^{-ikx}$, bei $x = 0$ also $ik(1 - B)$.'}},
      {l:'k (1 - B) = q (1 + B)', why:{q:'Wie entsteht diese Zeile?', opts:['$C = 1 + B$ einsetzen und durch $i$ teilen', 'beide Gleichungen addieren', 'beide Gleichungen quadrieren'], a:0, ex:'Zwei Gleichungen, zwei Unbekannte: $C$ eliminieren.'}},
      {l:'B = (k - q)/(k + q)', why:{q:'Was bedeutet $B \\ne 0$?', opts:['Auch bei $E > V_0$ wird ein Teil reflektiert – klassisch unmöglich.', 'Das Teilchen wird an der Stufe vollständig reflektiert.', 'Ein Teil der Teilchen verliert an der Stufe Energie.'], a:0, ex:'Die Reflexionswahrscheinlichkeit ist $|B|^2 = \\left(\\frac{k-q}{k+q}\\right)^2 > 0$. Sie verschwindet nur für $q = k$, also $V_0 = 0$.'}}
    ],
    faded:{id:'tunnel-fade', title:'Jetzt du: die durchgelassene Amplitude $C$', text:'Gleiche Stufe wie im Beispiel. Bestimme $C$.',
      ctx:TUN_UP(),
      given:['1 + B = C', 'ik (1 - B) = iq C'],
      goals:[{id:'a', prompt:'Bestimme $C$.', type:'solve', unknown:'C',
        hints:['Gesucht ist $C$; dafür muss $B$ aus den beiden Gleichungen verschwinden.', 'Aus der ersten Gleichung folgt $B = C - 1$.', 'Setze ein: $k(2 - C) = qC$.'],
        model:['1 + B = C', 'ik (1 - B) = iq C', {l:'k (2 - C) = q C', gap:'k (▢) = q C'}, '2k = (k + q) C', 'C = 2k/(k + q)']}]}
  },
  puzzle:{
    title:'Ein sehr tiefer Abgrund',
    text:'Ein langsames Teilchen läuft von links auf eine scharfe Stufe **nach unten**: Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = -V_0$. Die Stufe ist sehr tief, $V_0 \\gg E$. Klassisch fällt das Teilchen hinunter und wird schneller.\n\nWie groß ist die Reflexionswahrscheinlichkeit $R$? Benutze das Ergebnis für die Stufe nach oben, mit $q = \\sqrt{2m(E + V_0)}/\\hbar$.',
    q:{q:'Deine Vermutung:', opts:['$R \\to 0$: Ein Abgrund hält nichts auf.', '$R \\to 1$: Fast alles wird reflektiert.', '$R \\approx 1/2$: Die Hälfte kehrt um.', '$R$ hängt nicht von $V_0$ ab.'], a:1, ex:'$R = \\left(\\frac{q - k}{q + k}\\right)^2 \\to 1$ für $q \\gg k$.'},
    reveal:'Die Anschlussrechnung ist dieselbe wie bei der Stufe nach oben und liefert $B = \\frac{k - q}{k + q}$. Für $V_0 \\gg E$ ist $q \\gg k$, also\n\n$$R = \\left(\\frac{q - k}{q + k}\\right)^2 \\approx 1 - 4\\frac kq \\approx 1 - 4\\sqrt{\\frac{E}{V_0}} \\;\\to\\; 1.$$\n\nZahlenbeispiel: Für $E = 1\\,\\mathrm{meV}$ und $V_0 = 1\\,\\mathrm{eV}$ ist $R \\approx 0{,}88$. Fast alle Teilchen kehren an der Kante um, obwohl es dahinter nur „bergab“ geht.\n\nWarum? Reflexion entsteht dort, wo sich die Wellenzahl sprunghaft ändert, und die Richtung des Sprungs spielt keine Rolle: $R$ ist symmetrisch in $k$ und $q$. Ein sehr großer Sprung reflektiert fast vollständig, wie Licht an einem Übergang zwischen sehr verschiedenen Brechzahlen.\n\nZwei Einschränkungen: Die Rechnung setzt eine **scharfe** Stufe voraus, die sich auf einer Strecke viel kürzer als die Wellenlänge ändert. Bei einem sanften Abhang ist die Reflexion viel kleiner. Und je langsamer das Teilchen, desto stärker der Effekt. Man spricht von Quantenreflexion; beobachtet wurde sie mit sehr langsamen Atomen vor Oberflächen.'
  },
  clarify:{
    core:'Bei stückweise konstantem Potential löst man die stationäre Schrödingergleichung in jedem Bereich. Wo $E > V$, gibt es Wellen $e^{\\pm ikx}$ mit $k = \\sqrt{2m(E-V)}/\\hbar$. Wo $E < V$, gibt es $e^{\\pm\\kappa x}$ mit $\\kappa = \\sqrt{2m(V - E)}/\\hbar$.\n\nAn den Sprungstellen sind **$\\psi$ und $\\psi\'$ stetig**. Reflexion und Transmission gibt man über Stromdichten an:\n\n$$R = \\frac{|j_{ref}|}{j_{ein}},\\qquad T = \\frac{j_{trans}}{j_{ein}},\\qquad R + T = 1.$$\n\nFür eine Welle $Ae^{ikx}$ ist $j = \\frac{\\hbar k}{m}|A|^2$; deshalb steht in $T$ der Faktor $q/k$. Die Energie ist in allen Bereichen dieselbe: Wer durch eine Barriere tunnelt, verliert keine Energie.',
    keys:[
      'Im verbotenen Bereich wird nur die abklingende Lösung $e^{-\\kappa x}$ behalten; $e^{+\\kappa x}$ wäre nicht normierbar.',
      'Die Eindringtiefe ist $1/\\kappa$ (für $\\psi$) bzw. $1/(2\\kappa)$ (für $|\\psi|^2$).',
      'Rechteckbarriere der Breite $a$ mit $E < V_0$: $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1}$; für $\\kappa a \\gg 1$ ist $T \\approx 16\\frac{E}{V_0}\\left(1 - \\frac{E}{V_0}\\right)e^{-2\\kappa a}$.',
      '$\\delta$-Potential $V = -\\alpha\\,\\delta(x)$: $\\psi$ stetig, aber $\\psi\'$ springt: $\\psi\'(0^+) - \\psi\'(0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$. Es gibt genau einen gebundenen Zustand mit $E = -\\frac{m\\alpha^2}{2\\hbar^2}$.',
      'Im endlichen Topf gibt es immer mindestens einen gebundenen Zustand; die Energien liegen tiefer als im unendlichen Topf gleicher Breite, weil die Wellenfunktion in die Wände eindringt.'
    ],
    errors:[
      '$T = |C|^2$ statt $T = \\frac qk|C|^2$: Die Wahrscheinlichkeitsströme hängen von der Geschwindigkeit ab.',
      'Vorzeichen beim Ableiten der reflektierten Welle $Be^{-ikx}$ vergessen.',
      'Im verbotenen Bereich $e^{+\\kappa x}$ mitnehmen, obwohl der Bereich bis $x\\to\\infty$ reicht.',
      'Beim $\\delta$-Potential $\\psi\'$ als stetig ansetzen – dann gäbe es keinen gebundenen Zustand.',
      '„Das Teilchen ist nie in der Barriere“: Die Aufenthaltswahrscheinlichkeit dort ist klein, aber nicht null.',
      '„Beim Tunneln geht Energie verloren“: Hinter der Barriere sind Wellenlänge und Energie dieselben; kleiner ist nur die Amplitude.'
    ],
    more:[{title:'Woher kommt die Sprungbedingung beim δ-Potential?', text:'Integriere $-\\frac{\\hbar^2}{2m}\\psi\'\' - \\alpha\\delta(x)\\psi = E\\psi$ von $-\\varepsilon$ bis $\\varepsilon$ und lass $\\varepsilon\\to 0$ gehen. Die rechte Seite verschwindet, links bleibt $-\\frac{\\hbar^2}{2m}[\\psi\'(\\varepsilon) - \\psi\'(-\\varepsilon)] - \\alpha\\psi(0) = 0$.'}],
    checks:[
      {q:'An einer Stufe mit $E > V_0$ ist $B = 0{,}2$ und $C = 1{,}2$. Ist $|B|^2 + |C|^2 = 1$ zu erwarten?', opts:['Nein. Erhalten ist $|B|^2 + \\frac qk|C|^2 = 1$.', 'Ja, Wahrscheinlichkeiten addieren sich immer zu 1.', 'Nur wenn $V_0 = 0$.'], a:0, ex:'$C$ ist eine Amplitude, und $|C|^2$ ist das Verhältnis der Dichten von durchgelassener und einlaufender Welle – keine Wahrscheinlichkeit. Erhalten ist der Wahrscheinlichkeitsstrom.'},
      {q:'Eine Barriere wird bei gleicher Energie doppelt so breit ($\\kappa a \\gg 1$). Wie ändert sich $T$ ungefähr?', opts:['um den Faktor $e^{-2\\kappa a}$ kleiner', 'etwa um den Faktor $1/2$ kleiner', 'etwa um den Faktor $1/4$ kleiner'], a:0, ex:'$T \\propto e^{-2\\kappa a}$. Aus $a$ wird $2a$, also kommt noch einmal $e^{-2\\kappa a}$ dazu – exponentiell, nicht linear.'}
    ]
  },
  lab:{type:'barrier', title:'Transmission durch eine Rechteckbarriere',
    text:'Oben siehst du $V(x)$, die Energie $E$ (gestrichelt) und die Wellenfunktion, auf der Energielinie aufgetragen (dünn: $\\mathrm{Re}\\,\\psi$, dick: $|\\psi|^2$). Unten zeigt die Kurve die Transmission $T$ als Funktion von $E/V_0$; der Punkt ist die gewählte Energie. Unterhalb von $E = V_0$ tunnelt das Teilchen, oberhalb läuft es „über“ die Barriere. Mit „Zeit laufen lassen“ siehst du, wie sich die Phase von $\\psi$ dreht.',
    predict:{q:'Bevor du die Regler bewegst: Wie verläuft $T(E)$ in der Nähe von $E = V_0$?', opts:['stetig: schon unter $V_0$ ist $T > 0$, über $V_0$ noch $T < 1$', 'mit einem Sprung von $T = 0$ auf $T = 1$ genau bei $E = V_0$', 'mit einem scharfen Maximum $T = 1$ genau bei $E = V_0$'], a:0,
      ex:'Klassisch gäbe es den Sprung. Quantenmechanisch tunnelt das Teilchen unterhalb von $V_0$ und wird oberhalb teilweise reflektiert; $T$ steigt stetig an.'},
    questions:[
      {q:'Stelle $E/V_0 = 0{,}5$ ein und vergrößere die Breite. Was passiert mit $T$?', opts:['$T$ fällt sehr schnell, etwa exponentiell.', '$T$ fällt linear mit der Breite.', '$T$ bleibt gleich.'], a:0, ex:'Für breite Barrieren gilt $T \\propto e^{-2\\kappa a}$. Deshalb ist Tunneln für Elektronen nur bei sehr dünnen Barrieren merklich: Bei $V_0 - E = 1\\,\\mathrm{eV}$ ist $e^{-2\\kappa a}$ für $a = 1\\,\\mathrm{nm}$ schon etwa $4\\cdot 10^{-5}$.'},
      {q:'Stelle $E/V_0 = 0{,}5$ und eine Breite um $2$ ein. Vergleiche $\\mathrm{Re}\\,\\psi$ links und rechts der Barriere. Was fällt auf?', opts:['gleiche Wellenlänge, rechts kleinere Amplitude', 'rechts längere Wellenlänge, gleiche Amplitude', 'rechts längere Wellenlänge und kleinere Amplitude'], a:0, ex:'Gleiche Energie und gleiches $V$ heißt gleiches $k$. Die kleinere Amplitude zeigt nur, dass wenige Teilchen durchkommen. Wer eine längere Wellenlänge erwartet, denkt an einen Energieverlust beim Tunneln (McKagan, Perkins & Wieman 2008).'},
      {q:'Schau dir $E > V_0$ an. Ist dort immer $T = 1$?', opts:['Nein, $T < 1$ außer bei Resonanzen, wo $T = 1$ erreicht wird.', 'Ja, über der Barriere wird nichts reflektiert.', 'Nein, dort ist $T = 0$, weil die Barriere stört.'], a:0, ex:'Auch über der Barriere wird an den Kanten reflektiert. Bei $qa = n\\pi$ löschen sich die Reflexionen der beiden Kanten aus: Resonanz.'}
    ],
    noPic:{q:'Ohne Bild: Ein Proton und ein Elektron mit gleicher Energie treffen auf dieselbe Barriere ($E < V_0$). Wer tunnelt besser?', opts:['das Elektron', 'das Proton', 'beide gleich'], a:0, ex:'$\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$ wächst mit der Masse. Das Proton ist rund 1836-mal schwerer, $\\kappa$ also etwa 43-mal größer – $e^{-2\\kappa a}$ wird winzig.'}},
  compare:{
    text:'An der Stufe mit $E < V_0$ ist $B = \\frac{k - i\\kappa}{k + i\\kappa}$. Gezeigt werden soll $|B| = 1$ (Totalreflexion). Zwei richtige Wege:',
    ctx:TUN_DOWN(),
    A:{name:'Ausrechnen mit $B^*B$', model:['|B|^2 = B^* B', '= (k + iκ)/(k - iκ) · (k - iκ)/(k + iκ)', '= 1']},
    B:{name:'Beträge von Zähler und Nenner', text:'Zähler und Nenner sind zueinander komplex konjugiert.', model:['|k - iκ| = sqrt(k^2 + κ^2)', '|k + iκ| = sqrt(k^2 + κ^2)', '|B| = |k - iκ|/|k + iκ|', '= 1']},
    questions:[
      {q:'Was zeigt $|B| = 1$ physikalisch?', opts:['Alles wird reflektiert; rechts fließt kein Strom.', 'Rechts der Stufe ist $\\psi$ überall null.', 'Die Welle kommt unverändert zurück, ohne Phasenverschiebung.'], a:0, ex:'Rechts ist $\\psi \\ne 0$ (Eindringen), aber $C\\,e^{-\\kappa x}$ hat eine reelle Ortsabhängigkeit und trägt keinen Strom. Die Phase von $B$ ist dabei nicht null: Die reflektierte Welle ist phasenverschoben.'},
      {q:'Welcher Weg verallgemeinert sich auf $z = w/w^*$ mit beliebigem komplexem $w$?', opts:['Weg B: $|w^*| = |w|$, also $|z| = 1$', 'Weg A: Ausmultiplizieren klappt immer', 'keiner: Man braucht $w$ konkret'], a:0, ex:'Weg B braucht nur $|w^*| = |w|$ – das ist kürzer und gilt allgemein.'}
    ]
  },
  practice:[
    {id:'tunnel-p1', title:'Potentialstufe mit $E > V_0$',
      text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0 < E$. Ansatz: $\\psi_L = e^{ikx} + Be^{-ikx}$, $\\psi_R = Ce^{iqx}$ mit $k = \\sqrt{2mE}/\\hbar$, $q = \\sqrt{2m(E-V_0)}/\\hbar$. Die Größen $k$ und $q$ kannst du direkt benutzen.',
      ctx:TUN_UP(),
      goals:[
        {id:'a', prompt:'a) Stelle die Anschlussbedingungen auf und bestimme $B$.', type:'solve', unknown:'B', points:3, ph:'ψ_L(0) = ψ_R(0)',
          hints:['Gesucht ist $B$. Zwei Bedingungen bei $x = 0$ geben zwei Gleichungen für $B$ und $C$.', '$\\psi$ stetig: $1 + B = C$. $\\psi\'$ stetig: $ik(1 - B) = iqC$.', 'Setze $C = 1 + B$ in die zweite Gleichung ein und löse nach $B$ auf.'],
          model:[{l:'ψ_L(0) = ψ_R(0)', w:'ψ stetig'}, '1 + B = C', {l:'ψ_L\'(0) = ψ_R\'(0)', w:'ψ\' stetig'}, 'ik (1 - B) = iq C', 'k (1 - B) = q (1 + B)', 'B = (k - q)/(k + q)'],
          mistakes:[{expr:'(k + q)/(k - q)', msg:'Zähler und Nenner sind vertauscht: Für $V_0 \\to 0$ muss $B \\to 0$ gehen.'}]},
        {id:'b', prompt:'b) Berechne die Transmissionswahrscheinlichkeit $\\frac qk|C|^2$ mit $C = \\frac{2k}{k+q}$.', type:'value', target:'4k q/(k + q)^2', points:2, allowUnknowns:false,
          hints:['$T$ vergleicht Teilchenströme, nicht Dichten.', 'Der Faktor $q/k$ ist das Verhältnis der Geschwindigkeiten; setze $C = 2k/(k + q)$ ein.'],
          model:['q/k |C|^2 = q/k (2k/(k + q))^2', '= 4k q/(k + q)^2']},
        {id:'c', prompt:'c) Zeige, dass $|B|^2 + \\frac qk|C|^2 = 1$ ist.', type:'value', target:'1', points:2,
          hints:['Setze $|B|^2$ aus a) und $\\frac qk|C|^2$ aus b) ein.', 'Bringe beide Brüche auf den Nenner $(k+q)^2$.', '$(k - q)^2 + 4kq = (k + q)^2$'],
          model:['|B|^2 + q/k |C|^2 = (k - q)^2/(k + q)^2 + 4k q/(k + q)^2', '= (k^2 + 2k q + q^2)/(k + q)^2', '= 1']}
      ]},
    {id:'tunnel-p2', title:'Stufe mit $E < V_0$: Eindringen',
      text:'Jetzt ist $E < V_0$. Rechts klingt die Welle ab: $\\psi_R = Ce^{-\\kappa x}$ mit $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$; links wie bisher $\\psi_L = e^{ikx} + Be^{-ikx}$.',
      ctx:TUN_DOWN(),
      goals:[
        {id:'a', prompt:'a) Bestimme $C$.', type:'solve', unknown:'C', points:3, ph:'1 + B = C',
          hints:['Wie in Aufgabe 1, nur rechts $Ce^{-\\kappa x}$: zwei Anschlussbedingungen bei $x = 0$.', '$\\psi_R\'(0) = -\\kappa C$.', 'Aus $1 + B = C$ und $ik(1 - B) = -\\kappa C$ folgt $ik(2 - C) = -\\kappa C$.'],
          model:['1 + B = C', {l:'ik (1 - B) = -κ C', w:'ψ\' stetig'}, 'ik (2 - C) = -κ C', '2ik = (ik - κ) C', 'C = 2ik/(ik - κ)', 'C = 2k/(k + iκ)']},
        {id:'b', prompt:'b) In welcher Tiefe $d$ ist die Aufenthaltsdichte $|\\psi|^2$ auf $1/e$ ihres Werts bei $x = 0$ gefallen?', type:'solve', unknown:'d', points:2,
          hints:['Gesucht ist die Tiefe, in der $|\\psi|^2$ um den Faktor $e$ kleiner ist als bei $x = 0$.', '$|\\psi_R|^2 = |C|^2e^{-2\\kappa x}$; setze $e^{-2\\kappa d} = e^{-1}$.'],
          model:['e^(-2κ d) = e^(-1)', '2κ d = 1', 'd = 1/(2κ)'], note:'Für ein Elektron mit $V_0 - E = 1\\,\\mathrm{eV}$ ist $1/\\kappa \\approx 0{,}2\\,\\mathrm{nm}$.'}
      ]},
    {id:'tunnel-p3', title:'Gebundener Zustand im δ-Potential',
      text:'$V(x) = -\\alpha\\,\\delta(x)$ mit $\\alpha > 0$. Für einen gebundenen Zustand ($E < 0$) setzt man $\\psi(x) = A\\,e^{-\\kappa|x|}$ mit $\\kappa > 0$ an. Sprungbedingung: $\\psi\'(0^+) - \\psi\'(0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(0)$.',
      ctx:TUN_DELTA(),
      goals:[
        {id:'a', prompt:'a) Bestimme $\\kappa$ aus der Sprungbedingung.', type:'solve', unknown:'κ', points:3,
          hints:['Die Sprungbedingung ist die einzige Gleichung, die $\\kappa$ festlegt.', '$\\psi\'(0^+) = -\\kappa A$, $\\psi\'(0^-) = +\\kappa A$, $\\psi(0) = A$.'],
          model:[{l:'-κ A - κ A = -2m α/ħ^2 A', w:'ψ\'(0⁺) − ψ\'(0⁻)'}, '2κ = 2m α/ħ^2', 'κ = m α/ħ^2'],
          mistakes:[{expr:'-m α/ħ^2', msg:'Vorzeichen prüfen: $\\psi\'(0^+) = -\\kappa A$, weil $\\psi$ nach rechts abfällt. Außerdem muss $\\kappa > 0$ sein.'}]},
        {id:'b', prompt:'b) Bestimme die Energie $E$.', type:'solve', unknown:'E', points:2,
          hints:['Außerhalb von $x = 0$ ist das Teilchen frei; dort gilt die Schrödingergleichung mit $V = 0$.', 'Für $x \\ne 0$: $-\\frac{\\hbar^2}{2m}\\psi\'\' = E\\psi$ mit $\\psi\'\' = \\kappa^2\\psi$.'],
          model:['-ħ^2/(2m) κ^2 = E', 'E = -ħ^2/(2m) (m α/ħ^2)^2', 'E = -m α^2/(2ħ^2)']},
        {id:'c', prompt:'c) Normiere: Bestimme $A > 0$.', type:'solve', unknown:'A', points:2,
          hints:['Normierung: $\\int|\\psi|^2dx = 1$ ansetzen.', '$\\int_{-\\infty}^\\infty e^{-2\\kappa|x|}dx = 2\\int_0^\\infty e^{-2\\kappa x}dx = 1/\\kappa$.'],
          model:['∫_-∞^∞ |ψ|^2 dx = 1', '|A|^2/κ = 1', 'A = sqrt(κ)', 'A = sqrt(m α)/ħ']}
      ]},
    {id:'tunnel-p4', title:'Rechteckbarriere bei halber Barrierenhöhe',
      text:'Für eine Rechteckbarriere der Höhe $V_0$ und Breite $a$ mit $E < V_0$ gilt $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0 - E)}\\right]^{-1}$ mit $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$. Hier ist $E = V_0/2$. Die Größe $\\kappa$ kannst du direkt benutzen.',
      ctx:{coords:[], params:{m:'pos', V_0:'pos', a:'pos'}, defs:{E:'V_0/2', κ:'sqrt(2m (V_0 - E))/ħ'}},
      goals:[{id:'a', prompt:'Vereinfache $T$ so weit wie möglich.', type:'value', target:'1/cosh(κ a)^2', points:3, ph:'T = 1/(1 + V_0^2 sinh(κa)^2/(4E(V_0 - E)))',
        hints:['Setze $E = V_0/2$ ein und vereinfache den Bruch.', '$4E(V_0 - E) = V_0^2$ bei $E = V_0/2$.', '$1 + \\sinh^2u = \\cosh^2u$.'],
        model:['T = 1/(1 + V_0^2 sinh(κa)^2/(4E(V_0 - E)))', '= 1/(1 + V_0^2 sinh(κa)^2/(4 · V_0/2 · V_0/2))', '= 1/(1 + sinh(κa)^2)', '= 1/cosh(κa)^2'],
        note:'Für $\\kappa a = 3$ ist $T \\approx 0{,}0099$; die Näherung $4e^{-2\\kappa a}$ liefert $0{,}0099$ – schon sehr gut.'}]},
    {id:'tunnel-p5', title:'Halbdurchlässige Barriere',
      text:'Wie in Aufgabe 4 ist $E = V_0/2$ und damit $T = 1/\\cosh^2(\\kappa a)$. Wie breit muss die Barriere sein, damit genau die Hälfte durchgeht?',
      ctx:{coords:[], params:{m:'pos', V_0:'pos'}, defs:{E:'V_0/2', κ:'sqrt(2m (V_0 - E))/ħ'}, unknowns:{a:{ref:'ln(1 + sqrt(2))/κ'}}},
      goals:[{id:'a', prompt:'Bestimme $a$.', type:'solve', unknown:'a', points:3,
        hints:['Setze $T = 1/\\cosh^2(\\kappa a) = 1/2$ und löse nach $a$ auf.', '$\\cosh^2(\\kappa a) = 2$, also $\\cosh(\\kappa a) = \\sqrt2$.', '$\\operatorname{arcosh}y = \\ln(y + \\sqrt{y^2 - 1})$'],
        model:['1/cosh(κa)^2 = 1/2', 'cosh(κa) = sqrt(2)', 'κa = ln(sqrt(2) + 1)', 'a = ln(1 + sqrt(2))/κ']}]},
    {id:'tunnel-p6', title:'Stromdichte einer ebenen Welle',
      text:'Für $\\psi(x) = C\\,e^{iqx}$ mit reellem $C > 0$ ist die Wahrscheinlichkeitsstromdichte $j = \\frac{\\hbar}{2mi}\\left(\\psi^*\\psi\' - \\psi\\,\\psi^{*\\prime}\\right)$.',
      ctx:{coords:['x'], params:{m:'pos', q:'pos', C:'pos'}, defs:{'ψ(x)':'C e^(i q x)'}},
      goals:[{id:'a', prompt:'Berechne $j$.', type:'value', target:'ħ q C^2/m', points:2, ph:'j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')',
        hints:['Setze $\\psi$ und $\\psi^*$ in die Formel ein und leite ab.', '$\\psi\' = iq\\psi$ und $(\\psi^*)\' = -iq\\psi^*$; $|\\psi|^2 = C^2$.'],
        model:['j = ħ/(2m i) (ψ^* ψ\' - ψ (ψ^*)\')', '= ħ/(2m i) (i q C^2 + i q C^2)', '= ħ q C^2/m'],
        note:'$\\hbar q/m$ ist die Geschwindigkeit, $C^2$ die Dichte: $j = \\rho v$. Daher der Faktor $q/k$ in $T$.'}]},
    {id:'tunnel-s1', synth:true, title:'Synthese: ein Teilchen im δ-Potential',
      text:'Der gebundene Zustand im Potential $V = -\\alpha\\,\\delta(x)$ ist $\\psi(x) = \\sqrt\\kappa\\,e^{-\\kappa|x|}$ mit $\\kappa = m\\alpha/\\hbar^2$ und $E = -\\hbar^2\\kappa^2/2m$ (Aufgabe 3). Diese Aufgabe verbindet Thema 1 (Wahrscheinlichkeit, Unschärfe), Thema 2 (stationäre Zustände), Thema 4 (Impulsraum) und dieses Thema. $\\psi$, $\\varphi$ und $\\kappa$ kannst du direkt benutzen.',
      ctx:TUN_SYN(),
      goals:[
        {id:'a', prompt:'a) Mit welcher Wahrscheinlichkeit findet eine Ortsmessung das Teilchen im Bereich $|x| < 1/\\kappa$? (Thema 1)', type:'value', target:'1 - e^(-2)', points:2,
          hints:['Integriere $|\\psi|^2$ über das Intervall $[-1/\\kappa, 1/\\kappa]$.', '$|\\psi|^2 = \\kappa e^{-2\\kappa|x|}$ ist gerade: $2\\kappa\\int_0^{1/\\kappa}e^{-2\\kappa x}dx$.', 'Die Stammfunktion ist $-e^{-2\\kappa x}/(2\\kappa)$.'],
          model:['P = ∫_(-1/κ)^(1/κ) |ψ(x)|^2 dx', '= 2κ ∫_0^(1/κ) e^(-2κ x) dx', '= 1 - e^(-2)'],
          note:'Etwa $86\\,\\%$. Übrigens ist der ganze Bereich $x \\ne 0$ klassisch verboten ($E < 0 = V$): Das Teilchen hält sich fast nur dort auf.'},
        {id:'b', prompt:'b) Berechne die Impulsraum-Wellenfunktion $\\varphi(k)$. (Thema 4)', type:'value', target:'sqrt(2κ^3/π)/(κ^2 + k^2)', points:3,
          hints:['$\\varphi(k) = \\frac{1}{\\sqrt{2\\pi}}\\int\\psi(x)e^{-ikx}dx$; teile das Integral bei $x = 0$.', '$\\int_0^\\infty e^{-cx}dx = 1/c$ mit $c = \\kappa \\pm ik$.', '$\\frac{1}{\\kappa + ik} + \\frac{1}{\\kappa - ik} = \\frac{2\\kappa}{\\kappa^2 + k^2}$.'],
          model:['φ(k) = 1/sqrt(2π) ∫_-∞^∞ sqrt(κ) e^(-κ |x|) e^(-ikx) dx', '= sqrt(κ/(2π)) (1/(κ + ik) + 1/(κ - ik))', '= sqrt(κ/(2π)) · 2κ/(κ^2 + k^2)', '= sqrt(2κ^3/π)/(κ^2 + k^2)']},
        {id:'c', prompt:'c) Berechne den Erwartungswert der potentiellen Energie, $\\int V|\\psi|^2dx$. (dieses Thema)', type:'value', target:'-ħ^2 κ^2/m', points:2,
          hints:['Das Potential ist eine δ-Funktion: $\\int\\delta(x)f(x)\\,dx = f(0)$.', 'Es bleibt $-\\alpha|\\psi(0)|^2 = -\\alpha\\kappa$; drücke $\\alpha$ durch $\\kappa$ aus.'],
          model:['-α ∫_-∞^∞ δ(x) |ψ(x)|^2 dx = -α |ψ(0)|^2', '= -α κ', '= -ħ^2 κ^2/m']},
        {id:'d', prompt:'d) Im stationären Zustand ist $\\langle H\\rangle = E$ (Thema 2). Berechne damit die mittlere kinetische Energie $E - \\langle V\\rangle$.', type:'value', target:'ħ^2 κ^2/(2m)', points:2,
          hints:['Setze $E = -\\hbar^2\\kappa^2/2m$ und das Ergebnis aus c) ein.', '$-\\frac{\\hbar^2\\kappa^2}{2m} + \\frac{\\hbar^2\\kappa^2}{m}$'],
          model:['-ħ^2 κ^2/(2m) - (-ħ^2 κ^2/m) = ħ^2 κ^2/(2m)'],
          note:'Die kinetische Energie ist positiv, obwohl überall außer bei $x = 0$ $E < V$ gilt. Mit $\\langle p^2\\rangle = 2m\\langle T\\rangle = \\hbar^2\\kappa^2$ folgt $\\Delta p = \\hbar\\kappa$.'},
        {id:'e', prompt:'e) Berechne $\\Delta x$ und daraus $\\Delta x\\,\\Delta p$ mit $\\Delta p = \\hbar\\kappa$ aus d). Vergleiche mit $\\hbar/2$. (Thema 1)', type:'value', target:'ħ/sqrt(2)', points:3,
          hints:['Aus Symmetrie ist $\\langle x\\rangle = 0$, also $\\Delta x = \\sqrt{\\langle x^2\\rangle}$.', '$\\langle x^2\\rangle = 2\\kappa\\int_0^\\infty x^2e^{-2\\kappa x}dx$ und $\\int_0^\\infty x^2e^{-cx}dx = 2/c^3$.', '$\\langle x^2\\rangle = 1/(2\\kappa^2)$.'],
          model:['⟨x^2⟩ = 2κ ∫_0^∞ x^2 e^(-2κ x) dx', '= 1/(2κ^2)', 'Δx = 1/(sqrt(2) κ)', 'Δx · ħ κ = ħ/sqrt(2)'],
          note:'$\\hbar/\\sqrt2 \\approx 0{,}71\\,\\hbar > \\hbar/2$: Die Unschärferelation ist erfüllt, aber nicht minimal – $\\psi$ ist kein Gauß-Paket. Weil der Zustand stationär ist, gelten alle Ergebnisse für alle Zeiten.'}
      ]}
  ],
  concept:[
    {id:'tunnel-k1', type:'mc2', seg:'tunnel-t4', lex:'tunneleffekt',
      q:'Ein Elektron tunnelt durch eine Rechteckbarriere; links und rechts ist $V = 0$. Wie ist die Wellenlänge der durchgelassenen Welle im Vergleich zur einlaufenden?', opts:['gleich', 'größer', 'kleiner'], a:0,
      ex:'$k = \\sqrt{2mE}/\\hbar$ auf beiden Seiten.',
      reason:{q:'Warum?', opts:['$E$ ist in allen Bereichen gleich, und rechts ist $V$ wie links null.', 'Das Elektron verliert in der Barriere Energie; die kleinere Amplitude zeigt das.', 'Das Elektron muss Energie aufnehmen, um die Barriere zu überwinden.'], a:0,
        ex:'Die Vorstellung „Energieverlust beim Tunneln“ ist gut dokumentiert (McKagan, Perkins & Wieman 2008). Die kleinere Amplitude bedeutet eine kleinere Durchlasswahrscheinlichkeit, keine kleinere Energie.'}},
    {id:'tunnel-k2', type:'dialog', seg:'tunnel-t4', keep:true,
      text:'Hinter einer Barriere ist die Amplitude der Welle nur noch ein Hundertstel der einlaufenden.',
      people:[{name:'Lena', says:'Die Amplitude bestimmt, wie viele durchkommen: $T = 10^{-4}$. Jedes durchgekommene Elektron hat die volle Energie.'}, {name:'Jonas', says:'Dann haben die durchgekommenen Elektronen nur noch einen kleinen Teil ihrer ursprünglichen Energie.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'$|F|^2 = T$ ist eine Wahrscheinlichkeit. Die Energie steckt in $k$, und $k$ ist rechts wie links. Amplitude und Energie zu verknüpfen, ist der Kern der Fehlvorstellung (McKagan, Perkins & Wieman 2008).'},
    {id:'tunnel-k3', type:'mc', seg:'tunnel-t1',
      q:'Wie sieht $\\mathrm{Re}\\,\\psi$ innerhalb einer dicken Barriere ($E < V_0$) aus?', opts:['nicht schwingend, im Wesentlichen exponentiell abfallend', 'schwingend, mit kürzerer Wellenlänge als außen', 'schwingend, mit längerer Wellenlänge als außen'], a:0,
      ex:'In der Barriere ist $\\psi = Ce^{-\\kappa x} + De^{\\kappa x}$ – keine Schwingung. Wellenfunktionen qualitativ richtig zu skizzieren, ist eine dokumentierte Lernschwierigkeit (Singh & Marshman 2015).'},
    {id:'tunnel-k4', type:'mc2', seg:'tunnel-t2', lex:'eindringtiefe',
      q:'Ein Teilchen mit $E < V_0$ trifft auf eine Stufe der Höhe $V_0$, die nach rechts unendlich weit reicht. Kann eine Ortsmessung es rechts der Stufe finden?', opts:['Ja, mit kleiner Wahrscheinlichkeit nahe der Stufe', 'Nein, dort wäre die kinetische Energie negativ', 'Nein, denn alles wird reflektiert ($R = 1$)'], a:0,
      ex:'$|\\psi|^2 \\propto e^{-2\\kappa x}$ für $x > 0$.',
      reason:{q:'Warum?', opts:['$\\psi$ ist stetig und fällt rechts wie $e^{-\\kappa x}$ ab, nicht sprunghaft auf null.', '$R = 1$ heißt, dass das Teilchen nie bei $x > 0$ anzutreffen ist.', 'Ein Teilchen kann sich nur dort aufhalten, wo $E > V$ gilt.'], a:0,
        ex:'$R = 1$ sagt, dass am Ende alles zurückläuft, nicht dass $\\psi_R = 0$ ist.'}},
    {id:'tunnel-k5', type:'mc', seg:'tunnel-t5', lex:'endlicher-topf',
      q:'Drei Töpfe haben dieselbe Breite: A ist unendlich tief, B tief, C flach. Ordne die Grundzustandsenergien, jeweils vom Topfboden aus gemessen.', opts:['$E_C < E_B < E_A$', '$E_A < E_B < E_C$', '$E_A = E_B = E_C$'], a:0,
      ex:'Je flacher der Topf, desto weiter dringt $\\psi$ in die Wände ein, desto größer die Wellenlänge und desto kleiner die kinetische Energie.'}
  ],
  final:[
    {aim:0, task:{id:'tunnel-fa1', title:'Reflexion und Transmission an einer Stufe',
      text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0$. Ein Teilchen läuft mit $E = \\tfrac43V_0$ von links ein. Benutze $k = \\sqrt{2mE}/\\hbar$, $q = \\sqrt{2m(E - V_0)}/\\hbar$ und die Amplituden $B$ (reflektiert) und $C$ (durchgelassen).',
      ctx:TUN_STEP('4V_0/3'),
      goals:[
        {id:'a', prompt:'a) Berechne die Reflexionswahrscheinlichkeit $R$.', type:'value', target:'1/9', points:3, model:['q = k/2', '1 + B = C', 'k (1 - B) = q C', 'B = (k - q)/(k + q)', '= 1/3', '|B|^2 = 1/9']},
        {id:'b', prompt:'b) Berechne die Transmissionswahrscheinlichkeit $T$.', type:'value', target:'8/9', points:2, model:['C = 2k/(k + q)', '= 4/3', 'q/k |C|^2 = 1/2 · 16/9', '= 8/9']}
      ]}},
    {aim:1, q:'An einer Stufe mit $E < V_0$ ist $\\psi$ für $x > 0$ nicht null. Welche Begründung ist richtig?', opts:['$\\psi(0) = \\psi\'(0) = 0$ ließe links nur $\\psi \\equiv 0$ zu; $\\psi$ und $\\psi\'$ sind stetig.', 'Das Teilchen leiht sich nach der Energie-Zeit-Unschärfe kurz die fehlende Energie.', 'Rechts der Stufe hat das Teilchen mehr Energie, deshalb kann es dort sein.'], a:0,
      ex:'Wäre $\\psi = 0$ für $x > 0$, dann wäre bei $x = 0$ sowohl $\\psi$ als auch $\\psi\'$ null, und die Schrödingergleichung links hätte nur die Nulllösung. Das Eindringen folgt aus der Gleichung selbst; eine „geliehene Energie“ braucht man nicht.'},
    {aim:2, task:{id:'tunnel-fa3', title:'Stärke eines δ-Potentials',
      text:'Ein Teilchen der Masse $m$ ist im Potential $V(x) = -\\alpha\\,\\delta(x)$ gebunden. Seine Energie ist $-E_b$ mit $E_b > 0$. Setze $\\psi = A\\,e^{-\\kappa|x|}$ an.',
      ctx:{coords:['x'], params:{m:'pos', E_b:'pos', A:'pos'}, defs:{'ψ(x)':'A e^(-κ |x|)'}, unknowns:{κ:{ref:'sqrt(2m E_b)/ħ'}, α:{ref:'ħ sqrt(2E_b/m)'}}},
      goals:[{id:'a', prompt:'Bestimme $\\alpha$.', type:'solve', unknown:'α', points:4,
        model:['-ħ^2 κ^2/(2m) = -E_b', 'κ = sqrt(2m E_b)/ħ', '-κ A - κ A = -2m α/ħ^2 A', 'α = ħ^2 κ/m', 'α = ħ sqrt(2E_b/m)']}]}},
    {aim:'k', type:'mc2', id:'tunnel-fk1',
      q:'Ein Elektron tunnelt durch eine Barriere. Links ist $V = 0$, rechts der Barriere ist $V = -V_1$ (tiefer als links). Wie ist die Wellenlänge rechts im Vergleich zu links?', opts:['kürzer', 'länger', 'gleich'], a:0,
      ex:'Rechts ist die kinetische Energie $E + V_1$ größer als links.',
      reason:{q:'Warum?', opts:['$E$ ist überall gleich, rechts ist aber $E - V$ größer.', 'Beim Tunneln verliert das Elektron Energie, also wird $k$ kleiner.', '$E$ ist überall gleich, also auch die Wellenlänge.'], a:0,
        ex:'Die Wellenlänge hängt von $E - V$ ab, nicht von $E$ allein und nicht vom Tunneln.'}},
    {aim:'k', type:'dialog', id:'tunnel-fk2', keep:true,
      text:'Ein Elektron mit $E < V_0$ trifft auf eine dünne Barriere.',
      people:[{name:'Lena', says:'In der Barriere wäre die kinetische Energie negativ. Deshalb kann eine Ortsmessung das Elektron dort nie finden.'}, {name:'Jonas', says:'Eine Ortsmessung kann es in der Barriere finden, mit kleiner Wahrscheinlichkeit. Danach ist seine Energie nicht mehr scharf.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'$|\\psi|^2 > 0$ in der Barriere. Die Ortsmessung lokalisiert das Elektron und überträgt dabei Energie; das widerspricht keinem Erhaltungssatz.'}
  ],
  finalB:[
    {aim:0, task:{id:'tunnel-fb1', title:'Reflexion und Transmission an einer anderen Stufe',
      text:'Für $x < 0$ ist $V = 0$, für $x > 0$ ist $V = V_0$. Ein Teilchen läuft mit $E = \\tfrac{25}{16}V_0$ von links ein. Benutze $k = \\sqrt{2mE}/\\hbar$, $q = \\sqrt{2m(E - V_0)}/\\hbar$ und die Amplituden $B$ (reflektiert) und $C$ (durchgelassen).',
      ctx:TUN_STEP('25V_0/16'),
      goals:[
        {id:'a', prompt:'a) Berechne die Reflexionswahrscheinlichkeit $R$.', type:'value', target:'1/16', points:3, model:['q = 3k/5', '1 + B = C', 'k (1 - B) = q C', 'B = (k - q)/(k + q)', '= 1/4', '|B|^2 = 1/16']},
        {id:'b', prompt:'b) Berechne die Transmissionswahrscheinlichkeit $T$.', type:'value', target:'15/16', points:2, model:['C = 2k/(k + q)', '= 5/4', 'q/k |C|^2 = 3/5 · 25/16', '= 15/16']}
      ]}},
    {aim:1, q:'An einer unendlich breiten Stufe mit $E < V_0$ wird alles reflektiert, durch eine endlich breite Barriere tunnelt ein Teil. Was macht den Unterschied?', opts:['In der Barriere sind $e^{-\\kappa x}$ und $e^{+\\kappa x}$ erlaubt; zusammen tragen sie Strom.', 'Die endliche Barriere gibt dem Teilchen beim Eindringen die fehlende Energie.', 'An der Stufe ist $\\psi$ für $x > 0$ null, in der Barriere aber nicht.'], a:0,
      ex:'$e^{-\\kappa x}$ allein trägt keinen Strom. Im endlichen Bereich kommt $e^{+\\kappa x}$ dazu; mit einer relativen Phase der Koeffizienten fließt ein Strom, und rechts kann eine laufende Welle anschließen. Auch an der Stufe ist $\\psi_R \\ne 0$.'},
    {aim:2, task:{id:'tunnel-fb3', title:'δ-Potential mit gemessener Aufenthaltsdichte',
      text:'Ein Teilchen der Masse $m$ ist im Potential $V(x) = -\\alpha\\,\\delta(x)$ gebunden. Man findet: Die Aufenthaltswahrscheinlichkeitsdichte $|\\psi|^2$ fällt vom Maximum aus auf der Länge $d$ auf $1/e$ ab. Setze $\\psi = A\\,e^{-\\kappa|x|}$ an.',
      ctx:{coords:['x'], params:{m:'pos', d:'pos', A:'pos'}, defs:{'ψ(x)':'A e^(-κ |x|)'}, unknowns:{κ:{ref:'1/(2d)'}, α:{ref:'ħ^2/(2m d)'}}},
      goals:[{id:'a', prompt:'Bestimme $\\alpha$.', type:'solve', unknown:'α', points:4,
        model:['e^(-2κ d) = e^(-1)', 'κ = 1/(2d)', '-κ A - κ A = -2m α/ħ^2 A', 'α = ħ^2 κ/m', 'α = ħ^2/(2m d)']}]}},
    {aim:'k', type:'mc2', id:'tunnel-gk1',
      q:'Ein Elektron tunnelt durch eine Barriere. Links ist $V = 0$, rechts der Barriere ist $V = V_1$ mit $0 < V_1 < E$. Wie ist die Wellenlänge rechts im Vergleich zu links?', opts:['länger', 'kürzer', 'gleich'], a:0,
      ex:'Rechts ist die kinetische Energie $E - V_1$ kleiner als links.',
      reason:{q:'Warum?', opts:['$E$ ist überall gleich, rechts ist aber $E - V$ kleiner.', 'Beim Tunneln verliert das Elektron Energie.', '$E$ ist überall gleich, also auch die Wellenlänge.'], a:0,
        ex:'Das Ergebnis „länger“ stimmt hier, aber nicht wegen eines Energieverlusts: Es liegt allein an $V_1$. Ohne $V_1$ wäre die Wellenlänge gleich.'}},
    {aim:'k', type:'dialog', id:'tunnel-gk2', keep:true,
      text:'Ein Teilchen mit $E < V_0$ trifft auf eine Stufe der Höhe $V_0$, die nach rechts unendlich weit reicht. Es gilt $R = 1$.',
      people:[{name:'Lena', says:'$R = 1$ heißt, dass am Ende alles zurückläuft; rechts der Stufe fließt kein Strom.'}, {name:'Jonas', says:'Trotzdem kann eine Ortsmessung das Teilchen kurz hinter der Stufe finden, mit kleiner Wahrscheinlichkeit.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:2,
      ex:'Beide Aussagen stimmen zugleich: Rechts ist $\\psi_R = Ce^{-\\kappa x} \\ne 0$, also $|\\psi|^2 > 0$, aber $\\psi_R^*\\psi_R\'$ ist reell und der Strom $j_R = 0$. Deshalb ist $R = 1$.'}
  ],
  errors:[
    {id:'tunnel-e1', title:'Wahrscheinlichkeitserhaltung an der Stufe',
      text:'An der Stufe mit $E > V_0$ ist $B = \\frac{k-q}{k+q}$ und $C = \\frac{2k}{k+q}$. Jemand will zeigen, dass Reflexion und Transmission zusammen 1 ergeben:',
      ctx:TUN_UP(),
      lines:['|B|^2 + |C|^2 = (k - q)^2/(k + q)^2 + 4k^2/(k + q)^2', '= (5k^2 - 2k q + q^2)/(k + q)^2', '= 1'],
      wrong:2,
      why:{q:'Was ist falsch?', opts:['Zeile 3: $|B|^2 + |C|^2 \\ne 1$; erhalten ist $|B|^2 + \\frac qk|C|^2$.', 'Zeile 2 ist falsch ausmultipliziert; im Zähler müsste $(k + q)^2$ stehen.', 'In Zeile 1 müsste $B$ statt $|B|^2$ stehen, weil $B$ reell ist.'], a:0, ex:'$|B|^2 + |C|^2 = 1$ gilt nicht; Zeile 2 ist richtig ausmultipliziert. Erhalten ist der Strom, und die Stromdichte rechts ist $\\frac{\\hbar q}{m}|C|^2$.'},
      fix:{id:'a', prompt:'Rechne richtig: Zeige $|B|^2 + \\frac qk|C|^2 = 1$.', type:'value', target:'1', model:['|B|^2 + q/k |C|^2 = (k - q)^2/(k + q)^2 + 4k q/(k + q)^2', '= (k + q)^2/(k + q)^2', '= 1']}},
    {id:'tunnel-e2', title:'Sprungbedingung beim δ-Potential',
      text:'Für $V = -\\alpha\\delta(x)$ und $\\psi = Ae^{-\\kappa|x|}$ wird gerechnet:',
      ctx:TUN_DELTA(),
      lines:['ψ(x) = A e^(-κ |x|)', 'κ A + κ A = -2m α/ħ^2 A', 'κ = -m α/ħ^2'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Falsche Vorzeichen: $\\psi\'(0^+) = -\\kappa A$ und $\\psi\'(0^-) = +\\kappa A$.', 'Rechts hätte $\\psi(0) = 0$ eingesetzt werden müssen, wie an einer Wand.', 'Der Faktor $2$ vor $m\\alpha$ gehört nicht in die Sprungbedingung.'], a:0, ex:'Rechts fällt $\\psi$ ab (negative Steigung), links steigt es zur Mitte hin an. Mit dem falschen Vorzeichen käme $\\kappa < 0$ heraus – nicht normierbar.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $\\kappa$.', type:'solve', unknown:'κ', model:['-κ A - κ A = -2m α/ħ^2 A', 'κ = m α/ħ^2']}}
  ]
});
})();
lexe('anschluss', 'Anschlussbedingungen', 'An einem endlichen Potentialsprung bei $x_0$: $\\psi(x_0^-) = \\psi(x_0^+)$ und $\\psi\'(x_0^-) = \\psi\'(x_0^+)$. An einer unendlich hohen Wand nur $\\psi = 0$ ($\\psi\'$ springt). Bei $V = -\\alpha\\delta(x - x_0)$: $\\psi$ stetig und $\\psi\'(x_0^+) - \\psi\'(x_0^-) = -\\frac{2m\\alpha}{\\hbar^2}\\psi(x_0)$.', {topic:'tunnel'});
lexe('reflexion-transmission', 'Reflexion und Transmission', 'Verhältnisse der Wahrscheinlichkeitsströme: $R = |j_{ref}|/j_{ein}$, $T = j_{trans}/j_{ein}$, $R + T = 1$. Für $\\psi_L = e^{ikx} + Be^{-ikx}$, $\\psi_R = Ce^{iqx}$: $R = |B|^2$, $T = \\frac qk|C|^2$. Stufe mit $E > V_0$: $R = \\left(\\frac{k-q}{k+q}\\right)^2$, $T = \\frac{4kq}{(k+q)^2}$.', {topic:'tunnel'});
lexe('tunneleffekt', 'Tunneleffekt', 'Ein Teilchen mit $E < V_0$ durchdringt eine Barriere endlicher Breite $a$ mit der Wahrscheinlichkeit $T = \\left[1 + \\frac{V_0^2\\sinh^2(\\kappa a)}{4E(V_0-E)}\\right]^{-1}$, $\\kappa = \\sqrt{2m(V_0-E)}/\\hbar$. Für $\\kappa a \\gg 1$: $T \\approx 16\\frac{E}{V_0}(1 - \\frac{E}{V_0})e^{-2\\kappa a}$. Das durchgelassene Teilchen hat dieselbe Energie wie vorher. Beispiele: Alpha-Zerfall, Rastertunnelmikroskop, Tunneldiode.', {topic:'tunnel'});
lexe('eindringtiefe', 'Eindringtiefe', 'Im klassisch verbotenen Bereich ($E < V$) ist $\\psi \\propto e^{-\\kappa x}$ mit $\\kappa = \\sqrt{2m(V-E)}/\\hbar$. $\\psi$ fällt auf der Länge $1/\\kappa$ auf $1/e$, die Dichte $|\\psi|^2$ auf der Länge $1/(2\\kappa)$.', {topic:'tunnel'});
lexe('delta-potential', 'δ-Potential', '$V(x) = -\\alpha\\delta(x)$, $\\alpha > 0$: genau ein gebundener Zustand $\\psi = \\sqrt\\kappa\\,e^{-\\kappa|x|}$ mit $\\kappa = m\\alpha/\\hbar^2$ und $E = -\\frac{m\\alpha^2}{2\\hbar^2}$. Für Streuzustände ($E > 0$) ist $T = \\left(1 + \\frac{m\\alpha^2}{2\\hbar^2E}\\right)^{-1}$.', {topic:'tunnel'});
lexe('endlicher-topf', 'Endlicher Potentialtopf', '$V = -V_0$ für $|x| < a$, sonst 0. Gebundene Zustände mit $-V_0 < E < 0$: innen Schwingung ($\\cos lx$ oder $\\sin lx$), außen $e^{-\\kappa|x|}$. Die Anschlussbedingungen führen auf transzendente Gleichungen, z. B. $l\\tan(la) = \\kappa$ für gerade Zustände. Es gibt immer mindestens einen gebundenen Zustand, insgesamt $\\lceil 2z_0/\\pi\\rceil$ mit $z_0 = a\\sqrt{2mV_0}/\\hbar$.', {topic:'tunnel'});
lexe('potentialstufe', 'Potentialstufe', '$V = 0$ für $x < 0$, $V = V_0$ für $x > 0$. Für $E > V_0$: teilweise Reflexion mit $R = \\left(\\frac{k-q}{k+q}\\right)^2$, auch wenn das klassisch unmöglich wäre. Für $E < V_0$: Totalreflexion ($|B| = 1$) mit Eindringen $\\psi \\propto e^{-\\kappa x}$ und Phasenverschiebung der reflektierten Welle.', {topic:'tunnel'});
lexe('rastertunnelmikroskop', 'Rastertunnelmikroskop', 'Eine Metallspitze im Abstand $d \\approx 0{,}5$–$1\\,\\mathrm{nm}$ über einer leitenden Probe; der Tunnelstrom ist proportional zu $e^{-2\\kappa d}$ mit $\\kappa \\approx 10\\,\\mathrm{nm}^{-1}$ (Austrittsarbeit einige eV). $0{,}1\\,\\mathrm{nm}$ mehr Abstand senkt den Strom auf etwa ein Siebtel. Regelt man auf konstanten Strom, entsteht ein Höhenprofil mit atomarer Auflösung (Binnig und Rohrer, Nobelpreis 1986).', {topic:'tunnel'});
lexe('alpha-zerfall', 'α-Zerfall', 'Ein α-Teilchen tunnelt durch die Coulomb-Barriere des Kerns (Gamow; Gurney und Condon, 1928). Näherung für glatte Barrieren (WKB): $T \\approx \\exp\\left(-\\frac2\\hbar\\int\\sqrt{2m(V - E)}\\,dx\\right)$ über den verbotenen Bereich. Weil $E$ im Exponenten steht, reichen die Halbwertszeiten von unter einer Mikrosekunde (Po-212) bis zu Milliarden Jahren (U-238).', {topic:'tunnel'});
