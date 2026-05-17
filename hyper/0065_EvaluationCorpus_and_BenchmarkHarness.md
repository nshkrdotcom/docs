# Response 5 — Evaluation Corpus and Benchmark Harness

The next missing piece is the **Evaluation Corpus and Benchmark Harness**.

The system design has a strong precomputation substrate: AST-anchored entities, dimensional understanding slices, relation graphs, semantic clusters, materialized projections, navigation indices, and a read-side UI model where knob turns are indexed lookups rather than live inference. 

The operating-intelligence additions then introduced:

```text
Belief Calculus
Commitment DSL
Action Model
Query Language
```

But without evaluation, all of this remains conceptually impressive and practically unproven.

The evaluation layer answers:

```text
Is the system correct?
Is it useful?
Is it calibrated?
Is it fast?
Does it improve with feedback?
Does it actually reduce engineering effort?
Does it catch things humans care about?
```

This is the layer that turns the product from:

```text
a sophisticated architecture intelligence proposal
```

into:

```text
a benchmarkable engineering system
```

---

# 1. Core Claim

A system like this cannot be evaluated as “an LLM code tool.”

It must be evaluated as a **multi-stage reasoning system**.

It has to be tested across the full intent-to-implementation stack:

```text
docs
  → requirements
    → decisions
      → commitments
        → architecture
          → contracts
            → code
              → tests
                → runtime
                  → actions
                    → human feedback
```

The benchmark should not ask only:

```text
Did it summarize this function correctly?
```

It should ask:

```text
Did it trace this requirement to the right code?
Did it detect that this PR invalidated an ADR?
Did it distinguish implementation truth from intended architecture?
Did it classify impact correctly?
Did it avoid over-enforcement on weak evidence?
Did it compress without hiding risk?
Did human correction improve the next inference?
```

That is the right evaluation target.

---

# 2. What Must Be Proven

The evaluation harness should prove eight claims.

## 1. Trace correctness

```text
The system can correctly trace from requirements to decisions, contracts, code, tests, and runtime evidence.
```

## 2. Belief correctness

```text
The system can correctly classify claims as verified, stale, contested, drifted, refuted, unimplemented, or unverified.
```

## 3. Causal impact correctness

```text
Given a proposed change, the system can classify downstream artifacts as must_change, should_change, may_change, must_not_change, or must_revalidate.
```

## 4. Commitment evaluation correctness

```text
The system can evaluate architecture commitments against code, dependency, data, test, and runtime evidence.
```

## 5. Action quality

```text
The system recommends the right operational behavior: report, warn, fail CI, draft ADR, generate test, request review, or do nothing.
```

## 6. Query answer quality

```text
The query language returns accurate, evidence-backed, scoped, reproducible answers.
```

## 7. Compression faithfulness

```text
The system can produce small explanations without hiding essential uncertainty, contradictions, violations, or risk.
```

## 8. Performance and scalability

```text
The system can serve projections and query answers within usable latency on large snapshots.
```

---

# 3. Evaluation Should Be Layered

Do not evaluate the system only end-to-end.

You need layered evaluation because failures can occur at different stages.

```text
Extraction Evaluation
  Did the system identify the right artifacts?

Relation Evaluation
  Did it build the right edges?

Trace Evaluation
  Did it connect intent to implementation correctly?

Belief Evaluation
  Did it classify truth state correctly?

Commitment Evaluation
  Did it detect compliance/violation/exception?

Impact Evaluation
  Did it classify change consequences correctly?

Action Evaluation
  Did it recommend the right response?

Compression Evaluation
  Did it explain faithfully and minimally?

System Evaluation
  Did the human complete the engineering task faster and more accurately?
```

This prevents vague outcomes like:

```text
The answer was bad.
```

Instead you can say:

```text
The answer was bad because root artifact resolution was correct, but the trace included a stale ADR and the compression omitted an active exception.
```

That is actionable.

---

# 4. The Evaluation Corpus

The corpus should contain **software-engineering situations**, not just files.

Each benchmark case should include:

```text
workspace snapshot
source code
docs
requirements
ADRs
commitments
tests
runtime observations if relevant
a query or event
gold expected answer
gold evidence
allowed uncertainty
scoring rubric
```

A benchmark case is not:

```text
Here is a file. Summarize it.
```

A benchmark case is:

```text
A PR changes password reset token expiry.
The system must determine whether this violates accepted architecture,
which requirements are affected,
which tests must change,
whether CI should fail,
and what evidence supports that conclusion.
```

That is the correct unit of evaluation.

---

# 5. Corpus Tiers

The system should use multiple corpus tiers.

## Tier 1: Synthetic micro-fixtures

Small controlled examples.

Purpose:

