"""CNS 8.0 type sketches.

Not production code. These classes define the minimal shape for the MVP.
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Literal, Any

ClaimStatus = Literal["strict", "likely", "hypothesis", "unresolved", "rejected"]
RelationType = Literal[
    "supports", "refutes", "implies", "conditions", "narrows", "explains",
    "reframes", "in_tension_with", "equivalent_under_context", "latent_context_for"
]

@dataclass(frozen=True)
class EvidenceAtom:
    evidence_id: str
    document_id: str
    text: str
    start: int
    end: int
    text_hash: str
    source_quality: float = 1.0
    access_state: str = "available"
    metadata: dict[str, Any] = field(default_factory=dict)

@dataclass
class Claim:
    claim_id: str
    text: str
    status: ClaimStatus = "hypothesis"
    evidence_refs: list[str] = field(default_factory=list)
    proof_refs: list[str] = field(default_factory=list)
    confidence: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)

@dataclass
class Relation:
    source: str
    target: str
    type: RelationType
    evidence_refs: list[str] = field(default_factory=list)
    weight: float = 1.0

@dataclass
class ProofTrace:
    proof_id: str
    claim_id: str
    root_evidence: list[str]
    rules: list[str]
    intermediate_atoms: list[str] = field(default_factory=list)
    temperature: float = 0.0
    status: str = "valid"

@dataclass
class LatentPredicate:
    predicate_id: str
    label: str
    source: str
    grounding_status: str = "candidate"
    evidence_refs: list[str] = field(default_factory=list)
    piu: float = 0.0

@dataclass
class Residual:
    subject: str
    predicate: str
    object: str
    context: str
    support_mass: float
    refute_mass: float
    unresolved_mass: float

@dataclass
class SNO:
    sno_id: str
    hypothesis: str
    claims: list[Claim] = field(default_factory=list)
    relations: list[Relation] = field(default_factory=list)
    evidence: list[str] = field(default_factory=list)
    proof_traces: list[ProofTrace] = field(default_factory=list)
    residuals: list[Residual] = field(default_factory=list)
    latent_predicates: list[LatentPredicate] = field(default_factory=list)
    metrics: dict[str, float] = field(default_factory=dict)
    lineage: dict[str, Any] = field(default_factory=dict)
