You're identifying the right fault line. Guardrails are an admission that the model doesn't understand the domain — you're compensating for incompetence with constraint. But a truly autonomous agent needs to *not want* to make that change, for the same reasons a senior engineer wouldn't.

So what does the human actually have? A few things:

**A causal model of the stack, not just the local code.** The senior engineer who wouldn't touch bind group slots knows *why* the limit is 4 — it's not an arbitrary convention, it's load-bearing in the GPU API spec. The model that added slot 30 clearly didn't have that causal model. It had syntax knowledge, not structural knowledge.

**Code smell as pre-computation.** "OOM handling inside a shader" triggers immediate wrongness before any analysis runs. That's compressed prior experience — thousands of hours of seeing what kinds of changes cause systemic failures. The model doesn't have that compression in the right form.

**Uncertainty as a stop signal.** The human who doesn't know the cross-backend implications of a change would *pause and ask*, not proceed. The model proceeded because uncertainty didn't register as a reason to stop.

The performance test angle you're pointing at is interesting as a grounding mechanism — the model makes the change, observes the failure, reasons backward to "my approach was architecturally wrong." That's at least learning from consequences. But the proactive version requires the model to simulate those consequences *before* executing, which is a much harder capability.

The real leap you're naming: current models have strong local coherence and weak global model integrity. They optimize for "the immediate task compiles and passes narrow tests" and can't reliably weight that against "this violates the portability contract of the entire backend architecture." That's not a knowledge gap you can fill with more documentation — it's a structural limitation in how they reason about consequence propagation across abstraction layers.

Which is actually your substrate thesis applied here. The agent needs primitives for reasoning about *what it doesn't know the implications of* — and that's exactly what doesn't exist yet.You're identifying the right fault line. Guardrails are an admission that the model doesn't understand the domain — you're compensating for incompetence with constraint. But a truly autonomous agent needs to *not want* to make that change, for the same reasons a senior engineer wouldn't.

So what does the human actually have? A few things:

**A causal model of the stack, not just the local code.** The senior engineer who wouldn't touch bind group slots knows *why* the limit is 4 — it's not an arbitrary convention, it's load-bearing in the GPU API spec. The model that added slot 30 clearly didn't have that causal model. It had syntax knowledge, not structural knowledge.

**Code smell as pre-computation.** "OOM handling inside a shader" triggers immediate wrongness before any analysis runs. That's compressed prior experience — thousands of hours of seeing what kinds of changes cause systemic failures. The model doesn't have that compression in the right form.

**Uncertainty as a stop signal.** The human who doesn't know the cross-backend implications of a change would *pause and ask*, not proceed. The model proceeded because uncertainty didn't register as a reason to stop.

The performance test angle you're pointing at is interesting as a grounding mechanism — the model makes the change, observes the failure, reasons backward to "my approach was architecturally wrong." That's at least learning from consequences. But the proactive version requires the model to simulate those consequences *before* executing, which is a much harder capability.

The real leap you're naming: current models have strong local coherence and weak global model integrity. They optimize for "the immediate task compiles and passes narrow tests" and can't reliably weight that against "this violates the portability contract of the entire backend architecture." That's not a knowledge gap you can fill with more documentation — it's a structural limitation in how they reason about consequence propagation across abstraction layers.

Which is actually your substrate thesis applied here. The agent needs primitives for 
reasoning about *what it doesn't know the implications of* — and that's exactly what 
doesn't exist yet.