```text
test one reasoning capability at a time
```

Example:

```text
one requirement
one ADR
one function
one test
one deliberate drift
```

Best for:

```text
unit tests
regression tests
fast CI
debugging belief calculus
```

## Tier 2: Synthetic architecture fixtures

Medium Elixir projects designed to exercise realistic architecture.

Purpose:

```text
test multi-app and multi-layer reasoning
```

Example:

```text
umbrella project with Accounts, Billing, Notifications, Reporting
intentional boundary violations
data ownership rules
runtime-style traces
tests and ADRs
```

Best for:

```text
commitment DSL
impact reasoning
PR reviewer behavior
query language
```

## Tier 3: Historical replay corpora

Real repositories or internal codebases replayed over commit history.

Purpose:

```text
test whether the system predicts real downstream changes and drift
```

Example:

```text
commit N changes requirement
commit N+1 updates code
commit N+2 updates tests
system must predict affected artifacts from commit N
```

Best for:

```text
causal impact
lineage
belief invalidation
stale architecture detection
```

## Tier 4: Human-labeled production corpora

Real engineering tasks labeled by maintainers.

Purpose:

```text
measure usefulness against expert judgment
```

Best for:

```text
trace precision/recall
query answer quality
semantic compression
action recommendations
```

## Tier 5: Live product telemetry

Observed user interactions and feedback.

Purpose:

```text
measure actual utility and learning improvement
```

Best for:

```text
onboarding time
review time
false-positive reduction
accepted suggestions
correction learning
```

---

# 6. Gold, Silver, and Bronze Labels

Not every benchmark needs the same label quality.

## Gold labels

Human-expert adjudicated.

Use for:

```text
final benchmark scores
publication-quality claims
model calibration
architecture violation evaluation
```

## Silver labels

Derived from structured sources.

Examples:

```text
known generated fixture structure
tests that intentionally encode behavior
commit metadata
explicit DSL commitments
```

Use for:

```text
large-scale regression testing
fast iteration
```

## Bronze labels

Heuristic or weak supervision.

Examples:

```text
naming conventions
historical co-change
doc links
issue references
```

Use for:

```text
training candidates
active learning
recall-oriented discovery
```

The system should never confuse bronze labels with gold truth.

---

# 7. Human Labeling Protocol

The evaluation corpus needs a structured labeling process.

For each case, labelers should identify:

```text
root artifact
relevant upstream artifacts
relevant downstream artifacts
trace path correctness
belief state
evidence strength
impact class
appropriate action
acceptable explanation
critical omissions
```

Example label form:

```yaml
case_id: password_reset_expiry_pr_001

root_event:
  kind: pr_change
  changed_artifact: Accounts.Token.verify_reset_token/1
  changed_field: max_age
  old_value: 900
  new_value: 3600

gold_belief_state:
  claim: "Password reset tokens expire after 15 minutes"
  state: drifted

gold_upstream:
  - requirement: SEC-014
  - decision: ADR-008
  - commitment: AUTH-003

gold_downstream:
  must_change:
    - Accounts.Token.verify_reset_token/1
    - password_reset_expiry_test
  must_revalidate:
    - password_reset_controller_integration_test
  must_not_change:
    - non_enumeration_behavior
    - audit_logging

gold_action:
  ci: fail
  require:
    - restore_code_or_update_adr
    - security_review_if_policy_changed

critical_evidence:
  - code_span:max_age
  - requirement_span:SEC-014
  - adr_span:ADR-008
  - test_span:expiry_test
```

This is what makes the benchmark precise.

---

# 8. Inter-Rater Agreement

Architecture labels are not always obvious.

The corpus should track agreement between human labelers.

Label categories:

```text
artifact relevance
trace correctness
impact class
belief state
severity
action recommendation
```

If humans disagree, the benchmark should preserve that.

Possible adjudication states:

```text
agreed
adjudicated
ambiguous
organization-specific
policy-dependent
```

This is important because some architecture questions are inherently contextual.

For example:

```text
Is this direct call a boundary violation?
```

may depend on a team’s architecture policy.

The benchmark should distinguish:

```text
system wrong
```

from:

```text
architecture policy ambiguous
```

---

# 9. Trace Accuracy Metrics

Trace evaluation measures whether the system connects the right artifacts.

## Requirement-to-code trace

```text
Input:
  requirement

Expected:
  contracts, commitments, modules, functions, source spans, tests
```

Metrics:

```text
precision
recall
F1
path accuracy
evidence accuracy
over-tracing rate
under-tracing rate
stale-link rate
```

## Code-to-rationale trace

```text
Input:
  function or source span

Expected:
  contract, commitment, decision, requirement, source doc
```

Metrics:

