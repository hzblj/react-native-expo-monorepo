import {type ConfigPlugin, createRunOncePlugin, withMainApplication} from '@expo/config-plugins'

import pkg from '../../../package.json'

/**
 * Inserted before the class rather than after the last import: Kotlin wants every import ahead of
 * the first declaration, and `koinModules` is one. The old anchor was an import Expo's template no
 * longer emits, which `String.replace` swallowed — hence `insertBefore` throwing instead.
 */
const CLASS_ANCHOR = 'class MainApplication : Application(), ReactApplication {'

const START_ANCHOR = 'ApplicationLifecycleDispatcher.onApplicationCreate(this)'

/** Koin has to know how to build `SecureCore` before any Expo module asks for one. */
const KOIN_MODULE = `import com.jan.kotlin.secure.core.SecureCore
import org.koin.android.ext.koin.androidContext
import org.koin.core.context.startKoin
import org.koin.dsl.module

// SecureCore keeps its keys in this app's Keystore and preferences, which is what the context is for.
val koinModules = module {
  single { SecureCore(get()) }
}
`

/** Registers the application as Koin's Context, which is what the injected get() above resolves. */
const START_KOIN = `startKoin {
  androidContext(this@MainApplication)
  modules(koinModules)
}
`

const insertBefore = (contents: string, anchor: string, addition: string) => {
  if (!contents.includes(anchor)) {
    throw new Error(
      `android-main-application: MainApplication.kt has no "${anchor}" to anchor to. Expo's template changed — pick a new anchor.`
    )
  }

  return contents.replace(anchor, `${addition}\n${anchor}`)
}

/**
 * Starts Koin in the generated `MainApplication.kt`, so `ExpoStorageModule` can inject
 * `SecureCore`. Injection happens on first module access, which is why this runs before
 * `onApplicationCreate`.
 */
const androidMainApplication: ConfigPlugin = config =>
  withMainApplication(config, config => {
    const withKoinModule = insertBefore(config.modResults.contents, CLASS_ANCHOR, KOIN_MODULE)

    config.modResults.contents = insertBefore(withKoinModule, START_ANCHOR, START_KOIN)

    return config
  })

export default createRunOncePlugin(androidMainApplication, `${pkg.name}-android-main-application`, pkg.version)
