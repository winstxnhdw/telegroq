import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'

const ask_human = new Composer<GrammyContext>()

ask_human.command('ask_human', async (context) => {
  context.chatAction = 'typing'
  return context.conversation.enter('ask_human')
})

ask_human.callbackQuery('reply-human', async (context) => {
  context.chatAction = 'typing'
  await context.conversation.enter('reply_human')
  await context.editMessageReplyMarkup()

  return context.answerCallbackQuery()
})

ask_human.callbackQuery('do-not-reply-human', async (context) => {
  context.chatAction = 'typing'
  const reply = await context.kv.get_reply_link(context.member.id)

  if (reply) {
    await context.api.sendMessage(reply.user_id, 'The human expert has refused to answer your question.', {
      reply_to_message_id: reply.message_id,
    })
  }

  await context.kv.delete_reply_link(context.member.id)
  await context.reply('You have chosen not to reply to the question.')
  await context.editMessageReplyMarkup()

  return context.answerCallbackQuery()
})

export { ask_human }
