# core-hooks

Cross-cutting hooks that sit between a platform API and the store. All three are mounted once in `feature-providers` and everything downstream depends on them.

## Map

| File | What it does |
| --- | --- |
| `useAppState.ts` | Mirrors foreground/background into `core-store` and clears the `expo-image` caches on a memory warning. Side-effect only. |
| `useOnlineManager.ts` | Mirrors NetInfo connectivity into `core-store`. Side-effect only. |
| `useDeviceInfo.ts` | Reads `expo-device`, `expo-application`, `expo-constants` and `expo-localization` into `core-store`, and calls `registerLaunch` with the running version. Side-effect only. |

Breakpoints, the colour scheme and the platform appearance override are not here: `KaraProvider` owns all
three (`useBreakpoint`, `useAppTheme().dark`, `themePreference`), reached through `~/core.ui`.

## Rules

**`useDeviceInfo` is where the platform imports live, not the store.** `core-store` mirrors
`AppStateStatus`, `DeviceType`, `MeasurementSystem` and `TextDirection` as its own unions so it stays
free of react-native and expo imports; this hook is the single place the two vocabularies meet, which
is also the only place tsc can catch them drifting apart.

**It reads everything again on every launch, deliberately.** Hardware, build and locale are not
persisted, so there is no stored copy to go stale after an OS update, an app update or a language
change. The locale is re-read on every foreground on top of that, because Android applies a language
change to a running process while iOS restarts the app.

**A launch is counted once per process, not once per mount.** `registerLaunch` sits behind a
module-scope flag: Fast Refresh remounts `Providers`, and a second call would inflate `launchCount`
in development only — the kind of drift that stays invisible until the number is used for something.

`useAppState`, `useOnlineManager` and `useDeviceInfo` are mounted once, in `Providers`. Calling them
a second time would duplicate the listeners.
