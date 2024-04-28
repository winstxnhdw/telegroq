import { kv } from '@/bot/middlewares'
import type { Convo, GrammyContext } from '@/bot/types'

export const reply_human_conversation =
  (kv_binding: KVNamespace) =>
  async (conversation: Convo, context: GrammyContext): Promise<void> => {
    await conversation.run(kv(kv_binding))
    await context.reply('What is your answer?')
    const reply_context = await conversation.wait()
    const reply = await conversation.external(() => context.kv.get_reply_link(context.member.id))

    if (!reply) {
      await context.reply('Unable to find the user who asked the question. Please try again later.')
      return
    }

    await conversation.external(() => context.kv.delete_reply_link(context.member.id))
    await reply_context.copyMessage(reply.user_id, { reply_to_message_id: reply.message_id })
    await context.reply('Your answer has been sent.')
  }
