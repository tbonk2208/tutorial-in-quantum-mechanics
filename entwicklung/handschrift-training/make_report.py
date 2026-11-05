"""REPORT.md aus counts.pkl, eval.json, train.log erzeugen. Aufruf: python3 -I make_report.py <work> <modell.json> <REPORT.md>"""
import sys, os, json, pickle, re

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classes import CLASSES

W, MODEL, OUT = sys.argv[1:4]
cnt = pickle.load(open(os.path.join(W, 'counts.pkl'), 'rb'))
ev = json.load(open(os.path.join(W, 'eval.json')))
log = open(os.path.join(W, 'train.log')).read()
epochs = re.findall(r'Epoche (\d+): Trainingsverlust ([\d.]+), Trainingsgenauigkeit ([\d.]+), Test (\{.*?\}), Zeit (\d+)s', log)
tot = re.search(r'Gesamtzeit (\d+)s', log)
size = os.path.getsize(MODEL)
doc = json.load(open(MODEL))
shapes = [l['shape'] for l in doc['layers']]
C1, C2, F, N = shapes[0][1], shapes[1][1], shapes[2][1], shapes[3][1]
nparam = sum(a * b + b for a, b in shapes)


def pc(x):
    return '%.1f' % (100 * x)


def cell(k, c):
    v = ev[k]['per_class'].get(c)
    return '–' if not v else '%d / %s' % (v[0], pc(v[1]))


L = []
A = L.append
A('# Agent T – Daten und Training des Zeichenmodells `cnn2` (sym-qm.json)\n')
A('Stand: 2026-11-05. Alles reproduzierbar mit den Skripten in `/home/claude/ink/train/` (Reihenfolge unten).\n')
A('## Ergebnis in Kürze\n')
A('| | Testschreiber | n | Top-1 | Top-3 | Mittel über Klassen | Top-1, Größengruppen gleichgesetzt¹ |')
A('|---|---|---|---|---|---|---|')
for k, name in (('crohme', 'CROHME-2013-Testsatz (echte Striche, fremde Schreiber)'),
                ('hasy', 'HASYv2-Testnutzer (15 % der bekannten Nutzer, Skelett-Polylinien)'),
                ('hasy_anon', 'HASYv2-Anonymkonto, 10 % zurückgehalten (Schreibertrennung NICHT gesichert)')):
    e = ev[k]
    A('| %s | %s | %d | %s %% | %s %% | %s %% | %s %% |' % (k, name, e['n'], pc(e['acc']), pc(e['top3']), pc(e['balanced']), pc(e['acc_groups'])))
A('')
A('¹ `c`/`C`, `s`/`S`, `v`/`V`, `p`/`P`, `1`/`|`/`l`, `\'`/`,` und `x`/`χ` gelten als gleich – diese unterscheiden sich im normierten Bild nur durch Größe/Lage bzw. kaum; R entscheidet sie über Lage und Kontext. '
  'Das Netz ist auf ausgeglichene Klassen trainiert (etwa gleiche Vorab-Wahrscheinlichkeit je Klasse); Häufigkeiten gehören in R (`classWeights`).\n')
A('- Modell: `/home/claude/qm/src/ui/model/sym-qm.json`, %d Bytes (%.0f KB), arch `cnn2`, C1=%d, C2=%d, F=%d, N=%d Klassen, %d Parameter, int8 je Schicht.' % (size, size / 1024, C1, C2, F, N, nparam))
if tot:
    A('- Training: %d Epochen über %d augmentierte Beispiele, %.0f min auf 2 CPU-Kernen (numpy, eigene Implementierung).' % (len(epochs), sum(cnt['target'].values()), int(tot.group(1)) / 60))
A('- Genauigkeit gilt für **einzelne, richtig segmentierte Zeichen ohne Zusammenhang**. In der App kommen Größe/Lage (Punkt, Komma, Strich, Hoch/Tief) und Grammatik/Aufgabenkontext (Agent R) dazu; die meisten Restfehler (`1`/`|`, `,`/`)`, `c`/`C`, `9`/`q`, `P`/`p`) sind ohne Größe/Lage im Bild nicht lösbar.\n')

