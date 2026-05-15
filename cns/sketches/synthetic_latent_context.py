"""Synthetic latent-context generator sketch."""
from __future__ import annotations
from dataclasses import dataclass
import random

@dataclass
class SyntheticCase:
    evidence: list[str]
    claim_a: str
    claim_b: str
    hidden_context: str
    expected_synthesis: str

CONTEXTS = ["time_period", "subgroup", "dose", "jurisdiction", "measurement_method", "definition"]

def generate_case(seed: int | None = None) -> SyntheticCase:
    rng = random.Random(seed)
    context = rng.choice(CONTEXTS)
    value_a, value_b = "A", "B"
    evidence = [
        f"Evidence E1 says predicate P holds under {context}={value_a}.",
        f"Evidence E2 says predicate P does not hold under {context}={value_b}.",
    ]
    return SyntheticCase(
        evidence=evidence,
        claim_a="P holds.",
        claim_b="P does not hold.",
        hidden_context=context,
        expected_synthesis=f"P is conditional on {context}; it holds for {value_a} and does not hold for {value_b}.",
    )

if __name__ == "__main__":
    for i in range(3):
        print(generate_case(i))
