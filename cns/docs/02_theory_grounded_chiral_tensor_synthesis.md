# 02 — Theory: Grounded Chiral Tensor Synthesis

## 1. Objects

### Evidence atoms

Let an evidence atom be

$$
e_i = (u_i, s_i, t_i, q_i, m_i)
$$

where:

- $u_i$ is a stable source identifier;
- $s_i$ is a text span or structured datum;
- $t_i$ is the temporal scope;
- $q_i \in [0,1]$ is source/evidence quality;
- $m_i$ is metadata: author, venue, access path, extraction method, and provenance.

The evidence set is $E = \{e_1,\dots,e_n\}$.

### Claims

A claim is

$$
c_j = (p_j, a_j, \rho_j, \sigma_j)
$$

where $p_j$ is a proposition, $a_j$ is a canonical argument frame, $\rho_j$ is a reference set, and $\sigma_j$ is a status in:

$$
\{\texttt{proven},\texttt{probable},\texttt{plausible},\texttt{conflicted},\texttt{unsupported},\texttt{rejected}\}.
$$

### Relations

Relations among claims are typed:

$$
R \subseteq C \times \{supports, refutes, implies, specializes, generalizes, qualifies, independent\} \times C.
$$

### Rules

A rule is a tuple:

$$
r = (\text{body}, \text{head}, \tau, \lambda, \mathcal{P})
$$

where $\tau$ is temperature, $\lambda$ is rule weight, and $\mathcal{P}$ is a policy tag:

- $\tau \to 0^+$: deductive/proof-carrying rule;
- $\tau > 0$: analogical/soft rule;
- $\mathcal{P}=strict$: cannot be used for promoted truth unless it has zero-temperature proof support.

## 2. Language–logic bundle

Let $L$ be the language/concept manifold and $\mathcal{T}$ be the logic/proof space. A grounding map

$$
G: L \rightarrow \mathcal{T}
$$

extracts proof-carrying structure from text. A rendering map

$$
S: \mathcal{T} \rightarrow L
$$

turns proof-carrying structure back into language. Their composition

$$
C = G \circ S: \mathcal{T} \rightarrow \mathcal{T}
$$

is the grounding-synthesis closure.

### Orthesis

The orthesis is the stable logic state:

$$
\mathcal{T}^* = G(S(\mathcal{T}^*)).
$$

It is not an oracle truth. It is the proof-carrying structure that survives the round trip through language without losing its grounding.

## 3. Chirality

### Round-trip chirality

For a logic state $T$, define:

$$
\delta(T) = d_{\mathcal{T}}(T, G(S(T))).
$$

A well-grounded claim has low $\delta$. A semantically fluent but logically unstable narrative has high $\delta$.

### Pairwise chiral tension

For two states $T_A,T_B$:

$$
\chi_{AB}^{rt} = \delta(T_A) + \delta(T_B) + \eta \cdot d_{\mathcal{T}}(Cl_0(T_A), Cl_0(T_B)) \cdot E_{AB}
$$

where $Cl_0$ is zero-temperature closure and $E_{AB}$ is evidential entanglement.

### Graph chiral tensor

For graph states $G_A,G_B$, define signed edge-incidence vectors $b_A(e)$ and $b_B(e)$ over the shared claim universe. Then:

$$
\mathcal{C}_{AB}^{graph}=\sum_e \omega(e)(b_A(e)-b_B(e))(b_A(e)-b_B(e))^T.
$$

The graph chirality score is:

$$
\chi_{AB}^{graph}=\mathrm{Tr}(\mathcal{C}_{AB}^{graph})\cdot E_{AB}.
$$

### Residual tensor chirality

Let $Y^+$ be support/evidence tensor mass and $Y^-$ be refutation tensor mass over claim/context/evidence indices. The contradiction residual is:

$$
R = Y^+ - Y^-.
$$

The residual energy is:

$$
\chi^{res}=\|R\|_F^2.
$$

Large $\chi^{res}$ indicates unresolved chiral conflict.

## 4. Possible worlds / multiverse views

A world view is:

$$
W_k = (F_k, R_k, Z_k, \Pi_k, A_k)
$$

where:

- $F_k$ is a set of accepted facts;
- $R_k$ is a rule subset;
- $Z_k$ are latent context predicates (time, subgroup, mechanism, source frame);
- $\Pi_k$ are proof traces;
- $A_k$ are assumptions.

