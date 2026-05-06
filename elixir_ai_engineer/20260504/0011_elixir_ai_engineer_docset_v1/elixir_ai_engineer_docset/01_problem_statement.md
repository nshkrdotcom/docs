# 01 — Problem Statement: Why AI Fails at Real Elixir Engineering

## The critique to answer

Senior Elixir engineers are not merely saying “the model does not know syntax.” They are saying something stronger:

> AI-generated code can be superficially plausible but architecturally wrong.

The common failure is not that the code fails to compile. It is that it grows the wrong system.

## The Ryan point

When starting from zero, there is no implicit context that prunes the decision space of bad nonfunctional choices. A model may know good choices in the abstract, but it lacks strong evaluated preferences about what to refuse.

That is why greenfield SDK/API/runtime design is hard. The problem is not only implementation. It is **architecture search under weak constraints**.

## The Mario point

If the best spec is the actual program, then gaps in the spec are dangerous. Anything not specified is filled by the model from its training distribution. Much of that distribution is mediocre code.

Therefore:

```text
Spec gaps become architecture drift.
Architecture drift becomes slop.
Slop becomes maintenance burden.
```

## The José point

“AI cannot do engineering” is true if engineering means:

```text
- selecting appropriate tradeoffs
- deleting unnecessary abstractions
- choosing runtime shape
- controlling API surface
- understanding team maintainability
- reasoning about failure domains
- making architecture smaller rather than merely functional
```

The response is not denial. The response is to stop asking the model to do those things implicitly.

## The senior rewrite problem

When a senior engineer rewrites 1,000 LOC of AI code into 250 LOC, they are applying compression rules:

```text
- this process is unnecessary
- this behaviour is fake extensibility
- this API surface is too wide
- this helper layer is ceremony
- this state shape can collapse
- this test is testing implementation, not behavior
- this boundary is invented
```

The platform must learn to ask before merge:

```text
Why is this much code necessary?
Why these modules?
Why this process?
Why this abstraction?
Why this API surface?
Can the same behavior be expressed in one quarter of the code?
```

## The core failure modes

| Failure | Why normal QC misses it |
|---|---|
| Too many modules | Compile/tests pass. |
| Fake behaviours | Static typing does not prove abstraction is needed. |
| Unnecessary GenServers | OTP syntax is valid. |
| Public API bloat | Tests call the new API and pass. |
| Duplicated concepts | Names differ, semantic duplication remains. |
| Wrong state ownership | Runtime may still work in happy path. |
| Poor future change cost | No current test fails. |
| No architectural compression | Nothing asks for a smaller equivalent program. |

## What we need instead

We need a harness that can:

```text
1. Define admissible architecture shapes before code.
2. Extract architecture shape from generated code.
3. Compare extracted shape to the spec.
4. Assign engineering cost.
5. Challenge complexity.
6. Produce or request a smaller equivalent implementation.
7. Preserve behavior through tests and properties.
8. Feed failures back into rules, specs, and normalizers.
```

That is the Elixir AI Engineer.
