# Phase 10 preservation audit

**Status:** source audit complete; runtime preservation gates remain for Codex.

Phase 10 is infrastructure underneath the already verified writing loop. It must make analysis reusable and auditable without changing who controls the screenplay.

## Preserved writer behavior

- `FountWorkshop.Session` still requires explicit Store + Inference services and keeps Observe optional.
- Candidate generation, checks, save order, audition/combine/rebase, exact review packets, stale-base protection and explicit `Review.accept/4` / `Review.reject/3` remain the canon-control path.
- Durable analysis is opt-in (`durable_analysis: true`); disabled sessions preserve the Phase-9 behavior.
- Resume persists the durable-analysis option/namespace in the existing session limits rather than introducing a second session system.
- A rejected candidate remains rejected. An unchosen candidate remains available. Analysis history records what happened but cannot flip either state or advance the head revision.
- Cache eviction does not delete candidate/session history, writer packets, analysis runs, observations or dependency history.

## Preserved architecture

- Core owns PostgreSQL persistence primitives and canonical screenplay persistence.
- Observe continues to own semantic measurement identity, provider calls, cache-key construction, output-contract validation, model stability and fresh Observation materialization.
- Intelligence's imperative shell composes the durable adapter and analysis records; pure StoryWorld/Reader/Temporal/Diagnosis/Capabilities remain DB/provider-free.
- Workshop owns creative generation and explicit writer review/acceptance.
- SystemOneSDK remains behind Observe; Inference remains Workshop generation infrastructure; ASM remains behind Inference.
- No `fount_probe`, compatibility wrapper, superseded physical analysis package or numeric analytical API generation is introduced.

## Existing functionality that Codex must regress

1. Phase-9 deterministic Sandbox/scripted-Inference writer loop and full Workshop suite.
2. Session continuation/retry; candidate selection/edit/combine/rebase; acceptance/rejection and stale-content protection.
3. Existing Observe cache integrity: question, text, context, model/output-contract invalidation; cross-revision reuse; fresh provenance; durable mutable-alias rejection.
4. Existing Reader/Temporal non-linear and strict-forward tests plus all twelve capability families.
5. Core Fountain/FDX/JSON roundtrip and relational history.
6. PostgreSQL Core and Workshop integration suites, PDF/table-read demonstrations, package builds and architecture gates.

## Phase-10 writer demonstration written

`packages/fount_workshop/integration/phase_ten_resume_history_test.exs` uses real PostgreSQL persistence and the existing session/candidate APIs. It creates two candidate branches, rejects one, leaves the other unchosen, stores durable analysis associated with the rejected branch, resumes with an empty scripted-completion queue, and asserts:

- no new completion was needed;
- the rejected decision remains rejected;
- the other candidate remains undecided and available;
- the durable analysis run remains historical and unchanged;
- canon remains the original accepted revision.

The test is **NOT_RUN** in this source-writing environment.

## Source-order preservation decision

Existing Workshop performs Revision Intelligence before the candidate is persisted. The Phase-10 schema therefore stores exact derived-analysis revision UUID + content hash without requiring the revision/candidate FK to exist first. This avoids reordering a verified writing pipeline solely to satisfy persistence. Codex must verify this exact integration path under PostgreSQL.
