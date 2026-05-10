# Appendix — Extended Formal Definitions

## Claim universe

Let \(\Omega_C\) be the finite set of claims in a run. Let \(\Omega_E\) be evidence atoms and \(\Omega_Z\) latent contexts. A world is a binary assignment:

\[
w: \Omega_C \times \Omega_Z \to \{0,1\}
\]

plus proof metadata. The same claim can have different truth status under different contexts.

## Evidence likelihood

For claim \(c\) and evidence \(e\):

\[
\ell(e,c)=q(e)\left[P_{entail}(c,e)-P_{contradict}(c,e)\right]
\]

Support score for world \(W\):

\[
S(W,E)=\sum_{c\in W}\sum_{e\in refs(c)} \max(0,\ell(e,c)).
\]

Contradiction loss:

\[
L_{contra}(W)=\sum_{c_i,c_j\in W} I[c_i \bot c_j] \cdot \min(q_i,q_j).
\]

Grounding loss:

\[
L_{ground}(W,E)=\sum_{c\in W} I[refs(c)=\emptyset] + \sum_{r\in refs(c)} I[not\ resolved(r)].
\]

Parsimony penalty:

\[
L_{parsimony}(W)=\alpha |A_W| + \beta |Z_W| + \gamma \sum_{z\in Z_W} complexity(z).
\]

## Claim status map

- `proven`: zero-temperature proof and posterior/confidence above strict threshold.
- `probable`: posterior high, evidence grounded, but not strict proof.
- `plausible`: soft support or lower confidence.
- `conflicted`: substantial posterior mass in conflicting worlds.
- `unsupported`: insufficient evidence or invalid references.
- `rejected`: strong refuting evidence or contradiction under strict rules.
