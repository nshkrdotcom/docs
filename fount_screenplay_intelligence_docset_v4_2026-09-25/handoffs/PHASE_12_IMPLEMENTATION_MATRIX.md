# Phase 12 Implementation Matrix

Status: **OFFLINE_IMPLEMENTED / runtime NOT_RUN**. This maps the Phase-12 requirements in document 36 to delivered source; it is not runtime evidence.

| Requirement / scenario | Delivered behavior | Source / tests | Offline status |
|---|---|---|---|
| W01 four modes | Draft/Explore/Inspect/Revise are explicit session modes; legacy `diagnose` is presentation-normalized to Inspect | `workflow.schema.json`, `FountWorkshop.Discovery`, `Session.resume_view/2` | WRITTEN |
| W01 draft without compulsory analysis | `Session.open/4` is store-only; develop/draft remains one route and no prewrite playbook is required | `session.ex`, `phase_twelve_discovery_test.exs` | WRITTEN; ExUnit NOT_RUN |
| W01 resume separation | immutable opening request stays in provenance while current mode, candidates, pending question, decisions and selected candidate remain separate | `session.ex`, `discovery.ex`, discovery/A01 tests | WRITTEN; ExUnit NOT_RUN |
| W02 evolving brief | desired experience, current question, audience context, formal constraints, protected strengths and departure permission persist with history; saved values overlay the effective later request without rewriting the opening request | `discovery.ex`, `session.ex` | WRITTEN |
| W02 fragments | image/line/action/relationship/research-question/ending/general fragments; wanted/connective classification; link, retire and explicit adoption history | `discovery.ex`, `fount.fragment`, discovery test/example | WRITTEN |
| W02 reverse outline | source scene/heading/element IDs are retained; inferred functions are explicitly labeled interpretations; output is noncanonical | `Discovery.reverse_outline/3`, Inspect/A02 test | WRITTEN |
| W02 card reorder | exact scene permutation saved as a noncanonical branch proposal | `Discovery.propose_reorder/4`, discovery test | WRITTEN |
| W03 treatment diversity | optional binding treatment contract identifies action/revelation/relationship/mixed route, tradeoffs, protected material and brief departure | `request.ex`, `strategy.ex` | WRITTEN |
| A03 actual page differences | deterministic scripted generation materializes conceal/volunteer/accidental-action pages; confession paraphrase control is rejected | `phase_twelve_scene_exploration_test.exs` | WRITTEN; ExUnit NOT_RUN |
| W03 writer decisions | reject-all and keep-both are durable decisions without canon mutation; acceptance remains explicit | `discovery.ex`, scene-exploration/discovery tests | WRITTEN |
| A01 required demo | pool/map fixture creates three material routes, accepts one, rejects one, leaves one unchosen, then resumes selected draft, protected text and pending question | `phase_twelve_a01_demo_test.exs` | WRITTEN; ExUnit NOT_RUN |
| A02 fact vs interpretation | quiet key placement remains source fact; forgiveness is represented only as an interpretation | `phase_twelve_inspect_test.exs` | WRITTEN; ExUnit NOT_RUN |
| A10 stale/idempotent acceptance | manual writer branch is edited, accepted, re-accept is idempotent, stale sibling acceptance fails, and resume preserves candidate history | `phase_twelve_discovery_test.exs`, continuation test store | WRITTEN; ExUnit NOT_RUN |
| W11 controlled work | existing Session budget/preflight/cancellation paths are reused; Phase-12 provider-free commands do not acquire paid clients | `session.ex`, `cli.ex`, source test | SOURCE CHECK PASS |
| Provider-free writer path | open/capture/brief/mode/outline/reorder/manual/edit/decision flow uses persistence + existing typed candidate/review acceptance without Inference/Observe/System One/ASM credentials | new Mix tasks, `examples/phase_twelve/README.md` | WRITTEN; runtime NOT_RUN |
| Generated path boundary | generated alternatives continue through existing Inference client; semantic measurements continue only through Observe/System One; ASM remains behind Inference | existing package DAG + Phase-12 source | SOURCE INSPECTION PASS |
| Phase-13 stop line | no rehearsal/voice-exemplar/cinematic Phase-13 implementation | source contract check | PASS |
