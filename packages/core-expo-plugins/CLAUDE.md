# core-expo-plugins

Expo config plugins, in TypeScript. They run in **Node at prebuild time**, not in the app — this is
the only place that edits the generated `ios/` and `android/` projects, and it is what puts
`platform-secure-core` into the native builds (autolinking only covers Expo modules).

## Map

| File | What it grafts in |
| --- | --- |
| `src/ios-add-pods.ts` | A `pod '<name>', :path => '<path>'` line per module, appended to the Podfile. Skips entries already present. |
| `src/android-settings-gradle.ts` | `include(...)` + `projectDir` per module in `settings.gradle`. |
| `src/android-app-build-gradle.ts` | Dependency lines in the app module's `build.gradle` (the Kotlin library plus Koin). |
| `src/android-main-application.ts` | The Koin module and `startKoin` call in `MainApplication.kt`, so `ExpoStorageModule` can inject `SecureCore` — with the application registered as Koin's `Context`, which is what `SecureCore` needs to reach the Keystore. |
| `src/types.ts` | `NativeModuleRef` — the `{name, path}` shape the linking plugins take. |

Wired up in `apps/expo-demo/app.config.ts` by **string reference**
(`'core-expo-plugins/ios-add-pods'`), which is what lets Expo resolve and transpile the TypeScript.
There is no barrel: the `exports` map (`"./*": "./src/*.ts"`) is what keeps `src/` out of those
references, so a plugin renamed here has to be renamed in `app.config.ts` too.

Redefining a UIKit semantic colour is Kara's job, not this package's: its plugin takes
`iosSemanticColors` beside `icons`.

## Rules

**Only the plugin entry file gets transpiled.** Expo's resolver hands the file to
`@expo/require-utils`, which transpiles *that file alone*; its relative `require`s then go through
plain Node, which cannot load a `.ts`. So a plugin may import packages (`@expo/config-plugins`,
`node:*`) and **types** (erased at transpile), but a relative *value* import of another `.ts` file in
this package throws `Cannot find module` at prebuild. Keep each plugin self-contained.

**Reference plugins as strings, never as imported functions.** Importing them into `app.config.ts`
would put that same relative-`.ts`-require problem in the config file.

**The Android plugins are not idempotent** — they insert after an anchor string without checking.
Running `expo prebuild` over an existing `android/` inserts twice, which is why every script does a
clean prebuild first.

**Anchors are the fragile part.** Each plugin keys off an exact line in an Expo template
(`implementation("com.facebook.react:react-android")`, `includeBuild(expoAutolinking...)`,
`class MainApplication : Application(), ReactApplication {`). An SDK upgrade can change those, and
`String.replace` fails silently — after upgrading, diff the generated files rather than trusting a
green prebuild.

This is not hypothetical: SDK 57 dropped `import expo.modules.ReactNativeHostWrapper`, which
`android-main-application` had anchored its imports to, and prebuild kept reporting success while
emitting a `MainApplication.kt` that called a `koinModules` nothing declared. That plugin now throws
when an anchor is missing, which is the cheap half of the lesson; the other half is that its
insertion point moved *before* the class, because Kotlin wants every import ahead of the first
declaration and `koinModules` is one.

Verify a change with a clean prebuild and a diff of `ios/Podfile`, `android/settings.gradle`,
`android/app/build.gradle` and `MainApplication.kt`.
