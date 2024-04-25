import type { CustomContext } from '@/bot/types'
import { Composer } from 'grammy'
import Groq from 'groq-sdk'
import { parseInline } from 'marked'

const chat = new Composer<CustomContext>()

chat.on('message:text', async (context) => {
  if (!context.config.MEMBERS_LIST.split(' ').includes(context.from.username ?? ''))
    return context.reply('You are not authorized to use this bot!')

  context.chatAction = 'typing'

  const groq = new Groq({ apiKey: context.config.GROQ_API_KEY })
  const chat_completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: context.message.text ?? '' }],
    model: 'llama3-70b-8192',
  })

  return context.replyWithHTML(
    await parseInline(chat_completion.choices[0]?.message.content ?? 'There was an error with the chat bot!'),
  )
})

export { chat }
