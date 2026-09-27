# Codex: verify, repair and complete Fount Phase 2 only

**Historical execution prompt:** Phase 2 runtime QC is complete. See
`PHASE_02_RUNTIME_QC_REPORT.md` and `PHASE_02_PACKET_RECORD.md` for actual results
and sealed post-QC sources. The OFFLINE_IMPLEMENTED status below describes the
applied source delivery before runtime QC.

**Phase:** 2 - Observe Measurement Substrate Hardening.
**Source-delivery status:** OFFLINE_IMPLEMENTED, not runtime verified.
**Date:** 2026-09-26, Pacific/Honolulu.

## Start from the user's applied commits

The user applies and commits `fount_phase_02_overlay.zip` and the separate complete
`fount_phase_02_docset.zip`. You must verify that already-applied state. **Do not
reapply either ZIP, repeat deletions, reset unrelated work, or begin Phase 3.**
Read current `PROGRESS.md`, `AGENT_START_HERE.md`, Phase 2 in document 16, documents
18/23/24/35/36 and the `PHASE_02_*` handoffs. Follow the actual repository's aliases
and APIs rather than inventing commands. Repair ordinary implementation defects;
do not stop at a failure report or substitute a new plan for working source.

Record the actual Fount/docset application commits, clean/dirty status, dependency
source identities, OS, Elixir/OTP/Mix, Python, Node and PostgreSQL versions. They
are unknown to the source-writing agent. Preserve unrelated local changes.

## Inventory and authenticity

The overlay has **21 added, 25 modified, zero deleted files**.
Its manifest is `handoff/fount-overlay.manifest.json`; the full per-file inventory
and 32 newly written ExUnit test names are in docset
`handoffs/PHASE_02_FILE_INVENTORY.json`. Verify applied result hashes before your
repairs, then keep your repair diff distinct. The archive manifest is metadata and
is not installed as a self-hashed payload.

All current attachments are unsealed raw XMLs. Their hashes/content identification
are in `PHASE_02_INPUTS.json`. Every modified preimage matches the supplied Phase 1
post-QC file hash, including exact terminal-LF restoration where proven. There is
no preimage mismatch bypass. The prior report names Fount `b82b656`, SDK `e757598`
and Inference `3750a03`; these are historical declarations, not current input
seals or invented user application commits.

Important omissions: the input does not contain
`handoff/prune_deleted_directories.py`, although it retains the original test.
Check the actual checkout rather than writing a guessed replacement. The current
SDK export has 253 files and omits `client_configuration_test.exs`, unlike the
historical 254-file seal. Re-review its known dummy-credential security exclusion
before including it in the next sealed SDK snapshot. Original Fount decorative
SVGs are excluded from the XML, not deleted from the project.

## What is implemented

The source supplies closed output/context contracts and content digests; exact
model-visible input serialization separated from provenance; projection request
construction; raw-preserving calibration; model stability and safe identity;
private ETS L1 with LRU/TTL/entry quotas; privacy namespaces; preflight/actual
resource metadata; state/question/wire caps and atomic state budgets; partial
completion across timeout/cancel/error; safe recording/import paths; a data-only
Sandbox file loader; and an inspectable scene-question example.

Existing Memory cache, direct Sandbox fixtures, projection inspection and public
Observe evaluation remain. No canonical/Workshop source, dependency lock, schema,
existing test or installed lens file is removed/replaced. The one Intelligence
change hashes semantic context exactly as Observe does. No L2 database, full
StoryWorld/Reader/diagnosis implementation or future writer phase is added.

## Actual SDK APIs, not guesses

The supplied SystemOneSDK source is 0.6.0. Observe uses existing `new_client/1`,
`noul/2`, `choice/3`, `score/3`, `prepare/1`, `evaluate_stream/4`, `version/0`, and
actual `SystemOneResponse` metadata fields. Native values stop at the adapter.
The new request-size mapping uses the source-defined `:request_too_large` type.
New tests use the actual `SystemOneSDK.Test` client/stub/requests/close API.

Inference 0.5.0's `complete/3`, Client/Request/Response and format/adapter contracts
were inspected. No Inference integration is added or moved; creative generation
remains Workshop-owned. Do not rewrite generation or upgrade dependencies merely
because the Observe source changed. The prior QC report records a local SDK 0.6.0
path requirement; inspect real resolution rather than claiming current Hex
availability from that historical report.

