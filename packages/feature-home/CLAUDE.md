# feature-home

The home screen — the app's first protected route, and the smallest example of what a feature
package looks like here.

## Map

| File | What it is |
| --- | --- |
| `src/Home/Home.tsx` | The screen: `Screen` → `VStack` with `sx` props, text through `useTranslation`. |
| `src/Home/index.ts`, `src/index.ts`, `index.ts` | The re-export chain that makes `~/feature-home` the only import path. |

## Rules

**The route owns nothing.** `apps/expo-demo/app/(protected)/(tabs)/index.tsx` is
`export default Home` — new behaviour goes here, never there.

**Compose from `core-*` only.** UI from `~/core.ui`, styling via `sx`, copy via `~/core.i18n`, state
via `~/core.store`. Never import another feature.

**Grow inside the folder**: local components in `src/Home/components/`, local logic in hooks
alongside them. A component only moves to `core-ui` once a *second* feature needs it.
