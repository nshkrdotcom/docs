# Codex QC Handoff — Phase 12

You are the runtime repair/QC agent for **Fount Phase 12 only: Discovery, Session Modes, and Scene Exploration**. The user has already applied and committed the supplied Phase-12 Fount overlay and docset. **Start from the user's applied checkout; do not reapply the overlay. Do not begin Phase 13.**

## First establish the applied state

1. Record `git rev-parse HEAD`, `git rev-parse HEAD^{tree}`, `git status --short`, Elixir/Erlang versions and resolved dependency identities.
2. Compare the 36 paths and result hashes in `handoffs/PHASE_12_FILE_INVENTORY.json` with the applied checkout before repairs. Record any mismatch rather than masking it.
3. Read `handoffs/PHASE_12_OFFLINE_HANDOFF.md`, `PHASE_12_IMPLEMENTATION_MATRIX.md`, `PHASE_12_PRESERVATION_AUDIT.md`, `PHASE_12_STATIC_CHECKS.json`, document 36, and D049–D053.

## Runtime/repair ladder

Run the repository's real commands, not assumed ones; inspect `mix.exs`, CI and package scripts first. At minimum, execute/repair:

- formatter and warnings-as-errors compilation;
- all Phase-12 focused ExUnit tests;
- full workspace tests / `mix ci`;
- compiled architecture/dependency checks, strict Credo, Dialyzer, ExDoc and package/archive gates used by the current repo;
- full Python source/handoff suite, reconciling the supplied-snapshot `prune_deleted_directories` omission against the actual checkout;
- PostgreSQL migrations/integration tests and existing Workshop persistence/accept/reject/rebase/resume regressions;
- `packages/fount_workshop/examples/phase_twelve/README.md` against a disposable database; inspect actual artifacts, not only exit status.

## Required Phase-12 proof

1. **W01:** Draft opens without compulsory analysis; mode switch and resume preserve immutable opening request vs current mode.
2. **W02:** Evolving brief, unattached fragment, classify/link/retire/adopt history, reverse outline and card reorder persist without canonical mutation. Verify later execution sees the saved effective brief while opening provenance remains unchanged.
3. **A01:** Three pool/map openings are materially distinct. Explicitly accept one, reject one, leave one unchosen; after a fresh resume show the same accepted draft, unchosen alternative, protected map and pending question.
4. **A02:** Inspect can present `key placed` as fact and `forgiveness` only as interpretation; untouched source remains viable.
5. **A03:** Actual pages embody conceal/volunteer/accidental-action mechanisms; deterministic confession-paraphrase mock fails. Verify treatment tradeoff/departure validation.
6. **A10:** Manual writer edit creates a real candidate, stale sibling acceptance cannot overwrite accepted head, retry of same acceptance is idempotent, and all decisions survive resume.
7. **W11:** finite/capped Session behavior remains visible; provider-free commands do not require generation/measurement credentials.

## Dependency boundaries actually inspected by source-writing pass

- SystemOneSDK 0.6.0: existing `new_client`, question (`noul`/`choice`/`score`), `prepare`, `evaluate`, `evaluate_stream` facade remains behind Observe.
- Inference 0.5.0: generated alternatives continue through `Inference.Client`/`Inference.complete`; no replacement API was invented.
- ASM 0.17.1: `start_session`, `query`, `stream`, `stop_session` were inspected only to verify the existing Inference adapter/session boundary. Do not add a direct Fount dependency.

## Live/provider policy

The deterministic Phase-12 engineering cases require no live provider. Do not infer model quality from scripted fixtures. If the user separately authorizes a narrow live check, record exact model/provider, request, result and limitation; keep it separate from deterministic engineering evidence. Do not run an optional human study unless explicitly commissioned; D046 makes it nonblocking.

## Completion record

Repair real failures rather than merely reporting them. Update Fount source/tests/docs as necessary, then update the complete docset: `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, Phase-12 inventory if repair hashes changed, `PHASE_12_RUNTIME_QC_REPORT.md`, preservation/decisions only where needed, integrity hashes and `MANIFEST.md`. Mark Phase 12 `COMPLETE` only after applicable non-human engineering/preservation gates pass. **Stop with Phase 13 still `NOT_STARTED`.**