import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENABLE_DEVTOOLS: z.string().default('false'),
})

export const env = envSchema.parse(import.meta.env)