A multiverse state is a distribution over worlds:

$$
Q(W_k \mid E) = \frac{\exp(-\mathcal{E}(W_k;E))}{\sum_\ell \exp(-\mathcal{E}(W_\ell;E))}.
$$

The energy function is:

$$
\mathcal{E}(W;E)=
\lambda_g L_{ground}(W,E)+
\lambda_c L_{contra}(W)+
\lambda_r L_{rule}(W)+
\lambda_p L_{parsimony}(W)-
\lambda_s S_{support}(W,E).
$$

Interpretation:

- lower energy worlds are better supported;
- contradictions increase energy;
- unsupported complexity increases energy;
- evidence support decreases energy.

## 5. Claim truth ranking

For a claim $c$, define:

$$
P(c \mid E)=\sum_{k} Q(W_k\mid E)\,\mathbf{1}[c \in Cl_0(W_k)].
$$

This is the CNS truth ranking. It is a probability-like calibrated score over proof-carrying worlds, not a direct LLM confidence.

### Confidence

Define normalized world entropy:

$$
H(Q)=-\sum_k Q(W_k)\log Q(W_k),\quad H_n(Q)=\frac{H(Q)}{\log K}.
$$

Define evidence coverage $Cov(c)$, calibration quality $Cal$, and contradiction mass $Con(c)$. Then:

$$
Conf(c)=P(c\mid E)\cdot Cov(c)\cdot Cal\cdot (1-H_n(Q))\cdot (1-Con(c)).
$$

The system must emit both $P(c\mid E)$ and $Conf(c)$; high probability with low confidence is possible when the world distribution is unstable.

## 6. Estimative language mapping

GCTS maps numerical posterior intervals to estimative language:

| Posterior interval | Estimative language |
|---:|---|
| 0.00–0.05 | almost certainly false |
| 0.05–0.20 | very unlikely |
| 0.20–0.40 | unlikely |
| 0.40–0.60 | roughly even chance |
| 0.60–0.80 | likely |
| 0.80–0.95 | very likely |
| 0.95–1.00 | almost certain |

This mapping is configurable by domain and should be reported with confidence bands.

## 7. Latent context resolution

When the residual $R$ remains large, decompose it:

$$
R \approx C \times_1 U_{claim} \times_2 U_{evidence} \times_3 U_{context}.
$$

The factor $U_{context}$ proposes latent context predicates such as:

- time interval;
- population/subgroup;
- measurement method;
- source perspective;
- mechanism;
- jurisdiction;
- operational condition.

A latent predicate is promoted only if:

1. it reduces residual energy on held-out examples;
2. it is grounded in evidence;
3. it does not increase unsupported complexity beyond an MDL threshold;
4. it improves calibration or top-K world coverage.

## 8. Oracle boundary theorem sketch

### Claim

If all promoted claims must be in $Cl_0(W_k)$ for some world $W_k$ with resolvable evidence references, then no runtime oracle is required for promoted claims.

### Conditions

- Rules are monotone and stratified.
- All strict rules use $\tau \to 0^+$.
- Evidence references resolve in the runtime corpus.
- Promotion requires proof trace and thresholded posterior.

### Sketch

At zero temperature, tensor closure is equivalent to deterministic rule firing over finite evidence atoms. A promoted claim must appear in the closure of at least one world with evidence support. The oracle can calibrate the scoring function offline but cannot introduce a promoted atom at runtime unless it is derivable from evidence and rules.

## 9. Uncertainty decomposition

GCTS separates:

- **Aleatory uncertainty:** evidence genuinely supports multiple incompatible worlds.
- **Epistemic uncertainty:** the system lacks enough evidence or calibrated model support.
- **Model uncertainty:** validators disagree or extraction confidence is unstable.
- **Source uncertainty:** evidence source quality or provenance is weak.

Each SynthesisReport should include these uncertainty categories.

## 10. Theory falsifiability

The theory is falsified or weakened if:

- chirality does not predict synthesis difficulty;
- posterior world distributions are not calibratable;
- latent context decomposition does not recover planted hidden modifiers in synthetic data;
- RAG/debate baselines match or exceed GCTS on grounding, calibration, and abstention with lower complexity;
- strict zero-temperature proof paths still produce unsupported promoted claims.
