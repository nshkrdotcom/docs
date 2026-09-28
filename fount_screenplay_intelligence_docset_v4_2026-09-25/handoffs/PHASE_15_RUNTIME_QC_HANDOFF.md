# Fount Phase 15 — Codex Runtime QC Handoff

You are completing **Phase 15 only: Read, Share, Resume, and Prove Usefulness**. The user has already applied and committed the supplied Fount overlay and updated docset. **Do not reapply the overlay. Do not start Phase 16.**

## Read first

Read `PROGRESS.md`, documents 16 and 33–36, D046 in `DECISIONS.md`, `handoffs/PHASE_15_INPUTS.json`, `PHASE_15_IMPLEMENTATION_MATRIX.md`, `PHASE_15_PRESERVATION_AUDIT.md`, `PHASE_15_STATIC_CHECKS.json`, and `PHASE_15_FILE_INVENTORY.json`. Treat source-delivery status as `OFFLINE_IMPLEMENTED`, not proof of Elixir/runtime/database or human behavior.

## Verify the applied state

1. Record Git status, commit/tree and toolchain versions.
2. Before repair, verify every Phase-15 path against `PHASE_15_FILE_INVENTORY.json`. Preserve supplied overlay result hashes separately from any repair hashes.
3. Confirm dependency resolution: Workshop still uses Inference `~> 0.5.0` and ASM `~> 0.17.1`; no direct SystemOneSDK dependency was added.
4. Confirm Phase 16 is untouched.

## Compile and repair

Run formatter and warnings-as-errors compile first. Repair genuine Phase-15 defects in the smallest existing surface. Do not add a second screenplay serializer, second canon/acceptance path, second session store, hidden provider call, simulated audience, aggregate screenplay score, or compatibility shim to make a test pass.

## Focused Phase-15 requirements

Run `packages/fount_workshop/test/writer_workflows/phase_fifteen_read_share_resume_test.exs` and `phase_fifteen_usefulness_test.exs` and inspect actual artifacts.

- **W10 / A09 — human read:** packet must work with no speech service; source screenplay/revision/selection and exact selected pages must be inspectable; a human pronoun-confusion reaction must remain separate from screenplay facts; TTS/synthesis cannot create audience feedback, engagement, laughter, timing or actor endorsement.
- **W10 / A11 — clean share:** generate Fountain + FDX from the selected accepted canonical draft. Confirm private note, boneyard/omitted scene and unchosen Workshop candidate text are absent; dual dialogue, Unicode and title metadata survive where supported; unsupported/lossy output (the fixture page break) is reported in the manifest rather than silently lost. Verify the original Core no-op supported roundtrip fidelity regressions still pass.
- **W11 / A10 — stale/resume:** accept one sibling candidate and retry that same decision idempotently; prove stale/other candidate cannot overwrite the new head; preserve explicit rejected and remaining/proposed candidates; resume from persisted state without duplicate accepted edits.
- **W12 / A12 — honest evidence:** the deterministic records may represent neutral keep-original, negative/generic basic-LLM, and positive Fount outcomes. Confirm report has no score/winner/greenlight/marketability/expert/representative-sample claim and keeps engineering evidence separate from human response. Do not convert the fixture into a claim that humans preferred Fount.

Then run `packages/fount_workshop/integration/phase_fifteen_read_share_resume_test.exs` against disposable PostgreSQL. Use a fresh Store/Repo read and verify accepted head, accepted/rejected/remaining decisions, packet/source identity and clean-share privacy after resume.

## End-to-end writer path

Execute the documented provider-free path from `guides/read-share-resume-and-usefulness.md` using existing commands: capture → explore → revise → compare → accept/reject → export/read → resume. Inspect the saved Fountain/FDX, table-read packet, share manifest, session state and canonical head. A graphical editor is not required.

The basic-LLM and Fount-assisted comparison paths are part of the runnable contract, but a live provider call is not required for deterministic engineering completion unless separately authorized. If you do run one, use the actual Inference facade and report it separately. Never infer human usefulness from model output.

## Full engineering/preservation ladder

After focused repairs pass, run the established repository gates: full `mix ci`; compiled architecture; strict Credo; Dialyzer; ExDoc warnings-as-errors; Python suite; four `FOUNT_PACKAGE_BUILD=1 mix hex.build` packages; disposable PostgreSQL migrations/integrations; Core lossless Fountain/FDX fidelity tests; Phase-12 stale/idempotent/session tests; Phase-13 voice/rehearsal/comparison; Phase-14 notes/research/consequence; PDF/table-read regressions and any existing Submission/export tests.

The offline XML export still lacks `scripts/prune_deleted_directories.py` while retaining its test. Prior runtime records say the actual checkout contains the helper. Verify the real checkout; do not treat the export omission as a Phase-15 defect.

## Optional human study

`PHASE_15_DOMAIN_REVIEW_PACKET.md` is optional under D046 and assumed **NOT_RUN** unless separately commissioned. If skipped, make no human usefulness or comparative-superiority claim. If run, preserve individual outcomes and the small-sample limitations; do not aggregate them into a screenplay score/winner.

## Completion and docset update

Record every command/result and repair in a new `PHASE_15_RUNTIME_QC_REPORT.md`. Update current hashes separately from original overlay identities, plus `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `MANIFEST.md`, document 36 and checksum indexes. Mark Phase 15 `COMPLETE` only if applicable non-human runtime/database/preservation gates pass. Leave optional human/provider work explicitly NOT_RUN where unrun. **Stop before Phase 16.**