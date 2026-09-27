# Human, Jev, and LLM collaboration

Normative companion to documents 27, 33, and 36. This is a creative-work contract, not a request for a new orchestration framework.

## Roles that complement one another

The human defines or discovers what the project is trying to do, decides what to preserve, and accepts changes to the screenplay. An agent can investigate, draft substantial material, compare treatments, and carry a requested revision through to a reviewable result. Human-in-the-loop does not mean asking for permission before every routine step; it means preserving meaningful authorship decisions.

Jev/SystemOneSDK helps ask explicit questions about supplied material and returns typed model estimates. Inference supplies generative completions used for exploration, dialogue, scenes, and rewrites. Neither component is a substitute for the writer's intention or evidence from an actual reader.

No mandatory “critic agent,” “planner agent,” or multi-agent hierarchy. Reuse Fount's existing request, candidate, typed-edit, comparison, and acceptance machinery. Choose the simplest implementation that completes the writer's task.

## A useful collaboration cycle

1. Establish the working draft, selected material, request, and any protected choices.
2. Decide whether this request needs measurement at all. Writing a new scene need not wait for a global analysis.
3. If useful, ask specific questions using only the relevant context and record the source locations.
4. Generate or investigate the requested possibilities; keep inventions separate from observations.
5. Compare resulting pages with intent and protected material; report consequences and disagreements.
6. Present usable candidates, not just advice. Let the writer accept, revise manually, combine, defer, or reject.
7. Record the decision and return to writing. Further analysis is a choice, not an automatic obligation.

Agents may perform the routine steps within the user's request. Expansion to a different task, external sharing, new paid-provider use, or acceptance of canon needs the authority appropriate to that action. Existing budget, privacy, cancellation, and provider-failure contracts remain applicable.

## Source-verified SystemOneSDK contract

Inspected at repository commit `e757598a89e549274b979f0e77c6a4b2b6667752`. Inspect the supplied snapshot again on each pass; this is a baseline, not permission to ignore newer source.

The supplied dependency is **system_one_sdk**, not a separate TypeSafe SDK input. Its public facade is in `packages/system_one_sdk/lib/system_one_sdk.ex`:

- `new_client(opts)`;
- `noul(instructions, opts)`;
- `choice(instructions, criteria, opts)`;
- `score(instructions, levels, opts)`;
- `prepare(questions)` / `prepare!(questions)`;
- `evaluate(client, state, questions, opts)`;
- `evaluate_stream(client, states, questions, opts)` / `evaluate_many(...)`.

Question preparation, caller-key restoration, validation, transport/provider selection, retry behavior, and stream association belong to the SDK contracts. Do not reconstruct a raw hosted-service HTTP client in Fount. A hosted TypeSafe provider is one supported implementation, not the definition of every measurement.

The current Fount path `packages/fount_probe/lib/fount_probe/jev.ex` already uses SystemOneSDK through its writing executor. Preserve those useful semantics while relocating Probe functionality in Phase 1. Never interpret the supersession requirement as a reason to replace working SDK use with invented calls.

Answer distinctions:

| Answer | Meaning to preserve | Misinterpretation to prevent |
|---|---|---|
| Noul | probability-like estimate for the specified proposition | objective truth or an extra confidence field that the answer does not have |
| Choice | option probabilities, ordering, chosen option, confidence as defined by SDK | proof that the most probable option is the only plausible reading |
| Score | rubric levels and probabilities; expected numeric score | silently replacing expectation with the highest-probability level |
| Missing/error | absent evidence or failed measurement | zero, false, or an unfavorable creative verdict |

Do not confuse SDK-owned protocol/version fields with the docset's prohibition on redundant Fount analytical compatibility generations. Preserve SDK fingerprints and ordered question semantics as supplied.

## Questions worth asking

Good measurement questions specify the evidence and the proposition:

- Before this scene ends, has the visible screenplay shown Mara giving Dan the key?
- Which of these descriptions best fits the tactic in the selected exchange, with an “unclear/other” option?
- Under this explicit rubric, how much of the stated information is repeated in this passage?

Less useful questions pretend to certify what the system cannot establish: whether a scene is good, whether audiences will love a character, whether a voice is authentic, or whether a film will sell.

For nonexclusive interpretations, ask separate propositions or allow an explicit mixed/unclear response; do not force a mutually exclusive Choice when the story supports coexistence. A numerical model estimate is not calibrated reader agreement. Never label it human confidence.

Do not send future pages to a forward-reader question. Keep author knowledge, character knowledge, reader-visible evidence, private notes, and rehearsal inventions separate. A model receiving a full screenplay cannot honestly provide an uncontaminated first-reader checkpoint merely because the prompt asks it to forget the ending.

## Inference generation

Use the supplied `inference.xml` public facade and adapters. The current source documents client construction, `Inference.complete`, responses, mock adapters, and structured-response capabilities. Inspect actual supported options before use; do not assume every provider supports every response format.

Prompts carry the selected text, user request, relevant adopted facts, protected choices, and requested output form. They identify untrusted research and notes as content rather than instructions. Request structured edits when appropriate, validate them, and construct a candidate; never turn raw completion text directly into an accepted draft.

The writer may ask for prose, a beat sketch, questions, or a full scene. Do not force everything through a JSON-facing user experience. Typed internal edits serve safe writing operations; they are not the product's creative language.

## Independent checks and productive disagreement

Use deterministic checks for source identity, exact protected text, edit scope, deleted scenes, and unsupported formats. Use Jev only where a model estimate is genuinely useful. Use human feedback for felt experience, voice, and usefulness.

A generator explaining why its own candidate succeeds is a proposal, not independent validation. Comparing with a different question or model does not create human evidence either. Preserve disagreement rather than averaging it into false certainty.

When evidence is weak, suggest the missing observation or an experiment. When the writer intentionally rejects a heuristic, record that choice and do not repeatedly relitigate it.

## Test obligations

Verify Noul/Choice/Score normalization, missing/error propagation, option order, streaming association, cancellation, source revision identity, and unadopted-invention exclusion. Use deterministic SDK/Inference mocks in ordinary tests; live provider checks require explicit authorization and actual result records.

An integration demonstration must show both paths: a human editing directly without a provider, and an agent producing a useful candidate through the same review/acceptance operations. Neither path may bypass source-fidelity or protected-material checks.