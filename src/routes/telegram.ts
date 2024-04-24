import { bot_info, chat } from '@/bot'
import type { CustomContext, SessionData } from '@/bot/types'
import { get_config } from '@/config'
import { autoChatAction } from '@grammyjs/auto-chat-action'
import { autoRetry } from '@grammyjs/auto-retry'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession, webhookCallback } from 'grammy'
import { Hono } from 'hono'

type Binding = {
  telegroq: KVNamespace
}

export const telegram = new Hono<{ Bindings: Binding }>().post('/telegram', async (context) => {
  console.log(context.req)
  const config = get_config(context.env)
  const bot = new Bot<CustomContext>(config.BOT_TOKEN, { botInfo: bot_info })

  bot.api.config.use(autoRetry())
  bot.use(autoChatAction())
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

  bot.use(chat)

  return webhookCallback(bot, 'hono')(context.req)
})
