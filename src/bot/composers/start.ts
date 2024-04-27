import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const start = new Composer<GrammyContext>()

start.command('start', async (context) =>
  context.env.telegroq.put(`id:${context.member.username}`, context.member.id.toString()),
)

export { start }
