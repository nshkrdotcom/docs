# 02 — Theory: Grounded Chiral Tensor Synthesis

## 1. Objects

### Evidence atoms

Let an evidence atom be

$$
e_i = (u_i, s_i, t_i, q_i, a_i, m_i)
$$

where:

- $u_i$ is a stable source identifier;
- $s_i$ is a text span, observation, record, or structured datum;
- $t_i$ is the temporal scope;
- $q_i \in [0,1]$ is source/evidence quality;
- $a_i$ is the access path by which the evidence became available;
- $m_i$ is metadata: author, venue, access path, extraction method, provenance, and source role.

The available evidence set is $E = \{e_1,\dots,e_n\}$.

### Record-access states

Let $\Omega_R$ be the universe of records or observations that may be relevant to a case. A record-access state is:

$$
r_k = (id_k, type_k, owner_k, duty_k, expected_k, access_k, production_k, q_k)
$$

where:

- $owner_k$ is the actor controlling or expected to control the record;
- $duty_k \in [0,1]$ estimates whether the record should exist under normal procedure, law, policy, practice, or instrumentation;
- $expected_k \in [0,1]$ estimates expected observability;
- $access_k \in \{\texttt{available}, \texttt{inaccessible}, \texttt{sealed}, \texttt{withheld}, \texttt{destroyed}, \texttt{not\textunderscore{}generated}, \texttt{unknown}\}$;
- $production_k$ describes whether the record was produced, requested, refused, partially produced, contradicted, or unavailable;
- $q_k$ is confidence in the access-state classification.

The record-access state set is $A = \{r_1,\dots,r_m\}$.

### Institutional incentive profile

For an actor $x$, define an institutional incentive profile:

$$
I_x = (role_x, control_x, exposure_x, disclose_x, conceal_x, penalty_x, reliability_x)
$$

where:

- $control_x$ is control over relevant records or testimony;
- $exposure_x$ is expected reputational, legal, financial, operational, or political cost if a claim is true;
- $disclose_x$ is incentive to disclose;
- $conceal_x$ is incentive to withhold, narrow, delay, or frame evidence;
- $penalty_x$ is expected cost of concealment if detected;
- $reliability_x$ is prior source reliability.

Incentive profiles are not truth oracles. They alter source quality, missingness likelihood, and world energy.

### Claims

A claim is

$$
c_j = (p_j, a_j, \rho_j, \kappa_j, \sigma_j)
$$

where $p_j$ is a proposition, $a_j$ is a canonical argument frame, $\rho_j$ is a reference set, $\kappa_j$ is a record-contingency set, and $\sigma_j$ is a status in:

$$
\{\texttt{proven},\texttt{probable},\texttt{plausible},\texttt{record\textunderscore{}contingent},\texttt{conflicted},\texttt{unsupported},\texttt{rejected}\}.
$$

### Relations

Relations among claims are typed:

$$
R \subseteq C \times \{\texttt{supports}, \texttt{refutes}, \texttt{implies}, \texttt{specializes}, \texttt{generalizes}, \texttt{qualifies}, \texttt{depends\textunderscore{}on}, \texttt{independent}\} \times C.
$$

### Rules

A rule is a tuple:

$$
r = (\text{body}, \text{head}, \tau, \lambda, \mathcal{P})
$$

where $\tau$ is temperature, $\lambda$ is rule weight, and $\mathcal{P}$ is a policy tag:

- $\tau \to 0^+$: deductive/proof-carrying rule;
- $\tau > 0$: analogical, probabilistic, abductive, access-state, or soft rule;
- $\mathcal{P}=strict$: cannot be used for promoted strict truth unless it has zero-temperature proof support;
- $\mathcal{P}=likely$: may contribute to posterior likely-truth ranking but not to strict proof.

## 2. Strict proof and likely truth

GCTS separates **strict proof** from **likely truth**.

A strict proof claim must be in zero-temperature closure with resolvable evidence and proof trace. A likely-truth claim may receive high posterior mass across worlds even when strict proof is unavailable, provided the likelihood is produced by explicit evidence, access-state assumptions, source reliability, contradiction structure, and calibrated inference.

The system must never convert “not strictly proven” into “false” or “irrelevant.” It must also never convert “plausible” into “proven.”

## 3. Language–logic–access bundle

Let $L$ be the language/concept manifold, $\mathcal{T}$ be the logic/proof space, and $\mathcal{A}$ be the access/missingness space. A grounding map

$$
G: L \rightarrow \mathcal{T} \times \mathcal{A}
$$

extracts proof-carrying structure and record-access structure from text. A rendering map

