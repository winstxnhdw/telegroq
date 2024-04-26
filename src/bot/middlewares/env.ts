import type { Bindings } from '@/types'
import type { Context, NextFunction } from 'grammy'

export const env =
  (environment: Bindings) =>
  <T extends Context & { env: Bindings }>(context: T, next: NextFunction) => {
    context.env = environment
    return next()
  }
