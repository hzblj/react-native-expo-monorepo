# platform-secure-core

Pure native libraries — Swift and Kotlin, **no JavaScript and no `package.json`**. Secrets and
crypto live here because compiled binaries are far harder to reverse-engineer than a JS bundle.

## Map

| Path | What it is |
| --- | --- |
| `swift-secure-core/Sources/swift-secure-core/SecureCore.swift` | `SecureCore.shared` with `encryptionKey` / `storageKey` / `installationId` — resolved once, then cached behind a lock. |
| `swift-secure-core/.../Keychain.swift` | Typed wrapper over `SecItem*`: read a string, write a string. |
| `swift-secure-core/.../RandomKey.swift` | 24 CSPRNG bytes → 32 base64url characters. |
| `swift-secure-core/.../SecureCoreError.swift` | The failures, carrying the `OSStatus` that makes them diagnosable. |
| `swift-secure-core/Package.swift`, `SecureCore.podspec` | SwiftPM + CocoaPods definitions; the podspec is what the app's `iosAddPods` plugin links. |
| `kotlin-secure-core/src/main/java/com/jan/kotlin_secure_core/SecureCore.kt` | The Android implementation of `SecureCoreInterface`. |
| `kotlin-secure-core/.../SecureCoreInterface.kt` | The contract the Koin module is bound to. |
| `kotlin-secure-core/.../EncryptedKeyStorage.kt` | `SharedPreferences` holding nothing but ciphertext. |
| `kotlin-secure-core/.../KeystoreCipher.kt` | AES-256-GCM under a master key that cannot leave the Android Keystore. |
| `kotlin-secure-core/.../RandomKey.kt`, `SecureCoreException.kt` | The Kotlin halves of their Swift namesakes. |

## Rules

**No key is a literal any more.** All three are generated from the platform CSPRNG the first time they
are asked for, then kept where only this app can read them: iOS Keychain, protected with
`kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` so it is never synced to iCloud and never
restored onto another device; Android `SharedPreferences`, storing only what the Keystore master key
decrypts. Nothing to find in the binary, and nothing in JS but the value MMKV opens with.

**The two MMKV keys are 32 base64url characters** — 24 random bytes. 32 is MMKV's maximum under
AES-256, which is why `core-store/src/storage.ts` sets `encryptionType`. The URL-safe alphabet is not
cosmetic: the same generator produces `storageKey`, and MMKV turns that into a file name.
`installationId` is a UUID instead, because unlike the other two it leaves the device in analytics
payloads and gets read by people — which is also why it is generated separately rather than by
widening `RandomKey`.

**Failure throws, and there is no fallback key.** A second-choice key opens an *empty* MMKV instance
instead of the real one, which looks exactly like data loss. `SecureCoreError` and
`SecureCoreException` carry the `OSStatus` or the JCA cause instead of papering over it.

**The platforms lose keys differently, both harmlessly.** Android keeps them in app storage, so an
uninstall takes the keys and the MMKV files together. iOS Keychain items outlive an uninstall while
the files do not, so a reinstall opens an empty store under the old id. The dangerous direction — a
key that changes while the files stay — is what the Keychain is here to prevent.

That asymmetry is invisible for the two MMKV keys and visible for `installationId`: on iOS it names
the same install across reinstalls, on Android it counts them. Neither platform can be made to
behave like the other from here, so anything downstream has to treat it as an install id — which is
why `core-store` calls it one.

**`kotlin-secure-core` is an Android library, not a plain JVM one**, because the Keystore and the
`Context` behind `SharedPreferences` are Android SDK. It reads `compileSdkVersion` / `minSdkVersion`
off `rootProject.extra`, which `expo-root-project` publishes in the generated app.

**`SecureCore` takes a `Context` on Android.** `core-expo-plugins/android-main-application` is what
supplies it — `androidContext(this@MainApplication)` in `startKoin`, then `single { SecureCore(get()) }`.

**This package is not on the JS dependency graph.** It is wired in entirely through
`apps/expo-demo/app.config.ts`: `iosAddPods` adds the pod, `androidSettingsGradle` includes the
Gradle module, `androidAppBuildGradle` adds the implementation + Koin. Reached from JS only via
`expo-storage`.

**Every change needs a clean prebuild** (`yarn ios:dev` / `yarn android:dev`) — Metro cannot see it.

Keep the two implementations behaviourally identical; the Kotlin interface and the Swift singleton
are the contract, and nothing type-checks it across the language boundary.
