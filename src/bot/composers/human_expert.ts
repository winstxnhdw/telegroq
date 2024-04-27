import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const ask_human = new Composer<GrammyContext>()
ask_human.command('ask_human', async (context) => context.conversation.enter('ask_human'))

const reply_human = new Composer<GrammyContext>()
reply_human.command('reply_human', async (context) => context.conversation.enter('reply_human'))

export const human_expert = new Composer<GrammyContext>().use(ask_human).use(reply_human)
