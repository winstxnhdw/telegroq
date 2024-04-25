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
            message: 'johnl33t has been removed from the list of members!',
          },
        },
      },
      description: 'The response when the member has been successfully removed.',
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
      description: 'The response when the member cannot be removed.',
    },
  },
})

export const remove_member = new OpenAPIHono<HonoContext>().openapi(route, async (context) => {
  const username = context.req.query('user') ?? ''
  const member = await is_member(context.env.telegroq, username)

  return member
    ? context.json({ message: `${username} has been removed from the list of members!` })
    : context.json({ error: `${username} is not found!` }, 500)
})
