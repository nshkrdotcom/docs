Right — and this reframes the whole problem cleanly. The LLM's job isn't to understand invariants deeply enough to never violate them. Its job is to *author* the tests that encode the invariants, and then the enforcement is purely mechanical.

The architecture becomes:

**LLM in the loop for test authorship, not for runtime judgment.** The model reads the spec, the ADRs, the architecture docs, and generates candidate invariant propositions — "bind group slot must not exceed 3," "commit_hlc is monotonically increasing per node," whatever the domain requires. Those propositions get turned into executable tests. After that the LLM is out of the enforcement path entirely.

**The three layers you named:**
- Type/dialyzer checks catch structural violations statically
- Credo/linter rules catch pattern violations (the shader OOM check would have been catchable here — "no memory allocation calls in shader-targeting modules")
- Property tests catch behavioral invariant violations — and this is where StreamData/PropCheck earns its keep, because you're specifying *properties* not cases, and the framework actively tries to find counterexamples

**The remaining hard problem is coverage of the invariant space itself.** How do you know your test suite encodes all the invariants that matter? This is where mutation testing becomes load-bearing — you deliberately break known invariants and verify tests catch the breakage. If a mutation survives, you have a coverage gap. The LLM can assist with generating mutations systematically.

**For your platform specifically** — your ordering invariants are actually well-suited to this. `commit_lsn` monotonicity, HLC causal ordering, ACID boundary preservation — these are all expressible as property tests. The LLM can draft them from the M7A spec. The question is whether you have a process for systematically deriving test propositions from ADRs before implementation begins, which is exactly the `[DESIGNED]` gate.

The full loop: LLM generates invariant propositions from architecture docs → propositions become property tests → CI enforces deterministically → agent cannot merge code that breaks them → no runtime LLM judgment required.

