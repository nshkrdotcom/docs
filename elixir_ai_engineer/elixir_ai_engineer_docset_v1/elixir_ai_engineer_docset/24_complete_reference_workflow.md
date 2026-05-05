# 24 — Complete Reference Workflow

This is the full end-to-end workflow for a greenfield Elixir system using the Elixir AI Engineer harness.

## Step 1 — Write Charter

Human writes 5–15 invariants.

Output:

```text
spec/charter.md
```

Gate:

```text
No invariant without planned enforcement path.
```

## Step 2 — Define Nonfunctional Priorities

Human + LM critique.

Output:

```text
spec/nfr.md
```

Includes:

```text
maintainability, team expertise, latency, security, observability, durability, operational budget
```

## Step 3 — Capability Map

Define user/system capabilities without modules.

Output:

```text
spec/capabilities.md
```

Gate:

```text
No implementation nouns unless domain concepts.
```

## Step 4 — Domain Model

Define entities and relationships.

Output:

```text
spec/domain.md
```

Gate:

```text
No duplicate/synonym concepts unresolved.
```

## Step 5 — Boundary Graph

Define components and allowed edges.

Output:

```text
spec/boundaries/*.md
```

Gate:

```text
Every cross-component operation declared.
```

## Step 6 — Contracts

Define operations, inputs, outputs, errors, preserves.

Output:

```text
spec/contracts/*.md
```

Gate:

```text
Every capability has at least one contract or explicit deferment.
```

## Step 7 — State and Effects

Define state machines and effect declarations.

Output:

```text
spec/protocols/*.md
spec/effects/*.md
```

Gate:

```text
Forbidden transitions listed for every lifecycle.
External effects explicitly declared.
```

## Step 8 — Architecture Tournament

Generate and compare runtime shapes.

Output:

```text
adr/*.md
```

Gate:

```text
Pure module considered first.
Winning choice justified by NFRs.
```

## Step 9 — SpecCell decomposition

Break components into implementable cells.

Output:

```text
spec/cells/*.md
```

Gate:

```text
Leaf cells have enough detail for context bundle.
```

## Step 10 — Bundle

Run:

```bash
mix spec.bundle <cell>
```

Gate:

```text
Bundle sufficiency check passes.
```

## Step 11 — Generate Skeleton

Run:

```bash
mix spec.gen <cell>
```

Gate:

```text
Skeleton contains no invented architecture.
```

## Step 12 — Bounded LM Fill

LM fills allowed holes only.

Gate:

```text
Patch touches only allowed files.
No new domain terms/effects/processes.
```

## Step 13 — Evidence

Run:

```bash
mix spec.accept
```

Gate:

```text
format, compile, tests, spec.audit, ENF pass.
```

## Step 14 — Compression Challenge

If cost threshold triggered:

```bash
mix spec.compress <cell>
```

Gate:

```text
Lower-cost candidate preserving evidence preferred.
```

## Step 15 — Accept and Record Lineage

Accepted artifact records:

```text
spec cell
context bundle hash
operator runs
model runs
test evidence
normalization report
```

## Step 16 — Runtime Evidence

Run targeted runtime/adversarial tests.

Output:

```text
spec/evidence/*.md
```

## Step 17 — Reverse Extraction

As code changes:

```bash
mix spec.watch
```

Classify deltas:

```text
conforming detail
spec violation
spec omission
implementation bloat
spec refinement candidate
dead behavior
```

## The loop

```text
Spec → Bundle → Skeleton → LM Fill → Audit → Test → Compress → Accept → Runtime Evidence → Spec refinement
```

That is the Elixir AI Engineer workflow.
