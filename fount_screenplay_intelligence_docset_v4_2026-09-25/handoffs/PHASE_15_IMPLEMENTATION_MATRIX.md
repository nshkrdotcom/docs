# Phase 15 Implementation Matrix

**Status:** OFFLINE_IMPLEMENTED. Runtime/database QC and optional human study are NOT_RUN. Phase 16 NOT_STARTED.

| Requirement / case | Writer outcome | Implementation | Evidence written | Runtime status |
|---|---|---|---|---|
| W01 | Resume the actual writing session and decisions without regenerating discarded work | Reuses `Session.open/4`, `Session.resume_view/2`, Store, Candidate, Review/Acceptance; guide connects existing CLI commands | `phase_fifteen_read_share_resume_test.exs`; PostgreSQL integration regression | NOT_RUN |
| W10 / A09 | Give pages to humans and record what they actually noticed without pretending TTS is audience evidence | `TableRead.packet/3`, `export_packet/4`, `record_reaction/2`; exact source/revision/selection; `observer=human` required | deterministic writer-workflow test + source contract | ExUnit NOT_RUN |
| W10 / A11 | Share only the selected accepted draft, preserving supported screenplay semantics and exposing losses | `Share.export/4` projects through `Editor.spec_ir/1`, actual `Selection.selected_ids/2`, Fountain + FDX exporters; privacy/fidelity manifest | fixture with note, boneyard, omitted scene, dual dialogue, Unicode, title metadata, page-break loss | ExUnit NOT_RUN |
| W11 / A10 | Interrupt/retry without duplicate acceptance or silent overwrite; keep useful provider-free actions available | Existing stale/idempotent Review/Acceptance and Session resume; extended `fount.read` needs no inference client | writer-workflow test + real-store integration test written | PostgreSQL NOT_RUN |
| W12 / A12 | Measure usefulness dimensions separately; allow keep-original/generic/negative outcomes | `Usefulness.record/1`, `report/2` for human-only/basic-LLM/Fount-assisted conditions | three-outcome deterministic fixture | human study NOT_RUN |
| Whole-workflow integration | One coherent text/CLI path from material capture to later resume | guide documents capture → explore → revise → compare → accept/reject → export → resume using existing commands | source-contract checks command/API references | runtime demo NOT_RUN |
| Basic LLM path | Comparison can use actual provider-neutral Inference facade without inventing an API | documented `Inference.client!/1`, `Inference.complete/3`, `Inference.Response.text/1` | source-contract assertion | live call NOT_RUN / not required |
| Privacy | Private notes, boneyards, omitted scenes, provider metadata and Workshop candidates are absent from clean share by default | canonical Core projection only; no Session/Inference read in Share | source-contract scan + fixture | runtime artifact inspection pending |
| No screenplay scoring/winner | Avoid turning workflow evidence into a quality verdict | report claim flags explicitly false; no `score`/`winner` result | usefulness test | source written |
| Phase-16 stop line | Do not advance to final integration | no Phase-16 implementation in overlay | source-contract scan | PASS |

## Preservation

The overlay does not add a direct SystemOneSDK dependency to Workshop, does not replace canonical acceptance, does not require TTS or provider credentials for human read/share, and does not create a second screenplay representation or persistence layer.