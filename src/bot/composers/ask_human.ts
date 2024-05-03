import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const ask_human = new Composer<GrammyContext>()

ask_human.command('ask_human', (context) => {
  return context.conversation.enter('ask_human')
})

ask_human.callbackQuery('reply-human', async (context) => {
  await context.editMessageReplyMarkup()
  await context.answerCallbackQuery()

  return context.conversation.enter('reply_human')
})

ask_human.callbackQuery('do-not-reply-human', async (context): Promise<true> => {
  await context.editMessageReplyMarkup()

  if (!context.msgId) {
    await context.reply('No message ID found!')
    return context.answerCallbackQuery()
  }

  const reply = await context.kv.get_reply_link(context.member.id, context.msgId)

  if (reply) {
    await context.api.sendMessage(reply.inquirer_user_id, 'The human expert has refused to answer your question.', {
      reply_parameters: { message_id: reply.original_question_id },
    })
  }

  const delete_reply_link = context.kv.delete_reply_link(context.member.id, context.msgId)
  const send_decline_reply = context.reply('You have chosen not to reply to the question.', {
    reply_parameters: { message_id: Number(context.callbackQuery.id) },
  })

  await Promise.all([delete_reply_link, send_decline_reply])

  return context.answerCallbackQuery()
})

export { ask_human }
