# 21 — Operator Catalog

The Elixir AI Engineer is built from operators. An operator transforms one artifact into another.

The important shift:

```text
Do not think in prompts.
Think in operators with inputs, outputs, costs, and failure modes.
```

## Operator kinds

```text
Deterministic operators
Cheap LM operators
Frontier LM operators
Human operators
Runtime evidence operators
```

## Deterministic operators

| Operator | Input | Output | Purpose |
|---|---|---|---|
| `parse_spec` | Markdown/spec blocks | SpecGraph | Make specs checkable. |
| `extract_impl_graph` | Elixir source | ImplementationGraph | See what code actually did. |
| `extract_runtime_graph` | running app / telemetry | RuntimeGraph | Validate OTP topology. |
| `run_tests` | code | EvidenceGraph | Behavioral evidence. |
| `run_property_tests` | code + generators | EvidenceGraph | Invariant evidence. |
| `detect_undeclared_effects` | ImplGraph + SpecGraph | violations | Block hidden IO/network/credential effects. |
| `detect_unjustified_genservers` | ImplGraph + ENF | violations | Block process cosplay. |
| `detect_single_impl_behaviours` | ImplGraph | findings | Detect fake extensibility. |
| `compute_cost` | ImplGraph + policy | CostGraph | Measure engineering burden. |
| `compare_spec_to_impl` | SpecGraph + ImplGraph | drift report | Detect spec/code mismatch. |
| `generate_skeleton` | SpecCell + ENF | code scaffold | Reduce LM degrees of freedom. |

## Cheap LM operators

| Operator | Input | Output | Use |
|---|---|---|---|
| `summarize_module_intent` | code excerpt | short intent | Human-readable reports. |
| `classify_domain_synonym` | term + domain model | likely mapping | Detect invented names. |
| `explain_violation` | violation | explanation | Better developer UX. |
| `propose_small_refactor` | local code + violation | patch idea | Cheap repair. |
| `generate_test_names` | contract | test list | Completeness aid. |

## Frontier LM operators

Use sparingly.

| Operator | Use when |
|---|---|
| `generate_architecture_alternatives` | pre-code architecture search |
| `resolve_design_conflict` | constraints conflict or NFR ambiguity |
| `synthesize_compression_rewrite` | deterministic normalizer cannot safely rewrite |
| `generate_hard_property_tests` | subtle invariant requires semantic creativity |
| `repair_after_multiple_failures` | local/cheap attempts fail |

## Human operators

Humans own:

```text
- charter invariants
- nonfunctional priorities
- final high-risk architecture decisions
- accepted ENF policy changes
- security exceptions
- roadmap-driven optionality
```

## Operator records

Every operator run should emit lineage:

```yaml
operator_run:
  operator: detect_unjustified_genservers
  input_hash:
  output_hash:
  model: null
  cost:
  verdict:
  artifacts:
```

## Operator escalation ladder

```text
1. deterministic rule
2. static analysis
3. generated test
4. property/fault test
5. cheap LM classifier
6. local LM repair
7. frontier LM repair
8. human review
```

The goal is to minimize semantic uncertainty per dollar.
