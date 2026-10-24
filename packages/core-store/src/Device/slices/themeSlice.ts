import {CreateThemeSlice} from '../types'

export const themeSlice: CreateThemeSlice = set => ({
  setThemePreference: preference =>
    set(draft => {
      draft.themePreference = preference
    }),
  themePreference: 'system',
})
