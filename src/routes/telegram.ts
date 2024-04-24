import type { CustomContext, SessionData } from '@/bot/types'
import { get_config } from '@/config.js'
import { KvAdapter } from '@grammyjs/storage-cloudflare'
import { Bot, lazySession, webhookCallback } from 'grammy'
import { Hono } from 'hono'

type Binding = {
  KV_NAMESPACE: KVNamespace
}

export const telegram = new Hono<{ Bindings: Binding }>().post('/telegram', async (context) => {
  const config = get_config(context.env)
  const bot = new Bot<CustomContext>(config.BOT_TOKEN)

  bot.use(
    lazySession({
      initial: (): SessionData => ({ user: '', history: '' }),
      storage: new KvAdapter<SessionData>(context.env.KV_NAMESPACE),
    }),
  )

  return webhookCallback(bot, 'hono')(context.req)
})
