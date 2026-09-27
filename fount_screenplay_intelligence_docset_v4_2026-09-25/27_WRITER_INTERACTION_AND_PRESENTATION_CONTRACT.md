# Writer Interaction and Presentation Contract

## 1. Why this exists

Fount is headless, but headless does not mean presentation-undefined.

The analytical engine must expose a stable writer-oriented semantic result contract so that chat, desktop, web, CLI, editor plugins, studio services, and future interfaces do not invent contradictory ways of presenting the same diagnosis.

This contract is about **meaning**, not pixels.

## 2. Writer-facing result hierarchy

A result packet should keep the following levels separate:

```text
WRITER QUESTION / REPORTED EXPERIENCE
        ↓
OBSERVATION / SOURCE EVIDENCE
        ↓
DERIVED STATE / TRAJECTORY
        ↓
DIAGNOSTIC HYPOTHESIS
        ↓
COUNTEREVIDENCE / ALTERNATIVES
        ↓
POSSIBLE STRATEGY
        ↓
OPTIONAL WORKSHOP CANDIDATE
```

A frontend may collapse sections visually, but the underlying data must not collapse these concepts semantically.

## 3. Claim classes

Every writer-facing claim declares one class:

### 3.1 Canonical fact

Directly recoverable from canonical screenplay data.

Examples:

- this line occurs in Scene 18;
- MARA appears in the scene;
- the prop is explicitly named here.

### 3.2 Derived narrative state

Computed from source-grounded facts/observations using deterministic dramatic logic.

Examples:

- this question has remained unresolved for seven presented scenes;
- this relationship has no observed leverage reversal across the sequence;
- this event depends on an earlier setup.

### 3.3 Model-estimated interpretation

A probabilistic model-backed measurement or interpretation.

Examples:

- this line is likely an evasion rather than a direct response;
- this beat likely shifts status toward MARA;
- the reader may infer the identity before the intended reveal.

### 3.4 Human-calibrated response estimate

A prediction supported by evaluation against human labels/readers for a clearly defined population/task.

Examples may eventually include calibrated inference likelihood or confusion-risk predictions.

Until such calibration exists, do not present model-estimated interpretation as this class.

## 4. Required writer result packet

A writer-facing playbook result should provide, when applicable:

```text
ResultPacket
  concern / question
  scope
  intended experience / constraints
  concise finding
  claim class
  evidence
  trajectory / temporal shape
  diagnoses
  counterevidence
  alternatives
  uncertainty / missing evidence
  protected strengths
  possible next investigations
  strategies (only when requested / appropriate)
  revision comparison
  resource usage
  limitations / non-claims
```

The exact Elixir struct/module naming is an implementation detail.

## 5. Concise finding versus evidence body

The first screenful/message should not dump the entire analysis graph.

A useful compact form is:

```text
Finding
  "The interrogation appears to lose pressure after the first reversal."

Why
  - Mara's tactic remains unchanged through the next four exchanges.
  - Dan gives new information but loses no leverage.
  - The scene's open threat is not made more immediate.

Counterpoint
  - The repetition may be intentional if the desired effect is entrapment/stasis.

Inspect
  Scene 42, turns 8–19
```

The detailed packet remains available beneath that summary.

## 6. Temporal presentation contract

For trajectories, expose meaningful transition points rather than only aggregates.

Where supported, identify:

- introduction;
- reinforcement;
- escalation;
- reversal;
- stall/stasis;
- transformation;
- resolution/payoff;
- abandonment;
- uncertainty/ambiguous state.

For Reader outputs, these points are always presentation-order relative.

For diegetic state, they are qualified by story-time/reality scope and may remain partially ordered.

## 7. Competing diagnoses are first-class

Do not present one generated explanation as the answer when several fit the evidence.

Example:

```text
Concern: "The middle feels slow."

Hypothesis A
  Repeated tactic / low state change.

Hypothesis B
  Objective remains active, but the threat deadline disappears.

Hypothesis C
  The sequence contains substantial change, but all of it is informational rather than relational/action change.
```

Each diagnosis carries:

- supporting evidence;
- counterevidence;
- missing evidence;
- confidence/calibration status;
- what would distinguish it from alternatives.

## 8. Protected strengths

Every revision-oriented packet can include writer-declared or previously observed strengths to protect.

Examples:

- keep the reveal ambiguous until the diner scene;
- preserve Mara's restraint;
- do not resolve the father relationship here;
- preserve the joke callback;
- retain the silent final beat.

A proposed strategy/candidate should state whether evidence suggests these remain intact.

## 9. Intent and subversion

The output must have a place for:

- desired effect;
- genre/anti-genre intent;
- deliberate ambiguity;
- deliberate repetition;
- deliberate stasis;
- intended misdirection;
- intentionally unresolved material.

A diagnosis that ignores declared intent is lower quality even if its local measurement is correct.

## 10. Revision comparison

For before/after analysis, present:

```text
Intended effect
Observed change
Improved evidence
Regressed evidence
New collateral effects
Protected strengths status
Unresolved concern
```

Do not reduce a revision comparison to "score went from 71 to 78."

## 11. Resource transparency

Every expensive playbook packet includes actual usage and, where available, preflight versus actual comparison:

- provider requests;
- input/output units/tokens where available;
- cache/reuse hits;
- local/on-prem compute estimate/actual where measurable;
- configured monetary estimate if pricing is available;
- budget exhausted/skipped enrichment.

See `30_LONGITUDINAL_RESOURCE_ECONOMICS.md`.

## 12. Reference renderer

Before a rich GUI exists, the repository should ship a deterministic human-readable reference renderer for result packets.

Acceptable initial surfaces:

- Markdown;
- JSON plus Markdown summary;
- HTML report;
- CLI text designed from the same packet.

The renderer is an evaluation surface, not the final product UI.

## 13. Evaluation requirements

Human domain review should score the presentation separately for:

- evidence support;
- usefulness;
- clarity;
- novelty/non-obviousness;
- respect for writer intent;
- uncertainty honesty;
- source navigability;
- whether the result suggests a fix too aggressively.

## 14. Non-goals

This contract does not specify:

- desktop layout;
- web framework;
- editor integration;
- chat personality;
- visual styling;
- final timeline visualization.

Those are future surfaces over this semantic contract.