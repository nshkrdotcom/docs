# Screenplay Run: product design

Retained product brief from 2026-09-27. The implementation contracts in this docset govern exact APIs, policy fields, persistence and phase ordering. See WORKFLOWS_AND_UI.md for the six-phase release boundary.

## Purpose and user

A solo screenwriter or development editor wants to turn a brief, notes, or an existing screenplay into better pages over multiple rounds without supervising every model call. They need to see what changed, steer significant story decisions, protect material that matters, and stop or resume work. Some runs should end with candidate pages for review. An autonomous run with an authorized agent approver may publish an accepted draft after bounded checks. The user cares about pages and decisions, not graph nodes or agents.

This design assumes one owner per project at first. Team permissions and shared editorial approval are later product work. Screenplay quality remains a creative judgment; automated checks can find specific problems and support choices, but cannot certify that a draft is good.

## The job the app completes

Example: a writer imports a 95-page feature and says, “Move the reveal that Lena knows about the theft to the final third. Preserve the train-platform scene, keep her suspicion in the middle, and make the ending less explanatory.” The app identifies affected scenes, proposes distinct routes, writes alternate pages, checks dependencies and protected material, repairs concrete failures within a limit, and presents the changed screenplay. At any configured checkpoint, it pauses with a compact decision: choose a route, edit a direction, keep or reject a passage, or continue. The run ends with a reviewable candidate, an explicitly accepted revision, or a clear partial result with the saved work intact.

The same flow works for a new screenplay. The writer starts with a brief, target length, characters, and constraints; the app develops an initial candidate, then repeats diagnosis and revision over chosen scopes. “Complete pipeline” means a run can carry work from input to an exported result without a required human click at every stage. It does not mean generating an entire feature in one uninspected call.

## Writer experience

1. **Set up the run.** Import Fountain/FDX or start from a brief. Pick the accepted base revision, goal, scope, hard constraints, protected passages, optional style references, output format, maximum rounds, and resource budget. Show an estimate where Fount can provide one, and label unknown costs as unknown.
2. **Choose control.** Start from a preset and adjust checkpoints individually. The run summary states which steps can proceed, what requires a decision, and whether the accepted draft can change.
3. **Watch useful progress.** The run view shows the current screenplay scope, stage, candidate branches, completed checks, costs, and the next decision. It shows failure or uncertainty as such. A writer can pause, resume, or stop after the current safe checkpoint.
4. **Steer.** At a pause, choose a dramatic route, narrow or expand the authorized scope, add a constraint, pin a passage, supply replacement text, request another alternative, or reject a branch. A changed scope or base starts a new version of the run plan; existing results stay attached to the old version.
5. **Review the result.** Compare actual pages and structural changes with the base, open cited evidence and checks, audition dialogue, inspect a PDF, and see why each candidate was kept or discarded. Accept, reject, continue another round, or export without acceptance.

The interface can initially be a simple web app: project list, run setup, run timeline, decision inbox, and side-by-side screenplay review. Inline editing is valuable once the basic loop is dependable, but a full Final Draft-style editor is not required for the first release.

## Control settings

Control is a policy over a **fixed sequence of screenplay decisions**, not a choice among “human mode” and “AI mode.” A preset fills in defaults; each gate can be overridden per run.

| Decision | App may decide | Pause for writer | Always enforced |
| --- | --- | --- | --- |
| Investigation scope | Select relevant inspections within the authorized screenplay scope | Approve or change the questions and evidence scope | Record inspected and omitted material |
| Dramatic route | Choose among saved strategies using declared goal and checks | Compare routes and pick or rewrite one | Keep route identity and reasoning trace |
| Candidate generation | Write bounded alternatives and retry malformed/failed attempts | Approve direction before pages or request another attempt | Preserve candidate/base separation and scope validation |
| Revision loop | Continue with a targeted repair or new pass | Decide whether a creative weakness merits another round | Stop at configured round, call, and spend limits |
| Final result | Export candidate or accept via authorized agent approver | Review exact pages and approve/reject | Never hide failed/unknown required checks; reject stale-base acceptance |

Suggested presets:

