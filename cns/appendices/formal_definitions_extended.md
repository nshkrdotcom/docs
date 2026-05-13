# Appendix — Extended Formal Definitions

## Claim universe

Let $\Omega_C$ be the finite set of claims in a run. Let $\Omega_E$ be evidence atoms, $\Omega_Z$ latent contexts, and $\Omega_A$ access states. A world is a binary or probabilistic assignment:

$$
w: \Omega_C \times \Omega_Z \times \Omega_A \to \{0,1\}
$$

plus proof metadata and access metadata. The same claim can have different truth status under different contexts and record-access states.

## Evidence likelihood

For claim $c$ and evidence $e$:

$$
\ell(e,c)=q(e)\left[P_{entail}(c,e)-P_{contradict}(c,e)\right]
$$

Support score for world $W$:

$$
S(W,E)=\sum_{c\in W}\sum_{e\in refs(c)} \max(0,\ell(e,c)).
$$

Contradiction loss:

$$
L_{contra}(W)=\sum_{c_i,c_j\in W} I[c_i \bot c_j] \cdot \min(q_i,q_j).
$$

Grounding loss:

$$
L_{ground}(W,E)=\sum_{c\in W} I[refs(c)=\emptyset \land strict(c)] + \sum_{r\in refs(c)} I[not\ resolved(r)].
$$

Parsimony penalty:

$$
L_{parsimony}(W)=\alpha |A_W| + \beta |Z_W| + \gamma \sum_{z\in Z_W} complexity(z).
$$

## Access loss

For expected record $r$ under world $W$:

$$
L_{access}(W,A)=\sum_{r\in \Omega_R} duty(r)\cdot expected(r)\cdot d(access_r^W, access_r^{obs}).
$$

## Incentive loss

For actor $x$ in world $W$:

$$
L_{incentive}(W,I)=\sum_x control_x \cdot exposure_x \cdot mismatch(missingness_x^W, incentive_x).
$$

This term affects likelihood of missingness and source reliability. It is not direct truth evidence.

## Claim posterior

$$
P(c \mid E,A,I)=\sum_k Q(W_k\mid E,A,I)\mathbf{1}[c\in Cl(W_k)].
$$

## Strict support mass

$$
P_0(c \mid E)=\sum_k Q(W_k\mid E,A,I)\mathbf{1}[c\in Cl_0(W_k)].
$$

## Claim status map

- `proven`: zero-temperature proof and posterior/confidence above strict threshold.
- `probable`: posterior high, evidence/access model grounded, but not strict proof.
- `plausible`: soft support or lower confidence.
- `record_contingent`: material posterior depends on unavailable, withheld, sealed, destroyed, or otherwise access-limited records.
- `conflicted`: substantial posterior mass in conflicting worlds.
- `unsupported`: insufficient evidence or invalid references, with no strong record-contingency basis.
- `rejected`: strong refuting evidence, evidence of absence, or contradiction under strict rules.
