"""Chirality and Evidential Entanglement sketches."""
from __future__ import annotations
from collections import defaultdict
from math import exp
from cns8_types import SNO

def sigmoid(x: float) -> float:
    return 1.0 / (1.0 + exp(-x))

def evidence_entanglement(a: SNO, b: SNO, weights: dict[str, float] | None = None) -> float:
    weights = weights or {}
    ea, eb = set(a.evidence), set(b.evidence)
    union = ea | eb
    if not union:
        return 0.0
    inter = ea & eb
    return sum(weights.get(e, 1.0) for e in inter) / sum(weights.get(e, 1.0) for e in union)

def evidence_polarity_map(sno: SNO) -> dict[tuple[str, str], float]:
    """Map (evidence_id, claim_id) to signed stance support=+1 refute=-1."""
    out: dict[tuple[str, str], float] = defaultdict(float)
    for rel in sno.relations:
        if rel.type not in ("supports", "refutes"):
            continue
        sign = 1.0 if rel.type == "supports" else -1.0
        for e in rel.evidence_refs:
            out[(e, rel.target)] += sign * rel.weight
    return out

def evidence_polarity_chirality(a: SNO, b: SNO) -> float:
    pa, pb = evidence_polarity_map(a), evidence_polarity_map(b)
    keys = set(pa) | set(pb)
    if not keys:
        return 0.0
    return sum(abs(pa.get(k, 0.0) - pb.get(k, 0.0)) for k in keys) / len(keys)

def graph_chirality(a: SNO, b: SNO) -> float:
    """Simple edge-set disagreement proxy.

    Production implementation should use aligned signed incidence matrices.
    """
    ea = {(r.source, r.target, r.type) for r in a.relations}
    eb = {(r.source, r.target, r.type) for r in b.relations}
    union = ea | eb
    if not union:
        return 0.0
    return len(ea ^ eb) / len(union)

def productive_conflict_score(a: SNO, b: SNO, weights: dict[str, float] | None = None) -> float:
    weights = weights or {"graph": 0.30, "polarity": 0.30, "ent": 0.20, "interaction": 0.20}
    g = graph_chirality(a, b)
    p = evidence_polarity_chirality(a, b)
    ent = evidence_entanglement(a, b)
    raw = weights["graph"] * g + weights["polarity"] * p + weights["ent"] * ent + weights["interaction"] * p * ent
    return sigmoid(4.0 * (raw - 0.5))
