"""cnn2 in numpy: 28x28 -> conv3x3 C1 ReLU -> max2 -> conv3x3 C2 ReLU -> max2 (11->5) -> fc F ReLU -> fc N.
Speicherreihenfolge wie cnnEval der Mathe-App: Kanal zuletzt; W1[(di*3+dj), k], W2[(di*3+dj)*C1+ch, k],
W3[(i*5+j)*C2+k, f], W4[f, n]."""
import numpy as np


def init(C1, C2, F, N, seed=0, dtype=np.float32):
    r = np.random.default_rng(seed)
    he = lambda nin, shape: (r.normal(0, np.sqrt(2.0 / nin), shape)).astype(dtype)
    return {'W1': he(9, (9, C1)), 'b1': np.zeros(C1, dtype),
            'W2': he(9 * C1, (9 * C1, C2)), 'b2': np.zeros(C2, dtype),
            'W3': he(25 * C2, (25 * C2, F)), 'b3': np.zeros(F, dtype),
            'W4': (r.normal(0, np.sqrt(1.0 / F), (F, N))).astype(dtype), 'b4': np.zeros(N, dtype)}


def im2col3(x):
    """x (B,H,W,C) -> (B,H-2,W-2,9*C), Spaltenindex (di*3+dj)*C+ch"""
    B, H, W_, C = x.shape
    cols = [x[:, di:di + H - 2, dj:dj + W_ - 2, :] for di in range(3) for dj in range(3)]
    return np.concatenate(cols, axis=3)


def col2im3(dcol, H, W_, C):
    B, h, w, _ = dcol.shape
    dx = np.zeros((B, H, W_, C), dcol.dtype)
    d = dcol.reshape(B, h, w, 9, C)
    for di in range(3):
        for dj in range(3):
            dx[:, di:di + h, dj:dj + w, :] += d[:, :, :, di * 3 + dj, :]
    return dx


def pool2(x):
    """(B,H,W,C) -> max über 2x2, H,W abgerundet"""
    B, H, W_, C = x.shape
    h, w = H // 2, W_ // 2
    xc = x[:, :2 * h, :2 * w, :].reshape(B, h, 2, w, 2, C)
    m = xc.max(axis=(2, 4))
    return m, xc


def pool2_back(dm, xc, m, H, W_):
    B, h, _, w, _, C = xc.shape
    mask = (xc == m[:, :, None, :, None, :])
    # bei Gleichstand nur eine Position (erste) bekommt den Gradienten
    cnt = mask.sum(axis=(2, 4), keepdims=True)
    mask = mask / np.maximum(cnt, 1)
    dxc = mask * dm[:, :, None, :, None, :]
    dx = np.zeros((B, H, W_, C), dm.dtype)
    dx[:, :2 * h, :2 * w, :] = dxc.reshape(B, 2 * h, 2 * w, C)
    return dx


def forward(P, x, train=False, drop=0.0, rng=None):
    """x: (B,784) float -> logits, cache"""
    B = x.shape[0]
    C1 = P['W1'].shape[1]
    C2 = P['W2'].shape[1]
    xi = x.reshape(B, 28, 28, 1)
    X1 = im2col3(xi)                                   # B,26,26,9
    a1 = X1.reshape(-1, 9) @ P['W1'] + P['b1']
    a1 = a1.reshape(B, 26, 26, C1)
    r1 = np.maximum(a1, 0)
    p1, xc1 = pool2(r1)                                # B,13,13,C1
    X2 = im2col3(p1)                                   # B,11,11,9*C1
    a2 = X2.reshape(-1, 9 * C1) @ P['W2'] + P['b2']
    a2 = a2.reshape(B, 11, 11, C2)
    r2 = np.maximum(a2, 0)
    p2, xc2 = pool2(r2)                                # B,5,5,C2
    f = p2.reshape(B, -1)
    h = np.maximum(f @ P['W3'] + P['b3'], 0)
    mask = None
    hd = h
    if train and drop > 0:
        mask = (rng.random(h.shape) >= drop).astype(h.dtype) / (1 - drop)
        hd = h * mask
    z = hd @ P['W4'] + P['b4']
    cache = (x, X1, a1, r1, p1, xc1, X2, a2, r2, p2, xc2, f, h, hd, mask)
    return z, cache


