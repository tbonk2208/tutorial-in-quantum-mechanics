"""Testdaten fremder Schreiber für End-to-End-Tests: /home/claude/ink/testdata/strokes_test.json
Format {klasse: [[ [ {x,y}, ... ], ... ], ...]}  (Beispiel = Liste von Strichen), y nach unten.
Koordinaten: Originalkoordinaten, je CROHME-Ausdruck einheitlich skaliert (Median Ziffer/Buchstabe = 40 Einheiten,
also etwa CSS-Pixel bei normaler Schrift); HASY: Skelett-Polylinien in 32er-Bildpixeln * 40/31.
Herkunft je Beispiel (gleiche Reihenfolge) in strokes_test_meta.json.
Aufruf: python3 -I make_testdata.py <work> <ausgabeordner>"""
import sys, os, json, pickle, collections
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classes import CLASSES, map_label

W, OUT = sys.argv[1], sys.argv[2]
MAXN = 30


def pts(st):
    return [[{'x': round(float(p[0]), 2), 'y': round(float(p[1]), 2)} for p in s] for s in st]


def spread(L, n, rng):
    """bis zu n Beispiele, möglichst viele verschiedene Schreiber (reihum)"""
    byw = collections.defaultdict(list)
    for x in L:
        byw[x[1]].append(x)
    ws = list(byw)
    rng.shuffle(ws)
    for w in ws:
        rng.shuffle(byw[w])
    out = []
    while len(out) < n and any(byw[w] for w in ws):
        for w in ws:
            if byw[w] and len(out) < n:
                out.append(byw[w].pop())
    return out


def main():
    cr = pickle.load(open(os.path.join(W, 'crohme.pkl'), 'rb'))
    hz = pickle.load(open(os.path.join(W, 'hasy.pkl'), 'rb'))['items']
    rng = np.random.default_rng(21)
    C = collections.defaultdict(list)
    Hk = collections.defaultdict(list)
    Ha = collections.defaultdict(list)
    for r in cr:
        c = map_label(r['lab'])
        if c and r['split'] == 'test':
            C[c].append((r['strokes'], r['writer'], r['file'], 'crohme'))
    for r in hz:
        v = r['variants'][1] or r['variants'][0]
        if r['split'] == 'test':
            Hk[r['cls']].append((v, r['writer'], r['file'], 'hasy-skelett'))
        elif r['split'] == 'test_anon':
            Ha[r['cls']].append((v, r['writer'], r['file'], 'hasy-skelett-anonym'))
    data, meta, summary = {}, {}, {}
    for c in CLASSES:
        sel = spread(C[c], MAXN, rng)
        if len(sel) < MAXN:
            sel += spread(Hk[c], MAXN - len(sel), rng)
        if len(sel) < MAXN:
            sel += spread(Ha[c], MAXN - len(sel), rng)
        data[c] = [pts(s) for s, _, _, _ in sel]
        meta[c] = [{'src': src, 'writer': w, 'file': f} for _, w, f, src in sel]
        summary[c] = collections.Counter(src for _, _, _, src in sel)
    os.makedirs(OUT, exist_ok=True)
    json.dump(data, open(os.path.join(OUT, 'strokes_test.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    json.dump({'about': 'Herkunft je Beispiel, gleiche Reihenfolge wie strokes_test.json. src: crohme = echte Striche '
                        '(CROHME-2013-Testschreiber); hasy-skelett = aus dem HASY-Bild gewonnene Polylinien (Testnutzer, '
                        'nicht im Training); hasy-skelett-anonym = HASY-Anonym-Konto, zufällig zurückgehalten (Schreibertrennung '
                        'nicht gesichert). Koordinaten: CROHME je Ausdruck einheitlich skaliert (Median Ziffer/Buchstabe = 40), '
                        'HASY 32er-Bildpixel * 40/31; y nach unten.', 'samples': meta},
              open(os.path.join(OUT, 'strokes_test_meta.json'), 'w'), ensure_ascii=False, indent=0)
    for c in CLASSES:
        print(c, dict(summary[c]))
    print('Beispiele gesamt', sum(len(v) for v in data.values()))


if __name__ == '__main__':
    main()
