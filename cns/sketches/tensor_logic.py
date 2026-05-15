"""Tiny zero-temperature tensor-logic closure sketch.

This is deliberately small: boolean matrices plus explicit proof traces.
"""
from __future__ import annotations
from dataclasses import dataclass
import numpy as np

@dataclass
class ClosureResult:
    supported: np.ndarray
    proof_edges: list[tuple[int, int, str]]

def zero_temp_supported(cites: np.ndarray, entails: np.ndarray) -> ClosureResult:
    """Derive Supported[c] = step(sum_e Cites[c,e] * Entails[e,c]).

    cites: shape [claims, evidence]
    entails: shape [evidence, claims]
    """
    scores = (cites.astype(int) * entails.T.astype(int)).sum(axis=1)
    supported = scores > 0
    proofs: list[tuple[int, int, str]] = []
    for c in range(cites.shape[0]):
        for e in range(cites.shape[1]):
            if cites[c, e] and entails[e, c]:
                proofs.append((c, e, "supported_claim(c) <- cites(c,e) AND entails(e,c)"))
    return ClosureResult(supported=supported, proof_edges=proofs)

def zthr(strict_claim_ids: list[int], proof_edges: list[tuple[int, int, str]]) -> float:
    strict = set(strict_claim_ids)
    if not strict:
        return 0.0
    proved = {c for (c, _e, _rule) in proof_edges}
    missing = strict - proved
    return len(missing) / len(strict)

if __name__ == "__main__":
    cites = np.array([[1,0], [0,1], [0,0]], dtype=bool)
    entails = np.array([[1,0,0], [0,1,0]], dtype=bool)
    result = zero_temp_supported(cites, entails)
    print(result.supported.tolist())
    print(result.proof_edges)
    print("ZTHR", zthr([0,1], result.proof_edges))
