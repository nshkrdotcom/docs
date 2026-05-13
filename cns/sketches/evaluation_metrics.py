from __future__ import annotations

from typing import Iterable, Mapping


def citation_validity(claims: Iterable[Mapping], evidence_ids: set[str]) -> float:
    claims = list(claims)
    if not claims:
        return 1.0
    ok = 0
    for c in claims:
        refs = set(c.get("evidence_refs", []))
        if refs and refs <= evidence_ids:
            ok += 1
    return ok / len(claims)


def zero_temperature_hallucination_rate(promoted_claims: Iterable[Mapping]) -> float:
    claims = list(promoted_claims)
    if not claims:
        return 0.0
    bad = 0
    for c in claims:
        strict = c.get("status") == "proven"
        proofs = c.get("proofs", [])
        if strict and not proofs:
            bad += 1
    return bad / len(claims)


def top_k_world_coverage(worlds: list[Mapping], gold_world_id: str, k: int = 3) -> bool:
    ranked = sorted(worlds, key=lambda w: w.get("posterior", 0.0), reverse=True)
    return any(w.get("id") == gold_world_id for w in ranked[:k])


def false_absence_penalty_rate(cases: Iterable[Mapping]) -> float:
    """Rate of cases where absence was used as refutation without access basis."""
    cases = list(cases)
    if not cases:
        return 0.0
    bad = 0
    for c in cases:
        if c.get("penalized_as_absence") and not c.get("evidence_of_absence_valid"):
            bad += 1
    return bad / len(cases)
