import type { Context, NextFunction } from 'grammy'

export const ignore_old =
  <T extends Context>(threshold = 5 * 60) =>
  (ctx: T, next: NextFunction) => {
    if (ctx.msg?.date && new Date().getTime() / 1000 - ctx.msg.date > threshold) return
    return next()
  }
