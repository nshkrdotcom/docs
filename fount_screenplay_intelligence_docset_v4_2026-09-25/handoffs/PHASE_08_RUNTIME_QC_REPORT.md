# Phase 8 runtime QC report — Capabilities C

**Status:** COMPLETE on non-human engineering and preservation QC, 2026-09-27. Phase 9 remains NOT_STARTED.

## Applied state and repair identity

- Applied Fount commit `f4f1062dace46e9743645505b4c8ca9d4db69945`, tree `6d6f407ee620324d2065f550e1558e513186ef5c`.
- Final Fount repair commit `f7f4d68f8992d5b93c32d077e13ff1901e96add7`, tree `5b12527bc588d545a4b3fd4a9aac3114fe7d7afc`.
- Applied docset commit `d018af2921a4fd6326677d51d6b44180ceab8400`, tree `0b86f84248c0f4e7a00da7357e20ca6fd1d93268`. The companion documentation repair commit is recorded in docset Git history.
- Before repair, all 37 delivered Fount paths matched `PHASE_08_FILE_INVENTORY.json` by SHA-256 and byte count. No overlay was reapplied. The tracked real cleanup helper is `handoff/prune_deleted_directories.py`; it was preserved. The XML-only omission did not apply to this checkout. Original delivery identities and committed post-repair identities are in the inventory.

## Commands and results

All Mix commands used `FOUNT_SYSTEM_ONE_SDK_PATH=/home/home/p/g/n/system_one_sdk/packages/system_one_sdk` and `ERL_FLAGS='+S 4'`, the established local SDK path. The first focused Mix attempt without the SDK path stopped at dependency resolution; it did not alter source. No live provider call was made.

| Gate | Actual result |
|---|---|
| Root `mix format --check-formatted`, `mix compile --warnings-as-errors` | Passed. Package formatter initially found delivered Phase-8 formatting; repaired. Final full `mix ci` passed root and all four package format and warnings-as-errors compile gates. |
| Observe `mix test test/phase_eight_lens_assets_test.exs` | 3 passed. Four installed lens JSON assets load through Observe schema with content identity. |
| Intelligence `mix test test/phase_eight_architecture_test.exs test/phase_eight_capabilities_test.exs test/phase_eight_packs_test.exs test/phase_eight_runner_test.exs` | 12 passed after repairs. The Phase-7 architecture regression also passed after updating its historical eight-family assertion to an ordered-prefix assertion. |
| Intelligence `mix run examples/phase_eight.exs` | Passed after fixing scene insertion to use `Screenplay.apply/2` element maps. Packet retains nil generated candidate. |
| `python3 -m unittest discover -s scripts/tests -v` | 64 passed, including real cleanup-helper tests. |
| Root `mix ci` | Passed after repairs: Core 71, Observe 65, Intelligence 126, Workshop 58 = **320 tests**; dependency/lock checks, format, warnings-as-errors compile, compiled architecture, strict Credo, Dialyzer, ExDoc all passed. Log: `/tmp/fount-phase8-ci-final.log`. |
| Focused preservation regressions | 37 StoryWorld/Reader/Diagnosis/WriterRunner/Phase-6/7 Intelligence tests and 28 canonical Core lossless/interchange/edit/persistence tests passed. |
| `bash scripts/verify_handoff.sh --offline` | Passed; compiled/source architecture status `pass`, zero violations. Ledger `/tmp/fount-handoff-offline-20260927T113319-211033/status.tsv`. |
| Isolated PostgreSQL `fount_phase8_qc`, Core `MIX_ENV=test mix ecto.migrate && mix test integration` | Passed, 11 tests, local peer socket `/var/run/postgresql` port 5433. |
| Same PostgreSQL, Workshop `MIX_ENV=test mix test integration` | Passed, 14 tests covering Develop, targeted rewrite, sequence rebuild, pass, recovery, writer accept/reject, PDF and action layout. |
| Workshop `mix run examples/phase_one.exs --decision accept --pdf` and `--decision reject --pdf` | Both passed with Mock Inference and Observe Sandbox; each rendered a two-page PDF and table-read output. Accept advanced canon; reject retained the base revision. |
| Core roundtrip and Workshop table-read examples | `mix run examples/live.exs --mode roundtrip` and `--mode table_read` passed; real JSON/HTML table-read and PDF were written. |
| Four `FOUNT_PACKAGE_BUILD=1 mix hex.build` archives | Passed. Inspected 117/83/107/80 content members for Core/Observe/Intelligence/Workshop. Four Phase-8 Observe lens assets and the Intelligence Phase-8 example are included; no build/dependency trees, Node modules, environment files or PDFs were packaged. Archives were removed after inspection. |

