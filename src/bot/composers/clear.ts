import type { GrammyContext } from '@/bot/types'
import { is_not_member } from '@/kv'
import { Composer } from 'grammy'

const clear_command = new Composer<GrammyContext>()

clear_command.command('clear', async (context) => {
  if (!context.from || !context.from.username) return
  if (await is_not_member(context.env.telegroq, context.from.username)) return

  await context.env.telegroq.delete(context.from.username)
  await context.reply('All context has been cleared!')
})

export { clear_command }