A('## Wichtig für Agent R (JS-Rasterung)\n')
A('**Gleichstandsregel in Schritt 4 nötig:** Symmetrische Zeichen (Einzelpunkt, gerader Strich, viele `-`, `|`, `+`) haben `14 - sx/sm = 0.5` genau auf der Rundungsgrenze. '
  'Ob `Math.round` dann 0 oder 1 liefert, entscheidet Rundungsrauschen der Summation (gemessen: 0.4999999999999982 gegen 0.5000000000000018) – das ist ein ganzes Pixel Versatz und bricht jeden 1e-4-Abgleich. '
  'Verbindlich (Training und `raster_check.json` sind so gerechnet):\n')
A('```js\nconst dx = Math.round(14 - sx / sm + 1e-3), dy = Math.round(14 - sy / sm + 1e-3);   // sx = Σ v·Spalte, sy = Σ v·Zeile, sm = Σ v\n```\n')
A('Sonst genau DESIGN.md: lw = 10, s = 70/max(B,H,1), BBox-Mitte auf (56,56), Pixelmitte (i+0.5, j+0.5), Deckung clamp(5.5 − d, 0, 1) mit Maximum über Striche, Einzelpunkt = Kreis, Segmente der Länge 0 = Punkt, 4×4-Mittel. '
  '`cnn2_eval.js` enthält eine unabhängige JS-Fassung (`rasterize`), die alle 20 Fälle von `raster_check.json` auf < 1e-6 trifft – R kann sie übernehmen. Die DESIGN.md sollte um die Regel ergänzt werden (darf ich nicht ändern).\n')
A('Weitere Hinweise:')
A('- Merkmalsvektor für „eigene Handschrift“: `h = ReLU(fc F)`, F = %d, L2-normiert (wie `cnnEval` der Mathe-App, Ausgabeschicht rechnet mit dem nicht normierten h).' % F)
A('- Punkte: Durch s = 70/max(B,H,1) wird ein Stiftpunkt mit 2–4 px Ausdehnung auf volle Größe gestreckt und sieht dann aus wie ein kurzer Strich oder Kringel (siehe `samples_crohme_vs_hasy_2.png`, Zeile „.“). Das Modell kann `.` darum nur schlecht von `-`, `/`, `,`, `\'` trennen. **Empfehlung:** Punkt (und Malpunkt) in R über die absolute Größe relativ zur Zeilenhöhe erkennen, bevor das Netz gefragt wird; ebenso `,` / `\'` / `.` über Lage.')
A('- Klasse `†` ist neu (HASY `\\dag`, laut Hauptsitzung); `⟨`/`⟩` enthalten `<`/`>`; `|` enthält `\\mid`; `o`/`O` gibt es nicht (wird meist `0`).')
A('- `+` und das neue `†` werden verwechselt (CROHME-Test: `+`→`†` 13×, HASY-anonym `†`→`+` 3×). R sollte `†` nur hochgestellt/hinter Operator zulassen und sonst `+` nehmen (und umgekehrt).')
A('- Zeichen ohne Klasse (gemessen am CROHME-Test): `o`→`0` (17/18), `×`→`x` (36/37), `X`→`x` (52/52), `…`→`.` (20/20, eine Gruppe aus 3 Punkten); `≠`, `G`, `I` (mit Serifen) landen mit geringer Sicherheit (mittleres max p 0,35–0,43) bei `pm`/`+`, `6`/`C`, `Φ`/`]`/`T`. Ein niedriges max p ist also ein brauchbares Signal „unbekanntes Zeichen / falsch gruppiert“.')
A('- Klassenliste in Modellreihenfolge steht in `sym-qm.json` (`classes`), Namen genau wie DESIGN.md (`"sqrt"`, `"pm"`, `"Σ"` …).\n')

