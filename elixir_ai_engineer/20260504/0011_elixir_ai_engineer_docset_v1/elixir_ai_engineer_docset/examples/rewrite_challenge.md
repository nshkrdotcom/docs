# Rewrite Challenge Example

## Task

Reduce a bloated credential lease implementation while preserving behavior.

## Original metrics

```yaml
loc: 842
modules: 11
public_functions: 37
genservers: 3
behaviours: 2
registries: 1
tests: pass
spec_audit: fail
```

## Challenge prompt

```text
Given this spec and passing behavior tests, produce a smaller implementation.
Do not change public contracts.
Do not add new effects.
Prefer pure modules.
Remove behaviours with one implementation unless the spec declares the seam.
Remove GenServers without state ownership.
All tests must continue to pass.
```

## Target metrics

```yaml
max_loc: 300
max_modules: 4
max_public_functions: 14
max_genservers: 1
max_behaviours: 0
```

## Acceptance

```text
- tests pass
- property tests pass
- spec.audit passes
- extracted SpecGraph tracked properties equivalent
- cost decreases
```
