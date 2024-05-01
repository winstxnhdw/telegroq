import { kv } from '@/bot/middlewares'
import type { Convo, GrammyContext, Reply } from '@/bot/types'
import { InlineKeyboard } from 'grammy'

export const ask_human_conversation =
  (kv_binding: KVNamespace) =>
  async (conversation: Convo, context: GrammyContext): Promise<void> => {
    await conversation.run(kv(kv_binding))

    await context.reply('What is your question?', {
      reply_markup: new InlineKeyboard().text('Cancel', 'cancel'),
    })

    const question_context = await conversation.waitFor(['message', 'callback_query:data'])
    await question_context.editMessageReplyMarkup()

    if (question_context.callbackQuery?.data === 'cancel') {
      await question_context.deleteMessage()
      await context.deleteMessage()
      await question_context.answerCallbackQuery()
      return
    }

    if (!question_context.msgId) {
      await context.reply('Unable to find the question. Please try again later.')
      return
    }

    const members = await conversation.external(() => context.kv.get_members())
    const member_list = members.filter((member) => member !== context.member.username)
    const random_number = await conversation.random()
    const random_member_username = member_list[Math.floor(random_number * member_list.length)]

    if (!random_member_username) {
      await context.reply('No human experts are available. Please try again later.')
      return
    }

    const user_id = await conversation.external(() => context.kv.get_user_id(random_member_username))

    if (!user_id) {
      await context.reply('Chosen human expert has no ID. Please try again later.')
      return
    }

    await context.api.sendMessage(user_id, 'Someone has sent you a question!')
    const { message_id } = await question_context.copyMessage(user_id, {
      reply_markup: new InlineKeyboard().text('Answer', 'reply-human').text('Decline', 'do-not-reply-human').row(),
    })

    const reply_link: Reply = {
      inquirer_user_id: context.member.id,
      original_question_id: question_context.msgId,
      sent_question_id: message_id,
      timestamp: await conversation.now(),
    }

    await conversation.external(() => context.kv.put_reply_link(user_id, reply_link))
    await context.reply('Your question has been sent to a human expert 🧑‍🔬')
  }
