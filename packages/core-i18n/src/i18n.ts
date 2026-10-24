import 'intl-pluralrules'

import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

import {fallbackLng, lng, resources} from './const'
import type {LocalizationLanguage} from './types'

void i18n.use(initReactI18next).init({
  fallbackLng,
  lng,
  pluralSeparator: '_',
  resources,
})

/** `i18n.changeLanguage` narrowed to the languages that actually ship. */
export const changeLanguage = (language: LocalizationLanguage) => i18n.changeLanguage(language)

export default i18n
