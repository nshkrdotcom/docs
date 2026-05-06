# 23 — Architecture Tournament

## Purpose

AI often chooses the first plausible architecture. A real engineer compares alternatives.

The architecture tournament makes comparison explicit before code exists.

## Tournament input

```text
SpecCell
Nonfunctional requirements
ENF policy
Domain model
Boundary constraints
```

## Candidate generation

For each component, generate 3–5 candidate runtime shapes.

Example: Lease Registry

```text
A. Pure module with caller-owned state
B. Single GenServer with map state
C. GenServer + ETS table
D. Persistent event log + projection
E. DynamicSupervisor of per-tenant lease workers
```

## Evaluation axes

| Axis | Question |
|---|---|
| Correctness | Can it satisfy contracts? |
| Simplicity | How many concepts/modules/processes? |
| State ownership | Is ownership obvious? |
| Failure semantics | What happens on crash? |
| Backpressure | Can load be controlled? |
| Observability | Can behavior be inspected? |
| Security | Does authority stay bounded? |
| Future change cost | How many files change for likely evolutions? |
| Team maintainability | Can non-experts maintain it? |
| Implementation cost | How much code/test burden? |

## Score table

```yaml
candidate: single_genserver
scores:
  correctness: 4
  simplicity: 4
  state_ownership: 5
  failure_semantics: 3
  observability: 4
  security: 4
  future_change: 3
  implementation_cost: 4
risks:
  - restart loses in-memory leases unless persistence/snapshot added
accepted: true
rationale: best MVP shape; persistence deferred behind explicit future requirement
```

## Tournament rules

```text
- Pure module must be considered first.
- Process-based architecture must justify process need.
- Multi-process architecture must justify each lifecycle.
- Behaviour/adapter architecture must justify extension seam.
- The winning candidate becomes an ADR.
```

## LM role

LMs are useful for generating alternatives and critiques.

But the human/system owns the scoring policy and accepted choice.

## Output

```text
ADR + runtime shape + ENF budget + implementation plan constraints
```

## Why this matters

This directly addresses the “starting from zero” issue.

The model cannot silently pick Elixir/OTP complexity. It must present alternatives and justify why the chosen runtime shape is worth its cost.
