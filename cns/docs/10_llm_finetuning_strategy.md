# 10 — LLM and Fine-Tuning Strategy

## Principle

LLMs are proposal and rendering tools. They are not truth oracles.

## Allowed LLM roles

| Role | LLM use |
|---|---|
| Proposer | extract claims, relations, candidate SNOs |
| Antagonist | generate critique probes and possible contradictions |
| Predicate labeler | label latent tensor factors in readable language |
| Synthesizer | render proof-grounded logic into coherent narrative |
| Auditor | generate readable reports from structured audit data |

## Forbidden LLM roles

- final truth voting;
- promotion of strict claims without proof trace;
- hidden use of gold labels;
- silent invention of evidence IDs;
- replacing tensor proof closure;
- replacing critic gates.

## Fine-tuning scope

Fine-tuning is optional and bounded.

Recommended fine-tuning targets:

1. claim extraction into SNO schema;
2. relation extraction;
3. citation formatting and evidence span copying;
4. predicate label normalization;
5. report rendering from structured audit data.

Do not fine-tune the model to make final truth judgments unless the output is clearly a calibrated classifier and is not used as a runtime oracle.

## LoRA

Use LoRA or similar adapter methods for extraction and formatting where the goal is schema reliability and citation discipline.

Recommended first adapters:

- `cns8_sno_extractor_lora`
- `cns8_relation_extractor_lora`
- `cns8_audit_renderer_lora`

## Runtime policy

At runtime:

```text
LLM output → parser → citation validator → entailment critic → proof closure → critic ensemble
```

LLM output that fails validation is not promoted.

## Training with oracles

Allowed:

- gold labels for FEVER/SciFact training;
- expert labels for evaluation;
- human critique labels for calibration;
- synthetic latent-context labels for predicate-invention tests.

Required:

- record oracle source;
- prevent labels from appearing in runtime prompts;
- freeze test labels before experiments;
- run leakage checks.

## Runtime without oracles

Forbidden:

- answer keys;
- gold labels;
- hidden solution states;
- LLM judge used as truth source;
- direct access to synthetic generation parameters during inference.

## Prompt design

Prompts should be role-bounded and output schema-constrained. See `prompts/`.

## Model choice

CNS 8.0 can use:

- hosted LLM APIs for extraction/rendering;
- local open-weight models for reproducibility;
- small NLI/cross-encoder models for grounding;
- embedding models for retrieval and approximate alignment;
- tensor/proof code for promotion decisions.

## Implementation recommendation

Start with orchestration, not broad fine-tuning.

First build the deterministic substrate:

1. evidence atom store;
2. SNO parser;
3. citation validator;
4. entailment scorer;
5. proof trace recorder;
6. chirality and entanglement metrics;
7. synthetic residual tensor tests.

Then fine-tune extraction only if baseline prompting fails schema or citation targets.
