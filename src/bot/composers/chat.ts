import type { GrammyContext } from '@/bot/types'
import { Composer } from 'grammy'
import { parseInline } from 'marked'

const chat = new Composer<GrammyContext>()

type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const summarise_context = async (context: GrammyContext, messages: Message[]): Promise<Message[]> => {
  const context_to_summarise = messages.map(({ content }) => content).join('\n')

  const result = await context.env.ai.run('@cf/facebook/bart-large-cnn', {
    input_text: context_to_summarise,
    max_length: 8192,
  })

  return [{ role: 'system', content: result.summary }]
}

chat.on('message:text', async (context) => {
  context.chatAction = 'typing'

  const history = await context.env.telegroq.get<Message[]>(context.username, 'json')
  const question = { role: 'user', content: context.message.text } as Message
  const messages = history ? [...history, question] : [question]
  const chat_completion = await context.groq.chat.completions.create({
    messages: messages,
    model: 'llama3-70b-8192',
  })

  const response = chat_completion.choices[0]?.message.content

  if (!response) {
    return context.reply('There was an error with the chat bot!')
  }

  messages.push({ role: 'assistant', content: response })
  const total_tokens = chat_completion.usage?.total_tokens
  const message_to_store = total_tokens && total_tokens > 8192 ? await summarise_context(context, messages) : messages
  await context.env.telegroq.put(context.username, JSON.stringify(message_to_store))

  return context.replyWithHTML(await parseInline(response))
})

export { chat }
