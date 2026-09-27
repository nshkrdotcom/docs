# Conceptual Contract Examples

These examples describe responsibilities/shapes. Implementers must inspect the latest source/SDK snapshots and use actual APIs.

## Reusable MeasurementResult

```json
{
  "id": "result_01",
  "value": {"choice": "raise_self"},
  "distribution": {
    "raise_self": 0.73,
    "resist": 0.18,
    "unclear": 0.09
  },
  "output_contract": {"id": "dialogue.status_bid", "sha256": "..."},
  "measurement_spec_sha256": "...",
  "input_sha256": "...",
  "provider_fingerprint": {"provider": "typesafe", "model": "...", "stability": "provider_stable"}
}
```

## Current Observation

```json
{
  "id": "obs_01",
  "kind": "dialogue.status_bid",
  "target": {"kind": "element", "id": "...", "revision_id": "current-revision"},
  "result_id": "result_01",
  "lens": {"id": "dialogue.status_bid", "sha256": "..."},
  "projection": {"id": "dialogue.turn_pair", "sha256": "..."},
  "context_sha256": "...",
  "evidence": [{"revision_id": "current-revision", "element_id": "...", "span": {"byte_start": 0, "byte_end": 14}}]
}
```

If `result_01` came from a cache entry created under a prior screenplay revision, the Observation above is still newly materialized with current provenance/evidence.

## Context inversion

```text
canonical dialogue
  -> Observe base measurements
  -> Intelligence StoryWorld/Reader reasoning
  -> Intelligence Acquisition converts selected state to Observe neutral primitives
  -> %Fount.Observe.Context{slots: ...}
  -> Observe validates the active lens context contract
  -> contextual measurements
  -> Intelligence final reasoning/diagnosis
```

## Non-linear time

```text
Presentation order:
  Scene A (2026)
  Scene B (flashback, 2004)
  Scene C (2027)

Reader reducer:
  A -> B -> C

StoryWorld story-time constraints:
  B before A
  A before C

Causal graph:
  independent edges based on evidence, not inferred from either list automatically
```

Unknown story-time relationships remain unknown.

## Pure reasoning

```elixir
{:ok, story_world} =
  Fount.Intelligence.StoryWorld.compile(screenplay, observations, opts)

{:ok, reader} =
  Fount.Intelligence.Reader.reduce(checkpoints, reader_opts)
```

No provider or database call occurs inside these functions.

## Evidence gap

Pure diagnosis may return a requirement rather than acquire:

```elixir
{:needs_evidence,
 [
   %{lens: "knowledge.suspicion", target: mara_ref, context_requirements: [...]}
 ]}
```

The shell decides whether budget/policy permits acquisition.

## Strategy versus candidate

```text
Diagnosis:
  The reveal is predictable because audience evidence converges long before explicit confirmation.

Strategy:
  Preserve the reveal scene, but redirect one clue path so two plausible explanations remain.

Candidate:
  Concrete generated/edited screenplay pages implementing one selected strategy.
```

These remain separate records with lineage.

## Writer-facing packet

Writer-facing outputs are semantic packets, not GUI layouts. They keep concern, evidence, derived state, diagnosis, alternatives, uncertainty, protected strengths, optional strategies, and resource usage distinct.

See `writer_result_packet.example.json` and `../27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`.

## Safe project pack

Project/studio genre/craft packs are declarative when they only compose installed safe primitives. They cannot name arbitrary executable modules/functions or escape host resource/privacy policy.

See `genre_pack.example.json` and `../29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`.

## Corpus rights manifest

Evaluation material carries rights/privacy/provider-export metadata independently of annotations.

See `corpus_manifest.example.json` and `../28_HUMAN_VALIDATION_AND_CORPUS_OPERATIONS.md`.

## Resource preflight

Expensive playbooks expose an estimate and caps before execution where the runtime can estimate them reliably. Actual usage is recorded afterward.

See `resource_preflight.example.json` and `../30_LONGITUDINAL_RESOURCE_ECONOMICS.md`.

## Phase-8 declarative lens

Project/studio measurement customization is data-only. A declarative lens may choose one of the registered neutral projections, use `noul`/`choice`/`score` question data, request only recognized resource controls, and use the normal `observe.answer_set` output contract. It cannot name a module, function, shell command, path, endpoint, credential, decoder, adapter, tool, or database query.

See `declarative_lens.example.json`, `genre_pack.example.json`, and `../29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`. Installation and enablement are separate decisions; pack resource requests never override host caps.