A('## Datenquellen, Herkunft, Lizenz\n')
A('**CROHME 2011–2013** (Competition on Recognition of Online Handwritten Mathematical Expressions, TC11/ICDAR bzw. ICFHR; H. Mouchère, C. Viard-Gaudin, R. Zanibbi, U. Garain, D. H. Kim, J. H. Kim). '
  'Bezogen als `data/CROHME_full_v2.zip` aus `github.com/ThomasLech/CROHME_extractor` (inoffizielle Kopie), entpackt nach `/home/claude/dl/crohme_data` (Pfade auf „..“ geprüft, nur .inkml/.txt/.html). '
  'Benutzt: `CROHME2013_data/TrainINKML` (enthält die Trainingsdaten 2011/2012 und HAMEX, KAIST, MathBrush, MfrDB, expressmatch) für Training, `TestINKMLGT` (2013-Testsatz, eigene Schreiber) nur für Test. '
  'Lizenz laut `readme.txt` im Archiv: Copyright Université de Nantes/CNRS, **CC BY-NC-SA 3.0**; die Teilkorpora behalten ihre eigenen Copyrights (Univ. São Paulo, Univ. Waterloo, KAIST, TU Prag, Univ. Nantes). '
  'Die `Readme.txt` des 2013-Ordners sagt außerdem „Please do not distribute this unofficial data set“. Zitierbitte: Mouchère u. a., ICDAR 2013 CROHME, Proc. ICDAR 2013; ICFHR 2012 CROHME.\n')
A('**HASYv2** (M. Thoma, „The HASYv2 dataset“, arXiv:1701.08380, 2017; Daten auf Zenodo, Record 259444). Benutzt wurde die vorhandene Kopie `/home/claude/dl/hasy` – das ist ein Fork (`Proyecto-7-MathVision-IA/Math-Client-App-HasyV2`) mit 168 233 Bildern (Original laut README: 168 236). '
  'Lizenz: Laut Hauptsitzung nennt das Paper (Anhang „Obtaining the data“) **ODbL** mit der Bitte, das Paper zu zitieren; das README des Forks sagt ebenfalls ODbL 1.0. '
  'Selbst geprüft habe ich nur: Das Original-Repository `MartinThoma/HASY` (geklont nach `/home/claude/dl/hasy_orig`) nennt keine Datenlizenz, nur MIT für den Python-Code (`setup.cfg`). Paper und Zenodo-Seite konnte ich hier nicht öffnen – die ODbL-Angabe ist also übernommen, nicht von mir am Original bestätigt.\n')
A('**Lizenzfolgen (unsicher, bitte prüfen lassen):** CROHME ist *NonCommercial* und *ShareAlike*. Ob ein daraus trainiertes Modell (Gewichte) als Bearbeitung gilt, ist rechtlich ungeklärt; bei kommerzieller Weitergabe der App wäre CROHME ein Risiko. '
  '`testdata/strokes_test.json` und `raster_check.json` enthalten echte CROHME-Striche, sind also Bearbeitungen der Daten und sollten nur intern bleiben bzw. unter CC BY-NC-SA 3.0 mit Quellenangabe stehen. HASY (ODbL) verlangt Namensnennung und für weitergegebene Datenbanken dieselbe Lizenz.\n')

A('## Klassen, Zuordnung, Anzahlen\n')
A('%d Klassen (DESIGN.md + `†`). Zuordnung der Quellnamen (`classes.py`):' % N)
A('- CROHME: Ziffern/Buchstaben direkt; `\\alpha \\beta \\gamma \\theta \\lambda \\mu \\pi \\sigma \\phi \\Delta` → griechisch; `\\sum`→Σ, `\\int`→∫, `\\infty`→∞, `\\sqrt`→sqrt, `\\pm`→pm, `\\lt`→⟨, `\\gt`→⟩, `\\{ \\}`→{ }, `\\prime`→\', `.`, `,`, `!`, `/`, `|`, `( ) [ ]`, `+ - =`.')
A('- HASY: zusätzlich `\\delta \\kappa \\nu \\xi \\rho \\tau \\chi \\psi \\omega \\Phi \\Psi \\Omega \\partial \\hbar \\nabla \\uparrow \\downarrow \\otimes \\ast \\dag \\langle \\rangle \\cdot`, Buchstaben, Ziffern, `[ ] \\{ \\} | / + - < >`.')
A('- **Zusammenlegungen:** `\\phi`+`\\varphi`→φ; `\\epsilon`+`\\varepsilon`→ε; `\\theta`+`\\vartheta`→θ; `\\kappa`+`\\varkappa`→κ; `\\rho`+`\\varrho`→ρ; `\\sum`+`\\Sigma`→Σ; `<`+`\\langle`+`\\lt`→⟨; `>`+`\\rangle`+`\\gt`→⟩; `|`+`\\mid`→|; `\\cdot`+`.`→.; `\\prime`→\'; `\\dag`→†.')
A('- Nicht benutzt: CROHME `\\ldots`, `\\cdots`, `\\sin \\cos \\tan \\log \\lim` (eine Spurgruppe für mehrere Buchstaben), `\\times \\div \\neq \\leq \\geq \\rightarrow \\in \\exists \\forall` (keine Zielklasse), `o`/`O`.')
A('- **HASY je Klasse höchstens 1600 Bilder** (alle bekannten Nutzer, Rest zufällig aus dem Anonymkonto), weil Σ, ∫, ∞ … sonst mehrere Tausend hätten.\n')
A('**Schreibertrennung:** CROHME-Test = 2013-Testsatz. HASY: `user_id 16925` ist das Anonymkonto (91 %% aller HASY-Bilder, vermutlich Detexify/Web ohne Anmeldung) und lässt sich nicht nach Schreibern trennen; '
  'von den übrigen %d Nutzern (mit Bildern in unseren Klassen) gehen 15 %% (55 Nutzer, Zufall mit festem Startwert) komplett in den Test. Vom Anonymkonto sind 10 %% zufällig zurückgehalten – das ist nur ein Plausibilitätstest (gleiche Schreiber können in Training und Test sein).\n' % 366)
