from __future__ import annotations

from typing import Dict, Iterable, Tuple

import numpy as np

RelationTuple = Tuple[str, str, str, float]  # src, kind, dst, weight

SIGN = {
    "supports": 1.0,
    "implies": 1.0,
    "qualifies": 0.5,
    "depends_on": 0.3,
    "independent": 0.0,
    "refutes": -1.0,
}


def graph_chiral_tensor(rel_a: Iterable[RelationTuple], rel_b: Iterable[RelationTuple]):
    """Compute a small incidence-based graph chiral tensor."""
    rel_a = list(rel_a)
    rel_b = list(rel_b)
    nodes = sorted({x for r in rel_a + rel_b for x in (r[0], r[2])})
    idx = {n: i for i, n in enumerate(nodes)}
    n = len(nodes)

    def edge_key(r: RelationTuple):
        return r[0], r[1], r[2]

    by_a = {edge_key(r): r for r in rel_a}
    by_b = {edge_key(r): r for r in rel_b}
    keys = sorted(set(by_a) | set(by_b))
    C = np.zeros((n, n), dtype=float)
    for key in keys:
        va = np.zeros(n)
        vb = np.zeros(n)
        if key in by_a:
            src, kind, dst, weight = by_a[key]
            va[idx[src]] -= SIGN.get(kind, 0.0) * weight
            va[idx[dst]] += SIGN.get(kind, 0.0) * weight
        if key in by_b:
            src, kind, dst, weight = by_b[key]
            vb[idx[src]] -= SIGN.get(kind, 0.0) * weight
            vb[idx[dst]] += SIGN.get(kind, 0.0) * weight
        d = va - vb
        C += np.outer(d, d)
    return C, float(np.trace(C))


def evidence_entanglement(evidence_a: Iterable[str], evidence_b: Iterable[str], weights: Dict[str, float] | None = None) -> float:
    weights = weights or {}
    A = set(evidence_a)
    B = set(evidence_b)
    if not A and not B:
        return 0.0
    inter = A & B
    union = A | B
    num = sum(weights.get(e, 1.0) for e in inter)
    den = sum(weights.get(e, 1.0) for e in union)
    return num / den if den else 0.0


def round_trip_chirality(original_logic: np.ndarray, regrounded_logic: np.ndarray) -> float:
    """Distance between a logic state and rendered-then-regrounded logic state."""
    return float(np.linalg.norm(original_logic - regrounded_logic))


def residual_energy(support_tensor: np.ndarray, refute_tensor: np.ndarray) -> float:
    """Contradiction residual energy."""
    return float(np.linalg.norm(support_tensor - refute_tensor) ** 2)


def access_chirality(narrative_access: np.ndarray, structured_access: np.ndarray) -> float:
    """Distance between narrative-implied and structured access states."""
    return float(np.linalg.norm(narrative_access - structured_access))
