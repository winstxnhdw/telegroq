import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import type { HonoContext } from '@/types'

const QuerySchema = z.object({
  user: z.string(),
})

const ResponseSchema = z.object({
  message: z.string(),
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
  },
})

export const remove_member = new OpenAPIHono<HonoContext>().openapi(route, async (context) => {
  const username = context.req.query('user') ?? ''
  const members = await context.env.telegroq.get('members', 'text')
  const new_members = members
    ?.split('\n')
    .filter((member) => member !== username)
    .join('\n')

  await context.env.telegroq.put('members', new_members ?? '')

  return context.json({ message: `${username} has been removed from the list of members!` }, 200)
})