A('**Zu wenig Daten / unsicher:**')
A('- `D`: nur 32 Trainingsbilder (nur HASY, kein CROHME), 26 Testbilder.')
A('- `!`: 98 (nur CROHME, 5 Testbilder); `\'`: 211; `l`, `w`, `H`, `P`, `T`, `V`, `M`, `S`, `E`, `L`, `N`, `F`: 130–200 Originale.')
A('- `↑`, `↓`, `†`, `⊗`, `*`: fast nur Anonymkonto – keine echte Schreibertrennung im Test (↑/↓ je 1 Bild von Testnutzern, † keines). `ψ Φ ν ξ τ χ ω Ψ` haben 9–13 Testbilder von Testnutzern.')
A('- Klassen nur aus HASY (δ ε κ ν ξ ρ τ χ ψ ω Φ Ψ Ω ∂ ħ ∇ ↑ ↓ ⊗ * † D) kennt das Netz nur als Skelett-Polylinien aus Bildern, nie als echte Stiftstriche. Wie gut echte Stifteingabe dieser Zeichen erkannt wird, ist ungemessen – erste Kandidaten für „Handschrift anlernen“.\n')
A('| Klasse | CROHME Train | HASY Train | Trainingsbeispiele (augm.) | CROHME-Test n / % | HASY-Test n / % | HASY-anonym n / % |')
A('|---|---|---|---|---|---|---|')
for c in CLASSES:
    nc, nh = cnt['raw'][c]
    A('| `%s` | %d | %d | %d | %s | %s | %s |' % (c.replace('|', '\\|'), nc, nh, cnt['target'][c], cell('crohme', c), cell('hasy', c), cell('hasy_anon', c)))
A('')

A('## Verwechslungen (wahr → erkannt, Anzahl)\n')
for k, name in (('crohme', 'CROHME-Test'), ('hasy', 'HASY-Testnutzer'), ('hasy_anon', 'HASY-anonym')):
    A('- **%s:** ' % name + ', '.join('`%s`→`%s` %d' % (a, b, n) for a, b, n in ev[k]['confusions'][:20]))
A('')
A('## Rasterung und HASY-Umwandlung\n')
A('- `raster.py`: `rasterize_ref` (exakt nach Vorschrift, float64, ganzes 112er-Raster) und `rasterize_fast` (gleiche Formel, nur Fenster um die Striche, vektorisiert; Abweichung < 1e-6, ~2 ms je Zeichen). Training, Test und `raster_check.json` benutzen diese Rasterung.')
A('- CROHME-Koordinaten werden je Ausdruck einheitlich skaliert (Median der Größe von Ziffern/Buchstaben = 40 Einheiten ≈ CSS-Pixel), weil die Rohgrößen zwischen 22 und 234 Einheiten schwanken; wichtig nur für die Untergrenze `max(B,H,1)` (Punkte).')
A('- HASY (32×32, binär, ~1 px Linien): Zhang-Suen-Ausdünnung (`cv2.ximgproc.thinning`), Skelett als Graph (4er-Nachbarn, Diagonale nur ohne 4er-Umweg), Zerlegung in Äste, Sporne ≤ 2,5 px entfernen, Äste an Knoten mit möglichst gerader Fortsetzung verbinden, leicht glätten, Douglas-Peucker 0,12 px. '
  'Drei Ausdünnungsvarianten: direkt; 3fach bikubisch hochskaliert (Schwelle 0,45); erst geweitet (3×3-Kreuz), dann 3fach. Danach wie echte Striche gerastert → Strichstärke und Lage passen (Bilder `samples_crohme_vs_hasy_1.png`, `_2.png`: links CROHME, rechts HASY; `samples_hasy_variants.png`: je 3 Varianten). '
  'Grenzen: HASY-Bilder enthalten oft einen Startpunkt-Klecks (z. B. bei ε, Σ); kleine Pfeilspitzen (↑ ↓) verschmelzen bei lw = 10 zu einem Klecks – das passiert in der App genauso.\n')
