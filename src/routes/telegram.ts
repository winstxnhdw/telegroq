import { bot_factory } from '@/bot'
import type { HonoContext } from '@/types'
import { webhookCallback } from 'grammy'
import { Hono } from 'hono'

export const telegram = new Hono<HonoContext>().post('/telegram', async (context) =>
  webhookCallback(bot_factory(context.env), 'hono')(context),
)
