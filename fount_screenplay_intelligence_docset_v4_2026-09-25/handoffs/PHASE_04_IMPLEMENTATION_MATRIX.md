# Phase 4 implementation matrix — Temporal Views and Forward-Reader Engine

**Current status:** engineering QC passed at Fount `cfde46c`; `COMPLETE` under D046; the optional first-reader pilot was skipped and remains visible validation debt. Phase 5 is not implemented by this delivery.

| Phase-4 requirement | Implementation | Verification source | Offline status |
|---|---|---|---|
| qualified character state | `Fount.Intelligence.Temporal.character_state/4` | `temporal_views_test.exs` | written; Elixir unrun |
| directional relationship state | `Temporal.relationship_state/5` | asymmetric relationship case | written; Elixir unrun |
| setup/payoff ledger | `Temporal.setup_payoff_ledger/2` over commitments + typed StoryWorld causal edges | setup/payoff lifecycle case | written; Elixir unrun |
| event-qualified knowledge/belief/suspicion | `Temporal.knowledge_state/4` + existing `StoryWorld.knowledge_at/4` | temporal/differential tests | written; Elixir unrun |
| commitments | `Temporal.commitments_at/3` | temporal views test | written; Elixir unrun |
| resource/possession/access state | `Temporal.resource_state/4` | temporal views test | written; Elixir unrun |
| sequence views with declared coordinate system | `Temporal.sequence_view/3`; `Temporal.trajectory/5` | non-linear presentation/story-time cases | written; no total chronology invented |
| story-time connected recomputation | `StoryTime.connected_nodes/2`; `Temporal.recomputation_region/2` | connected-region test | written; Elixir unrun |
| dependency refs in temporal query packets | transition/record dependency collection | temporal tests + source-contract test | written |
| strict forward-only Reader state | `Fount.Intelligence.Reader.reduce/3` over canonical visible presentation points | `reader_forward_test.exs` | written; Elixir unrun |
| private note/boneyard/omitted exclusion | canonical `Fount.Selection.select/2` boundary + private-event ignore path | private-note test | written |
| future-evidence leak rejection | Reader evidence point validation | explicit future-evidence failure case | written |
| open question lifecycle | `question` open/reinforce/partial/resolve/abandon | question lifecycle cases | written |
| expectations/promises/threats | Reader lifecycle reducers | reducer source + fixture promise lifecycle | written |
| reveal state | Reader reveal reducer | reveal timing + flashback cases | written |
| reader-visible character epistemic model | `character_epistemic` events | differential test | written |
| suspense components | component map; no universal scalar | suspense component case | written |
| curiosity / surprise / alignment | inspectable Reader tracks | reducer contract | written |
| comprehension/confusion risk | `comprehension_risk` track | reducer contract | written |
| relationship trajectory visible to reader | directional Reader relationship entries + `Reader.trajectory/3` | relationship trajectory case | written |
| scene-to-scene forward pull | `forward_pull` lifecycle track | fixture + reducer contract | written |
| deterministic replay | immutable snapshots from ordered visible points/events | replay case | written |
| future presentation mutation preserves earlier snapshots | prefix comparison test | `reader_forward_test.exs` | written |
| later-presented flashback may change Reader state | flashback reveal event at later discourse point while StoryWorld chronology stays earlier | Reader + Temporal tests | written |
| reader vs diegetic knowledge differential | `Reader.knowledge_differential/6` with normalized epistemic signatures | `reader_story_world_differential_test.exs` | written |
| presentation suffix recomputation | `Reader.recomputation_boundary/2` | suffix boundary case | written |
| writer-usable reference example | `examples/phase_four.exs` prints non-linear coordinate separation, private-note exclusion, Reader state, temporal character view | Codex runtime handoff | written; unrun |
| pure architecture | no acquisition/persistence/provider calls in Temporal/Reader | Python direct source scan + compiled architecture gate required later | source scan PASS; compiled gate unrun |
| first-reader checkpoint pilot | `PHASE_04_DOMAIN_REVIEW_PACKET.md` | real rights-cleared readers, first-exposure protocol | **SKIPPED under D046; no human result claimed** |

## Screenplay-first acceptance represented

The fixture is intentionally a screenplay problem rather than an abstract graph test: a brass key is taken in present action, visibly explained later, shown in a later-presented flashback that occurs earlier in story time, tied to a directional trust/leverage relationship, and paid off at a dock. A private note contains knowledge the first reader must not receive. The tests ask whether the system preserves the two time coordinate systems and whether the writer can inspect questions, reveals, knowledge differences, setup/payoff, relationship movement and forward pull without future-scene contamination.

## Explicitly not advanced

Phase 5 Diagnosis, Acquisition, multi-pass Playbooks, resource planning, writer diagnosis packets, and all later capability/persistence/Workshop phases remain untouched. Existing pre-Phase-5 playbook code is preserved as historical functionality; this delivery does not claim it satisfies the Phase-5 architecture/specification.

## Runtime QC addendum — 2026-09-27

All 19 focused Phase-4 ExUnit tests pass (Temporal 5, Reader forward 12, differential 2). The new Reader regression covers boneyard and omitted-scene exclusion in addition to private notes. The full four-package CI, compiled architecture, strict Credo, Dialyzer, ExDoc and isolated persistence/writer/PDF preservation gates pass. See `PHASE_04_RUNTIME_QC_REPORT.md` for exact commands and repair hashes in `PHASE_04_FILE_INVENTORY.json`. No human first-reader result exists; under D046 the study was skipped as visible validation debt and Phase 4 is COMPLETE.