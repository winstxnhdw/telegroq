import { InlineKeyboard } from 'grammy'
import { kv } from '@/bot/middlewares'
import type { Convo, GrammyContext, Reply } from '@/bot/types'

export const ask_all_conversation =
  (kv_binding: KVNamespace) =>
  async (conversation: Convo, context: GrammyContext): Promise<void> => {
    await conversation.run(kv(kv_binding))

    const last_ask_all_timestamp = await context.kv.get_ask_all_timestamp(context.member.id)
    const current_timestamp = await conversation.now()

    if (last_ask_all_timestamp && current_timestamp - last_ask_all_timestamp < 86400000) {
      await context.reply('You can only use this command once a day.')
      return
    }

    const prompt = await context.reply('What is your question?', {
      reply_markup: new InlineKeyboard().text('Cancel', 'cancel'),
    })

    const question_context = await conversation.waitFor(['message', 'callback_query:data'])
    await context.api.editMessageReplyMarkup(prompt.chat.id, prompt.message_id)

    if (question_context.callbackQuery?.data === 'cancel') {
      await Promise.all([question_context.deleteMessage(), context.deleteMessage()])
      await question_context.answerCallbackQuery()
      return
    }

    const message_id = question_context.msgId

    if (!message_id) {
      await context.reply('Unable to find the question. Please try again later.')
      return
    }

    const members = await conversation.external(() => context.kv.get_members())
    const member_list = members.filter((member) => member !== context.member.username)

    await Promise.all(
      member_list.map(async (member) => {
        const user_id = await conversation.external(() => context.kv.get_user_id(member))

        if (!user_id) {
          return
        }

        await context.api.sendMessage(user_id, 'Someone has sent you a question!')
        const { message_id } = await question_context.copyMessage(user_id, {
          reply_markup: new InlineKeyboard().text('Answer', 'reply-human').text('Decline', 'do-not-reply-human').row(),
        })

        const reply_link: Reply = {
          inquirer_user_id: context.member.id,
          original_question_id: message_id,
          sent_question_id: message_id,
          timestamp: await conversation.now(),
        }

        await conversation.external(() => context.kv.put_reply_link(user_id, reply_link))
      }),
    )

    await Promise.all([
      context.kv.put_ask_all_timestamp(context.member.id, current_timestamp),
      context.reply('Your question has been sent to every human expert 🧑‍🔬'),
    ])
  }
