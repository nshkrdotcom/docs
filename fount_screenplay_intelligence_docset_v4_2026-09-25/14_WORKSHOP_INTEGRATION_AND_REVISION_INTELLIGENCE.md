# Workshop Integration and Revision Intelligence

## 1. Goal

`fount_workshop` remains the writer-controlled generative/revision layer, but its analytical dependency changes from `fount_probe` to `fount_intelligence`. Intelligence owns playbooks and derived-state reasoning; Workshop continues to own generation and revision.

## 2. Existing strengths to preserve

The current workshop already has important product properties:

- candidate revisions rather than silent canon changes;
- saved sessions;
- targeted rewrite;
- sequence rebuild;
- character rewrite;
- note response;
- passes;
- recovery;
- alternatives/audition/combine concepts;
- review packets and diffs;
- explicit acceptance/rejection;
- stale-base checks;
- PDF/table-read review surfaces.

These should be retained while analytical lineage becomes richer.

## 3. New request flow

```text
writer request/note
  -> playbook investigation
  -> concern(s)
  -> observations + timelines + reader state
  -> competing diagnoses
  -> writer/agent selects diagnosis to explore
  -> treatment strategies
  -> inference-backed candidate generation
  -> canonical typed edit application
  -> post-candidate analysis
  -> revision intelligence packet
  -> explicit writer review
  -> accept/reject/combine/iterate
```

## 4. Inference boundary

The supplied `inference` repomix is authoritative for actual client/adapters/schema/structured completion APIs.

Offline implementation agents must inspect it rather than assume superseded Probe call shapes.

`Inference` belongs in the generation/synthesis path, not inside pure reducers.

## 5. Candidate lineage

Every generated candidate should preserve:

- base revision;
- workflow/playbook ref;
- source concern/note IDs;
- selected diagnosis IDs;
- strategy ID;
- protected strengths/constraints;
- inference provider/model metadata;
- prompt/context fingerprint where available;
- analysis report IDs before and after.

## 6. Strategy before prose

For substantial rewrites, generate or select a strategy first.

Example:

```text
concern: midpoint reveal feels flat
selected diagnosis: audience likely inferred reveal by scene 22
strategy A: delay strongest confirming clue
strategy B: preserve reveal timing but change reveal to relationship betrayal
strategy C: make predicted reveal occur, then add a second consequence that changes objective
```

Only then generate concrete pages for selected strategies.

This makes alternatives genuinely different rather than paraphrases.

## 7. Revision intelligence packet

A candidate review packet should eventually contain:

### Intended effect

- concern;
- selected diagnosis;
- strategy;
- expected dramatic state changes.

### Exact edits

- source diff;
- semantic diff;
- change groups;
- affected targets.

### Target effect analysis

- did the relevant observations/timeline state move as intended?
- did reader-question/reveal timing change as intended?

### Collateral analysis

- continuity changes;
- causal dependency changes;
- knowledge/access changes;
- setup/payoff breakage;
- relationship changes;
- voice drift;
- action/readability changes;
- protected-strength conflicts.

### Uncertainty

- analyses not run;
- provider failures;
- low-confidence observations;
- diagnoses still ambiguous.

## 8. Note-response workflow

The notes workflow should no longer be “note -> edit.” It becomes:

```text
raw note
 -> parse reaction / suggested cause / suggested solution
 -> inspect relevant playbook(s)
 -> diagnose
 -> reconcile conflicting notes
 -> preserve required/protected constraints
 -> propose strategies
 -> optionally generate candidates
```

Existing `NoteResponse` behavior should be mined for candidate/edit/session mechanics but reconnected to the new analysis path.

## 9. Alternatives and audition

Alternatives should differ at a meaningful strategy level.

`strategy_contrast` behavior from the current Probe source is worth reimplementing as a playbook/diagnosis utility: detect when “three alternatives” are cosmetic variants of the same causal idea.

## 10. Combine

Combining candidate pieces must respect dependency completion. Existing workshop `ChangeGroups` ideas remain valuable: selection should never silently include additional writing, but the system can report required dependent changes before materialization.

## 11. Propagation

A major story decision change should use semantic/temporal dependency graphs to identify consequences before generating repairs.

Example:

```text
change: Mara never sees Dan take the key
potential consequences:
  scene 19 accusation no longer supported
  scene 27 trust rupture loses cause
  scene 31 knowledge state invalid
  final payoff reference needs alternate setup
```

Workshop can then generate repair strategies with explicit scope.

## 12. Acceptance

No analysis or model output advances canon automatically.

Acceptance remains an explicit writer decision against the expected base revision, preserving current transaction/staleness principles.

## Writer-facing integration contract

Workshop must consume/attach Intelligence results without flattening evidence, diagnosis, strategy, and candidate into one opaque note. Candidate/review packets should preserve the writer presentation semantics in `27_WRITER_INTERACTION_AND_PRESENTATION_CONTRACT.md`.

Before expensive investigative/rewrite workflows, Workshop should surface the applicable resource preflight/caps from `30_LONGITUDINAL_RESOURCE_ECONOMICS.md` when the caller surface supports it.
