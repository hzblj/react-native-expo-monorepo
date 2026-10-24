import {requireNativeModule} from 'expo'

declare class ExpoStorageModule {
  getStorageKey(): string
  getEncryptionKey(): string
  getInstallationId(): string
}

export default requireNativeModule<ExpoStorageModule>('ExpoStorage')
