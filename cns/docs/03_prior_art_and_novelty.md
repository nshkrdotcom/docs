# 03 — Prior Art and Novelty

## Summary

GCTS is built from well-established components—retrieval, fact verification, argument mining, neuro-symbolic inference, tensor logic, multi-agent debate, structured intelligence analysis, missing-data reasoning, and calibration. Its novelty is the **combination and formal boundary**:

> Maintain a calibrated distribution over proof-carrying and access-aware possible worlds, measure language–logic–access chirality as round-trip distortion, resolve contradiction by latent context and access-state decomposition, rank likely truth, and never use a runtime oracle for promoted truth claims.

## Prior-art map

| Area | Representative work | What it gives us | What GCTS adds |
|---|---|---|---|
| RAG | Lewis et al. 2020 | Retrieve evidence for generation | Proof-carrying worlds, calibrated likely truth, contradiction and access residuals |
| Fact verification | FEVER; SciFact | Labels and evidence/rationale benchmarks | Multiverse truth ranking, record-contingent statuses, latent conflict resolution |
| Argument mining | Mochales/Moens; Lippi/Torroni; Wachsmuth et al. | Claim/relation extraction, argument search | Evidence-weighted chirality and world-scored synthesis |
| Abstract argumentation | Dung 1995 | Attack/support reasoning | Probabilistic evidence closure, proof traces, access states |
| Multi-agent debate | Du et al.; ToT; Self-consistency | Multiple reasoning paths and debate | Consensus is not enough; proof, access modeling, and calibration are required |
| Tensor/neuro-symbolic logic | Tensor Logic; TensorLog; LTN; PSL | Differentiable and tensorized logic | Application to chiral narrative conflict, access-aware worlds, and likely-truth ranking |
| Topology/sheaves | Sheaf neural nets; persistent homology | Graph consistency and topological diagnostics | Language–logic–access curvature as narrative chirality |
| Intelligence analysis | ICD 203; Kent WEP; ACH | Competing hypotheses, confidence, estimative language | Executable multiverse posterior with evidence/access-driven truth rankings |
| Missing-data reasoning | missingness mechanisms, selection bias, observability | Distinguish unavailable, unobserved, and absent data | Record-access states integrated into narrative synthesis |
| Fine-tuning | LoRA | Efficient task adaptation | Optional extraction/access/calibration only, not runtime truth oracle |

## Detailed positioning

### Against RAG

RAG improves access to external knowledge by combining parametric language models with non-parametric retrieval. GCTS treats retrieval as only the first layer. Retrieved spans become evidence atoms; missing expected records become access states; claims must be linked, scored, and placed into possible worlds. A generated answer without proof, likelihood, access notes, and confidence is not a synthesis.

### Against fact verification systems

FEVER and SciFact establish important claim-verification tasks. GCTS uses those datasets for calibration and evaluation, but shifts the objective from single claim labels to narrative-level likely-truth ranking under limited information. A claim can be “likely but low-confidence,” “supported in world W1 but contradicted in W2,” “true under latent context Z,” or “record-contingent because decisive evidence is inaccessible.”

### Against argument mining

Argument mining extracts structured arguments from text. GCTS needs extraction, but it is not primarily an extraction method. It is a resolution method for contradictions among extracted structures under evidence and access constraints.

### Against multi-agent debate

Debate and self-consistency can improve LLM outputs, but can still converge to fluent unsupported consensus. GCTS separates candidate generation from proof, access modeling, and certification. Agents may debate, but claims are promoted only through evidence-backed world scoring and explicit policy.

### Against generic neuro-symbolic logic

TensorLog, Logic Tensor Networks, PSL, and Tensor Logic all show that logic and continuous learning can be combined. GCTS contributes a narrative-specific architecture:

- evidence atoms and claim worlds;
- record-access states and missingness hypotheses;
- chiral residuals for contradiction;
- latent context and access decomposition;
- oracle-boundary discipline;
- intelligence-analysis-style confidence outputs.

### Against pure topology

Persistent homology and sheaf models can identify structural consistency and holes. GCTS uses topological ideas as diagnostics, but the key problem is not only a cycle inside a graph. A case can have a DAG evidence graph and still be chiral because the language-to-logic/access mapping twists.

## Novel claims to test

1. **Chirality predictiveness:** evidence-weighted language–logic–access chirality predicts synthesis difficulty better than embedding distance or graph cycles alone.
2. **Multiverse calibration:** maintaining top-K possible worlds improves calibration and abstention compared with single-output generation.
3. **Latent context recovery:** tensor residual decomposition can recover hidden context variables that explain conflicting evidence.
4. **Access-state utility:** access modeling improves likely-truth ranking in missing or controlled-record settings.
5. **Oracle-free runtime:** trained/calibrated components can support runtime truth ranking without runtime labels.
6. **Proof-carrying synthesis:** zero-temperature proof gates reduce unsupported strict claims relative to RAG and debate baselines.

## What not to overclaim

- GCTS does not guarantee objective truth outside the evidence/access model.
- Zero-temperature closure is only as good as evidence quality, rule quality, and extraction correctness.
- Posterior world mass is a calibrated decision score, not metaphysical probability.
- Access-state modeling can improve inference under missingness but cannot prove claims by itself.
- Fine-tuned extractors can still fail; hard gates and abstention remain necessary.
