import { bot_info } from '@/bot'
import { get_config } from '@/config'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { Bot } from 'grammy'

const ResponseSchema = z.object({
  message: z.literal('The Telegram webhook endpoint has been deleted!'),
})

const ResponseErrorSchema = z.object({
  error: z.literal('Failed to delete the webhook!'),
})

const route = createRoute({
  method: 'get',
  path: '/delete_webhook',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
        },
      },
      description: 'The response when the Telegram webhook is deleted successfully.',
    },
    500: {
      content: {
        'application/json': { schema: ResponseErrorSchema },
      },
      description: 'The response when the Telegram webhook has failed to be deleted.',
    },
  },
})

const send_delete_webhook_request = async (bot_token: string): Promise<true | undefined> => {
  try {
    return new Bot(bot_token, { botInfo: bot_info }).api.deleteWebhook()
  } catch {
    return undefined
  }
}

export const delete_webhook = new OpenAPIHono().openapi(route, async (context) => {
  const config = get_config(context.env)
  const request = await send_delete_webhook_request(config.BOT_TOKEN)

  return request
    ? context.json({ message: 'The Telegram webhook endpoint has been deleted!' } as const)
    : context.json({ error: 'Failed to delete the webhook!' } as const, 500)
})
