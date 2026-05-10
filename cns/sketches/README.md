# Sketch Code README

These Python files are reference sketches, not a full implementation. They define the primary data types and minimal algorithms needed to build the MVP.

## Files

- `cns_types.py` — dataclasses for evidence, claims, rules, proof traces, worlds, and reports.
- `chirality.py` — graph and round-trip chirality functions.
- `worlds.py` — energy-based possible-world ranking and claim posterior computation.
- `tensor_logic.py` — tiny tensor-logic closure sketch.
- `synthetic_latent_context_experiment.py` — toy generator for latent-context contradictions.

## Run locally

```bash
python sketches/synthetic_latent_context_experiment.py
```

The sketch prints a small ranked-world example. It intentionally avoids external dependencies beyond Python and NumPy.
