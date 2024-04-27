import type { Convo, GrammyContext } from '@/bot/types'

export const reply_human = async (conversation: Convo, context: GrammyContext) => {
  await context.reply('What is your answer?')
  const reply_context = await conversation.wait()
  const reply_id = await context.env.telegroq.get(`human_expert:${context.member.id}`, 'text')

  if (!reply_id) {
    await context.reply('Unable to find the user who asked the question. Please try again later.')
    return
  }

  await reply_context.copyMessage(reply_id)
}
