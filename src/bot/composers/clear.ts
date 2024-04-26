import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const clear_command = new Composer<GrammyContext>()

clear_command.command('clear', async (context) => {
  context.chatAction = 'typing'
  await context.env.telegroq.delete(context.username)

  return context.reply('All context has been cleared!')
})

export { clear_command }
