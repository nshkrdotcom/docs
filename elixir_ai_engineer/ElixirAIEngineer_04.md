Yes. That is the clean slogan:

> **Build processes, not prompts.**

But I would sharpen it one level further:

> **Build deterministic processes that use LMs as bounded proposal engines.**

That preserves the Bitter Lesson where it is true — learned systems are powerful and general — but rejects the cargo-cult version where people expect scale alone to replace engineering structure.

## The actual split

Bad agentic engineering:

```text
Prompt → code → vibes review → merge
```

Better agentic engineering:

```text
Spec/constraint → proposal → deterministic checks → counterexample → repair → gate → trace
```

The LM is still essential, but it is not sovereign. It is a **worker inside a process**.

## Where the Bitter Lesson crowd is half-right

They are right that you should not over-handcraft brittle expert systems that try to encode every possible solution path.

But they are wrong if they conclude:

> “Therefore, do not build deterministic process scaffolding.”

That is nonsense. Software engineering is already deterministic scaffolding around human fallibility:

```text
types
tests
linters
formatters
CI
review gates
interfaces
schemas
protocols
supervision trees
contracts
migrations
release checks
```

AI does not remove that. It makes it more important.

## The real lesson for agents

The right formulation is:

```text
Use LMs for:
  ambiguity resolution
  code synthesis
  explanation
  repair proposals
  test generation
  search/navigation
  semantic compression
  pattern extraction

Use deterministic systems for:
  permission
  verification
  execution
  scoring
  regression
  policy enforcement
  protocol state
  merge authority
```

That is the architecture.

## Why this matters especially for Elixir/OTP

Elixir/OTP is not hard because syntax is hard. It is hard because the **runtime architecture has semantics**:

```text
Who owns state?
Who supervises whom?
What restarts?
What is lost?
What is replayed?
What can block?
What can duplicate?
What is synchronous?
What is asynchronous?
What is observable?
```

A prompt cannot reliably enforce that.

A process can.

## The practical doctrine

For an Elixir AI engineer, the doctrine should be:

```text
1. Prompts may suggest.
2. Specs may constrain.
3. Tests must falsify.
4. Static checks must block.
5. Generators must prevent.
6. Traces must explain.
7. CI must decide.
```

Or more bluntly:

```text
The model proposes.
The process disposes.
```

## The innovation is not “more agents”

It is not:

```text
one agent → twelve agents
```

It is:

```text
unstructured generation → governed production system
```

Most so-called multiagent systems today are just roleplay plus parallel prompts. That is not the move.

The move is:

```text
agent roles
+ typed artifacts
+ deterministic gates
+ executable constraints
+ adversarial tests
+ repair loops
+ durable counterexamples
```

That is “process, not prompts.”

## The strongest version

The strongest version is:

> **A future AI software engineer is not an LM. It is a deterministic engineering harness with LMs embedded at the points where semantic judgment, synthesis, and repair are needed.**

That harness becomes more valuable than any single prompt or agent persona.

For your architecture, the north star is:

```text
No claim without evidence.
No patch without tests.
No process without lifecycle semantics.
No rule without enforcement.
No failure without a regression.
No merge without deterministic gates.
```

That is the bridge between old MAS theory, modern coding agents, and actual long-term maintainability.

