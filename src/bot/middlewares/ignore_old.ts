import type { Context, NextFunction } from 'grammy'

export const ignore_old =
  (milliseconds = 5 * 60000) =>
  (context: Context, next: NextFunction) => {
    if (context.msg?.date && new Date().getTime() - context.msg.date * 1000 > milliseconds) return
    return next()
  }
