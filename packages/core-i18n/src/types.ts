export const localizationLanguages = {
  CS: 'cs',
  EN: 'en',
} as const

export type LocalizationLanguage = (typeof localizationLanguages)[keyof typeof localizationLanguages]
