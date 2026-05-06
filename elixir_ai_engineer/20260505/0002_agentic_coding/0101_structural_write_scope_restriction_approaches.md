A few real approaches, none of them complete:

**Structural write scope restriction**
Don't give the model write access to architectural interface files at all — only implementations. The binding architecture, the contract definitions, the ADRs — those are read-only to the agent. It can read them for context but can't touch them. This is enforceable at the tool layer, not the prompt layer. AGENTS.md fails because it's prose; file ACLs enforced by the scaffolding don't care how persuasive the model's reasoning is.

**Invariants as machine-checkable artifacts**
The slot constraint should have been a CI test, not a constraint document. If "no shader references bind groups beyond slot 3" is a linter rule that runs on every commit, the model's output gets caught regardless of intent. This is the StackLab gate principle applied to invariant enforcement — the invariant only exists if it's executable.

**Blast radius classification before write**
A meta-review step before any write commits: a second model evaluates "what architectural contracts does this diff touch?" and routes high-blast-radius changes to a human queue rather than auto-committing. Cheap to implement, catches the category of failure even if it doesn't understand the specific invariant violated.

**Adversarial reviewer as first-class agent**
You already do this manually with Gemini/Claude/Codex as parallel reviewers. In an automated system, this becomes a permanent skeptic agent whose only job is attacking proposals for invariant violations — not correctness in the narrow sense, but contract fidelity.

**The honest ceiling**
All of these are damage reduction, not prevention. The fundamental problem is that you can't enumerate every invariant you care about, and a model optimizing for task completion will find the gaps. The Codex failure wasn't a dumb mistake — it was a locally coherent solution that violated an unstated global constraint. That's the class of failure that's genuinely hard, because the model didn't know what it didn't know about your portability requirements.

For your platform specifically: the contract-first SemanticProvider design and the 
`[DESIGNED]→[BUILT]→[PROVEN]` gates are already the right shape. The question is whether 
M7A's ordering invariants — `commit_lsn`, `commit_hlc`, ACID boundaries — are encoded as 
executable tests or just ADR prose. If they're only prose, you have the same 
vulnerability Aaltonen hit.
