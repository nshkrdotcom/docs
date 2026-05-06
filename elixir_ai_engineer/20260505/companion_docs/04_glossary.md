# Glossary

## AccessGraph

The authority graph governing read, modify, execute, and delegate rights across code, semantic objects, tools, runtime effects, credentials, and interventions.

## Architecture Capsule

A bounded summary of a system area that predicts behavior, ownership, cost, failure modes, dependencies, and likely intervention paths.

## Blast-Radius Proportionality

A repair must not use a global architectural mutation to solve a local symptom unless the broader mutation is proven necessary.

## Consistency Kernel

The deterministic accept/reject authority. It checks semantic types, projections, invariants, evidence, mutants, budgets, telemetry contracts, and access permissions. It must not call an LLM to decide a verdict.

## Control Oracle

A query layer that recommends a safe intervention path through the system. It answers how to steer the system, not merely whether a term is valid.

## Cost-Refined Semantic Type

A semantic type that includes behavior, effects, capabilities, resources, cost, protocol ordering, and observation obligations.

## Engineering Normal Form

The declared acceptable shape of implementation. In v2 it has stable core, project policy, experimental, and exception layers.

## EvidenceGraph

The graph of tests, property checks, mutation outcomes, fault tests, adversarial tests, coverage obligations, benchmarks, and runtime observations.

## Executable Architecture

Architecture that compiles into semantic types, projection contracts, tests, static checks, benchmarks, telemetry contracts, mutation suites, and proof bundles.

## Intervention

An intended system change: feature addition, bug fix, optimization, protocol change, migration, dependency upgrade, recovery action, or removal.

## InterventionGraph

A graph of possible and historical changes, including expected scope, actual scope, proof obligations, rollback path, risk, prediction error, and outcome.

## LineageGraph

The graph recording why artifacts exist: which spec caused which code, which operator produced which patch, which check rejected it, which normalizer rewrote it, and which proof bundle accepted it.

## Living Substrate

A lifetime-scoped engineering control surface that continuously projects specs, code, runtime behavior, evidence, capabilities, credentials, and judgment into shared graphs.

## Morphism

A structure-preserving transformation. In this context, a valid patch is a morphism that preserves or refines the required semantic structure.

## Mutation-Tested Invariant

An invariant whose checks have been validated against known-bad changes. The invariant is trusted only if representative mutants are killed.

## Program Semantic Graph

A typed graph of software meaning: stable identities, operations, effects, capabilities, resources, cost, protocol, observations, invariants, projections, and mutations.

## Proof Bundle

A machine-verifiable evidence package for a patch or intervention: semantic delta, access grants, checks, tests, mutants, benchmarks, normalizer output, runtime observations, and verdict.

## Semantic Source Map

A bidirectional map between semantic objects and source anchors, code symbols, tests, mutations, telemetry events, specs, and proof bundles.

## SpecCell

A multigranular living node that can represent system, subsystem, component, process, operation, or test obligation. It accumulates spec declarations, implementation projections, evidence, counterexamples, runtime observations, and lineage.

## StackLab

The adversarial subsystem that generates counterexamples, mutation tests, fault tests, and exfiltration tests to falsify invariants.

## Type Oracle

A query layer that tells a bounded operator what valid morphisms exist for a given intent, semantic type, and capability bundle before code generation begins.
