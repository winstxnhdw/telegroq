import { chat } from '@/bot'
import type { CustomContext, SessionData } from '@/bot/types'
import { get_config } from '@/config.js'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import { autoChatAction } from '@grammyjs/auto-chat-action'
import { autoRetry } from '@grammyjs/auto-retry'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession, webhookCallback } from 'grammy'
import { Hono } from 'hono'

type Binding = {
  KV_NAMESPACE: KVNamespace
}

export const telegram = new Hono<{ Bindings: Binding }>().post('/telegram', async (context) => {
  const config = get_config(context.env)
  const bot = new Bot<CustomContext & AutoChatActionFlavor>(config.BOT_TOKEN)

  bot.api.config.use(autoRetry())
  bot.use(autoChatAction())
  bot.use(
    lazySession({
      initial: (): SessionData => ({ user: '', history: '' }),
      storage: new KvAdapter<SessionData>(context.env.KV_NAMESPACE),
    }),
  )

  bot.use(chat)

  return webhookCallback(bot, 'hono')(context.req)
})
