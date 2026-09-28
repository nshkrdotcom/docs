# Phase 01 — Core approval safety

Entry: first incomplete phase is 01, or this phase is undergoing QC/repair. Read the Core/direct-approval parts of `ARCHITECTURE.md` and `REVIEW_AND_APPROVAL_MODEL.md`, plus current Core/Workshop acceptance code and tests. The architecture documents describe the final system; this phase's checklist defines the implementation boundary.

## Deliverable and scope

Every post-genesis canonical change consumes an authorized approval through one Core transaction. Existing standalone Workshop workflows use that contract. This phase is substantially smaller than the former combined Foundation phase: all `fount_run` scaffolding, Run tables, plans/policies, decision storage and approval-attempt storage belong to Phase 02. Worker dispatch and run-driven approvers are later phases. Optional opaque run provenance fields may be added to Core now without a Run dependency.

## Implementation checklist

1. Audit Core `save`, `save_edit`, `accept_candidate`, genesis, Workshop Review/Acceptance/Store, Mix accept tasks, fake stores, examples and all other canonical-mutating callsites. Record their disposition in the implementation matrix.
2. Implement typed review/approval serialization and the trusted host principal/authority boundary. Direct callers supply a durably retained approval ID and exact payload. Validate candidate/base/hash/report/check identity, required-check inventory, review recommendation and human versus agent/service override rules. Preserve existing structural/report-lineage checks.
3. Close `save`/`save_edit` bypasses. Provide the manual-edit candidate path in Core and route approved edits through `accept_candidate/3`. Preserve in-memory edits, unaccepted candidates, immutable history and rejection. Do not manufacture human approvals from old actor strings.
4. Add forward Core migrations for approval identity/audit and its uniqueness/identity constraints. Preserve genesis and historical records without guessing principal types. Test both fresh schema and an upgrade from the current baseline.
5. Update existing Workshop adapters, CLI acceptance, examples and tests to the new authorized API. Exercise direct human/agent/service approvals with host-authenticated test principals; no run policy or reviewer callback is needed for this direct API proof.
6. Update affected Core/Workshop documentation and quality checks. Keep workspace coverage at its existing four library projects; register `fount_run` only in Phase 02.

## Expected source areas

Core `lib/fount/persistence.ex`, writing contracts/gate, new Core migrations and persistence tests; Workshop acceptance adapters/callers, fake stores, CLI/tests/examples and their docs. All paths are relative to `/home/home/p/g/n/fount`. Inspect actual filenames and helpers in the supplied source. Do not create `packages/fount_run` or its migration harness in this phase.

## Runtime acceptance

- **A01:** Genesis works; direct authorized human/agent/service candidates each advance canon through the same Core transaction. No provider credentials are required.
- **A02:** `save`/`save_edit` cannot advance canon outside the approved candidate path. The complete callsite audit and regression suite cover old public mutation entry points.
- **A03:** Forged identity, mismatched candidate/base/hash/reports/checks, missing required checks and invalid overrides fail without partial writes. Deterministic failures block everyone; automated principals cannot override required checks.
- **A04:** PostgreSQL concurrency yields one acceptance winner. An identical stable approval retry after a lost response returns the recorded result; a changed identity/payload conflicts, and a stale base is rejected.
- **A05:** Fresh/upgrade Core migrations preserve existing history and enforce candidate/revision/approval identity. Rollback leaves no partial head or audit changes; historical principal types are not invented.
- **A06:** Existing standalone Workshop acceptance works through the new authorized API. Core has no Run dependency. Existing writing workflows, candidate rejection, exports and non-mutating edit behavior remain functional.

Run the applicable common gates in `RUNTIME_QC.md`, Core/Workshop PostgreSQL integration and the existing four library package builds. Run-specific tests/builds are not applicable until Phase 02. Completion proves the acceptance invariant, not orchestration.

## Handoff boundary

Web chat returns the two ZIPs and Phase 01 QC handoff, updates state to `OFFLINE_IMPLEMENTED`, and stops. Runtime verifies the user-applied commits, repairs/tests A01–A06, records evidence, commits/pushes and marks 01 complete. It then prepares Phase 02 inputs from corrected source without implementing Phase 02.