import { bot_info } from '@/bot'
import type { CustomContext, SessionData } from '@/bot/types'
import { get_config } from '@/config'
import { escape_markdown } from '@/utils/escape_markdown.js'
import { autoChatAction } from '@grammyjs/auto-chat-action'
import { autoRetry } from '@grammyjs/auto-retry'
import { type ParseModeFlavor, hydrateReply } from '@grammyjs/parse-mode'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession, webhookCallback } from 'grammy'
import Groq from 'groq-sdk'
import { Hono } from 'hono'

type Binding = {
  telegroq: KVNamespace
}

export const telegram = new Hono<{ Bindings: Binding }>().post('/telegram', async (context) => {
  const config = get_config(context.env)
  const bot = new Bot<ParseModeFlavor<CustomContext>>(config.BOT_TOKEN, { botInfo: bot_info })

  bot.api.config.use(autoRetry())
  bot.use(autoChatAction())
  bot.use(hydrateReply)
  bot.use(
    lazySession({
      initial: (): SessionData => ({ user: '', history: '' }),
      storage: new KvAdapter<SessionData>(context.env.telegroq),
    }),
  )

  bot.use(async (context, next) => {
    context.config = config
    await next()
  })

  // bot.use(chat)

  bot.on('message:text', async (context) => {
    if (!context.config.MEMBERS_LIST.split(' ').includes(context.from.username ?? ''))
      return webhookCallback(bot, 'hono')(context)

    context.chatAction = 'typing'

    const groq = new Groq({ apiKey: context.config.GROQ_API_KEY })
    const chat_completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: context.message.text ?? '' }],
      model: 'llama3-70b-8192',
    })

    return context.replyWithMarkdownV2(
      escape_markdown(chat_completion.choices[0]?.message.content ?? 'There was an error with the chat bot!'),
    )
  })

  return webhookCallback(bot, 'hono')(context)
})
