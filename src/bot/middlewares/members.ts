import type { Context, NextFunction } from 'grammy'
import type { Member } from '@/bot/types'
import type { Bindings } from '@/types'

const is_not_member = async (kv: KVNamespace, username: string): Promise<boolean> => {
  const usernames = await kv.get('members', 'text')
  return !usernames || !usernames.split('\n').includes(username)
}

export const members = (environment: Bindings) => async (context: Context & Member, next: NextFunction) => {
  if (!context.from || !context.from.username) return
  if (await is_not_member(environment.telegroq, context.from.username)) return

  context.member = {
    username: context.from.username,
    id: context.from.id,
  }

  return next()
}
