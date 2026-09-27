# Phase 2 post-QC sealed packet

The four source exports were regenerated from the post-QC checkouts with the repository and docset Repomix configurations in document 35, then sealed with `scripts/seal_handoff_snapshot.py`. Raw XMLs are intermediate only. The packet is stored at `/tmp/fount-p2-packet/`; `packet.sha256` there gives all four final attachment byte hashes.

| Sealed XML | Source commit in index | Files | Bytes | SHA-256 |
|---|---|---:|---:|---|
| `fount.xml` | `08c2c44f150253ce4238b0bfb3b0a15190bdb2d9` | 428 | 1,804,835 | `b3059fc80523718defb7d2c12816fb6c1c083302fa8100a7c28ba88788f95ac2` |
| `system_one_sdk.xml` | `e757598a89e549274b979f0e77c6a4b2b6667752` | 247 | 932,265 | `201b360711ea6d73702f2cfe8b2bf3589e084877373ad28fc2090c4b3bceee54` |
| `inference.xml` | `3750a03ec62a3c9da11be9caa4dc911ebbbb9801` | 68 | 316,801 | `02ff7b83f9f3008a2165447f7e6321b13c76caddf86b2e710654f8adced12686` |
| `docset.xml` | Final docset QC commit in its `snapshot_index` | See external `packet.sha256` | See external `packet.sha256` | See external `packet.sha256` |

The Fount, SDK and Inference sealers reported clean source worktrees. The SDK raw export excluded `packages/system_one_sdk/test/system_one_sdk/client_configuration_test.exs` under its credential heuristic. The current file was re-read: its `example.test` URLs and literal `key`, `secret`, `token`, and `configured` values are dummy rejection fixtures; no real endpoint or credential was present. The SDK seal used only the explicit `--include-reviewed` option for that path and indexed the exact bytes. No security scanner was disabled. The changed Repomix file counts versus historical exports reflect the current configured source selection; neither historical export is asserted to be a current seal. Fount decorative SVGs remain in the repository and are excluded by its Repomix configuration.

The seal tool verified source byte SHA-256, lengths, modes, safe paths and XML roundtrip for every indexed file. Final post-seal validation and the docset commit are also recorded in the external `/tmp/fount-p2-packet/packet-record.json`, avoiding a self-reference in this committed docset. No build output, secret environment file, database dump, generated docs, package tar or live response log was included.
