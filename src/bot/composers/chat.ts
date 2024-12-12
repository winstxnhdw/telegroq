import type { GrammyContext, Message } from '@/bot/types'
import { Composer } from 'grammy'
import { parseInline } from 'marked'

const chat = new Composer<GrammyContext>()

const summarise_context = async (context: GrammyContext, messages: Message[]): Promise<Message[]> => {
  const context_to_summarise = messages.map(({ content }) => content).join('\n')

  const result = await context.env.ai.run('@cf/facebook/bart-large-cnn', {
    input_text: context_to_summarise,
    max_length: 8192,
  })

  return [{ role: 'assistant', content: result.summary }]
}

chat.on('message:text', async (context) => {
  context.chatAction = 'typing'
  const system = await context.kv.get_system_prompt(context.member.username)
  const system_prompt = { role: 'system', content: system } as const
  const question_prompt = { role: 'user', content: context.message.text } as const
  const history = await context.kv.get_history(context.member.id)
  const messages = history ? [system_prompt, ...history, question_prompt] : [system_prompt, question_prompt]

  const chat_completion = await context.groq.chat.completions.create({
    messages: messages,
    model: 'llama-3.3-70b-versatile',
  })

  const response = chat_completion.choices[0]?.message.content

  if (!response) {
    return context.reply('There was an error with the chat bot!')
  }

  messages.shift()
  messages.push({ role: 'assistant', content: response })

  const total_tokens = chat_completion.usage?.total_tokens
  const messages_to_store = total_tokens && total_tokens > 16384 ? await summarise_context(context, messages) : messages
  await context.kv.put_history(context.member.id, messages_to_store)

  const parsed_response = await parseInline(response)
  return context.replyWithHTML(parsed_response.substring(0, 4096))
})

export { chat }
