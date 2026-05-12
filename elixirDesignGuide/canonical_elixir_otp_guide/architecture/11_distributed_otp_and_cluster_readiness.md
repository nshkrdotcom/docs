# Distributed OTP And Cluster Readiness

## Purpose

This document defines how to design Elixir systems that may run on multiple nodes, support rolling upgrades, or communicate with heterogeneous services.

## Distributed Rule

```text
Location transparency is not failure transparency.
Remote message passing, RPC, PubSub, and distributed registries need explicit failure design.
```

## Cluster Topology

Define:

- Node roles.
- Homogeneous or heterogeneous deployment.
- Discovery mechanism.
- Network assumptions.
- Data locality.
- Which work may run on any node.
- Which work must be singleton.
- Which work is partition tolerant.

## Process Naming Across Nodes

Options:

- Local `Registry`.
- `:pg` process groups.
- Phoenix PubSub.
- Horde or Swarm-like libraries where appropriate.
- Database-backed lease or lock.
- External coordinator.

Avoid global naming until the failure model is understood.

Questions:

- What happens during network partition?
- Can two nodes think they own the same singleton?
- Is duplicate ownership safe?
- How is ownership recovered?

## RPC

Remote synchronous calls are risky.

Rules:

- Always set timeouts.
- Avoid remote calls inside stateful process callbacks.
- Prefer asynchronous messages or durable queues where appropriate.
- Treat remote node down as expected failure.
- Record telemetry for remote latency and errors.

## PubSub And Events

PubSub is not durable by default.

Use PubSub for:

- UI updates.
- Cache invalidation with fallback.
- Local real-time notifications.

Do not use plain PubSub for:

- Must-deliver business events.
- Payment effects.
- Durable workflow progress.

Use outbox, event log, or durable job for must-deliver events.

## Rolling Upgrades

During rolling upgrade, nodes may run different versions.

Rules:

- Version cross-node payloads.
- Keep old message handlers until rollout completes.
- Avoid sending anonymous functions across nodes.
- Avoid payloads that require new code on old nodes.
- Test mixed-version clusters for major changes.

## Capability Negotiation

For advanced systems, use capabilities:

```elixir
[:workflow_v2, :provider_timeout_policy_v1, :event_payload_v3]
```

Nodes advertise supported capabilities. Cluster behavior uses the lowest common supported feature until all nodes support the new one.

Use for:

- Protocol upgrades.
- Feature rollout.
- Multi-node compatibility.
- Optional providers.

## Distributed Data

Clarify:

- Which data is in the database.
- Which data is node-local cache.
- Which data is replicated.
- Which data can be stale.
- Which data must converge.

Do not assume ETS, process state, or local cache is cluster state.

## Network Failure Tests

Test:

- Node down.
- Node slow.
- Partition.
- Reconnect.
- Duplicate leader.
- Missed PubSub message.
- Rolling upgrade mixed payload.
- Remote timeout.

Tools may include:

- LocalCluster-style multi-node tests.
- Toxiproxy or network chaos layer.
- Trace-based verification.
- Staged release environments.

## Distributed Observability

Each cross-node operation needs:

- Correlation ID.
- Origin node.
- Target node or group.
- Payload version.
- Capability version.
- Latency.
- Error classification.

## Review Checklist

- [ ] Cluster topology is declared.
- [ ] Singleton ownership and partition behavior are defined.
- [ ] Cross-node payloads are versioned.
- [ ] Remote calls have timeouts and error handling.
- [ ] PubSub is not used for must-deliver events.
- [ ] Mixed-version behavior is tested for protocol changes.

