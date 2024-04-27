import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const clear = new Composer<GrammyContext>()

clear.command('clear', async (context) => {
  context.chatAction = 'typing'
  await context.env.telegroq.delete(context.member.username)

  return context.reply('All context has been cleared!')
})

export { clear }
