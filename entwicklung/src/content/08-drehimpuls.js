/* ===== Thema 8: Drehimpuls ===== */
/* Skizzen (SKIZZE.md): θ-Teil der Kugelflächenfunktionen, |e^{imφ}|² = 1.
   |Y_1^0|² = 3/(4π) cos²θ, |Y_1^1|² = 3/(8π) sin²θ, |Y_2^0|² = 5/(16π)(3cos²θ − 1)², |Y_2^1|² = 15/(8π) sin²θ cos²θ, |Y_2^2|² = 15/(32π) sin⁴θ.
   Dichte des Polarwinkels p(θ) = 2π|Y|² sinθ (Fläche 1): Y_1^0 → (3/2)cos²θ sinθ, Maximum bei tan²θ = 1/2 (θ ≈ 0,6155); Y_2^0 → (5/8)(3cos²θ − 1)² sinθ. */
const DREH_SK = (() => {
  const P = Math.PI;
  const Y = {Y10:t => 3 / (4 * P) * Math.cos(t) ** 2, Y11:t => 3 / (8 * P) * Math.sin(t) ** 2, Y20:t => 5 / (16 * P) * (3 * Math.cos(t) ** 2 - 1) ** 2,
    Y21:t => 15 / (8 * P) * (Math.sin(t) * Math.cos(t)) ** 2, Y22:t => 15 / (32 * P) * Math.sin(t) ** 4};
  return Object.assign(Y, {
    p:k => t => 2 * P * Y[k](t) * Math.sin(t),
    T:[{x:0, lab:'0'}, {x:P / 4, lab:'\\pi/4'}, {x:P / 2, lab:'\\pi/2'}, {x:3 * P / 4, lab:'3\\pi/4'}, {x:P, lab:'\\pi'}],
    TP:[{x:0, lab:'0'}, {x:P / 2, lab:'\\pi/2'}, {x:P, lab:'\\pi'}, {x:3 * P / 2, lab:'3\\pi/2'}, {x:2 * P, lab:'2\\pi'}]});
})();
const DREH_JM = (extra) => Object.assign({rep:'mat', mat:{preset:'jm'}, coords:['t'], params:{l:{int:[0, 3]}, m:{int:[-3, 3], range:['-l', 'l']}}}, extra || {});
const DREH_SPH = (unk) => ({coords:['θ', 'φ'], space:['θ', 'φ'], measure:'sin(θ)', params:{}, abstract:{f:{args:['θ', 'φ']}}, unknowns:unk || {}});
const DREH_XYZ = () => ({coords:['x', 'y', 'z'], params:{}, abstract:{f:{args:['x', 'y', 'z']}},
  ops:{'L_x':'-iħ (y ∂/∂z - z ∂/∂y)', 'L_y':'-iħ (z ∂/∂x - x ∂/∂z)', 'L_z':'-iħ (x ∂/∂y - y ∂/∂x)'}});
