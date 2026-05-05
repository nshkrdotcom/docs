# Responses to Reviewer Inquiries on `living_substrate_architecture.md`

**Purpose:** Answer the reviewer’s section-by-section inquiries about sections 1-16 of the Living Substrate Architecture, while clarifying scope, budget, graph authority, agents-vs-skills, adversarial validation, context initialization, credentials, code intelligence, and practical granularity.

**Source basis:** `living_substrate_architecture.md`, the Elixir AI Engineer docset, and today’s `agentic_coding/` materials from the uploaded bundle.

## Executive response

The reviewer’s reading is broadly correct: the Living Substrate is meant to frame the project over its lifetime, not just as a one-time code-generation pipeline. The important qualification is that it should not try to model every byte of the system at maximal granularity from day one. It should maintain a living, versioned substrate for the load-bearing architecture facts: boundaries, contracts, effects, capabilities, runtime shape, evidence, lineage, normal-form policy, and accepted exceptions.

The reviewer’s practical concern is also correct: this is complex. The project only works if the complexity is hidden behind a small operating surface and if the generated code is better than naive AI output. The implementation should therefore begin as a narrow, skills-centered harness: audit, bundle, accept, trace, and only then evolve into richer graph/oracle machinery.

The short reconciliation is:

```text
Static architecture remains the stable constitution.
Living substrate maintains runtime truth, evidence, lineage, and exceptions.
Skills remain the main execution units.
Agents, if used, are bounded operators with capability-scoped tasks.
Every moving part must improve ease of use or accepted code quality.
```

## 1. Missing Shift: Is this the entire project frame for the lifetime of the project?

Yes, but not in the sense of “model everything forever at full detail.” The Living Substrate is the long-lived frame for the project’s engineering truth. It is meant to survive individual implementation tasks, milestones, rewrites, and model/tool changes.

The stable lifetime objects are:

- the charter and non-negotiable invariants;
- the domain model and boundary graph;
- the SpecCells and their accepted refinements;
- the implementation graph extracted from code;
- evidence records, counterexamples, and accepted exceptions;
- lineage records showing why artifacts exist;
- rules, detectors, and normalizers born from failures.

What should not be permanent is every transient prompt, candidate patch, or failed local attempt as first-class architecture. Those belong in lineage and evidence storage, not in the main human-facing design surface.

**Doc adjustment:** say explicitly that the substrate is lifetime-scoped for load-bearing engineering facts, not an infinitely detailed archive of all incidental activity.

## 2. Three Nested Feedback Loops: Are inner/middle/outer loops understood correctly?

The reviewer’s interpretation is right with one refinement.

The loops are:

1. **Inner loop - candidate synthesis:** takes a SpecCell/context bundle, generates or fills a bounded implementation candidate, runs fail-fast checks, and repairs local failures.
2. **Middle loop - normalization and evidence:** extracts the ImplementationGraph, compares it to the SpecGraph, runs evidence, applies ENF/cost policy, and compresses bloated code.
3. **Outer loop - harness evolution:** turns failures, counterexamples, normalizer outcomes, and review findings into new rules, tests, specs, operators, cost weights, and context-bundle policies.

The middle loop is not merely “optimize for size.” Size is only one signal. The real goal is **engineering cost minimization under behavioral, architectural, runtime, and evidence constraints**. A smaller implementation that loses an invariant is invalid. A larger implementation may be accepted if the added mechanism buys real lifecycle, failure, security, or performance properties.

### How is the size/cost budget set?

The budget should be set per SpecCell kind and architecture decision, not globally.

Examples:

```text
PureDomainModule: low module/process budget, high purity requirement.
StatefulProcess: higher mechanism budget, requires state/lifecycle proof.
Credential Materializer: higher ceremony allowed due to security boundary.
HotPathOperation: strict resource/cost envelope.
```

A budget includes:

- module count;
- public function count;
- process count;
- behavior/interface count;
- boundary edges;
- external effects;
- runtime complexity;
- test/projection obligations;
- future-change cost.

### What if the solution is not possible within budget?

Then the candidate should not be forced into the budget by hiding complexity. It should escalate to one of three outcomes:

1. **Re-budget:** the SpecCell was under-budgeted and needs an ADR/cost-policy update.
2. **Split:** the SpecCell is too large and should decompose into child cells.
3. **Reject/Redesign:** the approach is over-mechanized and should be structurally simplified.

Budget failure is not a fatal error. It is a design signal.

## 3. Substrate Surface: Is this a single source of truth maintained through change? Event-sourced for projections, lineage, and data mining?

