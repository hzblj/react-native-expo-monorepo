# core-config

Runtime environment config, validated once with Zod at import time. Its job is to fail loudly at
startup rather than let an undefined env var surface as a bug three screens later.

## Map

| File | What it is |
| --- | --- |
| `src/schema.ts` | The Zod schema (`STAGE`: `development` \| `preview` \| `production`), the derived `Config` type, and `validateSchema`. |
| `src/index.ts` | `config` — the parsed, frozen values read from `process.env.EXPO_PUBLIC_STAGE`. |

## Rules

**Only `EXPO_PUBLIC_*` vars are readable from app code** — Metro inlines those; anything else is
`undefined` at runtime.

**Add a var in two places at once**: the Zod schema (which is also where its type comes from) and
the env/EAS profile that supplies it. A failed parse throws immediately, by design.

**`EXPO_PUBLIC_STAGE` is the single stage switch.** `app.config.ts` reads the same variable to pick
the icons, scheme and app name, so build-time and runtime can never disagree. Every `yarn` script in
the app and every `eas.json` build profile sets it explicitly — nothing is read from a committed env
file, because one would silently apply to stages it was never meant for.

Depends on nothing. Consumed anywhere the stage matters.
