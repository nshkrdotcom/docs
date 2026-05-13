from __future__ import annotations

from typing import Iterable, List, Tuple

import numpy as np


def brier_score(probs: Iterable[float], labels: Iterable[int]) -> float:
    p = np.asarray(list(probs), dtype=float)
    y = np.asarray(list(labels), dtype=float)
    if len(p) == 0:
        return 0.0
    return float(np.mean((p - y) ** 2))


def expected_calibration_error(probs: Iterable[float], labels: Iterable[int], bins: int = 10) -> float:
    p = np.asarray(list(probs), dtype=float)
    y = np.asarray(list(labels), dtype=float)
    if len(p) == 0:
        return 0.0
    ece = 0.0
    for i in range(bins):
        lo = i / bins
        hi = (i + 1) / bins
        mask = (p >= lo) & ((p < hi) if i < bins - 1 else (p <= hi))
        if not np.any(mask):
            continue
        conf = float(p[mask].mean())
        acc = float(y[mask].mean())
        ece += float(mask.mean()) * abs(conf - acc)
    return ece


def reliability_bins(probs: Iterable[float], labels: Iterable[int], bins: int = 10) -> List[Tuple[float, float, int]]:
    p = np.asarray(list(probs), dtype=float)
    y = np.asarray(list(labels), dtype=float)
    out = []
    for i in range(bins):
        lo = i / bins
        hi = (i + 1) / bins
        mask = (p >= lo) & ((p < hi) if i < bins - 1 else (p <= hi))
        if np.any(mask):
            out.append((float(p[mask].mean()), float(y[mask].mean()), int(mask.sum())))
    return out
