/** A native library on disk, linked into the generated project by path rather than published. */
export type NativeModuleRef = {
  /** Pod name on iOS, Gradle module name on Android. */
  name: string
  /** Path to the library, relative to the generated `ios/` or `android/` directory. */
  path: string
}
