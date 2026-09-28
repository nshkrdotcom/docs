"""Behavior checks for automatic phase routing and complete docset transport."""
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

sys.dont_write_bytecode = True
from docset import GENERATED_EXPORTS, PATHS, ROOT


class DocsetTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.parent = Path(self.temp.name)
        self.root = self.parent / "fount"
        shutil.copytree(ROOT, self.root, ignore=shutil.ignore_patterns("__pycache__"))

    def run_tool(self, command, *extra, success=True):
        result = subprocess.run(
            [sys.executable, self.root / "scripts/docset.py", command, "--root", self.root, *map(str, extra)],
            capture_output=True, text=True,
        )
        self.assertEqual(result.returncode == 0, success, result.stdout + result.stderr)
        return result

    def state(self):
        return json.loads((self.root / "state.json").read_text())

    def save(self, state):
        (self.root / "state.json").write_text(json.dumps(state, indent=2) + "\n")

    def report(self, name):
        # Test-only evidence, never installed into the real docset.
        (self.root / name).write_text("Test fixture only.\n" + "\n".join(PATHS.values()) + "\n")

    def test_initial_route_and_integrity_detects_changed_or_extra_file(self):
        # Exercise the pristine six-phase route independently of the real docset's
        # current delivery state. Historical handoff files may remain in the tree.
        state = self.state()
        phase = state["phases"][0]
        phase.update(
            status="NOT_STARTED",
            offline_handoff=None,
            qc_handoff=None,
            overlay_manifest=None,
            runtime_report=None,
            verified_code_commit=None,
            required_gates_passed=False,
        )
        for later in state["phases"][1:]:
            later.update(
                status="NOT_STARTED",
                offline_handoff=None,
                qc_handoff=None,
                overlay_manifest=None,
                runtime_report=None,
                verified_code_commit=None,
                required_gates_passed=False,
            )
        self.save(state)
        self.run_tool("refresh")
        handoff = self.run_tool("next").stdout
        self.assertIn("Phase 01: Web implementation", handoff)
        self.assertIn("phases/01_CORE_APPROVAL_SAFETY.md", handoff)
        self.assertNotIn("phases/01_FOUNDATION.md", handoff)
        (self.root / "PRODUCT.md").write_text("Changed product\n")
        self.run_tool("validate", success=False)
        self.run_tool("refresh")
        (self.root / "unrecorded.md").write_text("Unrecorded\n")
        self.run_tool("validate", success=False)

    def test_pending_qc_routes_to_runtime_and_requires_absolute_destinations(self):
        state = self.state()
        phase = state["phases"][0]
        phase.update(status="OFFLINE_IMPLEMENTED", offline_handoff="handoffs/test_offline.md",
                     qc_handoff="handoffs/test_qc.md", overlay_manifest="handoffs/test_manifest.json")
        for later in state["phases"][1:]:
            later.update(
                status="NOT_STARTED",
                offline_handoff=None,
                qc_handoff=None,
                overlay_manifest=None,
                runtime_report=None,
                verified_code_commit=None,
                required_gates_passed=False,
            )
        self.report(phase["offline_handoff"])
        self.report(phase["qc_handoff"])
        (self.root / phase["overlay_manifest"]).write_text('{"format_version":1,"files":[],"deletions":[]}\n')
        self.save(state)
        self.run_tool("refresh")
        self.assertIn("Phase 01: Local runtime QC / repair", self.run_tool("next").stdout)
        (self.root / phase["qc_handoff"]).write_text("Missing runtime paths\n")
        self.run_tool("refresh", success=False)

    def test_phase_cannot_skip_incomplete_predecessor(self):
        state = self.state()
        state["phases"][0].update(
            status="NOT_STARTED",
            offline_handoff=None,
            qc_handoff=None,
            overlay_manifest=None,
            runtime_report=None,
            verified_code_commit=None,
            required_gates_passed=False,
        )
        state["phases"][1]["status"] = "COMPLETE"
        self.save(state)
        self.run_tool("refresh", success=False)

    def test_rejects_obsolete_four_phase_state_or_spec(self):
        current = self.state()
        obsolete = dict(current, phases=current["phases"][:4])
        self.save(obsolete)
        self.assertIn("six ordered phases", self.run_tool("refresh", success=False).stderr)
        current["phases"][0]["spec"] = "phases/01_FOUNDATION.md"
        self.save(current)
        self.assertIn("Active phase specs", self.run_tool("refresh", success=False).stderr)

    def test_completion_requires_evidence_and_advances_then_terminates(self):
        state = self.state()
        for phase in state["phases"]:
            phase.update(
                status="NOT_STARTED",
                offline_handoff=None,
                qc_handoff=None,
                overlay_manifest=None,
                runtime_report=None,
                verified_code_commit=None,
                required_gates_passed=False,
            )
        state["phases"][0]["status"] = "COMPLETE"
        self.save(state)
        self.run_tool("refresh", success=False)
        for index, phase in enumerate(state["phases"]):
            name = f"handoffs/test_runtime_{index}.md"
            self.report(name)
            phase.update(status="COMPLETE", runtime_report=name,
                         offline_handoff=name, qc_handoff=name,
                         overlay_manifest=f"handoffs/test_manifest_{index}.json",
                         verified_code_commit="a" * 40, required_gates_passed=True)
            (self.root / phase["overlay_manifest"]).write_text('{"format_version":1,"files":[],"deletions":[]}\n')
            self.save(state)
            self.run_tool("refresh")
            message = self.run_tool("next").stdout
            if index < 5:
                self.assertIn(f"Phase {index + 2:02d}: Web implementation", message)
                self.assertNotIn("All six phases are complete", message)
            else:
                self.assertIn("All six phases are complete", message)
                self.assertNotIn("Phase 07", message)

    def test_archive_contains_exact_complete_tree_and_is_reproducible(self):
        self.run_tool("refresh")
        first, second = self.parent / "one.zip", self.parent / "two.zip"
        self.run_tool("zip", "--output", first)
        self.run_tool("zip", "--output", second)
        self.assertEqual(hashlib.sha256(first.read_bytes()).digest(), hashlib.sha256(second.read_bytes()).digest())
        with zipfile.ZipFile(first) as archive:
            expected = {"fount/" + p.relative_to(self.root).as_posix(): p.read_bytes()
                        for p in self.root.rglob("*") if p.is_file()
                        and p.relative_to(self.root).as_posix() not in GENERATED_EXPORTS}
            self.assertEqual(set(archive.namelist()), set(expected))
            for name, body in expected.items():
                self.assertEqual(archive.read(name), body)
        self.run_tool("zip", "--output", first, success=False)
        self.run_tool("zip", "--output", self.root / "recursive.zip", success=False)

    def test_broken_link_or_unexpected_generated_file_is_rejected(self):
        (self.root / "README.md").write_text("[missing](missing.md)\n")
        self.run_tool("refresh", success=False)
        (self.root / "README.md").write_text("Valid\n")
        (self.root / "unexpected.xml").write_text("Unexpected generated snapshot\n")
        self.run_tool("refresh", success=False)

    def test_known_repomix_exports_are_preserved_but_not_packaged(self):
        exports = {name: f"Existing user export {name}\n".encode() for name in GENERATED_EXPORTS}
        for name, body in exports.items():
            (self.root / name).write_bytes(body)
        self.run_tool("refresh")
        self.run_tool("validate")
        output = self.parent / "source-only.zip"
        self.run_tool("zip", "--output", output)
        with zipfile.ZipFile(output) as archive:
            for name, body in exports.items():
                self.assertNotIn("fount/" + name, archive.namelist())
                self.assertNotIn("  " + name + "\n", (self.root / "SHA256SUMS.txt").read_text())
                self.assertEqual((self.root / name).read_bytes(), body)

    def test_refresh_rejects_deleted_or_renamed_docset_source(self):
        self.run_tool("refresh")
        original = self.root / "examples/policy.json"
        body = original.read_bytes()
        original.unlink()
        self.assertIn("Docset deletion/rename", self.run_tool("refresh", success=False).stderr)
        original.write_bytes(body)
        original.rename(self.root / "examples/renamed_policy.json")
        self.assertIn("Docset deletion/rename", self.run_tool("refresh", success=False).stderr)


if __name__ == "__main__":
    unittest.main()