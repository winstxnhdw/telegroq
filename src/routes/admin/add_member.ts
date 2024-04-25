import type { HonoContext } from '@/types'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const QuerySchema = z.object({
  user: z.string(),
})

const ResponseSchema = z.object({
  message: z.string(),
})

const ResponseErrorSchema = z.object({
  error: z.literal('Invalid username!'),
})

const route = createRoute({
  method: 'get',
  path: '/add_member',
  security: [{ Bearer: [] }],
  request: { query: QuerySchema },
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

export const add_member = new OpenAPIHono<HonoContext>().openapi(route, async (context) => {
  const username = context.req.query('user')

  if (!username) {
    return context.json({ error: 'Invalid username!' })
  }

  const members = await context.env.telegroq.get('members', 'text')
  context.env.telegroq.put('members', `${username}\n${members ?? ''}`)

  return context.json({ message: `Successfully added ${username} to the list of members!` })
})
