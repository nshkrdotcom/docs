from __future__ import annotations

from typing import Iterable, Tuple
import numpy as np


def brier_score(probs: Iterable[float], labels: Iterable[int]) -> float:
    p = np.asarray(list(probs), dtype=float)
    y = np.asarray(list(labels), dtype=float)
    return float(np.mean((p - y) ** 2))


def expected_calibration_error(probs: Iterable[float], labels: Iterable[int], bins: int = 10) -> float:
    p = np.asarray(list(probs), dtype=float)
    y = np.asarray(list(labels), dtype=float)
    ece = 0.0
    for i in range(bins):
        lo, hi = i / bins, (i + 1) / bins
        mask = (p >= lo) & (p < hi if i < bins - 1 else p <= hi)
        if not mask.any():
            continue
        conf = float(p[mask].mean())
        acc = float(y[mask].mean())
        ece += float(mask.mean()) * abs(acc - conf)
    return ece


def reliability_bins(probs: Iterable[float], labels: Iterable[int], bins: int = 10):
    p = np.asarray(list(probs), dtype=float)
    y = np.asarray(list(labels), dtype=float)
    out = []
    for i in range(bins):
        lo, hi = i / bins, (i + 1) / bins
        mask = (p >= lo) & (p < hi if i < bins - 1 else p <= hi)
        if mask.any():
            out.append({"lo": lo, "hi": hi, "confidence": float(p[mask].mean()), "accuracy": float(y[mask].mean()), "n": int(mask.sum())})
    return out
