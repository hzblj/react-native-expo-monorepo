import {Stack} from 'expo-router'

import {useAppTheme} from '~/core.ui'

export default function ProtectedLayout() {
  const theme = useAppTheme()

  return (
    <Stack screenOptions={{contentStyle: {backgroundColor: theme.color('surface.base')}, headerShown: false}}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}
