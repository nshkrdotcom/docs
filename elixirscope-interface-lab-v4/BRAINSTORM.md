# ElixirScope codebase comprehension brainstorm

**Status:** design recommendation for discussion, not an implementation specification.

**Scope:** a standalone Elixir codebase comprehension environment; the information model comes before the interface.

**Central question:** what would let an engineer understand an unfamiliar system well enough to predict its behavior, challenge its machinery, and make a defensible change?

## 1 My recommendation

I would build ElixirScope around **inspectable explanations of behavior**. The engineer should be able to follow a question from a product obligation through the decisions, state owners, protocols, source expressions, and evidence that determine the answer.

The most useful object is a bounded account of a mechanism: given this input, under these assumptions, these parts make these decisions and perform these effects; these conditions cause different outcomes. Every consequential statement in that account should open its supporting code or evidence. When an account is incomplete, the missing information should remain part of the account.

The tool should help me answer three things:

1. **What happens, and why?** Explain a successful operation and its important alternatives.
2. **Why is it built this way?** Identify the runtime or behavioral obligation each boundary serves.
3. **What can change without losing a guarantee?** Compare candidate mechanisms under explicit requirements and assumptions.

These questions are related, but they require different analyses. A call graph alone answers none of them adequately. A natural-language summary can answer them convincingly and incorrectly. A recording answers what happened in a particular execution, but cannot explain every possible execution.

I would use source analysis, authored intent, recordings, tests, and reviewable inference together, preserving the distinction between them. The interface should make it easy to move among those accounts without making their truth conditions look interchangeable.

The immediate product test is simple: after using ElixirScope, can an engineer predict an important behavior they have not just been shown, and point to why their prediction is justified? If they only remember module names and a pretty diagram, the tool has not delivered comprehension.

## 2 Where the earlier concepts fell short

V1 and V2 organized too much of the experience around familiar source and debugger surfaces. They improved correlation between those surfaces, but correlation is not itself an explanation of the system. Stepping through a recording can still leave the user unable to explain why the application needs a coordinator, what gives it authority, or which information must survive a restart.

V3 introduces the right tension: a promise versus the machinery chosen to realize it. Its process cross-section also provides a better starting point for OTP comprehension. But its spatial layering is an illustration, not yet a demonstrated solution. A slanted plane does not make state ownership clearer unless the interaction exposes actual ownership, readers, writers, and failure consequences.

The original Atlas material already contains much of this direction. The important advance now should be a precise account of what the tool knows, what an engineer can ask it, and what makes an answer trustworthy. Another arrangement of panels is too early.

I would keep the standalone environment, fast source navigation, bounded views, process anatomy, explicit intent, and preserved context. I would challenge any representation that earns its screen space only by looking like software architecture.

## 3 How I would investigate an unfamiliar codebase

I would not initially ask for all files or all actors. I would pick one externally meaningful operation and reconstruct its mechanism.

For a command service, I would start at the public entrypoint and follow a command to its observable result. For a compiler library, I would follow an input through transformation and diagnostics. For a streaming service, I would follow an item through demand, buffering, processing, and acknowledgement. The tool must adapt to the kind of system rather than invent a process model for every repository.

My first investigation would establish:

- What enters the system, and what outcome the caller expects.
- Which decisions determine the outcome and where those decisions are implemented.
- Which values influence those decisions, who can change them, and where authoritative versions live.
- Which steps happen within one process, and which cross a message, transaction, node, or external-effect boundary.
- What the caller waits for; what the system has actually promised when it replies.
- Which information survives failures, and how processing resumes.
- Which tests, recorded examples, specifications, or design decisions support this account.

Then I would look for a second operation that shares the same machinery. That reveals whether a component is a reusable abstraction, a shared authority, an accidental bottleneck, or merely a wrapper with an impressive name.

Finally, I would perturb the account with questions: what if this message is delayed, this callback raises, the store is unavailable, this process restarts, or the external system acts but its reply is lost? I do not need a complete simulator to ask these questions. I need the relevant source branches, protocol assumptions, and missing evidence to become visible.

