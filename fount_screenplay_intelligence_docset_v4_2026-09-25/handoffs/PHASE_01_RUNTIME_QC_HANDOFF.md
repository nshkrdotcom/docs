# Fount Phase 1 - Codex verification, repair and completion

**Execution notice (2026-09-26):** This is the original instruction handoff. Actual executed results, corrections, and remaining `QC_BLOCKED` gates are in `PHASE_01_RUNTIME_QC_REPORT.md`; planned commands below are not proof of execution.

## Start from the user's applied commits - do not reapply the overlay

You are the runtime-QC implementer for **Phase 1: Direct Architecture Supersession and Probe Removal**. The user has applied and committed `fount_phase_01_overlay.zip` and the complete `fount_phase_01_docset.zip`. Start with those actual working trees and commits. Read the current `PROGRESS.md`, the Phase 1 section of document 16, document 36's first demonstration, this handoff, the offline handoff and preservation audit.

Your job is to **test, repair and complete this same phase**, not merely list failures. Do not begin Phase 2, recreate Probe, introduce compatibility wrappers, remove meaningful tests to obtain a pass, or replace a useful writing workflow with an architectural placeholder. Preserve human authorship and explicit candidate acceptance. Do not publish packages or push commits unless separately authorized.

Locate the actual Fount and docset repositories from the user's applied state. Relevant development repositories may be under `~/p/g/n` and `~/p/g/North-Shore-AI`; inspect rather than assume a dependency path. Record `git status --short`, `git rev-parse HEAD` and relevant local changes in both repositories. Do not impose an invented historical SHA guard. Verify the applied file inventory against current tracked files, accounting explicitly for any user-approved follow-up changes.

The phase remains `OFFLINE_IMPLEMENTED` until you start runtime work. Use `QC_IN_PROGRESS`, `QC_BLOCKED` and finally `COMPLETE` honestly. Missing infrastructure is not a successful test. No new human/domain pilot is required for Phase 1, but no creative superiority or audience-validation claim is authorized.

## Input and application integrity - read before running anything

The four supplied attachments were identified by packed paths, modules, package definitions and progress contents. All are **unsealed raw Repomix exports**. The attachment hashes and file counts are recorded in `handoffs/PHASE_01_INPUTS.json`. Mentions of a sealing helper inside source text are not a snapshot seal. Historical preparation commits are not authenticated identities of these attachments.

This does not satisfy document 35's requested sealed-source provenance. The overlay manifest records exact **decoded snapshot-body** preimages and results, not a claim about the user's checkout bytes. A separately computed body-plus-one-terminal-LF hash is present when appropriate. The original applier remains unchanged: strict preflight is mandatory; the LF alternative needs explicit human review and its existing `--allow-terminal-newline` switch. CRLF differences, modified content, new-file collisions and every other mismatch must be reconciled from actual source, never forced. Transport tests proved application against a reconstruction, not the real checkout.

All 86 supplied files in `packages/fount_probe` are explicit hash-checked deletions. Excluded files, such as a decorative SVG or local build/dependency output, were not supplied and cannot be safely enumerated or hashed here. Inspect any remaining physical directory. Do not erase an unknown file merely to make a gate green.

The original applier leaves empty directories. The added `handoff/prune_deleted_directories.py` removes only empty ancestors of manifest-deleted files after successful application; it never removes a file or symlink. It reports nonempty ancestors. After the user's application, the physical retired package must be absent before Phase 1 can complete. The architecture gate checks this explicitly.

## What was written

The physical workspace is `fount`, `fount_observe`, `fount_intelligence`, `fount_workshop`. The overlay contains **159 added files, 33 modified files and 86 explicit deletions**. Every operation and byte hash is in the archive's `handoff/fount-overlay.manifest.json`, mirrored in the docset's `handoffs/PHASE_01_FILE_INVENTORY.json`.

Observe owns neutral request/answer/evidence contracts, closed lens/sensor/projection selection, model normalization, request association, partial errors, resource limits, cancellation, L1 measurement reuse and deterministic Sandbox. Intelligence owns the 16 preserved inspection playbooks, source-grounded reporting, investigation orchestration and a small pure interpretation core. Workshop owns completion, generated pages, review/acceptance/rejection, optional measured layout and speech. Fount owns generic canonical queries and exact-source validation.

