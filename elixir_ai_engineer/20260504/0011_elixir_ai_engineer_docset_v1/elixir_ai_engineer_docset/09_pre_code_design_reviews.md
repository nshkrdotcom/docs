# 09 — Pre-Code Design Reviews

## Purpose

The highest leverage place to prevent AI slop is before code exists.

A pre-code design review evaluates the architecture artifacts, not a patch.

## Required reviews

```text
1. Concept inventory review
2. Boundary review
3. State ownership review
4. Runtime primitive review
5. Effect/governance review
6. API surface review
7. Compression review
8. Testability review
```

## 1. Concept inventory review

Questions:

```text
What concepts were introduced?
Which concepts are user/domain concepts?
Which are implementation concepts?
Which are synonyms?
Which can collapse?
```

Output:

```yaml
concepts:
  load_bearing:
    - CredentialLease
    - ConnectorInvocation
  suspicious:
    - CredentialLeaseManager
    - CredentialLeaseService
    - CredentialLeaseCoordinator
  collapse_recommendation:
    - collapse manager/service/coordinator into LeaseRegistry
```

## 2. Boundary review

Questions:

```text
What components exist?
What crosses boundaries?
Are external SDK/provider payloads translated before entering core?
Can any component call anything not declared?
```

## 3. State ownership review

Questions:

```text
Who owns each state value?
Is state duplicated?
Is derived state stored unnecessarily?
Can invalid state exist?
What happens on restart?
```

## 4. Runtime primitive review

Questions:

```text
Why is this a process?
Why is this not a pure module?
Why is this supervised here?
Why is this dynamic?
Why is lookup needed?
```

## 5. Effect/governance review

Questions:

```text
What effects occur?
Which effects are external?
Which capabilities authorize them?
Are effects auditable?
Can any effect occur without ExecutionContext?
```

## 6. API surface review

Questions:

```text
Which functions are public?
Which contract requires each public function?
Can callers do the same thing in multiple ways?
Can API surface shrink?
```

## 7. Compression review

Questions:

```text
What can be deleted before implementation?
Which abstractions are premature?
Which modules only exist to rename things?
What is the 250-line version of this design?
```

## 8. Testability review

Questions:

```text
Can core behavior be tested without processes?
Can process lifecycle be tested through public API?
Can forbidden transitions be tested?
Can failure modes be injected?
```

## Design review gate

A component cannot move to implementation until:

```text
- all entities are defined
- all public operations have contracts
- all processes have state/lifecycle justification
- all external effects are declared
- all expensive abstractions have necessity proof
- all invariants have enforcement path
```

## LM role

LMs may help generate critiques, but the output must be converted into structured findings:

```yaml
finding:
  id: fake_behaviour_before_second_provider
  severity: warn
  evidence:
    - behaviour declared
    - one implementation
    - no roadmap reference
  recommendation: collapse into concrete module until second provider exists
  enforcement_candidate: single_implementation_behaviour_check
```

Repeated findings become deterministic checks.
