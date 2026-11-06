/* ===== Mathe M7: Differentialgleichungen und Randwertprobleme ===== */
(function(){
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
    {id:'md-t1', title:'Was eine Differentialgleichung ist – und warum Linearität zählt',
      text:'Eine **Differentialgleichung** (DGL) verknüpft eine gesuchte Funktion mit ihren Ableitungen. Newtons Gesetz $m\\ddot x = F(x)$ ist eine, die Schwingungsgleichung $\\ddot x = -\\omega^2x$ auch, und ebenso die Schrödingergleichung. Gesucht ist nicht eine Zahl, sondern eine ganze Funktion.\n\nDrei Begriffe ordnen die Vielfalt:\n\n- **Ordnung:** die höchste vorkommende Ableitung. $f\'(t) = -i\\omega f(t)$ hat die Ordnung 1, $y\'\' = -k^2y$ die Ordnung 2.\n- **gewöhnlich oder partiell:** Hängt die gesuchte Funktion nur von einer Variablen ab, heißt die DGL gewöhnlich. Die zeitabhängige Schrödingergleichung für $\\Psi(x,t)$ enthält Ableitungen nach $x$ und nach $t$; sie ist partiell (Abschnitt 5).\n- **linear und homogen:** $y$ und seine Ableitungen kommen nur in der ersten Potenz vor, nie als Produkt miteinander, und es gibt keinen Term ohne $y$. Allgemein: $y\'\' + a(x)\\,y\' + b(x)\\,y = 0$.\n\nFür lineare homogene DGL gilt das [[lex:dgl-superposition|Superpositionsprinzip]]: Sind $y_1$ und $y_2$ Lösungen, dann ist auch $C_1y_1 + C_2y_2$ eine Lösung. Der Grund: Ableiten ist linear, $(C_1y_1 + C_2y_2)\'\' = C_1y_1\'\' + C_2y_2\'\'$, und jeder Term der Gleichung behält diese Struktur (Herleitung unten für ein Beispiel). Die Schrödingergleichung ist linear. Deshalb sind Überlagerungen von Zuständen wieder Zustände – die Grundlage aller Interferenz.\n\nEine lineare DGL $n$-ter Ordnung hat $n$ linear unabhängige Lösungen. Die **allgemeine Lösung** ist ihre Linearkombination mit $n$ freien Konstanten. Diese Konstanten legen Zusatzbedingungen fest: Anfangswerte, Randwerte oder die Normierung (Abschnitt 4).\n\n**Typische Fehlvorstellung:** „Die Summe zweier Lösungen ist immer eine Lösung.“ Das gilt nur für lineare *homogene* Gleichungen. Bei $y\'\' + y = 1$ ist $y = 1$ eine Lösung, $1 + 1 = 2$ aber nicht. Ein Stolperstein speziell in der Quantenmechanik: Lösen $\\psi_1$ und $\\psi_2$ die Gleichung $\\hat H\\psi = E\\psi$ zu *verschiedenen* Energien, dann löst $\\psi_1 + \\psi_2$ diese Gleichung nicht. Es gibt kein einzelnes $E$ für die Summe, denn $E_1$ und $E_2$ gehören zu zwei verschiedenen Gleichungen. Die zeitabhängige Schrödingergleichung dagegen löst die Überlagerung (Abschnitt 5).',
      derive:{ctx:{coords:['x'], params:{k:'pos', C_1:'complex', C_2:'complex'}},
        lines:[
          {l:'d^2/dx^2 sin(kx) = -k^2 sin(kx)', w:'erste Lösung'},
          {l:'d^2/dx^2 cos(kx) = -k^2 cos(kx)', w:'zweite Lösung'},
          {l:'d^2/dx^2 (C_1 sin(kx) + C_2 cos(kx)) = C_1 d^2/dx^2 sin(kx) + C_2 d^2/dx^2 cos(kx)', w:'Ableiten ist linear', why:{q:'Welche Eigenschaft wird hier benutzt?', opts:['Die Ableitung einer Linearkombination ist die Linearkombination der Ableitungen.', 'Sinus und Kosinus sind orthogonal zueinander.', 'Die zweite Ableitung einer Summe ist das Produkt der Ableitungen.'], a:0, ex:'$(af + bg)\'\' = af\'\' + bg\'\'$. Genau das macht jede lineare DGL superpositionsfähig.'}},
          {l:'= -k^2 (C_1 sin(kx) + C_2 cos(kx))', w:'also wieder eine Lösung', why:{q:'Was zeigt diese Zeile?', opts:['Jede Kombination $C_1\\sin kx + C_2\\cos kx$ löst $y\'\' = -k^2y$.', 'Nur für $C_1 = C_2$ ist die Summe eine Lösung.', 'Die Summe löst eine andere Gleichung mit $-2k^2$.'], a:0, ex:'Das ist die allgemeine Lösung mit zwei freien Konstanten – passend zur Ordnung 2.'}}
        ]},
      q:[
        {q:'Welche dieser Gleichungen ist linear und homogen?', opts:['$y\'\' + x^2y = 0$', '$y\'\' + y^2 = 0$', '$y\'\' + y = x$'], a:0, ex:'Der Koeffizient $x^2$ darf von $x$ abhängen; entscheidend ist, dass $y$ nur linear vorkommt. $y^2$ ist nicht linear, und $y\'\' + y = x$ hat einen Term ohne $y$ (inhomogen).'},
        {q:'$\\psi_1$ und $\\psi_2$ lösen $\\hat H\\psi = E\\psi$ mit $E_1 \\ne E_2$. Was gilt für $\\psi_1 + \\psi_2$?', opts:['Es löst $\\hat H\\psi = E\\psi$ für kein einzelnes $E$.', 'Es löst die Gleichung mit $E = E_1 + E_2$.', 'Es löst sie mit $E = (E_1 + E_2)/2$.'], a:0, ex:'$\\hat H(\\psi_1 + \\psi_2) = E_1\\psi_1 + E_2\\psi_2$. Das ist kein Vielfaches von $\\psi_1 + \\psi_2$.'}
      ]},
    {id:'md-t2', title:'Der Exponentialansatz und die charakteristische Gleichung',
      text:'Für lineare DGL mit **konstanten Koeffizienten**,\n\n$$y\'\' + a\\,y\' + b\\,y = 0 \\qquad (a, b \\text{ konstant}),$$\n\ngibt es ein Verfahren, das immer funktioniert: den **Exponentialansatz** $y = e^{\\lambda x}$. Die Idee: Die Exponentialfunktion reproduziert sich beim Ableiten, $\\frac{d}{dx}e^{\\lambda x} = \\lambda e^{\\lambda x}$. Jede Ableitung wird zu einem Faktor $\\lambda$. Setzt man ein (Herleitung unten), bleibt $(\\lambda^2 + a\\lambda + b)\\,e^{\\lambda x} = 0$. Weil $e^{\\lambda x}$ nie null ist, muss die [[lex:charakteristische-gleichung|charakteristische Gleichung]]\n\n$$\\lambda^2 + a\\lambda + b = 0$$\n\ngelten. Aus einer DGL ist eine quadratische Gleichung geworden. Ihre Wurzeln $\\lambda_{1,2} = -\\tfrac a2 \\pm \\sqrt{\\tfrac{a^2}{4} - b}$ bestimmen die Lösung. Es gibt drei Fälle:\n\n- **zwei verschiedene reelle Wurzeln:** $y = C_1e^{\\lambda_1x} + C_2e^{\\lambda_2x}$, also Wachsen oder Abklingen.\n- **komplexe Wurzeln** $\\lambda = \\alpha \\pm i\\beta$: Mit der [[lex:euler|Euler-Formel]] ist $e^{(\\alpha \\pm i\\beta)x} = e^{\\alpha x}(\\cos\\beta x \\pm i\\sin\\beta x)$. Reelle Lösungen sind $y = e^{\\alpha x}(A\\cos\\beta x + B\\sin\\beta x)$: eine Schwingung mit der Hüllkurve $e^{\\alpha x}$.\n- **doppelte Wurzel** $\\lambda_0 = -a/2$: Der Ansatz liefert nur eine Lösung. Die zweite ist $x\\,e^{\\lambda_0x}$, also $y = (C_1 + C_2x)\\,e^{\\lambda_0x}$.\n\nDie gedämpfte Schwingung $\\ddot x + 2\\gamma\\dot x + \\omega_0^2x = 0$ zeigt alle drei Fälle: Schwache Dämpfung ($\\gamma < \\omega_0$) schwingt, starke kriecht, und $\\gamma = \\omega_0$ ist der aperiodische Grenzfall.\n\nKomplexe Lösungen sind kein Problem, sondern ein Werkzeug. Ist die Gleichung reell, dann sind Real- und Imaginärteil einer komplexen Lösung einzeln Lösungen. In der Quantenmechanik ist $\\psi$ ohnehin komplex; dort benutzt man $e^{\\pm ikx}$ direkt.\n\n**Typische Fehlvorstellung:** „Bei komplexen Wurzeln gibt es keine reelle Lösung.“ Doch: $\\cos\\beta x$ und $\\sin\\beta x$ sind reell. Ein zweiter häufiger Fehler ist das Vorzeichen. $y\'\' = \\kappa^2y$ wird zu $y\'\' - \\kappa^2y = 0$, also $\\lambda^2 - \\kappa^2 = 0$ und nicht $\\lambda^2 + \\kappa^2 = 0$. Bring erst alles auf eine Seite, dann lies die charakteristische Gleichung ab.',
      derive:{ctx:{coords:['x'], params:{a:'real', b:'real', λ:'complex'}},
        lines:[
          {l:'d/dx e^(λx) = λ e^(λx)', w:'Kettenregel', why:{q:'Woher kommt der Faktor $\\lambda$?', opts:['Kettenregel: innere Ableitung von $\\lambda x$', 'Produktregel mit $\\lambda$ und $e^x$', 'aus der Normierung von $e^{\\lambda x}$'], a:0, ex:'$\\frac{d}{dx}e^{u(x)} = u\'(x)\\,e^{u(x)}$ mit $u = \\lambda x$.'}},
          {l:'d^2/dx^2 e^(λx) = λ^2 e^(λx)', w:'noch einmal'},
          {l:'d^2/dx^2 e^(λx) + a d/dx e^(λx) + b e^(λx) = (λ^2 + a λ + b) e^(λx)', w:'einsetzen und ausklammern', why:{q:'Warum folgt daraus $\\lambda^2 + a\\lambda + b = 0$?', opts:['$e^{\\lambda x}$ ist nie null; die Klammer muss verschwinden.', 'weil man $x = 0$ einsetzen darf und $e^0 = 1$ ist', 'weil $a$ und $b$ bei Schwingungen null sind'], a:0, ex:'Damit $e^{\\lambda x}$ die DGL für **alle** $x$ löst, muss der Faktor vor $e^{\\lambda x}$ null sein.'}}
        ]},
      q:[
        {q:'Welche Wurzeln hat die charakteristische Gleichung von $y\'\' - 4y\' + 13y = 0$, und was tut die Lösung?', opts:['$2 \\pm 3i$: Schwingung mit wachsender Hülle', '$-2 \\pm 3i$: Schwingung mit fallender Hülle', '$\\pm\\sqrt{13}$: keine Schwingung'], a:0, ex:'$\\lambda^2 - 4\\lambda + 13 = 0$ gibt $\\lambda = 2 \\pm \\sqrt{4 - 13} = 2 \\pm 3i$. Die Hülle $e^{2x}$ wächst.'},
        {q:'Für $y\'\' + 6y\' + 9y = 0$ ist $\\lambda = -3$ eine doppelte Wurzel. Welche Funktion gehört neben $e^{-3x}$ zur allgemeinen Lösung?', opts:['$x\\,e^{-3x}$', '$e^{-3x}\\cos x$', '$x^2e^{-3x}$'], a:0, ex:'Bei der doppelten Wurzel $\\lambda_0$ ist auch $x\\,e^{\\lambda_0x}$ eine Lösung: $y = (C_1 + C_2x)\\,e^{-3x}$.'}
      ]},
    {id:'md-t3', title:'Schwingen oder Abklingen: die zwei Grundgleichungen',
      text:'In einer Dimension und bei konstantem Potential $V_0$ wird die zeitunabhängige [[lex:schroedinger|Schrödingergleichung]]\n\n$$-\\frac{\\hbar^2}{2m}\\psi\'\' + V_0\\,\\psi = E\\,\\psi$$\n\nzu einer DGL mit konstanten Koeffizienten. Umgestellt:\n\n$$\\psi\'\' = -\\frac{2m(E - V_0)}{\\hbar^2}\\,\\psi.$$\n\nDas Vorzeichen von $E - V_0$ entscheidet alles:\n\n- **$E > V_0$ (klassisch erlaubt):** $\\psi\'\' = -k^2\\psi$ mit $k = \\sqrt{2m(E - V_0)}/\\hbar$. Die Wurzeln $\\lambda = \\pm ik$ geben Schwingungen ([[lex:schwingungsgleichung|Schwingungsgleichung]]): $\\psi = A\\sin kx + B\\cos kx = C\\,e^{ikx} + D\\,e^{-ikx}$. Die Wellenlänge ist $2\\pi/k$; je größer die kinetische Energie $E - V_0$, desto kürzer.\n- **$E < V_0$ (klassisch verboten):** $\\psi\'\' = +\\kappa^2\\psi$ mit $\\kappa = \\sqrt{2m(V_0 - E)}/\\hbar$. Die Wurzeln $\\lambda = \\pm\\kappa$ geben $\\psi = C\\,e^{\\kappa x} + D\\,e^{-\\kappa x}$: Wachsen oder Abklingen, ohne Knoten. Gleichwertig ist $A\\sinh\\kappa x + B\\cosh\\kappa x$.\n\nDie Herleitung unten prüft, dass $e^{ikx}$ die Gleichung im erlaubten Fall wirklich löst. Welche Form du wählst, ist Bequemlichkeit. $\\sin$ und $\\cos$ passen zu stehenden Wellen mit Knoten an Wänden (Thema 3). $e^{\\pm ikx}$ passt zu laufenden Wellen mit Impuls $\\pm\\hbar k$ (Thema 4, Thema 5). $e^{\\pm\\kappa x}$ passt, wenn ein Bereich bis ins Unendliche reicht, denn dort muss der wachsende Teil wegfallen.\n\nEin Blick auf die Krümmung hilft beim Skizzieren. Bei $E > V_0$ hat $\\psi\'\'$ das umgekehrte Vorzeichen von $\\psi$: Die Kurve biegt sich zur Achse hin und schwingt. Bei $E < V_0$ hat $\\psi\'\'$ dasselbe Vorzeichen wie $\\psi$: Die Kurve biegt sich von der Achse weg und läuft davon oder klingt ab.\n\n**Typische Fehlvorstellung:** „Im verbotenen Bereich ist $\\psi = 0$.“ Nein: $\\psi$ klingt exponentiell ab, auf der Länge $1/\\kappa$ ([[lex:eindringtiefe|Eindringtiefe]]). Darauf beruht der Tunneleffekt (Thema 5). Ein Sonderfall ist $E = V_0$: Dann ist $\\psi\'\' = 0$ und $\\psi = A + Bx$, eine Gerade – weder Schwingung noch Exponentialfunktion.\n\nIm Labor siehst du beide Gleichungen nebeneinander: $y\'\' = -k^2y$ schwingt und hat Nullstellen, $y\'\' = +k^2y$ wächst ohne Nullstelle.',
      fig:{lab:'ode', caption:'Umschalten zwischen $y\'\' = -k^2y$ (Schwingung mit Nullstellen) und $y\'\' = +k^2y$ (Wachstum ohne Nullstelle), jeweils mit $y(0) = 0$ und $y\'(0) = 1$.'},
      derive:{ctx:{coords:['x'], params:{m:'pos', V_0:'pos', E:{range:['V_0', '3V_0']}}},
        lines:[
          {l:'k = sqrt(2m(E - V_0))/ħ', w:'Abkürzung für E > V₀'},
          {l:'-ħ^2/(2m) d^2/dx^2 e^(ikx) = ħ^2 k^2/(2m) e^(ikx)', w:'zweimal ableiten', why:{q:'Warum steht rechts ein positiver Faktor?', opts:['$(ik)^2 = -k^2$, und davor steht schon ein Minus.', 'weil $e^{ikx}$ eine reelle Funktion ist', 'weil $k$ hier imaginär ist'], a:0, ex:'$\\frac{d^2}{dx^2}e^{ikx} = (ik)^2e^{ikx} = -k^2e^{ikx}$; mit $-\\frac{\\hbar^2}{2m}$ davor wird daraus $+\\frac{\\hbar^2k^2}{2m}$.'}},
          {l:'= (E - V_0) e^(ikx)', w:'k einsetzen'},
          {l:'-ħ^2/(2m) d^2/dx^2 e^(ikx) + V_0 e^(ikx) = E e^(ikx)', w:'also löst e^(ikx) die Gleichung', why:{q:'Was bedeutet $\\hbar^2k^2/(2m) = E - V_0$ physikalisch?', opts:['Es ist die kinetische Energie des Teilchens.', 'Es ist die potentielle Energie des Teilchens.', 'Es ist die Gesamtenergie des Teilchens.'], a:0, ex:'Mit $p = \\hbar k$ ist $\\frac{p^2}{2m} = E - V_0$: Gesamtenergie minus potentielle Energie.'}}
        ]},
      q:[
        {q:'In einem Bereich ist $V_0 = 5\\,\\mathrm{eV}$, das Teilchen hat $E = 3\\,\\mathrm{eV}$. Welche Form hat $\\psi$ dort?', opts:['$Ce^{\\kappa x} + De^{-\\kappa x}$', '$A\\sin kx + B\\cos kx$', '$\\psi = 0$'], a:0, ex:'$E < V_0$: klassisch verboten, $\\psi\'\' = +\\kappa^2\\psi$. $\\psi$ ist dort nicht null, sondern wächst oder fällt exponentiell.'},
        {q:'In zwei Bereichen ist $E - V_0 = 1\\,\\mathrm{eV}$ bzw. $4\\,\\mathrm{eV}$. Wie verhalten sich die Wellenlängen?', opts:['Im zweiten Bereich ist sie halb so groß.', 'Im zweiten Bereich ist sie doppelt so groß.', 'Sie sind gleich, weil $E$ gleich ist.'], a:0, ex:'$k \\propto \\sqrt{E - V_0}$: $k$ verdoppelt sich, $\\lambda = 2\\pi/k$ halbiert sich.'}
      ]},
    {id:'md-t4', title:'Anfangswerte, Randwerte – und warum Randbedingungen quantisieren',
      text:'Die allgemeine Lösung einer DGL 2. Ordnung hat zwei freie Konstanten. Zwei Zusatzbedingungen legen sie fest. Wo diese Bedingungen stehen, macht einen grundlegenden Unterschied.\n\n**Anfangswertproblem:** Beide Bedingungen stehen an derselben Stelle, etwa $y(0)$ und $y\'(0)$. Für lineare DGL mit stetigen Koeffizienten gibt es dann **immer genau eine** Lösung ([[lex:anfangswertproblem|Anfangswertproblem]]). Physikalisch: Ort und Geschwindigkeit zur Zeit null legen die Bahn fest. Beispiel: $y\'\' = -k^2y$ mit $y(0) = 0$, $y\'(0) = 1$ hat für jedes $k > 0$ die Lösung $y = \\sin(kx)/k$.\n\n**Randwertproblem:** Die Bedingungen stehen an zwei verschiedenen Stellen, etwa $y(0) = 0$ und $y(L) = 0$. Jetzt ist eine Lösung keineswegs garantiert. Für $y\'\' = -k^2y$ (Herleitung unten) erzwingt $y(0) = 0$ zuerst $B = 0$; es bleibt $y = A\\sin kx$. Die zweite Bedingung verlangt $A\\sin kL = 0$. Mit $A = 0$ wäre $y \\equiv 0$ – die **triviale Lösung**, die nichts beschreibt. Also muss $\\sin kL = 0$ sein:\n\n$$k_n = \\frac{n\\pi}{L}, \\qquad n = 1, 2, 3, \\dots$$\n\nNur für diese einzelnen Werte gibt es nichttriviale Lösungen. Das ist ein **Eigenwertproblem**: $-y\'\' = k^2y$ hat die Form $\\hat Dy = \\mu y$ mit $\\hat D = -d^2/dx^2$ und den Eigenwerten $\\mu_n = k_n^2$ ([[lex:randwertproblem|Randwertproblem]], M4). Die Konstante $A$ bleibt frei; in der Quantenmechanik legt sie die Normierung fest.\n\nGenau so entsteht die **Energiequantisierung** im [[lex:kasten|Kasten]]: Mit $k^2 = 2mE/\\hbar^2$ folgt $E_n = \\hbar^2k_n^2/(2m)$. Die Quantisierung steckt nicht in der Schrödingergleichung allein, sondern in Gleichung **und** Randbedingungen. Ein freies Teilchen ohne Wände hat deshalb ein kontinuierliches Spektrum.\n\nRandbedingungen kommen in der Quantenmechanik in drei Formen vor:\n\n- **Wände:** $\\psi = 0$ am Rand eines unendlich hohen Potentials.\n- **Normierbarkeit:** Für $x\\to\\pm\\infty$ muss $\\psi$ abklingen. Im Bereich $x > 0$ mit $\\psi = Ce^{\\kappa x} + De^{-\\kappa x}$ heißt das $C = 0$. Diese Bedingung „im Unendlichen“ quantisiert die Energien im endlichen Topf und beim Oszillator.\n- **[[lex:anschluss|Anschlussbedingungen]]:** An einer Stufe eines endlichen Potentials müssen $\\psi$ und $\\psi\'$ stetig sein. Sie verbinden die Lösungen der einzelnen Bereiche (Thema 5).\n\n**Typische Fehlvorstellung:** Aus $A\\sin kL = 0$ auf $A = 0$ schließen. Formal richtig, aber dann ist $y \\equiv 0$, und es gibt kein Teilchen. Gesucht sind die $k$, für die eine nichttriviale Lösung existiert.',
      fig:{lab:'box', caption:'Die Lösungen des Randwertproblems $\\psi(0) = \\psi(L) = 0$: $\\psi_n \\propto \\sin(n\\pi x/L)$ mit $n - 1$ Knoten im Inneren und den Energien $E_n \\propto n^2$ (Thema 3).'},
      derive:{ctx:DGL({domain:{x:['0', 'L']}, params:{L:'pos', n:{int:[1, 4]}}, unknowns:{A:{ref:'1', kind:'real'}, B:{ref:'0', kind:'real'}, k:{ref:'nπ/L'}}}),
        lines:[
          {l:'y(x) = A sin(kx) + B cos(kx)', w:'allgemeine Lösung', why:{q:'Warum stehen hier zwei Konstanten?', opts:['Ordnung 2: zwei unabhängige Lösungen, also zwei Konstanten', 'eine für den Real- und eine für den Imaginärteil', 'eine je Randpunkt, also für $x = 0$ und $x = L$'], a:0, ex:'Die Zahl der freien Konstanten ist die Ordnung der DGL. Dass es hier auch zwei Randpunkte gibt, hat damit nichts zu tun – bei $y(0) = 0$, $y\'(0) = 1$ wären es zwei Bedingungen an einer Stelle.'}},
          {l:'y(0) = B = 0', w:'linker Rand', why:{q:'Warum fällt $B$ weg?', opts:['$\\sin 0 = 0$ und $\\cos 0 = 1$', 'weil $B$ immer null gewählt wird', 'wegen der Normierung'], a:0, ex:'Bei $x = 0$ bleibt nur $B\\cos 0 = B$.'}},
          {l:'y(L) = A sin(kL) = 0', w:'rechter Rand'},
          {l:'k = nπ/L', w:'A ≠ 0, also sin(kL) = 0', why:{q:'Warum nicht einfach $A = 0$?', opts:['Dann wäre $y \\equiv 0$: keine physikalische Lösung.', 'Weil die Normierung $A = 1$ schon festlegt.', 'Weil $\\sin kL$ nie null werden kann.'], a:0, ex:'$A = 0$ ist die triviale Lösung. Nichttriviale Lösungen verlangen $\\sin kL = 0$, also $kL = n\\pi$. $n = 0$ gäbe wieder $y \\equiv 0$, negative $n$ dieselben Funktionen wie positive.'}}
        ]},
      q:[
        {q:'Warum hat ein freies Teilchen auf der ganzen $x$-Achse ein kontinuierliches Energiespektrum, ein Teilchen im Kasten aber nicht?', opts:['Ohne Wände gibt es keine Randbedingung, die $k$ auswählt.', 'Im Kasten ist die Schrödingergleichung nichtlinear.', 'Ein freies Teilchen hat keine Wellenfunktion.'], a:0, ex:'Im Kasten wählen $\\psi(0) = \\psi(L) = 0$ einzelne $k$ aus. $e^{ikx}$ löst die freie Gleichung für jedes $k$; keine zweite Stelle stellt eine Bedingung.'},
        {q:'Randwertproblem $y\'\' = -k^2y$ mit $y(0) = 0$ und $y\'(L) = 0$. Welche Bedingung bestimmt die erlaubten $k$?', opts:['$\\cos kL = 0$', '$\\sin kL = 0$', '$\\tan kL = 1$'], a:0, ex:'Nach $y(0) = 0$ bleibt $y = A\\sin kx$, also $y\'(L) = Ak\\cos kL = 0$. Das gibt $k = (2n - 1)\\pi/(2L)$.'}
      ]},
    {id:'md-t5', title:'Separationsansatz: aus einer partiellen DGL werden zwei gewöhnliche',
      text:'Die zeitabhängige Schrödingergleichung für ein freies Teilchen,\n\n$$i\\hbar\\,\\frac{\\partial\\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\Psi}{\\partial x^2},$$\n\nist eine **partielle** DGL: Die gesuchte Funktion $\\Psi(x,t)$ hängt von zwei Variablen ab. Der [[lex:separation|Separationsansatz]] versucht es mit einem Produkt\n\n$$\\Psi(x,t) = \\varphi(x)\\,f(t).$$\n\nEingesetzt ist $\\partial_t\\Psi = \\varphi f\'$ und $\\partial_x^2\\Psi = \\varphi\'\'f$. Teilt man durch $\\varphi f$, folgt\n\n$$i\\hbar\\,\\frac{f\'(t)}{f(t)} = -\\frac{\\hbar^2}{2m}\\,\\frac{\\varphi\'\'(x)}{\\varphi(x)}.$$\n\nJetzt kommt das entscheidende Argument. Die linke Seite hängt nur von $t$ ab, die rechte nur von $x$. Hältst du $t$ fest und änderst $x$, ändert sich die linke Seite nicht – also auch die rechte nicht. Beide Seiten sind deshalb gleich derselben **Konstanten**. Man nennt sie $E$, weil sie sich als Energie herausstellt. Aus einer partiellen DGL werden zwei gewöhnliche:\n\n$$i\\hbar f\'(t) = E\\,f(t), \\qquad -\\frac{\\hbar^2}{2m}\\varphi\'\'(x) = E\\,\\varphi(x).$$\n\nDie erste hat die Ordnung 1; der Exponentialansatz gibt $f(t) = e^{-iEt/\\hbar}$. Die zweite ist die zeitunabhängige Schrödingergleichung, ein Eigenwertproblem für $\\varphi$. Randbedingungen an $\\varphi$ legen fest, welche $E$ erlaubt sind (Abschnitt 4). Die Herleitung unten prüft das Ergebnis für $\\varphi = e^{ikx}$.\n\nProduktlösungen sind besondere Lösungen: $|\\Psi|^2 = |\\varphi(x)|^2$ hängt nicht von der Zeit ab, der Zustand ist [[lex:stationaer|stationär]]. Die **allgemeine** Lösung ist erst ihre Überlagerung, denn die Gleichung ist linear (Abschnitt 1):\n\n$$\\Psi(x,t) = \\sum_n c_n\\,\\varphi_n(x)\\,e^{-iE_nt/\\hbar}.$$\n\nDie Koeffizienten $c_n$ folgen aus dem Anfangszustand $\\Psi(x,0)$ durch Entwicklung nach den $\\varphi_n$ (M5, M6). Eine Summe steht hier, wenn Randbedingungen wie im Kasten (Abschnitt 4) nur diskrete $E_n$ erlauben. Für das freie Teilchen auf ganz $\\mathbb R$ ist dagegen jedes $E = \\hbar^2k^2/2m$ erlaubt. Dann wird die Summe zu einem Integral über $k$ (M6, Thema 4).\n\n**Typische Fehlvorstellung:** „Jede Lösung der Schrödingergleichung ist ein Produkt $\\varphi(x)f(t)$.“ Nein: Schon $\\varphi_1e^{-iE_1t/\\hbar} + \\varphi_2e^{-iE_2t/\\hbar}$ ist keines. Seine Dichte enthält einen Mischterm mit $\\cos((E_2 - E_1)t/\\hbar)$ und schwappt hin und her (Thema 2). Separation liefert die Bausteine, nicht alle Lösungen.\n\nDas Verfahren funktioniert, wenn sich die Gleichung so umstellen lässt, dass jede Seite nur von einer Variablen abhängt. Mit einem zeitunabhängigen Potential $V(x)$ klappt es genauso; in drei Dimensionen trennt man auf dieselbe Weise $r$ von den Winkeln (M8, Thema 9).',
      fig:{lab:'twostate', caption:'Eine Überlagerung zweier Produktlösungen ist selbst kein Produkt: Ihre Dichte schwappt hin und her. Nur bei $|c_1|^2 = 0$ oder $1$ bleibt sie stehen.'},
      derive:{ctx:{coords:['x', 't'], params:{m:'pos', k:'pos'}, funcs:['Ψ', 'f']},
        lines:[
          {l:'E = ħ^2 k^2/(2m)', w:'Separationskonstante für φ = e^(ikx)'},
          {l:'f(t) = e^(-i E t/ħ)', w:'Lösung der Zeitgleichung'},
          {l:'iħ d/dt f(t) = E f(t)', w:'Probe', why:{q:'Warum steht im Exponenten $-iE/\\hbar$?', opts:['Aus $i\\hbar\\lambda = E$ folgt $\\lambda = -iE/\\hbar$, denn $1/i = -i$.', 'Das Minuszeichen ist reine Konvention.', 'Damit $f$ für große $t$ abklingt.'], a:0, ex:'$f$ klingt nicht ab: $|e^{-iEt/\\hbar}| = 1$. Nur die Phase dreht sich.'}},
          {l:'Ψ(x,t) = e^(ikx) f(t)', w:'Produktansatz'},
          {l:'iħ ∂/∂t Ψ(x,t) = E Ψ(x,t)', w:'linke Seite'},
          {l:'-ħ^2/(2m) ∂^2/∂x^2 Ψ(x,t) = E Ψ(x,t)', w:'rechte Seite'},
          {l:'iħ ∂/∂t Ψ(x,t) = -ħ^2/(2m) ∂^2/∂x^2 Ψ(x,t)', w:'beide Seiten gleich: Lösung', why:{q:'Was zeigt die Rechnung?', opts:['Das Produkt ist eine Lösung, weil beide Teile dasselbe $E$ haben.', 'Jede Lösung der Gleichung hat genau diese Produktform.', 'Die Gleichung gilt so nur zur Zeit $t = 0$, später nicht mehr.'], a:0, ex:'Die gemeinsame Konstante $E$ verbindet Zeit- und Ortsteil. Überlagerungen verschiedener $E$ sind ebenfalls Lösungen, aber keine Produkte.'}}
        ]},
      q:[
        {q:'Nach dem Einsetzen gilt $g(t) = h(x)$ für alle $x$ und $t$. Was folgt daraus?', opts:['Beide Seiten sind gleich derselben Konstanten.', 'Beide Seiten sind gleich null, für alle $x$ und $t$.', '$x$ und $t$ können nicht unabhängig sein.'], a:0, ex:'Hält man $t$ fest und variiert $x$, bleibt $g(t)$ gleich – also ist $h(x)$ konstant. Ebenso $g(t)$. Null muss die Konstante nicht sein.'},
        {q:'$\\Psi = \\varphi_1e^{-iE_1t/\\hbar} + \\varphi_2e^{-iE_2t/\\hbar}$ mit $E_1 \\ne E_2$. Welche Aussage stimmt?', opts:['$\\Psi$ ist eine Lösung, aber kein Produkt.', '$\\Psi$ ist keine Lösung, weil kein Produkt.', '$\\Psi$ ist ein Produkt mit $E = E_1 + E_2$.'], a:0, ex:'Die Gleichung ist linear, also ist die Summe zweier Lösungen eine Lösung. Ein Produkt ist sie nicht: Ihre Dichte hängt von $t$ ab.'}
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