```text
upstream precision
upstream recall
nearest-rationale accuracy
first-hop correctness
explanation faithfulness
```

## Path quality

Not all correct nodes make a correct path.

Example bad path:

```text
requirement → semantically similar module → unrelated function
```

Correct path:

```text
requirement → accepted commitment → contract → implementation binding → function
```

So measure:

```text
node correctness
edge correctness
path ordering
edge-type correctness
evidence support
```

---

# 10. Belief State Metrics

Belief evaluation measures whether the truth-maintenance system works.

States to evaluate:

```text
verified
believed
inferred
stale
contested
refuted
drifted
orphaned
unimplemented
unverified
scope_split
exceptioned
superseded
```

Metrics:

```text
state accuracy
per-state precision/recall
confusion matrix
false stale rate
missed drift rate
missed unimplemented rate
false violation rate
scope-split accuracy
exception handling accuracy
```

Important confusion cases:

| Mistake                                   | Why It Matters               |
| ----------------------------------------- | ---------------------------- |
| `drifted` classified as `verified`        | Dangerous false assurance    |
| `unknown` classified as `unverified`      | Overclaims absence           |
| `exceptioned` classified as `violated`    | Creates false-positive noise |
| `scope_split` classified as contradiction | Misleads teams               |
| `stale` missed                            | User trusts obsolete claim   |
| `inferred` shown as `verified`            | False authority              |

The evaluation should heavily penalize false certainty.

---

# 11. Confidence Calibration Metrics

Confidence must be calibrated.

The system should track:

```text
When the system says 0.8 confidence, is it correct about 80% of the time?
```

Metrics:

```text
calibration curve
expected calibration error
Brier-style score
per-claim-type calibration
per-analyzer calibration
per-evidence-type calibration
overconfidence rate
underconfidence rate
```

Track calibration separately for:

```text
LLM-inferred claims
static analyzer claims
runtime observation claims
test evidence claims
human-corrected claims
commitment evaluation claims
impact predictions
```

This is crucial because different claim types have different reliability.

Example:

```text
Static call extraction may be 95% reliable for normal calls.
LLM bounded-context inference may be 65% reliable.
Runtime observed edge may be 99% reliable for occurrence, but weak for non-occurrence.
```

The belief engine needs those reliability profiles.

---

# 12. Commitment Evaluation Metrics

Commitment evaluation asks:

```text
Did the system correctly determine whether architecture intent is satisfied?
```

Evaluate:

```text
satisfied
violated
exceptioned
unknown
stale
unimplemented
unverified
drifted
```

Metrics:

```text
violation precision
violation recall
exception precision
exception recall
unknown correctness
severity calibration
new-vs-existing violation accuracy
evidence completeness
CI-decision accuracy
```

Example benchmark case:

```text
Commitment:
  Web controllers must not call Repo.

Code:
  One controller directly calls Repo.
  One context module calls Repo.
  One test module calls Repo.

Expected:
  controller call = violation
  context call = allowed
  test call = allowed if scoped to test
```

This tests selectors, scopes, exceptions, relation extraction, and action policy.

---

# 13. Causal Impact Metrics

Causal impact is one of the hardest and most valuable evaluations.

Given a change, the system predicts:

```text
must_change
should_change
may_change
must_not_change
must_revalidate
safe_unaffected
unknown
```

Metrics:

```text
per-class precision/recall
must_change recall
must_not_change precision
over-impact rate
under-impact rate
blast-radius ranking quality
change-plan usefulness
human agreement
post-hoc commit match
```

## Historical replay method

Use real commit sequences:

```text
Commit A:
  requirement or API changes

Later commits:
  code, tests, docs, configs updated
```

Ask the system at Commit A:

```text
What must change?
```

Then compare against actual later changes.

This is imperfect because humans may miss things, but it gives useful signal.

## Mutation method

Inject controlled changes:

```text
change token expiry
remove telemetry event
add forbidden dependency
delete test
rename public API
change data ownership
```

Gold impact is known.

This provides clean evaluation.

---

# 14. Query Language Metrics

Evaluate query answers by query kind.

## Rationale queries

```text
Why does this function exist?
```

Metrics:

```text
root resolution accuracy
upstream trace accuracy
rationale correctness
evidence relevance
omission rate
hallucinated rationale rate
```

## Realization queries

```text
What implements this requirement?
```

Metrics:

```text
implementation precision
implementation recall
test linkage accuracy
source-span accuracy
```

## Drift queries

```text
Where does intended architecture diverge from current code/runtime?
```

Metrics:

```text
drift detection precision
drift detection recall
drift type accuracy
severity accuracy
evidence accuracy
```

## Impact queries

```text
What changes if this requirement changes?
```

