import {type ConfigPlugin, createRunOncePlugin, withAppBuildGradle} from '@expo/config-plugins'

import pkg from '../../../package.json'

export type AndroidAppBuildGradleProps = {
  /** Whole Gradle dependency lines, e.g. `implementation project(":kotlin-secure-core")`. */
  implementations?: string[]
}

/** The dependency every added line is written after — present in every generated `app/build.gradle`. */
const ANCHOR = 'implementation("com.facebook.react:react-android")'

/**
 * Adds dependency lines to the app module's `build.gradle`. This is how the local Kotlin libraries
 * and their Koin runtime reach the Android build — autolinking only covers Expo modules.
 */
const androidAppBuildGradle: ConfigPlugin<AndroidAppBuildGradleProps> = (config, {implementations = []} = {}) =>
  withAppBuildGradle(config, config => {
    if (implementations.length === 0) {
      return config
    }

    config.modResults.contents = config.modResults.contents.replace(
      ANCHOR,
      `${ANCHOR}\n${implementations.join('\n')}\n`
    )

    return config
  })

export default createRunOncePlugin(androidAppBuildGradle, `${pkg.name}-android-app-build-gradle`, pkg.version)
