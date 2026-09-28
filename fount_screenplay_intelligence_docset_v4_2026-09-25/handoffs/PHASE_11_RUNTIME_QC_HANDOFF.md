# Phase 11 Codex runtime QC handoff

You are the runtime/QC agent for **Phase 11 only: Scaled Calibration, Evaluation Corpus, Robustness, and Live Verification**.

The user has already applied and committed the Phase-11 Fount overlay and the updated docset. **Do not reapply the ZIP.** Start by inspecting the actual checkout and the user's commits. Repair Phase-11 defects you find, update the docset with actual evidence, and **stop before Phase 12**.

## 1. Establish the applied state

1. Read `PROGRESS.md`, `handoffs/PHASE_11_INPUTS.json`, `PHASE_11_OFFLINE_HANDOFF.md`, `PHASE_11_IMPLEMENTATION_MATRIX.md`, `PHASE_11_PRESERVATION_AUDIT.md`, and this handoff.
2. Record the user's applied Fount/docset commit identities and dirty state. Preserve unrelated changes.
3. Verify every Phase-11 overlay path against `handoffs/PHASE_11_FILE_INVENTORY.json` / the delivered overlay manifest. The source-writing baseline was Fount `6d164f636b6ffd0d9278c7f0ac436ce573447423` (tree `9a94735238e080f6a30bdad85b61d78a69a7d9b1`). Do not assume the user's overlay commit has that ID.
4. Confirm Phase 12 implementation is absent.

## 2. Re-inspect real dependency APIs

Do not invent or bypass APIs. Confirm the installed/source-resolved versions and the actual boundaries used by this checkout:

- SystemOneSDK 0.6.x: `SystemOneSDK.new_client/1`, question constructors, evaluation/list-model APIs as actually resolved. Fount Intelligence must not call it directly; Observe owns measurement execution.
- Inference 0.5.x: `Inference.Client.agent_session/1` and `/!1`, `Inference.complete/3`, `Inference.stream/3` as actually resolved. Workshop owns generation.
- ASM 0.17.x: session/query/stream APIs behind `Inference.Adapters.ASM`; do not add an Intelligence dependency on ASM.

If dependency resolution differs, repair to the real APIs and document the difference.

## 3. Format, compile and full preservation ladder

Run from the Fount workspace, repairing only Phase-11 defects:

```bash
mix format --check-formatted
mix fount.architecture
mix ci
python3 -m unittest discover -s scripts/tests -v
```

`mix ci` is the source repository's own full ladder and currently includes setup, formatting, unused-lock check, workspace compile with warnings as errors, workspace tests, architecture, strict Credo, Dialyzer and ExDoc. Record exact commands, exit codes and test counts rather than summarizing from memory.

The source-writing packet's repository-wide Python discovery had one import error because the XML snapshot omitted `scripts/prune_deleted_directories.py` while including its test. In the real checkout, inspect the tracked source. If the helper exists, discovery must run normally. If it is genuinely absent, fix only if this is a repository defect and record the repair; do not silently mark the suite green.

## 4. Focused Phase-11 unit and regression checks

At minimum run:

```bash
(cd packages/fount_intelligence && MIX_ENV=test mix test test/phase_eleven_evaluation_test.exs test/phase_eleven_nonlinear_benchmark_test.exs)
(cd packages/fount_observe && MIX_ENV=test mix test test/executor_sandbox_test.exs test/phase_two_execution_test.exs test/phase_two_provider_test.exs)
python3 -m unittest scripts.tests.test_phase_eleven_source scripts.tests.test_phase_ten_source scripts.tests.test_phase_nine_source -v
```

Verify specifically:

- independent annotations retain disagreement rather than collapsing to one label;
- reader checkpoints stay first-exposure/presentation-indexed;
- Brier/log-loss/ECE/abstention and ordinal errors are mathematically correct on hand-checkable fixtures;
- descriptive drift does not rank providers/models or call one better;
- frozen fixture rejects a changed output contract as `stale_output_contract_fixture` and the regeneration workflow creates a new current fixture rather than decoding old shapes;
- Reader still reduces in presentation order while StoryWorld story time remains partial/unknown unless evidenced;
- malformed/missing associations do not become negative evidence;
- missing fixture/provider, timeout and exhausted budget remain explicit acquisition failures;
- credential-like transport/config data cannot enter evaluation corpus records/provenance output;
- no Phase-9/10 behavior regresses.

