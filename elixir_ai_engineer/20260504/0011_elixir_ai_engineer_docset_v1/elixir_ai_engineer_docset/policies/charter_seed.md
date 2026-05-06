# Charter Seed

## Non-negotiable invariants

1. Every governed operation carries an `ExecutionContext`.
2. No untrusted execution environment receives raw credential material.
3. No credentialed effect occurs without a non-exportable `CredentialLease`.
4. No connector may redeem a lease not issued to it.
5. No external effect occurs without a declared effect.
6. No public operation exists without a contract.
7. No GenServer exists without state, lifecycle, concurrency, or external resource justification.
8. No behaviour exists without multiple implementations or a declared boundary seam.
9. No lower layer may silently widen authority inherited from a parent SpecCell.
10. Every accepted code artifact must trace to a spec fragment or generated support role.
