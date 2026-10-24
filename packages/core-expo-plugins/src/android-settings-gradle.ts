import {type ConfigPlugin, createRunOncePlugin, withSettingsGradle} from '@expo/config-plugins'

import pkg from '../../../package.json'
import type {NativeModuleRef} from './types'

export type AndroidSettingsGradleProps = {
  modules?: NativeModuleRef[]
}

/** The line every include is written after — Gradle needs the modules declared before the build. */
const ANCHOR = 'includeBuild(expoAutolinking.reactNativeGradlePlugin)'

const includeModule = ({name, path}: NativeModuleRef) =>
  `include(":${name}")\nproject(":${name}").projectDir = new File(rootDir, "${path}")`

/**
 * Declares each local Kotlin library as a Gradle module in the generated `settings.gradle`. Pairs
 * with `android-app-build-gradle`, which is what adds the matching `implementation project(...)`.
 */
const androidSettingsGradle: ConfigPlugin<AndroidSettingsGradleProps> = (config, {modules = []} = {}) =>
  withSettingsGradle(config, config => {
    if (modules.length === 0) {
      return config
    }

    const includes = modules.map(includeModule).join('\n')

    config.modResults.contents = config.modResults.contents.replace(ANCHOR, `${ANCHOR}\n${includes}\n`)

    return config
  })

export default createRunOncePlugin(androidSettingsGradle, `${pkg.name}-android-settings-gradle`, pkg.version)
