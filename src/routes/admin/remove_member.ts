import { is_member } from '@/kv'
import type { HonoContext } from '@/types'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const QuerySchema = z.object({
  user: z.string(),
})

const ResponseSchema = z.object({
  message: z.string(),
})

const ResponseErrorSchema = z.object({
  error: z.string(),
})

const route = createRoute({
  method: 'get',
  path: '/remove_member',
  request: { query: QuerySchema },
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
      description: 'The response when the Telegram webhook has failed to be set.',
    },
  },
})

export const remove_member = new OpenAPIHono<HonoContext>().openapi(route, async (context) => {
  const username = context.req.query('user') ?? ''
  const member = await is_member(context.env.telegroq, username)

  return member
    ? context.json({ message: `${username} has been removed from the list of members!` })
    : context.json({ error: `${username} is not found!` })
})