A('## Datensatz und Augmentierung\n')
A('- %d Trainingsbeispiele (uint8, 241 MB), je Klasse T = clip(3·n, %d, %d) (Überabtastung seltener Klassen), bei Klassen mit beiden Quellen mindestens 20 %% HASY (damit der Stil echt/Skelett nichts über die Klasse verrät).' % (sum(cnt['target'].values()), min(cnt['target'].values()), max(cnt['target'].values())))
A('- Je Beispiel (88 %): Strichversatz bei mehreren Strichen (σ = 2,5 % der Größe, p = 0,5), geglätteter Punkt-Jitter (σ bis 1,2 %), Drehung ±8°, Scherung ±0,15, Streckung exp(N(0, 0,1)) gegenläufig in x/y, Größe ×exp(U(−0,5, 0,5)); 12 % unverändert. HASY: zufällige Ausdünnungsvariante. Punkt: 30 % künstliche Punkte (1–6 Punkte, Radius 0–2,5).')
A('- Ansicht: `samples_augmented.png`.\n')
A('## Architektur und Training\n')
A('- `cnn.py`: 28×28 → conv3×3, %d, ReLU → max2 (26→13) → conv3×3, %d, ReLU → max2 (11→5) → %d → fc %d, ReLU (Merkmale) → fc %d → softmax. im2col, He-Initialisierung, Adam (lr 2e-3, 300 Schritte Anlauf, Kosinus bis 3e-5), Batch 256, Dropout 0,2 auf den Merkmalen, Label-Smoothing 0,05, L2 1e-5.' % (C1, C2, 25 * C2, F, N))
gc = open(os.path.join(W, 'gradcheck.log')).read().strip().splitlines()[-1].replace('Gradientenprüfung: ', '') if os.path.exists(os.path.join(W, 'gradcheck.log')) else ''
A('- Gradientenprüfung (float64, zentrale Differenzen, kleines Netz 4/5/7/6, je Parameter 14 Einträge): %s (`work/gradcheck.log`).' % gc)
A('- Verlauf (Test nur zur Beobachtung, nicht zur Auswahl; exportiert ist die letzte Epoche):\n')
A('| Epoche | Verlust | Train-Gen. | CROHME | HASY | HASY-anon | Zeit |')
A('|---|---|---|---|---|---|---|')
for e, l, a, t, s in epochs:
    t = json.loads(t)
    A('| %s | %s | %s | %s | %s | %s | %d min |' % (e, l, a, pc(t['crohme']), pc(t['hasy']), pc(t['hasy_anon']), int(s) // 60))
A('')
exl = open(os.path.join(W, 'export.log')).read() if os.path.exists(os.path.join(W, 'export.log')) else ''
q = re.findall(r'(\w+) float ([\d.]+) quantisiert ([\d.]+)', exl)
A('- Quantisierung: int8 je Schicht, scale = max|W|/127, Biases float. Top-1 float → int8: ' + '; '.join('%s %s → %s %%' % (k, pc(float(a)), pc(float(b))) for k, a, b in q) + '.')
jsl = open(os.path.join(W, 'js_check.log')).read() if os.path.exists(os.path.join(W, 'js_check.log')) else ''
m1 = re.search(r'Modell-Abgleich: (.*)', jsl)
m2 = re.search(r'Raster-Abgleich: (.*)', jsl)
m3 = re.search(r'strokes_test: (.*)', jsl)
m4 = re.search(r'schwächste Klassen: (.*)', jsl)
A('- `cnn2_eval.js` (Node, ohne Abhängigkeiten) lädt das JSON und rechnet 60 Testbilder aus `eval_check.json` nach (Vergleich mit Python, quantisierte Gewichte): %s. Das belegt die Speicherreihenfolge. Rasterabgleich gegen `raster_check.json` (eigene JS-Rasterung): %s.' % (m1.group(1) if m1 else '?', m2.group(1) if m2 else '?'))
A('- Gegenprobe ganz in JS (JS-Rasterung + JS-Modell) auf `testdata/strokes_test.json`: %s; schwächste Klassen: %s. (`node cnn2_eval.js --strokes`)\n' % (m3.group(1) if m3 else '?', m4.group(1) if m4 else '?'))
A('## Dateien\n')
A('- `/home/claude/qm/src/ui/model/sym-qm.json` – Modell')
A('- `/home/claude/ink/train/raster_check.json` – 20 Rasterfälle (Einzelpunkt, zwei Punkte, Mini-Punkt < 1, waagerecht, sehr flach, Länge-0-Segmente, negative Koordinaten, 11 CROHME-Testzeichen, 2 HASY-Polylinien)')
A('- `/home/claude/ink/testdata/strokes_test.json` – je Klasse bis 30 Beispiele fremder Schreiber, Format `{klasse: [[ [ {x,y}, … ], … ], …]}`; Herkunft je Beispiel (gleiche Reihenfolge) in `strokes_test_meta.json` (`src`: `crohme` = echte Striche, `hasy-skelett` = aus Bild gewonnen, Testnutzer; `hasy-skelett-anonym` = Anonymkonto). Koordinaten: CROHME je Ausdruck einheitlich skaliert (normales Zeichen ≈ 40), HASY 32er-Pixel × 40/31; y nach unten. `!` hat nur 5, `†` 20, `↓` 19 Beispiele.')
A('- `/home/claude/ink/train/`: `extract_crohme.py`, `hasy_strokes.py`, `classes.py`, `raster.py`, `build_dataset.py`, `cnn.py`, `train.py`, `export.py`, `evaluate.py`, `make_raster_check.py`, `make_testdata.py`, `make_samples.py`, `make_report.py`, `cnn2_eval.js`, `eval_check.json`, Bilder `samples_*.png`; Zwischenstände `work/ckpt_epNN.npz`, Logs `work/*.log`, Auswertung `work/eval.json`.')
A('- Ablauf: `extract_crohme.py` → `hasy_strokes.py` → `build_dataset.py` → `cnn.py` (Prüfung) → `train.py` → `export.py` → `node cnn2_eval.js` → `evaluate.py` → `make_testdata.py`, `make_raster_check.py`, `make_samples.py`, `make_report.py` (alle mit `python3 -I`).\n')
A('## Bekannte Schwächen\n')
A('- Zeichen nur aus HASY sind nie mit echten Stiftstrichen trainiert oder getestet (s. o.); Messwerte für ↑ ↓ † ⊗ * stammen nur aus dem Anonymkonto und sind zu optimistisch.')
A('- Punkt/Komma/Strich/`|`/`1`/`l`/`/` sind nach der Normierung auf volle Größe kaum zu unterscheiden; R muss Größe und Lage nutzen (s. o.).')
A('- `×` ist keine Klasse; ein geschriebenes Malkreuz wird `x` (36/37 im CROHME-Test), `o` wird `0` (17/18).')
A('- Testgenauigkeit stagniert ab Epoche ~6 (CROHME ~86,5 %), Trainingsgenauigkeit steigt weiter: Grenze liegt eher in den Daten (Mehrdeutigkeit, ein fester augmentierter Satz) als im Netz. Mehr Wirkung als längeres Training hätten: frisch augmentierte Daten je Epoche, echte Stiftdaten für die HASY-Klassen.')
A('- Wenige Daten für `D`, `!`, `\'`, einige Großbuchstaben; CROHME-Testsatz hat für manche Klassen nur 4–10 Beispiele (λ, φ, γ, pm, {, }, !) – die Prozentwerte dort sind grob.')
A('- Die Testgenauigkeit wurde je Epoche mitgeschrieben, aber nicht zur Auswahl benutzt (letzte Epoche exportiert).')
A('- CROHME-Lizenz NC/SA (s. o.).')
open(OUT, 'w').write('\n'.join(L) + '\n')
print('geschrieben', OUT)
