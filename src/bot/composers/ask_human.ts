import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const ask_human = new Composer<GrammyContext>()
ask_human.command('ask_human', (context) => context.conversation.enter('ask_human'))
ask_human.callbackQuery('reply-human', (context) => context.conversation.enter('reply_human'))

export { ask_human }