Yes. The graph substrate is the intended operational source of engineering truth, with code, docs, tests, runtime observations, and reports as projections or evidence about that truth.

The cleanest implementation model is event-sourced at the semantic-fact level:

```text
Spec fact asserted.
Code projection extracted.
Evidence run attached.
Invariant violated.
Normalizer applied.
Exception approved.
Runtime observation contradicts cost envelope.
SpecCell refined.
```

From that event stream, the system can materialize:

- current SpecGraph;
- current ImplementationGraph;
- EvidenceGraph coverage;
- RuntimeGraph summaries;
- LineageGraph/judgment traces;
- slop reports;
- architecture capsules;
- training/evaluation datasets.

The important caveat: code still remains an executable artifact and final runtime reality still matters. The graph is the source of *engineering truth*, not a replacement for compiling and running the system.

## 4. Five Living Graphs: Are some LineageGraph concepts general rather than project-specific?

Yes. The reviewer is right that some lineage elements are reusable across projects.

The better split is:

- **Project LineageGraph:** project-specific SpecCells, accepted patches, rejected candidates, exceptions, evidence runs, runtime observations, and local decisions.
- **Harness Doctrine Graph:** reusable skills, rules, detectors, normalizers, failure patterns, operator templates, context-bundle policies, and review rubrics.
- **Human/Org Graph:** owners, approval roles, review authority, policy exceptions, and trust zones.

Examples of general reusable assets:

```text
single-implementation-behaviour detector
unjustified GenServer detector
capability-check mutation template
no raw secret in telemetry rule
repair-shape classifier
context-bundle template
architecture-tournament rubric
```

Examples of project-specific assets:

```text
CredentialFabric.LeaseRegistry SpecCell
SessionPool.checkout semantic type
project-specific AccessGraph edges
accepted exception for a specific GenServer
runtime p95 envelope for a specific operation
```

This split matters because the reusable layer becomes the cross-project improvement dataset.

## 5. Judgment Traces: Does this produce a dataset for improvement?

Yes. Judgment traces are the most valuable output besides accepted code.

A useful judgment trace records:

```text
intent -> context bundle -> candidate -> extracted graph -> violations -> rewrite -> evidence -> accepted/rejected result
```

That is more useful than a normal Git commit because it captures rejected designs, reasons for rejection, normalizer effects, and the final accepted normal form.

Over time this creates datasets for:

- better context bundles;
- better ENF rules;
- better normalizers;
- better architecture tournaments;
- better repair-shape classifiers;
- better tests and mutation templates;
- better model/tool selection.

This is also where a skills-centered workflow can shine: each skill invocation can produce a structured trajectory without requiring a swarm of autonomous agents.

## 6. Not an Agent Swarm: How does this fit a skill-centered setup that bans agents for planning, implementation, and review?

The architecture does not require agent swarms. In fact, it is compatible with banning free-agent planning/implementation/review.

A clearer framing is:

```text
Skills are deterministic or bounded operators.
Agents are optional orchestration wrappers.
The substrate owns authority, state, acceptance, and lineage.
```

In a skills-centered setup:

- `spec.audit` is a skill/operator;
- `spec.bundle` is a skill/operator;
- `spec.accept` is a skill/operator;
- `spec.mutate` is a skill/operator;
- `spec.normalize` is a skill/operator;
- a language model may fill a constrained hole, but it does not own the plan or verdict.

So the doc should avoid sounding like it requires autonomous agents. The better language is “bounded proposal operators,” “skills,” or “operators.”

## 7. Continuous Reverse Extraction: Is the graph the true representation and are changes gated?

Yes, with a practical nuance.

The graph is the canonical representation of load-bearing engineering claims. Code changes are accepted only when their extracted ImplementationGraph is compatible with the SpecGraph, EvidenceGraph obligations, RuntimeGraph expectations, and ENF/cost policy.

However, code is still a reality source. Brownfield or handwritten code may reveal that the graph is incomplete. The drift classifier should distinguish:

- conforming detail;
- spec violation;
- spec omission;
- implementation bloat;
- spec refinement candidate;
- dead behavior.

A graph mismatch does not always mean “reject code.” Sometimes it means “the graph was missing a legitimate fact.” The important thing is that drift cannot silently merge.

## 8. Adversary as First-Class Subsystem: Is adversarial challenge for assumed truths, gaps, and issues?

Yes. The adversary should not merely review code. It should attack assumptions.

It asks:

