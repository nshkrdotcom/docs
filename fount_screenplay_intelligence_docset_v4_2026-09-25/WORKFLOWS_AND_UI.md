# Workflows, writer controls and delivery

## First-release journeys

The application must complete all three, using deterministic fixtures in CI and optional explicitly authorized live providers separately:

| Journey | Inputs and useful result | Required protection |
| --- | --- | --- |
| Brief → opening sequence | Brief, character/length constraints; initial opening-sequence candidate and review/export packet | Genesis is an explicit seed/import, not auto-acceptance of generated pages; generated continuation remains a candidate until approval |
| Reveal change | Existing screenplay; move Lena's knowledge of theft to the final third; compare saved dramatic routes and repair affected consequences | Preserve train-platform scene and declared middle-section suspicion; show affected and uninspected material |
| Dialogue pass | Selected scenes and voice/style direction; compare actual original/proposed dialogue | Out-of-scope scenes and protected lines remain unchanged; unknown voice findings are visible |

Use rights-cleared local fixtures with at least three scenes, meaningful protected material, and a measurable multi-scene consequence. Tests assert resulting pages/structure, choices, invariants and stored provenance; do not accept empty strings or a mock timeline as a journey. Scripted inference should supply plausible typed edits and independent failures. No claim about professional creative quality follows from fixture tests.

## Stage mapping

| Stage | Domain integration and durable output |
| --- | --- |
| Intake | Core import/load/seed and selection validation; store exact base, goal, protected material and effective policy; run Workshop preflight without generation |
| Investigate | Intelligence playbooks or Workshop investigate; save reports, inspected/omitted scope, uncertainty and strengths to preserve |
| Plan | Workshop preparation/strategy generation, saved strategy IDs and evidence; pause before materialization when route choice is human |
| Write | Dispatch a closed operation: develop, alternatives, propagate, sequence, character, notes, pass, recover; save session/candidate and lineage |
| Check | Stored structural, scope, protected-material and configured semantic checks; revision comparison and exact review packet |
| Iterate | Select smallest actionable finding, preserve successful branches, start/resume bounded targeted work; record why another iteration is warranted |
| Decide | Candidate completion or exact authorized human/agent/service approval; explicit reject/fallback and stale-base behavior |
| Deliver | Persist Fountain/FDX, review packet, diff and requested PDF; label candidate versus accepted content |

Run stages are not aliases for `Session.resume/3`. Preserve an actual preparation checkpoint and strategy selection before pages are generated. At baseline `Strategy.materialize/4` exists; inspect its accepted modes, options and stored progress before integrating. Add public Workshop seams only for missing stage/idempotency/fencing behavior. Use the current closed Request/Workflows validators. Product presets must not introduce unrecognized workflow names such as the proposal's sample `autonomous_pass`.

An iteration may build on an unaccepted candidate, but its final acceptance must still compare against the accepted base. Preserve parent-candidate lineage and compose validated edits into a final candidate rooted at that base; never silently accept intermediate pages to make parent IDs fit. If existing Workshop composition cannot express the operation, add the smallest tested composition path. A final review shows all accumulated changes against canon. Cross-candidate checks and report provenance must remain valid for the final result.

## Decisions and steering

Decision kinds include investigation scope, strategy, candidate selection, iteration, budget/uncertain retry, stale-base rebase and final approval. Bind each to run/plan/policy, base, and a context fingerprint; include candidate ID/hash/check fingerprint where applicable. Available choices are saved before display. Atomically resolve with pending status and exact fingerprint; the same response is idempotent, a competing response conflicts.

Base/scope changes create successor runs. Goal clarification, notes and constraints/protected passages within the existing base/scope append immutable plan snapshots; replacement text creates a new candidate bound to the authorizing plan. Preserve prior output. Plan or policy changes supersede affected pending decisions and fence old approval attempts; browser tabs holding old forms receive a clear conflict with a refresh path. Rebase calls the actual Workshop three-way rebase with explicit conflict choices, creates a linked successor, reruns checks and creates a new approval. No old review approval travels across a rebase.

