Truth: **yes, pieces of this work and already create value; no, the full thing does not exist as a solved product; and yes, if you try to build the whole ontology-first cathedral before proving a narrow slice, it can become useless architecture cosplay.**

The valuable core is real. The dangerous part is scope.

## Why OpenAI/Anthropic have not simply baked this in

They have baked in the generic version: repository context, instructions files, sandboxed execution, tests, patch generation, benchmarks/evals, and agent loops. OpenAI describes Codex as a cloud-based software engineering agent working in isolated sandboxes preloaded with the repository, able to write features, fix bugs, answer codebase questions, and propose PRs. Anthropic describes Claude Code as reading a codebase, making changes, running tests, and delivering committed code. ([OpenAI][1])

But what we’re describing is **not generic harnessing**. It requires **project-specific semantic modeling**:

```text
this module is a capability boundary
this callback is a protocol transition
this operation is hot path
this field is part of a stable ABI
this process owns this lifecycle
this telemetry event calibrates this cost type
this agent has read authority here but no modify authority there
```

A lab cannot automatically bake that in for every repo because the substrate has to learn or be given the architecture of that repo. Existing coding benchmarks like SWE-bench mostly evaluate whether agents can produce patches for real GitHub issues that pass tests; SWE-bench Verified is a human-validated subset of 500 instances, but it is still centered around task resolution, not full semantic architecture enforcement. ([SWE-bench][2])

So the gap is not:

> “Why didn’t they think of tests?”

The gap is:

> “How does the system know which architectural facts are load-bearing in this specific codebase?”

That is exactly the part we are trying to make explicit.

## What already works

These parts are proven useful in ordinary engineering:

```text
property tests
mutation testing
static checks
typed interfaces
capability/access modeling
protocol/state-machine specs
architecture decision records
code ownership boundaries
runtime telemetry
performance regression gates
dependency graph checks
code search / symbol graph / AST extraction
```

None of that is speculative.

The useful synthesis is combining them into one loop:

```text
semantic claim
  → generated check
  → mutation proves check catches bad cases
  → runtime observation calibrates cost claim
  → patch must provide proof bundle
```

That will absolutely catch real failures if scoped correctly.

Example: for the renderer incident, even a modest implementation would have caught the slot-30 failure:

```text
portable bind-group manifest
shader reflection check
backend limit matrix
golden shader ABI
hot-path struct-size / descriptor-count check
mutation: inject group 30
```

That is not sci-fi. That is buildable.

## What probably does not work yet

The grand version:

```text
universal semantic graph
full bidirectional spec↔code traceability
cost-refined denotational type system
type oracle for all valid morphisms
mostly deterministic code generation from structure
```

That is research/product frontier. It may work in narrow domains, but not universally today.

The failure mode is obvious:

```text
the ontology becomes bigger than the code
semantic facts rot
anchors go stale
LLM fills graph with plausible garbage
checks become shallow bureaucracy
everyone spends time maintaining metadata instead of improving software
```

That is the danger.

So the answer is: **this works only if the semantic structure is ruthlessly tied to executable evidence.**

No evidence, no authority.

## The hard truth

The valuable unit is not an ontology entry.

The valuable unit is:

```text
architectural fact
+ source anchor
+ deterministic check
+ known-bad mutation
+ runtime observation if performance-related
```

If you cannot attach those, the fact is probably not worth modeling yet.

For example:

```text
“SessionPool checkout requires capability X”
```

Worth modeling because you can create:

```text
source anchor: checkout/2
check: unauthorized checkout property test
mutation: remove capability check
runtime: denied/allowed telemetry
```

But:

```text
“System should be elegant”
```

Not worth modeling directly. Decompose it into concrete predicates first.

## What I would actually build

Do **not** start with the universal graph.

Start with one vertical slice where the payoff is immediate.

For Elixir/OTP:

```text
CapabilityCheckedOperation
BoundaryProcess
SessionProtocol
HotPathOperation
```

Pick one subsystem:

```text
SessionPool.checkout/checkin
```

Build only this loop:

```text
semantic YAML/DSL
→ generated ExUnit + StreamData tests
→ generated Credo checks
→ generated telemetry assertions
→ generated Benchee benchmark
→ mutation runner removes/breaks invariants
→ proof bundle
→ patch verdict
```

If that catches real bugs and makes agent output safer, continue.

If it becomes paperwork, kill it.

## Why this is still worth doing

Because current agents are good at producing plausible patches that pass shallow tests. The failure cases are increasingly architectural:

```text
wrong abstraction
wrong boundary
wrong ownership
wrong cost profile
wrong portability assumption
wrong lifecycle
wrong capability model
```

Generic coding agents will not reliably infer those from vibes. Anthropic’s own context-engineering writing emphasizes just-in-time context loading with lightweight identifiers rather than full up-front preprocessing, which is useful but still not the same as project-specific executable architecture. ([Anthropic][3])

Your idea creates the missing middle layer:

```text
architecture as executable, queryable, mutation-tested structure
```

That is valuable.

## The correct confidence level

I would state it this way:

| Claim                                                                     |                                    Confidence |
| ------------------------------------------------------------------------- | --------------------------------------------: |
| Generated invariant tests from semantic specs create value                |                                          High |
| Capability-scoped agents reduce bad edits                                 |                                          High |
| Mutation testing validates invariant coverage                             |                                          High |
| Runtime observations should calibrate cost envelopes                      |                                          High |
| Universal ontology helps organize the system                              |                                        Medium |
| Full semantic graph can stay accurate automatically                       |                                    Medium-low |
| Deterministic codegen from semantic structure replaces LLM coding broadly |        Low today, plausible in narrow domains |
| This becomes a general software substrate                                 | Possible, but only after multiple narrow wins |

## The real MVP test

The MVP succeeds only if it can prove this:

> Given a known class of AI-bad patches, the semantic harness rejects them before review while still allowing good local fixes.

For OTP, test it with mutants like:

```text
remove capability check
perform forbidden effect
spawn unsupervised process
skip telemetry event
break protocol ordering
allow unbounded mailbox growth
modify global capability rules from local agent
```

If the system catches those and still lets valid patches through, it works.

That is the truth.

This is not crap. It is also not magic. It is a disciplined way to convert architecture from prose into executable constraints. The buildable version is narrow, evidence-driven, and mutation-tested. The cathedral version is dangerous until the narrow version proves itself.

[1]: https://openai.com/index/introducing-codex/?utm_source=chatgpt.com "Introducing Codex"
[2]: https://www.swebench.com/verified.html?utm_source=chatgpt.com "SWE-bench Verified"
[3]: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents?utm_source=chatgpt.com "Effective context engineering for AI agents"
