package expo.modules.storage

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.jan.kotlin.secure.core.SecureCore
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject

class ExpoStorageModule : Module(), KoinComponent {
  private val secureCore: SecureCore by inject<SecureCore>()

  override fun definition() = ModuleDefinition {
    Name("ExpoStorage")

    Function("getStorageKey") {
      secureCore.getStorageKey()
    }

    Function("getEncryptionKey") {
      secureCore.getEncryptionKey()
    }

    Function("getInstallationId") {
      secureCore.getInstallationId()
    }
  }
}
