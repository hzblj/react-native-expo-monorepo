# core-services

Thin wrappers around cross-cutting infrastructure, so features depend on this boundary instead of
the vendor: logging and networking.

## Map

| Path | What it is |
| --- | --- |
| `src/Logger/Logger.tsx` | The public `Logger` — spreads whichever backend is wired in. |
| `src/Logger/console/` | The console backend: `debug`, `info`, `error`, `json`, all no-ops outside `__DEV__`. |
| `src/Fetcher/Fetcher.ts` | The public `Fetcher` over `react-native-nitro-fetch`: `fetch` (a drop-in for the global one, on URLSession / Cronet), `prefetch` and `prefetchOnAppStart`. |

## Rules

**Log through `Logger`, never `console` directly** — the console calls are dev-gated here, and this
is the single place a real backend (Sentry, a remote sink) gets swapped in without touching a
single call site.

**Fetch through `Fetcher`, never the global `fetch` or `react-native-nitro-fetch` directly** — Biome rejects
the import outside this package. A base URL, auth headers or a retry policy belong in `Fetcher` once there is an
API to talk to, not at each call site.

**nitro-fetch is native.** Its config plugin (in `app.config.ts`) adds the Android `AutoPrefetcher` to
`MainApplication.kt`, and it runs on `react-native-nitro-modules`, so a version bump needs a clean prebuild.

**Keep the surface a plain object of functions.** `Logger` is spread from its backend, so a new
backend just has to provide the same keys.

Depends on nothing in the workspace. Consumed by hooks, features and the splash screen.
