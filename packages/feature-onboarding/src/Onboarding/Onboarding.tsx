import {useCallback} from 'react'

import {useTranslation} from '~/core.i18n'
import {useUserStore} from '~/core.store'
import {Button, Screen, Spacer, Text, VStack} from '~/core.ui'

export const Onboarding = () => {
  const {t} = useTranslation()
  const setOnboarding = useUserStore.use.setOnboarding()

  const onPress = useCallback(() => setOnboarding('completed'), [setOnboarding])

  return (
    <Screen>
      <VStack align="center" px="s16" spacing="s16" tall wide>
        <Spacer />
        <Text align="center" variant="headingS">
          {t('screens.onboarding.title')}
        </Text>
        <Button label={t('screens.onboarding.start')} onPress={onPress} />
        <Spacer />
      </VStack>
    </Screen>
  )
}
