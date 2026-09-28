#!/usr/bin/env python3
"""Validate and package the complete Fount Run docset using only Python stdlib."""
import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATED_EXPORTS = {"docset.raw.xml", "docset.xml"}
PHASE_SPECS = [
    "phases/01_CORE_APPROVAL_SAFETY.md",
    "phases/02_RUN_FOUNDATION.md",
    "phases/03_DURABLE_EXECUTION.md",
    "phases/04_SCREENPLAY_PIPELINE.md",
    "phases/05_CONTROL_AND_COMPLETION.md",
    "phases/06_WEB_APP_AND_INTEGRATION.md",
]
STATES = {"NOT_STARTED", "OFFLINE_IMPLEMENTED", "QC_IN_PROGRESS", "QC_FAILED", "COMPLETE"}
PATHS = {
    "fount": "/home/home/p/g/n/fount",
    "docset": "/home/home/jb/docs/20260928/fount",
    "docset_canonical": "/home/home/p/g/n/brainstorms/nshkrdotcom/docs/20260928/fount",
    "docset_git_root": "/home/home/p/g/n/brainstorms",
    "system_one_sdk": "/home/home/p/g/n/system_one_sdk",
    "inference": "/home/home/p/g/n/inference",
    "agent_session_manager": "/home/home/p/g/n/agent_session_manager",
}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def files(root):
    result = []
    for path in sorted(root.rglob("*")):
        rel = path.relative_to(root)
        if any(part in {".git", "__pycache__"} for part in rel.parts):
            continue
        if rel.as_posix() in GENERATED_EXPORTS:
            continue
        require(not path.is_symlink(), f"Docset symlink is not supported: {rel}")
        if path.is_file():
            require(path.suffix not in {".zip", ".xml", ".pyc"}, f"Generated output inside docset: {rel}")
            result.append(path)
    return result


def local_file(root, name):
    require(isinstance(name, str) and name, "Missing evidence/phase filename")
    rel = Path(name)
    require(not rel.is_absolute() and ".." not in rel.parts, f"Unsafe relative path: {name}")
    path = root / rel
    require(path.is_file(), f"Missing file: {name}")
    return path


def read_state(root):
    state = json.loads((root / "state.json").read_text())
    require(state["format_version"] == 1, "Unknown state format")
    require(state["paths"] == PATHS, "Runtime paths differ from the handoff contract")
    phases = state["phases"]
    require([p["id"] for p in phases] == [1, 2, 3, 4, 5, 6], "Exactly six ordered phases required")
    require([p["spec"] for p in phases] == PHASE_SPECS, "Active phase specs must match the six-phase plan")
    pending = None
    for phase in phases:
        status = phase["status"]
        require(status in STATES, f"Invalid phase status: {status}")
        local_file(root, phase["spec"])
        if pending is not None:
            require(status == "NOT_STARTED", "A later phase started before the current phase completed")
        elif status != "COMPLETE":
            pending = phase
        if status != "NOT_STARTED":
            for key in ("offline_handoff", "qc_handoff", "overlay_manifest"):
                path = local_file(root, phase.get(key))
                if key != "overlay_manifest":
                    body = path.read_text()
                    require(all(v in body for v in PATHS.values()), f"Incomplete absolute paths in {path.name}")
            json.loads(local_file(root, phase["overlay_manifest"]).read_text())
        if status in {"QC_FAILED", "COMPLETE"}:
            report = local_file(root, phase.get("runtime_report")).read_text()
            require(all(v in report for v in PATHS.values()), "Runtime report is missing absolute paths")
        if status == "COMPLETE":
            require(re.fullmatch(r"(?:[0-9a-f]{40}|[0-9a-f]{64})", phase.get("verified_code_commit") or ""), "Missing verified code commit")
            require(phase.get("required_gates_passed") is True, "Required runtime gates not attested")
    return state, pending


