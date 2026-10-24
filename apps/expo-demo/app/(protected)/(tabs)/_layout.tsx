import {useTranslation} from '~/core.i18n'
import {Tabs} from '~/core.ui'

export default function TabLayout() {
  const {t} = useTranslation()

  return (
    <Tabs>
      <Tabs.Screen icon="home" name="index" selectedIcon="home-filled" title={t('general.home')} />
    </Tabs>
  )
}