def backward(P, cache, dz):
    x, X1, a1, r1, p1, xc1, X2, a2, r2, p2, xc2, f, h, hd, mask = cache
    B = x.shape[0]
    C1 = P['W1'].shape[1]
    C2 = P['W2'].shape[1]
    g = {}
    g['W4'] = hd.T @ dz
    g['b4'] = dz.sum(0)
    dh = dz @ P['W4'].T
    if mask is not None:
        dh = dh * mask
    dh = dh * (h > 0)
    g['W3'] = f.T @ dh
    g['b3'] = dh.sum(0)
    df = (dh @ P['W3'].T).reshape(B, 5, 5, C2)
    dr2 = pool2_back(df, xc2, p2, 11, 11)
    da2 = (dr2 * (a2 > 0)).reshape(-1, C2)
    g['W2'] = X2.reshape(-1, 9 * C1).T @ da2
    g['b2'] = da2.sum(0)
    dX2 = (da2 @ P['W2'].T).reshape(B, 11, 11, 9 * C1)
    dp1 = col2im3(dX2, 13, 13, C1)
    dr1 = pool2_back(dp1, xc1, p1, 26, 26)
    da1 = (dr1 * (a1 > 0)).reshape(-1, C1)
    g['W1'] = X1.reshape(-1, 9).T @ da1
    g['b1'] = da1.sum(0)
    return g


def softmax(z):
    z = z - z.max(1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(1, keepdims=True)


def loss_grad(z, y, smooth=0.0):
    B, N = z.shape
    p = softmax(z)
    t = np.full((B, N), smooth / N, z.dtype)
    t[np.arange(B), y] += 1 - smooth
    loss = -(t * np.log(np.maximum(p, 1e-12))).sum() / B
    return loss, (p - t) / B


def embed(P, x):
    z, cache = forward(P, x)
    h = cache[12]
    n = np.sqrt((h * h).sum(1, keepdims=True))
    return h / np.where(n > 0, n, 1)


class Adam:
    def __init__(self, P, lr=1e-3, b1=0.9, b2=0.999, eps=1e-8, wd=0.0):
        self.m = {k: np.zeros_like(v) for k, v in P.items()}
        self.v = {k: np.zeros_like(v) for k, v in P.items()}
        self.t = 0
        self.lr, self.b1, self.b2, self.eps, self.wd = lr, b1, b2, eps, wd

    def step(self, P, g, lr=None):
        lr = self.lr if lr is None else lr
        self.t += 1
        c1 = 1 - self.b1 ** self.t
        c2 = 1 - self.b2 ** self.t
        for k in P:
            gk = g[k]
            if self.wd and k.startswith('W'):
                gk = gk + self.wd * P[k]
            self.m[k] *= self.b1
            self.m[k] += (1 - self.b1) * gk
            self.v[k] *= self.b2
            self.v[k] += (1 - self.b2) * gk * gk
            P[k] -= (lr * (self.m[k] / c1) / (np.sqrt(self.v[k] / c2) + self.eps)).astype(P[k].dtype)


def gradcheck(seed=0):
    """numerische Prüfung in float64 an kleiner Stichprobe"""
    r = np.random.default_rng(seed)
    P = init(4, 5, 7, 6, seed=seed, dtype=np.float64)
    for k in P:
        if k.startswith('b'):
            P[k] = r.normal(0, 0.1, P[k].shape)
    x = r.random((3, 784))
    x[x < 0.5] = 0
    y = np.array([0, 3, 5])
    z, cache = forward(P, x)
    L, dz = loss_grad(z, y, smooth=0.1)
    g = backward(P, cache, dz)
    worst = 0.0
    for k in P:
        flat = np.abs(g[k]).ravel()
        top = list(np.argsort(-flat)[:8]) + list(r.integers(0, flat.size, 6))
        errs = []
        for fi in top:
            ix = np.unravel_index(fi, P[k].shape)
            old = P[k][ix]
            eps = 1e-5
            P[k][ix] = old + eps
            Lp = loss_grad(forward(P, x)[0], y, 0.1)[0]
            P[k][ix] = old - eps
            Lm = loss_grad(forward(P, x)[0], y, 0.1)[0]
            P[k][ix] = old
            num = (Lp - Lm) / (2 * eps)
            ana = g[k][ix]
            den = abs(num) + abs(ana)
            rel = abs(num - ana) / den if den > 1e-10 else 0.0
            errs.append(rel)
        worst = max(worst, max(errs))
        print('%s |g|max %.3e  max rel. Fehler %.2e (Median %.2e)' % (k, flat.max(), max(errs), np.median(errs)))
    return worst


if __name__ == '__main__':
    w = gradcheck()
    print('Gradientenprüfung: größter relativer Fehler %.3e' % w)
