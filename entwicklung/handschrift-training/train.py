"""Training cnn2. Aufruf: python3 -I train.py <work> [epochen] [C1 C2 F]"""
import sys, os, time, json
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from cnn import init, forward, backward, loss_grad, Adam, softmax
from classes import CLASSES

W = sys.argv[1]
EP = int(sys.argv[2]) if len(sys.argv) > 2 else 12
C1, C2, F = (int(v) for v in sys.argv[3:6]) if len(sys.argv) > 5 else (24, 48, 160)
N = len(CLASSES)
B = 256
LR0, LR1, WARM = 2e-3, 3e-5, 300
DROP, SMOOTH, WD = 0.2, 0.05, 1e-5


def predict(P, X, bs=1024):
    out = []
    for i in range(0, len(X), bs):
        z, _ = forward(P, X[i:i + bs].astype(np.float32) / 255)
        out.append(softmax(z))
    return np.concatenate(out)


def log(msg):
    print(msg, flush=True)


def main():
    d = np.load(os.path.join(W, 'train.npz'))
    X, y = d['X'], d['y'].astype(np.int64)
    tests = {}
    for k in ('crohme', 'hasy', 'hasy_anon'):
        t = np.load(os.path.join(W, 'test_%s.npz' % k))
        tests[k] = (t['X'], t['y'].astype(np.int64))
    log('Training %d, Klassen %d, C1=%d C2=%d F=%d, Epochen %d' % (len(X), N, C1, C2, F, EP))
    P = init(C1, C2, F, N, seed=1)
    opt = Adam(P, wd=WD)
    rng = np.random.default_rng(5)
    steps = EP * (len(X) // B)
    st = 0
    t0 = time.time()
    for ep in range(EP):
        perm = rng.permutation(len(X))
        tl, tc, tn = 0.0, 0, 0
        for bi in range(len(X) // B):
            idx = perm[bi * B:(bi + 1) * B]
            xb = X[idx].astype(np.float32) / 255
            yb = y[idx]
            lr = LR0 * min(1.0, (st + 1) / WARM)
            lr = LR1 + (lr - LR1) * 0.5 * (1 + np.cos(np.pi * st / steps))
            z, cache = forward(P, xb, True, DROP, rng)
            L, dz = loss_grad(z, yb, SMOOTH)
            g = backward(P, cache, dz.astype(np.float32))
            opt.step(P, g, lr)
            st += 1
            tl += L * len(idx)
            tc += int((z.argmax(1) == yb).sum())
            tn += len(idx)
            if bi % 200 == 0:
                log('  ep %d it %d loss %.4f acc %.4f lr %.2e  %.0fs' % (ep + 1, bi, tl / tn, tc / tn, lr, time.time() - t0))
        res = {}
        for k, (Xt, yt) in tests.items():
            p = predict(P, Xt)
            res[k] = float((p.argmax(1) == yt).mean())
        log('Epoche %d: Trainingsverlust %.4f, Trainingsgenauigkeit %.4f, Test %s, Zeit %.0fs' %
            (ep + 1, tl / tn, tc / tn, json.dumps({k: round(v, 4) for k, v in res.items()}), time.time() - t0))
        np.savez(os.path.join(W, 'ckpt_ep%02d.npz' % (ep + 1)), **P)
        np.savez(os.path.join(W, 'model_last.npz'), **P)
    log('fertig, Gesamtzeit %.0fs' % (time.time() - t0))


if __name__ == '__main__':
    main()
