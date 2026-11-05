/* ===== Mathe M1: Komplexe Zahlen und Funktionen ===== */
topic({
  id:'m-komplex', ch:'math', title:'Komplexe Zahlen und Funktionen', short:'Komplexe Zahlen',
  src:'Boas Kap. 2',
  goals:[
    'Ich kann mit komplexen Zahlen in kartesischer Form und in Polarform rechnen: $z^*$, $|z|^2$, Division, Phase.',
    'Ich kann die Euler-Formel anwenden: Potenzen, Wurzeln, $\\cos$ und $\\sin$ durch $e^{\\pm i\\varphi}$ ausdrücken.',
    'Ich kann Betragsquadrate von Summen wie $|z_1 + z_2|^2$ berechnen und den Interferenzterm deuten.'
  ],
  needs:'Rechnen mit Termen und Brüchen · Sinus und Kosinus am Einheitskreis · Ableitung der Exponentialfunktion',
  check:[
    {q:'$i^2$ ist gleich …', opts:['$-1$', '$1$', '$i$'], a:0, ex:'Das ist die Definition der imaginären Einheit: $i^2 = -1$.', lex:'komplexe-zahlen'},
    {q:'Der Punkt $(\\cos\\varphi, \\sin\\varphi)$ liegt für jedes reelle $\\varphi$ …', opts:['auf dem Kreis mit Radius 1 um den Ursprung', 'auf der Geraden $y = x$', 'je nach $\\varphi$ innerhalb oder außerhalb des Einheitskreises'], a:0, ex:'$\\cos^2\\varphi + \\sin^2\\varphi = 1$. Genau deshalb liegt $e^{i\\varphi}$ auf dem Einheitskreis.', lex:'polarform'},
    {q:'$\\frac{d}{dx}e^{ax}$ ist für eine Konstante $a$ …', opts:['$a\\,e^{ax}$', '$e^{ax}$', '$x\\,e^{ax - 1}$'], a:0, ex:'Kettenregel. Das gilt auch für komplexes $a$, zum Beispiel $\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$.', lex:'euler'},
    {q:'$(a + b)^2$ ist …', opts:['$a^2 + 2ab + b^2$', '$a^2 + b^2$', '$a^2 - b^2$'], a:0, ex:'Der Mischterm $2ab$ ist wichtig. Bei komplexen Zahlen wird aus ihm der Interferenzterm $2\\operatorname{Re}(z_1^*z_2)$.', lex:'interferenzterm'}
  ],
  example:{
    title:'Potenz in Polarform',
    text:'Berechne $(1 + i\\sqrt3)^6$. Sechsmal ausmultiplizieren wäre mühsam – in Polarform geht es schnell.',
    ctx:CTX.line({}),
    lines:[
      {l:'1 + i sqrt(3) = 2 e^(iπ/3)', w:'r = √(1 + 3) = 2, cos φ = 1/2, sin φ = √3/2', why:{q:'Wie findet man $r$ und $\\varphi$?', opts:['$r = \\sqrt{a^2 + b^2}$; $\\varphi$ so, dass $\\cos\\varphi = a/r$ und $\\sin\\varphi = b/r$', '$r = a + b$, $\\varphi = b/a$', '$r = a^2 + b^2$, $\\varphi = \\pi$'], a:0, ex:'Hier ist $r = 2$, $\\cos\\varphi = 1/2$, $\\sin\\varphi = \\sqrt3/2$, also $\\varphi = \\pi/3$ (erster Quadrant).'}},
      {l:'(1 + i sqrt(3))^6 = 2^6 e^(6iπ/3)', why:{q:'Welche Regel steckt in diesem Schritt?', opts:['$(re^{i\\varphi})^n = r^n e^{in\\varphi}$: Betrag potenzieren, Phase vervielfachen', '$(a + b)^6 = a^6 + b^6$', 'Man darf nur den Betrag potenzieren.'], a:0, ex:'Für ganzzahliges $n$ gilt $(e^{i\\varphi})^n = e^{in\\varphi}$: $n$-mal multiplizieren, die Phasen addieren sich. Für nicht ganzzahlige Exponenten gilt das nicht ohne Weiteres.'}},
      {l:'= 64 e^(2πi)', why:{q:'Was ist $6\\cdot\\pi/3$?', opts:['$2\\pi$', '$\\pi/2$', '$18\\pi$'], a:0, ex:'$6\\pi/3 = 2\\pi$: eine volle Umdrehung.'}},
      {l:'= 64', why:{q:'Warum ist $e^{2\\pi i} = 1$?', opts:['$\\cos 2\\pi + i\\sin 2\\pi = 1 + 0$', 'weil $e^0 = 1$ und $2\\pi i = 0$', 'weil der Betrag 1 ist'], a:0, ex:'Euler-Formel. Der Betrag allein reicht nicht – auch $-1$ hat Betrag 1.'}}
    ],
    faded:{id:'mk-fade', title:'Jetzt du: $(1 - i)^8$',
      text:'Benutze die Polarform $1 - i = \\sqrt2\\,e^{-i\\pi/4}$ und berechne $(1 - i)^8$.',
      ctx:CTX.line({}),
      given:['1 - i = sqrt(2) e^(-iπ/4)'],
      goals:[{id:'a', prompt:'Berechne $(1 - i)^8$.', type:'value', target:'16', points:2, hints:['$(\\sqrt2)^8 = 2^4$.', '$8\\cdot(-\\pi/4) = -2\\pi$, und $e^{-2\\pi i} = 1$.'],
        model:['1 - i = sqrt(2) e^(-iπ/4)', {l:'(1 - i)^8 = sqrt(2)^8 e^(-8iπ/4)', gap:'(1 - i)^8 = ▢ e^(-8iπ/4)'}, '= 16 e^(-2πi)', '= 16'],
        mistakes:[{expr:'256', msg:'$(\\sqrt2)^8 = 2^{8/2} = 2^4 = 16$, nicht $2^8$.'}, {expr:'-16', msg:'Prüfe die Phase: $8\\cdot(-\\pi/4) = -2\\pi$, und $e^{-2\\pi i} = +1$.'}]}]}
  },
  puzzle:{
    title:'Zwei Wellen, gleich stark',
    text:'Zwei komplexe Amplituden haben beide den Betrag 1: $z_1 = 1$ und $z_2 = e^{i\\varphi}$. Einzeln ist $|z_1|^2 = |z_2|^2 = 1$.\n\nWelche Werte kann $|z_1 + z_2|^2$ annehmen, wenn man $\\varphi$ verändert?',
    q:{q:'Deine Vermutung:', opts:['immer $2$', 'alles zwischen $0$ und $4$', 'immer $4$', 'alles zwischen $1$ und $2$'], a:1, ex:'$|1 + e^{i\\varphi}|^2 = 2 + 2\\cos\\varphi$ liegt zwischen $0$ und $4$.'},
    reveal:'Ausrechnen mit $|z|^2 = z^*z$:\n\n$$|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\\operatorname{Re}(z_1^*z_2) = 2 + 2\\cos\\varphi.$$\n\nBei $\\varphi = 0$ ist $|z_1 + z_2|^2 = 4$ (konstruktive Interferenz), bei $\\varphi = \\pi$ ist es $0$ (destruktive Interferenz). Der Mischterm $2\\operatorname{Re}(z_1^*z_2)$ heißt **Interferenzterm**.\n\nIn der Quantenmechanik addiert man Amplituden, nicht Wahrscheinlichkeiten. Genau dieser Term erzeugt das Streifenmuster beim Doppelspalt – und er hängt nur von der **relativen** Phase ab.'
  },
  clarify:{
    core:'Eine komplexe Zahl ist $z = a + ib$ mit reellem Realteil $a = \\operatorname{Re}z$ und Imaginärteil $b = \\operatorname{Im}z$. Konjugieren heißt $i \\to -i$: $z^* = a - ib$. Das **Betragsquadrat** ist reell und nicht negativ:\n\n$$|z|^2 = z^*z = a^2 + b^2.$$\n\nIn **Polarform** ist $z = re^{i\\varphi}$ mit $r = |z|$ und der Phase $\\varphi = \\arg z$. Die Phase ist nur bis auf Vielfache von $2\\pi$ bestimmt; üblich ist der Hauptwert $-\\pi < \\varphi \\le \\pi$. Die Euler-Formel $e^{i\\varphi} = \\cos\\varphi + i\\sin\\varphi$ verbindet beide Formen. Beim Multiplizieren multiplizieren sich die Beträge und addieren sich die Phasen; daraus folgt $(re^{i\\varphi})^n = r^ne^{in\\varphi}$.\n\nUmgekehrt: $\\cos\\varphi = \\tfrac12(e^{i\\varphi} + e^{-i\\varphi})$, $\\sin\\varphi = \\tfrac{1}{2i}(e^{i\\varphi} - e^{-i\\varphi})$. Für reelle $k, x$ gilt $|e^{ikx}| = 1$ und $\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$. Für Summen: $|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\\operatorname{Re}(z_1^*z_2)$.',
    keys:[
      'Konjugieren heißt überall $i \\to -i$ ersetzen, auch im Exponenten: $(e^{ikx})^* = e^{-ikx}$ für reelle $k$, $x$. Es gilt $(z_1z_2)^* = z_1^*z_2^*$.',
      'Division: mit dem Konjugierten des Nenners erweitern, dann ist der Nenner reell: $\\frac{1}{a + ib} = \\frac{a - ib}{a^2 + b^2}$.',
      'Multiplizieren und Potenzieren gehen in Polarform am schnellsten; Addieren in kartesischer Form.',
      'Die Phase nicht blind mit $\\arctan(b/a)$ bestimmen – erst den Quadranten prüfen. $-1 - i$ hat die Phase $-3\\pi/4$ (Hauptwert, $-\\pi < \\varphi \\le \\pi$), nicht $\\pi/4$.',
      'Eine Zahl $z \\neq 0$ hat genau $n$ verschiedene $n$-te Wurzeln: $r^{1/n}e^{i(\\varphi + 2\\pi k)/n}$ mit $k = 0, \\dots, n - 1$.'
    ],
    errors:[
      '$|z|^2 = z^2$ rechnen. Für $z = 1 + i$ ist $z^2 = 2i$, aber $|z|^2 = 2$.',
      '$|a + ib| = a + b$ statt $\\sqrt{a^2 + b^2}$.',
      'Beim Konjugieren das $i$ im Exponenten vergessen: $(e^{i\\varphi})^* = e^{-i\\varphi}$, nicht $e^{i\\varphi}$.',
      '$|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2$ setzen und so den Interferenzterm verlieren.'
    ],
    more:[{title:'Warum braucht die Quantenmechanik komplexe Zahlen?', text:'Die Schrödingergleichung $i\\hbar\\,\\partial_t\\psi = \\hat H\\psi$ enthält $i$. Ein stationärer Zustand trägt den Phasenfaktor $e^{-iEt/\\hbar}$, der $|\\psi|^2$ nicht ändert (Thema 2). Messbar sind Betragsquadrate. Phasen**unterschiede** werden trotzdem sichtbar, nämlich im Interferenzterm einer Überlagerung.'}],
    checks:[
      {q:'$(3 - 2i)^*\\,(3 - 2i)$ ist …', opts:['$13$', '$5 - 12i$', '$5$'], a:0, ex:'$(3 + 2i)(3 - 2i) = 9 + 4 = 13$. Das ist $|3 - 2i|^2$. Dagegen ist $(3 - 2i)^2 = 5 - 12i$.'},
      {q:'Welche Polarform hat $z = -2$?', opts:['$2e^{i\\pi}$', '$2e^{i\\pi/2}$', '$2e^{-i\\pi/2}$'], a:0, ex:'Betrag $r = 2$, Richtung entlang der negativen reellen Achse: $\\varphi = \\pi$. $2e^{\\pm i\\pi/2} = \\pm 2i$.'}
    ]
  },
  lab:{type:'complex', title:'Komplexe Zahl in der Ebene',
    text:'Der eine Pfeil ist $z = re^{i\\varphi}$, der andere sein Spiegelbild $z^*$ an der reellen Achse. Verändere Betrag $r$ und Phase $\\varphi$ und beobachte die Anzeige.',
    questions:[
      {q:'Stelle $r = 1$ und $\\varphi \\approx 1{,}57$ ($\\pi/2$) ein. Welche Zahl ist das?', opts:['$i$', '$-1$', '$1$'], a:0, ex:'$e^{i\\pi/2} = \\cos\\frac\\pi2 + i\\sin\\frac\\pi2 = i$.'},
      {q:'Was macht der Pfeil $z^*$, wenn du $\\varphi$ vergrößerst?', opts:['Er dreht sich in die Gegenrichtung: $\\arg z^* = -\\varphi$.', 'Er dreht sich mit $z$ mit.', 'Er wird länger.'], a:0, ex:'$z^* = re^{-i\\varphi}$: gleicher Betrag, entgegengesetzte Phase.'}
    ],
    noPic:{q:'Ohne Bild: Was ist $|e^{-i\\omega t}(3 + 4i)|^2$ für reelle $\\omega, t$?', opts:['$25$', '$25\\cos^2\\omega t$', '$7$'], a:0, ex:'$|e^{-i\\omega t}|^2 = 1$ und $|3 + 4i|^2 = 9 + 16 = 25$.'}},
  compare:{
    text:'Gesucht ist $\\left|\\frac{2 + i}{1 - i}\\right|^2$. Zwei richtige Wege:',
    ctx:CTX.line({}),
    A:{name:'Erst dividieren', model:['(2 + i)/(1 - i) = (2 + i)(1 + i)/((1 - i)(1 + i))', '= (1 + 3i)/2', '|(2 + i)/(1 - i)|^2 = (1 + 9)/4', '= 5/2']},
    B:{name:'Beträge getrennt', text:'Es gilt $|z_1/z_2| = |z_1|/|z_2|$.', model:['|(2 + i)/(1 - i)|^2 = |2 + i|^2/|1 - i|^2', '= 5/2']},
    questions:[
      {q:'Welcher Weg ist kürzer, wenn nur der Betrag gefragt ist?', opts:['Weg B', 'Weg A', 'Beide sind gleich lang.'], a:0, ex:'Beträge darf man getrennt bilden: $|2 + i|^2 = 5$, $|1 - i|^2 = 2$.'},
      {q:'Was liefert Weg A zusätzlich?', opts:['Real- und Imaginärteil, also auch die Phase des Quotienten', 'nichts', 'den Betrag ohne Quadrat'], a:0, ex:'Aus $(1 + 3i)/2$ liest man Lage und Phase in der Ebene ab. Weg B kennt nur den Betrag.'}
    ]
  },
  practice:[
    {id:'mk-p1', title:'Rechnen mit komplexen Zahlen',
      text:'Gegeben ist $z = (2 + 3i)\\,e^{i\\omega t}$ mit reellen $\\omega, t$.',
      ctx:CTX.line({params:{ω:'pos', t:'pos', m:'pos'}, defs:{'z':'(2 + 3i) e^(i ω t)'}}),
      goals:[
        {id:'a', prompt:'a) Berechne $|z|^2$.', type:'value', target:'13', points:2, ph:'|z|^2 = z^* z', hints:['$|z|^2 = z^*z$; konjugiere jeden Faktor einzeln.', '$(2 - 3i)(2 + 3i) = 4 + 9$, und $e^{-i\\omega t}e^{i\\omega t} = 1$.'],
          model:['|z|^2 = z^* z', '= (2 - 3i)(2 + 3i) e^(-iωt) e^(iωt)', '= 4 + 9', '= 13'],
          mistakes:[{expr:'sqrt(13)', msg:'Das ist der Betrag $|z|$. Gefragt ist das Betragsquadrat $|z|^2$.'}, {expr:'(-5 + 12i) e^(2iωt)', msg:'Das ist $z^2$. Für $|z|^2$ braucht man $z^*z$, nicht $z\\cdot z$.'}, {expr:'-5 + 12i', msg:'Das ist $(2 + 3i)^2$. Für $|z|^2$ braucht man $z^*z$.'}]},
        {id:'b', prompt:'b) Schreibe $\\dfrac{1}{1 + i}$ in der Form $a + ib$.', type:'value', target:'1/2 - i/2', points:2, ph:'1/(1 + i) = (1 - i)/((1 + i)(1 - i))', hints:['Erweitere mit dem Konjugierten des Nenners.', '$(1 + i)(1 - i) = 1 + 1 = 2$.'],
          model:['1/(1 + i) = (1 - i)/((1 + i)(1 - i))', '= (1 - i)/2', '= 1/2 - i/2']},
        {id:'c', prompt:'c) Schreibe $w = \\dfrac{1 + 2i}{3 - i}$ in der Form $a + ib$.', type:'value', target:'1/10 + 7i/10', points:2, ph:'w = (1 + 2i)(3 + i)/((3 - i)(3 + i))', hints:['Erweitere mit $3 + i$.', 'Zähler: $(1 + 2i)(3 + i) = 3 + i + 6i + 2i^2$.'],
          model:['w = (1 + 2i)(3 + i)/((3 - i)(3 + i))', '= (3 + 7i - 2)/10', '= 1/10 + 7i/10'],
          mistakes:[{expr:'(1 + 7i)/8', msg:'Prüfe den Nenner: $(3 - i)(3 + i) = 9 - i^2 = 10$.'}]}
      ]},
    {id:'mk-p2', title:'Euler-Formel',
      text:'Für reelles $\\theta$ gilt $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$.',
      ctx:CTX.line({params:{θ:'real', m:'pos'}}),
      goals:[
        {id:'a', prompt:'a) Zeige: $\\dfrac{e^{i\\theta} + e^{-i\\theta}}{2} = \\cos\\theta$.', type:'show', from:'(e^(iθ) + e^(-iθ))/2', to:'cos(θ)', points:2, hints:['Setze für beide Exponentialfunktionen die Euler-Formel ein; $\\cos(-\\theta) = \\cos\\theta$ und $\\sin(-\\theta) = -\\sin\\theta$.'],
          model:['(e^(iθ) + e^(-iθ))/2 = (cos θ + i sin θ + cos θ - i sin θ)/2', '= cos θ']},
        {id:'b', prompt:'b) Berechne $\\left(e^{i\\pi/3}\\right)^6$.', type:'value', target:'1', points:2, hints:['$(e^{a})^n = e^{na}$.', '$6\\cdot\\pi/3 = 2\\pi$.'],
          model:['(e^(iπ/3))^6 = e^(6iπ/3)', '= e^(2πi)', '= 1'],
          mistakes:[{expr:'-1', msg:'$e^{2\\pi i} = \\cos 2\\pi + i\\sin 2\\pi = +1$. $-1$ ist dagegen $e^{i\\pi}$.'}]},
        {id:'c', prompt:'c) Zeige mit der Euler-Formel: $\\cos^2\\theta = \\tfrac12(1 + \\cos 2\\theta)$.', type:'show', from:'cos(θ)^2', to:'(1 + cos(2θ))/2', points:3, hints:['Setze $\\cos\\theta = \\tfrac12(e^{i\\theta} + e^{-i\\theta})$ ein und quadriere.', 'Der Mischterm ist $2e^{i\\theta}e^{-i\\theta} = 2$.'],
          model:['cos(θ)^2 = ((e^(iθ) + e^(-iθ))/2)^2', '= (e^(2iθ) + 2 + e^(-2iθ))/4', '= (1 + cos(2θ))/2'],
          note:'Diese Formel brauchst du ständig für $\\int\\sin^2$ und $\\int\\cos^2$, zum Beispiel beim Normieren im Kasten (Thema 3).'}
      ]},
    {id:'mk-p3', title:'Die richtige Phase',
      text:'Gegeben ist $z = -1 - i$. Gesucht ist die Phase $\\varphi = \\arg z$ im Bereich $-\\pi < \\varphi \\le \\pi$.',
      ctx:{coords:['x'], params:{}, defs:{'z':'-1 - i'}},
      goals:[
        {id:'a', prompt:'Bestimme $\\varphi$.', type:'value', target:'-3π/4', points:2, ph:'|z| = sqrt(2)', hints:['Zeichne $z$: Real- und Imaginärteil sind negativ, $z$ liegt im dritten Quadranten.', 'Die Richtung bildet $45°$ mit der negativen reellen Achse: $\\varphi = -\\pi + \\pi/4$.'],
          model:['|z| = sqrt(2)', 'φ = -π + π/4', '= -3π/4'],
          mistakes:[{expr:'π/4', msg:'$\\arctan(b/a) = \\arctan 1 = \\pi/4$ zeigt in den ersten Quadranten. $z = -1 - i$ liegt aber im dritten.'}, {expr:'5π/4', msg:'Das ist dieselbe Richtung, liegt aber nicht im Bereich $(-\\pi, \\pi]$. Ziehe $2\\pi$ ab.'}, {expr:'3π/4', msg:'Das wäre die Richtung von $-1 + i$. Hier ist auch der Imaginärteil negativ.'}]}
      ]},
    {id:'mk-p4', title:'Komplexe Funktionen',
      text:'$k$ und $x$ sind reell. $A$ und $B$ sind reelle Konstanten.',
      ctx:{coords:['x'], params:{A:'real', B:'real', k:'real'}},
      goals:[
        {id:'a', prompt:'a) Zeige mit der Euler-Formel: $\\frac{d}{dx}e^{ikx} = ik\\,e^{ikx}$.', type:'show', from:'d/dx e^(ikx)', to:'ik e^(ikx)', points:2, hints:['Schreibe $e^{ikx} = \\cos kx + i\\sin kx$ und leite Real- und Imaginärteil ab.', 'Klammere am Ende $ik$ aus: $-k\\sin kx + ik\\cos kx = ik(\\cos kx + i\\sin kx)$.'],
          model:['d/dx e^(ikx) = d/dx (cos(kx) + i sin(kx))', '= -k sin(kx) + ik cos(kx)', '= ik (cos(kx) + i sin(kx))', '= ik e^(ikx)']},
        {id:'b', prompt:'b) Berechne $|A\\,e^{ikx} + B\\,e^{-ikx}|^2$.', type:'value', target:'A^2 + B^2 + 2 A B cos(2kx)', points:3, ph:'|A e^(ikx) + B e^(-ikx)|^2 = (A e^(-ikx) + B e^(ikx))(A e^(ikx) + B e^(-ikx))',
          hints:['$|w|^2 = w^*w$. Konjugieren dreht die Vorzeichen in den Exponenten um.', 'Die Mischterme sind $AB(e^{2ikx} + e^{-2ikx}) = 2AB\\cos 2kx$.'],
          model:['|A e^(ikx) + B e^(-ikx)|^2 = (A e^(-ikx) + B e^(ikx))(A e^(ikx) + B e^(-ikx))', '= A^2 + B^2 + A B (e^(2ikx) + e^(-2ikx))', '= A^2 + B^2 + 2 A B cos(2kx)'],
          mistakes:[{expr:'A^2 + B^2', msg:'Der Interferenzterm fehlt: Beim Ausmultiplizieren entstehen auch die Mischterme $AB\\,e^{\\pm 2ikx}$.'}, {expr:'(A + B)^2', msg:'Das gilt nur dort, wo $\\cos 2kx = 1$ ist, z. B. bei $x = 0$. Die Mischterme hängen von $x$ ab: $2AB\\cos 2kx$.'}],
          note:'Für $A = B$ ist das eine stehende Welle: $|\\psi|^2 = 4A^2\\cos^2 kx$ hat Knoten. Für $B = 0$ (reine ebene Welle) ist die Dichte überall gleich.'}
      ]},
    {id:'mk-p5', title:'Wurzeln komplexer Zahlen',
      text:'Benutze die Polarform: Aus $z^n = re^{i\\varphi}$ folgt $z = r^{1/n}e^{i(\\varphi + 2\\pi k)/n}$ mit $k = 0, \\dots, n - 1$.',
      ctx:{coords:['x'], params:{}, unknowns:{z:{ref:'(1 + i)/sqrt(2)', alt:['-(1 + i)/sqrt(2)']}}},
      goals:[
        {id:'a', prompt:'a) Löse $z^2 = i$. Eine Lösung genügt.', type:'solve', unknown:'z', points:2, ph:'z^2 = i', altMsg:'Richtig – das ist die eine der beiden Wurzeln. Die andere ist $(1 + i)/\\sqrt2$.',
          hints:['$i = e^{i\\pi/2}$.', 'Halbiere die Phase: $z = e^{i\\pi/4} = \\cos\\frac\\pi4 + i\\sin\\frac\\pi4$.'],
          model:['z^2 = i', 'z^2 = e^(iπ/2)', 'z = e^(iπ/4)', 'z = (1 + i)/sqrt(2)'],
          mistakes:[{expr:'i/2', msg:'Wurzelziehen ist kein Halbieren der Zahl. In Polarform halbiert man die **Phase** und zieht aus dem Betrag die Wurzel.'}]},
        {id:'b', prompt:'b) Bestimme die Lösung von $w^3 = 1$ mit positivem Imaginärteil.', type:'value', target:'-1/2 + i sqrt(3)/2', points:2, ph:'1 = e^(2πi)',
          hints:['Schreibe $1 = e^{2\\pi ik}$ mit $k = 0, 1, 2$.', 'Für $k = 1$: $w = e^{2\\pi i/3} = \\cos\\frac{2\\pi}{3} + i\\sin\\frac{2\\pi}{3}$.'],
          model:['1 = e^(2πi)', 'w = e^(2πi/3)', '= -1/2 + i sqrt(3)/2'],
          mistakes:[{expr:'1', msg:'$w = 1$ ist die reelle Lösung. Die beiden anderen findest du mit $1 = e^{2\\pi ik}$ für $k = 1, 2$.'}, {expr:'-1/2 - i sqrt(3)/2', msg:'Das ist die dritte Lösung ($k = 2$); ihr Imaginärteil ist negativ.'}]}
      ]}
  ],
  final:[
    {q:'$e^{i\\pi/2}$ ist gleich …', opts:['$i$', '$-1$', '$\\pi/2$'], a:0, ex:'$\\cos(\\pi/2) + i\\sin(\\pi/2) = 0 + i$.'},
    {task:{id:'mk-f1', title:'Betrag', text:'$z = e^{i\\theta}(1 + i)$ mit reellem $\\theta$.', ctx:CTX.line({params:{θ:'real', m:'pos'}, defs:{'z':'e^(i θ) (1 + i)'}}),
      goals:[{id:'a', prompt:'Berechne $|z|^2$.', type:'value', target:'2', points:2, model:['|z|^2 = z^* z', '= (1 - i)(1 + i)', '= 2']}]}},
    {q:'Welche Zahl hat den Betrag 2 und die Phase $-\\pi/2$?', opts:['$-2i$', '$2i$', '$-2$'], a:0, ex:'$2e^{-i\\pi/2} = 2(\\cos\\frac\\pi2 - i\\sin\\frac\\pi2) = -2i$.'},
    {task:{id:'mk-f2', title:'Division', text:'Schreibe $\\dfrac{3 + i}{1 + 2i}$ in der Form $a + ib$.', ctx:CTX.line({}),
      goals:[{id:'a', prompt:'Ergebnis:', type:'value', target:'1 - i', points:2, model:['(3 + i)/(1 + 2i) = (3 + i)(1 - 2i)/((1 + 2i)(1 - 2i))', '= (5 - 5i)/5', '= 1 - i']}]}}
  ],
  errors:[
    {id:'mk-e1', title:'Betragsquadrat ohne Konjugation',
      text:'Gesucht ist $|z|^2$ für $z = (1 + 2i)\\,e^{ikx}$ mit reellen $k$, $x$. So wurde gerechnet:',
      ctx:CTX.line({params:{k:'real', m:'pos'}, defs:{'z':'(1 + 2i) e^(i k x)'}}),
      lines:['|z|^2 = z^2', '= (1 + 2i)^2 e^(2ikx)', '= (-3 + 4i) e^(2ikx)'],
      wrong:0,
      why:{q:'Was ist in Zeile 1 falsch?', opts:['$|z|^2 = z^*z$, nicht $z^2$. Das Ergebnis muss reell und $\\ge 0$ sein.', 'Der Exponent muss $e^{ikx}$ bleiben.', 'Nichts – nur das Ausmultiplizieren ist falsch.'], a:0, ex:'Ein Betragsquadrat ist immer reell und $\\ge 0$. $(-3 + 4i)e^{2ikx}$ kann also nicht stimmen.'},
      fix:{id:'a', prompt:'Berichtige und berechne $|z|^2$.', type:'value', target:'5', model:['|z|^2 = z^* z', '= (1 - 2i)(1 + 2i) e^(-ikx) e^(ikx)', '= 5']}},
    {id:'mk-e2', title:'Phase im falschen Quadranten',
      text:'Gesucht ist die Polarform von $z = -1 + i\\sqrt3$. Jemand rechnet $\\tan\\varphi = \\sqrt3/(-1) = -\\sqrt3$, also $\\varphi = -\\pi/3$:',
      ctx:{coords:['x'], params:{}, defs:{'z':'-1 + i sqrt(3)'}},
      lines:['|z| = 2', 'z = 2 e^(-iπ/3)'],
      wrong:1,
      why:{q:'Was ist falsch?', opts:['$\\arctan$ liefert nur Winkel zwischen $-\\pi/2$ und $\\pi/2$. $z$ liegt aber im zweiten Quadranten.', 'Der Betrag ist $4$, nicht $2$.', 'Polarform gibt es nur für reelle Zahlen.'], a:0, ex:'$2e^{-i\\pi/3} = 1 - i\\sqrt3$ liegt im vierten Quadranten. Richtig ist $\\varphi = \\pi - \\pi/3 = 2\\pi/3$.'},
      fix:{id:'a', prompt:'Bestimme die richtige Phase $\\varphi$ mit $-\\pi < \\varphi \\le \\pi$.', type:'value', target:'2π/3', model:['φ = π - π/3', '= 2π/3'],
        mistakes:[{expr:'-π/3', msg:'Das ist der Winkel aus $\\arctan$. Prüfe den Quadranten: Realteil negativ, Imaginärteil positiv.'}]}}
  ]
});
lexe('polarform', 'Polarform', '$z = re^{i\\varphi}$ mit $r = |z| = \\sqrt{a^2 + b^2}$ und der Phase $\\varphi = \\arg z$, für die $\\cos\\varphi = a/r$, $\\sin\\varphi = b/r$ gilt (Quadrant beachten!). $\\varphi$ ist nur bis auf Vielfache von $2\\pi$ bestimmt; üblich ist der Hauptwert $-\\pi < \\varphi \\le \\pi$. Rechenregeln: $z_1z_2 = r_1r_2e^{i(\\varphi_1 + \\varphi_2)}$, $z^n = r^ne^{in\\varphi}$, $z^* = re^{-i\\varphi}$. Die $n$-ten Wurzeln von $z$ sind $r^{1/n}e^{i(\\varphi + 2\\pi k)/n}$, $k = 0, \\dots, n-1$.', {topic:'m-komplex'});
lexe('interferenzterm', 'Betragsquadrat einer Summe (Interferenzterm)', '$|z_1 + z_2|^2 = |z_1|^2 + |z_2|^2 + 2\\operatorname{Re}(z_1^*z_2)$. Der Mischterm hängt von der relativen Phase ab: Für $|z_1| = |z_2| = 1$ und $z_2 = z_1e^{i\\varphi}$ ist $|z_1 + z_2|^2 = 2 + 2\\cos\\varphi$. In der Quantenmechanik überlagern sich Amplituden; der Interferenzterm erzeugt zum Beispiel das Doppelspaltmuster.', {topic:'m-komplex'});
