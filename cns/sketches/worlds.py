from __future__ import annotations

import math
from typing import Iterable, List, Mapping

try:
    from cns_types import WorldView
except ImportError:  # pragma: no cover
    from .cns_types import WorldView


def world_energy(w: Mapping, weights: Mapping[str, float] | None = None) -> float:
    """Energy function for a candidate world."""
    weights = weights or {
        "grounding": 2.0,
        "contradiction": 2.0,
        "rule": 1.0,
        "parsimony": 0.5,
        "access": 1.5,
        "incentive": 0.8,
        "support": 2.0,
    }
    return (
        weights["grounding"] * float(w.get("grounding_loss", 0.0))
        + weights["contradiction"] * float(w.get("contradiction_energy", 0.0))
        + weights["rule"] * float(w.get("rule_loss", 0.0))
        + weights["parsimony"] * float(w.get("parsimony_penalty", 0.0))
        + weights["access"] * float(w.get("access_loss", 0.0))
        + weights["incentive"] * float(w.get("incentive_loss", 0.0))
        - weights["support"] * float(w.get("support", 0.0))
    )


def normalize_worlds(worlds: List[WorldView], temperature: float = 1.0) -> List[WorldView]:
    """Softmax over negative energy."""
    if not worlds:
        return []
    logits = [-(w.energy / max(temperature, 1e-9)) for w in worlds]
    m = max(logits)
    exps = [math.exp(x - m) for x in logits]
    z = sum(exps)
    for w, e in zip(worlds, exps):
        w.posterior = e / z if z else 0.0
    return worlds


def claim_posterior(claim_id: str, worlds: Iterable[WorldView]) -> float:
    """P(claim | evidence, access, incentives) = posterior mass of worlds containing claim."""
    return sum(w.posterior for w in worlds if claim_id in set(w.facts))


def strict_support(claim_id: str, worlds: Iterable[WorldView]) -> float:
    """Posterior mass of worlds where claim has a zero-temperature proof trace."""
    total = 0.0
    for w in worlds:
        if any(p.claim_id == claim_id and p.temperature == 0.0 for p in w.proofs):
            total += w.posterior
    return total


def normalized_entropy(worlds: Iterable[WorldView]) -> float:
    ps = [w.posterior for w in worlds if w.posterior > 0]
    if len(ps) <= 1:
        return 0.0
    h = -sum(p * math.log(p) for p in ps)
    return h / math.log(len(ps))


def confidence(
    posterior: float,
    coverage: float,
    calibration: float,
    entropy: float,
    contradiction_mass: float,
    access_uncertainty: float = 0.0,
) -> float:
    return max(
        0.0,
        min(
            1.0,
            posterior
            * coverage
            * calibration
            * (1.0 - entropy)
            * (1.0 - contradiction_mass)
            * (1.0 - access_uncertainty),
        ),
    )
