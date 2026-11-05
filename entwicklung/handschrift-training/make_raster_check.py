"""raster_check.json: 20 Prüfbeispiele (Striche + erwartete 784er-Ausgabe der Referenzrasterung, 6 Stellen).
Aufruf: python3 -I make_raster_check.py <work> <ausgabe.json>"""
import sys, os, json, pickle
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classes import map_label
from raster import rasterize_ref, rasterize_fast

W, OUT = sys.argv[1], sys.argv[2]


def pts(st, nd=2):
    return [[{'x': round(float(p[0]), nd), 'y': round(float(p[1]), nd)} for p in s] for s in st]


def main():
    cr = pickle.load(open(os.path.join(W, 'crohme.pkl'), 'rb'))
    hz = pickle.load(open(os.path.join(W, 'hasy.pkl'), 'rb'))['items']
    cases = []
    # künstliche Sonderfälle
    cases.append(('Einzelpunkt', '.', [[{'x': 10, 'y': 20}]]))
    cases.append(('zwei Einzelpunkte (Doppelpunkt)', ':', [[{'x': 5, 'y': 3}], [{'x': 5.4, 'y': 14}]]))
    cases.append(('Mini-Punkt, Ausdehnung < 1 (s = 70)', '.', [[{'x': 100, 'y': 50}, {'x': 100.3, 'y': 50.2}, {'x': 100.1, 'y': 50.6}]]))
    cases.append(('exakt waagerechter Strich', '-', [[{'x': 0, 'y': 0}, {'x': 37.5, 'y': 0}]]))
    cases.append(('sehr flacher Strich mit Höhe 0.4', '-', [[{'x': -12, 'y': 7}, {'x': 3, 'y': 7.2}, {'x': 20.5, 'y': 7.4}]]))
    cases.append(('senkrechter Strich, doppelte Punkte (Länge-0-Segmente)', '|', [[{'x': 4, 'y': 1}, {'x': 4, 'y': 1}, {'x': 4.2, 'y': 30}, {'x': 4.2, 'y': 30}]]))
    cases.append(('Gleichheitszeichen, negative Koordinaten', '=', [[{'x': -30, 'y': -10}, {'x': -5, 'y': -11}], [{'x': -29, 'y': -2}, {'x': -4, 'y': -2.5}]]))
    # echte Zeichen (CROHME-Test bzw. HASY-Polylinien)
    want_c = ['2', 'x', '+', '∫', 'sqrt', '(', 'Σ', 'π', 'θ', '.', ',']
    rng = np.random.default_rng(4)
    for c in want_c:
        L = [r for r in cr if r['split'] == 'test' and map_label(r['lab']) == c]
        r = L[rng.integers(len(L))]
        cases.append(('CROHME-Test ' + r['file'], c, pts(r['strokes'])))
    for c in ['ψ', 'ħ']:
        L = [r for r in hz if r['split'] == 'test' and r['cls'] == c]
        r = L[rng.integers(len(L))]
        cases.append(('HASY-Polylinie ' + r['file'], c, pts(r['variants'][1] or r['variants'][0])))
    assert len(cases) == 20, len(cases)
    out = []
    worst = 0.0
    for name, c, st in cases:
        a = rasterize_ref(st)
        b = rasterize_fast(st)
        worst = max(worst, float(np.abs(a - b).max()))
        out.append({'name': name, 'cls': c, 'strokes': st, 'expected': [round(float(v), 6) for v in a]})
    doc = {'about': 'Prüfbeispiele für die verbindliche Rasterung aus DESIGN.md (Referenz: ink/train/raster.py, rasterize_ref, float64). '
                    'expected = 784 Werte (28x28, Zeile für Zeile), auf 6 Stellen gerundet; JS muss auf 1e-4 übereinstimmen. '
                    'WICHTIG, Gleichstandsregel in Schritt 4: dx = Math.round(14 - sx/sm + 1e-3), dy = Math.round(14 - sy/sm + 1e-3) '
                    '(sx, sy = Summe v*Spaltenindex bzw. v*Zeilenindex, sm = Summe v, wie rasterize() der Mathe-App). '
                    'Ohne +1e-3 liegen symmetrische Zeichen (Einzelpunkt, gerade Striche) genau auf 0.5 und das Rundungsrauschen entscheidet über 1 Pixel Versatz.',
           'cases': out}
    json.dump(doc, open(OUT, 'w'), ensure_ascii=False)
    print('geschrieben', OUT, 'Fälle', len(out), 'max |ref-fast|', worst)


if __name__ == '__main__':
    main()
