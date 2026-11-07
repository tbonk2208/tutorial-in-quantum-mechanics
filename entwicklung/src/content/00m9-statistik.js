/* ===== Mathe M9: Wahrscheinlichkeit und Statistik ===== */
(function(){
const R = String.raw;
/* Dichte ρ(x) mit ψ = √ρ, damit ⟨…⟩ und Δx im Prüfkern dieselbe Verteilung meinen */
const DENS = (rho, psi, extra) => Object.assign({coords:['x'], params:{}, defs:{'ρ(x)':rho, 'ψ(x)':psi}}, extra || {});
/* diskrete Zufallsgröße als Diagonalmatrix mit Zustand (√P₁; √P₂; √P₃) */
const DISC = (mats, state, extra) => Object.assign({rep:'mat', mat:{preset:'spin', mats}, coords:['t'], params:{}, states:{ψ:state}, state:'ψ'}, extra || {});
const EXPO = DENS('λ e^(-λ x)', 'sqrt(λ) e^(-λ x/2)', {domain:{x:['0', '∞']}, params:{λ:'pos'}});
const GAUSS = DENS('1/(sqrt(2π) σ) e^(-(x - μ)^2/(2σ^2))', 'sqrt(ρ(x))', {params:{μ:'real', σ:'pos'}});
/* eine beliebige (vom Parameter c abhängige) Dichte auf [0, 1]: Die Varianzformel gilt für jede */
const ANY = {coords:['x'], domain:{x:['0', '1']}, params:{c:'pos'}, defs:{'ψ(x)':'x (1 - x)^c e^(c x)'}};
topic({
  id:'m-stat', ch:'math', title:'Wahrscheinlichkeit und Statistik', short:'Statistik',
  src:'Griffiths & Schroeter (3. Aufl.) Kap. 1.3 · Boas (3. Aufl.) Kap. 15',
  goals:[
    'Ich kann diskrete Verteilungen und Wahrscheinlichkeitsdichten normieren und Wahrscheinlichkeiten für Intervalle berechnen.',
    'Ich kann Erwartungswert, Momente, Varianz und Standardabweichung berechnen, auch über $(\\Delta x)^2 = \\langle x^2\\rangle - \\langle x\\rangle^2$, und kenne die Gauß-Verteilung.',
    'Ich kann mit Unabhängigkeit und bedingter Wahrscheinlichkeit rechnen und unterscheide den Mittelwert einer Messreihe vom Erwartungswert über das Ensemble.'
  ],
  needs:'Integrale mit $e^{-\\lambda x}$, Gauß-Integrale und partielle Integration (M2) · Summenzeichen · Symmetrie gerader und ungerader Funktionen',
  wozu:'Jede Messung in der Quantenmechanik liefert ein zufälliges Ergebnis: Ort, Impuls, Energie, Spin. Die Theorie sagt Verteilungen voraus, beschrieben durch Erwartungswert und Standardabweichung; die Unschärferelation ist eine Aussage über zwei Standardabweichungen. Dieselben Begriffe brauchst du im Praktikum für jede Messreihe (Mittelwert, Streuung, Fehler des Mittelwerts) und später in der statistischen Physik.',
  bridge:'Aus M2 kommen die Integrale ($e^{-\\lambda x}$, Gauß-Integrale, partielle Integration). In Thema 1 wird $|\\psi|^2$ zur Wahrscheinlichkeitsdichte, in Thema 3 und Thema 6 liefern Energiemessungen diskrete Verteilungen $|c_n|^2$, und in Thema 4 ist die Ortsdichte des Wellenpakets eine Gauß-Verteilung.',
  check:[
    {q:'$\\int_0^\\infty e^{-\\lambda x}\\,dx$ ist für $\\lambda > 0$ gleich …', opts:['$1/\\lambda$', '$\\lambda$', '$-1/\\lambda$'], a:0, ex:'Stammfunktion $-e^{-\\lambda x}/\\lambda$: oben $0$, unten $-1/\\lambda$, also $0 - (-1/\\lambda) = 1/\\lambda$.', lex:'integrale', prev:'m-analysis', seg:'ma-t4'},
    {q:'$\\int_{-a}^{a} x\\,e^{-x^2}\\,dx$ ist …', opts:['$0$', '$2\\int_0^a x\\,e^{-x^2}dx$', '$\\sqrt\\pi$'], a:0, ex:'Der Integrand ist ungerade, das Intervall symmetrisch: Die Beiträge links und rechts heben sich weg.', lex:'integrale', prev:'m-analysis', seg:'ma-t3'},
    {q:'$\\int_{-\\infty}^{\\infty} e^{-x^2/2}\\,dx$ ist …', opts:['$\\sqrt{2\\pi}$', '$\\sqrt{\\pi}/2$', '$1$'], a:0, ex:'$\\int e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/2$ gibt $\\sqrt{2\\pi}$.', lex:'gauss-integral', prev:'m-analysis', seg:'ma-t3'},
    {q:'$\\int_0^\\infty x\\,e^{-x}\\,dx$ ist …', opts:['$1$', '$0$', '$1/2$'], a:0, ex:'Partielle Integration oder $\\int_0^\\infty x^ne^{-x}dx = n!$ mit $n = 1$.', lex:'partielle-integration', prev:'m-analysis', seg:'ma-t4'}
  ],
  diag:[
    {q:'Wie beginnst du, um die Standardabweichung $\\Delta x$ einer gegebenen Dichte $\\rho(x)$ zu berechnen?', opts:['$\\langle x\\rangle$ und $\\langle x^2\\rangle$ als Integrale mit $\\rho$ berechnen', 'die Breite der Kurve bei halber Höhe ablesen', 'das Integral $\\int\\rho(x)^2\\,dx$ ausrechnen', 'weiß ich nicht'], a:0, ex:'$(\\Delta x)^2 = \\langle x^2\\rangle - \\langle x\\rangle^2$ braucht die ersten beiden Momente. Die Halbwertsbreite ist ein anderes Breitenmaß; bei einer Gauß-Kurve ist sie etwa $2{,}35\\,\\Delta x$.'},
    {q:'Eine Dichte ist bis auf einen Faktor bekannt, $\\rho(x) = A\\,f(x)$. Wie beginnst du, um $P(a < x < b)$ zu berechnen?', opts:['$A$ aus $\\int\\rho\\,dx = 1$ bestimmen, dann $\\int_a^b\\rho\\,dx$', 'die Differenz $\\rho(b) - \\rho(a)$ berechnen', '$A = 1$ setzen, weil $P \\le 1$ ist', 'weiß ich nicht'], a:0, ex:'Ohne Normierung ist $\\int_a^b\\rho\\,dx$ keine Wahrscheinlichkeit. $\\rho(b) - \\rho(a)$ ist eine Differenz von Dichten, keine Fläche.'}
  ],
  phenomenon:{
    title:'Wird die Streuung mit mehr Messungen kleiner?',
    text:'Zwei Gruppen messen den Ort von Elektronen, die alle im selben Zustand präpariert sind, mit einem nahezu idealen Detektor. Gruppe A macht 20 Messungen, Gruppe B 2000. Beide zeichnen ein Histogramm und berechnen Mittelwert und Streuung ihrer Messwerte.',
    q:{q:'Was erwartest du beim Vergleich der beiden Gruppen?', opts:['Bei B streuen die Einzelwerte deutlich weniger als bei A.', 'Die Streuung ist etwa gleich; der Mittelwert von B ist genauer.', 'Bei B streuen Einzelwerte und Mittelwert gleich stark.', 'Der Mittelwert von B trifft $\\langle x\\rangle$ exakt.'], a:1,
      ex:'Die Streuung der Einzelwerte gehört zum Zustand. Genauer wird nur der Mittelwert.',
      fb:[
        'Die Streuung der Einzelwerte ist eine Eigenschaft des Zustands, die Standardabweichung $\\Delta x$. Mehr Messungen bestimmen sie genauer, machen sie aber nicht kleiner.',
        'Genau. Die Einzelwerte streuen in beiden Gruppen mit etwa $\\Delta x$. Der Mittelwert schwankt von Messreihe zu Messreihe nur um etwa $\\Delta x/\\sqrt N$ – bei B zehnmal weniger als bei A.',
        'Der Mittelwert schwankt viel weniger als die Einzelwerte: um etwa $\\Delta x/\\sqrt N$ statt um $\\Delta x$.',
        'Auch nach 2000 Messungen ist der Mittelwert eine Zufallsgröße. Er liegt nur sehr nahe bei $\\langle x\\rangle$, typischerweise innerhalb von $\\Delta x/\\sqrt{2000}$.'
      ]},
    reveal:'Die Streuung der Einzelwerte gehört zum **Zustand**: Auch ein idealer Detektor findet Werte, die mit der Standardabweichung $\\Delta x$ um $\\langle x\\rangle$ streuen. Mehr Messungen machen das Histogramm glatter, aber nicht schmaler.\n\nGenauer wird der **Mittelwert**: Er schwankt von Messreihe zu Messreihe nur um etwa $\\Delta x/\\sqrt N$. Bei $N = 2000$ ist das $\\sqrt{100} = 10$-mal weniger als bei $N = 20$.\n\nWarum das so ist, klärt dieses Thema: Erwartungswert und Standardabweichung einer Verteilung (Abschnitte 3 und 4), Unabhängigkeit (Abschnitt 6) und der Unterschied zwischen Messreihe und Ensemble (Abschnitt 7).'
  },
  teach:[
    /* ===== Abschnitt 1: diskrete Zufallsgrößen, Häufigkeit und Wahrscheinlichkeit ===== */
    {id:'st-t1', title:'Zufall in der Messung: diskrete Zufallsgrößen', steps:[
      {id:'st-t1a', title:'Einzelne Ergebnisse, ein Muster',
        num:{title:'Sechs Würfe', text:R`Sechsmal gewürfelt: $3, 6, 6, 1, 4, 3$. Die $2$ und die $5$ fehlen, $3$ und $6$ kommen doppelt. Niemand kann den siebten Wurf vorhersagen. Nach sehr vielen Würfen kommt aber jede Zahl in etwa einem Sechstel der Fälle vor.`},
        text:R`Schickt man Elektronen einzeln durch einen Doppelspalt, landet jedes an einer einzigen Stelle des Schirms. Wo das nächste landet, lässt sich nicht vorhersagen. Erst viele Treffer zusammen ergeben ein Muster. Die Quantenmechanik sagt genau dieses Muster voraus, also Wahrscheinlichkeiten (Ausblick auf Thema 1).

Deshalb brauchst du die Sprache der Wahrscheinlichkeitsrechnung, bevor du mit Wellenfunktionen rechnest. Sie beschreibt, was über ein einzelnes Ergebnis gesagt werden kann: welche Werte möglich sind und wie oft sie bei vielen Wiederholungen vorkommen.`,
        q:{q:'Was sagt die Quantenmechanik über ein einzelnes Elektron am Doppelspalt voraus?',
          opts:['die Wahrscheinlichkeiten für die möglichen Auftreffstellen', 'den genauen Auftreffpunkt, wenn man genau genug rechnet', 'gar nichts; Aussagen gibt es erst über viele Elektronen'], a:0,
          ex:'Für jedes einzelne Elektron liegen die Wahrscheinlichkeiten fest. Das Muster vieler Elektronen macht sie als Häufigkeiten sichtbar.',
          fb:['',
            'Genauer rechnen hilft nicht. Der Zufall gehört zur Theorie, nicht zu einer fehlenden Information.',
            'Auch für ein einzelnes Elektron gibt es eine Aussage: die Wahrscheinlichkeitsverteilung. Nur der einzelne Treffer bleibt zufällig.']}},
      {id:'st-t1b', title:'Zufallsgröße und Normierung',
        num:{title:'Ein fairer Würfel', text:R`Jede Augenzahl hat $P_n = \tfrac16$ für $n = 1, \dots, 6$, und $\sum_n P_n = 6\cdot\tfrac16 = 1$. Eine gerade Zahl kommt mit $P(\text{gerade}) = P_2 + P_4 + P_6 = \tfrac36 = \tfrac12$.`},
        text:R`Eine [[lex:stat-zufallsgroesse|Zufallsgröße]] $X$ ordnet jedem Ausgang eines Zufallsexperiments eine Zahl zu. Sie heißt **diskret**, wenn sie nur einzelne Werte $x_1, x_2, \dots$ annehmen kann. Zu jedem Wert gehört eine Wahrscheinlichkeit $P_n = P(X = x_n)$, gelesen „P von X gleich x n“, mit

$$0 \le P_n \le 1,\qquad \sum_n P_n = 1.$$

Die zweite Bedingung heißt **Normierung**: Irgendein Wert kommt sicher heraus. Schließen sich Ausgänge gegenseitig aus, addierst du ihre Wahrscheinlichkeiten, wie bei „gerade“ im Beispiel.`,
        q:{q:R`Eine Messung liefert $E_1$, $E_2$ oder $E_3$ mit $P_1 = 0{,}5$ und $P_2 = 0{,}3$. Wie groß ist $P_3$?`,
          opts:[R`$0{,}8$`, R`ohne den Wert $E_3$ nicht bestimmbar`, R`$0{,}2$`], a:2,
          ex:R`Normierung: $P_1 + P_2 + P_3 = 1$, also $P_3 = 0{,}2$. Die Messwerte selbst spielen dafür keine Rolle.`,
          fb:[R`$0{,}8$ ist $P_1 + P_2$, die Wahrscheinlichkeit für „nicht $E_3$“.`,
            R`Die Normierung betrifft nur die Wahrscheinlichkeiten, nicht die Werte $E_n$.`,
            '']}},
      {id:'st-t1c', title:'Wahrscheinlichkeit und Häufigkeit: Tafel',
        num:{title:'60 Würfe', text:R`Eine Messreihe mit 60 Würfen ergibt die Anzahlen $8, 11, 9, 12, 7, 13$ für die Augenzahlen $1$ bis $6$. Die relativen Häufigkeiten sind $\tfrac{8}{60} \approx 0{,}13$ bis $\tfrac{13}{60} \approx 0{,}22$. Erwartet sind je $10$ Würfe; Abweichungen von etwa $3$ nach oben oder unten sind bei $60$ Würfen ganz normal.`},
        text:R`Wahrscheinlichkeit hat zwei Lesarten, die zusammenpassen. Erstens als Grenzwert der **relativen Häufigkeit**: Kommt $x_n$ bei $N$ Wiederholungen $N_n$-mal vor, dann gilt $N_n/N \to P_n$ für $N \to \infty$. Zweitens als Eigenschaft der Präparation: Ein fairer Würfel *hat* $P_6 = \tfrac16$, auch wenn niemand würfelt.

Bei endlich vielen Würfen schwanken die Häufigkeiten um die Wahrscheinlichkeiten. Im Balkenbild sind die Wahrscheinlichkeiten gleich hoch, das Histogramm der Messreihe ist es nicht. Die Tafel verbindet Formel, Balkenbild, Labor und Physik.`,
        reps:{obj:'Ein fairer Würfel nach 60 Würfen',
          rows:[
            {k:'worte', text:R`Sechs mögliche Werte, alle gleich wahrscheinlich. Eine Messreihe zeigt sie mit schwankenden Häufigkeiten.`},
            {k:'formel', tex:R`P_n = \tfrac16,\qquad \frac{N_n}{N}\;\xrightarrow{\;N \to \infty\;}\;P_n`},
            {k:'graph', plot:{x:[0.5, 6.5], y:[0, 0.26], xlab:'n', ylab:'\\text{Anteil}', ticks:[1, 2, 3, 4, 5, 6].map(n => ({x:n, lab:String(n)}))},
              f:x => (Math.abs(x - Math.round(x)) < 0.3 ? 1 / 6 : 0), lab:R`P_n`,
              f2:x => (Math.abs(x - Math.round(x)) < 0.3 ? [8, 11, 9, 12, 7, 13][Math.round(x) - 1] / 60 : 0), lab2:R`N_n/N`,
              cap:R`Durchgezogen die Wahrscheinlichkeiten $\tfrac16$, gestrichelt die relativen Häufigkeiten nach 60 Würfen.`},
            {k:'labor', text:R`Messlabor (Bild im nächsten Schritt): Die blauen Balken sind die Wahrscheinlichkeiten, die roten die Häufigkeiten. „100× messen“ macht die roten Balken den blauen immer ähnlicher.`},
            {k:'physik', text:R`Ausblick: Eine Energiemessung liefert einen der Werte $E_n$, jeden mit seiner Wahrscheinlichkeit (Thema 3, Thema 6).`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Gleich wahrscheinlich“ bei sechs Werten heißt $P_n = 1/6$; „Häufigkeit“ ist Anzahl durch Gesamtzahl.`},
            {from:'formel', to:'graph', rule:R`Für jeden Wert $n$ einen Balken der Höhe $P_n$ zeichnen, daneben einen der Höhe $N_n/N$.`},
            {from:'graph', to:'labor', rule:R`Die Balken im Labor genauso lesen: blau ist die Vorhersage, rot die Messreihe.`},
            {from:'labor', to:'physik', rule:R`Die Werte auf der Achse sind die möglichen Messergebnisse; die blauen Balken sagt die Theorie voraus.`}
          ]},
        q:{q:R`Im Labor zeigen nach 60 Messungen die roten Balken $0{,}22$ bei einem Wert, dessen blauer Balken $0{,}17$ hoch ist. Was folgt daraus?`, tr:{from:'labor', to:'formel'},
          opts:[R`Die Wahrscheinlichkeit ist in Wahrheit $0{,}22$.`, R`Das passt zu $P = 0{,}17$: Häufigkeiten schwanken.`, R`Jetzt muss der Wert seltener kommen, damit es sich ausgleicht.`], a:1,
          ex:R`Bei 60 Messungen schwankt die Anzahl typisch um etwa $3$ um den erwarteten Wert $10$, die Häufigkeit also um etwa $0{,}05$.`,
          fb:[R`Aus 60 Messungen lässt sich $P$ nur grob schätzen. Die Abweichung $0{,}05$ ist typisch für diese Zahl von Messungen.`,
            '',
            R`Zufallsexperimente haben kein Gedächtnis. Die Häufigkeit nähert sich $P$, weil neue Messungen die alten verdünnen, nicht weil sie sie ausgleichen.`]}},
      {id:'st-t1d', title:'Typischer Fehler: „Jetzt ist die Sechs fällig“',
        num:{title:'Zehn Würfe ohne Sechs', text:R`Nach zehn Würfen ohne Sechs ist die Wahrscheinlichkeit für eine Sechs im elften Wurf weiterhin $\tfrac16 \approx 0{,}17$. Der Würfel weiß nichts von den früheren Würfen.`},
        text:R`Ein verbreiteter Fehlschluss lautet: „Nach vielen Würfen ohne Sechs ist die Sechs jetzt fällig.“ Er verwechselt die zwei Lesarten aus dem letzten Schritt. Dass sich die Häufigkeiten auf lange Sicht den Wahrscheinlichkeiten nähern, liegt nicht an einem Ausgleich. Es liegt daran, dass immer mehr Würfe die früheren Abweichungen verdünnen.

Der zweite Fehlschluss betrifft die Quantenmechanik: „Kenne ich den Zustand genau, kenne ich auch das Messergebnis.“ Das stimmt nur in Sonderfällen. Im Allgemeinen legt auch ein genau bekannter Zustand nur die Verteilung fest. Der Zufall liegt nicht an einem schlechten Messgerät.`,
        q:{q:'Ein fairer Würfel hat zehnmal hintereinander keine Sechs gezeigt. Wie wahrscheinlich ist eine Sechs im nächsten Wurf?',
          opts:[R`größer als $\tfrac16$, sie ist überfällig`, R`genau $\tfrac16$`, R`kleiner als $\tfrac16$, der Würfel ist wohl gezinkt`], a:1,
          ex:R`Jeder Wurf hat dieselben Wahrscheinlichkeiten, unabhängig von der Vorgeschichte.`,
          fb:[R`Der Würfel hat kein Gedächtnis. Ein Ausgleich findet nicht statt.`,
            '',
            R`Zehn Würfe ohne Sechs kommen bei einem fairen Würfel in etwa jeder sechsten Zehnerserie vor; das beweist keine Manipulation.`]}},
      {id:'st-t1e', title:'Brücke zur Physik: Messwerte und ihre Wahrscheinlichkeiten',
        pre:{from:'m-komplex', seg:'mk-t1', title:'Betragsquadrat', text:R`Für eine komplexe Zahl $c = a + ib$ ist $|c|^2 = c^*c = a^2 + b^2$, reell und nicht negativ. Mini-Beispiel: $|0{,}6i|^2 = 0{,}36$.`},
        num:{title:'Zwei Energien', text:R`Ein Zustand sei $\psi = 0{,}6\,\psi_1 + 0{,}8\,\psi_2$. Eine Energiemessung liefert $E_1$ mit $P_1 = 0{,}6^2 = 0{,}36$ und $E_2$ mit $P_2 = 0{,}8^2 = 0{,}64$. Die Normierung stimmt: $0{,}36 + 0{,}64 = 1$. Bei 1000 Messungen erwartest du etwa 640-mal $E_2$.`},
        text:R`Ausblick auf Thema 3 und Thema 6: Ist ein Teilchen im Zustand $\psi = \sum_n c_n\psi_n$, liefert eine Energiemessung einen der Werte $E_n$, und zwar mit der Wahrscheinlichkeit $P_n = |c_n|^2$. Die Normierung des Zustands ist dann genau $\sum_n|c_n|^2 = 1$. Die Zahlen $c_n$ heißen Amplituden; erst ihre Betragsquadrate sind Wahrscheinlichkeiten.

Im Bild daneben stellst du mit den Reglern $|c_n|^2$ die Wahrscheinlichkeiten für drei Messwerte ein; sie erscheinen als blaue Balken. „100× messen“ würfelt hundert Messungen aus. Die roten Balken zeigen ihre relativen Häufigkeiten.`,
        fig:{lab:'measure', keep:['|c₁|²', '|c₂|²', 'Viele'], caption:'Drei mögliche Messwerte mit den Wahrscheinlichkeiten $|c_n|^2$ (blau). „100× messen“ zeigt die relativen Häufigkeiten (rot); sie nähern sich mit wachsender Zahl der Messungen den Wahrscheinlichkeiten.'},
        q:{q:'Ein Zustand hat $c_2 = 0{,}5i$. Etwa wie oft liefert eine Energiemessung bei 1000 gleich präparierten Systemen den Wert $E_2$?',
          opts:['etwa 500-mal, weil $|c_2| = 0{,}5$', 'etwa 250-mal, weil $|c_2|^2 = 0{,}25$', 'nie, weil $(0{,}5i)^2 = -0{,}25$'], a:1,
          ex:'$P_2 = |c_2|^2 = c_2^*c_2 = (-0{,}5i)(0{,}5i) = 0{,}25$, also etwa 250 von 1000.',
          fb:['$0{,}5$ ist der Betrag der Amplitude. Die Wahrscheinlichkeit ist ihr Betragsquadrat, $0{,}25$.', '', '$(0{,}5i)^2$ ist nicht das Betragsquadrat. $|c|^2 = c^*c$ ist nie negativ, hier $0{,}25$.']}}
    ]},

    /* ===== Abschnitt 2: Wahrscheinlichkeitsdichte ===== */
    {id:'st-t2', title:'Kontinuierliche Größen: die Wahrscheinlichkeitsdichte', steps:[
      {id:'st-t2a', title:'Vom Histogramm zur Dichte',
        pre:{from:'m-spezial', seg:'ms-t2', title:'Dichte pro Länge oder Volumen', text:R`Eine Dichte ist eine Menge pro Länge, Fläche oder Volumen. Die Menge in einem Bereich ist das Integral der Dichte. Mini-Beispiel: In der Kugelschale bei $r$ liegt $4\pi r^2\rho(r)\,dr$.`},
        num:{title:'1000 Ortsmessungen', text:R`Von 1000 gemessenen Orten liegen 250 zwischen $0{,}40$ und $0{,}50\,\mathrm{nm}$. Der Anteil $0{,}25$ geteilt durch die Breite $0{,}1\,\mathrm{nm}$ gibt $2{,}5\,\mathrm{nm}^{-1}$. Halbierst du die Säulen, liegen in einer etwa 125 Werte: $0{,}125/0{,}05\,\mathrm{nm} = 2{,}5\,\mathrm{nm}^{-1}$. Die Höhe pro Breite bleibt gleich.`},
        text:R`Der Ort, an dem ein Elektron auf dem Schirm landet, ist eine **kontinuierliche** Zufallsgröße: Er kann jeden Wert in einem Intervall annehmen. Dann hat jeder einzelne Wert die Wahrscheinlichkeit null. Wahrscheinlichkeiten gibt es nur für Intervalle.

Zeichnest du ein Histogramm, hängt die Höhe einer Säule von ihrer Breite ab. Teilst du den Anteil durch die Breite, bleibt die Höhe stabil, auch wenn die Säulen immer schmaler werden. Diese Grenzkurve ist die **Wahrscheinlichkeitsdichte** $\rho(x)$, gelesen „rho von x“. Sie ist Wahrscheinlichkeit **pro Länge**.`,
        q:{q:R`Ein Histogramm hat Säulen der Breite $0{,}1\,\mathrm{nm}$. Eine Säule enthält $8\,\%$ der Messwerte. Wie groß ist dort ungefähr die Dichte?`,
          opts:[R`$0{,}08\,\mathrm{nm}^{-1}$`, R`$0{,}008\,\mathrm{nm}^{-1}$`, R`$0{,}8\,\mathrm{nm}^{-1}$`], a:2,
          ex:R`Anteil durch Breite: $0{,}08/0{,}1\,\mathrm{nm} = 0{,}8\,\mathrm{nm}^{-1}$.`,
          fb:[R`$0{,}08$ ist der Anteil in der Säule, noch nicht durch die Breite geteilt.`,
            R`Hier wurde mit der Breite multipliziert statt durch sie geteilt.`,
            '']}},
      {id:'st-t2b', title:'Wahrscheinlichkeit ist Fläche',
        num:{title:R`$\rho(x) = 2x$ auf $[0, 1]$`, text:R`Die Gesamtfläche ist $\int_0^1 2x\,dx = 1$. In der linken Hälfte liegt $\int_0^{0{,}5}2x\,dx = 0{,}25$, in der rechten $0{,}75$. Die Dichte wächst nach rechts, also liegt dort mehr Wahrscheinlichkeit.`},
        text:R`Eine [[lex:stat-dichte|Wahrscheinlichkeitsdichte]] beschreibt die Verteilung durch Flächen:

$$P(a \le x \le b) = \int_a^b\rho(x)\,dx,$$

$$\rho(x) \ge 0,\qquad \int_{-\infty}^{\infty}\rho(x)\,dx = 1.$$

Die letzte Bedingung ist die Normierung: Irgendwo liegt der Wert sicher. Für ein kurzes Intervall der Breite $dx$ gilt $P(x_0 \le x \le x_0 + dx) \approx \rho(x_0)\,dx$. Daran liest du ab, was $\rho$ bedeutet: Wahrscheinlichkeit pro Länge. Diskret und kontinuierlich passen zusammen. Aus $P_n$ wird $\rho(x)\,dx$, aus der Summe $\sum_n$ das Integral $\int dx$.`,
        q:{q:R`Für $\rho(x) = 2x$ auf $[0, 1]$: Wie groß ist $P(0{,}2 \le x \le 0{,}6)$?`,
          opts:[R`$0{,}4$`, R`$0{,}32$`, R`$0{,}8$`], a:1,
          ex:R`$\int_{0{,}2}^{0{,}6}2x\,dx = 0{,}6^2 - 0{,}2^2 = 0{,}36 - 0{,}04 = 0{,}32$.`,
          fb:[R`$0{,}4$ ist die Breite des Intervalls. Das wäre richtig für $\rho = 1$, nicht für $\rho = 2x$.`,
            '',
            R`$0{,}8 = \rho(0{,}6) - \rho(0{,}2)$ ist eine Differenz von Dichten, keine Fläche.`]}},
      {id:'st-t2b2', title:'Von der Summe zum Integral: Tafel',
        num:{title:'Würfel und Gleichverteilung', text:R`Beim Würfel ist $P(X \le 2) = P_1 + P_2 = \tfrac16 + \tfrac16 = \tfrac13$. Eine Größe, die gleichmäßig auf $[0, 6]$ verteilt ist, hat die Dichte $\rho = \tfrac16$. Für sie ist

$$P(0 \le x \le 2) = \int_0^2\tfrac16\,dx = \tfrac13.$$

Aus dem Summanden $P_n$ wird der Integrand $\rho(x)\,dx$.`},
        text:R`Diskrete und kontinuierliche Verteilungen folgen denselben Regeln. Du übersetzt zwischen ihnen mit einer festen Vorschrift. Der Index $n$ wird zur stetigen Variablen $x$. Die Wahrscheinlichkeit $P_n$ eines einzelnen Werts wird zu $\rho(x)\,dx$, der Wahrscheinlichkeit eines kurzen Intervalls. Die Summe $\sum_n$ wird zum Integral $\int dx$. So wird aus der Normierung $\sum_nP_n = 1$ die Normierung $\int\rho\,dx = 1$.

Diese Übersetzung brauchst du in der Quantenmechanik ständig. Eine Energiemessung hat oft einzelne Werte $E_n$ mit den Wahrscheinlichkeiten $|c_n|^2$, eine Ortsmessung eine Dichte $|\psi(x)|^2$. Die Tafel stellt beide Fälle nebeneinander.`,
        reps:{obj:'Wahrscheinlichkeit eines Bereichs, diskret und kontinuierlich',
          rows:[
            {k:'worte', text:R`Wie wahrscheinlich ist ein Bereich von Werten? Man sammelt alles, was in ihm liegt.`},
            {k:'matrix', tex:R`\begin{gathered}(P_1;\ \dots;\ P_6) = (\tfrac16;\ \dots;\ \tfrac16),\\ P(X \le 2) = \sum_{n=1}^{2}P_n = \tfrac13\end{gathered}`},
            {k:'formel', tex:R`\begin{gathered}P(a \le x \le b) = \int_a^b\rho(x)\,dx,\\ \int_0^2\tfrac16\,dx = \tfrac13\end{gathered}`},
            {k:'graph', plot:{x:[-0.5, 6.5], y:[0, 0.25], xlab:'x', ylab:R`\rho(x)`, regions:[{x:[0, 2], lab:R`P = \tfrac13`}], ticks:[{x:0, lab:'0'}, {x:2, lab:'2'}, {x:4, lab:'4'}, {x:6, lab:'6'}]},
              f:x => (x >= 0 && x <= 6 ? 1 / 6 : 0), lab:R`\rho = \tfrac16`,
              cap:R`Die Gleichverteilung auf $[0, 6]$. Die markierte Fläche über $[0, 2]$ ist $P = \tfrac13$, so groß wie die Summe zweier Würfelbalken.`},
            {k:'physik', text:R`**Ausblick (Thema 1 und 3):** Diskret ist die Energiemessung im Kasten, $P_n = |c_n|^2$ mit $\sum_n|c_n|^2 = 1$. Kontinuierlich ist die Ortsmessung, $\rho = |\psi|^2$ mit $\int|\psi|^2dx = 1$.`}
          ],
          links:[
            {from:'worte', to:'matrix', rule:R`Bei einzelnen Werten jeden Wert mit seiner Wahrscheinlichkeit $P_n$ in eine Spalte schreiben und die Einträge im Bereich addieren.`},
            {from:'matrix', to:'formel', rule:R`Den Index $n$ durch die Variable $x$ ersetzen, $P_n$ durch $\rho(x)\,dx$ und die Summe $\sum_n$ durch das Integral $\int dx$.`},
            {from:'formel', to:'graph', rule:R`Die Dichte zeichnen und den Bereich von $a$ bis $b$ markieren; das Integral ist die Fläche darüber.`},
            {from:'graph', to:'physik', rule:R`Fragen, ob die Messgröße einzelne Werte hat (Balken, Summe) oder ein Kontinuum (Kurve, Fläche). Energie im Kasten: Balken. Ort: Kurve.`}
          ]},
        q:{q:R`Bei einer diskreten Größe ist $P(X > 3) = \sum_{x_n > 3}P_n$. Wie lautet die Übersetzung für eine Größe mit der Dichte $\rho(x)$?`, tr:{from:'matrix', to:'formel'},
          opts:[R`$\sum_{x > 3}\rho(x)$, summiert über alle Werte über $3$`, R`$\int_3^\infty\rho(x)\,dx$`, R`$\rho(3)$, der Wert der Dichte an der Grenze`], a:1,
          ex:R`Die Summe wird zum Integral, $P_n$ zu $\rho(x)\,dx$. Gesucht ist also die Fläche unter $\rho$ rechts von $3$.`,
          fb:[R`Im Kontinuum hat jeder einzelne Wert die Wahrscheinlichkeit null. Werte von $\rho$ zu addieren ergibt keine Wahrscheinlichkeit; erst $\rho\,dx$ im Integral.`,
            '',
            R`$\rho(3)$ ist eine Dichte an einer Stelle, keine Fläche. Gefragt ist die ganze Wahrscheinlichkeit rechts von $3$.`]}},
      {id:'st-t2c', title:'Eine Dichte normieren',
        pre:{from:'m-analysis', seg:'ma-t4', title:'Integrale mit Exponentialfunktion', text:R`$\int_0^\infty e^{-\lambda x}\,dx = \left[-e^{-\lambda x}/\lambda\right]_0^\infty = 1/\lambda$ für $\lambda > 0$. Mini-Beispiel: $\int_0^\infty e^{-2x}\,dx = \tfrac12$.`},
        num:{title:R`$\rho(x) = A\,e^{-2x}$ für $x \ge 0$`, text:R`Aus $A\int_0^\infty e^{-2x}dx = A/2 = 1$ folgt $A = 2$. Ein Kern mit $\lambda = 0{,}1\,\mathrm{s}^{-1}$ „überlebt“ länger als $10\,\mathrm{s}$ mit der Wahrscheinlichkeit $\int_{10}^\infty\lambda e^{-\lambda t}dt = e^{-1} \approx 0{,}37$.`},
        text:R`Oft kennst du die Form einer Dichte nur bis auf einen Faktor, etwa $\rho(x) = A\,e^{-\lambda x}$ für $x \ge 0$ und $\rho = 0$ für $x < 0$. So ist zum Beispiel die Zeit bis zum Zerfall eines Kerns verteilt; dann steht $x$ für eine Zeit, und $\rho$ hat die Einheit $1/\text{Zeit}$. Den Faktor legt die Normierung fest. Die Herleitung ergibt $A = \lambda$.

Danach sind Flächen echte Wahrscheinlichkeiten. Zum Beispiel ist $P(x > b) = \int_b^\infty\lambda e^{-\lambda x}dx = e^{-\lambda b}$: Die Wahrscheinlichkeit, länger als $b$ zu überleben, fällt exponentiell. Ohne Normierung ist ein Integral über $\rho$ keine Wahrscheinlichkeit.`,
        derive:{ctx:{coords:['x'], domain:{x:['0', '∞']}, params:{λ:'pos'}, defs:{'ρ(x)':'A e^(-λ x)'}, unknowns:{A:{ref:'λ'}}},
          lines:[
            {l:'∫_0^∞ ρ(x) dx = 1', w:'Normierung; für x < 0 ist ρ = 0', why:{q:'Warum beginnt das Integral bei $0$?', opts:['Weil dort $\\rho = 0$ ist: Für $x < 0$ liegt keine Wahrscheinlichkeit.', 'Weil Integrale über negative $x$ immer negative Werte ergeben.', 'Weil $e^{-\\lambda x}$ für $x < 0$ gar nicht definiert ist.'], a:0, ex:'Die Dichte ist stückweise definiert. Der Bereich mit $\\rho = 0$ trägt nichts bei. $e^{-\\lambda x}$ wäre für $x < 0$ durchaus definiert – es würde dort sogar wachsen.'}},
            {l:'A ∫_0^∞ e^(-λ x) dx = 1', w:'konstanten Faktor vorgezogen'},
            {l:'A [-e^(-λ x)/λ]_0^∞ = 1', w:'Stammfunktion', why:{q:'Welchen Wert hat die eckige Klammer?', opts:['$1/\\lambda$: oben $0$, unten $-1/\\lambda$', '$-1/\\lambda$: nur die untere Grenze zählt', 'unendlich, wegen der oberen Grenze'], a:0, ex:'$e^{-\\lambda x}\\to 0$ für $x\\to\\infty$. Also $[\\dots]_0^\\infty = 0 - (-1/\\lambda) = 1/\\lambda$.'}},
            {l:'A/λ = 1', w:'Grenzen eingesetzt'},
            {l:'A = λ', w:'A hat die Einheit 1/Länge (für eine Zeit: 1/Zeit)', why:{q:'Wie prüfst du das Ergebnis an der Einheit?', opts:['$\\lambda x$ ist dimensionslos, also hat $\\lambda$ wie $\\rho$ die Einheit $1/\\text{Länge}$.', '$A$ muss dimensionslos sein, weil $P$ eine Zahl ist.', 'Eine Einheitenkontrolle ist hier nicht möglich.'], a:0, ex:'Im Exponenten steht eine reine Zahl. Damit passt $A = \\lambda$ zur Einheit einer Dichte.'}}
          ]},
        q:{q:R`Für die Dichte $\rho(x) = \lambda e^{-\lambda x}$ ($x \ge 0$): Wie groß ist $P(x > 1/\lambda)$?`,
          opts:[R`$1/2$`, R`$1 - 1/e \approx 0{,}63$`, R`$1/e \approx 0{,}37$`], a:2,
          ex:R`$P(x > b) = e^{-\lambda b}$ mit $b = 1/\lambda$ gibt $e^{-1}\approx 0{,}37$.`,
          fb:[R`Die Hälfte liegt rechts von $\ln 2/\lambda \approx 0{,}69/\lambda$, nicht rechts von $1/\lambda$.`,
            R`$1 - 1/e$ ist die Wahrscheinlichkeit für $x < 1/\lambda$, das Gegenteil.`,
            '']}},
      {id:'st-t2d', title:'Formel, Graph, Fläche, Histogramm: Tafel',
        num:{title:R`$\rho(x) = e^{-x}$`, text:R`$P(0{,}5 \le x \le 1{,}5) = e^{-0{,}5} - e^{-1{,}5} \approx 0{,}607 - 0{,}223 = 0{,}383$. Sehr viele Messwerte in Säulen der Breite $0{,}5$ geben die Höhen $0{,}79$, $0{,}48$, $0{,}29$, $0{,}18$, $0{,}11$: Anteil je Säule durch $0{,}5$.`},
        text:R`Die Tafel verbindet vier Darstellungen derselben Verteilung. Die Formel gibt $\rho(x)$ und rechnet Wahrscheinlichkeiten als Integral. Der Graph zeigt $\rho$ als Kurve; jede Wahrscheinlichkeit ist eine Fläche unter ihr. Das Histogramm aus sehr vielen Messwerten liegt als Treppe auf der Kurve, wenn du jede Säule durch ihre Breite teilst.

Im Labor dieses Themas stellst du mit zwei Reglern die Grenzen $a$ und $b$ ein. Die Fläche dazwischen wird blau gefüllt, und die Anzeige nennt ihren Wert $P$. Die Physik sagt, wo diese Dichten herkommen.`,
        reps:{obj:R`Die Dichte $\rho(x) = e^{-x}$ für $x \ge 0$`,
          rows:[
            {k:'formel', tex:R`\begin{gathered}P(0{,}5 \le x \le 1{,}5) = \int_{0{,}5}^{1{,}5}e^{-x}\,dx\\ = e^{-0{,}5} - e^{-1{,}5} \approx 0{,}38\end{gathered}`},
            {k:'graph', plot:{x:[0, 3], y:[0, 1.1], xlab:'x', ylab:'\\rho(x)', regions:[{x:[0.5, 1.5], lab:'P \\approx 0{,}38'}], ticks:[{x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}, {x:1.5, lab:'1{,}5'}, {x:2, lab:'2'}]}, f:x => Math.exp(-x), lab:R`\rho(x)`,
              f2:x => { const k = Math.min(5, Math.floor(x / 0.5)); return (Math.exp(-0.5 * k) - Math.exp(-0.5 * (k + 1))) / 0.5; }, lab2:R`\text{Histogramm}`,
              cap:R`Durchgezogen die Dichte, gestrichelt das Histogramm sehr vieler Werte, je Säule Anteil durch Breite. Die markierte Fläche ist $P(0{,}5 \le x \le 1{,}5)$.`},
            {k:'worte', text:R`Wo die Kurve hoch ist, liegen viele Werte dicht beieinander. Die Wahrscheinlichkeit für ein Intervall ist die Fläche darüber, nicht die Höhe.`},
            {k:'labor', text:R`Labor dieses Themas: Mit „untere Grenze a/L“ und „obere Grenze b/L“ wählst du das Intervall. Die blau gefüllte Fläche ist $P$; die Anzeige nennt „Wahrscheinlichkeit im Intervall“.`},
            {k:'physik', text:R`Ausblick: In der Quantenmechanik ist die Ortsdichte $\rho(x) = |\psi(x)|^2$ ([[lex:born|Bornsche Deutung]], Thema 1). Die Normierung $\int|\psi|^2dx = 1$ ist dieselbe Bedingung wie hier.`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`$\rho$ zeichnen und das Integrationsintervall markieren; das Integral ist die Fläche darüber.`},
            {from:'graph', to:'worte', rule:R`Fläche lesen, nicht Höhe: Eine hohe, schmale Spitze kann weniger Wahrscheinlichkeit tragen als ein flacher, breiter Bereich.`},
            {from:'worte', to:'labor', rule:R`Die Grenzen $a$ und $b$ auf das gesuchte Intervall stellen und die Anzeige ablesen.`},
            {from:'labor', to:'physik', rule:R`Die Laborkurven sind $|\psi|^2$; jede gefüllte Fläche ist die Wahrscheinlichkeit, das Teilchen dort zu finden.`}
          ]},
        q:{q:R`Im Labor stehen die Grenzen auf $a = 0{,}2\,L$ und $b = 0{,}5\,L$; die Anzeige nennt $P \approx 0{,}4$. Welche Rechnung steht dahinter?`, tr:{from:'labor', to:'formel'},
          opts:[R`$|\psi(0{,}5L)|^2 - |\psi(0{,}2L)|^2$`, R`$\int_{0{,}2L}^{0{,}5L}|\psi(x)|^2\,dx$`, R`$|\psi(0{,}35L)|^2$, der Wert in der Mitte`], a:1,
          ex:R`Die Wahrscheinlichkeit ist die Fläche unter $|\psi|^2$ zwischen den Grenzen.`,
          fb:[R`Das ist eine Differenz von Dichten, keine Fläche.`,
            '',
            R`Ein einzelner Wert der Dichte ist keine Wahrscheinlichkeit; erst mal einer Breite gibt er näherungsweise eine Fläche.`]}},
      {id:'st-t2e', title:'Typischer Fehler: die Dichte als Wahrscheinlichkeit lesen',
        num:{title:'Eine hohe Spitze', text:R`Im Labor erreicht die Dichte der Überlagerung etwa $3{,}1/L$. Das ist keine Wahrscheinlichkeit von $310\,\%$. In einem Intervall der Breite $0{,}01\,L$ um das Maximum liegt nur $P \approx 3{,}1\cdot 0{,}01 = 0{,}031$.`},
        text:R`Ein verbreiteter Fehler lautet: „$\rho(x_0)$ ist die Wahrscheinlichkeit, das Teilchen bei $x_0$ zu finden.“ Nein: $\rho$ hat die Einheit $1/\text{Länge}$ und darf größer als 1 sein. Liegt fast die ganze Wahrscheinlichkeit in einem Intervall der Breite $0{,}1\,\mathrm{nm}$, ist $\rho$ dort etwa $10\,\mathrm{nm}^{-1}$. Erst $\rho(x_0)\,\Delta x$ für ein kleines Intervall ist näherungsweise eine Wahrscheinlichkeit.

Im Bild daneben ist die dicke blaue Kurve $\rho = |\psi|^2$, gestrichelt $\psi$ selbst. Die senkrechte Achse zeigt $|\psi|^2\cdot L$: Werte über 1 sind erlaubt. Die blau gefüllte Fläche zwischen den Grenzen ist die Wahrscheinlichkeit; sie bleibt immer höchstens 1.`,
        fig:{lab:'prob', init:{f:'sup', a:0.25, b:0.35}, keep:['Wellenfunktion', 'untere', 'obere'], caption:'Die Fläche unter $\\rho = |\\psi|^2$ zwischen den Grenzen ist die Wahrscheinlichkeit. Beachte die Achse: Die Dichte erreicht Werte um $3/L$, die Flächen bleiben trotzdem höchstens 1.'},
        q:{q:R`Eine Ortsdichte hat bei $x_0$ den Wert $\rho(x_0) = 4\,\mathrm{nm}^{-1}$. Was folgt daraus?`,
          opts:[R`Die Dichte ist falsch, denn $P \le 1$.`, R`Bei $x_0$ wird das Teilchen sicher gefunden.`, R`Für kleine $\Delta x$ ist $P \approx 4\,\mathrm{nm}^{-1}\cdot\Delta x$.`], a:2,
          ex:R`$\rho$ ist Wahrscheinlichkeit pro Länge. Für $\Delta x = 0{,}01\,\mathrm{nm}$ ist $P \approx 0{,}04$.`,
          fb:[R`Eine Dichte darf größer als 1 sein. Nur Flächen müssen höchstens 1 sein.`,
            R`Ein einzelner Punkt hat bei einer Dichte die Wahrscheinlichkeit null.`,
            '']}}
    ]},

    /* ===== Abschnitt 3: Erwartungswert, Schwerpunkt, Momente ===== */
    {id:'st-t3', title:'Erwartungswert und Momente', steps:[
      {id:'st-t3a', title:'Der Mittelwert sehr vieler Messungen',
        num:{title:'Der Würfel', text:R`Jede Augenzahl kommt mit $\tfrac16$ vor. Der Mittelwert sehr vieler Würfe nähert sich

$$\begin{aligned}\langle x\rangle &= 1\cdot\tfrac16 + 2\cdot\tfrac16 + \dots + 6\cdot\tfrac16\\ &= \tfrac{21}{6} = 3{,}5.\end{aligned}$$

Niemand würfelt $3{,}5$.`},
        text:R`Wiederholst du ein Experiment sehr oft und bildest den Durchschnitt aller Ergebnisse, nähert er sich dem [[lex:erwartungswert|Erwartungswert]]

$$\langle x\rangle = \sum_n x_n\,P_n,$$

gelesen „Erwartungswert von x“. Jeder Wert wird mit seiner Wahrscheinlichkeit gewichtet. In der Mathematik schreibt man meist $E[X]$, in der Physik $\langle x\rangle$.

Das Beispiel zeigt gleich die wichtigste Eigenschaft: Der Erwartungswert muss kein möglicher Messwert sein. Er ist ein Mittel über viele Messungen, keine Vorhersage für eine einzelne.`,
        q:{q:R`Eine Zufallsgröße nimmt die Werte $0$ und $10$ mit $P = 0{,}9$ bzw. $0{,}1$ an. Wie groß ist $\langle x\rangle$?`,
          opts:[R`$5$`, R`$1$`, R`$0$`], a:1,
          ex:R`$\langle x\rangle = 0\cdot 0{,}9 + 10\cdot 0{,}1 = 1$. Der Wert $1$ kommt selbst nie vor.`,
          fb:[R`$5$ ist das ungewichtete Mittel der Werte. Hier ist $0$ aber neunmal so wahrscheinlich wie $10$.`,
            '',
            R`$0$ ist der wahrscheinlichste Wert, nicht der Mittelwert.`]}},
      {id:'st-t3b', title:'Kontinuierlich: der Schwerpunkt',
        pre:{from:'m-spezial', seg:'ms-t2', title:'Ein mittlerer Abstand', text:R`Beim Wasserstoff-Grundzustand mit der radialen Dichte $P(r)$ ist der mittlere Abstand $\int_0^\infty r\,P(r)\,dr = \tfrac32a$. Jeder Abstand wird mit seiner Dichte gewichtet.`},
        num:{title:R`$\rho(x) = 2x$ auf $[0, 1]$`, text:R`$$\langle x\rangle = \int_0^1 x\cdot 2x\,dx = \left[\tfrac23x^3\right]_0^1 = \tfrac23.$$

Die Dichte ist rechts größer, also liegt der Mittelwert rechts von der Mitte $\tfrac12$.`},
        text:R`Für eine Dichte wird aus der Summe ein Integral:

$$\langle x\rangle = \int x\,\rho(x)\,dx.$$

Jeder Ort $x$ wird mit $\rho(x)\,dx$ gewichtet. Anschaulich ist $\langle x\rangle$ der **Schwerpunkt**. Denk dir $\rho$ als Massenverteilung auf einem Stab: Er balanciert genau bei $\langle x\rangle$. Daraus folgt eine Abkürzung. Ist $\rho$ symmetrisch um eine Stelle $x_0$, dann ist $\langle x\rangle = x_0$, ohne Rechnung. Die Beiträge links und rechts heben sich auf.`,
        q:{q:R`Wo liegt $\langle x\rangle$ für $\rho(x) = 3x^2$ auf $[0, 1]$?`,
          opts:[R`bei $\tfrac34$`, R`bei $\tfrac12$`, R`bei $\tfrac23$`], a:0,
          ex:R`$\int_0^1x\cdot 3x^2\,dx = \tfrac34$. Die Dichte drängt noch stärker nach rechts als $2x$.`,
          fb:['',
            R`$\tfrac12$ wäre richtig für eine symmetrische Dichte. $3x^2$ ist rechts viel größer.`,
            R`$\tfrac23$ gehört zu $\rho = 2x$. Für $3x^2$ liegt der Schwerpunkt weiter rechts.`]}},
      {id:'st-t3c', title:'Ein Erwartungswert durch partielle Integration',
        pre:{from:'m-analysis', seg:'ma-t4', title:'Partielle Integration', text:R`$\int_a^b u\,v'\,dx = [u\,v]_a^b - \int_a^b u'\,v\,dx$. Sie lohnt sich, wenn $u$ beim Ableiten einfacher wird. Mini-Beispiel: $\int_0^\infty x\,e^{-x}dx = [-xe^{-x}]_0^\infty + \int_0^\infty e^{-x}dx = 1$.`},
        num:{title:'Zerfallszeiten', text:R`Mit $\lambda = 2$ ist $\langle x\rangle = 1/\lambda = 0{,}5$. Für Zerfallszeiten mit $\lambda = 0{,}1\,\mathrm{s}^{-1}$ ist die mittlere Lebensdauer $1/\lambda = 10\,\mathrm{s}$.`},
        text:R`Für die Dichte $\lambda e^{-\lambda x}$ aus Abschnitt 2 rechnet die Herleitung den Erwartungswert aus. Im Integranden steht $x$ mal einer Exponentialfunktion. Partielle Integration macht aus dem Faktor $x$ eine $1$. Der Randterm verschwindet an beiden Grenzen, und es bleibt das Normierungsintegral.

Das Ergebnis ist $\langle x\rangle = 1/\lambda$. Bei radioaktiven Kernen heißt diese Zahl **mittlere Lebensdauer**. Großes $\lambda$ heißt schneller Zerfall und kurze Lebensdauer. Prüfe die Einheit: $\lambda$ hat die Einheit $1/\text{Zeit}$, also $1/\lambda$ die Einheit einer Zeit.`,
        derive:{ctx:EXPO,
          lines:[
            {l:'⟨x⟩ = ∫_0^∞ x ρ(x) dx', w:'Definition'},
            {l:'= ∫_0^∞ x λ e^(-λ x) dx', w:'Dichte eingesetzt'},
            {l:'= [-x e^(-λ x)]_0^∞ + ∫_0^∞ e^(-λ x) dx', w:'partielle Integration', why:{q:'Wie wurde hier partiell integriert?', opts:['$u = x$ und $v\' = \\lambda e^{-\\lambda x}$, also $v = -e^{-\\lambda x}$', '$u = \\lambda e^{-\\lambda x}$ und $v\' = x$, also $v = x^2/2$', 'gar nicht: Das ist die Kettenregel.'], a:0, ex:'$\\int uv\' = [uv] - \\int u\'v$ mit $u\' = 1$ lässt nur $\\int e^{-\\lambda x}dx$ übrig. Die andere Wahl macht das Integral schwerer.'}},
            {l:'= 0 + 1/λ', w:'Randterm null, Integral 1/λ', why:{q:'Warum ist der Randterm null?', opts:['$x e^{-\\lambda x}$ verschwindet bei $0$ und für $x\\to\\infty$.', 'Randterme sind bei Dichten immer null.', 'Weil $\\rho(0) = 0$ ist.'], a:0, ex:'Bei $x = 0$ steht der Faktor $x = 0$; für $x\\to\\infty$ gewinnt die Exponentialfunktion gegen jede Potenz. Achtung: $\\rho(0) = \\lambda$ ist nicht null.'}},
            {l:'= 1/λ', w:'mittlere Lebensdauer'}
          ]},
        q:{q:R`Zerfallszeiten haben die Dichte $\lambda e^{-\lambda t}$ mit $\lambda = 0{,}02\,\mathrm{s}^{-1}$. Wie lange wartet man im Mittel auf einen Zerfall?`,
          opts:[R`$0{,}02\,\mathrm s$`, R`$1\,\mathrm s$`, R`$50\,\mathrm s$`], a:2,
          ex:R`$\langle t\rangle = 1/\lambda = 1/(0{,}02\,\mathrm{s}^{-1}) = 50\,\mathrm s$.`,
          fb:[R`$\lambda$ hat die Einheit $1/\text{Zeit}$. Die mittlere Zeit ist der Kehrwert $1/\lambda$.`,
            R`$1$ ist die Fläche unter der Dichte, nicht ihr Mittelwert.`,
            '']}},
      {id:'st-t3d', title:'Erwartungswert als Schwerpunkt: Tafel',
        num:{title:R`Links und rechts von $\langle x\rangle$`, text:R`Für $\rho = 2x$ liegt links von $\langle x\rangle = \tfrac23$ die Fläche $\left(\tfrac23\right)^2 = \tfrac49 \approx 0{,}44$, rechts $0{,}56$. Der Schwerpunkt teilt die Wahrscheinlichkeit nicht in zwei Hälften: Die Werte links liegen weiter von ihm entfernt und wiegen deshalb mehr.`},
        text:R`Die Tafel zeigt den Erwartungswert als Formel, als Markierung im Graphen, in Worten als Schwerpunkt, im Labor als rote Linie und in der Physik als Mittel vieler Ortsmessungen.

Achte im Graphen auf eine Feinheit. Der Schwerpunkt balanciert Fläche mal Hebelarm, nicht Fläche allein. Bei einer unsymmetrischen Dichte liegt deshalb links und rechts von $\langle x\rangle$ nicht gleich viel Wahrscheinlichkeit. Die Stelle, die die Fläche halbiert, heißt anders; sie kommt zwei Schritte weiter.`,
        reps:{obj:R`Der Erwartungswert der Dichte $\rho(x) = 2x$ auf $[0, 1]$`,
          rows:[
            {k:'formel', tex:R`\langle x\rangle = \int_0^1 x\cdot 2x\,dx = \tfrac23`},
            {k:'graph', plot:{x:[0, 1], y:[0, 2.2], xlab:'x', ylab:'\\rho(x)', ticks:[{x:2 / 3, lab:'\\langle x\\rangle'}, {x:0.5, lab:'1/2'}]}, f:x => 2 * x, lab:R`\rho = 2x`,
              cap:R`Die Markierung $\langle x\rangle = \tfrac23$ liegt rechts der Mitte, dort, wo ein Stab mit dieser Massenverteilung balanciert.`},
            {k:'worte', text:R`Der Schwerpunkt der Verteilung: Werte mit großer Dichte und großem Abstand ziehen ihn zu sich.`},
            {k:'labor', text:R`Labor dieses Themas: Die rote, senkrechte Linie $\langle x\rangle$ markiert den Erwartungswert der gewählten Dichte.`},
            {k:'physik', text:R`Ausblick: $\langle x\rangle = \int x\,|\psi|^2dx$ ist der Mittelwert vieler Ortsmessungen an gleich präparierten Systemen (Thema 1).`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Das Integral ausrechnen und den Wert auf der $x$-Achse markieren.`},
            {from:'graph', to:'worte', rule:R`Prüfen, ob die Markierung dort liegt, wo die Kurve als Massenverteilung balancieren würde.`},
            {from:'worte', to:'labor', rule:R`Im Labor eine Dichte wählen und die rote Linie mit deiner Schwerpunkt-Schätzung vergleichen.`},
            {from:'labor', to:'physik', rule:R`Die rote Linie ist der Mittelwert vieler Ortsmessungen; einzelne Messwerte streuen um sie.`}
          ]},
        q:{q:R`Eine Dichte auf $[0, 1]$ fällt linear von links nach rechts ab, $\rho(x) = 2(1 - x)$. Wo liegt $\langle x\rangle$?`, tr:{from:'graph', to:'formel'},
          opts:[R`bei $\tfrac12$`, R`bei $\tfrac13$`, R`bei $\tfrac23$`], a:1,
          ex:R`Das Spiegelbild von $\rho = 2x$: $\int_0^1x\cdot 2(1 - x)\,dx = 1 - \tfrac23 = \tfrac13$.`,
          fb:[R`Die Dichte ist nicht symmetrisch; links liegt mehr. Der Schwerpunkt rückt nach links.`,
            '',
            R`$\tfrac23$ gehört zur steigenden Dichte $2x$. Hier fällt sie, der Schwerpunkt liegt gespiegelt bei $\tfrac13$.`]}},
      {id:'st-t3e', title:R`Funktionen und Momente: $\langle x^2\rangle \ne \langle x\rangle^2$`,
        num:{title:'Der Würfel noch einmal', text:R`$$\begin{aligned}\langle x^2\rangle &= \tfrac16(1 + 4 + 9 + 16 + 25 + 36)\\ &= \tfrac{91}{6} \approx 15{,}17,\end{aligned}$$

aber $\langle x\rangle^2 = 3{,}5^2 = 12{,}25$. Die beiden unterscheiden sich deutlich.`},
        text:R`Für eine Funktion $f$ gilt entsprechend $\langle f(x)\rangle = \int f(x)\,\rho(x)\,dx$ bzw. $\sum_n f(x_n)P_n$. Daraus folgt die **Linearität**

$$\langle a\,x + b\rangle = a\,\langle x\rangle + b,$$

denn das Integral ist linear und $\int\rho\,dx = 1$. Aber Vorsicht: Für nichtlineare Funktionen gilt das nicht. Im Allgemeinen ist $\langle x^2\rangle \ne \langle x\rangle^2$, wie das Beispiel zeigt.

Die Größen $\langle x^n\rangle$ heißen [[lex:stat-momente|Momente]]. Das erste Moment beschreibt die Lage, das zweite zusammen mit dem ersten die Breite (Abschnitt 4). Höhere Momente beschreiben Schiefe und Ränder.`,
        q:{q:'Welche Aussage gilt für jede Verteilung?',
          opts:[R`$\langle x^2\rangle = \langle x\rangle^2$`, R`$\langle 3x + 2\rangle = 3\langle x\rangle + 2$`, R`$\langle x\rangle$ ist der häufigste Wert.`], a:1,
          ex:R`Die Linearität folgt aus der Linearität des Integrals und $\int\rho\,dx = 1$. Die beiden anderen Aussagen gelten nur in Sonderfällen.`,
          fb:[R`Beim Würfel ist $\langle x^2\rangle \approx 15{,}2$, aber $\langle x\rangle^2 = 12{,}25$.`,
            '',
            R`Bei $\lambda e^{-\lambda x}$ ist der häufigste Wert $0$, der Erwartungswert $1/\lambda$.`]}},
      {id:'st-t3f', title:'Andere Mitten: Maximum und Median',
        num:{title:R`Die Dichte $\lambda e^{-\lambda x}$`, text:R`Das Maximum liegt bei $x = 0$. Der Median $m$ teilt die Fläche: $1 - e^{-\lambda m} = \tfrac12$ gibt $m = \ln 2/\lambda \approx 0{,}69/\lambda$. Der Erwartungswert ist $1/\lambda$. Links von ihm liegt $1 - e^{-1} \approx 63\,\%$.`},
        text:R`Es gibt mehrere „Mitten“ einer Verteilung. Der **wahrscheinlichste Wert** ist die Stelle, an der $\rho$ maximal ist. Der **Median** ist die Stelle, links und rechts von der je die Hälfte der Wahrscheinlichkeit liegt. Der Erwartungswert ist der Schwerpunkt.

Bei symmetrischen Dichten mit einem einzigen Gipfel fallen alle drei zusammen. Bei unsymmetrischen Dichten liegen sie im Allgemeinen an verschiedenen Stellen, wie im Beispiel: $0 < 0{,}69/\lambda < 1/\lambda$. Welche Mitte gemeint ist, hängt von der Frage ab. Für Mittelwerte vieler Messungen ist es immer der Erwartungswert.`,
        q:{q:R`Für $\rho = 2x$ auf $[0, 1]$: Wo liegt der Median?`,
          opts:[R`bei $\tfrac23$, dem Erwartungswert`, R`bei $1/\sqrt2 \approx 0{,}71$`, R`bei $\tfrac12$, der Mitte des Intervalls`], a:1,
          ex:R`$\int_0^m 2x\,dx = m^2 = \tfrac12$ gibt $m = 1/\sqrt2 \approx 0{,}71$. Er liegt rechts vom Erwartungswert $\tfrac23$.`,
          fb:[R`$\tfrac23$ ist der Erwartungswert. Links davon liegt nur $\tfrac49$, nicht die Hälfte.`,
            '',
            R`$\tfrac12$ ist die Mitte des Intervalls. Links davon liegt bei $\rho = 2x$ nur ein Viertel.`]}},
      {id:'st-t3g', title:'Typischer Fehler: der Erwartungswert als Einzelergebnis',
        num:{title:'Zwei Messwerte', text:R`Eine Größe nimmt $1$ oder $3$ an, je mit $\tfrac12$. Ihr Erwartungswert ist $\langle x\rangle = 2$. Eine einzelne Messung liefert nie $2$, sondern immer $1$ oder $3$.`},
        text:R`Ein häufiger Fehler ist, den Erwartungswert für das Ergebnis einer einzelnen Messung zu halten. Er ist aber der Mittelwert vieler Messungen. Bei diskreten Größen liegt er oft zwischen den möglichen Werten und kommt selbst nie vor.

In der Quantenmechanik ist das besonders wichtig (Ausblick auf Thema 3 und Thema 6). Ist ein Teilchen im Zustand $(\psi_1 + \psi_2)/\sqrt2$, liefert eine Energiemessung immer $E_1$ oder $E_2$, nie $\langle E\rangle = (E_1 + E_2)/2$. Ebenso ist $\langle x\rangle = \int x\,|\psi|^2dx$ der Mittelwert vieler Ortsmessungen an gleich präparierten Systemen, nicht der Ort eines einzelnen Teilchens.`,
        q:{q:R`Eine Energiemessung liefert $1\,\mathrm{eV}$ oder $4\,\mathrm{eV}$, je mit $\tfrac12$. Welcher Wert kommt bei einer einzelnen Messung nie heraus?`,
          opts:[R`$1\,\mathrm{eV}$`, R`$4\,\mathrm{eV}$`, R`$2{,}5\,\mathrm{eV}$`], a:2,
          ex:R`$2{,}5\,\mathrm{eV}$ ist der Erwartungswert. Einzelne Messungen liefern nur die möglichen Werte $1$ oder $4\,\mathrm{eV}$.`,
          fb:[R`$1\,\mathrm{eV}$ kommt mit der Wahrscheinlichkeit $\tfrac12$ vor.`,
            R`$4\,\mathrm{eV}$ kommt mit der Wahrscheinlichkeit $\tfrac12$ vor.`,
            '']}}
    ]},

    /* ===== Abschnitt 4: Varianz und Standardabweichung ===== */
    {id:'st-t4', title:'Varianz und Standardabweichung', steps:[
      {id:'st-t4a', title:'Ein Maß für die Breite',
        num:{title:'Gleiche Mitte, verschiedene Breite', text:R`$A$ nimmt $4$ oder $6$ an, $B$ nimmt $2$ oder $8$ an, je mit $\tfrac12$. Beide haben $\langle x\rangle = 5$. Bei $A$ liegt jeder Wert $1$ vom Mittel entfernt, bei $B$ jeder $3$. Die mittlere quadratische Abweichung ist $1$ bzw.

$$\tfrac12(2 - 5)^2 + \tfrac12(8 - 5)^2 = 9.$$`},
        text:R`Zwei Verteilungen können denselben Erwartungswert haben und trotzdem ganz verschieden aussehen. Gesucht ist ein Maß für die **Breite**. Der mittlere Abstand vom Erwartungswert mit Betrag rechnet sich schlecht. Man nimmt deshalb die mittlere quadratische Abweichung, die [[lex:stat-varianz|Varianz]]

$$(\Delta x)^2 = \langle(x - \langle x\rangle)^2\rangle,$$

und ihre Wurzel, die **Standardabweichung** $\Delta x$, gelesen „Delta x“. In der Statistik heißt sie meist $\sigma$. $\Delta x$ hat dieselbe Einheit wie $x$ und ist ein typischer Abstand der Werte vom Erwartungswert. Im Beispiel ist $\Delta x = 1$ für $A$ und $3$ für $B$.`,
        q:{q:R`Eine Größe nimmt $0$ mit $P = 0{,}9$ und $10$ mit $P = 0{,}1$ an; es ist $\langle x\rangle = 1$. Wie groß ist $\Delta x$?`,
          opts:[R`$9$`, R`$3$`, R`$1$`], a:1,
          ex:R`$(\Delta x)^2 = 0{,}9\cdot(0 - 1)^2 + 0{,}1\cdot(10 - 1)^2 = 0{,}9 + 8{,}1 = 9$, also $\Delta x = 3$.`,
          fb:[R`$9$ ist die Varianz. Die Standardabweichung ist ihre Wurzel.`,
            '',
            R`$1$ ist der Erwartungswert, nicht die Breite.`]}},
      {id:'st-t4b', title:R`Die Rechenformel $\langle x^2\rangle - \langle x\rangle^2$`,
        num:{title:R`Noch einmal $B$`, text:R`$\langle x^2\rangle = \tfrac12(4 + 64) = 34$, also $(\Delta x)^2 = 34 - 5^2 = 9$, wie vorher. Für die Dichte $\lambda e^{-\lambda x}$ ist $\langle x^2\rangle = 2/\lambda^2$ und damit $(\Delta x)^2 = 2/\lambda^2 - 1/\lambda^2$, also $\Delta x = 1/\lambda$.`},
        text:R`Zum Rechnen ist eine zweite Form bequemer. Die Herleitung multipliziert die Klammer aus und benutzt die Linearität:

$$(\Delta x)^2 = \langle x^2\rangle - \langle x\rangle^2.$$

Du brauchst also nur die ersten beiden Momente. Weil eine Varianz nie negativ ist, folgt $\langle x^2\rangle \ge \langle x\rangle^2$. Gleichheit gilt nur, wenn die Größe mit Wahrscheinlichkeit 1 einen einzigen Wert hat. Bei der Dichte $\lambda e^{-\lambda x}$ ist die Standardabweichung genauso groß wie der Erwartungswert, $1/\lambda$.`,
        derive:{ctx:ANY,
          lines:[
            {l:'(Δx)^2 = ⟨(x - ⟨x⟩)^2⟩', w:'Definition der Varianz'},
            {l:'= ⟨x^2 - 2⟨x⟩ x + ⟨x⟩^2⟩', w:'Klammer ausmultipliziert', why:{q:'Was ist $\\langle x\\rangle$ in dieser Klammer?', opts:['eine feste Zahl, keine Zufallsgröße', 'eine zweite, unabhängige Zufallsgröße', 'eine Funktion, die von $x$ abhängt'], a:0, ex:'$\\langle x\\rangle$ ist schon über die Verteilung gemittelt. Unter einem zweiten Mittelwert verhält es sich wie eine Konstante.'}},
            {l:'= ⟨x^2⟩ - 2⟨x⟩ ⟨x⟩ + ⟨x⟩^2', w:'Linearität, ⟨c⟩ = c', why:{q:'Warum wird $\\langle\\langle x\\rangle^2\\rangle$ zu $\\langle x\\rangle^2$?', opts:['$\\langle c\\rangle = c\\int\\rho\\,dx = c$ wegen der Normierung', 'Man darf Mittelwerte beliebig ins Quadrat ziehen.', 'weil $\\langle x\\rangle = 0$ angenommen wird'], a:0, ex:'Für eine Konstante $c$ ist $\\langle c\\rangle = \\int c\\,\\rho\\,dx = c$. Ohne Normierung stünde hier $c\\int\\rho\\,dx$.'}},
            {l:'= ⟨x^2⟩ - ⟨x⟩^2', w:'zusammengefasst'}
          ]},
        q:{q:R`Eine Verteilung hat $\langle x\rangle = 2$ und $\langle x^2\rangle = 13$. Wie groß ist $\Delta x$?`,
          opts:[R`$9$`, R`$\sqrt{13}$`, R`$3$`], a:2,
          ex:R`$(\Delta x)^2 = 13 - 2^2 = 9$, also $\Delta x = 3$.`,
          fb:[R`$9$ ist die Varianz. Die Standardabweichung ist ihre Wurzel.`,
            R`$\sqrt{13}$ wäre $\sqrt{\langle x^2\rangle}$. Es fehlt $-\langle x\rangle^2$.`,
            '']}},
      {id:'st-t4c', title:'Streuung als Breite: Tafel',
        num:{title:'Zwei Dichten mit derselben Mitte', text:R`$\rho = 6x(1 - x)$ auf $[0, 1]$ hat $\langle x\rangle = \tfrac12$ und $\Delta x = \sqrt{1/20} \approx 0{,}22$. Im Streifen $\langle x\rangle \pm \Delta x$ liegt etwa $63\,\%$. Die Gleichverteilung $\rho = 1$ hat $\Delta x = 1/\sqrt{12} \approx 0{,}29$ und im Streifen $58\,\%$.`},
        text:R`Die Tafel verbindet die Standardabweichung mit dem Bild. Im Graphen ist $\Delta x$ eine Breite: Der Streifen $\langle x\rangle \pm \Delta x$ umfasst den Kern der Verteilung. Eine schmale, hohe Dichte hat ein kleines $\Delta x$, eine flache, breite ein großes.

Im Labor dieses Themas ist dieser Streifen hell eingefärbt. Wechselst du die Dichte, ändert sich seine Breite. Wie viel Wahrscheinlichkeit im Streifen liegt, hängt von der Form ab: oft etwa zwei Drittel, aber nicht immer gleich viel.`,
        reps:{obj:R`Die Breite der Dichte $\rho(x) = 6x(1 - x)$`,
          rows:[
            {k:'formel', tex:R`\begin{gathered}\Delta x = \sqrt{\langle x^2\rangle - \langle x\rangle^2}\\ = \sqrt{\tfrac{3}{10} - \tfrac14} = \sqrt{\tfrac{1}{20}} \approx 0{,}22\end{gathered}`},
            {k:'graph', plot:{x:[0, 1], y:[0, 1.7], xlab:'x', ylab:'\\rho(x)', regions:[{x:[0.5 - Math.sqrt(0.05), 0.5 + Math.sqrt(0.05)], lab:'\\langle x\\rangle \\pm \\Delta x'}], ticks:[{x:0.5, lab:'\\langle x\\rangle'}]}, f:x => 6 * x * (1 - x), lab:R`$6x(1 - x)$`, f2:() => 1, lab2:R`\rho = 1`,
              cap:R`Markiert ist der Streifen $\langle x\rangle \pm \Delta x$ der Parabel. Die Gleichverteilung (gestrichelt) hat dieselbe Mitte, ist aber breiter: $\Delta x \approx 0{,}29$.`},
            {k:'worte', text:R`Ein typischer Abstand der Werte vom Erwartungswert. Je flacher und breiter die Dichte, desto größer.`},
            {k:'labor', text:R`Labor dieses Themas: Der hell eingefärbte Streifen um die rote Linie reicht von $\langle x\rangle - \Delta x$ bis $\langle x\rangle + \Delta x$; die Anzeige nennt $\Delta x$.`},
            {k:'physik', text:R`Ausblick: In der Quantenmechanik ist $\Delta x$ die [[lex:unschaerfe|Unschärfe]] des Orts, eine Eigenschaft des Zustands (Thema 1).`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`$\Delta x$ ausrechnen und um $\langle x\rangle$ nach links und rechts abtragen.`},
            {from:'graph', to:'worte', rule:R`Den Streifen mit der Kurve vergleichen: Er umfasst den Bereich, in dem die meisten Werte liegen.`},
            {from:'worte', to:'labor', rule:R`Im Labor zwei Dichten wählen und die Breiten der hellen Streifen vergleichen.`},
            {from:'labor', to:'physik', rule:R`Der Streifen ist die Streuung vieler Ortsmessungen am selben Zustand, nicht die Ungenauigkeit eines Geräts.`}
          ]},
        q:{q:R`Im Labor reicht der helle Streifen für $\psi_1$ von $0{,}32\,L$ bis $0{,}68\,L$. Wie groß ist $\Delta x$?`, tr:{from:'labor', to:'formel'},
          opts:[R`$0{,}36\,L$`, R`$0{,}18\,L$`, R`$0{,}50\,L$`], a:1,
          ex:R`Der Streifen ist $\langle x\rangle \pm \Delta x$; seine halbe Breite ist $\Delta x = 0{,}18\,L$, seine Mitte $\langle x\rangle = 0{,}50\,L$.`,
          fb:[R`$0{,}36\,L$ ist die ganze Breite des Streifens, also $2\Delta x$.`,
            '',
            R`$0{,}50\,L$ ist die Mitte, also $\langle x\rangle$.`]}},
      {id:'st-t4d', title:'Verschieben und Strecken',
        num:{title:'Meter und Zentimeter', text:R`Messwerte mit $\Delta x = 0{,}02\,\mathrm m$ haben in Zentimetern $\Delta x = 2\,\mathrm{cm}$: Der Zahlenwert wird 100-mal so groß, die Varianz $10\,000$-mal. Verschiebst du alle Werte um $5\,\mathrm m$, bleibt $\Delta x$ gleich.`},
        text:R`Zwei Regeln folgen direkt aus der Definition. Verschieben ändert die Breite nicht:

$$\Delta(x + c) = \Delta x.$$

Denn auch $\langle x\rangle$ verschiebt sich um $c$, und die Abstände $x - \langle x\rangle$ bleiben gleich. Strecken skaliert sie: $\Delta(a\,x) = |a|\,\Delta x$. Denn alle Abstände werden mit $a$ multipliziert, ihre Quadrate mit $a^2$, und die Wurzel gibt $|a|$. Der Betrag sorgt dafür, dass $\Delta x$ nicht negativ wird, auch wenn man spiegelt.`,
        q:{q:'Alle Messwerte einer Größe werden in Zentimetern statt in Metern angegeben. Was passiert mit dem Zahlenwert von $\\Delta x$?',
          opts:['Er wird 100-mal so groß.', 'Er wird 10 000-mal so groß.', 'Er bleibt gleich.'], a:0,
          ex:R`$\Delta(a\,x) = |a|\,\Delta x$ mit $a = 100$. Die Varianz wächst um $a^2 = 10^4$, die Standardabweichung um $a$.`,
          fb:['',
            R`Um $10\,000$ wächst die Varianz. Die Standardabweichung ist ihre Wurzel.`,
            R`Gleich bleibt $\Delta x$ nur beim Verschieben, nicht beim Strecken.`]}},
      {id:'st-t4e', title:'Typischer Fehler: Streuung als Gerätefehler',
        num:{title:R`Zwei falsche Rechnungen`, text:R`Für $\lambda e^{-\lambda x}$ gibt $\sqrt{\langle x^2\rangle} = \sqrt2/\lambda \approx 1{,}41/\lambda$, aber $\Delta x = 1/\lambda$. Der Unterschied ist das fehlende $-\langle x\rangle^2$.`},
        text:R`Zwei Fehler sind häufig. Der erste ist rechnerisch: $\Delta x = \sqrt{\langle x^2\rangle}$ setzen. Dann fehlt $-\langle x\rangle^2$, und eine weit von null entfernte, schmale Verteilung bekäme ein riesiges $\Delta x$.

Der zweite betrifft die Deutung: „$\Delta x$ ist der Messfehler des Geräts.“ In der Quantenmechanik ist $\Delta x$ die Unschärfe, eine Eigenschaft des Zustands (Ausblick auf Thema 1). Auch ein ideales Gerät liefert an gleich präparierten Systemen Werte, die mit $\Delta x$ streuen. Die Heisenbergsche Relation $\Delta x\,\Delta p \ge \hbar/2$ ist eine Aussage über zwei solche Standardabweichungen (Thema 1, Thema 6).`,
        q:{q:'Ein idealer Detektor misst den Ort vieler gleich präparierter Elektronen. Die Werte streuen mit $0{,}2\\,\\mathrm{nm}$. Was folgt daraus?',
          opts:['Der Detektor hat einen Messfehler von $0{,}2\\,\\mathrm{nm}$.', 'Der Zustand hat $\\Delta x \\approx 0{,}2\\,\\mathrm{nm}$.', 'Mit mehr Messungen wird die Streuung kleiner.'], a:1,
          ex:'Bei einem idealen Detektor kommt die Streuung allein vom Zustand.',
          fb:['Ein idealer Detektor hat keinen Messfehler. Die Streuung gehört zum Zustand.',
            '',
            'Mehr Messungen bestimmen $\\Delta x$ genauer, machen es aber nicht kleiner (Abschnitt 7).']}}
    ]},

    /* ===== Abschnitt 5: Gauß-Verteilung ===== */
    {id:'st-t5', title:'Die Gauß-Verteilung', steps:[
      {id:'st-t5a', title:'Formel und Parameter',
        num:{title:R`$\mu = 10{,}0\,\mathrm{mm}$, $\sigma = 0{,}2\,\mathrm{mm}$`, text:R`Am Gipfel ist $\rho(\mu) = 1/(\sqrt{2\pi}\cdot 0{,}2\,\mathrm{mm}) \approx 2{,}0\,\mathrm{mm}^{-1}$. Bei $x = 10{,}2\,\mathrm{mm}$, also $\mu + \sigma$, ist die Dichte auf $e^{-1/2} \approx 61\,\%$ gefallen, $1{,}21\,\mathrm{mm}^{-1}$. Bei $\mu + 2\sigma$ ist sie $0{,}27\,\mathrm{mm}^{-1}$.`},
        text:R`Die wichtigste kontinuierliche Verteilung ist die [[lex:stat-gauss|Gauß-Verteilung]], auch Normalverteilung:

$$\rho(x) = \frac{1}{\sqrt{2\pi}\,\sigma}\,e^{-(x - \mu)^2/(2\sigma^2)}.$$

Sie hat zwei Parameter: die Lage $\mu$, gelesen „mü“, und die Breite $\sigma > 0$, gelesen „sigma“. Weil $\rho$ symmetrisch um $\mu$ ist, gilt $\langle x\rangle = \mu$. Der Vorfaktor sorgt für die Normierung: Wird die Kurve breiter, wird sie niedriger.

Im Bild daneben ist die blaue Kurve eine Gauß-Dichte mit $\mu = 0$. Du kennst sie aus M6 als $|\psi(x)|^2$ des Gauß-Pakets. Der Regler „Breite σ“ stellt $\sigma$ ein, und die Anzeige nennt $\Delta x = \sigma$; warum, zeigt der übernächste Schritt. Die rote Kurve ist das Spektrum aus M6 und spielt hier keine Rolle.`,
        fig:{lab:'fourier', init:{mode:'trafo', sg:1}, keep:['Breite σ'], caption:'Die blaue Kurve ist eine Gauß-Dichte mit $\\mu = 0$; der hell blaue Streifen reicht von $-\\sigma$ bis $\\sigma$. Mit „Breite σ“ ändern sich Breite und Höhe so, dass die Fläche 1 bleibt.'},
        q:{q:R`Eine Gauß-Dichte hat $\mu = 3$ und $\sigma = 0{,}5$. Wo ist sie auf $e^{-1/2}$ ihres Gipfelwerts gefallen?`,
          opts:[R`bei $x = 2{,}5$ und $x = 3{,}5$`, R`bei $x = 2$ und $x = 4$`, R`nur bei $x = 3{,}5$`], a:0,
          ex:R`$e^{-(x - \mu)^2/(2\sigma^2)} = e^{-1/2}$ verlangt $|x - \mu| = \sigma$, also $x = 3 \pm 0{,}5$.`,
          fb:['',
            R`Bei $\mu \pm 2\sigma$ ist die Dichte auf $e^{-2}$ gefallen, nicht auf $e^{-1/2}$.`,
            R`Die Dichte ist symmetrisch um $\mu$; dasselbe gilt links bei $x = 2{,}5$.`]}},
      {id:'st-t5b', title:'Die Normierung',
        pre:{from:'m-analysis', seg:'ma-t3', title:'Gauß-Integrale', text:R`$\int_{-\infty}^\infty e^{-\alpha u^2}du = \sqrt{\pi/\alpha}$ für $\alpha > 0$ und $\int_{-\infty}^\infty u^2e^{-\alpha u^2}du = \frac{1}{2\alpha}\sqrt{\pi/\alpha}$. Mini-Beispiel: $\alpha = \tfrac12$ gibt $\int e^{-u^2/2}du = \sqrt{2\pi}$.`},
        num:{title:R`$\sigma = 0{,}2\,\mathrm{mm}$`, text:R`Der Vorfaktor ist $1/(\sqrt{2\pi}\cdot 0{,}2) \approx 1{,}995\,\mathrm{mm}^{-1}$. Das Integral der Exponentialfunktion ist $\sqrt{2\pi}\cdot 0{,}2\,\mathrm{mm} \approx 0{,}501\,\mathrm{mm}$. Das Produkt ist $1$.`},
        text:R`Warum steht gerade $\sqrt{2\pi}\,\sigma$ im Nenner? Die Herleitung verschiebt zuerst die Variable, $u = x - \mu$. Dann bleibt ein [[lex:gauss-integral|Gauß-Integral]] mit $\alpha = 1/(2\sigma^2)$. Es ergibt $\sqrt{\pi/\alpha} = \sqrt{2\pi\sigma^2} = \sqrt{2\pi}\,\sigma$, genau den Kehrwert des Vorfaktors.

Daraus folgt eine Faustregel für jede Gauß-Funktion $A\,e^{-u^2/(2\sigma^2)}$: Die Fläche ist $A\sqrt{2\pi}\,\sigma$, Gipfelhöhe mal etwa $2{,}5\,\sigma$. Lies $\sigma$ immer aus dem Nenner im Exponenten ab, der $2\sigma^2$ heißt.`,
        derive:{ctx:GAUSS,
          lines:[
            {l:'∫_-∞^∞ ρ(x) dx = 1/(sqrt(2π) σ) ∫_-∞^∞ e^(-u^2/(2σ^2)) du', w:'u = x − μ', why:{q:'Warum ändern sich die Grenzen bei $u = x - \\mu$ nicht?', opts:['weil $x\\to\\pm\\infty$ auch $u\\to\\pm\\infty$ heißt', 'weil man $\\mu = 0$ wählen darf', 'weil der Integrand gerade ist'], a:0, ex:'Eine Verschiebung bildet $(-\\infty, \\infty)$ auf sich ab, und $du = dx$. Bei endlichen Grenzen müsste man sie mitverschieben.'}},
            {l:'= 1/(sqrt(2π) σ) sqrt(2π σ^2)', w:'Gauß-Integral', why:{q:'Welche Regel steckt hier?', opts:['$\\int e^{-\\alpha u^2}du = \\sqrt{\\pi/\\alpha}$ mit $\\alpha = 1/(2\\sigma^2)$', '$\\int e^{-\\alpha u^2}du = 1/\\alpha$ mit $\\alpha = 1/(2\\sigma^2)$', '$\\int e^{-\\alpha u^2}du = \\sqrt{\\alpha\\pi}$ mit $\\alpha = 2\\sigma^2$'], a:0, ex:'$\\sqrt{\\pi\\cdot 2\\sigma^2} = \\sqrt{2\\pi}\\,\\sigma$ ist genau der Kehrwert des Vorfaktors.'}},
            {l:'= 1', w:'normiert'}
          ]},
        q:{q:R`Welcher Faktor $A$ normiert $\rho(x) = A\,e^{-x^2/8}$?`,
          opts:[R`$\frac{1}{\sqrt{2\pi}}$`, R`$\frac{1}{8\sqrt{2\pi}}$`, R`$\frac{1}{\sqrt{8\pi}}$`], a:2,
          ex:R`$2\sigma^2 = 8$ gibt $\sigma = 2$, also $A = 1/(\sqrt{2\pi}\cdot 2) = 1/\sqrt{8\pi}$.`,
          fb:[R`Das wäre richtig für $\sigma = 1$. Hier ist $2\sigma^2 = 8$, also $\sigma = 2$.`,
            R`Hier wurde $2\sigma^2 = 8$ für $\sigma$ gehalten. $\sigma$ ist die Wurzel aus $8/2$.`,
            '']}},
      {id:'st-t5c', title:R`$\sigma$ ist die Standardabweichung`,
        num:{title:'Zahlen aus dem Beispiel', text:R`Für $\mu = 10{,}0\,\mathrm{mm}$ und $\sigma = 0{,}2\,\mathrm{mm}$ ist $\langle x\rangle = 10{,}0\,\mathrm{mm}$ und $\Delta x = 0{,}2\,\mathrm{mm}$. Das zweite Moment ist $\langle x^2\rangle = \mu^2 + \sigma^2 = 100{,}04\,\mathrm{mm}^2$.`},
        text:R`Die Herleitung zeigt: Der Parameter $\sigma$ *ist* die Standardabweichung. Sie rechnet $(\Delta x)^2$ direkt um die Mitte aus, denn $\langle x\rangle = \mu$ ist wegen der Symmetrie schon bekannt. Nach der Verschiebung $u = x - \mu$ bleibt ein Gauß-Integral mit $u^2$ im Integranden. Sein Faktor $\frac{1}{2\alpha}$ ist genau $\sigma^2$.

Die Formel der Gauß-Dichte enthält also schon beide Kennzahlen: $\mu$ als Erwartungswert und $\sigma$ als Standardabweichung. Du kannst $\langle x\rangle$ und $\Delta x$ ohne Rechnung aus dem Exponenten ablesen.`,
        derive:{ctx:GAUSS,
          lines:[
            {l:'(Δx)^2 = ∫_-∞^∞ (x - μ)^2 ρ(x) dx', w:'⟨x⟩ = μ wegen der Symmetrie'},
            {l:'= 1/(sqrt(2π) σ) ∫_-∞^∞ u^2 e^(-u^2/(2σ^2)) du', w:'u = x − μ', why:{q:R`Was wird bei $u = x - \mu$ aus $(x - \mu)^2$?`, opts:[R`$u^2$; die Grenzen bleiben $\pm\infty$.`, R`$u^2 - \mu^2$, mit neuen Grenzen`, R`$u$, weil die Wurzel gezogen wird`], a:0, ex:R`$x - \mu = u$ und $dx = du$. Eine Verschiebung ändert die unendlichen Grenzen nicht.`}},
            {l:'= 1/(sqrt(2π) σ) · σ^2 sqrt(2π σ^2)', w:'Gauß-Integral mit u²', why:{q:'Woher kommt der Faktor $\\sigma^2$?', opts:['aus $\\int u^2e^{-\\alpha u^2}du = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\frac{1}{2\\alpha} = \\sigma^2$', 'aus $u^2 \\approx \\sigma^2$ im Mittel, ohne Rechnung', 'aus der Normierung von $\\rho$ in Zeile 3'], a:0, ex:'Mit $\\alpha = 1/(2\\sigma^2)$ ist $\\frac{1}{2\\alpha} = \\sigma^2$. Der Rest ist wieder das Normierungsintegral.'}},
            {l:'= σ^2', w:'Vorfaktor gekürzt'}
          ]},
        q:{q:R`Eine Dichte ist $\rho(x) \propto e^{-(x - 1)^2/18}$. Wie groß ist $\Delta x$?`,
          opts:[R`$9$`, R`$\sqrt{18} \approx 4{,}24$`, R`$3$`], a:2,
          ex:R`$2\sigma^2 = 18$ gibt $\sigma^2 = 9$ und $\Delta x = \sigma = 3$.`,
          fb:[R`$9$ ist $\sigma^2$, die Varianz.`,
            R`$\sqrt{18}$ wäre $\sqrt{2\sigma^2}$. Der Nenner im Exponenten ist $2\sigma^2$, nicht $\sigma^2$.`,
            '']}},
      {id:'st-t5d', title:'68 %, 95 %, 99,7 % und die Halbwertsbreite',
        num:{title:R`$\sigma = 0{,}2\,\mathrm{mm}$`, text:R`Zwischen $9{,}8$ und $10{,}2\,\mathrm{mm}$ liegen $68{,}3\,\%$, zwischen $9{,}6$ und $10{,}4\,\mathrm{mm}$ liegen $95{,}4\,\%$. Die volle Breite bei halber Höhe ist $2{,}355\cdot 0{,}2\,\mathrm{mm} \approx 0{,}47\,\mathrm{mm}$.`},
        text:R`Wie viel Wahrscheinlichkeit liegt wie weit vom Mittelwert entfernt? Für die Gauß-Verteilung gilt:

- $P(|x - \mu| < \sigma) \approx 68{,}3\,\%$
- $P(|x - \mu| < 2\sigma) \approx 95{,}4\,\%$
- $P(|x - \mu| < 3\sigma) \approx 99{,}7\,\%$

Diese drei Zahlen stecken hinter fast jeder Fehlerangabe im Praktikum. Ein häufiger Fehler betrifft die Breite im Bild. Die volle Breite bei halber Höhe ist weder $\sigma$ noch $2\sigma$. Aus $e^{-u^2/(2\sigma^2)} = \tfrac12$ folgt $u = \pm\sigma\sqrt{2\ln 2}$, also ist sie $2\sqrt{2\ln 2}\,\sigma \approx 2{,}35\,\sigma$.`,
        q:{q:R`Messwerte sind gaußverteilt mit $\mu = 10{,}0\,\mathrm{mm}$ und $\sigma = 0{,}2\,\mathrm{mm}$. Welcher Anteil liegt zwischen $9{,}6$ und $10{,}4\,\mathrm{mm}$?`,
          opts:[R`etwa $68\,\%$`, R`etwa $95\,\%$`, R`etwa $99{,}7\,\%$`], a:1,
          ex:R`Das Intervall ist $\mu \pm 2\sigma$, also etwa $95{,}4\,\%$.`,
          fb:[R`$68\,\%$ gälte für $\mu \pm \sigma$, also $9{,}8$ bis $10{,}2\,\mathrm{mm}$.`,
            '',
            R`$99{,}7\,\%$ gälte für $\mu \pm 3\sigma$, also $9{,}4$ bis $10{,}6\,\mathrm{mm}$.`]}},
      {id:'st-t5e', title:'Die Gauß-Dichte in Formel, Bild, Labor und Physik: Tafel',
        num:{title:'Die Gauß-Dichte im Labor', text:R`Im Labor hat die Dichte „Gauß“ $\mu = 0{,}5\,L$ und $\sigma = 0{,}13\,L$. Mit den Grenzen $a = 0{,}37\,L$ und $b = 0{,}63\,L$, also $\mu \pm \sigma$, zeigt die Anzeige $P \approx 0{,}683$.`},
        text:R`Die Tafel stellt die Gauß-Dichte in fünf Darstellungen nebeneinander. Die Formel enthält $\mu$ und $\sigma$. Der Graph zeigt den Streifen $\mu \pm \sigma$ mit $68\,\%$ der Fläche. In Worten ist sie die Glockenkurve. Im Labor prüfst du die 68-%-Regel mit den Grenzreglern nach.

Die Physik-Zeile führt zu Thema 4. Dort ist die Wellenfunktion selbst eine Gauß-Funktion, $\psi \propto e^{-x^2/(4\sigma^2)}$. Erst ihr Betragsquadrat ist die Dichte. Achte auf den Faktor: Im Exponenten von $\psi$ steht $4\sigma^2$, in $|\psi|^2$ dann $2\sigma^2$.`,
        reps:{obj:R`Die Gauß-Dichte mit $\mu = 0{,}5$ und $\sigma = 0{,}13$`,
          rows:[
            {k:'formel', tex:R`\begin{gathered}\rho(x) = \frac{1}{\sqrt{2\pi}\,\sigma}\,e^{-(x - \mu)^2/(2\sigma^2)}\\ \langle x\rangle = \mu,\quad \Delta x = \sigma\end{gathered}`},
            {k:'graph', plot:{x:[0, 1], y:[0, 3.4], xlab:'x/L', ylab:'\\rho\\cdot L', regions:[{x:[0.37, 0.63], lab:'68\\,\\%'}], ticks:[{x:0.37, lab:'\\mu - \\sigma'}, {x:0.5, lab:'\\mu'}, {x:0.63, lab:'\\mu + \\sigma'}]}, f:x => Math.exp(-((x - 0.5) ** 2) / (2 * 0.0169)) / Math.sqrt(2 * Math.PI * 0.0169), lab:R`\rho`,
              cap:R`Im Streifen $\mu \pm \sigma$ liegen $68{,}3\,\%$ der Fläche, in $\mu \pm 2\sigma$ schon $95{,}4\,\%$.`},
            {k:'worte', text:R`Eine Glocke um $\mu$; $\sigma$ ist der Abstand vom Gipfel bis dorthin, wo die Kurve am steilsten fällt.`},
            {k:'labor', text:R`Labor dieses Themas, Wellenfunktion „Gauß ($\sigma = 0{,}13\,L$)“: Grenzen auf $0{,}37$ und $0{,}63$ stellen, die Anzeige zeigt $P \approx 0{,}68$.`},
            {k:'physik', text:R`Ausblick: Ein Gauß-Wellenpaket $\psi(x) \propto e^{-x^2/(4\sigma^2)}$ hat die Ortsdichte $|\psi|^2 \propto e^{-x^2/(2\sigma^2)}$ mit $\Delta x = \sigma$ (Thema 4).`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Gipfel bei $\mu$ setzen, Höhe $1/(\sqrt{2\pi}\,\sigma)$; im Abstand $\sigma$ ist die Kurve auf $61\,\%$ gefallen.`},
            {from:'graph', to:'worte', rule:R`Die Wendepunkte der Glocke liegen bei $\mu \pm \sigma$; dort ist sie am steilsten.`},
            {from:'worte', to:'labor', rule:R`Die Grenzen auf $\mu - \sigma$ und $\mu + \sigma$ stellen und die Fläche ablesen.`},
            {from:'labor', to:'physik', rule:R`Aus $\psi$ erst $|\psi|^2$ bilden; dabei verdoppelt sich der Exponent, und erst dann $\sigma$ ablesen.`}
          ]},
        q:{q:R`Ein Wellenpaket hat $\psi(x) \propto e^{-x^2/(4a^2)}$. Wie groß ist $\Delta x$?`, tr:{from:'physik', to:'formel'},
          opts:[R`$2a$`, R`$a$`, R`$\sqrt2\,a$`], a:1,
          ex:R`$|\psi|^2 \propto e^{-x^2/(2a^2)}$ ist eine Gauß-Dichte mit $\sigma = a$. Das Betragsquadrat verdoppelt den Exponenten.`,
          fb:[R`$2a$ entsteht, wenn man $\sigma$ aus $\psi$ statt aus $|\psi|^2$ abliest und $4a^2 = \sigma^2$ setzt. Zuerst quadrieren.`,
            '',
            R`$\sqrt2\,a$ wäre die Breite aus $\psi$ selbst. Die Dichte ist aber $|\psi|^2$.`]}},
      {id:'st-t5f', title:'Warum so verbreitet: der zentrale Grenzwertsatz',
        num:{title:'Zehn Münzwürfe', text:R`Wirfst du zehn Münzen und zählst „Kopf“, liegt die Anzahl um 5. Die Wahrscheinlichkeiten für $3, 4, 5, 6, 7$ sind $0{,}117$, $0{,}205$, $0{,}246$, $0{,}205$, $0{,}117$. Schon hier sieht das Balkenbild fast aus wie eine Glocke, obwohl jede einzelne Münze nur zwei Werte kennt.`},
        text:R`Warum ist die Gauß-Verteilung so verbreitet? Der **zentrale Grenzwertsatz** besagt: Die Summe vieler kleiner Zufallsbeiträge, die sich gegenseitig nicht beeinflussen, ist näherungsweise gaußverteilt. Das gilt fast egal, wie die einzelnen Beiträge verteilt sind. „Sich nicht beeinflussen“ heißt genauer unabhängig (Abschnitt 6).

Deshalb streuen viele Messwerte im Labor gaußförmig: Viele kleine Störungen addieren sich. Auch der Mittelwert einer langen Messreihe ist näherungsweise gaußverteilt (Abschnitt 7). Für die Quantenmechanik ist das kein Naturgesetz. Dort kann die Dichte $|\psi|^2$ jede Form haben.`,
        q:{q:'Wann darfst du eine Gauß-Verteilung erwarten?',
          opts:['für die Summe vieler kleiner, voneinander unabhängiger Beiträge', 'für jede Messgröße, die stetig ist', 'nur für Größen, die selbst schon aus einer Gauß-Dichte stammen'], a:0,
          ex:'Das ist die Aussage des zentralen Grenzwertsatzes. Einzelne Größen können ganz anders verteilt sein, etwa exponentiell.',
          fb:['',
            'Die Dichte $\\lambda e^{-\\lambda x}$ ist stetig und trotzdem keine Glocke.',
            'Die Beiträge dürfen fast beliebig verteilt sein, wie die zwei Werte einer Münze.']}},
      {id:'st-t5g', title:'Typischer Fehler: die 68-%-Regel für jede Dichte',
        num:{title:'Zwei Dichten, die nicht gaußförmig sind', text:R`Für $\rho = \lambda e^{-\lambda x}$ ist $\langle x\rangle \pm \Delta x = [0, 2/\lambda]$, und darin liegt $1 - e^{-2} \approx 86\,\%$. Für $\psi_1$ im Kasten liegt im Streifen $\langle x\rangle \pm \Delta x$ etwa $65\,\%$.`},
        text:R`Die Zahlen $68\,\%$, $95\,\%$ und $99{,}7\,\%$ gelten **nur** für die Gauß-Verteilung. Bei anderen Dichten liegt in $\langle x\rangle \pm \Delta x$ ein anderer Anteil. Er kann größer oder kleiner sein, wie die Beispiele zeigen.

Der Fehler entsteht, weil die Gauß-Verteilung so oft vorkommt, dass man ihre Regeln für allgemein hält. Rechne deshalb bei einer anderen Dichte die Fläche im Streifen selbst aus oder miss sie im Labor mit den Grenzreglern nach. Die Standardabweichung bleibt ein gutes Breitenmaß; nur die Prozentzahlen hängen von der Form ab.`,
        q:{q:R`Für $\rho = \lambda e^{-\lambda x}$ gilt $\langle x\rangle = \Delta x = 1/\lambda$. Welcher Anteil liegt im Streifen $\langle x\rangle \pm \Delta x$?`,
          opts:[R`etwa $68\,\%$, wie bei jeder Dichte`, R`etwa $86\,\%$`, R`genau $50\,\%$`], a:1,
          ex:R`Der Streifen ist $[0, 2/\lambda]$, und $\int_0^{2/\lambda}\lambda e^{-\lambda x}dx = 1 - e^{-2} \approx 0{,}86$.`,
          fb:[R`Die 68-%-Regel gilt nur für die Gauß-Verteilung.`,
            '',
            R`Die Hälfte liegt links vom Median $\ln 2/\lambda$. Der Streifen ist viel breiter.`]}}
    ]},

    /* ===== Abschnitt 6: Unabhängigkeit, bedingte Wahrscheinlichkeit ===== */
    {id:'st-t6', title:'Unabhängigkeit und bedingte Wahrscheinlichkeit', steps:[
      {id:'st-t6a', title:'Unabhängig: Wahrscheinlichkeiten multiplizieren',
        num:{title:'Zwei Würfel', text:R`Die Wahrscheinlichkeit für eine Doppelsechs ist $\tfrac16\cdot\tfrac16 = \tfrac{1}{36} \approx 0{,}028$. Von 36 gleich wahrscheinlichen Paaren $(m, n)$ ist genau eines $(6, 6)$.`},
        text:R`Oft interessieren zwei Ereignisse zugleich: beim ersten Würfel eine Sechs **und** beim zweiten eine Sechs. Zwei Ereignisse $A$ und $B$ heißen [[lex:stat-unabhaengig|unabhängig]], wenn

$$P(A\text{ und }B) = P(A)\,P(B).$$

Anschaulich heißt unabhängig: Das Ergebnis des einen verrät nichts über das andere. Zwei Würfel, die nicht aneinander gekoppelt sind, sind unabhängig. Für „und“ wird dann multipliziert, nicht addiert. Addieren gehört zu „oder“ bei Ereignissen, die sich ausschließen.`,
        q:{q:R`Zwei Teilchen werden unabhängig voneinander im selben Zustand präpariert; für jedes ist $P(x > 0) = 0{,}3$. Wie wahrscheinlich findet man beide bei $x > 0$?`,
          opts:[R`$0{,}6$`, R`$0{,}3$`, R`$0{,}09$`], a:2,
          ex:R`Unabhängig: $0{,}3\cdot 0{,}3 = 0{,}09$.`,
          fb:[R`Addieren ist die falsche Regel für „und“. Außerdem könnte eine Summe größer als 1 werden.`,
            R`$0{,}3$ gilt für ein Teilchen. Dass auch das zweite dort ist, macht es unwahrscheinlicher.`,
            '']}},
      {id:'st-t6b', title:'Bedingte Wahrscheinlichkeit',
        num:{title:'Gerade und Sechs', text:R`Ein Würfel zeigt eine gerade Zahl. Wie wahrscheinlich ist es eine Sechs? Es ist $P(6\text{ und gerade}) = P(6) = \tfrac16$ und $P(\text{gerade}) = \tfrac12$, also $P(6|\text{gerade}) = \tfrac{1/6}{1/2} = \tfrac13$.`},
        text:R`Die [[lex:stat-bedingt|bedingte Wahrscheinlichkeit]] fragt: Wie wahrscheinlich ist $A$, wenn man schon weiß, dass $B$ eingetreten ist?

$$P(A|B) = \frac{P(A\text{ und }B)}{P(B)}\qquad (P(B) > 0),$$

gelesen „P von A unter der Bedingung B“. Man beschränkt sich auf die Fälle, in denen $B$ eingetreten ist, und normiert neu. Im Beispiel bleiben drei gleich wahrscheinliche Zahlen $2, 4, 6$, eine davon ist die Sechs. Unabhängig heißt jetzt einfach $P(A|B) = P(A)$: Das Wissen um $B$ ändert nichts. Hier hat es die Wahrscheinlichkeit verdoppelt.`,
        q:{q:'Ein Würfel zeigt mehr als 3. Wie wahrscheinlich ist die Zahl gerade?',
          opts:[R`$\tfrac12$`, R`$\tfrac23$`, R`$\tfrac13$`], a:1,
          ex:R`Es bleiben $4, 5, 6$; gerade sind $4$ und $6$. Also $P = \tfrac{2/6}{3/6} = \tfrac23$.`,
          fb:[R`$\tfrac12$ gilt ohne Bedingung. Unter den Zahlen über 3 sind zwei von drei gerade.`,
            '',
            R`$\tfrac13$ wäre die Wahrscheinlichkeit für eine bestimmte Zahl, etwa die Sechs.`]}},
      {id:'st-t6c', title:'Typischer Fehler: Bedingung umdrehen, „mindestens eines“ addieren',
        num:{title:'Zwei Würfe', text:R`$P(\text{gerade}|6) = 1$, aber $P(6|\text{gerade}) = \tfrac13$. Mindestens eine Sechs in zwei Würfen: $1 - \left(\tfrac56\right)^2 = \tfrac{11}{36} \approx 0{,}31$, nicht $\tfrac16 + \tfrac16 = \tfrac13 \approx 0{,}33$.`},
        text:R`Zwei Fehler sind häufig. Der erste: „$P(A|B) = P(B|A)$.“ Im Beispiel ist $P(\text{gerade}|6) = 1$, aber $P(6|\text{gerade}) = \tfrac13$. Die Umrechnung leistet

$$P(A|B)\,P(B) = P(B|A)\,P(A);$$

beide Seiten sind $P(A\text{ und }B)$.

Der zweite: Für „mindestens eines von beiden“ addiert man $P(A) + P(B)$. Das gilt nur, wenn sich $A$ und $B$ ausschließen. Zwei Sechsen schließen sich nicht aus, die Doppelsechs würde doppelt gezählt. Sicherer ist das Gegenereignis: $P(\text{mindestens eines}) = 1 - P(\text{keines})$.`,
        q:{q:'Wie wahrscheinlich ist mindestens eine Sechs in drei Würfen?',
          opts:[R`$\tfrac12$, denn $3\cdot\tfrac16$`, R`$\tfrac{1}{216}$`, R`$1 - \left(\tfrac56\right)^3 \approx 0{,}42$`], a:2,
          ex:R`Keine Sechs in drei unabhängigen Würfen hat $\left(\tfrac56\right)^3 = \tfrac{125}{216}$. Das Gegenereignis hat $\tfrac{91}{216} \approx 0{,}42$.`,
          fb:[R`Addieren zählt Würfe mit mehreren Sechsen mehrfach. Bei sieben Würfen käme so mehr als 1 heraus.`,
            R`$\tfrac{1}{216}$ ist die Wahrscheinlichkeit für drei Sechsen.`,
            '']}},
      {id:'st-t6d', title:'Unabhängigkeit in Formel, Dichte und Physik: Tafel',
        num:{title:'Zwei gleichverteilte Größen', text:R`$x$ und $y$ seien unabhängig und gleichverteilt auf $[0, 1]$. Dann ist $\rho(x, y) = 1\cdot 1$, und $P(x < 0{,}5\text{ und }y < 0{,}5) = 0{,}5\cdot 0{,}5 = 0{,}25$: ein Viertel des Quadrats. Außerdem $\langle xy\rangle = \langle x\rangle\langle y\rangle = \tfrac14$.`},
        text:R`Für Dichten gilt dasselbe wie für Ereignisse. Zwei unabhängige Größen haben die gemeinsame Dichte $\rho(x, y) = \rho_1(x)\,\rho_2(y)$, ein Produkt. Daraus folgt eine Rechenregel, die du in Abschnitt 7 brauchst: Für unabhängige Größen ist $\langle xy\rangle = \langle x\rangle\langle y\rangle$, weil das Doppelintegral in zwei Faktoren zerfällt.

Die Tafel verbindet die Darstellungen. In der Quantenmechanik gehört zu Unabhängigkeit ein Produktzustand. Für abhängige Größen gilt keine der beiden Produktregeln.`,
        reps:{obj:'Zwei unabhängige Zufallsgrößen',
          rows:[
            {k:'worte', text:R`Das Ergebnis der einen Größe verrät nichts über die andere.`},
            {k:'formel', tex:R`\begin{gathered}P(A\text{ und }B) = P(A)\,P(B)\\ \Leftrightarrow\quad P(A|B) = P(A)\end{gathered}`},
            {k:'mathe', tex:R`\begin{gathered}\rho(x, y) = \rho_1(x)\,\rho_2(y)\\ \Rightarrow\;\langle xy\rangle = \int\!\!\int xy\,\rho_1\rho_2\,dx\,dy = \langle x\rangle\langle y\rangle\end{gathered}`},
            {k:'physik', text:R`Ausblick: Zwei getrennt präparierte, unterscheidbare Teilchen haben den Produktzustand $\psi(x_1, x_2) = \psi_a(x_1)\,\psi_b(x_2)$. Dann ist $|\psi|^2 = |\psi_a|^2|\psi_b|^2$, und die beiden Ortsmessungen sind unabhängig.`}
          ],
          links:[
            {from:'worte', to:'formel', rule:R`„Verrät nichts“ heißt: Die Bedingung $B$ ändert die Wahrscheinlichkeit von $A$ nicht; das ist gleichwertig mit der Produktregel.`},
            {from:'formel', to:'mathe', rule:R`Ereignisse durch Intervalle ersetzen: Die gemeinsame Dichte ist das Produkt der einzelnen Dichten.`},
            {from:'mathe', to:'physik', rule:R`Ist $\psi$ ein Produkt, zerfällt auch $|\psi(x_1, x_2)|^2$ in ein Produkt der einzelnen Dichten; dann sind die Ortsmessungen unabhängig.`}
          ]},
        q:{q:R`$x$ und $y$ sind unabhängig mit $\langle x\rangle = 2$ und $\langle y\rangle = 3$. Wie groß ist $\langle xy\rangle$?`, tr:{from:'formel', to:'mathe'},
          opts:[R`$6$`, R`$5$`, R`ohne die Dichten nicht bestimmbar`], a:0,
          ex:R`Für unabhängige Größen zerfällt das Doppelintegral: $\langle xy\rangle = \langle x\rangle\langle y\rangle = 6$.`,
          fb:['',
            R`$5$ wäre $\langle x + y\rangle$. Für ein Produkt wird multipliziert.`,
            R`Bei unabhängigen Größen reichen die Erwartungswerte. Ohne Unabhängigkeit bräuchte man die gemeinsame Dichte.`]}},
      {id:'st-t6e', title:'Messungen nacheinander am selben System',
        num:{title:R`$|c_2|^2 = 0{,}3$`, text:R`Zwei frisch präparierte Teilchen liefern beide $E_2$ mit $0{,}3\cdot 0{,}3 = 0{,}09$. Misst du dagegen am selben Teilchen zweimal direkt hintereinander und erhältst zuerst $E_2$, kommt beim zweiten Mal mit Wahrscheinlichkeit $1$ wieder $E_2$.`},
        text:R`Für Messungen ist eine Unterscheidung wichtig (Ausblick auf Thema 6). Messungen an **verschiedenen**, gleich präparierten Systemen sind unabhängig. Zwei Messungen **nacheinander am selben** System sind es im Allgemeinen nicht.

Misst du die Energie zweimal direkt hintereinander, liefert die zweite Messung sicher denselben Wert wie die erste. Die erste Messung hat den Zustand verändert: Danach ist das Teilchen in dem Zustand, der zum gemessenen Wert gehört ([[lex:messpostulat|Messpostulat]], Thema 6). Die Produktregel aus Schritt 1 darfst du hier nicht anwenden.`,
        q:{q:R`Am selben Teilchen im Zustand $\sum_nc_n\psi_n$ wird zweimal direkt hintereinander die Energie gemessen. Die erste Messung ergibt $E_2$. Mit welcher Wahrscheinlichkeit liefert die zweite $E_2$?`,
          opts:[R`$|c_2|^2$`, R`$1$`, R`$|c_2|^4$`], a:1,
          ex:R`Nach der ersten Messung ist das Teilchen im Zustand $\psi_2$; ohne Störung dazwischen folgt sicher wieder $E_2$.`,
          fb:[R`$|c_2|^2$ gälte für ein frisch präpariertes zweites Teilchen.`,
            '',
            R`$|c_2|^4$ ist die Wahrscheinlichkeit, dass zwei unabhängige Teilchen beide $E_2$ liefern.`]}}
    ]},

    /* ===== Abschnitt 7: Messreihe, Ensemble, Standardfehler ===== */
    {id:'st-t7', title:'Messreihe und Ensemble', steps:[
      {id:'st-t7a', title:'Eine Messreihe auswerten',
        num:{title:'Fünf Ortsmessungen', text:R`Die Werte $0{,}48$, $0{,}52$, $0{,}47$, $0{,}55$ und $0{,}50\,\mathrm{nm}$ geben $\bar x = 2{,}52/5 = 0{,}504\,\mathrm{nm}$. Die Abweichungen zum Quadrat summieren sich zu $0{,}00412\,\mathrm{nm}^2$. Geteilt durch $N - 1 = 4$ und die Wurzel gezogen: $s \approx 0{,}032\,\mathrm{nm}$.`},
        text:R`Im Labor hast du keine unendlich vielen Messungen, sondern eine **Messreihe** $x_1, \dots, x_N$. Daraus berechnest du den Mittelwert und die empirische Standardabweichung

$$\begin{gathered}\bar x = \frac1N\sum_{i=1}^N x_i,\\ s = \sqrt{\frac{1}{N - 1}\sum_{i=1}^N(x_i - \bar x)^2}.\end{gathered}$$

$\bar x$ wird „x quer“ gelesen. Der Nenner $N - 1$ in $s$ gleicht aus, dass $\bar x$ selbst aus den Daten stammt und genau in ihrer Mitte liegt. Die Abweichungen von $\bar x$ sind deshalb im Mittel etwas kleiner als die vom wahren Erwartungswert. Für großes $N$ ist der Unterschied klein.`,
        q:{q:R`Eine Messreihe ergibt $1$, $2$ und $3$. Wie groß ist $s$?`,
          opts:[R`$s = 1$`, R`$s = \sqrt{2/3} \approx 0{,}82$`, R`$s = 2$`], a:0,
          ex:R`$\bar x = 2$, Abweichungen $-1, 0, 1$, Summe der Quadrate $2$. Geteilt durch $N - 1 = 2$ gibt $1$, also $s = 1$.`,
          fb:['',
            R`So entsteht es mit dem Nenner $N = 3$. Für $s$ teilt man durch $N - 1$.`,
            R`$2$ ist der Mittelwert $\bar x$, nicht die Streuung.`]}},
      {id:'st-t7b', title:'Messreihe und Ensemble',
        num:{title:'Zehn Würfe', text:R`Zehn Würfe ergeben vielleicht $\bar x = 3{,}1$, zehn weitere $\bar x = 3{,}8$. Der Erwartungswert ist bei beiden Reihen derselbe, $\langle x\rangle = 3{,}5$, denn er gehört zum Würfel.`},
        text:R`$\bar x$ und $s$ sind **Schätzwerte** aus Daten. Eine zweite Messreihe liefert andere Zahlen. Der Erwartungswert $\langle x\rangle$ und die Standardabweichung $\Delta x$ dagegen gehören zur Verteilung selbst.

Man stellt sie sich als Mittel über ein [[lex:stat-ensemble|Ensemble]] vor: unendlich viele gleich präparierte Systeme, an jedem wird einmal gemessen. Das Ensemble ist eine gedachte Gesamtheit, die Messreihe eine endliche Stichprobe daraus. Mit wachsendem $N$ nähern sich $\bar x$ und $s$ den Werten $\langle x\rangle$ und $\Delta x$.`,
        q:{q:'Zwei Messreihen mit je zehn Würfen desselben Würfels ergeben $s = 1{,}6$ und $s = 1{,}8$. Wie passt das zusammen?',
          opts:['Der Würfel hat sich zwischen den Reihen verändert.', 'Eine Reihe ist falsch, denn $s$ gehört zum Würfel selbst.', 'Beide schätzen dasselbe $\\Delta x$; $s$ schwankt mit der Stichprobe.'], a:2,
          ex:'$s$ ist ein Schätzwert aus Daten und schwankt von Messreihe zu Messreihe. $\\Delta x$ gehört zum Würfel und ist für beide Reihen dasselbe.',
          fb:['Der Würfel bleibt derselbe. Verschiedene Zahlen entstehen schon durch den Zufall in nur zehn Würfen.', 'Zum Würfel gehört $\\Delta x$, nicht $s$. $s$ wird aus Daten berechnet und schwankt.', '']}},
      {id:'st-t7c', title:R`Wie genau ist der Mittelwert? $\Delta x/\sqrt N$`,
        num:{title:R`$\rho(x) = 6x(1 - x)$ mit $N = 2$`, text:R`Ein Einzelwert hat $(\Delta x)^2 = \tfrac{1}{20}$, also $\Delta x \approx 0{,}224$. Der Mittelwert zweier unabhängiger Werte hat $(\Delta\bar x)^2 = \tfrac{1}{40}$, also $\Delta\bar x \approx 0{,}158 = 0{,}224/\sqrt2$.`},
        text:R`$\bar x$ ist selbst eine Zufallsgröße. Im Mittel trifft er, $\langle\bar x\rangle = \langle x\rangle$. Seine Streuung folgt aus der Unabhängigkeit der Messungen. Bei unabhängigen Messungen addieren sich die Varianzen, denn die Mischterme $\langle x_ix_j\rangle - \langle x_i\rangle\langle x_j\rangle$ sind null. Die Summe der $N$ Werte hat also die Varianz $N(\Delta x)^2$. Teilen durch $N$ teilt die Varianz durch $N^2$:

$$\Delta\bar x = \frac{\Delta x}{\sqrt N}.$$

Diese Größe heißt **Standardfehler des Mittelwerts**. Die Herleitung prüft das für $N = 2$ mit der Dichte $6x(1 - x)$; für sie ist $\langle x\rangle = \tfrac12$ und $\langle x^2\rangle = \tfrac{3}{10}$.`,
        derive:{ctx:{coords:['x', 'y'], domain:{x:['0', '1'], y:['0', '1']}, params:{}, defs:{'ψ(x,y)':'6 sqrt(x(1 - x) y(1 - y))'}},
          lines:[
            {l:'⟨(x + y)/2⟩ = 1/2', w:'zwei unabhängige Messwerte x und y', why:{q:R`Warum ist der Mittelwert der beiden Messwerte im Mittel $\tfrac12$?`, opts:['weil $\\tfrac12(\\langle x\\rangle + \\langle y\\rangle) = \\tfrac12$ ist (Linearität)', 'weil $x + y$ immer gleich $1$ ist', 'weil jede Messung genau $\\tfrac12$ ergibt'], a:0, ex:R`Die Linearität gilt immer, auch ohne Unabhängigkeit. Einzelne Werte streuen um $\tfrac12$.`}},
            {l:'⟨((x + y)/2)^2⟩ = 1/4 ⟨x^2 + 2x y + y^2⟩', w:'ausmultipliziert'},
            {l:'= 1/4 (⟨x^2⟩ + 2⟨x⟩ ⟨y⟩ + ⟨y^2⟩)', w:'unabhängig: ⟨xy⟩ = ⟨x⟩⟨y⟩', why:{q:'Warum darf man $\\langle xy\\rangle$ durch $\\langle x\\rangle\\langle y\\rangle$ ersetzen?', opts:['Unabhängig: Die gemeinsame Dichte ist ein Produkt.', 'Das gilt für beliebige Größen $x$ und $y$, immer.', 'Weil $x$ und $y$ denselben Erwartungswert haben.'], a:0, ex:'$\\int\\!\\int xy\\,\\rho(x)\\rho(y)\\,dx\\,dy = \\int x\\rho(x)\\,dx\\cdot\\int y\\rho(y)\\,dy$. Für abhängige Größen gilt das im Allgemeinen nicht.'}},
            {l:'= 1/4 (3/10 + 1/2 + 3/10)', w:'Momente eingesetzt'},
            {l:'= 11/40', w:'zusammengefasst'},
            {l:'11/40 - (1/2)^2 = 1/40', w:'Varianz des Mittelwerts', why:{q:'Was zeigt das Ergebnis $1/40$?', opts:['Die Varianz des Mittelwerts ist halb so groß wie die eines Einzelwerts.', 'Die Standardabweichung des Mittelwerts ist halb so groß.', 'Zwei Messungen verringern die Streuung der Einzelwerte.'], a:0, ex:'$1/40 = \\frac12\\cdot\\frac1{20}$: Die Varianz fällt wie $1/N$, die Standardabweichung wie $1/\\sqrt N$, hier um den Faktor $1/\\sqrt2$. Die Einzelwerte streuen weiter mit $\\Delta x$.'}}
          ]},
        q:{q:R`Du vervierfachst die Zahl der Messungen von $N = 100$ auf $N = 400$. Was passiert?`,
          opts:[R`$s$ halbiert sich, $\Delta\bar x$ bleibt etwa gleich.`, R`$\Delta\bar x$ halbiert sich, $s$ bleibt etwa gleich.`, R`Beide werden halb so groß.`], a:1,
          ex:R`$\Delta\bar x = \Delta x/\sqrt N$ und $\sqrt{400/100} = 2$. $s$ schätzt $\Delta x$, eine Eigenschaft der Verteilung.`,
          fb:[R`Umgekehrt: Die Einzelwerte streuen weiter wie vorher, genauer wird nur der Mittelwert.`,
            '',
            R`$s$ nähert sich $\Delta x$ und wird nicht kleiner. Nur $\Delta\bar x$ schrumpft.`]}},
      {id:'st-t7d', title:'Einzelwerte und Mittelwerte: Tafel',
        num:{title:'Das Labor zur Messung', text:R`Mit den Gewichten $0{,}5$, $0{,}3$ und $0{,}2$ für die Werte $1, 2, 3$ ist $\langle A\rangle = 1{,}7$ und $\Delta A \approx 0{,}78$. Nach 100 Messungen erwartest du für den Mittelwert eine Streuung von etwa $0{,}78/\sqrt{100} \approx 0{,}08$.`},
        text:R`Die Tafel trennt zwei Streuungen, die leicht verwechselt werden. Die Einzelwerte streuen mit $\Delta x$ um den Erwartungswert. Mittelwerte von je $N$ Werten streuen viel weniger, mit $\Delta x/\sqrt N$. Im Graphen sind das zwei Glocken um dieselbe Mitte, eine breite und eine schmale.

Im Labor zur Messung siehst du beides: Die roten Balken zeigen die Häufigkeiten der Einzelwerte, die Anzeige nennt den Mittelwert der Messungen und die erwartete Streuung des Mittelwerts. Die Physik nennt die Folgerung für das Phänomen vom Anfang des Themas.`,
        reps:{obj:R`Einzelwerte und Mittelwerte von je $N = 10$ Messungen`,
          rows:[
            {k:'formel', tex:R`\begin{gathered}\Delta x\ \text{(Einzelwerte)}\\ \Delta\bar x = \frac{\Delta x}{\sqrt N}\ \text{(Mittelwerte)}\end{gathered}`},
            {k:'graph', plot:{x:[-3.5, 3.5], y:[0, 1.35], xlab:'(x - \\langle x\\rangle)/\\Delta x', ylab:'\\text{Dichte}'}, f:x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), lab:R`\text{Einzelwerte}`, f2:x => Math.exp(-x * x * 10 / 2) * Math.sqrt(10) / Math.sqrt(2 * Math.PI), lab2:R`\bar x,\ N = 10`,
              cap:R`Für gaußverteilte Einzelwerte: Die Mittelwerte von je zehn Werten (gestrichelt) streuen um denselben Erwartungswert, aber nur mit $\Delta x/\sqrt{10} \approx 0{,}32\,\Delta x$.`},
            {k:'worte', text:R`Mehr Messungen machen den Mittelwert genauer. Die Einzelwerte streuen deshalb nicht weniger.`},
            {k:'labor', text:R`Labor zur Messung: „100× messen“ füllt die roten Balken; die Anzeige nennt den „Mittelwert der Messungen“ und die „erwartete Streuung des Mittelwerts“ $\Delta A/\sqrt N$.`},
            {k:'physik', text:R`Bei Ortsmessungen an gleich präparierten Elektronen streuen die Einzelwerte mit der Unschärfe $\Delta x$ des Zustands, auch bei 2000 Messungen.`}
          ],
          links:[
            {from:'formel', to:'graph', rule:R`Zwei Glocken um dieselbe Mitte zeichnen: eine mit der Breite $\Delta x$, eine mit $\Delta x/\sqrt N$.`},
            {from:'graph', to:'worte', rule:R`Die schmale Glocke gehört zum Mittelwert, die breite zu den Einzelwerten; nur die schmale wird mit $N$ schmaler.`},
            {from:'worte', to:'labor', rule:R`Im Labor nach „100× messen“ die Anzeige lesen: Der Mittelwert liegt nahe $\langle A\rangle$, die roten Balken bleiben verteilt.`},
            {from:'labor', to:'physik', rule:R`Die Streuung der Einzelwerte im Labor ist $\Delta A$ des Zustands; sie ist keine Ungenauigkeit, die mit mehr Messungen verschwindet.`}
          ]},
        q:{q:R`Im Labor zeigt die Anzeige $\Delta A = 0{,}78$. Wie groß ist nach 100 Messungen die erwartete Streuung des Mittelwerts?`, tr:{from:'labor', to:'formel'},
          opts:[R`etwa $0{,}0078$`, R`etwa $0{,}78$`, R`etwa $0{,}078$`], a:2,
          ex:R`$\Delta A/\sqrt N = 0{,}78/10 \approx 0{,}078$.`,
          fb:[R`Geteilt wird durch $\sqrt{100} = 10$, nicht durch $100$.`,
            R`$0{,}78$ ist die Streuung der Einzelwerte. Der Mittelwert streut weniger.`,
            '']}},
      {id:'st-t7e', title:'Eine Abweichung beurteilen',
        num:{title:'100 Ortsmessungen', text:R`Ein Zustand hat $\Delta x = 0{,}2\,\mathrm{nm}$. Nach $N = 100$ Messungen ist $\Delta\bar x = 0{,}02\,\mathrm{nm}$. Weicht $\bar x$ um $0{,}01\,\mathrm{nm}$ von $\langle x\rangle$ ab, ist das ein halber Standardfehler: ganz normal. Eine Abweichung von $0{,}1\,\mathrm{nm}$ wären fünf Standardfehler.`},
        text:R`Mit dem Standardfehler beurteilst du, ob eine Messreihe zu einer Vorhersage passt. Vergleiche die Abweichung $|\bar x - \langle x\rangle|$ mit $\Delta\bar x$. Abweichungen bis etwa ein oder zwei Standardfehler sind normal. Bei Gauß-verteiltem Mittelwert liegt er in etwa 95 % der Messreihen innerhalb von zwei Standardfehlern.

Eine Abweichung von fünf Standardfehlern dagegen kommt bei einer richtigen Vorhersage praktisch nie vor. Sie ist ein deutlicher Hinweis, dass der Zustand anders ist als angenommen oder dass das Experiment einen systematischen Fehler hat.`,
        q:{q:R`Nach $N = 25$ Messungen ist $\bar x = 0{,}53\,L$. Für den Zustand gilt $\langle x\rangle = 0{,}50\,L$ und $\Delta x = 0{,}18\,L$. Passt das?`,
          opts:[R`Nein, $\bar x$ müsste genau $0{,}50\,L$ sein.`, R`Ja, die Abweichung ist kleiner als $\Delta x/\sqrt N$.`, R`Nein, sie müsste unter $0{,}01\,L$ liegen.`], a:1,
          ex:R`$\Delta\bar x = 0{,}18\,L/5 = 0{,}036\,L$. Die Abweichung $0{,}03\,L$ ist kleiner als ein Standardfehler – ganz normal.`,
          fb:[R`$\bar x$ ist eine Zufallsgröße und trifft $\langle x\rangle$ nie genau.`,
            '',
            R`Der Maßstab ist der Standardfehler $0{,}036\,L$, nicht eine feste kleine Zahl.`]}},
      {id:'st-t7f', title:'Typischer Fehler: „Lange messen macht die Streuung kleiner“',
        num:{title:'10 000 Messungen', text:R`Nach $10\,000$ Ortsmessungen an einem Zustand mit $\Delta x = 0{,}2\,\mathrm{nm}$ ist $s \approx 0{,}2\,\mathrm{nm}$, wie vorher. Der Standardfehler ist aber auf $0{,}2\,\mathrm{nm}/100 = 0{,}002\,\mathrm{nm}$ geschrumpft.`},
        text:R`Ein verbreiteter Irrtum lautet: „Wenn ich lange genug messe, verschwindet die Unschärfe.“ Nein: $\Delta x$ beschreibt die Streuung der Einzelwerte und gehört zum Zustand. Lange Messreihen bestimmen $\langle x\rangle$ und $\Delta x$ genauer, ändern sie aber nicht.

Im Bild daneben siehst du das an einer Größe mit drei möglichen Werten. Drückst du mehrmals „100× messen“, nähern sich die roten Balken den blauen, und der Mittelwert der Messungen nähert sich $\langle A\rangle$. Die einzelnen Ergebnisse bleiben trotzdem $1$, $2$ oder $3$: Die Streuung verschwindet nicht.`,
        fig:{lab:'measure', keep:['|c₁|²', '|c₂|²', 'Viele'], caption:'Viele Messungen an gleich präparierten Systemen: Der Mittelwert der Messungen nähert sich $\\langle A\\rangle$, die einzelnen Ergebnisse bleiben aber $1$, $2$ oder $3$ – die Streuung verschwindet nicht.'},
        q:{q:'Im Labor drückst du zwanzigmal „100× messen“. Was wird dabei kleiner?',
          opts:['die Streuung $s$ der Einzelergebnisse', 'der Standardfehler $\\Delta\\bar A$ des Mittelwerts', 'die Unschärfe $\\Delta A$ des Zustands'], a:1,
          ex:'$\\Delta\\bar A = \\Delta A/\\sqrt N$ schrumpft mit wachsendem $N$. $\\Delta A$ gehört zum Zustand, und $s$ nähert sich $\\Delta A$, statt kleiner zu werden. Die Einzelergebnisse bleiben $1$, $2$ oder $3$.',
          fb:['$s$ nähert sich $\\Delta A$ und wird nicht kleiner: Die Einzelergebnisse streuen weiter über $1$, $2$ und $3$.', '', '$\\Delta A$ gehört zum Zustand. Messen bestimmt es genauer, ändert es aber nicht.']}}
    ]}
  ],
  example:{
    title:'Gleichverteilung: das klassische Teilchen im Kasten',
    text:'Eine klassische Kugel fliegt mit konstantem Geschwindigkeitsbetrag zwischen zwei Wänden bei $x = 0$ und $x = L$ hin und her. Zu einem zufälligen Zeitpunkt ist jeder Ort gleich wahrscheinlich: $\\rho(x) = A$ für $0 < x < L$, sonst null. Bestimme $A$, $\\langle x\\rangle$, $\\langle x^2\\rangle$ und $\\Delta x$.',
    ctx:DENS('A', '1/sqrt(L)', {domain:{x:['0', 'L']}, params:{L:'pos'}, unknowns:{A:{ref:'1/L'}}}),
    lines:[
      {l:'∫_0^L ρ(x) dx = 1', why:{q:'Warum beginnt man mit diesem Integral?', opts:['Die Gesamtwahrscheinlichkeit muss 1 sein.', 'Weil $\\rho$ überall gleich 1 sein muss.', 'Weil es den Erwartungswert liefert.'], a:0, ex:'Erst die Normierung legt $A$ fest. Danach sind Integrale über $\\rho$ echte Wahrscheinlichkeiten und Mittelwerte.'}},
      {l:'A L = 1', why:{q:'Woher kommt $AL$?', opts:['$\\int_0^LA\\,dx$: Konstante mal Länge', 'die Ableitung von $\\rho$ nach $L$', 'der Randwert $\\rho(L)$ mal $L$'], a:0, ex:'$\\int_0^LA\\,dx = AL$.'}},
      {l:'A = 1/L', why:{q:'Welche Einheit hat $A$?', opts:['$1/\\text{Länge}$, wie jede Ortsdichte', 'keine, denn $P$ ist eine Zahl', '$\\text{Länge}$, wie $x$'], a:0, ex:'$\\rho\\,dx$ ist dimensionslos, also hat $\\rho$ die Einheit $1/\\text{Länge}$.'}},
      {l:'⟨x⟩ = ∫_0^L x/L dx', why:{q:'Was steht im Integranden?', opts:['jeder Ort $x$, gewichtet mit $\\rho = 1/L$', 'die Wahrscheinlichkeit, genau bei $x$ zu sein', 'der Ort $x$ ganz ohne Gewicht'], a:0, ex:'$\\langle x\\rangle = \\int x\\,\\rho(x)\\,dx$.'}},
      {l:'= L/2', why:{q:'Wie siehst du das ohne Rechnung?', opts:['$\\rho$ ist symmetrisch um $L/2$: der Schwerpunkt.', 'Der Erwartungswert liegt immer in der Mitte.', 'Weil $\\rho$ bei $L/2$ am größten ist.'], a:0, ex:'Bei Symmetrie um $x_0$ heben sich die Beiträge links und rechts weg. Im Allgemeinen liegt $\\langle x\\rangle$ nicht in der Mitte des Intervalls, und hier hat $\\rho$ kein ausgezeichnetes Maximum: Die Konstante nimmt ihren größten Wert überall an.'}},
      {l:'⟨x^2⟩ = ∫_0^L x^2/L dx', why:{q:'Wozu braucht man $\\langle x^2\\rangle$?', opts:['für die Varianz $\\langle x^2\\rangle - \\langle x\\rangle^2$', 'als Kontrolle, weil $\\langle x^2\\rangle = \\langle x\\rangle^2$', 'für die Normierung in zwei Dimensionen'], a:0, ex:'Das zweite Moment liefert zusammen mit dem ersten die Breite.'}},
      {l:'= L^2/3'},
      {l:'Δx = sqrt(L^2/3 - L^2/4)', why:{q:'Warum ist der Ausdruck unter der Wurzel positiv?', opts:['$\\langle x^2\\rangle \\ge \\langle x\\rangle^2$ gilt immer.', 'Zufall: $L^2/3$ ist hier größer als $L^2/4$.', 'Man nimmt im Zweifel den Betrag.'], a:0, ex:'Die Differenz ist die Varianz $\\langle(x - \\langle x\\rangle)^2\\rangle \\ge 0$. Null wäre sie nur ohne jede Streuung.'}},
      {l:'= L/sqrt(12)', why:{q:'Im quantenmechanischen Grundzustand ist $\\Delta x \\approx 0{,}18\\,L$, hier $\\approx 0{,}29\\,L$. Was zeigt der Vergleich?', opts:['Der Grundzustand ist stärker zur Mitte hin konzentriert.', 'Das Quantenteilchen ist nie in Wandnähe.', 'Ein Fehler, beide Werte müssten gleich sein.'], a:0, ex:'$|\\psi_1|^2 \\propto \\sin^2(\\pi x/L)$ ist an den Wänden null und in der Mitte groß. Für große Quantenzahlen nähert sich die Streuung im Kasten dem klassischen Wert $L/\\sqrt{12}$ (Thema 3).'}}
    ],
    faded:{id:'st-fade', title:'Jetzt du: $\\rho(x) = A\\,x^2$ auf $[0, L]$',
      text:'Für $0 < x < L$ ist $\\rho(x) = A\\,x^2$, sonst null. Die Normierung ist schon erledigt. Berechne $\\langle x\\rangle$, $\\langle x^2\\rangle$ und $\\Delta x$.',
      ctx:DENS('A x^2', 'sqrt(3/L^3) x', {domain:{x:['0', 'L']}, params:{L:'pos'}, unknowns:{A:{ref:'3/L^3'}}}),
      given:['∫_0^L ρ(x) dx = 1', 'A L^3/3 = 1', 'A = 3/L^3'],
      goals:[{id:'a', prompt:'Bestimme $\\Delta x$.', type:'value', target:'L sqrt(3/80)', points:3,
        hints:['Wie im Beispiel: erst $\\langle x\\rangle$, dann $\\langle x^2\\rangle$, dann die Differenz.', '$\\langle x^n\\rangle = \\frac{3}{L^3}\\int_0^Lx^{n+2}\\,dx = \\frac{3L^n}{n+3}$.', '$\\langle x\\rangle = 3L/4$; jetzt $\\langle x^2\\rangle$.'],
        model:['∫_0^L ρ(x) dx = 1', 'A L^3/3 = 1', 'A = 3/L^3', {l:'⟨x⟩ = 3/L^3 ∫_0^L x^3 dx', gap:'⟨x⟩ = 3/L^3 ∫_0^L ▢ dx'}, '= 3L/4', '⟨x^2⟩ = 3/L^3 ∫_0^L x^4 dx', '= 3L^2/5', 'Δx = sqrt(3L^2/5 - 9L^2/16)', '= L sqrt(3/80)'],
        mistakes:[{expr:'L sqrt(3/5)', msg:'Das ist $\\sqrt{\\langle x^2\\rangle}$. Für $\\Delta x$ fehlt noch $-\\langle x\\rangle^2$.'}],
        note:'$\\Delta x = L\\sqrt{3/80}\\approx 0{,}19\\,L$, schmaler als bei der Gleichverteilung ($0{,}29\\,L$): Die Dichte drängt die Werte zum rechten Rand.'}]}
  },
  puzzle:{
    title:'Welche Verteilung ist am breitesten?',
    text:'Drei Zufallsgrößen haben alle den Mittelwert $5$:\n\n- A: Werte $4$ und $6$, je mit $P = 1/2$\n- B: Werte $3$, $5$ und $7$, je mit $P = 1/3$\n- C: Werte $1$, $5$ und $9$ mit $P = 1/8$, $3/4$ und $1/8$\n\nErfinde zuerst selbst ein Maß für die Breite einer Verteilung und wende es auf A, B und C an. Welche ist am breitesten?',
    q:{q:'Deine Vermutung:', opts:['B: drei gleich wahrscheinliche Werte', 'C: die weitesten Ausreißer', 'A und C gleich breit', 'hängt vom Breitenmaß ab'], a:3, ex:'Spannweite und Standardabweichung nennen C, die mittlere absolute Abweichung nennt B und hält A und C für gleich breit.'},
    reveal:'Drei typische Erfindungen und ihre Ergebnisse (A / B / C):\n\n- **Spannweite** (größter minus kleinster Wert): $2$ / $4$ / $8$\n- **mittlere absolute Abweichung** $\\langle|x - 5|\\rangle$: $1$ / $4/3$ / $1$\n- **Standardabweichung** $\\sqrt{\\langle(x - 5)^2\\rangle}$: $1$ / $\\sqrt{8/3}\\approx 1{,}63$ / $2$\n\nEs gibt also nicht „die“ Breite – man wählt ein Maß. Die Spannweite beachtet nur die Extremwerte, nicht wie wahrscheinlich sie sind; für eine Gauß-Verteilung wäre sie unendlich. Die mittlere absolute Abweichung ist vernünftig, aber mit Beträgen rechnet es sich schlecht. Die Standardabweichung gewichtet seltene, weit entfernte Werte stärker (deshalb liegt C vorn). Sie hat die einfache Form $\\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}$, und ihre Quadrate addieren sich bei unabhängigen Größen. Deshalb ist sie in Physik und Statistik das Standardmaß – und in der Quantenmechanik die Unschärfe $\\Delta x$.'
  },
  clarify:{
    core:'Eine **Zufallsgröße** ist diskret (Werte $x_n$ mit Wahrscheinlichkeiten $P_n$) oder kontinuierlich (Dichte $\\rho(x)$, Einheit $1/\\text{Länge}$). Normierung und Intervallwahrscheinlichkeit:\n\n$$\\sum_n P_n = 1,\\qquad \\int\\rho\\,dx = 1,\\qquad P(a\\le x\\le b) = \\int_a^b\\rho(x)\\,dx.$$\n\nErwartungswert und Momente: $\\langle f(x)\\rangle = \\sum_n f(x_n)P_n$ bzw. $\\int f(x)\\rho(x)\\,dx$. Die Breite misst die Standardabweichung\n\n$$\\Delta x = \\sqrt{\\langle(x - \\langle x\\rangle)^2\\rangle} = \\sqrt{\\langle x^2\\rangle - \\langle x\\rangle^2}.$$\n\nGauß-Verteilung: $\\rho = \\frac{1}{\\sqrt{2\\pi}\\,\\sigma}e^{-(x-\\mu)^2/(2\\sigma^2)}$ mit $\\langle x\\rangle = \\mu$ und $\\Delta x = \\sigma$; etwa 68 % liegen in $\\mu\\pm\\sigma$.\n\nUnabhängig: $P(A\\text{ und }B) = P(A)P(B)$. Bedingt: $P(A|B) = P(A\\text{ und }B)/P(B)$. Eine Messreihe aus $N$ unabhängigen Messungen schätzt $\\langle x\\rangle$ mit dem Standardfehler $\\Delta x/\\sqrt N$; die Einzelwerte streuen weiter mit $\\Delta x$.',
    keys:[
      '$\\rho(x)$ ist Wahrscheinlichkeit pro Länge und darf größer als 1 sein. Wahrscheinlichkeiten gibt es nur für Intervalle.',
      'Erst normieren, dann Wahrscheinlichkeiten und Erwartungswerte berechnen.',
      '$\\langle x\\rangle$ ist ein Mittel über viele Messungen. Es muss kein möglicher Messwert sein und ist im Allgemeinen nicht der wahrscheinlichste Wert.',
      'Linearität: $\\langle ax + b\\rangle = a\\langle x\\rangle + b$ und $\\Delta(ax + b) = |a|\\,\\Delta x$. Aber $\\langle x^2\\rangle \\ne \\langle x\\rangle^2$, außer wenn $\\Delta x = 0$.',
      'Symmetrie spart Arbeit: Ist $\\rho$ symmetrisch um $x_0$, dann ist $\\langle x\\rangle = x_0$.',
      'In der Quantenmechanik ist $\\rho = |\\psi|^2$ bzw. $P_n = |c_n|^2$, und $\\Delta x$ ist die Unschärfe – eine Eigenschaft des Zustands, kein Gerätefehler.'
    ],
    errors:[
      '$\\rho(x_0)$ als Wahrscheinlichkeit lesen.',
      '$\\Delta x = \\sqrt{\\langle x^2\\rangle}$ rechnen: Es fehlt $-\\langle x\\rangle^2$.',
      'Ungewichtet mitteln: $(E_1 + E_2 + E_3)/3$ statt $\\sum_nE_nP_n$.',
      'Für „beide“ addieren statt multiplizieren, für „mindestens eines“ addieren statt über das Gegenereignis rechnen.',
      '$P(A|B)$ mit $P(B|A)$ verwechseln.'
    ],
    more:[
      {title:'Warum $N - 1$ in der empirischen Standardabweichung?', text:'Die Abweichungen $x_i - \\bar x$ sind im Mittel etwas kleiner als die Abweichungen $x_i - \\langle x\\rangle$, weil $\\bar x$ aus denselben Daten berechnet ist und genau in ihrer Mitte liegt. Man kann zeigen: $\\left\\langle\\sum_i(x_i - \\bar x)^2\\right\\rangle = (N - 1)(\\Delta x)^2$. Teilt man durch $N - 1$, trifft $s^2$ im Mittel genau $(\\Delta x)^2$.'},
      {title:'Varianz einer Summe unabhängiger Größen', text:'Für unabhängige $x$ und $y$ ist $\\langle xy\\rangle = \\langle x\\rangle\\langle y\\rangle$. Daraus folgt $(\\Delta(x + y))^2 = \\langle(x + y)^2\\rangle - \\langle x + y\\rangle^2 = (\\Delta x)^2 + (\\Delta y)^2$, denn die Mischterme $2\\langle xy\\rangle - 2\\langle x\\rangle\\langle y\\rangle$ heben sich weg. Die Summe von $N$ unabhängigen Messwerten hat also die Varianz $N(\\Delta x)^2$, ihr Mittelwert $(\\Delta x)^2/N$.'}
    ],
    checks:[
      {q:'Eine Zufallsgröße hat $\\langle x\\rangle = 3$ und $\\Delta x = 2$. Wie groß ist $\\langle x^2\\rangle$?', opts:['$13$', '$5$', '$7$'], a:0, ex:'$\\langle x^2\\rangle = (\\Delta x)^2 + \\langle x\\rangle^2 = 4 + 9 = 13$.'},
      {q:'Welche Aussage über eine Gauß-Dichte mit den Parametern $\\mu$ und $\\sigma$ stimmt?', opts:['Etwa 68 % der Werte liegen in $\\mu \\pm \\sigma$.', 'Etwa 68 % der Werte liegen in $\\mu \\pm 2\\sigma$.', 'Alle Werte liegen in $\\mu \\pm 3\\sigma$.'], a:0, ex:'68,3 % liegen in $\\mu\\pm\\sigma$, 95,4 % in $\\mu\\pm 2\\sigma$, 99,7 % in $\\mu\\pm 3\\sigma$ – nie alle, denn die Dichte ist überall positiv.'}
    ]
  },
  lab:{type:'prob', title:'Dichte, Intervall, Erwartungswert und Streuung',
    map:[
      {sym:R`\rho(x) = |\psi(x)|^2`, ctl:'Wellenfunktion', says:R`Wählt eine von sechs normierten Dichten auf $[0, L]$. Die dicke blaue Kurve ist $\rho = |\psi|^2$, die gestrichelte $\psi$ selbst.`},
      {sym:'a', ctl:'untere Grenze a/L', says:R`Die untere Grenze des Intervalls, in Einheiten von $L$. Die blau gefüllte Fläche beginnt hier.`},
      {sym:'b', ctl:'obere Grenze b/L', says:R`Die obere Grenze des Intervalls. Liegen beide Grenzen dicht beieinander, ist die Fläche etwa $\rho\cdot(b - a)$.`},
      {sym:R`P(a \le x \le b) = \int_a^b\rho\,dx`, ctl:'Wahrscheinlichkeit im Intervall', says:R`Die Anzeige nennt die blau gefüllte Fläche. Sie ist höchstens $1$, auch wenn die Kurve höher als $1/L$ ist.`},
      {sym:R`\langle x\rangle`, ctl:'⟨x⟩', says:R`Die rote, senkrechte Linie ist der Erwartungswert $\int x\,\rho\,dx$, der Schwerpunkt der Dichte. Bei symmetrischen Dichten liegt sie bei $L/2$. Der hell rot eingefärbte Streifen um sie reicht von $\langle x\rangle - \Delta x$ bis $\langle x\rangle + \Delta x$; die Anzeige nennt $\Delta x$.`},
      {sym:R`\rho\cdot L`, ctl:'|ψ|² · L', says:R`Die senkrechte Achse zeigt die Dichte mal $L$, eine reine Zahl. Werte über $1$ sind erlaubt; nur Flächen müssen höchstens $1$ sein.`}
    ],
    sketch:{id:'st-lab-s', kind:'curve', draw:'abs2', title:'Vorhersage: die Dichte einer Überlagerung',
      text:'Gleich zeigt das Labor die Dichte $\\rho = |\\psi|^2$ für $\\psi = (\\psi_1 + \\psi_2)/\\sqrt2$ mit $\\psi_n = \\sqrt{2/L}\\sin(n\\pi x/L)$ auf $[0, L]$, $L = 1$. Skizziere vorher $\\rho(x)$. Die Achse ist absolut. Stell danach im Labor die Wellenfunktion $(\\psi_1 + \\psi_2)/\\sqrt2$ ein und vergleiche; die rote Linie zeigt $\\langle x\\rangle$.',
      plot:{x:[0, 1], y:[-0.85, 3.4], abs:true, xlab:'x', ylab:'\\rho(x)', ticks:[{x:0, lab:'0'}, {x:0.25, lab:'L/4'}, {x:0.5, lab:'L/2'}, {x:0.75, lab:'3L/4'}, {x:1, lab:'L'}], yticks:[{y:1, lab:'1'}, {y:2, lab:'2'}, {y:3, lab:'3'}]},
      // ρ = (sin πx + sin 2πx)²: Maximum 3,10 bei x ≈ 0,30; Nullstelle bei x = 2/3 (sin πx(1 + 2cos πx) = 0); Fläche 1; ⟨x⟩ = 1/2 − 16/(9π²) ≈ 0,320
      f:x => (Math.sin(Math.PI * x) + Math.sin(2 * Math.PI * x)) ** 2,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Wahrscheinlichkeitsdichte negativ sein?'},
        {id:'rand', type:'zero', at:[0, 1], msg:'Welchen Wert haben $\\psi_1$ und $\\psi_2$ an den Wänden?'},
        {id:'lage', type:'center', x:0.31, tol:0.07, msg:'Wo addieren sich $\\psi_1$ und $\\psi_2$, wo heben sie sich teilweise auf? Wo liegt dann der Schwerpunkt $\\langle x\\rangle$? (Abschnitt „Erwartungswert und Momente“)'},
        {id:'flaeche', type:'area', v:1, tol:0.25, msg:'Welche Fläche hat eine normierte Dichte? Deine ist etwa {got}. Wie hoch muss $\\rho$ dann werden, wenn fast alles in der linken Hälfte liegt?'}
      ],
      reveal:'Links haben $\\sin(\\pi x)$ und $\\sin(2\\pi x)$ dasselbe Vorzeichen und addieren sich, rechts von $x = L/2$ heben sie sich teilweise auf; bei $x = 2L/3$ ist $\\rho = 0$. Fast die ganze Wahrscheinlichkeit liegt deshalb links, mit einem Maximum von etwa $3{,}1/L$ bei $x \\approx 0{,}3\\,L$ – eine Dichte darf größer als $1/L$ sein, nur die Fläche ist 1. Der Schwerpunkt liegt bei $\\langle x\\rangle = L/2 - 16L/(9\\pi^2) \\approx 0{,}32\\,L$, also nicht in der Mitte. Ohne den Mischterm $2\\psi_1\\psi_2$ wäre die Dichte symmetrisch.',
      hints:['Zeichne zuerst $\\psi_1 + \\psi_2$: Wo haben die beiden Sinusfunktionen dasselbe Vorzeichen, wo verschiedene? Quadriere dann.', '$\\rho = \\frac12(\\psi_1 + \\psi_2)^2 = \\frac12\\psi_1^2 + \\frac12\\psi_2^2 + \\psi_1\\psi_2$. Der Mischterm ist links positiv und rechts negativ.'],
      wrong:[
        {f:x => Math.sin(Math.PI * x) ** 2 + Math.sin(2 * Math.PI * x) ** 2, fails:['lage'], why:'Mischterm vergessen: Wahrscheinlichkeiten statt Amplituden addiert'},
        {f:x => (Math.sin(Math.PI * x) - Math.sin(2 * Math.PI * x)) ** 2, fails:['lage'], why:'Vorzeichen des Mischterms falsch: Gewicht rechts'},
        {f:x => (Math.sin(Math.PI * x) + Math.sin(2 * Math.PI * x)) ** 2 / 3.1, fails:['flaeche'], why:'Dichte ≤ 1 gedacht: Maximum 1 statt Fläche 1'}
      ]},
    text:'Das Labor zeigt sechs Ortsdichten $\\rho(x) = |\\psi(x)|^2$ auf $[0, L]$ mit $L = 1$, alle normiert; gestrichelt ist $\\psi$ selbst. „Dreieck“ heißt: $\\psi$ steigt bis zur Mitte linear an und fällt dann linear ab. „Gauß“ ist eine Glocke um $L/2$ mit der Standardabweichung $0{,}13\\,L$, bei der „Exponentialdichte“ ist $\\psi \\propto e^{-x/(0{,}7L)}$, also $\\rho \\propto e^{-2x/(0{,}7L)}$ (die Anzeige nennt die Abklinglänge $0{,}7\\,L$ „$\\ell$“; das ist nicht die untere Grenze $a$). Die Fläche zwischen den Grenzen $a$ und $b$ ist $P(a \\le x \\le b)$. Die rote Linie markiert $\\langle x\\rangle$, der helle Streifen reicht von $\\langle x\\rangle - \\Delta x$ bis $\\langle x\\rangle + \\Delta x$.',
    predict:{q:'Bevor du das Labor bedienst: Welche dieser vier Dichten hat das kleinste $\\Delta x$?', opts:['die Überlagerung $(\\psi_1 + \\psi_2)/\\sqrt2$', 'das Dreieck mit spitzem Gipfel', 'die Parabel $\\psi \\propto x(L - x)$', 'der Grundzustand $\\psi_1$'], a:0, ex:'Die Überlagerung: $\\Delta x \\approx 0{,}14\\,L$. Die Interferenz drängt die Dichte in die linke Hälfte, dort wird sie hoch und schmal. Es folgen das Dreieck ($0{,}16\\,L$), $\\psi_1$ ($0{,}18\\,L$) und die Parabel ($0{,}19\\,L$). Eine Überlagerung ist also nicht automatisch breiter als ihre Bestandteile. Von den beiden übrigen Dichten im Labor ist die Gauß-Dichte mit $\\Delta x = 0{,}13\\,L$ noch etwas schmaler, die Exponentialdichte mit $\\Delta x \\approx 0{,}24\\,L$ die breiteste.'},
    questions:[
      {q:'Wähle $\\psi_1$ und stelle die Grenzen auf $\\langle x\\rangle \\pm \\Delta x$, also etwa $a = 0{,}32$ und $b = 0{,}68$. Welcher Anteil liegt im Streifen?', opts:['etwa $0{,}65$', 'genau $0{,}68$', 'etwa $0{,}95$'], a:0, ex:'$P \\approx 0{,}65$. Die 68-%-Regel gilt nur für die Gauß-Verteilung. Bei der Parabel sind es etwa 0,64, beim Dreieck 0,68, bei der Überlagerung 0,73.'},
      {q:'Wähle die Überlagerung und stelle $a = 0$, $b = 0{,}32$ ein, also bis $\\langle x\\rangle$. Welcher Anteil liegt links von $\\langle x\\rangle$?', opts:['etwa $0{,}53$', 'genau $0{,}50$', 'etwa $0{,}32$'], a:0, ex:'Etwa 53 %. Bei einer unsymmetrischen Dichte teilt der Erwartungswert die Wahrscheinlichkeit nicht in zwei Hälften; das tut der Median (hier etwa $0{,}31\\,L$). Erwartungswert, Median und Maximum (etwa $0{,}30\\,L$) liegen nahe beieinander, aber nicht aufeinander.'}
    ],
    noPic:{q:'Ohne Bild: Eine Dichte auf $[0, L]$ hat $\\langle x\\rangle = 0{,}5\\,L$ und $\\Delta x = 0{,}18\\,L$. Das ganze System wird um $2L$ nach rechts verschoben. Was gilt danach?', opts:['$\\langle x\\rangle = 2{,}5\\,L$ und $\\Delta x = 0{,}18\\,L$', '$\\langle x\\rangle = 2{,}5\\,L$ und $\\Delta x = 2{,}18\\,L$', '$\\langle x\\rangle = 0{,}5\\,L$ und $\\Delta x = 0{,}18\\,L$'], a:0, ex:'Verschieben ändert den Erwartungswert um die Verschiebung und die Breite gar nicht: $\\langle x + c\\rangle = \\langle x\\rangle + c$, $\\Delta(x + c) = \\Delta x$.'}},
  compare:{
    text:'Gesucht ist die Varianz der Dichte $\\rho(x) = 6x(1 - x)$ auf $[0, 1]$. Sie ist symmetrisch um $1/2$, also $\\langle x\\rangle = 1/2$. Zwei richtige Wege:',
    ctx:DENS('6x(1 - x)', 'sqrt(6x(1 - x))', {domain:{x:['0', '1']}}),
    A:{name:'Über die Momente', model:['⟨x^2⟩ = ∫_0^1 x^2 ρ(x) dx', '= 6 ∫_0^1 (x^3 - x^4) dx', '= 3/10', {l:'(Δx)^2 = 3/10 - 1/4', w:'⟨x²⟩ − ⟨x⟩²'}, '= 1/20']},
    B:{name:'Direkt um die Mitte', text:'Mit $u = x - 1/2$ wird $\\rho = 6\\,(1/4 - u^2)$ und $(x - \\langle x\\rangle)^2 = u^2$.', model:['(Δx)^2 = ∫_0^1 (x - 1/2)^2 ρ(x) dx', '= 6 ∫_{-1/2}^{1/2} u^2 (1/4 - u^2) du', {l:'= 12 ∫_0^{1/2} (u^2/4 - u^4) du', w:'gerader Integrand'}, '= 12 (1/96 - 1/160)', '= 1/20']},
    questions:[
      {q:'Wann ist Weg B im Vorteil?', opts:['wenn $\\langle x\\rangle$ bekannt und $\\rho$ symmetrisch darum ist', 'wenn $\\langle x\\rangle$ noch gar nicht bekannt ist', 'nie, er ist immer der längere Weg'], a:0, ex:'Um die Mitte herum werden die Integranden gerade und die Grenzen symmetrisch. Ohne bekanntes $\\langle x\\rangle$ ist Weg A direkter.'},
      {q:'Messwerte liegen alle bei etwa $1000{,}0$ und streuen um $0{,}1$. Du rechnest mit 6 gültigen Stellen. Welcher Weg ist numerisch sicherer?', opts:['Weg B, denn A zieht zwei fast gleiche Zahlen ab.', 'Weg A, weil er weniger Schritte hat.', 'Beide, die Formeln sind äquivalent.'], a:0, ex:'$\\langle x^2\\rangle \\approx 10^6$, die Varianz ist nur $0{,}01$. Mit 6 Stellen geht sie in der Differenz $\\langle x^2\\rangle - \\langle x\\rangle^2$ verloren (Auslöschung). Mathematisch sind beide Wege gleich, numerisch nicht.'}
    ]
  },
  practice:[
    {id:'st-p1', title:'Diskrete Verteilung: eine Energiemessung',
      text:'Eine Energiemessung liefert $E_1$, $4E_1$ oder $9E_1$ mit den Wahrscheinlichkeiten $P_n = C\\,(4 - n)$ für $n = 1, 2, 3$. Im Tutorial heißt die gemessene Energie `E`: Schreibe `⟨E⟩`, `⟨E^2⟩` und `ΔE`.',
      ctx:DISC({E:'(E_1, 0, 0; 0, 4E_1, 0; 0, 0, 9E_1)'}, '(sqrt(1/2); sqrt(1/3); sqrt(1/6))', {params:{E_1:'pos'}, unknowns:{C:{ref:'1/6'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $C$ aus der Normierung.', type:'solve', unknown:'C', points:2, ph:'Σ_{n=1}^3 C (4 - n) = 1',
          hints:['Was muss für die Wahrscheinlichkeiten aller möglichen Ergebnisse zusammen gelten?', 'Normierung: $\\sum_{n=1}^3 P_n = 1$.', 'Setze ein: $C\\,(3 + 2 + 1) = 1$.'],
          model:['Σ_{n=1}^3 C (4 - n) = 1', 'C (3 + 2 + 1) = 1', 'C = 1/6'],
          mistakes:[{expr:'1/3', msg:'Es gibt drei Werte, aber sie sind nicht gleich wahrscheinlich. Die Summe der Gewichte ist $3 + 2 + 1 = 6$.'}]},
        {id:'b', prompt:'b) Berechne $\\langle E\\rangle$.', type:'value', target:'10/3 E_1', points:2, ph:'⟨E⟩ = Σ_n E_n P_n',
          hints:['Gesucht ist der gewichtete Mittelwert der möglichen Messwerte.', '$\\langle E\\rangle = \\sum_n E_nP_n$ mit $P_n = \\frac12, \\frac13, \\frac16$.', 'Erster Summand: $E_1\\cdot\\frac12$. Jetzt die beiden anderen.'],
          model:['⟨E⟩ = 1/2 E_1 + 1/3 · 4E_1 + 1/6 · 9E_1', '= 10/3 E_1'],
          mistakes:[{expr:'14/3 E_1', msg:'Das ist der ungewichtete Mittelwert $(1 + 4 + 9)E_1/3$. Gewichte jeden Wert mit seiner Wahrscheinlichkeit.'}]},
        {id:'c', prompt:'c) Berechne die Standardabweichung $\\Delta E$.', type:'value', target:'sqrt(74) E_1/3', points:3, ph:'⟨E^2⟩ = Σ_n E_n^2 P_n',
          hints:['Für die Breite brauchst du zusätzlich das zweite Moment $\\langle E^2\\rangle$.', '$(\\Delta E)^2 = \\langle E^2\\rangle - \\langle E\\rangle^2$ mit $\\langle E^2\\rangle = \\sum_nE_n^2P_n$.', '$\\langle E^2\\rangle = \\frac12E_1^2 + \\frac13\\cdot 16E_1^2 + \\frac16\\cdot 81E_1^2$.'],
          model:['⟨E^2⟩ = 1/2 E_1^2 + 1/3 · 16E_1^2 + 1/6 · 81E_1^2', '= 58/3 E_1^2', 'ΔE = sqrt(⟨E^2⟩ - ⟨E⟩^2)', '= sqrt(58/3 - 100/9) E_1', '= sqrt(74) E_1/3'],
          mistakes:[{expr:'sqrt(58/3) E_1', msg:'Das ist $\\sqrt{\\langle E^2\\rangle}$. Für $\\Delta E$ fehlt noch $-\\langle E\\rangle^2$.'}],
          note:'$\\Delta E \\approx 2{,}87\\,E_1$ und $\\langle E\\rangle \\approx 3{,}33\\,E_1$. Keine einzelne Messung liefert $\\langle E\\rangle$.'}
      ]},
    {id:'st-p2', title:'Lebensdauer eines angeregten Atoms',
      text:'Ein angeregtes Atom zerfällt nach einer zufälligen Zeit $t \\ge 0$. Die Dichte ist $\\rho(t) = A\\,e^{-t/\\tau}$ mit einer festen Zeit $\\tau > 0$; für $t < 0$ ist $\\rho = 0$.',
      ctx:{coords:['t'], space:['t'], domain:{t:['0', '∞']}, params:{τ:'pos'}, defs:{'ρ(t)':'A e^(-t/τ)', 'ψ(t)':'e^(-t/(2τ))/sqrt(τ)'}, unknowns:{A:{ref:'1/τ'}, T_h:{ref:'τ ln(2)'}}},
      goals:[
        {id:'a', prompt:'a) Bestimme $A$.', type:'solve', unknown:'A', points:2, ph:'∫_0^∞ ρ(t) dt = 1',
          hints:['Gesucht ist der Vorfaktor, der die Gesamtwahrscheinlichkeit 1 macht.', 'Normierung $\\int_0^\\infty\\rho(t)\\,dt = 1$ mit $\\int_0^\\infty e^{-t/\\tau}dt = \\tau$.'],
          model:['∫_0^∞ ρ(t) dt = 1', 'A τ = 1', 'A = 1/τ'],
          mistakes:[{expr:'τ', msg:'Prüfe die Einheit: $\\rho\\,dt$ ist dimensionslos, also hat $A$ die Einheit $1/\\text{Zeit}$.'}]},
        {id:'b', prompt:'b) Berechne die mittlere Lebensdauer $\\langle t\\rangle$.', type:'value', target:'τ', points:2, ph:'⟨t⟩ = ∫_0^∞ t ρ(t) dt',
          hints:['Gewichte jede Zeit mit ihrer Dichte und integriere.', '$\\langle t\\rangle = \\int_0^\\infty t\\,\\rho(t)\\,dt$; nützlich: $\\int_0^\\infty t\\,e^{-t/\\tau}dt = \\tau^2$ (partielle Integration).', 'Mit $A = 1/\\tau$: $\\langle t\\rangle = \\frac1\\tau\\cdot\\tau^2$.'],
          model:['⟨t⟩ = ∫_0^∞ t e^(-t/τ)/τ dt', '= 1/τ · τ^2', '= τ']},
        {id:'c', prompt:'c) Bis zu welcher Zeit $T_h$ ist ein Atom mit Wahrscheinlichkeit $1/2$ zerfallen (Halbwertszeit, Median)? Schreibe `T_h`.', type:'solve', unknown:'T_h', points:3, ph:'∫_0^{T_h} ρ(t) dt = 1/2',
          hints:['Gesucht ist die Zeit, bis zu der die Hälfte der Wahrscheinlichkeit liegt.', '$\\int_0^{T}\\frac1\\tau e^{-t/\\tau}dt = 1 - e^{-T/\\tau}$.', 'Aus $e^{-T_h/\\tau} = \\frac12$ folgt durch Logarithmieren $T_h/\\tau = \\dots$'],
          model:['∫_0^{T_h} e^(-t/τ)/τ dt = 1/2', '1 - e^(-T_h/τ) = 1/2', 'e^(-T_h/τ) = 1/2', 'T_h = τ ln(2)'],
          mistakes:[{expr:'τ/2', msg:'Die Hälfte der *Zeit* ist nicht die Hälfte der *Wahrscheinlichkeit*. Setze $\\int_0^{T_h}\\rho\\,dt = 1/2$ an.'}],
          note:'$T_h = \\tau\\ln 2 \\approx 0{,}69\\,\\tau$ ist kleiner als die mittlere Lebensdauer $\\tau$: Wenige sehr lange Lebensdauern ziehen den Mittelwert nach oben. Median und Erwartungswert sind verschiedene „Mitten“.'}
      ]},
    {id:'st-p3', title:'Gauß-Dichte: Normierung und Breite',
      text:'Die Ortsdichte eines Gauß-Pakets ist $\\rho(x) = A\\,e^{-x^2/(2a^2)}$ mit $a > 0$. Nützlich: $\\int_{-\\infty}^\\infty e^{-\\alpha x^2}dx = \\sqrt{\\pi/\\alpha}$ und $\\int_{-\\infty}^\\infty x^2e^{-\\alpha x^2}dx = \\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$.',
      ctx:DENS('A e^(-x^2/(2a^2))', 'e^(-x^2/(4a^2))', {params:{a:'pos'}, unknowns:{A:{ref:'1/(sqrt(2π) a)'}}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $A$.', type:'solve', unknown:'A', points:2, ph:'∫_-∞^∞ ρ(x) dx = 1',
          hints:['Normierung: Die Fläche unter $\\rho$ muss 1 sein.', 'Gauß-Integral mit $\\alpha = 1/(2a^2)$: $\\sqrt{\\pi/\\alpha} = \\sqrt{2\\pi a^2}$.'],
          model:['∫_-∞^∞ ρ(x) dx = 1', 'A sqrt(2π a^2) = 1', 'A = 1/(sqrt(2π) a)'],
          mistakes:[{expr:'1/sqrt(2π a)', msg:'Prüfe die Einheit: $A$ hat wie $\\rho$ die Einheit $1/\\text{Länge}$, also $1/a$, nicht $1/\\sqrt a$.'}]},
        {id:'b', prompt:'b) Berechne $\\Delta x$.', type:'value', target:'a', points:3, ph:'⟨x^2⟩ = ∫_-∞^∞ x^2 ρ(x) dx',
          hints:['Was weißt du ohne Rechnung über $\\langle x\\rangle$? Dann fehlt nur $\\langle x^2\\rangle$.', '$\\rho$ ist gerade, also $\\langle x\\rangle = 0$ und $(\\Delta x)^2 = \\langle x^2\\rangle$.', '$\\langle x^2\\rangle = A\\cdot\\frac{1}{2\\alpha}\\sqrt{\\pi/\\alpha}$ mit $\\frac{1}{2\\alpha} = a^2$.'],
          model:['⟨x⟩ = 0', '⟨x^2⟩ = 1/(sqrt(2π) a) ∫_-∞^∞ x^2 e^(-x^2/(2a^2)) dx', '= 1/(sqrt(2π) a) · a^2 sqrt(2π a^2)', '= a^2', 'Δx = sqrt(a^2 - 0)', '= a'],
          mistakes:[{expr:'a^2', msg:'Das ist die Varianz $(\\Delta x)^2$. Die Standardabweichung ist ihre Wurzel.'}],
          note:'Der Parameter im Exponenten ist direkt die Standardabweichung, wenn er in der Form $2a^2$ geschrieben ist. Für $\\psi \\propto e^{-x^2/(4a^2)}$ gilt deshalb $\\Delta x = a$.'}
      ]},
    {id:'st-p4', title:'Unabhängige Spinmessungen',
      text:'Ein Spin-½-Teilchen ist so präpariert, dass eine Messung von $S_z$ mit Wahrscheinlichkeit $4/5$ den Wert $+\\hbar/2$ („auf“) und sonst $-\\hbar/2$ („ab“) liefert. Drei Teilchen werden unabhängig voneinander so präpariert und je einmal gemessen.',
      ctx:{coords:['x'], params:{}},
      goals:[
        {id:'a', prompt:'a) Wie wahrscheinlich liefert genau eines der drei „ab“?', type:'value', target:'48/125', points:2, ph:'P = …',
          hints:['Zähle die Möglichkeiten: Welches der drei Teilchen liefert „ab“? Jede Möglichkeit ist ein Produkt aus drei Faktoren.', 'Unabhängig: $P(\\text{auf, auf, ab}) = \\frac45\\cdot\\frac45\\cdot\\frac15$. Es gibt drei solche Anordnungen.', 'Also $P = 3\\cdot\\frac{16}{125}$.'],
          model:['P = 3 · 4/5 · 4/5 · 1/5', '= 48/125'],
          mistakes:[{expr:'16/125', msg:'Das ist nur eine Anordnung. „Ab“ kann beim ersten, zweiten oder dritten Teilchen auftreten.'}]},
        {id:'b', prompt:'b) Mindestens zwei Teilchen haben „auf“ geliefert. Wie wahrscheinlich haben dann alle drei „auf“ geliefert?', type:'value', target:'4/7', points:3, ph:'P = …',
          hints:['Gesucht ist eine bedingte Wahrscheinlichkeit $P(A|B)$ mit $A$ = „alle drei auf“ und $B$ = „mindestens zwei auf“.', '$P(A|B) = P(A\\text{ und }B)/P(B)$. Weil $A$ in $B$ enthalten ist, gilt $P(A\\text{ und }B) = P(A) = (4/5)^3$.', '$P(B) = P(\\text{drei auf}) + P(\\text{genau zwei auf}) = \\frac{64}{125} + \\frac{48}{125}$.'],
          model:['P = (64/125)/(64/125 + 48/125)', '= 64/112', '= 4/7'],
          mistakes:[{expr:'64/125', msg:'Das ist $P(\\text{alle drei auf})$ ohne Bedingung. Die Bedingung schränkt auf die Fälle mit mindestens zwei „auf“ ein: Teile durch $P(B)$.'}],
          note:'Die Bedingung hebt die Wahrscheinlichkeit von $0{,}51$ auf $0{,}57$.'}
      ]},
    {id:'st-p5', title:'Messreihe im Kasten: Standardfehler',
      text:'Ein Teilchen im Kasten $0 < x < L$ ist im Grundzustand $\\psi(x) = \\sqrt{2/L}\\,\\sin(\\pi x/L)$. Es gilt $\\langle x\\rangle = L/2$ und $\\langle x^2\\rangle = L^2\\left(\\frac13 - \\frac{1}{2\\pi^2}\\right)$ (Thema 3). Man misst den Ort an $N$ gleich präparierten Teilchen und bildet den Mittelwert $\\bar x$. Nenne seinen Standardfehler `σ_m`.',
      ctx:{coords:['x'], domain:{x:['0', 'L']}, params:{L:'pos'}, defs:{'ψ(x)':'sqrt(2/L) sin(π x/L)'}, normalized:true, unknowns:{N:{ref:'10^4 (1/12 - 1/(2π^2))'}}},
      goals:[
        {id:'a', prompt:'a) Berechne $\\Delta x$ und daraus $\\sigma_m$ für $N = 100$.', type:'value', target:'L sqrt(1/12 - 1/(2π^2))/10', points:3, ph:'Δx = sqrt(⟨x^2⟩ - ⟨x⟩^2)',
          hints:['Erst die Streuung der Einzelwerte, dann die des Mittelwerts.', '$(\\Delta x)^2 = \\langle x^2\\rangle - \\langle x\\rangle^2$ und $\\sigma_m = \\Delta x/\\sqrt N$.', '$\\Delta x = L\\sqrt{1/12 - 1/(2\\pi^2)}$; teile durch $\\sqrt{100}$.'],
          model:['Δx = sqrt(L^2 (1/3 - 1/(2π^2)) - L^2/4)', '= L sqrt(1/12 - 1/(2π^2))', 'σ_m = Δx/sqrt(100)', '= L sqrt(1/12 - 1/(2π^2))/10'],
          mistakes:[{expr:'L sqrt(1/12 - 1/(2π^2))/100', msg:'Der Standardfehler fällt wie $1/\\sqrt N$, nicht wie $1/N$.'}],
          note:'$\\Delta x \\approx 0{,}18\\,L$, also $\\sigma_m \\approx 0{,}018\\,L$.'},
        {id:'b', prompt:'b) Wie groß muss $N$ sein, damit $\\sigma_m = 0{,}01\\,L$ ist?', type:'solve', unknown:'N', points:2, ph:'Δx/sqrt(N) = L/100',
          hints:['Löse $\\sigma_m = \\Delta x/\\sqrt N$ nach $N$ auf.', '$N = (\\Delta x/\\sigma_m)^2$.'],
          model:['Δx/sqrt(N) = L/100', 'sqrt(N) = 100 Δx/L', 'N = 10^4 (1/12 - 1/(2π^2))'],
          note:'$N \\approx 327$. Für einen zehnmal kleineren Standardfehler braucht man hundertmal so viele Messungen.'}
      ]}
  ],
  concept:[
    {id:'st-c1', type:'dialog', seg:'st-t3', text:'Ein Teilchen im Kasten ist im Zustand $\\psi = (\\psi_1 + \\psi_2)/\\sqrt2$ mit den Energien $E_1$ und $E_2 = 4E_1$. Damit ist $\\langle E\\rangle = 2{,}5\\,E_1$.',
      people:[{name:'Lena', says:'Misst man die Energie eines solchen Teilchens, kommt $2{,}5\\,E_1$ heraus – das ist ja der Erwartungswert.'}, {name:'Jonas', says:'Jede einzelne Messung liefert $E_1$ oder $4E_1$. Erst der Mittelwert vieler Messungen an gleich präparierten Teilchen liegt bei $2{,}5\\,E_1$.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Mögliche Messwerte sind nur $E_1$ und $E_2$, je mit Wahrscheinlichkeit $1/2$. Der Erwartungswert ist ein gewichtetes Mittel und muss selbst kein möglicher Messwert sein – wie die 3,5 beim Würfel.'},
    {id:'st-c2', type:'mc2', seg:'st-t2', lex:'stat-dichte', q:'Für eine Ortsdichte ergibt sich $\\rho(x_0) = 3\\,\\mathrm{nm}^{-1}$. Ist das möglich?', opts:['Ja, das ist möglich.', 'Nein, Wahrscheinlichkeiten sind höchstens 1.', 'Nur wenn das Teilchen sicher bei $x_0$ ist.'], a:0,
      ex:'Werte über $1\\,\\mathrm{nm}^{-1}$ sind für Dichten normal, wenn die Verteilung schmaler als etwa $1\\,\\mathrm{nm}$ ist.',
      reason:{q:'Warum?', opts:['$\\rho$ ist Wahrscheinlichkeit pro Länge; erst $\\int\\rho\\,dx$ muss $\\le 1$ sein.', 'Werte über 1 sind bei Dichten nur Rundungsfehler.', '$\\rho(x_0)$ ist die Wahrscheinlichkeit am Punkt $x_0$.'], a:0, ex:'Eine Wahrscheinlichkeit entsteht erst durch Integration über ein Intervall: $P \\approx \\rho(x_0)\\,\\Delta x$, etwa $0{,}03$ für $\\Delta x = 0{,}01\\,\\mathrm{nm}$.'}},
    {id:'st-c3', type:'mc', seg:'st-t4', lex:'unschaerfe', q:'Ein ideales Messgerät ohne jeden Messfehler misst den Ort vieler Teilchen, die alle im selben Zustand $\\psi$ präpariert sind. Was zeigen die Messwerte?', opts:['Sie streuen mit der Standardabweichung $\\Delta x$ des Zustands.', 'Sie sind alle gleich $\\langle x\\rangle$, das Gerät ist ja ideal.', 'Sie streuen nur, weil die Messung jedes Teilchen stört.'], a:0,
      ex:'Die Streuung steckt in $|\\psi|^2$ selbst: Gleich präparierte Systeme liefern verschiedene Ergebnisse. $\\Delta x$ ist keine Messungenauigkeit und keine Folge einer Störung. Gleiche Werte gäbe es nur, wenn $|\\psi|^2$ auf einen Punkt konzentriert wäre.'},
    {id:'st-c4', type:'dialog', seg:'st-t7', text:'Für einen Zustand ist $\\langle x\\rangle = 0{,}50\\,L$ und $\\Delta x = 0{,}18\\,L$. Eine Messreihe mit $N = 9$ Ortsmessungen an gleich präparierten Teilchen ergibt $\\bar x = 0{,}56\\,L$.',
      people:[{name:'Lena', says:'Der Mittelwert weicht um $0{,}06\\,L$ ab. Also sind die Teilchen gar nicht in diesem Zustand.'}, {name:'Jonas', says:'$\\bar x$ schwankt von Messreihe zu Messreihe um etwa $\\Delta x/\\sqrt 9 = 0{,}06\\,L$. Eine Abweichung dieser Größe ist ganz normal.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:1,
      ex:'Der Standardfehler ist $0{,}18\\,L/3 = 0{,}06\\,L$. Eine Abweichung von mindestens einem Standardfehler kommt bei etwa jeder dritten Messreihe vor. Erst Abweichungen von mehreren Standardfehlern sprechen gegen den angenommenen Zustand.'},
    {id:'st-c5', type:'mc2', seg:'st-t6', lex:'stat-unabhaengig', q:'Ein Teilchen ist im Zustand $(\\psi_1 + \\psi_2)/\\sqrt2$. Am **selben** Teilchen wird die Energie zweimal direkt hintereinander gemessen. Sind die beiden Ergebnisse unabhängig?', opts:['Nein, das zweite ist gleich dem ersten.', 'Ja, jedes ist mit $P = 1/2$ gleich $E_1$.', 'Ja, Messergebnisse sind stets unabhängig.'], a:0,
      ex:'$P(E_1\\text{ beim zweiten}\\mid E_1\\text{ beim ersten}) = 1$, aber $P(E_1) = 1/2$. Unabhängig sind Messungen an verschiedenen, jeweils frisch präparierten Teilchen.',
      reason:{q:'Warum?', opts:['Die erste Messung bringt das Teilchen in den Eigenzustand zum Messwert.', 'Das Messgerät merkt sich das letzte Ergebnis.', 'Die Wahrscheinlichkeiten $|c_n|^2$ gelten nur beim zweiten Mal.'], a:0, ex:'Nach dem Messpostulat ist das Teilchen nach dem Ergebnis $E_1$ im Zustand $\\psi_1$. Dieser ist stationär, also liefert die zweite Messung sicher wieder $E_1$ (Thema 6).'}}
  ],
  sketch:[
    {id:'st-s1', kind:'curve', draw:'f', title:'Eine normierte Exponentialdichte',
      text:'Die Zerfallszeit $t$ eines Kerns hat die Dichte $\\rho(t) = A\\,e^{-t/\\tau}$ für $t \\ge 0$ mit $\\tau = 0{,}5\\,\\mathrm{s}$. Skizziere die **normierte** Dichte für $0 \\le t \\le 3\\,\\mathrm{s}$. Die Achse ist absolut, in $1/\\mathrm{s}$.',
      plot:{x:[0, 3], y:[-0.6, 2.4], abs:true, xlab:'t/\\mathrm{s}', ylab:'\\rho(t)\\cdot\\mathrm{s}', ticks:[{x:0, lab:'0'}, {x:0.5, lab:'0{,}5'}, {x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}], yticks:[{y:0.5, lab:'0{,}5'}, {y:1, lab:'1'}, {y:1.5, lab:'1{,}5'}, {y:2, lab:'2'}]},
      // Normierung: A = 1/τ = 2/s; ρ = 2e^{−2t}, Mittel über [0,02; 0,12] ≈ 1,74, Fläche über [0, 3] = 1 − e^{−6}
      f:t => 2 * Math.exp(-2 * t),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Dichte negativ sein?'},
        {id:'start', type:'level', range:[0.02, 0.12], v:1.74, tol:0.5, msg:'Welchen Wert muss $A$ haben, damit $\\int_0^\\infty\\rho\\,dt = 1$ gilt? Deine Kurve beginnt bei etwa {got}. (Abschnitt „Kontinuierliche Größen“)'},
        {id:'flaeche', type:'area', v:1, tol:0.3, msg:'Wie groß ist die Fläche unter deiner Kurve? Etwa {got}. Wie groß muss sie sein?'},
        {id:'abkl', type:'decay', toward:'right', msg:'Wie schnell fällt $e^{-t/\\tau}$ ab? Was ist nach $t = 6\\tau$ davon übrig?'}
      ],
      reveal:'Aus $\\int_0^\\infty A\\,e^{-t/\\tau}dt = A\\tau = 1$ folgt $A = 1/\\tau = 2/\\mathrm{s}$. Die Dichte beginnt also bei $2/\\mathrm{s}$ – größer als 1, denn sie ist eine Wahrscheinlichkeit **pro Zeit**. Nach jeweils $\\tau = 0{,}5\\,\\mathrm{s}$ fällt sie auf $1/e$; bei $t = 3\\,\\mathrm{s} = 6\\tau$ ist sie praktisch null. Die Fläche unter der Kurve ist 1.',
      hints:['Bestimme $A$ aus der Normierung und trage dann $\\rho(0)$ und ein, zwei weitere Werte ein.', '$\\int_0^\\infty e^{-t/\\tau}dt = \\tau$. Eine Dichte hat die Einheit $1/\\mathrm{s}$ und kann größer als 1 sein.'],
      wrong:[
        {f:t => Math.exp(-2 * t), fails:['start', 'flaeche'], why:'Dichte ≤ 1 gedacht: Maximum 1 statt Fläche 1'},
        {f:t => 0.5 * Math.exp(-2 * t), fails:['start', 'flaeche'], why:'A = τ statt A = 1/τ'},
        {f:t => 0.5 * Math.exp(-0.5 * t), fails:['start'], why:'τ und 1/τ verwechselt: Abklingzeit 2 s'}
      ]},
    {id:'st-s2', kind:'curve', draw:'f', title:'Verschieben und Strecken einer Dichte',
      text:'Die Größe $x$ ist gaußverteilt mit $\\langle x\\rangle = 0$ und $\\Delta x = 0{,}25$. Skizziere die Dichte der Größe $y = 2x + 1$. Die Achse ist absolut.',
      plot:{x:[-1.5, 3.5], y:[0, 2], abs:true, xlab:'y', ylab:'\\rho_y(y)', ticks:[{x:-1, lab:'-1'}, {x:0, lab:'0'}, {x:1, lab:'1'}, {x:2, lab:'2'}, {x:3, lab:'3'}], yticks:[{y:0.4, lab:'0{,}4'}, {y:0.8, lab:'0{,}8'}, {y:1.2, lab:'1{,}2'}, {y:1.6, lab:'1{,}6'}]},
      // ⟨y⟩ = 2⟨x⟩ + 1 = 1, Δy = 2Δx = 0,5; ρ_y(y) = ρ_x((y − 1)/2)/2: Gauß mit σ = 0,5, Höhe 0,798, Halbwertsbreite 1,177, Fläche 1
      f:y => Math.exp(-((y - 1) ** 2) / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.5),
      checks:[
        {id:'lage', type:'center', x:1, tol:0.2, msg:'Wie hängt $\\langle 2x + 1\\rangle$ mit $\\langle x\\rangle$ zusammen? (Abschnitt „Erwartungswert und Momente“)'},
        {id:'breite', type:'fwhm', v:1.177, tol:0.3, msg:'Was macht das Strecken mit dem Faktor 2 mit der Standardabweichung, was das Verschieben um 1? Auf halber Höhe ist deine Kurve {got} breit. (Abschnitt „Varianz und Standardabweichung“)'},
        {id:'flaeche', type:'area', range:[-0.8, 2.8], v:1, tol:0.25, msg:'Wie groß muss die Fläche unter $\\rho_y$ sein? Deine ist etwa {got}. Was folgt daraus für die Höhe, wenn die Kurve breiter wird?'}
      ],
      reveal:'$\\langle y\\rangle = 2\\langle x\\rangle + 1 = 1$ und $\\Delta y = 2\\,\\Delta x = 0{,}5$; das Verschieben um 1 ändert die Breite nicht. Die Dichte bleibt eine Gauß-Kurve, doppelt so breit wie die von $x$. Weil ihre Fläche 1 bleibt, ist sie nur halb so hoch: $1/(\\sqrt{2\\pi}\\cdot 0{,}5) \\approx 0{,}80$ statt $1{,}60$. Formal: $\\rho_y(y) = \\frac12\\rho_x\\big((y - 1)/2\\big)$.',
      hints:['Bestimme nacheinander $\\langle y\\rangle$, $\\Delta y$ und die Höhe. Die Form bleibt eine Glocke.', '$\\langle ax + b\\rangle = a\\langle x\\rangle + b$, $\\Delta(ax + b) = |a|\\,\\Delta x$, und eine Gauß-Dichte mit Standardabweichung $s$ hat die Höhe $1/(\\sqrt{2\\pi}\\,s)$.'],
      wrong:[
        {f:y => Math.exp(-((y - 1) ** 2) / (2 * 0.0625)) / (Math.sqrt(2 * Math.PI) * 0.25), fails:['breite'], why:'nur verschoben, nicht gestreckt'},
        {f:y => Math.exp(-((y - 1) ** 2) / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.25), fails:['flaeche'], why:'gestreckt, aber die Höhe nicht angepasst (Fläche 2)'},
        {f:y => Math.exp(-(y ** 2) / (2 * 0.25)) / (Math.sqrt(2 * Math.PI) * 0.5), fails:['lage'], why:'Verschiebung vergessen: ⟨y⟩ = 2⟨x⟩'},
        {f:y => Math.exp(-((y - 1) ** 2) / (2 * 2.25)) / (Math.sqrt(2 * Math.PI) * 1.5), fails:['breite'], why:'Verschiebung auch auf die Breite angewandt: Δy = 2Δx + 1'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'st-f1', title:'Normieren und Intervall', text:'Für $x \\ge 0$ ist $\\rho(x) = A\\,x\\,e^{-x/a}$ mit $a > 0$, für $x < 0$ ist $\\rho = 0$.',
      ctx:{coords:['x'], domain:{x:['0', '∞']}, params:{a:'pos'}, defs:{'ρ(x)':'A x e^(-x/a)'}, unknowns:{A:{ref:'1/a^2'}}},
      goals:[
        {id:'a', prompt:'a) Bestimme $A$.', type:'solve', unknown:'A', points:2, model:['∫_0^∞ ρ(x) dx = 1', 'A a^2 = 1', 'A = 1/a^2']},
        {id:'b', prompt:'b) Berechne $P(0 < x < a)$.', type:'value', target:'1 - 2/e', points:3, model:['P = ∫_0^a x e^(-x/a)/a^2 dx', '= [-(x + a) e^(-x/a)/a]_0^a', '= -2/e + 1', '= 1 - 2/e'],
          mistakes:[{expr:'1 - 1/e', msg:'Das wäre richtig für die Dichte $e^{-x/a}/a$. Hier steht ein zusätzlicher Faktor $x$; partiell integrieren.'}]}
      ]}},
    {aim:1, task:{id:'st-f2', title:'Streuung einer diskreten Größe', text:'Eine Messgröße $X$ nimmt die Werte $-1$, $0$ und $2$ mit den Wahrscheinlichkeiten $1/4$, $1/4$ und $1/2$ an. Schreibe `⟨X⟩`, `⟨X^2⟩` und `ΔX`.',
      ctx:DISC({X:'(-1, 0, 0; 0, 0, 0; 0, 0, 2)'}, '(1/2; 1/2; 1/sqrt(2))'),
      goals:[{id:'a', prompt:'Berechne $\\Delta X$.', type:'value', target:'3 sqrt(3)/4', points:3,
        model:['⟨X⟩ = -1 · 1/4 + 0 · 1/4 + 2 · 1/2', '= 3/4', '⟨X^2⟩ = 1 · 1/4 + 0 + 4 · 1/2', '= 9/4', 'ΔX = sqrt(9/4 - 9/16)', '= 3 sqrt(3)/4'],
        mistakes:[{expr:'3/2', msg:'Das ist $\\sqrt{\\langle X^2\\rangle}$. Es fehlt $-\\langle X\\rangle^2$.'}]}]}},
    {aim:2, q:'Drei Teilchen werden unabhängig voneinander im selben Zustand präpariert; für jedes ist $P(E_1) = 1/2$. Wie wahrscheinlich liefert mindestens eines $E_1$?', opts:['$7/8$', '$3/2$', '$1/8$', '$1/2$'], a:0, ex:'Gegenereignis: Keines liefert $E_1$, mit $(1/2)^3 = 1/8$. Also $1 - 1/8 = 7/8$. Addieren ($3/2$) ist falsch, denn die Ereignisse schließen sich nicht aus.'},
    {aim:'k', id:'st-fk1', type:'mc2', q:'Eine Ortsdichte ist eine Gauß-Kurve mit Maximum bei $x = \\mu$. Wie wahrscheinlich ist es, bei einer Messung **genau** $x = \\mu$ zu finden?', opts:['$0$', '$\\rho(\\mu)$', '$1/2$'], a:0,
      ex:'Für einen einzelnen Punkt ist die Wahrscheinlichkeit null, auch am Maximum.',
      reason:{q:'Warum?', opts:['Wahrscheinlichkeiten gibt es nur für Intervalle; ein Punkt hat die Breite null.', 'Am Maximum ist die Wahrscheinlichkeit gleich dem Wert der Dichte.', 'Die Hälfte der Fläche liegt links von $\\mu$.'], a:0, ex:'$P = \\int_\\mu^\\mu\\rho\\,dx = 0$. Sinnvoll ist nur $P(\\mu \\le x \\le \\mu + \\Delta) \\approx \\rho(\\mu)\\,\\Delta$ für ein kleines Intervall.'}},
    {aim:'k', id:'st-fk2', type:'dialog', text:'Ein Labor misst den Ort von Teilchen im selben Zustand mit $\\Delta x = 0{,}2\\,\\mathrm{nm}$. Nach $10\\,000$ Messungen ergibt sich die empirische Standardabweichung $s \\approx 0{,}2\\,\\mathrm{nm}$.',
      people:[{name:'Lena', says:'Der Mittelwert $\\bar x$ ist damit auf etwa $0{,}002\\,\\mathrm{nm}$ genau bestimmt.'}, {name:'Jonas', says:'Bei so vielen Messungen müsste $s$ längst viel kleiner als $0{,}2\\,\\mathrm{nm}$ sein.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Standardfehler: $\\Delta x/\\sqrt N = 0{,}2\\,\\mathrm{nm}/100 = 0{,}002\\,\\mathrm{nm}$. $s$ schätzt dagegen $\\Delta x$ und bleibt deshalb bei $0{,}2\\,\\mathrm{nm}$.'},
    {aim:0, sketch:{id:'st-fs-a', kind:'curve', draw:'f', title:'Eine Gleichverteilung', points:2,
      text:'Ein Teilchen ist auf dem Intervall $0 \\le x \\le 0{,}5\\,\\mathrm{nm}$ gleichverteilt. Skizziere die normierte Dichte $\\rho(x)$ auf diesem Intervall. Die Achse ist absolut, in $1/\\mathrm{nm}$.',
      plot:{x:[-0.1, 0.6], y:[-0.75, 3], abs:true, dom:[0, 0.5], xlab:'x/\\mathrm{nm}', ylab:'\\rho\\cdot\\mathrm{nm}', ticks:[{x:0, lab:'0'}, {x:0.25, lab:'0{,}25'}, {x:0.5, lab:'0{,}5'}], yticks:[{y:0.5, lab:'0{,}5'}, {y:1, lab:'1'}, {y:2, lab:'2'}]},
      // ρ = 1/(0,5 nm) = 2/nm auf [0; 0,5], Fläche 1
      f:x => 2,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Dichte negativ sein?'},
        {id:'hoehe', type:'level', range:[0.05, 0.45], v:2, tol:0.45, msg:'Wie hoch muss die Dichte sein, damit Breite mal Höhe 1 ergibt? Deine Höhe ist {got}.'},
        {id:'flaeche', type:'area', v:1, tol:0.15, msg:'Wie groß ist die Fläche unter deiner Kurve? Etwa {got}. Wie groß muss sie sein?'}
      ],
      reveal:'Gleichverteilt heißt: $\\rho$ ist auf dem Intervall konstant. Aus $\\int_0^{0{,}5\\,\\mathrm{nm}}\\rho\\,dx = 1$ folgt $\\rho = 2/\\mathrm{nm}$. Eine Dichte ist eine Wahrscheinlichkeit pro Länge und darf größer als 1 sein; erst $\\rho\\,\\Delta x$ ist eine Wahrscheinlichkeit.',
      wrong:[
        {f:x => 1, fails:['hoehe', 'flaeche'], why:'Dichte ≤ 1 gedacht: Höhe 1 statt Fläche 1'},
        {f:x => 0.5, fails:['hoehe', 'flaeche'], why:'mit der Intervallbreite multipliziert statt durch sie geteilt'}
      ]}}
  ],
  finalB:[
    {aim:0, task:{id:'st-fb4', title:'Normieren und Intervall', text:'Für $x \\ge 0$ ist $\\rho(x) = A\\,x\\,e^{-2x/a}$ mit $a > 0$, für $x < 0$ ist $\\rho = 0$.',
      ctx:{coords:['x'], domain:{x:['0', '∞']}, params:{a:'pos'}, defs:{'ρ(x)':'A x e^(-2x/a)'}, unknowns:{A:{ref:'4/a^2'}}},
      goals:[
        {id:'a', prompt:'a) Bestimme $A$.', type:'solve', unknown:'A', points:2, model:['∫_0^∞ ρ(x) dx = 1', 'A a^2/4 = 1', 'A = 4/a^2']},
        {id:'b', prompt:'b) Berechne $P(x > a)$.', type:'value', target:'3/e^2', points:3, model:['P = ∫_a^∞ 4 x e^(-2x/a)/a^2 dx', '= [-(2x + a) e^(-2x/a)/a]_a^∞', '= 3 e^(-2)', '= 3/e^2'],
          mistakes:[{expr:'e^(-2)', msg:'Das wäre richtig für die Dichte $\\frac2a e^{-2x/a}$. Hier steht ein zusätzlicher Faktor $x$; partiell integrieren.'}]}
      ]}},
    {aim:1, task:{id:'st-fb2', title:'Streuung einer diskreten Größe', text:'Eine Messgröße $X$ nimmt die Werte $1$, $2$ und $4$ mit den Wahrscheinlichkeiten $1/2$, $1/4$ und $1/4$ an. Schreibe `⟨X⟩`, `⟨X^2⟩` und `ΔX`.',
      ctx:DISC({X:'(1, 0, 0; 0, 2, 0; 0, 0, 4)'}, '(1/sqrt(2); 1/2; 1/2)'),
      goals:[{id:'a', prompt:'Berechne $\\Delta X$.', type:'value', target:'sqrt(3/2)', points:3,
        model:['⟨X⟩ = 1 · 1/2 + 2 · 1/4 + 4 · 1/4', '= 2', '⟨X^2⟩ = 1 · 1/2 + 4 · 1/4 + 16 · 1/4', '= 11/2', 'ΔX = sqrt(11/2 - 4)', '= sqrt(3/2)'],
        mistakes:[{expr:'sqrt(11/2)', msg:'Das ist $\\sqrt{\\langle X^2\\rangle}$. Es fehlt $-\\langle X\\rangle^2$.'}]}]}},
    {aim:2, q:'Zwei Teilchen werden unabhängig voneinander präpariert; für jedes ist $P(x > 0) = 0{,}4$. Wie wahrscheinlich wird mindestens eines bei $x > 0$ gefunden?', opts:['$0{,}64$', '$0{,}8$', '$0{,}16$', '$0{,}36$'], a:0, ex:'Gegenereignis: Keines bei $x > 0$, mit $0{,}6^2 = 0{,}36$. Also $1 - 0{,}36 = 0{,}64$. Addieren ($0{,}8$) zählt den Fall „beide“ doppelt.'},
    {aim:'k', id:'st-fbk1', type:'mc2', q:'Für die Dichte $\\rho(x) = \\lambda e^{-\\lambda x}$ ($x \\ge 0$) vergleichst du zwei gleich breite Intervalle: $[0;\\ 0{,}1/\\lambda]$ und $[0{,}95/\\lambda;\\ 1{,}05/\\lambda]$ um $\\langle x\\rangle$. Wo findet man das Teilchen eher?', opts:['im Intervall bei $0$', 'im Intervall um $\\langle x\\rangle$', 'in beiden gleich oft'], a:0,
      ex:'Bei $0$: $1 - e^{-0{,}1}\\approx 0{,}095$. Um $1/\\lambda$: $e^{-0{,}95} - e^{-1{,}05}\\approx 0{,}037$.',
      reason:{q:'Warum?', opts:['Bei gleicher Breite zählt die Dichte, und sie ist bei $0$ am größten.', 'Am Erwartungswert ist die Dichte immer am größten.', 'Die Wahrscheinlichkeit hängt nur von der Breite ab.'], a:0, ex:'Für schmale Intervalle ist $P \\approx \\rho\\,\\Delta$. Der Erwartungswert ist der Schwerpunkt, nicht der wahrscheinlichste Wert.'}},
    {aim:'k', id:'st-fbk3', type:'dialog', text:'Myonen zerfallen mit der Dichte $\\rho(t) = e^{-t/\\tau}/\\tau$ für $t \\ge 0$. Die einzelnen Zerfallszeiten streuen stark: Ihre Standardabweichung ist $\\Delta t = \\tau$, so groß wie der Mittelwert selbst. Ein Experiment misst $N = 10\\,000$ unabhängige Zerfallszeiten und nimmt ihren Mittelwert $\\bar t$ als Schätzwert für $\\tau$.',
      people:[{name:'Lena', says:'$\\bar t$ schwankt nur um etwa $\\tau/\\sqrt N = \\tau/100$. Die Lebensdauer ist damit auf etwa 1 % genau bestimmt.'}, {name:'Jonas', says:'Weil die Einzelzeiten um $\\pm\\tau$ streuen, ist auch $\\bar t$ nur auf etwa $\\pm\\tau$ genau, egal wie viele Zerfälle man misst.'}],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], a:0,
      ex:'Der Standardfehler des Mittelwerts ist $\\Delta t/\\sqrt N = \\tau/100$. Die Einzelzeiten streuen trotzdem weiter mit $\\tau$; das ist eine Eigenschaft der Verteilung, kein Messfehler. Jonas verwechselt die Streuung der Einzelwerte mit der Unsicherheit des Mittelwerts.'},
    {aim:0, sketch:{id:'st-fs-b', kind:'curve', draw:'f', title:'Eine Gleichverteilung', points:2,
      text:'Ein Teilchen ist auf dem Intervall $2 \\le x \\le 2{,}25\\,\\mathrm{nm}$ gleichverteilt. Skizziere die normierte Dichte $\\rho(x)$ auf diesem Intervall. Die Achse ist absolut, in $1/\\mathrm{nm}$.',
      plot:{x:[1.9, 2.35], y:[-1.25, 5], abs:true, dom:[2, 2.25], xlab:'x/\\mathrm{nm}', ylab:'\\rho\\cdot\\mathrm{nm}', ticks:[{x:2, lab:'2'}, {x:2.125, lab:'2{,}125'}, {x:2.25, lab:'2{,}25'}], yticks:[{y:1, lab:'1'}, {y:2, lab:'2'}, {y:3, lab:'3'}, {y:4, lab:'4'}]},
      // ρ = 1/(0,25 nm) = 4/nm auf [2; 2,25], Fläche 1
      f:x => 4,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann eine Dichte negativ sein?'},
        {id:'hoehe', type:'level', range:[2.025, 2.225], v:4, tol:0.9, msg:'Wie hoch muss die Dichte sein, damit Breite mal Höhe 1 ergibt? Deine Höhe ist {got}.'},
        {id:'flaeche', type:'area', v:1, tol:0.15, msg:'Wie groß ist die Fläche unter deiner Kurve? Etwa {got}. Wie groß muss sie sein?'}
      ],
      reveal:'Gleichverteilt heißt: $\\rho$ ist auf dem Intervall konstant. Aus $\\int_2^{2{,}25}\\rho\\,dx = 1$ (in nm) folgt $\\rho = 4/\\mathrm{nm}$. Die Lage des Intervalls spielt keine Rolle, nur seine Breite $0{,}25\\,\\mathrm{nm}$. Eine Dichte ist eine Wahrscheinlichkeit pro Länge und darf größer als 1 sein.',
      wrong:[
        {f:x => 1, fails:['hoehe', 'flaeche'], why:'Dichte ≤ 1 gedacht: Höhe 1 statt Fläche 1'},
        {f:x => 0.25, fails:['hoehe', 'flaeche'], why:'mit der Intervallbreite multipliziert statt durch sie geteilt'}
      ]}}
  ],
  errors:[
    {id:'st-e1', title:'Das zweite Moment',
      text:'Für $\\rho(x) = 2x/L^2$ auf $[0, L]$ ist $\\Delta x$ gesucht. Jemand rechnet:',
      ctx:DENS('2x/L^2', 'sqrt(2x)/L', {domain:{x:['0', 'L']}, params:{L:'pos'}}),
      lines:['⟨x⟩ = ∫_0^L x · 2x/L^2 dx', '= 2L/3', '⟨x^2⟩ = (2L/3)^2', '= 4L^2/9', 'Δx = sqrt(4L^2/9 - 4L^2/9)', '= 0'],
      wrong:2,
      why:{q:'Was ist in Zeile 3 falsch?', opts:['$\\langle x^2\\rangle$ wurde als $\\langle x\\rangle^2$ berechnet.', 'Die Grenzen des Integrals fehlen.', '$\\langle x\\rangle$ muss $L/2$ sein.'], a:0, ex:'$\\langle x^2\\rangle = \\int x^2\\rho\\,dx$ ist ein eigenes Integral. Mit $\\langle x^2\\rangle = \\langle x\\rangle^2$ käme immer $\\Delta x = 0$ heraus – das Ergebnis „keine Streuung“ hätte stutzig machen müssen.'},
      fix:{id:'a', prompt:'Berichtige und berechne $\\Delta x$.', type:'value', target:'L/sqrt(18)', model:['⟨x⟩ = ∫_0^L x · 2x/L^2 dx', '= 2L/3', '⟨x^2⟩ = ∫_0^L x^2 · 2x/L^2 dx', '= L^2/2', 'Δx = sqrt(L^2/2 - 4L^2/9)', '= L/sqrt(18)']}},
    {id:'st-e2', title:'Mindestens eine Sechs',
      text:'Zwei faire Würfel werden geworfen. Gesucht ist die Wahrscheinlichkeit für eine Doppelsechs, wenn man weiß, dass mindestens ein Würfel eine Sechs zeigt. Jemand rechnet $P(A|B) = P(A\\text{ und }B)/P(B)$ mit $P(A\\text{ und }B) = 1/36$:',
      ctx:{coords:['x'], params:{}},
      lines:['P = (1/36)/(1/6)', '= 1/6'],
      wrong:0,
      why:{q:'Was ist an Zeile 1 falsch?', opts:['$P(\\text{mindestens eine Sechs})$ ist $11/36$, nicht $1/6$.', 'Man muss $1/36$ und $1/6$ addieren.', 'Für eine Doppelsechs gilt $P(A\\text{ und }B) = 1/6$.'], a:0, ex:'Gegenereignis: keine Sechs mit $(5/6)^2 = 25/36$, also $P(B) = 1 - 25/36 = 11/36$. $1/6$ wäre die Wahrscheinlichkeit für eine Sechs auf einem *bestimmten* Würfel.'},
      fix:{id:'a', prompt:'Berichtige und berechne die Wahrscheinlichkeit.', type:'value', target:'1/11', model:['P = (1/36)/(11/36)', '= 1/11']}}
  ]
});
})();
lexe('stat-zufallsgroesse', 'Zufallsgröße (diskret und kontinuierlich)', 'Eine Zufallsgröße ordnet jedem Ausgang eines Zufallsexperiments eine Zahl zu. **Diskret:** Werte $x_n$ mit Wahrscheinlichkeiten $P_n \\ge 0$, $\\sum_nP_n = 1$ (z. B. Energiemessung mit $P_n = |c_n|^2$). **Kontinuierlich:** Wahrscheinlichkeitsdichte $\\rho(x)$ mit $P(a \\le x \\le b) = \\int_a^b\\rho\\,dx$ (z. B. Ortsmessung mit $\\rho = |\\psi|^2$). Einzelne Werte haben dann die Wahrscheinlichkeit null.', {topic:'m-stat'});
lexe('stat-dichte', 'Wahrscheinlichkeitsdichte', '$\\rho(x) \\ge 0$ mit $\\int\\rho\\,dx = 1$ und $P(a \\le x \\le b) = \\int_a^b\\rho(x)\\,dx$. Für kleine Intervalle ist $P \\approx \\rho(x_0)\\,\\Delta x$. $\\rho$ ist Wahrscheinlichkeit pro Länge (Einheit $1/\\text{Länge}$) und darf größer als 1 sein. Normieren: Vorfaktor $A$ aus $\\int\\rho\\,dx = 1$. Beispiel: $\\rho = \\lambda e^{-\\lambda x}$ für $x \\ge 0$. In der Quantenmechanik: $\\rho = |\\psi|^2$.', {topic:'m-stat'});
lexe('stat-momente', 'Momente einer Verteilung', 'Das $n$-te Moment ist $\\langle x^n\\rangle = \\sum_k x_k^nP_k$ bzw. $\\int x^n\\rho(x)\\,dx$. Erstes Moment: Erwartungswert (Lage). Aus erstem und zweitem Moment folgt die Varianz $(\\Delta x)^2 = \\langle x^2\\rangle - \\langle x\\rangle^2$. Allgemein $\\langle f(x)\\rangle = \\int f\\rho\\,dx$; linear: $\\langle ax + b\\rangle = a\\langle x\\rangle + b$, aber $\\langle x^2\\rangle \\ne \\langle x\\rangle^2$. Gauß ($\\mu = 0$): $\\langle x^2\\rangle = \\sigma^2$, $\\langle x^4\\rangle = 3\\sigma^4$.', {topic:'m-stat'});
lexe('stat-varianz', 'Varianz und Standardabweichung', 'Varianz $(\\Delta x)^2 = \\langle(x - \\langle x\\rangle)^2\\rangle = \\langle x^2\\rangle - \\langle x\\rangle^2 \\ge 0$; Standardabweichung $\\Delta x$ (Statistik: $\\sigma$), gleiche Einheit wie $x$. Regeln: $\\Delta(x + c) = \\Delta x$, $\\Delta(ax) = |a|\\,\\Delta x$; für unabhängige Größen $(\\Delta(x + y))^2 = (\\Delta x)^2 + (\\Delta y)^2$. Beispiele: Würfel $\\Delta x = \\sqrt{35/12}$, Gleichverteilung auf $[0, L]$: $L/\\sqrt{12}$, $\\lambda e^{-\\lambda x}$: $1/\\lambda$. In der Quantenmechanik ist $\\Delta x$ die Unschärfe.', {topic:'m-stat'});
lexe('stat-gauss', 'Gauß-Verteilung (Normalverteilung)', '$\\rho(x) = \\frac{1}{\\sqrt{2\\pi}\\,\\sigma}e^{-(x - \\mu)^2/(2\\sigma^2)}$ mit $\\langle x\\rangle = \\mu$ und $\\Delta x = \\sigma$. Anteile: $68{,}3\\,\\%$ in $\\mu\\pm\\sigma$, $95{,}4\\,\\%$ in $\\mu\\pm 2\\sigma$, $99{,}7\\,\\%$ in $\\mu\\pm 3\\sigma$. Volle Breite bei halber Höhe $2\\sqrt{2\\ln 2}\\,\\sigma\\approx 2{,}35\\,\\sigma$. Zentraler Grenzwertsatz: Summen vieler unabhängiger Beiträge sind näherungsweise gaußverteilt. Gauß-Paket: $\\psi \\propto e^{-x^2/(4\\sigma^2)}$ hat $|\\psi|^2 \\propto e^{-x^2/(2\\sigma^2)}$.', {topic:'m-stat'});
lexe('stat-unabhaengig', 'Unabhängigkeit', 'Zwei Ereignisse sind unabhängig, wenn $P(A\\text{ und }B) = P(A)\\,P(B)$, gleichbedeutend $P(A|B) = P(A)$. Unabhängige Größen haben die gemeinsame Dichte $\\rho(x, y) = \\rho_1(x)\\rho_2(y)$ und $\\langle xy\\rangle = \\langle x\\rangle\\langle y\\rangle$. „Mindestens eines“: $1 - P(\\text{keines})$. Messungen an verschiedenen, gleich präparierten Systemen sind unabhängig; aufeinanderfolgende Messungen am selben System im Allgemeinen nicht.', {topic:'m-stat'});
lexe('stat-bedingt', 'Bedingte Wahrscheinlichkeit', '$P(A|B) = P(A\\text{ und }B)/P(B)$ für $P(B) > 0$: Man beschränkt sich auf die Fälle mit $B$ und normiert neu. Im Allgemeinen ist $P(A|B) \\ne P(B|A)$; es gilt $P(A|B)\\,P(B) = P(B|A)\\,P(A)$ (Satz von Bayes). Beispiel Würfel: $P(6|\\text{gerade}) = 1/3$, aber $P(\\text{gerade}|6) = 1$.', {topic:'m-stat'});
lexe('stat-ensemble', 'Ensemble, Messreihe und Standardfehler', 'Ensemble: gedachte unendlich viele gleich präparierte Systeme; über sie sind $\\langle x\\rangle$ und $\\Delta x$ definiert. Messreihe: endlich viele Werte $x_1, \\dots, x_N$ mit Mittelwert $\\bar x = \\frac1N\\sum x_i$ und empirischer Standardabweichung $s = \\sqrt{\\frac{1}{N-1}\\sum(x_i - \\bar x)^2}$. Bei unabhängigen Messungen streut $\\bar x$ mit dem Standardfehler $\\Delta x/\\sqrt N$ um $\\langle x\\rangle$; $s$ nähert sich $\\Delta x$, nicht null.', {topic:'m-stat'});
