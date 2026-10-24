import {ThemeProvider as RNThemeProvider} from 'expo-router'
import {type FC, type ReactNode, useMemo} from 'react'

import {useDeviceStore} from '~/core.store'
import {KaraProvider, navigationTheme, useAppTheme} from '~/core.ui'

export interface ThemePros {
  children: ReactNode
}

/**
 * Sits *inside* `KaraProvider` so it maps the same `Theme` everything else sees: the system half of the palette is
 * resolved there, and a navigation theme built outside it would have nothing to resolve a system token into.
 */
const NavigationTheme: FC<ThemePros> = ({children}) => {
  const theme = useAppTheme()
  const value = useMemo(() => navigationTheme(theme), [theme])

  return <RNThemeProvider value={value}>{children}</RNThemeProvider>
}

export const ThemeProviders: FC<ThemePros> = ({children}) => {
  const themePreference = useDeviceStore.use.themePreference()

  return (
    <KaraProvider themePreference={themePreference}>
      <NavigationTheme>{children}</NavigationTheme>
    </KaraProvider>
  )
}