The complete 37-production-module and 26-test-file classification is in `handoffs/PHASE_01_PRESERVATION_AUDIT.md` and repository `handoff/phase_01_ownership.json`. It is a source mapping, not proof of behavioral equivalence. Check every row while running the migrated tests. Existing Workshop development, alternatives, sequence/character/targeted revision, notes, recovery, audition, table read and export paths remain in source.

## Actual dependency APIs inspected

The supplied SystemOneSDK package source declares `0.6.0`; existing Fount lockfiles include the earlier `0.5.0` resolution. The new Observe dependency expresses `~> 0.6.0` and supports `FOUNT_SYSTEM_ONE_SDK_PATH` pointing at the **package** directory. This does not claim the release exists on Hex. Resolve and record the actual source used by all consumers; regenerate locks through Mix, not hand-edited hashes.

The Observe adapter uses the supplied public `SystemOneSDK.new_client/1`, `noul/2`, `choice/3`, `score/3`, `prepare/1` and `evaluate_stream/4` surfaces, and reads the actual response/answer structs inside `Fount.Observe.Providers.SystemOne`. Tests use the supplied `SystemOneSDK.Test` client and stubbing helpers. Noul has probability and no fabricated confidence; choices preserve ordered options; score retains the expected scalar. Batch association uses the SDK's actual batch index. Timeout, partial-failure and cleanup semantics require verification with the resolved SDK.

Inference source declares `0.4.0`. Workshop retains `Inference.Client.agent_session!/1`, the ASM adapter and `Inference.complete/3`; fixture examples use the actual `Inference.Client.new!/1` and `Inference.Adapters.Mock`. The public response-format union is `:text`, `{:json, :object}` or `{:json_schema, %{name: ..., schema: ..., strict: ...}}`. No provider-specific completion route is invented. Intelligence receives a trusted host `propose` function, not the Inference client. Completion traces/errors are reduced to neutral data before crossing back into analysis.

Exact local canonical APIs used include `Fount.Screenplay.new/1`, `from_document/2`, `apply/3`, `diff/2`, `to_fountain/1`, `Fount.ID.v4/0`, and the existing persistence/candidate/review APIs. New generic `Fount.Selection`, `SourceEvidence`, `Inventory` and `Search` helpers own canonical selection, evidence validation and retrieval rather than importing a retired analysis package.

## First risks to examine

1. **Syntax, formatting, warnings and dependency resolution.** No Elixir executable was available to the source-writing agent. New files have not been parsed, compiled or formatted by Mix. Resolve the supplied SDK API versus the earlier locks first; do not roll back the adapter to an old API to avoid the mismatch. Check optional ASM runtime/provider installation in the actual environment.
2. **Cross-package ownership and return shapes.** Compare migrated assertions with the actual new `Distribution`, `Observation`, `Report` and request values. Exercise single-request, streamed batch, out-of-order, duplicate, missing, malformed and timed-out results. `{:ok, batch}` may be partial; errors are never negative findings. Prove shared budgets and cancellation clean up actual SDK tasks.
3. **Evidence and cache identity.** Exercise Unicode spans, clipped input, candidate versus original revision, explicit history, missing/stale citations, cross-project namespace isolation, changed lens/context/question/options/model inputs, cache corruption and mutable provider identities. Reuse must create fresh revision-bound observations without rewriting immutable measurements. Any source ID visible to the model remains semantic input.
4. **Architecture enforcement.** Run the real AST and BEAM gate, not only the Python checks. Test aliases, grouped imports, captures, nested modules, structs and dynamic dispatch. Check compiled dependency closure and the intended Observe leaf allowlist. Do not weaken the gate to accommodate a misplaced effect. The scaffold is an enforcement mechanism, not a proof that arbitrary Elixir code is pure.
5. **Writer-visible preservation.** Run existing candidate/review/concurrency/recovery tests and the new stored writer demonstration. Check that analysis and generation do not advance the accepted head, that stale acceptance stays rejected, that actual candidate text appears in diffs/exports, and that keeping the original works as well as acceptance.
6. **Transport limitations and excluded files.** Confirm actual applied source/deletions, inspect retired-package remnants and record fresh post-QC exact-source seals. Do not hide the raw-input identity limitation in the runtime report.

