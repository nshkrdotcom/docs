# Review, approval and canonical acceptance

**After genesis, canon advances only through an acceptance transaction consuming an authorized approval from a valid human, agent or service principal.** A run policy never bypasses this rule.

## Distinct records and trust

Review evaluates exact candidate content. Approval authorizes that content based on the review. Acceptance is the database transaction that consumes that authorization and moves the head. Candidate-only runs never perform acceptance. Origin (`writer_edit`, `imported_text`, `generated_text`, `generated_structural_edit`, `mixed`) records where text came from; it does not identify who approved it.

Add `%Fount.Writing.Review{}` and `%Fount.Writing.Approval{}` plus validated serialization. Their required bindings are:

| Record | Fields |
| --- | --- |
| Review | reviewer type/ID, candidate ID, base revision ID, result content hash, exact report IDs, check-set fingerprint, findings, recommendation (`approve`/`reject`), explicit overrides |
| Approval | stable approval ID, approver type/ID, screenplay ID, candidate ID, base revision ID, content hash, review, optional run ID/policy version/policy fingerprint |
| Trusted context | authenticated principal identity and host authority to approve this screenplay, supplied outside the payload |

Nonblank strings alone are not authentication. Match the approver to the trusted context; for direct approval the host must authorize the principal for this screenplay. For run approval, Run also matches the frozen policy and scope. Core does not query Run. Review and approver may differ when the authorized approver explicitly adopts the supplied evaluation; both identities remain recorded. The first implementation may require matching identities, but must document that constraint and never silently rewrite them.

Run provenance is all-or-none: no run fields for direct approval; all three supplied for run approval. Core checks shape and records these as opaque provenance. Run owns their authority and locks/checks its current policy before calling Core. Host code with database access is trusted; these API guarantees do not claim protection against an administrator editing SQL directly.

## Durable identity before acceptance

For Run, generate a globally unique `approval_id` once and durably save it with the complete validated approval payload/hash in `fount_run_approval_attempts` **before** attempting Core acceptance. That attempt also binds the immutable plan, policy, packet and review. Human final approval resolves an exact typed decision through `submit_decision`; `approve_run` and CLI `approve` delegate to it. Recording the decision creates the durable authorization intent; the shared bridge subsequently commits acceptance. Automated reviews use the same bridge and persist intent before callback dispatch, then exact review receipt before approval construction. Rejected, invalid, fenced and interrupted attempts remain auditable without a Core acceptance.

For standalone Core/Workshop approval, the trusted caller supplies and durably retains the stable approval ID and exact payload (or a durable idempotency record that deterministically supplies both) before its first call. Core/Workshop must not generate a fresh approval ID on every invocation. A lost response is retried with the same identity/payload, and a changed review or packet requires a new approval. Core's unique approval ID and approval hash enforce that replay contract.

See the durable-attempt lifecycle in `DATA_AND_EXECUTION.md`: persisted review or ready approval resumes without repeating the review callback. A crash after an external response but before saving it can still leave an unknown provider outcome; do not infer a recovered review from a request-intent row. Required tests cover both sides of that boundary.

## Required checks

Load candidate/model/checks/reports from storage inside the transaction; do not trust a caller's packet as the authoritative candidate. Keep Core's existing report-source, session-lineage and structural validation. Add a declared required-check inventory so an omitted check cannot become an empty passing list. Fingerprint check definitions, outcomes and cited reports. Re-running a check changes that fingerprint and invalidates pending approval even if pages are unchanged.

| Condition | Human | Agent/service |
| --- | --- | --- |
| Invalid AST, identity, lineage, scope or protected-material invariant | Reject | Reject |
| Required deterministic check not passing (including unknown/missing) | Reject | Reject |
| Required subjective check fails/is unknown and is explicitly designated overridable | Require a named override with nonblank reason | Reject |
| Required check omitted/malformed or unknown evaluation class | Reject | Reject |
| Optional warning | Display and retain | Display and retain |
| Any override supplied by automated approver | N/A | Reject |
| Review recommends reject | Reject approval | Reject approval |