```text
Can this invariant be bypassed?
Can this capability be forged?
Can this credential leak through logs, telemetry, crash dumps, or sandbox env?
Can this state transition happen out of order?
Can this local repair mutate a global contract?
Can this architecture be implemented with fewer mechanisms?
Can this accepted code become stale under new runtime evidence?
```

The adversary should produce counterexamples, mutations, and test obligations. A good adversarial finding is promoted into a deterministic rule or property test whenever possible.

## 9. Dynamic ENF Policy: How does this coexist with a stable style/pattern guide?

The reviewer is right: stability is itself a key quality. ENF should not constantly drift.

The resolution is to split ENF into layers:

1. **Stable Core ENF:** rarely changes. Examples: no unjustified GenServer; no undeclared effects; public APIs trace to contracts; raw secrets stay out of logs/telemetry.
2. **Project Policy ENF:** changes only through ADRs. Examples: module budgets, process-shape preferences, boundary conventions.
3. **Experimental Rules:** warnings only until proven. Examples: new detector candidates, candidate normalizers, style heuristics.
4. **Exceptions:** explicit, scoped, expiring, and lineage-recorded.

The living system should not mean “moving goalposts.” It should mean “stable doctrine plus evidence-driven exceptions and promotions.”

## 10. Harness Evolution: Will hyperparameter/search over nondeterministic fuzzy evaluation burn too many iterations and tokens?

It will if done naively. The substrate should not perform broad hyperparameter optimization over fuzzy LLM judgments.

Harness evolution should mostly tune deterministic or semi-deterministic objects:

- context-bundle contents;
- operator ordering;
- ENF cost weights;
- threshold policies;
- normalizer selection;
- mutation templates;
- skill routing;
- model choice by task class;
- prompt fragments for bounded fill tasks.

Search should be:

```text
small, cached, off the critical path, replayed on benchmark suites, and judged by deterministic acceptance metrics.
```

The acceptance metrics should be concrete:

- fewer ENF violations;
- smaller accepted implementation graph;
- same evidence passing;
- fewer public APIs;
- fewer unjustified processes;
- lower context residual;
- more mutants killed;
- lower human review defects.

LLM-as-judge can propose hypotheses, but it should not be the verdict engine.

## 11. Resource-Constrained Intelligence: “I’m lost here” and how does this actually fix issues?

This section needs more explanation. The intended meaning is: the system allocates expensive reasoning only where it is needed.

Not every change gets the full architecture tribunal. A small pure-function edit may need format, compile, unit tests, and a local property. A capability-kernel edit may need mutation tests, adversarial review, proof bundle, architecture-owner approval, and runtime observation.

Static analysis and tests do not fix issues. They produce evidence and counterexamples. The repair loop is:

```text
1. Detector/test finds violation.
2. Violation is classified.
3. Context bundle is rebuilt with the failure and allowed repair scope.
4. A bounded implementation operator proposes a patch.
5. The same detector/test must pass.
6. Additional implicated invariants must pass.
7. If a rule was weak, mutation testing proves the strengthened rule catches the bad variant.
```

The LLM may locate and fix, but the resolved claim is not trusted until checked by deterministic evidence. In short:

```text
LLM proposes repair.
Harness verifies repair.
Mutation/adversary tests prevent shallow gaming.
```

## 12. AccessGraph as Common Primitive: What is it really for?

The AccessGraph is the common representation for authority, boundaries, modification rights, credential use, and agent/skill scope.

It should answer:

```text
Who may read this?
Who may modify this?
Who may execute this?
Who may delegate this?
Which capability authorizes this effect?
Which agent/skill may touch this SpecCell or code anchor?
Which connector may redeem this credential lease?
```

This is where the living substrate merges security, governance, and agent scope. A local repair skill may read global architecture but lack modify authority over global contracts.

That distinction is central:

```text
Read broad context.
Modify narrow scope.
Escalate for architecture migration.
```

## 13. Context as Universal Runtime Primitive: Does this mean open, fully declared initialization settings, including hidden attributes and harness/environment settings?

Yes. The reviewer’s desire is exactly right.

The system should make context initialization explicit and reproducible:

- task intent;
- SpecCell;
- inherited charter constraints;
- capability bundle;
- model/operator settings;
- allowed files;
- forbidden actions;
- runtime environment assumptions;
- tool permissions;
- hidden harness defaults;
- evidence gates;
- cost budgets;
- trace IDs;
- trust zone;
- rollback/stop conditions.

Some fields may remain hidden from the model for safety, but they should not be hidden from the harness. Hidden attributes should be declared as harness-controlled context, not undocumented ambient behavior.

This enables easy spin-up of different modes:

```text
local-dev mode
strict CI mode
security-critical mode
greenfield scaffold mode
brownfield audit mode
migration mode
```

