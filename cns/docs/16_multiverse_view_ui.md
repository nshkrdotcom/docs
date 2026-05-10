# 16 — Multiverse View UI Specification

## UI goal

Expose alternatives clearly enough that a human analyst can understand why the system ranked one world above another and what evidence would change the ranking.

## Main panels

### 1. World ranking panel

Columns:

- world ID;
- posterior;
- confidence;
- assumptions;
- latent contexts;
- contradiction energy;
- proof coverage;
- source quality.

### 2. Claim ranking panel

Columns:

- claim;
- posterior;
- confidence;
- status;
- estimative language;
- supporting worlds;
- conflicting worlds;
- evidence refs.

### 3. Evidence panel

Shows evidence atoms with:

- span;
- source;
- quality;
- claims supported/refuted;
- source reliability notes.

### 4. Chiral residual panel

Heatmap of unresolved contradiction residual:

- claim vs evidence;
- support mass;
- refute mass;
- context splits.

### 5. Proof trace panel

Expandable proof trace for each promoted claim.

### 6. Next evidence panel

Lists evidence collection actions likely to reduce uncertainty:

- missing source;
- disputed time interval;
- subgroup-specific evidence;
- direct test of latent predicate;
- source reliability verification.

## Analyst interactions

- filter worlds by assumption;
- pin/compare two worlds;
- inspect why a claim is abstained;
- mark evidence as suspect and rerun ranking;
- add human note without changing posterior;
- request new evidence collection.

## Rendering rules

- Never hide alternatives by default.
- Always show uncertainty decomposition.
- Do not use green/red truth colors alone; use status labels and confidence.
- Show unsupported claims separately from rejected claims.
