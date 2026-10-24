import {FC, ReactNode} from 'react'
import {I18nextProvider} from 'react-i18next'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {SafeAreaProvider as SafeArea} from 'react-native-safe-area-context'

import {useAppState, useDeviceInfo, useOnlineManager} from '~/core.hooks'
import {i18n} from '~/core.i18n'

import {ThemeProviders} from './ThemeProvider'

export interface ProvidersProps {
  children: ReactNode
}

export const Providers: FC<ProvidersProps> = ({children}) => {
  useAppState()
  useOnlineManager()
  useDeviceInfo()

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <I18nextProvider i18n={i18n}>
        <ThemeProviders>
          <SafeArea>{children}</SafeArea>
        </ThemeProviders>
      </I18nextProvider>
    </GestureHandlerRootView>
  )
}
