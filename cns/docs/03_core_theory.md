# 03 — Core Theory

## 1. Structured Narrative Objects

An SNO is the unit of CNS reasoning.

$$
\mathcal{S} = (H, G, E, A, P, R, U, M)
$$

where:

- $H$ is the central hypothesis or account embedding.
- $G=(V,\mathcal{E}_G,\kappa,\rho)$ is a typed reasoning graph.
- $E$ is the evidence set attached to claims and relations.
- $A$ is the record-access state set.
- $P$ is a proof-trace bundle.
- $R$ is a residual contradiction tensor.
- $U$ is calibrated uncertainty metadata.
- $M$ is source, time, lineage, and domain metadata.

SNOs are structured narrative objects. They preserve the account being synthesized, not only the truth value of isolated claims.

## 2. Chiral opposition

A pair of SNOs $\mathcal{S}_a,\mathcal{S}_b$ is chiral when the accounts are oriented against one another while sharing a basis.

CNS 8.0 uses three compatible chirality estimators.

### 2.1 Graph chirality

Let $B_a$ and $B_b$ be signed incidence matrices over the aligned reasoning graph. Let $W_E$ weight edges by evidence quality.

$$
\chi_G(a,b) = \| W_E^{1/2}(B_a - B_b) \|_F
$$

This measures structural asymmetry in reasoning flow.

### 2.2 Evidence-polarity chirality

Let $s_a(e,c)$ be the signed stance of evidence item $e$ toward claim $c$ in SNO $a$, with support $+1$, refute $-1$, neutral $0$.

$$
\chi_E(a,b) =
\frac{
\sum_{e,c} w(e) |s_a(e,c)-s_b(e,c)|
}{
\sum_{e,c} w(e) + \epsilon
}
$$

This captures same-evidence / opposite-interpretation tension.

### 2.3 Language–logic chirality

Let $G: L\rightarrow \mathcal{T}$ be grounding from language to logic and $S:\mathcal{T}\rightarrow L$ be rendering/synthesis from logic to language. For logic state $T$:

$$
\chi_{LL}(T) = \|G(S(T)) - T\|_{\Omega}
$$

where $\Omega$ weights proof-critical predicates and evidence-linked atoms more heavily than cosmetic phrasing.

High $\chi_{LL}$ means the language rendering does not preserve the logic state when re-grounded.

## 3. Evidential Entanglement

Evidential Entanglement measures whether two SNOs argue over the same evidentiary substrate.

$$
\mathrm{Ent}(a,b) =
\frac{
\sum_{e \in E_a \cap E_b} w(e)
}{
\sum_{e \in E_a \cup E_b} w(e) + \epsilon
}
$$

High entanglement without chiral opposition is agreement or redundancy. High chirality without entanglement is often unrelated disagreement. High values of both identify productive synthesis targets.

## 4. Productive Conflict Score

$$
\mathrm{PCS}(a,b) = \sigma(\alpha \chi_G +\beta \chi_E +\gamma \chi_{LL} +\delta \mathrm{Ent} +\lambda \chi_E\mathrm{Ent} -\eta \mathrm{AccessGap})
$$

The interaction term $\chi_E\mathrm{Ent}$ is central: CNS cares about conflict over shared evidence.

## 5. Orthesis

Orthesis is the stable synthesis candidate in logic space.

Given an SNO pair and a synthesis operator $\Phi$, CNS produces a candidate logic state $T_c$. It is an orthesis candidate if:

$$
\|G(S(T_c)) - T_c\|_\Omega \leq \epsilon_{\mathrm{roundtrip}}
$$

$$
\mathrm{ZTHR}(T_c) = 0
$$

$$
\Delta \beta_1 = \beta_1(G_a \cup G_b) - \beta_1(G_c) \geq \theta_{\beta}
$$

$$
\mathrm{ResidualEnergy}(T_c) \leq \theta_R
$$

Orthesis is a stability condition. It does not assert metaphysical truth. It says the synthesized narrative object survives the CNS consistency, grounding, and re-rendering loop.

## 6. Synthesis as creation

The Synthesizer does not choose the most likely input account. It constructs a new SNO:

$$
\mathcal{S}_c = \Phi(\mathcal{S}_a,\mathcal{S}_b, P_0, R, \Lambda)
$$

where $P_0$ is zero-temperature proof closure, $R$ is residual contradiction, and $\Lambda$ is the set of accepted latent predicates. The output can preserve unresolved contradiction when evidence does not support a stronger resolution.

## 7. Failure conditions

CNS returns no synthesis or a partial synthesis when:

- citations fail;
- evidence does not entail promoted claims;
- no productive conflict exists;
- contradictions require a latent predicate that cannot be grounded;
- possible worlds remain too diffuse;
- round-trip chirality remains above threshold;
- proof-critical claims lack proof traces.