Metrics:

```text
impact class accuracy
ranking quality
action usefulness
```

## Violation queries

```text
Which architecture rules does this PR violate?
```

Metrics:

```text
violation accuracy
exception handling
CI behavior accuracy
false-positive cost
```

## Compression queries

```text
Explain this subsystem with the minimum needed detail.
```

Metrics:

```text
faithfulness
coverage of critical facts
compression ratio
user-rated clarity
critical omission rate
```

---

# 15. Semantic Compression Metrics

Compression is not ordinary summarization.

The system must produce:

```text
the smallest truthful explanation for the user’s current task
```

Measure:

## Faithfulness

```text
Does the explanation make only claims supported by evidence?
```

## Critical coverage

```text
Does it include active contradictions, violations, stale claims, high-risk uncertainty, and relevant commitments?
```

## Compression ratio

```text
How much did it reduce the artifact set?
```

Example:

```text
50,000 artifacts → 17 visible items
```

## Omission risk

```text
Did it omit something that would change the user’s decision?
```

## Cognitive efficiency

```text
Can a user answer the target question faster with this projection?
```

## Continuity

```text
When the user changes knobs, does the explanation preserve object identity and avoid disorientation?
```

Compression should be penalized more for **dangerous omissions** than for verbosity.

A verbose explanation is annoying.

A compact explanation that hides a high-risk contradiction is unsafe.

---

# 16. Action Model Metrics

The action model should be evaluated separately from detection.

A system can detect correctly but recommend the wrong action.

Evaluate:

```text
report/warn/fail decision
suggested patch appropriateness
generated test usefulness
ADR draft quality
exception draft correctness
approval routing correctness
false-positive burden
false-negative risk
```

## Action labels

For each finding, gold action may be:

```text
do_nothing
surface_only
warn
fail_ci
request_review
draft_test
draft_adr
draft_exception
suggest_patch
block_until_approval
```

Metrics:

```text
action accuracy
over-enforcement rate
under-enforcement rate
approval-route accuracy
generated-artifact acceptance rate
post-action verification success
```

## Important cost asymmetry

Not all action mistakes are equal.

| Mistake                                         | Cost                     |
| ----------------------------------------------- | ------------------------ |
| Fail CI on false positive                       | High trust cost          |
| Warn instead of fail on critical security drift | High safety cost         |
| Generate irrelevant test                        | Medium annoyance         |
| Miss stale ADR                                  | Medium architecture cost |
| Ask unnecessary clarification                   | Low to medium friction   |
| Auto-suggest risky patch                        | High risk                |

The evaluation should use weighted costs.

---

# 17. Runtime Feedback Metrics

Runtime-to-intent feedback evaluates whether production behavior updates the architecture model correctly.

Test cases:

```text
rare path becomes hot
async path behaves synchronously
documented event not emitted
unexpected service-to-service call observed
runtime dependency appears only in prod
error rate violates reliability commitment
feature flag changes behavior
```

Metrics:

```text
runtime drift detection
hot-path classification accuracy
runtime/design contradiction accuracy
risk reprioritization accuracy
false alert rate
observation-window sensitivity
scope handling accuracy
```

Runtime evaluation must distinguish:

```text
not observed
```

from:

```text
does not happen
```

A system that treats missing traces as proof of absence should be penalized.

---

# 18. Human Correction Learning Metrics

The system claims that human corrections become durable priors.

Evaluate that.

Example correction:

```text
Human says:
  This module belongs to Shared Kernel, not Billing.
```

Expected downstream improvements:

```text
similar modules classified better
boundary detection improves
projection salience changes
false positives decrease
future query answers reflect correction
```

Metrics:

```text
pre-correction accuracy
post-correction accuracy
error reduction
correction propagation precision
overgeneralization rate
repeat-false-positive rate
active-learning efficiency
```

## Active learning metric

Ask:

```text
How many human labels are needed to improve a class of inference?
```

Measure:

```text
accuracy gain per label
ambiguity reduction per label
false-positive reduction per label
```

This proves the system learns from humans rather than merely storing notes.

---

# 19. Performance Metrics

The original design depends heavily on pre-materialization and indexed lookups.

Performance must be benchmarked explicitly.

Metrics:

```text
projection lookup p50/p95/p99
knob transition latency
query planning latency
query answer latency
belief recomputation latency
incremental invalidation latency
projection refresh latency
indexing throughput
storage growth
runtime trace ingestion rate
```

Example targets:

```text
Knob transition p95:
  < 50 ms for hot read path

Projection packet lookup p95:
  < 100 ms

PR review local recomputation:
  < 2 minutes for typical PR

Large workspace initial indexing:
  measured by files/minute and artifacts/minute

Incremental doc/code change:
  recompute only affected beliefs and projections
```

