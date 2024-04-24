import type { CustomContext } from '@/bot/types'
import { Router } from '@grammyjs/router'
import Groq from 'groq-sdk'

const router = new Router<CustomContext>((context) => context.session.user)

router.route('chat').on('message:text', async (context) => {
  context.chatAction = 'typing'

  const groq = new Groq({ apiKey: context.config.GROQ_API_KEY })
  const chat_completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: context.message.text ?? '' }],
    model: 'llama3-70b-8192',
  })

  return context.reply(chat_completion.choices[0]?.message.content ?? 'There was an error with the chat bot!')
})

export { router }
