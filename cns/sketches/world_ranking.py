"""Possible-world ranking as auxiliary uncertainty reporting."""
from __future__ import annotations
from dataclasses import dataclass
from math import exp

@dataclass
class World:
    world_id: str
    log_likelihood: float
    log_prior: float
    residual_energy: float
    chirality_residual: float
    access_penalty: float = 0.0

def rank_worlds(worlds: list[World], alpha: float = 1.0, beta: float = 1.0) -> list[tuple[World, float]]:
    scores = []
    for w in worlds:
        score = w.log_likelihood + w.log_prior - alpha * w.residual_energy - beta * w.chirality_residual - w.access_penalty
        scores.append(score)
    if not scores:
        return []
    m = max(scores)
    probs = [exp(s - m) for s in scores]
    z = sum(probs)
    return sorted(zip(worlds, [p / z for p in probs]), key=lambda x: x[1], reverse=True)
