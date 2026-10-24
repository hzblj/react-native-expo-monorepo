import {z} from 'zod'

const schema = z.object({
  STAGE: z.union([z.literal('development'), z.literal('preview'), z.literal('production')]),
})

export type Config = z.infer<typeof schema>

export type Stage = Config['STAGE']

export const validateSchema = (inputs: unknown): Config => {
  try {
    return schema.parse(inputs)
  } catch (_) {
    throw new Error('Missing or invalid EXPO_PUBLIC_STAGE — check .env or the EAS build profile')
  }
}
