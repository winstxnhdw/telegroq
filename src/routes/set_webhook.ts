import { get_config } from '@/config.js'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { Bot } from 'grammy'

const ResponseSchema = z.object({
  message: z.literal('Webhook set successfully!'),
})

const ResponseErrorSchema = z.object({
  error: z.literal('Failed to set the webhook!'),
})

const route = createRoute({
  method: 'get',
  path: '/set_webhook',
  responses: {
    200: {
      content: {
        'application/json': { schema: ResponseSchema },
      },
      description: 'The response when the Telegram webhook is set successfully.',
    },
    500: {
      content: {
        'application/json': { schema: ResponseErrorSchema },
      },
      description: 'The response when the Telegram webhook has failed to be set.',
    },
  },
})

const send_set_webhook_request = async (bot_token: string, url: string): Promise<boolean> => {
  try {
    await new Bot(bot_token).api.setWebhook(`${new URL(url).origin}/telegram`)
  } catch {
    return false
  }

  return true
}

export const set_webhook = new OpenAPIHono().openapi(route, async (context) => {
  const config = get_config(context.env)
  const success = await send_set_webhook_request(config.BOT_TOKEN, context.req.url)

  return success
    ? context.json({ message: 'Webhook set successfully!' } as const)
    : context.json({ error: 'Failed to set the webhook!' } as const, 500)
})
