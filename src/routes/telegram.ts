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

const telegram = new Hono<{ Bindings: Binding }>()

telegram.post('/telegram', async (context) => {
  const body = await context.req.json()
  console.log(JSON.stringify(body))

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

  return webhookCallback(bot, 'cloudflare-mod')(context.req)
})

telegram.get('/telegram', async (context) => {
  const config = get_config(context.env)
  const bot = new Bot<CustomContext>(config.BOT_TOKEN, { botInfo: bot_info })
  return webhookCallback(bot, 'cloudflare-mod')(context.req)
})

export { telegram }
