# Risk Register

| Risk | Severity | Mitigation |
|---|---:|---|
| Semantic types are wrong | Critical | bootstrap validation with known-good/bad examples and mutations |
| Generated tests give false confidence | Critical | mutation kill requirements |
| Performance benchmarks are noisy | High | separate static resource types from empirical calibration; use baselines and statistical tolerance |
| Patch Lens misses impacted object | High | require generated headers, module annotations, path scopes; conservative fallback |
| Agent learns to satisfy tests narrowly | High | mutation testing, property testing, oracle templates, review semantic types |
| Capability model too coarse | High | model read/modify/execute/delegate edges separately |
| Too much ceremony | Medium | start with one boundary and four semantic types |
| Generated Credo checks too brittle | Medium | start with narrow forbidden call patterns; include false-positive workflow |
| Runtime observer auto-weakens contracts | Critical | require human/trusted confirmation for type refinements |
| Kernel becomes complex/heuristic | Critical | keep kernel deterministic; push synthesis to agent/oracle, not verdict path |

## Explicit safety principle

The consistency kernel must never call an LLM to decide a verdict.

## Explicit scalability principle

Model components through finite semantic summaries and projection contracts. Do not attempt to enumerate runtime state space.
