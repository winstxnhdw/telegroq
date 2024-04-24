import type { Context, NextFunction } from 'grammy'

export const ignore_old =
  <T extends Context>(milliseconds = 5 * 60000) =>
  (context: T, next: NextFunction) => {
    if (context.msg?.date && new Date().getTime() - context.msg.date * 1000 > milliseconds) return
    return next()
  }
