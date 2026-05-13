from __future__ import annotations

from typing import Iterable

try:
    from cns_types import InstitutionalIncentiveProfile, RecordAccessState
except ImportError:  # pragma: no cover
    from .cns_types import InstitutionalIncentiveProfile, RecordAccessState


def is_evidence_of_absence(record: RecordAccessState, threshold: float = 0.65) -> bool:
    """Return True only when non-supportive evidence can reasonably count as evidence of absence."""
    return (
        record.access_state == "available"
        and record.production_status in {"produced_non_supportive", "produced_refuting"}
        and record.generation_duty >= threshold
        and record.expected_observability >= threshold
        and record.confidence >= threshold
    )


def is_record_contingent(record: RecordAccessState, threshold: float = 0.65) -> bool:
    """Return True when a claim should remain contingent on missing or unavailable records."""
    return (
        record.generation_duty >= threshold
        and record.expected_observability >= threshold
        and record.access_state in {"inaccessible", "sealed", "withheld", "destroyed", "unknown"}
    )


def suppression_score(
    record: RecordAccessState,
    incentives: Iterable[InstitutionalIncentiveProfile],
) -> float:
    """Soft score for strategic non-production. Not strict proof."""
    if record.access_state not in {"withheld", "destroyed", "sealed"}:
        return 0.0
    by_actor = {i.actor_id: i for i in incentives}
    i = by_actor.get(record.controller)
    if i is None:
        base = 0.0
    else:
        base = i.record_control * i.exposure_if_claim_true * i.incentive_to_conceal
        base *= 1.0 - min(1.0, i.concealment_penalty)
    return max(0.0, min(1.0, record.generation_duty * record.expected_observability * base))


def access_loss(record: RecordAccessState) -> float:
    """Penalty for unresolved access state in a world."""
    if record.access_state == "available":
        return 0.0
    if record.access_state == "not_generated":
        return 0.1 * (1.0 - record.confidence)
    return record.generation_duty * record.expected_observability * (1.0 - record.confidence)
