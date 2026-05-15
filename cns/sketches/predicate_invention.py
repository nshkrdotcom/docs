"""Residual tensor factorization sketch for predicate invention.

Uses matricized SVD as a placeholder for Tucker/CP decomposition.
"""
from __future__ import annotations
from dataclasses import dataclass
import numpy as np

@dataclass
class PredicateCandidate:
    axis: str
    index: int
    score: float
    label_hint: str

def build_residual_tensor(support: np.ndarray, refute: np.ndarray, resolved: np.ndarray | None = None) -> np.ndarray:
    """Unresolved contradiction mass: min(support, refute) * (1-resolved)."""
    if resolved is None:
        resolved = np.zeros_like(support)
    return np.minimum(support, refute) * (1.0 - resolved)

def factorize_context_mode(residual: np.ndarray, top_k: int = 3) -> list[PredicateCandidate]:
    """Find high-energy context factors by matricizing all but last axis."""
    if residual.ndim < 2:
        raise ValueError("residual tensor must have at least 2 axes")
    context_dim = residual.shape[-1]
    mat = residual.reshape((-1, context_dim))
    if mat.size == 0:
        return []
    _u, s, vt = np.linalg.svd(mat, full_matrices=False)
    candidates: list[PredicateCandidate] = []
    for k in range(min(top_k, len(s))):
        context_idx = int(np.argmax(np.abs(vt[k])))
        score = float(s[k] * abs(vt[k, context_idx]))
        candidates.append(PredicateCandidate("context", context_idx, score, f"latent_context_{context_idx}"))
    return candidates

def predicate_invention_utility(before_energy: float, after_energy: float, complexity: float) -> float:
    return max(0.0, before_energy - after_energy) / (1.0 + complexity)

if __name__ == "__main__":
    rng = np.random.default_rng(7)
    support = rng.random((4,3,4,2))
    refute = rng.random((4,3,4,2))
    residual = build_residual_tensor(support, refute)
    print(factorize_context_mode(residual))
