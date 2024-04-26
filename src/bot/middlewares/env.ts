import type { Bindings } from '@/types'
import type { Context, NextFunction } from 'grammy'

export const env = (environment: Bindings) => (context: Context & { env: Bindings }, next: NextFunction) => {
  context.env = environment
  return next()
}
