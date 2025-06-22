import { Composer } from 'grammy'
import type { GrammyContext } from '@/bot/types'

const ask_lty = new Composer<GrammyContext>()

ask_lty.command('ask_lty', (context) => {
  return context.conversation.enter('ask_lty')
})

export { ask_lty }
