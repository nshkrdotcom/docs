# 18 — Architecture Diagram Notes

## Main diagram

```text
┌─────────────────────┐
│ Source Corpus        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Evidence Atom Store  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Proposer             │
│ candidate SNOs       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Critics              │
│ grounding/logic/etc. │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Antagonist           │
│ chirality + gaps     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Pair Selector        │
│ PCS = χ × Ent        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Tensor Prover        │
│ zero-temp closure    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Residual Analyzer    │
│ contradiction tensor │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Predicate Inventor   │
│ latent contexts      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Synthesizer          │
│ synthesized SNO      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Orthesist            │
│ G(S(T)) stability    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Audit + Multiverse   │
│ report               │
└─────────────────────┘
```

## Substrate diagram

```text
SNO graph layer
  ↕
tensor proof layer
  ↕
evidence/access layer
  ↕
possible-world/calibration layer
```

The substrate constrains synthesis; it is not the framework.

## Language–logic diagram

```text
       Logic / Tensor Space T
       ┌───────────────────┐
       │ proof atoms       │
       │ rules             │
       │ residual tensors  │
       └──────▲─────┬──────┘
              │ G   │ S
              │     ▼
       ┌───────────────────┐
       │ Language Space L  │
       │ text/concepts     │
       │ renderings        │
       └───────────────────┘
```

The orthesis criterion tests whether the $G\circ S$ loop preserves proof-critical structure.
