import ExpoStorageModule from 'expo-storage'

import {CreateInstallationSlice} from '../types'

export const installationSlice: CreateInstallationSlice = set => ({
  firstLaunchAt: null,
  firstSeenAppVersion: null,
  installationId: ExpoStorageModule.getInstallationId(),
  isFirstLaunch: false,
  isFirstLaunchAfterUpdate: false,
  lastLaunchAt: null,
  lastSeenAppVersion: null,
  launchCount: 0,
  previousAppVersion: null,
  previousLaunchAt: null,
  registerLaunch: appVersion =>
    set(draft => {
      const isFirstLaunch = draft.launchCount === 0
      const previousAppVersion = draft.lastSeenAppVersion
      const now = new Date()

      draft.isFirstLaunch = isFirstLaunch
      draft.isFirstLaunchAfterUpdate =
        !isFirstLaunch && appVersion !== null && previousAppVersion !== null && previousAppVersion !== appVersion
      draft.previousAppVersion = previousAppVersion
      draft.previousLaunchAt = draft.lastLaunchAt

      if (isFirstLaunch) {
        draft.firstLaunchAt = now
        draft.firstSeenAppVersion = appVersion
      }

      draft.lastLaunchAt = now
      draft.lastSeenAppVersion = appVersion ?? previousAppVersion
      draft.launchCount += 1
    }),
})