## Focused checks first

Run from the actual Fount repository after inspecting dependency configuration. Commands below are a ladder, not results already obtained. Keep each failure visible and repair its cause before claiming the next gate. Use a directory outside the committed source for logs. Inspect each command's exit status; avoid a logging pipe that loses failures.

```bash
elixir --version
mix --version
python3 --version
node --version
npm --version

git status --short
git rev-parse HEAD
python3 -m unittest discover -s scripts/tests -v
bash -n scripts/verify_handoff.sh
```

When the supplied SDK checkout is the intended source, set `FOUNT_SYSTEM_ONE_SDK_PATH` to its actual `packages/system_one_sdk` directory, not the ecosystem root. Do not change unrelated sibling repositories. Inspect both the resolved dependency version and the checked-out adapter functions. Use targeted Mix dependency reconciliation as needed and commit resulting legitimate lock changes. New package locks were deliberately not fabricated offline.

```bash
mix setup
mix format
mix blitz.workspace format
mix blitz.workspace compile --warnings-as-errors

(cd packages/fount_observe && mix test)
(cd packages/fount_intelligence && mix test)
(cd packages/fount_workshop && mix test)
(cd packages/fount && mix test)

mix test
mix fount.architecture
```

The root `fount.architecture` alias first compiles the workspace and then invokes the Intelligence Mix task. Review `packages/fount_intelligence/lib/fount/intelligence/runner/architecture.ex` and the task's actual flags; the full gate must examine compiled artifacts. A source-only check is not equivalent. Test the gate's negative fixtures as well as the current positive tree.

## Complete engineering ladder

```bash
mix format --check-formatted
mix blitz.workspace format --check-formatted
mix deps.unlock --check-unused
mix blitz.workspace lock_check
mix blitz.workspace compile --warnings-as-errors
mix test
mix fount.architecture
mix blitz.workspace credo --strict
mix blitz.workspace dialyzer
mix blitz.workspace docs
```

Inspect actual xref/dependency output for every package and verify the four-package dependency direction. Build/inspect each intended package with its package-local `mix hex.build`; check README/license/assets/guides and package file allowlists without publishing. Original decorative assets for existing packages were excluded from the source input and should already exist in the user's checkout; distinguish that from a missing newly added asset. Run the updated CI-equivalent paths and the repository's `scripts/verify_handoff.sh --offline` as applicable. Its offline mode disables live providers, not dependency downloading; provision dependencies first for a disconnected run.

For residue checks, inspect tracked production/config/task/example/documentation references. The retained audit and negative architecture/source-test fixtures intentionally mention the retired name. Those historical or negative-test strings are not compatibility implementations. There must be no old production module, dependency, task wrapper or physical package remaining.

## PostgreSQL and real writer demonstration

Use a disposable test database with a known actual host/port and migration state. Do not assume localhost port 5432 or operate on a production/user writing database. Set `FOUNT_DATABASE_URL` through the environment; do not print or commit credentials. Record redacted connection identity and migration results.

```bash
(cd packages/fount && MIX_ENV=test mix ecto.create -r Fount.Repo)
(cd packages/fount && MIX_ENV=test mix ecto.migrate -r Fount.Repo)
(cd packages/fount && MIX_ENV=test mix test integration)

(cd packages/fount_workshop && npm ci)
(cd packages/fount_workshop && MIX_ENV=test mix test integration)
```

The Workshop integration directory includes actual PDF/action-layout tests. Install/verify the declared Node/Afterwriting dependencies and Poppler executables before running those tests; do not replace them with fake page counts. Resolve any existing integration failure, including concurrency and stale revision behavior.

Run the new demonstration in **both decision modes**, with unique output directories. It uses real PostgreSQL and actual public writing/review/export APIs with explicit `Inference.Adapters.Mock` and `Observe.Sandbox` answers. It is not a live-model or human-preference test.

