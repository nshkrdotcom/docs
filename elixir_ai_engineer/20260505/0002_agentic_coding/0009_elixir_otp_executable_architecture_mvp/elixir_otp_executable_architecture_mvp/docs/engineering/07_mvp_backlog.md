# MVP Backlog

## Milestone 0 — Foundation

- [ ] Create Mix project / umbrella
- [ ] Define `SemanticId`, `SemanticObject`, `SemanticType`
- [ ] Implement semantic type loader from `.exs` DSL or YAML
- [ ] Implement canonical JSON/hash of semantic graph
- [ ] Add minimal docs generation

## Milestone 1 — Capability bundles

- [ ] Define capability bundle schema
- [ ] Implement access edge checker
- [ ] Implement patch-scope validation against capability bundle
- [ ] Add `agent.session_checkout_repair` bundle
- [ ] Add tests for read vs modify semantics

## Milestone 2 — SessionPool example

- [ ] Implement supervised `SessionPool` GenServer
- [ ] Implement bounded `DynamicSupervisor` worker pool
- [ ] Implement checkout/checkin lifecycle
- [ ] Emit telemetry start/stop/exception events
- [ ] Add fixture helpers

## Milestone 3 — Type oracle

- [ ] Define oracle query/request/response structs
- [ ] Implement intent-to-template mapping
- [ ] Filter templates by capability bundle
- [ ] Return required projections/checks
- [ ] Add CLI task `mix archex.oracle`

## Milestone 4 — Projection engine

- [ ] Generate ExUnit contract test
- [ ] Generate StreamData property test
- [ ] Generate Credo check stub
- [ ] Generate telemetry contract test
- [ ] Generate Benchee benchmark stub
- [ ] Add generated file hash headers

## Milestone 5 — Patch Lens

- [ ] Parse git diff changed files
- [ ] Map generated headers to semantic objects
- [ ] Map module annotations to semantic objects
- [ ] Emit impacted type list
- [ ] Emit required check plan

## Milestone 6 — Consistency kernel

- [ ] Define proof bundle schema
- [ ] Validate semantic graph hash
- [ ] Validate required checks present
- [ ] Validate capability authorization
- [ ] Validate mutation results
- [ ] Emit deterministic verdict report

## Milestone 7 — Mutation harness

- [ ] Define mutation behavior
- [ ] Implement remove capability check mutation
- [ ] Implement remove telemetry mutation
- [ ] Implement unsupervised spawn mutation
- [ ] Implement forbidden effect mutation
- [ ] Report kill score

## Milestone 8 — Runtime observer

- [ ] Attach telemetry handlers
- [ ] Aggregate cost observations
- [ ] Compare to declared cost types
- [ ] Emit anomaly record
- [ ] Generate candidate refinement document

## Milestone 9 — End-to-end demo

- [ ] Run oracle query
- [ ] Generate projections
- [ ] Apply valid patch
- [ ] Run checks and mutation suite
- [ ] Produce accepted proof bundle
- [ ] Apply bad patch and show deterministic rejection

## MVP done definition

The MVP is complete when it can reject these patches deterministically:

- checkout without capability
- session execute before checkout
- unsupervised worker spawn
- checkout network call
- missing telemetry stop event
- unbounded worker growth

And accept one valid local repair:

- bounded checkout timeout/retry refinement preserving capability, protocol, cost, and observation contracts
