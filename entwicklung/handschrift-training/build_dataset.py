"""Trainings- und Testdaten (uint8, 784) aus CROHME- und HASY-Strichen bauen.
Aufruf: python3 -I build_dataset.py <work-Ordner> [ziel_gesamt]
Ausgleich: je Klasse T_c = clip(3*n_c, TMIN, TMAX) Beispiele (Überabtastung mit Augmentierung);
bei Klassen mit beiden Quellen mindestens 20 % HASY, damit der Strichstil (echt/Skelett) nichts über die Klasse verrät."""
import sys, os, pickle, collections, time
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classes import CLASSES, map_label
from raster import rasterize_fast

W = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/ink/train/work'
TOTAL = int(sys.argv[2]) if len(sys.argv) > 2 else 310000
CI = {c: i for i, c in enumerate(CLASSES)}

POOL = None  # {cls: {'c': [strokes...], 'h': [[v0,v1,v2],...], 's': synth}}


def load():
    cr = pickle.load(open(os.path.join(W, 'crohme.pkl'), 'rb'))
    hz = pickle.load(open(os.path.join(W, 'hasy.pkl'), 'rb'))['items']
    pool = collections.defaultdict(lambda: {'c': [], 'h': []})
    test = {'crohme': [], 'hasy': [], 'hasy_anon': []}
    for r in cr:
        c = map_label(r['lab'])
        if not c:
            continue
        if r['split'] == 'train':
            pool[c]['c'].append(r['strokes'])
        else:
            test['crohme'].append((c, r['strokes'], r['writer']))
    for r in hz:
        c = r['cls']
        if r['split'] == 'train':
            pool[c]['h'].append(r['variants'])
        elif r['split'] == 'test':
            test['hasy'].append((c, r['variants'][1] or r['variants'][0], r['writer']))
        else:
            test['hasy_anon'].append((c, r['variants'][1] or r['variants'][0], r['writer']))
    return dict(pool), test


def synth_dot(rng):
    n = rng.integers(1, 7)
    r = rng.uniform(0.0, 2.5)
    if n == 1:
        return [np.zeros((1, 2), np.float32)]
    t = np.cumsum(rng.uniform(0.5, 2.0, n))
    p = np.stack([np.cos(t), np.sin(t)], 1) * r * rng.uniform(0.3, 1.0, (n, 1))
    return [p.astype(np.float32)]


def augment(strokes, rng, strong=True):
    st = [np.asarray(s, np.float64).copy() for s in strokes if len(s)]
    allp = np.concatenate(st)
    S = max(np.ptp(allp[:, 0]), np.ptp(allp[:, 1]), 1.0)
    if rng.random() < 0.12:
        return st
    # Strich-Versatz (mehrstrichige Zeichen)
    if len(st) > 1 and rng.random() < 0.5:
        st = [s + rng.normal(0, 0.025 * S, 2) for s in st]
    # glatter Punkt-Jitter (Strichverlauf/-stärke-Eindruck)
    sig = rng.uniform(0.0, 0.012) * S
    if sig > 0:
        out = []
        for s in st:
            nz = rng.normal(0, sig, s.shape)
            if len(s) >= 3:
                nz[1:-1] = (nz[:-2] + 2 * nz[1:-1] + nz[2:]) / 4
            out.append(s + nz)
        st = out
    # affin: Drehung ±8°, Scherung, Streckung, Größe
    th = np.deg2rad(rng.uniform(-8, 8))
    sh = rng.uniform(-0.15, 0.15)
    a = np.exp(rng.normal(0, 0.10))
    g = np.exp(rng.uniform(-0.5, 0.5))
    R = np.array([[np.cos(th), -np.sin(th)], [np.sin(th), np.cos(th)]])
    M = R @ np.array([[1, sh], [0, 1]]) @ np.diag([a, 1 / a]) * g
    c = (allp.min(0) + allp.max(0)) / 2
    st = [(s - c) @ M.T for s in st]
    return st


def pick(cls, rng):
    P = POOL[cls]
    nc, nh = len(P['c']), len(P['h'])
    if cls == '.' and rng.random() < 0.3:
        return synth_dot(rng)
    ph = 0.0 if nh == 0 else 1.0 if nc == 0 else (max(nh / (nh + nc), 0.2) if nh >= 30 else nh / (nh + nc))
    if rng.random() < ph:
        v = P['h'][rng.integers(nh)]
        v = [x for x in v if x]
        return v[rng.integers(len(v))]
    return P['c'][rng.integers(nc)]


def job(args):
    cls, n, seed = args
    rng = np.random.default_rng(seed)
    X = np.zeros((n, 784), np.uint8)
    for i in range(n):
        st = augment(pick(cls, rng), rng)
        X[i] = np.round(rasterize_fast(st) * 255).astype(np.uint8)
    return cls, X


def rast_list(L):
    X = np.zeros((len(L), 784), np.uint8)
    for i, (c, st, w) in enumerate(L):
        X[i] = np.round(rasterize_fast(st) * 255).astype(np.uint8)
    y = np.array([CI[c] for c, _, _ in L], np.int16)
    return X, y


def main():
    global POOL
    POOL, test = load()
    counts = {c: len(POOL.get(c, {'c': [], 'h': []})['c']) + len(POOL.get(c, {'c': [], 'h': []})['h']) for c in CLASSES}
    missing = [c for c in CLASSES if counts[c] == 0]
    assert not missing, missing
    # Ziele je Klasse
    tmin, tmax = 1500, 4200
    for _ in range(30):
        T = {c: int(np.clip(3 * counts[c], tmin, tmax)) for c in CLASSES}
        tot = sum(T.values())
        f = TOTAL / tot
        if abs(f - 1) < 0.01:
            break
        tmin, tmax = tmin * f, tmax * f
    print('Ziel gesamt', sum(T.values()), 'min', min(T.values()), 'max', max(T.values()))
    jobs = []
    seed = 1000
    for c in CLASSES:
        n = T[c]
        for k in range(0, n, 500):
            jobs.append((c, min(500, n - k), seed))
            seed += 1
    t0 = time.time()
    from multiprocessing import Pool
    with Pool(2) as pool:
        res = pool.map(job, jobs, chunksize=1)
    X = np.concatenate([x for _, x in res])
    y = np.concatenate([np.full(len(x), CI[c], np.int16) for c, x in res])
    print('Training', X.shape, 'Zeit', round(time.time() - t0), 's')
    np.savez(os.path.join(W, 'train.npz'), X=X, y=y)
    for k, L in test.items():
        Xt, yt = rast_list(L)
        np.savez(os.path.join(W, 'test_%s.npz' % k), X=Xt, y=yt, w=np.array([w for _, _, w in L]))
        print('Test', k, Xt.shape)
    with open(os.path.join(W, 'counts.pkl'), 'wb') as g:
        pickle.dump(dict(raw={c: (len(POOL[c]['c']), len(POOL[c]['h'])) for c in CLASSES}, target=T,
                         test={k: collections.Counter(c for c, _, _ in L) for k, L in test.items()}), g)


if __name__ == '__main__':
    main()
