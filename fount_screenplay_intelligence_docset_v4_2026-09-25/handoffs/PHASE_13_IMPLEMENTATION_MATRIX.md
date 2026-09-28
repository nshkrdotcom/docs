# Phase 13 Implementation Matrix

Status: **OFFLINE_IMPLEMENTED / runtime NOT_RUN**. This maps document 36 Phase 13 (W04-W06, A02-A05) to delivered source. It is source-delivery evidence, not runtime proof.

| Requirement / scenario | Delivered behavior | Source / tests | Offline status |
|---|---|---|---|
| W04 cinematic passes | Existing `action_visual` plus new `sound_space`, `cinematic_rhythm`, and `transition` profiles expose visual, audible, spatial, stillness, rhythm and transition revision directions without requiring camera directions | writing profiles; `Request`; `Writing.Preparation`; `Writing.Generation`; `Pass`; profile test | WRITTEN; ExUnit NOT_RUN |
| W04 quiet-scene preservation | Pass prompt explicitly permits silence/stillness/offscreen sound and forbids manufacturing dialogue/voiceover/camera direction unless requested | `writing/generation.ex`; Phase-13 guide | WRITTEN |
| A02 two actual treatments | Synthetic quiet-key fixture produces a visual/stillness treatment and an offscreen-sound treatment; comparison reads actual typed screenplay changes and shows zero language changes for both | `phase_thirteen_comparison_test.exs`; `Comparison` | WRITTEN; ExUnit NOT_RUN |
| A02 generic-control rejection | A fluent explanatory dialogue control is a saved candidate but explicitly rejected, preserving the untouched/cinematic choices | comparison test | WRITTEN; ExUnit NOT_RUN |
| W06 writer-selected exemplars | `voice_exemplars` selects exact authorized current-screenplay targets; character workflow also reuses existing `exemplar_targets` | `Writing.VoiceProtection`; `Request`; `Writing.Context` | WRITTEN |
| W06 protected exact text | `protected_text` becomes required writer `pin_text` constraints through the existing deterministic constraint path; required failures remain hard review blockers through existing ReviewGate behavior | `Writing.VoiceProtection`; existing `Constraints`/`ReviewGate`; voice test | WRITTEN; ExUnit NOT_RUN |
| A04 repetition/multilingual/clipped protection | Fixture protects exact repeated multilingual line and cue; an action-only edit passes, normalized dialogue fails; prompt/context exposes no-silent-translation/normalization rule | `phase_thirteen_voice_test.exs`; `VoiceProtection` | WRITTEN; ExUnit NOT_RUN |
| W06 language competence limit | Voice context explicitly states that similarity is not a quality score and language/cultural authenticity is not certified | `VoiceProtection.context/2`; guide | WRITTEN |
| W05 rehearsal outside canon | Exercises persist only in session progress with `canonical: false`; add/list does not call screenplay apply or StoryWorld | `FountWorkshop.Rehearsal`; rehearsal test | WRITTEN; ExUnit NOT_RUN |
| A05 non-adoption | Active and rejected invented backstory are absent from later generation context and canonical screenplay remains unchanged | rehearsal test | WRITTEN; ExUnit NOT_RUN |
| A05 explicit adoption | Adopt requires actor/note, records traceable adoption, and only then exposes project material to later generation while still declaring it noncanonical/not a StoryWorld fact | `Rehearsal.adopt/4`, `generation_context/1`; `Session.request/1` | WRITTEN; ExUnit NOT_RUN |
| Actual comparison evidence | Stable-ID `Fount.Screenplay.diff/2` drives action/language/transition/dialogue deltas; proposal summary is labeled `generator_claim` and `generator_claim_is_evidence: false` | `FountWorkshop.Comparison`; comparison test | WRITTEN |
| Canon authority preserved | Phase-13 helpers do not accept candidates or mutate canonical head; acceptance/review path is unchanged | `Acceptance` unchanged; preservation audit | SOURCE INSPECTION |
| Dependency/API preservation | Generation remains Workshop -> Inference -> ASM adapter; analytical calls remain Observe -> SystemOneSDK; Phase 13 adds no new dependency/API | `Launcher`, `mix.exs`, Observe provider; input record | SOURCE INSPECTION |
| Phase-14 stop line | No W07-W09 research/notes/consequential-revision implementation is added | source-contract test + inventory | PASS |

## Required demonstration status

The A02/A04/A05 deterministic fixtures and comparison/voice/rehearsal tests are written. The optional human tradeoff packet preserves the required original/candidate/generic-control comparison but is **NOT_RUN** under D046. Because Mix/Elixir are unavailable here, no Phase-13 ExUnit/runtime/database result is claimed.

## Runtime QC update — 2026-09-27

The source-delivery statuses above remain historical. Phase 13 is now `COMPLETE` on applicable non-human gates at Fount repair commit `26da17e`: 4/4 focused Phase-13 tests, real `Constraints`/`ReviewGate` hard-pin assertions, actual stable-ID A02 page comparison, and 1/1 new PostgreSQL rehearsal-resume regression pass. Full `mix ci` passes 347 workspace tests and architecture/strict quality/docs; 105 Python tests, 33 database integration tests and four Hex package builds pass. D046 human/domain review and live provider evidence remain `NOT_RUN`. See `PHASE_13_RUNTIME_QC_REPORT.md`.