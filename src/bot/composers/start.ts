import { Composer } from 'grammy'
import type { GrammyContext } from '@/bot/types'

const start = new Composer<GrammyContext>()

start.command('start', (context) => {
  return context.kv.put_user_id(context.member.username, context.member.id)
})

export { start }