This sequence suggests the first navigation unit: **an operation and its consequential decisions**, rather than a file, process, or timeline tick.

## 4 What comprehension means in data

A useful comprehension environment needs several distinct models joined through identities and evidence. It does not need one universal hierarchy of software meaning.

| Model | What it represents | What it cannot establish alone |
| --- | --- | --- |
| Source structure | Definitions, clauses, call sites, value dependencies, behaviours, configurations, revisions | Product intent or actual execution |
| Mechanism explanation | A bounded account of triggers, decisions, ownership, effects, alternatives, and assumptions | That the explanation is complete or correct |
| Runtime structure | Process roles and incarnations, mailboxes, supervision, links, monitors, nodes, shared resources | Historical values or complete message delivery |
| Recorded behavior | Observations, invocations, correlated transfers, sampled state, outcomes, coverage | Unrecorded behavior or universal correctness |
| Obligations | Requirements, architectural constraints, safety properties, workload expectations | That implementation fulfills them |
| Verification evidence | Tests, checks, counterexamples, reviewed arguments, model results | More than the stated scope and assumptions |

The join is the valuable part. A requirement must lead to the relevant decision sites, not merely to an associated module. A state observation must identify its owner and incarnation. A message relation must distinguish a possible source-level route from an observed transfer. A dependency summary must identify which version and assumptions it describes.

I would make those joins queryable before choosing a rendering library.

### 4.1 Source identity

A source anchor needs a repository snapshot, file identity, symbol or clause identity, and exact span. The same function name across two revisions is not sufficient identity. Macro expansion, generated code, and dynamic dispatch can produce unresolved or multiple candidate targets.

For Elixir specifically, clause-level selection matters. `handle_info/2` is often too broad an anchor: the important question may concern only the clause matching `{:DOWN, ref, :process, pid, reason}`. The call site and the matched branch matter more than a module-level label.

### 4.2 State identity

A state item needs more than a field name. It needs an owner, a lifetime, a scope, and an authority relationship.

For example, `worker.status`, a database row's `status`, a cache entry's `status`, and the physical device's state are four different objects. They may represent related information, but they need not agree. The tool must distinguish an authoritative record, a derived view, a cached copy, and external truth.

For each item, I want candidate readers and writers, the synchronization mechanism, failure survival, and any evidence of consistency. Some ownership can be extracted structurally; authority usually requires a declared rule or a reviewed inference.

### 4.3 Boundary identity

A boundary is where the reasoning changes: local function call, queued message, transaction, process lifetime, node lifetime, external operation, or dependency contract.

Crossing a boundary can change ordering, failure propagation, cancellation, atomicity, latency, trust, or durability. Those consequences should be attached to the boundary instead of left for the user to reconstruct from scattered code.

A supervisor relation and a message relation are different relations. A database transaction and a supervised worker are different containment mechanisms. Treating them as generic edges throws away the information an engineer needs.

### 4.4 Evidence identity

An evidence record should carry its source, revision or build, derivation, scope, assumptions, limitations, and relevant coverage. A recorded event also needs a capture session and the appropriate process and node incarnation identities.

There should be no single confidence percentage that makes a compiler-resolved call, an AI interpretation, a passing test, and a missing recording look commensurable.

## 5 The primary object should be a mechanism explanation

I would use a small, inspectable record rather than invent a new general-purpose specification language.

```yaml
question: What prevents an uncertain device command from being repeated?
operation: issue_device_command
scope: one command ID across worker restart
obligations:
  - reconcile_uncertain_outcome_before_retry
assumptions:
  - command IDs remain stable across attempts
  - device readback can distinguish the relevant outcomes
steps:
  - accept_and_persist_intent
  - attempt_external_effect
  - classify_available_outcome_evidence
  - choose_stop_reconcile_or_retry
owners:
  - durable_command_record
  - transient_worker_state
  - external_device_state
boundaries:
  - journal_transaction
  - worker_lifetime
  - device_request
alternatives:
  - confirmed_completion
  - confirmed_no_effect
  - unresolved_outcome
source_anchors: [revision-qualified references]
evidence: [test and recording references]
open_questions:
  - Is the readback sufficiently authoritative for this command type?
```

