import {CreateApplicationSlice} from '../types'

export const applicationSlice: CreateApplicationSlice = set => ({
  application: null,
  setApplication: application =>
    set(draft => {
      draft.application = application
    }),
})
