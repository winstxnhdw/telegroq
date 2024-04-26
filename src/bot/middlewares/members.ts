import type { Bindings } from '@/types'
import type { Context, NextFunction } from 'grammy'

const is_not_member = async (kv: KVNamespace, username: string): Promise<boolean> => {
  const usernames = await kv.get('members', 'text')
  return !usernames || !usernames.split('\n').includes(username)
}

export const members =
  (environment: Bindings) =>
  async <T extends Context & { username: string }>(context: T, next: NextFunction) => {
    if (!context.from || !context.from.username) return
    if (await is_not_member(environment.telegroq, context.from.username)) return

    context.username = context.from.username
    return next()
  }