Candidate-only completion exports without an accept prompt. Human acceptance pauses with exact pages and a typed final-approval decision. `submit_decision` owns its resolution; `approve_run` and CLI `approve` require that exact decision ID/fingerprint and delegate. The response is persisted with a stable approval attempt before the shared bridge commits canon; a resolved decision alone is not shown as an accepted draft. Automated approval persists its attempt and resource reservation before invoking the configured agent/service callback, then saves the exact returned review before validation/acceptance. Failed/unknown required checks cannot be hidden. A permitted human fallback opens a new decision/attempt and retains the failed automated record.

The CLI exposes start, show, step, decisions, decide, plan, pause, resume, stop, policy, approve and export with JSON output and stable nonzero error codes. `plan` calls `update_plan`; `approve` is a convenience form of `decide` for an exact final-approval decision, using the same response and replay semantics. Run it from `packages/fount_run` with a configured Repo/host context; the workspace root has no implicit application runtime. CLI command help and examples must cover the same public API as the web host. State-changing input includes expected version/fingerprint or idempotency key as appropriate.

## Host app

Build a small Phoenix LiveView app at `apps/fount_web`. Choose compatible versions from source/toolchain evidence in Phase 06 and commit its lockfile after runtime resolution. Add it to workspace commands and snapshot inclusion. It owns the Repo process, migration runner, worker child specifications, provider service factory and one-owner project mapping. Reuse Core tables for screenplay identity. Do not require Phoenix from any library package.

For the first host, use an explicitly configured local owner and a server-side authenticated session established with a configured access credential. Bind to loopback by default; session identity and project authorization are checked on all reads, commands and artifact downloads. Never take owner or approver identity from form fields. Store credentials in runtime configuration, not docs, fixtures or run JSON. Keep CSRF protection and escape imported screenplay/notes. Hosted multi-user registration/team permissions are deferred.

| Surface | Required behavior |
| --- | --- |
| Project list/intake | Import Fountain/FDX or create brief seed; choose existing accepted base; state which action establishes genesis |
| Run setup | Goal, scope, constraints, protected passages, presets and gate overrides; effective limits/known estimates; clear statement whether canon may change |
| Run timeline | Current scope/stage, saved routes/candidates, check state, incurred/estimated/unknown cost, pending action; reconnect/reload reconstructs from DB events |
| Decision inbox | Exact question and options, relevant pages/evidence, consequence, safe default; one valid submission per checkpoint |
| Review | Side-by-side actual pages and structural changes, provenance, findings, unknown checks and override reasons; explicit candidate selection and approval |
| Delivery | Download requested formats with candidate/accepted labels and content identity; retry a failed export without rerunning writing or acceptance |

Pause/resume/stop must show when an in-flight call is settling and prevent another dispatch. A stopped run retains results. Progress uses durable sequence IDs; PubSub only accelerates updates and is not the source of truth. Two browser tabs and reconnects cannot duplicate a decision or acceptance. Notifications in the app are enough; email and Slack integration are outside this release.

## Export and artifact contract

Use existing Core/Workshop serializers, PDF and review exports. Required standard bundle: Fountain, FDX, exact review JSON/Markdown, source/structural diff, resource/check summary and provenance manifest with revision/candidate/content hashes. PDF is required when selected and installed prerequisites are satisfied; otherwise show a named unavailable/failed artifact, never a fabricated success. Table read/audio can use existing integrations when configured, but new speech infrastructure is deferred.

Use a host-configured artifact root and generated safe names. Validate destination paths and authorize downloads. Stage output in a temporary directory then atomically publish a complete manifest; checksums cover bytes. Record individual failures so a PDF retry does not repeat successful exports. Do not include credentials, provider raw secrets or private internal traces. Candidate export leaves canon unchanged, and accepted export is bound to the stored acceptance result even if a later run changes the head.