Human fallback creates a fresh human decision against a fresh packet; it never relaxes deterministic requirements. An automated pass requires every required check to pass; optional warnings remain visible. Required checks are derived from trusted operation/constraint configuration, not reduced by generated text or a user-submitted checks array. Scope escapes and protected passages are hard requirements even when expressed in ordinary language; ambiguous semantic evidence remains unknown and blocks automated acceptance.

## One transaction

1. Load the durably prepared approval and validate the trusted caller context and structure. For run acceptance, Run holds the run row lock and verifies the attempt's plan/policy versions, selected candidate and current authority in the same database transaction. The earlier review/intent transaction has already committed.
2. Core locks screenplay then candidate, as it does today. Global lock order is **run (when present) → screenplay → candidate**; never acquire Run locks from Core.
3. Load stored candidate/result model and authoritative check/report set. Validate bindings, review recommendation, principal authority and allowed overrides.
4. If this exact approval has already produced an acceptance, return its recorded acceptance/result. A different approval identity or payload for an accepted candidate conflicts. Approval IDs are unique and cannot authorize a second candidate.
5. For a new acceptance, compare current head to approval base; reject stale heads. Insert acceptance audit, mark candidate accepted and advance head atomically. Run records acceptance ID and the approval attempt's accepted outcome in the outer transaction before releasing the lock. A rollback preserves the pre-existing intent; record its error/outcome separately after rollback, leaving confirmed retryable failures ready for bounded retry under the same approval identity.
6. Delivery happens later. Export failure does not undo or repeat acceptance; reconcile by acceptance/approval ID after a lost response.

No provider call or human wait is inside these locks. A caller that lost its lease cannot authorize from a stale callback. Check authorization again when committing, including a policy tightened while the callback was running.

## Existing entry points and schema migration

At baseline, `Persistence.save/4` delegates to `save_edit/4`, and `save_edit/4` can advance a head directly. Merely deprecating it does not establish the invariant. Phase 01 must remove that mutation path: a canon-changing call without a candidate and authorized approval returns a clear error. Provide a Core manual-edit candidate path using the existing writing-session/candidate storage, then route valid approved edits through `accept_candidate/3`. Pure in-memory edits and saving unaccepted candidates remain available. Genesis is `Persistence.create/4` at this baseline, not the proposal's conceptual `create_screenplay` name.

Update Workshop `Review`, `Acceptance`, Store adapters/fakes, CLI accept commands, examples and all repository callers together. Preserve direct human review without requiring a Run. Avoid silent adapters that manufacture human approvals from old actor strings. The old API can report a migration error with the new call shape; it cannot keep a writable bypass.

Add forward Core migrations; do not edit already-applied migrations. Extend acceptance audit with approval ID/hash, approver identity, review/check bindings and opaque run provenance. Preserve current unique `(screenplay_id, result_revision_id)` and composite candidate/revision foreign keys. Use a unique non-null approval ID for approved advances. Keep existing candidate retry identity semantics, extending them to the full approval fingerprint.

Distinguish `genesis`, `approved` and migrated `historical` audit records. New non-genesis writes must be `approved` and have all required fields. Existing records can retain their original actor/review in a historical payload; do not guess whether an old string was a human or service. Historical is a migration classification, never an API write option. Genesis records require truthful origin/initiator but no post-genesis approval. Tests must prove fresh and existing-schema migration behavior without destructive reset.

## Required evidence

Exercise direct human, agent and service approvals through the same Core transaction, forged identities, mismatched candidate/content/reports/checks, missing required checks, subjective overrides, deterministic failures, stale heads, concurrent acceptance, replay with identical/different approval, and `save`/`save_edit` attempts. Test with real PostgreSQL, including rollback with no partial audit/head change and caller-stable approval identity after a lost response. Architecture tests prove Core has no Run dependency. Phase 05 additionally proves durable review/approval recovery and equivalence of `submit_decision`, `approve_run` and CLI `approve`. See Phase 01 for Core/direct acceptance, Phase 02 for Run approval-attempt storage, and Phase 05 for policy-driven dispatch.