import type { Context, NextFunction } from 'grammy'

export const set_config =
  (config: Record<string, unknown>) =>
  <T extends Context & { config: Record<string, unknown> }>(context: T, next: NextFunction) => {
    context.config = config
    return next()
  }