- **Writer led:** pause after diagnosis, route selection, and candidate review (`completion: :accept, approver: :human`).
- **Guided:** the app investigates and drafts alternatives, then asks at route choice and final review.
- **Candidate only:** the app selects a route and iterates within limits, then stops with a review packet (`completion: :candidate`). The accepted draft is untouched.
- **Autonomous acceptance:** the app runs through to completion and advances canon under an authorized agent approver (`completion: :accept, approver: {:agent, "editorial-reviewer"}`). The exact same acceptance transaction is executed, requiring every required check to pass and permitting no automated overrides.

The writer can override a preset before launch. During a run, tightening a gate takes effect before the next decision. Loosening a gate or expanding scope requires a new policy version recorded on the run; it cannot retroactively authorize an action already taken.

For the reveal-change example, the writer might set investigation and candidate writing to automatic, require a route choice after diagnosis, allow one automatic repair of a failed continuity check, and require final page review. The app may spend several provider calls without interruption, but it stops with the two proposed dramatic routes before writing pages. After the writer selects one, it finishes the authorized work and returns the exact changed pages. Changing the final gate to autonomous acceptance simply sets `completion: :accept, approver: {:agent, "editorial-reviewer"}` in the run policy.

## Intervention rules

The app pauses when a selected gate requires a writer decision, an action would exceed the declared scope or budget, a required check fails after allowed repair, evidence is insufficient for a required claim, two candidates have a material unresolved trade-off, or the base draft has changed. It does not ask the writer to approve every provider call. A pause includes the exact question, options, relevant pages/evidence, consequences, and a safe default such as “leave the candidate unaccepted.”

An intervention changes future work. It does not edit a saved candidate invisibly. If the writer pins a line or rewrites a scene, the app creates a writer-edited candidate or a new run version with provenance. If the accepted head moved while work was in progress, the app offers an explicit rebase/compare choice rather than silently applying old pages to the new head.

## Run stages

These stages are product concepts. Fount's existing workflows are operations called within them; they are not one-to-one stage objects.

| Stage | Output | Typical Fount operation |
| --- | --- | --- |
| Intake and preflight | Validated brief/scope, base revision, constraints, limits | Core import/selection; Workshop preflight |
| Investigate | Evidence-backed concerns and protected strengths | Intelligence playbooks; Workshop `investigate` |
| Plan | Several dramatic routes or one targeted direction | Workshop strategies |
| Write | One or more candidate revisions | `develop`, `alternatives`, `propagate`, `sequence`, `character`, `notes`, `pass`, `recover` |
| Check | Deterministic and semantic findings, exact diff, optional PDF | Candidate checks; Intelligence revision analysis; Review packet |
| Iterate | New candidate from a specific finding or writer note | Workshop repair, a new workflow session, selection/combination |
| Decide and deliver | Rejected/accepted candidate or exported packet | Review, explicit acceptance, Fountain/FDX/PDF/table read |

There is one bounded loop: **write → check → optionally iterate**. A failure should target the smallest affected scene or sequence. The app does not keep rewriting until a model says the screenplay is “good.” It stops when the requested work is complete enough for review, a configured limit is reached, or a material question needs the writer.

## What counts as success

For a writer, a successful run produces usable pages, makes the differences understandable, protects declared invariants, and leaves every unresolved issue visible. For the product, measure how often a run reaches a reviewable candidate, how often the writer accepts or retains any of its writing, how many interventions were needed, how often scope/check failures were caught, and actual time/cost per accepted outcome. Do not optimize to a single model-generated quality score or acceptance rate alone.

The first release should prove three journeys end to end: a new brief to reviewable opening sequence; a major reveal change with consequence repair; and a dialogue pass on selected scenes. Each must be resumable after process interruption and leave canon unchanged unless an authorized approval is committed. Both writer-led (`approver: :human`) and autonomous (`approver: {:agent, id}`) runs use the identical transactional acceptance path.

## Explicit limits

The app will not promise a final production-ready screenplay, legally sufficient clearance, or objectively ranked dramatic quality. It cannot infer a writer's preferences from one prompt. Uncertain analysis remains uncertain; the writer can inspect the cited pages. Full screenplay auto development is possible as a bounded series of operations, but its creative outcome needs review in real use.