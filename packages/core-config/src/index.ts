import {Config, validateSchema} from './schema'

export type {Config, Stage} from './schema'

export const config: Config = validateSchema({
  STAGE: process.env.EXPO_PUBLIC_STAGE,
})
