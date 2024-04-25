import { bot_info } from '@/bot'
import { get_config } from '@/config'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { Bot } from 'grammy'

const ResponseSchema = z.object({
  message: z.string(),
})

const ResponseErrorSchema = z.object({
  error: z.literal('Failed to set the webhook!'),
})

const route = createRoute({
  method: 'get',
  path: '/set_webhook',
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
          example: {
            message: 'https://example.com/telegram has been successfully set as the Telegram webhook endpoint!',
          },
        },
      },
      description: 'The response when the Telegram webhook is set successfully.',
    },
    401: {
      content: {
        'text/plain': { schema: z.literal('Unauthorized') },
      },
      description: 'The response when the request is unauthorized.',
    },
    500: {
      content: {
        'application/json': { schema: ResponseErrorSchema },
      },
      description: 'The response when the Telegram webhook has failed to be set.',
    },
  },
})

const send_set_webhook_request = async (
  bot_token: string,
  url: string,
  path: `/${string}`,
): Promise<string | undefined> => {
  const webhook_url = `${new URL(url).origin}${path}`

  try {
    await new Bot(bot_token, { botInfo: bot_info }).api.setWebhook(webhook_url)
  } catch {
    return undefined
  }

  return webhook_url
}

export const set_webhook = new OpenAPIHono().openapi(route, async (context) => {
  const config = get_config(context.env)
  const webhook_url = await send_set_webhook_request(config.BOT_TOKEN, context.req.url, '/telegram')

  return webhook_url
    ? context.json({ message: `${webhook_url} has been successfully set as the Telegram webhook endpoint!` })
    : context.json({ error: 'Failed to set the webhook!' } as const, 500)
})