## Checks the source-writing agent actually ran

Read `PHASE_02_STATIC_CHECKS.json` for command/exit evidence. The three available
Python suites pass 22 checks total. Full discovery reports those 22 passes plus
one import error for the snapshot-omitted cleanup helper. Shell syntax and exact
JSON/fixture/source-preservation/archive checks are separately recorded. No
Elixir parser/formatter or runtime was available. An optional parser installation
attempt failed due unavailable DNS; no syntax-validation claim follows from it.

**Unrun:** Mix formatting, dependency resolution, compilation, all ExUnit tests,
compiled architecture, Credo, Dialyzer, ExDoc, package builds, all examples,
PostgreSQL, PDF/speech and all live providers. Prior Phase 1 green evidence does
not transfer to modified files. There was self-review, not an independent review.

## Focused checks first

Use the existing local dependency path when required by actual resolution:

```bash
export FOUNT_SYSTEM_ONE_SDK_PATH="$HOME/p/g/n/system_one_sdk/packages/system_one_sdk"
mix setup
```

After verifying the applied hashes, run the formatter and repair source rather
than assuming offline-written formatting is acceptable. Record its diff. Then:

```bash
(cd packages/fount_observe && mix format)
(cd packages/fount_intelligence && mix format)
(cd packages/fount_observe && MIX_ENV=test mix compile --warnings-as-errors)
(cd packages/fount_observe && MIX_ENV=test mix test test/phase_two_contracts_test.exs test/phase_two_execution_test.exs test/phase_two_sources_test.exs test/phase_two_provider_test.exs test/phase_two_scene_question_test.exs)
(cd packages/fount_observe && MIX_ENV=test mix test)
(cd packages/fount_observe && MIX_ENV=test mix run examples/phase_two.exs)
(cd packages/fount_observe && MIX_ENV=test mix run examples/fixture_file.exs)
```

Save actual output outside the repository. Verify question answers remain raw,
calibration is separate, evidence points to the current revision, hidden notes
never enter the packet, unavailable is not a negative verdict, and Fountain stays
unchanged. Fixture output is an engineering oracle, not an empirical model result.

## Review high-risk behavior deliberately

1. **Contracts and identity:** real noul/choice/score normalization, shape/domain
   changes, typed decoding, current Fact evidence bindings, stale cache/import
   rejection, and revised evidence/dependency reconstruction. Test changed input,
   question, context, projection, model, parameters and privacy namespace. All
   malformed public inputs should yield typed errors, not raw exceptions/data.
2. **Async/operational behavior:** prove the first completed measurement survives
   the second request's timeout; verify cancellation and SDK process cleanup;
   preserve duplicate/missing association failures. Check no live work is retried
   past a finite request cap and no shared state budget overspends. Do not infer
   remote cancellation success from killing a local task.
3. **Cache and safety:** ETS owner/TTL/quota behavior, cache outages as misses,
   raw/contract/metadata tamper rejection, unchanged Memory behavior, aliases not
   treated as immutable, and no secrets in inspect/errors/results/logs. Verify
   custom declarations cannot execute modules, resolve URLs or raise host caps.
4. **Source paths and presentation:** human/rule values have no fake probability;
   imported values match current semantic input and projection and bind new
   evidence; fixture files reject stale contracts, duplicates and invalid shape.
   Inspect the scene question's exact evidence and non-claims, not just exit zero.

Do not weaken tests, raise budgets to mask defects, remove source checks, add
compatibility readers or fabricate live/domain results. Add focused regressions
for defects you find, repair them and rerun the relevant full suites.

## Full four-package and architecture ladder

The actual root `mix ci` alias includes setup, root/workspace formatting and unused
lock checks, workspace warnings-as-errors compile, all four package tests, the
compiled architecture gate, strict Credo, Dialyzer and ExDoc. Run it after focused
repairs, then record the actual results rather than only the final exit code:

```bash
python3 -m unittest discover -s scripts/tests -v
bash -n scripts/verify_handoff.sh
mix ci
bash scripts/verify_handoff.sh --offline
```

The original cleanup helper should be present in the actual checkout; resolve its
absence from evidence before claiming full Python success. Verify the four-package
dependency direction, no Probe runtime/dependency residue, no pure Intelligence
provider/IO reach-through, no native SDK values outside Observe's adapter, and no
new Inference use outside Workshop. Preserve the architecture gate and negative
fixtures. Inspect package contents/builds with `FOUNT_PACKAGE_BUILD=1 mix hex.build`
in each intended package when dependencies/assets are available. Do not publish.

