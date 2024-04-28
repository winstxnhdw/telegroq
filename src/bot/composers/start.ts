import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const start = new Composer<GrammyContext>()

start.command('start', (context) => context.kv.put_user_id(context.member.username, context.member.id))

export { start }
