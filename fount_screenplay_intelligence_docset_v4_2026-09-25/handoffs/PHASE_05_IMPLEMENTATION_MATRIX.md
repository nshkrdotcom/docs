# Phase 5 implementation matrix — Diagnosis and Multi-Pass Playbook Shell

**Delivery status:** historical `OFFLINE_IMPLEMENTED` at source handoff; runtime QC is now `COMPLETE` at Fount `f3a56c90842d467cf57fb3a1f2123115d7f976d2`. The table below records the original offline checkpoint; executed results and repairs are in `PHASE_05_RUNTIME_QC_REPORT.md`. Phase 6 is not started.

| Phase-5 requirement | Implementation | Focused evidence written | Offline status |
|---|---|---|---|
| writer concern model | `Fount.Intelligence.Diagnosis.Concern` | `diagnosis_test.exs` | written; unrun in Elixir |
| support / counterevidence / alternatives / missing evidence | pure `Fount.Intelligence.Diagnosis` + `EvidenceNeed` / `Result` | `diagnosis_test.exs` | written; source scan PASS |
| uncertainty and abstention | diagnosis retains unsupported, uncertain, and counterevidence-dominant abstentions instead of forcing a conclusion | `diagnosis_test.exs` | written; unrun in Elixir |
| protected strengths / next investigations | Concern + hypothesis fields aggregate into Result and writer packet | diagnosis + packet tests | written |
| pure first-pass reduction | `Diagnosis.reduce_base/2` converts Observe results to explicit signals without filtering source evidence | diagnosis + runner tests | written |
| Acquisition planner | `Fount.Intelligence.Acquisition.Planner` selects exact Fount evidence, caps fragments, validates hypothesis evidence IDs | `writer_runner_test.exs` | written |
| Intelligence -> Observe context conversion | `ContextBuilder` accepts plain Intelligence state and calls actual `Fount.Observe.Context.from_map/2`; foreign structs rejected | `context_builder_test.exs` | written |
| closed lens context contracts | `diagnosis.concern_relevance` and `diagnosis.evidence_support` installed in Observe registry | JSON parse + context tests | JSON PASS; Elixir unrun |
| provider-free preflight | existing `Acquisition.Measurements` gains `prepare_request/2` and `preflight/3` using `Fount.Observe.preflight/3` | runner preflight test | written |
| multi-pass shell | `WriterRunner`: Observe base -> pure reduction/evidence needs -> validated context -> Observe support/counterevidence -> pure final diagnosis | runner tests + phase-five example | written |
| shared analysis budget / request cap | actual `Fount.Observe.Budget` + playbook request cap; remaining cap passed to contextual stage | partial-budget test | written |
| no false clean result on partial acquisition | packet is `partial` when acquisition, diagnosis evidence, or source selection is incomplete | partial-budget + source-selection-cap tests | written |
| ten baseline writer playbooks | closed `WriterRegistry` with Scene Doctor, Dialogue Pass, Character Trajectory, Relationship Pass, Suspense Audit, Sequence Momentum, Setup/Payoff, Notes Diagnosis, Submission Read, Revision Regression | `writer_registry_test.exs` + Python source test | catalog source PASS |
| preserve existing low-level playbooks | existing sixteen `Fount.Intelligence.Playbooks.Registry` entries and `run/plan/explain/execute` facade remain intact | preservation audit / full QC handoff | no deletion/change to existing registry |
| writer result packet | `WriterPacket` separates concern/scope/intent/finding/claim class/evidence/derived state/trajectory/diagnoses/abstentions/counterevidence/alternatives/uncertainty/missing evidence/strengths/investigations/strategies/revision comparison/resources/errors/provenance/limitations/candidate | `writer_packet_test.exs` | written |
| deterministic reference renderer | `Reporting.Renderer` emits canonical JSON or stable Markdown | packet test + example | written |
| resource transparency | preflight estimates/caps before run; actual Observe resource usage and analysis-budget snapshot after run; unknown hosted cost stays `nil` | runner tests | written |
| Sandbox integration | Phase-5 example and runner test use actual `Fount.Observe.Sandbox` | deterministic two-run test | written |
| pure-core effect boundary | pure Diagnosis namespace has no Observe execution, persistence, provider, environment, filesystem, clock/random calls | `phase_five_architecture_test.exs` + offline scan | source scan PASS; compiled gate unrun |
| no Intelligence structs through Observe | ContextBuilder refuses all structs before decoding into Observe-owned primitives | context tests | written |
| writer-semantic trajectory integrity | acquisition/reduction execution trace lives in packet provenance; `trajectory` is reserved for screenplay/narrative trajectories supplied by later capability work | packet/runner source | written |
| candidate ownership | Phase-5 packet leaves `candidate: nil`; Workshop continues to own creative pages/edits | packet test / preservation audit | written |
| optional usefulness pilot | `PHASE_05_DOMAIN_REVIEW_PACKET.md` retains the protocol | no participants/results invented | skipped; validation debt under D046 |

## Screenplay-first acceptance represented

The reference case is an interrogation scene. The writer declares that pressure seems to flatten after the first exchange while protecting Mara's restraint. The shell can test more than one explanation against exact screenplay evidence, retain a counterpoint that stasis may be intentional entrapment, and show missing evidence instead of manufacturing a verdict. This phase deliberately does not implement the later Scene/Agency/Character/Relationship capability families or generate replacement pages.

## Stop line

Phase 6 capability-family implementation is explicitly outside this delivery. Codex may repair Phase-5 defects exposed by runtime QC, but must stop after Phase 5.

## Runtime QC result

All 18 focused Phase-5 ExUnit tests and 281 four-package tests passed. Compiled architecture, strict Credo, Dialyzer, ExDoc, package inspection, isolated database/writer/PDF workflows, and the Sandbox packet passed. Runtime repairs include valid nonempty/unique hypothesis evidence IDs, preserved next investigations, formatting and strict-toolchain refactors, and a clearer two-hypothesis demonstration. The 19 post-repair payload hashes are in `PHASE_05_FILE_INVENTORY.json`. The optional human usefulness pilot remains unperformed validation debt under D046.
