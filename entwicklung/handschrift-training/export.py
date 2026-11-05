"""Export cnn2 -> JSON (int8 je Schicht mit scale, Biases als Liste) + eval_check.json für cnn2_eval.js.
Aufruf: python3 -I export.py <work> <modell.npz> <ausgabe.json> <eval_check.json>"""
import sys, os, json, base64
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classes import CLASSES
from cnn import forward, softmax



def quant(Wm):
    m = float(np.abs(Wm).max())
    scale = m / 127.0 if m > 0 else 1.0
    q = np.clip(np.round(Wm / scale), -127, 127).astype(np.int8)
    return q, scale


def dequant_params(doc):
    """genau wie die JS-Seite: Float32(c * scale), Float32(b)"""
    P = {}
    for k, L in enumerate(doc['layers']):
        q = np.frombuffer(base64.b64decode(L['w']), np.int8).astype(np.float64)
        P['W%d' % (k + 1)] = (q * L['scale']).astype(np.float32).astype(np.float64).reshape(L['shape'])
        P['b%d' % (k + 1)] = np.array(L['b'], np.float32).astype(np.float64)
    return P


def main():
    W, MODEL, OUT, CHECK = sys.argv[1:5]
    P = dict(np.load(MODEL))
    layers = []
    for k in range(1, 5):
        q, sc = quant(P['W%d' % k])
        layers.append({'shape': list(q.shape), 'scale': float(np.float64(sc)),
                       'w': base64.b64encode(q.tobytes(order='C')).decode('ascii'),
                       'b': [float('%.7g' % v) for v in P['b%d' % k]]})
    C1, C2, F, N = layers[0]['shape'][1], layers[1]['shape'][1], layers[2]['shape'][1], layers[3]['shape'][1]
    assert layers[1]['shape'] == [9 * C1, C2] and layers[2]['shape'] == [25 * C2, F] and N == len(CLASSES)
    doc = {'arch': 'cnn2', 'classes': CLASSES,
           'raster': 'DESIGN.md: lw 10, s=(80-lw)/max(B,H,1), 112er-Raster, Deckung clamp(lw/2+0.5-d,0,1), 4x4-Mittel, '
                     'Schwerpunkt Math.round(14 - s/sm + 1e-3)',
           'note': 'Gewicht = int8 * scale; Speicherreihenfolge wie cnnEval (Kanal zuletzt, W1[(di*3+dj)*C1+k], '
                   'W2[((di*3+dj)*C1+ch)*C2+k], W3[((i*5+j)*C2+k)*F+f], W4[f*N+n]); Merkmale = ReLU(fc F), L2-normiert',
           'trained': 'CROHME 2011-2013 (TC11/ICDAR, CC BY-NC-SA 3.0) + HASYv2 (M. Thoma 2017, ODbL); Agent T, ink/train/REPORT.md',
           'layers': layers}
    s = json.dumps(doc, ensure_ascii=False, separators=(',', ':'))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as g:
        g.write(s)
    print('geschrieben', OUT, len(s.encode('utf8')), 'Bytes')
    # Abgleich: Python mit denselben dequantisierten Gewichten (float64) auf Testbildern
    Pq = dequant_params(json.loads(s))
    cases = []
    rng = np.random.default_rng(9)
    for k in ('crohme', 'hasy', 'hasy_anon'):
        t = np.load(os.path.join(W, 'test_%s.npz' % k))
        idx = rng.choice(len(t['X']), 20, replace=False)
        for i in idx:
            x = np.round(t['X'][i].astype(np.float64) / 255, 6)
            z, _ = forward(Pq, x[None].astype(np.float32).astype(np.float64))
            p = softmax(z)[0]
            cases.append({'src': k, 'label': CLASSES[int(t['y'][i])], 'pred': CLASSES[int(p.argmax())],
                          'x': [float(v) for v in x.astype(np.float32)], 'p': [round(float(v), 8) for v in p]})
    json.dump({'about': 'Eingaben (784) und Wahrscheinlichkeiten des quantisierten Modells (Python, float64)', 'cases': cases},
              open(CHECK, 'w'))
    # Genauigkeit float vs. quantisiert
    for k in ('crohme', 'hasy', 'hasy_anon'):
        t = np.load(os.path.join(W, 'test_%s.npz' % k))
        X = t['X'].astype(np.float32) / 255
        a = forward({kk: v.astype(np.float32) for kk, v in Pq.items()}, X)[0].argmax(1)
        b = forward(P, X)[0].argmax(1)
        print(k, 'float %.4f quantisiert %.4f' % ((b == t['y']).mean(), (a == t['y']).mean()))


if __name__ == '__main__':
    main()
