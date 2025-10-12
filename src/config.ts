import type { Bindings } from 'hono/types'
import { object, string } from 'zod'

export const get_config = (environment: Bindings | undefined) =>
  object({
    BOT_TOKEN: string().regex(/^[0-9]+:[a-zA-Z0-9_-]+$/),
    GROQ_API_KEY: string().regex(/^gsk_[a-zA-Z0-9_-]+$/),
    AUTH_TOKEN: string().min(1),
  }).parse(environment)
