import { kv } from '@/bot/middlewares'
import type { Convo, GrammyContext } from '@/bot/types'
import { InlineKeyboard } from 'grammy'

export const reply_human_conversation =
  (kv_binding: KVNamespace) =>
  async (conversation: Convo, context: GrammyContext): Promise<void> => {
    if (!context.msgId) {
      await context.reply('No message ID found!')
      return
    }

    await conversation.run(kv(kv_binding))
    await context.reply('What is your answer?', {
      reply_markup: new InlineKeyboard().text('Decline', 'decline'),
      reply_parameters: { message_id: context.msgId },
    })

    const reply_context = await conversation.waitFor(['message', 'callback_query:data'])
    await reply_context.editMessageReplyMarkup()

    if (reply_context.callbackQuery?.data === 'decline') {
      await Promise.all([reply_context.deleteMessage(), context.reply('You have chosen not to reply to the question.')])
      await reply_context.answerCallbackQuery()
      return
    }

    const sent_message_id = context.msgId
    const reply = await conversation.external(() => context.kv.get_reply_link(context.member.id, sent_message_id))

    if (!reply) {
      await context.reply('Unable to find the user who asked the question.')
      return
    }

    const delete_reply_link = conversation.external(() =>
      context.kv.delete_reply_link(context.member.id, reply.sent_question_id),
    )

    const copy_message_to_expert = reply_context.copyMessage(reply.inquirer_user_id, {
      reply_parameters: { message_id: reply.original_question_id },
    })

    await Promise.all([delete_reply_link, copy_message_to_expert, context.reply('Your answer has been sent.')])
  }
