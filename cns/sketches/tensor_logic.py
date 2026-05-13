from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List, Set, Tuple


@dataclass(frozen=True)
class HornRule:
    id: str
    body: Tuple[str, ...]
    head: str
    strict: bool = True


@dataclass
class ClosureResult:
    facts: Set[str]
    proofs: Dict[str, List[str]]


class TinyTensorLogic:
    """Minimal symbolic closure sketch.

    Real implementation should compile rules to tensor operations. This tiny
    class provides the same semantics for tests and toy examples.
    """

    def __init__(self, rules: Iterable[HornRule]):
        self.rules = list(rules)

    def close(self, facts: Iterable[str], max_steps: int = 64) -> ClosureResult:
        known = set(facts)
        proofs: Dict[str, List[str]] = {f: ["evidence"] for f in known}
        for _ in range(max_steps):
            changed = False
            for rule in self.rules:
                if all(atom in known for atom in rule.body) and rule.head not in known:
                    known.add(rule.head)
                    proofs[rule.head] = list(rule.body) + [rule.id]
                    changed = True
            if not changed:
                break
        return ClosureResult(facts=known, proofs=proofs)
