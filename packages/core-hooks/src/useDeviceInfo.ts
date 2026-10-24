import * as Application from 'expo-application'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import {getCalendars, getLocales} from 'expo-localization'
import {useEffect} from 'react'

import {config} from '~/core.config'
import {
  type DeviceApplication,
  type DeviceHardware,
  type DeviceLocale,
  type DeviceType,
  useDeviceStore,
} from '~/core.store'

const deviceTypes: Record<Device.DeviceType, DeviceType> = {
  [Device.DeviceType.DESKTOP]: 'desktop',
  [Device.DeviceType.PHONE]: 'phone',
  [Device.DeviceType.TABLET]: 'tablet',
  [Device.DeviceType.TV]: 'tv',
  [Device.DeviceType.UNKNOWN]: 'unknown',
}

let launchRegistered = false

const readHardware = (): DeviceHardware => ({
  brand: Device.brand,
  deviceType: Device.deviceType === null ? 'unknown' : deviceTypes[Device.deviceType],
  deviceYearClass: Device.deviceYearClass,
  isPhysicalDevice: Device.isDevice,
  manufacturer: Device.manufacturer,
  modelName: Device.modelName,
  osName: Device.osName,
  osVersion: Device.osVersion,
  totalMemory: Device.totalMemory,
})

const readApplication = (): DeviceApplication => ({
  buildNumber: Application.nativeBuildVersion,
  bundleId: Application.applicationId,
  name: Application.applicationName,
  sessionId: Constants.sessionId,
  stage: config.STAGE,
  version: Application.nativeApplicationVersion,
})

const readLocale = (): DeviceLocale => {
  const [locale] = getLocales()
  const [calendar] = getCalendars()

  return {
    currencyCode: locale.currencyCode,
    languageCode: locale.languageCode,
    languageTag: locale.languageTag,
    measurementSystem: locale.measurementSystem,
    regionCode: locale.regionCode,
    textDirection: locale.textDirection,
    timeZone: calendar.timeZone,
    uses24HourClock: calendar.uses24hourClock,
  }
}

export const useDeviceInfo = () => {
  const appState = useDeviceStore.use.appState()

  useEffect(() => {
    const {registerLaunch, setApplication, setHardware, setLocale} = useDeviceStore.getState()

    setHardware(readHardware())
    setApplication(readApplication())
    setLocale(readLocale())

    if (launchRegistered) {
      return
    }

    launchRegistered = true
    registerLaunch(Application.nativeApplicationVersion)
  }, [])

  useEffect(() => {
    if (appState === 'active') {
      useDeviceStore.getState().setLocale(readLocale())
    }
  }, [appState])
}
