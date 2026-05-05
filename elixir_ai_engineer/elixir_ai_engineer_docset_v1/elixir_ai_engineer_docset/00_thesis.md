# 00 — Thesis: The AI Engineer Is a Spec Compiler, Not a Chatbot

## The claim

Current AI coding systems optimize for producing plausible code. The missing capability is deciding whether the code **deserves to exist**.

The proposed Elixir AI Engineer is therefore not a single agent. It is a **spec-governed synthesis harness**:

```text
Human intent
  → structured specification
  → admissible architecture set
  → deterministic skeleton
  → bounded LM synthesis
  → implementation graph extraction
  → engineering-normal-form audit
  → compression and simplification
  → evidence gates
  → accepted code
```

The LM is useful. It is not sovereign.

## Why this matters for Elixir/OTP

Elixir code can look correct while encoding the wrong architecture:

```text
- GenServer syntax is correct, but the process should not exist.
- Tests pass, but test shape mirrors implementation bloat.
- Supervisors compile, but lifecycle semantics are fake.
- A behaviour exists, but only one implementation exists.
- Public functions work, but API surface is far too large.
- The implementation has 1,000 LOC where 250 LOC would express the real mechanism.
```

This is not a formatter, linter, or test failure. It is an **architectural compression failure**.

The system in this docset treats AI output as an **untrusted candidate** in a constrained search over admissible implementations.

## The actual product

The product is not:

```text
an agent that writes Elixir
```

The product is:

```text
a compiler-like engineering process that accepts, rejects, normalizes,
and learns from AI-generated Elixir/OTP implementations.
```

## The core equations

There is no perfect bijection from specification to ideal code. The tractable formulation is:

```text
Spec S defines admissible implementations Γ(S).
Code C is valid if extracted_model(C) satisfies S.
Accepted code is the lowest-cost candidate found under Engineering Normal Form.
```

Informally:

```text
C* = argmin Cost(C)
     subject to:
       C ∈ Γ(S)
       Extract(C) satisfies Spec
       Evidence(C) passes
       ENF(C) passes
```

This replaces the fantasy of “AI deterministically emits ideal code” with:

```text
AI proposes candidates.
The harness extracts, tests, rejects, simplifies, and accepts.
```

## The central innovation

The missing layer is **Engineering Normal Form**.

Engineering Normal Form, or ENF, is a declared policy that says what implementation shapes are acceptable for a given class of component.

Examples:

```text
- A process must justify state ownership, lifecycle, concurrency, or external resource management.
- A behaviour must have multiple implementations or be declared as a boundary seam.
- A public function must trace to a contract or API facade.
- An external effect must trace to an effect declaration.
- A module must trace to a spec cell or generated support role.
```

ENF is how you convert senior Elixir taste into a substrate.

Not perfectly. But enough to stop the worst AI failure modes.

## The design slogan

```text
Build processes, not prompts.
Build compilers, not chat loops.
Build normal forms, not vibes.
```
