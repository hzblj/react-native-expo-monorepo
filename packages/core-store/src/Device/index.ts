import {createSelectorFunctions} from 'auto-zustand-selectors-hook'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {immer} from 'zustand/middleware/immer'

import {createCustomStorage} from '../storage'
import {
  applicationSlice,
  appStateSlice,
  hardwareSlice,
  installationSlice,
  localeSlice,
  networkSlice,
  themeSlice,
} from './slices'
import {DeviceStore, PersistedDeviceStore} from './types'

const DEVICE_STORE_VERSION = 2
const DEVICE_STORE_NAME = '@device-store'

const deviceStore = create<DeviceStore>()(
  persist(
    immer((...store) => ({
      ...networkSlice(...store),
      ...appStateSlice(...store),
      ...themeSlice(...store),
      ...installationSlice(...store),
      ...hardwareSlice(...store),
      ...applicationSlice(...store),
      ...localeSlice(...store),
    })),
    {
      name: DEVICE_STORE_NAME,
      partialize: ({
        firstLaunchAt,
        firstSeenAppVersion,
        lastLaunchAt,
        lastSeenAppVersion,
        launchCount,
        themePreference,
      }): PersistedDeviceStore => ({
        firstLaunchAt,
        firstSeenAppVersion,
        lastLaunchAt,
        lastSeenAppVersion,
        launchCount,
        themePreference,
      }),
      storage: createCustomStorage<PersistedDeviceStore>(),
      version: DEVICE_STORE_VERSION,
    }
  )
)

export const useDeviceStore = createSelectorFunctions(deviceStore)

export * from './types'
