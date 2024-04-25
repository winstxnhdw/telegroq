import type { GrammyContext } from '@/bot/types'
import { is_not_member } from '@/kv'
import { Composer } from 'grammy'
import { Groq } from 'groq-sdk'
import { parseInline } from 'marked'

const chat = new Composer<GrammyContext>()

type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

chat.on('message:text', async (context) => {
  if (!context.from.username) return
  if (await is_not_member(context.env.telegroq, context.from.username)) return

  context.chatAction = 'typing'

  const messages = await context.env.telegroq.get<Message[]>(context.from.username, 'json')
  const question = { role: 'user', content: context.message.text } as Message
  let new_messages = messages ? [...messages, question] : [question]
  const groq = new Groq({ apiKey: context.env.GROQ_API_KEY })
  const chat_completion = await groq.chat.completions.create({
    messages: new_messages,
    model: 'llama3-70b-8192',
  })

  const response = chat_completion.choices[0]?.message.content
  const total_tokens = chat_completion.usage?.total_tokens

  if (!response) {
    return context.reply('There was an error with the chat bot!')
  }

  new_messages.push({ role: 'assistant', content: response })

  if (total_tokens && total_tokens > 8192) {
    const context_to_summarise = new_messages
      .slice(0, -2)
      .map(({ content }) => content)
      .join('\n')

    const summary: string = await context.env.ai.run('@cf/facebook/bart-large-cnn', context_to_summarise)
    new_messages = [{ role: 'system', content: summary }, ...new_messages.slice(-2)]
  }

  await context.env.telegroq.put(context.from.username, JSON.stringify(new_messages))

  return context.replyWithHTML(await parseInline(response))
})

export { chat }
