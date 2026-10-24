# expo-storage

A local Expo native module — the only bridge between JS and `platform-secure-core`. It hands
`core-store` the MMKV storage id, the encryption key and the install id, so none of them ever exists
as a JS string literal.

## Map

| Path | What it is |
| --- | --- |
| `src/ExpoStorageModule.ts` | `requireNativeModule('ExpoStorage')` behind a declared class — the typed JS surface (`getStorageKey`, `getEncryptionKey`, `getInstallationId`). |
| `ios/ExpoStorageModule.swift` | Apple side; reads `SecureCore.shared`. |
| `ios/ExpoStorage.podspec` | Pod definition for the module. |
| `android/src/main/java/expo/modules/storage/ExpoStorageModule.kt` | Android side; injects `SecureCore` via Koin. |
| `expo-module.config.json` | Registers the module class per platform. |
| `index.ts` | Default-exports the module instance (the one default export in the repo — that is the Expo module convention). |

## Rules

**Autolinked, not depended on.** The app's `package.json` sets
`expo.autolinking.nativeModulesDir: "../../packages"`, which is how this gets picked up.

**Adding a native function is three edits at once** — Swift, Kotlin, and the `declare class` in
`ExpoStorageModule.ts` — followed by a clean prebuild (`yarn ios:dev` / `yarn android:dev`).
The TS declaration is unchecked against the native side, so a typo there fails only at runtime.

**Keys stay native.** Return values from `SecureCore`; never hard-code a key here.

**All three functions throw.** `SecureCore` generates each key once and keeps it in the Keychain or the
Android Keystore, and it has no fallback to hand back when that fails — a substitute key would open
an empty MMKV instance and read as data loss. The error surfaces in JS where `core-store` reads it —
`createMMKV` for the two keys, the installation slice's initial state for the id — which is the
correct place for it to be loud.

**`getInstallationId` is an *install* id, not a device id, and the two platforms disagree about how
long it lives.** iOS keeps it in the Keychain, which outlives an uninstall; Android keeps it beside
the MMKV files, which do not. Nothing here can close that gap, so `core-store` names the field for
what both platforms can actually promise.
