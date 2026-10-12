# Domain vocabulary and non-negotiable distinctions

| Term | Definition and boundary |
|---|---|
| Repository | A Git or working-copy source collection; not a live running node. |
| Revision | An immutable source tree identity (Git SHA/tree/hash), optionally distinct from the current working tree. |
| Symbol | A source-language entity (module/function/callback/protocol etc.) in a particular revision. |
| Structural match | Suggested cross-revision correspondence; exact equality only if deterministic evidence supports it. |
| Static edge | A relation Reach/ExAST/compiler establishes under tool assumptions; not evidence it executed. |
| Call site | Source location of an invocation; may be dynamic/unresolved due to macros or dispatch. |
| Effect | Possible effect (static) or recorded attempted/outcome event (dynamic); separate those. |
| Node incarnation | One BEAM VM boot/identity within a capture. Node name can be reused after reboot. |
| Process incarnation | A particular PID on a particular node incarnation with observed lifetime. |
| Logical role | Stable human/programmatic role across process restarts (e.g. worker for command 42); matching can be ambiguous. |
| Trace session | Bounded recording with capture configuration, coverage and node participants. |
| Event | Observation emitted by a source with local sequence and time information. |
| Invocation | One function execution instance with entry/return/exception only as far as observed. |
| State observation | Value sampled or instrumented at a point, with its scope and completeness class. |
| State reconstruction | Derivation from complete, ordered sufficient observations; otherwise state is unknown or partial. |
| Causal edge | Asserted happens-before due to local ordering or recorded correlated transfer, not wall-clock closeness. |
| Causal slice | Bounded evidence-supported event subgraph relevant to a selected question. |
| Investigation | Saved question, anchors, pins, evidence references, claims, unresolved gaps and navigation state. |
| Finding | Review conclusion/concern with attached source, revision and evidence/uncertainty. |
| Focus | Current semantic+execution selection and follow policy; not a whole persisted session by itself. |
| Lens | Projection selected: change, source, graph, process, state, effects, timeline or evidence. |
| Pin | User-owned pane navigation anchor that automatic follow must not alter. |
| Intent | Human-supplied approved statement. Inferred intent is explicitly a hypothesis, not equivalent. |
| Observation | Something a capture source emitted; records its own coverage, sampling and payload fidelity. |
| Inference | A candidate claim that should expose supporting facts, assumptions and falsifiers. |
| Unknown | The product lacks adequate evidence; not a zero, false, unchanged state or negative test. |

## Confidence is not one number

Prefer structured qualifiers: `evidence_kind`, `derivation`, `capture_level`, `coverage`, `ambiguity_reason`, `source_tool`, `code_revision`. Numeric confidence should be reserved for probabilistic heuristics and calibrated only if validated; never combine source-grounded certainty and LLM speculation into an undifferentiated percentage.

## Principles

- An event can relate to zero or multiple source spans; macro-generated and stale code can make matches ambiguous.
- A message send, network attempt or DB call does not prove completion of an external side effect.
- Two events may be concurrent, out of order by displayed wall-clock, or incomparable causally.
- Shared logical actor role does not imply continuous state across restarts.
- A passing test is bounded evidence, not universal correctness.
- A source field reference is not proof of a runtime mutation.
