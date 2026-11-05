"""Auswertung auf Testschreibern: gesamt, je Klasse, Verwechslungen (CROHME / HASY-Testnutzer / HASY-anonym getrennt).
Aufruf: python3 -I evaluate.py <work> <modell.json> <ausgabe.json>"""
import sys, os, json, collections
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classes import CLASSES
from cnn import forward, softmax
from export import dequant_params

W, MODEL, OUT = sys.argv[1:4]
# Paare/Gruppen, die sich im normierten 28x28-Bild nur durch Größe oder Lage unterscheiden (R entscheidet über Lage/Kontext)
GROUPS = [{'c', 'C'}, {'s', 'S'}, {'v', 'V'}, {'p', 'P'}, {'1', '|', 'l'}, {"'", ','}, {'x', 'χ'}]
GI = {}
for gi, g in enumerate(GROUPS):
    for c in g:
        GI[CLASSES.index(c)] = gi


def main():
    doc = json.load(open(MODEL))
    assert doc['classes'] == CLASSES
    P = {k: v.astype(np.float32) for k, v in dequant_params(doc).items()}
    res = {}
    for k in ('crohme', 'hasy', 'hasy_anon'):
        t = np.load(os.path.join(W, 'test_%s.npz' % k))
        X, y = t['X'].astype(np.float32) / 255, t['y'].astype(int)
        p = np.concatenate([softmax(forward(P, X[i:i + 1024])[0]) for i in range(0, len(X), 1024)])
        pred = p.argmax(1)
        top3 = (np.argsort(-p, 1)[:, :3] == y[:, None]).any(1)
        per = {}
        for ci, c in enumerate(CLASSES):
            m = y == ci
            if m.sum():
                per[c] = [int(m.sum()), float((pred[m] == ci).mean())]
        conf = collections.Counter((CLASSES[a], CLASSES[b]) for a, b in zip(y, pred) if a != b)
        # ausgeglichene Genauigkeit (Mittel über Klassen)
        bal = float(np.mean([v[1] for v in per.values()]))
        same = np.array([a == b or (a in GI and GI.get(b) == GI[a]) for a, b in zip(y, pred)])
        res[k] = {'n': int(len(y)), 'acc': float((pred == y).mean()), 'top3': float(top3.mean()), 'balanced': bal,
                  'acc_groups': float(same.mean()),
                  'per_class': per, 'confusions': [[a, b, n] for (a, b), n in conf.most_common(40)]}
        print('%-10s n=%5d  Top-1 %.4f  Top-3 %.4f  Klassenmittel %.4f  Top-1 mit Größengruppen %.4f' % (k, len(y), res[k]['acc'], res[k]['top3'], bal, res[k]['acc_groups']))
        print('   häufigste Verwechslungen (wahr -> erkannt):', ', '.join('%s→%s %d' % (a, b, n) for (a, b), n in conf.most_common(15)))
    json.dump(res, open(OUT, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