## 14. Credentials as Governed Effects: Does a granular credential setup make sense?

Yes. Credential handling should be modeled as a governed effect system, not as a secret lookup helper.

The central object is not the raw secret. It is an auditable, scoped, non-exportable lease:

```text
actor/session/tenant + operation/resource + connector + capability + AccessGraph edge + Π-chain + lease + audit event
```

The agent may hold a reference to a lease. It should not receive raw credential material. Only the trusted connector/materializer should redeem the lease at the final effect boundary.

Granularity matters because it lets the system express:

- wrong connector cannot redeem;
- revoked lease fails;
- expired lease fails;
- missing AccessGraph edge fails;
- missing Π-chain fails;
- provider call without audit fails;
- logs/telemetry/crash output cannot expose secret material.

This is the same pattern as agentic repair scope: capability controls action, not merely file access.

## 15. Projection, Not Cache: How does this relate to code intelligence, visual programming, graphs, and code?

The reviewer’s intuition is right: code and graphs can be two views of the same underlying structure.

The key distinction is authority.

Most code-intelligence systems build a graph from code and treat it as a cache:

```text
code -> graph index
```

The living substrate wants:

```text
semantic graph -> code/tests/docs/runtime projections
code/runtime -> reverse extraction -> graph updates or drift reports
```

Visual programming is a projection of graph structure. Code is also a projection of graph structure. Different code can realize the same semantic graph, and different graph projections can emphasize topology, effects, state, runtime, cost, or capability.

The practical target is not to replace code with visual programming. It is to maintain a graph that can answer architecture questions and constrain code changes.

## 16. Living SpecCells: How granular is this, and are living documents only good if automated?

Yes: living documents are only useful if the living part is automated.

SpecCells should exist at multiple granularities:

```text
project/system
subsystem/domain
component
process/module cluster
operation/public contract
code-change/intervention
```

The right granularity depends on the risk and change surface.

Do not SpecCell every helper function. Do SpecCell load-bearing units:

- public APIs;
- capability boundaries;
- process lifecycles;
- external effects;
- credentialed operations;
- hot paths;
- serialization formats;
- runtime protocols;
- architecture choke points;
- recurring intervention classes.

Automation should keep SpecCells synchronized with code, tests, evidence, and lineage. If humans must manually update everything, the system will fail.

## Reconciliation with the reviewer’s current practice

The reviewer’s existing loop maps cleanly onto the living substrate:

```text
Initial setup with prompt/specs/skills
  -> SpecGraph + ContextBundle + architecture tournament

Failed test -> implement -> passed test
  -> Inner candidate loop

Static analysis + LLM reviews + human checks
  -> Middle evidence/ENF/adversarial loop

Accepted project -> skill feedback
  -> Outer harness evolution loop
```

The main difference is that the living substrate stores and operationalizes the feedback instead of leaving it as informal skill memory.

A skills-centered implementation can keep the workflow familiar:

```bash
mix spec.audit
mix spec.bundle <cell>
mix spec.accept
mix spec.trace
```

Later additions can include:

```bash
mix spec.mutate
mix spec.oracle
mix spec.normalize
```

## Complexity answer

The system is complex internally, so the user-facing surface must be simple.

The MVP should be judged by two criteria:

1. **Ease of use:** Does it make the developer’s workflow simpler, not heavier?
2. **Code output:** Does it reliably produce or accept better Elixir/OTP code than naive AI generation?

If a graph, rule, or loop does not improve one of those, it should not be in the first build.

## Suggested edits to `living_substrate_architecture.md`

Add the following clarifications:

1. The substrate is lifetime-scoped for load-bearing engineering facts, not all incidental activity.
2. ENF has stable core, project policy, experimental, and exception layers.
3. Budgets are per SpecCell/module kind and can trigger re-budget/split/redesign.
4. Skills can be the primary operators; autonomous agents are optional.
5. The AccessGraph governs read/modify/execute/delegate rights across both code and credentials.
6. Context initialization should be explicit, reproducible, and mode-switchable.
7. Harness evolution should be deterministic-metric driven, not open-ended fuzzy HPO.
8. SpecCells should be multigranular and automated.

## Closing answer to the reviewer

You have the structure right. The Living Substrate is the long-term engineering frame, but it should be built as a small, evidence-driven harness first. The stable style/pattern guide remains the constitution. The living substrate adds continuous extraction, evidence, lineage, adversarial counterexamples, and controlled evolution. The goal is not more agent autonomy. The goal is better accepted code with less hidden architecture drift.
