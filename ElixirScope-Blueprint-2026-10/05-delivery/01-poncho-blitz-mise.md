# Poncho development environment: independent Mix projects, Blitz and mise/asdf

## Layout invariant

One repository containing **multiple normal Mix projects**. Root project is only a Blitz orchestration shell. `apps/elixir_scope` is publishable/testable alone. `apps/elixir_scope_server` depends on the sibling engine through a standard path dependency. `web` owns a separate TypeScript/Node lockfile. No `apps_path`, no umbrella startup assumption.

## Version policy

Pin OTP, Elixir, Node and package managers to known-good versions in either `.mise.toml` or `.tool-versions` (choose one source of truth). Reach's current README states Elixir 1.18+/OTP 27+ for the investigated version family. One reference pin drawn from the old repo is OTP 27.3.3 and Elixir 1.18.3; those **are not an asserted current compatibility matrix for every listed dependency**. Update after `mix deps.get` and smoke/integration checks. Node 22 is a plausible initial pin; test Vite/package library requirements.

### mise example (illustrative)

```toml
[tools]
erlang = "27.3.3"
elixir = "1.18.3-otp-27"
node = "22.16.0"

[tasks.test-engine]
run = "cd apps/elixir_scope && mix test"

[tasks.test-server]
run = "cd apps/elixir_scope_server && mix test"

[tasks.test-web]
run = "cd web && corepack pnpm test"
```

Or use an asdf `.tool-versions` with equivalent entries. The team should not maintain conflicting version pins in both. The tools above are examples to adjust based on the actual tested environment.

## Root `mix.exs` with Blitz

The [Blitz 0.4.1 README](https://hex.pm/packages/blitz/0.4.1/files/README.md?fallback=default) documents `Blitz.MixWorkspace` with `blitz_workspace` project config and `mix blitz.workspace test`. It isolates `MIX_DEPS_PATH`, `MIX_BUILD_PATH`, `MIX_LOCKFILE`, `HEX_HOME` when managing child projects and supports dependency-aware parallelism, task concurrency and impact-based CI.

```elixir
defmodule ElixirScopeWorkspace.MixProject do
  use Mix.Project

  def project do
    [
      app: :elixir_scope_workspace,
      version: "0.1.0",
      elixir: "~> 1.18",
      deps: [{:blitz, "~> 0.4.1", runtime: false}],
      aliases: ["check.all": ["blitz.workspace test"]],
      blitz_workspace: [
        root: __DIR__,
        projects: ["apps/*"],
        parallelism: [
          base: [deps_get: 2, format: 2, compile: 2, test: 2],
          multiplier: :auto,
          overrides: [dialyzer: 1]
        ],
        tasks: [
          deps_get: [args: ["deps.get"], preflight?: false],
          format: [args: ["format", "--check-formatted"]],
          compile: [args: ["compile", "--warnings-as-errors"]],
          test: [args: ["test"], mix_env: "test", color: true]
        ]
      ]
    ]
  end
end
```

This follows published Blitz configuration patterns but **was not compiled here**. `projects: ["apps/*"]` deliberately excludes tooling root so root `mix test` isn't redundantly executed; use explicit project selectors for your final layout. If introducing fixture Mix projects, exclude them from standard project globs or name separate profile/task groups.

## Child package pattern

`apps/elixir_scope/mix.exs`:

```elixir
defmodule ElixirScope.MixProject do
  use Mix.Project

  def project do
    [app: :elixir_scope, version: "0.1.0", elixir: "~> 1.18",
     start_permanent: Mix.env() == :prod, deps: deps()]
  end

  def application, do: [extra_applications: [:logger]]

  defp deps do
    [
      {:reach, "~> 2.8"},
      {:ex_ast, "~> 0.13"}
    ]
  end
end
```

These dependencies are runtime-available by design. If later moving indexing to a separate process/build tool, the deployment dependencies may be reduced, but never blindly use developer-only installation flags when the server calls these libraries at runtime. Pin tested compatible versions before first release.

`apps/elixir_scope_server/mix.exs` owns `{:elixir_scope, path: "../elixir_scope"}` alongside Phoenix/Ash/SQLite and any actual runtime dependencies. Let current Phoenix/Ash generators define correct OTP application and config layout rather than hand-copying an outdated application template.

## Development sequence

```sh
mise install
mix deps.get                           # root tooling
mix blitz.workspace deps_get          # fetch child project deps
mix blitz.workspace compile
mix blitz.workspace test
(cd apps/elixir_scope && mix test)
(cd apps/elixir_scope_server && mix test)
(cd web && corepack pnpm install && corepack pnpm test)
```

If using asdf, replace `mise install` with appropriate asdf setup. Blitz has `mix blitz.workspace.impact test` for impact-aware CI and persistent test-state cache; use only after basic deterministic full-test pipeline is established, and run full suite on release/tag/nightly to catch incorrect impact heuristics.

## Parallel test cautions

- The engine's tests should be isolated pure fixtures and deterministic, with no local TCP endpoints or global ETS table names that collide across test modules.
- Server integration tests need isolated DB sandbox/SQLite fixtures. SQLite write serialization can reduce gains from high test concurrency; configure test concurrency by task family.
- Blitz isolates child build/deps paths, but child lockfiles remain project-owned and should be committed for reproducibility. Test a clean checkout and `MIX_ENV=prod` compilation path.
- Avoid a monorepo-wide `_build` or shared `mix.lock` hack simply for speed.
- Web tests are separate Node commands. Blitz is a Mix workspace orchestrator; use root mise tasks or CI parallel jobs for the Node project rather than forcing it into Mix.

## Suggested CI stages

1. Root tooling/dependency resolution and input integrity.
2. `mix blitz.workspace format` (formatted check).
3. `mix blitz.workspace compile` warnings-as-errors.
4. `mix blitz.workspace test`.
5. Credo/Dialyzer jobs in configured child projects (controlled concurrency).
6. `pnpm lint`, TypeScript type check, unit tests and Playwright with mock server.
7. End-to-end contract test using a real Phoenix process, matching engine revision fixtures.
8. Full suite and fixture corpus on main/release (no impact skipping).

## README promises to avoid

"One command builds production-ready tracing", "100% test success", "microsecond overhead". The old source snapshots repeatedly made unverified claims; this time establish automated acceptance with measurable, provenance-rich reporting.