$$
S: \mathcal{T} \times \mathcal{A} \rightarrow L
$$

turns structured worlds back into language. Their composition

$$
C = G \circ S: \mathcal{T} \times \mathcal{A} \rightarrow \mathcal{T} \times \mathcal{A}
$$

is the grounding-synthesis closure.

### Orthesis

The orthesis is the stable structured state:

$$
(\mathcal{T}^{\ast},\mathcal{A}^{\ast}) = G(S(\mathcal{T}^{\ast},\mathcal{A}^{\ast})).
$$

It is not an oracle truth. It is the structured state that survives language rendering without losing proof support, likely-truth support, access-state coherence, or explicit uncertainty.

## 4. Chirality

### Round-trip chirality

For a structured state $X=(T,A)$, define:

$$
\delta(X) = d_{\mathcal{T},\mathcal{A}}(X, G(S(X))).
$$

A well-grounded claim has low $\delta$. A semantically fluent but logically or access-structurally unstable narrative has high $\delta$.

### Pairwise chiral tension

For two states $X_A=(T_A,A_A)$ and $X_B=(T_B,A_B)$:

$$
\chi_{AB}^{rt} = \delta(X_A) + \delta(X_B) + \eta \cdot d_{\mathcal{T}}(Cl_0(T_A), Cl_0(T_B)) \cdot E_{AB} + \mu \cdot d_{\mathcal{A}}(A_A,A_B).
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

Let $Y^+$ be support/evidence tensor mass and $Y^-$ be refutation tensor mass over claim/context/evidence/access indices. The contradiction residual is:

$$
R = Y^+ - Y^-.
$$

The residual energy is:

$$
\chi^{res}=\|R\|_F^2.
$$

Large $\chi^{res}$ indicates unresolved chiral conflict.

### Access chirality

Access chirality occurs when the language narrative implies a record state that does not survive structured modeling. For example, “there is no evidence” may translate into multiple distinct states: record not expected, record expected but unavailable, record expected and withheld, record destroyed, or record available but non-supportive.

Define:

$$
\chi^{access}=\sum_{r\in \Omega_R} w_r \cdot d(access_r^{narrative}, access_r^{structured}).
$$

## 5. Absence discipline

GCTS distinguishes:

1. **Absence of evidence:** no available supporting evidence has been found.
2. **Evidence of absence:** a record or observation expected to reveal the fact exists and affirmatively negates it.
3. **Inaccessible evidence:** the record may exist but is not available to the runtime corpus.
4. **Withheld evidence:** non-production is more likely under a withholding world than under a benign-missingness world.
5. **Not-generated evidence:** the record should not be expected to exist.

Absence can penalize a claim only when expected observability, record-generation duty, collection path, and access path justify that penalty.

## 6. Possible worlds / multiverse views

A world view is:

$$
W_k = (F_k, R_k, Z_k, \Pi_k, A_k, M_k, H_k)
$$

where:

- $F_k$ is a set of accepted facts and likely-truth claims;
- $R_k$ is a rule subset;
- $Z_k$ are latent context predicates;
- $\Pi_k$ are proof traces;
- $A_k$ are assumptions;
- $M_k$ is a record-access/missingness model;
- $H_k$ is an institutional-incentive hypothesis set.

A multiverse state is a distribution over worlds:

$$
Q(W_k \mid E,A,I) = \frac{\exp(-\mathcal{E}(W_k;E,A,I))}{\sum_\ell \exp(-\mathcal{E}(W_\ell;E,A,I))}.
$$

The energy function is:

$$
\mathcal{E}(W;E,A,I)=
\lambda_g L_{ground}(W,E)+
\lambda_c L_{contra}(W)+
\lambda_r L_{rule}(W)+
\lambda_p L_{parsimony}(W)+
\lambda_a L_{access}(W,A)+
\lambda_i L_{incentive}(W,I)-
\lambda_s S_{support}(W,E).
$$

Interpretation:

- lower energy worlds are better supported;
- contradictions increase energy;
- unsupported complexity increases energy;
- evidence support decreases energy;
- access-state mismatch increases energy;
- incentive hypotheses affect missingness and source reliability but do not directly prove claims.

## 7. Claim truth ranking

For a claim $c$, define:

$$
P(c \mid E,A,I)=\sum_k Q(W_k\mid E,A,I)\,\mathbf{1}[c \in Cl(W_k)].
$$

This is the CNS likely-truth ranking. It is a calibrated score over structured worlds, not a direct LLM confidence and not limited to zero-temperature proof.

### Strict support mass