The exact numbers can change, but the benchmark must exist.

---

# 20. Scalability Fixtures

Create artificial but realistic scale fixtures.

Example fixture sizes:

| Fixture    | Repos | Mix Projects | Modules | Functions | Claims | Relations |
| ---------- | ----: | -----------: | ------: | --------: | -----: | --------: |
| Small      |     1 |            3 |     100 |     1,000 |  5,000 |    10,000 |
| Medium     |     5 |           30 |   1,000 |    10,000 | 75,000 |   200,000 |
| Large      |    25 |          200 |  10,000 |   100,000 |     1M |        5M |
| Very Large |   100 |        1,000 |  50,000 |   500,000 |    10M |       50M |

Evaluate:

```text
indexing time
storage size
projection generation time
query latency
incremental update time
cache hit rate
memory pressure
```

This protects the product from being impressive only on toy examples.

---

# 21. Benchmark Case Families

The corpus should include recurring case families.

## Requirements-to-code

```text
Given requirement R, find implementation and tests.
```

## Code-to-rationale

```text
Given function F, find why it exists.
```

## Stale architecture

```text
ADR says X, code now does Y.
```

## Missing implementation

```text
Accepted requirement has no code realization.
```

## Missing verification

```text
Security behavior implemented but untested.
```

## Boundary violation

```text
Context A directly reads Context B data.
```

## Exception handling

```text
Violation is covered by scoped, unexpired exception.
```

## Expired exception

```text
Previously accepted exception is now expired.
```

## Runtime/design mismatch

```text
Design says async; runtime shows sync call.
```

## Hot path reprioritization

```text
Design says rare; runtime shows hot.
```

## PR impact

```text
PR changes code; system predicts affected requirements and actions.
```

## Human correction

```text
Human relabels ownership; system should improve future inference.
```

## Compression

```text
Explain a subsystem under a task-specific token/item budget.
```

This suite covers the operating intelligence kernel.

---

# 22. Elixir-Specific Evaluation Cases

Because Elixir is the first target, include Elixir-specific cases.

## Umbrella boundaries

```text
apps/accounts
apps/billing
apps/notifications
apps/reporting
```

Cases:

```text
in_umbrella dependency allowed
direct internal module call forbidden
public context API call allowed
shared config ambiguity
```

## Phoenix contexts

```text
Controller → Context → Repo
```

Cases:

```text
controller calls Repo directly
controller calls context correctly
context owns Ecto schema
cross-context schema access
```

## OTP supervision

Cases:

```text
worker starts under wrong supervisor
restart strategy contradicts reliability commitment
runtime process exists but docs omit it
```

## GenServer / PubSub / Oban

Cases:

```text
documented async job path implemented synchronously
PubSub event missing on runtime trace
Oban job not idempotent despite commitment
```

## Macros

Cases:

```text
macro-generated function implements contract
static analyzer misses generated call
belief state should be inferred/partial, not verified
```

## Config

Cases:

```text
runtime.exs changes adapter
prod config violates architecture assumption
test config creates scope split
```

These will distinguish the system from generic code intelligence.

---

# 23. Mutation-Based Benchmarks

Mutation tests are ideal for this system.

Inject controlled changes and score whether the system detects the right consequence.

## Code mutations

```text
change max_age from 900 to 3600
remove telemetry emission
add direct Repo call in controller
replace public API call with internal module call
remove Oban enqueue and call provider directly
delete test assertion
rename public API
```

## Doc mutations

```text
change requirement value
supersede ADR
remove architecture commitment
add new exception
mark API deprecated
```

## Runtime mutations

```text
add trace showing unexpected synchronous call
increase path frequency
inject error rate increase
show missing event emission
```

## Expected outputs

For each mutation, label:

```text
belief state changes
affected artifacts
violated commitments
required actions
projection deltas
```

This gives deterministic tests for the reasoning loop.

---

# 24. Historical Replay Benchmarks

Historical replay tests whether the system predicts real evolution.

Workflow:

```text
1. Pick a commit before a known architecture-significant change.
2. Run the system on that snapshot.
3. Present the initiating change.
4. Ask the system for impact.
5. Compare predicted impact to later commits and human labels.
```

Example:

```text
Commit 100:
  Requirement changes reset token policy.

Commits 101-105:
  Code, tests, docs, telemetry updated.

System at Commit 100 should predict:
  token verification code
  expiry tests
  ADR
  support docs
  telemetry labels
```

This is not perfect because actual developer changes may be incomplete, but it is a strong real-world signal.

---

# 25. PR Review Benchmark Suite

The PR reviewer is likely the first adoption wedge, so it needs a dedicated benchmark.

