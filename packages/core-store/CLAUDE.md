# core-store

Global state: two Zustand stores, both persisted to encrypted MMKV. Selectors are auto-generated —
read state as `useDeviceStore.use.network()`, never by subscribing to the whole store.

## Map

| Path | What it is |
| --- | --- |
| `src/Device/` | Device-scoped store, seven slices: `installationSlice` (install id + launch history), `hardwareSlice`, `applicationSlice` (build + session), `localeSlice`, `networkSlice` (connectivity + type), `appStateSlice` (foreground/background), `themeSlice` (`light` / `dark` / `system` preference, handed to `KaraProvider`). |
| `src/User/` | User-scoped store: `onboardingSlice` (`start` \| `completed`, plus the completion date) — this is what gates the app's route groups. |
| `src/*/types.ts` | Slice types and the `StateCreator` aliases wired for the immer middleware. |
| `src/storage.ts` | The MMKV instance (AES-256, keys from `expo-storage`) and `createCustomStorage` — a JSON storage whose replacer/reviver survive `Date`, `Map` and `Set`. |

## Rules

**A slice per concern, composed in the store's `index.ts`.** Both stores run
`persist(immer(...))`, so slices mutate their draft directly.

**Bump `*_STORE_VERSION` when a persisted shape changes** — otherwise a stored payload from an older
build rehydrates into the new type and nothing complains until it breaks.

**`Map`/`Set` in persisted state require `enableMapSet()`**, which the app's root layout calls.

**`Date` survives the round trip, but only because the replacer cheats.** `JSON.stringify` calls
`Date.prototype.toJSON` *before* a replacer sees the value, so the replacer in `storage.ts` is the
one function declaration in the repo — it needs `this` to reach the untouched original. Without it a
`Date` field rehydrates as a string under a `Date` type, and nothing complains until someone calls a
method on it.

**Persist the answers nothing can give twice; read the rest fresh.** `Device`'s `partialize` lists
six keys, and everything else — hardware, build, locale, connectivity, foreground state — is
re-read on every launch by `core-hooks/useDeviceInfo`. A stored copy of an answer the platform is
about to give again is not a saving, it is a second version of the truth that goes stale on an OS
update, an app update or a language change. It also fixes a real bug: without `partialize` a launch
rehydrated `appState: 'background'` and held it, because the platform reports *changes* and an app
starting in the foreground has nothing to change from.

**`installationId` identifies an install, not a device, and not for the same length of time on both
platforms.** It comes from the Keychain / Android Keystore via `expo-storage`, so it is deliberately
*not* persisted here — that copy is the one that outlives the MMKV files. On iOS it therefore
survives an uninstall and `launchCount` does not, which is precisely how a reinstall is recognised;
on Android both go together. Do not build anything that needs a stable hardware identity on it.

**The keys are per-device, not per-build.** `platform-secure-core` generates both on first launch
and keeps them in the Keychain / Android Keystore, so `encryptionType: 'AES-256'` and the 32-character
length are fixed by that end — changing either here makes every existing store unreadable.

Depends on `expo-storage` for the encryption/storage keys and the install id, on `core-config`
for the `Stage` type, and on `core-ui` for Kara's `ThemePreference` type. Consumed by `core-hooks`, `feature-*` and the app.
