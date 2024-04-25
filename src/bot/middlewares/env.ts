import type { Bindings } from '@/types'
import type { Context, NextFunction } from 'grammy'

export const env =
  (env: Bindings) =>
  <T extends Context & { env: Bindings }>(context: T, next: NextFunction) => {
    context.env = env
    return next()
  }
