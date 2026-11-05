"""Rasterung nach DESIGN.md (verbindlich, identisch zur JS-Fassung).
Striche: Liste von Punktfolgen (n,2) bzw. [{x,y},...] in Originalkoordinaten, y nach unten.
1. BBox aller Punkte, lw = 10, s = (80-lw)/max(B,H,1), BBox-Mitte auf (56,56) im 112er-Raster
2. Deckung c = clamp(lw/2 + 0.5 - d, 0, 1), d = Abstand Pixelmitte (i+0.5, j+0.5) zur nächsten Polylinie
   (runde Enden, Einzelpunkt = Kreis), Maximum über alle Striche
3. 4x4-Blockmittel -> 28x28
4. Schwerpunkt (Pixelindex-Koordinaten, wie rasterize() der Mathe-App) ganzzahlig gerundet (Math.round) auf (14,14)
   ZUSATZ (Gleichstandsregel): dx = Math.round(14 - sx/sm + TIE), dy = Math.round(14 - sy/sm + TIE), TIE = 1e-3.
   Grund: symmetrische Zeichen (Einzelpunkt, gerade Striche) haben 14 - sx/sm = 0.5 genau auf der Rundungsgrenze;
   ohne TIE entscheidet Rundungsrauschen (0.49999999999999 / 0.50000000000001) über ein ganzes Pixel Versatz.
"""
import numpy as np

LW = 10.0
TIE = 1e-3
_IDX = np.arange(112, dtype=np.float64) + 0.5


def _as_arrays(strokes):
    out = []
    for st in strokes:
        if isinstance(st, np.ndarray):
            a = np.asarray(st, np.float64).reshape(-1, 2)
        else:
            a = np.array([[p['x'], p['y']] for p in st], np.float64).reshape(-1, 2)
        if len(a):
            out.append(a)
    return out


def js_round(v):
    return int(np.floor(v + 0.5))


def _segments(strokes):
    """Abbildung ins 112er-Raster; liefert Segmente (M,4) [ax,ay,bx,by] (Einzelpunkt: a=b)."""
    allp = np.concatenate(strokes)
    x0, y0 = allp.min(0)
    x1, y1 = allp.max(0)
    s = (80.0 - LW) / max(x1 - x0, y1 - y0, 1.0)
    ox = 56.0 - (x0 + x1) / 2.0 * s
    oy = 56.0 - (y0 + y1) / 2.0 * s
    segs = []
    for st in strokes:
        X = st[:, 0] * s + ox
        Y = st[:, 1] * s + oy
        if len(st) == 1:
            segs.append(np.array([[X[0], Y[0], X[0], Y[0]]]))
        else:
            segs.append(np.stack([X[:-1], Y[:-1], X[1:], Y[1:]], 1))
    return np.concatenate(segs)


def _dist_min(segs, px, py):
    """kleinster Abstand der Punkte (px,py) (beliebige gleiche Form) zu den Segmenten."""
    d2 = np.full(px.shape, np.inf)
    for ax, ay, bx, by in segs:
        vx, vy = bx - ax, by - ay
        L = vx * vx + vy * vy
        wx, wy = px - ax, py - ay
        if L > 0:
            t = np.clip((wx * vx + wy * vy) / L, 0.0, 1.0)
            ex, ey = wx - t * vx, wy - t * vy
        else:
            ex, ey = wx, wy
        np.minimum(d2, ex * ex + ey * ey, out=d2)
    return np.sqrt(d2)


def _finish(img112):
    a = img112.reshape(28, 4, 28, 4).mean(axis=(1, 3))
    sm = a.sum()
    if sm <= 0:
        return a.astype(np.float32).ravel()
    cols = np.arange(28)
    sx = (a * cols[None, :]).sum()
    sy = (a * cols[:, None]).sum()
    dx = js_round(14 - sx / sm + TIE)
    dy = js_round(14 - sy / sm + TIE)
    b = np.zeros_like(a)
    # b[y, x] = a[y - dy, x - dx]
    ys0, ys1 = max(0, dy), min(28, 28 + dy)
    xs0, xs1 = max(0, dx), min(28, 28 + dx)
    if ys0 < ys1 and xs0 < xs1:
        b[ys0:ys1, xs0:xs1] = a[ys0 - dy:ys1 - dy, xs0 - dx:xs1 - dx]
    return b.astype(np.float32).ravel()


def rasterize_ref(strokes):
    """Referenz: exakt nach Vorschrift, ganzes 112er-Raster (langsam, float64)."""
    strokes = _as_arrays(strokes)
    if not strokes:
        return np.zeros(784, np.float32)
    segs = _segments(strokes)
    PY, PX = np.meshgrid(_IDX, _IDX, indexing='ij')  # Zeile j = y, Spalte i = x
    d = _dist_min(segs, PX, PY)
    img = np.clip(LW / 2 + 0.5 - d, 0.0, 1.0)
    return _finish(img)


def rasterize_fast(strokes, chunk=64):
    """Gleiche Rechnung, aber nur im Fenster um die Striche und vektorisiert über Segmente (float32)."""
    strokes = _as_arrays(strokes)
    if not strokes:
        return np.zeros(784, np.float32)
    segs = _segments(strokes)
    r = LW / 2 + 0.5
    lo = np.floor(min(segs[:, 0].min(), segs[:, 2].min()) - r - 1)
    hi = np.ceil(max(segs[:, 0].max(), segs[:, 2].max()) + r + 1)
    loy = np.floor(min(segs[:, 1].min(), segs[:, 3].min()) - r - 1)
    hiy = np.ceil(max(segs[:, 1].max(), segs[:, 3].max()) + r + 1)
    i0, i1 = int(max(0, lo)), int(min(112, hi))
    j0, j1 = int(max(0, loy)), int(min(112, hiy))
    img = np.zeros((112, 112), np.float64)
    if i0 >= i1 or j0 >= j1:
        return _finish(img)
    px = (np.arange(i0, i1) + 0.5).astype(np.float32)
    py = (np.arange(j0, j1) + 0.5).astype(np.float32)
    PY, PX = np.meshgrid(py, px, indexing='ij')
    PX = PX.ravel()[:, None]
    PY = PY.ravel()[:, None]
    d2 = np.full(PX.shape[0], np.inf, np.float32)
    sg = segs.astype(np.float32)
    for k in range(0, len(sg), chunk):
        S = sg[k:k + chunk]
        ax, ay, bx, by = S[:, 0], S[:, 1], S[:, 2], S[:, 3]
        vx, vy = bx - ax, by - ay
        L = vx * vx + vy * vy
        Linv = np.where(L > 0, 1.0 / np.maximum(L, 1e-30), 0.0).astype(np.float32)
        wx = PX - ax
        wy = PY - ay
        t = np.clip((wx * vx + wy * vy) * Linv, 0.0, 1.0)
        ex = wx - t * vx
        ey = wy - t * vy
        np.minimum(d2, (ex * ex + ey * ey).min(1), out=d2)
    c = np.clip(r - np.sqrt(d2), 0.0, 1.0).reshape(j1 - j0, i1 - i0)
    img[j0:j1, i0:i1] = c
    return _finish(img)


def simplify(st, eps):
    """Douglas-Peucker (nur fürs Training, eps in Originaleinheiten)."""
    import cv2
    if len(st) <= 2:
        return st
    a = cv2.approxPolyDP(st.astype(np.float32).reshape(-1, 1, 2), float(eps), False).reshape(-1, 2)
    return a.astype(np.float64)
