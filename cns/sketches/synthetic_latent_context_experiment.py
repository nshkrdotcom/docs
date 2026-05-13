from __future__ import annotations

try:
    from cns_types import ProofTrace, WorldView
    from worlds import claim_posterior, confidence, normalize_worlds, normalized_entropy, strict_support
except ImportError:  # pragma: no cover
    from .cns_types import ProofTrace, WorldView
    from .worlds import claim_posterior, confidence, normalize_worlds, normalized_entropy, strict_support


def main() -> None:
    # Toy contradiction: X works for older adults, not younger adults.
    # World W1 introduces an age-context predicate and therefore has low contradiction.
    # World W2 overgeneralizes and remains contradictory.
    w1 = WorldView(
        id="W1",
        facts=["works(X,Y,age_over_65)", "not_works(X,Y,age_under_40)"],
        latent_contexts=["age_group"],
        proofs=[ProofTrace(id="P1", claim_id="works(X,Y,age_over_65)", rule_ids=["R_direct"], evidence_refs=["E1"])],
        energy=0.5,
        contradiction_energy=0.1,
    )
    w2 = WorldView(
        id="W2",
        facts=["works(X,Y)", "not_works(X,Y)"],
        energy=2.5,
        contradiction_energy=2.0,
    )
    worlds = normalize_worlds([w1, w2])
    ent = normalized_entropy(worlds)
    c = "works(X,Y,age_over_65)"
    p = claim_posterior(c, worlds)
    p0 = strict_support(c, worlds)
    conf = confidence(p, coverage=1.0, calibration=0.9, entropy=ent, contradiction_mass=0.05)
    print({"claim": c, "posterior": round(p, 3), "strict_support": round(p0, 3), "confidence": round(conf, 3)})


if __name__ == "__main__":
    main()
