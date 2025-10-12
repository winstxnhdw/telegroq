import { Composer } from 'grammy'
import telegramify from 'telegramify-markdown'
import type { GrammyContext, Message } from '@/bot/types'

const chat = new Composer<GrammyContext>()

const summarise_context = async (context: GrammyContext, messages: Message[]): Promise<Message[]> => {
  const context_to_summarise = messages.map(({ content }) => content).join('\n')

  const result = await context.env.ai.run('@cf/facebook/bart-large-cnn', {
    input_text: context_to_summarise,
    max_length: 8192,
  })

  return [{ role: 'assistant', content: result.summary }]
}

const get_history = (
  history: Message[] | undefined,
  system_prompt: string | undefined,
  question_prompt: string | undefined,
): Message[] => {
  const messages = history ?? []

  if (system_prompt) {
    messages.unshift({ role: 'system', content: system_prompt })
  }

  if (question_prompt) {
    messages.push({ role: 'user', content: question_prompt })
  }

  return messages
}

chat.on('message:text', async (context) => {
  context.chatAction = 'typing'

  const messages = get_history(
    await context.kv.get_history(context.member.id),
    await context.kv.get_system_prompt(context.member.id),
    context.message.text,
  )

  const chat_completion = await context.groq.chat.completions.create({
    messages: messages,
    model: 'openai/gpt-oss-20b',
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

  const parsed_response = telegramify(response, 'escape')

  return parsed_response.length <= 4096
    ? context.replyWithMarkdownV2(parsed_response)
    : context.replyWithHTML(parsed_response)
})

chat.on('message:photo', async (context) => {
  context.chatAction = 'typing'

  const file = await context.getFile()

  const messages = get_history(
    await context.kv.get_history(context.member.id),
    await context.kv.get_system_prompt(context.member.id),
    undefined,
  )

  const text_content = {
    type: 'text',
    text: context.message.caption || 'Respond based on the image below.',
  } as const

  const image_content = {
    type: 'image_url',
    image_url: { url: file.getUrl() },
  } as const

  messages.push({ role: 'user', content: [text_content, image_content] })

  const chat_completion = await context.groq.chat.completions.create({
    messages: messages,
    model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
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

  const parsed_response = telegramify(response, 'escape')

  return parsed_response.length <= 4096
    ? context.replyWithMarkdownV2(parsed_response)
    : context.replyWithHTML(parsed_response)
})

chat.on(['message:voice', 'message:audio'], async (context) => {
  context.chatAction = 'typing'

  const file = await context.getFile()
  const audio_completion = await context.groq.audio.transcriptions.create({
    model: 'whisper-large-v3-turbo',
    url: file.getUrl(),
  })

  const messages = get_history(
    await context.kv.get_history(context.member.id),
    await context.kv.get_system_prompt(context.member.id),
    audio_completion.text,
  )

  const chat_completion = await context.groq.chat.completions.create({
    messages: messages,
    model: 'openai/gpt-oss-20b',
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

  const parsed_response = telegramify(response, 'escape')

  return parsed_response.length <= 4096
    ? context.replyWithMarkdownV2(parsed_response)
    : context.replyWithHTML(parsed_response)
})

export { chat }