topic({
  id:'dreh', math:['m-spezial', 'm-eigen'], title:'Drehimpuls', short:'Drehimpuls',
  src:'Griffiths & Schroeter Kap. 4 · Nolting 5/2 Kap. 5 · Sakurai Kap. 3',
  goals:[
    'Ich kann mit den Vertauschungsrelationen $[L_x, L_y] = i\\hbar L_z$ und den Leiteroperatoren $L_\\pm$ rechnen.',
    'Ich kann die Eigenwerte $\\hbar^2l(l+1)$ und $\\hbar m$ angeben und die Faktoren von $L_\\pm|l,m\\rangle$ bestimmen.',
    'Ich kann $\\hat L_z$ und $\\hat L^2$ in Kugelkoordinaten auf Kugelflächenfunktionen anwenden und sie normieren.'
  ],
  needs:'Kommutatoren und Dirac-Notation (Thema 6) · Kugelkoordinaten · $\\int_0^{2\\pi}e^{im\\varphi}d\\varphi$',
  wozu:'Der Drehimpuls ordnet die Atomzustände: Die Orbitale s, p, d, f sind die Werte $l = 0, 1, 2, 3$. Zu jedem $l$ gibt es $2l + 1$ Orbitale, und mit Spin fasst jede Unterschale $2(2l+1)$ Elektronen – daraus ergibt sich der Aufbau des Periodensystems. Im Magnetfeld spaltet ein Niveau mit Drehimpuls $l$ in $2l + 1$ Unterniveaus auf (Zeeman-Effekt). Rotierende Moleküle haben die Energien $\\hbar^2l(l+1)/(2I)$; aus ihren Mikrowellenspektren misst man Bindungslängen.',
  bridge:'Aus Thema 6 kommen Kommutatoren, die Robertson-Relation und der Satz über gemeinsame Eigenbasen vertauschender Operatoren. Die Leiter-Methode kennst du vom Oszillator (Thema 7). Neu sind drei nicht vertauschende Komponenten. Kugelflächenfunktionen und $l(l+1)$ brauchst du im Wasserstoffatom (Thema 9) wieder, die Algebra beim Spin (Thema 10).',
  diag:[
    {q:'Wie beginnst du, um $\\langle l,m|L_x|l,m\\rangle$ zu berechnen?', opts:['$L_x$ durch $L_+$ und $L_-$ ausdrücken', '$\\langle L_x\\rangle^2 = \\langle L^2\\rangle - \\langle L_z\\rangle^2$ benutzen', '$L_x|l,m\\rangle = \\hbar m\\,|l,m\\rangle$ einsetzen'], a:0,
      ex:'Mit $L_x = \\tfrac12(L_+ + L_-)$ ändert jeder Term $m$ um $\\pm1$; das Ergebnis ist null. $|l,m\\rangle$ ist kein Eigenzustand von $L_x$, und Quadrate von Mittelwerten sind keine Mittelwerte von Quadraten.'},
    {q:'Wie beginnst du, um den Faktor $c$ in $L_-|l,m\\rangle = c\\,|l,m-1\\rangle$ zu bestimmen?', opts:['Die Norm $\\langle l,m|L_+L_-|l,m\\rangle$ mit $L_+L_- = L^2 - L_z^2 + \\hbar L_z$ berechnen', '$L_-$ als Ableitung nach $\\varphi$ schreiben und anwenden', '$c = \\hbar m$ setzen, weil $L_-$ den Wert von $L_z$ ändert'], a:0,
      ex:'$|c|^2 = \\|L_-|l,m\\rangle\\|^2 = \\langle l,m|L_-^\\dagger L_-|l,m\\rangle$ mit $L_-^\\dagger = L_+$. Das ergibt $\\hbar^2[l(l+1) - m(m-1)]$, ganz ohne Koordinaten.'}
  ],
  phenomenon:{
    title:'Eine Spektrallinie im Magnetfeld',
    text:'Ein Atom geht von einem Zustand mit Bahndrehimpuls $l = 1$ in einen Zustand mit $l = 0$ über und sendet dabei Licht einer bestimmten Wellenlänge aus. Den Spin lassen wir außer Acht; es gibt Atome, bei denen er sich heraushebt.\n\nNun legt man ein Magnetfeld $B$ in $z$-Richtung an. Ein Elektron mit Bahndrehimpuls wirkt wie eine kleine Stromschleife: Seine Energie im Feld hängt davon ab, wie sein Drehimpuls zum Feld steht, klassisch $\\Delta E \\propto B\\,L_z$.',
    q:{q:'Was sieht man im Spektrum?', opts:['Die Linie wird breiter, weil $L_z$ jeden Wert zwischen $-|\\vec L|$ und $|\\vec L|$ haben kann.', 'Die Linie spaltet in genau drei scharfe Linien auf.', 'Die Linie spaltet in genau zwei scharfe Linien auf.', 'Nichts, denn auf Bahndrehimpuls wirkt kein Magnetfeld.'], a:1,
      ex:'Man sieht drei Linien.',
      fb:['So erwartet man es klassisch: Der Pfeil $\\vec L$ könnte jede Richtung haben. Beobachtet wird aber keine Verbreiterung, sondern eine Aufspaltung in getrennte Linien.',
        'Richtig. $L_z$ kann nur die Werte $\\hbar m$ mit $m = -1, 0, 1$ annehmen. Das obere Niveau spaltet in drei auf, das untere ($l = 0$) nicht.',
        'Zwei Werte gäbe es bei einem Drehimpuls $\\tfrac12$, etwa beim Spin (Thema 10). Zu $l = 1$ gehören drei Werte von $m$.',
        'Doch: Mit dem Bahndrehimpuls ist ein magnetisches Moment $\\vec\\mu = -\\frac{e}{2m_e}\\vec L$ verbunden. Die Energie im Feld hängt von $L_z$ ab.']},
    reveal:'Beobachtet werden drei Linien mit dem Abstand $\\mu_BB$, wobei $\\mu_B = e\\hbar/(2m_e) \\approx 5{,}8\\cdot10^{-5}\\,\\mathrm{eV/T}$. Das ist der normale Zeeman-Effekt; man sieht ihn bei Atomen, deren Elektronenspins sich zu null addieren, etwa an der roten Cadmium-Linie. Dort geht das Atom von $l = 2$ nach $l = 1$ über. Auch dann entstehen genau drei Linien: Beide Niveaus spalten mit demselben Abstand $\\mu_BB$ auf, und erlaubt sind nur Übergänge mit $\\Delta m = 0, \\pm1$. Die Zahl der Linien ist also nicht die Zahl der Unterniveaus. In unserem Beispiel gehören die drei Linien zu $m = -1, 0, +1$ des oberen Niveaus.\n\n$L_z$ ist also quantisiert: Der Drehimpuls kann sich nicht beliebig zum Feld einstellen („Richtungsquantelung“). In diesem Thema leitest du her, warum $L_z$ nur die Werte $\\hbar m$ mit $m = -l, \\dots, l$ hat – und warum $\\vec L$ trotzdem nie genau in Feldrichtung zeigt.'
  },
  teach:[
    {id:'dreh-t1', title:'Drehimpuls als Operator: die Vertauschungsrelationen',
      text:[
        'Klassisch ist der Drehimpuls $\\vec L = \\vec r\\times\\vec p$. In einem kugelsymmetrischen Potential – etwa dem Coulombpotential des Atomkerns – ist er erhalten. Er wird deshalb zur zentralen Größe für alle Atome (Thema 9). Quantenmechanisch ersetzt man Ort und Impuls durch Operatoren:',
        '$$\\hat L_x = \\hat y\\hat p_z - \\hat z\\hat p_y,\\qquad \\hat L_y = \\hat z\\hat p_x - \\hat x\\hat p_z,\\qquad \\hat L_z = \\hat x\\hat p_y - \\hat y\\hat p_x.$$',
        'Eine Reihenfolge-Frage stellt sich dabei nicht: In $\\hat x\\hat p_y$ stehen Ort und Impuls verschiedener Richtungen, und die vertauschen. Deshalb sind die $\\hat L_i$ [[lex:hermitescher-operator|hermitesch]].',
        'Die entscheidende Eigenschaft folgt aus den kanonischen Relationen $[\\hat x_i,\\hat p_j] = i\\hbar\\,\\delta_{ij}$. Rechnet man den [[lex:kommutator|Kommutator]] zweier Komponenten aus, bleiben nur die Paare übrig, in denen ein Ort auf seinen eigenen Impuls trifft. Die Herleitung rechnet das in Ortsdarstellung an einer beliebigen Testfunktion $f(x,y,z)$ nach. Ergebnis ([[lex:drehimpuls-algebra|Vertauschungsrelationen]]):',
        '$$[\\hat L_x,\\hat L_y] = i\\hbar\\hat L_z,\\qquad [\\hat L_y,\\hat L_z] = i\\hbar\\hat L_x,\\qquad [\\hat L_z,\\hat L_x] = i\\hbar\\hat L_y.$$',
        'Kurz: $[\\hat L_i,\\hat L_j] = i\\hbar\\,\\varepsilon_{ijk}\\hat L_k$. Die drei Relationen gehen durch zyklisches Vertauschen $x\\to y\\to z\\to x$ auseinander hervor. Vertauscht man die beiden Argumente, ändert sich das Vorzeichen: $[\\hat L_z,\\hat L_y] = -i\\hbar\\hat L_x$.',
        '**Was bedeutet das?** Zwei Komponenten vertauschen nicht. Nach der [[lex:robertson|Robertson-Relation]] (Thema 6) gilt',
        '$$\\Delta L_x\\,\\Delta L_y \\ge \\frac\\hbar2\\,|\\langle L_z\\rangle|.$$',
        'Ist $\\langle L_z\\rangle \\ne 0$, können $L_x$ und $L_y$ nicht beide scharf sein. Der Drehimpuls hat also im Allgemeinen keine scharfe Richtung. Klassisch dagegen ist $\\vec L$ ein Pfeil mit drei festen Komponenten.',
        '**Das Betragsquadrat** $\\hat L^2 = \\hat L_x^2 + \\hat L_y^2 + \\hat L_z^2$ vertauscht dagegen mit jeder Komponente:',
        '$$[\\hat L^2,\\hat L_z] = 0\\quad\\text{und ebenso für } \\hat L_x, \\hat L_y.$$',
        'Mit der Produktregel $[\\hat A^2,\\hat B] = \\hat A[\\hat A,\\hat B] + [\\hat A,\\hat B]\\hat A$ sieht man es: Die Terme aus $\\hat L_x^2$ und $\\hat L_y^2$ heben sich genau weg. Deshalb kann man $\\hat L^2$ und **eine** Komponente gleichzeitig scharf machen. Üblich ist $\\hat L_z$. Die $z$-Achse ist dabei nicht ausgezeichnet; sie ist eine Wahl, etwa die Richtung eines äußeren Magnetfelds.',
        'Diese Relationen sind alles, was die nächsten Abschnitte brauchen. Die Eigenwerte, die Zahl der Zustände und die Leiterfaktoren folgen aus ihnen allein, ohne Koordinaten. Darum gelten die Ergebnisse auch für den Spin (Thema 10), der kein $\\vec r\\times\\vec p$ ist.'
      ].join('\n\n'),
      derive:{ctx:DREH_XYZ(), lines:[
        {l:'L_z f(x,y,z) = -iħ (x ∂f/∂y - y ∂f/∂x)',
          why:{q:'Woher kommt diese Form?', opts:['$\\hat L_z = \\hat x\\hat p_y - \\hat y\\hat p_x$ mit $\\hat p_j = -i\\hbar\\,\\partial_j$', 'aus $\\hat L_z = -i\\hbar\\,\\partial_\\varphi$ in Kugelkoordinaten', 'aus $\\hat L_z = \\hat L_x\\hat L_y - \\hat L_y\\hat L_x$'], a:0, ex:'In Ortsdarstellung wird $\\hat p_y$ zu $-i\\hbar\\,\\partial/\\partial y$. $L_x$ und $L_y$ entstehen genauso durch zyklisches Vertauschen.'}},
        {l:'[L_x, L_y] f(x,y,z) = L_x L_y f(x,y,z) - L_y L_x f(x,y,z)', w:'Definition des Kommutators'},
        {l:'= ħ^2 (x ∂f/∂y - y ∂f/∂x)',
          why:{q:'Was ist mit den zweiten Ableitungen von $f$ geschehen?', opts:['Sie heben sich paarweise weg.', 'Sie sind null, weil $f$ beliebig ist.', 'Sie wurden vernachlässigt, weil sie klein sind.'], a:0, ex:'Gemischte Ableitungen vertauschen. Übrig bleiben die Terme, in denen eine Ableitung auf einen Vorfaktor $y$, $z$ oder $x$ trifft – also die Kommutatoren $[\\hat x_i,\\hat p_i] = i\\hbar$.'}},
        {l:'= iħ L_z f(x,y,z)',
          why:{q:'Warum ist das $i\\hbar\\hat L_zf$?', opts:['$i\\hbar\\cdot(-i\\hbar) = \\hbar^2$', '$i\\hbar\\cdot i\\hbar = \\hbar^2$', '$\\hbar^2 = \\hbar\\cdot\\hbar$ ohne $i$'], a:0, ex:'Mit der ersten Zeile ist $i\\hbar\\hat L_zf = i\\hbar\\cdot(-i\\hbar)(x\\partial_yf - y\\partial_xf) = \\hbar^2(x\\partial_yf - y\\partial_xf)$.'}}
      ]},
      q:[
        {q:'$[\\hat L_y, \\hat L_x] = $', opts:['$-i\\hbar\\hat L_z$', '$i\\hbar\\hat L_z$', '$0$'], a:0, ex:'Vertauschte Argumente: $[\\hat L_y,\\hat L_x] = -[\\hat L_x,\\hat L_y] = -i\\hbar\\hat L_z$.'},
        {q:'Warum können $L^2$ und $L_z$ zugleich scharf sein, $L_x$ und $L_z$ im Allgemeinen nicht?', opts:['$[\\hat L^2,\\hat L_z] = 0$, aber $[\\hat L_z,\\hat L_x] \\ne 0$', '$L_z$ ist die wichtigste Komponente', '$\\hat L^2$ ist keine eigene Observable'], a:0, ex:'Vertauschende Observable haben eine gemeinsame Eigenbasis (Thema 6). $[\\hat L_z,\\hat L_x] = i\\hbar\\hat L_y$ verhindert das für $L_z$ und $L_x$.'}
      ]},
    {id:'dreh-t2', title:'Gemeinsame Eigenzustände und Entartung',
      text:[
        'Weil $\\hat L^2$ und $\\hat L_z$ vertauschen, gibt es eine gemeinsame Eigenbasis (Thema 6). Wir schreiben ihre Elemente vorläufig als $|\\lambda,\\mu\\rangle$:',
        '$$\\hat L^2|\\lambda,\\mu\\rangle = \\lambda|\\lambda,\\mu\\rangle,\\qquad \\hat L_z|\\lambda,\\mu\\rangle = \\mu|\\lambda,\\mu\\rangle.$$',
        'Hier lauert eine gut belegte Fehlvorstellung: „Wenn $[\\hat A,\\hat B] = 0$ ist, dann ist jeder Eigenzustand von $\\hat A$ auch einer von $\\hat B$.“ Das stimmt nur, wenn die Eigenwerte von $\\hat A$ nicht entartet sind. Der Satz aus Thema 6 sagt: Es **gibt** eine gemeinsame Eigenbasis. Er sagt nicht, dass jede Eigenbasis von $\\hat A$ eine solche ist.',
        'Beim Drehimpuls ist $\\hat L^2$ entartet ([[lex:dreh-gemeinsam|gemeinsame Eigenzustände]]). Zu einem festen Wert von $\\lambda$ gehören mehrere Zustände mit verschiedenem $\\mu$; wie viele, zeigt der nächste Abschnitt. Jede Überlagerung von ihnen ist wieder Eigenzustand von $\\hat L^2$:',
        '$$\\hat L^2\\left(\\alpha|\\lambda,\\mu_1\\rangle + \\beta|\\lambda,\\mu_2\\rangle\\right) = \\lambda\\left(\\alpha|\\lambda,\\mu_1\\rangle + \\beta|\\lambda,\\mu_2\\rangle\\right).$$',
        'Für $\\hat L_z$ gilt das nicht, wenn $\\mu_1 \\ne \\mu_2$. Die Herleitung zeigt das an $|1,1\\rangle + |1,0\\rangle$ (die Bezeichnung $|l,m\\rangle$ wird im nächsten Abschnitt begründet). In Ortsdarstellung ist das die Funktion $Y_1^1 + Y_1^0$.',
        '**Was heißt das für Messungen?** In einem gemeinsamen Eigenzustand $|\\lambda,\\mu\\rangle$ liefert eine Messung von $L^2$ sicher $\\lambda$ und eine Messung von $L_z$ sicher $\\mu$, in beliebiger Reihenfolge. In der normierten Überlagerung $\\alpha|\\lambda,\\mu_1\\rangle + \\beta|\\lambda,\\mu_2\\rangle$ ist $L^2$ scharf, $L_z$ aber nicht: Man misst $\\mu_1$ mit Wahrscheinlichkeit $|\\alpha|^2$ und $\\mu_2$ mit $|\\beta|^2$. Danach ist das System im zugehörigen Eigenzustand ([[lex:messpostulat|Messpostulat]]), und $L^2$ hat immer noch den Wert $\\lambda$.',
        '**Zwei Komponenten zugleich scharf? Nur ohne Drehimpuls.** Angenommen, $\\psi$ ist Eigenzustand von $\\hat L_z$ und von $\\hat L_x$. Dann ist $[\\hat L_z,\\hat L_x]\\psi = 0$, also $i\\hbar\\hat L_y\\psi = 0$. Mit derselben Überlegung für die anderen Paare folgt, dass alle drei Komponenten auf $\\psi$ null ergeben, also auch $\\lambda = 0$. Nur der Zustand ohne Drehimpuls ist Eigenzustand aller Komponenten. Schon $|1,0\\rangle$, mit scharfem $L_z = 0$, ist kein Eigenzustand von $\\hat L_x$.',
        'Im Wasserstoffatom (Thema 9) kommt $\\hat H$ als dritter vertauschender Operator dazu. Die Quantenzahlen $n, l, m$ kennzeichnen dann gemeinsame Eigenzustände von $\\hat H$, $\\hat L^2$ und $\\hat L_z$.'
      ].join('\n\n'),
      derive:{ctx:DREH_JM(), lines:[
        {l:'[L^2, L_z] = 0', w:'vertauschen, also gemeinsame Eigenbasis'},
        {l:'L^2 (|1,1⟩ + |1,0⟩) = 2ħ^2 (|1,1⟩ + |1,0⟩)',
          why:{q:'Warum ist die Summe Eigenzustand von $\\hat L^2$?', opts:['Beide Summanden haben denselben Eigenwert $2\\hbar^2$.', 'Jede Summe von Eigenzuständen ist Eigenzustand.', 'Weil $[\\hat L^2,\\hat L_z] = 0$ ist.'], a:0, ex:'Linearität: $\\hat L^2$ multipliziert beide Summanden mit derselben Zahl. Bei verschiedenen Eigenwerten ginge das nicht.'}},
        {l:'L_z (|1,1⟩ + |1,0⟩) = ħ |1,1⟩',
          why:{q:'Ist das ein Vielfaches von $|1,1\\rangle + |1,0\\rangle$?', opts:['Nein, der Anteil $|1,0\\rangle$ fehlt.', 'Ja, mit dem Eigenwert $\\hbar$.', 'Ja, mit dem Eigenwert $\\tfrac12\\hbar$.'], a:0, ex:'$\\hat L_z$ multipliziert $|1,1\\rangle$ mit $\\hbar$ und $|1,0\\rangle$ mit $0$. Kein gemeinsamer Faktor – kein Eigenzustand.'}}
      ]},
      q:[
        {q:'Der Zustand $\\frac{1}{\\sqrt2}(|1,1\\rangle + |1,-1\\rangle)$ ist …', opts:['Eigenzustand von $\\hat L^2$, nicht von $\\hat L_z$', 'Eigenzustand von $\\hat L^2$ und von $\\hat L_z$', 'Eigenzustand von keinem der beiden'], a:0, ex:'Beide Anteile haben $l = 1$, aber verschiedene $m$.'},
        {q:'Man misst $L_z$ im Zustand $\\frac{1}{\\sqrt2}(|1,1\\rangle + |1,0\\rangle)$. Welche Ergebnisse sind möglich?', opts:['$\\hbar$ oder $0$, je mit $\\tfrac12$', 'immer der Mittelwert $\\tfrac12\\hbar$', '$\\hbar$, $0$ oder $-\\hbar$, je mit $\\tfrac13$'], a:0, ex:'Ergebnisse sind Eigenwerte, gewichtet mit $|c_m|^2$. Der Mittelwert $\\tfrac12\\hbar$ ist kein Einzelergebnis.'}
      ]},
    {id:'dreh-t3', title:'Eigenwerte mit Leiteroperatoren',
      text:[
        'Wie beim Oszillator (Thema 7) baut man [[lex:drehimpuls-leiter|Leiteroperatoren]]:',
        '$$\\hat L_\\pm = \\hat L_x \\pm i\\hat L_y,\\qquad \\hat L_\\pm^\\dagger = \\hat L_\\mp.$$',
        'Aus den Vertauschungsrelationen folgen (vorgerechnetes Beispiel und Übungen)',
        '$$[\\hat L_z,\\hat L_\\pm] = \\pm\\hbar\\hat L_\\pm,\\qquad [\\hat L^2,\\hat L_\\pm] = 0.$$',
        'Für einen Eigenzustand $|\\lambda,\\mu\\rangle$ gilt deshalb',
        '$$\\hat L_z\\left(\\hat L_+|\\lambda,\\mu\\rangle\\right) = (\\mu + \\hbar)\\,\\hat L_+|\\lambda,\\mu\\rangle,\\qquad \\hat L^2\\left(\\hat L_+|\\lambda,\\mu\\rangle\\right) = \\lambda\\,\\hat L_+|\\lambda,\\mu\\rangle.$$',
        '$\\hat L_+$ erhöht den $L_z$-Eigenwert um $\\hbar$ und lässt $\\lambda$ unverändert; $\\hat L_-$ senkt ihn um $\\hbar$. Der Betrag bleibt gleich, nur die $z$-Komponente ändert sich.',
        '**Die Leiter ist beschränkt.** Für jeden Zustand ist $\\langle L_x^2\\rangle = \\|\\hat L_x\\psi\\|^2 \\ge 0$, ebenso für $L_y$. Aus $\\hat L^2 - \\hat L_z^2 = \\hat L_x^2 + \\hat L_y^2$ folgt',
        '$$\\mu^2 \\le \\lambda.$$',
        'Die $z$-Komponente kann den Betrag nicht übersteigen. Also gibt es ganz oben einen Zustand $|\\lambda,\\mu_{\\max}\\rangle$ mit $\\hat L_+|\\lambda,\\mu_{\\max}\\rangle = 0$. Wir schreiben $\\mu_{\\max} = \\hbar l$. Nun hilft die Identität $\\hat L_-\\hat L_+ = \\hat L^2 - \\hat L_z^2 - \\hbar\\hat L_z$. Auf den obersten Zustand angewendet, steht links null und rechts $\\lambda - \\hbar^2l^2 - \\hbar^2l$. Die Herleitung zeigt das. Also',
        '$$\\lambda = \\hbar^2\\,l(l+1).$$',
        'Ebenso gibt es einen untersten Zustand mit $\\hat L_-|\\lambda,\\mu_{\\min}\\rangle = 0$. Mit $\\hat L_+\\hat L_- = \\hat L^2 - \\hat L_z^2 + \\hbar\\hat L_z$ folgt $\\lambda = \\mu_{\\min}(\\mu_{\\min} - \\hbar)$, also $\\mu_{\\min} = -\\hbar l$. (Die zweite Lösung $\\mu_{\\min} = \\hbar(l+1)$ läge über $\\mu_{\\max}$.)',
        'Von $-\\hbar l$ nach $+\\hbar l$ kommt man in ganzen Schritten $\\hbar$. Also ist $2l$ eine ganze Zahl ([[lex:drehimpuls-eigenwerte|Eigenwerte]]). Die Algebra erlaubt damit auch halbzahlige Werte. Für einen allgemeinen Drehimpuls schreibt man deshalb meist $j$ statt $l$:',
        '$$j = 0, \\tfrac12, 1, \\tfrac32, 2, \\dots,\\qquad m = -j, -j+1, \\dots, j-1, j.$$',
        'Für den Bahndrehimpuls schreiben wir ab jetzt $|l,m\\rangle$ mit $\\hat L^2|l,m\\rangle = \\hbar^2l(l+1)|l,m\\rangle$ und $\\hat L_z|l,m\\rangle = \\hbar m|l,m\\rangle$. Zu jedem $l$ gibt es $2l + 1$ Zustände – das ist die Entartung von $\\hat L^2$ aus dem vorigen Abschnitt. Halbzahlige Werte erlaubt die Algebra. Beim Bahndrehimpuls schließt die Ortsdarstellung sie aus (Abschnitt 5); beim Spin kommen sie vor (Thema 10).',
        'Bemerkenswert ist, wie wenig man gebraucht hat: nur $[\\hat L_i,\\hat L_j] = i\\hbar\\varepsilon_{ijk}\\hat L_k$ und die Hermitezität. Keine Differentialgleichung, keine Koordinaten.'
      ].join('\n\n'),
      derive:{ctx:DREH_JM(), lines:[
        {l:'L_- L_+ = L^2 - L_z^2 - ħ L_z',
          why:{q:'Woher kommt der Term $-\\hbar\\hat L_z$?', opts:['Aus $i[\\hat L_x,\\hat L_y] = i\\cdot i\\hbar\\hat L_z$', 'Aus $\\hat L_z^2 = \\hbar\\hat L_z$', 'Aus der Normierung von $|l,m\\rangle$'], a:0, ex:'$(\\hat L_x - i\\hat L_y)(\\hat L_x + i\\hat L_y) = \\hat L_x^2 + \\hat L_y^2 + i[\\hat L_x,\\hat L_y] = \\hat L^2 - \\hat L_z^2 - \\hbar\\hat L_z$.'}},
        {l:'L_+|l,l⟩ = 0',
          why:{q:'Warum ist das null?', opts:['Es ist die oberste Sprosse; sonst wäre $\\mu^2 > \\lambda$.', 'Weil $\\hat L_+$ nicht hermitesch ist und keine Eigenwerte hat.', 'Weil $\\hat L_+$ den Wert $\\lambda$ ändert und so herausführt.'], a:0, ex:'Wäre $\\hat L_+|l,l\\rangle \\ne 0$, gäbe es einen Zustand mit $\\mu = \\hbar(l+1)$ und noch höher – im Widerspruch zur Beschränkung.'}},
        {l:'L^2|l,l⟩ = (L_- L_+ + L_z^2 + ħ L_z)|l,l⟩', w:'Identität nach L² aufgelöst'},
        {l:'= (0 + ħ^2 l^2 + ħ^2 l)|l,l⟩',
          why:{q:'Woher kommen die drei Summanden?', opts:['$\\hat L_+|l,l\\rangle = 0$ und $\\hat L_z|l,l\\rangle = \\hbar l|l,l\\rangle$', '$\\hat L_-\\hat L_+ = \\hat L^2$ und $\\hat L_z = \\hbar$', 'aus $\\hat L^2 = \\hat L_z^2$ für den obersten Zustand'], a:0, ex:'$\\hat L_z^2$ gibt $\\hbar^2l^2$, $\\hbar\\hat L_z$ gibt $\\hbar^2l$.'}},
        {l:'= ħ^2 l(l+1) |l,l⟩'}
      ]},
      q:[
        {q:'Welche Werte kann $m$ bei einem Drehimpuls mit $j = \\tfrac32$ annehmen?', opts:['$-\\tfrac32, -\\tfrac12, \\tfrac12, \\tfrac32$', '$-1, 0, 1$', '$-\\tfrac32, -\\tfrac12, 0, \\tfrac12, \\tfrac32$'], a:0, ex:'Von $-j$ bis $j$ in ganzen Schritten: $2j + 1 = 4$ Werte. $0$ ist nicht dabei.'},
        {q:'Warum muss es einen obersten Zustand mit $\\hat L_+|\\lambda,\\mu_{\\max}\\rangle = 0$ geben?', opts:['Weil $\\mu^2 \\le \\lambda$ gilt: $L_z$ übersteigt nie den Betrag.', 'Weil $\\hat L_+$ nicht hermitesch ist und keine Eigenwerte hat.', 'Weil $\\hat L_+$ bei jedem Schritt den Wert $\\lambda$ verkleinert.'], a:0, ex:'$\\hat L_+$ ändert $\\lambda$ gerade nicht, aber $\\mu$. Unbegrenztes Aufsteigen verletzte $\\mu^2 \\le \\lambda$.'}
      ]},
    {id:'dreh-t4', title:'Leiterfaktoren und das Vektormodell',
      text:[
        'Die Zahlenfaktoren bestimmt man wie beim Oszillator über die Norm. Mit $\\hat L_+|l,m\\rangle = c\\,|l,m+1\\rangle$ und $\\hat L_+^\\dagger = \\hat L_-$ ist',
        '$$|c|^2 = \\langle l,m|\\hat L_-\\hat L_+|l,m\\rangle = \\hbar^2\\left[l(l+1) - m(m+1)\\right].$$',
        'Mit reellem, positivem $c$ (Konvention) folgt',
        '$$\\hat L_\\pm|l,m\\rangle = \\hbar\\sqrt{l(l+1) - m(m\\pm1)}\\;|l,m\\pm1\\rangle.$$',
        'Probe: Für $m = l$ verschwindet der Faktor von $\\hat L_+$, für $m = -l$ der von $\\hat L_-$. Merkhilfe: $l(l+1) - m(m\\pm1) = (l \\mp m)(l \\pm m + 1)$.',
        '**Die anderen Komponenten.** Mit $\\hat L_x = \\tfrac12(\\hat L_+ + \\hat L_-)$ und $\\hat L_y = \\tfrac{1}{2i}(\\hat L_+ - \\hat L_-)$ ändert jeder Term $m$ um $\\pm1$. Darum ist in jedem Zustand $|l,m\\rangle$',
        '$$\\langle L_x\\rangle = \\langle L_y\\rangle = 0,\\qquad \\langle L_x^2\\rangle = \\langle L_y^2\\rangle = \\frac{\\hbar^2}{2}\\left[l(l+1) - m^2\\right].$$',
        'Die zweite Formel folgt aus $\\hat L_x^2 + \\hat L_y^2 = \\hat L^2 - \\hat L_z^2$ und der Symmetrie zwischen $x$ und $y$ (Herleitung).',
        '**Zeigt der Drehimpuls in $z$-Richtung?** Nimm den Zustand mit dem größten $L_z$, also $m = l$. Viele denken: Dann zeigt $\\vec L$ genau nach oben. Das stimmt nicht. Der Betrag ist $\\hbar\\sqrt{l(l+1)}$, die $z$-Komponente nur $\\hbar l$ – immer kleiner. Der Rest steckt in $\\langle L_x^2 + L_y^2\\rangle = \\hbar^2l > 0$. Für $l = 1$, $m = 1$ ist $\\Delta L_x = \\Delta L_y = \\hbar/\\sqrt2$. Ganz nach oben zeigen kann $\\vec L$ nicht, sonst wären $L_x = L_y = 0$ scharf, im Widerspruch zu $\\Delta L_x\\Delta L_y \\ge \\tfrac\\hbar2|\\langle L_z\\rangle|$.',
        'Ein anschauliches Bild ist das [[lex:dreh-vektormodell|Vektormodell]]: $\\vec L$ liegt auf einem Kegelmantel um die $z$-Achse, mit Länge $\\hbar\\sqrt{l(l+1)}$ und Höhe $\\hbar m$. Die Richtung auf dem Kegel ist unbestimmt. Das Bild ist eine Merkhilfe, keine Beschreibung einer Bahn: Es gibt keinen Pfeil, der „in Wirklichkeit“ irgendwohin zeigt.',
        '**Richtungsquantelung ist messbar.** In einem Magnetfeld $B$ entlang $z$ hat ein Elektron mit Bahndrehimpuls die Zusatzenergie $m\\,\\mu_BB$ mit $\\mu_B = e\\hbar/(2m_e)$. Ein Niveau mit $l = 1$ spaltet in drei Niveaus auf: der [[lex:dreh-zeeman|Zeeman-Effekt]] aus der Vorhersage zu Beginn.'
      ].join('\n\n'),
      derive:{ctx:DREH_JM(), lines:[
        {l:'⟨l,m|L_- L_+|l,m⟩ = ⟨l,m|(L^2 - L_z^2 - ħ L_z)|l,m⟩',
          why:{q:'Warum ist das $\\|\\hat L_+|l,m\\rangle\\|^2$?', opts:['Das Bra zu $\\hat L_+|l,m\\rangle$ ist $\\langle l,m|\\hat L_-$.', 'Weil $\\hat L_-\\hat L_+ = 1$ ist.', 'Weil $\\hat L_+$ hermitesch ist.'], a:0, ex:'Das Bra zu $\\hat A|\\psi\\rangle$ ist $\\langle\\psi|\\hat A^\\dagger$, und $\\hat L_+^\\dagger = \\hat L_-$.'}},
        {l:'= ħ^2 (l(l+1) - m^2 - m)',
          why:{q:'Was wurde eingesetzt?', opts:['die Eigenwerte $\\hbar^2l(l+1)$ und $\\hbar m$', 'die Faktoren der Leiteroperatoren', 'die Kugelflächenfunktionen'], a:0, ex:'$\\hat L^2$, $\\hat L_z^2$ und $\\hat L_z$ wirken auf $|l,m\\rangle$ einfach als Zahlen.'}},
        {l:'⟨l,m|L_x^2|l,m⟩ = 1/2 ⟨l,m|(L^2 - L_z^2)|l,m⟩',
          why:{q:'Warum der Faktor $\\tfrac12$?', opts:['$\\langle L_x^2\\rangle = \\langle L_y^2\\rangle$, zusammen $\\langle L^2 - L_z^2\\rangle$.', 'Weil $\\hat L_x = \\tfrac12(\\hat L_+ + \\hat L_-)$ ist.', 'Weil $\\hat L_x^2 = \\tfrac12\\hat L^2$ gilt.'], a:0, ex:'Eine Drehung um die $z$-Achse um $90°$ führt $L_x$ in $L_y$ über und lässt $|l,m\\rangle$ bis auf eine Phase unverändert.'}},
        {l:'= ħ^2/2 (l(l+1) - m^2)'}
      ]},
      q:[
        {q:'Was ist $\\hat L_-|2,1\\rangle$?', opts:['$\\sqrt6\\,\\hbar\\,|2,0\\rangle$', '$2\\hbar\\,|2,0\\rangle$', '$\\sqrt2\\,\\hbar\\,|2,0\\rangle$'], a:0, ex:'$l(l+1) - m(m-1) = 6 - 0 = 6$.'},
        {q:'Im Zustand $|2,2\\rangle$: Wie groß ist $\\langle L_x^2\\rangle + \\langle L_y^2\\rangle$?', opts:['$2\\hbar^2$', '$0$', '$6\\hbar^2$'], a:0, ex:'$\\hbar^2[l(l+1) - m^2] = \\hbar^2(6 - 4)$. Auch bei $m = l$ bleibt ein Rest: $\\vec L$ zeigt nicht genau nach $z$.'}
      ]},
    {id:'dreh-t5', title:'Bahndrehimpuls in Kugelkoordinaten',
      text:[
        'Für den Bahndrehimpuls gibt es neben der Algebra eine Ortsdarstellung. In [[lex:kugelkoordinaten|Kugelkoordinaten]] $(r,\\theta,\\varphi)$ ist eine Drehung um die $z$-Achse einfach $\\varphi \\to \\varphi + \\alpha$. Mit der Kettenregel ist $\\partial_\\varphi = x\\,\\partial_y - y\\,\\partial_x$, und aus $-i\\hbar(x\\partial_y - y\\partial_x)$ wird',
        '$$\\hat L_z = -i\\hbar\\frac{\\partial}{\\partial\\varphi}.$$',
        'Die übrigen Komponenten enthalten auch $\\partial_\\theta$. Keine enthält $r$ oder $\\partial_r$: Drehimpulsoperatoren wirken nur auf die Winkel. Für $\\hat L^2$ ergibt sich ([[lex:drehimpuls-kugel|Formelsammlung]])',
        '$$\\hat L^2 = -\\hbar^2\\left[\\frac{1}{\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial}{\\partial\\theta}\\right) + \\frac{1}{\\sin^2\\theta}\\frac{\\partial^2}{\\partial\\varphi^2}\\right].$$',
        'Das ist bis auf den Faktor $-\\hbar^2r^2$ der Winkelteil des [[lex:laplace-operator|Laplace-Operators]]. Darum taucht $\\hat L^2$ im Wasserstoffatom auf (Thema 9).',
        '**Die $\\varphi$-Abhängigkeit.** Eigenfunktionen von $\\hat L_z$ erfüllen $-i\\hbar\\,\\partial_\\varphi\\Phi = \\hbar m\\,\\Phi$, also $\\Phi = e^{im\\varphi}$. Eine Wellenfunktion muss eindeutig sein: $\\varphi$ und $\\varphi + 2\\pi$ sind derselbe Punkt. Aus $e^{2\\pi im} = 1$ folgt $m\\in\\mathbb Z$, und damit ist auch $l$ ganzzahlig. Halbzahlige $l$ gibt es beim Bahndrehimpuls nicht.',
        '**Die $\\theta$-Abhängigkeit** folgt am bequemsten aus der Leiter. Der oberste Zustand erfüllt $\\hat L_+Y_l^l = 0$. Mit $\\hat L_+ = \\hbar e^{i\\varphi}(\\partial_\\theta + i\\cot\\theta\\,\\partial_\\varphi)$ und dem Ansatz $Y_l^l = f(\\theta)\\,e^{il\\varphi}$ wird daraus $f\' = l\\cot\\theta\\,f$, also $f \\propto \\sin^l\\theta$. Die übrigen $Y_l^m$ entstehen durch wiederholtes Anwenden von $\\hat L_- = -\\hbar e^{-i\\varphi}(\\partial_\\theta - i\\cot\\theta\\,\\partial_\\varphi)$. Die Herleitung prüft das für $l = 1$. Allgemein sind die [[lex:kugelflaechenfunktionen|Kugelflächenfunktionen]]',
        '$$Y_l^m(\\theta,\\varphi) = N_{lm}\\,P_l^m(\\cos\\theta)\\,e^{im\\varphi}$$',
        'mit den zugeordneten [[lex:legendre-polynome|Legendre-Funktionen]] $P_l^m$ und einer Normierungskonstanten $N_{lm}$. Beispiele: $Y_0^0 = \\frac{1}{\\sqrt{4\\pi}}$, $Y_1^0 = \\sqrt{\\tfrac{3}{4\\pi}}\\cos\\theta$, $Y_1^{\\pm1} = \\mp\\sqrt{\\tfrac{3}{8\\pi}}\\sin\\theta\\,e^{\\pm i\\varphi}$.',
        '**Normierung auf der Kugel.** Das Flächenelement der Einheitskugel ist $d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$. Orthonormalität heißt',
        '$$\\int_0^\\pi\\!\\!\\int_0^{2\\pi}Y_l^{m*}\\,Y_{l\'}^{m\'}\\,\\sin\\theta\\,d\\varphi\\,d\\theta = \\delta_{ll\'}\\,\\delta_{mm\'}.$$',
        'Wer $\\sin\\theta$ vergisst, integriert falsch: Die Breitenkreise werden zu den Polen hin kleiner, und das Maß berücksichtigt das ([[lex:jacobi-determinante|Volumenelement]]).'
      ].join('\n\n'),
      derive:{ctx:DREH_SPH(), lines:[
        {l:'L̂_z (sin(θ) e^(iφ)) = ħ sin(θ) e^(iφ)',
          why:{q:'Welcher Eigenwert von $\\hat L_z$ ergibt sich?', opts:['$\\hbar$, also $m = 1$', '$i\\hbar$, also $m = i$', '$\\hbar\\sin\\theta$'], a:0, ex:'Nur $e^{i\\varphi}$ wird abgeleitet: $-i\\hbar\\cdot i = \\hbar$. $\\sin\\theta$ ist dabei konstant.'}},
        {l:'L̂_+ (sin(θ) e^(iφ)) = 0',
          why:{q:'Was zeigt diese Zeile?', opts:['$\\sin\\theta\\,e^{i\\varphi}$ ist die oberste Sprosse zu $l = 1$.', 'Die Funktion ist nicht normierbar.', '$\\hat L_+$ ist der Nulloperator.'], a:0, ex:'$f = \\sin\\theta$ erfüllt $f\' = \\cot\\theta\\,f$ – genau die Bedingung $\\hat L_+Y_1^1 = 0$.'}},
        {l:'L̂^2 (sin(θ) e^(iφ)) = 2ħ^2 sin(θ) e^(iφ)',
          why:{q:'Passt das zu $l = 1$?', opts:['Ja, $\\hbar^2l(l+1) = 2\\hbar^2$.', 'Nein, $l = 1$ hätte $\\hbar^2$.', 'Nein, $l = 1$ hätte $4\\hbar^2$.'], a:0, ex:'$1\\cdot2 = 2$.'}},
        {l:'L̂_- (sin(θ) e^(iφ)) = -2ħ cos(θ)',
          why:{q:'Was entsteht beim Absteigen?', opts:['ein Vielfaches von $\\cos\\theta \\propto Y_1^0$', 'ein Vielfaches von $\\sin\\theta\\,e^{-i\\varphi}$', 'der Nullvektor'], a:0, ex:'$\\hat L_-$ senkt $m$ von 1 auf 0. Normiert man beide Seiten, folgt $\\hat L_-Y_1^1 = \\sqrt2\\,\\hbar\\,Y_1^0$.'}}
      ]},
      q:[
        {q:'Welche Funktion ist Eigenfunktion von $\\hat L_z$?', opts:['$\\sin\\theta\\,e^{-2i\\varphi}$', '$\\sin\\theta\\cos\\varphi$', '$\\cos\\theta + \\sin\\theta\\,e^{i\\varphi}$'], a:0, ex:'Nur eine reine Exponentialfunktion $e^{im\\varphi}$ ist Eigenfunktion von $-i\\hbar\\,\\partial_\\varphi$; hier mit $m = -2$. $\\cos\\varphi$ enthält $e^{\\pm i\\varphi}$.'},
        {q:'Wie groß ist $\\int_0^\\pi\\int_0^{2\\pi}\\sin\\theta\\,d\\varphi\\,d\\theta$?', opts:['$4\\pi$', '$2\\pi^2$', '$2\\pi$'], a:0, ex:'Die Oberfläche der Einheitskugel. Ohne $\\sin\\theta$ käme fälschlich $2\\pi^2$ heraus.'}
      ]},
    {id:'dreh-t6', title:'Kugelflächenfunktionen lesen: Knoten, reelle Orbitale, Rotation',
      text:[
        'Das Polardiagramm im Labor zeigt $|Y_l^m|^2$ als Abstand vom Ursprung. Drei Beobachtungen helfen beim Lesen:',
        '1. $|Y_l^m|^2$ hängt nicht von $\\varphi$ ab, denn $|e^{im\\varphi}|^2 = 1$. Alle Bilder sind rotationssymmetrisch um die $z$-Achse.\n2. In $\\theta$ hat $Y_l^m$ genau $l - |m|$ Knoten. Für $m = 0$ liegt die Wahrscheinlichkeit vor allem an den Polen, für $|m| = l$ als Ring um den Äquator. Das passt zum Vektormodell: Bei großem $|m|$ liegt $\\vec L$ näher an der $z$-Achse, die „Bewegung“ findet also eher in der $x$-$y$-Ebene statt.\n3. Unter Spiegelung $\\vec r\\to-\\vec r$ ändert sich $Y_l^m$ um den Faktor $(-1)^l$ (Parität).',
        '**Reelle Orbitale aus der Chemie.** Die Orbitale $p_x$ und $p_y$ sind keine $Y_l^m$, sondern Überlagerungen:',
        '$$p_x \\propto \\sin\\theta\\cos\\varphi \\propto Y_1^{-1} - Y_1^1,\\qquad p_y \\propto \\sin\\theta\\sin\\varphi \\propto Y_1^{-1} + Y_1^1.$$',
        'Nur $p_z \\propto \\cos\\theta \\propto Y_1^0$ ist selbst eine Kugelflächenfunktion. Alle drei sind Eigenfunktionen von $\\hat L^2$ mit dem Eigenwert $2\\hbar^2$. $p_x$ und $p_y$ sind aber keine Eigenfunktionen von $\\hat L_z$ – genau das Gegenbeispiel aus dem Abschnitt über Entartung. Misst man $L_z$ in $p_x$, erhält man $+\\hbar$ oder $-\\hbar$, je mit Wahrscheinlichkeit $\\tfrac12$; nur der Mittelwert ist null. Die reellen Orbitale sind bequem, um Bindungen zu beschreiben. Die komplexen $Y_l^m$ sind bequem für Rechnungen mit $\\hat L_z$ und Magnetfeldern. Beide Basen spannen denselben Raum zu $l = 1$ auf.',
        '**Molekülrotation.** Ein zweiatomiges Molekül mit Trägheitsmoment $I$ hat die Rotationsenergie $\\hat L^2/(2I)$. Seine Niveaus sind',
        '$$E_l = \\frac{\\hbar^2}{2I}\\,l(l+1),\\qquad l = 0, 1, 2, \\dots,$$',
        'jeweils $(2l+1)$-fach entartet. Absorption und Emission von Strahlung (Dipolübergänge) gibt es nur mit $\\Delta l = \\pm1$ und nur bei Molekülen mit Dipolmoment. Die Linien liegen im Mikrowellen- und fernen Infrarotbereich, und benachbarte Linien haben den festen Abstand $\\hbar^2/I$. Daraus bestimmt man $I$ und damit die Bindungslänge.',
        '**Häufige Fehler beim Lesen der Bilder:** das Polardiagramm von $|Y|^2$ für eine Bahn halten, oder die beiden Keulen von $p_z$ für zwei getrennte Aufenthaltsorte, zwischen denen das Elektron hin- und herspringt. $|Y|^2$ ist eine Wahrscheinlichkeitsdichte über die Richtungen. Der Zustand ist stationär; es gibt keine Bewegung von Keule zu Keule.'
      ].join('\n\n'),
      fig:{lab:'ylm', init:{l:2, m:0}, caption:'$|Y_l^m|^2$ als Abstand vom Ursprung in der $x$-$z$-Ebene. Vergleiche bei $l = 2$ die Werte $m = 0, 1, 2$: Wo liegt die Wahrscheinlichkeit, und wie viele Knotenkegel gibt es?'},
      q:[
        {q:'Wo ist $|Y_2^2|^2$ am größten?', opts:['in der $x$-$y$-Ebene ($\\theta = \\pi/2$)', 'auf der $z$-Achse ($\\theta = 0$)', 'unter $45°$ zur $z$-Achse'], a:0, ex:'$|Y_2^{\\pm2}|^2 \\propto \\sin^4\\theta$, maximal am Äquator.'},
        {q:'Man misst $L_z$ im reellen Orbital $p_y$. Was kommt heraus?', opts:['$+\\hbar$ oder $-\\hbar$, je mit $\\tfrac12$', 'sicher $0$, weil $p_y$ reell ist', 'sicher $+\\hbar$, wie bei $Y_1^1$'], a:0, ex:'$p_y \\propto Y_1^{-1} + Y_1^1$ mit gleichen Gewichten. $\\langle L_z\\rangle = 0$, aber $L_z$ ist nicht scharf.'}
      ]}
  ],
  check:[
    {q:'Der klassische Drehimpuls ist $\\vec L = \\vec r\\times\\vec p$. Was ist $L_z$?', opts:['$xp_y - yp_x$', '$yp_z - zp_y$', '$xp_x + yp_y$'], a:0, ex:'$z$-Komponente des Kreuzprodukts: $(\\vec r\\times\\vec p)_z = xp_y - yp_x$.', lex:'drehimpuls-algebra'},
    {q:'$[\\hat A, \\hat B\\hat C] = $', opts:['$[\\hat A,\\hat B]\\hat C + \\hat B[\\hat A,\\hat C]$', '$[\\hat A,\\hat B][\\hat A,\\hat C]$', '$\\hat B[\\hat A,\\hat C] - [\\hat A,\\hat B]\\hat C$'], a:0, ex:'Wie eine Produktregel; die Reihenfolge von $\\hat B$ und $\\hat C$ bleibt erhalten.', lex:'kommutator', prev:'form'},
    {q:'$\\int_0^{2\\pi}e^{i m\\varphi}\\,d\\varphi$ für ganzzahliges $m \\ne 0$ ist …', opts:['$0$', '$2\\pi$', '$2\\pi/m$'], a:0, ex:'Über eine volle Periode mittelt sich $e^{im\\varphi}$ weg. Für $m = 0$ kommt $2\\pi$ heraus.', lex:'integrale'},
    {q:'Warum muss $m$ in $e^{im\\varphi}$ für eine Wellenfunktion ganzzahlig sein?', opts:['$\\varphi$ und $\\varphi + 2\\pi$ sind derselbe Punkt.', 'Sonst wäre $e^{im\\varphi}$ nicht normierbar.', 'Weil $L_z$ nur positive Werte annimmt.'], a:0, ex:'Eindeutigkeit: $e^{im(\\varphi + 2\\pi)} = e^{im\\varphi}$ verlangt $m\\in\\mathbb Z$. Normierbar ist $e^{im\\varphi}$ für jedes reelle $m$.', lex:'kugelflaechenfunktionen'}
  ],
  example:{
    title:'$[L_z, L_+] = \\hbar L_+$',
    text:'Mit $L_+ = L_x + iL_y$ und den Vertauschungsrelationen $[L_z, L_x] = i\\hbar L_y$, $[L_z, L_y] = -i\\hbar L_x$. Hier werden die Operatoren ohne Dach geschrieben.',
    ctx:DREH_JM(),
    lines:[
      {l:'[L_z, L_+] = [L_z, L_x] + i[L_z, L_y]', why:{q:'Welche Regel wurde benutzt?', opts:['Der Kommutator ist linear in jedem Argument.', 'Kommutatoren sind symmetrisch: $[A,B] = [B,A]$.', 'die Produktregel $[A, BC] = [A,B]C + B[A,C]$'], a:0, ex:'$[A, B + cC] = [A,B] + c[A,C]$.'}},
      {l:'= iħ L_y + i(-iħ L_x)', why:{q:'Woher kommt $[L_z, L_y] = -i\\hbar L_x$?', opts:['aus $[L_y, L_z] = i\\hbar L_x$ durch Vertauschen', 'aus $[L_x, L_y] = i\\hbar L_z$ durch Umbenennen', 'aus $L_z = -i\\hbar\\,\\partial_\\varphi$ durch Ableiten'], a:0, ex:'$[L_i, L_j] = i\\hbar\\varepsilon_{ijk}L_k$; Vertauschen der Argumente ändert das Vorzeichen.'}},
      {l:'= ħ (L_x + i L_y)', why:{q:'Was ist $i\\cdot(-i)$?', opts:['$1$', '$-1$', '$i$'], a:0, ex:'$-i^2 = 1$, also $i(-i\\hbar L_x) = \\hbar L_x$.'}},
      {l:'= ħ L_+', why:{q:'Was folgt für $L_+|l,m\\rangle$?', opts:['Eigenzustand von $L_z$ zu $\\hbar(m+1)$ oder null', 'Eigenzustand von $L_z$ zu $\\hbar m$, wie vorher', 'kein Eigenzustand von $L^2$ mehr'], a:0, ex:'$L_zL_+|m\\rangle = L_+L_z|m\\rangle + \\hbar L_+|m\\rangle = \\hbar(m+1)L_+|m\\rangle$. Daher der Name „Aufsteiger“. $L^2$ bleibt unverändert, weil $[L^2, L_+] = 0$.'}}
    ],
    faded:{id:'dreh-fade', title:'Jetzt du: $[L_z, L_-]$', text:'Zeige $[L_z, L_-] = -\\hbar L_-$ mit $L_- = L_x - iL_y$.',
      ctx:DREH_JM(),
      given:['[L_z, L_-] = [L_z, L_x] - i[L_z, L_y]', '= iħ L_y - i(-iħ L_x)'],
      goals:[{id:'a', prompt:'Rechne zu Ende.', type:'show', from:'[L_z, L_-]', to:'-ħ L_-', hints:['Strategie: Vereinfache den zweiten Term und klammere dann einen gemeinsamen Faktor aus.', '$-i\\cdot(-i\\hbar) = i^2\\hbar = -\\hbar$.', 'Klammere $-\\hbar$ aus: $i\\hbar L_y - \\hbar L_x = -\\hbar(L_x - iL_y)$.'],
        model:['[L_z, L_-] = [L_z, L_x] - i[L_z, L_y]', '= iħ L_y - i(-iħ L_x)', {l:'= iħ L_y - ħ L_x', gap:'= iħ L_y ▢'}, '= -ħ (L_x - i L_y)', '= -ħ L_-']}]}
  },
  puzzle:{
    title:'Ein Kreisel mit riesigem $l$',
    text:'Für $l = 1$, $m = 1$ zeigt $\\vec L$ nicht genau in $z$-Richtung; im Vektormodell liegt es auf einem Kegel mit $45^\\circ$ Öffnung. Ein Spielzeugkreisel hat aber einen Drehimpuls von etwa $1\\,\\mathrm{J\\,s}$ und scheint sehr wohl genau in eine Richtung zu zeigen.\n\nNimm $m = l$ und lass $l$ sehr groß werden.',
    q:{q:'Wie verhält sich der Winkel $\\vartheta$ zwischen $\\vec L$ und der $z$-Achse im Vektormodell?', opts:['er geht etwa wie $1/\\sqrt l$ gegen null', 'er geht etwa wie $1/l$ gegen null', 'er bleibt bei $45^\\circ$ wie für $l = 1$', 'er wächst mit $l$'], a:0, ex:'Für $m = l$ ist $\\sin^2\\vartheta = 1/(l+1)$.'},
    reveal:'Im Vektormodell ist $\\cos\\vartheta = m/\\sqrt{l(l+1)}$. Für $m = l$ folgt $\\sin^2\\vartheta = 1 - \\frac{l}{l+1} = \\frac{1}{l+1}$, also $\\vartheta \\approx 1/\\sqrt l$ für große $l$. Dasselbe zeigt die Unschärfe: $\\langle L_x^2 + L_y^2\\rangle = \\hbar^2 l$ wächst nur wie $l$, $|\\vec L|^2 = \\hbar^2l(l+1)$ dagegen wie $l^2$.\n\nDer Kreisel mit $|\\vec L| \\approx 1\\,\\mathrm{J\\,s}$ hat $l \\approx 10^{34}$ und damit $\\vartheta \\approx 10^{-17}$. Er zeigt praktisch genau in eine Richtung, obwohl $L_x$ und $L_y$ nie scharf sind. Das ist die klassische Grenze, wie das Korrespondenzprinzip beim Oszillator (Thema 7).'
  },
  clarify:{
    core:'Die Komponenten des Drehimpulses vertauschen nicht: $[L_x, L_y] = i\\hbar L_z$ (und zyklisch), aber $[L^2, L_i] = 0$. Man wählt gemeinsame Eigenzustände $|l,m\\rangle$ von $L^2$ und $L_z$:\n\n$$L^2|l,m\\rangle = \\hbar^2l(l+1)|l,m\\rangle,\\qquad L_z|l,m\\rangle = \\hbar m|l,m\\rangle,\\qquad m = -l, \\dots, l.$$\n\nDie Leiteroperatoren $L_\\pm = L_x \\pm iL_y$ ändern $m$ um $\\pm1$: $L_\\pm|l,m\\rangle = \\hbar\\sqrt{l(l+1) - m(m\\pm1)}\\,|l,m\\pm1\\rangle$. Für den Bahndrehimpuls ist $l$ ganzzahlig und $\\langle\\theta,\\varphi|l,m\\rangle = Y_l^m(\\theta,\\varphi)$ mit $\\hat L_z = -i\\hbar\\partial_\\varphi$.',
    keys:[
      'Zu jedem $l$ gibt es $2l + 1$ Werte von $m$; $\\hat L^2$ ist also entartet, und nicht jeder Eigenzustand von $\\hat L^2$ ist einer von $\\hat L_z$.',
      '$L_+L_- = L^2 - L_z^2 + \\hbar L_z$ und $L_-L_+ = L^2 - L_z^2 - \\hbar L_z$ – daraus folgen Eigenwerte und Faktoren der Leiteroperatoren.',
      '$Y_l^m \\propto e^{im\\varphi}$, deshalb $\\hat L_zY_l^m = \\hbar mY_l^m$ sofort. $|Y_l^m|^2$ hängt nicht von $\\varphi$ ab.',
      'Normierung auf der Kugel: $\\int_0^\\pi\\int_0^{2\\pi}|Y_l^m|^2\\sin\\theta\\,d\\varphi\\,d\\theta = 1$ – das $\\sin\\theta$ nicht vergessen.',
      'Konvention: $Y_1^0 = \\sqrt{\\tfrac{3}{4\\pi}}\\cos\\theta$, $Y_1^{\\pm1} = \\mp\\sqrt{\\tfrac{3}{8\\pi}}\\sin\\theta\\,e^{\\pm i\\varphi}$ (Condon-Shortley-Phase).'
    ],
    errors:[
      '$|\\vec L| = \\hbar l$ statt $\\hbar\\sqrt{l(l+1)}$.',
      'Im Faktor von $L_+$ das Vorzeichen falsch: $m(m+1)$, nicht $m(m-1)$. Probe: $L_+|l,l\\rangle$ muss null sein.',
      '$L_\\pm$ für Observablen halten: Sie sind nicht hermitesch, $L_+^\\dagger = L_-$.',
      'Beim Integrieren über die Kugel $\\sin\\theta$ vergessen.',
      'Glauben, man könne $L_x$, $L_y$ und $L_z$ gleichzeitig scharf messen, oder $\\vec L$ zeige bei $m = l$ genau nach $z$.'
    ],
    more:[{title:'Halbzahlige Drehimpulse', text:'Aus den Vertauschungsrelationen allein folgen auch halbzahlige Werte $j = \\tfrac12, \\tfrac32, \\dots$ Beim Bahndrehimpuls schließt die Eindeutigkeit von $e^{im\\varphi}$ sie aus; beim Spin (Thema 10) kommen sie vor. Das Tutorial kennt deshalb auch Kets $|j,m\\rangle$ mit halbzahligem $j$.'}],
    checks:[
      {q:'Welche Werte kann $L_z$ bei $l = 2$ annehmen?', opts:['$-2\\hbar, -\\hbar, 0, \\hbar, 2\\hbar$', '$-2\\hbar, -\\hbar, \\hbar, 2\\hbar$', '$0, \\hbar, 2\\hbar, 3\\hbar, 4\\hbar$'], a:0, ex:'$m = -l, \\dots, l$, also fünf Werte; $0$ gehört dazu.'},
      {q:'Was ist $L_+|1,1\\rangle$?', opts:['der Nullvektor', 'ein Vielfaches von $|1,2\\rangle$', 'wieder $\\hbar\\,|1,1\\rangle$'], a:0, ex:'$\\sqrt{l(l+1) - m(m+1)} = \\sqrt{2 - 2} = 0$: Die Leiter endet bei $m = l$. Einen Zustand $|1,2\\rangle$ gibt es nicht.'}
    ]
  },
  lab:{type:'ylm', title:'Kugelflächenfunktionen im Polardiagramm',
    text:'Gezeichnet ist $|Y_l^m(\\theta,\\varphi)|^2$ als Abstand vom Ursprung in der $x$-$z$-Ebene. Weil $|Y_l^m|^2$ nicht von $\\varphi$ abhängt, entsteht die räumliche Form durch Drehen um die $z$-Achse.',
    predict:{q:'Bevor du die Regler bewegst: Bei welchem $m$ liegt für $l = 2$ die Aufenthaltswahrscheinlichkeit am stärksten an der $z$-Achse?', opts:['$m = 0$', '$m = \\pm1$', '$m = \\pm2$'], a:0, ex:'Kleines $|m|$ heißt: $\\vec L$ steht fast senkrecht zur $z$-Achse, die „Bewegung“ führt über die Pole. $|Y_2^0|^2 \\propto (3\\cos^2\\theta - 1)^2$ ist an den Polen maximal, $|Y_2^{\\pm2}|^2 \\propto \\sin^4\\theta$ dort null.'},
    questions:[
      {q:'Stelle $l = 1$, $m = 0$ ein. Wo ist $|Y_1^0|^2$ null?', opts:['in der $x$-$y$-Ebene ($\\theta = \\pi/2$)', 'auf der $z$-Achse', 'auf einem Kegel um die $z$-Achse'], a:0, ex:'$|Y_1^0|^2 \\propto \\cos^2\\theta$ verschwindet bei $\\theta = \\pi/2$.'},
      {q:'Stelle $l = 1$, $m = 1$ ein. Welche Form ergibt sich nach Drehung um $z$?', opts:['ein Ring (Torus) um die $z$-Achse', 'eine Hantel entlang der $z$-Achse', 'eine Kugel um den Ursprung'], a:0, ex:'$|Y_1^{\\pm1}|^2 \\propto \\sin^2\\theta$ ist in der $x$-$y$-Ebene am größten und auf der $z$-Achse null.'}
    ],
    noPic:{q:'Ohne Bild: Wie viele Knotenkegel ($\\theta$ = konstant) hat $Y_3^1$?', opts:['2', '3', '1'], a:0, ex:'Die Zahl der Knoten in $\\theta$ ist $l - |m| = 2$.'}},
  compare:{
    text:'Gesucht ist $\\hat L_zY_1^1$ mit $Y_1^1 = -\\sqrt{\\tfrac{3}{8\\pi}}\\sin\\theta\\,e^{i\\varphi}$ und $\\hat L_z = -i\\hbar\\,\\partial/\\partial\\varphi$. Zwei richtige Wege:',
    ctx:DREH_SPH(),
    A:{name:'Ableitung ausrechnen', model:['L̂_z Y_1^1(θ,φ) = -iħ ∂/∂φ (-sqrt(3/(8π)) sin(θ) e^(iφ))', '= -iħ · i (-sqrt(3/(8π)) sin(θ) e^(iφ))', '= ħ Y_1^1(θ,φ)']},
    B:{name:'Struktur $e^{im\\varphi}$ nutzen', text:'Jede $Y_l^m$ hängt nur über $e^{im\\varphi}$ von $\\varphi$ ab, also $\\partial_\\varphi Y_l^m = imY_l^m$.', model:['L̂_z Y_1^1(θ,φ) = -iħ · i · 1 · Y_1^1(θ,φ)', '= ħ Y_1^1(θ,φ)']},
    questions:[
      {q:'Für welche Aufgabe reicht Weg B nicht?', opts:['$\\hat L^2Y_l^m$ ausrechnen', '$\\hat L_zY_3^{-2}$ ausrechnen', '$\\hat L_z(\\sin^2\\theta\\,e^{2i\\varphi})$ ausrechnen'], a:0, ex:'$\\hat L^2$ enthält Ableitungen nach $\\theta$; dort hilft nur Ausrechnen oder das Wissen $\\hat L^2Y_l^m = \\hbar^2l(l+1)Y_l^m$.'},
      {q:'Was zeigt Weg A, das Weg B voraussetzt?', opts:['dass die Funktion die Form $f(\\theta)e^{i\\varphi}$ hat', 'dass $\\hat L_z$ hermitesch ist und reelle Eigenwerte hat', 'dass $Y_1^1$ auf der Kugel normiert ist'], a:0, ex:'Weg B nimmt die Form $f(\\theta)e^{im\\varphi}$ an; Weg A prüft sie an der konkreten Funktion.'}
    ]
  },
  concept:[
    {id:'dreh-k1', type:'dialog', seg:'dreh-t4',
      text:'Ein Zustand hat $l = 2$ und $m = 2$.',
      people:[
        {name:'Lena', says:'Hier ist $L_z$ maximal. Der Drehimpuls zeigt genau in $z$-Richtung. Dass $|\\vec L| = \\sqrt6\\,\\hbar$ statt $2\\hbar$ ist, ist nur eine quantenmechanische Korrektur am Betrag.'},
        {name:'Jonas', says:'Zeigte $\\vec L$ genau in $z$-Richtung, wären $L_x$ und $L_y$ scharf null. Es ist aber $\\langle L_x^2\\rangle = \\hbar^2 \\ne 0$.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$\\langle L_x^2\\rangle = \\frac{\\hbar^2}{2}(6 - 4) = \\hbar^2$, ebenso $\\langle L_y^2\\rangle$. Der Unterschied zwischen $\\sqrt6\\,\\hbar$ und $2\\hbar$ ist keine Korrektur, sondern der Anteil von $L_x$ und $L_y$.'},
    {id:'dreh-k2', type:'mc2', seg:'dreh-t2', lex:'dreh-gemeinsam',
      q:'Es gilt $[\\hat L^2,\\hat L_z] = 0$. Ist jeder Eigenzustand von $\\hat L^2$ auch Eigenzustand von $\\hat L_z$?', opts:['Nein, nicht jeder.', 'Ja, jeder.', 'Nur die mit $m = 0$.'], a:0,
      ex:'Es gibt eine gemeinsame Eigenbasis, aber nicht jede Eigenfunktion von $\\hat L^2$ gehört zu ihr.',
      reason:{q:'Warum?', opts:['$\\hat L^2$ ist entartet: $Y_1^1 + Y_1^0$ ist Eigenfunktion von $\\hat L^2$, nicht von $\\hat L_z$.', 'Vertauschende Operatoren haben dieselben Eigenzustände.', 'Für $m = 0$ wirkt $\\hat L_z$ wie der Nulloperator.'], a:0,
        ex:'Zu $l = 1$ gehören drei linear unabhängige Eigenfunktionen von $\\hat L^2$. Ihre Überlagerungen sind wieder Eigenfunktionen von $\\hat L^2$, aber nur die reinen $Y_1^m$ sind Eigenfunktionen von $\\hat L_z$.'}},
    {id:'dreh-k3', type:'mc', seg:'dreh-t2',
      q:'Ein Zustand ist zugleich Eigenzustand von $\\hat L_z$ und von $\\hat L_x$. Was folgt?', opts:['$l = 0$; alle Komponenten sind null.', '$m = 0$ bei beliebigem $l$.', 'So einen Zustand gibt es nicht.'], a:0,
      ex:'Aus beiden Eigenwertgleichungen folgt $[\\hat L_z,\\hat L_x]\\psi = 0$, also $\\hat L_y\\psi = 0$, und ebenso für die anderen Komponenten. Das erfüllt nur $Y_0^0$. $|1,0\\rangle$ hat zwar $L_z = 0$ scharf, aber $\\hat L_x|1,0\\rangle = \\frac{\\hbar}{\\sqrt2}(|1,1\\rangle + |1,-1\\rangle)$.'},
    {id:'dreh-k4', type:'mc', seg:'dreh-t2',
      q:'Zustand $\\frac{1}{\\sqrt3}(|1,1\\rangle + |1,0\\rangle + |1,-1\\rangle)$. Man misst $L_z$ und erhält $\\hbar$. Danach misst man $L^2$. Was kommt heraus?', opts:['sicher $2\\hbar^2$', 'sicher $\\hbar^2$', '$2\\hbar^2$ mit Wahrscheinlichkeit $\\tfrac13$'], a:0,
      ex:'Nach der ersten Messung ist der Zustand $|1,1\\rangle$. Er hat $L^2 = \\hbar^2l(l+1) = 2\\hbar^2$, nicht $L_z^2 = \\hbar^2$. Schon vorher war $L^2$ scharf, weil alle Anteile $l = 1$ haben.'},
    {id:'dreh-k5', type:'mc2', seg:'dreh-t6',
      q:'Hat ein Elektron im reellen Orbital $p_x \\propto \\sin\\theta\\cos\\varphi$ einen scharfen Wert von $L_z$?', opts:['Nein', 'Ja, $L_z = 0$', 'Ja, $L_z = \\hbar$'], a:0,
      ex:'$L_z$ ist in $p_x$ nicht scharf; eine Messung liefert $\\pm\\hbar$.',
      reason:{q:'Warum?', opts:['$p_x \\propto Y_1^{-1} - Y_1^1$ ist eine Überlagerung von $m = \\pm1$.', '$\\langle L_z\\rangle = 0$ heißt, dass $L_z$ scharf null ist.', '$p_x$ liegt in der $x$-$y$-Ebene, also zeigt $\\vec L$ nach $z$.'], a:0,
        ex:'$\\cos\\varphi = \\tfrac12(e^{i\\varphi} + e^{-i\\varphi})$. Mittelwert null heißt nicht Unschärfe null.'}}
  ],
  practice:[
    {id:'dreh-p1', title:'Algebra mit Leiteroperatoren',
      text:'Zustände $|l,m\\rangle$; Operatoren `L_x`, `L_y`, `L_z`, `L_+`, `L_-`, `L^2` (ohne Dach). Es gilt $[L_x, L_y] = i\\hbar L_z$.',
      ctx:DREH_JM(),
      goals:[
        {id:'a', prompt:'a) Zeige $L_+L_- = L^2 - L_z^2 + \\hbar L_z$.', type:'show', from:'L_+ L_-', to:'L^2 - L_z^2 + ħ L_z', points:3,
          hints:['Setze die Definitionen von $L_\\pm$ ein und multipliziere aus, ohne Reihenfolgen zu vertauschen.', 'Regel: Die Mischterme ergeben $-i(L_xL_y - L_yL_x) = -i[L_x, L_y]$.', 'Nächster Schritt: $-i\\cdot i\\hbar L_z = \\hbar L_z$ und $L_x^2 + L_y^2 = L^2 - L_z^2$.'],
          model:['L_+ L_- = (L_x + i L_y)(L_x - i L_y)', '= L_x^2 + L_y^2 - i[L_x, L_y]', '= L_x^2 + L_y^2 + ħ L_z', '= L^2 - L_z^2 + ħ L_z']},
        {id:'b', prompt:'b) Berechne $\\langle l,m|L_x^2|l,m\\rangle$. Aus Symmetriegründen ist $\\langle L_x^2\\rangle = \\langle L_y^2\\rangle$.', type:'value', target:'ħ^2/2 (l(l+1) - m^2)', points:2,
          hints:['Du kennst $\\langle L^2\\rangle$ und $\\langle L_z^2\\rangle$. Wie hängt $L_x^2$ damit zusammen?', 'Regel: $L_x^2 + L_y^2 = L^2 - L_z^2$.', 'Nächster Schritt: $\\langle L_x^2\\rangle = \\tfrac12\\langle L^2 - L_z^2\\rangle$.'],
          model:['⟨l,m|L_x^2|l,m⟩ = 1/2 ⟨l,m|(L^2 - L_z^2)|l,m⟩', '= ħ^2/2 (l(l+1) - m^2)']}
      ]},
    {id:'dreh-p2', title:'Der Faktor von $L_+$',
      text:'$L_+|l,m\\rangle$ ist proportional zu $|l,m+1\\rangle$. Den Betrag des Faktors bestimmst du über die Norm.',
      ctx:DREH_JM({unknowns:{c:{ref:'sqrt(2) ħ'}}}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\|L_+|l,m\\rangle\\|^2 = \\langle l,m|L_-L_+|l,m\\rangle$.', type:'value', target:'ħ^2 (l(l+1) - m(m+1))', points:3,
          hints:['Schreibe $L_-L_+$ durch Operatoren aus, deren Eigenwerte auf $|l,m\\rangle$ du kennst.', 'Regel: $L_-L_+ = L^2 - L_z^2 - \\hbar L_z$.', 'Nächster Schritt: Setze $\\hbar^2l(l+1)$, $\\hbar^2m^2$ und $\\hbar^2m$ ein.'],
          model:['⟨l,m|L_- L_+|l,m⟩ = ⟨l,m|(L^2 - L_z^2 - ħ L_z)|l,m⟩', '= ħ^2 (l(l+1) - m^2 - m)']},
        {id:'b', prompt:'b) Bestimme $c$ in $L_+|1,-1\\rangle = c\\,|1,0\\rangle$.', type:'solve', unknown:'c', points:2,
          hints:['Nutze das Ergebnis aus a) mit $l = 1$, $m = -1$.', 'Regel: $c = \\hbar\\sqrt{l(l+1) - m(m+1)}$, mit $c > 0$ gewählt.', 'Nächster Schritt: $m(m+1) = (-1)\\cdot 0 = 0$.'],
          model:['L_+|1,-1⟩ = c |1, 0⟩', 'c = ħ sqrt(1·2 - (-1)·0)', 'c = sqrt(2) ħ']}
      ]},
    {id:'dreh-p3', title:'Eigenwerte in Kugelkoordinaten',
      text:'$\\hat L^2 = -\\hbar^2\\left[\\frac{1}{\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial}{\\partial\\theta}\\right) + \\frac{1}{\\sin^2\\theta}\\frac{\\partial^2}{\\partial\\varphi^2}\\right]$ und $\\hat L_z = -i\\hbar\\frac{\\partial}{\\partial\\varphi}$. Im Tutorial: `L̂^2` und `L̂_z`.',
      ctx:DREH_SPH({λ:{ref:'2ħ^2'}, μ:{ref:'ħ', kind:'real'}}),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $\\cos\\theta$ Eigenfunktion von $\\hat L^2$ ist, und bestimme den Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:3,
          hints:['Wende $\\hat L^2$ an und prüfe, ob ein Vielfaches von $\\cos\\theta$ herauskommt.', 'Regel: $\\cos\\theta$ hängt nicht von $\\varphi$ ab; nur der $\\theta$-Teil trägt bei.', 'Nächster Schritt: $\\sin\\theta\\,\\partial_\\theta\\cos\\theta = -\\sin^2\\theta$.'],
          model:['L̂^2 cos(θ) = λ cos(θ)', 'L̂^2 cos(θ) = -ħ^2/sin(θ) ∂/∂θ (sin(θ) ∂/∂θ cos(θ))', '= -ħ^2/sin(θ) ∂/∂θ (-sin(θ)^2)', '= -ħ^2/sin(θ) (-2 sin(θ) cos(θ))', '= 2ħ^2 cos(θ)', 'λ = 2ħ^2'],
          note:'$\\lambda = 2\\hbar^2 = \\hbar^2l(l+1)$ mit $l = 1$: $\\cos\\theta \\propto Y_1^0$.'},
        {id:'b', prompt:'b) Bestimme den Eigenwert $\\mu$ von $\\hat L_z$ zu $\\sin\\theta\\,e^{i\\varphi}$.', type:'solve', unknown:'μ', points:2,
          hints:['Nur $\\hat L_z = -i\\hbar\\,\\partial_\\varphi$ ist nötig; $\\sin\\theta$ ist dabei eine Konstante.', 'Regel: $\\partial_\\varphi e^{i\\varphi} = ie^{i\\varphi}$.', 'Nächster Schritt: $-i\\hbar\\cdot i = \\hbar$.'],
          model:['L̂_z sin(θ) e^(iφ) = μ sin(θ) e^(iφ)', 'L̂_z sin(θ) e^(iφ) = -iħ · i sin(θ) e^(iφ)', '= ħ sin(θ) e^(iφ)', 'μ = ħ']}
      ]},
    {id:'dreh-p4', title:'Normierung und Orthogonalität auf der Kugel',
      text:'Auf der Einheitskugel ist $\\langle f|g\\rangle = \\int_0^\\pi\\int_0^{2\\pi}f^*g\\,\\sin\\theta\\,d\\varphi\\,d\\theta$.',
      ctx:DREH_SPH({N:{ref:'sqrt(3/(4π))', alt:['-sqrt(3/(4π))']}}),
      goals:[
        {id:'a', prompt:'a) Bestimme $N > 0$ so, dass $N\\cos\\theta$ normiert ist.', type:'solve', unknown:'N', points:2,
          hints:['Normieren heißt $\\int|N\\cos\\theta|^2\\,d\\Omega = 1$ mit $d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$.', 'Regel: $\\int_0^\\pi\\cos^2\\theta\\sin\\theta\\,d\\theta = 2/3$ (Substitution $u = \\cos\\theta$).', 'Nächster Schritt: Das $\\varphi$-Integral gibt $2\\pi$; dann $|N|^2\\cdot2\\pi\\cdot\\tfrac23 = 1$.'],
          model:['|N|^2 ∫_0^π ∫_0^{2π} cos(θ)^2 sin(θ) dφ dθ = 1', '|N|^2 · 2π · 2/3 = 1', 'N = sqrt(3/(4π))']},
        {id:'b', prompt:'b) Zeige $\\langle Y_1^0|Y_1^1\\rangle = 0$.', type:'value', target:'0', points:2,
          hints:['Schreibe das Skalarprodukt als Doppelintegral mit $Y_1^{0*}Y_1^1\\sin\\theta$.', 'Regel: Das Produkt zerfällt in ein $\\theta$- und ein $\\varphi$-Integral.', 'Nächster Schritt: $\\int_0^{2\\pi}e^{i\\varphi}d\\varphi = 0$.'],
          model:['⟨Y_1^0(θ,φ)|Y_1^1(θ,φ)⟩ = ∫_0^π ∫_0^{2π} Y_1^0(θ,φ)^* Y_1^1(θ,φ) sin(θ) dφ dθ', '= -3/(4π sqrt(2)) ∫_0^π cos(θ) sin(θ)^2 dθ ∫_0^{2π} e^(iφ) dφ', '= 0']}
      ]},
    {id:'dreh-p5', title:'Matrixelemente bei $l = 1$',
      text:'Benutze $L_x = \\tfrac12(L_+ + L_-)$. Der Zustand $|\\chi\\rangle$ ist $|1,0\\rangle$; `⟨L_x⟩` und `ΔL_x` beziehen sich auf ihn.',
      ctx:DREH_JM({states:{χ:'|1, 0⟩'}, state:'χ'}),
      goals:[
        {id:'a', prompt:'a) Berechne $\\langle 1,1|L_x|1,0\\rangle$.', type:'value', target:'ħ/sqrt(2)', points:2,
          hints:['Drücke $L_x$ durch $L_\\pm$ aus; nur ein Term führt von $|1,0\\rangle$ nach $|1,1\\rangle$.', 'Regel: $L_+|1,0\\rangle = \\hbar\\sqrt2\\,|1,1\\rangle$, und $L_-|1,0\\rangle \\propto |1,-1\\rangle$ ist orthogonal zu $|1,1\\rangle$.', 'Nächster Schritt: $\\langle 1,1|L_x|1,0\\rangle = \\tfrac12\\hbar\\sqrt2$.'],
          model:['⟨1,1|L_x|1, 0⟩ = 1/2 ⟨1,1|(L_+ + L_-)|1, 0⟩', '= 1/2 ħ sqrt(2)', '= ħ/sqrt(2)']},
        {id:'b', prompt:'b) Berechne $\\Delta L_x$ im Zustand $|1,0\\rangle$.', type:'value', target:'ħ', points:2,
          hints:['Unschärfe: $\\Delta L_x = \\sqrt{\\langle L_x^2\\rangle - \\langle L_x\\rangle^2}$.', 'Regel: $\\langle L_x\\rangle = 0$ und $\\langle L_x^2\\rangle = \\frac{\\hbar^2}{2}(l(l+1) - m^2)$.', 'Nächster Schritt: Mit $l = 1$, $m = 0$ ist $\\langle L_x^2\\rangle = \\hbar^2$.'],
          model:['ΔL_x = sqrt(⟨L_x^2⟩ - ⟨L_x⟩^2)', '= sqrt(ħ^2 - 0)', '= ħ']}
      ]}
  ],
  sketch:[
    {id:'dreh-s1', title:'$|Y_2^1|^2$ über $\\theta$', kind:'curve', draw:'abs2',
      text:'Skizziere $|Y_2^1(\\theta, \\varphi)|^2$ als Funktion des Polarwinkels $\\theta$ von $0$ (Nordpol) bis $\\pi$ (Südpol). Die Höhe ist frei. $Y_2^1$ erhältst du mit $\\hat L_-$ aus $Y_2^2 \\propto \\sin^2\\theta\\,e^{2i\\varphi}$ (Abschnitt ‚Bahndrehimpuls in Kugelkoordinaten‘).',
      plot:{x:[0, Math.PI], xlab:'\\theta', ylab:'|Y_2^1|^2', ticks:DREH_SK.T},
      f:DREH_SK.Y21,
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann $|Y_l^m|^2$ irgendwo negativ sein? Was bedeutet das Betragsquadrat?'},
        {id:'pol', name:'Pole', type:'zero', at:[0, Math.PI], msg:'Welchen Wert hat $|Y_2^1|^2$ auf der $z$-Achse, also bei $\\theta = 0$ und $\\theta = \\pi$? Welcher Faktor von $Y_2^1$ entscheidet das?'},
        {id:'knoten', type:'nodes', n:1, msg:'Wie viele Knoten in $\\theta$ hat $Y_l^m$ zwischen den Polen? Deine Skizze hat {got}. (Abschnitt ‚Kugelflächenfunktionen lesen‘)'},
        {id:'sym', type:'parity', p:'even', about:Math.PI / 2, msg:'Ändert sich $|Y_l^m|^2$, wenn du am Äquator spiegelst, also $\\theta \\to \\pi - \\theta$? Deine Skizze ist {got}.'}
      ],
      reveal:'$|Y_2^1|^2 = \\frac{15}{8\\pi}\\sin^2\\theta\\cos^2\\theta$. Der Faktor $\\sin^2\\theta$ macht sie an beiden Polen null, $\\cos^2\\theta$ gibt den einen Knoten ($l - |m| = 1$) am Äquator. Dazwischen liegen zwei gleich hohe Buckel bei $\\theta = \\pi/4$ und $3\\pi/4$; räumlich sind das zwei Kegel um die $z$-Achse. Die Kurve ist symmetrisch zum Äquator, weil $Y_l^m$ unter $\\vec r \\to -\\vec r$ nur den Faktor $(-1)^l$ bekommt.',
      hints:['Wende $\\hat L_- = -\\hbar e^{-i\\varphi}(\\partial_\\theta - i\\cot\\theta\\,\\partial_\\varphi)$ auf $\\sin^2\\theta\\,e^{2i\\varphi}$ an und zerlege das Ergebnis in Faktoren.', 'Es ergibt sich $Y_2^1 \\propto \\sin\\theta\\cos\\theta\\,e^{i\\varphi}$. Was macht $\\sin\\theta$ an den Polen, was $\\cos\\theta$ am Äquator, und was bleibt von $e^{i\\varphi}$ im Betragsquadrat? In $\\theta$ hat $Y_l^m$ genau $l - |m|$ Knoten.'],
      wrong:[
        {f:DREH_SK.Y20, fails:['pol', 'knoten'], why:'mit $m = 0$ verwechselt: Wahrscheinlichkeit an den Polen'},
        {f:DREH_SK.Y11, fails:['knoten'], why:'Knotenzahl falsch: ein Ring um den Äquator wie bei $|m| = l$'},
        {f:DREH_SK.Y22, fails:['knoten'], why:'mit $|Y_2^2|^2 \\propto \\sin^4\\theta$ verwechselt: kein Knoten am Äquator'}
      ]},
    {id:'dreh-s2', title:'$|Y_1^1|^2$ entlang des Äquators', kind:'curve', draw:'abs2',
      text:'Auf dem Äquator ($\\theta = \\pi/2$) läuft der Azimut $\\varphi$ von $0$ bis $2\\pi$ einmal um die $z$-Achse. Skizziere $|Y_1^1(\\pi/2, \\varphi)|^2$ als Funktion von $\\varphi$. Die Höhe ist frei.',
      plot:{x:[0, 2 * Math.PI], xlab:'\\varphi', ylab:'|Y_1^1|^2', ticks:DREH_SK.TP},
      f:p => DREH_SK.Y11(Math.PI / 2),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann $|Y|^2$ negativ sein?'},
        {id:'flach', type:'amp', a:[1.3, 1.85], b:[2.85, 3.45], cmp:'=', f:1.6, name:'bei π/2 wie bei π', msg:'Wie hängt $Y_1^1$ von $\\varphi$ ab, und was bleibt davon im Betragsquadrat übrig? Bei $\\varphi = \\pi/2$ und $\\varphi = \\pi$ ist deine Kurve verschieden hoch (Verhältnis {got}).'},
        {id:'flach2', type:'amp', a:[4.45, 4.98], b:[2.85, 3.45], cmp:'=', f:1.6, name:'bei 3π/2 wie bei π', msg:'Wie hängt $Y_1^1$ von $\\varphi$ ab, und was bleibt davon im Betragsquadrat übrig? Bei $\\varphi = 3\\pi/2$ und $\\varphi = \\pi$ ist deine Kurve verschieden hoch (Verhältnis {got}).'}
      ],
      reveal:'$Y_1^1 \\propto \\sin\\theta\\,e^{i\\varphi}$, und $|e^{i\\varphi}|^2 = 1$. Auf dem Äquator ist $|Y_1^1|^2 = \\frac{3}{8\\pi}$ für jedes $\\varphi$: eine waagerechte Linie. Deshalb sind alle Bilder von $|Y_l^m|^2$ rotationssymmetrisch um die $z$-Achse. Das reelle Orbital $p_x \\propto \\sin\\theta\\cos\\varphi$ ist dagegen eine Überlagerung von $Y_1^1$ und $Y_1^{-1}$; erst bei ihm hängt die Dichte von $\\varphi$ ab.',
      hints:['Schreibe $Y_1^1$ als Produkt aus einem $\\theta$-Teil und einem $\\varphi$-Teil. Welcher Teil ändert sich entlang des Äquators?', '$|e^{im\\varphi}|^2 = e^{-im\\varphi}e^{im\\varphi} = 1$ für jedes $\\varphi$.'],
      wrong:[
        {f:p => Math.cos(p) ** 2, fails:['flach', 'flach2'], why:'mit dem reellen Orbital $p_x \\propto \\sin\\theta\\cos\\varphi$ verwechselt'},
        {f:p => Math.sin(p) ** 2, fails:['flach', 'flach2'], why:'mit dem reellen Orbital $p_y \\propto \\sin\\theta\\sin\\varphi$ verwechselt'},
        {f:p => Math.cos(p), fails:['pos', 'flach', 'flach2'], why:'Realteil $\\cos\\varphi$ statt Betragsquadrat'}
      ]}
  ],
  final:[
    {aim:0, task:{id:'dreh-f3', title:'Kommutator der Leiteroperatoren', text:'Zustände $|l,m\\rangle$; Operatoren `L_x`, `L_y`, `L_z`, `L_+`, `L_-` (ohne Dach). Es gilt $[L_x, L_y] = i\\hbar L_z$.',
      ctx:DREH_JM(),
      goals:[{id:'a', prompt:'Zeige $[L_+, L_-] = 2\\hbar L_z$.', type:'show', from:'[L_+, L_-]', to:'2ħ L_z', points:3,
        model:['[L_+, L_-] = [L_x + i L_y, L_x - i L_y]', '= -i[L_x, L_y] + i[L_y, L_x]', '= -2i [L_x, L_y]', '= 2ħ L_z']}]}},
    {aim:1, task:{id:'dreh-f2', title:'Leiterfaktor', text:'Zustände $|l,m\\rangle$, Aufsteiger `L_+`.',
      ctx:DREH_JM(),
      goals:[{id:'a', prompt:'Berechne $\\langle 2,2|L_+|2,1\\rangle$.', type:'value', target:'2ħ', points:2, model:['⟨2,2|L_+|2,1⟩ = ħ sqrt(2·3 - 1·2)', '= ħ sqrt(4)', '= 2ħ']}]}},
    {aim:2, task:{id:'dreh-f4', title:'Eigenwert und Normierung auf der Kugel', text:'$\\hat L^2 = -\\hbar^2\\left[\\frac{1}{\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial}{\\partial\\theta}\\right) + \\frac{1}{\\sin^2\\theta}\\frac{\\partial^2}{\\partial\\varphi^2}\\right]$. Auf der Einheitskugel ist $\\langle f|g\\rangle = \\int_0^\\pi\\int_0^{2\\pi}f^*g\\,\\sin\\theta\\,d\\varphi\\,d\\theta$. Im Tutorial: `L̂^2`.',
      ctx:DREH_SPH({λ:{ref:'6ħ^2'}, N:{ref:'sqrt(15/(8π))', alt:['-sqrt(15/(8π))']}}),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $\\sin\\theta\\cos\\theta\\,e^{i\\varphi}$ Eigenfunktion von $\\hat L^2$ ist, und bestimme den Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:3,
          model:['L̂^2 (sin(θ) cos(θ) e^(iφ)) = λ sin(θ) cos(θ) e^(iφ)', 'L̂^2 (sin(θ) cos(θ) e^(iφ)) = -ħ^2 (1/sin(θ) ∂/∂θ (sin(θ) cos(2θ)) - 1/sin(θ)^2 sin(θ) cos(θ)) e^(iφ)', '= -ħ^2 (cos(θ) cos(2θ)/sin(θ) - 2 sin(2θ) - cos(θ)/sin(θ)) e^(iφ)', '= 6ħ^2 sin(θ) cos(θ) e^(iφ)', 'λ = 6ħ^2']},
        {id:'b', prompt:'b) Bestimme $N > 0$ so, dass $N\\sin\\theta\\cos\\theta\\,e^{i\\varphi}$ normiert ist.', type:'solve', unknown:'N', points:3,
          model:['|N|^2 ∫_0^π ∫_0^{2π} sin(θ)^2 cos(θ)^2 sin(θ) dφ dθ = 1', '|N|^2 · 2π · 4/15 = 1', 'N = sqrt(15/(8π))']}
      ]}},
    {aim:'k', id:'dreh-fk1', type:'mc2',
      q:'Ein Zustand ist $\\frac{1}{\\sqrt2}(|2,1\\rangle + |1,1\\rangle)$. Man misst $L_z$. Was kommt heraus?', opts:['sicher $\\hbar$', '$\\hbar$ oder $2\\hbar$, je mit $\\tfrac12$', '$\\sqrt2\\,\\hbar$ oder $\\sqrt6\\,\\hbar$'], a:0,
      ex:'Beide Anteile haben $m = 1$. Der Zustand ist Eigenzustand von $\\hat L_z$, aber nicht von $\\hat L^2$.',
      reason:{q:'Warum?', opts:['Beide Anteile haben $m = 1$; das genügt für $\\hat L_z$.', '$L_z$ hängt von $l$ ab, also gibt es zwei Ergebnisse.', 'Eine $L_z$-Messung liefert den Betrag $|\\vec L|$.'], a:0,
        ex:'$\\hat L_z$ multipliziert beide Anteile mit $\\hbar$. Eine Messung von $L^2$ dagegen ergäbe $6\\hbar^2$ oder $2\\hbar^2$.'}},
    {aim:'k', id:'dreh-fk2', type:'dialog',
      text:'Ein Elektron ist im Zustand $Y_1^0$, also $l = 1$, $m = 0$.',
      people:[
        {name:'Lena', says:'$L_z = 0$ heißt: Der Drehimpuls liegt in der $x$-$y$-Ebene. Eine Messung von $L_x$ ergibt also sicher $\\pm\\sqrt2\\,\\hbar$.'},
        {name:'Jonas', says:'Eine Messung von $L_x$ liefert einen Eigenwert von $\\hat L_x$, also $-\\hbar$, $0$ oder $\\hbar$. In $Y_1^0$ kommen nur $\\pm\\hbar$ vor, je mit Wahrscheinlichkeit $\\tfrac12$.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:1,
      ex:'$\\hat L_x$ hat bei $l = 1$ dieselben Eigenwerte wie $\\hat L_z$. Zerlegt man $|1,0\\rangle$ in die Eigenzustände von $\\hat L_x$, haben die zu $\\pm\\hbar$ je das Gewicht $\\tfrac12$, der zu $0$ das Gewicht null. $\\sqrt2\\,\\hbar$ ist der Betrag $|\\vec L|$, kein Messwert einer Komponente.'},
    {aim:2, sketch:{id:'dreh-fs1', title:'Verteilung des Polarwinkels in $Y_1^0$', kind:'curve', draw:'abs2',
      text:'Ein Teilchen ist im Drehimpulszustand $Y_1^0$. Skizziere die Wahrscheinlichkeitsdichte $p(\\theta)$ des Polarwinkels für $0 \\le \\theta \\le \\pi$. Dabei ist $p(\\theta)\\,d\\theta$ die Wahrscheinlichkeit, die Richtung des Teilchens zwischen $\\theta$ und $\\theta + d\\theta$ zu finden, gleich bei welchem $\\varphi$. Die Höhe ist frei.',
      plot:{x:[0, Math.PI], xlab:'\\theta', ylab:'p(\\theta)', ticks:DREH_SK.T},
      f:DREH_SK.p('Y10'),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann $|Y_l^m|^2$ irgendwo negativ sein? Was bedeutet das Betragsquadrat?'},
        {id:'pol', name:'Pole', type:'zero', at:[0, Math.PI], msg:'Welcher Anteil der Kugelfläche liegt in einem schmalen Streifen $d\\theta$ direkt am Pol? Welcher Faktor im Flächenelement $d\\Omega$ sorgt dafür?'},
        {id:'knoten', type:'nodes', n:1, msg:'Wo ist $Y_1^0$ selbst null? Deine Skizze hat {got} Nullstellen zwischen den Polen.'},
        {id:'max', name:'Lage des Maximums', type:'maxat', x:0.6155, tol:0.3, range:[0, Math.PI / 2], msg:'Liegt das Maximum von $p(\\theta)$ in der oberen Hälfte am Pol, am Äquator oder dazwischen? Zwei Faktoren arbeiten gegeneinander.'}
      ],
      reveal:'Die Dichte über $\\theta$ enthält das Flächenelement $d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$: $p(\\theta) = 2\\pi|Y_1^0|^2\\sin\\theta = \\tfrac32\\cos^2\\theta\\,\\sin\\theta$, mit Fläche 1. Der Faktor $\\sin\\theta$ macht $p$ an den Polen null, weil die Breitenkreise dort klein werden. $\\cos^2\\theta$ gibt den Knoten am Äquator. Das Maximum liegt bei $\\tan^2\\theta = \\tfrac12$, also $\\theta \\approx 35°$, und nicht am Pol, obwohl $|Y_1^0|^2$ dort am größten ist.',
      wrong:[
        {f:DREH_SK.Y10, fails:['pol', 'max'], why:'Flächenelement $\\sin\\theta$ vergessen: $|Y_1^0|^2$ statt $p(\\theta)$'},
        {f:DREH_SK.p('Y11'), fails:['knoten', 'max'], why:'mit $|m| = 1$ verwechselt: Ring am Äquator statt Kegel um die Pole'}
      ], points:3}}
  ],
  finalB:[
    {aim:0, task:{id:'dreh-f5', title:'$L_z$ und das Produkt $L_+L_-$', text:'Zustände $|l,m\\rangle$; Operatoren `L_x`, `L_y`, `L_z`, `L_+`, `L_-` (ohne Dach). Es gilt $[L_x, L_y] = i\\hbar L_z$ und zyklisch.',
      ctx:DREH_JM(),
      goals:[{id:'a', prompt:'Zeige $[L_z, L_+L_-] = 0$.', type:'show', from:'[L_z, L_+ L_-]', to:'0', points:3,
        model:['[L_z, L_+ L_-] = [L_z, L_+] L_- + L_+ [L_z, L_-]', '= ħ L_+ L_- - ħ L_+ L_-', '= 0']}]}},
    {aim:1, task:{id:'dreh-f6', title:'Absteiger bei $l = 3$', text:'Zustände $|l,m\\rangle$, Absteiger `L_-`.',
      ctx:DREH_JM(),
      goals:[{id:'a', prompt:'Berechne $\\langle 3,-1|L_-|3,0\\rangle$.', type:'value', target:'2 sqrt(3) ħ', points:2, model:['⟨3,-1|L_-|3,0⟩ = ħ sqrt(3·4 - 0·(-1))', '= ħ sqrt(12)', '= 2 sqrt(3) ħ']}]}},
    {aim:2, task:{id:'dreh-f7', title:'Eigenwert und Normierung auf der Kugel', text:'$\\hat L^2 = -\\hbar^2\\left[\\frac{1}{\\sin\\theta}\\frac{\\partial}{\\partial\\theta}\\left(\\sin\\theta\\frac{\\partial}{\\partial\\theta}\\right) + \\frac{1}{\\sin^2\\theta}\\frac{\\partial^2}{\\partial\\varphi^2}\\right]$. Auf der Einheitskugel ist $\\langle f|g\\rangle = \\int_0^\\pi\\int_0^{2\\pi}f^*g\\,\\sin\\theta\\,d\\varphi\\,d\\theta$. Im Tutorial: `L̂^2`.',
      ctx:DREH_SPH({λ:{ref:'6ħ^2'}, N:{ref:'sqrt(15/(32π))', alt:['-sqrt(15/(32π))']}}),
      goals:[
        {id:'a', prompt:'a) Zeige, dass $\\sin^2\\theta\\,e^{2i\\varphi}$ Eigenfunktion von $\\hat L^2$ ist, und bestimme den Eigenwert $\\lambda$.', type:'solve', unknown:'λ', points:3,
          model:['L̂^2 (sin(θ)^2 e^(2iφ)) = λ sin(θ)^2 e^(2iφ)', 'L̂^2 (sin(θ)^2 e^(2iφ)) = -ħ^2 (1/sin(θ) ∂/∂θ (2 sin(θ)^2 cos(θ)) - 4/sin(θ)^2 sin(θ)^2) e^(2iφ)', '= -ħ^2 (4 cos(θ)^2 - 2 sin(θ)^2 - 4) e^(2iφ)', '= 6ħ^2 sin(θ)^2 e^(2iφ)', 'λ = 6ħ^2']},
        {id:'b', prompt:'b) Bestimme $N > 0$ so, dass $N\\sin^2\\theta\\,e^{2i\\varphi}$ normiert ist.', type:'solve', unknown:'N', points:3,
          model:['|N|^2 ∫_0^π ∫_0^{2π} sin(θ)^4 sin(θ) dφ dθ = 1', '|N|^2 · 2π · 16/15 = 1', 'N = sqrt(15/(32π))']}
      ]}},
    {aim:'k', id:'dreh-fk3', type:'mc2',
      q:'Welchen Wert liefert eine Messung von $L^2$ im Zustand $|3,3\\rangle$?', opts:['$12\\hbar^2$', '$9\\hbar^2$', '$3\\hbar^2$'], a:0,
      ex:'$\\hbar^2l(l+1) = 12\\hbar^2$, obwohl $L_z^2 = 9\\hbar^2$ ist.',
      reason:{q:'Warum nicht $9\\hbar^2$?', opts:['Auch bei $m = l$ tragen $L_x^2$ und $L_y^2$ bei.', 'Weil $L^2$ immer $l(l+1)$ ist, ohne $\\hbar^2$.', 'Weil bei $m = l$ der Vektor genau nach $z$ zeigt.'], a:0,
        ex:'$\\langle L_x^2 + L_y^2\\rangle = \\hbar^2[l(l+1) - m^2] = 3\\hbar^2$. Zeigte $\\vec L$ genau nach $z$, wäre das null.'}},
    {aim:'k', id:'dreh-fk4', type:'dialog',
      text:'Es gilt $[\\hat L^2,\\hat L_z] = 0$. Betrachtet wird $\\psi = Y_2^1 + Y_2^{-1}$.',
      people:[
        {name:'Lena', says:'$\\psi$ ist Eigenfunktion von $\\hat L^2$, weil beide Summanden zu $l = 2$ gehören.'},
        {name:'Jonas', says:'Weil $\\hat L^2$ und $\\hat L_z$ vertauschen, muss $\\psi$ dann auch Eigenfunktion von $\\hat L_z$ sein.'}
      ],
      q:'Wer hat recht?', opts:['Lena', 'Jonas', 'beide', 'keiner von beiden'], keep:true, a:0,
      ex:'$\\hat L^2\\psi = 6\\hbar^2\\psi$. Aber $\\hat L_z\\psi = \\hbar(Y_2^1 - Y_2^{-1})$ ist kein Vielfaches von $\\psi$. Vertauschende Operatoren haben eine gemeinsame Eigenbasis; bei Entartung ist nicht jede Eigenfunktion des einen auch eine des anderen.'},
    {aim:2, sketch:{id:'dreh-fs2', title:'Verteilung des Polarwinkels in $Y_2^0$', kind:'curve', draw:'abs2',
      text:'Ein Teilchen ist im Drehimpulszustand $Y_2^0 \\propto 3\\cos^2\\theta - 1$. Skizziere die Wahrscheinlichkeitsdichte $p(\\theta)$ des Polarwinkels für $0 \\le \\theta \\le \\pi$. Dabei ist $p(\\theta)\\,d\\theta$ die Wahrscheinlichkeit, die Richtung des Teilchens zwischen $\\theta$ und $\\theta + d\\theta$ zu finden, gleich bei welchem $\\varphi$. Die Höhe ist frei.',
      plot:{x:[0, Math.PI], xlab:'\\theta', ylab:'p(\\theta)', ticks:DREH_SK.T},
      f:DREH_SK.p('Y20'),
      checks:[
        {id:'pos', type:'nonneg', msg:'Kann $|Y_l^m|^2$ irgendwo negativ sein? Was bedeutet das Betragsquadrat?'},
        {id:'pol', name:'Pole', type:'zero', at:[0, Math.PI], msg:'Welcher Anteil der Kugelfläche liegt in einem schmalen Streifen $d\\theta$ direkt am Pol? Welcher Faktor im Flächenelement $d\\Omega$ sorgt dafür?'},
        {id:'knoten', type:'nodes', n:2, msg:'Wo ist $Y_2^0$ selbst null? Deine Skizze hat {got} Nullstellen zwischen den Polen.'},
        {id:'lage', name:'Lage der Knoten', type:'zero', at:[Math.acos(1 / Math.sqrt(3)), Math.PI - Math.acos(1 / Math.sqrt(3))], tol:0.15, msg:'Bei welchen Winkeln ist $3\\cos^2\\theta - 1 = 0$?'}
      ],
      reveal:'Die Dichte über $\\theta$ enthält das Flächenelement $d\\Omega = \\sin\\theta\\,d\\theta\\,d\\varphi$: $p(\\theta) = 2\\pi|Y_2^0|^2\\sin\\theta = \\tfrac58(3\\cos^2\\theta - 1)^2\\sin\\theta$, mit Fläche 1. Der Faktor $\\sin\\theta$ macht $p$ an den Polen null, obwohl $|Y_2^0|^2$ dort am größten ist. Die beiden Knoten ($l - |m| = 2$) liegen bei $\\cos^2\\theta = \\tfrac13$, also $\\theta \\approx 55°$ und $125°$. Die drei Buckel, zwei nahe den Polen und einer am Äquator, sind etwa gleich hoch.',
      wrong:[
        {f:DREH_SK.Y20, fails:['pol'], why:'Flächenelement $\\sin\\theta$ vergessen: $|Y_2^0|^2$ statt $p(\\theta)$'},
        {f:DREH_SK.p('Y10'), fails:['knoten', 'lage'], why:'Knotenzahl falsch: ein Knoten am Äquator wie bei $l = 1$'}
      ], points:3}}
  ],
  errors:[
    {id:'dreh-e1', title:'Ein Vorzeichen im Leiterfaktor',
      text:'Gesucht ist $L_+|1,-1\\rangle = c\\,|1,0\\rangle$:',
      ctx:DREH_JM({unknowns:{c:{ref:'sqrt(2) ħ'}}}),
      lines:['L^2|1,-1⟩ = 2ħ^2 |1,-1⟩', 'L_+|1,-1⟩ = ħ sqrt(1·2 - (-1)(-2)) |1, 0⟩', 'L_+|1,-1⟩ = 0'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Im Faktor steht $m(m+1) = (-1)\\cdot 0$, nicht $m(m-1)$.', 'Unter der Wurzel muss $l^2 - m^2$ stehen.', 'Für $L_+$ muss man $m$ durch $m + 1$ ersetzen.'], a:0, ex:'$L_+$: $\\sqrt{l(l+1) - m(m+1)}$. Probe: Von $m = -l$ aus muss man aufsteigen können, also darf der Faktor dort nicht null sein.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $c$.', type:'solve', unknown:'c', model:['L_+|1,-1⟩ = ħ sqrt(1·2 - (-1)·0) |1, 0⟩', 'L_+|1,-1⟩ = c |1, 0⟩', 'c = sqrt(2) ħ']}},
    {id:'dreh-e2', title:'Kettenregel bei $\\hat L_z$',
      text:'Gesucht ist der Eigenwert $\\mu$ von $\\hat L_z$ zu $e^{2i\\varphi}$:',
      ctx:DREH_SPH({μ:{ref:'2ħ', kind:'real'}}),
      lines:['L̂_z e^(2iφ) = -iħ ∂/∂φ e^(2iφ)', '= -iħ · 2 e^(2iφ)', '= -2iħ e^(2iφ)'],
      wrong:1,
      why:{q:'Was ist in Zeile 2 falsch?', opts:['Die innere Ableitung von $2i\\varphi$ ist $2i$, nicht $2$.', 'Es muss nach $\\theta$ abgeleitet werden.', '$\\hat L_z$ enthält kein $i$.'], a:0, ex:'Mit dem fehlenden $i$ käme ein imaginärer Eigenwert heraus – unmöglich für einen hermiteschen Operator.'},
      fix:{id:'a', prompt:'Berichtige und bestimme $\\mu$.', type:'solve', unknown:'μ', model:['L̂_z e^(2iφ) = -iħ · 2i e^(2iφ)', '= 2ħ e^(2iφ)', 'L̂_z e^(2iφ) = μ e^(2iφ)', 'μ = 2ħ']}}
  ]
});
lexe('drehimpuls-algebra', 'Drehimpuls: Vertauschungsrelationen', '$[L_x, L_y] = i\\hbar L_z$, $[L_y, L_z] = i\\hbar L_x$, $[L_z, L_x] = i\\hbar L_y$, kurz $[L_i, L_j] = i\\hbar\\varepsilon_{ijk}L_k$. Außerdem $[L^2, L_i] = 0$, $[L_z, L_\\pm] = \\pm\\hbar L_\\pm$, $[L_+, L_-] = 2\\hbar L_z$. Klassisch $\\vec L = \\vec r\\times\\vec p$.', {topic:'dreh'});
lexe('drehimpuls-leiter', 'Drehimpuls: Leiteroperatoren', '$L_\\pm = L_x \\pm iL_y$, $L_\\pm^\\dagger = L_\\mp$. $L_\\pm|l,m\\rangle = \\hbar\\sqrt{l(l+1) - m(m\\pm1)}\\,|l,m\\pm1\\rangle$. Nützlich: $L_\\mp L_\\pm = L^2 - L_z^2 \\mp \\hbar L_z$ und $L_x = \\tfrac12(L_+ + L_-)$, $L_y = \\tfrac{1}{2i}(L_+ - L_-)$.', {topic:'dreh'});
lexe('drehimpuls-eigenwerte', 'Drehimpuls: Eigenwerte', '$L^2|l,m\\rangle = \\hbar^2l(l+1)|l,m\\rangle$, $L_z|l,m\\rangle = \\hbar m|l,m\\rangle$ mit $m = -l, -l+1, \\dots, l$. Bahndrehimpuls: $l = 0, 1, 2, \\dots$ (s, p, d, f). Allgemein (Spin) auch halbzahlig.', {topic:'dreh'});
lexe('kugelflaechenfunktionen', 'Kugelflächenfunktionen', '$Y_l^m(\\theta,\\varphi) = \\sqrt{\\frac{2l+1}{4\\pi}\\frac{(l-m)!}{(l+m)!}}P_l^m(\\cos\\theta)e^{im\\varphi}$ (mit Condon-Shortley-Phase in $P_l^m$). Beispiele: $Y_0^0 = \\frac{1}{\\sqrt{4\\pi}}$, $Y_1^0 = \\sqrt{\\frac{3}{4\\pi}}\\cos\\theta$, $Y_1^{\\pm1} = \\mp\\sqrt{\\frac{3}{8\\pi}}\\sin\\theta e^{\\pm i\\varphi}$, $Y_2^0 = \\sqrt{\\frac{5}{16\\pi}}(3\\cos^2\\theta - 1)$. Orthonormal bezüglich $\\sin\\theta\\,d\\theta\\,d\\varphi$. Im Tutorial: `Y_l^m(θ,φ)`, z. B. `Y_1^0(θ,φ)`.', {topic:'dreh'});
lexe('drehimpuls-kugel', 'Drehimpulsoperatoren in Kugelkoordinaten', '$\\hat L_z = -i\\hbar\\partial_\\varphi$, $\\hat L^2 = -\\hbar^2\\left[\\frac{1}{\\sin\\theta}\\partial_\\theta(\\sin\\theta\\,\\partial_\\theta) + \\frac{1}{\\sin^2\\theta}\\partial_\\varphi^2\\right]$, $\\hat L_\\pm = \\hbar e^{\\pm i\\varphi}\\left(\\pm\\partial_\\theta + i\\cot\\theta\\,\\partial_\\varphi\\right)$. Im Tutorial: `L̂_z`, `L̂^2`, `L̂_+`, `L̂_-`.', {topic:'dreh'});
lexe('dreh-gemeinsam', 'Gemeinsame Eigenzustände und Entartung', 'Vertauschen zwei Observable, $[\\hat A,\\hat B] = 0$, so gibt es eine gemeinsame Eigenbasis. Ist ein Eigenwert von $\\hat A$ entartet, ist aber nicht jeder Eigenzustand von $\\hat A$ auch einer von $\\hat B$. Beispiel: $Y_1^1 + Y_1^0$ ist Eigenfunktion von $\\hat L^2$ (Eigenwert $2\\hbar^2$), nicht von $\\hat L_z$. Ein Zustand, der Eigenzustand von zwei Drehimpulskomponenten ist, hat $l = 0$.', {topic:'dreh'});
lexe('dreh-vektormodell', 'Vektormodell des Drehimpulses', 'Merkbild: $\\vec L$ liegt auf einem Kegelmantel um die $z$-Achse mit Länge $\\hbar\\sqrt{l(l+1)}$ und Höhe $\\hbar m$; die Richtung auf dem Kegel ist unbestimmt. Es gilt $\\langle L_x\\rangle = \\langle L_y\\rangle = 0$ und $\\langle L_x^2\\rangle = \\langle L_y^2\\rangle = \\frac{\\hbar^2}{2}[l(l+1) - m^2]$. Auch bei $m = l$ zeigt $\\vec L$ nicht genau nach $z$. Das Bild beschreibt keine Bahn.', {topic:'dreh'});
lexe('dreh-zeeman', 'Zeeman-Effekt (normaler)', 'Mit dem Bahndrehimpuls ist ein magnetisches Moment $\\vec\\mu = -\\frac{e}{2m_e}\\vec L$ verbunden. In einem Feld $B$ entlang $z$ verschiebt sich die Energie um $m\\,\\mu_BB$ mit $\\mu_B = \\frac{e\\hbar}{2m_e} \\approx 5{,}8\\cdot10^{-5}\\,\\mathrm{eV/T}$. Ein Niveau mit Drehimpuls $l$ spaltet in $2l + 1$ Niveaus auf. Beim normalen Zeeman-Effekt (Gesamtspin null) entstehen drei Linien im Abstand $\\mu_BB$.', {topic:'dreh'});
