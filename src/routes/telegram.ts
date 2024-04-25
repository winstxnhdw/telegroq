import { bot_info, chat } from '@/bot'
import { ignore_old, set_config } from '@/bot/middlewares'
import type { CustomContext, SessionData } from '@/bot/types'
import { get_config } from '@/config'
import { autoChatAction } from '@grammyjs/auto-chat-action'
import { autoRetry } from '@grammyjs/auto-retry'
import { hydrateReply } from '@grammyjs/parse-mode'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession, webhookCallback } from 'grammy'
import { Hono } from 'hono'

type Binding = {
  telegroq: KVNamespace
}

export const telegram = new Hono<{ Bindings: Binding }>().post('/telegram', async (context) => {
  const config = get_config(context.env)
  const bot = new Bot<CustomContext>(config.BOT_TOKEN, { botInfo: bot_info })

  bot.api.config.use(autoRetry())
  bot.use(autoChatAction(), hydrateReply, ignore_old(), set_config(config), chat)

  bot.use(
    lazySession({
      initial: (): SessionData => ({ user: '', history: '' }),
      storage: new KvAdapter<SessionData>(context.env.telegroq),
    }),
  )

  return webhookCallback(bot, 'hono')(context)
})
