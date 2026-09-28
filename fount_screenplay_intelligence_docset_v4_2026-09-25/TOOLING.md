# Docset and packet tools

Tools require Python 3.10+ and use the standard library. They manage documentation and transport; they do not run or certify Elixir. Invoke them from the docset directory or by absolute path.

The tooling behavior checks run with `PYTHONDONTWRITEBYTECODE=1 python3 scripts/test_docset.py`. They exercise automatic routing, missing evidence, phase order, completed-plan termination, complete reproducible ZIPs, integrity drift, broken links, retained docset paths and exclusion/preservation of generated Repomix exports using temporary copies. They do not mutate real phase state or fabricate runtime evidence.

```bash
cd /home/home/jb/docs/20260928/fount
python3 scripts/docset.py refresh
python3 scripts/docset.py validate
python3 scripts/docset.py next
```

Agents edit `state.json`, evidence and traceability, then refresh. Validation checks ordered six-phase state and active spec paths, required evidence references, absolute paths in handoffs, relative Markdown links, valid JSON, exact generated current views and a complete file hash inventory. A completed phase needs a real runtime report, a verified code commit and `required_gates_passed: true`. That flag is the runtime agent's attestation; validation cannot prove tests were run. Read the evidence.

Generate the complete revised docset ZIP outside the tree, substituting the selected phase number:

```bash
python3 scripts/docset.py zip --output /tmp/fount_run_phase_01_docset.zip
```

The output must not already exist. Archive members begin with `fount/` and contain the entire current source/evidence docset. ZIP metadata is fixed for repeatability. `SHA256SUMS.txt` covers every included file except itself. Existing root `docset.raw.xml` and `docset.xml` exports are preserved on disk but excluded from Git, hashes and ZIPs; regenerate them from current source before sending them to web chat. Other generated XML/ZIP/build files do not belong inside this docset. The integrity check detects omitted, added or changed source/evidence files, including old handoffs. Refresh rejects deleted/renamed paths from the previous inventory: retain superseded documents at their original paths with a pointer, and never replace the inventory to hide a deletion.

The web agent builds its code overlay using the current source's `handoff/apply_overlay.py` contract described in `HANDOFF_PROTOCOL.md`; there is no second competing overlay format here. Copy the exact overlay manifest into `handoffs/PHASE_NN_OVERLAY_MANIFEST.json` as evidence so runtime can verify the user-applied state without an archive metadata file being installed into source.

After local commits, prepare next inputs:

```bash
python3 /home/home/jb/docs/20260928/fount/scripts/prepare_inputs.py --output /tmp/fount-run-next-inputs
```

The directory must be new. The command runs Repomix five times and the existing Fount sealer five times, refusing dirty in-scope source, unsafe destination placement or any failure. Raw XMLs and `PACKET_MANIFEST.json` stay local; upload the five sealed `fount.xml`, `system_one_sdk.xml`, `inference.xml`, `agent_session_manager.xml`, `docset.xml`. Every packet is fresh; never reuse pre-QC Fount XML.

The Fount snapshot config here includes `apps/**`, `config/**` and repository docs as well as packages, covering the planned host and its runtime configuration. Dependency config includes all text source/fixture/build files except explicit generated/credential exclusions. Review Repomix security exclusions and required inventories; no packaging tool can infer all sources needed for a phase. For an inspected harmless fixture exclusion, pass `--include-reviewed system_one_sdk:relative/path` (repeatable, other snapshot names allowed). This is a conscious exception by the runtime agent, not an automatic allowlist. Use a new output directory after a failed packet attempt.

In web chat, the runtime paths normally do not exist. Extract inputs to a sandbox, preserve exact bytes/modes from snapshot metadata, and use `scripts/docset.py --root` against the extracted docset when necessary. `prepare_inputs.py` is for the local runtime machine only. Preserve canonical destination paths in state and handoffs even while editing extracted files.