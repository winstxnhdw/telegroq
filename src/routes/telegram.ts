import { bot_info, chat } from '@/bot'
import { env, ignore_old } from '@/bot/middlewares'
import type { GrammyContext, SessionData } from '@/bot/types'
import { get_config } from '@/config'
import type { HonoContext } from '@/types'
import { autoChatAction } from '@grammyjs/auto-chat-action'
import { autoRetry } from '@grammyjs/auto-retry'
import { hydrateReply } from '@grammyjs/parse-mode'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession, webhookCallback } from 'grammy'
import { Hono } from 'hono'

export const telegram = new Hono<HonoContext>().post('/telegram', async (context) => {
  const config = get_config(context.env)
  const bot = new Bot<GrammyContext>(config.BOT_TOKEN, { botInfo: bot_info })

  bot.api.config.use(autoRetry())
  env(context.env)
  bot.use(autoChatAction(), hydrateReply, ignore_old(), env(context.env), chat)

  bot.use(
    lazySession({
      initial: (): SessionData => ({ user: '', history: '' }),
      storage: new KvAdapter<SessionData>(context.env.telegroq),
    }),
  )

  return webhookCallback(bot, 'hono')(context)
})
