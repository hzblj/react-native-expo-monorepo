import ExpoModulesCore
import SecureCore

public class ExpoStorageModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoStorage")

    // All three throw rather than fall back: a key that silently differs opens an empty store.
    Function("getEncryptionKey") {
      try SecureCore.shared.encryptionKey
    }

    Function("getStorageKey") {
      try SecureCore.shared.storageKey
    }

    Function("getInstallationId") {
      try SecureCore.shared.installationId
    }
  }
}