```bash
(cd packages/fount_observe && mix run examples/sandbox.exs)
(cd packages/fount_intelligence && mix run examples/inspect.exs)
(cd packages/fount_workshop && mix run examples/phase_one.exs --out examples/_output/phase_one_reject --decision reject)
(cd packages/fount_workshop && mix run examples/phase_one.exs --out examples/_output/phase_one_accept --decision accept --pdf)
```

The demonstration must produce original/candidate/accepted Fountain, a real structural/source comparison, review JSON, strategy-contrast JSON, an HTML table read and a manifest of actual identities/results. The accepted head stays unchanged during development and revision generation. Rejecting a candidate keeps the prior accepted text. Acceptance installs the selected revision through the existing review contract. Inspect rendered PDF pages visually, not only `pdfinfo`; inspect the table-read content and the exported selected draft. Unsupported rendering must be reported, not silently dropped.

Run the existing recover/alternatives/sequence/character/notes/pass examples relevant to these paths; verify their actual current CLI modes from source. A new demonstration does not replace that preservation work. Exercise the existing optional speech adapter when the host supports it and authorization is present, but keep the non-speech table-read path independent. Do not invent timing, audience reactions or actor endorsement from synthesis.

## Authorized small live checks

Only after deterministic and storage checks pass, use approved credentials/material and the smallest useful fixture. Keep resource caps explicit. Do not send a private screenplay merely because credentials exist.

The measurement-only runner is `packages/fount_workshop/examples/analysis.exs --mode knowledge`; it loads the supplied fixture and requests explicit perspectives through Observe. Launcher reads `SYSTEM_ONE_API_KEY`, `SYSTEM_ONE_BASE_URL`, `SYSTEM_ONE_MODEL` and `FOUNT_SYSTEM_ONE_ENDPOINT_KIND` (`typesafe` or `endpoint`). Each configured endpoint/key pair must remain independent. A generic endpoint may omit bearer credentials; this is not an excuse to omit a required key on an official endpoint.

Use the existing small Workshop live mode with its real `FOUNT_CODEX_MODEL`/ASM configuration, inspecting source before selecting a mode. Test actual structured output/repair and prove generation is still candidate-only until acceptance. Record provider/model/source identity, actual usage, explicit errors and redacted traces. No live check was executed in the offline environment. A missing service must remain `NOT_RUN` or blocked according to the phase's authorized gate, never `PASS`.

## Evidence and exit criteria

Write `handoffs/PHASE_01_RUNTIME_QC_REPORT.md` using the supplied report template. Record commands, actual exit status/test counts, versions, redacted environment prerequisites, source/docset commits, fixes, rendered artifacts and remaining limitations. Keep executed checks separate from plans and earlier preparation results.

Phase 1 can be `COMPLETE` only when:

- the retired package is physically absent and the final four packages are the only relevant workspace packages;
- no compatibility/deprecation/dual-path replacement exists;
- every preservation row has reviewed source/test evidence and the existing writing workflows still work;
- dependencies, formatting, compilation, full tests, architecture gate and the required quality/package checks pass;
- actual PostgreSQL/concurrency/candidate/review and required PDF/export paths pass;
- document 36's Phase 1 demonstration has executed results for develop, revise, compare, accept/reject, table-read and export;
- authorized live gates are recorded honestly, with any explicit user waiver/debt distinguished from success;
- source identity, unknown excluded remnants and all important runtime findings are resolved or explicitly keep the phase blocked.

Update `PROGRESS.md`, traceability, decisions where real corrections were made, the offline/runtime handoffs, manifest inventory and docset hashes. Produce fresh **sealed** Fount/SystemOneSDK/Inference snapshots and the full updated docset for the subsequent handoff, following document 35 and the actual snapshot helper. Creating the next input packet is not authorization to implement Phase 2.

Stop after completing or accurately blocking Phase 1. Return repairs and evidence; do not start the next phase.

## Offline verification record

The source-writing environment ran 18 Python tests, shell syntax checking, ownership-destination checks and strict original-applier transport tests. Actual transport application preserved all untouched files and matched every declared result hash/mode; replay changed zero files. Conflicting preimages, unauthorized CRLF normalization, symlinks and tampered payloads were rejected. Unknown excluded files were retained and reported. See `handoffs/PHASE_01_STATIC_CHECKS.json`. None of these results establishes Elixir correctness or applicability to the actual user checkout.
