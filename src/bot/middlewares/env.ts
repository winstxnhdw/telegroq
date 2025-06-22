import type { Context, NextFunction } from 'grammy'
import type { Bindings } from '@/types'

export const env = (environment: Bindings) => (context: Context & { env: Bindings }, next: NextFunction) => {
  context.env = environment
  return next()
}
