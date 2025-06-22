import { Composer } from 'grammy'
import type { GrammyContext } from '@/bot/types'

const clear = new Composer<GrammyContext>()

clear.command('clear', async (context) => {
  await context.kv.delete_history(context.member.id)

  return context.reply('All context has been cleared!')
})

export { clear }
