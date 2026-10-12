# Delivery architecture: TypeScript frontend, Phoenix backend, optional LiveView, origin flexibility

## Clarify the terminology

Phoenix is the HTTP/WebSocket/backend application. React/TypeScript is the *primary developer cockpit*. LiveView is optional for backend-origin pages such as importer diagnostics, indexing job monitoring and admin tools. **LiveView is not automatically a "headless" data API**; its component protocol is designed around server-rendered HTML and LiveSocket DOM updates. Avoid fighting that model for high-frequency code/timeline rendering. Use JSON/typed API and optionally Phoenix Channels.

## Local development

```text
http://localhost:5173/                 TypeScript/Vite cockpit
http://localhost:4000/api/v1/...        Phoenix HTTP API
ws://localhost:4000/socket             optional Phoenix Channels
http://localhost:4000/_internal/...     optional LiveView diagnostics
```

In early development, an env-configured frontend API base URL and explicit dev CORS/Socket origin allowlist are sufficient. Do not waste the first sprint on domain management. Preserve seams so hosting can change later.

Suggested browser runtime config fields:

```ts
interface RuntimeConfig {
  apiBaseUrl: string;      // absolute or relative
  socketUrl?: string;
  deploymentMode: 'local'|'hosted';
  features: {captureImport: boolean; liveStream: boolean; collaboration: boolean};
  protocolMajor: number;
}
```

Serve or inject configuration rather than baking environment-specific URLs into source. Build-time Vite variables are fine for local prototype, but runtime-delivered config helps one artifact deploy under multiple domains.

## Recommended production default: same-origin reverse proxy

```text
https://scope.example.com/                 -> static React app
https://scope.example.com/api/v1/...       -> Phoenix HTTP API
https://scope.example.com/socket           -> Phoenix Channels
https://scope.example.com/_internal/...    -> authenticated optional LiveView
```

Advantages: simpler cookies, CORS/CSRF/forwarded origin handling, security headers, relative API paths, and Dockview same-origin browser popout windows. Deployment can still run React static server/CDN and Phoenix on different internal hosts behind proxy; the public URL remains one origin.

## Alternative: independent domains/subdomains

```text
https://app.example.com/   -> React static app
https://api.example.com/   -> Phoenix API + socket + optional internal LiveView
```

Support this later via runtime API URL configuration, explicit allowed CORS origins, Phoenix Socket `check_origin`, secure auth tokens/cookies, CSP `connect-src`, HTTPS/WSS, SameSite and CSRF policies. Avoid simply setting `check_origin: false` in production. Phoenix [Endpoint docs](https://github.com/phoenixframework/phoenix/blob/main/lib/phoenix/endpoint.ex) describe `check_origin` for transports and URL host behavior.

### Session/auth tradeoffs

Cross-origin browser cookies require careful SameSite/Secure policy, explicit `credentials` options and CORS. Bearer token flows have their own XSS/storage risks. Choose later based on deployment and threat model; do not silently assume ordinary LiveView session cookies work unchanged across unrelated origins. LiveView admin at API origin may need its own authenticated session and CSRF protections. Do not expose raw repo roots or remote BEAM control without authz.

### WebSocket and proxies

Forward `Upgrade`/`Connection`, preserve scheme and host, configure idle timeouts and reconnect/backoff; Phoenix endpoint configured external URL must match proxied public URL. Channels should send bounded batches/progress, not raw full-rate trace firehose. Client resumes by cursor after reconnect. Query APIs remain usable if WebSocket is disabled.

### CORS for local development

Allow only `http://localhost:5173` and other chosen dev origins (including explicit `127.0.0.1` variants if actually used); list credentials policy if needed. Keep prod allowlist data-driven, not a wildcard. Use Vite dev proxy if simpler; then browser may see same-origin `/api` locally while backend remains on 4000.

## Deployment shapes to leave possible

| Mode | Shape | What must already be decoupled |
|---|---|---|
| Developer laptop | Phoenix local process + Vite; SQLite, local files | Relative/configurable API URL, no hardcoded root paths |
| Desktop wrapper | Electron/Tauri/webview TS + local Phoenix sidecar | Bind localhost securely; OS filesystem permissions |
| Single host/self-hosted | Phoenix serves API and prebuilt frontend behind proxy | Static assets as artifact; backend independent |
| Split static CDN and API | CDN app, Phoenix API domain | Explicit CORS/auth/WebSockets, CSP, runtime config |
| Team server | Phoenix/AshPostgres + shared artifact store | Authz, tenant/project boundaries, job isolation |
| Offline recording viewer | Static frontend + local/imported trace files | Pure trace reader, no required live agent or provider account |

Only local and single-host shape need implementation initially. Avoid universal domain routing infrastructure in the schema. `deploymentMode` and API transport abstraction suffice to permit later design.

## Headers, browser policy and popouts

Dockview's [popout windows](https://dockview.dev/docs/core/groups/popoutGroups/) require a same-origin `popout.html` for the UI that owns the layout, even if API is on another domain. Perfetto embedding has its own `postMessage` and `Cross-Origin-Opener-Policy` constraints documented by its [embedding guide](https://perfetto.dev/docs/visualization/embedding-the-ui). Those matter if Cinema adopts Perfetto; do not globally deploy headers that break the chosen embed/popout flow. Set CSP `frame-src` / `connect-src` deliberately and verify actual browser behavior in staging.

## Isolation of analysis and captured code

Never execute analyzed untrusted project source just to populate code facts unless the user intentionally opts into a sandboxed compiler/test workflow. Git/path import is read-only by default. Remote runtime probe is separate and authorized. Even with same-origin serving, trace/source data remains sensitive and demands authorization as product evolves.
