import type { GrammyContext, Reply } from '@/bot/types'
import { Composer } from 'grammy'

const ask_human = new Composer<GrammyContext>()

ask_human.command('ask_human', (context) => context.conversation.enter('ask_human'))

ask_human.callbackQuery('reply-human', async (context) => {
  await context.conversation.enter('reply_human')
  await context.editMessageReplyMarkup()

  return context.answerCallbackQuery()
})

ask_human.callbackQuery('do-not-reply-human', async (context) => {
  const reply = await context.env.telegroq.get<Reply>(`human_expert:${context.member.id}`, 'json')

  if (reply) {
    await context.api.sendMessage(reply.user_id, 'The human expert has refused to answer your question.', {
      reply_to_message_id: reply.message_id,
    })
  }

  await context.env.telegroq.delete(`human_expert:${context.member.id}`)
  await context.reply('You have chosen not to reply to the question.')
  await context.editMessageReplyMarkup()

  return context.answerCallbackQuery()
})

export { ask_human }