The Workshop's deterministic speech/table-read test passed in full CI using a supplied synthesis callback. A real eSpeak executable was unavailable, so an external WAV render was not run. The pre-existing npm install emitted audit advisories; `mix ci` exited 0. The initial Dialyzer run used a stale local-dependency PLT and reported the new Observe catalog function as unknown. `mix dialyzer --force-check` refreshed the PLT and passed with zero errors; final `mix ci` then passed unchanged.

## Defects and repairs

1. Loaded the delivered Phase-8 fixture from Intelligence `test_helper.exs` so focused/full tests use the intended screenplay and records.
2. Renamed the comedy pack's `callback` salience key to `comic_callback`; the authority guard correctly rejects the former as an executable-style key. All six optional core packs now validate and install disabled.
3. Fixed Elixir clause grouping/default headers and formatted delivered Observe/Intelligence files under package formatter rules. Refactored Phase-8 source and fixture code for strict Credo without suppressing checks.
4. Repaired the provider-free Phase-8 example's scene content to use the actual `Screenplay.apply/2` map API.
5. Updated the Phase-7 catalog regression to assert preservation of the original ordered eight-family prefix while Phase 8 adds families 9–12.
6. Hardened custom-pack composition: an enabled catalog placeholder or altered custom lens cannot satisfy a registered lens reference. The caller catalog entry must contain an enabled, content-matching, freshly validated declarative Observe lens. Added negative regression assertions.

7. Updated the Python source-contract assertion for the refactored Emotional/Value opt-in helper; all 64 repository Python tests then passed. This final source-test-only commit followed the successful full Mix CI and changed no Elixir source.

## Capability and boundary verification

`Capabilities.families/0` has exactly twelve entries, ending in `emotional_value_movement`, `theme_meaning`, `genre_lens_packs`, `revision_intelligence`. The four new lens assets load through Observe schema. Emotional/Value retains separate practical, hope, fear, security, belonging, trust, status, control, certainty, moral-confidence, event/reaction, choice and consequence evidence; no universal emotion or quality score is emitted. Theme retains competing hypotheses, support, counterevidence, motif/value/choice/consequence links and writer-intent comparison; it emits no authoritative theme or depth score.

Mystery, thriller, horror, romance, comedy and action are initial optional core packs, disabled in a fresh caller catalog. Project/studio/third-party pack validation checks trust/source, installed lens/family/playbook references, salience, writer intent, subversions, opt-outs and explicit requests bounded by host caps. Custom declarative lenses use registered Observe projections, existing `noul`/`choice`/`score`, `observe.answer_set`, safe context/resource policy and supported calibration refs; authority-bearing fields are rejected. Installation and enablement remain distinct for lenses and packs. Genre analysis treats declared intent/subversion as context, not a universal defect or conformity score.

Revision comparison requires explicit before/after screenplay models. The normal single-screenplay playbook path refuses `revision_regression`. Its packet includes exact structural/source changes, declared target effect, collateral risks, protected-strength evidence, state transitions, separate character and relationship trajectory diffs, Reader state/trajectory diffs including changed retained keys, causal ripple and story-time continuity. Source/presentation, diegetic StoryWorld, and story-time effects stay separate; non-linear presentation is preserved. Strategy contrast accepts 2–5 supplied strategies and has no winner/ranking. The ten pre-existing writer-playbook IDs and `character_trajectory` default routing remain; Emotional/Value and genre work require explicit opt-in. Candidate generation stays nil; no Phase-8 path writes or accepts canonical pages. Compiled architecture and source review found no new direct SystemOneSDK, Inference or ASM dependency/call leak. Provider acquisition remains Observe-owned and generation/canon acceptance remains Workshop/Inference-owned. No Phase-9 implementation was added.

## Validation debt

The optional `PHASE_08_DOMAIN_REVIEW_PACKET.md` study was **not run** under D046. No human-audience, emotional-validity, genre-conformity, theme-authority, writer-usefulness, calibration, or live-provider claim is made. Phase 9 remains NOT_STARTED.