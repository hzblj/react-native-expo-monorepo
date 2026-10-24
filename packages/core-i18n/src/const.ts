import {getLocales} from 'expo-localization'

import {default as cs} from './languages/cs.json'
import {default as en} from './languages/en.json'
import {type LocalizationLanguage, localizationLanguages} from './types'

/**
 * English is the schema the other languages are held to: a key missing from — or added to — another
 * language file refuses to compile here, instead of falling back silently at runtime.
 */
type TranslationSchema = typeof en

const toResource = (translation: TranslationSchema) => ({translation})

export const resources = {
  [localizationLanguages.CS]: toResource(cs),
  [localizationLanguages.EN]: toResource(en),
}

const isSupported = (code: string | null): code is LocalizationLanguage =>
  Object.values(localizationLanguages).some(language => language === code)

/** The device's preferred language when it ships with the app — English otherwise. */
const deviceLanguage = (): LocalizationLanguage => {
  const code = getLocales()[0]?.languageCode ?? null

  return isSupported(code) ? code : localizationLanguages.EN
}

export const fallbackLng = localizationLanguages.EN
export const lng = deviceLanguage()
