import { env } from '@/bot/middlewares'
import type { Convo, GrammyContext } from '@/bot/types'
import type { Bindings } from '@/types'
import { InlineKeyboard } from 'grammy'

export const ask_human_conversation =
  (environment: Bindings) => async (conversation: Convo, context: GrammyContext) => {
    await conversation.run(env(environment))
    await context.reply('What is your question?')
    const question_context = await conversation.wait()
    const members = await conversation.external(() => context.env.telegroq.get('members', 'text'))

    if (!members) {
      await context.reply('No human experts available at the moment. Please try again later.')
      return
    }

    const member_list = members?.split('\n')
    const random_number = await conversation.random()
    const member = member_list[Math.floor(random_number * member_list.length)]
    const user_id = await conversation.external(() => context.env.telegroq.get(`id:${member}`, 'text'))

    if (!user_id) {
      await context.reply('Chosen human expert has no ID. Please try again later.')
      return
    }

    await conversation.external(() => context.env.telegroq.put(`human_expert:${user_id}`, context.member.id.toString()))
    await question_context.copyMessage(user_id, {
      reply_markup: new InlineKeyboard().text('Answer?', 'reply-human'),
    })

    await context.reply('Your question has been sent to a human expert.')
  }
