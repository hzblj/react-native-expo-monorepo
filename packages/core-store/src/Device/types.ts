import {NetInfoStateType} from '@react-native-community/netinfo'
import {StateCreator} from 'zustand'

import {Stage} from '~/core.config'
import type {ThemePreference} from '~/core.ui'

export const APP_STATE_STATUSES = ['active', 'background', 'extension', 'inactive', 'unknown'] as const

export type AppStateStatus = (typeof APP_STATE_STATUSES)[number]

export const DEVICE_TYPES = ['desktop', 'phone', 'tablet', 'tv', 'unknown'] as const

export type DeviceType = (typeof DEVICE_TYPES)[number]

export type MeasurementSystem = 'metric' | 'uk' | 'us'

export type TextDirection = 'ltr' | 'rtl'

export type DeviceHardware = {
  brand: string | null
  deviceType: DeviceType
  deviceYearClass: number | null
  isPhysicalDevice: boolean
  manufacturer: string | null
  modelName: string | null
  osName: string | null
  osVersion: string | null
  totalMemory: number | null
}

export type DeviceApplication = {
  buildNumber: string | null
  bundleId: string | null
  name: string | null
  sessionId: string
  stage: Stage
  version: string | null
}

export type DeviceLocale = {
  currencyCode: string | null
  languageCode: string | null
  languageTag: string
  measurementSystem: MeasurementSystem | null
  regionCode: string | null
  textDirection: TextDirection
  timeZone: string | null
  uses24HourClock: boolean | null
}

export type ThemeSlice = {
  themePreference: ThemePreference
  setThemePreference: (preference: ThemePreference) => void
}

export type NetworkSlice = {
  networkType: NetInfoStateType
  isConnected: boolean
  setNetwork: (network: NetInfoStateType, isConnected: boolean) => void
}

export type AppStateSlice = {
  appState: AppStateStatus
  setAppState: (appState: AppStateStatus) => void
}

export type InstallationSlice = {
  installationId: string
  firstLaunchAt: Date | null
  firstSeenAppVersion: string | null
  lastLaunchAt: Date | null
  lastSeenAppVersion: string | null
  launchCount: number
  isFirstLaunch: boolean
  isFirstLaunchAfterUpdate: boolean
  previousAppVersion: string | null
  previousLaunchAt: Date | null
  registerLaunch: (appVersion: string | null) => void
}

export type HardwareSlice = {
  hardware: DeviceHardware | null
  setHardware: (hardware: DeviceHardware) => void
}

export type ApplicationSlice = {
  application: DeviceApplication | null
  setApplication: (application: DeviceApplication) => void
}

export type LocaleSlice = {
  locale: DeviceLocale | null
  setLocale: (locale: DeviceLocale) => void
}

export type DeviceStore = AppStateSlice &
  ApplicationSlice &
  HardwareSlice &
  InstallationSlice &
  LocaleSlice &
  NetworkSlice &
  ThemeSlice

export type PersistedDeviceStore = Pick<
  DeviceStore,
  'firstLaunchAt' | 'firstSeenAppVersion' | 'lastLaunchAt' | 'lastSeenAppVersion' | 'launchCount' | 'themePreference'
>

export type CreateThemeSlice = StateCreator<DeviceStore, [['zustand/immer', never]], [], ThemeSlice>

export type CreateAppStateSlice = StateCreator<DeviceStore, [['zustand/immer', never]], [], AppStateSlice>

export type CreateNetworkSlice = StateCreator<DeviceStore, [['zustand/immer', never]], [], NetworkSlice>

export type CreateInstallationSlice = StateCreator<DeviceStore, [['zustand/immer', never]], [], InstallationSlice>

export type CreateHardwareSlice = StateCreator<DeviceStore, [['zustand/immer', never]], [], HardwareSlice>

export type CreateApplicationSlice = StateCreator<DeviceStore, [['zustand/immer', never]], [], ApplicationSlice>

export type CreateLocaleSlice = StateCreator<DeviceStore, [['zustand/immer', never]], [], LocaleSlice>
