import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const ask_all = new Composer<GrammyContext>()

ask_all.command('ask_all', (context) => {
  return context.conversation.enter('ask_all')
})

export { ask_all }
