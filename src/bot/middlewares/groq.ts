import type { Context, NextFunction } from 'grammy'
import { Groq } from 'groq-sdk'
import type { Bindings } from '@/types'

export const groq = (environment: Bindings) => (context: Context & { groq: Groq }, next: NextFunction) => {
  context.groq = new Groq({ apiKey: environment.GROQ_API_KEY })
  return next()
}
