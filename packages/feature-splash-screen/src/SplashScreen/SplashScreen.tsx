import * as ExpoSplashScreen from 'expo-splash-screen'
import {FC, useCallback, useState} from 'react'
import {Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming} from 'react-native-reanimated'
import {scheduleOnRN} from 'react-native-worklets'

import {Logger} from '~/core.services'
import {Box, duration, Image, useAppTheme} from '~/core.ui'

ExpoSplashScreen.preventAutoHideAsync().catch(Logger.error)

ExpoSplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

// The hand-off's own choreography: slower and longer than any interface motion, so it is not on the duration scale.
const SPIN_DELAY = 800
const SPIN = 1000

export const SplashScreen: FC = () => {
  const {dark} = useAppTheme()
  const [loaded, setLoaded] = useState(false)
  const rotation = useSharedValue(0)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)
  const opacityBackground = useSharedValue(1)

  const rStyleIcon = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
      transform: [{rotate: `${rotation.value}deg`}, {scale: scale.value}],
    }),
    []
  )

  const rStyleBackground = useAnimatedStyle(
    () => ({
      opacity: opacityBackground.value,
    }),
    []
  )

  const startAnimation = useCallback(() => {
    rotation.value = withDelay(
      SPIN_DELAY,
      withTiming(360, {duration: SPIN, easing: Easing.inOut(Easing.linear)}, finished => {
        if (!finished) {
          return
        }

        scale.value = withTiming(20, {duration: duration.verySlow, easing: Easing.inOut(Easing.linear)}, finished => {
          if (!finished) {
            return
          }

          scheduleOnRN(setLoaded, true)
        })

        opacity.value = withTiming(0, {duration: duration.slow, easing: Easing.linear})
        opacityBackground.value = withTiming(0, {duration: duration.slow, easing: Easing.linear})
      })
    )
  }, [opacity, opacityBackground, rotation, scale])

  const onDisplay = useCallback(() => {
    ExpoSplashScreen.hide()
    startAnimation()
  }, [startAnimation])

  if (loaded) {
    return null
  }

  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      left={0}
      bottom={0}
      flex={1}
      bg="surface.base"
      align="center"
      justify="center"
      style={rStyleBackground}
    >
      <Box style={rStyleIcon}>
        {!dark && (
          <Image
            source={require('~/core.resources/png/splash-icon-light.png')}
            style={{aspectRatio: 1, width: 200}}
            onDisplay={onDisplay}
          />
        )}
        {dark && (
          <Image
            source={require('~/core.resources/png/splash-icon-dark.png')}
            style={{aspectRatio: 1, width: 200}}
            onDisplay={onDisplay}
          />
        )}
      </Box>
    </Box>
  )
}