$$
P_0(c \mid E)=\sum_k Q(W_k\mid E,A,I)\,\mathbf{1}[c \in Cl_0(W_k)].
$$

$P_0$ tracks strict proof support. $P$ tracks likely truth across admissible strict and soft components.

### Confidence

Define normalized world entropy:

$$
H(Q)=-\sum_k Q(W_k)\log Q(W_k),\quad H_n(Q)=\frac{H(Q)}{\log K}.
$$

Define evidence coverage $Cov(c)$, calibration quality $Cal$, contradiction mass $Con(c)$, and access uncertainty $AccUnc(c)$. Then:

$$
Conf(c)=P(c\mid E,A,I)\cdot Cov(c)\cdot Cal\cdot (1-H_n(Q))\cdot (1-Con(c))\cdot (1-AccUnc(c)).
$$

The system must emit $P(c\mid E,A,I)$, $P_0(c\mid E)$, and $Conf(c)$ separately. A claim can be likely but low-confidence, strictly proven but narrow, or plausible but record-contingent.

## 8. Estimative language mapping

GCTS maps numerical posterior intervals to estimative language:

| Posterior interval | Estimative language |
| ---: | --- |
| 0.00–0.05 | almost certainly false |
| 0.05–0.20 | very unlikely |
| 0.20–0.40 | unlikely |
| 0.40–0.60 | roughly even chance |
| 0.60–0.80 | likely |
| 0.80–0.95 | very likely |
| 0.95–1.00 | almost certain |

This mapping is configurable by domain and should be reported with confidence bands and access-contingency notes.

## 9. Latent context and access resolution

When the residual $R$ remains large, decompose it:

$$
R \approx C \times_1 U_{claim} \times_2 U_{evidence} \times_3 U_{context} \times_4 U_{access}.
$$

The factor $U_{context}$ proposes latent context predicates such as:

- time interval;
- population/subgroup;
- measurement method;
- source perspective;
- mechanism;
- jurisdiction;
- operational condition.

The factor $U_{access}$ proposes access predicates such as:

- record expected but inaccessible;
- record expected but not produced;
- record controlled by actor with adverse incentive;
- record not generated under ordinary process;
- record produced but non-supportive;
- source has asymmetric access to decisive evidence.

A latent predicate or access predicate is promoted only if:

1. it reduces residual energy on held-out examples;
2. it is grounded in available evidence or explicit access-state metadata;
3. it does not increase unsupported complexity beyond an MDL threshold;
4. it improves calibration or top-K world coverage;
5. it does not bypass the oracle boundary.

## 10. Oracle boundary theorem sketch

### Claim

If all strict promoted claims must be in $Cl_0(W_k)$ for some world $W_k$ with resolvable evidence references, and all likely-truth claims must be ranked through calibrated world posterior rather than direct label lookup, then no runtime oracle is required for strict promotion or likely-truth ranking.

### Conditions

- Rules are monotone and stratified where strict.
- All strict rules use $\tau \to 0^+$.
- Evidence references resolve in the runtime corpus.
- Likely-truth scoring uses runtime evidence, access states, source reliability, and calibrated parameters only.
- Promotion requires proof trace for strict status and posterior/confidence threshold for likely status.

### Sketch

At zero temperature, tensor closure is equivalent to deterministic rule firing over finite evidence atoms. A strict promoted claim must appear in the closure of at least one world with evidence support. Likely-truth ranking then sums posterior mass across worlds using a fixed scoring function. The oracle can calibrate the scoring function offline but cannot introduce a promoted atom or directly set posterior mass at runtime unless the runtime state contains the corresponding evidence, access, rule, or world structure.

## 11. Uncertainty decomposition

GCTS separates:

- **Aleatory uncertainty:** evidence genuinely supports multiple incompatible worlds.
- **Epistemic uncertainty:** the system lacks enough evidence or calibrated model support.
- **Access uncertainty:** the relevant record state is unknown, inaccessible, or controlled.
- **Suppression uncertainty:** non-production may be strategic rather than benign.
- **Model uncertainty:** validators disagree or extraction confidence is unstable.
- **Source uncertainty:** evidence source quality or provenance is weak.

Each SynthesisReport should include these categories.

## 12. Theory falsifiability

The theory is falsified or weakened if:

- chirality does not predict synthesis difficulty;
- posterior world distributions are not calibratable;
- latent context decomposition does not recover planted hidden modifiers in synthetic data;
- access-state modeling does not improve ranking in planted missing-record tasks;
- RAG/debate baselines match or exceed GCTS on grounding, calibration, likely-truth ranking, and abstention with lower complexity;
- strict zero-temperature proof paths still produce unsupported promoted claims.