This is an explanation template, not an executable proof. Relationships inside it can be extracted, supplied, or proposed; their origins must remain inspectable.

A mechanism need not be a folder or a recursively nested architectural component. Authorization might span a controller and a pure policy function. Recovery might span an OTP callback, a durable record, an external protocol, and a test. One source expression can participate in several mechanisms.

Two legitimate explanations can emphasize different structures. An operational account might organize around failure domains; a feature account around responsibilities. The tool should preserve their correspondence without forcing one to become the canonical decomposition.

The explanation should also be falsifiable. “This component handles recovery” is weak. “This branch prevents dispatch when the persisted outcome is unknown” names a claim that source, tests, or an observed execution can challenge.

## 6 Decisions are more useful navigation targets than files

A decision point chooses among meaningfully different outcomes. Examples include a guard rejecting an action, a pattern match selecting a recovery branch, a transaction deciding whether an ID already exists, or a timeout policy choosing a retry.

For a selected decision, I want:

- The input values and assumptions that determine the branch.
- Their origins and current owners.
- The possible outcomes and subsequent effects.
- Relevant source clauses and callers.
- The obligations that make the distinction important.
- Evidence exercising each outcome, with missing cases explicit.

This becomes a useful representation even without runtime capture. Add a recording and the tool can show which supported branch was taken for one invocation. Add an authored property and it can show why another branch would be prohibited.

A long call chain often contains only a few consequential decisions. The default explanation should fold pass-through code while leaving its costs and boundary crossings visible. A one-line wrapper containing `GenServer.call` cannot disappear as if it were a local identity function: the message and waiting semantics remain consequential.

This is how I would reduce a large codebase without pretending every omitted function is irrelevant.

## 7 The queries I would want available

The product should be shaped around questions whose answers have bounded, inspectable structure.

| Query | Useful answer | Important qualification |
| --- | --- | --- |
| Explain operation | Entrypoint, decisions, owners, effects, alternatives, source working set | Analysis scope and unresolved dispatch |
| Explain decision | Branch conditions, value origins, outcomes, supporting cases | Static possibilities versus observed branch |
| Explain state | Owners, authority, writers, readers, copies, lifetime, synchronization | Candidate ownership versus established authority |
| Explain process | Runtime reason, protocol, state, concurrency, failure behavior | Module organization is not a runtime reason |
| Explain boundary | What ordering, durability, isolation, or trust changes here | Dependency and protocol assumptions |
| Explain guarantee | Requirement, necessary conditions, enforcing decisions, tests, disagreements | A mapping is not satisfaction |
| Explain failure | Lost information, surviving owners, recovery path, external ambiguity | Prediction versus recorded witness |
| Explain change | Affected decisions, obligations, consumers, and evidence | Static impact is not proof of regression |
| Compare realization | Same obligations, different owners and boundaries, changed assumptions | Behavioral equivalence remains a separate claim |

These answers should be structured data that both a person and an agent can inspect. The visual interface can choose appropriate projections; it should not be the only place the meaning exists.

For example, an `explain_process` response might say that a validation server owns no domain state in the indexed source, has one synchronous request class, calls a pure-looking validator, and has no authored concurrency or failure-isolation rationale. It should then show the exact callback and unresolved effects. That is enough to pose a simplification question. It is not enough to declare the process unnecessary in every deployment.

## 8 The Elixir model needs protocols and ownership

A GenServer is not just a rounded box with arrows. To understand it I need its interaction protocol and the distinction between process machinery and callback code.

