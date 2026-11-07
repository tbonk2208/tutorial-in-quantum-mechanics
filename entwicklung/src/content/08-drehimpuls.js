/* ===== Thema 8: Drehimpuls ===== */
(function(){
const R = String.raw;
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
      fb:['So erwartet man es, wenn man $\\vec L$ als Pfeil mit beliebiger Richtung denkt. Beobachtet wird aber keine Verbreiterung, sondern eine Aufspaltung in getrennte Linien.',
        'Richtig. $L_z$ kann nur die Werte $\\hbar m$ mit $m = -1, 0, 1$ annehmen. Das obere Niveau spaltet in drei auf, das untere ($l = 0$) nicht.',
        'Zwei Werte gäbe es bei einem Drehimpuls $\\tfrac12$, etwa beim Spin (Thema 10). Zu $l = 1$ gehören drei Werte von $m$.',
        'Doch: Mit dem Bahndrehimpuls ist ein magnetisches Moment $\\vec\\mu = -\\frac{e}{2m_e}\\vec L$ verbunden. Die Energie im Feld hängt von $L_z$ ab.']},
    reveal:'Beobachtet werden drei Linien mit dem Abstand $\\mu_BB$, wobei $\\mu_B = e\\hbar/(2m_e) \\approx 5{,}8\\cdot10^{-5}\\,\\mathrm{eV/T}$. Das ist der normale Zeeman-Effekt; man sieht ihn bei Atomen, deren Elektronenspins sich zu null addieren, etwa an der roten Cadmium-Linie. Dort geht das Atom von $l = 2$ nach $l = 1$ über. Auch dann entstehen genau drei Linien: Beide Niveaus spalten mit demselben Abstand $\\mu_BB$ auf, und erlaubt sind nur Übergänge mit $\\Delta m = 0, \\pm1$. Die Zahl der Linien ist also nicht die Zahl der Unterniveaus. In unserem Beispiel gehören die drei Linien zu $m = -1, 0, +1$ des oberen Niveaus.\n\n$L_z$ ist also quantisiert: Der Drehimpuls kann sich nicht beliebig zum Feld einstellen („Richtungsquantelung“). In diesem Thema leitest du her, warum $L_z$ nur die Werte $\\hbar m$ mit $m = -l, \\dots, l$ hat – und warum $\\vec L$ trotzdem nie genau in Feldrichtung zeigt.'
  },
  teach:[
    /* ===== Abschnitt 1: Operatoren und Vertauschungsrelationen ===== */
    {id:'dreh-t1', title:'Drehimpuls als Operator: die Vertauschungsrelationen', steps:[
      {id:'dreh-t1a', title:'Vom Kreuzprodukt zum Operator',
        pre:{from:'form', seg:'form-t2', title:'Operatoren auf Funktionen', text:R`In der Ortsdarstellung multipliziert $\hat x$ mit $x$, und $\hat p_x = -i\hbar\,\partial/\partial x$ leitet ab. In drei Dimensionen gibt es drei Impulse: $\hat p_y = -i\hbar\,\partial_y$ und $\hat p_z = -i\hbar\,\partial_z$. Mini-Beispiel: $\hat p_y\,(x + iy) = -i\hbar\cdot i = \hbar$.`},
        num:{title:R`$\hat L_z$ an der Funktion $x + iy$`, text:R`Klassisch ist $L_z = xp_y - yp_x$. Als Operator wird daraus $\hat L_z = -i\hbar\,(x\,\partial_y - y\,\partial_x)$. Angewandt auf $f = x + iy$:

$$\hat L_zf = -i\hbar\,(x\cdot i - y\cdot 1) = -i\hbar\cdot i\,(x + iy) = \hbar\,f.$$

Die Funktion kommt bis auf den Faktor $\hbar$ unverändert zurück. Sie ist Eigenfunktion von $\hat L_z$ zum Eigenwert $\hbar$.`},
        text:R`Klassisch ist der Drehimpuls $\vec L = \vec r\times\vec p$. In einem kugelsymmetrischen Potential, etwa dem Coulombpotential des Atomkerns, ist er erhalten. Deshalb wird er zur zentralen Größe für alle Atome (Thema 9). Quantenmechanisch ersetzt du Ort und Impuls durch Operatoren:

$$\hat L_x = \hat y\hat p_z - \hat z\hat p_y,\qquad \hat L_y = \hat z\hat p_x - \hat x\hat p_z,\qquad \hat L_z = \hat x\hat p_y - \hat y\hat p_x,$$

gelesen „L x Dach“ und so weiter. Eine Reihenfolge-Frage stellt sich nicht: In $\hat x\hat p_y$ stehen Ort und Impuls verschiedener Richtungen, und die vertauschen. Deshalb sind alle $\hat L_i$ [[lex:hermitescher-operator|hermitesch]], also Observable. Die drei Formeln gehen durch zyklisches Vertauschen $x\to y\to z\to x$ auseinander hervor.`,
        q:{q:R`Wie lautet $\hat L_x$ in der Ortsdarstellung?`,
          opts:[R`$-i\hbar\,(z\,\partial_y - y\,\partial_z)$`, R`$-i\hbar\,(y\,\partial_z - z\,\partial_y)$`, R`$-i\hbar\,(y\,\partial_y - z\,\partial_z)$`], a:1,
          ex:R`$L_x = yp_z - zp_y$ ist die $x$-Komponente des Kreuzprodukts. Mit $\hat p_j = -i\hbar\,\partial_j$ folgt $-i\hbar\,(y\,\partial_z - z\,\partial_y)$.`,
          fb:[R`Das ist $-\hat L_x$. Im Kreuzprodukt steht $yp_z$ mit Plus: zyklisch $x\to y\to z$.`, '',
            R`Hier trifft jeder Ort auf seinen eigenen Impuls. Im Kreuzprodukt stehen immer zwei *verschiedene* Richtungen.`]}},
      {id:'dreh-t1b', title:'Zwei Komponenten vertauschen nicht',
        pre:{from:'form', seg:'form-t6', title:'Der Kommutator', text:R`$[\hat A, \hat B] = \hat A\hat B - \hat B\hat A$ misst, ob die Reihenfolge zählt. Ein Kommutator ist wieder ein Operator; man prüft ihn an einer beliebigen Testfunktion. Grundbeispiel: $[\hat x, \hat p_x] = i\hbar$, aber $[\hat x, \hat p_y] = 0$.`},
        num:{title:R`Beide Reihenfolgen an $f = x$`, text:R`Erst $\hat L_y$, dann $\hat L_x$: $\hat L_yx = -i\hbar\,z$ und $\hat L_x(-i\hbar\,z) = -\hbar^2y$. Umgekehrt ist schon $\hat L_xx = 0$. Also

$$[\hat L_x, \hat L_y]\,x = -\hbar^2y - 0 = -\hbar^2y.$$

Zum Vergleich: $\hat L_zx = i\hbar\,y$, also $i\hbar\,\hat L_zx = -\hbar^2y$. Beide Seiten stimmen überein.`},
        text:R`Was an $f = x$ gilt, gilt an jeder Testfunktion $f(x, y, z)$. Rechnest du den [[lex:kommutator|Kommutator]] zweier Komponenten aus, bleiben nur die Terme übrig, in denen ein Ort auf seinen eigenen Impuls trifft. Die Herleitung zeigt das. Ergebnis sind die [[lex:drehimpuls-algebra|Vertauschungsrelationen]]

$$\begin{aligned}[\hat L_x,\hat L_y] &= i\hbar\hat L_z,\\ {[}\hat L_y,\hat L_z] &= i\hbar\hat L_x,\\ {[}\hat L_z,\hat L_x] &= i\hbar\hat L_y.\end{aligned}$$

Kurz: $[\hat L_i,\hat L_j] = i\hbar\,\varepsilon_{ijk}\hat L_k$. Das Symbol $\varepsilon_{ijk}$ ist $+1$ für zyklische Reihenfolge wie $x, y, z$, $-1$ für antizyklische wie $y, x, z$ und $0$, wenn zwei Indizes gleich sind. Summiert wird über $k$. Vertauschst du die beiden Argumente, kehrt sich das Vorzeichen um.`,
        derive:{ctx:DREH_XYZ(), lines:[
          {l:'L_z f(x,y,z) = -iħ (x ∂f/∂y - y ∂f/∂x)', w:R`Ortsdarstellung von $\hat L_z$`,
            why:{q:'Woher kommt diese Form?', opts:['$\\hat L_z = \\hat x\\hat p_y - \\hat y\\hat p_x$ mit $\\hat p_j = -i\\hbar\\,\\partial_j$', 'aus $\\hat L_z = -i\\hbar\\,\\partial_\\varphi$ in Kugelkoordinaten', 'aus $\\hat L_z = \\hat L_x\\hat L_y - \\hat L_y\\hat L_x$'], a:0, ex:'In Ortsdarstellung wird $\\hat p_y$ zu $-i\\hbar\\,\\partial/\\partial y$. $L_x$ und $L_y$ entstehen genauso durch zyklisches Vertauschen.'}},
          {l:'L_y f(x,y,z) = -iħ (z ∂f/∂x - x ∂f/∂z)', w:R`zuerst wirkt $\hat L_y$`},
          {l:'L_x L_y f(x,y,z) = -ħ^2 y ∂f/∂x - ħ^2 (y z ∂/∂z(∂f/∂x) - x y ∂^2f/∂z^2) + ħ^2 (z^2 ∂/∂y(∂f/∂x) - z x ∂/∂y(∂f/∂z))', w:R`erst $\hat L_y$, dann $\hat L_x$ angewandt, mit Produktregel`,
            why:{q:'Woher kommt der einzelne Term $y\\,\\partial f/\\partial x$ ohne zweite Ableitung?', opts:['$\\partial/\\partial z$ aus $\\hat L_x$ trifft das $z$ im Vorfaktor von $\\hat L_yf$.', 'Er stammt aus $\\hat L_z$, das in $\\hat L_x\\hat L_y$ steckt.', 'Aus $\\partial f/\\partial z$, weil $f$ nicht von $z$ abhängt.'], a:0, ex:'$\\hat L_yf = -i\\hbar(z\\,\\partial_xf - x\\,\\partial_zf)$. Dann gibt $y\\,\\partial_z$ aus $\\hat L_x$ nach der Produktregel $y\\,\\partial_xf + yz\\,\\partial_z\\partial_xf - \\dots$'}},
          {l:'L_y L_x f(x,y,z) = -ħ^2 x ∂f/∂y - ħ^2 (y z ∂/∂z(∂f/∂x) - x y ∂^2f/∂z^2) + ħ^2 (z^2 ∂/∂y(∂f/∂x) - z x ∂/∂y(∂f/∂z))', w:'umgekehrte Reihenfolge: dieselben zweiten Ableitungen'},
          {l:'[L_x, L_y] f(x,y,z) = L_x L_y f(x,y,z) - L_y L_x f(x,y,z)', w:'Definition des Kommutators'},
          {l:'= ħ^2 (x ∂f/∂y - y ∂f/∂x)', w:'die beiden Zeilen abgezogen',
            why:{q:'Was ist mit den zweiten Ableitungen von $f$ geschehen?', opts:['Sie heben sich weg, weil $\\partial_y\\partial_xf = \\partial_x\\partial_yf$ ist.', 'Sie sind null, weil $f$ beliebig ist.', 'Sie wurden vernachlässigt, weil sie klein sind.'], a:0, ex:'Gemischte Ableitungen vertauschen. Übrig bleiben die Terme, in denen eine Ableitung auf einen Vorfaktor $y$, $z$ oder $x$ trifft – also die Kommutatoren $[\\hat x_i,\\hat p_i] = i\\hbar$.'}},
          {l:'= iħ L_z f(x,y,z)', w:R`mit der ersten Zeile verglichen`,
            why:{q:'Warum ist das $i\\hbar\\hat L_zf$?', opts:['$i\\hbar\\cdot(-i\\hbar) = \\hbar^2$', '$i\\hbar\\cdot i\\hbar = \\hbar^2$', '$\\hbar^2 = \\hbar\\cdot\\hbar$ ohne $i$'], a:0, ex:'Mit der ersten Zeile ist $i\\hbar\\hat L_zf = i\\hbar\\cdot(-i\\hbar)(x\\partial_yf - y\\partial_xf) = \\hbar^2(x\\partial_yf - y\\partial_xf)$.'}}
        ]},
        q:{q:R`Was ist $[\hat L_z, \hat L_y]$?`,
          opts:[R`$i\hbar\hat L_x$`, R`$-i\hbar\hat L_x$`, R`$0$, weil $\hat L_y$ und $\hat L_z$ hermitesch sind`], a:1,
          ex:R`$[\hat L_z,\hat L_y] = -[\hat L_y,\hat L_z] = -i\hbar\hat L_x$. Die Reihenfolge $z, y$ ist antizyklisch.`,
          fb:[R`Das ist $[\hat L_y, \hat L_z]$. Vertauschte Argumente drehen das Vorzeichen um.`, '',
            R`Hermitesch sind alle Komponenten. Das sagt nichts darüber, ob zwei von ihnen vertauschen.`]}},
      {id:'dreh-t1c', title:'Die Vertauschungsrelation in vier Gestalten',
        pre:{from:'form', seg:'form-t6', title:'Robertson-Relation', text:R`Für zwei Observable gilt in jedem Zustand $\Delta A\,\Delta B \ge \tfrac12|\langle[\hat A, \hat B]\rangle|$. Dabei ist $\Delta A$ die Streuung der Messwerte an vielen gleich präparierten Systemen. Mini-Beispiel: $[\hat x, \hat p] = i\hbar$ gibt $\Delta x\,\Delta p \ge \hbar/2$.`},
        num:{title:R`Ein Zustand mit $\langle L_z\rangle = \hbar$`, text:R`Nach Robertson ist $\Delta L_x\,\Delta L_y \ge \tfrac12|\langle i\hbar\hat L_z\rangle| = \tfrac{\hbar^2}{2}$. Wäre $\Delta L_x = 0{,}1\,\hbar$, müsste

$$\Delta L_y \ge \frac{\hbar^2/2}{0{,}1\,\hbar} = 5\,\hbar$$

sein. Je schärfer $L_x$, desto unschärfer $L_y$.`},
        text:R`Die Vertauschungsrelation hat Folgen für Messungen. Setzt du sie in die [[lex:robertson|Robertson-Relation]] ein, folgt

$$\Delta L_x\,\Delta L_y \ge \frac\hbar2\,|\langle L_z\rangle|.$$

Ist $\langle L_z\rangle \ne 0$, können $L_x$ und $L_y$ nicht beide scharf sein. Der Drehimpuls hat dann keine scharfe Richtung. Klassisch ist $\vec L$ dagegen ein Pfeil mit drei festen Komponenten. Die Tafel zeigt dieselbe Aussage in vier Gestalten: als Satz, als Rechnung an Funktionen, als Formel für Operatoren und als Aussage über Messungen.`,
        reps:{obj:R`Die Vertauschungsrelation $[\hat L_x, \hat L_y] = i\hbar\hat L_z$`,
          rows:[
            {k:'worte', text:R`Ob du erst $\hat L_y$ und dann $\hat L_x$ anwendest oder umgekehrt, macht einen Unterschied. Der Unterschied ist die dritte Komponente, mal $i\hbar$.`},
            {k:'ort', tex:R`\hat L_x\big(\hat L_yf\big) - \hat L_y\big(\hat L_xf\big) = \hbar^2\,(x\,\partial_yf - y\,\partial_xf)\quad\text{für jedes } f(x, y, z)`},
            {k:'formel', tex:R`\hat L_x\hat L_y - \hat L_y\hat L_x = i\hbar\,\hat L_z`},
            {k:'physik', text:R`$\Delta L_x\,\Delta L_y \ge \tfrac\hbar2|\langle L_z\rangle|$: Mit $\langle L_z\rangle \ne 0$ sind $L_x$ und $L_y$ nie zugleich scharf.`}
          ],
          links:[
            {from:'worte', to:'ort', rule:R`Die Reihenfolge an einer Testfunktion prüfen: einmal $\hat L_x(\hat L_yf)$, einmal $\hat L_y(\hat L_xf)$ ausrechnen, dann abziehen. Der zuerst wirkende Operator steht rechts.`},
            {from:'ort', to:'formel', rule:R`Das Ergebnis $\hbar^2(x\partial_y - y\partial_x)f$ als $i\hbar\,\hat L_zf$ erkennen, denn $\hat L_z = -i\hbar(x\partial_y - y\partial_x)$. Weil $f$ beliebig ist, gilt die Gleichung für die Operatoren.`},
            {from:'formel', to:'physik', rule:R`Den Kommutator in die Robertson-Relation einsetzen: $\tfrac12|\langle i\hbar\hat L_z\rangle| = \tfrac\hbar2|\langle L_z\rangle|$.`}
          ]},
        q:{q:R`In einem Zustand ist $\langle L_x\rangle = 2\hbar$. Was folgt aus $[\hat L_y, \hat L_z] = i\hbar\hat L_x$?`, tr:{from:'formel', to:'physik'},
          opts:[R`$\Delta L_y\,\Delta L_z \ge \hbar^2$`, R`$\Delta L_y\,\Delta L_z \ge 2\hbar^2$`, R`$L_y = L_z = 0$, weil $\vec L$ in $x$-Richtung zeigt`], a:0,
          ex:R`Robertson: $\Delta L_y\,\Delta L_z \ge \tfrac12|\langle i\hbar\hat L_x\rangle| = \tfrac\hbar2\cdot 2\hbar = \hbar^2$.`,
          fb:['', R`Der Faktor $\tfrac12$ aus der Robertson-Relation fehlt: $\tfrac12\cdot\hbar\cdot 2\hbar = \hbar^2$.`,
            R`Dann wären $L_y$ und $L_z$ scharf, mit $\Delta = 0$. Genau das verbietet die Ungleichung.`]}},
      {id:'dreh-t1d', title:'Das Betragsquadrat vertauscht mit jeder Komponente',
        num:{title:R`Eine Drehung um die $z$-Achse`, text:R`Klassisch: Ein Drehimpuls $\vec L = (3, 0, 4)$ in Einheiten von $\hbar$ wird durch eine Drehung um $90°$ um die $z$-Achse zu $(0, 3, 4)$. $L_x$ und $L_y$ ändern sich, aber

$$L_z = 4,\qquad L^2 = 3^2 + 0^2 + 4^2 = 0^2 + 3^2 + 4^2 = 25$$

bleiben gleich. Betrag und $z$-Komponente vertragen sich mit der Drehung um $z$.`},
        text:R`Quantenmechanisch zeigt sich das als Kommutator. Das Betragsquadrat $\hat L^2 = \hat L_x^2 + \hat L_y^2 + \hat L_z^2$, gelesen „L Quadrat“, vertauscht mit jeder Komponente:

$$[\hat L^2,\hat L_z] = 0\quad\text{und ebenso für } \hat L_x, \hat L_y.$$

Die Herleitung benutzt die Produktregel $[\hat A^2,\hat B] = \hat A[\hat A,\hat B] + [\hat A,\hat B]\hat A$. Die Terme aus $\hat L_x^2$ und $\hat L_y^2$ heben sich genau weg. Deshalb kannst du $\hat L^2$ und **eine** Komponente zugleich scharf machen. Üblich ist $\hat L_z$. Die $z$-Achse ist dabei nicht ausgezeichnet; sie ist eine Wahl, etwa die Richtung eines Magnetfelds.`,
        derive:{ctx:DREH_JM(), lines:[
          {l:'[L_x^2, L_z] = L_x [L_x, L_z] + [L_x, L_z] L_x', w:'Produktregel für Kommutatoren'},
          {l:'= -iħ (L_x L_y + L_y L_x)', w:R`$[\hat L_x, \hat L_z] = -i\hbar\hat L_y$ eingesetzt`,
            why:{q:'Warum steht hier $-i\\hbar$?', opts:['Weil $[\\hat L_x, \\hat L_z] = -[\\hat L_z, \\hat L_x] = -i\\hbar\\hat L_y$ ist.', 'Weil $\\hat L_x^2$ negative Eigenwerte haben kann.', 'Weil $\\hat L_y$ antihermitesch ist, $\\hat L_y^\\dagger = -\\hat L_y$.'], a:0, ex:'Die Reihenfolge $x, z$ ist antizyklisch; das Vorzeichen kehrt sich um.'}},
          {l:'[L_y^2, L_z] = iħ (L_y L_x + L_x L_y)', w:R`ebenso mit $[\hat L_y, \hat L_z] = i\hbar\hat L_x$`,
            why:{q:'Was fällt beim Vergleich mit der Zeile davor auf?', opts:['Dieselben Mischterme mit entgegengesetztem Vorzeichen', 'Dieselben Mischterme mit gleichem Vorzeichen', 'Hier fehlen die Mischterme ganz.'], a:0, ex:'$L_xL_y + L_yL_x$ kommt einmal mit $-i\\hbar$, einmal mit $+i\\hbar$ vor. In der Summe heben sie sich weg.'}},
          {l:'[L_z^2, L_z] = 0', w:'jeder Operator vertauscht mit sich selbst'},
          {l:'[L^2, L_z] = 0', w:'die drei Zeilen addiert',
            why:{q:'Was folgt aus dieser Zeile?', opts:['$\\hat L^2$ und $\\hat L_z$ haben eine gemeinsame Eigenbasis.', 'Jeder Eigenzustand von $\\hat L_z$ hat $L^2 = 0$.', '$\\hat L^2$ ist ein Vielfaches von $\\hat L_z$.'], a:0, ex:'Vertauschende Observable haben eine gemeinsame Eigenbasis (Thema 6). In ihr sind $L^2$ und $L_z$ zugleich scharf.'}}
        ]},
        q:{q:R`Warum können $L^2$ und $L_z$ zugleich scharf sein, $L_x$ und $L_z$ im Allgemeinen nicht?`,
          opts:[R`$\hat L_z$ ist die wichtigste Komponente.`, R`$[\hat L^2,\hat L_z] = 0$, aber $[\hat L_z,\hat L_x] \ne 0$`, R`$\hat L^2$ ist keine eigene Observable.`], a:1,
          ex:R`Vertauschende Observable haben eine gemeinsame Eigenbasis (Thema 6). $[\hat L_z,\hat L_x] = i\hbar\hat L_y$ verhindert das für $L_z$ und $L_x$.`,
          fb:[R`Keine Richtung ist ausgezeichnet. Mit $\hat L_x$ statt $\hat L_z$ ginge alles genauso.`, '',
            R`$\hat L^2$ ist hermitesch und messbar. Entscheidend ist, mit wem es vertauscht.`]}},
      {id:'dreh-t1e', title:'Typischer Fehler: drei scharfe Komponenten',
        num:{title:'Zwei Testfunktionen', text:R`Die Konstante $f = 1$ ergibt bei allen drei Komponenten null: $\hat L_x1 = \hat L_y1 = \hat L_z1 = 0$. Sie ist Eigenfunktion aller drei. Anders $f = z$: Es ist $\hat L_zz = 0$, aber

$$\hat L_xz = -i\hbar\,y,$$

kein Vielfaches von $z$. Obwohl $L_z = 0$ scharf ist, ist $L_x$ nicht scharf.`},
        text:R`Ein verbreiteter Fehler ist, den Drehimpuls als klassischen Pfeil mit drei gleichzeitig festen Komponenten zu denken. Angenommen, $\psi$ wäre Eigenfunktion von $\hat L_z$ **und** von $\hat L_x$. Dann wäre $[\hat L_z,\hat L_x]\psi = 0$, also $i\hbar\hat L_y\psi = 0$. Mit demselben Schluss für die anderen Paare ergeben alle drei Komponenten auf $\psi$ null, und damit auch $\hat L^2\psi = 0$. Zwei Komponenten zugleich scharf geht also nur ohne Drehimpuls, wie bei $f = 1$. Schon bei $f = z$ mit scharfem $L_z = 0$ ist $L_x$ unscharf.`,
        q:{q:R`Ein Zustand ist Eigenzustand von $\hat L_x$ und von $\hat L_y$. Was folgt?`,
          opts:[R`Er hat $L_z = 0$, aber $L^2$ kann beliebig sein.`, R`Das ist unmöglich, solche Zustände gibt es gar nicht.`, R`Alle Komponenten ergeben null, auch $L^2$.`], a:2,
          ex:R`Aus $[\hat L_x, \hat L_y]\psi = 0$ folgt $\hat L_z\psi = 0$, und weiter auch $\hat L_x\psi = \hat L_y\psi = 0$. Nur der Zustand ohne Drehimpuls erfüllt das.`,
          fb:[R`Mit $\hat L_z\psi = 0$ ist der Schluss nicht zu Ende. Dieselbe Überlegung für die anderen Paare macht auch $L_x$ und $L_y$ zu null.`,
            R`Es gibt einen solchen Zustand: den ohne Drehimpuls, etwa die Konstante $f = 1$.`, '']}}
    ]},

    /* ===== Abschnitt 2: gemeinsame Eigenzustände, Entartung ===== */
    {id:'dreh-t2', title:'Gemeinsame Eigenzustände und Entartung', steps:[
      {id:'dreh-t2a', title:R`Eine gemeinsame Eigenbasis von $\hat L^2$ und $\hat L_z$`,
        pre:{from:'form', seg:'form-t6', title:'Verträgliche Observable', text:R`Gilt $[\hat A, \hat B] = 0$, haben $\hat A$ und $\hat B$ eine gemeinsame Eigenbasis. In jedem ihrer Vektoren sind beide Größen zugleich scharf. Mini-Beispiel: Zwei Diagonalmatrizen vertauschen, und jeder Basisvektor ist Eigenvektor von beiden.`},
        num:{title:R`Die Funktion $x + iy$`, text:R`Aus Abschnitt 1 weißt du: $\hat L_z(x + iy) = \hbar\,(x + iy)$. Rechnest du alle drei Quadrate aus, folgt außerdem

$$\hat L^2(x + iy) = (\hat L_x^2 + \hat L_y^2 + \hat L_z^2)(x + iy) = 2\hbar^2\,(x + iy).$$

Dieselbe Funktion ist Eigenfunktion beider Operatoren, mit $\lambda = 2\hbar^2$ für $\hat L^2$ und $\mu = \hbar$ für $\hat L_z$.`},
        text:R`Weil $\hat L^2$ und $\hat L_z$ vertauschen, gibt es eine gemeinsame Eigenbasis. Ihre Elemente schreiben wir vorläufig als $|\lambda,\mu\rangle$, gelesen „Ket lambda, mu“:

$$\hat L^2|\lambda,\mu\rangle = \lambda|\lambda,\mu\rangle,\qquad \hat L_z|\lambda,\mu\rangle = \mu|\lambda,\mu\rangle.$$

Der erste Eintrag ist der Eigenwert von $\hat L^2$, der zweite der von $\hat L_z$. Welche Werte möglich sind, ist noch offen. Das klärt Abschnitt 3, ohne jede Koordinate. In einem solchen Zustand liefert eine Messung von $L^2$ sicher $\lambda$ und eine von $L_z$ sicher $\mu$, in beliebiger Reihenfolge.`,
        q:{q:R`Welcher Ket beschreibt die Funktion $x + iy$ aus dem Beispiel?`, tr:{from:'ort', to:'dirac'},
          opts:[R`$|\hbar,\ 2\hbar^2\rangle$`, R`$|2\hbar^2,\ \hbar\rangle$`, R`$|2\hbar,\ \hbar\rangle$`], a:1,
          ex:R`Erst der Eigenwert von $\hat L^2$, dann der von $\hat L_z$: $\lambda = 2\hbar^2$, $\mu = \hbar$.`,
          fb:[R`Die Reihenfolge ist vertauscht. Zuerst steht der Eigenwert von $\hat L^2$.`, '',
            R`$\lambda$ ist ein Eigenwert von $\hat L^2$ und hat die Einheit $\hbar^2$, nicht $\hbar$.`]}},
      {id:'dreh-t2b', title:R`Entartung: mehrere $\mu$ zu einem $\lambda$`,
        num:{title:R`$x + iy$ und $z$`, text:R`Auch $z$ ist Eigenfunktion: $\hat L_zz = 0$ und $\hat L^2z = 2\hbar^2z$. Beide Funktionen haben also dasselbe $\lambda = 2\hbar^2$, aber verschiedene $\mu$:

$$x + iy:\ \mu = \hbar,\qquad z:\ \mu = 0.$$

Ihre Summe $x + iy + z$ ist wieder Eigenfunktion von $\hat L^2$ zum Eigenwert $2\hbar^2$.`},
        text:R`Beim Drehimpuls ist $\hat L^2$ entartet ([[lex:dreh-gemeinsam|gemeinsame Eigenzustände]]): Zu einem Wert $\lambda$ gehören mehrere Zustände mit verschiedenem $\mu$. Wie viele, zeigt Abschnitt 3. Jede Überlagerung von ihnen ist wieder Eigenzustand von $\hat L^2$:

$$\hat L^2\left(\alpha|\lambda,\mu_1\rangle + \beta|\lambda,\mu_2\rangle\right) = \lambda\left(\alpha|\lambda,\mu_1\rangle + \beta|\lambda,\mu_2\rangle\right).$$

Für $\hat L_z$ gilt das nicht, wenn $\mu_1 \ne \mu_2$ ist: $\hat L_z$ multipliziert die beiden Anteile mit verschiedenen Zahlen. Die Herleitung prüft beides an der Summe $x + iy + z$.`,
        derive:{ctx:DREH_XYZ(), lines:[
          {l:'L_x L_x z + L_y L_y z + L_z L_z z = 2ħ^2 z', w:R`$\hat L^2$ auf $z$ angewandt`,
            why:{q:'Was zeigt diese Zeile?', opts:['$z$ gehört wie $x + iy$ zu $\\lambda = 2\\hbar^2$.', '$z$ hat den Drehimpuls null, also $\\lambda = 0$.', '$z$ ist auch Eigenfunktion von $\\hat L_x$.'], a:0, ex:'Derselbe Eigenwert wie bei $x + iy$. Den Drehimpuls null hat nur die Konstante.'}},
          {l:'L_x L_x (x + i y + z) + L_y L_y (x + i y + z) + L_z L_z (x + i y + z) = 2ħ^2 (x + i y + z)', w:R`$\hat L^2$ auf die Summe angewandt`},
          {l:'L_z (x + i y + z) = ħ (x + i y)', w:R`$\hat L_z$ auf die Summe angewandt`,
            why:{q:'Ist das ein Vielfaches von $x + iy + z$?', opts:['Nein, der Anteil $z$ fehlt.', 'Ja, mit dem Eigenwert $\\hbar$.', 'Ja, mit dem Eigenwert $\\tfrac12\\hbar$.'], a:0, ex:'$\\hat L_z$ multipliziert $x + iy$ mit $\\hbar$ und $z$ mit $0$. Kein gemeinsamer Faktor, also kein Eigenzustand.'}}
        ]},
        q:{q:R`Ist $\tfrac{1}{\sqrt2}\left(|\lambda,\hbar\rangle + |\lambda,-\hbar\rangle\right)$ Eigenzustand von $\hat L^2$, von $\hat L_z$?`,
          opts:['von $\\hat L^2$ und von $\\hat L_z$', 'nur von $\\hat L^2$', 'nur von $\\hat L_z$', 'von keinem der beiden'], a:1,
          ex:R`Beide Anteile haben dasselbe $\lambda$, aber verschiedene $\mu$. $\hat L_z$ gibt $\tfrac{\hbar}{\sqrt2}\left(|\lambda,\hbar\rangle - |\lambda,-\hbar\rangle\right)$, kein Vielfaches des Zustands.`,
          fb:['$\\hat L_z$ multipliziert die Anteile mit $+\\hbar$ und $-\\hbar$. Das ist kein gemeinsamer Faktor.', '', 'Umgekehrt: Für $\\hat L_z$ haben die Anteile verschiedene Eigenwerte $\\pm\\hbar$, für $\\hat L^2$ denselben Eigenwert $\\lambda$.', 'Für $\\hat L^2$ haben beide Anteile denselben Eigenwert $\\lambda$. Die Summe ist deshalb Eigenzustand.']}},
      {id:'dreh-t2c', title:'Messen in einer Überlagerung',
        pre:{from:'form', seg:'form-t3', title:'Born-Regel', text:R`Ist $|\psi\rangle = \sum_n c_n|a_n\rangle$ nach der Eigenbasis von $\hat A$ entwickelt, liefert eine Messung den Wert $a_n$ mit der Wahrscheinlichkeit $|c_n|^2$. Danach ist das System in $|a_n\rangle$. Mini-Beispiel: $c_1 = \tfrac35$ gibt $P(a_1) = \tfrac{9}{25}$.`},
        num:{title:'Gleiche Gewichte', text:R`Im normierten Zustand $\tfrac{1}{\sqrt2}\left(|\lambda,\hbar\rangle + |\lambda,0\rangle\right)$ mit $\lambda = 2\hbar^2$ ergibt eine Messung von $L_z$

$$\hbar\ \text{mit}\ P = \left|\tfrac{1}{\sqrt2}\right|^2 = \tfrac12,\qquad 0\ \text{mit}\ P = \tfrac12.$$

$L^2$ liefert dagegen sicher $2\hbar^2$, vor und nach der $L_z$-Messung.`},
        text:R`In einer Überlagerung $\alpha|\lambda,\mu_1\rangle + \beta|\lambda,\mu_2\rangle$ ist $L^2$ scharf, $L_z$ aber nicht. Nach dem [[lex:messpostulat|Messpostulat]] misst du $\mu_1$ mit der Wahrscheinlichkeit $|\alpha|^2$ und $\mu_2$ mit $|\beta|^2$. Danach ist das System im zugehörigen Eigenzustand, und $L^2$ hat immer noch den Wert $\lambda$. Der Mittelwert $\langle L_z\rangle = |\alpha|^2\mu_1 + |\beta|^2\mu_2$ ist kein möglicher Einzelwert, solange beide Gewichte von null verschieden sind. **Ausblick:** Im Wasserstoffatom (Thema 9) kommt der Hamilton-Operator als dritter vertauschender Operator dazu.`,
        q:{q:R`Man misst $L_z$ im Zustand $\tfrac{1}{\sqrt3}|\lambda,\hbar\rangle + \sqrt{\tfrac23}\,|\lambda,-\hbar\rangle$. Was ist möglich?`,
          opts:[R`$\hbar$ mit $\tfrac13$, $-\hbar$ mit $\tfrac23$`, R`immer der Mittelwert $-\tfrac13\hbar$`, R`$\hbar$ mit $\tfrac{1}{\sqrt3}$, $-\hbar$ mit $\sqrt{\tfrac23}$`], a:0,
          ex:R`Wahrscheinlichkeiten sind Betragsquadrate der Koeffizienten: $\tfrac13$ und $\tfrac23$. Der Mittelwert $\tfrac13\hbar - \tfrac23\hbar = -\tfrac13\hbar$ ist kein Einzelergebnis.`,
          fb:['', R`$-\tfrac13\hbar$ ist der Mittelwert vieler Messungen, kein Eigenwert von $\hat L_z$.`,
            R`Das sind Amplituden. Die Wahrscheinlichkeiten sind ihre Betragsquadrate; $\tfrac{1}{\sqrt3} + \sqrt{\tfrac23} > 1$.`]}},
      {id:'dreh-t2d', title:'Typischer Fehler: vertauschbar heißt nicht „jeder Eigenzustand gemeinsam“',
        num:{title:'Die Summe aus dem Beispiel', text:R`$[\hat L^2, \hat L_z] = 0$, und $x + iy + z$ ist Eigenfunktion von $\hat L^2$. Trotzdem ist

$$\hat L_z(x + iy + z) = \hbar\,(x + iy) \ne \mu\,(x + iy + z)$$

für jede Zahl $\mu$. Eine Eigenfunktion von $\hat L^2$ muss keine von $\hat L_z$ sein.`},
        text:R`Gut belegt ist die Fehlvorstellung: „Wenn $[\hat A,\hat B] = 0$ ist, dann ist jeder Eigenzustand von $\hat A$ auch einer von $\hat B$.“ Das stimmt nur, wenn die Eigenwerte von $\hat A$ nicht entartet sind. Der Satz aus Thema 6 sagt: Es **gibt** eine gemeinsame Eigenbasis. Er sagt nicht, dass jede Eigenbasis von $\hat A$ eine solche ist. Beim Drehimpuls ist $\hat L^2$ entartet. Du musst die gemeinsamen Eigenzustände also gezielt wählen. Üblich sind die Eigenzustände von $\hat L_z$ innerhalb jedes Eigenraums von $\hat L^2$.`,
        q:{q:R`Es gilt $[\hat L^2, \hat L_z] = 0$. Welche Aussage ist richtig?`,
          opts:[R`Jeder Eigenzustand von $\hat L^2$ ist auch einer von $\hat L_z$.`, R`Jeder Eigenzustand von $\hat L_z$ ist auch einer von $\hat L^2$.`, R`Es gibt eine Basis aus gemeinsamen Eigenzuständen.`], a:2,
          ex:R`Das garantiert der Satz über verträgliche Observable. Weil beide Operatoren entartet sind, gelten die beiden „jeder“-Aussagen nicht.`,
          fb:[R`Gegenbeispiel: $x + iy + z$ ist Eigenfunktion von $\hat L^2$, aber nicht von $\hat L_z$.`,
            R`Auch $\hat L_z$ ist entartet. $1$ und $z$ haben beide $\mu = 0$, aber verschiedene $\lambda$; ihre Summe $1 + z$ ist kein Eigenzustand von $\hat L^2$.`, '']}}
    ]},

    /* ===== Abschnitt 3: Leiteroperatoren, Spektrum ===== */
    {id:'dreh-t3', title:'Eigenwerte mit Leiteroperatoren', steps:[
      {id:'dreh-t3a', title:R`Die Leiteroperatoren $\hat L_\pm$`,
        pre:{from:'osz', seg:'osz-t3', title:'Die Leiter beim Oszillator', text:R`Beim Oszillator gilt $[\hat H, \hat a^\dagger] = \hbar\omega\,\hat a^\dagger$. Daraus folgt: Ist $\psi$ Eigenzustand zur Energie $E$, dann ist $\hat a^\dagger\psi$ Eigenzustand zu $E + \hbar\omega$ oder null. Ein Kommutator der Form $[\hat H, \hat B] = c\,\hat B$ macht $\hat B$ zum Leiteroperator.`},
        num:{title:R`$\hat L_+$ an $z$ und an $x + iy$`, text:R`Mit $\hat L_+ = \hat L_x + i\hat L_y$ und den Ableitungen aus Abschnitt 1:

$$\hat L_+z = -i\hbar\,y + i\cdot i\hbar\,x = -\hbar\,(x + iy),\qquad \hat L_+(x + iy) = 0.$$

Aus $z$ mit $\mu = 0$ wird $x + iy$ mit $\mu = \hbar$. Danach geht es nicht weiter.`},
        text:R`Wie beim Oszillator (Thema 7) baust du [[lex:drehimpuls-leiter|Leiteroperatoren]]:

$$\hat L_\pm = \hat L_x \pm i\hat L_y,\qquad \hat L_\pm^\dagger = \hat L_\mp,$$

gelesen „L plus“ und „L minus“. Sie sind nicht hermitesch, also keine Observable. Aus den Vertauschungsrelationen folgen

$$[\hat L_z,\hat L_\pm] = \pm\hbar\hat L_\pm,\qquad [\hat L^2,\hat L_\pm] = 0.$$

Das vorgerechnete Beispiel des Themas zeigt die erste Relation Zeile für Zeile. Die zweite folgt sofort, weil $\hat L^2$ mit $\hat L_x$ und mit $\hat L_y$ vertauscht.`,
        q:{q:R`Welche Kombination der Leiteroperatoren ist hermitesch, also eine Observable?`,
          opts:['$\\hat L_+$ allein, weil es aus hermiteschen $\\hat L_x$, $\\hat L_y$ besteht', '$\\hat L_+ + \\hat L_-$, weil es gleich $2\\hat L_x$ ist', '$\\hat L_+ - \\hat L_-$, weil es $\\hat L_y$ enthält'], a:1,
          ex:R`$(\hat L_+ + \hat L_-)^\dagger = \hat L_- + \hat L_+$. Das ist $2\hat L_x$. Dagegen ist $\hat L_+ - \hat L_- = 2i\hat L_y$ antihermitesch.`,
          fb:[R`$\hat L_+^\dagger = \hat L_- \ne \hat L_+$: Der Faktor $i$ vor $\hat L_y$ wird beim Adjungieren konjugiert.`, '',
            R`Adjungiert gibt das $\hat L_- - \hat L_+$, also das Negative: antihermitesch. Erst mit dem Faktor $\tfrac{1}{2i}$ wird daraus $\hat L_y$.`]}},
      {id:'dreh-t3b', title:R`$\hat L_+$ hebt $\mu$ um $\hbar$`,
        num:{title:'Die Probe am Beispiel', text:R`$z$ hat $\mu = 0$, und $\hat L_+z = -\hbar(x + iy)$ hat $\mu = \hbar$: genau eine Stufe höher. $\lambda$ bleibt $2\hbar^2$. Mit dem Kommutator:

$$\hat L_z\big(\hat L_+z\big) = \hat L_+\big(\hat L_zz\big) + \hbar\,\hat L_+z = 0 + \hbar\,\hat L_+z.$$`},
        text:R`Was am Beispiel gilt, gilt für jeden Eigenzustand $|\lambda,\mu\rangle$. Schreib $\hat L_z\hat L_+ = \hat L_+\hat L_z + \hbar\hat L_+$ und wende beide Seiten auf $|\lambda,\mu\rangle$ an:

$$\hat L_z\left(\hat L_+|\lambda,\mu\rangle\right) = (\mu + \hbar)\,\hat L_+|\lambda,\mu\rangle,\qquad \hat L^2\left(\hat L_+|\lambda,\mu\rangle\right) = \lambda\,\hat L_+|\lambda,\mu\rangle.$$

$\hat L_+|\lambda,\mu\rangle$ ist also Eigenzustand zu $\mu + \hbar$ – oder der Nullvektor. $\hat L_-$ senkt $\mu$ ebenso um $\hbar$. Der Betrag $\lambda$ bleibt gleich, nur die $z$-Komponente ändert sich. Von einem Zustand aus erreichst du so eine ganze Leiter von Werten im Abstand $\hbar$.`,
        q:{q:R`$|\lambda,\mu\rangle$ ist Eigenzustand. Zu welchem Eigenwert von $\hat L_z$ gehört $\hat L_-^2|\lambda,\mu\rangle$, falls es nicht null ist?`,
          opts:[R`$\mu - 2\hbar$`, R`$\mu - \hbar^2$`, R`$\mu$, aber mit $\lambda - 2\hbar^2$`], a:0,
          ex:R`Jedes $\hat L_-$ senkt $\mu$ um $\hbar$; zweimal angewandt um $2\hbar$. $\lambda$ bleibt.`,
          fb:['', R`Die Stufen addieren sich: zweimal $-\hbar$, nicht $\hbar$ zum Quadrat.`,
            R`$\hat L_-$ vertauscht mit $\hat L^2$. Es ändert $\mu$, nicht $\lambda$.`]}},
      {id:'dreh-t3c', title:'Die Leiter ist beschränkt',
        num:{title:R`$\lambda = 6\hbar^2$`, text:R`Ist $\lambda = 6\hbar^2$, so muss $\mu^2 \le 6\hbar^2$ sein, also

$$|\mu| \le \sqrt6\,\hbar \approx 2{,}45\,\hbar.$$

Mit Stufen der Höhe $\hbar$ kommst du nicht beliebig hoch. Spätestens nach wenigen Sprossen muss $\hat L_+$ null ergeben.`},
        text:R`Warum endet die Leiter? Für jeden Zustand ist $\langle L_x^2\rangle = \|\hat L_x\psi\|^2 \ge 0$, ebenso für $L_y$. Wegen $\hat L^2 - \hat L_z^2 = \hat L_x^2 + \hat L_y^2$ gilt in jedem Eigenzustand $|\lambda,\mu\rangle$

$$\lambda - \mu^2 = \langle L_x^2\rangle + \langle L_y^2\rangle \ge 0,\qquad\text{also}\qquad \mu^2 \le \lambda.$$

Die $z$-Komponente kann den Betrag nicht übersteigen. Weil $\hat L_+$ den Wert $\lambda$ nicht ändert, $\mu$ aber erhöht, muss es eine oberste Sprosse $|\lambda,\mu_{\max}\rangle$ geben mit $\hat L_+|\lambda,\mu_{\max}\rangle = 0$. Ebenso gibt es eine unterste mit $\hat L_-|\lambda,\mu_{\min}\rangle = 0$.`,
        q:{q:'Gibt es einen Eigenzustand mit $\\lambda = 12\\hbar^2$ und $\\mu = 4\\hbar$?',
          opts:['Ja, denn $\\mu$ darf jedes ganze Vielfache von $\\hbar$ sein.', 'Nein, denn $\\mu^2 = 16\\hbar^2 > \\lambda$.', 'Ja, denn als oberste Sprosse gilt $\\hat L_+|\\lambda,\\mu\\rangle = 0$.'], a:1,
          ex:'$\\langle L_x^2\\rangle + \\langle L_y^2\\rangle = \\lambda - \\mu^2$ wäre $-4\\hbar^2 < 0$. Das ist unmöglich.',
          fb:['$\\mu$ ändert sich zwar in Stufen $\\hbar$, ist aber durch $\\mu^2 \\le \\lambda$ begrenzt.', '', 'Auch die oberste Sprosse erfüllt $\\mu^2 \\le \\lambda$. Mit $4\\hbar$ wäre $\\langle L_x^2 + L_y^2\\rangle$ negativ.']}},
      {id:'dreh-t3d', title:R`Die oberste Sprosse legt $\lambda$ fest`,
        num:{title:R`Das Beispiel $x + iy$`, text:R`$x + iy$ ist eine oberste Sprosse, denn $\hat L_+(x + iy) = 0$, mit $\mu_{\max} = \hbar$. Schreibst du $\mu_{\max} = \hbar l$, ist hier $l = 1$, und

$$\lambda = \hbar^2l(l + 1) = \hbar^2\cdot1\cdot2 = 2\hbar^2.$$

Das ist genau der Wert, den $\hat L^2$ an $x + iy$ ergeben hat.`},
        text:R`Allgemein schreibst du $\mu_{\max} = \hbar l$. Den Rest erledigt die Identität $\hat L_-\hat L_+ = \hat L^2 - \hat L_z^2 - \hbar\hat L_z$. Wende sie auf die oberste Sprosse an, in der Herleitung kurz $|l,l\rangle$ genannt: Links steht null, rechts $\lambda - \hbar^2l^2 - \hbar^2l$. Also gilt

$$\lambda = \hbar^2\,l(l+1).$$

An der untersten Sprosse folgt mit $\hat L_+\hat L_- = \hat L^2 - \hat L_z^2 + \hbar\hat L_z$ ebenso $\lambda = \mu_{\min}(\mu_{\min} - \hbar)$, also $\mu_{\min} = -\hbar l$. Die zweite Lösung $\mu_{\min} = \hbar(l + 1)$ läge über $\mu_{\max}$. Die Leiter ist symmetrisch um null.`,
        derive:{ctx:DREH_JM(), lines:[
          {l:'L_- L_+ = L^2 - L_z^2 - ħ L_z', w:R`$\hat L_x^2 + \hat L_y^2 + i[\hat L_x,\hat L_y]$ ausgerechnet`,
            why:{q:'Woher kommt der Term $-\\hbar\\hat L_z$?', opts:['Aus $i[\\hat L_x,\\hat L_y] = i\\cdot i\\hbar\\hat L_z$', 'Aus $\\hat L_z^2 = \\hbar\\hat L_z$', 'Aus der Normierung der Eigenzustände'], a:0, ex:'$(\\hat L_x - i\\hat L_y)(\\hat L_x + i\\hat L_y) = \\hat L_x^2 + \\hat L_y^2 + i[\\hat L_x,\\hat L_y] = \\hat L^2 - \\hat L_z^2 - \\hbar\\hat L_z$.'}},
          {l:'L_+|l,l⟩ = 0', w:R`oberste Sprosse, kurz $|l,l\rangle$`,
            why:{q:'Warum ist das null?', opts:['Weil es die oberste Sprosse ist; sonst wäre $\\mu^2 > \\lambda$.', 'Weil $\\hat L_+$ nicht hermitesch ist und keine Eigenwerte hat.', 'Weil $\\hat L_+$ den Wert $\\lambda$ ändert und so herausführt.'], a:0, ex:'Wäre $\\hat L_+|l,l\\rangle \\ne 0$, gäbe es einen Zustand mit $\\mu = \\hbar(l+1)$ und noch höher – im Widerspruch zur Beschränkung.'}},
          {l:'L^2|l,l⟩ = (L_- L_+ + L_z^2 + ħ L_z)|l,l⟩', w:R`Identität nach $\hat L^2$ aufgelöst`},
          {l:'= (0 + ħ^2 l^2 + ħ^2 l)|l,l⟩', w:R`$\hat L_+|l,l\rangle = 0$ und $\hat L_z|l,l\rangle = \hbar l|l,l\rangle$ eingesetzt`,
            why:{q:'Woher kommen die drei Summanden?', opts:['$\\hat L_+|l,l\\rangle = 0$ und $\\hat L_z|l,l\\rangle = \\hbar l|l,l\\rangle$', '$\\hat L_-\\hat L_+ = \\hat L^2$ und $\\hat L_z = \\hbar$', 'aus $\\hat L^2 = \\hat L_z^2$ für den obersten Zustand'], a:0, ex:'$\\hat L_z^2$ gibt $\\hbar^2l^2$, $\\hbar\\hat L_z$ gibt $\\hbar^2l$.'}},
          {l:'= ħ^2 l(l+1) |l,l⟩', w:R`$\hbar^2l$ ausgeklammert`}
        ]},
        q:{q:R`Die oberste Sprosse einer Leiter hat $\mu_{\max} = 2\hbar$. Welchen Wert hat $\lambda$?`,
          opts:[R`$4\hbar^2$`, R`$6\hbar^2$`, R`$2\hbar^2$`], a:1,
          ex:R`$l = 2$, also $\lambda = \hbar^2\cdot2\cdot3 = 6\hbar^2$.`,
          fb:[R`$\lambda = \mu_{\max}^2$ würde $\langle L_x^2 + L_y^2\rangle = 0$ bedeuten. Es kommt der Term $\hbar^2l$ dazu.`, '',
            R`$2\hbar^2$ gehört zu $l = 1$. Hier ist $l = \mu_{\max}/\hbar = 2$.`]}},
      {id:'dreh-t3e', title:'Das Spektrum: ganz- und halbzahlige Werte',
        num:{title:R`$l = 1$ und $l = \tfrac32$`, text:R`Für $l = 1$ läuft $\mu/\hbar$ von $-1$ bis $1$: drei Sprossen $-1, 0, 1$. Für $l = \tfrac32$ läuft es von $-\tfrac32$ bis $\tfrac32$:

$$-\tfrac32,\ -\tfrac12,\ \tfrac12,\ \tfrac32,$$

vier Sprossen, die $0$ ist nicht dabei. In beiden Fällen sind es $2l + 1$ Werte.`},
        text:R`Von $-\hbar l$ nach $+\hbar l$ kommst du nur in ganzen Schritten $\hbar$. Also ist $2l$ eine ganze Zahl ([[lex:drehimpuls-eigenwerte|Eigenwerte]]). Die Algebra erlaubt damit auch halbzahlige Werte. Für einen allgemeinen Drehimpuls schreibt man meist $j$ statt $l$:

$$j = 0, \tfrac12, 1, \tfrac32, \dots,\qquad m = -j, -j+1, \dots, j.$$

Ab jetzt schreibst du die Zustände als $|l,m\rangle$, gelesen „Ket l, m“, mit $\hat L^2|l,m\rangle = \hbar^2l(l+1)|l,m\rangle$ und $\hat L_z|l,m\rangle = \hbar m|l,m\rangle$. Zu jedem $l$ gibt es $2l + 1$ Zustände; das ist die Entartung aus Abschnitt 2. Gebraucht hast du nur die Vertauschungsrelationen. Beim Bahndrehimpuls fallen die halbzahligen Werte weg (Abschnitt 5).`,
        q:{q:R`Welche Werte kann $m$ bei einem Drehimpuls mit $j = \tfrac32$ annehmen?`,
          opts:[R`$-1, 0, 1$`, R`$-\tfrac32, -\tfrac12, 0, \tfrac12, \tfrac32$`, R`$-\tfrac32, -\tfrac12, \tfrac12, \tfrac32$`], a:2,
          ex:R`Von $-j$ bis $j$ in ganzen Schritten: $2j + 1 = 4$ Werte.`,
          fb:[R`Das sind die Werte zu $j = 1$. Zu $j = \tfrac32$ gehören halbzahlige $m$.`,
            R`Von $-\tfrac32$ aus erreichst du in Schritten $1$ die $0$ nicht. Es sind $2j + 1 = 4$ Werte.`, '']}}
    ]},

    /* ===== Abschnitt 4: Leiterfaktoren, Matrizen für l = 1, Vektormodell, Zeeman ===== */
    {id:'dreh-t4', title:'Leiterfaktoren und das Vektormodell', steps:[
      {id:'dreh-t4a', title:'Die Zahlenfaktoren der Leiter',
        pre:{from:'form', seg:'form-t2', title:'Die Norm eines Bildes', text:R`Der Bra zu $\hat A|\psi\rangle$ ist $\langle\psi|\hat A^\dagger$. Deshalb ist $\|\hat A|\psi\rangle\|^2 = \langle\psi|\hat A^\dagger\hat A|\psi\rangle$. Mini-Beispiel beim Oszillator: $\|\hat a|n\rangle\|^2 = \langle n|\hat a^\dagger\hat a|n\rangle = n$.`},
        num:{title:R`$\hat L_-|1,1\rangle$`, text:R`Es ist $\hat L_-|1,1\rangle = c\,|1,0\rangle$. Die Norm liefert $|c|^2 = \langle 1,1|\hat L_+\hat L_-|1,1\rangle$ mit $\hat L_+\hat L_- = \hat L^2 - \hat L_z^2 + \hbar\hat L_z$:

$$|c|^2 = \hbar^2\,(2 - 1 + 1) = 2\hbar^2,\qquad c = \sqrt2\,\hbar.$$`},
        text:R`Die Zahlenfaktoren bestimmst du wie beim Oszillator über die Norm. Mit $\hat L_+|l,m\rangle = c\,|l,m+1\rangle$ und $\hat L_+^\dagger = \hat L_-$ ist

$$|c|^2 = \langle l,m|\hat L_-\hat L_+|l,m\rangle = \hbar^2\left[l(l+1) - m(m+1)\right].$$

Mit reellem, positivem $c$ (Konvention) folgt

$$\hat L_\pm|l,m\rangle = \hbar\sqrt{l(l+1) - m(m\pm1)}\;|l,m\pm1\rangle.$$

Probe: Für $m = l$ verschwindet der Faktor von $\hat L_+$, für $m = -l$ der von $\hat L_-$. Die Leiter endet also von selbst an den richtigen Stellen. Als Merkhilfe hilft die Zerlegung $l(l+1) - m(m\pm1) = (l \mp m)(l \pm m + 1)$. Die Phase von $c$ ist frei wählbar; die Konvention macht alle Faktoren reell und positiv.`,
        derive:{ctx:DREH_JM(), lines:[
          {l:'⟨l,m|L_- L_+|l,m⟩ = ⟨l,m|(L^2 - L_z^2 - ħ L_z)|l,m⟩', w:'Identität aus Abschnitt 3 eingesetzt',
            why:{q:'Warum ist das $\\|\\hat L_+|l,m\\rangle\\|^2$?', opts:['Weil das Bra zu $\\hat L_+|l,m\\rangle$ gleich $\\langle l,m|\\hat L_-$ ist.', 'Weil $\\hat L_-\\hat L_+ = 1$ für jeden Zustand ist.', 'Weil $\\hat L_+$ hermitesch ist, $\\hat L_+^\\dagger = \\hat L_+$.'], a:0, ex:'Das Bra zu $\\hat A|\\psi\\rangle$ ist $\\langle\\psi|\\hat A^\\dagger$, und $\\hat L_+^\\dagger = \\hat L_-$.'}},
          {l:'= ħ^2 (l(l+1) - m^2 - m)', w:'Eigenwerte eingesetzt',
            why:{q:'Was wurde eingesetzt?', opts:['die Eigenwerte $\\hbar^2l(l+1)$ und $\\hbar m$', 'die Eigenwerte $\\hbar^2l^2$ und $\\hbar m$', 'die Faktoren $c$ der Leiteroperatoren'], a:0, ex:'$\\hat L^2$, $\\hat L_z^2$ und $\\hat L_z$ wirken auf $|l,m\\rangle$ einfach als Zahlen. Der Eigenwert von $\\hat L^2$ ist $\\hbar^2l(l+1)$, nicht $\\hbar^2l^2$; die Faktoren $c$ sind ja erst gesucht.'}},
          {l:'L_+ |l,m⟩ = ħ sqrt(l(l+1) - m(m+1)) |l,m+1⟩', w:R`Wurzel gezogen, $c$ reell und positiv gewählt`}
        ]},
        q:{q:R`Was ist $\hat L_-|2,1\rangle$?`,
          opts:[R`$2\hbar\,|2,0\rangle$`, R`$\sqrt2\,\hbar\,|2,0\rangle$`, R`$\sqrt6\,\hbar\,|2,0\rangle$`], a:2,
          ex:R`$l(l+1) - m(m-1) = 6 - 0 = 6$.`,
          fb:[R`Das ist der Faktor von $\hat L_+$ an $|2,1\rangle$: $\sqrt{6 - 1\cdot2} = 2$. Für $\hat L_-$ steht $m(m-1) = 0$ unter der Wurzel.`,
            R`$\sqrt2\,\hbar$ ist der Faktor bei $l = 1$. Für $l = 2$ steht unter der Wurzel $l(l+1) - m(m-1) = 6 - 0$.`, '']}},
      {id:'dreh-t4b', title:R`Die Matrizen für $l = 1$`,
        pre:{from:'form', seg:'form-t2', title:'Ein Operator als Matrix', text:R`In einer Basis ist der Eintrag in Zeile $m$, Spalte $n$ das Matrixelement $\langle m|\hat A|n\rangle$. Die $n$-te Spalte ist das Bild des $n$-ten Basisvektors. Mini-Beispiel: Aus $\hat\sigma_y|1\rangle = i|2\rangle$ folgt die erste Spalte $(0;\ i)$.`},
        num:{title:R`Die Bilder unter $\hat L_+$`, text:R`Ordne die Basis als $|1,1\rangle, |1,0\rangle, |1,-1\rangle$. Mit den Leiterfaktoren ist

$$\begin{aligned}\hat L_+|1,1\rangle &= 0,\\ \hat L_+|1,0\rangle &= \sqrt2\,\hbar\,|1,1\rangle,\\ \hat L_+|1,-1\rangle &= \sqrt2\,\hbar\,|1,0\rangle.\end{aligned}$$

Diese drei Bilder werden die drei Spalten der Matrix von $\hat L_+$.`},
        text:R`Für festes $l$ bilden die $2l + 1$ Zustände $|l,m\rangle$ eine Basis. Jeder Drehimpulsoperator wird darin zur $(2l+1)\times(2l+1)$-Matrix, für $l = 1$ also zur $3\times3$-Matrix. $\hat L_z$ ist diagonal mit den Eigenwerten $\hbar, 0, -\hbar$. $\hat L_+$ hat Einträge nur direkt über der Diagonale, $\hat L_-$ nur direkt darunter; $\hat L_-$ ist die konjugiert transponierte Matrix. Aus $\hat L_x = \tfrac12(\hat L_+ + \hat L_-)$ und $\hat L_y = \tfrac{1}{2i}(\hat L_+ - \hat L_-)$ folgen die übrigen. Die Herleitung prüft mit diesen Matrizen die Vertauschungsrelation nach.`,
        derive:{ctx:DREH_JM({mat:{preset:'jm', js:[1]}}), lines:[
          {l:'L_z = ħ (1, 0, 0; 0, 0, 0; 0, 0, -1)', w:R`Eigenwerte $\hbar m$ auf der Diagonale`},
          {l:'L_+ = sqrt(2) ħ (0, 1, 0; 0, 0, 1; 0, 0, 0)', w:'Spalten sind die Bilder der Basiskets',
            why:{q:'Warum steht die erste Spalte voller Nullen?', opts:['Weil sie das Bild der obersten Sprosse $|1,1\\rangle$ ist.', 'Weil $\\hat L_+$ weder hermitesch noch diagonal ist.', 'Weil der Zustand $|1,1\\rangle$ den Wert $L_z = 0$ hat.'], a:0, ex:'Spalte $n$ ist das Bild des $n$-ten Basiskets. Über der obersten Sprosse gibt es nichts.'}},
          {l:'L_- = sqrt(2) ħ (0, 0, 0; 1, 0, 0; 0, 1, 0)', w:R`$\hat L_- = \hat L_+^\dagger$: transponiert und konjugiert`},
          {l:'L_x = ħ/sqrt(2) (0, 1, 0; 1, 0, 1; 0, 1, 0)', w:R`$\tfrac12(\hat L_+ + \hat L_-)$`,
            why:{q:'Woher kommt $\\hbar/\\sqrt2$?', opts:['$\\tfrac12\\cdot\\sqrt2\\,\\hbar = \\hbar/\\sqrt2$', 'aus der Normierung der Basis', 'aus $\\sqrt{l(l+1)} = \\sqrt2$'], a:0, ex:'Die Einträge von $\\hat L_\\pm$ sind $\\sqrt2\\,\\hbar$; der Faktor $\\tfrac12$ aus $\\hat L_x = \\tfrac12(\\hat L_+ + \\hat L_-)$ macht daraus $\\hbar/\\sqrt2$.'}},
          {l:'L_y = ħ/sqrt(2) (0, -i, 0; i, 0, -i; 0, i, 0)', w:R`$\tfrac{1}{2i}(\hat L_+ - \hat L_-)$`},
          {l:'L_x L_y - L_y L_x = iħ L_z', w:'Matrizen multipliziert: die Vertauschungsrelation',
            why:{q:'Was zeigt diese Zeile?', opts:['Die Matrizen erfüllen dieselbe Algebra wie die Ableitungen.', 'Die Matrizen vertauschen, weil sie hermitesch sind.', 'Die Relation gilt nur für $l = 1$, nicht allgemein.'], a:0, ex:'Matrix und Differentialoperator sind zwei Darstellungen desselben Operators; die Vertauschungsrelation gilt in beiden und für jedes $l$.'}}
        ]},
        q:{q:R`Wo und mit welchem Wert steht $\langle 1,-1|\hat L_-|1,0\rangle$ in der Matrix von $\hat L_-$?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`Zeile 3, Spalte 2: $\sqrt2\,\hbar$`, R`Zeile 2, Spalte 3: $\sqrt2\,\hbar$`, R`Zeile 3, Spalte 2: $\hbar$`], a:0,
          ex:R`Der Bra $\langle 1,-1|$ wählt die Zeile (dritter Basisket), der Ket $|1,0\rangle$ die Spalte (zweiter). Wert: $\hbar\sqrt{2 - 0} = \sqrt2\,\hbar$.`,
          fb:['', R`Zeile und Spalte sind vertauscht. Der Bra bestimmt die Zeile, der Ket die Spalte.`,
            R`Die Stelle stimmt, der Faktor nicht: $\hbar\sqrt{l(l+1) - m(m-1)} = \sqrt2\,\hbar$ für $m = 0$.`]}},
      {id:'dreh-t4c', title:R`$\hat L_x$ für $l = 1$: Dirac, Matrix, Messung`,
        num:{title:R`$\hat L_x|1,1\rangle$`, text:R`Die erste Spalte der Matrix von $\hat L_x$ ist das Bild von $|1,1\rangle$:

$$\hat L_x|1,1\rangle = \tfrac{\hbar}{\sqrt2}\,|1,0\rangle.$$

In Dirac-Form gerechnet: $\tfrac12(\hat L_+ + \hat L_-)|1,1\rangle = \tfrac12\left(0 + \sqrt2\,\hbar\,|1,0\rangle\right)$, dasselbe.`},
        text:R`$\hat L_x$ ist im Zustand $|1,1\rangle$ nicht scharf. Seine Eigenwerte sind wie die von $\hat L_z$ gleich $\hbar, 0, -\hbar$, die Eigenvektoren aber andere Spalten. Entwickelst du $|1,1\rangle$ nach ihnen, liefert die [[lex:born|Born-Regel]] die Wahrscheinlichkeiten der drei Messwerte. Die Tafel verbindet die Rechnung mit Leiteroperatoren, die Matrix und die Messung. Übersetzt wird in beide Richtungen: aus Leiterfaktoren wird eine Matrix, aus der Matrix eine Wahrscheinlichkeit.`,
        reps:{obj:R`Der Operator $\hat L_x$ für $l = 1$`,
          rows:[
            {k:'worte', text:R`$\hat L_x$ macht aus $|1,m\rangle$ eine Mischung aus $|1,m+1\rangle$ und $|1,m-1\rangle$, je mit dem halben Leiterfaktor.`},
            {k:'dirac', tex:R`\hat L_x = \tfrac12(\hat L_+ + \hat L_-),\qquad \hat L_x|1,0\rangle = \tfrac{\hbar}{\sqrt2}\left(|1,1\rangle + |1,-1\rangle\right)`},
            {k:'matrix', tex:R`\hat L_x \doteq \frac{\hbar}{\sqrt2}\begin{pmatrix}0&1&0\\ 1&0&1\\ 0&1&0\end{pmatrix}\quad\text{in der Basis } |1,1\rangle, |1,0\rangle, |1,-1\rangle`},
            {k:'physik', text:R`Messwerte $\hbar, 0, -\hbar$ zu den Eigenvektoren $\tfrac12(1;\ \sqrt2;\ 1)$, $\tfrac{1}{\sqrt2}(1;\ 0;\ -1)$, $\tfrac12(1;\ -\sqrt2;\ 1)$. Im Zustand $|1,1\rangle$ treten sie mit $P = \tfrac14, \tfrac12, \tfrac14$ auf.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Mischung aus $m \pm 1$“ als $\tfrac12(\hat L_+ + \hat L_-)$ schreiben und jeden Leiteroperator mit seinem Faktor $\hbar\sqrt{l(l+1) - m(m\pm1)}$ anwenden.`},
            {from:'dirac', to:'matrix', rule:R`Für jeden Basisket das Bild ausrechnen und als Spalte eintragen; der Bra $\langle 1,m'|$ wählt die Zeile.`},
            {from:'matrix', to:'physik', rule:R`Eigenwerte und Eigenvektoren der Matrix bestimmen, dann $P = |\langle v|1,1\rangle|^2$. Für $|1,1\rangle \doteq (1;\ 0;\ 0)$ ist das die erste Komponente jedes Eigenvektors, quadriert.`}
          ]},
        q:{q:R`Welche Spalte stellt $\hat L_x|1,0\rangle$ dar, in der Basis $|1,1\rangle, |1,0\rangle, |1,-1\rangle$?`, tr:{from:'dirac', to:'matrix'},
          opts:[R`$\tfrac{\hbar}{\sqrt2}(0;\ 1;\ 0)$`, R`$\tfrac{\hbar}{\sqrt2}(1;\ 0;\ 1)$`, R`$\sqrt2\,\hbar\,(1;\ 0;\ 1)$`], a:1,
          ex:R`Die zweite Spalte der Matrix ist das Bild von $|1,0\rangle$: $\tfrac{\hbar}{\sqrt2}(1;\ 0;\ 1)$, also $\tfrac{\hbar}{\sqrt2}\left(|1,1\rangle + |1,-1\rangle\right)$.`,
          fb:[R`$|1,0\rangle$ ist kein Eigenvektor von $\hat L_x$. $\hat L_x$ ändert $m$ um $\pm1$.`, '',
            R`Der Faktor $\tfrac12$ aus $\hat L_x = \tfrac12(\hat L_+ + \hat L_-)$ fehlt: $\tfrac12\cdot\sqrt2\,\hbar = \hbar/\sqrt2$.`]}},
      {id:'dreh-t4d', title:R`Mittelwerte von $L_x$ und $L_x^2$`,
        num:{title:R`Im Zustand $|1,1\rangle$`, text:R`Aus der Tafel: $\langle L_x\rangle = \tfrac14\hbar + \tfrac12\cdot 0 - \tfrac14\hbar = 0$ und

$$\langle L_x^2\rangle = \tfrac14\hbar^2 + 0 + \tfrac14\hbar^2 = \tfrac12\hbar^2.$$

Die allgemeine Formel unten gibt dasselbe: $\tfrac{\hbar^2}{2}(1\cdot2 - 1^2) = \tfrac12\hbar^2$.`},
        text:R`Ohne Matrizen geht es allgemein. Mit $\hat L_x = \tfrac12(\hat L_+ + \hat L_-)$ und $\hat L_y = \tfrac{1}{2i}(\hat L_+ - \hat L_-)$ ändert jeder Term $m$ um $\pm1$. Darum ist in jedem Zustand $|l,m\rangle$

$$\langle L_x\rangle = \langle L_y\rangle = 0,\qquad \langle L_x^2\rangle = \langle L_y^2\rangle = \frac{\hbar^2}{2}\left[l(l+1) - m^2\right].$$

Die zweite Formel folgt aus $\hat L_x^2 + \hat L_y^2 = \hat L^2 - \hat L_z^2$ und der Symmetrie zwischen $x$ und $y$. Eine Drehung um $90°$ um die $z$-Achse führt $L_x$ in $L_y$ über und lässt $|l,m\rangle$ bis auf eine Phase unverändert.`,
        derive:{ctx:DREH_JM(), lines:[
          {l:'⟨l,m|L_x|l,m⟩ = 0', w:R`$\hat L_x$ ändert $m$ um $\pm1$`,
            why:{q:'Warum ist das null?', opts:['Weil $\\hat L_x|l,m\\rangle$ nur $|l,m\\pm1\\rangle$ enthält.', 'Weil $\\hat L_x$ nicht hermitesch ist und keinen Mittelwert hat.', 'Weil $L_x$ im Zustand $|l,m\\rangle$ scharf null ist.'], a:0, ex:'$|l,m\\pm1\\rangle$ sind beide orthogonal zu $|l,m\\rangle$. Der Mittelwert ist null, aber $L_x$ ist nicht scharf: $\\langle L_x^2\\rangle > 0$ für $l > 0$.'}},
          {l:'⟨l,m|L_x^2|l,m⟩ = 1/2 ⟨l,m|(L^2 - L_z^2)|l,m⟩', w:R`$\langle L_x^2\rangle = \langle L_y^2\rangle$, zusammen $\langle L^2 - L_z^2\rangle$`,
            why:{q:'Warum der Faktor $\\tfrac12$?', opts:['Weil $\\langle L_x^2\\rangle = \\langle L_y^2\\rangle$ ist.', 'Weil $\\hat L_x = \\tfrac12(\\hat L_+ + \\hat L_-)$ ist.', 'Weil $\\hat L_x^2 = \\tfrac12\\hat L^2$ gilt.'], a:0, ex:'Eine Drehung um die $z$-Achse um $90°$ führt $L_x$ in $L_y$ über und lässt $|l,m\\rangle$ bis auf eine Phase unverändert.'}},
          {l:'= ħ^2/2 (l(l+1) - m^2)', w:'Eigenwerte eingesetzt'},
          {l:'⟨1,1|L_x^2|1,1⟩ = ħ^2/2', w:R`Probe mit $l = m = 1$`}
        ]},
        q:{q:R`Im Zustand $|2,2\rangle$: Wie groß ist $\langle L_x^2\rangle + \langle L_y^2\rangle$?`,
          opts:[R`$0$, weil $m = l$ ist`, R`$6\hbar^2$`, R`$2\hbar^2$`], a:2,
          ex:R`$\hbar^2[l(l+1) - m^2] = \hbar^2(6 - 4) = 2\hbar^2$.`,
          fb:[R`Auch bei $m = l$ bleibt $\hbar^2[l(l+1) - l^2] = \hbar^2l$ übrig.`,
            R`$6\hbar^2$ ist $\langle L^2\rangle$. Davon geht $\langle L_z^2\rangle = 4\hbar^2$ ab.`, '']}},
      {id:'dreh-t4e', title:'Das Vektormodell',
        num:{title:R`$l = 1$, $m = 1$`, text:R`Länge $|\vec L| = \hbar\sqrt{l(l+1)} = \sqrt2\,\hbar \approx 1{,}41\,\hbar$, Höhe $\hbar m = \hbar$. Der Winkel zur $z$-Achse folgt aus

$$\cos\vartheta = \frac{m}{\sqrt{l(l+1)}} = \frac{1}{\sqrt2},\qquad \vartheta = 45°.$$

Der Rest $\langle L_x^2 + L_y^2\rangle = \hbar^2$ ist das Quadrat des Kegelradius.`},
        text:R`Ein anschauliches Bild ist das [[lex:dreh-vektormodell|Vektormodell]]: $\vec L$ liegt auf einem Kegelmantel um die $z$-Achse, mit der Länge $\hbar\sqrt{l(l+1)}$ und der Höhe $\hbar m$. Die Richtung auf dem Kegel ist unbestimmt, passend zu $\langle L_x\rangle = \langle L_y\rangle = 0$. Das Bild ist eine Merkhilfe, keine Bahn. Es gibt keinen Pfeil, der „in Wirklichkeit“ irgendwohin zeigt. Die Tafel übersetzt zwischen Ket, Formeln, Bild und Messung.`,
        reps:{obj:R`Der Zustand $|2,1\rangle$ im Vektormodell`,
          rows:[
            {k:'dirac', tex:R`|2,1\rangle:\qquad \hat L^2|2,1\rangle = 6\hbar^2|2,1\rangle,\quad \hat L_z|2,1\rangle = \hbar|2,1\rangle`},
            {k:'formel', tex:R`|\vec L| = \sqrt6\,\hbar,\quad L_z = \hbar,\quad \langle L_x^2 + L_y^2\rangle = 5\hbar^2,\quad \cos\vartheta = \tfrac{1}{\sqrt6}`},
            {k:'worte', text:R`Ein Kegel um die $z$-Achse; seine Mantellinie bildet mit der $z$-Achse den Winkel $\vartheta \approx 65{,}9°$. Der Pfeil liegt irgendwo auf dem Mantel; wo, ist nicht festgelegt.`},
            {k:'physik', text:R`$L_z$ ergibt sicher $\hbar$. $L_x$ ergibt einen der Werte $2\hbar, \hbar, 0, -\hbar, -2\hbar$, im Mittel $0$, mit $\langle L_x^2\rangle = \tfrac52\hbar^2$.`}
          ],
          links:[
            {from:'dirac', to:'formel', rule:R`Aus $l = 2$, $m = 1$ die Eigenwerte ablesen. Die Länge ist die Wurzel aus dem Eigenwert von $\hat L^2$, nicht $\hbar l$.`},
            {from:'formel', to:'worte', rule:R`Länge und Höhe als Kegel zeichnen: Mantellinie $\sqrt6\,\hbar$, Höhe $\hbar$, Radius $\sqrt5\,\hbar$; den Winkel zur $z$-Achse aus $\cos\vartheta = m/\sqrt{l(l+1)}$ berechnen.`},
            {from:'worte', to:'physik', rule:R`Nur die Höhe des Kegels ist scharf messbar. Die Lage auf dem Mantel hat keine Messbedeutung; sie entspricht der Streuung von $L_x$ und $L_y$ um null.`}
          ]},
        q:{q:R`Welcher Winkel zur $z$-Achse gehört im Vektormodell zu $|2,2\rangle$?`, tr:{from:'dirac', to:'formel'},
          opts:[R`$0°$, denn $m = l$`, R`$\vartheta \approx 35{,}3°$ mit $\cos\vartheta = \tfrac{2}{\sqrt6}$`, R`$45°$, wie bei $|1,1\rangle$`], a:1,
          ex:R`$\cos\vartheta = m/\sqrt{l(l+1)} = 2/\sqrt6 \approx 0{,}816$, also $\vartheta \approx 35{,}3°$. Mit wachsendem $l$ wird der Winkel bei $m = l$ kleiner, aber nie null.`,
          fb:[R`$|\vec L| = \sqrt6\,\hbar$ ist größer als $L_z = 2\hbar$. Der Pfeil kann nicht genau auf der Achse liegen.`, '',
            R`Der Winkel hängt von $l$ und $m$ ab: $\cos\vartheta = m/\sqrt{l(l+1)}$.`]}},
      {id:'dreh-t4f', title:R`Typischer Fehler: Bei $m = l$ zeige $\vec L$ genau nach $z$`,
        num:{title:R`Im Zustand $|1,1\rangle$`, text:R`$L_z = \hbar$, aber $|\vec L| = \sqrt2\,\hbar$. Mit $\langle L_x\rangle = 0$ ist $\Delta L_x = \sqrt{\langle L_x^2\rangle} = \hbar/\sqrt2$, ebenso $\Delta L_y$. Robertson verlangt

$$\Delta L_x\,\Delta L_y = \tfrac12\hbar^2 \ge \tfrac\hbar2\cdot\hbar = \tfrac12\hbar^2.$$

Die Ungleichung ist gerade mit Gleichheit erfüllt.`},
        text:R`Nimm den Zustand mit dem größten $L_z$, also $m = l$. Viele denken: Dann zeigt $\vec L$ genau nach oben. Das stimmt nicht. Der Betrag ist $\hbar\sqrt{l(l+1)}$, die $z$-Komponente nur $\hbar l$, also immer kleiner. Der Rest steckt in $\langle L_x^2 + L_y^2\rangle = \hbar^2l > 0$. Ganz nach oben zeigen kann $\vec L$ nicht: Dann wären $L_x = L_y = 0$ scharf, im Widerspruch zu $\Delta L_x\,\Delta L_y \ge \tfrac\hbar2|\langle L_z\rangle|$. Ein verwandter Fehler ist, die Länge als $\hbar l$ statt $\hbar\sqrt{l(l+1)}$ anzugeben.`,
        q:{q:R`Jemand sagt: „Im Zustand $|3,3\rangle$ hat der Drehimpuls die Länge $3\hbar$ und zeigt in $z$-Richtung.“ Was stimmt?`,
          opts:[R`Beides stimmt, weil $m$ den größtmöglichen Wert hat.`, R`Die Länge ist $\sqrt{12}\,\hbar$, der Pfeil liegt auf einem Kegel.`, R`Die Länge stimmt, nur die Richtung ist unbestimmt.`], a:1,
          ex:R`$|\vec L| = \hbar\sqrt{3\cdot4} = \sqrt{12}\,\hbar \approx 3{,}46\,\hbar$. Weil $L_z = 3\hbar$ kleiner ist, bleibt $\langle L_x^2 + L_y^2\rangle = \hbar^2(12 - 9) = 3\hbar^2$.`,
          fb:[R`Gerade bei $m = l$ ist $|\vec L| > L_z$: $\sqrt{12}\,\hbar > 3\hbar$. Ganz nach oben zeigen kann der Pfeil nie.`, '',
            R`Die Länge ist $\hbar\sqrt{l(l+1)}$, nicht $\hbar l$. Das ist der zweite häufige Fehler.`]}},
      {id:'dreh-t4g', title:'Richtungsquantelung gemessen: der Zeeman-Effekt',
        num:{title:R`$B = 1\,\mathrm T$`, text:R`Mit $\mu_B = 5{,}79\cdot10^{-5}\,\mathrm{eV/T}$ verschieben sich die drei Unterniveaus von $l = 1$, also $m = -1, 0, 1$, um

$$m\,\mu_BB = m\cdot5{,}79\cdot10^{-5}\,\mathrm{eV}.$$

Je Stufe ist das eine Frequenz $\mu_BB/h \approx 14\,\mathrm{GHz}$, winzig gegen die Frequenz sichtbaren Lichts von etwa $5\cdot10^{14}\,\mathrm{Hz}$.`},
        text:R`Die Quantisierung von $L_z$ ist messbar. Mit dem Bahndrehimpuls ist ein magnetisches Moment $\vec\mu = -\tfrac{e}{2m_e}\vec L$ verbunden. In einem Magnetfeld $B$ entlang $z$ hat das Elektron deshalb die Zusatzenergie

$$\Delta E = m\,\mu_BB,\qquad \mu_B = \frac{e\hbar}{2m_e},$$

mit dem Bohrschen Magneton $\mu_B$. Ein Niveau mit $l = 1$ spaltet in drei Niveaus mit gleichem Abstand auf: der [[lex:dreh-zeeman|Zeeman-Effekt]] aus der Vorhersage zu Beginn. Wäre $\vec L$ ein Pfeil mit beliebiger Richtung, könnte $L_z$ jeden Wert zwischen $-|\vec L|$ und $|\vec L|$ annehmen, und das Niveau wäre zu einem Band verschmiert. Gemessen werden getrennte Linien.

**Vorsicht:** Die drei Linien erklärte Lorentz 1896 auch mit einem klassisch schwingenden Elektron. Die Quantentheorie liefert darüber hinaus die Zahl $2l + 1$ der Unterniveaus. Atome mit Elektronenspin zeigen kompliziertere Muster, die klassisch gar nicht zu erklären sind.`,
        q:{q:R`Ein Niveau mit $l = 2$ liegt im Feld $B\hat z$. In wie viele Niveaus spaltet es auf, und wie groß ist ihr Abstand?`,
          opts:[R`drei Niveaus, Abstand $\mu_BB$`, R`fünf Niveaus, Abstand $2\mu_BB$`, R`fünf Niveaus, Abstand $\mu_BB$`], a:2,
          ex:R`$m = -2, \dots, 2$ gibt $2l + 1 = 5$ Niveaus. Benachbarte $m$ unterscheiden sich um $1$, die Energien also um $\mu_BB$.`,
          fb:[R`Drei Unterniveaus hat $l = 1$. Zu $l = 2$ gehören $2l + 1 = 5$ Werte von $m$.`,
            R`Der Abstand gehört zu $\Delta m = 1$ und ist $\mu_BB$, unabhängig von $l$.`, '']}}
    ]},

    /* ===== Abschnitt 5: Ortsdarstellung, Kugelflächenfunktionen ===== */
    {id:'dreh-t5', title:'Bahndrehimpuls in Kugelkoordinaten', steps:[
      {id:'dreh-t5a', title:R`$\hat L_z$ als Ableitung nach $\varphi$`,
        pre:{from:'m-spezial', seg:'ms-t1', title:'Kugelkoordinaten', text:R`$x = r\sin\theta\cos\varphi$, $y = r\sin\theta\sin\varphi$, $z = r\cos\theta$. Der Polarwinkel $\theta$ läuft von der $z$-Achse aus von $0$ bis $\pi$, der Azimut $\varphi$ in der $xy$-Ebene von $0$ bis $2\pi$. Mini-Beispiel: Der Punkt $(0, 0, 1)$ hat $r = 1$ und $\theta = 0$.`},
        num:{title:R`$x + iy$ in Kugelkoordinaten`, text:R`$x + iy = r\sin\theta\,(\cos\varphi + i\sin\varphi) = r\sin\theta\,e^{i\varphi}$. Abgeleitet nach $\varphi$:

$$-i\hbar\,\frac{\partial}{\partial\varphi}\left(r\sin\theta\,e^{i\varphi}\right) = -i\hbar\cdot i\,r\sin\theta\,e^{i\varphi} = \hbar\,(x + iy).$$

Dasselbe Ergebnis wie in Abschnitt 1, ohne die Ableitungen nach $x$ und $y$.`},
        text:R`Für den Bahndrehimpuls gibt es neben der Algebra eine Ortsdarstellung. In [[lex:kugelkoordinaten|Kugelkoordinaten]] $(r,\theta,\varphi)$ ist eine Drehung um die $z$-Achse einfach $\varphi \to \varphi + \alpha$. Mit der Kettenregel ist $\partial_\varphi = x\,\partial_y - y\,\partial_x$, und aus $-i\hbar(x\partial_y - y\partial_x)$ wird

$$\hat L_z = -i\hbar\frac{\partial}{\partial\varphi}.$$

Die übrigen Komponenten enthalten auch $\partial_\theta$. Keine enthält $r$ oder $\partial_r$: Drehimpulsoperatoren wirken nur auf die Winkel. Eigenfunktionen von $\hat L_z$ sind deshalb $e^{im\varphi}$ mal eine beliebige Funktion von $r$ und $\theta$.`,
        q:{q:R`Welche Funktion ist Eigenfunktion von $\hat L_z$?`,
          opts:[R`$\sin\theta\cos\varphi$`, R`$\cos\theta + \sin\theta\,e^{i\varphi}$`, R`$\sin\theta\,e^{-2i\varphi}$`], a:2,
          ex:R`Nur eine reine Exponentialfunktion $e^{im\varphi}$ ist Eigenfunktion von $-i\hbar\,\partial_\varphi$; hier mit $m = -2$.`,
          fb:[R`$\cos\varphi = \tfrac12(e^{i\varphi} + e^{-i\varphi})$ enthält zwei verschiedene Werte von $m$.`,
            R`Die Summanden haben $m = 0$ und $m = 1$. Zusammen sind sie kein Eigenzustand.`, '']}},
      {id:'dreh-t5b', title:R`$\hat L^2$ ist der Winkelteil des Laplace-Operators`,
        pre:{from:'m-spezial', seg:'ms-t3', title:'Laplace-Operator in Kugelkoordinaten', text:R`$\nabla^2 = \frac{1}{r^2}\partial_r(r^2\partial_r) + \frac{1}{r^2}[\dots]$, wobei die eckige Klammer nur Ableitungen nach $\theta$ und $\varphi$ enthält. Für eine Funktion von $r$ allein fällt sie weg. Mini-Beispiel: Für $f = r^2$ ist $\nabla^2f = \frac{1}{r^2}(r^2\cdot2r)' = 6$.`},
        num:{title:R`$\hat L^2$ an $\cos\theta$`, text:R`Es ist $z = r\cos\theta$, und $\hat L^2$ wirkt nur auf $\cos\theta$. Der $\varphi$-Term fällt weg, es bleibt

$$\frac{1}{\sin\theta}\frac{d}{d\theta}\left(\sin\theta\cdot(-\sin\theta)\right) = \frac{-2\sin\theta\cos\theta}{\sin\theta} = -2\cos\theta.$$

Mal $-\hbar^2$ gibt das $\hat L^2\cos\theta = 2\hbar^2\cos\theta$, also $l = 1$, wie für $z$ in Abschnitt 2.`},
        text:R`Auch $\hat L^2$ hat eine Ortsdarstellung, nur mit Winkelableitungen ([[lex:drehimpuls-kugel|Formelsammlung]]):

$$\hat L^2 = -\hbar^2\left[\frac{1}{\sin\theta}\frac{\partial}{\partial\theta}\left(\sin\theta\frac{\partial}{\partial\theta}\right) + \frac{1}{\sin^2\theta}\frac{\partial^2}{\partial\varphi^2}\right].$$

Die eckige Klammer ist genau der Winkelteil des [[lex:laplace-operator|Laplace-Operators]] aus M8. Deshalb gilt $\nabla^2 = \frac{1}{r^2}\partial_r(r^2\partial_r) - \frac{\hat L^2}{\hbar^2r^2}$. **Ausblick:** Darum taucht $\hat L^2$ im Wasserstoffatom auf (Thema 9). Die kinetische Energie zerfällt dort in einen radialen Teil und die Rotationsenergie.`,
        q:{q:R`Es gilt $\hat L^2(3\cos^2\theta - 1) = 6\hbar^2(3\cos^2\theta - 1)$. Welches $l$ hat diese Funktion?`,
          opts:[R`$l = 6$`, R`$l = 2$`, R`$l = 3$`], a:1,
          ex:R`$\hbar^2l(l+1) = 6\hbar^2$ gibt $l = 2$.`,
          fb:[R`$6\hbar^2$ ist der Eigenwert $\hbar^2l(l+1)$, nicht $\hbar^2l$.`, '',
            R`$l = 3$ gäbe $\hbar^2\cdot3\cdot4 = 12\hbar^2$.`]}},
      {id:'dreh-t5c', title:R`Eindeutigkeit: $m$ ist ganzzahlig`,
        num:{title:R`$m = \tfrac12$ probiert`, text:R`Mit $m = \tfrac12$ wäre $\Phi = e^{i\varphi/2}$. Bei $\varphi = 0$ ist $\Phi = 1$. Nach einem vollen Umlauf, bei $\varphi = 2\pi$ und damit am selben Punkt im Raum, ist

$$e^{i\cdot2\pi/2} = e^{i\pi} = -1 \ne 1.$$

Dieselbe Stelle hätte zwei verschiedene Funktionswerte.`},
        text:R`Eigenfunktionen von $\hat L_z$ erfüllen $-i\hbar\,\partial_\varphi\Phi = \hbar m\,\Phi$, also $\Phi = e^{im\varphi}$. Eine Wellenfunktion muss aber eindeutig sein: $\varphi$ und $\varphi + 2\pi$ sind derselbe Punkt. Aus $e^{2\pi im} = 1$ folgt $m\in\mathbb Z$. Weil $m$ in ganzen Schritten bis $l$ läuft, ist auch $l$ ganzzahlig. Die halbzahligen Werte, die die Algebra erlaubt, gibt es beim Bahndrehimpuls also nicht. **Ausblick:** Für einen Drehimpuls ohne Ortsdarstellung entfällt dieses Argument; das ist der Spin (Thema 10).`,
        q:{q:R`Welche Funktion kommt als $\varphi$-Abhängigkeit einer Wellenfunktion mit scharfem $L_z$ in Frage?`,
          opts:['$e^{3i\\varphi/2}$, weil $m = \\tfrac32$ in der Leiter erlaubt ist', '$e^{-3i\\varphi}$, weil es nach $2\\pi$ denselben Wert hat', '$e^{i\\varphi^2}$, weil $|e^{i\\varphi^2}|^2 = 1$ ist'], a:1,
          ex:R`$e^{-3i\varphi}$ hat bei $\varphi$ und $\varphi + 2\pi$ denselben Wert, mit $m = -3$.`,
          fb:[R`Die Algebra erlaubt $m = \tfrac32$, aber $e^{3i\pi} = -1$: Die Funktion wäre nach einem Umlauf nicht eindeutig.`, '',
            R`Der Betrag allein reicht nicht. $e^{i\varphi^2}$ ist nicht $2\pi$-periodisch und keine Eigenfunktion von $\hat L_z$.`]}},
      {id:'dreh-t5d', title:R`Die $\theta$-Abhängigkeit aus der Leiter`,
        num:{title:R`Oberste Sprosse für $l = 1$`, text:R`Ansatz $Y_1^1 = f(\theta)\,e^{i\varphi}$. Die Bedingung $\hat L_+Y_1^1 = 0$ wird mit $\hat L_+ = \hbar e^{i\varphi}(\partial_\theta + i\cot\theta\,\partial_\varphi)$ zu

$$f' + i\cot\theta\cdot i\,f = 0\quad\Rightarrow\quad f' = \cot\theta\,f\quad\Rightarrow\quad f = \sin\theta.$$

Probe: $(\sin\theta)' = \cos\theta = \cot\theta\,\sin\theta$.`},
        text:R`Die $\theta$-Abhängigkeit folgt am bequemsten aus der Leiter. Allgemein erfüllt die oberste Sprosse $\hat L_+Y_l^l = 0$. Mit dem Ansatz $Y_l^l = f(\theta)\,e^{il\varphi}$ wird daraus $f' = l\cot\theta\,f$, also $f \propto \sin^l\theta$. Die übrigen Funktionen derselben Leiter entstehen durch wiederholtes Anwenden des Absteigers

$$\hat L_- = -\hbar e^{-i\varphi}\left(\partial_\theta - i\cot\theta\,\partial_\varphi\right).$$

Die Herleitung prüft das für $l = 1$: den Eigenwert von $\hat L_z$, die oberste Sprosse, den Eigenwert von $\hat L^2$ und den ersten Schritt nach unten.`,
        derive:{ctx:DREH_SPH(), lines:[
          {l:'L̂_z (sin(θ) e^(iφ)) = ħ sin(θ) e^(iφ)', w:R`nur $e^{i\varphi}$ wird abgeleitet`,
            why:{q:'Welcher Eigenwert von $\\hat L_z$ ergibt sich?', opts:['$\\hbar$, also $m = 1$', '$i\\hbar$, also $m = i$', '$\\hbar\\sin\\theta$'], a:0, ex:'Nur $e^{i\\varphi}$ wird abgeleitet: $-i\\hbar\\cdot i = \\hbar$. $\\sin\\theta$ ist dabei konstant.'}},
          {l:'L̂_+ (sin(θ) e^(iφ)) = 0', w:'oberste Sprosse',
            why:{q:'Was zeigt diese Zeile?', opts:['$\\sin\\theta\\,e^{i\\varphi}$ ist die oberste Sprosse zu $l = 1$.', 'Die Funktion ist nicht normierbar.', '$\\hat L_+$ ist der Nulloperator.'], a:0, ex:'$f = \\sin\\theta$ erfüllt $f\' = \\cot\\theta\\,f$ – genau die Bedingung $\\hat L_+Y_1^1 = 0$.'}},
          {l:'L̂^2 (sin(θ) e^(iφ)) = 2ħ^2 sin(θ) e^(iφ)', w:R`Eigenwert von $\hat L^2$`,
            why:{q:'Passt das zu $l = 1$?', opts:['Ja, $\\hbar^2l(l+1) = 2\\hbar^2$.', 'Nein, $l = 1$ hätte $\\hbar^2$.', 'Nein, $l = 1$ hätte $4\\hbar^2$.'], a:0, ex:'$1\\cdot2 = 2$.'}},
          {l:'L̂_- (sin(θ) e^(iφ)) = -2ħ cos(θ)', w:'eine Sprosse nach unten',
            why:{q:'Was entsteht beim Absteigen?', opts:['ein Vielfaches von $\\cos\\theta \\propto Y_1^0$', 'ein Vielfaches von $\\sin\\theta\\,e^{-i\\varphi}$', 'der Nullvektor'], a:0, ex:'$\\hat L_-$ senkt $m$ von 1 auf 0. Mit den normierten Funktionen des nächsten Schritts, $Y_1^1 = -\\sqrt{3/(8\\pi)}\\,\\sin\\theta\\,e^{i\\varphi}$ (das Minus ist Konvention) und $Y_1^0 = \\sqrt{3/(4\\pi)}\\cos\\theta$, folgt $\\hat L_-Y_1^1 = \\sqrt2\\,\\hbar\\,Y_1^0$ – derselbe Faktor wie in der Matrix aus Abschnitt 4.'}}
        ]},
        q:{q:R`Welche Funktion ist die oberste Sprosse zu $l = 2$?`,
          opts:[R`$\sin\theta\,e^{2i\varphi}$`, R`$\cos^2\theta\,e^{2i\varphi}$`, R`$\sin^2\theta\,e^{2i\varphi}$`], a:2,
          ex:R`$f' = 2\cot\theta\,f$ hat die Lösung $f = \sin^2\theta$. Probe: $(\sin^2\theta)' = 2\sin\theta\cos\theta = 2\cot\theta\,\sin^2\theta$.`,
          fb:[R`$\sin\theta$ erfüllt $f' = \cot\theta\,f$, nicht $f' = 2\cot\theta\,f$. Zu $m = 2$ gehört $\sin^2\theta$.`,
            R`$\cos^2\theta$ verschwindet am Äquator. Die oberste Sprosse ist dort gerade am größten.`, '']}},
      {id:'dreh-t5e', title:'Normierung auf der Kugel',
        pre:{from:'m-spezial', seg:'ms-t1', title:'Raumwinkelelement', text:R`Auf der Einheitskugel ist das Flächenelement $d\Omega = \sin\theta\,d\theta\,d\varphi$; über alle Richtungen gilt $\int d\Omega = 4\pi$. Mit $u = \cos\theta$ wird ein Winkelintegral zum Polynomintegral. Mini-Beispiel: $\int_0^\pi\cos^2\theta\sin\theta\,d\theta = \int_{-1}^1u^2\,du = \tfrac23$.`},
        num:{title:R`$Y_1^0 = N\cos\theta$`, text:R`Normierung über die Kugel:

$$\int_0^{2\pi}\!\!\int_0^\pi N^2\cos^2\theta\,\sin\theta\,d\theta\,d\varphi = N^2\cdot2\pi\cdot\tfrac23 = N^2\,\tfrac{4\pi}{3} = 1,$$

also $N = \sqrt{3/(4\pi)} \approx 0{,}489$.`},
        text:R`Allgemein sind die [[lex:kugelflaechenfunktionen|Kugelflächenfunktionen]]

$$Y_l^m(\theta,\varphi) = N_{lm}\,P_l^m(\cos\theta)\,e^{im\varphi}$$

mit den zugeordneten [[lex:legendre-polynome|Legendre-Funktionen]] $P_l^m$ und einer Normierungskonstanten $N_{lm}$. Beispiele: $Y_0^0 = \frac{1}{\sqrt{4\pi}}$, $Y_1^0 = \sqrt{\tfrac{3}{4\pi}}\cos\theta$, $Y_1^{\pm1} = \mp\sqrt{\tfrac{3}{8\pi}}\sin\theta\,e^{\pm i\varphi}$. Der Vorfaktor $N_{lm}$ sorgt dafür, dass das Integral von $|Y_l^m|^2$ über alle Richtungen $1$ ergibt. Normiert wird also mit dem Flächenelement der Einheitskugel, wie im Beispiel. Die $Y_l^m$ sind außerdem zueinander orthogonal, zusammen also orthonormal: $\int Y_l^{m*}Y_{l'}^{m'}\,d\Omega = \delta_{ll'}\delta_{mm'}$. Das Vorzeichen bei $Y_1^1$ ist eine Konvention (Condon-Shortley-Phase). Sie ist so gewählt, dass $\hat L_\pm$ auf den $Y_l^m$ mit denselben positiven Faktoren wirkt wie auf die Kets $|l,m\rangle$ in Abschnitt 4.`,
        derive:{ctx:DREH_SPH(), lines:[
          {l:'∫_0^π ∫_0^(2π) cos(θ)^2 sin(θ) dφ dθ = 4π/3', w:R`Flächenelement $\sin\theta\,d\theta\,d\varphi$`,
            why:{q:'Was käme ohne $\\sin\\theta$ heraus?', opts:['$\\pi^2$, und die Normierung wäre falsch', 'dasselbe, $\\sin\\theta$ ist nur ein Faktor', '$4\\pi$, die Oberfläche der Kugel'], a:0, ex:'$\\int_0^\\pi\\cos^2\\theta\\,d\\theta = \\pi/2$, mal $2\\pi$ gibt $\\pi^2$. Mit $\\sin\\theta$ ist es $2\\pi\\cdot\\tfrac23 = \\tfrac{4\\pi}{3}$.'}},
          {l:'∫_0^π ∫_0^(2π) 3/(8π) sin(θ)^2 sin(θ) dφ dθ = 1', w:R`Probe für $|Y_1^{\pm1}|^2$`}
        ]},
        q:{q:R`Wie groß ist $N$ in $Y_0^0 = N$?`,
          opts:[R`$\tfrac{1}{\sqrt{4\pi}}$`, R`$\tfrac{1}{\sqrt{2\pi^2}}$`, R`$\tfrac{1}{4\pi}$`], a:0,
          ex:R`$N^2\int d\Omega = N^2\cdot4\pi = 1$.`,
          fb:['', R`Das käme ohne $\sin\theta$ heraus: $\int_0^\pi d\theta\int_0^{2\pi}d\varphi = 2\pi^2$.`,
            R`Normiert wird $|Y|^2$, also $N^2\cdot4\pi = 1$, nicht $N\cdot4\pi = 1$.`]}},
      {id:'dreh-t5f', title:'Ein Zustand in sechs Gestalten',
        num:{title:R`$|Y_1^0|^2$ an drei Stellen`, text:R`$|Y_1^0|^2 = \tfrac{3}{4\pi}\cos^2\theta$ hat die Werte

$$\theta = 0:\ 0{,}239,\qquad \theta = 60°:\ 0{,}060,\qquad \theta = 90°:\ 0.$$

Am Pol ist es am größten, in der $xy$-Ebene null. Bei $60°$ ist nur ein Viertel übrig, weil $\cos^2 60° = \tfrac14$.`},
        text:R`Jetzt kannst du einen Drehimpulszustand vollständig übersetzen. Der Ket $|l,m\rangle$ legt sich auf keine Darstellung fest. In der Basis $|1,1\rangle, |1,0\rangle, |1,-1\rangle$ ist er eine Spalte. In der Ortsdarstellung ist er die Funktion $\langle\theta,\varphi|l,m\rangle = Y_l^m(\theta,\varphi)$, gelesen „Bra theta, phi, Ket l, m“. Ihr Betragsquadrat ist die Wahrscheinlichkeitsdichte über die Richtungen. Das Labor zeichnet $|Y_l^m|^2$ als Abstand vom Ursprung, als Polardiagramm. Die Tafel geht diesen Weg für $|1,0\rangle$.`,
        reps:{obj:R`Der Zustand $|1,0\rangle$`,
          rows:[
            {k:'worte', text:R`Ein Drehimpuls mit $l = 1$, dessen $z$-Komponente sicher null ist.`},
            {k:'dirac', tex:R`|1,0\rangle:\qquad \hat L^2|1,0\rangle = 2\hbar^2|1,0\rangle,\quad \hat L_z|1,0\rangle = 0`},
            {k:'matrix', tex:R`|1,0\rangle \doteq \begin{pmatrix}0\\ 1\\ 0\end{pmatrix}\quad\text{in der Basis } |1,1\rangle, |1,0\rangle, |1,-1\rangle`},
            {k:'ort', tex:R`Y_1^0(\theta,\varphi) = \langle\theta,\varphi|1,0\rangle = \sqrt{\tfrac{3}{4\pi}}\,\cos\theta`},
            {k:'graph', plot:{x:[0, Math.PI], y:[0, 0.27], abs:true, yticks:[{y:0.239, lab:'0{,}239'}], xlab:R`\theta`, ylab:R`|Y_1^0|^2`, ticks:DREH_SK.T}, f:DREH_SK.Y10,
              cap:R`$|Y_1^0|^2 = \tfrac{3}{4\pi}\cos^2\theta$ über $\theta$: Maximum $0{,}239$ an den Polen, Nullstelle bei $\theta = \pi/2$.`},
            {k:'labor', text:R`Regler $l = 1$, $m = 0$: zwei Keulen entlang $z$, die sich im Ursprung berühren. Gedreht um die $z$-Achse entsteht die Hantel des $p_z$-Orbitals.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„$l = 1$“ und „$L_z$ sicher null“ werden die Quantenzahlen im Ket: $|l,m\rangle = |1,0\rangle$.`},
            {from:'dirac', to:'matrix', rule:R`Den Ket nach $|1,1\rangle, |1,0\rangle, |1,-1\rangle$ entwickeln. Er ist selbst der zweite Basisket, also $(0;\ 1;\ 0)$.`},
            {from:'matrix', to:'ort', rule:R`Jede Komponente mit ihrer Basisfunktion $Y_1^m$ multiplizieren und addieren: $0\cdot Y_1^1 + 1\cdot Y_1^0 + 0\cdot Y_1^{-1}$.`},
            {from:'ort', to:'graph', rule:R`Das Betragsquadrat bilden; $e^{im\varphi}$ fällt dabei heraus. Dann $|Y|^2$ über $\theta$ von $0$ bis $\pi$ auftragen.`},
            {from:'graph', to:'labor', rule:R`Den Wert bei $\theta$ als Abstand vom Ursprung antragen, in der Richtung, die den Winkel $\theta$ mit der $z$-Achse bildet. So wird aus der Kurve das Polardiagramm.`}
          ]},
        q:{q:R`Im Labor stehen die Regler auf $l = 1$, $m = 1$. Welche Funktion zeichnet das Polardiagramm?`, tr:{from:'labor', to:'ort'},
          opts:[R`$\tfrac{3}{8\pi}\sin^2\theta$`, R`$\tfrac{3}{4\pi}\cos^2\theta$`, R`$-\sqrt{\tfrac{3}{8\pi}}\,\sin\theta\cos\varphi$`], a:0,
          ex:R`Gezeichnet wird $|Y_1^1|^2 = \tfrac{3}{8\pi}\sin^2\theta$: ein Ring um die $z$-Achse. Phase $e^{i\varphi}$ und Vorzeichen fallen im Betragsquadrat heraus.`,
          fb:['', R`Das ist $|Y_1^0|^2$ zu $m = 0$, die Hantel entlang $z$.`,
            R`Das Labor zeichnet $|Y|^2$, nicht den Realteil von $Y$. $|Y_1^1|^2$ hängt nicht von $\varphi$ ab.`]}},
      {id:'dreh-t5g', title:R`Typischer Fehler: das $\sin\theta$ vergessen`,
        num:{title:'Die Oberfläche der Kugel', text:R`Richtig ist

$$\int_0^{2\pi}\!\!\int_0^\pi\sin\theta\,d\theta\,d\varphi = 2\pi\cdot2 = 4\pi \approx 12{,}6.$$

Ohne $\sin\theta$ kommt $2\pi\cdot\pi = 2\pi^2 \approx 19{,}7$ heraus. Für $Y_0^0$ ergäbe sich dann fälschlich $N = 1/\sqrt{2\pi^2}$.`},
        text:R`Wer beim Integrieren über die Kugel $\sin\theta$ vergisst, integriert falsch. Die Breitenkreise werden zu den Polen hin kürzer, und das Maß berücksichtigt das ([[lex:jacobi-determinante|Volumenelement]]). Ohne $\sin\theta$ zählst du einen schmalen Streifen am Pol so stark wie einen gleich breiten Streifen am Äquator. Die Folgen sind falsche Normierungen und falsche Wahrscheinlichkeiten. Ein schneller Test: $\int d\Omega$ muss $4\pi$ ergeben, die Oberfläche der Einheitskugel, und $\int|Y_l^m|^2\,d\Omega$ muss $1$ sein.`,
        q:{q:R`Mit welcher Wahrscheinlichkeit findest du ein Teilchen im Zustand $Y_0^0$ in der oberen Halbkugel, $0 \le \theta \le \pi/2$?`,
          opts:[R`$\tfrac12$`, R`$\tfrac{1}{4\pi}$`, R`$\tfrac{\pi}{4} \approx 0{,}79$`], a:0,
          ex:R`$\tfrac{1}{4\pi}\int_0^{2\pi}\!\int_0^{\pi/2}\sin\theta\,d\theta\,d\varphi = \tfrac{1}{4\pi}\cdot2\pi\cdot1 = \tfrac12$. Bei konstanter Dichte trägt die halbe Kugelfläche die halbe Wahrscheinlichkeit.`,
          fb:['', R`$\tfrac{1}{4\pi}$ ist die Dichte $|Y_0^0|^2$, keine Wahrscheinlichkeit. Integriere über die Halbkugel.`,
            R`Das käme ohne $\sin\theta$ heraus. Mit dem Maß ist $\int_0^{\pi/2}\sin\theta\,d\theta = 1$.`]}}
    ]},

    /* ===== Abschnitt 6: Bilder lesen, reelle Orbitale, Rotation ===== */
    {id:'dreh-t6', title:'Kugelflächenfunktionen lesen: Knoten, reelle Orbitale, Rotation', steps:[
      {id:'dreh-t6a', title:'Das Polardiagramm lesen',
        num:{title:R`$|Y_2^0|^2$ am Pol und am Äquator`, text:R`$|Y_2^0|^2 = \tfrac{5}{16\pi}(3\cos^2\theta - 1)^2$ hat die Werte

$$\theta = 0:\ \tfrac{5}{16\pi}\cdot4 \approx 0{,}398,\qquad \theta = \tfrac\pi2:\ \tfrac{5}{16\pi}\cdot1 \approx 0{,}099.$$

Am Pol ist der Wert viermal so groß wie am Äquator. Dazwischen liegt eine Nullstelle.`},
        text:R`Das Polardiagramm im Labor zeigt $|Y_l^m|^2$ als Abstand vom Ursprung. So übersetzt du zwischen Bild und Formel: Eine Richtung vom Ursprung aus hat den Polarwinkel $\theta$ zur $z$-Achse. Der Abstand der Kurve vom Ursprung in dieser Richtung ist der Wert von $|Y_l^m(\theta)|^2$, auf das Maximum skaliert. Weil $|e^{im\varphi}|^2 = 1$ ist, hängt das Bild nicht von $\varphi$ ab. Die räumliche Form entsteht durch Drehen um die $z$-Achse. Für $m = 0$ liegt die Wahrscheinlichkeit vor allem an den Polen, für $|m| = l$ als Ring um den Äquator.`,
        fig:{lab:'ylm', init:{l:2, m:0}, caption:R`$|Y_l^m|^2$ als Abstand vom Ursprung in der $x$-$z$-Ebene. Bei $l = 2$, $m = 0$: lange Keulen entlang $z$ (Wert $0{,}398$), kleine Keulen am Äquator ($0{,}099$), dazwischen zwei Knotenkegel.`},
        q:{q:R`Im Polardiagramm zu $l = 2$, $m = 2$ liegt die Kurve um die $x$-Achse herum, auf der $z$-Achse ist sie null. Welche Formel passt?`, tr:{from:'labor', to:'formel'},
          opts:[R`$|Y_2^2|^2 \propto \cos^4\theta$`, R`$|Y_2^2|^2 \propto \sin^2\theta\cos^2\theta$`, R`$|Y_2^2|^2 \propto \sin^4\theta$`], a:2,
          ex:R`$\sin^4\theta$ ist null bei $\theta = 0$ und $\pi$ und am größten bei $\theta = \pi/2$, also am Äquator.`,
          fb:[R`$\cos^4\theta$ wäre an den Polen am größten, also entlang $z$.`,
            R`$\sin^2\theta\cos^2\theta$ gehört zu $m = \pm1$: Keulen unter $45°$, null am Äquator.`, '']}},
      {id:'dreh-t6b', title:R`Knoten in $\theta$ und Parität`,
        num:{title:R`Die Knoten von $Y_2^0$`, text:R`Aus $3\cos^2\theta - 1 = 0$ folgt $\cos\theta = \pm\tfrac{1}{\sqrt3}$, also

$$\theta \approx 54{,}7°\quad\text{und}\quad\theta \approx 125{,}3°.$$

Das sind zwei Knotenkegel, passend zu $l - |m| = 2 - 0 = 2$.`},
        text:R`In $\theta$ hat $Y_l^m$ genau $l - |m|$ Knoten. Es sind Kegel um die $z$-Achse; bei ungeradem $l - |m|$ ist die Ebene $\theta = \pi/2$ dabei. Die Zahl der Knoten wächst mit $l$ bei festem $m$, und sie sinkt, wenn $|m|$ bei festem $l$ wächst. Unter der Spiegelung $\vec r \to -\vec r$, also $\theta \to \pi - \theta$ und $\varphi \to \varphi + \pi$, ändert sich $Y_l^m$ um den Faktor $(-1)^l$. Diese Parität wird bei den Auswahlregeln für Licht wichtig (Ausblick: Thema 9).`,
        q:{q:R`Wie viele Knotenkegel, also Flächen mit konstantem $\theta$, hat $Y_4^2$?`,
          opts:[R`$4$`, R`$2$`, R`$6$`], a:1,
          ex:R`$l - |m| = 4 - 2 = 2$.`,
          fb:[R`$l = 4$ ist die Knotenzahl nur für $m = 0$. Bei $|m| = 2$ sind es $l - |m|$.`, '',
            R`$l + |m| = 6$ ist keine Knotenzahl. Die Knoten werden mit wachsendem $|m|$ weniger.`]}},
      {id:'dreh-t6c', title:R`Reelle Orbitale: $p_x$ und $p_y$`,
        num:{title:R`$p_x$ aus $Y_1^{\pm1}$`, text:R`Mit $Y_1^{\pm1} = \mp\sqrt{\tfrac{3}{8\pi}}\sin\theta\,e^{\pm i\varphi}$ ist

$$Y_1^{-1} - Y_1^1 = \sqrt{\tfrac{3}{8\pi}}\sin\theta\left(e^{-i\varphi} + e^{i\varphi}\right) = 2\sqrt{\tfrac{3}{8\pi}}\sin\theta\cos\varphi.$$

Durch $\sqrt2$ geteilt ergibt das das normierte $p_x = \sqrt{\tfrac{3}{4\pi}}\sin\theta\cos\varphi$.`},
        text:R`Die Orbitale $p_x$ und $p_y$ aus der Chemie sind keine $Y_l^m$, sondern Überlagerungen mit gleichen Gewichten. Nur $p_z \propto \cos\theta \propto Y_1^0$ ist selbst eine Kugelflächenfunktion. Alle drei sind Eigenfunktionen von $\hat L^2$ zu $2\hbar^2$. $p_x$ und $p_y$ sind aber keine Eigenfunktionen von $\hat L_z$ – genau das Gegenbeispiel aus Abschnitt 2. Die reellen Orbitale sind bequem für Bindungen, die komplexen $Y_l^m$ für Rechnungen mit $\hat L_z$ und Magnetfeldern. Beide Basen spannen denselben Raum zu $l = 1$ auf.`,
        reps:{obj:R`Das Orbital $p_x$`,
          rows:[
            {k:'worte', text:R`Eine Hantel entlang der $x$-Achse: eine Überlagerung von $m = +1$ und $m = -1$ mit gleichen Gewichten.`},
            {k:'dirac', tex:R`|p_x\rangle = \tfrac{1}{\sqrt2}\left(|1,-1\rangle - |1,1\rangle\right)`},
            {k:'matrix', tex:R`|p_x\rangle \doteq \frac{1}{\sqrt2}\begin{pmatrix}-1\\ 0\\ 1\end{pmatrix}\quad\text{in der Basis } |1,1\rangle, |1,0\rangle, |1,-1\rangle`},
            {k:'ort', tex:R`p_x(\theta,\varphi) = \sqrt{\tfrac{3}{4\pi}}\,\sin\theta\cos\varphi = \sqrt{\tfrac{3}{4\pi}}\,\frac{x}{r}`},
            {k:'physik', text:R`$L^2 = 2\hbar^2$ ist scharf. $L_z$ ergibt $+\hbar$ oder $-\hbar$, je mit $\tfrac12$. Der Mittelwert ist $0$, aber $0$ kommt als Einzelwert nie vor.`}
          ],
          links:[
            {from:'worte', to:'dirac', rule:R`„Gleiche Gewichte von $m = \pm1$“ heißt Vorfaktoren vom Betrag $\tfrac{1}{\sqrt2}$. Das Minuszeichen gleicht das Vorzeichen $\mp$ in $Y_1^{\pm1}$ aus.`},
            {from:'dirac', to:'matrix', rule:R`Die Vorfaktoren in der Reihenfolge der Basis eintragen: oben $|1,1\rangle$, unten $|1,-1\rangle$.`},
            {from:'matrix', to:'ort', rule:R`Komponenten mit $Y_1^1, Y_1^0, Y_1^{-1}$ multiplizieren und addieren; $e^{i\varphi} + e^{-i\varphi} = 2\cos\varphi$ macht die Funktion reell.`},
            {from:'matrix', to:'physik', rule:R`Für $L_z$ die Betragsquadrate der Einträge nehmen: $\tfrac12, 0, \tfrac12$ für $m = 1, 0, -1$.`},
            {from:'ort', to:'physik', rule:R`An der Funktion siehst du $L^2$: $\sin\theta\cos\varphi$ gehört zu $l = 1$. Für $L_z$ zerlege $\cos\varphi$ in $e^{\pm i\varphi}$; die beiden Anteile sind die beiden Messwerte.`}
          ]},
        q:{q:R`Welcher Ket gehört zu $p_y = \sqrt{\tfrac{3}{4\pi}}\sin\theta\sin\varphi$?`, tr:{from:'ort', to:'dirac'},
          opts:[R`$\tfrac{1}{\sqrt2}\left(|1,1\rangle + |1,0\rangle\right)$`, R`$\tfrac{i}{\sqrt2}\left(|1,-1\rangle - |1,1\rangle\right)$`, R`$\tfrac{i}{\sqrt2}\left(|1,-1\rangle + |1,1\rangle\right)$`, R`$\tfrac{1}{\sqrt2}\left(|1,-1\rangle - |1,1\rangle\right)$`], a:2,
          ex:R`$Y_1^{-1} + Y_1^1 = \sqrt{\tfrac{3}{8\pi}}\sin\theta\left(e^{-i\varphi} - e^{i\varphi}\right) = -2i\sqrt{\tfrac{3}{8\pi}}\sin\theta\sin\varphi$. Das Plus wird wegen des Vorzeichens in $Y_1^1$ zur Differenz der Exponentialfunktionen, also zu $\sin\varphi$. Der Faktor $\tfrac{i}{\sqrt2}$ macht daraus die reelle, normierte Funktion $p_y$.`,
          fb:[R`$|1,0\rangle$ ist $p_z$. Die Funktion $\sin\theta\sin\varphi$ enthält nur $m = \pm1$.`,
            R`Das ist $i\,p_x$: Mit dem Minus addieren sich $e^{-i\varphi}$ und $e^{i\varphi}$ zu $2\cos\varphi$, wegen des Vorzeichens in $Y_1^1$. Für $\sin\varphi$ braucht es das Plus.`,
            '',
            R`Das ist $p_x$: $e^{i\varphi} + e^{-i\varphi}$ gibt $\cos\varphi$, nicht $\sin\varphi$.`]}},
      {id:'dreh-t6d', title:'Typischer Fehler: Keulen als Bahn oder als zwei Orte',
        num:{title:R`Die zwei Keulen von $p_z$`, text:R`In $|Y_1^0|^2 = \tfrac{3}{4\pi}\cos^2\theta$ liegt die Hälfte der Wahrscheinlichkeit in der oberen Halbkugel:

$$2\pi\int_0^{\pi/2}\tfrac{3}{4\pi}\cos^2\theta\,\sin\theta\,d\theta = \tfrac32\cdot\tfrac13 = \tfrac12.$$

Diese Verteilung ist zu jeder Zeit dieselbe, denn $|1,0\rangle$ ist stationär.`},
        text:R`Zwei Fehler beim Lesen der Bilder sind häufig. Erstens hält man das Polardiagramm von $|Y|^2$ für eine Bahn, auf der das Elektron läuft. Zweitens hält man die beiden Keulen von $p_z$ für zwei getrennte Aufenthaltsorte, zwischen denen das Elektron hin- und herspringt. $|Y|^2$ ist eine Wahrscheinlichkeitsdichte über die Richtungen. Sie sagt, wie oft du bei vielen Messungen an gleich präparierten Atomen welche Richtung findest. Der Zustand ist stationär; es gibt keine Bewegung von Keule zu Keule. Und $|Y|^2$ beschreibt nur die Richtung, nicht den Abstand vom Kern.`,
        q:{q:R`Ein Atom ist im Zustand $p_z$. Was beschreibt das Polardiagramm von $|Y_1^0|^2$?`,
          opts:[R`die Bahn, auf der das Elektron um den Kern läuft`, R`wie häufig bei Ortsmessungen welche Richtung vorkommt`, R`zwei Orte, zwischen denen das Elektron periodisch wechselt`], a:1,
          ex:R`$|Y_1^0|^2$ ist eine Dichte über die Richtungen und zeitlich konstant. Bei vielen Ortsmessungen an gleich präparierten Atomen findest du Richtungen nahe der $z$-Achse am häufigsten.`,
          fb:[R`Ein stationärer Zustand hat keine Bahn. Das Diagramm zeigt eine Wahrscheinlichkeitsdichte, keine Kurve, die durchlaufen wird.`, '',
            R`$|1,0\rangle$ ist stationär; die Dichte ändert sich nicht mit der Zeit. Es gibt kein Hin und Her.`]}},
      {id:'dreh-t6e', title:'Rotierende Moleküle',
        num:{title:'Kohlenmonoxid', text:R`Für CO ist $\hbar^2/(2I) = h\cdot57{,}636\,\mathrm{GHz}$. Der Übergang $l = 1 \to 0$ hat

$$\begin{gathered}\Delta E = \frac{\hbar^2}{2I}\,(1\cdot2 - 0) = h\cdot115{,}27\,\mathrm{GHz},\\ \lambda = \frac{c}{115{,}27\,\mathrm{GHz}} \approx 2{,}6\,\mathrm{mm}.\end{gathered}$$

Mit dieser Linie kartieren Radioastronomen kalte Gaswolken in der Milchstraße.`},
        text:R`Ein zweiatomiges Molekül mit dem Trägheitsmoment $I$ hat die Rotationsenergie $\hat L^2/(2I)$. Seine Niveaus sind

$$E_l = \frac{\hbar^2}{2I}\,l(l+1),\qquad l = 0, 1, 2, \dots,$$

jeweils $(2l+1)$-fach entartet. Absorption und Emission von Strahlung gibt es nur mit $\Delta l = \pm1$ und nur bei Molekülen mit Dipolmoment. Der Übergang $l \to l - 1$ hat die Energie $\hbar^2l/I$. Benachbarte Linien haben also den festen Abstand $\hbar^2/I$. Daraus bestimmt man $I$ und damit die Bindungslänge, für CO etwa $113\,\mathrm{pm}$.`,
        q:{q:R`Bei welcher Frequenz liegt für CO der Übergang $l = 2 \to 1$?`,
          opts:[R`$172{,}91\,\mathrm{GHz}$`, R`$230{,}54\,\mathrm{GHz}$`, R`$345{,}82\,\mathrm{GHz}$`], a:1,
          ex:R`$\Delta E = \tfrac{\hbar^2}{2I}(2\cdot3 - 1\cdot2) = 4\cdot h\cdot57{,}636\,\mathrm{GHz} = h\cdot230{,}54\,\mathrm{GHz}$: das Doppelte der Linie $1 \to 0$.`,
          fb:[R`Das wäre mit $l^2$ statt $l(l+1)$ gerechnet: $4 - 1 = 3$. Die Niveaus wachsen wie $l(l+1)$.`, '',
            R`$6\cdot57{,}636\,\mathrm{GHz}$ gehört zu $E_2$ selbst. Die Linie ist die Differenz $E_2 - E_1$.`]}}
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
    map:[
      {sym:'l', ctl:'l', says:R`Bahndrehimpulsquantenzahl $l = 0, \dots, 4$. Die Anzeige nennt $L^2 = \hbar^2l(l+1)$. Mit $l$ wächst bei festem $m$ die Zahl der Knoten in $\theta$.`},
      {sym:'m', ctl:'m', says:R`Magnetquantenzahl von $-l$ bis $l$, die Anzeige nennt $L_z = m\hbar$. Großes $|m|$ schiebt die Wahrscheinlichkeit zum Äquator, $m = 0$ zu den Polen. $m$ und $-m$ geben dasselbe Bild, weil $|Y_l^{-m}|^2 = |Y_l^m|^2$.`},
      {sym:R`|Y_l^m(\theta,\varphi)|^2`, ctl:'hängt nicht von φ ab', says:R`Die gezeichnete Kurve: Ihr Abstand vom Ursprung in der Richtung mit Polarwinkel $\theta$ ist $|Y_l^m(\theta)|^2$, auf das Maximum skaliert. Der Faktor $e^{im\varphi}$ fällt im Betragsquadrat heraus.`},
      {sym:R`\varphi`, ctl:'rotationssymmetrisch um z', says:R`Gezeichnet ist nur der Schnitt in der $x$-$z$-Ebene. Weil $|Y_l^m|^2$ nicht von $\varphi$ abhängt, entsteht die räumliche Form durch Drehen dieses Schnitts um die $z$-Achse.`},
      {sym:R`l - |m|`, ctl:'Knotenflächen in θ', says:R`Zahl der Knotenkegel $\theta = \text{konst.}$; bei ungeradem $l - |m|$ gehört die Ebene $\theta = \pi/2$ dazu. In der Kurve sind es die Richtungen, in denen sie den Ursprung berührt.`}
    ],
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
})();
