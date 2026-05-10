from __future__ import annotations

from cns_types import WorldView, ProofTrace
from worlds import normalize_worlds, world_energy, claim_posterior, normalized_entropy, confidence


def main():
    # Toy contradiction: X works for older adults, not younger adults.
    # World W1 introduces an age-context predicate and therefore has low contradiction.
    # World W2 overgeneralizes and remains contradictory.
    w1 = WorldView(
        id="W_age_context",
        facts=["works(X,Y,age_over_65)", "not_works(X,Y,age_under_40)"],
        latent_contexts=["age_group"],
        proofs=[ProofTrace(id="P1", claim_id="works(X,Y,age_over_65)", rule_ids=["R_direct"], evidence_refs=["E1"])],
    )
    w1.energy = world_energy(
        support_score=0.90,
        grounding_loss=0.05,
        contradiction_energy=0.05,
        rule_loss=0.05,
        parsimony_penalty=0.20,
    )

    w2 = WorldView(
        id="W_overgeneralized",
        facts=["works(X,Y)", "not_works(X,Y)"],
        latent_contexts=[],
    )
    w2.energy = world_energy(
        support_score=0.65,
        grounding_loss=0.10,
        contradiction_energy=0.80,
        rule_loss=0.10,
        parsimony_penalty=0.00,
    )

    worlds = normalize_worlds([w1, w2])
    ent = normalized_entropy(worlds)

    for w in worlds:
        print(f"{w.id}: energy={w.energy:.3f} posterior={w.posterior:.3f} contexts={w.latent_contexts}")

    c = "works(X,Y,age_over_65)"
    p = claim_posterior(c, worlds)
    conf = confidence(p, coverage=1.0, calibration=0.9, entropy=ent, contradiction_mass=0.05)
    print(f"Claim posterior for {c}: {p:.3f}; confidence={conf:.3f}; entropy={ent:.3f}")

if __name__ == "__main__":
    main()
