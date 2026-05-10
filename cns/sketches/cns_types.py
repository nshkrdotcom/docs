from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Literal, Optional, Tuple

ClaimStatus = Literal[
    "proven", "probable", "plausible", "conflicted", "unsupported", "rejected"
]
RulePolicy = Literal["strict", "soft", "exploratory"]

@dataclass(frozen=True)
class EvidenceAtom:
    id: str
    source_id: str
    span: str
    quality: float = 1.0
    timestamp: Optional[str] = None
    metadata: Dict[str, str] = field(default_factory=dict)

@dataclass
class Claim:
    id: str
    text: str
    evidence_refs: List[str] = field(default_factory=list)
    status: ClaimStatus = "unsupported"
    entailment: float = 0.0
    extraction_confidence: float = 0.0
    qualifiers: Dict[str, str] = field(default_factory=dict)

@dataclass(frozen=True)
class Relation:
    src: str
    kind: Literal["supports", "refutes", "implies", "qualifies", "independent"]
    dst: str
    weight: float = 1.0
    evidence_refs: Tuple[str, ...] = ()

@dataclass(frozen=True)
class TensorRule:
    id: str
    body: Tuple[str, ...]
    head: str
    temperature: float = 0.0
    policy: RulePolicy = "strict"
    weight: float = 1.0

@dataclass
class ProofTrace:
    id: str
    claim_id: str
    rule_ids: List[str]
    evidence_refs: List[str]
    temperature: float = 0.0
    intermediate_claims: List[str] = field(default_factory=list)

@dataclass
class WorldView:
    id: str
    facts: List[str]
    assumptions: List[str] = field(default_factory=list)
    latent_contexts: List[str] = field(default_factory=list)
    proofs: List[ProofTrace] = field(default_factory=list)
    energy: float = 0.0
    posterior: float = 0.0
    contradiction_energy: float = 0.0
    parsimony_penalty: float = 0.0

@dataclass
class ClaimRanking:
    claim_id: str
    posterior: float
    confidence: float
    status: ClaimStatus
    supporting_worlds: List[str]
    conflicting_worlds: List[str]

@dataclass
class SynthesisReport:
    query: str
    worlds: List[WorldView]
    claims: List[ClaimRanking]
    uncertainty: Dict[str, float]
    notes: List[str] = field(default_factory=list)
