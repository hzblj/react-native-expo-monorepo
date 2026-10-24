import {CreateLocaleSlice, DeviceLocale} from '../types'

const isSameLocale = (current: DeviceLocale | null, next: DeviceLocale): boolean =>
  current !== null && JSON.stringify(current) === JSON.stringify(next)

export const localeSlice: CreateLocaleSlice = set => ({
  locale: null,
  setLocale: locale =>
    set(draft => {
      if (!isSameLocale(draft.locale, locale)) {
        draft.locale = locale
      }
    }),
})
