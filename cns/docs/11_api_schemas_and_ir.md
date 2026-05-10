# 11 — API, Schemas, and Intermediate Representations

## EvidenceAtom

```json
{
  "id": "E123",
  "source_id": "DOC45",
  "span": "...",
  "timestamp": "2026-05-10T00:00:00Z",
  "quality": 0.82,
  "metadata": {
    "author": "...",
    "venue": "...",
    "retrieval_score": 0.91
  }
}
```

## ClaimCandidate

```json
{
  "id": "C12",
  "text": "...",
  "canonical_frame": {
    "subject": "Drug X",
    "predicate": "reduces",
    "object": "Symptom Y",
    "qualifiers": {"population": "adults over 65"}
  },
  "evidence_refs": ["E123", "E124"],
  "extractor_confidence": 0.76
}
```

## GroundingReport

```json
{
  "claim_id": "C12",
  "citation_valid": true,
  "entailment": 0.84,
  "contradiction": 0.05,
  "neutral": 0.11,
  "status": "grounded",
  "notes": []
}
```

## TensorRule

```json
{
  "id": "R_support_transitive",
  "body": ["supports(x,y)", "supports(y,z)"],
  "head": "supports(x,z)",
  "temperature": 0.0,
  "policy": "strict",
  "weight": 1.0
}
```

## ProofTrace

```json
{
  "id": "P44",
  "claim_id": "C12",
  "rules": ["R_support_direct"],
  "evidence": ["E123"],
  "intermediate_claims": [],
  "temperature": 0.0,
  "checksum": "sha256:..."
}
```

## WorldView

```json
{
  "id": "W1",
  "facts": ["C12", "C14"],
  "assumptions": ["A_population_over_65"],
  "latent_contexts": ["Z_age_group"],
  "proofs": ["P44"],
  "energy": 1.72,
  "posterior": 0.62,
  "contradiction_energy": 0.13,
  "parsimony_penalty": 0.08
}
```

## SynthesisReport

```json
{
  "query": "...",
  "top_worlds": ["W1", "W2", "W3"],
  "claims": [
    {
      "claim_id": "C12",
      "posterior": 0.73,
      "confidence": 0.61,
      "status": "probable",
      "estimative_language": "likely",
      "supporting_worlds": ["W1", "W3"],
      "conflicting_worlds": ["W2"],
      "evidence": ["E123"],
      "proofs": ["P44"]
    }
  ],
  "uncertainty": {
    "world_entropy": 0.43,
    "aleatory": 0.22,
    "epistemic": 0.18,
    "source": 0.11,
    "model": 0.09
  },
  "abstentions": [
    {"claim_id": "C17", "reason": "insufficient evidence"}
  ]
}
```

## API endpoints

### `POST /encode`

Input: corpus references + text.  
Output: evidence atoms and claim candidates.

### `POST /verify`

Input: claims + evidence atoms.  
Output: grounding reports.

### `POST /close`

Input: grounded claims + rules.  
Output: proof traces and closure facts.

### `POST /worlds`

Input: closure facts, contradictions, assumptions.  
Output: ranked worlds.

### `POST /synthesize`

Input: ranked worlds.  
Output: synthesis report.

### `POST /audit`

Input: synthesis report.  
Output: proof/evidence audit view.
