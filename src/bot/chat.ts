import type { GrammyContext } from '@/bot/types'
import { is_member } from '@/kv/is_member.js'
import { Composer } from 'grammy'
import { Groq } from 'groq-sdk'
import { parseInline } from 'marked'

const chat = new Composer<GrammyContext>()

chat.on('message:text', async (context) => {
  if (!context.from.username) return
  if (await is_member(context.env.telegroq, context.from.username)) return

  context.chatAction = 'typing'

  const groq = new Groq({ apiKey: context.env.GROQ_API_KEY })
  const chat_completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'start' },
      { role: 'user', content: context.message.text ?? '' },
    ],
    model: 'llama3-70b-8192',
  })

  return context.replyWithHTML(
    await parseInline(chat_completion.choices[0]?.message.content ?? 'There was an error with the chat bot!'),
  )
})

export { chat }
