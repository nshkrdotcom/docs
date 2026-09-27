# Capability Catalog: Twelve Families

This is the required feature coverage for the architecture. A phase may implement only part of a family, but final acceptance requires all twelve to have coherent source-grounded behavior, tests, docs, and playbook integration.

## 1. Scene Engine

### Questions

- Who wants what from whom or from the situation?
- What opposes that objective?
- What happens if the character fails?
- Why now?
- What tactics are attempted and changed?
- What new information arrives?
- What choice/decision occurs?
- What consequence follows?
- What relationship/value state changes?
- Does the scene enter before its dramatic engine starts or continue after its primary result?

### Atomic observations

objective, opposition, stakes, urgency, tactic, tactic_shift, reveal, decision, consequence, value_delta, relationship_delta, preamble_candidate, linger_candidate.

### Trajectory outputs

scene entry/exit state delta in presentation order; qualified StoryWorld consequences; surrounding-sequence contribution; handoff pressure.

### Diagnoses

unclear objective, weak/unclear consequence, repeated tactic, static state, entry/exit economy candidate, unsupported turn, locally functional but redundant scene.

## 2. Agency and Causality

### Questions

- Which character choices cause major downstream events?
- Does a character pursue established goals?
- Are actions supported by knowledge, motive, relationship, or pressure?
- Is an event convenient because required causal support is missing?
- What breaks if a scene/event is removed?

### Semantic objects

events, causal edges, alternate support, goals, decisions, consequences.

### Trajectory outputs

agency trajectory with explicit presentation/story-time semantics, causal reach, consequence latency.

### Diagnoses

reactive pattern, unsupported causal jump, motivation gap, redundant support, delayed consequence, agency mismatch with intent.

## 3. Character Trajectory

### Questions

- How do goals, beliefs, knowledge, tactics, commitments, relationships, and values change?
- What choices reveal character?
- Does the character adapt after failure?
- What kind of arc is actually present?

### Outputs

diegetic character-state views; reader-visible character trajectory; arc-pattern hypotheses; decision map; goal-pursuit map.

### Important rule

Do not require transformation. Support steadfast, tragic, corruption, revelation, cyclical, ensemble, and deliberately static designs.

## 4. Relationship Dynamics

### Questions

- How do trust, intimacy, allegiance, leverage, status, dependency, resentment, obligation, concealment, and knowledge asymmetry evolve?
- Which interactions actually change the relationship?

### Outputs

pair/group diegetic state views; reader-visible relationship trajectory; interaction events; transition points; asymmetric state.

### Diagnoses

long stasis, unsupported reversal, repetitive negotiation, relationship consequence missing, betrayal/payoff underprepared.

## 5. Audience / Reader Experience

### Questions

- What does the first-time reader know or infer now?
- What questions remain open?
- What is anticipated?
- What outcome is uncertain and valued?
- What threat/opportunity is visible?
- What is likely surprising versus already predicted?
- Where is comprehension at risk?
- What makes the next scene desirable/necessary?

### Outputs

ReaderState, question ledger, anticipation ledger, suspense components, curiosity components, surprise candidates, comprehension risks, handoff pressure.

### Critical rule

No future-scene leakage.

## 6. Sequence Movement

### Questions

- What is this run of scenes trying to accomplish?
- How do constraints, stakes, knowledge, relationships, and choices escalate or transform?
- Where are reversals?
- What is the local climax/outcome?
- Does the sequence repeat state rather than advance it?

### Outputs

sequence state vector, movement density, escalation dimensions, local outcome, next-sequence handoff.

## 7. Dialogue Interaction

### Questions

- Does each turn respond, evade, redirect, attack, bargain, reveal, conceal, or change tactic?
- Is exposition doing dramatic work or merely explaining?
- Are lines repetitive?
- Are voices distinct?
- How does status/leverage change?
- Does the exchange change knowledge, goal, relationship, or pressure?

### Outputs

turn-pair observations, exchange-order tactic trajectory, status transactions, exposition/redundancy evidence, voice features, exchange outcome.

## 8. Setup / Payoff and Motifs

### Questions

- What has been planted or promised?
- How is it reinforced?
- When/how is it paid?
- Does payoff transform the setup?
- Are setups orphaned or payoffs unsupported?
- Which recurring images/objects/phrases carry character/theme/story function?

### Outputs

setup/payoff lifecycle, motif occurrences, transformation links, broken chains after revision.

## 9. Emotional / Value Movement

### Questions

- What materially improves/worsens for characters?
- What gain/loss is anticipated and realized?
- Where do hope, fear, security, belonging, trust, status, or control conditions change?
- Does a major event have an emotional/behavioral consequence?

### Outputs

character-affect condition trajectories with explicit ordering semantics; value-state deltas; event/reaction relationships.

### Rule

Do not claim universal human emotion. Model conditions and calibrated reader-response hypotheses.

## 10. Theme and Meaning

### Questions

- Which value conflicts recur?
- Which character choices embody those conflicts?
- How do consequences complicate them?
- What motifs or contrasts reinforce thematic questions?
- How does the ending relate to questions developed earlier?

### Outputs

thematic hypotheses with evidence/counterevidence; motif/value maps; writer-intent comparison.

### Rule

No authoritative single theme extraction and no “depth score.”

## 11. Genre-Specific Lens Packs

### Purpose

Apply optional expectations/diagnostics relevant to a chosen genre or subgenre without making them universal rules.

Initial useful packs may include mystery, thriller, horror, romance, comedy, and action because those domains introduce recognizable specialized questions. This is not a closed list of genres Fount supports.

Custom/hybrid/project/studio packs must have a concrete declarative authoring and installation path under `29_SAFE_LENS_AND_PACK_EXTENSIBILITY.md`. No Elixir change is required when a pack only composes installed safe primitives.

Do not add a pack merely for taxonomy completeness. A pack is justified when it contributes useful additional analytical emphasis beyond the general capability families.

### Outputs

asset references, added lens requirements, diagnostic salience rules, genre-intent conflicts/subversions, trust/source metadata, and resource-policy requests subject to host caps.

## 12. Revision Intelligence

### Questions

- What concern/diagnosis/strategy motivated a revision?
- Which exact story states changed?
- Did the intended effect occur?
- What collateral strengths or dependencies changed?
- Did new continuity/knowledge/causal/voice/reader-state problems appear?
- Are two candidate strategies genuinely different?
- Which parts can be combined safely?

### Outputs

candidate lineage, before/after observations, target-effect report, collateral-change report, broken setup/payoff/knowledge/causal links, note-addressing report, protected-strength regressions.

## Coverage rule

The 12 families are **capabilities**, not 12 independent provider pipelines. They share observations, semantic objects, reducers, and diagnoses. The architecture should minimize duplicate interpretation work and maximize reusable state.