Each PR case should include:

```text
base snapshot
PR diff
commitments
expected findings
expected CI result
expected PR comments
expected suggested actions
```

PR case categories:

```text
clean PR
new boundary violation
existing violation untouched
existing violation worsened
expired exception
security drift
missing test for new behavior
stale ADR caused by code change
runtime assumption invalidated by config change
false-positive trap
```

Metrics:

```text
finding precision
finding recall
CI decision accuracy
comment usefulness
evidence correctness
noise rate
reviewer acceptance rate
```

A good PR architecture reviewer must be conservative about blocking and strong about evidence.

---

# 26. Trust UX Evaluation

The UI must present uncertainty without overwhelming users.

Evaluate:

```text
Do users understand why the system believes something?
Do users notice when evidence is weak?
Do users correctly distinguish verified from inferred?
Do users trust the system more after seeing contested evidence?
Do users find the source evidence?
Do users know what action is required?
```

Test patterns:

```text
blind answer
answer with confidence only
answer with evidence summary
answer with belief state + evidence + contradiction panel
```

Measure:

```text
user correctness
time to decision
trust calibration
overtrust rate
undertrust rate
clarification requests
```

A good trust UX does not maximize user trust.

It maximizes **appropriate trust**.

---

# 27. Security and Privacy Evaluation

The system ingests sensitive material.

Benchmark:

```text
secret redaction
access control
tenant isolation
runtime trace privacy
model-context leakage prevention
audit log completeness
```

Test cases:

```text
secret in config file
token in runtime trace
restricted repo evidence
sensitive user data in logs
cross-tenant query attempt
unauthorized user asks rationale for restricted code
```

Expected behavior:

```text
redact sensitive spans
preserve existence if allowed
hide details if unauthorized
never send restricted context to external model if policy forbids
log access
explain redaction boundary
```

This is not optional for enterprise use.

---

# 28. Evaluation Harness Architecture

The harness should be a first-class subsystem.

```text
Benchmark Registry
  stores benchmark cases and metadata

Fixture Loader
  creates workspace snapshots, repos, docs, traces, PR diffs

System Runner
  runs extraction, belief evaluation, queries, actions, projections

Oracle Loader
  loads gold/silver/bronze labels

Scorer
  computes metrics by capability

Regression Tracker
  compares current run against prior runs

Calibration Analyzer
  measures confidence reliability

Report Generator
  produces engineering and executive reports
```

Pipeline:

```text
load fixture
  → run indexing
    → run belief engine
      → run query/action/projection tasks
        → compare outputs to oracle
          → compute metrics
            → generate regression report
```

---

# 29. Minimal Schema for Benchmarking

You do not need much schema, but a few tables help.

```sql
CREATE TABLE benchmark_suite (
  suite_id          uuid PRIMARY KEY,
  suite_key         text NOT NULL UNIQUE,
  description       text,
  target_capability text NOT NULL,
  created_at        timestamptz DEFAULT now()
);
```

```sql
CREATE TABLE benchmark_case (
  case_id           uuid PRIMARY KEY,
  suite_id          uuid NOT NULL REFERENCES benchmark_suite(suite_id),

  case_key          text NOT NULL,
  case_kind         text NOT NULL,
  -- trace, belief, impact, commitment, query, action, compression, runtime

  fixture_uri       text NOT NULL,
  input_json        jsonb NOT NULL,
  oracle_json       jsonb NOT NULL,

  label_quality     text NOT NULL,
  -- gold, silver, bronze

  difficulty        text,
  metadata          jsonb DEFAULT '{}',

  UNIQUE (suite_id, case_key)
);
```

```sql
CREATE TABLE benchmark_run (
  run_id            uuid PRIMARY KEY,
  suite_id          uuid NOT NULL REFERENCES benchmark_suite(suite_id),

  system_version    text NOT NULL,
  model_versions    jsonb NOT NULL DEFAULT '{}',
  config_json       jsonb NOT NULL DEFAULT '{}',

  started_at        timestamptz DEFAULT now(),
  completed_at      timestamptz,

  summary_metrics   jsonb DEFAULT '{}'
);
```

```sql
CREATE TABLE benchmark_case_result (
  result_id         uuid PRIMARY KEY,
  run_id            uuid NOT NULL REFERENCES benchmark_run(run_id),
  case_id           uuid NOT NULL REFERENCES benchmark_case(case_id),

  output_json       jsonb NOT NULL,
  score_json        jsonb NOT NULL,
  passed            boolean,

  diagnostics       jsonb DEFAULT '{}',

  UNIQUE (run_id, case_id)
);
```

The key is not the schema. The key is making evaluation repeatable.

---

# 30. Evaluation Reports

