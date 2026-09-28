# Fount Phase 13 — Codex Runtime QC Handoff

You are completing **Phase 13 only: Cinematic Revision, Rehearsal, and Voice**. The user has already applied and committed the supplied Fount overlay and updated docset. **Do not reapply the overlay. Do not start Phase 14.**

## Read first

Read `PROGRESS.md`, documents 16 and 33–36, `handoffs/PHASE_13_INPUTS.json`, `PHASE_13_IMPLEMENTATION_MATRIX.md`, `PHASE_13_PRESERVATION_AUDIT.md`, `PHASE_13_STATIC_CHECKS.json`, and `PHASE_13_FILE_INVENTORY.json`. Treat the source-delivery status as `OFFLINE_IMPLEMENTED`, not proof that Elixir/runtime checks passed.

## Verify the applied state

1. Record clean/dirty Git state, current commit/tree and toolchain versions.
2. Before repair, verify every Phase-13 path against `PHASE_13_FILE_INVENTORY.json`. Preserve original overlay hashes separately from any repair hashes.
3. Confirm actual dependency resolution. The supplied source has Workshop dependencies on `inference ~> 0.5.0` and `agent_session_manager ~> 0.17.1`; `FountWorkshop.Launcher` constructs `Inference.Client.agent_session!` with `Inference.Adapters.ASM`. System One stays behind Observe. Do not rewrite these boundaries unless a real source/runtime defect requires a minimal repair.

## Compile and repair, do not merely report

Run formatter and warnings-as-errors compile first. Repair genuine Phase-13 source defects. Do not invent compatibility APIs, parallel acceptance paths, or new persistence tables to make tests easier. Reuse existing Session/Store, Constraints/ReviewGate, Screenplay.diff and Inference/Observe boundaries.

## Focused Phase-13 requirements

Run the four new writer-workflow test files and inspect their artifacts. Establish all of the following with actual execution:

- **W04 / A02:** `action_visual`, `sound_space`, `cinematic_rhythm`, and `transition` are valid pass profiles. Two quiet-scene candidates materially differ through cinematic means while preserving silence/repetition. The untouched scene remains valid. A fluent explanatory control is rejected.
- **W06 / A04:** writer `protected_text` is translated into required deterministic `pin_text` checks on the existing constraint/review path. Changing exact `Not today. Not today.` / multilingual protected text must hard-fail; an action-only edit must pass. Do not silently translate/normalize dialect, multilingual text, fragments or repetition. Keep the language-competence limitation visible.
- **W05 / A05:** active or rejected rehearsal inventions are absent from later generation context and never become canonical/StoryWorld facts. Explicit adoption requires traceable actor/note and only then becomes noncanonical project material eligible for later exploration. Resume must preserve decisions.
- **Comparison evidence:** `FountWorkshop.Comparison` must derive changes from real base/candidate screenplay values and stable IDs. Proposal summaries remain `generator_claim`; they cannot satisfy evidence by themselves.

If current unit seams are insufficient, add the smallest real-store integration regression using existing Store/Session interfaces. Do not introduce a migration unless runtime behavior proves one is necessary.

## Preservation / full engineering ladder

After focused repairs pass, run the repository's established gates rather than substituting guessed commands: full `mix ci`; compiled architecture; strict Credo; Dialyzer; ExDoc warnings-as-errors; Python source suite; four `FOUNT_PACKAGE_BUILD=1 mix hex.build` packages; disposable PostgreSQL migrations/integration; relevant Phase-12 discovery/session/stale-idempotent acceptance regressions; writer/PDF/table-read regressions as required by the existing CI/handoff protocol.

No live provider call is needed to prove deterministic Phase-13 engineering behavior. If you run one, it must be separately authorized and reported as live-model evidence, not deterministic proof. Human/domain review in `PHASE_13_DOMAIN_REVIEW_PACKET.md` is optional under D046 and is assumed NOT_RUN unless explicitly commissioned.

## Completion and docset update

Record every actual command/result and every repair. Update `PHASE_13_RUNTIME_QC_REPORT.md`, preservation/inventory hashes as needed, `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, `MANIFEST.md`, document 36 execution record, checksum indexes and any decision record only if a decision actually changes. Mark Phase 13 `COMPLETE` only when all applicable non-human engineering/preservation gates pass.

**Stop with Phase 14 still `NOT_STARTED`.** Do not implement W07-W09 or any Phase-14 feature in this pass.
