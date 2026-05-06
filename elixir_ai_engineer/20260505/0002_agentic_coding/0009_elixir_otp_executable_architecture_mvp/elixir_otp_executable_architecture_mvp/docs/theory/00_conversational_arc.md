# Conversational Arc: From AI Code Failure to Executable Architecture

## 1. Original failure mode

An AI coding agent makes a local bug fix by mutating global architecture. In the motivating graphics example, a local font-rendering/OOM fix attempted to modify renderer binding topology by adding a backend-specific binding slot. The visible symptom is a bad patch. The deeper failure is that the agent selected a repair morphism whose semantic shape did not match the requested repair domain.

## 2. Why “review the diff” is inadequate

Manual review works only because a senior engineer carries a compressed semantic model of the system:

```text
file touched → subsystem role → protocol/ABI boundary → hot path → portability matrix → cost risk
```

For autonomous engineering, this model cannot remain implicit.

## 3. Why guardrails are insufficient

A guardrail says:

```text
Do not touch renderer binding code.
```

But the underlying principle is stronger:

```text
The agent does not possess Modify(PortableBackendABI), and the requested repair type does not permit a binding topology migration.
```

That is a typed capability/access graph statement, not merely a policy.

## 4. Why tests alone are insufficient

A test that says “font rendering no longer OOMs” permits bad repairs that solve the symptom by damaging architecture.

The correct test obligation is derived from the semantic type:

```text
fix(FontOOM)
AND preserve(PortableBackendABI)
AND preserve(ShaderABI)
AND preserve(HotPathCostType)
AND respect(AgentCapabilityBundle)
```

## 5. Core extraction

The center is:

> compositional denotational semantics with performance, capability, protocol, resource, and observation dimensions as first-class semantic types.

A component denotes:

```text
⟦P⟧ = Behavior × Effects × Capabilities × Resources × Cost × Protocol × Observation
```

A patch is valid only if it is a morphism that preserves/refines the declared denotation.

## 6. Product abstraction

The product category is **Executable Architecture**:

> Architecture documents that compile into semantic types, generated enforcement projections, mutation suites, and runtime calibration loops.

## 7. Why Elixir/OTP is a strong MVP target

OTP already has semantic structure:

- processes
- supervision trees
- GenServer callbacks
- message protocols
- fault/restart semantics
- registries
- telemetry
- property-testable state transitions

The MVP extends OTP’s implicit structure with explicit cost, capability, protocol, and observation types.
