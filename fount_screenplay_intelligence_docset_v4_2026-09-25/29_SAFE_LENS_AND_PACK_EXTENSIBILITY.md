# Safe Lens and Pack Extensibility

## 1. Product goal

Writers and studios should be able to tailor analytical emphasis without recompiling Elixir, while the system remains auditable, resource-limited, provider-safe, and incapable of executing arbitrary code from configuration.

The key distinction is:

```text
open question/configuration space
!=
open executable-code surface
```

## 2. Extensibility tiers

### Tier 1 — writer questions and concerns

Open-ended natural-language concerns are allowed.

Examples:

- Is the fourth replay of the dinner adding enough new information?
- Does the anti-romance structure intentionally withhold the expected reconciliation?
- Is the audience likely to understand that these two flashbacks are mutually contradictory accounts?

The planner may answer using registered safe capabilities or report that required evidence/capability is unavailable.

### Tier 2 — declarative pack composition

A pack may select and weight already-installed lenses, diagnoses, capability slices, and playbooks.

No code change should be required.

### Tier 3 — constrained declarative lens authoring

A project/studio may define a new measurement rubric **only through registered generic measurement machinery** and a validated declarative contract.

### Tier 4 — new executable primitive

A new projection implementation, provider adapter, decoder, reducer, sensor execution primitive, or privileged tool requires code, tests, registration, and normal review/QC.

## 3. What a data-only pack may contain

A safe pack may declare:

```text
logical id
human description
intended genre/subgenre/craft purpose
references to installed lenses
references to installed diagnoses/playbooks
salience/priority adjustments
optional writer-intent prompts
resource policy requests within host caps
known subversions / opt-out guidance
```

A pack may not name arbitrary modules/functions.

## 4. What a constrained declarative lens may contain

Where the registered generic measurement primitive supports it, a lens may define:

```text
logical id
human description
measurement question/rubric
registered projection id
registered output-contract id
allowed context-slot declarations
choice/scale labels permitted by that output contract
examples/calibration references
requested resource class
```

The host validates every field.

## 5. What declarative assets may never define

They may not define:

- Elixir module/function names;
- shell commands;
- file paths to execute/read arbitrarily;
- provider endpoints;
- credentials;
- HTTP destinations;
- database queries;
- arbitrary recursion/loops;
- unregistered output decoders;
- unregistered projection code;
- privileged tools/actions;
- resource caps above host/studio policy;
- hidden access to unrelated screenplay/project data.

## 6. Prompt/instruction safety

A lens may contain natural-language measurement instructions, so it must be treated as potentially untrusted content.

Requirements:

- system/provider-control instructions remain code-owned;
- lens text is inserted only into a designated measurement-data/rubric slot;
- screenplay text is separately delimited as untrusted source content;
- model output is constrained to registered typed contracts;
- measurement models have no general tool execution privileges;
- provider adapters send only the context required by the lens;
- outputs cannot directly trigger canonical edits;
- privileged actions remain behind Workshop/user approval.

No prompt-injection filter is treated as foolproof. Safety comes primarily from least privilege and capability separation.

## 7. Resource safety

Declarative assets cannot create unmetered work.

Every lens/pack is subject to:

- max targets;
- max states;
- max input/output units;
- max provider requests;
- max wall/runtime budget where applicable;
- max local/GPU allocation where measurable;
- playbook/project/studio budget caps;
- deduplication and cache reuse;
- cancellation.

Host policy always wins over asset requests.

## 8. Trust classes

Suggested trust metadata:

```text
core
studio
project
third_party
```

Trust class affects installation approval, provider-export permissions, default enablement, and allowed resource ceilings. It does not create code execution privileges.

## 9. Installation workflow

A declarative asset should follow:

```text
author
  ↓
static schema validation
  ↓
registered-reference validation
  ↓
resource-policy validation
  ↓
context/projection privacy validation
  ↓
contract compatibility validation
  ↓
content hash
  ↓
preview / diff
  ↓
explicit install/enable
```

For studio/project assets, the source text and effective composed configuration must be inspectable.

## 10. Genre packs

Genre packs are optional salience overlays, not a list of genres Fount "supports."

Initial useful packs may include mystery, thriller, horror, romance, comedy, and action because those domains introduce recognizable specialized questions.

Do not invent a `DramaPack` merely for taxonomy completeness.

A new pack is justified when it contributes meaningful additional analytical emphasis beyond the generic capability families.

Hybrid/custom packs must be composable without Elixir changes when they use installed safe primitives.

## 11. Subversion and anti-genre intent

A writer can declare that a pack's expectation is being intentionally subverted.

Example:

```text
Apply mystery clue-fairness analysis,
but do not diagnose delayed culprit identification as a defect;
the film intentionally becomes a character drama after the midpoint.
```

The pack should change salience, not become a mandatory rulebook.

## 12. Failure behavior

If a pack/lens requests unsupported capability:

- fail closed;
- explain which primitive/contract is unavailable;
- do not silently approximate with unrelated sensors;
- do not execute arbitrary fallback code.

## 13. Authoring UX

This docset remains headless, but the API/CLI/reference tooling must make it possible to:

- inspect available primitives;
- validate a pack/lens asset;
- preview effective composition;
- estimate resource use;
- install/enable/disable a project/studio asset;
- inspect its content hash and trust/source metadata.
