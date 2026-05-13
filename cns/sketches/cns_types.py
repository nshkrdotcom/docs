from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Literal, Optional, Tuple


ClaimStatus = Literal[
    "proven",
    "probable",
    "plausible",
    "record_contingent",
    "conflicted",
    "unsupported",
    "rejected",
]

RulePolicy = Literal["strict", "soft", "access", "exploratory"]
AccessStateValue = Literal[
    "available",
    "inaccessible",
    "sealed",
    "withheld",
    "destroyed",
    "not_generated",
    "unknown",
]


@dataclass(frozen=True)
class EvidenceAtom:
    id: str
    source_id: str
    span: str
    quality: float = 1.0
    timestamp: Optional[str] = None
    access_path: str = "runtime_corpus"
    metadata: Dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class RecordAccessState:
    id: str
    record_type: str
    controller: str = "unknown"
    generation_duty: float = 0.0
    expected_observability: float = 0.0
    access_state: AccessStateValue = "unknown"
    production_status: str = "unknown"
    confidence: float = 0.0
    notes: List[str] = field(default_factory=list)


@dataclass(frozen=True)
class InstitutionalIncentiveProfile:
    actor_id: str
    role: str = "unknown"
    record_control: float = 0.0
    exposure_if_claim_true: float = 0.0
    incentive_to_disclose: float = 0.0
    incentive_to_conceal: float = 0.0
    concealment_penalty: float = 0.0
    source_reliability_prior: float = 0.5


@dataclass
class Claim:
    id: str
    text: str
    evidence_refs: List[str] = field(default_factory=list)
    record_dependencies: List[str] = field(default_factory=list)
    status: ClaimStatus = "unsupported"
    entailment: float = 0.0
    extraction_confidence: float = 0.0
    qualifiers: Dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class Relation:
    src: str
    kind: Literal[
        "supports",
        "refutes",
        "implies",
        "qualifies",
        "depends_on",
        "independent",
    ]
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
    intermediate_claims: List[str] = field(default_factory=list)
    temperature: float = 0.0


@dataclass
class WorldView:
    id: str
    facts: List[str]
    assumptions: List[str] = field(default_factory=list)
    latent_contexts: List[str] = field(default_factory=list)
    access_hypotheses: List[str] = field(default_factory=list)
    incentive_hypotheses: List[str] = field(default_factory=list)
    proofs: List[ProofTrace] = field(default_factory=list)
    energy: float = 0.0
    posterior: float = 0.0
    contradiction_energy: float = 0.0
    access_loss: float = 0.0
    parsimony_penalty: float = 0.0


@dataclass
class ClaimRanking:
    claim_id: str
    posterior: float
    strict_support: float
    confidence: float
    status: ClaimStatus
    supporting_worlds: List[str]
    conflicting_worlds: List[str]
    record_dependencies: List[str] = field(default_factory=list)


@dataclass
class SynthesisReport:
    query: str
    worlds: List[WorldView]
    claims: List[ClaimRanking]
    uncertainty: Dict[str, float]
    access_states: List[RecordAccessState] = field(default_factory=list)
    notes: List[str] = field(default_factory=list)