Each benchmark run should produce several reports.

## Engineering report

```text
which cases failed
why they failed
which subsystem likely caused failure
diff from previous run
regressions
calibration changes
latency changes
```

## Product report

```text
PR reviewer precision/recall
onboarding query usefulness
trace accuracy
user-facing false-positive rate
```

## Trust report

```text
overconfident wrong answers
claims with unsupported evidence
dangerous omissions
hidden uncertainty
```

## Performance report

```text
indexing time
projection latency
query latency
incremental recomputation time
storage growth
```

## Learning report

```text
how much human corrections improved inference
which corrections propagated incorrectly
which false positives repeated
```

This makes the system improvable.

---

# 31. Scorecards by Product Wedge

Different adoption wedges need different scorecards.

## PR Architecture Reviewer scorecard

```text
new violation precision
new violation recall
CI decision accuracy
false block rate
evidence correctness
reviewer acceptance rate
time added to CI
```

## Stale Architecture Detector scorecard

```text
stale claim precision
stale claim recall
drift type accuracy
source evidence correctness
architect-rated usefulness
```

## Requirement-to-Code Explorer scorecard

```text
trace precision
trace recall
source-span accuracy
rationale quality
missing-link detection
```

## Onboarding/Rationale Engine scorecard

```text
time to answer task
number of navigation steps
user confidence calibration
critical fact recall
subjective usefulness
```

## Boundary Violation Detector scorecard

```text
boundary violation precision
boundary violation recall
exception handling
selector accuracy
policy ambiguity handling
```

This keeps evaluation tied to actual product value.

---

# 32. Regression Philosophy

The benchmark should protect the system from three failure modes.

## 1. More recall, worse trust

The system finds more possible links but produces more false claims.

Prevent with:

```text
precision metrics
confidence calibration
trust UX tests
```

## 2. Better summaries, worse evidence

The system writes nicer explanations but loses source grounding.

Prevent with:

```text
evidence accuracy
faithfulness scoring
critical omission tests
```

## 3. Stronger enforcement, worse adoption

The system catches more violations but blocks too many legitimate PRs.

Prevent with:

```text
false block rate
exception handling tests
human review acceptance metrics
```

A good evaluation harness must reward useful restraint.

---

# 33. Continuous Evaluation Loop

Evaluation should run at multiple speeds.

## Fast local tests

```text
micro-fixtures
belief calculus unit cases
DSL parser/compiler tests
query planner tests
```

Run constantly.

## Nightly benchmark

```text
synthetic architecture fixtures
PR review suite
mutation tests
compression tests
```

Run daily.

## Weekly full benchmark

```text
large scale fixtures
historical replay
runtime feedback tests
latency and storage benchmarks
```

Run weekly.

## Periodic human evaluation

```text
expert review
onboarding task studies
trust UX tests
architecture review simulations
```

Run less often but with high value.

---

# 34. Using Evaluation to Improve the System

Evaluation results should feed back into the operating intelligence kernel.

Examples:

```text
LLM trace links often over-connect semantically similar functions.
  → reduce weight of vector-only evidence for implementation claims.

Boundary detector misses macro-generated calls.
  → route macro-heavy modules through enhanced expansion analysis.

Compression omits active exceptions.
  → add exceptioned violations to mandatory preservation list.

Human corrections often relabel Shared Kernel modules.
  → improve bounded-context clustering prior.

CI false blocks occur on test-only code.
  → improve scope handling for test environment.
```

The benchmark is not just a scorekeeping layer. It is the system’s learning and hardening loop.

---

# 35. Minimal Viable Benchmark Plan

For the first product version, keep evaluation focused.

Assume first wedge:

```text
PR Architecture Reviewer for Elixir umbrellas.
```

Build these suites first:

## Suite 1: Boundary rules

```text
web_no_repo
domain_no_internal_cross_call
data_owner_no_direct_read
deprecated_api_no_new_consumers
```

## Suite 2: Belief states

```text
verified
stale
drifted
unverified
exceptioned
unknown
```

## Suite 3: PR actions

```text
warn
fail
request_exception
draft_test
draft_adr
```

## Suite 4: Query answers

```text
what rules does this PR violate?
what requirements does this PR affect?
why is this function risky?
what must change?
```

## Suite 5: Projection latency

```text
materialized PR review projection
boundary map projection
drift projection
```

That gives enough evidence to prove the core thesis without building every benchmark.

---

# 36. Example Benchmark Case

