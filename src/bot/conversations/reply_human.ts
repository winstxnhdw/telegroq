import { env } from '@/bot/middlewares'
import type { Convo, GrammyContext, Reply } from '@/bot/types'
import type { Bindings } from '@/types'

export const reply_human_conversation =
  (environment: Bindings) => async (conversation: Convo, context: GrammyContext) => {
    await conversation.run(env(environment))
    await context.reply('What is your answer?')
    const reply_context = await conversation.wait()
    const reply = await conversation.external(() =>
      context.env.telegroq.get<Reply>(`human_expert:${context.member.id}`, 'json'),
    )

    if (!reply) {
      await context.reply('Unable to find the user who asked the question. Please try again later.')
      return
    }

    await conversation.external(() => context.env.telegroq.delete(`human_expert:${context.member.id}`))
    await reply_context.copyMessage(reply.user_id, { reply_to_message_id: reply.message_id })
    await context.reply('Your answer has been sent.')
  }
