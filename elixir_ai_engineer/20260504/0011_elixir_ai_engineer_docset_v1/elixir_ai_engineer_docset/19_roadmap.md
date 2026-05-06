# 19 — Roadmap

## Two-week MVP

### Day 1–2: write the seed specs

Create:

```text
spec/charter.md
spec/domain.md
spec/engineering_policy.md
spec/components/credential_fabric.md
spec/components/connector_fabric.md
spec/components/execution_context.md
```

Keep short. Do not specify the universe.

### Day 3–5: build `mix spec.audit`

Implement five checks:

```text
1. GenServer without state-ownership justification.
2. Behaviour with one implementation.
3. Public function not traceable to contract.
4. External effect not declared.
5. Domain term absent from domain model.
```

### Day 6–7: run against existing AI-generated code

Do not fix everything. Classify findings.

```text
real violation
false positive
missing spec
acceptable detail
AI slop
```

### Day 8–10: build `mix spec.bundle`

Generate context bundles for one component.

### Day 11–14: implement proof slice

Implement governed credentialed connector invocation.

## Six-week target

```text
- ImplementationGraph JSON output
- traceability matrix
- custom ENF policy YAML
- one compression normalizer
- benchmark suite with 10 tasks
- before/after report comparing naive AI vs harness workflow
```

## Three-month target

```text
- SpecCell parser
- deterministic skeleton generator
- property test generation templates
- runtime topology extraction
- spec.watch reverse extraction
- first public demo/writeup
```

## Six-month target

```text
- multi-component slice
- 1:N shaped configuration
- Credential Fabric hardened tests
- Connector Fabric for two providers or one provider + local fake
- benchmark dashboard
- harness evolution experiments
```

## What to defer

```text
- full multi-agent orchestration
- many Codex/OpenAI subscription routing
- distributed global system
- formal verification
- e-graph optimizer
- OPCD/model-weight distillation
- full multi-repo graph database
```

## Success metric

The first meaningful metric:

```text
Harness-normalized output preserves behavior with materially lower module count,
public API surface, and unjustified OTP primitives than naive AI output.
```

Report it quantitatively.
