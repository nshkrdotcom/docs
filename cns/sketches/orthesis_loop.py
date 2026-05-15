"""Orthesis loop sketch."""
from __future__ import annotations
from dataclasses import dataclass
from typing import Callable, Any

@dataclass
class OrthesisStep:
    iteration: int
    residual: float
    accepted: bool
    notes: str

@dataclass
class OrthesisResult:
    accepted: bool
    final_state: Any
    steps: list[OrthesisStep]

def orthesis_loop(
    logic_state: Any,
    render: Callable[[Any], str],
    ground: Callable[[str], Any],
    distance: Callable[[Any, Any], float],
    update: Callable[[Any, Any], Any],
    threshold: float = 0.10,
    max_iters: int = 3,
) -> OrthesisResult:
    """Render -> ground -> compare -> update loop.

    Production code should preserve proof traces and compare proof-critical atoms.
    """
    state = logic_state
    steps: list[OrthesisStep] = []
    for i in range(max_iters):
        text = render(state)
        regrounded = ground(text)
        residual = distance(state, regrounded)
        accepted = residual <= threshold
        steps.append(OrthesisStep(i, residual, accepted, "round-trip residual"))
        if accepted:
            return OrthesisResult(True, state, steps)
        state = update(state, regrounded)
    return OrthesisResult(False, state, steps)