```yaml
case_key: web_controller_direct_repo_call

case_kind: pr_violation

fixture:
  type: elixir_umbrella
  apps:
    - accounts
    - web

commitments:
  - id: web_no_repo
    statement: "Phoenix controllers must not call Repo directly."
    severity: error
    ci:
      on_new_violation: fail

pr_diff:
  added_code:
    file: apps/web/lib/web/user_controller.ex
    function: create/2
    calls:
      - Accounts.Repo.insert/1

oracle:
  findings:
    - kind: boundary_violation
      commitment: web_no_repo
      source: Web.UserController.create/2
      target: Accounts.Repo.insert/1
      belief_state: verified
      severity: error
      new_violation: true

  ci_result: fail

  required_evidence:
    - source_span
    - call_edge
    - commitment_reference

  acceptable_actions:
    - suggest_move_to_context
    - request_exception
```

Scoring:

```text
1 point: detects violation
1 point: identifies correct commitment
1 point: identifies correct source span
1 point: identifies correct target call
1 point: marks as new
1 point: fails CI
1 point: suggests appropriate resolution
-2 points: blocks without evidence
-2 points: flags context Repo call as violation
```

This is concrete and repeatable.

---

# 37. Example Belief Benchmark

```yaml
case_key: token_expiry_doc_code_drift

case_kind: belief_state

artifacts:
  requirement:
    id: SEC-014
    text: "Password reset tokens expire after 15 minutes."
    state: accepted

  adr:
    id: ADR-008
    text: "Use signed reset token with max_age 900 seconds."
    state: accepted

  code:
    file: lib/accounts/token.ex
    expression: "max_age: 3600"

oracle:
  claim:
    text: "Password reset tokens expire after 15 minutes."
    expected_state: drifted

  contradiction_type: doc_code_drift

  support_evidence:
    - SEC-014
    - ADR-008

  refute_evidence:
    - code:max_age_3600

  expected_action:
    - fail_if_in_pr
    - require_adr_update_or_code_restore
```

This directly tests truth maintenance.

---

# 38. Example Compression Benchmark

```yaml
case_key: billing_pr_risk_smallest_truthful_explanation

case_kind: compression

input:
  root: pr_1842
  task: explain_risk_to_senior_engineer
  max_items: 12

critical_facts:
  must_include:
    - billing_owns_invoices
    - accounts_owns_users
    - billing_must_not_read_accounts_tables
    - pr_adds_direct_read
    - exception_absent
    - ci_should_fail

  may_omit:
    - unrelated_notifications_dependency
    - unchanged_billing_worker_modules
    - old_superseded_exception

oracle:
  dangerous_omissions:
    - pr_adds_direct_read
    - commitment_violation
    - lack_of_exception

metrics:
  faithfulness: required
  max_items: 12
  critical_coverage: 1.0
```

This tests whether compression preserves what matters.

---

# 39. Benchmarking “Useful Novelty”

To prove novelty, define benchmark tasks that ordinary tools struggle with.

Examples:

```text
Given a function, find the original requirement and ADR that justify it.

Given a PR, determine whether it violates architecture intent, not just whether tests pass.

Given a runtime trace, determine which design assumption it contradicts.

Given a requirement change, classify code/tests/docs as must_change, may_change, or must_revalidate.

Given a compressed architecture view, verify it omits no critical risk.
```

These are the tasks that distinguish the system from:

```text
code search
static analysis
LLM summarization
architecture diagramming
knowledge graph browsing
```

The benchmark should explicitly compare against baselines.

---

# 40. Baselines

Use baseline systems for comparison.

## Baseline 1: Full-text search

```text
grep / ripgrep / search index
```

## Baseline 2: Static call graph only

```text
AST and dependency traversal without beliefs or docs
```

## Baseline 3: Vector search only

```text
semantic similarity over docs and code
```

## Baseline 4: LLM over retrieved chunks

```text
RAG summarizer without belief calculus or commitments
```

## Baseline 5: Human-maintained architecture docs

```text
docs alone
```

## Baseline 6: Existing static policy tooling

```text
rule-based architecture checks without intent tracing
```

The system’s claim should be:

```text
We outperform these baselines on trace accuracy, drift detection, change-impact prediction, actionable PR review, and explanation faithfulness.
```

---

# 41. Final Definition

The Evaluation Corpus and Benchmark Harness is:

> A repeatable, multi-layer evaluation system that tests whether the operating intelligence kernel can correctly trace intent to implementation, maintain live belief states, detect drift, evaluate architecture commitments, predict change impact, recommend safe actions, answer scoped queries, compress faithfully, learn from human correction, and serve projections at scale.

It is the bridge from:

```text
the system sounds powerful
```

to:

```text
the system is measurably correct, useful, calibrated, and fast
```

The next gap to fill is the **Trust UX**: how the interface presents belief states, uncertainty, evidence, contradictions, compressed explanations, and action recommendations without either overwhelming users or creating false authority.
