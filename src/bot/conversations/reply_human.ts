import type { Convo, GrammyContext } from '@/bot/types'

export const reply_human_conversation = async (conversation: Convo, context: GrammyContext) => {
  await context.reply('What is your answer?')
  const reply_context = await conversation.wait()
  const reply_id = await conversation.external(() =>
    context.env.telegroq.get(`human_expert:${context.member.id}`, 'text'),
  )

  if (!reply_id) {
    await context.reply('Unable to find the user who asked the question. Please try again later.')
    return
  }

  await conversation.external(() => context.env.telegroq.delete(`human_expert:${context.member.id}`))
  await reply_context.copyMessage(reply_id)
  await context.reply('Your answer has been sent.')
}
