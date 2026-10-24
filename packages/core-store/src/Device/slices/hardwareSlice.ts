import {CreateHardwareSlice} from '../types'

export const hardwareSlice: CreateHardwareSlice = set => ({
  hardware: null,
  setHardware: hardware =>
    set(draft => {
      draft.hardware = hardware
    }),
})
