import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const ask_lty = new Composer<GrammyContext>()

ask_lty.command('ask_lty', async (context) => {
  context.chatAction = 'typing'
  return context.conversation.enter('ask_lty')
})

export { ask_lty }
