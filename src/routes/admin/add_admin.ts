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
  path: '/add_admin',
  security: [{ Bearer: [] }],
  request: { query: QuerySchema },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
          example: {
            message: 'Successfully added johnl33t to the list of admins!',
          },
        },
      },
      description: 'The response when a user has been successfully added.',
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
      description: 'The response when a user cannot be added.',
    },
  },
})

export const add_admin = new OpenAPIHono<HonoContext>().openapi(route, async (context) => {
  const username = context.req.query('user')

  if (!username) {
    return context.json({ error: 'Invalid username!' }, 500)
  }

  const admins = await context.env.telegroq.get('admins', 'text')
  await context.env.telegroq.put('admins', `${username}\n${admins ?? ''}`)

  return context.json({ message: `Successfully added ${username} to the list of admins!` })
})
