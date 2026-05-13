# Sketch Code README

These Python files are reference sketches, not a full implementation. They define the primary data types and minimal algorithms needed to build the MVP.

## Files

- `cns_types.py` — dataclasses for evidence, access states, claims, rules, proof traces, worlds, and reports.
- `adversarial_evidence.py` — access-state and missing-record helper functions.
- `chirality.py` — graph, round-trip, access, and residual chirality functions.
- `worlds.py` — energy-based possible-world ranking and claim posterior computation.
- `tensor_logic.py` — tiny tensor-logic closure sketch.
- `synthetic_latent_context_experiment.py` — toy generator for latent-context contradictions.

## Run locally

```bash
python sketches/synthetic_latent_context_experiment.py
```

The sketch prints a small ranked-world example. It intentionally avoids external dependencies beyond Python and NumPy.
