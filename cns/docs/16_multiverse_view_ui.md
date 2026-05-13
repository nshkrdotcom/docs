# 16 — Multiverse View UI Specification

## UI goal

Expose alternatives clearly enough that a human analyst can understand why the system ranked one world above another, which records matter, and what evidence would change the ranking.

## Main panels

### 1. World ranking panel

Columns:

- world ID;
- posterior;
- confidence;
- assumptions;
- latent contexts;
- access hypotheses;
- contradiction energy;
- access loss;
- proof coverage;
- source quality.

### 2. Claim ranking panel

Columns:

- claim;
- posterior;
- strict support;
- confidence;
- status;
- estimative language;
- supporting worlds;
- conflicting worlds;
- record dependencies;
- evidence refs.

### 3. Evidence panel

Shows evidence atoms with:

- span;
- source;
- quality;
- access path;
- claims supported/refuted;
- source reliability notes.

### 4. Record access panel

Shows expected records with:

- record ID;
- record type;
- controller;
- generation duty;
- expected observability;
- access state;
- production status;
- classification confidence;
- claims dependent on the record.

### 5. Chiral residual panel

Heatmap of unresolved contradiction residual:

- claim vs evidence;
- support mass;
- refute mass;
- context splits;
- access-state splits.

### 6. Proof trace panel

Expandable proof trace for each strict promoted claim.

### 7. Next evidence panel

Lists evidence collection actions likely to reduce uncertainty:

- missing source;
- disputed time interval;
- subgroup-specific evidence;
- direct test of latent predicate;
- source reliability verification;
- production of expected record;
- independent record source.

## Analyst interactions

- filter worlds by assumption;
- filter worlds by access hypothesis;
- pin/compare two worlds;
- inspect why a claim is abstained;
- inspect why a claim is record-contingent;
- mark evidence as suspect and rerun ranking;
- add human note without changing posterior;
- request new evidence collection.

## Rendering rules

- Never hide alternatives by default.
- Always show uncertainty decomposition.
- Do not use green/red truth colors alone; use status labels and confidence.
- Show unsupported claims separately from rejected claims.
- Show record-contingent claims separately from unsupported claims.
- Show strict support separately from likely-truth posterior.
