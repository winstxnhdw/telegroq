import { webhookCallback } from 'grammy'
import { Hono } from 'hono'
import { bot_factory } from '@/bot'
import type { HonoContext } from '@/types'

export const telegram = new Hono<HonoContext>().post('/telegram', (context) => {
  context.env.BOT_URL = new URL(context.req.url).origin
  return webhookCallback(bot_factory(context.env), 'hono')(context)
})
