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
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
        },
      },
      description: 'The response when the Telegram webhook is deleted successfully.',
    },
    401: {
      content: {
        'text/plain': {
          schema: z.literal('Unauthorized'),
        },
      },
      description: 'The response when the request is unauthorized.',
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

const delete_webhook = new OpenAPIHono()

delete_webhook.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

delete_webhook.openapi(route, async (context) => {
  const config = get_config(context.env)
  const request = await send_delete_webhook_request(config.BOT_TOKEN)

  return request
    ? context.json({ message: 'The Telegram webhook endpoint has been deleted!' } as const)
    : context.json({ error: 'Failed to delete the webhook!' } as const, 500)
})

export { delete_webhook }
