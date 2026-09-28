# Phase 01 implementation matrix — Core approval safety

Status: **COMPLETE**. Executed runtime evidence is in [PHASE_01_RUNTIME_QC_REPORT.md](PHASE_01_RUNTIME_QC_REPORT.md).

## Runtime destinations

- fount: `/home/home/p/g/n/fount`
- docset: `/home/home/jb/docs/20260928/fount`
- docset_canonical: `/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount`
- docset_git_root: `/home/home/p/g/n/brainstorms`
- system_one_sdk: `/home/home/p/g/n/system_one_sdk`
- inference: `/home/home/p/g/n/inference`
- agent_session_manager: `/home/home/p/g/n/agent_session_manager`

## Acceptance mapping

| ID | Source implementation | Written proof | Runtime status |
| --- | --- | --- | --- |
| A01 | `packages/fount/lib/fount/writing/{principal,authority,review,approval}.ex`; `packages/fount/lib/fount/persistence.ex` uses one candidate-acceptance transaction for human/agent/service principals while genesis stays `create/4`. | `packages/fount/integration/writing_persistence_test.exs` exercises all three principal types and typed audit rows. | PASS — runtime report |
| A02 | `Persistence.save/4` and `save_edit/4` reject changed post-genesis canon; `save_edit_candidate/4` stores manual edits without moving head. Only genesis and `record_candidate_acceptance/4` call `set_head/3`. | `writing_persistence_test.exs`, `continuation_concurrency_test.exs`, and `scripts/tests/test_phase_one_source.py`. | PASS — runtime report |
| A03 | `CheckSet` snapshots required identities/results/reports; `ReviewGate` rejects missing/malformed/hard requirements and automated overrides; `Authority` binds authenticated principal/screenplay. | Core unit tests plus PostgreSQL integration cases for omitted checks, content/check/report mismatch, forged authority, automated override, human subjective override, report lineage, and no partial audit/head move. | PASS — runtime report |
| A04 | Stable caller-supplied `approval_id` + canonical approval hash; exact replay returns prior result; changed same-ID payload conflicts; screenplay→candidate lock order retained. | `writing_persistence_test.exs` replay/conflict cases and `continuation_concurrency_test.exs` competing acceptance race. | PASS — runtime report |
| A05 | Forward migration `20260928000000_authorize_canonical_acceptance.exs` adds typed audit/check identity; migrated rows become `genesis`/`historical` without guessed types; DB FKs tie approved acceptance to exact candidate/result and candidate approval to exact approval identity. Exact pending-candidate replay can attach the new check snapshot. | `approval_migration_test.exs` creates isolated fresh and baseline→new schemas. | PASS — runtime report |
| A06 | Workshop Review/Acceptance/public API, Store fake, CLI, examples, docs and active tests use typed approval + authority; legacy actor/review shapes return `:authorized_approval_required`. Core imports no Run package, and `packages/fount_run` was not created. | Converted Workshop unit/integration tests; Phase 01 source architecture assertions. | PASS — runtime report |

## Canonical mutation callsite audit

Baseline direct `Persistence.save_edit/4` usages were audited before editing. Disposition:

| Baseline callsite | Phase 01 disposition |
| --- | --- |
| `packages/fount/integration/writing_persistence_test.exs` | Converted to explicit bypass regression + `save_edit_candidate` → typed approval acceptance. |
| `packages/fount/integration/continuation_concurrency_test.exs` | Direct race now proves both edits are blocked; canonical race moved to saved candidate acceptance. |
| `packages/fount/examples/live.exs` | Converted to manual candidate + stable typed approval. |
| `packages/fount_intelligence/integration/phase_ten_durable_analysis_test.exs` | Converted setup mutation to candidate + typed approval. |
| `packages/fount_workshop/integration/recover_db_test.exs` | Converted setup mutation to candidate + typed approval. |
| `packages/fount_workshop/lib/fount_workshop/live_example.ex` | Converted setup/acceptance path to typed approval. |
| `packages/fount_workshop/examples/live.exs` | Converted setup/acceptance path to typed approval. |
| `packages/fount/guides/persistence.md` | Rewritten to candidate/approval API and explicit migration behavior. |
| `packages/fount/README.md` | Genesis example uses `create/4`; no post-genesis direct-save claim. |

Baseline candidate acceptance callers in Workshop (`Review`, `Acceptance`, public `FountWorkshop`, CLI, continuation fake store, live/examples, Phase 9/12/14/15 integrations and writer-workflow tests) were converted together. The old four-argument shapes remain only as explicit non-writable migration errors. No adapter manufactures a human principal from a legacy actor string.

Current source has exactly two `set_head(repo, ...)` call sites in `packages/fount/lib/fount/persistence.ex`: genesis and typed candidate acceptance. Source regression tests assert this invariant.

## Public contract changes

- New trusted types: `Fount.Writing.Principal`, `Authority`, typed `Review`, typed `Approval`.
- Direct caller owns a stable UUID approval ID and exact payload before the first acceptance call.
- `Persistence.accept_candidate/3` now requires `approval: %Approval{}` (or its closed serialized map) and `authority: %Authority{}`.
- `FountWorkshop.Review.accept/4`, `FountWorkshop.Acceptance.accept/4`, and `FountWorkshop.accept/4` take typed approval + authority. Their legacy argument shape returns `{:error, :authorized_approval_required}`.
- CLI `fount.accept` requires `--principal-type` and `--approval-id`; `--expected-revision` remains an explicit caller/base guard. The local CLI also requires configured `FOUNT_LOCAL_OWNER_ID` and `FOUNT_LOCAL_SCREENPLAY_ID`, and only accepts a matching human owner for that screenplay.
- Phase 01 deliberately requires reviewer == approver. The architecture allows later explicit adoption of a distinct reviewer, but no identity is silently rewritten.
- Pre-Phase-01 pending candidates cannot be accepted with a missing fingerprint. Replaying the exact immutable `save_candidate/3` operation once attaches the authoritative new check snapshot; changed payloads still conflict.

## Files outside scope deliberately untouched

No `packages/fount_run`, Run tables, worker code, provider adapters, SDK/Inference/ASM source, or web app is added here. Those belong to later phases.