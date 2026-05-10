from __future__ import annotations

from typing import Dict, Iterable, List, Set
import math
from cns_types import WorldView

def world_energy(
    support_score: float,
    grounding_loss: float,
    contradiction_energy: float,
    rule_loss: float,
    parsimony_penalty: float,
    weights: Dict[str, float] | None = None,
) -> float:
    """Energy function for a candidate world."""
    w = {
        "grounding": 2.0,
        "contradiction": 2.0,
        "rule": 1.0,
        "parsimony": 0.5,
        "support": 2.0,
    }
    if weights:
        w.update(weights)
    return (
        w["grounding"] * grounding_loss
        + w["contradiction"] * contradiction_energy
        + w["rule"] * rule_loss
        + w["parsimony"] * parsimony_penalty
        - w["support"] * support_score
    )

def normalize_worlds(worlds: List[WorldView], temperature: float = 1.0) -> List[WorldView]:
    """Softmax over negative energy."""
    if not worlds:
        return worlds
    logits = [-(w.energy / max(temperature, 1e-9)) for w in worlds]
    m = max(logits)
    exps = [math.exp(x - m) for x in logits]
    z = sum(exps)
    for w, e in zip(worlds, exps):
        w.posterior = e / z
    return worlds

def claim_posterior(claim_id: str, worlds: Iterable[WorldView]) -> float:
    """P(claim | evidence) = sum posterior mass of worlds containing claim."""
    return sum(w.posterior for w in worlds if claim_id in set(w.facts))

def normalized_entropy(worlds: Iterable[WorldView]) -> float:
    ps = [w.posterior for w in worlds if w.posterior > 0]
    if len(ps) <= 1:
        return 0.0
    h = -sum(p * math.log(p) for p in ps)
    return h / math.log(len(ps))

def confidence(posterior: float, coverage: float, calibration: float, entropy: float, contradiction_mass: float) -> float:
    return max(0.0, min(1.0, posterior * coverage * calibration * (1.0 - entropy) * (1.0 - contradiction_mass)))
