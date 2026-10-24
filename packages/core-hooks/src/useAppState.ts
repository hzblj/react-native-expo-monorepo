import {Image} from 'expo-image'
import {useCallback, useEffect, useRef} from 'react'
import {AppState as RNAppState} from 'react-native'

import {Logger} from '~/core.services'
import {type AppStateStatus, useDeviceStore} from '~/core.store'

export const useAppState = () => {
  const appState = useRef(RNAppState.currentState)

  const handleAppStateChange = useCallback(async (status: AppStateStatus) => {
    useDeviceStore.getState().setAppState(status)
    appState.current = status
  }, [])

  const handleMemoryWarning = useCallback(async () => {
    try {
      await Image.clearMemoryCache()
      await Image.clearDiskCache()
    } catch (e) {
      Logger.error(e)
    }
  }, [])

  useEffect(() => {
    const subscription = RNAppState.addEventListener('change', state => {
      void handleAppStateChange(state)
    })

    const memoryWarningSubscription = RNAppState.addEventListener('memoryWarning', () => {
      void handleMemoryWarning()
    })

    return () => {
      subscription.remove()
      memoryWarningSubscription.remove()
    }
  }, [handleAppStateChange, handleMemoryWarning])

  return null
}