## 5. PostgreSQL / durable longitudinal resource calibration

Use the repository's disposable test database procedure and current migrations, then run:

```bash
(cd packages/fount_intelligence && MIX_ENV=test mix test integration/phase_eleven_resource_history_test.exs)
```

Also rerun the Phase-10 durable-analysis integrations required by the current runtime protocol. Confirm resource comparison uses stored actual units, reuse is derived from actual cache hits/scheduled states, and missing hosted monetary cost remains `nil` rather than zero.

## 6. Provider-free screenplay evaluation demonstration

Run:

```bash
cd packages/fount_intelligence
mix run examples/phase_eleven.exs
```

Inspect the output rather than accepting exit status alone. It must show: rights policy for the synthetic fixture, disagreement-preserving reader summary, calibration/abstention metrics, current frozen-contract validation, all-12-family evaluation coverage, nonlinear fixture reference and resource estimate-vs-actual output. It must make no human-validation or creative-quality claim.

## 7. Authorized live Observe QC

Run **only if the user/host has authorized provider use and credentials/config are available**. The example sends a tiny synthetic hallway scene only.

```bash
cd packages/fount_observe
FOUNT_PHASE11_OBSERVE_LIVE=1 mix run examples/phase_eleven_live.exs
```

Use the existing supported environment for endpoint kind/key/base URL/model. Do not paste secrets into the report. Record provider/model identifiers only to the degree safely exposed by the existing provider fingerprint.

Required evidence:

- three completed synthetic measurements;
- exact current output-contract digest;
- per-run resource usage;
- descriptive baseline-to-last L1/selection/identity drift;
- no claim that repeatability equals accuracy, calibration, reader agreement or creative quality.

If live Observe is not authorized/available, record `NOT_RUN` with the concrete reason. Do not fabricate a pass. Apply the runtime protocol's completion rule to any required non-human live gate.

## 8. Authorized small Workshop live generation QC

Run **only if authorized and the existing Inference/ASM configuration is available**:

```bash
cd packages/fount_workshop
FOUNT_PHASE11_WORKSHOP_LIVE=1 mix run examples/phase_eleven_live.exs
```

Required evidence:

- existing `Inference.Client.agent_session!` / ASM path is used;
- Observe is disabled for this special QC mode;
- exactly one candidate is generated for the first scene;
- review/export artifacts are produced;
- candidate is not accepted and accepted head revision remains unchanged;
- resource budget/output is recorded without secret leakage.

Do not convert model output into a claim of writer usefulness. A real writer study is separate and optional under D046.

## 9. Packaging/docs/security gates

Run current package/archive inspection for all four packages and confirm `fount_intelligence` includes `priv/evaluation/*` and `guides/evaluation.md`. Run current secret/boundary scans. Ensure no direct SystemOneSDK/Inference/ASM dependency was added to Intelligence and no executable authority was added to declarative evaluation assets.

## 10. Human/domain evaluation

Human/domain review is optional and skipped by default under D046. If no actual study is commissioned, record it as `NOT_RUN` validation debt. **Never** write invented reviewer counts, agreement, calibration, usefulness or preference findings. If a study is actually run, use `PHASE_11_DOMAIN_REVIEW_PACKET.md`, store rights/provenance first, and keep support/validity separate from writer usefulness.

## 11. Completion and stop line

Update `handoffs/PHASE_11_RUNTIME_QC_REPORT.md`, `PROGRESS.md`, `TRACEABILITY_MATRIX.md`, relevant docset sections and integrity hashes with **actual** evidence. Phase 11 may become `COMPLETE` only under `18_RUNTIME_QC_PROTOCOL.md` after applicable engineering/non-human gates pass. Optional human study may remain validation debt under D046.

**Do not implement, scaffold, or begin Phase 12.**