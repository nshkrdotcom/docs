# 06 — LLM Strategy and Fine-Tuning Plan

## Rule: LLMs do not decide truth

In GCTS, LLMs may:

- extract candidate claims;
- propose relation candidates;
- propose latent context explanations;
- propose record-access hypotheses;
- summarize institutional roles and incentives from available evidence;
- render ranked worlds into readable prose;
- generate test cases or critique reports.

LLMs may not:

- promote a claim as strictly true without proof/evidence;
- assign final posterior mass;
- override citation/entailment gates;
- override access-state calibration;
- convert missing records directly into truth or falsity;
- act as runtime oracle.

## Phase 1: agent orchestration without fine-tuning

Start without fine-tuning to validate architecture. Use:

- a strong general LLM for extraction and report rendering;
- a retrieval model for evidence candidates;
- an NLI model for claim-evidence entailment;
- deterministic rule code for closure and world ranking;
- heuristic access-state classifiers;
- calibration on held-out labels and synthetic access tasks.

This tests whether the architecture has value independent of model adaptation.

## Phase 2: LoRA for extraction and schema fidelity

Fine-tune only if Phase 1 shows extraction bottlenecks.

Targets:

1. **Claim extraction adapter** — improves schema compliance and evidence span copying.
2. **Relation extraction adapter** — improves support/refute/implies/specializes labels.
3. **Citation linker adapter** — improves reference resolution.
4. **Access-state adapter** — improves classification of expected, unavailable, withheld, destroyed, and not-generated records.

Suggested LoRA settings:

- rank: 16–64 depending on model size and data;
- train attention layers first;
- freeze base model;
- use held-out citation/entailment/access validation;
- stop if grounding metrics degrade even when text quality improves.

## Phase 3: calibration models

Train lightweight calibrators, not truth engines:

- logistic/temperature scaling for entailment scores;
- world posterior calibration using Brier/ECE loss;
- abstention threshold calibrator;
- source reliability prior estimator;
- access-state probability calibrator;
- missingness and suppression likelihood calibrator.

## Training objective

For extraction/adaptation:

$$
\mathcal{L}=\mathcal{L}_{gen}+\lambda_1\mathcal{L}_{citation}+\lambda_2\mathcal{L}_{entailment}+\lambda_3\mathcal{L}_{schema}+\lambda_4\mathcal{L}_{access}+\lambda_5\mathcal{L}_{contrastive}.
$$

Where:

- $\mathcal{L}_{citation}$: invalid or missing evidence references;
- $\mathcal{L}_{entailment}$: claim not entailed by cited span;
- $\mathcal{L}_{schema}$: invalid output format;
- $\mathcal{L}_{access}$: incorrect access-state or record-duty classification;
- $\mathcal{L}_{contrastive}$: claim closer to true evidence than negative evidence.

## Oracle use policy

Allowed:

- labeled training examples;
- expert annotations for calibration;
- benchmark labels for evaluation;
- human review of system failures.

Forbidden during undersupervised runtime:

- querying gold labels;
- asking a human/model to directly decide final truth;
- using dataset label leakage in retrieval or scoring;
- promoting claims from LLM confidence alone.

## Runtime prompt pattern

Extraction prompt should be evidence-first:

```text
You are extracting candidate claims from evidence. Do not decide truth.
For each claim, cite only spans provided in the evidence packet.
If a claim depends on a missing or inaccessible record, mark it as
record_contingent and identify the record dependency. Return JSON conforming
to ClaimCandidate schema.
```

Access prompt should be access-state-first:

```text
You are classifying record-access states. Do not decide whether the underlying
claim is true. Identify expected records, access path, controlling actor,
production status, and whether non-production is benign, unknown, or potentially
strategic. Return JSON conforming to RecordAccessState schema.
```

Rendering prompt should be payload-bound:

```text
You are rendering a synthesis report from structured ranked worlds.
Do not add facts. Use only the provided claims, posterior scores,
confidence values, evidence references, proof traces, access states,
and uncertainty notes. If a claim status is unsupported, conflicted,
or record_contingent, do not state it as strictly proven.
```

## Evaluation of fine-tuning

A fine-tuned model is accepted only if it improves:

- citation validity;
- entailment;
- schema compliance;
- extraction recall;
- access-state classification;
- downstream world calibration.

It is rejected if it merely improves fluency.
