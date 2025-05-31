import type { HonoContext } from '@/types'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const QuerySchema = z.object({
  user: z.string(),
})

const ResponseSchema = z.object({
  message: z.string(),
})

const route = createRoute({
  method: 'get',
  path: '/remove_admin',
  request: { query: QuerySchema },
  security: [{ Bearer: [] }],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ResponseSchema,
          example: {
            message: 'johnl33t has been removed from the list of admins!',
          },
        },
      },
      description: 'The response when the admin has been successfully removed.',
    },
    401: {
      content: {
        'text/plain': { schema: z.literal('Unauthorized') },
      },
      description: 'The response when the request is unauthorized.',
    },
  },
})

export const remove_admin = new OpenAPIHono<HonoContext>().openapi(route, async (context) => {
  const username = context.req.query('user') ?? ''
  const admins = await context.env.telegroq.get('admins', 'text')
  const new_admins = admins
    ?.split('\n')
    .filter((admin) => admin !== username)
    .join('\n')

  await context.env.telegroq.put('admins', new_admins ?? '')

  return context.json({ message: `${username} has been removed from the list of admins!` }, 200)
})
