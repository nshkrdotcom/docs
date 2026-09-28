#!/usr/bin/env python3
"""Prepare five fresh sealed XML inputs from committed local source; fail closed."""
import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
from docset import PATHS, ROOT, validate


def command(args, cwd=None):
    subprocess.run([str(arg) for arg in args], cwd=cwd, check=True)


def capture(args):
    return subprocess.check_output([str(arg) for arg in args], text=True).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True, help="New directory outside source repositories")
    parser.add_argument("--repomix", default="repomix")
    parser.add_argument("--include-reviewed", action="append", default=[], metavar="SNAPSHOT:RELATIVE_PATH",
                        help="Explicit locally reviewed security exclusion, forwarded to sealer")
    args = parser.parse_args()
    validate(ROOT)
    roots = {name: Path(PATHS[name]).resolve() for name in ("fount", "system_one_sdk", "inference", "agent_session_manager")}
    roots["docset"] = ROOT.resolve()
    if Path(PATHS["docset"]).resolve() != ROOT.resolve():
        raise ValueError("Operational docset alias does not resolve to this canonical docset")
    reviewed = {name: [] for name in roots}
    for item in args.include_reviewed:
        name, sep, rel = item.partition(":")
        if not sep or name not in roots or not rel or Path(rel).is_absolute() or ".." in Path(rel).parts:
            raise ValueError(f"Invalid reviewed path: {item}")
        reviewed[name].append(rel)
    output = args.output.resolve()
    initial_heads = {}
    for root in roots.values():
        repo_root = Path(capture(["git", "-C", root, "rev-parse", "--show-toplevel"])).resolve()
        if output.is_relative_to(repo_root):
            raise ValueError("Packet output must be outside all source repositories")
        if capture(["git", "-C", root, "status", "--porcelain", "--", "."]):
            raise ValueError(f"Commit/reconcile source changes before preparing next baseline: {root}")
        initial_heads[root] = capture(["git", "-C", root, "rev-parse", "HEAD"])
    output.mkdir(parents=True, exist_ok=False)
    manifest = {"format_version": 1, "phase_state": json.loads((ROOT / "state.json").read_text()), "inputs": {}}
    sealer = roots["fount"] / "scripts/seal_handoff_snapshot.py"
    for name, root in roots.items():
        config = ROOT / ("repomix.config.json" if name == "docset" else
                         "templates/FOUNT_REPOMIX_CONFIG.json" if name == "fount" else
                         "templates/DEPENDENCY_REPOMIX_CONFIG.json")
        raw, sealed = output / f"{name}.raw.xml", output / f"{name}.xml"
        command([args.repomix, root, "--config", config, "--output", raw])
        seal_args = [sys.executable, sealer, "--root", root, "--input", raw, "--output", sealed]
        for rel in reviewed[name]:
            seal_args.extend(["--include-reviewed", rel])
        command(seal_args)
        manifest["inputs"][name] = {
            "path": str(sealed), "source_root": str(root),
            "git_commit": capture(["git", "-C", root, "rev-parse", "HEAD"]),
            "sha256": hashlib.sha256(sealed.read_bytes()).hexdigest(),
            "bytes": sealed.stat().st_size, "reviewed_exclusions": reviewed[name],
        }
    for root in roots.values():
        if capture(["git", "-C", root, "status", "--porcelain", "--", "."]):
            raise ValueError(f"Source changed while preparing snapshots: {root}")
        if capture(["git", "-C", root, "rev-parse", "HEAD"]) != initial_heads[root]:
            raise ValueError(f"Source commit changed while preparing snapshots: {root}")
    (output / "PACKET_MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print("Attach exactly these five sealed files:")
    for item in manifest["inputs"].values():
        print(item["path"])
    print(f"Check phase-required inventory before transfer. Packet metadata: {output / 'PACKET_MANIFEST.json'}")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f"ERROR: {error}\nPacket is incomplete; do not attach partial/stale outputs.", file=sys.stderr)
        sys.exit(1)