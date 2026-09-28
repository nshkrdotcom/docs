# Phase 05 — steering, approval and delivery

Entry: Phases 01–04 complete on corrected source and recorded runtime evidence; Phase 04 provides saved candidate/check checkpoints and the canonical strategy decision command. Read approval, data/execution and workflow contracts, including exact approval bindings and candidate composition.

## Deliverable

The complete headless product: writer decisions, policy changes, pause/resume/stop, candidate-only completion, human/agent/service acceptance and exported results. Every public command has a usable CLI path. A run can finish without a human click when policy authorizes it, while using the same canonical transaction.

## Implementation checklist

1. Extend Phase 04's canonical `submit_decision` transition to remaining steering and final-approval/rejection kinds, preserving its authentication, fingerprint, atomic resolution and replay semantics. `approve_run` and CLI `approve` are convenience wrappers for an exact pending human approval decision, with no independent transition implementation. Persist the response and linked approval attempt before the bridge attempts acceptance.
2. Complete `update_plan`, pause/resume/stop and policy changes, including in-flight tightening, invalidated decisions/approval attempts and explicit limit increases. Goal/notes/constraint updates within the same base/scope append complete plan snapshots; base/scope changes make linked successor runs. Preserve prior artifacts and resource/iteration commitments; plan updates are idempotent and require the expected version.
3. Integrate explicit Workshop rebase and conflict resolutions. Require fresh checks/review after rebase. Writer replacement text becomes a new candidate, with no invisible edits to a reviewed candidate.
4. Connect the durable approval-attempt lifecycle to the bridge: plan/policy/packet bindings, real principal identities, callback intent before dispatch, exact review receipt before approval construction, stable approval ID/payload saved before Core, rejection/fallback and authorization recheck. Reconcile reviewed/ready/unknown attempts after restart. Persist acceptance with Run/attempt accepted outcome in one transaction and use the required lock order. Callback rejection or a failed Core transaction must not erase attempt history.
5. Complete decide/deliver stages and safe artifact storage. Implement Fountain/FDX/review/diff/provenance bundle, selected PDF and existing table-read integration where configured. Record output checksums and truthful unavailable/failed formats.
6. Implement all public Run API commands from `ARCHITECTURE.md` and Mix CLI commands from `WORKFLOWS_AND_UI.md`. Document local owner/Repo/services configuration, input JSON, error codes and runnable examples.

## Runtime acceptance

- **C01:** Two concurrent responses resolve one checkpoint once; stale tab, wrong principal, altered options/candidate/checks/plan/policy and cross-run decision fail without advancing work. `submit_decision`, `approve_run`, CLI `decide` and CLI `approve` share identical approval/replay/conflict behavior and one linked durable approval identity.
- **C02:** Pause/restart/resume continues saved work. Stop races with a worker/approval deterministically and retains exportable results. A stopped run cannot later accept from a delayed callback.
- **C03:** Candidate-only completion exports without head change. Human, agent and service completion each produce one acceptance with authentic origin/approver/run provenance through Core. An unregistered approver is rejected.
- **C04:** Automated required fail/unknown blocks; authorized human subjective override succeeds only when declared overridable; deterministic failure blocks everyone. Rejected, malformed and fenced callbacks retain exact safe review/outcome evidence without a Core acceptance. Fallback creates a fresh human decision/attempt and cannot launder the failed review.
- **C05:** Plan or policy changes while an approver runs fence its result, including when pages are unchanged. Snapshot history and old step bindings remain intact; counters do not reset. Stale head opens compare/rebase; rebase creates fresh candidate/check bindings, and old approvals fail. Composition presents all changes against the accepted base.
- **C06:** Inject crashes before callback dispatch, after callback response but before persistence, after review persistence, after approval ID/payload persistence, and after acceptance commit before acknowledgement/export. Saved review resumes without another callback; saved approval reuses its identity; unknown response is reconciled/paused; Core rejection retains attempt history; lost commit response yields one acceptance. Export resumes independently, files identify the correct revision, and PDF failure remains visible and individually retryable.
- **C07:** All three product journeys work through CLI with scripted providers. Tests invoke CLI parsing/exit behavior as well as internal functions. Standalone Workshop acceptance through the new authorized approval API and existing export remain functional; the old actor-string signature is not a writable compatibility path.

Run all common gates plus Run/Workshop database integration, decision/acceptance races, actual serializers and installed PDF checks. Required artifact checks must read generated files and compare content identity; merely observing a function return is insufficient.

## Handoff boundary

Web returns two ZIPs and Phase 05 runtime handoff. Runtime fixes and certifies this complete headless slice, commits/pushes both repositories, and prepares Phase 06. UI absence at this boundary is explicit and intentional; headless acceptance, exports and steering are complete.