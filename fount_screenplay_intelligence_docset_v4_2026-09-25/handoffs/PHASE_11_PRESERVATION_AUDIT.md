# Phase 11 functionality-preservation audit

**Source-delivery status:** OFFLINE_IMPLEMENTED; runtime preservation QC pending.

| Existing area | Phase-11 treatment | Risk / required runtime proof |
|---|---|---|
| Core canonical screenplay/parser/edit/persistence behavior | no Core source modification | full workspace CI + isolated Core DB tests must remain green |
| Observe execution/cache/provenance/provider boundary | no Observe engine modification; only Phase-11 live example/docs | rerun existing Observe cache, provider, sandbox, budget, association/error and credential-extra tests |
| StoryWorld/Reader/Temporal pure semantics | reused directly; nonlinear regression added rather than alternate engine | run Phase-11 nonlinear test plus existing reader/temporal/story-world suites |
| 12 capability families and installed lens registry | no capability implementation replaced; Suite only references existing registered lenses | `Evaluation.validate_benchmark_catalog/0` and full Intelligence tests |
| Phase-9 Workshop generation/review/acceptance loop | only `LiveExample` gains one conditional mode; normal modes/default clients remain unchanged | Phase-9 source tests + full Workshop tests + existing writer demonstrations |
| Phase-10 durable analysis/reuse/recomputation | no persistence semantics changed; resource evaluation consumes existing `usage_history/4` output | Phase-10 source tests + Phase-11 PostgreSQL resource-history integration |
| Inference/ASM generation boundary | unchanged; Phase-11 Workshop live check uses existing `Launcher.clients(observe: false)` | compile + authorized one-scene live check only when credentials/authority exist |
| System One boundary | unchanged; Phase-11 Observe live check uses existing `Fount.Observe.provider/1` and `SceneQuestion.ask/5` | compile + authorized synthetic live check only when credentials/authority exist |
| Human review policy | D046 retained; no fabricated reviewers or calibration | runtime report must record performed evidence or `NOT_RUN`/validation debt |
| Canon ownership | live Workshop path calls generation/review export only and asserts accepted head unchanged; wrapper uses `accept_demo: false` | run live or scripted equivalent; inspect accepted revision before/after |
| Phase boundary | Phase 12 remains absent | source scan and docset progress check |

No deletion is present in the Phase-11 overlay. The strict manifest contains 36 file operations: 21 additions and 15 modifications.