The local model should identify startup arguments, registration, request classes, matching callbacks, reply behavior, state changes, scheduled work, monitored processes, and outbound effects. It should distinguish possible source routes from recorded invocations. Process boundaries serve runtime concerns such as state, concurrency, and failure; Elixir's own guidance warns against using GenServers only to organize code. [GenServer documentation](https://hexdocs.pm/elixir/GenServer.html#module-when-not-to-use-a-genserver)

I would organize a selected actor around a **protocol turn**:

```text
sender / request
    → delivery evidence or possible delivery route
    → matching callback clause
    → decisions + outgoing operations
    → next local state + reply / continuation
```

This turn is nested inside a lifetime, and the lifetime inside a supervision context. Different turns can relate through a command ID or state property. That gives the user a meaningful way to move through behavior without assuming wall-clock order explains causality.

When the actor restarts, the model must show a new incarnation and the initialization sources it consults. A supervisor strategy describes restart relationships; persistent recovery is application behavior implemented elsewhere. [Supervisor documentation](https://hexdocs.pm/elixir/Supervisor.html)

The same approach should account for Tasks, Agents, ETS, Registry, process dictionaries, pools, and external resources where relevant. They should not all be rendered as interchangeable actors. An ETS table is a shared resource with an ownership lifecycle; an Agent is state behind a process; a Task represents work with a lifetime; a pool introduces allocation and queueing concerns.

For distribution, I would separate three questions: which node can execute this role, which node currently has a particular process incarnation, and what grants authority to perform the operation. Location, registration, and authority are not synonyms.

A lease or epoch field is only part of an authority mechanism. The receiving resource must enforce the relevant token or protocol rule for it to constrain stale owners. That connection is often precisely what an AI-generated implementation leaves incomplete.

## 9 The complexity review I would actually use

The 1,000-line versus 150-line example matters because generated code often introduces machinery faster than it establishes a reason for that machinery. But shorter code can also omit required behavior or outsource the same complexity to a dependency.

I would separate complexity into three questions:

| Kind | Review question | Example |
| --- | --- | --- |
| Required by the problem | Which behavior forces us to account for this? | Uncertain external outcomes must remain distinguishable |
| Introduced by the chosen realization | What extra state or coordination does this design create? | A second retry coordinator with its own attempt cache |
| Delegated across an abstraction | What complexity still exists outside the visible application code? | SQL transactions, connection pools, or a device deduplication protocol |

The tool cannot compute an authoritative minimum complexity for arbitrary requirements. It can show concrete expansion and ask for justification.

I would want a **machinery ledger**, scoped to an operation or obligation. Each entry would record the state owner, queue, retry policy, wrapper, persistence boundary, or authority mechanism; its claimed purpose; the code that realizes it; and the consequences of changing it. Missing justification should be a useful review state, not a red quality score.

The most revealing patterns would include duplicated authority, mirrored state with unclear synchronization, multiple retry owners, synchronous hops around pure transformations, wrapper chains that conceal effects, and dependencies that unexpectedly own work or data.

These are leads. A cache may be justified by a measured workload. A separate process may isolate blocking work. Two retry policies may operate at intentionally different layers. The tool should help distinguish that rationale from accidental duplication.

### 9.1 A concrete comparison

Consider two implementations of command authorization, persistence, device execution, and recovery.

| Concern | Larger realization | Smaller candidate | What must be established |
| --- | --- | --- | --- |
| Validation | Dedicated validation GenServer | Local decision function | Same validation behavior; changed failure and queueing semantics acceptable |
| Admission | Coordinator plus dispatcher | One admission owner | Required concurrency, ordering, and responsiveness retained |
| Command progress | Database plus several local mirrors | Durable journal plus explicit transient work state | Required latency and read consistency retained |
| Recovery | Worker policy plus retry broker | One decision function driven by durable state | All relevant failure cases and timer semantics accounted for |
| Effects | Wrapper chain into HTTP adapter | Direct, explicit effect adapter | Timeouts, cancellation, idempotency, and error handling preserved |
| Dependencies | Database and transport libraries | Same dependencies | Complexity has not merely moved out of sight |

For the validation change, I would explicitly inspect who now experiences a raised exception, whether an existing caller relied on isolation, and whether removing serialization changes behavior under load. Successful return values are only one part of the contract.

For admission, one GenServer might be an appropriate authority boundary, but running slow external work inside its callback could turn a short implementation into a bottleneck. A smaller realization might use supervised tasks while preserving serialized admission. At higher scale, authority might need to be partitioned by device or tenant. Those choices follow workload and ordering obligations, not a preference for fewer processes.

The tool should compare a realization delta: owners removed or merged, boundaries removed or added, effects relocated, assumptions changed, requirements still supported, and requirements now uncertain. Tests and recorded witnesses should be attached to those deltas.

The desired result is an argument for a simpler mechanism with its remaining obligations visible. It is not a claim that any particular 150-line sketch replaces a complete 1,000-line implementation.

### 9.2 Necessary information is a stronger test than component count

There is a more rigorous way to challenge machinery: ask which situations the requirement forces the system to distinguish.

Consider two histories. In the first, a request is lost before the device applies it. In the second, the device applies the request, but its reply is lost. The caller sees the same timeout in both histories. If repeating the operation is harmful, the allowed next actions differ even though the available local evidence does not.

No amount of extra coordinator code makes that local observation sufficient. A retry counter, another mailbox, or a longer delay does not tell us which history occurred. The mechanism needs an additional source of discrimination, a protocol that makes repetition safe, or a policy that retains uncertainty and defers the action.

This gives the tool a useful line of reasoning:

```text
Required behavior distinguishes two situations
    → identify the information that distinguishes them
    → identify its authoritative source and required lifetime
    → locate the decisions that consume it
    → inspect whether the implementation can preserve that distinction
```

A stable idempotency key with an enforced external contract may change which histories require different actions. A trustworthy receipt may resolve an outcome. A restart can erase a distinction if its only representation was process-local. A stale cache can appear to resolve it while remaining insufficient evidence.

This does not produce a general automatic proof. It produces a precise review question: what information makes this decision legitimate, where does it come from, and can it still be available when the decision is made?

That is how I would investigate the 1,000-line implementation. Machinery that neither preserves a required distinction nor serves a measured runtime boundary is a simplification candidate. The 150-line implementation must still preserve the necessary distinctions, or it has shortened the problem instead of solving it.

The interface could make this tangible by placing two scenario histories beside the same decision site and showing which input differs—or showing that none of the captured or statically identified inputs distinguishes them. “No distinguishing input identified in this scope” is more useful than “architecture too complex.”

## 10 A worked comprehension investigation

Suppose the requirement is that a command with an uncertain external outcome must not be blindly retried.

I select that requirement. ElixirScope should expose the necessary distinctions: accepted intent, attempted effect, observed outcome, and permission for another attempt. These are conceptual states, not automatically a recovered state machine of the whole application.

Next, it maps those distinctions to implementation: a durable command row, transient worker state, the device adapter, and the recovery decision. A mapping should show its basis: source reference, authored declaration, or reviewed inference.

I open the recovery decision. The relevant clause dispatches again when the journal status is `unknown`. That is a concrete disagreement between the requirement and the selected source behavior, assuming this is the reachable recovery path for the operation under review.

A recorded scenario can support reachability: write attempted, timeout recorded, journal marked unknown, process killed, new worker initialized, dispatch selected again. The view should distinguish the observed decision from an inferred or subsequently observed second write. It must not claim that two physical effects committed without corresponding evidence.

Now I ask what would make retry safe. The answer could be an external idempotency contract, a sufficiently authoritative readback, or a protocol that establishes no prior effect. Simply adding a longer delay does not resolve uncertainty. A device's current state may also be insufficient evidence about whether a particular earlier command occurred.

Finally, I inspect the implementation's machinery. If retry count exists in the worker, broker, and transport policy, I want to know which owner decides safety and which merely schedules another attempt. If nobody owns the safety decision, the architecture has a missing responsibility even though it contains many recovery modules.

This investigation teaches the mechanism, exposes an implementation disagreement, and identifies what evidence or design change would close the gap. A timeline is one witness inside it, not the organizing principle of the entire product.

## 11 What the interface should eventually look like

I would make the visual center a **bounded mechanism view**, with context that persists across changes in representation. The user should always be able to see the current question, scope, assumptions, and the path back to their starting point.

At repository scale, the opening view should show a small set of externally meaningful operations, candidate responsibilities, shared authorities and effect boundaries, and unresolved areas. Where intent is unavailable, the tool should start from observable entrypoints and proposed explanations instead of inventing approved business requirements.

At mechanism scale, the view should organize around decisions and boundary crossings. I want to see where information becomes authoritative, where local work becomes a queued protocol, and where the system performs an irreversible operation.

At actor scale, the protocol turn and state ownership should dominate. At expression scale, the relevant source and alternative branches should dominate. A switch in scale should reveal what a previous summary hid, while retaining the original obligation and scope.

I would use a small family of representations:

- **Responsibility and realization map:** obligations alongside candidate implementation correspondences and unmapped machinery.
- **Operation route:** consequential decisions and boundary crossings, with alternative outcomes and folded pass-through code.
- **Ownership view:** authoritative state, copies, readers, writers, lifetimes, and synchronization paths.
- **Protocol anatomy:** request, matched callback, state transition, reply, effects, and process lifetime.
- **Failure view:** what is lost, what survives, recovery obligations, and supporting recorded scenarios.
- **Source working set:** several relevant clauses and expressions with direct links back to the mechanism.

These are different models, not tabs displaying the same graph with different colors. The tool should choose a useful default, while making a viewpoint change explicit.

### 11.1 Spatial depth has a job to earn

I would not commit to literal 3D yet. I would commit to revealing containment and hidden detail in a reversible way.

A collapsed region should retain its inputs, outputs, owner count, important boundaries, unresolved relations, and exceptional paths. Opening it should reveal the concrete entities that produced that summary. Crossing a library boundary should open the relevant dependency contract and resource envelope, not just enlarge a library icon.

If depth separates ownership lifetimes or lets a person hold an abstraction and its realization together without losing orientation, it may be valuable. If it adds occlusion, camera work, or decorative altitude, it will make the tool harder to use. A software system has multiple overlapping structures; no one geometric embedding can make them all true at once.

I would keep stable landmarks, semantic zoom, and a visible account of what each collapsed abstraction hides. A hierarchy is a navigation projection, not a declaration that the system is fundamentally a tree.

### 11.2 Source should remain part of the explanation

A source fragment should arrive with a reason for being visible: it selects this outcome, reads this authoritative value, crosses this boundary, or tests this obligation.

Several distant fragments should be visible together when they contribute to one question. Expanding a fragment to its file should preserve that context. Selecting a line should let the user move back toward the decisions, owners, and obligations it participates in.

Fast navigation through dozens of source files remains useful. But the default traversal should follow the investigation's relevant working set, not alphabetical file order. A raw file scan remains available for orientation and exploration.

Pins should preserve a claim, decision, or source anchor while another view follows navigation. The user should be able to compare explanations or branches without having their reference silently replaced.

### 11.3 Scrubbing should select semantic cases

I would support several explicit kinds of scrubbing: recorded protocol turns, observed value changes for one owner, causal steps in a scenario, related source decisions, and realization changes between revisions.

Those are different sequences. A global slider that silently mixes them would be misleading.

The useful question is often “show the next consequential change in this account,” rather than “advance ten milliseconds.” Physical time becomes dominant when duration or queueing is the question; it should not dominate every comprehension task.

## 12 How I would use AI

AI is useful for proposing responsibilities, assembling candidate explanations, locating relevant code, naming missing assumptions, and suggesting simplifications. It can bridge human vocabulary and implementation details in a way lexical search cannot.

I would require an explanation proposal to identify its anchors, distinguish extracted facts from interpretation, list alternatives, and say which observation or test would challenge the claim. The product should make acceptance, correction, and disagreement easy.

A claim such as “this GenServer is unnecessary” should become something inspectable: no domain state found in the analyzed scope; one request class; a candidate local replacement; changed failure behavior; an unresolved workload assumption. That is a useful assistant output. An authoritative adjective is not.

AI-generated decomposition should also leave some implementation unmapped. A model that assigns every file to a clean responsibility can conceal accidental machinery and produce a false sense of completeness.

Human acceptance of a proposed responsibility establishes an interpretation or requirement mapping. It does not establish behavioral satisfaction. That distinction should survive storage, export, and later reanalysis.

For an agent consuming the tool, I would expose structured query results and source anchors as well as rendered views. I would want to ask for the decision slice governing a property, inspect the coverage, propose a change, and attach validation evidence to the affected claims. Images alone are a poor interface for that work.

## 13 How the data should be organized

I would keep immutable source snapshots and recording artifacts separate from editable explanations and obligations. A narrow identity and provenance layer connects them.

The essential object families would be source anchors, typed source relations, resource and owner descriptions, protocol descriptions, obligation records, evidence records, and saved mechanism explanations. Derived views would be cached by their input snapshots and query parameters.

An explanation should record why an entity was included: direct call path, value dependence, ownership relation, explicit obligation mapping, observed causal relation, or reviewer selection. This makes relevance inspectable and prevents a plausible neighborhood from masquerading as a calculated slice.

Updates should invalidate dependent claims when their anchors or assumptions change. A claim tied to a previous revision can remain useful historical evidence, but must not silently become a claim about the current source.

Large repositories require global indexes and local answers. The frontend should receive a bounded neighborhood with omitted counts and expansion choices. Collapsing a view must retain consequential boundaries and uncertainty; aggregation should not erase multiple state owners, possible cycles, or an exceptional effect route.

For source analysis, existing compiler information and analysis tools should supply facts where they can. `mix xref` provides useful dependency and call information, with documented limits; it does not establish behavioral intent or replace the mechanism model. [Mix xref documentation](https://hexdocs.pm/mix/Mix.Tasks.Xref.html)

The backend should report partial results when an analysis cannot resolve a call or prove sufficient coverage. A cheap incomplete answer with clear limits is more useful than an expensive diagram that appears complete.

## 14 The next prototype should test comprehension

I would postpone another polished whole-product mockup. I would first create one versioned data bundle with two alternative realizations of the same small service, explicit obligations, a success scenario, and a failure scenario.

Unlike the V3 comparison, both realizations in this next experiment should be runnable enough to exercise the stated obligations. They need not be production applications. Any intentionally unsupported requirement should be declared before comparison.

The bundle should contain:

- A meaningful source corpus, including incidental infrastructure and at least one shared dependency.
- A few requirements with independently specified expected outcomes.
- Source mappings with declared origins and some deliberate ambiguity.
- State owners, authority claims, copies, and synchronization mechanisms.
- Decisions and protocol boundaries relevant to the selected operations.
- Tests and recordings that exercise the comparison, including one counterexample.
- A candidate simplification and a record of which guarantees still need evidence.

Before choosing a layout, I would inspect structured answers to five questions: explain the operation, explain the authoritative state, explain a process boundary, explain the failure, and compare the realizations.

Then I would prototype one navigation path: operation → decision → state owner → failure consequence → source. The user should be able to enter that path from a requirement, an observed event, or a source clause.

This is a proposed next experiment, not authorization to build the engine or another interface in this V4 directory.

## 15 How we would know it is helping

Evaluation should test understanding of a withheld case, not whether someone can repeat the story the tool just displayed.

| Task | What we would measure |
| --- | --- |
| Predict a new input's outcome | Correct prediction, identified branch, and cited assumptions |
| Explain what survives a crash | Correct owners and lifetimes, with uncertainty preserved |
| Find the implementation of a guarantee | Correct decision and enforcement sites, not just related modules |
| Challenge a process boundary | Concrete runtime rationale or missing justification |
| Evaluate a simpler realization | Preserved and changed obligations, including dependency costs |
| Plan a change | Relevant impact, validation targets, and unknown consumers |

We should compare against an engineer's ordinary code-search and navigation workflow. Use unfamiliar codebases and counterbalance task order so seeing an answer once does not advantage the next tool.

I would record time to a correct explanation, unsupported assertions, relevant source reached, orientation loss, and the quality of the engineer's change proposal. Navigation count is useful, but fewer clicks are not success if the explanation becomes less accurate.

Two adversarial cases matter: a short implementation that silently omits a requirement, and a larger implementation whose extra process has a real concurrency or isolation purpose. If ElixirScope always prefers the small implementation, it is an aesthetic judge rather than a comprehension tool.

A third case should contain incomplete or misleading intent. The user should be able to correct the explanation without rewriting the source into a fictional architecture.

## 16 Decisions I would make now

I would make operation explanations, consequential decisions, ownership, boundary semantics, and evidence the foundation. I would give the standalone interface permission to look unlike a conventional editor, while requiring each representation to explain a specific relationship.

I would retain the fast source corpus and exploration controls from the prototypes. I would demote the universal timeline, replace file-first traversal with relevant working sets, and avoid a fixed number of permanent panels.

I would make responsibility mappings many-to-many and reviewable. I would make unassigned machinery and missing rationale visible. I would compare realizations under explicit obligations and workloads, exposing complexity delegated to dependencies.

I would defer a universal ontology, a general simulation engine, an automatic elegance score, a custom specification language, exhaustive runtime capture, and a mandatory 3D renderer. Their cost is not justified by the current product question.

The tool I would personally want to use is one where I can say: **show me the decisions that make this behavior happen, the state and boundaries those decisions depend on, and what I would have to preserve if I changed the mechanism.**

That is a concrete foundation for codebase comprehension. The interface can then be designed around making that account easy to inspect, navigate, challenge, and compare.

## 17 Design grounding

The original Atlas notes provide the mechanism-to-code ambition, explicit distinction between declared and inferred intent, reversible abstraction, and adaptive focus canvas. The blueprint preserves revision-aware source anchors, evidence classes, partial runtime observations, and multiple projections. This brainstorm shifts the center toward predictive understanding, decision sites, protocol boundaries, and review of alternative realizations.

Relevant repository documents:

- [Product thesis](../ElixirScope-Blueprint-2026-10/00-foundation/02-product-thesis.md)
- [Domain distinctions](../ElixirScope-Blueprint-2026-10/00-foundation/03-domain-vocabulary.md)
- [Source and evidence identities](../ElixirScope-Blueprint-2026-10/02-architecture/02-semantic-evidence-model.md)
- [Context projections](../ElixirScope-Blueprint-2026-10/03-product/06-context-projections-and-view-catalogue.md)
- [State observations and reconstruction limits](../ElixirScope-Blueprint-2026-10/04-runtime/02-state-time-and-reconstruction.md)
- [OTP and distributed causality](../ElixirScope-Blueprint-2026-10/04-runtime/03-distributed-causality-and-otp.md)
- [Heritage concepts and corrections](../ElixirScope-Blueprint-2026-10/01-research/02-heritage-mining.md)
- [V3 wireframe](../elixirscope-interface-lab-v3/index.html)

External precedents also support parts of the direction. [Software Reflexion Models](https://www.cs.ubc.ca/~murphy/papers/rm/fse95.html) compare an engineer-supplied structural model with mapped source relationships; they do not prove behavioral requirements. [Code Canvas](https://www.microsoft.com/en-us/research/project/code-canvas/) explores source and visual information on a shared zoomable surface. Neither establishes that this particular ElixirScope design works; the comprehension experiments above are what should decide that.
