# Longitudinal Resource Economics

## 1. Product requirement

Fount encourages iteration. Therefore resource transparency must model repeated use across a rewrite cycle, not merely the cost of one analysis run.

"Cost" means the scarce execution resource appropriate to the deployment:

- hosted provider money;
- input/output tokens or provider units;
- request quotas;
- local/on-prem GPU time;
- queue time / throughput;
- CPU time;
- storage/cache footprint;
- human-review time where relevant.

## 2. Required levels of accounting

Track at least:

```text
measurement request
playbook run
draft/revision
candidate comparison
project
rewrite period / scenario
```

## 3. Preflight estimate

Before an expensive playbook executes, provide an estimate derived from:

- target count;
- estimated projection sizes;
- required lenses/stages;
- known cache hits/misses;
- model/provider selection;
- configured rates/throughput data;
- optional enrichment stages;
- current budget caps.

A preflight estimate must be allowed to say "unknown" for dimensions the provider/runtime cannot estimate reliably.

## 4. Suggested execution classes

The implementation may expose writer-facing classes such as:

### Quick

Use cached/deterministic evidence aggressively; skip expensive optional enrichment.

### Standard

Run normal required evidence and selected enrichment.

### Deep

Broader context, additional competing hypotheses, more expensive optional checks.

These names are product-level suggestions, not hardcoded universal tiers. The underlying requirement is explicit, inspectable budget policy.

## 5. Hard caps

Callers/studios can cap:

- maximum hosted monetary cost when provider rates are known;
- maximum requests;
- maximum model units/tokens;
- maximum local/GPU seconds or job allocation where measurable;
- maximum elapsed time;
- maximum targets/states;
- whether optional stages may be skipped.

Exceeding a cap yields partial/withheld analysis rather than silently overspending.

## 6. Longitudinal scenarios

The cost model should support scenario estimates such as:

```text
Initial 110-page feature analysis
+ 8 weekly rewrite iterations
+ 3 whole-draft Submission Reads
+ targeted Scene Doctor on 20 scenes
+ 10 candidate comparisons
```

The point is not to promise exact future dollars. It is to let the writer/studio understand order-of-magnitude resource demand and how reuse changes marginal cost.

## 7. Incremental-revision economics

Content-addressed MeasurementResult reuse should make a localized revision cheaper than a full cold run when semantic inputs remain unchanged.

Reports should expose:

```text
cold work
reused work
recomputed work
new contextual misses caused by upstream changes
```

A change to Scene 3 may force contextual work in Scene 4 even if Scene 4 text did not change. The estimate must use effective semantic inputs, not merely changed page count.

## 8. Hosted versus on-prem/local

The same playbook may have very different economics:

### Hosted

- monetary provider rates;
- request quotas;
- latency;
- data-export policy.

### On-prem/local

- GPU/CPU availability;
- queue depth;
- wall time;
- energy/operational allocation;
- model residency/load cost;
- privacy advantages.

The architecture must not assume hosted inference is inherently more expensive or on-prem is free.

## 9. Resource history

Persist or report enough run metadata to answer:

- what did this pass consume?
- what did reuse save?
- which lens/playbook dominated cost?
- which optional stage was skipped?
- how did cost change after the revision?

Do not retain provider secrets in usage records.

## 10. Writer-facing presentation

A result packet may summarize:

```text
Estimated before run
  92 provider requests
  64% expected reuse
  estimated hosted cost: $X–Y (if rates configured)
  estimated local compute: Z GPU-minutes (if calibrated)

Actual
  87 requests
  69% reused
  cost / compute actually observed
```

If rates/throughput are unavailable, show the raw resource units rather than inventing a dollar estimate.

## 11. Validation

Cost/compute estimation accuracy itself should be measured over time:

- estimated versus actual requests;
- estimated versus actual units/tokens;
- estimated versus actual provider spend;
- estimated versus actual local runtime where measurable;
- reuse-rate estimate versus actual.

## 12. Non-goal

Do not use one competitor's per-script coverage price as proof that Fount is economical. Fount's iterative usage pattern is materially different.

## Phase 2 substrate checkpoint

Observe preflight reports exact semantic-input/specification byte sizes and target,
question and active-cap metadata without spending a budget or calling a provider.
`Batch.resource_usage` distinguishes actual scheduled/completed/reused work and
reported usage. Unavailable wire/cost/retry totals are unknown, not guessed values.
A finite initial-provider-request cap forces retries off. Durable longitudinal
history and marginal-rewrite economics remain later Intelligence-shell work.
The source and tests are written; real runtime/live accounting is not yet verified.
