import { kv } from '@/bot/middlewares'
import type { Convo, GrammyContext } from '@/bot/types'

export const reply_human_conversation =
  (kv_binding: KVNamespace) =>
  async (conversation: Convo, context: GrammyContext): Promise<void> => {
    if (!context.msgId) {
      await context.reply('No message ID found!')
      return
    }

    await conversation.run(kv(kv_binding))

    if (!context.msgId) {
      await context.reply('Unable to find the question.')
      return
    }

    await context.reply('What is your answer?', { reply_parameters: { message_id: context.msgId } })
    const reply_context = await conversation.wait()
    const sent_message_id = context.msgId
    const reply = await conversation.external(() => context.kv.get_reply_link(context.member.id, sent_message_id))

    if (!reply) {
      await context.reply('Unable to find the user who asked the question.')
      return
    }

    await conversation.external(() => context.kv.delete_reply_link(context.member.id, reply.sent_question_id))
    await reply_context.copyMessage(reply.inquirer_user_id, {
      reply_parameters: { message_id: reply.original_question_id },
    })

    await context.reply('Your answer has been sent.')
  }