## Persistence, writing and export preservation

Phase 2 changes no DB schema, but acquisition affects existing workflows. With an
explicit isolated test database in `FOUNT_DATABASE_URL`, use the existing commands:

```bash
(cd packages/fount && MIX_ENV=test mix ecto.create)
(cd packages/fount && MIX_ENV=test mix ecto.migrate)
(cd packages/fount && MIX_ENV=test mix test integration)
(cd packages/fount_workshop && MIX_ENV=test mix test integration)
```

Never drop/reset a user's existing database. Record any unavailable PostgreSQL,
Node/PDF or speech prerequisites rather than inventing success. Rerun the existing
writer demonstration in reject and accept modes, using distinct output directories:

```bash
(cd packages/fount_workshop && MIX_ENV=test mix run examples/phase_one.exs --out /tmp/fount-phase2-reject --decision reject)
(cd packages/fount_workshop && MIX_ENV=test mix run examples/phase_one.exs --out /tmp/fount-phase2-accept --decision accept --pdf)
```

These use Mock/Sandbox but real persistence/review/export. Inspect exact draft
preservation, candidate isolation, reject/accept heads, table-read and PDF output.
Record what actually ran. No new human pilot is required by Phase 2; no human
creative-quality or audience claim may be fabricated.

## Authorized live measurement gate

Only run with actual authorization and real configuration. The new live example
sends a tiny synthetic scene, not private screenplays, and caps initial requests
at one with retries off. Configuration names, without secret values:
`FOUNT_OBSERVE_LIVE=1`, `FOUNT_OBSERVE_ENDPOINT_KIND=typesafe|endpoint`,
`FOUNT_OBSERVE_API_KEY`, `FOUNT_OBSERVE_BASE_URL`, `FOUNT_OBSERVE_MODEL`.
Generic endpoints may omit bearer auth where the actual provider supports it.

```bash
(cd packages/fount_observe && MIX_ENV=test mix run examples/live.exs)
```

Run representative supported noul/choice/score questions. Record requested and
reported model, provider/endpoint digest, SDK version, request/usage metadata,
raw versus calibrated values and non-secret error paths. Verify official and
arbitrary supported endpoint/key construction; use deterministic transport tests
for cases without live credentials. Missing permission, endpoint or credentials
is an explicit gate status, not a pass or reason to fabricate an API. No real key,
authorization header or raw endpoint credential belongs in logs/docset.

The previous Phase 1 Luna alternatives timeout/uninspected-citation debt remains
user-authorized historical debt. It does not authorize silently waiving this
phase's measurement checks or expensive new generation attempts.

## Exact exit and return contract

Complete every row in `PHASE_02_IMPLEMENTATION_MATRIX.md` with actual source/test/
demo evidence. Required engineering gates: closed output/context validation;
exact spec/input/model identity; stable-only/durable identity enforcement;
raw/calibration separation; cross-revision result reuse with fresh evidence;
privacy/cache safety; correct resource/budget/timeout/partial semantics;
deterministic/human/import/fixture paths; the scene-question available/unavailable
and unchanged-source demonstration; preserved four-package/writer behavior;
format/compile/tests/architecture/static-quality/docs/package checks as required
by document 18. Report actual live gate results or explicit unresolved authority/
environment gaps. Do not reuse Phase 1's waiver without a new explicit decision.

Fix failures and create `handoffs/PHASE_02_RUNTIME_QC_REPORT.md` with actual commands,
exit codes, counts, toolchain, application/repair commits, defects, remaining
limitations and any explicit validation debt. Update PROGRESS, traceability,
decisions only for real changes, this handoff, inventory and integrity hashes.
Use QC_BLOCKED for unresolved engineering/environment gates, not COMPLETE by
assertion. Mark COMPLETE only when the phase's gates are met or a specific
user-authorized exception is recorded honestly.

Prepare fresh **sealed** Fount, SDK, Inference and complete docset XMLs from the
post-QC source using the existing sealing tool and document 35. Verify exact bytes,
reviewed security exclusions and no secret/build output. Return the updated QC
record and packet. **Stop after Phase 2. Do not implement Phase 3.**
