import {useTranslation} from '~/core.i18n'
import {Screen, Text, VStack} from '~/core.ui'

export const Home = () => {
  const {t} = useTranslation()

  return (
    <Screen>
      <VStack px="s16" pt="s36" spacing="s16" wide>
        <VStack bg="surface.primary" borderRadius="large" p="s16" shadow="card" wide>
          <Text variant="headline">{t('general.home')}</Text>
        </VStack>
      </VStack>
    </Screen>
  )
}
