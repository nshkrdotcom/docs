# 04 — Mathematical Specification

## 1. Spaces and maps

Let $L$ be a language manifold or representation space.

Let $\mathcal{T}$ be a tensor-logic space containing atoms, predicates, rules, proof traces, and constraint states.

Let:

$$
G: L \to \mathcal{T}
$$

be grounding, and:

$$
S: \mathcal{T} \to L
$$

be synthesis/rendering.

The closure map in logic space is:

$$
C = G \circ S: \mathcal{T} \to \mathcal{T}
$$

The CNS loop searches for stable structured states under $C$, subject to evidence and proof constraints.

## 2. Fiber-bundle interpretation

For each language state $l \in L$, let $\mathcal{T}_l$ be the fiber of admissible logical interpretations over $l$. The total space is:

$$
B = \{(l,t): l\in L,\ t\in \mathcal{T}_l\}
$$

with projection $\pi:B\to L$.

A CNS narrative path is a path through $B$, not only through $L$. Chirality appears when language movement and logic movement fail to commute.

## 3. Curvature / holonomy diagnostic

Let $\Gamma$ be a closed dialectical loop:

$$
T_0 \xrightarrow{S} L_0
\xrightarrow{\text{antagonist/reframe}} L_1
\xrightarrow{G} T_1
\xrightarrow{\text{proof closure}} T_2
\xrightarrow{S} L_2
\xrightarrow{G} T_3
$$

The holonomy residual is:

$$
\mathrm{Hol}(\Gamma) = \|T_3 - T_0\|_\Omega
$$

A large holonomy residual marks unstable narrative transport.

## 4. Zero-temperature closure

Let $F$ be grounded facts and $R_0$ be zero-temperature rules. A rule $r$ has the form:

$$
Y[\mathbf{i}] = \operatorname{step}\left(\sum_{\mathbf{j}} \prod_k X_k[\mathbf{i}_k,\mathbf{j}_k]\right)
$$

The closure is the least fixed point:

$$
Cl_0(F;R_0)= \mu X.\; F \cup \bigcup_{r\in R_0} r(X)
$$

Assumptions for soundness:

- monotone rules;
- no unsafe negation;
- all variables range over finite domains;
- all premises originate from grounded evidence or previously derived proof atoms.

## 5. Soundness sketch

If $R_0$ is monotone and every rule application records a proof trace, then every atom in $Cl_0(F;R_0)$ is reachable by finite rule applications from grounded facts. Unsupported atoms cannot be promoted because promotion requires a proof trace rooted in $F$.

This gives zero-temperature hallucination rate:

$$
\mathrm{ZTHR}=
\frac{
|\{c \in C_{\mathrm{strict}}: \neg \exists \pi(c)\}|
}{
|C_{\mathrm{strict}}|+\epsilon
}
$$

Target: $\mathrm{ZTHR}=0$.

## 6. Residual contradiction tensor

Let $X,Y,Z,C$ be subject, predicate, object, and context index sets. Define residual tensor:

$$
R[x,y,z,c] =
m_{\mathrm{support}}[x,y,z,c] -
m_{\mathrm{refute}}[x,y,z,c]
$$

or, for unresolved mass:

$$
R_{\mathrm{unres}}[x,y,z,c]
=
\min(m_{\mathrm{support}}, m_{\mathrm{refute}})
\cdot (1 - m_{\mathrm{resolved}})
$$

This tensor identifies where proof closure cannot settle support/refute conflict.

## 7. Predicate invention by factorization

A low-rank approximation:

$$
R_{\mathrm{unres}}
\approx
\mathcal{C}
\times_1 M_X
\times_2 M_Y
\times_3 M_Z
\times_4 M_C
$$

proposes latent factors. A latent context predicate $\lambda_k$ is accepted only if it improves residual energy while passing evidence gates:

$$
\mathrm{PIU}(\lambda_k)
=
\frac{
E_R(\text{before}) - E_R(\text{after})
}{
\mathrm{Complexity}(\lambda_k)+1
}
$$

Acceptance requires:

$$
\mathrm{PIU} > \theta_{\mathrm{PIU}}
\quad \land \quad
\mathrm{GroundingScore}(\lambda_k) \geq \theta_G
$$

## 8. Multiverse views as auxiliary posterior

Possible worlds $W_i$ are candidate structured states containing facts, predicates, access assumptions, and proof status. They are ranked after synthesis constraints are applied:

$$
P(W_i\mid E,A) \propto
P(E\mid W_i,A)P(W_i)\exp(-\alpha E_R(W_i)-\beta \chi_{LL}(W_i))
$$

World posterior mass reports uncertainty. It does not replace the synthesis operator.

## 9. Calibration

For confidence bins $B_m$:

$$
\mathrm{ECE}=
\sum_m
\frac{|B_m|}{n}
|\mathrm{acc}(B_m)-\mathrm{conf}(B_m)|
$$

CNS reports ECE for promoted strict claims, likely claims, and latent-predicate proposals separately.

## 10. Orthesis acceptance

A synthesized SNO is accepted as an orthesis candidate when:

$$
\mathrm{CitationValidity}=1
$$

$$
\mathrm{MeanEntailment}\geq \theta_E
$$

$$
\mathrm{ZTHR}=0
$$

$$
\chi_{LL}\leq \theta_{\chi}
$$

$$
E_R \leq \theta_R
$$

$$
\Delta \beta_1 \geq \theta_\beta \quad \text{or residual contradiction is explicitly preserved}
$$
