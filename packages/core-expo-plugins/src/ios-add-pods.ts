import {readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {type ConfigPlugin, createRunOncePlugin, withDangerousMod} from '@expo/config-plugins'

import pkg from '../../../package.json'
import type {NativeModuleRef} from './types'

export type IosAddPodsProps = {
  modules?: NativeModuleRef[]
}

const podLine = ({name, path: podPath}: NativeModuleRef) => `pod '${name}', :path => '${podPath}'`

/**
 * Appends a `pod` entry per module to the generated Podfile. Local Swift libraries live outside the
 * Expo module system, so autolinking never sees them — this is what puts them in the build.
 *
 * Entries already present are skipped, so a prebuild over an existing `ios/` stays idempotent.
 */
const iosAddPods: ConfigPlugin<IosAddPodsProps> = (config, {modules = []} = {}) =>
  withDangerousMod(config, [
    'ios',
    async config => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      const contents = await readFile(podfilePath, 'utf8')

      const missing = modules.map(podLine).filter(line => !contents.includes(line))

      if (missing.length > 0) {
        await writeFile(podfilePath, `${contents.trimEnd()}\n\n${missing.join('\n')}\n`, 'utf8')
      }

      return config
    },
  ])

export default createRunOncePlugin(iosAddPods, `${pkg.name}-ios-add-pods`, pkg.version)