def views(state, pending):
    lines = ["# Progress", "", "Generated from `state.json`; agents update state, then run `scripts/docset.py refresh`.", "",
             "| Phase | Work | Status | Runtime evidence |", "| --- | --- | --- | --- |"]
    for p in state["phases"]:
        evidence = f"[{p['runtime_report']}]({p['runtime_report']})" if p.get("runtime_report") else "Not executed"
        lines.append(f"| {p['id']:02d} | [{p['title']}]({p['spec']}) | `{p['status']}` | {evidence} |")
    if pending:
        role = "Web implementation (local agent prepares inputs)" if pending["status"] == "NOT_STARTED" else "Local runtime QC / repair"
        action = f"Phase {pending['id']:02d}: {role}."
    else:
        action = "All six phases are complete. There is no next implementation phase."
    lines += ["", f"**Next action:** {action}", "", "Source-only work never counts as runtime certification.", ""]
    handoff = ["# Current handoff", "", "Generated from `state.json`. Read `AGENT_START_HERE.md` and the selected phase before acting.", "",
               "## Runtime destinations", ""]
    handoff += [f"- {key}: `{value}`" for key, value in PATHS.items()]
    handoff += ["", "## Next action", "", action, ""]
    if pending:
        n = pending["id"]
        handoff += [f"Read [{pending['spec']}]({pending['spec']}). Current status: `{pending['status']}`.", ""]
        if pending["status"] == "NOT_STARTED":
            handoff += [
                "Local agent: validate this docset, verify prior QC evidence and prepare five fresh sealed XMLs with `scripts/prepare_inputs.py`. Record the packet manifest and attachment paths. Stop after preparing the packet.", "",
                "Web chat: inspect the Repomix XML inputs `fount.xml`, `system_one_sdk.xml`, `inference.xml`, `agent_session_manager.xml`, and this complete docset as `docset.xml`. You have no Elixir. Create/edit code, tests and docs for only this phase, inspect/package them, and leave application runtime checks NOT_RUN for the local agent.", "",
                f"Return `fount_run_phase_{n:02d}_overlay.zip`, `fount_run_phase_{n:02d}_docset.zip`, and `PHASE_{n:02d}_RUNTIME_QC_HANDOFF.md`. Include the latter under `handoffs/` in the complete docset. Copy all runtime destinations above into it. Set state to OFFLINE_IMPLEMENTED, refresh/validate and stop.", ""]
        else:
            handoff += [
                f"Runtime agent: follow [{pending['qc_handoff']}]({pending['qc_handoff']}). The user has already applied both ZIPs, committed and pushed the Fount and docset repositories. Verify their installed result; do not reapply either ZIP or ask the user to edit the docset. Run and repair this phase's required gates using RUNTIME_QC.md.", "",
                "Record exact executed evidence, verified code commit and all runtime destinations in the QC report. Complete only after required gates pass. Update state/traceability, refresh/validate, commit and push code/docs, then prepare the next five XMLs from corrected committed source. Stop after that handoff. Web chat must not start a later phase while this one awaits QC.", ""]
    else:
        handoff += ["Report final verified code/docset revisions, delivered app and actual engineering evidence. Preserve all handoffs and optional validation limitations. No further phase is queued.", ""]
    return {"PROGRESS.md": "\n".join(lines), "NEXT_HANDOFF.md": "\n".join(handoff)}


def sums(root):
    return "".join(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(root).as_posix()}\n"
                   for p in files(root) if p.name != "SHA256SUMS.txt")


def preserve_inventory(root):
    """A complete overlay ZIP cannot remove old paths on the receiving host."""
    inventory = root / "SHA256SUMS.txt"
    if not inventory.exists():
        return
    current = {p.relative_to(root).as_posix() for p in files(root)}
    for line in inventory.read_text().splitlines():
        digest, separator, name = line.partition("  ")
        require(separator and re.fullmatch(r"[0-9a-f]{64}", digest), "Malformed prior integrity inventory")
        require(name in current, f"Docset deletion/rename is forbidden: retain {name}")


def validate(root):
    state, pending = read_state(root)
    for name, body in views(state, pending).items():
        require((root / name).read_text() == body, f"Stale generated view: {name}; run refresh")
    require((root / "SHA256SUMS.txt").read_text() == sums(root), "Stale or incomplete SHA256SUMS.txt; run refresh after review")
    for path in files(root):
        if path.suffix == ".json":
            json.loads(path.read_text())
        if path.suffix == ".md":
            for target in re.findall(r"\]\(([^)]+)\)", path.read_text()):
                if target.startswith(("/", "#", "http:", "https:", "mailto:")):
                    continue
                target = target.split("#", 1)[0]
                if target:
                    require((path.parent / target).exists(), f"Broken link in {path.name}: {target}")
    return state, pending


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["refresh", "validate", "next", "zip"])
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    root = args.root.resolve()
    state, pending = read_state(root)
    if args.command == "refresh":
        preserve_inventory(root)
        for name, body in views(state, pending).items():
            (root / name).write_text(body)
        (root / "SHA256SUMS.txt").write_text(sums(root))
    validate(root)
    if args.command == "next":
        print((root / "NEXT_HANDOFF.md").read_text())
    elif args.command == "zip":
        require(args.output is not None, "zip needs --output outside the docset")
        output = args.output.resolve()
        require(not output.is_relative_to(root), "Archive must be outside docset")
        output.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(output, "x", compression=zipfile.ZIP_DEFLATED) as archive:
            for path in files(root):
                info = zipfile.ZipInfo("fount/" + path.relative_to(root).as_posix(), (2026, 9, 28, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = (0o100644 << 16)
                archive.writestr(info, path.read_bytes())
        print(f"{output} sha256={hashlib.sha256(output.read_bytes()).hexdigest()}")
    else:
        print(f"Docset {args.command}: OK ({len(files(root))} files)")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, OSError, json.JSONDecodeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)